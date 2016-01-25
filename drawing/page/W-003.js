f.mk_sheet_num['W-003'] = function(settings){
  var f = settings.f;

  d = Drawing(settings);

  var sheet_section = 'PV';
  var sheet_num = '03';
  //d.append(mk_border(settings, sheet_section, sheet_num ));

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;


  //d.text(
  //  [size.drawing.w/2, size.drawing.h/2],
  //  'Calculation Sheet',
  //  'text',
  //  'title2'
  //);


  x = size.drawing.frame_padding*6;
  y = size.drawing.frame_padding*6 +20;

  d.layer('table');

  var col_widths = [
    null,
    125,
    125
  ];
  var table_width = 100 + 125;

  for( var section_name in state.system ){
    //if( section_defined(state.status.active_system, section_name) ){
      var section = state.system[section_name];

      var n = Object.keys(section).length;

      var n_rows = n+0;
      var n_cols = 2;

      var row_height = 15;
      h = n_rows*row_height;

      if( (y+h) > ( settings.drawing_settings.size.drawing.h * 0.8 ) ) {
        y = size.drawing.frame_padding*6 +20;
        x += table_width*1.2;
      }

      d.text( [x+table_width/2, y-row_height], f.pretty_name(section_name),'table' );

      var t = d.table(n_rows,n_cols).loc(x,y);
      t.row_size('all', row_height).col_size(1, col_widths[1]).col_size(2, col_widths[2]);

      var r = 1;
      var value;
      for( var value_name in section ){
        if( state.inputs[section_name][value_name] && state.inputs[section_name][value_name].onDrawing === false ){
          continue;
        }
        var label = state.inputs[section_name] &&
            state.inputs[section_name][value_name] &&
            state.inputs[section_name][value_name].label;
        var parameter_name = label || f.pretty_name(value_name);
        t.cell(r,1).text( parameter_name );
        if( typeof section[value_name] === 'undefined' || section[value_name] === null) {
          value = false;
        } else if( section[value_name].constructor === Array ){
          value = section[value_name].join(', ');
        } else if( section[value_name].constructor === Object ){
          //value = '( )';
          value = 'false';
        } else if( isNaN(section[value_name]) ){
          value = section[value_name];
        } else {
          value = parseFloat(section[value_name]).toFixed(2);
        }
        if( value ){
          t.cell(r,2).text( value );
          r++;
        }

      }

      t.all_cells().forEach(function(cell){
        cell.font('table').border('all');
      });

      t.mk();

      //*/
      y += h + 30;



    //} else {

      //console.log('not defined: ', section_name, section);
    //}




  }

  d.layer();


  return d;
};
