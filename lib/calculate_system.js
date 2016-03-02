var defined = f.section_defined;

calculate_system = function(settings){
  var state = settings.state;
  var system = state.system;
  var active_system = state.status.active_system;



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


    system.roof.uplift_pressure_min = codeTables.RAS127(settings);

  }





  return settings;
};