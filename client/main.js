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
  //console.log('connected ID: ', id);

});


Template.main.helpers({
  user_info: function(){
    var user = Meteor.user();
    return user.emails[0].address;
  },
  system_ids: function(){
    return User_systems.find({});
  }

});



Template.main.events({
  'click #reset': function(){
    console.log('reset');
    Meteor.call('reset', function(err, id){
      console.log('reset ID: ', id);
    });
  },
  'click #new_system': function(){
    Meteor.call('new_system', function(err, id){
      console.log('created ID: ', id);
    });
  },
  'change #system_id': function(){
    console.log(this);
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
