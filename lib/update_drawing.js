update_drawing = function(settings){

  // Make blocks
  f.mk_blocks(settings);

  // Make drawing
  var i, p;
  settings.drawing.parts = {};
  settings.drawing.svgs = [];
  settings.drawing_settings.sheets.forEach(function(sheet_info, i){
      p = i+1;
      settings.drawing.parts[p] = mk_sheet(settings, sheet_info);
      settings.drawing.svgs.push(
        f.mk_svg(settings.drawing.parts[p], settings)
      );
  });

<<<<<<< Updated upstream
///*


  if( Meteor.isClient ){

    // create previews
    settings.drawing.preview_parts = {};
    settings.drawing.preview_svgs = {};
    for( var name in f.mk_preview ){  // f.mk_sheet_num is a array of page making functions, so this will loop through the number of pages
        settings.drawing.preview_parts[name] = f.mk_preview[name](settings);
        settings.drawing.preview_svgs[name] = f.mk_svg(settings.drawing.preview_parts[name], settings);
    }

    var preview_table = {
        'location': [],
        'map': [],
        'roof': [ settings.drawing.preview_svgs['roof'] ],
        'module': [ settings.drawing.preview_svgs['elec'], settings.drawing.preview_svgs['roof'] ],
        'array': [ settings.drawing.preview_svgs['elec'] ],
        'DC': [ settings.drawing.preview_svgs['elec'] ],
        'inverter': [ settings.drawing.preview_svgs['elec'] ],
        'AC': [ settings.drawing.preview_svgs['elec'] ],
        'attachment_system': [ settings.drawing.preview_svgs['roof'] ],
    };

    settings.webpage.sections.forEach(function(section_name){
        var svg_drawing_container = $('#section_'+section_name)
          .children('.svg_drawing_container');
        svg_drawing_container.empty();
        if(preview_table[section_name]) preview_table[section_name].forEach(function(preview_svg){
            svg_drawing_container.append(
                $(preview_svg).clone()
                    .attr('class', 'svg_drawing_preview')
            );
        });
    });
  }


=======
>>>>>>> Stashed changes
  return settings;
};
