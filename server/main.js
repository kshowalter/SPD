fs = Npm.require('fs');
path = Npm.require('path');

var jsdom = Meteor.npmRequire("jsdom").jsdom;
document = jsdom();

wkhtmltopdf = Meteor.npmRequire("wkhtmltopdf");
PDFMerge = Meteor.npmRequire('pdf-merge');


Meteor.startup(function () {
	//// code to run on server at startup
	Settings.remove({});
	NEC_tables.remove({});
	PV_Components.remove({});

	load_data();

});
