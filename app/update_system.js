'use strict';
var log = console.log.bind(console);

function update_system(settings) {
    log('---settings---', settings);
    var system = settings.system;

    system.DC.string_num = settings.misc.string_num; 
    system.DC.string_modules = settings.misc.string_modules;
    system.DC.module = {};
    system.DC.module.make = settings.misc['pv_make'] || Object.keys( settings.components.modules )[0];

    system.DC.module.model = settings.misc['pv_model'] || Object.keys( settings.components.modules[system.DC.module.make] )[0];
    system.DC.module.specs = settings.components.modules[system.DC.module.make][system.DC.module.model];

    settings.components.moduleMakeArray = k.objIdArray(components.modules);
    settings.components.moduleModelArray = k.objIdArray(components.modules[system.DC.module.make]);

    //system.module = settings.components.modules[settings.misc.module];

    if( system.DC.module.specs ){
        system.DC.current = system.DC.module.specs.Isc * system.DC.string_num;
        system.DC.voltage = system.DC.module.specs.Voc * system.DC.string_modules;
    }

    system.inverter = settings.components.inverters[settings.misc.inverter];

    system.AC_loadcenter_type = '480/277V';

    system.AC_type = settings.misc.AC_type;

    system.AC_conductors = settings.AC_types[system.AC_type];


    system.wire_config_num = 5;
    
    return settings;
}


module.exports = update_system;
