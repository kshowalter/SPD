'use strict';

var k = require('../lib/k/k.js');
var misc = require('./misc');
//var mk_drawing = require('./mk_drawing');
//var display_svg = require('./display_svg');

var objectDefined = misc.objectDefined;

var update_system = function(settings) {
    var input = settings.input;


    //console.log('---settings---', settings);
    var config_options = settings.config_options;
    var system = settings.system;
    var loc = settings.drawing.loc;
    var size = settings.drawing.size;
    var status = settings.status;

    var sections = k.objIdArray(settings.input);
    console.log(sections);
    sections.forEach(function(sectionName,id){
        console.log( sectionName, misc.objectDefined(settings.input[sectionName]) );
    });



    //var show_defaults = false;
    if( status.version_string === 'Dev'){
        //show_defaults = true;
        console.log('Dev mode - defaults on');

        system.DC.string_num = system.DC.string_num || 4;
        system.DC.string_modules = system.DC.string_modules || 6;
        system.DC.homerun.length = system.DC.homerun.length || 50;
        system.inverter.model = system.inverter.model || 'SI3000';
        system.AC_type = system.AC_type || '480V Delta';

        if( status.data_loaded ){
            system.DC.module.make = system.DC.module.make || Object.keys( settings.config_options.modules )[0];
            if( system.DC.module.make) settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.modules[system.DC.module.make]);
            system.DC.module.model = system.DC.module.model || Object.keys( settings.config_options.modules[system.DC.module.make] )[0];


            config_options.DC_homerun_AWG_options = k.objIdArray( config_options.NEC_tables['Ch 9 Table 8 Conductor Properties'] );
            system.DC.homerun.AWG = system.DC.homerun.AWG || config_options.DC_homerun_AWG_options[config_options.DC_homerun_AWG_options.length-1];

            settings.config_options.inverterMakeArray = k.objIdArray(settings.config_options.inverters);
            system.inverter.make = system.inverter.make || Object.keys( settings.config_options.inverters )[0];
            settings.config_options.inverterModelArray = k.objIdArray(settings.config_options.inverters[system.inverter.make]);

            system.AC_loadcenter_type = system.AC_loadcenter_type || config_options.AC_loadcenter_type_options[0];

        }
    }

    if( status.data_loaded ) {

        //system.DC.string_num = settings.system.string_num;
        //system.DC.string_modules = settings.system.string_modules;
        //if( settings.config_options.modules !== undefined ){

        var old_active_section = status.active_section;

        // Modules
        if( true ){
            misc.objectDefined(system.DC.module);

            settings.config_options.moduleMakeArray = k.objIdArray(settings.config_options.modules);
            if( system.DC.module.make ) settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.modules[system.DC.module.make]);
            if( system.DC.module.model ) system.DC.module.specs = settings.config_options.modules[system.DC.module.make][system.DC.module.model];

            status.active_section = 'array';
        }

        // Array
        if( objectDefined(input.module) ) {
            //system.module = settings.config_options.modules[settings.misc.module];
            if( system.DC.module.specs ){
                system.DC.array = {};
                system.DC.array.Isc = system.DC.module.specs.Isc * system.DC.string_num;
                system.DC.array.Voc = system.DC.module.specs.Voc * system.DC.string_modules;
                system.DC.array.Imp = system.DC.module.specs.Imp * system.DC.string_num;
                system.DC.array.Vmp = system.DC.module.specs.Vmp * system.DC.string_modules;
                system.DC.array.Pmp = system.DC.array.Vmp * system.DC.array.Imp;

                status.active_section = 'DC';
            }

            // DC
            if( objectDefined(input.DC) ) {

                system.DC.homerun.resistance = config_options.NEC_tables['Ch 9 Table 8 Conductor Properties'][system.DC.homerun.AWG];
                status.sections.inverter.ready = true;
                status.active_section = 'inverter';
            }

            // Inverter
            if( objectDefined(input.DC) ) {

                settings.config_options.inverterMakeArray = k.objIdArray(settings.config_options.inverters);
                if( system.inverter.make ) settings.config_options.inverterModelArray = k.objIdArray(settings.config_options.inverters[system.inverter.make]);
                if( system.inverter.model ) system.inverter.specs = settings.config_options.inverters[system.inverter.make][system.inverter.model];

                status.active_section = 'AC';
            }

            // AC
            if( objectDefined(input.inverter) ) {
                if( system.AC_loadcenter_type ) {

                    system.AC_types_availible = config_options.AC_loadcenter_types[system.AC_loadcenter_type];

                    config_options.AC_type_options.forEach( function( elem, id ){
                        if( ! elem in system.AC_types_availible ) {
                            config_options.AC_type_options.splice(id, 1);
                        }

                    });

                    //system.AC_type = settings.system.AC_type;
                    system.AC_conductors = settings.config_options.AC_types[system.AC_type];
                }
            }


            if( objectDefined(input.AC) ) {
                status.active_section = old_active_section;
            }

            size.wire_offset.max = size.wire_offset.min + system.DC.string_num * size.wire_offset.base;
            size.wire_offset.ground = size.wire_offset.max + size.wire_offset.base*1;

            loc.array.left = loc.array.right - ( size.string.w * system.DC.string_num ) - ( size.module.frame.w*3/4 ) ;

            //return settings;
        }
    }
};


module.exports = update_system;
