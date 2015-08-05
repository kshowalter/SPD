Template.input_section.helpers({
  sections: function(){
    var section_list = Settings.findOne({id:'section_list'});
    return section_list ? section_list.value : [];
    //return Settings.findOne({id:'section_list'});
  },
});
