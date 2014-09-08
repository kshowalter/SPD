'use strict';
//var settings = require('./settings.js');
//var snapsvg = require('snapsvg');
//log(settings);

var saveAs = require("../lib/FileSaver");
console.log(saveAs);
window.saveAs = saveAs;

var jsPDF = require("../lib/jspdf");

//var $ = require("jquery");
var $ = require('../lib/k/k_DOM');

//var svgElementToPdf = require("../lib/svgToPdf");
//var PDFDocument = require('pdfkit');
//window.saveAs = require("../lib/FileSaver.js");
//require("../lib/svgToPdf.js");
//console.log(svgElementToPdf)


var mk_pdf = function(settings){
    console.log('Making PDF');

    var l_attr = settings.drawing.l_attr;
    var fonts = settings.drawing.fonts;
    var elements = settings.elements;
    //console.log('elements: ', elements);
    //container.empty()

    //doc = new PDFDocument;
    //var doc = new PDFDocument;
    var doc = new jsPDF('l', 'in', 'letter');


//    var x = 1;
//    var y = 2;
//    var width = 1.5;
//    var height = 2.75;
//    doc.setLineWidth(0.01);
//    doc.rect(x, y, width, height);
//    var c = doc.circle(5, 5, 1)
//    //c.fill("#6600FF");
//
    





//    // Loop through all the drawing contents, call the function below.
//    elements.forEach( function(elem,id) {
//        show_elem_array(elem);
//    });
//
//    function show_elem_array(elem, offset){
//        offset = offset || {x:0,y:0};
//        if( typeof elem.x !== 'undefined' ) { var x = elem.x + offset.x; } 
//        if( typeof elem.y !== 'undefined' ) { var y = elem.y + offset.y; } 
//
//        if( elem.type === 'rect') {
//
//            doc.rect(x-elem.w/2, y-elem.h/2, elem.w, elem.h )
//
//            
//        } else if( elem.type === 'line') {
//            var points2 = [];
//            elem.points.forEach( function(point){
//                if( ! isNaN(point[0]) && ! isNaN(point[1]) ){
//                    points2.push([ point[0]+offset.x, point[1]+offset.y ]);
//                } else {
//                    console.log('error: elem not fully defined', elem)
//                }
//            });
//            //svg.polyline( points2 ).attr( l_attr[elem.layer_name] );
//
//            var l = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
//            l.setAttribute( 'points', points2.join(' ') );
//            var attr = l_attr[elem.layer_name];
//            for( var i2 in attr ){
//                l.setAttribute(i2, attr[i2]);
//            }
//            svg_elem.appendChild(l);
//        } else if( elem.type === 'text') {
//            //var t = svg.text( elem.strings ).move( elem.points[0][0], elem.points[0][1] ).attr( l_attr[elem.layer_name] )
//            var font = fonts[elem.font];
//
//            var t = document.createElementNS("http://www.w3.org/2000/svg", 'text');
//            t.setAttribute('x', x);
//            //t.setAttribute('y', y + font['font-size']/2 );
//            t.setAttribute('y', y );
//            if(elem.rotated){
//                //t.setAttribute('transform', "rotate(" + elem.rotated + " " + x + " " + y + ")" );
//                t.setAttribute('transform', "rotate(" + elem.rotated + " " + x + " " + y + ")" );
//            }
//            for( var i2 in l_attr[elem.layer_name] ){
//                t.setAttribute( i2, l_attr[elem.layer_name][i2] );
//            }
//            for( var i2 in font ){
//                t.setAttribute( i2, font[i2] );
//            }
//            for( var i2 in elem.strings ){
//                var tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
//                tspan.setAttribute('dy', font['font-size']*1.5*i2 );
//                tspan.setAttribute('x', x);
//                tspan.innerHTML = elem.strings[i2];
//                t.appendChild(tspan);
//            }
//            svg_elem.appendChild(t);
//        } else if( elem.type === 'circ') {
//            var c = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
//            c.setAttribute('rx', elem.d/2);
//            c.setAttribute('ry', elem.d/2);
//            c.setAttribute('cx', x);
//            c.setAttribute('cy', y);
//            var attr = l_attr[elem.layer_name];
//            for( var i2 in attr ){
//                c.setAttribute(i2, attr[i2]);
//            }
//            svg_elem.appendChild(c);
//        } else if(elem.type === 'block') {
//            // if it is a block, run this function through each element.
//            elem.elements.forEach( function(block_elem,id){
//                show_elem_array(block_elem, {x:x, y:y}) 
//            });
//        }
//    }


    console.log(doc);
    //doc.save("drawing.pdf");
    //doc.output('datauri');
    var url = doc.output('datauristring');
    console.log(url);
    
    var link = $('a').href('Download').href(url);
    console.log(link)
    
    return link;
};


module.exports = mk_pdf;
