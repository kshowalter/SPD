System_data.find({type:"user"}).observe({
  changed: function(doc){
    //console.log("something changed on the server, recalculating", doc.section_name, doc.value_name);
    //state.system[doc.section_name][doc.value_name] = doc.value;
    //update();
  },
});
