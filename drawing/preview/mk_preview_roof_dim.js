

var dimention = function( drawing, point1, point2, gap_length, text_string, other_state ){
  var center_offset = 0;
  var text_offset = 0;
  if( other_state !== undefined ){
    if( other_state.center_offset ) {
      center_offset = other_state.center_offset;
    }
    if( other_state.text_offset ) {
      text_offset = other_state.text_offset;
    }
  }

  var center_point = geometry.center(point1,point2);
  center_point = geometry.move_toward( center_point, point2, center_offset );
  var label_point_1 = geometry.move_toward( center_point, point1, gap_length/2);
  var label_point_2 = geometry.move_toward( center_point, point2, gap_length/2);

  drawing.poly([ point1, label_point_1, ], 'preview_structural' );
  drawing.poly([ point2, label_point_2, ], 'preview_structural' );

  var bar_point1 = geometry.move_toward( point1, point2, 10 );
  var bar_point1a = geometry.rotate( bar_point1, point1, -90 );
  var bar_point1b = geometry.rotate( bar_point1, point1, 90 );

  var bar_point2 = geometry.move_toward( point2, point1, 10 );
  var bar_point2a = geometry.rotate( bar_point2, point2, -90 );
  var bar_point2b = geometry.rotate( bar_point2, point2, 90 );

  drawing.poly([ bar_point1a, bar_point1b ], 'preview_structural' );
  drawing.poly([ bar_point2a, bar_point2b ], 'preview_structural' );

  text_point = geometry.move_toward( center_point, point2, text_offset );
  text_point = geometry.rotate( text_point, center_point, 90 );
  drawing.text(text_point, text_string, 'preview_text', 'dimention');
};

f.mk_preview['roof_dim'] = function(state){
  //console.log("** Making preview 2");
  var d = Drawing(state);
  d.size = {
    h: 600,
    w: 550,
  };

  //var size = state.drawing_state.size;
  //var loc = state.drawing_state.loc;
  var system = state.system;

  //var x, y, h, w, section_x, section_y, length_p, scale;
  var x, y, h, w;

  //var slope = system.roof.slope.split(':')[0];
  //var angle_rad = Math.atan( Number(slope) /12 );
  //angle_rad = angle * (Math.PI/180);


  //length_p = system.roof.slope_length * Math.cos(angle_rad);
  //system.roof.height = system.roof.slope_length * Math.sin(angle_rad);

  //var roof_ratio = system.roof.slope_length / system.roof.eave_width;
  //var roof_plan_ratio = length_p / system.roof.eave_width;



  x = 150;
  y = 100;

  var roof_height = 100;
  var roof_width = 200;
  var wall_height = 100;
  var wall_width = roof_width-40;

  x += roof_width/2;

  d.poly([
      [x-roof_width/2, y+roof_height],
      [x,y],
    ],
    'preview_structural_roof_outline'
  );
  d.poly([
      [x,y],
      [x+roof_width/2, y+roof_height],
      [x+wall_width/2, y+roof_height],
      [x+wall_width/2, y+roof_height+wall_height],
      [x-wall_width/2, y+roof_height+wall_height],
      [x-wall_width/2, y+roof_height],
      [x-roof_width/2, y+roof_height],
    ],
    'preview_structural_roof_outline_dot'
  );
  d.poly([
      [x+wall_width/2, y+roof_height],
      [x-wall_width/2, y+roof_height],
    ],
    'preview_structural_roof_outline_dot'
  );



  var dim = {
    w: 25,
    label_space: 30,
  };

  var point1;
  var point2;

  // eave height dimention
  point1 = [
    x-roof_width/2 - 60,
    y+roof_height,
  ];
  point2 = [
    x-roof_width/2 - 60,
    y+roof_height+wall_height,
  ];

  dimention( d, point1, point2, dim.label_space, 'Eave Height' );

  // roof height dimention
  point1 = [
    x + 170,
    y
  ];
  point2 = [
    x + 170,
    y+roof_height+wall_height
  ];
  dimention( d, point1, point2, dim.label_space, 'Ridge Height', { center_offset:-50, text_offset:0 } );
  //dimention( d, point1, point2, dim.label_space, 'Ridge Height');

  // slope length dimention
  point1 = [
    x - 60,
    y - 60,
  ];
  point2 = [
    x-roof_width/2 - 60,
    y+roof_height - 60,
  ];
  dimention( d, point1, point2, dim.label_space*2, 'Slope Length' );





  if( state.system.roof.section_shape === 'Rectangle'){

    x = x + 30;
    y = 400;
    w = 200;
    h = 100;

    d.text( [x,y], 'Roof Section', 'preview_text', 'dimention');
    y += 20;
    y += h/2;

    d.rect( [x,y], [w,h], 'preview_structural_roof_outline_dot' );

    point1 = [
      x-w/2,
      y + h/2 + 30
    ];
    point2 = [
      x+w/2,
      y + h/2 + 30
    ];
    dimention( d, point1, point2, 160, 'Eave Width' );

    point1 = [
      x - w/2 - 90,
      y - h/2
    ];
    point2 = [
      x - w/2 - 90,
      y + h/2
    ];
    dimention( d, point1, point2, dim.label_space, 'Slope Length' );

    w -= 20;
    h -= 20;
    d.rect( [x,y], [w,h], 'preview_structural' );

    d.text( [x,y], 'PV Array', 'preview_text', 'dimention');
  }

  // eave Width dimention


  //d.text(
  //    [plan_x+plan_w+20, plan_y+plan_h/2],
  //    system.roof.eave_width.toString(),
  //    'dimention'
  //);

  /*
  x = 50 + roof_width + 100 + roof_width/2;
  y += roof_height/2;
  d.rect(
    [x,y],
    [roof_width,roof_height],
    'preview_structural'
  );

  y += roof_height/2 + wall_height/2;
  d.rect(
    [x,y],
    [wall_width,wall_height],
    'preview_structural'
  );
  //*/


  return d;
};
