mk_section_info = function(state){
  state = state || {};

  state.section_info = {
    //map: [
    location: [
      '<ul> ',
      '<li><a target="_blank" href= "http://windspeed.atcouncil.org/">Wind Zone<a>',
      '</li>',
      '<li><a target="_blank" href= "http://www.solarabcs.org/about/publications/reports/expedited-permit/map/index.html">Climate Conditions<a>',
      '</li>',
      '</ul>',
    ],
  };

  return state;
};
