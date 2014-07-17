
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
    log('tables', tables);
    settings.NEC_tables = tables;
}


function loadModules(string){
    var db = k.parseCSV(string);
    log('db', db);
    
    for( var i in db ){
        var module = db[i];
        if( config_options.modules[module.Make] === undefined ){
            config_options.modules[module.Make] = {};
        }
        if( config_options.modules[module.Make][module.Model] === undefined ){
            config_options.modules[module.Make][module.Model] = {};
        }
        config_options.modules[module.Make][module.Model] = module;
    }

    update_system();
    log('system', system);

}



module.exports.loadTables = loadTables;
module.exports.loadModules = loadModules;


