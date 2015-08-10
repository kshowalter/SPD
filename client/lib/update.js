update = function(){
  //console.log('+ updating');

  //f.process(settings);
  calculate();
  update_drawing(settings);

  var list = getSetting('section_list');
  var active_section_name = list[0];
  //console.log('list', list);
  var not_defined = [];
  list.forEach(function(section_name){
    //console.log('testing: ', section_name, defined('section_name'));
    if( defined(section_name) ){

      //console.log('    not ready', section_name, active_section_name);
      settings.webpage.section_activated[section_name] = true;
      //return true;

    } else {
      not_defined.push(section_name);
      //console.log('    ready', section_name, active_section_name);
      settings.webpage.section_activated[section_name] = false;
      //return false;
    }

  });
  active_section_name = not_defined[0];
  settings.webpage.section_activated[active_section_name] = true;

  Session.set('active_section_name', active_section_name);
  Session.set('section_activated', settings.webpage.section_activated);

  console.log('@active: ', set_active() );


  //show_hide_selections();
  active_section_name = Session.get('active_section_name');
  list.forEach(function(section_name){
    if( section_name === active_section_name ) {
      console.log('opening: ', section_name);
      $('#section_'+section_name).children('.drawer').children('.drawer_content').slideDown();
    } else if(true) {
      console.log('not equal: ', section_name, active_section_name);
      $('#section_'+section_name).children('.drawer').children('.drawer_content').slideUp();

    }
  });
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
