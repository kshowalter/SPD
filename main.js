"use strict";

var _ = require('underscore');
var moment = require('moment');
var k = require('./lib/k/k.js');
var k_data = require('./lib/k/k_data.js');
var $ = require('./lib/k/k_DOM');

var settings = require('./app/settings.js');
var loadTables = require('./app/settings_functions').loadTables;
var loadModules = require('./app/settings_functions').loadModules;
var mk_drawing = require('./app/mk_drawing.js');
var display_svg = require('./app/display_svg.js');
var update_system = require('./app/update_system');
var settings = require('./app/settings.js');

var components = settings.components;
var system = settings.system;




function lookupLocation(position){
    var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude+','+position.coords.longitude+'&sensor=true';
    k.AJAX(url, showLocation);
}
function showLocation(location_json){
    var location = JSON.parse(location_json);
    location.results[0].address_components.forEach( function(component){
        if( component.types[0] === "locality" ) {
            system.city = component.long_name ;
            //console.log('city ', system.city) 
        } else if( component.types[0] === "administrative_area_level_2" ){
            system.county = component.long_name ;
            //console.log('county ', system.county)
        }
    });
    update_system(settings);
}

function update(){
    console.log('updating');

    update_system(settings);

    settings.select_registry.forEach(function(item){
        item.update(); 
    });

    update_system(settings);

    settings.value_registry.forEach(function(item){
        item.update(); 
    });

    // Make drawing
    settings.elements = mk_drawing(settings);
    // Add drawing elements to SVG on screen
    display_svg(settings, svg_container);

    console.log('settings', settings)
}


//k.AJAX('data/tables.txt', loadTables, settings);
k.AJAX('data/tables.txt', ready, {type:'loadTables'});

//k.AJAX( 'data/modules.csv', loadModules, settings );
k.AJAX( 'data/modules.csv', ready, {type:'loadModules'});



var ready_count = 0;
function ready(input, config){

    if( config.type === 'loadTables'){
        settings.config_options.NEC_tables = loadTables(input);
        ready_count++;
    }
    if( config.type === 'loadModules'){
        settings.config_options.modules = loadModules(input);
        ready_count++;
    }
    if( ready_count === 2 ){
        console.log('ready');
        update(settings);
    }
}


// # Page setup

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




var system_container_array = [
    /*
    $('span').html('IP location |'),
    $('span').html('City: '),
    $('value').setRef('system.city'),
    $('span').html(' | '),
    $('span').html('County: '),
    $('value').setRef('system.county'),
    $('br'),
    //*/

    $('span').html('Module').attr('class', 'sectionTitle'),
    $('span').html(' | '),
    $('span').html('Module make: '),
    //$('selector') .setOptionsRef( 'components.moduleMakeArray' ) .setRef('system.pv_make'),
    $('selector') .setOptionsRef( 'settings.config_options.moduleMakeArray' ) .setRef('system.DC.module.make'),
    $('span').html(' | '),
    $('span').html('Module model: '),
    //$('selector').setOptionsRef( 'components.moduleModelArray' ).setRef('system.pv_model'),
    $('selector').setOptionsRef( 'settings.config_options.moduleModelArray' ).setRef('system.DC.module.model'),
    $('br'),

    $('span').html('Pmp: '),
    $('value').setRef('system.DC.module.specs.Pmp'),
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

    $('hr'),
    $('span').html('Array').attr('class', 'sectionTitle'),
    $('span').html(' | '),

    $('span').html('Number of strings: '),
    $('selector').setOptionsRef( 'config_options.string_num_options').setRef('system.DC.string_num'),
    $('span').html(' | '),
    $('span').html('Number of modules per string: '),
    $('selector').setOptionsRef( 'config_options.string_modules_options').setRef('system.DC.string_modules'),
    //$('span').html(' | '),
    $('br'),
    $('span').html('DC home run length (ft): '),
    $('selector').setOptionsRef('config_options.DC_homerun_legths').setRef('system.DC.homerun_length'),
    $('span').html(' | '),
    $('span').html('DC home run AWG: '),
    $('selector').setOptionsRef('config_options.DC_homerun_AWG_options').setRef('config_options.DC_homerun_AWG'),
    $('br'),
                                
    $('span').html('Pmp: '),
    $('value').setRef('system.DC.array.Pmp'),
    $('span').html(' | '),
    $('span').html('Isc: '),
    $('value').setRef('system.DC.array.Isc'),
    $('span').html(' | '),
    $('span').html('Voc: '),
    $('value').setRef('system.DC.array.Voc').setMax(600).attr('id', 'DC_volt'),,
    $('span').html(' | '),
    $('span').html('Imp: '),
    $('value').setRef('system.DC.array.Imp'),
    $('span').html(' | '),
    $('span').html('Vmp: '),
    $('value').setRef('system.DC.array.Vmp'),
    $('br'),

/*
    $('span').html('DC voltage at inverter: '),
    $('value').setRef('system.DC.voltage_inverter').setMax(600).attr('id', 'DC_volt'),
    $('span').html(' | '),
    $('br'),
*/
    $('hr'),
    $('span').html('AC').attr('class', 'sectionTitle'),
    $('span').html(' | '),

    $('span').html('AC loadcenter type: '),
    $('selector').setOptionsRef( 'config_options.AC_loadcenter_type_options').setRef('system.AC_loadcenter_type'),
    $('span').html('AC type: '),
    //$('selector').setOptionsRef( 'config_options.AC_type_options').setRef('system.AC_type'),
    $('selector').setOptionsRef( 'system.AC_types_availible').setRef('system.AC_type'),

    $('br'),

].forEach( function(kelem){
    kelem.appendTo(system_container);
    if( kelem.type === 'selector' ){
        kelem.setRefObj(settings);
        kelem.setUpdate(update);
        settings.select_registry.push(kelem);
        kelem.update(); 
    } else if( kelem.type === 'value' ){
        kelem.setRefObj(settings);
        //kelem.setUpdate(update_system);
        settings.value_registry.push(kelem);
    }
});


var boot_time = moment();
var status_id = "status";
setInterval(function(){ k.update_status_page(status_id, boot_time);},1000);

console.log('settings', settings);
console.log('window', window);

