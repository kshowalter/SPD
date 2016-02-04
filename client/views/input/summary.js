Template.summary.helpers({
  errors: function(){
    return state.errors;
  },
  warnings: function(){
    return state.warnings;
  },
  notes: function(){
    return state.notes;
  },
  isErrors: function(){
    return state.errors.length;
  },
  isWarnings: function(){
    return state.warnings.length;
  },
  isNotes: function(){
    return state.notes.length;
  },
});


Template.summary.events({
  'click #request_drawing': function(){
    console.log('request_drawing');
    var active_system = Meteor.user().active_system;
    $('#drawing_output').fadeIn(420);
    $('#drawing_download_status')
      .empty()
      .append(
        $('<p>').html('generating drawing files...')
      );
    Meteor.call("download", function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){
        console.log('result: ', result);
        $('#drawing_download_status')
          .empty()
          .append(
            $('<a>', {
              id: 'view_drawing',
              class: 'button',
              href: 'drawing/'+active_system,
              text: 'View drawing',
              target: '_blank',

            })
          )
          .append(
            $('<a>', {
              id: 'view_drawing',
              class: 'button',
							//href: 'http://10.173.64.204:8004/drawing/'+active_system,
							href: 'permit/'+active_system,
              text: 'Download drawing',
              target: '_blank',
            })
          );
      }
    });
  },
});
