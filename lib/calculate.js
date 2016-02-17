var defined = f.section_defined;

calculate = function(settings){
  var state = settings.state;

  var system = state.system;
  var loc = settings.drawing_settings.loc;
  var size = settings.drawing_settings.size;
  var active_system = state.status.active_system;



  state.status.inCompliance = true;

  state.notes = {
    info: [],
    warnings: [],
    errors: [],
  };

  var inputs = state.inputs;

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

  if( section_defined(active_system, 'array') ){
    system.array = system.array || {};
    system.array.isc = system.array.module.isc * system.array.number_of_strings;
    system.array.voc = system.array.module.voc * system.array.modules_per_string;
    system.array.imp = system.array.module.imp * system.array.number_of_strings;
    system.array.vmp = system.array.module.vmp * system.array.modules_per_string;
    system.array.pmp = system.array.vmp  * system.array.imp;
    system.array.number_of_modules = system.array.modules_per_string * system.array.number_of_strings;

    // Fuses
    system.array.isc_OCPD = system.array.isc * 1.25 * 1.25 // TODO: get the real caclulations
    var fuses = [1,5,7.5,10];
    for( var i = 0; i<fuses.length; i++){
      if( system.array.isc_OCPD < fuses[i] ){
        system.array.fuse_size = fuses[i];
        return true;
      }
    };
  }








  //System limitation
  if( system.array.pmp > 10000 ){
    state.notes.errors.push('System size exceeds 10kW');
    state.status.inCompliance = false;
  }



  size.wire_offset.max = size.wire_offset.min + system.array.number_of_strings * size.wire_offset.base;
  size.wire_offset.ground = size.wire_offset.max + size.wire_offset.base*1;
  loc.array.left = loc.array.right - ( size.string.w * system.array.number_of_strings ) - ( size.module.frame.w*3/4 ) ;



  if( section_defined(active_system,  'inverter') ){
    var inverter_specs = PV_Components.findOne({ type:'inverters', make:system.inverter.inverter_make, model:system.inverter.inverter_model });
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

  if( section_defined(active_system, 'roof') && state.system.location.exposure_category ){

    var slope = Number(system.roof.slope.split(':')[0]) / 12;
    var angle_rad = Math.atan( slope );
    length_p = system.roof.slope_length * Math.cos(angle_rad);
    var height_diff = system.roof.slope_length * Math.sin(angle_rad);

    system.roof.ridge_height = system.roof.eave_height + height_diff;
    system.roof.mean_height = ( system.roof.eave_height + system.roof.ridge_height ) / 2;

    if( system.roof.mean_height >= 25 ) {
      state.notes.errors.push('Mean roof height is greater than 25 ft.s');
    }

    /*
    // This needs a new calculation, or other input
    if( system.roof.eave_width < system.roof.width3 ){
      system.roof.least_horizontal_distance = system.roof.eave_width;
    } else {
      system.roof.least_horizontal_distance = system.roof.width3;
    }
    */
    system.roof.least_horizontal_distance = system.roof.eave_width;
    /////


    var a1 = 0.4 * system.roof.mean_height;
    var a2 = 0.1 * system.roof.least_horizontal_distance;
    if( a1 < a2) {
      system.roof.a = a1;
    } else {
      system.roof.a = a2;
    }


    system.roof.uplift_pressure_min = RAS127(settings);

  }


  state.webpage.selected_modules_total = 0;
  state.webpage.selected_modules.slice(1).forEach(function(row){
    row.slice(1).forEach(function(column){
      if(column){
        state.webpage.selected_modules_total++;
      }
    });
  });






/*
//*/

//////////////////////////////////////////////////////
  // return values to collection database

  //Meteor.call('update_user_data', function(err){
  //  console.log('called update_user_data');
  //  if(err) console.log('error: ', err);
  //});

  state.system_display = mk_system_display(state);


  return settings;
};
