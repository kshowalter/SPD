setup_webpage = function(){
  //console.log('setup_webpage');

  $('#drawing_loading')
    .on('blur',function(){
      console.log('blur');
      $(this).fadeOut(300);
    });


  /*
  var map_drawer_content = $('#section_map').children('.drawer').children('.drawer_content');

  var geocode_div = $('<div>')
  .attr('class', 'geocode_line')
  .appendTo(map_drawer_content);
  $('<a>').appendTo(geocode_div)
  .attr('class', 'geocode_button')
  .text('Find location from address')
  .attr('href', '#')
  .click(f.request_geocode);
  $('<span>').appendTo(geocode_div)
  .attr('class', 'geocode_display')
  .attr('id','geocode_display')
  .text('');

  var map_div = $('<div>')
  .attr('class', 'geocode_line')
  .appendTo(map_drawer_content);
  $('<div>')
  .attr('id', 'map_road')
  .attr('class', 'map')
  .attr('style', 'width:485px;height:380px')
  .appendTo(map_div);
  $('<div>')
  .attr('id', 'map_sat')
  .attr('class', 'map')
  .attr('style', 'width:485px;height:380px')
  .appendTo(map_div);

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

  var map_road  = g.perm.maps.map_road = L.map( 'map_road', {
  center: [lat_fl_center, lon_fl_center],
  zoom: 6
  });

  L.tileLayer( 'http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors | Tiles Courtesy of <a href="http://www.mapquest.com/" title="MapQuest" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" width="16" height="16">',
  subdomains: ['otile1','otile2','otile3','otile4']
  }).addTo( map_road );

  g.perm.maps.marker_road = L.marker([lat,lon], {icon: sun_marker}).addTo(map_road);

  map_road.on('click', f.set_coordinates_from_map );




  var map_sat = g.perm.maps.map_sat = L.map( 'map_sat', {
  center: [lat, lon],
  zoom: 16
  });
  L.tileLayer( 'http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png', {
  subdomains: ['otile1','otile2','otile3','otile4']
  }).addTo( map_sat );

  g.perm.maps.marker_sat = L.marker([lat,lon], {icon: sun_marker}).addTo(map_sat);

  map_sat.on('click', f.set_coordinates_from_map );






  /*

  var drawing_section = $('<div>').attr('id', 'drawing_frame').appendTo(page);
  //drawing.css('width', (settings.drawing_settings.size.drawing.w+20).toString() + 'px' );


  //$('<form method="get" action="data/sample.pdf"><button type="submit">Download</button></form>').appendTo(drawing_section);
  //$('<span>').attr('id', 'download').attr('class', 'float_right').appendTo(drawing_section);
  $('<a>')
  .text('Download Drawing (sample)')
  .attr('href', 'sample_pdf/sample.pdf')
  .attr('id', 'download')
  .attr('class', 'button_float_right')
  .attr('target', '_blank')
  .appendTo(drawing_section);
  $('<a>')
  .text('Download Drawing (network test, once)')
  //.attr('href', '#')
  .attr('id', 'download')
  .attr('class', 'button_float_right')
  //.attr('target', '_blank')
  .appendTo(drawing_section)
  .click(f.request_SVG);
  $('<a>')
  .text('Download Drawing (network test, repeats)')
  //.attr('href', '#')
  .attr('id', 'download')
  .attr('class', 'button_float_right')
  //.attr('target', '_blank')
  .appendTo(drawing_section)
  .click(function(){
  setInterval(g.f.request_SVG, 1000);
  });

  var svg_container_object = $('<div>').attr('id', 'drawing').attr('class', 'drawing').css('clear', 'both').appendTo(drawing_section);
  $('<br>').appendTo(drawing_section);

  ///////////////////
  $('<div>').html(' ').attr('class', 'section_title').appendTo(drawing_section);
  //*/
};
