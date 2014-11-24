#!/usr/bin/env node
var fs = require('fs');

var json_text = fs.readFileSync('data/settings.json', "utf8");
var json = JSON.parse(json_text);

var output = [];

function convert( obj, assign, output){
    for( var name in obj){
        var output_value;
        var item = obj[name];
        var new_assign = assign +"."+ name;

        if( item instanceof Array ) {
            output_value = "["+ item.toString() +"]";
            output.push( new_assign +" = "+ output_value );
        }
        else if( item === null || item === undefined ){
            output_value = item;
            output.push( new_assign +" = "+ output_value );
        }
        else if( typeof item === 'object' ) {
            output.push( new_assign + " = {}" );
            output = convert( item, new_assign, output );
        }
        else {
            output_value = item;
            output.push( new_assign +" = "+ output_value );
        }

    }
    //console.log(output[]);
    return output;
}



output = convert( json, 'settings', ['settings = {}']);

var output_string = output.join(';\n');
output_string += ';';

//console.log(output);
//console.log(output_string);


fs.writeFile("data/settings.json.js", output_string, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
});
//*/


//var text = fs.open('build.sh');
//console.log(typeof json);
//console.log(json);
