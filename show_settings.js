var settings = require('./app/settings');
var log = console.log.bind(console);
var $ = require('./lib/k/k_DOM')

console.log(settings);
text = JSON.stringify(settings, null, "        ");

var body = $(document.body);
var raw = $('pre');
raw.appendTo(body);
raw.html(text);
