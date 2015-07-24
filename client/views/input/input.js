Template.input.helpers({
  label: function(){
    //console.log( "label", this.label );
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
  options: function(){
    var new_options_list;
    var set_value = this.value;
    if( this.options ){
      new_options_list = this.options.map(function(option_value){
        var selected = option_value === set_value;
        return {
          value: option_value,
          selected: selected,
        };
      });

    } else {
      new_options_list = false;
    }
    return new_options_list;
  },
  option_value: function(){
    return this.value;
  },
  selected: function(){
    if( this.selected ){
      return 'selected';
    } else {
      return false;
    }
  },
});



Template.input.events({
  'submit .user_input': function(e){
    console.log('[] form submitted', e);
  },
  'change .input': function(event){
    User_data.update(this._id, {$set: {value: event.target.value}});
    update_options(this.section_name, this.value_name);
  },
});
