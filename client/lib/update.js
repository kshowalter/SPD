update = function(){
  console.log('current state:', state);

  if( Meteor.user() && Meteor.user().active_system ){
    var active_system = Meteor.user().active_system;
    state.status.active_system = active_system;
    console.log('...updating active system: ', active_system);
  } else {
    console.log('...nothing to update yet...');
  }

  if( active_system){

    state.status.inCompliance = true;

    System_data.find({system_id: active_system}).forEach(function(input_doc){
      state.system[input_doc.section_name] = state.system[input_doc.section_name] || {};
      state.system[input_doc.section_name][input_doc.value_name] = input_doc.value;
    });

    state.webpage.selected_modules = User_systems.findOne({system_id: active_system}).selected_modules ||
      state.webpage.selected_modules;


    f.request_geocode();

    state = calculate(state);
    state = update_drawing(state);

    var section_list = state.webpage.sections;
    var active_section_name = section_list[0];
    //console.log('section_list', section_list);
    var not_defined = [];
    section_list.forEach(function(section_name){
      if( section_defined(state.status.active_system, section_name) ){
        state.webpage.section_activated[section_name] = true;
        $('#tab_'+section_name).html('<i class="fa fa-check-square"></i> ' + f.pretty_name(section_name) );
        // '<i class="fa fa-check-square"></i> ' + section_name
      } else {
        not_defined.push(section_name);
        state.webpage.section_activated[section_name] = false;
        $('#tab_'+section_name).html('<i class="fa fa-square-o"></i> ' + f.pretty_name(section_name) );
      }
    });
    active_section_name = not_defined[0];
    state.webpage.section_activated[active_section_name] = true;

    Session.set('active_section_name', active_section_name);
    Session.set('section_activated', state.webpage.section_activated);

    //show_hide_selections();
    /*
    active_section_name = Session.get('active_section_name');
    section_list.forEach(function(section_name){
      if( section_name === active_section_name ) {
        //console.log('opening: ', section_name, $('#section_'+section_name).children('.drawer').children('.drawer_content'));
        $('#section_'+section_name).children('.drawer').children('.drawer_content').slideDown();
      } else if( ! state.webpage.section_manual_toggled[section_name] ) {
        //console.log('not equal: ', section_name, active_section_name);
        $('#section_'+section_name).children('.drawer').children('.drawer_content').slideUp();

      }
    });
    */


    state.drawing_state.sheets.forEach(function(sheet_info, index){
      $('.tab_content#section_'+sheet_info.num)
        .empty()
        .append($(
          state.drawing.svgs[index]
        ));
    });

    var table_values = {};
    if(
      state.system.wind &&
      state.system.wind.risk_category1 &&
      state.system.wind.risk_category2 &&
      state.system.wind.risk_category3
    ){
      table_values['Risk Category 1'] = state.system.wind.risk_category1 || '-';
      table_values['Risk Category 2'] = state.system.wind.risk_category2 || '-';
      table_values['Risk Category 3'] = state.system.wind.risk_category3 || '-';
    }
    if(      state.system.location &&
      state.system.location.low_temp !== undefined &&
      state.system.location.high_temp_max  !== undefined  &&
      state.system.location.high_temp !== undefined
    ){
      table_values['Low Temp'] = state.system.location.low_temp;
      table_values['High Temp Max'] = state.system.location.high_temp_max;
      table_values['High Temp'] = state.system.location.high_temp;
    }

    var table = $('<table>')
      .addClass('param_table');
    $('#location_table').empty().append(table);

    if( Object.keys(table_values).length ){
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

    // create previews
    state.drawing.preview_parts = {};
    state.drawing.preview_svgs = {};
    for( var name in f.mk_preview ){  // f.mk_sheet_num is a array of page making functions, so this will loop through the number of pages
        state.drawing.preview_parts[name] = f.mk_preview[name](state);
        state.drawing.preview_svgs[name] = f.mk_svg(state.drawing.preview_parts[name], state);
    }
    var preview_table = {
        'location': [],
        'roof': [ state.drawing.preview_svgs['roof_dim'] , state.drawing.preview_svgs['roof'] ],
        'array': [ state.drawing.preview_svgs['elec'], state.drawing.preview_svgs['roof'] ],
        'inverter': [ state.drawing.preview_svgs['elec'] ],
        'attachment_system': [ state.drawing.preview_svgs['roof_attachment'] ],
    };
    $('.preview_cell').remove();
    state.webpage.sections.forEach(function(section_name){
        if(preview_table[section_name]) {
          preview_table[section_name].forEach(function(preview_svg){
            var svg_drawing_container = $('<span>')
              .addClass('cell')
              .addClass('preview_cell');
            $('#section_'+section_name).append(svg_drawing_container)
              svg_drawing_container.append(
                  $(preview_svg).clone()
                      .attr('class', 'svg_drawing_preview')
                  //$('<br>')
              );
          });
        }
    });

    Meteor.call('save_system_state', state.system, function(err, returned){
      //console.log('returned: ', returned);
    });


  }
};
