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
    175,
    100
  ];
  var table_width = col_widths[1] + col_widths[2];

  for( var section_name in state.system_display ){
    if( section_defined(state.status.active_system, section_name) ){
      var section = state.system_display[section_name];

      var n = Object.keys(section).length;

      var n_rows = n+0;
      var n_cols = 2;

      var row_height = 15;
      table_height = n_rows*row_height;

      if( (y+table_height+50) > ( settings.drawing_settings.size.drawing.h * 0.8 ) ) {
        y = size.drawing.frame_padding*6 +20;
        x += table_width*1.2;
      }

      d.text( [x+table_width/2, y-row_height], f.pretty_name(section_name),'table' );

      var t = d.table(n_rows,n_cols).loc(x,y);
      t.row_size('all', row_height).col_size(1, col_widths[1]).col_size(2, col_widths[2]);

      var r = 1;
      for( var value_name in section ){
        var label = state.inputs[section_name] &&
            state.inputs[section_name][value_name] &&
            state.inputs[section_name][value_name].label;
        var parameter_name = label || f.pretty_name(value_name);
        t.cell(r,1).text( parameter_name );

        t.cell(r,2).text( state.system_display[section_name][value_name] );
        r++;

      }

      t.all_cells().forEach(function(cell){
        cell.font('table').border('all');
      });

      t.mk();

      //*/
      y += table_height + 50;
    }
  }

  d.layer();

  return d;
};
