


function setup_webpage(){
    var settings = g;
    var f = g.f;

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

    g.f.add_selectors(settings, config_frame);
    //console.log(section_selector);



    //var location_drawer = $('#section_location').children('.drawer').children('.drawer_content');
    //console.log(location_drawer);


    var map_div = $('<div>');
    var map_drawer = f.mk_drawer('map',map_div)
                        //.appendTo(config_frame);
                        .insertAfter( $('#section_location') );
    map_drawer.children('.drawer').children('.drawer_content').slideUp('fast');

    var list_element = $('<ul>').appendTo(map_div);
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



    $('<div>')
        .attr('id', 'map_road')
        .attr('class', 'map_road')
        .attr('style', 'width:485px;height:380px')
        .appendTo(map_div);
    $('<div>')
        .attr('id', 'map_sat')
        .attr('class', 'map_sat')
        .attr('style', 'width:485px;height:380px')
        .appendTo(map_div);





    var lat_fl_center = 27.75;
    var lon_fl_center = -84.0;

    var lat = 28.387399;
    var lon = -80.757833;
    var coor = [-80.757833, 28.387399];





    var map_road  = g.perm.maps.map_road = L.map( 'map_road', {
        center: [lat_fl_center, lon_fl_center],
        zoom: 6
    });

    L.tileLayer( 'http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors | Tiles Courtesy of <a href="http://www.mapquest.com/" title="MapQuest" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" width="16" height="16">',
        subdomains: ['otile1','otile2','otile3','otile4']
    }).addTo( map_road );

    g.perm.maps.marker_road = L.marker([lat,lon]).addTo(map_road);

    map_road.on('click', f.set_coordinates_from_map );




    var map_sat = g.perm.maps.map_sat = L.map( 'map_sat', {
        center: [lat, lon],
        zoom: 16
    });
    L.tileLayer( 'http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png', {
        subdomains: ['otile1','otile2','otile3','otile4']
    }).addTo( map_sat );

    g.perm.maps.marker_sat = L.marker([lat,lon]).addTo(map_sat);

    map_sat.on('click', f.set_coordinates_from_map );





    //*/
    /*

    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.MapQuest({layer: 'osm'})
            })
        ],
        view: new ol.View({
            center: ol.proj.transform(coor, 'EPSG:4326', 'EPSG:3857'),
            zoom: 6
        })
    });
    map.on('change', function(e){
        console.log(e);
    });

    var map_sat = new ol.Map({
        target: 'map_sat',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.MapQuest({layer: 'sat'})
            })
        ],
        view: new ol.View({
            center: ol.proj.transform(coor, 'EPSG:4326', 'EPSG:3857'),
            zoom: 18
        })
    });



    //*/




    //*/





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
        .attr('href', 'sample_pdf/sample.pdf')
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
