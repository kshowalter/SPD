#!/usr/bin/env node
var fs = require('fs');

var json_text = fs.readFileSync('data/settings.json', "utf8");

var json = JSON.parse(json_text);

for(var type in json ){
    for( var section in json[type]){
        for( var input_name in json[type][section] ){
            console.log( type +"."+ section +"."+ input_name +" = "+ json[type][section][input_name] );
        }
    }
}

//var text = fs.open('build.sh');
//console.log(typeof json);
//console.log(json);
