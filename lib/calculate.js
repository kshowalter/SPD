var defined = f.section_defined;

calculate = function(user_id){

  //console.log('f.process');
  var f = settings.f;

  //copy inputs from settings.input to settings.system.
  f.merge_objects(settings.user_input, settings.system);


  //console.log('---settings---', settings);
  var config_options = settings.config_options;
  var system = settings.system;
  var loc = settings.drawing_settings.loc;
  var size = settings.drawing_settings.size;
  var state = settings.state;

  var inputs = settings.inputs;



  // Update settings and calculations

  if( state.database_loaded ){
    inputs.DC = settings.inputs.DC || {};
    inputs.DC.wire_size = settings.inputs.DC.wire_size || {};
    inputs.DC.wire_size.options = inputs.DC.wire_size.options || f.obj_names(settings.config_options.NEC_tables['Ch 9 Table 8 Conductor Properties']);


  }


  if( f.section_defined('array') && f.section_defined('module') ){
    system.array = system.array || {};
    system.array.isc = system.module.isc * system.array.num_strings;
    system.array.voc = system.module.voc * system.array.modules_per_string;
    system.array.imp = system.module.imp * system.array.num_strings;
    system.array.vmp = system.module.vmp * system.array.modules_per_string;
    system.array.pmp = system.array.vmp  * system.array.imp;

    system.array.number_of_modules = system.array.modules_per_string * system.array.num_strings;


  }


  if( f.section_defined('DC') ){

    system.DC.wire_size = "-Undefined-";

  }


  if( f.section_defined('inverter') ){

  }

  //inputs.AC.loadcenter_type = settings.f.obj_names(inputs.AC.loadcenter_types);
  if( system.AC.loadcenter_types ) {
    var loadcenter_type = system.AC.loadcenter_types;
    var AC_options = inputs.AC.loadcenter_types[loadcenter_type];
    inputs.AC.type.options = AC_options;
    //in.opt.AC.types[loadcenter_type];

    //inputs.AC['type'] = f.obj_names( settings.in.opt.AC.type );
  }
  if( system.AC.type ) {
    system.AC.conductors = settings.in.opt.AC.types[system.AC.type];
    system.AC.num_conductors = system.AC.conductors.length;

  }
  if( f.section_defined('AC') ){

    system.AC.wire_size = "-Undefined-";
  }

  size.wire_offset.max = size.wire_offset.min + system.array.num_strings * size.wire_offset.base;
  size.wire_offset.ground = size.wire_offset.max + size.wire_offset.base*1;
  loc.array.left = loc.array.right - ( size.string.w * system.array.num_strings ) - ( size.module.frame.w*3/4 ) ;









  values = User_data.find({}).fetch();
  //var v = {};
  var v;
  var system;
  v = system = settings.system = {};

  User_data.find({}).forEach(function(variable){
    settings.system[variable.section_name] = settings.system[variable.section_name] || {};
    settings.system[variable.section_name][variable.value_name] = variable.value;
  });
// user data loaded into variable "v"
//////////////////////////////////////////////////////

  if( defined('module') ){
    console.log('defined: ', 'module');

    var specs = Components.findOne({ make:system.module.make, model:system.module.model });
    if(specs){
      system.module.pmp = specs.pmp;
      system.module.isc = specs.isc;
      system.module.voc = specs.voc;
      system.module.imp = specs.imp;
      system.module.vmp = specs.vmp;
      system.module.width = specs.width;
      system.module.length = specs.length;
    } else {
      console.log('specs not found');
    }


  }
  console.log('user_id', user_id);
  if( defined('array') && defined('module') ){
    console.log('defined: ', 'array and module');
    system.array = system.array || {};
    system.array.isc = system.module.isc * system.array.num_strings;
    system.array.voc = system.module.voc * system.array.modules_per_string;
    system.array.imp = system.module.imp * system.array.num_strings;
    system.array.vmp = system.module.vmp * system.array.modules_per_string;
    system.array.pmp = system.array.vmp  * system.array.imp;

    system.array.number_of_modules = system.array.modules_per_string * system.array.num_strings;
  }

  if( defined('location') ){
      //console.log('address ready');
      //f.request_geocode();
      settings.perm.location.new_address = false;
      for( var name in settings.system.location ){
          if( settings.system.location[name] !== settings.perm.location[name]){
              settings.perm.location.new_address = true;
          }
          settings.perm.location[name] = settings.system.location[name];
      }

  }


/*
//*/

//////////////////////////////////////////////////////
  // return values to collection database

  //Meteor.call('update_user_data', function(err){
  //  console.log('called update_user_data');
  //  if(err) console.log('error: ', err);
  //});

};
