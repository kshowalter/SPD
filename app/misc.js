'use strict';

var misc = {};

misc.objectDefined = function(object){
    var output = true;
    for( var key in object ){
        output &= object.hasOwnProperty(key);
        //console.log( key, object.hasOwnProperty(key) );
    }
    return output;
};

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
};

misc.blankCopy = function blankCopy(object){
    var newObject = {};
    for( var key in object ){
        if( object.hasOwnProperty(key) ){
	        if( typeof object[key] === 'object' ) {
                var section = {};
                newObject[key] = section;
                for( var key2 in object ){
                    if( object.hasOwnProperty(key) ){
                        section[key2] = false;
                    }
                }
	        } else {
                newObject[key] = false;
            }
	    }
    }
    return newObject;
};

module.exports = misc;
