codeTables = {};
codeTables.RAS127 = function(settings){
  var state = settings.state;
  var system = state.system;
  var index;
  var slope = Number(system.roof.slope.split(':')[0]) / 12;
  var exposure_category = system.location.exposure_category;

  if( exposure_category === 'B' ) return false; // TODO: Add table for exposure category 'B'

  if( slope >= 2/12 && slope <= 6/12 ){
    index = 0;
  } else if( slope >= 2/12 && slope <= 6/12) {
    index = 3;
  } else {
    console.error('slope out of range');
  }

  // Slope: |      > 2:12 to ≤ 6:12       |       > 6:12 to ≤12:12      |
  // Zone?: | Pasd(1) | Pasd(2) | Pasd(3) | Pasd(1) | Pasd(2) & Pasd(3) |
  // index: |   0     |    1    |   2     |   3     |         4         |
  var table = {}

  table['C'] = { // // RAS 127 TABLE 1 — RISK CATEGORY II EXPOSURE CATEGORY “C”
    "≤ 20'":         [-39.1, -68.1, -100.7, -42.8, -50.0],
    ">20' to ≤ 25'": [-40.9, -71.3, -105.4, -44.8, -52.3],
    ">25' to ≤ 30'": [-42.4, -73.9, -109.3, -46.4, -54.3],
    ">30' to ≤ 35'": [-43.9, -76.6, -113.2, -48.1, -56.2],
    ">35' to ≤ 40'": [-45.1, -78.7, -116.3, -49.4, -57.8],
  };


  table['D'] = { // RAS 127 TABLE 2 — RISK CATEGORY II EXPOSURE CATEGORY “D”1
    "≤ 20'":         [-47.0, -81.9, -121.0, -51.4, -60.1],
    ">20' to ≤ 25'": [-48.8, -85.0, -125.7, -53.4, -62.4],
    ">25' to ≤ 30'": [-50.3, -87.7, -129.6, -55.0, -64.4],
    ">30' to ≤ 35'": [-51.5, -89.9, -132.7, -56.4, -65.9],
    ">35' to ≤ 40'": [-52.7, -91.9, -135.8, -57.7, -67.9],
  };

  var uplift_pressure_min;
  if( system.roof.mean_height <= 20 ){
    uplift_pressure_min = table[exposure_category]["≤ 20'"][index];
  } else if( system.roof.mean_height <= 25 ){
    uplift_pressure_min = table[exposure_category][">20' to ≤ 25'"][index];
  } else if( system.roof.mean_height <= 30 ){
    uplift_pressure_min = table[exposure_category][">25' to ≤ 30'"][index];
  } else if( system.roof.mean_height <= 35 ){
    uplift_pressure_min = table[exposure_category][">30' to ≤ 35'"][index];
  } else if( system.roof.mean_height <= 40 ){
    uplift_pressure_min = table[exposure_category][">35' to ≤ 40'"][index];
  } else {
    state.notes.errors.push('Roof height out of range for RAS 127 uplift pressure calculation');
  }

  return uplift_pressure_min;
}
