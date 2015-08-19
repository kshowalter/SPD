

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

/////////
// PDF option

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

  //var pdf = wkhtmltopdf(
  //  htmls[1],
  //  {
  //    pageSize: 'letter',
  //    orientation: 'landscape',
  //    marginBottom: 0,
  //    marginLeft: 0,
  //    marginRight: 0,
  //    marginTop: 0,
  //  }
  //).pipe(
  //  response
  //);

  //*/



},{
  name: 'drawing',
  where: 'server',
});
