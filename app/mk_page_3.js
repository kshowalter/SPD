var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');

var page = function(settings){
    console.log("** Making page 3");

    d = mk_drawing();

    var sheet_section = 'PV';
    var sheet_num = '02';
    d.append(mk_border(settings, sheet_section, sheet_num ));

    var size = settings.drawing.size;
    var loc = settings.drawing.loc;


    d.text(
        [size.drawing.w/2, size.drawing.h/2],
        'Calculation Sheet',
        'title2'
    );

    return d.drawing_parts;
};



module.exports = page;
