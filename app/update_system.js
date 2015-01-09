'use strict';

var k = require('../lib/k/k.js');
var f = require('./functions');
//var mk_drawing = require('./mk_drawing');
//var display_svg = require('./display_svg');

var object_defined = f.object_defined;

var update_system = function(settings) {

    //console.log('---settings---', settings);
    var config_options = settings.config_options;
    var system = settings.system;
    var loc = settings.drawing.loc;
    var size = settings.drawing.size;
    var state = settings.state;

    var calculated = settings.calculated;
    var calculated_formulas = settings.calculated_formulas;
    var inputs = settings.inputs;
    var input_options = settings.input_options;

    var sections = k.objIdArray(settings.inputs);
    //console.log(sections);
    sections.forEach(function(sectionName,id){
        //console.log( sectionName, f.object_defined(settings.inputs[sectionName]) );
    });

    f.mk_settings.system(settings);

    for( var section in settings.system_formulas ){


    }

    //var show_defaults = false;
    ///*
    if( true && state.version_string === 'Dev'){
        //show_defaults = true;
        //console.log('Dev mode - defaults on');

        system.array.num_strings = system.array.num_strings || 4;
        system.array.num_modules = system.array.num_modules || 6;
        system.DC.home_run_length = system.DC.home_run_length || 50;

        system.roof.width  = system.roof.width || 25;
        inputs.roof.width  = inputs.roof.width || 25;
        system.roof.height = system.roof.height || 15;
        inputs.roof.height = inputs.roof.height || 15;
        system.roof.angle  = system.roof.angle || "6, 26.5";
        inputs.roof.angle  = inputs.roof.angle || "6, 26.5";
        system.roof.type = system.roof.type || "Gable";
        inputs.roof.type = inputs.roof.type || "Gable";

        inputs.module.orientation = inputs.module.orientation || "Portrait";
        system.module.orientation = system.module.orientation || "Portrait";


        settings.system.DC.AWG = settings.system.DC.AWG || settings.input_options.DC.AWG[10];

        if( state.database_loaded ){
            inputs.inverter.make = system.inverter.make = system.inverter.make ||
                'SMA';
            inputs.inverter.model = system.inverter.model = system.inverter.model ||
                'SI3000';

            inputs.module.make = system.module.make = system.module.make ||
                f.obj_names( settings.components.modules )[0];
            //if( system.module.make) settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.modules[system.module.make]);
            inputs.module.model = system.module.model = system.module.model ||
                f.obj_names( settings.components.modules[system.module.make] )[0];


            inputs.module.model = system.module.model = system.module.model ||
                f.obj_names( settings.components.modules[system.module.make] )[0];

            inputs.AC.loadcenter_types = system.AC.loadcenter_types = system.AC.loadcenter_types ||
            //    f.obj_names(input_options.AC.loadcenter_types)[0];
                '480/277V';


            inputs.AC.type = system.AC.type = system.AC.type || '480V Wye';
            //inputs.AC.type = system.AC.type = system.AC.type ||
            //    input_options.AC.loadcenter_types[system.AC.loadcenter_types][0];

            inputs.AC.distance_to_loadcenter = system.AC.distance_to_loadcenter = system.AC.distance_to_loadcenter ||
                input_options.AC.distance_to_loadcenter[3];


            /*
            config_options.DC_homerun_AWG_options = k.objIdArray( config_options.NEC_tables['Ch 9 Table 8 Conductor Properties'] );
            system.array.homerun.AWG = system.array.homerun.AWG ||
                          config_options.DC_homerun_AWG_options[config_options.DC_homerun_AWG_options.length-1];

            settings.config_options.inverterMakeArray = k.objIdArray(settings.config_options.inverters);
            system.inverter.make = system.inverter.make || Object.keys( settings.config_options.inverters )[0];
            settings.config_options.inverterModelArray = k.objIdArray(settings.config_options.inverters[system.inverter.make]);

            system.AC_loadcenter_type = system.AC_loadcenter_type || config_options.AC_loadcenter_type_options[0];
            //*/
        }
    }
    //*/

    //console.log("update_system");
    //console.log(system.module.make);

    input_options.module.make = k.obj_names(settings.components.modules);
    if( system.module.make ) {
        input_options.module.model  = k.obj_names( settings.components.modules[system.module.make] );
    }

    if( system.module.model ) {
        var specs = settings.components.modules[system.module.make][system.module.model];
        for( var spec_name in specs ){
            if( spec_name !== 'module_id' ){
                system.module[spec_name] = specs[spec_name];
            }
        }
        //system.module.specs = settings.components.modules[system.module.make][system.module.model];
    }

    if( f.section_defined('array') && f.section_defined('module') ){
        system.array = system.array || {};
        system.array.isc = system.module.isc * system.array.num_strings;
        system.array.voc = system.module.voc * system.array.num_modules;
        system.array.imp = system.module.imp * system.array.num_strings;
        system.array.vmp = system.module.vmp * system.array.num_modules;
        system.array.pmp = system.array.vmp  * system.array.imp;
    }

    if( f.section_defined('DC') ){

    }

    input_options.inverter.make = k.obj_names(settings.components.inverters);
    if( system.inverter.make ) {
        input_options.inverter.model = k.obj_names( settings.components.inverters[system.inverter.make] );
    }
    if( f.section_defined('inverter') ){

    }

    //input_options.AC.loadcenter_type = settings.f.obj_names(input_options.AC.loadcenter_types);
    if( system.AC.loadcenter_types ) {
        var loadcenter_type = system.AC.loadcenter_types;
        var AC_options = input_options.AC.loadcenter_types[loadcenter_type];
        input_options.AC.type = AC_options;
        //i_options.AC.types[loadcenter_type];

        //input_options.AC['type'] = k.obj_names( settings.i_options.AC.type );
    }
    if( system.AC.type ) {
        system.AC.conductors = settings.i_options.AC.types[system.AC.type];
        system.AC.num_conductors = system.AC.conductors.length;

    }
    if( f.section_defined('AC') ){

    }

    size.wire_offset.max = size.wire_offset.min + system.array.num_strings * size.wire_offset.base;
    size.wire_offset.ground = size.wire_offset.max + size.wire_offset.base*1;
    loc.array.left = loc.array.right - ( size.string.w * system.array.num_strings ) - ( size.module.frame.w*3/4 ) ;









    /*
    //settings.drawing.size.wire_table.h = (system.AC.num_conductors+3) * settings.drawing.size.wire_table.row_h;
    for( var section_name in input_options ){
        for( var input_name in settings.input_options[section_name] ){
            if( typeof settings.input_options[section_name][input_name] === 'string' ){
                console.log( settings.input_options[section_name][input_name] );
                console.log( k.obj_names(
                    f.get_ref(settings.input_options[section_name][input_name], settings)
                ));

                var to_eval = "k.obj_names(setttings." + settings.input_options[section_name][input_name] + ")";
                console.log(to_eval);
                // eval is only being used on strings defined in the settings.json file that is built into the application
                /* jshint evil:true //*/
                // TODO: Look for alternative solutions that is more universal.
                // http://perfectionkills.com/global-eval-what-are-the-options/#indirect_eval_call_examples
                /*
                var e = eval; // This allows eval to be called indirectly, triggering a global call in modern browsers.
                settings.input_options[section_name][input_name] = e(to_eval);
                /* jshint evil:false //*/
                /*
            }
        }
    }

    //*/

};

