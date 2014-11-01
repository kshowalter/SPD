"use strict";
var version_string = "Dev";
//var version_string = "Alpha20140924";

var _ = require('underscore');
var moment = require('moment');
var $ = require('jquery');
var yaml = require('js-yaml');

var k = require('./lib/k/k.js');
var k_data = require('./lib/k/k_data.js');
var k$ = require('./lib/k/k_DOM');

var misc = require('./app/misc');
var loadTables = require('./app/settings_functions').loadTables;
var loadModules = require('./app/settings_functions').loadModules;
var loadComponents = require('./app/settings_functions').loadComponents;
var mk_drawing = require('./app/mk_drawing.js');
var mk_svg= require('./app/mk_svg.js');
//var mk_pdf = require('./app/mk_pdf.js');
var update_system = require('./app/update_system');

var settings = require('./data/settings.json');

settings = misc.nullToObject(settings);
settings.input = misc.blankCopy(settings.input_options);

settings.config_options = {};
settings.config_options.NEC_tables = require('./data/tables.json');
console.log(settings.config_options.NEC_tables);
settings.config_options.modules = require('./data/modules.json');
settings.config_options.inverters = require('./data/inverters.json');

console.log(settings);
var settingsCalculated = require('./app/settingsCalculated.js');
settings = settingsCalculated(settings);
settings.layers = require('./app/settingsLayers.js');
var settingsDrawing = require('./app/settingsDrawing.js');
settings = settingsDrawing(settings);

//settings.status.version_string = version_string;

var components = settings.components;
var system = settings.system;


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
function kelem_setup(kelem){
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
    return kelem;
}

/*
function add_sections(sections, parent_container, display_type){
    display_type = display_type || 'none';
    for( section in sections ){
        var selection_container = k$('div').attr('class', 'section').appendTo(parent_container);
        selection_container.attr('id', section );
        //selection_container.elem.style.width = settings.drawing.size.drawing.w.toString() + 'px';
        selection_container.elem.style.display = display_type;
        sections[section].forEach( function(kelem){
            kelem.appendTo(selection_container);
            kelem_setup(kelem);
        });
    }
}
*/

function add_sections(settings, parent_container, display_type){
    display_type = display_type || 'none';
    for( var section_name in settings.input_options ){
        var selection_container = $('<div>').attr('class', 'section').appendTo(parent_container);
        selection_container.elem.style.display = display_type;
        $('<span>').html(section_name).attr('class', 'category_title').appendTo(selection_container);
        $('<span>').html(' | ').appendTo(selection_container);
        for( var input_name in settings.input_options[section_name] ){
            $('<span>').html('Module make: ').appendTo(selection_container);
            var selector = k$('selector') .setOptionsRef( 'input_options.' + section_name + '.' + input_name ).setRef( 'input.' + section_name + '.' + input_name ).appendTo(selection_container);
            kelem_setup(selector);
        }
        $('<br>').appendTo(selection_container);
    }
}

function add_params(sections, parent_container){
    for( section in sections ){
        var title = section.split('_')[0];
        var section_container = k$('div').attr('class', 'param_section').appendTo(parent_container);
        k$('span').html(title).attr('class', 'category_title').appendTo(section_container);
        var selection_container = k$('span').appendTo(section_container);
        selection_container.attr('id', section );
        //selection_container.elem.style.width = settings.drawing.size.drawing.w.toString() + 'px';
        selection_container.elem.style.display = 'none';
        sections[section].forEach( function(kelem){
            kelem_setup(kelem);
            kelem.appendTo(selection_container);
        });
    }
}

function addOptions(select, array){
    array.forEach( function(option){
        $('<option>').attr( 'value', option ).text(option).appendTo(select);
    });
}


function show_hide_params(page_sections){
    for( var list_name in page_sections ){
        var id = '#'+list_name;
        var section_name = list_name.split('_')[0];
        var section = k$(id);
        if( settings.status.sections[section_name].set ) section.show();
        else section.hide();
    }
}

function show_hide_selections(page_sections, active_section_name){
    $('#sectionSelector').val(active_section_name);
    for( var list_name in page_sections ){
        var id = '#'+list_name;
        var section_name = list_name.split('_')[0];
        var section = k$(id);
        if( section_name === active_section_name ) section.show();
        else section.hide();
    }
}

//function setDownloadLink(settings){
//
//    if( settings.PDF && settings.PDF.url ){
//        var link = $('a').attr('href', settings.PDF.url ).attr('download', 'PV_drawing.pdf').html('Download Drawing');
//        $('#download').html('').append(link);
//    }
//}

function update(){
    console.log('updating');
    //console.log('-section', settings.status.active_section);

    update_system(settings);
    //console.log('-section', settings.status.active_section);

    settings.select_registry.forEach(function(item){
        //console.log(item)
        item.update();
    });

    //update_system(settings);

    settings.value_registry.forEach(function(item){
        item.update();
    });

    // Make drawing
    settings.elements = mk_drawing(settings);

    // Add drawing elements to SVG on screen
    var svg = mk_svg(settings);
    console.log(svg);
    var svg_wrapper = $(svg);
    console.log(svg_wrapper)
    $("#drawing").html('').append($(svg));

    //var pdf_download = mk_pdf(settings, setDownloadLink);
    //mk_pdf(settings, setDownloadLink);
    //pdf_download.html("Download PDF");
    //console.log(pdf_download);
    //if( settings.PDF && settings.PDF.url ){
    //    var link = $('a').attr('href', settings.PDF.url ).html('download..');
    //    $('#download').append(link);
    //}


    show_hide_params(page_sections_params);
    show_hide_selections(page_sections_config, settings.status.active_section)

    console.log('settings', settings);

    console.log( misc.objectDefined(settings.status) );

}








