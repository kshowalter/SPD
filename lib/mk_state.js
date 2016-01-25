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
      //location:ew_address = false,
      maps: {},

    }

  };



  return init_state;
};
