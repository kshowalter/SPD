getSection = function(section_name){
  return User_data.find({ section_name:section_name });
};

getValue = function(section_name, name){
  return User_data.findOne({ section_name:section_name, value_name:name }).value;
};

setValue = function(section_name, value_name, new_value){
  return User_data.upsert(
    { section_name:section_name, value_name:value_name },
    { section_name:section_name,
      value_name:value_name,
      value: new_value,
    }
  );
};

setOptions = function(section_name, value_name, new_options){
  //console.log(section_name, value_name, new_options);
  return User_data.update(
    { section_name:section_name, value_name:value_name },
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
