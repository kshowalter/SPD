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

};


var PDFDocument = require('pdfkit');
var blobStream  = require('blob-stream');


var $ = require("jquery");

//var svgElementToPdf = require("../lib/svgToPdf");
//var PDFDocument = require('pdfkit');
//window.saveAs = require("../lib/FileSaver.js");
//require("../lib/svgToPdf.js");
//console.log(svgElementToPdf)
//





var mk_pdf = function(settings, callback){
    console.log('Making PDF');
    var title = settings.system.inverter.make + " " + settings.system.inverter.model + " Inverter System";

    var scale = settings.page.scale;

    var l_attr = settings.drawing.l_attr;
    var fonts = settings.drawing_settings.fonts;
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
    };
    var doc = new PDFDocument(doc_options);
    var stream = doc.pipe(blobStream());

    for( var id = 0; id<=90; id++){

    }
    //var doc = new jsPDF('l', 'in', 'letter');



    //doc.rotate(-90, [72, 72]).text('test',72*1,72*1);
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
    elements.forEach( function(elem,i) {
        show_elem_array(elem, null, i);
    });

    function show_elem_array(elem, offset, i){
        if( elem.layer_name !== undefined ){
            var layer_attr = l_attr[elem.layer_name];
            if( layer_attr.stroke !== undefined ) {
                var color = layer_attr.stroke;
                //console.log(color)
            } else {
                console.log("no stroke");
            }
        }

        //console.log(i)

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
            doc.lineWidth(0.5)
                .strokeColor(color)
                .rect(x-w/2, y-h/2, w, h, 'D')
                .stroke();

        } else if( elem.type === 'line') {
            var px,py,px_last,py_last;
            doc.lineWidth(0.05);
            doc.strokeColor(color);
            doc.lineCap('round');
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
                    console.log('error: elem not fully defined', elem);
                }
            });

            doc.stroke();

        } else if( elem.type === 'text') {
            var textList = elem.strings.slice(0);

            x = Number( (x * scale).toFixed(0) );
            y = Number( (y * scale).toFixed(0) );
            var font = fonts[elem.font];

            doc.fontSize(font['font-size']);

            if( x>=(settings.pages.PDF.w*0.8) ) x = 200;
            //if( x>=500 ) x = 200;
            if( y>=(settings.pages.PDF.h*0.8) ) y = 200;
            //if( y>=500 ) y = 200;
            //doc.moveTo( x, y );
            //console.log(textList);
            //doc.text( 'test', x,y);
            doc.text( textList.pop(), x, y);
            //for( var i2 in textList ){
            //    var text = textList[i2];
            //    doc.text( text, x, y);
            //    doc.moveDown();
            //}
            //doc.stroke()

            //console.log( textList.pop(), 72*2+i, 10*i, x, y );
            //doc.text('test '+i+' b', 72*2+i, 10*i);

        } else if( elem.type === 'circ') {
            x = x * scale;
            y = y * scale;
            var d = elem.d * scale;
            doc.lineWidth(0.005);
            doc.strokeColor(0);
            doc.fillColor(color);
            doc.circle(x, y, d/2, 'D');
            doc.stroke();
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
                show_elem_array(block_elem, {x:x, y:y} );
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
        var blob = stream.toBlob('application/pdf');

        // or get a blob URL for display in the browser
        var url = stream.toBlobURL('application/pdf');
        //iframe.src = url
        settings.PDF = {};
        settings.PDF.url = url;
        console.log(url);
        callback(settings);
    });


};


module.exports = mk_pdf;
