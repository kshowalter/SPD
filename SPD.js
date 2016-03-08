//console.log(' ______  ');
//console.log(' \\    / ');
//console.log('  \\  /  ');
//console.log('   \\/   ');



Router.onBeforeAction( function(){
    subscribe['main']();
    this.next();
  },
  {only: ['main']}
);

Router.route('/', function () {
  this.render('main');
},{
  name: 'main'
});


//console.log('   /\\   ');
//console.log('  /  \\  ');
//console.log(' /    \\ ');
//console.log(' ------  ');
