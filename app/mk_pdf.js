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


var PDFDocument = require('pdfkit');
var blobStream  = require('blob-stream');


//var $ = require("jquery");
var $ = require('../lib/k/k_DOM');

//var svgElementToPdf = require("../lib/svgToPdf");
//var PDFDocument = require('pdfkit');
//window.saveAs = require("../lib/FileSaver.js");
//require("../lib/svgToPdf.js");
//console.log(svgElementToPdf)
//
var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl. Suspendisse rhoncus nisl posuere tortor tempus et dapibus elit porta. Cras leo neque, elementum a rhoncus ut, vestibulum non nibh. Phasellus pretium justo turpis. Etiam vulputate, odio vitae tincidunt ultricies, eros odio dapibus nisi, ut tincidunt lacus arcu eu elit.  Aenean velit erat, vehicula eget lacinia ut, dignissim non tellus.  Aliquam nec lacus mi, sed vestibulum nunc. Suspendisse potenti. Curabitur vitae sem turpis.  Vestibulum sed neque eget dolor dapibus porttitor at sit amet sem.  Fusce a turpis lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris at ante tellus.  Vestibulum a metus lectus. Praesent tempor purus a lacus blandit eget gravida ante hendrerit. Cras et eros metus. Sed commodo malesuada eros, vitae interdum augue semper quis. Fusce id magna nunc.  Curabitur sollicitudin placerat semper. Cras et mi neque, a dignissim risus. Nulla venenatis porta lacus, vel rhoncus lectus tempor vitae. Duis sagittis venenatis rutrum. Curabitur tempor massa"; 






var mk_pdf = function(settings, callback){
    console.log('Making PDF');
    var title = settings.system.inverter.make + " " + settings.system.inverter.model + " Inverter System"; 

    var scale = settings.page.scale;                        

    var l_attr = settings.drawing.l_attr;
    var fonts = settings.drawing.fonts;
    var elements = settings.elements;
    //console.log('elements: ', elements);
    //container.empty()

    //doc = new PDFDocument;
    //var doc = new PDFDocument;
    //var doc = new PDFDocument( {size: [settings.page.w, settings.page.h], info:{Title: title, Creator: 'FSEC'}});
    //var doc = new PDFDocument( {size: [settings.page.w, settings.page.h]} );

    var doc_options = {
        size: 'letter',
        layout: 'landscape',
        info: {
            Title: 'PV drawing',
            Author: 'FSEC',
        }
    }
    var doc = new PDFDocument(doc_options);
    var stream = doc.pipe(blobStream());

    //var doc = new jsPDF('l', 'in', 'letter');




    console.log(doc)
    //doc.rotate(-90, [72, 72]).text('test',72*1,72*1);
    //doc.text('test',72*2,72*2);
    //doc.text('test',72*3,72*3).rotate(-90, [72*3, 72*3]);

    //doc.rotate(20)
    //    .text('wrapped text...', 100, 300)
    //    .font('Times-Roman', 13)
    //    .moveDown()
    //    .text(lorem, {
    //        width: 412,
    //        align: 'justify',
    //        indent: 30,
    //        columns: 2,
    //        height: 300,
    //        ellipsis: true
    //    });


//    doc.setProperties({
//        title: title,
//        creator: 'FSEC'
//    });
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
                var color = layer_attr.stroke;
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
            doc.lineWidth(0.005)
                .strokeColor(layer_attr.stroke)
                .rect(x-w/2, y-h/2, w, h, 'D')
                .stroke()

            
        } else if( elem.type === 'line') {
            var px,py,px_last,py_last;
            if( color !== undefined ) { doc.strokeColor( color[0], color[1], color[2] ); }
            doc.lineWidth(1);
            elem.points.forEach( function(point){
                if( ! isNaN(point[0]) && ! isNaN(point[1]) ){
                    px = (point[0]+offset.x)*scale;
                    py = (point[1]+offset.y)*scale;
                    if( px_last !== undefined ){
                        doc.moveTo(px_last, py_last);
                        doc.lineTo(px, py);
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

            doc.moveTo( x, y );
            doc.fontSize(font['font-size']);

            for( var i2 in elem.strings ){
                var text = elem.strings[i2];
                //doc.text(text, x, y+(font['font-size']*1.5*i2), {align: "center"} );
                doc.text( text );
                doc.moveDown();
            }
            //svg_elem.appendChild(t);


        } else if( elem.type === 'circ') {
            x = x * scale;
            y = y * scale;
            var d = elem.d * scale;
            doc.lineWidth(0.005);
            doc.strokeColor(0);
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

    //console.log(doc);
    //doc.save("drawing.pdf");
    //doc.output('datauri');
    //var url = doc.output('datauristring');
    //console.log(url);
    
    //var link = $('a').href('Download').href(url);
    //console.log(link)
    
    //return link;





    doc.end();
    stream.on('finish', function(){
        // get a blob you can do whatever you like with
        var blob = stream.toBlob('application/pdf')

        // or get a blob URL for display in the browser
        var url = stream.toBlobURL('application/pdf')
        //iframe.src = url
        settings.PDF = {};
        settings.PDF.url = url;
        
        callback(settings);
    });


};


module.exports = mk_pdf;
