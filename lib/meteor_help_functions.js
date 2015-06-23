getSetting = function(id){
  return Settings.findOne({id:id}).value;
};
/*
setSetting = function(id){
  return Settings.findOne({id:id}).value;
};
//*/
