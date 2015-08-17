Router.route('/drawing/:_id/:page_num', function () {
  console.log('server route', this.params._id, this.params.page_num);
  //this.render('drawing');
  //var item = Items.findOne({_id: this.params._id});
  //this.render('ShowItem', {data: item});
  this.response.write('test');
  this.response.end();
},{
  name: 'drawing',
  where: 'server',
});
