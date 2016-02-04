mk_state = function(){
  var init_state = {
    webpage: {
      selected_modules_total: 0,
      selected_modules: []
    },
    system_data: {
      geocode: {},
      location: {
        address: false,
        city: false,
        zip_code: false,
      },
      maps: {},
    },
    status: {
      database_loaded: false,
    },
    notes: [],
    warnings: [],
    errors: [],
  };



  return init_state;
};
