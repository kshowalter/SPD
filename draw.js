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

function get_JSON(URL, name) {
    $.getJSON( URL, function( json ) {
        build_comps(json);
    }).fail(function(jqxhr, textStatus, error) {
        console.log( "error", textStatus, error  );
    });
}

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
system.DC.string_num = 6;
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
log('wires', system.AC_conductors);



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

// LAYERS


var layers = {};
for( var l in l_attr) {
    layers[l] = [];
}

// BLOCKS

var Blk = {
    object: 'Blk',
};
Blk.move = function(x, y){
    for( var i in this.array ){
        this.array[i].move(x,y);
    }
    return this;
};
Blk.add = function(){
    if( typeof this.array == 'undefined'){ this.array = [];}
    for( var i in arguments){
        this.array.push(arguments[i]);
    }
    return this;
};

var blocks = {};
var block_active = null;
// Create default layer,block container and functions

var drawStat = {};
drawStat.layer = false;

var layer = function(name){ // set current layer
    if( typeof name === 'undefined' ){ // if no layer name given, reset to default 
        drawStat.layer = layers.base;
    } else if( ! (name in layers) ) {  // if layer name is not in list, warn and reset to default
        log("error, layer '"+name+"' does not exist, using base");
        name = 'base' ;
    } else { // finaly activate requested layer
        drawStat.layer = layers[name];
    }
};
layer(); // set current layer to base

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

var block_end = function() {
    var blk = blocks[block_active];
    block_active = false;
    return blk;
};



// clear drawing 
var clear_drawing = function() {
    blocks.length = 0;
    for( var l in l_attr) {
        layers[l] = [];
    }

};


//////
// build protoype element



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
    /*
    if( typeof layer_name !== 'undefined' && (layer_name in layers) ) {
        var layer_selected = layers[layer_name]
    } else {
        if( ! (layer_name in layers) ){ log("error, layer does not exist, using current");}
        var layer_selected =  drawStat.layer
    }
    */
    if( typeof layer_name !== 'undefined' ) { layer(layer_name); }

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
    elem.points = points;

    drawStat.layer.push(elem);
    
    if(block_active){ 
        log('adding to block '+block_active);
        blocks[block_active].add(elem);
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
    rec.h = size[1];
    return rec;
};

var circ = function(loc, diameter, layer){
    //log('circle', loc, diameter, layer)
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
        var x = arguments[1].x;
        var y = arguments[1].y;
    } else if( arguments.length === 3 ){ // if x,y is passed
        var x = arguments[1];
        var y = arguments[2];
    }

    // TODO: what if block does not exist? print list of blocks?
    var blk = Object.create(blocks[name]);
    blk.x = x;
    blk.y = y;

    layers.block.push(blk);
    if(block_active){ 
        blocks[block_active].add(blk);
    }
    return blk
};

/////////////////////////////////


log('layers', layers);
log('blocks', blocks);

var mk_SVG = function(){
    for( var layer_name in layers ){
        var attr = l_attr[layer_name];
    }

};




//////////////
//#drawing parameters

var size = {};

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

size.jb_box_h = 100;
size.jb_box_w = 50;

size.terminal_diam = 5;

size.inverter_w = 200;
size.inverter_h = 150;
size.inverter_text_gap = 15;
size.inverter_symbol_w = 50;
size.inverter_symbol_h = 25;

size.AC_disc_w = 100;
size.AC_disc_h = 100;

    
var loc = {};

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

log('loc', loc);


///////////////
// build drawing

