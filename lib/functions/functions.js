f = {};



f.mk_sheet_num = {};
f.mk_preview = {};


f.setup_body = function(title, sections){
  document.title = title;
  var body = document.body;
  var status_bar = document.createElement('div');
  status_bar.id = 'status';
  status_bar.innerHTML = 'loading status...';
  body.insertBefore(status_bar, body.firstChild);
};

f.pad_zero = function(num, size){
  var s = '000000000' + num;
  return s.substr(s.length-size);
};

f.uptime = function(boot_time){
  var uptime_seconds_total = moment().diff(boot_time, 'seconds');
  var uptime_hours = Math.floor(  uptime_seconds_total /(60*60) );
  var minutes_left = uptime_seconds_total %(60*60);
  var uptime_minutes = f.pad_zero( Math.floor(  minutes_left /60 ), 2 );
  var uptime_seconds = f.pad_zero( (minutes_left % 60), 2 );
  return uptime_hours +":"+ uptime_minutes +":"+ uptime_seconds;
};

f.update_status_bar = function(status_id, boot_time, string) {
  var status_div = document.getElementById(status_id);
  status_div.innerHTML = string;
  status_div.innerHTML += ' | ';

  var clock = document.createElement('span');
  clock.innerHTML = moment().format('YYYY-MM-DD HH:mm:ss');

  var uptime = document.createElement('span');
  uptime.innerHTML = 'Uptime: ' + f.uptime(boot_time);

  status_div.appendChild(clock);
  status_div.innerHTML += ' | ';
  status_div.appendChild(uptime);
};


f.obj_names = function( object ) {
  if( object !== undefined ) {
    var a = [];
    for( var id in object ) {
      if( object.hasOwnProperty(id) )  {
        a.push(id);
      }
    }
    return a;
  }
};

f.object_defined = function(object){
  //console.log(object);
  for( var key in object ){
    if( object.hasOwnProperty(key) ){
      //console.log(key);
      if( object[key] === null || object[key] === undefined ) return false;
    }
  }
  return true;
};

//f.section_defined = function(settings, section_name){
//    //console.log("-"+section_name);
//    //var input_section = g.inputs[section_name];
//    //var output_section = g.system[section_name];
//    var output_section = settings.user_input[section_name];
//    for( var key in output_section ){
//        if( output_section.hasOwnProperty(key) ){
//            //console.log(key);
//
//            if( output_section[key] === undefined || output_section[key] === null ) {
//                return false;
//            }
//        }
//    }
//    return true;
//};


f.section_defined = function(system_id, section_name){
  //console.log('checking...' );

  var active_system;
  if(Meteor.isClient){
    active_system = Meteor.user().active_system;
  }
  if(Meteor.isServer){
    //active_system = settings.state.active_system;
    active_system = system_id;
  }
  //console.log('section_name: ', section_name)

  var defined = false;
  if( typeof active_system === 'string' ){
    defined = true;
    //console.log('user_id', typeof user_id, user_id);
    //console.log('/checking: ', section_name, ', for user: ', user_id);
    //console.log(System_data.find({section_name:section_name}).fetch());
    System_data.find({ system_id:active_system, section_name:section_name}).forEach(function(doc){
      if( ! doc.value ) {
        defined = false;
        return;
      }
    });
  } else {
    defined = false;
  }
  //console.log('\\done checking: ', section_name);
  return defined;
};

section_defined = f.section_defined;

f.values_defined = function( settings, value_obj ){
  var defined = true;
  for( var section in value_obj ){
    //for( var name in value_obj[section]){
    value_obj[section].forEach(function(name){
      if( ! settings.system[section][name] ) {
        defined = false;
        return defined;
      }
    });
    //}
  }
  return defined;
};

f.nullToObject = function(object){
  for( var key in object ){
    if( object.hasOwnProperty(key) ){
      if( object[key] === null ){
        object[key] = {};
      } else if( typeof object[key] === 'object' ) {
        object[key] = f.nullToObject(object[key]);
      }
    }
  }
  return object;
};

