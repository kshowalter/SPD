var mk_drawing = require('../mk_drawing');
var mk_border = require('../mk_border');

var page = function(settings){
    console.log("** Making page 1");

    var d = mk_drawing(settings);

    var sheet_section = 'A';
    var sheet_num = '00';
    //d.append(mk_border(settings, sheet_section, sheet_num ));

    var size = settings.drawing_settings.size;
    var loc = settings.drawing_settings.loc;

    var x, y, h, w;
    d.layer('text');
    d.text(
        [size.drawing.w*1/2, size.drawing.h*1/3],
        [
            'PV System Design',
        ],
        null,
        'project title'
    );

    if( settings.f.section_defined(settings, 'location')  ){
        d.text(
            [size.drawing.w*1/2, size.drawing.h*1/3 +30],
            [
                settings.perm.location.address,
                settings.perm.location.city + ', ' + settings.perm.location.county + ', FL, ' + settings.perm.location.zip,
            ],
            null,
            'project title'
        );
    }
    var n_rows = settings.drawing_settings.sheets.length;
    var n_cols = 2;
    w = 400+80;
    h = n_rows*20;
    x = size.drawing.frame_padding*6;
    y = size.drawing.h - size.drawing.frame_padding - size.drawing.titlebox.bottom.h;
    y += -20 * n_rows;
    y += -40; // the last number is the gap to the title box
    d.text( [x+w/2, y-20], 'Contents', null, 'table_large' );

    var t = d.table(n_rows,n_cols).loc(x,y);
    t.row_size('all', 20).col_size(2, 400).col_size(1, 80);

    settings.drawing_settings.sheets.forEach(function(sheet,i){
        console.log(sheet,i);
        t.cell(i+1,1).text(sheet.num);
        t.cell(i+1,2).text(sheet.desc);

    });


    t.all_cells().forEach(function(cell){
        cell.font('table_large_left').border('all');
    });

    t.mk();

    /*
    console.log(table_parts);
    d.append(table_parts);
    d.text([size.drawing.w/3,size.drawing.h/3], 'X', 'table');
    d.rect([size.drawing.w/3-5,size.drawing.h/3-5],[10,10],'box');

    t.cell(2,2).border('all').text('cell 2,2');
    t.cell(3,3).border('all').text('cell 3,3');
    t.cell(4,4).border('all').text('cell 4,4');
    t.cell(5,5).border('all').text('cell 5,5');



    t.cell(4,6).border('all').text('cell 4,6');
    t.cell(4,7).border('all').text('cell 4,7');
    t.cell(5,6).border('all').text('cell 5,6');
    t.cell(5,7).border('all').text('cell 5,7');


    //*/

    return d.drawing_parts;
};



module.exports = page;
