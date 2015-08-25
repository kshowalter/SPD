  Meteor.publish("system_data", function () {
    var user_id = this.userId;
    var systems = User_systems.find({user_id: user_id}).map(function(doc){
      return doc.system_id;
    });
    console.log('current systems for '+this.userId + ': ', systems);
    return System_data.find({
      system_id: {$in: systems}
    });
  });

  Meteor.publish("user_systems", function () {
    return User_systems.find({user_id:this.userId});
  });

  Meteor.publish("components", function () {
    return Components.find();
  });

  Meteor.publish("settings", function () {
    return Settings.find();
  });

  //Meteor.publish("users", function () {
  //  return Meteor.users.find();
  //});


  Meteor.publish("users", function () {
    if (this.userId) {
      return Meteor.users.find({_id: this.userId},
                               {fields: {'active_system': 1}});
    } else {
      this.ready();
    }
  });
