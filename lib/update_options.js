var model_from_make = function(system_id, section_name, value_type){

  var make_value_name = value_type+'_make';
  var model_value_name = value_type+'_model';

  var make = System_data.findOne({ system_id:system_id, section_name:section_name, value_name:make_value_name }).value;
  //console.log('new_options for - '+make+': ', new_options);
  var model_id = System_data.findOne( { system_id:system_id, section_name:section_name, value_name:model_value_name} )._id;

  new_options = _.uniq(
    PV_Components.find({
      type: value_type+'s',
      make:make,
    }).map(function(doc){return doc.model;}
  ));
  //console.log('-', new_options);
  System_data.update(
    model_id,
    {$set:{
      options: new_options
    }}
  );

  //Reset module selection;
  System_data.update(
    model_id,
    {$set:{
      value: new_options[0]
    }}
  );
};




update_options = function( system_id, section_name, value_name){
  var new_options;
  var id;
  var confirm;

  if(section_name === 'array' && value_name === 'module_make'){
    model_from_make(system_id, section_name, 'module');
  } else if (section_name === 'inverter' && value_name === 'inverter_make') {
    model_from_make(system_id, section_name, 'inverter');
  } else if (section_name === 'attachment_system' && value_name === 'make') {
    var make = System_data.findOne({ system_id:system_id, section_name:section_name, value_name:'make' }).value;
    //model_from_make(section_name, user_id);
    var module_model_id = System_data.findOne( { system_id:system_id, section_name:section_name, value_name:'model'} )._id;
    if( make === 'Quick Mount PV' ){
      System_data.update(
        module_model_id,
        {$set:{
          options: ['Quick Mount PV Roof Mount']
        }}
      );
    } else if( make === 'UNIRAC') {
      System_data.update(
        module_model_id,
        {$set:{
          options: ['SM SOLARMOUNT']
        }}
      );
    } else if( make === 'DPW Solar') {
      System_data.update(
        module_model_id,
        {$set:{
          options: ['Power Rail']
        }}
      );
    } else {
      System_data.update(
        module_model_id,
        {$set:{
          options: ['']
        }}
      );
    }
  } else if (section_name === 'inverter' && value_name === 'loadcenter_type') {
    var loadcenter_type = System_data.findOne({ system_id:system_id, section_name:section_name, value_name:value_name }).value;
    new_options = settings.data.opt.inverter.loadcenter[loadcenter_type];
    id = System_data.findOne( {
      system_id:system_id,
      section_name:section_name,
      value_name:'interconnection_voltage'
    })._id;
    return System_data.update(
      id,
      {$set:{
        options: new_options,
      }}
    );
  }
};
