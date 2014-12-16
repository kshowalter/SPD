var mk_drawing = require('./mk_drawing');

var page = function(settings){
    console.log("** Making page 1");

    d = mk_drawing();

    var size = settings.drawing.size;
    var loc = settings.drawing.loc;

    d.text(
        [size.drawing.w/2, size.drawing.h/2],
        'Page 1',
        'title2'
    );

    var t = d.table(3,5);
    //t.cell(1,1).text('cell 1,1');

    console.log(t);

    return d.drawing_parts;
};



module.exports = page;
