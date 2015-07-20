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
  },
  change_model_options: function(section_name){
    console.log('change_model_options');
    var new_options = _.uniq(Components
      .find({
        type: section_name+'s',
        make: getValue(section_name, 'make')
      }).map(function(doc){return doc.model;}
    ));

    User_data.update(
      { section_name:section_name, value_name:'model', user_id: this.userId() },
      //{ section_name:'module', value_name:'model'},
      {'$set':{
        options: new_options
      }},
      function(a,b){
        console.log('-changed', a, b );
      }
    );
    return 'server did something';
  },
  just_checking_in: function(message){
    console.log('*** just_checking_in');
    console.log('  * special message: ', message);
    return 'server recieved: ' + message ;
  }





});
