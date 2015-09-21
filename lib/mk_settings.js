mk_settings = function(){
  //console.log('making settings');

  var i;
  //var settingsCalculated = require('./settingsCalculated.js');

  // Load 'user' defined settings
  //var mk_settings = require('../data/settings.json.js');
  //f.mk_settings = mk_settings;

  settings = {};

  g = settings;


  settings.temp = {};

  settings.system_data = {};
  settings.system_data.geocode = {};
  settings.system_data.location = {};
  settings.system_data.location.new_address = false;
  settings.system_data.maps = {};

  settings.config_options = {};
  //settings.config_options.NEC_tables = require('../data/tables.json');
  //settings.config_options.NEC_tables = Assets.getText('data/tables.json');
  //console.log(settings.config_options.NEC_tables);

  settings.state = {};
  settings.state.database_loaded = false;

  settings.data = {};

  settings.data.opt = {
    AC: {
      loadcenter: {
        '240V': ['240V','120V'],
        '208/120V': ['208V','120V'],
        '480/277V': ['480V Wye','480V Delta','277V'],
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

  settings.drawing = {};

  settings.drawing_settings = {};
  settings.drawing_settings.layer_attr = layer_attr;
  settings.drawing_settings.fonts = fonts;

  settings.drawing.blocks = {};

  // Load drawing specific settings
  // TODO Fix settings_drawing with new variable locations
  settings = settings_drawing(settings);

  //settings.state_app.version_string = version_string;

  //settings = f.nullToObject(settings);

  settings.select_registry = [];
  //settings.value_registry = [];


  //var config_options = settings.config_options = settings.config_options || {};

  settings.webpage = {};

  settings.webpage.selected_modules_total = 0;
  settings.webpage.selected_modules = {};

  settings.components = {};

  settings.drawing_settings.sheets = [
      {
          num: 'G-001',
          desc: 'Title Sheet'
      },
      {
          num: 'W-001',
          desc: 'PV system wiring diagram'
      },
      {
          num: 'W-002',
          desc: 'PV system specifications'
      },
      {
          num: 'S-001',
          desc: 'Roof details'
      },
  ];




  // Load functions and add them the the global object




  //setSetting('process', false);


  return settings;
};
