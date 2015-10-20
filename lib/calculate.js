var defined = f.section_defined;

calculate = function(settings){

  //console.log('f.process');
//  var f = settings.f;

  //copy inputs from settings.input to settings.system.
  //f.merge_objects(settings.user_input, settings.system);


  //console.log('---settings---', settings);
  var config_options = settings.config_options;
  var system = settings.system;
  var loc = settings.drawing_settings.loc;
  var size = settings.drawing_settings.size;
  var state = settings.state;
  var active_system = settings.state.active_system;

  var inputs = settings.inputs;

  if(g.system_data.location.closest_station){
    system.location.low_temp = g.system_data.location.closest_station['Extreme min'];
    system.location.high_temp_max = g.system_data.location.closest_station['High Temp 0.4%'];
    system.location.high_temp = g.system_data.location.closest_station['High Temp 2% Avg.'];
  }




  // Update settings and calculations

  if( state.database_loaded ){
    inputs.DC = settings.inputs.DC || {};
    inputs.DC.wire_size = settings.inputs.DC.wire_size || {};
    inputs.DC.wire_size.options = inputs.DC.wire_size.options || f.obj_names(settings.config_options.NEC_tables['Ch 9 Table 8 Conductor Properties']);


  }


  if( section_defined(active_system, 'array') && section_defined(active_system, 'module') ){
    system.array = system.array || {};
    system.array.isc = system.module.isc * system.array.num_strings;
    system.array.voc = system.module.voc * system.array.modules_per_string;
    system.array.imp = system.module.imp * system.array.num_strings;
    system.array.vmp = system.module.vmp * system.array.modules_per_string;
    system.array.pmp = system.array.vmp  * system.array.imp;

    system.array.number_of_modules = system.array.modules_per_string * system.array.num_strings;


  }


  //if( section_defined(active_system,  'DC') ){
  //  system.DC.wire_size = "-Undefined-";
  //}


  if( section_defined(active_system,  'inverter') ){

  }

  //inputs.AC.loadcenter_type = settings.f.obj_names(inputs.AC.loadcenter_types);
  if( system.AC.loadcenter_types ) {
    var loadcenter_type = system.AC.loadcenter_types;
    var AC_options = inputs.AC.loadcenter_types[loadcenter_type];
    inputs.AC.type.options = AC_options;
    //data.opt.AC.types[loadcenter_type];

    //inputs.AC['type'] = f.obj_names( settings.data.opt.AC.type );
  }
  if( system.AC.interconnection_voltage ) {
    system.AC.conductors = settings.data.opt.AC.conductors[system.AC.interconnection_voltage];
    system.AC.num_conductors = system.AC.conductors.length;

  }
  if( section_defined(active_system,  'AC') ){

    system.AC.wire_size = "-Undefined-";
  }

  size.wire_offset.max = size.wire_offset.min + system.array.num_strings * size.wire_offset.base;
  size.wire_offset.ground = size.wire_offset.max + size.wire_offset.base*1;
  loc.array.left = loc.array.right - ( size.string.w * system.array.num_strings ) - ( size.module.frame.w*3/4 ) ;










//////////////////////////////////////////////////////

  if( section_defined(active_system,  'module') ){
    //console.log('defined: ', 'module');

    var specs = PV_Components.findOne({ type:'modules', make:system.module.make, model:system.module.model });
    if(specs){
      system.module.pmp = specs.pmp;
      system.module.isc = specs.isc;
      system.module.voc = specs.voc;
      system.module.imp = specs.imp;
      system.module.vmp = specs.vmp;
      system.module.width = specs.width;
      system.module.length = specs.length;
    } else {
      //console.log('specs not found');
    }


  }
  if( section_defined(active_system,  'array') && section_defined(active_system,  'module') ){
    //console.log('defined: ', 'array and module');
    system.array = system.array || {};
    system.array.isc = system.module.isc * system.array.num_strings;
    system.array.voc = system.module.voc * system.array.modules_per_string;
    system.array.imp = system.module.imp * system.array.num_strings;
    system.array.vmp = system.module.vmp * system.array.modules_per_string;
    system.array.pmp = system.array.vmp  * system.array.imp;

    system.array.number_of_modules = system.array.modules_per_string * system.array.num_strings;
  }


  if( section_defined(active_system,  'inverter') ){
    //console.log('defined: ', 'module');

    var specs = PV_Components.findOne({ type:'inverters', make:system.inverter.make, model:system.inverter.model });
    if(specs){
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
        system.inverter[param_name] = specs[param_name];
      });
    } else {
      //console.log('specs not found');
    }


  }


  if( section_defined(active_system, 'roof') && settings.system.location.exposure_category ){

    var slope = Number(system.roof.slope.split(':')[0]) / 12;
    var angle_rad = Math.atan( slope );
    length_p = system.roof.slope_length * Math.cos(angle_rad);
    var height_diff = system.roof.slope_length * Math.sin(angle_rad);

    system.roof.ridge_height = system.roof.eave_wall_height + height_diff;
    system.roof.mean_height = ( system.roof.eave_wall_height + system.roof.ridge_height ) / 2;

    if( system.roof.eave_width < system.roof.width3 ){
      system.roof.least_horizontal_distance = system.roof.eave_width;
    } else {
      system.roof.least_horizontal_distance = system.roof.width3;
    }

    var a1 = 0.4 * system.roof.mean_height;
    var a2 = 0.1 * system.roof.least_horizontal_distance;
    if( a1 < a2) {
      system.roof.a = a1;
    } else {
      system.roof.a = a2;
    }

    if( system.roof.mean_height <= 4 ) system.roof.mean_height = 4;
    else if( system.roof.mean_height <= 6 ) system.roof.mean_height = 6;
    else if( system.roof.mean_height <= 8 ) system.roof.mean_height = 8;
    else if( system.roof.mean_height <= 10 ) system.roof.mean_height = 10;
    else console.log('mean roof height is greater than 10');

    system.roof.uplift_pressure_min = RAS127(settings);

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
