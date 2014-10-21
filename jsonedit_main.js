console.log(window);
// create the editor
var container = require('jsoneditor');
var editor = new JSONEditor(container);
var $ = require('jquery');

$.getJSON('../data/settings.json')


$('<div>')
.attr('id', 'jsoneditor')
.attr('style', 'width: 400px; height: 400px;')
.appendTo(document.body);

// set json
var json = {
    'Array': [1, 2, 3],
    'Boolean': true,
    'Null': null,
    'Number': 123,
    'Object': {'a': 'b', 'c': 'd'},
    'String': 'Hello World'
};
editor.set(json);

// get json
var json = editor.get();