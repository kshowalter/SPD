'use strict';

var f = g.f;


var settings_update = function(settings) {
    console.log('Dev mode - defaults on');

    //console.log('---settings---', settings);
    var config_options = settings.config_options;
    var inputs = settings.inputs;
    var user_input = settings.user_input;
    var loc = settings.drawing_settings.loc;
    var size = settings.drawing_settings.size;
    var state = settings.state;

    if( state.database_loaded ){
        inputs.DC = settings.inputs.DC || {};
        inputs.DC.wire_size = settings.inputs.DC.wire_size || {};
        inputs.DC.wire_size.options = inputs.DC.wire_size.options || f.obj_names(settings.config_options.NEC_tables['Ch 9 Table 8 Conductor Properties']);


    }

    user_input.array.num_strings = user_input.array.num_strings || 4;
    user_input.array.modules_per_string = user_input.array.modules_per_string || 6;
    user_input.DC.home_run_length = user_input.DC.home_run_length || 50;

    user_input.roof.width  = user_input.roof.width || 60;
    user_input.roof.length = user_input.roof.length || 25;
    user_input.roof.slope  = user_input.roof.slope || "6:12";
    user_input.roof.type   = user_input.roof.type || "Gable";

    user_input.inverter.location = user_input.inverter.location  || "Inside";

    user_input.module.orientation = user_input.module.orientation || "Portrait";

    user_input.location.address = user_input.location.address || '1679 Clearlake Road';
    user_input.location.city    = user_input.location.city || 'Cocoa';
    user_input.location.zip     = user_input.location.zip || '32922';
    user_input.location.county   = user_input.location.county || 'Brevard';


    if( state.database_loaded ){
        user_input.inverter.make = user_input.inverter.make ||
            'SMA';
        user_input.inverter.model = user_input.inverter.model ||
            'SI3000';

        user_input.module.make = user_input.module.make ||
            f.obj_names( settings.components.modules )[0];
        //if( user_input.module.make) settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.modules[system.module.make]);
        user_input.module.model = user_input.module.model ||
            f.obj_names( settings.components.modules[user_input.module.make] )[0];



        user_input.AC.loadcenter_types = user_input.AC.loadcenter_types ||
        //    f.obj_names(inputs.AC.loadcenter_types)[0];
            '480/277V';


        user_input.AC.type = user_input.AC.type || '480V Wye';
        //system.AC.type = user_input.AC.type ||
        //    user_input.AC.loadcenter_types[system.AC.loadcenter_types][0];

        user_input.AC.distance_to_loadcenter = user_input.AC.distance_to_loadcenter ||
            50;


        user_input.DC.wire_size = inputs.DC.wire_size.options[3];
        /*

        settings.config_options.inverterMakeArray = k.objIdArray(settings.config_options.inverters);
        user_input.inverter.make = user_input.inverter.make || Object.keys( settings.config_options.inverters )[0];
        settings.config_options.inverterModelArray = k.objIdArray(settings.config_options.inverters[system.inverter.make]);

        user_input.AC_loadcenter_type = user_input.AC_loadcenter_type || config_options.AC_loadcenter_type_options[0];
        //*/


        user_input.attachment_system.make = user_input.attachment_system.make ||
            inputs.attachment_system.make.options[0];
        user_input.attachment_system.model = user_input.attachment_system.model ||
            inputs.attachment_system.model.options[0];

    }





};



module.exports = settings_update;
