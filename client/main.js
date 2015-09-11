if(top != window) {
  top.location = window.location;
}

if( ! sessionStorage.getItem('display_style') ){
  sessionStorage.setItem('display_style', 'drawers');
}

//----status bar ----//
  var version_string = 'Preview'+moment().format('YYYYMMDD');
  //g.state.version_string = version_string;
  var boot_time = moment();
  var status_id = 'status';

  Meteor.setInterval(function(){
    f.update_status_bar(status_id, boot_time, version_string);
  },1000);

  //Meteor.setTimeout(function(){
  //  update();
  //}, 2000);
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
    //console.log('name', name);
    return name;
  },
  system_ready: function(){
    //console.log('returning list');
    return system_ready();

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
  is_admin: function(){
    if( Meteor.user().email[0] in ['kshowalter@fsec.ucf.edu'] ){
      return true;
    } else {
      return false;
    }
  },
  is_display_sytle: function(style){
    return style === sessionStorage.getItem('display_style');
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
    subscribe['main']();
  },
  'click #delete_system': function(){
    Meteor.call('delete_system', function(err, id){
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
  'click #close_download_box': function(){
    $('#drawing_loading').fadeOut(420);
  },
  'click #request_drawing': function(){
    console.log('request_drawing');
    var active_system = Meteor.user().active_system;
    $('#drawing_loading').fadeIn(420);
    $('#drawing_download_status')
      .empty()
      .append(
        $('<p>').html('generating drawing files...')
      );
    Meteor.call("download", function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){
        console.log('result: ', result);
        $('#drawing_download_status')
          .empty()
          .append(
            $('<a>', {
              id: 'view_drawing',
              class: 'button',
              href: 'drawing/'+active_system,
              text: 'View drawing',
              target: '_blank',

            })
          )
          .append(
            $('<a>', {
              id: 'view_drawing',
              class: 'button',
              href: 'http://10.173.64.204:8004/drawing/'+active_system,
              text: 'Download drawing',
              target: '_blank',
            })
          );
      }
    });
  },
});


Accounts.onLogin(function(){
  console.log('login');

  ready('login');



});




Template.main.onRendered(function(){
  console.log('-- rendered');

  $('#change_layout').click(function(){
    var display_style = sessionStorage.getItem('display_style');
    if( display_style === 'drawers'){
      display_style = 'tabs';
    } else {
      display_style = 'drawers';
    }
    sessionStorage.setItem('display_style', display_style);
  });

  console.log($('#section_location'));
  $('#section_location').css('display','block');

  ready('main');


  if( system_ready() ){
    //console.log('setup_webpage');
    //setup_webpage();
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



system_ready = function(){
  if( Meteor.user() ) var active_system =  Meteor.user().active_system;
  if( active_system ) {
    return User_systems.find({system_id:active_system}).count();
  } else {
    return false;
  }
};

show_hide = function(selected_section_name){
  console.log(selected_section_name);
  settings.webpage.sections.forEach(function(section_name){
    if( section_name === selected_section_name ){
      $('#section_'+section_name).css('display','block');
      $('#tab_'+section_name).css('background', '#DFDFDF');
    } else {
      $('#section_'+section_name).css('display','none');
      $('#tab_'+section_name).css('background', '#7a7979');
    }
  });

};

//$(document).ready(function () {
//  console.log('document ready');
//  update();
//  setup_webpage();
//});
