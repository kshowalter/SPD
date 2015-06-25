getSection = function(section_name){
  return Values.find({ section_name:section_name });
};

getValue = function(section_name, name){
  return Values.findOne({ section_name:section_name, value_name:name }).value;
};

setValue = function(section_name, value_name, new_value){
  return Values.update(
    { section_name:section_name, value_name:value_name },
    {$set:{
      value: new_value,
    }}
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
