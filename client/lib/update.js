update = function(){
  console.log('+ updating');

  f.process(settings);
  calculate();

  ///*
  update_drawing();

  //console.log('sections', getSetting('section_list'));
  //getSetting('section_list').forEach(function(section_name){
  //  //console.log(section_name, ready('section_name'));
  //  console.log(section_name, f.section_defined(section_name));
  //});

///*
  $('#drawing').empty();
  settings.drawing.svgs.forEach(function(svg){
    $('#drawing')
      .append($(svg))
      .append($('</br>'))
      .append($('</br>'));

  });
  //*/
};
