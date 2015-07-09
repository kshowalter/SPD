
setup_user_data = function(user_id){
  console.log( Meteor.users.findOne({ _id:user_id }) );

  Inputs.find({type:'user'}).forEach(function(doc){
    var user_data_document = User_data.findOne({
      user_id: user_id,
      section_name: doc.section_name,
      value_name: doc.value_name,
    });
    if( ! user_data_document ){
      doc.user_id = user_id;
      User_data.insert(doc);
    }
  });
};



Accounts.onLogin(function(login){
  console.log('User login: ', login.user._id, login.user.emails[0].address );
  setup_user_data(login.user._id);
});
