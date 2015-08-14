Inputs.find({}).observe({
  changed: function(doc){
    //console.log('Inputs change: ', doc);
  }
});

System_data.find({type:"user"}).observe({
  changed: function(doc){
    //console.log("something changed on the server, recalculating", doc.section_name, doc.value_name);
    //settings.system[doc.section_name][doc.value_name] = doc.value;
    //update();
  },
});
