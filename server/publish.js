  Meteor.publish("user_data", function () {
    return User_data.find({user_id:this.userId});
  });

  Meteor.publish("user_systems", function () {
    return User_systems.find({user_id:this.userId});
  });

  Meteor.publish("inputs", function () {
    return Inputs.find();
  });

  Meteor.publish("settings", function () {
    return Settings.find();
  });

  Meteor.publish("components", function () {
    return Components.find();
  });
