var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');

var page = function(settings, sheet_info){
    console.log("** Making page "+sheet_info.num);

    //var page_maker = require()

    var d = mk_drawing(settings);

    d.append(mk_border(settings, sheet_info ));



    if( settings.f.mk_sheet_num[sheet_info.num] !== undefined ){
        //console.log('Sheet defined');
        d.append( settings.f.mk_sheet_num[sheet_info.num](settings) );
        d.append( settings.f.mk_sheet_num[sheet_info.num](settings) );
    } else {
        console.log('Error: Sheet not defined');
    }

    return d.drawing_parts;
};



module.exports = page;
