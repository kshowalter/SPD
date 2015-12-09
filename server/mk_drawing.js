mk_drawing = function(system_id){
  console.log('Making: ', system_id);




  var system_state = mk_state();
  state = mk_inputs(state);
  system_state.f = f;
  system_state = mk_section_info(system_state);

  System_data.find({system_id: system_id}).forEach(function(input_doc){
    system_state.system[input_doc.section_name] = system_state.system[input_doc.section_name] || {};
    system_state.system[input_doc.section_name][input_doc.value_name] = input_doc.value;
  });

  state.webpage.selected_modules = User_systems.findOne({system_id: system_id}).selected_modules ||
    state.webpage.selected_modules;


  system_state.status.active_system = system_id;

  system_state = calculate(system_state);
  system_state = update_drawing(system_state);
  var svgs = system_state.drawing.svgs;


  svgs_strings = [];

  svgs.forEach(function(svg){
    svgs_strings.push(svg.outerHTML);
  });

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
