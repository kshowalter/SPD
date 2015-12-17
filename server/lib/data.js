



load_data = function(){

  processData(JSON.parse(Assets.getText('data/fsec_copy.json')), JSON.parse(Assets.getText('data/tables.json')))
  return;

  /******************************************************************************************
   * Grab Module & Inverter Data
   ******************************************************************************************/

  var oracledb =  Meteor.npmRequire('oracledb');
  oracledb.outFormat = oracledb.OBJECT;  //format of result as an object instead of an array

  // Username, Password, and URL of the database are stored in separate file.
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
          var FSEC_database = { modules: modules.rows, inverters: inverters.rows };

          processData(FSEC_database, JSON.parse(Assets.getText('data/tables.json')))

        }));

      }));
    })
  );


};

processData = function(FSEC_database, tables) {

  console.log("[Loading FSEC_database] modules: %s, inverters: %s", FSEC_database.modules.length, FSEC_database.inverters.length);
  settings.config_options.NEC_tables = tables;

  settings.components = f.load_database(FSEC_database);
  FSEC_database = f.lowercase_properties(FSEC_database);
  for( var type in FSEC_database ){
    for( var component_name in FSEC_database[type] ){
      var component = FSEC_database[type][component_name];
      component.type = type;
      if( component['spec_sheet'] ) {
        PV_Components.upsert(component,component);
      }
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
}
