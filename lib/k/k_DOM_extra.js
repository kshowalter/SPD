'use strict';
var log = console.log.bind(console);

var k = require('./k.js');
var kontainer = require('./kontainer');

var k_DOM = require('./k_DOM.js');
var wrapper_prototype = require('./wrapper_prototype');






var selector_prototype = {
    change: function(new_value){
        if( new_value !== undefined ) { 
            this.set_value(new_value);
        }
        this.expanded = !this.expanded;
        if( this.g_update !== undefined ){
            this.g_update();
        }
    },
    set_value: function(new_value){
        if( new_value !== undefined ) {
            log( 'new value',this.kontainer.refString,  new_value)
            this.kontainer.set(new_value);
        }
        this.elem_value = document.createElement('a');
        this.elem_value.href = '#';
        this.elem_value.setAttribute('class', 'selector');
        //this.elem_value.innerHTML = this.kontainer.get();
        this.elem_value.innerHTML = this.kontainer.get();
        var that = this;
        this.elem_value.addEventListener('click', function(){
            that.location = this.getBoundingClientRect();
            that.change();
        }, false);
        //settings(this.setting, this.value);
        return this;    
    },
    update: function(){
        //log('updating: ', this)
        this.update_options();
        this.set_value();
        this.update_elements();
        return this;
    },
    update_options: function(){
        //TODO: find way to do this other than eval
        if( this.optionsKontainer.ready ) {
            this.options = this.optionsKontainer.get();
        }
        if( this.options !== undefined && this.options instanceof Array) {
            this.elem_options.innerHTML = '';
            //log('options:', this.options);
            this.options.forEach(function(value,id){
                var o = document.createElement('a');
                o.href = '#';
                o.setAttribute('class', 'selector_option');
                o.innerHTML = value;
                var that = this;
                o.addEventListener('click', function(){
                    that.change(value);
                }, false);
                this.elem_options.appendChild(o);

            }, this);
            if( ! (this.options.indexOf(this.kontainer.get())+1) ){
                this.set_value(this.options[0]);
            }
        }
        return this;
    },
    update_elements: function() {
        if(this.expanded){
            this.elem.innerHTML = "";
            this.elem.appendChild(this.elem_options);
        } else {
            this.elem.innerHTML = "";
            this.elem.appendChild(this.elem_value);
        }
    },
    setUpdate: function(update_function){
        this.g_update = update_function; 
        return this;    
    },
    setRef: function(refString){
        this.refString = refString;
        if( this.kontainer === undefined && this.refObject !== undefined ){
            this.kontainer = Object.create(kontainer);
        }
        if( this.kontainer !== undefined ) {
            this.kontainer.ref(this.refString);
            this.kontainer.obj(this.refObject);
        }

        return this;
    },
    setRefObj: function(refObject){
        this.refObject = refObject;
        if( this.kontainer === undefined && this.refString !== undefined ){
            this.kontainer = Object.create(kontainer);
        }
        if( this.kontainer !== undefined ) {
            this.kontainer.ref(this.refString);
            this.kontainer.obj(this.refObject);
        }
        if( this.optionsKontainer === undefined && this.refOptionsString !== undefined ){
            this.optionsKontainer = Object.create(kontainer);
        }
        if( this.optionsKontainer !== undefined ) {
            this.optionsKontainer.ref(this.refOptionsString);
            this.optionsKontainer.obj(this.refObject);
        }
        return this;
    },
    setOptionsRef: function(refString){
        this.refOptionsString = refString;
        if( this.optionsKontainer === undefined && this.refObject !== undefined ){
            this.optionsKontainer = Object.create(kontainer);
        }
        if( this.optionsKontainer !== undefined ) {
            this.optionsKontainer.ref(this.refOptionsString);
            this.optionsKontainer.obj(this.refObject);
        }

        return this;
    },
};
for( var id in wrapper_prototype ) {
    if( wrapper_prototype.hasOwnProperty(id) ) {
        selector_prototype[id] = wrapper_prototype[id]; 
    }
}

var selector = function(){
    var s = Object.create(selector_prototype);
    s.type = 'selector';
    s.expanded = false;
    s.elem = document.createElement('span');
    s.elem.setAttribute('class', 'selector_menu');

    s.elem_options = document.createElement('span');
    s.elem_value = document.createElement('span');
    s.elem_value.innerHTML = '-';
    
    return s;
};





var value_prototype = {
    update: function(){
        //log('running value update', this)
        /*
        if( this.g_update !== undefined ){
            this.g_update();
        }
        */
        if( typeof this.kontainer !== 'undefined' ){
            this.value = this.kontainer.get();
            //log('updating value', this.value)
        }
        if( isNaN(Number(this.value)) ){
            this.elem.innerHTML = this.value;
        } else {
            this.elem.innerHTML = Number(this.value).toFixed(3);
            if( this.min !== undefined && this.value <= this.min ) {
                this.attr('class', 'valueOutOfRange');
            } else if( this.max !== undefined && this.value >= this.max ) {
                this.attr('class', 'valueOutOfRange');
            } else {
                this.attr('class', '');
            }
        }
        return this;
    },
    set: function(new_value) {
        if( typeof new_value !== 'undefined' ){
            this.value = new_value;
        }
        return this;
    },
//    setUpdate: function(update_function){
//        this.g_update = update_function; 
//    },
    setRef: function(refString){
        this.refString = refString;
        if( this.kontainer === undefined && this.refObject !== undefined ){
            this.kontainer = Object.create(kontainer);
        }
        if( this.kontainer !== undefined ) {
            this.kontainer.ref(this.refString);
            this.kontainer.obj(this.refObject);
        }

        return this;
    },
    setRefObj: function(refObject){
        this.refObject = refObject;
        if( this.kontainer === undefined && this.refString !== undefined ){
            this.kontainer = Object.create(kontainer);
        }
        if( this.kontainer !== undefined ) {
            this.kontainer.ref(this.refString);
            this.kontainer.obj(this.refObject);
        }
        return this;
    },
    setMax: function(value){
        this.max = value;
        this.update();
        return this;
    },
    setMin: function(value){
        this.min = value;
        this.update();
        return this;
    },
};
for( var id in wrapper_prototype ) {
    if( wrapper_prototype.hasOwnProperty(id) ) {
        value_prototype[id] = wrapper_prototype[id]; 
    }
}



function value() {
    var v = Object.create(value_prototype);
    v.type = 'value';
    v.elem = document.createElement('span');

    v.value = '-';
    v.innerHTML = v.value;
    v.reference = false;


    v.update();

    return v;
}



// Browserify
module.exports.selector = selector;
module.exports.value = value;
//module.exports.$ = $;

