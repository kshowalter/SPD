var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');
var f = require('./functions');

var page = function(settings){
    console.log("** Making page 1");

    var d = mk_drawing();



    var size = settings.drawing.size;
    var loc = settings.drawing.loc;
    var system = settings.system;

    var x, y, h, w, section_x, section_y;

    w = size.preview.module.w;
    h = size.preview.module.h;
    loc.preview.array.bottom = loc.preview.array.top + h*1.25*system.array.num_modules + h*3/4;
    //loc.preview.array.right = loc.preview.array.left + w*1.25*system.array.num_strings + w*2;
    loc.preview.array.right = loc.preview.array.left + w*1.25*8 + w*2;

    loc.preview.inverter.center = 500 ;
    w = size.preview.inverter.w;
    loc.preview.inverter.left = loc.preview.inverter.center - w/2;
    loc.preview.inverter.right = loc.preview.inverter.center + w/2;

    loc.preview.DC.left = loc.preview.array.right;
    loc.preview.DC.right = loc.preview.inverter.left;
    loc.preview.DC.center = ( loc.preview.DC.right + loc.preview.DC.left )/2;

    loc.preview.AC.left = loc.preview.inverter.right;
    loc.preview.AC.right = loc.preview.AC.left + 300;
    loc.preview.AC.center = ( loc.preview.AC.right + loc.preview.AC.left )/2;



    if( f.section_defined('array') && f.section_defined('module') ){
        d.layer('preview_array');

        w = size.preview.module.w;
        h = size.preview.module.h;

        for( var s=0; s<system.array.num_strings; s++ ){
            x = loc.preview.array.left + w*1.25*s;
            // string wiring
            d.line([
                    [ x , loc.preview.array.top ],
                    [ x , loc.preview.array.bottom ],
                ]
            );
            // modules
            for( var m=0; m<system.array.num_modules; m++ ){
                y = loc.preview.array.top + h + h*1.25*m;
                // modules
                d.rect(
                    [ x , y ],
                    [w,h],
                    'preview_module'
                );
            }
        }

        // top array conduit
        d.line([
                [ loc.preview.array.left , loc.preview.array.top ],
                [ loc.preview.array.right - w, loc.preview.array.top ],
                [ loc.preview.array.right , loc.preview.array.top ],
            ]
        );
        // bottom array conduit
        d.line([
                [ loc.preview.array.left , loc.preview.array.bottom ],
                [ loc.preview.array.right - w , loc.preview.array.bottom ],
                [ loc.preview.array.right - w , loc.preview.array.top ],
            ]
        );

        y = loc.preview.array.top;

        d.text(
            [loc.preview.DC.center,y+size.preview.module.h],
            [
                'Array DC',
                'Strings: ' + system.array.num_strings,
                'Modules: ' + system.array.num_modules,
                'Pmp: ' + parseFloat(system.array.pmp).toFixed(),
                'Imp: ' + parseFloat(system.array.imp).toFixed(),
                'Vmp: ' + parseFloat(system.array.vmp).toFixed(),
                'Isc: ' + parseFloat(system.array.isc).toFixed(),
                'Voc: ' + parseFloat(system.array.voc).toFixed(),
            ],
            'preview text'
        );
    }

    if( f.section_defined('DC') ){
        d.layer('preview_DC');
console.log(loc.preview);
        y = y;
        w = size.preview.module.w;
        h = size.preview.module.h;

        d.line([
                [ loc.preview.DC.left , y ],
                [ loc.preview.DC.right, y ],
            ]
        );
        d.rect(
            [loc.preview.DC.center,y],
            [w,h],
            'preview_DC_box'
        );

    }

    if( f.section_defined('inverter') ){

        d.layer('preview_inverter');

        y = y;
        w = size.preview.inverter.w;
        h = size.preview.inverter.h;

        d.rect(
            [loc.preview.inverter.center,y],
            [w,h],
            'preview_inverter_box'
        );
        d.text(
            [loc.preview.inverter.center,y+h],
            [
                'Inverter',
                system.inverter.make,
                system.inverter.model,
            ],
            'preview text'
        );
    }

    if( f.section_defined('AC') ){

        d.layer('preview_AC');


        y = y;
        d.line([
                [ loc.preview.AC.left, y ],
                [ loc.preview.AC.right, y ],
            ]
        );
        w = size.preview.AC.w;
        h = size.preview.AC.h;
        d.rect(
            [loc.preview.AC.center,y],
            [w,h],
            'preview_AC_box'
        );
        w = size.preview.loadcenter.w;
        h = size.preview.loadcenter.h;
        d.rect(
            [ loc.preview.AC.right-w/2, y+h/4 ],
            [w,h],
            'preview_AC_box'
        );

        d.text(
            [loc.preview.AC.center,y+h],
            [
                'AC',

            ],
            'preview text'
        );

    }

    return d.drawing_parts;
};



module.exports = page;