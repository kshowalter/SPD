console.log(' ______  ');
console.log(' \\    / ');
console.log('  \\  /  ');
console.log('   \\/   ');


var dev = true;
if(dev) g = f.settings_dev_defaults(g);



if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);




  var update = function(){
    console.log('updateing');
    f.process(settings);
    update_drawing();


    //$('#drawing').empty();
    //settings.drawing.svgs.forEach(function(svg){
    //  $('#drawing')
    //  //.append($('<p>Page '+p+'</p>'))
    //    .append($(svg))
    //    .append($('</br>'))
    //    .append($('</br>'));

    //});

  };

  Values.find({type:"user"}).observe({
    changed: function(doc){
      console.log("something changed, recalculating");
      update();
    },
  });

  Settings.find({id:'process'}).observe({
    changed: function(doc){
      if(doc.value){
        console.log("setting change to 'process' triggered a process");
        f.process(settings);
        setSetting('process', false);
      }
    }
  });

  var version_string = 'Preview'+moment().format('YYYYMMDD');
  //g.state.version_string = version_string;
  var boot_time = moment();
  var status_id = 'status';
  Meteor.setInterval(function(){
    f.update_status_bar(status_id, boot_time, version_string);
  },1000);



  console.log("first process");
  update();

  console.log(settings.input);

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

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


    f.process(settings);

    Values.find({type:"user"}).observe({
      changed: function(dic){
        console.log("something changed, recalculating");
        f.process(settings);
      }
    });


    var server_ready = true;

    Meteor.methods({
      server_ready: function(){
        return server_ready;
      }
    });

  });


}


console.log('   /\\   ');
console.log('  /  \\  ');
console.log(' /    \\ ');
console.log(' ------  ');
