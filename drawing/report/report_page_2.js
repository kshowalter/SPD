f.mk_report_page_num['R2'] = function(settings){
  var state = settings.state;

  var d = Drawing(settings);

  var size = settings.report_settings.size;

  var x, y, h, w;

  x = 5;
  y = size.page.w*1/20;

  d.layer('text');

  var indent = 5;
  var second_line_indent = 10;
  var max_line_length = 145;
  var line_spacing = 3.5;

  for( var limitation_section_name in settings.info.system_limitations ){
    var limitation_section = settings.info.system_limitations[limitation_section_name];
    d.text([x,y], f.pretty_name(limitation_section_name), 'text', 'report_text');
    y += line_spacing;
    limitation_section.forEach(function(limitation_text){
      var limitation_array = f.split_long_sentence(limitation_text, max_line_length);
      d.text([x+indent,y], limitation_array[0], 'text', 'report_text');
      y += line_spacing;
      if( limitation_array.length > 1 ){
        limitation_array.slice(1).forEach(function(limitation_text_line){
          d.text([x+indent+second_line_indent,y], limitation_text_line, 'text', 'report_text');
          y += line_spacing;
        });
      }
    });
    y += line_spacing/2;

  }



  return d;

}
