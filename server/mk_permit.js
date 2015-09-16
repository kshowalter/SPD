/**
 * Created by TCummings on 8/27/2015.
 */
var phantom = Meteor.npmRequire('phantom');
var fs = Meteor.npmRequire('fs');
var shelljs = Meteor.npmRequire('shelljs');
var pdfDirectory = process.env.PWD + '/private/.#pdf/';

permit = {

	/*****************************************************************************************************
	 * Creates a permit for the passed system_id and serves it back to the user as a PDF download
	 * @param {object} req - node http request object
	 * @param {object} res - node http response object
	 * @param {string} system_id - which system to generate a permit for
	 *****************************************************************************************************/
	download: function(req, res, system_id) {
		var host = req.headers.host;
		permit.createPDF("http://"+host+"/drawing/"+system_id+"/1", function(pdf1) {
			permit.createPDF("http://"+host+"/drawing/"+system_id+"/2", function(pdf2) {
				permit.createPDF("http://"+host+"/drawing/"+system_id+"/3", function(pdf3) {
					permit.createPDF("http://"+host+"/drawing/"+system_id+"/4", function(pdf4) {
						//TODO: Locate spec sheets
						/* , 'data_sheets/' +'Suniva Optimus 60 Black 2014 01 17.pdf', 'data_sheets/' +'specsheet-1-igplusadvanced-86819.pdf'*/
						permit.mergePDF([pdf1, pdf2, pdf3, pdf4 ], 'permit_' + system_id + (new Date()).valueOf() + '.pdf', function(pdf5) {
							permit.downloadPDF(res, pdf5);
						});
					});
				});
			});
		});
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

						if(callback) callback(pdfName);
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

		inputFiles.forEach(function(filename, i, inputFiles) { inputFiles[i] = pdfDirectory + inputFiles[i]; });

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