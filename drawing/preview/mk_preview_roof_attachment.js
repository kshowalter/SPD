f.mk_preview['roof_attachment'] = function(settings){
  //console.log("** Making preview 2");

  var d = Drawing(settings);
  d.size = {
    w: 800,
    h: 800,
  };


  var sheet_section = 'S';
  var sheet_num = '01';
  //d.append(mk_border(settings, sheet_section, sheet_num ));

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;
  var system = state.system;



  if(! section_defined(state.status.active_system, 'roof') ) return d;



  var x, y, h, w, section_x, section_y, length_p, scale;

  var slope = system.roof.slope.split(':')[0];
  var angle_rad = Math.atan( Number(slope) /12 );
  //angle_rad = angle * (Math.PI/180);


  length_p = system.roof.slope_length * Math.cos(angle_rad);
  system.roof.height = system.roof.slope_length * Math.sin(angle_rad);

  var roof_ratio = system.roof.slope_length / system.roof.eave_width;
  var roof_plan_ratio = length_p / system.roof.eave_width;

  var array_modules = state.system.array.number_of_modules || 0;
  d.text(
    [50, 50],
    "Array modules: " + parseFloat( state.system.array.number_of_modules ).toFixed().toString(),
    'preview_text',
    'preview_roof'
  );
  var font = 'preview_text';
  if( array_modules !== state.webpage.selected_modules_total ){
    font = 'preview_text_warning';
  }
  d.text(
    [50, 85],
    "Selected modules: " + parseFloat( state.webpage.selected_modules_total ).toFixed().toString(),
    font,
    'preview_roof'
  );


  //////
  // roof detail

  var detail_x = 50;
  var detail_y = 120;

  var max_width = 650;
  var max_height = 650;

  if( Number(system.roof.eave_width) >= Number(system.roof.slope_length) ){
    scale = max_width/(system.roof.eave_width);
  } else {
    scale = max_height/(system.roof.slope_length);
  }

  var detail_w = system.roof.eave_width * scale;
  var detail_h = system.roof.slope_length * scale;


  var a = 3;
  var offset_a = a * scale;



  x = detail_x + detail_w + 25;
  y = detail_y + 120;



  /**
   *  Structural mounting rails and screw holes
   */

    // Draw Roof
  var roofX = detail_x;
  var roofY = detail_y;
  var roofWidth  = scale * system.roof.eave_width;
  var roofHeight = scale * system.roof.slope_length;

  d.rect(
      [roofX+roofWidth/2, roofY+roofHeight/2],
      [roofWidth, roofHeight],
      "preview_structural_poly_selected_framed"
  );
  d.line([
        [roofX,             roofY+offset_a],
        [roofX+roofWidth,   roofY+offset_a],
      ],
      "preview_structural_dot"
  );
  d.line([
        [roofX,           roofY+roofHeight-offset_a],
        [roofX+roofWidth, roofY+roofHeight-offset_a],
      ],
      "preview_structural_dot"
  );
  d.line([
        [roofX+offset_a, roofY],
        [roofX+offset_a, roofY+roofHeight],
      ],
      "preview_structural_dot"
  );
  d.line([
        [roofX+roofWidth-offset_a, roofY],
        [roofX+roofWidth-offset_a, roofY+roofHeight],
      ],
      "preview_structural_dot"
  );

    // Draw Module grid

    // Draw Rails


    // Draw screw holes




  //d.circ(
  //    [roofX-roofWidth/2, roofY-roofHeight/2],
  //    [2],
  //    "preview_structural_mounting_hole"
  //);
  //d.circ(
  //    [roofX+roofWidth-roofWidth/2, roofY-roofHeight/2],
  //    [2],
  //    "preview_structural_mounting_hole"
  //);
  //d.circ(
  //    [roofX-roofWidth/2, roofY+roofHeight-roofHeight/2],
  //    [2],
  //    "preview_structural_mounting_hole"
  //);
  //d.circ(
  //    [roofX+roofWidth-roofWidth/2, roofY+roofHeight-roofHeight/2],
  //    [2],
  //    "preview_structural_mounting_hole"
  //);

  //d.line([
  //      [diagramLocationX, diagramLocationY],
  //      [20, 20],
  //    ],
  //    "preview_structural_dot"
  //);
  //
  //d.circ(
  //    [diagramLocationX, diagramLocationY],
  //    20,
  //    "preview_structural_mounting_hole"
  //);
  //
  //d.circ(
  //    [diagramLocationX, diagramLocationY],
  //    [200],
  //    "preview_structural_mounting_hole"
  //);





  //////
  // Module options
  if( section_defined(state.status.active_system, 'array')){
    var r,c;

    var roof_length_avail = system.roof.slope_length - (a*2);
    var roof_width_avail = system.roof.eave_width - (a*2);

    var mm_to_inches = function(mm) { return mm / (25.4 /* mm per inch  */);  };
    var row_spacing;
    var col_spacing;
    if( system.array.module_orientation === 'Portrait' ){
      row_spacing = Number(mm_to_inches(system.array.module.length)) + 1;
      col_spacing = Number(mm_to_inches(system.array.module.width)) + 1;
      module_w = (Number(mm_to_inches(system.array.module.width)))/12;
      module_h = (Number(mm_to_inches(system.array.module.length)))/12;
    } else {
      row_spacing = Number(mm_to_inches(system.array.module.width)) + 1;
      col_spacing = Number(mm_to_inches(system.array.module.length)) + 1;
      module_w = (Number(mm_to_inches(system.array.module.length)))/12;
      module_h = (Number(mm_to_inches(system.array.module.width)))/12;
    }

    //console.log(system.array.module, module_w, module_h);

    row_spacing = row_spacing/12; //module dimensions are in inches
    col_spacing = col_spacing/12; //module dimensions are in inches

    var num_rows = Math.floor(roof_length_avail/row_spacing);
    var num_cols = Math.floor(roof_width_avail/col_spacing);

    //selected modules

    /*
    if( Meteor.isClient && ( num_cols !== settings.temp.num_cols || num_rows !== settings.temp.num_rows ) ){
      state.webpage.selected_modules = [];
      state.webpage.selected_modules_total = 0;

      for( r=1; r<=num_rows; r++){
        state.webpage.selected_modules[r] = [];
        for( c=1; c<=num_cols; c++){
          state.webpage.selected_modules[r][c] = false;
        }
      }


      settings.temp.num_cols = num_cols;
      settings.temp.num_rows = num_rows;
    }
    */

    x = detail_x + offset_a; //corner of usable space
    y = detail_y + offset_a;
    x += ( roof_width_avail - (col_spacing*num_cols))/2 *scale; // center array on roof
    y += ( roof_length_avail - (row_spacing*num_rows))/2 *scale;
    module_w = module_w * scale;
    module_h = module_h * scale;





    y = y;
    rails.setModules();
    var rail_sections = rails.getRails();
    for( r=1; r<=num_rows; r++){

      for( c=1; c<=num_cols; c++){

        var layer;
        if( state.webpage.selected_modules[r][c] ) layer = 'preview_structural_module_site_selected';
        else layer = 'preview_structural_module_site';
        module_x = (c-1) * col_spacing * scale;
        module_y = (r-1) * row_spacing * scale;


        d.rect(
            [x+module_x+module_w/2, y+module_y+module_h/2],
            [module_w, module_h],
            layer,
            {
              onclick: "settings.f.toggle_module(this)",
              module_ID:  (r) + ',' + (c)

            }
        );

      }
    }
    //console.log("rail_sections[%s]:", rail_sections.length, rail_sections);

    for( var r=0; r<rail_sections.length; r++)
    {
      var rail = rail_sections[r];

      var railStart = {
        x: rail.start.c * col_spacing * scale,
        y: rail.start.r * row_spacing * scale
      };

      var railEnd = {
        x: rail.end.c * col_spacing * scale,
        y: rail.end.r * row_spacing * scale
      };


      var offset = {
        top: (1/4)*module_h,
        bottom: (3/4)*module_h,
        margin: (1/12)*module_h
      };

      ////Top Rail
      //d.line([
      //      [x+railStart.x-offset.margin,          y+railStart.y+offset.top],
      //      [x+railEnd.x+module_w+offset.margin,   y+railEnd.y+offset.top],
      //    ],
      //    "preview_structural"
      //);
      //
      ////Bottom Rail
      //d.line([
      //      [x+railStart.x-offset.margin,          y+railStart.y+offset.bottom],
      //      [x+railEnd.x+module_w+offset.margin,   y+railEnd.y+offset.bottom],
      //    ],
      //    "preview_structural"
      //);

      //Mounting Holes
      var truss_spacing = 2 * scale; //2 feet between each truss

      var firstScrew = true;
      for(var n=x; n<x+((num_cols+1) * (col_spacing+1) * scale); n+=truss_spacing)
      {
        if((n+truss_spacing >= x+railStart.x) && (n-truss_spacing <= x+railEnd.x+module_w))
        {
          if(firstScrew) {
            firstScrew = false;
            continue;
          }
          //Top Rail
          d.line([
                [n-truss_spacing-truss_spacing/4,  y+railStart.y+offset.top],
                [n+truss_spacing/4,                y+railEnd.y+offset.top],
              ],
              "preview_structural"
          );

          //Bottom Rail
          d.line([
                [n-truss_spacing-truss_spacing/4,  y+railStart.y+offset.bottom],
                [n+truss_spacing/4,                y+railEnd.y+offset.bottom],
              ],
              "preview_structural"
          );

        }

      }

      //Mounting Holes
      for(var n=x; n<x+((num_cols+1) * col_spacing * scale); n+=truss_spacing)
      {
        if((n+truss_spacing >= x+railStart.x) && (n-truss_spacing <= x+railEnd.x+module_w))
        {

          d.circ(
              [n, y+railStart.y+offset.top],
              [5],
              "preview_structural_mounting_hole"
          );

          d.circ(
              [n, y+railEnd.y+offset.bottom],
              [5],
              "preview_structural_mounting_hole"
          );
        }
      }
    }
  }



  return d;
};
