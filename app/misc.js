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

misc.nullToObject = function nullToObject(object){
    for( var key in object ){
        if( object.hasOwnProperty(key) ){
	    if( object[key] === null ){
		object[key] = {};
	    } else if( typeof object[key] === 'object' ) {
		object[key] = nullToObject(object[key]);
	    }
	}
    }
    return object;
}

module.exports = misc;
