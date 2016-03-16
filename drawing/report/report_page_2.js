f.mk_report_page_num[2] = function(settings){
  var state = settings.state;

  var d = Drawing(settings);

  var size = settings.report_settings.size;

  var x, y, h, w;

  x = size.page.w*1/2;
  y = 50;

  d.layer('text');

  for( var limitation_section_name in settings.info.system_limitations ){
    var limitation_section = settings.info.system_limitations[limitation_section_name];
    limitation_section.forEach(function(limitation_text){
      d.text([x,y], limitation_text, 'text', 'notes');
      y += 10;
    });

  }



  return d;

}
