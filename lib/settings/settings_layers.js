// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (!Object.assign) {
  Object.defineProperty(Object, "assign", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target, firstSource) {
      "use strict";
      if (target === undefined || target === null)
      throw new TypeError("Cannot convert first argument to object");
      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) continue;
        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
        }
      }
      return to;
    }
  });
}


layer_attr = {};

layer_attr.image = {};

layer_attr.base = {
  'fill': 'none',
  'stroke':'#000000',
  'stroke-width':'1px',
  'stroke-linecap':'butt',
  'stroke-linejoin':'miter',
  'stroke-opacity':1,

};
layer_attr.block = Object.create(layer_attr.base);
layer_attr.frame = Object.create(layer_attr.base);
layer_attr.frame.stroke = '#000042';
layer_attr.table = Object.create(layer_attr.base);
layer_attr.table.stroke = '#000000';

layer_attr.DC_intermodule = Object.assign(Object.create(layer_attr.base),{
  stroke: '#bebebe',
  "stroke-dasharray": "1, 1",


});

layer_attr.DC_pos = Object.create(layer_attr.base);
layer_attr.DC_pos.stroke = '#ff0000';
layer_attr.DC_neg = Object.create(layer_attr.base);
layer_attr.DC_neg.stroke = '#000000';
layer_attr.DC_ground = Object.create(layer_attr.base);
layer_attr.DC_ground.stroke = '#006600';
layer_attr.module = Object.create(layer_attr.base);
layer_attr.box = Object.create(layer_attr.base);



layer_attr.text = Object.create(layer_attr.base);
layer_attr.text.stroke = '#000a36';
layer_attr.title = Object.create(layer_attr.base);
layer_attr.title.stroke = '#000000';
layer_attr.terminal = Object.create(layer_attr.base);


layer_attr.AC_ground = Object.create(layer_attr.base);
layer_attr.AC_ground.stroke = '#009900';
layer_attr.AC_neutral = Object.create(layer_attr.base);
layer_attr.AC_neutral.stroke = '#999797';
layer_attr.AC_L1 = Object.create(layer_attr.base);
layer_attr.AC_L1.stroke = '#000000';
layer_attr.AC_L2 = Object.create(layer_attr.base);
layer_attr.AC_L2.stroke = '#FF0000';
layer_attr.AC_L3 = Object.create(layer_attr.base);
layer_attr.AC_L3.stroke = '#0000FF';


layer_attr.preview = Object.assign(Object.create(layer_attr.base),{
  'stroke-width': '2',
});

layer_attr.preview_module_box = Object.assign(Object.create(layer_attr.preview),{
  fill: '#2d447e',
  stroke: 'none',
});

layer_attr.preview_text = Object.assign(Object.create(layer_attr.preview),{
  stroke: '#000000',
});
layer_attr.preview_text_warning = Object.assign(Object.create(layer_attr.preview),{
  stroke: '#b10000',
});


layer_attr.preview_structural = Object.assign(Object.create(layer_attr.preview),{
  stroke: '#000000',
});
layer_attr.preview_structural_dot = Object.assign(Object.create(layer_attr.preview),{
  stroke: '#000000',
  "stroke-dasharray": "5, 5"
});
layer_attr.preview_structural_roof_outline = Object.assign(Object.create(layer_attr.preview),{
  stroke: '#000000',
  'stroke-width' : '5'
});
layer_attr.preview_structural_roof_outline_dot = Object.assign(Object.create(layer_attr.preview),{
  stroke: '#000000',
  "stroke-dasharray": "5, 5",
  'stroke-width' : '2'
});
layer_attr.preview_structural_poly_unselected = Object.assign(Object.create(layer_attr.preview),{
  fill: '#e1e1e1',
  stroke: 'none'
});
layer_attr.preview_structural_poly_selected = Object.assign(Object.create(layer_attr.preview),{
  fill: '#ffe7cb',
  stroke: 'none'
});
layer_attr.preview_structural_poly_selected_framed = Object.assign(Object.create(layer_attr.preview),{
  fill: '#ffe7cb',
  stroke: '#000000'
});

layer_attr.preview_structural_mounting_hole = Object.assign(Object.create(layer_attr.preview),{
  fill: '#FFFFFF',
  stroke: '#000000',
  'stroke-width' : '0.4'
});

layer_attr.preview_structural_module = Object.assign(Object.create(layer_attr.preview),{
  fill: '#ffffff',
  stroke: 'none'
});
layer_attr.preview_structural_module_selected = Object.assign(Object.create(layer_attr.preview),{
  fill: '#8397e8',
  stroke: '#dffaff'
});

layer_attr.preview_structural_module_site_selected = Object.assign(Object.create(layer_attr.preview),{
  fill: '#8397e8',
  'fill-opacity': 0.3,
  stroke: '#dffaff',
  "stroke-dasharray": "1, 2"
});

layer_attr.preview_structural_module_site = Object.assign(Object.create(layer_attr.preview),{
  fill: '#8397e8',
  'fill-opacity': 0,
  stroke: '#000000',
  'stroke-opacity': 0.3,
  'stroke-width': 0.4,
  "stroke-dasharray": "1, 1"
});


layer_attr.north_arrow = Object.assign(Object.create(layer_attr.preview),{
  stroke: '#000000',
  'stroke-width': 1,
  'stroke-linecap': "round",
  'stroke-linejoin': "round",
});
layer_attr.north_letter = Object.assign(Object.create(layer_attr.preview),{
  stroke: '#949494',
  'stroke-width': 5,
  'stroke-linecap': "round",
  'stroke-linejoin': "round",
});

layer_attr.dimention = Object.assign(Object.create(layer_attr.text),{
  stroke: '#1433fe',
});

layer_attr.border = Object.create(layer_attr.base);

layer_attr['border_lines'] = Object.assign(Object.create(layer_attr.text),{
  stroke: '#8e8e8e',
});

layer_attr['wire_callout'] = Object.assign(Object.create(layer_attr.text),{
  stroke: '#424242',
});
