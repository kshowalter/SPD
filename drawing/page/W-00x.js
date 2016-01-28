f.mk_sheet_num['W-00x'] = function(settings){
  var state = settings.state;

  var f = settings.f;

  d = Drawing(settings);

  var sheet_section = 'PV';
  var sheet_num = '02';
  //d.append(mk_border(settings, sheet_section, sheet_num ));

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;

  var w;
  var h;
  var x;
  var y;

  x = size.drawing.w * 1/2;
  y = 50;

  d.text(
    [x,y],
    'General Instructions:',
    'text',
    'title1'
  );

  y += 25;
  x -= 200;




  /*

  var electical_notes = [
    "1:   ALL ASPECTS OF THE ELECTRICAL WORK REQUIRED TO COMPLETE THE",
    "      PROJECT REPRESENTED IN THIS DOCUMENT SHALL COMPLY WITH THE.",
    "2:   MANUFACTURER'S RECOMMENDATIONS/SPECIFICATIONS AND ALL CODES,",
    "      STATUTES, AND STANDARDS ADOPTED BY THE settings AND THE.",
    "3:   LOCAL AUTHORITY HAVING JURISDICTION.",
    "4:   THE INFORMATION PROVIDED IN THESE DOCUMENTS IS NOT EXHAUSTIVE,",
    "      IT REMAINS THE CONTRACTORS RESPONSIBILITY TO ACHIEVE THE.",
    "5:   PROPOSED INSTALLATION IN FULL EXERCISE OF AND COMPLIANCE",
    "      WITH THE ITEMS IDENTIFIED IN GENERAL ELECTRICAL NOTE 1.",
    "6:   AN AC DICONNECT, AT THE ELECTRICAL SERVICE ENTRANCE,",
    "      IS EXEMPT FROM REQUIRE MENT BY LAW, FOR TIER 1 RENEWABLE ENERGY.",
    "7:   SYSTEMS, PER FLORIDA ADMINISTRATION CODE 25-6.065(6)(A).",
    "      AUXILLIARY DISCONNECTS ARE A UTILIT Y CO. OPTION. IF REQUIRED BY THE.",
    "8:   UTILITY CO., THE UTILITY CO. SHALL BEAR THE ADDITIONAL EXPENCE INCURRED,",
    "      AS STIPULATED BY THE FLORIDA ADMINISTRATION CODE.",
    "9:   ALL CONDUCTORS ARE TO BE CU.",
    "10:  ALL UNIDENTIFIED CONDUCTORS UNDER MODULES ARE UL LISTED AND",
    "      MANUFACTURER PROVIDED CABLES, CONNECTORS AND ASSEMBLIES.",
    "11:  ALL ELECTRICAL COMPONENTS, (RACEWAYS, JUNCTION BOXES,",
    "      DISCONNECTS, PANEL BOARDS, ETC.), SHALL BE INSTALLED PLUMB, LEVEL,.",
    "12:  AND IN COMPLIANCE WITH ALL APPLICABLE SECTIONS OF NEC ARTICLE 110.",
    "13:  ALL RACEWAYS SHALL BE SUPPORTED ON INTERVALS AND BY METHODS AS",
    "      APPROVED/REQUIRED BY THE CURRENTLY ADOPTED NEC ED.",
    "14:  ALL RACEWAYS, CABLES AND J-BOXES SHALL BE LOCATED OUT OF DIRECT SUNLIGHT.",
    "15:  SOLAR PANELS TO BE BONDED TO RACKING, UTILIZING WEEB OR",
    "     SELF BONDING CLAMPING COMPONENTS.",
    "16:  RACKING SYSTEM TO HAVE CONTINUOUS BONDING, WITH #6 GND.",
    "17:  CONTRACTOR SHALL VERIFY THE INSTALLATION OF A",
    "      BIDIRECTIONAL UTILITY SERVICE METER.",
    "18:  HOUSE PANEL CIRCUIT BREAKERS TO BE BACK FED SHALL BE LISTED AS",
    "      BACK FEED CIRCUIT BREAKERS.",
    "19:  THE CONTRACTOR SHALL SEAL ALL PENETRATIONS RESULTING FROM THIS SCOPE OF WORK.",
    "20:  ALL SIGNAGE SHALL BE PROVIDED, AS REQUIRED BY THE CURRENTLY ADOPTED NEC ED.",
  ]
  d.text( [x,y], electical_notes, 'table', 'table_left' );

  w = 390;
  h = 405;
  d.rect( [ x+w/2-5 ,y+h/2-10 ], [w,h], 'table' );


  var labels_x = 120;
  var labels_y = 60;

  x = labels_x;
  y = labels_y;
  w = 200;
  h = 100;


  d.text( [x,y-30], 'PHENOLIC PLACARDS:', 'table', 'title_sign' );

  d.text( [x,y], "APPLY TO BACK FEED BREAKER:", 'table', 'table' );
  d.text( [x,y+25], "WARNING", 'table', 'title_sign' );
  d.text( [x,y+45], [
    "INVERTER OUTPUT CONNECTION",
    "DO NOT RELOCATE THIS OVERCURRENT DEVICE ",
  ], 'table', 'table' );
  d.rect( [ x ,y+10+h/2 ], [w,h], 'table' );

  x += 230;
  d.text( [x,y], "APPLY TO RACEWAYS & JUNCTION BOX:", 'table', 'table' );
  d.text( [x,y+25], "WARNING", 'table', 'title_sign' );
  d.text( [x,y+45], [
    "PHOTOVOLTAIC POWER SOURCE",
  ], 'table', 'table' );
  d.rect( [ x ,y+10+h/2 ], [w,h], 'table' );

  x += 230;
  d.text( [x,y], "APPLY TO DC DISCONNECT:", 'table', 'table' );
  d.text( [x,y+25], "WARNING", 'table', 'title_sign' );
  d.text( [x,y+45], [
    "ELECTRIC SHOCK HAZARD.",
    "THE DC CONDUCTORS OF THIS",
    "PHOTOVOLTAIC SYSTEM",
    "ARE UNGROUNDED AND MAY BE",
    "ENERGIZED ELECTRIC SHOCK HAZARD",
  ], 'table', 'table' );
  d.rect( [ x ,y+10+h/2 ], [w,h], 'table' );

  x += 230;
  d.text( [x,y], "APPLY TO MAIN DISTRIBUTION PANEL & AC DISCONNECT:", 'table', 'table' );
  d.text( [x,y+25], "WARNING", 'table', 'title_sign' );
  d.text( [x,y+45], [
    "ELECTRIC SHOCK HAZARD.",
    "DO NOT TOUCH TERMINALS.",
    "TERMINALS ON BOTH THE LINE",
    "AND LOAD SIDE",
    "MAY BE ENERGIZED IN THE OPEN POSITION",
  ], 'table', 'table' );
  d.rect( [ x ,y+10+h/2 ], [w,h], 'table' );

  //*/

  return d;
};
