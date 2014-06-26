'use strict';
console.log('kontainer')
var test_add = require('./test');

console.log('test', test_add(1))

var kontainer = {};


function get( ns_string, value ){
    var parent = kontainer;
    if( typeof ns_string === 'undefined' ){
        return parent;
    } else {
        var next_level, level_name;
        var level_name_array = ns_string.split('.');
        level_name_array.forEach(function(level_name,i){
            if( typeof next_level !== 'undefined' ) {
                parent = next_level;
            }
            if( typeof parent[level_name] === 'undefined' ) {
                if( typeof value !== 'undefined' ) {
                    parent[level_name] = {};
                } else {
                    return undefined; 
                }
            }
            next_level = parent[level_name];
        });
        
        if( typeof value !== 'undefined' ) {
            parent[level_name] = value;
        }

        return parent;
    }
}


module.exports = get;
