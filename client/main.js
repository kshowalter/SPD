console.log('/-- main');

//----status bar ----//
  var version_string = 'Preview'+moment().format('YYYYMMDD');
  //g.state.version_string = version_string;
  var boot_time = moment();
  var status_id = 'status';

  Meteor.setInterval(function(){
    f.update_status_bar(status_id, boot_time, version_string);
  },1000);
//----status bar ----//

Meteor.call('connect', function(err, id){
  console.log('connected ID: ', id);

});

Template.body.events({
  'click .reset': function(){
    console.log('reset');
  }
});


Template.body.onRendered(function(){
  setup_webpage();
});


if( ready('main') ) {
  update();
}


//console.log("first process");
//console.log(settings.input);
console.log('\\--- main');
