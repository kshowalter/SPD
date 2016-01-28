mk_system_display = function(state){
  system_display = {};

  ////////////////
  // Module info
  state.system['module'] = {};
  [
    'pmp',
    'isc',
    'voc',
    'imp',
    'vmp',
    'width',
    'length',
    'max_series_fuse',
    'ul1703',
  ].forEach(function(value_name){
    state.system['module'][value_name] = state.system.array.module[value_name];
  });



  for( var section_name in state.system ){
    if( true || section_defined(state.status.active_system, section_name) ){ //TODO: remove 'true || '
      system_display[section_name] = {};

      var section = state.system[section_name];
      var value;
      for( var value_name in section ){
        if( state.inputs[section_name] &&
            state.inputs[section_name][value_name] &&
            state.inputs[section_name][value_name].onDrawing === false ){
          //console.log('value_name', section_name, value_name);
          continue;
        }

        var system_value = section[value_name];

        //var label = state.inputs[section_name] &&
        //    state.inputs[section_name][value_name] &&
        //    state.inputs[section_name][value_name].label;
        //var parameter_name = label || f.pretty_name(value_name);

        if( typeof system_value === 'undefined' || system_value === null) {
          value = false;
        } else if( section[value_name].constructor === Array ){
          value = section[value_name].join(', ');
        } else if( section[value_name].constructor === Object ){
          value = false;
        } else if( isNaN(section[value_name]) ){
          value = section[value_name];
        } else {
          value = parseFloat(section[value_name]).toFixed(2);
        }

        if( value !== false ){
          system_display[section_name][value_name] = value;
        }
      }
    }
  }

  return system_display;
}
