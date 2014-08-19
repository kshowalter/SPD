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

var k = require('../lib/k/k.js');
//var settings = require('./settings.js');
//var l_attr = settings.drawing.l_attr;
var _ = require('underscore');
//console.log('settings', settings);
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
        console.log('Error: unknown layer, using base');
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
        console.log('Error: name required');
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
        if( ! (layer_name in layers) ){ console.log("error, layer does not exist, using current");}
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
        if( ! (layer_name in layers) ){ console.log("error, layer does not exist, using current");}
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
        console.log('Layer name not found, using base');
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
        if( ! (layer_name in layers) ){ console.log("error, layer does not exist, using current");}
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
    //console.log('---settings---', settings);

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
        [x-size.module.frame.w*3/4, y+size.string.h + size.wire_offset.ground - size.module.lead],
        //[x-size.module.frame.w*3/4, y+size.string.h + size.wire_offset.ground ],
    ]);
    layer();

    block('module', [x,y]);
    y += size.module.h + size.string.gap_missing;
    block('module', [x,y]);
    y += size.module.h + size.string.gap;
    block('module', [x,y]);
    y += size.module.h + size.string.gap;
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
    if( settings.status.sections.array.set ){

        x = loc.array.right - size.string.w;
        y = loc.array.y;
        y -= size.string.h/2;

        //for( var i=0; i<system.DC.string_num; i++ ) {
        for( var i in _.range(system.DC.string_num)) {
            //var offset = i * size.wire_offset.base
            var offset_wire = size.wire_offset.min + ( size.wire_offset.base * i );
            
            block('string', [x,y]);
            // positive home run
            layer('DC_pos');
            line([
                [ x , loc.array.upper ],
                [ x , loc.array.upper-offset_wire ],
                [ loc.array.right+offset_wire , loc.array.upper-offset_wire ],
                [ loc.array.right+offset_wire , loc.array.y-offset_wire],
                [ loc.array.x , loc.array.y-offset_wire],
            ]);

            // negative home run
            layer('DC_neg');
            line([
                [ x , loc.array.lower ],
                [ x , loc.array.lower+offset_wire ],
                [ loc.array.right+offset_wire , loc.array.lower+offset_wire ],
                [ loc.array.right+offset_wire , loc.array.y+offset_wire],
                [ loc.array.x , loc.array.y+offset_wire],
            ]);

            x -= size.string.w;
        }

    //    rect(
    //        [ (loc.array.right+loc.array.left)/2, (loc.array.lower+loc.array.upper)/2 ],
    //        [ loc.array.right-loc.array.left, loc.array.lower-loc.array.upper ],
    //        'DC_pos');
    //    
        
        layer('DC_ground');
        line([
            //[ loc.array.left , loc.array.lower + size.wire_offset.ground ],
            [ loc.array.left, loc.array.lower + size.wire_offset.ground ],
            [ loc.array.right+size.wire_offset.ground , loc.array.lower + size.wire_offset.ground ],
            [ loc.array.right+size.wire_offset.ground , loc.array.y + size.wire_offset.ground],
            [ loc.array.x , loc.array.y+size.wire_offset.ground],
        ]);

        layer();

        
    }

///////////////////////////////
// combiner box

    if( settings.status.sections.DC.set ){


        x = loc.jb_box.x;
        y = loc.jb_box.y;

        rect(
            [x,y],
            [size.jb_box.w,size.jb_box.h],
            'box'
        );

        x = loc.array.x;
        y = loc.array.y;

        for( var i in _.range(system.DC.string_num)) {
            var offset = size.wire_offset.min + ( size.wire_offset.base * i );

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
                [ loc.discbox.x-offset , y-offset],
                [ loc.discbox.x-offset , loc.discbox.y+size.discbox.h/2-size.terminal_diam],
                [ loc.discbox.x-offset , loc.discbox.y+size.discbox.h/2-size.terminal_diam-size.terminal_diam*3],
            ]);
            block( 'terminal', {
                x: loc.discbox.x-offset,
                y: loc.discbox.y+size.discbox.h/2-size.terminal_diam
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
                [ loc.discbox.x+offset , y+offset],
                [ loc.discbox.x+offset , loc.discbox.y+size.discbox.h/2-size.terminal_diam],
                [ loc.discbox.x+offset , loc.discbox.y+size.discbox.h/2-size.terminal_diam-size.terminal_diam*3],
            ]);
            block( 'terminal', {
                x: loc.discbox.x+offset,
                y: loc.discbox.y+size.discbox.h/2-size.terminal_diam
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
        //offset = size.wire_offset.gap + size.wire_offset.ground;
        offset = size.wire_offset.ground;

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
            [ loc.discbox.x+offset , y+offset],
            [ loc.discbox.x+offset , loc.discbox.y+size.discbox.h/2-size.terminal_diam],
            [ loc.discbox.x+offset , loc.discbox.y+size.discbox.h/2-size.terminal_diam-size.terminal_diam*3],
        ]);
        block( 'terminal', {
            x: loc.discbox.x+offset,
            y: loc.discbox.y+size.discbox.h/2-size.terminal_diam
        });
        layer();


    ///////////////////////////////
        // DC disconect
        rect(
            [loc.discbox.x, loc.discbox.y],
            [size.discbox.w,size.discbox.h],
            'box'
        );

        // DC disconect combiner lines

        x = loc.discbox.x;
        y = loc.discbox.y + size.discbox.h/2;

        if( system.DC.string_num > 1){
            var offset_min = size.wire_offset.min;
            var offset_max = size.wire_offset.min + ( (system.DC.string_num-1) * size.wire_offset.base );
            line([
                [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
                [ x-offset_max, y-size.terminal_diam-size.terminal_diam*3],
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

        //offset = offset_max - offset_min;
        offset = size.wire_offset.min;

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
        //offset = size.wire_offset.gap + size.wire_offset.ground;
        offset = size.wire_offset.ground;
        line([
            [ x+offset, y-size.terminal_diam-size.terminal_diam*3],
            [ x+offset, loc.inverter.y+size.inverter.h/2-size.terminal_diam ],
        ],'DC_ground')
        block( 'terminal', {
            x: x+offset,
            y: loc.inverter.y+size.inverter.h/2-size.terminal_diam,
        });
    
    }




///////////////////////////////
//#inverter

    if( settings.status.sections.inverter.set){
    
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
            




    }





//#AC_discconect

    if( settings.status.sections.AC.set ){




        x = loc.AC_disc.x;
        y = loc.AC_disc.y;
        padding = size.terminal_diam;

        layer('box');
        rect(
            [x, y],
            [size.AC_disc.w, size.AC_disc.h]
        );
        layer();


    //console.log('size:', [h,w])
    //console.log('location:', [x,y])
    //circ([x,y],5);



    //#AC load center
        var breaker_spacing = size.AC_loadcenter.breakers.spacing;

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

        padding = loc.AC_loadcenter.x - loc.AC_loadcenter.breakers.left - size.AC_loadcenter.breaker.w;

        y = loc.AC_loadcenter.breakers.top;
        y += size.AC_loadcenter.breakers.spacing/2;
        for( var i=0; i<size.AC_loadcenter.breakers.num; i++){
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
        x -= size.terminal_diam * (system.AC_conductors.length+1);
        y -= size.terminal_diam;

        var conduit_y = loc.AC_conduit.y;    
        padding = size.terminal_diam;
        //var AC_layer_names = ['AC_ground', 'AC_neutral', 'AC_L1', 'AC_L2', 'AC_L2'];

        //console.log(system.AC_conductors.length)

        for( var i=0; i < system.AC_conductors.length; i++ ){
            block('terminal', [x,y] );
            layer('AC_'+system.AC_conductors[i]);
            line([
                [x, y],
                [x, loc.AC_disc.bottom - padding*2 - padding*i  ],
                [loc.AC_disc.left, loc.AC_disc.bottom - padding*2 - padding*i ],
            ]);
            x += size.terminal_diam;
        }
        layer();

        x = loc.AC_disc.x;
        y = loc.AC_disc.y + size.AC_disc.h/2;
        y -= padding*2;

        if( system.AC_conductors.indexOf('ground')+1 ) {
            layer('AC_ground');
            line([
                [ x-size.AC_disc.w/2, y ],
                [ x+size.AC_disc.w/2+padding*2, y ],
                [ x+size.AC_disc.w/2+padding*2, conduit_y + breaker_spacing*2 ],
                [ loc.AC_loadcenter.left+padding*2, conduit_y + breaker_spacing*2 ],
                //[ loc.AC_loadcenter.left+padding*2, y ],
                //[ loc.AC_loadcenter.groundbar.x-padding, y ],
                //[ loc.AC_loadcenter.groundbar.x-padding, loc.AC_loadcenter.groundbar.y+size.AC_loadcenter.groundbar.h/2 ],
                [ loc.AC_loadcenter.left+padding*2, loc.AC_loadcenter.groundbar.y ],
                [ loc.AC_loadcenter.groundbar.x-size.AC_loadcenter.groundbar.w/2, loc.AC_loadcenter.groundbar.y ],
            ]);
        }

        if( system.AC_conductors.indexOf('neutral')+1 ) {
            y -= padding;
            layer('AC_neutral');
            line([
                [ x-size.AC_disc.w/2, y ],
                [ x+padding*3*2, y ],
                [ x+padding*3*2, conduit_y + breaker_spacing*1 ],
                [ loc.AC_loadcenter.neutralbar.x, conduit_y + breaker_spacing*1 ],
                [ loc.AC_loadcenter.neutralbar.x, 
                    loc.AC_loadcenter.neutralbar.y-size.AC_loadcenter.neutralbar.h/2 ],
            ]);
        }
            
        

        for( var i=1; i <= 3; i++ ) {
            if( system.AC_conductors.indexOf('L'+i)+1 ) {
                y -= padding;
                layer('AC_L'+i);
                line([
                    [ x-size.AC_disc.w/2, y ],
                    [ x+padding*3*(2-i), y ],
                    [ x+padding*3*(2-i), loc.AC_disc.switch_bottom ],
                ]);
                block('terminal', [ x-padding*(i-2)*3, loc.AC_disc.switch_bottom ] );
                block('terminal', [ x-padding*(i-2)*3, loc.AC_disc.switch_top ] );
                line([
                    [ x-padding*(i-2)*3, loc.AC_disc.switch_top ],
                    [ x-padding*(i-2)*3, conduit_y-breaker_spacing*(i-1) ],
                    [ loc.AC_loadcenter.breakers.left, conduit_y-breaker_spacing*(i-1) ],
                ]);

            }

        }



    }




// Wire table

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

var k = require('../lib/k/k.js')

var settings = {};

settings.status = {};
settings.system = {};
settings.select_registry = [];
settings.value_registry = [];

var system = settings.system;
system.wire_config_num = 5;
system.DC = {};
system.DC.module = {};

var config_options = settings.config_options = {};

settings.status.sections = {
    modules: {},
    array: {},
    DC: {},
    inverter: {},
    AC: {},
};

config_options.string_num_options = [1,2,3,4,5,6];
config_options.string_modules_options = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

config_options.AC_loadcenter_types = {
    '480/277V' : ['480V Wye', '480V Delta', '277V', '208V'],
    '240V' : ['240V', '120V'],
};

config_options.AC_types = {
    '120V'      : ['ground', 'neutral', 'L1' ],
    '240V'      : ['ground', 'neutral', 'L1', 'L2' ],
    '208V'      : ['ground', 'neutral', 'L1', 'L2' ],
    '277V'      : ['ground', 'neutral', 'L1' ],
    '480V Wye'  : ['ground', 'neutral', 'L1', 'L2', 'L3' ],
    '480V Delta': ['ground', 'L1', 'L2', 'L3' ],
};


config_options.inverters = {};

//config_options.inverters['SMA'] = {};
//config_options.inverters['SMA']['SI3000'] = {
//    make:'SMA',
//    model:'3000',
//
//    DC_voltageWindow_low: 150,
//    DC_voltageWindow_high: 350,
//    max_power: 3300,
//
//    AC_options: ['240','208'],
//
//};

//config_options.inverters['SMA']['SI2500'] = {
//    make:'SMA',
//    model:'2500',
//
//    DC_voltageWindow_low: 150,
//    DC_voltageWindow_high: 350,
//    max_power: 2900,
//
//    AC_options: ['240','208'],
//
//};




config_options.DC_homerun_legths = [25,50,75,100];

system.inverter = {};


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
    base: 7,
    gap: size.module.w,
};
size.wire_offset.min = size.wire_offset.base * 1;

size.string = {};
size.string.gap = size.module.frame.w/42;
size.string.gap_missing = size.string.gap + size.module.frame.w;
size.string.h = (size.module.h * 4) + (size.string.gap * 2) + size.string.gap_missing;
size.string.w = size.module.frame.w * 2.5;

size.terminal_diam = 5;
size.fuse = {};
size.fuse.w = 15;
size.fuse.h = 4;






// Inverter
size.inverter = { w: 250, h: 150 };
size.inverter.text_gap = 15;
size.inverter.symbol_w = 50;
size.inverter.symbol_h = 25;

loc.inverter = { 
    x: size.drawing.w/2,
    y: size.drawing.h/3,
};
loc.inverter.bottom = loc.inverter.y + size.inverter.h/2;
loc.inverter.top = loc.inverter.y - size.inverter.h/2;
loc.inverter.bottom_right = {
    x: loc.inverter.x + size.inverter.w/2,
    y: loc.inverter.y + size.inverter.h/2,
};

// array
loc.array = { 
    x: loc.inverter.x - 200,
    y:600
};
loc.array.upper = loc.array.y - size.string.h/2;
loc.array.lower = loc.array.upper + size.string.h;
loc.array.right = loc.array.x - size.module.frame.h*3;

loc.DC = loc.array;

// DC jb
size.jb_box = {
    h: 150,
    w: 80,
};
loc.jb_box = {
    x: loc.array.x + size.jb_box.w/2,
    y: loc.array.y + size.jb_box.h/10,
};

// DC diconect
size.discbox = {
    w: 140,
    h: 50,
};
loc.discbox = {
    x: loc.inverter.x - size.inverter.w/2 + size.discbox.w/2,
    y: loc.inverter.y + size.inverter.h/2 + size.discbox.h/2 + 10,
}

// AC diconect
size.AC_disc = { w: 80, h: 125 };

loc.AC_disc = { 
    x: loc.inverter.x+200, 
    y: loc.inverter.y+250
};
loc.AC_disc.bottom = loc.AC_disc.y + size.AC_disc.h/2;
loc.AC_disc.top = loc.AC_disc.y - size.AC_disc.h/2;
loc.AC_disc.left = loc.AC_disc.x - size.AC_disc.w/2;
loc.AC_disc.switch_top = loc.AC_disc.top + 15;
loc.AC_disc.switch_bottom = loc.AC_disc.switch_top + 30;


// AC panel

loc.AC_loadcenter = {
    x: loc.inverter.x+350, 
    y: loc.inverter.y+100
};
size.AC_loadcenter = { w: 125, h: 300 }; 
loc.AC_loadcenter.left = loc.AC_loadcenter.x - size.AC_loadcenter.w/2;
loc.AC_loadcenter.top = loc.AC_loadcenter.y - size.AC_loadcenter.h/2;


size.AC_loadcenter.breaker = { w: 20, h: size.terminal_diam, };
loc.AC_loadcenter.breakers = {
    left: loc.AC_loadcenter.x - ( size.AC_loadcenter.breaker.w * 1.1 ),
};
size.AC_loadcenter.breakers = {
    num: 20,
    spacing: size.AC_loadcenter.breaker.h + 1,
};
loc.AC_loadcenter.breakers.top = loc.AC_loadcenter.top + size.AC_loadcenter.h/5;
loc.AC_loadcenter.breakers.bottom = loc.AC_loadcenter.breakers.top + size.AC_loadcenter.breakers.spacing*size.AC_loadcenter.breakers.num;


size.AC_loadcenter.neutralbar = { w:5, h:40 };
loc.AC_loadcenter.neutralbar = {
    x: loc.AC_loadcenter.left + 20, 
    y: loc.AC_loadcenter.y + size.AC_loadcenter.h*0.3 
};

size.AC_loadcenter.groundbar = { w:40, h:5 };
loc.AC_loadcenter.groundbar = {
    x: loc.AC_loadcenter.x + 10, 
    y: loc.AC_loadcenter.y + size.AC_loadcenter.h*0.45
};

loc.AC_conduit = { 
    y: loc.AC_loadcenter.breakers.bottom - size.AC_loadcenter.breakers.spacing/2,
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
            tables[title+"_fields"] = fields;
            need_fields = false;
        //} else {
        //    var entry = {};
        //    var line_array = line.split(',');
        //    fields.forEach( function(field, id){
        //        entry[field.trim()] = line_array[id].trim(); 
        //    });
        //    tables[title].push( entry );
        //}
        } else {
            var line_array = line.split(',');
            tables[title][line_array[0].trim()] = line_array[1].trim(); 
        }
    });

    return tables;
}



function loadComponents(string){
    var db = k.parseCSV(string);
    var object = {}    
    for( var i in db ){
        var component = db[i];
        if( object[component.Make] === undefined ){
            object[component.Make] = {};
        }
        if( object[component.Make][component.Model] === undefined ){
            object[component.Make][component.Model] = {};
        }

        var fields = k.objIdArray(component)
        fields.forEach( function( field ){
            var param = component[field];
            if( ! field in ['Make', 'Model'] && ! isNaN(parseFloat(param))){
                component[field] = parseFloat(param);
            }
        })
        object[component.Make][component.Model] = component;
    }
    return object;
}



module.exports.loadTables = loadTables;
module.exports.loadComponents = loadComponents;


},{"../lib/k/k.js":7}],6:[function(require,module,exports){
"use strict";

var k = require('../lib/k/k.js');
//var mk_drawing = require('./mk_drawing');
//var display_svg = require('./display_svg');

var update_system = function(settings) {
    //console.log('---settings---', settings);
    var config_options = settings.config_options;
    var system = settings.system;
    var loc = settings.drawing.loc;
    var size = settings.drawing.size;

    var show_defaults = false;
    if( settings.status.version_string === 'Dev'){
        show_defaults = true;
        
        system.DC.string_num = system.DC.string_num || 4;
        system.DC.string_modules = system.DC.string_modules || 6;
        system.DC.homerun_length = system.DC.homerun_length || 50;
        system.inverter.model = system.inverter.model || 'SI3000'; 
        system.AC_type = system.AC_type || '480V Delta';

        if( settings.status.data_loaded ){
            system.DC.module.make = system.DC.module.make || Object.keys( settings.config_options.modules )[0];
            if( system.DC.module.make) settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.modules[system.DC.module.make]);
            system.DC.module.model = system.DC.module.model || Object.keys( settings.config_options.modules[system.DC.module.make] )[0];


            config_options.DC_homerun_AWG_options = k.objIdArray( config_options.NEC_tables["Ch 9 Table 8 Conductor Properties"] );
            config_options.DC_homerun_AWG = config_options.DC_homerun_AWG || config_options.DC_homerun_AWG_options[config_options.DC_homerun_AWG_options.length-1];


        }
    }

    if( settings.status.data_loaded ){

        //system.DC.string_num = settings.system.string_num; 
        //system.DC.string_modules = settings.system.string_modules;
        //if( settings.config_options.modules !== undefined ){


        // Modules
        if( settings.status.sections.modules.ready){

            settings.config_options.moduleMakeArray = k.objIdArray(settings.config_options.modules);
            if( system.DC.module.make) settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.modules[system.DC.module.make]);
            if( system.DC.module.model ) system.DC.module.specs = settings.config_options.modules[system.DC.module.make][system.DC.module.model];







            if( system.DC.module.make !== '' && system.DC.module.model !== '' ){
                settings.status.sections.modules.set = true;
                settings.status.sections.array.ready = true;
            };
        }

        // Array
        if( settings.status.sections.array.ready){


            //system.module = settings.config_options.modules[settings.misc.module];
            if( settings.status.sections.array.set ){
                if( system.DC.module.specs ){
                    system.DC.array = {};
                    system.DC.array.Isc = system.DC.module.specs.Isc * system.DC.string_num;
                    system.DC.array.Voc = system.DC.module.specs.Voc * system.DC.string_modules;
                    system.DC.array.Imp = system.DC.module.specs.Imp * system.DC.string_num;
                    system.DC.array.Vmp = system.DC.module.specs.Vmp * system.DC.string_modules;
                    system.DC.array.Pmp = system.DC.array.Vmp * system.DC.array.Imp;

                }
            }


            if( system.DC.array !== undefined ){
                settings.status.sections.array.set = true;
                settings.status.sections.DC.ready = true;
            };
        }

        // DC
        if( settings.status.sections.DC.ready){


            config_options.DC_homerun_AWG_options = k.objIdArray( config_options.NEC_tables["Ch 9 Table 8 Conductor Properties"] );

            if( false ){
                settings.status.sections.DC.set = true;
                settings.status.sections.inverter.ready = true;
            };
        }

        
        // Inverter
        if( settings.status.sections.inverter.ready){

            settings.config_options.inverterMakeArray = k.objIdArray(settings.config_options.inverters);
            system.inverter.make = system.inverter.make || Object.keys( settings.config_options.inverters )[0];
            settings.config_options.inverterModelArray = k.objIdArray(settings.config_options.inverters[system.inverter.make]);
            system.inverter.model = system.inverter.model || Object.keys( settings.config_options.inverters[system.inverter.make] )[0];
            system.inverter.specs = settings.config_options.inverters[system.inverter.make][system.inverter.model];


            if( false ){
                settings.status.sections.inverter.set = true;
                settings.status.sections.AC.ready = true;
            };
        }


        // AC
        if( settings.status.sections.AC.ready){


            config_options.AC_loadcenter_type_options = k.objIdArray( config_options.AC_loadcenter_types );
            config_options.AC_type_options = k.objIdArray( config_options.AC_types );
            system.AC_loadcenter_type = system.AC_loadcenter_type || config_options.AC_loadcenter_type_options[0];
            system.AC_types_availible = config_options.AC_loadcenter_types[system.AC_loadcenter_type];
            config_options.AC_type_options.forEach( function( elem, id ){
                if( ! elem in system.AC_types_availible ) {
                    config_options.AC_type_options.splice(id, 1);
                }

            })

            system.AC_type = settings.system.AC_type;

            system.AC_conductors = settings.config_options.AC_types[system.AC_type];



            if( false ){
                settings.status.sections.AC.set = true;
                //settings.status.sections.AC.ready = true;
            };
        }







        size.wire_offset.max = size.wire_offset.min + system.DC.string_num * size.wire_offset.base;
        size.wire_offset.ground = size.wire_offset.max + size.wire_offset.base*1;

        loc.array.left = loc.array.right - ( size.string.w * system.DC.string_num ) - ( size.module.frame.w*3/4 ) ;

        //return settings;
    }
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
                console.log('There was an error 400')
            }
            else {
                console.log('something else other than 200 was returned')
            }
        }
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

k.parseCSV = function(file_content) {
    var r = []
    var lines = file_content.split('\n');
    var header = lines.shift().split(',');
    header.forEach(function(elem, id){
        header[id] = elem.trim();
    });
    for(var l = 0, len = lines.length; l < len; l++){
        var line = lines[l];
        if(line.length > 0){
            var line_obj = {};
            line.split(',').forEach(function(item,i){
                line_obj[header[i]] = item.trim();
            });
            r.push(line_obj);
        }
    }
    return(r);
};

k.getCSV = function(URL, callback) {
    k.AJAX(URL, k.parseCSV() )
}

/*
$.ajaxSetup ({
    cache: false
})



k.get_JSON = function(URL, callback, string) {
//    var filename = URL.split('/').pop()
//    console.log(URL)
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
k.update_status_page = function(status_id, boot_time, string) {
    var status_div = document.getElementById(status_id)
    status_div.innerHTML = string
    status_div.innerHTML += ' | '

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
    console.log(obj_name)
    var str = '-' + obj_name + '-'
    max_level++
    level_indent = 2
    str = levels(obj, level_indent, str)
    console.log(str)
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
            
            
//            console.log(key,level)
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
    //        console.log(key, typeof(item))
            if( typeof(item) == 'object' ){
    //            ('<li>').text("&nbsp;".repeat(level) + key))
                ('<li>').text(key))
                subobj_ul.append(levels(item,level+1))
    //            console.log("&nbsp;".repeat(level) + key)
            } else {
    //            subobj_div.append('<span>').text("&nbsp;".repeat(level) + key+": "+ item)
    //            ('<li>').text("&nbsp;".repeat(level) + key +": "+ item))
                ('<li>').text(key +": "+ item))
    //            console.log("&nbsp;".repeat(level) + key+": "+ item)
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
                    console.log(a.join(','))
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
    console.log( length)
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
    console.log(moment().format('YYYY-MM-DD'))
    console.log(moment().fromNow())
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

    console.log(bar.width+'%')
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

var k = require('./k.js');
var kontainer = require('./kontainer');

var k_DOM = require('./k_DOM.js');
var wrapper_prototype = require('./wrapper_prototype');






var selector_prototype = {
    change: function(new_value){
        this.set_value();

        if( this.g_update !== undefined ){
            this.g_update();
        }
    },
    set_value: function(){
        if( this.elem.options[this.elem.selectedIndex] ){
            //console.log('selected_value', this.elem.options[this.elem.selectedIndex].value);
            var new_value = this.elem.options[this.elem.selectedIndex].value;
        }
        if( this.optionsKontainer.ready ) {
            //console.log('kontainer ready, setting to: ', new_value)
            this.kontainer.set(new_value);
        }
        return this;    
    },
    update: function(){
        //console.log('updating: ', this)
        this.update_options();
        this.set_value();
        return this;
    },
    update_options: function(){
        if( this.kontainer.ready ) {
            var current_value = this.kontainer.get();
        } else {
            var current_value = null; 
        }

        if( this.optionsKontainer.ready ) {
            var old_options = this.options;
            this.options = this.optionsKontainer.get();
            if( this.options instanceof Array ){
                this.options.unshift('');
                if( old_options !== this.options ){
                    if( this.options !== undefined && this.options instanceof Array) {
                        this.elem.innerHTML = '';
                        this.options.forEach(function(value,id){
                            var o = document.createElement('option');
                            o.value = value;
                            if( value === current_value ) {
                                o.selected = "selected";
                            }
                            //o.setAttribute('class', 'selector_option');
                            o.innerHTML = value;
                            var that = this;
                            this.elem.appendChild(o);
                        }, this);
                        var selector_obj = this;
                        this.elem.addEventListener('change', function(){
                            selector_obj.change();
                        }, false);
                        if( ! (this.options.indexOf(this.kontainer.get())+1) ){
                            this.set_value(this.options[0].value);
                        }
                    }
                }
            }
        }


        return this;
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
    s.elem= document.createElement('select');
    s.elem.setAttribute('class', 'selector_menu');
    
    return s;
};





var value_prototype = {
    update: function(){
        //console.log('running value update', this)
        /*
        if( this.g_update !== undefined ){
            this.g_update();
        }
        */
        if( typeof this.kontainer !== 'undefined' ){
            this.value = this.kontainer.get();
            //console.log('updating value', this.value)
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
    click: function(clickFunction){
        console.log('setting click to ', typeof clickFunction, clickFunction)
        this.elem.addEventListener("click", function(){ clickFunction(); }, false);
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
var version_string = "Dev_branch"

var _ = require('underscore');
var moment = require('moment');
var k = require('./lib/k/k.js');
var k_data = require('./lib/k/k_data.js');
var $ = require('./lib/k/k_DOM');

var settings = require('./app/settings.js');
var loadTables = require('./app/settings_functions').loadTables;
var loadModules = require('./app/settings_functions').loadModules;
var loadComponents = require('./app/settings_functions').loadComponents;
var mk_drawing = require('./app/mk_drawing.js');
var display_svg = require('./app/display_svg.js');
var update_system = require('./app/update_system');

var components = settings.components;
var system = settings.system;

settings.status.version_string = version_string;

/*
function lookupLocation(position){
    var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude+','+position.coords.longitude+'&sensor=true';
    k.AJAX(url, showLocation);
}
function showLocation(location_json){
    var location = JSON.parse(location_json);
    location.results[0].address_components.forEach( function(component){
        if( component.types[0] === "locality" ) {
            system.city = component.long_name ;
            //console.log('city ', system.city) 
        } else if( component.types[0] === "administrative_area_level_2" ){
            system.county = component.long_name ;
            //console.log('county ', system.county)
        }
    });
    update_system(settings);
}
*/

function update(){
    console.log('updating');

    update_system(settings);

    settings.select_registry.forEach(function(item){
        item.update(); 
    });

    //update_system(settings);

    settings.value_registry.forEach(function(item){
        item.update(); 
    });

    // Make drawing
    settings.elements = mk_drawing(settings);
    // Add drawing elements to SVG on screen
    display_svg(settings, svg_container);

    console.log('settings', settings)
}


//k.AJAX('data/tables.txt', loadTables, settings);
k.AJAX('data/tables.txt', ready, {type:'loadTables'});

//k.AJAX( 'data/modules.csv', loadModules, settings );
k.AJAX( 'data/modules.csv', ready, {type:'loadModules'});
k.AJAX( 'data/inverters.csv', ready, {type:'inverters'});



var ready_count = 0;
function ready(input, config){

    if( config.type === 'loadTables'){
        settings.config_options.NEC_tables = loadTables(input);
        ready_count++;
    }
    if( config.type === 'loadModules'){
        settings.config_options.modules = loadComponents(input);
        ready_count++;
    }
    if( config.type === 'inverters'){
        settings.config_options.inverters = loadComponents(input);
        ready_count++;
    }

    if( ready_count === 3 ){
        console.log('ready');
        settings.status.data_loaded = true;
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



var page_sections = {
    title: [
        $('span').html('Please select your system spec below').attr('class', 'sectionTitle'),
        $('span').html(' | '),
        //$('input').attr('type', 'button').attr('value', 'clear selections').click(window.location.reload),
        $('a').attr('href', 'javascript:window.location.reload()').html('clear selections'),
        /*
        $('span').html('IP location |'),
        $('span').html('City: '),
        $('value').setRef('system.city'),
        $('span').html(' | '),
        $('span').html('County: '),
        $('value').setRef('system.county'),
        $('br'),
        //*/
    ],
    modules: [
        $('span').html('Module').attr('class', 'sectionTitle'),
        $('span').html(' | '),
        $('span').html('Module make: '),
        //$('selector') .setOptionsRef( 'components.moduleMakeArray' ) .setRef('system.pv_make'),
        $('selector') .setOptionsRef( 'settings.config_options.moduleMakeArray' ) .setRef('system.DC.module.make'),
        $('span').html(' | '),
        $('span').html('Module model: '),
        //$('selector').setOptionsRef( 'components.moduleModelArray' ).setRef('system.pv_model'),
        $('selector').setOptionsRef( 'settings.config_options.moduleModelArray' ).setRef('system.DC.module.model'),
        $('br'),

    ],
    modules_params: [
        $('span').html('Pmp: '),
        $('value').setRef('system.DC.module.specs.Pmp'),
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
    ],
    array: [
        $('span').html('Array').attr('class', 'sectionTitle'),
        $('span').html(' | '),

        $('span').html('Number of strings: '),
        $('selector').setOptionsRef( 'config_options.string_num_options').setRef('system.DC.string_num'),
        $('span').html(' | '),
        $('span').html('Number of modules per string: '),
        $('selector').setOptionsRef( 'config_options.string_modules_options').setRef('system.DC.string_modules'),
        //$('span').html(' | '),
        $('br'),
                                    
        $('span').html('Pmp: '),
        $('value').setRef('system.DC.array.Pmp'),
        $('span').html(' | '),
        $('span').html('Isc: '),
        $('value').setRef('system.DC.array.Isc'),
        $('span').html(' | '),
        $('span').html('Voc: '),
        $('value').setRef('system.DC.array.Voc').setMax(600).attr('id', 'DC_volt'),,
        $('span').html(' | '),
        $('span').html('Imp: '),
        $('value').setRef('system.DC.array.Imp'),
        $('span').html(' | '),
        $('span').html('Vmp: '),
        $('value').setRef('system.DC.array.Vmp'),
    ],
    DC: [
        $('span').html('DC').attr('class', 'sectionTitle'),
        $('span').html(' | '),
        $('span').html('DC home run length (ft): '),
        $('selector').setOptionsRef('config_options.DC_homerun_legths').setRef('system.DC.homerun_length'),
        $('span').html(' | '),
        $('span').html('DC home run AWG: '),
        $('selector').setOptionsRef('config_options.DC_homerun_AWG_options').setRef('config_options.DC_homerun_AWG'),

    ],
    inverter: [
        $('span').html('Inverter').attr('class', 'sectionTitle'),
        $('span').html(' | '),

        $('span').html('Inverter make: '),
        //$('selector') .setOptionsRef( 'components.moduleMakeArray' ) .setRef('system.pv_make'),
        $('selector') .setOptionsRef( 'settings.config_options.inverterMakeArray' ) .setRef('system.inverter.make'),
        $('span').html(' | '),
        $('span').html('Inverter model: '),
        //$('selector').setOptionsRef( 'components.moduleModelArray' ).setRef('system.pv_model'),
        $('selector').setOptionsRef( 'settings.config_options.inverterModelArray' ).setRef('system.inverter.model'),

    ],
    AC: [
        $('span').html('AC').attr('class', 'sectionTitle'),
        $('span').html(' | '),

        $('span').html('AC loadcenter type: '),
        $('selector').setOptionsRef( 'config_options.AC_loadcenter_type_options').setRef('system.AC_loadcenter_type'),
        $('span').html('AC type: '),
        //$('selector').setOptionsRef( 'config_options.AC_type_options').setRef('system.AC_type'),
        $('selector').setOptionsRef( 'system.AC_types_availible').setRef('system.AC_type'),
        $('br'),

    ],
}

var sections = settings.status.sections;

// Dev settings
if( version_string === 'Dev' && true ){
    for( var section in settings.status.sections ){
        settings.status.sections[section].ready = true;
        settings.status.sections[section].set = true;
    };
} else {
    settings.status.sections.modules.ready = true;
}
////////


function show_section(section){
    var selection_container = $('div').attr('class', 'system_section').appendTo(system_container);
    selection_container.attr('id', section );
    selection_container.elem.style.width = settings.drawing.size.drawing.w.toString() + 'px';
    page_sections[section].forEach( function(kelem){
        kelem.appendTo(selection_container);
        if( kelem.type === 'selector' ){
            kelem.setRefObj(settings);
            kelem.setUpdate(update);
            settings.select_registry.push(kelem);
            kelem.update(); 
        } else if( kelem.type === 'value' ){
            kelem.setRefObj(settings);
            //kelem.setUpdate(update_system);
            settings.value_registry.push(kelem);
        }
    });
}


show_section('title');
if( sections.modules.ready ) show_section('modules');
if( sections.modules.set ) show_section('modules_params');



var boot_time = moment();
var status_id = "status";
setInterval(function(){ k.update_status_page(status_id, boot_time, version_string);},1000);

console.log('settings', settings);
console.log('window', window);

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

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wdl9zeXNfZGV2L2FwcC9kaXNwbGF5X3N2Zy5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wdl9zeXNfZGV2L2FwcC9sYXllcnMuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcHZfc3lzX2Rldi9hcHAvbWtfZHJhd2luZy5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wdl9zeXNfZGV2L2FwcC9zZXR0aW5ncy5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wdl9zeXNfZGV2L2FwcC9zZXR0aW5nc19mdW5jdGlvbnMuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcHZfc3lzX2Rldi9hcHAvdXBkYXRlX3N5c3RlbS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wdl9zeXNfZGV2L2xpYi9rL2suanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcHZfc3lzX2Rldi9saWIvay9rX0RPTS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wdl9zeXNfZGV2L2xpYi9rL2tfRE9NX2V4dHJhLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3B2X3N5c19kZXYvbGliL2sva19kYXRhLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3B2X3N5c19kZXYvbGliL2sva29udGFpbmVyLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3B2X3N5c19kZXYvbGliL2svd3JhcHBlcl9wcm90b3R5cGUuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcHZfc3lzX2Rldi9tYWluLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3B2X3N5c19kZXYvbm9kZV9tb2R1bGVzL21vbWVudC9tb21lbnQuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcHZfc3lzX2Rldi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS91bmRlcnNjb3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDemtDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGxvZyA9IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XG4vL3ZhciBzZXR0aW5ncyA9IHJlcXVpcmUoJy4vc2V0dGluZ3MuanMnKTtcbi8vdmFyIHNuYXBzdmcgPSByZXF1aXJlKCdzbmFwc3ZnJyk7XG4vL2xvZyhzZXR0aW5ncyk7XG5cblxuXG52YXIgZGlzcGxheV9zdmcgPSBmdW5jdGlvbihzZXR0aW5ncywgY29udGFpbmVyKXtcbiAgICBsb2coJ2Rpc3BsYXlpbmcgc3ZnJyk7XG4gICAgdmFyIGxfYXR0ciA9IHNldHRpbmdzLmRyYXdpbmcubF9hdHRyO1xuICAgIHZhciBmb250cyA9IHNldHRpbmdzLmRyYXdpbmcuZm9udHM7XG4gICAgdmFyIGVsZW1lbnRzID0gc2V0dGluZ3MuZWxlbWVudHM7XG4gICAgLy9sb2coJ2VsZW1lbnRzOiAnLCBlbGVtZW50cyk7XG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICAgIC8vY29udGFpbmVyLmVtcHR5KClcblxuICAgIC8vdmFyIHN2Z19lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ1N2Z2pzU3ZnMTAwMCcpXG4gICAgdmFyIHN2Z19lbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3N2ZycpO1xuICAgIHN2Z19lbGVtLnNldEF0dHJpYnV0ZSgnaWQnLCdzdmdfZHJhd2luZycpO1xuICAgIHN2Z19lbGVtLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBzZXR0aW5ncy5kcmF3aW5nLnNpemUuZHJhd2luZy53KTtcbiAgICBzdmdfZWxlbS5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHNldHRpbmdzLmRyYXdpbmcuc2l6ZS5kcmF3aW5nLmgpO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzdmdfZWxlbSk7XG4gICAgLy92YXIgc3ZnID0gc25hcHN2ZyhzdmdfZWxlbSkuc2l6ZShzaXplLmRyYXdpbmcudywgc2l6ZS5kcmF3aW5nLmgpO1xuICAgIC8vdmFyIHN2ZyA9IHNuYXBzdmcoJyNzdmdfZHJhd2luZycpO1xuXG4gICAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgZHJhd2luZyBjb250ZW50cywgY2FsbCB0aGUgZnVuY3Rpb24gYmVsb3cuXG4gICAgZWxlbWVudHMuZm9yRWFjaCggZnVuY3Rpb24oZWxlbSxpZCkge1xuICAgICAgICBzaG93X2VsZW1fYXJyYXkoZWxlbSk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzaG93X2VsZW1fYXJyYXkoZWxlbSwgb2Zmc2V0KXtcbiAgICAgICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IHt4OjAseTowfTtcbiAgICAgICAgaWYoIHR5cGVvZiBlbGVtLnggIT09ICd1bmRlZmluZWQnICkgeyB2YXIgeCA9IGVsZW0ueCArIG9mZnNldC54OyB9IFxuICAgICAgICBpZiggdHlwZW9mIGVsZW0ueSAhPT0gJ3VuZGVmaW5lZCcgKSB7IHZhciB5ID0gZWxlbS55ICsgb2Zmc2V0Lnk7IH0gXG5cbiAgICAgICAgaWYoIGVsZW0udHlwZSA9PT0gJ3JlY3QnKSB7XG4gICAgICAgICAgICAvL3N2Zy5yZWN0KCBlbGVtLncsIGVsZW0uaCApLm1vdmUoIHgtZWxlbS53LzIsIHktZWxlbS5oLzIgKS5hdHRyKCBsX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApO1xuICAgICAgICAgICAgLy9sb2coJ2VsZW06JywgZWxlbSApO1xuICAgICAgICAgICAgLy9pZiggaXNOYU4oZWxlbS53KSApIHtcbiAgICAgICAgICAgIC8vICAgIGxvZygnZXJyb3I6IGVsZW0gbm90IGZ1bGx5IGRlZmluZWQnLCBlbGVtKVxuICAgICAgICAgICAgLy8gICAgZWxlbS53ID0gMTA7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIC8vaWYoIGlzTmFOKGVsZW0uaCkgKSB7XG4gICAgICAgICAgICAvLyAgICBsb2coJ2Vycm9yOiBlbGVtIG5vdCBmdWxseSBkZWZpbmVkJywgZWxlbSlcbiAgICAgICAgICAgIC8vICAgIGVsZW0uaCA9IDEwO1xuICAgICAgICAgICAgLy99XG4gICAgICAgICAgICB2YXIgciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdyZWN0Jyk7XG4gICAgICAgICAgICByLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBlbGVtLncpO1xuICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGVsZW0uaCk7XG4gICAgICAgICAgICByLnNldEF0dHJpYnV0ZSgneCcsIHgtZWxlbS53LzIpO1xuICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoJ3knLCB5LWVsZW0uaC8yKTtcbiAgICAgICAgICAgIHZhciBhdHRyID0gbF9hdHRyW2VsZW0ubGF5ZXJfbmFtZV07XG4gICAgICAgICAgICBmb3IoIHZhciBpMiBpbiBhdHRyICl7XG4gICAgICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoaTIsIGF0dHJbaTJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN2Z19lbGVtLmFwcGVuZENoaWxkKHIpO1xuICAgICAgICB9IGVsc2UgaWYoIGVsZW0udHlwZSA9PT0gJ2xpbmUnKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnRzMiA9IFtdO1xuICAgICAgICAgICAgZWxlbS5wb2ludHMuZm9yRWFjaCggZnVuY3Rpb24ocG9pbnQpe1xuICAgICAgICAgICAgICAgIGlmKCAhIGlzTmFOKHBvaW50WzBdKSAmJiAhIGlzTmFOKHBvaW50WzFdKSApe1xuICAgICAgICAgICAgICAgICAgICBwb2ludHMyLnB1c2goWyBwb2ludFswXStvZmZzZXQueCwgcG9pbnRbMV0rb2Zmc2V0LnkgXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nKCdlcnJvcjogZWxlbSBub3QgZnVsbHkgZGVmaW5lZCcsIGVsZW0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL3N2Zy5wb2x5bGluZSggcG9pbnRzMiApLmF0dHIoIGxfYXR0cltlbGVtLmxheWVyX25hbWVdICk7XG5cbiAgICAgICAgICAgIHZhciBsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3BvbHlsaW5lJyk7XG4gICAgICAgICAgICBsLnNldEF0dHJpYnV0ZSggJ3BvaW50cycsIHBvaW50czIuam9pbignICcpICk7XG4gICAgICAgICAgICB2YXIgYXR0ciA9IGxfYXR0cltlbGVtLmxheWVyX25hbWVdO1xuICAgICAgICAgICAgZm9yKCB2YXIgaTIgaW4gYXR0ciApe1xuICAgICAgICAgICAgICAgIGwuc2V0QXR0cmlidXRlKGkyLCBhdHRyW2kyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdmdfZWxlbS5hcHBlbmRDaGlsZChsKTtcbiAgICAgICAgfSBlbHNlIGlmKCBlbGVtLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICAgICAgLy92YXIgdCA9IHN2Zy50ZXh0KCBlbGVtLnN0cmluZ3MgKS5tb3ZlKCBlbGVtLnBvaW50c1swXVswXSwgZWxlbS5wb2ludHNbMF1bMV0gKS5hdHRyKCBsX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApXG4gICAgICAgICAgICB2YXIgZm9udCA9IGZvbnRzW2VsZW0uZm9udF07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3RleHQnKTtcbiAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCd4JywgeCk7XG4gICAgICAgICAgICAvL3Quc2V0QXR0cmlidXRlKCd5JywgeSArIGZvbnRbJ2ZvbnQtc2l6ZSddLzIgKTtcbiAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCd5JywgeSApO1xuICAgICAgICAgICAgaWYoZWxlbS5yb3RhdGVkKXtcbiAgICAgICAgICAgICAgICAvL3Quc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCBcInJvdGF0ZShcIiArIGVsZW0ucm90YXRlZCArIFwiIFwiICsgeCArIFwiIFwiICsgeSArIFwiKVwiICk7XG4gICAgICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsIFwicm90YXRlKFwiICsgZWxlbS5yb3RhdGVkICsgXCIgXCIgKyB4ICsgXCIgXCIgKyB5ICsgXCIpXCIgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciggdmFyIGkyIGluIGxfYXR0cltlbGVtLmxheWVyX25hbWVdICl7XG4gICAgICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoIGkyLCBsX2F0dHJbZWxlbS5sYXllcl9uYW1lXVtpMl0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciggdmFyIGkyIGluIGZvbnQgKXtcbiAgICAgICAgICAgICAgICB0LnNldEF0dHJpYnV0ZSggaTIsIGZvbnRbaTJdICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IoIHZhciBpMiBpbiBlbGVtLnN0cmluZ3MgKXtcbiAgICAgICAgICAgICAgICB2YXIgdHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAndHNwYW4nKTtcbiAgICAgICAgICAgICAgICB0c3Bhbi5zZXRBdHRyaWJ1dGUoJ2R5JywgZm9udFsnZm9udC1zaXplJ10qMS41KmkyICk7XG4gICAgICAgICAgICAgICAgdHNwYW4uc2V0QXR0cmlidXRlKCd4JywgeCk7XG4gICAgICAgICAgICAgICAgdHNwYW4uaW5uZXJIVE1MID0gZWxlbS5zdHJpbmdzW2kyXTtcbiAgICAgICAgICAgICAgICB0LmFwcGVuZENoaWxkKHRzcGFuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN2Z19lbGVtLmFwcGVuZENoaWxkKHQpO1xuICAgICAgICB9IGVsc2UgaWYoIGVsZW0udHlwZSA9PT0gJ2NpcmMnKSB7XG4gICAgICAgICAgICB2YXIgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdlbGxpcHNlJyk7XG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZSgncngnLCBlbGVtLmQvMik7XG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZSgncnknLCBlbGVtLmQvMik7XG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZSgnY3gnLCB4KTtcbiAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKCdjeScsIHkpO1xuICAgICAgICAgICAgdmFyIGF0dHIgPSBsX2F0dHJbZWxlbS5sYXllcl9uYW1lXTtcbiAgICAgICAgICAgIGZvciggdmFyIGkyIGluIGF0dHIgKXtcbiAgICAgICAgICAgICAgICBjLnNldEF0dHJpYnV0ZShpMiwgYXR0cltpMl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3ZnX2VsZW0uYXBwZW5kQ2hpbGQoYyk7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgYy5hdHRyaWJ1dGVzKCBsX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApXG4gICAgICAgICAgICBjLmF0dHJpYnV0ZXMoe1xuICAgICAgICAgICAgICAgIHJ4OiA1LFxuICAgICAgICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgcnk6IDUsXG4gICAgICAgICAgICAgICAgY3g6IGVsZW0ucG9pbnRzWzBdWzBdLWVsZW0uZC8yLFxuICAgICAgICAgICAgICAgIGN5OiBlbGVtLnBvaW50c1swXVsxXS1lbGVtLmQvMlxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHZhciBjMiA9IHN2Zy5lbGxpcHNlKCBlbGVtLnIsIGVsZW0uciApXG4gICAgICAgICAgICBjMi5tb3ZlKCBlbGVtLnBvaW50c1swXVswXS1lbGVtLmQvMiwgZWxlbS5wb2ludHNbMF1bMV0tZWxlbS5kLzIgKVxuICAgICAgICAgICAgYzIuYXR0cih7cng6NSwgcnk6NX0pXG4gICAgICAgICAgICBjMi5hdHRyKCBsX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApXG4gICAgICAgICAgICAqL1xuICAgICAgICB9IGVsc2UgaWYoZWxlbS50eXBlID09PSAnYmxvY2snKSB7XG4gICAgICAgICAgICAvLyBpZiBpdCBpcyBhIGJsb2NrLCBydW4gdGhpcyBmdW5jdGlvbiB0aHJvdWdoIGVhY2ggZWxlbWVudC5cbiAgICAgICAgICAgIGVsZW0uZWxlbWVudHMuZm9yRWFjaCggZnVuY3Rpb24oYmxvY2tfZWxlbSxpZCl7XG4gICAgICAgICAgICAgICAgc2hvd19lbGVtX2FycmF5KGJsb2NrX2VsZW0sIHt4OngsIHk6eX0pIFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZGlzcGxheV9zdmc7XG5cbiIsInZhciBsX2F0dHIgPSB7fTtcblxubF9hdHRyLmJhc2UgPSB7XG4gICAgJ2ZpbGwnOiAnbm9uZScsXG4gICAgJ3N0cm9rZSc6JyMwMDAwMDAnLFxuICAgICdzdHJva2Utd2lkdGgnOicxcHgnLFxuICAgICdzdHJva2UtbGluZWNhcCc6J2J1dHQnLFxuICAgICdzdHJva2UtbGluZWpvaW4nOidtaXRlcicsXG4gICAgJ3N0cm9rZS1vcGFjaXR5JzoxLFxuXG59O1xubF9hdHRyLmJsb2NrID0gT2JqZWN0LmNyZWF0ZShsX2F0dHIuYmFzZSk7XG5sX2F0dHIuZnJhbWUgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5mcmFtZS5zdHJva2UgPSAnIzAwMDA0Mic7XG5sX2F0dHIudGFibGUgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci50YWJsZS5zdHJva2UgPSAnIzAwMDA0Mic7XG5cbmxfYXR0ci5EQ19wb3MgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5EQ19wb3Muc3Ryb2tlID0gJyNmZjAwMDAnO1xubF9hdHRyLkRDX25lZyA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xubF9hdHRyLkRDX25lZy5zdHJva2UgPSAnIzAwMDAwMCc7XG5sX2F0dHIuRENfZ3JvdW5kID0gT2JqZWN0LmNyZWF0ZShsX2F0dHIuYmFzZSk7XG5sX2F0dHIuRENfZ3JvdW5kLnN0cm9rZSA9ICcjMDA2NjAwJztcbmxfYXR0ci5tb2R1bGUgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5ib3ggPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci50ZXh0ID0gT2JqZWN0LmNyZWF0ZShsX2F0dHIuYmFzZSk7XG5sX2F0dHIudGV4dC5zdHJva2UgPSAnIzAwMDBmZic7XG5sX2F0dHIudGVybWluYWwgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcblxubF9hdHRyLkFDX2dyb3VuZCA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xubF9hdHRyLkFDX2dyb3VuZC5zdHJva2UgPSAnR3JlZW4nO1xubF9hdHRyLkFDX25ldXRyYWwgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5BQ19uZXV0cmFsLnN0cm9rZSA9ICdHcmF5JztcbmxfYXR0ci5BQ19MMSA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xubF9hdHRyLkFDX0wxLnN0cm9rZSA9ICdCbGFjayc7XG5sX2F0dHIuQUNfTDIgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5BQ19MMi5zdHJva2UgPSAnUmVkJztcbmxfYXR0ci5BQ19MMyA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xubF9hdHRyLkFDX0wzLnN0cm9rZSA9ICdCbHVlJztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGxfYXR0cjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGsgPSByZXF1aXJlKCcuLi9saWIvay9rLmpzJyk7XG4vL3ZhciBzZXR0aW5ncyA9IHJlcXVpcmUoJy4vc2V0dGluZ3MuanMnKTtcbi8vdmFyIGxfYXR0ciA9IHNldHRpbmdzLmRyYXdpbmcubF9hdHRyO1xudmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG4vL2NvbnNvbGUubG9nKCdzZXR0aW5ncycsIHNldHRpbmdzKTtcbi8vIHNldHVwIGRyYXdpbmcgY29udGFpbmVyc1xudmFyIGxfYXR0ciA9IHJlcXVpcmUoJy4vbGF5ZXJzJyk7XG5cbnZhciBlbGVtZW50cyA9IFtdO1xuXG5cblxuLy8gQkxPQ0tTXG5cbnZhciBCbGsgPSB7XG4gICAgdHlwZTogJ2Jsb2NrJyxcbn07XG5CbGsubW92ZSA9IGZ1bmN0aW9uKHgsIHkpe1xuICAgIGZvciggdmFyIGkgaW4gdGhpcy5lbGVtZW50cyApe1xuICAgICAgICB0aGlzLmVsZW1lbnRzW2ldLm1vdmUoeCx5KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuQmxrLmFkZCA9IGZ1bmN0aW9uKCl7XG4gICAgaWYoIHR5cGVvZiB0aGlzLmVsZW1lbnRzID09ICd1bmRlZmluZWQnKXsgdGhpcy5lbGVtZW50cyA9IFtdO31cbiAgICBmb3IoIHZhciBpIGluIGFyZ3VtZW50cyl7XG4gICAgICAgIHRoaXMuZWxlbWVudHMucHVzaChhcmd1bWVudHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5CbGsucm90YXRlID0gZnVuY3Rpb24oZGVnKXtcbiAgICB0aGlzLnJvdGF0ZSA9IGRlZztcbn07XG5cbnZhciBibG9ja3MgPSB7fTtcbnZhciBibG9ja19hY3RpdmUgPSBmYWxzZTtcbi8vIENyZWF0ZSBkZWZhdWx0IGxheWVyLGJsb2NrIGNvbnRhaW5lciBhbmQgZnVuY3Rpb25zXG5cbi8vIExheWVyc1xuXG52YXIgbGF5ZXJfYWN0aXZlID0gZmFsc2U7XG5cbnZhciBsYXllciA9IGZ1bmN0aW9uKG5hbWUpeyAvLyBzZXQgY3VycmVudCBsYXllclxuICAgIGlmKCB0eXBlb2YgbmFtZSA9PT0gJ3VuZGVmaW5lZCcgKXsgLy8gaWYgbm8gbGF5ZXIgbmFtZSBnaXZlbiwgcmVzZXQgdG8gZGVmYXVsdCBcbiAgICAgICAgbGF5ZXJfYWN0aXZlID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmICggISAobmFtZSBpbiBsX2F0dHIpICkge1xuICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6IHVua25vd24gbGF5ZXIsIHVzaW5nIGJhc2UnKTtcbiAgICAgICAgbGF5ZXJfYWN0aXZlID0gJ2Jhc2UnIDtcbiAgICB9IGVsc2UgeyAvLyBmaW5hbHkgYWN0aXZhdGUgcmVxdWVzdGVkIGxheWVyXG4gICAgICAgIGxheWVyX2FjdGl2ZSA9IG5hbWU7XG4gICAgfVxuICAgIC8vKi9cbn07XG5cbi8qXG52YXIgYmxvY2sgPSBmdW5jdGlvbihuYW1lKSB7Ly8gc2V0IGN1cnJlbnQgYmxvY2tcbiAgICAvLyBpZiBjdXJyZW50IGJsb2NrIGhhcyBiZWVuIHVzZWQsIHNhdmUgaXQgYmVmb3JlIGNyZWF0aW5nIGEgbmV3IG9uZS5cbiAgICBpZiggYmxvY2tzW2Jsb2NrX2FjdGl2ZV0ubGVuZ3RoID4gMCApIHsgYmxvY2tzLnB1c2goYmxvY2tzW2Jsb2NrX2FjdGl2ZV0pOyB9XG4gICAgaWYoIHR5cGVvZiBuYW1lICE9PSAndW5kZWZpbmVkJyApeyAvLyBpZiBuYW1lIGFyZ3VtZW50IGlzIHN1Ym1pdHRlZCwgY3JlYXRlIG5ldyBibG9ja1xuICAgICAgICB2YXIgYmxrID0gT2JqZWN0LmNyZWF0ZShCbGspO1xuICAgICAgICBibGsubmFtZSA9IG5hbWU7IC8vIGJsb2NrIG5hbWVcbiAgICAgICAgYmxvY2tzW2Jsb2NrX2FjdGl2ZV0gPSBibGs7XG4gICAgfSBlbHNlIHsgLy8gZWxzZSB1c2UgZGVmYXVsdCBibG9ja1xuICAgICAgICBibG9ja3NbYmxvY2tfYWN0aXZlXSA9IGJsb2Nrc1swXTtcbiAgICB9XG59XG5ibG9jaygnZGVmYXVsdCcpOyAvLyBzZXQgY3VycmVudCBibG9jayB0byBkZWZhdWx0XG4qL1xudmFyIGJsb2NrX3N0YXJ0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgIGlmKCB0eXBlb2YgbmFtZSA9PT0gJ3VuZGVmaW5lZCcgKXsgLy8gaWYgbmFtZSBhcmd1bWVudCBpcyBzdWJtaXR0ZWRcbiAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiBuYW1lIHJlcXVpcmVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVE9ETzogV2hhdCBpZiB0aGUgc2FtZSBuYW1lIGlzIHN1Ym1pdHRlZCB0d2ljZT8gdGhyb3cgZXJyb3Igb3IgZml4P1xuICAgICAgICBibG9ja19hY3RpdmUgPSBuYW1lO1xuICAgICAgICBpZiggdHlwZW9mIGJsb2Nrc1tibG9ja19hY3RpdmVdICE9PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICB2YXIgYmxrID0gT2JqZWN0LmNyZWF0ZShCbGspO1xuICAgICAgICAgICAgLy9ibGsubmFtZSA9IG5hbWU7IC8vIGJsb2NrIG5hbWVcbiAgICAgICAgICAgIGJsb2Nrc1tibG9ja19hY3RpdmVdID0gYmxrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBibGs7XG4gICAgfVxufTtcblxuICAgIC8qXG4gICAgeCA9IGxvYy53aXJlX3RhYmxlLnggLSB3LzI7XG4gICAgeSA9IGxvYy53aXJlX3RhYmxlLnkgLSBoLzI7XG4gICAgaWYoIHR5cGVvZiBsYXllcl9uYW1lICE9PSAndW5kZWZpbmVkJyAmJiAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICkge1xuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSBsYXllcnNbbGF5ZXJfbmFtZV1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiggISAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICl7IGNvbnNvbGUubG9nKFwiZXJyb3IsIGxheWVyIGRvZXMgbm90IGV4aXN0LCB1c2luZyBjdXJyZW50XCIpO31cbiAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gIGxheWVyX2FjdGl2ZVxuICAgIH1cbiAgICAqL1xudmFyIGJsb2NrX2VuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBibGsgPSBibG9ja3NbYmxvY2tfYWN0aXZlXTtcbiAgICBibG9ja19hY3RpdmUgPSBmYWxzZTtcbiAgICByZXR1cm4gYmxrO1xufTtcblxuXG5cbi8vIGNsZWFyIGRyYXdpbmcgXG52YXIgY2xlYXJfZHJhd2luZyA9IGZ1bmN0aW9uKCkge1xuICAgIGZvciggdmFyIGlkIGluIGJsb2NrcyApe1xuICAgICAgICBpZiggYmxvY2tzLmhhc093blByb3BlcnR5KGlkKSl7XG4gICAgICAgICAgICBkZWxldGUgYmxvY2tzW2lkXTsgXG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxlbWVudHMubGVuZ3RoID0gMDtcbn07XG5cblxuLy8vLy8vXG4vLyBidWlsZCBwcm90b3R5cGUgZWxlbWVudFxuXG4gICAgLypcbiAgICBpZiggdHlwZW9mIGxheWVyX25hbWUgIT09ICd1bmRlZmluZWQnICYmIChsYXllcl9uYW1lIGluIGxheWVycykgKSB7XG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9IGxheWVyc1tsYXllcl9uYW1lXVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCAhIChsYXllcl9uYW1lIGluIGxheWVycykgKXsgY29uc29sZS5sb2coXCJlcnJvciwgbGF5ZXIgZG9lcyBub3QgZXhpc3QsIHVzaW5nIGN1cnJlbnRcIik7fVxuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSAgbGF5ZXJfYWN0aXZlXG4gICAgfVxuICAgICovXG5cblxudmFyIFN2Z0VsZW0gPSB7XG4gICAgb2JqZWN0OiAnU3ZnRWxlbSdcbn07XG5TdmdFbGVtLm1vdmUgPSBmdW5jdGlvbih4LCB5KXtcbiAgICBpZiggdHlwZW9mIHRoaXMucG9pbnRzICE9ICd1bmRlZmluZWQnICkge1xuICAgICAgICBmb3IoIHZhciBpIGluIHRoaXMucG9pbnRzICkge1xuICAgICAgICAgICAgdGhpcy5wb2ludHNbaV1bMF0gKz0geDtcbiAgICAgICAgICAgIHRoaXMucG9pbnRzW2ldWzFdICs9IHk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuU3ZnRWxlbS5yb3RhdGUgPSBmdW5jdGlvbihkZWcpe1xuICAgIHRoaXMucm90YXRlZCA9IGRlZztcbn07XG5cbi8vLy8vLy9cbi8vIGZ1bmN0aW9ucyBmb3IgYWRkaW5nIGVsZW1lbnRzXG5cbnZhciBhZGQgPSBmdW5jdGlvbih0eXBlLCBwb2ludHMsIGxheWVyX25hbWUpIHtcblxuICAgIGlmKCB0eXBlb2YgbGF5ZXJfbmFtZSA9PT0gJ3VuZGVmaW5lZCcgKSB7IGxheWVyX25hbWUgPSBsYXllcl9hY3RpdmU7IH0gXG4gICAgaWYoICEgKGxheWVyX25hbWUgaW4gbF9hdHRyKSApIHsgXG4gICAgICAgIGNvbnNvbGUubG9nKCdMYXllciBuYW1lIG5vdCBmb3VuZCwgdXNpbmcgYmFzZScpO1xuICAgICAgICBsYXllcl9uYW1lID0gJ2Jhc2UnOyBcbiAgICB9XG5cbiAgICBpZiggdHlwZW9mIHBvaW50cyA9PSAnc3RyaW5nJykge1xuICAgICAgICB2YXIgcG9pbnRzID0gcG9pbnRzLnNwbGl0KCcgJyk7XG4gICAgICAgIGZvciggdmFyIGkgaW4gcG9pbnRzICkge1xuICAgICAgICAgICAgcG9pbnRzW2ldID0gcG9pbnRzW2ldLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICBmb3IoIHZhciBjIGluIHBvaW50c1tpXSApIHtcbiAgICAgICAgICAgICAgICBwb2ludHNbaV1bY10gPSBOdW1iZXIocG9pbnRzW2ldW2NdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBlbGVtID0gT2JqZWN0LmNyZWF0ZShTdmdFbGVtKTtcbiAgICBlbGVtLnR5cGUgPSB0eXBlO1xuICAgIGVsZW0ubGF5ZXJfbmFtZSA9IGxheWVyX25hbWU7XG4gICAgaWYoIHR5cGUgPT09ICdsaW5lJyApIHtcbiAgICAgICAgZWxlbS5wb2ludHMgPSBwb2ludHM7XG4gICAgfSBlbHNlIGlmKCB0eXBlb2YgcG9pbnRzWzBdLnggPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGVsZW0ueCA9IHBvaW50c1swXVswXTsgXG4gICAgICAgIGVsZW0ueSA9IHBvaW50c1swXVsxXTsgXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbS54ID0gcG9pbnRzWzBdLng7XG4gICAgICAgIGVsZW0ueSA9IHBvaW50c1swXS55OyBcbiAgICB9XG5cbiAgICBcbiAgICBpZihibG9ja19hY3RpdmUpIHsgXG4gICAgICAgIGJsb2Nrc1tibG9ja19hY3RpdmVdLmFkZChlbGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50cy5wdXNoKGVsZW0pO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtO1xufTtcblxudmFyIGxpbmUgPSBmdW5jdGlvbihwb2ludHMsIGxheWVyKXsgLy8gKHBvaW50cywgW2xheWVyXSlcbiAgICAvL3JldHVybiBhZGQoJ2xpbmUnLCBwb2ludHMsIGxheWVyKVxuICAgIHZhciBsaW5lID0gIGFkZCgnbGluZScsIHBvaW50cywgbGF5ZXIpO1xuICAgIHJldHVybiBsaW5lO1xufTtcblxudmFyIHJlY3QgPSBmdW5jdGlvbihsb2MsIHNpemUsIGxheWVyKXtcbiAgICB2YXIgcmVjID0gYWRkKCdyZWN0JywgW2xvY10sIGxheWVyKTtcbiAgICByZWMudyA9IHNpemVbMF07XG4gICAgLypcbiAgICBpZiggdHlwZW9mIGxheWVyX25hbWUgIT09ICd1bmRlZmluZWQnICYmIChsYXllcl9uYW1lIGluIGxheWVycykgKSB7XG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9IGxheWVyc1tsYXllcl9uYW1lXVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCAhIChsYXllcl9uYW1lIGluIGxheWVycykgKXsgY29uc29sZS5sb2coXCJlcnJvciwgbGF5ZXIgZG9lcyBub3QgZXhpc3QsIHVzaW5nIGN1cnJlbnRcIik7fVxuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSAgbGF5ZXJfYWN0aXZlXG4gICAgfVxuICAgICovXG4gICAgcmVjLmggPSBzaXplWzFdO1xuICAgIHJldHVybiByZWM7XG59O1xuXG52YXIgY2lyYyA9IGZ1bmN0aW9uKGxvYywgZGlhbWV0ZXIsIGxheWVyKXtcbiAgICB2YXIgY2lyID0gYWRkKCdjaXJjJywgW2xvY10sIGxheWVyKTtcbiAgICBjaXIuZCA9IGRpYW1ldGVyO1xuICAgIHJldHVybiBjaXI7XG59O1xuXG52YXIgdGV4dCA9IGZ1bmN0aW9uKGxvYywgc3RyaW5ncywgZm9udCwgbGF5ZXIpe1xuICAgIHZhciB0eHQgPSBhZGQoJ3RleHQnLCBbbG9jXSwgbGF5ZXIpO1xuICAgIGlmKCB0eXBlb2Ygc3RyaW5ncyA9PSAnc3RyaW5nJyl7XG4gICAgICAgIHN0cmluZ3MgPSBbc3RyaW5nc107XG4gICAgfVxuICAgIHR4dC5zdHJpbmdzID0gc3RyaW5ncztcbiAgICB0eHQuZm9udCA9IGZvbnQ7XG4gICAgcmV0dXJuIHR4dDtcbn07XG5cbnZhciBibG9jayA9IGZ1bmN0aW9uKG5hbWUpIHsvLyBzZXQgY3VycmVudCBibG9ja1xuICAgIGlmKCBhcmd1bWVudHMubGVuZ3RoID09PSAyICl7IC8vIGlmIGNvb3IgaXMgcGFzc2VkXG4gICAgICAgIGlmKCB0eXBlb2YgYXJndW1lbnRzWzFdLnggIT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICB2YXIgeCA9IGFyZ3VtZW50c1sxXS54O1xuICAgICAgICAgICAgdmFyIHkgPSBhcmd1bWVudHNbMV0ueTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB4ID0gYXJndW1lbnRzWzFdWzBdO1xuICAgICAgICAgICAgdmFyIHkgPSBhcmd1bWVudHNbMV1bMV07XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYoIGFyZ3VtZW50cy5sZW5ndGggPT09IDMgKXsgLy8gaWYgeCx5IGlzIHBhc3NlZFxuICAgICAgICB2YXIgeCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgdmFyIHkgPSBhcmd1bWVudHNbMl07XG4gICAgfVxuXG4gICAgLy8gVE9ETzogd2hhdCBpZiBibG9jayBkb2VzIG5vdCBleGlzdD8gcHJpbnQgbGlzdCBvZiBibG9ja3M/XG4gICAgdmFyIGJsayA9IE9iamVjdC5jcmVhdGUoYmxvY2tzW25hbWVdKTtcbiAgICBibGsueCA9IHg7XG4gICAgYmxrLnkgPSB5O1xuXG4gICAgaWYoYmxvY2tfYWN0aXZlKXsgXG4gICAgICAgIGJsb2Nrc1tibG9ja19hY3RpdmVdLmFkZChibGspO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnRzLnB1c2goYmxrKTtcbiAgICAgICAgbF9hdHRyLkFDX2dyb3VuZCA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xuICAgICAgICBsX2F0dHIuQUNfZ3JvdW5kLnN0cm9rZSA9ICcjMDA2NjAwJztcblxuICAgIH1cbiAgICByZXR1cm4gYmxrO1xufTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbnZhciBta19kcmF3aW5nID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIHNldHRpbmdzLmRyYXdpbmcubF9hdHRyID0gbF9hdHRyO1xuICAgIC8vdmFyIGNvbXBvbmVudHMgPSBzZXR0aW5ncy5jb21wb25lbnRzO1xuICAgIC8vdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcbiAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuICAgIC8vY29uc29sZS5sb2coJy0tLXNldHRpbmdzLS0tJywgc2V0dGluZ3MpO1xuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nLnNpemU7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmcubG9jO1xuXG5cbiAgICBjbGVhcl9kcmF3aW5nKCk7XG5cbiAgICB2YXIgeCwgeSwgaCwgdztcblxuXG4vLyBEZWZpbmUgYmxvY2tzXG4vLyBtb2R1bGUgYmxvY2tcbiAgICB3ID0gc2l6ZS5tb2R1bGUuZnJhbWUudztcbiAgICBoID0gc2l6ZS5tb2R1bGUuZnJhbWUuaDtcblxuICAgIGJsb2NrX3N0YXJ0KCdtb2R1bGUnKTtcblxuICAgIC8vIGZyYW1lXG4gICAgbGF5ZXIoJ21vZHVsZScpO1xuICAgIHJlY3QoIFswLGgvMl0sIFt3LGhdICk7XG4gICAgLy8gZnJhbWUgdHJpYW5nbGU/XG4gICAgbGluZShbXG4gICAgICAgIFstdy8yLDBdLFxuICAgICAgICBbMCx3LzJdLFxuICAgIF0pO1xuICAgIGxpbmUoW1xuICAgICAgICBbMCx3LzJdLFxuICAgICAgICBbdy8yLDBdLFxuICAgIF0pO1xuICAgIC8vIGxlYWRzXG4gICAgbGF5ZXIoJ0RDX3BvcycpO1xuICAgIGxpbmUoW1xuICAgICAgICBbMCwgMF0sXG4gICAgICAgIFswLCAtc2l6ZS5tb2R1bGUubGVhZF1cbiAgICBdKTtcbiAgICBsYXllcignRENfbmVnJyk7XG4gICAgbGluZShbXG4gICAgICAgIFswLCBoXSxcbiAgICAgICAgWzAsIGgrKHNpemUubW9kdWxlLmxlYWQpXVxuICAgIF0pO1xuICAgIC8vIHBvcyBzaWduXG4gICAgbGF5ZXIoJ3RleHQnKTtcbiAgICB0ZXh0KFxuICAgICAgICBbc2l6ZS5tb2R1bGUubGVhZC8yLCAtc2l6ZS5tb2R1bGUubGVhZC8yXSxcbiAgICAgICAgJysnLFxuICAgICAgICAnc2lnbnMnXG4gICAgKTtcbiAgICAvLyBuZWcgc2lnblxuICAgIHRleHQoXG4gICAgICAgIFtzaXplLm1vZHVsZS5sZWFkLzIsIGgrc2l6ZS5tb2R1bGUubGVhZC8yXSxcbiAgICAgICAgJy0nLFxuICAgICAgICAnc2lnbnMnXG4gICAgKTtcbiAgICAvLyBncm91bmRcbiAgICBsYXllcignRENfZ3JvdW5kJyk7XG4gICAgbGluZShbXG4gICAgICAgIFstdy8yLCBoLzJdLFxuICAgICAgICBbLXcvMi13LzQsIGgvMl0sXG4gICAgXSk7XG5cbiAgICBsYXllcigpO1xuICAgIGJsb2NrX2VuZCgpO1xuXG4vLyNzdHJpbmdcbiAgICBibG9ja19zdGFydCgnc3RyaW5nJyk7XG5cbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcblxuICAgIHkgKz0gc2l6ZS5tb2R1bGUubGVhZDsgXG5cbiAgICAvL1RPRE86IGFkZCBsb29wIHRvIGp1bXAgb3ZlciBuZWdhdGl2ZSByZXR1cm4gd2lyZXMgXG4gICAgbGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgIGxpbmUoW1xuICAgICAgICBbeC1zaXplLm1vZHVsZS5mcmFtZS53KjMvNCwgeStzaXplLm1vZHVsZS5mcmFtZS5oLzJdLFxuICAgICAgICBbeC1zaXplLm1vZHVsZS5mcmFtZS53KjMvNCwgeStzaXplLnN0cmluZy5oICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLSBzaXplLm1vZHVsZS5sZWFkXSxcbiAgICAgICAgLy9beC1zaXplLm1vZHVsZS5mcmFtZS53KjMvNCwgeStzaXplLnN0cmluZy5oICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICBdKTtcbiAgICBsYXllcigpO1xuXG4gICAgYmxvY2soJ21vZHVsZScsIFt4LHldKTtcbiAgICB5ICs9IHNpemUubW9kdWxlLmggKyBzaXplLnN0cmluZy5nYXBfbWlzc2luZztcbiAgICBibG9jaygnbW9kdWxlJywgW3gseV0pO1xuICAgIHkgKz0gc2l6ZS5tb2R1bGUuaCArIHNpemUuc3RyaW5nLmdhcDtcbiAgICBibG9jaygnbW9kdWxlJywgW3gseV0pO1xuICAgIHkgKz0gc2l6ZS5tb2R1bGUuaCArIHNpemUuc3RyaW5nLmdhcDtcbiAgICBibG9jaygnbW9kdWxlJywgW3gseV0pO1xuXG4gICAgYmxvY2tfZW5kKCk7XG5cblxuLy8gdGVybWluYWxcbiAgICBibG9ja19zdGFydCgndGVybWluYWwnKTtcbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcblxuICAgIGxheWVyKCd0ZXJtaW5hbCcpO1xuICAgIGNpcmMoXG4gICAgICAgIFt4LHldLFxuICAgICAgICBzaXplLnRlcm1pbmFsX2RpYW1cbiAgICApO1xuICAgIGxheWVyKCk7XG4gICAgYmxvY2tfZW5kKCk7XG5cbi8vIGZ1c2VcblxuICAgIGJsb2NrX3N0YXJ0KCdmdXNlJyk7XG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG4gICAgdyA9IDEwO1xuICAgIGggPSA1O1xuXG4gICAgbGF5ZXIoJ3Rlcm1pbmFsJyk7XG4gICAgcmVjdChcbiAgICAgICAgW3gseV0sXG4gICAgICAgIFt3LGhdXG4gICAgKTtcbiAgICBsaW5lKCBbXG4gICAgICAgIFt3LzIseV0sXG4gICAgICAgIFt3LzIrc2l6ZS5mdXNlLncsIHldXG4gICAgXSk7XG4gICAgYmxvY2soJ3Rlcm1pbmFsJywgW3NpemUuZnVzZS53LCB5XSApO1xuXG4gICAgbGluZSggW1xuICAgICAgICBbLXcvMix5XSxcbiAgICAgICAgWy13LzItc2l6ZS5mdXNlLncsIHldXG4gICAgXSk7XG4gICAgYmxvY2soJ3Rlcm1pbmFsJywgWy1zaXplLmZ1c2UudywgeV0gKTtcblxuICAgIGxheWVyKCk7XG4gICAgYmxvY2tfZW5kKCk7XG5cbi8vIGdyb3VuZCBzeW1ib2xcbiAgICBibG9ja19zdGFydCgnZ3JvdW5kJyk7XG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG5cbiAgICBsYXllcignQUNfZ3JvdW5kJylcbiAgICBsaW5lKFtcbiAgICAgICAgW3gseV0sXG4gICAgICAgIFt4LHkrNDBdLFxuICAgIF0pXG4gICAgeSArPSAyNTtcbiAgICBsaW5lKFtcbiAgICAgICAgW3gtNy41LHldLFxuICAgICAgICBbeCs3LjUseV0sXG4gICAgXSlcbiAgICB5ICs9IDU7XG4gICAgbGluZShbXG4gICAgICAgIFt4LTUseV0sXG4gICAgICAgIFt4KzUseV0sXG4gICAgXSlcbiAgICB5ICs9IDU7XG4gICAgbGluZShbXG4gICAgICAgIFt4LTIuNSx5XSxcbiAgICAgICAgW3grMi41LHldLFxuICAgIF0pXG4gICAgbGF5ZXIoKTtcblxuICAgIGJsb2NrX2VuZCgpO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBGcmFtZVxuXG4gICAgdyA9IHNpemUuZHJhd2luZy53O1xuICAgIGggPSBzaXplLmRyYXdpbmcuaDtcbiAgICB2YXIgcGFkZGluZyA9IHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nOyBcblxuICAgIGxheWVyKCdmcmFtZScpO1xuXG4gICAgLy9ib3JkZXJcbiAgICByZWN0KCBbdy8yICwgaC8yXSwgW3cgLSBwYWRkaW5nKjIsIGggLSBwYWRkaW5nKjIgXSApO1xuICAgIFxuICAgIHggPSB3IC0gcGFkZGluZyAqIDM7XG4gICAgeSA9IHBhZGRpbmcgKiAzO1xuXG4gICAgdyA9IHNpemUuZHJhd2luZy50aXRsZWJveDtcbiAgICBoID0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94O1xuXG4gICAgLy8gYm94IHRvcC1yaWdodFxuICAgIHJlY3QoIFt4LXcvMiwgeStoLzJdLCBbdyxoXSApO1xuICAgIFxuICAgIHkgKz0gaCArIHBhZGRpbmc7IFxuXG4gICAgdyA9IHNpemUuZHJhd2luZy50aXRsZWJveDtcbiAgICBoID0gc2l6ZS5kcmF3aW5nLmggLSBwYWRkaW5nKjggLSBzaXplLmRyYXdpbmcudGl0bGVib3gqMi41O1xuICAgIFxuICAgIC8vdGl0bGUgYm94XG4gICAgcmVjdCggW3gtdy8yLCB5K2gvMl0sIFt3LGhdICk7XG5cbiAgICB2YXIgdGl0bGUgPSB7fTtcbiAgICB0aXRsZS50b3AgPSB5O1xuICAgIHRpdGxlLmJvdHRvbSA9IHkraDtcbiAgICB0aXRsZS5yaWdodCA9IHg7XG4gICAgdGl0bGUubGVmdCA9IHgtdyA7XG5cblxuICAgIC8vIGJveCBib3R0b20tcmlnaHRcbiAgICBoID0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94ICogMS41O1xuICAgIHkgPSB0aXRsZS5ib3R0b20gKyBwYWRkaW5nOyBcbiAgICByZWN0KCBbeC13LzIsIHkraC8yXSwgW3csaF0gKTtcbiAgICBcbiAgICB2YXIgcGFnZSA9IHt9O1xuICAgIHBhZ2UucmlnaHQgPSB0aXRsZS5yaWdodDtcbiAgICBwYWdlLmxlZnQgPSB0aXRsZS5sZWZ0O1xuICAgIHBhZ2UudG9wID0gdGl0bGUuYm90dG9tICsgcGFkZGluZztcbiAgICBwYWdlLmJvdHRvbSA9IHBhZ2UudG9wICsgc2l6ZS5kcmF3aW5nLnRpdGxlYm94KjEuNTtcbiAgICAvLyBUZXh0XG5cbiAgICB4ID0gdGl0bGUubGVmdCArIHBhZGRpbmc7XG4gICAgeSA9IHRpdGxlLmJvdHRvbSAtIHBhZGRpbmc7XG5cbiAgICB4ICs9IDEwO1xuICAgIHRleHQoW3gseV0sIFxuICAgICAgICAgWyBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSArIFwiIFwiICsgc3lzdGVtLmludmVydGVyLm1vZGVsICsgXCIgSW52ZXJ0ZXIgU3lzdGVtXCIgXSxcbiAgICAgICAgJ3RpdGxlMScsICd0ZXh0Jykucm90YXRlKC05MCk7XG5cbiAgICB4ICs9IDE0O1xuICAgIGlmKCB0eXBlb2Ygc3lzdGVtLkRDLm1vZHVsZS5zcGVjcyAhPT0gJ3VuZGVmaW5lZCcgKXtcbiAgICAgICAgdGV4dChbeCx5XSwgW1xuICAgICAgICAgICAgc3lzdGVtLkRDLm1vZHVsZS5zcGVjcy5NYWtlICsgXCIgXCIgKyBzeXN0ZW0uREMubW9kdWxlLnNwZWNzLk1vZGVsICsgXG4gICAgICAgICAgICAgICAgXCIgKFwiICsgc3lzdGVtLkRDLnN0cmluZ19udW0gICsgXCIgc3RyaW5ncyBvZiBcIiArIHN5c3RlbS5EQy5zdHJpbmdfbW9kdWxlcyArIFwiIG1vZHVsZXMgKVwiXG4gICAgICAgIF0sICd0aXRsZTInLCAndGV4dCcpLnJvdGF0ZSgtOTApO1xuICAgIH1cbiAgICAgICAgXG4gICAgeCA9IHBhZ2UubGVmdCArIHBhZGRpbmc7XG4gICAgeSA9IHBhZ2UudG9wICsgcGFkZGluZztcbiAgICB5ICs9IHNpemUuZHJhd2luZy50aXRsZWJveCAqIDEuNSAqIDMvNDtcblxuXG4gICAgdGV4dChbeCx5XSxcbiAgICAgICAgWydQVjEnXSxcbiAgICAgICAgJ3BhZ2UnLCAndGV4dCcpO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyNhcnJheVxuICAgIGlmKCBzZXR0aW5ncy5zdGF0dXMuc2VjdGlvbnMuYXJyYXkuc2V0ICl7XG5cbiAgICAgICAgeCA9IGxvYy5hcnJheS5yaWdodCAtIHNpemUuc3RyaW5nLnc7XG4gICAgICAgIHkgPSBsb2MuYXJyYXkueTtcbiAgICAgICAgeSAtPSBzaXplLnN0cmluZy5oLzI7XG5cbiAgICAgICAgLy9mb3IoIHZhciBpPTA7IGk8c3lzdGVtLkRDLnN0cmluZ19udW07IGkrKyApIHtcbiAgICAgICAgZm9yKCB2YXIgaSBpbiBfLnJhbmdlKHN5c3RlbS5EQy5zdHJpbmdfbnVtKSkge1xuICAgICAgICAgICAgLy92YXIgb2Zmc2V0ID0gaSAqIHNpemUud2lyZV9vZmZzZXQuYmFzZVxuICAgICAgICAgICAgdmFyIG9mZnNldF93aXJlID0gc2l6ZS53aXJlX29mZnNldC5taW4gKyAoIHNpemUud2lyZV9vZmZzZXQuYmFzZSAqIGkgKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYmxvY2soJ3N0cmluZycsIFt4LHldKTtcbiAgICAgICAgICAgIC8vIHBvc2l0aXZlIGhvbWUgcnVuXG4gICAgICAgICAgICBsYXllcignRENfcG9zJyk7XG4gICAgICAgICAgICBsaW5lKFtcbiAgICAgICAgICAgICAgICBbIHggLCBsb2MuYXJyYXkudXBwZXIgXSxcbiAgICAgICAgICAgICAgICBbIHggLCBsb2MuYXJyYXkudXBwZXItb2Zmc2V0X3dpcmUgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtvZmZzZXRfd2lyZSAsIGxvYy5hcnJheS51cHBlci1vZmZzZXRfd2lyZSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K29mZnNldF93aXJlICwgbG9jLmFycmF5Lnktb2Zmc2V0X3dpcmVdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmFycmF5LnggLCBsb2MuYXJyYXkueS1vZmZzZXRfd2lyZV0sXG4gICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgLy8gbmVnYXRpdmUgaG9tZSBydW5cbiAgICAgICAgICAgIGxheWVyKCdEQ19uZWcnKTtcbiAgICAgICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCAsIGxvYy5hcnJheS5sb3dlciBdLFxuICAgICAgICAgICAgICAgIFsgeCAsIGxvYy5hcnJheS5sb3dlcitvZmZzZXRfd2lyZSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K29mZnNldF93aXJlICwgbG9jLmFycmF5Lmxvd2VyK29mZnNldF93aXJlIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrb2Zmc2V0X3dpcmUgLCBsb2MuYXJyYXkueStvZmZzZXRfd2lyZV0sXG4gICAgICAgICAgICAgICAgWyBsb2MuYXJyYXkueCAsIGxvYy5hcnJheS55K29mZnNldF93aXJlXSxcbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICB4IC09IHNpemUuc3RyaW5nLnc7XG4gICAgICAgIH1cblxuICAgIC8vICAgIHJlY3QoXG4gICAgLy8gICAgICAgIFsgKGxvYy5hcnJheS5yaWdodCtsb2MuYXJyYXkubGVmdCkvMiwgKGxvYy5hcnJheS5sb3dlcitsb2MuYXJyYXkudXBwZXIpLzIgXSxcbiAgICAvLyAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQtbG9jLmFycmF5LmxlZnQsIGxvYy5hcnJheS5sb3dlci1sb2MuYXJyYXkudXBwZXIgXSxcbiAgICAvLyAgICAgICAgJ0RDX3BvcycpO1xuICAgIC8vICAgIFxuICAgICAgICBcbiAgICAgICAgbGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgICAgICBsaW5lKFtcbiAgICAgICAgICAgIC8vWyBsb2MuYXJyYXkubGVmdCAsIGxvYy5hcnJheS5sb3dlciArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgICAgICAgICBbIGxvYy5hcnJheS5sZWZ0LCBsb2MuYXJyYXkubG93ZXIgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLCBsb2MuYXJyYXkubG93ZXIgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLCBsb2MuYXJyYXkueSArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAgICAgICAgIFsgbG9jLmFycmF5LnggLCBsb2MuYXJyYXkueStzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZF0sXG4gICAgICAgIF0pO1xuXG4gICAgICAgIGxheWVyKCk7XG5cbiAgICAgICAgXG4gICAgfVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBjb21iaW5lciBib3hcblxuICAgIGlmKCBzZXR0aW5ncy5zdGF0dXMuc2VjdGlvbnMuREMuc2V0ICl7XG5cblxuICAgICAgICB4ID0gbG9jLmpiX2JveC54O1xuICAgICAgICB5ID0gbG9jLmpiX2JveC55O1xuXG4gICAgICAgIHJlY3QoXG4gICAgICAgICAgICBbeCx5XSxcbiAgICAgICAgICAgIFtzaXplLmpiX2JveC53LHNpemUuamJfYm94LmhdLFxuICAgICAgICAgICAgJ2JveCdcbiAgICAgICAgKTtcblxuICAgICAgICB4ID0gbG9jLmFycmF5Lng7XG4gICAgICAgIHkgPSBsb2MuYXJyYXkueTtcblxuICAgICAgICBmb3IoIHZhciBpIGluIF8ucmFuZ2Uoc3lzdGVtLkRDLnN0cmluZ19udW0pKSB7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5taW4gKyAoIHNpemUud2lyZV9vZmZzZXQuYmFzZSAqIGkgKTtcblxuICAgICAgICAgICAgbGF5ZXIoJ0RDX3BvcycpO1xuICAgICAgICAgICAgbGluZShbXG4gICAgICAgICAgICAgICAgWyB4ICwgeS1vZmZzZXRdLFxuICAgICAgICAgICAgICAgIFsgeCsoc2l6ZS5qYl9ib3gudykvMiAsIHktb2Zmc2V0XSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgICAgICB4OiB4KyhzaXplLmpiX2JveC53KS8yLFxuICAgICAgICAgICAgICAgIHk6IHktb2Zmc2V0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsaW5lKFtcbiAgICAgICAgICAgICAgICBbIHgrKHNpemUuamJfYm94LncpLzIgLCB5LW9mZnNldF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54LW9mZnNldCAsIHktb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngtb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbV0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54LW9mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgICAgIHg6IGxvYy5kaXNjYm94Lngtb2Zmc2V0LFxuICAgICAgICAgICAgICAgIHk6IGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBsYXllcignRENfbmVnJyk7XG4gICAgICAgICAgICBsaW5lKFtcbiAgICAgICAgICAgICAgICBbIHgsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIHgrc2l6ZS5qYl9ib3gudy8yLXNpemUuZnVzZS53LzIgLCB5K29mZnNldF0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIGJsb2NrKCAnZnVzZScsIHtcbiAgICAgICAgICAgICAgICB4OiB4K3NpemUuamJfYm94LncvMiAsXG4gICAgICAgICAgICAgICAgeTogeStvZmZzZXQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCtzaXplLmpiX2JveC53LzIrc2l6ZS5mdXNlLncvMiAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgeStvZmZzZXRdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueCtvZmZzZXQgLCBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIGJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICAgICAgeDogbG9jLmRpc2Nib3gueCtvZmZzZXQsXG4gICAgICAgICAgICAgICAgeTogbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsYXllcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9sYXllcignRENfZ3JvdW5kJyk7XG4gICAgICAgIC8vbGluZShbXG4gICAgICAgIC8vICAgIFsgbG9jLmFycmF5LmxlZnQgLCBsb2MuYXJyYXkubG93ZXIgKyBzaXplLm1vZHVsZS53ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgLy8gICAgWyBsb2MuYXJyYXkucmlnaHQrc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLCBsb2MuYXJyYXkubG93ZXIgKyBzaXplLm1vZHVsZS53ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgLy8gICAgWyBsb2MuYXJyYXkucmlnaHQrc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLCBsb2MuYXJyYXkueSArIHNpemUubW9kdWxlLncgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZF0sXG4gICAgICAgIC8vICAgIFsgbG9jLmFycmF5LnggLCBsb2MuYXJyYXkueStzaXplLm1vZHVsZS53K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAgICAgLy9dKTtcblxuICAgICAgICAvL2xheWVyKCk7XG5cbiAgICAgICAgLy8gR3JvdW5kXG4gICAgICAgIC8vb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5nYXAgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZDtcbiAgICAgICAgb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5ncm91bmQ7XG5cbiAgICAgICAgbGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgICAgICBsaW5lKFtcbiAgICAgICAgICAgIFsgeCAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgIFsgeCsoc2l6ZS5qYl9ib3gudykvMiAsIHkrb2Zmc2V0XSxcbiAgICAgICAgXSk7XG4gICAgICAgIGJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICB4OiB4KyhzaXplLmpiX2JveC53KS8yLFxuICAgICAgICAgICAgeTogeStvZmZzZXQsXG4gICAgICAgIH0pO1xuICAgICAgICBsaW5lKFtcbiAgICAgICAgICAgIFsgeCsoc2l6ZS5qYl9ib3gudykvMiAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueCtvZmZzZXQgLCB5K29mZnNldF0sXG4gICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbV0sXG4gICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgIF0pO1xuICAgICAgICBibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgeDogbG9jLmRpc2Nib3gueCtvZmZzZXQsXG4gICAgICAgICAgICB5OiBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtXG4gICAgICAgIH0pO1xuICAgICAgICBsYXllcigpO1xuXG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgIC8vIERDIGRpc2NvbmVjdFxuICAgICAgICByZWN0KFxuICAgICAgICAgICAgW2xvYy5kaXNjYm94LngsIGxvYy5kaXNjYm94LnldLFxuICAgICAgICAgICAgW3NpemUuZGlzY2JveC53LHNpemUuZGlzY2JveC5oXSxcbiAgICAgICAgICAgICdib3gnXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gREMgZGlzY29uZWN0IGNvbWJpbmVyIGxpbmVzXG5cbiAgICAgICAgeCA9IGxvYy5kaXNjYm94Lng7XG4gICAgICAgIHkgPSBsb2MuZGlzY2JveC55ICsgc2l6ZS5kaXNjYm94LmgvMjtcblxuICAgICAgICBpZiggc3lzdGVtLkRDLnN0cmluZ19udW0gPiAxKXtcbiAgICAgICAgICAgIHZhciBvZmZzZXRfbWluID0gc2l6ZS53aXJlX29mZnNldC5taW47XG4gICAgICAgICAgICB2YXIgb2Zmc2V0X21heCA9IHNpemUud2lyZV9vZmZzZXQubWluICsgKCAoc3lzdGVtLkRDLnN0cmluZ19udW0tMSkgKiBzaXplLndpcmVfb2Zmc2V0LmJhc2UgKTtcbiAgICAgICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeC1vZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICAgICAgWyB4LW9mZnNldF9tYXgsIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIF0sICdEQ19wb3MnKTtcbiAgICAgICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCtvZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICAgICAgWyB4K29mZnNldF9tYXgsIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIF0sICdEQ19uZWcnKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gSW52ZXJ0ZXIgY29uZWN0aW9uXG4gICAgICAgIC8vbGluZShbXG4gICAgICAgIC8vICAgIFsgeC1vZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgIC8vICAgIFsgeC1vZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgIC8vXSwnRENfcG9zJyk7XG5cbiAgICAgICAgLy9vZmZzZXQgPSBvZmZzZXRfbWF4IC0gb2Zmc2V0X21pbjtcbiAgICAgICAgb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5taW47XG5cbiAgICAgICAgLy8gbmVnXG4gICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgWyB4K29mZnNldCwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgWyB4K29mZnNldCwgbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtIF0sXG4gICAgICAgIF0sJ0RDX25lZycpXG4gICAgICAgIGJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICB4OiB4K29mZnNldCxcbiAgICAgICAgICAgIHk6IGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcG9zXG4gICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgWyB4LW9mZnNldCwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgWyB4LW9mZnNldCwgbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtIF0sXG4gICAgICAgIF0sJ0RDX3BvcycpXG4gICAgICAgIGJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICB4OiB4LW9mZnNldCxcbiAgICAgICAgICAgIHk6IGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZ3JvdW5kXG4gICAgICAgIC8vb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5nYXAgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZDtcbiAgICAgICAgb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5ncm91bmQ7XG4gICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgWyB4K29mZnNldCwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgWyB4K29mZnNldCwgbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtIF0sXG4gICAgICAgIF0sJ0RDX2dyb3VuZCcpXG4gICAgICAgIGJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICB4OiB4K29mZnNldCxcbiAgICAgICAgICAgIHk6IGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSxcbiAgICAgICAgfSk7XG4gICAgXG4gICAgfVxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyNpbnZlcnRlclxuXG4gICAgaWYoIHNldHRpbmdzLnN0YXR1cy5zZWN0aW9ucy5pbnZlcnRlci5zZXQpe1xuICAgIFxuICAgICAgICB5ID0gbG9jLmludmVydGVyLnk7XG5cblxuICAgICAgICAvL2ZyYW1lXG4gICAgICAgIGxheWVyKCdib3gnKTtcbiAgICAgICAgcmVjdChcbiAgICAgICAgICAgIFt4LHldLFxuICAgICAgICAgICAgW3NpemUuaW52ZXJ0ZXIudywgc2l6ZS5pbnZlcnRlci5oXVxuICAgICAgICApO1xuICAgICAgICAvLyBMYWJlbCBhdCB0b3AgKEludmVydGVyLCBtYWtlLCBtb2RlbCwgLi4uKVxuICAgICAgICBsYXllcigndGV4dCcpO1xuICAgICAgICB0ZXh0KFxuICAgICAgICAgICAgW2xvYy5pbnZlcnRlci54LCBsb2MuaW52ZXJ0ZXIudG9wICsgc2l6ZS5pbnZlcnRlci50ZXh0X2dhcCBdLFxuICAgICAgICAgICAgWyAnSW52ZXJ0ZXInLCBzZXR0aW5ncy5zeXN0ZW0uaW52ZXJ0ZXIubWFrZSArIFwiIFwiICsgc2V0dGluZ3Muc3lzdGVtLmludmVydGVyLm1vZGVsIF0sXG4gICAgICAgICAgICAnbGFiZWwnXG4gICAgICAgICk7XG4gICAgICAgIGxheWVyKCk7XG5cbiAgICAvLyNpbnZlcnRlciBzeW1ib2xcblxuICAgICAgICB4ID0gbG9jLmludmVydGVyLng7XG4gICAgICAgIHkgPSBsb2MuaW52ZXJ0ZXIueTtcbiAgICAgICAgXG4gICAgICAgIHZhciB3ID0gc2l6ZS5pbnZlcnRlci5zeW1ib2xfdztcbiAgICAgICAgdmFyIGggPSBzaXplLmludmVydGVyLnN5bWJvbF9oO1xuXG4gICAgICAgIHZhciBzcGFjZSA9IHcqMS8xMjtcblxuICAgICAgICAvLyBJbnZlcnRlciBzeW1ib2xcbiAgICAgICAgbGF5ZXIoJ2JveCcpO1xuXG4gICAgICAgIC8vIGJveFxuICAgICAgICByZWN0KFxuICAgICAgICAgICAgW3gseV0sXG4gICAgICAgICAgICBbdywgaF1cbiAgICAgICAgKTtcbiAgICAgICAgLy8gZGlhZ2FuYWxcbiAgICAgICAgbGluZShbXG4gICAgICAgICAgICBbeC13LzIsIHkraC8yXSxcbiAgICAgICAgICAgIFt4K3cvMiwgeS1oLzJdLFxuICAgICAgICBcbiAgICAgICAgXSk7XG4gICAgICAgIC8vIERDXG4gICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSwgXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlXSxcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNiwgXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlXSxcbiAgICAgICAgXSk7XG4gICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSwgXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlKjJdLFxuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSoyLCBcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIF0pO1xuICAgICAgICBsaW5lKFtcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqMywgXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlKjJdLFxuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSo0LCBcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIF0pO1xuICAgICAgICBsaW5lKFtcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNSwgXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlKjJdLFxuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSo2LCBcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIF0pO1xuXG4gICAgICAgIC8vIEFDXG4gICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSwgXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjIsIFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICBdKTtcbiAgICAgICAgbGluZShbXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjMsIFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSo0LCBcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgXSk7XG4gICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSo1LCBcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqNiwgXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgIF0pO1xuICAgICAgICBsYXllcigpO1xuICAgICAgICAgICAgXG5cblxuXG5cbiAgICB9XG5cblxuXG5cblxuLy8jQUNfZGlzY2NvbmVjdFxuXG4gICAgaWYoIHNldHRpbmdzLnN0YXR1cy5zZWN0aW9ucy5BQy5zZXQgKXtcblxuXG5cblxuICAgICAgICB4ID0gbG9jLkFDX2Rpc2MueDtcbiAgICAgICAgeSA9IGxvYy5BQ19kaXNjLnk7XG4gICAgICAgIHBhZGRpbmcgPSBzaXplLnRlcm1pbmFsX2RpYW07XG5cbiAgICAgICAgbGF5ZXIoJ2JveCcpO1xuICAgICAgICByZWN0KFxuICAgICAgICAgICAgW3gsIHldLFxuICAgICAgICAgICAgW3NpemUuQUNfZGlzYy53LCBzaXplLkFDX2Rpc2MuaF1cbiAgICAgICAgKTtcbiAgICAgICAgbGF5ZXIoKTtcblxuXG4gICAgLy9jb25zb2xlLmxvZygnc2l6ZTonLCBbaCx3XSlcbiAgICAvL2NvbnNvbGUubG9nKCdsb2NhdGlvbjonLCBbeCx5XSlcbiAgICAvL2NpcmMoW3gseV0sNSk7XG5cblxuXG4gICAgLy8jQUMgbG9hZCBjZW50ZXJcbiAgICAgICAgdmFyIGJyZWFrZXJfc3BhY2luZyA9IHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5zcGFjaW5nO1xuXG4gICAgICAgIHggPSBsb2MuQUNfbG9hZGNlbnRlci54O1xuICAgICAgICB5ID0gbG9jLkFDX2xvYWRjZW50ZXIueTtcbiAgICAgICAgdyA9IHNpemUuQUNfbG9hZGNlbnRlci53O1xuICAgICAgICBoID0gc2l6ZS5BQ19sb2FkY2VudGVyLmg7XG5cbiAgICAgICAgcmVjdChbeCx5XSxcbiAgICAgICAgICAgIFt3LGhdLFxuICAgICAgICAgICAgJ2JveCdcbiAgICAgICAgKTtcblxuICAgICAgICB0ZXh0KFt4LHktaCowLjRdLFxuICAgICAgICAgICAgW3N5c3RlbS5BQ19sb2FkY2VudGVyX3R5cGUsICdMb2FkIENlbnRlciddLFxuICAgICAgICAgICAgJ2xhYmVsJyxcbiAgICAgICAgICAgICd0ZXh0J1xuICAgICAgICApO1xuICAgICAgICB3ID0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIudztcbiAgICAgICAgaCA9IHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyLmg7XG5cbiAgICAgICAgcGFkZGluZyA9IGxvYy5BQ19sb2FkY2VudGVyLnggLSBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy5sZWZ0IC0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIudztcblxuICAgICAgICB5ID0gbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMudG9wO1xuICAgICAgICB5ICs9IHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5zcGFjaW5nLzI7XG4gICAgICAgIGZvciggdmFyIGk9MDsgaTxzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMubnVtOyBpKyspe1xuICAgICAgICAgICAgcmVjdChbeC1wYWRkaW5nLXcvMix5XSxbdyxoXSwnYm94Jyk7XG4gICAgICAgICAgICByZWN0KFt4K3BhZGRpbmcrdy8yLHldLFt3LGhdLCdib3gnKTtcbiAgICAgICAgICAgIHkgKz0gYnJlYWtlcl9zcGFjaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHMsIGw7XG4gICAgICAgIFxuICAgICAgICBsID0gbG9jLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhcjtcbiAgICAgICAgcyA9IHNpemUuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyO1xuICAgICAgICByZWN0KFtsLngsbC55XSwgW3MudyxzLmhdLCAnQUNfbmV1dHJhbCcgKTtcblxuICAgICAgICBsID0gbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyO1xuICAgICAgICBzID0gc2l6ZS5BQ19sb2FkY2VudGVyLmdyb3VuZGJhcjtcbiAgICAgICAgcmVjdChbbC54LGwueV0sIFtzLncscy5oXSwgJ0FDX2dyb3VuZCcgKTtcblxuICAgICAgICBibG9jaygnZ3JvdW5kJywgW2wueCxsLnkrcy5oLzJdKTtcblxuXG5cbiAgICAvLyBBQyBsaW5lc1xuXG4gICAgICAgIHggPSBsb2MuaW52ZXJ0ZXIuYm90dG9tX3JpZ2h0Lng7XG4gICAgICAgIHkgPSBsb2MuaW52ZXJ0ZXIuYm90dG9tX3JpZ2h0Lnk7XG4gICAgICAgIHggLT0gc2l6ZS50ZXJtaW5hbF9kaWFtICogKHN5c3RlbS5BQ19jb25kdWN0b3JzLmxlbmd0aCsxKTtcbiAgICAgICAgeSAtPSBzaXplLnRlcm1pbmFsX2RpYW07XG5cbiAgICAgICAgdmFyIGNvbmR1aXRfeSA9IGxvYy5BQ19jb25kdWl0Lnk7ICAgIFxuICAgICAgICBwYWRkaW5nID0gc2l6ZS50ZXJtaW5hbF9kaWFtO1xuICAgICAgICAvL3ZhciBBQ19sYXllcl9uYW1lcyA9IFsnQUNfZ3JvdW5kJywgJ0FDX25ldXRyYWwnLCAnQUNfTDEnLCAnQUNfTDInLCAnQUNfTDInXTtcblxuICAgICAgICAvL2NvbnNvbGUubG9nKHN5c3RlbS5BQ19jb25kdWN0b3JzLmxlbmd0aClcblxuICAgICAgICBmb3IoIHZhciBpPTA7IGkgPCBzeXN0ZW0uQUNfY29uZHVjdG9ycy5sZW5ndGg7IGkrKyApe1xuICAgICAgICAgICAgYmxvY2soJ3Rlcm1pbmFsJywgW3gseV0gKTtcbiAgICAgICAgICAgIGxheWVyKCdBQ18nK3N5c3RlbS5BQ19jb25kdWN0b3JzW2ldKTtcbiAgICAgICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgICAgIFt4LCB5XSxcbiAgICAgICAgICAgICAgICBbeCwgbG9jLkFDX2Rpc2MuYm90dG9tIC0gcGFkZGluZyoyIC0gcGFkZGluZyppICBdLFxuICAgICAgICAgICAgICAgIFtsb2MuQUNfZGlzYy5sZWZ0LCBsb2MuQUNfZGlzYy5ib3R0b20gLSBwYWRkaW5nKjIgLSBwYWRkaW5nKmkgXSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgeCArPSBzaXplLnRlcm1pbmFsX2RpYW07XG4gICAgICAgIH1cbiAgICAgICAgbGF5ZXIoKTtcblxuICAgICAgICB4ID0gbG9jLkFDX2Rpc2MueDtcbiAgICAgICAgeSA9IGxvYy5BQ19kaXNjLnkgKyBzaXplLkFDX2Rpc2MuaC8yO1xuICAgICAgICB5IC09IHBhZGRpbmcqMjtcblxuICAgICAgICBpZiggc3lzdGVtLkFDX2NvbmR1Y3RvcnMuaW5kZXhPZignZ3JvdW5kJykrMSApIHtcbiAgICAgICAgICAgIGxheWVyKCdBQ19ncm91bmQnKTtcbiAgICAgICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeC1zaXplLkFDX2Rpc2Mudy8yLCB5IF0sXG4gICAgICAgICAgICAgICAgWyB4K3NpemUuQUNfZGlzYy53LzIrcGFkZGluZyoyLCB5IF0sXG4gICAgICAgICAgICAgICAgWyB4K3NpemUuQUNfZGlzYy53LzIrcGFkZGluZyoyLCBjb25kdWl0X3kgKyBicmVha2VyX3NwYWNpbmcqMiBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIubGVmdCtwYWRkaW5nKjIsIGNvbmR1aXRfeSArIGJyZWFrZXJfc3BhY2luZyoyIF0sXG4gICAgICAgICAgICAgICAgLy9bIGxvYy5BQ19sb2FkY2VudGVyLmxlZnQrcGFkZGluZyoyLCB5IF0sXG4gICAgICAgICAgICAgICAgLy9bIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci54LXBhZGRpbmcsIHkgXSxcbiAgICAgICAgICAgICAgICAvL1sgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLngtcGFkZGluZywgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLnkrc2l6ZS5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci5oLzIgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLmxlZnQrcGFkZGluZyoyLCBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLngtc2l6ZS5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci53LzIsIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci55IF0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCBzeXN0ZW0uQUNfY29uZHVjdG9ycy5pbmRleE9mKCduZXV0cmFsJykrMSApIHtcbiAgICAgICAgICAgIHkgLT0gcGFkZGluZztcbiAgICAgICAgICAgIGxheWVyKCdBQ19uZXV0cmFsJyk7XG4gICAgICAgICAgICBsaW5lKFtcbiAgICAgICAgICAgICAgICBbIHgtc2l6ZS5BQ19kaXNjLncvMiwgeSBdLFxuICAgICAgICAgICAgICAgIFsgeCtwYWRkaW5nKjMqMiwgeSBdLFxuICAgICAgICAgICAgICAgIFsgeCtwYWRkaW5nKjMqMiwgY29uZHVpdF95ICsgYnJlYWtlcl9zcGFjaW5nKjEgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIueCwgY29uZHVpdF95ICsgYnJlYWtlcl9zcGFjaW5nKjEgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIueCwgXG4gICAgICAgICAgICAgICAgICAgIGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIueS1zaXplLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhci5oLzIgXSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgXG5cbiAgICAgICAgZm9yKCB2YXIgaT0xOyBpIDw9IDM7IGkrKyApIHtcbiAgICAgICAgICAgIGlmKCBzeXN0ZW0uQUNfY29uZHVjdG9ycy5pbmRleE9mKCdMJytpKSsxICkge1xuICAgICAgICAgICAgICAgIHkgLT0gcGFkZGluZztcbiAgICAgICAgICAgICAgICBsYXllcignQUNfTCcraSk7XG4gICAgICAgICAgICAgICAgbGluZShbXG4gICAgICAgICAgICAgICAgICAgIFsgeC1zaXplLkFDX2Rpc2Mudy8yLCB5IF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeCtwYWRkaW5nKjMqKDItaSksIHkgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB4K3BhZGRpbmcqMyooMi1pKSwgbG9jLkFDX2Rpc2Muc3dpdGNoX2JvdHRvbSBdLFxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIGJsb2NrKCd0ZXJtaW5hbCcsIFsgeC1wYWRkaW5nKihpLTIpKjMsIGxvYy5BQ19kaXNjLnN3aXRjaF9ib3R0b20gXSApO1xuICAgICAgICAgICAgICAgIGJsb2NrKCd0ZXJtaW5hbCcsIFsgeC1wYWRkaW5nKihpLTIpKjMsIGxvYy5BQ19kaXNjLnN3aXRjaF90b3AgXSApO1xuICAgICAgICAgICAgICAgIGxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbIHgtcGFkZGluZyooaS0yKSozLCBsb2MuQUNfZGlzYy5zd2l0Y2hfdG9wIF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeC1wYWRkaW5nKihpLTIpKjMsIGNvbmR1aXRfeS1icmVha2VyX3NwYWNpbmcqKGktMSkgXSxcbiAgICAgICAgICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy5sZWZ0LCBjb25kdWl0X3ktYnJlYWtlcl9zcGFjaW5nKihpLTEpIF0sXG4gICAgICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG5cblxuXG4vLyBXaXJlIHRhYmxlXG5cbiAgICB4ID0gbG9jLndpcmVfdGFibGUueDtcbiAgICB5ID0gbG9jLndpcmVfdGFibGUueTtcbiAgICB3ID0gc2l6ZS53aXJlX3RhYmxlLnc7XG4gICAgaCA9IHNpemUud2lyZV90YWJsZS5oO1xuICAgIHZhciByb3dfaCA9IHNpemUud2lyZV90YWJsZS5yb3dfaDtcbiAgICB2YXIgdG9wID0gbG9jLndpcmVfdGFibGUudG9wO1xuICAgIHZhciBib3R0b20gPSBsb2Mud2lyZV90YWJsZS5ib3R0b207XG4gICAgdmFyIGNvbHVtbl93aWR0aCA9IHtcbiAgICAgICAgbnVtYmVyOiAyNSxcbiAgICAgICAgd2lyZV9nYXVnZTogMjUsXG4gICAgICAgIHdpcmVfdHlwZTogNTAsXG4gICAgICAgIGNvbmR1aXRfZ2F1Z2U6IDI1LFxuICAgICAgICBjb25kdWl0X3R5cGU6IDUwLFxuICAgIH07XG5cbiAgICBsYXllcigndGFibGUnKTtcbiAgICByZWN0KCBbeCx5XSwgW3csaF0gKTtcblxuICAgIGxpbmUoW1xuICAgICAgICBbeC13LzIrMjUgLCB5LWgvMisoMSpyb3dfaCldLFxuICAgICAgICBbeCt3LzIgLCB5LWgvMisoMSpyb3dfaCldLFxuICAgIF0pO1xuXG4gICAgZm9yKCB2YXIgcj0yOyByPHN5c3RlbS53aXJlX2NvbmZpZ19udW0rMzsgcisrICkge1xuICAgIFxuICAgICAgICBsaW5lKFtcbiAgICAgICAgICAgIFt4LXcvMiAsIHktaC8yKyhyKnJvd19oKV0sXG4gICAgICAgICAgICBbeCt3LzIgLCB5LWgvMisocipyb3dfaCldLFxuICAgICAgICBdKTtcbiAgICB9XG4gICAgeCA9IGxvYy53aXJlX3RhYmxlLnggLSB3LzI7XG4gICAgeSA9IGxvYy53aXJlX3RhYmxlLnkgLSBoLzI7XG4gICAgeCArPSBjb2x1bW5fd2lkdGgubnVtYmVyO1xuXG4gICAgdmFyIGNfdyA9IGNvbHVtbl93aWR0aC53aXJlX2dhdWdlO1xuICAgIGxpbmUoWyBbeCx0b3BdLCBbeCxib3R0b20tcm93X2hdIF0pO1xuICAgIHRleHQoIFt4K2Nfdyx5K3Jvd19oKjAuNzVdLCAnV2lyZScsICd0YWJsZScsICd0ZXh0Jyk7XG4gICAgdGV4dCggW3grY193LzIseStyb3dfaCoxLjc1XSwgJ0FXRycsICd0YWJsZScsICd0ZXh0Jyk7XG4gICAgeCArPSBjX3c7XG5cbiAgICBjX3cgPSBjb2x1bW5fd2lkdGgud2lyZV90eXBlO1xuICAgIGxpbmUoWyBbeCx0b3Arcm93X2hdLCBbeCxib3R0b20tcm93X2hdIF0pO1xuICAgIHRleHQoIFt4K2Nfdy8yLHkrcm93X2gqMS43NV0sICdUeXBlJywgJ3RhYmxlJywgJ3RleHQnKTtcbiAgICB4ICs9IGNfdztcblxuICAgIGNfdyA9IGNvbHVtbl93aWR0aC5jb25kdWl0X2dhdWdlO1xuICAgIGxpbmUoWyBbeCx0b3BdLCBbeCxib3R0b20tcm93X2hdIF0pO1xuICAgIHRleHQoIFt4K2Nfdyx5K3Jvd19oKjAuNzVdLCAnQ29uZHVpdCcsICd0YWJsZScsICd0ZXh0Jyk7XG4gICAgdGV4dCggW3grY193LzIseStyb3dfaCoxLjc1XSwgJ1NpemUnLCAndGFibGUnLCAndGV4dCcpO1xuICAgIHggKz0gY193O1xuXG4gICAgbGluZShbIFt4LHRvcCtyb3dfaF0sIFt4LGJvdHRvbS1yb3dfaF0gXSk7XG4gICAgdGV4dCggW3grY193LzIseStyb3dfaCoxLjc1XSwgJ1R5cGUnLCAndGFibGUnLCAndGV4dCcpO1xuXG4gICAgeCA9IGxvYy53aXJlX3RhYmxlLnggLSB3LzI7XG4gICAgeSA9IGxvYy53aXJlX3RhYmxlLnkgLSBoLzI7XG5cbiAgICB4ICs9IGNvbHVtbl93aWR0aC5udW1iZXIvMjtcbiAgICB5ICs9IHJvd19oKjIgKyByb3dfaCowLjc1O1xuXG4gICAgZm9yKCB2YXIgcj0xOyByPD1zeXN0ZW0ud2lyZV9jb25maWdfbnVtOyByKysgKSB7XG4gICAgICAgIHRleHQoIFt4LHldLCBTdHJpbmcociksICd0YWJsZScsICd0ZXh0Jyk7XG5cblxuXG4gICAgICAgIHkgKz0gcm93X2g7XG4gICAgfVxuXG5cblxuLy8gdm9sdGFnZSBkcm9wXG4gICAgeCA9IGxvYy52b2x0X2Ryb3BfdGFibGUueDtcbiAgICB5ID0gbG9jLnZvbHRfZHJvcF90YWJsZS55O1xuICAgIHcgPSBzaXplLnZvbHRfZHJvcF90YWJsZS53O1xuICAgIGggPSBzaXplLnZvbHRfZHJvcF90YWJsZS5oO1xuXG4gICAgbGF5ZXIoJ3RhYmxlJyk7XG4gICAgcmVjdCggW3gseV0sIFt3LGhdICk7XG4gICAgXG4gICAgeSAtPSBoLzI7XG4gICAgeSArPSAxMFxuXG4gICAgdGV4dCggW3gseV0sICdWb2x0YWdlIERyb3AnLCAndGFibGUnLCAndGV4dCcpO1xuXG5cbi8vIGdlbmVyYWwgbm90ZXNcbiAgICB4ID0gbG9jLmdlbmVyYWxfbm90ZXMueDtcbiAgICB5ID0gbG9jLmdlbmVyYWxfbm90ZXMueTtcbiAgICB3ID0gc2l6ZS5nZW5lcmFsX25vdGVzLnc7XG4gICAgaCA9IHNpemUuZ2VuZXJhbF9ub3Rlcy5oO1xuXG4gICAgbGF5ZXIoJ3RhYmxlJyk7XG4gICAgcmVjdCggW3gseV0sIFt3LGhdICk7XG4gICAgXG4gICAgeSAtPSBoLzI7XG4gICAgeSArPSAxMFxuXG4gICAgdGV4dCggW3gseV0sICdHZW5lcmFsIE5vdGVzJywgJ3RhYmxlJywgJ3RleHQnKTtcblxuXG5cblxuXG5cbiAgICByZXR1cm4gZWxlbWVudHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBta19kcmF3aW5nO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrID0gcmVxdWlyZSgnLi4vbGliL2svay5qcycpXG5cbnZhciBzZXR0aW5ncyA9IHt9O1xuXG5zZXR0aW5ncy5zdGF0dXMgPSB7fTtcbnNldHRpbmdzLnN5c3RlbSA9IHt9O1xuc2V0dGluZ3Muc2VsZWN0X3JlZ2lzdHJ5ID0gW107XG5zZXR0aW5ncy52YWx1ZV9yZWdpc3RyeSA9IFtdO1xuXG52YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuc3lzdGVtLndpcmVfY29uZmlnX251bSA9IDU7XG5zeXN0ZW0uREMgPSB7fTtcbnN5c3RlbS5EQy5tb2R1bGUgPSB7fTtcblxudmFyIGNvbmZpZ19vcHRpb25zID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnMgPSB7fTtcblxuc2V0dGluZ3Muc3RhdHVzLnNlY3Rpb25zID0ge1xuICAgIG1vZHVsZXM6IHt9LFxuICAgIGFycmF5OiB7fSxcbiAgICBEQzoge30sXG4gICAgaW52ZXJ0ZXI6IHt9LFxuICAgIEFDOiB7fSxcbn07XG5cbmNvbmZpZ19vcHRpb25zLnN0cmluZ19udW1fb3B0aW9ucyA9IFsxLDIsMyw0LDUsNl07XG5jb25maWdfb3B0aW9ucy5zdHJpbmdfbW9kdWxlc19vcHRpb25zID0gWzEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDE4LDE5LDIwXTtcblxuY29uZmlnX29wdGlvbnMuQUNfbG9hZGNlbnRlcl90eXBlcyA9IHtcbiAgICAnNDgwLzI3N1YnIDogWyc0ODBWIFd5ZScsICc0ODBWIERlbHRhJywgJzI3N1YnLCAnMjA4ViddLFxuICAgICcyNDBWJyA6IFsnMjQwVicsICcxMjBWJ10sXG59O1xuXG5jb25maWdfb3B0aW9ucy5BQ190eXBlcyA9IHtcbiAgICAnMTIwVicgICAgICA6IFsnZ3JvdW5kJywgJ25ldXRyYWwnLCAnTDEnIF0sXG4gICAgJzI0MFYnICAgICAgOiBbJ2dyb3VuZCcsICduZXV0cmFsJywgJ0wxJywgJ0wyJyBdLFxuICAgICcyMDhWJyAgICAgIDogWydncm91bmQnLCAnbmV1dHJhbCcsICdMMScsICdMMicgXSxcbiAgICAnMjc3VicgICAgICA6IFsnZ3JvdW5kJywgJ25ldXRyYWwnLCAnTDEnIF0sXG4gICAgJzQ4MFYgV3llJyAgOiBbJ2dyb3VuZCcsICduZXV0cmFsJywgJ0wxJywgJ0wyJywgJ0wzJyBdLFxuICAgICc0ODBWIERlbHRhJzogWydncm91bmQnLCAnTDEnLCAnTDInLCAnTDMnIF0sXG59O1xuXG5cbmNvbmZpZ19vcHRpb25zLmludmVydGVycyA9IHt9O1xuXG4vL2NvbmZpZ19vcHRpb25zLmludmVydGVyc1snU01BJ10gPSB7fTtcbi8vY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzWydTTUEnXVsnU0kzMDAwJ10gPSB7XG4vLyAgICBtYWtlOidTTUEnLFxuLy8gICAgbW9kZWw6JzMwMDAnLFxuLy9cbi8vICAgIERDX3ZvbHRhZ2VXaW5kb3dfbG93OiAxNTAsXG4vLyAgICBEQ192b2x0YWdlV2luZG93X2hpZ2g6IDM1MCxcbi8vICAgIG1heF9wb3dlcjogMzMwMCxcbi8vXG4vLyAgICBBQ19vcHRpb25zOiBbJzI0MCcsJzIwOCddLFxuLy9cbi8vfTtcblxuLy9jb25maWdfb3B0aW9ucy5pbnZlcnRlcnNbJ1NNQSddWydTSTI1MDAnXSA9IHtcbi8vICAgIG1ha2U6J1NNQScsXG4vLyAgICBtb2RlbDonMjUwMCcsXG4vL1xuLy8gICAgRENfdm9sdGFnZVdpbmRvd19sb3c6IDE1MCxcbi8vICAgIERDX3ZvbHRhZ2VXaW5kb3dfaGlnaDogMzUwLFxuLy8gICAgbWF4X3Bvd2VyOiAyOTAwLFxuLy9cbi8vICAgIEFDX29wdGlvbnM6IFsnMjQwJywnMjA4J10sXG4vL1xuLy99O1xuXG5cblxuXG5jb25maWdfb3B0aW9ucy5EQ19ob21lcnVuX2xlZ3RocyA9IFsyNSw1MCw3NSwxMDBdO1xuXG5zeXN0ZW0uaW52ZXJ0ZXIgPSB7fTtcblxuXG4vLyBEcmF3aW5nIHNwZWNpZmljXG5zZXR0aW5ncy5kcmF3aW5nID0ge307XG5cbi8qXG52YXIgbF9hdHRyID0gc2V0dGluZ3MuZHJhd2luZy5sX2F0dHIgPSB7fTtcblxubF9hdHRyLmJhc2UgPSB7XG4gICAgJ2ZpbGwnOiAnbm9uZScsXG4gICAgJ3N0cm9rZSc6JyMwMDAwMDAnLFxuICAgICdzdHJva2Utd2lkdGgnOicxcHgnLFxuICAgICdzdHJva2UtbGluZWNhcCc6J2J1dHQnLFxuICAgICdzdHJva2UtbGluZWpvaW4nOidtaXRlcicsXG4gICAgJ3N0cm9rZS1vcGFjaXR5JzoxLFxuXG59O1xubF9hdHRyLmJsb2NrID0gT2JqZWN0LmNyZWF0ZShsX2F0dHIuYmFzZSk7XG5sX2F0dHIuZnJhbWUgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5mcmFtZS5zdHJva2UgPSAnIzAwMDA0Mic7XG5sX2F0dHIudGFibGUgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci50YWJsZS5zdHJva2UgPSAnIzAwMDA0Mic7XG5cbmxfYXR0ci5EQ19wb3MgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5EQ19wb3Muc3Ryb2tlID0gJyNmZjAwMDAnO1xubF9hdHRyLkRDX25lZyA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xubF9hdHRyLkRDX25lZy5zdHJva2UgPSAnIzAwMDAwMCc7XG5sX2F0dHIuRENfZ3JvdW5kID0gT2JqZWN0LmNyZWF0ZShsX2F0dHIuYmFzZSk7XG5sX2F0dHIuRENfZ3JvdW5kLnN0cm9rZSA9ICcjMDA2NjAwJztcbmxfYXR0ci5tb2R1bGUgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5ib3ggPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci50ZXh0ID0gT2JqZWN0LmNyZWF0ZShsX2F0dHIuYmFzZSk7XG5sX2F0dHIudGV4dC5zdHJva2UgPSAnIzAwMDBmZic7XG5sX2F0dHIudGVybWluYWwgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcblxubF9hdHRyLkFDX2dyb3VuZCA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xubF9hdHRyLkFDX2dyb3VuZC5zdHJva2UgPSAnR3JlZW4nO1xubF9hdHRyLkFDX25ldXRyYWwgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5BQ19uZXV0cmFsLnN0cm9rZSA9ICdHcmF5JztcbmxfYXR0ci5BQ19MMSA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xubF9hdHRyLkFDX0wxLnN0cm9rZSA9ICdCbGFjayc7XG5sX2F0dHIuQUNfTDIgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcbmxfYXR0ci5BQ19MMi5zdHJva2UgPSAnUmVkJztcbmxfYXR0ci5BQ19MMyA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xubF9hdHRyLkFDX0wzLnN0cm9rZSA9ICdCbHVlJztcbiovXG5cbi8vLy8vLy8vLy8vLy8vL1xuLy8gZm9udHNcblxudmFyIGZvbnRzID0gc2V0dGluZ3MuZHJhd2luZy5mb250cyA9IHt9O1xuXG5mb250c1snc2lnbnMnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDUsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5mb250c1snbGFiZWwnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDEyLFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ21pZGRsZScsXG59O1xuZm9udHNbJ3RpdGxlMSddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTQsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbGVmdCcsXG59O1xuZm9udHNbJ3RpdGxlMiddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTIsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbGVmdCcsXG59O1xuZm9udHNbJ3BhZ2UnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDIwLFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ2xlZnQnLFxufVxuZm9udHNbJ3RhYmxlJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICA2LFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ21pZGRsZScsXG59O1xuXG5cbmZ1bmN0aW9uIG1rX3NldHRpbmdzKCl7XG5cbn1cblxudmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nLnNpemUgPSB7fTtcbnZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nLmxvYyA9IHt9O1xuXG5cbi8vIHNpemVzXG5zaXplLmRyYXdpbmcgPSB7XG4gICAgdzogMTAwMCxcbiAgICBoOiA3ODAsXG4gICAgZnJhbWVfcGFkZGluZzogNSxcbiAgICB0aXRsZWJveDogNTAsXG59O1xuXG5zaXplLm1vZHVsZSA9IHt9O1xuc2l6ZS5tb2R1bGUuZnJhbWUgPSB7XG4gICAgdzogMTAsXG4gICAgaDogMzAsXG59O1xuc2l6ZS5tb2R1bGUubGVhZCA9IHNpemUubW9kdWxlLmZyYW1lLncqMi8zO1xuc2l6ZS5tb2R1bGUuaCA9IHNpemUubW9kdWxlLmZyYW1lLmggKyBzaXplLm1vZHVsZS5sZWFkKjI7XG5zaXplLm1vZHVsZS53ID0gc2l6ZS5tb2R1bGUuZnJhbWUudztcblxuc2l6ZS53aXJlX29mZnNldCA9IHtcbiAgICBiYXNlOiA3LFxuICAgIGdhcDogc2l6ZS5tb2R1bGUudyxcbn07XG5zaXplLndpcmVfb2Zmc2V0Lm1pbiA9IHNpemUud2lyZV9vZmZzZXQuYmFzZSAqIDE7XG5cbnNpemUuc3RyaW5nID0ge307XG5zaXplLnN0cmluZy5nYXAgPSBzaXplLm1vZHVsZS5mcmFtZS53LzQyO1xuc2l6ZS5zdHJpbmcuZ2FwX21pc3NpbmcgPSBzaXplLnN0cmluZy5nYXAgKyBzaXplLm1vZHVsZS5mcmFtZS53O1xuc2l6ZS5zdHJpbmcuaCA9IChzaXplLm1vZHVsZS5oICogNCkgKyAoc2l6ZS5zdHJpbmcuZ2FwICogMikgKyBzaXplLnN0cmluZy5nYXBfbWlzc2luZztcbnNpemUuc3RyaW5nLncgPSBzaXplLm1vZHVsZS5mcmFtZS53ICogMi41O1xuXG5zaXplLnRlcm1pbmFsX2RpYW0gPSA1O1xuc2l6ZS5mdXNlID0ge307XG5zaXplLmZ1c2UudyA9IDE1O1xuc2l6ZS5mdXNlLmggPSA0O1xuXG5cblxuXG5cblxuLy8gSW52ZXJ0ZXJcbnNpemUuaW52ZXJ0ZXIgPSB7IHc6IDI1MCwgaDogMTUwIH07XG5zaXplLmludmVydGVyLnRleHRfZ2FwID0gMTU7XG5zaXplLmludmVydGVyLnN5bWJvbF93ID0gNTA7XG5zaXplLmludmVydGVyLnN5bWJvbF9oID0gMjU7XG5cbmxvYy5pbnZlcnRlciA9IHsgXG4gICAgeDogc2l6ZS5kcmF3aW5nLncvMixcbiAgICB5OiBzaXplLmRyYXdpbmcuaC8zLFxufTtcbmxvYy5pbnZlcnRlci5ib3R0b20gPSBsb2MuaW52ZXJ0ZXIueSArIHNpemUuaW52ZXJ0ZXIuaC8yO1xubG9jLmludmVydGVyLnRvcCA9IGxvYy5pbnZlcnRlci55IC0gc2l6ZS5pbnZlcnRlci5oLzI7XG5sb2MuaW52ZXJ0ZXIuYm90dG9tX3JpZ2h0ID0ge1xuICAgIHg6IGxvYy5pbnZlcnRlci54ICsgc2l6ZS5pbnZlcnRlci53LzIsXG4gICAgeTogbG9jLmludmVydGVyLnkgKyBzaXplLmludmVydGVyLmgvMixcbn07XG5cbi8vIGFycmF5XG5sb2MuYXJyYXkgPSB7IFxuICAgIHg6IGxvYy5pbnZlcnRlci54IC0gMjAwLFxuICAgIHk6NjAwXG59O1xubG9jLmFycmF5LnVwcGVyID0gbG9jLmFycmF5LnkgLSBzaXplLnN0cmluZy5oLzI7XG5sb2MuYXJyYXkubG93ZXIgPSBsb2MuYXJyYXkudXBwZXIgKyBzaXplLnN0cmluZy5oO1xubG9jLmFycmF5LnJpZ2h0ID0gbG9jLmFycmF5LnggLSBzaXplLm1vZHVsZS5mcmFtZS5oKjM7XG5cbmxvYy5EQyA9IGxvYy5hcnJheTtcblxuLy8gREMgamJcbnNpemUuamJfYm94ID0ge1xuICAgIGg6IDE1MCxcbiAgICB3OiA4MCxcbn07XG5sb2MuamJfYm94ID0ge1xuICAgIHg6IGxvYy5hcnJheS54ICsgc2l6ZS5qYl9ib3gudy8yLFxuICAgIHk6IGxvYy5hcnJheS55ICsgc2l6ZS5qYl9ib3guaC8xMCxcbn07XG5cbi8vIERDIGRpY29uZWN0XG5zaXplLmRpc2Nib3ggPSB7XG4gICAgdzogMTQwLFxuICAgIGg6IDUwLFxufTtcbmxvYy5kaXNjYm94ID0ge1xuICAgIHg6IGxvYy5pbnZlcnRlci54IC0gc2l6ZS5pbnZlcnRlci53LzIgKyBzaXplLmRpc2Nib3gudy8yLFxuICAgIHk6IGxvYy5pbnZlcnRlci55ICsgc2l6ZS5pbnZlcnRlci5oLzIgKyBzaXplLmRpc2Nib3guaC8yICsgMTAsXG59XG5cbi8vIEFDIGRpY29uZWN0XG5zaXplLkFDX2Rpc2MgPSB7IHc6IDgwLCBoOiAxMjUgfTtcblxubG9jLkFDX2Rpc2MgPSB7IFxuICAgIHg6IGxvYy5pbnZlcnRlci54KzIwMCwgXG4gICAgeTogbG9jLmludmVydGVyLnkrMjUwXG59O1xubG9jLkFDX2Rpc2MuYm90dG9tID0gbG9jLkFDX2Rpc2MueSArIHNpemUuQUNfZGlzYy5oLzI7XG5sb2MuQUNfZGlzYy50b3AgPSBsb2MuQUNfZGlzYy55IC0gc2l6ZS5BQ19kaXNjLmgvMjtcbmxvYy5BQ19kaXNjLmxlZnQgPSBsb2MuQUNfZGlzYy54IC0gc2l6ZS5BQ19kaXNjLncvMjtcbmxvYy5BQ19kaXNjLnN3aXRjaF90b3AgPSBsb2MuQUNfZGlzYy50b3AgKyAxNTtcbmxvYy5BQ19kaXNjLnN3aXRjaF9ib3R0b20gPSBsb2MuQUNfZGlzYy5zd2l0Y2hfdG9wICsgMzA7XG5cblxuLy8gQUMgcGFuZWxcblxubG9jLkFDX2xvYWRjZW50ZXIgPSB7XG4gICAgeDogbG9jLmludmVydGVyLngrMzUwLCBcbiAgICB5OiBsb2MuaW52ZXJ0ZXIueSsxMDBcbn07XG5zaXplLkFDX2xvYWRjZW50ZXIgPSB7IHc6IDEyNSwgaDogMzAwIH07IFxubG9jLkFDX2xvYWRjZW50ZXIubGVmdCA9IGxvYy5BQ19sb2FkY2VudGVyLnggLSBzaXplLkFDX2xvYWRjZW50ZXIudy8yO1xubG9jLkFDX2xvYWRjZW50ZXIudG9wID0gbG9jLkFDX2xvYWRjZW50ZXIueSAtIHNpemUuQUNfbG9hZGNlbnRlci5oLzI7XG5cblxuc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIgPSB7IHc6IDIwLCBoOiBzaXplLnRlcm1pbmFsX2RpYW0sIH07XG5sb2MuQUNfbG9hZGNlbnRlci5icmVha2VycyA9IHtcbiAgICBsZWZ0OiBsb2MuQUNfbG9hZGNlbnRlci54IC0gKCBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci53ICogMS4xICksXG59O1xuc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzID0ge1xuICAgIG51bTogMjAsXG4gICAgc3BhY2luZzogc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIuaCArIDEsXG59O1xubG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMudG9wID0gbG9jLkFDX2xvYWRjZW50ZXIudG9wICsgc2l6ZS5BQ19sb2FkY2VudGVyLmgvNTtcbmxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLmJvdHRvbSA9IGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnRvcCArIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5zcGFjaW5nKnNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5udW07XG5cblxuc2l6ZS5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIgPSB7IHc6NSwgaDo0MCB9O1xubG9jLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhciA9IHtcbiAgICB4OiBsb2MuQUNfbG9hZGNlbnRlci5sZWZ0ICsgMjAsIFxuICAgIHk6IGxvYy5BQ19sb2FkY2VudGVyLnkgKyBzaXplLkFDX2xvYWRjZW50ZXIuaCowLjMgXG59O1xuXG5zaXplLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyID0geyB3OjQwLCBoOjUgfTtcbmxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhciA9IHtcbiAgICB4OiBsb2MuQUNfbG9hZGNlbnRlci54ICsgMTAsIFxuICAgIHk6IGxvYy5BQ19sb2FkY2VudGVyLnkgKyBzaXplLkFDX2xvYWRjZW50ZXIuaCowLjQ1XG59O1xuXG5sb2MuQUNfY29uZHVpdCA9IHsgXG4gICAgeTogbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMuYm90dG9tIC0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnNwYWNpbmcvMixcbn07XG5cblxuLy8gd2lyZSB0YWJsZVxuc2l6ZS53aXJlX3RhYmxlID0ge307XG5zaXplLndpcmVfdGFibGUudyA9IDIwMDtcbnNpemUud2lyZV90YWJsZS5yb3dfaCA9IDEwO1xuc2l6ZS53aXJlX3RhYmxlLmggPSAoc3lzdGVtLndpcmVfY29uZmlnX251bSszKSAqIHNpemUud2lyZV90YWJsZS5yb3dfaDtcbmxvYy53aXJlX3RhYmxlID0ge1xuICAgIHg6IHNpemUuZHJhd2luZy53IC0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94IC0gc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmcqMyAtIHNpemUud2lyZV90YWJsZS53LzIgLSAyNSxcbiAgICB5OiBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyozICsgc2l6ZS53aXJlX3RhYmxlLmgvMixcbn07XG5sb2Mud2lyZV90YWJsZS50b3AgPSBsb2Mud2lyZV90YWJsZS55IC0gc2l6ZS53aXJlX3RhYmxlLmgvMjtcbmxvYy53aXJlX3RhYmxlLmJvdHRvbSA9IGxvYy53aXJlX3RhYmxlLnkgKyBzaXplLndpcmVfdGFibGUuaC8yO1xuXG5cbi8vIHZvbHRhZ2UgZHJvcCB0YWJsZVxuc2l6ZS52b2x0X2Ryb3BfdGFibGUgPSB7fTtcbnNpemUudm9sdF9kcm9wX3RhYmxlLncgPSAxNTA7XG5zaXplLnZvbHRfZHJvcF90YWJsZS5oID0gMTAwO1xubG9jLnZvbHRfZHJvcF90YWJsZSA9IHt9O1xubG9jLnZvbHRfZHJvcF90YWJsZS54ID0gc2l6ZS5kcmF3aW5nLncgLSBzaXplLnZvbHRfZHJvcF90YWJsZS53LzIgLSA5MDtcbmxvYy52b2x0X2Ryb3BfdGFibGUueSA9IHNpemUuZHJhd2luZy5oIC0gc2l6ZS52b2x0X2Ryb3BfdGFibGUuaC8yIC0gMzA7XG5cblxuLy8gdm9sdGFnZSBkcm9wIHRhYmxlXG5zaXplLmdlbmVyYWxfbm90ZXMgPSB7fTtcbnNpemUuZ2VuZXJhbF9ub3Rlcy53ID0gMTUwO1xuc2l6ZS5nZW5lcmFsX25vdGVzLmggPSAxMDA7XG5sb2MuZ2VuZXJhbF9ub3RlcyA9IHt9O1xubG9jLmdlbmVyYWxfbm90ZXMueCA9IHNpemUuZ2VuZXJhbF9ub3Rlcy53LzIgKyAzMDtcbmxvYy5nZW5lcmFsX25vdGVzLnkgPSBzaXplLmdlbmVyYWxfbm90ZXMuaC8yICsgMzA7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbm1vZHVsZS5leHBvcnRzID0gc2V0dGluZ3M7XG4iLCJ2YXIgayA9IHJlcXVpcmUoJy4uL2xpYi9rL2suanMnKVxudmFyIGxvZyA9IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XG4vL3ZhciB1cGRhdGVfc3lzdGVtID0gcmVxdWlyZSgnLi91cGRhdGUnKS51cGRhdGVfc3lzdGVtO1xuXG5mdW5jdGlvbiBsb2FkVGFibGVzKHN0cmluZyl7XG4gICAgdmFyIHRhYmxlcyA9IHt9O1xuICAgIHZhciBsID0gc3RyaW5nLnNwbGl0KCdcXG4nKTtcbiAgICB2YXIgdGl0bGU7XG4gICAgdmFyIGZpZWxkcztcbiAgICB2YXIgbmVlZF90aXRsZSA9IHRydWU7XG4gICAgdmFyIG5lZWRfZmllbGRzID0gdHJ1ZTtcbiAgICBsLmZvckVhY2goIGZ1bmN0aW9uKHN0cmluZywgaSl7XG4gICAgICAgIHZhciBsaW5lID0gc3RyaW5nLnRyaW0oKTtcbiAgICAgICAgaWYoIGxpbmUubGVuZ3RoID09PSAwICl7XG4gICAgICAgICAgICBuZWVkX3RpdGxlID0gdHJ1ZTtcbiAgICAgICAgICAgIG5lZWRfZmllbGRzID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmKCBuZWVkX3RpdGxlICkge1xuICAgICAgICAgICAgdGl0bGUgPSBsaW5lO1xuICAgICAgICAgICAgdGFibGVzW3RpdGxlXSA9IFtdO1xuICAgICAgICAgICAgbmVlZF90aXRsZSA9IGZhbHNlOyBcbiAgICAgICAgICAgIC8vbG9nKCduZXcgdGFibGUgJywgdGl0bGUpXG4gICAgICAgIH0gZWxzZSBpZiggbmVlZF9maWVsZHMgKSB7XG4gICAgICAgICAgICBmaWVsZHMgPSBsaW5lLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICB0YWJsZXNbdGl0bGUrXCJfZmllbGRzXCJdID0gZmllbGRzO1xuICAgICAgICAgICAgbmVlZF9maWVsZHMgPSBmYWxzZTtcbiAgICAgICAgLy99IGVsc2Uge1xuICAgICAgICAvLyAgICB2YXIgZW50cnkgPSB7fTtcbiAgICAgICAgLy8gICAgdmFyIGxpbmVfYXJyYXkgPSBsaW5lLnNwbGl0KCcsJyk7XG4gICAgICAgIC8vICAgIGZpZWxkcy5mb3JFYWNoKCBmdW5jdGlvbihmaWVsZCwgaWQpe1xuICAgICAgICAvLyAgICAgICAgZW50cnlbZmllbGQudHJpbSgpXSA9IGxpbmVfYXJyYXlbaWRdLnRyaW0oKTsgXG4gICAgICAgIC8vICAgIH0pO1xuICAgICAgICAvLyAgICB0YWJsZXNbdGl0bGVdLnB1c2goIGVudHJ5ICk7XG4gICAgICAgIC8vfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGxpbmVfYXJyYXkgPSBsaW5lLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICB0YWJsZXNbdGl0bGVdW2xpbmVfYXJyYXlbMF0udHJpbSgpXSA9IGxpbmVfYXJyYXlbMV0udHJpbSgpOyBcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRhYmxlcztcbn1cblxuXG5cbmZ1bmN0aW9uIGxvYWRDb21wb25lbnRzKHN0cmluZyl7XG4gICAgdmFyIGRiID0gay5wYXJzZUNTVihzdHJpbmcpO1xuICAgIHZhciBvYmplY3QgPSB7fSAgICBcbiAgICBmb3IoIHZhciBpIGluIGRiICl7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSBkYltpXTtcbiAgICAgICAgaWYoIG9iamVjdFtjb21wb25lbnQuTWFrZV0gPT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgb2JqZWN0W2NvbXBvbmVudC5NYWtlXSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmKCBvYmplY3RbY29tcG9uZW50Lk1ha2VdW2NvbXBvbmVudC5Nb2RlbF0gPT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgb2JqZWN0W2NvbXBvbmVudC5NYWtlXVtjb21wb25lbnQuTW9kZWxdID0ge307XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmllbGRzID0gay5vYmpJZEFycmF5KGNvbXBvbmVudClcbiAgICAgICAgZmllbGRzLmZvckVhY2goIGZ1bmN0aW9uKCBmaWVsZCApe1xuICAgICAgICAgICAgdmFyIHBhcmFtID0gY29tcG9uZW50W2ZpZWxkXTtcbiAgICAgICAgICAgIGlmKCAhIGZpZWxkIGluIFsnTWFrZScsICdNb2RlbCddICYmICEgaXNOYU4ocGFyc2VGbG9hdChwYXJhbSkpKXtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRbZmllbGRdID0gcGFyc2VGbG9hdChwYXJhbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIG9iamVjdFtjb21wb25lbnQuTWFrZV1bY29tcG9uZW50Lk1vZGVsXSA9IGNvbXBvbmVudDtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzLmxvYWRUYWJsZXMgPSBsb2FkVGFibGVzO1xubW9kdWxlLmV4cG9ydHMubG9hZENvbXBvbmVudHMgPSBsb2FkQ29tcG9uZW50cztcblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrID0gcmVxdWlyZSgnLi4vbGliL2svay5qcycpO1xuLy92YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xuLy92YXIgZGlzcGxheV9zdmcgPSByZXF1aXJlKCcuL2Rpc3BsYXlfc3ZnJyk7XG5cbnZhciB1cGRhdGVfc3lzdGVtID0gZnVuY3Rpb24oc2V0dGluZ3MpIHtcbiAgICAvL2NvbnNvbGUubG9nKCctLS1zZXR0aW5ncy0tLScsIHNldHRpbmdzKTtcbiAgICB2YXIgY29uZmlnX29wdGlvbnMgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucztcbiAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nLmxvYztcbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmcuc2l6ZTtcblxuICAgIHZhciBzaG93X2RlZmF1bHRzID0gZmFsc2U7XG4gICAgaWYoIHNldHRpbmdzLnN0YXR1cy52ZXJzaW9uX3N0cmluZyA9PT0gJ0Rldicpe1xuICAgICAgICBzaG93X2RlZmF1bHRzID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIHN5c3RlbS5EQy5zdHJpbmdfbnVtID0gc3lzdGVtLkRDLnN0cmluZ19udW0gfHwgNDtcbiAgICAgICAgc3lzdGVtLkRDLnN0cmluZ19tb2R1bGVzID0gc3lzdGVtLkRDLnN0cmluZ19tb2R1bGVzIHx8IDY7XG4gICAgICAgIHN5c3RlbS5EQy5ob21lcnVuX2xlbmd0aCA9IHN5c3RlbS5EQy5ob21lcnVuX2xlbmd0aCB8fCA1MDtcbiAgICAgICAgc3lzdGVtLmludmVydGVyLm1vZGVsID0gc3lzdGVtLmludmVydGVyLm1vZGVsIHx8ICdTSTMwMDAnOyBcbiAgICAgICAgc3lzdGVtLkFDX3R5cGUgPSBzeXN0ZW0uQUNfdHlwZSB8fCAnNDgwViBEZWx0YSc7XG5cbiAgICAgICAgaWYoIHNldHRpbmdzLnN0YXR1cy5kYXRhX2xvYWRlZCApe1xuICAgICAgICAgICAgc3lzdGVtLkRDLm1vZHVsZS5tYWtlID0gc3lzdGVtLkRDLm1vZHVsZS5tYWtlIHx8IE9iamVjdC5rZXlzKCBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVzIClbMF07XG4gICAgICAgICAgICBpZiggc3lzdGVtLkRDLm1vZHVsZS5tYWtlKSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVNb2RlbEFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZXNbc3lzdGVtLkRDLm1vZHVsZS5tYWtlXSk7XG4gICAgICAgICAgICBzeXN0ZW0uREMubW9kdWxlLm1vZGVsID0gc3lzdGVtLkRDLm1vZHVsZS5tb2RlbCB8fCBPYmplY3Qua2V5cyggc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlc1tzeXN0ZW0uREMubW9kdWxlLm1ha2VdIClbMF07XG5cblxuICAgICAgICAgICAgY29uZmlnX29wdGlvbnMuRENfaG9tZXJ1bl9BV0dfb3B0aW9ucyA9IGsub2JqSWRBcnJheSggY29uZmlnX29wdGlvbnMuTkVDX3RhYmxlc1tcIkNoIDkgVGFibGUgOCBDb25kdWN0b3IgUHJvcGVydGllc1wiXSApO1xuICAgICAgICAgICAgY29uZmlnX29wdGlvbnMuRENfaG9tZXJ1bl9BV0cgPSBjb25maWdfb3B0aW9ucy5EQ19ob21lcnVuX0FXRyB8fCBjb25maWdfb3B0aW9ucy5EQ19ob21lcnVuX0FXR19vcHRpb25zW2NvbmZpZ19vcHRpb25zLkRDX2hvbWVydW5fQVdHX29wdGlvbnMubGVuZ3RoLTFdO1xuXG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmKCBzZXR0aW5ncy5zdGF0dXMuZGF0YV9sb2FkZWQgKXtcblxuICAgICAgICAvL3N5c3RlbS5EQy5zdHJpbmdfbnVtID0gc2V0dGluZ3Muc3lzdGVtLnN0cmluZ19udW07IFxuICAgICAgICAvL3N5c3RlbS5EQy5zdHJpbmdfbW9kdWxlcyA9IHNldHRpbmdzLnN5c3RlbS5zdHJpbmdfbW9kdWxlcztcbiAgICAgICAgLy9pZiggc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlcyAhPT0gdW5kZWZpbmVkICl7XG5cblxuICAgICAgICAvLyBNb2R1bGVzXG4gICAgICAgIGlmKCBzZXR0aW5ncy5zdGF0dXMuc2VjdGlvbnMubW9kdWxlcy5yZWFkeSl7XG5cbiAgICAgICAgICAgIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZU1ha2VBcnJheSA9IGsub2JqSWRBcnJheShzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVzKTtcbiAgICAgICAgICAgIGlmKCBzeXN0ZW0uREMubW9kdWxlLm1ha2UpIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZU1vZGVsQXJyYXkgPSBrLm9iaklkQXJyYXkoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlc1tzeXN0ZW0uREMubW9kdWxlLm1ha2VdKTtcbiAgICAgICAgICAgIGlmKCBzeXN0ZW0uREMubW9kdWxlLm1vZGVsICkgc3lzdGVtLkRDLm1vZHVsZS5zcGVjcyA9IHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZXNbc3lzdGVtLkRDLm1vZHVsZS5tYWtlXVtzeXN0ZW0uREMubW9kdWxlLm1vZGVsXTtcblxuXG5cblxuXG5cblxuICAgICAgICAgICAgaWYoIHN5c3RlbS5EQy5tb2R1bGUubWFrZSAhPT0gJycgJiYgc3lzdGVtLkRDLm1vZHVsZS5tb2RlbCAhPT0gJycgKXtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5zdGF0dXMuc2VjdGlvbnMubW9kdWxlcy5zZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNldHRpbmdzLnN0YXR1cy5zZWN0aW9ucy5hcnJheS5yZWFkeSA9IHRydWU7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXJyYXlcbiAgICAgICAgaWYoIHNldHRpbmdzLnN0YXR1cy5zZWN0aW9ucy5hcnJheS5yZWFkeSl7XG5cblxuICAgICAgICAgICAgLy9zeXN0ZW0ubW9kdWxlID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlc1tzZXR0aW5ncy5taXNjLm1vZHVsZV07XG4gICAgICAgICAgICBpZiggc2V0dGluZ3Muc3RhdHVzLnNlY3Rpb25zLmFycmF5LnNldCApe1xuICAgICAgICAgICAgICAgIGlmKCBzeXN0ZW0uREMubW9kdWxlLnNwZWNzICl7XG4gICAgICAgICAgICAgICAgICAgIHN5c3RlbS5EQy5hcnJheSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBzeXN0ZW0uREMuYXJyYXkuSXNjID0gc3lzdGVtLkRDLm1vZHVsZS5zcGVjcy5Jc2MgKiBzeXN0ZW0uREMuc3RyaW5nX251bTtcbiAgICAgICAgICAgICAgICAgICAgc3lzdGVtLkRDLmFycmF5LlZvYyA9IHN5c3RlbS5EQy5tb2R1bGUuc3BlY3MuVm9jICogc3lzdGVtLkRDLnN0cmluZ19tb2R1bGVzO1xuICAgICAgICAgICAgICAgICAgICBzeXN0ZW0uREMuYXJyYXkuSW1wID0gc3lzdGVtLkRDLm1vZHVsZS5zcGVjcy5JbXAgKiBzeXN0ZW0uREMuc3RyaW5nX251bTtcbiAgICAgICAgICAgICAgICAgICAgc3lzdGVtLkRDLmFycmF5LlZtcCA9IHN5c3RlbS5EQy5tb2R1bGUuc3BlY3MuVm1wICogc3lzdGVtLkRDLnN0cmluZ19tb2R1bGVzO1xuICAgICAgICAgICAgICAgICAgICBzeXN0ZW0uREMuYXJyYXkuUG1wID0gc3lzdGVtLkRDLmFycmF5LlZtcCAqIHN5c3RlbS5EQy5hcnJheS5JbXA7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYoIHN5c3RlbS5EQy5hcnJheSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICAgICAgc2V0dGluZ3Muc3RhdHVzLnNlY3Rpb25zLmFycmF5LnNldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgc2V0dGluZ3Muc3RhdHVzLnNlY3Rpb25zLkRDLnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEQ1xuICAgICAgICBpZiggc2V0dGluZ3Muc3RhdHVzLnNlY3Rpb25zLkRDLnJlYWR5KXtcblxuXG4gICAgICAgICAgICBjb25maWdfb3B0aW9ucy5EQ19ob21lcnVuX0FXR19vcHRpb25zID0gay5vYmpJZEFycmF5KCBjb25maWdfb3B0aW9ucy5ORUNfdGFibGVzW1wiQ2ggOSBUYWJsZSA4IENvbmR1Y3RvciBQcm9wZXJ0aWVzXCJdICk7XG5cbiAgICAgICAgICAgIGlmKCBmYWxzZSApe1xuICAgICAgICAgICAgICAgIHNldHRpbmdzLnN0YXR1cy5zZWN0aW9ucy5EQy5zZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNldHRpbmdzLnN0YXR1cy5zZWN0aW9ucy5pbnZlcnRlci5yZWFkeSA9IHRydWU7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgXG4gICAgICAgIC8vIEludmVydGVyXG4gICAgICAgIGlmKCBzZXR0aW5ncy5zdGF0dXMuc2VjdGlvbnMuaW52ZXJ0ZXIucmVhZHkpe1xuXG4gICAgICAgICAgICBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlck1ha2VBcnJheSA9IGsub2JqSWRBcnJheShzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnMpO1xuICAgICAgICAgICAgc3lzdGVtLmludmVydGVyLm1ha2UgPSBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSB8fCBPYmplY3Qua2V5cyggc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzIClbMF07XG4gICAgICAgICAgICBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlck1vZGVsQXJyYXkgPSBrLm9iaklkQXJyYXkoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzW3N5c3RlbS5pbnZlcnRlci5tYWtlXSk7XG4gICAgICAgICAgICBzeXN0ZW0uaW52ZXJ0ZXIubW9kZWwgPSBzeXN0ZW0uaW52ZXJ0ZXIubW9kZWwgfHwgT2JqZWN0LmtleXMoIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyc1tzeXN0ZW0uaW52ZXJ0ZXIubWFrZV0gKVswXTtcbiAgICAgICAgICAgIHN5c3RlbS5pbnZlcnRlci5zcGVjcyA9IHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyc1tzeXN0ZW0uaW52ZXJ0ZXIubWFrZV1bc3lzdGVtLmludmVydGVyLm1vZGVsXTtcblxuXG4gICAgICAgICAgICBpZiggZmFsc2UgKXtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5zdGF0dXMuc2VjdGlvbnMuaW52ZXJ0ZXIuc2V0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5zdGF0dXMuc2VjdGlvbnMuQUMucmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gQUNcbiAgICAgICAgaWYoIHNldHRpbmdzLnN0YXR1cy5zZWN0aW9ucy5BQy5yZWFkeSl7XG5cblxuICAgICAgICAgICAgY29uZmlnX29wdGlvbnMuQUNfbG9hZGNlbnRlcl90eXBlX29wdGlvbnMgPSBrLm9iaklkQXJyYXkoIGNvbmZpZ19vcHRpb25zLkFDX2xvYWRjZW50ZXJfdHlwZXMgKTtcbiAgICAgICAgICAgIGNvbmZpZ19vcHRpb25zLkFDX3R5cGVfb3B0aW9ucyA9IGsub2JqSWRBcnJheSggY29uZmlnX29wdGlvbnMuQUNfdHlwZXMgKTtcbiAgICAgICAgICAgIHN5c3RlbS5BQ19sb2FkY2VudGVyX3R5cGUgPSBzeXN0ZW0uQUNfbG9hZGNlbnRlcl90eXBlIHx8IGNvbmZpZ19vcHRpb25zLkFDX2xvYWRjZW50ZXJfdHlwZV9vcHRpb25zWzBdO1xuICAgICAgICAgICAgc3lzdGVtLkFDX3R5cGVzX2F2YWlsaWJsZSA9IGNvbmZpZ19vcHRpb25zLkFDX2xvYWRjZW50ZXJfdHlwZXNbc3lzdGVtLkFDX2xvYWRjZW50ZXJfdHlwZV07XG4gICAgICAgICAgICBjb25maWdfb3B0aW9ucy5BQ190eXBlX29wdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW0sIGlkICl7XG4gICAgICAgICAgICAgICAgaWYoICEgZWxlbSBpbiBzeXN0ZW0uQUNfdHlwZXNfYXZhaWxpYmxlICkge1xuICAgICAgICAgICAgICAgICAgICBjb25maWdfb3B0aW9ucy5BQ190eXBlX29wdGlvbnMuc3BsaWNlKGlkLCAxKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHN5c3RlbS5BQ190eXBlID0gc2V0dGluZ3Muc3lzdGVtLkFDX3R5cGU7XG5cbiAgICAgICAgICAgIHN5c3RlbS5BQ19jb25kdWN0b3JzID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuQUNfdHlwZXNbc3lzdGVtLkFDX3R5cGVdO1xuXG5cblxuICAgICAgICAgICAgaWYoIGZhbHNlICl7XG4gICAgICAgICAgICAgICAgc2V0dGluZ3Muc3RhdHVzLnNlY3Rpb25zLkFDLnNldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy9zZXR0aW5ncy5zdGF0dXMuc2VjdGlvbnMuQUMucmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG5cblxuXG5cblxuXG4gICAgICAgIHNpemUud2lyZV9vZmZzZXQubWF4ID0gc2l6ZS53aXJlX29mZnNldC5taW4gKyBzeXN0ZW0uREMuc3RyaW5nX251bSAqIHNpemUud2lyZV9vZmZzZXQuYmFzZTtcbiAgICAgICAgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgPSBzaXplLndpcmVfb2Zmc2V0Lm1heCArIHNpemUud2lyZV9vZmZzZXQuYmFzZSoxO1xuXG4gICAgICAgIGxvYy5hcnJheS5sZWZ0ID0gbG9jLmFycmF5LnJpZ2h0IC0gKCBzaXplLnN0cmluZy53ICogc3lzdGVtLkRDLnN0cmluZ19udW0gKSAtICggc2l6ZS5tb2R1bGUuZnJhbWUudyozLzQgKSA7XG5cbiAgICAgICAgLy9yZXR1cm4gc2V0dGluZ3M7XG4gICAgfVxufTtcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSB1cGRhdGVfc3lzdGVtO1xuIiwiLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIFRoaXMgaXMgdGhlIGsgamF2YXNjcmlwdCBsaWJyYXJ5XHJcbi8vIGEgY29sbGVjdGlvbiBvZiBmdW5jdGlvbnMgdXNlZCBieSBrc2hvd2FsdGVyXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxudmFyIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG52YXIgJCA9IHJlcXVpcmUoJy4va19ET00uanMnKTtcclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gTWlzYy4gdmFyaWFibGVzICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLy8gbG9nIHNob3J0Y3V0XHJcbnZhciBsb2dPYmogPSBmdW5jdGlvbihvYmope1xyXG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkob2JqKSlcclxufVxyXG52YXIgbG9nT2JqRnVsbCA9IGZ1bmN0aW9uKG9iail7XHJcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDQpKVxyXG59XHJcblxyXG4vLyB+IHBhZ2UgbG9hZCB0aW1lXHJcbnZhciBib290X3RpbWUgPSBtb21lbnQoKVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIFN0YXJ0IG9mIGxpYmFyeSBvYmplY3QgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbnZhciBrID0ge31cclxuXHJcblxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBKYXZhc3JpcHQgZnVuY3Rpb25zIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuXHJcbmsub2JqX2V4dGVuZCA9IGZ1bmN0aW9uKG9iaiwgcHJvcHMpIHtcclxuICAgIGZvcih2YXIgcHJvcCBpbiBwcm9wcykgeyBcclxuICAgICAgICBpZihwcm9wcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgICAgICBvYmpbcHJvcF0gPSBwcm9wc1twcm9wXVxyXG4gICAgICAgIH0gXHJcbiAgICB9IFxyXG59XHJcblxyXG5rLm9ial9yZW5hbWUgPSBmdW5jdGlvbihvYmosIG9sZF9uYW1lLCBuZXdfbmFtZSl7XHJcbiAgICAvLyBDaGVjayBmb3IgdGhlIG9sZCBwcm9wZXJ0eSBuYW1lIHRvIGF2b2lkIGEgUmVmZXJlbmNlRXJyb3IgaW4gc3RyaWN0IG1vZGUuXHJcbiAgICBpZiAob2JqLmhhc093blByb3BlcnR5KG9sZF9uYW1lKSkge1xyXG4gICAgICAgIG9ialtuZXdfbmFtZV0gPSBvYmpbb2xkX25hbWVdXHJcbiAgICAgICAgZGVsZXRlIG9ialtvbGRfbmFtZV1cclxuICAgIH1cclxuICAgIHJldHVybiBvYmpcclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBNaXNjIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuLy8gaHR0cDovL2Nzcy10cmlja3MuY29tL3NuaXBwZXRzL2phdmFzY3JpcHQvZ2V0LXVybC12YXJpYWJsZXMvXHJcbmsuZ2V0UXVlcnlWYXJpYWJsZSA9IGZ1bmN0aW9uKHZhcmlhYmxlKSB7XHJcbiAgICAgICB2YXIgcXVlcnkgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKVxyXG4gICAgICAgdmFyIHZhcnMgPSBxdWVyeS5zcGxpdChcIiZcIilcclxuICAgICAgIGZvciAodmFyIGk9MDtpPHZhcnMubGVuZ3RoO2krKykge1xyXG4gICAgICAgICAgICAgICB2YXIgcGFpciA9IHZhcnNbaV0uc3BsaXQoXCI9XCIpXHJcbiAgICAgICAgICAgICAgIGlmKHBhaXJbMF0gPT0gdmFyaWFibGUpe1xyXG4gICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhaXJbMV1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuKGZhbHNlKVxyXG59XHJcblxyXG5rLnN0cl9yZXBlYXQgPSBmdW5jdGlvbihzdHJpbmcsIGNvdW50KSB7XHJcbiAgICBpZiAoY291bnQgPCAxKSByZXR1cm4gJydcclxuICAgIHZhciByZXN1bHQgPSAnJyBcclxuICAgIHZhciBwYXR0ZXJuID0gc3RyaW5nLnZhbHVlT2YoKVxyXG4gICAgd2hpbGUgKGNvdW50ID4gMCkge1xyXG4gICAgICAgIGlmIChjb3VudCAmIDEpIHJlc3VsdCArPSBwYXR0ZXJuXHJcbiAgICAgICAgY291bnQgPj49IDEgXHJcbiAgICAgICAgcGF0dGVybiArPSBwYXR0ZXJuXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcblxyXG5rLm9iaklkQXJyYXkgPSBmdW5jdGlvbiggb2JqZWN0ICkge1xyXG4gICAgaWYoIG9iamVjdCAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgIHZhciBhID0gW107XHJcbiAgICAgICAgZm9yKCB2YXIgaWQgaW4gb2JqZWN0ICkge1xyXG4gICAgICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGlkKSApICB7XHJcbiAgICAgICAgICAgICAgICBhLnB1c2goaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIE1hdGgsIG51bWJlcnMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG4vKlxyXG4gKiAgbm9ybVJhbmQ6IHJldHVybnMgbm9ybWFsbHkgZGlzdHJpYnV0ZWQgcmFuZG9tIG51bWJlcnNcclxuICogIGh0dHA6Ly9tZW1vcnkucHN5Y2gubXVuLmNhL3RlY2gvc25pcHBldHMvcmFuZG9tX25vcm1hbC9cclxuICovXHJcbmsubm9ybVJhbmQgPSBmdW5jdGlvbihtdSwgc2lnbWEpIHtcclxuICAgIHZhciB4MSwgeDIsIHJhZDtcclxuXHJcbiAgICBkbyB7XHJcbiAgICAgICAgeDEgPSAyICogTWF0aC5yYW5kb20oKSAtIDE7XHJcbiAgICAgICAgeDIgPSAyICogTWF0aC5yYW5kb20oKSAtIDE7XHJcbiAgICAgICAgcmFkID0geDEgKiB4MSArIHgyICogeDI7XHJcbiAgICB9IHdoaWxlKHJhZCA+PSAxIHx8IHJhZCA9PT0gMCk7XHJcblxyXG4gICAgdmFyIGMgPSBNYXRoLnNxcnQoLTIgKiBNYXRoLmxvZyhyYWQpIC8gcmFkKTtcclxuICAgIHZhciBuID0geDEgKiBjO1xyXG4gICAgcmV0dXJuIChuICogbXUpICsgc2lnbWE7XHJcbn1cclxuXHJcbmsucGFkX3plcm8gPSBmdW5jdGlvbihudW0sIHNpemUpe1xyXG4gICAgdmFyIHMgPSAnMDAwMDAwMDAwJyArIG51bVxyXG4gICAgcmV0dXJuIHMuc3Vic3RyKHMubGVuZ3RoLXNpemUpICAgICBcclxufVxyXG5cclxuXHJcbmsudXB0aW1lID0gZnVuY3Rpb24oYm9vdF90aW1lKXtcclxuICAgIHZhciB1cHRpbWVfc2Vjb25kc190b3RhbCA9IG1vbWVudCgpLmRpZmYoYm9vdF90aW1lLCAnc2Vjb25kcycpXHJcbiAgICB2YXIgdXB0aW1lX2hvdXJzID0gTWF0aC5mbG9vciggIHVwdGltZV9zZWNvbmRzX3RvdGFsIC8oNjAqNjApIClcclxuICAgIHZhciBtaW51dGVzX2xlZnQgPSB1cHRpbWVfc2Vjb25kc190b3RhbCAlKDYwKjYwKVxyXG4gICAgdmFyIHVwdGltZV9taW51dGVzID0gay5wYWRfemVybyggTWF0aC5mbG9vciggIG1pbnV0ZXNfbGVmdCAvNjAgKSwgMiApXHJcbiAgICB2YXIgdXB0aW1lX3NlY29uZHMgPSBrLnBhZF96ZXJvKCAobWludXRlc19sZWZ0ICUgNjApLCAyIClcclxuICAgIHJldHVybiB1cHRpbWVfaG91cnMgK1wiOlwiKyB1cHRpbWVfbWludXRlcyArXCI6XCIrIHVwdGltZV9zZWNvbmRzXHJcbn1cclxuXHJcblxyXG5cclxuay5sYXN0X25fdmFsdWVzID0gZnVuY3Rpb24obil7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG46IG4sXHJcbiAgICAgICAgYXJyYXk6IFtdLFxyXG4gICAgICAgIGFkZDogZnVuY3Rpb24obmV3X3ZhbHVlKXtcclxuICAgICAgICAgICAgdGhpcy5hcnJheS5wdXNoKG5ld192YWx1ZSlcclxuICAgICAgICAgICAgaWYoIHRoaXMuYXJyYXkubGVuZ3RoID4gbiApIHRoaXMuYXJyYXkuc2hpZnQoKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hcnJheVxyXG4gICAgICAgIH1cclxuICAgIH0gICAgXHJcbn1cclxuXHJcbmsuYXJyYXlNYXggPSBmdW5jdGlvbihudW1BcnJheSkge1xyXG4gICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KG51bGwsIG51bUFycmF5KTtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gQUpBWCAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuay5BSkFYID0gZnVuY3Rpb24odXJsLCBjYWxsYmFjaywgb2JqZWN0KSB7XHJcbiAgICB2YXIgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgIHhtbGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHhtbGh0dHAucmVhZHlTdGF0ZSA9PSBYTUxIdHRwUmVxdWVzdC5ET05FICkge1xyXG4gICAgICAgICAgICBpZih4bWxodHRwLnN0YXR1cyA9PSAyMDApe1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soeG1saHR0cC5yZXNwb25zZVRleHQsIG9iamVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih4bWxodHRwLnN0YXR1cyA9PSA0MDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdUaGVyZSB3YXMgYW4gZXJyb3IgNDAwJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzb21ldGhpbmcgZWxzZSBvdGhlciB0aGFuIDIwMCB3YXMgcmV0dXJuZWQnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHhtbGh0dHAub3BlbihcIkdFVFwiLCB1cmwsIHRydWUpO1xyXG4gICAgeG1saHR0cC5zZW5kKCk7XHJcbn1cclxuXHJcbmsucGFyc2VDU1YgPSBmdW5jdGlvbihmaWxlX2NvbnRlbnQpIHtcclxuICAgIHZhciByID0gW11cclxuICAgIHZhciBsaW5lcyA9IGZpbGVfY29udGVudC5zcGxpdCgnXFxuJyk7XHJcbiAgICB2YXIgaGVhZGVyID0gbGluZXMuc2hpZnQoKS5zcGxpdCgnLCcpO1xyXG4gICAgaGVhZGVyLmZvckVhY2goZnVuY3Rpb24oZWxlbSwgaWQpe1xyXG4gICAgICAgIGhlYWRlcltpZF0gPSBlbGVtLnRyaW0oKTtcclxuICAgIH0pO1xyXG4gICAgZm9yKHZhciBsID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBsIDwgbGVuOyBsKyspe1xyXG4gICAgICAgIHZhciBsaW5lID0gbGluZXNbbF07XHJcbiAgICAgICAgaWYobGluZS5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgdmFyIGxpbmVfb2JqID0ge307XHJcbiAgICAgICAgICAgIGxpbmUuc3BsaXQoJywnKS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0saSl7XHJcbiAgICAgICAgICAgICAgICBsaW5lX29ialtoZWFkZXJbaV1dID0gaXRlbS50cmltKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByLnB1c2gobGluZV9vYmopO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybihyKTtcclxufTtcclxuXHJcbmsuZ2V0Q1NWID0gZnVuY3Rpb24oVVJMLCBjYWxsYmFjaykge1xyXG4gICAgay5BSkFYKFVSTCwgay5wYXJzZUNTVigpIClcclxufVxyXG5cclxuLypcclxuJC5hamF4U2V0dXAgKHtcclxuICAgIGNhY2hlOiBmYWxzZVxyXG59KVxyXG5cclxuXHJcblxyXG5rLmdldF9KU09OID0gZnVuY3Rpb24oVVJMLCBjYWxsYmFjaywgc3RyaW5nKSB7XHJcbi8vICAgIHZhciBmaWxlbmFtZSA9IFVSTC5zcGxpdCgnLycpLnBvcCgpXHJcbi8vICAgIGNvbnNvbGUubG9nKFVSTClcclxuICAgICQuZ2V0SlNPTiggVVJMLCBmdW5jdGlvbigganNvbiApIHtcclxuICAgICAgICBjYWxsYmFjayhqc29uLCBVUkwsIHN0cmluZylcclxuICAgIH0pLmZhaWwoZnVuY3Rpb24oanF4aHIsIHRleHRTdGF0dXMsIGVycm9yKSB7IFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCBcImVycm9yXCIsIHRleHRTdGF0dXMsIGVycm9yICApIFxyXG4gICAgfSlcclxufVxyXG5cclxuXHJcbmsubG9hZF9maWxlcyA9IGZ1bmN0aW9uKGZpbGVfbGlzdCwgY2FsbGJhY2spe1xyXG4gICAgdmFyIGQgPSB7fVxyXG5cclxuICAgIGZ1bmN0aW9uIGxvYWRfZmlsZShVUkwpe1xyXG4gICAgICAgIHZhciBmaWxlbmFtZSA9IFVSTC5zcGxpdCgnLycpLnBvcCgpXHJcbi8vICAgICAgICB2YXIgbmFtZSA9IGZpbGVuYW1lLnNwbGl0KCcuJylbMF1cclxuICAgICAgICAkLmdldEpTT04oIFVSTCwgZnVuY3Rpb24oIGpzb24gKSB7IC8vICwgdGV4dFN0YXR1cywganFYSFIpIHtcclxuICAgICAgICAgICAgYWRkX0pTT04oZmlsZW5hbWUsIGpzb24pXHJcbiAgICAgICAgfSkuZmFpbChmdW5jdGlvbihqcXhociwgdGV4dFN0YXR1cywgZXJyb3IpIHsgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcImVycm9yXCIsIHRleHRTdGF0dXMsIGVycm9yICApIFxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYWRkX0pTT04obmFtZSwganNvbil7XHJcbiAgICAgICAgZFtuYW1lXSA9IGpzb25cclxuICAgICAgICBpZihPYmplY3Qua2V5cyhkKS5sZW5ndGggPT0gZF9maWxlcy5sZW5ndGgpe1xyXG4gICAgICAgICAgICBjYWxsYmFjayhkKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IoIHZhciBrZXkgaW4gZmlsZV9saXN0KXtcclxuICAgICAgICB2YXIgVVJMID0gZmlsZV9saXN0W2tleV1cclxuICAgICAgICBsb2FkX2ZpbGUoVVJMKVxyXG4gICAgfVxyXG4gICAgXHJcbi8vICAgIGNhbGxiYWNrKGQpXHJcbn1cclxuXHJcbmsuZ2V0RmlsZSA9IGZ1bmN0aW9uKFVSTCwgY2FsbGJhY2spe1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IFVSTCxcclxuICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiggeGhyICkge1xyXG4gICAgICAgICAgICB4aHIub3ZlcnJpZGVNaW1lVHlwZSggXCJ0ZXh0L3BsYWluOyBjaGFyc2V0PXgtdXNlci1kZWZpbmVkXCIgKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgLmRvbmUoZnVuY3Rpb24oIGRhdGEgKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZGF0YSlcclxuICAgIH0pXHJcbiAgICAuZmFpbChmdW5jdGlvbihqcXhociwgdGV4dFN0YXR1cywgZXJyb3IpIHsgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcImVycm9yXCIsIHRleHRTdGF0dXMsIGVycm9yICApIFxyXG4gICAgfSlcclxuICAgIFxyXG4gICAgXHJcbn1cclxuKi9cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gSFRNTCAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcblxyXG5cclxuay5zZXR1cF9ib2R5ID0gZnVuY3Rpb24odGl0bGUsIHNlY3Rpb25zKXtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGVcclxuICAgIHZhciBib2R5ID0gZG9jdW1lbnQuYm9keSBcclxuICAgIHZhciBzdGF0dXNfYmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgIHN0YXR1c19iYXIuaWQgPSAnc3RhdHVzJ1xyXG4gICAgc3RhdHVzX2Jhci5pbm5lckhUTUwgPSAnbG9hZGluZyBzdGF0dXMuLi4nXHJcbiAgICAvKlxyXG4gICAgdmFyIHRpdGxlX2hlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJylcclxuICAgIHRpdGxlX2hlYWRlci5pbm5lckhUTUwgPSB0aXRsZVxyXG4gICAgYm9keS5pbnNlcnRCZWZvcmUodGl0bGVfaGVhZGVyLCBib2R5LmZpcnN0Q2hpbGQpXHJcbiAgICAqL1xyXG4gICAgYm9keS5pbnNlcnRCZWZvcmUoc3RhdHVzX2JhciwgYm9keS5maXJzdENoaWxkKVxyXG4gICAgLypcclxuICAgIHZhciB0YWJzX2RpdiA9IGsubWFrZV90YWJzKHNlY3Rpb25zKVxyXG4gICAgJCgnYm9keScpLmFwcGVuZCh0YWJzX2RpdilcclxuICAgICQoICcudGFicycgKS50YWJzKHsgXHJcbiAgICAgICAgYWN0aXZhdGU6IGZ1bmN0aW9uKCBldmVudCwgdWkgKSB7XHJcbiAgICAgICAgICAgIHZhciBmdWxsX3RpdGxlID0gdGl0bGUgKyBcIiAvIFwiICsgdWkubmV3VGFiWzBdLnRleHRDb250ZW50XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnRpdGxlID0gZnVsbF90aXRsZVxyXG4gICAgICAgICAgICAkKCcjdGl0bGUnKS50ZXh0KGZ1bGxfdGl0bGUpXHJcbiAgICAgICAgICAgIC8vZHVtcChtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKSlcclxuICAgICAgICAgICAgJC5zcGFya2xpbmVfZGlzcGxheV92aXNpYmxlKClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgdmFyIHNlY3Rpb24gPSBrLmdldFF1ZXJ5VmFyaWFibGUoJ3NlYycpXHJcbiAgICBpZihzZWN0aW9uIGluIHNlY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gJCgnLnRhYnMgYVtocmVmPVwiIycrc2VjdGlvbisnXCJdJykucGFyZW50KCkuaW5kZXgoKVxyXG4gICAgICAgICQoXCIudGFic1wiKS50YWJzKFwib3B0aW9uXCIsIFwiYWN0aXZlXCIsIGluZGV4KVxyXG4gICAgfVxyXG4gICAgKi9cclxuXHJcbn1cclxuLypcclxuay5tYWtlX3RhYnMgPSBmdW5jdGlvbihzZWN0aW9uX29iail7XHJcbiAgICB2YXIgdGFic19kaXYgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCd0YWJzJylcclxuICAgIHZhciBoZWFkX2RpdiA9ICQoJzx1bD4nKS5hcHBlbmRUbyh0YWJzX2RpdilcclxuXHJcbiAgICBmb3IgKHZhciBpZCBpbiBzZWN0aW9uX29iail7XHJcbiAgICAgICAgdmFyIHRpdGxlID0gc2VjdGlvbl9vYmpbaWRdXHJcbiAgICAgICAgLy8oJzxsaT48YSBocmVmPVwiIycraWQrJ1wiPicrdGl0bGUrJzwvYT48L2xpPicpKVxyXG4gICAgICAgIC8vKCc8ZGl2IGlkPVwiJytpZCsnXCI+PC9kaXY+JykpXHJcbiAgICB9ICAgXHJcbiAgICBcclxuICAgIHJldHVybiB0YWJzX2RpdlxyXG59XHJcblxyXG4qL1xyXG5rLnVwZGF0ZV9zdGF0dXNfcGFnZSA9IGZ1bmN0aW9uKHN0YXR1c19pZCwgYm9vdF90aW1lLCBzdHJpbmcpIHtcclxuICAgIHZhciBzdGF0dXNfZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3RhdHVzX2lkKVxyXG4gICAgc3RhdHVzX2Rpdi5pbm5lckhUTUwgPSBzdHJpbmdcclxuICAgIHN0YXR1c19kaXYuaW5uZXJIVE1MICs9ICcgfCAnXHJcblxyXG4gICAgdmFyIGNsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgICBjbG9jay5pbm5lckhUTUwgPSBtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKVxyXG5cclxuICAgIHZhciB1cHRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgIHVwdGltZS5pbm5lckhUTUwgPSAnVXB0aW1lOiAnICsgay51cHRpbWUoYm9vdF90aW1lKVxyXG4gICAgXHJcbiAgICBzdGF0dXNfZGl2LmFwcGVuZENoaWxkKGNsb2NrKVxyXG4gICAgc3RhdHVzX2Rpdi5pbm5lckhUTUwgKz0gJyB8ICdcclxuICAgIHN0YXR1c19kaXYuYXBwZW5kQ2hpbGQodXB0aW1lKVxyXG4gICAgc3RhdHVzX2Rpdi5pbm5lckhUTUwgKz0gJyB8ICdcclxufVxyXG5cclxuLypcclxuay5vYmpfbG9nID0gZnVuY3Rpb24ob2JqLCBvYmpfbmFtZSwgbWF4X2xldmVsKXtcclxuICAgIHZhciBsZXZlbHMgPSBmdW5jdGlvbihvYmosIGxldmVsX2luZGVudCwgc3RyKXtcclxuICAgICAgICBmb3IodmFyIG5hbWUgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gb2JqW25hbWVdXHJcbiAgICAgICAgICAgIGlmKCBsZXZlbF9pbmRlbnQgPD0gbWF4X2xldmVsICYmIHR5cGVvZihpdGVtKSA9PSAnb2JqZWN0JyApIHtcclxuICAgICAgICAgICAgICAgIHN0ciArPSBcIlxcblwiICsgay5zdHJfcmVwZWF0KFwiIFwiLCBsZXZlbF9pbmRlbnQqMikgKyBuYW1lIFxyXG4gICAgICAgICAgICAgICAgc3RyID0gbGV2ZWxzKGl0ZW0sIGxldmVsX2luZGVudCsxLCBzdHIgKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYodHlwZW9mIGl0ZW0gIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIHN0ciArPSBcIlxcblwiICsgay5zdHJfcmVwZWF0KFwiIFwiLCBsZXZlbF9pbmRlbnQqMikgKyBuYW1lICsgXCI6IFwiICsgaXRlbVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc3RyICs9IFwiXFxuXCIgKyBrLnN0cl9yZXBlYXQoXCIgXCIsIGxldmVsX2luZGVudCoyKSArIG5hbWUgKyBcIjogPGZ1bmN0aW9uPlwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0clxyXG4gICAgfVxyXG4gICAgdmFyIG1heF9sZXZlbCA9IG1heF9sZXZlbCB8fCAxMDBcclxuICAgIGNvbnNvbGUubG9nKG9ial9uYW1lKVxyXG4gICAgdmFyIHN0ciA9ICctJyArIG9ial9uYW1lICsgJy0nXHJcbiAgICBtYXhfbGV2ZWwrK1xyXG4gICAgbGV2ZWxfaW5kZW50ID0gMlxyXG4gICAgc3RyID0gbGV2ZWxzKG9iaiwgbGV2ZWxfaW5kZW50LCBzdHIpXHJcbiAgICBjb25zb2xlLmxvZyhzdHIpXHJcbn1cclxuXHJcblxyXG5rLm9ial90cmVlID0gZnVuY3Rpb24ob2JqLCB0aXRsZSl7XHJcbiAgICAvLyB0YWtlcyBhIGphdmFzY3JpcHQsIGFuZCByZXR1cmVucyBhIGpxdWVyeSBESVZcclxuICAgIHZhciBvYmpfZGl2ID0gJCgnPHByZT4nKSAvLy5hZGRDbGFzcygnYm94JylcclxuICAgIHZhciBsZXZlbHMgPSBmdW5jdGlvbihvYmosIGxldmVsX2luZGVudCl7KGxpbmUsIGNpcmNsZSwgdGV4dCApIFxyXG4gICAgICAgIHZhciBsaXN0ID0gW11cclxuICAgICAgICB2YXIgb2JqX2xlbmd0aCA9IDBcclxuICAgICAgICBmb3IoIHZhciBrZXkgaW4gb2JqKSB7b2JqX2xlbmd0aCsrfVxyXG4gICAgICAgIHZhciBjb3VudCA9IDAgICAgICAgICAgXHJcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gb2JqW2tleV1cclxuICAgICAgICAgICAgXHJcbi8vICAgICAgICAgICAgdmFyIGluZGVudF9zdHJpbmcgPSAnJm5ic3A7Jm5ic3A7Jm5ic3A7JiM5NDc0Jy5yZXBlYXQobGV2ZWwpICsgJyZuYnNwOyZuYnNwOyZuYnNwOydcclxuLy8gICAgICAgICAgICBpZihsZXZlbF9pbmRlbnQgPT09ICcnICl7XHJcbi8vICAgICAgICAgICAgICAgIG5leHRfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyZuYnNwOycgXHJcbi8vICAgICAgICAgICAgICAgIHRoaXNfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyZuYnNwOydcclxuLy8gICAgICAgICAgICB9IGVsc2UgXHJcbiAgICAgICAgICAgIGlmKGNvdW50ID09IG9ial9sZW5ndGgtMSApIHsgICAvLyBJZiBsYXN0IGl0ZW0sIGZpbnNoIHRyZWUgc2VjdGlvblxyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyZuYnNwOycgXHJcbiAgICAgICAgICAgICAgICB2YXIgdGhpc19sZXZlbF9pbmRlbnQgPSBsZXZlbF9pbmRlbnQgKyAnJm5ic3A7JiM5NDkyOyYjOTQ3MjsnIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7IFxyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyYjOTQ3NDsnIFxyXG4gICAgICAgICAgICAgICAgdmFyIHRoaXNfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyYjOTUwMDsmIzk0NzI7JyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKCB0eXBlb2YoaXRlbSkgPT0gJ29iamVjdCcgKXtcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaCggdGhpc19sZXZlbF9pbmRlbnQgKyBrZXkpXHJcbiAgICAgICAgICAgICAgICBsaXN0ID0gbGlzdC5jb25jYXQoIGxldmVscyhpdGVtLCBuZXh0X2xldmVsX2luZGVudCkgKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IGl0ZW0udG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLFwiIFwiKS5yZXBsYWNlKC9cXHMrL2csXCIgXCIpIC8vaHR0cDovL3d3dy50ZXh0Zml4ZXIuY29tL3R1dG9yaWFscy9qYXZhc2NyaXB0LWxpbmUtYnJlYWtzLnBocFxyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKHRoaXNfbGV2ZWxfaW5kZW50ICsga2V5K1wiOiBcIisgaXRlbSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgXHJcbi8vICAgICAgICAgICAgY29uc29sZS5sb2coa2V5LGxldmVsKVxyXG4gICAgICAgICAgICBjb3VudCsrXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICB2YXIgbGlzdCA9IFt0aXRsZV0uY29uY2F0KGxldmVscyhvYmosJycpKVxyXG4gICAgbGlzdC5mb3JFYWNoKCBmdW5jdGlvbihsaW5lLGtleSl7XHJcbiAgICAgICAgb2JqX2Rpdi5hcHBlbmQobGluZSArICc8L2JyPicpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIG9ial9kaXZcclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuay5vYmpfZGlzcGxheSA9IGZ1bmN0aW9uKG9iail7XHJcbiAgICBmdW5jdGlvbiBsZXZlbHMob2JqLGxldmVsKXtcclxuICAgIC8vICAgIHZhciBzdWJvYmpfZGl2ID0gJCgnPGRpdj4nKVxyXG4gICAgICAgIHZhciBzdWJvYmpfdWwgPSAkKCc8dWw+JykuYWRkQ2xhc3MoJ3RyZWUnKVxyXG5cclxuICAgICAgICBmb3IodmFyIGtleSBpbiBvYmopIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBvYmpba2V5XVxyXG4gICAgLy8gICAgICAgIGNvbnNvbGUubG9nKGtleSwgdHlwZW9mKGl0ZW0pKVxyXG4gICAgICAgICAgICBpZiggdHlwZW9mKGl0ZW0pID09ICdvYmplY3QnICl7XHJcbiAgICAvLyAgICAgICAgICAgICgnPGxpPicpLnRleHQoXCImbmJzcDtcIi5yZXBlYXQobGV2ZWwpICsga2V5KSlcclxuICAgICAgICAgICAgICAgICgnPGxpPicpLnRleHQoa2V5KSlcclxuICAgICAgICAgICAgICAgIHN1Ym9ial91bC5hcHBlbmQobGV2ZWxzKGl0ZW0sbGV2ZWwrMSkpXHJcbiAgICAvLyAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiJm5ic3A7XCIucmVwZWF0KGxldmVsKSArIGtleSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgICAgc3Vib2JqX2Rpdi5hcHBlbmQoJzxzcGFuPicpLnRleHQoXCImbmJzcDtcIi5yZXBlYXQobGV2ZWwpICsga2V5K1wiOiBcIisgaXRlbSlcclxuICAgIC8vICAgICAgICAgICAgKCc8bGk+JykudGV4dChcIiZuYnNwO1wiLnJlcGVhdChsZXZlbCkgKyBrZXkgK1wiOiBcIisgaXRlbSkpXHJcbiAgICAgICAgICAgICAgICAoJzxsaT4nKS50ZXh0KGtleSArXCI6IFwiKyBpdGVtKSlcclxuICAgIC8vICAgICAgICAgICAgY29uc29sZS5sb2coXCImbmJzcDtcIi5yZXBlYXQobGV2ZWwpICsga2V5K1wiOiBcIisgaXRlbSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3Vib2JqX3VsXHJcbiAgICB9XHJcbiAgICAvLyB0YWtlcyBhIGphdmFzY3JpcHQsIGFuZCByZXR1cmVucyBhIGpxdWVyeSBESVZcclxuICAgIHZhciBvYmpfZGl2ID0gJCgnPGRpdj4nKS8vLmFkZENsYXNzKCdib3gnKVxyXG4gICAgXHJcbiAgICBvYmpfZGl2LmFwcGVuZChsZXZlbHMob2JqLDApKVxyXG4gICAgcmV0dXJuIG9ial9kaXZcclxufVxyXG5cclxuay5zaG93X29iaiA9IGZ1bmN0aW9uKGNvbnRhaW5lcl9pZCwgb2JqLCBuYW1lKXtcclxuICAgIHZhciBpZCA9ICcjJyArIG5hbWVcclxuICAgIGlmKCAhICQoY29udGFpbmVyX2lkKS5jaGlsZHJlbihpZCkubGVuZ3RoICkgeyBcclxuICAgICAgICAoJzxkaXY+JykuYXR0cignaWQnLCBuYW1lKSkgXHJcbiAgICB9XHJcbiAgICB2YXIgYm94ID0gJChjb250YWluZXJfaWQpLmNoaWxkcmVuKGlkKVxyXG4gICAgYm94LmVtcHR5KClcclxuICAgIFxyXG4gICAgdmFyIG9ial9kaXYgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdib3gnKVxyXG4gICAgb2JqX2Rpdi5hcHBlbmQoay5vYmpfdHJlZShvYmosIG5hbWUpKVxyXG4gICAgYm94LmFwcGVuZChvYmpfZGl2KVxyXG4gICAgXHJcbn1cclxuXHJcbiovXHJcbmsubG9nX29iamVjdF90cmVlID0gZnVuY3Rpb24oY29tcG9uZW50cyl7XHJcbiAgICBmb3IoIHZhciBtYWtlIGluIGNvbXBvbmVudHMubW9kdWxlcyApe1xyXG4gICAgICAgIGlmKCBjb21wb25lbnRzLm1vZHVsZXMuaGFzT3duUHJvcGVydHkobWFrZSkpe1xyXG4gICAgICAgICAgICBmb3IoIHZhciBtb2RlbCBpbiBjb21wb25lbnRzLm1vZHVsZXNbbWFrZV0gKXtcclxuICAgICAgICAgICAgICAgIGlmKCBjb21wb25lbnRzLm1vZHVsZXNbbWFrZV0uaGFzT3duUHJvcGVydHkobW9kZWwpKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IGNvbXBvbmVudHMubW9kdWxlc1ttYWtlXVttb2RlbF1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgYSA9IFttYWtlLG1vZGVsXVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciggdmFyIHNwZWMgaW4gbyApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggby5oYXNPd25Qcm9wZXJ0eShzcGVjKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhLnB1c2gob1tzcGVjXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYS5qb2luKCcsJykpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBGU0VDIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuXHJcblxyXG5rLmNyMTAwMF9qc29uID0gZnVuY3Rpb24oanNvbil7XHJcbi8vICAgIHZhciBmaWVsZHMgPSBbXVxyXG4vLyAgICAkLmVhY2goanNvbi5oZWFkLmZpZWxkcywgZnVuY3Rpb24oa2V5LCBmaWVsZCkge1xyXG4vLyAgICAgICAgZmllbGRzLnB1c2goZmllbGQubmFtZSlcclxuLy8gICAgfSlcclxuLy8gICAgdmFyIGRhdGEgPSBfLnppcChmaWVsZHMsIGpzb24uZGF0YVswXS52YWxzKVxyXG4vLyAgICBcclxuICAgIHZhciB0aW1lc3RhbXAgPSBqc29uLmRhdGFbMF0udGltZVxyXG4gICAgdmFyIGRhdGEgPSB7fVxyXG4gICAgZGF0YS5UaW1lc3RhbXAgPSBqc29uLmRhdGFbMF0udGltZVxyXG4gICAgZGF0YS5SZWNvcmROdW0gPSBqc29uLmRhdGFbMF0ubm9cclxuICAgIGZvcih2YXIgaSA9IDAsIGwgPSBqc29uLmhlYWQuZmllbGRzLmxlbmd0aDsgaSA8IGw7IGkrKyApe1xyXG4gICAgICAgIGRhdGFbanNvbi5oZWFkLmZpZWxkc1tpXS5uYW1lXSA9IGpzb24uZGF0YVswXS52YWxzW2ldXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiBkYXRhXHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEQzIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG5cclxuay5kMyA9IHt9XHJcblxyXG5rLmQzLmxpdmVfc3BhcmtsaW5lID0gZnVuY3Rpb24oaWQsIGhpc3RvcnkpIHtcclxuICAgIHZhciBkYXRhID0gaGlzdG9yeS5hcnJheVxyXG4gICAgdmFyIGxlbmd0aCA9IGhpc3RvcnkuYXJyYXkubGVuZ3RoXHJcbiAgICB2YXIgbiA9IGhpc3RvcnkublxyXG4gICAgLy9rLmQzLmxpdmVfc3BhcmtsaW5lID0gZnVuY3Rpb24oaWQsIHdpZHRoLCBoZWlnaHQsIGludGVycG9sYXRpb24sIGFuaW1hdGUsIHVwZGF0ZURlbGF5LCB0cmFuc2l0aW9uRGVsYXkpIHtcclxuICAgIC8vIGJhc2VkIG9uIGNvZGUgcG9zdGVkIGJ5IEJlbiBDaHJpc3RlbnNlbiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9iZW5qY2hyaXN0ZW5zZW4vMTE0ODM3NFxyXG4gICAgXHJcbiAgICB2YXIgd2lkdGggPSA0MDAsXHJcbiAgICAgICAgaGVpZ2h0ID0gNTAsXHJcbiAgICAgICAgaW50ZXJwb2xhdGlvbiA9ICdiYXNpcycsXHJcbiAgICAgICAgYW5pbWF0ZSA9IHRydWUsXHJcbiAgICAgICAgdXBkYXRlRGVsYXkgPSAxMDAwLFxyXG4gICAgICAgIHRyYW5zaXRpb25EZWxheSA9IDEwMDBcclxuICAgIFxyXG4gICAgLy8gWCBzY2FsZSB3aWxsIGZpdCB2YWx1ZXMgZnJvbSAwLTEwIHdpdGhpbiBwaXhlbHMgMC0xMDBcclxuICAgIC8vIHN0YXJ0aW5nIHBvaW50IGlzIC01IHNvIHRoZSBmaXJzdCB2YWx1ZSBkb2Vzbid0IHNob3cgYW5kIHNsaWRlcyBvZmYgdGhlIGVkZ2UgYXMgcGFydCBvZiB0aGUgdHJhbnNpdGlvblxyXG4gICAgdmFyIHggPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDU5XSkucmFuZ2UoWzAsIHdpZHRoXSk7IFxyXG4gICAgLy8gWSBzY2FsZSB3aWxsIGZpdCB2YWx1ZXMgZnJvbSAwLTEwIHdpdGhpbiBwaXhlbHMgMC0xMDBcclxuICAgIHZhciB5ID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFsyMCwgNDBdKS5yYW5nZShbaGVpZ2h0LCAwXSk7XHJcblxyXG4gICAgLy8gY3JlYXRlIGEgbGluZSBvYmplY3QgdGhhdCByZXByZXNlbnRzIHRoZSBTVk4gbGluZSB3ZSdyZSBjcmVhdGluZ1xyXG4gICAgdmFyIGxpbmUgPSBkMy5zdmcubGluZSgpXHJcbiAgICAgICAgLy8gYXNzaWduIHRoZSBYIGZ1bmN0aW9uIHRvIHBsb3Qgb3VyIGxpbmUgYXMgd2Ugd2lzaFxyXG4gICAgICAgIC54KGZ1bmN0aW9uKGQsaSkgeyBcclxuICAgICAgICAgICAgLy8gdmVyYm9zZSBsb2dnaW5nIHRvIHNob3cgd2hhdCdzIGFjdHVhbGx5IGJlaW5nIGRvbmVcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnUGxvdHRpbmcgWCB2YWx1ZSBmb3IgZGF0YSBwb2ludDogJyArIGQgKyAnIHVzaW5nIGluZGV4OiAnICsgaSArICcgdG8gYmUgYXQ6ICcgKyB4KGkpICsgJyB1c2luZyBvdXIgeFNjYWxlLicpO1xyXG4gICAgICAgICAgICAvLyByZXR1cm4gdGhlIFggY29vcmRpbmF0ZSB3aGVyZSB3ZSB3YW50IHRvIHBsb3QgdGhpcyBkYXRhcG9pbnRcclxuICAgICAgICAgICAgcmV0dXJuIHgoaSk7IFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnkoZnVuY3Rpb24oZCkgeyBcclxuICAgICAgICAgICAgLy8gdmVyYm9zZSBsb2dnaW5nIHRvIHNob3cgd2hhdCdzIGFjdHVhbGx5IGJlaW5nIGRvbmVcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnUGxvdHRpbmcgWSB2YWx1ZSBmb3IgZGF0YSBwb2ludDogJyArIGQgKyAnIHRvIGJlIGF0OiAnICsgeShkKSArIFwiIHVzaW5nIG91ciB5U2NhbGUuXCIpO1xyXG4gICAgICAgICAgICAvLyByZXR1cm4gdGhlIFkgY29vcmRpbmF0ZSB3aGVyZSB3ZSB3YW50IHRvIHBsb3QgdGhpcyBkYXRhcG9pbnRcclxuICAgICAgICAgICAgcmV0dXJuIHkoZCk7IFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmludGVycG9sYXRlKGludGVycG9sYXRpb24pXHJcblxyXG4gICAgLy8gSWYgc3ZnIGRvZXMgbm90IGV4aXN0LCBjcmVhdGUgaXRcclxuICAgIGlmKCAhIGQzLnNlbGVjdCgnIycraWQpLnNlbGVjdCgnc3ZnJylbMF1bMF0gKXtcclxuICAgICAgICAvLyBjcmVhdGUgYW4gU1ZHIGVsZW1lbnQgaW5zaWRlIHRoZSAjZ3JhcGggZGl2IHRoYXQgZmlsbHMgMTAwJSBvZiB0aGUgZGl2XHJcbiAgICAgICAgdmFyIGdyYXBoID0gZDMuc2VsZWN0KCcjJytpZCkuYXBwZW5kKFwic3ZnOnN2Z1wiKS5hdHRyKFwid2lkdGhcIiwgd2lkdGgpLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLy8gZGlzcGxheSB0aGUgbGluZSBieSBhcHBlbmRpbmcgYW4gc3ZnOnBhdGggZWxlbWVudCB3aXRoIHRoZSBkYXRhIGxpbmUgd2UgY3JlYXRlZCBhYm92ZVxyXG4vLyAgICAgICAgZ3JhcGguYXBwZW5kKFwic3ZnOnBhdGhcIikuYXR0cihcImRcIiwgbGluZShkYXRhKSk7XHJcbiAgICAgICAgLy8gb3IgaXQgY2FuIGJlIGRvbmUgbGlrZSB0aGlzXHJcbiAgICAgICAgZ3JhcGguc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKFtkYXRhXSkuZW50ZXIoKS5hcHBlbmQoXCJzdmc6cGF0aFwiKS5hdHRyKFwiZFwiLCBsaW5lKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdmFyIGdyYXBoID0gZDMuc2VsZWN0KCcjJytpZCsnIHN2ZycpXHJcbiAgICBjb25zb2xlLmxvZyggbGVuZ3RoKVxyXG4gICAgLy8gdXBkYXRlIHdpdGggYW5pbWF0aW9uXHJcbiAgICBncmFwaC5zZWxlY3RBbGwoXCJwYXRoXCIpXHJcbiAgICAgICAgLmRhdGEoW2RhdGFdKSAvLyBzZXQgdGhlIG5ldyBkYXRhXHJcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyB4KG4tbGVuZ3RoICsxKSArIFwiKVwiKSAvLyBzZXQgdGhlIHRyYW5zZm9ybSB0byB0aGUgcmlnaHQgYnkgeCgxKSBwaXhlbHMgKDYgZm9yIHRoZSBzY2FsZSB3ZSd2ZSBzZXQpIHRvIGhpZGUgdGhlIG5ldyB2YWx1ZVxyXG4gICAgICAgIC5hdHRyKFwiZFwiLCBsaW5lKSAvLyBhcHBseSB0aGUgbmV3IGRhdGEgdmFsdWVzIC4uLiBidXQgdGhlIG5ldyB2YWx1ZSBpcyBoaWRkZW4gYXQgdGhpcyBwb2ludCBvZmYgdGhlIHJpZ2h0IG9mIHRoZSBjYW52YXNcclxuICAgICAgICAudHJhbnNpdGlvbigpIC8vIHN0YXJ0IGEgdHJhbnNpdGlvbiB0byBicmluZyB0aGUgbmV3IHZhbHVlIGludG8gdmlld1xyXG4gICAgICAgIC5lYXNlKFwibGluZWFyXCIpXHJcbiAgICAgICAgLmR1cmF0aW9uKHRyYW5zaXRpb25EZWxheSkgLy8gZm9yIHRoaXMgZGVtbyB3ZSB3YW50IGEgY29udGludWFsIHNsaWRlIHNvIHNldCB0aGlzIHRvIHRoZSBzYW1lIGFzIHRoZSBzZXRJbnRlcnZhbCBhbW91bnQgYmVsb3dcclxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIHgobi1sZW5ndGgpICsgXCIpXCIpOyAvLyBhbmltYXRlIGEgc2xpZGUgdG8gdGhlIGxlZnQgYmFjayB0byB4KDApIHBpeGVscyB0byByZXZlYWwgdGhlIG5ldyB2YWx1ZVxyXG5cclxuICAgICAgICAvKiB0aGFua3MgdG8gJ2JhcnJ5bScgZm9yIGV4YW1wbGVzIG9mIHRyYW5zZm9ybTogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vMTEzNzEzMSAqL1xyXG4vLyAgICAgZ3JhcGguYXBwZW5kKFwicmVjdFwiKVxyXG4vLyAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuLy8gICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbi8vICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodClcclxuLy8gICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcclxuLy8gICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsICcjZjAwJylcclxuLy8gICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIm5vbmVcIilcclxuLy8gICAgICAgICAgLnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsICcxcHgnKVxyXG4gICAgIFxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEV2ZW50cyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmsuZSA9IHt9XHJcblxyXG5rLnVwdGltZSA9IGZ1bmN0aW9uKGJvb3RfdGltZSl7XHJcbiAgICB2YXIgdXB0aW1lX3NlY29uZHNfdG90YWwgPSBtb21lbnQoKS5kaWZmKGJvb3RfdGltZSwgJ3NlY29uZHMnKVxyXG4gICAgdmFyIHVwdGltZV9ob3VycyA9IE1hdGguZmxvb3IoICB1cHRpbWVfc2Vjb25kc190b3RhbCAvKDYwKjYwKSApXHJcbiAgICB2YXIgbWludXRlc19sZWZ0ID0gdXB0aW1lX3NlY29uZHNfdG90YWwgJSg2MCo2MClcclxuICAgIHZhciB1cHRpbWVfbWludXRlcyA9IGsucGFkX3plcm8oIE1hdGguZmxvb3IoICBtaW51dGVzX2xlZnQgLzYwICksIDIgKVxyXG4gICAgdmFyIHVwdGltZV9zZWNvbmRzID0gay5wYWRfemVybyggKG1pbnV0ZXNfbGVmdCAlIDYwKSwgMiApXHJcbiAgICByZXR1cm4gdXB0aW1lX2hvdXJzICtcIjpcIisgdXB0aW1lX21pbnV0ZXMgK1wiOlwiKyB1cHRpbWVfc2Vjb25kc1xyXG59XHJcblxyXG5rLmUuYWRkVGltZVNpbmNlID0gZnVuY3Rpb24oZXZlbnRfbGlzdCl7XHJcbiAgICBjb25zb2xlLmxvZyhtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQnKSlcclxuICAgIGNvbnNvbGUubG9nKG1vbWVudCgpLmZyb21Ob3coKSlcclxuICAgIGV2ZW50X2xpc3QuZm9yRWFjaChmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgdmFyIGRhdGVfYXJyYXkgPSBldmVudC5kYXRlLnNwbGl0KCctJykubWFwKE51bWJlcilcclxuICAgICAgICB2YXIgeWVhciA9IGRhdGVfYXJyYXlbMF1cclxuICAgICAgICB2YXIgbW9udGggPSBkYXRlX2FycmF5WzFdXHJcbiAgICAgICAgdmFyIGRheSA9IGRhdGVfYXJyYXlbMl1cclxuICAgICAgICB2YXIgdGhpc195ZWFyID0gbW9tZW50KCkueWVhcigpXHJcbiAgICAgICAgaWYobW9tZW50KCkuZGlmZihtb21lbnQoW3RoaXNfeWVhciwgbW9udGgtMSwgZGF5XSksICdkYXlzJykgPiAwKSB7dGhpc195ZWFyKyt9XHJcbiAgICAgICAgdmFyIGV2ZW50X21vbWVudCA9IG1vbWVudChldmVudC5kYXRlLCAnWVlZWS1NTS1ERCcpXHJcbiAgICAgICAgdmFyIGRheXNfYWdvID0gbW9tZW50KCkuZGlmZihldmVudF9tb21lbnQsICdkYXknKVxyXG4gICAgICAgIGV2ZW50LnRpbWVfc2luY2UgPSBldmVudF9tb21lbnQuZnJvbU5vdygpXHJcbiAgICAgICAgZXZlbnQueWVhcnNfYWdvID0gbW9tZW50KCkuZGlmZihldmVudF9tb21lbnQsICd5ZWFycycpXHJcbiAgICAgICAgZXZlbnQuZGF5c190aWxsX25leHQgPSAtbW9tZW50KCkuZGlmZihtb21lbnQoW3RoaXNfeWVhciwgbW9udGgtMSwgZGF5XSksICdkYXlzJylcclxuICAgIH0pXHJcbiAgICBldmVudF9saXN0LnNvcnQoZnVuY3Rpb24oYSxiKXtcclxuICAgICAgICByZXR1cm4gYS5kYXlzX3RpbGxfbmV4dCAtIGIuZGF5c190aWxsX25leHRcclxuICAgIH0pXHJcbiAgICByZXR1cm4gZXZlbnRfbGlzdFxyXG59IFxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIERpc3BsYXlzIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmsuZCA9IHt9XHJcblxyXG4vKlxyXG5rLmQgPSB7XHJcbiAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgdmFsdWU6IDAsXHJcbiAgICBcclxufVxyXG5cclxuay5kLnByb3RvdHlwZS5zZXRQZXIgPSBmdW5jdGlvbihwZXJjZW50KXtcclxuICAgIHRoaXMuYmFyLmNzcygnd2lkdGgnLCBwZXJjZW50KyclJylcclxufVxyXG4qL1xyXG5cclxuXHJcbi8qXHJcbmsuZC5iYXIgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGJhciA9IHt9XHJcblxyXG4gICAgYmFyLndpZHRoID0gMTAwXHJcbiAgICBiYXIud2lkdGhfdW5pdCA9ICclJyBcclxuICAgIGJhci5oZWlnaHQgPSAnOHB4JyAgICBcclxuXHJcbiAgICBjb25zb2xlLmxvZyhiYXIud2lkdGgrJyUnKVxyXG4gICAgYmFyLmRpdiA9ICQoJzxkaXY+JykuY3NzKCd3aWR0aCcsICcwJScpXHJcbiAgICBiYXIuZWxlbWVudCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ3Byb2dyZXNzYmFyJykuY3NzKCd3aWR0aCcsIDEwMClcclxuICAgIGJhci5lbGVtZW50LmFwcGVuZChiYXIuZGl2KVxyXG5cclxuICAgIGJhci5zZXRQZXJjZW50ID0gZnVuY3Rpb24ocGVyY2VudCl7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHBlcmNlbnRcclxuICAgICAgICB0aGlzLndpZHRoX3VuaXQgPSAnJSdcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcbiAgICBiYXIudXBkYXRlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGlzLmRpdi5jc3MoJ3dpZHRoJywgdGhpcy53aWR0aCt0aGlzLndpZHRoX3VuaXQpXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNzcygnaGVpZ2h0JywgdG9TdHJpbmcodGhpcy5oZWlnaHQpKydweCcpXHJcbiAgICB9IFxyXG4gICAgcmV0dXJuIGJhclxyXG59XHJcbiovXHJcblxyXG5cclxuLy8gQnJvd3NlcmlmeVxyXG5tb2R1bGUuZXhwb3J0cyA9IGs7XHJcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBsb2cgPSBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xuXG52YXIgdmFsdWUgPSByZXF1aXJlKCcuL2tfRE9NX2V4dHJhLmpzJykudmFsdWU7XG52YXIgc2VsZWN0b3IgPSByZXF1aXJlKCcuL2tfRE9NX2V4dHJhLmpzJykuc2VsZWN0b3I7XG4vL2xvZyggJ3ZhbHVlJywgdmFsdWUoKSApO1xuLy9sb2coICdzZWxlY3RvcicsIHNlbGVjdG9yKCkgKTsgdmFyIGsgPSByZXF1aXJlKCcuL2snKTsgLy92YXIgc2VsZWN0b3IgPSByZXF1aXJlKCcuL2tfRE9NX2V4dHJhLmpzJykuc2VsZWN0b3I7IFxuXG5cbnZhciB3cmFwcGVyX3Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vd3JhcHBlcl9wcm90b3R5cGUnKTtcblxuLypcbnZhciB3cmFwcGVyX3Byb3RvdHlwZSA9IHtcblxuICAgIGh0bWw6IGZ1bmN0aW9uKGh0bWwpe1xuICAgICAgIHRoaXMuZWxlbS5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgYXBwZW5kOiBmdW5jdGlvbihzdWJfZWxlbWVudCl7XG4gICAgICAgIHRoaXMuZWxlbS5hcHBlbmRDaGlsZChzdWJfZWxlbWVudC5lbGVtKTsgXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgYXBwZW5kVG86IGZ1bmN0aW9uKHBhcmVudF9lbGVtZW50KXtcbiAgICAgICAgcGFyZW50X2VsZW1lbnQuYXBwZW5kKHRoaXMpOyBcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBhdHRyOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSApe1xuICAgICAgICB2YXIgYXR0cmlidXRlTmFtZTtcbiAgICAgICAgaWYoIG5hbWUgPT09ICdjbGFzcycpe1xuICAgICAgICAgICAgYXR0cmlidXRlTmFtZSA9ICdjbGFzc05hbWUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0cmlidXRlTmFtZSA9IG5hbWU7IFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbVthdHRyaWJ1dGVOYW1lXSA9IHZhbHVlOyBcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuXG5cbn07XG4qL1xuXG52YXIgV3JhcCA9IGZ1bmN0aW9uKGVsZW1lbnQpe1xuICAgIHZhciBXID0gT2JqZWN0LmNyZWF0ZSh3cmFwcGVyX3Byb3RvdHlwZSk7XG5cblxuICAgIFcuZWxlbSA9IGVsZW1lbnQ7XG4gICAgaWYoIFcuZWxlbS50YWdOYW1lID09PSBcIlNFTEVDVFwiICkge1xuICAgICAgICBXLnNldE9wdGlvbnMgPSBmdW5jdGlvbiggb3B0aW9uX2FycmF5ICkge1xuICAgICAgICAgICAgVy5lbGVtLm9wdGlvbnMubGVuZ3RoID0gMDsgXG4gICAgICAgICAgICAvL2xvZyhcIm9wdGlvbl9hcnJheVwiLCBvcHRpb25fYXJyYXkpO1xuICAgICAgICAgICAgb3B0aW9uX2FycmF5LmZvckVhY2goIGZ1bmN0aW9uKG9wdGlvbl9zdHIsaSl7XG4gICAgICAgICAgICAgICAgdmFyIG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICAgICAgICAgIG9wdC50ZXh0ID0gb3B0aW9uX3N0cjtcbiAgICAgICAgICAgICAgICBvcHQudmFsdWUgPSBvcHRpb25fc3RyO1xuICAgICAgICAgICAgICAgIFcuZWxlbS5hZGQob3B0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBXO1xuXG59O1xuXG52YXIgJCA9IGZ1bmN0aW9uKGlucHV0KXtcbiAgICB2YXIgZWxlbWVudDtcblxuICAgIGlmKCB0eXBlb2YgaW5wdXQgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAvL2xvZygnaW5wdXQgbmVlZGVkJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYoIGlucHV0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgKXtcbiAgICAgICAgcmV0dXJuIFdyYXAoaW5wdXQpO1xuICAgIH1cbiAgICBpZiggaW5wdXQuc3Vic3RyKDAsMSkgPT09ICcjJyApIHtcbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlucHV0LnN1YnN0cigxKSk7XG4gICAgICAgIHJldHVybiBXcmFwKGVsZW1lbnQpO1xuICAgIH0gZWxzZSBpZiggaW5wdXQuc3Vic3RyKDAsMSkgPT09ICcuJyApIHtcbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUNsYXNzTmFtZShpbnB1dC5zdWJzdHIoMSlbMF0pO1xuICAgICAgICByZXR1cm4gV3JhcChlbGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiggaW5wdXQgPT09ICd2YWx1ZScgKSB7XG4gICAgICAgICAgICBpZiggdmFsdWUgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gdmFsdWUoKTsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IHZhbHVlIG5vdCBkZWZpbmVkXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmKCBpbnB1dCA9PT0gJ3NlbGVjdG9yJyApIHtcbiAgICAgICAgICAgIGlmKCBzZWxlY3RvciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBzZWxlY3RvcigpOyBcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogc2VsZWN0b3Igbm90IGRlZmluZWRcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuIFdyYXAoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG5cblxufTtcblxuLy8gQnJvd3NlcmlmeVxubW9kdWxlLmV4cG9ydHMgPSAkO1xuLy9tb2R1bGUuZXhwb3J0cy53cmFwcGVyX3Byb3RvdHlwZSA9IHdyYXBwZXJfcHJvdG90eXBlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgayA9IHJlcXVpcmUoJy4vay5qcycpO1xudmFyIGtvbnRhaW5lciA9IHJlcXVpcmUoJy4va29udGFpbmVyJyk7XG5cbnZhciBrX0RPTSA9IHJlcXVpcmUoJy4va19ET00uanMnKTtcbnZhciB3cmFwcGVyX3Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vd3JhcHBlcl9wcm90b3R5cGUnKTtcblxuXG5cblxuXG5cbnZhciBzZWxlY3Rvcl9wcm90b3R5cGUgPSB7XG4gICAgY2hhbmdlOiBmdW5jdGlvbihuZXdfdmFsdWUpe1xuICAgICAgICB0aGlzLnNldF92YWx1ZSgpO1xuXG4gICAgICAgIGlmKCB0aGlzLmdfdXBkYXRlICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMuZ191cGRhdGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0X3ZhbHVlOiBmdW5jdGlvbigpe1xuICAgICAgICBpZiggdGhpcy5lbGVtLm9wdGlvbnNbdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXhdICl7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzZWxlY3RlZF92YWx1ZScsIHRoaXMuZWxlbS5vcHRpb25zW3RoaXMuZWxlbS5zZWxlY3RlZEluZGV4XS52YWx1ZSk7XG4gICAgICAgICAgICB2YXIgbmV3X3ZhbHVlID0gdGhpcy5lbGVtLm9wdGlvbnNbdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmKCB0aGlzLm9wdGlvbnNLb250YWluZXIucmVhZHkgKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdrb250YWluZXIgcmVhZHksIHNldHRpbmcgdG86ICcsIG5ld192YWx1ZSlcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLnNldChuZXdfdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzOyAgICBcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZygndXBkYXRpbmc6ICcsIHRoaXMpXG4gICAgICAgIHRoaXMudXBkYXRlX29wdGlvbnMoKTtcbiAgICAgICAgdGhpcy5zZXRfdmFsdWUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICB1cGRhdGVfb3B0aW9uczogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIHRoaXMua29udGFpbmVyLnJlYWR5ICkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRfdmFsdWUgPSB0aGlzLmtvbnRhaW5lci5nZXQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50X3ZhbHVlID0gbnVsbDsgXG4gICAgICAgIH1cblxuICAgICAgICBpZiggdGhpcy5vcHRpb25zS29udGFpbmVyLnJlYWR5ICkge1xuICAgICAgICAgICAgdmFyIG9sZF9vcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gdGhpcy5vcHRpb25zS29udGFpbmVyLmdldCgpO1xuICAgICAgICAgICAgaWYoIHRoaXMub3B0aW9ucyBpbnN0YW5jZW9mIEFycmF5ICl7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnVuc2hpZnQoJycpO1xuICAgICAgICAgICAgICAgIGlmKCBvbGRfb3B0aW9ucyAhPT0gdGhpcy5vcHRpb25zICl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLm9wdGlvbnMgIT09IHVuZGVmaW5lZCAmJiB0aGlzLm9wdGlvbnMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmZvckVhY2goZnVuY3Rpb24odmFsdWUsaWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgby52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCB2YWx1ZSA9PT0gY3VycmVudF92YWx1ZSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgby5zZWxlY3RlZCA9IFwic2VsZWN0ZWRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VsZWN0b3Jfb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgby5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtLmFwcGVuZENoaWxkKG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0b3Jfb2JqID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yX29iai5jaGFuZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCAhICh0aGlzLm9wdGlvbnMuaW5kZXhPZih0aGlzLmtvbnRhaW5lci5nZXQoKSkrMSkgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldF92YWx1ZSh0aGlzLm9wdGlvbnNbMF0udmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldFVwZGF0ZTogZnVuY3Rpb24odXBkYXRlX2Z1bmN0aW9uKXtcbiAgICAgICAgdGhpcy5nX3VwZGF0ZSA9IHVwZGF0ZV9mdW5jdGlvbjsgXG4gICAgICAgIHJldHVybiB0aGlzOyAgICBcbiAgICB9LFxuICAgIHNldFJlZjogZnVuY3Rpb24ocmVmU3RyaW5nKXtcbiAgICAgICAgdGhpcy5yZWZTdHJpbmcgPSByZWZTdHJpbmc7XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmVmT2JqZWN0ICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyID0gT2JqZWN0LmNyZWF0ZShrb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIucmVmKHRoaXMucmVmU3RyaW5nKTtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldFJlZk9iajogZnVuY3Rpb24ocmVmT2JqZWN0KXtcbiAgICAgICAgdGhpcy5yZWZPYmplY3QgPSByZWZPYmplY3Q7XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmVmU3RyaW5nICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyID0gT2JqZWN0LmNyZWF0ZShrb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIucmVmKHRoaXMucmVmU3RyaW5nKTtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMub3B0aW9uc0tvbnRhaW5lciA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmVmT3B0aW9uc1N0cmluZyAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNLb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMub3B0aW9uc0tvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zS29udGFpbmVyLnJlZih0aGlzLnJlZk9wdGlvbnNTdHJpbmcpO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zS29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXRPcHRpb25zUmVmOiBmdW5jdGlvbihyZWZTdHJpbmcpe1xuICAgICAgICB0aGlzLnJlZk9wdGlvbnNTdHJpbmcgPSByZWZTdHJpbmc7XG4gICAgICAgIGlmKCB0aGlzLm9wdGlvbnNLb250YWluZXIgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlZk9iamVjdCAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNLb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMub3B0aW9uc0tvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zS29udGFpbmVyLnJlZih0aGlzLnJlZk9wdGlvbnNTdHJpbmcpO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zS29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxufTtcbmZvciggdmFyIGlkIGluIHdyYXBwZXJfcHJvdG90eXBlICkge1xuICAgIGlmKCB3cmFwcGVyX3Byb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShpZCkgKSB7XG4gICAgICAgIHNlbGVjdG9yX3Byb3RvdHlwZVtpZF0gPSB3cmFwcGVyX3Byb3RvdHlwZVtpZF07IFxuICAgIH1cbn1cblxudmFyIHNlbGVjdG9yID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgcyA9IE9iamVjdC5jcmVhdGUoc2VsZWN0b3JfcHJvdG90eXBlKTtcbiAgICBzLnR5cGUgPSAnc2VsZWN0b3InO1xuICAgIHMuZWxlbT0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gICAgcy5lbGVtLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VsZWN0b3JfbWVudScpO1xuICAgIFxuICAgIHJldHVybiBzO1xufTtcblxuXG5cblxuXG52YXIgdmFsdWVfcHJvdG90eXBlID0ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZygncnVubmluZyB2YWx1ZSB1cGRhdGUnLCB0aGlzKVxuICAgICAgICAvKlxuICAgICAgICBpZiggdGhpcy5nX3VwZGF0ZSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLmdfdXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgKi9cbiAgICAgICAgaWYoIHR5cGVvZiB0aGlzLmtvbnRhaW5lciAhPT0gJ3VuZGVmaW5lZCcgKXtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLmtvbnRhaW5lci5nZXQoKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3VwZGF0aW5nIHZhbHVlJywgdGhpcy52YWx1ZSlcbiAgICAgICAgfVxuICAgICAgICBpZiggaXNOYU4oTnVtYmVyKHRoaXMudmFsdWUpKSApe1xuICAgICAgICAgICAgdGhpcy5lbGVtLmlubmVySFRNTCA9IHRoaXMudmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW0uaW5uZXJIVE1MID0gTnVtYmVyKHRoaXMudmFsdWUpLnRvRml4ZWQoMyk7XG4gICAgICAgICAgICBpZiggdGhpcy5taW4gIT09IHVuZGVmaW5lZCAmJiB0aGlzLnZhbHVlIDw9IHRoaXMubWluICkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0cignY2xhc3MnLCAndmFsdWVPdXRPZlJhbmdlJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoIHRoaXMubWF4ICE9PSB1bmRlZmluZWQgJiYgdGhpcy52YWx1ZSA+PSB0aGlzLm1heCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHIoJ2NsYXNzJywgJ3ZhbHVlT3V0T2ZSYW5nZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHIoJ2NsYXNzJywgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbihuZXdfdmFsdWUpIHtcbiAgICAgICAgaWYoIHR5cGVvZiBuZXdfdmFsdWUgIT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gbmV3X3ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4vLyAgICBzZXRVcGRhdGU6IGZ1bmN0aW9uKHVwZGF0ZV9mdW5jdGlvbil7XG4vLyAgICAgICAgdGhpcy5nX3VwZGF0ZSA9IHVwZGF0ZV9mdW5jdGlvbjsgXG4vLyAgICB9LFxuICAgIHNldFJlZjogZnVuY3Rpb24ocmVmU3RyaW5nKXtcbiAgICAgICAgdGhpcy5yZWZTdHJpbmcgPSByZWZTdHJpbmc7XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmVmT2JqZWN0ICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyID0gT2JqZWN0LmNyZWF0ZShrb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIucmVmKHRoaXMucmVmU3RyaW5nKTtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldFJlZk9iajogZnVuY3Rpb24ocmVmT2JqZWN0KXtcbiAgICAgICAgdGhpcy5yZWZPYmplY3QgPSByZWZPYmplY3Q7XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmVmU3RyaW5nICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyID0gT2JqZWN0LmNyZWF0ZShrb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIucmVmKHRoaXMucmVmU3RyaW5nKTtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXRNYXg6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgdGhpcy5tYXggPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXRNaW46IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgdGhpcy5taW4gPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbn07XG5mb3IoIHZhciBpZCBpbiB3cmFwcGVyX3Byb3RvdHlwZSApIHtcbiAgICBpZiggd3JhcHBlcl9wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoaWQpICkge1xuICAgICAgICB2YWx1ZV9wcm90b3R5cGVbaWRdID0gd3JhcHBlcl9wcm90b3R5cGVbaWRdOyBcbiAgICB9XG59XG5cblxuXG5mdW5jdGlvbiB2YWx1ZSgpIHtcbiAgICB2YXIgdiA9IE9iamVjdC5jcmVhdGUodmFsdWVfcHJvdG90eXBlKTtcbiAgICB2LnR5cGUgPSAndmFsdWUnO1xuICAgIHYuZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblxuICAgIHYudmFsdWUgPSAnLSc7XG4gICAgdi5pbm5lckhUTUwgPSB2LnZhbHVlO1xuICAgIHYucmVmZXJlbmNlID0gZmFsc2U7XG5cblxuICAgIHYudXBkYXRlKCk7XG5cbiAgICByZXR1cm4gdjtcbn1cblxuXG5cbi8vIEJyb3dzZXJpZnlcbm1vZHVsZS5leHBvcnRzLnNlbGVjdG9yID0gc2VsZWN0b3I7XG5tb2R1bGUuZXhwb3J0cy52YWx1ZSA9IHZhbHVlO1xuLy9tb2R1bGUuZXhwb3J0cy4kID0gJDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIga2RiX3Byb3RvdHlwZSA9IHtcbiAgICBzZXRfZmllbGRzOiBmdW5jdGlvbihmaWVsZF9hcnJheSkge1xuICAgICAgICB2YXIgbGlzdDtcbiAgICAgICAgaWYoIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdzdHJpbmcnICkgeyAgLy8gZWFjaCBhcmd1bWVudCBpcyBhIGZpZWxkXG4gICAgICAgICAgICBsaXN0ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTsgLy9jb252ZXJ0IGFyZ3VtZW50cyB0byBhbiBhcnJheVxuICAgICAgICB9IGVsc2UgeyAvLyBhc3N1bWVkIGxpc3Qgb2YgZmllbGRzXG4gICAgICAgICAgICBsaXN0ID0gYXJndW1lbnRbMF07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZpZWxkcyA9IFtdXG4gICAgICAgIGxpc3QuZm9yRWFjaCggZnVuY3Rpb24oZmllbGQpIHtcbiAgICAgICAgICAgIHRoaXMuZmllbGRzLnB1c2goZmllbGQpIDtcbiAgICAgICAgfSx0aGlzKSBcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgYWRkOiBmdW5jdGlvbihlbnRyeSkge1xuICAgICAgICB2YXIgbGlzdDtcbiAgICAgICAgdmFyIG9iaiA9IHt9O1xuXG4gICAgICAgIGlmKCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZW50cnkpID09PSAnW29iamVjdCBBcnJheV0nICkgeyAvLyBpZiBsaXN0IGlzIHN1Ym1pdHRlZFxuICAgICAgICAgICAgbGlzdCA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgfSBlbHNlIGlmKCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZW50cnkpID09PSAnW29iamVjdCBPYmplY3RdJyApIHsgLy8gaWYgb2JqZWN0IGlzIHN1Ym1pdHRlZFxuICAgICAgICAgICAgb2JqID0gYXJndW1lbnRzWzBdO1xuICAgICAgICB9IGVsc2UgeyAgLy8gZWFjaCBhcmd1bWVudCBpcyBhIGZpZWxkOiBzdHJpbmcsIG51bWJlciwgZXRjLlxuICAgICAgICAgICAgbGlzdCA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7IC8vY29udmVydCBhcmd1bWVudHMgdG8gYW4gYXJyYXlcbiAgICAgICAgfVxuICAgICAgICBpZiggbGlzdCAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgbGlzdC5mb3JFYWNoKCBmdW5jdGlvbiggdmFsdWUsIGkgKSB7XG4gICAgICAgICAgICAgICAgb2JqW3RoaXMuZmllbGRzW2ldXSA9IHZhbHVlO1xuICAgICAgICAgICAgfSx0aGlzKSBcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdGhpcy5yb3dzLnB1c2gob2JqKTtcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIENTVjogZnVuY3Rpb24oc3RyaW5nKXtcbiAgICBcbiAgICBcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24oZmllbGQsIHZhbHVlKXtcbiAgICAgICAgLy92YXIgaCA9IHRoaXMuZmllbGRzLmluZGV4T2YoY29sdW1uKTtcbiAgICAgICAgLy9sb2coaCwgdGhpcy5maWVsZHNbaF0pXG4gICAgICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICAgICAgdGhpcy5yb3dzLmZvckVhY2goIGZ1bmN0aW9uKHJvdyxpZCl7XG4gICAgICAgICAgICBpZiggcm93W2ZpZWxkXSA9PT0gdmFsdWUgKXtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChyb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LHRoaXMpICAgIFxuICAgICAgICBsb2cob3V0cHV0KVxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0sXG4gICAgY29sdW1uOiBmdW5jdGlvbihmaWVsZCl7XG4gICAgICAgIHZhciBjb2x1bW4gPSBbXTtcbiAgICAgICAgdGhpcy5yb3dzLmZvckVhY2goIGZ1bmN0aW9uKHJvdyl7XG4gICAgICAgICAgICBjb2x1bW4ucHVzaCggcm93W2ZpZWxkXSApO1xuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgIH0sXG59XG5cblxuZnVuY3Rpb24gS0RCKCkge1xuICAgIHZhciBkID0gT2JqZWN0LmNyZWF0ZShrZGJfcHJvdG90eXBlKTtcbiAgICBcbiAgICBkLnJvd3MgPSBbXTtcblxuXG5cbiAgICByZXR1cm4gZDtcbn1cblxuXG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGxvZyA9IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XG5cbnZhciBrb250YWluZXIgPSB7XG4gICAgcmVmOiBmdW5jdGlvbihyZWZTdHJpbmcpe1xuICAgICAgICBpZiggdHlwZW9mIHJlZlN0cmluZyA9PT0gJ3VuZGVmaW5lZCcgKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlZlN0cmluZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVmU3RyaW5nID0gcmVmU3RyaW5nO1xuICAgICAgICAgICAgdGhpcy5yZWZBcnJheSA9IHJlZlN0cmluZy5zcGxpdCgnLicpO1xuICAgICAgICAgICAgaWYoIHR5cGVvZiB0aGlzLm9iamVjdCAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9iajogZnVuY3Rpb24ob2JqKXtcbiAgICAgICAgaWYoIHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vYmplY3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9iamVjdCA9IG9iajtcbiAgICAgICAgICAgIGlmKCB0eXBlb2YgdGhpcy5yZWZTdHJpbmcgIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKGlucHV0KXtcbiAgICAgICAgLy9sb2coJ2tvbnRhaW5lciBzZXR0aW5nIHRvICcsIHRoaXMucmVmU3RyaW5nLCBpbnB1dClcbiAgICAgICAgaWYoIHR5cGVvZiB0aGlzLm9iamVjdCA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHRoaXMucmVmU3RyaW5nID09PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLm9iamVjdDtcbiAgICAgICAgdmFyIGxhc3RfbGV2ZWwgPSB0aGlzLnJlZkFycmF5W3RoaXMucmVmQXJyYXkubGVuZ3RoLTFdO1xuICAgICAgICAvL2xvZygnbGFzdF9sZXZlbCcsbGFzdF9sZXZlbClcblxuICAgICAgICB0aGlzLnJlZkFycmF5LmZvckVhY2goZnVuY3Rpb24obGV2ZWxfbmFtZSxpKXtcbiAgICAgICAgICAgIGlmKCB0eXBlb2YgcGFyZW50W2xldmVsX25hbWVdID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRbbGV2ZWxfbmFtZV0gPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCBsZXZlbF9uYW1lICE9PSBsYXN0X2xldmVsICl7XG4gICAgICAgICAgICAgICAgLy9sb2coJ21vdmluZyB0byAnLCBsZXZlbF9uYW1lKVxuICAgICAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudFtsZXZlbF9uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vbG9nKCdwYXJlbnQnLHBhcmVudCk7XG4gICAgICAgIHBhcmVudFtsYXN0X2xldmVsXSA9IGlucHV0O1xuICAgICAgICAvL2xvZyh0aGlzLmdldCgpKVxuICAgICAgICByZXR1cm4gcGFyZW50W2xhc3RfbGV2ZWxdO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbGV2ZWwgPSB0aGlzLm9iamVjdDtcbiAgICAgICAgdGhpcy5yZWZBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldmVsX25hbWUsaSl7XG4gICAgICAgICAgICBpZiggdHlwZW9mIGxldmVsW2xldmVsX25hbWVdID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgICAgICAvL2xvZygna29udGFpbmVyOiAnK2xldmVsX25hbWUrJyBub3QgZGVmaW5lZCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldmVsID0gbGV2ZWxbbGV2ZWxfbmFtZV07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbGV2ZWw7XG4gICAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga29udGFpbmVyO1xuIiwidmFyIHdyYXBwZXJfcHJvdG90eXBlID0ge1xuXG4gICAgaHRtbDogZnVuY3Rpb24oaHRtbCl7XG4gICAgICAgdGhpcy5lbGVtLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBhcHBlbmQ6IGZ1bmN0aW9uKHN1Yl9lbGVtZW50KXtcbiAgICAgICAgdGhpcy5lbGVtLmFwcGVuZENoaWxkKHN1Yl9lbGVtZW50LmVsZW0pOyBcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBhcHBlbmRUbzogZnVuY3Rpb24ocGFyZW50X2VsZW1lbnQpe1xuICAgICAgICBwYXJlbnRfZWxlbWVudC5hcHBlbmQodGhpcyk7IFxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGF0dHI6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlICl7XG4gICAgICAgIHZhciBhdHRyaWJ1dGVOYW1lO1xuICAgICAgICBpZiggbmFtZSA9PT0gJ2NsYXNzJyl7XG4gICAgICAgICAgICBhdHRyaWJ1dGVOYW1lID0gJ2NsYXNzTmFtZSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVOYW1lID0gbmFtZTsgXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtW2F0dHJpYnV0ZU5hbWVdID0gdmFsdWU7IFxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNsaWNrOiBmdW5jdGlvbihjbGlja0Z1bmN0aW9uKXtcbiAgICAgICAgY29uc29sZS5sb2coJ3NldHRpbmcgY2xpY2sgdG8gJywgdHlwZW9mIGNsaWNrRnVuY3Rpb24sIGNsaWNrRnVuY3Rpb24pXG4gICAgICAgIHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXsgY2xpY2tGdW5jdGlvbigpOyB9LCBmYWxzZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgLypcbiAgICBwdXNoVG86IGZ1bmN0aW9uKGFycmF5KXtcbiAgICAgICAgYXJyYXkucHVzaCh0aGlzKTtcbiAgICB9XG4gICAgKi9cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB3cmFwcGVyX3Byb3RvdHlwZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIHZlcnNpb25fc3RyaW5nID0gXCJEZXZfYnJhbmNoXCJcblxudmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG52YXIgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XG52YXIgayA9IHJlcXVpcmUoJy4vbGliL2svay5qcycpO1xudmFyIGtfZGF0YSA9IHJlcXVpcmUoJy4vbGliL2sva19kYXRhLmpzJyk7XG52YXIgJCA9IHJlcXVpcmUoJy4vbGliL2sva19ET00nKTtcblxudmFyIHNldHRpbmdzID0gcmVxdWlyZSgnLi9hcHAvc2V0dGluZ3MuanMnKTtcbnZhciBsb2FkVGFibGVzID0gcmVxdWlyZSgnLi9hcHAvc2V0dGluZ3NfZnVuY3Rpb25zJykubG9hZFRhYmxlcztcbnZhciBsb2FkTW9kdWxlcyA9IHJlcXVpcmUoJy4vYXBwL3NldHRpbmdzX2Z1bmN0aW9ucycpLmxvYWRNb2R1bGVzO1xudmFyIGxvYWRDb21wb25lbnRzID0gcmVxdWlyZSgnLi9hcHAvc2V0dGluZ3NfZnVuY3Rpb25zJykubG9hZENvbXBvbmVudHM7XG52YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vYXBwL21rX2RyYXdpbmcuanMnKTtcbnZhciBkaXNwbGF5X3N2ZyA9IHJlcXVpcmUoJy4vYXBwL2Rpc3BsYXlfc3ZnLmpzJyk7XG52YXIgdXBkYXRlX3N5c3RlbSA9IHJlcXVpcmUoJy4vYXBwL3VwZGF0ZV9zeXN0ZW0nKTtcblxudmFyIGNvbXBvbmVudHMgPSBzZXR0aW5ncy5jb21wb25lbnRzO1xudmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcblxuc2V0dGluZ3Muc3RhdHVzLnZlcnNpb25fc3RyaW5nID0gdmVyc2lvbl9zdHJpbmc7XG5cbi8qXG5mdW5jdGlvbiBsb29rdXBMb2NhdGlvbihwb3NpdGlvbil7XG4gICAgdmFyIHVybCA9ICdodHRwOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9nZW9jb2RlL2pzb24/bGF0bG5nPScrcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlKycsJytwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKycmc2Vuc29yPXRydWUnO1xuICAgIGsuQUpBWCh1cmwsIHNob3dMb2NhdGlvbik7XG59XG5mdW5jdGlvbiBzaG93TG9jYXRpb24obG9jYXRpb25fanNvbil7XG4gICAgdmFyIGxvY2F0aW9uID0gSlNPTi5wYXJzZShsb2NhdGlvbl9qc29uKTtcbiAgICBsb2NhdGlvbi5yZXN1bHRzWzBdLmFkZHJlc3NfY29tcG9uZW50cy5mb3JFYWNoKCBmdW5jdGlvbihjb21wb25lbnQpe1xuICAgICAgICBpZiggY29tcG9uZW50LnR5cGVzWzBdID09PSBcImxvY2FsaXR5XCIgKSB7XG4gICAgICAgICAgICBzeXN0ZW0uY2l0eSA9IGNvbXBvbmVudC5sb25nX25hbWUgO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnY2l0eSAnLCBzeXN0ZW0uY2l0eSkgXG4gICAgICAgIH0gZWxzZSBpZiggY29tcG9uZW50LnR5cGVzWzBdID09PSBcImFkbWluaXN0cmF0aXZlX2FyZWFfbGV2ZWxfMlwiICl7XG4gICAgICAgICAgICBzeXN0ZW0uY291bnR5ID0gY29tcG9uZW50LmxvbmdfbmFtZSA7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdjb3VudHkgJywgc3lzdGVtLmNvdW50eSlcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHVwZGF0ZV9zeXN0ZW0oc2V0dGluZ3MpO1xufVxuKi9cblxuZnVuY3Rpb24gdXBkYXRlKCl7XG4gICAgY29uc29sZS5sb2coJ3VwZGF0aW5nJyk7XG5cbiAgICB1cGRhdGVfc3lzdGVtKHNldHRpbmdzKTtcblxuICAgIHNldHRpbmdzLnNlbGVjdF9yZWdpc3RyeS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICBpdGVtLnVwZGF0ZSgpOyBcbiAgICB9KTtcblxuICAgIC8vdXBkYXRlX3N5c3RlbShzZXR0aW5ncyk7XG5cbiAgICBzZXR0aW5ncy52YWx1ZV9yZWdpc3RyeS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xuICAgICAgICBpdGVtLnVwZGF0ZSgpOyBcbiAgICB9KTtcblxuICAgIC8vIE1ha2UgZHJhd2luZ1xuICAgIHNldHRpbmdzLmVsZW1lbnRzID0gbWtfZHJhd2luZyhzZXR0aW5ncyk7XG4gICAgLy8gQWRkIGRyYXdpbmcgZWxlbWVudHMgdG8gU1ZHIG9uIHNjcmVlblxuICAgIGRpc3BsYXlfc3ZnKHNldHRpbmdzLCBzdmdfY29udGFpbmVyKTtcblxuICAgIGNvbnNvbGUubG9nKCdzZXR0aW5ncycsIHNldHRpbmdzKVxufVxuXG5cbi8vay5BSkFYKCdkYXRhL3RhYmxlcy50eHQnLCBsb2FkVGFibGVzLCBzZXR0aW5ncyk7XG5rLkFKQVgoJ2RhdGEvdGFibGVzLnR4dCcsIHJlYWR5LCB7dHlwZTonbG9hZFRhYmxlcyd9KTtcblxuLy9rLkFKQVgoICdkYXRhL21vZHVsZXMuY3N2JywgbG9hZE1vZHVsZXMsIHNldHRpbmdzICk7XG5rLkFKQVgoICdkYXRhL21vZHVsZXMuY3N2JywgcmVhZHksIHt0eXBlOidsb2FkTW9kdWxlcyd9KTtcbmsuQUpBWCggJ2RhdGEvaW52ZXJ0ZXJzLmNzdicsIHJlYWR5LCB7dHlwZTonaW52ZXJ0ZXJzJ30pO1xuXG5cblxudmFyIHJlYWR5X2NvdW50ID0gMDtcbmZ1bmN0aW9uIHJlYWR5KGlucHV0LCBjb25maWcpe1xuXG4gICAgaWYoIGNvbmZpZy50eXBlID09PSAnbG9hZFRhYmxlcycpe1xuICAgICAgICBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5ORUNfdGFibGVzID0gbG9hZFRhYmxlcyhpbnB1dCk7XG4gICAgICAgIHJlYWR5X2NvdW50Kys7XG4gICAgfVxuICAgIGlmKCBjb25maWcudHlwZSA9PT0gJ2xvYWRNb2R1bGVzJyl7XG4gICAgICAgIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZXMgPSBsb2FkQ29tcG9uZW50cyhpbnB1dCk7XG4gICAgICAgIHJlYWR5X2NvdW50Kys7XG4gICAgfVxuICAgIGlmKCBjb25maWcudHlwZSA9PT0gJ2ludmVydGVycycpe1xuICAgICAgICBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnMgPSBsb2FkQ29tcG9uZW50cyhpbnB1dCk7XG4gICAgICAgIHJlYWR5X2NvdW50Kys7XG4gICAgfVxuXG4gICAgaWYoIHJlYWR5X2NvdW50ID09PSAzICl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWFkeScpO1xuICAgICAgICBzZXR0aW5ncy5zdGF0dXMuZGF0YV9sb2FkZWQgPSB0cnVlO1xuICAgICAgICB1cGRhdGUoc2V0dGluZ3MpO1xuICAgIH1cbn1cblxuXG4vLyAjIFBhZ2Ugc2V0dXBcblxudmFyIHN2Z19jb250YWluZXJfaWQgPSAnc3ZnX2NvbnRhaW5lcic7XG52YXIgc3ZnX2NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHN2Z19jb250YWluZXJfaWQpO1xudmFyIHN5c3RlbV9jb250YWluZXJfaWQgPSAnc3lzdGVtX2NvbnRhaW5lcic7XG5cblxudmFyIHRpdGxlID0gJ1BWIGRyYXdpbmcgdGVzdCc7XG5cbmsuc2V0dXBfYm9keSh0aXRsZSk7XG52YXIgZHJhd19wYWdlID0gJCgnZGl2JykuYXR0cignaWQnLCAnZHJhd2luZ19wYWdlJyk7XG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRyYXdfcGFnZS5lbGVtKTtcblxudmFyIHN5c3RlbV9jb250YWluZXIgPSAkKCdkaXYnKS5hdHRyKCdpZCcsIHN5c3RlbV9jb250YWluZXJfaWQpLmFwcGVuZFRvKGRyYXdfcGFnZSk7XG5cbnZhciBzdmdfY29udGFpbmVyX29iamVjdCA9ICQoJ2RpdicpLmF0dHIoJ2lkJywgc3ZnX2NvbnRhaW5lcl9pZCkuYXBwZW5kVG8oZHJhd19wYWdlKTtcbnZhciBzdmdfY29udGFpbmVyID0gc3ZnX2NvbnRhaW5lcl9vYmplY3QuZWxlbTtcblxuXG5cbnZhciBwYWdlX3NlY3Rpb25zID0ge1xuICAgIHRpdGxlOiBbXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCdQbGVhc2Ugc2VsZWN0IHlvdXIgc3lzdGVtIHNwZWMgYmVsb3cnKS5hdHRyKCdjbGFzcycsICdzZWN0aW9uVGl0bGUnKSxcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJyB8ICcpLFxuICAgICAgICAvLyQoJ2lucHV0JykuYXR0cigndHlwZScsICdidXR0b24nKS5hdHRyKCd2YWx1ZScsICdjbGVhciBzZWxlY3Rpb25zJykuY2xpY2sod2luZG93LmxvY2F0aW9uLnJlbG9hZCksXG4gICAgICAgICQoJ2EnKS5hdHRyKCdocmVmJywgJ2phdmFzY3JpcHQ6d2luZG93LmxvY2F0aW9uLnJlbG9hZCgpJykuaHRtbCgnY2xlYXIgc2VsZWN0aW9ucycpLFxuICAgICAgICAvKlxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnSVAgbG9jYXRpb24gfCcpLFxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnQ2l0eTogJyksXG4gICAgICAgICQoJ3ZhbHVlJykuc2V0UmVmKCdzeXN0ZW0uY2l0eScpLFxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnIHwgJyksXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCdDb3VudHk6ICcpLFxuICAgICAgICAkKCd2YWx1ZScpLnNldFJlZignc3lzdGVtLmNvdW50eScpLFxuICAgICAgICAkKCdicicpLFxuICAgICAgICAvLyovXG4gICAgXSxcbiAgICBtb2R1bGVzOiBbXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCdNb2R1bGUnKS5hdHRyKCdjbGFzcycsICdzZWN0aW9uVGl0bGUnKSxcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJyB8ICcpLFxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnTW9kdWxlIG1ha2U6ICcpLFxuICAgICAgICAvLyQoJ3NlbGVjdG9yJykgLnNldE9wdGlvbnNSZWYoICdjb21wb25lbnRzLm1vZHVsZU1ha2VBcnJheScgKSAuc2V0UmVmKCdzeXN0ZW0ucHZfbWFrZScpLFxuICAgICAgICAkKCdzZWxlY3RvcicpIC5zZXRPcHRpb25zUmVmKCAnc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlTWFrZUFycmF5JyApIC5zZXRSZWYoJ3N5c3RlbS5EQy5tb2R1bGUubWFrZScpLFxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnIHwgJyksXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCdNb2R1bGUgbW9kZWw6ICcpLFxuICAgICAgICAvLyQoJ3NlbGVjdG9yJykuc2V0T3B0aW9uc1JlZiggJ2NvbXBvbmVudHMubW9kdWxlTW9kZWxBcnJheScgKS5zZXRSZWYoJ3N5c3RlbS5wdl9tb2RlbCcpLFxuICAgICAgICAkKCdzZWxlY3RvcicpLnNldE9wdGlvbnNSZWYoICdzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVNb2RlbEFycmF5JyApLnNldFJlZignc3lzdGVtLkRDLm1vZHVsZS5tb2RlbCcpLFxuICAgICAgICAkKCdicicpLFxuXG4gICAgXSxcbiAgICBtb2R1bGVzX3BhcmFtczogW1xuICAgICAgICAkKCdzcGFuJykuaHRtbCgnUG1wOiAnKSxcbiAgICAgICAgJCgndmFsdWUnKS5zZXRSZWYoJ3N5c3RlbS5EQy5tb2R1bGUuc3BlY3MuUG1wJyksXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCcgfCAnKSxcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJ0lzYzogJyksXG4gICAgICAgICQoJ3ZhbHVlJykuc2V0UmVmKCdzeXN0ZW0uREMubW9kdWxlLnNwZWNzLklzYycpLFxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnIHwgJyksXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCdWb2M6ICcpLFxuICAgICAgICAkKCd2YWx1ZScpLnNldFJlZignc3lzdGVtLkRDLm1vZHVsZS5zcGVjcy5Wb2MnKSxcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJyB8ICcpLFxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnSW1wOiAnKSxcbiAgICAgICAgJCgndmFsdWUnKS5zZXRSZWYoJ3N5c3RlbS5EQy5tb2R1bGUuc3BlY3MuSW1wJyksXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCcgfCAnKSxcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJ1ZtcDogJyksXG4gICAgICAgICQoJ3ZhbHVlJykuc2V0UmVmKCdzeXN0ZW0uREMubW9kdWxlLnNwZWNzLlZtcCcpLFxuICAgIF0sXG4gICAgYXJyYXk6IFtcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJ0FycmF5JykuYXR0cignY2xhc3MnLCAnc2VjdGlvblRpdGxlJyksXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCcgfCAnKSxcblxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnTnVtYmVyIG9mIHN0cmluZ3M6ICcpLFxuICAgICAgICAkKCdzZWxlY3RvcicpLnNldE9wdGlvbnNSZWYoICdjb25maWdfb3B0aW9ucy5zdHJpbmdfbnVtX29wdGlvbnMnKS5zZXRSZWYoJ3N5c3RlbS5EQy5zdHJpbmdfbnVtJyksXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCcgfCAnKSxcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJ051bWJlciBvZiBtb2R1bGVzIHBlciBzdHJpbmc6ICcpLFxuICAgICAgICAkKCdzZWxlY3RvcicpLnNldE9wdGlvbnNSZWYoICdjb25maWdfb3B0aW9ucy5zdHJpbmdfbW9kdWxlc19vcHRpb25zJykuc2V0UmVmKCdzeXN0ZW0uREMuc3RyaW5nX21vZHVsZXMnKSxcbiAgICAgICAgLy8kKCdzcGFuJykuaHRtbCgnIHwgJyksXG4gICAgICAgICQoJ2JyJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJ1BtcDogJyksXG4gICAgICAgICQoJ3ZhbHVlJykuc2V0UmVmKCdzeXN0ZW0uREMuYXJyYXkuUG1wJyksXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCcgfCAnKSxcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJ0lzYzogJyksXG4gICAgICAgICQoJ3ZhbHVlJykuc2V0UmVmKCdzeXN0ZW0uREMuYXJyYXkuSXNjJyksXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCcgfCAnKSxcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJ1ZvYzogJyksXG4gICAgICAgICQoJ3ZhbHVlJykuc2V0UmVmKCdzeXN0ZW0uREMuYXJyYXkuVm9jJykuc2V0TWF4KDYwMCkuYXR0cignaWQnLCAnRENfdm9sdCcpLCxcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJyB8ICcpLFxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnSW1wOiAnKSxcbiAgICAgICAgJCgndmFsdWUnKS5zZXRSZWYoJ3N5c3RlbS5EQy5hcnJheS5JbXAnKSxcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJyB8ICcpLFxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnVm1wOiAnKSxcbiAgICAgICAgJCgndmFsdWUnKS5zZXRSZWYoJ3N5c3RlbS5EQy5hcnJheS5WbXAnKSxcbiAgICBdLFxuICAgIERDOiBbXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCdEQycpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25UaXRsZScpLFxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnIHwgJyksXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCdEQyBob21lIHJ1biBsZW5ndGggKGZ0KTogJyksXG4gICAgICAgICQoJ3NlbGVjdG9yJykuc2V0T3B0aW9uc1JlZignY29uZmlnX29wdGlvbnMuRENfaG9tZXJ1bl9sZWd0aHMnKS5zZXRSZWYoJ3N5c3RlbS5EQy5ob21lcnVuX2xlbmd0aCcpLFxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnIHwgJyksXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCdEQyBob21lIHJ1biBBV0c6ICcpLFxuICAgICAgICAkKCdzZWxlY3RvcicpLnNldE9wdGlvbnNSZWYoJ2NvbmZpZ19vcHRpb25zLkRDX2hvbWVydW5fQVdHX29wdGlvbnMnKS5zZXRSZWYoJ2NvbmZpZ19vcHRpb25zLkRDX2hvbWVydW5fQVdHJyksXG5cbiAgICBdLFxuICAgIGludmVydGVyOiBbXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCdJbnZlcnRlcicpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25UaXRsZScpLFxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnIHwgJyksXG5cbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJ0ludmVydGVyIG1ha2U6ICcpLFxuICAgICAgICAvLyQoJ3NlbGVjdG9yJykgLnNldE9wdGlvbnNSZWYoICdjb21wb25lbnRzLm1vZHVsZU1ha2VBcnJheScgKSAuc2V0UmVmKCdzeXN0ZW0ucHZfbWFrZScpLFxuICAgICAgICAkKCdzZWxlY3RvcicpIC5zZXRPcHRpb25zUmVmKCAnc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJNYWtlQXJyYXknICkgLnNldFJlZignc3lzdGVtLmludmVydGVyLm1ha2UnKSxcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJyB8ICcpLFxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnSW52ZXJ0ZXIgbW9kZWw6ICcpLFxuICAgICAgICAvLyQoJ3NlbGVjdG9yJykuc2V0T3B0aW9uc1JlZiggJ2NvbXBvbmVudHMubW9kdWxlTW9kZWxBcnJheScgKS5zZXRSZWYoJ3N5c3RlbS5wdl9tb2RlbCcpLFxuICAgICAgICAkKCdzZWxlY3RvcicpLnNldE9wdGlvbnNSZWYoICdzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlck1vZGVsQXJyYXknICkuc2V0UmVmKCdzeXN0ZW0uaW52ZXJ0ZXIubW9kZWwnKSxcblxuICAgIF0sXG4gICAgQUM6IFtcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJ0FDJykuYXR0cignY2xhc3MnLCAnc2VjdGlvblRpdGxlJyksXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCcgfCAnKSxcblxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnQUMgbG9hZGNlbnRlciB0eXBlOiAnKSxcbiAgICAgICAgJCgnc2VsZWN0b3InKS5zZXRPcHRpb25zUmVmKCAnY29uZmlnX29wdGlvbnMuQUNfbG9hZGNlbnRlcl90eXBlX29wdGlvbnMnKS5zZXRSZWYoJ3N5c3RlbS5BQ19sb2FkY2VudGVyX3R5cGUnKSxcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJ0FDIHR5cGU6ICcpLFxuICAgICAgICAvLyQoJ3NlbGVjdG9yJykuc2V0T3B0aW9uc1JlZiggJ2NvbmZpZ19vcHRpb25zLkFDX3R5cGVfb3B0aW9ucycpLnNldFJlZignc3lzdGVtLkFDX3R5cGUnKSxcbiAgICAgICAgJCgnc2VsZWN0b3InKS5zZXRPcHRpb25zUmVmKCAnc3lzdGVtLkFDX3R5cGVzX2F2YWlsaWJsZScpLnNldFJlZignc3lzdGVtLkFDX3R5cGUnKSxcbiAgICAgICAgJCgnYnInKSxcblxuICAgIF0sXG59XG5cbnZhciBzZWN0aW9ucyA9IHNldHRpbmdzLnN0YXR1cy5zZWN0aW9ucztcblxuLy8gRGV2IHNldHRpbmdzXG5pZiggdmVyc2lvbl9zdHJpbmcgPT09ICdEZXYnICYmIHRydWUgKXtcbiAgICBmb3IoIHZhciBzZWN0aW9uIGluIHNldHRpbmdzLnN0YXR1cy5zZWN0aW9ucyApe1xuICAgICAgICBzZXR0aW5ncy5zdGF0dXMuc2VjdGlvbnNbc2VjdGlvbl0ucmVhZHkgPSB0cnVlO1xuICAgICAgICBzZXR0aW5ncy5zdGF0dXMuc2VjdGlvbnNbc2VjdGlvbl0uc2V0ID0gdHJ1ZTtcbiAgICB9O1xufSBlbHNlIHtcbiAgICBzZXR0aW5ncy5zdGF0dXMuc2VjdGlvbnMubW9kdWxlcy5yZWFkeSA9IHRydWU7XG59XG4vLy8vLy8vL1xuXG5cbmZ1bmN0aW9uIHNob3dfc2VjdGlvbihzZWN0aW9uKXtcbiAgICB2YXIgc2VsZWN0aW9uX2NvbnRhaW5lciA9ICQoJ2RpdicpLmF0dHIoJ2NsYXNzJywgJ3N5c3RlbV9zZWN0aW9uJykuYXBwZW5kVG8oc3lzdGVtX2NvbnRhaW5lcik7XG4gICAgc2VsZWN0aW9uX2NvbnRhaW5lci5hdHRyKCdpZCcsIHNlY3Rpb24gKTtcbiAgICBzZWxlY3Rpb25fY29udGFpbmVyLmVsZW0uc3R5bGUud2lkdGggPSBzZXR0aW5ncy5kcmF3aW5nLnNpemUuZHJhd2luZy53LnRvU3RyaW5nKCkgKyAncHgnO1xuICAgIHBhZ2Vfc2VjdGlvbnNbc2VjdGlvbl0uZm9yRWFjaCggZnVuY3Rpb24oa2VsZW0pe1xuICAgICAgICBrZWxlbS5hcHBlbmRUbyhzZWxlY3Rpb25fY29udGFpbmVyKTtcbiAgICAgICAgaWYoIGtlbGVtLnR5cGUgPT09ICdzZWxlY3RvcicgKXtcbiAgICAgICAgICAgIGtlbGVtLnNldFJlZk9iaihzZXR0aW5ncyk7XG4gICAgICAgICAgICBrZWxlbS5zZXRVcGRhdGUodXBkYXRlKTtcbiAgICAgICAgICAgIHNldHRpbmdzLnNlbGVjdF9yZWdpc3RyeS5wdXNoKGtlbGVtKTtcbiAgICAgICAgICAgIGtlbGVtLnVwZGF0ZSgpOyBcbiAgICAgICAgfSBlbHNlIGlmKCBrZWxlbS50eXBlID09PSAndmFsdWUnICl7XG4gICAgICAgICAgICBrZWxlbS5zZXRSZWZPYmooc2V0dGluZ3MpO1xuICAgICAgICAgICAgLy9rZWxlbS5zZXRVcGRhdGUodXBkYXRlX3N5c3RlbSk7XG4gICAgICAgICAgICBzZXR0aW5ncy52YWx1ZV9yZWdpc3RyeS5wdXNoKGtlbGVtKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cbnNob3dfc2VjdGlvbigndGl0bGUnKTtcbmlmKCBzZWN0aW9ucy5tb2R1bGVzLnJlYWR5ICkgc2hvd19zZWN0aW9uKCdtb2R1bGVzJyk7XG5pZiggc2VjdGlvbnMubW9kdWxlcy5zZXQgKSBzaG93X3NlY3Rpb24oJ21vZHVsZXNfcGFyYW1zJyk7XG5cblxuXG52YXIgYm9vdF90aW1lID0gbW9tZW50KCk7XG52YXIgc3RhdHVzX2lkID0gXCJzdGF0dXNcIjtcbnNldEludGVydmFsKGZ1bmN0aW9uKCl7IGsudXBkYXRlX3N0YXR1c19wYWdlKHN0YXR1c19pZCwgYm9vdF90aW1lLCB2ZXJzaW9uX3N0cmluZyk7fSwxMDAwKTtcblxuY29uc29sZS5sb2coJ3NldHRpbmdzJywgc2V0dGluZ3MpO1xuY29uc29sZS5sb2coJ3dpbmRvdycsIHdpbmRvdyk7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vLyEgbW9tZW50LmpzXG4vLyEgdmVyc2lvbiA6IDIuNy4wXG4vLyEgYXV0aG9ycyA6IFRpbSBXb29kLCBJc2tyZW4gQ2hlcm5ldiwgTW9tZW50LmpzIGNvbnRyaWJ1dG9yc1xuLy8hIGxpY2Vuc2UgOiBNSVRcbi8vISBtb21lbnRqcy5jb21cblxuKGZ1bmN0aW9uICh1bmRlZmluZWQpIHtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgQ29uc3RhbnRzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgdmFyIG1vbWVudCxcbiAgICAgICAgVkVSU0lPTiA9IFwiMi43LjBcIixcbiAgICAgICAgLy8gdGhlIGdsb2JhbC1zY29wZSB0aGlzIGlzIE5PVCB0aGUgZ2xvYmFsIG9iamVjdCBpbiBOb2RlLmpzXG4gICAgICAgIGdsb2JhbFNjb3BlID0gdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzLFxuICAgICAgICBvbGRHbG9iYWxNb21lbnQsXG4gICAgICAgIHJvdW5kID0gTWF0aC5yb3VuZCxcbiAgICAgICAgaSxcblxuICAgICAgICBZRUFSID0gMCxcbiAgICAgICAgTU9OVEggPSAxLFxuICAgICAgICBEQVRFID0gMixcbiAgICAgICAgSE9VUiA9IDMsXG4gICAgICAgIE1JTlVURSA9IDQsXG4gICAgICAgIFNFQ09ORCA9IDUsXG4gICAgICAgIE1JTExJU0VDT05EID0gNixcblxuICAgICAgICAvLyBpbnRlcm5hbCBzdG9yYWdlIGZvciBsYW5ndWFnZSBjb25maWcgZmlsZXNcbiAgICAgICAgbGFuZ3VhZ2VzID0ge30sXG5cbiAgICAgICAgLy8gbW9tZW50IGludGVybmFsIHByb3BlcnRpZXNcbiAgICAgICAgbW9tZW50UHJvcGVydGllcyA9IHtcbiAgICAgICAgICAgIF9pc0FNb21lbnRPYmplY3Q6IG51bGwsXG4gICAgICAgICAgICBfaSA6IG51bGwsXG4gICAgICAgICAgICBfZiA6IG51bGwsXG4gICAgICAgICAgICBfbCA6IG51bGwsXG4gICAgICAgICAgICBfc3RyaWN0IDogbnVsbCxcbiAgICAgICAgICAgIF90em0gOiBudWxsLFxuICAgICAgICAgICAgX2lzVVRDIDogbnVsbCxcbiAgICAgICAgICAgIF9vZmZzZXQgOiBudWxsLCAgLy8gb3B0aW9uYWwuIENvbWJpbmUgd2l0aCBfaXNVVENcbiAgICAgICAgICAgIF9wZiA6IG51bGwsXG4gICAgICAgICAgICBfbGFuZyA6IG51bGwgIC8vIG9wdGlvbmFsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gY2hlY2sgZm9yIG5vZGVKU1xuICAgICAgICBoYXNNb2R1bGUgPSAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpLFxuXG4gICAgICAgIC8vIEFTUC5ORVQganNvbiBkYXRlIGZvcm1hdCByZWdleFxuICAgICAgICBhc3BOZXRKc29uUmVnZXggPSAvXlxcLz9EYXRlXFwoKFxcLT9cXGQrKS9pLFxuICAgICAgICBhc3BOZXRUaW1lU3Bhbkpzb25SZWdleCA9IC8oXFwtKT8oPzooXFxkKilcXC4pPyhcXGQrKVxcOihcXGQrKSg/OlxcOihcXGQrKVxcLj8oXFxkezN9KT8pPy8sXG5cbiAgICAgICAgLy8gZnJvbSBodHRwOi8vZG9jcy5jbG9zdXJlLWxpYnJhcnkuZ29vZ2xlY29kZS5jb20vZ2l0L2Nsb3N1cmVfZ29vZ19kYXRlX2RhdGUuanMuc291cmNlLmh0bWxcbiAgICAgICAgLy8gc29tZXdoYXQgbW9yZSBpbiBsaW5lIHdpdGggNC40LjMuMiAyMDA0IHNwZWMsIGJ1dCBhbGxvd3MgZGVjaW1hbCBhbnl3aGVyZVxuICAgICAgICBpc29EdXJhdGlvblJlZ2V4ID0gL14oLSk/UCg/Oig/OihbMC05LC5dKilZKT8oPzooWzAtOSwuXSopTSk/KD86KFswLTksLl0qKUQpPyg/OlQoPzooWzAtOSwuXSopSCk/KD86KFswLTksLl0qKU0pPyg/OihbMC05LC5dKilTKT8pP3woWzAtOSwuXSopVykkLyxcblxuICAgICAgICAvLyBmb3JtYXQgdG9rZW5zXG4gICAgICAgIGZvcm1hdHRpbmdUb2tlbnMgPSAvKFxcW1teXFxbXSpcXF0pfChcXFxcKT8oTW98TU0/TT9NP3xEb3xERERvfEREP0Q/RD98ZGRkP2Q/fGRvP3x3W298d10/fFdbb3xXXT98UXxZWVlZWVl8WVlZWVl8WVlZWXxZWXxnZyhnZ2c/KT98R0coR0dHPyk/fGV8RXxhfEF8aGg/fEhIP3xtbT98c3M/fFN7MSw0fXxYfHp6P3xaWj98LikvZyxcbiAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zID0gLyhcXFtbXlxcW10qXFxdKXwoXFxcXCk/KExUfExMP0w/TD98bHsxLDR9KS9nLFxuXG4gICAgICAgIC8vIHBhcnNpbmcgdG9rZW4gcmVnZXhlc1xuICAgICAgICBwYXJzZVRva2VuT25lT3JUd29EaWdpdHMgPSAvXFxkXFxkPy8sIC8vIDAgLSA5OVxuICAgICAgICBwYXJzZVRva2VuT25lVG9UaHJlZURpZ2l0cyA9IC9cXGR7MSwzfS8sIC8vIDAgLSA5OTlcbiAgICAgICAgcGFyc2VUb2tlbk9uZVRvRm91ckRpZ2l0cyA9IC9cXGR7MSw0fS8sIC8vIDAgLSA5OTk5XG4gICAgICAgIHBhcnNlVG9rZW5PbmVUb1NpeERpZ2l0cyA9IC9bK1xcLV0/XFxkezEsNn0vLCAvLyAtOTk5LDk5OSAtIDk5OSw5OTlcbiAgICAgICAgcGFyc2VUb2tlbkRpZ2l0cyA9IC9cXGQrLywgLy8gbm9uemVybyBudW1iZXIgb2YgZGlnaXRzXG4gICAgICAgIHBhcnNlVG9rZW5Xb3JkID0gL1swLTldKlsnYS16XFx1MDBBMC1cXHUwNUZGXFx1MDcwMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSt8W1xcdTA2MDAtXFx1MDZGRlxcL10rKFxccyo/W1xcdTA2MDAtXFx1MDZGRl0rKXsxLDJ9L2ksIC8vIGFueSB3b3JkIChvciB0d28pIGNoYXJhY3RlcnMgb3IgbnVtYmVycyBpbmNsdWRpbmcgdHdvL3RocmVlIHdvcmQgbW9udGggaW4gYXJhYmljLlxuICAgICAgICBwYXJzZVRva2VuVGltZXpvbmUgPSAvWnxbXFwrXFwtXVxcZFxcZDo/XFxkXFxkL2dpLCAvLyArMDA6MDAgLTAwOjAwICswMDAwIC0wMDAwIG9yIFpcbiAgICAgICAgcGFyc2VUb2tlblQgPSAvVC9pLCAvLyBUIChJU08gc2VwYXJhdG9yKVxuICAgICAgICBwYXJzZVRva2VuVGltZXN0YW1wTXMgPSAvW1xcK1xcLV0/XFxkKyhcXC5cXGR7MSwzfSk/LywgLy8gMTIzNDU2Nzg5IDEyMzQ1Njc4OS4xMjNcbiAgICAgICAgcGFyc2VUb2tlbk9yZGluYWwgPSAvXFxkezEsMn0vLFxuXG4gICAgICAgIC8vc3RyaWN0IHBhcnNpbmcgcmVnZXhlc1xuICAgICAgICBwYXJzZVRva2VuT25lRGlnaXQgPSAvXFxkLywgLy8gMCAtIDlcbiAgICAgICAgcGFyc2VUb2tlblR3b0RpZ2l0cyA9IC9cXGRcXGQvLCAvLyAwMCAtIDk5XG4gICAgICAgIHBhcnNlVG9rZW5UaHJlZURpZ2l0cyA9IC9cXGR7M30vLCAvLyAwMDAgLSA5OTlcbiAgICAgICAgcGFyc2VUb2tlbkZvdXJEaWdpdHMgPSAvXFxkezR9LywgLy8gMDAwMCAtIDk5OTlcbiAgICAgICAgcGFyc2VUb2tlblNpeERpZ2l0cyA9IC9bKy1dP1xcZHs2fS8sIC8vIC05OTksOTk5IC0gOTk5LDk5OVxuICAgICAgICBwYXJzZVRva2VuU2lnbmVkTnVtYmVyID0gL1srLV0/XFxkKy8sIC8vIC1pbmYgLSBpbmZcblxuICAgICAgICAvLyBpc28gODYwMSByZWdleFxuICAgICAgICAvLyAwMDAwLTAwLTAwIDAwMDAtVzAwIG9yIDAwMDAtVzAwLTAgKyBUICsgMDAgb3IgMDA6MDAgb3IgMDA6MDA6MDAgb3IgMDA6MDA6MDAuMDAwICsgKzAwOjAwIG9yICswMDAwIG9yICswMClcbiAgICAgICAgaXNvUmVnZXggPSAvXlxccyooPzpbKy1dXFxkezZ9fFxcZHs0fSktKD86KFxcZFxcZC1cXGRcXGQpfChXXFxkXFxkJCl8KFdcXGRcXGQtXFxkKXwoXFxkXFxkXFxkKSkoKFR8ICkoXFxkXFxkKDpcXGRcXGQoOlxcZFxcZChcXC5cXGQrKT8pPyk/KT8oW1xcK1xcLV1cXGRcXGQoPzo6P1xcZFxcZCk/fFxccypaKT8pPyQvLFxuXG4gICAgICAgIGlzb0Zvcm1hdCA9ICdZWVlZLU1NLUREVEhIOm1tOnNzWicsXG5cbiAgICAgICAgaXNvRGF0ZXMgPSBbXG4gICAgICAgICAgICBbJ1lZWVlZWS1NTS1ERCcsIC9bKy1dXFxkezZ9LVxcZHsyfS1cXGR7Mn0vXSxcbiAgICAgICAgICAgIFsnWVlZWS1NTS1ERCcsIC9cXGR7NH0tXFxkezJ9LVxcZHsyfS9dLFxuICAgICAgICAgICAgWydHR0dHLVtXXVdXLUUnLCAvXFxkezR9LVdcXGR7Mn0tXFxkL10sXG4gICAgICAgICAgICBbJ0dHR0ctW1ddV1cnLCAvXFxkezR9LVdcXGR7Mn0vXSxcbiAgICAgICAgICAgIFsnWVlZWS1EREQnLCAvXFxkezR9LVxcZHszfS9dXG4gICAgICAgIF0sXG5cbiAgICAgICAgLy8gaXNvIHRpbWUgZm9ybWF0cyBhbmQgcmVnZXhlc1xuICAgICAgICBpc29UaW1lcyA9IFtcbiAgICAgICAgICAgIFsnSEg6bW06c3MuU1NTUycsIC8oVHwgKVxcZFxcZDpcXGRcXGQ6XFxkXFxkXFwuXFxkKy9dLFxuICAgICAgICAgICAgWydISDptbTpzcycsIC8oVHwgKVxcZFxcZDpcXGRcXGQ6XFxkXFxkL10sXG4gICAgICAgICAgICBbJ0hIOm1tJywgLyhUfCApXFxkXFxkOlxcZFxcZC9dLFxuICAgICAgICAgICAgWydISCcsIC8oVHwgKVxcZFxcZC9dXG4gICAgICAgIF0sXG5cbiAgICAgICAgLy8gdGltZXpvbmUgY2h1bmtlciBcIisxMDowMFwiID4gW1wiMTBcIiwgXCIwMFwiXSBvciBcIi0xNTMwXCIgPiBbXCItMTVcIiwgXCIzMFwiXVxuICAgICAgICBwYXJzZVRpbWV6b25lQ2h1bmtlciA9IC8oW1xcK1xcLV18XFxkXFxkKS9naSxcblxuICAgICAgICAvLyBnZXR0ZXIgYW5kIHNldHRlciBuYW1lc1xuICAgICAgICBwcm94eUdldHRlcnNBbmRTZXR0ZXJzID0gJ0RhdGV8SG91cnN8TWludXRlc3xTZWNvbmRzfE1pbGxpc2Vjb25kcycuc3BsaXQoJ3wnKSxcbiAgICAgICAgdW5pdE1pbGxpc2Vjb25kRmFjdG9ycyA9IHtcbiAgICAgICAgICAgICdNaWxsaXNlY29uZHMnIDogMSxcbiAgICAgICAgICAgICdTZWNvbmRzJyA6IDFlMyxcbiAgICAgICAgICAgICdNaW51dGVzJyA6IDZlNCxcbiAgICAgICAgICAgICdIb3VycycgOiAzNmU1LFxuICAgICAgICAgICAgJ0RheXMnIDogODY0ZTUsXG4gICAgICAgICAgICAnTW9udGhzJyA6IDI1OTJlNixcbiAgICAgICAgICAgICdZZWFycycgOiAzMTUzNmU2XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW5pdEFsaWFzZXMgPSB7XG4gICAgICAgICAgICBtcyA6ICdtaWxsaXNlY29uZCcsXG4gICAgICAgICAgICBzIDogJ3NlY29uZCcsXG4gICAgICAgICAgICBtIDogJ21pbnV0ZScsXG4gICAgICAgICAgICBoIDogJ2hvdXInLFxuICAgICAgICAgICAgZCA6ICdkYXknLFxuICAgICAgICAgICAgRCA6ICdkYXRlJyxcbiAgICAgICAgICAgIHcgOiAnd2VlaycsXG4gICAgICAgICAgICBXIDogJ2lzb1dlZWsnLFxuICAgICAgICAgICAgTSA6ICdtb250aCcsXG4gICAgICAgICAgICBRIDogJ3F1YXJ0ZXInLFxuICAgICAgICAgICAgeSA6ICd5ZWFyJyxcbiAgICAgICAgICAgIERERCA6ICdkYXlPZlllYXInLFxuICAgICAgICAgICAgZSA6ICd3ZWVrZGF5JyxcbiAgICAgICAgICAgIEUgOiAnaXNvV2Vla2RheScsXG4gICAgICAgICAgICBnZzogJ3dlZWtZZWFyJyxcbiAgICAgICAgICAgIEdHOiAnaXNvV2Vla1llYXInXG4gICAgICAgIH0sXG5cbiAgICAgICAgY2FtZWxGdW5jdGlvbnMgPSB7XG4gICAgICAgICAgICBkYXlvZnllYXIgOiAnZGF5T2ZZZWFyJyxcbiAgICAgICAgICAgIGlzb3dlZWtkYXkgOiAnaXNvV2Vla2RheScsXG4gICAgICAgICAgICBpc293ZWVrIDogJ2lzb1dlZWsnLFxuICAgICAgICAgICAgd2Vla3llYXIgOiAnd2Vla1llYXInLFxuICAgICAgICAgICAgaXNvd2Vla3llYXIgOiAnaXNvV2Vla1llYXInXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gZm9ybWF0IGZ1bmN0aW9uIHN0cmluZ3NcbiAgICAgICAgZm9ybWF0RnVuY3Rpb25zID0ge30sXG5cbiAgICAgICAgLy8gZGVmYXVsdCByZWxhdGl2ZSB0aW1lIHRocmVzaG9sZHNcbiAgICAgICAgcmVsYXRpdmVUaW1lVGhyZXNob2xkcyA9IHtcbiAgICAgICAgICBzOiA0NSwgICAvL3NlY29uZHMgdG8gbWludXRlc1xuICAgICAgICAgIG06IDQ1LCAgIC8vbWludXRlcyB0byBob3Vyc1xuICAgICAgICAgIGg6IDIyLCAgIC8vaG91cnMgdG8gZGF5c1xuICAgICAgICAgIGRkOiAyNSwgIC8vZGF5cyB0byBtb250aCAobW9udGggPT0gMSlcbiAgICAgICAgICBkbTogNDUsICAvL2RheXMgdG8gbW9udGhzIChtb250aHMgPiAxKVxuICAgICAgICAgIGR5OiAzNDUgIC8vZGF5cyB0byB5ZWFyXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gdG9rZW5zIHRvIG9yZGluYWxpemUgYW5kIHBhZFxuICAgICAgICBvcmRpbmFsaXplVG9rZW5zID0gJ0RERCB3IFcgTSBEIGQnLnNwbGl0KCcgJyksXG4gICAgICAgIHBhZGRlZFRva2VucyA9ICdNIEQgSCBoIG0gcyB3IFcnLnNwbGl0KCcgJyksXG5cbiAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnMgPSB7XG4gICAgICAgICAgICBNICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1vbnRoKCkgKyAxO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE1NTSAgOiBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZygpLm1vbnRoc1Nob3J0KHRoaXMsIGZvcm1hdCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgTU1NTSA6IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nKCkubW9udGhzKHRoaXMsIGZvcm1hdCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRCAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgREREICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXlPZlllYXIoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRheSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRkICAgOiBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZygpLndlZWtkYXlzTWluKHRoaXMsIGZvcm1hdCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGRkICA6IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nKCkud2Vla2RheXNTaG9ydCh0aGlzLCBmb3JtYXQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRkZGQgOiBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZygpLndlZWtkYXlzKHRoaXMsIGZvcm1hdCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdyAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy53ZWVrKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgVyAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pc29XZWVrKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgWVkgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMueWVhcigpICUgMTAwLCAyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBZWVlZIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy55ZWFyKCksIDQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFlZWVlZIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy55ZWFyKCksIDUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFlZWVlZWSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgeSA9IHRoaXMueWVhcigpLCBzaWduID0geSA+PSAwID8gJysnIDogJy0nO1xuICAgICAgICAgICAgICAgIHJldHVybiBzaWduICsgbGVmdFplcm9GaWxsKE1hdGguYWJzKHkpLCA2KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZyAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy53ZWVrWWVhcigpICUgMTAwLCAyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZ2dnIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy53ZWVrWWVhcigpLCA0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZ2dnZyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMud2Vla1llYXIoKSwgNSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgR0cgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMuaXNvV2Vla1llYXIoKSAlIDEwMCwgMik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgR0dHRyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMuaXNvV2Vla1llYXIoKSwgNCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgR0dHR0cgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLmlzb1dlZWtZZWFyKCksIDUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMud2Vla2RheSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNvV2Vla2RheSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGEgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZygpLm1lcmlkaWVtKHRoaXMuaG91cnMoKSwgdGhpcy5taW51dGVzKCksIHRydWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEEgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZygpLm1lcmlkaWVtKHRoaXMuaG91cnMoKSwgdGhpcy5taW51dGVzKCksIGZhbHNlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBIICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhvdXJzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaCAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ob3VycygpICUgMTIgfHwgMTI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbSAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5taW51dGVzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcyAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZWNvbmRzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUyAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9JbnQodGhpcy5taWxsaXNlY29uZHMoKSAvIDEwMCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU1MgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRvSW50KHRoaXMubWlsbGlzZWNvbmRzKCkgLyAxMCksIDIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFNTUyAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLm1pbGxpc2Vjb25kcygpLCAzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTU1NTIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy5taWxsaXNlY29uZHMoKSwgMyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgWiAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYSA9IC10aGlzLnpvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgYiA9IFwiK1wiO1xuICAgICAgICAgICAgICAgIGlmIChhIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBhID0gLWE7XG4gICAgICAgICAgICAgICAgICAgIGIgPSBcIi1cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGIgKyBsZWZ0WmVyb0ZpbGwodG9JbnQoYSAvIDYwKSwgMikgKyBcIjpcIiArIGxlZnRaZXJvRmlsbCh0b0ludChhKSAlIDYwLCAyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBaWiAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhID0gLXRoaXMuem9uZSgpLFxuICAgICAgICAgICAgICAgICAgICBiID0gXCIrXCI7XG4gICAgICAgICAgICAgICAgaWYgKGEgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGEgPSAtYTtcbiAgICAgICAgICAgICAgICAgICAgYiA9IFwiLVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYiArIGxlZnRaZXJvRmlsbCh0b0ludChhIC8gNjApLCAyKSArIGxlZnRaZXJvRmlsbCh0b0ludChhKSAlIDYwLCAyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB6IDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnpvbmVBYmJyKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgenogOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuem9uZU5hbWUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBYICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnVuaXgoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBRIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnF1YXJ0ZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBsaXN0cyA9IFsnbW9udGhzJywgJ21vbnRoc1Nob3J0JywgJ3dlZWtkYXlzJywgJ3dlZWtkYXlzU2hvcnQnLCAnd2Vla2RheXNNaW4nXTtcblxuICAgIC8vIFBpY2sgdGhlIGZpcnN0IGRlZmluZWQgb2YgdHdvIG9yIHRocmVlIGFyZ3VtZW50cy4gZGZsIGNvbWVzIGZyb21cbiAgICAvLyBkZWZhdWx0LlxuICAgIGZ1bmN0aW9uIGRmbChhLCBiLCBjKSB7XG4gICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gYSAhPSBudWxsID8gYSA6IGI7XG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiBhICE9IG51bGwgPyBhIDogYiAhPSBudWxsID8gYiA6IGM7XG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoXCJJbXBsZW1lbnQgbWVcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZhdWx0UGFyc2luZ0ZsYWdzKCkge1xuICAgICAgICAvLyBXZSBuZWVkIHRvIGRlZXAgY2xvbmUgdGhpcyBvYmplY3QsIGFuZCBlczUgc3RhbmRhcmQgaXMgbm90IHZlcnlcbiAgICAgICAgLy8gaGVscGZ1bC5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVtcHR5IDogZmFsc2UsXG4gICAgICAgICAgICB1bnVzZWRUb2tlbnMgOiBbXSxcbiAgICAgICAgICAgIHVudXNlZElucHV0IDogW10sXG4gICAgICAgICAgICBvdmVyZmxvdyA6IC0yLFxuICAgICAgICAgICAgY2hhcnNMZWZ0T3ZlciA6IDAsXG4gICAgICAgICAgICBudWxsSW5wdXQgOiBmYWxzZSxcbiAgICAgICAgICAgIGludmFsaWRNb250aCA6IG51bGwsXG4gICAgICAgICAgICBpbnZhbGlkRm9ybWF0IDogZmFsc2UsXG4gICAgICAgICAgICB1c2VySW52YWxpZGF0ZWQgOiBmYWxzZSxcbiAgICAgICAgICAgIGlzbzogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXByZWNhdGUobXNnLCBmbikge1xuICAgICAgICB2YXIgZmlyc3RUaW1lID0gdHJ1ZTtcbiAgICAgICAgZnVuY3Rpb24gcHJpbnRNc2coKSB7XG4gICAgICAgICAgICBpZiAobW9tZW50LnN1cHByZXNzRGVwcmVjYXRpb25XYXJuaW5ncyA9PT0gZmFsc2UgJiZcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkRlcHJlY2F0aW9uIHdhcm5pbmc6IFwiICsgbXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXh0ZW5kKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgICAgICAgICBwcmludE1zZygpO1xuICAgICAgICAgICAgICAgIGZpcnN0VGltZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sIGZuKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYWRUb2tlbihmdW5jLCBjb3VudCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwoZnVuYy5jYWxsKHRoaXMsIGEpLCBjb3VudCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9yZGluYWxpemVUb2tlbihmdW5jLCBwZXJpb2QpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nKCkub3JkaW5hbChmdW5jLmNhbGwodGhpcywgYSksIHBlcmlvZCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgd2hpbGUgKG9yZGluYWxpemVUb2tlbnMubGVuZ3RoKSB7XG4gICAgICAgIGkgPSBvcmRpbmFsaXplVG9rZW5zLnBvcCgpO1xuICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1tpICsgJ28nXSA9IG9yZGluYWxpemVUb2tlbihmb3JtYXRUb2tlbkZ1bmN0aW9uc1tpXSwgaSk7XG4gICAgfVxuICAgIHdoaWxlIChwYWRkZWRUb2tlbnMubGVuZ3RoKSB7XG4gICAgICAgIGkgPSBwYWRkZWRUb2tlbnMucG9wKCk7XG4gICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW2kgKyBpXSA9IHBhZFRva2VuKGZvcm1hdFRva2VuRnVuY3Rpb25zW2ldLCAyKTtcbiAgICB9XG4gICAgZm9ybWF0VG9rZW5GdW5jdGlvbnMuRERERCA9IHBhZFRva2VuKGZvcm1hdFRva2VuRnVuY3Rpb25zLkRERCwgMyk7XG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgQ29uc3RydWN0b3JzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgZnVuY3Rpb24gTGFuZ3VhZ2UoKSB7XG5cbiAgICB9XG5cbiAgICAvLyBNb21lbnQgcHJvdG90eXBlIG9iamVjdFxuICAgIGZ1bmN0aW9uIE1vbWVudChjb25maWcpIHtcbiAgICAgICAgY2hlY2tPdmVyZmxvdyhjb25maWcpO1xuICAgICAgICBleHRlbmQodGhpcywgY29uZmlnKTtcbiAgICB9XG5cbiAgICAvLyBEdXJhdGlvbiBDb25zdHJ1Y3RvclxuICAgIGZ1bmN0aW9uIER1cmF0aW9uKGR1cmF0aW9uKSB7XG4gICAgICAgIHZhciBub3JtYWxpemVkSW5wdXQgPSBub3JtYWxpemVPYmplY3RVbml0cyhkdXJhdGlvbiksXG4gICAgICAgICAgICB5ZWFycyA9IG5vcm1hbGl6ZWRJbnB1dC55ZWFyIHx8IDAsXG4gICAgICAgICAgICBxdWFydGVycyA9IG5vcm1hbGl6ZWRJbnB1dC5xdWFydGVyIHx8IDAsXG4gICAgICAgICAgICBtb250aHMgPSBub3JtYWxpemVkSW5wdXQubW9udGggfHwgMCxcbiAgICAgICAgICAgIHdlZWtzID0gbm9ybWFsaXplZElucHV0LndlZWsgfHwgMCxcbiAgICAgICAgICAgIGRheXMgPSBub3JtYWxpemVkSW5wdXQuZGF5IHx8IDAsXG4gICAgICAgICAgICBob3VycyA9IG5vcm1hbGl6ZWRJbnB1dC5ob3VyIHx8IDAsXG4gICAgICAgICAgICBtaW51dGVzID0gbm9ybWFsaXplZElucHV0Lm1pbnV0ZSB8fCAwLFxuICAgICAgICAgICAgc2Vjb25kcyA9IG5vcm1hbGl6ZWRJbnB1dC5zZWNvbmQgfHwgMCxcbiAgICAgICAgICAgIG1pbGxpc2Vjb25kcyA9IG5vcm1hbGl6ZWRJbnB1dC5taWxsaXNlY29uZCB8fCAwO1xuXG4gICAgICAgIC8vIHJlcHJlc2VudGF0aW9uIGZvciBkYXRlQWRkUmVtb3ZlXG4gICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyA9ICttaWxsaXNlY29uZHMgK1xuICAgICAgICAgICAgc2Vjb25kcyAqIDFlMyArIC8vIDEwMDBcbiAgICAgICAgICAgIG1pbnV0ZXMgKiA2ZTQgKyAvLyAxMDAwICogNjBcbiAgICAgICAgICAgIGhvdXJzICogMzZlNTsgLy8gMTAwMCAqIDYwICogNjBcbiAgICAgICAgLy8gQmVjYXVzZSBvZiBkYXRlQWRkUmVtb3ZlIHRyZWF0cyAyNCBob3VycyBhcyBkaWZmZXJlbnQgZnJvbSBhXG4gICAgICAgIC8vIGRheSB3aGVuIHdvcmtpbmcgYXJvdW5kIERTVCwgd2UgbmVlZCB0byBzdG9yZSB0aGVtIHNlcGFyYXRlbHlcbiAgICAgICAgdGhpcy5fZGF5cyA9ICtkYXlzICtcbiAgICAgICAgICAgIHdlZWtzICogNztcbiAgICAgICAgLy8gSXQgaXMgaW1wb3NzaWJsZSB0cmFuc2xhdGUgbW9udGhzIGludG8gZGF5cyB3aXRob3V0IGtub3dpbmdcbiAgICAgICAgLy8gd2hpY2ggbW9udGhzIHlvdSBhcmUgYXJlIHRhbGtpbmcgYWJvdXQsIHNvIHdlIGhhdmUgdG8gc3RvcmVcbiAgICAgICAgLy8gaXQgc2VwYXJhdGVseS5cbiAgICAgICAgdGhpcy5fbW9udGhzID0gK21vbnRocyArXG4gICAgICAgICAgICBxdWFydGVycyAqIDMgK1xuICAgICAgICAgICAgeWVhcnMgKiAxMjtcblxuICAgICAgICB0aGlzLl9kYXRhID0ge307XG5cbiAgICAgICAgdGhpcy5fYnViYmxlKCk7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBIZWxwZXJzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICBmdW5jdGlvbiBleHRlbmQoYSwgYikge1xuICAgICAgICBmb3IgKHZhciBpIGluIGIpIHtcbiAgICAgICAgICAgIGlmIChiLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgYVtpXSA9IGJbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYi5oYXNPd25Qcm9wZXJ0eShcInRvU3RyaW5nXCIpKSB7XG4gICAgICAgICAgICBhLnRvU3RyaW5nID0gYi50b1N0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChiLmhhc093blByb3BlcnR5KFwidmFsdWVPZlwiKSkge1xuICAgICAgICAgICAgYS52YWx1ZU9mID0gYi52YWx1ZU9mO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvbmVNb21lbnQobSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge30sIGk7XG4gICAgICAgIGZvciAoaSBpbiBtKSB7XG4gICAgICAgICAgICBpZiAobS5oYXNPd25Qcm9wZXJ0eShpKSAmJiBtb21lbnRQcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W2ldID0gbVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWJzUm91bmQobnVtYmVyKSB7XG4gICAgICAgIGlmIChudW1iZXIgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKG51bWJlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihudW1iZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gbGVmdCB6ZXJvIGZpbGwgYSBudW1iZXJcbiAgICAvLyBzZWUgaHR0cDovL2pzcGVyZi5jb20vbGVmdC16ZXJvLWZpbGxpbmcgZm9yIHBlcmZvcm1hbmNlIGNvbXBhcmlzb25cbiAgICBmdW5jdGlvbiBsZWZ0WmVyb0ZpbGwobnVtYmVyLCB0YXJnZXRMZW5ndGgsIGZvcmNlU2lnbikge1xuICAgICAgICB2YXIgb3V0cHV0ID0gJycgKyBNYXRoLmFicyhudW1iZXIpLFxuICAgICAgICAgICAgc2lnbiA9IG51bWJlciA+PSAwO1xuXG4gICAgICAgIHdoaWxlIChvdXRwdXQubGVuZ3RoIDwgdGFyZ2V0TGVuZ3RoKSB7XG4gICAgICAgICAgICBvdXRwdXQgPSAnMCcgKyBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChzaWduID8gKGZvcmNlU2lnbiA/ICcrJyA6ICcnKSA6ICctJykgKyBvdXRwdXQ7XG4gICAgfVxuXG4gICAgLy8gaGVscGVyIGZ1bmN0aW9uIGZvciBfLmFkZFRpbWUgYW5kIF8uc3VidHJhY3RUaW1lXG4gICAgZnVuY3Rpb24gYWRkT3JTdWJ0cmFjdER1cmF0aW9uRnJvbU1vbWVudChtb20sIGR1cmF0aW9uLCBpc0FkZGluZywgdXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSBkdXJhdGlvbi5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgZGF5cyA9IGR1cmF0aW9uLl9kYXlzLFxuICAgICAgICAgICAgbW9udGhzID0gZHVyYXRpb24uX21vbnRocztcbiAgICAgICAgdXBkYXRlT2Zmc2V0ID0gdXBkYXRlT2Zmc2V0ID09IG51bGwgPyB0cnVlIDogdXBkYXRlT2Zmc2V0O1xuXG4gICAgICAgIGlmIChtaWxsaXNlY29uZHMpIHtcbiAgICAgICAgICAgIG1vbS5fZC5zZXRUaW1lKCttb20uX2QgKyBtaWxsaXNlY29uZHMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRheXMpIHtcbiAgICAgICAgICAgIHJhd1NldHRlcihtb20sICdEYXRlJywgcmF3R2V0dGVyKG1vbSwgJ0RhdGUnKSArIGRheXMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vbnRocykge1xuICAgICAgICAgICAgcmF3TW9udGhTZXR0ZXIobW9tLCByYXdHZXR0ZXIobW9tLCAnTW9udGgnKSArIG1vbnRocyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgICAgICBtb21lbnQudXBkYXRlT2Zmc2V0KG1vbSwgZGF5cyB8fCBtb250aHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaWYgaXMgYW4gYXJyYXlcbiAgICBmdW5jdGlvbiBpc0FycmF5KGlucHV0KSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF0ZShpbnB1dCkge1xuICAgICAgICByZXR1cm4gIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IERhdGVdJyB8fFxuICAgICAgICAgICAgICAgIGlucHV0IGluc3RhbmNlb2YgRGF0ZTtcbiAgICB9XG5cbiAgICAvLyBjb21wYXJlIHR3byBhcnJheXMsIHJldHVybiB0aGUgbnVtYmVyIG9mIGRpZmZlcmVuY2VzXG4gICAgZnVuY3Rpb24gY29tcGFyZUFycmF5cyhhcnJheTEsIGFycmF5MiwgZG9udENvbnZlcnQpIHtcbiAgICAgICAgdmFyIGxlbiA9IE1hdGgubWluKGFycmF5MS5sZW5ndGgsIGFycmF5Mi5sZW5ndGgpLFxuICAgICAgICAgICAgbGVuZ3RoRGlmZiA9IE1hdGguYWJzKGFycmF5MS5sZW5ndGggLSBhcnJheTIubGVuZ3RoKSxcbiAgICAgICAgICAgIGRpZmZzID0gMCxcbiAgICAgICAgICAgIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKChkb250Q29udmVydCAmJiBhcnJheTFbaV0gIT09IGFycmF5MltpXSkgfHxcbiAgICAgICAgICAgICAgICAoIWRvbnRDb252ZXJ0ICYmIHRvSW50KGFycmF5MVtpXSkgIT09IHRvSW50KGFycmF5MltpXSkpKSB7XG4gICAgICAgICAgICAgICAgZGlmZnMrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGlmZnMgKyBsZW5ndGhEaWZmO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZVVuaXRzKHVuaXRzKSB7XG4gICAgICAgIGlmICh1bml0cykge1xuICAgICAgICAgICAgdmFyIGxvd2VyZWQgPSB1bml0cy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLyguKXMkLywgJyQxJyk7XG4gICAgICAgICAgICB1bml0cyA9IHVuaXRBbGlhc2VzW3VuaXRzXSB8fCBjYW1lbEZ1bmN0aW9uc1tsb3dlcmVkXSB8fCBsb3dlcmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bml0cztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVPYmplY3RVbml0cyhpbnB1dE9iamVjdCkge1xuICAgICAgICB2YXIgbm9ybWFsaXplZElucHV0ID0ge30sXG4gICAgICAgICAgICBub3JtYWxpemVkUHJvcCxcbiAgICAgICAgICAgIHByb3A7XG5cbiAgICAgICAgZm9yIChwcm9wIGluIGlucHV0T2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAoaW5wdXRPYmplY3QuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBub3JtYWxpemVkUHJvcCA9IG5vcm1hbGl6ZVVuaXRzKHByb3ApO1xuICAgICAgICAgICAgICAgIGlmIChub3JtYWxpemVkUHJvcCkge1xuICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkSW5wdXRbbm9ybWFsaXplZFByb3BdID0gaW5wdXRPYmplY3RbcHJvcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWRJbnB1dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlTGlzdChmaWVsZCkge1xuICAgICAgICB2YXIgY291bnQsIHNldHRlcjtcblxuICAgICAgICBpZiAoZmllbGQuaW5kZXhPZignd2VlaycpID09PSAwKSB7XG4gICAgICAgICAgICBjb3VudCA9IDc7XG4gICAgICAgICAgICBzZXR0ZXIgPSAnZGF5JztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmaWVsZC5pbmRleE9mKCdtb250aCcpID09PSAwKSB7XG4gICAgICAgICAgICBjb3VudCA9IDEyO1xuICAgICAgICAgICAgc2V0dGVyID0gJ21vbnRoJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG1vbWVudFtmaWVsZF0gPSBmdW5jdGlvbiAoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICAgICAgdmFyIGksIGdldHRlcixcbiAgICAgICAgICAgICAgICBtZXRob2QgPSBtb21lbnQuZm4uX2xhbmdbZmllbGRdLFxuICAgICAgICAgICAgICAgIHJlc3VsdHMgPSBbXTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBmb3JtYXQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBmb3JtYXQ7XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBnZXR0ZXIgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgIHZhciBtID0gbW9tZW50KCkudXRjKCkuc2V0KHNldHRlciwgaSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ldGhvZC5jYWxsKG1vbWVudC5mbi5fbGFuZywgbSwgZm9ybWF0IHx8ICcnKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChpbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldHRlcihpbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goZ2V0dGVyKGkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9JbnQoYXJndW1lbnRGb3JDb2VyY2lvbikge1xuICAgICAgICB2YXIgY29lcmNlZE51bWJlciA9ICthcmd1bWVudEZvckNvZXJjaW9uLFxuICAgICAgICAgICAgdmFsdWUgPSAwO1xuXG4gICAgICAgIGlmIChjb2VyY2VkTnVtYmVyICE9PSAwICYmIGlzRmluaXRlKGNvZXJjZWROdW1iZXIpKSB7XG4gICAgICAgICAgICBpZiAoY29lcmNlZE51bWJlciA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBNYXRoLmZsb29yKGNvZXJjZWROdW1iZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IE1hdGguY2VpbChjb2VyY2VkTnVtYmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlzSW5Nb250aCh5ZWFyLCBtb250aCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoeWVhciwgbW9udGggKyAxLCAwKSkuZ2V0VVRDRGF0ZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdlZWtzSW5ZZWFyKHllYXIsIGRvdywgZG95KSB7XG4gICAgICAgIHJldHVybiB3ZWVrT2ZZZWFyKG1vbWVudChbeWVhciwgMTEsIDMxICsgZG93IC0gZG95XSksIGRvdywgZG95KS53ZWVrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheXNJblllYXIoeWVhcikge1xuICAgICAgICByZXR1cm4gaXNMZWFwWWVhcih5ZWFyKSA/IDM2NiA6IDM2NTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0xlYXBZZWFyKHllYXIpIHtcbiAgICAgICAgcmV0dXJuICh5ZWFyICUgNCA9PT0gMCAmJiB5ZWFyICUgMTAwICE9PSAwKSB8fCB5ZWFyICUgNDAwID09PSAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrT3ZlcmZsb3cobSkge1xuICAgICAgICB2YXIgb3ZlcmZsb3c7XG4gICAgICAgIGlmIChtLl9hICYmIG0uX3BmLm92ZXJmbG93ID09PSAtMikge1xuICAgICAgICAgICAgb3ZlcmZsb3cgPVxuICAgICAgICAgICAgICAgIG0uX2FbTU9OVEhdIDwgMCB8fCBtLl9hW01PTlRIXSA+IDExID8gTU9OVEggOlxuICAgICAgICAgICAgICAgIG0uX2FbREFURV0gPCAxIHx8IG0uX2FbREFURV0gPiBkYXlzSW5Nb250aChtLl9hW1lFQVJdLCBtLl9hW01PTlRIXSkgPyBEQVRFIDpcbiAgICAgICAgICAgICAgICBtLl9hW0hPVVJdIDwgMCB8fCBtLl9hW0hPVVJdID4gMjMgPyBIT1VSIDpcbiAgICAgICAgICAgICAgICBtLl9hW01JTlVURV0gPCAwIHx8IG0uX2FbTUlOVVRFXSA+IDU5ID8gTUlOVVRFIDpcbiAgICAgICAgICAgICAgICBtLl9hW1NFQ09ORF0gPCAwIHx8IG0uX2FbU0VDT05EXSA+IDU5ID8gU0VDT05EIDpcbiAgICAgICAgICAgICAgICBtLl9hW01JTExJU0VDT05EXSA8IDAgfHwgbS5fYVtNSUxMSVNFQ09ORF0gPiA5OTkgPyBNSUxMSVNFQ09ORCA6XG4gICAgICAgICAgICAgICAgLTE7XG5cbiAgICAgICAgICAgIGlmIChtLl9wZi5fb3ZlcmZsb3dEYXlPZlllYXIgJiYgKG92ZXJmbG93IDwgWUVBUiB8fCBvdmVyZmxvdyA+IERBVEUpKSB7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSBEQVRFO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtLl9wZi5vdmVyZmxvdyA9IG92ZXJmbG93O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNWYWxpZChtKSB7XG4gICAgICAgIGlmIChtLl9pc1ZhbGlkID09IG51bGwpIHtcbiAgICAgICAgICAgIG0uX2lzVmFsaWQgPSAhaXNOYU4obS5fZC5nZXRUaW1lKCkpICYmXG4gICAgICAgICAgICAgICAgbS5fcGYub3ZlcmZsb3cgPCAwICYmXG4gICAgICAgICAgICAgICAgIW0uX3BmLmVtcHR5ICYmXG4gICAgICAgICAgICAgICAgIW0uX3BmLmludmFsaWRNb250aCAmJlxuICAgICAgICAgICAgICAgICFtLl9wZi5udWxsSW5wdXQgJiZcbiAgICAgICAgICAgICAgICAhbS5fcGYuaW52YWxpZEZvcm1hdCAmJlxuICAgICAgICAgICAgICAgICFtLl9wZi51c2VySW52YWxpZGF0ZWQ7XG5cbiAgICAgICAgICAgIGlmIChtLl9zdHJpY3QpIHtcbiAgICAgICAgICAgICAgICBtLl9pc1ZhbGlkID0gbS5faXNWYWxpZCAmJlxuICAgICAgICAgICAgICAgICAgICBtLl9wZi5jaGFyc0xlZnRPdmVyID09PSAwICYmXG4gICAgICAgICAgICAgICAgICAgIG0uX3BmLnVudXNlZFRva2Vucy5sZW5ndGggPT09IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG0uX2lzVmFsaWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplTGFuZ3VhZ2Uoa2V5KSB7XG4gICAgICAgIHJldHVybiBrZXkgPyBrZXkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCdfJywgJy0nKSA6IGtleTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBtb21lbnQgZnJvbSBpbnB1dCwgdGhhdCBpcyBsb2NhbC91dGMvem9uZSBlcXVpdmFsZW50IHRvIG1vZGVsLlxuICAgIGZ1bmN0aW9uIG1ha2VBcyhpbnB1dCwgbW9kZWwpIHtcbiAgICAgICAgcmV0dXJuIG1vZGVsLl9pc1VUQyA/IG1vbWVudChpbnB1dCkuem9uZShtb2RlbC5fb2Zmc2V0IHx8IDApIDpcbiAgICAgICAgICAgIG1vbWVudChpbnB1dCkubG9jYWwoKTtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIExhbmd1YWdlc1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgZXh0ZW5kKExhbmd1YWdlLnByb3RvdHlwZSwge1xuXG4gICAgICAgIHNldCA6IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgICAgIHZhciBwcm9wLCBpO1xuICAgICAgICAgICAgZm9yIChpIGluIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHByb3AgPSBjb25maWdbaV07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNbaV0gPSBwcm9wO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNbJ18nICsgaV0gPSBwcm9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfbW9udGhzIDogXCJKYW51YXJ5X0ZlYnJ1YXJ5X01hcmNoX0FwcmlsX01heV9KdW5lX0p1bHlfQXVndXN0X1NlcHRlbWJlcl9PY3RvYmVyX05vdmVtYmVyX0RlY2VtYmVyXCIuc3BsaXQoXCJfXCIpLFxuICAgICAgICBtb250aHMgOiBmdW5jdGlvbiAobSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1ttLm1vbnRoKCldO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9tb250aHNTaG9ydCA6IFwiSmFuX0ZlYl9NYXJfQXByX01heV9KdW5fSnVsX0F1Z19TZXBfT2N0X05vdl9EZWNcIi5zcGxpdChcIl9cIiksXG4gICAgICAgIG1vbnRoc1Nob3J0IDogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTaG9ydFttLm1vbnRoKCldO1xuICAgICAgICB9LFxuXG4gICAgICAgIG1vbnRoc1BhcnNlIDogZnVuY3Rpb24gKG1vbnRoTmFtZSkge1xuICAgICAgICAgICAgdmFyIGksIG1vbSwgcmVnZXg7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5fbW9udGhzUGFyc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICAgICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fbW9udGhzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgbW9tID0gbW9tZW50LnV0YyhbMjAwMCwgaV0pO1xuICAgICAgICAgICAgICAgICAgICByZWdleCA9ICdeJyArIHRoaXMubW9udGhzKG1vbSwgJycpICsgJ3xeJyArIHRoaXMubW9udGhzU2hvcnQobW9tLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cChyZWdleC5yZXBsYWNlKCcuJywgJycpLCAnaScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9tb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF93ZWVrZGF5cyA6IFwiU3VuZGF5X01vbmRheV9UdWVzZGF5X1dlZG5lc2RheV9UaHVyc2RheV9GcmlkYXlfU2F0dXJkYXlcIi5zcGxpdChcIl9cIiksXG4gICAgICAgIHdlZWtkYXlzIDogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1ttLmRheSgpXTtcbiAgICAgICAgfSxcblxuICAgICAgICBfd2Vla2RheXNTaG9ydCA6IFwiU3VuX01vbl9UdWVfV2VkX1RodV9GcmlfU2F0XCIuc3BsaXQoXCJfXCIpLFxuICAgICAgICB3ZWVrZGF5c1Nob3J0IDogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1Nob3J0W20uZGF5KCldO1xuICAgICAgICB9LFxuXG4gICAgICAgIF93ZWVrZGF5c01pbiA6IFwiU3VfTW9fVHVfV2VfVGhfRnJfU2FcIi5zcGxpdChcIl9cIiksXG4gICAgICAgIHdlZWtkYXlzTWluIDogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c01pblttLmRheSgpXTtcbiAgICAgICAgfSxcblxuICAgICAgICB3ZWVrZGF5c1BhcnNlIDogZnVuY3Rpb24gKHdlZWtkYXlOYW1lKSB7XG4gICAgICAgICAgICB2YXIgaSwgbW9tLCByZWdleDtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vbSA9IG1vbWVudChbMjAwMCwgMV0pLmRheShpKTtcbiAgICAgICAgICAgICAgICAgICAgcmVnZXggPSAnXicgKyB0aGlzLndlZWtkYXlzKG1vbSwgJycpICsgJ3xeJyArIHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKSArICd8XicgKyB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlW2ldID0gbmV3IFJlZ0V4cChyZWdleC5yZXBsYWNlKCcuJywgJycpLCAnaScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl93ZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfbG9uZ0RhdGVGb3JtYXQgOiB7XG4gICAgICAgICAgICBMVCA6IFwiaDptbSBBXCIsXG4gICAgICAgICAgICBMIDogXCJNTS9ERC9ZWVlZXCIsXG4gICAgICAgICAgICBMTCA6IFwiTU1NTSBEIFlZWVlcIixcbiAgICAgICAgICAgIExMTCA6IFwiTU1NTSBEIFlZWVkgTFRcIixcbiAgICAgICAgICAgIExMTEwgOiBcImRkZGQsIE1NTU0gRCBZWVlZIExUXCJcbiAgICAgICAgfSxcbiAgICAgICAgbG9uZ0RhdGVGb3JtYXQgOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XTtcbiAgICAgICAgICAgIGlmICghb3V0cHV0ICYmIHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleS50b1VwcGVyQ2FzZSgpXSkge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleS50b1VwcGVyQ2FzZSgpXS5yZXBsYWNlKC9NTU1NfE1NfEREfGRkZGQvZywgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsLnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV0gPSBvdXRwdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzUE0gOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIC8vIElFOCBRdWlya3MgTW9kZSAmIElFNyBTdGFuZGFyZHMgTW9kZSBkbyBub3QgYWxsb3cgYWNjZXNzaW5nIHN0cmluZ3MgbGlrZSBhcnJheXNcbiAgICAgICAgICAgIC8vIFVzaW5nIGNoYXJBdCBzaG91bGQgYmUgbW9yZSBjb21wYXRpYmxlLlxuICAgICAgICAgICAgcmV0dXJuICgoaW5wdXQgKyAnJykudG9Mb3dlckNhc2UoKS5jaGFyQXQoMCkgPT09ICdwJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX21lcmlkaWVtUGFyc2UgOiAvW2FwXVxcLj9tP1xcLj8vaSxcbiAgICAgICAgbWVyaWRpZW0gOiBmdW5jdGlvbiAoaG91cnMsIG1pbnV0ZXMsIGlzTG93ZXIpIHtcbiAgICAgICAgICAgIGlmIChob3VycyA+IDExKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzTG93ZXIgPyAncG0nIDogJ1BNJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzTG93ZXIgPyAnYW0nIDogJ0FNJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfY2FsZW5kYXIgOiB7XG4gICAgICAgICAgICBzYW1lRGF5IDogJ1tUb2RheSBhdF0gTFQnLFxuICAgICAgICAgICAgbmV4dERheSA6ICdbVG9tb3Jyb3cgYXRdIExUJyxcbiAgICAgICAgICAgIG5leHRXZWVrIDogJ2RkZGQgW2F0XSBMVCcsXG4gICAgICAgICAgICBsYXN0RGF5IDogJ1tZZXN0ZXJkYXkgYXRdIExUJyxcbiAgICAgICAgICAgIGxhc3RXZWVrIDogJ1tMYXN0XSBkZGRkIFthdF0gTFQnLFxuICAgICAgICAgICAgc2FtZUVsc2UgOiAnTCdcbiAgICAgICAgfSxcbiAgICAgICAgY2FsZW5kYXIgOiBmdW5jdGlvbiAoa2V5LCBtb20pIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9jYWxlbmRhcltrZXldO1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBvdXRwdXQgPT09ICdmdW5jdGlvbicgPyBvdXRwdXQuYXBwbHkobW9tKSA6IG91dHB1dDtcbiAgICAgICAgfSxcblxuICAgICAgICBfcmVsYXRpdmVUaW1lIDoge1xuICAgICAgICAgICAgZnV0dXJlIDogXCJpbiAlc1wiLFxuICAgICAgICAgICAgcGFzdCA6IFwiJXMgYWdvXCIsXG4gICAgICAgICAgICBzIDogXCJhIGZldyBzZWNvbmRzXCIsXG4gICAgICAgICAgICBtIDogXCJhIG1pbnV0ZVwiLFxuICAgICAgICAgICAgbW0gOiBcIiVkIG1pbnV0ZXNcIixcbiAgICAgICAgICAgIGggOiBcImFuIGhvdXJcIixcbiAgICAgICAgICAgIGhoIDogXCIlZCBob3Vyc1wiLFxuICAgICAgICAgICAgZCA6IFwiYSBkYXlcIixcbiAgICAgICAgICAgIGRkIDogXCIlZCBkYXlzXCIsXG4gICAgICAgICAgICBNIDogXCJhIG1vbnRoXCIsXG4gICAgICAgICAgICBNTSA6IFwiJWQgbW9udGhzXCIsXG4gICAgICAgICAgICB5IDogXCJhIHllYXJcIixcbiAgICAgICAgICAgIHl5IDogXCIlZCB5ZWFyc1wiXG4gICAgICAgIH0sXG4gICAgICAgIHJlbGF0aXZlVGltZSA6IGZ1bmN0aW9uIChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbc3RyaW5nXTtcbiAgICAgICAgICAgIHJldHVybiAodHlwZW9mIG91dHB1dCA9PT0gJ2Z1bmN0aW9uJykgP1xuICAgICAgICAgICAgICAgIG91dHB1dChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIDpcbiAgICAgICAgICAgICAgICBvdXRwdXQucmVwbGFjZSgvJWQvaSwgbnVtYmVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgcGFzdEZ1dHVyZSA6IGZ1bmN0aW9uIChkaWZmLCBvdXRwdXQpIHtcbiAgICAgICAgICAgIHZhciBmb3JtYXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbZGlmZiA+IDAgPyAnZnV0dXJlJyA6ICdwYXN0J107XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGZvcm1hdCA9PT0gJ2Z1bmN0aW9uJyA/IGZvcm1hdChvdXRwdXQpIDogZm9ybWF0LnJlcGxhY2UoLyVzL2ksIG91dHB1dCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgb3JkaW5hbCA6IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vcmRpbmFsLnJlcGxhY2UoXCIlZFwiLCBudW1iZXIpO1xuICAgICAgICB9LFxuICAgICAgICBfb3JkaW5hbCA6IFwiJWRcIixcblxuICAgICAgICBwcmVwYXJzZSA6IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcG9zdGZvcm1hdCA6IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2VlayA6IGZ1bmN0aW9uIChtb20pIHtcbiAgICAgICAgICAgIHJldHVybiB3ZWVrT2ZZZWFyKG1vbSwgdGhpcy5fd2Vlay5kb3csIHRoaXMuX3dlZWsuZG95KS53ZWVrO1xuICAgICAgICB9LFxuXG4gICAgICAgIF93ZWVrIDoge1xuICAgICAgICAgICAgZG93IDogMCwgLy8gU3VuZGF5IGlzIHRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsuXG4gICAgICAgICAgICBkb3kgOiA2ICAvLyBUaGUgd2VlayB0aGF0IGNvbnRhaW5zIEphbiAxc3QgaXMgdGhlIGZpcnN0IHdlZWsgb2YgdGhlIHllYXIuXG4gICAgICAgIH0sXG5cbiAgICAgICAgX2ludmFsaWREYXRlOiAnSW52YWxpZCBkYXRlJyxcbiAgICAgICAgaW52YWxpZERhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnZhbGlkRGF0ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gTG9hZHMgYSBsYW5ndWFnZSBkZWZpbml0aW9uIGludG8gdGhlIGBsYW5ndWFnZXNgIGNhY2hlLiAgVGhlIGZ1bmN0aW9uXG4gICAgLy8gdGFrZXMgYSBrZXkgYW5kIG9wdGlvbmFsbHkgdmFsdWVzLiAgSWYgbm90IGluIHRoZSBicm93c2VyIGFuZCBubyB2YWx1ZXNcbiAgICAvLyBhcmUgcHJvdmlkZWQsIGl0IHdpbGwgbG9hZCB0aGUgbGFuZ3VhZ2UgZmlsZSBtb2R1bGUuICBBcyBhIGNvbnZlbmllbmNlLFxuICAgIC8vIHRoaXMgZnVuY3Rpb24gYWxzbyByZXR1cm5zIHRoZSBsYW5ndWFnZSB2YWx1ZXMuXG4gICAgZnVuY3Rpb24gbG9hZExhbmcoa2V5LCB2YWx1ZXMpIHtcbiAgICAgICAgdmFsdWVzLmFiYnIgPSBrZXk7XG4gICAgICAgIGlmICghbGFuZ3VhZ2VzW2tleV0pIHtcbiAgICAgICAgICAgIGxhbmd1YWdlc1trZXldID0gbmV3IExhbmd1YWdlKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGFuZ3VhZ2VzW2tleV0uc2V0KHZhbHVlcyk7XG4gICAgICAgIHJldHVybiBsYW5ndWFnZXNba2V5XTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgYSBsYW5ndWFnZSBmcm9tIHRoZSBgbGFuZ3VhZ2VzYCBjYWNoZS4gTW9zdGx5IHVzZWZ1bCBpbiB0ZXN0cy5cbiAgICBmdW5jdGlvbiB1bmxvYWRMYW5nKGtleSkge1xuICAgICAgICBkZWxldGUgbGFuZ3VhZ2VzW2tleV07XG4gICAgfVxuXG4gICAgLy8gRGV0ZXJtaW5lcyB3aGljaCBsYW5ndWFnZSBkZWZpbml0aW9uIHRvIHVzZSBhbmQgcmV0dXJucyBpdC5cbiAgICAvL1xuICAgIC8vIFdpdGggbm8gcGFyYW1ldGVycywgaXQgd2lsbCByZXR1cm4gdGhlIGdsb2JhbCBsYW5ndWFnZS4gIElmIHlvdVxuICAgIC8vIHBhc3MgaW4gYSBsYW5ndWFnZSBrZXksIHN1Y2ggYXMgJ2VuJywgaXQgd2lsbCByZXR1cm4gdGhlXG4gICAgLy8gZGVmaW5pdGlvbiBmb3IgJ2VuJywgc28gbG9uZyBhcyAnZW4nIGhhcyBhbHJlYWR5IGJlZW4gbG9hZGVkIHVzaW5nXG4gICAgLy8gbW9tZW50LmxhbmcuXG4gICAgZnVuY3Rpb24gZ2V0TGFuZ0RlZmluaXRpb24oa2V5KSB7XG4gICAgICAgIHZhciBpID0gMCwgaiwgbGFuZywgbmV4dCwgc3BsaXQsXG4gICAgICAgICAgICBnZXQgPSBmdW5jdGlvbiAoaykge1xuICAgICAgICAgICAgICAgIGlmICghbGFuZ3VhZ2VzW2tdICYmIGhhc01vZHVsZSkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZSgnLi9sYW5nLycgKyBrKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkgeyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBsYW5ndWFnZXNba107XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50LmZuLl9sYW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0FycmF5KGtleSkpIHtcbiAgICAgICAgICAgIC8vc2hvcnQtY2lyY3VpdCBldmVyeXRoaW5nIGVsc2VcbiAgICAgICAgICAgIGxhbmcgPSBnZXQoa2V5KTtcbiAgICAgICAgICAgIGlmIChsYW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrZXkgPSBba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vcGljayB0aGUgbGFuZ3VhZ2UgZnJvbSB0aGUgYXJyYXlcbiAgICAgICAgLy90cnkgWydlbi1hdScsICdlbi1nYiddIGFzICdlbi1hdScsICdlbi1nYicsICdlbicsIGFzIGluIG1vdmUgdGhyb3VnaCB0aGUgbGlzdCB0cnlpbmcgZWFjaFxuICAgICAgICAvL3N1YnN0cmluZyBmcm9tIG1vc3Qgc3BlY2lmaWMgdG8gbGVhc3QsIGJ1dCBtb3ZlIHRvIHRoZSBuZXh0IGFycmF5IGl0ZW0gaWYgaXQncyBhIG1vcmUgc3BlY2lmaWMgdmFyaWFudCB0aGFuIHRoZSBjdXJyZW50IHJvb3RcbiAgICAgICAgd2hpbGUgKGkgPCBrZXkubGVuZ3RoKSB7XG4gICAgICAgICAgICBzcGxpdCA9IG5vcm1hbGl6ZUxhbmd1YWdlKGtleVtpXSkuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgIGogPSBzcGxpdC5sZW5ndGg7XG4gICAgICAgICAgICBuZXh0ID0gbm9ybWFsaXplTGFuZ3VhZ2Uoa2V5W2kgKyAxXSk7XG4gICAgICAgICAgICBuZXh0ID0gbmV4dCA/IG5leHQuc3BsaXQoJy0nKSA6IG51bGw7XG4gICAgICAgICAgICB3aGlsZSAoaiA+IDApIHtcbiAgICAgICAgICAgICAgICBsYW5nID0gZ2V0KHNwbGl0LnNsaWNlKDAsIGopLmpvaW4oJy0nKSk7XG4gICAgICAgICAgICAgICAgaWYgKGxhbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhbmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChuZXh0ICYmIG5leHQubGVuZ3RoID49IGogJiYgY29tcGFyZUFycmF5cyhzcGxpdCwgbmV4dCwgdHJ1ZSkgPj0gaiAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy90aGUgbmV4dCBhcnJheSBpdGVtIGlzIGJldHRlciB0aGFuIGEgc2hhbGxvd2VyIHN1YnN0cmluZyBvZiB0aGlzIG9uZVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgai0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtb21lbnQuZm4uX2xhbmc7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBGb3JtYXR0aW5nXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICBmdW5jdGlvbiByZW1vdmVGb3JtYXR0aW5nVG9rZW5zKGlucHV0KSB7XG4gICAgICAgIGlmIChpbnB1dC5tYXRjaCgvXFxbW1xcc1xcU10vKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL15cXFt8XFxdJC9nLCBcIlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvXFxcXC9nLCBcIlwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlRm9ybWF0RnVuY3Rpb24oZm9ybWF0KSB7XG4gICAgICAgIHZhciBhcnJheSA9IGZvcm1hdC5tYXRjaChmb3JtYXR0aW5nVG9rZW5zKSwgaSwgbGVuZ3RoO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0VG9rZW5GdW5jdGlvbnNbYXJyYXlbaV1dKSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSBmb3JtYXRUb2tlbkZ1bmN0aW9uc1thcnJheVtpXV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gcmVtb3ZlRm9ybWF0dGluZ1Rva2VucyhhcnJheVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1vbSkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IFwiXCI7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gYXJyYXlbaV0gaW5zdGFuY2VvZiBGdW5jdGlvbiA/IGFycmF5W2ldLmNhbGwobW9tLCBmb3JtYXQpIDogYXJyYXlbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIGZvcm1hdCBkYXRlIHVzaW5nIG5hdGl2ZSBkYXRlIG9iamVjdFxuICAgIGZ1bmN0aW9uIGZvcm1hdE1vbWVudChtLCBmb3JtYXQpIHtcblxuICAgICAgICBpZiAoIW0uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbS5sYW5nKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1hdCA9IGV4cGFuZEZvcm1hdChmb3JtYXQsIG0ubGFuZygpKTtcblxuICAgICAgICBpZiAoIWZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdKSB7XG4gICAgICAgICAgICBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSA9IG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdKG0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4cGFuZEZvcm1hdChmb3JtYXQsIGxhbmcpIHtcbiAgICAgICAgdmFyIGkgPSA1O1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlcGxhY2VMb25nRGF0ZUZvcm1hdFRva2VucyhpbnB1dCkge1xuICAgICAgICAgICAgcmV0dXJuIGxhbmcubG9uZ0RhdGVGb3JtYXQoaW5wdXQpIHx8IGlucHV0O1xuICAgICAgICB9XG5cbiAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIHdoaWxlIChpID49IDAgJiYgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLnRlc3QoZm9ybWF0KSkge1xuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UobG9jYWxGb3JtYXR0aW5nVG9rZW5zLCByZXBsYWNlTG9uZ0RhdGVGb3JtYXRUb2tlbnMpO1xuICAgICAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICBpIC09IDE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9ybWF0O1xuICAgIH1cblxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBQYXJzaW5nXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICAvLyBnZXQgdGhlIHJlZ2V4IHRvIGZpbmQgdGhlIG5leHQgdG9rZW5cbiAgICBmdW5jdGlvbiBnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4odG9rZW4sIGNvbmZpZykge1xuICAgICAgICB2YXIgYSwgc3RyaWN0ID0gY29uZmlnLl9zdHJpY3Q7XG4gICAgICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgICAgY2FzZSAnUSc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlbk9uZURpZ2l0O1xuICAgICAgICBjYXNlICdEREREJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuVGhyZWVEaWdpdHM7XG4gICAgICAgIGNhc2UgJ1lZWVknOlxuICAgICAgICBjYXNlICdHR0dHJzpcbiAgICAgICAgY2FzZSAnZ2dnZyc6XG4gICAgICAgICAgICByZXR1cm4gc3RyaWN0ID8gcGFyc2VUb2tlbkZvdXJEaWdpdHMgOiBwYXJzZVRva2VuT25lVG9Gb3VyRGlnaXRzO1xuICAgICAgICBjYXNlICdZJzpcbiAgICAgICAgY2FzZSAnRyc6XG4gICAgICAgIGNhc2UgJ2cnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5TaWduZWROdW1iZXI7XG4gICAgICAgIGNhc2UgJ1lZWVlZWSc6XG4gICAgICAgIGNhc2UgJ1lZWVlZJzpcbiAgICAgICAgY2FzZSAnR0dHR0cnOlxuICAgICAgICBjYXNlICdnZ2dnZyc6XG4gICAgICAgICAgICByZXR1cm4gc3RyaWN0ID8gcGFyc2VUb2tlblNpeERpZ2l0cyA6IHBhcnNlVG9rZW5PbmVUb1NpeERpZ2l0cztcbiAgICAgICAgY2FzZSAnUyc6XG4gICAgICAgICAgICBpZiAoc3RyaWN0KSB7IHJldHVybiBwYXJzZVRva2VuT25lRGlnaXQ7IH1cbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnU1MnOlxuICAgICAgICAgICAgaWYgKHN0cmljdCkgeyByZXR1cm4gcGFyc2VUb2tlblR3b0RpZ2l0czsgfVxuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdTU1MnOlxuICAgICAgICAgICAgaWYgKHN0cmljdCkgeyByZXR1cm4gcGFyc2VUb2tlblRocmVlRGlnaXRzOyB9XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ0RERCc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlbk9uZVRvVGhyZWVEaWdpdHM7XG4gICAgICAgIGNhc2UgJ01NTSc6XG4gICAgICAgIGNhc2UgJ01NTU0nOlxuICAgICAgICBjYXNlICdkZCc6XG4gICAgICAgIGNhc2UgJ2RkZCc6XG4gICAgICAgIGNhc2UgJ2RkZGQnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5Xb3JkO1xuICAgICAgICBjYXNlICdhJzpcbiAgICAgICAgY2FzZSAnQSc6XG4gICAgICAgICAgICByZXR1cm4gZ2V0TGFuZ0RlZmluaXRpb24oY29uZmlnLl9sKS5fbWVyaWRpZW1QYXJzZTtcbiAgICAgICAgY2FzZSAnWCc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlblRpbWVzdGFtcE1zO1xuICAgICAgICBjYXNlICdaJzpcbiAgICAgICAgY2FzZSAnWlonOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5UaW1lem9uZTtcbiAgICAgICAgY2FzZSAnVCc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlblQ7XG4gICAgICAgIGNhc2UgJ1NTU1MnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5EaWdpdHM7XG4gICAgICAgIGNhc2UgJ01NJzpcbiAgICAgICAgY2FzZSAnREQnOlxuICAgICAgICBjYXNlICdZWSc6XG4gICAgICAgIGNhc2UgJ0dHJzpcbiAgICAgICAgY2FzZSAnZ2cnOlxuICAgICAgICBjYXNlICdISCc6XG4gICAgICAgIGNhc2UgJ2hoJzpcbiAgICAgICAgY2FzZSAnbW0nOlxuICAgICAgICBjYXNlICdzcyc6XG4gICAgICAgIGNhc2UgJ3d3JzpcbiAgICAgICAgY2FzZSAnV1cnOlxuICAgICAgICAgICAgcmV0dXJuIHN0cmljdCA/IHBhcnNlVG9rZW5Ud29EaWdpdHMgOiBwYXJzZVRva2VuT25lT3JUd29EaWdpdHM7XG4gICAgICAgIGNhc2UgJ00nOlxuICAgICAgICBjYXNlICdEJzpcbiAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgIGNhc2UgJ0gnOlxuICAgICAgICBjYXNlICdoJzpcbiAgICAgICAgY2FzZSAnbSc6XG4gICAgICAgIGNhc2UgJ3MnOlxuICAgICAgICBjYXNlICd3JzpcbiAgICAgICAgY2FzZSAnVyc6XG4gICAgICAgIGNhc2UgJ2UnOlxuICAgICAgICBjYXNlICdFJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuT25lT3JUd29EaWdpdHM7XG4gICAgICAgIGNhc2UgJ0RvJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuT3JkaW5hbDtcbiAgICAgICAgZGVmYXVsdCA6XG4gICAgICAgICAgICBhID0gbmV3IFJlZ0V4cChyZWdleHBFc2NhcGUodW5lc2NhcGVGb3JtYXQodG9rZW4ucmVwbGFjZSgnXFxcXCcsICcnKSksIFwiaVwiKSk7XG4gICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRpbWV6b25lTWludXRlc0Zyb21TdHJpbmcoc3RyaW5nKSB7XG4gICAgICAgIHN0cmluZyA9IHN0cmluZyB8fCBcIlwiO1xuICAgICAgICB2YXIgcG9zc2libGVUek1hdGNoZXMgPSAoc3RyaW5nLm1hdGNoKHBhcnNlVG9rZW5UaW1lem9uZSkgfHwgW10pLFxuICAgICAgICAgICAgdHpDaHVuayA9IHBvc3NpYmxlVHpNYXRjaGVzW3Bvc3NpYmxlVHpNYXRjaGVzLmxlbmd0aCAtIDFdIHx8IFtdLFxuICAgICAgICAgICAgcGFydHMgPSAodHpDaHVuayArICcnKS5tYXRjaChwYXJzZVRpbWV6b25lQ2h1bmtlcikgfHwgWyctJywgMCwgMF0sXG4gICAgICAgICAgICBtaW51dGVzID0gKyhwYXJ0c1sxXSAqIDYwKSArIHRvSW50KHBhcnRzWzJdKTtcblxuICAgICAgICByZXR1cm4gcGFydHNbMF0gPT09ICcrJyA/IC1taW51dGVzIDogbWludXRlcztcbiAgICB9XG5cbiAgICAvLyBmdW5jdGlvbiB0byBjb252ZXJ0IHN0cmluZyBpbnB1dCB0byBkYXRlXG4gICAgZnVuY3Rpb24gYWRkVGltZVRvQXJyYXlGcm9tVG9rZW4odG9rZW4sIGlucHV0LCBjb25maWcpIHtcbiAgICAgICAgdmFyIGEsIGRhdGVQYXJ0QXJyYXkgPSBjb25maWcuX2E7XG5cbiAgICAgICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgICAvLyBRVUFSVEVSXG4gICAgICAgIGNhc2UgJ1EnOlxuICAgICAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkYXRlUGFydEFycmF5W01PTlRIXSA9ICh0b0ludChpbnB1dCkgLSAxKSAqIDM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gTU9OVEhcbiAgICAgICAgY2FzZSAnTScgOiAvLyBmYWxsIHRocm91Z2ggdG8gTU1cbiAgICAgICAgY2FzZSAnTU0nIDpcbiAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtNT05USF0gPSB0b0ludChpbnB1dCkgLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ01NTScgOiAvLyBmYWxsIHRocm91Z2ggdG8gTU1NTVxuICAgICAgICBjYXNlICdNTU1NJyA6XG4gICAgICAgICAgICBhID0gZ2V0TGFuZ0RlZmluaXRpb24oY29uZmlnLl9sKS5tb250aHNQYXJzZShpbnB1dCk7XG4gICAgICAgICAgICAvLyBpZiB3ZSBkaWRuJ3QgZmluZCBhIG1vbnRoIG5hbWUsIG1hcmsgdGhlIGRhdGUgYXMgaW52YWxpZC5cbiAgICAgICAgICAgIGlmIChhICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkYXRlUGFydEFycmF5W01PTlRIXSA9IGE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fcGYuaW52YWxpZE1vbnRoID0gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gREFZIE9GIE1PTlRIXG4gICAgICAgIGNhc2UgJ0QnIDogLy8gZmFsbCB0aHJvdWdoIHRvIEREXG4gICAgICAgIGNhc2UgJ0REJyA6XG4gICAgICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbREFURV0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnRG8nIDpcbiAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtEQVRFXSA9IHRvSW50KHBhcnNlSW50KGlucHV0LCAxMCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIERBWSBPRiBZRUFSXG4gICAgICAgIGNhc2UgJ0RERCcgOiAvLyBmYWxsIHRocm91Z2ggdG8gRERERFxuICAgICAgICBjYXNlICdEREREJyA6XG4gICAgICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fZGF5T2ZZZWFyID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gWUVBUlxuICAgICAgICBjYXNlICdZWScgOlxuICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtZRUFSXSA9IG1vbWVudC5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnWVlZWScgOlxuICAgICAgICBjYXNlICdZWVlZWScgOlxuICAgICAgICBjYXNlICdZWVlZWVknIDpcbiAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbWUVBUl0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gQU0gLyBQTVxuICAgICAgICBjYXNlICdhJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBBXG4gICAgICAgIGNhc2UgJ0EnIDpcbiAgICAgICAgICAgIGNvbmZpZy5faXNQbSA9IGdldExhbmdEZWZpbml0aW9uKGNvbmZpZy5fbCkuaXNQTShpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gMjQgSE9VUlxuICAgICAgICBjYXNlICdIJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBoaFxuICAgICAgICBjYXNlICdISCcgOiAvLyBmYWxsIHRocm91Z2ggdG8gaGhcbiAgICAgICAgY2FzZSAnaCcgOiAvLyBmYWxsIHRocm91Z2ggdG8gaGhcbiAgICAgICAgY2FzZSAnaGgnIDpcbiAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gTUlOVVRFXG4gICAgICAgIGNhc2UgJ20nIDogLy8gZmFsbCB0aHJvdWdoIHRvIG1tXG4gICAgICAgIGNhc2UgJ21tJyA6XG4gICAgICAgICAgICBkYXRlUGFydEFycmF5W01JTlVURV0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gU0VDT05EXG4gICAgICAgIGNhc2UgJ3MnIDogLy8gZmFsbCB0aHJvdWdoIHRvIHNzXG4gICAgICAgIGNhc2UgJ3NzJyA6XG4gICAgICAgICAgICBkYXRlUGFydEFycmF5W1NFQ09ORF0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gTUlMTElTRUNPTkRcbiAgICAgICAgY2FzZSAnUycgOlxuICAgICAgICBjYXNlICdTUycgOlxuICAgICAgICBjYXNlICdTU1MnIDpcbiAgICAgICAgY2FzZSAnU1NTUycgOlxuICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtNSUxMSVNFQ09ORF0gPSB0b0ludCgoJzAuJyArIGlucHV0KSAqIDEwMDApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFVOSVggVElNRVNUQU1QIFdJVEggTVNcbiAgICAgICAgY2FzZSAnWCc6XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShwYXJzZUZsb2F0KGlucHV0KSAqIDEwMDApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFRJTUVaT05FXG4gICAgICAgIGNhc2UgJ1onIDogLy8gZmFsbCB0aHJvdWdoIHRvIFpaXG4gICAgICAgIGNhc2UgJ1paJyA6XG4gICAgICAgICAgICBjb25maWcuX3VzZVVUQyA9IHRydWU7XG4gICAgICAgICAgICBjb25maWcuX3R6bSA9IHRpbWV6b25lTWludXRlc0Zyb21TdHJpbmcoaW5wdXQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFdFRUtEQVkgLSBodW1hblxuICAgICAgICBjYXNlICdkZCc6XG4gICAgICAgIGNhc2UgJ2RkZCc6XG4gICAgICAgIGNhc2UgJ2RkZGQnOlxuICAgICAgICAgICAgYSA9IGdldExhbmdEZWZpbml0aW9uKGNvbmZpZy5fbCkud2Vla2RheXNQYXJzZShpbnB1dCk7XG4gICAgICAgICAgICAvLyBpZiB3ZSBkaWRuJ3QgZ2V0IGEgd2Vla2RheSBuYW1lLCBtYXJrIHRoZSBkYXRlIGFzIGludmFsaWRcbiAgICAgICAgICAgIGlmIChhICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX3cgPSBjb25maWcuX3cgfHwge307XG4gICAgICAgICAgICAgICAgY29uZmlnLl93WydkJ10gPSBhO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX3BmLmludmFsaWRXZWVrZGF5ID0gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gV0VFSywgV0VFSyBEQVkgLSBudW1lcmljXG4gICAgICAgIGNhc2UgJ3cnOlxuICAgICAgICBjYXNlICd3dyc6XG4gICAgICAgIGNhc2UgJ1cnOlxuICAgICAgICBjYXNlICdXVyc6XG4gICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICBjYXNlICdlJzpcbiAgICAgICAgY2FzZSAnRSc6XG4gICAgICAgICAgICB0b2tlbiA9IHRva2VuLnN1YnN0cigwLCAxKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnZ2dnZyc6XG4gICAgICAgIGNhc2UgJ0dHR0cnOlxuICAgICAgICBjYXNlICdHR0dHRyc6XG4gICAgICAgICAgICB0b2tlbiA9IHRva2VuLnN1YnN0cigwLCAyKTtcbiAgICAgICAgICAgIGlmIChpbnB1dCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fdyA9IGNvbmZpZy5fdyB8fCB7fTtcbiAgICAgICAgICAgICAgICBjb25maWcuX3dbdG9rZW5dID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2dnJzpcbiAgICAgICAgY2FzZSAnR0cnOlxuICAgICAgICAgICAgY29uZmlnLl93ID0gY29uZmlnLl93IHx8IHt9O1xuICAgICAgICAgICAgY29uZmlnLl93W3Rva2VuXSA9IG1vbWVudC5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla0luZm8oY29uZmlnKSB7XG4gICAgICAgIHZhciB3LCB3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3ksIHRlbXAsIGxhbmc7XG5cbiAgICAgICAgdyA9IGNvbmZpZy5fdztcbiAgICAgICAgaWYgKHcuR0cgIT0gbnVsbCB8fCB3LlcgIT0gbnVsbCB8fCB3LkUgIT0gbnVsbCkge1xuICAgICAgICAgICAgZG93ID0gMTtcbiAgICAgICAgICAgIGRveSA9IDQ7XG5cbiAgICAgICAgICAgIC8vIFRPRE86IFdlIG5lZWQgdG8gdGFrZSB0aGUgY3VycmVudCBpc29XZWVrWWVhciwgYnV0IHRoYXQgZGVwZW5kcyBvblxuICAgICAgICAgICAgLy8gaG93IHdlIGludGVycHJldCBub3cgKGxvY2FsLCB1dGMsIGZpeGVkIG9mZnNldCkuIFNvIGNyZWF0ZVxuICAgICAgICAgICAgLy8gYSBub3cgdmVyc2lvbiBvZiBjdXJyZW50IGNvbmZpZyAodGFrZSBsb2NhbC91dGMvb2Zmc2V0IGZsYWdzLCBhbmRcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBub3cpLlxuICAgICAgICAgICAgd2Vla1llYXIgPSBkZmwody5HRywgY29uZmlnLl9hW1lFQVJdLCB3ZWVrT2ZZZWFyKG1vbWVudCgpLCAxLCA0KS55ZWFyKTtcbiAgICAgICAgICAgIHdlZWsgPSBkZmwody5XLCAxKTtcbiAgICAgICAgICAgIHdlZWtkYXkgPSBkZmwody5FLCAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxhbmcgPSBnZXRMYW5nRGVmaW5pdGlvbihjb25maWcuX2wpO1xuICAgICAgICAgICAgZG93ID0gbGFuZy5fd2Vlay5kb3c7XG4gICAgICAgICAgICBkb3kgPSBsYW5nLl93ZWVrLmRveTtcblxuICAgICAgICAgICAgd2Vla1llYXIgPSBkZmwody5nZywgY29uZmlnLl9hW1lFQVJdLCB3ZWVrT2ZZZWFyKG1vbWVudCgpLCBkb3csIGRveSkueWVhcik7XG4gICAgICAgICAgICB3ZWVrID0gZGZsKHcudywgMSk7XG5cbiAgICAgICAgICAgIGlmICh3LmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIHdlZWtkYXkgLS0gbG93IGRheSBudW1iZXJzIGFyZSBjb25zaWRlcmVkIG5leHQgd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSB3LmQ7XG4gICAgICAgICAgICAgICAgaWYgKHdlZWtkYXkgPCBkb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgKyt3ZWVrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAody5lICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBsb2NhbCB3ZWVrZGF5IC0tIGNvdW50aW5nIHN0YXJ0cyBmcm9tIGJlZ2luaW5nIG9mIHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gdy5lICsgZG93O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBkZWZhdWx0IHRvIGJlZ2luaW5nIG9mIHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gZG93O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXAgPSBkYXlPZlllYXJGcm9tV2Vla3Mod2Vla1llYXIsIHdlZWssIHdlZWtkYXksIGRveSwgZG93KTtcblxuICAgICAgICBjb25maWcuX2FbWUVBUl0gPSB0ZW1wLnllYXI7XG4gICAgICAgIGNvbmZpZy5fZGF5T2ZZZWFyID0gdGVtcC5kYXlPZlllYXI7XG4gICAgfVxuXG4gICAgLy8gY29udmVydCBhbiBhcnJheSB0byBhIGRhdGUuXG4gICAgLy8gdGhlIGFycmF5IHNob3VsZCBtaXJyb3IgdGhlIHBhcmFtZXRlcnMgYmVsb3dcbiAgICAvLyBub3RlOiBhbGwgdmFsdWVzIHBhc3QgdGhlIHllYXIgYXJlIG9wdGlvbmFsIGFuZCB3aWxsIGRlZmF1bHQgdG8gdGhlIGxvd2VzdCBwb3NzaWJsZSB2YWx1ZS5cbiAgICAvLyBbeWVhciwgbW9udGgsIGRheSAsIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCBtaWxsaXNlY29uZF1cbiAgICBmdW5jdGlvbiBkYXRlRnJvbUNvbmZpZyhjb25maWcpIHtcbiAgICAgICAgdmFyIGksIGRhdGUsIGlucHV0ID0gW10sIGN1cnJlbnREYXRlLCB5ZWFyVG9Vc2U7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudERhdGUgPSBjdXJyZW50RGF0ZUFycmF5KGNvbmZpZyk7XG5cbiAgICAgICAgLy9jb21wdXRlIGRheSBvZiB0aGUgeWVhciBmcm9tIHdlZWtzIGFuZCB3ZWVrZGF5c1xuICAgICAgICBpZiAoY29uZmlnLl93ICYmIGNvbmZpZy5fYVtEQVRFXSA9PSBudWxsICYmIGNvbmZpZy5fYVtNT05USF0gPT0gbnVsbCkge1xuICAgICAgICAgICAgZGF5T2ZZZWFyRnJvbVdlZWtJbmZvKGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2lmIHRoZSBkYXkgb2YgdGhlIHllYXIgaXMgc2V0LCBmaWd1cmUgb3V0IHdoYXQgaXQgaXNcbiAgICAgICAgaWYgKGNvbmZpZy5fZGF5T2ZZZWFyKSB7XG4gICAgICAgICAgICB5ZWFyVG9Vc2UgPSBkZmwoY29uZmlnLl9hW1lFQVJdLCBjdXJyZW50RGF0ZVtZRUFSXSk7XG5cbiAgICAgICAgICAgIGlmIChjb25maWcuX2RheU9mWWVhciA+IGRheXNJblllYXIoeWVhclRvVXNlKSkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fcGYuX292ZXJmbG93RGF5T2ZZZWFyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGF0ZSA9IG1ha2VVVENEYXRlKHllYXJUb1VzZSwgMCwgY29uZmlnLl9kYXlPZlllYXIpO1xuICAgICAgICAgICAgY29uZmlnLl9hW01PTlRIXSA9IGRhdGUuZ2V0VVRDTW9udGgoKTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtEQVRFXSA9IGRhdGUuZ2V0VVRDRGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGVmYXVsdCB0byBjdXJyZW50IGRhdGUuXG4gICAgICAgIC8vICogaWYgbm8geWVhciwgbW9udGgsIGRheSBvZiBtb250aCBhcmUgZ2l2ZW4sIGRlZmF1bHQgdG8gdG9kYXlcbiAgICAgICAgLy8gKiBpZiBkYXkgb2YgbW9udGggaXMgZ2l2ZW4sIGRlZmF1bHQgbW9udGggYW5kIHllYXJcbiAgICAgICAgLy8gKiBpZiBtb250aCBpcyBnaXZlbiwgZGVmYXVsdCBvbmx5IHllYXJcbiAgICAgICAgLy8gKiBpZiB5ZWFyIGlzIGdpdmVuLCBkb24ndCBkZWZhdWx0IGFueXRoaW5nXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAzICYmIGNvbmZpZy5fYVtpXSA9PSBudWxsOyArK2kpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtpXSA9IGlucHV0W2ldID0gY3VycmVudERhdGVbaV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBaZXJvIG91dCB3aGF0ZXZlciB3YXMgbm90IGRlZmF1bHRlZCwgaW5jbHVkaW5nIHRpbWVcbiAgICAgICAgZm9yICg7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtpXSA9IGlucHV0W2ldID0gKGNvbmZpZy5fYVtpXSA9PSBudWxsKSA/IChpID09PSAyID8gMSA6IDApIDogY29uZmlnLl9hW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnLl9kID0gKGNvbmZpZy5fdXNlVVRDID8gbWFrZVVUQ0RhdGUgOiBtYWtlRGF0ZSkuYXBwbHkobnVsbCwgaW5wdXQpO1xuICAgICAgICAvLyBBcHBseSB0aW1lem9uZSBvZmZzZXQgZnJvbSBpbnB1dC4gVGhlIGFjdHVhbCB6b25lIGNhbiBiZSBjaGFuZ2VkXG4gICAgICAgIC8vIHdpdGggcGFyc2Vab25lLlxuICAgICAgICBpZiAoY29uZmlnLl90em0gIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uZmlnLl9kLnNldFVUQ01pbnV0ZXMoY29uZmlnLl9kLmdldFVUQ01pbnV0ZXMoKSArIGNvbmZpZy5fdHptKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRhdGVGcm9tT2JqZWN0KGNvbmZpZykge1xuICAgICAgICB2YXIgbm9ybWFsaXplZElucHV0O1xuXG4gICAgICAgIGlmIChjb25maWcuX2QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vcm1hbGl6ZWRJbnB1dCA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKGNvbmZpZy5faSk7XG4gICAgICAgIGNvbmZpZy5fYSA9IFtcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dC55ZWFyLFxuICAgICAgICAgICAgbm9ybWFsaXplZElucHV0Lm1vbnRoLFxuICAgICAgICAgICAgbm9ybWFsaXplZElucHV0LmRheSxcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dC5ob3VyLFxuICAgICAgICAgICAgbm9ybWFsaXplZElucHV0Lm1pbnV0ZSxcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dC5zZWNvbmQsXG4gICAgICAgICAgICBub3JtYWxpemVkSW5wdXQubWlsbGlzZWNvbmRcbiAgICAgICAgXTtcblxuICAgICAgICBkYXRlRnJvbUNvbmZpZyhjb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGN1cnJlbnREYXRlQXJyYXkoY29uZmlnKSB7XG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBpZiAoY29uZmlnLl91c2VVVEMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgbm93LmdldFVUQ0Z1bGxZZWFyKCksXG4gICAgICAgICAgICAgICAgbm93LmdldFVUQ01vbnRoKCksXG4gICAgICAgICAgICAgICAgbm93LmdldFVUQ0RhdGUoKVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbbm93LmdldEZ1bGxZZWFyKCksIG5vdy5nZXRNb250aCgpLCBub3cuZ2V0RGF0ZSgpXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSBzdHJpbmcgYW5kIGZvcm1hdCBzdHJpbmdcbiAgICBmdW5jdGlvbiBtYWtlRGF0ZUZyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKSB7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fZiA9PT0gbW9tZW50LklTT184NjAxKSB7XG4gICAgICAgICAgICBwYXJzZUlTTyhjb25maWcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnLl9hID0gW107XG4gICAgICAgIGNvbmZpZy5fcGYuZW1wdHkgPSB0cnVlO1xuXG4gICAgICAgIC8vIFRoaXMgYXJyYXkgaXMgdXNlZCB0byBtYWtlIGEgRGF0ZSwgZWl0aGVyIHdpdGggYG5ldyBEYXRlYCBvciBgRGF0ZS5VVENgXG4gICAgICAgIHZhciBsYW5nID0gZ2V0TGFuZ0RlZmluaXRpb24oY29uZmlnLl9sKSxcbiAgICAgICAgICAgIHN0cmluZyA9ICcnICsgY29uZmlnLl9pLFxuICAgICAgICAgICAgaSwgcGFyc2VkSW5wdXQsIHRva2VucywgdG9rZW4sIHNraXBwZWQsXG4gICAgICAgICAgICBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoLFxuICAgICAgICAgICAgdG90YWxQYXJzZWRJbnB1dExlbmd0aCA9IDA7XG5cbiAgICAgICAgdG9rZW5zID0gZXhwYW5kRm9ybWF0KGNvbmZpZy5fZiwgbGFuZykubWF0Y2goZm9ybWF0dGluZ1Rva2VucykgfHwgW107XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgICAgICBwYXJzZWRJbnB1dCA9IChzdHJpbmcubWF0Y2goZ2V0UGFyc2VSZWdleEZvclRva2VuKHRva2VuLCBjb25maWcpKSB8fCBbXSlbMF07XG4gICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBza2lwcGVkID0gc3RyaW5nLnN1YnN0cigwLCBzdHJpbmcuaW5kZXhPZihwYXJzZWRJbnB1dCkpO1xuICAgICAgICAgICAgICAgIGlmIChza2lwcGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9wZi51bnVzZWRJbnB1dC5wdXNoKHNraXBwZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc2xpY2Uoc3RyaW5nLmluZGV4T2YocGFyc2VkSW5wdXQpICsgcGFyc2VkSW5wdXQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoICs9IHBhcnNlZElucHV0Lmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGRvbid0IHBhcnNlIGlmIGl0J3Mgbm90IGEga25vd24gdG9rZW5cbiAgICAgICAgICAgIGlmIChmb3JtYXRUb2tlbkZ1bmN0aW9uc1t0b2tlbl0pIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9wZi5lbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9wZi51bnVzZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBwYXJzZWRJbnB1dCwgY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbmZpZy5fc3RyaWN0ICYmICFwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fcGYudW51c2VkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIHJlbWFpbmluZyB1bnBhcnNlZCBpbnB1dCBsZW5ndGggdG8gdGhlIHN0cmluZ1xuICAgICAgICBjb25maWcuX3BmLmNoYXJzTGVmdE92ZXIgPSBzdHJpbmdMZW5ndGggLSB0b3RhbFBhcnNlZElucHV0TGVuZ3RoO1xuICAgICAgICBpZiAoc3RyaW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbmZpZy5fcGYudW51c2VkSW5wdXQucHVzaChzdHJpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGFuZGxlIGFtIHBtXG4gICAgICAgIGlmIChjb25maWcuX2lzUG0gJiYgY29uZmlnLl9hW0hPVVJdIDwgMTIpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSArPSAxMjtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiBpcyAxMiBhbSwgY2hhbmdlIGhvdXJzIHRvIDBcbiAgICAgICAgaWYgKGNvbmZpZy5faXNQbSA9PT0gZmFsc2UgJiYgY29uZmlnLl9hW0hPVVJdID09PSAxMikge1xuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGVGcm9tQ29uZmlnKGNvbmZpZyk7XG4gICAgICAgIGNoZWNrT3ZlcmZsb3coY29uZmlnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1bmVzY2FwZUZvcm1hdChzKSB7XG4gICAgICAgIHJldHVybiBzLnJlcGxhY2UoL1xcXFwoXFxbKXxcXFxcKFxcXSl8XFxbKFteXFxdXFxbXSopXFxdfFxcXFwoLikvZywgZnVuY3Rpb24gKG1hdGNoZWQsIHAxLCBwMiwgcDMsIHA0KSB7XG4gICAgICAgICAgICByZXR1cm4gcDEgfHwgcDIgfHwgcDMgfHwgcDQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIENvZGUgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM1NjE0OTMvaXMtdGhlcmUtYS1yZWdleHAtZXNjYXBlLWZ1bmN0aW9uLWluLWphdmFzY3JpcHRcbiAgICBmdW5jdGlvbiByZWdleHBFc2NhcGUocykge1xuICAgICAgICByZXR1cm4gcy5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcbiAgICB9XG5cbiAgICAvLyBkYXRlIGZyb20gc3RyaW5nIGFuZCBhcnJheSBvZiBmb3JtYXQgc3RyaW5nc1xuICAgIGZ1bmN0aW9uIG1ha2VEYXRlRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZykge1xuICAgICAgICB2YXIgdGVtcENvbmZpZyxcbiAgICAgICAgICAgIGJlc3RNb21lbnQsXG5cbiAgICAgICAgICAgIHNjb3JlVG9CZWF0LFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZTtcblxuICAgICAgICBpZiAoY29uZmlnLl9mLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29uZmlnLl9wZi5pbnZhbGlkRm9ybWF0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKE5hTik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29uZmlnLl9mLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgPSAwO1xuICAgICAgICAgICAgdGVtcENvbmZpZyA9IGV4dGVuZCh7fSwgY29uZmlnKTtcbiAgICAgICAgICAgIHRlbXBDb25maWcuX3BmID0gZGVmYXVsdFBhcnNpbmdGbGFncygpO1xuICAgICAgICAgICAgdGVtcENvbmZpZy5fZiA9IGNvbmZpZy5fZltpXTtcbiAgICAgICAgICAgIG1ha2VEYXRlRnJvbVN0cmluZ0FuZEZvcm1hdCh0ZW1wQ29uZmlnKTtcblxuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKHRlbXBDb25maWcpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGFueSBpbnB1dCB0aGF0IHdhcyBub3QgcGFyc2VkIGFkZCBhIHBlbmFsdHkgZm9yIHRoYXQgZm9ybWF0XG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgKz0gdGVtcENvbmZpZy5fcGYuY2hhcnNMZWZ0T3ZlcjtcblxuICAgICAgICAgICAgLy9vciB0b2tlbnNcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSArPSB0ZW1wQ29uZmlnLl9wZi51bnVzZWRUb2tlbnMubGVuZ3RoICogMTA7XG5cbiAgICAgICAgICAgIHRlbXBDb25maWcuX3BmLnNjb3JlID0gY3VycmVudFNjb3JlO1xuXG4gICAgICAgICAgICBpZiAoc2NvcmVUb0JlYXQgPT0gbnVsbCB8fCBjdXJyZW50U2NvcmUgPCBzY29yZVRvQmVhdCkge1xuICAgICAgICAgICAgICAgIHNjb3JlVG9CZWF0ID0gY3VycmVudFNjb3JlO1xuICAgICAgICAgICAgICAgIGJlc3RNb21lbnQgPSB0ZW1wQ29uZmlnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXh0ZW5kKGNvbmZpZywgYmVzdE1vbWVudCB8fCB0ZW1wQ29uZmlnKTtcbiAgICB9XG5cbiAgICAvLyBkYXRlIGZyb20gaXNvIGZvcm1hdFxuICAgIGZ1bmN0aW9uIHBhcnNlSVNPKGNvbmZpZykge1xuICAgICAgICB2YXIgaSwgbCxcbiAgICAgICAgICAgIHN0cmluZyA9IGNvbmZpZy5faSxcbiAgICAgICAgICAgIG1hdGNoID0gaXNvUmVnZXguZXhlYyhzdHJpbmcpO1xuXG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgY29uZmlnLl9wZi5pc28gPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IGlzb0RhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpc29EYXRlc1tpXVsxXS5leGVjKHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWF0Y2hbNV0gc2hvdWxkIGJlIFwiVFwiIG9yIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICBjb25maWcuX2YgPSBpc29EYXRlc1tpXVswXSArIChtYXRjaFs2XSB8fCBcIiBcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSBpc29UaW1lcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNvVGltZXNbaV1bMV0uZXhlYyhzdHJpbmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5fZiArPSBpc29UaW1lc1tpXVswXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0cmluZy5tYXRjaChwYXJzZVRva2VuVGltZXpvbmUpKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9mICs9IFwiWlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWFrZURhdGVGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSBpc28gZm9ybWF0IG9yIGZhbGxiYWNrXG4gICAgZnVuY3Rpb24gbWFrZURhdGVGcm9tU3RyaW5nKGNvbmZpZykge1xuICAgICAgICBwYXJzZUlTTyhjb25maWcpO1xuICAgICAgICBpZiAoY29uZmlnLl9pc1ZhbGlkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgZGVsZXRlIGNvbmZpZy5faXNWYWxpZDtcbiAgICAgICAgICAgIG1vbWVudC5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayhjb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZURhdGVGcm9tSW5wdXQoY29uZmlnKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IGNvbmZpZy5faSxcbiAgICAgICAgICAgIG1hdGNoZWQgPSBhc3BOZXRKc29uUmVnZXguZXhlYyhpbnB1dCk7XG5cbiAgICAgICAgaWYgKGlucHV0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAobWF0Y2hlZCkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoK21hdGNoZWRbMV0pO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIG1ha2VEYXRlRnJvbVN0cmluZyhjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2EgPSBpbnB1dC5zbGljZSgwKTtcbiAgICAgICAgICAgIGRhdGVGcm9tQ29uZmlnKGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNEYXRlKGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoK2lucHV0KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YoaW5wdXQpID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgZGF0ZUZyb21PYmplY3QoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YoaW5wdXQpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgLy8gZnJvbSBtaWxsaXNlY29uZHNcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGlucHV0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1vbWVudC5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayhjb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZURhdGUoeSwgbSwgZCwgaCwgTSwgcywgbXMpIHtcbiAgICAgICAgLy9jYW4ndCBqdXN0IGFwcGx5KCkgdG8gY3JlYXRlIGEgZGF0ZTpcbiAgICAgICAgLy9odHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE4MTM0OC9pbnN0YW50aWF0aW5nLWEtamF2YXNjcmlwdC1vYmplY3QtYnktY2FsbGluZy1wcm90b3R5cGUtY29uc3RydWN0b3ItYXBwbHlcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh5LCBtLCBkLCBoLCBNLCBzLCBtcyk7XG5cbiAgICAgICAgLy90aGUgZGF0ZSBjb25zdHJ1Y3RvciBkb2Vzbid0IGFjY2VwdCB5ZWFycyA8IDE5NzBcbiAgICAgICAgaWYgKHkgPCAxOTcwKSB7XG4gICAgICAgICAgICBkYXRlLnNldEZ1bGxZZWFyKHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VVVENEYXRlKHkpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQy5hcHBseShudWxsLCBhcmd1bWVudHMpKTtcbiAgICAgICAgaWYgKHkgPCAxOTcwKSB7XG4gICAgICAgICAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlV2Vla2RheShpbnB1dCwgbGFuZ3VhZ2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmICghaXNOYU4oaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBwYXJzZUludChpbnB1dCwgMTApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBsYW5ndWFnZS53ZWVrZGF5c1BhcnNlKGlucHV0KTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgUmVsYXRpdmUgVGltZVxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgLy8gaGVscGVyIGZ1bmN0aW9uIGZvciBtb21lbnQuZm4uZnJvbSwgbW9tZW50LmZuLmZyb21Ob3csIGFuZCBtb21lbnQuZHVyYXRpb24uZm4uaHVtYW5pemVcbiAgICBmdW5jdGlvbiBzdWJzdGl0dXRlVGltZUFnbyhzdHJpbmcsIG51bWJlciwgd2l0aG91dFN1ZmZpeCwgaXNGdXR1cmUsIGxhbmcpIHtcbiAgICAgICAgcmV0dXJuIGxhbmcucmVsYXRpdmVUaW1lKG51bWJlciB8fCAxLCAhIXdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbGF0aXZlVGltZShtaWxsaXNlY29uZHMsIHdpdGhvdXRTdWZmaXgsIGxhbmcpIHtcbiAgICAgICAgdmFyIHNlY29uZHMgPSByb3VuZChNYXRoLmFicyhtaWxsaXNlY29uZHMpIC8gMTAwMCksXG4gICAgICAgICAgICBtaW51dGVzID0gcm91bmQoc2Vjb25kcyAvIDYwKSxcbiAgICAgICAgICAgIGhvdXJzID0gcm91bmQobWludXRlcyAvIDYwKSxcbiAgICAgICAgICAgIGRheXMgPSByb3VuZChob3VycyAvIDI0KSxcbiAgICAgICAgICAgIHllYXJzID0gcm91bmQoZGF5cyAvIDM2NSksXG4gICAgICAgICAgICBhcmdzID0gc2Vjb25kcyA8IHJlbGF0aXZlVGltZVRocmVzaG9sZHMucyAgJiYgWydzJywgc2Vjb25kc10gfHxcbiAgICAgICAgICAgICAgICBtaW51dGVzID09PSAxICYmIFsnbSddIHx8XG4gICAgICAgICAgICAgICAgbWludXRlcyA8IHJlbGF0aXZlVGltZVRocmVzaG9sZHMubSAmJiBbJ21tJywgbWludXRlc10gfHxcbiAgICAgICAgICAgICAgICBob3VycyA9PT0gMSAmJiBbJ2gnXSB8fFxuICAgICAgICAgICAgICAgIGhvdXJzIDwgcmVsYXRpdmVUaW1lVGhyZXNob2xkcy5oICYmIFsnaGgnLCBob3Vyc10gfHxcbiAgICAgICAgICAgICAgICBkYXlzID09PSAxICYmIFsnZCddIHx8XG4gICAgICAgICAgICAgICAgZGF5cyA8PSByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzLmRkICYmIFsnZGQnLCBkYXlzXSB8fFxuICAgICAgICAgICAgICAgIGRheXMgPD0gcmVsYXRpdmVUaW1lVGhyZXNob2xkcy5kbSAmJiBbJ00nXSB8fFxuICAgICAgICAgICAgICAgIGRheXMgPCByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzLmR5ICYmIFsnTU0nLCByb3VuZChkYXlzIC8gMzApXSB8fFxuICAgICAgICAgICAgICAgIHllYXJzID09PSAxICYmIFsneSddIHx8IFsneXknLCB5ZWFyc107XG4gICAgICAgIGFyZ3NbMl0gPSB3aXRob3V0U3VmZml4O1xuICAgICAgICBhcmdzWzNdID0gbWlsbGlzZWNvbmRzID4gMDtcbiAgICAgICAgYXJnc1s0XSA9IGxhbmc7XG4gICAgICAgIHJldHVybiBzdWJzdGl0dXRlVGltZUFnby5hcHBseSh7fSwgYXJncyk7XG4gICAgfVxuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIFdlZWsgb2YgWWVhclxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgLy8gZmlyc3REYXlPZldlZWsgICAgICAgMCA9IHN1biwgNiA9IHNhdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIHRoZSBkYXkgb2YgdGhlIHdlZWsgdGhhdCBzdGFydHMgdGhlIHdlZWtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAodXN1YWxseSBzdW5kYXkgb3IgbW9uZGF5KVxuICAgIC8vIGZpcnN0RGF5T2ZXZWVrT2ZZZWFyIDAgPSBzdW4sIDYgPSBzYXRcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICB0aGUgZmlyc3Qgd2VlayBpcyB0aGUgd2VlayB0aGF0IGNvbnRhaW5zIHRoZSBmaXJzdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIG9mIHRoaXMgZGF5IG9mIHRoZSB3ZWVrXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgKGVnLiBJU08gd2Vla3MgdXNlIHRodXJzZGF5ICg0KSlcbiAgICBmdW5jdGlvbiB3ZWVrT2ZZZWFyKG1vbSwgZmlyc3REYXlPZldlZWssIGZpcnN0RGF5T2ZXZWVrT2ZZZWFyKSB7XG4gICAgICAgIHZhciBlbmQgPSBmaXJzdERheU9mV2Vla09mWWVhciAtIGZpcnN0RGF5T2ZXZWVrLFxuICAgICAgICAgICAgZGF5c1RvRGF5T2ZXZWVrID0gZmlyc3REYXlPZldlZWtPZlllYXIgLSBtb20uZGF5KCksXG4gICAgICAgICAgICBhZGp1c3RlZE1vbWVudDtcblxuXG4gICAgICAgIGlmIChkYXlzVG9EYXlPZldlZWsgPiBlbmQpIHtcbiAgICAgICAgICAgIGRheXNUb0RheU9mV2VlayAtPSA3O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRheXNUb0RheU9mV2VlayA8IGVuZCAtIDcpIHtcbiAgICAgICAgICAgIGRheXNUb0RheU9mV2VlayArPSA3O1xuICAgICAgICB9XG5cbiAgICAgICAgYWRqdXN0ZWRNb21lbnQgPSBtb21lbnQobW9tKS5hZGQoJ2QnLCBkYXlzVG9EYXlPZldlZWspO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2VlazogTWF0aC5jZWlsKGFkanVzdGVkTW9tZW50LmRheU9mWWVhcigpIC8gNyksXG4gICAgICAgICAgICB5ZWFyOiBhZGp1c3RlZE1vbWVudC55ZWFyKClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvL2h0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSVNPX3dlZWtfZGF0ZSNDYWxjdWxhdGluZ19hX2RhdGVfZ2l2ZW5fdGhlX3llYXIuMkNfd2Vla19udW1iZXJfYW5kX3dlZWtkYXlcbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla3MoeWVhciwgd2Vlaywgd2Vla2RheSwgZmlyc3REYXlPZldlZWtPZlllYXIsIGZpcnN0RGF5T2ZXZWVrKSB7XG4gICAgICAgIHZhciBkID0gbWFrZVVUQ0RhdGUoeWVhciwgMCwgMSkuZ2V0VVRDRGF5KCksIGRheXNUb0FkZCwgZGF5T2ZZZWFyO1xuXG4gICAgICAgIGQgPSBkID09PSAwID8gNyA6IGQ7XG4gICAgICAgIHdlZWtkYXkgPSB3ZWVrZGF5ICE9IG51bGwgPyB3ZWVrZGF5IDogZmlyc3REYXlPZldlZWs7XG4gICAgICAgIGRheXNUb0FkZCA9IGZpcnN0RGF5T2ZXZWVrIC0gZCArIChkID4gZmlyc3REYXlPZldlZWtPZlllYXIgPyA3IDogMCkgLSAoZCA8IGZpcnN0RGF5T2ZXZWVrID8gNyA6IDApO1xuICAgICAgICBkYXlPZlllYXIgPSA3ICogKHdlZWsgLSAxKSArICh3ZWVrZGF5IC0gZmlyc3REYXlPZldlZWspICsgZGF5c1RvQWRkICsgMTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeWVhcjogZGF5T2ZZZWFyID4gMCA/IHllYXIgOiB5ZWFyIC0gMSxcbiAgICAgICAgICAgIGRheU9mWWVhcjogZGF5T2ZZZWFyID4gMCA/ICBkYXlPZlllYXIgOiBkYXlzSW5ZZWFyKHllYXIgLSAxKSArIGRheU9mWWVhclxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgVG9wIExldmVsIEZ1bmN0aW9uc1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIGZ1bmN0aW9uIG1ha2VNb21lbnQoY29uZmlnKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IGNvbmZpZy5faSxcbiAgICAgICAgICAgIGZvcm1hdCA9IGNvbmZpZy5fZjtcblxuICAgICAgICBpZiAoaW5wdXQgPT09IG51bGwgfHwgKGZvcm1hdCA9PT0gdW5kZWZpbmVkICYmIGlucHV0ID09PSAnJykpIHtcbiAgICAgICAgICAgIHJldHVybiBtb21lbnQuaW52YWxpZCh7bnVsbElucHV0OiB0cnVlfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uZmlnLl9pID0gaW5wdXQgPSBnZXRMYW5nRGVmaW5pdGlvbigpLnByZXBhcnNlKGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb21lbnQuaXNNb21lbnQoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcgPSBjbG9uZU1vbWVudChpbnB1dCk7XG5cbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCtpbnB1dC5fZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0KSB7XG4gICAgICAgICAgICBpZiAoaXNBcnJheShmb3JtYXQpKSB7XG4gICAgICAgICAgICAgICAgbWFrZURhdGVGcm9tU3RyaW5nQW5kQXJyYXkoY29uZmlnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWFrZURhdGVGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYWtlRGF0ZUZyb21JbnB1dChjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBNb21lbnQoY29uZmlnKTtcbiAgICB9XG5cbiAgICBtb21lbnQgPSBmdW5jdGlvbiAoaW5wdXQsIGZvcm1hdCwgbGFuZywgc3RyaWN0KSB7XG4gICAgICAgIHZhciBjO1xuXG4gICAgICAgIGlmICh0eXBlb2YobGFuZykgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICBzdHJpY3QgPSBsYW5nO1xuICAgICAgICAgICAgbGFuZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICAvLyBvYmplY3QgY29uc3RydWN0aW9uIG11c3QgYmUgZG9uZSB0aGlzIHdheS5cbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE0MjNcbiAgICAgICAgYyA9IHt9O1xuICAgICAgICBjLl9pc0FNb21lbnRPYmplY3QgPSB0cnVlO1xuICAgICAgICBjLl9pID0gaW5wdXQ7XG4gICAgICAgIGMuX2YgPSBmb3JtYXQ7XG4gICAgICAgIGMuX2wgPSBsYW5nO1xuICAgICAgICBjLl9zdHJpY3QgPSBzdHJpY3Q7XG4gICAgICAgIGMuX2lzVVRDID0gZmFsc2U7XG4gICAgICAgIGMuX3BmID0gZGVmYXVsdFBhcnNpbmdGbGFncygpO1xuXG4gICAgICAgIHJldHVybiBtYWtlTW9tZW50KGMpO1xuICAgIH07XG5cbiAgICBtb21lbnQuc3VwcHJlc3NEZXByZWNhdGlvbldhcm5pbmdzID0gZmFsc2U7XG5cbiAgICBtb21lbnQuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2sgPSBkZXByZWNhdGUoXG4gICAgICAgICAgICBcIm1vbWVudCBjb25zdHJ1Y3Rpb24gZmFsbHMgYmFjayB0byBqcyBEYXRlLiBUaGlzIGlzIFwiICtcbiAgICAgICAgICAgIFwiZGlzY291cmFnZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB1cGNvbWluZyBtYWpvciBcIiArXG4gICAgICAgICAgICBcInJlbGVhc2UuIFBsZWFzZSByZWZlciB0byBcIiArXG4gICAgICAgICAgICBcImh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNDA3IGZvciBtb3JlIGluZm8uXCIsXG4gICAgICAgICAgICBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGNvbmZpZy5faSk7XG4gICAgfSk7XG5cbiAgICAvLyBQaWNrIGEgbW9tZW50IG0gZnJvbSBtb21lbnRzIHNvIHRoYXQgbVtmbl0ob3RoZXIpIGlzIHRydWUgZm9yIGFsbFxuICAgIC8vIG90aGVyLiBUaGlzIHJlbGllcyBvbiB0aGUgZnVuY3Rpb24gZm4gdG8gYmUgdHJhbnNpdGl2ZS5cbiAgICAvL1xuICAgIC8vIG1vbWVudHMgc2hvdWxkIGVpdGhlciBiZSBhbiBhcnJheSBvZiBtb21lbnQgb2JqZWN0cyBvciBhbiBhcnJheSwgd2hvc2VcbiAgICAvLyBmaXJzdCBlbGVtZW50IGlzIGFuIGFycmF5IG9mIG1vbWVudCBvYmplY3RzLlxuICAgIGZ1bmN0aW9uIHBpY2tCeShmbiwgbW9tZW50cykge1xuICAgICAgICB2YXIgcmVzLCBpO1xuICAgICAgICBpZiAobW9tZW50cy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShtb21lbnRzWzBdKSkge1xuICAgICAgICAgICAgbW9tZW50cyA9IG1vbWVudHNbMF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtb21lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlcyA9IG1vbWVudHNbMF07XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBtb21lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAobW9tZW50c1tpXVtmbl0ocmVzKSkge1xuICAgICAgICAgICAgICAgIHJlcyA9IG1vbWVudHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBtb21lbnQubWluID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0JlZm9yZScsIGFyZ3MpO1xuICAgIH07XG5cbiAgICBtb21lbnQubWF4ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0FmdGVyJywgYXJncyk7XG4gICAgfTtcblxuICAgIC8vIGNyZWF0aW5nIHdpdGggdXRjXG4gICAgbW9tZW50LnV0YyA9IGZ1bmN0aW9uIChpbnB1dCwgZm9ybWF0LCBsYW5nLCBzdHJpY3QpIHtcbiAgICAgICAgdmFyIGM7XG5cbiAgICAgICAgaWYgKHR5cGVvZihsYW5nKSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICAgIHN0cmljdCA9IGxhbmc7XG4gICAgICAgICAgICBsYW5nID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9iamVjdCBjb25zdHJ1Y3Rpb24gbXVzdCBiZSBkb25lIHRoaXMgd2F5LlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTQyM1xuICAgICAgICBjID0ge307XG4gICAgICAgIGMuX2lzQU1vbWVudE9iamVjdCA9IHRydWU7XG4gICAgICAgIGMuX3VzZVVUQyA9IHRydWU7XG4gICAgICAgIGMuX2lzVVRDID0gdHJ1ZTtcbiAgICAgICAgYy5fbCA9IGxhbmc7XG4gICAgICAgIGMuX2kgPSBpbnB1dDtcbiAgICAgICAgYy5fZiA9IGZvcm1hdDtcbiAgICAgICAgYy5fc3RyaWN0ID0gc3RyaWN0O1xuICAgICAgICBjLl9wZiA9IGRlZmF1bHRQYXJzaW5nRmxhZ3MoKTtcblxuICAgICAgICByZXR1cm4gbWFrZU1vbWVudChjKS51dGMoKTtcbiAgICB9O1xuXG4gICAgLy8gY3JlYXRpbmcgd2l0aCB1bml4IHRpbWVzdGFtcCAoaW4gc2Vjb25kcylcbiAgICBtb21lbnQudW5peCA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICByZXR1cm4gbW9tZW50KGlucHV0ICogMTAwMCk7XG4gICAgfTtcblxuICAgIC8vIGR1cmF0aW9uXG4gICAgbW9tZW50LmR1cmF0aW9uID0gZnVuY3Rpb24gKGlucHV0LCBrZXkpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gaW5wdXQsXG4gICAgICAgICAgICAvLyBtYXRjaGluZyBhZ2FpbnN0IHJlZ2V4cCBpcyBleHBlbnNpdmUsIGRvIGl0IG9uIGRlbWFuZFxuICAgICAgICAgICAgbWF0Y2ggPSBudWxsLFxuICAgICAgICAgICAgc2lnbixcbiAgICAgICAgICAgIHJldCxcbiAgICAgICAgICAgIHBhcnNlSXNvO1xuXG4gICAgICAgIGlmIChtb21lbnQuaXNEdXJhdGlvbihpbnB1dCkpIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIG1zOiBpbnB1dC5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgICAgIGQ6IGlucHV0Ll9kYXlzLFxuICAgICAgICAgICAgICAgIE06IGlucHV0Ll9tb250aHNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbltrZXldID0gaW5wdXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uLm1pbGxpc2Vjb25kcyA9IGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCEhKG1hdGNoID0gYXNwTmV0VGltZVNwYW5Kc29uUmVnZXguZXhlYyhpbnB1dCkpKSB7XG4gICAgICAgICAgICBzaWduID0gKG1hdGNoWzFdID09PSBcIi1cIikgPyAtMSA6IDE7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgICAgIGQ6IHRvSW50KG1hdGNoW0RBVEVdKSAqIHNpZ24sXG4gICAgICAgICAgICAgICAgaDogdG9JbnQobWF0Y2hbSE9VUl0pICogc2lnbixcbiAgICAgICAgICAgICAgICBtOiB0b0ludChtYXRjaFtNSU5VVEVdKSAqIHNpZ24sXG4gICAgICAgICAgICAgICAgczogdG9JbnQobWF0Y2hbU0VDT05EXSkgKiBzaWduLFxuICAgICAgICAgICAgICAgIG1zOiB0b0ludChtYXRjaFtNSUxMSVNFQ09ORF0pICogc2lnblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICghIShtYXRjaCA9IGlzb0R1cmF0aW9uUmVnZXguZXhlYyhpbnB1dCkpKSB7XG4gICAgICAgICAgICBzaWduID0gKG1hdGNoWzFdID09PSBcIi1cIikgPyAtMSA6IDE7XG4gICAgICAgICAgICBwYXJzZUlzbyA9IGZ1bmN0aW9uIChpbnApIHtcbiAgICAgICAgICAgICAgICAvLyBXZSdkIG5vcm1hbGx5IHVzZSB+fmlucCBmb3IgdGhpcywgYnV0IHVuZm9ydHVuYXRlbHkgaXQgYWxzb1xuICAgICAgICAgICAgICAgIC8vIGNvbnZlcnRzIGZsb2F0cyB0byBpbnRzLlxuICAgICAgICAgICAgICAgIC8vIGlucCBtYXkgYmUgdW5kZWZpbmVkLCBzbyBjYXJlZnVsIGNhbGxpbmcgcmVwbGFjZSBvbiBpdC5cbiAgICAgICAgICAgICAgICB2YXIgcmVzID0gaW5wICYmIHBhcnNlRmxvYXQoaW5wLnJlcGxhY2UoJywnLCAnLicpKTtcbiAgICAgICAgICAgICAgICAvLyBhcHBseSBzaWduIHdoaWxlIHdlJ3JlIGF0IGl0XG4gICAgICAgICAgICAgICAgcmV0dXJuIChpc05hTihyZXMpID8gMCA6IHJlcykgKiBzaWduO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIHk6IHBhcnNlSXNvKG1hdGNoWzJdKSxcbiAgICAgICAgICAgICAgICBNOiBwYXJzZUlzbyhtYXRjaFszXSksXG4gICAgICAgICAgICAgICAgZDogcGFyc2VJc28obWF0Y2hbNF0pLFxuICAgICAgICAgICAgICAgIGg6IHBhcnNlSXNvKG1hdGNoWzVdKSxcbiAgICAgICAgICAgICAgICBtOiBwYXJzZUlzbyhtYXRjaFs2XSksXG4gICAgICAgICAgICAgICAgczogcGFyc2VJc28obWF0Y2hbN10pLFxuICAgICAgICAgICAgICAgIHc6IHBhcnNlSXNvKG1hdGNoWzhdKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldCA9IG5ldyBEdXJhdGlvbihkdXJhdGlvbik7XG5cbiAgICAgICAgaWYgKG1vbWVudC5pc0R1cmF0aW9uKGlucHV0KSAmJiBpbnB1dC5oYXNPd25Qcm9wZXJ0eSgnX2xhbmcnKSkge1xuICAgICAgICAgICAgcmV0Ll9sYW5nID0gaW5wdXQuX2xhbmc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG5cbiAgICAvLyB2ZXJzaW9uIG51bWJlclxuICAgIG1vbWVudC52ZXJzaW9uID0gVkVSU0lPTjtcblxuICAgIC8vIGRlZmF1bHQgZm9ybWF0XG4gICAgbW9tZW50LmRlZmF1bHRGb3JtYXQgPSBpc29Gb3JtYXQ7XG5cbiAgICAvLyBjb25zdGFudCB0aGF0IHJlZmVycyB0byB0aGUgSVNPIHN0YW5kYXJkXG4gICAgbW9tZW50LklTT184NjAxID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAvLyBQbHVnaW5zIHRoYXQgYWRkIHByb3BlcnRpZXMgc2hvdWxkIGFsc28gYWRkIHRoZSBrZXkgaGVyZSAobnVsbCB2YWx1ZSksXG4gICAgLy8gc28gd2UgY2FuIHByb3Blcmx5IGNsb25lIG91cnNlbHZlcy5cbiAgICBtb21lbnQubW9tZW50UHJvcGVydGllcyA9IG1vbWVudFByb3BlcnRpZXM7XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyIGEgbW9tZW50IGlzIG11dGF0ZWQuXG4gICAgLy8gSXQgaXMgaW50ZW5kZWQgdG8ga2VlcCB0aGUgb2Zmc2V0IGluIHN5bmMgd2l0aCB0aGUgdGltZXpvbmUuXG4gICAgbW9tZW50LnVwZGF0ZU9mZnNldCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgeW91IHRvIHNldCBhIHRocmVzaG9sZCBmb3IgcmVsYXRpdmUgdGltZSBzdHJpbmdzXG4gICAgbW9tZW50LnJlbGF0aXZlVGltZVRocmVzaG9sZCA9IGZ1bmN0aW9uKHRocmVzaG9sZCwgbGltaXQpIHtcbiAgICAgIGlmIChyZWxhdGl2ZVRpbWVUaHJlc2hvbGRzW3RocmVzaG9sZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzW3RocmVzaG9sZF0gPSBsaW1pdDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgbG9hZCBsYW5ndWFnZXMgYW5kIHRoZW4gc2V0IHRoZSBnbG9iYWwgbGFuZ3VhZ2UuICBJZlxuICAgIC8vIG5vIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGluLCBpdCB3aWxsIHNpbXBseSByZXR1cm4gdGhlIGN1cnJlbnQgZ2xvYmFsXG4gICAgLy8gbGFuZ3VhZ2Uga2V5LlxuICAgIG1vbWVudC5sYW5nID0gZnVuY3Rpb24gKGtleSwgdmFsdWVzKSB7XG4gICAgICAgIHZhciByO1xuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudC5mbi5fbGFuZy5fYWJicjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgICAgICBsb2FkTGFuZyhub3JtYWxpemVMYW5ndWFnZShrZXkpLCB2YWx1ZXMpO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdW5sb2FkTGFuZyhrZXkpO1xuICAgICAgICAgICAga2V5ID0gJ2VuJztcbiAgICAgICAgfSBlbHNlIGlmICghbGFuZ3VhZ2VzW2tleV0pIHtcbiAgICAgICAgICAgIGdldExhbmdEZWZpbml0aW9uKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgciA9IG1vbWVudC5kdXJhdGlvbi5mbi5fbGFuZyA9IG1vbWVudC5mbi5fbGFuZyA9IGdldExhbmdEZWZpbml0aW9uKGtleSk7XG4gICAgICAgIHJldHVybiByLl9hYmJyO1xuICAgIH07XG5cbiAgICAvLyByZXR1cm5zIGxhbmd1YWdlIGRhdGFcbiAgICBtb21lbnQubGFuZ0RhdGEgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmIChrZXkgJiYga2V5Ll9sYW5nICYmIGtleS5fbGFuZy5fYWJicikge1xuICAgICAgICAgICAga2V5ID0ga2V5Ll9sYW5nLl9hYmJyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnZXRMYW5nRGVmaW5pdGlvbihrZXkpO1xuICAgIH07XG5cbiAgICAvLyBjb21wYXJlIG1vbWVudCBvYmplY3RcbiAgICBtb21lbnQuaXNNb21lbnQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBNb21lbnQgfHxcbiAgICAgICAgICAgIChvYmogIT0gbnVsbCAmJiAgb2JqLmhhc093blByb3BlcnR5KCdfaXNBTW9tZW50T2JqZWN0JykpO1xuICAgIH07XG5cbiAgICAvLyBmb3IgdHlwZWNoZWNraW5nIER1cmF0aW9uIG9iamVjdHNcbiAgICBtb21lbnQuaXNEdXJhdGlvbiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIER1cmF0aW9uO1xuICAgIH07XG5cbiAgICBmb3IgKGkgPSBsaXN0cy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICBtYWtlTGlzdChsaXN0c1tpXSk7XG4gICAgfVxuXG4gICAgbW9tZW50Lm5vcm1hbGl6ZVVuaXRzID0gZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgICAgIHJldHVybiBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgfTtcblxuICAgIG1vbWVudC5pbnZhbGlkID0gZnVuY3Rpb24gKGZsYWdzKSB7XG4gICAgICAgIHZhciBtID0gbW9tZW50LnV0YyhOYU4pO1xuICAgICAgICBpZiAoZmxhZ3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgZXh0ZW5kKG0uX3BmLCBmbGFncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtLl9wZi51c2VySW52YWxpZGF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfTtcblxuICAgIG1vbWVudC5wYXJzZVpvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBtb21lbnQuYXBwbHkobnVsbCwgYXJndW1lbnRzKS5wYXJzZVpvbmUoKTtcbiAgICB9O1xuXG4gICAgbW9tZW50LnBhcnNlVHdvRGlnaXRZZWFyID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0b0ludChpbnB1dCkgKyAodG9JbnQoaW5wdXQpID4gNjggPyAxOTAwIDogMjAwMCk7XG4gICAgfTtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgTW9tZW50IFByb3RvdHlwZVxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgZXh0ZW5kKG1vbWVudC5mbiA9IE1vbWVudC5wcm90b3R5cGUsIHtcblxuICAgICAgICBjbG9uZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBtb21lbnQodGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdmFsdWVPZiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiArdGhpcy5fZCArICgodGhpcy5fb2Zmc2V0IHx8IDApICogNjAwMDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVuaXggOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigrdGhpcyAvIDEwMDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvU3RyaW5nIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sYW5nKCdlbicpLmZvcm1hdChcImRkZCBNTU0gREQgWVlZWSBISDptbTpzcyBbR01UXVpaXCIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvRGF0ZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXQgPyBuZXcgRGF0ZSgrdGhpcykgOiB0aGlzLl9kO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvSVNPU3RyaW5nIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG0gPSBtb21lbnQodGhpcykudXRjKCk7XG4gICAgICAgICAgICBpZiAoMCA8IG0ueWVhcigpICYmIG0ueWVhcigpIDw9IDk5OTkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0TW9tZW50KG0sICdZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRNb21lbnQobSwgJ1lZWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1taXScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHRvQXJyYXkgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbSA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIG0ueWVhcigpLFxuICAgICAgICAgICAgICAgIG0ubW9udGgoKSxcbiAgICAgICAgICAgICAgICBtLmRhdGUoKSxcbiAgICAgICAgICAgICAgICBtLmhvdXJzKCksXG4gICAgICAgICAgICAgICAgbS5taW51dGVzKCksXG4gICAgICAgICAgICAgICAgbS5zZWNvbmRzKCksXG4gICAgICAgICAgICAgICAgbS5taWxsaXNlY29uZHMoKVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1ZhbGlkIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQodGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNEU1RTaGlmdGVkIDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fYSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSAmJiBjb21wYXJlQXJyYXlzKHRoaXMuX2EsICh0aGlzLl9pc1VUQyA/IG1vbWVudC51dGModGhpcy5fYSkgOiBtb21lbnQodGhpcy5fYSkpLnRvQXJyYXkoKSkgPiAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2luZ0ZsYWdzIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGV4dGVuZCh7fSwgdGhpcy5fcGYpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGludmFsaWRBdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BmLm92ZXJmbG93O1xuICAgICAgICB9LFxuXG4gICAgICAgIHV0YyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnpvbmUoMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9jYWwgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnpvbmUoMCk7XG4gICAgICAgICAgICB0aGlzLl9pc1VUQyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZm9ybWF0IDogZnVuY3Rpb24gKGlucHV0U3RyaW5nKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gZm9ybWF0TW9tZW50KHRoaXMsIGlucHV0U3RyaW5nIHx8IG1vbWVudC5kZWZhdWx0Rm9ybWF0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcoKS5wb3N0Zm9ybWF0KG91dHB1dCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkIDogZnVuY3Rpb24gKGlucHV0LCB2YWwpIHtcbiAgICAgICAgICAgIHZhciBkdXI7XG4gICAgICAgICAgICAvLyBzd2l0Y2ggYXJncyB0byBzdXBwb3J0IGFkZCgncycsIDEpIGFuZCBhZGQoMSwgJ3MnKVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBkdXIgPSBtb21lbnQuZHVyYXRpb24oaXNOYU4oK3ZhbCkgPyAraW5wdXQgOiArdmFsLCBpc05hTigrdmFsKSA/IHZhbCA6IGlucHV0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGR1ciA9IG1vbWVudC5kdXJhdGlvbigrdmFsLCBpbnB1dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGR1ciA9IG1vbWVudC5kdXJhdGlvbihpbnB1dCwgdmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZE9yU3VidHJhY3REdXJhdGlvbkZyb21Nb21lbnQodGhpcywgZHVyLCAxKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN1YnRyYWN0IDogZnVuY3Rpb24gKGlucHV0LCB2YWwpIHtcbiAgICAgICAgICAgIHZhciBkdXI7XG4gICAgICAgICAgICAvLyBzd2l0Y2ggYXJncyB0byBzdXBwb3J0IHN1YnRyYWN0KCdzJywgMSkgYW5kIHN1YnRyYWN0KDEsICdzJylcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnICYmIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgZHVyID0gbW9tZW50LmR1cmF0aW9uKGlzTmFOKCt2YWwpID8gK2lucHV0IDogK3ZhbCwgaXNOYU4oK3ZhbCkgPyB2YWwgOiBpbnB1dCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBkdXIgPSBtb21lbnQuZHVyYXRpb24oK3ZhbCwgaW5wdXQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkdXIgPSBtb21lbnQuZHVyYXRpb24oaW5wdXQsIHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGRPclN1YnRyYWN0RHVyYXRpb25Gcm9tTW9tZW50KHRoaXMsIGR1ciwgLTEpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGlmZiA6IGZ1bmN0aW9uIChpbnB1dCwgdW5pdHMsIGFzRmxvYXQpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gbWFrZUFzKGlucHV0LCB0aGlzKSxcbiAgICAgICAgICAgICAgICB6b25lRGlmZiA9ICh0aGlzLnpvbmUoKSAtIHRoYXQuem9uZSgpKSAqIDZlNCxcbiAgICAgICAgICAgICAgICBkaWZmLCBvdXRwdXQ7XG5cbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuXG4gICAgICAgICAgICBpZiAodW5pdHMgPT09ICd5ZWFyJyB8fCB1bml0cyA9PT0gJ21vbnRoJykge1xuICAgICAgICAgICAgICAgIC8vIGF2ZXJhZ2UgbnVtYmVyIG9mIGRheXMgaW4gdGhlIG1vbnRocyBpbiB0aGUgZ2l2ZW4gZGF0ZXNcbiAgICAgICAgICAgICAgICBkaWZmID0gKHRoaXMuZGF5c0luTW9udGgoKSArIHRoYXQuZGF5c0luTW9udGgoKSkgKiA0MzJlNTsgLy8gMjQgKiA2MCAqIDYwICogMTAwMCAvIDJcbiAgICAgICAgICAgICAgICAvLyBkaWZmZXJlbmNlIGluIG1vbnRoc1xuICAgICAgICAgICAgICAgIG91dHB1dCA9ICgodGhpcy55ZWFyKCkgLSB0aGF0LnllYXIoKSkgKiAxMikgKyAodGhpcy5tb250aCgpIC0gdGhhdC5tb250aCgpKTtcbiAgICAgICAgICAgICAgICAvLyBhZGp1c3QgYnkgdGFraW5nIGRpZmZlcmVuY2UgaW4gZGF5cywgYXZlcmFnZSBudW1iZXIgb2YgZGF5c1xuICAgICAgICAgICAgICAgIC8vIGFuZCBkc3QgaW4gdGhlIGdpdmVuIG1vbnRocy5cbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gKCh0aGlzIC0gbW9tZW50KHRoaXMpLnN0YXJ0T2YoJ21vbnRoJykpIC1cbiAgICAgICAgICAgICAgICAgICAgICAgICh0aGF0IC0gbW9tZW50KHRoYXQpLnN0YXJ0T2YoJ21vbnRoJykpKSAvIGRpZmY7XG4gICAgICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2l0aCB6b25lcywgdG8gbmVnYXRlIGFsbCBkc3RcbiAgICAgICAgICAgICAgICBvdXRwdXQgLT0gKCh0aGlzLnpvbmUoKSAtIG1vbWVudCh0aGlzKS5zdGFydE9mKCdtb250aCcpLnpvbmUoKSkgLVxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoYXQuem9uZSgpIC0gbW9tZW50KHRoYXQpLnN0YXJ0T2YoJ21vbnRoJykuem9uZSgpKSkgKiA2ZTQgLyBkaWZmO1xuICAgICAgICAgICAgICAgIGlmICh1bml0cyA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dCAvIDEyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGlmZiA9ICh0aGlzIC0gdGhhdCk7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gdW5pdHMgPT09ICdzZWNvbmQnID8gZGlmZiAvIDFlMyA6IC8vIDEwMDBcbiAgICAgICAgICAgICAgICAgICAgdW5pdHMgPT09ICdtaW51dGUnID8gZGlmZiAvIDZlNCA6IC8vIDEwMDAgKiA2MFxuICAgICAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ2hvdXInID8gZGlmZiAvIDM2ZTUgOiAvLyAxMDAwICogNjAgKiA2MFxuICAgICAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ2RheScgPyAoZGlmZiAtIHpvbmVEaWZmKSAvIDg2NGU1IDogLy8gMTAwMCAqIDYwICogNjAgKiAyNCwgbmVnYXRlIGRzdFxuICAgICAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ3dlZWsnID8gKGRpZmYgLSB6b25lRGlmZikgLyA2MDQ4ZTUgOiAvLyAxMDAwICogNjAgKiA2MCAqIDI0ICogNywgbmVnYXRlIGRzdFxuICAgICAgICAgICAgICAgICAgICBkaWZmO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFzRmxvYXQgPyBvdXRwdXQgOiBhYnNSb3VuZChvdXRwdXQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZyb20gOiBmdW5jdGlvbiAodGltZSwgd2l0aG91dFN1ZmZpeCkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudC5kdXJhdGlvbih0aGlzLmRpZmYodGltZSkpLmxhbmcodGhpcy5sYW5nKCkuX2FiYnIpLmh1bWFuaXplKCF3aXRob3V0U3VmZml4KTtcbiAgICAgICAgfSxcblxuICAgICAgICBmcm9tTm93IDogZnVuY3Rpb24gKHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZyb20obW9tZW50KCksIHdpdGhvdXRTdWZmaXgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNhbGVuZGFyIDogZnVuY3Rpb24gKHRpbWUpIHtcbiAgICAgICAgICAgIC8vIFdlIHdhbnQgdG8gY29tcGFyZSB0aGUgc3RhcnQgb2YgdG9kYXksIHZzIHRoaXMuXG4gICAgICAgICAgICAvLyBHZXR0aW5nIHN0YXJ0LW9mLXRvZGF5IGRlcGVuZHMgb24gd2hldGhlciB3ZSdyZSB6b25lJ2Qgb3Igbm90LlxuICAgICAgICAgICAgdmFyIG5vdyA9IHRpbWUgfHwgbW9tZW50KCksXG4gICAgICAgICAgICAgICAgc29kID0gbWFrZUFzKG5vdywgdGhpcykuc3RhcnRPZignZGF5JyksXG4gICAgICAgICAgICAgICAgZGlmZiA9IHRoaXMuZGlmZihzb2QsICdkYXlzJywgdHJ1ZSksXG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZGlmZiA8IC02ID8gJ3NhbWVFbHNlJyA6XG4gICAgICAgICAgICAgICAgICAgIGRpZmYgPCAtMSA/ICdsYXN0V2VlaycgOlxuICAgICAgICAgICAgICAgICAgICBkaWZmIDwgMCA/ICdsYXN0RGF5JyA6XG4gICAgICAgICAgICAgICAgICAgIGRpZmYgPCAxID8gJ3NhbWVEYXknIDpcbiAgICAgICAgICAgICAgICAgICAgZGlmZiA8IDIgPyAnbmV4dERheScgOlxuICAgICAgICAgICAgICAgICAgICBkaWZmIDwgNyA/ICduZXh0V2VlaycgOiAnc2FtZUVsc2UnO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0KHRoaXMubGFuZygpLmNhbGVuZGFyKGZvcm1hdCwgdGhpcykpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzTGVhcFllYXIgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNMZWFwWWVhcih0aGlzLnllYXIoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNEU1QgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuem9uZSgpIDwgdGhpcy5jbG9uZSgpLm1vbnRoKDApLnpvbmUoKSB8fFxuICAgICAgICAgICAgICAgIHRoaXMuem9uZSgpIDwgdGhpcy5jbG9uZSgpLm1vbnRoKDUpLnpvbmUoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGF5IDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgZGF5ID0gdGhpcy5faXNVVEMgPyB0aGlzLl9kLmdldFVUQ0RheSgpIDogdGhpcy5fZC5nZXREYXkoKTtcbiAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBwYXJzZVdlZWtkYXkoaW5wdXQsIHRoaXMubGFuZygpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hZGQoeyBkIDogaW5wdXQgLSBkYXkgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbW9udGggOiBtYWtlQWNjZXNzb3IoJ01vbnRoJywgdHJ1ZSksXG5cbiAgICAgICAgc3RhcnRPZjogZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIC8vIHRoZSBmb2xsb3dpbmcgc3dpdGNoIGludGVudGlvbmFsbHkgb21pdHMgYnJlYWsga2V5d29yZHNcbiAgICAgICAgICAgIC8vIHRvIHV0aWxpemUgZmFsbGluZyB0aHJvdWdoIHRoZSBjYXNlcy5cbiAgICAgICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgICAgIGNhc2UgJ3llYXInOlxuICAgICAgICAgICAgICAgIHRoaXMubW9udGgoMCk7XG4gICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgY2FzZSAncXVhcnRlcic6XG4gICAgICAgICAgICBjYXNlICdtb250aCc6XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlKDEpO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ3dlZWsnOlxuICAgICAgICAgICAgY2FzZSAnaXNvV2Vlayc6XG4gICAgICAgICAgICBjYXNlICdkYXknOlxuICAgICAgICAgICAgICAgIHRoaXMuaG91cnMoMCk7XG4gICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgY2FzZSAnaG91cic6XG4gICAgICAgICAgICAgICAgdGhpcy5taW51dGVzKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ21pbnV0ZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRzKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5taWxsaXNlY29uZHMoMCk7XG4gICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB3ZWVrcyBhcmUgYSBzcGVjaWFsIGNhc2VcbiAgICAgICAgICAgIGlmICh1bml0cyA9PT0gJ3dlZWsnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53ZWVrZGF5KDApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh1bml0cyA9PT0gJ2lzb1dlZWsnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc29XZWVrZGF5KDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBxdWFydGVycyBhcmUgYWxzbyBzcGVjaWFsXG4gICAgICAgICAgICBpZiAodW5pdHMgPT09ICdxdWFydGVyJykge1xuICAgICAgICAgICAgICAgIHRoaXMubW9udGgoTWF0aC5mbG9vcih0aGlzLm1vbnRoKCkgLyAzKSAqIDMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBlbmRPZjogZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXJ0T2YodW5pdHMpLmFkZCgodW5pdHMgPT09ICdpc29XZWVrJyA/ICd3ZWVrJyA6IHVuaXRzKSwgMSkuc3VidHJhY3QoJ21zJywgMSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNBZnRlcjogZnVuY3Rpb24gKGlucHV0LCB1bml0cykge1xuICAgICAgICAgICAgdW5pdHMgPSB0eXBlb2YgdW5pdHMgIT09ICd1bmRlZmluZWQnID8gdW5pdHMgOiAnbWlsbGlzZWNvbmQnO1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzLmNsb25lKCkuc3RhcnRPZih1bml0cykgPiArbW9tZW50KGlucHV0KS5zdGFydE9mKHVuaXRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0JlZm9yZTogZnVuY3Rpb24gKGlucHV0LCB1bml0cykge1xuICAgICAgICAgICAgdW5pdHMgPSB0eXBlb2YgdW5pdHMgIT09ICd1bmRlZmluZWQnID8gdW5pdHMgOiAnbWlsbGlzZWNvbmQnO1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzLmNsb25lKCkuc3RhcnRPZih1bml0cykgPCArbW9tZW50KGlucHV0KS5zdGFydE9mKHVuaXRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1NhbWU6IGZ1bmN0aW9uIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgICAgIHVuaXRzID0gdW5pdHMgfHwgJ21zJztcbiAgICAgICAgICAgIHJldHVybiArdGhpcy5jbG9uZSgpLnN0YXJ0T2YodW5pdHMpID09PSArbWFrZUFzKGlucHV0LCB0aGlzKS5zdGFydE9mKHVuaXRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBtaW46IGRlcHJlY2F0ZShcbiAgICAgICAgICAgICAgICAgXCJtb21lbnQoKS5taW4gaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudC5taW4gaW5zdGVhZC4gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE1NDhcIixcbiAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKG90aGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICBvdGhlciA9IG1vbWVudC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG90aGVyIDwgdGhpcyA/IHRoaXMgOiBvdGhlcjtcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgKSxcblxuICAgICAgICBtYXg6IGRlcHJlY2F0ZShcbiAgICAgICAgICAgICAgICBcIm1vbWVudCgpLm1heCBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50Lm1heCBpbnN0ZWFkLiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTU0OFwiLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChvdGhlcikge1xuICAgICAgICAgICAgICAgICAgICBvdGhlciA9IG1vbWVudC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3RoZXIgPiB0aGlzID8gdGhpcyA6IG90aGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgKSxcblxuICAgICAgICAvLyBrZWVwVGltZSA9IHRydWUgbWVhbnMgb25seSBjaGFuZ2UgdGhlIHRpbWV6b25lLCB3aXRob3V0IGFmZmVjdGluZ1xuICAgICAgICAvLyB0aGUgbG9jYWwgaG91ci4gU28gNTozMToyNiArMDMwMCAtLVt6b25lKDIsIHRydWUpXS0tPiA1OjMxOjI2ICswMjAwXG4gICAgICAgIC8vIEl0IGlzIHBvc3NpYmxlIHRoYXQgNTozMToyNiBkb2Vzbid0IGV4aXN0IGludCB6b25lICswMjAwLCBzbyB3ZVxuICAgICAgICAvLyBhZGp1c3QgdGhlIHRpbWUgYXMgbmVlZGVkLCB0byBiZSB2YWxpZC5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gS2VlcGluZyB0aGUgdGltZSBhY3R1YWxseSBhZGRzL3N1YnRyYWN0cyAob25lIGhvdXIpXG4gICAgICAgIC8vIGZyb20gdGhlIGFjdHVhbCByZXByZXNlbnRlZCB0aW1lLiBUaGF0IGlzIHdoeSB3ZSBjYWxsIHVwZGF0ZU9mZnNldFxuICAgICAgICAvLyBhIHNlY29uZCB0aW1lLiBJbiBjYXNlIGl0IHdhbnRzIHVzIHRvIGNoYW5nZSB0aGUgb2Zmc2V0IGFnYWluXG4gICAgICAgIC8vIF9jaGFuZ2VJblByb2dyZXNzID09IHRydWUgY2FzZSwgdGhlbiB3ZSBoYXZlIHRvIGFkanVzdCwgYmVjYXVzZVxuICAgICAgICAvLyB0aGVyZSBpcyBubyBzdWNoIHRpbWUgaW4gdGhlIGdpdmVuIHRpbWV6b25lLlxuICAgICAgICB6b25lIDogZnVuY3Rpb24gKGlucHV0LCBrZWVwVGltZSkge1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuX29mZnNldCB8fCAwO1xuICAgICAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0ID0gdGltZXpvbmVNaW51dGVzRnJvbVN0cmluZyhpbnB1dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhpbnB1dCkgPCAxNikge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0ICogNjA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX29mZnNldCA9IGlucHV0O1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzVVRDID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAob2Zmc2V0ICE9PSBpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWtlZXBUaW1lIHx8IHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZE9yU3VidHJhY3REdXJhdGlvbkZyb21Nb21lbnQodGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9tZW50LmR1cmF0aW9uKG9mZnNldCAtIGlucHV0LCAnbScpLCAxLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9tZW50LnVwZGF0ZU9mZnNldCh0aGlzLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyBvZmZzZXQgOiB0aGlzLl9kLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICB6b25lQWJiciA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/IFwiVVRDXCIgOiBcIlwiO1xuICAgICAgICB9LFxuXG4gICAgICAgIHpvbmVOYW1lIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gXCJDb29yZGluYXRlZCBVbml2ZXJzYWwgVGltZVwiIDogXCJcIjtcbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZVpvbmUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fdHptKSB7XG4gICAgICAgICAgICAgICAgdGhpcy56b25lKHRoaXMuX3R6bSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLl9pID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHRoaXMuem9uZSh0aGlzLl9pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhhc0FsaWduZWRIb3VyT2Zmc2V0IDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBtb21lbnQoaW5wdXQpLnpvbmUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnpvbmUoKSAtIGlucHV0KSAlIDYwID09PSAwO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRheXNJbk1vbnRoIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGRheXNJbk1vbnRoKHRoaXMueWVhcigpLCB0aGlzLm1vbnRoKCkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRheU9mWWVhciA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICAgICAgdmFyIGRheU9mWWVhciA9IHJvdW5kKChtb21lbnQodGhpcykuc3RhcnRPZignZGF5JykgLSBtb21lbnQodGhpcykuc3RhcnRPZigneWVhcicpKSAvIDg2NGU1KSArIDE7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IGRheU9mWWVhciA6IHRoaXMuYWRkKFwiZFwiLCAoaW5wdXQgLSBkYXlPZlllYXIpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBxdWFydGVyIDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IE1hdGguY2VpbCgodGhpcy5tb250aCgpICsgMSkgLyAzKSA6IHRoaXMubW9udGgoKGlucHV0IC0gMSkgKiAzICsgdGhpcy5tb250aCgpICUgMyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2Vla1llYXIgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB5ZWFyID0gd2Vla09mWWVhcih0aGlzLCB0aGlzLmxhbmcoKS5fd2Vlay5kb3csIHRoaXMubGFuZygpLl93ZWVrLmRveSkueWVhcjtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8geWVhciA6IHRoaXMuYWRkKFwieVwiLCAoaW5wdXQgLSB5ZWFyKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNvV2Vla1llYXIgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB5ZWFyID0gd2Vla09mWWVhcih0aGlzLCAxLCA0KS55ZWFyO1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB5ZWFyIDogdGhpcy5hZGQoXCJ5XCIsIChpbnB1dCAtIHllYXIpKTtcbiAgICAgICAgfSxcblxuICAgICAgICB3ZWVrIDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgd2VlayA9IHRoaXMubGFuZygpLndlZWsodGhpcyk7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWsgOiB0aGlzLmFkZChcImRcIiwgKGlucHV0IC0gd2VlaykgKiA3KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc29XZWVrIDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgd2VlayA9IHdlZWtPZlllYXIodGhpcywgMSwgNCkud2VlaztcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2VlayA6IHRoaXMuYWRkKFwiZFwiLCAoaW5wdXQgLSB3ZWVrKSAqIDcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdlZWtkYXkgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB3ZWVrZGF5ID0gKHRoaXMuZGF5KCkgKyA3IC0gdGhpcy5sYW5nKCkuX3dlZWsuZG93KSAlIDc7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWtkYXkgOiB0aGlzLmFkZChcImRcIiwgaW5wdXQgLSB3ZWVrZGF5KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc29XZWVrZGF5IDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICAvLyBiZWhhdmVzIHRoZSBzYW1lIGFzIG1vbWVudCNkYXkgZXhjZXB0XG4gICAgICAgICAgICAvLyBhcyBhIGdldHRlciwgcmV0dXJucyA3IGluc3RlYWQgb2YgMCAoMS03IHJhbmdlIGluc3RlYWQgb2YgMC02KVxuICAgICAgICAgICAgLy8gYXMgYSBzZXR0ZXIsIHN1bmRheSBzaG91bGQgYmVsb25nIHRvIHRoZSBwcmV2aW91cyB3ZWVrLlxuICAgICAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB0aGlzLmRheSgpIHx8IDcgOiB0aGlzLmRheSh0aGlzLmRheSgpICUgNyA/IGlucHV0IDogaW5wdXQgLSA3KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc29XZWVrc0luWWVhciA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB3ZWVrc0luWWVhcih0aGlzLnllYXIoKSwgMSwgNCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2Vla3NJblllYXIgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgd2Vla0luZm8gPSB0aGlzLl9sYW5nLl93ZWVrO1xuICAgICAgICAgICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMueWVhcigpLCB3ZWVrSW5mby5kb3csIHdlZWtJbmZvLmRveSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0IDogZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW3VuaXRzXSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldCA6IGZ1bmN0aW9uICh1bml0cywgdmFsdWUpIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzW3VuaXRzXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRoaXNbdW5pdHNdKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIElmIHBhc3NlZCBhIGxhbmd1YWdlIGtleSwgaXQgd2lsbCBzZXQgdGhlIGxhbmd1YWdlIGZvciB0aGlzXG4gICAgICAgIC8vIGluc3RhbmNlLiAgT3RoZXJ3aXNlLCBpdCB3aWxsIHJldHVybiB0aGUgbGFuZ3VhZ2UgY29uZmlndXJhdGlvblxuICAgICAgICAvLyB2YXJpYWJsZXMgZm9yIHRoaXMgaW5zdGFuY2UuXG4gICAgICAgIGxhbmcgOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbGFuZztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGFuZyA9IGdldExhbmdEZWZpbml0aW9uKGtleSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHJhd01vbnRoU2V0dGVyKG1vbSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIGRheU9mTW9udGg7XG5cbiAgICAgICAgLy8gVE9ETzogTW92ZSB0aGlzIG91dCBvZiBoZXJlIVxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFsdWUgPSBtb20ubGFuZygpLm1vbnRoc1BhcnNlKHZhbHVlKTtcbiAgICAgICAgICAgIC8vIFRPRE86IEFub3RoZXIgc2lsZW50IGZhaWx1cmU/XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb207XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkYXlPZk1vbnRoID0gTWF0aC5taW4obW9tLmRhdGUoKSxcbiAgICAgICAgICAgICAgICBkYXlzSW5Nb250aChtb20ueWVhcigpLCB2YWx1ZSkpO1xuICAgICAgICBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgJ01vbnRoJ10odmFsdWUsIGRheU9mTW9udGgpO1xuICAgICAgICByZXR1cm4gbW9tO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJhd0dldHRlcihtb20sIHVuaXQpIHtcbiAgICAgICAgcmV0dXJuIG1vbS5fZFsnZ2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJhd1NldHRlcihtb20sIHVuaXQsIHZhbHVlKSB7XG4gICAgICAgIGlmICh1bml0ID09PSAnTW9udGgnKSB7XG4gICAgICAgICAgICByZXR1cm4gcmF3TW9udGhTZXR0ZXIobW9tLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tLl9kWydzZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArIHVuaXRdKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VBY2Nlc3Nvcih1bml0LCBrZWVwVGltZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJhd1NldHRlcih0aGlzLCB1bml0LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgbW9tZW50LnVwZGF0ZU9mZnNldCh0aGlzLCBrZWVwVGltZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiByYXdHZXR0ZXIodGhpcywgdW5pdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgbW9tZW50LmZuLm1pbGxpc2Vjb25kID0gbW9tZW50LmZuLm1pbGxpc2Vjb25kcyA9IG1ha2VBY2Nlc3NvcignTWlsbGlzZWNvbmRzJywgZmFsc2UpO1xuICAgIG1vbWVudC5mbi5zZWNvbmQgPSBtb21lbnQuZm4uc2Vjb25kcyA9IG1ha2VBY2Nlc3NvcignU2Vjb25kcycsIGZhbHNlKTtcbiAgICBtb21lbnQuZm4ubWludXRlID0gbW9tZW50LmZuLm1pbnV0ZXMgPSBtYWtlQWNjZXNzb3IoJ01pbnV0ZXMnLCBmYWxzZSk7XG4gICAgLy8gU2V0dGluZyB0aGUgaG91ciBzaG91bGQga2VlcCB0aGUgdGltZSwgYmVjYXVzZSB0aGUgdXNlciBleHBsaWNpdGx5XG4gICAgLy8gc3BlY2lmaWVkIHdoaWNoIGhvdXIgaGUgd2FudHMuIFNvIHRyeWluZyB0byBtYWludGFpbiB0aGUgc2FtZSBob3VyIChpblxuICAgIC8vIGEgbmV3IHRpbWV6b25lKSBtYWtlcyBzZW5zZS4gQWRkaW5nL3N1YnRyYWN0aW5nIGhvdXJzIGRvZXMgbm90IGZvbGxvd1xuICAgIC8vIHRoaXMgcnVsZS5cbiAgICBtb21lbnQuZm4uaG91ciA9IG1vbWVudC5mbi5ob3VycyA9IG1ha2VBY2Nlc3NvcignSG91cnMnLCB0cnVlKTtcbiAgICAvLyBtb21lbnQuZm4ubW9udGggaXMgZGVmaW5lZCBzZXBhcmF0ZWx5XG4gICAgbW9tZW50LmZuLmRhdGUgPSBtYWtlQWNjZXNzb3IoJ0RhdGUnLCB0cnVlKTtcbiAgICBtb21lbnQuZm4uZGF0ZXMgPSBkZXByZWNhdGUoXCJkYXRlcyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgZGF0ZSBpbnN0ZWFkLlwiLCBtYWtlQWNjZXNzb3IoJ0RhdGUnLCB0cnVlKSk7XG4gICAgbW9tZW50LmZuLnllYXIgPSBtYWtlQWNjZXNzb3IoJ0Z1bGxZZWFyJywgdHJ1ZSk7XG4gICAgbW9tZW50LmZuLnllYXJzID0gZGVwcmVjYXRlKFwieWVhcnMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIHllYXIgaW5zdGVhZC5cIiwgbWFrZUFjY2Vzc29yKCdGdWxsWWVhcicsIHRydWUpKTtcblxuICAgIC8vIGFkZCBwbHVyYWwgbWV0aG9kc1xuICAgIG1vbWVudC5mbi5kYXlzID0gbW9tZW50LmZuLmRheTtcbiAgICBtb21lbnQuZm4ubW9udGhzID0gbW9tZW50LmZuLm1vbnRoO1xuICAgIG1vbWVudC5mbi53ZWVrcyA9IG1vbWVudC5mbi53ZWVrO1xuICAgIG1vbWVudC5mbi5pc29XZWVrcyA9IG1vbWVudC5mbi5pc29XZWVrO1xuICAgIG1vbWVudC5mbi5xdWFydGVycyA9IG1vbWVudC5mbi5xdWFydGVyO1xuXG4gICAgLy8gYWRkIGFsaWFzZWQgZm9ybWF0IG1ldGhvZHNcbiAgICBtb21lbnQuZm4udG9KU09OID0gbW9tZW50LmZuLnRvSVNPU3RyaW5nO1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBEdXJhdGlvbiBQcm90b3R5cGVcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIGV4dGVuZChtb21lbnQuZHVyYXRpb24uZm4gPSBEdXJhdGlvbi5wcm90b3R5cGUsIHtcblxuICAgICAgICBfYnViYmxlIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IHRoaXMuX21pbGxpc2Vjb25kcyxcbiAgICAgICAgICAgICAgICBkYXlzID0gdGhpcy5fZGF5cyxcbiAgICAgICAgICAgICAgICBtb250aHMgPSB0aGlzLl9tb250aHMsXG4gICAgICAgICAgICAgICAgZGF0YSA9IHRoaXMuX2RhdGEsXG4gICAgICAgICAgICAgICAgc2Vjb25kcywgbWludXRlcywgaG91cnMsIHllYXJzO1xuXG4gICAgICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGNvZGUgYnViYmxlcyB1cCB2YWx1ZXMsIHNlZSB0aGUgdGVzdHMgZm9yXG4gICAgICAgICAgICAvLyBleGFtcGxlcyBvZiB3aGF0IHRoYXQgbWVhbnMuXG4gICAgICAgICAgICBkYXRhLm1pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kcyAlIDEwMDA7XG5cbiAgICAgICAgICAgIHNlY29uZHMgPSBhYnNSb3VuZChtaWxsaXNlY29uZHMgLyAxMDAwKTtcbiAgICAgICAgICAgIGRhdGEuc2Vjb25kcyA9IHNlY29uZHMgJSA2MDtcblxuICAgICAgICAgICAgbWludXRlcyA9IGFic1JvdW5kKHNlY29uZHMgLyA2MCk7XG4gICAgICAgICAgICBkYXRhLm1pbnV0ZXMgPSBtaW51dGVzICUgNjA7XG5cbiAgICAgICAgICAgIGhvdXJzID0gYWJzUm91bmQobWludXRlcyAvIDYwKTtcbiAgICAgICAgICAgIGRhdGEuaG91cnMgPSBob3VycyAlIDI0O1xuXG4gICAgICAgICAgICBkYXlzICs9IGFic1JvdW5kKGhvdXJzIC8gMjQpO1xuICAgICAgICAgICAgZGF0YS5kYXlzID0gZGF5cyAlIDMwO1xuXG4gICAgICAgICAgICBtb250aHMgKz0gYWJzUm91bmQoZGF5cyAvIDMwKTtcbiAgICAgICAgICAgIGRhdGEubW9udGhzID0gbW9udGhzICUgMTI7XG5cbiAgICAgICAgICAgIHllYXJzID0gYWJzUm91bmQobW9udGhzIC8gMTIpO1xuICAgICAgICAgICAgZGF0YS55ZWFycyA9IHllYXJzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdlZWtzIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGFic1JvdW5kKHRoaXMuZGF5cygpIC8gNyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdmFsdWVPZiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9taWxsaXNlY29uZHMgK1xuICAgICAgICAgICAgICB0aGlzLl9kYXlzICogODY0ZTUgK1xuICAgICAgICAgICAgICAodGhpcy5fbW9udGhzICUgMTIpICogMjU5MmU2ICtcbiAgICAgICAgICAgICAgdG9JbnQodGhpcy5fbW9udGhzIC8gMTIpICogMzE1MzZlNjtcbiAgICAgICAgfSxcblxuICAgICAgICBodW1hbml6ZSA6IGZ1bmN0aW9uICh3aXRoU3VmZml4KSB7XG4gICAgICAgICAgICB2YXIgZGlmZmVyZW5jZSA9ICt0aGlzLFxuICAgICAgICAgICAgICAgIG91dHB1dCA9IHJlbGF0aXZlVGltZShkaWZmZXJlbmNlLCAhd2l0aFN1ZmZpeCwgdGhpcy5sYW5nKCkpO1xuXG4gICAgICAgICAgICBpZiAod2l0aFN1ZmZpeCkge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IHRoaXMubGFuZygpLnBhc3RGdXR1cmUoZGlmZmVyZW5jZSwgb3V0cHV0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZygpLnBvc3Rmb3JtYXQob3V0cHV0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBhZGQgOiBmdW5jdGlvbiAoaW5wdXQsIHZhbCkge1xuICAgICAgICAgICAgLy8gc3VwcG9ydHMgb25seSAyLjAtc3R5bGUgYWRkKDEsICdzJykgb3IgYWRkKG1vbWVudClcbiAgICAgICAgICAgIHZhciBkdXIgPSBtb21lbnQuZHVyYXRpb24oaW5wdXQsIHZhbCk7XG5cbiAgICAgICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyArPSBkdXIuX21pbGxpc2Vjb25kcztcbiAgICAgICAgICAgIHRoaXMuX2RheXMgKz0gZHVyLl9kYXlzO1xuICAgICAgICAgICAgdGhpcy5fbW9udGhzICs9IGR1ci5fbW9udGhzO1xuXG4gICAgICAgICAgICB0aGlzLl9idWJibGUoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3VidHJhY3QgOiBmdW5jdGlvbiAoaW5wdXQsIHZhbCkge1xuICAgICAgICAgICAgdmFyIGR1ciA9IG1vbWVudC5kdXJhdGlvbihpbnB1dCwgdmFsKTtcblxuICAgICAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzIC09IGR1ci5fbWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgdGhpcy5fZGF5cyAtPSBkdXIuX2RheXM7XG4gICAgICAgICAgICB0aGlzLl9tb250aHMgLT0gZHVyLl9tb250aHM7XG5cbiAgICAgICAgICAgIHRoaXMuX2J1YmJsZSgpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXQgOiBmdW5jdGlvbiAodW5pdHMpIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbdW5pdHMudG9Mb3dlckNhc2UoKSArICdzJ10oKTtcbiAgICAgICAgfSxcblxuICAgICAgICBhcyA6IGZ1bmN0aW9uICh1bml0cykge1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1snYXMnICsgdW5pdHMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB1bml0cy5zbGljZSgxKSArICdzJ10oKTtcbiAgICAgICAgfSxcblxuICAgICAgICBsYW5nIDogbW9tZW50LmZuLmxhbmcsXG5cbiAgICAgICAgdG9Jc29TdHJpbmcgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBpbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vZG9yZGlsbGUvbW9tZW50LWlzb2R1cmF0aW9uL2Jsb2IvbWFzdGVyL21vbWVudC5pc29kdXJhdGlvbi5qc1xuICAgICAgICAgICAgdmFyIHllYXJzID0gTWF0aC5hYnModGhpcy55ZWFycygpKSxcbiAgICAgICAgICAgICAgICBtb250aHMgPSBNYXRoLmFicyh0aGlzLm1vbnRocygpKSxcbiAgICAgICAgICAgICAgICBkYXlzID0gTWF0aC5hYnModGhpcy5kYXlzKCkpLFxuICAgICAgICAgICAgICAgIGhvdXJzID0gTWF0aC5hYnModGhpcy5ob3VycygpKSxcbiAgICAgICAgICAgICAgICBtaW51dGVzID0gTWF0aC5hYnModGhpcy5taW51dGVzKCkpLFxuICAgICAgICAgICAgICAgIHNlY29uZHMgPSBNYXRoLmFicyh0aGlzLnNlY29uZHMoKSArIHRoaXMubWlsbGlzZWNvbmRzKCkgLyAxMDAwKTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmFzU2Vjb25kcygpKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyB0aGUgc2FtZSBhcyBDIydzIChOb2RhKSBhbmQgcHl0aG9uIChpc29kYXRlKS4uLlxuICAgICAgICAgICAgICAgIC8vIGJ1dCBub3Qgb3RoZXIgSlMgKGdvb2cuZGF0ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gJ1AwRCc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAodGhpcy5hc1NlY29uZHMoKSA8IDAgPyAnLScgOiAnJykgK1xuICAgICAgICAgICAgICAgICdQJyArXG4gICAgICAgICAgICAgICAgKHllYXJzID8geWVhcnMgKyAnWScgOiAnJykgK1xuICAgICAgICAgICAgICAgIChtb250aHMgPyBtb250aHMgKyAnTScgOiAnJykgK1xuICAgICAgICAgICAgICAgIChkYXlzID8gZGF5cyArICdEJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgKChob3VycyB8fCBtaW51dGVzIHx8IHNlY29uZHMpID8gJ1QnIDogJycpICtcbiAgICAgICAgICAgICAgICAoaG91cnMgPyBob3VycyArICdIJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgKG1pbnV0ZXMgPyBtaW51dGVzICsgJ00nIDogJycpICtcbiAgICAgICAgICAgICAgICAoc2Vjb25kcyA/IHNlY29uZHMgKyAnUycgOiAnJyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIG1ha2VEdXJhdGlvbkdldHRlcihuYW1lKSB7XG4gICAgICAgIG1vbWVudC5kdXJhdGlvbi5mbltuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhW25hbWVdO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VEdXJhdGlvbkFzR2V0dGVyKG5hbWUsIGZhY3Rvcikge1xuICAgICAgICBtb21lbnQuZHVyYXRpb24uZm5bJ2FzJyArIG5hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzIC8gZmFjdG9yO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZvciAoaSBpbiB1bml0TWlsbGlzZWNvbmRGYWN0b3JzKSB7XG4gICAgICAgIGlmICh1bml0TWlsbGlzZWNvbmRGYWN0b3JzLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICBtYWtlRHVyYXRpb25Bc0dldHRlcihpLCB1bml0TWlsbGlzZWNvbmRGYWN0b3JzW2ldKTtcbiAgICAgICAgICAgIG1ha2VEdXJhdGlvbkdldHRlcihpLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWFrZUR1cmF0aW9uQXNHZXR0ZXIoJ1dlZWtzJywgNjA0OGU1KTtcbiAgICBtb21lbnQuZHVyYXRpb24uZm4uYXNNb250aHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoK3RoaXMgLSB0aGlzLnllYXJzKCkgKiAzMTUzNmU2KSAvIDI1OTJlNiArIHRoaXMueWVhcnMoKSAqIDEyO1xuICAgIH07XG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgRGVmYXVsdCBMYW5nXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICAvLyBTZXQgZGVmYXVsdCBsYW5ndWFnZSwgb3RoZXIgbGFuZ3VhZ2VzIHdpbGwgaW5oZXJpdCBmcm9tIEVuZ2xpc2guXG4gICAgbW9tZW50LmxhbmcoJ2VuJywge1xuICAgICAgICBvcmRpbmFsIDogZnVuY3Rpb24gKG51bWJlcikge1xuICAgICAgICAgICAgdmFyIGIgPSBudW1iZXIgJSAxMCxcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSAodG9JbnQobnVtYmVyICUgMTAwIC8gMTApID09PSAxKSA/ICd0aCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAxKSA/ICdzdCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAyKSA/ICduZCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAzKSA/ICdyZCcgOiAndGgnO1xuICAgICAgICAgICAgcmV0dXJuIG51bWJlciArIG91dHB1dDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyogRU1CRURfTEFOR1VBR0VTICovXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEV4cG9zaW5nIE1vbWVudFxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIGZ1bmN0aW9uIG1ha2VHbG9iYWwoc2hvdWxkRGVwcmVjYXRlKSB7XG4gICAgICAgIC8qZ2xvYmFsIGVuZGVyOmZhbHNlICovXG4gICAgICAgIGlmICh0eXBlb2YgZW5kZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgb2xkR2xvYmFsTW9tZW50ID0gZ2xvYmFsU2NvcGUubW9tZW50O1xuICAgICAgICBpZiAoc2hvdWxkRGVwcmVjYXRlKSB7XG4gICAgICAgICAgICBnbG9iYWxTY29wZS5tb21lbnQgPSBkZXByZWNhdGUoXG4gICAgICAgICAgICAgICAgICAgIFwiQWNjZXNzaW5nIE1vbWVudCB0aHJvdWdoIHRoZSBnbG9iYWwgc2NvcGUgaXMgXCIgK1xuICAgICAgICAgICAgICAgICAgICBcImRlcHJlY2F0ZWQsIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gYW4gdXBjb21pbmcgXCIgK1xuICAgICAgICAgICAgICAgICAgICBcInJlbGVhc2UuXCIsXG4gICAgICAgICAgICAgICAgICAgIG1vbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnbG9iYWxTY29wZS5tb21lbnQgPSBtb21lbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDb21tb25KUyBtb2R1bGUgaXMgZGVmaW5lZFxuICAgIGlmIChoYXNNb2R1bGUpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBtb21lbnQ7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoXCJtb21lbnRcIiwgZnVuY3Rpb24gKHJlcXVpcmUsIGV4cG9ydHMsIG1vZHVsZSkge1xuICAgICAgICAgICAgaWYgKG1vZHVsZS5jb25maWcgJiYgbW9kdWxlLmNvbmZpZygpICYmIG1vZHVsZS5jb25maWcoKS5ub0dsb2JhbCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIC8vIHJlbGVhc2UgdGhlIGdsb2JhbCB2YXJpYWJsZVxuICAgICAgICAgICAgICAgIGdsb2JhbFNjb3BlLm1vbWVudCA9IG9sZEdsb2JhbE1vbWVudDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1vbWVudDtcbiAgICAgICAgfSk7XG4gICAgICAgIG1ha2VHbG9iYWwodHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbWFrZUdsb2JhbCgpO1xuICAgIH1cbn0pLmNhbGwodGhpcyk7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiLy8gICAgIFVuZGVyc2NvcmUuanMgMS42LjBcbi8vICAgICBodHRwOi8vdW5kZXJzY29yZWpzLm9yZ1xuLy8gICAgIChjKSAyMDA5LTIwMTQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbi8vICAgICBVbmRlcnNjb3JlIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG4oZnVuY3Rpb24oKSB7XG5cbiAgLy8gQmFzZWxpbmUgc2V0dXBcbiAgLy8gLS0tLS0tLS0tLS0tLS1cblxuICAvLyBFc3RhYmxpc2ggdGhlIHJvb3Qgb2JqZWN0LCBgd2luZG93YCBpbiB0aGUgYnJvd3Nlciwgb3IgYGV4cG9ydHNgIG9uIHRoZSBzZXJ2ZXIuXG4gIHZhciByb290ID0gdGhpcztcblxuICAvLyBTYXZlIHRoZSBwcmV2aW91cyB2YWx1ZSBvZiB0aGUgYF9gIHZhcmlhYmxlLlxuICB2YXIgcHJldmlvdXNVbmRlcnNjb3JlID0gcm9vdC5fO1xuXG4gIC8vIEVzdGFibGlzaCB0aGUgb2JqZWN0IHRoYXQgZ2V0cyByZXR1cm5lZCB0byBicmVhayBvdXQgb2YgYSBsb29wIGl0ZXJhdGlvbi5cbiAgdmFyIGJyZWFrZXIgPSB7fTtcblxuICAvLyBTYXZlIGJ5dGVzIGluIHRoZSBtaW5pZmllZCAoYnV0IG5vdCBnemlwcGVkKSB2ZXJzaW9uOlxuICB2YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSwgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlLCBGdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbiAgLy8gQ3JlYXRlIHF1aWNrIHJlZmVyZW5jZSB2YXJpYWJsZXMgZm9yIHNwZWVkIGFjY2VzcyB0byBjb3JlIHByb3RvdHlwZXMuXG4gIHZhclxuICAgIHB1c2ggICAgICAgICAgICAgPSBBcnJheVByb3RvLnB1c2gsXG4gICAgc2xpY2UgICAgICAgICAgICA9IEFycmF5UHJvdG8uc2xpY2UsXG4gICAgY29uY2F0ICAgICAgICAgICA9IEFycmF5UHJvdG8uY29uY2F0LFxuICAgIHRvU3RyaW5nICAgICAgICAgPSBPYmpQcm90by50b1N0cmluZyxcbiAgICBoYXNPd25Qcm9wZXJ0eSAgID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbiAgLy8gQWxsICoqRUNNQVNjcmlwdCA1KiogbmF0aXZlIGZ1bmN0aW9uIGltcGxlbWVudGF0aW9ucyB0aGF0IHdlIGhvcGUgdG8gdXNlXG4gIC8vIGFyZSBkZWNsYXJlZCBoZXJlLlxuICB2YXJcbiAgICBuYXRpdmVGb3JFYWNoICAgICAgPSBBcnJheVByb3RvLmZvckVhY2gsXG4gICAgbmF0aXZlTWFwICAgICAgICAgID0gQXJyYXlQcm90by5tYXAsXG4gICAgbmF0aXZlUmVkdWNlICAgICAgID0gQXJyYXlQcm90by5yZWR1Y2UsXG4gICAgbmF0aXZlUmVkdWNlUmlnaHQgID0gQXJyYXlQcm90by5yZWR1Y2VSaWdodCxcbiAgICBuYXRpdmVGaWx0ZXIgICAgICAgPSBBcnJheVByb3RvLmZpbHRlcixcbiAgICBuYXRpdmVFdmVyeSAgICAgICAgPSBBcnJheVByb3RvLmV2ZXJ5LFxuICAgIG5hdGl2ZVNvbWUgICAgICAgICA9IEFycmF5UHJvdG8uc29tZSxcbiAgICBuYXRpdmVJbmRleE9mICAgICAgPSBBcnJheVByb3RvLmluZGV4T2YsXG4gICAgbmF0aXZlTGFzdEluZGV4T2YgID0gQXJyYXlQcm90by5sYXN0SW5kZXhPZixcbiAgICBuYXRpdmVJc0FycmF5ICAgICAgPSBBcnJheS5pc0FycmF5LFxuICAgIG5hdGl2ZUtleXMgICAgICAgICA9IE9iamVjdC5rZXlzLFxuICAgIG5hdGl2ZUJpbmQgICAgICAgICA9IEZ1bmNQcm90by5iaW5kO1xuXG4gIC8vIENyZWF0ZSBhIHNhZmUgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgdXNlIGJlbG93LlxuICB2YXIgXyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogaW5zdGFuY2VvZiBfKSByZXR1cm4gb2JqO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBfKSkgcmV0dXJuIG5ldyBfKG9iaik7XG4gICAgdGhpcy5fd3JhcHBlZCA9IG9iajtcbiAgfTtcblxuICAvLyBFeHBvcnQgdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciAqKk5vZGUuanMqKiwgd2l0aFxuICAvLyBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBmb3IgdGhlIG9sZCBgcmVxdWlyZSgpYCBBUEkuIElmIHdlJ3JlIGluXG4gIC8vIHRoZSBicm93c2VyLCBhZGQgYF9gIGFzIGEgZ2xvYmFsIG9iamVjdCB2aWEgYSBzdHJpbmcgaWRlbnRpZmllcixcbiAgLy8gZm9yIENsb3N1cmUgQ29tcGlsZXIgXCJhZHZhbmNlZFwiIG1vZGUuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IF87XG4gICAgfVxuICAgIGV4cG9ydHMuXyA9IF87XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5fID0gXztcbiAgfVxuXG4gIC8vIEN1cnJlbnQgdmVyc2lvbi5cbiAgXy5WRVJTSU9OID0gJzEuNi4wJztcblxuICAvLyBDb2xsZWN0aW9uIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFRoZSBjb3JuZXJzdG9uZSwgYW4gYGVhY2hgIGltcGxlbWVudGF0aW9uLCBha2EgYGZvckVhY2hgLlxuICAvLyBIYW5kbGVzIG9iamVjdHMgd2l0aCB0aGUgYnVpbHQtaW4gYGZvckVhY2hgLCBhcnJheXMsIGFuZCByYXcgb2JqZWN0cy5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGZvckVhY2hgIGlmIGF2YWlsYWJsZS5cbiAgdmFyIGVhY2ggPSBfLmVhY2ggPSBfLmZvckVhY2ggPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuICAgIGlmIChuYXRpdmVGb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBuYXRpdmVGb3JFYWNoKSB7XG4gICAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpbaV0sIGksIG9iaikgPT09IGJyZWFrZXIpIHJldHVybjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtrZXlzW2ldXSwga2V5c1tpXSwgb2JqKSA9PT0gYnJlYWtlcikgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0b3IgdG8gZWFjaCBlbGVtZW50LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgbWFwYCBpZiBhdmFpbGFibGUuXG4gIF8ubWFwID0gXy5jb2xsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0cztcbiAgICBpZiAobmF0aXZlTWFwICYmIG9iai5tYXAgPT09IG5hdGl2ZU1hcCkgcmV0dXJuIG9iai5tYXAoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJlc3VsdHMucHVzaChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIHZhciByZWR1Y2VFcnJvciA9ICdSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJztcblxuICAvLyAqKlJlZHVjZSoqIGJ1aWxkcyB1cCBhIHNpbmdsZSByZXN1bHQgZnJvbSBhIGxpc3Qgb2YgdmFsdWVzLCBha2EgYGluamVjdGAsXG4gIC8vIG9yIGBmb2xkbGAuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGByZWR1Y2VgIGlmIGF2YWlsYWJsZS5cbiAgXy5yZWR1Y2UgPSBfLmZvbGRsID0gXy5pbmplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgdmFyIGluaXRpYWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcbiAgICBpZiAob2JqID09IG51bGwpIG9iaiA9IFtdO1xuICAgIGlmIChuYXRpdmVSZWR1Y2UgJiYgb2JqLnJlZHVjZSA9PT0gbmF0aXZlUmVkdWNlKSB7XG4gICAgICBpZiAoY29udGV4dCkgaXRlcmF0b3IgPSBfLmJpbmQoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGluaXRpYWwgPyBvYmoucmVkdWNlKGl0ZXJhdG9yLCBtZW1vKSA6IG9iai5yZWR1Y2UoaXRlcmF0b3IpO1xuICAgIH1cbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAoIWluaXRpYWwpIHtcbiAgICAgICAgbWVtbyA9IHZhbHVlO1xuICAgICAgICBpbml0aWFsID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG1lbW8sIHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFpbml0aWFsKSB0aHJvdyBuZXcgVHlwZUVycm9yKHJlZHVjZUVycm9yKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfTtcblxuICAvLyBUaGUgcmlnaHQtYXNzb2NpYXRpdmUgdmVyc2lvbiBvZiByZWR1Y2UsIGFsc28ga25vd24gYXMgYGZvbGRyYC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYHJlZHVjZVJpZ2h0YCBpZiBhdmFpbGFibGUuXG4gIF8ucmVkdWNlUmlnaHQgPSBfLmZvbGRyID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgbWVtbywgY29udGV4dCkge1xuICAgIHZhciBpbml0aWFsID0gYXJndW1lbnRzLmxlbmd0aCA+IDI7XG4gICAgaWYgKG9iaiA9PSBudWxsKSBvYmogPSBbXTtcbiAgICBpZiAobmF0aXZlUmVkdWNlUmlnaHQgJiYgb2JqLnJlZHVjZVJpZ2h0ID09PSBuYXRpdmVSZWR1Y2VSaWdodCkge1xuICAgICAgaWYgKGNvbnRleHQpIGl0ZXJhdG9yID0gXy5iaW5kKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICAgIHJldHVybiBpbml0aWFsID8gb2JqLnJlZHVjZVJpZ2h0KGl0ZXJhdG9yLCBtZW1vKSA6IG9iai5yZWR1Y2VSaWdodChpdGVyYXRvcik7XG4gICAgfVxuICAgIHZhciBsZW5ndGggPSBvYmoubGVuZ3RoO1xuICAgIGlmIChsZW5ndGggIT09ICtsZW5ndGgpIHtcbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB9XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaW5kZXggPSBrZXlzID8ga2V5c1stLWxlbmd0aF0gOiAtLWxlbmd0aDtcbiAgICAgIGlmICghaW5pdGlhbCkge1xuICAgICAgICBtZW1vID0gb2JqW2luZGV4XTtcbiAgICAgICAgaW5pdGlhbCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZW1vID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBtZW1vLCBvYmpbaW5kZXhdLCBpbmRleCwgbGlzdCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFpbml0aWFsKSB0aHJvdyBuZXcgVHlwZUVycm9yKHJlZHVjZUVycm9yKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIGZpcnN0IHZhbHVlIHdoaWNoIHBhc3NlcyBhIHRydXRoIHRlc3QuIEFsaWFzZWQgYXMgYGRldGVjdGAuXG4gIF8uZmluZCA9IF8uZGV0ZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIGFueShvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGZpbHRlcmAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBzZWxlY3RgLlxuICBfLmZpbHRlciA9IF8uc2VsZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdHM7XG4gICAgaWYgKG5hdGl2ZUZpbHRlciAmJiBvYmouZmlsdGVyID09PSBuYXRpdmVGaWx0ZXIpIHJldHVybiBvYmouZmlsdGVyKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHMucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGEgdHJ1dGggdGVzdCBmYWlscy5cbiAgXy5yZWplY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmV0dXJuICFwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgIH0sIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIERldGVybWluZSB3aGV0aGVyIGFsbCBvZiB0aGUgZWxlbWVudHMgbWF0Y2ggYSB0cnV0aCB0ZXN0LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgZXZlcnlgIGlmIGF2YWlsYWJsZS5cbiAgLy8gQWxpYXNlZCBhcyBgYWxsYC5cbiAgXy5ldmVyeSA9IF8uYWxsID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgfHwgKHByZWRpY2F0ZSA9IF8uaWRlbnRpdHkpO1xuICAgIHZhciByZXN1bHQgPSB0cnVlO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAobmF0aXZlRXZlcnkgJiYgb2JqLmV2ZXJ5ID09PSBuYXRpdmVFdmVyeSkgcmV0dXJuIG9iai5ldmVyeShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmICghKHJlc3VsdCA9IHJlc3VsdCAmJiBwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKSkgcmV0dXJuIGJyZWFrZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuICEhcmVzdWx0O1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiBhdCBsZWFzdCBvbmUgZWxlbWVudCBpbiB0aGUgb2JqZWN0IG1hdGNoZXMgYSB0cnV0aCB0ZXN0LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgc29tZWAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBhbnlgLlxuICB2YXIgYW55ID0gXy5zb21lID0gXy5hbnkgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSB8fCAocHJlZGljYXRlID0gXy5pZGVudGl0eSk7XG4gICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAobmF0aXZlU29tZSAmJiBvYmouc29tZSA9PT0gbmF0aXZlU29tZSkgcmV0dXJuIG9iai5zb21lKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHJlc3VsdCB8fCAocmVzdWx0ID0gcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkpIHJldHVybiBicmVha2VyO1xuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIHZhbHVlICh1c2luZyBgPT09YCkuXG4gIC8vIEFsaWFzZWQgYXMgYGluY2x1ZGVgLlxuICBfLmNvbnRhaW5zID0gXy5pbmNsdWRlID0gZnVuY3Rpb24ob2JqLCB0YXJnZXQpIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICBpZiAobmF0aXZlSW5kZXhPZiAmJiBvYmouaW5kZXhPZiA9PT0gbmF0aXZlSW5kZXhPZikgcmV0dXJuIG9iai5pbmRleE9mKHRhcmdldCkgIT0gLTE7XG4gICAgcmV0dXJuIGFueShvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRhcmdldDtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBJbnZva2UgYSBtZXRob2QgKHdpdGggYXJndW1lbnRzKSBvbiBldmVyeSBpdGVtIGluIGEgY29sbGVjdGlvbi5cbiAgXy5pbnZva2UgPSBmdW5jdGlvbihvYmosIG1ldGhvZCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpc0Z1bmMgPSBfLmlzRnVuY3Rpb24obWV0aG9kKTtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIChpc0Z1bmMgPyBtZXRob2QgOiB2YWx1ZVttZXRob2RdKS5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgXy5wbHVjayA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgXy5wcm9wZXJ0eShrZXkpKTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaWx0ZXJgOiBzZWxlY3Rpbmcgb25seSBvYmplY3RzXG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ud2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgXy5tYXRjaGVzKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmluZGA6IGdldHRpbmcgdGhlIGZpcnN0IG9iamVjdFxuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmZpbmRXaGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy5maW5kKG9iaiwgXy5tYXRjaGVzKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGVsZW1lbnQgb3IgKGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICAvLyBDYW4ndCBvcHRpbWl6ZSBhcnJheXMgb2YgaW50ZWdlcnMgbG9uZ2VyIHRoYW4gNjUsNTM1IGVsZW1lbnRzLlxuICAvLyBTZWUgW1dlYktpdCBCdWcgODA3OTddKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD04MDc5NylcbiAgXy5tYXggPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzQXJyYXkob2JqKSAmJiBvYmpbMF0gPT09ICtvYmpbMF0gJiYgb2JqLmxlbmd0aCA8IDY1NTM1KSB7XG4gICAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkoTWF0aCwgb2JqKTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IC1JbmZpbml0eSwgbGFzdENvbXB1dGVkID0gLUluZmluaXR5O1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHZhciBjb21wdXRlZCA9IGl0ZXJhdG9yID8gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpIDogdmFsdWU7XG4gICAgICBpZiAoY29tcHV0ZWQgPiBsYXN0Q29tcHV0ZWQpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtaW5pbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1pbiA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAoIWl0ZXJhdG9yICYmIF8uaXNBcnJheShvYmopICYmIG9ialswXSA9PT0gK29ialswXSAmJiBvYmoubGVuZ3RoIDwgNjU1MzUpIHtcbiAgICAgIHJldHVybiBNYXRoLm1pbi5hcHBseShNYXRoLCBvYmopO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IEluZmluaXR5O1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHZhciBjb21wdXRlZCA9IGl0ZXJhdG9yID8gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpIDogdmFsdWU7XG4gICAgICBpZiAoY29tcHV0ZWQgPCBsYXN0Q29tcHV0ZWQpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gU2h1ZmZsZSBhbiBhcnJheSwgdXNpbmcgdGhlIG1vZGVybiB2ZXJzaW9uIG9mIHRoZVxuICAvLyBbRmlzaGVyLVlhdGVzIHNodWZmbGVdKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRmlzaGVy4oCTWWF0ZXNfc2h1ZmZsZSkuXG4gIF8uc2h1ZmZsZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByYW5kO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHNodWZmbGVkID0gW107XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByYW5kID0gXy5yYW5kb20oaW5kZXgrKyk7XG4gICAgICBzaHVmZmxlZFtpbmRleCAtIDFdID0gc2h1ZmZsZWRbcmFuZF07XG4gICAgICBzaHVmZmxlZFtyYW5kXSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIHJldHVybiBzaHVmZmxlZDtcbiAgfTtcblxuICAvLyBTYW1wbGUgKipuKiogcmFuZG9tIHZhbHVlcyBmcm9tIGEgY29sbGVjdGlvbi5cbiAgLy8gSWYgKipuKiogaXMgbm90IHNwZWNpZmllZCwgcmV0dXJucyBhIHNpbmdsZSByYW5kb20gZWxlbWVudC5cbiAgLy8gVGhlIGludGVybmFsIGBndWFyZGAgYXJndW1lbnQgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgbWFwYC5cbiAgXy5zYW1wbGUgPSBmdW5jdGlvbihvYmosIG4sIGd1YXJkKSB7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkge1xuICAgICAgaWYgKG9iai5sZW5ndGggIT09ICtvYmoubGVuZ3RoKSBvYmogPSBfLnZhbHVlcyhvYmopO1xuICAgICAgcmV0dXJuIG9ialtfLnJhbmRvbShvYmoubGVuZ3RoIC0gMSldO1xuICAgIH1cbiAgICByZXR1cm4gXy5zaHVmZmxlKG9iaikuc2xpY2UoMCwgTWF0aC5tYXgoMCwgbikpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGxvb2t1cCBpdGVyYXRvcnMuXG4gIHZhciBsb29rdXBJdGVyYXRvciA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBfLmlkZW50aXR5O1xuICAgIGlmIChfLmlzRnVuY3Rpb24odmFsdWUpKSByZXR1cm4gdmFsdWU7XG4gICAgcmV0dXJuIF8ucHJvcGVydHkodmFsdWUpO1xuICB9O1xuXG4gIC8vIFNvcnQgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiBwcm9kdWNlZCBieSBhbiBpdGVyYXRvci5cbiAgXy5zb3J0QnkgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcihpdGVyYXRvcik7XG4gICAgcmV0dXJuIF8ucGx1Y2soXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICBjcml0ZXJpYTogaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpXG4gICAgICB9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYTtcbiAgICAgIHZhciBiID0gcmlnaHQuY3JpdGVyaWE7XG4gICAgICBpZiAoYSAhPT0gYikge1xuICAgICAgICBpZiAoYSA+IGIgfHwgYSA9PT0gdm9pZCAwKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGEgPCBiIHx8IGIgPT09IHZvaWQgMCkgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxlZnQuaW5kZXggLSByaWdodC5pbmRleDtcbiAgICB9KSwgJ3ZhbHVlJyk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdXNlZCBmb3IgYWdncmVnYXRlIFwiZ3JvdXAgYnlcIiBvcGVyYXRpb25zLlxuICB2YXIgZ3JvdXAgPSBmdW5jdGlvbihiZWhhdmlvcikge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICBpdGVyYXRvciA9IGxvb2t1cEl0ZXJhdG9yKGl0ZXJhdG9yKTtcbiAgICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGtleSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBvYmopO1xuICAgICAgICBiZWhhdmlvcihyZXN1bHQsIGtleSwgdmFsdWUpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuICAvLyB0byBncm91cCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNyaXRlcmlvbi5cbiAgXy5ncm91cEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCBrZXksIHZhbHVlKSB7XG4gICAgXy5oYXMocmVzdWx0LCBrZXkpID8gcmVzdWx0W2tleV0ucHVzaCh2YWx1ZSkgOiByZXN1bHRba2V5XSA9IFt2YWx1ZV07XG4gIH0pO1xuXG4gIC8vIEluZGV4ZXMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiwgc2ltaWxhciB0byBgZ3JvdXBCeWAsIGJ1dCBmb3JcbiAgLy8gd2hlbiB5b3Uga25vdyB0aGF0IHlvdXIgaW5kZXggdmFsdWVzIHdpbGwgYmUgdW5pcXVlLlxuICBfLmluZGV4QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIGtleSwgdmFsdWUpIHtcbiAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICB9KTtcblxuICAvLyBDb3VudHMgaW5zdGFuY2VzIG9mIGFuIG9iamVjdCB0aGF0IGdyb3VwIGJ5IGEgY2VydGFpbiBjcml0ZXJpb24uIFBhc3NcbiAgLy8gZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZSB0byBjb3VudCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlXG4gIC8vIGNyaXRlcmlvbi5cbiAgXy5jb3VudEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCBrZXkpIHtcbiAgICBfLmhhcyhyZXN1bHQsIGtleSkgPyByZXN1bHRba2V5XSsrIDogcmVzdWx0W2tleV0gPSAxO1xuICB9KTtcblxuICAvLyBVc2UgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRvIGZpZ3VyZSBvdXQgdGhlIHNtYWxsZXN0IGluZGV4IGF0IHdoaWNoXG4gIC8vIGFuIG9iamVjdCBzaG91bGQgYmUgaW5zZXJ0ZWQgc28gYXMgdG8gbWFpbnRhaW4gb3JkZXIuIFVzZXMgYmluYXJ5IHNlYXJjaC5cbiAgXy5zb3J0ZWRJbmRleCA9IGZ1bmN0aW9uKGFycmF5LCBvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcihpdGVyYXRvcik7XG4gICAgdmFyIHZhbHVlID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmopO1xuICAgIHZhciBsb3cgPSAwLCBoaWdoID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICB2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+PiAxO1xuICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBhcnJheVttaWRdKSA8IHZhbHVlID8gbG93ID0gbWlkICsgMSA6IGhpZ2ggPSBtaWQ7XG4gICAgfVxuICAgIHJldHVybiBsb3c7XG4gIH07XG5cbiAgLy8gU2FmZWx5IGNyZWF0ZSBhIHJlYWwsIGxpdmUgYXJyYXkgZnJvbSBhbnl0aGluZyBpdGVyYWJsZS5cbiAgXy50b0FycmF5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFvYmopIHJldHVybiBbXTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikpIHJldHVybiBzbGljZS5jYWxsKG9iaik7XG4gICAgaWYgKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSByZXR1cm4gXy5tYXAob2JqLCBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gXy52YWx1ZXMob2JqKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiBhbiBvYmplY3QuXG4gIF8uc2l6ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIDA7XG4gICAgcmV0dXJuIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkgPyBvYmoubGVuZ3RoIDogXy5rZXlzKG9iaikubGVuZ3RoO1xuICB9O1xuXG4gIC8vIEFycmF5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS1cblxuICAvLyBHZXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGZpcnN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgaGVhZGAgYW5kIGB0YWtlYC4gVGhlICoqZ3VhcmQqKiBjaGVja1xuICAvLyBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8uZmlyc3QgPSBfLmhlYWQgPSBfLnRha2UgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAoKG4gPT0gbnVsbCkgfHwgZ3VhcmQpIHJldHVybiBhcnJheVswXTtcbiAgICBpZiAobiA8IDApIHJldHVybiBbXTtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgbik7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgbGFzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEVzcGVjaWFsbHkgdXNlZnVsIG9uXG4gIC8vIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIGFsbCB0aGUgdmFsdWVzIGluXG4gIC8vIHRoZSBhcnJheSwgZXhjbHVkaW5nIHRoZSBsYXN0IE4uIFRoZSAqKmd1YXJkKiogY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aFxuICAvLyBgXy5tYXBgLlxuICBfLmluaXRpYWwgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgYXJyYXkubGVuZ3RoIC0gKChuID09IG51bGwpIHx8IGd1YXJkID8gMSA6IG4pKTtcbiAgfTtcblxuICAvLyBHZXQgdGhlIGxhc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgbGFzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuIFRoZSAqKmd1YXJkKiogY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLmxhc3QgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAoKG4gPT0gbnVsbCkgfHwgZ3VhcmQpIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgTWF0aC5tYXgoYXJyYXkubGVuZ3RoIC0gbiwgMCkpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGZpcnN0IGVudHJ5IG9mIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgdGFpbGAgYW5kIGBkcm9wYC5cbiAgLy8gRXNwZWNpYWxseSB1c2VmdWwgb24gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgYW4gKipuKiogd2lsbCByZXR1cm5cbiAgLy8gdGhlIHJlc3QgTiB2YWx1ZXMgaW4gdGhlIGFycmF5LiBUaGUgKipndWFyZCoqXG4gIC8vIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5yZXN0ID0gXy50YWlsID0gXy5kcm9wID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIChuID09IG51bGwpIHx8IGd1YXJkID8gMSA6IG4pO1xuICB9O1xuXG4gIC8vIFRyaW0gb3V0IGFsbCBmYWxzeSB2YWx1ZXMgZnJvbSBhbiBhcnJheS5cbiAgXy5jb21wYWN0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIF8uaWRlbnRpdHkpO1xuICB9O1xuXG4gIC8vIEludGVybmFsIGltcGxlbWVudGF0aW9uIG9mIGEgcmVjdXJzaXZlIGBmbGF0dGVuYCBmdW5jdGlvbi5cbiAgdmFyIGZsYXR0ZW4gPSBmdW5jdGlvbihpbnB1dCwgc2hhbGxvdywgb3V0cHV0KSB7XG4gICAgaWYgKHNoYWxsb3cgJiYgXy5ldmVyeShpbnB1dCwgXy5pc0FycmF5KSkge1xuICAgICAgcmV0dXJuIGNvbmNhdC5hcHBseShvdXRwdXQsIGlucHV0KTtcbiAgICB9XG4gICAgZWFjaChpbnB1dCwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGlmIChfLmlzQXJyYXkodmFsdWUpIHx8IF8uaXNBcmd1bWVudHModmFsdWUpKSB7XG4gICAgICAgIHNoYWxsb3cgPyBwdXNoLmFwcGx5KG91dHB1dCwgdmFsdWUpIDogZmxhdHRlbih2YWx1ZSwgc2hhbGxvdywgb3V0cHV0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dC5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIC8vIEZsYXR0ZW4gb3V0IGFuIGFycmF5LCBlaXRoZXIgcmVjdXJzaXZlbHkgKGJ5IGRlZmF1bHQpLCBvciBqdXN0IG9uZSBsZXZlbC5cbiAgXy5mbGF0dGVuID0gZnVuY3Rpb24oYXJyYXksIHNoYWxsb3cpIHtcbiAgICByZXR1cm4gZmxhdHRlbihhcnJheSwgc2hhbGxvdywgW10pO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHZlcnNpb24gb2YgdGhlIGFycmF5IHRoYXQgZG9lcyBub3QgY29udGFpbiB0aGUgc3BlY2lmaWVkIHZhbHVlKHMpLlxuICBfLndpdGhvdXQgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmRpZmZlcmVuY2UoYXJyYXksIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gIH07XG5cbiAgLy8gU3BsaXQgYW4gYXJyYXkgaW50byB0d28gYXJyYXlzOiBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIHNhdGlzZnkgdGhlIGdpdmVuXG4gIC8vIHByZWRpY2F0ZSwgYW5kIG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgZG8gbm90IHNhdGlzZnkgdGhlIHByZWRpY2F0ZS5cbiAgXy5wYXJ0aXRpb24gPSBmdW5jdGlvbihhcnJheSwgcHJlZGljYXRlKSB7XG4gICAgdmFyIHBhc3MgPSBbXSwgZmFpbCA9IFtdO1xuICAgIGVhY2goYXJyYXksIGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgIChwcmVkaWNhdGUoZWxlbSkgPyBwYXNzIDogZmFpbCkucHVzaChlbGVtKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW3Bhc3MsIGZhaWxdO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYSBkdXBsaWNhdGUtZnJlZSB2ZXJzaW9uIG9mIHRoZSBhcnJheS4gSWYgdGhlIGFycmF5IGhhcyBhbHJlYWR5XG4gIC8vIGJlZW4gc29ydGVkLCB5b3UgaGF2ZSB0aGUgb3B0aW9uIG9mIHVzaW5nIGEgZmFzdGVyIGFsZ29yaXRobS5cbiAgLy8gQWxpYXNlZCBhcyBgdW5pcXVlYC5cbiAgXy51bmlxID0gXy51bmlxdWUgPSBmdW5jdGlvbihhcnJheSwgaXNTb3J0ZWQsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihpc1NvcnRlZCkpIHtcbiAgICAgIGNvbnRleHQgPSBpdGVyYXRvcjtcbiAgICAgIGl0ZXJhdG9yID0gaXNTb3J0ZWQ7XG4gICAgICBpc1NvcnRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICB2YXIgaW5pdGlhbCA9IGl0ZXJhdG9yID8gXy5tYXAoYXJyYXksIGl0ZXJhdG9yLCBjb250ZXh0KSA6IGFycmF5O1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgdmFyIHNlZW4gPSBbXTtcbiAgICBlYWNoKGluaXRpYWwsIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgaWYgKGlzU29ydGVkID8gKCFpbmRleCB8fCBzZWVuW3NlZW4ubGVuZ3RoIC0gMV0gIT09IHZhbHVlKSA6ICFfLmNvbnRhaW5zKHNlZW4sIHZhbHVlKSkge1xuICAgICAgICBzZWVuLnB1c2godmFsdWUpO1xuICAgICAgICByZXN1bHRzLnB1c2goYXJyYXlbaW5kZXhdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgdGhlIHVuaW9uOiBlYWNoIGRpc3RpbmN0IGVsZW1lbnQgZnJvbSBhbGwgb2ZcbiAgLy8gdGhlIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8udW5pb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXy51bmlxKF8uZmxhdHRlbihhcmd1bWVudHMsIHRydWUpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgZXZlcnkgaXRlbSBzaGFyZWQgYmV0d2VlbiBhbGwgdGhlXG4gIC8vIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8uaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdCA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoXy51bmlxKGFycmF5KSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIF8uZXZlcnkocmVzdCwgZnVuY3Rpb24ob3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMob3RoZXIsIGl0ZW0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gVGFrZSB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIG9uZSBhcnJheSBhbmQgYSBudW1iZXIgb2Ygb3RoZXIgYXJyYXlzLlxuICAvLyBPbmx5IHRoZSBlbGVtZW50cyBwcmVzZW50IGluIGp1c3QgdGhlIGZpcnN0IGFycmF5IHdpbGwgcmVtYWluLlxuICBfLmRpZmZlcmVuY2UgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN0ID0gY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBmdW5jdGlvbih2YWx1ZSl7IHJldHVybiAhXy5jb250YWlucyhyZXN0LCB2YWx1ZSk7IH0pO1xuICB9O1xuXG4gIC8vIFppcCB0b2dldGhlciBtdWx0aXBsZSBsaXN0cyBpbnRvIGEgc2luZ2xlIGFycmF5IC0tIGVsZW1lbnRzIHRoYXQgc2hhcmVcbiAgLy8gYW4gaW5kZXggZ28gdG9nZXRoZXIuXG4gIF8uemlwID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxlbmd0aCA9IF8ubWF4KF8ucGx1Y2soYXJndW1lbnRzLCAnbGVuZ3RoJykuY29uY2F0KDApKTtcbiAgICB2YXIgcmVzdWx0cyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdHNbaV0gPSBfLnBsdWNrKGFyZ3VtZW50cywgJycgKyBpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ29udmVydHMgbGlzdHMgaW50byBvYmplY3RzLiBQYXNzIGVpdGhlciBhIHNpbmdsZSBhcnJheSBvZiBgW2tleSwgdmFsdWVdYFxuICAvLyBwYWlycywgb3IgdHdvIHBhcmFsbGVsIGFycmF5cyBvZiB0aGUgc2FtZSBsZW5ndGggLS0gb25lIG9mIGtleXMsIGFuZCBvbmUgb2ZcbiAgLy8gdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICBfLm9iamVjdCA9IGZ1bmN0aW9uKGxpc3QsIHZhbHVlcykge1xuICAgIGlmIChsaXN0ID09IG51bGwpIHJldHVybiB7fTtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1dID0gdmFsdWVzW2ldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1bMF1dID0gbGlzdFtpXVsxXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBJZiB0aGUgYnJvd3NlciBkb2Vzbid0IHN1cHBseSB1cyB3aXRoIGluZGV4T2YgKEknbSBsb29raW5nIGF0IHlvdSwgKipNU0lFKiopLFxuICAvLyB3ZSBuZWVkIHRoaXMgZnVuY3Rpb24uIFJldHVybiB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYW5cbiAgLy8gaXRlbSBpbiBhbiBhcnJheSwgb3IgLTEgaWYgdGhlIGl0ZW0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBhcnJheS5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGluZGV4T2ZgIGlmIGF2YWlsYWJsZS5cbiAgLy8gSWYgdGhlIGFycmF5IGlzIGxhcmdlIGFuZCBhbHJlYWR5IGluIHNvcnQgb3JkZXIsIHBhc3MgYHRydWVgXG4gIC8vIGZvciAqKmlzU29ydGVkKiogdG8gdXNlIGJpbmFyeSBzZWFyY2guXG4gIF8uaW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBpc1NvcnRlZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XG4gICAgdmFyIGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gICAgaWYgKGlzU29ydGVkKSB7XG4gICAgICBpZiAodHlwZW9mIGlzU29ydGVkID09ICdudW1iZXInKSB7XG4gICAgICAgIGkgPSAoaXNTb3J0ZWQgPCAwID8gTWF0aC5tYXgoMCwgbGVuZ3RoICsgaXNTb3J0ZWQpIDogaXNTb3J0ZWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSA9IF8uc29ydGVkSW5kZXgoYXJyYXksIGl0ZW0pO1xuICAgICAgICByZXR1cm4gYXJyYXlbaV0gPT09IGl0ZW0gPyBpIDogLTE7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChuYXRpdmVJbmRleE9mICYmIGFycmF5LmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0sIGlzU29ydGVkKTtcbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgbGFzdEluZGV4T2ZgIGlmIGF2YWlsYWJsZS5cbiAgXy5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBmcm9tKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiAtMTtcbiAgICB2YXIgaGFzSW5kZXggPSBmcm9tICE9IG51bGw7XG4gICAgaWYgKG5hdGl2ZUxhc3RJbmRleE9mICYmIGFycmF5Lmxhc3RJbmRleE9mID09PSBuYXRpdmVMYXN0SW5kZXhPZikge1xuICAgICAgcmV0dXJuIGhhc0luZGV4ID8gYXJyYXkubGFzdEluZGV4T2YoaXRlbSwgZnJvbSkgOiBhcnJheS5sYXN0SW5kZXhPZihpdGVtKTtcbiAgICB9XG4gICAgdmFyIGkgPSAoaGFzSW5kZXggPyBmcm9tIDogYXJyYXkubGVuZ3RoKTtcbiAgICB3aGlsZSAoaS0tKSBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhbiBpbnRlZ2VyIEFycmF5IGNvbnRhaW5pbmcgYW4gYXJpdGhtZXRpYyBwcm9ncmVzc2lvbi4gQSBwb3J0IG9mXG4gIC8vIHRoZSBuYXRpdmUgUHl0aG9uIGByYW5nZSgpYCBmdW5jdGlvbi4gU2VlXG4gIC8vIFt0aGUgUHl0aG9uIGRvY3VtZW50YXRpb25dKGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS9mdW5jdGlvbnMuaHRtbCNyYW5nZSkuXG4gIF8ucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDw9IDEpIHtcbiAgICAgIHN0b3AgPSBzdGFydCB8fCAwO1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgICBzdGVwID0gYXJndW1lbnRzWzJdIHx8IDE7XG5cbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5tYXgoTWF0aC5jZWlsKChzdG9wIC0gc3RhcnQpIC8gc3RlcCksIDApO1xuICAgIHZhciBpZHggPSAwO1xuICAgIHZhciByYW5nZSA9IG5ldyBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUoaWR4IDwgbGVuZ3RoKSB7XG4gICAgICByYW5nZVtpZHgrK10gPSBzdGFydDtcbiAgICAgIHN0YXJ0ICs9IHN0ZXA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJhbmdlO1xuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIChhaGVtKSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUmV1c2FibGUgY29uc3RydWN0b3IgZnVuY3Rpb24gZm9yIHByb3RvdHlwZSBzZXR0aW5nLlxuICB2YXIgY3RvciA9IGZ1bmN0aW9uKCl7fTtcblxuICAvLyBDcmVhdGUgYSBmdW5jdGlvbiBib3VuZCB0byBhIGdpdmVuIG9iamVjdCAoYXNzaWduaW5nIGB0aGlzYCwgYW5kIGFyZ3VtZW50cyxcbiAgLy8gb3B0aW9uYWxseSkuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBGdW5jdGlvbi5iaW5kYCBpZlxuICAvLyBhdmFpbGFibGUuXG4gIF8uYmluZCA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQpIHtcbiAgICB2YXIgYXJncywgYm91bmQ7XG4gICAgaWYgKG5hdGl2ZUJpbmQgJiYgZnVuYy5iaW5kID09PSBuYXRpdmVCaW5kKSByZXR1cm4gbmF0aXZlQmluZC5hcHBseShmdW5jLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGlmICghXy5pc0Z1bmN0aW9uKGZ1bmMpKSB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgYm91bmQpKSByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgIGN0b3IucHJvdG90eXBlID0gZnVuYy5wcm90b3R5cGU7XG4gICAgICB2YXIgc2VsZiA9IG5ldyBjdG9yO1xuICAgICAgY3Rvci5wcm90b3R5cGUgPSBudWxsO1xuICAgICAgdmFyIHJlc3VsdCA9IGZ1bmMuYXBwbHkoc2VsZiwgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICBpZiAoT2JqZWN0KHJlc3VsdCkgPT09IHJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUGFydGlhbGx5IGFwcGx5IGEgZnVuY3Rpb24gYnkgY3JlYXRpbmcgYSB2ZXJzaW9uIHRoYXQgaGFzIGhhZCBzb21lIG9mIGl0c1xuICAvLyBhcmd1bWVudHMgcHJlLWZpbGxlZCwgd2l0aG91dCBjaGFuZ2luZyBpdHMgZHluYW1pYyBgdGhpc2AgY29udGV4dC4gXyBhY3RzXG4gIC8vIGFzIGEgcGxhY2Vob2xkZXIsIGFsbG93aW5nIGFueSBjb21iaW5hdGlvbiBvZiBhcmd1bWVudHMgdG8gYmUgcHJlLWZpbGxlZC5cbiAgXy5wYXJ0aWFsID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHZhciBib3VuZEFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBvc2l0aW9uID0gMDtcbiAgICAgIHZhciBhcmdzID0gYm91bmRBcmdzLnNsaWNlKCk7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gYXJncy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYXJnc1tpXSA9PT0gXykgYXJnc1tpXSA9IGFyZ3VtZW50c1twb3NpdGlvbisrXTtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChwb3NpdGlvbiA8IGFyZ3VtZW50cy5sZW5ndGgpIGFyZ3MucHVzaChhcmd1bWVudHNbcG9zaXRpb24rK10pO1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBCaW5kIGEgbnVtYmVyIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFJlbWFpbmluZyBhcmd1bWVudHNcbiAgLy8gYXJlIHRoZSBtZXRob2QgbmFtZXMgdG8gYmUgYm91bmQuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdCBhbGwgY2FsbGJhY2tzXG4gIC8vIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgXy5iaW5kQWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGZ1bmNzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGlmIChmdW5jcy5sZW5ndGggPT09IDApIHRocm93IG5ldyBFcnJvcignYmluZEFsbCBtdXN0IGJlIHBhc3NlZCBmdW5jdGlvbiBuYW1lcycpO1xuICAgIGVhY2goZnVuY3MsIGZ1bmN0aW9uKGYpIHsgb2JqW2ZdID0gXy5iaW5kKG9ialtmXSwgb2JqKTsgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBNZW1vaXplIGFuIGV4cGVuc2l2ZSBmdW5jdGlvbiBieSBzdG9yaW5nIGl0cyByZXN1bHRzLlxuICBfLm1lbW9pemUgPSBmdW5jdGlvbihmdW5jLCBoYXNoZXIpIHtcbiAgICB2YXIgbWVtbyA9IHt9O1xuICAgIGhhc2hlciB8fCAoaGFzaGVyID0gXy5pZGVudGl0eSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGtleSA9IGhhc2hlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIF8uaGFzKG1lbW8sIGtleSkgPyBtZW1vW2tleV0gOiAobWVtb1trZXldID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIERlbGF5cyBhIGZ1bmN0aW9uIGZvciB0aGUgZ2l2ZW4gbnVtYmVyIG9mIG1pbGxpc2Vjb25kcywgYW5kIHRoZW4gY2FsbHNcbiAgLy8gaXQgd2l0aCB0aGUgYXJndW1lbnRzIHN1cHBsaWVkLlxuICBfLmRlbGF5ID0gZnVuY3Rpb24oZnVuYywgd2FpdCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IHJldHVybiBmdW5jLmFwcGx5KG51bGwsIGFyZ3MpOyB9LCB3YWl0KTtcbiAgfTtcblxuICAvLyBEZWZlcnMgYSBmdW5jdGlvbiwgc2NoZWR1bGluZyBpdCB0byBydW4gYWZ0ZXIgdGhlIGN1cnJlbnQgY2FsbCBzdGFjayBoYXNcbiAgLy8gY2xlYXJlZC5cbiAgXy5kZWZlciA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICByZXR1cm4gXy5kZWxheS5hcHBseShfLCBbZnVuYywgMV0uY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSkpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgd2hlbiBpbnZva2VkLCB3aWxsIG9ubHkgYmUgdHJpZ2dlcmVkIGF0IG1vc3Qgb25jZVxuICAvLyBkdXJpbmcgYSBnaXZlbiB3aW5kb3cgb2YgdGltZS4gTm9ybWFsbHksIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbCBydW5cbiAgLy8gYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuICAvLyBidXQgaWYgeW91J2QgbGlrZSB0byBkaXNhYmxlIHRoZSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSwgcGFzc1xuICAvLyBge2xlYWRpbmc6IGZhbHNlfWAuIFRvIGRpc2FibGUgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlLCBkaXR0by5cbiAgXy50aHJvdHRsZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICB2YXIgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICAgIHZhciB0aW1lb3V0ID0gbnVsbDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogXy5ub3coKTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub3cgPSBfLm5vdygpO1xuICAgICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKSBwcmV2aW91cyA9IG5vdztcbiAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gIC8vIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3JcbiAgLy8gTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4gIC8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gIF8uZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHQ7XG5cbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsYXN0ID0gXy5ub3coKSAtIHRpbWVzdGFtcDtcbiAgICAgIGlmIChsYXN0IDwgd2FpdCkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgdGltZXN0YW1wID0gXy5ub3coKTtcbiAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgaWYgKCF0aW1lb3V0KSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgIH1cbiAgICAgIGlmIChjYWxsTm93KSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYXQgbW9zdCBvbmUgdGltZSwgbm8gbWF0dGVyIGhvd1xuICAvLyBvZnRlbiB5b3UgY2FsbCBpdC4gVXNlZnVsIGZvciBsYXp5IGluaXRpYWxpemF0aW9uLlxuICBfLm9uY2UgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgdmFyIHJhbiA9IGZhbHNlLCBtZW1vO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChyYW4pIHJldHVybiBtZW1vO1xuICAgICAgcmFuID0gdHJ1ZTtcbiAgICAgIG1lbW8gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICBmdW5jID0gbnVsbDtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgZnVuY3Rpb24gcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSBzZWNvbmQsXG4gIC8vIGFsbG93aW5nIHlvdSB0byBhZGp1c3QgYXJndW1lbnRzLCBydW4gY29kZSBiZWZvcmUgYW5kIGFmdGVyLCBhbmRcbiAgLy8gY29uZGl0aW9uYWxseSBleGVjdXRlIHRoZSBvcmlnaW5hbCBmdW5jdGlvbi5cbiAgXy53cmFwID0gZnVuY3Rpb24oZnVuYywgd3JhcHBlcikge1xuICAgIHJldHVybiBfLnBhcnRpYWwod3JhcHBlciwgZnVuYyk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgaXMgdGhlIGNvbXBvc2l0aW9uIG9mIGEgbGlzdCBvZiBmdW5jdGlvbnMsIGVhY2hcbiAgLy8gY29uc3VtaW5nIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZ1bmN0aW9uIHRoYXQgZm9sbG93cy5cbiAgXy5jb21wb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZ1bmNzID0gYXJndW1lbnRzO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgZm9yICh2YXIgaSA9IGZ1bmNzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGFyZ3MgPSBbZnVuY3NbaV0uYXBwbHkodGhpcywgYXJncyldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFyZ3NbMF07XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgYWZ0ZXIgYmVpbmcgY2FsbGVkIE4gdGltZXMuXG4gIF8uYWZ0ZXIgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzIDwgMSkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgLy8gT2JqZWN0IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUmV0cmlldmUgdGhlIG5hbWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBPYmplY3Qua2V5c2BcbiAgXy5rZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICBpZiAobmF0aXZlS2V5cykgcmV0dXJuIG5hdGl2ZUtleXMob2JqKTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIHRoZSB2YWx1ZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgXy52YWx1ZXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgdmFsdWVzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFsdWVzW2ldID0gb2JqW2tleXNbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9O1xuXG4gIC8vIENvbnZlcnQgYW4gb2JqZWN0IGludG8gYSBsaXN0IG9mIGBba2V5LCB2YWx1ZV1gIHBhaXJzLlxuICBfLnBhaXJzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHBhaXJzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcGFpcnNbaV0gPSBba2V5c1tpXSwgb2JqW2tleXNbaV1dXTtcbiAgICB9XG4gICAgcmV0dXJuIHBhaXJzO1xuICB9O1xuXG4gIC8vIEludmVydCB0aGUga2V5cyBhbmQgdmFsdWVzIG9mIGFuIG9iamVjdC4gVGhlIHZhbHVlcyBtdXN0IGJlIHNlcmlhbGl6YWJsZS5cbiAgXy5pbnZlcnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0W29ialtrZXlzW2ldXV0gPSBrZXlzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHNvcnRlZCBsaXN0IG9mIHRoZSBmdW5jdGlvbiBuYW1lcyBhdmFpbGFibGUgb24gdGhlIG9iamVjdC5cbiAgLy8gQWxpYXNlZCBhcyBgbWV0aG9kc2BcbiAgXy5mdW5jdGlvbnMgPSBfLm1ldGhvZHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgbmFtZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG9ialtrZXldKSkgbmFtZXMucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZXMuc29ydCgpO1xuICB9O1xuXG4gIC8vIEV4dGVuZCBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgcHJvcGVydGllcyBpbiBwYXNzZWQtaW4gb2JqZWN0KHMpLlxuICBfLmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGVhY2goc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLCBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCBvbmx5IGNvbnRhaW5pbmcgdGhlIHdoaXRlbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ucGljayA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBjb3B5ID0ge307XG4gICAgdmFyIGtleXMgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBlYWNoKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKGtleSBpbiBvYmopIGNvcHlba2V5XSA9IG9ialtrZXldO1xuICAgIH0pO1xuICAgIHJldHVybiBjb3B5O1xuICB9O1xuXG4gICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgd2l0aG91dCB0aGUgYmxhY2tsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5vbWl0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGNvcHkgPSB7fTtcbiAgICB2YXIga2V5cyA9IGNvbmNhdC5hcHBseShBcnJheVByb3RvLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmICghXy5jb250YWlucyhrZXlzLCBrZXkpKSBjb3B5W2tleV0gPSBvYmpba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIGNvcHk7XG4gIH07XG5cbiAgLy8gRmlsbCBpbiBhIGdpdmVuIG9iamVjdCB3aXRoIGRlZmF1bHQgcHJvcGVydGllcy5cbiAgXy5kZWZhdWx0cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGVhY2goc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLCBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBpZiAob2JqW3Byb3BdID09PSB2b2lkIDApIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgKHNoYWxsb3ctY2xvbmVkKSBkdXBsaWNhdGUgb2YgYW4gb2JqZWN0LlxuICBfLmNsb25lID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gICAgcmV0dXJuIF8uaXNBcnJheShvYmopID8gb2JqLnNsaWNlKCkgOiBfLmV4dGVuZCh7fSwgb2JqKTtcbiAgfTtcblxuICAvLyBJbnZva2VzIGludGVyY2VwdG9yIHdpdGggdGhlIG9iaiwgYW5kIHRoZW4gcmV0dXJucyBvYmouXG4gIC8vIFRoZSBwcmltYXJ5IHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gXCJ0YXAgaW50b1wiIGEgbWV0aG9kIGNoYWluLCBpblxuICAvLyBvcmRlciB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gaW50ZXJtZWRpYXRlIHJlc3VsdHMgd2l0aGluIHRoZSBjaGFpbi5cbiAgXy50YXAgPSBmdW5jdGlvbihvYmosIGludGVyY2VwdG9yKSB7XG4gICAgaW50ZXJjZXB0b3Iob2JqKTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIEludGVybmFsIHJlY3Vyc2l2ZSBjb21wYXJpc29uIGZ1bmN0aW9uIGZvciBgaXNFcXVhbGAuXG4gIHZhciBlcSA9IGZ1bmN0aW9uKGEsIGIsIGFTdGFjaywgYlN0YWNrKSB7XG4gICAgLy8gSWRlbnRpY2FsIG9iamVjdHMgYXJlIGVxdWFsLiBgMCA9PT0gLTBgLCBidXQgdGhleSBhcmVuJ3QgaWRlbnRpY2FsLlxuICAgIC8vIFNlZSB0aGUgW0hhcm1vbnkgYGVnYWxgIHByb3Bvc2FsXShodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWwpLlxuICAgIGlmIChhID09PSBiKSByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PSAxIC8gYjtcbiAgICAvLyBBIHN0cmljdCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGBudWxsID09IHVuZGVmaW5lZGAuXG4gICAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHJldHVybiBhID09PSBiO1xuICAgIC8vIFVud3JhcCBhbnkgd3JhcHBlZCBvYmplY3RzLlxuICAgIGlmIChhIGluc3RhbmNlb2YgXykgYSA9IGEuX3dyYXBwZWQ7XG4gICAgaWYgKGIgaW5zdGFuY2VvZiBfKSBiID0gYi5fd3JhcHBlZDtcbiAgICAvLyBDb21wYXJlIGBbW0NsYXNzXV1gIG5hbWVzLlxuICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKGEpO1xuICAgIGlmIChjbGFzc05hbWUgIT0gdG9TdHJpbmcuY2FsbChiKSkgcmV0dXJuIGZhbHNlO1xuICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAvLyBTdHJpbmdzLCBudW1iZXJzLCBkYXRlcywgYW5kIGJvb2xlYW5zIGFyZSBjb21wYXJlZCBieSB2YWx1ZS5cbiAgICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6XG4gICAgICAgIC8vIFByaW1pdGl2ZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgb2JqZWN0IHdyYXBwZXJzIGFyZSBlcXVpdmFsZW50OyB0aHVzLCBgXCI1XCJgIGlzXG4gICAgICAgIC8vIGVxdWl2YWxlbnQgdG8gYG5ldyBTdHJpbmcoXCI1XCIpYC5cbiAgICAgICAgcmV0dXJuIGEgPT0gU3RyaW5nKGIpO1xuICAgICAgY2FzZSAnW29iamVjdCBOdW1iZXJdJzpcbiAgICAgICAgLy8gYE5hTmBzIGFyZSBlcXVpdmFsZW50LCBidXQgbm9uLXJlZmxleGl2ZS4gQW4gYGVnYWxgIGNvbXBhcmlzb24gaXMgcGVyZm9ybWVkIGZvclxuICAgICAgICAvLyBvdGhlciBudW1lcmljIHZhbHVlcy5cbiAgICAgICAgcmV0dXJuIGEgIT0gK2EgPyBiICE9ICtiIDogKGEgPT0gMCA/IDEgLyBhID09IDEgLyBiIDogYSA9PSArYik7XG4gICAgICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICAgIGNhc2UgJ1tvYmplY3QgQm9vbGVhbl0nOlxuICAgICAgICAvLyBDb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWVyaWMgcHJpbWl0aXZlIHZhbHVlcy4gRGF0ZXMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyXG4gICAgICAgIC8vIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9ucy4gTm90ZSB0aGF0IGludmFsaWQgZGF0ZXMgd2l0aCBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnNcbiAgICAgICAgLy8gb2YgYE5hTmAgYXJlIG5vdCBlcXVpdmFsZW50LlxuICAgICAgICByZXR1cm4gK2EgPT0gK2I7XG4gICAgICAvLyBSZWdFeHBzIGFyZSBjb21wYXJlZCBieSB0aGVpciBzb3VyY2UgcGF0dGVybnMgYW5kIGZsYWdzLlxuICAgICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcbiAgICAgICAgcmV0dXJuIGEuc291cmNlID09IGIuc291cmNlICYmXG4gICAgICAgICAgICAgICBhLmdsb2JhbCA9PSBiLmdsb2JhbCAmJlxuICAgICAgICAgICAgICAgYS5tdWx0aWxpbmUgPT0gYi5tdWx0aWxpbmUgJiZcbiAgICAgICAgICAgICAgIGEuaWdub3JlQ2FzZSA9PSBiLmlnbm9yZUNhc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgYSAhPSAnb2JqZWN0JyB8fCB0eXBlb2YgYiAhPSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuICAgIC8vIEFzc3VtZSBlcXVhbGl0eSBmb3IgY3ljbGljIHN0cnVjdHVyZXMuIFRoZSBhbGdvcml0aG0gZm9yIGRldGVjdGluZyBjeWNsaWNcbiAgICAvLyBzdHJ1Y3R1cmVzIGlzIGFkYXB0ZWQgZnJvbSBFUyA1LjEgc2VjdGlvbiAxNS4xMi4zLCBhYnN0cmFjdCBvcGVyYXRpb24gYEpPYC5cbiAgICB2YXIgbGVuZ3RoID0gYVN0YWNrLmxlbmd0aDtcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIC8vIExpbmVhciBzZWFyY2guIFBlcmZvcm1hbmNlIGlzIGludmVyc2VseSBwcm9wb3J0aW9uYWwgdG8gdGhlIG51bWJlciBvZlxuICAgICAgLy8gdW5pcXVlIG5lc3RlZCBzdHJ1Y3R1cmVzLlxuICAgICAgaWYgKGFTdGFja1tsZW5ndGhdID09IGEpIHJldHVybiBiU3RhY2tbbGVuZ3RoXSA9PSBiO1xuICAgIH1cbiAgICAvLyBPYmplY3RzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWl2YWxlbnQsIGJ1dCBgT2JqZWN0YHNcbiAgICAvLyBmcm9tIGRpZmZlcmVudCBmcmFtZXMgYXJlLlxuICAgIHZhciBhQ3RvciA9IGEuY29uc3RydWN0b3IsIGJDdG9yID0gYi5jb25zdHJ1Y3RvcjtcbiAgICBpZiAoYUN0b3IgIT09IGJDdG9yICYmICEoXy5pc0Z1bmN0aW9uKGFDdG9yKSAmJiAoYUN0b3IgaW5zdGFuY2VvZiBhQ3RvcikgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5pc0Z1bmN0aW9uKGJDdG9yKSAmJiAoYkN0b3IgaW5zdGFuY2VvZiBiQ3RvcikpXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAoJ2NvbnN0cnVjdG9yJyBpbiBhICYmICdjb25zdHJ1Y3RvcicgaW4gYikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gQWRkIHRoZSBmaXJzdCBvYmplY3QgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wdXNoKGEpO1xuICAgIGJTdGFjay5wdXNoKGIpO1xuICAgIHZhciBzaXplID0gMCwgcmVzdWx0ID0gdHJ1ZTtcbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgYW5kIGFycmF5cy5cbiAgICBpZiAoY2xhc3NOYW1lID09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgIC8vIENvbXBhcmUgYXJyYXkgbGVuZ3RocyB0byBkZXRlcm1pbmUgaWYgYSBkZWVwIGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5LlxuICAgICAgc2l6ZSA9IGEubGVuZ3RoO1xuICAgICAgcmVzdWx0ID0gc2l6ZSA9PSBiLmxlbmd0aDtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgLy8gRGVlcCBjb21wYXJlIHRoZSBjb250ZW50cywgaWdub3Jpbmcgbm9uLW51bWVyaWMgcHJvcGVydGllcy5cbiAgICAgICAgd2hpbGUgKHNpemUtLSkge1xuICAgICAgICAgIGlmICghKHJlc3VsdCA9IGVxKGFbc2l6ZV0sIGJbc2l6ZV0sIGFTdGFjaywgYlN0YWNrKSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlZXAgY29tcGFyZSBvYmplY3RzLlxuICAgICAgZm9yICh2YXIga2V5IGluIGEpIHtcbiAgICAgICAgaWYgKF8uaGFzKGEsIGtleSkpIHtcbiAgICAgICAgICAvLyBDb3VudCB0aGUgZXhwZWN0ZWQgbnVtYmVyIG9mIHByb3BlcnRpZXMuXG4gICAgICAgICAgc2l6ZSsrO1xuICAgICAgICAgIC8vIERlZXAgY29tcGFyZSBlYWNoIG1lbWJlci5cbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSBfLmhhcyhiLCBrZXkpICYmIGVxKGFba2V5XSwgYltrZXldLCBhU3RhY2ssIGJTdGFjaykpKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRW5zdXJlIHRoYXQgYm90aCBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIHByb3BlcnRpZXMuXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGZvciAoa2V5IGluIGIpIHtcbiAgICAgICAgICBpZiAoXy5oYXMoYiwga2V5KSAmJiAhKHNpemUtLSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9ICFzaXplO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBSZW1vdmUgdGhlIGZpcnN0IG9iamVjdCBmcm9tIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucG9wKCk7XG4gICAgYlN0YWNrLnBvcCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUGVyZm9ybSBhIGRlZXAgY29tcGFyaXNvbiB0byBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgZXF1YWwuXG4gIF8uaXNFcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gZXEoYSwgYiwgW10sIFtdKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIGFycmF5LCBzdHJpbmcsIG9yIG9iamVjdCBlbXB0eT9cbiAgLy8gQW4gXCJlbXB0eVwiIG9iamVjdCBoYXMgbm8gZW51bWVyYWJsZSBvd24tcHJvcGVydGllcy5cbiAgXy5pc0VtcHR5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikgfHwgXy5pc1N0cmluZyhvYmopKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIERPTSBlbGVtZW50P1xuICBfLmlzRWxlbWVudCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGFuIGFycmF5P1xuICAvLyBEZWxlZ2F0ZXMgdG8gRUNNQTUncyBuYXRpdmUgQXJyYXkuaXNBcnJheVxuICBfLmlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIGFuIG9iamVjdD9cbiAgXy5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xuICB9O1xuXG4gIC8vIEFkZCBzb21lIGlzVHlwZSBtZXRob2RzOiBpc0FyZ3VtZW50cywgaXNGdW5jdGlvbiwgaXNTdHJpbmcsIGlzTnVtYmVyLCBpc0RhdGUsIGlzUmVnRXhwLlxuICBlYWNoKFsnQXJndW1lbnRzJywgJ0Z1bmN0aW9uJywgJ1N0cmluZycsICdOdW1iZXInLCAnRGF0ZScsICdSZWdFeHAnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIF9bJ2lzJyArIG5hbWVdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIERlZmluZSBhIGZhbGxiYWNrIHZlcnNpb24gb2YgdGhlIG1ldGhvZCBpbiBicm93c2VycyAoYWhlbSwgSUUpLCB3aGVyZVxuICAvLyB0aGVyZSBpc24ndCBhbnkgaW5zcGVjdGFibGUgXCJBcmd1bWVudHNcIiB0eXBlLlxuICBpZiAoIV8uaXNBcmd1bWVudHMoYXJndW1lbnRzKSkge1xuICAgIF8uaXNBcmd1bWVudHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiAhIShvYmogJiYgXy5oYXMob2JqLCAnY2FsbGVlJykpO1xuICAgIH07XG4gIH1cblxuICAvLyBPcHRpbWl6ZSBgaXNGdW5jdGlvbmAgaWYgYXBwcm9wcmlhdGUuXG4gIGlmICh0eXBlb2YgKC8uLykgIT09ICdmdW5jdGlvbicpIHtcbiAgICBfLmlzRnVuY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nO1xuICAgIH07XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIG9iamVjdCBhIGZpbml0ZSBudW1iZXI/XG4gIF8uaXNGaW5pdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4ocGFyc2VGbG9hdChvYmopKTtcbiAgfTtcblxuICAvLyBJcyB0aGUgZ2l2ZW4gdmFsdWUgYE5hTmA/IChOYU4gaXMgdGhlIG9ubHkgbnVtYmVyIHdoaWNoIGRvZXMgbm90IGVxdWFsIGl0c2VsZikuXG4gIF8uaXNOYU4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc051bWJlcihvYmopICYmIG9iaiAhPSArb2JqO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBib29sZWFuP1xuICBfLmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgZXF1YWwgdG8gbnVsbD9cbiAgXy5pc051bGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBudWxsO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgdW5kZWZpbmVkP1xuICBfLmlzVW5kZWZpbmVkID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdm9pZCAwO1xuICB9O1xuXG4gIC8vIFNob3J0Y3V0IGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gcHJvcGVydHkgZGlyZWN0bHlcbiAgLy8gb24gaXRzZWxmIChpbiBvdGhlciB3b3Jkcywgbm90IG9uIGEgcHJvdG90eXBlKS5cbiAgXy5oYXMgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbiAgfTtcblxuICAvLyBVdGlsaXR5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJ1biBVbmRlcnNjb3JlLmpzIGluICpub0NvbmZsaWN0KiBtb2RlLCByZXR1cm5pbmcgdGhlIGBfYCB2YXJpYWJsZSB0byBpdHNcbiAgLy8gcHJldmlvdXMgb3duZXIuIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICByb290Ll8gPSBwcmV2aW91c1VuZGVyc2NvcmU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gS2VlcCB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gYXJvdW5kIGZvciBkZWZhdWx0IGl0ZXJhdG9ycy5cbiAgXy5pZGVudGl0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIF8uY29uc3RhbnQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgfTtcblxuICBfLnByb3BlcnR5ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIHByZWRpY2F0ZSBmb3IgY2hlY2tpbmcgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLm1hdGNoZXMgPSBmdW5jdGlvbihhdHRycykge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIGlmIChvYmogPT09IGF0dHJzKSByZXR1cm4gdHJ1ZTsgLy9hdm9pZCBjb21wYXJpbmcgYW4gb2JqZWN0IHRvIGl0c2VsZi5cbiAgICAgIGZvciAodmFyIGtleSBpbiBhdHRycykge1xuICAgICAgICBpZiAoYXR0cnNba2V5XSAhPT0gb2JqW2tleV0pXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJ1biBhIGZ1bmN0aW9uICoqbioqIHRpbWVzLlxuICBfLnRpbWVzID0gZnVuY3Rpb24obiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgYWNjdW0gPSBBcnJheShNYXRoLm1heCgwLCBuKSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIGFjY3VtW2ldID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBpKTtcbiAgICByZXR1cm4gYWNjdW07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gYW5kIG1heCAoaW5jbHVzaXZlKS5cbiAgXy5yYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIGlmIChtYXggPT0gbnVsbCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG4gIH07XG5cbiAgLy8gQSAocG9zc2libHkgZmFzdGVyKSB3YXkgdG8gZ2V0IHRoZSBjdXJyZW50IHRpbWVzdGFtcCBhcyBhbiBpbnRlZ2VyLlxuICBfLm5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7IH07XG5cbiAgLy8gTGlzdCBvZiBIVE1MIGVudGl0aWVzIGZvciBlc2NhcGluZy5cbiAgdmFyIGVudGl0eU1hcCA9IHtcbiAgICBlc2NhcGU6IHtcbiAgICAgICcmJzogJyZhbXA7JyxcbiAgICAgICc8JzogJyZsdDsnLFxuICAgICAgJz4nOiAnJmd0OycsXG4gICAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICAgIFwiJ1wiOiAnJiN4Mjc7J1xuICAgIH1cbiAgfTtcbiAgZW50aXR5TWFwLnVuZXNjYXBlID0gXy5pbnZlcnQoZW50aXR5TWFwLmVzY2FwZSk7XG5cbiAgLy8gUmVnZXhlcyBjb250YWluaW5nIHRoZSBrZXlzIGFuZCB2YWx1ZXMgbGlzdGVkIGltbWVkaWF0ZWx5IGFib3ZlLlxuICB2YXIgZW50aXR5UmVnZXhlcyA9IHtcbiAgICBlc2NhcGU6ICAgbmV3IFJlZ0V4cCgnWycgKyBfLmtleXMoZW50aXR5TWFwLmVzY2FwZSkuam9pbignJykgKyAnXScsICdnJyksXG4gICAgdW5lc2NhcGU6IG5ldyBSZWdFeHAoJygnICsgXy5rZXlzKGVudGl0eU1hcC51bmVzY2FwZSkuam9pbignfCcpICsgJyknLCAnZycpXG4gIH07XG5cbiAgLy8gRnVuY3Rpb25zIGZvciBlc2NhcGluZyBhbmQgdW5lc2NhcGluZyBzdHJpbmdzIHRvL2Zyb20gSFRNTCBpbnRlcnBvbGF0aW9uLlxuICBfLmVhY2goWydlc2NhcGUnLCAndW5lc2NhcGUnXSwgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgX1ttZXRob2RdID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICBpZiAoc3RyaW5nID09IG51bGwpIHJldHVybiAnJztcbiAgICAgIHJldHVybiAoJycgKyBzdHJpbmcpLnJlcGxhY2UoZW50aXR5UmVnZXhlc1ttZXRob2RdLCBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgICByZXR1cm4gZW50aXR5TWFwW21ldGhvZF1bbWF0Y2hdO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gSWYgdGhlIHZhbHVlIG9mIHRoZSBuYW1lZCBgcHJvcGVydHlgIGlzIGEgZnVuY3Rpb24gdGhlbiBpbnZva2UgaXQgd2l0aCB0aGVcbiAgLy8gYG9iamVjdGAgYXMgY29udGV4dDsgb3RoZXJ3aXNlLCByZXR1cm4gaXQuXG4gIF8ucmVzdWx0ID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICB2YXIgdmFsdWUgPSBvYmplY3RbcHJvcGVydHldO1xuICAgIHJldHVybiBfLmlzRnVuY3Rpb24odmFsdWUpID8gdmFsdWUuY2FsbChvYmplY3QpIDogdmFsdWU7XG4gIH07XG5cbiAgLy8gQWRkIHlvdXIgb3duIGN1c3RvbSBmdW5jdGlvbnMgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEdlbmVyYXRlIGEgdW5pcXVlIGludGVnZXIgaWQgKHVuaXF1ZSB3aXRoaW4gdGhlIGVudGlyZSBjbGllbnQgc2Vzc2lvbikuXG4gIC8vIFVzZWZ1bCBmb3IgdGVtcG9yYXJ5IERPTSBpZHMuXG4gIHZhciBpZENvdW50ZXIgPSAwO1xuICBfLnVuaXF1ZUlkID0gZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgdmFyIGlkID0gKytpZENvdW50ZXIgKyAnJztcbiAgICByZXR1cm4gcHJlZml4ID8gcHJlZml4ICsgaWQgOiBpZDtcbiAgfTtcblxuICAvLyBCeSBkZWZhdWx0LCBVbmRlcnNjb3JlIHVzZXMgRVJCLXN0eWxlIHRlbXBsYXRlIGRlbGltaXRlcnMsIGNoYW5nZSB0aGVcbiAgLy8gZm9sbG93aW5nIHRlbXBsYXRlIHNldHRpbmdzIHRvIHVzZSBhbHRlcm5hdGl2ZSBkZWxpbWl0ZXJzLlxuICBfLnRlbXBsYXRlU2V0dGluZ3MgPSB7XG4gICAgZXZhbHVhdGUgICAgOiAvPCUoW1xcc1xcU10rPyklPi9nLFxuICAgIGludGVycG9sYXRlIDogLzwlPShbXFxzXFxTXSs/KSU+L2csXG4gICAgZXNjYXBlICAgICAgOiAvPCUtKFtcXHNcXFNdKz8pJT4vZ1xuICB9O1xuXG4gIC8vIFdoZW4gY3VzdG9taXppbmcgYHRlbXBsYXRlU2V0dGluZ3NgLCBpZiB5b3UgZG9uJ3Qgd2FudCB0byBkZWZpbmUgYW5cbiAgLy8gaW50ZXJwb2xhdGlvbiwgZXZhbHVhdGlvbiBvciBlc2NhcGluZyByZWdleCwgd2UgbmVlZCBvbmUgdGhhdCBpc1xuICAvLyBndWFyYW50ZWVkIG5vdCB0byBtYXRjaC5cbiAgdmFyIG5vTWF0Y2ggPSAvKC4pXi87XG5cbiAgLy8gQ2VydGFpbiBjaGFyYWN0ZXJzIG5lZWQgdG8gYmUgZXNjYXBlZCBzbyB0aGF0IHRoZXkgY2FuIGJlIHB1dCBpbnRvIGFcbiAgLy8gc3RyaW5nIGxpdGVyYWwuXG4gIHZhciBlc2NhcGVzID0ge1xuICAgIFwiJ1wiOiAgICAgIFwiJ1wiLFxuICAgICdcXFxcJzogICAgICdcXFxcJyxcbiAgICAnXFxyJzogICAgICdyJyxcbiAgICAnXFxuJzogICAgICduJyxcbiAgICAnXFx0JzogICAgICd0JyxcbiAgICAnXFx1MjAyOCc6ICd1MjAyOCcsXG4gICAgJ1xcdTIwMjknOiAndTIwMjknXG4gIH07XG5cbiAgdmFyIGVzY2FwZXIgPSAvXFxcXHwnfFxccnxcXG58XFx0fFxcdTIwMjh8XFx1MjAyOS9nO1xuXG4gIC8vIEphdmFTY3JpcHQgbWljcm8tdGVtcGxhdGluZywgc2ltaWxhciB0byBKb2huIFJlc2lnJ3MgaW1wbGVtZW50YXRpb24uXG4gIC8vIFVuZGVyc2NvcmUgdGVtcGxhdGluZyBoYW5kbGVzIGFyYml0cmFyeSBkZWxpbWl0ZXJzLCBwcmVzZXJ2ZXMgd2hpdGVzcGFjZSxcbiAgLy8gYW5kIGNvcnJlY3RseSBlc2NhcGVzIHF1b3RlcyB3aXRoaW4gaW50ZXJwb2xhdGVkIGNvZGUuXG4gIF8udGVtcGxhdGUgPSBmdW5jdGlvbih0ZXh0LCBkYXRhLCBzZXR0aW5ncykge1xuICAgIHZhciByZW5kZXI7XG4gICAgc2V0dGluZ3MgPSBfLmRlZmF1bHRzKHt9LCBzZXR0aW5ncywgXy50ZW1wbGF0ZVNldHRpbmdzKTtcblxuICAgIC8vIENvbWJpbmUgZGVsaW1pdGVycyBpbnRvIG9uZSByZWd1bGFyIGV4cHJlc3Npb24gdmlhIGFsdGVybmF0aW9uLlxuICAgIHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChbXG4gICAgICAoc2V0dGluZ3MuZXNjYXBlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5pbnRlcnBvbGF0ZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuZXZhbHVhdGUgfHwgbm9NYXRjaCkuc291cmNlXG4gICAgXS5qb2luKCd8JykgKyAnfCQnLCAnZycpO1xuXG4gICAgLy8gQ29tcGlsZSB0aGUgdGVtcGxhdGUgc291cmNlLCBlc2NhcGluZyBzdHJpbmcgbGl0ZXJhbHMgYXBwcm9wcmlhdGVseS5cbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzb3VyY2UgPSBcIl9fcCs9J1wiO1xuICAgIHRleHQucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbihtYXRjaCwgZXNjYXBlLCBpbnRlcnBvbGF0ZSwgZXZhbHVhdGUsIG9mZnNldCkge1xuICAgICAgc291cmNlICs9IHRleHQuc2xpY2UoaW5kZXgsIG9mZnNldClcbiAgICAgICAgLnJlcGxhY2UoZXNjYXBlciwgZnVuY3Rpb24obWF0Y2gpIHsgcmV0dXJuICdcXFxcJyArIGVzY2FwZXNbbWF0Y2hdOyB9KTtcblxuICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGVzY2FwZSArIFwiKSk9PW51bGw/Jyc6Xy5lc2NhcGUoX190KSkrXFxuJ1wiO1xuICAgICAgfVxuICAgICAgaWYgKGludGVycG9sYXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgaW50ZXJwb2xhdGUgKyBcIikpPT1udWxsPycnOl9fdCkrXFxuJ1wiO1xuICAgICAgfVxuICAgICAgaWYgKGV2YWx1YXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIic7XFxuXCIgKyBldmFsdWF0ZSArIFwiXFxuX19wKz0nXCI7XG4gICAgICB9XG4gICAgICBpbmRleCA9IG9mZnNldCArIG1hdGNoLmxlbmd0aDtcbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcbiAgICBzb3VyY2UgKz0gXCInO1xcblwiO1xuXG4gICAgLy8gSWYgYSB2YXJpYWJsZSBpcyBub3Qgc3BlY2lmaWVkLCBwbGFjZSBkYXRhIHZhbHVlcyBpbiBsb2NhbCBzY29wZS5cbiAgICBpZiAoIXNldHRpbmdzLnZhcmlhYmxlKSBzb3VyY2UgPSAnd2l0aChvYmp8fHt9KXtcXG4nICsgc291cmNlICsgJ31cXG4nO1xuXG4gICAgc291cmNlID0gXCJ2YXIgX190LF9fcD0nJyxfX2o9QXJyYXkucHJvdG90eXBlLmpvaW4sXCIgK1xuICAgICAgXCJwcmludD1mdW5jdGlvbigpe19fcCs9X19qLmNhbGwoYXJndW1lbnRzLCcnKTt9O1xcblwiICtcbiAgICAgIHNvdXJjZSArIFwicmV0dXJuIF9fcDtcXG5cIjtcblxuICAgIHRyeSB7XG4gICAgICByZW5kZXIgPSBuZXcgRnVuY3Rpb24oc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaicsICdfJywgc291cmNlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEpIHJldHVybiByZW5kZXIoZGF0YSwgXyk7XG4gICAgdmFyIHRlbXBsYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIHJlbmRlci5jYWxsKHRoaXMsIGRhdGEsIF8pO1xuICAgIH07XG5cbiAgICAvLyBQcm92aWRlIHRoZSBjb21waWxlZCBmdW5jdGlvbiBzb3VyY2UgYXMgYSBjb252ZW5pZW5jZSBmb3IgcHJlY29tcGlsYXRpb24uXG4gICAgdGVtcGxhdGUuc291cmNlID0gJ2Z1bmN0aW9uKCcgKyAoc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaicpICsgJyl7XFxuJyArIHNvdXJjZSArICd9JztcblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfTtcblxuICAvLyBBZGQgYSBcImNoYWluXCIgZnVuY3Rpb24sIHdoaWNoIHdpbGwgZGVsZWdhdGUgdG8gdGhlIHdyYXBwZXIuXG4gIF8uY2hhaW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXyhvYmopLmNoYWluKCk7XG4gIH07XG5cbiAgLy8gT09QXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuICAvLyBJZiBVbmRlcnNjb3JlIGlzIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLCBpdCByZXR1cm5zIGEgd3JhcHBlZCBvYmplY3QgdGhhdFxuICAvLyBjYW4gYmUgdXNlZCBPTy1zdHlsZS4gVGhpcyB3cmFwcGVyIGhvbGRzIGFsdGVyZWQgdmVyc2lvbnMgb2YgYWxsIHRoZVxuICAvLyB1bmRlcnNjb3JlIGZ1bmN0aW9ucy4gV3JhcHBlZCBvYmplY3RzIG1heSBiZSBjaGFpbmVkLlxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjb250aW51ZSBjaGFpbmluZyBpbnRlcm1lZGlhdGUgcmVzdWx0cy5cbiAgdmFyIHJlc3VsdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0aGlzLl9jaGFpbiA/IF8ob2JqKS5jaGFpbigpIDogb2JqO1xuICB9O1xuXG4gIC8vIEFkZCBhbGwgb2YgdGhlIFVuZGVyc2NvcmUgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyIG9iamVjdC5cbiAgXy5taXhpbihfKTtcblxuICAvLyBBZGQgYWxsIG11dGF0b3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBlYWNoKFsncG9wJywgJ3B1c2gnLCAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iaiA9IHRoaXMuX3dyYXBwZWQ7XG4gICAgICBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKChuYW1lID09ICdzaGlmdCcgfHwgbmFtZSA9PSAnc3BsaWNlJykgJiYgb2JqLmxlbmd0aCA9PT0gMCkgZGVsZXRlIG9ialswXTtcbiAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBvYmopO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEFkZCBhbGwgYWNjZXNzb3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBlYWNoKFsnY29uY2F0JywgJ2pvaW4nLCAnc2xpY2UnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgbWV0aG9kLmFwcGx5KHRoaXMuX3dyYXBwZWQsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH0pO1xuXG4gIF8uZXh0ZW5kKF8ucHJvdG90eXBlLCB7XG5cbiAgICAvLyBTdGFydCBjaGFpbmluZyBhIHdyYXBwZWQgVW5kZXJzY29yZSBvYmplY3QuXG4gICAgY2hhaW46IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fY2hhaW4gPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vIEV4dHJhY3RzIHRoZSByZXN1bHQgZnJvbSBhIHdyYXBwZWQgYW5kIGNoYWluZWQgb2JqZWN0LlxuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl93cmFwcGVkO1xuICAgIH1cblxuICB9KTtcblxuICAvLyBBTUQgcmVnaXN0cmF0aW9uIGhhcHBlbnMgYXQgdGhlIGVuZCBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIEFNRCBsb2FkZXJzXG4gIC8vIHRoYXQgbWF5IG5vdCBlbmZvcmNlIG5leHQtdHVybiBzZW1hbnRpY3Mgb24gbW9kdWxlcy4gRXZlbiB0aG91Z2ggZ2VuZXJhbFxuICAvLyBwcmFjdGljZSBmb3IgQU1EIHJlZ2lzdHJhdGlvbiBpcyB0byBiZSBhbm9ueW1vdXMsIHVuZGVyc2NvcmUgcmVnaXN0ZXJzXG4gIC8vIGFzIGEgbmFtZWQgbW9kdWxlIGJlY2F1c2UsIGxpa2UgalF1ZXJ5LCBpdCBpcyBhIGJhc2UgbGlicmFyeSB0aGF0IGlzXG4gIC8vIHBvcHVsYXIgZW5vdWdoIHRvIGJlIGJ1bmRsZWQgaW4gYSB0aGlyZCBwYXJ0eSBsaWIsIGJ1dCBub3QgYmUgcGFydCBvZlxuICAvLyBhbiBBTUQgbG9hZCByZXF1ZXN0LiBUaG9zZSBjYXNlcyBjb3VsZCBnZW5lcmF0ZSBhbiBlcnJvciB3aGVuIGFuXG4gIC8vIGFub255bW91cyBkZWZpbmUoKSBpcyBjYWxsZWQgb3V0c2lkZSBvZiBhIGxvYWRlciByZXF1ZXN0LlxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCd1bmRlcnNjb3JlJywgW10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF87XG4gICAgfSk7XG4gIH1cbn0pLmNhbGwodGhpcyk7XG4iXX0=
