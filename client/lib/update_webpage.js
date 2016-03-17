update_webpage = function(settings){
  var state = settings.state;


  var request_drawing_button = $('<a>', {
    id: 'summary_request_drawing',
    class: 'button',
    href: '#',
    text: 'request drawing',
  });
  $('#summary_drawing_download_status')
    .empty()
    .append(request_drawing_button);


  var section_list = state.webpage.sections;
  var active_section_name = section_list[0];
  //console.log('section_list', section_list);
  var not_defined = [];
  section_list.forEach(function(section_name){
    if( section_defined(state.status.active_system, section_name) ){
      state.webpage.section_activated[section_name] = true;
      $('#tab_'+section_name).html('<i class="fa fa-check-square"></i> ' + f.pretty_name(section_name) );
      // '<i class='fa fa-check-square'></i> ' + section_name
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


  settings.drawing_settings.sheets.forEach(function(sheet_info, index){
    $('.tab_content#section_'+f.name_to_id(sheet_info.num))
      .empty()
      .append($(
        settings.drawing.svgs[index]
      ));
  });

  settings.report_settings.pages.forEach(function(sheet_info, index){
    $('.tab_content#section_'+f.name_to_id(sheet_info.num))
      .empty()
      .append($(
        settings.report.svgs[index]
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
  settings.drawing.preview_parts = {};
  settings.drawing.preview_svgs = {};
  for( var name in f.mk_preview ){  // f.mk_sheet_num is a array of page making functions, so this will loop through the number of pages
    settings.drawing.preview_parts[name] = f.mk_preview[name](settings);
    settings.drawing.preview_svgs[name] = f.mk_svg(settings.drawing.preview_parts[name], settings);
  }
  var preview_table = {
    'location': [],
    'roof': [ settings.drawing.preview_svgs['roof_dim'] , settings.drawing.preview_svgs['roof'] ],
    'array': [ settings.drawing.preview_svgs['elec'], settings.drawing.preview_svgs['roof'] ],
    'inverter': [ settings.drawing.preview_svgs['elec'] ],
    'attachment_system': [ settings.drawing.preview_svgs['roof_attachment'] ],
  };
  $('.preview_cell').remove();
  state.webpage.sections.forEach(function(section_name){
    if(preview_table[section_name]) {
      preview_table[section_name].forEach(function(preview_svg){
        var svg_drawing_container = $('<span>')
        .addClass('cell')
        .addClass('preview_cell');
        $('#section_'+section_name).append(svg_drawing_container);
        svg_drawing_container.append(
          $(preview_svg).clone()
          .attr('class', 'svg_drawing_preview')
          //$('<br>')
        );
      });
    }
  });


  return settings;
};
