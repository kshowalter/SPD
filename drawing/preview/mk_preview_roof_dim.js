f.mk_preview['roof_dim'] = function(settings){
  //console.log("** Making preview 2");
  var d = Drawing(settings);


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




  var roof_height = 150;
  var roof_width = 300;
  var wall_height = 150;
  var wall_width = 300-40;

  x = 50 + roof_width/2;
  y = 100;

  d.poly([
      [x,y],
      [x+roof_width/2, y+roof_height],
      [x+wall_width/2, y+roof_height],
      [x+wall_width/2, y+roof_height+wall_height],
      [x-wall_width/2, y+roof_height+wall_height],
      [x-wall_width/2, y+roof_height],
      [x-roof_width/2, y+roof_height],
      [x,y],
    ],
    'preview_structural'
  );
  d.poly([
      [x+wall_width/2, y+roof_height],
      [x-wall_width/2, y+roof_height],
    ],
    'preview_structural'
  );

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

  return d.drawing_parts;
};
