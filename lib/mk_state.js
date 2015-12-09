mk_state = function(){
  //console.log('making state');

  var i;
  //var stateCalculated = require('./stateCalculated.js');

  // Load 'user' defined state
  //var mk_state = require('../data/state.json.js');
  //f.mk_state = mk_state;

  state = {};

  g = state;


  state.temp = {};

  state.system_data = {};
  state.system_data.geocode = {};
  state.system_data.location = {
    address: false,
    city: false,
    zip_code: false,
  };
  //state.system_data.location.new_address = false;
  state.system_data.maps = {};

  state.config_options = {};
  //state.config_options.NEC_tables = require('../data/tables.json');
  //state.config_options.NEC_tables = Assets.getText('data/tables.json');
  //console.log(state.config_options.NEC_tables);

  state.status = {};
  state.notes = [];

  state.status.database_loaded = false;

  state.data = {};

  state.data.opt = {
    inverter: {
      loadcenter: {
        '240V/120V': ['240V','120V'],
        '208V/120V': ['208V','120V'],
        '480V/277V': ['480V Wye','480V Delta','277V'],
      },
      conductors: {
        "120V": ["ground","neutral","L1"],
        "240V": ["ground","neutral","L1","L2"],
        "208V": ["ground","neutral","L1","L2"],
        "277V": ["ground","neutral","L1"],
        "480V Wye": ["ground","neutral","L1","L2","L3"],
        "480V Delta": ["ground","L1","L2","L3"],
      },
    },
  };



  // load layers

  state.drawing = {};

  state.drawing_state = {};
  state.drawing_state.layer_attr = layer_attr;
  state.drawing_state.fonts = fonts;

  state.drawing.blocks = {};

  // Load drawing specific state
  // TODO Fix state_drawing with new variable locations
  state = state_drawing(state);

  //state.status_app.version_string = version_string;

  //state = f.nullToObject(state);

  state.select_registry = [];
  //state.value_registry = [];


  //var config_options = state.config_options = state.config_options || {};

  state.webpage = {};

  state.webpage.selected_modules_total = 0;
  state.webpage.selected_modules = [];

  state.components = {};

  state.drawing_state.sheets = [
      {
          num: 'G-001',
          desc: 'Title'
      },
      {
          num: 'W-001',
          desc: 'Wiring Diagram'
      },
      {
          num: 'W-002',
          desc: 'Instructions'
      },
      {
          num: 'W-003',
          desc: 'System Specifications'
      },
      {
          num: 'S-001',
          desc: 'Roof Section 1'
      },
  ];




  // Load functions and add them the the global object




  //setSetting('process', false);


  return state;
};
