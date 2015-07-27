console.log(' ______  ');
console.log(' \\    / ');
console.log('  \\  /  ');
console.log('   \\/   ');


settings = mk_settings();
f.g = settings;
settings.f = f;

settings = mk_section_info(settings);

//var dev = true;
//if(dev) g = f.settings_dev_defaults(g);




if (Meteor.isClient) {


}

if (Meteor.isServer) {


}


Router.route('/', function () {
  this.render('SPD');
});


console.log('   /\\   ');
console.log('  /  \\  ');
console.log(' /    \\ ');
console.log(' ------  ');
