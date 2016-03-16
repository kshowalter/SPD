
Template.landing.helpers({
  landing_sections: function(){
    return Object.keys(settings.info.system_limitations).map(function(section_name){
      return {
        title: f.pretty_name(section_name),
        section_name: section_name
      };
    });
  },
  landing_section: function(name){
    return settings.info.system_limitations[name];
  }




});
