var model_from_make = function(section_name, user_id){
  new_options = _.uniq(
    Components.find({
      type: section_name+"s",
      make:getValue(section_name, 'make')
    }).map(function(doc){return doc.model;}
  ));
  module_model_id = User_data.findOne( { user_id:user_id, section_name:section_name, value_name:'model'} )._id;
  User_data.update(
    module_model_id,
    {$set:{
      options: new_options
    }}
  );
  //Reset module selection;
  User_data.update(
    module_model_id,
    {$set:{
      value: new_options[0]
    }}
  );
};


update_options = function(section_name, value_name, user_id){
  var new_options;
  var id;
  var confirm;
  if(Meteor.isClient){
    user_id = Meteor.userId();
  }
  var module_model_id;


  if(section_name === 'module' && value_name === 'make'){
    model_from_make(section_name, user_id);
  } else if (section_name === 'inverter' && value_name === 'make') {
    model_from_make(section_name, user_id);
  } else if (section_name === 'attachment_system' && value_name === 'make') {
    //model_from_make(section_name, user_id);
  }


};
