'use strict';
var log = console.log.bind(console);

var kontainer = {};

function get( ns_string, value ){
    var mode;
    if( typeof value === 'undefined' ) mode = 'get'
    if( typeof ns_string === 'undefined' ) mode = 'get all'
    if( typeof value !== 'undefined' ) mode = 'set'

    var parent = kontainer;
    
    if( mode === 'get all' ){
        return parent;
    } else {
        var level_name_array = ns_string.split('.');
        level_name_array.forEach(function(level_name,i){
            if( typeof parent[level_name] === 'undefined' ) {
                if( mode === 'set') {
                    parent[level_name] = {};
                } else {
                    //return undefined; 
                    return 'not defined'; 
                }
            }
            if( (i+1)-level_name_array.length === 0 && mode === 'set' ) {
                parent[level_name] = value;
            } else {
                parent = parent[level_name];
            }
        });
        

        return parent;
    }
}


module.exports = get;
