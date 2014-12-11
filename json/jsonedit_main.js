console.log(window);
// create the editor
var JSONEditor = require('jsoneditor');
console.log(JSONEditor);
var $ = require('jquery');

var URL_settings = '../data/settings.json';

$.getJSON( URL_settings )
    .fail( function(returned){
        console.log('failed', returned);
    })
    .done( function(json){
        //console.log('done', data);
        ready(json);
    });

var container = $('<div>')
    .attr('id', 'jsoneditor')
    //.attr('style', 'width: 400px; height: 400px;')
    .prependTo(document.body).get()[0];

var editor = new JSONEditor(container);

function ready(json){
    // set json
    /*
    var json_sample = {
        'Array': [1, 2, 3],
        'Boolean': true,
        'Null': null,
        'Number': 123,
        'Object': {'a': 'b', 'c': 'd'},
        'String': 'Hello World'
    };
    //*/

    console.log(json);
    //editor.set(json_sample);
    editor.set(json);
    editor.setName('settings');
    editor.expandAll();
}

function get(){
    // get json
    var json = editor.get();

    var dataURI = 'data:application/json;base64,';
    var b64 = btoa(JSON.stringify(json, undefined, 4));

    dataURI += b64;
    $('#download').attr('href', dataURI);

    console.log('uri', dataURI);
    //window.location = dataURI;
}

var header_div = $('<div>')
    .attr('class', 'header')
    .prependTo(document.body);


var download_element = $('<a>')
    .text('Download')
    .attr('id','download')
    .attr('href', '#')
    .attr('download', 'settings.json')
    .appendTo(header_div)
    .click(function(){
        get();
    });

var help_element = $('<a>')
    .text('Help')
    .attr('id','help')
    .attr('href', 'http://www.jsoneditoronline.org/doc/index.html#tree_editor')
    .appendTo(header_div);
