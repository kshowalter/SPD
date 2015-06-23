Settings = new Mongo.Collection('settings');
Values = new Mongo.Collection('inputs');
NEC_tables = new Mongo.Collection('NEC_tables');

Modules = new Mongo.Collection('modules');
Components = new Mongo.Collection('components');

if(Meteor.isServer){
  Settings.remove({});
  Values.remove({});
  NEC_tables.remove({});

  Modules.remove({});
  Components.remove({});
}
