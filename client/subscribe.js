subscribe = {};

subscribe['main'] = function(){

  Tracker.autorun(function () {
    Meteor.subscribe('system_data', function(){
      if( ready('system_data') ) {
        update();
      }
    });
  });
  Tracker.autorun(function () {
    Meteor.subscribe('user_systems', function(){
      if( ready('user_systems') ) {
        update();
      }
    });
  });
  Tracker.autorun(function () {
    Meteor.subscribe('components', function(){
      if( ready('components') ) {
        update();
      }
    });
  });
  Tracker.autorun(function () {
    Meteor.subscribe('settings', function(){
      if( ready('settings') ) {
        update();
      }
    });
  });
  Tracker.autorun(function () {
    Meteor.subscribe('users', function(){
      if( ready('users') ) {
        update();
      }
    });
  });

};

subscribe['drawing'] = function(){
  Tracker.autorun(function () {
    Meteor.subscribe('drawings', function(){
      //if( ready('userData') ) {
        console.log('user loaded');
      //}
    });
  });
};
