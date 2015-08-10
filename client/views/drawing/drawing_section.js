Template.drawing_section.helpers({
  svgs: function(){
    console.log(settings);
    return settings.drawing.svgs;
  }
});

Template.drawing_section.events({
  'click #request_drawing': function(){
    console.log(this);
    Meteor.call("generate", 'settings', function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){
        console.log('result: ', result);
      }
    });
  },
});