//#start drawing
var mk_drawing = function(){
    log('making drawing');

    // PV array
    var coor = loc.array;

// Define blocks
// module block
    var lead = size.module_lead;
    w = size.module_frame.w;
    h = size.module_frame.h;

    block_start('module');
    // frame
    layer('module');
    rect( [0,h/2], [w,h]);
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
        [0, -lead]
    ]);
    layer('DC_neg');
    line([
        [0, h],
        [0, h+(lead)]
    ]);
    // pos sign
    layer('text');
    text(
        [lead/2, -lead/2],
        '+',
        'signs'
    );
    // neg sign
    text(
        [lead/2, h+lead/2],
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
    var coor_string = {};
    coor_string.x = 0;
    coor_string.y = 0;

    //TODO: add loop to jump over negative return wires 
    block_start('string');
    x = 0;
    y = 0;

    layer('DC_ground');
    line([
        [coor_string.x-size.module_frame.w*3/4, coor_string.y+size.module_frame.h/2+size.module_lead],
        [coor_string.x-size.module_frame.w*3/4, loc.array_lower + size.wire_offset_ground + size.module_lead*1.5 ],
    ]);

    block('module', coor_string);
    coor_string.y += size.module_frame.h + size.module_lead*2 + size.string_gap_missing;
    block('module', coor_string);
    coor_string.y += size.module_frame.h + size.module_lead*2 + size.string_gap;
    block('module', coor_string);
    coor_string.y += size.module_frame.h + size.module_lead*2 + size.string_gap;
    block('module', coor_string);

    layer();
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
    var coor = loc.array;
    var blk = Object.create(Blk);
    blk.type = 'array';


    var coor_array = { x:coor.x, y:coor.y };
    coor.x -= size.module_frame.h*3;
    coor.y -= size.string_h/2;


    for( var i in _.range(system.DC.string_num)) {
        var offset = i * size.wire_offset_base;

        block('string', coor);
        // positive home run
        layer('DC_pos');
        line([
            [ coor.x , loc.array_upper ],
            [ coor.x , loc.array_upper-size.module_w-offset ],
            [ loc.array_right+offset , loc.array_upper-size.module_w-offset ],
            [ loc.array_right+offset , loc.array.y-size.module_w-offset],
            [ coor_array.x , loc.array.y-size.module_w-offset],
        ]);

        // negative home run
        layer('DC_neg');
        line([
            [ coor.x , loc.array_lower ],
            [ coor.x , loc.array_lower+size.module_w+offset ],
            [ loc.array_right+offset , loc.array_lower+size.module_w+offset ],
            [ loc.array_right+offset , loc.array.y+size.module_w+offset],
            [ coor_array.x , loc.array.y+size.module_w+offset],
        ]);

        coor.x -= size.string_w;
    }

    layer('DC_ground');
    line([
        [ loc.array_left , loc.array_lower + size.module_w + size.wire_offset_ground ],
        [ loc.array_right+size.wire_offset_ground , loc.array_lower + size.module_w + size.wire_offset_ground ],
        [ loc.array_right+size.wire_offset_ground , loc.array.y + size.module_w + size.wire_offset_ground],
        [ coor_array.x , loc.array.y+size.module_w+size.wire_offset_ground],
    ]);

    layer();


//#DC
    var coor = loc.DC;
    var blk = Object.create(Blk);
    blk.type = 'DV Junction Box';

    var x = coor.x;
    var y = coor.y;
    var jBox_w = 80;
    var jBox_h = 140 + size.wire_offset_base*2 * system.DC.string_num ;

    var fuse_width = size.wire_offset_gap;
    var to_disconnect_x = 150;
    var to_disconnect_y = -100;

    var discBox_w = 80 + size.wire_offset_base*2 * system.DC.string_num ;
    var discBox_h = 140;

    // combiner box
    
    blk.add(rect(
        [x+jBox_w/2,y-jBox_h/10],
        [jBox_w,jBox_h],
        'box'
    ));


    for( var i in _.range(system.DC.string_num)) {
        var offset = size.wire_offset_gap + ( i * size.wire_offset_base );

        layer('DC_pos');
        line([
            [ x , y-offset],
            [ x+(jBox_w-fuse_width)/2 , y-offset],
        ]);
        line([
            [ x+(jBox_w+fuse_width)/2 , y-offset],
            [ x+jBox_w+to_disconnect_x-offset , y-offset],
            [ x+jBox_w+to_disconnect_x-offset , y+to_disconnect_y-size.terminal_diam],
            [ x+jBox_w+to_disconnect_x-offset , y+to_disconnect_y-size.terminal_diam-size.terminal_diam*3],
        ]);
        block( 'terminal', {
            x: x+jBox_w+to_disconnect_x-offset,
            y: y+to_disconnect_y-size.terminal_diam
        });

        layer('DC_neg');
        line([
            [ x , y+offset],
            [ x+(jBox_w-fuse_width)/2 , y+offset],
        ]);
        line([
            [ x+(jBox_w+fuse_width)/2 , y+offset],
            [ x+jBox_w+to_disconnect_x+offset , y+offset],
            [ x+jBox_w+to_disconnect_x+offset , y+to_disconnect_y-size.terminal_diam],
            [ x+jBox_w+to_disconnect_x+offset , y+to_disconnect_y-size.terminal_diam-size.terminal_diam*3],
        ]);
        block( 'terminal', {
            x: x+jBox_w+to_disconnect_x+offset,
            y: y+to_disconnect_y-size.terminal_diam
        });
    }

    x += jBox_w;

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
    blk.add(
        line([
            [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
            [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
        ],'DC_pos')
    );



    // DC disconect
    blk.add(rect(
        [x, y-discBox_h/2],
        [discBox_w,discBox_h],
        'box'
    ));


//#inverter
    log('making inverter');
    coor = loc.inverter;


    //frame
    layer('box');
    rect(
        [coor.x,coor.y],
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
    log('making inverter symbol');

    var coor = { x:coor.x, y:coor.y };
    
    var w = size.inverter_symbol_w;
    var h = size.inverter_symbol_h;

    var space = w*1/12;

    // Inverter symbol
    layer('box');

    // box
    rect(
        [coor.x,coor.y],
        [w, h]
    );
    // diaganal
    line([
        [coor.x-w/2, coor.y+h/2],
        [coor.x+w/2, coor.y-h/2],
    
    ]);
    // DC
    line([
        [coor.x - w/2 + space, 
            coor.y - h/2 + space],
        [coor.x - w/2 + space*6, 
            coor.y - h/2 + space],
    ]);
    line([
        [coor.x - w/2 + space, 
            coor.y - h/2 + space*2],
        [coor.x - w/2 + space*2, 
            coor.y - h/2 + space*2],
    ]);
    line([
        [coor.x - w/2 + space*3, 
            coor.y - h/2 + space*2],
        [coor.x - w/2 + space*4, 
            coor.y - h/2 + space*2],
    ]);
    line([
        [coor.x - w/2 + space*5, 
            coor.y - h/2 + space*2],
        [coor.x - w/2 + space*6, 
            coor.y - h/2 + space*2],
    ]);

    // AC
    line([
        [coor.x + w/2 - space, 
            coor.y + h/2 - space*1.5],
        [coor.x + w/2 - space*2, 
            coor.y + h/2 - space*1.5],
    ]);
    line([
        [coor.x + w/2 - space*3, 
            coor.y + h/2 - space*1.5],
        [coor.x + w/2 - space*4, 
            coor.y + h/2 - space*1.5],
    ]);
    line([
        [coor.x + w/2 - space*5, 
            coor.y + h/2 - space*1.5],
        [coor.x + w/2 - space*6, 
            coor.y + h/2 - space*1.5],
    ]);
    layer();
        
    
    var point = loc.inverter.bottom_right;
    point.x -= size.terminal_diam * (system.AC_conductors+3);
    point.y -= size.terminal_diam;
    var AC_layer_names = ['AC_ground', 'AC_neutral', 'AC_L1', 'AC_L2', 'AC_L2'];
    for( var i=0; i < system.AC_conductors; i++ ){
        block('terminal', point );
        layer(AC_layer_names[i]);
        line([
            [point.x, point.y],
            [point.x, loc.AC_disc.bottom - size.terminal_diam * (i+1) ],
            [loc.AC_disc.left, loc.AC_disc.bottom - size.terminal_diam * (i+1) ],
        ]);
        point.x += size.terminal_diam;
    }
    layer();





//#AC_discconect
    log('making AC disconect');
    var coor = loc.AC_disc;

    layer('box');
    rect(
        [coor.x, coor.y],
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


    for( var layer_name in layers){
        var layer = layers[layer_name];
        for( var i in layer){
            var elem = layer[i];
            if( elem.type == 'rect') {
                svg.rect( elem.w, elem.h ).move( elem.points[0][0]-elem.w/2, elem.points[0][1]-elem.h/2 ).attr( l_attr[layer_name] );
            } else if( elem.type == 'line') {
                svg.polyline( elem.points ).attr( l_attr[layer_name] );
            } else if( elem.type == 'text') {
                //var t = svg.text( elem.strings ).move( elem.points[0][0], elem.points[0][1] ).attr( l_attr[layer_name] )
                var font = fonts[elem.font];
                
                var t = document.createElementNS("http://www.w3.org/2000/svg", 'text');
                t.setAttribute('x', elem.points[0][0]);
                t.setAttribute('y', elem.points[0][1] + font['font-size']/2 );
                for( var i2 in l_attr[layer_name] ){
                    t.setAttribute( i2, l_attr[layer_name][i2] );
                }
                for( var i2 in font ){
                    t.setAttribute( i2, font[i2] );
                }
                for( var i2 in elem.strings ){
                    var tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
                    tspan.setAttribute('dy', font['font-size']*1.5*i2 );
                    tspan.setAttribute('x', elem.points[0][0]);
                    tspan.innerHTML = elem.strings[i2];
                    t.appendChild(tspan);
                }
                svg_elem.appendChild(t);
            } else if( elem.type == 'circ') {
                var c = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
                c.setAttribute('rx', elem.d/2);
                c.setAttribute('ry', elem.d/2);
                c.setAttribute('cx', elem.points[0][0]);
                c.setAttribute('cy', elem.points[0][1]);
                var attr = l_attr[layer_name];
                for( var i2 in attr ){
                    c.setAttribute(i2, attr[i2]);
                }
                svg_elem.appendChild(c);
                /*
                c.attributes( l_attr[layer_name] )
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
                c2.attr( l_attr[layer_name] )
                */
            }
        }

    }

};

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

    clear_drawing();

    mk_drawing();
    display_svg('svg_container');

};

$(document).ready( function() {
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
    //var string_select = $('<select>').attr('id','string_select')
    var string_select = document.createElement('select');
    string_select.setAttribute('id', 'string_select');
    for( var i in _.range(10)) {
        if( i !== 0 ){
            var op = new Option();
            op.value = i;
            op.text = String(i) + ' string';
            if( i === 4) { op.selected = 'selected';}
            string_select.appendChild(op);
        }
    }
    draw_page.appendChild(string_select);
    document.getElementById('string_select').selectedIndex = 4-1;
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



});



$(window).ready( function() {
    var boot_time = moment();
    var status_id = "status";
    setInterval(function(){ k.update_status_page(status_id, boot_time);},1000);






});


