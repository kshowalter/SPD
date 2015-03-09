'use strict';


// Setup
    // Load and create main settings, and save them to the root global object.
    //g = require('./modules/settings');
    //console.log('settings', g);



// Update
    //g.f.update();



var sys = require("sys"),
my_http = require("http"),
path = require("path"),
url = require("url"),
filesys = require("fs");
my_http.createServer(function(request,response){
    var my_path = url.parse(request.url).pathname;
    var full_path = path.join(process.cwd(),my_path);
    path.exists(full_path,function(exists){
        if(!exists){
            response.writeHeader(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
        }
        else{
            filesys.readFile(full_path, "binary", function(err, file) {
                 if(err) {
                     response.writeHeader(500, {"Content-Type": "text/plain"});
                     response.write(err + "\n");
                     response.end();

                 }
                 else{
                    response.writeHeader(200);
                    response.write(file, "binary");
                    response.end();
                }

            });
        }
    });
}).listen(8080);  





router.post('/', function(req, res, next) {

    console.log('/ plans machine');


    //console.log( req.body.user_input_json );
    var user_input =  JSON.parse( req.body.user_input_json );
    console.log('user_input', user_input);
    console.log('address', user_input.location.address);
    console.log('- plans machine');
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
