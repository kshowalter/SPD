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
        for( var value_name in settings.user_input[section_name] ){
          console.log( section_name, value_name, settings.user_input[section_name][value_name] );
          var new_value = settings.user_input[section_name][value_name];
          setValue( section_name, value_name, new_value );
        }
      }
    }

    Values.find({ section_name:"module", value_name:"make" }).observe({
      changed: function(doc){
        console.log('new value for module make: ', doc);
        var new_options = _.uniq(Components
          .find({
            type:"modules",
            make:getValue('module', 'make')
          }).map(function(doc){return doc.model;}
        ));
        setOptions("module", "model", new_options );
      },
      //setValue = function(section_name, value_name, new_value);
    });

    f.process(settings);

    Values.find({type:"user"}).observe({
      changed: function(dic){
        console.log("something changed, recalculating");
        f.process(settings)
      }
    });



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
