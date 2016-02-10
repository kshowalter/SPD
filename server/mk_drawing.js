mk_drawing = function(system_id){
  // This is the counterpart of 'update' on the browser

  console.log('Making: ', system_id);

  var system_settings = mk_settings();

  var state = mk_state();
  system_settings.state = state;

  settings = mk_inputs(settings);
  system_settings.f = f;
  system_settings = mk_section_info(system_settings);

  System_data.find({system_id: system_id}).forEach(function(input_doc){
    state.system[input_doc.section_name] = state.system[input_doc.section_name] || {};
    state.system[input_doc.section_name][input_doc.value_name] = input_doc.value;
  });

  state.webpage.selected_modules = User_systems.findOne({system_id: system_id}).selected_modules ||
    state.webpage.selected_modules;

  state.status.active_system = system_id;

  system_settings = calculate(system_settings);

  system_settings = update_drawing(system_settings);


  // Convert svgs to strings for storage
  svgs_strings = [];
  system_settings.drawing.svgs.forEach(function(svg){
    svgs_strings.push(svg.outerHTML);
  });

  // Store svg strings
  User_systems.upsert(
    {system_id:system_id},
    {$set:
      {svgs:[]}
    }
  );
  User_systems.update(
    {system_id:system_id},
    {$push:
      {svgs:
        { $each: svgs_strings }
      }
    }
  );

  return svgs;
};
