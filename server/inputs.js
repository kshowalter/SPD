var settings = settings || {};


settings.in = {};

settings.in.opt = {};
settings.in.opt.AC = {};
settings.in.opt.AC.types = {};
settings.in.opt.AC.types["120V"] = ["ground","neutral","L1"];
settings.in.opt.AC.types["240V"] = ["ground","neutral","L1","L2"];
settings.in.opt.AC.types["208V"] = ["ground","neutral","L1","L2"];
settings.in.opt.AC.types["277V"] = ["ground","neutral","L1"];
settings.in.opt.AC.types["480V Wye"] = ["ground","neutral","L1","L2","L3"];
settings.in.opt.AC.types["480V Delta"] = ["ground","L1","L2","L3"];



settings.inputs = {};
settings.inputs.location = {};
settings.inputs.location.county = {};
settings.inputs.location.county.type = 'text_input';
settings.inputs.location.address = {};
settings.inputs.location.address.type = 'text_input';
settings.inputs.location.city = {};
settings.inputs.location.city.type = 'text_input';
settings.inputs.location.zip = {};
settings.inputs.location.zip.type = 'text_input';

settings.inputs.roof = {};
settings.inputs.roof.width = {};
settings.inputs.roof.width.options = [];
for( i=15; i<=70; i+=5 ) settings.inputs.roof.width.options.push(i);
settings.inputs.roof.width.units = 'ft.';
settings.inputs.roof.width.note = 'This the full size of the roof, perpendictular to the slope.';
settings.inputs.roof.width.type = 'number_input';
settings.inputs.roof.length = {};
settings.inputs.roof.length.options = [];
for( i=10; i<=60; i+=5 ) settings.inputs.roof.length.options.push(i);
settings.inputs.roof.length.units = 'ft.';
settings.inputs.roof.length.note = 'This the full length of the roof, measured from low to high.';
settings.inputs.roof.length.type = 'number_input';
settings.inputs.roof.slope = {};
settings.inputs.roof.slope.options = ['1:12','2:12','3:12','4:12','5:12','6:12','7:12','8:12','9:12','10:12','11:12','12:12'];
settings.inputs.roof.type = {};
settings.inputs.roof.type.options = ['Gable','Shed','Hipped'];
settings.inputs.module = {};
settings.inputs.module.make = {};
//settings.inputs.module.make.options = null;
settings.inputs.module.model = {};
//settings.inputs.module.model.options = null;
settings.inputs.module.orientation = {};
settings.inputs.module.orientation.options = ['Portrait','Landscape'];
settings.inputs.array = {};
settings.inputs.array.modules_per_string = {};
settings.inputs.array.modules_per_string.options = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
settings.inputs.array.num_strings = {};
settings.inputs.array.num_strings.options = [1,2,3,4,5,6];
settings.inputs.DC = {};
settings.inputs.DC.home_run_length = {};
//settings.inputs.DC.home_run_length.options = [25,50,75,100,125,150];
settings.inputs.DC.home_run_length.type = 'number_input';
settings.inputs.inverter = {};
settings.inputs.inverter.make = {};
//settings.inputs.inverter.make.options = null;
settings.inputs.inverter.model = {};
settings.inputs.inverter.location = {};
settings.inputs.inverter.location.options = ['Inside', 'Outside'];
//settings.inputs.inverter.model.options = null;
settings.inputs.AC = {};
settings.inputs.AC.loadcenter_types = {};
settings.inputs.AC.loadcenter_types['240V'] = {};
settings.inputs.AC.loadcenter_types['240V'] = ['240V','120V'];
settings.inputs.AC.loadcenter_types['208/120V'] = {};
settings.inputs.AC.loadcenter_types['208/120V'] = ['208V','120V'];
settings.inputs.AC.loadcenter_types['480/277V'] = {};
settings.inputs.AC.loadcenter_types['480/277V'] = ['480V Wye','480V Delta','277V'];
settings.inputs.AC.type = {};
//settings.inputs.AC.type.options = null;
settings.inputs.AC.distance_to_loadcenter = {};
//settings.inputs.AC.distance_to_loadcenter.options = [3,5,10,15,20,30];
settings.inputs.AC.distance_to_loadcenter.type = 'number_input';

settings.inputs.attachment_system = {};
settings.inputs.attachment_system.make = {
    options: ['UNIRAC'],
    type: 'select',
};
settings.inputs.attachment_system.model = {
    options: ['SOLARMOUNT'],
    type: 'select',
};



Values.remove({});

var section_list_alt = [];

for( var section_name in settings.inputs ){
  for( var input_name in settings.inputs[section_name]){
    var input = settings.inputs[section_name][input_name];
    if( input.options ){
      input.type = 'select';
    }
    input.name = input_name;
    input.section_name = section_name;
    input.value = null;
    input.user_input = true;
    Values.insert(input);
    section_list_alt.push(section_name);
  }

}

/*
var section_list = Values.find({}).map(function(doc){
  return doc.section_name;
});
section_list = _.uniq(section_list);
//*/
section_list = _.uniq(section_list_alt);

Settings.insert({
  id: 'section_list',
  value: section_list,
});


//settings.components.makes = Components.find({}).map(function(doc){
//  return doc.make;
//});
//settings.components.models = Components.find({}).map(function(doc){
//  return doc.model;
//});

settings.user_input = f.add_sections(settings.inputs);
//console.log(settings.user_input);



//settings.inputs = settings.inputs; // copy input reference with options to inputs
//settings.inputs = f.blank_copy(settings.inputs); // make input section blank
//settings.system_formulas = settings.system; // copy system reference to system_formulas
settings.system = f.blank_copy(settings.inputs); // make system section blank
//f.merge_objects( settings.inputs, settings.system );
