"use strict";
var log = console.log.bind(console);

var _ = require('underscore');
//var SVG = require('./lib/svg.js');
var moment = require('moment');

var k = require('./lib/k/k.js');
var k_data = require('./lib/k/k_data.js');
var $ = require('./lib/k/k_DOM.js').$;

//var settings_registry = require('./lib/k/k_DOM.js').settings_registry;
//var settings = require('./lib/k/k_DOM.js').settings;
var kontainer = require('./lib/k/kontainer.js');

var settings = require('./app/settings.js')

// NEC tables
var g_tables = settings.NEC_tables;

// system components
var components = settings.components;
log('components', components );

//var misc = kontainer('misc');
var misc = settings.misc

log('misc', misc);

//var system = {};
//var system = kontainer('system', {});
var system = settings.system;

system.DC = {};

function update_system() {
    system.DC.string_num = misc.string_num; 
    system.DC.string_modules = misc.string_modules;
    system.DC.module = {};
    system.DC.module.make = misc['pv_make'] || Object.keys( components.modules )[0];

    system.DC.module.model = misc['pv_model'] || Object.keys( components.modules[system.DC.module.make] )[0];
    system.DC.module.specs = components.modules[system.DC.module.make][system.DC.module.model];

    //system.module = components.modules[misc.module];

    if( system.DC.module.specs ){
        system.DC.current = system.DC.module.specs.Isc * system.DC.string_num;
        system.DC.voltage = system.DC.module.specs.Voc * system.DC.string_modules;
    }

    system.inverter = components.inverters[misc.inverter];

    system.AC_loadcenter_type = '480/277V';

    system.AC_type = misc.AC_type;

    system.AC_conductors = settings.AC_types[system.AC_type];


    system.wire_config_num = 5;
    
    log(kontainer())
}

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


////////////
// layers and fonts
var l_attr = settings.l_attr;
var fonts = settings.fonts;

log('elements', elements);
log('blocks', blocks);

//////////////
//#drawing parameters
var size = settings.size;
var loc = settings.loc

log('size', size);
log('loc', loc);


///////////////
// build drawing

//#start drawing

var mk_drawing = require('./app/mk_drawing.js');












///////////////////
// Display

var display_svg = require('./app/display_svg.js');


//////////////////////////////////////////
// after page loads functions


var update_settings_registry = function() {
};


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
log('Value', $('value').setRef('system.DC.voltage').setMax(600));
log('---', $('value').setRef('system.DC.voltage').setMax(600).attr('id', 'DC_volt') );

var system_container_array = [
    $('span').html('IP location |'),
    $('span').html('City: '),
    $('value').setRef('settings.city'),
    $('span').html(' | '),
    $('span').html('County: '),
    $('value').setRef('settings.county'),
    $('br'),
    //*/

    $('span').html('Module make: '),
    $('select').setOptions( 'k.obj_id_array(components.modules)' ).set_setting('pv_make'),
    
    $('br'),
    $('span').html('Module model: '),
    $('select').setOptions( 'k.obj_id_array(components.modules[settings.pv_make])' ).set_setting('pv_model'),

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
    $('select').setOptions( 'settings.string_num_options').set_setting('string_num'),
    $('span').html(' | '),
    $('span').html('Number of modules per string: '),
    $('select').setOptions( 'settings.string_modules_options').set_setting('string_modules'),
    $('br'),
    
    $('span').html('Array voltage: '),
    $('value').setRef('system.DC.voltage').setMax(600).attr('id', 'DC_volt'),

    $('span').html(' | '),

    $('span').html('Array current: '),
    $('value').setRef('system.DC.current'),

    $('br'),

    $('span').html('AC type: '),

    $('select').setOptions( 'settings.AC_type_options').set_setting('AC_type'),

    $('br'),

].forEach( function(elem){
    elem.appendTo(system_container);
    if( elem.type === 'selector' ){
        elem.setUpdate(update);
        elem.update(); 
    } else if( elem.type === 'value' ){
        elem.setUpdate(update_system);
    }
});

update();

var boot_time = moment();
var status_id = "status";
setInterval(function(){ k.update_status_page(status_id, boot_time);},1000);




log(window);


