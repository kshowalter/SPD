'use strict';
// PV Systems drawing generator



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
};

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



var value_prototype = {
    change: function(new_value){
        if( typeof new_value !== 'undefined' ) { this.set_value(new_value); }
        this.expanded = !this.expanded;
        if(this.expanded){
            this.elem.innerHTML = "";
            this.elem.appendChild(this.elem_options);
        } else {
            this.elem.innerHTML = "";
            this.elem.appendChild(this.elem_value);
        }
    },
    update_options: function(){
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
    },
    set_value: function(new_value){
        this.value = new_value;
        eval(this.reference + " = " + new_value)
        this.elem.setAttribute('id','42');
        this.elem_value = document.createElement('a');
        this.elem_value.href = '#';
        this.elem_value.setAttribute('class', 'selector');
        this.elem_value.innerHTML = this.value;
        var that = this;
        this.elem_value.addEventListener('click', function(){
            that.change();
        }, false);
        this.elem.appendChild(this.elem_value);
        update();
    
    },


    add_option: function(input){
        if(typeof input == 'object'){
            for( var i in input ){
                var addition = input[i];
                this.options.push(addition);
            }
        } else {
            this.options.push(input);
        }
    },
    link_list: function(){
        for( var i in this.options ){
            var option = this.options[i];
            var a = document.createElement('a');
            a.addEventListener('click', function(){
                this.value = this.option[i];
            }, false);
            this.menu.appendChild(a);
        } 
    },

};

var Val = function(reference, options, start_value){
    var v = Object.create(value_prototype);
    v.options = options;
    v.expanded = false;
    v.reference = reference;
    v.elem = document.createElement('span');
    v.elem.setAttribute('class', 'selector_menu');

    v.update_options();

    start_value = start_value || v.options[0];
    v.set_value(start_value);
    
    return v;
};



///////////////
//#system parameters

var components = {};
components.inverters = {};
components.inverters['SI3000'] = {
    make:'SMA',
    model:'3000',

    DC_voltageWindow_low: 150,
    DC_voltageWindow_high: 350,
    
    AC_options: ['240','208'],

};

components.modules = {};
components.modules['Sunsucker250'] = {
    make:'Sunsucker',
    model:'250',
   
    Pmax: 245,
    Isc: 10,
    Voc: 60,
    Imp: 8,
    Vmp: 50,

};



var addInverter = function(){
        

};



var input = {};
input.string_num = 4;
input.string_modules = 6;
input.module = 'Sunsucker250';
input.inverter = 'SI3000';
input.AC_type = '208';

var system = {};
system.DC = {};
system.DC.string_num = input.string_num; 
system.DC.string_modules = input.string_modules;
system.DC.module = components.modules[input.module];
system.inverter = components.inverters[input.inverter];

system.AC_type = input.AC_type;


switch(system.AC_type){
    case '208':
        system.AC_conductors = 5;
        break;
    case '120':
        system.AC_conductors = 3;
        break;
    default:
        log('Error, unknown AC type');
}
log('system', system);

system.AC_loadcenter_type = '480/277V';

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
l_attr.AC_ground.stroke = '#006600';
l_attr.AC_neutral = Object.create(l_attr.base);
l_attr.AC_neutral.stroke = '#666666';

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
// build protoype element

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
        h: 800,
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

    //loc.AC_loadcenter.breakers = 

}

log('size', size);
    
log('loc', loc);


///////////////
// build drawing

