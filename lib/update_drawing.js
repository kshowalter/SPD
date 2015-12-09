update_drawing = function(state){

  // Make blocks
  f.mk_blocks(state);

  // Make drawing
  var i, p;
  state.drawing.parts = {};
  state.drawing.svgs = [];
  state.drawing_state.sheets.forEach(function(sheet_info, i){
      p = i+1;
      state.drawing.parts[p] = mk_sheet(state, sheet_info);
      state.drawing.svgs.push(
        f.mk_svg(state.drawing.parts[p], state)
      );
  });

  return state;
};
