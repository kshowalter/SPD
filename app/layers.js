var l_attr = {};

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
l_attr.AC_ground.stroke = '#009900';
l_attr.AC_neutral = Object.create(l_attr.base);
l_attr.AC_neutral.stroke = '#999797';
l_attr.AC_L1 = Object.create(l_attr.base);
l_attr.AC_L1.stroke = '#000000';
l_attr.AC_L2 = Object.create(l_attr.base);
l_attr.AC_L2.stroke = '#FF0000';
l_attr.AC_L3 = Object.create(l_attr.base);
l_attr.AC_L3.stroke = '#0000FF';


module.exports = l_attr;
