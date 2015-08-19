update = function(){
  var active_system = Meteor.user().active_system;
  console.log('...updating active system: ', active_system);


  if( active_system){

    System_data.find({system_id: active_system}).forEach(function(input_doc){
      settings.system[input_doc.section_name] = settings.system[input_doc.section_name] || {};
      settings.system[input_doc.section_name][input_doc.value_name] = input_doc.value;
    });

    settings = calculate(settings);
    settings = update_drawing(settings);

    var section_list = settings.webpage.sections;
    var active_section_name = section_list[0];
    //console.log('section_list', section_list);
    var not_defined = [];
    section_list.forEach(function(section_name){
      if( section_defined(settings.state.active_system, section_name) ){
        settings.webpage.section_activated[section_name] = true;

      } else {
        not_defined.push(section_name);
        settings.webpage.section_activated[section_name] = false;
      }

    });
    active_section_name = not_defined[0];
    settings.webpage.section_activated[active_section_name] = true;

    Session.set('active_section_name', active_section_name);
    Session.set('section_activated', settings.webpage.section_activated);

    //show_hide_selections();
    active_section_name = Session.get('active_section_name');
    section_list.forEach(function(section_name){
      if( section_name === active_section_name ) {
        //console.log('opening: ', section_name, $('#section_'+section_name).children('.drawer').children('.drawer_content'));
        $('#section_'+section_name).children('.drawer').children('.drawer_content').slideDown();
      } else if( ! settings.webpage.section_manual_toggled[section_name] ) {
        //console.log('not equal: ', section_name, active_section_name);
        $('#section_'+section_name).children('.drawer').children('.drawer_content').slideUp();

      }
    });

    $('#drawing').empty();
    settings.drawing.svgs.forEach(function(svg){
      $('#drawing')
        .append($(svg))
        .append($('</br>'))
        .append($('</br>'));

    });

  }
//*/

};
