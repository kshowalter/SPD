"use strict";
var version_string = "Dev_brach";

var _ = require('underscore');
var moment = require('moment');
var k = require('./lib/k/k.js');
var k_data = require('./lib/k/k_data.js');
var $ = require('./lib/k/k_DOM');

var settings = require('./app/settings.js');
var loadTables = require('./app/settings_functions').loadTables;
var loadModules = require('./app/settings_functions').loadModules;
var loadComponents = require('./app/settings_functions').loadComponents;
var mk_drawing = require('./app/mk_drawing.js');
var display_svg = require('./app/display_svg.js');
var update_system = require('./app/update_system');

var components = settings.components;
var system = settings.system;

settings.status.version_string = version_string;

/*
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
*/

function add_sections(sections, parent_container, display_type){
    display_type = display_type || 'none';
    for( section in sections ){
        var selection_container = $('div').attr('class', 'system_section').appendTo(parent_container);
        selection_container.attr('id', section );
        selection_container.elem.style.width = settings.drawing.size.drawing.w.toString() + 'px';
        selection_container.elem.style.display = display_type;
        sections[section].forEach( function(kelem){
            kelem.appendTo(selection_container);
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
    }
}


function show_hide_params(page_sections){
    for( var list_name in page_sections ){
        var id = '#'+list_name;
        var section_name = list_name.split('_')[0];
        var section = $(id);
        if( settings.status.sections[section_name].set ) section.show();
        else section.hide();
    }
}

function show_hide_selections(page_sections, active_section_name){
    for( var list_name in page_sections ){
        var id = '#'+list_name;
        var section_name = list_name.split('_')[0];
        var section = $(id);
        if( section_name === active_section_name ) section.show();
        else section.hide();
    }
}


function update(){
    console.log('updating');

    update_system(settings);

    settings.select_registry.forEach(function(item){
        item.update(); 
    });

    //update_system(settings);

    settings.value_registry.forEach(function(item){
        item.update(); 
    });

    // Make drawing
    settings.elements = mk_drawing(settings);
    // Add drawing elements to SVG on screen
    display_svg(settings, svg_container);

    show_hide_params(page_sections_params);
    show_hide_selections(page_sections_config, settings.status.active_section)

    console.log('settings', settings)
}


//k.AJAX('data/tables.txt', loadTables, settings);
k.AJAX('data/tables.txt', ready, {type:'loadTables'});

//k.AJAX( 'data/modules.csv', loadModules, settings );
k.AJAX( 'data/modules.csv', ready, {type:'loadModules'});
k.AJAX( 'data/inverters.csv', ready, {type:'inverters'});



var ready_count = 0;
function ready(input, config){

    if( config.type === 'loadTables'){
        settings.config_options.NEC_tables = loadTables(input);
        ready_count++;
    }
    if( config.type === 'loadModules'){
        settings.config_options.modules = loadComponents(input);
        ready_count++;
    }
    if( config.type === 'inverters'){
        settings.config_options.inverters = loadComponents(input);
        ready_count++;
    }

    if( ready_count === 3 ){
        console.log('ready');
        settings.status.data_loaded = true;
        update();
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



var page_sections_header = {
    title: [
        $('span').html('Please select your system spec below').attr('class', 'sectionTitle'),
        $('span').html(' | '),
        //$('input').attr('type', 'button').attr('value', 'clear selections').click(window.location.reload),
        $('a').attr('href', 'javascript:window.location.reload()').html('clear selections'),
        /*
        $('span').html('IP location |'),
        $('span').html('City: '),
        $('value').setRef('system.city'),
        $('span').html(' | '),
        $('span').html('County: '),
        $('value').setRef('system.county'),
        $('br'),
        //*/
        $('selector').setOptionsRef( 'config_options.section_options' ).setRef('status.active_section'),
    ],
};



var page_sections_config = {
    modules: [
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

    ],
    array: [
        $('span').html('Array').attr('class', 'sectionTitle'),
        $('span').html(' | '),

        $('span').html('Number of strings: '),
        $('selector').setOptionsRef( 'config_options.string_num_options').setRef('system.DC.string_num'),
        $('span').html(' | '),
        $('span').html('Number of modules per string: '),
        $('selector').setOptionsRef( 'config_options.string_modules_options').setRef('system.DC.string_modules'),
        //$('span').html(' | '),
    ],
    DC: [
        $('span').html('DC').attr('class', 'sectionTitle'),
        $('span').html(' | '),
        $('span').html('DC home run length (ft): '),
        $('selector').setOptionsRef('config_options.DC_homerun_lengths').setRef('system.DC.homerun.length'),
        $('span').html(' | '),
        $('span').html('DC home run AWG: '),
        $('selector').setOptionsRef('config_options.DC_homerun_AWG_options').setRef('system.DC.homerun.AWG'),

    ],
    inverter: [
        $('span').html('Inverter').attr('class', 'sectionTitle'),
        $('span').html(' | '),

        $('span').html('Inverter make: '),
        //$('selector') .setOptionsRef( 'components.moduleMakeArray' ) .setRef('system.pv_make'),
        $('selector') .setOptionsRef( 'settings.config_options.inverterMakeArray' ) .setRef('system.inverter.make'),
        $('span').html(' | '),
        $('span').html('Inverter model: '),
        //$('selector').setOptionsRef( 'components.moduleModelArray' ).setRef('system.pv_model'),
        $('selector').setOptionsRef( 'settings.config_options.inverterModelArray' ).setRef('system.inverter.model'),

    ],
    AC: [
        $('span').html('AC').attr('class', 'sectionTitle'),
        $('span').html(' | '),

        $('span').html('AC Load Center type: '),
        $('selector').setOptionsRef( 'config_options.AC_loadcenter_type_options').setRef('system.AC_loadcenter_type'),
        $('span').html('AC type: '),
        //$('selector').setOptionsRef( 'config_options.AC_type_options').setRef('system.AC_type'),
        $('selector').setOptionsRef( 'system.AC_types_availible').setRef('system.AC_type'),
        $('br'),

    ],
    
}
var page_sections_params = {
    modules_params: [
        $('span').html('Pmp: '),
        $('value').setRef('system.DC.module.specs.Pmp').setDecimals(1),
        $('span').html(' | '),
        $('span').html('Isc: '),
        $('value').setRef('system.DC.module.specs.Isc').setDecimals(2),
        $('span').html(' | '),
        $('span').html('Voc: '),
        $('value').setRef('system.DC.module.specs.Voc').setDecimals(1),
        $('span').html(' | '),
        $('span').html('Imp: '),
        $('value').setRef('system.DC.module.specs.Imp').setDecimals(2),
        $('span').html(' | '),
        $('span').html('Vmp: '),
        $('value').setRef('system.DC.module.specs.Vmp').setDecimals(1),
    ],
    array_params: [
        $('span').html('Pmp: '),
        $('value').setRef('system.DC.array.Pmp').setDecimals(1),
        $('span').html(' | '),
        $('span').html('Isc: '),
        $('value').setRef('system.DC.array.Isc').setDecimals(2),
        $('span').html(' | '),
        $('span').html('Voc: '),
        $('value').setRef('system.DC.array.Voc').setMax(600).attr('id', 'DC_volt').setDecimals(1),
        $('span').html(' | '),
        $('span').html('Imp: '),
        $('value').setRef('system.DC.array.Imp').setDecimals(2),
        $('span').html(' | '),
        $('span').html('Vmp: '),
        $('value').setRef('system.DC.array.Vmp').setDecimals(1),
    ],
    DC_params: [
        $('span').html('Resistance: '),
        $('value').setRef('system.DC.homerun.resistance'),
        $('span').html(' | '),
//        $('span').html('Vmp: '),
//        $('value').setRef('system.DC.homerun.'),
//        $('span').html(' | '),
    ],
    inverter_params: [
        $('span').html('Inverter specs'),
        $('span').html(' | '),
    ],
    AC_params: [
        $('span').html('AC params')
    ],
}




// Dev settings
if( version_string === 'Dev' && true ){
    for( var section in settings.status.sections ){
        settings.status.sections[section].ready = true;
        settings.status.sections[section].set = true;
    };
} else {
    settings.status.sections.modules.ready = true;
}
////////


var header_container = $('div').appendTo(system_container);
var config_container = $('div').appendTo(system_container).style('height', '50px').style('background', 'lightgrey');
var params_container = $('div').appendTo(system_container).style('height', '150px');



add_sections(page_sections_header, header_container, 'block');
add_sections(page_sections_config, config_container);
add_sections(page_sections_params, params_container);


var boot_time = moment();
var status_id = "status";
setInterval(function(){ k.update_status_page(status_id, boot_time, version_string);},1000);

console.log('settings', settings);
console.log('window', window);
