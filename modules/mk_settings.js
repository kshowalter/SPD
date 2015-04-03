"use strict";
var f = require('./functions');



var mk_settings = function() {


    var i;
    //var settingsCalculated = require('./settingsCalculated.js');

    // Load 'user' defined settings
    //var mk_settings = require('../data/settings.json.js');
    //f.mk_settings = mk_settings;

    var settings = {};




    settings.temp = {};

    settings.perm = {};
    settings.perm.geocode = {};
    settings.perm.location = {};
    settings.perm.location.new_address = false;
    settings.perm.maps = {};

    settings.config_options = {};
    settings.config_options.NEC_tables = require('../data/tables.json');
    //console.log(settings.config_options.NEC_tables);

    settings.state = {};
    settings.state.database_loaded = false;

    settings.in = {};

    settings.in.opt = {};
    settings.in.opt.AC = {};
    settings.in.opt.AC.types = {};
    settings.in.opt.AC.types["120V"] = ["ground","neutral","L1"];
    settings.in.opt.AC.types["240V"] = ["ground","neutral","L1","L2"];
    settings.in.opt.AC.types["208V"] = ["ground","neutral","L1","L2"];
    settings.in.opt.AC.types["277V"] = ["ground","neutral","L1"];
    settings.in.opt.AC.types["480V Wye"] = ["ground","neutral","L1","L2","L3"];
    settings.in.opt.AC.types["480V Delta"] = ["ground","L1","L2","L3"];


    settings.inputs = {};
    settings.inputs.location = {};
    settings.inputs.location.county = {};
    settings.inputs.location.county.type = 'text_input';
    settings.inputs.location.address = {};
    settings.inputs.location.address.type = 'text_input';
    settings.inputs.location.city = {};
    settings.inputs.location.city.type = 'text_input';
    settings.inputs.location.zip = {};
    settings.inputs.location.zip.type = 'text_input';

    settings.inputs.roof = {};
    settings.inputs.roof.width = {};
    settings.inputs.roof.width.options = [];
    //for( i=15; i<=70; i+=5 ) settings.inputs.roof.width.options.push(i);
    settings.inputs.roof.width.units = 'ft.';
    settings.inputs.roof.width.note = 'This the full size of the roof, perpendictular to the slope.';
    settings.inputs.roof.width.type = 'number_input';
    settings.inputs.roof.length = {};
    settings.inputs.roof.length.options = [];
    //for( i=10; i<=60; i+=5 ) settings.inputs.roof.length.options.push(i);
    settings.inputs.roof.length.units = 'ft.';
    settings.inputs.roof.length.note = 'This the full length of the roof, measured from low to high.';
    settings.inputs.roof.length.type = 'number_input';
    settings.inputs.roof.slope = {};
    settings.inputs.roof.slope.options = ['1:12','2:12','3:12','4:12','5:12','6:12','7:12','8:12','9:12','10:12','11:12','12:12'];
    settings.inputs.roof.type = {};
    settings.inputs.roof.type.options = ['Gable','Shed','Hipped'];
    settings.inputs.module = {};
    settings.inputs.module.make = {};
    //settings.inputs.module.make.options = null;
    settings.inputs.module.model = {};
    //settings.inputs.module.model.options = null;
    settings.inputs.module.orientation = {};
    settings.inputs.module.orientation.options = ['Portrait','Landscape'];
    settings.inputs.array = {};
    settings.inputs.array.modules_per_string = {};
    settings.inputs.array.modules_per_string.options = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    settings.inputs.array.num_strings = {};
    settings.inputs.array.num_strings.options = [1,2,3,4,5,6];
    settings.inputs.DC = {};
    settings.inputs.DC.home_run_length = {};
    //settings.inputs.DC.home_run_length.options = [25,50,75,100,125,150];
    settings.inputs.DC.home_run_length.type = 'number_input';
    settings.inputs.inverter = {};
    settings.inputs.inverter.make = {};
    //settings.inputs.inverter.make.options = null;
    settings.inputs.inverter.model = {};
    settings.inputs.inverter.location = {};
    settings.inputs.inverter.location.options = ['Inside', 'Outside'];
    //settings.inputs.inverter.model.options = null;
    settings.inputs.AC = {};
    settings.inputs.AC.loadcenter_types = {};
    settings.inputs.AC.loadcenter_types['240V'] = {};
    settings.inputs.AC.loadcenter_types['240V'] = ['240V','120V'];
    settings.inputs.AC.loadcenter_types['208/120V'] = {};
    settings.inputs.AC.loadcenter_types['208/120V'] = ['208V','120V'];
    settings.inputs.AC.loadcenter_types['480/277V'] = {};
    settings.inputs.AC.loadcenter_types['480/277V'] = ['480V Wye','480V Delta','277V'];
    settings.inputs.AC.type = {};
    //settings.inputs.AC.type.options = null;
    settings.inputs.AC.distance_to_loadcenter = {};
    //settings.inputs.AC.distance_to_loadcenter.options = [3,5,10,15,20,30];
    settings.inputs.AC.distance_to_loadcenter.type = 'number_input';

    settings.inputs.attachment_system = {};
    settings.inputs.attachment_system.make = {
        options: ['UNIRAC'],
        type: 'select',
    };
    settings.inputs.attachment_system.model = {
        options: ['SOLARMOUNT'],
        type: 'select',
    };



    settings.user_input = f.add_sections(settings.inputs);




    //settings.inputs = settings.inputs; // copy input reference with options to inputs
    //settings.inputs = f.blank_copy(settings.inputs); // make input section blank
    //settings.system_formulas = settings.system; // copy system reference to system_formulas
    settings.system = f.blank_copy(settings.inputs); // make system section blank
    //f.merge_objects( settings.inputs, settings.system );


    // load layers

    settings.drawing = {};

    settings.drawing_settings = {};
    settings.drawing_settings.layer_attr = require('./settings_layers');
    settings.drawing_settings.fonts = require('./settings_fonts');

    settings.drawing.blocks = {};

    // Load drawing specific settings
    // TODO Fix settings_drawing with new variable locations
    var settings_drawing = require('./settings_drawing');
    settings = settings_drawing(settings);

    //settings.state_app.version_string = version_string;

    //settings = f.nullToObject(settings);

    settings.select_registry = [];
    //settings.value_registry = [];


    //var config_options = settings.config_options = settings.config_options || {};

    settings.webpage = {};
    settings.webpage.selections_manual_toggled = {};
    settings.webpage.sections = Object.keys(settings.inputs);


    settings.webpage.sections.forEach( function(section_name){
        settings.webpage.selections_manual_toggled[section_name] = false;
    });

    settings.webpage.selected_modules_total = 0;
    settings.webpage.selected_modules = {};




    settings.components = {};





    // Load functions and add them the the global object
    f.g = settings;
    settings.f = f;




    // Load modules

    f.setup_webpage = require('./setup_webpage');

    f.process = require('./process');
    f.settings_dev_defaults = require('./settings_dev_defaults');


    f.mk_blocks = require('./mk_blocks');

    f.mk_page = {};
    f.mk_page['G-001'] = require('./page/G-001');
    f.mk_page['S-001'] = require('./page/S-001');
    f.mk_page['W-001'] = require('./page/W-001');
    f.mk_page['W-002'] = require('./page/W-002');

    f.mk_preview = {};
    f.mk_preview[1] = require('./mk_page_preview_1');
    f.mk_preview[2] = require('./mk_page_preview_2');

    f.mk_svg= require('./mk_svg');



    settings.drawing_settings.sheets = [
        {
            num: 'G-001',
            desc: 'Title Sheet'
        },
        {
            num: 'W-001',
            desc: 'PV system wiring diagram'
        },
        {
            num: 'W-002',
            desc: 'PV system specifications'
        },
        {
            num: 'S-001',
            desc: 'Roof details'
        },
        {
            num: 'X-042',
            desc: 'L.U.E.'
        },
    ];





    return settings;

};



module.exports = mk_settings;
