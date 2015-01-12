"use strict";
var f = require('./functions');
var k = require('../lib/k/k.js');

//var settingsCalculated = require('./settingsCalculated.js');

// Load 'user' defined settings
var mk_settings = require('../data/settings.json.js');
f.mk_settings = mk_settings;

var settings = {};
settings.TEMP = {};

settings.config_options = {};
settings.config_options.NEC_tables = require('../data/tables.json');
//console.log(settings.config_options.NEC_tables);

settings.state = settings.state || {};
settings.state.database_loaded = false;

settings = mk_settings.i_options(settings);
settings = mk_settings.inputs(settings);
settings = mk_settings.system(settings);

settings.input_options = settings.inputs; // copy input reference with options to input_options
settings.inputs = f.blank_copy(settings.input_options); // make input section blank
settings.system_formulas = settings.system; // copy system reference to system_formulas
settings.system = f.blank_copy(settings.system_formulas); // make system section blank
f.merge_objects( settings.inputs, settings.system );

settings.input_options.DC = settings.input_options.DC || {};
settings.input_options.DC.AWG = k.obj_names(settings.config_options.NEC_tables['Ch 9 Table 8 Conductor Properties']);
// load layers

settings.drawing = settings.drawing || {};
settings.drawing.layer_attr = require('./settings_layers');
settings.drawing.fonts = require('./settings_fonts');

// Load drawing specific settings
// TODO Fix settings_drawing with new variable locations
var settings_drawing = require('./settings_drawing');
settings = settings_drawing(settings);

//settings.state_app.version_string = version_string;

//settings = f.nullToObject(settings);

settings.select_registry = [];
settings.value_registry = [];

var system = settings.system;

//var config_options = settings.config_options = settings.config_options || {};




settings.components = {};


/*
for( var section_name in settings.input_options ){
    for( var input_name in settings.input_options[section_name]){
        if( typeof settings.input_options[section_name][input_name] === 'string' ){
            console.log(settings.input_options[section_name][input_name])
            "obj_names(setttings" + settings.input_options[section_name][input_name] + ")";
            // eval is only being used on strings defined in the settings.json file that is built into the application
            settings.input_options[section_name][input_name] = eval(settings.input_options[section_name][input_name]);
        }
    }
}
//*/


/*
settings.state.sections = {
    modules: {},
    array: {},
    DC: {},
    inverter: {},
    AC: {},
};
config_options.section_options = obj_names(settings.state.sections);
settings.state.active_section = 'modules';

config_options.AC_loadcenter_type_options = obj_names( config_options.AC_loadcenter_types );
config_options.AC_type_options = obj_names( config_options.AC_types );

config_options.inverters = {};

config_options.page_options = ['Page 1 of 1'];
settings.state.active_page = config_options.page_options[0];

system.inverter = {};


config_options.DC_homerun_lengths = config_options.DC_homerun_lengths || [25,50,75,100];
config_options.DC_homerun_AWG_options =
    config_options.DC_homerun_AWG_options ||
    obj_names( config_options.NEC_tables["Ch 9 Table 8 Conductor Properties"] );
//*/


module.exports = settings;
