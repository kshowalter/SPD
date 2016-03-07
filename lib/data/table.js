var list = {};

list['240.6 Standard OCPD Ampere Ratings'] = [
  15,
  20,
  25,
  30,
  35,
  40,
  45,
  50,
  60,
  70,
  80,
  90,
  100,
  110,
  125,
  150,
  175,
  200,
  250,
  300,
  350,
  450,
  500,
  600,
  700,
  800
];

list['Conductor/Equipment Voltage Ratings'] = [
  12,
  24,
  48,
  60,
  96,
  120,
  240,
  277,
  300,
  480,
  500,
  600,
  1000,
  1500,
  2000
];



var table = {};

// TABLE 250.122 Minimum Size Equipment Grounding Conductors for Grounding Raceway and Equipment
table['250.122'] = {
  columns: [
    'Rating or Setting of Automatic Overcurrent Device in Circuit Ahead of Equipment, Conduit, etc., Not Exceeding (Amperes)',
    'Copper Size (AWG or kcmil)',
    'Aluminum Size (AWG or kcmil)'
  ],
  data: [
    ['15','14','12'],
    ['20','12','10'],
    ['60','10','8'],
    ['100','8','6'],
    ['200','6','4'],
    ['300','4','2'],
    ['400','3','1'],
    ['500','2','1/0'],
    ['600','1','2/0'],
    ['800','1/0','3/0'],
    ['1000','2/0','4/0'],
    ['1200','3/0','250'],
    ['1600','4/0','350'],
    ['2000','250','400'],
    ['2500','350','600'],
    ['3000','400','600'],
    ['4000','500','750'],
    ['5000','700','1200'],
    ['6000','800','1200']
  ]
};


// TABLE 310.15(B)(2)(a) Ambient Temperature Correction Factors Based on 30 C

table['310.15(B)(2)(a)'] = {
  columns: [
    'Ambient Temp (C)',
    '60°C',
    '75°C',
    '90°C',
    'Ambient Temp (F)'
  ],

  data: [
    ['10 or less','1.29','1.2','1.15','50 or less'],
    ['11–15','1.22','1.15','1.12','51–59'],
    ['16–20','1.15','1.11','1.08','60–68'],
    ['21–25','1.08','1.05','1.04','69–77'],
    ['26–30','1','1','1','78–86'],
    ['31–35','0.91','0.94','0.96','87–95'],
    ['36–40','0.82','0.88','0.91','96–104'],
    ['41–45','0.71','0.82','0.87','105–113'],
    ['46–50','0.58','0.75','0.82','114–122'],
    ['51–55','0.41','0.67','0.76','123–131'],
    ['56–60','—','0.58','0.71','132–140'],
    ['61–65','—','0.47','0.65','141–149'],
    ['66–70','—','0.33','0.58','150–158'],
    ['71–75','—','—','0.5','159–167'],
    ['76–80','—','—','0.41','168–176'],
    ['81–85','—','—','0.29','177–185']
  ]
};

// TABLE 310.15(B)(3)(a) Adjustment Factors for More Than Three Current-Carrying Conductors in a Raceway or Cable
table['310.15(B)(3)(a)'] = {
  columns: [
    'No. of Conductors',
    'Adjustment Factor'
  ],
  data: [
    ['Less Than 3','1'],
    ['4–6','0.8'],
    ['7–9','0.7'],
    ['10–20','0.5'],
    ['21–30','0.45'],
    ['31–40','0.4'],
    ['41 and above','0.35']
  ]
};






table_lookup = function(table_name, lookup_column, lookup_value, lookup_column){
  var lookup_id = table[table_name].columns.indexof(lookup_column);


  return value;
};
