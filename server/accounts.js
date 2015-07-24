
setup_user_data = function(user_id){
  //console.log('updating user data from inputs', Tracker.active);
  //console.log( Meteor.users.findOne({ _id:user_id }) );


  var user_settings = mk_settings();
  user_settings.f = f;
  user_settings = mk_section_info(user_settings);

  //Meteor.users.update(
  //  {_id:user_id},
  //  {$set: {settings: user_settings}}
  //);

  the_user_data = {};
  User_data.find({}).forEach(function(doc){
    the_user_data[doc.section_name] = the_user_data[doc.section_name] || {};
    the_user_data[doc.section_name][doc.value_name] = doc.value;
  });

  User_data.remove({user_id: user_id});

  Inputs.find({type:'user'}).forEach(function(doc){
    var user_value = the_user_data[doc.section_name][doc.value_name];
    var local_doc = {};
    for( var name in doc ){
      if( name !== '_id'){
        local_doc[name] = doc[name];
      }
    }
    local_doc.user_id = user_id;
    User_data.insert(local_doc);
    if( user_value ){
      //console.log('setting old value', user_value);
      User_data.update(
        {section_name: doc.section_name, value_name: doc.value_name},
        {$set: {value:user_value}}
      );
    }
  });
  User_data.find({}).forEach(function(doc){
    update_options( doc.section_name, doc.value_name, user_id );
  });
  //*/
};



Accounts.onLogin(function(login){
  console.log('User login: ', login.user._id, login.user.emails[0].address );
  setup_user_data(login.user._id);
});
