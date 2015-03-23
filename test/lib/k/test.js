"use strict";

var x = {};
x.y = 42;

var add = function(input){
    var local = x;
    local.y += input;
    //x.y = local;
    return local.y;
};

var wrapper_prototype = {

    html: function(html){
       this.elem.innerHTML = html;
       return this;
    },
    append: function(sub_element){
        this.elem.appendChild(sub_element.elem); 
        return this;
    },
    appendTo: function(parent_element){
        parent_element.append(this); 
        return this;
    },
    attr: function(name, value ){
        var attributeName;
        if( name === 'class'){
            attributeName = 'className';
        } else {
            attributeName = name; 
        }
        this.elem[attributeName] = value; 
        return this;
    },



};
module.exports.wrapper_prototype = wrapper_prototype;
module.exports.test = { x: 42};
