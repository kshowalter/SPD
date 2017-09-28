update_options = function update_options( system_id, section_name, value_name){
  var new_options;
  var id;
  var confirm;

  if(section_name === 'array' && value_name === 'module_make'){
    //model_from_make(system_id, section_name, 'module');
    var make = System_data.findOne({ system_id:system_id, section_name:section_name, value_name:'module_make' }).value;
    var model_id = System_data.findOne( { system_id:system_id, section_name:section_name, value_name:'module_model'} )._id;

    new_options = _.uniq(
      PV_Components.find({
        type: 'modules',
        make:make,
      }).map(function(doc){return doc.model;}
    ));
    if(!new_options.length){
      new_options = ['-'];
    }
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
  } else if ( (section_name === 'inverter' && value_name === 'inverter_make') ||
              (section_name === 'inverter' && value_name === 'loadcenter_type') ) {
    // grid_voltage
    var make = System_data.findOne({ system_id:system_id, section_name:'inverter', value_name:'inverter_make' }).value;
    //if( ! make ) return false;
    var model_id = System_data.findOne( { system_id:system_id, section_name:'inverter', value_name:'inverter_model'} )._id;

    var loadcenter_type = System_data.findOne( { system_id:system_id, section_name:'inverter', value_name:'loadcenter_type'} );
    if( loadcenter_type && loadcenter_type.value ){
      loadcenter_type = loadcenter_type.value;
    }

    if( loadcenter_type ){
      var voltages = loadcenter_type.split('/').map(function(voltage_string){
        return Number( voltage_string.slice(0, voltage_string.length-1) );
      });
      new_options = _.uniq(
        PV_Components.find({
          type: 'inverters',
          make:make,
          grid_voltage: {$in: voltages}
        }).map(function(doc){return doc.model;}
      ));
    } else {
      new_options = _.uniq(
        PV_Components.find({
          type: 'inverters',
          make:make,
        }).map(function(doc){return doc.model;}
      ));
    }
    if(!new_options.length){
      new_options = ['-'];
    }
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
  }
};
