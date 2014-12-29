var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');

var page = function(settings){
    console.log("** Making page 1");

    var d = mk_drawing();



    var size = settings.drawing.size;
    var loc = settings.drawing.loc;
    var system = settings.system;

    var x, y, h, w, section_x, section_y;

    d.text(
        [size.drawing.w*1/2, size.drawing.h*1/3],
        [
            'Preview',
            'DEMO'
        ],
        'project title'
    );


    w = 15;
    h = 25;
    loc.preview.array.bottom = loc.preview.array.top + h*1.25*system.array.num_modules + h*3/4;
    loc.preview.array.right = loc.preview.array.left + w*1.25*system.array.num_strings + w;

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
            [ loc.preview.array.right , loc.preview.array.top ],
            [ loc.preview.array.right + 20 , loc.preview.array.top ],
        ]
    );
    // bottom array conduit
    d.line([
            [ loc.preview.array.left , loc.preview.array.bottom ],
            [ loc.preview.array.right , loc.preview.array.bottom ],
            [ loc.preview.array.right , loc.preview.array.top ],
        ]
    );

    d.layer('preview_DC');

    d.line([
            [ loc.preview.array.right + 20 , loc.preview.array.top ],
            [ loc.preview.array.right + 20 + 40 , loc.preview.array.top ],
        ]
    );

    return d.drawing_parts;
};



module.exports = page;
