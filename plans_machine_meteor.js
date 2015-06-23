console.log(' ______  ');
console.log(' \\    / ');
console.log('  \\  /  ');
console.log('   \\/   ');


var dev = true;
if(dev) g = f.settings_dev_defaults(g);



if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);



  console.log(settings.input);

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup


    if(dev) {
      for( var section_name in settings.user_input ){
        for( var input_name in settings.user_input[section_name] ){
          console.log(section_name,input_name,settings.user_input[section_name][input_name]);
          Values.update(
            {section_name:section_name,name:input_name},
            {$set:{
              value: settings.user_input[section_name][input_name]
            }}
          );
        }
      }
    }

  });

  /*
  Meteor.publish('modules', function() {
    console.log('publishing modules collection');
    return Files.find({});
  });

  Meteor.publish('NEC_tables', function() {
    console.log('publishing NEC_tables collection');
    return Files.find({});
  });
  //*/

}


console.log('   /\\   ');
console.log('  /  \\  ');
console.log(' /    \\ ');
console.log(' ------  ');
