var model_from_make = function(system_id, section_name){
  var make = System_data.findOne({ system_id:system_id, section_name:section_name, value_name:'make' }).value;
  new_options = _.uniq(
    PV_Components.find({
      type: section_name+"s",
      make:make,
    }).map(function(doc){return doc.model;}
  ));
  //console.log('new_options for - '+make+': ', new_options);
  var module_model_id = System_data.findOne( { system_id:system_id, section_name:section_name, value_name:'model'} )._id;
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

  if(section_name === 'module' && value_name === 'make'){
    model_from_make(system_id, section_name);
  } else if (section_name === 'inverter' && value_name === 'make') {
    model_from_make(system_id, section_name);
  } else if (section_name === 'attachment_system' && value_name === 'make') {
    //model_from_make(section_name, user_id);
  } else if (section_name === 'AC' && value_name === 'loadcenter_type') {
    var loadcenter_type = System_data.findOne({ system_id:system_id, section_name:section_name, value_name:value_name }).value;
    new_options = settings.data.opt.AC.loadcenter[loadcenter_type];
    id = System_data.findOne( { system_id:system_id, section_name:section_name, value_name:'voltage' })._id;
    return System_data.update(
      id,
      {$set:{
        options: new_options,
      }}
    );
  }
};
