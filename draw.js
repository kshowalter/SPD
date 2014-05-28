'use strict';
//var MINI = require('minified');
//var _=MINI._, $=MINI.$, $$=MINI.$$, EE=MINI.EE, HTML=MINI.HTML;


// PV Systems drawing generator
var elem_prototype = {

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
    attr: function(attributeName, value ){
        this.elem[attributeName] = value; 
        return this;
    },



}

var Elem = function(element){
    var E = Object.create(elem_prototype);

    E.elem = element;

    return E;

}

var $ = function(input){
    if( typeof input === 'undefined' ) {
        log('input needed');
        return false;
    }
    if( input.substr(0,1) === '#' ) {
        var element = document.getElementById(input.substr(1));
        return Elem(element);
    } else if( input.substr(0,1) === '.' ) {
    
    } else {
        if( input === 'value' ) {
            var element = Value(); 
            return element;
        } else if( input === 'selector' ) {
            var element = Selector(); 
            return element;
        } else {
            var element = document.createElement(input);
            return Elem(element);
        }
    }
    


}


var selector_prototype = {
    change: function(new_value){
        //log('change to ' + new_value);
        if( new_value !== undefined ) { 
            this.set_value(new_value);
        }
        this.expanded = !this.expanded;
        this.update();
        update();
    },
    update_options: function(){
        //TODO: find way to do this other than eval
        if( this.options_reference ) {
            log(this.options_reference)
            eval( 'this.options = ' + this.options_reference );
        }
        this.elem_options = document.createElement('span');
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
        this.update_elements();
        return this;
    },
    set_value: function(new_value){
        this.value = new_value;
        settings[this.setting] = new_value;
        this.elem_value = document.createElement('a');
        this.elem_value.href = '#';
        this.elem_value.setAttribute('class', 'selector');
        this.elem_value.innerHTML = this.value;
        var that = this;
        this.elem_value.addEventListener('click', function(){
            that.location = this.getBoundingClientRect();
            that.change();
        }, false);
        //this.elem.appendChild(this.elem_value);
        //this.update_elements();
        this.update();
        return this;    
    },
    set_options: function(options_reference) {
        this.options_reference = options_reference;
        //TODO: find way to do this other than eval
        //eval( 'this.options = ' + this.options_reference );
        this.update();
        return this;
    },
    set_setting: function(new_setting){
        this.setting = new_setting;
        return this;
    },

    update: function(){
        log('updating: ', this.setting)
        this.update_options()
        this.update_elements();
    },
    update_elements: function() {
        if(this.expanded){
            this.elem.innerHTML = "";
            this.elem.appendChild(this.elem_options);
        } else {
            this.elem.innerHTML = "";
            this.elem.appendChild(this.elem_value);
        }
    }
}
for( var id in elem_prototype ) {
    if( elem_prototype.hasOwnProperty(id) ) {
        selector_prototype[id] = elem_prototype[id]; 
    }
}

var Selector = function(){
    var s = Object.create(selector_prototype);
    s.options = ['none'];
    s.expanded = false;
    //s.setting = setting;
    s.elem = document.createElement('span');
    s.elem.setAttribute('class', 'selector_menu');

    s.update_options();

    
    settings_registry.push(s);
    return s;
};

var value_prototype = {
    update: function(){
        if( this.reference ){
            eval( 'this.value = ' + this.reference + ';' );
        }    
        this.elem.innerHTML = this.value;
        return this;
    },
    set: function(new_value) {
        if( typeof new_value !== 'undefined' ){
            this.value = new_value;
        }
        return this;
    },
    setRef: function(reference){
        if( typeof reference !== 'undefined' ){
            this.reference = reference;
        }
        return this;
    },
}
for( var id in elem_prototype ) {
    if( elem_prototype.hasOwnProperty(id) ) {
        selector_prototype[id] = elem_prototype[id]; 
    }
}

function Value(value) {
    value = value || false;
    //var v = Object.create(value_prototype);
    var v = Object.create(value_prototype);
    value.elem = document.createElement('span');

    v.value = value;
    v.innerHTML = v.value;
    v.reference = false;


    v.update();

    settings_registry.push(v);
    return v;
}

var appendElement = function(parentElement,name,attrs,text){
  var doc = parentElement.ownerDocument;
  var svg = parentElement;
  while (svg.tagName!='svg') svg = svg.parentNode;
  var el = doc.createElementNS(svg.namespaceURI,name);
  for (var a in attrs){
    if (!attrs.hasOwnProperty(a)) continue;
    var p = a.split(':');
    if (p[1]) el.setAttributeNS(svg.getAttribute('xmlns:'+p[0]),p[1],attrs[a]);
    else el.setAttribute(a,attrs[a]);
  }
  if (text) el.appendChild(doc.createTextNode(text));
  return parentElement.appendChild(el);
};














///////////////////
// misc functions

function format_floats( elem, index, array ) {
    array[index] = parseFloat(elem).toFixed(2);
}

function format_float( str ) {
    return parseFloat(str).toFixed(2);
}

var clear = function(div_id){
    document.getElementById(div_id).innerHTML = '';
}

function obj_id_array( object ) {
    var a = [];
    for( var id in object ) {
        if( object.hasOwnProperty(id) )  {
            a.push(id);
        }
    }
    return a;
}

/*
 *  normRand: returns normally distributed random numbers
 *  http://memory.psych.mun.ca/tech/snippets/random_normal/
 */
function normRand(mu, sigma) {
    var x1, x2, rad;

    do {
        x1 = 2 * Math.random() - 1;
        x2 = 2 * Math.random() - 1;
        rad = x1 * x1 + x2 * x2;
    } while(rad >= 1 || rad === 0);

    var c = Math.sqrt(-2 * Math.log(rad) / rad);
    var n = x1 * c;
    return (n * mu) + sigma;
}

var settings_registry = [];



///////////////
//#system parameters

var components = {};
components.inverters = {};
components.inverters['SI3000'] = {
    make:'SMA',
    model:'3000',

    DC_voltageWindow_low: 150,
    DC_voltageWindow_high: 350,
    max_power: 3300,

    AC_options: ['240','208'],

};

