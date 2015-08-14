setup_new_system_data = function(system_id){
  //console.log('updating user data from inputs', Tracker.active);
  //console.log( Meteor.users.findOne({ _id:user_id }) );


  var system_settings = mk_settings();
  system_settings.f = f;
  system_settings = mk_section_info(system_settings);

  //var active_system = Meteor.users.findOne({_id:user_id}).active_system;

  //System_data.remove({user_id: user_id});

  Inputs.find({type:'user'}).forEach(function(doc){
    //var user_value = the_user_data[doc.section_name][doc.value_name];
    var local_doc = {};
    for( var name in doc ){
      if( name !== '_id'){
        local_doc[name] = doc[name];
      }
    }
    local_doc.system_id = system_id;
    console.log(local_doc)
    System_data.insert(local_doc);
  });

  System_data.find({}).forEach(function(doc){
    update_options( system_id, doc.section_name, doc.value_name );
  });


};
