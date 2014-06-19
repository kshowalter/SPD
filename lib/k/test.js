"use strict";

var x = 42;

var add = function(input){
    var local = x;
    local += input;
    return local;
};

module.exports = add;
