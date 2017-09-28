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


  system.location.risk_category = 'II';
  system.inverter.loadcenter_type = '240V/120V';

  if(state.system_data.location.closest_station){
    system.location.low_temp = state.system_data.location.closest_station['Extreme min'];
    system.location.high_temp_max = state.system_data.location.closest_station['High Temp 0.4%'];
    system.location.high_temp = state.system_data.location.closest_station['High Temp 2% Avg.'];
  }

  var module_specs = PV_Components.findOne({ type:'modules', make:system.array.module_make, model:system.array.module_model });
  if(module_specs){
    system.array.module.pmp = module_specs.pmp;
    system.array.module.isc = module_specs.isc;
    system.array.module.voc = module_specs.voc;
    system.array.module.imp = module_specs.imp;
    system.array.module.vmp = module_specs.vmp;
    system.array.module.width = module_specs.width;
    system.array.module.length = module_specs.length;
    system.array.module.max_series_fuse = module_specs.max_series_fuse;
    system.array.module.ul1703 = module_specs.ul1703;

  } else {
    //console.log('module_specs not found');
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



  if( system.interconnection.inverter_subpanel_used === 'Yes' ){

    [
      'inverter_subpanel_feeder_size',
      'inverter_subpanel_feeder_insulation_type',
      'inverter_subpanel_feeder_ampacity_75C',
      'inverter_subpanel_feeder_supply_ocpd_rating',
      'inverter_subpanel_busbar_rating',
      'sum_of_inverter_output_overcurrent_protection_devices',
      'sum_of_inverter_output_circuit_current',
      'total_of_load_breakers',
    ].forEach(function(name){
      var id = System_data.findOne({
        system_id:active_system,
        section_name:'interconnection',
        value_name: name
      })._id;
      System_data.update(id, {$set: {disabled: false}});
    });

  } else {
    [
      'inverter_subpanel_feeder_size',
      'inverter_subpanel_feeder_insulation_type',
      'inverter_subpanel_feeder_ampacity_75C',
      'inverter_subpanel_feeder_supply_ocpd_rating',
      'inverter_subpanel_busbar_rating',
      'sum_of_inverter_output_overcurrent_protection_devices',
      'sum_of_inverter_output_circuit_current',
      'total_of_load_breakers',
    ].forEach(function(name){
      var id = System_data.findOne({
        system_id:active_system,
        section_name:'interconnection',
        value_name: name
      })._id;
      System_data.update(id, {$set: {disabled: true}});
    });
  }


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
