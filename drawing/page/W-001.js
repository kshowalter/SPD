f.mk_sheet_num['W-001'] = function(settings){
  var state = settings.state;

  var d = Drawing(settings);

  var f = settings.f;

  var system = state.system;

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;

  var x, y, h, w;
  var label;
  var offset;






  // if 'array' section is defined:
  if( section_defined(state.status.active_system, 'array') ){
    d.section('array');

    x = loc.array.right - size.string.w/2;
    y = loc.array.upper;
    //y -= size.string.h/2;


    // DC run from array to JB
    for( var i in _.range(system.array.number_of_strings)) {
      var offset_wire = size.wire_offset.min + ( size.wire_offset.base * i );

      d.block('string', [x,y]);
      // positive home run
      d.layer('DC_pos');
      d.line([
        [ x , loc.array.upper ],
        [ x , loc.array.upper-offset_wire ],
        [ loc.array.right+offset_wire, loc.array.upper-offset_wire ],
        [ loc.array.right+offset_wire, loc.DC_jb_box.y-offset_wire ],
        [ loc.DC_jb_box.x , loc.DC_jb_box.y-offset_wire],
      ]);
      d.block( 'terminal', [ loc.DC_jb_box.x , loc.DC_jb_box.y-offset_wire]);

      // negative home run
      d.layer('DC_neg');
      d.line([
        [ x , loc.array.lower ],
        [ x , loc.array.lower_limit+offset_wire ],
        [ loc.array.right+offset_wire , loc.array.lower_limit+offset_wire ],
        [ loc.array.right+offset_wire , loc.DC_jb_box.y+offset_wire],
        [ loc.DC_jb_box.x , loc.DC_jb_box.y+offset_wire],
      ]);
      d.block( 'terminal', [ loc.DC_jb_box.x , loc.DC_jb_box.y+offset_wire]);

      d.line([
        [ x-size.module.frame.w/2+5, loc.array.lower ],
        [ x-size.module.frame.w/2+5, loc.array.lower_limit + size.wire_offset.ground ],
      ], 'DC_ground');

      x -= size.string.w;
    }



    // DC ground run from array to JB
    d.layer('DC_ground');
    d.line([
      [ loc.array.left+7, loc.array.lower_limit + size.wire_offset.ground ],
      [ loc.array.right+size.wire_offset.ground , loc.array.lower_limit + size.wire_offset.ground ],
      [ loc.array.right+size.wire_offset.ground , loc.DC_ground.y],
      [ loc.DC_jb_box.x , loc.DC_ground.y],
    ]);
    d.block( 'terminal', [ loc.DC_jb_box.x , loc.DC_ground.y]);

    d.layer();


    // DC Junction box
    x = loc.DC_jb_box.x;
    y = loc.DC_jb_box.y;
    w = size.DC_jb_box.w;
    h = size.DC_jb_box.h;
    label = ['JUNCTION','BOX'];
    d.rect(
      [x,y],
      [w,h],
      'box'
    );
    d.text(
      [ x, y - h/2 - 27],
      label,
      'text',
      'label_center'
    );



    // Conduit: array to JB
    w = 15;
    h = 120;
    x = loc.DC_jb_box.x - size.DC_jb_box.w/2 - 20;
    y = loc.DC_jb_box.y + size.DC_jb_box.h/2 - h/2;
    d.ellipse([x, y],[w, h],'wire_callout');
    d.line(
      [
        [ x, y + h/2],
        [ x + 16, y + h/2 + 32 ]
      ],
      'wire_callout'
    );
    d.text(
      [ x + 16 + 10, y + h/2 + 32 ],
      ['(2)'],
      'text',
      'label_center'
    );


  }




  // if 'array' and 'inverter' sections are defined:
  if( section_defined(state.status.active_system, 'array') && section_defined(state.status.active_system, 'inverter') ){

    // DC JB to combiner
    for( var i in _.range(system.array.number_of_strings)) {
      var offset_wire = size.wire_offset.min + ( size.wire_offset.base * i );

      d.layer('DC_pos');
      d.line([
        [ loc.DC_jb_box.x , loc.DC_jb_box.y-offset_wire],
        [ loc.DC_combiner.x - size.DC_combiner.components_width/2, loc.DC_jb_box.y-offset_wire],
      ]);
      if( system.array.number_of_strings > 2){
        d.block( 'fuse', [ loc.DC_combiner.x - size.DC_combiner.components_width/2, loc.DC_jb_box.y-offset_wire]);
      } else {
        d.line([
          [ loc.DC_combiner.x - size.DC_combiner.components_width/2, loc.DC_jb_box.y-offset_wire],
          [ loc.DC_combiner.x - size.DC_combiner.components_width/2 + size.fuse.l, loc.DC_jb_box.y-offset_wire],
        ]);
      }
      d.line([
        [ loc.DC_combiner.x - size.DC_combiner.components_width/2 + size.fuse.l, loc.DC_jb_box.y-offset_wire],
        [ loc.DC_combiner.x - size.DC_combiner.components_width/2 + size.fuse.l + size.DC_combiner.fuse_to_bus_spacing, loc.DC_jb_box.y-offset_wire],
      ]);

      // negative home run
      d.layer('DC_neg');
      d.line([
        [ loc.DC_jb_box.x , loc.DC_jb_box.y+offset_wire],
        [ loc.DC_combiner.x - size.DC_combiner.components_width/2, loc.DC_jb_box.y+offset_wire],
      ]);
      if( system.array.number_of_strings > 2){
        d.block( 'fuse', [ loc.DC_combiner.x - size.DC_combiner.components_width/2, loc.DC_jb_box.y+offset_wire]);
      } else {
        d.line([
          [ loc.DC_combiner.x - size.DC_combiner.components_width/2, loc.DC_jb_box.y+offset_wire],
          [ loc.DC_combiner.x - size.DC_combiner.components_width/2 + size.fuse.l, loc.DC_jb_box.y+offset_wire],
        ]);
      }
      d.line([
        [ loc.DC_combiner.x - size.DC_combiner.components_width/2 + size.fuse.l, loc.DC_jb_box.y+offset_wire],
        [ loc.DC_combiner.x - size.DC_combiner.components_width/2 + size.fuse.l + size.DC_combiner.fuse_to_bus_spacing, loc.DC_jb_box.y+offset_wire],
      ]);
      d.layer();

      x -= size.string.w;
    }

    // DC ground run from JB to combiner
    d.line([
      [ loc.DC_jb_box.x , loc.DC_ground.y],
      [ loc.DC_combiner.x , loc.DC_ground.y],
    ],'DC_ground');




    // Conduit: JB to combiner
    w = 15;
    h = 120;
    x = ( (loc.DC_jb_box.x + size.DC_jb_box.w/2) + (loc.DC_combiner.x - size.DC_combiner.w/2) )/2 ;
    y = loc.DC_combiner.y + size.DC_combiner.h/2 - h/2;
    d.ellipse([x, y],[w, h],'wire_callout');
    d.line(
      [
        [ x, y + h/2],
        [ x + 16, y + h/2 + 32 ]
      ],
      'wire_callout'
    );
    d.text(
      [ x + 16 + 10, y + h/2 + 32 ],
      ['(3)'],
      'text',
      'label_center'
    );


  }

  // if 'inverter' section is defined:
  if( section_defined(state.status.active_system, 'inverter') ){


    // DC_combiner
    x = loc.DC_combiner.x;
    y = loc.DC_combiner.y;
    w = size.DC_combiner.w;
    h = size.DC_combiner.h;
    label = ['COMBINER','BOX'];
    d.rect(
      [x,y],
      [w,h],
      'box'
    );
    d.text(
      [ x, y - h/2 - 27],
      label,
      'text',
      'label_center'
    );

    var x = x + size.DC_combiner.components_width/2 - size.bus_bar.w/2;
    d.rect(
      [ x, y + (size.wire_offset.min + ( size.wire_offset.base * 5 ))/2 + size.wire_offset.min/2],
      [ size.bus_bar.w,      size.wire_offset.min + ( size.wire_offset.base * 5 )                         ],
      'DC_neg'
    );
    d.rect(
      [ x, y - (size.wire_offset.min + ( size.wire_offset.base * 5 ))/2 - size.wire_offset.min/2],
      [ size.bus_bar.w,      size.wire_offset.min + ( size.wire_offset.base * 5 )                         ],
      'DC_pos'
    );


    // DC_disconect
    x = loc.DC_disconect.x;
    y = loc.DC_disconect.y;
    w = size.DC_disconect.w;
    h = size.DC_disconect.h;
    label = ['DC','DISCONECT'];
    d.rect(
      [x,y],
      [w,h],
      'box'
    );
    d.text(
      [ x, y - h/2 - 27],
      label,
      'text',
      'label_center'
    );







    var offset_wire = size.wire_offset.min + ( size.wire_offset.base * 0 );

    // DC ground run from combiner to inverter
    d.line([
      [ loc.DC_combiner.x + size.DC_combiner.components_width/2, loc.DC_jb_box.y-offset_wire],
      [ loc.DC_disconect.x - size.disconect.l/2 , loc.DC_jb_box.y-offset_wire],
    ], 'DC_pos');
    d.block( 'disconect', [ loc.DC_disconect.x - size.disconect.l/2 , loc.DC_jb_box.y-offset_wire]);
    d.line([
      [ loc.DC_disconect.x + size.disconect.l/2 , loc.DC_jb_box.y-offset_wire],
      [ loc.inverter.left_terminal , loc.DC_jb_box.y-offset_wire],
    ], 'DC_pos');
    d.block( 'terminal', [ loc.inverter.left_terminal , loc.DC_jb_box.y-offset_wire]);
    d.text(
      [ loc.inverter.left_terminal-25 , loc.DC_jb_box.y-offset_wire-size.terminal_diam],
      'DC+',
      'text',
      'line_label_left'
    );

    // DC negative run from combiner to inverter
    d.line([
      [ loc.DC_combiner.x + size.DC_combiner.components_width/2, loc.DC_jb_box.y+offset_wire],
      [ loc.DC_disconect.x - size.disconect.l/2  , loc.DC_jb_box.y+offset_wire],
    ], 'DC_neg');
    d.block( 'disconect', [ loc.DC_disconect.x -size.disconect.l/2 , loc.DC_jb_box.y+offset_wire]);
    d.line([
      [ loc.DC_disconect.x + size.disconect.l/2  , loc.DC_jb_box.y+offset_wire],
      [ loc.inverter.left_terminal , loc.DC_jb_box.y+offset_wire],
    ], 'DC_neg');
    d.block( 'terminal', [ loc.inverter.left_terminal , loc.DC_jb_box.y+offset_wire]);
    d.text(
      [ loc.inverter.left_terminal-25 , loc.DC_jb_box.y+offset_wire-size.terminal_diam],
      'DC-',
      'text',
      'line_label_left'
    );

    // DC ground run from DC_combiner to inverter
    d.block( 'terminal', [ loc.DC_combiner.x , loc.DC_ground.y]);
    d.line([
      [ loc.DC_combiner.x, loc.DC_ground.y],
      [ loc.DC_disconect.x, loc.DC_ground.y],
    ], 'DC_ground');
    d.block( 'terminal', [ loc.DC_disconect.x , loc.DC_ground.y]);
    d.line([
      [ loc.DC_disconect.x , loc.DC_ground.y],
      [ loc.inverter.right_terminal , loc.DC_ground.y],
    ], 'DC_ground');
    //d.block( 'terminal', [ loc.inverter.x , loc.DC_ground.y]);
    d.text(
      [ loc.inverter.left_terminal-25 , loc.DC_ground.y-size.terminal_diam],
      'G',
      'text',
      'line_label_left'
    );







    // Conduit: combiner to disconect
    w = 15;
    h = 100;
    x = ( (loc.DC_combiner.x + size.DC_combiner.w/2) + (loc.DC_disconect.x - size.DC_disconect.w/2) )/2 ;
    y = loc.DC_disconect.y + size.DC_disconect.h/2 - h/2;
    d.ellipse([x, y],[w, h],'wire_callout');

    d.line(
      [
        [ x, y + h/2],
        [ loc.DC_disconect.x - 10, y + h/2 + 32 ]
      ],
      'wire_callout'
    );
    d.text(
      [ loc.DC_disconect.x, y + h/2 + 32 ],
      ['(4)'],
      'text',
      'label_center'
    );

    // Conduit: disconect to inverter
    w = 15;
    h = 100;
    x = loc.DC_disconect.x + size.DC_disconect.w/2 + 15;
    y = loc.inverter.y + size.inverter.h/2 - h/2;
    d.ellipse([x, y],[w, h],'wire_callout');
    d.line(
      [
        [ x, y + h/2],
        [ loc.DC_disconect.x + 10, y + h/2 + 32 ]
      ],
      'wire_callout'
    );





    ///////////////////////////////
    //#inverter
    d.section("inverter");

    x = loc.inverter.x;
    y = loc.inverter.y;

    //frame
    d.layer('box');
    d.rect(
      [x,y],
      [size.inverter.w, size.inverter.h]
    );
    // Label at top (Inverter, make, model, ...)
    d.layer('text');
    d.text(
      [loc.inverter.x, loc.inverter.top - 27/2 ],
      [
        'INVERTER',
      ],
      'text',
      'label'
    );
    d.text(
      [loc.inverter.x, loc.inverter.top + size.inverter.text_gap ],
      [
        state.system.inverter.inverter_make,
        state.system.inverter.inverter_model
      ],
      'text',
      'label'
    );
    d.layer();

    //#inverter symbol
    d.section("inverter symbol");

    x = loc.inverter.x;
    y = loc.inverter.y + size.inverter.symbol_h/2;

    w = size.inverter.symbol_w;
    h = size.inverter.symbol_h;

    var space = w*1/12;


    // Inverter symbol
    d.layer('box');
    // box
    d.rect(
      [x,y],
      [w, h]
    );
    // diaganal
    d.line([
      [x-w/2, y+h/2],
      [x+w/2, y-h/2],
    ]);
    // DC
    d.line([
      [x - w/2 + space, y - h/2 + space],
      [x - w/2 + space*6, y - h/2 + space],
    ]);
    d.line([
      [x - w/2 + space, y - h/2 + space*2],
      [x - w/2 + space*2, y - h/2 + space*2],
    ]);
    d.line([
      [x - w/2 + space*3, y - h/2 + space*2],
      [x - w/2 + space*4, y - h/2 + space*2],
    ]);
    d.line([
      [x - w/2 + space*5, y - h/2 + space*2],
      [x - w/2 + space*6, y - h/2 + space*2],
    ]);
    // AC

    x = x + 3.5;
    y = y + 3.5;

    d.path(
      'm '+x+','+y+' c 0,5 7.5,5 7.5,0 0,-5 7.5,-5 7.5,0',
      'box'
    );

    d.layer();





    d.section("AC_discconect");

    d.text(
      [loc.AC_disc.x, loc.AC_disc.y - size.AC_disc.h/2 - 27 ],
      [
        'AC',
        'DISCONECT'
      ],
      'text',
      'label_center'
    );

    x = loc.AC_disc.x;
    y = loc.AC_disc.y;
    var padding = size.terminal_diam;

    d.layer('box');
    d.rect(
      [x, y],
      [size.AC_disc.w, size.AC_disc.h]
    );
    d.layer();


    //d.circ([x,y],5);



    //#AC load center
    d.section("AC load center");

    x = loc.AC_loadcenter.x;
    y = loc.AC_loadcenter.y;
    w = size.AC_loadcenter.w;
    h = size.AC_loadcenter.h;

    d.rect([x,y],
      [w,h],
      'box'
    );

    d.text(
      [ x, y-h/2-27 ],
      [
        'LOAD',
        'CENTER'
      ],
      'text',
      'label_center'
    );

    // AC bus bars
    d.rect(
      [ loc.AC_loadcenter.x-10, loc.AC_loadcenter.bottom - 25 - size.terminal_diam*5 ],
      [5,50],
      'box'
    );
    d.rect(
      [ loc.AC_loadcenter.x+10, loc.AC_loadcenter.bottom - 25  - size.terminal_diam*5 ],
      [5,50],
      'box'
    );

    var s, l;
    l = loc.AC_loadcenter.neutralbar;
    s = size.AC_loadcenter.neutralbar;
    d.rect([l.x,l.y], [s.w,s.h], 'AC_neutral' );

    l = loc.AC_loadcenter.groundbar;
    s = size.AC_loadcenter.groundbar;
    d.rect([l.x,l.y], [s.w,s.h], 'AC_ground_block' );
    d.block('ground', [l.x,l.y+s.h/2]);






    // AC lines
    d.section("AC lines");

    x = loc.inverter.right_terminal;
    y = loc.inverter.bottom_right.y;
    y -= size.terminal_diam *2;

    padding = size.terminal_diam;
    //var AC_d.layer_names = ['AC_ground', 'AC_neutral', 'AC_L1', 'AC_L2', 'AC_L2'];

    var x_terminal = x;
    for( var i=0; i < system.inverter.num_conductors; i++ ){
      x = x_terminal;
      var line_name = system.inverter.conductors[i];
      d.block('terminal', [x,y] );
      d.layer('AC_'+line_name);
      // TODO: add line labels
      line_labels = {
        'L1': 'L1',
        'L2': 'L2',
        'L3': 'L3',
        'neutral': 'N',
        'ground': 'G',
      };
      d.text(
        [x+10,y-size.terminal_diam],
        line_labels[line_name],
        'text',
        'line_label_left'
      );
      d.line([
        [x, y],
        [ loc.AC_disc.left + ( size.AC_disc.w - size.disconect.l )/2, y ]
      ]);
      x = loc.AC_disc.left + ( size.AC_disc.w - size.disconect.l )/2; // move to start of disconect
      if( ['ground', 'neutral'].indexOf(line_name)+1 ){
        d.line([
          [ x, y ],
          [ x + size.disconect.l, y ]
        ]);
      } else {
        d.block('disconect', {
          x: x,
          y: y
        });
      }
      d.line([
        [ x + size.disconect.l, y ],
        [ loc.AC_disc.right, y ]
      ]);
      d.line([
        [ loc.AC_disc.right, y ],
        [ loc.AC_loadcenter.left, y ]
      ]);

      x = loc.AC_loadcenter.left;
      if( line_name === 'ground' ){
        d.line([
          [ x, y ],
          [ loc.AC_loadcenter.groundbar.x - size.AC_loadcenter.groundbar.w/2, y ]
        ]);
      } else if( line_name === 'neutral' ){
        d.line([
          [ x, y ],
          [ loc.AC_loadcenter.neutralbar.x - size.AC_loadcenter.neutralbar.w/2, y ]
        ]);
      } else if( line_name === 'L1' ){
        d.line([
          [ x, y ],
          [ loc.AC_loadcenter.x-10 -5/2, y ]
        ]);
      } else if( line_name === 'L2' ){
        d.line([
          [ x, y ],
          [ loc.AC_loadcenter.x+10 -5/2, y ]
        ]);
      }
      /*
      */
      y -= size.terminal_diam *2;
      d.layer();
    }



    // Conduit: inverter to AC diconect
    x = loc.AC_disc.left - ( (loc.AC_loadcenter.x - size.AC_loadcenter.w/2) - (loc.AC_disc.x + size.AC_disc.w/2) )/2;
    y = loc.AC_disc.y + size.AC_disc.h/2 - 60/2;
    d.ellipse(
      [x, y],
      [10, 60],
      'wire_callout'
    );
    d.line(
      [
        [ x,      y + 60/2],
        [ loc.AC_disc.x - 15 , y + 60/2 + 30 ]
      ],
      'wire_callout'
    );
    d.text(
      [ loc.AC_disc.x , y + 60/2 + 30 ],
      [
        '(5)'
      ],
      'text',
      'label_center'
    );

    // Conduit: AC diconect to load center
    x = ( (loc.AC_disc.x + size.AC_disc.w/2) + (loc.AC_loadcenter.x - size.AC_loadcenter.w/2) )/2 ;
    y = loc.AC_disc.y + size.AC_disc.h/2 - 60/2;
    d.ellipse(
      [x, y],
      [10, 60],
      'wire_callout'
    );
    d.line(
      [
        [ x,                 y + 60/2],
        [ loc.AC_disc.x + 15 , y + 60/2 + 30 ]
      ],
      'wire_callout'
    );


  }











  // Wire table
  d.section("Wire table");

  ///*

  x = loc.wire_table.x;
  y = loc.wire_table.y;



  if( true ) {
    var n_rows = 8;
    var n_cols = 14;
    var row_height = 15;
    var row_width = 50;
    var column_width = [];
    column_width[1] = 25;
    column_width[2] = 135;
    column_width[3] = 55;
    column_width[4] = 65;
    column_width[5] = 55;
    column_width[6] = 50;
    column_width[7] = 30;
    column_width[8] = 50;
    column_width[9] = 55;
    column_width[10] = 50;
    column_width[11] = 45;
    column_width[12] = 30;
    column_width[13] = 55;
    column_width[14] = 40;

    h = n_rows*row_height;

    var t = d.table(n_rows,n_cols).loc(x,y);
    t.row_size('all', row_height);
    t.col_size('all', row_width);

    column_width.forEach(function(size, i){
      t.col_size(i, size);
    });

    t.all_cells().forEach(function(cell){
      cell.font('table').border('all');
    });

    var wire_section_list = [
      ['1','INTERMODULE WIRING'],
      ['2','PV DC SOURCE CIRCUITS'],
      ['3','PV DC OUTPUT CIRCUITS'],
      ['3','INVERTER DC INPUT CIRCUIT'], // (SAME AS PV OUTPUT CIRCUITS FOR SINGLE COMBINER)'],
      ['4','INVERTER AC OUTPUT CIRCUIT'],
      ['?','GROUNDING ELECTRODE']
    ].forEach(function(label, i){
      t.cell(i+3,1).font('table').text( label[0] );
      t.cell(i+3,2).font('table_left').text( label[1] );
    });

    //t.cell(1,3).border('R', false);
    t.cell(1,1).border('B', false);
    t.cell(1,1).font('table_center').text('SYM.');

    t.cell(1,2).border('B', false);
    t.cell(1,2).font('table_center').text('CIRCUIT');

    t.cell(1,3).border('B', false);
    t.cell(1,3).font('table_center').text('310.15(B)');
    t.cell(2,3).font('table_center').text('AMPACITY');

    t.cell(1,4).border('B', false);
    t.cell(1,4).font('table_center').text('TEMPERATURE');
    t.cell(2,4).font('table_center').text('RACEWAY FILL');

    t.cell(1,5).border('B', false);
    t.cell(1,5).font('table_center').text('ADJUSTED');
    t.cell(2,5).font('table_center').text('AMPACITY');

    t.cell(1,6).border('B', false);
    t.cell(1,6).font('table_center').text('REQUIRED');
    t.cell(2,6).font('table_center').text('AMPACITY');

    t.cell(1,7).border('B', false);
    t.cell(1,7).font('table_center').text('SETS');

    t.cell(1,8).border('B', false);
    t.cell(1,8).font('table_center').text('MATERIAL');

    t.cell(1,9).border('B', false);
    t.cell(1,9).font('table_center').text('INSULATION');

    t.cell(1,10).border('B', false);
    t.cell(1,10).font('table_center').text('RACEWAY');

    t.cell(1,11).border('B', false);
    t.cell(1,11).font('table_center').text('MIN. SIZE');
    t.cell(2,11).font('table_center').text('(AWG)');

    t.cell(1,12).border('B', false);
    t.cell(1,12).font('table_center').text('QTY');

    t.cell(1,13).border('B', false);
    t.cell(1,13).font('table_center').text('CONDUCTOR');

    t.cell(1,14).border('B', false);
    t.cell(1,14).font('table_center').text('RUN');
    t.cell(2,14).font('table_center').text('(1-Way)');


    //for( i=1; i<=system.inverter.num_conductors; i++){
    //  t.cell(2+i,1).font('table').text(i.toString());
    //  t.cell(2+i,2).font('table_left').text( f.pretty_word(state.system.inverter.conductors[i-1]) );
    //}


    //d.text( [x+w/2, y-row_height], f.pretty_name(section_name),'table' );

    t.mk();

  }

  //*/














  return d;
};
