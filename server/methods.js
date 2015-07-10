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
  },

  update_user_data: function(v){
    console.log('I will now update the user data');

    for( var section_name in v ){
      for( var value_name in v[section_name] )
      User_data.update(
        { section_name:section_name, value_name:value_name },
        {$set:{ value: v[section_name][value_name] }}
      );
    }

  }


});
