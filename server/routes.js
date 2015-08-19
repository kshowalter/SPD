

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
  where: 'server',
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
      marginTop: 0,
    }
  ).pipe(
    response
  );




},{
  name: 'pdf_sample',
  where: 'server',
});
