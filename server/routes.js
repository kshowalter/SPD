

//var html = '<!doctype html><html><head></head><body style="width:1554px; height:1198px;"><div>' + svg.outerHTML + '</div></body></html>';

Router.route('/drawing/:system_id', function () {
  var response = this.response;
  console.log('server route', this.params.system_id);

  var system_id = this.params.system_id;

  var svgs = mk_drawing(system_id);



  //console.log(svgs[0].outerHTML);

  //var htmls = [];

// SVG option

  html = '<!doctype html><html><head></head><body style="width:1554px; height:1198px;"><div> ';
  svgs.forEach(function(svg){
    html += svg.outerHTML;
    //htmls.push(html);
  });

  html += ' </div></body></html>';



  response.end(html);

},{
  name: 'drawing',
  where: 'server'
});

Router.route('/drawing/:system_id/:page', function () {
  console.log('server route', this.params.system_id);
  var response = this.response;
  var page_num = this.params.page;
  var system_id = this.params.system_id;

  //var svgs = mk_drawing(system_id);

  html = '<!doctype html><html><head></head><body style="width:1554px; height:1198px;"><div> ';

  var svg_string = User_systems.findOne({system_id:system_id}).svgs[page_num-1];
  svg_string = svg_string.replace(/<svg /g, '<svg style="position:absolute; top:0px; left:0px;" ');
  html += svg_string;

  html += ' </div></body></html>';

  response.end(html);

},{
  name: 'drawing_page',
  where: 'server'
});

Router.route('/drawing/pdf_sample/:system_id', function () {
/////////
// PDF option
  var response = this.response;
  console.log('server route', this.params.system_id);

  var system_id = this.params.system_id;

  var svgs = mk_drawing(system_id);

  /*
  var pdfs = [];
  svgs.forEach(function(svg){
    var html = '<!doctype html><html><head></head><body style="width:1554px; height:1198px;"><div>' + svg.outerHTML + '</div></body></html>';
    htmls.push(html);
    pdfs.push(
      wkhtmltopdf(
        html,
        {
          pageSize: 'letter',
          orientation: 'landscape',
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
          marginTop: 0,
        }
      )
    );

  });
  //*/

  var html = '<!doctype html><html><head></head><body style="width:1554px; height:1198px;"><div>' + svgs[1].outerHTML + '</div></body></html>';
  var pdf = wkhtmltopdf(
    html,
    {
      pageSize: 'letter',
      orientation: 'landscape',
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0
    }
  ).pipe(
    response
  );




},{
  name: 'pdf_sample',
  where: 'server'
});

/*******************************************************************
 * Serves the permit to the user as a PDF for the passed system_id
 *******************************************************************/
Router.route('/permit/:system_id', function () {
	permit.download(this.request, this.response, this.params.system_id);
},{
	name: 'permit',
	where: 'server'
});

/*******************************************************************
 * Scrapes http://windspeed.atcouncil.org for the wind speed of the
 * passed latitude and longitude
 *******************************************************************/
Router.route('/wind/:latitude/:longitude', function () {
	var res = this.response;
	permit.getWind(this.params.latitude, this.params.longitude, function(windData) {
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(windData));
	});
},{
	name: 'wind',
	where: 'server'
});