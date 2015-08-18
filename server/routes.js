Router.route('/drawing/:system_id', function () {
  var response = this.response;
  console.log('server route', this.params.system_id);

  var system_id = this.params.system_id;
  var svgs = mk_drawing(system_id);
  //console.log(svgs[0].outerHTML);


  var html = [];
  svgs.forEach(function(svg){
    html.push(
      '<!doctype html><html><head></head><body style="width:1554px; height:1198px;"><div>' + svg.outerHTML + '</div></body></html>'
    );
  });

  var svg_string = svgs[0].outerHTML;

  //response.writeHead(200, {
  //  'Content-Type': 'pdf',
  //});

  var pdf = wkhtmltopdf(
    html[1],
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


  //wkhtmltopdf_object.pipe(this.response);
  //return svgs[0].outerHTML;

  //this.render('drawing');
  //var item = Items.findOne({_id: this.params._id});
  //this.render('ShowItem', {data: item});

  //console.log(typeof pdf_file)

  //response.write(pdf_file);
  //response.end();

},{
  name: 'drawing',
  where: 'server',
});
