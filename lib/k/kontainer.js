'use strict';
console.log('kontainer')
var test_add = require('./test');

console.log('test', test_add(1))

var kontainer = {};


function get( ns_string, value ){
    var level = kontainer;
    if( ns_string === undefined ){
        return level;
    } else {
        var level_name_array = ns_string.split('.');
        level_name_array.forEach(function(level_name,i){
            if( level[level_name] === undefined ) {
                if( value !== undefined ) {
                    level[level_name] = {};
                } else {
                    return undefined; 
                }
            }
            level = level[level_name];
        });
        
        if( value !== undefined ) {
            level = value;
        }

        return level;
    }
}


module.exports = get;