components.modules = {};
components.modules['Suniva'] = {
    '255-60-4-1B0': {
        Pmax: 255,
        Isc: 8.96,
        Voc: 38.10,
        Imp: 8.45,
        Vmp: 30.20,
    },
    '260-60-4-1B0': {
        Pmax: 260,
        Isc: 9.01,
        Voc: 38.30,
        Imp: 8.52,
        Vmp: 30.50,
    },
    '265-60-4-1B0': {
        Pmax: 265,
        Isc: 9.12,
        Voc: 38.30,
        Imp: 8.64,
        Vmp: 30.70,
    },
    '270-60-4-1B0': {
        Pmax: 270,
        Isc: 9.18,
        Voc: 38.40,
        Imp: 8.70,
        Vmp: 31.00,
    },

};
components.modules['Sunmodule'] = {
    'Protect SW 265 mono': {
        Pmax: 265,
        Isc: 9.31,
        Voc: 39.0,
        Imp: 8.69,
        Vmp: 30.8,
    },
    'Protect SW 270 mono': {
        Pmax: 270,
        Isc: 9.44,
        Voc: 39.2,
        Imp: 8.81,
        Vmp: 30.9,
    },
};


var addInverter = function(){
        

};

var AC_types = {
    '120V'      : ['ground', 'neutral', 'L1' ],
    '240V'      : ['ground', 'neutral', 'L1', 'L2' ],
    '208V'      : ['ground', 'neutral', 'L1', 'L2' ],
    '277V'      : ['ground', 'neutral', 'L1' ],
    '480V Wye'  : ['ground', 'neutral', 'L1', 'L2', 'L3' ],
    '480V Delta': ['ground', 'L1', 'L2', 'L3' ],
}







var settings = {};
settings.string_num = 4;
settings.string_modules = 6;
settings.inverter = 'SI3000';
settings.AC_type = '480V Delta';


log('settings', settings);

var values = {};

var system = {};

function update_system() {
    system.DC = {};
    system.DC.string_num = settings.string_num; 
    system.DC.string_modules = settings.string_modules;
    system.DC.module = {}
log('module before', system.DC.module.model)
    system.DC.module.make = settings['pv_make'] || Object.keys( components.modules )[0];
    system.DC.module.model= settings['pv_model'] || Object.keys( components.modules[system.DC.module.make] )[0];
    system.DC.module.specs = components.modules[system.DC.module.make][system.DC.module.model];
    system.inverter = components.inverters[settings.inverter];

    system.AC_loadcenter_type = '480/277V';

    system.AC_type = settings.AC_type;

    system.AC_conductors = AC_types[system.AC_type];

log('module after', system.DC.module.model)
    system.module = components.modules[settings.module];
    system.DC.current = system.DC.module.specs.Isc * system.DC.string_num;
    system.DC.voltage = system.DC.module.specs.Voc * system.DC.string_modules;

    system.wire_config_num = 5;
    
}
update_system();
log('system', system)

/////////////////////////////////////////////
// DRAWING



//////////////
// Model


////////////
// layers

var l_attr = {};

l_attr.base = {
    'fill': 'none',
    'stroke':'#000000',
    'stroke-width':'1px',
    'stroke-linecap':'butt',
    'stroke-linejoin':'miter',
    'stroke-opacity':1,

};
l_attr.block = Object.create(l_attr.base);
l_attr.frame = Object.create(l_attr.base);
l_attr.frame.stroke = '#000042'
l_attr.table = Object.create(l_attr.base);
l_attr.table.stroke = '#000042'

l_attr.DC_pos = Object.create(l_attr.base);
l_attr.DC_pos.stroke = '#ff0000';
l_attr.DC_neg = Object.create(l_attr.base);
l_attr.DC_neg.stroke = '#000000';
l_attr.DC_ground = Object.create(l_attr.base);
l_attr.DC_ground.stroke = '#006600';
l_attr.module = Object.create(l_attr.base);
l_attr.box = Object.create(l_attr.base);
l_attr.text = Object.create(l_attr.base);
l_attr.text.stroke = '#0000ff';
l_attr.terminal = Object.create(l_attr.base);

l_attr.AC_ground = Object.create(l_attr.base);
l_attr.AC_ground.stroke = 'Green';
l_attr.AC_neutral = Object.create(l_attr.base);
l_attr.AC_neutral.stroke = 'Gray';
l_attr.AC_L1 = Object.create(l_attr.base);
l_attr.AC_L1.stroke = 'Black';
l_attr.AC_L2 = Object.create(l_attr.base);
l_attr.AC_L2.stroke = 'Red';
l_attr.AC_L3 = Object.create(l_attr.base);
l_attr.AC_L3.stroke = 'Blue';

///////////////
// fonts

var fonts = {};
fonts['signs'] = {
    'font-family': 'monospace',
    'font-size':     5,
    'text-anchor':   'middle',
};
fonts['label'] = {
    'font-family': 'monospace',
    'font-size':     12,
    'text-anchor':   'middle',
};
fonts['title1'] = {
    'font-family': 'monospace',
    'font-size':     14,
    'text-anchor':   'left',
};
fonts['title2'] = {
    'font-family': 'monospace',
    'font-size':     12,
    'text-anchor':   'left',
};
fonts['page'] = {
    'font-family': 'monospace',
    'font-size':     20,
    'text-anchor':   'left',
}
fonts['table'] = {
    'font-family': 'monospace',
    'font-size':     6,
    'text-anchor':   'middle',
};


///////
// setup drawing containers

var elements = [];



// BLOCKS

var Blk = {
    type: 'block',
};
Blk.move = function(x, y){
    for( var i in this.elements ){
        this.elements[i].move(x,y);
    }
    return this;
};
Blk.add = function(){
    if( typeof this.elements == 'undefined'){ this.elements = [];}
    for( var i in arguments){
        this.elements.push(arguments[i]);
    }
    return this;
};
Blk.rotate = function(deg){
    this.rotate = deg;
};

