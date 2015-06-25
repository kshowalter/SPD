Template.drawer.helpers({
  section_name: function(){
    return this;
  },
  section_label: function(){
    return f.pretty_name(this);
  },
  inputs: function(){
    var section_name = this.toString();
    var inputs = Values.find({ type:"user", section_name:section_name });
    return inputs;
  },
  pretty_label: function(label){
    console.log(this);
    return f.pretty_name(label);
  },
});

Template.drawer.events({
  'click .title_bar': function(event){
    //console.log(this);
    ////$('#' + event.currentTarget.id).slideUp('slow');
    //console.log( $(event.target).parent().children('.drawer').children('.drawer_content') );
    $(event.target).parent().children('.drawer').children('.drawer_content').slideToggle('fast');

  },
});
