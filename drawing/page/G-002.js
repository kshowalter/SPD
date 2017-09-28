f.mk_sheet_num['G-002'] = function(settings){
  var state = settings.state;

  var d = Drawing(settings);

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;

  var x, y, h, w;
  d.layer('text');


  x = size.sheet.w * 1/2;
  y = 60;

  w = size.sheet.w * 1 * 0.95;
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
      'The array must be installed on a residential building with a risk category of II',
      '10 kW maximum, grid connected, no battery backup.',
      'Rooftop mounted, no more than 9 inches above the roof surface.',
      '600 amps maximum DC current.',
      ' ',
      'Requirements:',
      '  The Licensed Solar Installer shall comply with the requirements of the',
      '  Authority Having Jurisdiction (AHJ) and use properly licensed subcontractors for',
      '  work in conjunction with the PV installation that exceeds the scope of their license.',
      'The PV array design and components will:',
      ' - Be installed on defined, permitted roof structure.',
      ' - Comply with all requirements of the Authority Having Jurisdiction for fire ratings.',
      ' - Comply with all of the the requirements of the 2011 version of the NEC Article 690.',
      ' - Be listed and labeled per the requirements of UL 1703.',
      ' - Be listed installed in accordance with the manufacturer\'s installation requirements.',
      ' - Have a Florida Solar Energy Center System Certification.',
      ' - Installed in Zone P(1) Field of the roof only',
      ' - Installed on a Gable Roof only',
      ' - Meet the roof uplift pressures for installation in the Field (Zone P 1) of Roof.',
      ' - Installed Parallel to the Roof Surface.',
      'The supporting wood structural members spaced a maximum of 2 feet on center',
    ],
    'text',
    'notes'
  );


  x = size.sheet.w * 1/2;
  y = 60;

  x += size.sheet.w * 0.05
  y += 25;

  d.text(
    [x,y],
    [
      'Instructions:',
      'Wood structural members must be a 2x4 or larger.',
      'Follow NEC and local signage requirements.',
    ],
    'text',
    'notes'
  );


  return d;
};
