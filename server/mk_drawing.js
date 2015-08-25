mk_drawing = function(system_id){
  console.log('Making: ', system_id);




  var system_settings = mk_settings();
  settings = mk_inputs(settings);
  system_settings.f = f;
  system_settings = mk_section_info(system_settings);

  System_data.find({system_id: system_id}).forEach(function(input_doc){
    system_settings.system[input_doc.section_name] = system_settings.system[input_doc.section_name] || {};
    system_settings.system[input_doc.section_name][input_doc.value_name] = input_doc.value;
  });

  system_settings.state.active_system = system_id;

  system_settings = calculate(system_settings);
  system_settings = update_drawing(system_settings);
  var svgs = system_settings.drawing.svgs;


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

console.log('x');
  return svgs;

};
