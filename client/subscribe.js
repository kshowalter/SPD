subscribe = {};

subscribe['main'] = function(){
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
  Meteor.subscribe('users', function(){
    if( ready('users') ) {
      update();
    }
  });

};

subscribe['drawing'] = function(){
  Meteor.subscribe('drawings', function(){
    //if( ready('userData') ) {
      console.log('user loaded');
    //}
  });
};
