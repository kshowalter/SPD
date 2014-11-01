"use strict";

var k = require('../lib/k/k.js')

function calculateSettings(settings){


    settings.select_registry = [];
    settings.value_registry = [];

    var system = settings.system = {};
    system.wire_config_num = 5;
    system.DC = {};
    system.DC.module = {};
    system.DC.homerun = {};

    var config_options = settings.config_options = settings.config_options || {};

    var status = settings.status = {};
    settings.status.sections = {
        modules: {},
        array: {},
        DC: {},
        inverter: {},
        AC: {},
    };
    config_options.section_options = k.objIdArray(settings.status.sections);
    settings.status.active_section = 'modules';

    config_options.AC_loadcenter_type_options = k.objIdArray( config_options.AC_loadcenter_types );
    config_options.AC_type_options = k.objIdArray( config_options.AC_types );

    config_options.inverters = {};

    config_options.page_options = ['Page 1 of 1'];
    status.active_page = config_options.page_options[0];

    system.inverter = {};


    config_options.DC_homerun_lengths = config_options.DC_homerun_lengths || [25,50,75,100];
    config_options.DC_homerun_AWG_options = config_options.DC_homerun_AWG_options || k.objIdArray( config_options.NEC_tables["Ch 9 Table 8 Conductor Properties"] );


    return settings;
}

module.exports = calculateSettings;
