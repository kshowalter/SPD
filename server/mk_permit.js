/**
 * Created by TCummings on 8/27/2015.
 */
var phantom = Meteor.npmRequire('phantom');
var fs = Meteor.npmRequire('fs');
var shelljs = Meteor.npmRequire('shelljs');
var _ = Meteor.npmRequire("lodash");
var pdfDirectory = process.env.PWD + '/private/.#pdf/';
var specSheetDirectory = process.env.PWD + '/private/.#specsheet/';

permit = {

	/*****************************************************************************************************
	 * Creates a permit for the passed system_id and serves it back to the user as a PDF download
	 * @param {object} req - node http request object
	 * @param {object} res - node http response object
	 * @param {string} system_id - which system to generate a permit for
	 *****************************************************************************************************/
	download: function(req, res, system_id) {
		var host = req.headers.host;

		// We need the Make/Model to look up the spec sheets
		var moduleModel   = System_data.findOne({ system_id:system_id, section_name:"array",   value_name:"module_model" }).value;
		var moduleMake    = System_data.findOne({ system_id:system_id, section_name:"array",   value_name:"module_make"  }).value;
		var inverterModel = System_data.findOne({ system_id:system_id, section_name:"inverter", value_name:"inverter_model" }).value;
		var inverterMake  = System_data.findOne({ system_id:system_id, section_name:"inverter", value_name:"inverter_make"  }).value;

		// Here we search through the module/inverter data to find the module/inverter that are part of this system
		var db = JSON.parse(Assets.getText('data/fsec_copy.json'));  //TODO: How do we look up the spec sheet file name without reloading this?

		var module   = _.find(db.modules,   {'MAKE':moduleMake,   'MODEL':moduleModel  } );
		var inverter = _.find(db.inverters, {'MAKE':inverterMake, 'MODEL':inverterModel} );

		//We have the file names for the spec sheets
		var spec_sheets = [];
		if(module && module.SPEC_SHEET) spec_sheets.push(module.SPEC_SHEET);
		if(inverter && inverter.SPEC_SHEET) spec_sheets.push(inverter.SPEC_SHEET);
		spec_sheets.push("ICC_Structural_Detail.pdf");

		//Add spec sheet directory, and make sure the extension is ".pdf"
		for(var n=0; n<spec_sheets.length; n++)
		{
			spec_sheets[n] = specSheetDirectory + spec_sheets[n];
			if(!/[.]pdf$/i.test(spec_sheets[n])) spec_sheets[n] = spec_sheets[n] + ".pdf";
			//console.log("SPEC SHEET " + n + " IS THIS >>>> " + spec_sheets[n]);
		}
		
		//Create the permit PDF, and send it to the user
		// ---------------------------------------------------------------
		
		// This is a list of known svgs that we need to convert to PDFs
		// This list can be generated dynamically beforehand and passed to here,
		// or the createAndMergePDFs function can be modified to dynamically iterate through some array of svgs if needed.
		var svgPDFs = ["http://"+host+"/drawing/"+system_id+"/1",
						"http://"+host+"/drawing/"+system_id+"/2",
						"http://"+host+"/drawing/"+system_id+"/3",
						"http://"+host+"/drawing/"+system_id+"/4",
						"http://"+host+"/drawing/"+system_id+"/5"];
		
		var outputPDFs = []; // The array that will contain all of the PDFs in their full path for merging later
		
		// This function will iterate through the svgPDFs array with 0 being the starting value
		// and the length of the array (eg: 5)
		// Once there are no more svgPDFs, it'll merge the full path of created PDFs
		// with the full list of specsheet pdfs
		// Then it will take that merged array, and actually perform a PDF file merger of those PDF files.
		function createAndMergePDFs(outputPDFs,curCounter,maxTotal)
		{
			if((maxTotal-1)-curCounter >= 0)
			{
				permit.createPDF(svgPDFs[curCounter], function(pdf_full)
				{
					outputPDFs.push(pdf_full);
					console.log("Adding: " + pdf_full);
					if((maxTotal-1)-curCounter > 0)
					{
						createAndMergePDFs(outputPDFs, curCounter+1,maxTotal);
					}
					else if((maxTotal-1)-curCounter == 0)
					{
						console.log("Merging...");
						outputPDFs.push.apply(outputPDFs, spec_sheets);
						permit.mergePDF(outputPDFs, 'permit_' + system_id + (new Date()).valueOf() + '.pdf', function(pdf6) 
						{
							permit.downloadPDF(res, pdf6);
						});
					}
				});
			}
			
		}
		
		getPDFs(outputPDFs, 0, svgPDFs.length);
		
	},

	/*****************************************************************************************************
	 * Renders the passed url using phantomjs and creates a PDF file
	 * @param {string} url -  URL to render
	 * @param {function} callback - called with the name of the newly created PDF file
	 *****************************************************************************************************/
	createPDF: function(url, callback) {
		var planNumber = (new Date()).valueOf();
		var pdfName = 'permit_'+planNumber+'.pdf';
		console.log("createPDF(%s) %s", pdfName, url);

		phantom.create(function (ph) {
			ph.createPage(function (page) {
				page.set('viewportSize', {width:2011,height:1554});
				page.paperSize = {
					width: '8.5in',
					height: '11in'
				};

				page.open(url, function (status) {
					console.log("createPDF() FileName: %s", pdfDirectory + pdfName);

					page.render(pdfDirectory + pdfName, function() {
						console.log('PDF File Created: ' + pdfName);
						ph.exit();

						if(callback) callback(pdfDirectory+pdfName);
					});
				});
			});
		});
	},

	/*****************************************************************************************************
	 * Sends the local PDF file to the user
	 * @param {object} res - node http response object
	 * @param {string} pdfName - filename of pdf (without directory)
	 *****************************************************************************************************/
	downloadPDF: function(res, pdfName) {
		var filePath = pdfDirectory + pdfName;
		var stat = fs.statSync(filePath);

		res.writeHead(200, {
			'Content-Type': 'application/pdf',
			'Content-Length': stat.size
		});

		fs.createReadStream(filePath).pipe(res);
	},

	/*****************************************************************************************************
	 * Takes a list of PDF files and merges them together to make one PDF.
	 * @param {string[]} inputFiles - array of pdf file names to merge together, file names do not contain directory
	 * @param {string} outputFile - name of pdf to create
	 * @param {function} callback - called with name of newly created PDF
	 *****************************************************************************************************/
	mergePDF: function(inputFiles, outputFile, callback)
	{

		var options = {silent: true, async: this.async};
		var command = 'gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile=' + pdfDirectory + outputFile + " \'" + inputFiles.join("\' \'") + "\'";

		console.log("Command: %s", command);
		shelljs.exec(command, options, function (code, output) {
			//TODO: Check for error

			if(callback) callback(outputFile);  //pass result back to user supplied callback function
		});

	},

	/*****************************************************************************************************
	 * Renders the page at http://windspeed.atcouncil.org which contains the wind speed data.  It then
	 * runs a few javascript commands to grab the wind data.
	 * @param {number} latitude - location value to be used on the atcouncil site to look up wind speed
	 * @param {number} longitude - location value to be used on the atcouncil site to look up wind speed
	 * @param {function} callback - called with wind data grabbed from the atcouncil site
	 *****************************************************************************************************/
	getWind: function(latitude, longitude, callback) {
		var url = "http://windspeed.atcouncil.org/domains/atcwindspeed/process/?zoom=4&maptype=roadmap&dec=1&latt="+latitude+"&longt="+longitude;
		phantom.create(function (ph) {
			ph.createPage(function (page) {

				page.open(url, function (status) {
					console.log("getWind(): Opening %s: %s", url, status);

					page.evaluate(function()
					{
						return {
							risk_category1: parseInt(jQuery("b:contains('Risk Category I:')")[0].nextSibling.textContent),
							risk_category2: parseInt(jQuery("b:contains('Risk Category II:')")[0].nextSibling.textContent),
							risk_category3: parseInt(jQuery("b:contains('Risk Category III-IV:')")[0].nextSibling.textContent)
						};
					}, function(result) {
						console.log('Result: ' + result);
						ph.exit();

						if(callback) callback(result);
					});
				});
			});
		});
	}

};
