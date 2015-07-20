server_check = function(message){
  console.log('server_check: ', message);
  Meteor.call('just_checking_in', message, function(error, returned){
    console.log('server says: ', error, returned );
  });
};
