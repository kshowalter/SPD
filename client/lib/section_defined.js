section_defined = function(section_name, user_id){
  //console.log('checking...' );
  if(Meteor.isClient){
    user_id = Meteor.userId();
  }

  if( typeof user_id === 'string' ){
    var defined = true;
    //console.log('user_id', typeof user_id, user_id);
    //console.log('/checking: ', section_name, ', for user: ', user_id);
    //console.log(User_data.find({section_name:section_name}).fetch());
    User_data.find({section_name:section_name}).forEach(function(doc){
      //console.log('    -', doc);
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
