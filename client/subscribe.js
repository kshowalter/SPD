ready = f.mk_ready(['main', 'system_data', 'user_systems', 'settings','components']);

Meteor.subscribe('system_data', function(){
  if( ready('system_data') ) {
    update();
  }
});
Meteor.subscribe('user_systems', function(){
  if( ready('user_systems') ) {
    update();
  }
});
Meteor.subscribe('components', function(){
  if( ready('components') ) {
    update();
  }
});
Meteor.subscribe('settings', function(){
  if( ready('settings') ) {
    update();
  }
});
Meteor.subscribe('userData', function(){
  if( ready('settings') ) {
    console.log('user loaded');
  }
});
