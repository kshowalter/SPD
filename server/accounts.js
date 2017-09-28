Accounts.onLogin(function(login){
  console.log('User login: ', login.user._id, login.user.emails[0].address );
});

Accounts.onCreateUser(function(options, user) {
  //console.log('user', user);
  //console.log('this', this);
  //console.log('Meteor.user()', Meteor.user() );

  ///*
  var user_id = user._id;
  var system_number = User_systems.find({user_id:user_id}).count() + 1;
  var system_id = Random.id();
  var new_system_info = {
    system_number: system_number,
    user_id: user_id,
    system_id: system_id,
    system_settings: {},
    svgs: [],
    geocode_info: {}
  };
  User_systems.insert(new_system_info);

  setup_new_system_data(system_id);

  user.active_system = system_id;

  //*/
  return user;
});
