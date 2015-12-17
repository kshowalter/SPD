System_data.find({type:"user"}).observe({
  changed: function(doc){
    //console.log("something changed, recalculating", doc);
    //settings.system[doc.section_name][doc.value_name] = doc.value;
    update();
  },
});

Meteor.users.find({ _id: Meteor.userId() }).observe({
  changed: function(doc){
    //console.log("user's data changed: ", doc);
    //settings.system[doc.section_name][doc.value_name] = doc.value;
    update();
  },
});

/*
System_data.find({ section_name:"module", value_name:"make" }).observe({
  changed: function(doc){
    var active_system = Meteor.users.findOne({_id:Meteor.userId()}).active_system;

    console.log(': new module make', Tracker.active);

    server_check('module make changed, did you see anything?');

    var new_options = _.uniq(Components
      .find({
        type:"modules",
        make:getValue('module', 'make')
      }).map(function(doc){return doc.model;}
    ));

    //console.log(Meteor.userId(), new_options);
    //var confirm = setOptions("module", "model", new_options );
    //console.log( System_data.findOne( { section_name:'module', value_name:'model', user_id: Meteor.userId() } ) );
    //var id = System_data.findOne( { section_name:'module', value_name:'model'} )._id;
    //console.log(id);


    console.log( '| doc:', System_data.findOne({ section_name:"module", value_name:"model" }) );
    var confirm = System_data.update(
      //{ section_name:'module', value_name:'model', user_id: Meteor.userId() },
      { system_id:active_system, section_name:'module', value_name:'model'},
      {'$set':{
        options: new_options
      }},
      function(a,b){
        console.log('-changed', a, b );
      }
    );

    Meteor.call('change_model_options', function(error, result){
      console.log('result: ', error, result);
      console.log( '| new doc:', System_data.findOne({ section_name:"module", value_name:"model" }) );

    });
    console.log( '| doc:', System_data.findOne({ section_name:"module", value_name:"model" }) );

  },
  //setValue = function(section_name, value_name, new_value);
});
//*/

/*
System_data.find({ section_name:"module", value_name:"model" }).observe({
  changed: function(doc){
    //var make  = getValue('module', 'make');
    //var model = doc.model;
    //console.log('new value for module model: ', make, model, doc);
    console.log('new value for module model');
//    /*
    var specs = Components.findOne({ make:make, model:model });
    if(specs){

      setValue('module', 'pmp', spec.pmp);
      setValue('module', 'isc', spec.isc);
      setValue('module', 'voc', spec.voc);
      setValue('module', 'imp', spec.imp);
      setValue('module', 'vmp', spec.vmp);
      setValue('module', 'width', spec.width);
      setValue('module', 'length', spec.length);
    } else {
      console.log('specs not found');
    }
  },
  //setValue = function(section_name, value_name, new_value);
});
    //*/


//System_data.find({ section_name:"inverter", value_name:"make" }).observe({
//  changed: function(doc){
//    console.log('new value for inverter make: ', doc);
//    var new_options = _.uniq(Components
//      .find({
//        type:"inverters",
//        make:getValue('inverter', 'make')
//      }).map(function(doc){return doc.model;}
//    ));
//    setOptions("inverter", "model", new_options );
//  },
//  //setValue = function(section_name, value_name, new_value);
//});
//
//*/

///*

//*/
