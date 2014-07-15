"use strict";
var log = console.log.bind(console);

var _ = require('underscore');
//var SVG = require('./lib/svg.js');
var moment = require('moment');

var k = require('./lib/k/k.js');
var k_data = require('./lib/k/k_data.js');
var $ = require('./lib/k/k_DOM.js').$;
var update_system = require('./app/update_system.js');
var mk_drawing = require('./app/mk_drawing.js');
var display_svg = require('./app/display_svg.js');

var kontainer = require('./lib/k/kontainer.js');

var settings = require('./app/settings.js');

// NEC tables
var g_tables = settings.NEC_tables;

var components = settings.components;
var misc = settings.misc;
var system = settings.system;

// layers and fonts
var l_attr = settings.l_attr;
var fonts = settings.fonts;

var size = settings.size;
var loc = settings.loc;


log('---settings---', settings);


function lookupLocation(position){
    var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude+','+position.coords.longitude+'&sensor=true';
    k.AJAX(url, showLocation);
}
function showLocation(location_json){
    var location = JSON.parse(location_json);
    location.results[0].address_components.forEach( function(component){
        if( component.types[0] === "locality" ) {
            misc.city = component.long_name ;
            //log('city ', misc.city) 
        } else if( component.types[0] === "administrative_area_level_2" ){
            misc.county = component.long_name ;
            //log('county ', misc.county)
        }
    });
    update();
}

//#update drawing
function update(){
    log('updating');

    // Make sure selectors and value displays are updated
    settings_registry.forEach(function(item){
        item.update(); 
    });

    // delete all elements of drawing 
    clear_drawing();

    // Recalculate system specs
    update_system();
    
    // Recalculate drawing related variables
    update_values();

    // Generate new drawing elements
    mk_drawing();

    // Add drawing elements to SVG on screen
    display_svg(svg_container, elements);

}



var svg_container_id = 'svg_container';
var svg_container = document.getElementById(svg_container_id);
var system_container_id = 'system_container';


var title = 'PV drawing test';

k.setup_body(title);
var draw_page = $('div').attr('id', 'drawing_page');
document.body.appendChild(draw_page.elem);

var system_container = $('div').attr('id', system_container_id).appendTo(draw_page);

var svg_container_object = $('div').attr('id', svg_container_id).appendTo(draw_page);
var svg_container = svg_container_object.elem;

//System options
///*
log("-------");
//log('Value', $('value') );
//log('Value', $('value').setRef( settings, 'system.DC.voltage').setMax(600));
log( 'value', $('value') );
log( 'select', $('select') );
log("-------");

var system_container_array = [
    $('span').html('IP location |'),
    $('span').html('City: '),
    $('value').setRef('misc.city'),
    $('span').html(' | '),
    $('span').html('County: '),
    $('value').setRef('misc.county'),
    $('br'),
    //*/

    $('span').html('Module make: '),
    $('select')
        .setOptionsRef( 'components.moduleMakeArray' )
        .setRef('misc.pv_make'),
    
    $('br'),
    $('span').html('Module model: '),
    $('select').setOptionsRef( 'components.moduleModelArray' ).setRef('misc.pv_model'),

    $('br'),
    $('span').html('Pmax: '),
    $('value').setRef('system.DC.module.specs.Pmax'),

    $('span').html(' | '),
    $('span').html('Isc: '),
    $('value').setRef('system.DC.module.specs.Isc'),

    $('span').html(' | '),
    $('span').html('Voc: '),
    $('value').setRef('system.DC.module.specs.Voc'),

    $('span').html(' | '),
    $('span').html('Imp: '),
    $('value').setRef('system.DC.module.specs.Imp'),
    
    $('span').html(' | '),
    $('span').html('Vmp: '),
    $('value').setRef('system.DC.module.specs.Vmp'),

    $('br'),

    $('span').html('Number of strings: '),
    $('select').setOptionsRef( 'misc.string_num_options').setRef('string_num'),
    $('span').html(' | '),
    $('span').html('Number of modules per string: '),
    $('select').setOptionsRef( 'misc.string_modules_options').setRef('string_modules'),
    $('br'),
    
    $('span').html('Array voltage: '),
    $('value').setRef('system.DC.voltage').setMax(600).attr('id', 'DC_volt'),

    $('span').html(' | '),

    $('span').html('Array current: '),
    $('value').setRef('system.DC.current'),

    $('br'),

    $('span').html('AC type: '),

    $('select').setOptionsRef( 'misc.AC_type_options').setRef('AC_type'),

    $('br'),

].forEach( function(elem){
    elem.appendTo(system_container);
    if( elem.type === 'selector' ){
        elem.setRefObj(settings);
        elem.setUpdate(update);
        settings_registry.push(elem);
        elem.update(); 
    } else if( elem.type === 'value' ){
        elem.setUpdate(update_system);
        settings_registry.push(elem);
    }
});

update();

var boot_time = moment();
var status_id = "status";
setInterval(function(){ k.update_status_page(status_id, boot_time);},1000);

log(window);


