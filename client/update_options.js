update_options = function(section_name,value_name){
  var new_options;
  var id;
  var confirm;


  if(section_name === 'module' && value_name === 'make'){
    new_options = _.uniq(
      Components.find({
        type:"modules",
        make:getValue('module', 'make')
      }).map(function(doc){return doc.model;}
    ));
    confirm = User_data.update(
      User_data.findOne( { section_name:'module', value_name:'model'} )._id,
      {'$set':{
        options: new_options
      }}
    );
  } else if (section_name === 'inverter' && value_name === 'make') {
    new_options = _.uniq(
      Components.find({
        type:"inverters",
        make:getValue('inverter', 'make')
      }).map(function(doc){return doc.model;}
    ));
    confirm = User_data.update(
      User_data.findOne( { section_name:'inverter', value_name:'model'} )._id,
      {'$set':{
        options: new_options
      }}
    );
  } else if (section_name === 'attachment_system' && value_name === 'make') {
    new_options = _.uniq(
      Components.find({
        type:"inverters",
        make:getValue('attachment_system', 'make')
      }).map(function(doc){return doc.model;}
    ));
    confirm = User_data.update(
      User_data.findOne( { section_name:'attachment_system', value_name:'model'} )._id,
      {'$set':{
        options: new_options
      }}
    );
  }


};
