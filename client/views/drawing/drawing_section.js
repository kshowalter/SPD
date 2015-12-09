Template.drawing_section.helpers({
  svgs: function(){
    console.log(state);
    return state.drawing.svgs;
  },
  system_id: function(){
    return Meteor.user().active_system;
  },
  sheets: function(){
    return state.drawing_state.sheets;
  },
});

Template.drawing_section.events({

});
