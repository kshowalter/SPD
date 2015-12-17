Template.drawer.helpers({
  section_name: function(){
    return this;
  },
  title_bar_class: function(){
    section_activated = Session.get('section_activated');
    //section_activated = settings.webpage.section_activated;

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


    var name = $(event.target).attr('section_nom');
    //console.log(name);
    settings.webpage.section_manual_toggled[name] = true;
    //$(this).parent().children('.drawer').children('.drawer_content').slideToggle('fast');

  },
});
