
setup_user_data = function(user_id){
  console.log('updating user data from inputs');
  //console.log( Meteor.users.findOne({ _id:user_id }) );

  var user_settings = mk_settings();
  user_settings.f = f;

  user_settings = mk_section_info(user_settings);

  //Meteor.users.update(
  //  {_id:user_id},
  //  {$set: {settings: user_settings}}
  //);

  User_data.remove({user_id: user_id});

  Inputs.find({type:'user'}).forEach(function(doc){

    var user_data_document = User_data.findOne({
      user_id: user_id,
      section_name: doc.section_name,
      value_name: doc.value_name,
    });
    if( user_data_document ){
      var user_value = user_data_document.value;

    }

    var local_doc = {};
    for( var name in doc ){
      if( name !== '_id'){
        local_doc[name] = doc[name];
      }
    }
    local_doc.user_id = user_id;


    User_data.insert(local_doc);


    if( user_value ){
      console.log('setting old value', user_value);
      User_data.update(
        {section_name: doc.section_name, value_name: doc.value_name},
        {$set: {value:user_value}}
      );
    }




    //if( ! user_data_document ){
    //  doc.user_id = user_id;
    //  User_data.upsert(doc);
    //}
    //local_doc.user_id = user_id;
    //local_doc._id = undefined;
    //if( user_data_document ){
    //  local_doc.value = user_data_document.value;
    //}

    //User_data.update(
    //  {section_name: doc.section_name, value_name: doc.value_name},
    //  {$set: local_doc}
    //);

  });
};



Accounts.onLogin(function(login){
  console.log('User login: ', login.user._id, login.user.emails[0].address );
  setup_user_data(login.user._id);
});
