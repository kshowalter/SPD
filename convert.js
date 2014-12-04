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

        var line;

        if( item instanceof Array ) {
            //output_value = "["+ item.toString() +"]";
            output_value = JSON.stringify(item);
            line = new_assign +" = "+ output_value;
        }
        else if( item === null || item === undefined ){
            output_value = item;
            line = new_assign +" = "+ new_assign +' || '+ output_value;
        }
        else if( typeof item === 'object' ) {
            line = new_assign + " = " + new_assign + " || {}";
        }
        else {
            output_value = item;
            line = new_assign +" = "+ output_value;
        }

        line = "    try { " + line + ";}\n    catch(e) { if(settings.state.database_loaded) console.log(e); }";

        output.push(line);

        if( !(item instanceof Array) && typeof item === 'object' ) {
            output = convert( item, new_assign, output );
        }
    }
    //console.log(output[]);
    return output;
}

/*
var output = ['function check(e){'];
var output = ['    '];
var output = ['}'];
//*/


var output = [];
//output.push('function test(e){ if(settings.state.database_loaded) console.log(e); };');
output.push('e = {};');

for( var section_name in json ){
    var item = json[section_name];
    output.push( 'e.' + section_name + ' = function(settings){' );
    output.push( "    " + 'settings.'+section_name + " = " + 'settings.'+section_name + " || {};" );
    output = convert( item, 'settings.'+section_name, output );
    output.push( '    return settings;' );
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
