'use strict';



// Setup
    // Load and create main settings, and save them to the root global object.
    var settings = require('./modules/settings');
    var f = settings.f;
    //console.log('settings', g);



// Update
    //g.f.update();



// Server setup

    var bodyParser = require('body-parser');
    var express = require('express');

    var app = express();

    var server = app.listen(4233, function () {

        var host = server.address().address;
        var port = server.address().port;

        console.log('Example app listening at http://%s:%s', host, port);

    });

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    app.get('/', function (req, res) {
        res.send('Hello Drawing!');
    });

// Get database data
    //var database_json_URL = 'http://10.173.64.204:8000/temporary/';
    var database_json_URL = 'data/fsec_copy.json';
    //$.getJSON( database_json_URL)
    //    .done(function(json){
    //        g.database = json;
    //        //console.log('database loaded', settings.database);
    //        g.f.load_database(json);
    //        g.state.database_loaded = true;
    //        if( g.state.mode === 'dev'){
    //            g.f.settings_dev_defaults(g);
    //        }
    //        g.f.update();

    //        ////////
    //        // TEMP
    //        g.f.request_SVG();
    //        ////////
    //    });

// Plans machine function
    app.post('/plans_machine', function(req, res, next) {

        console.log('/ plans machine');

        //console.log( 'body', req.body );
        //for( var name in req.body ){
        //        console.log(name);
        //}

        //console.log('user_input', user_input);
        //console.log('address', user_input.location.address);
        //console.log('- plans machine');


        var user_input =  JSON.parse( req.body.user_input_json );
        settings.user_input = user_input;

        f.process(settings);


        //for( var name in user_input){
        //    console.log( name );
        //}
        /*
        // parse URL
        var url_parts = url.parse(req.url);
        // parse query
        var raw = querystring.parse(url_parts.query);
        // some juggling e.g. for data from jQuery ajax() calls.
        console.log( 'raw', raw );
        var data = raw ? raw : {};
        data = raw.data ? JSON.parse(raw.data) : data;


        console.log( data );
        //console.log( data.user_input_json );
        //var user_input = JSON.parse(data.user_input_json);

        //*/

        //console.log( user_input );

        console.log('- plans machine');
        //console.log( JSON.parse(req.data) );
        console.log('\\ plans machine');


        //*/

        res.send('plans machine');
    });
