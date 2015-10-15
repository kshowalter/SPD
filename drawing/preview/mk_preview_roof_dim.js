f.mk_preview['roof_dim'] = function(settings){
  //console.log("** Making preview 2");
  var d = Drawing(settings);
  d.size = {
    h: 600,
    w: 500,
  };

  //var size = settings.drawing_settings.size;
  //var loc = settings.drawing_settings.loc;
  var system = settings.system;

  //var x, y, h, w, section_x, section_y, length_p, scale;
  var x, y, h, w;

  //var slope = system.roof.slope.split(':')[0];
  //var angle_rad = Math.atan( Number(slope) /12 );
  //angle_rad = angle * (Math.PI/180);


  //length_p = system.roof.slope_length * Math.cos(angle_rad);
  //system.roof.height = system.roof.slope_length * Math.sin(angle_rad);

  //var roof_ratio = system.roof.slope_length / system.roof.width1;
  //var roof_plan_ratio = length_p / system.roof.width1;



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
    w: 20,
    label_space: 30,
  };

  // eave height dimention
  var x1 = x-roof_width/2 - 60;
  var y1 = y+roof_height;
  var x2 = x1;
  var y2 = y+roof_height+wall_height;
  ////////////////
  var center_point = geometry.center({x:x1,y:y1}, {x:x2,y:y2} );
  var label_point_1 = geometry.move_toward( center_point, {x:x1,y:y1}, dim.label_space/2);
  var label_point_2 = geometry.move_toward( center_point, {x:x2,y:y2}, dim.label_space/2);
  d.poly([ [x1-dim.w/2, y1], [x1+dim.w/2, y1], ], 'preview_structural' );
  d.poly([ [x2-dim.w/2, y2], [x2+dim.w/2, y2], ], 'preview_structural' );
  d.poly([ [x1, y1], [label_point_1.x, label_point_1.y ], ], 'preview_structural' );
  d.poly([ [x2, y2], [label_point_2.x, label_point_2.y ], ], 'preview_structural' );
  d.text(center_point, 'Eave Height', null, 'dimention');


  // roof height dimention
  var x1 = x + 30;
  var y1 = y;
  var x2 = x1;
  var y2 = y+roof_height+wall_height;
  ////////////////
  var center_point_2 = geometry.center({x:x1,y:y1}, {x:x2,y:y2} );
  var center_point = {
    x: center_point_2.x,
    y: center_point.y
  }
  var label_point_1 = geometry.move_toward( center_point, {x:x1,y:y1}, dim.label_space/2);
  var label_point_2 = geometry.move_toward( center_point, {x:x2,y:y2}, dim.label_space/2);
  d.poly([ [x1-dim.w/2, y1], [x1+dim.w/2, y1], ], 'preview_structural' );
  d.poly([ [x2-dim.w/2, y2], [x2+dim.w/2, y2], ], 'preview_structural' );
  d.poly([ [x1, y1], [label_point_1.x, label_point_1.y ], ], 'preview_structural' );
  d.poly([ [x2, y2], [label_point_2.x, label_point_2.y ], ], 'preview_structural' );
  console.log(center_point);
  center_point.x += -30;
  console.log(center_point);
  d.text(center_point, 'Ridge Height', null, 'dimention');

  // slope length dimention
  var x1 = x - 60;
  var y1 = y - 60;
  var x2 = x-roof_width/2 - 60;
  var y2 = y+roof_height - 60;
  ////////////////
  var center_point = geometry.center({x:x1,y:y1}, {x:x2,y:y2} );
  var label_point_1 = geometry.move_toward( center_point, {x:x1,y:y1}, dim.label_space/2);
  var label_point_2 = geometry.move_toward( center_point, {x:x2,y:y2}, dim.label_space/2);
  d.poly([ [x1 -dim.w/2, y1 -dim.w/2], [x1 +dim.w/2, y1 +dim.w/2], ], 'preview_structural' );
  d.poly([ [x2 -dim.w/2, y2 -dim.w/2], [x2 +dim.w/2, y2 +dim.w/2], ], 'preview_structural' );
  d.poly([ [x1, y1], [label_point_1.x, label_point_1.y ], ], 'preview_structural' );
  d.poly([ [x2, y2], [label_point_2.x, label_point_2.y ], ], 'preview_structural' );
  d.text(center_point, 'Slope Length', null, 'dimention');



  x = x;
  y = 400;
  w = 200;
  h = 100;

  d.text( [x,y], 'Roof section', null, 'dimention');
  y += 20;
  y += h/2;

  if( settings.system.roof.section_shape === 'Rectangle'){
    d.rect(
      [x,y],
      [w,h],
      'preview_structural'
    );

  }

  // eave Width dimention
  var x1 = x-w/2;
  var y1 = y + h/2 + 30;
  var x2 = x+w/2;
  var y2 = y1;
  ////////////////
  var center_point = geometry.center({x:x1,y:y1}, {x:x2,y:y2} );
  var label_point_1 = geometry.move_toward( center_point, {x:x1,y:y1}, 80);
  var label_point_2 = geometry.move_toward( center_point, {x:x2,y:y2}, 80);
  d.poly([ [x1, y1-dim.w/2], [x1, y1+dim.w/2], ], 'preview_structural' );
  d.poly([ [x2, y2-dim.w/2], [x2, y2+dim.w/2], ], 'preview_structural' );
  d.poly([ [x1, y1], [label_point_1.x, label_point_1.y ], ], 'preview_structural' );
  d.poly([ [x2, y2], [label_point_2.x, label_point_2.y ], ], 'preview_structural' );
  d.text(center_point, 'Eave Width', null, 'dimention');


  //d.text(
  //    [plan_x+plan_w+20, plan_y+plan_h/2],
  //    system.roof.width1.toString(),
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
