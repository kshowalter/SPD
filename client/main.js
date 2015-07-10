console.log('/-- main');



var ready = f.mk_ready(['user_data','settings','components']);

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
Meteor.subscribe('components', function(){
  if( ready('components') ) {
    update();
  }
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
