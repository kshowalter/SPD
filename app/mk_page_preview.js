var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');

var page = function(settings){
    console.log("** Making page 1");

    var d = mk_drawing();



    var size = settings.drawing.size;
    var loc = settings.drawing.loc;
    var system = settings.system;

    var x, y, h, w, section_x, section_y;


    w = 15;
    h = 25;
    loc.preview.array.bottom = loc.preview.array.top + h*1.25*system.array.num_modules + h*3/4;
    loc.preview.array.right = loc.preview.array.left + w*1.25*system.array.num_strings + w*2;

    d.layer('preview_array');

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

    d.layer('preview_DC');
    loc.preview.DC.left = loc.preview.array.right;
    loc.preview.DC.right = loc.preview.DC.left + 200;
    loc.preview.DC.center = ( loc.preview.DC.right + loc.preview.DC.left )/2;

    y = y;
    w = 30;
    h = 50;
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
    d.text(
        [loc.preview.DC.center,y+h],
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
        'project title'
    );

    d.layer('preview_inverter');
    loc.preview.inverter.left = loc.preview.DC.right;
    loc.preview.inverter.right = loc.preview.inverter.left + 200;
    loc.preview.inverter.center = ( loc.preview.inverter.right + loc.preview.inverter.left )/2;

    y = y;
    w = 150;
    h = 75;
    d.line([
            [ loc.preview.inverter.left , y ],
            [ loc.preview.inverter.right, y ],
        ]
    );
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
        'project title'
    );



    d.layer('preview_AC');
    loc.preview.AC.left = loc.preview.inverter.right;
    loc.preview.AC.right = loc.preview.AC.left + 200;
    loc.preview.AC.center = ( loc.preview.AC.right + loc.preview.AC.left )/2;

    y = y;
    w = 30;
    h = 50;
    d.line([
            [ loc.preview.AC.left , y ],
            [ loc.preview.AC.right, y ],
        ]
    );
    d.rect(
        [loc.preview.AC.center,y],
        [w,h],
        'preview_AC_box'
    );
    d.text(
        [loc.preview.AC.center,y+h],
        [
            'AC',

        ],
        'project title'
    );


    return d.drawing_parts;
};



module.exports = page;
