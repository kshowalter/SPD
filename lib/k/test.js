"use strict";

var x = {};
x.y = 42;

var add = function(input){
    var local = x;
    local.y += input;
    //x.y = local;
    return local.y;
};

module.exports = add;
