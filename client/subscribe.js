ready = f.mk_ready(['main', 'user_data','settings','components']);

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