/*

    if( state.data_loaded ) {

        //system.DC.num_strings = settings.system.num_strings;
        //system.DC.num_module = settings.system.num_module;
        //if( settings.config_options.modules !== undefined ){

        var old_active_section = state.active_section;

        // Modules
        if( true ){
            f.object_defined(system.DC.module);

            settings.config_options.moduleMakeArray = k.objIdArray(settings.config_options.modules);
            if( system.DC.module.make ) settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.modules[system.DC.module.make]);
            if( system.DC.module.model ) system.DC.module.specs = settings.config_options.modules[system.DC.module.make][system.DC.module.model];

            state.active_section = 'array';
        }

        // Array
        if( object_defined(input.module) ) {
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
            if( object_defined(inputs.DC) ) {

                system.DC.homerun.resistance = config_options.NEC_tables['Ch 9 Table 8 Conductor Properties'][system.DC.homerun.AWG];
                state.sections.inverter.ready = true;
                state.active_section = 'inverter';
            }

            // Inverter
            if( object_defined(inputs.DC) ) {

                settings.config_options.inverterMakeArray = k.objIdArray(settings.config_options.inverters);
                if( system.inverter.make ) {
                    settings.config_options.inverterModelArray = k.objIdArray(settings.config_options.inverters[system.inverter.make]);
                }
                if( system.inverter.model ) system.inverter.specs = settings.config_options.inverters[system.inverter.make][system.inverter.model];

                state.active_section = 'AC';
            }

            // AC
            if( object_defined(inputs.inverter) ) {
                if( system.AC_loadcenter_type ) {

                    system.AC_types_availible = config_options.AC_loadcenter_types[system.AC_loadcenter_type];

                    config_options.AC_type_options.forEach( function( elem, id ){
                        if( ! (elem in system.AC_types_availible) ) {
                            config_options.AC_type_options.splice(id, 1);
                        }

                    });

                    //system.AC.type = settings.system.AC_type;
                    system.AC_conductors = settings.config_options.AC_types[system.AC_type];
                }
            }


            if( object_defined(inputs.AC) ) {
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
