mk_drawing = function(system_id){
  // This is the counterpart of 'update' on the browser

  console.log('Making: ', system_id);

  var system_settings = mk_settings();

  var state = mk_state();
  system_settings.state = state;

  // make inputs
  system_settings = mk_inputs(system_settings);
  section_list = _.uniq(_.keys(system_settings.state.inputs));
  state.webpage.sections = section_list;
  state.webpage.section_manual_toggled = {};
  state.webpage.section_activated = {};

  state.webpage.sections.forEach( function(section_name){
      state.webpage.section_manual_toggled[section_name] = false;
      state.webpage.section_activated[section_name] = false;
  });
  state.system = f.blank_copy(state.inputs); // make system section blank
  state.system.array.module = {};
  ////////

  system_settings.f = f;
  system_settings = mk_section_info(system_settings);

  // Load system state
  // TODO: define what user input needs to be recorded from the state, and how to store it in the database
  System_data.find({system_id: system_id}).forEach(function(input_doc){
    state.system[input_doc.section_name] = state.system[input_doc.section_name] || {};
    state.system[input_doc.section_name][input_doc.value_name] = input_doc.value;
  });
  state.webpage.selected_modules = User_systems.findOne({system_id: system_id}).selected_modules ||
    state.webpage.selected_modules;

  state.status.active_system = system_id;



  // Calculate system specs and drawing from user inputs
  system_settings = process_system(system_settings);
  ///////////////////////////////////////////



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

  return system_settings.drawing.svgs;
};
