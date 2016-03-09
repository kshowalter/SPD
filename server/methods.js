Meteor.methods({
   connect: function(){
    return Random.id();
  },
  reset: function(){
    var user_id = this.userId;
    var active_system = Meteor.users.findOne({_id:user_id}).active_system;
    //console.log(user_id, Meteor.user());
    System_data.remove({system_id:active_system});
    //setup_user_data(user_id);
    setup_new_system_data(active_system);

    return user_id;
  },
  new_system: function(){
    var user_id = this.userId;

    var old_system_number = Meteor.user().last_system_number || 0;
    var system_number = old_system_number + 1;
    Meteor.users.update(this.userId,
      {$set:
        {last_system_number: system_number}
      }
    );

    var system_id = Random.id();
    var new_system_info = {
      system_number: system_number,
      user_id: user_id,
      system_id: system_id,
      system_settings: {},
      svgs: [],
      geocode_info: {}
    };
    User_systems.insert(new_system_info);

    setup_new_system_data(system_id);

    Meteor.users.update(
      user_id,
      { $set: {active_system: system_id } }
    );
  },
  delete_system: function(){
    var active_system = Meteor.users.findOne({_id:this.userId}).active_system;
    System_data.remove({system_id:active_system});
    User_systems.remove({system_id:active_system});

    var user_id = this.userId;
    var user_system_list = User_systems.find({system_id:active_system}).fetch();
    var new_system_id = user_system_list[user_system_list.length-1];

    Meteor.users.update(
      user_id,
      { $set: {active_system: new_system_id } }
    );
  },
  clear_user: function(){
    var user_system_list = User_systems.find({user_id:this.userId}).map(function(system){
      return system.system_id;
    });
    console.log(user_system_list);
    user_system_list.forEach(function(system_id){
      System_data.remove({system_id:system_id});
    });
    User_systems.remove({user_id:this.userId});
    /*
    User_systems.find({user_id:this.userId}).map(function(system){
    });
    */

    Meteor.users.update(
      this.userId,
      { $unset: {active_system: ''} }
    );
  },




  new_active_system: function(system_id){
    var user_id = this.userId;
    Meteor.users.update(
      user_id,
      { $set: {active_system: system_id } }
    );
    return true;
  },
//  update_user_data: function(v){
//    console.log('I will now update the user data');
//
//    for( var section_name in v ){
//      for( var value_name in v[section_name] )
//      System_data.update(
//        { section_name:section_name, value_name:value_name },
//        {$set:{ value: v[section_name][value_name] }}
//      );
//    }
//  },
//  change_model_options: function(section_name){
//    console.log('change_model_options');
//    var new_options = _.uniq(PV_Components
//      .find({
//        type: section_name+'s',
//        make: getValue(section_name, 'make')
//      }).map(function(doc){return doc.model;}
//    ));
//
//    var active_system = Meteor.users.findOne({_id:this.userId}).active_system;
//    System_data.update(
//      { section_name:section_name, value_name:'model', system_id: active_system },
//      //{ section_name:'module', value_name:'model'},
//      {'$set':{
//        options: new_options
//      }},
//      function(a,b){
//        console.log('-changed', a, b );
//      }
//    );
//    return 'server did something';
//  },

  download: function(){
    console.log('generate drawing method');
    var active_system = Meteor.users.findOne({_id:this.userId}).active_system;
    var result = mk_drawing(active_system);
    //return result;
    return active_system;

  },

  select_module: function(selected_modules){
    var active_system = Meteor.users.findOne({_id:this.userId}).active_system;
    User_systems.upsert(
      {system_id: active_system },
      {$set:
        {selected_modules:selected_modules}
      }
    );
    var select_modules_string = '';
    selected_modules.slice(1).forEach(function(row, r){
      row.slice(1).forEach(function(column, c){
        if(column){
          select_modules_string +=  (r+1) + ',' + (c+1) + ' ';
        }
      });
    });
    System_data.upsert(
      {system_id: active_system, section_name: 'array', value_name: 'selected_modules' },
      {$set:{
        value: select_modules_string

      }}
    );
  },
  save_system_settings: function(system){
    var active_system = Meteor.users.findOne({_id:this.userId}).active_system;
    User_systems.upsert(
      {system_id: active_system },
      {$set:
        {system_settings:system}
      }
    );
    //for( var section_name in system ){
    //  for( var value_name in system[section_name] ){
    //    System_data.upsert(
    //      {system_id: active_system, section_name: section_name, value_name: value_name },
    //      {$set:
    //        {value: system[section_name][value_name] }
    //      }
    //    );
    //  }
    //}
  },
  get_location_information: function(system_settings){
    var system_id = Meteor.users.findOne({_id:this.userId}).active_system;


    var location_input = {
      address: System_data.findOne({system_id: system_id, section_name:'location', value_name:'address'}).value,
      city: System_data.findOne({system_id: system_id, section_name:'location', value_name:'city'}).value,
      zip_code: System_data.findOne({system_id: system_id, section_name:'location', value_name:'zip_code'}).value,
    };

    var geocode_info = User_systems.findOne({system_id: system_id}).geocode_info;
    console.log( 'geocode_info', geocode_info );



    if( geocode_info.address  !== location_input.address ||
        geocode_info.city     !== location_input.city ||
        geocode_info.zip_code !== location_input.zip_code ){
      geocode_info.new_address = true;
      geocode_info.address  = location_input.address;
      geocode_info.city     = location_input.city;
      geocode_info.zip_code = location_input.zip_code;

      var address = encodeURIComponent([
        geocode_info.address,
        geocode_info.city,
        'FL',
        geocode_info.zip_code
      ].join(', ') );

      console.log('address', encodeURIComponent);

      var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        address +
        'key=' + 'AIzaSyDX7ifC3rpZmFT4G-NNzPdFkomoM3uI-ME';

      //console.log(url);
      try{

        location_data = Meteor.http.call('GET', url);

        if( location_data.results[0].geometry.location !== undefined ){
          console.log('New location from address', location_data);
          var lat = location_data.results[0].geometry.location.lat;
          var lon = location_data.results[0].geometry.location.lng;
          geocode_info.data = location_data;
          geocode_info.lat = lat;
          geocode_info.lon = lon;

          geocode_info.closest_station = wind_stations.get_closest(lat, lon);

          if( geocode_info.new_address ){
            /*
            permit.getWind(geocode_info.lat, geocode_info.lat, function(windData) {
              var geocode_info = User_systems.getOne({system_id:system_id}).geocode_info;
              geocode_info.windData = windData;
              User_systems.update(
                {system_id:system_id},
                {$set:
                  {geocode_info:geocode_info}
                }
              );
            });
            geocode_info.new_address.new_address = false;
            */
          }

        } else {
          console.log('Address not found ' + crossMark);
        }

      } catch(e) {
        console.log('geocode error: ', e);
      }

    } else {
      console.log('Address unchanged');
    }

    [
      'lat',
      'lon'
    ].forEach(function(name){
      System_data.upsert(
        {system_id: system_id, section_name: 'location', value_name: name },
        {$set:
          {value: geocode_info[name] }
        }
      );

    });

    [
      'Elev.',
      'High Temp 0.4%',
      'High Temp 2% Avg.',
      'Distance above roof 0.5"',
      'Distance above roof 3.5"',
      'Distance above roof 12"',
      'Extreme min',
      'lat',
      'lon'
    ].forEach(function(name){
      System_data.upsert(
        {system_id: system_id, section_name: 'closest_station', value_name: name },
        {$set:
          {value: geocode_info.closest_station[name] }
        }
      );
    });


  },




});
