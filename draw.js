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



var Value = {
    value:42, 
    expanded: false,
    click: function(){
        log('click', this.expanded) ;
        this.expanded = !this.expanded;
        if(this.expanded){
            this.elem.innerHTML = "Forty Two";
        } else {
            this.elem.innerHTML = this.value;
        }
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

var val = function(){
    var v = Object.create(Value);
    v.elem = document.createElement('span');
    //v.elem.href = '#'
    v.elem.innerHTML = v.value;
    v.elem.addEventListener('click', function(){
        v.click();
    }, false);
    v.options = [];
    v.menu = document.createElement('span');
    return v;
};





///////////////
//#system parameters

var components = {};
components.inverters = {};
components.inverters['SMA3000'] = {
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



var system = {};
system.DC = {};
system.DC.string_num = 4;
system.DC.string_module = 6;
system.DC.module = components.modules['Sunsucker250'];
system.inverter = components.inverters['SMA3000'];

system.AC_type = '208';


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
fonts.signs = {
    'font-family': 'monospace',
    'font-size':     5,
    'text-anchor':   'middle',
};
fonts.label = {
    'font-family': 'monospace',
    'font-size':     12,
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

var update_drawing_values = function(){

    // sizes

    size.module_frame = {};
    size.module_frame.w = 10;
    size.module_frame.h = 30;
    size.module_lead = size.module_frame.w*2/3;
    size.module_h = size.module_frame.h + size.module_lead*2;
    size.module_w = size.module_frame.w;

    size.wire_offset_base = 5;
    size.wire_offset_gap = size.module_w;
    size.wire_offset_max = system.DC.string_num * size.wire_offset_base;
    size.wire_offset_ground = size.wire_offset_max + size.wire_offset_base*2;

    size.string_gap = size.module_frame.w/42;
    size.string_gap_missing = size.string_gap + size.module_frame.w;
    size.string_h = (size.module_h * 4) + (size.string_gap * 2) + size.string_gap_missing;
    size.string_w = size.module_frame.w * 2.5;

    size.jb_box_h = 140 + size.wire_offset_base*2 * system.DC.string_num ;
    size.jb_box_w = 80;

    size.discBox_w = 80 + size.wire_offset_base*2 * system.DC.string_num ;
    size.discBox_h = 140;

    size.terminal_diam = 5;

    size.inverter_w = 200;
    size.inverter_h = 150;
    size.inverter_text_gap = 15;
    size.inverter_symbol_w = 50;
    size.inverter_symbol_h = 25;

    size.AC_disc_w = 100;
    size.AC_disc_h = 100;

    // location
    loc.array = { x:200, y:600 };

    loc.array_upper = loc.array.y - size.string_h/2;
    loc.array_lower = loc.array_upper + size.string_h;
    loc.array_right = loc.array.x - size.module_frame.h*2;
    loc.array_left = loc.array_right - ( size.string_w * system.DC.string_num ) - ( size.module_w * 1.25 ) ;

    loc.DC = loc.array;
    loc.inverter = { x:loc.array.x+300, y:loc.array.y-350 };
    loc.inverter.bottom = loc.inverter.y + size.inverter_h/2;
    loc.inverter.top = loc.inverter.y - size.inverter_h/2;
    loc.inverter.bottom_right = {
        x: loc.inverter.x + size.inverter_w/2,
        y: loc.inverter.y + size.inverter_h/2,
    };
    loc.AC_disc = { x: loc.array.x+550, y: loc.array.y-100 };
    loc.AC_disc.bottom = loc.AC_disc.y + size.AC_disc_h/2;
    loc.AC_disc.left = loc.AC_disc.x - size.AC_disc_w/2;

}

log('size', size);
    
log('loc', loc);


///////////////
// build drawing

//#start drawing
var mk_drawing = function(){
    var x,y;
    log('making drawing');


// Define blocks
// module block
    var w = size.module_frame.w;
    var h = size.module_frame.h;

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
        [0, -size.module_lead]
    ]);
    layer('DC_neg');
    line([
        [0, h],
        [0, h+(size.module_lead)]
    ]);
    // pos sign
    layer('text');
    text(
        [size.module_lead/2, -size.module_lead/2],
        '+',
        'signs'
    );
    // neg sign
    text(
        [size.module_lead/2, h+size.module_lead/2],
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

    y += size.module_lead; 

    //TODO: add loop to jump over negative return wires 
    layer('DC_ground');
    line([
        [x-size.module_frame.w*3/4, y+size.module_frame.h/2],
        [x-size.module_frame.w*3/4, y+size.string_h + size.wire_offset_ground + size.module_lead*0.5 ],
    ]);
    layer();

    block('module', [x,y]);
    y += size.module_frame.h + size.module_lead*2 + size.string_gap_missing;
    block('module', [x,y]);
    y += size.module_frame.h + size.module_lead*2 + size.string_gap;
    block('module', [x,y]);
    y += size.module_frame.h + size.module_lead*2 + size.string_gap;
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

//#array
    // PV array


    x = loc.array.x;
    y = loc.array.y;

    circ([x,y], 5, 'base'); // MARKER

    x -= size.module_frame.h*3;
    y -= size.string_h/2;

    //for( var i in _.range(system.DC.string_num)) {
    for( var i=0; i<system.DC.string_num; i++ ) {
        var offset = i * size.wire_offset_base;
        
        block('string', [x,y]);
        // positive home run
        layer('DC_pos');
        line([
            [ x , loc.array_upper ],
            [ x , loc.array_upper-size.module_w-offset ],
            [ loc.array_right+offset , loc.array_upper-size.module_w-offset ],
            [ loc.array_right+offset , loc.array.y-size.module_w-offset],
            [ loc.array.x , loc.array.y-size.module_w-offset],
        ]);

        // negative home run
        layer('DC_neg');
        line([
            [ x , loc.array_lower ],
            [ x , loc.array_lower+size.module_w+offset ],
            [ loc.array_right+offset , loc.array_lower+size.module_w+offset ],
            [ loc.array_right+offset , loc.array.y+size.module_w+offset],
            [ loc.array.x , loc.array.y+size.module_w+offset],
        ]);

        x -= size.string_w;
    }

    layer('DC_ground');
    line([
        [ loc.array_left , loc.array_lower + size.module_w + size.wire_offset_ground ],
        [ loc.array_right+size.wire_offset_ground , loc.array_lower + size.module_w + size.wire_offset_ground ],
        [ loc.array_right+size.wire_offset_ground , loc.array.y + size.module_w + size.wire_offset_ground],
        [ loc.array.x , loc.array.y+size.module_w+size.wire_offset_ground],
    ]);

    layer();


//#DC
    x = loc.array.x;
    y = loc.array.y;

    var fuse_width = size.wire_offset_gap;
    var to_disconnect_x = 150;
    var to_disconnect_y = -100;

    // combiner box
    
    rect(
        [x+size.jb_box_w/2,y-size.jb_box_h/10],
        [size.jb_box_w,size.jb_box_h],
        'box'
    );


    for( var i in _.range(system.DC.string_num)) {
        var offset = size.wire_offset_gap + ( i * size.wire_offset_base );

        layer('DC_pos');
        line([
            [ x , y-offset],
            [ x+(size.jb_box_w-fuse_width)/2 , y-offset],
        ]);
        line([
            [ x+(size.jb_box_w+fuse_width)/2 , y-offset],
            [ x+size.jb_box_w+to_disconnect_x-offset , y-offset],
            [ x+size.jb_box_w+to_disconnect_x-offset , y+to_disconnect_y-size.terminal_diam],
            [ x+size.jb_box_w+to_disconnect_x-offset , y+to_disconnect_y-size.terminal_diam-size.terminal_diam*3],
        ]);
        block( 'terminal', {
            x: x+size.jb_box_w+to_disconnect_x-offset,
            y: y+to_disconnect_y-size.terminal_diam
        });

        layer('DC_neg');
        line([
            [ x , y+offset],
            [ x+(size.jb_box_w-fuse_width)/2 , y+offset],
        ]);
        line([
            [ x+(size.jb_box_w+fuse_width)/2 , y+offset],
            [ x+size.jb_box_w+to_disconnect_x+offset , y+offset],
            [ x+size.jb_box_w+to_disconnect_x+offset , y+to_disconnect_y-size.terminal_diam],
            [ x+size.jb_box_w+to_disconnect_x+offset , y+to_disconnect_y-size.terminal_diam-size.terminal_diam*3],
        ]);
        block( 'terminal', {
            x: x+size.jb_box_w+to_disconnect_x+offset,
            y: y+to_disconnect_y-size.terminal_diam
        });
    }

    x += size.jb_box_w;

    x += to_disconnect_x;
    y += to_disconnect_y;

    // DC disconect combiner lines
    if( system.DC.string_num > 1){
        var offset_min = size.wire_offset_gap;
        var offset_max = size.wire_offset_gap + ( (system.DC.string_num-1) * size.wire_offset_base );
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
        [x, y-size.discBox_h/2],
        [size.discBox_w,size.discBox_h],
        'box'
    );


//#inverter
    x = loc.inverter.x;
    y = loc.inverter.y;


    //frame
    layer('box');
    rect(
        [x,y],
        [size.inverter_w, size.inverter_h]
    );
    // Label at top (Inverter, make, model, ...)
    layer('text');
    text(
        [loc.inverter.x, loc.inverter.top + size.inverter_text_gap ],
        [ 'Inverter', system.inverter.make + " " + system.inverter.model ],
        'label'
    );
    layer();

//#inverter symbol

    x = loc.inverter.x;
    y = loc.inverter.y;
    
    var w = size.inverter_symbol_w;
    var h = size.inverter_symbol_h;

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

    layer('box');
    rect(
        [x, y],
        [size.AC_disc_w, size.AC_disc_h]
    );
    layer();

};









///////////////////
// Display

//#svg
var display_svg = function(container_id){
    log('displaying svg');
    var container = document.getElementById(container_id);
    container.innerHTML = '';
    //container.empty()

    //var svg_elem = document.getElementById('SvgjsSvg1000')
    var svg_elem = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svg_elem.setAttribute('id','svg_drawing');
    svg_elem.setAttribute('width', 1000);
    svg_elem.setAttribute('height', 1000);
    container.appendChild(svg_elem);
    var svg = SVG(svg_elem).size(1000,1000);

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
            t.setAttribute('y', y + font['font-size']/2 );
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
var update_drawing = function(){
    log('updating drawing');
    //('#string_select option:selected'))
    var svg_container_id = 'svg_container';
    if( document.getElementById(svg_container_id) === null ){
        var svg_container = document.createElement('div');
        svg_container.id = svg_container_id;
        document.getElementById('drawing_page').appendChild(svg_container);
    } else {
        var svg_container = document.getElementById(svg_container_id);
    }
    
    var select_string = document.getElementById('string_select');
    system.DC.string_num = Number( select_string[select_string.selectedIndex].value );
    log('DC string num', system.DC.string_num)

    clear_drawing();

    update_drawing_values();

    mk_drawing();

    display_svg('svg_container');

};

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

    */
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
        update_drawing();
    }, false);
    



    //var draw_page = document.getElementById('drawing_page') 



    var lnk = val();
    //draw_page.appendChild(lnk.elem)

    //document.getElementById('drawing_page').appendChild('<a href="#" onclick="clear(\'svg_container\')">clear</a>')

    // Start PV system drawing process
    update_drawing();






    var boot_time = moment();
    var status_id = "status";
    setInterval(function(){ k.update_status_page(status_id, boot_time);},1000);






};