f.blank_copy = function(object){
  var newObject = {};
  for( var key in object ){
    if( object.hasOwnProperty(key) ){
      if( object[key].constructor === Object ) {
        newObject[key] = {};
        for( var key2 in object[key] ){
          if( object[key].hasOwnProperty(key2) ){
            newObject[key][key2] = null;
          }
        }
      } else {
        newObject[key] = null;
      }
    }
  }
  return newObject;
};

f.add_sections = function(inputs){
  var blank_user_input = {};
  for( var section_name in inputs ){
    if( inputs.hasOwnProperty(section_name) ){
      if( inputs[section_name].constructor === Object ) {
        blank_user_input[section_name] = {};
        for( var name in inputs[section_name] ){
          if( inputs[section_name].hasOwnProperty(name) ){
            blank_user_input[section_name][name] = null;
          }
        }
      } else {
        console.log('error: section not object');
      }
    }
  }
  return blank_user_input;

};

f.blank_clean_copy = function(object){
  var newObject = {};
  for( var key in object ){
    if( object.hasOwnProperty(key) ){
      if( object[key].constructor === Object ) {
        newObject[key] = {};
        for( var key2 in object[key] ){
          if( object[key].hasOwnProperty(key2) ){
            var clean_key = f.clean_name(key2);
            newObject[key][clean_key] = null;
          }
        }
      } else {
        newObject[key] = null;
      }
    }
  }
  return newObject;
};

//f.merge_objects = function merge_objects(object1, object2){
//    for( var key in object1 ){
//        if( object1.hasOwnProperty(key) ){
//            //if( key === 'make' ) console.log(key, object1, typeof object1[key], typeof object2[key]);
//            //console.log(key, object1, typeof object1[key], typeof object2[key]);
//            if( object1[key] && object1[key].constructor === Object ) {
//                if( object2[key] === undefined ) object2[key] = {};
//                merge_objects( object1[key], object2[key] );
//            } else {
//                if( object2[key] === undefined ) object2[key] = null;
//            }
//        }
//    }
//};

f.merge_objects = function merge_objects(object1, object2){
  for( var key in object1 ){
    if( object1.hasOwnProperty(key) ){
      //if( key === 'make' ) console.log(key, object1, typeof object1[key], typeof object2[key]);
      //console.log(key, object1, typeof object1[key], typeof object2[key]);
      if( object1[key] && object1[key].constructor === Object ) {
        if( object2[key] === undefined ) object2[key] = {};
        merge_objects( object1[key], object2[key] );
      } else {
        object2[key] = object1[key];
      }
    }
  }
};

f.array_to_object = function(arr) {
  var r = {};
  for (var i = 0; i < arr.length; ++i)
  r[i] = arr[i];
  return r;
};

f.nan_check = function nan_check(object, path){
  if( path === undefined ) path = "";
  path = path+".";
  for( var key in object ){
    //console.log( "NaNcheck: "+path+key );

    if( object[key] && object[key].constructor === Array ) object[key] = f.array_to_object(object[key]);


    if(  object[key] && ( object.hasOwnProperty(key) || object[key] !== null )){
      if( object[key].constructor === Object ){
        //console.log( "  Object: "+path+key );
        nan_check( object[key], path+key );
      } else if( object[key] === NaN || object[key] === null ){
        console.log( "NaN: "+path+key );
      } else {
        //console.log( "Defined: "+path+key, object[key]);

      }
    }

  }
};

f.str_to_num = function str_to_num(input){
  var output;
  if(!isNaN(input)) output = Number(input);
  else output = input;
  return output;
};


f.pretty_word = function(name){
  return name.charAt(0).toUpperCase() + name.slice(1);
};

f.pretty_name = function(name){
  var l = name.split('_');
  l.forEach(function(name_seqment,i){
    l[i] = f.pretty_word(name_seqment);
  });
  var pretty = l.join(' ');

  return pretty;
};

f.pretty_names = function(object){
  var new_object = {};
  for( var key in object ){
    if( object.hasOwnProperty(key) ){
      var new_key = f.pretty_name(key);
      new_object[new_key] = object[key];
    }
  }
  return new_object;
};

f.clean_name = function(name){
  return name.split(' ')[0];
};



