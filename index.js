(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var log = console.log.bind(console);
//var settings = require('./settings.js');
//var snapsvg = require('snapsvg');
//log(settings);



var display_svg = function(settings, container){
    log('displaying svg');
    var l_attr = settings.drawing.l_attr;
    var fonts = settings.drawing.fonts;
    var elements = settings.elements;
    //log('elements: ', elements);
    container.innerHTML = '';
    //container.empty()

    //var svg_elem = document.getElementById('SvgjsSvg1000')
    var svg_elem = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svg_elem.setAttribute('id','svg_drawing');
    svg_elem.setAttribute('width', settings.drawing.size.drawing.w);
    svg_elem.setAttribute('height', settings.drawing.size.drawing.h);
    container.appendChild(svg_elem);
    //var svg = snapsvg(svg_elem).size(size.drawing.w, size.drawing.h);
    //var svg = snapsvg('#svg_drawing');

    // Loop through all the drawing contents, call the function below.
    elements.forEach( function(elem,id) {
        show_elem_array(elem);
    });

    function show_elem_array(elem, offset){
        offset = offset || {x:0,y:0};
        if( typeof elem.x !== 'undefined' ) { var x = elem.x + offset.x; } 
        if( typeof elem.y !== 'undefined' ) { var y = elem.y + offset.y; } 

        if( elem.type === 'rect') {
            //svg.rect( elem.w, elem.h ).move( x-elem.w/2, y-elem.h/2 ).attr( l_attr[elem.layer_name] );
            //log('elem:', elem );
            //if( isNaN(elem.w) ) {
            //    log('error: elem not fully defined', elem)
            //    elem.w = 10;
            //}
            //if( isNaN(elem.h) ) {
            //    log('error: elem not fully defined', elem)
            //    elem.h = 10;
            //}
            var r = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            r.setAttribute('width', elem.w);
            r.setAttribute('height', elem.h);
            r.setAttribute('x', x-elem.w/2);
            r.setAttribute('y', y-elem.h/2);
            var attr = l_attr[elem.layer_name];
            for( var i2 in attr ){
                r.setAttribute(i2, attr[i2]);
            }
            svg_elem.appendChild(r);
        } else if( elem.type === 'line') {
            var points2 = [];
            elem.points.forEach( function(point){
                if( ! isNaN(point[0]) && ! isNaN(point[1]) ){
                    points2.push([ point[0]+offset.x, point[1]+offset.y ]);
                } else {
                    log('error: elem not fully defined', elem)
                }
            });
            //svg.polyline( points2 ).attr( l_attr[elem.layer_name] );

            var l = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
            l.setAttribute( 'points', points2.join(' ') );
            var attr = l_attr[elem.layer_name];
            for( var i2 in attr ){
                l.setAttribute(i2, attr[i2]);
            }
            svg_elem.appendChild(l);
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
            });
        }
    }
};


module.exports = display_svg;


},{}],2:[function(require,module,exports){
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
l_attr.frame.stroke = '#000042';
l_attr.table = Object.create(l_attr.base);
l_attr.table.stroke = '#000042';

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


module.exports = l_attr;

},{}],3:[function(require,module,exports){
'use strict';
var log = console.log.bind(console);
var k = require('../lib/k/k.js');
//var settings = require('./settings.js');
//var l_attr = settings.drawing.l_attr;
var _ = require('underscore');
//log('settings', settings);
// setup drawing containers
var l_attr = require('./layers');

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
    //*/
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
    settings.drawing.l_attr = l_attr;
    //var components = settings.components;
    //var system = settings.system;
    var system = settings.system;
    //log('---settings---', settings);

    var size = settings.drawing.size;
    var loc = settings.drawing.loc;


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
    //line([
    //    [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
    //    [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
    //],'DC_pos');

    offset = offset_max - offset_min + size.terminal_diam/2;
    //offset = offset_max - offset_min;

    // neg
    line([
        [ x+offset, y-size.terminal_diam-size.terminal_diam*3],
        [ x+offset, loc.inverter.y+size.inverter.h/2-size.terminal_diam ],
    ],'DC_neg')
    block( 'terminal', {
        x: x+offset,
        y: loc.inverter.y+size.inverter.h/2-size.terminal_diam,
    });

    // pos
    line([
        [ x-offset, y-size.terminal_diam-size.terminal_diam*3],
        [ x-offset, loc.inverter.y+size.inverter.h/2-size.terminal_diam ],
    ],'DC_pos')
    block( 'terminal', {
        x: x-offset,
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

},{"../lib/k/k.js":7,"./layers":2,"underscore":15}],4:[function(require,module,exports){
"use strict";
var log = console.log.bind(console);
var k = require('../lib/k/k.js')

var settings = {};


settings.system = {};
settings.registry = [];

var system = settings.system;
system.wire_config_num = 5;
system.DC = {};
system.DC.module = {};

var config_options = settings.config_options = {};



config_options.AC_type_options = ['120V', '240V', '208V', '277V', '480V Wye', '480V Delta'];
config_options.string_num_options = [1,2,3,4,5,6];
config_options.string_modules_options = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
config_options.AC_types = {
    '120V'      : ['ground', 'neutral', 'L1' ],
    '240V'      : ['ground', 'neutral', 'L1', 'L2' ],
    '208V'      : ['ground', 'neutral', 'L1', 'L2' ],
    '277V'      : ['ground', 'neutral', 'L1' ],
    '480V Wye'  : ['ground', 'neutral', 'L1', 'L2', 'L3' ],
    '480V Delta': ['ground', 'L1', 'L2', 'L3' ],
};



//var components = settings.components = {};

config_options.inverters = {};

config_options.inverters['SMA'] = {};
config_options.inverters['SMA']['SI3000'] = {
    make:'SMA',
    model:'3000',

    DC_voltageWindow_low: 150,
    DC_voltageWindow_high: 350,
    max_power: 3300,

    AC_options: ['240','208'],

};

config_options.inverters['SMA']['SI2500'] = {
    make:'SMA',
    model:'2500',

    DC_voltageWindow_low: 150,
    DC_voltageWindow_high: 350,
    max_power: 2900,

    AC_options: ['240','208'],

};




system.DC.string_num = 4;
//log(kontainer('system'))

system.DC.string_modules = 6;

system.inverter = {};
system.inverter.model = 'SI3000'; 

system.AC_type = '480V Delta';



// Drawing specific
settings.drawing = {};

/*
var l_attr = settings.drawing.l_attr = {};

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
l_attr.frame.stroke = '#000042';
l_attr.table = Object.create(l_attr.base);
l_attr.table.stroke = '#000042';

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
*/

///////////////
// fonts

var fonts = settings.drawing.fonts = {};

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


function mk_settings(){

}



var size = settings.drawing.size = {};
var loc = settings.drawing.loc = {};


// sizes
size.drawing = {
    w: 1000,
    h: 780,
    frame_padding: 5,
    titlebox: 50,
};

size.module = {};
size.module.frame = {
    w: 10,
    h: 30,
};
size.module.lead = size.module.frame.w*2/3;
size.module.h = size.module.frame.h + size.module.lead*2;
size.module.w = size.module.frame.w;

size.wire_offset = {
    base: 5,
    gap: size.module.w,
}    ;
size.wire_offset.max = system.DC.string_num * size.wire_offset.base;
size.wire_offset.ground = size.wire_offset.max + size.wire_offset.base*2;

size.string = {};
size.string.gap = size.module.frame.w/42;
size.string.gap_missing = size.string.gap + size.module.frame.w;
size.string.h = (size.module.h * 4) + (size.string.gap * 2) + size.string.gap_missing;
size.string.w = size.module.frame.w * 2.5;

size.jb_box = {
    h: 200,
    w: 80,
};

size.discbox = {
    w: 80 + size.wire_offset.base*2 * system.DC.string_num,
    h: 140,
};

size.terminal_diam = 5;
size.fuse = {};
size.fuse.w = 15;
size.fuse.h = 4;


size.inverter = { w: 200, h: 150 };
size.inverter.text_gap = 15;
size.inverter.symbol_w = 50;
size.inverter.symbol_h = 25;

size.AC_disc = { w: 75, h: 100 };

size.AC_loadcenter = { w: 125, h: 300 }; 
size.AC_loadcenter.breaker = { w: 20, h: 5, };

size.AC_loadcenter.neutralbar = { w:5, h:40 };
size.AC_loadcenter.groundbar = { w:40, h:5 };



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

// wire table
size.wire_table = {};
size.wire_table.w = 200;
size.wire_table.row_h = 10;
size.wire_table.h = (system.wire_config_num+3) * size.wire_table.row_h;
loc.wire_table = {
    x: size.drawing.w - size.drawing.titlebox - size.drawing.frame_padding*3 - size.wire_table.w/2 - 25,
    y: size.drawing.frame_padding*3 + size.wire_table.h/2,
};
loc.wire_table.top = loc.wire_table.y - size.wire_table.h/2;
loc.wire_table.bottom = loc.wire_table.y + size.wire_table.h/2;

//loc.AC_loadcenter.breakers = 

// voltage drop table
size.volt_drop_table = {};
size.volt_drop_table.w = 150;
size.volt_drop_table.h = 100;
loc.volt_drop_table = {};
loc.volt_drop_table.x = size.drawing.w - size.volt_drop_table.w/2 - 90;
loc.volt_drop_table.y = size.drawing.h - size.volt_drop_table.h/2 - 30;


// voltage drop table
size.general_notes = {};
size.general_notes.w = 150;
size.general_notes.h = 100;
loc.general_notes = {};
loc.general_notes.x = size.general_notes.w/2 + 30;
loc.general_notes.y = size.general_notes.h/2 + 30;


/////////////////////

module.exports = settings;

},{"../lib/k/k.js":7}],5:[function(require,module,exports){
var k = require('../lib/k/k.js')
var log = console.log.bind(console);
//var update_system = require('./update').update_system;

function loadTables(string){
    var tables = {};
    var l = string.split('\n');
    var title;
    var fields;
    var need_title = true;
    var need_fields = true;
    l.forEach( function(string, i){
        var line = string.trim();
        if( line.length === 0 ){
            need_title = true;
            need_fields = true;
        } else if( need_title ) {
            title = line;
            tables[title] = [];
            need_title = false; 
            //log('new table ', title)
        } else if( need_fields ) {
            fields = line.split(',');
            need_fields = false;
        } else {
            var entry = {};
            var line_array = line.split(',');
            fields.forEach( function(field, id){
                entry[field.trim()] = line_array[id].trim(); 
            });
            tables[title].push( entry );
        }
    });

    return tables;
}


function loadModules(string){
    var db = k.parseCSV(string);
    var modules = {}    
    for( var i in db ){
        var module = db[i];
        if( modules[module.Make] === undefined ){
            modules[module.Make] = {};
        }
        if( modules[module.Make][module.Model] === undefined ){
            modules[module.Make][module.Model] = {};
        }
        modules[module.Make][module.Model] = module;
    }

    return modules;
}



module.exports.loadTables = loadTables;
module.exports.loadModules = loadModules;


},{"../lib/k/k.js":7}],6:[function(require,module,exports){
"use strict";
var log = console.log.bind(console);
var k = require('../lib/k/k.js');
//var mk_drawing = require('./mk_drawing');
//var display_svg = require('./display_svg');

var update_system = function(settings) {
    //log('---settings---', settings);
    var system = settings.system;

    //system.DC.string_num = settings.system.string_num; 
    //system.DC.string_modules = settings.system.string_modules;
    //if( settings.config_options.modules !== undefined ){
    if( settings.config_options.modules ){
        settings.config_options.moduleMakeArray = k.objIdArray(settings.config_options.modules);
        system.DC.module.make = system.DC.module.make || Object.keys( settings.config_options.modules )[0];
        settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.modules[system.DC.module.make]);
        system.DC.module.model = system.DC.module.model || Object.keys( settings.config_options.modules[system.DC.module.make] )[0];
        system.DC.module.specs = settings.config_options.modules[system.DC.module.make][system.DC.module.model];
    }
    if( settings.config_options.inverters ){
        settings.config_options.moduleMakeArray = k.objIdArray(settings.config_options.inverters);
        system.inverter.make = system.inverter.make || Object.keys( settings.config_options.inverters )[0];
        settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.inverters[system.DC.module.make]);
        system.inverter.model = system.inverter.model || Object.keys( settings.config_options.inverters[system.inverter.make] )[0];
        system.inverter.specs = settings.config_options.inverters[system.inverter.make][system.inverter.model];
    }

    settings.config_options.moduleMakeArray = k.objIdArray(settings.config_options.modules);
    settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.modules[system.DC.module.make]);

    //system.module = settings.config_options.modules[settings.misc.module];

    if( system.DC.module.specs ){
        system.DC.current = system.DC.module.specs.Isc * system.DC.string_num;
        system.DC.voltage = system.DC.module.specs.Voc * system.DC.string_modules;
    }

    //system.inverter = settings.config_options.inverters[system.inverter.model];

    system.AC_loadcenter_type = '480/277V';

    system.AC_type = settings.system.AC_type;

    system.AC_conductors = settings.config_options.AC_types[system.AC_type];

    
    //return settings;
};



module.exports = update_system;

},{"../lib/k/k.js":7}],7:[function(require,module,exports){
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// This is the k javascript library
// a collection of functions used by kshowalter
/////////////////////////////////////////////////////////////////////////////////////////////////////////

var moment = require('moment');
var $ = require('./k_DOM.js');


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Misc. variables  /////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// log shortcut
var log = console.log.bind(console)
var logObj = function(obj){
    console.log(JSON.stringify(obj))
}
var logObjFull = function(obj){
    console.log(JSON.stringify(obj, null, 4))
}

// ~ page load time
var boot_time = moment()

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Start of libary object  //////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

var k = {}




/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Javasript functions //////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////



k.obj_extend = function(obj, props) {
    for(var prop in props) { 
        if(props.hasOwnProperty(prop)) {
            obj[prop] = props[prop]
        } 
    } 
}

k.obj_rename = function(obj, old_name, new_name){
    // Check for the old property name to avoid a ReferenceError in strict mode.
    if (obj.hasOwnProperty(old_name)) {
        obj[new_name] = obj[old_name]
        delete obj[old_name]
    }
    return obj
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Misc /////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////


// http://css-tricks.com/snippets/javascript/get-url-variables/
k.getQueryVariable = function(variable) {
       var query = window.location.search.substring(1)
       var vars = query.split("&")
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=")
               if(pair[0] == variable){
                   return pair[1]
               }
       }
       return(false)
}

k.str_repeat = function(string, count) {
    if (count < 1) return ''
    var result = '' 
    var pattern = string.valueOf()
    while (count > 0) {
        if (count & 1) result += pattern
        count >>= 1 
        pattern += pattern
    }
    return result
}


k.objIdArray = function( object ) {
    if( object !== undefined ) {
        var a = [];
        for( var id in object ) {
            if( object.hasOwnProperty(id) )  {
                a.push(id);
            }
        }
        return a;
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Math, numbers ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////


/*
 *  normRand: returns normally distributed random numbers
 *  http://memory.psych.mun.ca/tech/snippets/random_normal/
 */
k.normRand = function(mu, sigma) {
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

k.pad_zero = function(num, size){
    var s = '000000000' + num
    return s.substr(s.length-size)     
}


k.uptime = function(boot_time){
    var uptime_seconds_total = moment().diff(boot_time, 'seconds')
    var uptime_hours = Math.floor(  uptime_seconds_total /(60*60) )
    var minutes_left = uptime_seconds_total %(60*60)
    var uptime_minutes = k.pad_zero( Math.floor(  minutes_left /60 ), 2 )
    var uptime_seconds = k.pad_zero( (minutes_left % 60), 2 )
    return uptime_hours +":"+ uptime_minutes +":"+ uptime_seconds
}



k.last_n_values = function(n){
    return {
        n: n,
        array: [],
        add: function(new_value){
            this.array.push(new_value)
            if( this.array.length > n ) this.array.shift()
            return this.array
        }
    }    
}

k.arrayMax = function(numArray) {
    return Math.max.apply(null, numArray);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// AJAX /////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

k.AJAX = function(url, callback, object) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
            if(xmlhttp.status == 200){
                callback(xmlhttp.responseText, object);
            }
            else if(xmlhttp.status == 400) {
                log('There was an error 400')
            }
            else {
                log('something else other than 200 was returned')
            }
        }
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

k.parseCSV = function(file_content) {
    var r = []
    var lines = file_content.split('\n')
    var header = lines.shift().split(',')
    for(var l = 0, len = lines.length; l < len; l++){
        var line = lines[l]
        if(line.length > 0){
            var line_obj = {}
            line.split(',').forEach(function(item,i){
                line_obj[header[i]] = item
            })
            r.push(line_obj)
        }
    }
    return(r)
}

k.getCSV = function(URL, callback) {
    k.AJAX(URL, k.parseCSV() )
}

/*
$.ajaxSetup ({
    cache: false
})



k.get_JSON = function(URL, callback, string) {
//    var filename = URL.split('/').pop()
//    log(URL)
    $.getJSON( URL, function( json ) {
        callback(json, URL, string)
    }).fail(function(jqxhr, textStatus, error) { 
        console.log( "error", textStatus, error  ) 
    })
}


k.load_files = function(file_list, callback){
    var d = {}

    function load_file(URL){
        var filename = URL.split('/').pop()
//        var name = filename.split('.')[0]
        $.getJSON( URL, function( json ) { // , textStatus, jqXHR) {
            add_JSON(filename, json)
        }).fail(function(jqxhr, textStatus, error) { 
            console.log( "error", textStatus, error  ) 
        })
    }

    function add_JSON(name, json){
        d[name] = json
        if(Object.keys(d).length == d_files.length){
            callback(d)
        }
    }

    for( var key in file_list){
        var URL = file_list[key]
        load_file(URL)
    }
    
//    callback(d)
}

k.getFile = function(URL, callback){
    $.ajax({
        url: URL,
        beforeSend: function( xhr ) {
            xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
        }
    })
    .done(function( data ) {
        callback(data)
    })
    .fail(function(jqxhr, textStatus, error) { 
            console.log( "error", textStatus, error  ) 
    })
    
    
}
*/


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// HTML /////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////




k.setup_body = function(title, sections){
    document.title = title
    var body = document.body 
    var status_bar = document.createElement('div')
    status_bar.id = 'status'
    status_bar.innerHTML = 'loading status...'
    /*
    var title_header = document.createElement('h1')
    title_header.innerHTML = title
    body.insertBefore(title_header, body.firstChild)
    */
    body.insertBefore(status_bar, body.firstChild)
    /*
    var tabs_div = k.make_tabs(sections)
    $('body').append(tabs_div)
    $( '.tabs' ).tabs({ 
        activate: function( event, ui ) {
            var full_title = title + " / " + ui.newTab[0].textContent
            document.title = full_title
            $('#title').text(full_title)
            //dump(moment().format('YYYY-MM-DD HH:mm:ss'))
            $.sparkline_display_visible()
        }
    })
    var section = k.getQueryVariable('sec')
    if(section in sections) {
        var index = $('.tabs a[href="#'+section+'"]').parent().index()
        $(".tabs").tabs("option", "active", index)
    }
    */

}
/*
k.make_tabs = function(section_obj){
    var tabs_div = $('<div>').addClass('tabs')
    var head_div = $('<ul>').appendTo(tabs_div)

    for (var id in section_obj){
        var title = section_obj[id]
        //('<li><a href="#'+id+'">'+title+'</a></li>'))
        //('<div id="'+id+'"></div>'))
    }   
    
    return tabs_div
}

*/
k.update_status_page = function(status_id, boot_time) {
    var status_div = document.getElementById(status_id)
    status_div.innerHTML = ''

    var clock = document.createElement('span')
    clock.innerHTML = moment().format('YYYY-MM-DD HH:mm:ss')

    var uptime = document.createElement('span')
    uptime.innerHTML = 'Uptime: ' + k.uptime(boot_time)
    
    status_div.appendChild(clock)
    status_div.innerHTML += ' | '
    status_div.appendChild(uptime)
    status_div.innerHTML += ' | '
}

/*
k.obj_log = function(obj, obj_name, max_level){
    var levels = function(obj, level_indent, str){
        for(var name in obj) {
            var item = obj[name]
            if( level_indent <= max_level && typeof(item) == 'object' ) {
                str += "\n" + k.str_repeat(" ", level_indent*2) + name 
                str = levels(item, level_indent+1, str )
            } else if(typeof item !== 'function') {
                str += "\n" + k.str_repeat(" ", level_indent*2) + name + ": " + item
            } else {
                str += "\n" + k.str_repeat(" ", level_indent*2) + name + ": <function>"
            }
        }
        return str
    }
    var max_level = max_level || 100
    log(obj_name)
    var str = '-' + obj_name + '-'
    max_level++
    level_indent = 2
    str = levels(obj, level_indent, str)
    log(str)
}


k.obj_tree = function(obj, title){
    // takes a javascript, and returens a jquery DIV
    var obj_div = $('<pre>') //.addClass('box')
    var levels = function(obj, level_indent){(line, circle, text ) 
        var list = []
        var obj_length = 0
        for( var key in obj) {obj_length++}
        var count = 0          
        for(var key in obj) {
            var item = obj[key]
            
//            var indent_string = '&nbsp;&nbsp;&nbsp;&#9474'.repeat(level) + '&nbsp;&nbsp;&nbsp;'
//            if(level_indent === '' ){
//                next_level_indent = level_indent + '&nbsp;&nbsp;' 
//                this_level_indent = level_indent + '&nbsp;&nbsp;'
//            } else 
            if(count == obj_length-1 ) {   // If last item, finsh tree section
                var next_level_indent = level_indent + '&nbsp;&nbsp;' 
                var this_level_indent = level_indent + '&nbsp;&#9492;&#9472;' 
            }
            else{ 
                var next_level_indent = level_indent + '&nbsp;&#9474;' 
                var this_level_indent = level_indent + '&nbsp;&#9500;&#9472;' 
            }
            
            
            if( typeof(item) == 'object' ){
                list.push( this_level_indent + key)
                list = list.concat( levels(item, next_level_indent) )
            } else {
                item = item.toString().replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ") //http://www.textfixer.com/tutorials/javascript-line-breaks.php
                list.push(this_level_indent + key+": "+ item)
            }
            
            
//            log(key,level)
            count++
            
        }
        return list
    }
    
    var list = [title].concat(levels(obj,''))
    list.forEach( function(line,key){
        obj_div.append(line + '</br>')
    })
    return obj_div
}




/*
k.obj_display = function(obj){
    function levels(obj,level){
    //    var subobj_div = $('<div>')
        var subobj_ul = $('<ul>').addClass('tree')

        for(var key in obj) {
            var item = obj[key]
    //        log(key, typeof(item))
            if( typeof(item) == 'object' ){
    //            ('<li>').text("&nbsp;".repeat(level) + key))
                ('<li>').text(key))
                subobj_ul.append(levels(item,level+1))
    //            log("&nbsp;".repeat(level) + key)
            } else {
    //            subobj_div.append('<span>').text("&nbsp;".repeat(level) + key+": "+ item)
    //            ('<li>').text("&nbsp;".repeat(level) + key +": "+ item))
                ('<li>').text(key +": "+ item))
    //            log("&nbsp;".repeat(level) + key+": "+ item)
            }
        }
        return subobj_ul
    }
    // takes a javascript, and returens a jquery DIV
    var obj_div = $('<div>')//.addClass('box')
    
    obj_div.append(levels(obj,0))
    return obj_div
}

k.show_obj = function(container_id, obj, name){
    var id = '#' + name
    if( ! $(container_id).children(id).length ) { 
        ('<div>').attr('id', name)) 
    }
    var box = $(container_id).children(id)
    box.empty()
    
    var obj_div = $('<div>').addClass('box')
    obj_div.append(k.obj_tree(obj, name))
    box.append(obj_div)
    
}

*/
k.log_object_tree = function(components){
    for( var make in components.modules ){
        if( components.modules.hasOwnProperty(make)){
            for( var model in components.modules[make] ){
                if( components.modules[make].hasOwnProperty(model)){
                    var o = components.modules[make][model]
                    var a = [make,model]
                    for( var spec in o ){
                        if( o.hasOwnProperty(spec)){
                            a.push(o[spec]);
                        }
                    }
                    log(a.join(','))
                }
            }
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// FSEC /////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////




k.cr1000_json = function(json){
//    var fields = []
//    $.each(json.head.fields, function(key, field) {
//        fields.push(field.name)
//    })
//    var data = _.zip(fields, json.data[0].vals)
//    
    var timestamp = json.data[0].time
    var data = {}
    data.Timestamp = json.data[0].time
    data.RecordNum = json.data[0].no
    for(var i = 0, l = json.head.fields.length; i < l; i++ ){
        data[json.head.fields[i].name] = json.data[0].vals[i]
    }
    
    return data
}






/////////////////////////////////////////////////////////////////////////////////////////////////////////
// D3 ///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////



k.d3 = {}

k.d3.live_sparkline = function(id, history) {
    var data = history.array
    var length = history.array.length
    var n = history.n
    //k.d3.live_sparkline = function(id, width, height, interpolation, animate, updateDelay, transitionDelay) {
    // based on code posted by Ben Christensen https://gist.github.com/benjchristensen/1148374
    
    var width = 400,
        height = 50,
        interpolation = 'basis',
        animate = true,
        updateDelay = 1000,
        transitionDelay = 1000
    
    // X scale will fit values from 0-10 within pixels 0-100
    // starting point is -5 so the first value doesn't show and slides off the edge as part of the transition
    var x = d3.scale.linear().domain([0, 59]).range([0, width]); 
    // Y scale will fit values from 0-10 within pixels 0-100
    var y = d3.scale.linear().domain([20, 40]).range([height, 0]);

    // create a line object that represents the SVN line we're creating
    var line = d3.svg.line()
        // assign the X function to plot our line as we wish
        .x(function(d,i) { 
            // verbose logging to show what's actually being done
            //console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
            // return the X coordinate where we want to plot this datapoint
            return x(i); 
        })
        .y(function(d) { 
            // verbose logging to show what's actually being done
            //console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
            // return the Y coordinate where we want to plot this datapoint
            return y(d); 
        })
        .interpolate(interpolation)

    // If svg does not exist, create it
    if( ! d3.select('#'+id).select('svg')[0][0] ){
        // create an SVG element inside the #graph div that fills 100% of the div
        var graph = d3.select('#'+id).append("svg:svg").attr("width", width).attr("height", height);

        // display the line by appending an svg:path element with the data line we created above
//        graph.append("svg:path").attr("d", line(data));
        // or it can be done like this
        graph.selectAll("path").data([data]).enter().append("svg:path").attr("d", line);
    }
    
    var graph = d3.select('#'+id+' svg')
    log( length)
    // update with animation
    graph.selectAll("path")
        .data([data]) // set the new data
        .attr("transform", "translate(" + x(n-length +1) + ")") // set the transform to the right by x(1) pixels (6 for the scale we've set) to hide the new value
        .attr("d", line) // apply the new data values ... but the new value is hidden at this point off the right of the canvas
        .transition() // start a transition to bring the new value into view
        .ease("linear")
        .duration(transitionDelay) // for this demo we want a continual slide so set this to the same as the setInterval amount below
        .attr("transform", "translate(" + x(n-length) + ")"); // animate a slide to the left back to x(0) pixels to reveal the new value

        /* thanks to 'barrym' for examples of transform: https://gist.github.com/1137131 */
//     graph.append("rect")
//          .attr("x", 0)
//          .attr("y", 0)
//          .attr("height", height)
//          .attr("width", width)
//          .style("stroke", '#f00')
//          .style("fill", "none")
//          .style("stroke-width", '1px')
     
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Events ///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

k.e = {}

k.uptime = function(boot_time){
    var uptime_seconds_total = moment().diff(boot_time, 'seconds')
    var uptime_hours = Math.floor(  uptime_seconds_total /(60*60) )
    var minutes_left = uptime_seconds_total %(60*60)
    var uptime_minutes = k.pad_zero( Math.floor(  minutes_left /60 ), 2 )
    var uptime_seconds = k.pad_zero( (minutes_left % 60), 2 )
    return uptime_hours +":"+ uptime_minutes +":"+ uptime_seconds
}

k.e.addTimeSince = function(event_list){
    log(moment().format('YYYY-MM-DD'))
    log(moment().fromNow())
    event_list.forEach(function(event){
        var date_array = event.date.split('-').map(Number)
        var year = date_array[0]
        var month = date_array[1]
        var day = date_array[2]
        var this_year = moment().year()
        if(moment().diff(moment([this_year, month-1, day]), 'days') > 0) {this_year++}
        var event_moment = moment(event.date, 'YYYY-MM-DD')
        var days_ago = moment().diff(event_moment, 'day')
        event.time_since = event_moment.fromNow()
        event.years_ago = moment().diff(event_moment, 'years')
        event.days_till_next = -moment().diff(moment([this_year, month-1, day]), 'days')
    })
    event_list.sort(function(a,b){
        return a.days_till_next - b.days_till_next
    })
    return event_list
} 

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Displays /////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

k.d = {}

/*
k.d = {
    width: '100%',
    value: 0,
    
}

k.d.prototype.setPer = function(percent){
    this.bar.css('width', percent+'%')
}
*/


/*
k.d.bar = function(){
    var bar = {}

    bar.width = 100
    bar.width_unit = '%' 
    bar.height = '8px'    

    log(bar.width+'%')
    bar.div = $('<div>').css('width', '0%')
    bar.element = $('<div>').addClass('progressbar').css('width', 100)
    bar.element.append(bar.div)

    bar.setPercent = function(percent){
        this.width = percent
        this.width_unit = '%'
        this.update()
    }
    bar.update = function(){
        this.div.css('width', this.width+this.width_unit)
        this.element.css('height', toString(this.height)+'px')
    } 
    return bar
}
*/


// Browserify
module.exports = k;

},{"./k_DOM.js":8,"moment":14}],8:[function(require,module,exports){
'use strict';
var log = console.log.bind(console);

var value = require('./k_DOM_extra.js').value;
var selector = require('./k_DOM_extra.js').selector;
//log( 'value', value() );
//log( 'selector', selector() ); var k = require('./k'); //var selector = require('./k_DOM_extra.js').selector; 


var wrapper_prototype = require('./wrapper_prototype');

/*
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
*/

var Wrap = function(element){
    var W = Object.create(wrapper_prototype);


    W.elem = element;
    if( W.elem.tagName === "SELECT" ) {
        W.setOptions = function( option_array ) {
            W.elem.options.length = 0; 
            //log("option_array", option_array);
            option_array.forEach( function(option_str,i){
                var opt = document.createElement('option');
                opt.text = option_str;
                opt.value = option_str;
                W.elem.add(opt);
            });

        };
    }
    return W;

};

var $ = function(input){
    var element;

    if( typeof input === 'undefined' ) {
        //log('input needed');
        return false;
    }
    if( input instanceof HTMLElement ){
        return Wrap(input);
    }
    if( input.substr(0,1) === '#' ) {
        element = document.getElementById(input.substr(1));
        return Wrap(element);
    } else if( input.substr(0,1) === '.' ) {
        element = document.getElementByClassName(input.substr(1)[0]);
        return Wrap(element);
    } else {
        if( input === 'value' ) {
            if( value !== undefined ) {
                element = value(); 
                return element;
            } else {
                console.log("Error: value not defined");
                return false;
            }
        } else if( input === 'selector' ) {
            if( selector !== undefined ) {
                element = selector(); 
                return element;
            } else {
                console.log("Error: selector not defined");
                return false;
            }
        } else {
            element = document.createElement(input);
            return Wrap(element);
        }
    }
    


};

// Browserify
module.exports = $;
//module.exports.wrapper_prototype = wrapper_prototype;

},{"./k_DOM_extra.js":9,"./wrapper_prototype":12}],9:[function(require,module,exports){
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


},{"./k.js":7,"./k_DOM.js":8,"./kontainer":11,"./wrapper_prototype":12}],10:[function(require,module,exports){
'use strict';

var kdb_prototype = {
    set_fields: function(field_array) {
        var list;
        if( typeof arguments[0] === 'string' ) {  // each argument is a field
            list = Array.prototype.slice.call(arguments); //convert arguments to an array
        } else { // assumed list of fields
            list = argument[0];
        }

        this.fields = []
        list.forEach( function(field) {
            this.fields.push(field) ;
        },this) 

        return this;
    },

    add: function(entry) {
        var list;
        var obj = {};

        if( Object.prototype.toString.call(entry) === '[object Array]' ) { // if list is submitted
            list = arguments[0];
        } else if( Object.prototype.toString.call(entry) === '[object Object]' ) { // if object is submitted
            obj = arguments[0];
        } else {  // each argument is a field: string, number, etc.
            list = Array.prototype.slice.call(arguments); //convert arguments to an array
        }
        if( list !== undefined ) {
            list.forEach( function( value, i ) {
                obj[this.fields[i]] = value;
            },this) 
        }


        this.rows.push(obj);
            
        return this;
    },
    CSV: function(string){
    
    
    },
    get: function(field, value){
        //var h = this.fields.indexOf(column);
        //log(h, this.fields[h])
        var output = [];
        this.rows.forEach( function(row,id){
            if( row[field] === value ){
                output.push(row);
            }
        },this)    
        log(output)
        return output;
    },
    column: function(field){
        var column = [];
        this.rows.forEach( function(row){
            column.push( row[field] );
        })
        return column;
    },
}


function KDB() {
    var d = Object.create(kdb_prototype);
    
    d.rows = [];



    return d;
}





},{}],11:[function(require,module,exports){
'use strict';
var log = console.log.bind(console);

var kontainer = {
    ref: function(refString){
        if( typeof refString === 'undefined' ){
            return this.refString;
        } else {
            this.refString = refString;
            this.refArray = refString.split('.');
            if( typeof this.object !== 'undefined'){
                this.ready = true;
            } else {
                this.ready = false;
            }
        }
    },
    obj: function(obj){
        if( typeof obj === 'undefined' ){
            return this.object;
        } else {
            this.object = obj;
            if( typeof this.refString !== 'undefined'){
                this.ready = true;
            } else {
                this.ready = false;
            }
        }
    },
    set: function(input){
        //log('kontainer setting to ', this.refString, input)
        if( typeof this.object === 'undefined' || typeof this.refString === 'undefined' ){
            return false;
        }
        var parent = this.object;
        var last_level = this.refArray[this.refArray.length-1];
        //log('last_level',last_level)

        this.refArray.forEach(function(level_name,i){
            if( typeof parent[level_name] === 'undefined' ) {
                parent[level_name] = {};
            }
            if( level_name !== last_level ){
                //log('moving to ', level_name)
                parent = parent[level_name];
            }
        });
        //log('parent',parent);
        parent[last_level] = input;
        //log(this.get())
        return parent[last_level];
    },
    get: function(){
        var level = this.object;
        this.refArray.forEach(function(level_name,i){
            if( typeof level[level_name] === 'undefined' ) {
                //log('kontainer: '+level_name+' not defined');
                return false;
            }
            level = level[level_name];
        });
        return level;
    },
};

module.exports = kontainer;

},{}],12:[function(require,module,exports){
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

    /*
    pushTo: function(array){
        array.push(this);
    }
    */

};

module.exports = wrapper_prototype;

},{}],13:[function(require,module,exports){
"use strict";
var log = console.log.bind(console);

var _ = require('underscore');
var moment = require('moment');
var k = require('./lib/k/k.js');
var k_data = require('./lib/k/k_data.js');
var $ = require('./lib/k/k_DOM');

var settings = require('./app/settings.js');
var loadTables = require('./app/settings_functions').loadTables;
var loadModules = require('./app/settings_functions').loadModules;
var mk_drawing = require('./app/mk_drawing.js');
var display_svg = require('./app/display_svg.js');
var update_system = require('./app/update_system');
var settings = require('./app/settings.js');

var components = settings.components;
var system = settings.system;




function lookupLocation(position){
    var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude+','+position.coords.longitude+'&sensor=true';
    k.AJAX(url, showLocation);
}
function showLocation(location_json){
    var location = JSON.parse(location_json);
    location.results[0].address_components.forEach( function(component){
        if( component.types[0] === "locality" ) {
            system.city = component.long_name ;
            //log('city ', system.city) 
        } else if( component.types[0] === "administrative_area_level_2" ){
            system.county = component.long_name ;
            //log('county ', system.county)
        }
    });
    update_system(settings);
}

function update(){
    log('updating');

    // Make sure selectors and value displays are updated

    update_system(settings);
    // delete all elements of drawing 
    //clear_drawing();

    // Recalculate system specs
    //settings = update_system(settings);
    
    // Recalculate drawing related variables
    //update_values();

    // Generate new drawing elements
    settings.elements = mk_drawing(settings);

    // Add drawing elements to SVG on screen
    display_svg(settings, svg_container);

    settings.registry.forEach(function(item){
        //log('updating: ', item)
        item.update(); 
    });
}


//k.AJAX('data/tables.txt', loadTables, settings);
k.AJAX('data/tables.txt', ready, {type:'loadTables'});

//k.AJAX( 'data/modules.csv', loadModules, settings );
k.AJAX( 'data/modules.csv', ready, {type:'loadModules'});



var ready_count = 0;
function ready(input, config){

    if( config.type === 'loadTables'){
        settings.config_options.NEC_tables = loadTables(input);
        ready_count++;
    }
    if( config.type === 'loadModules'){
        settings.config_options.modules = loadModules(input);
        ready_count++;
    }
    if( ready_count === 2 ){
        log('ready');
        update(settings);
    }
}


// # Page setup

var svg_container_id = 'svg_container';
var svg_container = document.getElementById(svg_container_id);
var system_container_id = 'system_container';


var title = 'PV drawing test';

k.setup_body(title);
var draw_page = $('div').attr('id', 'drawing_page');
document.body.appendChild(draw_page.elem);

var system_container = $('div').attr('id', system_container_id).appendTo(draw_page);

var svg_container_object = $('div').attr('id', svg_container_id).appendTo(draw_page);
var svg_container = svg_container_object.elem;




var system_container_array = [
    /*
    $('span').html('IP location |'),
    $('span').html('City: '),
    $('value').setRef('system.city'),
    $('span').html(' | '),
    $('span').html('County: '),
    $('value').setRef('system.county'),
    $('br'),
    //*/

    $('span').html('Module make: '),
    //$('selector') .setOptionsRef( 'components.moduleMakeArray' ) .setRef('system.pv_make'),
    $('selector') .setOptionsRef( 'settings.config_options.moduleMakeArray' ) .setRef('system.DC.module.make'),
    
    $('br'),
    $('span').html('Module model: '),
    //$('selector').setOptionsRef( 'components.moduleModelArray' ).setRef('system.pv_model'),
    $('selector').setOptionsRef( 'settings.config_options.moduleModelArray' ).setRef('system.DC.module.model'),
    $('br'),
    $('span').html('Pmax: '),
    $('value').setRef('system.DC.module.specs.Pmax'),

    $('span').html(' | '),
    $('span').html('Isc: '),
    $('value').setRef('system.DC.module.specs.Isc'),

    $('span').html(' | '),
    $('span').html('Voc: '),
    $('value').setRef('system.DC.module.specs.Voc'),

    $('span').html(' | '),
    $('span').html('Imp: '),
    $('value').setRef('system.DC.module.specs.Imp'),
    
    $('span').html(' | '),
    $('span').html('Vmp: '),
    $('value').setRef('system.DC.module.specs.Vmp'),

    $('br'),

    $('span').html('Number of strings: '),
    $('selector').setOptionsRef( 'config_options.string_num_options').setRef('system.DC.string_num'),
    $('span').html(' | '),
    $('span').html('Number of modules per string: '),
    $('selector').setOptionsRef( 'config_options.string_modules_options').setRef('system.DC.string_modules'),
    $('br'),
    
    $('span').html('Array voltage: '),
    $('value').setRef('system.DC.voltage').setMax(600).attr('id', 'DC_volt'),

    $('span').html(' | '),

    $('span').html('Array current: '),
    $('value').setRef('system.DC.current'),

    $('br'),

    $('span').html('AC type: '),

    $('selector').setOptionsRef( 'config_options.AC_type_options').setRef('AC_type'),

    $('br'),

].forEach( function(kelem){
    kelem.appendTo(system_container);
    if( kelem.type === 'selector' ){
        kelem.setRefObj(settings);
        kelem.setUpdate(update);
        settings.registry.push(kelem);
        kelem.update(); 
    } else if( kelem.type === 'value' ){
        kelem.setRefObj(settings);
        //kelem.setUpdate(update_system);
        settings.registry.push(kelem);
    }
});


var boot_time = moment();
var status_id = "status";
setInterval(function(){ k.update_status_page(status_id, boot_time);},1000);

log('settings', settings);
log('window', window);


},{"./app/display_svg.js":1,"./app/mk_drawing.js":3,"./app/settings.js":4,"./app/settings_functions":5,"./app/update_system":6,"./lib/k/k.js":7,"./lib/k/k_DOM":8,"./lib/k/k_data.js":10,"moment":14,"underscore":15}],14:[function(require,module,exports){
(function (global){
//! moment.js
//! version : 2.7.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (undefined) {

    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = "2.7.0",
        // the global-scope this is NOT the global object in Node.js
        globalScope = typeof global !== 'undefined' ? global : this,
        oldGlobalMoment,
        round = Math.round,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for language config files
        languages = {},

        // moment internal properties
        momentProperties = {
            _isAMomentObject: null,
            _i : null,
            _f : null,
            _l : null,
            _strict : null,
            _tzm : null,
            _isUTC : null,
            _offset : null,  // optional. Combine with _isUTC
            _pf : null,
            _lang : null  // optional
        },

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,

        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
        parseTokenOrdinal = /\d{1,2}/,

        //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],
            ['YYYY-DDD', /\d{4}-\d{3}/]
        ],

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        },

        unitAliases = {
            ms : 'millisecond',
            s : 'second',
            m : 'minute',
            h : 'hour',
            d : 'day',
            D : 'date',
            w : 'week',
            W : 'isoWeek',
            M : 'month',
            Q : 'quarter',
            y : 'year',
            DDD : 'dayOfYear',
            e : 'weekday',
            E : 'isoWeekday',
            gg: 'weekYear',
            GG: 'isoWeekYear'
        },

        camelFunctions = {
            dayofyear : 'dayOfYear',
            isoweekday : 'isoWeekday',
            isoweek : 'isoWeek',
            weekyear : 'weekYear',
            isoweekyear : 'isoWeekYear'
        },

        // format function strings
        formatFunctions = {},

        // default relative time thresholds
        relativeTimeThresholds = {
          s: 45,   //seconds to minutes
          m: 45,   //minutes to hours
          h: 22,   //hours to days
          dd: 25,  //days to month (month == 1)
          dm: 45,  //days to months (months > 1)
          dy: 345  //days to year
        },

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.lang().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.lang().months(this, format);
            },
            D    : function () {
                return this.date();
            },
            DDD  : function () {
                return this.dayOfYear();
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return this.lang().weekdaysMin(this, format);
            },
            ddd  : function (format) {
                return this.lang().weekdaysShort(this, format);
            },
            dddd : function (format) {
                return this.lang().weekdays(this, format);
            },
            w    : function () {
                return this.week();
            },
            W    : function () {
                return this.isoWeek();
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY : function () {
                return leftZeroFill(this.year(), 5);
            },
            YYYYYY : function () {
                var y = this.year(), sign = y >= 0 ? '+' : '-';
                return sign + leftZeroFill(Math.abs(y), 6);
            },
            gg   : function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg : function () {
                return leftZeroFill(this.weekYear(), 4);
            },
            ggggg : function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG   : function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 4);
            },
            GGGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e : function () {
                return this.weekday();
            },
            E : function () {
                return this.isoWeekday();
            },
            a    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return toInt(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS  : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z    : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ":" + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ   : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z : function () {
                return this.zoneAbbr();
            },
            zz : function () {
                return this.zoneName();
            },
            X    : function () {
                return this.unix();
            },
            Q : function () {
                return this.quarter();
            }
        },

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];

    // Pick the first defined of two or three arguments. dfl comes from
    // default.
    function dfl(a, b, c) {
        switch (arguments.length) {
            case 2: return a != null ? a : b;
            case 3: return a != null ? a : b != null ? b : c;
            default: throw new Error("Implement me");
        }
    }

    function defaultParsingFlags() {
        // We need to deep clone this object, and es5 standard is not very
        // helpful.
        return {
            empty : false,
            unusedTokens : [],
            unusedInput : [],
            overflow : -2,
            charsLeftOver : 0,
            nullInput : false,
            invalidMonth : null,
            invalidFormat : false,
            userInvalidated : false,
            iso: false
        };
    }

    function deprecate(msg, fn) {
        var firstTime = true;
        function printMsg() {
            if (moment.suppressDeprecationWarnings === false &&
                    typeof console !== 'undefined' && console.warn) {
                console.warn("Deprecation warning: " + msg);
            }
        }
        return extend(function () {
            if (firstTime) {
                printMsg();
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.lang().ordinal(func.call(this, a), period);
        };
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    /************************************
        Constructors
    ************************************/

    function Language() {

    }

    // Moment prototype object
    function Moment(config) {
        checkOverflow(config);
        extend(this, config);
    }

    // Duration Constructor
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._bubble();
    }

    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }

        if (b.hasOwnProperty("toString")) {
            a.toString = b.toString;
        }

        if (b.hasOwnProperty("valueOf")) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function cloneMoment(m) {
        var result = {}, i;
        for (i in m) {
            if (m.hasOwnProperty(i) && momentProperties.hasOwnProperty(i)) {
                result[i] = m[i];
            }
        }

        return result;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    // helper function for _.addTime and _.subtractTime
    function addOrSubtractDurationFromMoment(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            rawSetter(mom, 'Date', rawGetter(mom, 'Date') + days * isAdding);
        }
        if (months) {
            rawMonthSetter(mom, rawGetter(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            moment.updateOffset(mom, days || months);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return  Object.prototype.toString.call(input) === '[object Date]' ||
                input instanceof Date;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (inputObject.hasOwnProperty(prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment.fn._lang[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment.fn._lang, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function weeksInYear(year, dow, doy) {
        return weekOfYear(moment([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                m._a[HOUR] < 0 || m._a[HOUR] > 23 ? HOUR :
                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0;
            }
        }
        return m._isValid;
    }

    function normalizeLanguage(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function makeAs(input, model) {
        return model._isUTC ? moment(input).zone(model._offset || 0) :
            moment(input).local();
    }

    /************************************
        Languages
    ************************************/


    extend(Language.prototype, {

        set : function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        },

        _months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort : function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse : function (monthName) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                if (!this._monthsParse[i]) {
                    mom = moment.utc([2000, i]);
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin : function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse : function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat : {
            LT : "h:mm A",
            L : "MM/DD/YYYY",
            LL : "MMMM D YYYY",
            LLL : "MMMM D YYYY LT",
            LLLL : "dddd, MMMM D YYYY LT"
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM : function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse : /[ap]\.?m?\.?/i,
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },

        _calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        calendar : function (key, mom) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom) : output;
        },

        _relativeTime : {
            future : "in %s",
            past : "%s ago",
            s : "a few seconds",
            m : "a minute",
            mm : "%d minutes",
            h : "an hour",
            hh : "%d hours",
            d : "a day",
            dd : "%d days",
            M : "a month",
            MM : "%d months",
            y : "a year",
            yy : "%d years"
        },
        relativeTime : function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },
        pastFuture : function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal : function (number) {
            return this._ordinal.replace("%d", number);
        },
        _ordinal : "%d",

        preparse : function (string) {
            return string;
        },

        postformat : function (string) {
            return string;
        },

        week : function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 1st is the first week of the year.
        },

        _invalidDate: 'Invalid date',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    // Loads a language definition into the `languages` cache.  The function
    // takes a key and optionally values.  If not in the browser and no values
    // are provided, it will load the language file module.  As a convenience,
    // this function also returns the language values.
    function loadLang(key, values) {
        values.abbr = key;
        if (!languages[key]) {
            languages[key] = new Language();
        }
        languages[key].set(values);
        return languages[key];
    }

    // Remove a language from the `languages` cache. Mostly useful in tests.
    function unloadLang(key) {
        delete languages[key];
    }

    // Determines which language definition to use and returns it.
    //
    // With no parameters, it will return the global language.  If you
    // pass in a language key, such as 'en', it will return the
    // definition for 'en', so long as 'en' has already been loaded using
    // moment.lang.
    function getLangDefinition(key) {
        var i = 0, j, lang, next, split,
            get = function (k) {
                if (!languages[k] && hasModule) {
                    try {
                        require('./lang/' + k);
                    } catch (e) { }
                }
                return languages[k];
            };

        if (!key) {
            return moment.fn._lang;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            lang = get(key);
            if (lang) {
                return lang;
            }
            key = [key];
        }

        //pick the language from the array
        //try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
        //substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
        while (i < key.length) {
            split = normalizeLanguage(key[i]).split('-');
            j = split.length;
            next = normalizeLanguage(key[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                lang = get(split.slice(0, j).join('-'));
                if (lang) {
                    return lang;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return moment.fn._lang;
    }

    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, "");
        }
        return input.replace(/\\/g, "");
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = "";
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {

        if (!m.isValid()) {
            return m.lang().invalidDate();
        }

        format = expandFormat(format, m.lang());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, lang) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return lang.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
        case 'Q':
            return parseTokenOneDigit;
        case 'DDDD':
            return parseTokenThreeDigits;
        case 'YYYY':
        case 'GGGG':
        case 'gggg':
            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
        case 'Y':
        case 'G':
        case 'g':
            return parseTokenSignedNumber;
        case 'YYYYYY':
        case 'YYYYY':
        case 'GGGGG':
        case 'ggggg':
            return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
        case 'S':
            if (strict) { return parseTokenOneDigit; }
            /* falls through */
        case 'SS':
            if (strict) { return parseTokenTwoDigits; }
            /* falls through */
        case 'SSS':
            if (strict) { return parseTokenThreeDigits; }
            /* falls through */
        case 'DDD':
            return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
            return parseTokenWord;
        case 'a':
        case 'A':
            return getLangDefinition(config._l)._meridiemParse;
        case 'X':
            return parseTokenTimestampMs;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'SSSS':
            return parseTokenDigits;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'GG':
        case 'gg':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'ww':
        case 'WW':
            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
        case 'w':
        case 'W':
        case 'e':
        case 'E':
            return parseTokenOneOrTwoDigits;
        case 'Do':
            return parseTokenOrdinal;
        default :
            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), "i"));
            return a;
        }
    }

    function timezoneMinutesFromString(string) {
        string = string || "";
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? -minutes : minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
        // QUARTER
        case 'Q':
            if (input != null) {
                datePartArray[MONTH] = (toInt(input) - 1) * 3;
            }
            break;
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            if (input != null) {
                datePartArray[MONTH] = toInt(input) - 1;
            }
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            a = getLangDefinition(config._l).monthsParse(input);
            // if we didn't find a month name, mark the date as invalid.
            if (a != null) {
                datePartArray[MONTH] = a;
            } else {
                config._pf.invalidMonth = input;
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DD
        case 'DD' :
            if (input != null) {
                datePartArray[DATE] = toInt(input);
            }
            break;
        case 'Do' :
            if (input != null) {
                datePartArray[DATE] = toInt(parseInt(input, 10));
            }
            break;
        // DAY OF YEAR
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            if (input != null) {
                config._dayOfYear = toInt(input);
            }

            break;
        // YEAR
        case 'YY' :
            datePartArray[YEAR] = moment.parseTwoDigitYear(input);
            break;
        case 'YYYY' :
        case 'YYYYY' :
        case 'YYYYYY' :
            datePartArray[YEAR] = toInt(input);
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config._isPm = getLangDefinition(config._l).isPM(input);
            break;
        // 24 HOUR
        case 'H' : // fall through to hh
        case 'HH' : // fall through to hh
        case 'h' : // fall through to hh
        case 'hh' :
            datePartArray[HOUR] = toInt(input);
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[MINUTE] = toInt(input);
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[SECOND] = toInt(input);
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'SSS' :
        case 'SSSS' :
            datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
            break;
        // UNIX TIMESTAMP WITH MS
        case 'X':
            config._d = new Date(parseFloat(input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config._useUTC = true;
            config._tzm = timezoneMinutesFromString(input);
            break;
        // WEEKDAY - human
        case 'dd':
        case 'ddd':
        case 'dddd':
            a = getLangDefinition(config._l).weekdaysParse(input);
            // if we didn't get a weekday name, mark the date as invalid
            if (a != null) {
                config._w = config._w || {};
                config._w['d'] = a;
            } else {
                config._pf.invalidWeekday = input;
            }
            break;
        // WEEK, WEEK DAY - numeric
        case 'w':
        case 'ww':
        case 'W':
        case 'WW':
        case 'd':
        case 'e':
        case 'E':
            token = token.substr(0, 1);
            /* falls through */
        case 'gggg':
        case 'GGGG':
        case 'GGGGG':
            token = token.substr(0, 2);
            if (input) {
                config._w = config._w || {};
                config._w[token] = toInt(input);
            }
            break;
        case 'gg':
        case 'GG':
            config._w = config._w || {};
            config._w[token] = moment.parseTwoDigitYear(input);
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, lang;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = dfl(w.GG, config._a[YEAR], weekOfYear(moment(), 1, 4).year);
            week = dfl(w.W, 1);
            weekday = dfl(w.E, 1);
        } else {
            lang = getLangDefinition(config._l);
            dow = lang._week.dow;
            doy = lang._week.doy;

            weekYear = dfl(w.gg, config._a[YEAR], weekOfYear(moment(), dow, doy).year);
            week = dfl(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = dfl(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
        // Apply timezone offset from input. The actual zone can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() + config._tzm);
        }
    }

    function dateFromObject(config) {
        var normalizedInput;

        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];

        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {

        if (config._f === moment.ISO_8601) {
            parseISO(config);
            return;
        }

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var lang = getLangDefinition(config._l),
            string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, lang).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // handle am pm
        if (config._isPm && config._a[HOUR] < 12) {
            config._a[HOUR] += 12;
        }
        // if is 12 am, change hours to 0
        if (config._isPm === false && config._a[HOUR] === 12) {
            config._a[HOUR] = 0;
        }

        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = extend({}, config);
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function parseISO(config) {
        var i, l,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be "T" or undefined
                    config._f = isoDates[i][0] + (match[6] || " ");
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(parseTokenTimezone)) {
                config._f += "Z";
            }
            makeDateFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function makeDateFromString(config) {
        parseISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            moment.createFromInputFallback(config);
        }
    }

    function makeDateFromInput(config) {
        var input = config._i,
            matched = aspNetJsonRegex.exec(input);

        if (input === undefined) {
            config._d = new Date();
        } else if (matched) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = input.slice(0);
            dateFromConfig(config);
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof(input) === 'object') {
            dateFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            moment.createFromInputFallback(config);
        }
    }

    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, language) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = language.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
        return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(milliseconds, withoutSuffix, lang) {
        var seconds = round(Math.abs(milliseconds) / 1000),
            minutes = round(seconds / 60),
            hours = round(minutes / 60),
            days = round(hours / 24),
            years = round(days / 365),
            args = seconds < relativeTimeThresholds.s  && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < relativeTimeThresholds.m && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < relativeTimeThresholds.h && ['hh', hours] ||
                days === 1 && ['d'] ||
                days <= relativeTimeThresholds.dd && ['dd', days] ||
                days <= relativeTimeThresholds.dm && ['M'] ||
                days < relativeTimeThresholds.dy && ['MM', round(days / 30)] ||
                years === 1 && ['y'] || ['yy', years];
        args[2] = withoutSuffix;
        args[3] = milliseconds > 0;
        args[4] = lang;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Week of Year
    ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add('d', daysToDayOfWeek);
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;

        d = d === 0 ? 7 : d;
        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f;

        if (input === null || (format === undefined && input === '')) {
            return moment.invalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = getLangDefinition().preparse(input);
        }

        if (moment.isMoment(input)) {
            config = cloneMoment(input);

            config._d = new Date(+input._d);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        return new Moment(config);
    }

    moment = function (input, format, lang, strict) {
        var c;

        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = lang;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();

        return makeMoment(c);
    };

    moment.suppressDeprecationWarnings = false;

    moment.createFromInputFallback = deprecate(
            "moment construction falls back to js Date. This is " +
            "discouraged and will be removed in upcoming major " +
            "release. Please refer to " +
            "https://github.com/moment/moment/issues/1407 for more info.",
            function (config) {
        config._d = new Date(config._i);
    });

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return moment();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    moment.min = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    };

    moment.max = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    };

    // creating with utc
    moment.utc = function (input, format, lang, strict) {
        var c;

        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = lang;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return makeMoment(c).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            parseIso;

        if (moment.isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            parseIso = function (inp) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            };
            duration = {
                y: parseIso(match[2]),
                M: parseIso(match[3]),
                d: parseIso(match[4]),
                h: parseIso(match[5]),
                m: parseIso(match[6]),
                s: parseIso(match[7]),
                w: parseIso(match[8])
            };
        }

        ret = new Duration(duration);

        if (moment.isDuration(input) && input.hasOwnProperty('_lang')) {
            ret._lang = input._lang;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // constant that refers to the ISO standard
    moment.ISO_8601 = function () {};

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    moment.momentProperties = momentProperties;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () {};

    // This function allows you to set a threshold for relative time strings
    moment.relativeTimeThreshold = function(threshold, limit) {
      if (relativeTimeThresholds[threshold] === undefined) {
        return false;
      }
      relativeTimeThresholds[threshold] = limit;
      return true;
    };

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    moment.lang = function (key, values) {
        var r;
        if (!key) {
            return moment.fn._lang._abbr;
        }
        if (values) {
            loadLang(normalizeLanguage(key), values);
        } else if (values === null) {
            unloadLang(key);
            key = 'en';
        } else if (!languages[key]) {
            getLangDefinition(key);
        }
        r = moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);
        return r._abbr;
    };

    // returns language data
    moment.langData = function (key) {
        if (key && key._lang && key._lang._abbr) {
            key = key._lang._abbr;
        }
        return getLangDefinition(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null &&  obj.hasOwnProperty('_isAMomentObject'));
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function () {
        return moment.apply(null, arguments).parseZone();
    };

    moment.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    /************************************
        Moment Prototype
    ************************************/


    extend(moment.fn = Moment.prototype, {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d + ((this._offset || 0) * 60000);
        },

        unix : function () {
            return Math.floor(+this / 1000);
        },

        toString : function () {
            return this.clone().lang('en').format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
        },

        toDate : function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString : function () {
            var m = moment(this).utc();
            if (0 < m.year() && m.year() <= 9999) {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            } else {
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid : function () {
            return isValid(this);
        },

        isDSTShifted : function () {

            if (this._a) {
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }

            return false;
        },

        parsingFlags : function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc : function () {
            return this.zone(0);
        },

        local : function () {
            this.zone(0);
            this._isUTC = false;
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.lang().postformat(output);
        },

        add : function (input, val) {
            var dur;
            // switch args to support add('s', 1) and add(1, 's')
            if (typeof input === 'string' && typeof val === 'string') {
                dur = moment.duration(isNaN(+val) ? +input : +val, isNaN(+val) ? val : input);
            } else if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, 1);
            return this;
        },

        subtract : function (input, val) {
            var dur;
            // switch args to support subtract('s', 1) and subtract(1, 's')
            if (typeof input === 'string' && typeof val === 'string') {
                dur = moment.duration(isNaN(+val) ? +input : +val, isNaN(+val) ? val : input);
            } else if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, -1);
            return this;
        },

        diff : function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (this.zone() - that.zone()) * 6e4,
                diff, output;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month') {
                // average number of days in the months in the given dates
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                // difference in months
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                // adjust by taking difference in days, average number of days
                // and dst in the given months.
                output += ((this - moment(this).startOf('month')) -
                        (that - moment(that).startOf('month'))) / diff;
                // same as above but with zones, to negate all dst
                output -= ((this.zone() - moment(this).startOf('month').zone()) -
                        (that.zone() - moment(that).startOf('month').zone())) * 6e4 / diff;
                if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = (this - that);
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function (time) {
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're zone'd or not.
            var now = time || moment(),
                sod = makeAs(now, this).startOf('day'),
                diff = this.diff(sod, 'days', true),
                format = diff < -6 ? 'sameElse' :
                    diff < -1 ? 'lastWeek' :
                    diff < 0 ? 'lastDay' :
                    diff < 1 ? 'sameDay' :
                    diff < 2 ? 'nextDay' :
                    diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.lang().calendar(format, this));
        },

        isLeapYear : function () {
            return isLeapYear(this.year());
        },

        isDST : function () {
            return (this.zone() < this.clone().month(0).zone() ||
                this.zone() < this.clone().month(5).zone());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.lang());
                return this.add({ d : input - day });
            } else {
                return day;
            }
        },

        month : makeAccessor('Month', true),

        startOf: function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            } else if (units === 'isoWeek') {
                this.isoWeekday(1);
            }

            // quarters are also special
            if (units === 'quarter') {
                this.month(Math.floor(this.month() / 3) * 3);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            return this.startOf(units).add((units === 'isoWeek' ? 'week' : units), 1).subtract('ms', 1);
        },

        isAfter: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) > +moment(input).startOf(units);
        },

        isBefore: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) < +moment(input).startOf(units);
        },

        isSame: function (input, units) {
            units = units || 'ms';
            return +this.clone().startOf(units) === +makeAs(input, this).startOf(units);
        },

        min: deprecate(
                 "moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",
                 function (other) {
                     other = moment.apply(null, arguments);
                     return other < this ? this : other;
                 }
         ),

        max: deprecate(
                "moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",
                function (other) {
                    other = moment.apply(null, arguments);
                    return other > this ? this : other;
                }
        ),

        // keepTime = true means only change the timezone, without affecting
        // the local hour. So 5:31:26 +0300 --[zone(2, true)]--> 5:31:26 +0200
        // It is possible that 5:31:26 doesn't exist int zone +0200, so we
        // adjust the time as needed, to be valid.
        //
        // Keeping the time actually adds/subtracts (one hour)
        // from the actual represented time. That is why we call updateOffset
        // a second time. In case it wants us to change the offset again
        // _changeInProgress == true case, then we have to adjust, because
        // there is no such time in the given timezone.
        zone : function (input, keepTime) {
            var offset = this._offset || 0;
            if (input != null) {
                if (typeof input === "string") {
                    input = timezoneMinutesFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                this._offset = input;
                this._isUTC = true;
                if (offset !== input) {
                    if (!keepTime || this._changeInProgress) {
                        addOrSubtractDurationFromMoment(this,
                                moment.duration(offset - input, 'm'), 1, false);
                    } else if (!this._changeInProgress) {
                        this._changeInProgress = true;
                        moment.updateOffset(this, true);
                        this._changeInProgress = null;
                    }
                }
            } else {
                return this._isUTC ? offset : this._d.getTimezoneOffset();
            }
            return this;
        },

        zoneAbbr : function () {
            return this._isUTC ? "UTC" : "";
        },

        zoneName : function () {
            return this._isUTC ? "Coordinated Universal Time" : "";
        },

        parseZone : function () {
            if (this._tzm) {
                this.zone(this._tzm);
            } else if (typeof this._i === 'string') {
                this.zone(this._i);
            }
            return this;
        },

        hasAlignedHourOffset : function (input) {
            if (!input) {
                input = 0;
            }
            else {
                input = moment(input).zone();
            }

            return (this.zone() - input) % 60 === 0;
        },

        daysInMonth : function () {
            return daysInMonth(this.year(), this.month());
        },

        dayOfYear : function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add("d", (input - dayOfYear));
        },

        quarter : function (input) {
            return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
        },

        weekYear : function (input) {
            var year = weekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).year;
            return input == null ? year : this.add("y", (input - year));
        },

        isoWeekYear : function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add("y", (input - year));
        },

        week : function (input) {
            var week = this.lang().week(this);
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        isoWeek : function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        weekday : function (input) {
            var weekday = (this.day() + 7 - this.lang()._week.dow) % 7;
            return input == null ? weekday : this.add("d", input - weekday);
        },

        isoWeekday : function (input) {
            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },

        isoWeeksInYear : function () {
            return weeksInYear(this.year(), 1, 4);
        },

        weeksInYear : function () {
            var weekInfo = this._lang._week;
            return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set : function (units, value) {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                this[units](value);
            }
            return this;
        },

        // If passed a language key, it will set the language for this
        // instance.  Otherwise, it will return the language configuration
        // variables for this instance.
        lang : function (key) {
            if (key === undefined) {
                return this._lang;
            } else {
                this._lang = getLangDefinition(key);
                return this;
            }
        }
    });

    function rawMonthSetter(mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.lang().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(),
                daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function rawGetter(mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function rawSetter(mom, unit, value) {
        if (unit === 'Month') {
            return rawMonthSetter(mom, value);
        } else {
            return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    function makeAccessor(unit, keepTime) {
        return function (value) {
            if (value != null) {
                rawSetter(this, unit, value);
                moment.updateOffset(this, keepTime);
                return this;
            } else {
                return rawGetter(this, unit);
            }
        };
    }

    moment.fn.millisecond = moment.fn.milliseconds = makeAccessor('Milliseconds', false);
    moment.fn.second = moment.fn.seconds = makeAccessor('Seconds', false);
    moment.fn.minute = moment.fn.minutes = makeAccessor('Minutes', false);
    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    moment.fn.hour = moment.fn.hours = makeAccessor('Hours', true);
    // moment.fn.month is defined separately
    moment.fn.date = makeAccessor('Date', true);
    moment.fn.dates = deprecate("dates accessor is deprecated. Use date instead.", makeAccessor('Date', true));
    moment.fn.year = makeAccessor('FullYear', true);
    moment.fn.years = deprecate("years accessor is deprecated. Use year instead.", makeAccessor('FullYear', true));

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;
    moment.fn.quarters = moment.fn.quarter;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    /************************************
        Duration Prototype
    ************************************/


    extend(moment.duration.fn = Duration.prototype, {

        _bubble : function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years;

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absRound(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;

            hours = absRound(minutes / 60);
            data.hours = hours % 24;

            days += absRound(hours / 24);
            data.days = days % 30;

            months += absRound(days / 30);
            data.months = months % 12;

            years = absRound(months / 12);
            data.years = years;
        },

        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
              this._days * 864e5 +
              (this._months % 12) * 2592e6 +
              toInt(this._months / 12) * 31536e6;
        },

        humanize : function (withSuffix) {
            var difference = +this,
                output = relativeTime(difference, !withSuffix, this.lang());

            if (withSuffix) {
                output = this.lang().pastFuture(difference, output);
            }

            return this.lang().postformat(output);
        },

        add : function (input, val) {
            // supports only 2.0-style add(1, 's') or add(moment)
            var dur = moment.duration(input, val);

            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;

            this._bubble();

            return this;
        },

        subtract : function (input, val) {
            var dur = moment.duration(input, val);

            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;

            this._bubble();

            return this;
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as : function (units) {
            units = normalizeUnits(units);
            return this['as' + units.charAt(0).toUpperCase() + units.slice(1) + 's']();
        },

        lang : moment.fn.lang,

        toIsoString : function () {
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            var years = Math.abs(this.years()),
                months = Math.abs(this.months()),
                days = Math.abs(this.days()),
                hours = Math.abs(this.hours()),
                minutes = Math.abs(this.minutes()),
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);

            if (!this.asSeconds()) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            return (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (years ? years + 'Y' : '') +
                (months ? months + 'M' : '') +
                (days ? days + 'D' : '') +
                ((hours || minutes || seconds) ? 'T' : '') +
                (hours ? hours + 'H' : '') +
                (minutes ? minutes + 'M' : '') +
                (seconds ? seconds + 'S' : '');
        }
    });

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    function makeDurationAsGetter(name, factor) {
        moment.duration.fn['as' + name] = function () {
            return +this / factor;
        };
    }

    for (i in unitMillisecondFactors) {
        if (unitMillisecondFactors.hasOwnProperty(i)) {
            makeDurationAsGetter(i, unitMillisecondFactors[i]);
            makeDurationGetter(i.toLowerCase());
        }
    }

    makeDurationAsGetter('Weeks', 6048e5);
    moment.duration.fn.asMonths = function () {
        return (+this - this.years() * 31536e6) / 2592e6 + this.years() * 12;
    };


    /************************************
        Default Lang
    ************************************/


    // Set default language, other languages will inherit from English.
    moment.lang('en', {
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    /* EMBED_LANGUAGES */

    /************************************
        Exposing Moment
    ************************************/

    function makeGlobal(shouldDeprecate) {
        /*global ender:false */
        if (typeof ender !== 'undefined') {
            return;
        }
        oldGlobalMoment = globalScope.moment;
        if (shouldDeprecate) {
            globalScope.moment = deprecate(
                    "Accessing Moment through the global scope is " +
                    "deprecated, and will be removed in an upcoming " +
                    "release.",
                    moment);
        } else {
            globalScope.moment = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    } else if (typeof define === "function" && define.amd) {
        define("moment", function (require, exports, module) {
            if (module.config && module.config() && module.config().noGlobal === true) {
                // release the global variable
                globalScope.moment = oldGlobalMoment;
            }

            return moment;
        });
        makeGlobal(true);
    } else {
        makeGlobal();
    }
}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],15:[function(require,module,exports){
//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    any(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function(value, index, list) {
      return !predicate.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    var result = -Infinity, lastComputed = -Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed > lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    var result = Infinity, lastComputed = Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed < lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return value;
    return _.property(value);
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(array, predicate) {
    var pass = [], fail = [];
    each(array, function(elem) {
      (predicate(elem) ? pass : fail).push(elem);
    });
    return [pass, fail];
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.contains(other, item);
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function () {
      return value;
    };
  };

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    return function(obj) {
      if (obj === attrs) return true; //avoid comparing an object to itself.
      for (var key in attrs) {
        if (attrs[key] !== obj[key])
          return false;
      }
      return true;
    }
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() { return new Date().getTime(); };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);

},{}]},{},[13])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi91c3IvbG9jYWwvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcHZfc3lzX2Rldi9hcHAvZGlzcGxheV9zdmcuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcHZfc3lzX2Rldi9hcHAvbGF5ZXJzLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3B2X3N5c19kZXYvYXBwL21rX2RyYXdpbmcuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcHZfc3lzX2Rldi9hcHAvc2V0dGluZ3MuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcHZfc3lzX2Rldi9hcHAvc2V0dGluZ3NfZnVuY3Rpb25zLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3B2X3N5c19kZXYvYXBwL3VwZGF0ZV9zeXN0ZW0uanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcHZfc3lzX2Rldi9saWIvay9rLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3B2X3N5c19kZXYvbGliL2sva19ET00uanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcHZfc3lzX2Rldi9saWIvay9rX0RPTV9leHRyYS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wdl9zeXNfZGV2L2xpYi9rL2tfZGF0YS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wdl9zeXNfZGV2L2xpYi9rL2tvbnRhaW5lci5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wdl9zeXNfZGV2L2xpYi9rL3dyYXBwZXJfcHJvdG90eXBlLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3B2X3N5c19kZXYvbWFpbi5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wdl9zeXNfZGV2L25vZGVfbW9kdWxlcy9tb21lbnQvbW9tZW50LmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3B2X3N5c19kZXYvbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvdW5kZXJzY29yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdGlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwcUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcGpGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGxvZyA9IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XG4vL3ZhciBzZXR0aW5ncyA9IHJlcXVpcmUoJy4vc2V0dGluZ3MuanMnKTtcbi8vdmFyIHNuYXBzdmcgPSByZXF1aXJlKCdzbmFwc3ZnJyk7XG4vL2xvZyhzZXR0aW5ncyk7XG5cblxuXG52YXIgZGlzcGxheV9zdmcgPSBmdW5jdGlvbihzZXR0aW5ncywgY29udGFpbmVyKXtcbiAgICBsb2coJ2Rpc3BsYXlpbmcgc3ZnJyk7XG4gICAgdmFyIGxfYXR0ciA9IHNldHRpbmdzLmRyYXdpbmcubF9hdHRyO1xuICAgIHZhciBmb250cyA9IHNldHRpbmdzLmRyYXdpbmcuZm9udHM7XG4gICAgdmFyIGVsZW1lbnRzID0gc2V0dGluZ3MuZWxlbWVudHM7XG4gICAgLy9sb2coJ2VsZW1lbnRzOiAnLCBlbGVtZW50cyk7XG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIC8vY29udGFpbmVyLmVtcHR5KClcblxuICAgIC8vdmFyIHN2Z19lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ1N2Z2pzU3ZnMTAwMCcpXG4gICAgdmFyIHN2Z19lbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3N2ZycpO1xuICAgIHN2Z19lbGVtLnNldEF0dHJpYnV0ZSgnaWQnLCdzdmdfZHJhd2luZycpO1xuICAgIHN2Z19lbGVtLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBzZXR0aW5ncy5kcmF3aW5nLnNpemUuZHJhd2luZy53KTtcbiAgICBzdmdfZWxlbS5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHNldHRpbmdzLmRyYXdpbmcuc2l6ZS5kcmF3aW5nLmgpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzdmdfZWxlbSk7XG4gICAgLy92YXIgc3ZnID0gc25hcHN2ZyhzdmdfZWxlbSkuc2l6ZShzaXplLmRyYXdpbmcudywgc2l6ZS5kcmF3aW5nLmgpO1xuICAgIC8vdmFyIHN2ZyA9IHNuYXBzdmcoJyNzdmdfZHJhd2luZycpO1xuXG4gICAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgZHJhd2luZyBjb250ZW50cywgY2FsbCB0aGUgZnVuY3Rpb24gYmVsb3cuXG4gICAgZWxlbWVudHMuZm9yRWFjaCggZnVuY3Rpb24oZWxlbSxpZCkge1xuICAgICAgICBzaG93X2VsZW1fYXJyYXkoZWxlbSk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzaG93X2VsZW1fYXJyYXkoZWxlbSwgb2Zmc2V0KXtcbiAgICAgICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IHt4OjAseTowfTtcbiAgICAgICAgaWYoIHR5cGVvZiBlbGVtLnggIT09ICd1bmRlZmluZWQnICkgeyB2YXIgeCA9IGVsZW0ueCArIG9mZnNldC54OyB9IFxuICAgICAgICBpZiggdHlwZW9mIGVsZW0ueSAhPT0gJ3VuZGVmaW5lZCcgKSB7IHZhciB5ID0gZWxlbS55ICsgb2Zmc2V0Lnk7IH0gXG5cbiAgICAgICAgaWYoIGVsZW0udHlwZSA9PT0gJ3JlY3QnKSB7XG4gICAgICAgICAgICAvL3N2Zy5yZWN0KCBlbGVtLncsIGVsZW0uaCApLm1vdmUoIHgtZWxlbS53LzIsIHktZWxlbS5oLzIgKS5hdHRyKCBsX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApO1xuICAgICAgICAgICAgLy9sb2coJ2VsZW06JywgZWxlbSApO1xuICAgICAgICAgICAgLy9pZiggaXNOYU4oZWxlbS53KSApIHtcbiAgICAgICAgICAgIC8vICAgIGxvZygnZXJyb3I6IGVsZW0gbm90IGZ1bGx5IGRlZmluZWQnLCBlbGVtKVxuICAgICAgICAgICAgLy8gICAgZWxlbS53ID0gMTA7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIC8vaWYoIGlzTmFOKGVsZW0uaCkgKSB7XG4gICAgICAgICAgICAvLyAgICBsb2coJ2Vycm9yOiBlbGVtIG5vdCBmdWxseSBkZWZpbmVkJywgZWxlbSlcbiAgICAgICAgICAgIC8vICAgIGVsZW0uaCA9IDEwO1xuICAgICAgICAgICAgLy99XG4gICAgICAgICAgICB2YXIgciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdyZWN0Jyk7XG4gICAgICAgICAgICByLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBlbGVtLncpO1xuICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGVsZW0uaCk7XG4gICAgICAgICAgICByLnNldEF0dHJpYnV0ZSgneCcsIHgtZWxlbS53LzIpO1xuICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoJ3knLCB5LWVsZW0uaC8yKTtcbiAgICAgICAgICAgIHZhciBhdHRyID0gbF9hdHRyW2VsZW0ubGF5ZXJfbmFtZV07XG4gICAgICAgICAgICBmb3IoIHZhciBpMiBpbiBhdHRyICl7XG4gICAgICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoaTIsIGF0dHJbaTJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN2Z19lbGVtLmFwcGVuZENoaWxkKHIpO1xuICAgICAgICB9IGVsc2UgaWYoIGVsZW0udHlwZSA9PT0gJ2xpbmUnKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnRzMiA9IFtdO1xuICAgICAgICAgICAgZWxlbS5wb2ludHMuZm9yRWFjaCggZnVuY3Rpb24ocG9pbnQpe1xuICAgICAgICAgICAgICAgIGlmKCAhIGlzTmFOKHBvaW50WzBdKSAmJiAhIGlzTmFOKHBvaW50WzFdKSApe1xuICAgICAgICAgICAgICAgICAgICBwb2ludHMyLnB1c2goWyBwb2ludFswXStvZmZzZXQueCwgcG9pbnRbMV0rb2Zmc2V0LnkgXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nKCdlcnJvcjogZWxlbSBub3QgZnVsbHkgZGVmaW5lZCcsIGVsZW0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL3N2Zy5wb2x5bGluZSggcG9pbnRzMiApLmF0dHIoIGxfYXR0cltlbGVtLmxheWVyX25hbWVdICk7XG5cbiAgICAgICAgICAgIHZhciBsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3BvbHlsaW5lJyk7XG4gICAgICAgICAgICBsLnNldEF0dHJpYnV0ZSggJ3BvaW50cycsIHBvaW50czIuam9pbignICcpICk7XG4gICAgICAgICAgICB2YXIgYXR0ciA9IGxfYXR0cltlbGVtLmxheWVyX25hbWVdO1xuICAgICAgICAgICAgZm9yKCB2YXIgaTIgaW4gYXR0ciApe1xuICAgICAgICAgICAgICAgIGwuc2V0QXR0cmlidXRlKGkyLCBhdHRyW2kyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdmdfZWxlbS5hcHBlbmRDaGlsZChsKTtcbiAgICAgICAgfSBlbHNlIGlmKCBlbGVtLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICAgICAgLy92YXIgdCA9IHN2Zy50ZXh0KCBlbGVtLnN0cmluZ3MgKS5tb3ZlKCBlbGVtLnBvaW50c1swXVswXSwgZWxlbS5wb2ludHNbMF1bMV0gKS5hdHRyKCBsX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApXG4gICAgICAgICAgICB2YXIgZm9udCA9IGZvbnRzW2VsZW0uZm9udF07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3RleHQnKTtcbiAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCd4JywgeCk7XG4gICAgICAgICAgICAvL3Quc2V0QXR0cmlidXRlKCd5JywgeSArIGZvbnRbJ2ZvbnQtc2l6ZSddLzIgKTtcbiAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCd5JywgeSApO1xuICAgICAgICAgICAgaWYoZWxlbS5yb3RhdGVkKXtcbiAgICAgICAgICAgICAgICAvL3Quc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCBcInJvdGF0ZShcIiArIGVsZW0ucm90YXRlZCArIFwiIFwiICsgeCArIFwiIFwiICsgeSArIFwiKVwiICk7XG4gICAgICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsIFwicm90YXRlKFwiICsgZWxlbS5yb3RhdGVkICsgXCIgXCIgKyB4ICsgXCIgXCIgKyB5ICsgXCIpXCIgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciggdmFyIGkyIGluIGxfYXR0cltlbGVtLmxheWVyX25hbWVdICl7XG4gICAgICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoIGkyLCBsX2F0dHJbZWxlbS5sYXllcl9uYW1lXVtpMl0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciggdmFyIGkyIGluIGZvbnQgKXtcbiAgICAgICAgICAgICAgICB0LnNldEF0dHJpYnV0ZSggaTIsIGZvbnRbaTJdICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IoIHZhciBpMiBpbiBlbGVtLnN0cmluZ3MgKXtcbiAgICAgICAgICAgICAgICB2YXIgdHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAndHNwYW4nKTtcbiAgICAgICAgICAgICAgICB0c3Bhbi5zZXRBdHRyaWJ1dGUoJ2R5JywgZm9udFsnZm9udC1zaXplJ10qMS41KmkyICk7XG4gICAgICAgICAgICAgICAgdHNwYW4uc2V0QXR0cmlidXRlKCd4JywgeCk7XG4gICAgICAgICAgICAgICAgdHNwYW4uaW5uZXJIVE1MID0gZWxlbS5zdHJpbmdzW2kyXTtcbiAgICAgICAgICAgICAgICB0LmFwcGVuZENoaWxkKHRzcGFuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN2Z19lbGVtLmFwcGVuZENoaWxkKHQpO1xuICAgICAgICB9IGVsc2UgaWYoIGVsZW0udHlwZSA9PT0gJ2NpcmMnKSB7XG4gICAgICAgICAgICB2YXIgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdlbGxpcHNlJyk7XG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZSgncngnLCBlbGVtLmQvMik7XG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZSgncnknLCBlbGVtLmQvMik7XG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZSgnY3gnLCB4KTtcbiAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKCdjeScsIHkpO1xuICAgICAgICAgICAgdmFyIGF0dHIgPSBsX2F0dHJbZWxlbS5sYXllcl9uYW1lXTtcbiAgICAgICAgICAgIGZvciggdmFyIGkyIGluIGF0dHIgKXtcbiAgICAgICAgICAgICAgICBjLnNldEF0dHJpYnV0ZShpMiwgYXR0cltpMl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3ZnX2VsZW0uYXBwZW5kQ2hpbGQoYyk7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgYy5hdHRyaWJ1dGVzKCBsX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApXG4gICAgICAgICAgICBjLmF0dHJpYnV0ZXMoe1xuICAgICAgICAgICAgICAgIHJ4OiA1LFxuICAgICAgICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgcnk6IDUsXG4gICAgICAgICAgICAgICAgY3g6IGVsZW0ucG9pbnRzWzBdWzBdLWVsZW0uZC8yLFxuICAgICAgICAgICAgICAgIGN5OiBlbGVtLnBvaW50c1swXVsxXS1lbGVtLmQvMlxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHZhciBjMiA9IHN2Zy5lbGxpcHNlKCBlbGVtLnIsIGVsZW0uciApXG4gICAgICAgICAgICBjMi5tb3ZlKCBlbGVtLnBvaW50c1swXVswXS1lbGVtLmQvMiwgZWxlbS5wb2ludHNbMF1bMV0tZWxlbS5kLzIgKVxuICAgICAgICAgICAgYzIuYXR0cih7cng6NSwgcnk6NX0pXG4gICAgICAgICAgICBjMi5hdHRyKCBsX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApXG4gICAgICAgICAgICAqL1xuICAgICAgICB9IGVsc2UgaWYoZWxlbS50eXBlID09PSAnYmxvY2snKSB7XG4gICAgICAgICAgICAvLyBpZiBpdCBpcyBhIGJsb2NrLCBydW4gdGhpcyBmdW5jdGlvbiB0aHJvdWdoIGVhY2ggZWxlbWVudC5cbiAgICAgICAgICAgIGVsZW0uZWxlbWVudHMuZm9yRWFjaCggZnVuY3Rpb24oYmxvY2tfZWxlbSxpZCl7XG4gICAgICAgICAgICAgICAgc2hvd19lbGVtX2FycmF5KGJsb2NrX2VsZW0sIHt4OngsIHk6eX0pIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZGlzcGxheV9zdmc7XG5cbiIsInZhciBsX2F0dHIgPSB7fTtcblxubF9hdHRyLmJhc2UgPSB7XG4gICAgJ2ZpbGwnOiAnbm9uZScsXG4gICAgJ3N0cm9rZSc6JyMwMDAwMDAnLFxuICAgICdzdHJva2Utd2lkdGgnOicxcHgnLFxuICAgICdzdHJva2UtbGluZWNhcCc6J2J1dHQnLFxuICAgICdzdHJva2UtbGluZWpvaW4nOidtaXRlcicsXG4gICAgJ3N0cm9rZS1vcGFjaXR5JzoxLFxuXG59O1xubF9hdHRyLmJsb2NrID0gT2JqZWN0LmNyZWF0ZShsX2F0dHIuYmFzZSk7XG5sX2F0dHIuZnJhbWUgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5mcmFtZS5zdHJva2UgPSAnIzAwMDA0Mic7XG5sX2F0dHIudGFibGUgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci50YWJsZS5zdHJva2UgPSAnIzAwMDA0Mic7XG5cbmxfYXR0ci5EQ19wb3MgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5EQ19wb3Muc3Ryb2tlID0gJyNmZjAwMDAnO1xubF9hdHRyLkRDX25lZyA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xubF9hdHRyLkRDX25lZy5zdHJva2UgPSAnIzAwMDAwMCc7XG5sX2F0dHIuRENfZ3JvdW5kID0gT2JqZWN0LmNyZWF0ZShsX2F0dHIuYmFzZSk7XG5sX2F0dHIuRENfZ3JvdW5kLnN0cm9rZSA9ICcjMDA2NjAwJztcbmxfYXR0ci5tb2R1bGUgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5ib3ggPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci50ZXh0ID0gT2JqZWN0LmNyZWF0ZShsX2F0dHIuYmFzZSk7XG5sX2F0dHIudGV4dC5zdHJva2UgPSAnIzAwMDBmZic7XG5sX2F0dHIudGVybWluYWwgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcblxubF9hdHRyLkFDX2dyb3VuZCA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xubF9hdHRyLkFDX2dyb3VuZC5zdHJva2UgPSAnR3JlZW4nO1xubF9hdHRyLkFDX25ldXRyYWwgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5BQ19uZXV0cmFsLnN0cm9rZSA9ICdHcmF5JztcbmxfYXR0ci5BQ19MMSA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xubF9hdHRyLkFDX0wxLnN0cm9rZSA9ICdCbGFjayc7XG5sX2F0dHIuQUNfTDIgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5BQ19MMi5zdHJva2UgPSAnUmVkJztcbmxfYXR0ci5BQ19MMyA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xubF9hdHRyLkFDX0wzLnN0cm9rZSA9ICdCbHVlJztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGxfYXR0cjtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBsb2cgPSBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xudmFyIGsgPSByZXF1aXJlKCcuLi9saWIvay9rLmpzJyk7XG4vL3ZhciBzZXR0aW5ncyA9IHJlcXVpcmUoJy4vc2V0dGluZ3MuanMnKTtcbi8vdmFyIGxfYXR0ciA9IHNldHRpbmdzLmRyYXdpbmcubF9hdHRyO1xudmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG4vL2xvZygnc2V0dGluZ3MnLCBzZXR0aW5ncyk7XG4vLyBzZXR1cCBkcmF3aW5nIGNvbnRhaW5lcnNcbnZhciBsX2F0dHIgPSByZXF1aXJlKCcuL2xheWVycycpO1xuXG52YXIgZWxlbWVudHMgPSBbXTtcblxuXG5cbi8vIEJMT0NLU1xuXG52YXIgQmxrID0ge1xuICAgIHR5cGU6ICdibG9jaycsXG59O1xuQmxrLm1vdmUgPSBmdW5jdGlvbih4LCB5KXtcbiAgICBmb3IoIHZhciBpIGluIHRoaXMuZWxlbWVudHMgKXtcbiAgICAgICAgdGhpcy5lbGVtZW50c1tpXS5tb3ZlKHgseSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbkJsay5hZGQgPSBmdW5jdGlvbigpe1xuICAgIGlmKCB0eXBlb2YgdGhpcy5lbGVtZW50cyA9PSAndW5kZWZpbmVkJyl7IHRoaXMuZWxlbWVudHMgPSBbXTt9XG4gICAgZm9yKCB2YXIgaSBpbiBhcmd1bWVudHMpe1xuICAgICAgICB0aGlzLmVsZW1lbnRzLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuQmxrLnJvdGF0ZSA9IGZ1bmN0aW9uKGRlZyl7XG4gICAgdGhpcy5yb3RhdGUgPSBkZWc7XG59O1xuXG52YXIgYmxvY2tzID0ge307XG52YXIgYmxvY2tfYWN0aXZlID0gZmFsc2U7XG4vLyBDcmVhdGUgZGVmYXVsdCBsYXllcixibG9jayBjb250YWluZXIgYW5kIGZ1bmN0aW9uc1xuXG4vLyBMYXllcnNcblxudmFyIGxheWVyX2FjdGl2ZSA9IGZhbHNlO1xuXG52YXIgbGF5ZXIgPSBmdW5jdGlvbihuYW1lKXsgLy8gc2V0IGN1cnJlbnQgbGF5ZXJcbiAgICBpZiggdHlwZW9mIG5hbWUgPT09ICd1bmRlZmluZWQnICl7IC8vIGlmIG5vIGxheWVyIG5hbWUgZ2l2ZW4sIHJlc2V0IHRvIGRlZmF1bHQgXG4gICAgICAgIGxheWVyX2FjdGl2ZSA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoICEgKG5hbWUgaW4gbF9hdHRyKSApIHtcbiAgICAgICAgbG9nKCdFcnJvcjogdW5rbm93biBsYXllciwgdXNpbmcgYmFzZScpO1xuICAgICAgICBsYXllcl9hY3RpdmUgPSAnYmFzZScgO1xuICAgIH0gZWxzZSB7IC8vIGZpbmFseSBhY3RpdmF0ZSByZXF1ZXN0ZWQgbGF5ZXJcbiAgICAgICAgbGF5ZXJfYWN0aXZlID0gbmFtZTtcbiAgICB9XG4gICAgLy8qL1xufTtcblxuLypcbnZhciBibG9jayA9IGZ1bmN0aW9uKG5hbWUpIHsvLyBzZXQgY3VycmVudCBibG9ja1xuICAgIC8vIGlmIGN1cnJlbnQgYmxvY2sgaGFzIGJlZW4gdXNlZCwgc2F2ZSBpdCBiZWZvcmUgY3JlYXRpbmcgYSBuZXcgb25lLlxuICAgIGlmKCBibG9ja3NbYmxvY2tfYWN0aXZlXS5sZW5ndGggPiAwICkgeyBibG9ja3MucHVzaChibG9ja3NbYmxvY2tfYWN0aXZlXSk7IH1cbiAgICBpZiggdHlwZW9mIG5hbWUgIT09ICd1bmRlZmluZWQnICl7IC8vIGlmIG5hbWUgYXJndW1lbnQgaXMgc3VibWl0dGVkLCBjcmVhdGUgbmV3IGJsb2NrXG4gICAgICAgIHZhciBibGsgPSBPYmplY3QuY3JlYXRlKEJsayk7XG4gICAgICAgIGJsay5uYW1lID0gbmFtZTsgLy8gYmxvY2sgbmFtZVxuICAgICAgICBibG9ja3NbYmxvY2tfYWN0aXZlXSA9IGJsaztcbiAgICB9IGVsc2UgeyAvLyBlbHNlIHVzZSBkZWZhdWx0IGJsb2NrXG4gICAgICAgIGJsb2Nrc1tibG9ja19hY3RpdmVdID0gYmxvY2tzWzBdO1xuICAgIH1cbn1cbmJsb2NrKCdkZWZhdWx0Jyk7IC8vIHNldCBjdXJyZW50IGJsb2NrIHRvIGRlZmF1bHRcbiovXG52YXIgYmxvY2tfc3RhcnQgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgaWYoIHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJyApeyAvLyBpZiBuYW1lIGFyZ3VtZW50IGlzIHN1Ym1pdHRlZFxuICAgICAgICBsb2coJ0Vycm9yOiBuYW1lIHJlcXVpcmVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVE9ETzogV2hhdCBpZiB0aGUgc2FtZSBuYW1lIGlzIHN1Ym1pdHRlZCB0d2ljZT8gdGhyb3cgZXJyb3Igb3IgZml4P1xuICAgICAgICBibG9ja19hY3RpdmUgPSBuYW1lO1xuICAgICAgICBpZiggdHlwZW9mIGJsb2Nrc1tibG9ja19hY3RpdmVdICE9PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICB2YXIgYmxrID0gT2JqZWN0LmNyZWF0ZShCbGspO1xuICAgICAgICAgICAgLy9ibGsubmFtZSA9IG5hbWU7IC8vIGJsb2NrIG5hbWVcbiAgICAgICAgICAgIGJsb2Nrc1tibG9ja19hY3RpdmVdID0gYmxrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBibGs7XG4gICAgfVxufTtcblxuICAgIC8qXG4gICAgeCA9IGxvYy53aXJlX3RhYmxlLnggLSB3LzI7XG4gICAgeSA9IGxvYy53aXJlX3RhYmxlLnkgLSBoLzI7XG4gICAgaWYoIHR5cGVvZiBsYXllcl9uYW1lICE9PSAndW5kZWZpbmVkJyAmJiAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICkge1xuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSBsYXllcnNbbGF5ZXJfbmFtZV1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiggISAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICl7IGxvZyhcImVycm9yLCBsYXllciBkb2VzIG5vdCBleGlzdCwgdXNpbmcgY3VycmVudFwiKTt9XG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9ICBsYXllcl9hY3RpdmVcbiAgICB9XG4gICAgKi9cbnZhciBibG9ja19lbmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYmxrID0gYmxvY2tzW2Jsb2NrX2FjdGl2ZV07XG4gICAgYmxvY2tfYWN0aXZlID0gZmFsc2U7XG4gICAgcmV0dXJuIGJsaztcbn07XG5cblxuXG4vLyBjbGVhciBkcmF3aW5nIFxudmFyIGNsZWFyX2RyYXdpbmcgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IoIHZhciBpZCBpbiBibG9ja3MgKXtcbiAgICAgICAgaWYoIGJsb2Nrcy5oYXNPd25Qcm9wZXJ0eShpZCkpe1xuICAgICAgICAgICAgZGVsZXRlIGJsb2Nrc1tpZF07IFxuICAgICAgICB9XG4gICAgfVxuICAgIGVsZW1lbnRzLmxlbmd0aCA9IDA7XG59O1xuXG5cbi8vLy8vL1xuLy8gYnVpbGQgcHJvdG90eXBlIGVsZW1lbnRcblxuICAgIC8qXG4gICAgaWYoIHR5cGVvZiBsYXllcl9uYW1lICE9PSAndW5kZWZpbmVkJyAmJiAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICkge1xuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSBsYXllcnNbbGF5ZXJfbmFtZV1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiggISAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICl7IGxvZyhcImVycm9yLCBsYXllciBkb2VzIG5vdCBleGlzdCwgdXNpbmcgY3VycmVudFwiKTt9XG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9ICBsYXllcl9hY3RpdmVcbiAgICB9XG4gICAgKi9cblxuXG52YXIgU3ZnRWxlbSA9IHtcbiAgICBvYmplY3Q6ICdTdmdFbGVtJ1xufTtcblN2Z0VsZW0ubW92ZSA9IGZ1bmN0aW9uKHgsIHkpe1xuICAgIGlmKCB0eXBlb2YgdGhpcy5wb2ludHMgIT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgIGZvciggdmFyIGkgaW4gdGhpcy5wb2ludHMgKSB7XG4gICAgICAgICAgICB0aGlzLnBvaW50c1tpXVswXSArPSB4O1xuICAgICAgICAgICAgdGhpcy5wb2ludHNbaV1bMV0gKz0geTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5TdmdFbGVtLnJvdGF0ZSA9IGZ1bmN0aW9uKGRlZyl7XG4gICAgdGhpcy5yb3RhdGVkID0gZGVnO1xufTtcblxuLy8vLy8vL1xuLy8gZnVuY3Rpb25zIGZvciBhZGRpbmcgZWxlbWVudHNcblxudmFyIGFkZCA9IGZ1bmN0aW9uKHR5cGUsIHBvaW50cywgbGF5ZXJfbmFtZSkge1xuXG4gICAgaWYoIHR5cGVvZiBsYXllcl9uYW1lID09PSAndW5kZWZpbmVkJyApIHsgbGF5ZXJfbmFtZSA9IGxheWVyX2FjdGl2ZTsgfSBcbiAgICBpZiggISAobGF5ZXJfbmFtZSBpbiBsX2F0dHIpICkgeyBcbiAgICAgICAgbG9nKCdMYXllciBuYW1lIG5vdCBmb3VuZCwgdXNpbmcgYmFzZScpO1xuICAgICAgICBsYXllcl9uYW1lID0gJ2Jhc2UnOyBcbiAgICB9XG5cbiAgICBpZiggdHlwZW9mIHBvaW50cyA9PSAnc3RyaW5nJykge1xuICAgICAgICB2YXIgcG9pbnRzID0gcG9pbnRzLnNwbGl0KCcgJyk7XG4gICAgICAgIGZvciggdmFyIGkgaW4gcG9pbnRzICkge1xuICAgICAgICAgICAgcG9pbnRzW2ldID0gcG9pbnRzW2ldLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICBmb3IoIHZhciBjIGluIHBvaW50c1tpXSApIHtcbiAgICAgICAgICAgICAgICBwb2ludHNbaV1bY10gPSBOdW1iZXIocG9pbnRzW2ldW2NdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBlbGVtID0gT2JqZWN0LmNyZWF0ZShTdmdFbGVtKTtcbiAgICBlbGVtLnR5cGUgPSB0eXBlO1xuICAgIGVsZW0ubGF5ZXJfbmFtZSA9IGxheWVyX25hbWU7XG4gICAgaWYoIHR5cGUgPT09ICdsaW5lJyApIHtcbiAgICAgICAgZWxlbS5wb2ludHMgPSBwb2ludHM7XG4gICAgfSBlbHNlIGlmKCB0eXBlb2YgcG9pbnRzWzBdLnggPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGVsZW0ueCA9IHBvaW50c1swXVswXTsgXG4gICAgICAgIGVsZW0ueSA9IHBvaW50c1swXVsxXTsgXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbS54ID0gcG9pbnRzWzBdLng7XG4gICAgICAgIGVsZW0ueSA9IHBvaW50c1swXS55OyBcbiAgICB9XG5cbiAgICBcbiAgICBpZihibG9ja19hY3RpdmUpIHsgXG4gICAgICAgIGJsb2Nrc1tibG9ja19hY3RpdmVdLmFkZChlbGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50cy5wdXNoKGVsZW0pO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtO1xufTtcblxudmFyIGxpbmUgPSBmdW5jdGlvbihwb2ludHMsIGxheWVyKXsgLy8gKHBvaW50cywgW2xheWVyXSlcbiAgICAvL3JldHVybiBhZGQoJ2xpbmUnLCBwb2ludHMsIGxheWVyKVxuICAgIHZhciBsaW5lID0gIGFkZCgnbGluZScsIHBvaW50cywgbGF5ZXIpO1xuICAgIHJldHVybiBsaW5lO1xufTtcblxudmFyIHJlY3QgPSBmdW5jdGlvbihsb2MsIHNpemUsIGxheWVyKXtcbiAgICB2YXIgcmVjID0gYWRkKCdyZWN0JywgW2xvY10sIGxheWVyKTtcbiAgICByZWMudyA9IHNpemVbMF07XG4gICAgLypcbiAgICBpZiggdHlwZW9mIGxheWVyX25hbWUgIT09ICd1bmRlZmluZWQnICYmIChsYXllcl9uYW1lIGluIGxheWVycykgKSB7XG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9IGxheWVyc1tsYXllcl9uYW1lXVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCAhIChsYXllcl9uYW1lIGluIGxheWVycykgKXsgbG9nKFwiZXJyb3IsIGxheWVyIGRvZXMgbm90IGV4aXN0LCB1c2luZyBjdXJyZW50XCIpO31cbiAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gIGxheWVyX2FjdGl2ZVxuICAgIH1cbiAgICAqL1xuICAgIHJlYy5oID0gc2l6ZVsxXTtcbiAgICByZXR1cm4gcmVjO1xufTtcblxudmFyIGNpcmMgPSBmdW5jdGlvbihsb2MsIGRpYW1ldGVyLCBsYXllcil7XG4gICAgdmFyIGNpciA9IGFkZCgnY2lyYycsIFtsb2NdLCBsYXllcik7XG4gICAgY2lyLmQgPSBkaWFtZXRlcjtcbiAgICByZXR1cm4gY2lyO1xufTtcblxudmFyIHRleHQgPSBmdW5jdGlvbihsb2MsIHN0cmluZ3MsIGZvbnQsIGxheWVyKXtcbiAgICB2YXIgdHh0ID0gYWRkKCd0ZXh0JywgW2xvY10sIGxheWVyKTtcbiAgICBpZiggdHlwZW9mIHN0cmluZ3MgPT0gJ3N0cmluZycpe1xuICAgICAgICBzdHJpbmdzID0gW3N0cmluZ3NdO1xuICAgIH1cbiAgICB0eHQuc3RyaW5ncyA9IHN0cmluZ3M7XG4gICAgdHh0LmZvbnQgPSBmb250O1xuICAgIHJldHVybiB0eHQ7XG59O1xuXG52YXIgYmxvY2sgPSBmdW5jdGlvbihuYW1lKSB7Ly8gc2V0IGN1cnJlbnQgYmxvY2tcbiAgICBpZiggYXJndW1lbnRzLmxlbmd0aCA9PT0gMiApeyAvLyBpZiBjb29yIGlzIHBhc3NlZFxuICAgICAgICBpZiggdHlwZW9mIGFyZ3VtZW50c1sxXS54ICE9PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgdmFyIHggPSBhcmd1bWVudHNbMV0ueDtcbiAgICAgICAgICAgIHZhciB5ID0gYXJndW1lbnRzWzFdLnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgeCA9IGFyZ3VtZW50c1sxXVswXTtcbiAgICAgICAgICAgIHZhciB5ID0gYXJndW1lbnRzWzFdWzFdO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmKCBhcmd1bWVudHMubGVuZ3RoID09PSAzICl7IC8vIGlmIHgseSBpcyBwYXNzZWRcbiAgICAgICAgdmFyIHggPSBhcmd1bWVudHNbMV07XG4gICAgICAgIHZhciB5ID0gYXJndW1lbnRzWzJdO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHdoYXQgaWYgYmxvY2sgZG9lcyBub3QgZXhpc3Q/IHByaW50IGxpc3Qgb2YgYmxvY2tzP1xuICAgIHZhciBibGsgPSBPYmplY3QuY3JlYXRlKGJsb2Nrc1tuYW1lXSk7XG4gICAgYmxrLnggPSB4O1xuICAgIGJsay55ID0geTtcblxuICAgIGlmKGJsb2NrX2FjdGl2ZSl7IFxuICAgICAgICBibG9ja3NbYmxvY2tfYWN0aXZlXS5hZGQoYmxrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50cy5wdXNoKGJsayk7XG4gICAgICAgIGxfYXR0ci5BQ19ncm91bmQgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbiAgICAgICAgbF9hdHRyLkFDX2dyb3VuZC5zdHJva2UgPSAnIzAwNjYwMCc7XG5cbiAgICB9XG4gICAgcmV0dXJuIGJsaztcbn07XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG52YXIgbWtfZHJhd2luZyA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICBzZXR0aW5ncy5kcmF3aW5nLmxfYXR0ciA9IGxfYXR0cjtcbiAgICAvL3ZhciBjb21wb25lbnRzID0gc2V0dGluZ3MuY29tcG9uZW50cztcbiAgICAvL3ZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG4gICAgdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcbiAgICAvL2xvZygnLS0tc2V0dGluZ3MtLS0nLCBzZXR0aW5ncyk7XG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmcuc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZy5sb2M7XG5cblxuICAgIGNsZWFyX2RyYXdpbmcoKTtcblxuICAgIHZhciB4LCB5LCBoLCB3O1xuXG5cbi8vIERlZmluZSBibG9ja3Ncbi8vIG1vZHVsZSBibG9ja1xuICAgIHcgPSBzaXplLm1vZHVsZS5mcmFtZS53O1xuICAgIGggPSBzaXplLm1vZHVsZS5mcmFtZS5oO1xuXG4gICAgYmxvY2tfc3RhcnQoJ21vZHVsZScpO1xuXG4gICAgLy8gZnJhbWVcbiAgICBsYXllcignbW9kdWxlJyk7XG4gICAgcmVjdCggWzAsaC8yXSwgW3csaF0gKTtcbiAgICAvLyBmcmFtZSB0cmlhbmdsZT9cbiAgICBsaW5lKFtcbiAgICAgICAgWy13LzIsMF0sXG4gICAgICAgIFswLHcvMl0sXG4gICAgXSk7XG4gICAgbGluZShbXG4gICAgICAgIFswLHcvMl0sXG4gICAgICAgIFt3LzIsMF0sXG4gICAgXSk7XG4gICAgLy8gbGVhZHNcbiAgICBsYXllcignRENfcG9zJyk7XG4gICAgbGluZShbXG4gICAgICAgIFswLCAwXSxcbiAgICAgICAgWzAsIC1zaXplLm1vZHVsZS5sZWFkXVxuICAgIF0pO1xuICAgIGxheWVyKCdEQ19uZWcnKTtcbiAgICBsaW5lKFtcbiAgICAgICAgWzAsIGhdLFxuICAgICAgICBbMCwgaCsoc2l6ZS5tb2R1bGUubGVhZCldXG4gICAgXSk7XG4gICAgLy8gcG9zIHNpZ25cbiAgICBsYXllcigndGV4dCcpO1xuICAgIHRleHQoXG4gICAgICAgIFtzaXplLm1vZHVsZS5sZWFkLzIsIC1zaXplLm1vZHVsZS5sZWFkLzJdLFxuICAgICAgICAnKycsXG4gICAgICAgICdzaWducydcbiAgICApO1xuICAgIC8vIG5lZyBzaWduXG4gICAgdGV4dChcbiAgICAgICAgW3NpemUubW9kdWxlLmxlYWQvMiwgaCtzaXplLm1vZHVsZS5sZWFkLzJdLFxuICAgICAgICAnLScsXG4gICAgICAgICdzaWducydcbiAgICApO1xuICAgIC8vIGdyb3VuZFxuICAgIGxheWVyKCdEQ19ncm91bmQnKTtcbiAgICBsaW5lKFtcbiAgICAgICAgWy13LzIsIGgvMl0sXG4gICAgICAgIFstdy8yLXcvNCwgaC8yXSxcbiAgICBdKTtcblxuICAgIGxheWVyKCk7XG4gICAgYmxvY2tfZW5kKCk7XG5cbi8vI3N0cmluZ1xuICAgIGJsb2NrX3N0YXJ0KCdzdHJpbmcnKTtcblxuICAgIHggPSAwO1xuICAgIHkgPSAwO1xuXG4gICAgeSArPSBzaXplLm1vZHVsZS5sZWFkOyBcblxuICAgIC8vVE9ETzogYWRkIGxvb3AgdG8ganVtcCBvdmVyIG5lZ2F0aXZlIHJldHVybiB3aXJlcyBcbiAgICBsYXllcignRENfZ3JvdW5kJyk7XG4gICAgbGluZShbXG4gICAgICAgIFt4LXNpemUubW9kdWxlLmZyYW1lLncqMy80LCB5K3NpemUubW9kdWxlLmZyYW1lLmgvMl0sXG4gICAgICAgIFt4LXNpemUubW9kdWxlLmZyYW1lLncqMy80LCB5K3NpemUuc3RyaW5nLmggKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCArIHNpemUubW9kdWxlLmxlYWQqMC41IF0sXG4gICAgXSk7XG4gICAgbGF5ZXIoKTtcblxuICAgIGJsb2NrKCdtb2R1bGUnLCBbeCx5XSk7XG4gICAgeSArPSBzaXplLm1vZHVsZS5mcmFtZS5oICsgc2l6ZS5tb2R1bGUubGVhZCoyICsgc2l6ZS5zdHJpbmcuZ2FwX21pc3Npbmc7XG4gICAgYmxvY2soJ21vZHVsZScsIFt4LHldKTtcbiAgICB5ICs9IHNpemUubW9kdWxlLmZyYW1lLmggKyBzaXplLm1vZHVsZS5sZWFkKjIgKyBzaXplLnN0cmluZy5nYXA7XG4gICAgYmxvY2soJ21vZHVsZScsIFt4LHldKTtcbiAgICB5ICs9IHNpemUubW9kdWxlLmZyYW1lLmggKyBzaXplLm1vZHVsZS5sZWFkKjIgKyBzaXplLnN0cmluZy5nYXA7XG4gICAgYmxvY2soJ21vZHVsZScsIFt4LHldKTtcblxuICAgIGJsb2NrX2VuZCgpO1xuXG5cbi8vIHRlcm1pbmFsXG4gICAgYmxvY2tfc3RhcnQoJ3Rlcm1pbmFsJyk7XG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG5cbiAgICBsYXllcigndGVybWluYWwnKTtcbiAgICBjaXJjKFxuICAgICAgICBbeCx5XSxcbiAgICAgICAgc2l6ZS50ZXJtaW5hbF9kaWFtXG4gICAgKTtcbiAgICBsYXllcigpO1xuICAgIGJsb2NrX2VuZCgpO1xuXG4vLyBmdXNlXG5cbiAgICBibG9ja19zdGFydCgnZnVzZScpO1xuICAgIHggPSAwO1xuICAgIHkgPSAwO1xuICAgIHcgPSAxMDtcbiAgICBoID0gNTtcblxuICAgIGxheWVyKCd0ZXJtaW5hbCcpO1xuICAgIHJlY3QoXG4gICAgICAgIFt4LHldLFxuICAgICAgICBbdyxoXVxuICAgICk7XG4gICAgbGluZSggW1xuICAgICAgICBbdy8yLHldLFxuICAgICAgICBbdy8yK3NpemUuZnVzZS53LCB5XVxuICAgIF0pO1xuICAgIGJsb2NrKCd0ZXJtaW5hbCcsIFtzaXplLmZ1c2UudywgeV0gKTtcblxuICAgIGxpbmUoIFtcbiAgICAgICAgWy13LzIseV0sXG4gICAgICAgIFstdy8yLXNpemUuZnVzZS53LCB5XVxuICAgIF0pO1xuICAgIGJsb2NrKCd0ZXJtaW5hbCcsIFstc2l6ZS5mdXNlLncsIHldICk7XG5cbiAgICBsYXllcigpO1xuICAgIGJsb2NrX2VuZCgpO1xuXG4vLyBncm91bmQgc3ltYm9sXG4gICAgYmxvY2tfc3RhcnQoJ2dyb3VuZCcpO1xuICAgIHggPSAwO1xuICAgIHkgPSAwO1xuXG4gICAgbGF5ZXIoJ0FDX2dyb3VuZCcpXG4gICAgbGluZShbXG4gICAgICAgIFt4LHldLFxuICAgICAgICBbeCx5KzQwXSxcbiAgICBdKVxuICAgIHkgKz0gMjU7XG4gICAgbGluZShbXG4gICAgICAgIFt4LTcuNSx5XSxcbiAgICAgICAgW3grNy41LHldLFxuICAgIF0pXG4gICAgeSArPSA1O1xuICAgIGxpbmUoW1xuICAgICAgICBbeC01LHldLFxuICAgICAgICBbeCs1LHldLFxuICAgIF0pXG4gICAgeSArPSA1O1xuICAgIGxpbmUoW1xuICAgICAgICBbeC0yLjUseV0sXG4gICAgICAgIFt4KzIuNSx5XSxcbiAgICBdKVxuICAgIGxheWVyKCk7XG5cbiAgICBibG9ja19lbmQoKTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gRnJhbWVcblxuICAgIHcgPSBzaXplLmRyYXdpbmcudztcbiAgICBoID0gc2l6ZS5kcmF3aW5nLmg7XG4gICAgdmFyIHBhZGRpbmcgPSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZzsgXG5cbiAgICBsYXllcignZnJhbWUnKTtcblxuICAgIC8vYm9yZGVyXG4gICAgcmVjdCggW3cvMiAsIGgvMl0sIFt3IC0gcGFkZGluZyoyLCBoIC0gcGFkZGluZyoyIF0gKTtcbiAgICBcbiAgICB4ID0gdyAtIHBhZGRpbmcgKiAzO1xuICAgIHkgPSBwYWRkaW5nICogMztcblxuICAgIHcgPSBzaXplLmRyYXdpbmcudGl0bGVib3g7XG4gICAgaCA9IHNpemUuZHJhd2luZy50aXRsZWJveDtcblxuICAgIC8vIGJveCB0b3AtcmlnaHRcbiAgICByZWN0KCBbeC13LzIsIHkraC8yXSwgW3csaF0gKTtcbiAgICBcbiAgICB5ICs9IGggKyBwYWRkaW5nOyBcblxuICAgIHcgPSBzaXplLmRyYXdpbmcudGl0bGVib3g7XG4gICAgaCA9IHNpemUuZHJhd2luZy5oIC0gcGFkZGluZyo4IC0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94KjIuNTtcbiAgICBcbiAgICAvL3RpdGxlIGJveFxuICAgIHJlY3QoIFt4LXcvMiwgeStoLzJdLCBbdyxoXSApO1xuXG4gICAgdmFyIHRpdGxlID0ge307XG4gICAgdGl0bGUudG9wID0geTtcbiAgICB0aXRsZS5ib3R0b20gPSB5K2g7XG4gICAgdGl0bGUucmlnaHQgPSB4O1xuICAgIHRpdGxlLmxlZnQgPSB4LXcgO1xuXG5cbiAgICAvLyBib3ggYm90dG9tLXJpZ2h0XG4gICAgaCA9IHNpemUuZHJhd2luZy50aXRsZWJveCAqIDEuNTtcbiAgICB5ID0gdGl0bGUuYm90dG9tICsgcGFkZGluZzsgXG4gICAgcmVjdCggW3gtdy8yLCB5K2gvMl0sIFt3LGhdICk7XG4gICAgXG4gICAgdmFyIHBhZ2UgPSB7fTtcbiAgICBwYWdlLnJpZ2h0ID0gdGl0bGUucmlnaHQ7XG4gICAgcGFnZS5sZWZ0ID0gdGl0bGUubGVmdDtcbiAgICBwYWdlLnRvcCA9IHRpdGxlLmJvdHRvbSArIHBhZGRpbmc7XG4gICAgcGFnZS5ib3R0b20gPSBwYWdlLnRvcCArIHNpemUuZHJhd2luZy50aXRsZWJveCoxLjU7XG4gICAgLy8gVGV4dFxuXG4gICAgeCA9IHRpdGxlLmxlZnQgKyBwYWRkaW5nO1xuICAgIHkgPSB0aXRsZS5ib3R0b20gLSBwYWRkaW5nO1xuXG4gICAgeCArPSAxMDtcbiAgICB0ZXh0KFt4LHldLCBcbiAgICAgICAgIFsgc3lzdGVtLmludmVydGVyLm1ha2UgKyBcIiBcIiArIHN5c3RlbS5pbnZlcnRlci5tb2RlbCArIFwiIEludmVydGVyIFN5c3RlbVwiIF0sXG4gICAgICAgICd0aXRsZTEnLCAndGV4dCcpLnJvdGF0ZSgtOTApO1xuXG4gICAgeCArPSAxNDtcbiAgICBpZiggdHlwZW9mIHN5c3RlbS5EQy5tb2R1bGUuc3BlY3MgIT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgIHRleHQoW3gseV0sIFtcbiAgICAgICAgICAgIHN5c3RlbS5EQy5tb2R1bGUuc3BlY3MuTWFrZSArIFwiIFwiICsgc3lzdGVtLkRDLm1vZHVsZS5zcGVjcy5Nb2RlbCArIFxuICAgICAgICAgICAgICAgIFwiIChcIiArIHN5c3RlbS5EQy5zdHJpbmdfbnVtICArIFwiIHN0cmluZ3Mgb2YgXCIgKyBzeXN0ZW0uREMuc3RyaW5nX21vZHVsZXMgKyBcIiBtb2R1bGVzIClcIlxuICAgICAgICBdLCAndGl0bGUyJywgJ3RleHQnKS5yb3RhdGUoLTkwKTtcbiAgICB9XG4gICAgICAgIFxuICAgIHggPSBwYWdlLmxlZnQgKyBwYWRkaW5nO1xuICAgIHkgPSBwYWdlLnRvcCArIHBhZGRpbmc7XG4gICAgeSArPSBzaXplLmRyYXdpbmcudGl0bGVib3ggKiAxLjUgKiAzLzQ7XG5cblxuICAgIHRleHQoW3gseV0sXG4gICAgICAgIFsnUFYxJ10sXG4gICAgICAgICdwYWdlJywgJ3RleHQnKTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8jYXJyYXlcbiAgICAvLyBQViBhcnJheVxuXG5cbiAgICB4ID0gbG9jLmFycmF5Lng7XG4gICAgeSA9IGxvYy5hcnJheS55O1xuXG5cbiAgICB4IC09IHNpemUubW9kdWxlLmZyYW1lLmgqMztcbiAgICB5IC09IHNpemUuc3RyaW5nLmgvMjtcblxuICAgIGZvciggdmFyIGk9MDsgaTxzeXN0ZW0uREMuc3RyaW5nX251bTsgaSsrICkge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gaSAqIHNpemUud2lyZV9vZmZzZXQuYmFzZTtcbiAgICAgICAgXG4gICAgICAgIGJsb2NrKCdzdHJpbmcnLCBbeCx5XSk7XG4gICAgICAgIC8vIHBvc2l0aXZlIGhvbWUgcnVuXG4gICAgICAgIGxheWVyKCdEQ19wb3MnKTtcbiAgICAgICAgbGluZShbXG4gICAgICAgICAgICBbIHggLCBsb2MuYXJyYXkudXBwZXIgXSxcbiAgICAgICAgICAgIFsgeCAsIGxvYy5hcnJheS51cHBlci1zaXplLm1vZHVsZS53LW9mZnNldCBdLFxuICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrb2Zmc2V0ICwgbG9jLmFycmF5LnVwcGVyLXNpemUubW9kdWxlLnctb2Zmc2V0IF0sXG4gICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtvZmZzZXQgLCBsb2MuYXJyYXkueS1zaXplLm1vZHVsZS53LW9mZnNldF0sXG4gICAgICAgICAgICBbIGxvYy5hcnJheS54ICwgbG9jLmFycmF5Lnktc2l6ZS5tb2R1bGUudy1vZmZzZXRdLFxuICAgICAgICBdKTtcblxuICAgICAgICAvLyBuZWdhdGl2ZSBob21lIHJ1blxuICAgICAgICBsYXllcignRENfbmVnJyk7XG4gICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgWyB4ICwgbG9jLmFycmF5Lmxvd2VyIF0sXG4gICAgICAgICAgICBbIHggLCBsb2MuYXJyYXkubG93ZXIrc2l6ZS5tb2R1bGUudytvZmZzZXQgXSxcbiAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K29mZnNldCAsIGxvYy5hcnJheS5sb3dlcitzaXplLm1vZHVsZS53K29mZnNldCBdLFxuICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrb2Zmc2V0ICwgbG9jLmFycmF5Lnkrc2l6ZS5tb2R1bGUudytvZmZzZXRdLFxuICAgICAgICAgICAgWyBsb2MuYXJyYXkueCAsIGxvYy5hcnJheS55K3NpemUubW9kdWxlLncrb2Zmc2V0XSxcbiAgICAgICAgXSk7XG5cbiAgICAgICAgeCAtPSBzaXplLnN0cmluZy53O1xuICAgIH1cblxuICAgIGxheWVyKCdEQ19ncm91bmQnKTtcbiAgICBsaW5lKFtcbiAgICAgICAgWyBsb2MuYXJyYXkubGVmdCAsIGxvYy5hcnJheS5sb3dlciArIHNpemUubW9kdWxlLncgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCAsIGxvYy5hcnJheS5sb3dlciArIHNpemUubW9kdWxlLncgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCAsIGxvYy5hcnJheS55ICsgc2l6ZS5tb2R1bGUudyArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAgICAgWyBsb2MuYXJyYXkueCAsIGxvYy5hcnJheS55K3NpemUubW9kdWxlLncrc2l6ZS53aXJlX29mZnNldC5ncm91bmRdLFxuICAgIF0pO1xuXG4gICAgbGF5ZXIoKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBjb21iaW5lciBib3hcbiAgICB4ID0gbG9jLmFycmF5Lng7XG4gICAgeSA9IGxvYy5hcnJheS55O1xuXG4gICAgdmFyIHRvX2Rpc2Nvbm5lY3RfeCA9IDE1MDtcbiAgICB2YXIgdG9fZGlzY29ubmVjdF95ID0gLTEwMDtcblxuICAgIFxuICAgIHJlY3QoXG4gICAgICAgIFt4K3NpemUuamJfYm94LncvMix5LXNpemUuamJfYm94LmgvMTBdLFxuICAgICAgICBbc2l6ZS5qYl9ib3gudyxzaXplLmpiX2JveC5oXSxcbiAgICAgICAgJ2JveCdcbiAgICApO1xuXG5cbiAgICBmb3IoIHZhciBpIGluIF8ucmFuZ2Uoc3lzdGVtLkRDLnN0cmluZ19udW0pKSB7XG4gICAgICAgIHZhciBvZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0LmdhcCArICggaSAqIHNpemUud2lyZV9vZmZzZXQuYmFzZSApO1xuXG4gICAgICAgIGxheWVyKCdEQ19wb3MnKTtcbiAgICAgICAgbGluZShbXG4gICAgICAgICAgICBbIHggLCB5LW9mZnNldF0sXG4gICAgICAgICAgICBbIHgrKHNpemUuamJfYm94LncpLzIgLCB5LW9mZnNldF0sXG4gICAgICAgIF0pO1xuICAgICAgICBibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgeDogeCsoc2l6ZS5qYl9ib3gudykvMixcbiAgICAgICAgICAgIHk6IHktb2Zmc2V0LFxuICAgICAgICB9KTtcbiAgICAgICAgbGluZShbXG4gICAgICAgICAgICBbIHgrKHNpemUuamJfYm94LncpLzIgLCB5LW9mZnNldF0sXG4gICAgICAgICAgICBbIHgrc2l6ZS5qYl9ib3gudyt0b19kaXNjb25uZWN0X3gtb2Zmc2V0ICwgeS1vZmZzZXRdLFxuICAgICAgICAgICAgWyB4K3NpemUuamJfYm94LncrdG9fZGlzY29ubmVjdF94LW9mZnNldCAsIHkrdG9fZGlzY29ubmVjdF95LXNpemUudGVybWluYWxfZGlhbV0sXG4gICAgICAgICAgICBbIHgrc2l6ZS5qYl9ib3gudyt0b19kaXNjb25uZWN0X3gtb2Zmc2V0ICwgeSt0b19kaXNjb25uZWN0X3ktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgXSk7XG4gICAgICAgIGJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICB4OiB4K3NpemUuamJfYm94LncrdG9fZGlzY29ubmVjdF94LW9mZnNldCxcbiAgICAgICAgICAgIHk6IHkrdG9fZGlzY29ubmVjdF95LXNpemUudGVybWluYWxfZGlhbVxuICAgICAgICB9KTtcblxuICAgICAgICBsYXllcignRENfbmVnJyk7XG4gICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgWyB4LCB5K29mZnNldF0sXG4gICAgICAgICAgICBbIHgrc2l6ZS5qYl9ib3gudy8yLXNpemUuZnVzZS53LzIgLCB5K29mZnNldF0sXG4gICAgICAgIF0pO1xuICAgICAgICBibG9jayggJ2Z1c2UnLCB7XG4gICAgICAgICAgICB4OiB4K3NpemUuamJfYm94LncvMiAsXG4gICAgICAgICAgICB5OiB5K29mZnNldCxcbiAgICAgICAgfSk7XG4gICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgWyB4K3NpemUuamJfYm94LncvMitzaXplLmZ1c2Uudy8yICwgeStvZmZzZXRdLFxuICAgICAgICAgICAgWyB4K3NpemUuamJfYm94LncrdG9fZGlzY29ubmVjdF94K29mZnNldCAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgIFsgeCtzaXplLmpiX2JveC53K3RvX2Rpc2Nvbm5lY3RfeCtvZmZzZXQgLCB5K3RvX2Rpc2Nvbm5lY3RfeS1zaXplLnRlcm1pbmFsX2RpYW1dLFxuICAgICAgICAgICAgWyB4K3NpemUuamJfYm94LncrdG9fZGlzY29ubmVjdF94K29mZnNldCAsIHkrdG9fZGlzY29ubmVjdF95LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgIF0pO1xuICAgICAgICBibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgeDogeCtzaXplLmpiX2JveC53K3RvX2Rpc2Nvbm5lY3RfeCtvZmZzZXQsXG4gICAgICAgICAgICB5OiB5K3RvX2Rpc2Nvbm5lY3RfeS1zaXplLnRlcm1pbmFsX2RpYW1cbiAgICAgICAgfSk7XG4gICAgICAgIGxheWVyKCk7XG4gICAgfVxuXG4gICAgLy9sYXllcignRENfZ3JvdW5kJyk7XG4gICAgLy9saW5lKFtcbiAgICAvLyAgICBbIGxvYy5hcnJheS5sZWZ0ICwgbG9jLmFycmF5Lmxvd2VyICsgc2l6ZS5tb2R1bGUudyArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgLy8gICAgWyBsb2MuYXJyYXkucmlnaHQrc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLCBsb2MuYXJyYXkubG93ZXIgKyBzaXplLm1vZHVsZS53ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAvLyAgICBbIGxvYy5hcnJheS5yaWdodCtzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCAsIGxvYy5hcnJheS55ICsgc2l6ZS5tb2R1bGUudyArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAvLyAgICBbIGxvYy5hcnJheS54ICwgbG9jLmFycmF5Lnkrc2l6ZS5tb2R1bGUudytzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZF0sXG4gICAgLy9dKTtcblxuICAgIC8vbGF5ZXIoKTtcblxuICAgIC8vIEdyb3VuZFxuICAgIG9mZnNldCA9IHNpemUud2lyZV9vZmZzZXQuZ2FwICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQ7XG5cbiAgICBsYXllcignRENfZ3JvdW5kJyk7XG4gICAgbGluZShbXG4gICAgICAgIFsgeCAsIHkrb2Zmc2V0XSxcbiAgICAgICAgWyB4KyhzaXplLmpiX2JveC53KS8yICwgeStvZmZzZXRdLFxuICAgIF0pO1xuICAgIGJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgIHg6IHgrKHNpemUuamJfYm94LncpLzIsXG4gICAgICAgIHk6IHkrb2Zmc2V0LFxuICAgIH0pO1xuICAgIGxpbmUoW1xuICAgICAgICBbIHgrKHNpemUuamJfYm94LncpLzIgLCB5K29mZnNldF0sXG4gICAgICAgIFsgeCtzaXplLmpiX2JveC53K3RvX2Rpc2Nvbm5lY3RfeCtvZmZzZXQgLCB5K29mZnNldF0sXG4gICAgICAgIFsgeCtzaXplLmpiX2JveC53K3RvX2Rpc2Nvbm5lY3RfeCtvZmZzZXQgLCB5K3RvX2Rpc2Nvbm5lY3RfeS1zaXplLnRlcm1pbmFsX2RpYW1dLFxuICAgICAgICBbIHgrc2l6ZS5qYl9ib3gudyt0b19kaXNjb25uZWN0X3grb2Zmc2V0ICwgeSt0b19kaXNjb25uZWN0X3ktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICBdKTtcbiAgICBibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICB4OiB4K3NpemUuamJfYm94LncrdG9fZGlzY29ubmVjdF94K29mZnNldCxcbiAgICAgICAgeTogeSt0b19kaXNjb25uZWN0X3ktc2l6ZS50ZXJtaW5hbF9kaWFtXG4gICAgfSk7XG4gICAgbGF5ZXIoKTtcblxuXG4gICAgeCArPSBzaXplLmpiX2JveC53O1xuXG4gICAgeCArPSB0b19kaXNjb25uZWN0X3g7XG4gICAgeSArPSB0b19kaXNjb25uZWN0X3k7XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBEQyBkaXNjb25lY3QgY29tYmluZXIgbGluZXNcbiAgICBpZiggc3lzdGVtLkRDLnN0cmluZ19udW0gPiAxKXtcbiAgICAgICAgdmFyIG9mZnNldF9taW4gPSBzaXplLndpcmVfb2Zmc2V0LmdhcDtcbiAgICAgICAgdmFyIG9mZnNldF9tYXggPSBzaXplLndpcmVfb2Zmc2V0LmdhcCArICggKHN5c3RlbS5EQy5zdHJpbmdfbnVtLTEpICogc2l6ZS53aXJlX29mZnNldC5iYXNlICk7XG4gICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgWyB4LW9mZnNldF9taW4sIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIFsgeC1vZmZzZXRfbWF4ICwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICBdLCAnRENfcG9zJyk7XG4gICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgWyB4K29mZnNldF9taW4sIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIFsgeCtvZmZzZXRfbWF4LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgIF0sICdEQ19uZWcnKTtcbiAgICB9XG4gICAgXG4gICAgLy8gSW52ZXJ0ZXIgY29uZWN0aW9uXG4gICAgLy9saW5lKFtcbiAgICAvLyAgICBbIHgtb2Zmc2V0X21pbiwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgIC8vICAgIFsgeC1vZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgLy9dLCdEQ19wb3MnKTtcblxuICAgIG9mZnNldCA9IG9mZnNldF9tYXggLSBvZmZzZXRfbWluICsgc2l6ZS50ZXJtaW5hbF9kaWFtLzI7XG4gICAgLy9vZmZzZXQgPSBvZmZzZXRfbWF4IC0gb2Zmc2V0X21pbjtcblxuICAgIC8vIG5lZ1xuICAgIGxpbmUoW1xuICAgICAgICBbIHgrb2Zmc2V0LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgIFsgeCtvZmZzZXQsIGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSBdLFxuICAgIF0sJ0RDX25lZycpXG4gICAgYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgeDogeCtvZmZzZXQsXG4gICAgICAgIHk6IGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSxcbiAgICB9KTtcblxuICAgIC8vIHBvc1xuICAgIGxpbmUoW1xuICAgICAgICBbIHgtb2Zmc2V0LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgIFsgeC1vZmZzZXQsIGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSBdLFxuICAgIF0sJ0RDX3BvcycpXG4gICAgYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgeDogeC1vZmZzZXQsXG4gICAgICAgIHk6IGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSxcbiAgICB9KTtcblxuICAgIC8vIGdyb3VuZFxuICAgIG9mZnNldCA9IHNpemUud2lyZV9vZmZzZXQuZ2FwICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQ7XG4gICAgbGluZShbXG4gICAgICAgIFsgeCtvZmZzZXQsIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgWyB4K29mZnNldCwgbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtIF0sXG4gICAgXSwnRENfZ3JvdW5kJylcbiAgICBibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICB4OiB4K29mZnNldCxcbiAgICAgICAgeTogbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtLFxuICAgIH0pO1xuXG4gICAgLy8gREMgZGlzY29uZWN0XG4gICAgcmVjdChcbiAgICAgICAgW3gsIHktc2l6ZS5kaXNjYm94LmgvMl0sXG4gICAgICAgIFtzaXplLmRpc2Nib3gudyxzaXplLmRpc2Nib3guaF0sXG4gICAgICAgICdib3gnXG4gICAgKTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8jaW52ZXJ0ZXJcbiAgICB4ID0gbG9jLmludmVydGVyLng7XG4gICAgeSA9IGxvYy5pbnZlcnRlci55O1xuXG5cbiAgICAvL2ZyYW1lXG4gICAgbGF5ZXIoJ2JveCcpO1xuICAgIHJlY3QoXG4gICAgICAgIFt4LHldLFxuICAgICAgICBbc2l6ZS5pbnZlcnRlci53LCBzaXplLmludmVydGVyLmhdXG4gICAgKTtcbiAgICAvLyBMYWJlbCBhdCB0b3AgKEludmVydGVyLCBtYWtlLCBtb2RlbCwgLi4uKVxuICAgIGxheWVyKCd0ZXh0Jyk7XG4gICAgdGV4dChcbiAgICAgICAgW2xvYy5pbnZlcnRlci54LCBsb2MuaW52ZXJ0ZXIudG9wICsgc2l6ZS5pbnZlcnRlci50ZXh0X2dhcCBdLFxuICAgICAgICBbICdJbnZlcnRlcicsIHNldHRpbmdzLnN5c3RlbS5pbnZlcnRlci5tYWtlICsgXCIgXCIgKyBzZXR0aW5ncy5zeXN0ZW0uaW52ZXJ0ZXIubW9kZWwgXSxcbiAgICAgICAgJ2xhYmVsJ1xuICAgICk7XG4gICAgbGF5ZXIoKTtcblxuLy8jaW52ZXJ0ZXIgc3ltYm9sXG5cbiAgICB4ID0gbG9jLmludmVydGVyLng7XG4gICAgeSA9IGxvYy5pbnZlcnRlci55O1xuICAgIFxuICAgIHZhciB3ID0gc2l6ZS5pbnZlcnRlci5zeW1ib2xfdztcbiAgICB2YXIgaCA9IHNpemUuaW52ZXJ0ZXIuc3ltYm9sX2g7XG5cbiAgICB2YXIgc3BhY2UgPSB3KjEvMTI7XG5cbiAgICAvLyBJbnZlcnRlciBzeW1ib2xcbiAgICBsYXllcignYm94Jyk7XG5cbiAgICAvLyBib3hcbiAgICByZWN0KFxuICAgICAgICBbeCx5XSxcbiAgICAgICAgW3csIGhdXG4gICAgKTtcbiAgICAvLyBkaWFnYW5hbFxuICAgIGxpbmUoW1xuICAgICAgICBbeC13LzIsIHkraC8yXSxcbiAgICAgICAgW3grdy8yLCB5LWgvMl0sXG4gICAgXG4gICAgXSk7XG4gICAgLy8gRENcbiAgICBsaW5lKFtcbiAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSwgXG4gICAgICAgICAgICB5IC0gaC8yICsgc3BhY2VdLFxuICAgICAgICBbeCAtIHcvMiArIHNwYWNlKjYsIFxuICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlXSxcbiAgICBdKTtcbiAgICBsaW5lKFtcbiAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSwgXG4gICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIFt4IC0gdy8yICsgc3BhY2UqMiwgXG4gICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgXSk7XG4gICAgbGluZShbXG4gICAgICAgIFt4IC0gdy8yICsgc3BhY2UqMywgXG4gICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNCwgXG4gICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgXSk7XG4gICAgbGluZShbXG4gICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNSwgXG4gICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNiwgXG4gICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgXSk7XG5cbiAgICAvLyBBQ1xuICAgIGxpbmUoW1xuICAgICAgICBbeCArIHcvMiAtIHNwYWNlLCBcbiAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjIsIFxuICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgXSk7XG4gICAgbGluZShbXG4gICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqMywgXG4gICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSo0LCBcbiAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgIF0pO1xuICAgIGxpbmUoW1xuICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjUsIFxuICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqNiwgXG4gICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICBdKTtcbiAgICBsYXllcigpO1xuICAgICAgICBcblxuXG5cblxuXG4vLyNBQ19kaXNjY29uZWN0XG4gICAgeCA9IGxvYy5BQ19kaXNjLng7XG4gICAgeSA9IGxvYy5BQ19kaXNjLnk7XG4gICAgcGFkZGluZyA9IHNpemUudGVybWluYWxfZGlhbTtcblxuICAgIGxheWVyKCdib3gnKTtcbiAgICByZWN0KFxuICAgICAgICBbeCwgeV0sXG4gICAgICAgIFtzaXplLkFDX2Rpc2Mudywgc2l6ZS5BQ19kaXNjLmhdXG4gICAgKTtcbiAgICBsYXllcigpO1xuXG5cbi8vbG9nKCdzaXplOicsIFtoLHddKVxuLy9sb2coJ2xvY2F0aW9uOicsIFt4LHldKVxuLy9jaXJjKFt4LHldLDUpO1xuXG5cblxuLy8jQUMgbG9hZCBjZW50ZXJcbiAgICB2YXIgYm90dG9tID0gbG9jLkFDX2xvYWRjZW50ZXIud2lyZV9idW5kbGVfYm90dG9tOyAgICBcbiAgICB2YXIgYnJlYWtlcl9zcGFjaW5nID0gbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMuc3BhY2luZztcblxuICAgIHggPSBsb2MuQUNfbG9hZGNlbnRlci54O1xuICAgIHkgPSBsb2MuQUNfbG9hZGNlbnRlci55O1xuICAgIHcgPSBzaXplLkFDX2xvYWRjZW50ZXIudztcbiAgICBoID0gc2l6ZS5BQ19sb2FkY2VudGVyLmg7XG5cbiAgICByZWN0KFt4LHldLFxuICAgICAgICBbdyxoXSxcbiAgICAgICAgJ2JveCdcbiAgICApO1xuXG4gICAgdGV4dChbeCx5LWgqMC40XSxcbiAgICAgICAgW3N5c3RlbS5BQ19sb2FkY2VudGVyX3R5cGUsICdMb2FkIENlbnRlciddLFxuICAgICAgICAnbGFiZWwnLFxuICAgICAgICAndGV4dCdcbiAgICApO1xuICAgIHcgPSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci53O1xuICAgIGggPSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci5oO1xuXG4gICAgeSAtPSBzaXplLkFDX2xvYWRjZW50ZXIuaC80ICsgc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIuaDtcblxuICAgIHBhZGRpbmcgPSBsb2MuQUNfbG9hZGNlbnRlci54IC0gbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMubGVmdCAtIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyLnc7XG5cbiAgICBmb3IoIHZhciBpPTA7IGk8MjA7IGkrKyl7XG4gICAgICAgIFxuICAgICAgICByZWN0KFt4LXBhZGRpbmctdy8yLHldLFt3LGhdLCdib3gnKTtcbiAgICAgICAgcmVjdChbeCtwYWRkaW5nK3cvMix5XSxbdyxoXSwnYm94Jyk7XG4gICAgXG4gICAgICAgIHkgKz0gYnJlYWtlcl9zcGFjaW5nO1xuICAgIH1cblxuICAgIHZhciBzLCBsO1xuICAgIFxuICAgIGwgPSBsb2MuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyO1xuICAgIHMgPSBzaXplLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhcjtcbiAgICByZWN0KFtsLngsbC55XSwgW3MudyxzLmhdLCAnQUNfbmV1dHJhbCcgKTtcblxuICAgIGwgPSBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXI7XG4gICAgcyA9IHNpemUuQUNfbG9hZGNlbnRlci5ncm91bmRiYXI7XG4gICAgcmVjdChbbC54LGwueV0sIFtzLncscy5oXSwgJ0FDX2dyb3VuZCcgKTtcblxuICAgIGJsb2NrKCdncm91bmQnLCBbbC54LGwueStzLmgvMl0pO1xuXG5cblxuLy8gQUMgbGluZXNcblxuICAgIHggPSBsb2MuaW52ZXJ0ZXIuYm90dG9tX3JpZ2h0Lng7XG4gICAgeSA9IGxvYy5pbnZlcnRlci5ib3R0b21fcmlnaHQueTtcbiAgICB4IC09IHNpemUudGVybWluYWxfZGlhbSAqIChzeXN0ZW0uQUNfY29uZHVjdG9ycy5sZW5ndGgrMyk7XG4gICAgeSAtPSBzaXplLnRlcm1pbmFsX2RpYW07XG5cbiAgICAvL3ZhciBBQ19sYXllcl9uYW1lcyA9IFsnQUNfZ3JvdW5kJywgJ0FDX25ldXRyYWwnLCAnQUNfTDEnLCAnQUNfTDInLCAnQUNfTDInXTtcblxuICAgIC8vbG9nKHN5c3RlbS5BQ19jb25kdWN0b3JzLmxlbmd0aClcblxuICAgIGZvciggdmFyIGk9MDsgaSA8IHN5c3RlbS5BQ19jb25kdWN0b3JzLmxlbmd0aDsgaSsrICl7XG4gICAgICAgIGJsb2NrKCd0ZXJtaW5hbCcsIFt4LHldICk7XG4gICAgICAgIGxheWVyKCdBQ18nK3N5c3RlbS5BQ19jb25kdWN0b3JzW2ldKTtcbiAgICAgICAgbGluZShbXG4gICAgICAgICAgICBbeCwgeV0sXG4gICAgICAgICAgICBbeCwgbG9jLkFDX2Rpc2MuYm90dG9tIC0gc2l6ZS50ZXJtaW5hbF9kaWFtICogKGkrMSkgXSxcbiAgICAgICAgICAgIFtsb2MuQUNfZGlzYy5sZWZ0LCBsb2MuQUNfZGlzYy5ib3R0b20gLSBzaXplLnRlcm1pbmFsX2RpYW0gKiAoaSsxKSBdLFxuICAgICAgICBdKTtcbiAgICAgICAgeCArPSBzaXplLnRlcm1pbmFsX2RpYW07XG4gICAgfVxuICAgIGxheWVyKCk7XG5cbiAgICB4ID0gbG9jLkFDX2Rpc2MueDtcbiAgICB5ID0gbG9jLkFDX2Rpc2MueTtcbiAgICBwYWRkaW5nID0gc2l6ZS50ZXJtaW5hbF9kaWFtO1xuXG4gICAgeCAtPSBzaXplLkFDX2Rpc2Mudy8yO1xuICAgIHkgKz0gc2l6ZS5BQ19kaXNjLmgvMjtcblxuICAgIHkgLT0gcGFkZGluZztcblxuICAgIGlmKCBzeXN0ZW0uQUNfY29uZHVjdG9ycy5pbmRleE9mKCdncm91bmQnKSsxICkge1xuICAgICAgICBsYXllcignQUNfZ3JvdW5kJyk7XG4gICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgW3gseV0sXG4gICAgICAgICAgICBbIHgrc2l6ZS5BQ19kaXNjLncrcGFkZGluZyozLCB5IF0sXG4gICAgICAgICAgICBbIHgrc2l6ZS5BQ19kaXNjLncrcGFkZGluZyozLCBib3R0b20gXSxcbiAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIubGVmdCtwYWRkaW5nKjIsIGJvdHRvbSBdLFxuICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5sZWZ0K3BhZGRpbmcqMiwgeSBdLFxuICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueC1wYWRkaW5nLCB5IF0sXG4gICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci54LXBhZGRpbmcsIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci55K3NpemUuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIuaC8yIF0sXG4gICAgICAgIF0pO1xuICAgIH1cblxuICAgIGlmKCBzeXN0ZW0uQUNfY29uZHVjdG9ycy5pbmRleE9mKCduZXV0cmFsJykrMSApIHtcbiAgICAgICAgeSAtPSBwYWRkaW5nO1xuICAgICAgICBsYXllcignQUNfbmV1dHJhbCcpO1xuICAgICAgICBsaW5lKFtcbiAgICAgICAgICAgIFt4LHldLFxuICAgICAgICAgICAgWyB4K3NpemUuQUNfZGlzYy53LXBhZGRpbmcqMSwgeSBdLFxuICAgICAgICAgICAgWyB4K3NpemUuQUNfZGlzYy53LXBhZGRpbmcqMSwgYm90dG9tLWJyZWFrZXJfc3BhY2luZyoxIF0sXG4gICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIueCwgYm90dG9tLWJyZWFrZXJfc3BhY2luZyoxIF0sXG4gICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIueCwgXG4gICAgICAgICAgICAgICAgbG9jLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhci55LXNpemUuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyLmgvMiBdLFxuICAgICAgICBdKTtcbiAgICB9XG4gICAgICAgIFxuICAgICBcbiAgICBmb3IoIHZhciBpPTE7IGkgPD0gMzsgaSsrICkge1xuICAgICAgICBpZiggc3lzdGVtLkFDX2NvbmR1Y3RvcnMuaW5kZXhPZignTCcraSkrMSApIHtcbiAgICAgICAgICAgIHkgLT0gcGFkZGluZztcbiAgICAgICAgICAgIGxheWVyKCdBQ19MJytpKTtcbiAgICAgICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgICAgIFt4LHldLFxuICAgICAgICAgICAgICAgIFsgeCtwYWRkaW5nKigxNS1pKjMpLCB5IF0sXG4gICAgICAgICAgICAgICAgWyB4K3BhZGRpbmcqKDE1LWkqMyksIGxvYy5BQ19kaXNjLnN3aXRjaF9ib3R0b20gXSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgYmxvY2soJ3Rlcm1pbmFsJywgWyB4K3BhZGRpbmcqKDE1LWkqMyksIGxvYy5BQ19kaXNjLnN3aXRjaF9ib3R0b20gXSApO1xuICAgICAgICAgICAgYmxvY2soJ3Rlcm1pbmFsJywgWyB4K3BhZGRpbmcqKDE1LWkqMyksIGxvYy5BQ19kaXNjLnN3aXRjaF90b3AgXSApO1xuICAgICAgICAgICAgbGluZShbXG4gICAgICAgICAgICAgICAgWyB4K3BhZGRpbmcqKDE1LWkqMyksIGxvYy5BQ19kaXNjLnN3aXRjaF90b3AgXSxcbiAgICAgICAgICAgICAgICBbIHgrcGFkZGluZyooMTUtaSozKSwgYm90dG9tLWJyZWFrZXJfc3BhY2luZyooaSsyKSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMubGVmdCwgYm90dG9tLWJyZWFrZXJfc3BhY2luZyooaSsyKSBdLFxuICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgeCA9IGxvYy53aXJlX3RhYmxlLng7XG4gICAgeSA9IGxvYy53aXJlX3RhYmxlLnk7XG4gICAgdyA9IHNpemUud2lyZV90YWJsZS53O1xuICAgIGggPSBzaXplLndpcmVfdGFibGUuaDtcbiAgICB2YXIgcm93X2ggPSBzaXplLndpcmVfdGFibGUucm93X2g7XG4gICAgdmFyIHRvcCA9IGxvYy53aXJlX3RhYmxlLnRvcDtcbiAgICB2YXIgYm90dG9tID0gbG9jLndpcmVfdGFibGUuYm90dG9tO1xuICAgIHZhciBjb2x1bW5fd2lkdGggPSB7XG4gICAgICAgIG51bWJlcjogMjUsXG4gICAgICAgIHdpcmVfZ2F1Z2U6IDI1LFxuICAgICAgICB3aXJlX3R5cGU6IDUwLFxuICAgICAgICBjb25kdWl0X2dhdWdlOiAyNSxcbiAgICAgICAgY29uZHVpdF90eXBlOiA1MCxcbiAgICB9O1xuXG4gICAgbGF5ZXIoJ3RhYmxlJyk7XG4gICAgcmVjdCggW3gseV0sIFt3LGhdICk7XG5cbiAgICBsaW5lKFtcbiAgICAgICAgW3gtdy8yKzI1ICwgeS1oLzIrKDEqcm93X2gpXSxcbiAgICAgICAgW3grdy8yICwgeS1oLzIrKDEqcm93X2gpXSxcbiAgICBdKTtcblxuICAgIGZvciggdmFyIHI9MjsgcjxzeXN0ZW0ud2lyZV9jb25maWdfbnVtKzM7IHIrKyApIHtcbiAgICBcbiAgICAgICAgbGluZShbXG4gICAgICAgICAgICBbeC13LzIgLCB5LWgvMisocipyb3dfaCldLFxuICAgICAgICAgICAgW3grdy8yICwgeS1oLzIrKHIqcm93X2gpXSxcbiAgICAgICAgXSk7XG4gICAgfVxuICAgIHggPSBsb2Mud2lyZV90YWJsZS54IC0gdy8yO1xuICAgIHkgPSBsb2Mud2lyZV90YWJsZS55IC0gaC8yO1xuICAgIHggKz0gY29sdW1uX3dpZHRoLm51bWJlcjtcblxuICAgIHZhciBjX3cgPSBjb2x1bW5fd2lkdGgud2lyZV9nYXVnZTtcbiAgICBsaW5lKFsgW3gsdG9wXSwgW3gsYm90dG9tLXJvd19oXSBdKTtcbiAgICB0ZXh0KCBbeCtjX3cseStyb3dfaCowLjc1XSwgJ1dpcmUnLCAndGFibGUnLCAndGV4dCcpO1xuICAgIHRleHQoIFt4K2Nfdy8yLHkrcm93X2gqMS43NV0sICdBV0cnLCAndGFibGUnLCAndGV4dCcpO1xuICAgIHggKz0gY193O1xuXG4gICAgY193ID0gY29sdW1uX3dpZHRoLndpcmVfdHlwZTtcbiAgICBsaW5lKFsgW3gsdG9wK3Jvd19oXSwgW3gsYm90dG9tLXJvd19oXSBdKTtcbiAgICB0ZXh0KCBbeCtjX3cvMix5K3Jvd19oKjEuNzVdLCAnVHlwZScsICd0YWJsZScsICd0ZXh0Jyk7XG4gICAgeCArPSBjX3c7XG5cbiAgICBjX3cgPSBjb2x1bW5fd2lkdGguY29uZHVpdF9nYXVnZTtcbiAgICBsaW5lKFsgW3gsdG9wXSwgW3gsYm90dG9tLXJvd19oXSBdKTtcbiAgICB0ZXh0KCBbeCtjX3cseStyb3dfaCowLjc1XSwgJ0NvbmR1aXQnLCAndGFibGUnLCAndGV4dCcpO1xuICAgIHRleHQoIFt4K2Nfdy8yLHkrcm93X2gqMS43NV0sICdTaXplJywgJ3RhYmxlJywgJ3RleHQnKTtcbiAgICB4ICs9IGNfdztcblxuICAgIGxpbmUoWyBbeCx0b3Arcm93X2hdLCBbeCxib3R0b20tcm93X2hdIF0pO1xuICAgIHRleHQoIFt4K2Nfdy8yLHkrcm93X2gqMS43NV0sICdUeXBlJywgJ3RhYmxlJywgJ3RleHQnKTtcblxuICAgIHggPSBsb2Mud2lyZV90YWJsZS54IC0gdy8yO1xuICAgIHkgPSBsb2Mud2lyZV90YWJsZS55IC0gaC8yO1xuXG4gICAgeCArPSBjb2x1bW5fd2lkdGgubnVtYmVyLzI7XG4gICAgeSArPSByb3dfaCoyICsgcm93X2gqMC43NTtcblxuICAgIGZvciggdmFyIHI9MTsgcjw9c3lzdGVtLndpcmVfY29uZmlnX251bTsgcisrICkge1xuICAgICAgICB0ZXh0KCBbeCx5XSwgU3RyaW5nKHIpLCAndGFibGUnLCAndGV4dCcpO1xuXG5cblxuICAgICAgICB5ICs9IHJvd19oO1xuICAgIH1cblxuXG5cbi8vIHZvbHRhZ2UgZHJvcFxuICAgIHggPSBsb2Mudm9sdF9kcm9wX3RhYmxlLng7XG4gICAgeSA9IGxvYy52b2x0X2Ryb3BfdGFibGUueTtcbiAgICB3ID0gc2l6ZS52b2x0X2Ryb3BfdGFibGUudztcbiAgICBoID0gc2l6ZS52b2x0X2Ryb3BfdGFibGUuaDtcblxuICAgIGxheWVyKCd0YWJsZScpO1xuICAgIHJlY3QoIFt4LHldLCBbdyxoXSApO1xuICAgIFxuICAgIHkgLT0gaC8yO1xuICAgIHkgKz0gMTBcblxuICAgIHRleHQoIFt4LHldLCAnVm9sdGFnZSBEcm9wJywgJ3RhYmxlJywgJ3RleHQnKTtcblxuXG4vLyBnZW5lcmFsIG5vdGVzXG4gICAgeCA9IGxvYy5nZW5lcmFsX25vdGVzLng7XG4gICAgeSA9IGxvYy5nZW5lcmFsX25vdGVzLnk7XG4gICAgdyA9IHNpemUuZ2VuZXJhbF9ub3Rlcy53O1xuICAgIGggPSBzaXplLmdlbmVyYWxfbm90ZXMuaDtcblxuICAgIGxheWVyKCd0YWJsZScpO1xuICAgIHJlY3QoIFt4LHldLCBbdyxoXSApO1xuICAgIFxuICAgIHkgLT0gaC8yO1xuICAgIHkgKz0gMTBcblxuICAgIHRleHQoIFt4LHldLCAnR2VuZXJhbCBOb3RlcycsICd0YWJsZScsICd0ZXh0Jyk7XG5cblxuXG5cblxuXG4gICAgcmV0dXJuIGVsZW1lbnRzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gbWtfZHJhd2luZztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIGxvZyA9IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XG52YXIgayA9IHJlcXVpcmUoJy4uL2xpYi9rL2suanMnKVxuXG52YXIgc2V0dGluZ3MgPSB7fTtcblxuXG5zZXR0aW5ncy5zeXN0ZW0gPSB7fTtcbnNldHRpbmdzLnJlZ2lzdHJ5ID0gW107XG5cbnZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5zeXN0ZW0ud2lyZV9jb25maWdfbnVtID0gNTtcbnN5c3RlbS5EQyA9IHt9O1xuc3lzdGVtLkRDLm1vZHVsZSA9IHt9O1xuXG52YXIgY29uZmlnX29wdGlvbnMgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucyA9IHt9O1xuXG5cblxuY29uZmlnX29wdGlvbnMuQUNfdHlwZV9vcHRpb25zID0gWycxMjBWJywgJzI0MFYnLCAnMjA4VicsICcyNzdWJywgJzQ4MFYgV3llJywgJzQ4MFYgRGVsdGEnXTtcbmNvbmZpZ19vcHRpb25zLnN0cmluZ19udW1fb3B0aW9ucyA9IFsxLDIsMyw0LDUsNl07XG5jb25maWdfb3B0aW9ucy5zdHJpbmdfbW9kdWxlc19vcHRpb25zID0gWzEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDE4LDE5LDIwXTtcbmNvbmZpZ19vcHRpb25zLkFDX3R5cGVzID0ge1xuICAgICcxMjBWJyAgICAgIDogWydncm91bmQnLCAnbmV1dHJhbCcsICdMMScgXSxcbiAgICAnMjQwVicgICAgICA6IFsnZ3JvdW5kJywgJ25ldXRyYWwnLCAnTDEnLCAnTDInIF0sXG4gICAgJzIwOFYnICAgICAgOiBbJ2dyb3VuZCcsICduZXV0cmFsJywgJ0wxJywgJ0wyJyBdLFxuICAgICcyNzdWJyAgICAgIDogWydncm91bmQnLCAnbmV1dHJhbCcsICdMMScgXSxcbiAgICAnNDgwViBXeWUnICA6IFsnZ3JvdW5kJywgJ25ldXRyYWwnLCAnTDEnLCAnTDInLCAnTDMnIF0sXG4gICAgJzQ4MFYgRGVsdGEnOiBbJ2dyb3VuZCcsICdMMScsICdMMicsICdMMycgXSxcbn07XG5cblxuXG4vL3ZhciBjb21wb25lbnRzID0gc2V0dGluZ3MuY29tcG9uZW50cyA9IHt9O1xuXG5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnMgPSB7fTtcblxuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzWydTTUEnXSA9IHt9O1xuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzWydTTUEnXVsnU0kzMDAwJ10gPSB7XG4gICAgbWFrZTonU01BJyxcbiAgICBtb2RlbDonMzAwMCcsXG5cbiAgICBEQ192b2x0YWdlV2luZG93X2xvdzogMTUwLFxuICAgIERDX3ZvbHRhZ2VXaW5kb3dfaGlnaDogMzUwLFxuICAgIG1heF9wb3dlcjogMzMwMCxcblxuICAgIEFDX29wdGlvbnM6IFsnMjQwJywnMjA4J10sXG5cbn07XG5cbmNvbmZpZ19vcHRpb25zLmludmVydGVyc1snU01BJ11bJ1NJMjUwMCddID0ge1xuICAgIG1ha2U6J1NNQScsXG4gICAgbW9kZWw6JzI1MDAnLFxuXG4gICAgRENfdm9sdGFnZVdpbmRvd19sb3c6IDE1MCxcbiAgICBEQ192b2x0YWdlV2luZG93X2hpZ2g6IDM1MCxcbiAgICBtYXhfcG93ZXI6IDI5MDAsXG5cbiAgICBBQ19vcHRpb25zOiBbJzI0MCcsJzIwOCddLFxuXG59O1xuXG5cblxuXG5zeXN0ZW0uREMuc3RyaW5nX251bSA9IDQ7XG4vL2xvZyhrb250YWluZXIoJ3N5c3RlbScpKVxuXG5zeXN0ZW0uREMuc3RyaW5nX21vZHVsZXMgPSA2O1xuXG5zeXN0ZW0uaW52ZXJ0ZXIgPSB7fTtcbnN5c3RlbS5pbnZlcnRlci5tb2RlbCA9ICdTSTMwMDAnOyBcblxuc3lzdGVtLkFDX3R5cGUgPSAnNDgwViBEZWx0YSc7XG5cblxuXG4vLyBEcmF3aW5nIHNwZWNpZmljXG5zZXR0aW5ncy5kcmF3aW5nID0ge307XG5cbi8qXG52YXIgbF9hdHRyID0gc2V0dGluZ3MuZHJhd2luZy5sX2F0dHIgPSB7fTtcblxubF9hdHRyLmJhc2UgPSB7XG4gICAgJ2ZpbGwnOiAnbm9uZScsXG4gICAgJ3N0cm9rZSc6JyMwMDAwMDAnLFxuICAgICdzdHJva2Utd2lkdGgnOicxcHgnLFxuICAgICdzdHJva2UtbGluZWNhcCc6J2J1dHQnLFxuICAgICdzdHJva2UtbGluZWpvaW4nOidtaXRlcicsXG4gICAgJ3N0cm9rZS1vcGFjaXR5JzoxLFxuXG59O1xubF9hdHRyLmJsb2NrID0gT2JqZWN0LmNyZWF0ZShsX2F0dHIuYmFzZSk7XG5sX2F0dHIuZnJhbWUgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5mcmFtZS5zdHJva2UgPSAnIzAwMDA0Mic7XG5sX2F0dHIudGFibGUgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci50YWJsZS5zdHJva2UgPSAnIzAwMDA0Mic7XG5cbmxfYXR0ci5EQ19wb3MgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5EQ19wb3Muc3Ryb2tlID0gJyNmZjAwMDAnO1xubF9hdHRyLkRDX25lZyA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xubF9hdHRyLkRDX25lZy5zdHJva2UgPSAnIzAwMDAwMCc7XG5sX2F0dHIuRENfZ3JvdW5kID0gT2JqZWN0LmNyZWF0ZShsX2F0dHIuYmFzZSk7XG5sX2F0dHIuRENfZ3JvdW5kLnN0cm9rZSA9ICcjMDA2NjAwJztcbmxfYXR0ci5tb2R1bGUgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5ib3ggPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci50ZXh0ID0gT2JqZWN0LmNyZWF0ZShsX2F0dHIuYmFzZSk7XG5sX2F0dHIudGV4dC5zdHJva2UgPSAnIzAwMDBmZic7XG5sX2F0dHIudGVybWluYWwgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcblxubF9hdHRyLkFDX2dyb3VuZCA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xubF9hdHRyLkFDX2dyb3VuZC5zdHJva2UgPSAnR3JlZW4nO1xubF9hdHRyLkFDX25ldXRyYWwgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5BQ19uZXV0cmFsLnN0cm9rZSA9ICdHcmF5JztcbmxfYXR0ci5BQ19MMSA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xubF9hdHRyLkFDX0wxLnN0cm9rZSA9ICdCbGFjayc7XG5sX2F0dHIuQUNfTDIgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5BQ19MMi5zdHJva2UgPSAnUmVkJztcbmxfYXR0ci5BQ19MMyA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xubF9hdHRyLkFDX0wzLnN0cm9rZSA9ICdCbHVlJztcbiovXG5cbi8vLy8vLy8vLy8vLy8vL1xuLy8gZm9udHNcblxudmFyIGZvbnRzID0gc2V0dGluZ3MuZHJhd2luZy5mb250cyA9IHt9O1xuXG5mb250c1snc2lnbnMnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDUsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5mb250c1snbGFiZWwnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDEyLFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ21pZGRsZScsXG59O1xuZm9udHNbJ3RpdGxlMSddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTQsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbGVmdCcsXG59O1xuZm9udHNbJ3RpdGxlMiddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTIsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbGVmdCcsXG59O1xuZm9udHNbJ3BhZ2UnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDIwLFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ2xlZnQnLFxufVxuZm9udHNbJ3RhYmxlJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICA2LFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ21pZGRsZScsXG59O1xuXG5cbmZ1bmN0aW9uIG1rX3NldHRpbmdzKCl7XG5cbn1cblxuXG5cbnZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZy5zaXplID0ge307XG52YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZy5sb2MgPSB7fTtcblxuXG4vLyBzaXplc1xuc2l6ZS5kcmF3aW5nID0ge1xuICAgIHc6IDEwMDAsXG4gICAgaDogNzgwLFxuICAgIGZyYW1lX3BhZGRpbmc6IDUsXG4gICAgdGl0bGVib3g6IDUwLFxufTtcblxuc2l6ZS5tb2R1bGUgPSB7fTtcbnNpemUubW9kdWxlLmZyYW1lID0ge1xuICAgIHc6IDEwLFxuICAgIGg6IDMwLFxufTtcbnNpemUubW9kdWxlLmxlYWQgPSBzaXplLm1vZHVsZS5mcmFtZS53KjIvMztcbnNpemUubW9kdWxlLmggPSBzaXplLm1vZHVsZS5mcmFtZS5oICsgc2l6ZS5tb2R1bGUubGVhZCoyO1xuc2l6ZS5tb2R1bGUudyA9IHNpemUubW9kdWxlLmZyYW1lLnc7XG5cbnNpemUud2lyZV9vZmZzZXQgPSB7XG4gICAgYmFzZTogNSxcbiAgICBnYXA6IHNpemUubW9kdWxlLncsXG59ICAgIDtcbnNpemUud2lyZV9vZmZzZXQubWF4ID0gc3lzdGVtLkRDLnN0cmluZ19udW0gKiBzaXplLndpcmVfb2Zmc2V0LmJhc2U7XG5zaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCA9IHNpemUud2lyZV9vZmZzZXQubWF4ICsgc2l6ZS53aXJlX29mZnNldC5iYXNlKjI7XG5cbnNpemUuc3RyaW5nID0ge307XG5zaXplLnN0cmluZy5nYXAgPSBzaXplLm1vZHVsZS5mcmFtZS53LzQyO1xuc2l6ZS5zdHJpbmcuZ2FwX21pc3NpbmcgPSBzaXplLnN0cmluZy5nYXAgKyBzaXplLm1vZHVsZS5mcmFtZS53O1xuc2l6ZS5zdHJpbmcuaCA9IChzaXplLm1vZHVsZS5oICogNCkgKyAoc2l6ZS5zdHJpbmcuZ2FwICogMikgKyBzaXplLnN0cmluZy5nYXBfbWlzc2luZztcbnNpemUuc3RyaW5nLncgPSBzaXplLm1vZHVsZS5mcmFtZS53ICogMi41O1xuXG5zaXplLmpiX2JveCA9IHtcbiAgICBoOiAyMDAsXG4gICAgdzogODAsXG59O1xuXG5zaXplLmRpc2Nib3ggPSB7XG4gICAgdzogODAgKyBzaXplLndpcmVfb2Zmc2V0LmJhc2UqMiAqIHN5c3RlbS5EQy5zdHJpbmdfbnVtLFxuICAgIGg6IDE0MCxcbn07XG5cbnNpemUudGVybWluYWxfZGlhbSA9IDU7XG5zaXplLmZ1c2UgPSB7fTtcbnNpemUuZnVzZS53ID0gMTU7XG5zaXplLmZ1c2UuaCA9IDQ7XG5cblxuc2l6ZS5pbnZlcnRlciA9IHsgdzogMjAwLCBoOiAxNTAgfTtcbnNpemUuaW52ZXJ0ZXIudGV4dF9nYXAgPSAxNTtcbnNpemUuaW52ZXJ0ZXIuc3ltYm9sX3cgPSA1MDtcbnNpemUuaW52ZXJ0ZXIuc3ltYm9sX2ggPSAyNTtcblxuc2l6ZS5BQ19kaXNjID0geyB3OiA3NSwgaDogMTAwIH07XG5cbnNpemUuQUNfbG9hZGNlbnRlciA9IHsgdzogMTI1LCBoOiAzMDAgfTsgXG5zaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlciA9IHsgdzogMjAsIGg6IDUsIH07XG5cbnNpemUuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyID0geyB3OjUsIGg6NDAgfTtcbnNpemUuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIgPSB7IHc6NDAsIGg6NSB9O1xuXG5cblxuLy8gbG9jYXRpb25cbmxvYy5hcnJheSA9IHsgeDoyMDAsIHk6NjAwIH07XG5sb2MuYXJyYXkudXBwZXIgPSBsb2MuYXJyYXkueSAtIHNpemUuc3RyaW5nLmgvMjtcbmxvYy5hcnJheS5sb3dlciA9IGxvYy5hcnJheS51cHBlciArIHNpemUuc3RyaW5nLmg7XG5sb2MuYXJyYXkucmlnaHQgPSBsb2MuYXJyYXkueCAtIHNpemUubW9kdWxlLmZyYW1lLmgqMjtcbmxvYy5hcnJheS5sZWZ0ID0gbG9jLmFycmF5LnJpZ2h0IC0gKCBzaXplLnN0cmluZy53ICogc3lzdGVtLkRDLnN0cmluZ19udW0gKSAtICggc2l6ZS5tb2R1bGUudyAqIDEuMjUgKSA7XG5cbmxvYy5EQyA9IGxvYy5hcnJheTtcblxubG9jLmludmVydGVyID0geyB4OmxvYy5hcnJheS54KzMwMCwgeTpsb2MuYXJyYXkueS0zNTAgfTtcbmxvYy5pbnZlcnRlci5ib3R0b20gPSBsb2MuaW52ZXJ0ZXIueSArIHNpemUuaW52ZXJ0ZXIuaC8yO1xubG9jLmludmVydGVyLnRvcCA9IGxvYy5pbnZlcnRlci55IC0gc2l6ZS5pbnZlcnRlci5oLzI7XG5sb2MuaW52ZXJ0ZXIuYm90dG9tX3JpZ2h0ID0ge1xuICAgIHg6IGxvYy5pbnZlcnRlci54ICsgc2l6ZS5pbnZlcnRlci53LzIsXG4gICAgeTogbG9jLmludmVydGVyLnkgKyBzaXplLmludmVydGVyLmgvMixcbn07XG5sb2MuQUNfZGlzYyA9IHsgeDogbG9jLmFycmF5LngrNDc1LCB5OiBsb2MuYXJyYXkueS0xMDAgfTtcbmxvYy5BQ19kaXNjLmJvdHRvbSA9IGxvYy5BQ19kaXNjLnkgKyBzaXplLkFDX2Rpc2MuaC8yO1xubG9jLkFDX2Rpc2MudG9wID0gbG9jLkFDX2Rpc2MueSAtIHNpemUuQUNfZGlzYy5oLzI7XG5sb2MuQUNfZGlzYy5sZWZ0ID0gbG9jLkFDX2Rpc2MueCAtIHNpemUuQUNfZGlzYy53LzI7XG5sb2MuQUNfZGlzYy5zd2l0Y2hfdG9wID0gbG9jLkFDX2Rpc2MudG9wICsgMTU7XG5sb2MuQUNfZGlzYy5zd2l0Y2hfYm90dG9tID0gbG9jLkFDX2Rpc2Muc3dpdGNoX3RvcCArIDMwO1xuXG5cblxubG9jLkFDX2xvYWRjZW50ZXIgPSB7XG4gICAgeDogbG9jLkFDX2Rpc2MueCsxNTAsIFxuICAgIHk6IGxvYy5BQ19kaXNjLnktMTAwXG59O1xubG9jLkFDX2xvYWRjZW50ZXIud2lyZV9idW5kbGVfYm90dG9tID0gbG9jLkFDX2Rpc2MudG9wIC0gMjA7XG5sb2MuQUNfbG9hZGNlbnRlci5sZWZ0ID0gbG9jLkFDX2xvYWRjZW50ZXIueCAtIHNpemUuQUNfbG9hZGNlbnRlci53LzI7XG5sb2MuQUNfbG9hZGNlbnRlci5icmVha2VycyA9IHtcbiAgICBsZWZ0OiBsb2MuQUNfbG9hZGNlbnRlci54IC0gKCBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci53ICogMS4xICksXG4gICAgc3BhY2luZzogc2l6ZS50ZXJtaW5hbF9kaWFtLFxufTtcbmxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIgPSB7XG4gICAgeDogbG9jLkFDX2xvYWRjZW50ZXIubGVmdCArIDIwLCBcbiAgICB5OiBsb2MuQUNfbG9hZGNlbnRlci55ICsgc2l6ZS5BQ19sb2FkY2VudGVyLmgqMC4yIFxufTtcbmxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhciA9IHtcbiAgICB4OiBsb2MuQUNfbG9hZGNlbnRlci54ICsgMTAsIFxuICAgIHk6IGxvYy5BQ19sb2FkY2VudGVyLnkgKyBzaXplLkFDX2xvYWRjZW50ZXIuaCowLjQ1XG59O1xuXG4vLyB3aXJlIHRhYmxlXG5zaXplLndpcmVfdGFibGUgPSB7fTtcbnNpemUud2lyZV90YWJsZS53ID0gMjAwO1xuc2l6ZS53aXJlX3RhYmxlLnJvd19oID0gMTA7XG5zaXplLndpcmVfdGFibGUuaCA9IChzeXN0ZW0ud2lyZV9jb25maWdfbnVtKzMpICogc2l6ZS53aXJlX3RhYmxlLnJvd19oO1xubG9jLndpcmVfdGFibGUgPSB7XG4gICAgeDogc2l6ZS5kcmF3aW5nLncgLSBzaXplLmRyYXdpbmcudGl0bGVib3ggLSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyozIC0gc2l6ZS53aXJlX3RhYmxlLncvMiAtIDI1LFxuICAgIHk6IHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nKjMgKyBzaXplLndpcmVfdGFibGUuaC8yLFxufTtcbmxvYy53aXJlX3RhYmxlLnRvcCA9IGxvYy53aXJlX3RhYmxlLnkgLSBzaXplLndpcmVfdGFibGUuaC8yO1xubG9jLndpcmVfdGFibGUuYm90dG9tID0gbG9jLndpcmVfdGFibGUueSArIHNpemUud2lyZV90YWJsZS5oLzI7XG5cbi8vbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMgPSBcblxuLy8gdm9sdGFnZSBkcm9wIHRhYmxlXG5zaXplLnZvbHRfZHJvcF90YWJsZSA9IHt9O1xuc2l6ZS52b2x0X2Ryb3BfdGFibGUudyA9IDE1MDtcbnNpemUudm9sdF9kcm9wX3RhYmxlLmggPSAxMDA7XG5sb2Mudm9sdF9kcm9wX3RhYmxlID0ge307XG5sb2Mudm9sdF9kcm9wX3RhYmxlLnggPSBzaXplLmRyYXdpbmcudyAtIHNpemUudm9sdF9kcm9wX3RhYmxlLncvMiAtIDkwO1xubG9jLnZvbHRfZHJvcF90YWJsZS55ID0gc2l6ZS5kcmF3aW5nLmggLSBzaXplLnZvbHRfZHJvcF90YWJsZS5oLzIgLSAzMDtcblxuXG4vLyB2b2x0YWdlIGRyb3AgdGFibGVcbnNpemUuZ2VuZXJhbF9ub3RlcyA9IHt9O1xuc2l6ZS5nZW5lcmFsX25vdGVzLncgPSAxNTA7XG5zaXplLmdlbmVyYWxfbm90ZXMuaCA9IDEwMDtcbmxvYy5nZW5lcmFsX25vdGVzID0ge307XG5sb2MuZ2VuZXJhbF9ub3Rlcy54ID0gc2l6ZS5nZW5lcmFsX25vdGVzLncvMiArIDMwO1xubG9jLmdlbmVyYWxfbm90ZXMueSA9IHNpemUuZ2VuZXJhbF9ub3Rlcy5oLzIgKyAzMDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxubW9kdWxlLmV4cG9ydHMgPSBzZXR0aW5ncztcbiIsInZhciBrID0gcmVxdWlyZSgnLi4vbGliL2svay5qcycpXG52YXIgbG9nID0gY29uc29sZS5sb2cuYmluZChjb25zb2xlKTtcbi8vdmFyIHVwZGF0ZV9zeXN0ZW0gPSByZXF1aXJlKCcuL3VwZGF0ZScpLnVwZGF0ZV9zeXN0ZW07XG5cbmZ1bmN0aW9uIGxvYWRUYWJsZXMoc3RyaW5nKXtcbiAgICB2YXIgdGFibGVzID0ge307XG4gICAgdmFyIGwgPSBzdHJpbmcuc3BsaXQoJ1xcbicpO1xuICAgIHZhciB0aXRsZTtcbiAgICB2YXIgZmllbGRzO1xuICAgIHZhciBuZWVkX3RpdGxlID0gdHJ1ZTtcbiAgICB2YXIgbmVlZF9maWVsZHMgPSB0cnVlO1xuICAgIGwuZm9yRWFjaCggZnVuY3Rpb24oc3RyaW5nLCBpKXtcbiAgICAgICAgdmFyIGxpbmUgPSBzdHJpbmcudHJpbSgpO1xuICAgICAgICBpZiggbGluZS5sZW5ndGggPT09IDAgKXtcbiAgICAgICAgICAgIG5lZWRfdGl0bGUgPSB0cnVlO1xuICAgICAgICAgICAgbmVlZF9maWVsZHMgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYoIG5lZWRfdGl0bGUgKSB7XG4gICAgICAgICAgICB0aXRsZSA9IGxpbmU7XG4gICAgICAgICAgICB0YWJsZXNbdGl0bGVdID0gW107XG4gICAgICAgICAgICBuZWVkX3RpdGxlID0gZmFsc2U7IFxuICAgICAgICAgICAgLy9sb2coJ25ldyB0YWJsZSAnLCB0aXRsZSlcbiAgICAgICAgfSBlbHNlIGlmKCBuZWVkX2ZpZWxkcyApIHtcbiAgICAgICAgICAgIGZpZWxkcyA9IGxpbmUuc3BsaXQoJywnKTtcbiAgICAgICAgICAgIG5lZWRfZmllbGRzID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgZW50cnkgPSB7fTtcbiAgICAgICAgICAgIHZhciBsaW5lX2FycmF5ID0gbGluZS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgZmllbGRzLmZvckVhY2goIGZ1bmN0aW9uKGZpZWxkLCBpZCl7XG4gICAgICAgICAgICAgICAgZW50cnlbZmllbGQudHJpbSgpXSA9IGxpbmVfYXJyYXlbaWRdLnRyaW0oKTsgXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRhYmxlc1t0aXRsZV0ucHVzaCggZW50cnkgKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRhYmxlcztcbn1cblxuXG5mdW5jdGlvbiBsb2FkTW9kdWxlcyhzdHJpbmcpe1xuICAgIHZhciBkYiA9IGsucGFyc2VDU1Yoc3RyaW5nKTtcbiAgICB2YXIgbW9kdWxlcyA9IHt9ICAgIFxuICAgIGZvciggdmFyIGkgaW4gZGIgKXtcbiAgICAgICAgdmFyIG1vZHVsZSA9IGRiW2ldO1xuICAgICAgICBpZiggbW9kdWxlc1ttb2R1bGUuTWFrZV0gPT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgbW9kdWxlc1ttb2R1bGUuTWFrZV0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiggbW9kdWxlc1ttb2R1bGUuTWFrZV1bbW9kdWxlLk1vZGVsXSA9PT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICBtb2R1bGVzW21vZHVsZS5NYWtlXVttb2R1bGUuTW9kZWxdID0ge307XG4gICAgICAgIH1cbiAgICAgICAgbW9kdWxlc1ttb2R1bGUuTWFrZV1bbW9kdWxlLk1vZGVsXSA9IG1vZHVsZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbW9kdWxlcztcbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzLmxvYWRUYWJsZXMgPSBsb2FkVGFibGVzO1xubW9kdWxlLmV4cG9ydHMubG9hZE1vZHVsZXMgPSBsb2FkTW9kdWxlcztcblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgbG9nID0gY29uc29sZS5sb2cuYmluZChjb25zb2xlKTtcbnZhciBrID0gcmVxdWlyZSgnLi4vbGliL2svay5qcycpO1xuLy92YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xuLy92YXIgZGlzcGxheV9zdmcgPSByZXF1aXJlKCcuL2Rpc3BsYXlfc3ZnJyk7XG5cbnZhciB1cGRhdGVfc3lzdGVtID0gZnVuY3Rpb24oc2V0dGluZ3MpIHtcbiAgICAvL2xvZygnLS0tc2V0dGluZ3MtLS0nLCBzZXR0aW5ncyk7XG4gICAgdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcblxuICAgIC8vc3lzdGVtLkRDLnN0cmluZ19udW0gPSBzZXR0aW5ncy5zeXN0ZW0uc3RyaW5nX251bTsgXG4gICAgLy9zeXN0ZW0uREMuc3RyaW5nX21vZHVsZXMgPSBzZXR0aW5ncy5zeXN0ZW0uc3RyaW5nX21vZHVsZXM7XG4gICAgLy9pZiggc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlcyAhPT0gdW5kZWZpbmVkICl7XG4gICAgaWYoIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZXMgKXtcbiAgICAgICAgc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlTWFrZUFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZXMpO1xuICAgICAgICBzeXN0ZW0uREMubW9kdWxlLm1ha2UgPSBzeXN0ZW0uREMubW9kdWxlLm1ha2UgfHwgT2JqZWN0LmtleXMoIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZXMgKVswXTtcbiAgICAgICAgc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlTW9kZWxBcnJheSA9IGsub2JqSWRBcnJheShzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVzW3N5c3RlbS5EQy5tb2R1bGUubWFrZV0pO1xuICAgICAgICBzeXN0ZW0uREMubW9kdWxlLm1vZGVsID0gc3lzdGVtLkRDLm1vZHVsZS5tb2RlbCB8fCBPYmplY3Qua2V5cyggc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlc1tzeXN0ZW0uREMubW9kdWxlLm1ha2VdIClbMF07XG4gICAgICAgIHN5c3RlbS5EQy5tb2R1bGUuc3BlY3MgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVzW3N5c3RlbS5EQy5tb2R1bGUubWFrZV1bc3lzdGVtLkRDLm1vZHVsZS5tb2RlbF07XG4gICAgfVxuICAgIGlmKCBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnMgKXtcbiAgICAgICAgc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlTWFrZUFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVycyk7XG4gICAgICAgIHN5c3RlbS5pbnZlcnRlci5tYWtlID0gc3lzdGVtLmludmVydGVyLm1ha2UgfHwgT2JqZWN0LmtleXMoIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVycyApWzBdO1xuICAgICAgICBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVNb2RlbEFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyc1tzeXN0ZW0uREMubW9kdWxlLm1ha2VdKTtcbiAgICAgICAgc3lzdGVtLmludmVydGVyLm1vZGVsID0gc3lzdGVtLmludmVydGVyLm1vZGVsIHx8IE9iamVjdC5rZXlzKCBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnNbc3lzdGVtLmludmVydGVyLm1ha2VdIClbMF07XG4gICAgICAgIHN5c3RlbS5pbnZlcnRlci5zcGVjcyA9IHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyc1tzeXN0ZW0uaW52ZXJ0ZXIubWFrZV1bc3lzdGVtLmludmVydGVyLm1vZGVsXTtcbiAgICB9XG5cbiAgICBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVNYWtlQXJyYXkgPSBrLm9iaklkQXJyYXkoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlcyk7XG4gICAgc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlTW9kZWxBcnJheSA9IGsub2JqSWRBcnJheShzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVzW3N5c3RlbS5EQy5tb2R1bGUubWFrZV0pO1xuXG4gICAgLy9zeXN0ZW0ubW9kdWxlID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlc1tzZXR0aW5ncy5taXNjLm1vZHVsZV07XG5cbiAgICBpZiggc3lzdGVtLkRDLm1vZHVsZS5zcGVjcyApe1xuICAgICAgICBzeXN0ZW0uREMuY3VycmVudCA9IHN5c3RlbS5EQy5tb2R1bGUuc3BlY3MuSXNjICogc3lzdGVtLkRDLnN0cmluZ19udW07XG4gICAgICAgIHN5c3RlbS5EQy52b2x0YWdlID0gc3lzdGVtLkRDLm1vZHVsZS5zcGVjcy5Wb2MgKiBzeXN0ZW0uREMuc3RyaW5nX21vZHVsZXM7XG4gICAgfVxuXG4gICAgLy9zeXN0ZW0uaW52ZXJ0ZXIgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnNbc3lzdGVtLmludmVydGVyLm1vZGVsXTtcblxuICAgIHN5c3RlbS5BQ19sb2FkY2VudGVyX3R5cGUgPSAnNDgwLzI3N1YnO1xuXG4gICAgc3lzdGVtLkFDX3R5cGUgPSBzZXR0aW5ncy5zeXN0ZW0uQUNfdHlwZTtcblxuICAgIHN5c3RlbS5BQ19jb25kdWN0b3JzID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuQUNfdHlwZXNbc3lzdGVtLkFDX3R5cGVdO1xuXG4gICAgXG4gICAgLy9yZXR1cm4gc2V0dGluZ3M7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB1cGRhdGVfc3lzdGVtO1xuIiwiLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIFRoaXMgaXMgdGhlIGsgamF2YXNjcmlwdCBsaWJyYXJ5XHJcbi8vIGEgY29sbGVjdGlvbiBvZiBmdW5jdGlvbnMgdXNlZCBieSBrc2hvd2FsdGVyXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxudmFyIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG52YXIgJCA9IHJlcXVpcmUoJy4va19ET00uanMnKTtcclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gTWlzYy4gdmFyaWFibGVzICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLy8gbG9nIHNob3J0Y3V0XHJcbnZhciBsb2cgPSBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpXHJcbnZhciBsb2dPYmogPSBmdW5jdGlvbihvYmope1xyXG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkob2JqKSlcclxufVxyXG52YXIgbG9nT2JqRnVsbCA9IGZ1bmN0aW9uKG9iail7XHJcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDQpKVxyXG59XHJcblxyXG4vLyB+IHBhZ2UgbG9hZCB0aW1lXHJcbnZhciBib290X3RpbWUgPSBtb21lbnQoKVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIFN0YXJ0IG9mIGxpYmFyeSBvYmplY3QgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbnZhciBrID0ge31cclxuXHJcblxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBKYXZhc3JpcHQgZnVuY3Rpb25zIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuXHJcbmsub2JqX2V4dGVuZCA9IGZ1bmN0aW9uKG9iaiwgcHJvcHMpIHtcclxuICAgIGZvcih2YXIgcHJvcCBpbiBwcm9wcykgeyBcclxuICAgICAgICBpZihwcm9wcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgICAgICBvYmpbcHJvcF0gPSBwcm9wc1twcm9wXVxyXG4gICAgICAgIH0gXHJcbiAgICB9IFxyXG59XHJcblxyXG5rLm9ial9yZW5hbWUgPSBmdW5jdGlvbihvYmosIG9sZF9uYW1lLCBuZXdfbmFtZSl7XHJcbiAgICAvLyBDaGVjayBmb3IgdGhlIG9sZCBwcm9wZXJ0eSBuYW1lIHRvIGF2b2lkIGEgUmVmZXJlbmNlRXJyb3IgaW4gc3RyaWN0IG1vZGUuXHJcbiAgICBpZiAob2JqLmhhc093blByb3BlcnR5KG9sZF9uYW1lKSkge1xyXG4gICAgICAgIG9ialtuZXdfbmFtZV0gPSBvYmpbb2xkX25hbWVdXHJcbiAgICAgICAgZGVsZXRlIG9ialtvbGRfbmFtZV1cclxuICAgIH1cclxuICAgIHJldHVybiBvYmpcclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBNaXNjIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuLy8gaHR0cDovL2Nzcy10cmlja3MuY29tL3NuaXBwZXRzL2phdmFzY3JpcHQvZ2V0LXVybC12YXJpYWJsZXMvXHJcbmsuZ2V0UXVlcnlWYXJpYWJsZSA9IGZ1bmN0aW9uKHZhcmlhYmxlKSB7XHJcbiAgICAgICB2YXIgcXVlcnkgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKVxyXG4gICAgICAgdmFyIHZhcnMgPSBxdWVyeS5zcGxpdChcIiZcIilcclxuICAgICAgIGZvciAodmFyIGk9MDtpPHZhcnMubGVuZ3RoO2krKykge1xyXG4gICAgICAgICAgICAgICB2YXIgcGFpciA9IHZhcnNbaV0uc3BsaXQoXCI9XCIpXHJcbiAgICAgICAgICAgICAgIGlmKHBhaXJbMF0gPT0gdmFyaWFibGUpe1xyXG4gICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhaXJbMV1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuKGZhbHNlKVxyXG59XHJcblxyXG5rLnN0cl9yZXBlYXQgPSBmdW5jdGlvbihzdHJpbmcsIGNvdW50KSB7XHJcbiAgICBpZiAoY291bnQgPCAxKSByZXR1cm4gJydcclxuICAgIHZhciByZXN1bHQgPSAnJyBcclxuICAgIHZhciBwYXR0ZXJuID0gc3RyaW5nLnZhbHVlT2YoKVxyXG4gICAgd2hpbGUgKGNvdW50ID4gMCkge1xyXG4gICAgICAgIGlmIChjb3VudCAmIDEpIHJlc3VsdCArPSBwYXR0ZXJuXHJcbiAgICAgICAgY291bnQgPj49IDEgXHJcbiAgICAgICAgcGF0dGVybiArPSBwYXR0ZXJuXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcblxyXG5rLm9iaklkQXJyYXkgPSBmdW5jdGlvbiggb2JqZWN0ICkge1xyXG4gICAgaWYoIG9iamVjdCAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgIHZhciBhID0gW107XHJcbiAgICAgICAgZm9yKCB2YXIgaWQgaW4gb2JqZWN0ICkge1xyXG4gICAgICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGlkKSApICB7XHJcbiAgICAgICAgICAgICAgICBhLnB1c2goaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIE1hdGgsIG51bWJlcnMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG4vKlxyXG4gKiAgbm9ybVJhbmQ6IHJldHVybnMgbm9ybWFsbHkgZGlzdHJpYnV0ZWQgcmFuZG9tIG51bWJlcnNcclxuICogIGh0dHA6Ly9tZW1vcnkucHN5Y2gubXVuLmNhL3RlY2gvc25pcHBldHMvcmFuZG9tX25vcm1hbC9cclxuICovXHJcbmsubm9ybVJhbmQgPSBmdW5jdGlvbihtdSwgc2lnbWEpIHtcclxuICAgIHZhciB4MSwgeDIsIHJhZDtcclxuXHJcbiAgICBkbyB7XHJcbiAgICAgICAgeDEgPSAyICogTWF0aC5yYW5kb20oKSAtIDE7XHJcbiAgICAgICAgeDIgPSAyICogTWF0aC5yYW5kb20oKSAtIDE7XHJcbiAgICAgICAgcmFkID0geDEgKiB4MSArIHgyICogeDI7XHJcbiAgICB9IHdoaWxlKHJhZCA+PSAxIHx8IHJhZCA9PT0gMCk7XHJcblxyXG4gICAgdmFyIGMgPSBNYXRoLnNxcnQoLTIgKiBNYXRoLmxvZyhyYWQpIC8gcmFkKTtcclxuICAgIHZhciBuID0geDEgKiBjO1xyXG4gICAgcmV0dXJuIChuICogbXUpICsgc2lnbWE7XHJcbn1cclxuXHJcbmsucGFkX3plcm8gPSBmdW5jdGlvbihudW0sIHNpemUpe1xyXG4gICAgdmFyIHMgPSAnMDAwMDAwMDAwJyArIG51bVxyXG4gICAgcmV0dXJuIHMuc3Vic3RyKHMubGVuZ3RoLXNpemUpICAgICBcclxufVxyXG5cclxuXHJcbmsudXB0aW1lID0gZnVuY3Rpb24oYm9vdF90aW1lKXtcclxuICAgIHZhciB1cHRpbWVfc2Vjb25kc190b3RhbCA9IG1vbWVudCgpLmRpZmYoYm9vdF90aW1lLCAnc2Vjb25kcycpXHJcbiAgICB2YXIgdXB0aW1lX2hvdXJzID0gTWF0aC5mbG9vciggIHVwdGltZV9zZWNvbmRzX3RvdGFsIC8oNjAqNjApIClcclxuICAgIHZhciBtaW51dGVzX2xlZnQgPSB1cHRpbWVfc2Vjb25kc190b3RhbCAlKDYwKjYwKVxyXG4gICAgdmFyIHVwdGltZV9taW51dGVzID0gay5wYWRfemVybyggTWF0aC5mbG9vciggIG1pbnV0ZXNfbGVmdCAvNjAgKSwgMiApXHJcbiAgICB2YXIgdXB0aW1lX3NlY29uZHMgPSBrLnBhZF96ZXJvKCAobWludXRlc19sZWZ0ICUgNjApLCAyIClcclxuICAgIHJldHVybiB1cHRpbWVfaG91cnMgK1wiOlwiKyB1cHRpbWVfbWludXRlcyArXCI6XCIrIHVwdGltZV9zZWNvbmRzXHJcbn1cclxuXHJcblxyXG5cclxuay5sYXN0X25fdmFsdWVzID0gZnVuY3Rpb24obil7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG46IG4sXHJcbiAgICAgICAgYXJyYXk6IFtdLFxyXG4gICAgICAgIGFkZDogZnVuY3Rpb24obmV3X3ZhbHVlKXtcclxuICAgICAgICAgICAgdGhpcy5hcnJheS5wdXNoKG5ld192YWx1ZSlcclxuICAgICAgICAgICAgaWYoIHRoaXMuYXJyYXkubGVuZ3RoID4gbiApIHRoaXMuYXJyYXkuc2hpZnQoKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hcnJheVxyXG4gICAgICAgIH1cclxuICAgIH0gICAgXHJcbn1cclxuXHJcbmsuYXJyYXlNYXggPSBmdW5jdGlvbihudW1BcnJheSkge1xyXG4gICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KG51bGwsIG51bUFycmF5KTtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gQUpBWCAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuay5BSkFYID0gZnVuY3Rpb24odXJsLCBjYWxsYmFjaywgb2JqZWN0KSB7XHJcbiAgICB2YXIgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgIHhtbGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHhtbGh0dHAucmVhZHlTdGF0ZSA9PSBYTUxIdHRwUmVxdWVzdC5ET05FICkge1xyXG4gICAgICAgICAgICBpZih4bWxodHRwLnN0YXR1cyA9PSAyMDApe1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soeG1saHR0cC5yZXNwb25zZVRleHQsIG9iamVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih4bWxodHRwLnN0YXR1cyA9PSA0MDApIHtcclxuICAgICAgICAgICAgICAgIGxvZygnVGhlcmUgd2FzIGFuIGVycm9yIDQwMCcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsb2coJ3NvbWV0aGluZyBlbHNlIG90aGVyIHRoYW4gMjAwIHdhcyByZXR1cm5lZCcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgeG1saHR0cC5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XHJcbiAgICB4bWxodHRwLnNlbmQoKTtcclxufVxyXG5cclxuay5wYXJzZUNTViA9IGZ1bmN0aW9uKGZpbGVfY29udGVudCkge1xyXG4gICAgdmFyIHIgPSBbXVxyXG4gICAgdmFyIGxpbmVzID0gZmlsZV9jb250ZW50LnNwbGl0KCdcXG4nKVxyXG4gICAgdmFyIGhlYWRlciA9IGxpbmVzLnNoaWZ0KCkuc3BsaXQoJywnKVxyXG4gICAgZm9yKHZhciBsID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBsIDwgbGVuOyBsKyspe1xyXG4gICAgICAgIHZhciBsaW5lID0gbGluZXNbbF1cclxuICAgICAgICBpZihsaW5lLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICB2YXIgbGluZV9vYmogPSB7fVxyXG4gICAgICAgICAgICBsaW5lLnNwbGl0KCcsJykuZm9yRWFjaChmdW5jdGlvbihpdGVtLGkpe1xyXG4gICAgICAgICAgICAgICAgbGluZV9vYmpbaGVhZGVyW2ldXSA9IGl0ZW1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgci5wdXNoKGxpbmVfb2JqKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybihyKVxyXG59XHJcblxyXG5rLmdldENTViA9IGZ1bmN0aW9uKFVSTCwgY2FsbGJhY2spIHtcclxuICAgIGsuQUpBWChVUkwsIGsucGFyc2VDU1YoKSApXHJcbn1cclxuXHJcbi8qXHJcbiQuYWpheFNldHVwICh7XHJcbiAgICBjYWNoZTogZmFsc2VcclxufSlcclxuXHJcblxyXG5cclxuay5nZXRfSlNPTiA9IGZ1bmN0aW9uKFVSTCwgY2FsbGJhY2ssIHN0cmluZykge1xyXG4vLyAgICB2YXIgZmlsZW5hbWUgPSBVUkwuc3BsaXQoJy8nKS5wb3AoKVxyXG4vLyAgICBsb2coVVJMKVxyXG4gICAgJC5nZXRKU09OKCBVUkwsIGZ1bmN0aW9uKCBqc29uICkge1xyXG4gICAgICAgIGNhbGxiYWNrKGpzb24sIFVSTCwgc3RyaW5nKVxyXG4gICAgfSkuZmFpbChmdW5jdGlvbihqcXhociwgdGV4dFN0YXR1cywgZXJyb3IpIHsgXHJcbiAgICAgICAgY29uc29sZS5sb2coIFwiZXJyb3JcIiwgdGV4dFN0YXR1cywgZXJyb3IgICkgXHJcbiAgICB9KVxyXG59XHJcblxyXG5cclxuay5sb2FkX2ZpbGVzID0gZnVuY3Rpb24oZmlsZV9saXN0LCBjYWxsYmFjayl7XHJcbiAgICB2YXIgZCA9IHt9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9hZF9maWxlKFVSTCl7XHJcbiAgICAgICAgdmFyIGZpbGVuYW1lID0gVVJMLnNwbGl0KCcvJykucG9wKClcclxuLy8gICAgICAgIHZhciBuYW1lID0gZmlsZW5hbWUuc3BsaXQoJy4nKVswXVxyXG4gICAgICAgICQuZ2V0SlNPTiggVVJMLCBmdW5jdGlvbigganNvbiApIHsgLy8gLCB0ZXh0U3RhdHVzLCBqcVhIUikge1xyXG4gICAgICAgICAgICBhZGRfSlNPTihmaWxlbmFtZSwganNvbilcclxuICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uKGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvcikgeyBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coIFwiZXJyb3JcIiwgdGV4dFN0YXR1cywgZXJyb3IgICkgXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhZGRfSlNPTihuYW1lLCBqc29uKXtcclxuICAgICAgICBkW25hbWVdID0ganNvblxyXG4gICAgICAgIGlmKE9iamVjdC5rZXlzKGQpLmxlbmd0aCA9PSBkX2ZpbGVzLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGQpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciggdmFyIGtleSBpbiBmaWxlX2xpc3Qpe1xyXG4gICAgICAgIHZhciBVUkwgPSBmaWxlX2xpc3Rba2V5XVxyXG4gICAgICAgIGxvYWRfZmlsZShVUkwpXHJcbiAgICB9XHJcbiAgICBcclxuLy8gICAgY2FsbGJhY2soZClcclxufVxyXG5cclxuay5nZXRGaWxlID0gZnVuY3Rpb24oVVJMLCBjYWxsYmFjayl7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogVVJMLFxyXG4gICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKCB4aHIgKSB7XHJcbiAgICAgICAgICAgIHhoci5vdmVycmlkZU1pbWVUeXBlKCBcInRleHQvcGxhaW47IGNoYXJzZXQ9eC11c2VyLWRlZmluZWRcIiApO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICAuZG9uZShmdW5jdGlvbiggZGF0YSApIHtcclxuICAgICAgICBjYWxsYmFjayhkYXRhKVxyXG4gICAgfSlcclxuICAgIC5mYWlsKGZ1bmN0aW9uKGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvcikgeyBcclxuICAgICAgICAgICAgY29uc29sZS5sb2coIFwiZXJyb3JcIiwgdGV4dFN0YXR1cywgZXJyb3IgICkgXHJcbiAgICB9KVxyXG4gICAgXHJcbiAgICBcclxufVxyXG4qL1xyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBIVE1MIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuXHJcblxyXG5rLnNldHVwX2JvZHkgPSBmdW5jdGlvbih0aXRsZSwgc2VjdGlvbnMpe1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZVxyXG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5IFxyXG4gICAgdmFyIHN0YXR1c19iYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgc3RhdHVzX2Jhci5pZCA9ICdzdGF0dXMnXHJcbiAgICBzdGF0dXNfYmFyLmlubmVySFRNTCA9ICdsb2FkaW5nIHN0YXR1cy4uLidcclxuICAgIC8qXHJcbiAgICB2YXIgdGl0bGVfaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKVxyXG4gICAgdGl0bGVfaGVhZGVyLmlubmVySFRNTCA9IHRpdGxlXHJcbiAgICBib2R5Lmluc2VydEJlZm9yZSh0aXRsZV9oZWFkZXIsIGJvZHkuZmlyc3RDaGlsZClcclxuICAgICovXHJcbiAgICBib2R5Lmluc2VydEJlZm9yZShzdGF0dXNfYmFyLCBib2R5LmZpcnN0Q2hpbGQpXHJcbiAgICAvKlxyXG4gICAgdmFyIHRhYnNfZGl2ID0gay5tYWtlX3RhYnMoc2VjdGlvbnMpXHJcbiAgICAkKCdib2R5JykuYXBwZW5kKHRhYnNfZGl2KVxyXG4gICAgJCggJy50YWJzJyApLnRhYnMoeyBcclxuICAgICAgICBhY3RpdmF0ZTogZnVuY3Rpb24oIGV2ZW50LCB1aSApIHtcclxuICAgICAgICAgICAgdmFyIGZ1bGxfdGl0bGUgPSB0aXRsZSArIFwiIC8gXCIgKyB1aS5uZXdUYWJbMF0udGV4dENvbnRlbnRcclxuICAgICAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBmdWxsX3RpdGxlXHJcbiAgICAgICAgICAgICQoJyN0aXRsZScpLnRleHQoZnVsbF90aXRsZSlcclxuICAgICAgICAgICAgLy9kdW1wKG1vbWVudCgpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpKVxyXG4gICAgICAgICAgICAkLnNwYXJrbGluZV9kaXNwbGF5X3Zpc2libGUoKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICB2YXIgc2VjdGlvbiA9IGsuZ2V0UXVlcnlWYXJpYWJsZSgnc2VjJylcclxuICAgIGlmKHNlY3Rpb24gaW4gc2VjdGlvbnMpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSAkKCcudGFicyBhW2hyZWY9XCIjJytzZWN0aW9uKydcIl0nKS5wYXJlbnQoKS5pbmRleCgpXHJcbiAgICAgICAgJChcIi50YWJzXCIpLnRhYnMoXCJvcHRpb25cIiwgXCJhY3RpdmVcIiwgaW5kZXgpXHJcbiAgICB9XHJcbiAgICAqL1xyXG5cclxufVxyXG4vKlxyXG5rLm1ha2VfdGFicyA9IGZ1bmN0aW9uKHNlY3Rpb25fb2JqKXtcclxuICAgIHZhciB0YWJzX2RpdiA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ3RhYnMnKVxyXG4gICAgdmFyIGhlYWRfZGl2ID0gJCgnPHVsPicpLmFwcGVuZFRvKHRhYnNfZGl2KVxyXG5cclxuICAgIGZvciAodmFyIGlkIGluIHNlY3Rpb25fb2JqKXtcclxuICAgICAgICB2YXIgdGl0bGUgPSBzZWN0aW9uX29ialtpZF1cclxuICAgICAgICAvLygnPGxpPjxhIGhyZWY9XCIjJytpZCsnXCI+Jyt0aXRsZSsnPC9hPjwvbGk+JykpXHJcbiAgICAgICAgLy8oJzxkaXYgaWQ9XCInK2lkKydcIj48L2Rpdj4nKSlcclxuICAgIH0gICBcclxuICAgIFxyXG4gICAgcmV0dXJuIHRhYnNfZGl2XHJcbn1cclxuXHJcbiovXHJcbmsudXBkYXRlX3N0YXR1c19wYWdlID0gZnVuY3Rpb24oc3RhdHVzX2lkLCBib290X3RpbWUpIHtcclxuICAgIHZhciBzdGF0dXNfZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3RhdHVzX2lkKVxyXG4gICAgc3RhdHVzX2Rpdi5pbm5lckhUTUwgPSAnJ1xyXG5cclxuICAgIHZhciBjbG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgY2xvY2suaW5uZXJIVE1MID0gbW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJylcclxuXHJcbiAgICB2YXIgdXB0aW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgICB1cHRpbWUuaW5uZXJIVE1MID0gJ1VwdGltZTogJyArIGsudXB0aW1lKGJvb3RfdGltZSlcclxuICAgIFxyXG4gICAgc3RhdHVzX2Rpdi5hcHBlbmRDaGlsZChjbG9jaylcclxuICAgIHN0YXR1c19kaXYuaW5uZXJIVE1MICs9ICcgfCAnXHJcbiAgICBzdGF0dXNfZGl2LmFwcGVuZENoaWxkKHVwdGltZSlcclxuICAgIHN0YXR1c19kaXYuaW5uZXJIVE1MICs9ICcgfCAnXHJcbn1cclxuXHJcbi8qXHJcbmsub2JqX2xvZyA9IGZ1bmN0aW9uKG9iaiwgb2JqX25hbWUsIG1heF9sZXZlbCl7XHJcbiAgICB2YXIgbGV2ZWxzID0gZnVuY3Rpb24ob2JqLCBsZXZlbF9pbmRlbnQsIHN0cil7XHJcbiAgICAgICAgZm9yKHZhciBuYW1lIGluIG9iaikge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IG9ialtuYW1lXVxyXG4gICAgICAgICAgICBpZiggbGV2ZWxfaW5kZW50IDw9IG1heF9sZXZlbCAmJiB0eXBlb2YoaXRlbSkgPT0gJ29iamVjdCcgKSB7XHJcbiAgICAgICAgICAgICAgICBzdHIgKz0gXCJcXG5cIiArIGsuc3RyX3JlcGVhdChcIiBcIiwgbGV2ZWxfaW5kZW50KjIpICsgbmFtZSBcclxuICAgICAgICAgICAgICAgIHN0ciA9IGxldmVscyhpdGVtLCBsZXZlbF9pbmRlbnQrMSwgc3RyIClcclxuICAgICAgICAgICAgfSBlbHNlIGlmKHR5cGVvZiBpdGVtICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBzdHIgKz0gXCJcXG5cIiArIGsuc3RyX3JlcGVhdChcIiBcIiwgbGV2ZWxfaW5kZW50KjIpICsgbmFtZSArIFwiOiBcIiArIGl0ZW1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHN0ciArPSBcIlxcblwiICsgay5zdHJfcmVwZWF0KFwiIFwiLCBsZXZlbF9pbmRlbnQqMikgKyBuYW1lICsgXCI6IDxmdW5jdGlvbj5cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHJcclxuICAgIH1cclxuICAgIHZhciBtYXhfbGV2ZWwgPSBtYXhfbGV2ZWwgfHwgMTAwXHJcbiAgICBsb2cob2JqX25hbWUpXHJcbiAgICB2YXIgc3RyID0gJy0nICsgb2JqX25hbWUgKyAnLSdcclxuICAgIG1heF9sZXZlbCsrXHJcbiAgICBsZXZlbF9pbmRlbnQgPSAyXHJcbiAgICBzdHIgPSBsZXZlbHMob2JqLCBsZXZlbF9pbmRlbnQsIHN0cilcclxuICAgIGxvZyhzdHIpXHJcbn1cclxuXHJcblxyXG5rLm9ial90cmVlID0gZnVuY3Rpb24ob2JqLCB0aXRsZSl7XHJcbiAgICAvLyB0YWtlcyBhIGphdmFzY3JpcHQsIGFuZCByZXR1cmVucyBhIGpxdWVyeSBESVZcclxuICAgIHZhciBvYmpfZGl2ID0gJCgnPHByZT4nKSAvLy5hZGRDbGFzcygnYm94JylcclxuICAgIHZhciBsZXZlbHMgPSBmdW5jdGlvbihvYmosIGxldmVsX2luZGVudCl7KGxpbmUsIGNpcmNsZSwgdGV4dCApIFxyXG4gICAgICAgIHZhciBsaXN0ID0gW11cclxuICAgICAgICB2YXIgb2JqX2xlbmd0aCA9IDBcclxuICAgICAgICBmb3IoIHZhciBrZXkgaW4gb2JqKSB7b2JqX2xlbmd0aCsrfVxyXG4gICAgICAgIHZhciBjb3VudCA9IDAgICAgICAgICAgXHJcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gb2JqW2tleV1cclxuICAgICAgICAgICAgXHJcbi8vICAgICAgICAgICAgdmFyIGluZGVudF9zdHJpbmcgPSAnJm5ic3A7Jm5ic3A7Jm5ic3A7JiM5NDc0Jy5yZXBlYXQobGV2ZWwpICsgJyZuYnNwOyZuYnNwOyZuYnNwOydcclxuLy8gICAgICAgICAgICBpZihsZXZlbF9pbmRlbnQgPT09ICcnICl7XHJcbi8vICAgICAgICAgICAgICAgIG5leHRfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyZuYnNwOycgXHJcbi8vICAgICAgICAgICAgICAgIHRoaXNfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyZuYnNwOydcclxuLy8gICAgICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgICAgIGlmKGNvdW50ID09IG9ial9sZW5ndGgtMSApIHsgICAvLyBJZiBsYXN0IGl0ZW0sIGZpbnNoIHRyZWUgc2VjdGlvblxyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyZuYnNwOycgXHJcbiAgICAgICAgICAgICAgICB2YXIgdGhpc19sZXZlbF9pbmRlbnQgPSBsZXZlbF9pbmRlbnQgKyAnJm5ic3A7JiM5NDkyOyYjOTQ3MjsnIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7IFxyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyYjOTQ3NDsnIFxyXG4gICAgICAgICAgICAgICAgdmFyIHRoaXNfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyYjOTUwMDsmIzk0NzI7JyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKCB0eXBlb2YoaXRlbSkgPT0gJ29iamVjdCcgKXtcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaCggdGhpc19sZXZlbF9pbmRlbnQgKyBrZXkpXHJcbiAgICAgICAgICAgICAgICBsaXN0ID0gbGlzdC5jb25jYXQoIGxldmVscyhpdGVtLCBuZXh0X2xldmVsX2luZGVudCkgKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IGl0ZW0udG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLFwiIFwiKS5yZXBsYWNlKC9cXHMrL2csXCIgXCIpIC8vaHR0cDovL3d3dy50ZXh0Zml4ZXIuY29tL3R1dG9yaWFscy9qYXZhc2NyaXB0LWxpbmUtYnJlYWtzLnBocFxyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKHRoaXNfbGV2ZWxfaW5kZW50ICsga2V5K1wiOiBcIisgaXRlbSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbi8vICAgICAgICAgICAgbG9nKGtleSxsZXZlbClcclxuICAgICAgICAgICAgY291bnQrK1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3RcclxuICAgIH1cclxuICAgIFxyXG4gICAgdmFyIGxpc3QgPSBbdGl0bGVdLmNvbmNhdChsZXZlbHMob2JqLCcnKSlcclxuICAgIGxpc3QuZm9yRWFjaCggZnVuY3Rpb24obGluZSxrZXkpe1xyXG4gICAgICAgIG9ial9kaXYuYXBwZW5kKGxpbmUgKyAnPC9icj4nKVxyXG4gICAgfSlcclxuICAgIHJldHVybiBvYmpfZGl2XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbmsub2JqX2Rpc3BsYXkgPSBmdW5jdGlvbihvYmope1xyXG4gICAgZnVuY3Rpb24gbGV2ZWxzKG9iaixsZXZlbCl7XHJcbiAgICAvLyAgICB2YXIgc3Vib2JqX2RpdiA9ICQoJzxkaXY+JylcclxuICAgICAgICB2YXIgc3Vib2JqX3VsID0gJCgnPHVsPicpLmFkZENsYXNzKCd0cmVlJylcclxuXHJcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gb2JqW2tleV1cclxuICAgIC8vICAgICAgICBsb2coa2V5LCB0eXBlb2YoaXRlbSkpXHJcbiAgICAgICAgICAgIGlmKCB0eXBlb2YoaXRlbSkgPT0gJ29iamVjdCcgKXtcclxuICAgIC8vICAgICAgICAgICAgKCc8bGk+JykudGV4dChcIiZuYnNwO1wiLnJlcGVhdChsZXZlbCkgKyBrZXkpKVxyXG4gICAgICAgICAgICAgICAgKCc8bGk+JykudGV4dChrZXkpKVxyXG4gICAgICAgICAgICAgICAgc3Vib2JqX3VsLmFwcGVuZChsZXZlbHMoaXRlbSxsZXZlbCsxKSlcclxuICAgIC8vICAgICAgICAgICAgbG9nKFwiJm5ic3A7XCIucmVwZWF0KGxldmVsKSArIGtleSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgICAgc3Vib2JqX2Rpdi5hcHBlbmQoJzxzcGFuPicpLnRleHQoXCImbmJzcDtcIi5yZXBlYXQobGV2ZWwpICsga2V5K1wiOiBcIisgaXRlbSlcclxuICAgIC8vICAgICAgICAgICAgKCc8bGk+JykudGV4dChcIiZuYnNwO1wiLnJlcGVhdChsZXZlbCkgKyBrZXkgK1wiOiBcIisgaXRlbSkpXHJcbiAgICAgICAgICAgICAgICAoJzxsaT4nKS50ZXh0KGtleSArXCI6IFwiKyBpdGVtKSlcclxuICAgIC8vICAgICAgICAgICAgbG9nKFwiJm5ic3A7XCIucmVwZWF0KGxldmVsKSArIGtleStcIjogXCIrIGl0ZW0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN1Ym9ial91bFxyXG4gICAgfVxyXG4gICAgLy8gdGFrZXMgYSBqYXZhc2NyaXB0LCBhbmQgcmV0dXJlbnMgYSBqcXVlcnkgRElWXHJcbiAgICB2YXIgb2JqX2RpdiA9ICQoJzxkaXY+JykvLy5hZGRDbGFzcygnYm94JylcclxuICAgIFxyXG4gICAgb2JqX2Rpdi5hcHBlbmQobGV2ZWxzKG9iaiwwKSlcclxuICAgIHJldHVybiBvYmpfZGl2XHJcbn1cclxuXHJcbmsuc2hvd19vYmogPSBmdW5jdGlvbihjb250YWluZXJfaWQsIG9iaiwgbmFtZSl7XHJcbiAgICB2YXIgaWQgPSAnIycgKyBuYW1lXHJcbiAgICBpZiggISAkKGNvbnRhaW5lcl9pZCkuY2hpbGRyZW4oaWQpLmxlbmd0aCApIHsgXHJcbiAgICAgICAgKCc8ZGl2PicpLmF0dHIoJ2lkJywgbmFtZSkpIFxyXG4gICAgfVxyXG4gICAgdmFyIGJveCA9ICQoY29udGFpbmVyX2lkKS5jaGlsZHJlbihpZClcclxuICAgIGJveC5lbXB0eSgpXHJcbiAgICBcclxuICAgIHZhciBvYmpfZGl2ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnYm94JylcclxuICAgIG9ial9kaXYuYXBwZW5kKGsub2JqX3RyZWUob2JqLCBuYW1lKSlcclxuICAgIGJveC5hcHBlbmQob2JqX2RpdilcclxuICAgIFxyXG59XHJcblxyXG4qL1xyXG5rLmxvZ19vYmplY3RfdHJlZSA9IGZ1bmN0aW9uKGNvbXBvbmVudHMpe1xyXG4gICAgZm9yKCB2YXIgbWFrZSBpbiBjb21wb25lbnRzLm1vZHVsZXMgKXtcclxuICAgICAgICBpZiggY29tcG9uZW50cy5tb2R1bGVzLmhhc093blByb3BlcnR5KG1ha2UpKXtcclxuICAgICAgICAgICAgZm9yKCB2YXIgbW9kZWwgaW4gY29tcG9uZW50cy5tb2R1bGVzW21ha2VdICl7XHJcbiAgICAgICAgICAgICAgICBpZiggY29tcG9uZW50cy5tb2R1bGVzW21ha2VdLmhhc093blByb3BlcnR5KG1vZGVsKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSBjb21wb25lbnRzLm1vZHVsZXNbbWFrZV1bbW9kZWxdXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGEgPSBbbWFrZSxtb2RlbF1cclxuICAgICAgICAgICAgICAgICAgICBmb3IoIHZhciBzcGVjIGluIG8gKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIG8uaGFzT3duUHJvcGVydHkoc3BlYykpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYS5wdXNoKG9bc3BlY10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGxvZyhhLmpvaW4oJywnKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEZTRUMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG5cclxuXHJcbmsuY3IxMDAwX2pzb24gPSBmdW5jdGlvbihqc29uKXtcclxuLy8gICAgdmFyIGZpZWxkcyA9IFtdXHJcbi8vICAgICQuZWFjaChqc29uLmhlYWQuZmllbGRzLCBmdW5jdGlvbihrZXksIGZpZWxkKSB7XHJcbi8vICAgICAgICBmaWVsZHMucHVzaChmaWVsZC5uYW1lKVxyXG4vLyAgICB9KVxyXG4vLyAgICB2YXIgZGF0YSA9IF8uemlwKGZpZWxkcywganNvbi5kYXRhWzBdLnZhbHMpXHJcbi8vICAgIFxyXG4gICAgdmFyIHRpbWVzdGFtcCA9IGpzb24uZGF0YVswXS50aW1lXHJcbiAgICB2YXIgZGF0YSA9IHt9XHJcbiAgICBkYXRhLlRpbWVzdGFtcCA9IGpzb24uZGF0YVswXS50aW1lXHJcbiAgICBkYXRhLlJlY29yZE51bSA9IGpzb24uZGF0YVswXS5ub1xyXG4gICAgZm9yKHZhciBpID0gMCwgbCA9IGpzb24uaGVhZC5maWVsZHMubGVuZ3RoOyBpIDwgbDsgaSsrICl7XHJcbiAgICAgICAgZGF0YVtqc29uLmhlYWQuZmllbGRzW2ldLm5hbWVdID0ganNvbi5kYXRhWzBdLnZhbHNbaV1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIGRhdGFcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRDMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcblxyXG5rLmQzID0ge31cclxuXHJcbmsuZDMubGl2ZV9zcGFya2xpbmUgPSBmdW5jdGlvbihpZCwgaGlzdG9yeSkge1xyXG4gICAgdmFyIGRhdGEgPSBoaXN0b3J5LmFycmF5XHJcbiAgICB2YXIgbGVuZ3RoID0gaGlzdG9yeS5hcnJheS5sZW5ndGhcclxuICAgIHZhciBuID0gaGlzdG9yeS5uXHJcbiAgICAvL2suZDMubGl2ZV9zcGFya2xpbmUgPSBmdW5jdGlvbihpZCwgd2lkdGgsIGhlaWdodCwgaW50ZXJwb2xhdGlvbiwgYW5pbWF0ZSwgdXBkYXRlRGVsYXksIHRyYW5zaXRpb25EZWxheSkge1xyXG4gICAgLy8gYmFzZWQgb24gY29kZSBwb3N0ZWQgYnkgQmVuIENocmlzdGVuc2VuIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2JlbmpjaHJpc3RlbnNlbi8xMTQ4Mzc0XHJcbiAgICBcclxuICAgIHZhciB3aWR0aCA9IDQwMCxcclxuICAgICAgICBoZWlnaHQgPSA1MCxcclxuICAgICAgICBpbnRlcnBvbGF0aW9uID0gJ2Jhc2lzJyxcclxuICAgICAgICBhbmltYXRlID0gdHJ1ZSxcclxuICAgICAgICB1cGRhdGVEZWxheSA9IDEwMDAsXHJcbiAgICAgICAgdHJhbnNpdGlvbkRlbGF5ID0gMTAwMFxyXG4gICAgXHJcbiAgICAvLyBYIHNjYWxlIHdpbGwgZml0IHZhbHVlcyBmcm9tIDAtMTAgd2l0aGluIHBpeGVscyAwLTEwMFxyXG4gICAgLy8gc3RhcnRpbmcgcG9pbnQgaXMgLTUgc28gdGhlIGZpcnN0IHZhbHVlIGRvZXNuJ3Qgc2hvdyBhbmQgc2xpZGVzIG9mZiB0aGUgZWRnZSBhcyBwYXJ0IG9mIHRoZSB0cmFuc2l0aW9uXHJcbiAgICB2YXIgeCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgNTldKS5yYW5nZShbMCwgd2lkdGhdKTsgXHJcbiAgICAvLyBZIHNjYWxlIHdpbGwgZml0IHZhbHVlcyBmcm9tIDAtMTAgd2l0aGluIHBpeGVscyAwLTEwMFxyXG4gICAgdmFyIHkgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzIwLCA0MF0pLnJhbmdlKFtoZWlnaHQsIDBdKTtcclxuXHJcbiAgICAvLyBjcmVhdGUgYSBsaW5lIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgdGhlIFNWTiBsaW5lIHdlJ3JlIGNyZWF0aW5nXHJcbiAgICB2YXIgbGluZSA9IGQzLnN2Zy5saW5lKClcclxuICAgICAgICAvLyBhc3NpZ24gdGhlIFggZnVuY3Rpb24gdG8gcGxvdCBvdXIgbGluZSBhcyB3ZSB3aXNoXHJcbiAgICAgICAgLngoZnVuY3Rpb24oZCxpKSB7IFxyXG4gICAgICAgICAgICAvLyB2ZXJib3NlIGxvZ2dpbmcgdG8gc2hvdyB3aGF0J3MgYWN0dWFsbHkgYmVpbmcgZG9uZVxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdQbG90dGluZyBYIHZhbHVlIGZvciBkYXRhIHBvaW50OiAnICsgZCArICcgdXNpbmcgaW5kZXg6ICcgKyBpICsgJyB0byBiZSBhdDogJyArIHgoaSkgKyAnIHVzaW5nIG91ciB4U2NhbGUuJyk7XHJcbiAgICAgICAgICAgIC8vIHJldHVybiB0aGUgWCBjb29yZGluYXRlIHdoZXJlIHdlIHdhbnQgdG8gcGxvdCB0aGlzIGRhdGFwb2ludFxyXG4gICAgICAgICAgICByZXR1cm4geChpKTsgXHJcbiAgICAgICAgfSlcclxuICAgICAgICAueShmdW5jdGlvbihkKSB7IFxyXG4gICAgICAgICAgICAvLyB2ZXJib3NlIGxvZ2dpbmcgdG8gc2hvdyB3aGF0J3MgYWN0dWFsbHkgYmVpbmcgZG9uZVxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdQbG90dGluZyBZIHZhbHVlIGZvciBkYXRhIHBvaW50OiAnICsgZCArICcgdG8gYmUgYXQ6ICcgKyB5KGQpICsgXCIgdXNpbmcgb3VyIHlTY2FsZS5cIik7XHJcbiAgICAgICAgICAgIC8vIHJldHVybiB0aGUgWSBjb29yZGluYXRlIHdoZXJlIHdlIHdhbnQgdG8gcGxvdCB0aGlzIGRhdGFwb2ludFxyXG4gICAgICAgICAgICByZXR1cm4geShkKTsgXHJcbiAgICAgICAgfSlcclxuICAgICAgICAuaW50ZXJwb2xhdGUoaW50ZXJwb2xhdGlvbilcclxuXHJcbiAgICAvLyBJZiBzdmcgZG9lcyBub3QgZXhpc3QsIGNyZWF0ZSBpdFxyXG4gICAgaWYoICEgZDMuc2VsZWN0KCcjJytpZCkuc2VsZWN0KCdzdmcnKVswXVswXSApe1xyXG4gICAgICAgIC8vIGNyZWF0ZSBhbiBTVkcgZWxlbWVudCBpbnNpZGUgdGhlICNncmFwaCBkaXYgdGhhdCBmaWxscyAxMDAlIG9mIHRoZSBkaXZcclxuICAgICAgICB2YXIgZ3JhcGggPSBkMy5zZWxlY3QoJyMnK2lkKS5hcHBlbmQoXCJzdmc6c3ZnXCIpLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCkuYXR0cihcImhlaWdodFwiLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICAvLyBkaXNwbGF5IHRoZSBsaW5lIGJ5IGFwcGVuZGluZyBhbiBzdmc6cGF0aCBlbGVtZW50IHdpdGggdGhlIGRhdGEgbGluZSB3ZSBjcmVhdGVkIGFib3ZlXHJcbi8vICAgICAgICBncmFwaC5hcHBlbmQoXCJzdmc6cGF0aFwiKS5hdHRyKFwiZFwiLCBsaW5lKGRhdGEpKTtcclxuICAgICAgICAvLyBvciBpdCBjYW4gYmUgZG9uZSBsaWtlIHRoaXNcclxuICAgICAgICBncmFwaC5zZWxlY3RBbGwoXCJwYXRoXCIpLmRhdGEoW2RhdGFdKS5lbnRlcigpLmFwcGVuZChcInN2ZzpwYXRoXCIpLmF0dHIoXCJkXCIsIGxpbmUpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB2YXIgZ3JhcGggPSBkMy5zZWxlY3QoJyMnK2lkKycgc3ZnJylcclxuICAgIGxvZyggbGVuZ3RoKVxyXG4gICAgLy8gdXBkYXRlIHdpdGggYW5pbWF0aW9uXHJcbiAgICBncmFwaC5zZWxlY3RBbGwoXCJwYXRoXCIpXHJcbiAgICAgICAgLmRhdGEoW2RhdGFdKSAvLyBzZXQgdGhlIG5ldyBkYXRhXHJcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyB4KG4tbGVuZ3RoICsxKSArIFwiKVwiKSAvLyBzZXQgdGhlIHRyYW5zZm9ybSB0byB0aGUgcmlnaHQgYnkgeCgxKSBwaXhlbHMgKDYgZm9yIHRoZSBzY2FsZSB3ZSd2ZSBzZXQpIHRvIGhpZGUgdGhlIG5ldyB2YWx1ZVxyXG4gICAgICAgIC5hdHRyKFwiZFwiLCBsaW5lKSAvLyBhcHBseSB0aGUgbmV3IGRhdGEgdmFsdWVzIC4uLiBidXQgdGhlIG5ldyB2YWx1ZSBpcyBoaWRkZW4gYXQgdGhpcyBwb2ludCBvZmYgdGhlIHJpZ2h0IG9mIHRoZSBjYW52YXNcclxuICAgICAgICAudHJhbnNpdGlvbigpIC8vIHN0YXJ0IGEgdHJhbnNpdGlvbiB0byBicmluZyB0aGUgbmV3IHZhbHVlIGludG8gdmlld1xyXG4gICAgICAgIC5lYXNlKFwibGluZWFyXCIpXHJcbiAgICAgICAgLmR1cmF0aW9uKHRyYW5zaXRpb25EZWxheSkgLy8gZm9yIHRoaXMgZGVtbyB3ZSB3YW50IGEgY29udGludWFsIHNsaWRlIHNvIHNldCB0aGlzIHRvIHRoZSBzYW1lIGFzIHRoZSBzZXRJbnRlcnZhbCBhbW91bnQgYmVsb3dcclxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIHgobi1sZW5ndGgpICsgXCIpXCIpOyAvLyBhbmltYXRlIGEgc2xpZGUgdG8gdGhlIGxlZnQgYmFjayB0byB4KDApIHBpeGVscyB0byByZXZlYWwgdGhlIG5ldyB2YWx1ZVxyXG5cclxuICAgICAgICAvKiB0aGFua3MgdG8gJ2JhcnJ5bScgZm9yIGV4YW1wbGVzIG9mIHRyYW5zZm9ybTogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vMTEzNzEzMSAqL1xyXG4vLyAgICAgZ3JhcGguYXBwZW5kKFwicmVjdFwiKVxyXG4vLyAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuLy8gICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbi8vICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodClcclxuLy8gICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcclxuLy8gICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsICcjZjAwJylcclxuLy8gICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIm5vbmVcIilcclxuLy8gICAgICAgICAgLnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsICcxcHgnKVxyXG4gICAgIFxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEV2ZW50cyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmsuZSA9IHt9XHJcblxyXG5rLnVwdGltZSA9IGZ1bmN0aW9uKGJvb3RfdGltZSl7XHJcbiAgICB2YXIgdXB0aW1lX3NlY29uZHNfdG90YWwgPSBtb21lbnQoKS5kaWZmKGJvb3RfdGltZSwgJ3NlY29uZHMnKVxyXG4gICAgdmFyIHVwdGltZV9ob3VycyA9IE1hdGguZmxvb3IoICB1cHRpbWVfc2Vjb25kc190b3RhbCAvKDYwKjYwKSApXHJcbiAgICB2YXIgbWludXRlc19sZWZ0ID0gdXB0aW1lX3NlY29uZHNfdG90YWwgJSg2MCo2MClcclxuICAgIHZhciB1cHRpbWVfbWludXRlcyA9IGsucGFkX3plcm8oIE1hdGguZmxvb3IoICBtaW51dGVzX2xlZnQgLzYwICksIDIgKVxyXG4gICAgdmFyIHVwdGltZV9zZWNvbmRzID0gay5wYWRfemVybyggKG1pbnV0ZXNfbGVmdCAlIDYwKSwgMiApXHJcbiAgICByZXR1cm4gdXB0aW1lX2hvdXJzICtcIjpcIisgdXB0aW1lX21pbnV0ZXMgK1wiOlwiKyB1cHRpbWVfc2Vjb25kc1xyXG59XHJcblxyXG5rLmUuYWRkVGltZVNpbmNlID0gZnVuY3Rpb24oZXZlbnRfbGlzdCl7XHJcbiAgICBsb2cobW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREJykpXHJcbiAgICBsb2cobW9tZW50KCkuZnJvbU5vdygpKVxyXG4gICAgZXZlbnRfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICB2YXIgZGF0ZV9hcnJheSA9IGV2ZW50LmRhdGUuc3BsaXQoJy0nKS5tYXAoTnVtYmVyKVxyXG4gICAgICAgIHZhciB5ZWFyID0gZGF0ZV9hcnJheVswXVxyXG4gICAgICAgIHZhciBtb250aCA9IGRhdGVfYXJyYXlbMV1cclxuICAgICAgICB2YXIgZGF5ID0gZGF0ZV9hcnJheVsyXVxyXG4gICAgICAgIHZhciB0aGlzX3llYXIgPSBtb21lbnQoKS55ZWFyKClcclxuICAgICAgICBpZihtb21lbnQoKS5kaWZmKG1vbWVudChbdGhpc195ZWFyLCBtb250aC0xLCBkYXldKSwgJ2RheXMnKSA+IDApIHt0aGlzX3llYXIrK31cclxuICAgICAgICB2YXIgZXZlbnRfbW9tZW50ID0gbW9tZW50KGV2ZW50LmRhdGUsICdZWVlZLU1NLUREJylcclxuICAgICAgICB2YXIgZGF5c19hZ28gPSBtb21lbnQoKS5kaWZmKGV2ZW50X21vbWVudCwgJ2RheScpXHJcbiAgICAgICAgZXZlbnQudGltZV9zaW5jZSA9IGV2ZW50X21vbWVudC5mcm9tTm93KClcclxuICAgICAgICBldmVudC55ZWFyc19hZ28gPSBtb21lbnQoKS5kaWZmKGV2ZW50X21vbWVudCwgJ3llYXJzJylcclxuICAgICAgICBldmVudC5kYXlzX3RpbGxfbmV4dCA9IC1tb21lbnQoKS5kaWZmKG1vbWVudChbdGhpc195ZWFyLCBtb250aC0xLCBkYXldKSwgJ2RheXMnKVxyXG4gICAgfSlcclxuICAgIGV2ZW50X2xpc3Quc29ydChmdW5jdGlvbihhLGIpe1xyXG4gICAgICAgIHJldHVybiBhLmRheXNfdGlsbF9uZXh0IC0gYi5kYXlzX3RpbGxfbmV4dFxyXG4gICAgfSlcclxuICAgIHJldHVybiBldmVudF9saXN0XHJcbn0gXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRGlzcGxheXMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuay5kID0ge31cclxuXHJcbi8qXHJcbmsuZCA9IHtcclxuICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICB2YWx1ZTogMCxcclxuICAgIFxyXG59XHJcblxyXG5rLmQucHJvdG90eXBlLnNldFBlciA9IGZ1bmN0aW9uKHBlcmNlbnQpe1xyXG4gICAgdGhpcy5iYXIuY3NzKCd3aWR0aCcsIHBlcmNlbnQrJyUnKVxyXG59XHJcbiovXHJcblxyXG5cclxuLypcclxuay5kLmJhciA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgYmFyID0ge31cclxuXHJcbiAgICBiYXIud2lkdGggPSAxMDBcclxuICAgIGJhci53aWR0aF91bml0ID0gJyUnIFxyXG4gICAgYmFyLmhlaWdodCA9ICc4cHgnICAgIFxyXG5cclxuICAgIGxvZyhiYXIud2lkdGgrJyUnKVxyXG4gICAgYmFyLmRpdiA9ICQoJzxkaXY+JykuY3NzKCd3aWR0aCcsICcwJScpXHJcbiAgICBiYXIuZWxlbWVudCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ3Byb2dyZXNzYmFyJykuY3NzKCd3aWR0aCcsIDEwMClcclxuICAgIGJhci5lbGVtZW50LmFwcGVuZChiYXIuZGl2KVxyXG5cclxuICAgIGJhci5zZXRQZXJjZW50ID0gZnVuY3Rpb24ocGVyY2VudCl7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHBlcmNlbnRcclxuICAgICAgICB0aGlzLndpZHRoX3VuaXQgPSAnJSdcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcbiAgICBiYXIudXBkYXRlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGlzLmRpdi5jc3MoJ3dpZHRoJywgdGhpcy53aWR0aCt0aGlzLndpZHRoX3VuaXQpXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNzcygnaGVpZ2h0JywgdG9TdHJpbmcodGhpcy5oZWlnaHQpKydweCcpXHJcbiAgICB9IFxyXG4gICAgcmV0dXJuIGJhclxyXG59XHJcbiovXHJcblxyXG5cclxuLy8gQnJvd3NlcmlmeVxyXG5tb2R1bGUuZXhwb3J0cyA9IGs7XHJcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBsb2cgPSBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xuXG52YXIgdmFsdWUgPSByZXF1aXJlKCcuL2tfRE9NX2V4dHJhLmpzJykudmFsdWU7XG52YXIgc2VsZWN0b3IgPSByZXF1aXJlKCcuL2tfRE9NX2V4dHJhLmpzJykuc2VsZWN0b3I7XG4vL2xvZyggJ3ZhbHVlJywgdmFsdWUoKSApO1xuLy9sb2coICdzZWxlY3RvcicsIHNlbGVjdG9yKCkgKTsgdmFyIGsgPSByZXF1aXJlKCcuL2snKTsgLy92YXIgc2VsZWN0b3IgPSByZXF1aXJlKCcuL2tfRE9NX2V4dHJhLmpzJykuc2VsZWN0b3I7IFxuXG5cbnZhciB3cmFwcGVyX3Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vd3JhcHBlcl9wcm90b3R5cGUnKTtcblxuLypcbnZhciB3cmFwcGVyX3Byb3RvdHlwZSA9IHtcblxuICAgIGh0bWw6IGZ1bmN0aW9uKGh0bWwpe1xuICAgICAgIHRoaXMuZWxlbS5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgYXBwZW5kOiBmdW5jdGlvbihzdWJfZWxlbWVudCl7XG4gICAgICAgIHRoaXMuZWxlbS5hcHBlbmRDaGlsZChzdWJfZWxlbWVudC5lbGVtKTsgXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgYXBwZW5kVG86IGZ1bmN0aW9uKHBhcmVudF9lbGVtZW50KXtcbiAgICAgICAgcGFyZW50X2VsZW1lbnQuYXBwZW5kKHRoaXMpOyBcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBhdHRyOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSApe1xuICAgICAgICB2YXIgYXR0cmlidXRlTmFtZTtcbiAgICAgICAgaWYoIG5hbWUgPT09ICdjbGFzcycpe1xuICAgICAgICAgICAgYXR0cmlidXRlTmFtZSA9ICdjbGFzc05hbWUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0cmlidXRlTmFtZSA9IG5hbWU7IFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbVthdHRyaWJ1dGVOYW1lXSA9IHZhbHVlOyBcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuXG5cbn07XG4qL1xuXG52YXIgV3JhcCA9IGZ1bmN0aW9uKGVsZW1lbnQpe1xuICAgIHZhciBXID0gT2JqZWN0LmNyZWF0ZSh3cmFwcGVyX3Byb3RvdHlwZSk7XG5cblxuICAgIFcuZWxlbSA9IGVsZW1lbnQ7XG4gICAgaWYoIFcuZWxlbS50YWdOYW1lID09PSBcIlNFTEVDVFwiICkge1xuICAgICAgICBXLnNldE9wdGlvbnMgPSBmdW5jdGlvbiggb3B0aW9uX2FycmF5ICkge1xuICAgICAgICAgICAgVy5lbGVtLm9wdGlvbnMubGVuZ3RoID0gMDsgXG4gICAgICAgICAgICAvL2xvZyhcIm9wdGlvbl9hcnJheVwiLCBvcHRpb25fYXJyYXkpO1xuICAgICAgICAgICAgb3B0aW9uX2FycmF5LmZvckVhY2goIGZ1bmN0aW9uKG9wdGlvbl9zdHIsaSl7XG4gICAgICAgICAgICAgICAgdmFyIG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICAgICAgICAgIG9wdC50ZXh0ID0gb3B0aW9uX3N0cjtcbiAgICAgICAgICAgICAgICBvcHQudmFsdWUgPSBvcHRpb25fc3RyO1xuICAgICAgICAgICAgICAgIFcuZWxlbS5hZGQob3B0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBXO1xuXG59O1xuXG52YXIgJCA9IGZ1bmN0aW9uKGlucHV0KXtcbiAgICB2YXIgZWxlbWVudDtcblxuICAgIGlmKCB0eXBlb2YgaW5wdXQgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAvL2xvZygnaW5wdXQgbmVlZGVkJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYoIGlucHV0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgKXtcbiAgICAgICAgcmV0dXJuIFdyYXAoaW5wdXQpO1xuICAgIH1cbiAgICBpZiggaW5wdXQuc3Vic3RyKDAsMSkgPT09ICcjJyApIHtcbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlucHV0LnN1YnN0cigxKSk7XG4gICAgICAgIHJldHVybiBXcmFwKGVsZW1lbnQpO1xuICAgIH0gZWxzZSBpZiggaW5wdXQuc3Vic3RyKDAsMSkgPT09ICcuJyApIHtcbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUNsYXNzTmFtZShpbnB1dC5zdWJzdHIoMSlbMF0pO1xuICAgICAgICByZXR1cm4gV3JhcChlbGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiggaW5wdXQgPT09ICd2YWx1ZScgKSB7XG4gICAgICAgICAgICBpZiggdmFsdWUgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gdmFsdWUoKTsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IHZhbHVlIG5vdCBkZWZpbmVkXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmKCBpbnB1dCA9PT0gJ3NlbGVjdG9yJyApIHtcbiAgICAgICAgICAgIGlmKCBzZWxlY3RvciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBzZWxlY3RvcigpOyBcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogc2VsZWN0b3Igbm90IGRlZmluZWRcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuIFdyYXAoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG5cblxufTtcblxuLy8gQnJvd3NlcmlmeVxubW9kdWxlLmV4cG9ydHMgPSAkO1xuLy9tb2R1bGUuZXhwb3J0cy53cmFwcGVyX3Byb3RvdHlwZSA9IHdyYXBwZXJfcHJvdG90eXBlO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGxvZyA9IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XG5cbnZhciBrID0gcmVxdWlyZSgnLi9rLmpzJyk7XG52YXIga29udGFpbmVyID0gcmVxdWlyZSgnLi9rb250YWluZXInKTtcblxudmFyIGtfRE9NID0gcmVxdWlyZSgnLi9rX0RPTS5qcycpO1xudmFyIHdyYXBwZXJfcHJvdG90eXBlID0gcmVxdWlyZSgnLi93cmFwcGVyX3Byb3RvdHlwZScpO1xuXG5cblxuXG5cblxudmFyIHNlbGVjdG9yX3Byb3RvdHlwZSA9IHtcbiAgICBjaGFuZ2U6IGZ1bmN0aW9uKG5ld192YWx1ZSl7XG4gICAgICAgIGlmKCBuZXdfdmFsdWUgIT09IHVuZGVmaW5lZCApIHsgXG4gICAgICAgICAgICB0aGlzLnNldF92YWx1ZShuZXdfdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXhwYW5kZWQgPSAhdGhpcy5leHBhbmRlZDtcbiAgICAgICAgaWYoIHRoaXMuZ191cGRhdGUgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgdGhpcy5nX3VwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRfdmFsdWU6IGZ1bmN0aW9uKG5ld192YWx1ZSl7XG4gICAgICAgIGlmKCBuZXdfdmFsdWUgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIGxvZyggJ25ldyB2YWx1ZScsdGhpcy5rb250YWluZXIucmVmU3RyaW5nLCAgbmV3X3ZhbHVlKVxuICAgICAgICAgICAgdGhpcy5rb250YWluZXIuc2V0KG5ld192YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtX3ZhbHVlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICB0aGlzLmVsZW1fdmFsdWUuaHJlZiA9ICcjJztcbiAgICAgICAgdGhpcy5lbGVtX3ZhbHVlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VsZWN0b3InKTtcbiAgICAgICAgLy90aGlzLmVsZW1fdmFsdWUuaW5uZXJIVE1MID0gdGhpcy5rb250YWluZXIuZ2V0KCk7XG4gICAgICAgIHRoaXMuZWxlbV92YWx1ZS5pbm5lckhUTUwgPSB0aGlzLmtvbnRhaW5lci5nZXQoKTtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB0aGlzLmVsZW1fdmFsdWUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhhdC5sb2NhdGlvbiA9IHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICB0aGF0LmNoYW5nZSgpO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIC8vc2V0dGluZ3ModGhpcy5zZXR0aW5nLCB0aGlzLnZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7ICAgIFxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpe1xuICAgICAgICAvL2xvZygndXBkYXRpbmc6ICcsIHRoaXMpXG4gICAgICAgIHRoaXMudXBkYXRlX29wdGlvbnMoKTtcbiAgICAgICAgdGhpcy5zZXRfdmFsdWUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVfZWxlbWVudHMoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICB1cGRhdGVfb3B0aW9uczogZnVuY3Rpb24oKXtcbiAgICAgICAgLy9UT0RPOiBmaW5kIHdheSB0byBkbyB0aGlzIG90aGVyIHRoYW4gZXZhbFxuICAgICAgICBpZiggdGhpcy5vcHRpb25zS29udGFpbmVyLnJlYWR5ICkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gdGhpcy5vcHRpb25zS29udGFpbmVyLmdldCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCB0aGlzLm9wdGlvbnMgIT09IHVuZGVmaW5lZCAmJiB0aGlzLm9wdGlvbnMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgdGhpcy5lbGVtX29wdGlvbnMuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAvL2xvZygnb3B0aW9uczonLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmZvckVhY2goZnVuY3Rpb24odmFsdWUsaWQpe1xuICAgICAgICAgICAgICAgIHZhciBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgICAgICAgICAgIG8uaHJlZiA9ICcjJztcbiAgICAgICAgICAgICAgICBvLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VsZWN0b3Jfb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgby5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuY2hhbmdlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtX29wdGlvbnMuYXBwZW5kQ2hpbGQobyk7XG5cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgaWYoICEgKHRoaXMub3B0aW9ucy5pbmRleE9mKHRoaXMua29udGFpbmVyLmdldCgpKSsxKSApe1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0X3ZhbHVlKHRoaXMub3B0aW9uc1swXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICB1cGRhdGVfZWxlbWVudHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZih0aGlzLmV4cGFuZGVkKXtcbiAgICAgICAgICAgIHRoaXMuZWxlbS5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgdGhpcy5lbGVtLmFwcGVuZENoaWxkKHRoaXMuZWxlbV9vcHRpb25zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbS5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICAgICAgdGhpcy5lbGVtLmFwcGVuZENoaWxkKHRoaXMuZWxlbV92YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldFVwZGF0ZTogZnVuY3Rpb24odXBkYXRlX2Z1bmN0aW9uKXtcbiAgICAgICAgdGhpcy5nX3VwZGF0ZSA9IHVwZGF0ZV9mdW5jdGlvbjsgXG4gICAgICAgIHJldHVybiB0aGlzOyAgICBcbiAgICB9LFxuICAgIHNldFJlZjogZnVuY3Rpb24ocmVmU3RyaW5nKXtcbiAgICAgICAgdGhpcy5yZWZTdHJpbmcgPSByZWZTdHJpbmc7XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmVmT2JqZWN0ICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyID0gT2JqZWN0LmNyZWF0ZShrb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIucmVmKHRoaXMucmVmU3RyaW5nKTtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldFJlZk9iajogZnVuY3Rpb24ocmVmT2JqZWN0KXtcbiAgICAgICAgdGhpcy5yZWZPYmplY3QgPSByZWZPYmplY3Q7XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmVmU3RyaW5nICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyID0gT2JqZWN0LmNyZWF0ZShrb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIucmVmKHRoaXMucmVmU3RyaW5nKTtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMub3B0aW9uc0tvbnRhaW5lciA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmVmT3B0aW9uc1N0cmluZyAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNLb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMub3B0aW9uc0tvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zS29udGFpbmVyLnJlZih0aGlzLnJlZk9wdGlvbnNTdHJpbmcpO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zS29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXRPcHRpb25zUmVmOiBmdW5jdGlvbihyZWZTdHJpbmcpe1xuICAgICAgICB0aGlzLnJlZk9wdGlvbnNTdHJpbmcgPSByZWZTdHJpbmc7XG4gICAgICAgIGlmKCB0aGlzLm9wdGlvbnNLb250YWluZXIgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlZk9iamVjdCAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNLb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMub3B0aW9uc0tvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zS29udGFpbmVyLnJlZih0aGlzLnJlZk9wdGlvbnNTdHJpbmcpO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zS29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxufTtcbmZvciggdmFyIGlkIGluIHdyYXBwZXJfcHJvdG90eXBlICkge1xuICAgIGlmKCB3cmFwcGVyX3Byb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShpZCkgKSB7XG4gICAgICAgIHNlbGVjdG9yX3Byb3RvdHlwZVtpZF0gPSB3cmFwcGVyX3Byb3RvdHlwZVtpZF07IFxuICAgIH1cbn1cblxudmFyIHNlbGVjdG9yID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgcyA9IE9iamVjdC5jcmVhdGUoc2VsZWN0b3JfcHJvdG90eXBlKTtcbiAgICBzLnR5cGUgPSAnc2VsZWN0b3InO1xuICAgIHMuZXhwYW5kZWQgPSBmYWxzZTtcbiAgICBzLmVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgcy5lbGVtLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VsZWN0b3JfbWVudScpO1xuXG4gICAgcy5lbGVtX29wdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgcy5lbGVtX3ZhbHVlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHMuZWxlbV92YWx1ZS5pbm5lckhUTUwgPSAnLSc7XG4gICAgXG4gICAgcmV0dXJuIHM7XG59O1xuXG5cblxuXG5cbnZhciB2YWx1ZV9wcm90b3R5cGUgPSB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbigpe1xuICAgICAgICAvL2xvZygncnVubmluZyB2YWx1ZSB1cGRhdGUnLCB0aGlzKVxuICAgICAgICAvKlxuICAgICAgICBpZiggdGhpcy5nX3VwZGF0ZSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLmdfdXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgKi9cbiAgICAgICAgaWYoIHR5cGVvZiB0aGlzLmtvbnRhaW5lciAhPT0gJ3VuZGVmaW5lZCcgKXtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLmtvbnRhaW5lci5nZXQoKTtcbiAgICAgICAgICAgIC8vbG9nKCd1cGRhdGluZyB2YWx1ZScsIHRoaXMudmFsdWUpXG4gICAgICAgIH1cbiAgICAgICAgaWYoIGlzTmFOKE51bWJlcih0aGlzLnZhbHVlKSkgKXtcbiAgICAgICAgICAgIHRoaXMuZWxlbS5pbm5lckhUTUwgPSB0aGlzLnZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtLmlubmVySFRNTCA9IE51bWJlcih0aGlzLnZhbHVlKS50b0ZpeGVkKDMpO1xuICAgICAgICAgICAgaWYoIHRoaXMubWluICE9PSB1bmRlZmluZWQgJiYgdGhpcy52YWx1ZSA8PSB0aGlzLm1pbiApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHIoJ2NsYXNzJywgJ3ZhbHVlT3V0T2ZSYW5nZScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKCB0aGlzLm1heCAhPT0gdW5kZWZpbmVkICYmIHRoaXMudmFsdWUgPj0gdGhpcy5tYXggKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyKCdjbGFzcycsICd2YWx1ZU91dE9mUmFuZ2UnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyKCdjbGFzcycsICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24obmV3X3ZhbHVlKSB7XG4gICAgICAgIGlmKCB0eXBlb2YgbmV3X3ZhbHVlICE9PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IG5ld192YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuLy8gICAgc2V0VXBkYXRlOiBmdW5jdGlvbih1cGRhdGVfZnVuY3Rpb24pe1xuLy8gICAgICAgIHRoaXMuZ191cGRhdGUgPSB1cGRhdGVfZnVuY3Rpb247IFxuLy8gICAgfSxcbiAgICBzZXRSZWY6IGZ1bmN0aW9uKHJlZlN0cmluZyl7XG4gICAgICAgIHRoaXMucmVmU3RyaW5nID0gcmVmU3RyaW5nO1xuICAgICAgICBpZiggdGhpcy5rb250YWluZXIgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlZk9iamVjdCAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lciA9IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiggdGhpcy5rb250YWluZXIgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLnJlZih0aGlzLnJlZlN0cmluZyk7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lci5vYmoodGhpcy5yZWZPYmplY3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXRSZWZPYmo6IGZ1bmN0aW9uKHJlZk9iamVjdCl7XG4gICAgICAgIHRoaXMucmVmT2JqZWN0ID0gcmVmT2JqZWN0O1xuICAgICAgICBpZiggdGhpcy5rb250YWluZXIgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlZlN0cmluZyAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lciA9IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiggdGhpcy5rb250YWluZXIgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLnJlZih0aGlzLnJlZlN0cmluZyk7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lci5vYmoodGhpcy5yZWZPYmplY3QpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0TWF4OiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgIHRoaXMubWF4ID0gdmFsdWU7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0TWluOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgIHRoaXMubWluID0gdmFsdWU7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG59O1xuZm9yKCB2YXIgaWQgaW4gd3JhcHBlcl9wcm90b3R5cGUgKSB7XG4gICAgaWYoIHdyYXBwZXJfcHJvdG90eXBlLmhhc093blByb3BlcnR5KGlkKSApIHtcbiAgICAgICAgdmFsdWVfcHJvdG90eXBlW2lkXSA9IHdyYXBwZXJfcHJvdG90eXBlW2lkXTsgXG4gICAgfVxufVxuXG5cblxuZnVuY3Rpb24gdmFsdWUoKSB7XG4gICAgdmFyIHYgPSBPYmplY3QuY3JlYXRlKHZhbHVlX3Byb3RvdHlwZSk7XG4gICAgdi50eXBlID0gJ3ZhbHVlJztcbiAgICB2LmVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cbiAgICB2LnZhbHVlID0gJy0nO1xuICAgIHYuaW5uZXJIVE1MID0gdi52YWx1ZTtcbiAgICB2LnJlZmVyZW5jZSA9IGZhbHNlO1xuXG5cbiAgICB2LnVwZGF0ZSgpO1xuXG4gICAgcmV0dXJuIHY7XG59XG5cblxuXG4vLyBCcm93c2VyaWZ5XG5tb2R1bGUuZXhwb3J0cy5zZWxlY3RvciA9IHNlbGVjdG9yO1xubW9kdWxlLmV4cG9ydHMudmFsdWUgPSB2YWx1ZTtcbi8vbW9kdWxlLmV4cG9ydHMuJCA9ICQ7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGtkYl9wcm90b3R5cGUgPSB7XG4gICAgc2V0X2ZpZWxkczogZnVuY3Rpb24oZmllbGRfYXJyYXkpIHtcbiAgICAgICAgdmFyIGxpc3Q7XG4gICAgICAgIGlmKCB0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnc3RyaW5nJyApIHsgIC8vIGVhY2ggYXJndW1lbnQgaXMgYSBmaWVsZFxuICAgICAgICAgICAgbGlzdCA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7IC8vY29udmVydCBhcmd1bWVudHMgdG8gYW4gYXJyYXlcbiAgICAgICAgfSBlbHNlIHsgLy8gYXNzdW1lZCBsaXN0IG9mIGZpZWxkc1xuICAgICAgICAgICAgbGlzdCA9IGFyZ3VtZW50WzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5maWVsZHMgPSBbXVxuICAgICAgICBsaXN0LmZvckVhY2goIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgICAgICAgICB0aGlzLmZpZWxkcy5wdXNoKGZpZWxkKSA7XG4gICAgICAgIH0sdGhpcykgXG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGFkZDogZnVuY3Rpb24oZW50cnkpIHtcbiAgICAgICAgdmFyIGxpc3Q7XG4gICAgICAgIHZhciBvYmogPSB7fTtcblxuICAgICAgICBpZiggT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGVudHJ5KSA9PT0gJ1tvYmplY3QgQXJyYXldJyApIHsgLy8gaWYgbGlzdCBpcyBzdWJtaXR0ZWRcbiAgICAgICAgICAgIGxpc3QgPSBhcmd1bWVudHNbMF07XG4gICAgICAgIH0gZWxzZSBpZiggT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGVudHJ5KSA9PT0gJ1tvYmplY3QgT2JqZWN0XScgKSB7IC8vIGlmIG9iamVjdCBpcyBzdWJtaXR0ZWRcbiAgICAgICAgICAgIG9iaiA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgfSBlbHNlIHsgIC8vIGVhY2ggYXJndW1lbnQgaXMgYSBmaWVsZDogc3RyaW5nLCBudW1iZXIsIGV0Yy5cbiAgICAgICAgICAgIGxpc3QgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpOyAvL2NvbnZlcnQgYXJndW1lbnRzIHRvIGFuIGFycmF5XG4gICAgICAgIH1cbiAgICAgICAgaWYoIGxpc3QgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIGxpc3QuZm9yRWFjaCggZnVuY3Rpb24oIHZhbHVlLCBpICkge1xuICAgICAgICAgICAgICAgIG9ialt0aGlzLmZpZWxkc1tpXV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sdGhpcykgXG4gICAgICAgIH1cblxuXG4gICAgICAgIHRoaXMucm93cy5wdXNoKG9iaik7XG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBDU1Y6IGZ1bmN0aW9uKHN0cmluZyl7XG4gICAgXG4gICAgXG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGZpZWxkLCB2YWx1ZSl7XG4gICAgICAgIC8vdmFyIGggPSB0aGlzLmZpZWxkcy5pbmRleE9mKGNvbHVtbik7XG4gICAgICAgIC8vbG9nKGgsIHRoaXMuZmllbGRzW2hdKVxuICAgICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICAgIHRoaXMucm93cy5mb3JFYWNoKCBmdW5jdGlvbihyb3csaWQpe1xuICAgICAgICAgICAgaWYoIHJvd1tmaWVsZF0gPT09IHZhbHVlICl7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2gocm93KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSx0aGlzKSAgICBcbiAgICAgICAgbG9nKG91dHB1dClcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9LFxuICAgIGNvbHVtbjogZnVuY3Rpb24oZmllbGQpe1xuICAgICAgICB2YXIgY29sdW1uID0gW107XG4gICAgICAgIHRoaXMucm93cy5mb3JFYWNoKCBmdW5jdGlvbihyb3cpe1xuICAgICAgICAgICAgY29sdW1uLnB1c2goIHJvd1tmaWVsZF0gKTtcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICB9LFxufVxuXG5cbmZ1bmN0aW9uIEtEQigpIHtcbiAgICB2YXIgZCA9IE9iamVjdC5jcmVhdGUoa2RiX3Byb3RvdHlwZSk7XG4gICAgXG4gICAgZC5yb3dzID0gW107XG5cblxuXG4gICAgcmV0dXJuIGQ7XG59XG5cblxuXG5cbiIsIid1c2Ugc3RyaWN0JztcbnZhciBsb2cgPSBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xuXG52YXIga29udGFpbmVyID0ge1xuICAgIHJlZjogZnVuY3Rpb24ocmVmU3RyaW5nKXtcbiAgICAgICAgaWYoIHR5cGVvZiByZWZTdHJpbmcgPT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWZTdHJpbmc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlZlN0cmluZyA9IHJlZlN0cmluZztcbiAgICAgICAgICAgIHRoaXMucmVmQXJyYXkgPSByZWZTdHJpbmcuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIGlmKCB0eXBlb2YgdGhpcy5vYmplY3QgIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBvYmo6IGZ1bmN0aW9uKG9iail7XG4gICAgICAgIGlmKCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vYmplY3QgPSBvYmo7XG4gICAgICAgICAgICBpZiggdHlwZW9mIHRoaXMucmVmU3RyaW5nICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbihpbnB1dCl7XG4gICAgICAgIC8vbG9nKCdrb250YWluZXIgc2V0dGluZyB0byAnLCB0aGlzLnJlZlN0cmluZywgaW5wdXQpXG4gICAgICAgIGlmKCB0eXBlb2YgdGhpcy5vYmplY3QgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiB0aGlzLnJlZlN0cmluZyA9PT0gJ3VuZGVmaW5lZCcgKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5vYmplY3Q7XG4gICAgICAgIHZhciBsYXN0X2xldmVsID0gdGhpcy5yZWZBcnJheVt0aGlzLnJlZkFycmF5Lmxlbmd0aC0xXTtcbiAgICAgICAgLy9sb2coJ2xhc3RfbGV2ZWwnLGxhc3RfbGV2ZWwpXG5cbiAgICAgICAgdGhpcy5yZWZBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldmVsX25hbWUsaSl7XG4gICAgICAgICAgICBpZiggdHlwZW9mIHBhcmVudFtsZXZlbF9uYW1lXSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50W2xldmVsX25hbWVdID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiggbGV2ZWxfbmFtZSAhPT0gbGFzdF9sZXZlbCApe1xuICAgICAgICAgICAgICAgIC8vbG9nKCdtb3ZpbmcgdG8gJywgbGV2ZWxfbmFtZSlcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnRbbGV2ZWxfbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvL2xvZygncGFyZW50JyxwYXJlbnQpO1xuICAgICAgICBwYXJlbnRbbGFzdF9sZXZlbF0gPSBpbnB1dDtcbiAgICAgICAgLy9sb2codGhpcy5nZXQoKSlcbiAgICAgICAgcmV0dXJuIHBhcmVudFtsYXN0X2xldmVsXTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGxldmVsID0gdGhpcy5vYmplY3Q7XG4gICAgICAgIHRoaXMucmVmQXJyYXkuZm9yRWFjaChmdW5jdGlvbihsZXZlbF9uYW1lLGkpe1xuICAgICAgICAgICAgaWYoIHR5cGVvZiBsZXZlbFtsZXZlbF9uYW1lXSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAgICAgLy9sb2coJ2tvbnRhaW5lcjogJytsZXZlbF9uYW1lKycgbm90IGRlZmluZWQnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXZlbCA9IGxldmVsW2xldmVsX25hbWVdO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGxldmVsO1xuICAgIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtvbnRhaW5lcjtcbiIsInZhciB3cmFwcGVyX3Byb3RvdHlwZSA9IHtcblxuICAgIGh0bWw6IGZ1bmN0aW9uKGh0bWwpe1xuICAgICAgIHRoaXMuZWxlbS5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgYXBwZW5kOiBmdW5jdGlvbihzdWJfZWxlbWVudCl7XG4gICAgICAgIHRoaXMuZWxlbS5hcHBlbmRDaGlsZChzdWJfZWxlbWVudC5lbGVtKTsgXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgYXBwZW5kVG86IGZ1bmN0aW9uKHBhcmVudF9lbGVtZW50KXtcbiAgICAgICAgcGFyZW50X2VsZW1lbnQuYXBwZW5kKHRoaXMpOyBcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBhdHRyOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSApe1xuICAgICAgICB2YXIgYXR0cmlidXRlTmFtZTtcbiAgICAgICAgaWYoIG5hbWUgPT09ICdjbGFzcycpe1xuICAgICAgICAgICAgYXR0cmlidXRlTmFtZSA9ICdjbGFzc05hbWUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0cmlidXRlTmFtZSA9IG5hbWU7IFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbVthdHRyaWJ1dGVOYW1lXSA9IHZhbHVlOyBcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qXG4gICAgcHVzaFRvOiBmdW5jdGlvbihhcnJheSl7XG4gICAgICAgIGFycmF5LnB1c2godGhpcyk7XG4gICAgfVxuICAgICovXG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gd3JhcHBlcl9wcm90b3R5cGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIGxvZyA9IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XHJcblxyXG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcclxudmFyIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG52YXIgayA9IHJlcXVpcmUoJy4vbGliL2svay5qcycpO1xyXG52YXIga19kYXRhID0gcmVxdWlyZSgnLi9saWIvay9rX2RhdGEuanMnKTtcclxudmFyICQgPSByZXF1aXJlKCcuL2xpYi9rL2tfRE9NJyk7XHJcblxyXG52YXIgc2V0dGluZ3MgPSByZXF1aXJlKCcuL2FwcC9zZXR0aW5ncy5qcycpO1xyXG52YXIgbG9hZFRhYmxlcyA9IHJlcXVpcmUoJy4vYXBwL3NldHRpbmdzX2Z1bmN0aW9ucycpLmxvYWRUYWJsZXM7XHJcbnZhciBsb2FkTW9kdWxlcyA9IHJlcXVpcmUoJy4vYXBwL3NldHRpbmdzX2Z1bmN0aW9ucycpLmxvYWRNb2R1bGVzO1xyXG52YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vYXBwL21rX2RyYXdpbmcuanMnKTtcclxudmFyIGRpc3BsYXlfc3ZnID0gcmVxdWlyZSgnLi9hcHAvZGlzcGxheV9zdmcuanMnKTtcclxudmFyIHVwZGF0ZV9zeXN0ZW0gPSByZXF1aXJlKCcuL2FwcC91cGRhdGVfc3lzdGVtJyk7XHJcbnZhciBzZXR0aW5ncyA9IHJlcXVpcmUoJy4vYXBwL3NldHRpbmdzLmpzJyk7XHJcblxyXG52YXIgY29tcG9uZW50cyA9IHNldHRpbmdzLmNvbXBvbmVudHM7XHJcbnZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBsb29rdXBMb2NhdGlvbihwb3NpdGlvbil7XHJcbiAgICB2YXIgdXJsID0gJ2h0dHA6Ly9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2dlb2NvZGUvanNvbj9sYXRsbmc9Jytwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUrJywnK3Bvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUrJyZzZW5zb3I9dHJ1ZSc7XHJcbiAgICBrLkFKQVgodXJsLCBzaG93TG9jYXRpb24pO1xyXG59XHJcbmZ1bmN0aW9uIHNob3dMb2NhdGlvbihsb2NhdGlvbl9qc29uKXtcclxuICAgIHZhciBsb2NhdGlvbiA9IEpTT04ucGFyc2UobG9jYXRpb25fanNvbik7XHJcbiAgICBsb2NhdGlvbi5yZXN1bHRzWzBdLmFkZHJlc3NfY29tcG9uZW50cy5mb3JFYWNoKCBmdW5jdGlvbihjb21wb25lbnQpe1xyXG4gICAgICAgIGlmKCBjb21wb25lbnQudHlwZXNbMF0gPT09IFwibG9jYWxpdHlcIiApIHtcclxuICAgICAgICAgICAgc3lzdGVtLmNpdHkgPSBjb21wb25lbnQubG9uZ19uYW1lIDtcclxuICAgICAgICAgICAgLy9sb2coJ2NpdHkgJywgc3lzdGVtLmNpdHkpIFxyXG4gICAgICAgIH0gZWxzZSBpZiggY29tcG9uZW50LnR5cGVzWzBdID09PSBcImFkbWluaXN0cmF0aXZlX2FyZWFfbGV2ZWxfMlwiICl7XHJcbiAgICAgICAgICAgIHN5c3RlbS5jb3VudHkgPSBjb21wb25lbnQubG9uZ19uYW1lIDtcclxuICAgICAgICAgICAgLy9sb2coJ2NvdW50eSAnLCBzeXN0ZW0uY291bnR5KVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgdXBkYXRlX3N5c3RlbShzZXR0aW5ncyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZSgpe1xyXG4gICAgbG9nKCd1cGRhdGluZycpO1xyXG5cclxuICAgIC8vIE1ha2Ugc3VyZSBzZWxlY3RvcnMgYW5kIHZhbHVlIGRpc3BsYXlzIGFyZSB1cGRhdGVkXHJcblxyXG4gICAgdXBkYXRlX3N5c3RlbShzZXR0aW5ncyk7XHJcbiAgICAvLyBkZWxldGUgYWxsIGVsZW1lbnRzIG9mIGRyYXdpbmcgXHJcbiAgICAvL2NsZWFyX2RyYXdpbmcoKTtcclxuXHJcbiAgICAvLyBSZWNhbGN1bGF0ZSBzeXN0ZW0gc3BlY3NcclxuICAgIC8vc2V0dGluZ3MgPSB1cGRhdGVfc3lzdGVtKHNldHRpbmdzKTtcclxuICAgIFxyXG4gICAgLy8gUmVjYWxjdWxhdGUgZHJhd2luZyByZWxhdGVkIHZhcmlhYmxlc1xyXG4gICAgLy91cGRhdGVfdmFsdWVzKCk7XHJcblxyXG4gICAgLy8gR2VuZXJhdGUgbmV3IGRyYXdpbmcgZWxlbWVudHNcclxuICAgIHNldHRpbmdzLmVsZW1lbnRzID0gbWtfZHJhd2luZyhzZXR0aW5ncyk7XHJcblxyXG4gICAgLy8gQWRkIGRyYXdpbmcgZWxlbWVudHMgdG8gU1ZHIG9uIHNjcmVlblxyXG4gICAgZGlzcGxheV9zdmcoc2V0dGluZ3MsIHN2Z19jb250YWluZXIpO1xyXG5cclxuICAgIHNldHRpbmdzLnJlZ2lzdHJ5LmZvckVhY2goZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgLy9sb2coJ3VwZGF0aW5nOiAnLCBpdGVtKVxyXG4gICAgICAgIGl0ZW0udXBkYXRlKCk7IFxyXG4gICAgfSk7XHJcbn1cclxuXHJcblxyXG4vL2suQUpBWCgnZGF0YS90YWJsZXMudHh0JywgbG9hZFRhYmxlcywgc2V0dGluZ3MpO1xyXG5rLkFKQVgoJ2RhdGEvdGFibGVzLnR4dCcsIHJlYWR5LCB7dHlwZTonbG9hZFRhYmxlcyd9KTtcclxuXHJcbi8vay5BSkFYKCAnZGF0YS9tb2R1bGVzLmNzdicsIGxvYWRNb2R1bGVzLCBzZXR0aW5ncyApO1xyXG5rLkFKQVgoICdkYXRhL21vZHVsZXMuY3N2JywgcmVhZHksIHt0eXBlOidsb2FkTW9kdWxlcyd9KTtcclxuXHJcblxyXG5cclxudmFyIHJlYWR5X2NvdW50ID0gMDtcclxuZnVuY3Rpb24gcmVhZHkoaW5wdXQsIGNvbmZpZyl7XHJcblxyXG4gICAgaWYoIGNvbmZpZy50eXBlID09PSAnbG9hZFRhYmxlcycpe1xyXG4gICAgICAgIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLk5FQ190YWJsZXMgPSBsb2FkVGFibGVzKGlucHV0KTtcclxuICAgICAgICByZWFkeV9jb3VudCsrO1xyXG4gICAgfVxyXG4gICAgaWYoIGNvbmZpZy50eXBlID09PSAnbG9hZE1vZHVsZXMnKXtcclxuICAgICAgICBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVzID0gbG9hZE1vZHVsZXMoaW5wdXQpO1xyXG4gICAgICAgIHJlYWR5X2NvdW50Kys7XHJcbiAgICB9XHJcbiAgICBpZiggcmVhZHlfY291bnQgPT09IDIgKXtcclxuICAgICAgICBsb2coJ3JlYWR5Jyk7XHJcbiAgICAgICAgdXBkYXRlKHNldHRpbmdzKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vICMgUGFnZSBzZXR1cFxyXG5cclxudmFyIHN2Z19jb250YWluZXJfaWQgPSAnc3ZnX2NvbnRhaW5lcic7XHJcbnZhciBzdmdfY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3ZnX2NvbnRhaW5lcl9pZCk7XHJcbnZhciBzeXN0ZW1fY29udGFpbmVyX2lkID0gJ3N5c3RlbV9jb250YWluZXInO1xyXG5cclxuXHJcbnZhciB0aXRsZSA9ICdQViBkcmF3aW5nIHRlc3QnO1xyXG5cclxuay5zZXR1cF9ib2R5KHRpdGxlKTtcclxudmFyIGRyYXdfcGFnZSA9ICQoJ2RpdicpLmF0dHIoJ2lkJywgJ2RyYXdpbmdfcGFnZScpO1xyXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRyYXdfcGFnZS5lbGVtKTtcclxuXHJcbnZhciBzeXN0ZW1fY29udGFpbmVyID0gJCgnZGl2JykuYXR0cignaWQnLCBzeXN0ZW1fY29udGFpbmVyX2lkKS5hcHBlbmRUbyhkcmF3X3BhZ2UpO1xyXG5cclxudmFyIHN2Z19jb250YWluZXJfb2JqZWN0ID0gJCgnZGl2JykuYXR0cignaWQnLCBzdmdfY29udGFpbmVyX2lkKS5hcHBlbmRUbyhkcmF3X3BhZ2UpO1xyXG52YXIgc3ZnX2NvbnRhaW5lciA9IHN2Z19jb250YWluZXJfb2JqZWN0LmVsZW07XHJcblxyXG5cclxuXHJcblxyXG52YXIgc3lzdGVtX2NvbnRhaW5lcl9hcnJheSA9IFtcclxuICAgIC8qXHJcbiAgICAkKCdzcGFuJykuaHRtbCgnSVAgbG9jYXRpb24gfCcpLFxyXG4gICAgJCgnc3BhbicpLmh0bWwoJ0NpdHk6ICcpLFxyXG4gICAgJCgndmFsdWUnKS5zZXRSZWYoJ3N5c3RlbS5jaXR5JyksXHJcbiAgICAkKCdzcGFuJykuaHRtbCgnIHwgJyksXHJcbiAgICAkKCdzcGFuJykuaHRtbCgnQ291bnR5OiAnKSxcclxuICAgICQoJ3ZhbHVlJykuc2V0UmVmKCdzeXN0ZW0uY291bnR5JyksXHJcbiAgICAkKCdicicpLFxyXG4gICAgLy8qL1xyXG5cclxuICAgICQoJ3NwYW4nKS5odG1sKCdNb2R1bGUgbWFrZTogJyksXHJcbiAgICAvLyQoJ3NlbGVjdG9yJykgLnNldE9wdGlvbnNSZWYoICdjb21wb25lbnRzLm1vZHVsZU1ha2VBcnJheScgKSAuc2V0UmVmKCdzeXN0ZW0ucHZfbWFrZScpLFxyXG4gICAgJCgnc2VsZWN0b3InKSAuc2V0T3B0aW9uc1JlZiggJ3NldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZU1ha2VBcnJheScgKSAuc2V0UmVmKCdzeXN0ZW0uREMubW9kdWxlLm1ha2UnKSxcclxuICAgIFxyXG4gICAgJCgnYnInKSxcclxuICAgICQoJ3NwYW4nKS5odG1sKCdNb2R1bGUgbW9kZWw6ICcpLFxyXG4gICAgLy8kKCdzZWxlY3RvcicpLnNldE9wdGlvbnNSZWYoICdjb21wb25lbnRzLm1vZHVsZU1vZGVsQXJyYXknICkuc2V0UmVmKCdzeXN0ZW0ucHZfbW9kZWwnKSxcclxuICAgICQoJ3NlbGVjdG9yJykuc2V0T3B0aW9uc1JlZiggJ3NldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZU1vZGVsQXJyYXknICkuc2V0UmVmKCdzeXN0ZW0uREMubW9kdWxlLm1vZGVsJyksXHJcbiAgICAkKCdicicpLFxyXG4gICAgJCgnc3BhbicpLmh0bWwoJ1BtYXg6ICcpLFxyXG4gICAgJCgndmFsdWUnKS5zZXRSZWYoJ3N5c3RlbS5EQy5tb2R1bGUuc3BlY3MuUG1heCcpLFxyXG5cclxuICAgICQoJ3NwYW4nKS5odG1sKCcgfCAnKSxcclxuICAgICQoJ3NwYW4nKS5odG1sKCdJc2M6ICcpLFxyXG4gICAgJCgndmFsdWUnKS5zZXRSZWYoJ3N5c3RlbS5EQy5tb2R1bGUuc3BlY3MuSXNjJyksXHJcblxyXG4gICAgJCgnc3BhbicpLmh0bWwoJyB8ICcpLFxyXG4gICAgJCgnc3BhbicpLmh0bWwoJ1ZvYzogJyksXHJcbiAgICAkKCd2YWx1ZScpLnNldFJlZignc3lzdGVtLkRDLm1vZHVsZS5zcGVjcy5Wb2MnKSxcclxuXHJcbiAgICAkKCdzcGFuJykuaHRtbCgnIHwgJyksXHJcbiAgICAkKCdzcGFuJykuaHRtbCgnSW1wOiAnKSxcclxuICAgICQoJ3ZhbHVlJykuc2V0UmVmKCdzeXN0ZW0uREMubW9kdWxlLnNwZWNzLkltcCcpLFxyXG4gICAgXHJcbiAgICAkKCdzcGFuJykuaHRtbCgnIHwgJyksXHJcbiAgICAkKCdzcGFuJykuaHRtbCgnVm1wOiAnKSxcclxuICAgICQoJ3ZhbHVlJykuc2V0UmVmKCdzeXN0ZW0uREMubW9kdWxlLnNwZWNzLlZtcCcpLFxyXG5cclxuICAgICQoJ2JyJyksXHJcblxyXG4gICAgJCgnc3BhbicpLmh0bWwoJ051bWJlciBvZiBzdHJpbmdzOiAnKSxcclxuICAgICQoJ3NlbGVjdG9yJykuc2V0T3B0aW9uc1JlZiggJ2NvbmZpZ19vcHRpb25zLnN0cmluZ19udW1fb3B0aW9ucycpLnNldFJlZignc3lzdGVtLkRDLnN0cmluZ19udW0nKSxcclxuICAgICQoJ3NwYW4nKS5odG1sKCcgfCAnKSxcclxuICAgICQoJ3NwYW4nKS5odG1sKCdOdW1iZXIgb2YgbW9kdWxlcyBwZXIgc3RyaW5nOiAnKSxcclxuICAgICQoJ3NlbGVjdG9yJykuc2V0T3B0aW9uc1JlZiggJ2NvbmZpZ19vcHRpb25zLnN0cmluZ19tb2R1bGVzX29wdGlvbnMnKS5zZXRSZWYoJ3N5c3RlbS5EQy5zdHJpbmdfbW9kdWxlcycpLFxyXG4gICAgJCgnYnInKSxcclxuICAgIFxyXG4gICAgJCgnc3BhbicpLmh0bWwoJ0FycmF5IHZvbHRhZ2U6ICcpLFxyXG4gICAgJCgndmFsdWUnKS5zZXRSZWYoJ3N5c3RlbS5EQy52b2x0YWdlJykuc2V0TWF4KDYwMCkuYXR0cignaWQnLCAnRENfdm9sdCcpLFxyXG5cclxuICAgICQoJ3NwYW4nKS5odG1sKCcgfCAnKSxcclxuXHJcbiAgICAkKCdzcGFuJykuaHRtbCgnQXJyYXkgY3VycmVudDogJyksXHJcbiAgICAkKCd2YWx1ZScpLnNldFJlZignc3lzdGVtLkRDLmN1cnJlbnQnKSxcclxuXHJcbiAgICAkKCdicicpLFxyXG5cclxuICAgICQoJ3NwYW4nKS5odG1sKCdBQyB0eXBlOiAnKSxcclxuXHJcbiAgICAkKCdzZWxlY3RvcicpLnNldE9wdGlvbnNSZWYoICdjb25maWdfb3B0aW9ucy5BQ190eXBlX29wdGlvbnMnKS5zZXRSZWYoJ0FDX3R5cGUnKSxcclxuXHJcbiAgICAkKCdicicpLFxyXG5cclxuXS5mb3JFYWNoKCBmdW5jdGlvbihrZWxlbSl7XHJcbiAgICBrZWxlbS5hcHBlbmRUbyhzeXN0ZW1fY29udGFpbmVyKTtcclxuICAgIGlmKCBrZWxlbS50eXBlID09PSAnc2VsZWN0b3InICl7XHJcbiAgICAgICAga2VsZW0uc2V0UmVmT2JqKHNldHRpbmdzKTtcclxuICAgICAgICBrZWxlbS5zZXRVcGRhdGUodXBkYXRlKTtcclxuICAgICAgICBzZXR0aW5ncy5yZWdpc3RyeS5wdXNoKGtlbGVtKTtcclxuICAgICAgICBrZWxlbS51cGRhdGUoKTsgXHJcbiAgICB9IGVsc2UgaWYoIGtlbGVtLnR5cGUgPT09ICd2YWx1ZScgKXtcclxuICAgICAgICBrZWxlbS5zZXRSZWZPYmooc2V0dGluZ3MpO1xyXG4gICAgICAgIC8va2VsZW0uc2V0VXBkYXRlKHVwZGF0ZV9zeXN0ZW0pO1xyXG4gICAgICAgIHNldHRpbmdzLnJlZ2lzdHJ5LnB1c2goa2VsZW0pO1xyXG4gICAgfVxyXG59KTtcclxuXHJcblxyXG52YXIgYm9vdF90aW1lID0gbW9tZW50KCk7XHJcbnZhciBzdGF0dXNfaWQgPSBcInN0YXR1c1wiO1xyXG5zZXRJbnRlcnZhbChmdW5jdGlvbigpeyBrLnVwZGF0ZV9zdGF0dXNfcGFnZShzdGF0dXNfaWQsIGJvb3RfdGltZSk7fSwxMDAwKTtcclxuXHJcbmxvZygnc2V0dGluZ3MnLCBzZXR0aW5ncyk7XHJcbmxvZygnd2luZG93Jywgd2luZG93KTtcclxuXHJcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8vISBtb21lbnQuanNcbi8vISB2ZXJzaW9uIDogMi43LjBcbi8vISBhdXRob3JzIDogVGltIFdvb2QsIElza3JlbiBDaGVybmV2LCBNb21lbnQuanMgY29udHJpYnV0b3JzXG4vLyEgbGljZW5zZSA6IE1JVFxuLy8hIG1vbWVudGpzLmNvbVxuXG4oZnVuY3Rpb24gKHVuZGVmaW5lZCkge1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBDb25zdGFudHNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICB2YXIgbW9tZW50LFxuICAgICAgICBWRVJTSU9OID0gXCIyLjcuMFwiLFxuICAgICAgICAvLyB0aGUgZ2xvYmFsLXNjb3BlIHRoaXMgaXMgTk9UIHRoZSBnbG9iYWwgb2JqZWN0IGluIE5vZGUuanNcbiAgICAgICAgZ2xvYmFsU2NvcGUgPSB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHRoaXMsXG4gICAgICAgIG9sZEdsb2JhbE1vbWVudCxcbiAgICAgICAgcm91bmQgPSBNYXRoLnJvdW5kLFxuICAgICAgICBpLFxuXG4gICAgICAgIFlFQVIgPSAwLFxuICAgICAgICBNT05USCA9IDEsXG4gICAgICAgIERBVEUgPSAyLFxuICAgICAgICBIT1VSID0gMyxcbiAgICAgICAgTUlOVVRFID0gNCxcbiAgICAgICAgU0VDT05EID0gNSxcbiAgICAgICAgTUlMTElTRUNPTkQgPSA2LFxuXG4gICAgICAgIC8vIGludGVybmFsIHN0b3JhZ2UgZm9yIGxhbmd1YWdlIGNvbmZpZyBmaWxlc1xuICAgICAgICBsYW5ndWFnZXMgPSB7fSxcblxuICAgICAgICAvLyBtb21lbnQgaW50ZXJuYWwgcHJvcGVydGllc1xuICAgICAgICBtb21lbnRQcm9wZXJ0aWVzID0ge1xuICAgICAgICAgICAgX2lzQU1vbWVudE9iamVjdDogbnVsbCxcbiAgICAgICAgICAgIF9pIDogbnVsbCxcbiAgICAgICAgICAgIF9mIDogbnVsbCxcbiAgICAgICAgICAgIF9sIDogbnVsbCxcbiAgICAgICAgICAgIF9zdHJpY3QgOiBudWxsLFxuICAgICAgICAgICAgX3R6bSA6IG51bGwsXG4gICAgICAgICAgICBfaXNVVEMgOiBudWxsLFxuICAgICAgICAgICAgX29mZnNldCA6IG51bGwsICAvLyBvcHRpb25hbC4gQ29tYmluZSB3aXRoIF9pc1VUQ1xuICAgICAgICAgICAgX3BmIDogbnVsbCxcbiAgICAgICAgICAgIF9sYW5nIDogbnVsbCAgLy8gb3B0aW9uYWxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBjaGVjayBmb3Igbm9kZUpTXG4gICAgICAgIGhhc01vZHVsZSA9ICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cyksXG5cbiAgICAgICAgLy8gQVNQLk5FVCBqc29uIGRhdGUgZm9ybWF0IHJlZ2V4XG4gICAgICAgIGFzcE5ldEpzb25SZWdleCA9IC9eXFwvP0RhdGVcXCgoXFwtP1xcZCspL2ksXG4gICAgICAgIGFzcE5ldFRpbWVTcGFuSnNvblJlZ2V4ID0gLyhcXC0pPyg/OihcXGQqKVxcLik/KFxcZCspXFw6KFxcZCspKD86XFw6KFxcZCspXFwuPyhcXGR7M30pPyk/LyxcblxuICAgICAgICAvLyBmcm9tIGh0dHA6Ly9kb2NzLmNsb3N1cmUtbGlicmFyeS5nb29nbGVjb2RlLmNvbS9naXQvY2xvc3VyZV9nb29nX2RhdGVfZGF0ZS5qcy5zb3VyY2UuaHRtbFxuICAgICAgICAvLyBzb21ld2hhdCBtb3JlIGluIGxpbmUgd2l0aCA0LjQuMy4yIDIwMDQgc3BlYywgYnV0IGFsbG93cyBkZWNpbWFsIGFueXdoZXJlXG4gICAgICAgIGlzb0R1cmF0aW9uUmVnZXggPSAvXigtKT9QKD86KD86KFswLTksLl0qKVkpPyg/OihbMC05LC5dKilNKT8oPzooWzAtOSwuXSopRCk/KD86VCg/OihbMC05LC5dKilIKT8oPzooWzAtOSwuXSopTSk/KD86KFswLTksLl0qKVMpPyk/fChbMC05LC5dKilXKSQvLFxuXG4gICAgICAgIC8vIGZvcm1hdCB0b2tlbnNcbiAgICAgICAgZm9ybWF0dGluZ1Rva2VucyA9IC8oXFxbW15cXFtdKlxcXSl8KFxcXFwpPyhNb3xNTT9NP00/fERvfERERG98REQ/RD9EP3xkZGQ/ZD98ZG8/fHdbb3x3XT98V1tvfFddP3xRfFlZWVlZWXxZWVlZWXxZWVlZfFlZfGdnKGdnZz8pP3xHRyhHR0c/KT98ZXxFfGF8QXxoaD98SEg/fG1tP3xzcz98U3sxLDR9fFh8eno/fFpaP3wuKS9nLFxuICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMgPSAvKFxcW1teXFxbXSpcXF0pfChcXFxcKT8oTFR8TEw/TD9MP3xsezEsNH0pL2csXG5cbiAgICAgICAgLy8gcGFyc2luZyB0b2tlbiByZWdleGVzXG4gICAgICAgIHBhcnNlVG9rZW5PbmVPclR3b0RpZ2l0cyA9IC9cXGRcXGQ/LywgLy8gMCAtIDk5XG4gICAgICAgIHBhcnNlVG9rZW5PbmVUb1RocmVlRGlnaXRzID0gL1xcZHsxLDN9LywgLy8gMCAtIDk5OVxuICAgICAgICBwYXJzZVRva2VuT25lVG9Gb3VyRGlnaXRzID0gL1xcZHsxLDR9LywgLy8gMCAtIDk5OTlcbiAgICAgICAgcGFyc2VUb2tlbk9uZVRvU2l4RGlnaXRzID0gL1srXFwtXT9cXGR7MSw2fS8sIC8vIC05OTksOTk5IC0gOTk5LDk5OVxuICAgICAgICBwYXJzZVRva2VuRGlnaXRzID0gL1xcZCsvLCAvLyBub256ZXJvIG51bWJlciBvZiBkaWdpdHNcbiAgICAgICAgcGFyc2VUb2tlbldvcmQgPSAvWzAtOV0qWydhLXpcXHUwMEEwLVxcdTA1RkZcXHUwNzAwLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRUZdK3xbXFx1MDYwMC1cXHUwNkZGXFwvXSsoXFxzKj9bXFx1MDYwMC1cXHUwNkZGXSspezEsMn0vaSwgLy8gYW55IHdvcmQgKG9yIHR3bykgY2hhcmFjdGVycyBvciBudW1iZXJzIGluY2x1ZGluZyB0d28vdGhyZWUgd29yZCBtb250aCBpbiBhcmFiaWMuXG4gICAgICAgIHBhcnNlVG9rZW5UaW1lem9uZSA9IC9afFtcXCtcXC1dXFxkXFxkOj9cXGRcXGQvZ2ksIC8vICswMDowMCAtMDA6MDAgKzAwMDAgLTAwMDAgb3IgWlxuICAgICAgICBwYXJzZVRva2VuVCA9IC9UL2ksIC8vIFQgKElTTyBzZXBhcmF0b3IpXG4gICAgICAgIHBhcnNlVG9rZW5UaW1lc3RhbXBNcyA9IC9bXFwrXFwtXT9cXGQrKFxcLlxcZHsxLDN9KT8vLCAvLyAxMjM0NTY3ODkgMTIzNDU2Nzg5LjEyM1xuICAgICAgICBwYXJzZVRva2VuT3JkaW5hbCA9IC9cXGR7MSwyfS8sXG5cbiAgICAgICAgLy9zdHJpY3QgcGFyc2luZyByZWdleGVzXG4gICAgICAgIHBhcnNlVG9rZW5PbmVEaWdpdCA9IC9cXGQvLCAvLyAwIC0gOVxuICAgICAgICBwYXJzZVRva2VuVHdvRGlnaXRzID0gL1xcZFxcZC8sIC8vIDAwIC0gOTlcbiAgICAgICAgcGFyc2VUb2tlblRocmVlRGlnaXRzID0gL1xcZHszfS8sIC8vIDAwMCAtIDk5OVxuICAgICAgICBwYXJzZVRva2VuRm91ckRpZ2l0cyA9IC9cXGR7NH0vLCAvLyAwMDAwIC0gOTk5OVxuICAgICAgICBwYXJzZVRva2VuU2l4RGlnaXRzID0gL1srLV0/XFxkezZ9LywgLy8gLTk5OSw5OTkgLSA5OTksOTk5XG4gICAgICAgIHBhcnNlVG9rZW5TaWduZWROdW1iZXIgPSAvWystXT9cXGQrLywgLy8gLWluZiAtIGluZlxuXG4gICAgICAgIC8vIGlzbyA4NjAxIHJlZ2V4XG4gICAgICAgIC8vIDAwMDAtMDAtMDAgMDAwMC1XMDAgb3IgMDAwMC1XMDAtMCArIFQgKyAwMCBvciAwMDowMCBvciAwMDowMDowMCBvciAwMDowMDowMC4wMDAgKyArMDA6MDAgb3IgKzAwMDAgb3IgKzAwKVxuICAgICAgICBpc29SZWdleCA9IC9eXFxzKig/OlsrLV1cXGR7Nn18XFxkezR9KS0oPzooXFxkXFxkLVxcZFxcZCl8KFdcXGRcXGQkKXwoV1xcZFxcZC1cXGQpfChcXGRcXGRcXGQpKSgoVHwgKShcXGRcXGQoOlxcZFxcZCg6XFxkXFxkKFxcLlxcZCspPyk/KT8pPyhbXFwrXFwtXVxcZFxcZCg/Ojo/XFxkXFxkKT98XFxzKlopPyk/JC8sXG5cbiAgICAgICAgaXNvRm9ybWF0ID0gJ1lZWVktTU0tRERUSEg6bW06c3NaJyxcblxuICAgICAgICBpc29EYXRlcyA9IFtcbiAgICAgICAgICAgIFsnWVlZWVlZLU1NLUREJywgL1srLV1cXGR7Nn0tXFxkezJ9LVxcZHsyfS9dLFxuICAgICAgICAgICAgWydZWVlZLU1NLUREJywgL1xcZHs0fS1cXGR7Mn0tXFxkezJ9L10sXG4gICAgICAgICAgICBbJ0dHR0ctW1ddV1ctRScsIC9cXGR7NH0tV1xcZHsyfS1cXGQvXSxcbiAgICAgICAgICAgIFsnR0dHRy1bV11XVycsIC9cXGR7NH0tV1xcZHsyfS9dLFxuICAgICAgICAgICAgWydZWVlZLURERCcsIC9cXGR7NH0tXFxkezN9L11cbiAgICAgICAgXSxcblxuICAgICAgICAvLyBpc28gdGltZSBmb3JtYXRzIGFuZCByZWdleGVzXG4gICAgICAgIGlzb1RpbWVzID0gW1xuICAgICAgICAgICAgWydISDptbTpzcy5TU1NTJywgLyhUfCApXFxkXFxkOlxcZFxcZDpcXGRcXGRcXC5cXGQrL10sXG4gICAgICAgICAgICBbJ0hIOm1tOnNzJywgLyhUfCApXFxkXFxkOlxcZFxcZDpcXGRcXGQvXSxcbiAgICAgICAgICAgIFsnSEg6bW0nLCAvKFR8IClcXGRcXGQ6XFxkXFxkL10sXG4gICAgICAgICAgICBbJ0hIJywgLyhUfCApXFxkXFxkL11cbiAgICAgICAgXSxcblxuICAgICAgICAvLyB0aW1lem9uZSBjaHVua2VyIFwiKzEwOjAwXCIgPiBbXCIxMFwiLCBcIjAwXCJdIG9yIFwiLTE1MzBcIiA+IFtcIi0xNVwiLCBcIjMwXCJdXG4gICAgICAgIHBhcnNlVGltZXpvbmVDaHVua2VyID0gLyhbXFwrXFwtXXxcXGRcXGQpL2dpLFxuXG4gICAgICAgIC8vIGdldHRlciBhbmQgc2V0dGVyIG5hbWVzXG4gICAgICAgIHByb3h5R2V0dGVyc0FuZFNldHRlcnMgPSAnRGF0ZXxIb3Vyc3xNaW51dGVzfFNlY29uZHN8TWlsbGlzZWNvbmRzJy5zcGxpdCgnfCcpLFxuICAgICAgICB1bml0TWlsbGlzZWNvbmRGYWN0b3JzID0ge1xuICAgICAgICAgICAgJ01pbGxpc2Vjb25kcycgOiAxLFxuICAgICAgICAgICAgJ1NlY29uZHMnIDogMWUzLFxuICAgICAgICAgICAgJ01pbnV0ZXMnIDogNmU0LFxuICAgICAgICAgICAgJ0hvdXJzJyA6IDM2ZTUsXG4gICAgICAgICAgICAnRGF5cycgOiA4NjRlNSxcbiAgICAgICAgICAgICdNb250aHMnIDogMjU5MmU2LFxuICAgICAgICAgICAgJ1llYXJzJyA6IDMxNTM2ZTZcbiAgICAgICAgfSxcblxuICAgICAgICB1bml0QWxpYXNlcyA9IHtcbiAgICAgICAgICAgIG1zIDogJ21pbGxpc2Vjb25kJyxcbiAgICAgICAgICAgIHMgOiAnc2Vjb25kJyxcbiAgICAgICAgICAgIG0gOiAnbWludXRlJyxcbiAgICAgICAgICAgIGggOiAnaG91cicsXG4gICAgICAgICAgICBkIDogJ2RheScsXG4gICAgICAgICAgICBEIDogJ2RhdGUnLFxuICAgICAgICAgICAgdyA6ICd3ZWVrJyxcbiAgICAgICAgICAgIFcgOiAnaXNvV2VlaycsXG4gICAgICAgICAgICBNIDogJ21vbnRoJyxcbiAgICAgICAgICAgIFEgOiAncXVhcnRlcicsXG4gICAgICAgICAgICB5IDogJ3llYXInLFxuICAgICAgICAgICAgREREIDogJ2RheU9mWWVhcicsXG4gICAgICAgICAgICBlIDogJ3dlZWtkYXknLFxuICAgICAgICAgICAgRSA6ICdpc29XZWVrZGF5JyxcbiAgICAgICAgICAgIGdnOiAnd2Vla1llYXInLFxuICAgICAgICAgICAgR0c6ICdpc29XZWVrWWVhcidcbiAgICAgICAgfSxcblxuICAgICAgICBjYW1lbEZ1bmN0aW9ucyA9IHtcbiAgICAgICAgICAgIGRheW9meWVhciA6ICdkYXlPZlllYXInLFxuICAgICAgICAgICAgaXNvd2Vla2RheSA6ICdpc29XZWVrZGF5JyxcbiAgICAgICAgICAgIGlzb3dlZWsgOiAnaXNvV2VlaycsXG4gICAgICAgICAgICB3ZWVreWVhciA6ICd3ZWVrWWVhcicsXG4gICAgICAgICAgICBpc293ZWVreWVhciA6ICdpc29XZWVrWWVhcidcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBmb3JtYXQgZnVuY3Rpb24gc3RyaW5nc1xuICAgICAgICBmb3JtYXRGdW5jdGlvbnMgPSB7fSxcblxuICAgICAgICAvLyBkZWZhdWx0IHJlbGF0aXZlIHRpbWUgdGhyZXNob2xkc1xuICAgICAgICByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzID0ge1xuICAgICAgICAgIHM6IDQ1LCAgIC8vc2Vjb25kcyB0byBtaW51dGVzXG4gICAgICAgICAgbTogNDUsICAgLy9taW51dGVzIHRvIGhvdXJzXG4gICAgICAgICAgaDogMjIsICAgLy9ob3VycyB0byBkYXlzXG4gICAgICAgICAgZGQ6IDI1LCAgLy9kYXlzIHRvIG1vbnRoIChtb250aCA9PSAxKVxuICAgICAgICAgIGRtOiA0NSwgIC8vZGF5cyB0byBtb250aHMgKG1vbnRocyA+IDEpXG4gICAgICAgICAgZHk6IDM0NSAgLy9kYXlzIHRvIHllYXJcbiAgICAgICAgfSxcblxuICAgICAgICAvLyB0b2tlbnMgdG8gb3JkaW5hbGl6ZSBhbmQgcGFkXG4gICAgICAgIG9yZGluYWxpemVUb2tlbnMgPSAnREREIHcgVyBNIEQgZCcuc3BsaXQoJyAnKSxcbiAgICAgICAgcGFkZGVkVG9rZW5zID0gJ00gRCBIIGggbSBzIHcgVycuc3BsaXQoJyAnKSxcblxuICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9ucyA9IHtcbiAgICAgICAgICAgIE0gICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubW9udGgoKSArIDE7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgTU1NICA6IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nKCkubW9udGhzU2hvcnQodGhpcywgZm9ybWF0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBNTU1NIDogZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcoKS5tb250aHModGhpcywgZm9ybWF0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBEICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBEREQgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRheU9mWWVhcigpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGQgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGQgICA6IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nKCkud2Vla2RheXNNaW4odGhpcywgZm9ybWF0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZGQgIDogZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcoKS53ZWVrZGF5c1Nob3J0KHRoaXMsIGZvcm1hdCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGRkZCA6IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nKCkud2Vla2RheXModGhpcywgZm9ybWF0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3ICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLndlZWsoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBXICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmlzb1dlZWsoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBZWSAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy55ZWFyKCkgJSAxMDAsIDIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFlZWVkgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLnllYXIoKSwgNCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgWVlZWVkgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLnllYXIoKSwgNSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgWVlZWVlZIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciB5ID0gdGhpcy55ZWFyKCksIHNpZ24gPSB5ID49IDAgPyAnKycgOiAnLSc7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNpZ24gKyBsZWZ0WmVyb0ZpbGwoTWF0aC5hYnMoeSksIDYpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdnICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLndlZWtZZWFyKCkgJSAxMDAsIDIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdnZ2cgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLndlZWtZZWFyKCksIDQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdnZ2dnIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy53ZWVrWWVhcigpLCA1KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBHRyAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy5pc29XZWVrWWVhcigpICUgMTAwLCAyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBHR0dHIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy5pc29XZWVrWWVhcigpLCA0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBHR0dHRyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMuaXNvV2Vla1llYXIoKSwgNSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy53ZWVrZGF5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pc29XZWVrZGF5KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYSAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nKCkubWVyaWRpZW0odGhpcy5ob3VycygpLCB0aGlzLm1pbnV0ZXMoKSwgdHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQSAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nKCkubWVyaWRpZW0odGhpcy5ob3VycygpLCB0aGlzLm1pbnV0ZXMoKSwgZmFsc2UpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEggICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaG91cnMoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhvdXJzKCkgJSAxMiB8fCAxMjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1pbnV0ZXMoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNlY29uZHMoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0b0ludCh0aGlzLm1pbGxpc2Vjb25kcygpIC8gMTAwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTUyAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodG9JbnQodGhpcy5taWxsaXNlY29uZHMoKSAvIDEwKSwgMik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU1NTICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMubWlsbGlzZWNvbmRzKCksIDMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFNTU1MgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLm1pbGxpc2Vjb25kcygpLCAzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBaICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhID0gLXRoaXMuem9uZSgpLFxuICAgICAgICAgICAgICAgICAgICBiID0gXCIrXCI7XG4gICAgICAgICAgICAgICAgaWYgKGEgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGEgPSAtYTtcbiAgICAgICAgICAgICAgICAgICAgYiA9IFwiLVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYiArIGxlZnRaZXJvRmlsbCh0b0ludChhIC8gNjApLCAyKSArIFwiOlwiICsgbGVmdFplcm9GaWxsKHRvSW50KGEpICUgNjAsIDIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFpaICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGEgPSAtdGhpcy56b25lKCksXG4gICAgICAgICAgICAgICAgICAgIGIgPSBcIitcIjtcbiAgICAgICAgICAgICAgICBpZiAoYSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYSA9IC1hO1xuICAgICAgICAgICAgICAgICAgICBiID0gXCItXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBiICsgbGVmdFplcm9GaWxsKHRvSW50KGEgLyA2MCksIDIpICsgbGVmdFplcm9GaWxsKHRvSW50KGEpICUgNjAsIDIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHogOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuem9uZUFiYnIoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB6eiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy56b25lTmFtZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFggICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudW5peCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFEgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVhcnRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGxpc3RzID0gWydtb250aHMnLCAnbW9udGhzU2hvcnQnLCAnd2Vla2RheXMnLCAnd2Vla2RheXNTaG9ydCcsICd3ZWVrZGF5c01pbiddO1xuXG4gICAgLy8gUGljayB0aGUgZmlyc3QgZGVmaW5lZCBvZiB0d28gb3IgdGhyZWUgYXJndW1lbnRzLiBkZmwgY29tZXMgZnJvbVxuICAgIC8vIGRlZmF1bHQuXG4gICAgZnVuY3Rpb24gZGZsKGEsIGIsIGMpIHtcbiAgICAgICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBhICE9IG51bGwgPyBhIDogYjtcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIGEgIT0gbnVsbCA/IGEgOiBiICE9IG51bGwgPyBiIDogYztcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcihcIkltcGxlbWVudCBtZVwiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmF1bHRQYXJzaW5nRmxhZ3MoKSB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gZGVlcCBjbG9uZSB0aGlzIG9iamVjdCwgYW5kIGVzNSBzdGFuZGFyZCBpcyBub3QgdmVyeVxuICAgICAgICAvLyBoZWxwZnVsLlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZW1wdHkgOiBmYWxzZSxcbiAgICAgICAgICAgIHVudXNlZFRva2VucyA6IFtdLFxuICAgICAgICAgICAgdW51c2VkSW5wdXQgOiBbXSxcbiAgICAgICAgICAgIG92ZXJmbG93IDogLTIsXG4gICAgICAgICAgICBjaGFyc0xlZnRPdmVyIDogMCxcbiAgICAgICAgICAgIG51bGxJbnB1dCA6IGZhbHNlLFxuICAgICAgICAgICAgaW52YWxpZE1vbnRoIDogbnVsbCxcbiAgICAgICAgICAgIGludmFsaWRGb3JtYXQgOiBmYWxzZSxcbiAgICAgICAgICAgIHVzZXJJbnZhbGlkYXRlZCA6IGZhbHNlLFxuICAgICAgICAgICAgaXNvOiBmYWxzZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlcHJlY2F0ZShtc2csIGZuKSB7XG4gICAgICAgIHZhciBmaXJzdFRpbWUgPSB0cnVlO1xuICAgICAgICBmdW5jdGlvbiBwcmludE1zZygpIHtcbiAgICAgICAgICAgIGlmIChtb21lbnQuc3VwcHJlc3NEZXByZWNhdGlvbldhcm5pbmdzID09PSBmYWxzZSAmJlxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiRGVwcmVjYXRpb24gd2FybmluZzogXCIgKyBtc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBleHRlbmQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGZpcnN0VGltZSkge1xuICAgICAgICAgICAgICAgIHByaW50TXNnKCk7XG4gICAgICAgICAgICAgICAgZmlyc3RUaW1lID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSwgZm4pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhZFRva2VuKGZ1bmMsIGNvdW50KSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbChmdW5jLmNhbGwodGhpcywgYSksIGNvdW50KTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb3JkaW5hbGl6ZVRva2VuKGZ1bmMsIHBlcmlvZCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcoKS5vcmRpbmFsKGZ1bmMuY2FsbCh0aGlzLCBhKSwgcGVyaW9kKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICB3aGlsZSAob3JkaW5hbGl6ZVRva2Vucy5sZW5ndGgpIHtcbiAgICAgICAgaSA9IG9yZGluYWxpemVUb2tlbnMucG9wKCk7XG4gICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW2kgKyAnbyddID0gb3JkaW5hbGl6ZVRva2VuKGZvcm1hdFRva2VuRnVuY3Rpb25zW2ldLCBpKTtcbiAgICB9XG4gICAgd2hpbGUgKHBhZGRlZFRva2Vucy5sZW5ndGgpIHtcbiAgICAgICAgaSA9IHBhZGRlZFRva2Vucy5wb3AoKTtcbiAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbaSArIGldID0gcGFkVG9rZW4oZm9ybWF0VG9rZW5GdW5jdGlvbnNbaV0sIDIpO1xuICAgIH1cbiAgICBmb3JtYXRUb2tlbkZ1bmN0aW9ucy5EREREID0gcGFkVG9rZW4oZm9ybWF0VG9rZW5GdW5jdGlvbnMuRERELCAzKTtcblxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBDb25zdHJ1Y3RvcnNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICBmdW5jdGlvbiBMYW5ndWFnZSgpIHtcblxuICAgIH1cblxuICAgIC8vIE1vbWVudCBwcm90b3R5cGUgb2JqZWN0XG4gICAgZnVuY3Rpb24gTW9tZW50KGNvbmZpZykge1xuICAgICAgICBjaGVja092ZXJmbG93KGNvbmZpZyk7XG4gICAgICAgIGV4dGVuZCh0aGlzLCBjb25maWcpO1xuICAgIH1cblxuICAgIC8vIER1cmF0aW9uIENvbnN0cnVjdG9yXG4gICAgZnVuY3Rpb24gRHVyYXRpb24oZHVyYXRpb24pIHtcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWRJbnB1dCA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKGR1cmF0aW9uKSxcbiAgICAgICAgICAgIHllYXJzID0gbm9ybWFsaXplZElucHV0LnllYXIgfHwgMCxcbiAgICAgICAgICAgIHF1YXJ0ZXJzID0gbm9ybWFsaXplZElucHV0LnF1YXJ0ZXIgfHwgMCxcbiAgICAgICAgICAgIG1vbnRocyA9IG5vcm1hbGl6ZWRJbnB1dC5tb250aCB8fCAwLFxuICAgICAgICAgICAgd2Vla3MgPSBub3JtYWxpemVkSW5wdXQud2VlayB8fCAwLFxuICAgICAgICAgICAgZGF5cyA9IG5vcm1hbGl6ZWRJbnB1dC5kYXkgfHwgMCxcbiAgICAgICAgICAgIGhvdXJzID0gbm9ybWFsaXplZElucHV0LmhvdXIgfHwgMCxcbiAgICAgICAgICAgIG1pbnV0ZXMgPSBub3JtYWxpemVkSW5wdXQubWludXRlIHx8IDAsXG4gICAgICAgICAgICBzZWNvbmRzID0gbm9ybWFsaXplZElucHV0LnNlY29uZCB8fCAwLFxuICAgICAgICAgICAgbWlsbGlzZWNvbmRzID0gbm9ybWFsaXplZElucHV0Lm1pbGxpc2Vjb25kIHx8IDA7XG5cbiAgICAgICAgLy8gcmVwcmVzZW50YXRpb24gZm9yIGRhdGVBZGRSZW1vdmVcbiAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzID0gK21pbGxpc2Vjb25kcyArXG4gICAgICAgICAgICBzZWNvbmRzICogMWUzICsgLy8gMTAwMFxuICAgICAgICAgICAgbWludXRlcyAqIDZlNCArIC8vIDEwMDAgKiA2MFxuICAgICAgICAgICAgaG91cnMgKiAzNmU1OyAvLyAxMDAwICogNjAgKiA2MFxuICAgICAgICAvLyBCZWNhdXNlIG9mIGRhdGVBZGRSZW1vdmUgdHJlYXRzIDI0IGhvdXJzIGFzIGRpZmZlcmVudCBmcm9tIGFcbiAgICAgICAgLy8gZGF5IHdoZW4gd29ya2luZyBhcm91bmQgRFNULCB3ZSBuZWVkIHRvIHN0b3JlIHRoZW0gc2VwYXJhdGVseVxuICAgICAgICB0aGlzLl9kYXlzID0gK2RheXMgK1xuICAgICAgICAgICAgd2Vla3MgKiA3O1xuICAgICAgICAvLyBJdCBpcyBpbXBvc3NpYmxlIHRyYW5zbGF0ZSBtb250aHMgaW50byBkYXlzIHdpdGhvdXQga25vd2luZ1xuICAgICAgICAvLyB3aGljaCBtb250aHMgeW91IGFyZSBhcmUgdGFsa2luZyBhYm91dCwgc28gd2UgaGF2ZSB0byBzdG9yZVxuICAgICAgICAvLyBpdCBzZXBhcmF0ZWx5LlxuICAgICAgICB0aGlzLl9tb250aHMgPSArbW9udGhzICtcbiAgICAgICAgICAgIHF1YXJ0ZXJzICogMyArXG4gICAgICAgICAgICB5ZWFycyAqIDEyO1xuXG4gICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcblxuICAgICAgICB0aGlzLl9idWJibGUoKTtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEhlbHBlcnNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIGZ1bmN0aW9uIGV4dGVuZChhLCBiKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gYikge1xuICAgICAgICAgICAgaWYgKGIuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICBhW2ldID0gYltpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChiLmhhc093blByb3BlcnR5KFwidG9TdHJpbmdcIikpIHtcbiAgICAgICAgICAgIGEudG9TdHJpbmcgPSBiLnRvU3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGIuaGFzT3duUHJvcGVydHkoXCJ2YWx1ZU9mXCIpKSB7XG4gICAgICAgICAgICBhLnZhbHVlT2YgPSBiLnZhbHVlT2Y7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9uZU1vbWVudChtKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB7fSwgaTtcbiAgICAgICAgZm9yIChpIGluIG0pIHtcbiAgICAgICAgICAgIGlmIChtLmhhc093blByb3BlcnR5KGkpICYmIG1vbWVudFByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbaV0gPSBtW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhYnNSb3VuZChudW1iZXIpIHtcbiAgICAgICAgaWYgKG51bWJlciA8IDApIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmNlaWwobnVtYmVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKG51bWJlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBsZWZ0IHplcm8gZmlsbCBhIG51bWJlclxuICAgIC8vIHNlZSBodHRwOi8vanNwZXJmLmNvbS9sZWZ0LXplcm8tZmlsbGluZyBmb3IgcGVyZm9ybWFuY2UgY29tcGFyaXNvblxuICAgIGZ1bmN0aW9uIGxlZnRaZXJvRmlsbChudW1iZXIsIHRhcmdldExlbmd0aCwgZm9yY2VTaWduKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSAnJyArIE1hdGguYWJzKG51bWJlciksXG4gICAgICAgICAgICBzaWduID0gbnVtYmVyID49IDA7XG5cbiAgICAgICAgd2hpbGUgKG91dHB1dC5sZW5ndGggPCB0YXJnZXRMZW5ndGgpIHtcbiAgICAgICAgICAgIG91dHB1dCA9ICcwJyArIG91dHB1dDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHNpZ24gPyAoZm9yY2VTaWduID8gJysnIDogJycpIDogJy0nKSArIG91dHB1dDtcbiAgICB9XG5cbiAgICAvLyBoZWxwZXIgZnVuY3Rpb24gZm9yIF8uYWRkVGltZSBhbmQgXy5zdWJ0cmFjdFRpbWVcbiAgICBmdW5jdGlvbiBhZGRPclN1YnRyYWN0RHVyYXRpb25Gcm9tTW9tZW50KG1vbSwgZHVyYXRpb24sIGlzQWRkaW5nLCB1cGRhdGVPZmZzZXQpIHtcbiAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IGR1cmF0aW9uLl9taWxsaXNlY29uZHMsXG4gICAgICAgICAgICBkYXlzID0gZHVyYXRpb24uX2RheXMsXG4gICAgICAgICAgICBtb250aHMgPSBkdXJhdGlvbi5fbW9udGhzO1xuICAgICAgICB1cGRhdGVPZmZzZXQgPSB1cGRhdGVPZmZzZXQgPT0gbnVsbCA/IHRydWUgOiB1cGRhdGVPZmZzZXQ7XG5cbiAgICAgICAgaWYgKG1pbGxpc2Vjb25kcykge1xuICAgICAgICAgICAgbW9tLl9kLnNldFRpbWUoK21vbS5fZCArIG1pbGxpc2Vjb25kcyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF5cykge1xuICAgICAgICAgICAgcmF3U2V0dGVyKG1vbSwgJ0RhdGUnLCByYXdHZXR0ZXIobW9tLCAnRGF0ZScpICsgZGF5cyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobW9udGhzKSB7XG4gICAgICAgICAgICByYXdNb250aFNldHRlcihtb20sIHJhd0dldHRlcihtb20sICdNb250aCcpICsgbW9udGhzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1cGRhdGVPZmZzZXQpIHtcbiAgICAgICAgICAgIG1vbWVudC51cGRhdGVPZmZzZXQobW9tLCBkYXlzIHx8IG1vbnRocyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiBpcyBhbiBhcnJheVxuICAgIGZ1bmN0aW9uIGlzQXJyYXkoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNEYXRlKGlucHV0KSB7XG4gICAgICAgIHJldHVybiAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgRGF0ZV0nIHx8XG4gICAgICAgICAgICAgICAgaW5wdXQgaW5zdGFuY2VvZiBEYXRlO1xuICAgIH1cblxuICAgIC8vIGNvbXBhcmUgdHdvIGFycmF5cywgcmV0dXJuIHRoZSBudW1iZXIgb2YgZGlmZmVyZW5jZXNcbiAgICBmdW5jdGlvbiBjb21wYXJlQXJyYXlzKGFycmF5MSwgYXJyYXkyLCBkb250Q29udmVydCkge1xuICAgICAgICB2YXIgbGVuID0gTWF0aC5taW4oYXJyYXkxLmxlbmd0aCwgYXJyYXkyLmxlbmd0aCksXG4gICAgICAgICAgICBsZW5ndGhEaWZmID0gTWF0aC5hYnMoYXJyYXkxLmxlbmd0aCAtIGFycmF5Mi5sZW5ndGgpLFxuICAgICAgICAgICAgZGlmZnMgPSAwLFxuICAgICAgICAgICAgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoKGRvbnRDb252ZXJ0ICYmIGFycmF5MVtpXSAhPT0gYXJyYXkyW2ldKSB8fFxuICAgICAgICAgICAgICAgICghZG9udENvbnZlcnQgJiYgdG9JbnQoYXJyYXkxW2ldKSAhPT0gdG9JbnQoYXJyYXkyW2ldKSkpIHtcbiAgICAgICAgICAgICAgICBkaWZmcysrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaWZmcyArIGxlbmd0aERpZmY7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplVW5pdHModW5pdHMpIHtcbiAgICAgICAgaWYgKHVuaXRzKSB7XG4gICAgICAgICAgICB2YXIgbG93ZXJlZCA9IHVuaXRzLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvKC4pcyQvLCAnJDEnKTtcbiAgICAgICAgICAgIHVuaXRzID0gdW5pdEFsaWFzZXNbdW5pdHNdIHx8IGNhbWVsRnVuY3Rpb25zW2xvd2VyZWRdIHx8IGxvd2VyZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuaXRzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZU9iamVjdFVuaXRzKGlucHV0T2JqZWN0KSB7XG4gICAgICAgIHZhciBub3JtYWxpemVkSW5wdXQgPSB7fSxcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wLFxuICAgICAgICAgICAgcHJvcDtcblxuICAgICAgICBmb3IgKHByb3AgaW4gaW5wdXRPYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChpbnB1dE9iamVjdC5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wID0gbm9ybWFsaXplVW5pdHMocHJvcCk7XG4gICAgICAgICAgICAgICAgaWYgKG5vcm1hbGl6ZWRQcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dFtub3JtYWxpemVkUHJvcF0gPSBpbnB1dE9iamVjdFtwcm9wXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9ybWFsaXplZElucHV0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VMaXN0KGZpZWxkKSB7XG4gICAgICAgIHZhciBjb3VudCwgc2V0dGVyO1xuXG4gICAgICAgIGlmIChmaWVsZC5pbmRleE9mKCd3ZWVrJykgPT09IDApIHtcbiAgICAgICAgICAgIGNvdW50ID0gNztcbiAgICAgICAgICAgIHNldHRlciA9ICdkYXknO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGZpZWxkLmluZGV4T2YoJ21vbnRoJykgPT09IDApIHtcbiAgICAgICAgICAgIGNvdW50ID0gMTI7XG4gICAgICAgICAgICBzZXR0ZXIgPSAnbW9udGgnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbW9tZW50W2ZpZWxkXSA9IGZ1bmN0aW9uIChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgaSwgZ2V0dGVyLFxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IG1vbWVudC5mbi5fbGFuZ1tmaWVsZF0sXG4gICAgICAgICAgICAgICAgcmVzdWx0cyA9IFtdO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGZvcm1hdCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGZvcm1hdDtcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGdldHRlciA9IGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgdmFyIG0gPSBtb21lbnQoKS51dGMoKS5zZXQoc2V0dGVyLCBpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWV0aG9kLmNhbGwobW9tZW50LmZuLl9sYW5nLCBtLCBmb3JtYXQgfHwgJycpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKGluZGV4ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0dGVyKGluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChnZXR0ZXIoaSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0ludChhcmd1bWVudEZvckNvZXJjaW9uKSB7XG4gICAgICAgIHZhciBjb2VyY2VkTnVtYmVyID0gK2FyZ3VtZW50Rm9yQ29lcmNpb24sXG4gICAgICAgICAgICB2YWx1ZSA9IDA7XG5cbiAgICAgICAgaWYgKGNvZXJjZWROdW1iZXIgIT09IDAgJiYgaXNGaW5pdGUoY29lcmNlZE51bWJlcikpIHtcbiAgICAgICAgICAgIGlmIChjb2VyY2VkTnVtYmVyID49IDApIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IE1hdGguZmxvb3IoY29lcmNlZE51bWJlcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gTWF0aC5jZWlsKGNvZXJjZWROdW1iZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheXNJbk1vbnRoKHllYXIsIG1vbnRoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQyh5ZWFyLCBtb250aCArIDEsIDApKS5nZXRVVENEYXRlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2Vla3NJblllYXIoeWVhciwgZG93LCBkb3kpIHtcbiAgICAgICAgcmV0dXJuIHdlZWtPZlllYXIobW9tZW50KFt5ZWFyLCAxMSwgMzEgKyBkb3cgLSBkb3ldKSwgZG93LCBkb3kpLndlZWs7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGF5c0luWWVhcih5ZWFyKSB7XG4gICAgICAgIHJldHVybiBpc0xlYXBZZWFyKHllYXIpID8gMzY2IDogMzY1O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTGVhcFllYXIoeWVhcikge1xuICAgICAgICByZXR1cm4gKHllYXIgJSA0ID09PSAwICYmIHllYXIgJSAxMDAgIT09IDApIHx8IHllYXIgJSA0MDAgPT09IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tPdmVyZmxvdyhtKSB7XG4gICAgICAgIHZhciBvdmVyZmxvdztcbiAgICAgICAgaWYgKG0uX2EgJiYgbS5fcGYub3ZlcmZsb3cgPT09IC0yKSB7XG4gICAgICAgICAgICBvdmVyZmxvdyA9XG4gICAgICAgICAgICAgICAgbS5fYVtNT05USF0gPCAwIHx8IG0uX2FbTU9OVEhdID4gMTEgPyBNT05USCA6XG4gICAgICAgICAgICAgICAgbS5fYVtEQVRFXSA8IDEgfHwgbS5fYVtEQVRFXSA+IGRheXNJbk1vbnRoKG0uX2FbWUVBUl0sIG0uX2FbTU9OVEhdKSA/IERBVEUgOlxuICAgICAgICAgICAgICAgIG0uX2FbSE9VUl0gPCAwIHx8IG0uX2FbSE9VUl0gPiAyMyA/IEhPVVIgOlxuICAgICAgICAgICAgICAgIG0uX2FbTUlOVVRFXSA8IDAgfHwgbS5fYVtNSU5VVEVdID4gNTkgPyBNSU5VVEUgOlxuICAgICAgICAgICAgICAgIG0uX2FbU0VDT05EXSA8IDAgfHwgbS5fYVtTRUNPTkRdID4gNTkgPyBTRUNPTkQgOlxuICAgICAgICAgICAgICAgIG0uX2FbTUlMTElTRUNPTkRdIDwgMCB8fCBtLl9hW01JTExJU0VDT05EXSA+IDk5OSA/IE1JTExJU0VDT05EIDpcbiAgICAgICAgICAgICAgICAtMTtcblxuICAgICAgICAgICAgaWYgKG0uX3BmLl9vdmVyZmxvd0RheU9mWWVhciAmJiAob3ZlcmZsb3cgPCBZRUFSIHx8IG92ZXJmbG93ID4gREFURSkpIHtcbiAgICAgICAgICAgICAgICBvdmVyZmxvdyA9IERBVEU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG0uX3BmLm92ZXJmbG93ID0gb3ZlcmZsb3c7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1ZhbGlkKG0pIHtcbiAgICAgICAgaWYgKG0uX2lzVmFsaWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgbS5faXNWYWxpZCA9ICFpc05hTihtLl9kLmdldFRpbWUoKSkgJiZcbiAgICAgICAgICAgICAgICBtLl9wZi5vdmVyZmxvdyA8IDAgJiZcbiAgICAgICAgICAgICAgICAhbS5fcGYuZW1wdHkgJiZcbiAgICAgICAgICAgICAgICAhbS5fcGYuaW52YWxpZE1vbnRoICYmXG4gICAgICAgICAgICAgICAgIW0uX3BmLm51bGxJbnB1dCAmJlxuICAgICAgICAgICAgICAgICFtLl9wZi5pbnZhbGlkRm9ybWF0ICYmXG4gICAgICAgICAgICAgICAgIW0uX3BmLnVzZXJJbnZhbGlkYXRlZDtcblxuICAgICAgICAgICAgaWYgKG0uX3N0cmljdCkge1xuICAgICAgICAgICAgICAgIG0uX2lzVmFsaWQgPSBtLl9pc1ZhbGlkICYmXG4gICAgICAgICAgICAgICAgICAgIG0uX3BmLmNoYXJzTGVmdE92ZXIgPT09IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgbS5fcGYudW51c2VkVG9rZW5zLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbS5faXNWYWxpZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVMYW5ndWFnZShrZXkpIHtcbiAgICAgICAgcmV0dXJuIGtleSA/IGtleS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJ18nLCAnLScpIDoga2V5O1xuICAgIH1cblxuICAgIC8vIFJldHVybiBhIG1vbWVudCBmcm9tIGlucHV0LCB0aGF0IGlzIGxvY2FsL3V0Yy96b25lIGVxdWl2YWxlbnQgdG8gbW9kZWwuXG4gICAgZnVuY3Rpb24gbWFrZUFzKGlucHV0LCBtb2RlbCkge1xuICAgICAgICByZXR1cm4gbW9kZWwuX2lzVVRDID8gbW9tZW50KGlucHV0KS56b25lKG1vZGVsLl9vZmZzZXQgfHwgMCkgOlxuICAgICAgICAgICAgbW9tZW50KGlucHV0KS5sb2NhbCgpO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgTGFuZ3VhZ2VzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICBleHRlbmQoTGFuZ3VhZ2UucHJvdG90eXBlLCB7XG5cbiAgICAgICAgc2V0IDogZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAgICAgdmFyIHByb3AsIGk7XG4gICAgICAgICAgICBmb3IgKGkgaW4gY29uZmlnKSB7XG4gICAgICAgICAgICAgICAgcHJvcCA9IGNvbmZpZ1tpXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByb3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1tpXSA9IHByb3A7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpc1snXycgKyBpXSA9IHByb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9tb250aHMgOiBcIkphbnVhcnlfRmVicnVhcnlfTWFyY2hfQXByaWxfTWF5X0p1bmVfSnVseV9BdWd1c3RfU2VwdGVtYmVyX09jdG9iZXJfTm92ZW1iZXJfRGVjZW1iZXJcIi5zcGxpdChcIl9cIiksXG4gICAgICAgIG1vbnRocyA6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzW20ubW9udGgoKV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgX21vbnRoc1Nob3J0IDogXCJKYW5fRmViX01hcl9BcHJfTWF5X0p1bl9KdWxfQXVnX1NlcF9PY3RfTm92X0RlY1wiLnNwbGl0KFwiX1wiKSxcbiAgICAgICAgbW9udGhzU2hvcnQgOiBmdW5jdGlvbiAobSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1Nob3J0W20ubW9udGgoKV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgbW9udGhzUGFyc2UgOiBmdW5jdGlvbiAobW9udGhOYW1lKSB7XG4gICAgICAgICAgICB2YXIgaSwgbW9tLCByZWdleDtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLl9tb250aHNQYXJzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9tb250aHNQYXJzZVtpXSkge1xuICAgICAgICAgICAgICAgICAgICBtb20gPSBtb21lbnQudXRjKFsyMDAwLCBpXSk7XG4gICAgICAgICAgICAgICAgICAgIHJlZ2V4ID0gJ14nICsgdGhpcy5tb250aHMobW9tLCAnJykgKyAnfF4nICsgdGhpcy5tb250aHNTaG9ydChtb20sICcnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKHJlZ2V4LnJlcGxhY2UoJy4nLCAnJyksICdpJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHRlc3QgdGhlIHJlZ2V4XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3dlZWtkYXlzIDogXCJTdW5kYXlfTW9uZGF5X1R1ZXNkYXlfV2VkbmVzZGF5X1RodXJzZGF5X0ZyaWRheV9TYXR1cmRheVwiLnNwbGl0KFwiX1wiKSxcbiAgICAgICAgd2Vla2RheXMgOiBmdW5jdGlvbiAobSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzW20uZGF5KCldO1xuICAgICAgICB9LFxuXG4gICAgICAgIF93ZWVrZGF5c1Nob3J0IDogXCJTdW5fTW9uX1R1ZV9XZWRfVGh1X0ZyaV9TYXRcIi5zcGxpdChcIl9cIiksXG4gICAgICAgIHdlZWtkYXlzU2hvcnQgOiBmdW5jdGlvbiAobSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU2hvcnRbbS5kYXkoKV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3dlZWtkYXlzTWluIDogXCJTdV9Nb19UdV9XZV9UaF9Gcl9TYVwiLnNwbGl0KFwiX1wiKSxcbiAgICAgICAgd2Vla2RheXNNaW4gOiBmdW5jdGlvbiAobSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzTWluW20uZGF5KCldO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdlZWtkYXlzUGFyc2UgOiBmdW5jdGlvbiAod2Vla2RheU5hbWUpIHtcbiAgICAgICAgICAgIHZhciBpLCBtb20sIHJlZ2V4O1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgbW9tID0gbW9tZW50KFsyMDAwLCAxXSkuZGF5KGkpO1xuICAgICAgICAgICAgICAgICAgICByZWdleCA9ICdeJyArIHRoaXMud2Vla2RheXMobW9tLCAnJykgKyAnfF4nICsgdGhpcy53ZWVrZGF5c1Nob3J0KG1vbSwgJycpICsgJ3xeJyArIHRoaXMud2Vla2RheXNNaW4obW9tLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKHJlZ2V4LnJlcGxhY2UoJy4nLCAnJyksICdpJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHRlc3QgdGhlIHJlZ2V4XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3dlZWtkYXlzUGFyc2VbaV0udGVzdCh3ZWVrZGF5TmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9sb25nRGF0ZUZvcm1hdCA6IHtcbiAgICAgICAgICAgIExUIDogXCJoOm1tIEFcIixcbiAgICAgICAgICAgIEwgOiBcIk1NL0REL1lZWVlcIixcbiAgICAgICAgICAgIExMIDogXCJNTU1NIEQgWVlZWVwiLFxuICAgICAgICAgICAgTExMIDogXCJNTU1NIEQgWVlZWSBMVFwiLFxuICAgICAgICAgICAgTExMTCA6IFwiZGRkZCwgTU1NTSBEIFlZWVkgTFRcIlxuICAgICAgICB9LFxuICAgICAgICBsb25nRGF0ZUZvcm1hdCA6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXldO1xuICAgICAgICAgICAgaWYgKCFvdXRwdXQgJiYgdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5LnRvVXBwZXJDYXNlKCldKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5LnRvVXBwZXJDYXNlKCldLnJlcGxhY2UoL01NTU18TU18RER8ZGRkZC9nLCBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWwuc2xpY2UoMSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XSA9IG91dHB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNQTSA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICAgICAgLy8gSUU4IFF1aXJrcyBNb2RlICYgSUU3IFN0YW5kYXJkcyBNb2RlIGRvIG5vdCBhbGxvdyBhY2Nlc3Npbmcgc3RyaW5ncyBsaWtlIGFycmF5c1xuICAgICAgICAgICAgLy8gVXNpbmcgY2hhckF0IHNob3VsZCBiZSBtb3JlIGNvbXBhdGlibGUuXG4gICAgICAgICAgICByZXR1cm4gKChpbnB1dCArICcnKS50b0xvd2VyQ2FzZSgpLmNoYXJBdCgwKSA9PT0gJ3AnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBfbWVyaWRpZW1QYXJzZSA6IC9bYXBdXFwuP20/XFwuPy9pLFxuICAgICAgICBtZXJpZGllbSA6IGZ1bmN0aW9uIChob3VycywgbWludXRlcywgaXNMb3dlcikge1xuICAgICAgICAgICAgaWYgKGhvdXJzID4gMTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNMb3dlciA/ICdwbScgOiAnUE0nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNMb3dlciA/ICdhbScgOiAnQU0nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9jYWxlbmRhciA6IHtcbiAgICAgICAgICAgIHNhbWVEYXkgOiAnW1RvZGF5IGF0XSBMVCcsXG4gICAgICAgICAgICBuZXh0RGF5IDogJ1tUb21vcnJvdyBhdF0gTFQnLFxuICAgICAgICAgICAgbmV4dFdlZWsgOiAnZGRkZCBbYXRdIExUJyxcbiAgICAgICAgICAgIGxhc3REYXkgOiAnW1llc3RlcmRheSBhdF0gTFQnLFxuICAgICAgICAgICAgbGFzdFdlZWsgOiAnW0xhc3RdIGRkZGQgW2F0XSBMVCcsXG4gICAgICAgICAgICBzYW1lRWxzZSA6ICdMJ1xuICAgICAgICB9LFxuICAgICAgICBjYWxlbmRhciA6IGZ1bmN0aW9uIChrZXksIG1vbSkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuX2NhbGVuZGFyW2tleV07XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIG91dHB1dCA9PT0gJ2Z1bmN0aW9uJyA/IG91dHB1dC5hcHBseShtb20pIDogb3V0cHV0O1xuICAgICAgICB9LFxuXG4gICAgICAgIF9yZWxhdGl2ZVRpbWUgOiB7XG4gICAgICAgICAgICBmdXR1cmUgOiBcImluICVzXCIsXG4gICAgICAgICAgICBwYXN0IDogXCIlcyBhZ29cIixcbiAgICAgICAgICAgIHMgOiBcImEgZmV3IHNlY29uZHNcIixcbiAgICAgICAgICAgIG0gOiBcImEgbWludXRlXCIsXG4gICAgICAgICAgICBtbSA6IFwiJWQgbWludXRlc1wiLFxuICAgICAgICAgICAgaCA6IFwiYW4gaG91clwiLFxuICAgICAgICAgICAgaGggOiBcIiVkIGhvdXJzXCIsXG4gICAgICAgICAgICBkIDogXCJhIGRheVwiLFxuICAgICAgICAgICAgZGQgOiBcIiVkIGRheXNcIixcbiAgICAgICAgICAgIE0gOiBcImEgbW9udGhcIixcbiAgICAgICAgICAgIE1NIDogXCIlZCBtb250aHNcIixcbiAgICAgICAgICAgIHkgOiBcImEgeWVhclwiLFxuICAgICAgICAgICAgeXkgOiBcIiVkIHllYXJzXCJcbiAgICAgICAgfSxcbiAgICAgICAgcmVsYXRpdmVUaW1lIDogZnVuY3Rpb24gKG51bWJlciwgd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuX3JlbGF0aXZlVGltZVtzdHJpbmddO1xuICAgICAgICAgICAgcmV0dXJuICh0eXBlb2Ygb3V0cHV0ID09PSAnZnVuY3Rpb24nKSA/XG4gICAgICAgICAgICAgICAgb3V0cHV0KG51bWJlciwgd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSkgOlxuICAgICAgICAgICAgICAgIG91dHB1dC5yZXBsYWNlKC8lZC9pLCBudW1iZXIpO1xuICAgICAgICB9LFxuICAgICAgICBwYXN0RnV0dXJlIDogZnVuY3Rpb24gKGRpZmYsIG91dHB1dCkge1xuICAgICAgICAgICAgdmFyIGZvcm1hdCA9IHRoaXMuX3JlbGF0aXZlVGltZVtkaWZmID4gMCA/ICdmdXR1cmUnIDogJ3Bhc3QnXTtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgZm9ybWF0ID09PSAnZnVuY3Rpb24nID8gZm9ybWF0KG91dHB1dCkgOiBmb3JtYXQucmVwbGFjZSgvJXMvaSwgb3V0cHV0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBvcmRpbmFsIDogZnVuY3Rpb24gKG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29yZGluYWwucmVwbGFjZShcIiVkXCIsIG51bWJlcik7XG4gICAgICAgIH0sXG4gICAgICAgIF9vcmRpbmFsIDogXCIlZFwiLFxuXG4gICAgICAgIHByZXBhcnNlIDogZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICAgICAgfSxcblxuICAgICAgICBwb3N0Zm9ybWF0IDogZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICAgICAgfSxcblxuICAgICAgICB3ZWVrIDogZnVuY3Rpb24gKG1vbSkge1xuICAgICAgICAgICAgcmV0dXJuIHdlZWtPZlllYXIobW9tLCB0aGlzLl93ZWVrLmRvdywgdGhpcy5fd2Vlay5kb3kpLndlZWs7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3dlZWsgOiB7XG4gICAgICAgICAgICBkb3cgOiAwLCAvLyBTdW5kYXkgaXMgdGhlIGZpcnN0IGRheSBvZiB0aGUgd2Vlay5cbiAgICAgICAgICAgIGRveSA6IDYgIC8vIFRoZSB3ZWVrIHRoYXQgY29udGFpbnMgSmFuIDFzdCBpcyB0aGUgZmlyc3Qgd2VlayBvZiB0aGUgeWVhci5cbiAgICAgICAgfSxcblxuICAgICAgICBfaW52YWxpZERhdGU6ICdJbnZhbGlkIGRhdGUnLFxuICAgICAgICBpbnZhbGlkRGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ludmFsaWREYXRlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBMb2FkcyBhIGxhbmd1YWdlIGRlZmluaXRpb24gaW50byB0aGUgYGxhbmd1YWdlc2AgY2FjaGUuICBUaGUgZnVuY3Rpb25cbiAgICAvLyB0YWtlcyBhIGtleSBhbmQgb3B0aW9uYWxseSB2YWx1ZXMuICBJZiBub3QgaW4gdGhlIGJyb3dzZXIgYW5kIG5vIHZhbHVlc1xuICAgIC8vIGFyZSBwcm92aWRlZCwgaXQgd2lsbCBsb2FkIHRoZSBsYW5ndWFnZSBmaWxlIG1vZHVsZS4gIEFzIGEgY29udmVuaWVuY2UsXG4gICAgLy8gdGhpcyBmdW5jdGlvbiBhbHNvIHJldHVybnMgdGhlIGxhbmd1YWdlIHZhbHVlcy5cbiAgICBmdW5jdGlvbiBsb2FkTGFuZyhrZXksIHZhbHVlcykge1xuICAgICAgICB2YWx1ZXMuYWJiciA9IGtleTtcbiAgICAgICAgaWYgKCFsYW5ndWFnZXNba2V5XSkge1xuICAgICAgICAgICAgbGFuZ3VhZ2VzW2tleV0gPSBuZXcgTGFuZ3VhZ2UoKTtcbiAgICAgICAgfVxuICAgICAgICBsYW5ndWFnZXNba2V5XS5zZXQodmFsdWVzKTtcbiAgICAgICAgcmV0dXJuIGxhbmd1YWdlc1trZXldO1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBhIGxhbmd1YWdlIGZyb20gdGhlIGBsYW5ndWFnZXNgIGNhY2hlLiBNb3N0bHkgdXNlZnVsIGluIHRlc3RzLlxuICAgIGZ1bmN0aW9uIHVubG9hZExhbmcoa2V5KSB7XG4gICAgICAgIGRlbGV0ZSBsYW5ndWFnZXNba2V5XTtcbiAgICB9XG5cbiAgICAvLyBEZXRlcm1pbmVzIHdoaWNoIGxhbmd1YWdlIGRlZmluaXRpb24gdG8gdXNlIGFuZCByZXR1cm5zIGl0LlxuICAgIC8vXG4gICAgLy8gV2l0aCBubyBwYXJhbWV0ZXJzLCBpdCB3aWxsIHJldHVybiB0aGUgZ2xvYmFsIGxhbmd1YWdlLiAgSWYgeW91XG4gICAgLy8gcGFzcyBpbiBhIGxhbmd1YWdlIGtleSwgc3VjaCBhcyAnZW4nLCBpdCB3aWxsIHJldHVybiB0aGVcbiAgICAvLyBkZWZpbml0aW9uIGZvciAnZW4nLCBzbyBsb25nIGFzICdlbicgaGFzIGFscmVhZHkgYmVlbiBsb2FkZWQgdXNpbmdcbiAgICAvLyBtb21lbnQubGFuZy5cbiAgICBmdW5jdGlvbiBnZXRMYW5nRGVmaW5pdGlvbihrZXkpIHtcbiAgICAgICAgdmFyIGkgPSAwLCBqLCBsYW5nLCBuZXh0LCBzcGxpdCxcbiAgICAgICAgICAgIGdldCA9IGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFsYW5ndWFnZXNba10gJiYgaGFzTW9kdWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlKCcuL2xhbmcvJyArIGspO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7IH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhbmd1YWdlc1trXTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBtb21lbnQuZm4uX2xhbmc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgICAgLy9zaG9ydC1jaXJjdWl0IGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgICAgICAgbGFuZyA9IGdldChrZXkpO1xuICAgICAgICAgICAgaWYgKGxhbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFuZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleSA9IFtrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9waWNrIHRoZSBsYW5ndWFnZSBmcm9tIHRoZSBhcnJheVxuICAgICAgICAvL3RyeSBbJ2VuLWF1JywgJ2VuLWdiJ10gYXMgJ2VuLWF1JywgJ2VuLWdiJywgJ2VuJywgYXMgaW4gbW92ZSB0aHJvdWdoIHRoZSBsaXN0IHRyeWluZyBlYWNoXG4gICAgICAgIC8vc3Vic3RyaW5nIGZyb20gbW9zdCBzcGVjaWZpYyB0byBsZWFzdCwgYnV0IG1vdmUgdG8gdGhlIG5leHQgYXJyYXkgaXRlbSBpZiBpdCdzIGEgbW9yZSBzcGVjaWZpYyB2YXJpYW50IHRoYW4gdGhlIGN1cnJlbnQgcm9vdFxuICAgICAgICB3aGlsZSAoaSA8IGtleS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHNwbGl0ID0gbm9ybWFsaXplTGFuZ3VhZ2Uoa2V5W2ldKS5zcGxpdCgnLScpO1xuICAgICAgICAgICAgaiA9IHNwbGl0Lmxlbmd0aDtcbiAgICAgICAgICAgIG5leHQgPSBub3JtYWxpemVMYW5ndWFnZShrZXlbaSArIDFdKTtcbiAgICAgICAgICAgIG5leHQgPSBuZXh0ID8gbmV4dC5zcGxpdCgnLScpIDogbnVsbDtcbiAgICAgICAgICAgIHdoaWxlIChqID4gMCkge1xuICAgICAgICAgICAgICAgIGxhbmcgPSBnZXQoc3BsaXQuc2xpY2UoMCwgaikuam9pbignLScpKTtcbiAgICAgICAgICAgICAgICBpZiAobGFuZykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFuZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5leHQgJiYgbmV4dC5sZW5ndGggPj0gaiAmJiBjb21wYXJlQXJyYXlzKHNwbGl0LCBuZXh0LCB0cnVlKSA+PSBqIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvL3RoZSBuZXh0IGFycmF5IGl0ZW0gaXMgYmV0dGVyIHRoYW4gYSBzaGFsbG93ZXIgc3Vic3RyaW5nIG9mIHRoaXMgb25lXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBqLS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1vbWVudC5mbi5fbGFuZztcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEZvcm1hdHRpbmdcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUZvcm1hdHRpbmdUb2tlbnMoaW5wdXQpIHtcbiAgICAgICAgaWYgKGlucHV0Lm1hdGNoKC9cXFtbXFxzXFxTXS8pKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvXlxcW3xcXF0kL2csIFwiXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9cXFxcL2csIFwiXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpIHtcbiAgICAgICAgdmFyIGFycmF5ID0gZm9ybWF0Lm1hdGNoKGZvcm1hdHRpbmdUb2tlbnMpLCBpLCBsZW5ndGg7XG5cbiAgICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChmb3JtYXRUb2tlbkZ1bmN0aW9uc1thcnJheVtpXV0pIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IGZvcm1hdFRva2VuRnVuY3Rpb25zW2FycmF5W2ldXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSByZW1vdmVGb3JtYXR0aW5nVG9rZW5zKGFycmF5W2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAobW9tKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gXCJcIjtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSBhcnJheVtpXSBpbnN0YW5jZW9mIEZ1bmN0aW9uID8gYXJyYXlbaV0uY2FsbChtb20sIGZvcm1hdCkgOiBhcnJheVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gZm9ybWF0IGRhdGUgdXNpbmcgbmF0aXZlIGRhdGUgb2JqZWN0XG4gICAgZnVuY3Rpb24gZm9ybWF0TW9tZW50KG0sIGZvcm1hdCkge1xuXG4gICAgICAgIGlmICghbS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBtLmxhbmcoKS5pbnZhbGlkRGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0ID0gZXhwYW5kRm9ybWF0KGZvcm1hdCwgbS5sYW5nKCkpO1xuXG4gICAgICAgIGlmICghZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0pIHtcbiAgICAgICAgICAgIGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdID0gbWFrZUZvcm1hdEZ1bmN0aW9uKGZvcm1hdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0obSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhwYW5kRm9ybWF0KGZvcm1hdCwgbGFuZykge1xuICAgICAgICB2YXIgaSA9IDU7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVwbGFjZUxvbmdEYXRlRm9ybWF0VG9rZW5zKGlucHV0KSB7XG4gICAgICAgICAgICByZXR1cm4gbGFuZy5sb25nRGF0ZUZvcm1hdChpbnB1dCkgfHwgaW5wdXQ7XG4gICAgICAgIH1cblxuICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPj0gMCAmJiBsb2NhbEZvcm1hdHRpbmdUb2tlbnMudGVzdChmb3JtYXQpKSB7XG4gICAgICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZShsb2NhbEZvcm1hdHRpbmdUb2tlbnMsIHJlcGxhY2VMb25nRGF0ZUZvcm1hdFRva2Vucyk7XG4gICAgICAgICAgICBsb2NhbEZvcm1hdHRpbmdUb2tlbnMubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgIGkgLT0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb3JtYXQ7XG4gICAgfVxuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIFBhcnNpbmdcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIC8vIGdldCB0aGUgcmVnZXggdG8gZmluZCB0aGUgbmV4dCB0b2tlblxuICAgIGZ1bmN0aW9uIGdldFBhcnNlUmVnZXhGb3JUb2tlbih0b2tlbiwgY29uZmlnKSB7XG4gICAgICAgIHZhciBhLCBzdHJpY3QgPSBjb25maWcuX3N0cmljdDtcbiAgICAgICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgICBjYXNlICdRJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuT25lRGlnaXQ7XG4gICAgICAgIGNhc2UgJ0REREQnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5UaHJlZURpZ2l0cztcbiAgICAgICAgY2FzZSAnWVlZWSc6XG4gICAgICAgIGNhc2UgJ0dHR0cnOlxuICAgICAgICBjYXNlICdnZ2dnJzpcbiAgICAgICAgICAgIHJldHVybiBzdHJpY3QgPyBwYXJzZVRva2VuRm91ckRpZ2l0cyA6IHBhcnNlVG9rZW5PbmVUb0ZvdXJEaWdpdHM7XG4gICAgICAgIGNhc2UgJ1knOlxuICAgICAgICBjYXNlICdHJzpcbiAgICAgICAgY2FzZSAnZyc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlblNpZ25lZE51bWJlcjtcbiAgICAgICAgY2FzZSAnWVlZWVlZJzpcbiAgICAgICAgY2FzZSAnWVlZWVknOlxuICAgICAgICBjYXNlICdHR0dHRyc6XG4gICAgICAgIGNhc2UgJ2dnZ2dnJzpcbiAgICAgICAgICAgIHJldHVybiBzdHJpY3QgPyBwYXJzZVRva2VuU2l4RGlnaXRzIDogcGFyc2VUb2tlbk9uZVRvU2l4RGlnaXRzO1xuICAgICAgICBjYXNlICdTJzpcbiAgICAgICAgICAgIGlmIChzdHJpY3QpIHsgcmV0dXJuIHBhcnNlVG9rZW5PbmVEaWdpdDsgfVxuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdTUyc6XG4gICAgICAgICAgICBpZiAoc3RyaWN0KSB7IHJldHVybiBwYXJzZVRva2VuVHdvRGlnaXRzOyB9XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ1NTUyc6XG4gICAgICAgICAgICBpZiAoc3RyaWN0KSB7IHJldHVybiBwYXJzZVRva2VuVGhyZWVEaWdpdHM7IH1cbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnREREJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuT25lVG9UaHJlZURpZ2l0cztcbiAgICAgICAgY2FzZSAnTU1NJzpcbiAgICAgICAgY2FzZSAnTU1NTSc6XG4gICAgICAgIGNhc2UgJ2RkJzpcbiAgICAgICAgY2FzZSAnZGRkJzpcbiAgICAgICAgY2FzZSAnZGRkZCc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlbldvcmQ7XG4gICAgICAgIGNhc2UgJ2EnOlxuICAgICAgICBjYXNlICdBJzpcbiAgICAgICAgICAgIHJldHVybiBnZXRMYW5nRGVmaW5pdGlvbihjb25maWcuX2wpLl9tZXJpZGllbVBhcnNlO1xuICAgICAgICBjYXNlICdYJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuVGltZXN0YW1wTXM7XG4gICAgICAgIGNhc2UgJ1onOlxuICAgICAgICBjYXNlICdaWic6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlblRpbWV6b25lO1xuICAgICAgICBjYXNlICdUJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuVDtcbiAgICAgICAgY2FzZSAnU1NTUyc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlbkRpZ2l0cztcbiAgICAgICAgY2FzZSAnTU0nOlxuICAgICAgICBjYXNlICdERCc6XG4gICAgICAgIGNhc2UgJ1lZJzpcbiAgICAgICAgY2FzZSAnR0cnOlxuICAgICAgICBjYXNlICdnZyc6XG4gICAgICAgIGNhc2UgJ0hIJzpcbiAgICAgICAgY2FzZSAnaGgnOlxuICAgICAgICBjYXNlICdtbSc6XG4gICAgICAgIGNhc2UgJ3NzJzpcbiAgICAgICAgY2FzZSAnd3cnOlxuICAgICAgICBjYXNlICdXVyc6XG4gICAgICAgICAgICByZXR1cm4gc3RyaWN0ID8gcGFyc2VUb2tlblR3b0RpZ2l0cyA6IHBhcnNlVG9rZW5PbmVPclR3b0RpZ2l0cztcbiAgICAgICAgY2FzZSAnTSc6XG4gICAgICAgIGNhc2UgJ0QnOlxuICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgY2FzZSAnSCc6XG4gICAgICAgIGNhc2UgJ2gnOlxuICAgICAgICBjYXNlICdtJzpcbiAgICAgICAgY2FzZSAncyc6XG4gICAgICAgIGNhc2UgJ3cnOlxuICAgICAgICBjYXNlICdXJzpcbiAgICAgICAgY2FzZSAnZSc6XG4gICAgICAgIGNhc2UgJ0UnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5PbmVPclR3b0RpZ2l0cztcbiAgICAgICAgY2FzZSAnRG8nOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5PcmRpbmFsO1xuICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICAgIGEgPSBuZXcgUmVnRXhwKHJlZ2V4cEVzY2FwZSh1bmVzY2FwZUZvcm1hdCh0b2tlbi5yZXBsYWNlKCdcXFxcJywgJycpKSwgXCJpXCIpKTtcbiAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGltZXpvbmVNaW51dGVzRnJvbVN0cmluZyhzdHJpbmcpIHtcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nIHx8IFwiXCI7XG4gICAgICAgIHZhciBwb3NzaWJsZVR6TWF0Y2hlcyA9IChzdHJpbmcubWF0Y2gocGFyc2VUb2tlblRpbWV6b25lKSB8fCBbXSksXG4gICAgICAgICAgICB0ekNodW5rID0gcG9zc2libGVUek1hdGNoZXNbcG9zc2libGVUek1hdGNoZXMubGVuZ3RoIC0gMV0gfHwgW10sXG4gICAgICAgICAgICBwYXJ0cyA9ICh0ekNodW5rICsgJycpLm1hdGNoKHBhcnNlVGltZXpvbmVDaHVua2VyKSB8fCBbJy0nLCAwLCAwXSxcbiAgICAgICAgICAgIG1pbnV0ZXMgPSArKHBhcnRzWzFdICogNjApICsgdG9JbnQocGFydHNbMl0pO1xuXG4gICAgICAgIHJldHVybiBwYXJ0c1swXSA9PT0gJysnID8gLW1pbnV0ZXMgOiBtaW51dGVzO1xuICAgIH1cblxuICAgIC8vIGZ1bmN0aW9uIHRvIGNvbnZlcnQgc3RyaW5nIGlucHV0IHRvIGRhdGVcbiAgICBmdW5jdGlvbiBhZGRUaW1lVG9BcnJheUZyb21Ub2tlbih0b2tlbiwgaW5wdXQsIGNvbmZpZykge1xuICAgICAgICB2YXIgYSwgZGF0ZVBhcnRBcnJheSA9IGNvbmZpZy5fYTtcblxuICAgICAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAgIC8vIFFVQVJURVJcbiAgICAgICAgY2FzZSAnUSc6XG4gICAgICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbTU9OVEhdID0gKHRvSW50KGlucHV0KSAtIDEpICogMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBNT05USFxuICAgICAgICBjYXNlICdNJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBNTVxuICAgICAgICBjYXNlICdNTScgOlxuICAgICAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkYXRlUGFydEFycmF5W01PTlRIXSA9IHRvSW50KGlucHV0KSAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnTU1NJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBNTU1NXG4gICAgICAgIGNhc2UgJ01NTU0nIDpcbiAgICAgICAgICAgIGEgPSBnZXRMYW5nRGVmaW5pdGlvbihjb25maWcuX2wpLm1vbnRoc1BhcnNlKGlucHV0KTtcbiAgICAgICAgICAgIC8vIGlmIHdlIGRpZG4ndCBmaW5kIGEgbW9udGggbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkLlxuICAgICAgICAgICAgaWYgKGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbTU9OVEhdID0gYTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9wZi5pbnZhbGlkTW9udGggPSBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBEQVkgT0YgTU9OVEhcbiAgICAgICAgY2FzZSAnRCcgOiAvLyBmYWxsIHRocm91Z2ggdG8gRERcbiAgICAgICAgY2FzZSAnREQnIDpcbiAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtEQVRFXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdEbycgOlxuICAgICAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkYXRlUGFydEFycmF5W0RBVEVdID0gdG9JbnQocGFyc2VJbnQoaW5wdXQsIDEwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gREFZIE9GIFlFQVJcbiAgICAgICAgY2FzZSAnREREJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBEREREXG4gICAgICAgIGNhc2UgJ0REREQnIDpcbiAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBZRUFSXG4gICAgICAgIGNhc2UgJ1lZJyA6XG4gICAgICAgICAgICBkYXRlUGFydEFycmF5W1lFQVJdID0gbW9tZW50LnBhcnNlVHdvRGlnaXRZZWFyKGlucHV0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdZWVlZJyA6XG4gICAgICAgIGNhc2UgJ1lZWVlZJyA6XG4gICAgICAgIGNhc2UgJ1lZWVlZWScgOlxuICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtZRUFSXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBBTSAvIFBNXG4gICAgICAgIGNhc2UgJ2EnIDogLy8gZmFsbCB0aHJvdWdoIHRvIEFcbiAgICAgICAgY2FzZSAnQScgOlxuICAgICAgICAgICAgY29uZmlnLl9pc1BtID0gZ2V0TGFuZ0RlZmluaXRpb24oY29uZmlnLl9sKS5pc1BNKGlucHV0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyAyNCBIT1VSXG4gICAgICAgIGNhc2UgJ0gnIDogLy8gZmFsbCB0aHJvdWdoIHRvIGhoXG4gICAgICAgIGNhc2UgJ0hIJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBoaFxuICAgICAgICBjYXNlICdoJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBoaFxuICAgICAgICBjYXNlICdoaCcgOlxuICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtIT1VSXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBNSU5VVEVcbiAgICAgICAgY2FzZSAnbScgOiAvLyBmYWxsIHRocm91Z2ggdG8gbW1cbiAgICAgICAgY2FzZSAnbW0nIDpcbiAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbTUlOVVRFXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBTRUNPTkRcbiAgICAgICAgY2FzZSAncycgOiAvLyBmYWxsIHRocm91Z2ggdG8gc3NcbiAgICAgICAgY2FzZSAnc3MnIDpcbiAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbU0VDT05EXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBNSUxMSVNFQ09ORFxuICAgICAgICBjYXNlICdTJyA6XG4gICAgICAgIGNhc2UgJ1NTJyA6XG4gICAgICAgIGNhc2UgJ1NTUycgOlxuICAgICAgICBjYXNlICdTU1NTJyA6XG4gICAgICAgICAgICBkYXRlUGFydEFycmF5W01JTExJU0VDT05EXSA9IHRvSW50KCgnMC4nICsgaW5wdXQpICogMTAwMCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gVU5JWCBUSU1FU1RBTVAgV0lUSCBNU1xuICAgICAgICBjYXNlICdYJzpcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKHBhcnNlRmxvYXQoaW5wdXQpICogMTAwMCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gVElNRVpPTkVcbiAgICAgICAgY2FzZSAnWicgOiAvLyBmYWxsIHRocm91Z2ggdG8gWlpcbiAgICAgICAgY2FzZSAnWlonIDpcbiAgICAgICAgICAgIGNvbmZpZy5fdXNlVVRDID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbmZpZy5fdHptID0gdGltZXpvbmVNaW51dGVzRnJvbVN0cmluZyhpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gV0VFS0RBWSAtIGh1bWFuXG4gICAgICAgIGNhc2UgJ2RkJzpcbiAgICAgICAgY2FzZSAnZGRkJzpcbiAgICAgICAgY2FzZSAnZGRkZCc6XG4gICAgICAgICAgICBhID0gZ2V0TGFuZ0RlZmluaXRpb24oY29uZmlnLl9sKS53ZWVrZGF5c1BhcnNlKGlucHV0KTtcbiAgICAgICAgICAgIC8vIGlmIHdlIGRpZG4ndCBnZXQgYSB3ZWVrZGF5IG5hbWUsIG1hcmsgdGhlIGRhdGUgYXMgaW52YWxpZFxuICAgICAgICAgICAgaWYgKGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fdyA9IGNvbmZpZy5fdyB8fCB7fTtcbiAgICAgICAgICAgICAgICBjb25maWcuX3dbJ2QnXSA9IGE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fcGYuaW52YWxpZFdlZWtkYXkgPSBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBXRUVLLCBXRUVLIERBWSAtIG51bWVyaWNcbiAgICAgICAgY2FzZSAndyc6XG4gICAgICAgIGNhc2UgJ3d3JzpcbiAgICAgICAgY2FzZSAnVyc6XG4gICAgICAgIGNhc2UgJ1dXJzpcbiAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgIGNhc2UgJ2UnOlxuICAgICAgICBjYXNlICdFJzpcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW4uc3Vic3RyKDAsIDEpO1xuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdnZ2dnJzpcbiAgICAgICAgY2FzZSAnR0dHRyc6XG4gICAgICAgIGNhc2UgJ0dHR0dHJzpcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW4uc3Vic3RyKDAsIDIpO1xuICAgICAgICAgICAgaWYgKGlucHV0KSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl93ID0gY29uZmlnLl93IHx8IHt9O1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fd1t0b2tlbl0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZ2cnOlxuICAgICAgICBjYXNlICdHRyc6XG4gICAgICAgICAgICBjb25maWcuX3cgPSBjb25maWcuX3cgfHwge307XG4gICAgICAgICAgICBjb25maWcuX3dbdG9rZW5dID0gbW9tZW50LnBhcnNlVHdvRGlnaXRZZWFyKGlucHV0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheU9mWWVhckZyb21XZWVrSW5mbyhjb25maWcpIHtcbiAgICAgICAgdmFyIHcsIHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3csIGRveSwgdGVtcCwgbGFuZztcblxuICAgICAgICB3ID0gY29uZmlnLl93O1xuICAgICAgICBpZiAody5HRyAhPSBudWxsIHx8IHcuVyAhPSBudWxsIHx8IHcuRSAhPSBudWxsKSB7XG4gICAgICAgICAgICBkb3cgPSAxO1xuICAgICAgICAgICAgZG95ID0gNDtcblxuICAgICAgICAgICAgLy8gVE9ETzogV2UgbmVlZCB0byB0YWtlIHRoZSBjdXJyZW50IGlzb1dlZWtZZWFyLCBidXQgdGhhdCBkZXBlbmRzIG9uXG4gICAgICAgICAgICAvLyBob3cgd2UgaW50ZXJwcmV0IG5vdyAobG9jYWwsIHV0YywgZml4ZWQgb2Zmc2V0KS4gU28gY3JlYXRlXG4gICAgICAgICAgICAvLyBhIG5vdyB2ZXJzaW9uIG9mIGN1cnJlbnQgY29uZmlnICh0YWtlIGxvY2FsL3V0Yy9vZmZzZXQgZmxhZ3MsIGFuZFxuICAgICAgICAgICAgLy8gY3JlYXRlIG5vdykuXG4gICAgICAgICAgICB3ZWVrWWVhciA9IGRmbCh3LkdHLCBjb25maWcuX2FbWUVBUl0sIHdlZWtPZlllYXIobW9tZW50KCksIDEsIDQpLnllYXIpO1xuICAgICAgICAgICAgd2VlayA9IGRmbCh3LlcsIDEpO1xuICAgICAgICAgICAgd2Vla2RheSA9IGRmbCh3LkUsIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGFuZyA9IGdldExhbmdEZWZpbml0aW9uKGNvbmZpZy5fbCk7XG4gICAgICAgICAgICBkb3cgPSBsYW5nLl93ZWVrLmRvdztcbiAgICAgICAgICAgIGRveSA9IGxhbmcuX3dlZWsuZG95O1xuXG4gICAgICAgICAgICB3ZWVrWWVhciA9IGRmbCh3LmdnLCBjb25maWcuX2FbWUVBUl0sIHdlZWtPZlllYXIobW9tZW50KCksIGRvdywgZG95KS55ZWFyKTtcbiAgICAgICAgICAgIHdlZWsgPSBkZmwody53LCAxKTtcblxuICAgICAgICAgICAgaWYgKHcuZCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gd2Vla2RheSAtLSBsb3cgZGF5IG51bWJlcnMgYXJlIGNvbnNpZGVyZWQgbmV4dCB3ZWVrXG4gICAgICAgICAgICAgICAgd2Vla2RheSA9IHcuZDtcbiAgICAgICAgICAgICAgICBpZiAod2Vla2RheSA8IGRvdykge1xuICAgICAgICAgICAgICAgICAgICArK3dlZWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh3LmUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIGxvY2FsIHdlZWtkYXkgLS0gY291bnRpbmcgc3RhcnRzIGZyb20gYmVnaW5pbmcgb2Ygd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSB3LmUgKyBkb3c7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgdG8gYmVnaW5pbmcgb2Ygd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSBkb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGVtcCA9IGRheU9mWWVhckZyb21XZWVrcyh3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG95LCBkb3cpO1xuXG4gICAgICAgIGNvbmZpZy5fYVtZRUFSXSA9IHRlbXAueWVhcjtcbiAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPSB0ZW1wLmRheU9mWWVhcjtcbiAgICB9XG5cbiAgICAvLyBjb252ZXJ0IGFuIGFycmF5IHRvIGEgZGF0ZS5cbiAgICAvLyB0aGUgYXJyYXkgc2hvdWxkIG1pcnJvciB0aGUgcGFyYW1ldGVycyBiZWxvd1xuICAgIC8vIG5vdGU6IGFsbCB2YWx1ZXMgcGFzdCB0aGUgeWVhciBhcmUgb3B0aW9uYWwgYW5kIHdpbGwgZGVmYXVsdCB0byB0aGUgbG93ZXN0IHBvc3NpYmxlIHZhbHVlLlxuICAgIC8vIFt5ZWFyLCBtb250aCwgZGF5ICwgaG91ciwgbWludXRlLCBzZWNvbmQsIG1pbGxpc2Vjb25kXVxuICAgIGZ1bmN0aW9uIGRhdGVGcm9tQ29uZmlnKGNvbmZpZykge1xuICAgICAgICB2YXIgaSwgZGF0ZSwgaW5wdXQgPSBbXSwgY3VycmVudERhdGUsIHllYXJUb1VzZTtcblxuICAgICAgICBpZiAoY29uZmlnLl9kKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50RGF0ZSA9IGN1cnJlbnREYXRlQXJyYXkoY29uZmlnKTtcblxuICAgICAgICAvL2NvbXB1dGUgZGF5IG9mIHRoZSB5ZWFyIGZyb20gd2Vla3MgYW5kIHdlZWtkYXlzXG4gICAgICAgIGlmIChjb25maWcuX3cgJiYgY29uZmlnLl9hW0RBVEVdID09IG51bGwgJiYgY29uZmlnLl9hW01PTlRIXSA9PSBudWxsKSB7XG4gICAgICAgICAgICBkYXlPZlllYXJGcm9tV2Vla0luZm8oY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vaWYgdGhlIGRheSBvZiB0aGUgeWVhciBpcyBzZXQsIGZpZ3VyZSBvdXQgd2hhdCBpdCBpc1xuICAgICAgICBpZiAoY29uZmlnLl9kYXlPZlllYXIpIHtcbiAgICAgICAgICAgIHllYXJUb1VzZSA9IGRmbChjb25maWcuX2FbWUVBUl0sIGN1cnJlbnREYXRlW1lFQVJdKTtcblxuICAgICAgICAgICAgaWYgKGNvbmZpZy5fZGF5T2ZZZWFyID4gZGF5c0luWWVhcih5ZWFyVG9Vc2UpKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9wZi5fb3ZlcmZsb3dEYXlPZlllYXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkYXRlID0gbWFrZVVUQ0RhdGUoeWVhclRvVXNlLCAwLCBjb25maWcuX2RheU9mWWVhcik7XG4gICAgICAgICAgICBjb25maWcuX2FbTU9OVEhdID0gZGF0ZS5nZXRVVENNb250aCgpO1xuICAgICAgICAgICAgY29uZmlnLl9hW0RBVEVdID0gZGF0ZS5nZXRVVENEYXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZWZhdWx0IHRvIGN1cnJlbnQgZGF0ZS5cbiAgICAgICAgLy8gKiBpZiBubyB5ZWFyLCBtb250aCwgZGF5IG9mIG1vbnRoIGFyZSBnaXZlbiwgZGVmYXVsdCB0byB0b2RheVxuICAgICAgICAvLyAqIGlmIGRheSBvZiBtb250aCBpcyBnaXZlbiwgZGVmYXVsdCBtb250aCBhbmQgeWVhclxuICAgICAgICAvLyAqIGlmIG1vbnRoIGlzIGdpdmVuLCBkZWZhdWx0IG9ubHkgeWVhclxuICAgICAgICAvLyAqIGlmIHllYXIgaXMgZ2l2ZW4sIGRvbid0IGRlZmF1bHQgYW55dGhpbmdcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDMgJiYgY29uZmlnLl9hW2ldID09IG51bGw7ICsraSkge1xuICAgICAgICAgICAgY29uZmlnLl9hW2ldID0gaW5wdXRbaV0gPSBjdXJyZW50RGF0ZVtpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFplcm8gb3V0IHdoYXRldmVyIHdhcyBub3QgZGVmYXVsdGVkLCBpbmNsdWRpbmcgdGltZVxuICAgICAgICBmb3IgKDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgY29uZmlnLl9hW2ldID0gaW5wdXRbaV0gPSAoY29uZmlnLl9hW2ldID09IG51bGwpID8gKGkgPT09IDIgPyAxIDogMCkgOiBjb25maWcuX2FbaV07XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWcuX2QgPSAoY29uZmlnLl91c2VVVEMgPyBtYWtlVVRDRGF0ZSA6IG1ha2VEYXRlKS5hcHBseShudWxsLCBpbnB1dCk7XG4gICAgICAgIC8vIEFwcGx5IHRpbWV6b25lIG9mZnNldCBmcm9tIGlucHV0LiBUaGUgYWN0dWFsIHpvbmUgY2FuIGJlIGNoYW5nZWRcbiAgICAgICAgLy8gd2l0aCBwYXJzZVpvbmUuXG4gICAgICAgIGlmIChjb25maWcuX3R6bSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb25maWcuX2Quc2V0VVRDTWludXRlcyhjb25maWcuX2QuZ2V0VVRDTWludXRlcygpICsgY29uZmlnLl90em0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGF0ZUZyb21PYmplY3QoY29uZmlnKSB7XG4gICAgICAgIHZhciBub3JtYWxpemVkSW5wdXQ7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbm9ybWFsaXplZElucHV0ID0gbm9ybWFsaXplT2JqZWN0VW5pdHMoY29uZmlnLl9pKTtcbiAgICAgICAgY29uZmlnLl9hID0gW1xuICAgICAgICAgICAgbm9ybWFsaXplZElucHV0LnllYXIsXG4gICAgICAgICAgICBub3JtYWxpemVkSW5wdXQubW9udGgsXG4gICAgICAgICAgICBub3JtYWxpemVkSW5wdXQuZGF5LFxuICAgICAgICAgICAgbm9ybWFsaXplZElucHV0LmhvdXIsXG4gICAgICAgICAgICBub3JtYWxpemVkSW5wdXQubWludXRlLFxuICAgICAgICAgICAgbm9ybWFsaXplZElucHV0LnNlY29uZCxcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dC5taWxsaXNlY29uZFxuICAgICAgICBdO1xuXG4gICAgICAgIGRhdGVGcm9tQ29uZmlnKGNvbmZpZyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY3VycmVudERhdGVBcnJheShjb25maWcpIHtcbiAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGlmIChjb25maWcuX3VzZVVUQykge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBub3cuZ2V0VVRDRnVsbFllYXIoKSxcbiAgICAgICAgICAgICAgICBub3cuZ2V0VVRDTW9udGgoKSxcbiAgICAgICAgICAgICAgICBub3cuZ2V0VVRDRGF0ZSgpXG4gICAgICAgICAgICBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFtub3cuZ2V0RnVsbFllYXIoKSwgbm93LmdldE1vbnRoKCksIG5vdy5nZXREYXRlKCldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGF0ZSBmcm9tIHN0cmluZyBhbmQgZm9ybWF0IHN0cmluZ1xuICAgIGZ1bmN0aW9uIG1ha2VEYXRlRnJvbVN0cmluZ0FuZEZvcm1hdChjb25maWcpIHtcblxuICAgICAgICBpZiAoY29uZmlnLl9mID09PSBtb21lbnQuSVNPXzg2MDEpIHtcbiAgICAgICAgICAgIHBhcnNlSVNPKGNvbmZpZyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWcuX2EgPSBbXTtcbiAgICAgICAgY29uZmlnLl9wZi5lbXB0eSA9IHRydWU7XG5cbiAgICAgICAgLy8gVGhpcyBhcnJheSBpcyB1c2VkIHRvIG1ha2UgYSBEYXRlLCBlaXRoZXIgd2l0aCBgbmV3IERhdGVgIG9yIGBEYXRlLlVUQ2BcbiAgICAgICAgdmFyIGxhbmcgPSBnZXRMYW5nRGVmaW5pdGlvbihjb25maWcuX2wpLFxuICAgICAgICAgICAgc3RyaW5nID0gJycgKyBjb25maWcuX2ksXG4gICAgICAgICAgICBpLCBwYXJzZWRJbnB1dCwgdG9rZW5zLCB0b2tlbiwgc2tpcHBlZCxcbiAgICAgICAgICAgIHN0cmluZ0xlbmd0aCA9IHN0cmluZy5sZW5ndGgsXG4gICAgICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoID0gMDtcblxuICAgICAgICB0b2tlbnMgPSBleHBhbmRGb3JtYXQoY29uZmlnLl9mLCBsYW5nKS5tYXRjaChmb3JtYXR0aW5nVG9rZW5zKSB8fCBbXTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcbiAgICAgICAgICAgIHBhcnNlZElucHV0ID0gKHN0cmluZy5tYXRjaChnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4odG9rZW4sIGNvbmZpZykpIHx8IFtdKVswXTtcbiAgICAgICAgICAgIGlmIChwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgIHNraXBwZWQgPSBzdHJpbmcuc3Vic3RyKDAsIHN0cmluZy5pbmRleE9mKHBhcnNlZElucHV0KSk7XG4gICAgICAgICAgICAgICAgaWYgKHNraXBwZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25maWcuX3BmLnVudXNlZElucHV0LnB1c2goc2tpcHBlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0cmluZyA9IHN0cmluZy5zbGljZShzdHJpbmcuaW5kZXhPZihwYXJzZWRJbnB1dCkgKyBwYXJzZWRJbnB1dC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGggKz0gcGFyc2VkSW5wdXQubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZG9uJ3QgcGFyc2UgaWYgaXQncyBub3QgYSBrbm93biB0b2tlblxuICAgICAgICAgICAgaWYgKGZvcm1hdFRva2VuRnVuY3Rpb25zW3Rva2VuXSkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICBjb25maWcuX3BmLmVtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25maWcuX3BmLnVudXNlZFRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYWRkVGltZVRvQXJyYXlGcm9tVG9rZW4odG9rZW4sIHBhcnNlZElucHV0LCBjb25maWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29uZmlnLl9zdHJpY3QgJiYgIXBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9wZi51bnVzZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhZGQgcmVtYWluaW5nIHVucGFyc2VkIGlucHV0IGxlbmd0aCB0byB0aGUgc3RyaW5nXG4gICAgICAgIGNvbmZpZy5fcGYuY2hhcnNMZWZ0T3ZlciA9IHN0cmluZ0xlbmd0aCAtIHRvdGFsUGFyc2VkSW5wdXRMZW5ndGg7XG4gICAgICAgIGlmIChzdHJpbmcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uZmlnLl9wZi51bnVzZWRJbnB1dC5wdXNoKHN0cmluZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBoYW5kbGUgYW0gcG1cbiAgICAgICAgaWYgKGNvbmZpZy5faXNQbSAmJiBjb25maWcuX2FbSE9VUl0gPCAxMikge1xuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdICs9IDEyO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmIGlzIDEyIGFtLCBjaGFuZ2UgaG91cnMgdG8gMFxuICAgICAgICBpZiAoY29uZmlnLl9pc1BtID09PSBmYWxzZSAmJiBjb25maWcuX2FbSE9VUl0gPT09IDEyKSB7XG4gICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgZGF0ZUZyb21Db25maWcoY29uZmlnKTtcbiAgICAgICAgY2hlY2tPdmVyZmxvdyhjb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVuZXNjYXBlRm9ybWF0KHMpIHtcbiAgICAgICAgcmV0dXJuIHMucmVwbGFjZSgvXFxcXChcXFspfFxcXFwoXFxdKXxcXFsoW15cXF1cXFtdKilcXF18XFxcXCguKS9nLCBmdW5jdGlvbiAobWF0Y2hlZCwgcDEsIHAyLCBwMywgcDQpIHtcbiAgICAgICAgICAgIHJldHVybiBwMSB8fCBwMiB8fCBwMyB8fCBwNDtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQ29kZSBmcm9tIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzU2MTQ5My9pcy10aGVyZS1hLXJlZ2V4cC1lc2NhcGUtZnVuY3Rpb24taW4tamF2YXNjcmlwdFxuICAgIGZ1bmN0aW9uIHJlZ2V4cEVzY2FwZShzKSB7XG4gICAgICAgIHJldHVybiBzLnJlcGxhY2UoL1stXFwvXFxcXF4kKis/LigpfFtcXF17fV0vZywgJ1xcXFwkJicpO1xuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSBzdHJpbmcgYW5kIGFycmF5IG9mIGZvcm1hdCBzdHJpbmdzXG4gICAgZnVuY3Rpb24gbWFrZURhdGVGcm9tU3RyaW5nQW5kQXJyYXkoY29uZmlnKSB7XG4gICAgICAgIHZhciB0ZW1wQ29uZmlnLFxuICAgICAgICAgICAgYmVzdE1vbWVudCxcblxuICAgICAgICAgICAgc2NvcmVUb0JlYXQsXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgY3VycmVudFNjb3JlO1xuXG4gICAgICAgIGlmIChjb25maWcuX2YubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBjb25maWcuX3BmLmludmFsaWRGb3JtYXQgPSB0cnVlO1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoTmFOKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb25maWcuX2YubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSA9IDA7XG4gICAgICAgICAgICB0ZW1wQ29uZmlnID0gZXh0ZW5kKHt9LCBjb25maWcpO1xuICAgICAgICAgICAgdGVtcENvbmZpZy5fcGYgPSBkZWZhdWx0UGFyc2luZ0ZsYWdzKCk7XG4gICAgICAgICAgICB0ZW1wQ29uZmlnLl9mID0gY29uZmlnLl9mW2ldO1xuICAgICAgICAgICAgbWFrZURhdGVGcm9tU3RyaW5nQW5kRm9ybWF0KHRlbXBDb25maWcpO1xuXG4gICAgICAgICAgICBpZiAoIWlzVmFsaWQodGVtcENvbmZpZykpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYW55IGlucHV0IHRoYXQgd2FzIG5vdCBwYXJzZWQgYWRkIGEgcGVuYWx0eSBmb3IgdGhhdCBmb3JtYXRcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSArPSB0ZW1wQ29uZmlnLl9wZi5jaGFyc0xlZnRPdmVyO1xuXG4gICAgICAgICAgICAvL29yIHRva2Vuc1xuICAgICAgICAgICAgY3VycmVudFNjb3JlICs9IHRlbXBDb25maWcuX3BmLnVudXNlZFRva2Vucy5sZW5ndGggKiAxMDtcblxuICAgICAgICAgICAgdGVtcENvbmZpZy5fcGYuc2NvcmUgPSBjdXJyZW50U2NvcmU7XG5cbiAgICAgICAgICAgIGlmIChzY29yZVRvQmVhdCA9PSBudWxsIHx8IGN1cnJlbnRTY29yZSA8IHNjb3JlVG9CZWF0KSB7XG4gICAgICAgICAgICAgICAgc2NvcmVUb0JlYXQgPSBjdXJyZW50U2NvcmU7XG4gICAgICAgICAgICAgICAgYmVzdE1vbWVudCA9IHRlbXBDb25maWc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHRlbmQoY29uZmlnLCBiZXN0TW9tZW50IHx8IHRlbXBDb25maWcpO1xuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSBpc28gZm9ybWF0XG4gICAgZnVuY3Rpb24gcGFyc2VJU08oY29uZmlnKSB7XG4gICAgICAgIHZhciBpLCBsLFxuICAgICAgICAgICAgc3RyaW5nID0gY29uZmlnLl9pLFxuICAgICAgICAgICAgbWF0Y2ggPSBpc29SZWdleC5leGVjKHN0cmluZyk7XG5cbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICBjb25maWcuX3BmLmlzbyA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsID0gaXNvRGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzb0RhdGVzW2ldWzFdLmV4ZWMoc3RyaW5nKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBtYXRjaFs1XSBzaG91bGQgYmUgXCJUXCIgb3IgdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5fZiA9IGlzb0RhdGVzW2ldWzBdICsgKG1hdGNoWzZdIHx8IFwiIFwiKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IGlzb1RpbWVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpc29UaW1lc1tpXVsxXS5leGVjKHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9mICs9IGlzb1RpbWVzW2ldWzBdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3RyaW5nLm1hdGNoKHBhcnNlVG9rZW5UaW1lem9uZSkpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX2YgKz0gXCJaXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYWtlRGF0ZUZyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGF0ZSBmcm9tIGlzbyBmb3JtYXQgb3IgZmFsbGJhY2tcbiAgICBmdW5jdGlvbiBtYWtlRGF0ZUZyb21TdHJpbmcoY29uZmlnKSB7XG4gICAgICAgIHBhcnNlSVNPKGNvbmZpZyk7XG4gICAgICAgIGlmIChjb25maWcuX2lzVmFsaWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBkZWxldGUgY29uZmlnLl9pc1ZhbGlkO1xuICAgICAgICAgICAgbW9tZW50LmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrKGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlRGF0ZUZyb21JbnB1dChjb25maWcpIHtcbiAgICAgICAgdmFyIGlucHV0ID0gY29uZmlnLl9pLFxuICAgICAgICAgICAgbWF0Y2hlZCA9IGFzcE5ldEpzb25SZWdleC5leGVjKGlucHV0KTtcblxuICAgICAgICBpZiAoaW5wdXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoKTtcbiAgICAgICAgfSBlbHNlIGlmIChtYXRjaGVkKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSgrbWF0Y2hlZFsxXSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgbWFrZURhdGVGcm9tU3RyaW5nKGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYSA9IGlucHV0LnNsaWNlKDApO1xuICAgICAgICAgICAgZGF0ZUZyb21Db25maWcoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0RhdGUoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSgraW5wdXQpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZihpbnB1dCkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBkYXRlRnJvbU9iamVjdChjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZihpbnB1dCkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAvLyBmcm9tIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoaW5wdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbW9tZW50LmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrKGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlRGF0ZSh5LCBtLCBkLCBoLCBNLCBzLCBtcykge1xuICAgICAgICAvL2Nhbid0IGp1c3QgYXBwbHkoKSB0byBjcmVhdGUgYSBkYXRlOlxuICAgICAgICAvL2h0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTgxMzQ4L2luc3RhbnRpYXRpbmctYS1qYXZhc2NyaXB0LW9iamVjdC1ieS1jYWxsaW5nLXByb3RvdHlwZS1jb25zdHJ1Y3Rvci1hcHBseVxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHksIG0sIGQsIGgsIE0sIHMsIG1zKTtcblxuICAgICAgICAvL3RoZSBkYXRlIGNvbnN0cnVjdG9yIGRvZXNuJ3QgYWNjZXB0IHllYXJzIDwgMTk3MFxuICAgICAgICBpZiAoeSA8IDE5NzApIHtcbiAgICAgICAgICAgIGRhdGUuc2V0RnVsbFllYXIoeSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZVVUQ0RhdGUoeSkge1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKERhdGUuVVRDLmFwcGx5KG51bGwsIGFyZ3VtZW50cykpO1xuICAgICAgICBpZiAoeSA8IDE5NzApIHtcbiAgICAgICAgICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoeSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VXZWVrZGF5KGlucHV0LCBsYW5ndWFnZSkge1xuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWYgKCFpc05hTihpbnB1dCkpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IHBhcnNlSW50KGlucHV0LCAxMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IGxhbmd1YWdlLndlZWtkYXlzUGFyc2UoaW5wdXQpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBSZWxhdGl2ZSBUaW1lXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICAvLyBoZWxwZXIgZnVuY3Rpb24gZm9yIG1vbWVudC5mbi5mcm9tLCBtb21lbnQuZm4uZnJvbU5vdywgYW5kIG1vbWVudC5kdXJhdGlvbi5mbi5odW1hbml6ZVxuICAgIGZ1bmN0aW9uIHN1YnN0aXR1dGVUaW1lQWdvKHN0cmluZywgbnVtYmVyLCB3aXRob3V0U3VmZml4LCBpc0Z1dHVyZSwgbGFuZykge1xuICAgICAgICByZXR1cm4gbGFuZy5yZWxhdGl2ZVRpbWUobnVtYmVyIHx8IDEsICEhd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVsYXRpdmVUaW1lKG1pbGxpc2Vjb25kcywgd2l0aG91dFN1ZmZpeCwgbGFuZykge1xuICAgICAgICB2YXIgc2Vjb25kcyA9IHJvdW5kKE1hdGguYWJzKG1pbGxpc2Vjb25kcykgLyAxMDAwKSxcbiAgICAgICAgICAgIG1pbnV0ZXMgPSByb3VuZChzZWNvbmRzIC8gNjApLFxuICAgICAgICAgICAgaG91cnMgPSByb3VuZChtaW51dGVzIC8gNjApLFxuICAgICAgICAgICAgZGF5cyA9IHJvdW5kKGhvdXJzIC8gMjQpLFxuICAgICAgICAgICAgeWVhcnMgPSByb3VuZChkYXlzIC8gMzY1KSxcbiAgICAgICAgICAgIGFyZ3MgPSBzZWNvbmRzIDwgcmVsYXRpdmVUaW1lVGhyZXNob2xkcy5zICAmJiBbJ3MnLCBzZWNvbmRzXSB8fFxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPT09IDEgJiYgWydtJ10gfHxcbiAgICAgICAgICAgICAgICBtaW51dGVzIDwgcmVsYXRpdmVUaW1lVGhyZXNob2xkcy5tICYmIFsnbW0nLCBtaW51dGVzXSB8fFxuICAgICAgICAgICAgICAgIGhvdXJzID09PSAxICYmIFsnaCddIHx8XG4gICAgICAgICAgICAgICAgaG91cnMgPCByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzLmggJiYgWydoaCcsIGhvdXJzXSB8fFxuICAgICAgICAgICAgICAgIGRheXMgPT09IDEgJiYgWydkJ10gfHxcbiAgICAgICAgICAgICAgICBkYXlzIDw9IHJlbGF0aXZlVGltZVRocmVzaG9sZHMuZGQgJiYgWydkZCcsIGRheXNdIHx8XG4gICAgICAgICAgICAgICAgZGF5cyA8PSByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzLmRtICYmIFsnTSddIHx8XG4gICAgICAgICAgICAgICAgZGF5cyA8IHJlbGF0aXZlVGltZVRocmVzaG9sZHMuZHkgJiYgWydNTScsIHJvdW5kKGRheXMgLyAzMCldIHx8XG4gICAgICAgICAgICAgICAgeWVhcnMgPT09IDEgJiYgWyd5J10gfHwgWyd5eScsIHllYXJzXTtcbiAgICAgICAgYXJnc1syXSA9IHdpdGhvdXRTdWZmaXg7XG4gICAgICAgIGFyZ3NbM10gPSBtaWxsaXNlY29uZHMgPiAwO1xuICAgICAgICBhcmdzWzRdID0gbGFuZztcbiAgICAgICAgcmV0dXJuIHN1YnN0aXR1dGVUaW1lQWdvLmFwcGx5KHt9LCBhcmdzKTtcbiAgICB9XG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgV2VlayBvZiBZZWFyXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICAvLyBmaXJzdERheU9mV2VlayAgICAgICAwID0gc3VuLCA2ID0gc2F0XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgdGhlIGRheSBvZiB0aGUgd2VlayB0aGF0IHN0YXJ0cyB0aGUgd2Vla1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICh1c3VhbGx5IHN1bmRheSBvciBtb25kYXkpXG4gICAgLy8gZmlyc3REYXlPZldlZWtPZlllYXIgMCA9IHN1biwgNiA9IHNhdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIHRoZSBmaXJzdCB3ZWVrIGlzIHRoZSB3ZWVrIHRoYXQgY29udGFpbnMgdGhlIGZpcnN0XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgb2YgdGhpcyBkYXkgb2YgdGhlIHdlZWtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAoZWcuIElTTyB3ZWVrcyB1c2UgdGh1cnNkYXkgKDQpKVxuICAgIGZ1bmN0aW9uIHdlZWtPZlllYXIobW9tLCBmaXJzdERheU9mV2VlaywgZmlyc3REYXlPZldlZWtPZlllYXIpIHtcbiAgICAgICAgdmFyIGVuZCA9IGZpcnN0RGF5T2ZXZWVrT2ZZZWFyIC0gZmlyc3REYXlPZldlZWssXG4gICAgICAgICAgICBkYXlzVG9EYXlPZldlZWsgPSBmaXJzdERheU9mV2Vla09mWWVhciAtIG1vbS5kYXkoKSxcbiAgICAgICAgICAgIGFkanVzdGVkTW9tZW50O1xuXG5cbiAgICAgICAgaWYgKGRheXNUb0RheU9mV2VlayA+IGVuZCkge1xuICAgICAgICAgICAgZGF5c1RvRGF5T2ZXZWVrIC09IDc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGF5c1RvRGF5T2ZXZWVrIDwgZW5kIC0gNykge1xuICAgICAgICAgICAgZGF5c1RvRGF5T2ZXZWVrICs9IDc7XG4gICAgICAgIH1cblxuICAgICAgICBhZGp1c3RlZE1vbWVudCA9IG1vbWVudChtb20pLmFkZCgnZCcsIGRheXNUb0RheU9mV2Vlayk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3ZWVrOiBNYXRoLmNlaWwoYWRqdXN0ZWRNb21lbnQuZGF5T2ZZZWFyKCkgLyA3KSxcbiAgICAgICAgICAgIHllYXI6IGFkanVzdGVkTW9tZW50LnllYXIoKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9JU09fd2Vla19kYXRlI0NhbGN1bGF0aW5nX2FfZGF0ZV9naXZlbl90aGVfeWVhci4yQ193ZWVrX251bWJlcl9hbmRfd2Vla2RheVxuICAgIGZ1bmN0aW9uIGRheU9mWWVhckZyb21XZWVrcyh5ZWFyLCB3ZWVrLCB3ZWVrZGF5LCBmaXJzdERheU9mV2Vla09mWWVhciwgZmlyc3REYXlPZldlZWspIHtcbiAgICAgICAgdmFyIGQgPSBtYWtlVVRDRGF0ZSh5ZWFyLCAwLCAxKS5nZXRVVENEYXkoKSwgZGF5c1RvQWRkLCBkYXlPZlllYXI7XG5cbiAgICAgICAgZCA9IGQgPT09IDAgPyA3IDogZDtcbiAgICAgICAgd2Vla2RheSA9IHdlZWtkYXkgIT0gbnVsbCA/IHdlZWtkYXkgOiBmaXJzdERheU9mV2VlaztcbiAgICAgICAgZGF5c1RvQWRkID0gZmlyc3REYXlPZldlZWsgLSBkICsgKGQgPiBmaXJzdERheU9mV2Vla09mWWVhciA/IDcgOiAwKSAtIChkIDwgZmlyc3REYXlPZldlZWsgPyA3IDogMCk7XG4gICAgICAgIGRheU9mWWVhciA9IDcgKiAod2VlayAtIDEpICsgKHdlZWtkYXkgLSBmaXJzdERheU9mV2VlaykgKyBkYXlzVG9BZGQgKyAxO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB5ZWFyOiBkYXlPZlllYXIgPiAwID8geWVhciA6IHllYXIgLSAxLFxuICAgICAgICAgICAgZGF5T2ZZZWFyOiBkYXlPZlllYXIgPiAwID8gIGRheU9mWWVhciA6IGRheXNJblllYXIoeWVhciAtIDEpICsgZGF5T2ZZZWFyXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBUb3AgTGV2ZWwgRnVuY3Rpb25zXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgZnVuY3Rpb24gbWFrZU1vbWVudChjb25maWcpIHtcbiAgICAgICAgdmFyIGlucHV0ID0gY29uZmlnLl9pLFxuICAgICAgICAgICAgZm9ybWF0ID0gY29uZmlnLl9mO1xuXG4gICAgICAgIGlmIChpbnB1dCA9PT0gbnVsbCB8fCAoZm9ybWF0ID09PSB1bmRlZmluZWQgJiYgaW5wdXQgPT09ICcnKSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudC5pbnZhbGlkKHtudWxsSW5wdXQ6IHRydWV9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjb25maWcuX2kgPSBpbnB1dCA9IGdldExhbmdEZWZpbml0aW9uKCkucHJlcGFyc2UoaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vbWVudC5pc01vbWVudChpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZyA9IGNsb25lTW9tZW50KGlucHV0KTtcblxuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoK2lucHV0Ll9kKTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQpIHtcbiAgICAgICAgICAgIGlmIChpc0FycmF5KGZvcm1hdCkpIHtcbiAgICAgICAgICAgICAgICBtYWtlRGF0ZUZyb21TdHJpbmdBbmRBcnJheShjb25maWcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtYWtlRGF0ZUZyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1ha2VEYXRlRnJvbUlucHV0KGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IE1vbWVudChjb25maWcpO1xuICAgIH1cblxuICAgIG1vbWVudCA9IGZ1bmN0aW9uIChpbnB1dCwgZm9ybWF0LCBsYW5nLCBzdHJpY3QpIHtcbiAgICAgICAgdmFyIGM7XG5cbiAgICAgICAgaWYgKHR5cGVvZihsYW5nKSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICAgIHN0cmljdCA9IGxhbmc7XG4gICAgICAgICAgICBsYW5nID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9iamVjdCBjb25zdHJ1Y3Rpb24gbXVzdCBiZSBkb25lIHRoaXMgd2F5LlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTQyM1xuICAgICAgICBjID0ge307XG4gICAgICAgIGMuX2lzQU1vbWVudE9iamVjdCA9IHRydWU7XG4gICAgICAgIGMuX2kgPSBpbnB1dDtcbiAgICAgICAgYy5fZiA9IGZvcm1hdDtcbiAgICAgICAgYy5fbCA9IGxhbmc7XG4gICAgICAgIGMuX3N0cmljdCA9IHN0cmljdDtcbiAgICAgICAgYy5faXNVVEMgPSBmYWxzZTtcbiAgICAgICAgYy5fcGYgPSBkZWZhdWx0UGFyc2luZ0ZsYWdzKCk7XG5cbiAgICAgICAgcmV0dXJuIG1ha2VNb21lbnQoYyk7XG4gICAgfTtcblxuICAgIG1vbWVudC5zdXBwcmVzc0RlcHJlY2F0aW9uV2FybmluZ3MgPSBmYWxzZTtcblxuICAgIG1vbWVudC5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayA9IGRlcHJlY2F0ZShcbiAgICAgICAgICAgIFwibW9tZW50IGNvbnN0cnVjdGlvbiBmYWxscyBiYWNrIHRvIGpzIERhdGUuIFRoaXMgaXMgXCIgK1xuICAgICAgICAgICAgXCJkaXNjb3VyYWdlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHVwY29taW5nIG1ham9yIFwiICtcbiAgICAgICAgICAgIFwicmVsZWFzZS4gUGxlYXNlIHJlZmVyIHRvIFwiICtcbiAgICAgICAgICAgIFwiaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE0MDcgZm9yIG1vcmUgaW5mby5cIixcbiAgICAgICAgICAgIGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoY29uZmlnLl9pKTtcbiAgICB9KTtcblxuICAgIC8vIFBpY2sgYSBtb21lbnQgbSBmcm9tIG1vbWVudHMgc28gdGhhdCBtW2ZuXShvdGhlcikgaXMgdHJ1ZSBmb3IgYWxsXG4gICAgLy8gb3RoZXIuIFRoaXMgcmVsaWVzIG9uIHRoZSBmdW5jdGlvbiBmbiB0byBiZSB0cmFuc2l0aXZlLlxuICAgIC8vXG4gICAgLy8gbW9tZW50cyBzaG91bGQgZWl0aGVyIGJlIGFuIGFycmF5IG9mIG1vbWVudCBvYmplY3RzIG9yIGFuIGFycmF5LCB3aG9zZVxuICAgIC8vIGZpcnN0IGVsZW1lbnQgaXMgYW4gYXJyYXkgb2YgbW9tZW50IG9iamVjdHMuXG4gICAgZnVuY3Rpb24gcGlja0J5KGZuLCBtb21lbnRzKSB7XG4gICAgICAgIHZhciByZXMsIGk7XG4gICAgICAgIGlmIChtb21lbnRzLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KG1vbWVudHNbMF0pKSB7XG4gICAgICAgICAgICBtb21lbnRzID0gbW9tZW50c1swXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1vbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzID0gbW9tZW50c1swXTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IG1vbWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChtb21lbnRzW2ldW2ZuXShyZXMpKSB7XG4gICAgICAgICAgICAgICAgcmVzID0gbW9tZW50c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIG1vbWVudC5taW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgIHJldHVybiBwaWNrQnkoJ2lzQmVmb3JlJywgYXJncyk7XG4gICAgfTtcblxuICAgIG1vbWVudC5tYXggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgIHJldHVybiBwaWNrQnkoJ2lzQWZ0ZXInLCBhcmdzKTtcbiAgICB9O1xuXG4gICAgLy8gY3JlYXRpbmcgd2l0aCB1dGNcbiAgICBtb21lbnQudXRjID0gZnVuY3Rpb24gKGlucHV0LCBmb3JtYXQsIGxhbmcsIHN0cmljdCkge1xuICAgICAgICB2YXIgYztcblxuICAgICAgICBpZiAodHlwZW9mKGxhbmcpID09PSBcImJvb2xlYW5cIikge1xuICAgICAgICAgICAgc3RyaWN0ID0gbGFuZztcbiAgICAgICAgICAgIGxhbmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gb2JqZWN0IGNvbnN0cnVjdGlvbiBtdXN0IGJlIGRvbmUgdGhpcyB3YXkuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNDIzXG4gICAgICAgIGMgPSB7fTtcbiAgICAgICAgYy5faXNBTW9tZW50T2JqZWN0ID0gdHJ1ZTtcbiAgICAgICAgYy5fdXNlVVRDID0gdHJ1ZTtcbiAgICAgICAgYy5faXNVVEMgPSB0cnVlO1xuICAgICAgICBjLl9sID0gbGFuZztcbiAgICAgICAgYy5faSA9IGlucHV0O1xuICAgICAgICBjLl9mID0gZm9ybWF0O1xuICAgICAgICBjLl9zdHJpY3QgPSBzdHJpY3Q7XG4gICAgICAgIGMuX3BmID0gZGVmYXVsdFBhcnNpbmdGbGFncygpO1xuXG4gICAgICAgIHJldHVybiBtYWtlTW9tZW50KGMpLnV0YygpO1xuICAgIH07XG5cbiAgICAvLyBjcmVhdGluZyB3aXRoIHVuaXggdGltZXN0YW1wIChpbiBzZWNvbmRzKVxuICAgIG1vbWVudC51bml4ID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBtb21lbnQoaW5wdXQgKiAxMDAwKTtcbiAgICB9O1xuXG4gICAgLy8gZHVyYXRpb25cbiAgICBtb21lbnQuZHVyYXRpb24gPSBmdW5jdGlvbiAoaW5wdXQsIGtleSkge1xuICAgICAgICB2YXIgZHVyYXRpb24gPSBpbnB1dCxcbiAgICAgICAgICAgIC8vIG1hdGNoaW5nIGFnYWluc3QgcmVnZXhwIGlzIGV4cGVuc2l2ZSwgZG8gaXQgb24gZGVtYW5kXG4gICAgICAgICAgICBtYXRjaCA9IG51bGwsXG4gICAgICAgICAgICBzaWduLFxuICAgICAgICAgICAgcmV0LFxuICAgICAgICAgICAgcGFyc2VJc287XG5cbiAgICAgICAgaWYgKG1vbWVudC5pc0R1cmF0aW9uKGlucHV0KSkge1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgbXM6IGlucHV0Ll9taWxsaXNlY29uZHMsXG4gICAgICAgICAgICAgICAgZDogaW5wdXQuX2RheXMsXG4gICAgICAgICAgICAgICAgTTogaW5wdXQuX21vbnRoc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaW5wdXQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uW2tleV0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb24ubWlsbGlzZWNvbmRzID0gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoISEobWF0Y2ggPSBhc3BOZXRUaW1lU3Bhbkpzb25SZWdleC5leGVjKGlucHV0KSkpIHtcbiAgICAgICAgICAgIHNpZ24gPSAobWF0Y2hbMV0gPT09IFwiLVwiKSA/IC0xIDogMTtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIHk6IDAsXG4gICAgICAgICAgICAgICAgZDogdG9JbnQobWF0Y2hbREFURV0pICogc2lnbixcbiAgICAgICAgICAgICAgICBoOiB0b0ludChtYXRjaFtIT1VSXSkgKiBzaWduLFxuICAgICAgICAgICAgICAgIG06IHRvSW50KG1hdGNoW01JTlVURV0pICogc2lnbixcbiAgICAgICAgICAgICAgICBzOiB0b0ludChtYXRjaFtTRUNPTkRdKSAqIHNpZ24sXG4gICAgICAgICAgICAgICAgbXM6IHRvSW50KG1hdGNoW01JTExJU0VDT05EXSkgKiBzaWduXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKCEhKG1hdGNoID0gaXNvRHVyYXRpb25SZWdleC5leGVjKGlucHV0KSkpIHtcbiAgICAgICAgICAgIHNpZ24gPSAobWF0Y2hbMV0gPT09IFwiLVwiKSA/IC0xIDogMTtcbiAgICAgICAgICAgIHBhcnNlSXNvID0gZnVuY3Rpb24gKGlucCkge1xuICAgICAgICAgICAgICAgIC8vIFdlJ2Qgbm9ybWFsbHkgdXNlIH5+aW5wIGZvciB0aGlzLCBidXQgdW5mb3J0dW5hdGVseSBpdCBhbHNvXG4gICAgICAgICAgICAgICAgLy8gY29udmVydHMgZmxvYXRzIHRvIGludHMuXG4gICAgICAgICAgICAgICAgLy8gaW5wIG1heSBiZSB1bmRlZmluZWQsIHNvIGNhcmVmdWwgY2FsbGluZyByZXBsYWNlIG9uIGl0LlxuICAgICAgICAgICAgICAgIHZhciByZXMgPSBpbnAgJiYgcGFyc2VGbG9hdChpbnAucmVwbGFjZSgnLCcsICcuJykpO1xuICAgICAgICAgICAgICAgIC8vIGFwcGx5IHNpZ24gd2hpbGUgd2UncmUgYXQgaXRcbiAgICAgICAgICAgICAgICByZXR1cm4gKGlzTmFOKHJlcykgPyAwIDogcmVzKSAqIHNpZ247XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgeTogcGFyc2VJc28obWF0Y2hbMl0pLFxuICAgICAgICAgICAgICAgIE06IHBhcnNlSXNvKG1hdGNoWzNdKSxcbiAgICAgICAgICAgICAgICBkOiBwYXJzZUlzbyhtYXRjaFs0XSksXG4gICAgICAgICAgICAgICAgaDogcGFyc2VJc28obWF0Y2hbNV0pLFxuICAgICAgICAgICAgICAgIG06IHBhcnNlSXNvKG1hdGNoWzZdKSxcbiAgICAgICAgICAgICAgICBzOiBwYXJzZUlzbyhtYXRjaFs3XSksXG4gICAgICAgICAgICAgICAgdzogcGFyc2VJc28obWF0Y2hbOF0pXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0ID0gbmV3IER1cmF0aW9uKGR1cmF0aW9uKTtcblxuICAgICAgICBpZiAobW9tZW50LmlzRHVyYXRpb24oaW5wdXQpICYmIGlucHV0Lmhhc093blByb3BlcnR5KCdfbGFuZycpKSB7XG4gICAgICAgICAgICByZXQuX2xhbmcgPSBpbnB1dC5fbGFuZztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfTtcblxuICAgIC8vIHZlcnNpb24gbnVtYmVyXG4gICAgbW9tZW50LnZlcnNpb24gPSBWRVJTSU9OO1xuXG4gICAgLy8gZGVmYXVsdCBmb3JtYXRcbiAgICBtb21lbnQuZGVmYXVsdEZvcm1hdCA9IGlzb0Zvcm1hdDtcblxuICAgIC8vIGNvbnN0YW50IHRoYXQgcmVmZXJzIHRvIHRoZSBJU08gc3RhbmRhcmRcbiAgICBtb21lbnQuSVNPXzg2MDEgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIC8vIFBsdWdpbnMgdGhhdCBhZGQgcHJvcGVydGllcyBzaG91bGQgYWxzbyBhZGQgdGhlIGtleSBoZXJlIChudWxsIHZhbHVlKSxcbiAgICAvLyBzbyB3ZSBjYW4gcHJvcGVybHkgY2xvbmUgb3Vyc2VsdmVzLlxuICAgIG1vbWVudC5tb21lbnRQcm9wZXJ0aWVzID0gbW9tZW50UHJvcGVydGllcztcblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2hlbmV2ZXIgYSBtb21lbnQgaXMgbXV0YXRlZC5cbiAgICAvLyBJdCBpcyBpbnRlbmRlZCB0byBrZWVwIHRoZSBvZmZzZXQgaW4gc3luYyB3aXRoIHRoZSB0aW1lem9uZS5cbiAgICBtb21lbnQudXBkYXRlT2Zmc2V0ID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGFsbG93cyB5b3UgdG8gc2V0IGEgdGhyZXNob2xkIGZvciByZWxhdGl2ZSB0aW1lIHN0cmluZ3NcbiAgICBtb21lbnQucmVsYXRpdmVUaW1lVGhyZXNob2xkID0gZnVuY3Rpb24odGhyZXNob2xkLCBsaW1pdCkge1xuICAgICAgaWYgKHJlbGF0aXZlVGltZVRocmVzaG9sZHNbdGhyZXNob2xkXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJlbGF0aXZlVGltZVRocmVzaG9sZHNbdGhyZXNob2xkXSA9IGxpbWl0O1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gd2lsbCBsb2FkIGxhbmd1YWdlcyBhbmQgdGhlbiBzZXQgdGhlIGdsb2JhbCBsYW5ndWFnZS4gIElmXG4gICAgLy8gbm8gYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4sIGl0IHdpbGwgc2ltcGx5IHJldHVybiB0aGUgY3VycmVudCBnbG9iYWxcbiAgICAvLyBsYW5ndWFnZSBrZXkuXG4gICAgbW9tZW50LmxhbmcgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZXMpIHtcbiAgICAgICAgdmFyIHI7XG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50LmZuLl9sYW5nLl9hYmJyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgICAgIGxvYWRMYW5nKG5vcm1hbGl6ZUxhbmd1YWdlKGtleSksIHZhbHVlcyk7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWVzID09PSBudWxsKSB7XG4gICAgICAgICAgICB1bmxvYWRMYW5nKGtleSk7XG4gICAgICAgICAgICBrZXkgPSAnZW4nO1xuICAgICAgICB9IGVsc2UgaWYgKCFsYW5ndWFnZXNba2V5XSkge1xuICAgICAgICAgICAgZ2V0TGFuZ0RlZmluaXRpb24oa2V5KTtcbiAgICAgICAgfVxuICAgICAgICByID0gbW9tZW50LmR1cmF0aW9uLmZuLl9sYW5nID0gbW9tZW50LmZuLl9sYW5nID0gZ2V0TGFuZ0RlZmluaXRpb24oa2V5KTtcbiAgICAgICAgcmV0dXJuIHIuX2FiYnI7XG4gICAgfTtcblxuICAgIC8vIHJldHVybnMgbGFuZ3VhZ2UgZGF0YVxuICAgIG1vbWVudC5sYW5nRGF0YSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgaWYgKGtleSAmJiBrZXkuX2xhbmcgJiYga2V5Ll9sYW5nLl9hYmJyKSB7XG4gICAgICAgICAgICBrZXkgPSBrZXkuX2xhbmcuX2FiYnI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdldExhbmdEZWZpbml0aW9uKGtleSk7XG4gICAgfTtcblxuICAgIC8vIGNvbXBhcmUgbW9tZW50IG9iamVjdFxuICAgIG1vbWVudC5pc01vbWVudCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIE1vbWVudCB8fFxuICAgICAgICAgICAgKG9iaiAhPSBudWxsICYmICBvYmouaGFzT3duUHJvcGVydHkoJ19pc0FNb21lbnRPYmplY3QnKSk7XG4gICAgfTtcblxuICAgIC8vIGZvciB0eXBlY2hlY2tpbmcgRHVyYXRpb24gb2JqZWN0c1xuICAgIG1vbWVudC5pc0R1cmF0aW9uID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRHVyYXRpb247XG4gICAgfTtcblxuICAgIGZvciAoaSA9IGxpc3RzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIG1ha2VMaXN0KGxpc3RzW2ldKTtcbiAgICB9XG5cbiAgICBtb21lbnQubm9ybWFsaXplVW5pdHMgPSBmdW5jdGlvbiAodW5pdHMpIHtcbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICB9O1xuXG4gICAgbW9tZW50LmludmFsaWQgPSBmdW5jdGlvbiAoZmxhZ3MpIHtcbiAgICAgICAgdmFyIG0gPSBtb21lbnQudXRjKE5hTik7XG4gICAgICAgIGlmIChmbGFncyAhPSBudWxsKSB7XG4gICAgICAgICAgICBleHRlbmQobS5fcGYsIGZsYWdzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG0uX3BmLnVzZXJJbnZhbGlkYXRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9O1xuXG4gICAgbW9tZW50LnBhcnNlWm9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG1vbWVudC5hcHBseShudWxsLCBhcmd1bWVudHMpLnBhcnNlWm9uZSgpO1xuICAgIH07XG5cbiAgICBtb21lbnQucGFyc2VUd29EaWdpdFllYXIgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIHRvSW50KGlucHV0KSArICh0b0ludChpbnB1dCkgPiA2OCA/IDE5MDAgOiAyMDAwKTtcbiAgICB9O1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBNb21lbnQgUHJvdG90eXBlXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICBleHRlbmQobW9tZW50LmZuID0gTW9tZW50LnByb3RvdHlwZSwge1xuXG4gICAgICAgIGNsb25lIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudCh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICB2YWx1ZU9mIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzLl9kICsgKCh0aGlzLl9vZmZzZXQgfHwgMCkgKiA2MDAwMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW5peCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCt0aGlzIC8gMTAwMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9TdHJpbmcgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxhbmcoJ2VuJykuZm9ybWF0KFwiZGRkIE1NTSBERCBZWVlZIEhIOm1tOnNzIFtHTVRdWlpcIik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9EYXRlIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29mZnNldCA/IG5ldyBEYXRlKCt0aGlzKSA6IHRoaXMuX2Q7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9JU09TdHJpbmcgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbSA9IG1vbWVudCh0aGlzKS51dGMoKTtcbiAgICAgICAgICAgIGlmICgwIDwgbS55ZWFyKCkgJiYgbS55ZWFyKCkgPD0gOTk5OSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRNb21lbnQobSwgJ1lZWVktTU0tRERbVF1ISDptbTpzcy5TU1NbWl0nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdE1vbWVudChtLCAnWVlZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9BcnJheSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgbS55ZWFyKCksXG4gICAgICAgICAgICAgICAgbS5tb250aCgpLFxuICAgICAgICAgICAgICAgIG0uZGF0ZSgpLFxuICAgICAgICAgICAgICAgIG0uaG91cnMoKSxcbiAgICAgICAgICAgICAgICBtLm1pbnV0ZXMoKSxcbiAgICAgICAgICAgICAgICBtLnNlY29uZHMoKSxcbiAgICAgICAgICAgICAgICBtLm1pbGxpc2Vjb25kcygpXG4gICAgICAgICAgICBdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzVmFsaWQgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNWYWxpZCh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0RTVFNoaWZ0ZWQgOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9hKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNWYWxpZCgpICYmIGNvbXBhcmVBcnJheXModGhpcy5fYSwgKHRoaXMuX2lzVVRDID8gbW9tZW50LnV0Yyh0aGlzLl9hKSA6IG1vbWVudCh0aGlzLl9hKSkudG9BcnJheSgpKSA+IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzaW5nRmxhZ3MgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZXh0ZW5kKHt9LCB0aGlzLl9wZik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW52YWxpZEF0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGYub3ZlcmZsb3c7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdXRjIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuem9uZSgwKTtcbiAgICAgICAgfSxcblxuICAgICAgICBsb2NhbCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuem9uZSgwKTtcbiAgICAgICAgICAgIHRoaXMuX2lzVVRDID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBmb3JtYXQgOiBmdW5jdGlvbiAoaW5wdXRTdHJpbmcpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBmb3JtYXRNb21lbnQodGhpcywgaW5wdXRTdHJpbmcgfHwgbW9tZW50LmRlZmF1bHRGb3JtYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZygpLnBvc3Rmb3JtYXQob3V0cHV0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBhZGQgOiBmdW5jdGlvbiAoaW5wdXQsIHZhbCkge1xuICAgICAgICAgICAgdmFyIGR1cjtcbiAgICAgICAgICAgIC8vIHN3aXRjaCBhcmdzIHRvIHN1cHBvcnQgYWRkKCdzJywgMSkgYW5kIGFkZCgxLCAncycpXG4gICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGR1ciA9IG1vbWVudC5kdXJhdGlvbihpc05hTigrdmFsKSA/ICtpbnB1dCA6ICt2YWwsIGlzTmFOKCt2YWwpID8gdmFsIDogaW5wdXQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgZHVyID0gbW9tZW50LmR1cmF0aW9uKCt2YWwsIGlucHV0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHVyID0gbW9tZW50LmR1cmF0aW9uKGlucHV0LCB2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYWRkT3JTdWJ0cmFjdER1cmF0aW9uRnJvbU1vbWVudCh0aGlzLCBkdXIsIDEpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3VidHJhY3QgOiBmdW5jdGlvbiAoaW5wdXQsIHZhbCkge1xuICAgICAgICAgICAgdmFyIGR1cjtcbiAgICAgICAgICAgIC8vIHN3aXRjaCBhcmdzIHRvIHN1cHBvcnQgc3VidHJhY3QoJ3MnLCAxKSBhbmQgc3VidHJhY3QoMSwgJ3MnKVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBkdXIgPSBtb21lbnQuZHVyYXRpb24oaXNOYU4oK3ZhbCkgPyAraW5wdXQgOiArdmFsLCBpc05hTigrdmFsKSA/IHZhbCA6IGlucHV0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGR1ciA9IG1vbWVudC5kdXJhdGlvbigrdmFsLCBpbnB1dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGR1ciA9IG1vbWVudC5kdXJhdGlvbihpbnB1dCwgdmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZE9yU3VidHJhY3REdXJhdGlvbkZyb21Nb21lbnQodGhpcywgZHVyLCAtMSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBkaWZmIDogZnVuY3Rpb24gKGlucHV0LCB1bml0cywgYXNGbG9hdCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSBtYWtlQXMoaW5wdXQsIHRoaXMpLFxuICAgICAgICAgICAgICAgIHpvbmVEaWZmID0gKHRoaXMuem9uZSgpIC0gdGhhdC56b25lKCkpICogNmU0LFxuICAgICAgICAgICAgICAgIGRpZmYsIG91dHB1dDtcblxuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG5cbiAgICAgICAgICAgIGlmICh1bml0cyA9PT0gJ3llYXInIHx8IHVuaXRzID09PSAnbW9udGgnKSB7XG4gICAgICAgICAgICAgICAgLy8gYXZlcmFnZSBudW1iZXIgb2YgZGF5cyBpbiB0aGUgbW9udGhzIGluIHRoZSBnaXZlbiBkYXRlc1xuICAgICAgICAgICAgICAgIGRpZmYgPSAodGhpcy5kYXlzSW5Nb250aCgpICsgdGhhdC5kYXlzSW5Nb250aCgpKSAqIDQzMmU1OyAvLyAyNCAqIDYwICogNjAgKiAxMDAwIC8gMlxuICAgICAgICAgICAgICAgIC8vIGRpZmZlcmVuY2UgaW4gbW9udGhzXG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gKCh0aGlzLnllYXIoKSAtIHRoYXQueWVhcigpKSAqIDEyKSArICh0aGlzLm1vbnRoKCkgLSB0aGF0Lm1vbnRoKCkpO1xuICAgICAgICAgICAgICAgIC8vIGFkanVzdCBieSB0YWtpbmcgZGlmZmVyZW5jZSBpbiBkYXlzLCBhdmVyYWdlIG51bWJlciBvZiBkYXlzXG4gICAgICAgICAgICAgICAgLy8gYW5kIGRzdCBpbiB0aGUgZ2l2ZW4gbW9udGhzLlxuICAgICAgICAgICAgICAgIG91dHB1dCArPSAoKHRoaXMgLSBtb21lbnQodGhpcykuc3RhcnRPZignbW9udGgnKSkgLVxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoYXQgLSBtb21lbnQodGhhdCkuc3RhcnRPZignbW9udGgnKSkpIC8gZGlmZjtcbiAgICAgICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aXRoIHpvbmVzLCB0byBuZWdhdGUgYWxsIGRzdFxuICAgICAgICAgICAgICAgIG91dHB1dCAtPSAoKHRoaXMuem9uZSgpIC0gbW9tZW50KHRoaXMpLnN0YXJ0T2YoJ21vbnRoJykuem9uZSgpKSAtXG4gICAgICAgICAgICAgICAgICAgICAgICAodGhhdC56b25lKCkgLSBtb21lbnQodGhhdCkuc3RhcnRPZignbW9udGgnKS56b25lKCkpKSAqIDZlNCAvIGRpZmY7XG4gICAgICAgICAgICAgICAgaWYgKHVuaXRzID09PSAneWVhcicpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0IC8gMTI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkaWZmID0gKHRoaXMgLSB0aGF0KTtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSB1bml0cyA9PT0gJ3NlY29uZCcgPyBkaWZmIC8gMWUzIDogLy8gMTAwMFxuICAgICAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ21pbnV0ZScgPyBkaWZmIC8gNmU0IDogLy8gMTAwMCAqIDYwXG4gICAgICAgICAgICAgICAgICAgIHVuaXRzID09PSAnaG91cicgPyBkaWZmIC8gMzZlNSA6IC8vIDEwMDAgKiA2MCAqIDYwXG4gICAgICAgICAgICAgICAgICAgIHVuaXRzID09PSAnZGF5JyA/IChkaWZmIC0gem9uZURpZmYpIC8gODY0ZTUgOiAvLyAxMDAwICogNjAgKiA2MCAqIDI0LCBuZWdhdGUgZHN0XG4gICAgICAgICAgICAgICAgICAgIHVuaXRzID09PSAnd2VlaycgPyAoZGlmZiAtIHpvbmVEaWZmKSAvIDYwNDhlNSA6IC8vIDEwMDAgKiA2MCAqIDYwICogMjQgKiA3LCBuZWdhdGUgZHN0XG4gICAgICAgICAgICAgICAgICAgIGRpZmY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXNGbG9hdCA/IG91dHB1dCA6IGFic1JvdW5kKG91dHB1dCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZnJvbSA6IGZ1bmN0aW9uICh0aW1lLCB3aXRob3V0U3VmZml4KSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50LmR1cmF0aW9uKHRoaXMuZGlmZih0aW1lKSkubGFuZyh0aGlzLmxhbmcoKS5fYWJicikuaHVtYW5pemUoIXdpdGhvdXRTdWZmaXgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZyb21Ob3cgOiBmdW5jdGlvbiAod2l0aG91dFN1ZmZpeCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZnJvbShtb21lbnQoKSwgd2l0aG91dFN1ZmZpeCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2FsZW5kYXIgOiBmdW5jdGlvbiAodGltZSkge1xuICAgICAgICAgICAgLy8gV2Ugd2FudCB0byBjb21wYXJlIHRoZSBzdGFydCBvZiB0b2RheSwgdnMgdGhpcy5cbiAgICAgICAgICAgIC8vIEdldHRpbmcgc3RhcnQtb2YtdG9kYXkgZGVwZW5kcyBvbiB3aGV0aGVyIHdlJ3JlIHpvbmUnZCBvciBub3QuXG4gICAgICAgICAgICB2YXIgbm93ID0gdGltZSB8fCBtb21lbnQoKSxcbiAgICAgICAgICAgICAgICBzb2QgPSBtYWtlQXMobm93LCB0aGlzKS5zdGFydE9mKCdkYXknKSxcbiAgICAgICAgICAgICAgICBkaWZmID0gdGhpcy5kaWZmKHNvZCwgJ2RheXMnLCB0cnVlKSxcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSBkaWZmIDwgLTYgPyAnc2FtZUVsc2UnIDpcbiAgICAgICAgICAgICAgICAgICAgZGlmZiA8IC0xID8gJ2xhc3RXZWVrJyA6XG4gICAgICAgICAgICAgICAgICAgIGRpZmYgPCAwID8gJ2xhc3REYXknIDpcbiAgICAgICAgICAgICAgICAgICAgZGlmZiA8IDEgPyAnc2FtZURheScgOlxuICAgICAgICAgICAgICAgICAgICBkaWZmIDwgMiA/ICduZXh0RGF5JyA6XG4gICAgICAgICAgICAgICAgICAgIGRpZmYgPCA3ID8gJ25leHRXZWVrJyA6ICdzYW1lRWxzZSc7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mb3JtYXQodGhpcy5sYW5nKCkuY2FsZW5kYXIoZm9ybWF0LCB0aGlzKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNMZWFwWWVhciA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBpc0xlYXBZZWFyKHRoaXMueWVhcigpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0RTVCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy56b25lKCkgPCB0aGlzLmNsb25lKCkubW9udGgoMCkuem9uZSgpIHx8XG4gICAgICAgICAgICAgICAgdGhpcy56b25lKCkgPCB0aGlzLmNsb25lKCkubW9udGgoNSkuem9uZSgpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkYXkgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciBkYXkgPSB0aGlzLl9pc1VUQyA/IHRoaXMuX2QuZ2V0VVRDRGF5KCkgOiB0aGlzLl9kLmdldERheSgpO1xuICAgICAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IHBhcnNlV2Vla2RheShpbnB1dCwgdGhpcy5sYW5nKCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFkZCh7IGQgOiBpbnB1dCAtIGRheSB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRheTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBtb250aCA6IG1ha2VBY2Nlc3NvcignTW9udGgnLCB0cnVlKSxcblxuICAgICAgICBzdGFydE9mOiBmdW5jdGlvbiAodW5pdHMpIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgLy8gdGhlIGZvbGxvd2luZyBzd2l0Y2ggaW50ZW50aW9uYWxseSBvbWl0cyBicmVhayBrZXl3b3Jkc1xuICAgICAgICAgICAgLy8gdG8gdXRpbGl6ZSBmYWxsaW5nIHRocm91Z2ggdGhlIGNhc2VzLlxuICAgICAgICAgICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICAgICAgY2FzZSAneWVhcic6XG4gICAgICAgICAgICAgICAgdGhpcy5tb250aCgwKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICdxdWFydGVyJzpcbiAgICAgICAgICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGUoMSk7XG4gICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgY2FzZSAnd2Vlayc6XG4gICAgICAgICAgICBjYXNlICdpc29XZWVrJzpcbiAgICAgICAgICAgIGNhc2UgJ2RheSc6XG4gICAgICAgICAgICAgICAgdGhpcy5ob3VycygwKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICdob3VyJzpcbiAgICAgICAgICAgICAgICB0aGlzLm1pbnV0ZXMoMCk7XG4gICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgY2FzZSAnbWludXRlJzpcbiAgICAgICAgICAgICAgICB0aGlzLnNlY29uZHMoMCk7XG4gICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgY2FzZSAnc2Vjb25kJzpcbiAgICAgICAgICAgICAgICB0aGlzLm1pbGxpc2Vjb25kcygwKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHdlZWtzIGFyZSBhIHNwZWNpYWwgY2FzZVxuICAgICAgICAgICAgaWYgKHVuaXRzID09PSAnd2VlaycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndlZWtkYXkoMCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHVuaXRzID09PSAnaXNvV2VlaycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzb1dlZWtkYXkoMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHF1YXJ0ZXJzIGFyZSBhbHNvIHNwZWNpYWxcbiAgICAgICAgICAgIGlmICh1bml0cyA9PT0gJ3F1YXJ0ZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb250aChNYXRoLmZsb29yKHRoaXMubW9udGgoKSAvIDMpICogMyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGVuZE9mOiBmdW5jdGlvbiAodW5pdHMpIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnRPZih1bml0cykuYWRkKCh1bml0cyA9PT0gJ2lzb1dlZWsnID8gJ3dlZWsnIDogdW5pdHMpLCAxKS5zdWJ0cmFjdCgnbXMnLCAxKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0FmdGVyOiBmdW5jdGlvbiAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0cyA9IHR5cGVvZiB1bml0cyAhPT0gJ3VuZGVmaW5lZCcgPyB1bml0cyA6ICdtaWxsaXNlY29uZCc7XG4gICAgICAgICAgICByZXR1cm4gK3RoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKSA+ICttb21lbnQoaW5wdXQpLnN0YXJ0T2YodW5pdHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzQmVmb3JlOiBmdW5jdGlvbiAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0cyA9IHR5cGVvZiB1bml0cyAhPT0gJ3VuZGVmaW5lZCcgPyB1bml0cyA6ICdtaWxsaXNlY29uZCc7XG4gICAgICAgICAgICByZXR1cm4gK3RoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKSA8ICttb21lbnQoaW5wdXQpLnN0YXJ0T2YodW5pdHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzU2FtZTogZnVuY3Rpb24gKGlucHV0LCB1bml0cykge1xuICAgICAgICAgICAgdW5pdHMgPSB1bml0cyB8fCAnbXMnO1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzLmNsb25lKCkuc3RhcnRPZih1bml0cykgPT09ICttYWtlQXMoaW5wdXQsIHRoaXMpLnN0YXJ0T2YodW5pdHMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIG1pbjogZGVwcmVjYXRlKFxuICAgICAgICAgICAgICAgICBcIm1vbWVudCgpLm1pbiBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50Lm1pbiBpbnN0ZWFkLiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTU0OFwiLFxuICAgICAgICAgICAgICAgICBmdW5jdGlvbiAob3RoZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgIG90aGVyID0gbW9tZW50LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3RoZXIgPCB0aGlzID8gdGhpcyA6IG90aGVyO1xuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICApLFxuXG4gICAgICAgIG1heDogZGVwcmVjYXRlKFxuICAgICAgICAgICAgICAgIFwibW9tZW50KCkubWF4IGlzIGRlcHJlY2F0ZWQsIHVzZSBtb21lbnQubWF4IGluc3RlYWQuIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNTQ4XCIsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKG90aGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIG90aGVyID0gbW9tZW50LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvdGhlciA+IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICApLFxuXG4gICAgICAgIC8vIGtlZXBUaW1lID0gdHJ1ZSBtZWFucyBvbmx5IGNoYW5nZSB0aGUgdGltZXpvbmUsIHdpdGhvdXQgYWZmZWN0aW5nXG4gICAgICAgIC8vIHRoZSBsb2NhbCBob3VyLiBTbyA1OjMxOjI2ICswMzAwIC0tW3pvbmUoMiwgdHJ1ZSldLS0+IDU6MzE6MjYgKzAyMDBcbiAgICAgICAgLy8gSXQgaXMgcG9zc2libGUgdGhhdCA1OjMxOjI2IGRvZXNuJ3QgZXhpc3QgaW50IHpvbmUgKzAyMDAsIHNvIHdlXG4gICAgICAgIC8vIGFkanVzdCB0aGUgdGltZSBhcyBuZWVkZWQsIHRvIGJlIHZhbGlkLlxuICAgICAgICAvL1xuICAgICAgICAvLyBLZWVwaW5nIHRoZSB0aW1lIGFjdHVhbGx5IGFkZHMvc3VidHJhY3RzIChvbmUgaG91cilcbiAgICAgICAgLy8gZnJvbSB0aGUgYWN0dWFsIHJlcHJlc2VudGVkIHRpbWUuIFRoYXQgaXMgd2h5IHdlIGNhbGwgdXBkYXRlT2Zmc2V0XG4gICAgICAgIC8vIGEgc2Vjb25kIHRpbWUuIEluIGNhc2UgaXQgd2FudHMgdXMgdG8gY2hhbmdlIHRoZSBvZmZzZXQgYWdhaW5cbiAgICAgICAgLy8gX2NoYW5nZUluUHJvZ3Jlc3MgPT0gdHJ1ZSBjYXNlLCB0aGVuIHdlIGhhdmUgdG8gYWRqdXN0LCBiZWNhdXNlXG4gICAgICAgIC8vIHRoZXJlIGlzIG5vIHN1Y2ggdGltZSBpbiB0aGUgZ2l2ZW4gdGltZXpvbmUuXG4gICAgICAgIHpvbmUgOiBmdW5jdGlvbiAoaW5wdXQsIGtlZXBUaW1lKSB7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy5fb2Zmc2V0IHx8IDA7XG4gICAgICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSB0aW1lem9uZU1pbnV0ZXNGcm9tU3RyaW5nKGlucHV0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGlucHV0KSA8IDE2KSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQgKiA2MDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fb2Zmc2V0ID0gaW5wdXQ7XG4gICAgICAgICAgICAgICAgdGhpcy5faXNVVEMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChvZmZzZXQgIT09IGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgha2VlcFRpbWUgfHwgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkT3JTdWJ0cmFjdER1cmF0aW9uRnJvbU1vbWVudCh0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb21lbnQuZHVyYXRpb24ob2Zmc2V0IC0gaW5wdXQsICdtJyksIDEsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb21lbnQudXBkYXRlT2Zmc2V0KHRoaXMsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/IG9mZnNldCA6IHRoaXMuX2QuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHpvbmVBYmJyIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gXCJVVENcIiA6IFwiXCI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgem9uZU5hbWUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyBcIkNvb3JkaW5hdGVkIFVuaXZlcnNhbCBUaW1lXCIgOiBcIlwiO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlWm9uZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl90em0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnpvbmUodGhpcy5fdHptKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuX2kgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy56b25lKHRoaXMuX2kpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGFzQWxpZ25lZEhvdXJPZmZzZXQgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IG1vbWVudChpbnB1dCkuem9uZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuem9uZSgpIC0gaW5wdXQpICUgNjAgPT09IDA7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGF5c0luTW9udGggOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF5c0luTW9udGgodGhpcy55ZWFyKCksIHRoaXMubW9udGgoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGF5T2ZZZWFyIDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgZGF5T2ZZZWFyID0gcm91bmQoKG1vbWVudCh0aGlzKS5zdGFydE9mKCdkYXknKSAtIG1vbWVudCh0aGlzKS5zdGFydE9mKCd5ZWFyJykpIC8gODY0ZTUpICsgMTtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gZGF5T2ZZZWFyIDogdGhpcy5hZGQoXCJkXCIsIChpbnB1dCAtIGRheU9mWWVhcikpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHF1YXJ0ZXIgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gTWF0aC5jZWlsKCh0aGlzLm1vbnRoKCkgKyAxKSAvIDMpIDogdGhpcy5tb250aCgoaW5wdXQgLSAxKSAqIDMgKyB0aGlzLm1vbnRoKCkgJSAzKTtcbiAgICAgICAgfSxcblxuICAgICAgICB3ZWVrWWVhciA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICAgICAgdmFyIHllYXIgPSB3ZWVrT2ZZZWFyKHRoaXMsIHRoaXMubGFuZygpLl93ZWVrLmRvdywgdGhpcy5sYW5nKCkuX3dlZWsuZG95KS55ZWFyO1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB5ZWFyIDogdGhpcy5hZGQoXCJ5XCIsIChpbnB1dCAtIHllYXIpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc29XZWVrWWVhciA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICAgICAgdmFyIHllYXIgPSB3ZWVrT2ZZZWFyKHRoaXMsIDEsIDQpLnllYXI7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHllYXIgOiB0aGlzLmFkZChcInlcIiwgKGlucHV0IC0geWVhcikpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdlZWsgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB3ZWVrID0gdGhpcy5sYW5nKCkud2Vlayh0aGlzKTtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2VlayA6IHRoaXMuYWRkKFwiZFwiLCAoaW5wdXQgLSB3ZWVrKSAqIDcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzb1dlZWsgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB3ZWVrID0gd2Vla09mWWVhcih0aGlzLCAxLCA0KS53ZWVrO1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrIDogdGhpcy5hZGQoXCJkXCIsIChpbnB1dCAtIHdlZWspICogNyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2Vla2RheSA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICAgICAgdmFyIHdlZWtkYXkgPSAodGhpcy5kYXkoKSArIDcgLSB0aGlzLmxhbmcoKS5fd2Vlay5kb3cpICUgNztcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2Vla2RheSA6IHRoaXMuYWRkKFwiZFwiLCBpbnB1dCAtIHdlZWtkYXkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzb1dlZWtkYXkgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIC8vIGJlaGF2ZXMgdGhlIHNhbWUgYXMgbW9tZW50I2RheSBleGNlcHRcbiAgICAgICAgICAgIC8vIGFzIGEgZ2V0dGVyLCByZXR1cm5zIDcgaW5zdGVhZCBvZiAwICgxLTcgcmFuZ2UgaW5zdGVhZCBvZiAwLTYpXG4gICAgICAgICAgICAvLyBhcyBhIHNldHRlciwgc3VuZGF5IHNob3VsZCBiZWxvbmcgdG8gdGhlIHByZXZpb3VzIHdlZWsuXG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHRoaXMuZGF5KCkgfHwgNyA6IHRoaXMuZGF5KHRoaXMuZGF5KCkgJSA3ID8gaW5wdXQgOiBpbnB1dCAtIDcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzb1dlZWtzSW5ZZWFyIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMueWVhcigpLCAxLCA0KTtcbiAgICAgICAgfSxcblxuICAgICAgICB3ZWVrc0luWWVhciA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB3ZWVrSW5mbyA9IHRoaXMuX2xhbmcuX3dlZWs7XG4gICAgICAgICAgICByZXR1cm4gd2Vla3NJblllYXIodGhpcy55ZWFyKCksIHdlZWtJbmZvLmRvdywgd2Vla0luZm8uZG95KTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXQgOiBmdW5jdGlvbiAodW5pdHMpIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbdW5pdHNdKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0IDogZnVuY3Rpb24gKHVuaXRzLCB2YWx1ZSkge1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXNbdW5pdHNdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhpc1t1bml0c10odmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gSWYgcGFzc2VkIGEgbGFuZ3VhZ2Uga2V5LCBpdCB3aWxsIHNldCB0aGUgbGFuZ3VhZ2UgZm9yIHRoaXNcbiAgICAgICAgLy8gaW5zdGFuY2UuICBPdGhlcndpc2UsIGl0IHdpbGwgcmV0dXJuIHRoZSBsYW5ndWFnZSBjb25maWd1cmF0aW9uXG4gICAgICAgIC8vIHZhcmlhYmxlcyBmb3IgdGhpcyBpbnN0YW5jZS5cbiAgICAgICAgbGFuZyA6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9sYW5nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9sYW5nID0gZ2V0TGFuZ0RlZmluaXRpb24oa2V5KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gcmF3TW9udGhTZXR0ZXIobW9tLCB2YWx1ZSkge1xuICAgICAgICB2YXIgZGF5T2ZNb250aDtcblxuICAgICAgICAvLyBUT0RPOiBNb3ZlIHRoaXMgb3V0IG9mIGhlcmUhXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG1vbS5sYW5nKCkubW9udGhzUGFyc2UodmFsdWUpO1xuICAgICAgICAgICAgLy8gVE9ETzogQW5vdGhlciBzaWxlbnQgZmFpbHVyZT9cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGRheU9mTW9udGggPSBNYXRoLm1pbihtb20uZGF0ZSgpLFxuICAgICAgICAgICAgICAgIGRheXNJbk1vbnRoKG1vbS55ZWFyKCksIHZhbHVlKSk7XG4gICAgICAgIG1vbS5fZFsnc2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyAnTW9udGgnXSh2YWx1ZSwgZGF5T2ZNb250aCk7XG4gICAgICAgIHJldHVybiBtb207XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmF3R2V0dGVyKG1vbSwgdW5pdCkge1xuICAgICAgICByZXR1cm4gbW9tLl9kWydnZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArIHVuaXRdKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmF3U2V0dGVyKG1vbSwgdW5pdCwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHVuaXQgPT09ICdNb250aCcpIHtcbiAgICAgICAgICAgIHJldHVybiByYXdNb250aFNldHRlcihtb20sIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgdW5pdF0odmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUFjY2Vzc29yKHVuaXQsIGtlZXBUaW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmF3U2V0dGVyKHRoaXMsIHVuaXQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBtb21lbnQudXBkYXRlT2Zmc2V0KHRoaXMsIGtlZXBUaW1lKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJhd0dldHRlcih0aGlzLCB1bml0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBtb21lbnQuZm4ubWlsbGlzZWNvbmQgPSBtb21lbnQuZm4ubWlsbGlzZWNvbmRzID0gbWFrZUFjY2Vzc29yKCdNaWxsaXNlY29uZHMnLCBmYWxzZSk7XG4gICAgbW9tZW50LmZuLnNlY29uZCA9IG1vbWVudC5mbi5zZWNvbmRzID0gbWFrZUFjY2Vzc29yKCdTZWNvbmRzJywgZmFsc2UpO1xuICAgIG1vbWVudC5mbi5taW51dGUgPSBtb21lbnQuZm4ubWludXRlcyA9IG1ha2VBY2Nlc3NvcignTWludXRlcycsIGZhbHNlKTtcbiAgICAvLyBTZXR0aW5nIHRoZSBob3VyIHNob3VsZCBrZWVwIHRoZSB0aW1lLCBiZWNhdXNlIHRoZSB1c2VyIGV4cGxpY2l0bHlcbiAgICAvLyBzcGVjaWZpZWQgd2hpY2ggaG91ciBoZSB3YW50cy4gU28gdHJ5aW5nIHRvIG1haW50YWluIHRoZSBzYW1lIGhvdXIgKGluXG4gICAgLy8gYSBuZXcgdGltZXpvbmUpIG1ha2VzIHNlbnNlLiBBZGRpbmcvc3VidHJhY3RpbmcgaG91cnMgZG9lcyBub3QgZm9sbG93XG4gICAgLy8gdGhpcyBydWxlLlxuICAgIG1vbWVudC5mbi5ob3VyID0gbW9tZW50LmZuLmhvdXJzID0gbWFrZUFjY2Vzc29yKCdIb3VycycsIHRydWUpO1xuICAgIC8vIG1vbWVudC5mbi5tb250aCBpcyBkZWZpbmVkIHNlcGFyYXRlbHlcbiAgICBtb21lbnQuZm4uZGF0ZSA9IG1ha2VBY2Nlc3NvcignRGF0ZScsIHRydWUpO1xuICAgIG1vbWVudC5mbi5kYXRlcyA9IGRlcHJlY2F0ZShcImRhdGVzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSBkYXRlIGluc3RlYWQuXCIsIG1ha2VBY2Nlc3NvcignRGF0ZScsIHRydWUpKTtcbiAgICBtb21lbnQuZm4ueWVhciA9IG1ha2VBY2Nlc3NvcignRnVsbFllYXInLCB0cnVlKTtcbiAgICBtb21lbnQuZm4ueWVhcnMgPSBkZXByZWNhdGUoXCJ5ZWFycyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgeWVhciBpbnN0ZWFkLlwiLCBtYWtlQWNjZXNzb3IoJ0Z1bGxZZWFyJywgdHJ1ZSkpO1xuXG4gICAgLy8gYWRkIHBsdXJhbCBtZXRob2RzXG4gICAgbW9tZW50LmZuLmRheXMgPSBtb21lbnQuZm4uZGF5O1xuICAgIG1vbWVudC5mbi5tb250aHMgPSBtb21lbnQuZm4ubW9udGg7XG4gICAgbW9tZW50LmZuLndlZWtzID0gbW9tZW50LmZuLndlZWs7XG4gICAgbW9tZW50LmZuLmlzb1dlZWtzID0gbW9tZW50LmZuLmlzb1dlZWs7XG4gICAgbW9tZW50LmZuLnF1YXJ0ZXJzID0gbW9tZW50LmZuLnF1YXJ0ZXI7XG5cbiAgICAvLyBhZGQgYWxpYXNlZCBmb3JtYXQgbWV0aG9kc1xuICAgIG1vbWVudC5mbi50b0pTT04gPSBtb21lbnQuZm4udG9JU09TdHJpbmc7XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIER1cmF0aW9uIFByb3RvdHlwZVxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgZXh0ZW5kKG1vbWVudC5kdXJhdGlvbi5mbiA9IER1cmF0aW9uLnByb3RvdHlwZSwge1xuXG4gICAgICAgIF9idWJibGUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgICAgIGRheXMgPSB0aGlzLl9kYXlzLFxuICAgICAgICAgICAgICAgIG1vbnRocyA9IHRoaXMuX21vbnRocyxcbiAgICAgICAgICAgICAgICBkYXRhID0gdGhpcy5fZGF0YSxcbiAgICAgICAgICAgICAgICBzZWNvbmRzLCBtaW51dGVzLCBob3VycywgeWVhcnM7XG5cbiAgICAgICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgY29kZSBidWJibGVzIHVwIHZhbHVlcywgc2VlIHRoZSB0ZXN0cyBmb3JcbiAgICAgICAgICAgIC8vIGV4YW1wbGVzIG9mIHdoYXQgdGhhdCBtZWFucy5cbiAgICAgICAgICAgIGRhdGEubWlsbGlzZWNvbmRzID0gbWlsbGlzZWNvbmRzICUgMTAwMDtcblxuICAgICAgICAgICAgc2Vjb25kcyA9IGFic1JvdW5kKG1pbGxpc2Vjb25kcyAvIDEwMDApO1xuICAgICAgICAgICAgZGF0YS5zZWNvbmRzID0gc2Vjb25kcyAlIDYwO1xuXG4gICAgICAgICAgICBtaW51dGVzID0gYWJzUm91bmQoc2Vjb25kcyAvIDYwKTtcbiAgICAgICAgICAgIGRhdGEubWludXRlcyA9IG1pbnV0ZXMgJSA2MDtcblxuICAgICAgICAgICAgaG91cnMgPSBhYnNSb3VuZChtaW51dGVzIC8gNjApO1xuICAgICAgICAgICAgZGF0YS5ob3VycyA9IGhvdXJzICUgMjQ7XG5cbiAgICAgICAgICAgIGRheXMgKz0gYWJzUm91bmQoaG91cnMgLyAyNCk7XG4gICAgICAgICAgICBkYXRhLmRheXMgPSBkYXlzICUgMzA7XG5cbiAgICAgICAgICAgIG1vbnRocyArPSBhYnNSb3VuZChkYXlzIC8gMzApO1xuICAgICAgICAgICAgZGF0YS5tb250aHMgPSBtb250aHMgJSAxMjtcblxuICAgICAgICAgICAgeWVhcnMgPSBhYnNSb3VuZChtb250aHMgLyAxMik7XG4gICAgICAgICAgICBkYXRhLnllYXJzID0geWVhcnM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2Vla3MgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gYWJzUm91bmQodGhpcy5kYXlzKCkgLyA3KTtcbiAgICAgICAgfSxcblxuICAgICAgICB2YWx1ZU9mIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21pbGxpc2Vjb25kcyArXG4gICAgICAgICAgICAgIHRoaXMuX2RheXMgKiA4NjRlNSArXG4gICAgICAgICAgICAgICh0aGlzLl9tb250aHMgJSAxMikgKiAyNTkyZTYgK1xuICAgICAgICAgICAgICB0b0ludCh0aGlzLl9tb250aHMgLyAxMikgKiAzMTUzNmU2O1xuICAgICAgICB9LFxuXG4gICAgICAgIGh1bWFuaXplIDogZnVuY3Rpb24gKHdpdGhTdWZmaXgpIHtcbiAgICAgICAgICAgIHZhciBkaWZmZXJlbmNlID0gK3RoaXMsXG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gcmVsYXRpdmVUaW1lKGRpZmZlcmVuY2UsICF3aXRoU3VmZml4LCB0aGlzLmxhbmcoKSk7XG5cbiAgICAgICAgICAgIGlmICh3aXRoU3VmZml4KSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gdGhpcy5sYW5nKCkucGFzdEZ1dHVyZShkaWZmZXJlbmNlLCBvdXRwdXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nKCkucG9zdGZvcm1hdChvdXRwdXQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZCA6IGZ1bmN0aW9uIChpbnB1dCwgdmFsKSB7XG4gICAgICAgICAgICAvLyBzdXBwb3J0cyBvbmx5IDIuMC1zdHlsZSBhZGQoMSwgJ3MnKSBvciBhZGQobW9tZW50KVxuICAgICAgICAgICAgdmFyIGR1ciA9IG1vbWVudC5kdXJhdGlvbihpbnB1dCwgdmFsKTtcblxuICAgICAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzICs9IGR1ci5fbWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgdGhpcy5fZGF5cyArPSBkdXIuX2RheXM7XG4gICAgICAgICAgICB0aGlzLl9tb250aHMgKz0gZHVyLl9tb250aHM7XG5cbiAgICAgICAgICAgIHRoaXMuX2J1YmJsZSgpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBzdWJ0cmFjdCA6IGZ1bmN0aW9uIChpbnB1dCwgdmFsKSB7XG4gICAgICAgICAgICB2YXIgZHVyID0gbW9tZW50LmR1cmF0aW9uKGlucHV0LCB2YWwpO1xuXG4gICAgICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgLT0gZHVyLl9taWxsaXNlY29uZHM7XG4gICAgICAgICAgICB0aGlzLl9kYXlzIC09IGR1ci5fZGF5cztcbiAgICAgICAgICAgIHRoaXMuX21vbnRocyAtPSBkdXIuX21vbnRocztcblxuICAgICAgICAgICAgdGhpcy5fYnViYmxlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldCA6IGZ1bmN0aW9uICh1bml0cykge1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1t1bml0cy50b0xvd2VyQ2FzZSgpICsgJ3MnXSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFzIDogZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzWydhcycgKyB1bml0cy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHVuaXRzLnNsaWNlKDEpICsgJ3MnXSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGxhbmcgOiBtb21lbnQuZm4ubGFuZyxcblxuICAgICAgICB0b0lzb1N0cmluZyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIGluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9kb3JkaWxsZS9tb21lbnQtaXNvZHVyYXRpb24vYmxvYi9tYXN0ZXIvbW9tZW50Lmlzb2R1cmF0aW9uLmpzXG4gICAgICAgICAgICB2YXIgeWVhcnMgPSBNYXRoLmFicyh0aGlzLnllYXJzKCkpLFxuICAgICAgICAgICAgICAgIG1vbnRocyA9IE1hdGguYWJzKHRoaXMubW9udGhzKCkpLFxuICAgICAgICAgICAgICAgIGRheXMgPSBNYXRoLmFicyh0aGlzLmRheXMoKSksXG4gICAgICAgICAgICAgICAgaG91cnMgPSBNYXRoLmFicyh0aGlzLmhvdXJzKCkpLFxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSBNYXRoLmFicyh0aGlzLm1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgICAgc2Vjb25kcyA9IE1hdGguYWJzKHRoaXMuc2Vjb25kcygpICsgdGhpcy5taWxsaXNlY29uZHMoKSAvIDEwMDApO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuYXNTZWNvbmRzKCkpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIHRoZSBzYW1lIGFzIEMjJ3MgKE5vZGEpIGFuZCBweXRob24gKGlzb2RhdGUpLi4uXG4gICAgICAgICAgICAgICAgLy8gYnV0IG5vdCBvdGhlciBKUyAoZ29vZy5kYXRlKVxuICAgICAgICAgICAgICAgIHJldHVybiAnUDBEJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICh0aGlzLmFzU2Vjb25kcygpIDwgMCA/ICctJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgJ1AnICtcbiAgICAgICAgICAgICAgICAoeWVhcnMgPyB5ZWFycyArICdZJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgKG1vbnRocyA/IG1vbnRocyArICdNJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgKGRheXMgPyBkYXlzICsgJ0QnIDogJycpICtcbiAgICAgICAgICAgICAgICAoKGhvdXJzIHx8IG1pbnV0ZXMgfHwgc2Vjb25kcykgPyAnVCcgOiAnJykgK1xuICAgICAgICAgICAgICAgIChob3VycyA/IGhvdXJzICsgJ0gnIDogJycpICtcbiAgICAgICAgICAgICAgICAobWludXRlcyA/IG1pbnV0ZXMgKyAnTScgOiAnJykgK1xuICAgICAgICAgICAgICAgIChzZWNvbmRzID8gc2Vjb25kcyArICdTJyA6ICcnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gbWFrZUR1cmF0aW9uR2V0dGVyKG5hbWUpIHtcbiAgICAgICAgbW9tZW50LmR1cmF0aW9uLmZuW25hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFbbmFtZV07XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUR1cmF0aW9uQXNHZXR0ZXIobmFtZSwgZmFjdG9yKSB7XG4gICAgICAgIG1vbWVudC5kdXJhdGlvbi5mblsnYXMnICsgbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gK3RoaXMgLyBmYWN0b3I7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZm9yIChpIGluIHVuaXRNaWxsaXNlY29uZEZhY3RvcnMpIHtcbiAgICAgICAgaWYgKHVuaXRNaWxsaXNlY29uZEZhY3RvcnMuaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICAgIG1ha2VEdXJhdGlvbkFzR2V0dGVyKGksIHVuaXRNaWxsaXNlY29uZEZhY3RvcnNbaV0pO1xuICAgICAgICAgICAgbWFrZUR1cmF0aW9uR2V0dGVyKGkudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtYWtlRHVyYXRpb25Bc0dldHRlcignV2Vla3MnLCA2MDQ4ZTUpO1xuICAgIG1vbWVudC5kdXJhdGlvbi5mbi5hc01vbnRocyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICgrdGhpcyAtIHRoaXMueWVhcnMoKSAqIDMxNTM2ZTYpIC8gMjU5MmU2ICsgdGhpcy55ZWFycygpICogMTI7XG4gICAgfTtcblxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBEZWZhdWx0IExhbmdcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIC8vIFNldCBkZWZhdWx0IGxhbmd1YWdlLCBvdGhlciBsYW5ndWFnZXMgd2lsbCBpbmhlcml0IGZyb20gRW5nbGlzaC5cbiAgICBtb21lbnQubGFuZygnZW4nLCB7XG4gICAgICAgIG9yZGluYWwgOiBmdW5jdGlvbiAobnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgYiA9IG51bWJlciAlIDEwLFxuICAgICAgICAgICAgICAgIG91dHB1dCA9ICh0b0ludChudW1iZXIgJSAxMDAgLyAxMCkgPT09IDEpID8gJ3RoJyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDEpID8gJ3N0JyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDIpID8gJ25kJyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDMpID8gJ3JkJyA6ICd0aCc7XG4gICAgICAgICAgICByZXR1cm4gbnVtYmVyICsgb3V0cHV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKiBFTUJFRF9MQU5HVUFHRVMgKi9cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgRXhwb3NpbmcgTW9tZW50XG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgZnVuY3Rpb24gbWFrZUdsb2JhbChzaG91bGREZXByZWNhdGUpIHtcbiAgICAgICAgLypnbG9iYWwgZW5kZXI6ZmFsc2UgKi9cbiAgICAgICAgaWYgKHR5cGVvZiBlbmRlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBvbGRHbG9iYWxNb21lbnQgPSBnbG9iYWxTY29wZS5tb21lbnQ7XG4gICAgICAgIGlmIChzaG91bGREZXByZWNhdGUpIHtcbiAgICAgICAgICAgIGdsb2JhbFNjb3BlLm1vbWVudCA9IGRlcHJlY2F0ZShcbiAgICAgICAgICAgICAgICAgICAgXCJBY2Nlc3NpbmcgTW9tZW50IHRocm91Z2ggdGhlIGdsb2JhbCBzY29wZSBpcyBcIiArXG4gICAgICAgICAgICAgICAgICAgIFwiZGVwcmVjYXRlZCwgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBhbiB1cGNvbWluZyBcIiArXG4gICAgICAgICAgICAgICAgICAgIFwicmVsZWFzZS5cIixcbiAgICAgICAgICAgICAgICAgICAgbW9tZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdsb2JhbFNjb3BlLm1vbWVudCA9IG1vbWVudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIENvbW1vbkpTIG1vZHVsZSBpcyBkZWZpbmVkXG4gICAgaWYgKGhhc01vZHVsZSkge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IG1vbWVudDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShcIm1vbWVudFwiLCBmdW5jdGlvbiAocmVxdWlyZSwgZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgICAgICAgICBpZiAobW9kdWxlLmNvbmZpZyAmJiBtb2R1bGUuY29uZmlnKCkgJiYgbW9kdWxlLmNvbmZpZygpLm5vR2xvYmFsID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgLy8gcmVsZWFzZSB0aGUgZ2xvYmFsIHZhcmlhYmxlXG4gICAgICAgICAgICAgICAgZ2xvYmFsU2NvcGUubW9tZW50ID0gb2xkR2xvYmFsTW9tZW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbW9tZW50O1xuICAgICAgICB9KTtcbiAgICAgICAgbWFrZUdsb2JhbCh0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBtYWtlR2xvYmFsKCk7XG4gICAgfVxufSkuY2FsbCh0aGlzKTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiLy8gICAgIFVuZGVyc2NvcmUuanMgMS42LjBcbi8vICAgICBodHRwOi8vdW5kZXJzY29yZWpzLm9yZ1xuLy8gICAgIChjKSAyMDA5LTIwMTQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbi8vICAgICBVbmRlcnNjb3JlIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG4oZnVuY3Rpb24oKSB7XG5cbiAgLy8gQmFzZWxpbmUgc2V0dXBcbiAgLy8gLS0tLS0tLS0tLS0tLS1cblxuICAvLyBFc3RhYmxpc2ggdGhlIHJvb3Qgb2JqZWN0LCBgd2luZG93YCBpbiB0aGUgYnJvd3Nlciwgb3IgYGV4cG9ydHNgIG9uIHRoZSBzZXJ2ZXIuXG4gIHZhciByb290ID0gdGhpcztcblxuICAvLyBTYXZlIHRoZSBwcmV2aW91cyB2YWx1ZSBvZiB0aGUgYF9gIHZhcmlhYmxlLlxuICB2YXIgcHJldmlvdXNVbmRlcnNjb3JlID0gcm9vdC5fO1xuXG4gIC8vIEVzdGFibGlzaCB0aGUgb2JqZWN0IHRoYXQgZ2V0cyByZXR1cm5lZCB0byBicmVhayBvdXQgb2YgYSBsb29wIGl0ZXJhdGlvbi5cbiAgdmFyIGJyZWFrZXIgPSB7fTtcblxuICAvLyBTYXZlIGJ5dGVzIGluIHRoZSBtaW5pZmllZCAoYnV0IG5vdCBnemlwcGVkKSB2ZXJzaW9uOlxuICB2YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSwgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlLCBGdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbiAgLy8gQ3JlYXRlIHF1aWNrIHJlZmVyZW5jZSB2YXJpYWJsZXMgZm9yIHNwZWVkIGFjY2VzcyB0byBjb3JlIHByb3RvdHlwZXMuXG4gIHZhclxuICAgIHB1c2ggICAgICAgICAgICAgPSBBcnJheVByb3RvLnB1c2gsXG4gICAgc2xpY2UgICAgICAgICAgICA9IEFycmF5UHJvdG8uc2xpY2UsXG4gICAgY29uY2F0ICAgICAgICAgICA9IEFycmF5UHJvdG8uY29uY2F0LFxuICAgIHRvU3RyaW5nICAgICAgICAgPSBPYmpQcm90by50b1N0cmluZyxcbiAgICBoYXNPd25Qcm9wZXJ0eSAgID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbiAgLy8gQWxsICoqRUNNQVNjcmlwdCA1KiogbmF0aXZlIGZ1bmN0aW9uIGltcGxlbWVudGF0aW9ucyB0aGF0IHdlIGhvcGUgdG8gdXNlXG4gIC8vIGFyZSBkZWNsYXJlZCBoZXJlLlxuICB2YXJcbiAgICBuYXRpdmVGb3JFYWNoICAgICAgPSBBcnJheVByb3RvLmZvckVhY2gsXG4gICAgbmF0aXZlTWFwICAgICAgICAgID0gQXJyYXlQcm90by5tYXAsXG4gICAgbmF0aXZlUmVkdWNlICAgICAgID0gQXJyYXlQcm90by5yZWR1Y2UsXG4gICAgbmF0aXZlUmVkdWNlUmlnaHQgID0gQXJyYXlQcm90by5yZWR1Y2VSaWdodCxcbiAgICBuYXRpdmVGaWx0ZXIgICAgICAgPSBBcnJheVByb3RvLmZpbHRlcixcbiAgICBuYXRpdmVFdmVyeSAgICAgICAgPSBBcnJheVByb3RvLmV2ZXJ5LFxuICAgIG5hdGl2ZVNvbWUgICAgICAgICA9IEFycmF5UHJvdG8uc29tZSxcbiAgICBuYXRpdmVJbmRleE9mICAgICAgPSBBcnJheVByb3RvLmluZGV4T2YsXG4gICAgbmF0aXZlTGFzdEluZGV4T2YgID0gQXJyYXlQcm90by5sYXN0SW5kZXhPZixcbiAgICBuYXRpdmVJc0FycmF5ICAgICAgPSBBcnJheS5pc0FycmF5LFxuICAgIG5hdGl2ZUtleXMgICAgICAgICA9IE9iamVjdC5rZXlzLFxuICAgIG5hdGl2ZUJpbmQgICAgICAgICA9IEZ1bmNQcm90by5iaW5kO1xuXG4gIC8vIENyZWF0ZSBhIHNhZmUgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgdXNlIGJlbG93LlxuICB2YXIgXyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogaW5zdGFuY2VvZiBfKSByZXR1cm4gb2JqO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBfKSkgcmV0dXJuIG5ldyBfKG9iaik7XG4gICAgdGhpcy5fd3JhcHBlZCA9IG9iajtcbiAgfTtcblxuICAvLyBFeHBvcnQgdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciAqKk5vZGUuanMqKiwgd2l0aFxuICAvLyBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBmb3IgdGhlIG9sZCBgcmVxdWlyZSgpYCBBUEkuIElmIHdlJ3JlIGluXG4gIC8vIHRoZSBicm93c2VyLCBhZGQgYF9gIGFzIGEgZ2xvYmFsIG9iamVjdCB2aWEgYSBzdHJpbmcgaWRlbnRpZmllcixcbiAgLy8gZm9yIENsb3N1cmUgQ29tcGlsZXIgXCJhZHZhbmNlZFwiIG1vZGUuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IF87XG4gICAgfVxuICAgIGV4cG9ydHMuXyA9IF87XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5fID0gXztcbiAgfVxuXG4gIC8vIEN1cnJlbnQgdmVyc2lvbi5cbiAgXy5WRVJTSU9OID0gJzEuNi4wJztcblxuICAvLyBDb2xsZWN0aW9uIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFRoZSBjb3JuZXJzdG9uZSwgYW4gYGVhY2hgIGltcGxlbWVudGF0aW9uLCBha2EgYGZvckVhY2hgLlxuICAvLyBIYW5kbGVzIG9iamVjdHMgd2l0aCB0aGUgYnVpbHQtaW4gYGZvckVhY2hgLCBhcnJheXMsIGFuZCByYXcgb2JqZWN0cy5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGZvckVhY2hgIGlmIGF2YWlsYWJsZS5cbiAgdmFyIGVhY2ggPSBfLmVhY2ggPSBfLmZvckVhY2ggPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuICAgIGlmIChuYXRpdmVGb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBuYXRpdmVGb3JFYWNoKSB7XG4gICAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpbaV0sIGksIG9iaikgPT09IGJyZWFrZXIpIHJldHVybjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtrZXlzW2ldXSwga2V5c1tpXSwgb2JqKSA9PT0gYnJlYWtlcikgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0b3IgdG8gZWFjaCBlbGVtZW50LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgbWFwYCBpZiBhdmFpbGFibGUuXG4gIF8ubWFwID0gXy5jb2xsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0cztcbiAgICBpZiAobmF0aXZlTWFwICYmIG9iai5tYXAgPT09IG5hdGl2ZU1hcCkgcmV0dXJuIG9iai5tYXAoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJlc3VsdHMucHVzaChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIHZhciByZWR1Y2VFcnJvciA9ICdSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJztcblxuICAvLyAqKlJlZHVjZSoqIGJ1aWxkcyB1cCBhIHNpbmdsZSByZXN1bHQgZnJvbSBhIGxpc3Qgb2YgdmFsdWVzLCBha2EgYGluamVjdGAsXG4gIC8vIG9yIGBmb2xkbGAuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGByZWR1Y2VgIGlmIGF2YWlsYWJsZS5cbiAgXy5yZWR1Y2UgPSBfLmZvbGRsID0gXy5pbmplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgdmFyIGluaXRpYWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcbiAgICBpZiAob2JqID09IG51bGwpIG9iaiA9IFtdO1xuICAgIGlmIChuYXRpdmVSZWR1Y2UgJiYgb2JqLnJlZHVjZSA9PT0gbmF0aXZlUmVkdWNlKSB7XG4gICAgICBpZiAoY29udGV4dCkgaXRlcmF0b3IgPSBfLmJpbmQoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGluaXRpYWwgPyBvYmoucmVkdWNlKGl0ZXJhdG9yLCBtZW1vKSA6IG9iai5yZWR1Y2UoaXRlcmF0b3IpO1xuICAgIH1cbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAoIWluaXRpYWwpIHtcbiAgICAgICAgbWVtbyA9IHZhbHVlO1xuICAgICAgICBpbml0aWFsID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG1lbW8sIHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFpbml0aWFsKSB0aHJvdyBuZXcgVHlwZUVycm9yKHJlZHVjZUVycm9yKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfTtcblxuICAvLyBUaGUgcmlnaHQtYXNzb2NpYXRpdmUgdmVyc2lvbiBvZiByZWR1Y2UsIGFsc28ga25vd24gYXMgYGZvbGRyYC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYHJlZHVjZVJpZ2h0YCBpZiBhdmFpbGFibGUuXG4gIF8ucmVkdWNlUmlnaHQgPSBfLmZvbGRyID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgbWVtbywgY29udGV4dCkge1xuICAgIHZhciBpbml0aWFsID0gYXJndW1lbnRzLmxlbmd0aCA+IDI7XG4gICAgaWYgKG9iaiA9PSBudWxsKSBvYmogPSBbXTtcbiAgICBpZiAobmF0aXZlUmVkdWNlUmlnaHQgJiYgb2JqLnJlZHVjZVJpZ2h0ID09PSBuYXRpdmVSZWR1Y2VSaWdodCkge1xuICAgICAgaWYgKGNvbnRleHQpIGl0ZXJhdG9yID0gXy5iaW5kKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICAgIHJldHVybiBpbml0aWFsID8gb2JqLnJlZHVjZVJpZ2h0KGl0ZXJhdG9yLCBtZW1vKSA6IG9iai5yZWR1Y2VSaWdodChpdGVyYXRvcik7XG4gICAgfVxuICAgIHZhciBsZW5ndGggPSBvYmoubGVuZ3RoO1xuICAgIGlmIChsZW5ndGggIT09ICtsZW5ndGgpIHtcbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB9XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaW5kZXggPSBrZXlzID8ga2V5c1stLWxlbmd0aF0gOiAtLWxlbmd0aDtcbiAgICAgIGlmICghaW5pdGlhbCkge1xuICAgICAgICBtZW1vID0gb2JqW2luZGV4XTtcbiAgICAgICAgaW5pdGlhbCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZW1vID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBtZW1vLCBvYmpbaW5kZXhdLCBpbmRleCwgbGlzdCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFpbml0aWFsKSB0aHJvdyBuZXcgVHlwZUVycm9yKHJlZHVjZUVycm9yKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIGZpcnN0IHZhbHVlIHdoaWNoIHBhc3NlcyBhIHRydXRoIHRlc3QuIEFsaWFzZWQgYXMgYGRldGVjdGAuXG4gIF8uZmluZCA9IF8uZGV0ZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIGFueShvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGZpbHRlcmAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBzZWxlY3RgLlxuICBfLmZpbHRlciA9IF8uc2VsZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdHM7XG4gICAgaWYgKG5hdGl2ZUZpbHRlciAmJiBvYmouZmlsdGVyID09PSBuYXRpdmVGaWx0ZXIpIHJldHVybiBvYmouZmlsdGVyKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHMucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGEgdHJ1dGggdGVzdCBmYWlscy5cbiAgXy5yZWplY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmV0dXJuICFwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgIH0sIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIERldGVybWluZSB3aGV0aGVyIGFsbCBvZiB0aGUgZWxlbWVudHMgbWF0Y2ggYSB0cnV0aCB0ZXN0LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgZXZlcnlgIGlmIGF2YWlsYWJsZS5cbiAgLy8gQWxpYXNlZCBhcyBgYWxsYC5cbiAgXy5ldmVyeSA9IF8uYWxsID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgfHwgKHByZWRpY2F0ZSA9IF8uaWRlbnRpdHkpO1xuICAgIHZhciByZXN1bHQgPSB0cnVlO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAobmF0aXZlRXZlcnkgJiYgb2JqLmV2ZXJ5ID09PSBuYXRpdmVFdmVyeSkgcmV0dXJuIG9iai5ldmVyeShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmICghKHJlc3VsdCA9IHJlc3VsdCAmJiBwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKSkgcmV0dXJuIGJyZWFrZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuICEhcmVzdWx0O1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiBhdCBsZWFzdCBvbmUgZWxlbWVudCBpbiB0aGUgb2JqZWN0IG1hdGNoZXMgYSB0cnV0aCB0ZXN0LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgc29tZWAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBhbnlgLlxuICB2YXIgYW55ID0gXy5zb21lID0gXy5hbnkgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSB8fCAocHJlZGljYXRlID0gXy5pZGVudGl0eSk7XG4gICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAobmF0aXZlU29tZSAmJiBvYmouc29tZSA9PT0gbmF0aXZlU29tZSkgcmV0dXJuIG9iai5zb21lKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHJlc3VsdCB8fCAocmVzdWx0ID0gcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkpIHJldHVybiBicmVha2VyO1xuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIHZhbHVlICh1c2luZyBgPT09YCkuXG4gIC8vIEFsaWFzZWQgYXMgYGluY2x1ZGVgLlxuICBfLmNvbnRhaW5zID0gXy5pbmNsdWRlID0gZnVuY3Rpb24ob2JqLCB0YXJnZXQpIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICBpZiAobmF0aXZlSW5kZXhPZiAmJiBvYmouaW5kZXhPZiA9PT0gbmF0aXZlSW5kZXhPZikgcmV0dXJuIG9iai5pbmRleE9mKHRhcmdldCkgIT0gLTE7XG4gICAgcmV0dXJuIGFueShvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRhcmdldDtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBJbnZva2UgYSBtZXRob2QgKHdpdGggYXJndW1lbnRzKSBvbiBldmVyeSBpdGVtIGluIGEgY29sbGVjdGlvbi5cbiAgXy5pbnZva2UgPSBmdW5jdGlvbihvYmosIG1ldGhvZCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpc0Z1bmMgPSBfLmlzRnVuY3Rpb24obWV0aG9kKTtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIChpc0Z1bmMgPyBtZXRob2QgOiB2YWx1ZVttZXRob2RdKS5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgXy5wbHVjayA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgXy5wcm9wZXJ0eShrZXkpKTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaWx0ZXJgOiBzZWxlY3Rpbmcgb25seSBvYmplY3RzXG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ud2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgXy5tYXRjaGVzKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmluZGA6IGdldHRpbmcgdGhlIGZpcnN0IG9iamVjdFxuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmZpbmRXaGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy5maW5kKG9iaiwgXy5tYXRjaGVzKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGVsZW1lbnQgb3IgKGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICAvLyBDYW4ndCBvcHRpbWl6ZSBhcnJheXMgb2YgaW50ZWdlcnMgbG9uZ2VyIHRoYW4gNjUsNTM1IGVsZW1lbnRzLlxuICAvLyBTZWUgW1dlYktpdCBCdWcgODA3OTddKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD04MDc5NylcbiAgXy5tYXggPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzQXJyYXkob2JqKSAmJiBvYmpbMF0gPT09ICtvYmpbMF0gJiYgb2JqLmxlbmd0aCA8IDY1NTM1KSB7XG4gICAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkoTWF0aCwgb2JqKTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IC1JbmZpbml0eSwgbGFzdENvbXB1dGVkID0gLUluZmluaXR5O1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHZhciBjb21wdXRlZCA9IGl0ZXJhdG9yID8gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpIDogdmFsdWU7XG4gICAgICBpZiAoY29tcHV0ZWQgPiBsYXN0Q29tcHV0ZWQpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtaW5pbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1pbiA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAoIWl0ZXJhdG9yICYmIF8uaXNBcnJheShvYmopICYmIG9ialswXSA9PT0gK29ialswXSAmJiBvYmoubGVuZ3RoIDwgNjU1MzUpIHtcbiAgICAgIHJldHVybiBNYXRoLm1pbi5hcHBseShNYXRoLCBvYmopO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IEluZmluaXR5O1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHZhciBjb21wdXRlZCA9IGl0ZXJhdG9yID8gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpIDogdmFsdWU7XG4gICAgICBpZiAoY29tcHV0ZWQgPCBsYXN0Q29tcHV0ZWQpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gU2h1ZmZsZSBhbiBhcnJheSwgdXNpbmcgdGhlIG1vZGVybiB2ZXJzaW9uIG9mIHRoZVxuICAvLyBbRmlzaGVyLVlhdGVzIHNodWZmbGVdKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRmlzaGVy4oCTWWF0ZXNfc2h1ZmZsZSkuXG4gIF8uc2h1ZmZsZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByYW5kO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHNodWZmbGVkID0gW107XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByYW5kID0gXy5yYW5kb20oaW5kZXgrKyk7XG4gICAgICBzaHVmZmxlZFtpbmRleCAtIDFdID0gc2h1ZmZsZWRbcmFuZF07XG4gICAgICBzaHVmZmxlZFtyYW5kXSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIHJldHVybiBzaHVmZmxlZDtcbiAgfTtcblxuICAvLyBTYW1wbGUgKipuKiogcmFuZG9tIHZhbHVlcyBmcm9tIGEgY29sbGVjdGlvbi5cbiAgLy8gSWYgKipuKiogaXMgbm90IHNwZWNpZmllZCwgcmV0dXJucyBhIHNpbmdsZSByYW5kb20gZWxlbWVudC5cbiAgLy8gVGhlIGludGVybmFsIGBndWFyZGAgYXJndW1lbnQgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgbWFwYC5cbiAgXy5zYW1wbGUgPSBmdW5jdGlvbihvYmosIG4sIGd1YXJkKSB7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkge1xuICAgICAgaWYgKG9iai5sZW5ndGggIT09ICtvYmoubGVuZ3RoKSBvYmogPSBfLnZhbHVlcyhvYmopO1xuICAgICAgcmV0dXJuIG9ialtfLnJhbmRvbShvYmoubGVuZ3RoIC0gMSldO1xuICAgIH1cbiAgICByZXR1cm4gXy5zaHVmZmxlKG9iaikuc2xpY2UoMCwgTWF0aC5tYXgoMCwgbikpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGxvb2t1cCBpdGVyYXRvcnMuXG4gIHZhciBsb29rdXBJdGVyYXRvciA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBfLmlkZW50aXR5O1xuICAgIGlmIChfLmlzRnVuY3Rpb24odmFsdWUpKSByZXR1cm4gdmFsdWU7XG4gICAgcmV0dXJuIF8ucHJvcGVydHkodmFsdWUpO1xuICB9O1xuXG4gIC8vIFNvcnQgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiBwcm9kdWNlZCBieSBhbiBpdGVyYXRvci5cbiAgXy5zb3J0QnkgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcihpdGVyYXRvcik7XG4gICAgcmV0dXJuIF8ucGx1Y2soXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICBjcml0ZXJpYTogaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpXG4gICAgICB9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYTtcbiAgICAgIHZhciBiID0gcmlnaHQuY3JpdGVyaWE7XG4gICAgICBpZiAoYSAhPT0gYikge1xuICAgICAgICBpZiAoYSA+IGIgfHwgYSA9PT0gdm9pZCAwKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGEgPCBiIHx8IGIgPT09IHZvaWQgMCkgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxlZnQuaW5kZXggLSByaWdodC5pbmRleDtcbiAgICB9KSwgJ3ZhbHVlJyk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdXNlZCBmb3IgYWdncmVnYXRlIFwiZ3JvdXAgYnlcIiBvcGVyYXRpb25zLlxuICB2YXIgZ3JvdXAgPSBmdW5jdGlvbihiZWhhdmlvcikge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICBpdGVyYXRvciA9IGxvb2t1cEl0ZXJhdG9yKGl0ZXJhdG9yKTtcbiAgICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGtleSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBvYmopO1xuICAgICAgICBiZWhhdmlvcihyZXN1bHQsIGtleSwgdmFsdWUpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuICAvLyB0byBncm91cCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNyaXRlcmlvbi5cbiAgXy5ncm91cEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCBrZXksIHZhbHVlKSB7XG4gICAgXy5oYXMocmVzdWx0LCBrZXkpID8gcmVzdWx0W2tleV0ucHVzaCh2YWx1ZSkgOiByZXN1bHRba2V5XSA9IFt2YWx1ZV07XG4gIH0pO1xuXG4gIC8vIEluZGV4ZXMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiwgc2ltaWxhciB0byBgZ3JvdXBCeWAsIGJ1dCBmb3JcbiAgLy8gd2hlbiB5b3Uga25vdyB0aGF0IHlvdXIgaW5kZXggdmFsdWVzIHdpbGwgYmUgdW5pcXVlLlxuICBfLmluZGV4QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIGtleSwgdmFsdWUpIHtcbiAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICB9KTtcblxuICAvLyBDb3VudHMgaW5zdGFuY2VzIG9mIGFuIG9iamVjdCB0aGF0IGdyb3VwIGJ5IGEgY2VydGFpbiBjcml0ZXJpb24uIFBhc3NcbiAgLy8gZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZSB0byBjb3VudCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlXG4gIC8vIGNyaXRlcmlvbi5cbiAgXy5jb3VudEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCBrZXkpIHtcbiAgICBfLmhhcyhyZXN1bHQsIGtleSkgPyByZXN1bHRba2V5XSsrIDogcmVzdWx0W2tleV0gPSAxO1xuICB9KTtcblxuICAvLyBVc2UgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRvIGZpZ3VyZSBvdXQgdGhlIHNtYWxsZXN0IGluZGV4IGF0IHdoaWNoXG4gIC8vIGFuIG9iamVjdCBzaG91bGQgYmUgaW5zZXJ0ZWQgc28gYXMgdG8gbWFpbnRhaW4gb3JkZXIuIFVzZXMgYmluYXJ5IHNlYXJjaC5cbiAgXy5zb3J0ZWRJbmRleCA9IGZ1bmN0aW9uKGFycmF5LCBvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcihpdGVyYXRvcik7XG4gICAgdmFyIHZhbHVlID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmopO1xuICAgIHZhciBsb3cgPSAwLCBoaWdoID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICB2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+PiAxO1xuICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBhcnJheVttaWRdKSA8IHZhbHVlID8gbG93ID0gbWlkICsgMSA6IGhpZ2ggPSBtaWQ7XG4gICAgfVxuICAgIHJldHVybiBsb3c7XG4gIH07XG5cbiAgLy8gU2FmZWx5IGNyZWF0ZSBhIHJlYWwsIGxpdmUgYXJyYXkgZnJvbSBhbnl0aGluZyBpdGVyYWJsZS5cbiAgXy50b0FycmF5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFvYmopIHJldHVybiBbXTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikpIHJldHVybiBzbGljZS5jYWxsKG9iaik7XG4gICAgaWYgKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSByZXR1cm4gXy5tYXAob2JqLCBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gXy52YWx1ZXMob2JqKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiBhbiBvYmplY3QuXG4gIF8uc2l6ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIDA7XG4gICAgcmV0dXJuIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkgPyBvYmoubGVuZ3RoIDogXy5rZXlzKG9iaikubGVuZ3RoO1xuICB9O1xuXG4gIC8vIEFycmF5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS1cblxuICAvLyBHZXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGZpcnN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgaGVhZGAgYW5kIGB0YWtlYC4gVGhlICoqZ3VhcmQqKiBjaGVja1xuICAvLyBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8uZmlyc3QgPSBfLmhlYWQgPSBfLnRha2UgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAoKG4gPT0gbnVsbCkgfHwgZ3VhcmQpIHJldHVybiBhcnJheVswXTtcbiAgICBpZiAobiA8IDApIHJldHVybiBbXTtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgbik7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgbGFzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEVzcGVjaWFsbHkgdXNlZnVsIG9uXG4gIC8vIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIGFsbCB0aGUgdmFsdWVzIGluXG4gIC8vIHRoZSBhcnJheSwgZXhjbHVkaW5nIHRoZSBsYXN0IE4uIFRoZSAqKmd1YXJkKiogY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aFxuICAvLyBgXy5tYXBgLlxuICBfLmluaXRpYWwgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgYXJyYXkubGVuZ3RoIC0gKChuID09IG51bGwpIHx8IGd1YXJkID8gMSA6IG4pKTtcbiAgfTtcblxuICAvLyBHZXQgdGhlIGxhc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgbGFzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuIFRoZSAqKmd1YXJkKiogY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLmxhc3QgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAoKG4gPT0gbnVsbCkgfHwgZ3VhcmQpIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgTWF0aC5tYXgoYXJyYXkubGVuZ3RoIC0gbiwgMCkpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGZpcnN0IGVudHJ5IG9mIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgdGFpbGAgYW5kIGBkcm9wYC5cbiAgLy8gRXNwZWNpYWxseSB1c2VmdWwgb24gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgYW4gKipuKiogd2lsbCByZXR1cm5cbiAgLy8gdGhlIHJlc3QgTiB2YWx1ZXMgaW4gdGhlIGFycmF5LiBUaGUgKipndWFyZCoqXG4gIC8vIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5yZXN0ID0gXy50YWlsID0gXy5kcm9wID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIChuID09IG51bGwpIHx8IGd1YXJkID8gMSA6IG4pO1xuICB9O1xuXG4gIC8vIFRyaW0gb3V0IGFsbCBmYWxzeSB2YWx1ZXMgZnJvbSBhbiBhcnJheS5cbiAgXy5jb21wYWN0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIF8uaWRlbnRpdHkpO1xuICB9O1xuXG4gIC8vIEludGVybmFsIGltcGxlbWVudGF0aW9uIG9mIGEgcmVjdXJzaXZlIGBmbGF0dGVuYCBmdW5jdGlvbi5cbiAgdmFyIGZsYXR0ZW4gPSBmdW5jdGlvbihpbnB1dCwgc2hhbGxvdywgb3V0cHV0KSB7XG4gICAgaWYgKHNoYWxsb3cgJiYgXy5ldmVyeShpbnB1dCwgXy5pc0FycmF5KSkge1xuICAgICAgcmV0dXJuIGNvbmNhdC5hcHBseShvdXRwdXQsIGlucHV0KTtcbiAgICB9XG4gICAgZWFjaChpbnB1dCwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGlmIChfLmlzQXJyYXkodmFsdWUpIHx8IF8uaXNBcmd1bWVudHModmFsdWUpKSB7XG4gICAgICAgIHNoYWxsb3cgPyBwdXNoLmFwcGx5KG91dHB1dCwgdmFsdWUpIDogZmxhdHRlbih2YWx1ZSwgc2hhbGxvdywgb3V0cHV0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dC5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIC8vIEZsYXR0ZW4gb3V0IGFuIGFycmF5LCBlaXRoZXIgcmVjdXJzaXZlbHkgKGJ5IGRlZmF1bHQpLCBvciBqdXN0IG9uZSBsZXZlbC5cbiAgXy5mbGF0dGVuID0gZnVuY3Rpb24oYXJyYXksIHNoYWxsb3cpIHtcbiAgICByZXR1cm4gZmxhdHRlbihhcnJheSwgc2hhbGxvdywgW10pO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHZlcnNpb24gb2YgdGhlIGFycmF5IHRoYXQgZG9lcyBub3QgY29udGFpbiB0aGUgc3BlY2lmaWVkIHZhbHVlKHMpLlxuICBfLndpdGhvdXQgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmRpZmZlcmVuY2UoYXJyYXksIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gIH07XG5cbiAgLy8gU3BsaXQgYW4gYXJyYXkgaW50byB0d28gYXJyYXlzOiBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIHNhdGlzZnkgdGhlIGdpdmVuXG4gIC8vIHByZWRpY2F0ZSwgYW5kIG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgZG8gbm90IHNhdGlzZnkgdGhlIHByZWRpY2F0ZS5cbiAgXy5wYXJ0aXRpb24gPSBmdW5jdGlvbihhcnJheSwgcHJlZGljYXRlKSB7XG4gICAgdmFyIHBhc3MgPSBbXSwgZmFpbCA9IFtdO1xuICAgIGVhY2goYXJyYXksIGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgIChwcmVkaWNhdGUoZWxlbSkgPyBwYXNzIDogZmFpbCkucHVzaChlbGVtKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW3Bhc3MsIGZhaWxdO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYSBkdXBsaWNhdGUtZnJlZSB2ZXJzaW9uIG9mIHRoZSBhcnJheS4gSWYgdGhlIGFycmF5IGhhcyBhbHJlYWR5XG4gIC8vIGJlZW4gc29ydGVkLCB5b3UgaGF2ZSB0aGUgb3B0aW9uIG9mIHVzaW5nIGEgZmFzdGVyIGFsZ29yaXRobS5cbiAgLy8gQWxpYXNlZCBhcyBgdW5pcXVlYC5cbiAgXy51bmlxID0gXy51bmlxdWUgPSBmdW5jdGlvbihhcnJheSwgaXNTb3J0ZWQsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihpc1NvcnRlZCkpIHtcbiAgICAgIGNvbnRleHQgPSBpdGVyYXRvcjtcbiAgICAgIGl0ZXJhdG9yID0gaXNTb3J0ZWQ7XG4gICAgICBpc1NvcnRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICB2YXIgaW5pdGlhbCA9IGl0ZXJhdG9yID8gXy5tYXAoYXJyYXksIGl0ZXJhdG9yLCBjb250ZXh0KSA6IGFycmF5O1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgdmFyIHNlZW4gPSBbXTtcbiAgICBlYWNoKGluaXRpYWwsIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgaWYgKGlzU29ydGVkID8gKCFpbmRleCB8fCBzZWVuW3NlZW4ubGVuZ3RoIC0gMV0gIT09IHZhbHVlKSA6ICFfLmNvbnRhaW5zKHNlZW4sIHZhbHVlKSkge1xuICAgICAgICBzZWVuLnB1c2godmFsdWUpO1xuICAgICAgICByZXN1bHRzLnB1c2goYXJyYXlbaW5kZXhdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgdGhlIHVuaW9uOiBlYWNoIGRpc3RpbmN0IGVsZW1lbnQgZnJvbSBhbGwgb2ZcbiAgLy8gdGhlIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8udW5pb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXy51bmlxKF8uZmxhdHRlbihhcmd1bWVudHMsIHRydWUpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgZXZlcnkgaXRlbSBzaGFyZWQgYmV0d2VlbiBhbGwgdGhlXG4gIC8vIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8uaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdCA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoXy51bmlxKGFycmF5KSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIF8uZXZlcnkocmVzdCwgZnVuY3Rpb24ob3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMob3RoZXIsIGl0ZW0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gVGFrZSB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIG9uZSBhcnJheSBhbmQgYSBudW1iZXIgb2Ygb3RoZXIgYXJyYXlzLlxuICAvLyBPbmx5IHRoZSBlbGVtZW50cyBwcmVzZW50IGluIGp1c3QgdGhlIGZpcnN0IGFycmF5IHdpbGwgcmVtYWluLlxuICBfLmRpZmZlcmVuY2UgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN0ID0gY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBmdW5jdGlvbih2YWx1ZSl7IHJldHVybiAhXy5jb250YWlucyhyZXN0LCB2YWx1ZSk7IH0pO1xuICB9O1xuXG4gIC8vIFppcCB0b2dldGhlciBtdWx0aXBsZSBsaXN0cyBpbnRvIGEgc2luZ2xlIGFycmF5IC0tIGVsZW1lbnRzIHRoYXQgc2hhcmVcbiAgLy8gYW4gaW5kZXggZ28gdG9nZXRoZXIuXG4gIF8uemlwID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxlbmd0aCA9IF8ubWF4KF8ucGx1Y2soYXJndW1lbnRzLCAnbGVuZ3RoJykuY29uY2F0KDApKTtcbiAgICB2YXIgcmVzdWx0cyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdHNbaV0gPSBfLnBsdWNrKGFyZ3VtZW50cywgJycgKyBpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ29udmVydHMgbGlzdHMgaW50byBvYmplY3RzLiBQYXNzIGVpdGhlciBhIHNpbmdsZSBhcnJheSBvZiBgW2tleSwgdmFsdWVdYFxuICAvLyBwYWlycywgb3IgdHdvIHBhcmFsbGVsIGFycmF5cyBvZiB0aGUgc2FtZSBsZW5ndGggLS0gb25lIG9mIGtleXMsIGFuZCBvbmUgb2ZcbiAgLy8gdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICBfLm9iamVjdCA9IGZ1bmN0aW9uKGxpc3QsIHZhbHVlcykge1xuICAgIGlmIChsaXN0ID09IG51bGwpIHJldHVybiB7fTtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1dID0gdmFsdWVzW2ldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1bMF1dID0gbGlzdFtpXVsxXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBJZiB0aGUgYnJvd3NlciBkb2Vzbid0IHN1cHBseSB1cyB3aXRoIGluZGV4T2YgKEknbSBsb29raW5nIGF0IHlvdSwgKipNU0lFKiopLFxuICAvLyB3ZSBuZWVkIHRoaXMgZnVuY3Rpb24uIFJldHVybiB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYW5cbiAgLy8gaXRlbSBpbiBhbiBhcnJheSwgb3IgLTEgaWYgdGhlIGl0ZW0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBhcnJheS5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGluZGV4T2ZgIGlmIGF2YWlsYWJsZS5cbiAgLy8gSWYgdGhlIGFycmF5IGlzIGxhcmdlIGFuZCBhbHJlYWR5IGluIHNvcnQgb3JkZXIsIHBhc3MgYHRydWVgXG4gIC8vIGZvciAqKmlzU29ydGVkKiogdG8gdXNlIGJpbmFyeSBzZWFyY2guXG4gIF8uaW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBpc1NvcnRlZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XG4gICAgdmFyIGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gICAgaWYgKGlzU29ydGVkKSB7XG4gICAgICBpZiAodHlwZW9mIGlzU29ydGVkID09ICdudW1iZXInKSB7XG4gICAgICAgIGkgPSAoaXNTb3J0ZWQgPCAwID8gTWF0aC5tYXgoMCwgbGVuZ3RoICsgaXNTb3J0ZWQpIDogaXNTb3J0ZWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSA9IF8uc29ydGVkSW5kZXgoYXJyYXksIGl0ZW0pO1xuICAgICAgICByZXR1cm4gYXJyYXlbaV0gPT09IGl0ZW0gPyBpIDogLTE7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChuYXRpdmVJbmRleE9mICYmIGFycmF5LmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0sIGlzU29ydGVkKTtcbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgbGFzdEluZGV4T2ZgIGlmIGF2YWlsYWJsZS5cbiAgXy5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBmcm9tKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiAtMTtcbiAgICB2YXIgaGFzSW5kZXggPSBmcm9tICE9IG51bGw7XG4gICAgaWYgKG5hdGl2ZUxhc3RJbmRleE9mICYmIGFycmF5Lmxhc3RJbmRleE9mID09PSBuYXRpdmVMYXN0SW5kZXhPZikge1xuICAgICAgcmV0dXJuIGhhc0luZGV4ID8gYXJyYXkubGFzdEluZGV4T2YoaXRlbSwgZnJvbSkgOiBhcnJheS5sYXN0SW5kZXhPZihpdGVtKTtcbiAgICB9XG4gICAgdmFyIGkgPSAoaGFzSW5kZXggPyBmcm9tIDogYXJyYXkubGVuZ3RoKTtcbiAgICB3aGlsZSAoaS0tKSBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhbiBpbnRlZ2VyIEFycmF5IGNvbnRhaW5pbmcgYW4gYXJpdGhtZXRpYyBwcm9ncmVzc2lvbi4gQSBwb3J0IG9mXG4gIC8vIHRoZSBuYXRpdmUgUHl0aG9uIGByYW5nZSgpYCBmdW5jdGlvbi4gU2VlXG4gIC8vIFt0aGUgUHl0aG9uIGRvY3VtZW50YXRpb25dKGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS9mdW5jdGlvbnMuaHRtbCNyYW5nZSkuXG4gIF8ucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDw9IDEpIHtcbiAgICAgIHN0b3AgPSBzdGFydCB8fCAwO1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgICBzdGVwID0gYXJndW1lbnRzWzJdIHx8IDE7XG5cbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5tYXgoTWF0aC5jZWlsKChzdG9wIC0gc3RhcnQpIC8gc3RlcCksIDApO1xuICAgIHZhciBpZHggPSAwO1xuICAgIHZhciByYW5nZSA9IG5ldyBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUoaWR4IDwgbGVuZ3RoKSB7XG4gICAgICByYW5nZVtpZHgrK10gPSBzdGFydDtcbiAgICAgIHN0YXJ0ICs9IHN0ZXA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJhbmdlO1xuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIChhaGVtKSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUmV1c2FibGUgY29uc3RydWN0b3IgZnVuY3Rpb24gZm9yIHByb3RvdHlwZSBzZXR0aW5nLlxuICB2YXIgY3RvciA9IGZ1bmN0aW9uKCl7fTtcblxuICAvLyBDcmVhdGUgYSBmdW5jdGlvbiBib3VuZCB0byBhIGdpdmVuIG9iamVjdCAoYXNzaWduaW5nIGB0aGlzYCwgYW5kIGFyZ3VtZW50cyxcbiAgLy8gb3B0aW9uYWxseSkuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBGdW5jdGlvbi5iaW5kYCBpZlxuICAvLyBhdmFpbGFibGUuXG4gIF8uYmluZCA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQpIHtcbiAgICB2YXIgYXJncywgYm91bmQ7XG4gICAgaWYgKG5hdGl2ZUJpbmQgJiYgZnVuYy5iaW5kID09PSBuYXRpdmVCaW5kKSByZXR1cm4gbmF0aXZlQmluZC5hcHBseShmdW5jLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGlmICghXy5pc0Z1bmN0aW9uKGZ1bmMpKSB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgYm91bmQpKSByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgIGN0b3IucHJvdG90eXBlID0gZnVuYy5wcm90b3R5cGU7XG4gICAgICB2YXIgc2VsZiA9IG5ldyBjdG9yO1xuICAgICAgY3Rvci5wcm90b3R5cGUgPSBudWxsO1xuICAgICAgdmFyIHJlc3VsdCA9IGZ1bmMuYXBwbHkoc2VsZiwgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICBpZiAoT2JqZWN0KHJlc3VsdCkgPT09IHJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUGFydGlhbGx5IGFwcGx5IGEgZnVuY3Rpb24gYnkgY3JlYXRpbmcgYSB2ZXJzaW9uIHRoYXQgaGFzIGhhZCBzb21lIG9mIGl0c1xuICAvLyBhcmd1bWVudHMgcHJlLWZpbGxlZCwgd2l0aG91dCBjaGFuZ2luZyBpdHMgZHluYW1pYyBgdGhpc2AgY29udGV4dC4gXyBhY3RzXG4gIC8vIGFzIGEgcGxhY2Vob2xkZXIsIGFsbG93aW5nIGFueSBjb21iaW5hdGlvbiBvZiBhcmd1bWVudHMgdG8gYmUgcHJlLWZpbGxlZC5cbiAgXy5wYXJ0aWFsID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHZhciBib3VuZEFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBvc2l0aW9uID0gMDtcbiAgICAgIHZhciBhcmdzID0gYm91bmRBcmdzLnNsaWNlKCk7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gYXJncy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYXJnc1tpXSA9PT0gXykgYXJnc1tpXSA9IGFyZ3VtZW50c1twb3NpdGlvbisrXTtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChwb3NpdGlvbiA8IGFyZ3VtZW50cy5sZW5ndGgpIGFyZ3MucHVzaChhcmd1bWVudHNbcG9zaXRpb24rK10pO1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBCaW5kIGEgbnVtYmVyIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFJlbWFpbmluZyBhcmd1bWVudHNcbiAgLy8gYXJlIHRoZSBtZXRob2QgbmFtZXMgdG8gYmUgYm91bmQuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdCBhbGwgY2FsbGJhY2tzXG4gIC8vIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgXy5iaW5kQWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGZ1bmNzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGlmIChmdW5jcy5sZW5ndGggPT09IDApIHRocm93IG5ldyBFcnJvcignYmluZEFsbCBtdXN0IGJlIHBhc3NlZCBmdW5jdGlvbiBuYW1lcycpO1xuICAgIGVhY2goZnVuY3MsIGZ1bmN0aW9uKGYpIHsgb2JqW2ZdID0gXy5iaW5kKG9ialtmXSwgb2JqKTsgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBNZW1vaXplIGFuIGV4cGVuc2l2ZSBmdW5jdGlvbiBieSBzdG9yaW5nIGl0cyByZXN1bHRzLlxuICBfLm1lbW9pemUgPSBmdW5jdGlvbihmdW5jLCBoYXNoZXIpIHtcbiAgICB2YXIgbWVtbyA9IHt9O1xuICAgIGhhc2hlciB8fCAoaGFzaGVyID0gXy5pZGVudGl0eSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGtleSA9IGhhc2hlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIF8uaGFzKG1lbW8sIGtleSkgPyBtZW1vW2tleV0gOiAobWVtb1trZXldID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIERlbGF5cyBhIGZ1bmN0aW9uIGZvciB0aGUgZ2l2ZW4gbnVtYmVyIG9mIG1pbGxpc2Vjb25kcywgYW5kIHRoZW4gY2FsbHNcbiAgLy8gaXQgd2l0aCB0aGUgYXJndW1lbnRzIHN1cHBsaWVkLlxuICBfLmRlbGF5ID0gZnVuY3Rpb24oZnVuYywgd2FpdCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IHJldHVybiBmdW5jLmFwcGx5KG51bGwsIGFyZ3MpOyB9LCB3YWl0KTtcbiAgfTtcblxuICAvLyBEZWZlcnMgYSBmdW5jdGlvbiwgc2NoZWR1bGluZyBpdCB0byBydW4gYWZ0ZXIgdGhlIGN1cnJlbnQgY2FsbCBzdGFjayBoYXNcbiAgLy8gY2xlYXJlZC5cbiAgXy5kZWZlciA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICByZXR1cm4gXy5kZWxheS5hcHBseShfLCBbZnVuYywgMV0uY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSkpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgd2hlbiBpbnZva2VkLCB3aWxsIG9ubHkgYmUgdHJpZ2dlcmVkIGF0IG1vc3Qgb25jZVxuICAvLyBkdXJpbmcgYSBnaXZlbiB3aW5kb3cgb2YgdGltZS4gTm9ybWFsbHksIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbCBydW5cbiAgLy8gYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuICAvLyBidXQgaWYgeW91J2QgbGlrZSB0byBkaXNhYmxlIHRoZSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSwgcGFzc1xuICAvLyBge2xlYWRpbmc6IGZhbHNlfWAuIFRvIGRpc2FibGUgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlLCBkaXR0by5cbiAgXy50aHJvdHRsZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICB2YXIgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICAgIHZhciB0aW1lb3V0ID0gbnVsbDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogXy5ub3coKTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub3cgPSBfLm5vdygpO1xuICAgICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKSBwcmV2aW91cyA9IG5vdztcbiAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gIC8vIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3JcbiAgLy8gTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4gIC8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gIF8uZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHQ7XG5cbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsYXN0ID0gXy5ub3coKSAtIHRpbWVzdGFtcDtcbiAgICAgIGlmIChsYXN0IDwgd2FpdCkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgdGltZXN0YW1wID0gXy5ub3coKTtcbiAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgaWYgKCF0aW1lb3V0KSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgIH1cbiAgICAgIGlmIChjYWxsTm93KSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYXQgbW9zdCBvbmUgdGltZSwgbm8gbWF0dGVyIGhvd1xuICAvLyBvZnRlbiB5b3UgY2FsbCBpdC4gVXNlZnVsIGZvciBsYXp5IGluaXRpYWxpemF0aW9uLlxuICBfLm9uY2UgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgdmFyIHJhbiA9IGZhbHNlLCBtZW1vO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChyYW4pIHJldHVybiBtZW1vO1xuICAgICAgcmFuID0gdHJ1ZTtcbiAgICAgIG1lbW8gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICBmdW5jID0gbnVsbDtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgZnVuY3Rpb24gcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSBzZWNvbmQsXG4gIC8vIGFsbG93aW5nIHlvdSB0byBhZGp1c3QgYXJndW1lbnRzLCBydW4gY29kZSBiZWZvcmUgYW5kIGFmdGVyLCBhbmRcbiAgLy8gY29uZGl0aW9uYWxseSBleGVjdXRlIHRoZSBvcmlnaW5hbCBmdW5jdGlvbi5cbiAgXy53cmFwID0gZnVuY3Rpb24oZnVuYywgd3JhcHBlcikge1xuICAgIHJldHVybiBfLnBhcnRpYWwod3JhcHBlciwgZnVuYyk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgaXMgdGhlIGNvbXBvc2l0aW9uIG9mIGEgbGlzdCBvZiBmdW5jdGlvbnMsIGVhY2hcbiAgLy8gY29uc3VtaW5nIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZ1bmN0aW9uIHRoYXQgZm9sbG93cy5cbiAgXy5jb21wb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZ1bmNzID0gYXJndW1lbnRzO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgZm9yICh2YXIgaSA9IGZ1bmNzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGFyZ3MgPSBbZnVuY3NbaV0uYXBwbHkodGhpcywgYXJncyldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFyZ3NbMF07XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgYWZ0ZXIgYmVpbmcgY2FsbGVkIE4gdGltZXMuXG4gIF8uYWZ0ZXIgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzIDwgMSkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgLy8gT2JqZWN0IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUmV0cmlldmUgdGhlIG5hbWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBPYmplY3Qua2V5c2BcbiAgXy5rZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICBpZiAobmF0aXZlS2V5cykgcmV0dXJuIG5hdGl2ZUtleXMob2JqKTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIHRoZSB2YWx1ZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgXy52YWx1ZXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgdmFsdWVzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFsdWVzW2ldID0gb2JqW2tleXNbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9O1xuXG4gIC8vIENvbnZlcnQgYW4gb2JqZWN0IGludG8gYSBsaXN0IG9mIGBba2V5LCB2YWx1ZV1gIHBhaXJzLlxuICBfLnBhaXJzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHBhaXJzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcGFpcnNbaV0gPSBba2V5c1tpXSwgb2JqW2tleXNbaV1dXTtcbiAgICB9XG4gICAgcmV0dXJuIHBhaXJzO1xuICB9O1xuXG4gIC8vIEludmVydCB0aGUga2V5cyBhbmQgdmFsdWVzIG9mIGFuIG9iamVjdC4gVGhlIHZhbHVlcyBtdXN0IGJlIHNlcmlhbGl6YWJsZS5cbiAgXy5pbnZlcnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0W29ialtrZXlzW2ldXV0gPSBrZXlzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHNvcnRlZCBsaXN0IG9mIHRoZSBmdW5jdGlvbiBuYW1lcyBhdmFpbGFibGUgb24gdGhlIG9iamVjdC5cbiAgLy8gQWxpYXNlZCBhcyBgbWV0aG9kc2BcbiAgXy5mdW5jdGlvbnMgPSBfLm1ldGhvZHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgbmFtZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG9ialtrZXldKSkgbmFtZXMucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZXMuc29ydCgpO1xuICB9O1xuXG4gIC8vIEV4dGVuZCBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgcHJvcGVydGllcyBpbiBwYXNzZWQtaW4gb2JqZWN0KHMpLlxuICBfLmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGVhY2goc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLCBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCBvbmx5IGNvbnRhaW5pbmcgdGhlIHdoaXRlbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ucGljayA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBjb3B5ID0ge307XG4gICAgdmFyIGtleXMgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBlYWNoKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKGtleSBpbiBvYmopIGNvcHlba2V5XSA9IG9ialtrZXldO1xuICAgIH0pO1xuICAgIHJldHVybiBjb3B5O1xuICB9O1xuXG4gICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgd2l0aG91dCB0aGUgYmxhY2tsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5vbWl0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGNvcHkgPSB7fTtcbiAgICB2YXIga2V5cyA9IGNvbmNhdC5hcHBseShBcnJheVByb3RvLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmICghXy5jb250YWlucyhrZXlzLCBrZXkpKSBjb3B5W2tleV0gPSBvYmpba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIGNvcHk7XG4gIH07XG5cbiAgLy8gRmlsbCBpbiBhIGdpdmVuIG9iamVjdCB3aXRoIGRlZmF1bHQgcHJvcGVydGllcy5cbiAgXy5kZWZhdWx0cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGVhY2goc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLCBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBpZiAob2JqW3Byb3BdID09PSB2b2lkIDApIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgKHNoYWxsb3ctY2xvbmVkKSBkdXBsaWNhdGUgb2YgYW4gb2JqZWN0LlxuICBfLmNsb25lID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gICAgcmV0dXJuIF8uaXNBcnJheShvYmopID8gb2JqLnNsaWNlKCkgOiBfLmV4dGVuZCh7fSwgb2JqKTtcbiAgfTtcblxuICAvLyBJbnZva2VzIGludGVyY2VwdG9yIHdpdGggdGhlIG9iaiwgYW5kIHRoZW4gcmV0dXJucyBvYmouXG4gIC8vIFRoZSBwcmltYXJ5IHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gXCJ0YXAgaW50b1wiIGEgbWV0aG9kIGNoYWluLCBpblxuICAvLyBvcmRlciB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gaW50ZXJtZWRpYXRlIHJlc3VsdHMgd2l0aGluIHRoZSBjaGFpbi5cbiAgXy50YXAgPSBmdW5jdGlvbihvYmosIGludGVyY2VwdG9yKSB7XG4gICAgaW50ZXJjZXB0b3Iob2JqKTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIEludGVybmFsIHJlY3Vyc2l2ZSBjb21wYXJpc29uIGZ1bmN0aW9uIGZvciBgaXNFcXVhbGAuXG4gIHZhciBlcSA9IGZ1bmN0aW9uKGEsIGIsIGFTdGFjaywgYlN0YWNrKSB7XG4gICAgLy8gSWRlbnRpY2FsIG9iamVjdHMgYXJlIGVxdWFsLiBgMCA9PT0gLTBgLCBidXQgdGhleSBhcmVuJ3QgaWRlbnRpY2FsLlxuICAgIC8vIFNlZSB0aGUgW0hhcm1vbnkgYGVnYWxgIHByb3Bvc2FsXShodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWwpLlxuICAgIGlmIChhID09PSBiKSByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PSAxIC8gYjtcbiAgICAvLyBBIHN0cmljdCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGBudWxsID09IHVuZGVmaW5lZGAuXG4gICAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHJldHVybiBhID09PSBiO1xuICAgIC8vIFVud3JhcCBhbnkgd3JhcHBlZCBvYmplY3RzLlxuICAgIGlmIChhIGluc3RhbmNlb2YgXykgYSA9IGEuX3dyYXBwZWQ7XG4gICAgaWYgKGIgaW5zdGFuY2VvZiBfKSBiID0gYi5fd3JhcHBlZDtcbiAgICAvLyBDb21wYXJlIGBbW0NsYXNzXV1gIG5hbWVzLlxuICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKGEpO1xuICAgIGlmIChjbGFzc05hbWUgIT0gdG9TdHJpbmcuY2FsbChiKSkgcmV0dXJuIGZhbHNlO1xuICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAvLyBTdHJpbmdzLCBudW1iZXJzLCBkYXRlcywgYW5kIGJvb2xlYW5zIGFyZSBjb21wYXJlZCBieSB2YWx1ZS5cbiAgICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6XG4gICAgICAgIC8vIFByaW1pdGl2ZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgb2JqZWN0IHdyYXBwZXJzIGFyZSBlcXVpdmFsZW50OyB0aHVzLCBgXCI1XCJgIGlzXG4gICAgICAgIC8vIGVxdWl2YWxlbnQgdG8gYG5ldyBTdHJpbmcoXCI1XCIpYC5cbiAgICAgICAgcmV0dXJuIGEgPT0gU3RyaW5nKGIpO1xuICAgICAgY2FzZSAnW29iamVjdCBOdW1iZXJdJzpcbiAgICAgICAgLy8gYE5hTmBzIGFyZSBlcXVpdmFsZW50LCBidXQgbm9uLXJlZmxleGl2ZS4gQW4gYGVnYWxgIGNvbXBhcmlzb24gaXMgcGVyZm9ybWVkIGZvclxuICAgICAgICAvLyBvdGhlciBudW1lcmljIHZhbHVlcy5cbiAgICAgICAgcmV0dXJuIGEgIT0gK2EgPyBiICE9ICtiIDogKGEgPT0gMCA/IDEgLyBhID09IDEgLyBiIDogYSA9PSArYik7XG4gICAgICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICAgIGNhc2UgJ1tvYmplY3QgQm9vbGVhbl0nOlxuICAgICAgICAvLyBDb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWVyaWMgcHJpbWl0aXZlIHZhbHVlcy4gRGF0ZXMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyXG4gICAgICAgIC8vIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9ucy4gTm90ZSB0aGF0IGludmFsaWQgZGF0ZXMgd2l0aCBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnNcbiAgICAgICAgLy8gb2YgYE5hTmAgYXJlIG5vdCBlcXVpdmFsZW50LlxuICAgICAgICByZXR1cm4gK2EgPT0gK2I7XG4gICAgICAvLyBSZWdFeHBzIGFyZSBjb21wYXJlZCBieSB0aGVpciBzb3VyY2UgcGF0dGVybnMgYW5kIGZsYWdzLlxuICAgICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcbiAgICAgICAgcmV0dXJuIGEuc291cmNlID09IGIuc291cmNlICYmXG4gICAgICAgICAgICAgICBhLmdsb2JhbCA9PSBiLmdsb2JhbCAmJlxuICAgICAgICAgICAgICAgYS5tdWx0aWxpbmUgPT0gYi5tdWx0aWxpbmUgJiZcbiAgICAgICAgICAgICAgIGEuaWdub3JlQ2FzZSA9PSBiLmlnbm9yZUNhc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgYSAhPSAnb2JqZWN0JyB8fCB0eXBlb2YgYiAhPSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuICAgIC8vIEFzc3VtZSBlcXVhbGl0eSBmb3IgY3ljbGljIHN0cnVjdHVyZXMuIFRoZSBhbGdvcml0aG0gZm9yIGRldGVjdGluZyBjeWNsaWNcbiAgICAvLyBzdHJ1Y3R1cmVzIGlzIGFkYXB0ZWQgZnJvbSBFUyA1LjEgc2VjdGlvbiAxNS4xMi4zLCBhYnN0cmFjdCBvcGVyYXRpb24gYEpPYC5cbiAgICB2YXIgbGVuZ3RoID0gYVN0YWNrLmxlbmd0aDtcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIC8vIExpbmVhciBzZWFyY2guIFBlcmZvcm1hbmNlIGlzIGludmVyc2VseSBwcm9wb3J0aW9uYWwgdG8gdGhlIG51bWJlciBvZlxuICAgICAgLy8gdW5pcXVlIG5lc3RlZCBzdHJ1Y3R1cmVzLlxuICAgICAgaWYgKGFTdGFja1tsZW5ndGhdID09IGEpIHJldHVybiBiU3RhY2tbbGVuZ3RoXSA9PSBiO1xuICAgIH1cbiAgICAvLyBPYmplY3RzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWl2YWxlbnQsIGJ1dCBgT2JqZWN0YHNcbiAgICAvLyBmcm9tIGRpZmZlcmVudCBmcmFtZXMgYXJlLlxuICAgIHZhciBhQ3RvciA9IGEuY29uc3RydWN0b3IsIGJDdG9yID0gYi5jb25zdHJ1Y3RvcjtcbiAgICBpZiAoYUN0b3IgIT09IGJDdG9yICYmICEoXy5pc0Z1bmN0aW9uKGFDdG9yKSAmJiAoYUN0b3IgaW5zdGFuY2VvZiBhQ3RvcikgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5pc0Z1bmN0aW9uKGJDdG9yKSAmJiAoYkN0b3IgaW5zdGFuY2VvZiBiQ3RvcikpXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAoJ2NvbnN0cnVjdG9yJyBpbiBhICYmICdjb25zdHJ1Y3RvcicgaW4gYikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gQWRkIHRoZSBmaXJzdCBvYmplY3QgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wdXNoKGEpO1xuICAgIGJTdGFjay5wdXNoKGIpO1xuICAgIHZhciBzaXplID0gMCwgcmVzdWx0ID0gdHJ1ZTtcbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgYW5kIGFycmF5cy5cbiAgICBpZiAoY2xhc3NOYW1lID09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgIC8vIENvbXBhcmUgYXJyYXkgbGVuZ3RocyB0byBkZXRlcm1pbmUgaWYgYSBkZWVwIGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5LlxuICAgICAgc2l6ZSA9IGEubGVuZ3RoO1xuICAgICAgcmVzdWx0ID0gc2l6ZSA9PSBiLmxlbmd0aDtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgLy8gRGVlcCBjb21wYXJlIHRoZSBjb250ZW50cywgaWdub3Jpbmcgbm9uLW51bWVyaWMgcHJvcGVydGllcy5cbiAgICAgICAgd2hpbGUgKHNpemUtLSkge1xuICAgICAgICAgIGlmICghKHJlc3VsdCA9IGVxKGFbc2l6ZV0sIGJbc2l6ZV0sIGFTdGFjaywgYlN0YWNrKSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlZXAgY29tcGFyZSBvYmplY3RzLlxuICAgICAgZm9yICh2YXIga2V5IGluIGEpIHtcbiAgICAgICAgaWYgKF8uaGFzKGEsIGtleSkpIHtcbiAgICAgICAgICAvLyBDb3VudCB0aGUgZXhwZWN0ZWQgbnVtYmVyIG9mIHByb3BlcnRpZXMuXG4gICAgICAgICAgc2l6ZSsrO1xuICAgICAgICAgIC8vIERlZXAgY29tcGFyZSBlYWNoIG1lbWJlci5cbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSBfLmhhcyhiLCBrZXkpICYmIGVxKGFba2V5XSwgYltrZXldLCBhU3RhY2ssIGJTdGFjaykpKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRW5zdXJlIHRoYXQgYm90aCBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIHByb3BlcnRpZXMuXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGZvciAoa2V5IGluIGIpIHtcbiAgICAgICAgICBpZiAoXy5oYXMoYiwga2V5KSAmJiAhKHNpemUtLSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9ICFzaXplO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBSZW1vdmUgdGhlIGZpcnN0IG9iamVjdCBmcm9tIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucG9wKCk7XG4gICAgYlN0YWNrLnBvcCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUGVyZm9ybSBhIGRlZXAgY29tcGFyaXNvbiB0byBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgZXF1YWwuXG4gIF8uaXNFcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gZXEoYSwgYiwgW10sIFtdKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIGFycmF5LCBzdHJpbmcsIG9yIG9iamVjdCBlbXB0eT9cbiAgLy8gQW4gXCJlbXB0eVwiIG9iamVjdCBoYXMgbm8gZW51bWVyYWJsZSBvd24tcHJvcGVydGllcy5cbiAgXy5pc0VtcHR5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikgfHwgXy5pc1N0cmluZyhvYmopKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIERPTSBlbGVtZW50P1xuICBfLmlzRWxlbWVudCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGFuIGFycmF5P1xuICAvLyBEZWxlZ2F0ZXMgdG8gRUNNQTUncyBuYXRpdmUgQXJyYXkuaXNBcnJheVxuICBfLmlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIGFuIG9iamVjdD9cbiAgXy5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xuICB9O1xuXG4gIC8vIEFkZCBzb21lIGlzVHlwZSBtZXRob2RzOiBpc0FyZ3VtZW50cywgaXNGdW5jdGlvbiwgaXNTdHJpbmcsIGlzTnVtYmVyLCBpc0RhdGUsIGlzUmVnRXhwLlxuICBlYWNoKFsnQXJndW1lbnRzJywgJ0Z1bmN0aW9uJywgJ1N0cmluZycsICdOdW1iZXInLCAnRGF0ZScsICdSZWdFeHAnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIF9bJ2lzJyArIG5hbWVdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIERlZmluZSBhIGZhbGxiYWNrIHZlcnNpb24gb2YgdGhlIG1ldGhvZCBpbiBicm93c2VycyAoYWhlbSwgSUUpLCB3aGVyZVxuICAvLyB0aGVyZSBpc24ndCBhbnkgaW5zcGVjdGFibGUgXCJBcmd1bWVudHNcIiB0eXBlLlxuICBpZiAoIV8uaXNBcmd1bWVudHMoYXJndW1lbnRzKSkge1xuICAgIF8uaXNBcmd1bWVudHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiAhIShvYmogJiYgXy5oYXMob2JqLCAnY2FsbGVlJykpO1xuICAgIH07XG4gIH1cblxuICAvLyBPcHRpbWl6ZSBgaXNGdW5jdGlvbmAgaWYgYXBwcm9wcmlhdGUuXG4gIGlmICh0eXBlb2YgKC8uLykgIT09ICdmdW5jdGlvbicpIHtcbiAgICBfLmlzRnVuY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nO1xuICAgIH07XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIG9iamVjdCBhIGZpbml0ZSBudW1iZXI/XG4gIF8uaXNGaW5pdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4ocGFyc2VGbG9hdChvYmopKTtcbiAgfTtcblxuICAvLyBJcyB0aGUgZ2l2ZW4gdmFsdWUgYE5hTmA/IChOYU4gaXMgdGhlIG9ubHkgbnVtYmVyIHdoaWNoIGRvZXMgbm90IGVxdWFsIGl0c2VsZikuXG4gIF8uaXNOYU4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc051bWJlcihvYmopICYmIG9iaiAhPSArb2JqO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBib29sZWFuP1xuICBfLmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgZXF1YWwgdG8gbnVsbD9cbiAgXy5pc051bGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBudWxsO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgdW5kZWZpbmVkP1xuICBfLmlzVW5kZWZpbmVkID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdm9pZCAwO1xuICB9O1xuXG4gIC8vIFNob3J0Y3V0IGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gcHJvcGVydHkgZGlyZWN0bHlcbiAgLy8gb24gaXRzZWxmIChpbiBvdGhlciB3b3Jkcywgbm90IG9uIGEgcHJvdG90eXBlKS5cbiAgXy5oYXMgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbiAgfTtcblxuICAvLyBVdGlsaXR5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJ1biBVbmRlcnNjb3JlLmpzIGluICpub0NvbmZsaWN0KiBtb2RlLCByZXR1cm5pbmcgdGhlIGBfYCB2YXJpYWJsZSB0byBpdHNcbiAgLy8gcHJldmlvdXMgb3duZXIuIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICByb290Ll8gPSBwcmV2aW91c1VuZGVyc2NvcmU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gS2VlcCB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gYXJvdW5kIGZvciBkZWZhdWx0IGl0ZXJhdG9ycy5cbiAgXy5pZGVudGl0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIF8uY29uc3RhbnQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgfTtcblxuICBfLnByb3BlcnR5ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIHByZWRpY2F0ZSBmb3IgY2hlY2tpbmcgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLm1hdGNoZXMgPSBmdW5jdGlvbihhdHRycykge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIGlmIChvYmogPT09IGF0dHJzKSByZXR1cm4gdHJ1ZTsgLy9hdm9pZCBjb21wYXJpbmcgYW4gb2JqZWN0IHRvIGl0c2VsZi5cbiAgICAgIGZvciAodmFyIGtleSBpbiBhdHRycykge1xuICAgICAgICBpZiAoYXR0cnNba2V5XSAhPT0gb2JqW2tleV0pXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJ1biBhIGZ1bmN0aW9uICoqbioqIHRpbWVzLlxuICBfLnRpbWVzID0gZnVuY3Rpb24obiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgYWNjdW0gPSBBcnJheShNYXRoLm1heCgwLCBuKSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIGFjY3VtW2ldID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBpKTtcbiAgICByZXR1cm4gYWNjdW07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gYW5kIG1heCAoaW5jbHVzaXZlKS5cbiAgXy5yYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIGlmIChtYXggPT0gbnVsbCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG4gIH07XG5cbiAgLy8gQSAocG9zc2libHkgZmFzdGVyKSB3YXkgdG8gZ2V0IHRoZSBjdXJyZW50IHRpbWVzdGFtcCBhcyBhbiBpbnRlZ2VyLlxuICBfLm5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7IH07XG5cbiAgLy8gTGlzdCBvZiBIVE1MIGVudGl0aWVzIGZvciBlc2NhcGluZy5cbiAgdmFyIGVudGl0eU1hcCA9IHtcbiAgICBlc2NhcGU6IHtcbiAgICAgICcmJzogJyZhbXA7JyxcbiAgICAgICc8JzogJyZsdDsnLFxuICAgICAgJz4nOiAnJmd0OycsXG4gICAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICAgIFwiJ1wiOiAnJiN4Mjc7J1xuICAgIH1cbiAgfTtcbiAgZW50aXR5TWFwLnVuZXNjYXBlID0gXy5pbnZlcnQoZW50aXR5TWFwLmVzY2FwZSk7XG5cbiAgLy8gUmVnZXhlcyBjb250YWluaW5nIHRoZSBrZXlzIGFuZCB2YWx1ZXMgbGlzdGVkIGltbWVkaWF0ZWx5IGFib3ZlLlxuICB2YXIgZW50aXR5UmVnZXhlcyA9IHtcbiAgICBlc2NhcGU6ICAgbmV3IFJlZ0V4cCgnWycgKyBfLmtleXMoZW50aXR5TWFwLmVzY2FwZSkuam9pbignJykgKyAnXScsICdnJyksXG4gICAgdW5lc2NhcGU6IG5ldyBSZWdFeHAoJygnICsgXy5rZXlzKGVudGl0eU1hcC51bmVzY2FwZSkuam9pbignfCcpICsgJyknLCAnZycpXG4gIH07XG5cbiAgLy8gRnVuY3Rpb25zIGZvciBlc2NhcGluZyBhbmQgdW5lc2NhcGluZyBzdHJpbmdzIHRvL2Zyb20gSFRNTCBpbnRlcnBvbGF0aW9uLlxuICBfLmVhY2goWydlc2NhcGUnLCAndW5lc2NhcGUnXSwgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgX1ttZXRob2RdID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICBpZiAoc3RyaW5nID09IG51bGwpIHJldHVybiAnJztcbiAgICAgIHJldHVybiAoJycgKyBzdHJpbmcpLnJlcGxhY2UoZW50aXR5UmVnZXhlc1ttZXRob2RdLCBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgICByZXR1cm4gZW50aXR5TWFwW21ldGhvZF1bbWF0Y2hdO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gSWYgdGhlIHZhbHVlIG9mIHRoZSBuYW1lZCBgcHJvcGVydHlgIGlzIGEgZnVuY3Rpb24gdGhlbiBpbnZva2UgaXQgd2l0aCB0aGVcbiAgLy8gYG9iamVjdGAgYXMgY29udGV4dDsgb3RoZXJ3aXNlLCByZXR1cm4gaXQuXG4gIF8ucmVzdWx0ID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICB2YXIgdmFsdWUgPSBvYmplY3RbcHJvcGVydHldO1xuICAgIHJldHVybiBfLmlzRnVuY3Rpb24odmFsdWUpID8gdmFsdWUuY2FsbChvYmplY3QpIDogdmFsdWU7XG4gIH07XG5cbiAgLy8gQWRkIHlvdXIgb3duIGN1c3RvbSBmdW5jdGlvbnMgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEdlbmVyYXRlIGEgdW5pcXVlIGludGVnZXIgaWQgKHVuaXF1ZSB3aXRoaW4gdGhlIGVudGlyZSBjbGllbnQgc2Vzc2lvbikuXG4gIC8vIFVzZWZ1bCBmb3IgdGVtcG9yYXJ5IERPTSBpZHMuXG4gIHZhciBpZENvdW50ZXIgPSAwO1xuICBfLnVuaXF1ZUlkID0gZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgdmFyIGlkID0gKytpZENvdW50ZXIgKyAnJztcbiAgICByZXR1cm4gcHJlZml4ID8gcHJlZml4ICsgaWQgOiBpZDtcbiAgfTtcblxuICAvLyBCeSBkZWZhdWx0LCBVbmRlcnNjb3JlIHVzZXMgRVJCLXN0eWxlIHRlbXBsYXRlIGRlbGltaXRlcnMsIGNoYW5nZSB0aGVcbiAgLy8gZm9sbG93aW5nIHRlbXBsYXRlIHNldHRpbmdzIHRvIHVzZSBhbHRlcm5hdGl2ZSBkZWxpbWl0ZXJzLlxuICBfLnRlbXBsYXRlU2V0dGluZ3MgPSB7XG4gICAgZXZhbHVhdGUgICAgOiAvPCUoW1xcc1xcU10rPyklPi9nLFxuICAgIGludGVycG9sYXRlIDogLzwlPShbXFxzXFxTXSs/KSU+L2csXG4gICAgZXNjYXBlICAgICAgOiAvPCUtKFtcXHNcXFNdKz8pJT4vZ1xuICB9O1xuXG4gIC8vIFdoZW4gY3VzdG9taXppbmcgYHRlbXBsYXRlU2V0dGluZ3NgLCBpZiB5b3UgZG9uJ3Qgd2FudCB0byBkZWZpbmUgYW5cbiAgLy8gaW50ZXJwb2xhdGlvbiwgZXZhbHVhdGlvbiBvciBlc2NhcGluZyByZWdleCwgd2UgbmVlZCBvbmUgdGhhdCBpc1xuICAvLyBndWFyYW50ZWVkIG5vdCB0byBtYXRjaC5cbiAgdmFyIG5vTWF0Y2ggPSAvKC4pXi87XG5cbiAgLy8gQ2VydGFpbiBjaGFyYWN0ZXJzIG5lZWQgdG8gYmUgZXNjYXBlZCBzbyB0aGF0IHRoZXkgY2FuIGJlIHB1dCBpbnRvIGFcbiAgLy8gc3RyaW5nIGxpdGVyYWwuXG4gIHZhciBlc2NhcGVzID0ge1xuICAgIFwiJ1wiOiAgICAgIFwiJ1wiLFxuICAgICdcXFxcJzogICAgICdcXFxcJyxcbiAgICAnXFxyJzogICAgICdyJyxcbiAgICAnXFxuJzogICAgICduJyxcbiAgICAnXFx0JzogICAgICd0JyxcbiAgICAnXFx1MjAyOCc6ICd1MjAyOCcsXG4gICAgJ1xcdTIwMjknOiAndTIwMjknXG4gIH07XG5cbiAgdmFyIGVzY2FwZXIgPSAvXFxcXHwnfFxccnxcXG58XFx0fFxcdTIwMjh8XFx1MjAyOS9nO1xuXG4gIC8vIEphdmFTY3JpcHQgbWljcm8tdGVtcGxhdGluZywgc2ltaWxhciB0byBKb2huIFJlc2lnJ3MgaW1wbGVtZW50YXRpb24uXG4gIC8vIFVuZGVyc2NvcmUgdGVtcGxhdGluZyBoYW5kbGVzIGFyYml0cmFyeSBkZWxpbWl0ZXJzLCBwcmVzZXJ2ZXMgd2hpdGVzcGFjZSxcbiAgLy8gYW5kIGNvcnJlY3RseSBlc2NhcGVzIHF1b3RlcyB3aXRoaW4gaW50ZXJwb2xhdGVkIGNvZGUuXG4gIF8udGVtcGxhdGUgPSBmdW5jdGlvbih0ZXh0LCBkYXRhLCBzZXR0aW5ncykge1xuICAgIHZhciByZW5kZXI7XG4gICAgc2V0dGluZ3MgPSBfLmRlZmF1bHRzKHt9LCBzZXR0aW5ncywgXy50ZW1wbGF0ZVNldHRpbmdzKTtcblxuICAgIC8vIENvbWJpbmUgZGVsaW1pdGVycyBpbnRvIG9uZSByZWd1bGFyIGV4cHJlc3Npb24gdmlhIGFsdGVybmF0aW9uLlxuICAgIHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChbXG4gICAgICAoc2V0dGluZ3MuZXNjYXBlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5pbnRlcnBvbGF0ZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuZXZhbHVhdGUgfHwgbm9NYXRjaCkuc291cmNlXG4gICAgXS5qb2luKCd8JykgKyAnfCQnLCAnZycpO1xuXG4gICAgLy8gQ29tcGlsZSB0aGUgdGVtcGxhdGUgc291cmNlLCBlc2NhcGluZyBzdHJpbmcgbGl0ZXJhbHMgYXBwcm9wcmlhdGVseS5cbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzb3VyY2UgPSBcIl9fcCs9J1wiO1xuICAgIHRleHQucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbihtYXRjaCwgZXNjYXBlLCBpbnRlcnBvbGF0ZSwgZXZhbHVhdGUsIG9mZnNldCkge1xuICAgICAgc291cmNlICs9IHRleHQuc2xpY2UoaW5kZXgsIG9mZnNldClcbiAgICAgICAgLnJlcGxhY2UoZXNjYXBlciwgZnVuY3Rpb24obWF0Y2gpIHsgcmV0dXJuICdcXFxcJyArIGVzY2FwZXNbbWF0Y2hdOyB9KTtcblxuICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGVzY2FwZSArIFwiKSk9PW51bGw/Jyc6Xy5lc2NhcGUoX190KSkrXFxuJ1wiO1xuICAgICAgfVxuICAgICAgaWYgKGludGVycG9sYXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgaW50ZXJwb2xhdGUgKyBcIikpPT1udWxsPycnOl9fdCkrXFxuJ1wiO1xuICAgICAgfVxuICAgICAgaWYgKGV2YWx1YXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIic7XFxuXCIgKyBldmFsdWF0ZSArIFwiXFxuX19wKz0nXCI7XG4gICAgICB9XG4gICAgICBpbmRleCA9IG9mZnNldCArIG1hdGNoLmxlbmd0aDtcbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcbiAgICBzb3VyY2UgKz0gXCInO1xcblwiO1xuXG4gICAgLy8gSWYgYSB2YXJpYWJsZSBpcyBub3Qgc3BlY2lmaWVkLCBwbGFjZSBkYXRhIHZhbHVlcyBpbiBsb2NhbCBzY29wZS5cbiAgICBpZiAoIXNldHRpbmdzLnZhcmlhYmxlKSBzb3VyY2UgPSAnd2l0aChvYmp8fHt9KXtcXG4nICsgc291cmNlICsgJ31cXG4nO1xuXG4gICAgc291cmNlID0gXCJ2YXIgX190LF9fcD0nJyxfX2o9QXJyYXkucHJvdG90eXBlLmpvaW4sXCIgK1xuICAgICAgXCJwcmludD1mdW5jdGlvbigpe19fcCs9X19qLmNhbGwoYXJndW1lbnRzLCcnKTt9O1xcblwiICtcbiAgICAgIHNvdXJjZSArIFwicmV0dXJuIF9fcDtcXG5cIjtcblxuICAgIHRyeSB7XG4gICAgICByZW5kZXIgPSBuZXcgRnVuY3Rpb24oc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaicsICdfJywgc291cmNlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEpIHJldHVybiByZW5kZXIoZGF0YSwgXyk7XG4gICAgdmFyIHRlbXBsYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIHJlbmRlci5jYWxsKHRoaXMsIGRhdGEsIF8pO1xuICAgIH07XG5cbiAgICAvLyBQcm92aWRlIHRoZSBjb21waWxlZCBmdW5jdGlvbiBzb3VyY2UgYXMgYSBjb252ZW5pZW5jZSBmb3IgcHJlY29tcGlsYXRpb24uXG4gICAgdGVtcGxhdGUuc291cmNlID0gJ2Z1bmN0aW9uKCcgKyAoc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaicpICsgJyl7XFxuJyArIHNvdXJjZSArICd9JztcblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfTtcblxuICAvLyBBZGQgYSBcImNoYWluXCIgZnVuY3Rpb24sIHdoaWNoIHdpbGwgZGVsZWdhdGUgdG8gdGhlIHdyYXBwZXIuXG4gIF8uY2hhaW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXyhvYmopLmNoYWluKCk7XG4gIH07XG5cbiAgLy8gT09QXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuICAvLyBJZiBVbmRlcnNjb3JlIGlzIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLCBpdCByZXR1cm5zIGEgd3JhcHBlZCBvYmplY3QgdGhhdFxuICAvLyBjYW4gYmUgdXNlZCBPTy1zdHlsZS4gVGhpcyB3cmFwcGVyIGhvbGRzIGFsdGVyZWQgdmVyc2lvbnMgb2YgYWxsIHRoZVxuICAvLyB1bmRlcnNjb3JlIGZ1bmN0aW9ucy4gV3JhcHBlZCBvYmplY3RzIG1heSBiZSBjaGFpbmVkLlxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjb250aW51ZSBjaGFpbmluZyBpbnRlcm1lZGlhdGUgcmVzdWx0cy5cbiAgdmFyIHJlc3VsdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0aGlzLl9jaGFpbiA/IF8ob2JqKS5jaGFpbigpIDogb2JqO1xuICB9O1xuXG4gIC8vIEFkZCBhbGwgb2YgdGhlIFVuZGVyc2NvcmUgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyIG9iamVjdC5cbiAgXy5taXhpbihfKTtcblxuICAvLyBBZGQgYWxsIG11dGF0b3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBlYWNoKFsncG9wJywgJ3B1c2gnLCAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iaiA9IHRoaXMuX3dyYXBwZWQ7XG4gICAgICBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKChuYW1lID09ICdzaGlmdCcgfHwgbmFtZSA9PSAnc3BsaWNlJykgJiYgb2JqLmxlbmd0aCA9PT0gMCkgZGVsZXRlIG9ialswXTtcbiAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBvYmopO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEFkZCBhbGwgYWNjZXNzb3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBlYWNoKFsnY29uY2F0JywgJ2pvaW4nLCAnc2xpY2UnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgbWV0aG9kLmFwcGx5KHRoaXMuX3dyYXBwZWQsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH0pO1xuXG4gIF8uZXh0ZW5kKF8ucHJvdG90eXBlLCB7XG5cbiAgICAvLyBTdGFydCBjaGFpbmluZyBhIHdyYXBwZWQgVW5kZXJzY29yZSBvYmplY3QuXG4gICAgY2hhaW46IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fY2hhaW4gPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vIEV4dHJhY3RzIHRoZSByZXN1bHQgZnJvbSBhIHdyYXBwZWQgYW5kIGNoYWluZWQgb2JqZWN0LlxuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl93cmFwcGVkO1xuICAgIH1cblxuICB9KTtcblxuICAvLyBBTUQgcmVnaXN0cmF0aW9uIGhhcHBlbnMgYXQgdGhlIGVuZCBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIEFNRCBsb2FkZXJzXG4gIC8vIHRoYXQgbWF5IG5vdCBlbmZvcmNlIG5leHQtdHVybiBzZW1hbnRpY3Mgb24gbW9kdWxlcy4gRXZlbiB0aG91Z2ggZ2VuZXJhbFxuICAvLyBwcmFjdGljZSBmb3IgQU1EIHJlZ2lzdHJhdGlvbiBpcyB0byBiZSBhbm9ueW1vdXMsIHVuZGVyc2NvcmUgcmVnaXN0ZXJzXG4gIC8vIGFzIGEgbmFtZWQgbW9kdWxlIGJlY2F1c2UsIGxpa2UgalF1ZXJ5LCBpdCBpcyBhIGJhc2UgbGlicmFyeSB0aGF0IGlzXG4gIC8vIHBvcHVsYXIgZW5vdWdoIHRvIGJlIGJ1bmRsZWQgaW4gYSB0aGlyZCBwYXJ0eSBsaWIsIGJ1dCBub3QgYmUgcGFydCBvZlxuICAvLyBhbiBBTUQgbG9hZCByZXF1ZXN0LiBUaG9zZSBjYXNlcyBjb3VsZCBnZW5lcmF0ZSBhbiBlcnJvciB3aGVuIGFuXG4gIC8vIGFub255bW91cyBkZWZpbmUoKSBpcyBjYWxsZWQgb3V0c2lkZSBvZiBhIGxvYWRlciByZXF1ZXN0LlxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCd1bmRlcnNjb3JlJywgW10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF87XG4gICAgfSk7XG4gIH1cbn0pLmNhbGwodGhpcyk7XG4iXX0=
