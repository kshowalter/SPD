update = function(){
  // This is the counterpart of 'mk_drawing' on the server

  var state = settings.state;
  //console.log('current settings:', settings);
  console.log('current state:', state);

  if( Meteor.user() && Meteor.user().active_system ){
    var active_system = Meteor.user().active_system;
    state.status.active_system = active_system;
    console.log('...updating active system: ', active_system);
  } else {
    console.log('...nothing to update yet...');
  }

  if( active_system){
    System_data.find({system_id: active_system}).forEach(function(input_doc){
      state.system[input_doc.section_name] = state.system[input_doc.section_name] || {};
      state.system[input_doc.section_name][input_doc.value_name] = input_doc.value;
    });

    state.webpage.selected_modules = User_systems.findOne({system_id: active_system}).selected_modules ||
      state.webpage.selected_modules;

    f.request_geocode();

    Meteor.call('get_location_information', state.system, function(err, returned){
      console.log('location returned: ', returned);
    });




    settings = process_system(settings);






    Meteor.call('save_system_settings', state.system, function(err, returned){
      //console.log('returned: ', returned);
    });

    settings = update_webpage(settings);
  }
};
