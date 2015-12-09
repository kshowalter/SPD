Template.tabs.helpers({
  sections: function(){
    return state.webpage.sections;
  },


  section_name: function(){
    return this;
  },
  title_bar_class: function(){
    section_activated = Session.get('section_activated');
    //section_activated = state.webpage.section_activated;

    //console.log(section_activated, this);
    if( section_activated[this] ){
      return 'title_bar_active';
    } else {
      return 'title_bar_inactive';
    }
  },
  section_label: function(){
    return f.pretty_name(this);
  },
  inputs: function(){
    var section_name = this.toString();
    var inputs = System_data.find({ type:'user', system_id: Meteor.user().active_system, section_name:section_name }, {sort:['order']} );
    //console.log(section_name, 'inputs:', inputs.fetch());
    return inputs;
  },
  info: function(){
    //console.log("info: ", state.section_info[this]);
    if( state.section_info[this] ){
      return state.section_info[this].join('\n');
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
