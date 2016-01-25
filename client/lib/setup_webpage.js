setup_webpage = function(){
  console.log('#setup_webpage');

  $('#drawing_output')
  .on('blur',function(){
    console.log('blur');
    $(this).fadeOut(300);
  });

  if( sessionStorage.getItem('display_style') === 'tabs' ){
    f.show_tab('inputs', storage.selected_inputs_tab || 'location' );
    //f.show_tab('drawing', storage.selected_tab.drawing);
  }



  var lat_fl_center = 27.75;
  var lon_fl_center = -84.0;

  var lat = 28.387399;
  var lon = -80.757833;
  var coor = [-80.757833, 28.387399];

  L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
  var sun_marker = L.AwesomeMarkers.icon({
    icon: 'sun-o',
    markerColor: 'blue  ',
    iconColor: 'yellow'
  });


  var map_road  = settings.system_data.maps.map_road = L.map( 'map_road', {
    center: [lat_fl_center, lon_fl_center],
    zoom: 6
  });

  L.tileLayer( 'http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors | Tiles Courtesy of <a href="http://www.mapquest.com/" title="MapQuest" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" width="16" height="16">',
    subdomains: ['otile1','otile2','otile3','otile4']
  }).addTo( map_road );

  settings.system_data.maps.marker_road = L.marker([lat,lon], {icon: sun_marker}).addTo(map_road);

  //map_road.on('click', f.set_coordinates_from_map );



/*
  var map_sat = settings.system_data.maps.map_sat = L.map( 'map_sat', {
    center: [lat, lon],
    zoom: 16
  });
  L.tileLayer( 'http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png', {
    subdomains: ['otile1','otile2','otile3','otile4']
  }).addTo( map_sat );

  settings.system_data.maps.marker_sat = L.marker([lat,lon], {icon: sun_marker}).addTo(map_sat);
*/

  //map_sat.on('click', f.set_coordinates_from_map );


};