f.load_database = function(FSEC_database_obj){
  FSEC_database_obj = f.lowercase_properties(FSEC_database_obj);
  var components = {};
  components.inverters = {};
  FSEC_database_obj.inverters.forEach(function(component){
    if( components.inverters[component.make] === undefined ) components.inverters[component.make] = {};
    //components.inverters[component.make][component.make] = f.pretty_names(component);
    components.inverters[component.make][component.model] = component;
  });
  components.modules = {};
  FSEC_database_obj.modules.forEach(function(component){
    if( components.modules[component.make] === undefined ) components.modules[component.make] = {};
    //components.modules[component.make][component.make] = f.pretty_names(component);
    components.modules[component.make][component.model] = component;
  });

  return components;
};


f.get_ref = function(string, object){
  var ref_array = string.split('.');
  var level = object;
  ref_array.forEach(function(level_name,i){
    if( typeof level[level_name] === 'undefined' ) {
      return false;
    }
    level = level[level_name];
  });
  return level;
};
f.set_ref = function( object, ref_string, value ){
  var ref_array = ref_string.split('.');
  var level = object;
  ref_array.forEach(function(level_name,i){
    if( typeof level[level_name] === 'undefined' ) {
      return false;
    }
    level = level[level_name];
  });

  return level;
};




f.log_if_database_loaded = function(e){
  if(f.g.state.database_loaded) {
    console.log(e);
  }
};



f.lowercase_properties = function lowercase_properties(obj) {
  var new_object = new obj.constructor();
  for( var old_name in obj ){
    if (obj.hasOwnProperty(old_name)) {
      var new_name = old_name.toLowerCase();
      if( obj[old_name].constructor === Object || obj[old_name].constructor === Array ){
        new_object[new_name] = lowercase_properties(obj[old_name]);
      } else {
        new_object[new_name] = obj[old_name];
      }
    }

  }
  return new_object;
};


f.toggle_module = function(element){
  console.log('switch', element, element.classLis );

  //element.setAttribute("fill", null);

  var elem = $(element);
  //console.log('switch', elem[0].classList.contains('preview_structural_module') );

  var r = element.getAttribute('module_ID').split(',')[0];
  var c = element.getAttribute('module_ID').split(',')[1];

  if( g.webpage.selected_modules[r][c] ){
    g.webpage.selected_modules[r][c] = false;
    g.webpage.selected_modules_total--;
  } else {
    g.webpage.selected_modules[r][c] = true;
    g.webpage.selected_modules_total++;
  }

  /*
  var layer;
  if( elem[0].classList.contains('svg_preview_structural_module_selected') ){
  //g.webpage.selected_modules[r][c] = true;
  //layer = g.drawing_settings.layer_attr.preview_structural_module;
  //element.setAttribute("class", "svg_preview_structural_module");
} else {
g.webpage.selected_modules = g.webpage.selected_modules +1 || 1;
//layer = g.drawing_settings.layer_attr.preview_structural_module_selected;
//element.setAttribute("class", "svg_preview_structural_module_selected");
}
//*/
//console.log( g.webpage.selected_modules);
//for( var attr_name in layer ){
//    element.setAttribute(attr_name, layer[attr_name]);

//}

update();

/*
if( elem.hasClass("svg_preview_structural_module") ){
elem.removeClass("svg_preview_structural_module");
elem.addClass("svg_preview_structural_module_selected");
} else if( elem.hasClass("svg_preview_structural_module_selected") ){
elem.removeClass("svg_preview_structural_module_selected");
elem.addClass("svg_preview_structural_module");
} else {
elem.addClass("svg_preview_structural_module");
}
*/
};


f.clear_object = function(obj){
  for( var id in obj ){
    if( obj.hasOwnProperty(id)){
      delete obj[id];
    }
  }
};

// clear drawing
f.clear_drawing = function() {
  for( var id in g.drawing ){
    if( g.drawing.hasOwnProperty(id)){
      f.clear_object(g.drawing[id]);
    }
  }
};



f.query_string = function () {
  // Based on
  // http://stackoverflow.com/a/979995
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  var i;
  for ( i=0; i<vars.length; i++ ) {
    var pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  }
  return query_string;
};

