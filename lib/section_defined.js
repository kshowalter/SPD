section_defined = function(system_id, section_name){
  //console.log('checking...' );

  var active_system;
  if(Meteor.isClient){
    active_system = Meteor.user().active_system;
  }
  if(Meteor.isServer){
    //active_system = settings.state.active_system;
    active_system = system_id;
  }

  //console.log('section_name: ', section_name)

  var defined = false;
  if( typeof active_system === 'string' ){
    defined = true;
    //console.log('user_id', typeof user_id, user_id);
    //console.log('/checking: ', section_name, ', for user: ', user_id);
    //console.log(System_data.find({section_name:section_name}).fetch());
    System_data.find({ system_id:active_system, section_name:section_name}).forEach(function(doc){
      if( ! doc.value ) {
        defined = false;
        return;
      }
    });
  } else {
    defined = false;
  }
  //console.log('\\done checking: ', section_name);
  return defined;
};

defined = section_defined;
