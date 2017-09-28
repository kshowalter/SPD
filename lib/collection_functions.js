getSection = function(section_name){
  var active_system = Meteor.users.findOne({_id:Meteor.userId()}).active_system;
  return System_data.find({ system_id:active_system, section_name:section_name });
};

getValue = function(section_name, value_name){
  var active_system = Meteor.users.findOne({_id:Meteor.userId()}).active_system;
  var input = System_data.findOne({ system_id:active_system, section_name:section_name, value_name:value_name });
  if( input ){
    return input.value;
  } else {
    return false;
  }
};

setValue = function(section_name, value_name, new_value){
  var active_system = Meteor.users.findOne({_id:Meteor.userId()}).active_system;
  return System_data.update(
    { system_id:active_system, section_name:section_name, value_name:value_name },
    { $set:{
      value: new_value,
    }}
  );
};

setOptions = function(section_name, value_name, new_options){
  var active_system = Meteor.users.findOne({_id:Meteor.userId()}).active_system;
  var id = System_data.findOne( { system_id:active_system, section_name:section_name, value_name:value_name })._id;
  return System_data.update(
    id,
    {$set:{
      options: new_options,
    }}
  );
};


getSetting = function(id){
  return Settings.findOne({id:id}).value;
};

setSetting = function(id, new_value){
  return Settings.upsert(
    {id:id},
    {
      id:id,
      value: new_value,
    }
  );
};
