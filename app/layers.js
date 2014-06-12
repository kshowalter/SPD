define( function() {

    var layer = {};

    layer.base = {
        'fill': 'none',
        'stroke':'#000000',
        'stroke-width':'1px',
        'stroke-linecap':'butt',
        'stroke-linejoin':'miter',
        'stroke-opacity':1,

    };
    layer.block = Object.create(layer.base);
    layer.frame = Object.create(layer.base);
    layer.frame.stroke = '#000042'
    layer.table = Object.create(layer.base);
    layer.table.stroke = '#000042'

    layer.DC_pos = Object.create(layer.base);
    layer.DC_pos.stroke = '#ff0000';
    layer.DC_neg = Object.create(layer.base);
    layer.DC_neg.stroke = '#000000';
    layer.DC_ground = Object.create(layer.base);
    layer.DC_ground.stroke = '#006600';
    layer.module = Object.create(layer.base);
    layer.box = Object.create(layer.base);
    layer.text = Object.create(layer.base);
    layer.text.stroke = '#0000ff';
    layer.terminal = Object.create(layer.base);

    layer.AC_ground = Object.create(layer.base);
    layer.AC_ground.stroke = 'Green';
    layer.AC_neutral = Object.create(layer.base);
    layer.AC_neutral.stroke = 'Gray';
    layer.AC_L1 = Object.create(layer.base);
    layer.AC_L1.stroke = 'Black';
    layer.AC_L2 = Object.create(layer.base);
    layer.AC_L2.stroke = 'Red';
    layer.AC_L3 = Object.create(layer.base);
    layer.AC_L3.stroke = 'Blue';

    return layer;
});
