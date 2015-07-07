Template.drawer.helpers({
  section_name: function(){
    return this;
  },
  section_label: function(){
    return f.pretty_name(this);
  },
  inputs: function(){
    var section_name = this.toString();
    var inputs = User_data.find({ type:'user', section_name:section_name });
    //console.log(section_name, 'inputs:', inputs.fetch());
    return inputs;
  },
  info: function(){
    //console.log("info: ", settings.section_info[this]);
    if( settings.section_info[this] ){
      return settings.section_info[this].join('\n');
    } else {
      return '';
    }
  },
  pretty_label: function(label){
    //console.log(this);
    return f.pretty_name(label);
  },
  is_section: function(name){
    return name === this;
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
