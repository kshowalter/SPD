f.mk_blocks = function(settings){
  var state = settings.state;
  //console.log("** Making blocks");
  d = Drawing(settings);

  var f = settings.f;

  var system = state.system;

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;




  var x, y, h, w, l;
  var offset;

  // Define d.blocks



  // Module
  d.block_start('module');

  x = 0;
  y = 0+size.module.lead;
  w = size.module.frame.w;
  h = size.module.frame.h;

  d.layer('module');

  // frame
  d.rect( [x,y+h/2], [w,h] );
  d.rect( [x,y+h/4], [w*0.2,w*0.2] );

  /*
  // frame triangle?
  d.line([
    [x-w/2,y],
    [x,y+w/2],
  ]);
  d.line([
    [x,y+w/2],
    [x+w/2,y],
  ]);
  //*/

  // leads
  d.layer('DC_pos');
  d.line([
    [ x, y-size.module.lead ],
    [ x, y + h/4 - (w*0.2)/3 ]
  ]);
  d.layer('DC_neg');
  d.line([
    [ x, y + h/4 + (w*0.2)/3 ],
    [ x, y + h + (size.module.lead) ]
  ]);
  // pos sign
  d.layer('text');
  d.text(
    [ x + 5, y + h/4 - (w*0.2) ],
    '+',
    null,
    'signs'
  );
  // neg sign
  d.text(
    [ x + 5, y + h/4 + (w*0.2) ],
    '-',
    null,
    'signs'
  );
  // ground
  d.layer('DC_ground');
  d.line([
    [x-w/2+5, y],
    [x-w/2+5, y+h+size.module.lead*2],
  ]);
  //*/

  d.layer();
  d.block_end();





  // Module string
  d.block_start('string');

  x = 0;
  y = 0;
  w = size.module.frame.w;
  h = size.module.frame.h;

  var max_displayed_modules = 9;
  var break_string = false;

  if( system.array.modules_per_string > max_displayed_modules ){
    displayed_modules = max_displayed_modules - 1;
    break_string = true;
    size.string.h = (size.module.h * (displayed_modules+1) ) + size.string.gap_missing;
  } else {
    displayed_modules = system.array.modules_per_string;
    size.string.h = (size.module.h * displayed_modules);
  }

  loc.array.lower = loc.array.upper + size.string.h;

  if( displayed_modules === 1 ) {
    size.string.h = (size.module.h * 2);
  }


  size.string.h_max = (size.module.h * max_displayed_modules) + size.string.gap_missing;
  loc.array.lower_limit = loc.array.upper + size.string.h;

  for( var r=0; r<displayed_modules; r++){
    d.block('module', [x,y]);
    y += size.module.h;
  }

  if( break_string ) {
    d.line(
      [
        [x,y],
        [x,y+size.string.gap_missing],
      ],
      'DC_intermodule'
    );
    d.line(
      [
        [x-w/2+5,y],
        [x-w/2+5,y+size.string.gap_missing+size.module.lead*2], //size.wire_offset.ground
      ],
      'DC_ground_intermodule'
    );

    y += size.string.gap_missing;
    d.block('module', [x,y]);
  }


  //TODO: add loop to jump over negative return wires
  //d.layer('DC_ground');
  //d.line([
  //  [x-size.module.frame.w*3/4, y+size.module.h/2],
  //  [x-size.module.frame.w*3/4, y+size.string.h_max + size.wire_offset.ground],
  //  //[x-size.module.frame.w*3/4, y+size.string.h + size.wire_offset.ground ],
  //]);


  d.layer();
  d.block_end();






  // terminal
  d.block_start('terminal');
  x = 0;
  y = 0;

  d.layer('terminal');
  d.circ(
    [x,y],
    size.terminal_diam/2
  );
  d.layer();
  d.block_end();





  // fuse
  d.block_start('fuse');
  x = 0;
  y = 0;
  l = size.fuse.l;
  w = size.fuse.w;

  d.layer('base');

  d.block('terminal', [x, y] );

  d.line( [
    [x,y],
    [x+l/8, y]
  ]);
  x += l*1/8;

  x += l*3/8;
  d.rect(
    [x,y],
    [l*6/8,w]
  );
  d.line( [
    [x-l*7/32, y-w/2],
    [x-l*7/32, y+w/2]
  ]);
  d.line( [
    [x+l*7/32, y-w/2],
    [x+l*7/32, y+w/2]
  ]);
  x += l*3/8;

  d.line( [
    [x,y],
    [x+l/8, y]
  ]);
  x += l/8;

  d.block('terminal', [x, y] );

  d.layer();
  d.block_end();





  // Disconect
  d.block_start('disconect');
  x = 0;
  y = 0.1;

  d.layer('base');

  d.block('terminal', [x, y] );

  d.line( [
    [x,y],
    [x+size.disconect.l/4, y]
  ]);

  x = x + size.disconect.l*1/4;

  //switch
  d.line( [
    [x,y],
    [x+size.disconect.l/2 *5/6, y-size.disconect.l/2 *1/3]
  ]);

  x = x + size.disconect.l*1/2;
  d.line( [
    [x,y],
    [x+size.disconect.l/4, y]
  ]);

  d.block('terminal', [size.disconect.l, y] );

  d.layer();
  d.block_end();






  // ground symbol
  d.block_start('ground');
  x = 0;
  y = 0;

  d.layer('AC_ground_block');
  d.line([
    [x,y],
    [x,y+40],
  ]);
  y += 25;
  d.line([
    [x-7.5,y],
    [x+7.5,y],
  ]);
  y += 5;
  d.line([
    [x-5,y],
    [x+5,y],
  ]);
  y += 5;
  d.line([
    [x-2.5,y],
    [x+2.5,y],
  ]);
  d.layer();

  d.block_end();



  // North arrow
  x = 0;
  y = 0;

  var arrow_h = 50;
  var arrow_w = 7;
  var head_h = 14;

  d.block_start('north arrow_up');
  d.layer('north_letter');
  d.line([
    [x,         y-arrow_h/2+head_h],
    [x,         y-arrow_h/2       ],
    [x+arrow_w, y-arrow_h/2+head_h],
    [x+arrow_w, y-arrow_h/2       ],
  ]);
  d.layer('north_arrow');
  d.line([
    [x, y-arrow_h/2],
    [x, y+arrow_h/2],
  ]);
  d.line([
    //[x-arrow_w, y-arrow_h/2+head_h],
    [x,         y-arrow_h/2       ],
    [x+arrow_w, y-arrow_h/2+head_h],
  ]);
  d.layer();
  d.block_end('north arrow_up');



  //*/
  /// Slope arrow

  x = 0;
  y = 0;

  var arrow_h = 50;
  var arrow_w = 7;
  var head_h = 14;

  d.block_start('slope_arrow_down');

  d.text(
    [x+arrow_w*2,y],
    'DOWN SLOPE',
    'base'
  ).rotate(-90);

  d.layer('north_arrow');
  d.line([
    [x, y-arrow_h/2],
    [x, y+arrow_h/2],
  ]);
  d.line([
    [x-arrow_w/2, y+arrow_h/2-head_h],
    [x,           y+arrow_h/2       ],
    [x+arrow_w/2, y+arrow_h/2-head_h],
  ]);
  d.layer();
  d.block_end('slope_arrow_down');





  //////////
  /// simple_house

  d.block_start('simple_house');
  d.layer('site_map');

  w = 150;
  h = 100;

  // building
  d.rect(
    [x,y],
    [w,h]
  );
  // ridge line
  d.line([
      [x-w/2,y],
      [x+w/2,y],
    ]
  );
  d.text(
    [ x, y-5 ],
    'ridge line',
    'base'
  );

  // down slope arrow
  d.block( 'slope_arrow_down', {
    x: x + w*1/2 + 10,
    y: y + h/4
  }); //.rotate(rotations[state.system.roof.side_of_building]);

  // array rectagle
  var array_w = w/2;
  var array_h = h/4;
  y += h/4;

  d.rect(
    [x,y],
    [array_w,array_h]
  );

  // module lines
  // horizontal
  d.line([
      [x-array_w/2,y],
      [x+array_w/2,y],
    ]
  );
  // vert
  d.line([
      [x-array_w/4, y-array_h/2],
      [x-array_w/4, y+array_h/2],
    ]
  );
  d.line([
      [x, y-array_h/2],
      [x, y+array_h/2],
    ]
  );
  d.line([
      [x+array_w/4, y-array_h/2],
      [x+array_w/4, y+array_h/2],
    ]
  );



  d.layer();
  d.block_end('simple_house');
  //*/



  //////////
  /// road

  d.block_start('road');
  d.layer('site_map');

  w = 250;
  h = 25;

  d.line([
      [x-w/2,y+h/2],
      [x+w/2,y+h/2],
    ]
  );
  d.line([
      [x-w/2,y],
      [x+w/2,y],
    ],
    'road_center'
  );
  d.line([
      [x-w/2,y-h/2],
      [x+w/2,y-h/2],
    ]
  );

  d.layer();
  d.block_end('road');
  //*/




  return d;
};
