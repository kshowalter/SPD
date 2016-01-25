update_drawing = function(settings){

  // Make blocks
  f.mk_blocks(settings);

  // Make drawing
  var i, p;
  settings.drawing.parts = {};
  settings.drawing.svgs = [];
  settings.drawing_settings.sheets.forEach(function(sheet_info, i){
    p = i+1;
    settings.drawing.parts[p] = mk_sheet(settings, sheet_info);
    settings.drawing.svgs.push(
      f.mk_svg(settings.drawing.parts[p], settings)
    );
  });

  return settings;
};
