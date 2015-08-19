if(top != window) {
  top.location = window.location;
}


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
  },
  active_system: function(){
    return Meteor.user().active_system;
  },
  system_name: function(){
    /*
    //*/
    var active_system = Meteor.user().active_system;
    var system_info = User_systems.findOne({system_id:active_system});
    var name;
    if(system_info){
      name = system_info.name || '';
    } else {
      name = '';
    }
    console.log('name', name);
    return name;
  },
  system_ready: function(){
    //console.log('returning list');
    return ( Meteor.user().active_system !== undefined );

  },
  sections: function(){
    //var section_list = Settings.findOne({id:'section_list'});
    var active_system = Meteor.user().active_system;
    if ( active_system ){
      return settings.webpage.sections;
    } else {
      return false;
    }

    //return section_list ? section_list.value : [];
    //return Settings.findOne({id:'section_list'});
  },
  system_selected: function(){
    if( this.system_id === Meteor.user().active_system ){
      return 'selected';
    } else {
      return false;
    }
  },
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
  'change #system_name': function(){
    var id = User_systems.findOne({system_id: Meteor.user().active_system })._id;
    console.log('setting: ', id, event.target.value);
    User_systems.update(
      id,
      {$set:
        {name:event.target.value}
      }
    );

  },
  'change #system_id': function(event){
    Meteor.call('new_active_system', event.target.value, function(err, returned){
      //console.log('returned: ', returned);
    });
  },

});


Template.body.onRendered(function(){
  setup_webpage();

  if( ready('main') ) {
    update();
  }

  //Meteor.call("generate", 'settings', function(error, result){
  //  if(error){
  //    console.log("error", error);
  //  }
  //  if(result){
  //    console.log('result: ', result);
  //  }
  //});


});
