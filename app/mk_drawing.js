'use strict';
var log = console.log.bind(console);
var k = require('../lib/k/k.js');
var settings = require('./settings.js');
var l_attr = settings.drawing.l_attr;
var _ = require('underscore');
log('settings', settings);
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
        log('Error: unknown layer, using base');
        layer_active = 'base' ;
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
        elem.x = points[0].x;
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
        elements.push(blk);
        l_attr.AC_ground = Object.create(l_attr.base);
        l_attr.AC_ground.stroke = '#006600';

    }
    return blk;
};

/////////////////////////////////

var mk_drawing = function(settings){
    //var components = settings.components;
    //var sys_config = settings.sys_config;
    var system = settings.system;
    log('---settings---', settings);

    var size = settings.drawing.size;
    var loc = settings.drawing.loc;
    var l_attr = l_attr;

    clear_drawing();

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
    );
    layer();
    block_end();

// fuse

    block_start('fuse');
    x = 0;
    y = 0;
    w = 10;
    h = 5;

    layer('terminal');
    rect(
        [x,y],
        [w,h]
    );
    line( [
        [w/2,y],
        [w/2+size.fuse.w, y]
    ]);
    block('terminal', [size.fuse.w, y] );

    line( [
        [-w/2,y],
        [-w/2-size.fuse.w, y]
    ]);
    block('terminal', [-size.fuse.w, y] );

    layer();
    block_end();

