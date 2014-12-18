var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');

var page = function(settings){
    console.log("** Making page 1");

    var d = mk_drawing();

    var sheet_section = 'A';
    var sheet_num = '01';
    d.append(mk_border(settings, sheet_section, sheet_num ));

    var size = settings.drawing.size;
    var loc = settings.drawing.loc;

    d.text(
        [size.drawing.w/2, size.drawing.h/2],
        'Title Sheet',
        'title2'
    );

    /*
    d.text([size.drawing.w/3,size.drawing.h/3], 'X', 'table');
    d.rect([size.drawing.w/3-5,size.drawing.h/3-5],[10,10],'box');

    var t = d.table(5,7).loc(size.drawing.w/3, size.drawing.h/3);
    console.log(t);
    t.cell(1,1).border('all').text('cell 1,1');
    t.cell(2,2).border('all').text('cell 2,2');
    t.cell(3,3).border('all').text('cell 3,3');
    t.cell(4,4).border('all').text('cell 4,4');
    t.cell(5,5).border('all').text('cell 5,5');



    t.cell(4,6).border('all').text('cell 4,6');
    t.cell(4,7).border('all').text('cell 4,7');
    t.cell(5,6).border('all').text('cell 5,6');
    t.cell(5,7).border('all').text('cell 5,7');


    var parts = t.mk();
    console.log(parts);
    //*/

    return d.drawing_parts;
};



module.exports = page;
