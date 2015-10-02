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

	//
	//data = {
	//	oracleConnection: null,
	//
	//	oracleQuery: function(query, /* Optional */ binds, callback) {
	//		console.log("oracleQuery(%s, %s, %s)", typeof query, typeof binds, typeof callback);
	//		/* When binds isn't passed. */
	//		if (arguments.length < 3) data._oracleQuery(query, [], binds);
	//		data._oracleQuery(query, binds, callback);
	//	},
	//
	//	_oracleQuery: function(query, binds, callback) {
	//		console.log("_oracleQuery(%s, %s, %s)", typeof query, typeof binds, typeof callback);
	//		console.log(1, callback);
	//		var cb = function(err, result) {
	//			if (err) console.error(err.message);
	//			console.log(2, callback);
	//			if(err) callback(err, result);
	//			else callback(null, result);
	//		};
	//
	//		data.oracleConnection.execute(query, binds, cb);
	//
	//	},
	//	getComponents: function(callback) {
	//		data.oracleQuery("select * from plans_machine.modules2", function(err, modules) {
	//			//data.oracleQuery("select * from plans_machine.inverters2", function(err, inverters) {
	//				console.log("getComponents(%s, %s)", modules.rows.length/*, inverters.rows.length*/);
	//				callback(err, {modules: modules.rows/*, inverters.rows.length*/});
	//			//});
	//		});
	//	},
	//	getTables: function() {
	//		return JSON.parse(Assets.getText('data/tables.json'));
	//	}
	//}
	//
	//oracledb = Meteor.npmRequire('oracledb');
	//
	//oracledb.outFormat = oracledb.OBJECT;
	//var connection_info = {
	//	user          : "spd",
	//	password      : "inb444cert",
	//	connectString : "oraquest.fsec.ucf.edu:1530/FS10QP"
	//};
	//
	//oracledb.getConnection(connection_info, function(err, connection){ data.oracleConnection = connection;});
	//
	//
	//Meteor.setTimeout(function(){
	//	settings.config_options.NEC_tables = data.getTables();
	//
	//	for( var name in settings.config_options.NEC_tables){
	//		var table = settings.config_options.NEC_tables[name];
	//		NEC_tables.upsert(
	//				{name: name},
	//				{
	//					name: name,
	//					table: table
	//				}
	//		);
	//	}
	//
	//	//FSEC_database = JSON.parse(Assets.getText('data/fsec_copy2.json'));
	//
	//	data.getComponents(function(err, components) {
	//		FSEC_database = components;
	//		settings.components = f.load_database(FSEC_database);
	//		FSEC_database = f.lowercase_properties(FSEC_database);
	//
	//		//console.log("FSEC_database:", FSEC_database);
	//
	//		for( var type in FSEC_database ){
	//			for( var component_name in FSEC_database[type] ){
	//				var component = FSEC_database[type][component_name];
	//				component.type = type;
	//				PV_Components.upsert(component,component);
	//			}
	//		}
	//
	//		settings = mk_inputs(settings);
	//
	//		Inputs.remove({});
	//		for( var section_name in settings.inputs ){
	//			for( var value_name in settings.inputs[section_name]){
	//				var input = settings.inputs[section_name][value_name];
	//				Inputs.insert(input);
	//			}
	//		}
	//	});
	//}, 5000);

});



	//permit.connectDB();


  //var jsdom = Meteor.npmRequire('moment');

  //var window = document.defaultView;
  //var div = document.createElement('div');
  //document.body.appendChild(div);
  //console.log('body: ', document.body.innerHTML);


  /*
    if(dev) {
      for( var section_name in settings.user_input ){
        for( var value_name in settings.user_input[section_name] ){
          //console.log( section_name, value_name, settings.user_input[section_name][value_name] );
          var new_value = settings.user_input[section_name][value_name];
          setValue( section_name, value_name, new_value );
        }
      }
    }
  //*/


  //f.process(settings);

  //Inputs.find({type:"user"}).observe({
  //  changed: function(dic){
  //    console.log("something changed, recalculating");
  //    f.process(settings);
  //  }
  //});


//  var server_ready = true;
//
//
//
//
//
//});
