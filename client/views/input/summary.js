var request_drawing = function(){
  Meteor.call("download", function(error, result){
    if(error){
      console.log("error", error);
    }
    if(result){
      console.log('result: ', result);
      var view_button = $('<a>', {
        id: 'view_drawing',
        class: 'button',
        href: 'drawing/'+result,
        text: 'View drawing',
        target: '_blank',
      });

      var download_button = $('<a>', {
        id: 'view_drawing',
        class: 'button',
        //href: 'http://10.173.64.204:8004/drawing/'+active_system,
        href: 'permit/'+result,
        text: 'Download drawing',
        target: '_blank',
      });

      $('#summary_drawing_download_status')
        .empty()
        .append(view_button)
        .append(download_button);

    }
  });
}




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
  'click #summary_request_drawing': function(){
    console.log('request_drawing');

    console.log('check warnings and errors');

    $('#summary_drawing_download_status')
      .empty()
      .append(
        $('<p>').html('generating drawing files...')
      );
    request_drawing();
  },
});
