var model_from_make = function(system_id, section_name){
  new_options = _.uniq(
    Components.find({
      type: section_name+"s",
      make:getValue(section_name, 'make')
    }).map(function(doc){return doc.model;}
  ));
  module_model_id = System_data.findOne( { system_id:system_id, section_name:section_name, value_name:'model'} )._id;
  System_data.update(
    module_model_id,
    {$set:{
      options: new_options
    }}
  );
  //Reset module selection;
  System_data.update(
    module_model_id,
    {$set:{
      value: new_options[0]
    }}
  );
};


update_options = function( system_id, section_name, value_name){
  var new_options;
  var id;
  var confirm;

  var module_model_id;


  if(section_name === 'module' && value_name === 'make'){
    model_from_make(system_id, section_name);
  } else if (section_name === 'inverter' && value_name === 'make') {
    model_from_make(system_id, section_name);
  } else if (section_name === 'attachment_system' && value_name === 'make') {
    //model_from_make(section_name, user_id);
  }


};
