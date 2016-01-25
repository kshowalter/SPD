if(top != window) {
  top.location = window.location;
}

window.storage = sessionStorage;
//storage.selected_tab = storage.selected_tab || {};

////////////////////////
/*
|*|  IE-specific polyfill which enables the passage of arbitrary arguments to the
|*|  callback functions of JavaScript timers (HTML5 standard syntax).
|*|
|*|  https://developer.mozilla.org/en-US/docs/DOM/window.setInterval
|*|
|*|  Syntax:
|*|  var timeoutID = window.setTimeout(func, delay, [param1, param2, ...]);
|*|  var timeoutID = window.setTimeout(code, delay);
|*|  var intervalID = window.setInterval(func, delay[, param1, param2, ...]);
|*|  var intervalID = window.setInterval(code, delay);
*/

if (document.all && !window.setTimeout.isPolyfill) {
  var __nativeST__ = window.setTimeout;
  window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
    var aArgs = Array.prototype.slice.call(arguments, 2);
    return __nativeST__(vCallback instanceof Function ? function () {
      vCallback.apply(null, aArgs);
    } : vCallback, nDelay);
  };
  window.setTimeout.isPolyfill = true;
}

if (document.all && !window.setInterval.isPolyfill) {
  var __nativeSI__ = window.setInterval;
  window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
    var aArgs = Array.prototype.slice.call(arguments, 2);
    return __nativeSI__(vCallback instanceof Function ? function () {
      vCallback.apply(null, aArgs);
    } : vCallback, nDelay);
  };
  window.setInterval.isPolyfill = true;
}

// end Mozilla's IE polyfill
//////////////////////////////




if( ! sessionStorage.getItem('display_style') ){
  sessionStorage.setItem('display_style', 'tabs');
}

//----status bar ----//
  var version_string = 'Preview'+moment().format('YYYYMMDD');
  //g.settings.version_string = version_string;
  var boot_time = moment();
  var status_id = 'status';

  //setInterval(function(){
  //  f.update_status_bar(status_id, boot_time, version_string);
  //},1000);

  //Meteor.setTimeout(function(){
  //  update();
  //}, 2000);
//----status bar ----//


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
    if( Meteor.user() ) var active_system =  Meteor.user().active_system;
    if( active_system ) {
      return User_systems.find({system_id:active_system}).count();
    } else {
      return false;
    }
  },
  sections: function(){
    //var section_list = Settings.findOne({id:'section_list'});
    var active_system = Meteor.user().active_system;
    if ( active_system ){
      return state.webpage.sections;
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
  },
  note_count: function(){
    console.log('notes', settings.notes.length)
    if( settings.notes.length ){
      return true;
    } else {
      return false;
    }

  },
  notes: function(){
    return settings.notes;
  }
});



Template.main.events({
  //'click #reset': function(){
  //  console.log('reset');
  //  Meteor.call('reset', function(err, id){
  //    console.log('reset ID: ', id);
  //  });
  //},
  'click #help_button': function(){
    $('#map_road').fadeToggle(0, function(){
      $('#help').fadeToggle(500);
    });
  },
  'click #close_help': function(){
    $('#help').fadeToggle(500, function(){
      $('#map_road').fadeToggle();
    });
  },



  'click #new_system': function(){
    f.change_system_id('new');
  },
  'click #delete_system': function(){
    if( confirm('delete system:'+Meteor.user().active_system) ){
      Meteor.call('delete_system', function(err, id){
        console.log('created ID: ', id);
      });
      f.change_system_id('');
    }
  },
  'change #system_name': function(event){
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
    f.change_system_id(event.target.value);
  },
  'click #close_download_box': function(){
    $('#drawing_output').fadeOut(420);
  },
  'click #request_drawing': function(){
    console.log('request_drawing');
    var active_system = Meteor.user().active_system;
    $('#drawing_output').fadeIn(420);
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
							//href: 'http://10.173.64.204:8004/drawing/'+active_system,
							href: 'permit/'+active_system,
              text: 'Download drawing',
              target: '_blank',
            })
          );
      }
    });
  },
});

Template.tabs.onRendered(function(){
  //console.log('#tab rendered: ', this);


});

var resize_sections = function(){
  console.log('resize');
  if( window.innerWidth >= 1300 ){
    $('.page').css('width', 1300);
  } else {
    $('.page').css('width', '98%');
  }

  if( window.innerWidth >= 1250 ){
    $('#help').css('width', 1250);
  } else {
    $('#help').css('width', '95%');
  }

  $('#help').css('height', window.innerHeight-50 + 'px' );

  //var drawing_width = $('.drawing_container').children('.tab_content').children('svg').width();
  //drawing_width += 10;
  //$('#drawing').css('width', drawing_width);
};

Template.tabs.onRendered(function(){
  f.are_we_there_yet(function(){
    return (
      $('.user_input_container').length === Object.keys(state.inputs).length &&
      subscriptions_ready() &&
      Meteor.userId() &&
      Meteor.user().active_system
    );
  },function(){
    update();
    setup_webpage();
    resize_sections();
    window.onresize = resize_sections;
  });
});




document.addEventListener('keydown', function(e) {
  // console.log(e.keyCode);
  if( e.keyCode === 115 ){
      if( typeof style_changed === 'undefined' ){
        var display_style = sessionStorage.getItem('display_style');
        if( display_style === 'drawers'){
          display_style = 'tabs';
        } else {
          display_style = 'drawers';
        }
        sessionStorage.setItem('display_style', display_style);
        window.style_changed = true;
        console.log('style_changed');
      }
  }
});

var setup_system = function(){
  console.log('--Switching to new system');
  //subscribe['main']();
  Meteor.subscribe('system_data', function(){
    var active_system = Meteor.user().active_system
    settings.system = User_systems.findOne({system_id: active_system}).system_settings || settings.system;
    update();
    if(state.webpage.setup_needed){
      f.are_we_there_yet(function(){
        return $('.user_input_container').length === Object.keys(state.inputs).length;
      },function(){
        setup_webpage();
        update();
      });
      state.webpage.setup_needed = false;
    }
  });
};

f.change_system_id = function(new_id){
  if( new_id === 'new' ) {
    storage.selected_inputs_tab = 'location';
    Meteor.call('new_system', setup_system);
  } else if( new_id === '' ) {
    console.log('unrendered');
    state.webpage.setup_needed = true;
    Meteor.call('new_active_system', new_id)//, setup_system);
  } else {
    Meteor.call('new_active_system', new_id, setup_system);
  }
};
