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


if( system.closest_station ){
  
    //Maximum Number of Series-Connected Modules per Source Circuit
    system.array.maximum_modules_in_series = system.array.modules_per_string;
    //Minimum Number of Series-Connected Modules per Source Circuit
    system.array.minimum_modules_in_series = system.array.modules_per_string;

    //Maximum Source Circuit Ratings@ STC
    //Maximum Power (W)
    //Open-Circuit Voltage (V)
    //Short-Circuit Current (A)
    //Maximum Power Voltage (V)
    //Maximum Power Current (A)

    //Source Circuit Maximum Current (A), Isc x 1.25
    //Voltage Correction Factor
    //Option 1) Maximum system voltage (source circuit Voc corrected for lowest expected ambient temperature):
    system.array.voltage_max_1 = system.array.voc * settings_constants.voltage_correction_factor;
    //Option 2) Maximum system voltage (source circuit Voc corrected for lowest expected ambient temperature): Vmax = Voc[1 + Cv(Tmin - 25)]
    system.array.voltage_max_2 = system.array.voc * ( 1 + settings_constants.temp_coeff_Voc/100 * (system.closest_station['Extreme min']-25) );


    //Minimum array voltage (lowest source circuit Vmp corrected for highest operating temperature): Vmin = Vmp[1 + Cvmp(Tmax - 25)]

    //Maximum System Voltage < Module Maximum Voltage Rating?
    if( false ){
      system.notes.errors.push('Maximum voltage rating has been exceeded.');
    }
    //Maximum System Voltage < Inverter Maximum Voltage Rating?
    if( false ){
      system.notes.errors.push('Inverter maximum voltage rating has been exceeded.');
    }
    //Minimum Array Vmp > Inverter Minimum Operating Voltage
    if( false ){
      system.notes.note.push('Minimum array voltage is greater than minimum inverter operating or MPPT voltage. Not a code requirement. If "No", one or more strings may mave too few series-connected modules.');
    }
  }

  return settings;
};
