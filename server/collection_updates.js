Inputs.find({}).observe({
  changed: function(doc){
    console.log('Inputs change: ', doc);
  }
});

User_data.find({type:"user"}).observe({
  changed: function(doc){
    console.log("something changed on the server, recalculating", doc.options);
    //settings.system[doc.section_name][doc.value_name] = doc.value;
    //update();
  },
});
