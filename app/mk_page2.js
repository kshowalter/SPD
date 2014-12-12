var mk_drawing = require('./mk_drawing');

var page2 = function(settings){
    console.log("** Making page 2");

    d = mk_drawing();

    var size = settings.drawing.size;
    var loc = settings.drawing.loc;


    d.text(
        [size.drawing.w/2, size.drawing.h/2],
        'Page 2',
        'title2'
    );

    return d.drawing_parts;
};



module.exports = page2;
