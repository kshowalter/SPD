subscribe = {};

subscribe['main'] = function(){

  Tracker.autorun(function () {
    Meteor.subscribe('system_data', function(){
      ready('system_data');
    });
  });
  Tracker.autorun(function () {
    Meteor.subscribe('user_systems', function(){
      ready('user_systems');
    });
  });
  Tracker.autorun(function () {
    Meteor.subscribe('pv_components', function(){
      ready('pv_components');
    });
  });
  Tracker.autorun(function () {
    Meteor.subscribe('settings', function(){
      ready('settings');
    });
  });
  Tracker.autorun(function () {
    Meteor.subscribe('users', function(){
      ready('users');
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