var page_sections_params = {
    modules_params: [
        k$('span').html(' | '),
        k$('span').html('Pmp: '),
        k$('value').setRef('system.DC.module.specs.Pmp').setDecimals(1),
        k$('span').html(' | '),
        k$('span').html('Isc: '),
        k$('value').setRef('system.DC.module.specs.Isc').setDecimals(2),
        k$('span').html(' | '),
        k$('span').html('Voc: '),
        k$('value').setRef('system.DC.module.specs.Voc').setDecimals(1),
        k$('span').html(' | '),
        k$('span').html('Imp: '),
        k$('value').setRef('system.DC.module.specs.Imp').setDecimals(2),
        k$('span').html(' | '),
        k$('span').html('Vmp: '),
        k$('value').setRef('system.DC.module.specs.Vmp').setDecimals(1),
    ],
    array_params: [
        k$('span').html(' | '),
        k$('span').html('Pmp: '),
        k$('value').setRef('system.DC.array.Pmp').setDecimals(1),
        k$('span').html(' | '),
        k$('span').html('Isc: '),
        k$('value').setRef('system.DC.array.Isc').setDecimals(2),
        k$('span').html(' | '),
        k$('span').html('Voc: '),
        k$('value').setRef('system.DC.array.Voc').setMax(600).attr('id', 'DC_volt').setDecimals(1),
        k$('span').html(' | '),
        k$('span').html('Imp: '),
        k$('value').setRef('system.DC.array.Imp').setDecimals(2),
        k$('span').html(' | '),
        k$('span').html('Vmp: '),
        k$('value').setRef('system.DC.array.Vmp').setDecimals(1),
    ],
    DC_params: [
        k$('span').html(' | '),
        k$('span').html('Resistance: '),
        k$('value').setRef('system.DC.homerun.resistance'),
        k$('span').html(' | '),
//        k$('span').html('Vmp: '),
//        k$('value').setRef('system.DC.homerun.'),
//        k$('span').html(' | '),
    ],
    inverter_params: [
        k$('span').html(' | '),
        k$('span').html('Inverter specs'),
        k$('span').html(' | '),
    ],
    AC_params: [
        k$('span').html(' | '),
        k$('span').html('AC params'),
        k$('span').html(' | '),
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





// # Page setup
//var svg_container_id = 'svg_container';
var system_frame_id = 'system_frame';
var title = 'PV drawing test';


k.setup_body(title);

var page = k$('div').attr('class', 'page').appendTo(k$(document.body));
//page.style('width', (settings.drawing.size.drawing.w+20).toString() + "px" )



var system_frame = k$('div').attr('id', system_frame_id).appendTo(page);


var header_container = k$('div').appendTo(system_frame);
k$('span').html('Please select your system spec below').attr('class', 'category_title').appendTo(header_container);
k$('span').html(' | ').appendTo(header_container);
//k$('input').attr('type', 'button').attr('value', 'clear selections').click(window.location.reload),
k$('a').attr('href', 'javascript:window.location.reload()').html('clear selections').appendTo(header_container);


// System setup
$('<div>').html('System Setup').attr('class', 'section_title').appendTo(system_frame);
var config_frame = $('<div>').attr('id', 'config_frame').attr('class', 'section').appendTo(system_frame);




var section_selector = $('<select>').attr('id', 'sectionSelector').appendTo(config_frame.elem);
addOptions( section_selector, settings.config_options.section_options );
section_selector.change(function(event){
    settings.status.active_section = event.target.selectedOptions[0].value
    show_hide_selections(page_sections_config, settings.status.active_section)
    //update()
})
//var section_selector = k$('selector').setOptionsRef( 'config_options.section_options' ).setRef('status.active_section').attr('class', 'corner_title').appendTo(config_frame);
//kelem_setup(section_selector);




//console.log(section_selector);
add_sections(settings, config_frame);

// Parameters and specifications
k$('div').html('System Parameters').attr('class', 'section_title').appendTo(system_frame);
var params_container = k$('div').attr('class', 'section').style('height', '150px').appendTo(system_frame);
add_params(page_sections_params, params_container);

// drawing
//var drawing = $('div').attr('id', 'drawing_frame').attr('class', 'section').appendTo(page);
var drawing = k$('div').attr('id', 'drawing_frame').appendTo(page);
drawing.style('width', (settings.drawing.size.drawing.w+20).toString() + "px" )
k$('div').html('Drawing').attr('class', 'section_title').appendTo(drawing);
var page_selector = k$('selector').setOptionsRef( 'config_options.page_options' ).setRef('status.active_page').attr('class', 'corner_title').appendTo(drawing);
kelem_setup(page_selector);
//console.log(page_selector)

//k$('span').attr('id', 'download').attr('class', 'float_right').appendTo(drawing);

var svg_container_object = k$('div').attr('id', 'drawing').attr('class', 'drawing').style('clear', 'both').appendTo(drawing);
//svg_container_object.style('width', settings.drawing.size.drawing.w+"px" )
var svg_container = svg_container_object.elem;
k$('br').appendTo(drawing);

///////////////////
k$('div').html(' ').attr('class', 'section_title').appendTo(drawing);



var boot_time = moment();
var status_id = "status";
setInterval(function(){ k.update_status_page(status_id, boot_time, version_string);},1000);

console.log('settings', settings);
console.log('window', window);
