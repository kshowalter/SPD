f.mk_preview['elec'] = function(settings){
  //console.log("** Making preview 1");

  var d = Drawing(settings);
  d.size = {
    w: 450,
    h: 700,
  };

  settings.drawing_settings.size.drawing;


  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;
  var system = settings.system;

  var x, y, h, w, section_x, section_y;

  loc.preview.array.top = 40;
  loc.preview.array.left = 50;

  w = size.preview.module.w;
  h = size.preview.module.h;
  loc.preview.array.bottom = loc.preview.array.top + h*1.25*system.array.modules_per_string + h*3/4;
  //loc.preview.array.right = loc.preview.array.left + w*1.25*system.array.number_of_strings + w*2;
  loc.preview.array.right = loc.preview.array.left + w*1.25*8 + w*2;

  // TODO fix: sections must be defined in order, or there are areas

  if( section_defined(state.status.active_system, 'array') ){


    d.layer('preview');

    w = size.preview.module.w;
    h = size.preview.module.h;
    var offset = 40;

    for( var s=0; s<system.array.number_of_strings; s++ ){
      x = loc.preview.array.left + w*1.25*s;
      // string wiring
      d.line(
        [
          [ x , loc.preview.array.top ],
          [ x , loc.preview.array.bottom ],
        ]
      );
      // modules
      for( var m=0; m<system.array.modules_per_string; m++ ){
        y = loc.preview.array.top + h + h*1.25*m;
        // modules
        d.rect(
          [ x , y ],
          [w,h],
          'preview_module_box'
        );
      }
    }

    // top array conduit
    d.line(
      [
        [ loc.preview.array.left , loc.preview.array.top ],
        [ loc.preview.array.right - w, loc.preview.array.top ],
        [ loc.preview.array.right , loc.preview.array.top ],
      ]
    );
    // bottom array conduit
    d.line(
      [
        [ loc.preview.array.left , loc.preview.array.bottom ],
        [ loc.preview.array.right - w , loc.preview.array.bottom ],
        [ loc.preview.array.right - w , loc.preview.array.top ],
      ]
    );

  }


  ////////////
  // Text
  if( section_defined(state.status.active_system, 'array') ){

    x = loc.preview.array.right + 20;
    y = loc.preview.array.top;

    var text_spacing = 30;

    h = size.preview.module.h;

    d.text(
      [ x, y ],
      [
        'Array DC',
        'Strings: ' + parseFloat(system.array.number_of_strings).toFixed(),
        'Modules: ' + parseFloat(system.array.modules_per_string).toFixed(),
        'Pmp: ' + parseFloat(system.array.pmp).toFixed(),
        'Imp: ' + parseFloat(system.array.imp).toFixed(),
        'Vmp: ' + parseFloat(system.array.vmp).toFixed(),
        'Isc: ' + parseFloat(system.array.isc).toFixed(),
        'Voc: ' + parseFloat(system.array.voc).toFixed(),
      ],
      'preview_text',
      'preview_text'
    );
  }

  //if( section_defined(state.status.active_system, 'DC') ){
  //}
  /*
  x = 500;
  y = 50;

  var inverter_text_array = [
      'Inverter',
      system.inverter.make,
      system.inverter.model,
    ].concat(
      [
        "nominal_inverter_power",
        "grid_voltage",
        "mppt_channels",
        "mttp_channel_power",
        "vmax",
        "vstart",
        "mppt_min",
        "mppt_max"
      ].map(function(param_name){
        if( system.inverter[param_name] !== null && system.inverter[param_name] !== undefined ){
          return f.pretty_name(param_name) + ': ' +  parseFloat(system.inverter[param_name]).toFixed();
        } else {
          return false;
        }
      })
    )
    .filter(function(t){return t;});


  if( section_defined(state.status.active_system, 'inverter') ){
    d.layer('preview_inverter');
    d.text(
      [ x, y ],
      inverter_text_array,
      'preview_inverter',
      'preview_text'
    );
  }

  y += text_spacing * ( inverter_text_array.length + 1 );

  var AC_text_array = [
      'AC',
    ].concat(
      [
        "interconnection_voltage",
        "loadcenter_type"
      ].map(function(param_name){
        if( system.inverter[param_name] !== null && system.inverter[param_name] !== undefined ){
          return f.pretty_name(param_name) + ': ' + parseFloat(system.inverter[param_name]).toFixed();
        } else {
          return false;
        }
      })
    )
    .filter(function(t){return t;});

  if( section_defined(state.status.active_system, 'AC') ){
    d.layer('preview_AC');
    d.text(
      [ x, y ],
      AC_text_array,
      'preview_AC',
      'preview_text'
    );
  }

  y += text_spacing * ( inverter_text_array.length + 1 );

  //*/

  return d;
};
