"use strict";
//var version_string = "Dev";
var version_string = "Alpha20141230";

// Moved to index.html
// TODO: look into ways to further reduce size. It seems way to big.
//var _ = require('underscore');
//var moment = require('moment');
//var $ = require('jquery');

var k = require('./lib/k/k.js');
var k_data = require('./lib/k/k_data');
var k$ = require('./lib/k/k_DOM');

var mk_page = {};
mk_page[1] = require('./app/mk_page_1');
mk_page[2] = require('./app/mk_page_2');
mk_page[3] = require('./app/mk_page_3');

var mk_preview = require('./app/mk_page_preview');

var mk_svg= require('./app/mk_svg');
//var mk_pdf = require('./app/mk_pdf.js');
var update_system = require('./app/update_system');

var settings = require('./app/settings');
settings.state.version_string = version_string;
console.log('settings', settings);


var f = require('./app/functions');

f.settings = settings;
settings.f = f;

//var database_json_URL = "http://10.173.64.204:8000/temporary/";
var database_json_URL = "data/fsec_copy.json";

var components = settings.components;
var system = settings.system;



$.getJSON( database_json_URL)
    .done(function(json){
        settings.database = json;
        //console.log('database loaded', settings.database);
        f.load_database(json);
        settings.state.database_loaded = true;
        update();
        //console.log( 'settings.elements', JSON.stringify(settings.elements, null, 4));
        //console.log( 'system', JSON.stringify(settings.system, null, 4));
        //console.log( 'inputs', JSON.stringify(settings.inputs, null, 4));
        //console.log( 'drawing', JSON.stringify(settings.drawing, null, 4));
    });



var update = settings.update = function(){
    console.log('/--- begin update');

    for( var section_name in settings.inputs ){
        //console.log( section_name, f.section_defined(section_name) );
    }


    settings.select_registry.forEach(function(selector){
        //console.log(selector.value());
        if(selector.value()) selector.system_ref.set(selector.value());
        if(selector.value()) selector.input_ref.set(selector.value());
        //console.log(selector.set_ref.refString, selector.value(), selector.set_ref.get());

    });


    //copy inputs from settings.input to settings.system.


    update_system(settings);

    settings.select_registry.forEach(function(selector){
        f.selector_add_options(selector);
    });

    settings.value_registry.forEach(function(value_item){
        value_item.elem.innerHTML = value_item.value_ref.get();
    });



    // Make drawing
    settings.drawing.parts = {};
    settings.drawing.svgs = {};



    $("#drawing").html('');

    for( var p in mk_page ){
        settings.drawing.parts[p] = mk_page[p](settings);
        settings.drawing.svgs[p] = mk_svg(settings.drawing.parts[p], settings);
        $("#drawing")
            //.append($("<p>Page "+p+"</p>"))
            .append($(settings.drawing.svgs[p]))
            .append($("</br>"))
            .append($("</br>"));

    }

    //$("#drawing_preview").html('').append($(settings.drawing.svgs[2]).clone());
    settings.drawing.preview_parts = mk_preview(settings);
    settings.drawing.preview_svgs = mk_svg(settings.drawing.preview_parts, settings);
    $("#drawing_preview").html('').append( $(settings.drawing.preview_svgs) );

    //*/
    //var pdf_download = mk_pdf(settings, setDownloadLink);
    //mk_pdf(settings, setDownloadLink);
    //pdf_download.html("Download PDF");
    //console.log(pdf_download);
    //if( settings.PDF && settings.PDF.url ){
    //    var link = $('a').attr('href', settings.PDF.url ).html('download..');
    //    $('#download').append(link);
    //}


    //k.show_hide_params(page_sections_params, settings);
//    show_hide_selections(page_sections_config, settings.state.active_section);

    //console.log( f.object_defined(settings.state) );

    //console.log( 'system', JSON.stringify(settings.system, null, 4));
    //console.log( 'inputs', JSON.stringify(settings.inputs, null, 4));
    //console.log( 'drawing', JSON.stringify(settings.drawing, null, 4));

    console.log('\\--- end update');
};
f.update = update;









// Dev settings
/*
if( version_string === 'Dev' && true ){
    for( var section in settings.state.sections ){
        settings.state.sections[section].ready = true;
        settings.state.sections[section].set = true;
    }
} else {
    settings.state.sections.modules.ready = true;
}
//*/
////////




function page_setup(settings){
    var system_frame_id = 'system_frame';
    var title = 'PV drawing test';

    k.setup_body(title);

    var page = $('<div>').attr('class', 'page').appendTo($(document.body));
    //page.style('width', (settings.drawing.size.drawing.w+20).toString() + "px" )

    var system_frame = $('<div>').attr('id', system_frame_id).appendTo(page);


    var header_container = k$('div').appendTo(system_frame);
    k$('span').html('Please select your system spec below').attr('class', 'category_title').appendTo(header_container);
    k$('span').html(' | ').appendTo(header_container);
    //k$('input').attr('type', 'button').attr('value', 'clear selections').click(window.location.reload),
    k$('a').attr('href', 'javascript:window.location.reload()').html('clear selections').appendTo(header_container);


    // System setup
    $('<div>').html('System Setup').attr('class', 'section_title').appendTo(system_frame);
    var config_frame = $('<div>').attr('id', 'config_frame').appendTo(system_frame);

    //console.log(section_selector);
    f.add_selectors(settings, config_frame);

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




    var drawing = $('<div>').attr('id', 'drawing_frame').appendTo(page);
    //drawing.css('width', (settings.drawing.size.drawing.w+20).toString() + "px" );
    $('<div>').html('Drawing').attr('class', 'section_title').appendTo(drawing);
    /*
    var page_selector = k$('selector')
        .setOptionsRef( 'config_options.page_options' )
        .setRef('state.active_page')
        .attr('class', 'corner_title')
        .appendTo(drawing);
    //f.kelem_setup(page_selector, settings);
    //*/
    //console.log(page_selector)

    //k$('span').attr('id', 'download').attr('class', 'float_right').appendTo(drawing);

    var svg_container_object = k$('div').attr('id', 'drawing').attr('class', 'drawing').css('clear', 'both').appendTo(drawing);
    //svg_container_object.style('width', settings.drawing.size.drawing.w+"px" )
    //var svg_container = svg_container_object.elem;
    $('<br>').appendTo(drawing);

    ///////////////////
    $('<div>').html(' ').attr('class', 'section_title').appendTo(drawing);

}

page_setup(settings);

var boot_time = moment();
var status_id = "status";
setInterval(function(){ k.update_status_page(status_id, boot_time, version_string);},1000);

update();

//console.log('window', window);
