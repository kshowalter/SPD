mk_inputs = function(settings){
  console.log('I will now create the initial input settings....');
  settings = settings || {};


  settings.in = {};

  settings.in.opt = {
    AC: {
      loadcenter: {
        '240V': ['240V','120V'],
        '208/120V': ['208V','120V'],
        '480/277V': ['480V Wye','480V Delta','277V'],
      },
      voltage: {
        "120V": ["ground","neutral","L1"],
        "240V": ["ground","neutral","L1","L2"],
        "208V": ["ground","neutral","L1","L2"],
        "277V": ["ground","neutral","L1"],
        "480V Wye": ["ground","neutral","L1","L2","L3"],
        "480V Delta": ["ground","L1","L2","L3"],

      },
    },

  };



  settings.inputs = {
    location: {
      county: {
        input_type: 'text_input',
      },
      street: {
        input_type: 'text_input',
      },
      number: {
        input_type: 'text_input',
      },
      city: {
        input_type: 'text_input',
      },
      zip_code: {
        input_type: 'text_input',
      },
    },
    map: {
      latitude: {
        input_type: 'text_input',
      },
      longitude: {
        input_type: 'text_input',
      },
      low_temp: {
        input_type: 'text_input',
        label: 'Extreme Min Temp',
      },
      high_temp_max: {
        input_type: 'text_input',
        label: 'Max Temp 0.4%',
      },
      high_temp: {
        input_type: 'text_input',
        label: 'Max Temp 2%',
      },
    },
    wind_speed:{
      wind_speed: {
        input_type: 'text_input',
      },
    	risk_category_i: {
        input_type: 'text_input',
        label: 'Risk Category I	',
      },
    	risk_category_ii: {
        input_type: 'text_input',
        label: 'Risk Category II',
      },
    	'risk_category_iii_iv': {
        input_type: 'text_input',
        label: 'Risk Category III-IV',
      },
    	windborne_debris: {
        input_type: 'text_input',
      },
    },
  //      label: '',
    roof: {
      width1: {
        options: [],
        units: 'ft.',
        label: 'Eave Width',
        note: 'This the full size of the roof, perpendictular to the slope.',
        input_type: 'number_input',
      },
      width2: {
        options: [],
        units: 'ft.',
        label: 'Ridge Width',
        note: 'This the full size of the roof, perpendictular to the slope.',
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
        options: ['1:12','2:12','3:12','4:12','5:12','6:12','7:12','8:12','9:12','10:12','11:12','12:12'],
      },
      type: {
        options: ['Gable','Shed','Hipped'],
      },
    },
    module: {
      make: {
        options: _.uniq(Components.find({type:"modules"}).map(function(doc){return doc.make;})),
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
        options: _.uniq(Components.find({type:"inverters"}).map(function(doc){return doc.make;})),
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
      Inputs.insert(input);
      section_list_alt.push(section_name);
    }

  }

  /*
  var section_list = Inputs.find({}).map(function(doc){
    return doc.section_name;
  });
  section_list = _.uniq(section_list);
  //*/
  section_list = _.uniq(section_list_alt);

  Settings.insert({
    id: 'section_list',
    value: section_list,
  });


  //settings.components.makes = Components.find({}).map(function(doc){
  //  return doc.make;
  //});
  //settings.components.models = Components.find({}).map(function(doc){
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
