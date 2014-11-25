#!/usr/bin/env node
var fs = require('fs');

var json_text = fs.readFileSync('data/settings.json', "utf8");
var json = JSON.parse(json_text);

var output = [];

var reg = /\/|\ /;

function convert( obj, assign, output){
    for( var name in obj){
        var output_value;
        var item = obj[name];
        var new_assign;
        if( ! name.match(reg) && ! name[0].match(/\d/) ) new_assign = assign +"."+ name;
        else new_assign = assign + '["' + name + '"]';

        if( item instanceof Array ) {
            //output_value = "["+ item.toString() +"]";
            output_value = JSON.stringify(item);
            output.push( new_assign +" = "+ output_value + ";" );
        }
        else if( item === null || item === undefined ){
            output_value = item;
            output.push( new_assign +" = "+ output_value + ";" );
        }
        else if( typeof item === 'object' ) {
            output.push( new_assign + " = " + new_assign + " || {};" );
            output = convert( item, new_assign, output );
        }
        else {
            output_value = item;
            output.push( new_assign +" = "+ output_value + ";" );
        }

    }
    //console.log(output[]);
    return output;
}

var output = ['e = {};'];
for( var name in json ){
    var item = json[name];
    output.push( 'e.' + name + ' = function(settings){' );
    output = convert( item, '    settings', output );
    output.push( '};' );

}
output.push( 'module.exports = e;' );


var output_string = output.join('\n');

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
