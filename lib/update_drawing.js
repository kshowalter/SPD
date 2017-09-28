update_drawing = function(settings){

  settings.drawing_settings.size.wire_offset.max = settings.drawing_settings.size.wire_offset.min
                                                  + settings.state.system.array.number_of_strings
                                                  * settings.drawing_settings.size.wire_offset.base;
  settings.drawing_settings.size.wire_offset.ground = settings.drawing_settings.size.wire_offset.max
                                                    + settings.drawing_settings.size.wire_offset.base*1;
  settings.drawing_settings.loc.array.left = settings.drawing_settings.loc.array.right
                                            - ( settings.drawing_settings.size.string.w * settings.state.system.array.number_of_strings );
                                            //- ( settings.drawing_settings.size.module.frame.w*3/4 );


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

  settings.report.parts = {};
  settings.report.svgs = [];
  settings.report_settings.pages.forEach(function(sheet_info, i){
    p = i+1;
    settings.report.parts[p] = mk_report_page(settings, sheet_info);
    settings.report.svgs.push(
      f.mk_svg(settings.report.parts[p], settings)
    );
  });

  return settings;
};
