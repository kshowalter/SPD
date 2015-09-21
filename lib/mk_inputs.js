mk_inputs = function(settings){
  //console.log('I will now create the initial input settings....');
  //settings = settings || {};


  //settings.in = {};

  //settings.data.opt = {
  //  AC: {
  //    loadcenter: {
  //      '240V': ['240V','120V'],
  //      '208/120V': ['208V','120V'],
  //      '480/277V': ['480V Wye','480V Delta','277V'],
  //    },
  //    conductors: {
  //      "120V": ["ground","neutral","L1"],
  //      "240V": ["ground","neutral","L1","L2"],
  //      "208V": ["ground","neutral","L1","L2"],
  //      "277V": ["ground","neutral","L1"],
  //      "480V Wye": ["ground","neutral","L1","L2","L3"],
  //      "480V Delta": ["ground","L1","L2","L3"],

  //    },
  //  },

  //};



  settings.inputs = {
    location: {
      county: {
        input_type: 'text_input',
      },
      address: {
        input_type: 'text_input',
      },
      city: {
        input_type: 'text_input',
      },
      zip_code: {
        input_type: 'text_input',
      },
      type_of_permit: {
        input_type: 'text_input',
      },
      risk_category: {
        input_type: 'radio',
        options: ['I','II','III','IV'],
      },
      exposure_category: {
        input_type: 'radio',
        options: ['B','C','D'],
      },
    },
    roof: {
      width1: {
        options: [],
        units: 'ft.',
        label: 'Eave Width',
        note: 'This the full width of the roof at the eave, perpendictular to the slope.',
        input_type: 'number_input',
      },
      width2: {
        options: [],
        units: 'ft.',
        label: 'Ridge Width',
        note: 'This the full width of the roof at the ridge, perpendictular to the slope.',
        input_type: 'number_input',
      },
      width3: {
        options: [],
        units: 'ft.',
        label: 'Roof Width',
        note: 'This the full width of the roof, parallel to the slope.',
        input_type: 'number_input',
      },
      eave_wall_height: {
        options: [],
        units: 'ft.',
        note: 'This is height or the wall at the eave.',
        input_type: 'number_input',
      },
      slope_length: {
        options: [],
        units: 'ft.',
        label: 'Slope Length',
        note: 'This the full length of the roof, measured from low to high.',
        input_type: 'number_input',
      },
      slope: {
        options: ['2:12','3:12','4:12','5:12','6:12','7:12','8:12','9:12','10:12','11:12','12:12'],
      },
      type: {
        //options: ['Gable','Shed','Hipped'],
        options: ['Gable'],
      },
			material: {
				options: ['Shingle', 'Slay tile', 'Soncrete tile', 'Standing seam']
			},

    },
    module: {
      make: {
        options: _.uniq(PV_Components.find({type:"modules"}).map(function(doc){return doc.make;})),
      },
      model: {
        options: [],
      },
      orientation: {
        options: ['Portrait','Landscape'],
      },
    },
    array: {
      modules_per_string: {
        options: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
      },
      num_strings: {
        options: [1,2,3,4,5,6],
      },
    },
    DC: {
      home_run_length: {
        input_type: 'number_input',
      },
    },
    inverter: {
      make: {
        options: _.uniq(PV_Components.find({type:"inverters"}).map(function(doc){return doc.make;})),
      },
      model: {
        options: "TBD",
      },
      location: {
        options: ['Inside', 'Outside'],
      },
    },
    AC: {
      loadcenter_type: {
        options: ['240V', '208/120V', '480/277V'],
      },
      voltage: {
        options: "TBD",
      },
      distance_to_loadcenter: {
        input_type: 'number_input',
      },
    },
    attachment_system: {
      make: {
          options: ['UNIRAC'],
          type: 'select',
      },
      model: {
          options: ['SOLUNIRACARMOUNT'],
          type: 'select',
      },
    },

  };


  for( i=15; i<=70; i+=5 ) settings.inputs.roof.width1.options.push(i);
  for( i=15; i<=70; i+=5 ) settings.inputs.roof.width2.options.push(i);
  for( i=15; i<=70; i+=5 ) settings.inputs.roof.width3.options.push(i);
  for( i=15; i<=70; i+=5 ) settings.inputs.roof.eave_wall_height.options.push(i);
  for( i=10; i<=60; i+=5 ) settings.inputs.roof.slope_length.options.push(i);




  var section_list_alt = [];
  var order;
  for( var section_name in settings.inputs ){
    order = 0;
    for( var value_name in settings.inputs[section_name]){
      var input = settings.inputs[section_name][value_name];
      if( input.options ){
        input.input_type = 'select';
      }
      if( input.options === 'TBD'){
        input.options = false;
      }
      input.value_name = value_name;
      input.section_name = section_name;
      input.value = null;
      input.type = "user";
      input.order = order++;
      section_list_alt.push(section_name);
    }

  }

  settings.user_input = f.add_sections(settings.inputs);
  //console.log(settings.user_input);
  settings.system = f.blank_copy(settings.inputs); // make system section blank

  section_list = _.uniq(section_list_alt);

  settings.webpage.sections = section_list;

  settings.webpage.section_manual_toggled = {};
  settings.webpage.section_activated = {};
  //settings.webpage.sections = Object.keys(settings.inputs);


  settings.webpage.sections.forEach( function(section_name){
      settings.webpage.section_manual_toggled[section_name] = false;
      settings.webpage.section_activated[section_name] = false;
  });


  //settings.components.makes = PV_Components.find({}).map(function(doc){
  //  return doc.make;
  //});
  //settings.components.models = PV_Components.find({}).map(function(doc){
  //  return doc.model;
  //});

  //settings.user_input = f.add_sections(settings.inputs);
  //console.log(settings.user_input);



  //settings.inputs = settings.inputs; // copy input reference with options to inputs
  //settings.inputs = f.blank_copy(settings.inputs); // make input section blank
  //settings.system_formulas = settings.system; // copy system reference to system_formulas
  settings.system = f.blank_copy(settings.inputs); // make system section blank

  //f.merge_objects( settings.inputs, settings.system );

  return settings;
};