var blocks = {};
var block_active = false;
// Create default layer,block container and functions

// Layers

var layer_active = false;

var layer = function(name){ // set current layer
    if( typeof name === 'undefined' ){ // if no layer name given, reset to default 
        layer_active = false;
    } else if ( ! (name in l_attr) ) {
        log('Error: unknown layer, using base')
        layer_active = 'base' 
    } else { // finaly activate requested layer
        layer_active = name;
    }
};

/*
var block = function(name) {// set current block
    // if current block has been used, save it before creating a new one.
    if( blocks[block_active].length > 0 ) { blocks.push(blocks[block_active]); }
    if( typeof name !== 'undefined' ){ // if name argument is submitted, create new block
        var blk = Object.create(Blk);
        blk.name = name; // block name
        blocks[block_active] = blk;
    } else { // else use default block
        blocks[block_active] = blocks[0];
    }
}
block('default'); // set current block to default
*/
var block_start = function(name) {
    if( typeof name === 'undefined' ){ // if name argument is submitted
        log('Error: name required');
    } else {
        // TODO: What if the same name is submitted twice? throw error or fix?
        block_active = name;
        if( typeof blocks[block_active] !== 'object'){
            var blk = Object.create(Blk);
            //blk.name = name; // block name
            blocks[block_active] = blk;
        }
        return blk;
    }
};

    /*
    x = loc.wire_table.x - w/2;
    y = loc.wire_table.y - h/2;
    if( typeof layer_name !== 'undefined' && (layer_name in layers) ) {
        var layer_selected = layers[layer_name]
    } else {
        if( ! (layer_name in layers) ){ log("error, layer does not exist, using current");}
        var layer_selected =  layer_active
    }
    */
var block_end = function() {
    var blk = blocks[block_active];
    block_active = false;
    return blk;
};



// clear drawing 
var clear_drawing = function() {
    for( var id in blocks ){
        if( blocks.hasOwnProperty(id)){
            delete blocks[id]; 
        }
    }
    elements.length = 0;
};


//////
// build prototype element

    /*
    if( typeof layer_name !== 'undefined' && (layer_name in layers) ) {
        var layer_selected = layers[layer_name]
    } else {
        if( ! (layer_name in layers) ){ log("error, layer does not exist, using current");}
        var layer_selected =  layer_active
    }
    */


var SvgElem = {
    object: 'SvgElem'
};
SvgElem.move = function(x, y){
    if( typeof this.points != 'undefined' ) {
        for( var i in this.points ) {
            this.points[i][0] += x;
            this.points[i][1] += y;
        }
    }
    return this;
};
SvgElem.rotate = function(deg){
    this.rotated = deg;
};

///////
// functions for adding elements

var add = function(type, points, layer_name) {

    if( typeof layer_name === 'undefined' ) { layer_name = layer_active; } 
    if( ! (layer_name in l_attr) ) { 
        log('Layer name not found, using base');
        layer_name = 'base'; 
    }

    if( typeof points == 'string') {
        var points = points.split(' ');
        for( var i in points ) {
            points[i] = points[i].split(',');
            for( var c in points[i] ) {
                points[i][c] = Number(points[i][c]);
            }
        }
    }

    var elem = Object.create(SvgElem);
    elem.type = type;
    elem.layer_name = layer_name;
    if( type === 'line' ) {
        elem.points = points;
    } else if( typeof points[0].x === 'undefined') {
        elem.x = points[0][0]; 
        elem.y = points[0][1]; 
    } else {
        elem.x = points[0].x
        elem.y = points[0].y; 
    }

    
    if(block_active) { 
        blocks[block_active].add(elem);
    } else {
        elements.push(elem);
    }

    return elem;
};

var line = function(points, layer){ // (points, [layer])
    //return add('line', points, layer)
    var line =  add('line', points, layer);
    return line;
};

var rect = function(loc, size, layer){
    var rec = add('rect', [loc], layer);
    rec.w = size[0];
    /*
    if( typeof layer_name !== 'undefined' && (layer_name in layers) ) {
        var layer_selected = layers[layer_name]
    } else {
        if( ! (layer_name in layers) ){ log("error, layer does not exist, using current");}
        var layer_selected =  layer_active
    }
    */
    rec.h = size[1];
    return rec;
};

var circ = function(loc, diameter, layer){
    var cir = add('circ', [loc], layer);
    cir.d = diameter;
    return cir;
};

var text = function(loc, strings, font, layer){
    var txt = add('text', [loc], layer);
    if( typeof strings == 'string'){
        strings = [strings];
    }
    txt.strings = strings;
    txt.font = font;
    return txt;
};

var block = function(name) {// set current block
    if( arguments.length === 2 ){ // if coor is passed
        if( typeof arguments[1].x !== 'undefined' ){
            var x = arguments[1].x;
            var y = arguments[1].y;
        } else {
            var x = arguments[1][0];
            var y = arguments[1][1];
        }
    } else if( arguments.length === 3 ){ // if x,y is passed
        var x = arguments[1];
        var y = arguments[2];
    }

    // TODO: what if block does not exist? print list of blocks?
    var blk = Object.create(blocks[name]);
    blk.x = x;
    blk.y = y;

    if(block_active){ 
        blocks[block_active].add(blk);
    } else {
        elements.push(blk);l_attr.AC_ground = Object.create(l_attr.base)
l_attr.AC_ground.stroke = '#006600'

    }
    return blk
};

/////////////////////////////////


log('elements', elements);
log('blocks', blocks);




//////////////
//#drawing parameters

var size = {};
var loc = {};

