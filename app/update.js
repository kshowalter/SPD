

var update = function(){
    var settings = g;
    var f = g.f;

    console.log('/--- begin update');
    f.clear_drawing();


    settings.select_registry.forEach(function(selector){
        //console.log(selector.value());
        if(selector.value()) selector.system_ref.set(selector.value());
        //if(selector.value()) selector.input_ref.set(selector.value());
        //console.log(selector.set_ref.refString, selector.value(), selector.set_ref.get());

    });

    if( g.perm.location.lat && g.perm.location.lon) {
        f.set_sat_map_marker();
    }
    //copy inputs from settings.input to settings.system.


    f.settings_update(settings);

    settings.select_registry.forEach(function(selector){
        if( selector.type === 'select' ){
            f.selector_add_options(selector);
        } else if( selector.type === 'number_input' || selector.type === 'text_input' ) {
            selector.elem.value = selector.system_ref.get();
        }
    });

    settings.value_registry.forEach(function(value_item){
        value_item.elem.innerHTML = value_item.value_ref.get();
    });

    // Determine active section based on section inputs entered by user
    var sections = g.webpage.sections;
    var active_section;
    sections.every(function(section_name,id){ //TODO: find pre IE9 way to do this?
        if( ! g.f.section_defined(section_name) ){
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
        if( section_name === active_section ){
            $('#section_'+section_name).children('.drawer').children('.drawer_content').slideDown('fast');
        } else if( ! g.webpage.selections_manual_toggled[section_name] ){
            $('#section_'+section_name).children('.drawer').children('.drawer_content').slideUp('fast');
        }
    });
    //If the location is defined, open the map.
    if( (! g.webpage.selections_manual_toggled.location) &&  g.f.section_defined('location') ){
            $('#section_map').children('.drawer').children('.drawer_content').slideDown('fast');
    }

    // Make blocks
    f.mk_blocks();

    // Make preview
    settings.drawing.preview_parts = {};
    settings.drawing.preview_svgs = {};
    $('#drawing_preview').empty().html('');
    for( var p in f.mk_preview ){
        settings.drawing.preview_parts[p] = f.mk_preview[p](settings);
        settings.drawing.preview_svgs[p] = f.mk_svg(settings.drawing.preview_parts[p], settings);
        var section = ['','Electrical','Structural'][p];
        $('#drawing_preview')
            //.append($('<p>Page '+p+'</p>'))
            .append($('<p>'+section+'</p>'))
            .append($(settings.drawing.preview_svgs[p]))
            .append($('</br>'))
            .append($('</br>'));

    }



    // Make drawing
    settings.drawing.parts = {};
    settings.drawing.svgs = {};
    $('#drawing').empty().html('Electrical');
    for( p in f.mk_page ){
        settings.drawing.parts[p] = f.mk_page[p](settings);
        settings.drawing.svgs[p] = f.mk_svg(settings.drawing.parts[p], settings);
        $('#drawing')
            //.append($('<p>Page '+p+'</p>'))
            .append($(settings.drawing.svgs[p]))
            .append($('</br>'))
            .append($('</br>'));

    }


    //var site_plan_element = document.createElementNS("http://www.w3.org/2000/svg", "image");
    //var site_plan_img = $(site_plan_element)
    //    .attr('x',100)
    //    .attr('y',100)
    //    .prependTo(
    //        $('#drawing').children('.svg_drawing')[0]
    //    );
    //L_PREFER_CANVAS = true;
    //var map = g.perm.maps.map_road;
    //leafletImage( map, function(err, canvas) {
    //    // now you have canvas
    //    // example thing to do with that canvas:
    //    var img = document.createElement('img');
    //    var dimensions = map.getSize();
    //    img.width = dimensions.x;
    //    img.height = dimensions.y;
    //    img.src = canvas.toDataURL();
    //    console.log(img);
    //    $('body').append(img);
    //});


    console.log('\\--- end update');
};


module.exports = update;
