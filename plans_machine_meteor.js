console.log(' ______  ');
console.log(' \\    / ');
console.log('  \\  /  ');
console.log('   \\/   ');


var dev = true;
if(dev) g = f.settings_dev_defaults(g);



if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  f.process(settings);

  Values.find({type:"user"}).observe({
    changed: function(dic){
      console.log("something changed, recalculating");
      f.process(settings);
      $('#drawing').empty();
      settings.drawing.svgs.forEach(function(svg){
        $('#drawing')
        //.append($('<p>Page '+p+'</p>'))
          .append($(svg))
          .append($('</br>'))
          .append($('</br>'));

      });
    },
  });

  var version_string = 'Preview'+moment().format('YYYYMMDD');
  //g.state.version_string = version_string;
  var boot_time = moment();
  var status_id = 'status';
  Meteor.setInterval(function(){
    f.update_status_bar(status_id, boot_time, version_string);
  },1000);


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
    status_div.innerHTML += ' | ';
};

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
        f.process(settings);
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
