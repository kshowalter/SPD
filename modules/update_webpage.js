

var update_webpage = function(){
    var settings = g;
    var f = g.f;

    // Make preview


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
    //console.log( $('#config_frame').children().map(function(){return this.id;}).get() );
    //$('#section_location')
    //    .append(settings.drawing.preview_svgs['elec']);
    //$('#section_map')
    //    .append(settings.drawing.preview_svgs['elec']);




// update web page
    // set maps markers
    if( g.perm.location.lat && g.perm.location.lon) {
        f.set_sat_map_marker();
    }

    // change user inputs to defaults if needed.
    // This also updates the drop list elements that are dependent on other inputs ( model list is based on selected make).
    settings.select_registry.forEach(function(selector){
        if( selector.type === 'select' ){
            f.selector_add_options(selector);
        } else if( selector.type === 'number_input' || selector.type === 'text_input' ) {
            selector.elem.value = selector.system_ref.get();
        }
    });

    // Determine active section based on section inputs entered by user
    var sections = g.webpage.sections;
    var active_section;
    sections.every(function(section_name,id){ //TODO: find pre IE9 way to do this?
        if( ! g.f.section_defined(g, section_name) ){
            active_section = section_name;
            console.log('active section:', section_name);
            return false;
        } else {
            if( id === sections.length-1 ){ //If last section is defined, there is no active section
                active_section = false;
            }
            return true;
        }
    });

    // Close section if they are not active sections, unless they have been opened by the user, open the active section
    sections.forEach(function(section_name,id){ //TODO: find pre IE9 way to do this?
        var svg_drawing_container = $('#section_'+section_name).children('.drawer').children('.drawer_content').children('.svg_drawing_container');
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
    //If the location is defined, open the map.
    /*
    if( (! g.webpage.selections_manual_toggled.location) &&  g.f.section_defined(g, 'location') ){
            $('#section_map').children('.drawer').children('.drawer_content').slideDown('fast');
    }
    //*/





    var p;
    /*
    $('#drawing_preview').empty();
    for( p in f.mk_preview ){  // f.mk_sheet_num is a array of page making functions, so this will loop through the number of pages
        //settings.drawing.preview_svgs[p] = f.mk_svg(settings.drawing.preview_parts[p], settings.drawing_settings);
        var section = ['','Electrical','Structural'][p];
        $('#drawing_preview')
            //.append($('<p>Page '+p+'</p>'))
            .append($('<p>'+section+'</p>'))
            .append($(settings.drawing.preview_svgs[p]))
            .append($('</br>'))
            .append($('</br>'));

    }
    //*/

    // Add drawing to page
    $('#drawing').empty();
    for( p in settings.drawing.parts ){  // f.mk_sheet_num is a array of page making functions, so this will loop through the number of pages
        settings.drawing.svgs[p] = f.mk_svg(settings.drawing.parts[p], settings.drawing_settings);
        $('#drawing')
            //.append($('<p>Page '+p+'</p>'))
            .append($(settings.drawing.svgs[p]))
            .append($('</br>'))
            .append($('</br>'));

    }


};


module.exports = update_webpage;
