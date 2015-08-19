var mk_ready = function(names){
  var list = {};
  names.forEach(function(name){
    list[name] = false;
  });
  var ready = false;

  return function(name){
    list[name] = true;
    for( name in list){
      if( list[name] === false ){
        return false;
      }
    }
    console.log('ready!!!!!', list);
    return true;
  };

};

ready = mk_ready(['main', 'system_data', 'user_systems', 'components', 'settings', 'users']);
