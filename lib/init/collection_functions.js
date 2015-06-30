getSection = function(section_name){
  return Values.find({ section_name:section_name });
};

getValue = function(section_name, name){
  return Values.findOne({ section_name:section_name, value_name:name }).value;
};

setValue = function(section_name, value_name, new_value){
  return Values.upsert(
    { section_name:section_name, value_name:value_name },
    { section_name:section_name,
      value_name:value_name,
      value: new_value,
    }
  );
};

setOptions = function(section_name, value_name, new_options){
  return Values.update(
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
