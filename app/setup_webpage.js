


function setup_webpage(){
    var settings = g;

    var system_frame_id = 'system_frame';
    var title = 'PV drawing test';

    g.f.setup_body(title);

    var page = $('<div>').attr('class', 'page').appendTo($(document.body));
    //page.style('width', (settings.drawing_settings.size.drawing.w+20).toString() + 'px' )

    var system_frame = $('<div>').attr('id', system_frame_id).appendTo(page);


    var header_container = $('<div>').appendTo(system_frame);
    $('<span>').html('Please select your system spec below').attr('class', 'category_title').appendTo(header_container);
    $('<span>').html(' | ').appendTo(header_container);
    //$('<input>').attr('type', 'button').attr('value', 'clear selections').click(window.location.reload),
    $('<a>').attr('href', 'javascript:window.location.reload()').html('clear selections').appendTo(header_container);


    // System setup
    $('<div>').html('System Setup').attr('class', 'section_title').appendTo(system_frame);
    var config_frame = $('<div>').attr('id', 'config_frame').appendTo(system_frame);

    //console.log(section_selector);



    var location_div = $('<div>');

    var list_element = $('<ul>').appendTo(location_div);
    $('<li>').appendTo(list_element).append(
        $('<a>')
            .text('Wind Zone ')
            .attr('href', 'http://windspeed.atcouncil.org/')
            .attr('target', '_blank')
    );
    $('<li>').appendTo(list_element).append(
        $('<a>')
            .text('Climate Conditions')
            .attr('href', 'http://www.solarabcs.org/about/publications/reports/expedited-permit/map/index.html')
            .attr('target', '_blank')
    );

/*
    $('<iframe src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d3603459.854089046!2d-81.37028081834715!3d28.115916011428208!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1421954460385" width="485" height="300" frameborder="0" style="border:0"></iframe>')
        .appendTo(location_div);
    $('<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d546.6809043810994!2d-80.75649465851953!3d28.387302871406444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sus!4v1422038801287" width="485" height="300" frameborder="0" style="border:0"></iframe>')
        .appendTo(location_div);
//*/

    $('<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603348.697924068!2d-81.48660688926068!3d28.119223679502593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e0aa452b99af53%3A0x5e524913e44a8a65!2s1970+Michigan+Ave%2C+Cocoa%2C+FL+32922!5e0!3m2!1sen!2sus!4v1422050912489" width="485" height="300" frameborder="0" style="border:0"></iframe>')
        .appendTo(location_div);

    $('<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d323.1100977381417!2d-80.75332433820344!3d28.388875465695406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sus!4v1422051030319" width="485" height="300" frameborder="0" style="border:0"></iframe>')
        .appendTo(location_div);




    var location_drawer = g.f.mk_drawer('Location', location_div);
    location_drawer.appendTo(config_frame);


    g.f.add_selectors(settings, config_frame);

    // Parameters and specifications
    /*
    $('<div>').html('System Parameters').attr('class', 'section_title').appendTo(system_frame);
    var params_container = $('<div>').attr('class', 'section');
    params_container.appendTo(system_frame);
    f.add_params( settings, params_container );
    //*/

    //TODO: add svg display of modules
    // http://quote.snapnrack.com/ui/o100.php#step-2

    // drawing
    //var drawing = $('div').attr('id', 'drawing_frame').attr('class', 'section').appendTo(page);


    var drawing_preview = $('<div>').attr('id', 'drawing_frame_preview').appendTo(page);
    $('<div>').html('Preview').attr('class', 'section_title').appendTo(drawing_preview);
    $('<div>').attr('id', 'drawing_preview').attr('class', 'drawing').css('clear', 'both').appendTo(drawing_preview);





    var drawing_section = $('<div>').attr('id', 'drawing_frame').appendTo(page);
    //drawing.css('width', (settings.drawing_settings.size.drawing.w+20).toString() + 'px' );
    $('<div>').html('Drawing').attr('class', 'section_title').appendTo(drawing_section);


    //$('<form method="get" action="data/sample.pdf"><button type="submit">Download</button></form>').appendTo(drawing_section);
    //$('<span>').attr('id', 'download').attr('class', 'float_right').appendTo(drawing_section);
    $('<a>')
        .text('Download Drawing (sample)')
        .attr('href', 'data/sample.pdf')
        .attr('id', 'download')
        .attr('class', 'float_right')
        .attr('target', '_blank')
        .appendTo(drawing_section);

    var svg_container_object = $('<div>').attr('id', 'drawing').attr('class', 'drawing').css('clear', 'both').appendTo(drawing_section);
    //svg_container_object.style('width', settings.drawing_settings.size.drawing.w+'px' )
    //var svg_container = svg_container_object.elem;
    $('<br>').appendTo(drawing_section);

    ///////////////////
    $('<div>').html(' ').attr('class', 'section_title').appendTo(drawing_section);

}



module.exports = setup_webpage;
