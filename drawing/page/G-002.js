f.mk_sheet_num['G-002'] = function(settings){

  var d = Drawing(settings);

  var sheet_section = 'A';
  var sheet_num = '00';
  //d.append(mk_border(settings, sheet_section, sheet_num ));

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;

  var x, y, h, w;
  d.layer('text');


  x = size.drawing.w * 1/2;
  y = 50;

  y += 10;
  w = size.drawing.w * 1 * 0.95;
  //h = size.drawing.h       * 0.75;
  h = 475;


  d.text(
    [x,y],
    'Notes',
    'text',
    'title1'
  );


  x -= ( w/2 );
  y += 25;
  d.text(
    [x,y],
    [
      'System Limitations:',
      '10 kW maximum, grid connected, no battery backup.',
      'Roodtop mounted, no more than 9 inches above the roof surface.',
      '600 amps maximim DC current.',
      ' ',
      'Requirments:',
      'The Licensed Solar Installer shall comply with the requirements of the Authority Having Jurisdiction (AHJ)',
      '    and use properly licensed subcontractors for work in conjunction with the PV installation that exceeds the scope of their license.',
      'The supporting wood structural members spaced a maximum of 2 feet on center',
      'The PV array design and components will:',
      ' - Be installed on defined, permitted roof structure.',
      ' - Comply with all requirements of the Authority Having Jurisdiction for fire ratings.',
      ' - Comply with all of the the requirements of the 2011 version of the NEC Article 690.',
      ' - Be listed and labeled per the requirements of UL 1703.',
      ' - Be listed installed in accordance with the manufacturer\'s installation requirements.',
      ' - Have a Florida Solar Energy Center System Certification.',
      ' - Installed in Zone P(1) Field of the roof only',
      ' - Installed on a Gable Roof only',
    ],
    'text',
    'notes'
  );





  //////
  // table of contents

  var n_rows = settings.drawing_settings.sheets.length;
  var n_cols = 2;
  var col_widths = [80,350];
  w = 0;
  col_widths.forEach(function(x){w+=x});
  h = n_rows*20;
  x = size.drawing.frame_padding*6;
  y = size.drawing.h - size.drawing.frame_padding - size.drawing.titlebox.bottom.h;
  y += -20 * n_rows;
  y += -40; // the last number is the gap to the title box
  d.text( [x+w/2, y-20], 'Contents', null, 'table_large' );

  var t = d.table(n_rows,n_cols).loc(x,y);
  t.row_size('all', 20).col_size(1, col_widths[1-1]).col_size(2, col_widths[2-1]);

  settings.drawing_settings.sheets.forEach(function(sheet,i){
    t.cell(i+1,1).text(sheet.num);
    t.cell(i+1,2).text(sheet.desc);

  });


  t.all_cells().forEach(function(cell){
    cell.font('table_large_left').border('all');
  });

  t.mk();

  /*
  console.log(table_parts);
  d.append(table_parts);
  d.text([size.drawing.w/3,size.drawing.h/3], 'X', 'table');
  d.rect([size.drawing.w/3-5,size.drawing.h/3-5],[10,10],'box');

  t.cell(2,2).border('all').text('cell 2,2');
  t.cell(3,3).border('all').text('cell 3,3');
  t.cell(4,4).border('all').text('cell 4,4');
  t.cell(5,5).border('all').text('cell 5,5');



  t.cell(4,6).border('all').text('cell 4,6');
  t.cell(4,7).border('all').text('cell 4,7');
  t.cell(5,6).border('all').text('cell 5,6');
  t.cell(5,7).border('all').text('cell 5,7');


  //*/

  return d;
};
