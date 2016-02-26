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






  ////////////////////////////////////////
  //#array


  //*
  if( section_defined(state.status.active_system, 'array') ){
    d.section('array');

    x = loc.array.right - size.string.w;
    y = loc.array.upper;
    //y -= size.string.h/2;

    // DC run from array to combiner
    for( var i in _.range(system.array.number_of_strings)) {
      var offset_wire = size.wire_offset.min + ( size.wire_offset.base * i );

      d.block('string', [x,y]);
      // positive home run
      d.layer('DC_pos');
      d.line([
        [ x , loc.array.upper ],
        [ x , loc.DC_jb_box.y-offset_wire ],
        [ loc.DC_jb_box.x , loc.DC_jb_box.y-offset_wire],
      ]);
      d.block( 'terminal', [ loc.DC_jb_box.x , loc.DC_jb_box.y-offset_wire]);
      d.line([
        [ loc.DC_jb_box.x , loc.DC_jb_box.y-offset_wire],
        [ loc.DC_combiner.x -5/2 , loc.DC_jb_box.y-offset_wire],
      ]);
      //d.block( 'terminal', [ loc.DC_combiner.x , loc.DC_jb_box.y-offset_wire]);

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
        [ loc.DC_jb_box.x , loc.DC_jb_box.y+offset_wire],
        [ loc.DC_combiner.x -5/2, loc.DC_jb_box.y+offset_wire],
      ]);
      //d.block( 'terminal', [ loc.DC_combiner.x , loc.DC_jb_box.y+offset_wire]);

      x -= size.string.w;
    }

    // DC ground run from array to combiner
    d.layer('DC_ground');
    d.line([
      //[ loc.array.left , loc.array.lower + size.wire_offset.ground ],
      [ loc.array.left, loc.array.lower_limit + size.wire_offset.ground ],
      [ loc.array.right+size.wire_offset.ground , loc.array.lower_limit + size.wire_offset.ground ],
      [ loc.array.right+size.wire_offset.ground , loc.DC_ground.y],
      [ loc.DC_jb_box.x , loc.DC_ground.y],

    ]);
    d.block( 'terminal', [ loc.DC_jb_box.x , loc.DC_ground.y]);
    d.line([
      [ loc.DC_jb_box.x , loc.DC_ground.y],
      [ loc.DC_combiner.x , loc.DC_ground.y],
    ]);
    d.block( 'terminal', [ loc.DC_combiner.x , loc.DC_ground.y]);
    d.layer();


    // DC Junction box
    x = loc.DC_jb_box.x;
    y = loc.DC_jb_box.y;
    w = size.DC_jb_box.w;
    h = size.DC_jb_box.h;
    label = ['Junction','Box'];
    d.rect(
      [x,y],
      [w,h],
      'box'
    );
    d.text(
      [ x, y - h/2 - 25],
      label,
      'text',
      'label_center'
    );


    var offset_wire = size.wire_offset.min + ( size.wire_offset.base * 0 );

    // DC ground run from combiner to inverter
    d.line([
      [ loc.DC_combiner.x +5/2 , loc.DC_jb_box.y-offset_wire],
      [ loc.DC_disconect.x - size.disconect.l/2 , loc.DC_jb_box.y-offset_wire],
    ], 'DC_pos');
    d.block( 'disconect', [ loc.DC_disconect.x - size.disconect.l/2 , loc.DC_jb_box.y-offset_wire]);
    d.line([
      [ loc.DC_disconect.x + size.disconect.l/2 , loc.DC_jb_box.y-offset_wire],
      [ loc.inverter.left_terminal , loc.DC_jb_box.y-offset_wire],
    ], 'DC_pos');
    d.block( 'terminal', [ loc.inverter.left_terminal , loc.DC_jb_box.y-offset_wire]);

    // DC negative run from combiner to inverter
    d.line([
      [ loc.DC_combiner.x +5/2 , loc.DC_jb_box.y+offset_wire],
      [ loc.DC_disconect.x - size.disconect.l/2  , loc.DC_jb_box.y+offset_wire],
    ], 'DC_neg');
    d.block( 'disconect', [ loc.DC_disconect.x -size.disconect.l/2 , loc.DC_jb_box.y+offset_wire]);
    d.line([
      [ loc.DC_disconect.x + size.disconect.l/2  , loc.DC_jb_box.y+offset_wire],
      [ loc.inverter.left_terminal , loc.DC_jb_box.y+offset_wire],
    ], 'DC_neg');
    d.block( 'terminal', [ loc.inverter.left_terminal , loc.DC_jb_box.y+offset_wire]);

    // DC ground run from combiner to inverter
    d.line([
      [ loc.DC_combiner.x +5/2, loc.DC_ground.y],
      [ loc.DC_disconect.x, loc.DC_ground.y],
    ], 'DC_ground');
    d.block( 'terminal', [ loc.DC_disconect.x , loc.DC_ground.y]);
    d.line([
      [ loc.DC_disconect.x , loc.DC_ground.y],
      [ loc.inverter.left_terminal , loc.DC_ground.y],
    ], 'DC_ground');
    d.block( 'terminal', [ loc.inverter.left_terminal , loc.DC_ground.y]);


  }
  //*/




  //if( section_defined(state.status.active_system, 'DC') ){
  if( section_defined(state.status.active_system, 'inverter') ){


    // DC_combiner
    x = loc.DC_combiner.x;
    y = loc.DC_combiner.y;
    w = size.DC_combiner.w;
    h = size.DC_combiner.h;
    label = ['Combiner','Box'];
    d.rect(
      [x,y],
      [w,h],
      'box'
    );
    d.text(
      [ x, y - h/2 - 25],
      label,
      'text',
      'label_center'
    );

    d.rect(
      [ x, y + (size.wire_offset.min + ( size.wire_offset.base * 5 ))/2 + size.wire_offset.min/2],
      [ 5,      size.wire_offset.min + ( size.wire_offset.base * 5 )                         ],
      'DC_neg'
    );
    d.rect(
      [ x, y - (size.wire_offset.min + ( size.wire_offset.base * 5 ))/2 - size.wire_offset.min/2],
      [ 5,      size.wire_offset.min + ( size.wire_offset.base * 5 )                         ],
      'DC_pos'
    );


    // DC_disconect
    x = loc.DC_disconect.x;
    y = loc.DC_disconect.y;
    w = size.DC_disconect.w;
    h = size.DC_disconect.h;
    label = ['DC','Disconect'];
    d.rect(
      [x,y],
      [w,h],
      'box'
    );
    d.text(
      [ x, y - h/2 - 25],
      label,
      'text',
      'label_center'
    );








    //
    w = 15;
    h = 120;
    x = loc.DC_jb_box.x - size.DC_jb_box.w/2 - 15;
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

    //
    w = 15;
    h = 120;
    x = loc.DC_combiner.x - size.DC_combiner.w/2 - 15;
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

    //
    w = 15;
    h = 100;
    x = loc.DC_disconect.x - size.DC_disconect.w/2 - 15;
    y = loc.DC_disconect.y + size.DC_disconect.h/2 - h/2;
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
      ['(4)'],
      'text',
      'label_center'
    );

    //
    w = 15;
    h = 100;
    x = loc.inverter.x - size.inverter.w/2 - 15;
    y = loc.inverter.y + size.inverter.h/2 - h/2;
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
      ['(5)'],
      'text',
      'label_center'
    );






    /*
    for( i in _.range(system.array.number_of_strings)) {
      offset = size.wire_offset.min + ( size.wire_offset.base * i );

      d.layer('DC_pos');
      d.line(
        [
          [ x , y-offset],
          [ x , y-offset],
        ]
      );
      d.block( 'terminal', {
        x: x,
        y: y-offset,
      });
      d.line(
        [
          [ x , y-offset],
          [ loc.DC_disconect.x-offset , y-offset],
          [ loc.DC_disconect.x-offset , loc.DC_disconect.y+size.DC_disconect.h/2-size.terminal_diam],
          [ loc.DC_disconect.x-offset , loc.DC_disconect.y+size.DC_disconect.h/2-size.terminal_diam-size.terminal_diam*3],
        ]
      );
      d.block( 'terminal', {
        x: loc.DC_disconect.x-offset,
        y: loc.DC_disconect.y+size.DC_disconect.h/2-size.terminal_diam
      });

      d.layer('DC_neg');
      d.line(
        [
          [ x, y+offset],
          [ x-size.fuse.w/2 , y+offset],
        ]
      );
      d.block( 'fuse', {
        x: x ,
        y: y+offset,
      });
      d.line([
        [ x+size.fuse.w/2 , y+offset],
        [ loc.DC_disconect.x+offset , y+offset],
        [ loc.DC_disconect.x+offset , loc.DC_disconect.y+size.DC_disconect.h/2-size.terminal_diam],
        [ loc.DC_disconect.x+offset , loc.DC_disconect.y+size.DC_disconect.h/2-size.terminal_diam-size.terminal_diam*3],
      ]);
      d.block( 'terminal', {
        x: loc.DC_disconect.x+offset,
        y: loc.DC_disconect.y+size.DC_disconect.h/2-size.terminal_diam
      });
      d.layer();
    }

    //d.layer('DC_ground');
    //d.line([
    //    [ loc.array.left , loc.array.lower + size.module.w + size.wire_offset.ground ],
    //    [ loc.array.right+size.wire_offset.ground , loc.array.lower + size.module.w + size.wire_offset.ground ],
    //    [ loc.array.right+size.wire_offset.ground , loc.array.y + size.module.w + size.wire_offset.ground],
    //    [ loc.array.x , loc.array.y+size.module.w+size.wire_offset.ground],
    //]);

    //d.layer();

    // Ground
    //offset = size.wire_offset.gap + size.wire_offset.ground;
    offset = size.wire_offset.ground;

    d.layer('DC_ground');
    d.line([
      [ x , y+offset],
      [ x , y+offset],
    ]);
    d.block( 'terminal', {
      x: x,
      y: y+offset,
    });
    d.line([
      [ x , y+offset],
      [ loc.DC_disconect.x+offset , y+offset],
      [ loc.DC_disconect.x+offset , loc.DC_disconect.y+size.DC_disconect.h/2-size.terminal_diam],
      [ loc.DC_disconect.x+offset , loc.DC_disconect.y+size.DC_disconect.h/2-size.terminal_diam-size.terminal_diam*3],
    ]);
    d.block( 'terminal', {
      x: loc.DC_disconect.x+offset,
      y: loc.DC_disconect.y+size.DC_disconect.h/2-size.terminal_diam
    });
    d.layer();





    ///////////////////////////////
    // DC disconect
    d.section("DC diconect");

    d.text(
      [loc.DC_disconect.x - size.DC_disconect.w/2 - 5, loc.DC_disconect.y],
      [
        'DC disconect'
      ],
      'text',
      'label_right'
    );

    d.rect(
      [loc.DC_disconect.x, loc.DC_disconect.y],
      [size.DC_disconect.w,size.DC_disconect.h],
      'box'
    );




    // DC disconect combiner d.lines

    x = loc.DC_disconect.x;
    y = loc.DC_disconect.y + size.DC_disconect.h/2;

    if( system.array.number_of_strings > 1){
      var offset_min = size.wire_offset.min;
      var offset_max = size.wire_offset.min + ( (system.array.number_of_strings -1) * size.wire_offset.base );
      d.line([
        [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
        [ x-offset_max, y-size.terminal_diam-size.terminal_diam*3],
      ], 'DC_pos');
      d.line([
        [ x+offset_min, y-size.terminal_diam-size.terminal_diam*3],
        [ x+offset_max, y-size.terminal_diam-size.terminal_diam*3],
      ], 'DC_neg');
    }

    // Inverter conection
    //d.line([
    //    [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
    //    [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
    //],'DC_pos');

    //offset = offset_max - offset_min;
    offset = size.wire_offset.min;

    // neg
    d.line([
      [ x+offset, y-size.terminal_diam-size.terminal_diam*3],
      [ x+offset, loc.inverter.y+size.inverter.h/2-size.terminal_diam ],
    ],'DC_neg');
    d.block( 'terminal', {
      x: x+offset,
      y: loc.inverter.y+size.inverter.h/2-size.terminal_diam,
    });

    // pos
    d.line([
      [ x-offset, y-size.terminal_diam-size.terminal_diam*3],
      [ x-offset, loc.inverter.y+size.inverter.h/2-size.terminal_diam ],
    ],'DC_pos');
    d.block( 'terminal', {
      x: x-offset,
      y: loc.inverter.y+size.inverter.h/2-size.terminal_diam,
    });

    // ground
    //offset = size.wire_offset.gap + size.wire_offset.ground;
    offset = size.wire_offset.ground;
    d.line([
      [ x+offset, y-size.terminal_diam-size.terminal_diam*3],
      [ x+offset, loc.inverter.y+size.inverter.h/2-size.terminal_diam ],
    ],'DC_ground');
    d.block( 'terminal', {
      x: x+offset,
      y: loc.inverter.y+size.inverter.h/2-size.terminal_diam,
    });

    //*/







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
      [loc.inverter.x, loc.inverter.top + size.inverter.text_gap ],
      [
        'Inverter',
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
    y = loc.inverter.y + size.inverter.symbol_h/2 + 15;

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

  }








  //#AC_disconnect
  if( section_defined(state.status.active_system, 'inverter') ){
    d.section("AC_discconect");

    d.text(
      [loc.AC_disc.x, loc.AC_disc.y - size.AC_disc.h *1/3 ],
      [
        'AC',
        'Disconect'
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

    d.text([x,y-h*0.4],
      [
        'Load',
        'Center'
      ],
      'text',
      'label'
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
    d.rect([l.x,l.y], [s.w,s.h], 'AC_ground' );

    d.block('ground', [l.x,l.y+s.h/2]);






    // AC lines
    d.section("AC lines");

    x = loc.inverter.bottom_right.x;
    y = loc.inverter.bottom_right.y;
    x -= size.terminal_diam;
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
      //d.text(
      //  [x+20,y-size.terminal_diam],
      //  line_name,
      //  'text',
      //  'label_left'
      //)
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



    // AC wire/conduit callout
    x = loc.AC_disc.left - 20;
    y = loc.AC_disc.y + 20;
    d.ellipse(
      [x, y],
      [10, 50],
      'wire_callout'
    );
    d.line(
      [
        [ x,      y + 50/2],
        [ loc.AC_disc.x - 15 , y + 50/2 + 30 ]
      ],
      'wire_callout'
    );
    d.text(
      [ loc.AC_disc.x , y + 50/2 + 30 ],
      [
        '(6,7)'
      ],
      'text',
      'label_center'
    );

    x = loc.AC_disc.right + 20;
    y = loc.AC_disc.y + 20;

    d.ellipse(
      [x, y],
      [10, 50],
      'wire_callout'
    );
    d.line(
      [
        [ x,                 y + 50/2],
        [ loc.AC_disc.x + 15 , y + 50/2 + 30 ]
      ],
      'wire_callout'
    );


  }











  // Wire table
  d.section("Wire table");

  ///*

  x = loc.wire_table.x;
  y = loc.wire_table.y;



  if( system.inverter.num_conductors ) {
    var n_rows = 10;
    var n_cols = 9;
    var row_height = 15;
    var column_width = [
      25,
      150,
      75,
      75,
      75,
      90
    ];

    h = n_rows*row_height;

    var t = d.table(n_rows,n_cols).loc(x,y);
    t.row_size('all', row_height);

    column_width.forEach(function(size, i){
      t.col_size(i+1, size);
    });

    t.all_cells().forEach(function(cell){
      cell.font('table').border('all');
    });

    var wire_section_list = [
      ['1','Intermodule Wiring (factory integrated)'],
      ['2','PV DC Source Circuits'],
      ['3','PV DC Output Circuits'],
      ['4','Inverter DC Input Circuit'], // (same as PV output circuits for single combiner)'],
      ['5','Inverter AC Output Circuit'],
      ['6','Service Equipment'],
      ['7','Grounding Electrode Conductor']
    ].forEach(function(label, i){
      t.cell(i+3,1).font('table').text( label[0] );
      t.cell(i+3,2).font('table_left').text( label[1] );
    });

    //t.cell(1,1).border('B', false);
    //t.cell(1,3).border('R', false);

    t.cell(1,3).font('table_left').text('Conductor');
    //t.cell(2,3).font('table').text('Conductors');
    //t.cell(2,3).font('table').text('AWG');
    //t.cell(2,4).font('table').text('Type');
    t.cell(1,4).font('table_left').text('Conduit');
    t.cell(1,5).font('table_left').text('Overcurrent');
    t.cell(1,6).font('table_left').text('Connector/Terminal ');

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
