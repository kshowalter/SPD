section_defined = function(section_name, active_system){
  //console.log('checking...' );
  if(Meteor.isClient){
    active_system = Meteor.user().active_system;
  }

  if( typeof active_system === 'string' ){
    var defined = true;
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
