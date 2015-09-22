load_data = function(){

  //http://10.173.64.204:8000/temporary/
  settings.config_options.NEC_tables = JSON.parse(Assets.getText('data/tables.json'));
  FSEC_database = JSON.parse(Assets.getText('data/fsec_copy.json'));

  settings.components = f.load_database(FSEC_database);


  FSEC_database = f.lowercase_properties(FSEC_database);

  //NEC_tables.remove({});

  for( var type in FSEC_database ){
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

};
