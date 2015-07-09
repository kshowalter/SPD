Meteor.methods({
   connect: function(){
    //console.log(this.userId, Meteor.user());

    //Inputs.find().forEach(function(input){
    //  User_data.upsert({
    //    user_id: this.userId,
    //    type: 'input',
    //    value_name: input.value_name,
    //    section_name: input.section_name,
    //  });
    //});

    return Random.id();
  },
  reset: function(){
    console.log(this.userId, Meteor.user());
    return Random.id();
  }
});
