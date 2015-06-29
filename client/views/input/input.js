Template.input.helpers({
  label: function(){
    //console.log( "label", this.label )
    if( typeof this.label === 'string' ){
      return this.label;
    } else {
      return f.pretty_name(this.value_name);
    }
  },
  is: function(a,b){
    return a === b;
  },
  isType: function(type){
    return this.input_type === type;
  },
  info_content: function(type){
    return this.content;
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
