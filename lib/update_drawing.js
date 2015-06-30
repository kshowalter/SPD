update_drawing = function(){
  
  // Update drawing

  // Make blocks
  f.mk_blocks(settings);


  // Make drawing
  var i, p;

  // Not needed on server


  settings.drawing.parts = {};
  settings.drawing.svgs = [];

  for( var page_name in f.mk_sheet_num ){

  }
  settings.drawing_settings.sheets.forEach(function(sheet_info, i){
      p = i+1;
      settings.drawing.parts[p] = mk_sheet(settings, sheet_info);

      if( Meteor.isClient ){
        settings.drawing.svgs.push(
          f.mk_svg(settings.drawing.parts[p], settings.drawing_settings)
        );
      }

//        settings.drawing.parts[p] = f.mk_sheet_num[p](settings);
  });

  if( Meteor.isclient ){
    // create previews
    settings.drawing.preview_parts = {};
    settings.drawing.preview_svgs = {};
    for( var name in f.mk_preview ){  // f.mk_sheet_num is a array of page making functions, so this will loop through the number of pages
        settings.drawing.preview_parts[name] = f.mk_preview[name](settings);
        settings.drawing.preview_svgs[name] = f.mk_svg(settings.drawing.preview_parts[name], settings.drawing_settings);
    }

    var preview_table = {
        'section_location': [],
        'section_map': [],
        'section_roof': [ settings.drawing.preview_svgs['roof'] ],
        'section_module': [ settings.drawing.preview_svgs['elec'], settings.drawing.preview_svgs['roof'] ],
        'section_array': [ settings.drawing.preview_svgs['elec'] ],
        'section_DC': [ settings.drawing.preview_svgs['elec'] ],
        'section_inverter': [ settings.drawing.preview_svgs['elec'] ],
        'section_AC': [ settings.drawing.preview_svgs['elec'] ],
        'section_attachment_system': [ settings.drawing.preview_svgs['roof'] ],
    };


    settings.webpage.sections.forEach(function(section_name,id){ //TODO: find pre IE9 way to do this?
        var svg_drawing_container = $('#section_'+section_name)
          .children('.drawer')
          .children('.drawer_content')
          .children('.svg_drawing_container');
        svg_drawing_container.empty();
        console.log(section_name);
        preview_table['section_'+section_name].forEach(function(preview_svg){
            svg_drawing_container.append(
                $(preview_svg).clone()
                    .attr('class', 'svg_drawing_preview')
            );
        });

        if( section_name === active_section ){
            $('#section_'+section_name).children('.drawer').children('.drawer_content').slideDown('fast');

        } else if( ! g.webpage.selections_manual_toggled[section_name] ){
            $('#section_'+section_name).children('.drawer').children('.drawer_content').slideUp('fast');
        }
    });

  }
};