// ground symbol
    block_start('ground');
    x = 0;
    y = 0;

    layer('AC_ground')
    line([
        [x,y],
        [x,y+40],
    ])
    y += 25;
    line([
        [x-7.5,y],
        [x+7.5,y],
    ])
    y += 5;
    line([
        [x-5,y],
        [x+5,y],
    ])
    y += 5;
    line([
        [x-2.5,y],
        [x+2.5,y],
    ])
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
    if( typeof system.DC.module.specs !== 'undefined' ){
        text([x,y], [
            system.DC.module.specs.Make + " " + system.DC.module.specs.Model + 
                " (" + system.DC.string_num  + " strings of " + system.DC.string_modules + " modules )"
        ], 'title2', 'text').rotate(-90);
    }
        
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
            [ x+(size.jb_box.w)/2 , y-offset],
        ]);
        block( 'terminal', {
            x: x+(size.jb_box.w)/2,
            y: y-offset,
        });
        line([
            [ x+(size.jb_box.w)/2 , y-offset],
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
            [ x, y+offset],
            [ x+size.jb_box.w/2-size.fuse.w/2 , y+offset],
        ]);
        block( 'fuse', {
            x: x+size.jb_box.w/2 ,
            y: y+offset,
        });
        line([
            [ x+size.jb_box.w/2+size.fuse.w/2 , y+offset],
            [ x+size.jb_box.w+to_disconnect_x+offset , y+offset],
            [ x+size.jb_box.w+to_disconnect_x+offset , y+to_disconnect_y-size.terminal_diam],
            [ x+size.jb_box.w+to_disconnect_x+offset , y+to_disconnect_y-size.terminal_diam-size.terminal_diam*3],
        ]);
        block( 'terminal', {
            x: x+size.jb_box.w+to_disconnect_x+offset,
            y: y+to_disconnect_y-size.terminal_diam
        });
        layer();
    }

    //layer('DC_ground');
    //line([
    //    [ loc.array.left , loc.array.lower + size.module.w + size.wire_offset.ground ],
    //    [ loc.array.right+size.wire_offset.ground , loc.array.lower + size.module.w + size.wire_offset.ground ],
    //    [ loc.array.right+size.wire_offset.ground , loc.array.y + size.module.w + size.wire_offset.ground],
    //    [ loc.array.x , loc.array.y+size.module.w+size.wire_offset.ground],
    //]);

    //layer();

    // Ground
    offset = size.wire_offset.gap + size.wire_offset.ground;

    layer('DC_ground');
    line([
        [ x , y+offset],
        [ x+(size.jb_box.w)/2 , y+offset],
    ]);
    block( 'terminal', {
        x: x+(size.jb_box.w)/2,
        y: y+offset,
    });
    line([
        [ x+(size.jb_box.w)/2 , y+offset],
        [ x+size.jb_box.w+to_disconnect_x+offset , y+offset],
        [ x+size.jb_box.w+to_disconnect_x+offset , y+to_disconnect_y-size.terminal_diam],
        [ x+size.jb_box.w+to_disconnect_x+offset , y+to_disconnect_y-size.terminal_diam-size.terminal_diam*3],
    ]);
    block( 'terminal', {
        x: x+size.jb_box.w+to_disconnect_x+offset,
        y: y+to_disconnect_y-size.terminal_diam
    });
    layer();


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
    ],'DC_pos');

    // neg
    line([
        [ x+offset_min, y-size.terminal_diam-size.terminal_diam*3],
        [ x+offset_min, loc.inverter.y+size.inverter.h/2-size.terminal_diam ],
    ],'DC_neg')
    block( 'terminal', {
        x: x+offset_min,
        y: loc.inverter.y+size.inverter.h/2-size.terminal_diam,
    });

    // pos
    line([
        [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
        [ x-offset_min, loc.inverter.y+size.inverter.h/2-size.terminal_diam ],
    ],'DC_pos')
    block( 'terminal', {
        x: x-offset_min,
        y: loc.inverter.y+size.inverter.h/2-size.terminal_diam,
    });

    // ground
    offset = size.wire_offset.gap + size.wire_offset.ground;
    line([
        [ x+offset, y-size.terminal_diam-size.terminal_diam*3],
        [ x+offset, loc.inverter.y+size.inverter.h/2-size.terminal_diam ],
    ],'DC_ground')
    block( 'terminal', {
        x: x+offset,
        y: loc.inverter.y+size.inverter.h/2-size.terminal_diam,
    });

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
        [ 'Inverter', settings.system.inverter.make + " " + settings.system.inverter.model ],
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
    );
    w = size.AC_loadcenter.breaker.w;
    h = size.AC_loadcenter.breaker.h;

    y -= size.AC_loadcenter.h/4 + size.AC_loadcenter.breaker.h;

    padding = loc.AC_loadcenter.x - loc.AC_loadcenter.breakers.left - size.AC_loadcenter.breaker.w;

    for( var i=0; i<20; i++){
        
        rect([x-padding-w/2,y],[w,h],'box');
        rect([x+padding+w/2,y],[w,h],'box');
    
        y += breaker_spacing;
    }

    var s, l;
    
    l = loc.AC_loadcenter.neutralbar;
    s = size.AC_loadcenter.neutralbar;
    rect([l.x,l.y], [s.w,s.h], 'AC_neutral' );

    l = loc.AC_loadcenter.groundbar;
    s = size.AC_loadcenter.groundbar;
    rect([l.x,l.y], [s.w,s.h], 'AC_ground' );

    block('ground', [l.x,l.y+s.h/2]);



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

    x -= size.AC_disc.w/2;
    y += size.AC_disc.h/2;

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
        ]);
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
        ]);
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
            block('terminal', [ x+padding*(15-i*3), loc.AC_disc.switch_bottom ] );
            block('terminal', [ x+padding*(15-i*3), loc.AC_disc.switch_top ] );
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
    };

    layer('table');
    rect( [x,y], [w,h] );

    line([
        [x-w/2+25 , y-h/2+(1*row_h)],
        [x+w/2 , y-h/2+(1*row_h)],
    ]);

    for( var r=2; r<system.wire_config_num+3; r++ ) {
    
        line([
            [x-w/2 , y-h/2+(r*row_h)],
            [x+w/2 , y-h/2+(r*row_h)],
        ]);
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



// voltage drop
    x = loc.volt_drop_table.x;
    y = loc.volt_drop_table.y;
    w = size.volt_drop_table.w;
    h = size.volt_drop_table.h;

    layer('table');
    rect( [x,y], [w,h] );
    
    y -= h/2;
    y += 10

    text( [x,y], 'Voltage Drop', 'table', 'text');


// general notes
    x = loc.general_notes.x;
    y = loc.general_notes.y;
    w = size.general_notes.w;
    h = size.general_notes.h;

    layer('table');
    rect( [x,y], [w,h] );
    
    y -= h/2;
    y += 10

    text( [x,y], 'General Notes', 'table', 'text');






    return elements;
};



module.exports = mk_drawing;
