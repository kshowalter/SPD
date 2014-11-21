"use strict";
var version_string = "Dev";
//var version_string = "Alpha20140924";


//var _ = require('underscore');
var moment = require('moment');
var $ = require('jquery');

var k = require('./lib/k/k.js');
var k_data = require('./lib/k/k_data');
var k$ = require('./lib/k/k_DOM');

var f = require('./app/functions');

var mk_drawing = require('./app/mk_drawing.js');
var mk_svg= require('./app/mk_svg.js');
//var mk_pdf = require('./app/mk_pdf.js');
var update_system = require('./app/update_system');

/*
var settingsCalculated = require('./app/settingsCalculated.js');
var settings_drawing = require('./app/settings_drawing.js');

var settings = require('./data/settings.json');
settings = settingsCalculated(settings);
settings.layers = require('./app/settings_layers.js');


settings.config_options = {};
settings.config_options.NEC_tables = require('./data/tables.json');
console.log(settings.config_options.NEC_tables);
settings.config_options.modules = require('./data/modules.json');
settings.config_options.inverters = require('./data/inverters.json');

console.log(settings);
settings = settings_drawing(settings);


//*/
var settings = require('./app/settings');
settings.state.version_string = version_string;
console.log(settings);


//var database_json_URL = "http://10.173.64.204:8000/temporary/";
var database_json_URL = "data/fsec_copy.json";

var components = settings.components;
var system = settings.system;


//* TODO: fix cross-origin
//k.AJAX( database_json_URL, f.load_database, settings);
$.getJSON( database_json_URL)
    .done(function(json){
        settings.database = json;
        console.log('database loaded', settings.database);
        f.load_database(json, settings);
        update();
    });



var update = settings.update = function(){
    f.update_values(settings);
    f.update_selectors(settings);

    console.log('updating');
    //console.log('-section', settings.state.active_section);

    update_system(settings);
    //console.log('-section', settings.state.active_section);

    settings.select_registry.forEach(function(item){
        //console.log(item)
        item.update();
    });

    update_system(settings);

    settings.value_registry.forEach(function(item){
        item.update();
    });

    // Make drawing
//    settings.elements = mk_drawing(settings);

    // Add drawing elements to SVG on screen
/*    var svg = mk_svg(settings);
    console.log(svg);
    var svg_wrapper = $(svg);
    console.log(svg_wrapper);
    $("#drawing").html('').append($(svg));
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

    console.log('settings', settings);

    console.log( f.object_defined(settings.state) );

}









// Dev settings
if( version_string === 'Dev' && true ){
    for( var section in settings.state.sections ){
        settings.state.sections[section].ready = true;
        settings.state.sections[section].set = true;
    }
} else {
    settings.state.sections.modules.ready = true;
}
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

    /*
    var section_selector = $('<select>').attr('id', 'sectionSelector').appendTo(config_frame.get(0));
    addOptions( section_selector, settings.config_options.section_options );
    addOptions( section_selector, k.objIdArray(settings.input) );
    section_selector.change(function(event){
        settings.state.active_section = event.target.selectedOptions[0].value;
        console.log(settings.state.active_section);
        show_hide_selections(settings, settings.state.active_section);
        //update()
    });
    //*/
    //var section_selector = k$('selector').setOptionsRef( 'config_options.section_options' ).setRef('state.active_section').attr('class', 'corner_title').appendTo(config_frame);
    //kelem_setup(section_selector);


    //console.log(section_selector);
    f.add_selectors(settings, config_frame);

    // Parameters and specifications
    $('<div>').html('System Parameters').attr('class', 'section_title').appendTo(system_frame);
    var params_container = $('<div>').attr('class', 'section');
    params_container.appendTo(system_frame);
    f.add_params( settings, params_container );

    // drawing
    //var drawing = $('div').attr('id', 'drawing_frame').attr('class', 'section').appendTo(page);
    var drawing = $('<div>').attr('id', 'drawing_frame').appendTo(page);
    drawing.css('width', (settings.drawing.size.drawing.w+20).toString() + "px" );
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
    var svg_container = svg_container_object.elem;
    $('<br>').appendTo(drawing);

    ///////////////////
    $('<div>').html(' ').attr('class', 'section_title').appendTo(drawing);

}

page_setup(settings);

var boot_time = moment();
var status_id = "status";
setInterval(function(){ k.update_status_page(status_id, boot_time, version_string);},1000);

update();

console.log('settings', settings);
console.log('window', window);
