//console.log(' ______  ');
//console.log(' \\    / ');
//console.log('  \\  /  ');
//console.log('   \\/   ');


settings = mk_settings();
state = mk_state();
settings = mk_inputs(settings);
f.g = settings;
settings.f = f;

settings = mk_section_info(settings);



//var dev = true;
//if(dev) g = f.settings_dev_defaults(g);

if(Meteor.isClient){
  settings.webpage.window_width = window.innerWidth;
  settings.webpage.window_height = window.innerHeight;

}



if (Meteor.isClient) {


}

if (Meteor.isServer) {

  /*
  Database_test.remove({});
  var start = Date.now();
  database_test_string = Assets.getText('data/inverters_test.csv');
  //database_test_lines = database_test_string.split('\n');
  //console.log('number of lines', database_test_lines.length);
  var fields = 'type,make,model,dc_max_power,dc_volts_low,dc_volts_high,ac_volts_low,ac_volts_high'.split(',');
  database_test_string.split('\n').forEach(function(line){
    //values = line.split(',');
    var entry = {};
    line.split(',').forEach(function(value, index){
      number = Number(value);
      if( ! isNaN(number) ){
        value = number;
      }
      entry[fields[index]] = value;
    });
    Database_test.insert(entry);
  });

  console.log('time to load database: ', Date.now() - start, ' ms');
  console.log('database count: ', Database_test.find().count() );

  var number_of_records_found;
  var start = Date.now();
  _.range(100).forEach(function(){
    number_of_records_found = Database_test.find( {make: 'Maker_42'} ).count();
  });
  console.log('{make: Maker_42} time to find ', number_of_records_found, ' records, 100 times: ', Date.now() - start , ' ms');

  var start = Date.now();
  _.range(100).forEach(function(){
    number_of_records_found = Database_test.find( {dc_max_power: {$gt: 2500}} ).count();
  });
  console.log('{dc_max_power: {$gt: 2500}} time to find ', number_of_records_found, ' records, 100 times: ', Date.now() - start, ' ms' );

  //*/

}


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
