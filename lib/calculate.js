calculate = function(user_id){
  console.log('calculate, exterminate');

  values = User_data.find({}).fetch();

  var v = {};

  console.log( 'number of: ', User_data.find({}).count() );

  User_data.find({}).forEach(function(variable){
    v[variable.section_name] = v[variable.section_name] || {};
    v[variable.section_name][variable.value_name] = variable.value;
    //console.log('var', variable);
  });

  console.log('v', v);
  //f.cursor_to_object( User_data.find({}).fetch() )


  console.log('user_id', user_id);
  if( f.section_defined('location', user_id) ){
    console.log('defined: ', 'location');
  }







};
