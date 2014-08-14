var k = require('../lib/k/k.js')
var log = console.log.bind(console);
//var update_system = require('./update').update_system;

function loadTables(string){
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
            tables[title+"_fields"] = fields;
            need_fields = false;
        //} else {
        //    var entry = {};
        //    var line_array = line.split(',');
        //    fields.forEach( function(field, id){
        //        entry[field.trim()] = line_array[id].trim(); 
        //    });
        //    tables[title].push( entry );
        //}
        } else {
            var line_array = line.split(',');
            tables[title][line_array[0].trim()] = line_array[1].trim(); 
        }
    });

    return tables;
}


function loadModules(string){
    var db = k.parseCSV(string);
    var modules = {}    
    for( var i in db ){
        var module = db[i];
        if( modules[module.Make] === undefined ){
            modules[module.Make] = {};
        }
        if( modules[module.Make][module.Model] === undefined ){
            modules[module.Make][module.Model] = {};
        }

        var fields = k.objIdArray(module)
        fields.forEach( function( field ){
            var param = module[field];
            if( ! isNaN(parseFloat(param))){
                module[field] = parseFloat(param);
            }
        })
        modules[module.Make][module.Model] = module;
    }

    return modules;
}


function loadComponents(string){
    var db = k.parseCSV(string);
    var object = {}    
    for( var i in db ){
        var component = db[i];
        if( object[component.Make] === undefined ){
            object[component.Make] = {};
        }
        if( object[component.Make][component.Model] === undefined ){
            object[component.Make][component.Model] = {};
        }

        var fields = k.objIdArray(component)
        fields.forEach( function( field ){
            var param = component[field];
            if( ! isNaN(parseFloat(param))){
                component[field] = parseFloat(param);
            }
        })
        object[component.Make][component.Model] = component;
    }

    return object;
}



module.exports.loadTables = loadTables;
module.exports.loadModules = loadModules;
module.exports.loadComponents = loadComponents;