f.request_geocode = function(){
  if( section_defined(settings.state.active_system,  'location') ){
    var address_new = g.system_data.location.new_address;

    if( address_new || g.system_data.location.lat === undefined || g.system_data.location.lat === undefined ) {
      console.log('new address');
      var address = encodeURIComponent([
        g.system_data.location.address,
        g.system_data.location.city,
        'FL',
        g.system_data.location.zip
      ].join(', ') );
      console.log('-address', address);
      var loading_mini = '<img src="./data/loading_mini.gif" alt="Loading...">';
      $('#geocode_display').html('Requesting coordinates...' + loading_mini); //
      $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + address, f.set_coordinates_from_geocode );

    } else {
      $('#geocode_display').text('Address unchanged');
      f.set_coordinates_from_geocode();
    }
  } else {
    $('#geocode_display').text('Please enter address');
  }
};


f.set_map_marker = function(){
  var latlng = L.latLng( g.system_data.location.lat, g.system_data.location.lon );
  g.system_data.maps.marker_sat.setLatLng( latlng );
  g.system_data.maps.marker_road.setLatLng( latlng );
  g.system_data.maps.map_sat.setView( latlng );
  console.log('makers_updated');
};


f.set_coordinates = function(lat, lon){
  g.system_data.location.lat   = lat;
  g.system_data.location.lon   = lon;
  g.system.location.lat = lat;
  g.system.location.lon = lon;
  g.system_data.location.closest_station = wind_stations.get_closest(lat, lon);

  // obtain wind risk category data for lat and lon
  // ---------------
  var loading_mini = '<img src="./data/loading_mini.gif" alt="Loading...">';

  $('#geocode_display').html('Fetching Wind Data...' + loading_mini);
  $.getJSON('./wind/' + g.system.location.lat + '/' + g.system.location.lon, f.get_risk_categories);
  // ---------------

  update();
};

f.get_risk_categories = function(data){
  var checkMark = '<img src="./data/check.png" alt="Checked">';
  var crossMark = '<img src="./data/cross.png" alt="Error">';
  if( data !== undefined ){
    $('#geocode_display').html('Wind data loaded ' + checkMark);
    console.log('Wind data from address: ', data);

    // Add wind data to this location's dataset
    g.system.wind = g.system.wind || {};
    for( var name in data){
      g.system.wind[name] = data[name];
    }

    console.log("g.system.location.wind=>" + JSON.stringify(g.system.location.wind));
    update();

  } else {
    $('#geocode_display').html("Wind Data not found" + crossMark);
  }

};

f.set_coordinates_from_map = function(e){
  f.set_coordinates( e.latlng.lat, e.latlng.lng );
};

f.set_coordinates_from_geocode = function(data){
  var checkMark = '<img src="./data/check.png" alt="Checked">';
  var crossMark = '<img src="./data/cross.png" alt="Error">';
  if( data === undefined && g.system_data.location.lat !== undefined ){ // loading last locations
    f.set_coordinates( g.system_data.geocode.lat, g.system_data.geocode.lng );
  } else if( data[0] !== undefined ){
    $('#geocode_display').html('Address loaded ' + checkMark);
    console.log('New location from address', data);
    g.system_data.geocode.data = data;
    g.system_data.geocode.lat = data[0].lat;
    g.system_data.geocode.lon = data[0].lon;
    f.set_coordinates( data[0].lat, data[0].lon );
  } else {
    $('#geocode_display').html('Address not found ' + crossMark);
  }

};






f.are_we_there_yet = function are_we_there_yet(test, callback){
  if( test() ){
    //console.log('test: PASS');
    callback();
  } else {
    //console.log('test: fail');
    //*
    // may need polyfill for IE9
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout
    setTimeout(
      are_we_there_yet,
      10,
      test,
      callback
    );
    //*/
  }
};

f.mk_ready = function(names, callback){
  var list = {};
  names.forEach(function(name){
    list[name] = false;
  });
  var ready = false;

  return function(name){
    //console.log('name:', name);
    if(name){
      list[name] = true;
    }
    for( name in list){
      if( list[name] === false ){
        return false;
      }
    }
    //console.log('ready!!!!!', list);
    if(callback){
      callback();
    }
    return true;
  };

};
