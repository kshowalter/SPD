Accounts.onLogin(function(login){
  console.log('User login: ', login.user._id, login.user.emails[0].address );
});
