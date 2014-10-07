'use strict';

var misc = {};

misc.objectDefined = function(object){
    var output = true
    for( var key in object ){
        output &= object.hasOwnProperty(key)
        console.log( key, object.hasOwnProperty(key) )    
    }
    return output;
}


module.exports = misc;
