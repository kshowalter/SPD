geometry = {};

geometry.center = function(point1, point2){
  return [
    point1[0] + ( point2[0] - point1[0] ) / 2,
    point1[1] + ( point2[1] - point1[1] ) / 2
  ];
};

geometry.distance_between = function(point1, point2){
  return Math.sqrt( Math.pow((point2[0]-point1[0]),2) + Math.pow((point2[1]-point1[1]),2) );
};

geometry.move_toward = function( point1, point2, distance ){
  var total_distance_between = this.distance_between(point1, point2);
  var fraction = distance / total_distance_between;
  var dx = ( point2[0] - point1[0] ) * fraction;
  var dy = ( point2[1] - point1[1] ) * fraction;
  var point2b = [
    point1[0] + dx,
    point1[1] + dy
  ];
  return point2b;
};

geometry.rotate = function( point, pivot_point, angle ){
  /*
  var dx = pivot_point[0] - point[0];
  var dy = pivot_point[1] - point[1];
  var start_angle_rad = Math.atan(Math.abs(dy/dx));
  var rotate_angle_rad = angle * Math.PI/180;
  var angle = start_angle_rad + rotate_angle_rad;
  if( dx < 0 && dy > 0 ){ // Quad 2
    angle = Math.PI - angle;
  } else if( dx < 0 && dy < 0 ){ // Quad 3
    angle = Math.PI + angle;
  } else if( dx < 0 && dy < 0 ){ // Quad 4
    angle = 2*Math.PI - angle;
  }

  Math.tan(angle) *
  //*/

  angle = (angle) * (Math.PI/180); // Convert to radians
  var rotatedX = Math.cos(angle) * (point[0] - pivot_point[0]) - Math.sin(angle) * (point[1] - pivot_point[1]) + pivot_point[0];
  var rotatedY = Math.sin(angle) * (point[0] - pivot_point[0]) + Math.cos(angle) * (point[1] - pivot_point[1]) + pivot_point[1];

  return [
    rotatedX,
    rotatedY
  ];
};
