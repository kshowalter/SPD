setup_new_system_data = function(system_id){
  console.log('Creating new system: ', system_id);

  var settings = mk_inputs();
  var inputs = settings.state.inputs;
  console.log(typeof inputs);

  for( var section_name in inputs){
    for( var input_name in inputs[section_name]){
      var doc = inputs[section_name][input_name];
      //console.log(doc);

      //var user_value = the_user_data[doc.section_name][doc.value_name];
      var local_doc = {};
      for( var name in doc ){
        if( name !== '_id'){
          local_doc[name] = doc[name];
        }
      }
      local_doc.system_id = system_id;
      System_data.insert(local_doc);
    }
  }

  System_data.find({system_id:system_id}).forEach(function(doc){
    update_options( system_id, doc.section_name, doc.value_name );
  });


};