var update_values = function(){

    // sizes
    size.drawing = {
        w: 1000,
        h: 780,
        frame_padding: 5,
        titlebox: 50,
    }

    size.module = {};
    size.module.frame = {
        w: 10,
        h: 30,
    }
    size.module.lead = size.module.frame.w*2/3;
    size.module.h = size.module.frame.h + size.module.lead*2;
    size.module.w = size.module.frame.w;

    size.wire_offset = {
        base: 5,
        gap: size.module.w,
    }    
    size.wire_offset.max = system.DC.string_num * size.wire_offset.base;
    size.wire_offset.ground = size.wire_offset.max + size.wire_offset.base*2;

    size.string = {};
    size.string.gap = size.module.frame.w/42;
    size.string.gap_missing = size.string.gap + size.module.frame.w;
    size.string.h = (size.module.h * 4) + (size.string.gap * 2) + size.string.gap_missing;
    size.string.w = size.module.frame.w * 2.5;

    size.jb_box = {
        h: 140 + size.wire_offset.base*2 * system.DC.string_num,
        w: 80,
    }

    size.discbox = {
        w: 80 + size.wire_offset.base*2 * system.DC.string_num,
        h: 140,
    }

    size.terminal_diam = 5;

    size.inverter = { w: 200, h: 150 };
    size.inverter.text_gap = 15;
    size.inverter.symbol_w = 50;
    size.inverter.symbol_h = 25;

    size.AC_disc = { w: 75, h: 100 };

    size.AC_loadcenter = { w: 125, h: 300 }; 
    size.AC_loadcenter.breaker = { w: 20, h: 5, };

    size.AC_loadcenter.neutralbar = { w:5, h:40 }
    size.AC_loadcenter.groundbar = { w:40, h:5 }

    size.wire_table = {}
    size.wire_table.w = 200;
    size.wire_table.row_h = 10;
    size.wire_table.h = (system.wire_config_num+3) * size.wire_table.row_h;


    // location
    loc.array = { x:200, y:600 };
    loc.array.upper = loc.array.y - size.string.h/2;
    loc.array.lower = loc.array.upper + size.string.h;
    loc.array.right = loc.array.x - size.module.frame.h*2;
    loc.array.left = loc.array.right - ( size.string.w * system.DC.string_num ) - ( size.module.w * 1.25 ) ;

    loc.DC = loc.array;

    loc.inverter = { x:loc.array.x+300, y:loc.array.y-350 };
    loc.inverter.bottom = loc.inverter.y + size.inverter.h/2;
    loc.inverter.top = loc.inverter.y - size.inverter.h/2;
    loc.inverter.bottom_right = {
        x: loc.inverter.x + size.inverter.w/2,
        y: loc.inverter.y + size.inverter.h/2,
    };
    loc.AC_disc = { x: loc.array.x+475, y: loc.array.y-100 };
    loc.AC_disc.bottom = loc.AC_disc.y + size.AC_disc.h/2;
    loc.AC_disc.top = loc.AC_disc.y - size.AC_disc.h/2;
    loc.AC_disc.left = loc.AC_disc.x - size.AC_disc.w/2;
    loc.AC_disc.switch_top = loc.AC_disc.top + 15;
    loc.AC_disc.switch_bottom = loc.AC_disc.switch_top + 30;
    


    loc.AC_loadcenter = {
        x: loc.AC_disc.x+150, 
        y: loc.AC_disc.y-100
    };
    loc.AC_loadcenter.wire_bundle_bottom = loc.AC_disc.top - 20;
    loc.AC_loadcenter.left = loc.AC_loadcenter.x - size.AC_loadcenter.w/2;
    loc.AC_loadcenter.breakers = {
        left: loc.AC_loadcenter.x - ( size.AC_loadcenter.breaker.w * 1.1 ),
        spacing: size.terminal_diam,
    };
    loc.AC_loadcenter.neutralbar = {
        x: loc.AC_loadcenter.left + 20, 
        y: loc.AC_loadcenter.y + size.AC_loadcenter.h*0.2 
    };
    loc.AC_loadcenter.groundbar = {
        x: loc.AC_loadcenter.x + 10, 
        y: loc.AC_loadcenter.y + size.AC_loadcenter.h*0.45
    };

    loc.wire_table = {
        x: size.drawing.w - size.drawing.titlebox - size.drawing.frame_padding*3 - size.wire_table.w/2 - 25,
        y: size.drawing.frame_padding*3 + size.wire_table.h/2,
    }
    loc.wire_table.top = loc.wire_table.y - size.wire_table.h/2;
    loc.wire_table.bottom = loc.wire_table.y + size.wire_table.h/2;

    //loc.AC_loadcenter.breakers = 

}

log('size', size);
    
log('loc', loc);


///////////////
// build drawing

