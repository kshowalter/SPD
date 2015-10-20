Meteor.methods({
   connect: function(){
    //console.log(this.userId, Meteor.user());

    //Inputs.find().forEach(function(input){
    //  System_data.upsert({
    //    user_id: this.userId,
    //    type: 'input',
    //    value_name: input.value_name,
    //    section_name: input.section_name,
    //  });
    //});

    return Random.id();
  },
  reset: function(){
    var user_id = this.userId;
    var active_system = Meteor.users.findOne({_id:user_id}).active_system;
    //console.log(user_id, Meteor.user());
    System_data.remove({system_id:active_system});
    //setup_user_data(user_id);
    setup_new_system_data(active_system);

    return user_id;
  },
  new_system: function(){
    var user_id = this.userId;
    var system_number = User_systems.find({user_id:user_id}).count() + 1;
    var system_id = Random.id();
    var new_system_info = {
      system_number: system_number,
      user_id: user_id,
      system_id: system_id,
    };
    User_systems.insert(new_system_info);

    setup_new_system_data(system_id);

    Meteor.users.update(
      user_id,
      { $set: {active_system: system_id } }
    );
  },
  delete_system: function(){
    var active_system = Meteor.users.findOne({_id:this.userId}).active_system;
    System_data.remove({system_id:active_system});
    User_systems.remove({system_id:active_system});

    var user_id = this.userId;
    var user_system_list = User_systems.find({system_id:active_system}).fetch();
    var new_system_id = user_system_list[user_system_list.length-1];

    Meteor.users.update(
      user_id,
      { $set: {active_system: new_system_id } }
    );
  },
  new_active_system: function(system_id){
    var user_id = this.userId;
    Meteor.users.update(
      user_id,
      { $set: {active_system: system_id } }
    );
    return true;
  },
//  update_user_data: function(v){
//    console.log('I will now update the user data');
//
//    for( var section_name in v ){
//      for( var value_name in v[section_name] )
//      System_data.update(
//        { section_name:section_name, value_name:value_name },
//        {$set:{ value: v[section_name][value_name] }}
//      );
//    }
//  },
  change_model_options: function(section_name){
    console.log('change_model_options');
    var new_options = _.uniq(PV_Components
      .find({
        type: section_name+'s',
        make: getValue(section_name, 'make')
      }).map(function(doc){return doc.model;}
    ));

    var active_system = Meteor.users.findOne({_id:this.userId}).active_system;
    System_data.update(
      { section_name:section_name, value_name:'model', system_id: active_system },
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

  download: function(){
    console.log('generate drawing method');
    var active_system = Meteor.users.findOne({_id:this.userId}).active_system;
    var result = mk_drawing(active_system);
    //return result;
    return active_system;

  },

  select_module: function(selected_modules){
    var active_system = Meteor.users.findOne({_id:this.userId}).active_system;
    User_systems.upsert(
      {system_id: active_system },
      {$set:
        {selected_modules:selected_modules}
      }
    );
  },
});
