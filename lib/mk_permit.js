/**
 * Created by TCummings on 8/27/2015.
 */
var phantom = Meteor.npmRequire('phantom');
var fs = Meteor.npmRequire('fs');
var shelljs = Meteor.npmRequire('shelljs');
var pdfDirectory = process.env.PWD + '/private/.#pdf/';

permit = {

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
					console.log("createPDF(): Opening %s: %s", url, url, status);
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

	downloadPDF: function(res, pdfName) {
		var filePath = pdfDirectory + pdfName;
		var stat = fs.statSync(filePath);

		res.writeHead(200, {
			'Content-Type': 'application/pdf',
			'Content-Length': stat.size
		});

		fs.createReadStream(filePath).pipe(res);
	},

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

	}
};