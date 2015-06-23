Template.input.helpers({
  is: function(a,b){
    return a === b;
  },
  isType: function(type){
    return this.type === type;
  },
});



Template.input.events({
  'submit form': function(e){
    console.log('form submitted', e);
  }
});
