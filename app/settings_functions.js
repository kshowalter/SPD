var k = require('../lib/k/k.js')
var log = console.log.bind(console);

function loadTables(string, base){
    var tables = {};
    var l = string.split('\n');
    var title;
    var fields;
    var need_title = true;
    var need_fields = true;
    l.forEach( function(string, i){
        var line = string.trim();
        if( line.length === 0 ){
            need_title = true;
            need_fields = true;
        } else if( need_title ) {
            title = line;
            tables[title] = [];
            need_title = false; 
            //log('new table ', title)
        } else if( need_fields ) {
            fields = line.split(',');
            need_fields = false;
        } else {
            var entry = {};
            var line_array = line.split(',');
            fields.forEach( function(field, id){
                entry[field.trim()] = line_array[id].trim(); 
            });
            tables[title].push( entry );
        }
    });
    base.NEC_tables = tables;
}


function loadModules(string, base){
    base.config_options.modules = {};
    var db = k.parseCSV(string);
    
    for( var i in db ){
        var module = db[i];
        if( base.config_options.modules[module.Make] === undefined ){
            base.config_options.modules[module.Make] = {};
        }
        if( base.config_options.modules[module.Make][module.Model] === undefined ){
            base.config_options.modules[module.Make][module.Model] = {};
        }
        base.config_options.modules[module.Make][module.Model] = module;
    }

    //update_system();

}



module.exports.loadTables = loadTables;
module.exports.loadModules = loadModules;

