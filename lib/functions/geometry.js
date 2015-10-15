geometry = {};

geometry.center = function(point1, point2){
  return {
    x: point1.x + ( point2.x - point1.x ) / 2,
    y: point1.y + ( point2.y - point1.y ) / 2,
  };
};

geometry.distance_between = function(point1, point2){
  return Math.sqrt( Math.pow((point2.x-point1.x),2) + Math.pow((point2.y-point1.y),2) );
};

geometry.move_toward = function( point1, point2, distance ){
  var total_distance_between = this.distance_between(point1, point2);
  var fraction = distance / total_distance_between;
  var dx = ( point2.x - point1.x ) * fraction;
  var dy = ( point2.y - point1.y ) * fraction;
  var point2b = {
    x: point1.x + dx,
    y: point1.y + dy,
  };
  return point2b;
};

geometry.rotate = function( point, pivot_point, angle ){
  var dx = pivot_point.x - point.x;
  var dy = pivot_point.y - point.y;
  var start_angle = 0;

};