//#start drawing
var mk_drawing = function(){
    log('making drawing');

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
        system.DC.module.make + " " + system.DC.module.model + 
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

    //for( var i in _.range(system.DC.string_num)) {
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
        [ 'Inverter', components.inverters[input.inverter].make + " " + components.inverters[input.inverter].model ],
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
        
    // AC terminals
    x = loc.inverter.bottom_right.x;
    y = loc.inverter.bottom_right.y;
    x -= size.terminal_diam * (system.AC_conductors+3);
    y -= size.terminal_diam;

    var AC_layer_names = ['AC_ground', 'AC_neutral', 'AC_L1', 'AC_L2', 'AC_L2'];

    for( var i=0; i < system.AC_conductors; i++ ){
        block('terminal', [x,y] );
        layer(AC_layer_names[i]);
        line([
            [x, y],
            [x, loc.AC_disc.bottom - size.terminal_diam * (i+1) ],
            [loc.AC_disc.left, loc.AC_disc.bottom - size.terminal_diam * (i+1) ],
        ]);
        x += size.terminal_diam;
    }
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

    x -= size.AC_disc.w/2
    y += size.AC_disc.h/2

    y -= padding;

//log('size:', [h,w])
//log('location:', [x,y])
//circ([x,y],5);

    var bottom = loc.AC_loadcenter.wire_bundle_bottom;    
    var breaker_spacing = loc.AC_loadcenter.breakers.spacing;

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
    
    for( var i=2; i < system.AC_conductors; i++ ){
        y -= padding;
        layer(AC_layer_names[i]);
        line([
            [x,y],
            [ x+padding*(15-i*3), y ],
            [ x+padding*(15-i*3), loc.AC_disc.switch_bottom ],
        ]);
        block('terminal', [ x+padding*(15-i*3), loc.AC_disc.switch_bottom ] )
        block('terminal', [ x+padding*(15-i*3), loc.AC_disc.switch_top ] )
        line([
            [ x+padding*(15-i*3), loc.AC_disc.switch_top ],
            [ x+padding*(15-i*3), bottom-breaker_spacing*i ],
            [ loc.AC_loadcenter.breakers.left, bottom-breaker_spacing*i ],
        ]);
    }


//#AC load center

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

};









///////////////////
// Display

//#svg
var display_svg = function(){
    log('displaying svg');
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

//#update drawing
var update = function(){
    log('updating drawing');

    clear_drawing();

    update_values();

    mk_drawing();

    display_svg();

};



var svg_container_id = 'svg_container';



window.onload = function() {
    var title = 'PV drawing test';
    var sections = {
        'drawing_page':'Drawing',
        'test':'test',
        'text_dump':'text_dump'
    };

    k.setup_body(title, sections);

    var draw_page = document.createElement('div');
    draw_page.id = 'drawing_page';
    document.body.appendChild(draw_page);

    /*
    var dump = document.getElementById('text_dump')
    dump.innerHTML = 'this is a test'

    var string_select = document.createElement('select');
    string_select.setAttribute('id', 'string_select');
    for( var i=1; i<=6; i++) {
        var op = document.createElement('option');
        op.setAttribute('value', i);
        op.innerHTML = String(i) + ' string';
        if( i === system.DC.string_num) { 
            op.setAttribute( 'selected', 'selected');
        }
        string_select.appendChild(op);
    }
    draw_page.appendChild(string_select);
    //document.getElementById('string_select').selectedIndex = 4-1;
    // When number of strings change, update model, display
    string_select.addEventListener('change', function(){
        update();
    }, false);
    
    */                                      
    
    
    var svg_container = document.createElement('div');
    svg_container.setAttribute('id', svg_container_id);
    draw_page.appendChild(svg_container);

    //var draw_page = document.getElementById('drawing_page') 

    var t = document.createElement('span');
    t.innerHTML = 'Number of strings';
    draw_page.appendChild(t);

    var num_strings = Val('system.DC.string_num', [1,2,3,4,5,6], 4);
    draw_page.appendChild(num_strings.elem)

    var t = document.createElement('span');
    t.innerHTML = '. Number of modules per string.';
    draw_page.appendChild(t);

    var num_modules = Val('system.DC.string_modules', [1,2,3,4,5,6,7,8,9,10,11,12], 4);
    draw_page.appendChild(num_modules.elem);
    //document.getElementById('drawing_page').appendChild('<a href="#" onclick="clear(\'svg_container\')">clear</a>')

    // Start PV system drawing process





    //update();

    var boot_time = moment();
    var status_id = "status";
    setInterval(function(){ k.update_status_page(status_id, boot_time);},1000);






};


