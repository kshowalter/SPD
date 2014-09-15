'use strict';
//var settings = require('./settings.js');
//var snapsvg = require('snapsvg');
//log(settings);
function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return [r, g, b];
}

var saveAs = require("../lib/FileSaver");
console.log(saveAs);
window.saveAs = saveAs;

var jsPDF = require("../lib/jspdf");

jsPDF.API.mytext = function(){

}

//var $ = require("jquery");
var $ = require('../lib/k/k_DOM');

//var svgElementToPdf = require("../lib/svgToPdf");
//var PDFDocument = require('pdfkit');
//window.saveAs = require("../lib/FileSaver.js");
//require("../lib/svgToPdf.js");
//console.log(svgElementToPdf)


var mk_pdf = function(settings){
    console.log('Making PDF');
    var title = settings.system.inverter.make + " " + settings.system.inverter.model + " Inverter System"; 

    var scale = settings.page.letter.scale;                        

    var l_attr = settings.drawing.l_attr;
    var fonts = settings.drawing.fonts;
    var elements = settings.elements;
    //console.log('elements: ', elements);
    //container.empty()

    //doc = new PDFDocument;
    //var doc = new PDFDocument;
    var doc = new jsPDF('l', 'in', 'letter');


    doc.setProperties({
        title: title,
        creator: 'FSEC'
    });
//    var x = 1;
//    var y = 2;
//    var width = 1.5;
//    var height = 2.75;
//    doc.setLineWidth(0.01);
//    doc.rect(x, y, width, height);
//    var c = doc.circle(5, 5, 1)
//    //c.fill("#6600FF");
//
    





    // Loop through all the drawing contents, call the function below.
    elements.forEach( function(elem,id) {
        show_elem_array(elem);
    });

    function show_elem_array(elem, offset){
        if( elem.layer_name !== undefined ){
            var layer_attr = l_attr[elem.layer_name];
            if( layer_attr.stroke !== undefined ) {
                var hex = layer_attr.stroke;
                if( hex.substring(0,1) ) hex = hex.substring(1);
                var color = hexToRgb(hex)
                //console.log(color)
            } else {
                console.log("no stroke")
            }
        } 


        var x,y;
        offset = offset || {x:0,y:0};
        if( typeof elem.x !== 'undefined' ) { x = elem.x + offset.x; } 
        if( typeof elem.y !== 'undefined' ) { y = elem.y + offset.y; } 

        if( elem.type === 'rect') {
            x = x * scale;
            y = y * scale;
            var w = elem.w * scale;
            var h = elem.h * scale;

            //Draw Rectangle
            doc.setLineWidth(0.005);
            doc.setDrawColor(0);
            doc.rect(x-w/2, y-h/2, w, h, 'D')

            
        } else if( elem.type === 'line') {
            var px,py,px_last,py_last;
            if( color !== undefined ) { doc.setDrawColor( color[0], color[1], color[2] ); }
            doc.setLineWidth(0.005);
            elem.points.forEach( function(point){
                if( ! isNaN(point[0]) && ! isNaN(point[1]) ){
                    px = (point[0]+offset.x)*scale;
                    py = (point[1]+offset.y)*scale;
                    if( px_last !== undefined ){
                        doc.line(px_last, py_last, px, py);
                    }
                    px_last = px;
                    py_last = py;
                } else {
                    console.log('error: elem not fully defined', elem)
                }
            });

            //var l = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
            //l.setAttribute( 'points', points2.join(' ') );
            //var attr = l_attr[elem.layer_name];
            //for( var i2 in attr ){
            //    l.setAttribute(i2, attr[i2]);
            //}
            //svg_elem.appendChild(l);
            //Adding a Line
            
        } else if( elem.type === 'text') {
            x = x * scale;
            y = y * scale;
            var font = fonts[elem.font];

            //var t = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            //t.setAttribute('x', x);
            //t.setAttribute('y', y );
            //if(elem.rotated){
            //    t.setAttribute('transform', "rotate(" + elem.rotated + " " + x + " " + y + ")" );
            //}
            //for( var i2 in l_attr[elem.layer_name] ){
            //    t.setAttribute( i2, l_attr[elem.layer_name][i2] );
            //}
            //for( var i2 in font ){
            //    t.setAttribute( i2, font[i2] );
            //}
            for( var i2 in elem.strings ){
                var text = elem.strings[i2];
                //var w = text.length * font['font-size']*1;
// temporary line centering aproximation
                var w = text.length * font['font-size']*0.66 * scale;

                var line_spacing = (font['font-size']*1.5*i2)*scale;
                //var w = doc.getStringUnitWidth(text);
            //    var tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
            //    tspan.setAttribute('dy', font['font-size']*1.5*i2 );
            //    tspan.setAttribute('x', x);
            //    tspan.innerHTML = elem.strings[i2];
            //    t.appendChild(tspan);
                doc.setFontSize(font['font-size']);
                //doc.text(text, x, y+(font['font-size']*1.5*i2), {align: "center"} );
                doc.text(text, x-w/2, y+line_spacing );
            }
            //svg_elem.appendChild(t);


        } else if( elem.type === 'circ') {
            x = x * scale;
            y = y * scale;
            var d = elem.d * scale;
            doc.setLineWidth(0.005);
            doc.setDrawColor(0);
            doc.circle(x, y, d/2, 'D');
            //var c = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
            //c.setAttribute('rx', elem.d/2);
            //c.setAttribute('ry', elem.d/2);
            //c.setAttribute('cx', x);
            //c.setAttribute('cy', y);
            //var attr = l_attr[elem.layer_name];
            //for( var i2 in attr ){
            //    c.setAttribute(i2, attr[i2]);
            //}
            //svg_elem.appendChild(c);
        } else if(elem.type === 'block') {
            // if it is a block, run this function through each element.
            elem.elements.forEach( function(block_elem,id){
                show_elem_array(block_elem, {x:x, y:y}) 
            });
        }
    }


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
