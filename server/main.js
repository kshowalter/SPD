fs = Npm.require('fs');
path = Npm.require('path');

var jsdom = Meteor.npmRequire("jsdom").jsdom;
document = jsdom();

wkhtmltopdf = Meteor.npmRequire("wkhtmltopdf");
PDFMerge = Meteor.npmRequire('pdf-merge');

Meteor.startup(function () {
  // code to run on server at startup
  Settings.remove({});
  NEC_tables.remove({});

  Components.remove({});


  load_data();
  settings = mk_inputs(settings);

  Inputs.remove({});
  for( var section_name in settings.inputs ){
    for( var value_name in settings.inputs[section_name]){
      var input = settings.inputs[section_name][value_name];
      Inputs.insert(input);
    }
  }


  //var jsdom = Meteor.npmRequire('moment');

  //var window = document.defaultView;
  //var div = document.createElement('div');
  //document.body.appendChild(div);
  //console.log('body: ', document.body.innerHTML);


  /*
    if(dev) {
      for( var section_name in settings.user_input ){
        for( var value_name in settings.user_input[section_name] ){
          //console.log( section_name, value_name, settings.user_input[section_name][value_name] );
          var new_value = settings.user_input[section_name][value_name];
          setValue( section_name, value_name, new_value );
        }
      }
    }
  //*/


  //f.process(settings);

  //Inputs.find({type:"user"}).observe({
  //  changed: function(dic){
  //    console.log("something changed, recalculating");
  //    f.process(settings);
  //  }
  //});


  var server_ready = true;





});
