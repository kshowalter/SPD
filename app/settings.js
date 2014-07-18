var log = console.log.bind(console);
var k = require('../lib/k/k.js')
var loadTables = require('./settings_functions').loadTables;
var loadModules = require('./settings_functions').loadModules;

var settings = {};

settings.system = {};
system = settings.system;
system.DC = {};

var config_options = settings.config_options = {};

config_options.NEC_tables = {};
k.AJAX('data/tables.txt', loadTables);

config_options.modules = false;
k.AJAX( 'data/modules.csv', loadModules, settings );


config_options.AC_type_options = ['120V', '240V', '208V', '277V', '480V Wye', '480V Delta'];
config_options.string_num_options = [1,2,3,4,5,6];
config_options.string_modules_options = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
config_options.AC_types = {
    '120V'      : ['ground', 'neutral', 'L1' ],
    '240V'      : ['ground', 'neutral', 'L1', 'L2' ],
    '208V'      : ['ground', 'neutral', 'L1', 'L2' ],
    '277V'      : ['ground', 'neutral', 'L1' ],
    '480V Wye'  : ['ground', 'neutral', 'L1', 'L2', 'L3' ],
    '480V Delta': ['ground', 'L1', 'L2', 'L3' ],
};



//var components = settings.components = {};

config_options.inverters = {};
config_options.inverters['SI3000'] = {
    Make:'SMA',
    model:'3000',

    DC_voltageWindow_low: 150,
    DC_voltageWindow_high: 350,
    max_power: 3300,

    AC_options: ['240','208'],

};




var sys_config = settings.sys_config = {};

sys_config.string_num = 4;
//log(kontainer('sys_config'))

sys_config.string_modules = 6;
sys_config.inverter = 'SI3000';
sys_config.AC_type = '480V Delta';



// Drawing specific
settings.drawing = {};

var l_attr = settings.drawing.l_attr = {};

l_attr.base = {
    'fill': 'none',
    'stroke':'#000000',
    'stroke-width':'1px',
    'stroke-linecap':'butt',
    'stroke-linejoin':'miter',
    'stroke-opacity':1,

};
l_attr.block = Object.create(l_attr.base);
l_attr.frame = Object.create(l_attr.base);
l_attr.frame.stroke = '#000042';
l_attr.table = Object.create(l_attr.base);
l_attr.table.stroke = '#000042';

l_attr.DC_pos = Object.create(l_attr.base);
l_attr.DC_pos.stroke = '#ff0000';
l_attr.DC_neg = Object.create(l_attr.base);
l_attr.DC_neg.stroke = '#000000';
l_attr.DC_ground = Object.create(l_attr.base);
l_attr.DC_ground.stroke = '#006600';
l_attr.module = Object.create(l_attr.base);
l_attr.box = Object.create(l_attr.base);
l_attr.text = Object.create(l_attr.base);
l_attr.text.stroke = '#0000ff';
l_attr.terminal = Object.create(l_attr.base);

l_attr.AC_ground = Object.create(l_attr.base);
l_attr.AC_ground.stroke = 'Green';
l_attr.AC_neutral = Object.create(l_attr.base);
l_attr.AC_neutral.stroke = 'Gray';
l_attr.AC_L1 = Object.create(l_attr.base);
l_attr.AC_L1.stroke = 'Black';
l_attr.AC_L2 = Object.create(l_attr.base);
l_attr.AC_L2.stroke = 'Red';
l_attr.AC_L3 = Object.create(l_attr.base);
l_attr.AC_L3.stroke = 'Blue';

///////////////
// fonts

var fonts = settings.drawing.fonts = {};

fonts['signs'] = {
    'font-family': 'monospace',
    'font-size':     5,
    'text-anchor':   'middle',
};
fonts['label'] = {
    'font-family': 'monospace',
    'font-size':     12,
    'text-anchor':   'middle',
};
fonts['title1'] = {
    'font-family': 'monospace',
    'font-size':     14,
    'text-anchor':   'left',
};
fonts['title2'] = {
    'font-family': 'monospace',
    'font-size':     12,
    'text-anchor':   'left',
};
fonts['page'] = {
    'font-family': 'monospace',
    'font-size':     20,
    'text-anchor':   'left',
}
fonts['table'] = {
    'font-family': 'monospace',
    'font-size':     6,
    'text-anchor':   'middle',
};



var size = settings.drawing.size = {};
var loc = settings.drawing.loc = {};


