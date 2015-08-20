Template.drawing_section.helpers({
  svgs: function(){
    console.log(settings);
    return settings.drawing.svgs;
  },
  system_id: function(){
    return Meteor.user().active_system;
  },
});

Template.drawing_section.events({

});