//#start drawing
var mk_drawing = function(){

    var x, y, h, w;


// Define blocks
// module block
    w = size.module.frame.w;
    h = size.module.frame.h;

    block_start('module');

    // frame
    layer('module');
    rect( [0,h/2], [w,h] );
    // frame triangle?
    line([
        [-w/2,0],
        [0,w/2],
    ]);
    line([
        [0,w/2],
        [w/2,0],
    ]);
    // leads
    layer('DC_pos');
    line([
        [0, 0],
        [0, -size.module.lead]
    ]);
    layer('DC_neg');
    line([
        [0, h],
        [0, h+(size.module.lead)]
    ]);
    // pos sign
    layer('text');
    text(
        [size.module.lead/2, -size.module.lead/2],
        '+',
        'signs'
    );
    // neg sign
    text(
        [size.module.lead/2, h+size.module.lead/2],
        '-',
        'signs'
    );
    // ground
    layer('DC_ground');
    line([
        [-w/2, h/2],
        [-w/2-w/4, h/2],
    ]);

    layer();
    block_end();

//#string
    block_start('string');

    x = 0;
    y = 0;

    y += size.module.lead; 

    //TODO: add loop to jump over negative return wires 
    layer('DC_ground');
    line([
        [x-size.module.frame.w*3/4, y+size.module.frame.h/2],
        [x-size.module.frame.w*3/4, y+size.string.h + size.wire_offset.ground + size.module.lead*0.5 ],
    ]);
    layer();

    block('module', [x,y]);
    y += size.module.frame.h + size.module.lead*2 + size.string.gap_missing;
    block('module', [x,y]);
    y += size.module.frame.h + size.module.lead*2 + size.string.gap;
    block('module', [x,y]);
    y += size.module.frame.h + size.module.lead*2 + size.string.gap;
    block('module', [x,y]);

    block_end();


// terminal
    block_start('terminal');
    x = 0;
    y = 0;

    layer('terminal');
    circ(
        [x,y],
        size.terminal_diam
    )
    layer();
    block_end();

////////////////////////////////////////
// Frame

    w = size.drawing.w;
    h = size.drawing.h;
    var padding = size.drawing.frame_padding; 

    layer('frame');

    //border
    rect( [w/2 , h/2], [w - padding*2, h - padding*2 ] );
    
    x = w - padding * 3;
    y = padding * 3;

    w = size.drawing.titlebox;
    h = size.drawing.titlebox;

    // box top-right
    rect( [x-w/2, y+h/2], [w,h] );
    
    y += h + padding; 

    w = size.drawing.titlebox;
    h = size.drawing.h - padding*8 - size.drawing.titlebox*2.5;
    
    //title box
    rect( [x-w/2, y+h/2], [w,h] );

    var title = {};
    title.top = y;
    title.bottom = y+h;
    title.right = x;
    title.left = x-w ;


    // box bottom-right
    h = size.drawing.titlebox * 1.5;
    y = title.bottom + padding; 
    rect( [x-w/2, y+h/2], [w,h] );
    
    var page = {};
    page.right = title.right;
    page.left = title.left;
    page.top = title.bottom + padding;
    page.bottom = page.top + size.drawing.titlebox*1.5;
    // Text

    x = title.left + padding;
    y = title.bottom - padding;

    x += 10;
    text([x,y], 
         [ system.inverter.make + " " + system.inverter.model + " Inverter System" ],
        'title1', 'text').rotate(-90);

    x += 14;
    text([x,y], [
        system.DC.module.specs.make + " " + system.DC.module.specs.model + 
            " (" + system.DC.string_num  + " strings of " + system.DC.string_modules + " modules )"
    ], 'title2', 'text').rotate(-90);
        
    x = page.left + padding;
    y = page.top + padding;
    y += size.drawing.titlebox * 1.5 * 3/4;


    text([x,y],
        ['PV1'],
        'page', 'text');

////////////////////////////////////////
//#array
    // PV array


    x = loc.array.x;
    y = loc.array.y;

    circ([x,y], 5, 'base'); // MARKER

    x -= size.module.frame.h*3;
    y -= size.string.h/2;

    for( var i=0; i<system.DC.string_num; i++ ) {
        var offset = i * size.wire_offset.base;
        
        block('string', [x,y]);
        // positive home run
        layer('DC_pos');
        line([
            [ x , loc.array.upper ],
            [ x , loc.array.upper-size.module.w-offset ],
            [ loc.array.right+offset , loc.array.upper-size.module.w-offset ],
            [ loc.array.right+offset , loc.array.y-size.module.w-offset],
            [ loc.array.x , loc.array.y-size.module.w-offset],
        ]);

        // negative home run
        layer('DC_neg');
        line([
            [ x , loc.array.lower ],
            [ x , loc.array.lower+size.module.w+offset ],
            [ loc.array.right+offset , loc.array.lower+size.module.w+offset ],
            [ loc.array.right+offset , loc.array.y+size.module.w+offset],
            [ loc.array.x , loc.array.y+size.module.w+offset],
        ]);

        x -= size.string.w;
    }

    layer('DC_ground');
    line([
        [ loc.array.left , loc.array.lower + size.module.w + size.wire_offset.ground ],
        [ loc.array.right+size.wire_offset.ground , loc.array.lower + size.module.w + size.wire_offset.ground ],
        [ loc.array.right+size.wire_offset.ground , loc.array.y + size.module.w + size.wire_offset.ground],
        [ loc.array.x , loc.array.y+size.module.w+size.wire_offset.ground],
    ]);

    layer();


///////////////////////////////
// combiner box
    x = loc.array.x;
    y = loc.array.y;

    var fuse_width = size.wire_offset.gap;
    var to_disconnect_x = 150;
    var to_disconnect_y = -100;

    
    rect(
        [x+size.jb_box.w/2,y-size.jb_box.h/10],
        [size.jb_box.w,size.jb_box.h],
        'box'
    );


    for( var i in _.range(system.DC.string_num)) {
        var offset = size.wire_offset.gap + ( i * size.wire_offset.base );

        layer('DC_pos');
        line([
            [ x , y-offset],
            [ x+(size.jb_box.w-fuse_width)/2 , y-offset],
        ]);
        line([
            [ x+(size.jb_box.w+fuse_width)/2 , y-offset],
            [ x+size.jb_box.w+to_disconnect_x-offset , y-offset],
            [ x+size.jb_box.w+to_disconnect_x-offset , y+to_disconnect_y-size.terminal_diam],
            [ x+size.jb_box.w+to_disconnect_x-offset , y+to_disconnect_y-size.terminal_diam-size.terminal_diam*3],
        ]);
        block( 'terminal', {
            x: x+size.jb_box.w+to_disconnect_x-offset,
            y: y+to_disconnect_y-size.terminal_diam
        });

        layer('DC_neg');
        line([
            [ x , y+offset],
            [ x+(size.jb_box.w-fuse_width)/2 , y+offset],
        ]);
        line([
            [ x+(size.jb_box.w+fuse_width)/2 , y+offset],
            [ x+size.jb_box.w+to_disconnect_x+offset , y+offset],
            [ x+size.jb_box.w+to_disconnect_x+offset , y+to_disconnect_y-size.terminal_diam],
            [ x+size.jb_box.w+to_disconnect_x+offset , y+to_disconnect_y-size.terminal_diam-size.terminal_diam*3],
        ]);
        block( 'terminal', {
            x: x+size.jb_box.w+to_disconnect_x+offset,
            y: y+to_disconnect_y-size.terminal_diam
        });
    }

    x += size.jb_box.w;

    x += to_disconnect_x;
    y += to_disconnect_y;

///////////////////////////////
    // DC disconect combiner lines
    if( system.DC.string_num > 1){
        var offset_min = size.wire_offset.gap;
        var offset_max = size.wire_offset.gap + ( (system.DC.string_num-1) * size.wire_offset.base );
        line([
            [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
            [ x-offset_max , y-size.terminal_diam-size.terminal_diam*3],
        ], 'DC_pos');
        line([
            [ x+offset_min, y-size.terminal_diam-size.terminal_diam*3],
            [ x+offset_max, y-size.terminal_diam-size.terminal_diam*3],
        ], 'DC_neg');
    }
    
    // Inverter conection
    line([
        [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
        [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
    ],'DC_pos')



    // DC disconect
    rect(
        [x, y-size.discbox.h/2],
        [size.discbox.w,size.discbox.h],
        'box'
    );

///////////////////////////////
//#inverter
    x = loc.inverter.x;
    y = loc.inverter.y;


    //frame
    layer('box');
    rect(
        [x,y],
        [size.inverter.w, size.inverter.h]
    );
    // Label at top (Inverter, make, model, ...)
    layer('text');
    text(
        [loc.inverter.x, loc.inverter.top + size.inverter.text_gap ],
        [ 'Inverter', components.inverters[settings.inverter].make + " " + components.inverters[settings.inverter].model ],
        'label'
    );
    layer();

//#inverter symbol

    x = loc.inverter.x;
    y = loc.inverter.y;
    
    var w = size.inverter.symbol_w;
    var h = size.inverter.symbol_h;

    var space = w*1/12;

    // Inverter symbol
    layer('box');

    // box
    rect(
        [x,y],
        [w, h]
    );
    // diaganal
    line([
        [x-w/2, y+h/2],
        [x+w/2, y-h/2],
    
    ]);
    // DC
    line([
        [x - w/2 + space, 
            y - h/2 + space],
        [x - w/2 + space*6, 
            y - h/2 + space],
    ]);
    line([
        [x - w/2 + space, 
            y - h/2 + space*2],
        [x - w/2 + space*2, 
            y - h/2 + space*2],
    ]);
    line([
        [x - w/2 + space*3, 
            y - h/2 + space*2],
        [x - w/2 + space*4, 
            y - h/2 + space*2],
    ]);
    line([
        [x - w/2 + space*5, 
            y - h/2 + space*2],
        [x - w/2 + space*6, 
            y - h/2 + space*2],
    ]);

    // AC
    line([
        [x + w/2 - space, 
            y + h/2 - space*1.5],
        [x + w/2 - space*2, 
            y + h/2 - space*1.5],
    ]);
    line([
        [x + w/2 - space*3, 
            y + h/2 - space*1.5],
        [x + w/2 - space*4, 
            y + h/2 - space*1.5],
    ]);
    line([
        [x + w/2 - space*5, 
            y + h/2 - space*1.5],
        [x + w/2 - space*6, 
            y + h/2 - space*1.5],
    ]);
    layer();
        





//#AC_discconect
    x = loc.AC_disc.x;
    y = loc.AC_disc.y;
    padding = size.terminal_diam;

    layer('box');
    rect(
        [x, y],
        [size.AC_disc.w, size.AC_disc.h]
    );
    layer();


//log('size:', [h,w])
//log('location:', [x,y])
//circ([x,y],5);



//#AC load center
    var bottom = loc.AC_loadcenter.wire_bundle_bottom;    
    var breaker_spacing = loc.AC_loadcenter.breakers.spacing;

    x = loc.AC_loadcenter.x;
    y = loc.AC_loadcenter.y;
    w = size.AC_loadcenter.w;
    h = size.AC_loadcenter.h;

    rect([x,y],
        [w,h],
        'box'
    );

    text([x,y-h*0.4],
        [system.AC_loadcenter_type, 'Load Center'],
        'label',
        'text'
    )
    w = size.AC_loadcenter.breaker.w;
    h = size.AC_loadcenter.breaker.h;

    y -= size.AC_loadcenter.h/4;

    padding = loc.AC_loadcenter.x - loc.AC_loadcenter.breakers.left - size.AC_loadcenter.breaker.w;

    for( var i=0; i<30; i++){
        
        rect([x-padding-w/2,y],[w,h],'box');
        rect([x+padding+w/2,y],[w,h],'box');
    
        y += breaker_spacing;
    }

    var s, l;
    
    l = loc.AC_loadcenter.neutralbar;
    s = size.AC_loadcenter.neutralbar;
    rect([l.x,l.y], [s.w,s.h], 'AC_neutral' )

    l = loc.AC_loadcenter.groundbar;
    s = size.AC_loadcenter.groundbar;
    rect([l.x,l.y], [s.w,s.h], 'AC_ground' )

    



// AC lines

    x = loc.inverter.bottom_right.x;
    y = loc.inverter.bottom_right.y;
    x -= size.terminal_diam * (system.AC_conductors.length+3);
    y -= size.terminal_diam;

    //var AC_layer_names = ['AC_ground', 'AC_neutral', 'AC_L1', 'AC_L2', 'AC_L2'];

    //log(system.AC_conductors.length)

    for( var i=0; i < system.AC_conductors.length; i++ ){
        block('terminal', [x,y] );
        layer('AC_'+system.AC_conductors[i]);
        line([
            [x, y],
            [x, loc.AC_disc.bottom - size.terminal_diam * (i+1) ],
            [loc.AC_disc.left, loc.AC_disc.bottom - size.terminal_diam * (i+1) ],
        ]);
        x += size.terminal_diam;
    }
    layer();

    x = loc.AC_disc.x;
    y = loc.AC_disc.y;
    padding = size.terminal_diam;

    x -= size.AC_disc.w/2
    y += size.AC_disc.h/2

    y -= padding;

    if( system.AC_conductors.indexOf('ground')+1 ) {
        layer('AC_ground');
        line([
            [x,y],
            [ x+size.AC_disc.w+padding*3, y ],
            [ x+size.AC_disc.w+padding*3, bottom ],
            [ loc.AC_loadcenter.left+padding*2, bottom ],
            [ loc.AC_loadcenter.left+padding*2, y ],
            [ loc.AC_loadcenter.groundbar.x-padding, y ],
            [ loc.AC_loadcenter.groundbar.x-padding, loc.AC_loadcenter.groundbar.y+size.AC_loadcenter.groundbar.h/2 ],
        ])
    }

    if( system.AC_conductors.indexOf('neutral')+1 ) {
        y -= padding;
        layer('AC_neutral');
        line([
            [x,y],
            [ x+size.AC_disc.w-padding*1, y ],
            [ x+size.AC_disc.w-padding*1, bottom-breaker_spacing*1 ],
            [ loc.AC_loadcenter.neutralbar.x, bottom-breaker_spacing*1 ],
            [ loc.AC_loadcenter.neutralbar.x, 
                loc.AC_loadcenter.neutralbar.y-size.AC_loadcenter.neutralbar.h/2 ],
        ])
    }
        
     
    for( var i=1; i <= 3; i++ ) {
        if( system.AC_conductors.indexOf('L'+i)+1 ) {
            y -= padding;
            layer('AC_L'+i);
            line([
                [x,y],
                [ x+padding*(15-i*3), y ],
                [ x+padding*(15-i*3), loc.AC_disc.switch_bottom ],
            ]);
            block('terminal', [ x+padding*(15-i*3), loc.AC_disc.switch_bottom ] )
            block('terminal', [ x+padding*(15-i*3), loc.AC_disc.switch_top ] )
            line([
                [ x+padding*(15-i*3), loc.AC_disc.switch_top ],
                [ x+padding*(15-i*3), bottom-breaker_spacing*(i+2) ],
                [ loc.AC_loadcenter.breakers.left, bottom-breaker_spacing*(i+2) ],
            ]);

        }

    }

    x = loc.wire_table.x;
    y = loc.wire_table.y;
    w = size.wire_table.w;
    h = size.wire_table.h;
    var row_h = size.wire_table.row_h;
    var top = loc.wire_table.top;
    var bottom = loc.wire_table.bottom;
    var column_width = {
        number: 25,
        wire_gauge: 25,
        wire_type: 50,
        conduit_gauge: 25,
        conduit_type: 50,
    }

    layer('table')
    rect( [x,y], [w,h] );

    line([
        [x-w/2+25 , y-h/2+(1*row_h)],
        [x+w/2 , y-h/2+(1*row_h)],
    ])

    for( var r=2; r<system.wire_config_num+3; r++ ) {
    
        line([
            [x-w/2 , y-h/2+(r*row_h)],
            [x+w/2 , y-h/2+(r*row_h)],
        ])
    }
    x = loc.wire_table.x - w/2;
    y = loc.wire_table.y - h/2;
    x += column_width.number;

    var c_w = column_width.wire_gauge;
    line([ [x,top], [x,bottom-row_h] ]);
    text( [x+c_w,y+row_h*0.75], 'Wire', 'table', 'text');
    text( [x+c_w/2,y+row_h*1.75], 'AWG', 'table', 'text');
    x += c_w;

    c_w = column_width.wire_type;
    line([ [x,top+row_h], [x,bottom-row_h] ]);
    text( [x+c_w/2,y+row_h*1.75], 'Type', 'table', 'text');
    x += c_w;

    c_w = column_width.conduit_gauge;
    line([ [x,top], [x,bottom-row_h] ]);
    text( [x+c_w,y+row_h*0.75], 'Conduit', 'table', 'text');
    text( [x+c_w/2,y+row_h*1.75], 'Size', 'table', 'text');
    x += c_w;

    line([ [x,top+row_h], [x,bottom-row_h] ]);
    text( [x+c_w/2,y+row_h*1.75], 'Type', 'table', 'text');

    x = loc.wire_table.x - w/2;
    y = loc.wire_table.y - h/2;

    x += column_width.number/2;
    y += row_h*2 + row_h*0.75;

    for( var r=1; r<=system.wire_config_num; r++ ) {
        text( [x,y], String(r), 'table', 'text');



        y += row_h;
    }

}


















///////////////////
// Display

//#svg
var display_svg = function(){
    //log('displaying svg');
    var container = document.getElementById(svg_container_id);
    container.innerHTML = '';
    //container.empty()

    //var svg_elem = document.getElementById('SvgjsSvg1000')
    var svg_elem = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svg_elem.setAttribute('id','svg_drawing');
    svg_elem.setAttribute('width', size.drawing.w);
    svg_elem.setAttribute('height', size.drawing.h);
    container.appendChild(svg_elem);
    var svg = SVG(svg_elem).size(size.drawing.w, size.drawing.h);

    // Loop through all the drawing contents, call the function below.
    elements.forEach( function(elem,id) {
        show_elem_array(elem);
    })

    function show_elem_array(elem, offset){
        offset = offset || {x:0,y:0};
        if( typeof elem.x !== 'undefined' ) { var x = elem.x + offset.x; } 
        if( typeof elem.y !== 'undefined' ) { var y = elem.y + offset.y; } 

        if( elem.type === 'rect') {
            svg.rect( elem.w, elem.h ).move( x-elem.w/2, y-elem.h/2 ).attr( l_attr[elem.layer_name] );
        } else if( elem.type === 'line') {
            var points2 = [];
            elem.points.forEach( function(point){
                points2.push([ point[0]+offset.x, point[1]+offset.y ])
            })  
            svg.polyline( points2 ).attr( l_attr[elem.layer_name] );
        } else if( elem.type === 'text') {
            //var t = svg.text( elem.strings ).move( elem.points[0][0], elem.points[0][1] ).attr( l_attr[elem.layer_name] )
            var font = fonts[elem.font];
            
            var t = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            t.setAttribute('x', x);
            //t.setAttribute('y', y + font['font-size']/2 );
            t.setAttribute('y', y );
            if(elem.rotated){
                //t.setAttribute('transform', "rotate(" + elem.rotated + " " + x + " " + y + ")" );
                t.setAttribute('transform', "rotate(" + elem.rotated + " " + x + " " + y + ")" );
            }
            for( var i2 in l_attr[elem.layer_name] ){
                t.setAttribute( i2, l_attr[elem.layer_name][i2] );
            }
            for( var i2 in font ){
                t.setAttribute( i2, font[i2] );
            }
            for( var i2 in elem.strings ){
                var tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
                tspan.setAttribute('dy', font['font-size']*1.5*i2 );
                tspan.setAttribute('x', x);
                tspan.innerHTML = elem.strings[i2];
                t.appendChild(tspan);
            }
            svg_elem.appendChild(t);
        } else if( elem.type === 'circ') {
            var c = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
            c.setAttribute('rx', elem.d/2);
            c.setAttribute('ry', elem.d/2);
            c.setAttribute('cx', x);
            c.setAttribute('cy', y);
            var attr = l_attr[elem.layer_name];
            for( var i2 in attr ){
                c.setAttribute(i2, attr[i2]);
            }
            svg_elem.appendChild(c);
            /*
            c.attributes( l_attr[elem.layer_name] )
            c.attributes({
                rx: 5,
                --------------------------
                ry: 5,
                cx: elem.points[0][0]-elem.d/2,
                cy: elem.points[0][1]-elem.d/2
            })
            var c2 = svg.ellipse( elem.r, elem.r )
            c2.move( elem.points[0][0]-elem.d/2, elem.points[0][1]-elem.d/2 )
            c2.attr({rx:5, ry:5})
            c2.attr( l_attr[elem.layer_name] )
            */
        } else if(elem.type === 'block') {
            // if it is a block, run this function through each element.
            elem.elements.forEach( function(block_elem,id){
                show_elem_array(block_elem, {x:x, y:y}) 
            })
        }
    }
}


//////////////////////////////////////////
// after page loads functions


var update_settings_registry = function() {
}


//#update drawing
var update = function(){
    log('updating');

    // Make sure selectors and value displays are updated
    settings_registry.forEach(function(item){
        item.update(); 
    })

    // delete all elements of drawing 
    clear_drawing();

    // Recalculate system specs
    update_system();
    
    // Recalculate drawing related variables
    update_values();

    // Generate new drawing elements
    mk_drawing();

    // Add drawing elements to SVG on screen
    display_svg();

};



var svg_container_id = 'svg_container';
var system_container_id = 'system_container';



window.onload = function() {
    var title = 'PV drawing test';
    var sections = {
        'drawing_page':'Drawing',
        'test':'test',
        'text_dump':'text_dump'
    };

    k.setup_body(title, sections);
    var draw_page = $('div').attr('id', 'drawing_page');
    document.body.appendChild(draw_page.elem);

    var system_container = $('div').attr('id', system_container_id).appendTo(draw_page);
    
    var svg_container_object = $('div').attr('id', svg_container_id).appendTo(draw_page);
    var svg_container = svg_container_object.elem

//System options
    $('span').html('Module make: ').appendTo(system_container);
    $('selector').set_options( 'obj_id_array(components.modules)' ).set_setting('pv_make').appendTo(system_container);
    
    $('br').appendTo(system_container);
    $('span').html('Module model: ').appendTo(system_container);
    $('selector').set_options( 'obj_id_array(components.modules[settings.make])' ).set_setting('pv_model').appendTo(system_container);

/*
    $('span').html(' | ').appendTo(system_container);
    $('span').html('Pmax: ').appendTo(system_container);
    $('value').setRef('system.DC.module.specs.Pmax').appendTo(system_container);

    $('span').html(' | ').appendTo(system_container);
    $('span').html('Isc: ').appendTo(system_container);
    $('value').setRef('system.DC.module.specs.Isc').appendTo(system_container);

    $('span').html(' | ').appendTo(system_container);
    $('span').html('Voc: ').appendTo(system_container);
    $('value').setRef('system.DC.module.specs.Voc').appendTo(system_container);

    $('span').html(' | ').appendTo(system_container);
    $('span').html('Imp: ').appendTo(system_container);
    $('value').setRef('system.DC.module.specs.Imp').appendTo(system_container);
    
    $('span').html(' | ').appendTo(system_container);
    $('span').html('Vmp: ').appendTo(system_container);
    $('value').setRef('system.DC.module.specs.Vmp').appendTo(system_container);

    $('br').appendTo(system_container);


    //var draw_page = document.getElementById('drawing_page') 
    var t = document.createElement('span');
    t.innerHTML = 'Number of strings: ';
    system_container.appendChild(t);



    var num_strings = Selector('string_num', [1,2,3,4,5,6], 4);
    system_container.appendChild(num_strings.elem)
    
    $('span').html(' | ').appendTo(system_container);

    var t = document.createElement('span');
    t.innerHTML = 'Number of modules per string: ';
    system_container.appendChild(t);

    var num_modules = Selector('string_modules', [1,2,3,4,5,6,7,8,9,10,11,12], 4);
    system_container.appendChild(num_modules.elem);
    //document.getElementById('drawing_page').appendChild('<a href="#" onclick="clear(\'svg_container\')">clear</a>')

    // Start PV system drawing process

    $('br').appendTo(system_container);
    
    $('span').html('Array voltage: ').appendTo(system_container);
    $('value').setRef('system.DC.voltage').appendTo(system_container);

    $('span').html(' | ').appendTo(system_container);

    $('span').html('Array current: ').appendTo(system_container);
    $('value').setRef('system.DC.current').appendTo(system_container);

    $('br').appendTo(system_container);

    var t = document.createElement('span');
    t.innerHTML = 'AC type:';
    system_container.appendChild(t);

    var AC_type = Selector('AC_type', 
                          ['120V', '240V', '208V', '277V', '480V Wye', '480V Delta'], '480V Delta');
    system_container.appendChild(AC_type.elem);


    system_container.appendChild(document.createElement('br'));

   */

    //update();

    var boot_time = moment();
    var status_id = "status";
    setInterval(function(){ k.update_status_page(status_id, boot_time);},1000);




    log(window);


}
