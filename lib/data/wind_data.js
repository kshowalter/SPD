wind_stations = {};

wind_stations.header = [
  'id',
  'Elev.',
  'High Temp 0.4%',
  'High Temp 2% Avg.',
  'Distance above roof 0.5"',
  'Distance above roof 3.5"',
  'Distance above roof 12"',
  'Extreme min',
  'lat',
  'lon'
];


//if( lat < 32.024407 && lon > -88.582705 ){
//
//}


wind_stations.csv_data = [

  ['CAIRNS AAF/OZARK',91,37,35,57,52,49,-8,31.28,-85.72],
  ['DAUPHIN ISLAND',9,32,31,53,48,45,-2,30.25,-88.08],
  ['DOTHAN MUNICIPAL',98,37,35,57,52,49,-8,31.32,-85.45],
  ['MOBILE REGIONAL AP',67,36,34,56,51,48,-7,30.69,-88.25],
  ['APALACHICOLA MUNI AP',6,35,33,55,50,47,-5,29.73,-85.03],
  ['CAPE SAN BLAS',2,31,30,52,47,44,-2,29.67,-85.37],
  ['CECIL FIELD',27,37,35,57,52,49,-6,30.22,-81.87],
  ['CRESTVIEW BOB SIKES AP',56,37,35,57,52,49,-9,30.78,-86.52],
  ['CROSS CITY AIRPORT',13,36,34,56,51,48,-6,29.55,-83.11],
  ['DAYTONA BEACH INTL AP',13,35,33,55,50,47,-2,29.18,-81.06],
  ['DESTIN FT. WALTON',7,34,32,54,49,46,'N/A',30.4,-86.47],
  ['EGLIN AFB/VALPARAIS',20,36,33,55,50,47,-6,30.48,-86.53],
  ['FORT LAUDERDALE HOLLYWOOD INT',3,34,33,55,50,47,5,26.07,-80.15],
  ['FORT MYERS PAGE FIELD',6,35,34,56,51,48,2,26.59,-81.86],
  ['GAINESVILLE REGIONAL AP',50,35,34,56,51,48,-5,29.69,-82.27],
  ['HOMESTEAD AFB',5,34,33,55,50,47,5,25.48,-80.38],
  ['HURLBURT FIELD (AF)',12,35,33,55,50,47,-5,30.43,-86.68],
  ['JACKSONVILLE INTL ARPT',10,36,34,56,51,48,-5,30.49,-81.69],
  ['JACKSONVILLE NAS',7,37,35,57,52,49,-4,30.23,-81.68],
  ['JACKSONVILLE/CRAIG',13,36,34,56,51,48,-4,30.34,-81.52],
  ['KEY WEST INTL ARPT',6,33,32,54,49,46,10,24.55,-81.75],
  ['KEY WEST NAS',7,33,32,54,49,46,10,24.58,-81.68],
  ['MACDILL AFB/TAMPA',8,35,34,56,51,48,1,27.85,-82.52],
  ['MARATHON AIRPORT',2,34,33,55,50,47,'N/A',24.73,-81.05],
  ['MAYPORT NS',4,37,34,56,51,48,-3,30.4,-81.42],
  ['MELBOURNE REGIONAL AP',8,35,33,55,50,47,0,28.1,-80.65],
  ['MIAMI INTL AP',9,34,33,55,50,47,5,25.82,-80.3],
  ['MIAMI/KENDALL-TAMIA',3,34,33,55,50,47,4,25.65,-80.43],
  ['MOLASSES REEF',11,31,30,52,47,44,9,25.02,-80.38],
  ['NAPLES MUNICIPAL',7,34,32,54,49,46,3,26.15,-81.78],
  ['NASA SHUTTLE FCLTY',3,34,33,55,50,47,0,28.62,-80.72],
  ['OCALA MUNI (AWOS)',27,35,34,56,51,48,-6,29.17,-82.22],
  ['ORLANDO EXECUTIVE AP',34,35,34,56,51,48,1,28.55,-81.33],
  ['ORLANDO INTL ARPT',32,35,34,56,51,48,-1,28.43,-81.33],
  ['ORLANDO SANFORD AIRPORT',17,36,34,56,51,48,1,28.78,-81.24],
  ['PANAMA CITY BAY CO',6,36,33,55,50,47,-4,30.2,-85.68],
  ['PENSACOLA FOREST SHERMAN NAS',9,36,34,56,51,48,-6,30.35,-87.32],
  ['PENSACOLA REGIONAL AP',36,36,34,56,51,48,-6,30.47,-87.19],
  ['SARASOTA BRADENTON',10,35,33,55,50,47,0,27.38,-82.55],
  ['SOMBRERO KEY',37,32,31,53,48,45,11,24.62,-81.1],
  ['SOUTHWEST FLORIDA I',9,35,34,56,51,48,1,26.53,-81.75],
  ['ST AUGSUTINE ARPT',3,35,33,55,50,47,'N/A',29.97,-81.33],
  ['ST PETERSBURG CLEAR',3,35,34,56,51,48,1,27.9,-82.68],
  ['ST. AUGUSTINE',9,34,31,53,48,45,0,29.87,-81.27],
  ['TALLAHASSEE REGIONAL AP',21,37,35,57,52,49,-8,30.39,-84.35],
  ['TAMPA INTERNATIONAL AP',3,34,33,55,50,47,-1,27.96,-82.54],
  ['TYNDALL AFB',7,35,32,54,49,46,-5,30.07,-85.58],
  ['VENICE PIER',5,32,30,52,47,44,1,27.07,-82.45],
  ['VERO BEACH MUNICIPAL ARPT',9,35,33,55,50,47,0,27.66,-80.42],
  ['WEST PALM BEACH INTL ARPT',6,34,33,55,50,47,3,26.69,-80.1],
  ['WHITING FIELD NAAS',61,36,34,56,51,48,-7,30.72,-87.02],
  ['ALBANY DOUGHERTY COUNTY AP',59,37,36,58,53,50,-8,31.54,-84.19],
  ['BRUNSWICK MALCOLM MCKINNON AP',7,36,33,55,50,47,-5,31.25,-81.39],
  ['HUNTER AAF',13,38,35,57,52,49,-5,32,-81.13],
  ['MOODY AFB/VALDOSTA',71,37,35,57,52,49,-7,30.97,-83.2],
  ['SAVANNAH INTL AP',16,37,35,57,52,49,-7,32.12,-81.2],
  ['VALDOSTA WB AIRPORT',60,37,35,57,52,49,-7,30.78,-83.28],
  ['WAYCROSS WARE CO AP',43,38,35,57,52,49,-6,31.25,-82.4],

];

wind_stations.wind_data = [];

wind_stations.csv_data.forEach(function(station_info){
  var station_data = {};
  station_info.forEach(function(value,id){
    station_data[ wind_stations.header[id] ] = value;
  });
  wind_stations.wind_data.push(station_data);
});

wind_stations.get_closest = function(lat, lon){
  var distances = [];
  var closest = false;
  var closest_distance = Infinity;
  wind_stations.wind_data.forEach(function(station_info){
    var distance = Math.sqrt( Math.pow( lat - station_info.lat ,2) + Math.pow( lon - station_info.lon ,2) );
    if( distance < closest_distance){
      closest_distance = distance;
      closest = station_info;
    }
  })
  return closest;
};
