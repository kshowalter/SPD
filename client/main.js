console.log('/-- main');



var ready = f.mk_ready(['user_data','settings',]);

Meteor.subscribe('user_data', function(){
  if( ready('user_data') ) {
    update();
  }
});
Meteor.subscribe('settings', function(){
  if( ready('settings') ) {
    update();
  }
});


var update = function(){
  console.log('updating');
  f.process(settings);
  calculate();
  update_drawing();

  $('#drawing').empty();
  settings.drawing.svgs.forEach(function(svg){
    $('#drawing')
    //.append($('<p>Page '+p+'</p>'))
      .append($(svg))
      .append($('</br>'))
      .append($('</br>'));

  });

};

User_data.find({type:"user"}).observe({
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

Meteor.call('connect', function(err, id){
  console.log('ID: ', id);
});




console.log("first process");

console.log(settings.input);

console.log('\\--- main');
