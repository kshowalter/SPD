
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
    update_options: function(){
        //TODO: find way to do this other than eval
        if( this.options_reference !== undefined ) {
            eval( 'this.options = ' + this.options_reference + ";" );
        }
        if( this.options !== undefined ) {
            this.elem_options.innerHTML = '';
            this.options.forEach(function(value,id){
                var o = document.createElement('a')
                o.href = '#';
                o.setAttribute('class', 'selector_option');
                o.innerHTML = value;
                var that = this;
                o.addEventListener('click', function(){
                    that.change(value);
                }, false);
                this.elem_options.appendChild(o);

            }, this);
            if( ! (this.options.indexOf(this.value)+1) ){
                this.set_value(this.options[0]);
            }
        }
        return this;
    },
    set_value: function(new_value){
        if( new_value !== undefined ) {
            this.value = new_value;
            this.elem_value = document.createElement('a');
            this.elem_value.href = '#';
            this.elem_value.setAttribute('class', 'selector');
            this.elem_value.innerHTML = this.value;
            var that = this;
            this.elem_value.addEventListener('click', function(){
                that.location = this.getBoundingClientRect();
                that.change();
            }, false);
        }
        settings[this.setting] = this.value;
        return this;    
    },
    set_options: function(options_reference) {
        this.options_reference = options_reference;
        //TODO: find way to do this other than eval
        return this;
    },
    set_setting: function(new_setting){
        this.setting = new_setting;
        if( settings[this.setting] !== undefined ) {
            this.set_value(settings[this.setting]);
        } else {
            this.set_value();
        }
        return this;
    },
    setUpdate: function(update_function){
        this.g_update = update_function; 
    },
    update: function(){
        this.update_options();
        this.update_elements();
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
}
for( var id in elem_prototype ) {
    if( elem_prototype.hasOwnProperty(id) ) {
        selector_prototype[id] = elem_prototype[id]; 
    }
}

var Selector = function(){
    var s = Object.create(selector_prototype);
    s.type = 'selector';
    s.expanded = false;
    s.elem = document.createElement('span');
    s.elem.setAttribute('class', 'selector_menu');

    s.elem_options = document.createElement('span');
    s.elem_value = document.createElement('span');
    s.elem_value.innerHTML = '-';
    
    settings_registry.push(s);
    return s;
};





var value_prototype = {
    update: function(){
        if( this.g_update !== undefined ){
            this.g_update();
        }
        if( this.reference ){
            eval( 'this.value = ' + this.reference + ';' );
        }    
        if( isNaN(Number(this.value)) ){
            this.elem.innerHTML = this.value;
        } else {
            this.elem.innerHTML = Number(this.value).toFixed(3);
            if( this.min !== undefined && this.value <= this.min ) {
                this.attr('class', 'valueOutOfRange')
            } else if( this.max !== undefined && this.value >= this.max ) {
                this.attr('class', 'valueOutOfRange')
            } else {
                this.attr('class', '')
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
    setUpdate: function(update_function){
        this.g_update = update_function; 
    },
    setRef: function(reference){
        if( typeof reference !== 'undefined' ){
            this.reference = reference;
        }
        return this;
    },
    setMax: function(value){
        this.max = value;
        this.update;
        return this;
    },
    setMin: function(value){
        this.min = value;
        this.update;
        return this;
    },
}
for( var id in elem_prototype ) {
    if( elem_prototype.hasOwnProperty(id) ) {
        value_prototype[id] = elem_prototype[id]; 
    }
}

function Value() {
    var v = Object.create(value_prototype);
    v.type = 'value';
    v.elem = document.createElement('span');

    v.value = '-';
    v.innerHTML = v.value;
    v.reference = false;


    v.update();

    settings_registry.push(v);
    return v;
}