// sizes
size.drawing = {
    w: 1000,
    h: 780,
    frame_padding: 5,
    titlebox: 50,
};

size.module = {};
size.module.frame = {
    w: 10,
    h: 30,
};
size.module.lead = size.module.frame.w*2/3;
size.module.h = size.module.frame.h + size.module.lead*2;
size.module.w = size.module.frame.w;

size.wire_offset = {
    base: 5,
    gap: size.module.w,
}    ;
size.wire_offset.max = system.DC.string_num * size.wire_offset.base;
size.wire_offset.ground = size.wire_offset.max + size.wire_offset.base*2;

size.string = {};
size.string.gap = size.module.frame.w/42;
size.string.gap_missing = size.string.gap + size.module.frame.w;
size.string.h = (size.module.h * 4) + (size.string.gap * 2) + size.string.gap_missing;
size.string.w = size.module.frame.w * 2.5;

size.jb_box = {
    h: 140 + size.wire_offset.base*2 * system.DC.string_num,
    w: 80,
};

size.discbox = {
    w: 80 + size.wire_offset.base*2 * system.DC.string_num,
    h: 140,
};

size.terminal_diam = 5;

size.inverter = { w: 200, h: 150 };
size.inverter.text_gap = 15;
size.inverter.symbol_w = 50;
size.inverter.symbol_h = 25;

size.AC_disc = { w: 75, h: 100 };

size.AC_loadcenter = { w: 125, h: 300 }; 
size.AC_loadcenter.breaker = { w: 20, h: 5, };

size.AC_loadcenter.neutralbar = { w:5, h:40 };
size.AC_loadcenter.groundbar = { w:40, h:5 };

size.wire_table = {};
size.wire_table.w = 200;
size.wire_table.row_h = 10;
size.wire_table.h = (system.wire_config_num+3) * size.wire_table.row_h;


// location
loc.array = { x:200, y:600 };
loc.array.upper = loc.array.y - size.string.h/2;
loc.array.lower = loc.array.upper + size.string.h;
loc.array.right = loc.array.x - size.module.frame.h*2;
loc.array.left = loc.array.right - ( size.string.w * system.DC.string_num ) - ( size.module.w * 1.25 ) ;

loc.DC = loc.array;

loc.inverter = { x:loc.array.x+300, y:loc.array.y-350 };
loc.inverter.bottom = loc.inverter.y + size.inverter.h/2;
loc.inverter.top = loc.inverter.y - size.inverter.h/2;
loc.inverter.bottom_right = {
    x: loc.inverter.x + size.inverter.w/2,
    y: loc.inverter.y + size.inverter.h/2,
};
loc.AC_disc = { x: loc.array.x+475, y: loc.array.y-100 };
loc.AC_disc.bottom = loc.AC_disc.y + size.AC_disc.h/2;
loc.AC_disc.top = loc.AC_disc.y - size.AC_disc.h/2;
loc.AC_disc.left = loc.AC_disc.x - size.AC_disc.w/2;
loc.AC_disc.switch_top = loc.AC_disc.top + 15;
loc.AC_disc.switch_bottom = loc.AC_disc.switch_top + 30;



loc.AC_loadcenter = {
    x: loc.AC_disc.x+150, 
    y: loc.AC_disc.y-100
};
loc.AC_loadcenter.wire_bundle_bottom = loc.AC_disc.top - 20;
loc.AC_loadcenter.left = loc.AC_loadcenter.x - size.AC_loadcenter.w/2;
loc.AC_loadcenter.breakers = {
    left: loc.AC_loadcenter.x - ( size.AC_loadcenter.breaker.w * 1.1 ),
    spacing: size.terminal_diam,
};
loc.AC_loadcenter.neutralbar = {
    x: loc.AC_loadcenter.left + 20, 
    y: loc.AC_loadcenter.y + size.AC_loadcenter.h*0.2 
};
loc.AC_loadcenter.groundbar = {
    x: loc.AC_loadcenter.x + 10, 
    y: loc.AC_loadcenter.y + size.AC_loadcenter.h*0.45
};

loc.wire_table = {
    x: size.drawing.w - size.drawing.titlebox - size.drawing.frame_padding*3 - size.wire_table.w/2 - 25,
    y: size.drawing.frame_padding*3 + size.wire_table.h/2,
};
loc.wire_table.top = loc.wire_table.y - size.wire_table.h/2;
loc.wire_table.bottom = loc.wire_table.y + size.wire_table.h/2;

//loc.AC_loadcenter.breakers = 


/////////////////////
module.exports= settings;
