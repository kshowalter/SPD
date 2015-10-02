update = function(){
  if(Meteor.user()){
    var active_system = Meteor.user().active_system;
    console.log('...updating active system: ', active_system);
  } else {
    console.log('...nothing to update yet...');
  }

  if( active_system){

    System_data.find({system_id: active_system}).forEach(function(input_doc){
      settings.system[input_doc.section_name] = settings.system[input_doc.section_name] || {};
      settings.system[input_doc.section_name][input_doc.value_name] = input_doc.value;
    });

    f.request_geocode();

    settings = calculate(settings);
    settings = update_drawing(settings);

    var section_list = settings.webpage.sections;
    var active_section_name = section_list[0];
    //console.log('section_list', section_list);
    var not_defined = [];
    section_list.forEach(function(section_name){
      if( section_defined(settings.state.active_system, section_name) ){
        settings.webpage.section_activated[section_name] = true;
        $('#tab_'+section_name).children('a').html('<i class="fa fa-check-square"></i> ' + section_name);
        // '<i class="fa fa-check-square"></i> ' + section_name
      } else {
        not_defined.push(section_name);
        settings.webpage.section_activated[section_name] = false;
        $('#tab_'+section_name).children('a').html('<i class="fa fa-square-o"></i> ' + section_name);
      }
    });
    active_section_name = not_defined[0];
    settings.webpage.section_activated[active_section_name] = true;

    Session.set('active_section_name', active_section_name);
    Session.set('section_activated', settings.webpage.section_activated);

    //show_hide_selections();
    /*
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
    */


    settings.drawing_settings.sheets.forEach(function(sheet_info, index){
      $('.tab_content#section_'+sheet_info.num)
        .empty()
        .append($(
          settings.drawing.svgs[index]
        ));
    });

    var table_values = {};
    if(
      settings.system.wind &&
      settings.system.wind.risk_category1 &&
      settings.system.wind.risk_category2 &&
      settings.system.wind.risk_category3
    ){
      table_values['Risk Category 1'] = settings.system.wind.risk_category1 || '-';
      table_values['Risk Category 2'] = settings.system.wind.risk_category2 || '-';
      table_values['Risk Category 3'] = settings.system.wind.risk_category3 || '-';
    }
    if(
      settings.system.location &&
      settings.system.location.low_temp !== undefined &&
      settings.system.location.high_temp_max  !== undefined  &&
      settings.system.location.high_temp !== undefined
    ){
      table_values['Low Temp'] = settings.system.location.low_temp || '-';
      table_values['High Temp Max'] = settings.system.location.high_temp_max || '-';
      table_values['High Temp'] = settings.system.location.high_temp || '-';
    }

    var table = $('<table>');
    $('#location_table').empty().append(table);

    table.append(
      $('<tr>').append(
        $('<th>').text('Parameter'),
        $('<th>').text('Value')
      )
    );

    for( var param_name in table_values){
      table.append(
        $('<tr>').append(
          $('<td>').text(param_name),$('<td>').text(table_values[param_name])
        )
      );
    }



  }
//*/

};
