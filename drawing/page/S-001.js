f.mk_sheet_num['S-001'] = function(settings){
  var f = settings.f;

  d = Drawing(settings);

  var sheet_section = 'S';
  var sheet_num = '01';
  //d.append(mk_border(settings, sheet_section, sheet_num ));

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;
  var system = settings.system;



  if( section_defined(settings.state.active_system, 'roof') ){

    var x, y, h, w, section_x, section_y, length_p, scale;

    var slope = system.roof.slope.split(':')[0];
    var angle_rad = Math.atan( Number(slope) /12 );
    //angle_rad = angle * (Math.PI/180);


    length_p = system.roof.slope_length * Math.cos(angle_rad);
    system.roof.height = system.roof.slope_length * Math.sin(angle_rad);

    var roof_ratio = system.roof.slope_length / system.roof.width1;
    var roof_plan_ratio = length_p / system.roof.width1;


    if( system.roof.type === "Gable"){


      ///////
      // Rood plan view
      var plan_x = 60;
      var plan_y = 60;

      var plan_w, plan_h;
      if( length_p*2 > system.roof.width1 ){
        scale = 200/(length_p*2);
        plan_w = (length_p*2) * scale;
        plan_h = plan_w / (length_p*2 / system.roof.width1);
      } else {
        scale = 300/(system.roof.width1);
        plan_h = system.roof.width1 * scale;
        plan_w = plan_h * (length_p*2 / system.roof.width1);
      }

      d.rect(
        [plan_x+plan_w/2, plan_y+plan_h/2],
        [plan_w, plan_h],
        "preview_structural"
      );

      d.poly([
        [plan_x       , plan_y],
        [plan_x+plan_w/2, plan_y],
        [plan_x+plan_w/2, plan_y+plan_h],
        [plan_x,        plan_y+plan_h],
        [plan_x       , plan_y],
      ],
      "preview_structural_poly_unselected"
    );
    d.poly([
      [plan_x+plan_w/2       , plan_y],
      [plan_x+plan_w/2+plan_w/2, plan_y],
      [plan_x+plan_w/2+plan_w/2, plan_y+plan_h],
      [plan_x+plan_w/2,        plan_y+plan_h],
      [plan_x+plan_w/2       , plan_y],
    ],
    "preview_structural_poly_selected"
  );

  d.line([
    [plan_x+plan_w/2, plan_y],
    [plan_x+plan_w/2, plan_y+plan_h]
  ],
  "preview_structural_dot"
);

/*
d.text(
[plan_x-20, plan_y+plan_h/2],
system.roof.slope_length.toString(),
'dimention'
);
*/

d.text(
  [plan_x+plan_w+20, plan_y+plan_h/2],
  system.roof.width1.toString(),
  'dimention',
  'dimention'
);


x = plan_x + 120;
y = plan_y - 20;

d.block('north arrow_left', [x,y]);


////////
// roof crossection

var cs_x = plan_x;
var cs_y = plan_y + plan_h + 50;
var cs_h = system.roof.height * scale;
var cs_w = plan_w/2;

d.line([
  [cs_x+cs_w,   cs_y],
  [cs_x+cs_w,   cs_y+cs_h],
],
"preview_structural_dot"
);
d.line([
  [cs_x+cs_w,   cs_y],
  [cs_x+cs_w*2, cs_y+cs_h],
  [cs_x,        cs_y+cs_h],
  [cs_x+cs_w,   cs_y],
],
"preview_structural"
);
d.text(
  [cs_x+cs_w-15, cs_y+cs_h*2/3],
  parseFloat( system.roof.height ).toFixed().toString(),
  'dimention',
  'dimention'
);
d.text(
  [cs_x+cs_w*1.5+20, cs_y+cs_h/3],
  parseFloat( system.roof.slope_length ).toFixed().toString(),
  'dimention',
  'dimention'
);



//////
// roof detail

var detail_x = 30+400;
var detail_y = 30;

if( Number(system.roof.width1) >= Number(system.roof.slope_length) ){
  scale = 350/(system.roof.width1);
} else {
  scale = 350/(system.roof.slope_length);
}
var detail_w = system.roof.width1 * scale;
var detail_h = system.roof.slope_length * scale;

d.rect(
  [detail_x+detail_w/2, detail_y+detail_h/2],
  [detail_w, detail_h],
  "preview_structural_poly_selected_framed"
);

var a = 3;
var offset_a = a * scale;

d.line([
  [detail_x,   detail_y+offset_a],
  [detail_x+detail_w,   detail_y+offset_a],
],
"preview_structural_dot"
);
d.line([
  [detail_x,          detail_y+detail_h-offset_a],
  [detail_x+detail_w, detail_y+detail_h-offset_a],
],
"preview_structural_dot"
);
d.line([
  [detail_x+offset_a, detail_y],
  [detail_x+offset_a, detail_y+detail_h],
],
"preview_structural_dot"
);
d.line([
  [detail_x+detail_w-offset_a, detail_y],
  [detail_x+detail_w-offset_a, detail_y+detail_h],
],
"preview_structural_dot"
);

d.text(
  [detail_x-40, detail_y+detail_h/2],
  parseFloat( system.roof.slope_length ).toFixed().toString(),
  'dimention',
  'dimention'
);
d.text(
  [detail_x+detail_w/2, detail_y+detail_h+40],
  parseFloat( system.roof.width1 ).toFixed().toString(),
  'dimention',
  'dimention'
);

d.text(
  [detail_x+ (offset_a)/2, detail_y+detail_h+15],
  'a',
  'dimention',
  'dimention'
);
d.text(
  [detail_x+detail_w-(offset_a)/2, detail_y+detail_h+15],
  'a',
  'dimention',
  'dimention'
);
d.text(
  [detail_x-15, detail_y+detail_h-(offset_a)/2],
  'a',
  'dimention',
  'dimention'
);
d.text(
  [detail_x-15, detail_y+(offset_a)/2],
  'a',
  'dimention',
  'dimention'
);

x = detail_x + detail_w + 25;
y = detail_y + 120;

d.block('north arrow_up', [x,y]);



//////
// Module options
if( section_defined(settings.state.active_system, 'module') && section_defined(settings.state.active_system, 'array')){
  var r,c;

  var roof_length_avail = system.roof.slope_length - (a*2);
  var roof_width_avail = system.roof.width1 - (a*2);

  var row_spacing;
  if( system.module.orientation === 'Portrait' ){
    row_spacing = Number(system.module.length) + 1;
    col_spacing = Number(system.module.width) + 1;
    module_w = (Number(system.module.width)  )/12;
    module_h = (Number(system.module.length) )/12;
  } else {
    row_spacing = Number(system.module.width) + 1;
    col_spacing = Number(system.module.length) + 1;
    module_w = (Number(system.module.length))/12;
    module_h = (Number(system.module.width) )/12;
  }

  row_spacing = row_spacing/12; //module dimentions are in inches
  col_spacing = col_spacing/12; //module dimentions are in inches

  var num_rows = Math.floor(roof_length_avail/row_spacing);
  var num_cols = Math.floor(roof_width_avail/col_spacing);

  //selected modules

  if( num_cols !== settings.temp.num_cols || num_rows !== settings.temp.num_rows ){
    settings.webpage.selected_modules = {};
    settings.webpage.selected_modules_total = 0;

    for( r=1; r<=num_rows; r++){
      settings.webpage.selected_modules[r] = {};
      for( c=1; c<=num_cols; c++){
        settings.webpage.selected_modules[r][c] = false;
      }
    }


    settings.temp.num_cols = num_cols;
    settings.temp.num_rows = num_rows;
  }


  x = detail_x + offset_a; //corner of usable space
  y = detail_y + offset_a;
  x += ( roof_width_avail - (col_spacing*num_cols))/2 *scale; // center array on roof
  y += ( roof_length_avail - (row_spacing*num_rows))/2 *scale;
  module_w = module_w * scale;
  module_h = module_h * scale;



  for( r=1; r<=num_rows; r++){

    for( c=1; c<=num_cols; c++){

      var layer;
      if( settings.webpage.selected_modules[r][c] ) layer = 'preview_structural_module_selected';
      else layer = 'preview_structural_module';
      module_x = (c-1) * col_spacing * scale;
      module_y = (r-1) * row_spacing * scale;

      d.rect(
        [x+module_x+module_w/2, y+module_y+module_h/2],
        [module_w, module_h],
        layer,
        {
          onclick: "g.f.toggle_module(this)",
          module_ID:  (r) + ',' + (c)

        }
      );

    }
  }

  d.text(
    [detail_x+detail_w/2, detail_y+detail_h+100],
    [
      "Selected modules: " + parseFloat( settings.webpage.selected_modules_total ).toFixed().toString(),
      "Calculated modules: " + parseFloat( settings.system.array.number_of_modules ).toFixed().toString(),
    ],
    'dimention',
    'dimention'
  );

}




}
}






return d.drawing_parts;
};
