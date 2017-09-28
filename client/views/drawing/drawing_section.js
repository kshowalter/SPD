Template.drawing_section.helpers({
  svgs: function(){
    console.log(settings);
    return settings.drawing.svgs;
  },
  system_id: function(){
    return Meteor.user().active_system;
  },
  sheets: function(){
    return [].concat( settings.drawing_settings.sheets, settings.report_settings.pages );
  },
  id: function(){
    return f.name_to_id(this.num);
  }
});

Template.drawing_section.events({

});
