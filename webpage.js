'use strict';


// Setup
    // Load and create main settings, and save them to the root global object.
    window.g = require('./modules/settings');
    console.log('settings', g);


    //var version_string = 'Dev';
    //var version_string = 'Alpha201401--';
    var version_string = 'Preview'+moment().format('YYYYMMDD');
    g.state.version_string = version_string;
    // Load and URL query variables
    var query = g.f.query_string();
    //console.log(query);

    var update_webpage = require('./modules/update_webpage');

    g.f.update = function(){
        var settings = g;
        var f = g.f;

        console.log('/--- begin update');
        g.f.clear_drawing();

        settings.select_registry.forEach(function(selector){
            if(selector.value()) selector.input_ref.set(selector.value());
        });

        // recalculate system settings
        g.f.process(settings);

        update_webpage();

        console.log('\\--- end update');
    };


// request external data

    g.f.request_SVG = function(){
    /*
        console.log('sending data to server');
        var url = 'http://localhost:3000/plans_machine';
        var user_input_json = JSON.stringify(g.user_input);
        var data = { user_input_json: user_input_json};
        //var data = {
        //    test:42,
        //    test2:23,
        //};
        $.ajax({
                type: "POST",
                url: url,
                data: data,
            })
            .done(function(res){
                console.log('server responce?', res);

            })
            .fail(function() {
                console.log( "error" );
            })
            .always(function() {
                console.log( "complete" );
            });

    //*/
    };

    //var database_json_URL = 'http://10.173.64.204:8000/temporary/';
    var database_json_URL = 'data/fsec_copy.json';
    $.getJSON( database_json_URL)
        .done(function(json){
            g.database = json;
            //console.log('database loaded', settings.database);
            g.f.load_database(json);
            g.state.database_loaded = true;
            if( g.state.mode === 'dev'){
                g.f.settings_dev_defaults(g);
            }
            g.f.update();

            ////////
            // TEMP
            g.f.request_SVG();
            ////////
        });


// Build webpage

    // Set dev mode if requested
    if( query['mode'] === "dev" ) {
        g.state.mode = 'dev';
    } else {
        g.state.mode = 'release';
    }


    if( g.state.mode === 'dev'){
        g.f.settings_dev_defaults(g);
    }

    g.f.setup_webpage();

    // Add status bar
    var boot_time = moment();
    var status_id = 'status';
    setInterval(function(){ g.f.update_status_bar(status_id, boot_time, version_string);},1000);

// Update
    g.f.update();
