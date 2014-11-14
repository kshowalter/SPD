"use strict";
var f = require('./functions');
var k = require('../lib/k/k.js');

//var settingsCalculated = require('./settingsCalculated.js');

// Load 'user' defined settings
var settings = require('../data/settings.json');
settings.input_options = settings.input; // copy input reference with options to input_options
settings.input = f.blankCopy(settings.input_options); // make input section blank
settings.calculated_formulas = settings.calculated; // copy calculated reference to calculated_formulas
settings.calculated = f.blankCopy(settings.calculated_formulas); // make calculated section blank


// load layers
settings.layers = require('./settingsLayers.js');

// Load drawing specific settings
// TODO Fix settingsDrawing with new variable locations
//var settingsDrawing = require('./settingsDrawing.js');
//settings = settingsDrawing(settings);

// To be replaced by database
settings.config_options = {};
settings.config_options.NEC_tables = require('../data/tables.json');
console.log(settings.config_options.NEC_tables);
settings.config_options.modules = require('../data/modules.json');
settings.config_options.inverters = require('../data/inverters.json');
// To be replaced by database

//settings.state_app.version_string = version_string;

//settings = f.nullToObject(settings);

settings.select_registry = [];
settings.value_registry = [];

var system = settings.system = {};
system.wire_config_num = 5;
system.DC = {};
system.DC.module = {};
system.DC.homerun = {};

var config_options = settings.config_options = settings.config_options || {};

var state = settings.state = {};

settings.state.sections = {
    modules: {},
    array: {},
    DC: {},
    inverter: {},
    AC: {},
};
config_options.section_options = k.objIdArray(settings.state.sections);
settings.state.active_section = 'modules';

config_options.AC_loadcenter_type_options = k.objIdArray( config_options.AC_loadcenter_types );
config_options.AC_type_options = k.objIdArray( config_options.AC_types );

config_options.inverters = {};

config_options.page_options = ['Page 1 of 1'];
settings.state.active_page = config_options.page_options[0];

system.inverter = {};


config_options.DC_homerun_lengths = config_options.DC_homerun_lengths || [25,50,75,100];
config_options.DC_homerun_AWG_options =
    config_options.DC_homerun_AWG_options ||
    k.objIdArray( config_options.NEC_tables["Ch 9 Table 8 Conductor Properties"] );



module.exports = settings;
