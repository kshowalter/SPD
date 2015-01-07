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


///////////////
// fonts

var fonts = {};

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
    'text-anchor':   'middle',
};
fonts['table'] = {
    'font-family': 'monospace',
    'font-size':     6,
    'text-anchor':   'middle',
};
fonts['table_left'] = {
    'font-family': 'monospace',
    'font-size':     6,
    'text-anchor':   'left',
};
fonts['table_large_left'] = {
    'font-family': 'monospace',
    'font-size':     14,
    'text-anchor':   'left',
};
fonts['table_large'] = {
    'font-family': 'monospace',
    'font-size':     14,
    'text-anchor':   'middle',
};
fonts['project title'] = {
    'font-family': 'monospace',
    'font-size':     16,
    'text-anchor':   'middle',
};
fonts['preview text'] = {
    'font-family': 'monospace',
    'font-size':     20,
    'text-anchor':   'middle',
};





module.exports = fonts;
