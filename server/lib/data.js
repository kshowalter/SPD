//data = {
//	oracleConnection: null,
//
//	oracleQuery: function(query, /* Optional */ binds, callback) {
//		/* When binds isn't passed. */
//		if (arguments.length < 3) data._oracleQuery(query, [], binds);
//		data._oracleQuery(query, binds, callback);
//	},
//
//	_oracleQuery: function(query, binds, _callback) {
//
//		console.log(1, _callback);
//		var cb = function(err, result) {
//			if (err) console.error(err.message);
//			console.log(2, _callback);
//			_callback(err, result);
//		};
//
//		data.oracleConnection.execute(query, binds, cb);
//
//	},
//	getComponents: function(callback) {
//		data.oracleQuery("select * from plans_machine.modules2", function(err, modules) {
//			data.oracleQuery("select * from plans_machine.inverters2", function(err, inverters) {
//				console.log("getComponents(%s, %s)", modules.rows.length, inverters.rows.length);
//				callback(err, {modules: modules.rows, inverters: inverters.rows});
//			});
//		});
//	},
//	getTables: function() {
//		return JSON.parse(Assets.getText('data/tables.json'));
//	}
//}








//load_data = function(){
//
//
//
//	//settings.config_options.NEC_tables = JSON.parse(Assets.getText('data/tables.json'));
//
//
//
//
//	////FSEC_database = f.lowercase_properties(FSEC_database);
//	//
//	////NEC_tables.remove({});
//	//
//	//
//	//
//	//var oracledb =  Meteor.npmRequire('oracledb');
//	//oracledb.outFormat = oracledb.OBJECT;
//	//oracledb.getConnection(
//	//{
//	//	user          : "spd",
//	//	password      : "inb444cert",
//	//	connectString : "oraquest.fsec.ucf.edu:1530/FS10QP"
//	//},
//	//Meteor.bindEnvironment(function(err, connection)
//	//{
//	//	if (err) { console.error(err.message); return; }
//	//
//	//	connection.execute(
//	//	"select * from plans_machine.modules2",
//	//	[],  // no bind variables
//	//	Meteor.bindEnvironment(function(err, modules)
//	//	{
//	//		if (err) { console.error(err.message); return; }
//	//
//	//		connection.execute(
//	//		"select * from plans_machine.inverters2",
//	//		[],  // no bind variables
//	//		Meteor.bindEnvironment(function(err, inverters)
//	//		{
//	//			if (err) { console.error(err.message); return; }
//	//			FSEC_database = { modules: modules.rows, inverters: inverters.rows };
//	//			settings.components = f.load_database(FSEC_database);
//	//			FSEC_database = f.lowercase_properties(FSEC_database);
//	//
//	//			//console.log("FSEC_database:", FSEC_database);
//	//			//console.log("FSEC_database2:", FSEC_database2);
//	//
//	//			for( var type in FSEC_database ){
//	//				for( var component_name in FSEC_database[type] ){
//	//					var component = FSEC_database[type][component_name];
//	//					component.type = type;
//	//					PV_Components.upsert(component,component);
//	//				}
//	//
//	//			}
//	//
//	//			for( var name in settings.config_options.NEC_tables){
//	//
//	//				var table = settings.config_options.NEC_tables[name];
//	//				NEC_tables.upsert(
//	//						{name: name},
//	//						{
//	//							name: name,
//	//							table: table,
//	//						}
//	//				);
//	//			}
//	//
//	//			settings = mk_inputs(settings);
//	//
//	//			Inputs.remove({});
//	//			for( var section_name in settings.inputs ){
//	//				for( var value_name in settings.inputs[section_name]){
//	//					var input = settings.inputs[section_name][value_name];
//	//					Inputs.insert(input);
//	//				}
//	//			}
//	//
//	//		}));
//	//
//	//	}));
//	//}));
//
//};



load_data = function(){



	/******************************************************************************************
	 * Grab Module & Inverter Data
	 ******************************************************************************************/
	//FSEC_database = JSON.parse(Assets.getText('data/fsec_copy.json'));

	var oracledb =  Meteor.npmRequire('oracledb');
	oracledb.outFormat = oracledb.OBJECT;
	var getConnection = Meteor.wrapAsync(oracledb.getConnection);
	console.log(getConnection);
	var connection_string = JSON.parse(Assets.getText('sensitive_data/db_connection.json'));
	oracledb.getConnection(connection_string, Meteor.bindEnvironment(function(err, connection)
		{
			if (err) { console.error(err.message); return; }

			connection.execute(
			"select * from plans_machine.modules2",
			[],  // no bind variables
			Meteor.bindEnvironment(function(err, modules)
			{
				if (err) { console.error(err.message); return; }

				connection.execute(
				"select * from plans_machine.inverters2",
				[],  // no bind variables
				Meteor.bindEnvironment(function(err, inverters)
				{
					if (err) { console.error(err.message); return; }
					FSEC_database = { modules: modules.rows, inverters: inverters.rows };

					console.log("[Loading FSEC_database] modules: %s, inverters: %s", FSEC_database.modules.length, FSEC_database.inverters.length);

					settings.config_options.NEC_tables = JSON.parse(Assets.getText('data/tables.json'));

					settings.components = f.load_database(FSEC_database);
					FSEC_database = f.lowercase_properties(FSEC_database);

					for( var type in FSEC_database )
					{
						for( var component_name in FSEC_database[type] ){
							var component = FSEC_database[type][component_name];
							component.type = type;
							PV_Components.upsert(component,component);
						}
					}

					for( var name in settings.config_options.NEC_tables){

						var table = settings.config_options.NEC_tables[name];
						NEC_tables.upsert(
								{name: name},
								{
									name: name,
									table: table,
								}
						);
					}

					settings = mk_inputs(settings);

					Inputs.remove({});
					for( var section_name in settings.inputs ){
						for( var value_name in settings.inputs[section_name]){
							var input = settings.inputs[section_name][value_name];
							Inputs.insert(input);
						}
					}
				}));

			}));
		})
	);


};
