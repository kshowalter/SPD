'use strict';


// Setup
    // Load and create main settings, and save them to the root global object.
    window.g = require('./app/settings');
    console.log('settings', g);


    //var version_string = 'Dev';
    //var version_string = 'Alpha201401--';
    var version_string = 'Preview'+moment().format('YYYYMMDD');
    g.state.version_string = version_string;

    // Load functions and add them the the global object
    var f = require('./app/functions');
    f.g = g;
    g.f = f;

    // Load and URL query variables
    var query = f.query_string();
    //console.log(query);



// Load modules

    f.setup_webpage = require('./app/setup_webpage');

    f.settings_update = require('./app/settings_update');
    f.settings_dev_defaults = require('./app/settings_dev_defaults');
    f.update = require('./app/update');


    f.mk_blocks = require('./app/mk_blocks');

    f.mk_page = {};
    f.mk_page[1] = require('./app/mk_page_1');
    f.mk_page[2] = require('./app/mk_page_2');
    f.mk_page[3] = require('./app/mk_page_3');
    f.mk_page[4] = require('./app/mk_page_4');

    f.mk_preview = {};
    f.mk_preview[1] = require('./app/mk_page_preview_1');
    f.mk_preview[2] = require('./app/mk_page_preview_2');

    f.mk_svg= require('./app/mk_svg');




// request external data
    //var database_json_URL = 'http://10.173.64.204:8000/temporary/';
    var database_json_URL = 'data/fsec_copy.json';
    $.getJSON( database_json_URL)
        .done(function(json){
            g.database = json;
            //console.log('database loaded', settings.database);
            f.load_database(json);
            g.state.database_loaded = true;
            if( g.state.mode === 'dev'){
                f.settings_dev_defaults(g);
            }
            f.update();

        });


// Build webpage

    // Set dev mode if requested
    if( query['mode'] === "dev" ) {
        g.state.mode = 'dev';
    } else {
        g.state.mode = 'release';
    }


    if( g.state.mode === 'dev'){
        f.settings_dev_defaults(g);
    }

    f.setup_webpage();

    // Add status bar
    var boot_time = moment();
    var status_id = 'status';
    setInterval(function(){ f.update_status_bar(status_id, boot_time, version_string);},1000);

// Update
    f.update();
