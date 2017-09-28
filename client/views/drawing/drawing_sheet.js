Template.drawing_sheet.helpers({
  sheet: function(){
    console.log(typeof this);
    var sheet = $('<div>').append( this );
    return sheet;
  }
});
