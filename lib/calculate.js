calculate = function(user_id){
  console.log('calculate, exterminate');

  values = User_data.find({}).fetch();
  var v = {};
  User_data.find({}).forEach(function(variable){
    v[variable.section_name] = v[variable.section_name] || {};
    v[variable.section_name][variable.value_name] = variable.value;
  });
// user data loaded into variable "v"
//////////////////////////////////////////////////////

/*
  console.log('user_id', user_id);
  if( f.section_defined('location', user_id) ){
    console.log('defined: ', 'location');
  } else {
    console.log('not defined: ', 'location');
  }

  if( f.section_defined('module', user_id) ){
    console.log('defined: ', 'module');
  } else {
    console.log('not defined: ', 'module');
  }
//*/






//////////////////////////////////////////////////////
  // return values to collection database

  Meteor.call('update_user_data', function(err){
    console.log('called update_user_data');
    if(err) console.log('error: ', err);
  });

};
