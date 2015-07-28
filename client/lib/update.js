update = function(){
  console.log('+ updating');

  //f.process(settings);
  calculate();

  ///*
  update_drawing();

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
