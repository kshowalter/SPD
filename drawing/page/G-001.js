f.mk_sheet_num['G-001'] = function(settings){

  var d = Drawing(settings);

  var sheet_section = 'A';
  var sheet_num = '00';
  //d.append(mk_border(settings, sheet_section, sheet_num ));

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;

  var x, y, h, w;
  d.layer('text');

  var x = size.drawing.w*1/2;
  var y = 50;

  d.text(
    [x,y],
    [
      'PV System Design',
    ],
    null,
    'project title'
  );

  y += 30;
  d.text(
    [x,y],
    [
      'Created on: ' + moment().format('YYYY-MM-DD'),
      'Based on ' + settings.info.building_code,
    ],
    'text',
    'title2'
  );


  x = size.drawing.w*1/4;
  y = 160;


  if( section_defined(settings.status.active_system, 'location')  ){

    d.text(
      [x,y],
      [
        settings.system.location.contractor + ' (licence #:' + settings.system.location.contractor_license + ')',
      ],
      null,
      'title2'
    );

    x -= 100;
    y += 30;
    d.text(
      [x,y],
      [
        'Site address:',
        settings.system.location.address,
        settings.system.location.city + ', ' + settings.system.location.county + ', FL, ' + settings.system.location.zip_code,
      ],
      null,
      'notes'
    );

    y += 60;
    d.text(
      [x,y],
      [
        'System:',
        parseFloat(settings.system.array.pmp).toFixed(0) + ' Pmp DC',
        settings.system.inverter.inverter_make + ' ' + settings.system.inverter.inverter_model,
        settings.system.array.module_make + ' ' + settings.system.array.module_model,
      ],
      null,
      'notes'
    );




  }



  x = size.drawing.w * 3/4;
  y = 140;

  y += 10;
  w = size.drawing.w * 1/2 * 0.9;
  //h = size.drawing.h       * 0.75;
  h = 500;

  d.rect(
    [x, y+h/2],
    [w,h],
    'box'
  );

  y += 25;
  d.text(
    [x,y],
    'Notes',
    'text',
    'title1'
  );


  x -= ( w/2 -10 );
  y += 25;
  d.text(
    [x,y],
    [
      'System Limitations:',
      '10 kW maximum, grid connected, no battery backup.',
      'Roodtop mounted, no more than 9 inches above the roof surface.',
      '600 amps maximim DC current.',
      '',
      '',
    ],
    'text',
    'notes'
  );







  var n_rows = settings.drawing_settings.sheets.length;
  var n_cols = 2;
  w = 400+80;
  h = n_rows*20;
  x = size.drawing.frame_padding*6;
  y = size.drawing.h - size.drawing.frame_padding - size.drawing.titlebox.bottom.h;
  y += -20 * n_rows;
  y += -40; // the last number is the gap to the title box
  d.text( [x+w/2, y-20], 'Contents', null, 'table_large' );

  var t = d.table(n_rows,n_cols).loc(x,y);
  t.row_size('all', 20).col_size(2, 400).col_size(1, 80);

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
