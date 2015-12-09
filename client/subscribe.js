subscriptions_ready = f.mk_ready(
  ['system_data', 'user_systems', 'pv_components', 'state', 'users']
);


subscribe = {};

subscribe['main'] = function(){

  Tracker.autorun(function () {
    Meteor.subscribe('system_data', function(){
      subscriptions_ready('system_data');
    });
  });
  Tracker.autorun(function () {
    Meteor.subscribe('user_systems', function(){
      subscriptions_ready('user_systems');
    });
  });
  Tracker.autorun(function () {
    Meteor.subscribe('pv_components', function(){
      subscriptions_ready('pv_components');
    });
  });
  Tracker.autorun(function () {
    Meteor.subscribe('state', function(){
      subscriptions_ready('state');
    });
  });
  Tracker.autorun(function () {
    Meteor.subscribe('users', function(){
      subscriptions_ready('users');
    });
  });

};

subscribe['drawing'] = function(){
  Tracker.autorun(function () {
    Meteor.subscribe('drawings', function(){
      //if( subscriptions_ready('userData') ) {
        console.log('user loaded');
      //}
    });
  });
};
