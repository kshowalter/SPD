Template.input_section.helpers({
  sections: function(){
    var section_list = Settings.findOne({id:'section_list'});
    return section_list ?  section_list.value : [];
    //return Settings.findOne({id:'section_list'});
  },
});


Template.input_section.events({
  'submit form': function(e){
    console.log('form submitted', e);
  }
});
