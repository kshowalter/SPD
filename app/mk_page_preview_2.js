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

        var x, y, h, w, section_x, section_y, length_p;

        var angle = system.roof.angle.split(', ')[1];
        angle_rad = angle * (Math.PI/180);


        length_p = system.roof.length * Math.cos(angle_rad);
        h = system.roof.length * Math.sin(angle_rad);

        var roof_ratio = system.roof.length / system.roof.width;
        var roof_plan_ratio = length_p / system.roof.width;

        if( system.roof.type === "Gable"){

            ////////
            // roof crossection

            var cs_x = 500;
            var cs_y = 30;
            var cs_h = 100;
            var cs_w = 100;
            d.line([
                    [cs_x+cs_w,   cs_y],
                    [cs_x+cs_w,   cs_y+cs_h],
                ],
                "preview_structural_dot"
            );
            d.line([
                    [cs_x+cs_w,   cs_y],
                    [cs_x+cs_w*2, cs_y+cs_h],
                    [cs_x,        cs_y+cs_h],
                    [cs_x+cs_w,   cs_y],
                ],
                "preview_structural"
            );
            d.text(
                [cs_x+cs_w-15, cs_y+cs_h*2/3],
                "h",
                'dimention'
            );
            d.text(
                [cs_x+cs_w+20, cs_y+cs_h*2/3],
                parseFloat( h ).toFixed().toString(),
                'dimention'
            );
            d.text(
                [cs_x+cs_w*1.5+20, cs_y+cs_h/3],
                "l:" + parseFloat( system.roof.length ).toFixed().toString(),
                'dimention'
            );


            ///////
            // Rood plan view
            var plan_x = 30;
            var plan_y = 30;

            var plan_w, plan_h;
            if( length_p*2 > system.roof.width ){
                plan_w = 250;
                plan_h = plan_w / (length_p*2 / system.roof.width);
            } else {
                plan_h = 250;
                plan_w = plan_h * (length_p*2 / system.roof.width);
            }

            d.rect(
                [plan_x+plan_w/2, plan_y+plan_h/2],
                [plan_w, plan_h],
                "preview_structural"
            );
            d.line([
                    [plan_x+plan_w/2, plan_y],
                    [plan_x+plan_w/2, plan_y+plan_h]
                ],
                "preview_structural_dot"
            );

            /*
            d.text(
                [plan_x-20, plan_y+plan_h/2],
                system.roof.length.toString(),
                'dimention'
            );
            */

            d.text(
                [plan_x+plan_w+20, plan_y+plan_h/2],
                system.roof.width.toString(),
                'dimention'
            );

//*/
        }



        /*




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


        //*/

    }

    return d.drawing_parts;
};



module.exports = page;
