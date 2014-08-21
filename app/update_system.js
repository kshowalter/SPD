"use strict";

var k = require('../lib/k/k.js');
//var mk_drawing = require('./mk_drawing');
//var display_svg = require('./display_svg');

var update_system = function(settings) {
    //console.log('---settings---', settings);
    var config_options = settings.config_options;
    var system = settings.system;
    var loc = settings.drawing.loc;
    var size = settings.drawing.size;

    //var show_defaults = false;
    if( settings.status.version_string === 'Dev'){
        //show_defaults = true;
        console.log('Dev mode - defaults on')

        system.DC.string_num = system.DC.string_num || 4;
        system.DC.string_modules = system.DC.string_modules || 6;
        system.DC.homerun.length = system.DC.homerun.length || 50;
        system.inverter.model = system.inverter.model || 'SI3000'; 
        system.AC_type = system.AC_type || '480V Delta';

        if( settings.status.data_loaded ){
            system.DC.module.make = system.DC.module.make || Object.keys( settings.config_options.modules )[0];
            if( system.DC.module.make) settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.modules[system.DC.module.make]);
            system.DC.module.model = system.DC.module.model || Object.keys( settings.config_options.modules[system.DC.module.make] )[0];


            config_options.DC_homerun_AWG_options = k.objIdArray( config_options.NEC_tables["Ch 9 Table 8 Conductor Properties"] );
            system.DC.homerun.AWG = system.DC.homerun.AWG || config_options.DC_homerun_AWG_options[config_options.DC_homerun_AWG_options.length-1];

            settings.config_options.inverterMakeArray = k.objIdArray(settings.config_options.inverters);
            system.inverter.make = system.inverter.make || Object.keys( settings.config_options.inverters )[0];
            settings.config_options.inverterModelArray = k.objIdArray(settings.config_options.inverters[system.inverter.make]);

            system.AC_loadcenter_type = system.AC_loadcenter_type || config_options.AC_loadcenter_type_options[0];
            //console.log(system.AC_loadcenter_type)

        }
    }

    if( settings.status.data_loaded ){

        //system.DC.string_num = settings.system.string_num; 
        //system.DC.string_modules = settings.system.string_modules;
        //if( settings.config_options.modules !== undefined ){


        // Modules
        if( settings.status.sections.modules.ready){

            settings.config_options.moduleMakeArray = k.objIdArray(settings.config_options.modules);
            if( system.DC.module.make ) settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.modules[system.DC.module.make]);
            if( system.DC.module.model ) system.DC.module.specs = settings.config_options.modules[system.DC.module.make][system.DC.module.model];

            //if( system.DC.module.make !== '' && system.DC.module.model !== '' ){
            if( system.DC.module.make && system.DC.module.model ){
                settings.status.sections.modules.set = true;
                settings.status.sections.array.ready = true;
            };
        }

        // Array
        if( settings.status.sections.array.ready){
            
            if( system.DC.string_num && system.DC.string_modules ){
                settings.status.sections.array.set = true;
            };
        }

        if( settings.status.sections.array.set){
            //system.module = settings.config_options.modules[settings.misc.module];
            if( system.DC.module.specs ){
                system.DC.array = {};
                system.DC.array.Isc = system.DC.module.specs.Isc * system.DC.string_num;
                system.DC.array.Voc = system.DC.module.specs.Voc * system.DC.string_modules;
                system.DC.array.Imp = system.DC.module.specs.Imp * system.DC.string_num;
                system.DC.array.Vmp = system.DC.module.specs.Vmp * system.DC.string_modules;
                system.DC.array.Pmp = system.DC.array.Vmp * system.DC.array.Imp;

            }


            if( system.DC.array !== undefined ){
                settings.status.sections.DC.ready = true;
            };
        }

        // DC
        if( settings.status.sections.DC.ready ){

            config_options.DC_homerun_lengths = config_options.DC_homerun_lengths || [25,50,75,100];
            config_options.DC_homerun_AWG_options = config_options.DC_homerun_AWG_options || k.objIdArray( config_options.NEC_tables["Ch 9 Table 8 Conductor Properties"] );

            //if( system.DC.homerun.length !== '' && system.DC.homerun.AWG !== '' ){
            if( system.DC.homerun.length && system.DC.homerun.AWG ){
                //console.log( '-homerun. length: ', system.DC.homerun.length, ' AWG: ', system.DC.homerun.AWG )
                settings.status.sections.DC.set = true;
            };
        }

        if( settings.status.sections.DC.set ){
            
            system.DC.homerun.resistance = config_options.NEC_tables["Ch 9 Table 8 Conductor Properties"][system.DC.homerun.AWG];

            settings.status.sections.inverter.ready = true;
        }
        
        // Inverter
        if( settings.status.sections.inverter.ready){

            settings.config_options.inverterMakeArray = k.objIdArray(settings.config_options.inverters);
            if( system.inverter.make ) settings.config_options.inverterModelArray = k.objIdArray(settings.config_options.inverters[system.inverter.make]);
            if( system.inverter.model ) system.inverter.specs = settings.config_options.inverters[system.inverter.make][system.inverter.model];


            if( system.inverter.specs !== undefined ){
                settings.status.sections.inverter.set = true;
            };
        }
        if( settings.status.sections.inverter.set ){



            if( true ){
                settings.status.sections.AC.ready = true;
            };
        }


        // AC
        if( settings.status.sections.AC.ready){

            if( system.AC_loadcenter_type ) {

                system.AC_types_availible = config_options.AC_loadcenter_types[system.AC_loadcenter_type];

                config_options.AC_type_options.forEach( function( elem, id ){
                    if( ! elem in system.AC_types_availible ) {
                        config_options.AC_type_options.splice(id, 1);
                    }

                })

                //system.AC_type = settings.system.AC_type;
                system.AC_conductors = settings.config_options.AC_types[system.AC_type];
            }


            if( system.AC_loadcenter_type && system.AC_type ){
                settings.status.sections.AC.set = true;
                //settings.status.sections.AC.ready = true;
            };
        }






        // 

        size.wire_offset.max = size.wire_offset.min + system.DC.string_num * size.wire_offset.base;
        size.wire_offset.ground = size.wire_offset.max + size.wire_offset.base*1;

        loc.array.left = loc.array.right - ( size.string.w * system.DC.string_num ) - ( size.module.frame.w*3/4 ) ;

        //return settings;
    }
};




module.exports = update_system;
