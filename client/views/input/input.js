Template.input.helpers({
  name: function(){
    return f.pretty_name(this.value_name);
  },
  is: function(a,b){
    return a === b;
  },
  isType: function(type){
    return this.input_type === type;
  },
});



Template.input.events({
  'submit .user_input': function(e){
    console.log('form submitted', e);
  },
  'change .input': function(event){
    //console.log('input changed', event.target.value);
    //console.log(event);
    //console.log('this', this._id, this);
    Values.upsert(this._id, {$set: {value: event.target.value}});
  },
});
