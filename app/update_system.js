'use strict';
var log = console.log.bind(console);
var k = require('../lib/k/k.js')

function update_system(settings) {
    log('---settings---', settings);
    var system = settings.system;

    system.DC.string_num = settings.sys_config.string_num; 
    system.DC.string_modules = settings.sys_config.string_modules;
    system.DC.module = {};
    if( settings.config_options.modules ){
        system.DC.module.make = settings.sys_config['pv_make'] || Object.keys( settings.config_options.modules )[0];
        system.DC.module.model = settings.sys_config['pv_model'] || Object.keys( settings.config_options.modules[system.DC.module.make] )[0];
        system.DC.module.specs = settings.config_options.modules[system.DC.module.make][system.DC.module.model];
    }

    settings.config_options.moduleMakeArray = k.objIdArray(settings.config_options.modules);
    settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.modules[system.DC.module.make]);

    //system.module = settings.config_options.modules[settings.misc.module];

    if( system.DC.module.specs ){
        system.DC.current = system.DC.module.specs.Isc * system.DC.string_num;
        system.DC.voltage = system.DC.module.specs.Voc * system.DC.string_modules;
    }

    system.inverter = settings.config_options.inverters[settings.sys_config.inverter];

    system.AC_loadcenter_type = '480/277V';

    system.AC_type = settings.sys_config.AC_type;

    system.AC_conductors = settings.config_options.AC_types[system.AC_type];


    
    return settings;
}


module.exports = update_system;
