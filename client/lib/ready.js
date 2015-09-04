var mk_ready = function(names, callback){
  var list = {};
  names.forEach(function(name){
    list[name] = false;
  });
  var ready = false;

  return function(name){
    //console.log('name:', name);
    list[name] = true;
    for( name in list){
      if( list[name] === false ){
        return false;
      }
    }
    //console.log('ready!!!!!', list);
    callback();
    return true;
  };

};

var ready_callback = function(){
  console.log('ready!');
  //update();
  Meteor.setTimeout(function(){
    console.log('unnecessary update');
    update();
    setup_webpage();
  }, 2000);
};


ready = mk_ready(
  ['main', 'system_data', 'user_systems', 'pv_components', 'settings', 'users', 'login'],
  ready_callback
);
