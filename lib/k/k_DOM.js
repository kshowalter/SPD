'use strict';
//console.log( 'LUE', require('./test.js').number )
//var Value = require('./k_DOM_extra.js').Value;
//var Selector = require('./k_DOM_extra.js').Selector;

//console.log( 'k.test', require('k/k.js').test() )

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



}

var Wrap = function(element){
    var W = Object.create(wrapper_prototype);

    W.elem = element;

    return W;

}

var $ = function(input){
    if( typeof input === 'undefined' ) {
        //log('input needed');
        return false;
    }
    if( input.substr(0,1) === '#' ) {
        var element = document.getElementById(input.substr(1));
        return Wrap(element);
    } else if( input.substr(0,1) === '.' ) {
        var element = document.getElementByClassName(input.substr(1)[0]);
        return Wrap(element);
    } else {
        if( input === 'value' ) {
            if( Value !== undefined ) {
                var element = Value(); 
                return element;
            } else {
                console.log("Error: Value not defined");
                return false;
            }
        } else if( input === 'selector' ) {
            if( Selector !== undefined ) {
                var element = Selector(); 
                return element;
            } else {
                console.log("Error: Selector not defined");
                return false;
            }
        } else {
            var element = document.createElement(input);
            return Wrap(element);
        }
    }
    


}

// Browserify
module.exports.$ = $;
module.exports.wrapper_prototype = wrapper_prototype;
