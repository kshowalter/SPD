Values.find({ section_name:"module", value_name:"make" }).observe({
  changed: function(doc){
    console.log('new value for module make: ', doc);
    var new_options = _.uniq(Components
      .find({
        type:"modules",
        make:getValue('module', 'make')
      }).map(function(doc){return doc.model;}
    ));
    setOptions("module", "model", new_options );
  },
  //setValue = function(section_name, value_name, new_value);
});


Values.find({ section_name:"module", value_name:"model" }).observe({
  changed: function(doc){
    var make  = getValue('module', 'make');
    var model = doc.model;
    console.log(make, model);
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


Values.find({ section_name:"inverter", value_name:"make" }).observe({
  changed: function(doc){
    console.log('new value for inverter make: ', doc);
    var new_options = _.uniq(Components
      .find({
        type:"inverters",
        make:getValue('inverter', 'make')
      }).map(function(doc){return doc.model;}
    ));
    setOptions("inverter", "model", new_options );
  },
  //setValue = function(section_name, value_name, new_value);
});
