Meteor.startup(function () {
  // code to run on server at startup
  Settings.remove({});
  Inputs.remove({});
  NEC_tables.remove({});

  Components.remove({});


  load_data();
  settings = mk_inputs(settings);



  /*
    if(dev) {
      for( var section_name in settings.user_input ){
        for( var value_name in settings.user_input[section_name] ){
          //console.log( section_name, value_name, settings.user_input[section_name][value_name] );
          var new_value = settings.user_input[section_name][value_name];
          setValue( section_name, value_name, new_value );
        }
      }
    }
  //*/


  //f.process(settings);

  Inputs.find({type:"user"}).observe({
    changed: function(dic){
      console.log("something changed, recalculating");
      f.process(settings);
    }
  });


  var server_ready = true;



  Meteor.publish("user_data", function () {
    return User_data.find({user_id:this.userId});
  });

  Meteor.publish("inputs", function () {
    return Inputs.find();
  });

  Meteor.publish("settings", function () {
    return Settings.find();
  });




});
