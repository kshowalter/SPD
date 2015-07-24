var ready = f.section_defined;

calculate = function(user_id){
  console.log('calculate, exterminate');

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

  if( ready('module') ){
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
    console.log('active? ', Tracker.active);


  }
  console.log('user_id', user_id);
  if( ready('array') && ready('module') ){
    console.log('defined: ', 'array and module');
    system.array = system.array || {};
    system.array.isc = system.module.isc * system.array.num_strings;
    system.array.voc = system.module.voc * system.array.modules_per_string;
    system.array.imp = system.module.imp * system.array.num_strings;
    system.array.vmp = system.module.vmp * system.array.modules_per_string;
    system.array.pmp = system.array.vmp  * system.array.imp;

    system.array.number_of_modules = system.array.modules_per_string * system.array.num_strings;
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
