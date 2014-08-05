"use strict";
var log = console.log.bind(console);
var k = require('../lib/k/k.js');
//var mk_drawing = require('./mk_drawing');
//var display_svg = require('./display_svg');

var update_system = function(settings) {
    //log('---settings---', settings);
    var system = settings.system;
    var loc = settings.drawing.loc;
    var size = settings.drawing.size;

    //system.DC.string_num = settings.system.string_num; 
    //system.DC.string_modules = settings.system.string_modules;
    //if( settings.config_options.modules !== undefined ){
    if( settings.config_options.modules ){
        settings.config_options.moduleMakeArray = k.objIdArray(settings.config_options.modules);
        system.DC.module.make = system.DC.module.make || Object.keys( settings.config_options.modules )[0];
        settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.modules[system.DC.module.make]);
        system.DC.module.model = system.DC.module.model || Object.keys( settings.config_options.modules[system.DC.module.make] )[0];
        system.DC.module.specs = settings.config_options.modules[system.DC.module.make][system.DC.module.model];
    }
    if( settings.config_options.inverters ){
        settings.config_options.moduleMakeArray = k.objIdArray(settings.config_options.inverters);
        system.inverter.make = system.inverter.make || Object.keys( settings.config_options.inverters )[0];
        settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.inverters[system.DC.module.make]);
        system.inverter.model = system.inverter.model || Object.keys( settings.config_options.inverters[system.inverter.make] )[0];
        system.inverter.specs = settings.config_options.inverters[system.inverter.make][system.inverter.model];
    }

    settings.config_options.moduleMakeArray = k.objIdArray(settings.config_options.modules);
    settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.modules[system.DC.module.make]);

    //system.module = settings.config_options.modules[settings.misc.module];

    if( system.DC.module.specs ){
        system.DC.current = system.DC.module.specs.Isc * system.DC.string_num;
        system.DC.voltage = system.DC.module.specs.Voc * system.DC.string_modules;
    }

    //system.inverter = settings.config_options.inverters[system.inverter.model];

    system.AC_loadcenter_type = '480/277V';

    system.AC_type = settings.system.AC_type;

    system.AC_conductors = settings.config_options.AC_types[system.AC_type];

    var size = settings.drawing.size;
    
    size.wire_offset.max = size.wire_offset.min + system.DC.string_num * size.wire_offset.base;
    size.wire_offset.ground = size.wire_offset.max + size.wire_offset.base*1;
    loc.array.left = loc.array.right - ( size.string.w * (system.DC.string_num-1) ) - ( size.module.frame.w*3/4 ) ;
    //return settings;
};



module.exports = update_system;
