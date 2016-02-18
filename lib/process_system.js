process_system = function(settings){
  var state = settings.state;
  var system = state.system;
  var active_system = state.status.active_system;

  state.status.inCompliance = true;

  state.notes = {
    info: [],
    warnings: [],
    errors: [],
  };


  if( section_defined(active_system,  'inverter') ){
    var inverter_specs = PV_Components.findOne({
      type:'inverters',
      make:system.inverter.inverter_make,
      model:system.inverter.inverter_model
    });
    if(inverter_specs){
      [
        "nominal_inverter_power",
        "max_inverter_power",
        "grid_voltage",
        "mppt_channels",
        "mttp_channel_power",
        "vmax",
        "vstart",
        "mppt_min",
        "mppt_max"
      ].forEach(function(param_name){
        system.inverter[param_name] = inverter_specs[param_name];
      });
    } else {
      //console.log('inverter_specs not found');
    }
  }

  if( system.inverter.grid_voltage ) {
    var grid_voltage = String(system.inverter.grid_voltage);
    if( grid_voltage === '480' ) {
      grid_voltage += 'V Delta';
    } else {
      grid_voltage += 'V';
    }
    system.inverter.conductors = settings.data.opt.inverter.conductors[grid_voltage];
    system.inverter.num_conductors = system.inverter.conductors.length;
  }


  settings = calculate_system(settings);
  settings.state.system_display = mk_system_display(settings.state);



  state.webpage.selected_modules_total = 0;
  state.webpage.selected_modules.slice(1).forEach(function(row){
    row.slice(1).forEach(function(column){
      if(column){
        state.webpage.selected_modules_total++;
      }
    });
  });

  settings = update_drawing(settings);




/*
//*/

//////////////////////////////////////////////////////
  // return values to collection database

  //Meteor.call('update_user_data', function(err){
  //  console.log('called update_user_data');
  //  if(err) console.log('error: ', err);
  //});


  return settings;
};
