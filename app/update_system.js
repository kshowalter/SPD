'use strict';

var k = require('../lib/k/k.js');
var f = require('./functions');
//var mk_drawing = require('./mk_drawing');
//var display_svg = require('./display_svg');

var objectDefined = f.objectDefined;

var update_system = function(settings) {

    //console.log('---settings---', settings);
    var config_options = settings.config_options;
    var system = settings.system;
    var loc = settings.drawing.loc;
    var size = settings.drawing.size;
    var state = settings.state;

    var calculated = settings.calculated;
    var calculated_formulas = settings.calculated_formulas;
    var input = settings.input;
    var input_options = settings.input_options;

    var sections = k.objIdArray(settings.input);
    //console.log(sections);
    sections.forEach(function(sectionName,id){
        //console.log( sectionName, f.objectDefined(settings.input[sectionName]) );
    });



    //var show_defaults = false;
    if( state.version_string === 'Dev'){
        //show_defaults = true;
        console.log('Dev mode - defaults on');

        system.array.num_strings = system.array.num_strings || 4;
        system.array.num_module = system.array.num_module || 6;
        system.DC.home_run_length = system.DC.home_run_length || 50;
        system.inverter.model = system.inverter.model || 'SI3000';
        system.AC_type = system.AC_type || '480V Delta';

        if( state.data_loaded ){
            system.module.make = system.module.make || Object.keys( settings.config_options.modules )[0];
            if( system.module.make) settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.modules[system.module.make]);
            system.module.model = system.module.model || Object.keys( settings.config_options.modules[system.module.make] )[0];


            config_options.DC_homerun_AWG_options = k.objIdArray( config_options.NEC_tables['Ch 9 Table 8 Conductor Properties'] );
            system.array.homerun.AWG = system.array.homerun.AWG || config_options.DC_homerun_AWG_options[config_options.DC_homerun_AWG_options.length-1];

            settings.config_options.inverterMakeArray = k.objIdArray(settings.config_options.inverters);
            system.inverter.make = system.inverter.make || Object.keys( settings.config_options.inverters )[0];
            settings.config_options.inverterModelArray = k.objIdArray(settings.config_options.inverters[system.inverter.make]);

            system.AC_loadcenter_type = system.AC_loadcenter_type || config_options.AC_loadcenter_type_options[0];

        }
    }


    settings.input_options.module.make = k.obj_names(settings.components.modules);
    if( settings.input.module.make ) settings.input_options.module.model = k.obj_names(settings.components.modules[settings.input.module.make]);
    if( settings.input.module.model ) system.module.specs = settings.components.modules[settings.input.module.make][settings.input.module.model];

    settings.input_options.inverter.make = k.obj_names(settings.components.inverters);
    if( settings.input.inverter.make ) settings.input_options.inverter.model = k.obj_names(settings.components.inverters[settings.input.inverter.make]);


    for( var section_name in settings.input_options ){
        for( var input_name in settings.input_options[section_name] ){
            if( typeof settings.input_options[section_name][input_name] === 'string' ){
                console.log( settings.input_options[section_name][input_name] );
                console.log( k.obj_names(
                    f.get_ref(settings.input_options[section_name][input_name], settings)
                ));

                var to_eval = "k.obj_names(setttings." + settings.input_options[section_name][input_name] + ")";
                console.log(to_eval);
                // eval is only being used on strings defined in the settings.json file that is built into the application
                /* jshint evil:true */
                settings.input_options[section_name][input_name] = eval(to_eval);
                /* jshint evil:false */
            }
        }
    }


};

/*

    if( state.data_loaded ) {

        //system.DC.num_strings = settings.system.num_strings;
        //system.DC.num_module = settings.system.num_module;
        //if( settings.config_options.modules !== undefined ){

        var old_active_section = state.active_section;

        // Modules
        if( true ){
            f.objectDefined(system.DC.module);

            settings.config_options.moduleMakeArray = k.objIdArray(settings.config_options.modules);
            if( system.DC.module.make ) settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.modules[system.DC.module.make]);
            if( system.DC.module.model ) system.DC.module.specs = settings.config_options.modules[system.DC.module.make][system.DC.module.model];

            state.active_section = 'array';
        }

        // Array
        if( objectDefined(input.module) ) {
            //system.module = settings.config_options.modules[settings.f.module];
            if( system.DC.module.specs ){
                system.DC.array = {};
                system.DC.array.Isc = system.DC.module.specs.Isc * system.DC.num_strings;
                system.DC.array.Voc = system.DC.module.specs.Voc * system.DC.string_modules;
                system.DC.array.Imp = system.DC.module.specs.Imp * system.DC.num_strings;
                system.DC.array.Vmp = system.DC.module.specs.Vmp * system.DC.string_modules;
                system.DC.array.Pmp = system.DC.array.Vmp * system.DC.array.Imp;

                state.active_section = 'DC';
            }

            // DC
            if( objectDefined(input.DC) ) {

                system.DC.homerun.resistance = config_options.NEC_tables['Ch 9 Table 8 Conductor Properties'][system.DC.homerun.AWG];
                state.sections.inverter.ready = true;
                state.active_section = 'inverter';
            }

            // Inverter
            if( objectDefined(input.DC) ) {

                settings.config_options.inverterMakeArray = k.objIdArray(settings.config_options.inverters);
                if( system.inverter.make ) {
                    settings.config_options.inverterModelArray = k.objIdArray(settings.config_options.inverters[system.inverter.make]);
                }
                if( system.inverter.model ) system.inverter.specs = settings.config_options.inverters[system.inverter.make][system.inverter.model];

                state.active_section = 'AC';
            }

            // AC
            if( objectDefined(input.inverter) ) {
                if( system.AC_loadcenter_type ) {

                    system.AC_types_availible = config_options.AC_loadcenter_types[system.AC_loadcenter_type];

                    config_options.AC_type_options.forEach( function( elem, id ){
                        if( ! (elem in system.AC_types_availible) ) {
                            config_options.AC_type_options.splice(id, 1);
                        }

                    });

                    //system.AC_type = settings.system.AC_type;
                    system.AC_conductors = settings.config_options.AC_types[system.AC_type];
                }
            }


            if( objectDefined(input.AC) ) {
                state.active_section = old_active_section;
            }

            size.wire_offset.max = size.wire_offset.min + system.DC.num_strings * size.wire_offset.base;
            size.wire_offset.ground = size.wire_offset.max + size.wire_offset.base*1;

            loc.array.left = loc.array.right - ( size.string.w * system.DC.num_strings ) - ( size.module.frame.w*3/4 ) ;

            //return settings;

        }
    }
};

//*/

module.exports = update_system;
