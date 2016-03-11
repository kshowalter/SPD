mk_inputs = function(settings){
  settings = settings || {};
  settings.state = settings.state || {};
  var state = settings.state;

  state.inputs = {
    contractor: {
      contractor_name: {
        input_type: 'text_input',
      },
      hidden_input: {
        input_type: 'text_input',
        disabled: true
      },
      contractor_license: {
        input_type: 'text_input',
      },
      license_type: {
        options:[
          'State Certified Solar Contractor',
          'State Licensed Electrical Contractor'
        ]
      },
      confirm_contractor_will_comply_with_AHJ: {
        input_type: 'confirm',
        onDrawing: false,
        label: 'The Licensed Solar Installer shall comply with the requirements of the Authority Having Jurisdiction (AHJ) and use properly licensed subcontractors for work in conjunction with the PV installation that exceeds the scope of their license?'
      },
      confirm_is_permitted_roof_structure: {
        input_type: 'confirm',
        onDrawing: false,
        label: 'Is the PV Array to be installed on defined, permitted roof structure?'
      },
      confirm_array_will_comply_with_AHJ: {
        input_type: 'confirm',
        onDrawing: false,
        label: 'Does the PV Array comply with all requirements of the Authority Having Jurisdiction for fire ratings?'
      },
      confirm_compliance_with_NEC_2011: {
        input_type: 'confirm',
        onDrawing: false,
        label: 'Does the PV system design and installation comply with all of the the requirements of the 2011 version of the NEC Article 690?'
      },
      confirm_compliance_with_UL_1703: {
        input_type: 'confirm',
        onDrawing: false,
        label: 'Are the PV modules and required components listed and labeled per the requirements of UL 1703?'
      },
      confirm_compliance_with_manufacturer_requirements: {
        input_type: 'confirm',
        onDrawing: false,
        label: 'Are the PV modules and required components listed installed in accordance with the manufacturer\'s installation requirements?'
      },
      confirm_compliance_with_FSEC: {
        input_type: 'confirm',
        onDrawing: false,
        label: 'Does the PV system, it\'s components and electrical design have a Florida Solar Energy Center System Certification ?'
      }





    },
    location: {
      county: {
        options:['Broward', 'Miami-Dade', 'Orange', 'Alachua', 'Brevard' ]
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
      //building_type: {
      //  options: ['Residential', 'Commercial']
      //},
      direction_to_road: {
        note: 'Direction of the road relative to the building.',
        options: ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'],
        onDrawing: false,
      },
      //risk_category: {
      //  //input_type: 'radio',
      //  options: ['I','II','III','IV'],
      //  default: 'II',
      //},
      exposure_category: {
        //input_type: 'radio',
        options: ['C','D'],
        value: 'C',

      },
    },
    roof: {
      confirm_wood_structural_members_spacing: {
        input_type: 'confirm',
        onDrawing: false,
        label: [
          'Are the supporting wood structural members',
          'spaced a maximum of 2 feet on center?'
        ]
      },
      confirm_install_zone: {
        input_type: 'confirm',
        onDrawing: false,
        label: [
          'Is the PV Array installed in',
          'Zone P(1) Field of the roof only?'
        ]
      },
      confirm_gable_roof: {
        input_type: 'confirm',
        onDrawing: false,
        label: 'Will this PV Array to be installed on a Gable Roof only?'
      },
      eave_height: {
        options: [],
        units: 'ft.',
        note: 'This is height of the roof at the eave.',
        input_type: 'number_input',
      },
      ridge_height: {
        options: [],
        units: 'ft.',
        note: 'This is height of the roof at the ridge.',
        input_type: 'number_input',
      },
      least_horizontal_distance: {
        options: [],
        units: 'ft.',
        note: '',
        input_type: 'number_input',
      },
      system_type: {
        options: ['Shingle', 'Clay tile', 'Concrete tile']
      },
      wood_structural_member_type: {
        options: ['Trusses','Rafters']
      },
      num_sections: {
        //options: ['Gable','Shed','Hipped'],
        label: 'Number of sections',
        note: 'Number of seperate install locations on roof',
        options: [1],
      },
      section_shape: {
        //options: ['Gable','Shed','Hipped'],
        options: ['Rectangle'],
        onDrawing: false,
      },
      side_of_building: {
        note: 'This defines what side of the house the array is on.',
        options: ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'],
        onDrawing: false,
      },
      slope: {
        options: ['2:12','3:12','4:12','5:12','6:12','7:12','8:12','9:12','10:12','11:12','12:12'],
      },
      slope_length: {
        options: [],
        units: 'ft.',
        label: 'Slope Length',
        note: 'This the full length of the roof, measured from low to high.',
        input_type: 'number_input',
      },
      eave_width: {
        options: [],
        units: 'ft.',
        label: 'Eave Width',
        note: 'This the full width of the roof at the eave, perpendictular to the slope.',
        input_type: 'number_input',
      },
      //width2: {
      //  options: [],
      //  units: 'ft.',
      //  label: 'Ridge Width',
      //  note: 'This the full width of the roof at the ridge, perpendictular to the slope.',
      //  input_type: 'number_input',
      //},



    },
    module: {
      maximum_power_voltage:{
        input_type: 'number_input',
        note: 'Maximum Power Voltage (V)'
      },
      maximum_power_current:{
        input_type: 'number_input',
        note: 'Maximum Power Current (A) '
      },
      maximum_OCPD_rating:{
        input_type: 'number_input',
        note: 'Maximum OCPD Rating (A)'
      },
      maximum_system_voltage:{
        input_type: 'number_input',
        note: 'Maximum System Voltage Rating (V)'
      },
      temp_coef:{
        input_type: 'number_input',
        units: '%/°C',
        note: 'Temp Coeff Voc (%/°C)'
      },
      maximum_design_load_downforce: {
        input_type: 'number_input',
        note: 'Maximum design load for two-rail system (downforce)'
      },
      maximum_design_load_uplift: {
        input_type: 'number_input',
        note: 'Maximum design load for two-rail system (uplift)'
      }

    },


    array: {
      module_make: {
        options: _.uniq(PV_Components.find({type:"modules"}).map(function(doc){return doc.make;})),
      },
      module_model: {
        options: [],
      },
      module_orientation: {
        options: ['Portrait','Landscape'],
      },
      modules_per_string: {
        options: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
      },
      number_of_strings: {
        options: [1,2,3,4],
      },
    },
    inverter: {
      //loadcenter_type: {
      //  options: ['240V/120V', '208V/120V', '480V/277V'],
      //},
      distance_to_loadcenter: {
        input_type: 'number_input',
      },
      inverter_make: {
        options: _.uniq(PV_Components.find({type:"inverters"}).map(function(doc){return doc.make;})),
      },
      inverter_model: {
        options: "TBD",
      },
      location: {
        options: ['Inside', 'Outside'],
      },
      DC_Vmax: {
        input_type: 'number_input',
        note: 'Maximum dc voltage, Vmax,inv (V)',
      },
      min_DC_operating_voltage: {
        input_type: 'number_input',
        note: 'Min. dc operating voltage (V) ',
      },
      max_DC_current: {
        input_type: 'number_input',
        note: 'Max. dc operating input current (A)',
      },
      max_number_DC_inputs: {
        input_type: 'number_input',
        note: 'Number of inverter inputs or MPP trackers',
      },
      max_DC_operating_current: {
        input_type: 'number_input',
        note: 'Maximum dc operating current per inverter input or MPP tracker (A)',
      },
      max_strings: {
        input_type: 'number_input',
        note: 'Maximum number of strings per inverter input or MPP tracker',
      },
      nominal_ac_output_power: {
        input_type: 'number_input',
        note: 'Nominal AC Output Power (W)'
      },
      nominal_AC_outout_voltage: {
        input_type: 'number_input',
        note: 'Nominal AC Outout Voltage (V)'
      },
      maximum_AC_output_current: {
        input_type: 'number_input',
        note: 'Maximum AC Output Current (A)'
      },
      Maximum_OCPD_rating: {
        input_type: 'number_input',
        note: 'Maximum OCPD Rating (A)'
      },


    },
    attachment_system: {
      make: {
          options: ['UNIRAC', "Quick Mount PV", "DPW Solar"],
          type: 'select',
      },
      model: {
          options: 'TBD',
          type: 'select',
      },
      confirm_uplift: {
        input_type: 'confirm',
        onDrawing: false,
        label: 'Does the the PV array meet the roof uplift pressures for installation in the Field (Zone P 1) of Roof?'
      },
      pv_array_installed_parallel: {
        input_type: 'confirm',
        onDrawing: false,
        label: 'Is the PV Array Installed Parallel to the Roof Surface?'
      },
      array_offset_from_roof: {
        units: 'in.',
        note: 'PV Array Height Above Finished Roof.',
        input_type: 'number_input',
      },
    },

  };



  // Fill in 'TBD' options lists
  for( i=15; i<=70; i+=1 ) state.inputs.roof.eave_width.options.push(i);
  //for( i=15; i<=70; i+=1 ) state.inputs.roof.width2.options.push(i);
  //for( i=15; i<=70; i+=1 ) state.inputs.roof.width3.options.push(i);
  for( i=1; i<=25; i+=1 ) state.inputs.roof.eave_height.options.push(i);
  for( i=1; i<=25; i+=1 ) state.inputs.roof.ridge_height.options.push(i);
  for( i=15; i<=50; i+=1 ) state.inputs.roof.slope_length.options.push(i);


  // Fill in other input information
  var section_list_alt = [];
  var order;
  for( var section_name in state.inputs ){
    order = 0;
    for( var value_name in state.inputs[section_name]){
      var input = state.inputs[section_name][value_name];
      if( input.options && ! input.input_type ){
        input.input_type = 'select';
      }
      if( input.options === 'TBD'){
        input.options = false;
      }
      if( ! input.disabled ){
        input.disabled = false;
      }
      input.value_name = value_name;
      input.section_name = section_name;
      input.value = input.value || null;
      input.type = "user";
      input.order = order++;
      section_list_alt.push(section_name);
    }
  }

  return settings;
};
