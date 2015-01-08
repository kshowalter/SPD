var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');
var f = require('./functions');

var page = function(settings){
    console.log("** Making page 1");

    var d = mk_drawing();


        if( f.section_defined('DC') ){

        var size = settings.drawing.size;
        var loc = settings.drawing.loc;
        var system = settings.system;

        var x, y, h, w, section_x, section_y;

        var angle = system.roof.angle.split(', ')[1];
        angle_rad = angle * (Math.PI/180);
        w = system.roof.width  * 15;
        h = system.roof.height * 15;

        var dx = h * Math.cos(angle_rad)
        var dy = h * Math.sin(angle_rad)

        x = 50
        y = 100;

        y += h;

        d.line([
            [x,    y],
            [x+dx, y-dy],
            [x+dx, y],
            [x,    y],
            ]
        );

        d.text(
            [x+dx/2-10, y-dy/2-20],
            system.roof.height.toString(),
            'dimention'
        );
        d.text(
            [x+dx/2+5, y-15],
            angle.toString(),
            'dimention'
        );


        x = x+dx+100;
        y = y;

        d.rect(
            [x+w/2,y-h/2],
            [w,h]
        );

        d.text(
            [x-20, y-h/2],
            system.roof.height.toString(),
            'dimention'
        );

        d.text(
            [x+w/2, y+20],
            system.roof.width.toString(),
            'dimention'
        );


    }

    return d.drawing_parts;
};



module.exports = page;
