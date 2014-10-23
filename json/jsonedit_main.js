console.log(window);
// create the editor
var JSONEditor = require('jsoneditor');
console.log(JSONEditor);
var $ = require('jquery');

var URL = 'data/settings.json';

$.getJSON( URL )
.fail( function(returned){
    console.log('failed', returned)
})
.done( function(json){
    //console.log('done', data);
    ready(json);
})

var container = $('<div>')
.attr('id', 'jsoneditor')
//.attr('style', 'width: 400px; height: 400px;')
.prependTo(document.body).get()[0];

var editor = new JSONEditor(container);

function ready(json){
    // set json
    var json_sample = {
        'Array': [1, 2, 3],
        'Boolean': true,
        'Null': null,
        'Number': 123,
        'Object': {'a': 'b', 'c': 'd'},
        'String': 'Hello World'
    };

    console.log(URL);
    //editor.set(json_sample);
    editor.set(json);
}

// get json
var json = editor.get();
