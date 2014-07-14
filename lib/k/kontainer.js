'use strict';
var log = console.log.bind(console);

var kontainer = {
    ref: function(refString){
        if( typeof refString === 'undefined' ){
            return this.refString;
        } else {
            this.refString = refString;
            this.refArray = refString.split('.');
        }
    },
    obj: function(obj){
        if( typeof obj === 'undefined' ){
            return this.object;
        } else {
            this.object = obj;
        }
    },
    set: function(input){
        if( typeof this.object === 'undefined' || typeof this.refString === 'undefined' ){
            log('kontainer missing components');
            return false;
        }
        var level = this.object;
        this.refArray.forEach(function(level_name,i){
            if( typeof level[level_name] === 'undefined' ) {
                level[level_name] = {};
            }
            level = level[level_name];
        });
        level = input;
        return level;
    },
    get: function(){
        var level = this.object;
        this.refArray.forEach(function(level_name,i){
            level = level[level_name];
        });
        return level;
    },
};

module.exports = kontainer;
