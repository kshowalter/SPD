(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// This is the k javascript library
// a collection of functions used by kshowalter
/////////////////////////////////////////////////////////////////////////////////////////////////////////





/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Misc. variables  /////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// log shortcut
var log = console.log.bind(console)
var logObj = function(obj){
    console.log(JSON.stringify(obj))
}
var logObjFull = function(obj){
    console.log(JSON.stringify(obj, null, 4))
}

// ~ page load time
var boot_time = moment()

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Start of libary object  //////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

var k = {}

k.test = function(){
    var x = boot_time
    return x
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Javasript functions //////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////



k.obj_extend = function(obj, props) {
    for(var prop in props) { 
        if(props.hasOwnProperty(prop)) {
            obj[prop] = props[prop]
        } 
    } 
}

k.obj_rename = function(obj, old_name, new_name){
    // Check for the old property name to avoid a ReferenceError in strict mode.
    if (obj.hasOwnProperty(old_name)) {
        obj[new_name] = obj[old_name]
        delete obj[old_name]
    }
    return obj
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Misc /////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////


// http://css-tricks.com/snippets/javascript/get-url-variables/
k.getQueryVariable = function(variable) {
       var query = window.location.search.substring(1)
       var vars = query.split("&")
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=")
               if(pair[0] == variable){
                   return pair[1]
               }
       }
       return(false)
}

k.str_repeat = function(string, count) {
    if (count < 1) return ''
    var result = '' 
    var pattern = string.valueOf()
    while (count > 0) {
        if (count & 1) result += pattern
        count >>= 1 
        pattern += pattern
    }
    return result
}


k.obj_id_array = function( object ) {
    if( object !== undefined ) {
        var a = [];
        for( var id in object ) {
            if( object.hasOwnProperty(id) )  {
                a.push(id);
            }
        }
        return a;
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Math, numbers ////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////


/*
 *  normRand: returns normally distributed random numbers
 *  http://memory.psych.mun.ca/tech/snippets/random_normal/
 */
k.normRand = function(mu, sigma) {
    var x1, x2, rad;

    do {
        x1 = 2 * Math.random() - 1;
        x2 = 2 * Math.random() - 1;
        rad = x1 * x1 + x2 * x2;
    } while(rad >= 1 || rad === 0);

    var c = Math.sqrt(-2 * Math.log(rad) / rad);
    var n = x1 * c;
    return (n * mu) + sigma;
}

k.pad_zero = function(num, size){
    var s = '000000000' + num
    return s.substr(s.length-size)     
}


k.uptime = function(boot_time){
    var uptime_seconds_total = moment().diff(boot_time, 'seconds')
    var uptime_hours = Math.floor(  uptime_seconds_total /(60*60) )
    var minutes_left = uptime_seconds_total %(60*60)
    var uptime_minutes = k.pad_zero( Math.floor(  minutes_left /60 ), 2 )
    var uptime_seconds = k.pad_zero( (minutes_left % 60), 2 )
    return uptime_hours +":"+ uptime_minutes +":"+ uptime_seconds
}



k.last_n_values = function(n){
    return {
        n: n,
        array: [],
        add: function(new_value){
            this.array.push(new_value)
            if( this.array.length > n ) this.array.shift()
            return this.array
        }
    }    
}

k.arrayMax = function(numArray) {
    return Math.max.apply(null, numArray);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// AJAX /////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

k.AJAX = function(url, callback) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
            if(xmlhttp.status == 200){
                callback(xmlhttp.responseText);
            }
            else if(xmlhttp.status == 400) {
                log('There was an error 400')
            }
            else {
                log('something else other than 200 was returned')
            }
        }
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

k.parseCSV = function(file_content) {
    var r = []
    var lines = file_content.split('\n')
    var header = lines.shift().split(',')
    log(header)
    for(var l = 0, len = lines.length; l < len; l++){
        var line = lines[l]
        if(line.length > 0){
            var line_obj = {}
            line.split(',').forEach(function(item,i){
                line_obj[header[i]] = item
            })
            r.push(line_obj)
        }
    }
    return(r)
}

k.getCSV = function(URL, callback) {
    k.AJAX(URL, k.parseCSV() )
}

/*
$.ajaxSetup ({
    cache: false
})



k.get_JSON = function(URL, callback, string) {
//    var filename = URL.split('/').pop()
//    log(URL)
    $.getJSON( URL, function( json ) {
        callback(json, URL, string)
    }).fail(function(jqxhr, textStatus, error) { 
        console.log( "error", textStatus, error  ) 
    })
}


k.load_files = function(file_list, callback){
    var d = {}

    function load_file(URL){
        var filename = URL.split('/').pop()
//        var name = filename.split('.')[0]
        $.getJSON( URL, function( json ) { // , textStatus, jqXHR) {
            add_JSON(filename, json)
        }).fail(function(jqxhr, textStatus, error) { 
            console.log( "error", textStatus, error  ) 
        })
    }

    function add_JSON(name, json){
        d[name] = json
        if(Object.keys(d).length == d_files.length){
            callback(d)
        }
    }

    for( var key in file_list){
        var URL = file_list[key]
        load_file(URL)
    }
    
//    callback(d)
}

k.getFile = function(URL, callback){
    $.ajax({
        url: URL,
        beforeSend: function( xhr ) {
            xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
        }
    })
    .done(function( data ) {
        callback(data)
    })
    .fail(function(jqxhr, textStatus, error) { 
            console.log( "error", textStatus, error  ) 
    })
    
    
}
*/


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// HTML /////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////




k.setup_body = function(title, sections){
    document.title = title
    var body = document.body 
    var status_bar = document.createElement('div')
    status_bar.id = 'status'
    status_bar.innerHTML = 'loading status...'
    /*
    var title_header = document.createElement('h1')
    title_header.innerHTML = title
    body.insertBefore(title_header, body.firstChild)
    */
    body.insertBefore(status_bar, body.firstChild)
    /*
    var tabs_div = k.make_tabs(sections)
    $('body').append(tabs_div)
    $( '.tabs' ).tabs({ 
        activate: function( event, ui ) {
            var full_title = title + " / " + ui.newTab[0].textContent
            document.title = full_title
            $('#title').text(full_title)
            //dump(moment().format('YYYY-MM-DD HH:mm:ss'))
            $.sparkline_display_visible()
        }
    })
    var section = k.getQueryVariable('sec')
    if(section in sections) {
        var index = $('.tabs a[href="#'+section+'"]').parent().index()
        $(".tabs").tabs("option", "active", index)
    }
    */

}
/*
k.make_tabs = function(section_obj){
    var tabs_div = $('<div>').addClass('tabs')
    var head_div = $('<ul>').appendTo(tabs_div)

    for (var id in section_obj){
        var title = section_obj[id]
        //('<li><a href="#'+id+'">'+title+'</a></li>'))
        //('<div id="'+id+'"></div>'))
    }   
    
    return tabs_div
}

*/
k.update_status_page = function(status_id, boot_time) {
    var status_div = document.getElementById(status_id)
    status_div.innerHTML = ''

    var clock = document.createElement('span')
    clock.innerHTML = moment().format('YYYY-MM-DD HH:mm:ss')

    var uptime = document.createElement('span')
    uptime.innerHTML = 'Uptime: ' + k.uptime(boot_time)
    
    status_div.appendChild(clock)
    status_div.innerHTML += ' | '
    status_div.appendChild(uptime)
    status_div.innerHTML += ' | '
}

/*
k.obj_log = function(obj, obj_name, max_level){
    var levels = function(obj, level_indent, str){
        for(var name in obj) {
            var item = obj[name]
            if( level_indent <= max_level && typeof(item) == 'object' ) {
                str += "\n" + k.str_repeat(" ", level_indent*2) + name 
                str = levels(item, level_indent+1, str )
            } else if(typeof item !== 'function') {
                str += "\n" + k.str_repeat(" ", level_indent*2) + name + ": " + item
            } else {
                str += "\n" + k.str_repeat(" ", level_indent*2) + name + ": <function>"
            }
        }
        return str
    }
    var max_level = max_level || 100
    log(obj_name)
    var str = '-' + obj_name + '-'
    max_level++
    level_indent = 2
    str = levels(obj, level_indent, str)
    log(str)
}


k.obj_tree = function(obj, title){
    // takes a javascript, and returens a jquery DIV
    var obj_div = $('<pre>') //.addClass('box')
    var levels = function(obj, level_indent){(line, circle, text ) 
        var list = []
        var obj_length = 0
        for( var key in obj) {obj_length++}
        var count = 0          
        for(var key in obj) {
            var item = obj[key]
            
//            var indent_string = '&nbsp;&nbsp;&nbsp;&#9474'.repeat(level) + '&nbsp;&nbsp;&nbsp;'
//            if(level_indent === '' ){
//                next_level_indent = level_indent + '&nbsp;&nbsp;' 
//                this_level_indent = level_indent + '&nbsp;&nbsp;'
//            } else 
            if(count == obj_length-1 ) {   // If last item, finsh tree section
                var next_level_indent = level_indent + '&nbsp;&nbsp;' 
                var this_level_indent = level_indent + '&nbsp;&#9492;&#9472;' 
            }
            else{ 
                var next_level_indent = level_indent + '&nbsp;&#9474;' 
                var this_level_indent = level_indent + '&nbsp;&#9500;&#9472;' 
            }
            
            
            if( typeof(item) == 'object' ){
                list.push( this_level_indent + key)
                list = list.concat( levels(item, next_level_indent) )
            } else {
                item = item.toString().replace(/(\r\n|\n|\r)/gm," ").replace(/\s+/g," ") //http://www.textfixer.com/tutorials/javascript-line-breaks.php
                list.push(this_level_indent + key+": "+ item)
            }
            
            
//            log(key,level)
            count++
            
        }
        return list
    }
    
    var list = [title].concat(levels(obj,''))
    list.forEach( function(line,key){
        obj_div.append(line + '</br>')
    })
    return obj_div
}




/*
k.obj_display = function(obj){
    function levels(obj,level){
    //    var subobj_div = $('<div>')
        var subobj_ul = $('<ul>').addClass('tree')

        for(var key in obj) {
            var item = obj[key]
    //        log(key, typeof(item))
            if( typeof(item) == 'object' ){
    //            ('<li>').text("&nbsp;".repeat(level) + key))
                ('<li>').text(key))
                subobj_ul.append(levels(item,level+1))
    //            log("&nbsp;".repeat(level) + key)
            } else {
    //            subobj_div.append('<span>').text("&nbsp;".repeat(level) + key+": "+ item)
    //            ('<li>').text("&nbsp;".repeat(level) + key +": "+ item))
                ('<li>').text(key +": "+ item))
    //            log("&nbsp;".repeat(level) + key+": "+ item)
            }
        }
        return subobj_ul
    }
    // takes a javascript, and returens a jquery DIV
    var obj_div = $('<div>')//.addClass('box')
    
    obj_div.append(levels(obj,0))
    return obj_div
}

k.show_obj = function(container_id, obj, name){
    var id = '#' + name
    if( ! $(container_id).children(id).length ) { 
        ('<div>').attr('id', name)) 
    }
    var box = $(container_id).children(id)
    box.empty()
    
    var obj_div = $('<div>').addClass('box')
    obj_div.append(k.obj_tree(obj, name))
    box.append(obj_div)
    
}

*/
k.log_object_tree = function(components){
    for( var make in components.modules ){
        if( components.modules.hasOwnProperty(make)){
            for( var model in components.modules[make] ){
                if( components.modules[make].hasOwnProperty(model)){
                    var o = components.modules[make][model]
                    var a = [make,model]
                    for( var spec in o ){
                        if( o.hasOwnProperty(spec)){
                            a.push(o[spec]);
                        }
                    }
                    log(a.join(','))
                }
            }
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// FSEC /////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////




k.cr1000_json = function(json){
//    var fields = []
//    $.each(json.head.fields, function(key, field) {
//        fields.push(field.name)
//    })
//    var data = _.zip(fields, json.data[0].vals)
//    
    var timestamp = json.data[0].time
    var data = {}
    data.Timestamp = json.data[0].time
    data.RecordNum = json.data[0].no
    for(var i = 0, l = json.head.fields.length; i < l; i++ ){
        data[json.head.fields[i].name] = json.data[0].vals[i]
    }
    
    return data
}






/////////////////////////////////////////////////////////////////////////////////////////////////////////
// D3 ///////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////



k.d3 = {}

k.d3.live_sparkline = function(id, history) {
    var data = history.array
    var length = history.array.length
    var n = history.n
    //k.d3.live_sparkline = function(id, width, height, interpolation, animate, updateDelay, transitionDelay) {
    // based on code posted by Ben Christensen https://gist.github.com/benjchristensen/1148374
    
    var width = 400,
        height = 50,
        interpolation = 'basis',
        animate = true,
        updateDelay = 1000,
        transitionDelay = 1000
    
    // X scale will fit values from 0-10 within pixels 0-100
    // starting point is -5 so the first value doesn't show and slides off the edge as part of the transition
    var x = d3.scale.linear().domain([0, 59]).range([0, width]); 
    // Y scale will fit values from 0-10 within pixels 0-100
    var y = d3.scale.linear().domain([20, 40]).range([height, 0]);

    // create a line object that represents the SVN line we're creating
    var line = d3.svg.line()
        // assign the X function to plot our line as we wish
        .x(function(d,i) { 
            // verbose logging to show what's actually being done
            //console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
            // return the X coordinate where we want to plot this datapoint
            return x(i); 
        })
        .y(function(d) { 
            // verbose logging to show what's actually being done
            //console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
            // return the Y coordinate where we want to plot this datapoint
            return y(d); 
        })
        .interpolate(interpolation)

    // If svg does not exist, create it
    if( ! d3.select('#'+id).select('svg')[0][0] ){
        // create an SVG element inside the #graph div that fills 100% of the div
        var graph = d3.select('#'+id).append("svg:svg").attr("width", width).attr("height", height);

        // display the line by appending an svg:path element with the data line we created above
//        graph.append("svg:path").attr("d", line(data));
        // or it can be done like this
        graph.selectAll("path").data([data]).enter().append("svg:path").attr("d", line);
    }
    
    var graph = d3.select('#'+id+' svg')
    log( length)
    // update with animation
    graph.selectAll("path")
        .data([data]) // set the new data
        .attr("transform", "translate(" + x(n-length +1) + ")") // set the transform to the right by x(1) pixels (6 for the scale we've set) to hide the new value
        .attr("d", line) // apply the new data values ... but the new value is hidden at this point off the right of the canvas
        .transition() // start a transition to bring the new value into view
        .ease("linear")
        .duration(transitionDelay) // for this demo we want a continual slide so set this to the same as the setInterval amount below
        .attr("transform", "translate(" + x(n-length) + ")"); // animate a slide to the left back to x(0) pixels to reveal the new value

        /* thanks to 'barrym' for examples of transform: https://gist.github.com/1137131 */
//     graph.append("rect")
//          .attr("x", 0)
//          .attr("y", 0)
//          .attr("height", height)
//          .attr("width", width)
//          .style("stroke", '#f00')
//          .style("fill", "none")
//          .style("stroke-width", '1px')
     
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Events ///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

k.e = {}

k.uptime = function(boot_time){
    var uptime_seconds_total = moment().diff(boot_time, 'seconds')
    var uptime_hours = Math.floor(  uptime_seconds_total /(60*60) )
    var minutes_left = uptime_seconds_total %(60*60)
    var uptime_minutes = k.pad_zero( Math.floor(  minutes_left /60 ), 2 )
    var uptime_seconds = k.pad_zero( (minutes_left % 60), 2 )
    return uptime_hours +":"+ uptime_minutes +":"+ uptime_seconds
}

k.e.addTimeSince = function(event_list){
    log(moment().format('YYYY-MM-DD'))
    log(moment().fromNow())
    event_list.forEach(function(event){
        var date_array = event.date.split('-').map(Number)
        var year = date_array[0]
        var month = date_array[1]
        var day = date_array[2]
        var this_year = moment().year()
        if(moment().diff(moment([this_year, month-1, day]), 'days') > 0) {this_year++}
        var event_moment = moment(event.date, 'YYYY-MM-DD')
        var days_ago = moment().diff(event_moment, 'day')
        event.time_since = event_moment.fromNow()
        event.years_ago = moment().diff(event_moment, 'years')
        event.days_till_next = -moment().diff(moment([this_year, month-1, day]), 'days')
    })
    event_list.sort(function(a,b){
        return a.days_till_next - b.days_till_next
    })
    return event_list
} 

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Displays /////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

k.d = {}

/*
k.d = {
    width: '100%',
    value: 0,
    
}

k.d.prototype.setPer = function(percent){
    this.bar.css('width', percent+'%')
}
*/


/*
k.d.bar = function(){
    var bar = {}

    bar.width = 100
    bar.width_unit = '%' 
    bar.height = '8px'    

    log(bar.width+'%')
    bar.div = $('<div>').css('width', '0%')
    bar.element = $('<div>').addClass('progressbar').css('width', 100)
    bar.element.append(bar.div)

    bar.setPercent = function(percent){
        this.width = percent
        this.width_unit = '%'
        this.update()
    }
    bar.update = function(){
        this.div.css('width', this.width+this.width_unit)
        this.element.css('height', toString(this.height)+'px')
    } 
    return bar
}
*/



},{}],2:[function(require,module,exports){

var elem_prototype = {

    html: function(html){
       this.elem.innerHTML = html;
       return this;
    },
    append: function(sub_element){
        this.elem.appendChild(sub_element.elem); 
        return this;
    },
    appendTo: function(parent_element){
        parent_element.append(this); 
        return this;
    },
    attr: function(name, value ){
        var attributeName;
        if( name === 'class'){
            attributeName = 'className';
        } else {
            attributeName = name; 
        }
        this.elem[attributeName] = value; 
        return this;
    },



}

var Elem = function(element){
    var E = Object.create(elem_prototype);

    E.elem = element;

    return E;

}

var $ = function(input){
    if( typeof input === 'undefined' ) {
        //log('input needed');
        return false;
    }
    if( input.substr(0,1) === '#' ) {
        var element = document.getElementById(input.substr(1));
        return Elem(element);
    } else if( input.substr(0,1) === '.' ) {
        var element = document.getElementByClassName(input.substr(1)[0]);
        return Elem(element);
    } else {
        if( input === 'value' ) {
            var element = Value(); 
            return element;
        } else if( input === 'selector' ) {
            var element = Selector(); 
            return element;
        } else {
            var element = document.createElement(input);
            return Elem(element);
        }
    }
    


}

},{}],3:[function(require,module,exports){

var selector_prototype = {
    change: function(new_value){
        if( new_value !== undefined ) { 
            this.set_value(new_value);
        }
        this.expanded = !this.expanded;
        if( this.g_update !== undefined ){
            this.g_update();
        }
    },
    update_options: function(){
        //TODO: find way to do this other than eval
        if( this.options_reference !== undefined ) {
            eval( 'this.options = ' + this.options_reference + ";" );
        }
        if( this.options !== undefined ) {
            this.elem_options.innerHTML = '';
            this.options.forEach(function(value,id){
                var o = document.createElement('a')
                o.href = '#';
                o.setAttribute('class', 'selector_option');
                o.innerHTML = value;
                var that = this;
                o.addEventListener('click', function(){
                    that.change(value);
                }, false);
                this.elem_options.appendChild(o);

            }, this);
            if( ! (this.options.indexOf(this.value)+1) ){
                this.set_value(this.options[0]);
            }
        }
        return this;
    },
    set_value: function(new_value){
        if( new_value !== undefined ) {
            this.value = new_value;
            this.elem_value = document.createElement('a');
            this.elem_value.href = '#';
            this.elem_value.setAttribute('class', 'selector');
            this.elem_value.innerHTML = this.value;
            var that = this;
            this.elem_value.addEventListener('click', function(){
                that.location = this.getBoundingClientRect();
                that.change();
            }, false);
        }
        settings[this.setting] = this.value;
        return this;    
    },
    set_options: function(options_reference) {
        this.options_reference = options_reference;
        //TODO: find way to do this other than eval
        return this;
    },
    set_setting: function(new_setting){
        this.setting = new_setting;
        if( settings[this.setting] !== undefined ) {
            this.set_value(settings[this.setting]);
        } else {
            this.set_value();
        }
        return this;
    },
    setUpdate: function(update_function){
        this.g_update = update_function; 
    },
    update: function(){
        this.update_options();
        this.update_elements();
        return this;
    },
    update_elements: function() {
        if(this.expanded){
            this.elem.innerHTML = "";
            this.elem.appendChild(this.elem_options);
        } else {
            this.elem.innerHTML = "";
            this.elem.appendChild(this.elem_value);
        }
    },
}
for( var id in elem_prototype ) {
    if( elem_prototype.hasOwnProperty(id) ) {
        selector_prototype[id] = elem_prototype[id]; 
    }
}

var Selector = function(){
    var s = Object.create(selector_prototype);
    s.type = 'selector';
    s.expanded = false;
    s.elem = document.createElement('span');
    s.elem.setAttribute('class', 'selector_menu');

    s.elem_options = document.createElement('span');
    s.elem_value = document.createElement('span');
    s.elem_value.innerHTML = '-';
    
    settings_registry.push(s);
    return s;
};





var value_prototype = {
    update: function(){
        if( this.g_update !== undefined ){
            this.g_update();
        }
        if( this.reference ){
            eval( 'this.value = ' + this.reference + ';' );
        }    
        if( isNaN(Number(this.value)) ){
            this.elem.innerHTML = this.value;
        } else {
            this.elem.innerHTML = Number(this.value).toFixed(3);
            if( this.min !== undefined && this.value <= this.min ) {
                this.attr('class', 'valueOutOfRange')
            } else if( this.max !== undefined && this.value >= this.max ) {
                this.attr('class', 'valueOutOfRange')
            } else {
                this.attr('class', '')
            }
        }
        return this;
    },
    set: function(new_value) {
        if( typeof new_value !== 'undefined' ){
            this.value = new_value;
        }
        return this;
    },
    setUpdate: function(update_function){
        this.g_update = update_function; 
    },
    setRef: function(reference){
        if( typeof reference !== 'undefined' ){
            this.reference = reference;
        }
        return this;
    },
    setMax: function(value){
        this.max = value;
        this.update;
        return this;
    },
    setMin: function(value){
        this.min = value;
        this.update;
        return this;
    },
}
for( var id in elem_prototype ) {
    if( elem_prototype.hasOwnProperty(id) ) {
        value_prototype[id] = elem_prototype[id]; 
    }
}

function Value() {
    var v = Object.create(value_prototype);
    v.type = 'value';
    v.elem = document.createElement('span');

    v.value = '-';
    v.innerHTML = v.value;
    v.reference = false;


    v.update();

    settings_registry.push(v);
    return v;
}



},{}],4:[function(require,module,exports){
'use strict';

var kdb_prototype = {
    set_fields: function(field_array) {
        var list;
        if( typeof arguments[0] === 'string' ) {  // each argument is a field
            list = Array.prototype.slice.call(arguments); //convert arguments to an array
        } else { // assumed list of fields
            list = argument[0];
        }

        this.fields = []
        list.forEach( function(field) {
            this.fields.push(field) ;
        },this) 

        return this;
    },

    add: function(entry) {
        var list;
        var obj = {};

        if( Object.prototype.toString.call(entry) === '[object Array]' ) { // if list is submitted
            list = arguments[0];
        } else if( Object.prototype.toString.call(entry) === '[object Object]' ) { // if object is submitted
            obj = arguments[0];
        } else {  // each argument is a field: string, number, etc.
            list = Array.prototype.slice.call(arguments); //convert arguments to an array
        }
        if( list !== undefined ) {
            list.forEach( function( value, i ) {
                obj[this.fields[i]] = value;
            },this) 
        }


        this.rows.push(obj);
            
        return this;
    },
    CSV: function(string){
    
    
    },
    get: function(field, value){
        //var h = this.fields.indexOf(column);
        //log(h, this.fields[h])
        var output = [];
        this.rows.forEach( function(row,id){
            if( row[field] === value ){
                output.push(row);
            }
        },this)    
        log(output)
        return output;
    },
    column: function(field){
        var column = [];
        this.rows.forEach( function(row){
            column.push( row[field] );
        })
        return column;
    },
}


function KDB() {
    var d = Object.create(kdb_prototype);
    
    d.rows = [];



    return d;
}





},{}],5:[function(require,module,exports){
/* svg.js 1.0.0-rc.6-1-g1286e3d - svg inventor regex default color array pointarray patharray number viewbox bbox rbox element parent container fx relative event defs group arrange mask clip gradient pattern doc shape use rect ellipse line poly path image text textpath nested hyperlink sugar set data memory loader helpers - svgjs.com/license */
;(function() {

  this.SVG = function(element) {
    if (SVG.supported) {
      element = new SVG.Doc(element)
  
      if (!SVG.parser)
        SVG.prepare(element)
  
      return element
    }
  }
  
  // Default namespaces
  SVG.ns    = 'http://www.w3.org/2000/svg'
  SVG.xmlns = 'http://www.w3.org/2000/xmlns/'
  SVG.xlink = 'http://www.w3.org/1999/xlink'
  
  // Element id sequence
  SVG.did  = 1000
  
  // Get next named element id
  SVG.eid = function(name) {
    return 'Svgjs' + name.charAt(0).toUpperCase() + name.slice(1) + (SVG.did++)
  }
  
  // Method for element creation
  SVG.create = function(name) {
    /* create element */
    var element = document.createElementNS(this.ns, name)
    
    /* apply unique id */
    element.setAttribute('id', this.eid(name))
    
    return element
  }
  
  // Method for extending objects
  SVG.extend = function() {
    var modules, methods, key, i
    
    /* get list of modules */
    modules = [].slice.call(arguments)
    
    /* get object with extensions */
    methods = modules.pop()
    
    for (i = modules.length - 1; i >= 0; i--)
      if (modules[i])
        for (key in methods)
          modules[i].prototype[key] = methods[key]
  
    /* make sure SVG.Set inherits any newly added methods */
    if (SVG.Set && SVG.Set.inherit)
      SVG.Set.inherit()
  }
  
  // Method for getting an element by id
  SVG.get = function(id) {
    var node = document.getElementById(id)
    if (node) return node.instance
  }
  
  // Initialize parsing element
  SVG.prepare = function(element) {
    /* select document body and create invisible svg element */
    var body = document.getElementsByTagName('body')[0]
      , draw = (body ? new SVG.Doc(body) : element.nested()).size(2, 2)
      , path = SVG.create('path')
  
    /* insert parsers */
    draw.node.appendChild(path)
  
    /* create parser object */
    SVG.parser = {
      body: body || element.parent
    , draw: draw.style('opacity:0;position:fixed;left:100%;top:100%;overflow:hidden')
    , poly: draw.polyline().node
    , path: path
    }
  }
  
  // svg support test
  SVG.supported = (function() {
    return !! document.createElementNS &&
           !! document.createElementNS(SVG.ns,'svg').createSVGRect
  })()
  
  if (!SVG.supported) return false

  SVG.invent = function(config) {
  	/* create element initializer */
  	var initializer = typeof config.create == 'function' ?
  		config.create :
  		function() {
  			this.constructor.call(this, SVG.create(config.create))
  		}
  
  	/* inherit prototype */
  	if (config.inherit)
  		initializer.prototype = new config.inherit
  
  	/* extend with methods */
  	if (config.extend)
  		SVG.extend(initializer, config.extend)
  
  	/* attach construct method to parent */
  	if (config.construct)
  		SVG.extend(config.parent || SVG.Container, config.construct)
  
  	return initializer
  }

  SVG.regex = {
    /* parse unit value */
    unit:         /^(-?[\d\.]+)([a-z%]{0,2})$/
    
    /* parse hex value */
  , hex:          /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
    
    /* parse rgb value */
  , rgb:          /rgb\((\d+),(\d+),(\d+)\)/
  
    /* test hex value */
  , isHex:        /^#[a-f0-9]{3,6}$/i
    
    /* test rgb value */
  , isRgb:        /^rgb\(/
    
    /* test css declaration */
  , isCss:        /[^:]+:[^;]+;?/
    
    /* test for blank string */
  , isBlank:      /^(\s+)?$/
    
    /* test for numeric string */
  , isNumber:     /^-?[\d\.]+$/
  
    /* test for percent value */
  , isPercent:    /^-?[\d\.]+%$/
  
    /* test for image url */
  , isImage:      /\.(jpg|jpeg|png|gif)(\?[^=]+.*)?/i
    
  }

  SVG.defaults = {
    // Default matrix
    matrix:       '1 0 0 1 0 0'
    
    // Default attribute values
  , attrs: {
      /* fill and stroke */
      'fill-opacity':     1
    , 'stroke-opacity':   1
    , 'stroke-width':     0
    , 'stroke-linejoin':  'miter'
    , 'stroke-linecap':   'butt'
    , fill:               '#000000'
    , stroke:             '#000000'
    , opacity:            1
      /* position */
    , x:                  0
    , y:                  0
    , cx:                 0
    , cy:                 0
      /* size */  
    , width:              0
    , height:             0
      /* radius */  
    , r:                  0
    , rx:                 0
    , ry:                 0
      /* gradient */  
    , offset:             0
    , 'stop-opacity':     1
    , 'stop-color':       '#000000'
      /* text */
    , 'font-size':        16
    , 'font-family':      'Helvetica, Arial, sans-serif'
    , 'text-anchor':      'start'
    }
    
    // Default transformation values
  , trans: function() {
      return {
        /* translate */
        x:        0
      , y:        0
        /* scale */
      , scaleX:   1
      , scaleY:   1
        /* rotate */
      , rotation: 0
        /* skew */
      , skewX:    0
      , skewY:    0
        /* matrix */
      , matrix:   this.matrix
      , a:        1
      , b:        0
      , c:        0
      , d:        1
      , e:        0
      , f:        0
      }
    }
    
  }

  SVG.Color = function(color) {
    var match
    
    /* initialize defaults */
    this.r = 0
    this.g = 0
    this.b = 0
    
    /* parse color */
    if (typeof color === 'string') {
      if (SVG.regex.isRgb.test(color)) {
        /* get rgb values */
        match = SVG.regex.rgb.exec(color.replace(/\s/g,''))
        
        /* parse numeric values */
        this.r = parseInt(match[1])
        this.g = parseInt(match[2])
        this.b = parseInt(match[3])
        
      } else if (SVG.regex.isHex.test(color)) {
        /* get hex values */
        match = SVG.regex.hex.exec(fullHex(color))
  
        /* parse numeric values */
        this.r = parseInt(match[1], 16)
        this.g = parseInt(match[2], 16)
        this.b = parseInt(match[3], 16)
  
      }
      
    } else if (typeof color === 'object') {
      this.r = color.r
      this.g = color.g
      this.b = color.b
      
    }
      
  }
  
  SVG.extend(SVG.Color, {
    // Default to hex conversion
    toString: function() {
      return this.toHex()
    }
    // Build hex value
  , toHex: function() {
      return '#'
        + compToHex(this.r)
        + compToHex(this.g)
        + compToHex(this.b)
    }
    // Build rgb value
  , toRgb: function() {
      return 'rgb(' + [this.r, this.g, this.b].join() + ')'
    }
    // Calculate true brightness
  , brightness: function() {
      return (this.r / 255 * 0.30)
           + (this.g / 255 * 0.59)
           + (this.b / 255 * 0.11)
    }
    // Make color morphable
  , morph: function(color) {
      this.destination = new SVG.Color(color)
  
      return this
    }
    // Get morphed color at given position
  , at: function(pos) {
      /* make sure a destination is defined */
      if (!this.destination) return this
  
      /* normalise pos */
      pos = pos < 0 ? 0 : pos > 1 ? 1 : pos
  
      /* generate morphed color */
      return new SVG.Color({
        r: ~~(this.r + (this.destination.r - this.r) * pos)
      , g: ~~(this.g + (this.destination.g - this.g) * pos)
      , b: ~~(this.b + (this.destination.b - this.b) * pos)
      })
    }
    
  })
  
  // Testers
  
  // Test if given value is a color string
  SVG.Color.test = function(color) {
    color += ''
    return SVG.regex.isHex.test(color)
        || SVG.regex.isRgb.test(color)
  }
  
  // Test if given value is a rgb object
  SVG.Color.isRgb = function(color) {
    return color && typeof color.r == 'number'
                 && typeof color.g == 'number'
                 && typeof color.b == 'number'
  }
  
  // Test if given value is a color
  SVG.Color.isColor = function(color) {
    return SVG.Color.isRgb(color) || SVG.Color.test(color)
  }

  SVG.Array = function(array, fallback) {
    array = (array || []).valueOf()
  
    /* if array is empty and fallback is provided, use fallback */
    if (array.length == 0 && fallback)
      array = fallback.valueOf()
  
    /* parse array */
    this.value = this.parse(array)
  }
  
  SVG.extend(SVG.Array, {
    // Make array morphable
    morph: function(array) {
      this.destination = this.parse(array)
  
      /* normalize length of arrays */
      if (this.value.length != this.destination.length) {
        var lastValue       = this.value[this.value.length - 1]
          , lastDestination = this.destination[this.destination.length - 1]
  
        while(this.value.length > this.destination.length)
          this.destination.push(lastDestination)
        while(this.value.length < this.destination.length)
          this.value.push(lastValue)
      }
  
      return this
    }
    // Clean up any duplicate points
  , settle: function() {
      /* find all unique values */
      for (var i = 0, il = this.value.length, seen = []; i < il; i++)
        if (seen.indexOf(this.value[i]) == -1)
          seen.push(this.value[i])
  
      /* set new value */
      return this.value = seen
    }
    // Get morphed array at given position
  , at: function(pos) {
      /* make sure a destination is defined */
      if (!this.destination) return this
  
      /* generate morphed array */
      for (var i = 0, il = this.value.length, array = []; i < il; i++)
        array.push(this.value[i] + (this.destination[i] - this.value[i]) * pos)
  
      return new SVG.Array(array)
    }
    // Convert array to string
  , toString: function() {
      return this.value.join(' ')
    }
    // Real value
  , valueOf: function() {
      return this.value
    }
    // Parse whitespace separated string
  , parse: function(array) {
      array = array.valueOf()
  
      /* if already is an array, no need to parse it */
      if (Array.isArray(array)) return array
  
      return this.split(array)
    }
    // Strip unnecessary whitespace
  , split: function(string) {
      return string.replace(/\s+/g, ' ').replace(/^\s+|\s+$/g,'').split(' ') 
    }
    // Reverse array
  , reverse: function() {
      this.value.reverse()
  
      return this
    }
  
  })
  


  SVG.PointArray = function() {
    this.constructor.apply(this, arguments)
  }
  
  // Inherit from SVG.Array
  SVG.PointArray.prototype = new SVG.Array
  
  SVG.extend(SVG.PointArray, {
    // Convert array to string
    toString: function() {
      /* convert to a poly point string */
      for (var i = 0, il = this.value.length, array = []; i < il; i++)
        array.push(this.value[i].join(','))
  
      return array.join(' ')
    }
    // Get morphed array at given position
  , at: function(pos) {
      /* make sure a destination is defined */
      if (!this.destination) return this
  
      /* generate morphed point string */
      for (var i = 0, il = this.value.length, array = []; i < il; i++)
        array.push([
          this.value[i][0] + (this.destination[i][0] - this.value[i][0]) * pos
        , this.value[i][1] + (this.destination[i][1] - this.value[i][1]) * pos
        ])
  
      return new SVG.PointArray(array)
    }
    // Parse point string
  , parse: function(array) {
      array = array.valueOf()
  
      /* if already is an array, no need to parse it */
      if (Array.isArray(array)) return array
  
      /* split points */
      array = this.split(array)
  
      /* parse points */
      for (var i = 0, il = array.length, p, points = []; i < il; i++) {
        p = array[i].split(',')
        points.push([parseFloat(p[0]), parseFloat(p[1])])
      }
  
      return points
    }
    // Move point string
  , move: function(x, y) {
      var box = this.bbox()
  
      /* get relative offset */
      x -= box.x
      y -= box.y
  
      /* move every point */
      if (!isNaN(x) && !isNaN(y))
        for (var i = this.value.length - 1; i >= 0; i--)
          this.value[i] = [this.value[i][0] + x, this.value[i][1] + y]
  
      return this
    }
    // Resize poly string
  , size: function(width, height) {
      var i, box = this.bbox()
  
      /* recalculate position of all points according to new size */
      for (i = this.value.length - 1; i >= 0; i--) {
        this.value[i][0] = ((this.value[i][0] - box.x) * width)  / box.width  + box.x
        this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.x
      }
  
      return this
    }
    // Get bounding box of points
  , bbox: function() {
      SVG.parser.poly.setAttribute('points', this.toString())
  
      return SVG.parser.poly.getBBox()
    }
  
  })

  SVG.PathArray = function(array, fallback) {
    this.constructor.call(this, array, fallback)
  }
  
  // Inherit from SVG.Array
  SVG.PathArray.prototype = new SVG.Array
  
  SVG.extend(SVG.PathArray, {
    // Convert array to string
    toString: function() {
      return arrayToString(this.value)
    }
    // Move path string
  , move: function(x, y) {
  		/* get bounding box of current situation */
  		var box = this.bbox()
  		
      /* get relative offset */
      x -= box.x
      y -= box.y
  
      if (!isNaN(x) && !isNaN(y)) {
        /* move every point */
        for (var l, i = this.value.length - 1; i >= 0; i--) {
          l = this.value[i][0]
  
          if (l == 'M' || l == 'L' || l == 'T')  {
            this.value[i][1] += x
            this.value[i][2] += y
  
          } else if (l == 'H')  {
            this.value[i][1] += x
  
          } else if (l == 'V')  {
            this.value[i][1] += y
  
          } else if (l == 'C' || l == 'S' || l == 'Q')  {
            this.value[i][1] += x
            this.value[i][2] += y
            this.value[i][3] += x
            this.value[i][4] += y
  
            if (l == 'C')  {
              this.value[i][5] += x
              this.value[i][6] += y
            }
  
          } else if (l == 'A')  {
            this.value[i][6] += x
            this.value[i][7] += y
          }
  
        }
      }
  
      return this
    }
    // Resize path string
  , size: function(width, height) {
  		/* get bounding box of current situation */
  		var i, l, box = this.bbox()
  
      /* recalculate position of all points according to new size */
      for (i = this.value.length - 1; i >= 0; i--) {
        l = this.value[i][0]
  
        if (l == 'M' || l == 'L' || l == 'T')  {
          this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
          this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y
  
        } else if (l == 'H')  {
          this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
  
        } else if (l == 'V')  {
          this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y
  
        } else if (l == 'C' || l == 'S' || l == 'Q')  {
          this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
          this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y
          this.value[i][3] = ((this.value[i][3] - box.x) * width)  / box.width  + box.x
          this.value[i][4] = ((this.value[i][4] - box.y) * height) / box.height + box.y
  
          if (l == 'C')  {
            this.value[i][5] = ((this.value[i][5] - box.x) * width)  / box.width  + box.x
            this.value[i][6] = ((this.value[i][6] - box.y) * height) / box.height + box.y
          }
  
        } else if (l == 'A')  {
          /* resize radii */
          this.value[i][1] = (this.value[i][1] * width)  / box.width
          this.value[i][2] = (this.value[i][2] * height) / box.height
  
          /* move position values */
          this.value[i][6] = ((this.value[i][6] - box.x) * width)  / box.width  + box.x
          this.value[i][7] = ((this.value[i][7] - box.y) * height) / box.height + box.y
        }
  
      }
  
      return this
    }
    // Absolutize and parse path to array
  , parse: function(array) {
      /* if it's already is a patharray, no need to parse it */
      if (array instanceof SVG.PathArray) return array.valueOf()
  
      /* prepare for parsing */
      var i, il, x0, y0, x1, y1, x2, y2, s, seg, segs
        , x = 0
        , y = 0
      
      /* populate working path */
      SVG.parser.path.setAttribute('d', typeof array === 'string' ? array : arrayToString(array))
      
      /* get segments */
      segs = SVG.parser.path.pathSegList
  
      for (i = 0, il = segs.numberOfItems; i < il; ++i) {
        seg = segs.getItem(i)
        s = seg.pathSegTypeAsLetter
  
        /* yes, this IS quite verbose but also about 30 times faster than .test() with a precompiled regex */
        if (s == 'M' || s == 'L' || s == 'H' || s == 'V' || s == 'C' || s == 'S' || s == 'Q' || s == 'T' || s == 'A') {
          if ('x' in seg) x = seg.x
          if ('y' in seg) y = seg.y
  
        } else {
          if ('x1' in seg) x1 = x + seg.x1
          if ('x2' in seg) x2 = x + seg.x2
          if ('y1' in seg) y1 = y + seg.y1
          if ('y2' in seg) y2 = y + seg.y2
          if ('x'  in seg) x += seg.x
          if ('y'  in seg) y += seg.y
  
          if (s == 'm')
            segs.replaceItem(SVG.parser.path.createSVGPathSegMovetoAbs(x, y), i)
          else if (s == 'l')
            segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoAbs(x, y), i)
          else if (s == 'h')
            segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoHorizontalAbs(x), i)
          else if (s == 'v')
            segs.replaceItem(SVG.parser.path.createSVGPathSegLinetoVerticalAbs(y), i)
          else if (s == 'c')
            segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i)
          else if (s == 's')
            segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i)
          else if (s == 'q')
            segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i)
          else if (s == 't')
            segs.replaceItem(SVG.parser.path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i)
          else if (s == 'a')
            segs.replaceItem(SVG.parser.path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i)
          else if (s == 'z' || s == 'Z') {
            x = x0
            y = y0
          }
        }
  
        /* record the start of a subpath */
        if (s == 'M' || s == 'm') {
          x0 = x
          y0 = y
        }
      }
  
      /* build internal representation */
      array = []
      segs  = SVG.parser.path.pathSegList
      
      for (i = 0, il = segs.numberOfItems; i < il; ++i) {
        seg = segs.getItem(i)
        s = seg.pathSegTypeAsLetter
        x = [s]
  
        if (s == 'M' || s == 'L' || s == 'T')
          x.push(seg.x, seg.y)
        else if (s == 'H')
          x.push(seg.x)
        else if (s == 'V')
          x.push(seg.y)
        else if (s == 'C')
          x.push(seg.x1, seg.y1, seg.x2, seg.y2, seg.x, seg.y)
        else if (s == 'S')
          x.push(seg.x2, seg.y2, seg.x, seg.y)
        else if (s == 'Q')
          x.push(seg.x1, seg.y1, seg.x, seg.y)
        else if (s == 'A')
          x.push(seg.r1, seg.r2, seg.angle, seg.largeArcFlag|0, seg.sweepFlag|0, seg.x, seg.y)
  
        /* store segment */
        array.push(x)
      }
      
      return array
    }
    // Get bounding box of path
  , bbox: function() {
      SVG.parser.path.setAttribute('d', this.toString())
  
      return SVG.parser.path.getBBox()
    }
  
  })

  SVG.Number = function(value) {
  
    /* initialize defaults */
    this.value = 0
    this.unit = ''
  
    /* parse value */
    if (typeof value === 'number') {
      /* ensure a valid numeric value */
      this.value = isNaN(value) ? 0 : !isFinite(value) ? (value < 0 ? -3.4e+38 : +3.4e+38) : value
  
    } else if (typeof value === 'string') {
      var match = value.match(SVG.regex.unit)
  
      if (match) {
        /* make value numeric */
        this.value = parseFloat(match[1])
      
        /* normalize percent value */
        if (match[2] == '%')
          this.value /= 100
        else if (match[2] == 's')
          this.value *= 1000
      
        /* store unit */
        this.unit = match[2]
      }
  
    } else {
      if (value instanceof SVG.Number) {
        this.value = value.value
        this.unit  = value.unit
      }
    }
  
  }
  
  SVG.extend(SVG.Number, {
    // Stringalize
    toString: function() {
      return (
        this.unit == '%' ?
          ~~(this.value * 1e8) / 1e6:
        this.unit == 's' ?
          this.value / 1e3 :
          this.value
      ) + this.unit
    }
  , // Convert to primitive
    valueOf: function() {
      return this.value
    }
    // Add number
  , plus: function(number) {
      this.value = this + new SVG.Number(number)
  
      return this
    }
    // Subtract number
  , minus: function(number) {
      return this.plus(-new SVG.Number(number))
    }
    // Multiply number
  , times: function(number) {
      this.value = this * new SVG.Number(number)
  
      return this
    }
    // Divide number
  , divide: function(number) {
      this.value = this / new SVG.Number(number)
  
      return this
    }
    // Convert to different unit
  , to: function(unit) {
      if (typeof unit === 'string')
        this.unit = unit
  
      return this
    }
    // Make number morphable
  , morph: function(number) {
      this.destination = new SVG.Number(number)
  
      return this
    }
    // Get morphed number at given position
  , at: function(pos) {
      /* make sure a destination is defined */
      if (!this.destination) return this
  
      /* generate new morphed number */
      return new SVG.Number(this.destination)
          .minus(this)
          .times(pos)
          .plus(this)
    }
  
  })

  SVG.ViewBox = function(element) {
    var x, y, width, height
      , wm   = 1 /* width multiplier */
      , hm   = 1 /* height multiplier */
      , box  = element.bbox()
      , view = (element.attr('viewBox') || '').match(/-?[\d\.]+/g)
  
    /* get dimensions of current node */
    width  = new SVG.Number(element.width())
    height = new SVG.Number(element.height())
  
    /* find nearest non-percentual dimensions */
    while (width.unit == '%') {
      wm *= width.value
      width = new SVG.Number(element instanceof SVG.Doc ? element.parent.offsetWidth : element.width())
    }
    while (height.unit == '%') {
      hm *= height.value
      height = new SVG.Number(element instanceof SVG.Doc ? element.parent.offsetHeight : element.height())
    }
    
    /* ensure defaults */
    this.x      = box.x
    this.y      = box.y
    this.width  = width  * wm
    this.height = height * hm
    this.zoom   = 1
    
    if (view) {
      /* get width and height from viewbox */
      x      = parseFloat(view[0])
      y      = parseFloat(view[1])
      width  = parseFloat(view[2])
      height = parseFloat(view[3])
      
      /* calculate zoom accoring to viewbox */
      this.zoom = ((this.width / this.height) > (width / height)) ?
        this.height / height :
        this.width  / width
  
      /* calculate real pixel dimensions on parent SVG.Doc element */
      this.x      = x
      this.y      = y
      this.width  = width
      this.height = height
      
    }
    
  }
  
  //
  SVG.extend(SVG.ViewBox, {
    // Parse viewbox to string
    toString: function() {
      return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height
    }
    
  })

  SVG.BBox = function(element) {
    var box
  
    /* initialize zero box */
    this.x      = 0
    this.y      = 0
    this.width  = 0
    this.height = 0
    
    /* get values if element is given */
    if (element) {
      try {
        /* actual, native bounding box */
        box = element.node.getBBox()
      } catch(e) {
        /* fallback for some browsers */
        box = {
          x:      element.node.clientLeft
        , y:      element.node.clientTop
        , width:  element.node.clientWidth
        , height: element.node.clientHeight
        }
      }
      
      /* include translations on x an y */
      this.x = box.x + element.trans.x
      this.y = box.y + element.trans.y
      
      /* plain width and height */
      this.width  = box.width  * element.trans.scaleX
      this.height = box.height * element.trans.scaleY
    }
  
    /* add center, right and bottom */
    boxProperties(this)
    
  }
  
  //
  SVG.extend(SVG.BBox, {
    // merge bounding box with another, return a new instance
    merge: function(box) {
      var b = new SVG.BBox()
  
      /* merge box */
      b.x      = Math.min(this.x, box.x)
      b.y      = Math.min(this.y, box.y)
      b.width  = Math.max(this.x + this.width,  box.x + box.width)  - b.x
      b.height = Math.max(this.y + this.height, box.y + box.height) - b.y
  
      /* add center, right and bottom */
      boxProperties(b)
  
      return b
    }
  
  })

  SVG.RBox = function(element) {
    var e, zoom
      , box = {}
  
    /* initialize zero box */
    this.x      = 0
    this.y      = 0
    this.width  = 0
    this.height = 0
    
    if (element) {
      e = element.doc().parent
      zoom = element.doc().viewbox().zoom
      
      /* actual, native bounding box */
      box = element.node.getBoundingClientRect()
      
      /* get screen offset */
      this.x = box.left
      this.y = box.top
      
      /* subtract parent offset */
      this.x -= e.offsetLeft
      this.y -= e.offsetTop
      
      while (e = e.offsetParent) {
        this.x -= e.offsetLeft
        this.y -= e.offsetTop
      }
      
      /* calculate cumulative zoom from svg documents */
      e = element
      while (e = e.parent) {
        if (e.type == 'svg' && e.viewbox) {
          zoom *= e.viewbox().zoom
          this.x -= e.x() || 0
          this.y -= e.y() || 0
        }
      }
    }
    
    /* recalculate viewbox distortion */
    this.x /= zoom
    this.y /= zoom
    this.width  = box.width  /= zoom
    this.height = box.height /= zoom
    
    /* add center, right and bottom */
    boxProperties(this)
    
  }
  
  //
  SVG.extend(SVG.RBox, {
    // merge rect box with another, return a new instance
    merge: function(box) {
      var b = new SVG.RBox()
  
      /* merge box */
      b.x      = Math.min(this.x, box.x)
      b.y      = Math.min(this.y, box.y)
      b.width  = Math.max(this.x + this.width,  box.x + box.width)  - b.x
      b.height = Math.max(this.y + this.height, box.y + box.height) - b.y
  
      /* add center, right and bottom */
      boxProperties(b)
  
      return b
    }
  
  })

  SVG.Element = SVG.invent({
    // Initialize node
    create: function(node) {
      /* make stroke value accessible dynamically */
      this._stroke = SVG.defaults.attrs.stroke
  
      /* initialize transformation store with defaults */
      this.trans = SVG.defaults.trans()
      
      /* create circular reference */
      if (this.node = node) {
        this.type = node.nodeName
        this.node.instance = this
      }
    }
  
    // Add class methods
  , extend: {
      // Move over x-axis
      x: function(x) {
        if (x != null) {
          x = new SVG.Number(x)
          x.value /= this.trans.scaleX
        }
        return this.attr('x', x)
      }
      // Move over y-axis
    , y: function(y) {
        if (y != null) {
          y = new SVG.Number(y)
          y.value /= this.trans.scaleY
        }
        return this.attr('y', y)
      }
      // Move by center over x-axis
    , cx: function(x) {
        return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2)
      }
      // Move by center over y-axis
    , cy: function(y) {
        return y == null ? this.y() + this.height() / 2 : this.y(y - this.height() / 2)
      }
      // Move element to given x and y values
    , move: function(x, y) {
        return this.x(x).y(y)
      }
      // Move element by its center
    , center: function(x, y) {
        return this.cx(x).cy(y)
      }
      // Set width of element
    , width: function(width) {
        return this.attr('width', width)
      }
      // Set height of element
    , height: function(height) {
        return this.attr('height', height)
      }
      // Set element size to given width and height
    , size: function(width, height) {
        var p = proportionalSize(this.bbox(), width, height)
  
        return this.attr({
          width:  new SVG.Number(p.width)
        , height: new SVG.Number(p.height)
        })
      }
      // Clone element
    , clone: function() {
        var clone , attr
          , type = this.type
        
        /* invoke shape method with shape-specific arguments */
        clone = type == 'rect' || type == 'ellipse' ?
          this.parent[type](0,0) :
        type == 'line' ?
          this.parent[type](0,0,0,0) :
        type == 'image' ?
          this.parent[type](this.src) :
        type == 'text' ?
          this.parent[type](this.content) :
        type == 'path' ?
          this.parent[type](this.attr('d')) :
        type == 'polyline' || type == 'polygon' ?
          this.parent[type](this.attr('points')) :
        type == 'g' ?
          this.parent.group() :
          this.parent[type]()
        
        /* apply attributes attributes */
        attr = this.attr()
        delete attr.id
        clone.attr(attr)
        
        /* copy transformations */
        clone.trans = this.trans
        
        /* apply attributes and translations */
        return clone.transform({})
      }
      // Remove element
    , remove: function() {
        if (this.parent)
          this.parent.removeElement(this)
        
        return this
      }
      // Replace element
    , replace: function(element) {
        this.after(element).remove()
  
        return element
      }
      // Add element to given container and return self
    , addTo: function(parent) {
        return parent.put(this)
      }
      // Add element to given container and return container
    , putIn: function(parent) {
        return parent.add(this)
      }
      // Get parent document
    , doc: function(type) {
        return this._parent(type || SVG.Doc)
      }
      // Set svg element attribute
    , attr: function(a, v, n) {
        if (a == null) {
          /* get an object of attributes */
          a = {}
          v = this.node.attributes
          for (n = v.length - 1; n >= 0; n--)
            a[v[n].nodeName] = SVG.regex.isNumber.test(v[n].nodeValue) ? parseFloat(v[n].nodeValue) : v[n].nodeValue
          
          return a
          
        } else if (typeof a == 'object') {
          /* apply every attribute individually if an object is passed */
          for (v in a) this.attr(v, a[v])
          
        } else if (v === null) {
            /* remove value */
            this.node.removeAttribute(a)
          
        } else if (v == null) {
          /* act as a getter if the first and only argument is not an object */
          v = this.node.getAttribute(a)
          return v == null ? 
            SVG.defaults.attrs[a] :
          SVG.regex.isNumber.test(v) ?
            parseFloat(v) : v
        
        } else if (a == 'style') {
          /* redirect to the style method */
          return this.style(v)
        
        } else {
          /* BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0 */
          if (a == 'stroke-width')
            this.attr('stroke', parseFloat(v) > 0 ? this._stroke : null)
          else if (a == 'stroke')
            this._stroke = v
  
          /* convert image fill and stroke to patterns */
          if (a == 'fill' || a == 'stroke') {
            if (SVG.regex.isImage.test(v))
              v = this.doc().defs().image(v, 0, 0)
  
            if (v instanceof SVG.Image)
              v = this.doc().defs().pattern(0, 0, function() {
                this.add(v)
              })
          }
          
          /* ensure correct numeric values (also accepts NaN and Infinity) */
          if (typeof v === 'number')
            v = new SVG.Number(v)
  
          /* ensure full hex color */
          else if (SVG.Color.isColor(v))
            v = new SVG.Color(v)
          
          /* parse array values */
          else if (Array.isArray(v))
            v = new SVG.Array(v)
  
          /* if the passed attribute is leading... */
          if (a == 'leading') {
            /* ... call the leading method instead */
            if (this.leading)
              this.leading(v)
          } else {
            /* set given attribute on node */
            typeof n === 'string' ?
              this.node.setAttributeNS(n, a, v.toString()) :
              this.node.setAttribute(a, v.toString())
          }
          
          /* rebuild if required */
          if (this.rebuild && (a == 'font-size' || a == 'x'))
            this.rebuild(a, v)
        }
        
        return this
      }
      // Manage transformations
    , transform: function(o, v) {
        
        if (arguments.length == 0) {
          /* act as a getter if no argument is given */
          return this.trans
          
        } else if (typeof o === 'string') {
          /* act as a getter if only one string argument is given */
          if (arguments.length < 2)
            return this.trans[o]
          
          /* apply transformations as object if key value arguments are given*/
          var transform = {}
          transform[o] = v
          
          return this.transform(transform)
        }
        
        /* ... otherwise continue as a setter */
        var transform = []
        
        /* parse matrix */
        o = parseMatrix(o)
        
        /* merge values */
        for (v in o)
          if (o[v] != null)
            this.trans[v] = o[v]
        
        /* compile matrix */
        this.trans.matrix = this.trans.a
                    + ' ' + this.trans.b
                    + ' ' + this.trans.c
                    + ' ' + this.trans.d
                    + ' ' + this.trans.e
                    + ' ' + this.trans.f
        
        /* alias current transformations */
        o = this.trans
        
        /* add matrix */
        if (o.matrix != SVG.defaults.matrix)
          transform.push('matrix(' + o.matrix + ')')
        
        /* add rotation */
        if (o.rotation != 0)
          transform.push('rotate(' + o.rotation + ' ' + (o.cx == null ? this.bbox().cx : o.cx) + ' ' + (o.cy == null ? this.bbox().cy : o.cy) + ')')
        
        /* add scale */
        if (o.scaleX != 1 || o.scaleY != 1)
          transform.push('scale(' + o.scaleX + ' ' + o.scaleY + ')')
        
        /* add skew on x axis */
        if (o.skewX != 0)
          transform.push('skewX(' + o.skewX + ')')
        
        /* add skew on y axis */
        if (o.skewY != 0)
          transform.push('skewY(' + o.skewY + ')')
        
        /* add translation */
        if (o.x != 0 || o.y != 0)
          transform.push('translate(' + new SVG.Number(o.x / o.scaleX) + ' ' + new SVG.Number(o.y / o.scaleY) + ')')
        
        /* update transformations, even if there are none */
        if (transform.length == 0)
          this.node.removeAttribute('transform')
        else
          this.node.setAttribute('transform', transform.join(' '))
        
        return this
      }
      // Dynamic style generator
    , style: function(s, v) {
        if (arguments.length == 0) {
          /* get full style */
          return this.node.style.cssText || ''
        
        } else if (arguments.length < 2) {
          /* apply every style individually if an object is passed */
          if (typeof s == 'object') {
            for (v in s) this.style(v, s[v])
          
          } else if (SVG.regex.isCss.test(s)) {
            /* parse css string */
            s = s.split(';')
  
            /* apply every definition individually */
            for (v = 0; v < s.length; v++) {
              v = s[v].split(':')
              this.style(v[0].replace(/\s+/g, ''), v[1])
            }
          } else {
            /* act as a getter if the first and only argument is not an object */
            return this.node.style[camelCase(s)]
          }
        
        } else {
          this.node.style[camelCase(s)] = v === null || SVG.regex.isBlank.test(v) ? null : v
        }
        
        return this
      }
      // Get bounding box
    , bbox: function() {
        return new SVG.BBox(this)
      }
      // Get rect box
    , rbox: function() {
        return new SVG.RBox(this)
      }
      // Checks whether the given point inside the bounding box of the element
    , inside: function(x, y) {
        var box = this.bbox()
        
        return x > box.x
            && y > box.y
            && x < box.x + box.width
            && y < box.y + box.height
      }
      // Show element
    , show: function() {
        return this.style('display', '')
      }
      // Hide element
    , hide: function() {
        return this.style('display', 'none')
      }
      // Is element visible?
    , visible: function() {
        return this.style('display') != 'none'
      }
      // Return id on string conversion
    , toString: function() {
        return this.attr('id')
      }
      // Private: find svg parent by instance
    , _parent: function(parent) {
        var element = this
        
        while (element != null && !(element instanceof parent))
          element = element.parent
  
        return element
      }
    }
  })

  SVG.Parent = SVG.invent({
    // Initialize node
    create: function(element) {
      this.constructor.call(this, element)
    }
  
    // Inherit from
  , inherit: SVG.Element
  
    // Add class methods
  , extend: {
      // Returns all child elements
      children: function() {
        return this._children || (this._children = [])
      }
      // Add given element at a position
    , add: function(element, i) {
        if (!this.has(element)) {
          /* define insertion index if none given */
          i = i == null ? this.children().length : i
          
          /* remove references from previous parent */
          if (element.parent)
            element.parent.children().splice(element.parent.index(element), 1)
          
          /* add element references */
          this.children().splice(i, 0, element)
          this.node.insertBefore(element.node, this.node.childNodes[i] || null)
          element.parent = this
        }
  
        /* reposition defs */
        if (this._defs) {
          this.node.removeChild(this._defs.node)
          this.node.appendChild(this._defs.node)
        }
        
        return this
      }
      // Basically does the same as `add()` but returns the added element instead
    , put: function(element, i) {
        this.add(element, i)
        return element
      }
      // Checks if the given element is a child
    , has: function(element) {
        return this.index(element) >= 0
      }
      // Gets index of given element
    , index: function(element) {
        return this.children().indexOf(element)
      }
      // Get a element at the given index
    , get: function(i) {
        return this.children()[i]
      }
      // Get first child, skipping the defs node
    , first: function() {
        return this.children()[0]
      }
      // Get the last child
    , last: function() {
        return this.children()[this.children().length - 1]
      }
      // Iterates over all children and invokes a given block
    , each: function(block, deep) {
        var i, il
          , children = this.children()
        
        for (i = 0, il = children.length; i < il; i++) {
          if (children[i] instanceof SVG.Element)
            block.apply(children[i], [i, children])
  
          if (deep && (children[i] instanceof SVG.Container))
            children[i].each(block, deep)
        }
      
        return this
      }
      // Remove a child element at a position
    , removeElement: function(element) {
        this.children().splice(this.index(element), 1)
        this.node.removeChild(element.node)
        element.parent = null
        
        return this
      }
      // Remove all elements in this container
    , clear: function() {
        /* remove children */
        for (var i = this.children().length - 1; i >= 0; i--)
          this.removeElement(this.children()[i])
  
        /* remove defs node */
        if (this._defs)
          this._defs.clear()
  
        return this
      }
     , // Get defs
      defs: function() {
        return this.doc().defs()
      }
    }
    
  })


  SVG.Container = SVG.invent({
    // Initialize node
    create: function(element) {
      this.constructor.call(this, element)
    }
  
    // Inherit from
  , inherit: SVG.Parent
  
    // Add class methods
  , extend: {
      // Get the viewBox and calculate the zoom value
      viewbox: function(v) {
        if (arguments.length == 0)
          /* act as a getter if there are no arguments */
          return new SVG.ViewBox(this)
        
        /* otherwise act as a setter */
        v = arguments.length == 1 ?
          [v.x, v.y, v.width, v.height] :
          [].slice.call(arguments)
        
        return this.attr('viewBox', v)
      }
    }
    
  })

  SVG.FX = SVG.invent({
    // Initialize FX object
    create: function(element) {
      /* store target element */
      this.target = element
    }
  
    // Add class methods
  , extend: {
      // Add animation parameters and start animation
      animate: function(d, ease, delay) {
        var akeys, tkeys, skeys, key
          , element = this.target
          , fx = this
        
        /* dissect object if one is passed */
        if (typeof d == 'object') {
          delay = d.delay
          ease = d.ease
          d = d.duration
        }
  
        /* ensure default duration and easing */
        d = d == '=' ? d : d == null ? 1000 : new SVG.Number(d).valueOf()
        ease = ease || '<>'
  
        /* process values */
        fx.to = function(pos) {
          var i
  
          /* normalise pos */
          pos = pos < 0 ? 0 : pos > 1 ? 1 : pos
  
          /* collect attribute keys */
          if (akeys == null) {
            akeys = []
            for (key in fx.attrs)
              akeys.push(key)
  
            /* make sure morphable elements are scaled, translated and morphed all together */
            if (element.morphArray && (fx._plot || akeys.indexOf('points') > -1)) {
              /* get destination */
              var box
                , p = new element.morphArray(fx._plot || fx.attrs.points || element.array)
  
              /* add size */
              if (fx._size) p.size(fx._size.width.to, fx._size.height.to)
  
              /* add movement */
              box = p.bbox()
              if (fx._x) p.move(fx._x.to, box.y)
              else if (fx._cx) p.move(fx._cx.to - box.width / 2, box.y)
  
              box = p.bbox()
              if (fx._y) p.move(box.x, fx._y.to)
              else if (fx._cy) p.move(box.x, fx._cy.to - box.height / 2)
  
              /* delete element oriented changes */
              delete fx._x
              delete fx._y
              delete fx._cx
              delete fx._cy
              delete fx._size
  
              fx._plot = element.array.morph(p)
            }
          }
  
          /* collect transformation keys */
          if (tkeys == null) {
            tkeys = []
            for (key in fx.trans)
              tkeys.push(key)
          }
  
          /* collect style keys */
          if (skeys == null) {
            skeys = []
            for (key in fx.styles)
              skeys.push(key)
          }
  
          /* apply easing */
          pos = ease == '<>' ?
            (-Math.cos(pos * Math.PI) / 2) + 0.5 :
          ease == '>' ?
            Math.sin(pos * Math.PI / 2) :
          ease == '<' ?
            -Math.cos(pos * Math.PI / 2) + 1 :
          ease == '-' ?
            pos :
          typeof ease == 'function' ?
            ease(pos) :
            pos
          
          /* run plot function */
          if (fx._plot) {
            element.plot(fx._plot.at(pos))
  
          } else {
            /* run all x-position properties */
            if (fx._x)
              element.x(fx._x.at(pos))
            else if (fx._cx)
              element.cx(fx._cx.at(pos))
  
            /* run all y-position properties */
            if (fx._y)
              element.y(fx._y.at(pos))
            else if (fx._cy)
              element.cy(fx._cy.at(pos))
  
            /* run all size properties */
            if (fx._size)
              element.size(fx._size.width.at(pos), fx._size.height.at(pos))
          }
  
          /* run all viewbox properties */
          if (fx._viewbox)
            element.viewbox(
              fx._viewbox.x.at(pos)
            , fx._viewbox.y.at(pos)
            , fx._viewbox.width.at(pos)
            , fx._viewbox.height.at(pos)
            )
  
          /* run leading property */
          if (fx._leading)
            element.leading(fx._leading.at(pos))
  
          /* animate attributes */
          for (i = akeys.length - 1; i >= 0; i--)
            element.attr(akeys[i], at(fx.attrs[akeys[i]], pos))
  
          /* animate transformations */
          for (i = tkeys.length - 1; i >= 0; i--)
            element.transform(tkeys[i], at(fx.trans[tkeys[i]], pos))
  
          /* animate styles */
          for (i = skeys.length - 1; i >= 0; i--)
            element.style(skeys[i], at(fx.styles[skeys[i]], pos))
  
          /* callback for each keyframe */
          if (fx._during)
            fx._during.call(element, pos, function(from, to) {
              return at({ from: from, to: to }, pos)
            })
        }
        
        if (typeof d === 'number') {
          /* delay animation */
          this.timeout = setTimeout(function() {
            var start = new Date().getTime()
  
            /* initialize situation object */
            fx.situation = {
              interval: 1000 / 60
            , start:    start
            , play:     true
            , finish:   start + d
            , duration: d
            }
  
            /* render function */
            fx.render = function() {
              
              if (fx.situation.play === true) {
                // This code was borrowed from the emile.js micro framework by Thomas Fuchs, aka MadRobby.
                var time = new Date().getTime()
                  , pos = time > fx.situation.finish ? 1 : (time - fx.situation.start) / d
                
                /* process values */
                fx.to(pos)
                
                /* finish off animation */
                if (time > fx.situation.finish) {
                  if (fx._plot)
                    element.plot(new SVG.PointArray(fx._plot.destination).settle())
  
                  if (fx._loop === true || (typeof fx._loop == 'number' && fx._loop > 1)) {
                    if (typeof fx._loop == 'number')
                      --fx._loop
                    fx.animate(d, ease, delay)
                  } else {
                    fx._after ? fx._after.apply(element, [fx]) : fx.stop()
                  }
  
                } else {
                  requestAnimFrame(fx.render)
                }
              } else {
                requestAnimFrame(fx.render)
              }
              
            }
  
            /* start animation */
            fx.render()
            
          }, new SVG.Number(delay).valueOf())
        }
        
        return this
      }
      // Get bounding box of target element
    , bbox: function() {
        return this.target.bbox()
      }
      // Add animatable attributes
    , attr: function(a, v) {
        if (typeof a == 'object') {
          for (var key in a)
            this.attr(key, a[key])
        
        } else {
          var from = this.target.attr(a)
  
          this.attrs[a] = SVG.Color.isColor(from) ?
            new SVG.Color(from).morph(v) :
          SVG.regex.unit.test(from) ?
            new SVG.Number(from).morph(v) :
            { from: from, to: v }
        }
        
        return this
      }
      // Add animatable transformations
    , transform: function(o, v) {
        if (arguments.length == 1) {
          /* parse matrix string */
          o = parseMatrix(o)
          
          /* dlete matrixstring from object */
          delete o.matrix
          
          /* store matrix values */
          for (v in o)
            this.trans[v] = { from: this.target.trans[v], to: o[v] }
          
        } else {
          /* apply transformations as object if key value arguments are given*/
          var transform = {}
          transform[o] = v
          
          this.transform(transform)
        }
        
        return this
      }
      // Add animatable styles
    , style: function(s, v) {
        if (typeof s == 'object')
          for (var key in s)
            this.style(key, s[key])
        
        else
          this.styles[s] = { from: this.target.style(s), to: v }
        
        return this
      }
      // Animatable x-axis
    , x: function(x) {
        this._x = new SVG.Number(this.target.x()).morph(x)
        
        return this
      }
      // Animatable y-axis
    , y: function(y) {
        this._y = new SVG.Number(this.target.y()).morph(y)
        
        return this
      }
      // Animatable center x-axis
    , cx: function(x) {
        this._cx = new SVG.Number(this.target.cx()).morph(x)
        
        return this
      }
      // Animatable center y-axis
    , cy: function(y) {
        this._cy = new SVG.Number(this.target.cy()).morph(y)
        
        return this
      }
      // Add animatable move
    , move: function(x, y) {
        return this.x(x).y(y)
      }
      // Add animatable center
    , center: function(x, y) {
        return this.cx(x).cy(y)
      }
      // Add animatable size
    , size: function(width, height) {
        if (this.target instanceof SVG.Text) {
          /* animate font size for Text elements */
          this.attr('font-size', width)
          
        } else {
          /* animate bbox based size for all other elements */
          var box = this.target.bbox()
  
          this._size = {
            width:  new SVG.Number(box.width).morph(width)
          , height: new SVG.Number(box.height).morph(height)
          }
        }
        
        return this
      }
      // Add animatable plot
    , plot: function(p) {
        this._plot = p
  
        return this
      }
      // Add leading method
    , leading: function(value) {
        if (this.target._leading)
          this._leading = new SVG.Number(this.target._leading).morph(value)
  
        return this
      }
      // Add animatable viewbox
    , viewbox: function(x, y, width, height) {
        if (this.target instanceof SVG.Container) {
          var box = this.target.viewbox()
          
          this._viewbox = {
            x:      new SVG.Number(box.x).morph(x)
          , y:      new SVG.Number(box.y).morph(y)
          , width:  new SVG.Number(box.width).morph(width)
          , height: new SVG.Number(box.height).morph(height)
          }
        }
        
        return this
      }
      // Add animateable gradient update
    , update: function(o) {
        if (this.target instanceof SVG.Stop) {
          if (o.opacity != null) this.attr('stop-opacity', o.opacity)
          if (o.color   != null) this.attr('stop-color', o.color)
          if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))
        }
  
        return this
      }
      // Add callback for each keyframe
    , during: function(during) {
        this._during = during
        
        return this
      }
      // Callback after animation
    , after: function(after) {
        this._after = after
        
        return this
      }
      // Make loopable
    , loop: function(times) {
        this._loop = times || true
  
        return this
      }
      // Stop running animation
    , stop: function(fulfill) {
        /* fulfill animation */
        if (fulfill === true) {
          this.animate(0)
  
        } else {
          /* stop current animation */
          clearTimeout(this.timeout)
  
          /* reset storage for properties that need animation */
          this.attrs     = {}
          this.trans     = {}
          this.styles    = {}
          this.situation = {}
  
          /* delete destinations */
          delete this._x
          delete this._y
          delete this._cx
          delete this._cy
          delete this._size
          delete this._plot
          delete this._loop
          delete this._after
          delete this._during
          delete this._leading
          delete this._viewbox
        }
        
        return this
      }
      // Pause running animation
    , pause: function() {
        if (this.situation.play === true) {
          this.situation.play  = false
          this.situation.pause = new Date().getTime()
        }
  
        return this
      }
      // Play running animation
    , play: function() {
        if (this.situation.play === false) {
          var pause = new Date().getTime() - this.situation.pause
          
          this.situation.finish += pause
          this.situation.start  += pause
          this.situation.play    = true
        }
  
        return this
      }
      
    }
  
    // Define parent class
  , parent: SVG.Element
  
    // Add method to parent elements
  , construct: {
      // Get fx module or create a new one, then animate with given duration and ease
      animate: function(d, ease, delay) {
        return (this.fx || (this.fx = new SVG.FX(this))).stop().animate(d, ease, delay)
      }
      // Stop current animation; this is an alias to the fx instance
    , stop: function(fulfill) {
        if (this.fx)
          this.fx.stop(fulfill)
        
        return this
      }
      // Pause current animation
    , pause: function() {
        if (this.fx)
          this.fx.pause()
  
        return this
      }
      // Play paused current animation
    , play: function() {
        if (this.fx)
          this.fx.play()
  
        return this
      }
      
    }
  })

  SVG.extend(SVG.Element, SVG.FX, {
    // Relative move over x axis
    dx: function(x) {
      return this.x((this.target || this).x() + x)
    }
    // Relative move over y axis
  , dy: function(y) {
      return this.y((this.target || this).y() + y)
    }
    // Relative move over x and y axes
  , dmove: function(x, y) {
      return this.dx(x).dy(y)
    }
  
  })

  ;[  'click'
    , 'dblclick'
    , 'mousedown'
    , 'mouseup'
    , 'mouseover'
    , 'mouseout'
    , 'mousemove'
    , 'mouseenter'
    , 'mouseleave'
    , 'touchstart'
    , 'touchmove'
    , 'touchleave'
    , 'touchend'
    , 'touchcancel' ].forEach(function(event) {
    
    /* add event to SVG.Element */
    SVG.Element.prototype[event] = function(f) {
      var self = this
      
      /* bind event to element rather than element node */
      this.node['on' + event] = typeof f == 'function' ?
        function() { return f.apply(self, arguments) } : null
      
      return this
    }
    
  })
  
  // Add event binder in the SVG namespace
  SVG.on = function(node, event, listener) {
    if (node.addEventListener)
      node.addEventListener(event, listener, false)
    else
      node.attachEvent('on' + event, listener)
  }
  
  // Add event unbinder in the SVG namespace
  SVG.off = function(node, event, listener) {
    if (node.removeEventListener)
      node.removeEventListener(event, listener, false)
    else
      node.detachEvent('on' + event, listener)
  }
  
  //
  SVG.extend(SVG.Element, {
    // Bind given event to listener
    on: function(event, listener) {
      SVG.on(this.node, event, listener)
      
      return this
    }
    // Unbind event from listener
  , off: function(event, listener) {
      SVG.off(this.node, event, listener)
      
      return this
    }
  })

  SVG.Defs = SVG.invent({
    // Initialize node
    create: 'defs'
  
    // Inherit from
  , inherit: SVG.Container
  })

  SVG.G = SVG.invent({
    // Initialize node
    create: 'g'
  
    // Inherit from
  , inherit: SVG.Container
    
    // Add class methods
  , extend: {
      // Move over x-axis
      x: function(x) {
        return x == null ? this.trans.x : this.transform('x', x)
      }
      // Move over y-axis
    , y: function(y) {
        return y == null ? this.trans.y : this.transform('y', y)
      }
      // Move by center over x-axis
    , cx: function(x) {
        return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
      }
      // Move by center over y-axis
    , cy: function(y) {
        return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)
      }
    }
    
    // Add parent method
  , construct: {
      // Create a group element
      group: function() {
        return this.put(new SVG.G)
      }
    }
  })

  SVG.extend(SVG.Element, {
    // Get all siblings, including myself
    siblings: function() {
      return this.parent.children()
    }
    // Get the curent position siblings
  , position: function() {
      return this.parent.index(this)
    }
    // Get the next element (will return null if there is none)
  , next: function() {
      return this.siblings()[this.position() + 1]
    }
    // Get the next element (will return null if there is none)
  , previous: function() {
      return this.siblings()[this.position() - 1]
    }
    // Send given element one step forward
  , forward: function() {
      var i = this.position()
      return this.parent.removeElement(this).put(this, i + 1)
    }
    // Send given element one step backward
  , backward: function() {
      var i = this.position()
      
      if (i > 0)
        this.parent.removeElement(this).add(this, i - 1)
  
      return this
    }
    // Send given element all the way to the front
  , front: function() {
      return this.parent.removeElement(this).put(this)
    }
    // Send given element all the way to the back
  , back: function() {
      if (this.position() > 0)
        this.parent.removeElement(this).add(this, 0)
      
      return this
    }
    // Inserts a given element before the targeted element
  , before: function(element) {
      element.remove()
  
      var i = this.position()
      
      this.parent.add(element, i)
  
      return this
    }
    // Insters a given element after the targeted element
  , after: function(element) {
      element.remove()
      
      var i = this.position()
      
      this.parent.add(element, i + 1)
  
      return this
    }
  
  })

  SVG.Mask = SVG.invent({
    // Initialize node
    create: function() {
      this.constructor.call(this, SVG.create('mask'))
  
      /* keep references to masked elements */
      this.targets = []
    }
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add class methods
  , extend: {
      // Unmask all masked elements and remove itself
      remove: function() {
        /* unmask all targets */
        for (var i = this.targets.length - 1; i >= 0; i--)
          if (this.targets[i])
            this.targets[i].unmask()
        delete this.targets
  
        /* remove mask from parent */
        this.parent.removeElement(this)
        
        return this
      }
    }
    
    // Add parent method
  , construct: {
      // Create masking element
      mask: function() {
        return this.defs().put(new SVG.Mask)
      }
    }
  })
  
  
  SVG.extend(SVG.Element, {
    // Distribute mask to svg element
    maskWith: function(element) {
      /* use given mask or create a new one */
      this.masker = element instanceof SVG.Mask ? element : this.parent.mask().add(element)
  
      /* store reverence on self in mask */
      this.masker.targets.push(this)
      
      /* apply mask */
      return this.attr('mask', 'url("#' + this.masker.attr('id') + '")')
    }
    // Unmask element
  , unmask: function() {
      delete this.masker
      return this.attr('mask', null)
    }
    
  })


  SVG.Clip = SVG.invent({
    // Initialize node
    create: function() {
      this.constructor.call(this, SVG.create('clipPath'))
  
      /* keep references to clipped elements */
      this.targets = []
    }
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add class methods
  , extend: {
      // Unclip all clipped elements and remove itself
      remove: function() {
        /* unclip all targets */
        for (var i = this.targets.length - 1; i >= 0; i--)
          if (this.targets[i])
            this.targets[i].unclip()
        delete this.targets
  
        /* remove clipPath from parent */
        this.parent.removeElement(this)
        
        return this
      }
    }
    
    // Add parent method
  , construct: {
      // Create clipping element
      clip: function() {
        return this.defs().put(new SVG.Clip)
      }
    }
  })
  
  //
  SVG.extend(SVG.Element, {
    // Distribute clipPath to svg element
    clipWith: function(element) {
      /* use given clip or create a new one */
      this.clipper = element instanceof SVG.Clip ? element : this.parent.clip().add(element)
  
      /* store reverence on self in mask */
      this.clipper.targets.push(this)
      
      /* apply mask */
      return this.attr('clip-path', 'url("#' + this.clipper.attr('id') + '")')
    }
    // Unclip element
  , unclip: function() {
      delete this.clipper
      return this.attr('clip-path', null)
    }
    
  })

  SVG.Gradient = SVG.invent({
    // Initialize node
    create: function(type) {
      this.constructor.call(this, SVG.create(type + 'Gradient'))
      
      /* store type */
      this.type = type
    }
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add class methods
  , extend: {
      // From position
      from: function(x, y) {
        return this.type == 'radial' ?
          this.attr({ fx: new SVG.Number(x), fy: new SVG.Number(y) }) :
          this.attr({ x1: new SVG.Number(x), y1: new SVG.Number(y) })
      }
      // To position
    , to: function(x, y) {
        return this.type == 'radial' ?
          this.attr({ cx: new SVG.Number(x), cy: new SVG.Number(y) }) :
          this.attr({ x2: new SVG.Number(x), y2: new SVG.Number(y) })
      }
      // Radius for radial gradient
    , radius: function(r) {
        return this.type == 'radial' ?
          this.attr({ r: new SVG.Number(r) }) :
          this
      }
      // Add a color stop
    , at: function(offset, color, opacity) {
        return this.put(new SVG.Stop).update(offset, color, opacity)
      }
      // Update gradient
    , update: function(block) {
        /* remove all stops */
        this.clear()
        
        /* invoke passed block */
        if (typeof block == 'function')
          block.call(this, this)
        
        return this
      }
      // Return the fill id
    , fill: function() {
        return 'url(#' + this.attr('id') + ')'
      }
      // Alias string convertion to fill
    , toString: function() {
        return this.fill()
      }
    }
    
    // Add parent method
  , construct: {
      // Create gradient element in defs
      gradient: function(type, block) {
        return this.defs().gradient(type, block)
      }
    }
  })
  
  SVG.extend(SVG.Defs, {
    // define gradient
    gradient: function(type, block) {
      return this.put(new SVG.Gradient(type)).update(block)
    }
    
  })
  
  SVG.Stop = SVG.invent({
    // Initialize node
    create: 'stop'
  
    // Inherit from
  , inherit: SVG.Element
  
    // Add class methods
  , extend: {
      // add color stops
      update: function(o) {
        if (typeof o == 'number' || o instanceof SVG.Number) {
          o = {
            offset:  arguments[0]
          , color:   arguments[1]
          , opacity: arguments[2]
          }
        }
  
        /* set attributes */
        if (o.opacity != null) this.attr('stop-opacity', o.opacity)
        if (o.color   != null) this.attr('stop-color', o.color)
        if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))
  
        return this
      }
    }
  
  })


  SVG.Pattern = SVG.invent({
    // Initialize node
    create: 'pattern'
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add class methods
  , extend: {
      // Return the fill id
  	  fill: function() {
  	    return 'url(#' + this.attr('id') + ')'
  	  }
  	  // Update pattern by rebuilding
  	, update: function(block) {
  			/* remove content */
        this.clear()
        
        /* invoke passed block */
        if (typeof block == 'function')
        	block.call(this, this)
        
        return this
  		}
  	  // Alias string convertion to fill
  	, toString: function() {
  	    return this.fill()
  	  }
    }
    
    // Add parent method
  , construct: {
      // Create pattern element in defs
  	  pattern: function(width, height, block) {
  	    return this.defs().pattern(width, height, block)
  	  }
    }
  })
  
  SVG.extend(SVG.Defs, {
    // Define gradient
    pattern: function(width, height, block) {
      return this.put(new SVG.Pattern).update(block).attr({
        x:            0
      , y:            0
      , width:        width
      , height:       height
      , patternUnits: 'userSpaceOnUse'
      })
    }
  
  })

  SVG.Doc = SVG.invent({
    // Initialize node
    create: function(element) {
      /* ensure the presence of a html element */
      this.parent = typeof element == 'string' ?
        document.getElementById(element) :
        element
      
      /* If the target is an svg element, use that element as the main wrapper.
         This allows svg.js to work with svg documents as well. */
      this.constructor
        .call(this, this.parent.nodeName == 'svg' ? this.parent : SVG.create('svg'))
      
      /* set svg element attributes */
      this
        .attr({ xmlns: SVG.ns, version: '1.1', width: '100%', height: '100%' })
        .attr('xmlns:xlink', SVG.xlink, SVG.xmlns)
      
      /* create the <defs> node */
      this._defs = new SVG.Defs
      this._defs.parent = this
      this.node.appendChild(this._defs.node)
  
      /* turn off sub pixel offset by default */
      this.doSpof = false
      
      /* ensure correct rendering */
      if (this.parent != this.node)
        this.stage()
    }
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add class methods
  , extend: {
      /* enable drawing */
      stage: function() {
        var element = this
  
        /* insert element */
        this.parent.appendChild(this.node)
  
        /* fix sub-pixel offset */
        element.spof()
        
        /* make sure sub-pixel offset is fixed every time the window is resized */
        SVG.on(window, 'resize', function() {
          element.spof()
        })
  
        return this
      }
  
      // Creates and returns defs element
    , defs: function() {
        return this._defs
      }
  
      // Fix for possible sub-pixel offset. See:
      // https://bugzilla.mozilla.org/show_bug.cgi?id=608812
    , spof: function() {
        if (this.doSpof) {
          var pos = this.node.getScreenCTM()
          
          if (pos)
            this
              .style('left', (-pos.e % 1) + 'px')
              .style('top',  (-pos.f % 1) + 'px')
        }
        
        return this
      }
  
      // Enable sub-pixel offset
    , fixSubPixelOffset: function() {
        this.doSpof = true
  
        return this
      }
    }
    
  })


  SVG.Shape = SVG.invent({
    // Initialize node
    create: function(element) {
  	  this.constructor.call(this, element)
  	}
  
    // Inherit from
  , inherit: SVG.Element
  
  })

  SVG.Use = SVG.invent({
    // Initialize node
    create: 'use'
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
      // Use element as a reference
      element: function(element) {
        /* store target element */
        this.target = element
  
        /* set lined element */
        return this.attr('href', '#' + element, SVG.xlink)
      }
    }
    
    // Add parent method
  , construct: {
      // Create a use element
      use: function(element) {
        return this.put(new SVG.Use).element(element)
      }
    }
  })

  SVG.Rect = SVG.invent({
  	// Initialize node
    create: 'rect'
  
  	// Inherit from
  , inherit: SVG.Shape
  	
  	// Add parent method
  , construct: {
    	// Create a rect element
    	rect: function(width, height) {
    	  return this.put(new SVG.Rect().size(width, height))
    	}
    	
  	}
  	
  })

  SVG.Ellipse = SVG.invent({
    // Initialize node
    create: 'ellipse'
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
      // Move over x-axis
      x: function(x) {
        return x == null ? this.cx() - this.attr('rx') : this.cx(x + this.attr('rx'))
      }
      // Move over y-axis
    , y: function(y) {
        return y == null ? this.cy() - this.attr('ry') : this.cy(y + this.attr('ry'))
      }
      // Move by center over x-axis
    , cx: function(x) {
        return x == null ? this.attr('cx') : this.attr('cx', new SVG.Number(x).divide(this.trans.scaleX))
      }
      // Move by center over y-axis
    , cy: function(y) {
        return y == null ? this.attr('cy') : this.attr('cy', new SVG.Number(y).divide(this.trans.scaleY))
      }
      // Set width of element
    , width: function(width) {
        return width == null ? this.attr('rx') * 2 : this.attr('rx', new SVG.Number(width).divide(2))
      }
      // Set height of element
    , height: function(height) {
        return height == null ? this.attr('ry') * 2 : this.attr('ry', new SVG.Number(height).divide(2))
      }
      // Custom size function
    , size: function(width, height) {
        var p = proportionalSize(this.bbox(), width, height)
  
        return this.attr({
          rx: new SVG.Number(p.width).divide(2)
        , ry: new SVG.Number(p.height).divide(2)
        })
      }
      
    }
  
    // Add parent method
  , construct: {
      // Create circle element, based on ellipse
      circle: function(size) {
        return this.ellipse(size, size)
      }
      // Create an ellipse
    , ellipse: function(width, height) {
        return this.put(new SVG.Ellipse).size(width, height).move(0, 0)
      }
      
    }
  
  })

  SVG.Line = SVG.invent({
    // Initialize node
    create: 'line'
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
      // Move over x-axis
      x: function(x) {
        var b = this.bbox()
        
        return x == null ? b.x : this.attr({
          x1: this.attr('x1') - b.x + x
        , x2: this.attr('x2') - b.x + x
        })
      }
      // Move over y-axis
    , y: function(y) {
        var b = this.bbox()
        
        return y == null ? b.y : this.attr({
          y1: this.attr('y1') - b.y + y
        , y2: this.attr('y2') - b.y + y
        })
      }
      // Move by center over x-axis
    , cx: function(x) {
        var half = this.bbox().width / 2
        return x == null ? this.x() + half : this.x(x - half)
      }
      // Move by center over y-axis
    , cy: function(y) {
        var half = this.bbox().height / 2
        return y == null ? this.y() + half : this.y(y - half)
      }
      // Set width of element
    , width: function(width) {
        var b = this.bbox()
  
        return width == null ? b.width : this.attr(this.attr('x1') < this.attr('x2') ? 'x2' : 'x1', b.x + width)
      }
      // Set height of element
    , height: function(height) {
        var b = this.bbox()
  
        return height == null ? b.height : this.attr(this.attr('y1') < this.attr('y2') ? 'y2' : 'y1', b.y + height)
      }
      // Set line size by width and height
    , size: function(width, height) {
        var p = proportionalSize(this.bbox(), width, height)
  
        return this.width(p.width).height(p.height)
      }
      // Set path data
    , plot: function(x1, y1, x2, y2) {
        return this.attr({
          x1: x1
        , y1: y1
        , x2: x2
        , y2: y2
        })
      }
    }
    
    // Add parent method
  , construct: {
      // Create a line element
      line: function(x1, y1, x2, y2) {
        return this.put(new SVG.Line().plot(x1, y1, x2, y2))
      }
    }
  })


  SVG.Polyline = SVG.invent({
    // Initialize node
    create: 'polyline'
  
    // Inherit from
  , inherit: SVG.Shape
    
    // Add parent method
  , construct: {
      // Create a wrapped polyline element
      polyline: function(p) {
        return this.put(new SVG.Polyline).plot(p)
      }
    }
  })
  
  SVG.Polygon = SVG.invent({
    // Initialize node
    create: 'polygon'
  
    // Inherit from
  , inherit: SVG.Shape
    
    // Add parent method
  , construct: {
      // Create a wrapped polygon element
      polygon: function(p) {
        return this.put(new SVG.Polygon).plot(p)
      }
    }
  })
  
  // Add polygon-specific functions
  SVG.extend(SVG.Polyline, SVG.Polygon, {
    // Define morphable array
    morphArray:  SVG.PointArray
    // Plot new path
  , plot: function(p) {
      return this.attr('points', (this.array = new SVG.PointArray(p, [[0,0]])))
    }
    // Move by left top corner
  , move: function(x, y) {
      return this.attr('points', this.array.move(x, y))
    }
    // Move by left top corner over x-axis
  , x: function(x) {
      return x == null ? this.bbox().x : this.move(x, this.bbox().y)
    }
    // Move by left top corner over y-axis
  , y: function(y) {
      return y == null ? this.bbox().y : this.move(this.bbox().x, y)
    }
    // Set width of element
  , width: function(width) {
      var b = this.bbox()
  
      return width == null ? b.width : this.size(width, b.height)
    }
    // Set height of element
  , height: function(height) {
      var b = this.bbox()
  
      return height == null ? b.height : this.size(b.width, height) 
    }
    // Set element size to given width and height
  , size: function(width, height) {
      var p = proportionalSize(this.bbox(), width, height)
  
      return this.attr('points', this.array.size(p.width, p.height))
    }
  
  })

  SVG.Path = SVG.invent({
    // Initialize node
    create: 'path'
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
      // Plot new poly points
      plot: function(p) {
        return this.attr('d', (this.array = new SVG.PathArray(p, [['M', 0, 0]])))
      }
      // Move by left top corner
    , move: function(x, y) {
        return this.attr('d', this.array.move(x, y))
      }
      // Move by left top corner over x-axis
    , x: function(x) {
        return x == null ? this.bbox().x : this.move(x, this.bbox().y)
      }
      // Move by left top corner over y-axis
    , y: function(y) {
        return y == null ? this.bbox().y : this.move(this.bbox().x, y)
      }
      // Set element size to given width and height
    , size: function(width, height) {
        var p = proportionalSize(this.bbox(), width, height)
        
        return this.attr('d', this.array.size(p.width, p.height))
      }
      // Set width of element
    , width: function(width) {
        return width == null ? this.bbox().width : this.size(width, this.bbox().height)
      }
      // Set height of element
    , height: function(height) {
        return height == null ? this.bbox().height : this.size(this.bbox().width, height)
      }
      
    }
    
    // Add parent method
  , construct: {
      // Create a wrapped path element
      path: function(d) {
        return this.put(new SVG.Path).plot(d)
      }
    }
  })

  SVG.Image = SVG.invent({
    // Initialize node
    create: 'image'
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
      // (re)load image
      load: function(url) {
        if (!url) return this
  
        var self = this
          , img  = document.createElement('img')
        
        /* preload image */
        img.onload = function() {
          var p = self.doc(SVG.Pattern)
  
          /* ensure image size */
          if (self.width() == 0 && self.height() == 0)
            self.size(img.width, img.height)
  
          /* ensure pattern size if not set */
          if (p && p.width() == 0 && p.height() == 0)
            p.size(self.width(), self.height())
          
          /* callback */
          if (typeof self._loaded === 'function')
            self._loaded.call(self, {
              width:  img.width
            , height: img.height
            , ratio:  img.width / img.height
            , url:    url
            })
        }
  
        return this.attr('href', (img.src = this.src = url), SVG.xlink)
      }
      // Add loade callback
    , loaded: function(loaded) {
        this._loaded = loaded
        return this
      }
    }
    
    // Add parent method
  , construct: {
      // Create image element, load image and set its size
      image: function(source, width, height) {
        return this.put(new SVG.Image).load(source).size(width || 0, height || width || 0)
      }
    }
  
  })

  SVG.Text = SVG.invent({
    // Initialize node
    create: function() {
      this.constructor.call(this, SVG.create('text'))
      
      this._leading = new SVG.Number(1.3)    /* store leading value for rebuilding */
      this._rebuild = true                   /* enable automatic updating of dy values */
      this._build   = false                  /* disable build mode for adding multiple lines */
  
      /* set default font */
      this.attr('font-family', SVG.defaults.attrs['font-family'])
    }
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
      // Move over x-axis
      x: function(x) {
        /* act as getter */
        if (x == null)
          return this.attr('x')
        
        /* move lines as well if no textPath is present */
        if (!this.textPath)
          this.lines.each(function() { if (this.newLined) this.x(x) })
  
        return this.attr('x', x)
      }
      // Move over y-axis
    , y: function(y) {
        var o = this.attr('y') - this.bbox().y
  
        /* act as getter */
        if (y == null)
          return this.attr('y') - o
  
        return this.attr('y', y + o)
      }
      // Move center over x-axis
    , cx: function(x) {
        return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
      }
      // Move center over y-axis
    , cy: function(y) {
        return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)
      }
      // Set the text content
    , text: function(text) {
        /* act as getter */
        if (!text) return this.content
        
        /* remove existing content */
        this.clear().build(true)
        
        if (typeof text === 'function') {
          /* call block */
          text.call(this, this)
  
        } else {
          /* store text and make sure text is not blank */
          text = (this.content = (SVG.regex.isBlank.test(text) ? 'text' : text)).split('\n')
          
          /* build new lines */
          for (var i = 0, il = text.length; i < il; i++)
            this.tspan(text[i]).newLine()
        }
        
        /* disable build mode and rebuild lines */
        return this.build(false).rebuild()
      }
      // Set font size
    , size: function(size) {
        return this.attr('font-size', size).rebuild()
      }
      // Set / get leading
    , leading: function(value) {
        /* act as getter */
        if (value == null)
          return this._leading
        
        /* act as setter */
        this._leading = new SVG.Number(value)
        
        return this.rebuild()
      }
      // Rebuild appearance type
    , rebuild: function(rebuild) {
        var self = this
  
        /* store new rebuild flag if given */
        if (typeof rebuild == 'boolean')
          this._rebuild = rebuild
  
        /* define position of all lines */
        if (this._rebuild) {
          this.lines.each(function() {
            if (this.newLined) {
              if (!this.textPath)
                this.attr('x', self.attr('x'))
              this.attr('dy', self._leading * new SVG.Number(self.attr('font-size'))) 
            }
          })
        }
  
        return this
      }
      // Enable / disable build mode
    , build: function(build) {
        this._build = !!build
        return this
      }
    }
    
    // Add parent method
  , construct: {
      // Create text element
      text: function(text) {
        return this.put(new SVG.Text).text(text)
      }
      // Create plain text element
    , plain: function(text) {
        return this.put(new SVG.Text).plain(text)
      }
    }
  
  })
  
  SVG.TSpan = SVG.invent({
    // Initialize node
    create: 'tspan'
  
    // Inherit from
  , inherit: SVG.Shape
  
    // Add class methods
  , extend: {
      // Set text content
      text: function(text) {
        typeof text === 'function' ? text.call(this, this) : this.plain(text)
  
        return this
      }
      // Shortcut dx
    , dx: function(dx) {
        return this.attr('dx', dx)
      }
      // Shortcut dy
    , dy: function(dy) {
        return this.attr('dy', dy)
      }
      // Create new line
    , newLine: function() {
        /* fetch text parent */
        var t = this.doc(SVG.Text)
  
        /* mark new line */
        this.newLined = true
  
        /* apply new hy¡n */
        return this.dy(t._leading * t.attr('font-size')).attr('x', t.x())
      }
    }
    
  })
  
  SVG.extend(SVG.Text, SVG.TSpan, {
    // Create plain text node
    plain: function(text) {
      /* clear if build mode is disabled */
      if (this._build === false)
        this.clear()
  
      /* create text node */
      this.node.appendChild(document.createTextNode((this.content = text)))
      
      return this
    }
    // Create a tspan
  , tspan: function(text) {
      var node  = (this.textPath || this).node
        , tspan = new SVG.TSpan
  
      /* clear if build mode is disabled */
      if (this._build === false)
        this.clear()
      
      /* add new tspan and reference */
      node.appendChild(tspan.node)
      tspan.parent = this
  
      /* only first level tspans are considered to be "lines" */
      if (this instanceof SVG.Text)
        this.lines.add(tspan)
  
      return tspan.text(text)
    }
    // Clear all lines
  , clear: function() {
      var node = (this.textPath || this).node
  
      /* remove existing child nodes */
      while (node.hasChildNodes())
        node.removeChild(node.lastChild)
      
      /* reset content references  */
      if (this instanceof SVG.Text) {
        delete this.lines
        this.lines = new SVG.Set
        this.content = ''
      }
      
      return this
    }
  })
  


  SVG.TextPath = SVG.invent({
    // Initialize node
    create: 'textPath'
  
    // Inherit from
  , inherit: SVG.Element
  
    // Define parent class
  , parent: SVG.Text
  
    // Add parent method
  , construct: {
      // Create path for text to run on
      path: function(d) {
        /* create textPath element */
        this.textPath = new SVG.TextPath
  
        /* move lines to textpath */
        while(this.node.hasChildNodes())
          this.textPath.node.appendChild(this.node.firstChild)
  
        /* add textPath element as child node */
        this.node.appendChild(this.textPath.node)
  
        /* create path in defs */
        this.track = this.doc().defs().path(d)
  
        /* create circular reference */
        this.textPath.parent = this
  
        /* link textPath to path and add content */
        this.textPath.attr('href', '#' + this.track, SVG.xlink)
  
        return this
      }
      // Plot path if any
    , plot: function(d) {
        if (this.track) this.track.plot(d)
        return this
      }
    }
  })

  SVG.Nested = SVG.invent({
    // Initialize node
    create: function() {
      this.constructor.call(this, SVG.create('svg'))
      
      this.style('overflow', 'visible')
    }
  
    // Inherit from
  , inherit: SVG.Container
    
    // Add parent method
  , construct: {
      // Create nested svg document
      nested: function() {
        return this.put(new SVG.Nested)
      }
    }
  })

  SVG.A = SVG.invent({
    // Initialize node
    create: 'a'
  
    // Inherit from
  , inherit: SVG.Container
  
    // Add class methods
  , extend: {
      // Link url
      to: function(url) {
        return this.attr('href', url, SVG.xlink)
      }
      // Link show attribute
    , show: function(target) {
        return this.attr('show', target, SVG.xlink)
      }
      // Link target attribute
    , target: function(target) {
        return this.attr('target', target)
      }
    }
    
    // Add parent method
  , construct: {
      // Create a hyperlink element
      link: function(url) {
        return this.put(new SVG.A).to(url)
      }
    }
  })
  
  SVG.extend(SVG.Element, {
    // Create a hyperlink element
    linkTo: function(url) {
      var link = new SVG.A
  
      if (typeof url == 'function')
        url.call(link, link)
      else
        link.to(url)
  
      return this.parent.put(link).put(this)
    }
    
  })

  var sugar = {
    stroke: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset']
  , fill:   ['color', 'opacity', 'rule']
  , prefix: function(t, a) {
      return a == 'color' ? t : t + '-' + a
    }
  }
  
  /* Add sugar for fill and stroke */
  ;['fill', 'stroke'].forEach(function(m) {
    var i, extension = {}
    
    extension[m] = function(o) {
      if (typeof o == 'string' || SVG.Color.isRgb(o) || (o && typeof o.fill === 'function'))
        this.attr(m, o)
  
      else
        /* set all attributes from sugar.fill and sugar.stroke list */
        for (i = sugar[m].length - 1; i >= 0; i--)
          if (o[sugar[m][i]] != null)
            this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]])
      
      return this
    }
    
    SVG.extend(SVG.Element, SVG.FX, extension)
    
  })
  
  SVG.extend(SVG.Element, SVG.FX, {
    // Rotation
    rotate: function(deg, x, y) {
      return this.transform({
        rotation: deg || 0
      , cx: x
      , cy: y
      })
    }
    // Skew
  , skew: function(x, y) {
      return this.transform({
        skewX: x || 0
      , skewY: y || 0
      })
    }
    // Scale
  , scale: function(x, y) {
      return this.transform({
        scaleX: x
      , scaleY: y == null ? x : y
      })
    }
    // Translate
  , translate: function(x, y) {
      return this.transform({
        x: x
      , y: y
      })
    }
    // Matrix
  , matrix: function(m) {
      return this.transform({ matrix: m })
    }
    // Opacity
  , opacity: function(value) {
      return this.attr('opacity', value)
    }
  
  })
  
  SVG.extend(SVG.Rect, SVG.Ellipse, SVG.FX, {
    // Add x and y radius
    radius: function(x, y) {
      return this.attr({ rx: x, ry: y || x })
    }
  
  })
  
  SVG.extend(SVG.Path, {
    // Get path length
    length: function() {
      return this.node.getTotalLength()
    }
    // Get point at length
  , pointAt: function(length) {
      return this.node.getPointAtLength(length)
    }
  
  })
  
  SVG.extend(SVG.Parent, SVG.Text, SVG.FX, {
    // Set font 
    font: function(o) {
      for (var k in o)
        k == 'leading' ?
          this.leading(o[k]) :
        k == 'anchor' ?
          this.attr('text-anchor', o[k]) :
        k == 'size' || k == 'family' || k == 'weight' || k == 'stretch' || k == 'variant' || k == 'style' ?
          this.attr('font-'+ k, o[k]) :
          this.attr(k, o[k])
      
      return this
    }
    
  })
  


  SVG.Set = SVG.invent({
    // Initialize
    create: function() {
      /* set initial state */
      this.clear()
    }
  
    // Add class methods
  , extend: {
      // Add element to set
      add: function() {
        var i, il, elements = [].slice.call(arguments)
  
        for (i = 0, il = elements.length; i < il; i++)
          this.members.push(elements[i])
        
        return this
      }
      // Remove element from set
    , remove: function(element) {
        var i = this.index(element)
        
        /* remove given child */
        if (i > -1)
          this.members.splice(i, 1)
  
        return this
      }
      // Iterate over all members
    , each: function(block) {
        for (var i = 0, il = this.members.length; i < il; i++)
          block.apply(this.members[i], [i, this.members])
  
        return this
      }
      // Restore to defaults
    , clear: function() {
        /* initialize store */
        this.members = []
  
        return this
      }
      // Checks if a given element is present in set
    , has: function(element) {
        return this.index(element) >= 0
      }
      // retuns index of given element in set
    , index: function(element) {
        return this.members.indexOf(element)
      }
      // Get member at given index
    , get: function(i) {
        return this.members[i]
      }
      // Default value
    , valueOf: function() {
        return this.members
      }
      // Get the bounding box of all members included or empty box if set has no items
    , bbox: function(){
        var box = new SVG.BBox()
  
        /* return an empty box of there are no members */
        if (this.members.length == 0)
          return box
  
        /* get the first rbox and update the target bbox */
        var rbox = this.members[0].rbox()
        box.x      = rbox.x
        box.y      = rbox.y
        box.width  = rbox.width
        box.height = rbox.height
  
        this.each(function() {
          /* user rbox for correct position and visual representation */
          box = box.merge(this.rbox())
        })
  
        return box
      }
    }
    
    // Add parent method
  , construct: {
      // Create a new set
      set: function() {
        return new SVG.Set
      }
    }
  })
  
  SVG.SetFX = SVG.invent({
    // Initialize node
    create: function(set) {
      /* store reference to set */
      this.set = set
    }
  
  })
  
  // Alias methods
  SVG.Set.inherit = function() {
    var m
      , methods = []
    
    /* gather shape methods */
    for(var m in SVG.Shape.prototype)
      if (typeof SVG.Shape.prototype[m] == 'function' && typeof SVG.Set.prototype[m] != 'function')
        methods.push(m)
  
    /* apply shape aliasses */
    methods.forEach(function(method) {
      SVG.Set.prototype[method] = function() {
        for (var i = 0, il = this.members.length; i < il; i++)
          if (this.members[i] && typeof this.members[i][method] == 'function')
            this.members[i][method].apply(this.members[i], arguments)
  
        return method == 'animate' ? (this.fx || (this.fx = new SVG.SetFX(this))) : this
      }
    })
  
    /* clear methods for the next round */
    methods = []
  
    /* gather fx methods */
    for(var m in SVG.FX.prototype)
      if (typeof SVG.FX.prototype[m] == 'function' && typeof SVG.SetFX.prototype[m] != 'function')
        methods.push(m)
  
    /* apply fx aliasses */
    methods.forEach(function(method) {
      SVG.SetFX.prototype[method] = function() {
        for (var i = 0, il = this.set.members.length; i < il; i++)
          this.set.members[i].fx[method].apply(this.set.members[i].fx, arguments)
  
        return this
      }
    })
  }
  
  


  SVG.extend(SVG.Element, {
  	// Store data values on svg nodes
    data: function(a, v, r) {
    	if (typeof a == 'object') {
    		for (v in a)
    			this.data(v, a[v])
  
      } else if (arguments.length < 2) {
        try {
          return JSON.parse(this.attr('data-' + a))
        } catch(e) {
          return this.attr('data-' + a)
        }
        
      } else {
        this.attr(
          'data-' + a
        , v === null ?
            null :
          r === true || typeof v === 'string' || typeof v === 'number' ?
            v :
            JSON.stringify(v)
        )
      }
      
      return this
    }
  })

  SVG.extend(SVG.Element, {
    // Remember arbitrary data
    remember: function(k, v) {
      /* remember every item in an object individually */
      if (typeof arguments[0] == 'object')
        for (var v in k)
          this.remember(v, k[v])
  
      /* retrieve memory */
      else if (arguments.length == 1)
        return this.memory()[k]
  
      /* store memory */
      else
        this.memory()[k] = v
  
      return this
    }
  
    // Erase a given memory
  , forget: function() {
      if (arguments.length == 0)
        this._memory = {}
      else
        for (var i = arguments.length - 1; i >= 0; i--)
          delete this.memory()[arguments[i]]
  
      return this
    }
  
    // Initialize or return local memory object
  , memory: function() {
      return this._memory || (this._memory = {})
    }
  
  })

  if (typeof define === 'function' && define.amd)
    define(function() { return SVG })
  else if (typeof exports !== 'undefined')
    exports.SVG = SVG

  function camelCase(s) { 
    return s.toLowerCase().replace(/-(.)/g, function(m, g) {
      return g.toUpperCase()
    })
  }
  
  // Ensure to six-based hex 
  function fullHex(hex) {
    return hex.length == 4 ?
      [ '#',
        hex.substring(1, 2), hex.substring(1, 2)
      , hex.substring(2, 3), hex.substring(2, 3)
      , hex.substring(3, 4), hex.substring(3, 4)
      ].join('') : hex
  }
  
  // Component to hex value
  function compToHex(comp) {
    var hex = comp.toString(16)
    return hex.length == 1 ? '0' + hex : hex
  }
  
  // Calculate proportional width and height values when necessary
  function proportionalSize(box, width, height) {
    if (width == null || height == null) {
      if (height == null)
        height = box.height / box.width * width
      else if (width == null)
        width = box.width / box.height * height
    }
    
    return {
      width:  width
    , height: height
    }
  }
  
  // Calculate position according to from and to
  function at(o, pos) {
    /* number recalculation (don't bother converting to SVG.Number for performance reasons) */
    return typeof o.from == 'number' ?
      o.from + (o.to - o.from) * pos :
    
    /* instance recalculation */
    o instanceof SVG.Color || o instanceof SVG.Number ? o.at(pos) :
    
    /* for all other values wait until pos has reached 1 to return the final value */
    pos < 1 ? o.from : o.to
  }
  
  // PathArray Helpers
  function arrayToString(a) {
    for (var i = 0, il = a.length, s = ''; i < il; i++) {
      s += a[i][0]
  
      if (a[i][1] != null) {
        s += a[i][1]
  
        if (a[i][2] != null) {
          s += ' '
          s += a[i][2]
  
          if (a[i][3] != null) {
            s += ' '
            s += a[i][3]
            s += ' '
            s += a[i][4]
  
            if (a[i][5] != null) {
              s += ' '
              s += a[i][5]
              s += ' '
              s += a[i][6]
  
              if (a[i][7] != null) {
                s += ' '
                s += a[i][7]
              }
            }
          }
        }
      }
    }
    
    return s + ' '
  }
  
  // Add more bounding box properties
  function boxProperties(b) {
    b.x2 = b.x + b.width
    b.y2 = b.y + b.height
    b.cx = b.x + b.width / 2
    b.cy = b.y + b.height / 2
  }
  
  // Parse a matrix string
  function parseMatrix(o) {
    if (o.matrix) {
      /* split matrix string */
      var m = o.matrix.replace(/\s/g, '').split(',')
      
      /* pasrse values */
      if (m.length == 6) {
        o.a = parseFloat(m[0])
        o.b = parseFloat(m[1])
        o.c = parseFloat(m[2])
        o.d = parseFloat(m[3])
        o.e = parseFloat(m[4])
        o.f = parseFloat(m[5])
      }
    }
    
    return o
  }
  
  // Shim layer with setTimeout fallback by Paul Irish
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.msRequestAnimationFrame     ||
            function (c) { window.setTimeout(c, 1000 / 60) }
  })()

}).call(this);

},{}],6:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var SVG = require('./lib/svg.js');
var moment = require('moment');

var k = require('./lib/k/k.js');
var k_data = require('./lib/k/k_data.js');
var $ = require('./lib/k/k_DOM.js');
var $_extra = require('./lib/k/k_DOM_extra.js');


//var MINI = require('minified');
//var _=MINI._, $=MINI.$, $$=MINI.$$, EE=MINI.EE, HTML=MINI.HTML;

if( navigator.geolocation ){
    navigator.geolocation.getCurrentPosition(lookupLocation);
} else {
    log('no possition');
}

var g_tables;

function loadTables(string){
    var tables = {};
    var l = string.split('\n')
    var title;
    var fields;
    var need_title = true;
    var need_fields = true;
    l.forEach( function(string, i){
        var line = string.trim();
        if( line.length === 0 ){
            need_title = true;
            need_fields = true;
        } else if( need_title ) {
            title = line;
            tables[title] = [];
            need_title = false; 
            //log('new table ', title)
        } else if( need_fields ) {
            fields = line.split(',')
            need_fields = false;
        } else {
            var entry = {};
            var line_array = line.split(',');
            fields.forEach( function(field, id){
                entry[field.trim()] = line_array[id].trim(); 
            })
            tables[title].push( entry );
        }
    })
    log('tables', tables);
    g_tables = tables;
}

k.AJAX('tables.txt', loadTables);

















///////////////////
// misc functions




///////////////
//#system parameters

var settings_registry = [];

var components = {};
components.inverters = {};
components.inverters['SI3000'] = {
    Make:'SMA',
    model:'3000',

    DC_voltageWindow_low: 150,
    DC_voltageWindow_high: 350,
    max_power: 3300,

    AC_options: ['240','208'],

};

components.modules = {};

k.AJAX( 'modules.csv', loadModules );

function loadModules(string){
    var db = k.parseCSV(string);
    log('db', db)
    
    for( var i in db ){
        var module = db[i];
        if( components.modules[module.Make] === undefined ){
            components.modules[module.Make] = {};
        }
        if( components.modules[module.Make][module.Model] === undefined ){
            components.modules[module.Make][module.Model] = {};
        }
        components.modules[module.Make][module.Model] = module;
    }

    update_system();
    log('system', system)

}

log('components', components );

var addInverter = function(){

};

var AC_types = {
    '120V'      : ['ground', 'neutral', 'L1' ],
    '240V'      : ['ground', 'neutral', 'L1', 'L2' ],
    '208V'      : ['ground', 'neutral', 'L1', 'L2' ],
    '277V'      : ['ground', 'neutral', 'L1' ],
    '480V Wye'  : ['ground', 'neutral', 'L1', 'L2', 'L3' ],
    '480V Delta': ['ground', 'L1', 'L2', 'L3' ],
}



function getSetting(reference){
    var chain = reference.split('.');
    var output = settings;
    chain.forEach( function(name){
        output = output[name]
    })
}



var settings = {};
settings.string_num = 4;
settings.string_modules = 6;
settings.inverter = 'SI3000';
settings.AC_type = '480V Delta';
settings.AC_type_options = ['120V', '240V', '208V', '277V', '480V Wye', '480V Delta'];
settings.string_num_options = [1,2,3,4,5,6];
settings.string_modules_options = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

log('settings', settings);

var values = {};

var system = {};
system.DC = {};

function update_system() {
    system.DC.string_num = settings.string_num; 
    system.DC.string_modules = settings.string_modules;
    system.DC.module = {}
    system.DC.module.make = settings['pv_make'] || Object.keys( components.modules )[0];

    system.DC.module.model = settings['pv_model'] || Object.keys( components.modules[system.DC.module.make] )[0];
    system.DC.module.specs = components.modules[system.DC.module.make][system.DC.module.model];

    //system.module = components.modules[settings.module];

    if( system.DC.module.specs ){
        system.DC.current = system.DC.module.specs.Isc * system.DC.string_num;
        system.DC.voltage = system.DC.module.specs.Voc * system.DC.string_modules;
    }

    system.inverter = components.inverters[settings.inverter];

    system.AC_loadcenter_type = '480/277V';

    system.AC_type = settings.AC_type;

    system.AC_conductors = AC_types[system.AC_type];


    system.wire_config_num = 5;
    
}

function lookupLocation(position){
    var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude+','+position.coords.longitude+'&sensor=true';
    k.AJAX(url, showLocation);
}
function showLocation(location_json){
    var location = JSON.parse(location_json);
    location.results[0].address_components.forEach( function(component){
        if( component.types[0] === "locality" ) {
            settings.city = component.long_name 
            //log('city ', settings.city) 
        } else if( component.types[0] === "administrative_area_level_2" ){
            settings.county = component.long_name 
            //log('county ', settings.county)
        }
    })
    update();
}
/////////////////////////////////////////////
// DRAWING



//////////////
// Model


////////////
// layers

var l_attr = {};

l_attr.base = {
    'fill': 'none',
    'stroke':'#000000',
    'stroke-width':'1px',
    'stroke-linecap':'butt',
    'stroke-linejoin':'miter',
    'stroke-opacity':1,

};
l_attr.block = Object.create(l_attr.base);
l_attr.frame = Object.create(l_attr.base);
l_attr.frame.stroke = '#000042'
l_attr.table = Object.create(l_attr.base);
l_attr.table.stroke = '#000042'

l_attr.DC_pos = Object.create(l_attr.base);
l_attr.DC_pos.stroke = '#ff0000';
l_attr.DC_neg = Object.create(l_attr.base);
l_attr.DC_neg.stroke = '#000000';
l_attr.DC_ground = Object.create(l_attr.base);
l_attr.DC_ground.stroke = '#006600';
l_attr.module = Object.create(l_attr.base);
l_attr.box = Object.create(l_attr.base);
l_attr.text = Object.create(l_attr.base);
l_attr.text.stroke = '#0000ff';
l_attr.terminal = Object.create(l_attr.base);

l_attr.AC_ground = Object.create(l_attr.base);
l_attr.AC_ground.stroke = 'Green';
l_attr.AC_neutral = Object.create(l_attr.base);
l_attr.AC_neutral.stroke = 'Gray';
l_attr.AC_L1 = Object.create(l_attr.base);
l_attr.AC_L1.stroke = 'Black';
l_attr.AC_L2 = Object.create(l_attr.base);
l_attr.AC_L2.stroke = 'Red';
l_attr.AC_L3 = Object.create(l_attr.base);
l_attr.AC_L3.stroke = 'Blue';

///////////////
// fonts

var fonts = {};
fonts['signs'] = {
    'font-family': 'monospace',
    'font-size':     5,
    'text-anchor':   'middle',
};
fonts['label'] = {
    'font-family': 'monospace',
    'font-size':     12,
    'text-anchor':   'middle',
};
fonts['title1'] = {
    'font-family': 'monospace',
    'font-size':     14,
    'text-anchor':   'left',
};
fonts['title2'] = {
    'font-family': 'monospace',
    'font-size':     12,
    'text-anchor':   'left',
};
fonts['page'] = {
    'font-family': 'monospace',
    'font-size':     20,
    'text-anchor':   'left',
}
fonts['table'] = {
    'font-family': 'monospace',
    'font-size':     6,
    'text-anchor':   'middle',
};


///////
// setup drawing containers

var elements = [];



// BLOCKS

var Blk = {
    type: 'block',
};
Blk.move = function(x, y){
    for( var i in this.elements ){
        this.elements[i].move(x,y);
    }
    return this;
};
Blk.add = function(){
    if( typeof this.elements == 'undefined'){ this.elements = [];}
    for( var i in arguments){
        this.elements.push(arguments[i]);
    }
    return this;
};
Blk.rotate = function(deg){
    this.rotate = deg;
};

var blocks = {};
var block_active = false;
// Create default layer,block container and functions

// Layers

var layer_active = false;

var layer = function(name){ // set current layer
    if( typeof name === 'undefined' ){ // if no layer name given, reset to default 
        layer_active = false;
    } else if ( ! (name in l_attr) ) {
        log('Error: unknown layer, using base')
        layer_active = 'base' 
    } else { // finaly activate requested layer
        layer_active = name;
    }
};

/*
var block = function(name) {// set current block
    // if current block has been used, save it before creating a new one.
    if( blocks[block_active].length > 0 ) { blocks.push(blocks[block_active]); }
    if( typeof name !== 'undefined' ){ // if name argument is submitted, create new block
        var blk = Object.create(Blk);
        blk.name = name; // block name
        blocks[block_active] = blk;
    } else { // else use default block
        blocks[block_active] = blocks[0];
    }
}
block('default'); // set current block to default
*/
var block_start = function(name) {
    if( typeof name === 'undefined' ){ // if name argument is submitted
        log('Error: name required');
    } else {
        // TODO: What if the same name is submitted twice? throw error or fix?
        block_active = name;
        if( typeof blocks[block_active] !== 'object'){
            var blk = Object.create(Blk);
            //blk.name = name; // block name
            blocks[block_active] = blk;
        }
        return blk;
    }
};

    /*
    x = loc.wire_table.x - w/2;
    y = loc.wire_table.y - h/2;
    if( typeof layer_name !== 'undefined' && (layer_name in layers) ) {
        var layer_selected = layers[layer_name]
    } else {
        if( ! (layer_name in layers) ){ log("error, layer does not exist, using current");}
        var layer_selected =  layer_active
    }
    */
var block_end = function() {
    var blk = blocks[block_active];
    block_active = false;
    return blk;
};



// clear drawing 
var clear_drawing = function() {
    for( var id in blocks ){
        if( blocks.hasOwnProperty(id)){
            delete blocks[id]; 
        }
    }
    elements.length = 0;
};


//////
// build prototype element

    /*
    if( typeof layer_name !== 'undefined' && (layer_name in layers) ) {
        var layer_selected = layers[layer_name]
    } else {
        if( ! (layer_name in layers) ){ log("error, layer does not exist, using current");}
        var layer_selected =  layer_active
    }
    */


var SvgElem = {
    object: 'SvgElem'
};
SvgElem.move = function(x, y){
    if( typeof this.points != 'undefined' ) {
        for( var i in this.points ) {
            this.points[i][0] += x;
            this.points[i][1] += y;
        }
    }
    return this;
};
SvgElem.rotate = function(deg){
    this.rotated = deg;
};

///////
// functions for adding elements

var add = function(type, points, layer_name) {

    if( typeof layer_name === 'undefined' ) { layer_name = layer_active; } 
    if( ! (layer_name in l_attr) ) { 
        log('Layer name not found, using base');
        layer_name = 'base'; 
    }

    if( typeof points == 'string') {
        var points = points.split(' ');
        for( var i in points ) {
            points[i] = points[i].split(',');
            for( var c in points[i] ) {
                points[i][c] = Number(points[i][c]);
            }
        }
    }

    var elem = Object.create(SvgElem);
    elem.type = type;
    elem.layer_name = layer_name;
    if( type === 'line' ) {
        elem.points = points;
    } else if( typeof points[0].x === 'undefined') {
        elem.x = points[0][0]; 
        elem.y = points[0][1]; 
    } else {
        elem.x = points[0].x
        elem.y = points[0].y; 
    }

    
    if(block_active) { 
        blocks[block_active].add(elem);
    } else {
        elements.push(elem);
    }

    return elem;
};

var line = function(points, layer){ // (points, [layer])
    //return add('line', points, layer)
    var line =  add('line', points, layer);
    return line;
};

var rect = function(loc, size, layer){
    var rec = add('rect', [loc], layer);
    rec.w = size[0];
    /*
    if( typeof layer_name !== 'undefined' && (layer_name in layers) ) {
        var layer_selected = layers[layer_name]
    } else {
        if( ! (layer_name in layers) ){ log("error, layer does not exist, using current");}
        var layer_selected =  layer_active
    }
    */
    rec.h = size[1];
    return rec;
};

var circ = function(loc, diameter, layer){
    var cir = add('circ', [loc], layer);
    cir.d = diameter;
    return cir;
};

var text = function(loc, strings, font, layer){
    var txt = add('text', [loc], layer);
    if( typeof strings == 'string'){
        strings = [strings];
    }
    txt.strings = strings;
    txt.font = font;
    return txt;
};

var block = function(name) {// set current block
    if( arguments.length === 2 ){ // if coor is passed
        if( typeof arguments[1].x !== 'undefined' ){
            var x = arguments[1].x;
            var y = arguments[1].y;
        } else {
            var x = arguments[1][0];
            var y = arguments[1][1];
        }
    } else if( arguments.length === 3 ){ // if x,y is passed
        var x = arguments[1];
        var y = arguments[2];
    }

    // TODO: what if block does not exist? print list of blocks?
    var blk = Object.create(blocks[name]);
    blk.x = x;
    blk.y = y;

    if(block_active){ 
        blocks[block_active].add(blk);
    } else {
        elements.push(blk);l_attr.AC_ground = Object.create(l_attr.base)
l_attr.AC_ground.stroke = '#006600'

    }
    return blk
};

/////////////////////////////////


log('elements', elements);
log('blocks', blocks);




//////////////
//#drawing parameters

var size = {};
var loc = {};

var update_values = function(){

    // sizes
    size.drawing = {
        w: 1000,
        h: 780,
        frame_padding: 5,
        titlebox: 50,
    }

    size.module = {};
    size.module.frame = {
        w: 10,
        h: 30,
    }
    size.module.lead = size.module.frame.w*2/3;
    size.module.h = size.module.frame.h + size.module.lead*2;
    size.module.w = size.module.frame.w;

    size.wire_offset = {
        base: 5,
        gap: size.module.w,
    }    
    size.wire_offset.max = system.DC.string_num * size.wire_offset.base;
    size.wire_offset.ground = size.wire_offset.max + size.wire_offset.base*2;

    size.string = {};
    size.string.gap = size.module.frame.w/42;
    size.string.gap_missing = size.string.gap + size.module.frame.w;
    size.string.h = (size.module.h * 4) + (size.string.gap * 2) + size.string.gap_missing;
    size.string.w = size.module.frame.w * 2.5;

    size.jb_box = {
        h: 140 + size.wire_offset.base*2 * system.DC.string_num,
        w: 80,
    }

    size.discbox = {
        w: 80 + size.wire_offset.base*2 * system.DC.string_num,
        h: 140,
    }

    size.terminal_diam = 5;

    size.inverter = { w: 200, h: 150 };
    size.inverter.text_gap = 15;
    size.inverter.symbol_w = 50;
    size.inverter.symbol_h = 25;

    size.AC_disc = { w: 75, h: 100 };

    size.AC_loadcenter = { w: 125, h: 300 }; 
    size.AC_loadcenter.breaker = { w: 20, h: 5, };

    size.AC_loadcenter.neutralbar = { w:5, h:40 }
    size.AC_loadcenter.groundbar = { w:40, h:5 }

    size.wire_table = {}
    size.wire_table.w = 200;
    size.wire_table.row_h = 10;
    size.wire_table.h = (system.wire_config_num+3) * size.wire_table.row_h;


    // location
    loc.array = { x:200, y:600 };
    loc.array.upper = loc.array.y - size.string.h/2;
    loc.array.lower = loc.array.upper + size.string.h;
    loc.array.right = loc.array.x - size.module.frame.h*2;
    loc.array.left = loc.array.right - ( size.string.w * system.DC.string_num ) - ( size.module.w * 1.25 ) ;

    loc.DC = loc.array;

    loc.inverter = { x:loc.array.x+300, y:loc.array.y-350 };
    loc.inverter.bottom = loc.inverter.y + size.inverter.h/2;
    loc.inverter.top = loc.inverter.y - size.inverter.h/2;
    loc.inverter.bottom_right = {
        x: loc.inverter.x + size.inverter.w/2,
        y: loc.inverter.y + size.inverter.h/2,
    };
    loc.AC_disc = { x: loc.array.x+475, y: loc.array.y-100 };
    loc.AC_disc.bottom = loc.AC_disc.y + size.AC_disc.h/2;
    loc.AC_disc.top = loc.AC_disc.y - size.AC_disc.h/2;
    loc.AC_disc.left = loc.AC_disc.x - size.AC_disc.w/2;
    loc.AC_disc.switch_top = loc.AC_disc.top + 15;
    loc.AC_disc.switch_bottom = loc.AC_disc.switch_top + 30;
    


    loc.AC_loadcenter = {
        x: loc.AC_disc.x+150, 
        y: loc.AC_disc.y-100
    };
    loc.AC_loadcenter.wire_bundle_bottom = loc.AC_disc.top - 20;
    loc.AC_loadcenter.left = loc.AC_loadcenter.x - size.AC_loadcenter.w/2;
    loc.AC_loadcenter.breakers = {
        left: loc.AC_loadcenter.x - ( size.AC_loadcenter.breaker.w * 1.1 ),
        spacing: size.terminal_diam,
    };
    loc.AC_loadcenter.neutralbar = {
        x: loc.AC_loadcenter.left + 20, 
        y: loc.AC_loadcenter.y + size.AC_loadcenter.h*0.2 
    };
    loc.AC_loadcenter.groundbar = {
        x: loc.AC_loadcenter.x + 10, 
        y: loc.AC_loadcenter.y + size.AC_loadcenter.h*0.45
    };

    loc.wire_table = {
        x: size.drawing.w - size.drawing.titlebox - size.drawing.frame_padding*3 - size.wire_table.w/2 - 25,
        y: size.drawing.frame_padding*3 + size.wire_table.h/2,
    }
    loc.wire_table.top = loc.wire_table.y - size.wire_table.h/2;
    loc.wire_table.bottom = loc.wire_table.y + size.wire_table.h/2;

    //loc.AC_loadcenter.breakers = 

}

log('size', size);
    
log('loc', loc);


///////////////
// build drawing

//#start drawing
var mk_drawing = function(){

    var x, y, h, w;


// Define blocks
// module block
    w = size.module.frame.w;
    h = size.module.frame.h;

    block_start('module');

    // frame
    layer('module');
    rect( [0,h/2], [w,h] );
    // frame triangle?
    line([
        [-w/2,0],
        [0,w/2],
    ]);
    line([
        [0,w/2],
        [w/2,0],
    ]);
    // leads
    layer('DC_pos');
    line([
        [0, 0],
        [0, -size.module.lead]
    ]);
    layer('DC_neg');
    line([
        [0, h],
        [0, h+(size.module.lead)]
    ]);
    // pos sign
    layer('text');
    text(
        [size.module.lead/2, -size.module.lead/2],
        '+',
        'signs'
    );
    // neg sign
    text(
        [size.module.lead/2, h+size.module.lead/2],
        '-',
        'signs'
    );
    // ground
    layer('DC_ground');
    line([
        [-w/2, h/2],
        [-w/2-w/4, h/2],
    ]);

    layer();
    block_end();

//#string
    block_start('string');

    x = 0;
    y = 0;

    y += size.module.lead; 

    //TODO: add loop to jump over negative return wires 
    layer('DC_ground');
    line([
        [x-size.module.frame.w*3/4, y+size.module.frame.h/2],
        [x-size.module.frame.w*3/4, y+size.string.h + size.wire_offset.ground + size.module.lead*0.5 ],
    ]);
    layer();

    block('module', [x,y]);
    y += size.module.frame.h + size.module.lead*2 + size.string.gap_missing;
    block('module', [x,y]);
    y += size.module.frame.h + size.module.lead*2 + size.string.gap;
    block('module', [x,y]);
    y += size.module.frame.h + size.module.lead*2 + size.string.gap;
    block('module', [x,y]);

    block_end();


// terminal
    block_start('terminal');
    x = 0;
    y = 0;

    layer('terminal');
    circ(
        [x,y],
        size.terminal_diam
    )
    layer();
    block_end();

////////////////////////////////////////
// Frame

    w = size.drawing.w;
    h = size.drawing.h;
    var padding = size.drawing.frame_padding; 

    layer('frame');

    //border
    rect( [w/2 , h/2], [w - padding*2, h - padding*2 ] );
    
    x = w - padding * 3;
    y = padding * 3;

    w = size.drawing.titlebox;
    h = size.drawing.titlebox;

    // box top-right
    rect( [x-w/2, y+h/2], [w,h] );
    
    y += h + padding; 

    w = size.drawing.titlebox;
    h = size.drawing.h - padding*8 - size.drawing.titlebox*2.5;
    
    //title box
    rect( [x-w/2, y+h/2], [w,h] );

    var title = {};
    title.top = y;
    title.bottom = y+h;
    title.right = x;
    title.left = x-w ;


    // box bottom-right
    h = size.drawing.titlebox * 1.5;
    y = title.bottom + padding; 
    rect( [x-w/2, y+h/2], [w,h] );
    
    var page = {};
    page.right = title.right;
    page.left = title.left;
    page.top = title.bottom + padding;
    page.bottom = page.top + size.drawing.titlebox*1.5;
    // Text

    x = title.left + padding;
    y = title.bottom - padding;

    x += 10;
    text([x,y], 
         [ system.inverter.Make + " " + system.inverter.model + " Inverter System" ],
        'title1', 'text').rotate(-90);

    x += 14;
    text([x,y], [
        system.DC.module.specs.Make + " " + system.DC.module.specs.model + 
            " (" + system.DC.string_num  + " strings of " + system.DC.string_modules + " modules )"
    ], 'title2', 'text').rotate(-90);
        
    x = page.left + padding;
    y = page.top + padding;
    y += size.drawing.titlebox * 1.5 * 3/4;


    text([x,y],
        ['PV1'],
        'page', 'text');

////////////////////////////////////////
//#array
    // PV array


    x = loc.array.x;
    y = loc.array.y;

    circ([x,y], 5, 'base'); // MARKER

    x -= size.module.frame.h*3;
    y -= size.string.h/2;

    for( var i=0; i<system.DC.string_num; i++ ) {
        var offset = i * size.wire_offset.base;
        
        block('string', [x,y]);
        // positive home run
        layer('DC_pos');
        line([
            [ x , loc.array.upper ],
            [ x , loc.array.upper-size.module.w-offset ],
            [ loc.array.right+offset , loc.array.upper-size.module.w-offset ],
            [ loc.array.right+offset , loc.array.y-size.module.w-offset],
            [ loc.array.x , loc.array.y-size.module.w-offset],
        ]);

        // negative home run
        layer('DC_neg');
        line([
            [ x , loc.array.lower ],
            [ x , loc.array.lower+size.module.w+offset ],
            [ loc.array.right+offset , loc.array.lower+size.module.w+offset ],
            [ loc.array.right+offset , loc.array.y+size.module.w+offset],
            [ loc.array.x , loc.array.y+size.module.w+offset],
        ]);

        x -= size.string.w;
    }

    layer('DC_ground');
    line([
        [ loc.array.left , loc.array.lower + size.module.w + size.wire_offset.ground ],
        [ loc.array.right+size.wire_offset.ground , loc.array.lower + size.module.w + size.wire_offset.ground ],
        [ loc.array.right+size.wire_offset.ground , loc.array.y + size.module.w + size.wire_offset.ground],
        [ loc.array.x , loc.array.y+size.module.w+size.wire_offset.ground],
    ]);

    layer();


///////////////////////////////
// combiner box
    x = loc.array.x;
    y = loc.array.y;

    var fuse_width = size.wire_offset.gap;
    var to_disconnect_x = 150;
    var to_disconnect_y = -100;

    
    rect(
        [x+size.jb_box.w/2,y-size.jb_box.h/10],
        [size.jb_box.w,size.jb_box.h],
        'box'
    );


    for( var i in _.range(system.DC.string_num)) {
        var offset = size.wire_offset.gap + ( i * size.wire_offset.base );

        layer('DC_pos');
        line([
            [ x , y-offset],
            [ x+(size.jb_box.w-fuse_width)/2 , y-offset],
        ]);
        line([
            [ x+(size.jb_box.w+fuse_width)/2 , y-offset],
            [ x+size.jb_box.w+to_disconnect_x-offset , y-offset],
            [ x+size.jb_box.w+to_disconnect_x-offset , y+to_disconnect_y-size.terminal_diam],
            [ x+size.jb_box.w+to_disconnect_x-offset , y+to_disconnect_y-size.terminal_diam-size.terminal_diam*3],
        ]);
        block( 'terminal', {
            x: x+size.jb_box.w+to_disconnect_x-offset,
            y: y+to_disconnect_y-size.terminal_diam
        });

        layer('DC_neg');
        line([
            [ x , y+offset],
            [ x+(size.jb_box.w-fuse_width)/2 , y+offset],
        ]);
        line([
            [ x+(size.jb_box.w+fuse_width)/2 , y+offset],
            [ x+size.jb_box.w+to_disconnect_x+offset , y+offset],
            [ x+size.jb_box.w+to_disconnect_x+offset , y+to_disconnect_y-size.terminal_diam],
            [ x+size.jb_box.w+to_disconnect_x+offset , y+to_disconnect_y-size.terminal_diam-size.terminal_diam*3],
        ]);
        block( 'terminal', {
            x: x+size.jb_box.w+to_disconnect_x+offset,
            y: y+to_disconnect_y-size.terminal_diam
        });
    }

    x += size.jb_box.w;

    x += to_disconnect_x;
    y += to_disconnect_y;

///////////////////////////////
    // DC disconect combiner lines
    if( system.DC.string_num > 1){
        var offset_min = size.wire_offset.gap;
        var offset_max = size.wire_offset.gap + ( (system.DC.string_num-1) * size.wire_offset.base );
        line([
            [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
            [ x-offset_max , y-size.terminal_diam-size.terminal_diam*3],
        ], 'DC_pos');
        line([
            [ x+offset_min, y-size.terminal_diam-size.terminal_diam*3],
            [ x+offset_max, y-size.terminal_diam-size.terminal_diam*3],
        ], 'DC_neg');
    }
    
    // Inverter conection
    line([
        [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
        [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
    ],'DC_pos')



    // DC disconect
    rect(
        [x, y-size.discbox.h/2],
        [size.discbox.w,size.discbox.h],
        'box'
    );

///////////////////////////////
//#inverter
    x = loc.inverter.x;
    y = loc.inverter.y;


    //frame
    layer('box');
    rect(
        [x,y],
        [size.inverter.w, size.inverter.h]
    );
    // Label at top (Inverter, make, model, ...)
    layer('text');
    text(
        [loc.inverter.x, loc.inverter.top + size.inverter.text_gap ],
        [ 'Inverter', components.inverters[settings.inverter].Make + " " + components.inverters[settings.inverter].model ],
        'label'
    );
    layer();

//#inverter symbol

    x = loc.inverter.x;
    y = loc.inverter.y;
    
    var w = size.inverter.symbol_w;
    var h = size.inverter.symbol_h;

    var space = w*1/12;

    // Inverter symbol
    layer('box');

    // box
    rect(
        [x,y],
        [w, h]
    );
    // diaganal
    line([
        [x-w/2, y+h/2],
        [x+w/2, y-h/2],
    
    ]);
    // DC
    line([
        [x - w/2 + space, 
            y - h/2 + space],
        [x - w/2 + space*6, 
            y - h/2 + space],
    ]);
    line([
        [x - w/2 + space, 
            y - h/2 + space*2],
        [x - w/2 + space*2, 
            y - h/2 + space*2],
    ]);
    line([
        [x - w/2 + space*3, 
            y - h/2 + space*2],
        [x - w/2 + space*4, 
            y - h/2 + space*2],
    ]);
    line([
        [x - w/2 + space*5, 
            y - h/2 + space*2],
        [x - w/2 + space*6, 
            y - h/2 + space*2],
    ]);

    // AC
    line([
        [x + w/2 - space, 
            y + h/2 - space*1.5],
        [x + w/2 - space*2, 
            y + h/2 - space*1.5],
    ]);
    line([
        [x + w/2 - space*3, 
            y + h/2 - space*1.5],
        [x + w/2 - space*4, 
            y + h/2 - space*1.5],
    ]);
    line([
        [x + w/2 - space*5, 
            y + h/2 - space*1.5],
        [x + w/2 - space*6, 
            y + h/2 - space*1.5],
    ]);
    layer();
        





//#AC_discconect
    x = loc.AC_disc.x;
    y = loc.AC_disc.y;
    padding = size.terminal_diam;

    layer('box');
    rect(
        [x, y],
        [size.AC_disc.w, size.AC_disc.h]
    );
    layer();


//log('size:', [h,w])
//log('location:', [x,y])
//circ([x,y],5);



//#AC load center
    var bottom = loc.AC_loadcenter.wire_bundle_bottom;    
    var breaker_spacing = loc.AC_loadcenter.breakers.spacing;

    x = loc.AC_loadcenter.x;
    y = loc.AC_loadcenter.y;
    w = size.AC_loadcenter.w;
    h = size.AC_loadcenter.h;

    rect([x,y],
        [w,h],
        'box'
    );

    text([x,y-h*0.4],
        [system.AC_loadcenter_type, 'Load Center'],
        'label',
        'text'
    )
    w = size.AC_loadcenter.breaker.w;
    h = size.AC_loadcenter.breaker.h;

    y -= size.AC_loadcenter.h/4;

    padding = loc.AC_loadcenter.x - loc.AC_loadcenter.breakers.left - size.AC_loadcenter.breaker.w;

    for( var i=0; i<30; i++){
        
        rect([x-padding-w/2,y],[w,h],'box');
        rect([x+padding+w/2,y],[w,h],'box');
    
        y += breaker_spacing;
    }

    var s, l;
    
    l = loc.AC_loadcenter.neutralbar;
    s = size.AC_loadcenter.neutralbar;
    rect([l.x,l.y], [s.w,s.h], 'AC_neutral' )

    l = loc.AC_loadcenter.groundbar;
    s = size.AC_loadcenter.groundbar;
    rect([l.x,l.y], [s.w,s.h], 'AC_ground' )

    



// AC lines

    x = loc.inverter.bottom_right.x;
    y = loc.inverter.bottom_right.y;
    x -= size.terminal_diam * (system.AC_conductors.length+3);
    y -= size.terminal_diam;

    //var AC_layer_names = ['AC_ground', 'AC_neutral', 'AC_L1', 'AC_L2', 'AC_L2'];

    //log(system.AC_conductors.length)

    for( var i=0; i < system.AC_conductors.length; i++ ){
        block('terminal', [x,y] );
        layer('AC_'+system.AC_conductors[i]);
        line([
            [x, y],
            [x, loc.AC_disc.bottom - size.terminal_diam * (i+1) ],
            [loc.AC_disc.left, loc.AC_disc.bottom - size.terminal_diam * (i+1) ],
        ]);
        x += size.terminal_diam;
    }
    layer();

    x = loc.AC_disc.x;
    y = loc.AC_disc.y;
    padding = size.terminal_diam;

    x -= size.AC_disc.w/2
    y += size.AC_disc.h/2

    y -= padding;

    if( system.AC_conductors.indexOf('ground')+1 ) {
        layer('AC_ground');
        line([
            [x,y],
            [ x+size.AC_disc.w+padding*3, y ],
            [ x+size.AC_disc.w+padding*3, bottom ],
            [ loc.AC_loadcenter.left+padding*2, bottom ],
            [ loc.AC_loadcenter.left+padding*2, y ],
            [ loc.AC_loadcenter.groundbar.x-padding, y ],
            [ loc.AC_loadcenter.groundbar.x-padding, loc.AC_loadcenter.groundbar.y+size.AC_loadcenter.groundbar.h/2 ],
        ])
    }

    if( system.AC_conductors.indexOf('neutral')+1 ) {
        y -= padding;
        layer('AC_neutral');
        line([
            [x,y],
            [ x+size.AC_disc.w-padding*1, y ],
            [ x+size.AC_disc.w-padding*1, bottom-breaker_spacing*1 ],
            [ loc.AC_loadcenter.neutralbar.x, bottom-breaker_spacing*1 ],
            [ loc.AC_loadcenter.neutralbar.x, 
                loc.AC_loadcenter.neutralbar.y-size.AC_loadcenter.neutralbar.h/2 ],
        ])
    }
        
     
    for( var i=1; i <= 3; i++ ) {
        if( system.AC_conductors.indexOf('L'+i)+1 ) {
            y -= padding;
            layer('AC_L'+i);
            line([
                [x,y],
                [ x+padding*(15-i*3), y ],
                [ x+padding*(15-i*3), loc.AC_disc.switch_bottom ],
            ]);
            block('terminal', [ x+padding*(15-i*3), loc.AC_disc.switch_bottom ] )
            block('terminal', [ x+padding*(15-i*3), loc.AC_disc.switch_top ] )
            line([
                [ x+padding*(15-i*3), loc.AC_disc.switch_top ],
                [ x+padding*(15-i*3), bottom-breaker_spacing*(i+2) ],
                [ loc.AC_loadcenter.breakers.left, bottom-breaker_spacing*(i+2) ],
            ]);

        }

    }

    x = loc.wire_table.x;
    y = loc.wire_table.y;
    w = size.wire_table.w;
    h = size.wire_table.h;
    var row_h = size.wire_table.row_h;
    var top = loc.wire_table.top;
    var bottom = loc.wire_table.bottom;
    var column_width = {
        number: 25,
        wire_gauge: 25,
        wire_type: 50,
        conduit_gauge: 25,
        conduit_type: 50,
    }

    layer('table')
    rect( [x,y], [w,h] );

    line([
        [x-w/2+25 , y-h/2+(1*row_h)],
        [x+w/2 , y-h/2+(1*row_h)],
    ])

    for( var r=2; r<system.wire_config_num+3; r++ ) {
    
        line([
            [x-w/2 , y-h/2+(r*row_h)],
            [x+w/2 , y-h/2+(r*row_h)],
        ])
    }
    x = loc.wire_table.x - w/2;
    y = loc.wire_table.y - h/2;
    x += column_width.number;

    var c_w = column_width.wire_gauge;
    line([ [x,top], [x,bottom-row_h] ]);
    text( [x+c_w,y+row_h*0.75], 'Wire', 'table', 'text');
    text( [x+c_w/2,y+row_h*1.75], 'AWG', 'table', 'text');
    x += c_w;

    c_w = column_width.wire_type;
    line([ [x,top+row_h], [x,bottom-row_h] ]);
    text( [x+c_w/2,y+row_h*1.75], 'Type', 'table', 'text');
    x += c_w;

    c_w = column_width.conduit_gauge;
    line([ [x,top], [x,bottom-row_h] ]);
    text( [x+c_w,y+row_h*0.75], 'Conduit', 'table', 'text');
    text( [x+c_w/2,y+row_h*1.75], 'Size', 'table', 'text');
    x += c_w;

    line([ [x,top+row_h], [x,bottom-row_h] ]);
    text( [x+c_w/2,y+row_h*1.75], 'Type', 'table', 'text');

    x = loc.wire_table.x - w/2;
    y = loc.wire_table.y - h/2;

    x += column_width.number/2;
    y += row_h*2 + row_h*0.75;

    for( var r=1; r<=system.wire_config_num; r++ ) {
        text( [x,y], String(r), 'table', 'text');



        y += row_h;
    }

}


















///////////////////
// Display

//#svg
var display_svg = function(){
    //log('displaying svg');
    var container = document.getElementById(svg_container_id);
    container.innerHTML = '';
    //container.empty()

    //var svg_elem = document.getElementById('SvgjsSvg1000')
    var svg_elem = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svg_elem.setAttribute('id','svg_drawing');
    svg_elem.setAttribute('width', size.drawing.w);
    svg_elem.setAttribute('height', size.drawing.h);
    container.appendChild(svg_elem);
    var svg = SVG(svg_elem).size(size.drawing.w, size.drawing.h);

    // Loop through all the drawing contents, call the function below.
    elements.forEach( function(elem,id) {
        show_elem_array(elem);
    })

    function show_elem_array(elem, offset){
        offset = offset || {x:0,y:0};
        if( typeof elem.x !== 'undefined' ) { var x = elem.x + offset.x; } 
        if( typeof elem.y !== 'undefined' ) { var y = elem.y + offset.y; } 

        if( elem.type === 'rect') {
            svg.rect( elem.w, elem.h ).move( x-elem.w/2, y-elem.h/2 ).attr( l_attr[elem.layer_name] );
        } else if( elem.type === 'line') {
            var points2 = [];
            elem.points.forEach( function(point){
                points2.push([ point[0]+offset.x, point[1]+offset.y ])
            })  
            svg.polyline( points2 ).attr( l_attr[elem.layer_name] );
        } else if( elem.type === 'text') {
            //var t = svg.text( elem.strings ).move( elem.points[0][0], elem.points[0][1] ).attr( l_attr[elem.layer_name] )
            var font = fonts[elem.font];
            
            var t = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            t.setAttribute('x', x);
            //t.setAttribute('y', y + font['font-size']/2 );
            t.setAttribute('y', y );
            if(elem.rotated){
                //t.setAttribute('transform', "rotate(" + elem.rotated + " " + x + " " + y + ")" );
                t.setAttribute('transform', "rotate(" + elem.rotated + " " + x + " " + y + ")" );
            }
            for( var i2 in l_attr[elem.layer_name] ){
                t.setAttribute( i2, l_attr[elem.layer_name][i2] );
            }
            for( var i2 in font ){
                t.setAttribute( i2, font[i2] );
            }
            for( var i2 in elem.strings ){
                var tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
                tspan.setAttribute('dy', font['font-size']*1.5*i2 );
                tspan.setAttribute('x', x);
                tspan.innerHTML = elem.strings[i2];
                t.appendChild(tspan);
            }
            svg_elem.appendChild(t);
        } else if( elem.type === 'circ') {
            var c = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
            c.setAttribute('rx', elem.d/2);
            c.setAttribute('ry', elem.d/2);
            c.setAttribute('cx', x);
            c.setAttribute('cy', y);
            var attr = l_attr[elem.layer_name];
            for( var i2 in attr ){
                c.setAttribute(i2, attr[i2]);
            }
            svg_elem.appendChild(c);
            /*
            c.attributes( l_attr[elem.layer_name] )
            c.attributes({
                rx: 5,
                --------------------------
                ry: 5,
                cx: elem.points[0][0]-elem.d/2,
                cy: elem.points[0][1]-elem.d/2
            })
            var c2 = svg.ellipse( elem.r, elem.r )
            c2.move( elem.points[0][0]-elem.d/2, elem.points[0][1]-elem.d/2 )
            c2.attr({rx:5, ry:5})
            c2.attr( l_attr[elem.layer_name] )
            */
        } else if(elem.type === 'block') {
            // if it is a block, run this function through each element.
            elem.elements.forEach( function(block_elem,id){
                show_elem_array(block_elem, {x:x, y:y}) 
            })
        }
    }
}


//////////////////////////////////////////
// after page loads functions


var update_settings_registry = function() {
}


//#update drawing
function update(){
    log('updating');

    // Make sure selectors and value displays are updated
    settings_registry.forEach(function(item){
        item.update(); 
    })

    // delete all elements of drawing 
    clear_drawing();

    // Recalculate system specs
    update_system();
    
    // Recalculate drawing related variables
    update_values();

    // Generate new drawing elements
    mk_drawing();

    // Add drawing elements to SVG on screen
    display_svg();

};



var svg_container_id = 'svg_container';
var system_container_id = 'system_container';



window.onload = function() {
    var title = 'PV drawing test';

    k.setup_body(title);
    var draw_page = $('div').attr('id', 'drawing_page');
    document.body.appendChild(draw_page.elem);

    var system_container = $('div').attr('id', system_container_id).appendTo(draw_page);
    
    var svg_container_object = $('div').attr('id', svg_container_id).appendTo(draw_page);
    var svg_container = svg_container_object.elem

//System options
    ///*
    var system_container_array = [
        $('span').html('IP location |'),
        $('span').html('City: '),
        $('value').setRef('settings.city'),
        $('span').html(' | '),
        $('span').html('County: '),
        $('value').setRef('settings.county'),
        $('br'),
        //*/

        $('span').html('Module make: '),
        $('selector').set_options( 'k.obj_id_array(components.modules)' ).set_setting('pv_make'),
        
        $('br'),
        $('span').html('Module model: '),
        $('selector').set_options( 'k.obj_id_array(components.modules[settings.pv_make])' ).set_setting('pv_model'),

        $('br'),
        $('span').html('Pmax: '),
        $('value').setRef('system.DC.module.specs.Pmax'),

        $('span').html(' | '),
        $('span').html('Isc: '),
        $('value').setRef('system.DC.module.specs.Isc'),

        $('span').html(' | '),
        $('span').html('Voc: '),
        $('value').setRef('system.DC.module.specs.Voc'),

        $('span').html(' | '),
        $('span').html('Imp: '),
        $('value').setRef('system.DC.module.specs.Imp'),
        
        $('span').html(' | '),
        $('span').html('Vmp: '),
        $('value').setRef('system.DC.module.specs.Vmp'),

        $('br'),

        $('span').html('Number of strings: '),
        $('selector').set_options( 'settings.string_num_options').set_setting('string_num'),
        $('span').html(' | '),
        $('span').html('Number of modules per string: '),
        $('selector').set_options( 'settings.string_modules_options').set_setting('string_modules'),
        $('br'),
        
        $('span').html('Array voltage: '),
        $('value').setRef('system.DC.voltage').setMax(600).attr('id', 'DC_volt'),
        //$('value').setRef('system.DC.voltage'),

        $('span').html(' | '),

        $('span').html('Array current: '),
        $('value').setRef('system.DC.current'),

        $('br'),

        $('span').html('AC type: '),

        $('selector').set_options( 'settings.AC_type_options').set_setting('AC_type'),

        $('br'),

    ].forEach( function(elem){
        elem.appendTo(system_container);
        if( elem.type === 'selector' ){
            elem.setUpdate(update);
            elem.update(); 
        } else if( elem.type === 'value' ){
            elem.setUpdate(update_system);
        }
    });

    update();

    var boot_time = moment();
    var status_id = "status";
    setInterval(function(){ k.update_status_page(status_id, boot_time);},1000);




    log(window);


}

},{"./lib/k/k.js":1,"./lib/k/k_DOM.js":2,"./lib/k/k_DOM_extra.js":3,"./lib/k/k_data.js":4,"./lib/svg.js":5,"moment":7,"underscore":8}],7:[function(require,module,exports){
(function (global){
//! moment.js
//! version : 2.7.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (undefined) {

    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = "2.7.0",
        // the global-scope this is NOT the global object in Node.js
        globalScope = typeof global !== 'undefined' ? global : this,
        oldGlobalMoment,
        round = Math.round,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for language config files
        languages = {},

        // moment internal properties
        momentProperties = {
            _isAMomentObject: null,
            _i : null,
            _f : null,
            _l : null,
            _strict : null,
            _tzm : null,
            _isUTC : null,
            _offset : null,  // optional. Combine with _isUTC
            _pf : null,
            _lang : null  // optional
        },

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,

        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
        parseTokenOrdinal = /\d{1,2}/,

        //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],
            ['YYYY-DDD', /\d{4}-\d{3}/]
        ],

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        },

        unitAliases = {
            ms : 'millisecond',
            s : 'second',
            m : 'minute',
            h : 'hour',
            d : 'day',
            D : 'date',
            w : 'week',
            W : 'isoWeek',
            M : 'month',
            Q : 'quarter',
            y : 'year',
            DDD : 'dayOfYear',
            e : 'weekday',
            E : 'isoWeekday',
            gg: 'weekYear',
            GG: 'isoWeekYear'
        },

        camelFunctions = {
            dayofyear : 'dayOfYear',
            isoweekday : 'isoWeekday',
            isoweek : 'isoWeek',
            weekyear : 'weekYear',
            isoweekyear : 'isoWeekYear'
        },

        // format function strings
        formatFunctions = {},

        // default relative time thresholds
        relativeTimeThresholds = {
          s: 45,   //seconds to minutes
          m: 45,   //minutes to hours
          h: 22,   //hours to days
          dd: 25,  //days to month (month == 1)
          dm: 45,  //days to months (months > 1)
          dy: 345  //days to year
        },

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.lang().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.lang().months(this, format);
            },
            D    : function () {
                return this.date();
            },
            DDD  : function () {
                return this.dayOfYear();
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return this.lang().weekdaysMin(this, format);
            },
            ddd  : function (format) {
                return this.lang().weekdaysShort(this, format);
            },
            dddd : function (format) {
                return this.lang().weekdays(this, format);
            },
            w    : function () {
                return this.week();
            },
            W    : function () {
                return this.isoWeek();
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY : function () {
                return leftZeroFill(this.year(), 5);
            },
            YYYYYY : function () {
                var y = this.year(), sign = y >= 0 ? '+' : '-';
                return sign + leftZeroFill(Math.abs(y), 6);
            },
            gg   : function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg : function () {
                return leftZeroFill(this.weekYear(), 4);
            },
            ggggg : function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG   : function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 4);
            },
            GGGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e : function () {
                return this.weekday();
            },
            E : function () {
                return this.isoWeekday();
            },
            a    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.lang().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return toInt(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS  : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z    : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ":" + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ   : function () {
                var a = -this.zone(),
                    b = "+";
                if (a < 0) {
                    a = -a;
                    b = "-";
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z : function () {
                return this.zoneAbbr();
            },
            zz : function () {
                return this.zoneName();
            },
            X    : function () {
                return this.unix();
            },
            Q : function () {
                return this.quarter();
            }
        },

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];

    // Pick the first defined of two or three arguments. dfl comes from
    // default.
    function dfl(a, b, c) {
        switch (arguments.length) {
            case 2: return a != null ? a : b;
            case 3: return a != null ? a : b != null ? b : c;
            default: throw new Error("Implement me");
        }
    }

    function defaultParsingFlags() {
        // We need to deep clone this object, and es5 standard is not very
        // helpful.
        return {
            empty : false,
            unusedTokens : [],
            unusedInput : [],
            overflow : -2,
            charsLeftOver : 0,
            nullInput : false,
            invalidMonth : null,
            invalidFormat : false,
            userInvalidated : false,
            iso: false
        };
    }

    function deprecate(msg, fn) {
        var firstTime = true;
        function printMsg() {
            if (moment.suppressDeprecationWarnings === false &&
                    typeof console !== 'undefined' && console.warn) {
                console.warn("Deprecation warning: " + msg);
            }
        }
        return extend(function () {
            if (firstTime) {
                printMsg();
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.lang().ordinal(func.call(this, a), period);
        };
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    /************************************
        Constructors
    ************************************/

    function Language() {

    }

    // Moment prototype object
    function Moment(config) {
        checkOverflow(config);
        extend(this, config);
    }

    // Duration Constructor
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._bubble();
    }

    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }

        if (b.hasOwnProperty("toString")) {
            a.toString = b.toString;
        }

        if (b.hasOwnProperty("valueOf")) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function cloneMoment(m) {
        var result = {}, i;
        for (i in m) {
            if (m.hasOwnProperty(i) && momentProperties.hasOwnProperty(i)) {
                result[i] = m[i];
            }
        }

        return result;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    // helper function for _.addTime and _.subtractTime
    function addOrSubtractDurationFromMoment(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            rawSetter(mom, 'Date', rawGetter(mom, 'Date') + days * isAdding);
        }
        if (months) {
            rawMonthSetter(mom, rawGetter(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            moment.updateOffset(mom, days || months);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return  Object.prototype.toString.call(input) === '[object Date]' ||
                input instanceof Date;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (inputObject.hasOwnProperty(prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment.fn._lang[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment.fn._lang, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function weeksInYear(year, dow, doy) {
        return weekOfYear(moment([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                m._a[HOUR] < 0 || m._a[HOUR] > 23 ? HOUR :
                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0;
            }
        }
        return m._isValid;
    }

    function normalizeLanguage(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function makeAs(input, model) {
        return model._isUTC ? moment(input).zone(model._offset || 0) :
            moment(input).local();
    }

    /************************************
        Languages
    ************************************/


    extend(Language.prototype, {

        set : function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
        },

        _months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort : function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse : function (monthName) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                if (!this._monthsParse[i]) {
                    mom = moment.utc([2000, i]);
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin : function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse : function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat : {
            LT : "h:mm A",
            L : "MM/DD/YYYY",
            LL : "MMMM D YYYY",
            LLL : "MMMM D YYYY LT",
            LLLL : "dddd, MMMM D YYYY LT"
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM : function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse : /[ap]\.?m?\.?/i,
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },

        _calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        calendar : function (key, mom) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom) : output;
        },

        _relativeTime : {
            future : "in %s",
            past : "%s ago",
            s : "a few seconds",
            m : "a minute",
            mm : "%d minutes",
            h : "an hour",
            hh : "%d hours",
            d : "a day",
            dd : "%d days",
            M : "a month",
            MM : "%d months",
            y : "a year",
            yy : "%d years"
        },
        relativeTime : function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },
        pastFuture : function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal : function (number) {
            return this._ordinal.replace("%d", number);
        },
        _ordinal : "%d",

        preparse : function (string) {
            return string;
        },

        postformat : function (string) {
            return string;
        },

        week : function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 1st is the first week of the year.
        },

        _invalidDate: 'Invalid date',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    // Loads a language definition into the `languages` cache.  The function
    // takes a key and optionally values.  If not in the browser and no values
    // are provided, it will load the language file module.  As a convenience,
    // this function also returns the language values.
    function loadLang(key, values) {
        values.abbr = key;
        if (!languages[key]) {
            languages[key] = new Language();
        }
        languages[key].set(values);
        return languages[key];
    }

    // Remove a language from the `languages` cache. Mostly useful in tests.
    function unloadLang(key) {
        delete languages[key];
    }

    // Determines which language definition to use and returns it.
    //
    // With no parameters, it will return the global language.  If you
    // pass in a language key, such as 'en', it will return the
    // definition for 'en', so long as 'en' has already been loaded using
    // moment.lang.
    function getLangDefinition(key) {
        var i = 0, j, lang, next, split,
            get = function (k) {
                if (!languages[k] && hasModule) {
                    try {
                        require('./lang/' + k);
                    } catch (e) { }
                }
                return languages[k];
            };

        if (!key) {
            return moment.fn._lang;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            lang = get(key);
            if (lang) {
                return lang;
            }
            key = [key];
        }

        //pick the language from the array
        //try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
        //substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
        while (i < key.length) {
            split = normalizeLanguage(key[i]).split('-');
            j = split.length;
            next = normalizeLanguage(key[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                lang = get(split.slice(0, j).join('-'));
                if (lang) {
                    return lang;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return moment.fn._lang;
    }

    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, "");
        }
        return input.replace(/\\/g, "");
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = "";
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {

        if (!m.isValid()) {
            return m.lang().invalidDate();
        }

        format = expandFormat(format, m.lang());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, lang) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return lang.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
        case 'Q':
            return parseTokenOneDigit;
        case 'DDDD':
            return parseTokenThreeDigits;
        case 'YYYY':
        case 'GGGG':
        case 'gggg':
            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
        case 'Y':
        case 'G':
        case 'g':
            return parseTokenSignedNumber;
        case 'YYYYYY':
        case 'YYYYY':
        case 'GGGGG':
        case 'ggggg':
            return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
        case 'S':
            if (strict) { return parseTokenOneDigit; }
            /* falls through */
        case 'SS':
            if (strict) { return parseTokenTwoDigits; }
            /* falls through */
        case 'SSS':
            if (strict) { return parseTokenThreeDigits; }
            /* falls through */
        case 'DDD':
            return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
            return parseTokenWord;
        case 'a':
        case 'A':
            return getLangDefinition(config._l)._meridiemParse;
        case 'X':
            return parseTokenTimestampMs;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'SSSS':
            return parseTokenDigits;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'GG':
        case 'gg':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'ww':
        case 'WW':
            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
        case 'w':
        case 'W':
        case 'e':
        case 'E':
            return parseTokenOneOrTwoDigits;
        case 'Do':
            return parseTokenOrdinal;
        default :
            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), "i"));
            return a;
        }
    }

    function timezoneMinutesFromString(string) {
        string = string || "";
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? -minutes : minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
        // QUARTER
        case 'Q':
            if (input != null) {
                datePartArray[MONTH] = (toInt(input) - 1) * 3;
            }
            break;
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            if (input != null) {
                datePartArray[MONTH] = toInt(input) - 1;
            }
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            a = getLangDefinition(config._l).monthsParse(input);
            // if we didn't find a month name, mark the date as invalid.
            if (a != null) {
                datePartArray[MONTH] = a;
            } else {
                config._pf.invalidMonth = input;
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DD
        case 'DD' :
            if (input != null) {
                datePartArray[DATE] = toInt(input);
            }
            break;
        case 'Do' :
            if (input != null) {
                datePartArray[DATE] = toInt(parseInt(input, 10));
            }
            break;
        // DAY OF YEAR
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            if (input != null) {
                config._dayOfYear = toInt(input);
            }

            break;
        // YEAR
        case 'YY' :
            datePartArray[YEAR] = moment.parseTwoDigitYear(input);
            break;
        case 'YYYY' :
        case 'YYYYY' :
        case 'YYYYYY' :
            datePartArray[YEAR] = toInt(input);
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config._isPm = getLangDefinition(config._l).isPM(input);
            break;
        // 24 HOUR
        case 'H' : // fall through to hh
        case 'HH' : // fall through to hh
        case 'h' : // fall through to hh
        case 'hh' :
            datePartArray[HOUR] = toInt(input);
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[MINUTE] = toInt(input);
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[SECOND] = toInt(input);
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'SSS' :
        case 'SSSS' :
            datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
            break;
        // UNIX TIMESTAMP WITH MS
        case 'X':
            config._d = new Date(parseFloat(input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config._useUTC = true;
            config._tzm = timezoneMinutesFromString(input);
            break;
        // WEEKDAY - human
        case 'dd':
        case 'ddd':
        case 'dddd':
            a = getLangDefinition(config._l).weekdaysParse(input);
            // if we didn't get a weekday name, mark the date as invalid
            if (a != null) {
                config._w = config._w || {};
                config._w['d'] = a;
            } else {
                config._pf.invalidWeekday = input;
            }
            break;
        // WEEK, WEEK DAY - numeric
        case 'w':
        case 'ww':
        case 'W':
        case 'WW':
        case 'd':
        case 'e':
        case 'E':
            token = token.substr(0, 1);
            /* falls through */
        case 'gggg':
        case 'GGGG':
        case 'GGGGG':
            token = token.substr(0, 2);
            if (input) {
                config._w = config._w || {};
                config._w[token] = toInt(input);
            }
            break;
        case 'gg':
        case 'GG':
            config._w = config._w || {};
            config._w[token] = moment.parseTwoDigitYear(input);
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, lang;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = dfl(w.GG, config._a[YEAR], weekOfYear(moment(), 1, 4).year);
            week = dfl(w.W, 1);
            weekday = dfl(w.E, 1);
        } else {
            lang = getLangDefinition(config._l);
            dow = lang._week.dow;
            doy = lang._week.doy;

            weekYear = dfl(w.gg, config._a[YEAR], weekOfYear(moment(), dow, doy).year);
            week = dfl(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = dfl(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
        // Apply timezone offset from input. The actual zone can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() + config._tzm);
        }
    }

    function dateFromObject(config) {
        var normalizedInput;

        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];

        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {

        if (config._f === moment.ISO_8601) {
            parseISO(config);
            return;
        }

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var lang = getLangDefinition(config._l),
            string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, lang).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // handle am pm
        if (config._isPm && config._a[HOUR] < 12) {
            config._a[HOUR] += 12;
        }
        // if is 12 am, change hours to 0
        if (config._isPm === false && config._a[HOUR] === 12) {
            config._a[HOUR] = 0;
        }

        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = extend({}, config);
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function parseISO(config) {
        var i, l,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be "T" or undefined
                    config._f = isoDates[i][0] + (match[6] || " ");
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(parseTokenTimezone)) {
                config._f += "Z";
            }
            makeDateFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function makeDateFromString(config) {
        parseISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            moment.createFromInputFallback(config);
        }
    }

    function makeDateFromInput(config) {
        var input = config._i,
            matched = aspNetJsonRegex.exec(input);

        if (input === undefined) {
            config._d = new Date();
        } else if (matched) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = input.slice(0);
            dateFromConfig(config);
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof(input) === 'object') {
            dateFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            moment.createFromInputFallback(config);
        }
    }

    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, language) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = language.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
        return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(milliseconds, withoutSuffix, lang) {
        var seconds = round(Math.abs(milliseconds) / 1000),
            minutes = round(seconds / 60),
            hours = round(minutes / 60),
            days = round(hours / 24),
            years = round(days / 365),
            args = seconds < relativeTimeThresholds.s  && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < relativeTimeThresholds.m && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < relativeTimeThresholds.h && ['hh', hours] ||
                days === 1 && ['d'] ||
                days <= relativeTimeThresholds.dd && ['dd', days] ||
                days <= relativeTimeThresholds.dm && ['M'] ||
                days < relativeTimeThresholds.dy && ['MM', round(days / 30)] ||
                years === 1 && ['y'] || ['yy', years];
        args[2] = withoutSuffix;
        args[3] = milliseconds > 0;
        args[4] = lang;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Week of Year
    ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add('d', daysToDayOfWeek);
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;

        d = d === 0 ? 7 : d;
        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f;

        if (input === null || (format === undefined && input === '')) {
            return moment.invalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = getLangDefinition().preparse(input);
        }

        if (moment.isMoment(input)) {
            config = cloneMoment(input);

            config._d = new Date(+input._d);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        return new Moment(config);
    }

    moment = function (input, format, lang, strict) {
        var c;

        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = lang;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();

        return makeMoment(c);
    };

    moment.suppressDeprecationWarnings = false;

    moment.createFromInputFallback = deprecate(
            "moment construction falls back to js Date. This is " +
            "discouraged and will be removed in upcoming major " +
            "release. Please refer to " +
            "https://github.com/moment/moment/issues/1407 for more info.",
            function (config) {
        config._d = new Date(config._i);
    });

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return moment();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    moment.min = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    };

    moment.max = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    };

    // creating with utc
    moment.utc = function (input, format, lang, strict) {
        var c;

        if (typeof(lang) === "boolean") {
            strict = lang;
            lang = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = lang;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return makeMoment(c).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            parseIso;

        if (moment.isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === "-") ? -1 : 1;
            parseIso = function (inp) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            };
            duration = {
                y: parseIso(match[2]),
                M: parseIso(match[3]),
                d: parseIso(match[4]),
                h: parseIso(match[5]),
                m: parseIso(match[6]),
                s: parseIso(match[7]),
                w: parseIso(match[8])
            };
        }

        ret = new Duration(duration);

        if (moment.isDuration(input) && input.hasOwnProperty('_lang')) {
            ret._lang = input._lang;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // constant that refers to the ISO standard
    moment.ISO_8601 = function () {};

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    moment.momentProperties = momentProperties;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () {};

    // This function allows you to set a threshold for relative time strings
    moment.relativeTimeThreshold = function(threshold, limit) {
      if (relativeTimeThresholds[threshold] === undefined) {
        return false;
      }
      relativeTimeThresholds[threshold] = limit;
      return true;
    };

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    moment.lang = function (key, values) {
        var r;
        if (!key) {
            return moment.fn._lang._abbr;
        }
        if (values) {
            loadLang(normalizeLanguage(key), values);
        } else if (values === null) {
            unloadLang(key);
            key = 'en';
        } else if (!languages[key]) {
            getLangDefinition(key);
        }
        r = moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);
        return r._abbr;
    };

    // returns language data
    moment.langData = function (key) {
        if (key && key._lang && key._lang._abbr) {
            key = key._lang._abbr;
        }
        return getLangDefinition(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null &&  obj.hasOwnProperty('_isAMomentObject'));
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function () {
        return moment.apply(null, arguments).parseZone();
    };

    moment.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    /************************************
        Moment Prototype
    ************************************/


    extend(moment.fn = Moment.prototype, {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d + ((this._offset || 0) * 60000);
        },

        unix : function () {
            return Math.floor(+this / 1000);
        },

        toString : function () {
            return this.clone().lang('en').format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
        },

        toDate : function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString : function () {
            var m = moment(this).utc();
            if (0 < m.year() && m.year() <= 9999) {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            } else {
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid : function () {
            return isValid(this);
        },

        isDSTShifted : function () {

            if (this._a) {
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }

            return false;
        },

        parsingFlags : function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc : function () {
            return this.zone(0);
        },

        local : function () {
            this.zone(0);
            this._isUTC = false;
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.lang().postformat(output);
        },

        add : function (input, val) {
            var dur;
            // switch args to support add('s', 1) and add(1, 's')
            if (typeof input === 'string' && typeof val === 'string') {
                dur = moment.duration(isNaN(+val) ? +input : +val, isNaN(+val) ? val : input);
            } else if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, 1);
            return this;
        },

        subtract : function (input, val) {
            var dur;
            // switch args to support subtract('s', 1) and subtract(1, 's')
            if (typeof input === 'string' && typeof val === 'string') {
                dur = moment.duration(isNaN(+val) ? +input : +val, isNaN(+val) ? val : input);
            } else if (typeof input === 'string') {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, -1);
            return this;
        },

        diff : function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (this.zone() - that.zone()) * 6e4,
                diff, output;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month') {
                // average number of days in the months in the given dates
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                // difference in months
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                // adjust by taking difference in days, average number of days
                // and dst in the given months.
                output += ((this - moment(this).startOf('month')) -
                        (that - moment(that).startOf('month'))) / diff;
                // same as above but with zones, to negate all dst
                output -= ((this.zone() - moment(this).startOf('month').zone()) -
                        (that.zone() - moment(that).startOf('month').zone())) * 6e4 / diff;
                if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = (this - that);
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function (time) {
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're zone'd or not.
            var now = time || moment(),
                sod = makeAs(now, this).startOf('day'),
                diff = this.diff(sod, 'days', true),
                format = diff < -6 ? 'sameElse' :
                    diff < -1 ? 'lastWeek' :
                    diff < 0 ? 'lastDay' :
                    diff < 1 ? 'sameDay' :
                    diff < 2 ? 'nextDay' :
                    diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.lang().calendar(format, this));
        },

        isLeapYear : function () {
            return isLeapYear(this.year());
        },

        isDST : function () {
            return (this.zone() < this.clone().month(0).zone() ||
                this.zone() < this.clone().month(5).zone());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.lang());
                return this.add({ d : input - day });
            } else {
                return day;
            }
        },

        month : makeAccessor('Month', true),

        startOf: function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            } else if (units === 'isoWeek') {
                this.isoWeekday(1);
            }

            // quarters are also special
            if (units === 'quarter') {
                this.month(Math.floor(this.month() / 3) * 3);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            return this.startOf(units).add((units === 'isoWeek' ? 'week' : units), 1).subtract('ms', 1);
        },

        isAfter: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) > +moment(input).startOf(units);
        },

        isBefore: function (input, units) {
            units = typeof units !== 'undefined' ? units : 'millisecond';
            return +this.clone().startOf(units) < +moment(input).startOf(units);
        },

        isSame: function (input, units) {
            units = units || 'ms';
            return +this.clone().startOf(units) === +makeAs(input, this).startOf(units);
        },

        min: deprecate(
                 "moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",
                 function (other) {
                     other = moment.apply(null, arguments);
                     return other < this ? this : other;
                 }
         ),

        max: deprecate(
                "moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",
                function (other) {
                    other = moment.apply(null, arguments);
                    return other > this ? this : other;
                }
        ),

        // keepTime = true means only change the timezone, without affecting
        // the local hour. So 5:31:26 +0300 --[zone(2, true)]--> 5:31:26 +0200
        // It is possible that 5:31:26 doesn't exist int zone +0200, so we
        // adjust the time as needed, to be valid.
        //
        // Keeping the time actually adds/subtracts (one hour)
        // from the actual represented time. That is why we call updateOffset
        // a second time. In case it wants us to change the offset again
        // _changeInProgress == true case, then we have to adjust, because
        // there is no such time in the given timezone.
        zone : function (input, keepTime) {
            var offset = this._offset || 0;
            if (input != null) {
                if (typeof input === "string") {
                    input = timezoneMinutesFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                this._offset = input;
                this._isUTC = true;
                if (offset !== input) {
                    if (!keepTime || this._changeInProgress) {
                        addOrSubtractDurationFromMoment(this,
                                moment.duration(offset - input, 'm'), 1, false);
                    } else if (!this._changeInProgress) {
                        this._changeInProgress = true;
                        moment.updateOffset(this, true);
                        this._changeInProgress = null;
                    }
                }
            } else {
                return this._isUTC ? offset : this._d.getTimezoneOffset();
            }
            return this;
        },

        zoneAbbr : function () {
            return this._isUTC ? "UTC" : "";
        },

        zoneName : function () {
            return this._isUTC ? "Coordinated Universal Time" : "";
        },

        parseZone : function () {
            if (this._tzm) {
                this.zone(this._tzm);
            } else if (typeof this._i === 'string') {
                this.zone(this._i);
            }
            return this;
        },

        hasAlignedHourOffset : function (input) {
            if (!input) {
                input = 0;
            }
            else {
                input = moment(input).zone();
            }

            return (this.zone() - input) % 60 === 0;
        },

        daysInMonth : function () {
            return daysInMonth(this.year(), this.month());
        },

        dayOfYear : function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add("d", (input - dayOfYear));
        },

        quarter : function (input) {
            return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
        },

        weekYear : function (input) {
            var year = weekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).year;
            return input == null ? year : this.add("y", (input - year));
        },

        isoWeekYear : function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add("y", (input - year));
        },

        week : function (input) {
            var week = this.lang().week(this);
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        isoWeek : function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add("d", (input - week) * 7);
        },

        weekday : function (input) {
            var weekday = (this.day() + 7 - this.lang()._week.dow) % 7;
            return input == null ? weekday : this.add("d", input - weekday);
        },

        isoWeekday : function (input) {
            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },

        isoWeeksInYear : function () {
            return weeksInYear(this.year(), 1, 4);
        },

        weeksInYear : function () {
            var weekInfo = this._lang._week;
            return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set : function (units, value) {
            units = normalizeUnits(units);
            if (typeof this[units] === 'function') {
                this[units](value);
            }
            return this;
        },

        // If passed a language key, it will set the language for this
        // instance.  Otherwise, it will return the language configuration
        // variables for this instance.
        lang : function (key) {
            if (key === undefined) {
                return this._lang;
            } else {
                this._lang = getLangDefinition(key);
                return this;
            }
        }
    });

    function rawMonthSetter(mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.lang().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(),
                daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function rawGetter(mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function rawSetter(mom, unit, value) {
        if (unit === 'Month') {
            return rawMonthSetter(mom, value);
        } else {
            return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    function makeAccessor(unit, keepTime) {
        return function (value) {
            if (value != null) {
                rawSetter(this, unit, value);
                moment.updateOffset(this, keepTime);
                return this;
            } else {
                return rawGetter(this, unit);
            }
        };
    }

    moment.fn.millisecond = moment.fn.milliseconds = makeAccessor('Milliseconds', false);
    moment.fn.second = moment.fn.seconds = makeAccessor('Seconds', false);
    moment.fn.minute = moment.fn.minutes = makeAccessor('Minutes', false);
    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    moment.fn.hour = moment.fn.hours = makeAccessor('Hours', true);
    // moment.fn.month is defined separately
    moment.fn.date = makeAccessor('Date', true);
    moment.fn.dates = deprecate("dates accessor is deprecated. Use date instead.", makeAccessor('Date', true));
    moment.fn.year = makeAccessor('FullYear', true);
    moment.fn.years = deprecate("years accessor is deprecated. Use year instead.", makeAccessor('FullYear', true));

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;
    moment.fn.quarters = moment.fn.quarter;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    /************************************
        Duration Prototype
    ************************************/


    extend(moment.duration.fn = Duration.prototype, {

        _bubble : function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years;

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absRound(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;

            hours = absRound(minutes / 60);
            data.hours = hours % 24;

            days += absRound(hours / 24);
            data.days = days % 30;

            months += absRound(days / 30);
            data.months = months % 12;

            years = absRound(months / 12);
            data.years = years;
        },

        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
              this._days * 864e5 +
              (this._months % 12) * 2592e6 +
              toInt(this._months / 12) * 31536e6;
        },

        humanize : function (withSuffix) {
            var difference = +this,
                output = relativeTime(difference, !withSuffix, this.lang());

            if (withSuffix) {
                output = this.lang().pastFuture(difference, output);
            }

            return this.lang().postformat(output);
        },

        add : function (input, val) {
            // supports only 2.0-style add(1, 's') or add(moment)
            var dur = moment.duration(input, val);

            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;

            this._bubble();

            return this;
        },

        subtract : function (input, val) {
            var dur = moment.duration(input, val);

            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;

            this._bubble();

            return this;
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as : function (units) {
            units = normalizeUnits(units);
            return this['as' + units.charAt(0).toUpperCase() + units.slice(1) + 's']();
        },

        lang : moment.fn.lang,

        toIsoString : function () {
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            var years = Math.abs(this.years()),
                months = Math.abs(this.months()),
                days = Math.abs(this.days()),
                hours = Math.abs(this.hours()),
                minutes = Math.abs(this.minutes()),
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);

            if (!this.asSeconds()) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            return (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (years ? years + 'Y' : '') +
                (months ? months + 'M' : '') +
                (days ? days + 'D' : '') +
                ((hours || minutes || seconds) ? 'T' : '') +
                (hours ? hours + 'H' : '') +
                (minutes ? minutes + 'M' : '') +
                (seconds ? seconds + 'S' : '');
        }
    });

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    function makeDurationAsGetter(name, factor) {
        moment.duration.fn['as' + name] = function () {
            return +this / factor;
        };
    }

    for (i in unitMillisecondFactors) {
        if (unitMillisecondFactors.hasOwnProperty(i)) {
            makeDurationAsGetter(i, unitMillisecondFactors[i]);
            makeDurationGetter(i.toLowerCase());
        }
    }

    makeDurationAsGetter('Weeks', 6048e5);
    moment.duration.fn.asMonths = function () {
        return (+this - this.years() * 31536e6) / 2592e6 + this.years() * 12;
    };


    /************************************
        Default Lang
    ************************************/


    // Set default language, other languages will inherit from English.
    moment.lang('en', {
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    /* EMBED_LANGUAGES */

    /************************************
        Exposing Moment
    ************************************/

    function makeGlobal(shouldDeprecate) {
        /*global ender:false */
        if (typeof ender !== 'undefined') {
            return;
        }
        oldGlobalMoment = globalScope.moment;
        if (shouldDeprecate) {
            globalScope.moment = deprecate(
                    "Accessing Moment through the global scope is " +
                    "deprecated, and will be removed in an upcoming " +
                    "release.",
                    moment);
        } else {
            globalScope.moment = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    } else if (typeof define === "function" && define.amd) {
        define("moment", function (require, exports, module) {
            if (module.config && module.config() && module.config().noGlobal === true) {
                // release the global variable
                globalScope.moment = oldGlobalMoment;
            }

            return moment;
        });
        makeGlobal(true);
    } else {
        makeGlobal();
    }
}).call(this);

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],8:[function(require,module,exports){
//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    any(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function(value, index, list) {
      return !predicate.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    var result = -Infinity, lastComputed = -Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed > lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    var result = Infinity, lastComputed = Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed < lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return value;
    return _.property(value);
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(array, predicate) {
    var pass = [], fail = [];
    each(array, function(elem) {
      (predicate(elem) ? pass : fail).push(elem);
    });
    return [pass, fail];
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.contains(other, item);
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function () {
      return value;
    };
  };

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    return function(obj) {
      if (obj === attrs) return true; //avoid comparing an object to itself.
      for (var key in attrs) {
        if (attrs[key] !== obj[key])
          return false;
      }
      return true;
    }
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() { return new Date().getTime(); };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);

},{}]},{},[6])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9tbnQvc3RvcmFnZS9fa2l0L0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcHZfc3lzX2Rldi9saWIvay9rLmpzIiwiL21udC9zdG9yYWdlL19raXQvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wdl9zeXNfZGV2L2xpYi9rL2tfRE9NLmpzIiwiL21udC9zdG9yYWdlL19raXQvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wdl9zeXNfZGV2L2xpYi9rL2tfRE9NX2V4dHJhLmpzIiwiL21udC9zdG9yYWdlL19raXQvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wdl9zeXNfZGV2L2xpYi9rL2tfZGF0YS5qcyIsIi9tbnQvc3RvcmFnZS9fa2l0L0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcHZfc3lzX2Rldi9saWIvc3ZnLmpzIiwiL21udC9zdG9yYWdlL19raXQvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wdl9zeXNfZGV2L21haW4uanMiLCIvbW50L3N0b3JhZ2UvX2tpdC9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3B2X3N5c19kZXYvbm9kZV9tb2R1bGVzL21vbWVudC9tb21lbnQuanMiLCIvbW50L3N0b3JhZ2UvX2tpdC9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3B2X3N5c19kZXYvbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvdW5kZXJzY29yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdnFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcmlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gVGhpcyBpcyB0aGUgayBqYXZhc2NyaXB0IGxpYnJhcnlcclxuLy8gYSBjb2xsZWN0aW9uIG9mIGZ1bmN0aW9ucyB1c2VkIGJ5IGtzaG93YWx0ZXJcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuXHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIE1pc2MuIHZhcmlhYmxlcyAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbi8vIGxvZyBzaG9ydGN1dFxyXG52YXIgbG9nID0gY29uc29sZS5sb2cuYmluZChjb25zb2xlKVxyXG52YXIgbG9nT2JqID0gZnVuY3Rpb24ob2JqKXtcclxuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KG9iaikpXHJcbn1cclxudmFyIGxvZ09iakZ1bGwgPSBmdW5jdGlvbihvYmope1xyXG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkob2JqLCBudWxsLCA0KSlcclxufVxyXG5cclxuLy8gfiBwYWdlIGxvYWQgdGltZVxyXG52YXIgYm9vdF90aW1lID0gbW9tZW50KClcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBTdGFydCBvZiBsaWJhcnkgb2JqZWN0ICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG52YXIgayA9IHt9XHJcblxyXG5rLnRlc3QgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIHggPSBib290X3RpbWVcclxuICAgIHJldHVybiB4XHJcbn1cclxuXHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEphdmFzcmlwdCBmdW5jdGlvbnMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG5cclxuay5vYmpfZXh0ZW5kID0gZnVuY3Rpb24ob2JqLCBwcm9wcykge1xyXG4gICAgZm9yKHZhciBwcm9wIGluIHByb3BzKSB7IFxyXG4gICAgICAgIGlmKHByb3BzLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgICAgIG9ialtwcm9wXSA9IHByb3BzW3Byb3BdXHJcbiAgICAgICAgfSBcclxuICAgIH0gXHJcbn1cclxuXHJcbmsub2JqX3JlbmFtZSA9IGZ1bmN0aW9uKG9iaiwgb2xkX25hbWUsIG5ld19uYW1lKXtcclxuICAgIC8vIENoZWNrIGZvciB0aGUgb2xkIHByb3BlcnR5IG5hbWUgdG8gYXZvaWQgYSBSZWZlcmVuY2VFcnJvciBpbiBzdHJpY3QgbW9kZS5cclxuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkob2xkX25hbWUpKSB7XHJcbiAgICAgICAgb2JqW25ld19uYW1lXSA9IG9ialtvbGRfbmFtZV1cclxuICAgICAgICBkZWxldGUgb2JqW29sZF9uYW1lXVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9ialxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIE1pc2MgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG4vLyBodHRwOi8vY3NzLXRyaWNrcy5jb20vc25pcHBldHMvamF2YXNjcmlwdC9nZXQtdXJsLXZhcmlhYmxlcy9cclxuay5nZXRRdWVyeVZhcmlhYmxlID0gZnVuY3Rpb24odmFyaWFibGUpIHtcclxuICAgICAgIHZhciBxdWVyeSA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyaW5nKDEpXHJcbiAgICAgICB2YXIgdmFycyA9IHF1ZXJ5LnNwbGl0KFwiJlwiKVxyXG4gICAgICAgZm9yICh2YXIgaT0wO2k8dmFycy5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgICAgICAgIHZhciBwYWlyID0gdmFyc1tpXS5zcGxpdChcIj1cIilcclxuICAgICAgICAgICAgICAgaWYocGFpclswXSA9PSB2YXJpYWJsZSl7XHJcbiAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFpclsxXVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4oZmFsc2UpXHJcbn1cclxuXHJcbmsuc3RyX3JlcGVhdCA9IGZ1bmN0aW9uKHN0cmluZywgY291bnQpIHtcclxuICAgIGlmIChjb3VudCA8IDEpIHJldHVybiAnJ1xyXG4gICAgdmFyIHJlc3VsdCA9ICcnIFxyXG4gICAgdmFyIHBhdHRlcm4gPSBzdHJpbmcudmFsdWVPZigpXHJcbiAgICB3aGlsZSAoY291bnQgPiAwKSB7XHJcbiAgICAgICAgaWYgKGNvdW50ICYgMSkgcmVzdWx0ICs9IHBhdHRlcm5cclxuICAgICAgICBjb3VudCA+Pj0gMSBcclxuICAgICAgICBwYXR0ZXJuICs9IHBhdHRlcm5cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHRcclxufVxyXG5cclxuXHJcbmsub2JqX2lkX2FycmF5ID0gZnVuY3Rpb24oIG9iamVjdCApIHtcclxuICAgIGlmKCBvYmplY3QgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICB2YXIgYSA9IFtdO1xyXG4gICAgICAgIGZvciggdmFyIGlkIGluIG9iamVjdCApIHtcclxuICAgICAgICAgICAgaWYoIG9iamVjdC5oYXNPd25Qcm9wZXJ0eShpZCkgKSAge1xyXG4gICAgICAgICAgICAgICAgYS5wdXNoKGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBNYXRoLCBudW1iZXJzIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuLypcclxuICogIG5vcm1SYW5kOiByZXR1cm5zIG5vcm1hbGx5IGRpc3RyaWJ1dGVkIHJhbmRvbSBudW1iZXJzXHJcbiAqICBodHRwOi8vbWVtb3J5LnBzeWNoLm11bi5jYS90ZWNoL3NuaXBwZXRzL3JhbmRvbV9ub3JtYWwvXHJcbiAqL1xyXG5rLm5vcm1SYW5kID0gZnVuY3Rpb24obXUsIHNpZ21hKSB7XHJcbiAgICB2YXIgeDEsIHgyLCByYWQ7XHJcblxyXG4gICAgZG8ge1xyXG4gICAgICAgIHgxID0gMiAqIE1hdGgucmFuZG9tKCkgLSAxO1xyXG4gICAgICAgIHgyID0gMiAqIE1hdGgucmFuZG9tKCkgLSAxO1xyXG4gICAgICAgIHJhZCA9IHgxICogeDEgKyB4MiAqIHgyO1xyXG4gICAgfSB3aGlsZShyYWQgPj0gMSB8fCByYWQgPT09IDApO1xyXG5cclxuICAgIHZhciBjID0gTWF0aC5zcXJ0KC0yICogTWF0aC5sb2cocmFkKSAvIHJhZCk7XHJcbiAgICB2YXIgbiA9IHgxICogYztcclxuICAgIHJldHVybiAobiAqIG11KSArIHNpZ21hO1xyXG59XHJcblxyXG5rLnBhZF96ZXJvID0gZnVuY3Rpb24obnVtLCBzaXplKXtcclxuICAgIHZhciBzID0gJzAwMDAwMDAwMCcgKyBudW1cclxuICAgIHJldHVybiBzLnN1YnN0cihzLmxlbmd0aC1zaXplKSAgICAgXHJcbn1cclxuXHJcblxyXG5rLnVwdGltZSA9IGZ1bmN0aW9uKGJvb3RfdGltZSl7XHJcbiAgICB2YXIgdXB0aW1lX3NlY29uZHNfdG90YWwgPSBtb21lbnQoKS5kaWZmKGJvb3RfdGltZSwgJ3NlY29uZHMnKVxyXG4gICAgdmFyIHVwdGltZV9ob3VycyA9IE1hdGguZmxvb3IoICB1cHRpbWVfc2Vjb25kc190b3RhbCAvKDYwKjYwKSApXHJcbiAgICB2YXIgbWludXRlc19sZWZ0ID0gdXB0aW1lX3NlY29uZHNfdG90YWwgJSg2MCo2MClcclxuICAgIHZhciB1cHRpbWVfbWludXRlcyA9IGsucGFkX3plcm8oIE1hdGguZmxvb3IoICBtaW51dGVzX2xlZnQgLzYwICksIDIgKVxyXG4gICAgdmFyIHVwdGltZV9zZWNvbmRzID0gay5wYWRfemVybyggKG1pbnV0ZXNfbGVmdCAlIDYwKSwgMiApXHJcbiAgICByZXR1cm4gdXB0aW1lX2hvdXJzICtcIjpcIisgdXB0aW1lX21pbnV0ZXMgK1wiOlwiKyB1cHRpbWVfc2Vjb25kc1xyXG59XHJcblxyXG5cclxuXHJcbmsubGFzdF9uX3ZhbHVlcyA9IGZ1bmN0aW9uKG4pe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuOiBuLFxyXG4gICAgICAgIGFycmF5OiBbXSxcclxuICAgICAgICBhZGQ6IGZ1bmN0aW9uKG5ld192YWx1ZSl7XHJcbiAgICAgICAgICAgIHRoaXMuYXJyYXkucHVzaChuZXdfdmFsdWUpXHJcbiAgICAgICAgICAgIGlmKCB0aGlzLmFycmF5Lmxlbmd0aCA+IG4gKSB0aGlzLmFycmF5LnNoaWZ0KClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlcclxuICAgICAgICB9XHJcbiAgICB9ICAgIFxyXG59XHJcblxyXG5rLmFycmF5TWF4ID0gZnVuY3Rpb24obnVtQXJyYXkpIHtcclxuICAgIHJldHVybiBNYXRoLm1heC5hcHBseShudWxsLCBudW1BcnJheSk7XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEFKQVggLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmsuQUpBWCA9IGZ1bmN0aW9uKHVybCwgY2FsbGJhY2spIHtcclxuICAgIHZhciB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgeG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoeG1saHR0cC5yZWFkeVN0YXRlID09IFhNTEh0dHBSZXF1ZXN0LkRPTkUgKSB7XHJcbiAgICAgICAgICAgIGlmKHhtbGh0dHAuc3RhdHVzID09IDIwMCl7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayh4bWxodHRwLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih4bWxodHRwLnN0YXR1cyA9PSA0MDApIHtcclxuICAgICAgICAgICAgICAgIGxvZygnVGhlcmUgd2FzIGFuIGVycm9yIDQwMCcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsb2coJ3NvbWV0aGluZyBlbHNlIG90aGVyIHRoYW4gMjAwIHdhcyByZXR1cm5lZCcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgeG1saHR0cC5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XHJcbiAgICB4bWxodHRwLnNlbmQoKTtcclxufVxyXG5cclxuay5wYXJzZUNTViA9IGZ1bmN0aW9uKGZpbGVfY29udGVudCkge1xyXG4gICAgdmFyIHIgPSBbXVxyXG4gICAgdmFyIGxpbmVzID0gZmlsZV9jb250ZW50LnNwbGl0KCdcXG4nKVxyXG4gICAgdmFyIGhlYWRlciA9IGxpbmVzLnNoaWZ0KCkuc3BsaXQoJywnKVxyXG4gICAgbG9nKGhlYWRlcilcclxuICAgIGZvcih2YXIgbCA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgbCA8IGxlbjsgbCsrKXtcclxuICAgICAgICB2YXIgbGluZSA9IGxpbmVzW2xdXHJcbiAgICAgICAgaWYobGluZS5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgdmFyIGxpbmVfb2JqID0ge31cclxuICAgICAgICAgICAgbGluZS5zcGxpdCgnLCcpLmZvckVhY2goZnVuY3Rpb24oaXRlbSxpKXtcclxuICAgICAgICAgICAgICAgIGxpbmVfb2JqW2hlYWRlcltpXV0gPSBpdGVtXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHIucHVzaChsaW5lX29iailcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4ocilcclxufVxyXG5cclxuay5nZXRDU1YgPSBmdW5jdGlvbihVUkwsIGNhbGxiYWNrKSB7XHJcbiAgICBrLkFKQVgoVVJMLCBrLnBhcnNlQ1NWKCkgKVxyXG59XHJcblxyXG4vKlxyXG4kLmFqYXhTZXR1cCAoe1xyXG4gICAgY2FjaGU6IGZhbHNlXHJcbn0pXHJcblxyXG5cclxuXHJcbmsuZ2V0X0pTT04gPSBmdW5jdGlvbihVUkwsIGNhbGxiYWNrLCBzdHJpbmcpIHtcclxuLy8gICAgdmFyIGZpbGVuYW1lID0gVVJMLnNwbGl0KCcvJykucG9wKClcclxuLy8gICAgbG9nKFVSTClcclxuICAgICQuZ2V0SlNPTiggVVJMLCBmdW5jdGlvbigganNvbiApIHtcclxuICAgICAgICBjYWxsYmFjayhqc29uLCBVUkwsIHN0cmluZylcclxuICAgIH0pLmZhaWwoZnVuY3Rpb24oanF4aHIsIHRleHRTdGF0dXMsIGVycm9yKSB7IFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCBcImVycm9yXCIsIHRleHRTdGF0dXMsIGVycm9yICApIFxyXG4gICAgfSlcclxufVxyXG5cclxuXHJcbmsubG9hZF9maWxlcyA9IGZ1bmN0aW9uKGZpbGVfbGlzdCwgY2FsbGJhY2spe1xyXG4gICAgdmFyIGQgPSB7fVxyXG5cclxuICAgIGZ1bmN0aW9uIGxvYWRfZmlsZShVUkwpe1xyXG4gICAgICAgIHZhciBmaWxlbmFtZSA9IFVSTC5zcGxpdCgnLycpLnBvcCgpXHJcbi8vICAgICAgICB2YXIgbmFtZSA9IGZpbGVuYW1lLnNwbGl0KCcuJylbMF1cclxuICAgICAgICAkLmdldEpTT04oIFVSTCwgZnVuY3Rpb24oIGpzb24gKSB7IC8vICwgdGV4dFN0YXR1cywganFYSFIpIHtcclxuICAgICAgICAgICAgYWRkX0pTT04oZmlsZW5hbWUsIGpzb24pXHJcbiAgICAgICAgfSkuZmFpbChmdW5jdGlvbihqcXhociwgdGV4dFN0YXR1cywgZXJyb3IpIHsgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcImVycm9yXCIsIHRleHRTdGF0dXMsIGVycm9yICApIFxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYWRkX0pTT04obmFtZSwganNvbil7XHJcbiAgICAgICAgZFtuYW1lXSA9IGpzb25cclxuICAgICAgICBpZihPYmplY3Qua2V5cyhkKS5sZW5ndGggPT0gZF9maWxlcy5sZW5ndGgpe1xyXG4gICAgICAgICAgICBjYWxsYmFjayhkKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IoIHZhciBrZXkgaW4gZmlsZV9saXN0KXtcclxuICAgICAgICB2YXIgVVJMID0gZmlsZV9saXN0W2tleV1cclxuICAgICAgICBsb2FkX2ZpbGUoVVJMKVxyXG4gICAgfVxyXG4gICAgXHJcbi8vICAgIGNhbGxiYWNrKGQpXHJcbn1cclxuXHJcbmsuZ2V0RmlsZSA9IGZ1bmN0aW9uKFVSTCwgY2FsbGJhY2spe1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IFVSTCxcclxuICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiggeGhyICkge1xyXG4gICAgICAgICAgICB4aHIub3ZlcnJpZGVNaW1lVHlwZSggXCJ0ZXh0L3BsYWluOyBjaGFyc2V0PXgtdXNlci1kZWZpbmVkXCIgKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgLmRvbmUoZnVuY3Rpb24oIGRhdGEgKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZGF0YSlcclxuICAgIH0pXHJcbiAgICAuZmFpbChmdW5jdGlvbihqcXhociwgdGV4dFN0YXR1cywgZXJyb3IpIHsgXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcImVycm9yXCIsIHRleHRTdGF0dXMsIGVycm9yICApIFxyXG4gICAgfSlcclxuICAgIFxyXG4gICAgXHJcbn1cclxuKi9cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gSFRNTCAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcblxyXG5cclxuay5zZXR1cF9ib2R5ID0gZnVuY3Rpb24odGl0bGUsIHNlY3Rpb25zKXtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGVcclxuICAgIHZhciBib2R5ID0gZG9jdW1lbnQuYm9keSBcclxuICAgIHZhciBzdGF0dXNfYmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgIHN0YXR1c19iYXIuaWQgPSAnc3RhdHVzJ1xyXG4gICAgc3RhdHVzX2Jhci5pbm5lckhUTUwgPSAnbG9hZGluZyBzdGF0dXMuLi4nXHJcbiAgICAvKlxyXG4gICAgdmFyIHRpdGxlX2hlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJylcclxuICAgIHRpdGxlX2hlYWRlci5pbm5lckhUTUwgPSB0aXRsZVxyXG4gICAgYm9keS5pbnNlcnRCZWZvcmUodGl0bGVfaGVhZGVyLCBib2R5LmZpcnN0Q2hpbGQpXHJcbiAgICAqL1xyXG4gICAgYm9keS5pbnNlcnRCZWZvcmUoc3RhdHVzX2JhciwgYm9keS5maXJzdENoaWxkKVxyXG4gICAgLypcclxuICAgIHZhciB0YWJzX2RpdiA9IGsubWFrZV90YWJzKHNlY3Rpb25zKVxyXG4gICAgJCgnYm9keScpLmFwcGVuZCh0YWJzX2RpdilcclxuICAgICQoICcudGFicycgKS50YWJzKHsgXHJcbiAgICAgICAgYWN0aXZhdGU6IGZ1bmN0aW9uKCBldmVudCwgdWkgKSB7XHJcbiAgICAgICAgICAgIHZhciBmdWxsX3RpdGxlID0gdGl0bGUgKyBcIiAvIFwiICsgdWkubmV3VGFiWzBdLnRleHRDb250ZW50XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnRpdGxlID0gZnVsbF90aXRsZVxyXG4gICAgICAgICAgICAkKCcjdGl0bGUnKS50ZXh0KGZ1bGxfdGl0bGUpXHJcbiAgICAgICAgICAgIC8vZHVtcChtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKSlcclxuICAgICAgICAgICAgJC5zcGFya2xpbmVfZGlzcGxheV92aXNpYmxlKClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgdmFyIHNlY3Rpb24gPSBrLmdldFF1ZXJ5VmFyaWFibGUoJ3NlYycpXHJcbiAgICBpZihzZWN0aW9uIGluIHNlY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gJCgnLnRhYnMgYVtocmVmPVwiIycrc2VjdGlvbisnXCJdJykucGFyZW50KCkuaW5kZXgoKVxyXG4gICAgICAgICQoXCIudGFic1wiKS50YWJzKFwib3B0aW9uXCIsIFwiYWN0aXZlXCIsIGluZGV4KVxyXG4gICAgfVxyXG4gICAgKi9cclxuXHJcbn1cclxuLypcclxuay5tYWtlX3RhYnMgPSBmdW5jdGlvbihzZWN0aW9uX29iail7XHJcbiAgICB2YXIgdGFic19kaXYgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCd0YWJzJylcclxuICAgIHZhciBoZWFkX2RpdiA9ICQoJzx1bD4nKS5hcHBlbmRUbyh0YWJzX2RpdilcclxuXHJcbiAgICBmb3IgKHZhciBpZCBpbiBzZWN0aW9uX29iail7XHJcbiAgICAgICAgdmFyIHRpdGxlID0gc2VjdGlvbl9vYmpbaWRdXHJcbiAgICAgICAgLy8oJzxsaT48YSBocmVmPVwiIycraWQrJ1wiPicrdGl0bGUrJzwvYT48L2xpPicpKVxyXG4gICAgICAgIC8vKCc8ZGl2IGlkPVwiJytpZCsnXCI+PC9kaXY+JykpXHJcbiAgICB9ICAgXHJcbiAgICBcclxuICAgIHJldHVybiB0YWJzX2RpdlxyXG59XHJcblxyXG4qL1xyXG5rLnVwZGF0ZV9zdGF0dXNfcGFnZSA9IGZ1bmN0aW9uKHN0YXR1c19pZCwgYm9vdF90aW1lKSB7XHJcbiAgICB2YXIgc3RhdHVzX2RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHN0YXR1c19pZClcclxuICAgIHN0YXR1c19kaXYuaW5uZXJIVE1MID0gJydcclxuXHJcbiAgICB2YXIgY2xvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgIGNsb2NrLmlubmVySFRNTCA9IG1vbWVudCgpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpXHJcblxyXG4gICAgdmFyIHVwdGltZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgdXB0aW1lLmlubmVySFRNTCA9ICdVcHRpbWU6ICcgKyBrLnVwdGltZShib290X3RpbWUpXHJcbiAgICBcclxuICAgIHN0YXR1c19kaXYuYXBwZW5kQ2hpbGQoY2xvY2spXHJcbiAgICBzdGF0dXNfZGl2LmlubmVySFRNTCArPSAnIHwgJ1xyXG4gICAgc3RhdHVzX2Rpdi5hcHBlbmRDaGlsZCh1cHRpbWUpXHJcbiAgICBzdGF0dXNfZGl2LmlubmVySFRNTCArPSAnIHwgJ1xyXG59XHJcblxyXG4vKlxyXG5rLm9ial9sb2cgPSBmdW5jdGlvbihvYmosIG9ial9uYW1lLCBtYXhfbGV2ZWwpe1xyXG4gICAgdmFyIGxldmVscyA9IGZ1bmN0aW9uKG9iaiwgbGV2ZWxfaW5kZW50LCBzdHIpe1xyXG4gICAgICAgIGZvcih2YXIgbmFtZSBpbiBvYmopIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBvYmpbbmFtZV1cclxuICAgICAgICAgICAgaWYoIGxldmVsX2luZGVudCA8PSBtYXhfbGV2ZWwgJiYgdHlwZW9mKGl0ZW0pID09ICdvYmplY3QnICkge1xyXG4gICAgICAgICAgICAgICAgc3RyICs9IFwiXFxuXCIgKyBrLnN0cl9yZXBlYXQoXCIgXCIsIGxldmVsX2luZGVudCoyKSArIG5hbWUgXHJcbiAgICAgICAgICAgICAgICBzdHIgPSBsZXZlbHMoaXRlbSwgbGV2ZWxfaW5kZW50KzEsIHN0ciApXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZih0eXBlb2YgaXRlbSAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgc3RyICs9IFwiXFxuXCIgKyBrLnN0cl9yZXBlYXQoXCIgXCIsIGxldmVsX2luZGVudCoyKSArIG5hbWUgKyBcIjogXCIgKyBpdGVtXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzdHIgKz0gXCJcXG5cIiArIGsuc3RyX3JlcGVhdChcIiBcIiwgbGV2ZWxfaW5kZW50KjIpICsgbmFtZSArIFwiOiA8ZnVuY3Rpb24+XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3RyXHJcbiAgICB9XHJcbiAgICB2YXIgbWF4X2xldmVsID0gbWF4X2xldmVsIHx8IDEwMFxyXG4gICAgbG9nKG9ial9uYW1lKVxyXG4gICAgdmFyIHN0ciA9ICctJyArIG9ial9uYW1lICsgJy0nXHJcbiAgICBtYXhfbGV2ZWwrK1xyXG4gICAgbGV2ZWxfaW5kZW50ID0gMlxyXG4gICAgc3RyID0gbGV2ZWxzKG9iaiwgbGV2ZWxfaW5kZW50LCBzdHIpXHJcbiAgICBsb2coc3RyKVxyXG59XHJcblxyXG5cclxuay5vYmpfdHJlZSA9IGZ1bmN0aW9uKG9iaiwgdGl0bGUpe1xyXG4gICAgLy8gdGFrZXMgYSBqYXZhc2NyaXB0LCBhbmQgcmV0dXJlbnMgYSBqcXVlcnkgRElWXHJcbiAgICB2YXIgb2JqX2RpdiA9ICQoJzxwcmU+JykgLy8uYWRkQ2xhc3MoJ2JveCcpXHJcbiAgICB2YXIgbGV2ZWxzID0gZnVuY3Rpb24ob2JqLCBsZXZlbF9pbmRlbnQpeyhsaW5lLCBjaXJjbGUsIHRleHQgKSBcclxuICAgICAgICB2YXIgbGlzdCA9IFtdXHJcbiAgICAgICAgdmFyIG9ial9sZW5ndGggPSAwXHJcbiAgICAgICAgZm9yKCB2YXIga2V5IGluIG9iaikge29ial9sZW5ndGgrK31cclxuICAgICAgICB2YXIgY291bnQgPSAwICAgICAgICAgIFxyXG4gICAgICAgIGZvcih2YXIga2V5IGluIG9iaikge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IG9ialtrZXldXHJcbiAgICAgICAgICAgIFxyXG4vLyAgICAgICAgICAgIHZhciBpbmRlbnRfc3RyaW5nID0gJyZuYnNwOyZuYnNwOyZuYnNwOyYjOTQ3NCcucmVwZWF0KGxldmVsKSArICcmbmJzcDsmbmJzcDsmbmJzcDsnXHJcbi8vICAgICAgICAgICAgaWYobGV2ZWxfaW5kZW50ID09PSAnJyApe1xyXG4vLyAgICAgICAgICAgICAgICBuZXh0X2xldmVsX2luZGVudCA9IGxldmVsX2luZGVudCArICcmbmJzcDsmbmJzcDsnIFxyXG4vLyAgICAgICAgICAgICAgICB0aGlzX2xldmVsX2luZGVudCA9IGxldmVsX2luZGVudCArICcmbmJzcDsmbmJzcDsnXHJcbi8vICAgICAgICAgICAgfSBlbHNlIFxyXG4gICAgICAgICAgICBpZihjb3VudCA9PSBvYmpfbGVuZ3RoLTEgKSB7ICAgLy8gSWYgbGFzdCBpdGVtLCBmaW5zaCB0cmVlIHNlY3Rpb25cclxuICAgICAgICAgICAgICAgIHZhciBuZXh0X2xldmVsX2luZGVudCA9IGxldmVsX2luZGVudCArICcmbmJzcDsmbmJzcDsnIFxyXG4gICAgICAgICAgICAgICAgdmFyIHRoaXNfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyYjOTQ5MjsmIzk0NzI7JyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNleyBcclxuICAgICAgICAgICAgICAgIHZhciBuZXh0X2xldmVsX2luZGVudCA9IGxldmVsX2luZGVudCArICcmbmJzcDsmIzk0NzQ7JyBcclxuICAgICAgICAgICAgICAgIHZhciB0aGlzX2xldmVsX2luZGVudCA9IGxldmVsX2luZGVudCArICcmbmJzcDsmIzk1MDA7JiM5NDcyOycgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiggdHlwZW9mKGl0ZW0pID09ICdvYmplY3QnICl7XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2goIHRoaXNfbGV2ZWxfaW5kZW50ICsga2V5KVxyXG4gICAgICAgICAgICAgICAgbGlzdCA9IGxpc3QuY29uY2F0KCBsZXZlbHMoaXRlbSwgbmV4dF9sZXZlbF9pbmRlbnQpIClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSBpdGVtLnRvU3RyaW5nKCkucmVwbGFjZSgvKFxcclxcbnxcXG58XFxyKS9nbSxcIiBcIikucmVwbGFjZSgvXFxzKy9nLFwiIFwiKSAvL2h0dHA6Ly93d3cudGV4dGZpeGVyLmNvbS90dXRvcmlhbHMvamF2YXNjcmlwdC1saW5lLWJyZWFrcy5waHBcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzX2xldmVsX2luZGVudCArIGtleStcIjogXCIrIGl0ZW0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4vLyAgICAgICAgICAgIGxvZyhrZXksbGV2ZWwpXHJcbiAgICAgICAgICAgIGNvdW50KytcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHZhciBsaXN0ID0gW3RpdGxlXS5jb25jYXQobGV2ZWxzKG9iaiwnJykpXHJcbiAgICBsaXN0LmZvckVhY2goIGZ1bmN0aW9uKGxpbmUsa2V5KXtcclxuICAgICAgICBvYmpfZGl2LmFwcGVuZChsaW5lICsgJzwvYnI+JylcclxuICAgIH0pXHJcbiAgICByZXR1cm4gb2JqX2RpdlxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG5rLm9ial9kaXNwbGF5ID0gZnVuY3Rpb24ob2JqKXtcclxuICAgIGZ1bmN0aW9uIGxldmVscyhvYmosbGV2ZWwpe1xyXG4gICAgLy8gICAgdmFyIHN1Ym9ial9kaXYgPSAkKCc8ZGl2PicpXHJcbiAgICAgICAgdmFyIHN1Ym9ial91bCA9ICQoJzx1bD4nKS5hZGRDbGFzcygndHJlZScpXHJcblxyXG4gICAgICAgIGZvcih2YXIga2V5IGluIG9iaikge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IG9ialtrZXldXHJcbiAgICAvLyAgICAgICAgbG9nKGtleSwgdHlwZW9mKGl0ZW0pKVxyXG4gICAgICAgICAgICBpZiggdHlwZW9mKGl0ZW0pID09ICdvYmplY3QnICl7XHJcbiAgICAvLyAgICAgICAgICAgICgnPGxpPicpLnRleHQoXCImbmJzcDtcIi5yZXBlYXQobGV2ZWwpICsga2V5KSlcclxuICAgICAgICAgICAgICAgICgnPGxpPicpLnRleHQoa2V5KSlcclxuICAgICAgICAgICAgICAgIHN1Ym9ial91bC5hcHBlbmQobGV2ZWxzKGl0ZW0sbGV2ZWwrMSkpXHJcbiAgICAvLyAgICAgICAgICAgIGxvZyhcIiZuYnNwO1wiLnJlcGVhdChsZXZlbCkgKyBrZXkpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgIHN1Ym9ial9kaXYuYXBwZW5kKCc8c3Bhbj4nKS50ZXh0KFwiJm5ic3A7XCIucmVwZWF0KGxldmVsKSArIGtleStcIjogXCIrIGl0ZW0pXHJcbiAgICAvLyAgICAgICAgICAgICgnPGxpPicpLnRleHQoXCImbmJzcDtcIi5yZXBlYXQobGV2ZWwpICsga2V5ICtcIjogXCIrIGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgKCc8bGk+JykudGV4dChrZXkgK1wiOiBcIisgaXRlbSkpXHJcbiAgICAvLyAgICAgICAgICAgIGxvZyhcIiZuYnNwO1wiLnJlcGVhdChsZXZlbCkgKyBrZXkrXCI6IFwiKyBpdGVtKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdWJvYmpfdWxcclxuICAgIH1cclxuICAgIC8vIHRha2VzIGEgamF2YXNjcmlwdCwgYW5kIHJldHVyZW5zIGEganF1ZXJ5IERJVlxyXG4gICAgdmFyIG9ial9kaXYgPSAkKCc8ZGl2PicpLy8uYWRkQ2xhc3MoJ2JveCcpXHJcbiAgICBcclxuICAgIG9ial9kaXYuYXBwZW5kKGxldmVscyhvYmosMCkpXHJcbiAgICByZXR1cm4gb2JqX2RpdlxyXG59XHJcblxyXG5rLnNob3dfb2JqID0gZnVuY3Rpb24oY29udGFpbmVyX2lkLCBvYmosIG5hbWUpe1xyXG4gICAgdmFyIGlkID0gJyMnICsgbmFtZVxyXG4gICAgaWYoICEgJChjb250YWluZXJfaWQpLmNoaWxkcmVuKGlkKS5sZW5ndGggKSB7IFxyXG4gICAgICAgICgnPGRpdj4nKS5hdHRyKCdpZCcsIG5hbWUpKSBcclxuICAgIH1cclxuICAgIHZhciBib3ggPSAkKGNvbnRhaW5lcl9pZCkuY2hpbGRyZW4oaWQpXHJcbiAgICBib3guZW1wdHkoKVxyXG4gICAgXHJcbiAgICB2YXIgb2JqX2RpdiA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ2JveCcpXHJcbiAgICBvYmpfZGl2LmFwcGVuZChrLm9ial90cmVlKG9iaiwgbmFtZSkpXHJcbiAgICBib3guYXBwZW5kKG9ial9kaXYpXHJcbiAgICBcclxufVxyXG5cclxuKi9cclxuay5sb2dfb2JqZWN0X3RyZWUgPSBmdW5jdGlvbihjb21wb25lbnRzKXtcclxuICAgIGZvciggdmFyIG1ha2UgaW4gY29tcG9uZW50cy5tb2R1bGVzICl7XHJcbiAgICAgICAgaWYoIGNvbXBvbmVudHMubW9kdWxlcy5oYXNPd25Qcm9wZXJ0eShtYWtlKSl7XHJcbiAgICAgICAgICAgIGZvciggdmFyIG1vZGVsIGluIGNvbXBvbmVudHMubW9kdWxlc1ttYWtlXSApe1xyXG4gICAgICAgICAgICAgICAgaWYoIGNvbXBvbmVudHMubW9kdWxlc1ttYWtlXS5oYXNPd25Qcm9wZXJ0eShtb2RlbCkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvID0gY29tcG9uZW50cy5tb2R1bGVzW21ha2VdW21vZGVsXVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhID0gW21ha2UsbW9kZWxdXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKCB2YXIgc3BlYyBpbiBvICl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBvLmhhc093blByb3BlcnR5KHNwZWMpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGEucHVzaChvW3NwZWNdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsb2coYS5qb2luKCcsJykpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBGU0VDIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuXHJcblxyXG5rLmNyMTAwMF9qc29uID0gZnVuY3Rpb24oanNvbil7XHJcbi8vICAgIHZhciBmaWVsZHMgPSBbXVxyXG4vLyAgICAkLmVhY2goanNvbi5oZWFkLmZpZWxkcywgZnVuY3Rpb24oa2V5LCBmaWVsZCkge1xyXG4vLyAgICAgICAgZmllbGRzLnB1c2goZmllbGQubmFtZSlcclxuLy8gICAgfSlcclxuLy8gICAgdmFyIGRhdGEgPSBfLnppcChmaWVsZHMsIGpzb24uZGF0YVswXS52YWxzKVxyXG4vLyAgICBcclxuICAgIHZhciB0aW1lc3RhbXAgPSBqc29uLmRhdGFbMF0udGltZVxyXG4gICAgdmFyIGRhdGEgPSB7fVxyXG4gICAgZGF0YS5UaW1lc3RhbXAgPSBqc29uLmRhdGFbMF0udGltZVxyXG4gICAgZGF0YS5SZWNvcmROdW0gPSBqc29uLmRhdGFbMF0ubm9cclxuICAgIGZvcih2YXIgaSA9IDAsIGwgPSBqc29uLmhlYWQuZmllbGRzLmxlbmd0aDsgaSA8IGw7IGkrKyApe1xyXG4gICAgICAgIGRhdGFbanNvbi5oZWFkLmZpZWxkc1tpXS5uYW1lXSA9IGpzb24uZGF0YVswXS52YWxzW2ldXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiBkYXRhXHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEQzIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG5cclxuay5kMyA9IHt9XHJcblxyXG5rLmQzLmxpdmVfc3BhcmtsaW5lID0gZnVuY3Rpb24oaWQsIGhpc3RvcnkpIHtcclxuICAgIHZhciBkYXRhID0gaGlzdG9yeS5hcnJheVxyXG4gICAgdmFyIGxlbmd0aCA9IGhpc3RvcnkuYXJyYXkubGVuZ3RoXHJcbiAgICB2YXIgbiA9IGhpc3RvcnkublxyXG4gICAgLy9rLmQzLmxpdmVfc3BhcmtsaW5lID0gZnVuY3Rpb24oaWQsIHdpZHRoLCBoZWlnaHQsIGludGVycG9sYXRpb24sIGFuaW1hdGUsIHVwZGF0ZURlbGF5LCB0cmFuc2l0aW9uRGVsYXkpIHtcclxuICAgIC8vIGJhc2VkIG9uIGNvZGUgcG9zdGVkIGJ5IEJlbiBDaHJpc3RlbnNlbiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9iZW5qY2hyaXN0ZW5zZW4vMTE0ODM3NFxyXG4gICAgXHJcbiAgICB2YXIgd2lkdGggPSA0MDAsXHJcbiAgICAgICAgaGVpZ2h0ID0gNTAsXHJcbiAgICAgICAgaW50ZXJwb2xhdGlvbiA9ICdiYXNpcycsXHJcbiAgICAgICAgYW5pbWF0ZSA9IHRydWUsXHJcbiAgICAgICAgdXBkYXRlRGVsYXkgPSAxMDAwLFxyXG4gICAgICAgIHRyYW5zaXRpb25EZWxheSA9IDEwMDBcclxuICAgIFxyXG4gICAgLy8gWCBzY2FsZSB3aWxsIGZpdCB2YWx1ZXMgZnJvbSAwLTEwIHdpdGhpbiBwaXhlbHMgMC0xMDBcclxuICAgIC8vIHN0YXJ0aW5nIHBvaW50IGlzIC01IHNvIHRoZSBmaXJzdCB2YWx1ZSBkb2Vzbid0IHNob3cgYW5kIHNsaWRlcyBvZmYgdGhlIGVkZ2UgYXMgcGFydCBvZiB0aGUgdHJhbnNpdGlvblxyXG4gICAgdmFyIHggPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDU5XSkucmFuZ2UoWzAsIHdpZHRoXSk7IFxyXG4gICAgLy8gWSBzY2FsZSB3aWxsIGZpdCB2YWx1ZXMgZnJvbSAwLTEwIHdpdGhpbiBwaXhlbHMgMC0xMDBcclxuICAgIHZhciB5ID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFsyMCwgNDBdKS5yYW5nZShbaGVpZ2h0LCAwXSk7XHJcblxyXG4gICAgLy8gY3JlYXRlIGEgbGluZSBvYmplY3QgdGhhdCByZXByZXNlbnRzIHRoZSBTVk4gbGluZSB3ZSdyZSBjcmVhdGluZ1xyXG4gICAgdmFyIGxpbmUgPSBkMy5zdmcubGluZSgpXHJcbiAgICAgICAgLy8gYXNzaWduIHRoZSBYIGZ1bmN0aW9uIHRvIHBsb3Qgb3VyIGxpbmUgYXMgd2Ugd2lzaFxyXG4gICAgICAgIC54KGZ1bmN0aW9uKGQsaSkgeyBcclxuICAgICAgICAgICAgLy8gdmVyYm9zZSBsb2dnaW5nIHRvIHNob3cgd2hhdCdzIGFjdHVhbGx5IGJlaW5nIGRvbmVcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnUGxvdHRpbmcgWCB2YWx1ZSBmb3IgZGF0YSBwb2ludDogJyArIGQgKyAnIHVzaW5nIGluZGV4OiAnICsgaSArICcgdG8gYmUgYXQ6ICcgKyB4KGkpICsgJyB1c2luZyBvdXIgeFNjYWxlLicpO1xyXG4gICAgICAgICAgICAvLyByZXR1cm4gdGhlIFggY29vcmRpbmF0ZSB3aGVyZSB3ZSB3YW50IHRvIHBsb3QgdGhpcyBkYXRhcG9pbnRcclxuICAgICAgICAgICAgcmV0dXJuIHgoaSk7IFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnkoZnVuY3Rpb24oZCkgeyBcclxuICAgICAgICAgICAgLy8gdmVyYm9zZSBsb2dnaW5nIHRvIHNob3cgd2hhdCdzIGFjdHVhbGx5IGJlaW5nIGRvbmVcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnUGxvdHRpbmcgWSB2YWx1ZSBmb3IgZGF0YSBwb2ludDogJyArIGQgKyAnIHRvIGJlIGF0OiAnICsgeShkKSArIFwiIHVzaW5nIG91ciB5U2NhbGUuXCIpO1xyXG4gICAgICAgICAgICAvLyByZXR1cm4gdGhlIFkgY29vcmRpbmF0ZSB3aGVyZSB3ZSB3YW50IHRvIHBsb3QgdGhpcyBkYXRhcG9pbnRcclxuICAgICAgICAgICAgcmV0dXJuIHkoZCk7IFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmludGVycG9sYXRlKGludGVycG9sYXRpb24pXHJcblxyXG4gICAgLy8gSWYgc3ZnIGRvZXMgbm90IGV4aXN0LCBjcmVhdGUgaXRcclxuICAgIGlmKCAhIGQzLnNlbGVjdCgnIycraWQpLnNlbGVjdCgnc3ZnJylbMF1bMF0gKXtcclxuICAgICAgICAvLyBjcmVhdGUgYW4gU1ZHIGVsZW1lbnQgaW5zaWRlIHRoZSAjZ3JhcGggZGl2IHRoYXQgZmlsbHMgMTAwJSBvZiB0aGUgZGl2XHJcbiAgICAgICAgdmFyIGdyYXBoID0gZDMuc2VsZWN0KCcjJytpZCkuYXBwZW5kKFwic3ZnOnN2Z1wiKS5hdHRyKFwid2lkdGhcIiwgd2lkdGgpLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLy8gZGlzcGxheSB0aGUgbGluZSBieSBhcHBlbmRpbmcgYW4gc3ZnOnBhdGggZWxlbWVudCB3aXRoIHRoZSBkYXRhIGxpbmUgd2UgY3JlYXRlZCBhYm92ZVxyXG4vLyAgICAgICAgZ3JhcGguYXBwZW5kKFwic3ZnOnBhdGhcIikuYXR0cihcImRcIiwgbGluZShkYXRhKSk7XHJcbiAgICAgICAgLy8gb3IgaXQgY2FuIGJlIGRvbmUgbGlrZSB0aGlzXHJcbiAgICAgICAgZ3JhcGguc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKFtkYXRhXSkuZW50ZXIoKS5hcHBlbmQoXCJzdmc6cGF0aFwiKS5hdHRyKFwiZFwiLCBsaW5lKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdmFyIGdyYXBoID0gZDMuc2VsZWN0KCcjJytpZCsnIHN2ZycpXHJcbiAgICBsb2coIGxlbmd0aClcclxuICAgIC8vIHVwZGF0ZSB3aXRoIGFuaW1hdGlvblxyXG4gICAgZ3JhcGguc2VsZWN0QWxsKFwicGF0aFwiKVxyXG4gICAgICAgIC5kYXRhKFtkYXRhXSkgLy8gc2V0IHRoZSBuZXcgZGF0YVxyXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgeChuLWxlbmd0aCArMSkgKyBcIilcIikgLy8gc2V0IHRoZSB0cmFuc2Zvcm0gdG8gdGhlIHJpZ2h0IGJ5IHgoMSkgcGl4ZWxzICg2IGZvciB0aGUgc2NhbGUgd2UndmUgc2V0KSB0byBoaWRlIHRoZSBuZXcgdmFsdWVcclxuICAgICAgICAuYXR0cihcImRcIiwgbGluZSkgLy8gYXBwbHkgdGhlIG5ldyBkYXRhIHZhbHVlcyAuLi4gYnV0IHRoZSBuZXcgdmFsdWUgaXMgaGlkZGVuIGF0IHRoaXMgcG9pbnQgb2ZmIHRoZSByaWdodCBvZiB0aGUgY2FudmFzXHJcbiAgICAgICAgLnRyYW5zaXRpb24oKSAvLyBzdGFydCBhIHRyYW5zaXRpb24gdG8gYnJpbmcgdGhlIG5ldyB2YWx1ZSBpbnRvIHZpZXdcclxuICAgICAgICAuZWFzZShcImxpbmVhclwiKVxyXG4gICAgICAgIC5kdXJhdGlvbih0cmFuc2l0aW9uRGVsYXkpIC8vIGZvciB0aGlzIGRlbW8gd2Ugd2FudCBhIGNvbnRpbnVhbCBzbGlkZSBzbyBzZXQgdGhpcyB0byB0aGUgc2FtZSBhcyB0aGUgc2V0SW50ZXJ2YWwgYW1vdW50IGJlbG93XHJcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyB4KG4tbGVuZ3RoKSArIFwiKVwiKTsgLy8gYW5pbWF0ZSBhIHNsaWRlIHRvIHRoZSBsZWZ0IGJhY2sgdG8geCgwKSBwaXhlbHMgdG8gcmV2ZWFsIHRoZSBuZXcgdmFsdWVcclxuXHJcbiAgICAgICAgLyogdGhhbmtzIHRvICdiYXJyeW0nIGZvciBleGFtcGxlcyBvZiB0cmFuc2Zvcm06IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tLzExMzcxMzEgKi9cclxuLy8gICAgIGdyYXBoLmFwcGVuZChcInJlY3RcIilcclxuLy8gICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbi8vICAgICAgICAgIC5hdHRyKFwieVwiLCAwKVxyXG4vLyAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQpXHJcbi8vICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXHJcbi8vICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCAnI2YwMCcpXHJcbi8vICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCJub25lXCIpXHJcbi8vICAgICAgICAgIC5zdHlsZShcInN0cm9rZS13aWR0aFwiLCAnMXB4JylcclxuICAgICBcclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBFdmVudHMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5rLmUgPSB7fVxyXG5cclxuay51cHRpbWUgPSBmdW5jdGlvbihib290X3RpbWUpe1xyXG4gICAgdmFyIHVwdGltZV9zZWNvbmRzX3RvdGFsID0gbW9tZW50KCkuZGlmZihib290X3RpbWUsICdzZWNvbmRzJylcclxuICAgIHZhciB1cHRpbWVfaG91cnMgPSBNYXRoLmZsb29yKCAgdXB0aW1lX3NlY29uZHNfdG90YWwgLyg2MCo2MCkgKVxyXG4gICAgdmFyIG1pbnV0ZXNfbGVmdCA9IHVwdGltZV9zZWNvbmRzX3RvdGFsICUoNjAqNjApXHJcbiAgICB2YXIgdXB0aW1lX21pbnV0ZXMgPSBrLnBhZF96ZXJvKCBNYXRoLmZsb29yKCAgbWludXRlc19sZWZ0IC82MCApLCAyIClcclxuICAgIHZhciB1cHRpbWVfc2Vjb25kcyA9IGsucGFkX3plcm8oIChtaW51dGVzX2xlZnQgJSA2MCksIDIgKVxyXG4gICAgcmV0dXJuIHVwdGltZV9ob3VycyArXCI6XCIrIHVwdGltZV9taW51dGVzICtcIjpcIisgdXB0aW1lX3NlY29uZHNcclxufVxyXG5cclxuay5lLmFkZFRpbWVTaW5jZSA9IGZ1bmN0aW9uKGV2ZW50X2xpc3Qpe1xyXG4gICAgbG9nKG1vbWVudCgpLmZvcm1hdCgnWVlZWS1NTS1ERCcpKVxyXG4gICAgbG9nKG1vbWVudCgpLmZyb21Ob3coKSlcclxuICAgIGV2ZW50X2xpc3QuZm9yRWFjaChmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgdmFyIGRhdGVfYXJyYXkgPSBldmVudC5kYXRlLnNwbGl0KCctJykubWFwKE51bWJlcilcclxuICAgICAgICB2YXIgeWVhciA9IGRhdGVfYXJyYXlbMF1cclxuICAgICAgICB2YXIgbW9udGggPSBkYXRlX2FycmF5WzFdXHJcbiAgICAgICAgdmFyIGRheSA9IGRhdGVfYXJyYXlbMl1cclxuICAgICAgICB2YXIgdGhpc195ZWFyID0gbW9tZW50KCkueWVhcigpXHJcbiAgICAgICAgaWYobW9tZW50KCkuZGlmZihtb21lbnQoW3RoaXNfeWVhciwgbW9udGgtMSwgZGF5XSksICdkYXlzJykgPiAwKSB7dGhpc195ZWFyKyt9XHJcbiAgICAgICAgdmFyIGV2ZW50X21vbWVudCA9IG1vbWVudChldmVudC5kYXRlLCAnWVlZWS1NTS1ERCcpXHJcbiAgICAgICAgdmFyIGRheXNfYWdvID0gbW9tZW50KCkuZGlmZihldmVudF9tb21lbnQsICdkYXknKVxyXG4gICAgICAgIGV2ZW50LnRpbWVfc2luY2UgPSBldmVudF9tb21lbnQuZnJvbU5vdygpXHJcbiAgICAgICAgZXZlbnQueWVhcnNfYWdvID0gbW9tZW50KCkuZGlmZihldmVudF9tb21lbnQsICd5ZWFycycpXHJcbiAgICAgICAgZXZlbnQuZGF5c190aWxsX25leHQgPSAtbW9tZW50KCkuZGlmZihtb21lbnQoW3RoaXNfeWVhciwgbW9udGgtMSwgZGF5XSksICdkYXlzJylcclxuICAgIH0pXHJcbiAgICBldmVudF9saXN0LnNvcnQoZnVuY3Rpb24oYSxiKXtcclxuICAgICAgICByZXR1cm4gYS5kYXlzX3RpbGxfbmV4dCAtIGIuZGF5c190aWxsX25leHRcclxuICAgIH0pXHJcbiAgICByZXR1cm4gZXZlbnRfbGlzdFxyXG59IFxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIERpc3BsYXlzIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmsuZCA9IHt9XHJcblxyXG4vKlxyXG5rLmQgPSB7XHJcbiAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgdmFsdWU6IDAsXHJcbiAgICBcclxufVxyXG5cclxuay5kLnByb3RvdHlwZS5zZXRQZXIgPSBmdW5jdGlvbihwZXJjZW50KXtcclxuICAgIHRoaXMuYmFyLmNzcygnd2lkdGgnLCBwZXJjZW50KyclJylcclxufVxyXG4qL1xyXG5cclxuXHJcbi8qXHJcbmsuZC5iYXIgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGJhciA9IHt9XHJcblxyXG4gICAgYmFyLndpZHRoID0gMTAwXHJcbiAgICBiYXIud2lkdGhfdW5pdCA9ICclJyBcclxuICAgIGJhci5oZWlnaHQgPSAnOHB4JyAgICBcclxuXHJcbiAgICBsb2coYmFyLndpZHRoKyclJylcclxuICAgIGJhci5kaXYgPSAkKCc8ZGl2PicpLmNzcygnd2lkdGgnLCAnMCUnKVxyXG4gICAgYmFyLmVsZW1lbnQgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdwcm9ncmVzc2JhcicpLmNzcygnd2lkdGgnLCAxMDApXHJcbiAgICBiYXIuZWxlbWVudC5hcHBlbmQoYmFyLmRpdilcclxuXHJcbiAgICBiYXIuc2V0UGVyY2VudCA9IGZ1bmN0aW9uKHBlcmNlbnQpe1xyXG4gICAgICAgIHRoaXMud2lkdGggPSBwZXJjZW50XHJcbiAgICAgICAgdGhpcy53aWR0aF91bml0ID0gJyUnXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG4gICAgYmFyLnVwZGF0ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5kaXYuY3NzKCd3aWR0aCcsIHRoaXMud2lkdGgrdGhpcy53aWR0aF91bml0KVxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jc3MoJ2hlaWdodCcsIHRvU3RyaW5nKHRoaXMuaGVpZ2h0KSsncHgnKVxyXG4gICAgfSBcclxuICAgIHJldHVybiBiYXJcclxufVxyXG4qL1xyXG5cclxuXHJcbiIsIlxudmFyIGVsZW1fcHJvdG90eXBlID0ge1xuXG4gICAgaHRtbDogZnVuY3Rpb24oaHRtbCl7XG4gICAgICAgdGhpcy5lbGVtLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBhcHBlbmQ6IGZ1bmN0aW9uKHN1Yl9lbGVtZW50KXtcbiAgICAgICAgdGhpcy5lbGVtLmFwcGVuZENoaWxkKHN1Yl9lbGVtZW50LmVsZW0pOyBcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBhcHBlbmRUbzogZnVuY3Rpb24ocGFyZW50X2VsZW1lbnQpe1xuICAgICAgICBwYXJlbnRfZWxlbWVudC5hcHBlbmQodGhpcyk7IFxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGF0dHI6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlICl7XG4gICAgICAgIHZhciBhdHRyaWJ1dGVOYW1lO1xuICAgICAgICBpZiggbmFtZSA9PT0gJ2NsYXNzJyl7XG4gICAgICAgICAgICBhdHRyaWJ1dGVOYW1lID0gJ2NsYXNzTmFtZSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVOYW1lID0gbmFtZTsgXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtW2F0dHJpYnV0ZU5hbWVdID0gdmFsdWU7IFxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG5cblxufVxuXG52YXIgRWxlbSA9IGZ1bmN0aW9uKGVsZW1lbnQpe1xuICAgIHZhciBFID0gT2JqZWN0LmNyZWF0ZShlbGVtX3Byb3RvdHlwZSk7XG5cbiAgICBFLmVsZW0gPSBlbGVtZW50O1xuXG4gICAgcmV0dXJuIEU7XG5cbn1cblxudmFyICQgPSBmdW5jdGlvbihpbnB1dCl7XG4gICAgaWYoIHR5cGVvZiBpbnB1dCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgIC8vbG9nKCdpbnB1dCBuZWVkZWQnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiggaW5wdXQuc3Vic3RyKDAsMSkgPT09ICcjJyApIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbnB1dC5zdWJzdHIoMSkpO1xuICAgICAgICByZXR1cm4gRWxlbShlbGVtZW50KTtcbiAgICB9IGVsc2UgaWYoIGlucHV0LnN1YnN0cigwLDEpID09PSAnLicgKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5Q2xhc3NOYW1lKGlucHV0LnN1YnN0cigxKVswXSk7XG4gICAgICAgIHJldHVybiBFbGVtKGVsZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCBpbnB1dCA9PT0gJ3ZhbHVlJyApIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gVmFsdWUoKTsgXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfSBlbHNlIGlmKCBpbnB1dCA9PT0gJ3NlbGVjdG9yJyApIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gU2VsZWN0b3IoKTsgXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gRWxlbShlbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcblxuXG59XG4iLCJcbnZhciBzZWxlY3Rvcl9wcm90b3R5cGUgPSB7XG4gICAgY2hhbmdlOiBmdW5jdGlvbihuZXdfdmFsdWUpe1xuICAgICAgICBpZiggbmV3X3ZhbHVlICE9PSB1bmRlZmluZWQgKSB7IFxuICAgICAgICAgICAgdGhpcy5zZXRfdmFsdWUobmV3X3ZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV4cGFuZGVkID0gIXRoaXMuZXhwYW5kZWQ7XG4gICAgICAgIGlmKCB0aGlzLmdfdXBkYXRlICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMuZ191cGRhdGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlX29wdGlvbnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vVE9ETzogZmluZCB3YXkgdG8gZG8gdGhpcyBvdGhlciB0aGFuIGV2YWxcbiAgICAgICAgaWYoIHRoaXMub3B0aW9uc19yZWZlcmVuY2UgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIGV2YWwoICd0aGlzLm9wdGlvbnMgPSAnICsgdGhpcy5vcHRpb25zX3JlZmVyZW5jZSArIFwiO1wiICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMub3B0aW9ucyAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5lbGVtX29wdGlvbnMuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSxpZCl7XG4gICAgICAgICAgICAgICAgdmFyIG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcbiAgICAgICAgICAgICAgICBvLmhyZWYgPSAnIyc7XG4gICAgICAgICAgICAgICAgby5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlbGVjdG9yX29wdGlvbicpO1xuICAgICAgICAgICAgICAgIG8uaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgICAgIG8uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmNoYW5nZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbV9vcHRpb25zLmFwcGVuZENoaWxkKG8pO1xuXG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgIGlmKCAhICh0aGlzLm9wdGlvbnMuaW5kZXhPZih0aGlzLnZhbHVlKSsxKSApe1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0X3ZhbHVlKHRoaXMub3B0aW9uc1swXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXRfdmFsdWU6IGZ1bmN0aW9uKG5ld192YWx1ZSl7XG4gICAgICAgIGlmKCBuZXdfdmFsdWUgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBuZXdfdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmVsZW1fdmFsdWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgICAgICB0aGlzLmVsZW1fdmFsdWUuaHJlZiA9ICcjJztcbiAgICAgICAgICAgIHRoaXMuZWxlbV92YWx1ZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlbGVjdG9yJyk7XG4gICAgICAgICAgICB0aGlzLmVsZW1fdmFsdWUuaW5uZXJIVE1MID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMuZWxlbV92YWx1ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdGhhdC5sb2NhdGlvbiA9IHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgdGhhdC5jaGFuZ2UoKTtcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBzZXR0aW5nc1t0aGlzLnNldHRpbmddID0gdGhpcy52YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7ICAgIFxuICAgIH0sXG4gICAgc2V0X29wdGlvbnM6IGZ1bmN0aW9uKG9wdGlvbnNfcmVmZXJlbmNlKSB7XG4gICAgICAgIHRoaXMub3B0aW9uc19yZWZlcmVuY2UgPSBvcHRpb25zX3JlZmVyZW5jZTtcbiAgICAgICAgLy9UT0RPOiBmaW5kIHdheSB0byBkbyB0aGlzIG90aGVyIHRoYW4gZXZhbFxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldF9zZXR0aW5nOiBmdW5jdGlvbihuZXdfc2V0dGluZyl7XG4gICAgICAgIHRoaXMuc2V0dGluZyA9IG5ld19zZXR0aW5nO1xuICAgICAgICBpZiggc2V0dGluZ3NbdGhpcy5zZXR0aW5nXSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5zZXRfdmFsdWUoc2V0dGluZ3NbdGhpcy5zZXR0aW5nXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldF92YWx1ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0VXBkYXRlOiBmdW5jdGlvbih1cGRhdGVfZnVuY3Rpb24pe1xuICAgICAgICB0aGlzLmdfdXBkYXRlID0gdXBkYXRlX2Z1bmN0aW9uOyBcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy51cGRhdGVfb3B0aW9ucygpO1xuICAgICAgICB0aGlzLnVwZGF0ZV9lbGVtZW50cygpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHVwZGF0ZV9lbGVtZW50czogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHRoaXMuZXhwYW5kZWQpe1xuICAgICAgICAgICAgdGhpcy5lbGVtLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICAgICB0aGlzLmVsZW0uYXBwZW5kQ2hpbGQodGhpcy5lbGVtX29wdGlvbnMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtLmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICAgICB0aGlzLmVsZW0uYXBwZW5kQ2hpbGQodGhpcy5lbGVtX3ZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0sXG59XG5mb3IoIHZhciBpZCBpbiBlbGVtX3Byb3RvdHlwZSApIHtcbiAgICBpZiggZWxlbV9wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoaWQpICkge1xuICAgICAgICBzZWxlY3Rvcl9wcm90b3R5cGVbaWRdID0gZWxlbV9wcm90b3R5cGVbaWRdOyBcbiAgICB9XG59XG5cbnZhciBTZWxlY3RvciA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHMgPSBPYmplY3QuY3JlYXRlKHNlbGVjdG9yX3Byb3RvdHlwZSk7XG4gICAgcy50eXBlID0gJ3NlbGVjdG9yJztcbiAgICBzLmV4cGFuZGVkID0gZmFsc2U7XG4gICAgcy5lbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHMuZWxlbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlbGVjdG9yX21lbnUnKTtcblxuICAgIHMuZWxlbV9vcHRpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHMuZWxlbV92YWx1ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBzLmVsZW1fdmFsdWUuaW5uZXJIVE1MID0gJy0nO1xuICAgIFxuICAgIHNldHRpbmdzX3JlZ2lzdHJ5LnB1c2gocyk7XG4gICAgcmV0dXJuIHM7XG59O1xuXG5cblxuXG5cbnZhciB2YWx1ZV9wcm90b3R5cGUgPSB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbigpe1xuICAgICAgICBpZiggdGhpcy5nX3VwZGF0ZSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLmdfdXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMucmVmZXJlbmNlICl7XG4gICAgICAgICAgICBldmFsKCAndGhpcy52YWx1ZSA9ICcgKyB0aGlzLnJlZmVyZW5jZSArICc7JyApO1xuICAgICAgICB9ICAgIFxuICAgICAgICBpZiggaXNOYU4oTnVtYmVyKHRoaXMudmFsdWUpKSApe1xuICAgICAgICAgICAgdGhpcy5lbGVtLmlubmVySFRNTCA9IHRoaXMudmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW0uaW5uZXJIVE1MID0gTnVtYmVyKHRoaXMudmFsdWUpLnRvRml4ZWQoMyk7XG4gICAgICAgICAgICBpZiggdGhpcy5taW4gIT09IHVuZGVmaW5lZCAmJiB0aGlzLnZhbHVlIDw9IHRoaXMubWluICkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0cignY2xhc3MnLCAndmFsdWVPdXRPZlJhbmdlJylcbiAgICAgICAgICAgIH0gZWxzZSBpZiggdGhpcy5tYXggIT09IHVuZGVmaW5lZCAmJiB0aGlzLnZhbHVlID49IHRoaXMubWF4ICkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0cignY2xhc3MnLCAndmFsdWVPdXRPZlJhbmdlJylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyKCdjbGFzcycsICcnKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbihuZXdfdmFsdWUpIHtcbiAgICAgICAgaWYoIHR5cGVvZiBuZXdfdmFsdWUgIT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gbmV3X3ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0VXBkYXRlOiBmdW5jdGlvbih1cGRhdGVfZnVuY3Rpb24pe1xuICAgICAgICB0aGlzLmdfdXBkYXRlID0gdXBkYXRlX2Z1bmN0aW9uOyBcbiAgICB9LFxuICAgIHNldFJlZjogZnVuY3Rpb24ocmVmZXJlbmNlKXtcbiAgICAgICAgaWYoIHR5cGVvZiByZWZlcmVuY2UgIT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICB0aGlzLnJlZmVyZW5jZSA9IHJlZmVyZW5jZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldE1heDogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICB0aGlzLm1heCA9IHZhbHVlO1xuICAgICAgICB0aGlzLnVwZGF0ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXRNaW46IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgdGhpcy5taW4gPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG59XG5mb3IoIHZhciBpZCBpbiBlbGVtX3Byb3RvdHlwZSApIHtcbiAgICBpZiggZWxlbV9wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoaWQpICkge1xuICAgICAgICB2YWx1ZV9wcm90b3R5cGVbaWRdID0gZWxlbV9wcm90b3R5cGVbaWRdOyBcbiAgICB9XG59XG5cbmZ1bmN0aW9uIFZhbHVlKCkge1xuICAgIHZhciB2ID0gT2JqZWN0LmNyZWF0ZSh2YWx1ZV9wcm90b3R5cGUpO1xuICAgIHYudHlwZSA9ICd2YWx1ZSc7XG4gICAgdi5lbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXG4gICAgdi52YWx1ZSA9ICctJztcbiAgICB2LmlubmVySFRNTCA9IHYudmFsdWU7XG4gICAgdi5yZWZlcmVuY2UgPSBmYWxzZTtcblxuXG4gICAgdi51cGRhdGUoKTtcblxuICAgIHNldHRpbmdzX3JlZ2lzdHJ5LnB1c2godik7XG4gICAgcmV0dXJuIHY7XG59XG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIga2RiX3Byb3RvdHlwZSA9IHtcbiAgICBzZXRfZmllbGRzOiBmdW5jdGlvbihmaWVsZF9hcnJheSkge1xuICAgICAgICB2YXIgbGlzdDtcbiAgICAgICAgaWYoIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdzdHJpbmcnICkgeyAgLy8gZWFjaCBhcmd1bWVudCBpcyBhIGZpZWxkXG4gICAgICAgICAgICBsaXN0ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTsgLy9jb252ZXJ0IGFyZ3VtZW50cyB0byBhbiBhcnJheVxuICAgICAgICB9IGVsc2UgeyAvLyBhc3N1bWVkIGxpc3Qgb2YgZmllbGRzXG4gICAgICAgICAgICBsaXN0ID0gYXJndW1lbnRbMF07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZpZWxkcyA9IFtdXG4gICAgICAgIGxpc3QuZm9yRWFjaCggZnVuY3Rpb24oZmllbGQpIHtcbiAgICAgICAgICAgIHRoaXMuZmllbGRzLnB1c2goZmllbGQpIDtcbiAgICAgICAgfSx0aGlzKSBcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgYWRkOiBmdW5jdGlvbihlbnRyeSkge1xuICAgICAgICB2YXIgbGlzdDtcbiAgICAgICAgdmFyIG9iaiA9IHt9O1xuXG4gICAgICAgIGlmKCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZW50cnkpID09PSAnW29iamVjdCBBcnJheV0nICkgeyAvLyBpZiBsaXN0IGlzIHN1Ym1pdHRlZFxuICAgICAgICAgICAgbGlzdCA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgfSBlbHNlIGlmKCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZW50cnkpID09PSAnW29iamVjdCBPYmplY3RdJyApIHsgLy8gaWYgb2JqZWN0IGlzIHN1Ym1pdHRlZFxuICAgICAgICAgICAgb2JqID0gYXJndW1lbnRzWzBdO1xuICAgICAgICB9IGVsc2UgeyAgLy8gZWFjaCBhcmd1bWVudCBpcyBhIGZpZWxkOiBzdHJpbmcsIG51bWJlciwgZXRjLlxuICAgICAgICAgICAgbGlzdCA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7IC8vY29udmVydCBhcmd1bWVudHMgdG8gYW4gYXJyYXlcbiAgICAgICAgfVxuICAgICAgICBpZiggbGlzdCAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgbGlzdC5mb3JFYWNoKCBmdW5jdGlvbiggdmFsdWUsIGkgKSB7XG4gICAgICAgICAgICAgICAgb2JqW3RoaXMuZmllbGRzW2ldXSA9IHZhbHVlO1xuICAgICAgICAgICAgfSx0aGlzKSBcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdGhpcy5yb3dzLnB1c2gob2JqKTtcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIENTVjogZnVuY3Rpb24oc3RyaW5nKXtcbiAgICBcbiAgICBcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24oZmllbGQsIHZhbHVlKXtcbiAgICAgICAgLy92YXIgaCA9IHRoaXMuZmllbGRzLmluZGV4T2YoY29sdW1uKTtcbiAgICAgICAgLy9sb2coaCwgdGhpcy5maWVsZHNbaF0pXG4gICAgICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICAgICAgdGhpcy5yb3dzLmZvckVhY2goIGZ1bmN0aW9uKHJvdyxpZCl7XG4gICAgICAgICAgICBpZiggcm93W2ZpZWxkXSA9PT0gdmFsdWUgKXtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChyb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LHRoaXMpICAgIFxuICAgICAgICBsb2cob3V0cHV0KVxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0sXG4gICAgY29sdW1uOiBmdW5jdGlvbihmaWVsZCl7XG4gICAgICAgIHZhciBjb2x1bW4gPSBbXTtcbiAgICAgICAgdGhpcy5yb3dzLmZvckVhY2goIGZ1bmN0aW9uKHJvdyl7XG4gICAgICAgICAgICBjb2x1bW4ucHVzaCggcm93W2ZpZWxkXSApO1xuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgIH0sXG59XG5cblxuZnVuY3Rpb24gS0RCKCkge1xuICAgIHZhciBkID0gT2JqZWN0LmNyZWF0ZShrZGJfcHJvdG90eXBlKTtcbiAgICBcbiAgICBkLnJvd3MgPSBbXTtcblxuXG5cbiAgICByZXR1cm4gZDtcbn1cblxuXG5cblxuIiwiLyogc3ZnLmpzIDEuMC4wLXJjLjYtMS1nMTI4NmUzZCAtIHN2ZyBpbnZlbnRvciByZWdleCBkZWZhdWx0IGNvbG9yIGFycmF5IHBvaW50YXJyYXkgcGF0aGFycmF5IG51bWJlciB2aWV3Ym94IGJib3ggcmJveCBlbGVtZW50IHBhcmVudCBjb250YWluZXIgZnggcmVsYXRpdmUgZXZlbnQgZGVmcyBncm91cCBhcnJhbmdlIG1hc2sgY2xpcCBncmFkaWVudCBwYXR0ZXJuIGRvYyBzaGFwZSB1c2UgcmVjdCBlbGxpcHNlIGxpbmUgcG9seSBwYXRoIGltYWdlIHRleHQgdGV4dHBhdGggbmVzdGVkIGh5cGVybGluayBzdWdhciBzZXQgZGF0YSBtZW1vcnkgbG9hZGVyIGhlbHBlcnMgLSBzdmdqcy5jb20vbGljZW5zZSAqL1xuOyhmdW5jdGlvbigpIHtcblxuICB0aGlzLlNWRyA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICBpZiAoU1ZHLnN1cHBvcnRlZCkge1xuICAgICAgZWxlbWVudCA9IG5ldyBTVkcuRG9jKGVsZW1lbnQpXG4gIFxuICAgICAgaWYgKCFTVkcucGFyc2VyKVxuICAgICAgICBTVkcucHJlcGFyZShlbGVtZW50KVxuICBcbiAgICAgIHJldHVybiBlbGVtZW50XG4gICAgfVxuICB9XG4gIFxuICAvLyBEZWZhdWx0IG5hbWVzcGFjZXNcbiAgU1ZHLm5zICAgID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJ1xuICBTVkcueG1sbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nXG4gIFNWRy54bGluayA9ICdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJ1xuICBcbiAgLy8gRWxlbWVudCBpZCBzZXF1ZW5jZVxuICBTVkcuZGlkICA9IDEwMDBcbiAgXG4gIC8vIEdldCBuZXh0IG5hbWVkIGVsZW1lbnQgaWRcbiAgU1ZHLmVpZCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gJ1N2Z2pzJyArIG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnNsaWNlKDEpICsgKFNWRy5kaWQrKylcbiAgfVxuICBcbiAgLy8gTWV0aG9kIGZvciBlbGVtZW50IGNyZWF0aW9uXG4gIFNWRy5jcmVhdGUgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgLyogY3JlYXRlIGVsZW1lbnQgKi9cbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh0aGlzLm5zLCBuYW1lKVxuICAgIFxuICAgIC8qIGFwcGx5IHVuaXF1ZSBpZCAqL1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMuZWlkKG5hbWUpKVxuICAgIFxuICAgIHJldHVybiBlbGVtZW50XG4gIH1cbiAgXG4gIC8vIE1ldGhvZCBmb3IgZXh0ZW5kaW5nIG9iamVjdHNcbiAgU1ZHLmV4dGVuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBtb2R1bGVzLCBtZXRob2RzLCBrZXksIGlcbiAgICBcbiAgICAvKiBnZXQgbGlzdCBvZiBtb2R1bGVzICovXG4gICAgbW9kdWxlcyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxuICAgIFxuICAgIC8qIGdldCBvYmplY3Qgd2l0aCBleHRlbnNpb25zICovXG4gICAgbWV0aG9kcyA9IG1vZHVsZXMucG9wKClcbiAgICBcbiAgICBmb3IgKGkgPSBtb2R1bGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgaWYgKG1vZHVsZXNbaV0pXG4gICAgICAgIGZvciAoa2V5IGluIG1ldGhvZHMpXG4gICAgICAgICAgbW9kdWxlc1tpXS5wcm90b3R5cGVba2V5XSA9IG1ldGhvZHNba2V5XVxuICBcbiAgICAvKiBtYWtlIHN1cmUgU1ZHLlNldCBpbmhlcml0cyBhbnkgbmV3bHkgYWRkZWQgbWV0aG9kcyAqL1xuICAgIGlmIChTVkcuU2V0ICYmIFNWRy5TZXQuaW5oZXJpdClcbiAgICAgIFNWRy5TZXQuaW5oZXJpdCgpXG4gIH1cbiAgXG4gIC8vIE1ldGhvZCBmb3IgZ2V0dGluZyBhbiBlbGVtZW50IGJ5IGlkXG4gIFNWRy5nZXQgPSBmdW5jdGlvbihpZCkge1xuICAgIHZhciBub2RlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXG4gICAgaWYgKG5vZGUpIHJldHVybiBub2RlLmluc3RhbmNlXG4gIH1cbiAgXG4gIC8vIEluaXRpYWxpemUgcGFyc2luZyBlbGVtZW50XG4gIFNWRy5wcmVwYXJlID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgIC8qIHNlbGVjdCBkb2N1bWVudCBib2R5IGFuZCBjcmVhdGUgaW52aXNpYmxlIHN2ZyBlbGVtZW50ICovXG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdXG4gICAgICAsIGRyYXcgPSAoYm9keSA/IG5ldyBTVkcuRG9jKGJvZHkpIDogZWxlbWVudC5uZXN0ZWQoKSkuc2l6ZSgyLCAyKVxuICAgICAgLCBwYXRoID0gU1ZHLmNyZWF0ZSgncGF0aCcpXG4gIFxuICAgIC8qIGluc2VydCBwYXJzZXJzICovXG4gICAgZHJhdy5ub2RlLmFwcGVuZENoaWxkKHBhdGgpXG4gIFxuICAgIC8qIGNyZWF0ZSBwYXJzZXIgb2JqZWN0ICovXG4gICAgU1ZHLnBhcnNlciA9IHtcbiAgICAgIGJvZHk6IGJvZHkgfHwgZWxlbWVudC5wYXJlbnRcbiAgICAsIGRyYXc6IGRyYXcuc3R5bGUoJ29wYWNpdHk6MDtwb3NpdGlvbjpmaXhlZDtsZWZ0OjEwMCU7dG9wOjEwMCU7b3ZlcmZsb3c6aGlkZGVuJylcbiAgICAsIHBvbHk6IGRyYXcucG9seWxpbmUoKS5ub2RlXG4gICAgLCBwYXRoOiBwYXRoXG4gICAgfVxuICB9XG4gIFxuICAvLyBzdmcgc3VwcG9ydCB0ZXN0XG4gIFNWRy5zdXBwb3J0ZWQgPSAoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICEhIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyAmJlxuICAgICAgICAgICAhISBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoU1ZHLm5zLCdzdmcnKS5jcmVhdGVTVkdSZWN0XG4gIH0pKClcbiAgXG4gIGlmICghU1ZHLnN1cHBvcnRlZCkgcmV0dXJuIGZhbHNlXG5cbiAgU1ZHLmludmVudCA9IGZ1bmN0aW9uKGNvbmZpZykge1xuICBcdC8qIGNyZWF0ZSBlbGVtZW50IGluaXRpYWxpemVyICovXG4gIFx0dmFyIGluaXRpYWxpemVyID0gdHlwZW9mIGNvbmZpZy5jcmVhdGUgPT0gJ2Z1bmN0aW9uJyA/XG4gIFx0XHRjb25maWcuY3JlYXRlIDpcbiAgXHRcdGZ1bmN0aW9uKCkge1xuICBcdFx0XHR0aGlzLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgU1ZHLmNyZWF0ZShjb25maWcuY3JlYXRlKSlcbiAgXHRcdH1cbiAgXG4gIFx0LyogaW5oZXJpdCBwcm90b3R5cGUgKi9cbiAgXHRpZiAoY29uZmlnLmluaGVyaXQpXG4gIFx0XHRpbml0aWFsaXplci5wcm90b3R5cGUgPSBuZXcgY29uZmlnLmluaGVyaXRcbiAgXG4gIFx0LyogZXh0ZW5kIHdpdGggbWV0aG9kcyAqL1xuICBcdGlmIChjb25maWcuZXh0ZW5kKVxuICBcdFx0U1ZHLmV4dGVuZChpbml0aWFsaXplciwgY29uZmlnLmV4dGVuZClcbiAgXG4gIFx0LyogYXR0YWNoIGNvbnN0cnVjdCBtZXRob2QgdG8gcGFyZW50ICovXG4gIFx0aWYgKGNvbmZpZy5jb25zdHJ1Y3QpXG4gIFx0XHRTVkcuZXh0ZW5kKGNvbmZpZy5wYXJlbnQgfHwgU1ZHLkNvbnRhaW5lciwgY29uZmlnLmNvbnN0cnVjdClcbiAgXG4gIFx0cmV0dXJuIGluaXRpYWxpemVyXG4gIH1cblxuICBTVkcucmVnZXggPSB7XG4gICAgLyogcGFyc2UgdW5pdCB2YWx1ZSAqL1xuICAgIHVuaXQ6ICAgICAgICAgL14oLT9bXFxkXFwuXSspKFthLXolXXswLDJ9KSQvXG4gICAgXG4gICAgLyogcGFyc2UgaGV4IHZhbHVlICovXG4gICwgaGV4OiAgICAgICAgICAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pXG4gICAgXG4gICAgLyogcGFyc2UgcmdiIHZhbHVlICovXG4gICwgcmdiOiAgICAgICAgICAvcmdiXFwoKFxcZCspLChcXGQrKSwoXFxkKylcXCkvXG4gIFxuICAgIC8qIHRlc3QgaGV4IHZhbHVlICovXG4gICwgaXNIZXg6ICAgICAgICAvXiNbYS1mMC05XXszLDZ9JC9pXG4gICAgXG4gICAgLyogdGVzdCByZ2IgdmFsdWUgKi9cbiAgLCBpc1JnYjogICAgICAgIC9ecmdiXFwoL1xuICAgIFxuICAgIC8qIHRlc3QgY3NzIGRlY2xhcmF0aW9uICovXG4gICwgaXNDc3M6ICAgICAgICAvW146XSs6W147XSs7Py9cbiAgICBcbiAgICAvKiB0ZXN0IGZvciBibGFuayBzdHJpbmcgKi9cbiAgLCBpc0JsYW5rOiAgICAgIC9eKFxccyspPyQvXG4gICAgXG4gICAgLyogdGVzdCBmb3IgbnVtZXJpYyBzdHJpbmcgKi9cbiAgLCBpc051bWJlcjogICAgIC9eLT9bXFxkXFwuXSskL1xuICBcbiAgICAvKiB0ZXN0IGZvciBwZXJjZW50IHZhbHVlICovXG4gICwgaXNQZXJjZW50OiAgICAvXi0/W1xcZFxcLl0rJSQvXG4gIFxuICAgIC8qIHRlc3QgZm9yIGltYWdlIHVybCAqL1xuICAsIGlzSW1hZ2U6ICAgICAgL1xcLihqcGd8anBlZ3xwbmd8Z2lmKShcXD9bXj1dKy4qKT8vaVxuICAgIFxuICB9XG5cbiAgU1ZHLmRlZmF1bHRzID0ge1xuICAgIC8vIERlZmF1bHQgbWF0cml4XG4gICAgbWF0cml4OiAgICAgICAnMSAwIDAgMSAwIDAnXG4gICAgXG4gICAgLy8gRGVmYXVsdCBhdHRyaWJ1dGUgdmFsdWVzXG4gICwgYXR0cnM6IHtcbiAgICAgIC8qIGZpbGwgYW5kIHN0cm9rZSAqL1xuICAgICAgJ2ZpbGwtb3BhY2l0eSc6ICAgICAxXG4gICAgLCAnc3Ryb2tlLW9wYWNpdHknOiAgIDFcbiAgICAsICdzdHJva2Utd2lkdGgnOiAgICAgMFxuICAgICwgJ3N0cm9rZS1saW5lam9pbic6ICAnbWl0ZXInXG4gICAgLCAnc3Ryb2tlLWxpbmVjYXAnOiAgICdidXR0J1xuICAgICwgZmlsbDogICAgICAgICAgICAgICAnIzAwMDAwMCdcbiAgICAsIHN0cm9rZTogICAgICAgICAgICAgJyMwMDAwMDAnXG4gICAgLCBvcGFjaXR5OiAgICAgICAgICAgIDFcbiAgICAgIC8qIHBvc2l0aW9uICovXG4gICAgLCB4OiAgICAgICAgICAgICAgICAgIDBcbiAgICAsIHk6ICAgICAgICAgICAgICAgICAgMFxuICAgICwgY3g6ICAgICAgICAgICAgICAgICAwXG4gICAgLCBjeTogICAgICAgICAgICAgICAgIDBcbiAgICAgIC8qIHNpemUgKi8gIFxuICAgICwgd2lkdGg6ICAgICAgICAgICAgICAwXG4gICAgLCBoZWlnaHQ6ICAgICAgICAgICAgIDBcbiAgICAgIC8qIHJhZGl1cyAqLyAgXG4gICAgLCByOiAgICAgICAgICAgICAgICAgIDBcbiAgICAsIHJ4OiAgICAgICAgICAgICAgICAgMFxuICAgICwgcnk6ICAgICAgICAgICAgICAgICAwXG4gICAgICAvKiBncmFkaWVudCAqLyAgXG4gICAgLCBvZmZzZXQ6ICAgICAgICAgICAgIDBcbiAgICAsICdzdG9wLW9wYWNpdHknOiAgICAgMVxuICAgICwgJ3N0b3AtY29sb3InOiAgICAgICAnIzAwMDAwMCdcbiAgICAgIC8qIHRleHQgKi9cbiAgICAsICdmb250LXNpemUnOiAgICAgICAgMTZcbiAgICAsICdmb250LWZhbWlseSc6ICAgICAgJ0hlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYnXG4gICAgLCAndGV4dC1hbmNob3InOiAgICAgICdzdGFydCdcbiAgICB9XG4gICAgXG4gICAgLy8gRGVmYXVsdCB0cmFuc2Zvcm1hdGlvbiB2YWx1ZXNcbiAgLCB0cmFuczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAvKiB0cmFuc2xhdGUgKi9cbiAgICAgICAgeDogICAgICAgIDBcbiAgICAgICwgeTogICAgICAgIDBcbiAgICAgICAgLyogc2NhbGUgKi9cbiAgICAgICwgc2NhbGVYOiAgIDFcbiAgICAgICwgc2NhbGVZOiAgIDFcbiAgICAgICAgLyogcm90YXRlICovXG4gICAgICAsIHJvdGF0aW9uOiAwXG4gICAgICAgIC8qIHNrZXcgKi9cbiAgICAgICwgc2tld1g6ICAgIDBcbiAgICAgICwgc2tld1k6ICAgIDBcbiAgICAgICAgLyogbWF0cml4ICovXG4gICAgICAsIG1hdHJpeDogICB0aGlzLm1hdHJpeFxuICAgICAgLCBhOiAgICAgICAgMVxuICAgICAgLCBiOiAgICAgICAgMFxuICAgICAgLCBjOiAgICAgICAgMFxuICAgICAgLCBkOiAgICAgICAgMVxuICAgICAgLCBlOiAgICAgICAgMFxuICAgICAgLCBmOiAgICAgICAgMFxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgfVxuXG4gIFNWRy5Db2xvciA9IGZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgdmFyIG1hdGNoXG4gICAgXG4gICAgLyogaW5pdGlhbGl6ZSBkZWZhdWx0cyAqL1xuICAgIHRoaXMuciA9IDBcbiAgICB0aGlzLmcgPSAwXG4gICAgdGhpcy5iID0gMFxuICAgIFxuICAgIC8qIHBhcnNlIGNvbG9yICovXG4gICAgaWYgKHR5cGVvZiBjb2xvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmIChTVkcucmVnZXguaXNSZ2IudGVzdChjb2xvcikpIHtcbiAgICAgICAgLyogZ2V0IHJnYiB2YWx1ZXMgKi9cbiAgICAgICAgbWF0Y2ggPSBTVkcucmVnZXgucmdiLmV4ZWMoY29sb3IucmVwbGFjZSgvXFxzL2csJycpKVxuICAgICAgICBcbiAgICAgICAgLyogcGFyc2UgbnVtZXJpYyB2YWx1ZXMgKi9cbiAgICAgICAgdGhpcy5yID0gcGFyc2VJbnQobWF0Y2hbMV0pXG4gICAgICAgIHRoaXMuZyA9IHBhcnNlSW50KG1hdGNoWzJdKVxuICAgICAgICB0aGlzLmIgPSBwYXJzZUludChtYXRjaFszXSlcbiAgICAgICAgXG4gICAgICB9IGVsc2UgaWYgKFNWRy5yZWdleC5pc0hleC50ZXN0KGNvbG9yKSkge1xuICAgICAgICAvKiBnZXQgaGV4IHZhbHVlcyAqL1xuICAgICAgICBtYXRjaCA9IFNWRy5yZWdleC5oZXguZXhlYyhmdWxsSGV4KGNvbG9yKSlcbiAgXG4gICAgICAgIC8qIHBhcnNlIG51bWVyaWMgdmFsdWVzICovXG4gICAgICAgIHRoaXMuciA9IHBhcnNlSW50KG1hdGNoWzFdLCAxNilcbiAgICAgICAgdGhpcy5nID0gcGFyc2VJbnQobWF0Y2hbMl0sIDE2KVxuICAgICAgICB0aGlzLmIgPSBwYXJzZUludChtYXRjaFszXSwgMTYpXG4gIFxuICAgICAgfVxuICAgICAgXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY29sb3IgPT09ICdvYmplY3QnKSB7XG4gICAgICB0aGlzLnIgPSBjb2xvci5yXG4gICAgICB0aGlzLmcgPSBjb2xvci5nXG4gICAgICB0aGlzLmIgPSBjb2xvci5iXG4gICAgICBcbiAgICB9XG4gICAgICBcbiAgfVxuICBcbiAgU1ZHLmV4dGVuZChTVkcuQ29sb3IsIHtcbiAgICAvLyBEZWZhdWx0IHRvIGhleCBjb252ZXJzaW9uXG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudG9IZXgoKVxuICAgIH1cbiAgICAvLyBCdWlsZCBoZXggdmFsdWVcbiAgLCB0b0hleDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJyMnXG4gICAgICAgICsgY29tcFRvSGV4KHRoaXMucilcbiAgICAgICAgKyBjb21wVG9IZXgodGhpcy5nKVxuICAgICAgICArIGNvbXBUb0hleCh0aGlzLmIpXG4gICAgfVxuICAgIC8vIEJ1aWxkIHJnYiB2YWx1ZVxuICAsIHRvUmdiOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAncmdiKCcgKyBbdGhpcy5yLCB0aGlzLmcsIHRoaXMuYl0uam9pbigpICsgJyknXG4gICAgfVxuICAgIC8vIENhbGN1bGF0ZSB0cnVlIGJyaWdodG5lc3NcbiAgLCBicmlnaHRuZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAodGhpcy5yIC8gMjU1ICogMC4zMClcbiAgICAgICAgICAgKyAodGhpcy5nIC8gMjU1ICogMC41OSlcbiAgICAgICAgICAgKyAodGhpcy5iIC8gMjU1ICogMC4xMSlcbiAgICB9XG4gICAgLy8gTWFrZSBjb2xvciBtb3JwaGFibGVcbiAgLCBtb3JwaDogZnVuY3Rpb24oY29sb3IpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBuZXcgU1ZHLkNvbG9yKGNvbG9yKVxuICBcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIC8vIEdldCBtb3JwaGVkIGNvbG9yIGF0IGdpdmVuIHBvc2l0aW9uXG4gICwgYXQ6IGZ1bmN0aW9uKHBvcykge1xuICAgICAgLyogbWFrZSBzdXJlIGEgZGVzdGluYXRpb24gaXMgZGVmaW5lZCAqL1xuICAgICAgaWYgKCF0aGlzLmRlc3RpbmF0aW9uKSByZXR1cm4gdGhpc1xuICBcbiAgICAgIC8qIG5vcm1hbGlzZSBwb3MgKi9cbiAgICAgIHBvcyA9IHBvcyA8IDAgPyAwIDogcG9zID4gMSA/IDEgOiBwb3NcbiAgXG4gICAgICAvKiBnZW5lcmF0ZSBtb3JwaGVkIGNvbG9yICovXG4gICAgICByZXR1cm4gbmV3IFNWRy5Db2xvcih7XG4gICAgICAgIHI6IH5+KHRoaXMuciArICh0aGlzLmRlc3RpbmF0aW9uLnIgLSB0aGlzLnIpICogcG9zKVxuICAgICAgLCBnOiB+fih0aGlzLmcgKyAodGhpcy5kZXN0aW5hdGlvbi5nIC0gdGhpcy5nKSAqIHBvcylcbiAgICAgICwgYjogfn4odGhpcy5iICsgKHRoaXMuZGVzdGluYXRpb24uYiAtIHRoaXMuYikgKiBwb3MpXG4gICAgICB9KVxuICAgIH1cbiAgICBcbiAgfSlcbiAgXG4gIC8vIFRlc3RlcnNcbiAgXG4gIC8vIFRlc3QgaWYgZ2l2ZW4gdmFsdWUgaXMgYSBjb2xvciBzdHJpbmdcbiAgU1ZHLkNvbG9yLnRlc3QgPSBmdW5jdGlvbihjb2xvcikge1xuICAgIGNvbG9yICs9ICcnXG4gICAgcmV0dXJuIFNWRy5yZWdleC5pc0hleC50ZXN0KGNvbG9yKVxuICAgICAgICB8fCBTVkcucmVnZXguaXNSZ2IudGVzdChjb2xvcilcbiAgfVxuICBcbiAgLy8gVGVzdCBpZiBnaXZlbiB2YWx1ZSBpcyBhIHJnYiBvYmplY3RcbiAgU1ZHLkNvbG9yLmlzUmdiID0gZnVuY3Rpb24oY29sb3IpIHtcbiAgICByZXR1cm4gY29sb3IgJiYgdHlwZW9mIGNvbG9yLnIgPT0gJ251bWJlcidcbiAgICAgICAgICAgICAgICAgJiYgdHlwZW9mIGNvbG9yLmcgPT0gJ251bWJlcidcbiAgICAgICAgICAgICAgICAgJiYgdHlwZW9mIGNvbG9yLmIgPT0gJ251bWJlcidcbiAgfVxuICBcbiAgLy8gVGVzdCBpZiBnaXZlbiB2YWx1ZSBpcyBhIGNvbG9yXG4gIFNWRy5Db2xvci5pc0NvbG9yID0gZnVuY3Rpb24oY29sb3IpIHtcbiAgICByZXR1cm4gU1ZHLkNvbG9yLmlzUmdiKGNvbG9yKSB8fCBTVkcuQ29sb3IudGVzdChjb2xvcilcbiAgfVxuXG4gIFNWRy5BcnJheSA9IGZ1bmN0aW9uKGFycmF5LCBmYWxsYmFjaykge1xuICAgIGFycmF5ID0gKGFycmF5IHx8IFtdKS52YWx1ZU9mKClcbiAgXG4gICAgLyogaWYgYXJyYXkgaXMgZW1wdHkgYW5kIGZhbGxiYWNrIGlzIHByb3ZpZGVkLCB1c2UgZmFsbGJhY2sgKi9cbiAgICBpZiAoYXJyYXkubGVuZ3RoID09IDAgJiYgZmFsbGJhY2spXG4gICAgICBhcnJheSA9IGZhbGxiYWNrLnZhbHVlT2YoKVxuICBcbiAgICAvKiBwYXJzZSBhcnJheSAqL1xuICAgIHRoaXMudmFsdWUgPSB0aGlzLnBhcnNlKGFycmF5KVxuICB9XG4gIFxuICBTVkcuZXh0ZW5kKFNWRy5BcnJheSwge1xuICAgIC8vIE1ha2UgYXJyYXkgbW9ycGhhYmxlXG4gICAgbW9ycGg6IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uID0gdGhpcy5wYXJzZShhcnJheSlcbiAgXG4gICAgICAvKiBub3JtYWxpemUgbGVuZ3RoIG9mIGFycmF5cyAqL1xuICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoICE9IHRoaXMuZGVzdGluYXRpb24ubGVuZ3RoKSB7XG4gICAgICAgIHZhciBsYXN0VmFsdWUgICAgICAgPSB0aGlzLnZhbHVlW3RoaXMudmFsdWUubGVuZ3RoIC0gMV1cbiAgICAgICAgICAsIGxhc3REZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb25bdGhpcy5kZXN0aW5hdGlvbi5sZW5ndGggLSAxXVxuICBcbiAgICAgICAgd2hpbGUodGhpcy52YWx1ZS5sZW5ndGggPiB0aGlzLmRlc3RpbmF0aW9uLmxlbmd0aClcbiAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLnB1c2gobGFzdERlc3RpbmF0aW9uKVxuICAgICAgICB3aGlsZSh0aGlzLnZhbHVlLmxlbmd0aCA8IHRoaXMuZGVzdGluYXRpb24ubGVuZ3RoKVxuICAgICAgICAgIHRoaXMudmFsdWUucHVzaChsYXN0VmFsdWUpXG4gICAgICB9XG4gIFxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgLy8gQ2xlYW4gdXAgYW55IGR1cGxpY2F0ZSBwb2ludHNcbiAgLCBzZXR0bGU6IGZ1bmN0aW9uKCkge1xuICAgICAgLyogZmluZCBhbGwgdW5pcXVlIHZhbHVlcyAqL1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy52YWx1ZS5sZW5ndGgsIHNlZW4gPSBbXTsgaSA8IGlsOyBpKyspXG4gICAgICAgIGlmIChzZWVuLmluZGV4T2YodGhpcy52YWx1ZVtpXSkgPT0gLTEpXG4gICAgICAgICAgc2Vlbi5wdXNoKHRoaXMudmFsdWVbaV0pXG4gIFxuICAgICAgLyogc2V0IG5ldyB2YWx1ZSAqL1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWUgPSBzZWVuXG4gICAgfVxuICAgIC8vIEdldCBtb3JwaGVkIGFycmF5IGF0IGdpdmVuIHBvc2l0aW9uXG4gICwgYXQ6IGZ1bmN0aW9uKHBvcykge1xuICAgICAgLyogbWFrZSBzdXJlIGEgZGVzdGluYXRpb24gaXMgZGVmaW5lZCAqL1xuICAgICAgaWYgKCF0aGlzLmRlc3RpbmF0aW9uKSByZXR1cm4gdGhpc1xuICBcbiAgICAgIC8qIGdlbmVyYXRlIG1vcnBoZWQgYXJyYXkgKi9cbiAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHRoaXMudmFsdWUubGVuZ3RoLCBhcnJheSA9IFtdOyBpIDwgaWw7IGkrKylcbiAgICAgICAgYXJyYXkucHVzaCh0aGlzLnZhbHVlW2ldICsgKHRoaXMuZGVzdGluYXRpb25baV0gLSB0aGlzLnZhbHVlW2ldKSAqIHBvcylcbiAgXG4gICAgICByZXR1cm4gbmV3IFNWRy5BcnJheShhcnJheSlcbiAgICB9XG4gICAgLy8gQ29udmVydCBhcnJheSB0byBzdHJpbmdcbiAgLCB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZS5qb2luKCcgJylcbiAgICB9XG4gICAgLy8gUmVhbCB2YWx1ZVxuICAsIHZhbHVlT2Y6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWVcbiAgICB9XG4gICAgLy8gUGFyc2Ugd2hpdGVzcGFjZSBzZXBhcmF0ZWQgc3RyaW5nXG4gICwgcGFyc2U6IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgICBhcnJheSA9IGFycmF5LnZhbHVlT2YoKVxuICBcbiAgICAgIC8qIGlmIGFscmVhZHkgaXMgYW4gYXJyYXksIG5vIG5lZWQgdG8gcGFyc2UgaXQgKi9cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGFycmF5KSkgcmV0dXJuIGFycmF5XG4gIFxuICAgICAgcmV0dXJuIHRoaXMuc3BsaXQoYXJyYXkpXG4gICAgfVxuICAgIC8vIFN0cmlwIHVubmVjZXNzYXJ5IHdoaXRlc3BhY2VcbiAgLCBzcGxpdDogZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1xccysvZywgJyAnKS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCcnKS5zcGxpdCgnICcpIFxuICAgIH1cbiAgICAvLyBSZXZlcnNlIGFycmF5XG4gICwgcmV2ZXJzZTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnZhbHVlLnJldmVyc2UoKVxuICBcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICBcbiAgfSlcbiAgXG5cblxuICBTVkcuUG9pbnRBcnJheSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY29uc3RydWN0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICB9XG4gIFxuICAvLyBJbmhlcml0IGZyb20gU1ZHLkFycmF5XG4gIFNWRy5Qb2ludEFycmF5LnByb3RvdHlwZSA9IG5ldyBTVkcuQXJyYXlcbiAgXG4gIFNWRy5leHRlbmQoU1ZHLlBvaW50QXJyYXksIHtcbiAgICAvLyBDb252ZXJ0IGFycmF5IHRvIHN0cmluZ1xuICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIC8qIGNvbnZlcnQgdG8gYSBwb2x5IHBvaW50IHN0cmluZyAqL1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy52YWx1ZS5sZW5ndGgsIGFycmF5ID0gW107IGkgPCBpbDsgaSsrKVxuICAgICAgICBhcnJheS5wdXNoKHRoaXMudmFsdWVbaV0uam9pbignLCcpKVxuICBcbiAgICAgIHJldHVybiBhcnJheS5qb2luKCcgJylcbiAgICB9XG4gICAgLy8gR2V0IG1vcnBoZWQgYXJyYXkgYXQgZ2l2ZW4gcG9zaXRpb25cbiAgLCBhdDogZnVuY3Rpb24ocG9zKSB7XG4gICAgICAvKiBtYWtlIHN1cmUgYSBkZXN0aW5hdGlvbiBpcyBkZWZpbmVkICovXG4gICAgICBpZiAoIXRoaXMuZGVzdGluYXRpb24pIHJldHVybiB0aGlzXG4gIFxuICAgICAgLyogZ2VuZXJhdGUgbW9ycGhlZCBwb2ludCBzdHJpbmcgKi9cbiAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHRoaXMudmFsdWUubGVuZ3RoLCBhcnJheSA9IFtdOyBpIDwgaWw7IGkrKylcbiAgICAgICAgYXJyYXkucHVzaChbXG4gICAgICAgICAgdGhpcy52YWx1ZVtpXVswXSArICh0aGlzLmRlc3RpbmF0aW9uW2ldWzBdIC0gdGhpcy52YWx1ZVtpXVswXSkgKiBwb3NcbiAgICAgICAgLCB0aGlzLnZhbHVlW2ldWzFdICsgKHRoaXMuZGVzdGluYXRpb25baV1bMV0gLSB0aGlzLnZhbHVlW2ldWzFdKSAqIHBvc1xuICAgICAgICBdKVxuICBcbiAgICAgIHJldHVybiBuZXcgU1ZHLlBvaW50QXJyYXkoYXJyYXkpXG4gICAgfVxuICAgIC8vIFBhcnNlIHBvaW50IHN0cmluZ1xuICAsIHBhcnNlOiBmdW5jdGlvbihhcnJheSkge1xuICAgICAgYXJyYXkgPSBhcnJheS52YWx1ZU9mKClcbiAgXG4gICAgICAvKiBpZiBhbHJlYWR5IGlzIGFuIGFycmF5LCBubyBuZWVkIHRvIHBhcnNlIGl0ICovXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShhcnJheSkpIHJldHVybiBhcnJheVxuICBcbiAgICAgIC8qIHNwbGl0IHBvaW50cyAqL1xuICAgICAgYXJyYXkgPSB0aGlzLnNwbGl0KGFycmF5KVxuICBcbiAgICAgIC8qIHBhcnNlIHBvaW50cyAqL1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gYXJyYXkubGVuZ3RoLCBwLCBwb2ludHMgPSBbXTsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgcCA9IGFycmF5W2ldLnNwbGl0KCcsJylcbiAgICAgICAgcG9pbnRzLnB1c2goW3BhcnNlRmxvYXQocFswXSksIHBhcnNlRmxvYXQocFsxXSldKVxuICAgICAgfVxuICBcbiAgICAgIHJldHVybiBwb2ludHNcbiAgICB9XG4gICAgLy8gTW92ZSBwb2ludCBzdHJpbmdcbiAgLCBtb3ZlOiBmdW5jdGlvbih4LCB5KSB7XG4gICAgICB2YXIgYm94ID0gdGhpcy5iYm94KClcbiAgXG4gICAgICAvKiBnZXQgcmVsYXRpdmUgb2Zmc2V0ICovXG4gICAgICB4IC09IGJveC54XG4gICAgICB5IC09IGJveC55XG4gIFxuICAgICAgLyogbW92ZSBldmVyeSBwb2ludCAqL1xuICAgICAgaWYgKCFpc05hTih4KSAmJiAhaXNOYU4oeSkpXG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLnZhbHVlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICAgIHRoaXMudmFsdWVbaV0gPSBbdGhpcy52YWx1ZVtpXVswXSArIHgsIHRoaXMudmFsdWVbaV1bMV0gKyB5XVxuICBcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIC8vIFJlc2l6ZSBwb2x5IHN0cmluZ1xuICAsIHNpemU6IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgIHZhciBpLCBib3ggPSB0aGlzLmJib3goKVxuICBcbiAgICAgIC8qIHJlY2FsY3VsYXRlIHBvc2l0aW9uIG9mIGFsbCBwb2ludHMgYWNjb3JkaW5nIHRvIG5ldyBzaXplICovXG4gICAgICBmb3IgKGkgPSB0aGlzLnZhbHVlLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIHRoaXMudmFsdWVbaV1bMF0gPSAoKHRoaXMudmFsdWVbaV1bMF0gLSBib3gueCkgKiB3aWR0aCkgIC8gYm94LndpZHRoICArIGJveC54XG4gICAgICAgIHRoaXMudmFsdWVbaV1bMV0gPSAoKHRoaXMudmFsdWVbaV1bMV0gLSBib3gueSkgKiBoZWlnaHQpIC8gYm94LmhlaWdodCArIGJveC54XG4gICAgICB9XG4gIFxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgLy8gR2V0IGJvdW5kaW5nIGJveCBvZiBwb2ludHNcbiAgLCBiYm94OiBmdW5jdGlvbigpIHtcbiAgICAgIFNWRy5wYXJzZXIucG9seS5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIHRoaXMudG9TdHJpbmcoKSlcbiAgXG4gICAgICByZXR1cm4gU1ZHLnBhcnNlci5wb2x5LmdldEJCb3goKVxuICAgIH1cbiAgXG4gIH0pXG5cbiAgU1ZHLlBhdGhBcnJheSA9IGZ1bmN0aW9uKGFycmF5LCBmYWxsYmFjaykge1xuICAgIHRoaXMuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBhcnJheSwgZmFsbGJhY2spXG4gIH1cbiAgXG4gIC8vIEluaGVyaXQgZnJvbSBTVkcuQXJyYXlcbiAgU1ZHLlBhdGhBcnJheS5wcm90b3R5cGUgPSBuZXcgU1ZHLkFycmF5XG4gIFxuICBTVkcuZXh0ZW5kKFNWRy5QYXRoQXJyYXksIHtcbiAgICAvLyBDb252ZXJ0IGFycmF5IHRvIHN0cmluZ1xuICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBhcnJheVRvU3RyaW5nKHRoaXMudmFsdWUpXG4gICAgfVxuICAgIC8vIE1vdmUgcGF0aCBzdHJpbmdcbiAgLCBtb3ZlOiBmdW5jdGlvbih4LCB5KSB7XG4gIFx0XHQvKiBnZXQgYm91bmRpbmcgYm94IG9mIGN1cnJlbnQgc2l0dWF0aW9uICovXG4gIFx0XHR2YXIgYm94ID0gdGhpcy5iYm94KClcbiAgXHRcdFxuICAgICAgLyogZ2V0IHJlbGF0aXZlIG9mZnNldCAqL1xuICAgICAgeCAtPSBib3gueFxuICAgICAgeSAtPSBib3gueVxuICBcbiAgICAgIGlmICghaXNOYU4oeCkgJiYgIWlzTmFOKHkpKSB7XG4gICAgICAgIC8qIG1vdmUgZXZlcnkgcG9pbnQgKi9cbiAgICAgICAgZm9yICh2YXIgbCwgaSA9IHRoaXMudmFsdWUubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICBsID0gdGhpcy52YWx1ZVtpXVswXVxuICBcbiAgICAgICAgICBpZiAobCA9PSAnTScgfHwgbCA9PSAnTCcgfHwgbCA9PSAnVCcpICB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlW2ldWzFdICs9IHhcbiAgICAgICAgICAgIHRoaXMudmFsdWVbaV1bMl0gKz0geVxuICBcbiAgICAgICAgICB9IGVsc2UgaWYgKGwgPT0gJ0gnKSAge1xuICAgICAgICAgICAgdGhpcy52YWx1ZVtpXVsxXSArPSB4XG4gIFxuICAgICAgICAgIH0gZWxzZSBpZiAobCA9PSAnVicpICB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlW2ldWzFdICs9IHlcbiAgXG4gICAgICAgICAgfSBlbHNlIGlmIChsID09ICdDJyB8fCBsID09ICdTJyB8fCBsID09ICdRJykgIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVbaV1bMV0gKz0geFxuICAgICAgICAgICAgdGhpcy52YWx1ZVtpXVsyXSArPSB5XG4gICAgICAgICAgICB0aGlzLnZhbHVlW2ldWzNdICs9IHhcbiAgICAgICAgICAgIHRoaXMudmFsdWVbaV1bNF0gKz0geVxuICBcbiAgICAgICAgICAgIGlmIChsID09ICdDJykgIHtcbiAgICAgICAgICAgICAgdGhpcy52YWx1ZVtpXVs1XSArPSB4XG4gICAgICAgICAgICAgIHRoaXMudmFsdWVbaV1bNl0gKz0geVxuICAgICAgICAgICAgfVxuICBcbiAgICAgICAgICB9IGVsc2UgaWYgKGwgPT0gJ0EnKSAge1xuICAgICAgICAgICAgdGhpcy52YWx1ZVtpXVs2XSArPSB4XG4gICAgICAgICAgICB0aGlzLnZhbHVlW2ldWzddICs9IHlcbiAgICAgICAgICB9XG4gIFxuICAgICAgICB9XG4gICAgICB9XG4gIFxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgLy8gUmVzaXplIHBhdGggc3RyaW5nXG4gICwgc2l6ZTogZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICBcdFx0LyogZ2V0IGJvdW5kaW5nIGJveCBvZiBjdXJyZW50IHNpdHVhdGlvbiAqL1xuICBcdFx0dmFyIGksIGwsIGJveCA9IHRoaXMuYmJveCgpXG4gIFxuICAgICAgLyogcmVjYWxjdWxhdGUgcG9zaXRpb24gb2YgYWxsIHBvaW50cyBhY2NvcmRpbmcgdG8gbmV3IHNpemUgKi9cbiAgICAgIGZvciAoaSA9IHRoaXMudmFsdWUubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgbCA9IHRoaXMudmFsdWVbaV1bMF1cbiAgXG4gICAgICAgIGlmIChsID09ICdNJyB8fCBsID09ICdMJyB8fCBsID09ICdUJykgIHtcbiAgICAgICAgICB0aGlzLnZhbHVlW2ldWzFdID0gKCh0aGlzLnZhbHVlW2ldWzFdIC0gYm94LngpICogd2lkdGgpICAvIGJveC53aWR0aCAgKyBib3gueFxuICAgICAgICAgIHRoaXMudmFsdWVbaV1bMl0gPSAoKHRoaXMudmFsdWVbaV1bMl0gLSBib3gueSkgKiBoZWlnaHQpIC8gYm94LmhlaWdodCArIGJveC55XG4gIFxuICAgICAgICB9IGVsc2UgaWYgKGwgPT0gJ0gnKSAge1xuICAgICAgICAgIHRoaXMudmFsdWVbaV1bMV0gPSAoKHRoaXMudmFsdWVbaV1bMV0gLSBib3gueCkgKiB3aWR0aCkgIC8gYm94LndpZHRoICArIGJveC54XG4gIFxuICAgICAgICB9IGVsc2UgaWYgKGwgPT0gJ1YnKSAge1xuICAgICAgICAgIHRoaXMudmFsdWVbaV1bMV0gPSAoKHRoaXMudmFsdWVbaV1bMV0gLSBib3gueSkgKiBoZWlnaHQpIC8gYm94LmhlaWdodCArIGJveC55XG4gIFxuICAgICAgICB9IGVsc2UgaWYgKGwgPT0gJ0MnIHx8IGwgPT0gJ1MnIHx8IGwgPT0gJ1EnKSAge1xuICAgICAgICAgIHRoaXMudmFsdWVbaV1bMV0gPSAoKHRoaXMudmFsdWVbaV1bMV0gLSBib3gueCkgKiB3aWR0aCkgIC8gYm94LndpZHRoICArIGJveC54XG4gICAgICAgICAgdGhpcy52YWx1ZVtpXVsyXSA9ICgodGhpcy52YWx1ZVtpXVsyXSAtIGJveC55KSAqIGhlaWdodCkgLyBib3guaGVpZ2h0ICsgYm94LnlcbiAgICAgICAgICB0aGlzLnZhbHVlW2ldWzNdID0gKCh0aGlzLnZhbHVlW2ldWzNdIC0gYm94LngpICogd2lkdGgpICAvIGJveC53aWR0aCAgKyBib3gueFxuICAgICAgICAgIHRoaXMudmFsdWVbaV1bNF0gPSAoKHRoaXMudmFsdWVbaV1bNF0gLSBib3gueSkgKiBoZWlnaHQpIC8gYm94LmhlaWdodCArIGJveC55XG4gIFxuICAgICAgICAgIGlmIChsID09ICdDJykgIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWVbaV1bNV0gPSAoKHRoaXMudmFsdWVbaV1bNV0gLSBib3gueCkgKiB3aWR0aCkgIC8gYm94LndpZHRoICArIGJveC54XG4gICAgICAgICAgICB0aGlzLnZhbHVlW2ldWzZdID0gKCh0aGlzLnZhbHVlW2ldWzZdIC0gYm94LnkpICogaGVpZ2h0KSAvIGJveC5oZWlnaHQgKyBib3gueVxuICAgICAgICAgIH1cbiAgXG4gICAgICAgIH0gZWxzZSBpZiAobCA9PSAnQScpICB7XG4gICAgICAgICAgLyogcmVzaXplIHJhZGlpICovXG4gICAgICAgICAgdGhpcy52YWx1ZVtpXVsxXSA9ICh0aGlzLnZhbHVlW2ldWzFdICogd2lkdGgpICAvIGJveC53aWR0aFxuICAgICAgICAgIHRoaXMudmFsdWVbaV1bMl0gPSAodGhpcy52YWx1ZVtpXVsyXSAqIGhlaWdodCkgLyBib3guaGVpZ2h0XG4gIFxuICAgICAgICAgIC8qIG1vdmUgcG9zaXRpb24gdmFsdWVzICovXG4gICAgICAgICAgdGhpcy52YWx1ZVtpXVs2XSA9ICgodGhpcy52YWx1ZVtpXVs2XSAtIGJveC54KSAqIHdpZHRoKSAgLyBib3gud2lkdGggICsgYm94LnhcbiAgICAgICAgICB0aGlzLnZhbHVlW2ldWzddID0gKCh0aGlzLnZhbHVlW2ldWzddIC0gYm94LnkpICogaGVpZ2h0KSAvIGJveC5oZWlnaHQgKyBib3gueVxuICAgICAgICB9XG4gIFxuICAgICAgfVxuICBcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIC8vIEFic29sdXRpemUgYW5kIHBhcnNlIHBhdGggdG8gYXJyYXlcbiAgLCBwYXJzZTogZnVuY3Rpb24oYXJyYXkpIHtcbiAgICAgIC8qIGlmIGl0J3MgYWxyZWFkeSBpcyBhIHBhdGhhcnJheSwgbm8gbmVlZCB0byBwYXJzZSBpdCAqL1xuICAgICAgaWYgKGFycmF5IGluc3RhbmNlb2YgU1ZHLlBhdGhBcnJheSkgcmV0dXJuIGFycmF5LnZhbHVlT2YoKVxuICBcbiAgICAgIC8qIHByZXBhcmUgZm9yIHBhcnNpbmcgKi9cbiAgICAgIHZhciBpLCBpbCwgeDAsIHkwLCB4MSwgeTEsIHgyLCB5Miwgcywgc2VnLCBzZWdzXG4gICAgICAgICwgeCA9IDBcbiAgICAgICAgLCB5ID0gMFxuICAgICAgXG4gICAgICAvKiBwb3B1bGF0ZSB3b3JraW5nIHBhdGggKi9cbiAgICAgIFNWRy5wYXJzZXIucGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCB0eXBlb2YgYXJyYXkgPT09ICdzdHJpbmcnID8gYXJyYXkgOiBhcnJheVRvU3RyaW5nKGFycmF5KSlcbiAgICAgIFxuICAgICAgLyogZ2V0IHNlZ21lbnRzICovXG4gICAgICBzZWdzID0gU1ZHLnBhcnNlci5wYXRoLnBhdGhTZWdMaXN0XG4gIFxuICAgICAgZm9yIChpID0gMCwgaWwgPSBzZWdzLm51bWJlck9mSXRlbXM7IGkgPCBpbDsgKytpKSB7XG4gICAgICAgIHNlZyA9IHNlZ3MuZ2V0SXRlbShpKVxuICAgICAgICBzID0gc2VnLnBhdGhTZWdUeXBlQXNMZXR0ZXJcbiAgXG4gICAgICAgIC8qIHllcywgdGhpcyBJUyBxdWl0ZSB2ZXJib3NlIGJ1dCBhbHNvIGFib3V0IDMwIHRpbWVzIGZhc3RlciB0aGFuIC50ZXN0KCkgd2l0aCBhIHByZWNvbXBpbGVkIHJlZ2V4ICovXG4gICAgICAgIGlmIChzID09ICdNJyB8fCBzID09ICdMJyB8fCBzID09ICdIJyB8fCBzID09ICdWJyB8fCBzID09ICdDJyB8fCBzID09ICdTJyB8fCBzID09ICdRJyB8fCBzID09ICdUJyB8fCBzID09ICdBJykge1xuICAgICAgICAgIGlmICgneCcgaW4gc2VnKSB4ID0gc2VnLnhcbiAgICAgICAgICBpZiAoJ3knIGluIHNlZykgeSA9IHNlZy55XG4gIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICgneDEnIGluIHNlZykgeDEgPSB4ICsgc2VnLngxXG4gICAgICAgICAgaWYgKCd4MicgaW4gc2VnKSB4MiA9IHggKyBzZWcueDJcbiAgICAgICAgICBpZiAoJ3kxJyBpbiBzZWcpIHkxID0geSArIHNlZy55MVxuICAgICAgICAgIGlmICgneTInIGluIHNlZykgeTIgPSB5ICsgc2VnLnkyXG4gICAgICAgICAgaWYgKCd4JyAgaW4gc2VnKSB4ICs9IHNlZy54XG4gICAgICAgICAgaWYgKCd5JyAgaW4gc2VnKSB5ICs9IHNlZy55XG4gIFxuICAgICAgICAgIGlmIChzID09ICdtJylcbiAgICAgICAgICAgIHNlZ3MucmVwbGFjZUl0ZW0oU1ZHLnBhcnNlci5wYXRoLmNyZWF0ZVNWR1BhdGhTZWdNb3ZldG9BYnMoeCwgeSksIGkpXG4gICAgICAgICAgZWxzZSBpZiAocyA9PSAnbCcpXG4gICAgICAgICAgICBzZWdzLnJlcGxhY2VJdGVtKFNWRy5wYXJzZXIucGF0aC5jcmVhdGVTVkdQYXRoU2VnTGluZXRvQWJzKHgsIHkpLCBpKVxuICAgICAgICAgIGVsc2UgaWYgKHMgPT0gJ2gnKVxuICAgICAgICAgICAgc2Vncy5yZXBsYWNlSXRlbShTVkcucGFyc2VyLnBhdGguY3JlYXRlU1ZHUGF0aFNlZ0xpbmV0b0hvcml6b250YWxBYnMoeCksIGkpXG4gICAgICAgICAgZWxzZSBpZiAocyA9PSAndicpXG4gICAgICAgICAgICBzZWdzLnJlcGxhY2VJdGVtKFNWRy5wYXJzZXIucGF0aC5jcmVhdGVTVkdQYXRoU2VnTGluZXRvVmVydGljYWxBYnMoeSksIGkpXG4gICAgICAgICAgZWxzZSBpZiAocyA9PSAnYycpXG4gICAgICAgICAgICBzZWdzLnJlcGxhY2VJdGVtKFNWRy5wYXJzZXIucGF0aC5jcmVhdGVTVkdQYXRoU2VnQ3VydmV0b0N1YmljQWJzKHgsIHksIHgxLCB5MSwgeDIsIHkyKSwgaSlcbiAgICAgICAgICBlbHNlIGlmIChzID09ICdzJylcbiAgICAgICAgICAgIHNlZ3MucmVwbGFjZUl0ZW0oU1ZHLnBhcnNlci5wYXRoLmNyZWF0ZVNWR1BhdGhTZWdDdXJ2ZXRvQ3ViaWNTbW9vdGhBYnMoeCwgeSwgeDIsIHkyKSwgaSlcbiAgICAgICAgICBlbHNlIGlmIChzID09ICdxJylcbiAgICAgICAgICAgIHNlZ3MucmVwbGFjZUl0ZW0oU1ZHLnBhcnNlci5wYXRoLmNyZWF0ZVNWR1BhdGhTZWdDdXJ2ZXRvUXVhZHJhdGljQWJzKHgsIHksIHgxLCB5MSksIGkpXG4gICAgICAgICAgZWxzZSBpZiAocyA9PSAndCcpXG4gICAgICAgICAgICBzZWdzLnJlcGxhY2VJdGVtKFNWRy5wYXJzZXIucGF0aC5jcmVhdGVTVkdQYXRoU2VnQ3VydmV0b1F1YWRyYXRpY1Ntb290aEFicyh4LCB5KSwgaSlcbiAgICAgICAgICBlbHNlIGlmIChzID09ICdhJylcbiAgICAgICAgICAgIHNlZ3MucmVwbGFjZUl0ZW0oU1ZHLnBhcnNlci5wYXRoLmNyZWF0ZVNWR1BhdGhTZWdBcmNBYnMoeCwgeSwgc2VnLnIxLCBzZWcucjIsIHNlZy5hbmdsZSwgc2VnLmxhcmdlQXJjRmxhZywgc2VnLnN3ZWVwRmxhZyksIGkpXG4gICAgICAgICAgZWxzZSBpZiAocyA9PSAneicgfHwgcyA9PSAnWicpIHtcbiAgICAgICAgICAgIHggPSB4MFxuICAgICAgICAgICAgeSA9IHkwXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gIFxuICAgICAgICAvKiByZWNvcmQgdGhlIHN0YXJ0IG9mIGEgc3VicGF0aCAqL1xuICAgICAgICBpZiAocyA9PSAnTScgfHwgcyA9PSAnbScpIHtcbiAgICAgICAgICB4MCA9IHhcbiAgICAgICAgICB5MCA9IHlcbiAgICAgICAgfVxuICAgICAgfVxuICBcbiAgICAgIC8qIGJ1aWxkIGludGVybmFsIHJlcHJlc2VudGF0aW9uICovXG4gICAgICBhcnJheSA9IFtdXG4gICAgICBzZWdzICA9IFNWRy5wYXJzZXIucGF0aC5wYXRoU2VnTGlzdFxuICAgICAgXG4gICAgICBmb3IgKGkgPSAwLCBpbCA9IHNlZ3MubnVtYmVyT2ZJdGVtczsgaSA8IGlsOyArK2kpIHtcbiAgICAgICAgc2VnID0gc2Vncy5nZXRJdGVtKGkpXG4gICAgICAgIHMgPSBzZWcucGF0aFNlZ1R5cGVBc0xldHRlclxuICAgICAgICB4ID0gW3NdXG4gIFxuICAgICAgICBpZiAocyA9PSAnTScgfHwgcyA9PSAnTCcgfHwgcyA9PSAnVCcpXG4gICAgICAgICAgeC5wdXNoKHNlZy54LCBzZWcueSlcbiAgICAgICAgZWxzZSBpZiAocyA9PSAnSCcpXG4gICAgICAgICAgeC5wdXNoKHNlZy54KVxuICAgICAgICBlbHNlIGlmIChzID09ICdWJylcbiAgICAgICAgICB4LnB1c2goc2VnLnkpXG4gICAgICAgIGVsc2UgaWYgKHMgPT0gJ0MnKVxuICAgICAgICAgIHgucHVzaChzZWcueDEsIHNlZy55MSwgc2VnLngyLCBzZWcueTIsIHNlZy54LCBzZWcueSlcbiAgICAgICAgZWxzZSBpZiAocyA9PSAnUycpXG4gICAgICAgICAgeC5wdXNoKHNlZy54Miwgc2VnLnkyLCBzZWcueCwgc2VnLnkpXG4gICAgICAgIGVsc2UgaWYgKHMgPT0gJ1EnKVxuICAgICAgICAgIHgucHVzaChzZWcueDEsIHNlZy55MSwgc2VnLngsIHNlZy55KVxuICAgICAgICBlbHNlIGlmIChzID09ICdBJylcbiAgICAgICAgICB4LnB1c2goc2VnLnIxLCBzZWcucjIsIHNlZy5hbmdsZSwgc2VnLmxhcmdlQXJjRmxhZ3wwLCBzZWcuc3dlZXBGbGFnfDAsIHNlZy54LCBzZWcueSlcbiAgXG4gICAgICAgIC8qIHN0b3JlIHNlZ21lbnQgKi9cbiAgICAgICAgYXJyYXkucHVzaCh4KVxuICAgICAgfVxuICAgICAgXG4gICAgICByZXR1cm4gYXJyYXlcbiAgICB9XG4gICAgLy8gR2V0IGJvdW5kaW5nIGJveCBvZiBwYXRoXG4gICwgYmJveDogZnVuY3Rpb24oKSB7XG4gICAgICBTVkcucGFyc2VyLnBhdGguc2V0QXR0cmlidXRlKCdkJywgdGhpcy50b1N0cmluZygpKVxuICBcbiAgICAgIHJldHVybiBTVkcucGFyc2VyLnBhdGguZ2V0QkJveCgpXG4gICAgfVxuICBcbiAgfSlcblxuICBTVkcuTnVtYmVyID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgXG4gICAgLyogaW5pdGlhbGl6ZSBkZWZhdWx0cyAqL1xuICAgIHRoaXMudmFsdWUgPSAwXG4gICAgdGhpcy51bml0ID0gJydcbiAgXG4gICAgLyogcGFyc2UgdmFsdWUgKi9cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgLyogZW5zdXJlIGEgdmFsaWQgbnVtZXJpYyB2YWx1ZSAqL1xuICAgICAgdGhpcy52YWx1ZSA9IGlzTmFOKHZhbHVlKSA/IDAgOiAhaXNGaW5pdGUodmFsdWUpID8gKHZhbHVlIDwgMCA/IC0zLjRlKzM4IDogKzMuNGUrMzgpIDogdmFsdWVcbiAgXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YXIgbWF0Y2ggPSB2YWx1ZS5tYXRjaChTVkcucmVnZXgudW5pdClcbiAgXG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgLyogbWFrZSB2YWx1ZSBudW1lcmljICovXG4gICAgICAgIHRoaXMudmFsdWUgPSBwYXJzZUZsb2F0KG1hdGNoWzFdKVxuICAgICAgXG4gICAgICAgIC8qIG5vcm1hbGl6ZSBwZXJjZW50IHZhbHVlICovXG4gICAgICAgIGlmIChtYXRjaFsyXSA9PSAnJScpXG4gICAgICAgICAgdGhpcy52YWx1ZSAvPSAxMDBcbiAgICAgICAgZWxzZSBpZiAobWF0Y2hbMl0gPT0gJ3MnKVxuICAgICAgICAgIHRoaXMudmFsdWUgKj0gMTAwMFxuICAgICAgXG4gICAgICAgIC8qIHN0b3JlIHVuaXQgKi9cbiAgICAgICAgdGhpcy51bml0ID0gbWF0Y2hbMl1cbiAgICAgIH1cbiAgXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFNWRy5OdW1iZXIpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlLnZhbHVlXG4gICAgICAgIHRoaXMudW5pdCAgPSB2YWx1ZS51bml0XG4gICAgICB9XG4gICAgfVxuICBcbiAgfVxuICBcbiAgU1ZHLmV4dGVuZChTVkcuTnVtYmVyLCB7XG4gICAgLy8gU3RyaW5nYWxpemVcbiAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICB0aGlzLnVuaXQgPT0gJyUnID9cbiAgICAgICAgICB+fih0aGlzLnZhbHVlICogMWU4KSAvIDFlNjpcbiAgICAgICAgdGhpcy51bml0ID09ICdzJyA/XG4gICAgICAgICAgdGhpcy52YWx1ZSAvIDFlMyA6XG4gICAgICAgICAgdGhpcy52YWx1ZVxuICAgICAgKSArIHRoaXMudW5pdFxuICAgIH1cbiAgLCAvLyBDb252ZXJ0IHRvIHByaW1pdGl2ZVxuICAgIHZhbHVlT2Y6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWVcbiAgICB9XG4gICAgLy8gQWRkIG51bWJlclxuICAsIHBsdXM6IGZ1bmN0aW9uKG51bWJlcikge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMgKyBuZXcgU1ZHLk51bWJlcihudW1iZXIpXG4gIFxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgLy8gU3VidHJhY3QgbnVtYmVyXG4gICwgbWludXM6IGZ1bmN0aW9uKG51bWJlcikge1xuICAgICAgcmV0dXJuIHRoaXMucGx1cygtbmV3IFNWRy5OdW1iZXIobnVtYmVyKSlcbiAgICB9XG4gICAgLy8gTXVsdGlwbHkgbnVtYmVyXG4gICwgdGltZXM6IGZ1bmN0aW9uKG51bWJlcikge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMgKiBuZXcgU1ZHLk51bWJlcihudW1iZXIpXG4gIFxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgLy8gRGl2aWRlIG51bWJlclxuICAsIGRpdmlkZTogZnVuY3Rpb24obnVtYmVyKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdGhpcyAvIG5ldyBTVkcuTnVtYmVyKG51bWJlcilcbiAgXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICAvLyBDb252ZXJ0IHRvIGRpZmZlcmVudCB1bml0XG4gICwgdG86IGZ1bmN0aW9uKHVuaXQpIHtcbiAgICAgIGlmICh0eXBlb2YgdW5pdCA9PT0gJ3N0cmluZycpXG4gICAgICAgIHRoaXMudW5pdCA9IHVuaXRcbiAgXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICAvLyBNYWtlIG51bWJlciBtb3JwaGFibGVcbiAgLCBtb3JwaDogZnVuY3Rpb24obnVtYmVyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uID0gbmV3IFNWRy5OdW1iZXIobnVtYmVyKVxuICBcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIC8vIEdldCBtb3JwaGVkIG51bWJlciBhdCBnaXZlbiBwb3NpdGlvblxuICAsIGF0OiBmdW5jdGlvbihwb3MpIHtcbiAgICAgIC8qIG1ha2Ugc3VyZSBhIGRlc3RpbmF0aW9uIGlzIGRlZmluZWQgKi9cbiAgICAgIGlmICghdGhpcy5kZXN0aW5hdGlvbikgcmV0dXJuIHRoaXNcbiAgXG4gICAgICAvKiBnZW5lcmF0ZSBuZXcgbW9ycGhlZCBudW1iZXIgKi9cbiAgICAgIHJldHVybiBuZXcgU1ZHLk51bWJlcih0aGlzLmRlc3RpbmF0aW9uKVxuICAgICAgICAgIC5taW51cyh0aGlzKVxuICAgICAgICAgIC50aW1lcyhwb3MpXG4gICAgICAgICAgLnBsdXModGhpcylcbiAgICB9XG4gIFxuICB9KVxuXG4gIFNWRy5WaWV3Qm94ID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgIHZhciB4LCB5LCB3aWR0aCwgaGVpZ2h0XG4gICAgICAsIHdtICAgPSAxIC8qIHdpZHRoIG11bHRpcGxpZXIgKi9cbiAgICAgICwgaG0gICA9IDEgLyogaGVpZ2h0IG11bHRpcGxpZXIgKi9cbiAgICAgICwgYm94ICA9IGVsZW1lbnQuYmJveCgpXG4gICAgICAsIHZpZXcgPSAoZWxlbWVudC5hdHRyKCd2aWV3Qm94JykgfHwgJycpLm1hdGNoKC8tP1tcXGRcXC5dKy9nKVxuICBcbiAgICAvKiBnZXQgZGltZW5zaW9ucyBvZiBjdXJyZW50IG5vZGUgKi9cbiAgICB3aWR0aCAgPSBuZXcgU1ZHLk51bWJlcihlbGVtZW50LndpZHRoKCkpXG4gICAgaGVpZ2h0ID0gbmV3IFNWRy5OdW1iZXIoZWxlbWVudC5oZWlnaHQoKSlcbiAgXG4gICAgLyogZmluZCBuZWFyZXN0IG5vbi1wZXJjZW50dWFsIGRpbWVuc2lvbnMgKi9cbiAgICB3aGlsZSAod2lkdGgudW5pdCA9PSAnJScpIHtcbiAgICAgIHdtICo9IHdpZHRoLnZhbHVlXG4gICAgICB3aWR0aCA9IG5ldyBTVkcuTnVtYmVyKGVsZW1lbnQgaW5zdGFuY2VvZiBTVkcuRG9jID8gZWxlbWVudC5wYXJlbnQub2Zmc2V0V2lkdGggOiBlbGVtZW50LndpZHRoKCkpXG4gICAgfVxuICAgIHdoaWxlIChoZWlnaHQudW5pdCA9PSAnJScpIHtcbiAgICAgIGhtICo9IGhlaWdodC52YWx1ZVxuICAgICAgaGVpZ2h0ID0gbmV3IFNWRy5OdW1iZXIoZWxlbWVudCBpbnN0YW5jZW9mIFNWRy5Eb2MgPyBlbGVtZW50LnBhcmVudC5vZmZzZXRIZWlnaHQgOiBlbGVtZW50LmhlaWdodCgpKVxuICAgIH1cbiAgICBcbiAgICAvKiBlbnN1cmUgZGVmYXVsdHMgKi9cbiAgICB0aGlzLnggICAgICA9IGJveC54XG4gICAgdGhpcy55ICAgICAgPSBib3gueVxuICAgIHRoaXMud2lkdGggID0gd2lkdGggICogd21cbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodCAqIGhtXG4gICAgdGhpcy56b29tICAgPSAxXG4gICAgXG4gICAgaWYgKHZpZXcpIHtcbiAgICAgIC8qIGdldCB3aWR0aCBhbmQgaGVpZ2h0IGZyb20gdmlld2JveCAqL1xuICAgICAgeCAgICAgID0gcGFyc2VGbG9hdCh2aWV3WzBdKVxuICAgICAgeSAgICAgID0gcGFyc2VGbG9hdCh2aWV3WzFdKVxuICAgICAgd2lkdGggID0gcGFyc2VGbG9hdCh2aWV3WzJdKVxuICAgICAgaGVpZ2h0ID0gcGFyc2VGbG9hdCh2aWV3WzNdKVxuICAgICAgXG4gICAgICAvKiBjYWxjdWxhdGUgem9vbSBhY2NvcmluZyB0byB2aWV3Ym94ICovXG4gICAgICB0aGlzLnpvb20gPSAoKHRoaXMud2lkdGggLyB0aGlzLmhlaWdodCkgPiAod2lkdGggLyBoZWlnaHQpKSA/XG4gICAgICAgIHRoaXMuaGVpZ2h0IC8gaGVpZ2h0IDpcbiAgICAgICAgdGhpcy53aWR0aCAgLyB3aWR0aFxuICBcbiAgICAgIC8qIGNhbGN1bGF0ZSByZWFsIHBpeGVsIGRpbWVuc2lvbnMgb24gcGFyZW50IFNWRy5Eb2MgZWxlbWVudCAqL1xuICAgICAgdGhpcy54ICAgICAgPSB4XG4gICAgICB0aGlzLnkgICAgICA9IHlcbiAgICAgIHRoaXMud2lkdGggID0gd2lkdGhcbiAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XG4gICAgICBcbiAgICB9XG4gICAgXG4gIH1cbiAgXG4gIC8vXG4gIFNWRy5leHRlbmQoU1ZHLlZpZXdCb3gsIHtcbiAgICAvLyBQYXJzZSB2aWV3Ym94IHRvIHN0cmluZ1xuICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnggKyAnICcgKyB0aGlzLnkgKyAnICcgKyB0aGlzLndpZHRoICsgJyAnICsgdGhpcy5oZWlnaHRcbiAgICB9XG4gICAgXG4gIH0pXG5cbiAgU1ZHLkJCb3ggPSBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgdmFyIGJveFxuICBcbiAgICAvKiBpbml0aWFsaXplIHplcm8gYm94ICovXG4gICAgdGhpcy54ICAgICAgPSAwXG4gICAgdGhpcy55ICAgICAgPSAwXG4gICAgdGhpcy53aWR0aCAgPSAwXG4gICAgdGhpcy5oZWlnaHQgPSAwXG4gICAgXG4gICAgLyogZ2V0IHZhbHVlcyBpZiBlbGVtZW50IGlzIGdpdmVuICovXG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8qIGFjdHVhbCwgbmF0aXZlIGJvdW5kaW5nIGJveCAqL1xuICAgICAgICBib3ggPSBlbGVtZW50Lm5vZGUuZ2V0QkJveCgpXG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgLyogZmFsbGJhY2sgZm9yIHNvbWUgYnJvd3NlcnMgKi9cbiAgICAgICAgYm94ID0ge1xuICAgICAgICAgIHg6ICAgICAgZWxlbWVudC5ub2RlLmNsaWVudExlZnRcbiAgICAgICAgLCB5OiAgICAgIGVsZW1lbnQubm9kZS5jbGllbnRUb3BcbiAgICAgICAgLCB3aWR0aDogIGVsZW1lbnQubm9kZS5jbGllbnRXaWR0aFxuICAgICAgICAsIGhlaWdodDogZWxlbWVudC5ub2RlLmNsaWVudEhlaWdodFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8qIGluY2x1ZGUgdHJhbnNsYXRpb25zIG9uIHggYW4geSAqL1xuICAgICAgdGhpcy54ID0gYm94LnggKyBlbGVtZW50LnRyYW5zLnhcbiAgICAgIHRoaXMueSA9IGJveC55ICsgZWxlbWVudC50cmFucy55XG4gICAgICBcbiAgICAgIC8qIHBsYWluIHdpZHRoIGFuZCBoZWlnaHQgKi9cbiAgICAgIHRoaXMud2lkdGggID0gYm94LndpZHRoICAqIGVsZW1lbnQudHJhbnMuc2NhbGVYXG4gICAgICB0aGlzLmhlaWdodCA9IGJveC5oZWlnaHQgKiBlbGVtZW50LnRyYW5zLnNjYWxlWVxuICAgIH1cbiAgXG4gICAgLyogYWRkIGNlbnRlciwgcmlnaHQgYW5kIGJvdHRvbSAqL1xuICAgIGJveFByb3BlcnRpZXModGhpcylcbiAgICBcbiAgfVxuICBcbiAgLy9cbiAgU1ZHLmV4dGVuZChTVkcuQkJveCwge1xuICAgIC8vIG1lcmdlIGJvdW5kaW5nIGJveCB3aXRoIGFub3RoZXIsIHJldHVybiBhIG5ldyBpbnN0YW5jZVxuICAgIG1lcmdlOiBmdW5jdGlvbihib3gpIHtcbiAgICAgIHZhciBiID0gbmV3IFNWRy5CQm94KClcbiAgXG4gICAgICAvKiBtZXJnZSBib3ggKi9cbiAgICAgIGIueCAgICAgID0gTWF0aC5taW4odGhpcy54LCBib3gueClcbiAgICAgIGIueSAgICAgID0gTWF0aC5taW4odGhpcy55LCBib3gueSlcbiAgICAgIGIud2lkdGggID0gTWF0aC5tYXgodGhpcy54ICsgdGhpcy53aWR0aCwgIGJveC54ICsgYm94LndpZHRoKSAgLSBiLnhcbiAgICAgIGIuaGVpZ2h0ID0gTWF0aC5tYXgodGhpcy55ICsgdGhpcy5oZWlnaHQsIGJveC55ICsgYm94LmhlaWdodCkgLSBiLnlcbiAgXG4gICAgICAvKiBhZGQgY2VudGVyLCByaWdodCBhbmQgYm90dG9tICovXG4gICAgICBib3hQcm9wZXJ0aWVzKGIpXG4gIFxuICAgICAgcmV0dXJuIGJcbiAgICB9XG4gIFxuICB9KVxuXG4gIFNWRy5SQm94ID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgIHZhciBlLCB6b29tXG4gICAgICAsIGJveCA9IHt9XG4gIFxuICAgIC8qIGluaXRpYWxpemUgemVybyBib3ggKi9cbiAgICB0aGlzLnggICAgICA9IDBcbiAgICB0aGlzLnkgICAgICA9IDBcbiAgICB0aGlzLndpZHRoICA9IDBcbiAgICB0aGlzLmhlaWdodCA9IDBcbiAgICBcbiAgICBpZiAoZWxlbWVudCkge1xuICAgICAgZSA9IGVsZW1lbnQuZG9jKCkucGFyZW50XG4gICAgICB6b29tID0gZWxlbWVudC5kb2MoKS52aWV3Ym94KCkuem9vbVxuICAgICAgXG4gICAgICAvKiBhY3R1YWwsIG5hdGl2ZSBib3VuZGluZyBib3ggKi9cbiAgICAgIGJveCA9IGVsZW1lbnQubm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgXG4gICAgICAvKiBnZXQgc2NyZWVuIG9mZnNldCAqL1xuICAgICAgdGhpcy54ID0gYm94LmxlZnRcbiAgICAgIHRoaXMueSA9IGJveC50b3BcbiAgICAgIFxuICAgICAgLyogc3VidHJhY3QgcGFyZW50IG9mZnNldCAqL1xuICAgICAgdGhpcy54IC09IGUub2Zmc2V0TGVmdFxuICAgICAgdGhpcy55IC09IGUub2Zmc2V0VG9wXG4gICAgICBcbiAgICAgIHdoaWxlIChlID0gZS5vZmZzZXRQYXJlbnQpIHtcbiAgICAgICAgdGhpcy54IC09IGUub2Zmc2V0TGVmdFxuICAgICAgICB0aGlzLnkgLT0gZS5vZmZzZXRUb3BcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLyogY2FsY3VsYXRlIGN1bXVsYXRpdmUgem9vbSBmcm9tIHN2ZyBkb2N1bWVudHMgKi9cbiAgICAgIGUgPSBlbGVtZW50XG4gICAgICB3aGlsZSAoZSA9IGUucGFyZW50KSB7XG4gICAgICAgIGlmIChlLnR5cGUgPT0gJ3N2ZycgJiYgZS52aWV3Ym94KSB7XG4gICAgICAgICAgem9vbSAqPSBlLnZpZXdib3goKS56b29tXG4gICAgICAgICAgdGhpcy54IC09IGUueCgpIHx8IDBcbiAgICAgICAgICB0aGlzLnkgLT0gZS55KCkgfHwgMFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8qIHJlY2FsY3VsYXRlIHZpZXdib3ggZGlzdG9ydGlvbiAqL1xuICAgIHRoaXMueCAvPSB6b29tXG4gICAgdGhpcy55IC89IHpvb21cbiAgICB0aGlzLndpZHRoICA9IGJveC53aWR0aCAgLz0gem9vbVxuICAgIHRoaXMuaGVpZ2h0ID0gYm94LmhlaWdodCAvPSB6b29tXG4gICAgXG4gICAgLyogYWRkIGNlbnRlciwgcmlnaHQgYW5kIGJvdHRvbSAqL1xuICAgIGJveFByb3BlcnRpZXModGhpcylcbiAgICBcbiAgfVxuICBcbiAgLy9cbiAgU1ZHLmV4dGVuZChTVkcuUkJveCwge1xuICAgIC8vIG1lcmdlIHJlY3QgYm94IHdpdGggYW5vdGhlciwgcmV0dXJuIGEgbmV3IGluc3RhbmNlXG4gICAgbWVyZ2U6IGZ1bmN0aW9uKGJveCkge1xuICAgICAgdmFyIGIgPSBuZXcgU1ZHLlJCb3goKVxuICBcbiAgICAgIC8qIG1lcmdlIGJveCAqL1xuICAgICAgYi54ICAgICAgPSBNYXRoLm1pbih0aGlzLngsIGJveC54KVxuICAgICAgYi55ICAgICAgPSBNYXRoLm1pbih0aGlzLnksIGJveC55KVxuICAgICAgYi53aWR0aCAgPSBNYXRoLm1heCh0aGlzLnggKyB0aGlzLndpZHRoLCAgYm94LnggKyBib3gud2lkdGgpICAtIGIueFxuICAgICAgYi5oZWlnaHQgPSBNYXRoLm1heCh0aGlzLnkgKyB0aGlzLmhlaWdodCwgYm94LnkgKyBib3guaGVpZ2h0KSAtIGIueVxuICBcbiAgICAgIC8qIGFkZCBjZW50ZXIsIHJpZ2h0IGFuZCBib3R0b20gKi9cbiAgICAgIGJveFByb3BlcnRpZXMoYilcbiAgXG4gICAgICByZXR1cm4gYlxuICAgIH1cbiAgXG4gIH0pXG5cbiAgU1ZHLkVsZW1lbnQgPSBTVkcuaW52ZW50KHtcbiAgICAvLyBJbml0aWFsaXplIG5vZGVcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgIC8qIG1ha2Ugc3Ryb2tlIHZhbHVlIGFjY2Vzc2libGUgZHluYW1pY2FsbHkgKi9cbiAgICAgIHRoaXMuX3N0cm9rZSA9IFNWRy5kZWZhdWx0cy5hdHRycy5zdHJva2VcbiAgXG4gICAgICAvKiBpbml0aWFsaXplIHRyYW5zZm9ybWF0aW9uIHN0b3JlIHdpdGggZGVmYXVsdHMgKi9cbiAgICAgIHRoaXMudHJhbnMgPSBTVkcuZGVmYXVsdHMudHJhbnMoKVxuICAgICAgXG4gICAgICAvKiBjcmVhdGUgY2lyY3VsYXIgcmVmZXJlbmNlICovXG4gICAgICBpZiAodGhpcy5ub2RlID0gbm9kZSkge1xuICAgICAgICB0aGlzLnR5cGUgPSBub2RlLm5vZGVOYW1lXG4gICAgICAgIHRoaXMubm9kZS5pbnN0YW5jZSA9IHRoaXNcbiAgICAgIH1cbiAgICB9XG4gIFxuICAgIC8vIEFkZCBjbGFzcyBtZXRob2RzXG4gICwgZXh0ZW5kOiB7XG4gICAgICAvLyBNb3ZlIG92ZXIgeC1heGlzXG4gICAgICB4OiBmdW5jdGlvbih4KSB7XG4gICAgICAgIGlmICh4ICE9IG51bGwpIHtcbiAgICAgICAgICB4ID0gbmV3IFNWRy5OdW1iZXIoeClcbiAgICAgICAgICB4LnZhbHVlIC89IHRoaXMudHJhbnMuc2NhbGVYXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cigneCcsIHgpXG4gICAgICB9XG4gICAgICAvLyBNb3ZlIG92ZXIgeS1heGlzXG4gICAgLCB5OiBmdW5jdGlvbih5KSB7XG4gICAgICAgIGlmICh5ICE9IG51bGwpIHtcbiAgICAgICAgICB5ID0gbmV3IFNWRy5OdW1iZXIoeSlcbiAgICAgICAgICB5LnZhbHVlIC89IHRoaXMudHJhbnMuc2NhbGVZXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cigneScsIHkpXG4gICAgICB9XG4gICAgICAvLyBNb3ZlIGJ5IGNlbnRlciBvdmVyIHgtYXhpc1xuICAgICwgY3g6IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgcmV0dXJuIHggPT0gbnVsbCA/IHRoaXMueCgpICsgdGhpcy53aWR0aCgpIC8gMiA6IHRoaXMueCh4IC0gdGhpcy53aWR0aCgpIC8gMilcbiAgICAgIH1cbiAgICAgIC8vIE1vdmUgYnkgY2VudGVyIG92ZXIgeS1heGlzXG4gICAgLCBjeTogZnVuY3Rpb24oeSkge1xuICAgICAgICByZXR1cm4geSA9PSBudWxsID8gdGhpcy55KCkgKyB0aGlzLmhlaWdodCgpIC8gMiA6IHRoaXMueSh5IC0gdGhpcy5oZWlnaHQoKSAvIDIpXG4gICAgICB9XG4gICAgICAvLyBNb3ZlIGVsZW1lbnQgdG8gZ2l2ZW4geCBhbmQgeSB2YWx1ZXNcbiAgICAsIG1vdmU6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCh4KS55KHkpXG4gICAgICB9XG4gICAgICAvLyBNb3ZlIGVsZW1lbnQgYnkgaXRzIGNlbnRlclxuICAgICwgY2VudGVyOiBmdW5jdGlvbih4LCB5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN4KHgpLmN5KHkpXG4gICAgICB9XG4gICAgICAvLyBTZXQgd2lkdGggb2YgZWxlbWVudFxuICAgICwgd2lkdGg6IGZ1bmN0aW9uKHdpZHRoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF0dHIoJ3dpZHRoJywgd2lkdGgpXG4gICAgICB9XG4gICAgICAvLyBTZXQgaGVpZ2h0IG9mIGVsZW1lbnRcbiAgICAsIGhlaWdodDogZnVuY3Rpb24oaGVpZ2h0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgICAgIH1cbiAgICAgIC8vIFNldCBlbGVtZW50IHNpemUgdG8gZ2l2ZW4gd2lkdGggYW5kIGhlaWdodFxuICAgICwgc2l6ZTogZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgICAgICB2YXIgcCA9IHByb3BvcnRpb25hbFNpemUodGhpcy5iYm94KCksIHdpZHRoLCBoZWlnaHQpXG4gIFxuICAgICAgICByZXR1cm4gdGhpcy5hdHRyKHtcbiAgICAgICAgICB3aWR0aDogIG5ldyBTVkcuTnVtYmVyKHAud2lkdGgpXG4gICAgICAgICwgaGVpZ2h0OiBuZXcgU1ZHLk51bWJlcihwLmhlaWdodClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIC8vIENsb25lIGVsZW1lbnRcbiAgICAsIGNsb25lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNsb25lICwgYXR0clxuICAgICAgICAgICwgdHlwZSA9IHRoaXMudHlwZVxuICAgICAgICBcbiAgICAgICAgLyogaW52b2tlIHNoYXBlIG1ldGhvZCB3aXRoIHNoYXBlLXNwZWNpZmljIGFyZ3VtZW50cyAqL1xuICAgICAgICBjbG9uZSA9IHR5cGUgPT0gJ3JlY3QnIHx8IHR5cGUgPT0gJ2VsbGlwc2UnID9cbiAgICAgICAgICB0aGlzLnBhcmVudFt0eXBlXSgwLDApIDpcbiAgICAgICAgdHlwZSA9PSAnbGluZScgP1xuICAgICAgICAgIHRoaXMucGFyZW50W3R5cGVdKDAsMCwwLDApIDpcbiAgICAgICAgdHlwZSA9PSAnaW1hZ2UnID9cbiAgICAgICAgICB0aGlzLnBhcmVudFt0eXBlXSh0aGlzLnNyYykgOlxuICAgICAgICB0eXBlID09ICd0ZXh0JyA/XG4gICAgICAgICAgdGhpcy5wYXJlbnRbdHlwZV0odGhpcy5jb250ZW50KSA6XG4gICAgICAgIHR5cGUgPT0gJ3BhdGgnID9cbiAgICAgICAgICB0aGlzLnBhcmVudFt0eXBlXSh0aGlzLmF0dHIoJ2QnKSkgOlxuICAgICAgICB0eXBlID09ICdwb2x5bGluZScgfHwgdHlwZSA9PSAncG9seWdvbicgP1xuICAgICAgICAgIHRoaXMucGFyZW50W3R5cGVdKHRoaXMuYXR0cigncG9pbnRzJykpIDpcbiAgICAgICAgdHlwZSA9PSAnZycgP1xuICAgICAgICAgIHRoaXMucGFyZW50Lmdyb3VwKCkgOlxuICAgICAgICAgIHRoaXMucGFyZW50W3R5cGVdKClcbiAgICAgICAgXG4gICAgICAgIC8qIGFwcGx5IGF0dHJpYnV0ZXMgYXR0cmlidXRlcyAqL1xuICAgICAgICBhdHRyID0gdGhpcy5hdHRyKClcbiAgICAgICAgZGVsZXRlIGF0dHIuaWRcbiAgICAgICAgY2xvbmUuYXR0cihhdHRyKVxuICAgICAgICBcbiAgICAgICAgLyogY29weSB0cmFuc2Zvcm1hdGlvbnMgKi9cbiAgICAgICAgY2xvbmUudHJhbnMgPSB0aGlzLnRyYW5zXG4gICAgICAgIFxuICAgICAgICAvKiBhcHBseSBhdHRyaWJ1dGVzIGFuZCB0cmFuc2xhdGlvbnMgKi9cbiAgICAgICAgcmV0dXJuIGNsb25lLnRyYW5zZm9ybSh7fSlcbiAgICAgIH1cbiAgICAgIC8vIFJlbW92ZSBlbGVtZW50XG4gICAgLCByZW1vdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5wYXJlbnQpXG4gICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlRWxlbWVudCh0aGlzKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICAgIC8vIFJlcGxhY2UgZWxlbWVudFxuICAgICwgcmVwbGFjZTogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICB0aGlzLmFmdGVyKGVsZW1lbnQpLnJlbW92ZSgpXG4gIFxuICAgICAgICByZXR1cm4gZWxlbWVudFxuICAgICAgfVxuICAgICAgLy8gQWRkIGVsZW1lbnQgdG8gZ2l2ZW4gY29udGFpbmVyIGFuZCByZXR1cm4gc2VsZlxuICAgICwgYWRkVG86IGZ1bmN0aW9uKHBhcmVudCkge1xuICAgICAgICByZXR1cm4gcGFyZW50LnB1dCh0aGlzKVxuICAgICAgfVxuICAgICAgLy8gQWRkIGVsZW1lbnQgdG8gZ2l2ZW4gY29udGFpbmVyIGFuZCByZXR1cm4gY29udGFpbmVyXG4gICAgLCBwdXRJbjogZnVuY3Rpb24ocGFyZW50KSB7XG4gICAgICAgIHJldHVybiBwYXJlbnQuYWRkKHRoaXMpXG4gICAgICB9XG4gICAgICAvLyBHZXQgcGFyZW50IGRvY3VtZW50XG4gICAgLCBkb2M6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudCh0eXBlIHx8IFNWRy5Eb2MpXG4gICAgICB9XG4gICAgICAvLyBTZXQgc3ZnIGVsZW1lbnQgYXR0cmlidXRlXG4gICAgLCBhdHRyOiBmdW5jdGlvbihhLCB2LCBuKSB7XG4gICAgICAgIGlmIChhID09IG51bGwpIHtcbiAgICAgICAgICAvKiBnZXQgYW4gb2JqZWN0IG9mIGF0dHJpYnV0ZXMgKi9cbiAgICAgICAgICBhID0ge31cbiAgICAgICAgICB2ID0gdGhpcy5ub2RlLmF0dHJpYnV0ZXNcbiAgICAgICAgICBmb3IgKG4gPSB2Lmxlbmd0aCAtIDE7IG4gPj0gMDsgbi0tKVxuICAgICAgICAgICAgYVt2W25dLm5vZGVOYW1lXSA9IFNWRy5yZWdleC5pc051bWJlci50ZXN0KHZbbl0ubm9kZVZhbHVlKSA/IHBhcnNlRmxvYXQodltuXS5ub2RlVmFsdWUpIDogdltuXS5ub2RlVmFsdWVcbiAgICAgICAgICBcbiAgICAgICAgICByZXR1cm4gYVxuICAgICAgICAgIFxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBhID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgLyogYXBwbHkgZXZlcnkgYXR0cmlidXRlIGluZGl2aWR1YWxseSBpZiBhbiBvYmplY3QgaXMgcGFzc2VkICovXG4gICAgICAgICAgZm9yICh2IGluIGEpIHRoaXMuYXR0cih2LCBhW3ZdKVxuICAgICAgICAgIFxuICAgICAgICB9IGVsc2UgaWYgKHYgPT09IG51bGwpIHtcbiAgICAgICAgICAgIC8qIHJlbW92ZSB2YWx1ZSAqL1xuICAgICAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUF0dHJpYnV0ZShhKVxuICAgICAgICAgIFxuICAgICAgICB9IGVsc2UgaWYgKHYgPT0gbnVsbCkge1xuICAgICAgICAgIC8qIGFjdCBhcyBhIGdldHRlciBpZiB0aGUgZmlyc3QgYW5kIG9ubHkgYXJndW1lbnQgaXMgbm90IGFuIG9iamVjdCAqL1xuICAgICAgICAgIHYgPSB0aGlzLm5vZGUuZ2V0QXR0cmlidXRlKGEpXG4gICAgICAgICAgcmV0dXJuIHYgPT0gbnVsbCA/IFxuICAgICAgICAgICAgU1ZHLmRlZmF1bHRzLmF0dHJzW2FdIDpcbiAgICAgICAgICBTVkcucmVnZXguaXNOdW1iZXIudGVzdCh2KSA/XG4gICAgICAgICAgICBwYXJzZUZsb2F0KHYpIDogdlxuICAgICAgICBcbiAgICAgICAgfSBlbHNlIGlmIChhID09ICdzdHlsZScpIHtcbiAgICAgICAgICAvKiByZWRpcmVjdCB0byB0aGUgc3R5bGUgbWV0aG9kICovXG4gICAgICAgICAgcmV0dXJuIHRoaXMuc3R5bGUodilcbiAgICAgICAgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLyogQlVHIEZJWDogc29tZSBicm93c2VycyB3aWxsIHJlbmRlciBhIHN0cm9rZSBpZiBhIGNvbG9yIGlzIGdpdmVuIGV2ZW4gdGhvdWdoIHN0cm9rZSB3aWR0aCBpcyAwICovXG4gICAgICAgICAgaWYgKGEgPT0gJ3N0cm9rZS13aWR0aCcpXG4gICAgICAgICAgICB0aGlzLmF0dHIoJ3N0cm9rZScsIHBhcnNlRmxvYXQodikgPiAwID8gdGhpcy5fc3Ryb2tlIDogbnVsbClcbiAgICAgICAgICBlbHNlIGlmIChhID09ICdzdHJva2UnKVxuICAgICAgICAgICAgdGhpcy5fc3Ryb2tlID0gdlxuICBcbiAgICAgICAgICAvKiBjb252ZXJ0IGltYWdlIGZpbGwgYW5kIHN0cm9rZSB0byBwYXR0ZXJucyAqL1xuICAgICAgICAgIGlmIChhID09ICdmaWxsJyB8fCBhID09ICdzdHJva2UnKSB7XG4gICAgICAgICAgICBpZiAoU1ZHLnJlZ2V4LmlzSW1hZ2UudGVzdCh2KSlcbiAgICAgICAgICAgICAgdiA9IHRoaXMuZG9jKCkuZGVmcygpLmltYWdlKHYsIDAsIDApXG4gIFxuICAgICAgICAgICAgaWYgKHYgaW5zdGFuY2VvZiBTVkcuSW1hZ2UpXG4gICAgICAgICAgICAgIHYgPSB0aGlzLmRvYygpLmRlZnMoKS5wYXR0ZXJuKDAsIDAsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRkKHYpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC8qIGVuc3VyZSBjb3JyZWN0IG51bWVyaWMgdmFsdWVzIChhbHNvIGFjY2VwdHMgTmFOIGFuZCBJbmZpbml0eSkgKi9cbiAgICAgICAgICBpZiAodHlwZW9mIHYgPT09ICdudW1iZXInKVxuICAgICAgICAgICAgdiA9IG5ldyBTVkcuTnVtYmVyKHYpXG4gIFxuICAgICAgICAgIC8qIGVuc3VyZSBmdWxsIGhleCBjb2xvciAqL1xuICAgICAgICAgIGVsc2UgaWYgKFNWRy5Db2xvci5pc0NvbG9yKHYpKVxuICAgICAgICAgICAgdiA9IG5ldyBTVkcuQ29sb3IodilcbiAgICAgICAgICBcbiAgICAgICAgICAvKiBwYXJzZSBhcnJheSB2YWx1ZXMgKi9cbiAgICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHYpKVxuICAgICAgICAgICAgdiA9IG5ldyBTVkcuQXJyYXkodilcbiAgXG4gICAgICAgICAgLyogaWYgdGhlIHBhc3NlZCBhdHRyaWJ1dGUgaXMgbGVhZGluZy4uLiAqL1xuICAgICAgICAgIGlmIChhID09ICdsZWFkaW5nJykge1xuICAgICAgICAgICAgLyogLi4uIGNhbGwgdGhlIGxlYWRpbmcgbWV0aG9kIGluc3RlYWQgKi9cbiAgICAgICAgICAgIGlmICh0aGlzLmxlYWRpbmcpXG4gICAgICAgICAgICAgIHRoaXMubGVhZGluZyh2KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvKiBzZXQgZ2l2ZW4gYXR0cmlidXRlIG9uIG5vZGUgKi9cbiAgICAgICAgICAgIHR5cGVvZiBuID09PSAnc3RyaW5nJyA/XG4gICAgICAgICAgICAgIHRoaXMubm9kZS5zZXRBdHRyaWJ1dGVOUyhuLCBhLCB2LnRvU3RyaW5nKCkpIDpcbiAgICAgICAgICAgICAgdGhpcy5ub2RlLnNldEF0dHJpYnV0ZShhLCB2LnRvU3RyaW5nKCkpXG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICAgIC8qIHJlYnVpbGQgaWYgcmVxdWlyZWQgKi9cbiAgICAgICAgICBpZiAodGhpcy5yZWJ1aWxkICYmIChhID09ICdmb250LXNpemUnIHx8IGEgPT0gJ3gnKSlcbiAgICAgICAgICAgIHRoaXMucmVidWlsZChhLCB2KVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICAgICAgLy8gTWFuYWdlIHRyYW5zZm9ybWF0aW9uc1xuICAgICwgdHJhbnNmb3JtOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgLyogYWN0IGFzIGEgZ2V0dGVyIGlmIG5vIGFyZ3VtZW50IGlzIGdpdmVuICovXG4gICAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNcbiAgICAgICAgICBcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAvKiBhY3QgYXMgYSBnZXR0ZXIgaWYgb25seSBvbmUgc3RyaW5nIGFyZ3VtZW50IGlzIGdpdmVuICovXG4gICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAyKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNbb11cbiAgICAgICAgICBcbiAgICAgICAgICAvKiBhcHBseSB0cmFuc2Zvcm1hdGlvbnMgYXMgb2JqZWN0IGlmIGtleSB2YWx1ZSBhcmd1bWVudHMgYXJlIGdpdmVuKi9cbiAgICAgICAgICB2YXIgdHJhbnNmb3JtID0ge31cbiAgICAgICAgICB0cmFuc2Zvcm1bb10gPSB2XG4gICAgICAgICAgXG4gICAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtKHRyYW5zZm9ybSlcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLyogLi4uIG90aGVyd2lzZSBjb250aW51ZSBhcyBhIHNldHRlciAqL1xuICAgICAgICB2YXIgdHJhbnNmb3JtID0gW11cbiAgICAgICAgXG4gICAgICAgIC8qIHBhcnNlIG1hdHJpeCAqL1xuICAgICAgICBvID0gcGFyc2VNYXRyaXgobylcbiAgICAgICAgXG4gICAgICAgIC8qIG1lcmdlIHZhbHVlcyAqL1xuICAgICAgICBmb3IgKHYgaW4gbylcbiAgICAgICAgICBpZiAob1t2XSAhPSBudWxsKVxuICAgICAgICAgICAgdGhpcy50cmFuc1t2XSA9IG9bdl1cbiAgICAgICAgXG4gICAgICAgIC8qIGNvbXBpbGUgbWF0cml4ICovXG4gICAgICAgIHRoaXMudHJhbnMubWF0cml4ID0gdGhpcy50cmFucy5hXG4gICAgICAgICAgICAgICAgICAgICsgJyAnICsgdGhpcy50cmFucy5iXG4gICAgICAgICAgICAgICAgICAgICsgJyAnICsgdGhpcy50cmFucy5jXG4gICAgICAgICAgICAgICAgICAgICsgJyAnICsgdGhpcy50cmFucy5kXG4gICAgICAgICAgICAgICAgICAgICsgJyAnICsgdGhpcy50cmFucy5lXG4gICAgICAgICAgICAgICAgICAgICsgJyAnICsgdGhpcy50cmFucy5mXG4gICAgICAgIFxuICAgICAgICAvKiBhbGlhcyBjdXJyZW50IHRyYW5zZm9ybWF0aW9ucyAqL1xuICAgICAgICBvID0gdGhpcy50cmFuc1xuICAgICAgICBcbiAgICAgICAgLyogYWRkIG1hdHJpeCAqL1xuICAgICAgICBpZiAoby5tYXRyaXggIT0gU1ZHLmRlZmF1bHRzLm1hdHJpeClcbiAgICAgICAgICB0cmFuc2Zvcm0ucHVzaCgnbWF0cml4KCcgKyBvLm1hdHJpeCArICcpJylcbiAgICAgICAgXG4gICAgICAgIC8qIGFkZCByb3RhdGlvbiAqL1xuICAgICAgICBpZiAoby5yb3RhdGlvbiAhPSAwKVxuICAgICAgICAgIHRyYW5zZm9ybS5wdXNoKCdyb3RhdGUoJyArIG8ucm90YXRpb24gKyAnICcgKyAoby5jeCA9PSBudWxsID8gdGhpcy5iYm94KCkuY3ggOiBvLmN4KSArICcgJyArIChvLmN5ID09IG51bGwgPyB0aGlzLmJib3goKS5jeSA6IG8uY3kpICsgJyknKVxuICAgICAgICBcbiAgICAgICAgLyogYWRkIHNjYWxlICovXG4gICAgICAgIGlmIChvLnNjYWxlWCAhPSAxIHx8IG8uc2NhbGVZICE9IDEpXG4gICAgICAgICAgdHJhbnNmb3JtLnB1c2goJ3NjYWxlKCcgKyBvLnNjYWxlWCArICcgJyArIG8uc2NhbGVZICsgJyknKVxuICAgICAgICBcbiAgICAgICAgLyogYWRkIHNrZXcgb24geCBheGlzICovXG4gICAgICAgIGlmIChvLnNrZXdYICE9IDApXG4gICAgICAgICAgdHJhbnNmb3JtLnB1c2goJ3NrZXdYKCcgKyBvLnNrZXdYICsgJyknKVxuICAgICAgICBcbiAgICAgICAgLyogYWRkIHNrZXcgb24geSBheGlzICovXG4gICAgICAgIGlmIChvLnNrZXdZICE9IDApXG4gICAgICAgICAgdHJhbnNmb3JtLnB1c2goJ3NrZXdZKCcgKyBvLnNrZXdZICsgJyknKVxuICAgICAgICBcbiAgICAgICAgLyogYWRkIHRyYW5zbGF0aW9uICovXG4gICAgICAgIGlmIChvLnggIT0gMCB8fCBvLnkgIT0gMClcbiAgICAgICAgICB0cmFuc2Zvcm0ucHVzaCgndHJhbnNsYXRlKCcgKyBuZXcgU1ZHLk51bWJlcihvLnggLyBvLnNjYWxlWCkgKyAnICcgKyBuZXcgU1ZHLk51bWJlcihvLnkgLyBvLnNjYWxlWSkgKyAnKScpXG4gICAgICAgIFxuICAgICAgICAvKiB1cGRhdGUgdHJhbnNmb3JtYXRpb25zLCBldmVuIGlmIHRoZXJlIGFyZSBub25lICovXG4gICAgICAgIGlmICh0cmFuc2Zvcm0ubGVuZ3RoID09IDApXG4gICAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUF0dHJpYnV0ZSgndHJhbnNmb3JtJylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRoaXMubm9kZS5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsIHRyYW5zZm9ybS5qb2luKCcgJykpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICAgICAgLy8gRHluYW1pYyBzdHlsZSBnZW5lcmF0b3JcbiAgICAsIHN0eWxlOiBmdW5jdGlvbihzLCB2KSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAvKiBnZXQgZnVsbCBzdHlsZSAqL1xuICAgICAgICAgIHJldHVybiB0aGlzLm5vZGUuc3R5bGUuY3NzVGV4dCB8fCAnJ1xuICAgICAgICBcbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgICAgIC8qIGFwcGx5IGV2ZXJ5IHN0eWxlIGluZGl2aWR1YWxseSBpZiBhbiBvYmplY3QgaXMgcGFzc2VkICovXG4gICAgICAgICAgaWYgKHR5cGVvZiBzID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBmb3IgKHYgaW4gcykgdGhpcy5zdHlsZSh2LCBzW3ZdKVxuICAgICAgICAgIFxuICAgICAgICAgIH0gZWxzZSBpZiAoU1ZHLnJlZ2V4LmlzQ3NzLnRlc3QocykpIHtcbiAgICAgICAgICAgIC8qIHBhcnNlIGNzcyBzdHJpbmcgKi9cbiAgICAgICAgICAgIHMgPSBzLnNwbGl0KCc7JylcbiAgXG4gICAgICAgICAgICAvKiBhcHBseSBldmVyeSBkZWZpbml0aW9uIGluZGl2aWR1YWxseSAqL1xuICAgICAgICAgICAgZm9yICh2ID0gMDsgdiA8IHMubGVuZ3RoOyB2KyspIHtcbiAgICAgICAgICAgICAgdiA9IHNbdl0uc3BsaXQoJzonKVxuICAgICAgICAgICAgICB0aGlzLnN0eWxlKHZbMF0ucmVwbGFjZSgvXFxzKy9nLCAnJyksIHZbMV0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8qIGFjdCBhcyBhIGdldHRlciBpZiB0aGUgZmlyc3QgYW5kIG9ubHkgYXJndW1lbnQgaXMgbm90IGFuIG9iamVjdCAqL1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5zdHlsZVtjYW1lbENhc2UocyldXG4gICAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm5vZGUuc3R5bGVbY2FtZWxDYXNlKHMpXSA9IHYgPT09IG51bGwgfHwgU1ZHLnJlZ2V4LmlzQmxhbmsudGVzdCh2KSA/IG51bGwgOiB2XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICB9XG4gICAgICAvLyBHZXQgYm91bmRpbmcgYm94XG4gICAgLCBiYm94OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTVkcuQkJveCh0aGlzKVxuICAgICAgfVxuICAgICAgLy8gR2V0IHJlY3QgYm94XG4gICAgLCByYm94OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTVkcuUkJveCh0aGlzKVxuICAgICAgfVxuICAgICAgLy8gQ2hlY2tzIHdoZXRoZXIgdGhlIGdpdmVuIHBvaW50IGluc2lkZSB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBlbGVtZW50XG4gICAgLCBpbnNpZGU6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgICAgdmFyIGJveCA9IHRoaXMuYmJveCgpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4geCA+IGJveC54XG4gICAgICAgICAgICAmJiB5ID4gYm94LnlcbiAgICAgICAgICAgICYmIHggPCBib3gueCArIGJveC53aWR0aFxuICAgICAgICAgICAgJiYgeSA8IGJveC55ICsgYm94LmhlaWdodFxuICAgICAgfVxuICAgICAgLy8gU2hvdyBlbGVtZW50XG4gICAgLCBzaG93OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3R5bGUoJ2Rpc3BsYXknLCAnJylcbiAgICAgIH1cbiAgICAgIC8vIEhpZGUgZWxlbWVudFxuICAgICwgaGlkZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0eWxlKCdkaXNwbGF5JywgJ25vbmUnKVxuICAgICAgfVxuICAgICAgLy8gSXMgZWxlbWVudCB2aXNpYmxlP1xuICAgICwgdmlzaWJsZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0eWxlKCdkaXNwbGF5JykgIT0gJ25vbmUnXG4gICAgICB9XG4gICAgICAvLyBSZXR1cm4gaWQgb24gc3RyaW5nIGNvbnZlcnNpb25cbiAgICAsIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cignaWQnKVxuICAgICAgfVxuICAgICAgLy8gUHJpdmF0ZTogZmluZCBzdmcgcGFyZW50IGJ5IGluc3RhbmNlXG4gICAgLCBfcGFyZW50OiBmdW5jdGlvbihwYXJlbnQpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzXG4gICAgICAgIFxuICAgICAgICB3aGlsZSAoZWxlbWVudCAhPSBudWxsICYmICEoZWxlbWVudCBpbnN0YW5jZW9mIHBhcmVudCkpXG4gICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50XG4gIFxuICAgICAgICByZXR1cm4gZWxlbWVudFxuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICBTVkcuUGFyZW50ID0gU1ZHLmludmVudCh7XG4gICAgLy8gSW5pdGlhbGl6ZSBub2RlXG4gICAgY3JlYXRlOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICB0aGlzLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgZWxlbWVudClcbiAgICB9XG4gIFxuICAgIC8vIEluaGVyaXQgZnJvbVxuICAsIGluaGVyaXQ6IFNWRy5FbGVtZW50XG4gIFxuICAgIC8vIEFkZCBjbGFzcyBtZXRob2RzXG4gICwgZXh0ZW5kOiB7XG4gICAgICAvLyBSZXR1cm5zIGFsbCBjaGlsZCBlbGVtZW50c1xuICAgICAgY2hpbGRyZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW4gfHwgKHRoaXMuX2NoaWxkcmVuID0gW10pXG4gICAgICB9XG4gICAgICAvLyBBZGQgZ2l2ZW4gZWxlbWVudCBhdCBhIHBvc2l0aW9uXG4gICAgLCBhZGQ6IGZ1bmN0aW9uKGVsZW1lbnQsIGkpIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhcyhlbGVtZW50KSkge1xuICAgICAgICAgIC8qIGRlZmluZSBpbnNlcnRpb24gaW5kZXggaWYgbm9uZSBnaXZlbiAqL1xuICAgICAgICAgIGkgPSBpID09IG51bGwgPyB0aGlzLmNoaWxkcmVuKCkubGVuZ3RoIDogaVxuICAgICAgICAgIFxuICAgICAgICAgIC8qIHJlbW92ZSByZWZlcmVuY2VzIGZyb20gcHJldmlvdXMgcGFyZW50ICovXG4gICAgICAgICAgaWYgKGVsZW1lbnQucGFyZW50KVxuICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQuY2hpbGRyZW4oKS5zcGxpY2UoZWxlbWVudC5wYXJlbnQuaW5kZXgoZWxlbWVudCksIDEpXG4gICAgICAgICAgXG4gICAgICAgICAgLyogYWRkIGVsZW1lbnQgcmVmZXJlbmNlcyAqL1xuICAgICAgICAgIHRoaXMuY2hpbGRyZW4oKS5zcGxpY2UoaSwgMCwgZWxlbWVudClcbiAgICAgICAgICB0aGlzLm5vZGUuaW5zZXJ0QmVmb3JlKGVsZW1lbnQubm9kZSwgdGhpcy5ub2RlLmNoaWxkTm9kZXNbaV0gfHwgbnVsbClcbiAgICAgICAgICBlbGVtZW50LnBhcmVudCA9IHRoaXNcbiAgICAgICAgfVxuICBcbiAgICAgICAgLyogcmVwb3NpdGlvbiBkZWZzICovXG4gICAgICAgIGlmICh0aGlzLl9kZWZzKSB7XG4gICAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUNoaWxkKHRoaXMuX2RlZnMubm9kZSlcbiAgICAgICAgICB0aGlzLm5vZGUuYXBwZW5kQ2hpbGQodGhpcy5fZGVmcy5ub2RlKVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICAgICAgLy8gQmFzaWNhbGx5IGRvZXMgdGhlIHNhbWUgYXMgYGFkZCgpYCBidXQgcmV0dXJucyB0aGUgYWRkZWQgZWxlbWVudCBpbnN0ZWFkXG4gICAgLCBwdXQ6IGZ1bmN0aW9uKGVsZW1lbnQsIGkpIHtcbiAgICAgICAgdGhpcy5hZGQoZWxlbWVudCwgaSlcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRcbiAgICAgIH1cbiAgICAgIC8vIENoZWNrcyBpZiB0aGUgZ2l2ZW4gZWxlbWVudCBpcyBhIGNoaWxkXG4gICAgLCBoYXM6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXgoZWxlbWVudCkgPj0gMFxuICAgICAgfVxuICAgICAgLy8gR2V0cyBpbmRleCBvZiBnaXZlbiBlbGVtZW50XG4gICAgLCBpbmRleDogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbigpLmluZGV4T2YoZWxlbWVudClcbiAgICAgIH1cbiAgICAgIC8vIEdldCBhIGVsZW1lbnQgYXQgdGhlIGdpdmVuIGluZGV4XG4gICAgLCBnZXQ6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4oKVtpXVxuICAgICAgfVxuICAgICAgLy8gR2V0IGZpcnN0IGNoaWxkLCBza2lwcGluZyB0aGUgZGVmcyBub2RlXG4gICAgLCBmaXJzdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuKClbMF1cbiAgICAgIH1cbiAgICAgIC8vIEdldCB0aGUgbGFzdCBjaGlsZFxuICAgICwgbGFzdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuKClbdGhpcy5jaGlsZHJlbigpLmxlbmd0aCAtIDFdXG4gICAgICB9XG4gICAgICAvLyBJdGVyYXRlcyBvdmVyIGFsbCBjaGlsZHJlbiBhbmQgaW52b2tlcyBhIGdpdmVuIGJsb2NrXG4gICAgLCBlYWNoOiBmdW5jdGlvbihibG9jaywgZGVlcCkge1xuICAgICAgICB2YXIgaSwgaWxcbiAgICAgICAgICAsIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbigpXG4gICAgICAgIFxuICAgICAgICBmb3IgKGkgPSAwLCBpbCA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICAgICAgICBpZiAoY2hpbGRyZW5baV0gaW5zdGFuY2VvZiBTVkcuRWxlbWVudClcbiAgICAgICAgICAgIGJsb2NrLmFwcGx5KGNoaWxkcmVuW2ldLCBbaSwgY2hpbGRyZW5dKVxuICBcbiAgICAgICAgICBpZiAoZGVlcCAmJiAoY2hpbGRyZW5baV0gaW5zdGFuY2VvZiBTVkcuQ29udGFpbmVyKSlcbiAgICAgICAgICAgIGNoaWxkcmVuW2ldLmVhY2goYmxvY2ssIGRlZXApXG4gICAgICAgIH1cbiAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICAgICAgLy8gUmVtb3ZlIGEgY2hpbGQgZWxlbWVudCBhdCBhIHBvc2l0aW9uXG4gICAgLCByZW1vdmVFbGVtZW50OiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4oKS5zcGxpY2UodGhpcy5pbmRleChlbGVtZW50KSwgMSlcbiAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQubm9kZSlcbiAgICAgICAgZWxlbWVudC5wYXJlbnQgPSBudWxsXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICAgICAgLy8gUmVtb3ZlIGFsbCBlbGVtZW50cyBpbiB0aGlzIGNvbnRhaW5lclxuICAgICwgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvKiByZW1vdmUgY2hpbGRyZW4gKi9cbiAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMuY2hpbGRyZW4oKS5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcbiAgICAgICAgICB0aGlzLnJlbW92ZUVsZW1lbnQodGhpcy5jaGlsZHJlbigpW2ldKVxuICBcbiAgICAgICAgLyogcmVtb3ZlIGRlZnMgbm9kZSAqL1xuICAgICAgICBpZiAodGhpcy5fZGVmcylcbiAgICAgICAgICB0aGlzLl9kZWZzLmNsZWFyKClcbiAgXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICB9XG4gICAgICwgLy8gR2V0IGRlZnNcbiAgICAgIGRlZnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kb2MoKS5kZWZzKClcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gIH0pXG5cblxuICBTVkcuQ29udGFpbmVyID0gU1ZHLmludmVudCh7XG4gICAgLy8gSW5pdGlhbGl6ZSBub2RlXG4gICAgY3JlYXRlOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICB0aGlzLmNvbnN0cnVjdG9yLmNhbGwodGhpcywgZWxlbWVudClcbiAgICB9XG4gIFxuICAgIC8vIEluaGVyaXQgZnJvbVxuICAsIGluaGVyaXQ6IFNWRy5QYXJlbnRcbiAgXG4gICAgLy8gQWRkIGNsYXNzIG1ldGhvZHNcbiAgLCBleHRlbmQ6IHtcbiAgICAgIC8vIEdldCB0aGUgdmlld0JveCBhbmQgY2FsY3VsYXRlIHRoZSB6b29tIHZhbHVlXG4gICAgICB2aWV3Ym94OiBmdW5jdGlvbih2KSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDApXG4gICAgICAgICAgLyogYWN0IGFzIGEgZ2V0dGVyIGlmIHRoZXJlIGFyZSBubyBhcmd1bWVudHMgKi9cbiAgICAgICAgICByZXR1cm4gbmV3IFNWRy5WaWV3Qm94KHRoaXMpXG4gICAgICAgIFxuICAgICAgICAvKiBvdGhlcndpc2UgYWN0IGFzIGEgc2V0dGVyICovXG4gICAgICAgIHYgPSBhcmd1bWVudHMubGVuZ3RoID09IDEgP1xuICAgICAgICAgIFt2LngsIHYueSwgdi53aWR0aCwgdi5oZWlnaHRdIDpcbiAgICAgICAgICBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGlzLmF0dHIoJ3ZpZXdCb3gnLCB2KVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgfSlcblxuICBTVkcuRlggPSBTVkcuaW52ZW50KHtcbiAgICAvLyBJbml0aWFsaXplIEZYIG9iamVjdFxuICAgIGNyZWF0ZTogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgLyogc3RvcmUgdGFyZ2V0IGVsZW1lbnQgKi9cbiAgICAgIHRoaXMudGFyZ2V0ID0gZWxlbWVudFxuICAgIH1cbiAgXG4gICAgLy8gQWRkIGNsYXNzIG1ldGhvZHNcbiAgLCBleHRlbmQ6IHtcbiAgICAgIC8vIEFkZCBhbmltYXRpb24gcGFyYW1ldGVycyBhbmQgc3RhcnQgYW5pbWF0aW9uXG4gICAgICBhbmltYXRlOiBmdW5jdGlvbihkLCBlYXNlLCBkZWxheSkge1xuICAgICAgICB2YXIgYWtleXMsIHRrZXlzLCBza2V5cywga2V5XG4gICAgICAgICAgLCBlbGVtZW50ID0gdGhpcy50YXJnZXRcbiAgICAgICAgICAsIGZ4ID0gdGhpc1xuICAgICAgICBcbiAgICAgICAgLyogZGlzc2VjdCBvYmplY3QgaWYgb25lIGlzIHBhc3NlZCAqL1xuICAgICAgICBpZiAodHlwZW9mIGQgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBkZWxheSA9IGQuZGVsYXlcbiAgICAgICAgICBlYXNlID0gZC5lYXNlXG4gICAgICAgICAgZCA9IGQuZHVyYXRpb25cbiAgICAgICAgfVxuICBcbiAgICAgICAgLyogZW5zdXJlIGRlZmF1bHQgZHVyYXRpb24gYW5kIGVhc2luZyAqL1xuICAgICAgICBkID0gZCA9PSAnPScgPyBkIDogZCA9PSBudWxsID8gMTAwMCA6IG5ldyBTVkcuTnVtYmVyKGQpLnZhbHVlT2YoKVxuICAgICAgICBlYXNlID0gZWFzZSB8fCAnPD4nXG4gIFxuICAgICAgICAvKiBwcm9jZXNzIHZhbHVlcyAqL1xuICAgICAgICBmeC50byA9IGZ1bmN0aW9uKHBvcykge1xuICAgICAgICAgIHZhciBpXG4gIFxuICAgICAgICAgIC8qIG5vcm1hbGlzZSBwb3MgKi9cbiAgICAgICAgICBwb3MgPSBwb3MgPCAwID8gMCA6IHBvcyA+IDEgPyAxIDogcG9zXG4gIFxuICAgICAgICAgIC8qIGNvbGxlY3QgYXR0cmlidXRlIGtleXMgKi9cbiAgICAgICAgICBpZiAoYWtleXMgPT0gbnVsbCkge1xuICAgICAgICAgICAgYWtleXMgPSBbXVxuICAgICAgICAgICAgZm9yIChrZXkgaW4gZnguYXR0cnMpXG4gICAgICAgICAgICAgIGFrZXlzLnB1c2goa2V5KVxuICBcbiAgICAgICAgICAgIC8qIG1ha2Ugc3VyZSBtb3JwaGFibGUgZWxlbWVudHMgYXJlIHNjYWxlZCwgdHJhbnNsYXRlZCBhbmQgbW9ycGhlZCBhbGwgdG9nZXRoZXIgKi9cbiAgICAgICAgICAgIGlmIChlbGVtZW50Lm1vcnBoQXJyYXkgJiYgKGZ4Ll9wbG90IHx8IGFrZXlzLmluZGV4T2YoJ3BvaW50cycpID4gLTEpKSB7XG4gICAgICAgICAgICAgIC8qIGdldCBkZXN0aW5hdGlvbiAqL1xuICAgICAgICAgICAgICB2YXIgYm94XG4gICAgICAgICAgICAgICAgLCBwID0gbmV3IGVsZW1lbnQubW9ycGhBcnJheShmeC5fcGxvdCB8fCBmeC5hdHRycy5wb2ludHMgfHwgZWxlbWVudC5hcnJheSlcbiAgXG4gICAgICAgICAgICAgIC8qIGFkZCBzaXplICovXG4gICAgICAgICAgICAgIGlmIChmeC5fc2l6ZSkgcC5zaXplKGZ4Ll9zaXplLndpZHRoLnRvLCBmeC5fc2l6ZS5oZWlnaHQudG8pXG4gIFxuICAgICAgICAgICAgICAvKiBhZGQgbW92ZW1lbnQgKi9cbiAgICAgICAgICAgICAgYm94ID0gcC5iYm94KClcbiAgICAgICAgICAgICAgaWYgKGZ4Ll94KSBwLm1vdmUoZnguX3gudG8sIGJveC55KVxuICAgICAgICAgICAgICBlbHNlIGlmIChmeC5fY3gpIHAubW92ZShmeC5fY3gudG8gLSBib3gud2lkdGggLyAyLCBib3gueSlcbiAgXG4gICAgICAgICAgICAgIGJveCA9IHAuYmJveCgpXG4gICAgICAgICAgICAgIGlmIChmeC5feSkgcC5tb3ZlKGJveC54LCBmeC5feS50bylcbiAgICAgICAgICAgICAgZWxzZSBpZiAoZnguX2N5KSBwLm1vdmUoYm94LngsIGZ4Ll9jeS50byAtIGJveC5oZWlnaHQgLyAyKVxuICBcbiAgICAgICAgICAgICAgLyogZGVsZXRlIGVsZW1lbnQgb3JpZW50ZWQgY2hhbmdlcyAqL1xuICAgICAgICAgICAgICBkZWxldGUgZnguX3hcbiAgICAgICAgICAgICAgZGVsZXRlIGZ4Ll95XG4gICAgICAgICAgICAgIGRlbGV0ZSBmeC5fY3hcbiAgICAgICAgICAgICAgZGVsZXRlIGZ4Ll9jeVxuICAgICAgICAgICAgICBkZWxldGUgZnguX3NpemVcbiAgXG4gICAgICAgICAgICAgIGZ4Ll9wbG90ID0gZWxlbWVudC5hcnJheS5tb3JwaChwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgLyogY29sbGVjdCB0cmFuc2Zvcm1hdGlvbiBrZXlzICovXG4gICAgICAgICAgaWYgKHRrZXlzID09IG51bGwpIHtcbiAgICAgICAgICAgIHRrZXlzID0gW11cbiAgICAgICAgICAgIGZvciAoa2V5IGluIGZ4LnRyYW5zKVxuICAgICAgICAgICAgICB0a2V5cy5wdXNoKGtleSlcbiAgICAgICAgICB9XG4gIFxuICAgICAgICAgIC8qIGNvbGxlY3Qgc3R5bGUga2V5cyAqL1xuICAgICAgICAgIGlmIChza2V5cyA9PSBudWxsKSB7XG4gICAgICAgICAgICBza2V5cyA9IFtdXG4gICAgICAgICAgICBmb3IgKGtleSBpbiBmeC5zdHlsZXMpXG4gICAgICAgICAgICAgIHNrZXlzLnB1c2goa2V5KVxuICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgLyogYXBwbHkgZWFzaW5nICovXG4gICAgICAgICAgcG9zID0gZWFzZSA9PSAnPD4nID9cbiAgICAgICAgICAgICgtTWF0aC5jb3MocG9zICogTWF0aC5QSSkgLyAyKSArIDAuNSA6XG4gICAgICAgICAgZWFzZSA9PSAnPicgP1xuICAgICAgICAgICAgTWF0aC5zaW4ocG9zICogTWF0aC5QSSAvIDIpIDpcbiAgICAgICAgICBlYXNlID09ICc8JyA/XG4gICAgICAgICAgICAtTWF0aC5jb3MocG9zICogTWF0aC5QSSAvIDIpICsgMSA6XG4gICAgICAgICAgZWFzZSA9PSAnLScgP1xuICAgICAgICAgICAgcG9zIDpcbiAgICAgICAgICB0eXBlb2YgZWFzZSA9PSAnZnVuY3Rpb24nID9cbiAgICAgICAgICAgIGVhc2UocG9zKSA6XG4gICAgICAgICAgICBwb3NcbiAgICAgICAgICBcbiAgICAgICAgICAvKiBydW4gcGxvdCBmdW5jdGlvbiAqL1xuICAgICAgICAgIGlmIChmeC5fcGxvdCkge1xuICAgICAgICAgICAgZWxlbWVudC5wbG90KGZ4Ll9wbG90LmF0KHBvcykpXG4gIFxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvKiBydW4gYWxsIHgtcG9zaXRpb24gcHJvcGVydGllcyAqL1xuICAgICAgICAgICAgaWYgKGZ4Ll94KVxuICAgICAgICAgICAgICBlbGVtZW50LngoZnguX3guYXQocG9zKSlcbiAgICAgICAgICAgIGVsc2UgaWYgKGZ4Ll9jeClcbiAgICAgICAgICAgICAgZWxlbWVudC5jeChmeC5fY3guYXQocG9zKSlcbiAgXG4gICAgICAgICAgICAvKiBydW4gYWxsIHktcG9zaXRpb24gcHJvcGVydGllcyAqL1xuICAgICAgICAgICAgaWYgKGZ4Ll95KVxuICAgICAgICAgICAgICBlbGVtZW50LnkoZnguX3kuYXQocG9zKSlcbiAgICAgICAgICAgIGVsc2UgaWYgKGZ4Ll9jeSlcbiAgICAgICAgICAgICAgZWxlbWVudC5jeShmeC5fY3kuYXQocG9zKSlcbiAgXG4gICAgICAgICAgICAvKiBydW4gYWxsIHNpemUgcHJvcGVydGllcyAqL1xuICAgICAgICAgICAgaWYgKGZ4Ll9zaXplKVxuICAgICAgICAgICAgICBlbGVtZW50LnNpemUoZnguX3NpemUud2lkdGguYXQocG9zKSwgZnguX3NpemUuaGVpZ2h0LmF0KHBvcykpXG4gICAgICAgICAgfVxuICBcbiAgICAgICAgICAvKiBydW4gYWxsIHZpZXdib3ggcHJvcGVydGllcyAqL1xuICAgICAgICAgIGlmIChmeC5fdmlld2JveClcbiAgICAgICAgICAgIGVsZW1lbnQudmlld2JveChcbiAgICAgICAgICAgICAgZnguX3ZpZXdib3gueC5hdChwb3MpXG4gICAgICAgICAgICAsIGZ4Ll92aWV3Ym94LnkuYXQocG9zKVxuICAgICAgICAgICAgLCBmeC5fdmlld2JveC53aWR0aC5hdChwb3MpXG4gICAgICAgICAgICAsIGZ4Ll92aWV3Ym94LmhlaWdodC5hdChwb3MpXG4gICAgICAgICAgICApXG4gIFxuICAgICAgICAgIC8qIHJ1biBsZWFkaW5nIHByb3BlcnR5ICovXG4gICAgICAgICAgaWYgKGZ4Ll9sZWFkaW5nKVxuICAgICAgICAgICAgZWxlbWVudC5sZWFkaW5nKGZ4Ll9sZWFkaW5nLmF0KHBvcykpXG4gIFxuICAgICAgICAgIC8qIGFuaW1hdGUgYXR0cmlidXRlcyAqL1xuICAgICAgICAgIGZvciAoaSA9IGFrZXlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICAgICAgZWxlbWVudC5hdHRyKGFrZXlzW2ldLCBhdChmeC5hdHRyc1tha2V5c1tpXV0sIHBvcykpXG4gIFxuICAgICAgICAgIC8qIGFuaW1hdGUgdHJhbnNmb3JtYXRpb25zICovXG4gICAgICAgICAgZm9yIChpID0gdGtleXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXG4gICAgICAgICAgICBlbGVtZW50LnRyYW5zZm9ybSh0a2V5c1tpXSwgYXQoZngudHJhbnNbdGtleXNbaV1dLCBwb3MpKVxuICBcbiAgICAgICAgICAvKiBhbmltYXRlIHN0eWxlcyAqL1xuICAgICAgICAgIGZvciAoaSA9IHNrZXlzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICAgICAgZWxlbWVudC5zdHlsZShza2V5c1tpXSwgYXQoZnguc3R5bGVzW3NrZXlzW2ldXSwgcG9zKSlcbiAgXG4gICAgICAgICAgLyogY2FsbGJhY2sgZm9yIGVhY2gga2V5ZnJhbWUgKi9cbiAgICAgICAgICBpZiAoZnguX2R1cmluZylcbiAgICAgICAgICAgIGZ4Ll9kdXJpbmcuY2FsbChlbGVtZW50LCBwb3MsIGZ1bmN0aW9uKGZyb20sIHRvKSB7XG4gICAgICAgICAgICAgIHJldHVybiBhdCh7IGZyb206IGZyb20sIHRvOiB0byB9LCBwb3MpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAodHlwZW9mIGQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgLyogZGVsYXkgYW5pbWF0aW9uICovXG4gICAgICAgICAgdGhpcy50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gIFxuICAgICAgICAgICAgLyogaW5pdGlhbGl6ZSBzaXR1YXRpb24gb2JqZWN0ICovXG4gICAgICAgICAgICBmeC5zaXR1YXRpb24gPSB7XG4gICAgICAgICAgICAgIGludGVydmFsOiAxMDAwIC8gNjBcbiAgICAgICAgICAgICwgc3RhcnQ6ICAgIHN0YXJ0XG4gICAgICAgICAgICAsIHBsYXk6ICAgICB0cnVlXG4gICAgICAgICAgICAsIGZpbmlzaDogICBzdGFydCArIGRcbiAgICAgICAgICAgICwgZHVyYXRpb246IGRcbiAgICAgICAgICAgIH1cbiAgXG4gICAgICAgICAgICAvKiByZW5kZXIgZnVuY3Rpb24gKi9cbiAgICAgICAgICAgIGZ4LnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgaWYgKGZ4LnNpdHVhdGlvbi5wbGF5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBjb2RlIHdhcyBib3Jyb3dlZCBmcm9tIHRoZSBlbWlsZS5qcyBtaWNybyBmcmFtZXdvcmsgYnkgVGhvbWFzIEZ1Y2hzLCBha2EgTWFkUm9iYnkuXG4gICAgICAgICAgICAgICAgdmFyIHRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICAgICAgICAgICAgICAgICAgLCBwb3MgPSB0aW1lID4gZnguc2l0dWF0aW9uLmZpbmlzaCA/IDEgOiAodGltZSAtIGZ4LnNpdHVhdGlvbi5zdGFydCkgLyBkXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLyogcHJvY2VzcyB2YWx1ZXMgKi9cbiAgICAgICAgICAgICAgICBmeC50byhwb3MpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLyogZmluaXNoIG9mZiBhbmltYXRpb24gKi9cbiAgICAgICAgICAgICAgICBpZiAodGltZSA+IGZ4LnNpdHVhdGlvbi5maW5pc2gpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChmeC5fcGxvdClcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5wbG90KG5ldyBTVkcuUG9pbnRBcnJheShmeC5fcGxvdC5kZXN0aW5hdGlvbikuc2V0dGxlKCkpXG4gIFxuICAgICAgICAgICAgICAgICAgaWYgKGZ4Ll9sb29wID09PSB0cnVlIHx8ICh0eXBlb2YgZnguX2xvb3AgPT0gJ251bWJlcicgJiYgZnguX2xvb3AgPiAxKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZ4Ll9sb29wID09ICdudW1iZXInKVxuICAgICAgICAgICAgICAgICAgICAgIC0tZnguX2xvb3BcbiAgICAgICAgICAgICAgICAgICAgZnguYW5pbWF0ZShkLCBlYXNlLCBkZWxheSlcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZ4Ll9hZnRlciA/IGZ4Ll9hZnRlci5hcHBseShlbGVtZW50LCBbZnhdKSA6IGZ4LnN0b3AoKVxuICAgICAgICAgICAgICAgICAgfVxuICBcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1GcmFtZShmeC5yZW5kZXIpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltRnJhbWUoZngucmVuZGVyKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICBcbiAgICAgICAgICAgIC8qIHN0YXJ0IGFuaW1hdGlvbiAqL1xuICAgICAgICAgICAgZngucmVuZGVyKClcbiAgICAgICAgICAgIFxuICAgICAgICAgIH0sIG5ldyBTVkcuTnVtYmVyKGRlbGF5KS52YWx1ZU9mKCkpXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICB9XG4gICAgICAvLyBHZXQgYm91bmRpbmcgYm94IG9mIHRhcmdldCBlbGVtZW50XG4gICAgLCBiYm94OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0LmJib3goKVxuICAgICAgfVxuICAgICAgLy8gQWRkIGFuaW1hdGFibGUgYXR0cmlidXRlc1xuICAgICwgYXR0cjogZnVuY3Rpb24oYSwgdikge1xuICAgICAgICBpZiAodHlwZW9mIGEgPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gYSlcbiAgICAgICAgICAgIHRoaXMuYXR0cihrZXksIGFba2V5XSlcbiAgICAgICAgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGZyb20gPSB0aGlzLnRhcmdldC5hdHRyKGEpXG4gIFxuICAgICAgICAgIHRoaXMuYXR0cnNbYV0gPSBTVkcuQ29sb3IuaXNDb2xvcihmcm9tKSA/XG4gICAgICAgICAgICBuZXcgU1ZHLkNvbG9yKGZyb20pLm1vcnBoKHYpIDpcbiAgICAgICAgICBTVkcucmVnZXgudW5pdC50ZXN0KGZyb20pID9cbiAgICAgICAgICAgIG5ldyBTVkcuTnVtYmVyKGZyb20pLm1vcnBoKHYpIDpcbiAgICAgICAgICAgIHsgZnJvbTogZnJvbSwgdG86IHYgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICAgICAgLy8gQWRkIGFuaW1hdGFibGUgdHJhbnNmb3JtYXRpb25zXG4gICAgLCB0cmFuc2Zvcm06IGZ1bmN0aW9uKG8sIHYpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSkge1xuICAgICAgICAgIC8qIHBhcnNlIG1hdHJpeCBzdHJpbmcgKi9cbiAgICAgICAgICBvID0gcGFyc2VNYXRyaXgobylcbiAgICAgICAgICBcbiAgICAgICAgICAvKiBkbGV0ZSBtYXRyaXhzdHJpbmcgZnJvbSBvYmplY3QgKi9cbiAgICAgICAgICBkZWxldGUgby5tYXRyaXhcbiAgICAgICAgICBcbiAgICAgICAgICAvKiBzdG9yZSBtYXRyaXggdmFsdWVzICovXG4gICAgICAgICAgZm9yICh2IGluIG8pXG4gICAgICAgICAgICB0aGlzLnRyYW5zW3ZdID0geyBmcm9tOiB0aGlzLnRhcmdldC50cmFuc1t2XSwgdG86IG9bdl0gfVxuICAgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qIGFwcGx5IHRyYW5zZm9ybWF0aW9ucyBhcyBvYmplY3QgaWYga2V5IHZhbHVlIGFyZ3VtZW50cyBhcmUgZ2l2ZW4qL1xuICAgICAgICAgIHZhciB0cmFuc2Zvcm0gPSB7fVxuICAgICAgICAgIHRyYW5zZm9ybVtvXSA9IHZcbiAgICAgICAgICBcbiAgICAgICAgICB0aGlzLnRyYW5zZm9ybSh0cmFuc2Zvcm0pXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICB9XG4gICAgICAvLyBBZGQgYW5pbWF0YWJsZSBzdHlsZXNcbiAgICAsIHN0eWxlOiBmdW5jdGlvbihzLCB2KSB7XG4gICAgICAgIGlmICh0eXBlb2YgcyA9PSAnb2JqZWN0JylcbiAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcylcbiAgICAgICAgICAgIHRoaXMuc3R5bGUoa2V5LCBzW2tleV0pXG4gICAgICAgIFxuICAgICAgICBlbHNlXG4gICAgICAgICAgdGhpcy5zdHlsZXNbc10gPSB7IGZyb206IHRoaXMudGFyZ2V0LnN0eWxlKHMpLCB0bzogdiB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICAgICAgLy8gQW5pbWF0YWJsZSB4LWF4aXNcbiAgICAsIHg6IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgdGhpcy5feCA9IG5ldyBTVkcuTnVtYmVyKHRoaXMudGFyZ2V0LngoKSkubW9ycGgoeClcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICB9XG4gICAgICAvLyBBbmltYXRhYmxlIHktYXhpc1xuICAgICwgeTogZnVuY3Rpb24oeSkge1xuICAgICAgICB0aGlzLl95ID0gbmV3IFNWRy5OdW1iZXIodGhpcy50YXJnZXQueSgpKS5tb3JwaCh5KVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICAgIC8vIEFuaW1hdGFibGUgY2VudGVyIHgtYXhpc1xuICAgICwgY3g6IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgdGhpcy5fY3ggPSBuZXcgU1ZHLk51bWJlcih0aGlzLnRhcmdldC5jeCgpKS5tb3JwaCh4KVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICAgIC8vIEFuaW1hdGFibGUgY2VudGVyIHktYXhpc1xuICAgICwgY3k6IGZ1bmN0aW9uKHkpIHtcbiAgICAgICAgdGhpcy5fY3kgPSBuZXcgU1ZHLk51bWJlcih0aGlzLnRhcmdldC5jeSgpKS5tb3JwaCh5KVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICAgIC8vIEFkZCBhbmltYXRhYmxlIG1vdmVcbiAgICAsIG1vdmU6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCh4KS55KHkpXG4gICAgICB9XG4gICAgICAvLyBBZGQgYW5pbWF0YWJsZSBjZW50ZXJcbiAgICAsIGNlbnRlcjogZnVuY3Rpb24oeCwgeSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jeCh4KS5jeSh5KVxuICAgICAgfVxuICAgICAgLy8gQWRkIGFuaW1hdGFibGUgc2l6ZVxuICAgICwgc2l6ZTogZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgICAgICBpZiAodGhpcy50YXJnZXQgaW5zdGFuY2VvZiBTVkcuVGV4dCkge1xuICAgICAgICAgIC8qIGFuaW1hdGUgZm9udCBzaXplIGZvciBUZXh0IGVsZW1lbnRzICovXG4gICAgICAgICAgdGhpcy5hdHRyKCdmb250LXNpemUnLCB3aWR0aClcbiAgICAgICAgICBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvKiBhbmltYXRlIGJib3ggYmFzZWQgc2l6ZSBmb3IgYWxsIG90aGVyIGVsZW1lbnRzICovXG4gICAgICAgICAgdmFyIGJveCA9IHRoaXMudGFyZ2V0LmJib3goKVxuICBcbiAgICAgICAgICB0aGlzLl9zaXplID0ge1xuICAgICAgICAgICAgd2lkdGg6ICBuZXcgU1ZHLk51bWJlcihib3gud2lkdGgpLm1vcnBoKHdpZHRoKVxuICAgICAgICAgICwgaGVpZ2h0OiBuZXcgU1ZHLk51bWJlcihib3guaGVpZ2h0KS5tb3JwaChoZWlnaHQpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICAgICAgLy8gQWRkIGFuaW1hdGFibGUgcGxvdFxuICAgICwgcGxvdDogZnVuY3Rpb24ocCkge1xuICAgICAgICB0aGlzLl9wbG90ID0gcFxuICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICAgIC8vIEFkZCBsZWFkaW5nIG1ldGhvZFxuICAgICwgbGVhZGluZzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0Ll9sZWFkaW5nKVxuICAgICAgICAgIHRoaXMuX2xlYWRpbmcgPSBuZXcgU1ZHLk51bWJlcih0aGlzLnRhcmdldC5fbGVhZGluZykubW9ycGgodmFsdWUpXG4gIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICAgICAgLy8gQWRkIGFuaW1hdGFibGUgdmlld2JveFxuICAgICwgdmlld2JveDogZnVuY3Rpb24oeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICBpZiAodGhpcy50YXJnZXQgaW5zdGFuY2VvZiBTVkcuQ29udGFpbmVyKSB7XG4gICAgICAgICAgdmFyIGJveCA9IHRoaXMudGFyZ2V0LnZpZXdib3goKVxuICAgICAgICAgIFxuICAgICAgICAgIHRoaXMuX3ZpZXdib3ggPSB7XG4gICAgICAgICAgICB4OiAgICAgIG5ldyBTVkcuTnVtYmVyKGJveC54KS5tb3JwaCh4KVxuICAgICAgICAgICwgeTogICAgICBuZXcgU1ZHLk51bWJlcihib3gueSkubW9ycGgoeSlcbiAgICAgICAgICAsIHdpZHRoOiAgbmV3IFNWRy5OdW1iZXIoYm94LndpZHRoKS5tb3JwaCh3aWR0aClcbiAgICAgICAgICAsIGhlaWdodDogbmV3IFNWRy5OdW1iZXIoYm94LmhlaWdodCkubW9ycGgoaGVpZ2h0KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICAgIC8vIEFkZCBhbmltYXRlYWJsZSBncmFkaWVudCB1cGRhdGVcbiAgICAsIHVwZGF0ZTogZnVuY3Rpb24obykge1xuICAgICAgICBpZiAodGhpcy50YXJnZXQgaW5zdGFuY2VvZiBTVkcuU3RvcCkge1xuICAgICAgICAgIGlmIChvLm9wYWNpdHkgIT0gbnVsbCkgdGhpcy5hdHRyKCdzdG9wLW9wYWNpdHknLCBvLm9wYWNpdHkpXG4gICAgICAgICAgaWYgKG8uY29sb3IgICAhPSBudWxsKSB0aGlzLmF0dHIoJ3N0b3AtY29sb3InLCBvLmNvbG9yKVxuICAgICAgICAgIGlmIChvLm9mZnNldCAgIT0gbnVsbCkgdGhpcy5hdHRyKCdvZmZzZXQnLCBuZXcgU1ZHLk51bWJlcihvLm9mZnNldCkpXG4gICAgICAgIH1cbiAgXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICB9XG4gICAgICAvLyBBZGQgY2FsbGJhY2sgZm9yIGVhY2gga2V5ZnJhbWVcbiAgICAsIGR1cmluZzogZnVuY3Rpb24oZHVyaW5nKSB7XG4gICAgICAgIHRoaXMuX2R1cmluZyA9IGR1cmluZ1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICAgIC8vIENhbGxiYWNrIGFmdGVyIGFuaW1hdGlvblxuICAgICwgYWZ0ZXI6IGZ1bmN0aW9uKGFmdGVyKSB7XG4gICAgICAgIHRoaXMuX2FmdGVyID0gYWZ0ZXJcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICB9XG4gICAgICAvLyBNYWtlIGxvb3BhYmxlXG4gICAgLCBsb29wOiBmdW5jdGlvbih0aW1lcykge1xuICAgICAgICB0aGlzLl9sb29wID0gdGltZXMgfHwgdHJ1ZVxuICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICAgIC8vIFN0b3AgcnVubmluZyBhbmltYXRpb25cbiAgICAsIHN0b3A6IGZ1bmN0aW9uKGZ1bGZpbGwpIHtcbiAgICAgICAgLyogZnVsZmlsbCBhbmltYXRpb24gKi9cbiAgICAgICAgaWYgKGZ1bGZpbGwgPT09IHRydWUpIHtcbiAgICAgICAgICB0aGlzLmFuaW1hdGUoMClcbiAgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLyogc3RvcCBjdXJyZW50IGFuaW1hdGlvbiAqL1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpXG4gIFxuICAgICAgICAgIC8qIHJlc2V0IHN0b3JhZ2UgZm9yIHByb3BlcnRpZXMgdGhhdCBuZWVkIGFuaW1hdGlvbiAqL1xuICAgICAgICAgIHRoaXMuYXR0cnMgICAgID0ge31cbiAgICAgICAgICB0aGlzLnRyYW5zICAgICA9IHt9XG4gICAgICAgICAgdGhpcy5zdHlsZXMgICAgPSB7fVxuICAgICAgICAgIHRoaXMuc2l0dWF0aW9uID0ge31cbiAgXG4gICAgICAgICAgLyogZGVsZXRlIGRlc3RpbmF0aW9ucyAqL1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl94XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX3lcbiAgICAgICAgICBkZWxldGUgdGhpcy5fY3hcbiAgICAgICAgICBkZWxldGUgdGhpcy5fY3lcbiAgICAgICAgICBkZWxldGUgdGhpcy5fc2l6ZVxuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wbG90XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX2xvb3BcbiAgICAgICAgICBkZWxldGUgdGhpcy5fYWZ0ZXJcbiAgICAgICAgICBkZWxldGUgdGhpcy5fZHVyaW5nXG4gICAgICAgICAgZGVsZXRlIHRoaXMuX2xlYWRpbmdcbiAgICAgICAgICBkZWxldGUgdGhpcy5fdmlld2JveFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICAgICAgLy8gUGF1c2UgcnVubmluZyBhbmltYXRpb25cbiAgICAsIHBhdXNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuc2l0dWF0aW9uLnBsYXkgPT09IHRydWUpIHtcbiAgICAgICAgICB0aGlzLnNpdHVhdGlvbi5wbGF5ICA9IGZhbHNlXG4gICAgICAgICAgdGhpcy5zaXR1YXRpb24ucGF1c2UgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKVxuICAgICAgICB9XG4gIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICAgICAgLy8gUGxheSBydW5uaW5nIGFuaW1hdGlvblxuICAgICwgcGxheTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnNpdHVhdGlvbi5wbGF5ID09PSBmYWxzZSkge1xuICAgICAgICAgIHZhciBwYXVzZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5zaXR1YXRpb24ucGF1c2VcbiAgICAgICAgICBcbiAgICAgICAgICB0aGlzLnNpdHVhdGlvbi5maW5pc2ggKz0gcGF1c2VcbiAgICAgICAgICB0aGlzLnNpdHVhdGlvbi5zdGFydCAgKz0gcGF1c2VcbiAgICAgICAgICB0aGlzLnNpdHVhdGlvbi5wbGF5ICAgID0gdHJ1ZVxuICAgICAgICB9XG4gIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICAgICAgXG4gICAgfVxuICBcbiAgICAvLyBEZWZpbmUgcGFyZW50IGNsYXNzXG4gICwgcGFyZW50OiBTVkcuRWxlbWVudFxuICBcbiAgICAvLyBBZGQgbWV0aG9kIHRvIHBhcmVudCBlbGVtZW50c1xuICAsIGNvbnN0cnVjdDoge1xuICAgICAgLy8gR2V0IGZ4IG1vZHVsZSBvciBjcmVhdGUgYSBuZXcgb25lLCB0aGVuIGFuaW1hdGUgd2l0aCBnaXZlbiBkdXJhdGlvbiBhbmQgZWFzZVxuICAgICAgYW5pbWF0ZTogZnVuY3Rpb24oZCwgZWFzZSwgZGVsYXkpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmZ4IHx8ICh0aGlzLmZ4ID0gbmV3IFNWRy5GWCh0aGlzKSkpLnN0b3AoKS5hbmltYXRlKGQsIGVhc2UsIGRlbGF5KVxuICAgICAgfVxuICAgICAgLy8gU3RvcCBjdXJyZW50IGFuaW1hdGlvbjsgdGhpcyBpcyBhbiBhbGlhcyB0byB0aGUgZnggaW5zdGFuY2VcbiAgICAsIHN0b3A6IGZ1bmN0aW9uKGZ1bGZpbGwpIHtcbiAgICAgICAgaWYgKHRoaXMuZngpXG4gICAgICAgICAgdGhpcy5meC5zdG9wKGZ1bGZpbGwpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICAgICAgLy8gUGF1c2UgY3VycmVudCBhbmltYXRpb25cbiAgICAsIHBhdXNlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuZngpXG4gICAgICAgICAgdGhpcy5meC5wYXVzZSgpXG4gIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICAgICAgLy8gUGxheSBwYXVzZWQgY3VycmVudCBhbmltYXRpb25cbiAgICAsIHBsYXk6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5meClcbiAgICAgICAgICB0aGlzLmZ4LnBsYXkoKVxuICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICAgIFxuICAgIH1cbiAgfSlcblxuICBTVkcuZXh0ZW5kKFNWRy5FbGVtZW50LCBTVkcuRlgsIHtcbiAgICAvLyBSZWxhdGl2ZSBtb3ZlIG92ZXIgeCBheGlzXG4gICAgZHg6IGZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiB0aGlzLngoKHRoaXMudGFyZ2V0IHx8IHRoaXMpLngoKSArIHgpXG4gICAgfVxuICAgIC8vIFJlbGF0aXZlIG1vdmUgb3ZlciB5IGF4aXNcbiAgLCBkeTogZnVuY3Rpb24oeSkge1xuICAgICAgcmV0dXJuIHRoaXMueSgodGhpcy50YXJnZXQgfHwgdGhpcykueSgpICsgeSlcbiAgICB9XG4gICAgLy8gUmVsYXRpdmUgbW92ZSBvdmVyIHggYW5kIHkgYXhlc1xuICAsIGRtb3ZlOiBmdW5jdGlvbih4LCB5KSB7XG4gICAgICByZXR1cm4gdGhpcy5keCh4KS5keSh5KVxuICAgIH1cbiAgXG4gIH0pXG5cbiAgO1sgICdjbGljaydcbiAgICAsICdkYmxjbGljaydcbiAgICAsICdtb3VzZWRvd24nXG4gICAgLCAnbW91c2V1cCdcbiAgICAsICdtb3VzZW92ZXInXG4gICAgLCAnbW91c2VvdXQnXG4gICAgLCAnbW91c2Vtb3ZlJ1xuICAgICwgJ21vdXNlZW50ZXInXG4gICAgLCAnbW91c2VsZWF2ZSdcbiAgICAsICd0b3VjaHN0YXJ0J1xuICAgICwgJ3RvdWNobW92ZSdcbiAgICAsICd0b3VjaGxlYXZlJ1xuICAgICwgJ3RvdWNoZW5kJ1xuICAgICwgJ3RvdWNoY2FuY2VsJyBdLmZvckVhY2goZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBcbiAgICAvKiBhZGQgZXZlbnQgdG8gU1ZHLkVsZW1lbnQgKi9cbiAgICBTVkcuRWxlbWVudC5wcm90b3R5cGVbZXZlbnRdID0gZnVuY3Rpb24oZikge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICBcbiAgICAgIC8qIGJpbmQgZXZlbnQgdG8gZWxlbWVudCByYXRoZXIgdGhhbiBlbGVtZW50IG5vZGUgKi9cbiAgICAgIHRoaXMubm9kZVsnb24nICsgZXZlbnRdID0gdHlwZW9mIGYgPT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gZi5hcHBseShzZWxmLCBhcmd1bWVudHMpIH0gOiBudWxsXG4gICAgICBcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIFxuICB9KVxuICBcbiAgLy8gQWRkIGV2ZW50IGJpbmRlciBpbiB0aGUgU1ZHIG5hbWVzcGFjZVxuICBTVkcub24gPSBmdW5jdGlvbihub2RlLCBldmVudCwgbGlzdGVuZXIpIHtcbiAgICBpZiAobm9kZS5hZGRFdmVudExpc3RlbmVyKVxuICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgZmFsc2UpXG4gICAgZWxzZVxuICAgICAgbm9kZS5hdHRhY2hFdmVudCgnb24nICsgZXZlbnQsIGxpc3RlbmVyKVxuICB9XG4gIFxuICAvLyBBZGQgZXZlbnQgdW5iaW5kZXIgaW4gdGhlIFNWRyBuYW1lc3BhY2VcbiAgU1ZHLm9mZiA9IGZ1bmN0aW9uKG5vZGUsIGV2ZW50LCBsaXN0ZW5lcikge1xuICAgIGlmIChub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIpXG4gICAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBmYWxzZSlcbiAgICBlbHNlXG4gICAgICBub2RlLmRldGFjaEV2ZW50KCdvbicgKyBldmVudCwgbGlzdGVuZXIpXG4gIH1cbiAgXG4gIC8vXG4gIFNWRy5leHRlbmQoU1ZHLkVsZW1lbnQsIHtcbiAgICAvLyBCaW5kIGdpdmVuIGV2ZW50IHRvIGxpc3RlbmVyXG4gICAgb246IGZ1bmN0aW9uKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgICAgU1ZHLm9uKHRoaXMubm9kZSwgZXZlbnQsIGxpc3RlbmVyKVxuICAgICAgXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICAvLyBVbmJpbmQgZXZlbnQgZnJvbSBsaXN0ZW5lclxuICAsIG9mZjogZnVuY3Rpb24oZXZlbnQsIGxpc3RlbmVyKSB7XG4gICAgICBTVkcub2ZmKHRoaXMubm9kZSwgZXZlbnQsIGxpc3RlbmVyKVxuICAgICAgXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgfSlcblxuICBTVkcuRGVmcyA9IFNWRy5pbnZlbnQoe1xuICAgIC8vIEluaXRpYWxpemUgbm9kZVxuICAgIGNyZWF0ZTogJ2RlZnMnXG4gIFxuICAgIC8vIEluaGVyaXQgZnJvbVxuICAsIGluaGVyaXQ6IFNWRy5Db250YWluZXJcbiAgfSlcblxuICBTVkcuRyA9IFNWRy5pbnZlbnQoe1xuICAgIC8vIEluaXRpYWxpemUgbm9kZVxuICAgIGNyZWF0ZTogJ2cnXG4gIFxuICAgIC8vIEluaGVyaXQgZnJvbVxuICAsIGluaGVyaXQ6IFNWRy5Db250YWluZXJcbiAgICBcbiAgICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xuICAsIGV4dGVuZDoge1xuICAgICAgLy8gTW92ZSBvdmVyIHgtYXhpc1xuICAgICAgeDogZnVuY3Rpb24oeCkge1xuICAgICAgICByZXR1cm4geCA9PSBudWxsID8gdGhpcy50cmFucy54IDogdGhpcy50cmFuc2Zvcm0oJ3gnLCB4KVxuICAgICAgfVxuICAgICAgLy8gTW92ZSBvdmVyIHktYXhpc1xuICAgICwgeTogZnVuY3Rpb24oeSkge1xuICAgICAgICByZXR1cm4geSA9PSBudWxsID8gdGhpcy50cmFucy55IDogdGhpcy50cmFuc2Zvcm0oJ3knLCB5KVxuICAgICAgfVxuICAgICAgLy8gTW92ZSBieSBjZW50ZXIgb3ZlciB4LWF4aXNcbiAgICAsIGN4OiBmdW5jdGlvbih4KSB7XG4gICAgICAgIHJldHVybiB4ID09IG51bGwgPyB0aGlzLmJib3goKS5jeCA6IHRoaXMueCh4IC0gdGhpcy5iYm94KCkud2lkdGggLyAyKVxuICAgICAgfVxuICAgICAgLy8gTW92ZSBieSBjZW50ZXIgb3ZlciB5LWF4aXNcbiAgICAsIGN5OiBmdW5jdGlvbih5KSB7XG4gICAgICAgIHJldHVybiB5ID09IG51bGwgPyB0aGlzLmJib3goKS5jeSA6IHRoaXMueSh5IC0gdGhpcy5iYm94KCkuaGVpZ2h0IC8gMilcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gQWRkIHBhcmVudCBtZXRob2RcbiAgLCBjb25zdHJ1Y3Q6IHtcbiAgICAgIC8vIENyZWF0ZSBhIGdyb3VwIGVsZW1lbnRcbiAgICAgIGdyb3VwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBTVkcuRylcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgU1ZHLmV4dGVuZChTVkcuRWxlbWVudCwge1xuICAgIC8vIEdldCBhbGwgc2libGluZ3MsIGluY2x1ZGluZyBteXNlbGZcbiAgICBzaWJsaW5nczogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQuY2hpbGRyZW4oKVxuICAgIH1cbiAgICAvLyBHZXQgdGhlIGN1cmVudCBwb3NpdGlvbiBzaWJsaW5nc1xuICAsIHBvc2l0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC5pbmRleCh0aGlzKVxuICAgIH1cbiAgICAvLyBHZXQgdGhlIG5leHQgZWxlbWVudCAod2lsbCByZXR1cm4gbnVsbCBpZiB0aGVyZSBpcyBub25lKVxuICAsIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2libGluZ3MoKVt0aGlzLnBvc2l0aW9uKCkgKyAxXVxuICAgIH1cbiAgICAvLyBHZXQgdGhlIG5leHQgZWxlbWVudCAod2lsbCByZXR1cm4gbnVsbCBpZiB0aGVyZSBpcyBub25lKVxuICAsIHByZXZpb3VzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnNpYmxpbmdzKClbdGhpcy5wb3NpdGlvbigpIC0gMV1cbiAgICB9XG4gICAgLy8gU2VuZCBnaXZlbiBlbGVtZW50IG9uZSBzdGVwIGZvcndhcmRcbiAgLCBmb3J3YXJkOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpID0gdGhpcy5wb3NpdGlvbigpXG4gICAgICByZXR1cm4gdGhpcy5wYXJlbnQucmVtb3ZlRWxlbWVudCh0aGlzKS5wdXQodGhpcywgaSArIDEpXG4gICAgfVxuICAgIC8vIFNlbmQgZ2l2ZW4gZWxlbWVudCBvbmUgc3RlcCBiYWNrd2FyZFxuICAsIGJhY2t3YXJkOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpID0gdGhpcy5wb3NpdGlvbigpXG4gICAgICBcbiAgICAgIGlmIChpID4gMClcbiAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlRWxlbWVudCh0aGlzKS5hZGQodGhpcywgaSAtIDEpXG4gIFxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgLy8gU2VuZCBnaXZlbiBlbGVtZW50IGFsbCB0aGUgd2F5IHRvIHRoZSBmcm9udFxuICAsIGZyb250OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcmVudC5yZW1vdmVFbGVtZW50KHRoaXMpLnB1dCh0aGlzKVxuICAgIH1cbiAgICAvLyBTZW5kIGdpdmVuIGVsZW1lbnQgYWxsIHRoZSB3YXkgdG8gdGhlIGJhY2tcbiAgLCBiYWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnBvc2l0aW9uKCkgPiAwKVxuICAgICAgICB0aGlzLnBhcmVudC5yZW1vdmVFbGVtZW50KHRoaXMpLmFkZCh0aGlzLCAwKVxuICAgICAgXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICAvLyBJbnNlcnRzIGEgZ2l2ZW4gZWxlbWVudCBiZWZvcmUgdGhlIHRhcmdldGVkIGVsZW1lbnRcbiAgLCBiZWZvcmU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlKClcbiAgXG4gICAgICB2YXIgaSA9IHRoaXMucG9zaXRpb24oKVxuICAgICAgXG4gICAgICB0aGlzLnBhcmVudC5hZGQoZWxlbWVudCwgaSlcbiAgXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICAvLyBJbnN0ZXJzIGEgZ2l2ZW4gZWxlbWVudCBhZnRlciB0aGUgdGFyZ2V0ZWQgZWxlbWVudFxuICAsIGFmdGVyOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICBlbGVtZW50LnJlbW92ZSgpXG4gICAgICBcbiAgICAgIHZhciBpID0gdGhpcy5wb3NpdGlvbigpXG4gICAgICBcbiAgICAgIHRoaXMucGFyZW50LmFkZChlbGVtZW50LCBpICsgMSlcbiAgXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgXG4gIH0pXG5cbiAgU1ZHLk1hc2sgPSBTVkcuaW52ZW50KHtcbiAgICAvLyBJbml0aWFsaXplIG5vZGVcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIFNWRy5jcmVhdGUoJ21hc2snKSlcbiAgXG4gICAgICAvKiBrZWVwIHJlZmVyZW5jZXMgdG8gbWFza2VkIGVsZW1lbnRzICovXG4gICAgICB0aGlzLnRhcmdldHMgPSBbXVxuICAgIH1cbiAgXG4gICAgLy8gSW5oZXJpdCBmcm9tXG4gICwgaW5oZXJpdDogU1ZHLkNvbnRhaW5lclxuICBcbiAgICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xuICAsIGV4dGVuZDoge1xuICAgICAgLy8gVW5tYXNrIGFsbCBtYXNrZWQgZWxlbWVudHMgYW5kIHJlbW92ZSBpdHNlbGZcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8qIHVubWFzayBhbGwgdGFyZ2V0cyAqL1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy50YXJnZXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICAgIGlmICh0aGlzLnRhcmdldHNbaV0pXG4gICAgICAgICAgICB0aGlzLnRhcmdldHNbaV0udW5tYXNrKClcbiAgICAgICAgZGVsZXRlIHRoaXMudGFyZ2V0c1xuICBcbiAgICAgICAgLyogcmVtb3ZlIG1hc2sgZnJvbSBwYXJlbnQgKi9cbiAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlRWxlbWVudCh0aGlzKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gQWRkIHBhcmVudCBtZXRob2RcbiAgLCBjb25zdHJ1Y3Q6IHtcbiAgICAgIC8vIENyZWF0ZSBtYXNraW5nIGVsZW1lbnRcbiAgICAgIG1hc2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZWZzKCkucHV0KG5ldyBTVkcuTWFzaylcbiAgICAgIH1cbiAgICB9XG4gIH0pXG4gIFxuICBcbiAgU1ZHLmV4dGVuZChTVkcuRWxlbWVudCwge1xuICAgIC8vIERpc3RyaWJ1dGUgbWFzayB0byBzdmcgZWxlbWVudFxuICAgIG1hc2tXaXRoOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAvKiB1c2UgZ2l2ZW4gbWFzayBvciBjcmVhdGUgYSBuZXcgb25lICovXG4gICAgICB0aGlzLm1hc2tlciA9IGVsZW1lbnQgaW5zdGFuY2VvZiBTVkcuTWFzayA/IGVsZW1lbnQgOiB0aGlzLnBhcmVudC5tYXNrKCkuYWRkKGVsZW1lbnQpXG4gIFxuICAgICAgLyogc3RvcmUgcmV2ZXJlbmNlIG9uIHNlbGYgaW4gbWFzayAqL1xuICAgICAgdGhpcy5tYXNrZXIudGFyZ2V0cy5wdXNoKHRoaXMpXG4gICAgICBcbiAgICAgIC8qIGFwcGx5IG1hc2sgKi9cbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ21hc2snLCAndXJsKFwiIycgKyB0aGlzLm1hc2tlci5hdHRyKCdpZCcpICsgJ1wiKScpXG4gICAgfVxuICAgIC8vIFVubWFzayBlbGVtZW50XG4gICwgdW5tYXNrOiBmdW5jdGlvbigpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLm1hc2tlclxuICAgICAgcmV0dXJuIHRoaXMuYXR0cignbWFzaycsIG51bGwpXG4gICAgfVxuICAgIFxuICB9KVxuXG5cbiAgU1ZHLkNsaXAgPSBTVkcuaW52ZW50KHtcbiAgICAvLyBJbml0aWFsaXplIG5vZGVcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIFNWRy5jcmVhdGUoJ2NsaXBQYXRoJykpXG4gIFxuICAgICAgLyoga2VlcCByZWZlcmVuY2VzIHRvIGNsaXBwZWQgZWxlbWVudHMgKi9cbiAgICAgIHRoaXMudGFyZ2V0cyA9IFtdXG4gICAgfVxuICBcbiAgICAvLyBJbmhlcml0IGZyb21cbiAgLCBpbmhlcml0OiBTVkcuQ29udGFpbmVyXG4gIFxuICAgIC8vIEFkZCBjbGFzcyBtZXRob2RzXG4gICwgZXh0ZW5kOiB7XG4gICAgICAvLyBVbmNsaXAgYWxsIGNsaXBwZWQgZWxlbWVudHMgYW5kIHJlbW92ZSBpdHNlbGZcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8qIHVuY2xpcCBhbGwgdGFyZ2V0cyAqL1xuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy50YXJnZXRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICAgIGlmICh0aGlzLnRhcmdldHNbaV0pXG4gICAgICAgICAgICB0aGlzLnRhcmdldHNbaV0udW5jbGlwKClcbiAgICAgICAgZGVsZXRlIHRoaXMudGFyZ2V0c1xuICBcbiAgICAgICAgLyogcmVtb3ZlIGNsaXBQYXRoIGZyb20gcGFyZW50ICovXG4gICAgICAgIHRoaXMucGFyZW50LnJlbW92ZUVsZW1lbnQodGhpcylcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIEFkZCBwYXJlbnQgbWV0aG9kXG4gICwgY29uc3RydWN0OiB7XG4gICAgICAvLyBDcmVhdGUgY2xpcHBpbmcgZWxlbWVudFxuICAgICAgY2xpcDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlZnMoKS5wdXQobmV3IFNWRy5DbGlwKVxuICAgICAgfVxuICAgIH1cbiAgfSlcbiAgXG4gIC8vXG4gIFNWRy5leHRlbmQoU1ZHLkVsZW1lbnQsIHtcbiAgICAvLyBEaXN0cmlidXRlIGNsaXBQYXRoIHRvIHN2ZyBlbGVtZW50XG4gICAgY2xpcFdpdGg6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgIC8qIHVzZSBnaXZlbiBjbGlwIG9yIGNyZWF0ZSBhIG5ldyBvbmUgKi9cbiAgICAgIHRoaXMuY2xpcHBlciA9IGVsZW1lbnQgaW5zdGFuY2VvZiBTVkcuQ2xpcCA/IGVsZW1lbnQgOiB0aGlzLnBhcmVudC5jbGlwKCkuYWRkKGVsZW1lbnQpXG4gIFxuICAgICAgLyogc3RvcmUgcmV2ZXJlbmNlIG9uIHNlbGYgaW4gbWFzayAqL1xuICAgICAgdGhpcy5jbGlwcGVyLnRhcmdldHMucHVzaCh0aGlzKVxuICAgICAgXG4gICAgICAvKiBhcHBseSBtYXNrICovXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdjbGlwLXBhdGgnLCAndXJsKFwiIycgKyB0aGlzLmNsaXBwZXIuYXR0cignaWQnKSArICdcIiknKVxuICAgIH1cbiAgICAvLyBVbmNsaXAgZWxlbWVudFxuICAsIHVuY2xpcDogZnVuY3Rpb24oKSB7XG4gICAgICBkZWxldGUgdGhpcy5jbGlwcGVyXG4gICAgICByZXR1cm4gdGhpcy5hdHRyKCdjbGlwLXBhdGgnLCBudWxsKVxuICAgIH1cbiAgICBcbiAgfSlcblxuICBTVkcuR3JhZGllbnQgPSBTVkcuaW52ZW50KHtcbiAgICAvLyBJbml0aWFsaXplIG5vZGVcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICAgIHRoaXMuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBTVkcuY3JlYXRlKHR5cGUgKyAnR3JhZGllbnQnKSlcbiAgICAgIFxuICAgICAgLyogc3RvcmUgdHlwZSAqL1xuICAgICAgdGhpcy50eXBlID0gdHlwZVxuICAgIH1cbiAgXG4gICAgLy8gSW5oZXJpdCBmcm9tXG4gICwgaW5oZXJpdDogU1ZHLkNvbnRhaW5lclxuICBcbiAgICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xuICAsIGV4dGVuZDoge1xuICAgICAgLy8gRnJvbSBwb3NpdGlvblxuICAgICAgZnJvbTogZnVuY3Rpb24oeCwgeSkge1xuICAgICAgICByZXR1cm4gdGhpcy50eXBlID09ICdyYWRpYWwnID9cbiAgICAgICAgICB0aGlzLmF0dHIoeyBmeDogbmV3IFNWRy5OdW1iZXIoeCksIGZ5OiBuZXcgU1ZHLk51bWJlcih5KSB9KSA6XG4gICAgICAgICAgdGhpcy5hdHRyKHsgeDE6IG5ldyBTVkcuTnVtYmVyKHgpLCB5MTogbmV3IFNWRy5OdW1iZXIoeSkgfSlcbiAgICAgIH1cbiAgICAgIC8vIFRvIHBvc2l0aW9uXG4gICAgLCB0bzogZnVuY3Rpb24oeCwgeSkge1xuICAgICAgICByZXR1cm4gdGhpcy50eXBlID09ICdyYWRpYWwnID9cbiAgICAgICAgICB0aGlzLmF0dHIoeyBjeDogbmV3IFNWRy5OdW1iZXIoeCksIGN5OiBuZXcgU1ZHLk51bWJlcih5KSB9KSA6XG4gICAgICAgICAgdGhpcy5hdHRyKHsgeDI6IG5ldyBTVkcuTnVtYmVyKHgpLCB5MjogbmV3IFNWRy5OdW1iZXIoeSkgfSlcbiAgICAgIH1cbiAgICAgIC8vIFJhZGl1cyBmb3IgcmFkaWFsIGdyYWRpZW50XG4gICAgLCByYWRpdXM6IGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHlwZSA9PSAncmFkaWFsJyA/XG4gICAgICAgICAgdGhpcy5hdHRyKHsgcjogbmV3IFNWRy5OdW1iZXIocikgfSkgOlxuICAgICAgICAgIHRoaXNcbiAgICAgIH1cbiAgICAgIC8vIEFkZCBhIGNvbG9yIHN0b3BcbiAgICAsIGF0OiBmdW5jdGlvbihvZmZzZXQsIGNvbG9yLCBvcGFjaXR5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgU1ZHLlN0b3ApLnVwZGF0ZShvZmZzZXQsIGNvbG9yLCBvcGFjaXR5KVxuICAgICAgfVxuICAgICAgLy8gVXBkYXRlIGdyYWRpZW50XG4gICAgLCB1cGRhdGU6IGZ1bmN0aW9uKGJsb2NrKSB7XG4gICAgICAgIC8qIHJlbW92ZSBhbGwgc3RvcHMgKi9cbiAgICAgICAgdGhpcy5jbGVhcigpXG4gICAgICAgIFxuICAgICAgICAvKiBpbnZva2UgcGFzc2VkIGJsb2NrICovXG4gICAgICAgIGlmICh0eXBlb2YgYmxvY2sgPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICBibG9jay5jYWxsKHRoaXMsIHRoaXMpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICAgICAgLy8gUmV0dXJuIHRoZSBmaWxsIGlkXG4gICAgLCBmaWxsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICd1cmwoIycgKyB0aGlzLmF0dHIoJ2lkJykgKyAnKSdcbiAgICAgIH1cbiAgICAgIC8vIEFsaWFzIHN0cmluZyBjb252ZXJ0aW9uIHRvIGZpbGxcbiAgICAsIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlsbCgpXG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIEFkZCBwYXJlbnQgbWV0aG9kXG4gICwgY29uc3RydWN0OiB7XG4gICAgICAvLyBDcmVhdGUgZ3JhZGllbnQgZWxlbWVudCBpbiBkZWZzXG4gICAgICBncmFkaWVudDogZnVuY3Rpb24odHlwZSwgYmxvY2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVmcygpLmdyYWRpZW50KHR5cGUsIGJsb2NrKVxuICAgICAgfVxuICAgIH1cbiAgfSlcbiAgXG4gIFNWRy5leHRlbmQoU1ZHLkRlZnMsIHtcbiAgICAvLyBkZWZpbmUgZ3JhZGllbnRcbiAgICBncmFkaWVudDogZnVuY3Rpb24odHlwZSwgYmxvY2spIHtcbiAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgU1ZHLkdyYWRpZW50KHR5cGUpKS51cGRhdGUoYmxvY2spXG4gICAgfVxuICAgIFxuICB9KVxuICBcbiAgU1ZHLlN0b3AgPSBTVkcuaW52ZW50KHtcbiAgICAvLyBJbml0aWFsaXplIG5vZGVcbiAgICBjcmVhdGU6ICdzdG9wJ1xuICBcbiAgICAvLyBJbmhlcml0IGZyb21cbiAgLCBpbmhlcml0OiBTVkcuRWxlbWVudFxuICBcbiAgICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xuICAsIGV4dGVuZDoge1xuICAgICAgLy8gYWRkIGNvbG9yIHN0b3BzXG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvID09ICdudW1iZXInIHx8IG8gaW5zdGFuY2VvZiBTVkcuTnVtYmVyKSB7XG4gICAgICAgICAgbyA9IHtcbiAgICAgICAgICAgIG9mZnNldDogIGFyZ3VtZW50c1swXVxuICAgICAgICAgICwgY29sb3I6ICAgYXJndW1lbnRzWzFdXG4gICAgICAgICAgLCBvcGFjaXR5OiBhcmd1bWVudHNbMl1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgXG4gICAgICAgIC8qIHNldCBhdHRyaWJ1dGVzICovXG4gICAgICAgIGlmIChvLm9wYWNpdHkgIT0gbnVsbCkgdGhpcy5hdHRyKCdzdG9wLW9wYWNpdHknLCBvLm9wYWNpdHkpXG4gICAgICAgIGlmIChvLmNvbG9yICAgIT0gbnVsbCkgdGhpcy5hdHRyKCdzdG9wLWNvbG9yJywgby5jb2xvcilcbiAgICAgICAgaWYgKG8ub2Zmc2V0ICAhPSBudWxsKSB0aGlzLmF0dHIoJ29mZnNldCcsIG5ldyBTVkcuTnVtYmVyKG8ub2Zmc2V0KSlcbiAgXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgICB9XG4gICAgfVxuICBcbiAgfSlcblxuXG4gIFNWRy5QYXR0ZXJuID0gU1ZHLmludmVudCh7XG4gICAgLy8gSW5pdGlhbGl6ZSBub2RlXG4gICAgY3JlYXRlOiAncGF0dGVybidcbiAgXG4gICAgLy8gSW5oZXJpdCBmcm9tXG4gICwgaW5oZXJpdDogU1ZHLkNvbnRhaW5lclxuICBcbiAgICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xuICAsIGV4dGVuZDoge1xuICAgICAgLy8gUmV0dXJuIHRoZSBmaWxsIGlkXG4gIFx0ICBmaWxsOiBmdW5jdGlvbigpIHtcbiAgXHQgICAgcmV0dXJuICd1cmwoIycgKyB0aGlzLmF0dHIoJ2lkJykgKyAnKSdcbiAgXHQgIH1cbiAgXHQgIC8vIFVwZGF0ZSBwYXR0ZXJuIGJ5IHJlYnVpbGRpbmdcbiAgXHQsIHVwZGF0ZTogZnVuY3Rpb24oYmxvY2spIHtcbiAgXHRcdFx0LyogcmVtb3ZlIGNvbnRlbnQgKi9cbiAgICAgICAgdGhpcy5jbGVhcigpXG4gICAgICAgIFxuICAgICAgICAvKiBpbnZva2UgcGFzc2VkIGJsb2NrICovXG4gICAgICAgIGlmICh0eXBlb2YgYmxvY2sgPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgXHRibG9jay5jYWxsKHRoaXMsIHRoaXMpXG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICBcdFx0fVxuICBcdCAgLy8gQWxpYXMgc3RyaW5nIGNvbnZlcnRpb24gdG8gZmlsbFxuICBcdCwgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICBcdCAgICByZXR1cm4gdGhpcy5maWxsKClcbiAgXHQgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gQWRkIHBhcmVudCBtZXRob2RcbiAgLCBjb25zdHJ1Y3Q6IHtcbiAgICAgIC8vIENyZWF0ZSBwYXR0ZXJuIGVsZW1lbnQgaW4gZGVmc1xuICBcdCAgcGF0dGVybjogZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgYmxvY2spIHtcbiAgXHQgICAgcmV0dXJuIHRoaXMuZGVmcygpLnBhdHRlcm4od2lkdGgsIGhlaWdodCwgYmxvY2spXG4gIFx0ICB9XG4gICAgfVxuICB9KVxuICBcbiAgU1ZHLmV4dGVuZChTVkcuRGVmcywge1xuICAgIC8vIERlZmluZSBncmFkaWVudFxuICAgIHBhdHRlcm46IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQsIGJsb2NrKSB7XG4gICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5QYXR0ZXJuKS51cGRhdGUoYmxvY2spLmF0dHIoe1xuICAgICAgICB4OiAgICAgICAgICAgIDBcbiAgICAgICwgeTogICAgICAgICAgICAwXG4gICAgICAsIHdpZHRoOiAgICAgICAgd2lkdGhcbiAgICAgICwgaGVpZ2h0OiAgICAgICBoZWlnaHRcbiAgICAgICwgcGF0dGVyblVuaXRzOiAndXNlclNwYWNlT25Vc2UnXG4gICAgICB9KVxuICAgIH1cbiAgXG4gIH0pXG5cbiAgU1ZHLkRvYyA9IFNWRy5pbnZlbnQoe1xuICAgIC8vIEluaXRpYWxpemUgbm9kZVxuICAgIGNyZWF0ZTogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgLyogZW5zdXJlIHRoZSBwcmVzZW5jZSBvZiBhIGh0bWwgZWxlbWVudCAqL1xuICAgICAgdGhpcy5wYXJlbnQgPSB0eXBlb2YgZWxlbWVudCA9PSAnc3RyaW5nJyA/XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQpIDpcbiAgICAgICAgZWxlbWVudFxuICAgICAgXG4gICAgICAvKiBJZiB0aGUgdGFyZ2V0IGlzIGFuIHN2ZyBlbGVtZW50LCB1c2UgdGhhdCBlbGVtZW50IGFzIHRoZSBtYWluIHdyYXBwZXIuXG4gICAgICAgICBUaGlzIGFsbG93cyBzdmcuanMgdG8gd29yayB3aXRoIHN2ZyBkb2N1bWVudHMgYXMgd2VsbC4gKi9cbiAgICAgIHRoaXMuY29uc3RydWN0b3JcbiAgICAgICAgLmNhbGwodGhpcywgdGhpcy5wYXJlbnQubm9kZU5hbWUgPT0gJ3N2ZycgPyB0aGlzLnBhcmVudCA6IFNWRy5jcmVhdGUoJ3N2ZycpKVxuICAgICAgXG4gICAgICAvKiBzZXQgc3ZnIGVsZW1lbnQgYXR0cmlidXRlcyAqL1xuICAgICAgdGhpc1xuICAgICAgICAuYXR0cih7IHhtbG5zOiBTVkcubnMsIHZlcnNpb246ICcxLjEnLCB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJyB9KVxuICAgICAgICAuYXR0cigneG1sbnM6eGxpbmsnLCBTVkcueGxpbmssIFNWRy54bWxucylcbiAgICAgIFxuICAgICAgLyogY3JlYXRlIHRoZSA8ZGVmcz4gbm9kZSAqL1xuICAgICAgdGhpcy5fZGVmcyA9IG5ldyBTVkcuRGVmc1xuICAgICAgdGhpcy5fZGVmcy5wYXJlbnQgPSB0aGlzXG4gICAgICB0aGlzLm5vZGUuYXBwZW5kQ2hpbGQodGhpcy5fZGVmcy5ub2RlKVxuICBcbiAgICAgIC8qIHR1cm4gb2ZmIHN1YiBwaXhlbCBvZmZzZXQgYnkgZGVmYXVsdCAqL1xuICAgICAgdGhpcy5kb1Nwb2YgPSBmYWxzZVxuICAgICAgXG4gICAgICAvKiBlbnN1cmUgY29ycmVjdCByZW5kZXJpbmcgKi9cbiAgICAgIGlmICh0aGlzLnBhcmVudCAhPSB0aGlzLm5vZGUpXG4gICAgICAgIHRoaXMuc3RhZ2UoKVxuICAgIH1cbiAgXG4gICAgLy8gSW5oZXJpdCBmcm9tXG4gICwgaW5oZXJpdDogU1ZHLkNvbnRhaW5lclxuICBcbiAgICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xuICAsIGV4dGVuZDoge1xuICAgICAgLyogZW5hYmxlIGRyYXdpbmcgKi9cbiAgICAgIHN0YWdlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzXG4gIFxuICAgICAgICAvKiBpbnNlcnQgZWxlbWVudCAqL1xuICAgICAgICB0aGlzLnBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLm5vZGUpXG4gIFxuICAgICAgICAvKiBmaXggc3ViLXBpeGVsIG9mZnNldCAqL1xuICAgICAgICBlbGVtZW50LnNwb2YoKVxuICAgICAgICBcbiAgICAgICAgLyogbWFrZSBzdXJlIHN1Yi1waXhlbCBvZmZzZXQgaXMgZml4ZWQgZXZlcnkgdGltZSB0aGUgd2luZG93IGlzIHJlc2l6ZWQgKi9cbiAgICAgICAgU1ZHLm9uKHdpbmRvdywgJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGVsZW1lbnQuc3BvZigpXG4gICAgICAgIH0pXG4gIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICBcbiAgICAgIC8vIENyZWF0ZXMgYW5kIHJldHVybnMgZGVmcyBlbGVtZW50XG4gICAgLCBkZWZzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZnNcbiAgICAgIH1cbiAgXG4gICAgICAvLyBGaXggZm9yIHBvc3NpYmxlIHN1Yi1waXhlbCBvZmZzZXQuIFNlZTpcbiAgICAgIC8vIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTYwODgxMlxuICAgICwgc3BvZjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmRvU3BvZikge1xuICAgICAgICAgIHZhciBwb3MgPSB0aGlzLm5vZGUuZ2V0U2NyZWVuQ1RNKClcbiAgICAgICAgICBcbiAgICAgICAgICBpZiAocG9zKVxuICAgICAgICAgICAgdGhpc1xuICAgICAgICAgICAgICAuc3R5bGUoJ2xlZnQnLCAoLXBvcy5lICUgMSkgKyAncHgnKVxuICAgICAgICAgICAgICAuc3R5bGUoJ3RvcCcsICAoLXBvcy5mICUgMSkgKyAncHgnKVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICBcbiAgICAgIC8vIEVuYWJsZSBzdWItcGl4ZWwgb2Zmc2V0XG4gICAgLCBmaXhTdWJQaXhlbE9mZnNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZG9TcG9mID0gdHJ1ZVxuICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gIH0pXG5cblxuICBTVkcuU2hhcGUgPSBTVkcuaW52ZW50KHtcbiAgICAvLyBJbml0aWFsaXplIG5vZGVcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgXHQgIHRoaXMuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBlbGVtZW50KVxuICBcdH1cbiAgXG4gICAgLy8gSW5oZXJpdCBmcm9tXG4gICwgaW5oZXJpdDogU1ZHLkVsZW1lbnRcbiAgXG4gIH0pXG5cbiAgU1ZHLlVzZSA9IFNWRy5pbnZlbnQoe1xuICAgIC8vIEluaXRpYWxpemUgbm9kZVxuICAgIGNyZWF0ZTogJ3VzZSdcbiAgXG4gICAgLy8gSW5oZXJpdCBmcm9tXG4gICwgaW5oZXJpdDogU1ZHLlNoYXBlXG4gIFxuICAgIC8vIEFkZCBjbGFzcyBtZXRob2RzXG4gICwgZXh0ZW5kOiB7XG4gICAgICAvLyBVc2UgZWxlbWVudCBhcyBhIHJlZmVyZW5jZVxuICAgICAgZWxlbWVudDogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAvKiBzdG9yZSB0YXJnZXQgZWxlbWVudCAqL1xuICAgICAgICB0aGlzLnRhcmdldCA9IGVsZW1lbnRcbiAgXG4gICAgICAgIC8qIHNldCBsaW5lZCBlbGVtZW50ICovXG4gICAgICAgIHJldHVybiB0aGlzLmF0dHIoJ2hyZWYnLCAnIycgKyBlbGVtZW50LCBTVkcueGxpbmspXG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIEFkZCBwYXJlbnQgbWV0aG9kXG4gICwgY29uc3RydWN0OiB7XG4gICAgICAvLyBDcmVhdGUgYSB1c2UgZWxlbWVudFxuICAgICAgdXNlOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgU1ZHLlVzZSkuZWxlbWVudChlbGVtZW50KVxuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICBTVkcuUmVjdCA9IFNWRy5pbnZlbnQoe1xuICBcdC8vIEluaXRpYWxpemUgbm9kZVxuICAgIGNyZWF0ZTogJ3JlY3QnXG4gIFxuICBcdC8vIEluaGVyaXQgZnJvbVxuICAsIGluaGVyaXQ6IFNWRy5TaGFwZVxuICBcdFxuICBcdC8vIEFkZCBwYXJlbnQgbWV0aG9kXG4gICwgY29uc3RydWN0OiB7XG4gICAgXHQvLyBDcmVhdGUgYSByZWN0IGVsZW1lbnRcbiAgICBcdHJlY3Q6IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcbiAgICBcdCAgcmV0dXJuIHRoaXMucHV0KG5ldyBTVkcuUmVjdCgpLnNpemUod2lkdGgsIGhlaWdodCkpXG4gICAgXHR9XG4gICAgXHRcbiAgXHR9XG4gIFx0XG4gIH0pXG5cbiAgU1ZHLkVsbGlwc2UgPSBTVkcuaW52ZW50KHtcbiAgICAvLyBJbml0aWFsaXplIG5vZGVcbiAgICBjcmVhdGU6ICdlbGxpcHNlJ1xuICBcbiAgICAvLyBJbmhlcml0IGZyb21cbiAgLCBpbmhlcml0OiBTVkcuU2hhcGVcbiAgXG4gICAgLy8gQWRkIGNsYXNzIG1ldGhvZHNcbiAgLCBleHRlbmQ6IHtcbiAgICAgIC8vIE1vdmUgb3ZlciB4LWF4aXNcbiAgICAgIHg6IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgcmV0dXJuIHggPT0gbnVsbCA/IHRoaXMuY3goKSAtIHRoaXMuYXR0cigncngnKSA6IHRoaXMuY3goeCArIHRoaXMuYXR0cigncngnKSlcbiAgICAgIH1cbiAgICAgIC8vIE1vdmUgb3ZlciB5LWF4aXNcbiAgICAsIHk6IGZ1bmN0aW9uKHkpIHtcbiAgICAgICAgcmV0dXJuIHkgPT0gbnVsbCA/IHRoaXMuY3koKSAtIHRoaXMuYXR0cigncnknKSA6IHRoaXMuY3koeSArIHRoaXMuYXR0cigncnknKSlcbiAgICAgIH1cbiAgICAgIC8vIE1vdmUgYnkgY2VudGVyIG92ZXIgeC1heGlzXG4gICAgLCBjeDogZnVuY3Rpb24oeCkge1xuICAgICAgICByZXR1cm4geCA9PSBudWxsID8gdGhpcy5hdHRyKCdjeCcpIDogdGhpcy5hdHRyKCdjeCcsIG5ldyBTVkcuTnVtYmVyKHgpLmRpdmlkZSh0aGlzLnRyYW5zLnNjYWxlWCkpXG4gICAgICB9XG4gICAgICAvLyBNb3ZlIGJ5IGNlbnRlciBvdmVyIHktYXhpc1xuICAgICwgY3k6IGZ1bmN0aW9uKHkpIHtcbiAgICAgICAgcmV0dXJuIHkgPT0gbnVsbCA/IHRoaXMuYXR0cignY3knKSA6IHRoaXMuYXR0cignY3knLCBuZXcgU1ZHLk51bWJlcih5KS5kaXZpZGUodGhpcy50cmFucy5zY2FsZVkpKVxuICAgICAgfVxuICAgICAgLy8gU2V0IHdpZHRoIG9mIGVsZW1lbnRcbiAgICAsIHdpZHRoOiBmdW5jdGlvbih3aWR0aCkge1xuICAgICAgICByZXR1cm4gd2lkdGggPT0gbnVsbCA/IHRoaXMuYXR0cigncngnKSAqIDIgOiB0aGlzLmF0dHIoJ3J4JywgbmV3IFNWRy5OdW1iZXIod2lkdGgpLmRpdmlkZSgyKSlcbiAgICAgIH1cbiAgICAgIC8vIFNldCBoZWlnaHQgb2YgZWxlbWVudFxuICAgICwgaGVpZ2h0OiBmdW5jdGlvbihoZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuIGhlaWdodCA9PSBudWxsID8gdGhpcy5hdHRyKCdyeScpICogMiA6IHRoaXMuYXR0cigncnknLCBuZXcgU1ZHLk51bWJlcihoZWlnaHQpLmRpdmlkZSgyKSlcbiAgICAgIH1cbiAgICAgIC8vIEN1c3RvbSBzaXplIGZ1bmN0aW9uXG4gICAgLCBzaXplOiBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHZhciBwID0gcHJvcG9ydGlvbmFsU2l6ZSh0aGlzLmJib3goKSwgd2lkdGgsIGhlaWdodClcbiAgXG4gICAgICAgIHJldHVybiB0aGlzLmF0dHIoe1xuICAgICAgICAgIHJ4OiBuZXcgU1ZHLk51bWJlcihwLndpZHRoKS5kaXZpZGUoMilcbiAgICAgICAgLCByeTogbmV3IFNWRy5OdW1iZXIocC5oZWlnaHQpLmRpdmlkZSgyKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgXG4gICAgfVxuICBcbiAgICAvLyBBZGQgcGFyZW50IG1ldGhvZFxuICAsIGNvbnN0cnVjdDoge1xuICAgICAgLy8gQ3JlYXRlIGNpcmNsZSBlbGVtZW50LCBiYXNlZCBvbiBlbGxpcHNlXG4gICAgICBjaXJjbGU6IGZ1bmN0aW9uKHNpemUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxsaXBzZShzaXplLCBzaXplKVxuICAgICAgfVxuICAgICAgLy8gQ3JlYXRlIGFuIGVsbGlwc2VcbiAgICAsIGVsbGlwc2U6IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBTVkcuRWxsaXBzZSkuc2l6ZSh3aWR0aCwgaGVpZ2h0KS5tb3ZlKDAsIDApXG4gICAgICB9XG4gICAgICBcbiAgICB9XG4gIFxuICB9KVxuXG4gIFNWRy5MaW5lID0gU1ZHLmludmVudCh7XG4gICAgLy8gSW5pdGlhbGl6ZSBub2RlXG4gICAgY3JlYXRlOiAnbGluZSdcbiAgXG4gICAgLy8gSW5oZXJpdCBmcm9tXG4gICwgaW5oZXJpdDogU1ZHLlNoYXBlXG4gIFxuICAgIC8vIEFkZCBjbGFzcyBtZXRob2RzXG4gICwgZXh0ZW5kOiB7XG4gICAgICAvLyBNb3ZlIG92ZXIgeC1heGlzXG4gICAgICB4OiBmdW5jdGlvbih4KSB7XG4gICAgICAgIHZhciBiID0gdGhpcy5iYm94KClcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB4ID09IG51bGwgPyBiLnggOiB0aGlzLmF0dHIoe1xuICAgICAgICAgIHgxOiB0aGlzLmF0dHIoJ3gxJykgLSBiLnggKyB4XG4gICAgICAgICwgeDI6IHRoaXMuYXR0cigneDInKSAtIGIueCArIHhcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIC8vIE1vdmUgb3ZlciB5LWF4aXNcbiAgICAsIHk6IGZ1bmN0aW9uKHkpIHtcbiAgICAgICAgdmFyIGIgPSB0aGlzLmJib3goKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHkgPT0gbnVsbCA/IGIueSA6IHRoaXMuYXR0cih7XG4gICAgICAgICAgeTE6IHRoaXMuYXR0cigneTEnKSAtIGIueSArIHlcbiAgICAgICAgLCB5MjogdGhpcy5hdHRyKCd5MicpIC0gYi55ICsgeVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgLy8gTW92ZSBieSBjZW50ZXIgb3ZlciB4LWF4aXNcbiAgICAsIGN4OiBmdW5jdGlvbih4KSB7XG4gICAgICAgIHZhciBoYWxmID0gdGhpcy5iYm94KCkud2lkdGggLyAyXG4gICAgICAgIHJldHVybiB4ID09IG51bGwgPyB0aGlzLngoKSArIGhhbGYgOiB0aGlzLngoeCAtIGhhbGYpXG4gICAgICB9XG4gICAgICAvLyBNb3ZlIGJ5IGNlbnRlciBvdmVyIHktYXhpc1xuICAgICwgY3k6IGZ1bmN0aW9uKHkpIHtcbiAgICAgICAgdmFyIGhhbGYgPSB0aGlzLmJib3goKS5oZWlnaHQgLyAyXG4gICAgICAgIHJldHVybiB5ID09IG51bGwgPyB0aGlzLnkoKSArIGhhbGYgOiB0aGlzLnkoeSAtIGhhbGYpXG4gICAgICB9XG4gICAgICAvLyBTZXQgd2lkdGggb2YgZWxlbWVudFxuICAgICwgd2lkdGg6IGZ1bmN0aW9uKHdpZHRoKSB7XG4gICAgICAgIHZhciBiID0gdGhpcy5iYm94KClcbiAgXG4gICAgICAgIHJldHVybiB3aWR0aCA9PSBudWxsID8gYi53aWR0aCA6IHRoaXMuYXR0cih0aGlzLmF0dHIoJ3gxJykgPCB0aGlzLmF0dHIoJ3gyJykgPyAneDInIDogJ3gxJywgYi54ICsgd2lkdGgpXG4gICAgICB9XG4gICAgICAvLyBTZXQgaGVpZ2h0IG9mIGVsZW1lbnRcbiAgICAsIGhlaWdodDogZnVuY3Rpb24oaGVpZ2h0KSB7XG4gICAgICAgIHZhciBiID0gdGhpcy5iYm94KClcbiAgXG4gICAgICAgIHJldHVybiBoZWlnaHQgPT0gbnVsbCA/IGIuaGVpZ2h0IDogdGhpcy5hdHRyKHRoaXMuYXR0cigneTEnKSA8IHRoaXMuYXR0cigneTInKSA/ICd5MicgOiAneTEnLCBiLnkgKyBoZWlnaHQpXG4gICAgICB9XG4gICAgICAvLyBTZXQgbGluZSBzaXplIGJ5IHdpZHRoIGFuZCBoZWlnaHRcbiAgICAsIHNpemU6IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdmFyIHAgPSBwcm9wb3J0aW9uYWxTaXplKHRoaXMuYmJveCgpLCB3aWR0aCwgaGVpZ2h0KVxuICBcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGgocC53aWR0aCkuaGVpZ2h0KHAuaGVpZ2h0KVxuICAgICAgfVxuICAgICAgLy8gU2V0IHBhdGggZGF0YVxuICAgICwgcGxvdDogZnVuY3Rpb24oeDEsIHkxLCB4MiwgeTIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cih7XG4gICAgICAgICAgeDE6IHgxXG4gICAgICAgICwgeTE6IHkxXG4gICAgICAgICwgeDI6IHgyXG4gICAgICAgICwgeTI6IHkyXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIEFkZCBwYXJlbnQgbWV0aG9kXG4gICwgY29uc3RydWN0OiB7XG4gICAgICAvLyBDcmVhdGUgYSBsaW5lIGVsZW1lbnRcbiAgICAgIGxpbmU6IGZ1bmN0aW9uKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgU1ZHLkxpbmUoKS5wbG90KHgxLCB5MSwgeDIsIHkyKSlcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cblxuICBTVkcuUG9seWxpbmUgPSBTVkcuaW52ZW50KHtcbiAgICAvLyBJbml0aWFsaXplIG5vZGVcbiAgICBjcmVhdGU6ICdwb2x5bGluZSdcbiAgXG4gICAgLy8gSW5oZXJpdCBmcm9tXG4gICwgaW5oZXJpdDogU1ZHLlNoYXBlXG4gICAgXG4gICAgLy8gQWRkIHBhcmVudCBtZXRob2RcbiAgLCBjb25zdHJ1Y3Q6IHtcbiAgICAgIC8vIENyZWF0ZSBhIHdyYXBwZWQgcG9seWxpbmUgZWxlbWVudFxuICAgICAgcG9seWxpbmU6IGZ1bmN0aW9uKHApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBTVkcuUG9seWxpbmUpLnBsb3QocClcbiAgICAgIH1cbiAgICB9XG4gIH0pXG4gIFxuICBTVkcuUG9seWdvbiA9IFNWRy5pbnZlbnQoe1xuICAgIC8vIEluaXRpYWxpemUgbm9kZVxuICAgIGNyZWF0ZTogJ3BvbHlnb24nXG4gIFxuICAgIC8vIEluaGVyaXQgZnJvbVxuICAsIGluaGVyaXQ6IFNWRy5TaGFwZVxuICAgIFxuICAgIC8vIEFkZCBwYXJlbnQgbWV0aG9kXG4gICwgY29uc3RydWN0OiB7XG4gICAgICAvLyBDcmVhdGUgYSB3cmFwcGVkIHBvbHlnb24gZWxlbWVudFxuICAgICAgcG9seWdvbjogZnVuY3Rpb24ocCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5Qb2x5Z29uKS5wbG90KHApXG4gICAgICB9XG4gICAgfVxuICB9KVxuICBcbiAgLy8gQWRkIHBvbHlnb24tc3BlY2lmaWMgZnVuY3Rpb25zXG4gIFNWRy5leHRlbmQoU1ZHLlBvbHlsaW5lLCBTVkcuUG9seWdvbiwge1xuICAgIC8vIERlZmluZSBtb3JwaGFibGUgYXJyYXlcbiAgICBtb3JwaEFycmF5OiAgU1ZHLlBvaW50QXJyYXlcbiAgICAvLyBQbG90IG5ldyBwYXRoXG4gICwgcGxvdDogZnVuY3Rpb24ocCkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cigncG9pbnRzJywgKHRoaXMuYXJyYXkgPSBuZXcgU1ZHLlBvaW50QXJyYXkocCwgW1swLDBdXSkpKVxuICAgIH1cbiAgICAvLyBNb3ZlIGJ5IGxlZnQgdG9wIGNvcm5lclxuICAsIG1vdmU6IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgIHJldHVybiB0aGlzLmF0dHIoJ3BvaW50cycsIHRoaXMuYXJyYXkubW92ZSh4LCB5KSlcbiAgICB9XG4gICAgLy8gTW92ZSBieSBsZWZ0IHRvcCBjb3JuZXIgb3ZlciB4LWF4aXNcbiAgLCB4OiBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4geCA9PSBudWxsID8gdGhpcy5iYm94KCkueCA6IHRoaXMubW92ZSh4LCB0aGlzLmJib3goKS55KVxuICAgIH1cbiAgICAvLyBNb3ZlIGJ5IGxlZnQgdG9wIGNvcm5lciBvdmVyIHktYXhpc1xuICAsIHk6IGZ1bmN0aW9uKHkpIHtcbiAgICAgIHJldHVybiB5ID09IG51bGwgPyB0aGlzLmJib3goKS55IDogdGhpcy5tb3ZlKHRoaXMuYmJveCgpLngsIHkpXG4gICAgfVxuICAgIC8vIFNldCB3aWR0aCBvZiBlbGVtZW50XG4gICwgd2lkdGg6IGZ1bmN0aW9uKHdpZHRoKSB7XG4gICAgICB2YXIgYiA9IHRoaXMuYmJveCgpXG4gIFxuICAgICAgcmV0dXJuIHdpZHRoID09IG51bGwgPyBiLndpZHRoIDogdGhpcy5zaXplKHdpZHRoLCBiLmhlaWdodClcbiAgICB9XG4gICAgLy8gU2V0IGhlaWdodCBvZiBlbGVtZW50XG4gICwgaGVpZ2h0OiBmdW5jdGlvbihoZWlnaHQpIHtcbiAgICAgIHZhciBiID0gdGhpcy5iYm94KClcbiAgXG4gICAgICByZXR1cm4gaGVpZ2h0ID09IG51bGwgPyBiLmhlaWdodCA6IHRoaXMuc2l6ZShiLndpZHRoLCBoZWlnaHQpIFxuICAgIH1cbiAgICAvLyBTZXQgZWxlbWVudCBzaXplIHRvIGdpdmVuIHdpZHRoIGFuZCBoZWlnaHRcbiAgLCBzaXplOiBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICB2YXIgcCA9IHByb3BvcnRpb25hbFNpemUodGhpcy5iYm94KCksIHdpZHRoLCBoZWlnaHQpXG4gIFxuICAgICAgcmV0dXJuIHRoaXMuYXR0cigncG9pbnRzJywgdGhpcy5hcnJheS5zaXplKHAud2lkdGgsIHAuaGVpZ2h0KSlcbiAgICB9XG4gIFxuICB9KVxuXG4gIFNWRy5QYXRoID0gU1ZHLmludmVudCh7XG4gICAgLy8gSW5pdGlhbGl6ZSBub2RlXG4gICAgY3JlYXRlOiAncGF0aCdcbiAgXG4gICAgLy8gSW5oZXJpdCBmcm9tXG4gICwgaW5oZXJpdDogU1ZHLlNoYXBlXG4gIFxuICAgIC8vIEFkZCBjbGFzcyBtZXRob2RzXG4gICwgZXh0ZW5kOiB7XG4gICAgICAvLyBQbG90IG5ldyBwb2x5IHBvaW50c1xuICAgICAgcGxvdDogZnVuY3Rpb24ocCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdHRyKCdkJywgKHRoaXMuYXJyYXkgPSBuZXcgU1ZHLlBhdGhBcnJheShwLCBbWydNJywgMCwgMF1dKSkpXG4gICAgICB9XG4gICAgICAvLyBNb3ZlIGJ5IGxlZnQgdG9wIGNvcm5lclxuICAgICwgbW92ZTogZnVuY3Rpb24oeCwgeSkge1xuICAgICAgICByZXR1cm4gdGhpcy5hdHRyKCdkJywgdGhpcy5hcnJheS5tb3ZlKHgsIHkpKVxuICAgICAgfVxuICAgICAgLy8gTW92ZSBieSBsZWZ0IHRvcCBjb3JuZXIgb3ZlciB4LWF4aXNcbiAgICAsIHg6IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgcmV0dXJuIHggPT0gbnVsbCA/IHRoaXMuYmJveCgpLnggOiB0aGlzLm1vdmUoeCwgdGhpcy5iYm94KCkueSlcbiAgICAgIH1cbiAgICAgIC8vIE1vdmUgYnkgbGVmdCB0b3AgY29ybmVyIG92ZXIgeS1heGlzXG4gICAgLCB5OiBmdW5jdGlvbih5KSB7XG4gICAgICAgIHJldHVybiB5ID09IG51bGwgPyB0aGlzLmJib3goKS55IDogdGhpcy5tb3ZlKHRoaXMuYmJveCgpLngsIHkpXG4gICAgICB9XG4gICAgICAvLyBTZXQgZWxlbWVudCBzaXplIHRvIGdpdmVuIHdpZHRoIGFuZCBoZWlnaHRcbiAgICAsIHNpemU6IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdmFyIHAgPSBwcm9wb3J0aW9uYWxTaXplKHRoaXMuYmJveCgpLCB3aWR0aCwgaGVpZ2h0KVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cignZCcsIHRoaXMuYXJyYXkuc2l6ZShwLndpZHRoLCBwLmhlaWdodCkpXG4gICAgICB9XG4gICAgICAvLyBTZXQgd2lkdGggb2YgZWxlbWVudFxuICAgICwgd2lkdGg6IGZ1bmN0aW9uKHdpZHRoKSB7XG4gICAgICAgIHJldHVybiB3aWR0aCA9PSBudWxsID8gdGhpcy5iYm94KCkud2lkdGggOiB0aGlzLnNpemUod2lkdGgsIHRoaXMuYmJveCgpLmhlaWdodClcbiAgICAgIH1cbiAgICAgIC8vIFNldCBoZWlnaHQgb2YgZWxlbWVudFxuICAgICwgaGVpZ2h0OiBmdW5jdGlvbihoZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuIGhlaWdodCA9PSBudWxsID8gdGhpcy5iYm94KCkuaGVpZ2h0IDogdGhpcy5zaXplKHRoaXMuYmJveCgpLndpZHRoLCBoZWlnaHQpXG4gICAgICB9XG4gICAgICBcbiAgICB9XG4gICAgXG4gICAgLy8gQWRkIHBhcmVudCBtZXRob2RcbiAgLCBjb25zdHJ1Y3Q6IHtcbiAgICAgIC8vIENyZWF0ZSBhIHdyYXBwZWQgcGF0aCBlbGVtZW50XG4gICAgICBwYXRoOiBmdW5jdGlvbihkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnB1dChuZXcgU1ZHLlBhdGgpLnBsb3QoZClcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgU1ZHLkltYWdlID0gU1ZHLmludmVudCh7XG4gICAgLy8gSW5pdGlhbGl6ZSBub2RlXG4gICAgY3JlYXRlOiAnaW1hZ2UnXG4gIFxuICAgIC8vIEluaGVyaXQgZnJvbVxuICAsIGluaGVyaXQ6IFNWRy5TaGFwZVxuICBcbiAgICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xuICAsIGV4dGVuZDoge1xuICAgICAgLy8gKHJlKWxvYWQgaW1hZ2VcbiAgICAgIGxvYWQ6IGZ1bmN0aW9uKHVybCkge1xuICAgICAgICBpZiAoIXVybCkgcmV0dXJuIHRoaXNcbiAgXG4gICAgICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgICAgICwgaW1nICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXG4gICAgICAgIFxuICAgICAgICAvKiBwcmVsb2FkIGltYWdlICovXG4gICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgcCA9IHNlbGYuZG9jKFNWRy5QYXR0ZXJuKVxuICBcbiAgICAgICAgICAvKiBlbnN1cmUgaW1hZ2Ugc2l6ZSAqL1xuICAgICAgICAgIGlmIChzZWxmLndpZHRoKCkgPT0gMCAmJiBzZWxmLmhlaWdodCgpID09IDApXG4gICAgICAgICAgICBzZWxmLnNpemUoaW1nLndpZHRoLCBpbWcuaGVpZ2h0KVxuICBcbiAgICAgICAgICAvKiBlbnN1cmUgcGF0dGVybiBzaXplIGlmIG5vdCBzZXQgKi9cbiAgICAgICAgICBpZiAocCAmJiBwLndpZHRoKCkgPT0gMCAmJiBwLmhlaWdodCgpID09IDApXG4gICAgICAgICAgICBwLnNpemUoc2VsZi53aWR0aCgpLCBzZWxmLmhlaWdodCgpKVxuICAgICAgICAgIFxuICAgICAgICAgIC8qIGNhbGxiYWNrICovXG4gICAgICAgICAgaWYgKHR5cGVvZiBzZWxmLl9sb2FkZWQgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICBzZWxmLl9sb2FkZWQuY2FsbChzZWxmLCB7XG4gICAgICAgICAgICAgIHdpZHRoOiAgaW1nLndpZHRoXG4gICAgICAgICAgICAsIGhlaWdodDogaW1nLmhlaWdodFxuICAgICAgICAgICAgLCByYXRpbzogIGltZy53aWR0aCAvIGltZy5oZWlnaHRcbiAgICAgICAgICAgICwgdXJsOiAgICB1cmxcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgXG4gICAgICAgIHJldHVybiB0aGlzLmF0dHIoJ2hyZWYnLCAoaW1nLnNyYyA9IHRoaXMuc3JjID0gdXJsKSwgU1ZHLnhsaW5rKVxuICAgICAgfVxuICAgICAgLy8gQWRkIGxvYWRlIGNhbGxiYWNrXG4gICAgLCBsb2FkZWQ6IGZ1bmN0aW9uKGxvYWRlZCkge1xuICAgICAgICB0aGlzLl9sb2FkZWQgPSBsb2FkZWRcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gQWRkIHBhcmVudCBtZXRob2RcbiAgLCBjb25zdHJ1Y3Q6IHtcbiAgICAgIC8vIENyZWF0ZSBpbWFnZSBlbGVtZW50LCBsb2FkIGltYWdlIGFuZCBzZXQgaXRzIHNpemVcbiAgICAgIGltYWdlOiBmdW5jdGlvbihzb3VyY2UsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHV0KG5ldyBTVkcuSW1hZ2UpLmxvYWQoc291cmNlKS5zaXplKHdpZHRoIHx8IDAsIGhlaWdodCB8fCB3aWR0aCB8fCAwKVxuICAgICAgfVxuICAgIH1cbiAgXG4gIH0pXG5cbiAgU1ZHLlRleHQgPSBTVkcuaW52ZW50KHtcbiAgICAvLyBJbml0aWFsaXplIG5vZGVcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIFNWRy5jcmVhdGUoJ3RleHQnKSlcbiAgICAgIFxuICAgICAgdGhpcy5fbGVhZGluZyA9IG5ldyBTVkcuTnVtYmVyKDEuMykgICAgLyogc3RvcmUgbGVhZGluZyB2YWx1ZSBmb3IgcmVidWlsZGluZyAqL1xuICAgICAgdGhpcy5fcmVidWlsZCA9IHRydWUgICAgICAgICAgICAgICAgICAgLyogZW5hYmxlIGF1dG9tYXRpYyB1cGRhdGluZyBvZiBkeSB2YWx1ZXMgKi9cbiAgICAgIHRoaXMuX2J1aWxkICAgPSBmYWxzZSAgICAgICAgICAgICAgICAgIC8qIGRpc2FibGUgYnVpbGQgbW9kZSBmb3IgYWRkaW5nIG11bHRpcGxlIGxpbmVzICovXG4gIFxuICAgICAgLyogc2V0IGRlZmF1bHQgZm9udCAqL1xuICAgICAgdGhpcy5hdHRyKCdmb250LWZhbWlseScsIFNWRy5kZWZhdWx0cy5hdHRyc1snZm9udC1mYW1pbHknXSlcbiAgICB9XG4gIFxuICAgIC8vIEluaGVyaXQgZnJvbVxuICAsIGluaGVyaXQ6IFNWRy5TaGFwZVxuICBcbiAgICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xuICAsIGV4dGVuZDoge1xuICAgICAgLy8gTW92ZSBvdmVyIHgtYXhpc1xuICAgICAgeDogZnVuY3Rpb24oeCkge1xuICAgICAgICAvKiBhY3QgYXMgZ2V0dGVyICovXG4gICAgICAgIGlmICh4ID09IG51bGwpXG4gICAgICAgICAgcmV0dXJuIHRoaXMuYXR0cigneCcpXG4gICAgICAgIFxuICAgICAgICAvKiBtb3ZlIGxpbmVzIGFzIHdlbGwgaWYgbm8gdGV4dFBhdGggaXMgcHJlc2VudCAqL1xuICAgICAgICBpZiAoIXRoaXMudGV4dFBhdGgpXG4gICAgICAgICAgdGhpcy5saW5lcy5lYWNoKGZ1bmN0aW9uKCkgeyBpZiAodGhpcy5uZXdMaW5lZCkgdGhpcy54KHgpIH0pXG4gIFxuICAgICAgICByZXR1cm4gdGhpcy5hdHRyKCd4JywgeClcbiAgICAgIH1cbiAgICAgIC8vIE1vdmUgb3ZlciB5LWF4aXNcbiAgICAsIHk6IGZ1bmN0aW9uKHkpIHtcbiAgICAgICAgdmFyIG8gPSB0aGlzLmF0dHIoJ3knKSAtIHRoaXMuYmJveCgpLnlcbiAgXG4gICAgICAgIC8qIGFjdCBhcyBnZXR0ZXIgKi9cbiAgICAgICAgaWYgKHkgPT0gbnVsbClcbiAgICAgICAgICByZXR1cm4gdGhpcy5hdHRyKCd5JykgLSBvXG4gIFxuICAgICAgICByZXR1cm4gdGhpcy5hdHRyKCd5JywgeSArIG8pXG4gICAgICB9XG4gICAgICAvLyBNb3ZlIGNlbnRlciBvdmVyIHgtYXhpc1xuICAgICwgY3g6IGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgcmV0dXJuIHggPT0gbnVsbCA/IHRoaXMuYmJveCgpLmN4IDogdGhpcy54KHggLSB0aGlzLmJib3goKS53aWR0aCAvIDIpXG4gICAgICB9XG4gICAgICAvLyBNb3ZlIGNlbnRlciBvdmVyIHktYXhpc1xuICAgICwgY3k6IGZ1bmN0aW9uKHkpIHtcbiAgICAgICAgcmV0dXJuIHkgPT0gbnVsbCA/IHRoaXMuYmJveCgpLmN5IDogdGhpcy55KHkgLSB0aGlzLmJib3goKS5oZWlnaHQgLyAyKVxuICAgICAgfVxuICAgICAgLy8gU2V0IHRoZSB0ZXh0IGNvbnRlbnRcbiAgICAsIHRleHQ6IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAgLyogYWN0IGFzIGdldHRlciAqL1xuICAgICAgICBpZiAoIXRleHQpIHJldHVybiB0aGlzLmNvbnRlbnRcbiAgICAgICAgXG4gICAgICAgIC8qIHJlbW92ZSBleGlzdGluZyBjb250ZW50ICovXG4gICAgICAgIHRoaXMuY2xlYXIoKS5idWlsZCh0cnVlKVxuICAgICAgICBcbiAgICAgICAgaWYgKHR5cGVvZiB0ZXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgLyogY2FsbCBibG9jayAqL1xuICAgICAgICAgIHRleHQuY2FsbCh0aGlzLCB0aGlzKVxuICBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvKiBzdG9yZSB0ZXh0IGFuZCBtYWtlIHN1cmUgdGV4dCBpcyBub3QgYmxhbmsgKi9cbiAgICAgICAgICB0ZXh0ID0gKHRoaXMuY29udGVudCA9IChTVkcucmVnZXguaXNCbGFuay50ZXN0KHRleHQpID8gJ3RleHQnIDogdGV4dCkpLnNwbGl0KCdcXG4nKVxuICAgICAgICAgIFxuICAgICAgICAgIC8qIGJ1aWxkIG5ldyBsaW5lcyAqL1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHRleHQubGVuZ3RoOyBpIDwgaWw7IGkrKylcbiAgICAgICAgICAgIHRoaXMudHNwYW4odGV4dFtpXSkubmV3TGluZSgpXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8qIGRpc2FibGUgYnVpbGQgbW9kZSBhbmQgcmVidWlsZCBsaW5lcyAqL1xuICAgICAgICByZXR1cm4gdGhpcy5idWlsZChmYWxzZSkucmVidWlsZCgpXG4gICAgICB9XG4gICAgICAvLyBTZXQgZm9udCBzaXplXG4gICAgLCBzaXplOiBmdW5jdGlvbihzaXplKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF0dHIoJ2ZvbnQtc2l6ZScsIHNpemUpLnJlYnVpbGQoKVxuICAgICAgfVxuICAgICAgLy8gU2V0IC8gZ2V0IGxlYWRpbmdcbiAgICAsIGxlYWRpbmc6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIC8qIGFjdCBhcyBnZXR0ZXIgKi9cbiAgICAgICAgaWYgKHZhbHVlID09IG51bGwpXG4gICAgICAgICAgcmV0dXJuIHRoaXMuX2xlYWRpbmdcbiAgICAgICAgXG4gICAgICAgIC8qIGFjdCBhcyBzZXR0ZXIgKi9cbiAgICAgICAgdGhpcy5fbGVhZGluZyA9IG5ldyBTVkcuTnVtYmVyKHZhbHVlKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXMucmVidWlsZCgpXG4gICAgICB9XG4gICAgICAvLyBSZWJ1aWxkIGFwcGVhcmFuY2UgdHlwZVxuICAgICwgcmVidWlsZDogZnVuY3Rpb24ocmVidWlsZCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgXG4gICAgICAgIC8qIHN0b3JlIG5ldyByZWJ1aWxkIGZsYWcgaWYgZ2l2ZW4gKi9cbiAgICAgICAgaWYgKHR5cGVvZiByZWJ1aWxkID09ICdib29sZWFuJylcbiAgICAgICAgICB0aGlzLl9yZWJ1aWxkID0gcmVidWlsZFxuICBcbiAgICAgICAgLyogZGVmaW5lIHBvc2l0aW9uIG9mIGFsbCBsaW5lcyAqL1xuICAgICAgICBpZiAodGhpcy5fcmVidWlsZCkge1xuICAgICAgICAgIHRoaXMubGluZXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm5ld0xpbmVkKSB7XG4gICAgICAgICAgICAgIGlmICghdGhpcy50ZXh0UGF0aClcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHIoJ3gnLCBzZWxmLmF0dHIoJ3gnKSlcbiAgICAgICAgICAgICAgdGhpcy5hdHRyKCdkeScsIHNlbGYuX2xlYWRpbmcgKiBuZXcgU1ZHLk51bWJlcihzZWxmLmF0dHIoJ2ZvbnQtc2l6ZScpKSkgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICAgIC8vIEVuYWJsZSAvIGRpc2FibGUgYnVpbGQgbW9kZVxuICAgICwgYnVpbGQ6IGZ1bmN0aW9uKGJ1aWxkKSB7XG4gICAgICAgIHRoaXMuX2J1aWxkID0gISFidWlsZFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBBZGQgcGFyZW50IG1ldGhvZFxuICAsIGNvbnN0cnVjdDoge1xuICAgICAgLy8gQ3JlYXRlIHRleHQgZWxlbWVudFxuICAgICAgdGV4dDogZnVuY3Rpb24odGV4dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5UZXh0KS50ZXh0KHRleHQpXG4gICAgICB9XG4gICAgICAvLyBDcmVhdGUgcGxhaW4gdGV4dCBlbGVtZW50XG4gICAgLCBwbGFpbjogZnVuY3Rpb24odGV4dCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5UZXh0KS5wbGFpbih0ZXh0KVxuICAgICAgfVxuICAgIH1cbiAgXG4gIH0pXG4gIFxuICBTVkcuVFNwYW4gPSBTVkcuaW52ZW50KHtcbiAgICAvLyBJbml0aWFsaXplIG5vZGVcbiAgICBjcmVhdGU6ICd0c3BhbidcbiAgXG4gICAgLy8gSW5oZXJpdCBmcm9tXG4gICwgaW5oZXJpdDogU1ZHLlNoYXBlXG4gIFxuICAgIC8vIEFkZCBjbGFzcyBtZXRob2RzXG4gICwgZXh0ZW5kOiB7XG4gICAgICAvLyBTZXQgdGV4dCBjb250ZW50XG4gICAgICB0ZXh0OiBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgIHR5cGVvZiB0ZXh0ID09PSAnZnVuY3Rpb24nID8gdGV4dC5jYWxsKHRoaXMsIHRoaXMpIDogdGhpcy5wbGFpbih0ZXh0KVxuICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICAgIC8vIFNob3J0Y3V0IGR4XG4gICAgLCBkeDogZnVuY3Rpb24oZHgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cignZHgnLCBkeClcbiAgICAgIH1cbiAgICAgIC8vIFNob3J0Y3V0IGR5XG4gICAgLCBkeTogZnVuY3Rpb24oZHkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cignZHknLCBkeSlcbiAgICAgIH1cbiAgICAgIC8vIENyZWF0ZSBuZXcgbGluZVxuICAgICwgbmV3TGluZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8qIGZldGNoIHRleHQgcGFyZW50ICovXG4gICAgICAgIHZhciB0ID0gdGhpcy5kb2MoU1ZHLlRleHQpXG4gIFxuICAgICAgICAvKiBtYXJrIG5ldyBsaW5lICovXG4gICAgICAgIHRoaXMubmV3TGluZWQgPSB0cnVlXG4gIFxuICAgICAgICAvKiBhcHBseSBuZXcgaHnCoW4gKi9cbiAgICAgICAgcmV0dXJuIHRoaXMuZHkodC5fbGVhZGluZyAqIHQuYXR0cignZm9udC1zaXplJykpLmF0dHIoJ3gnLCB0LngoKSlcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gIH0pXG4gIFxuICBTVkcuZXh0ZW5kKFNWRy5UZXh0LCBTVkcuVFNwYW4sIHtcbiAgICAvLyBDcmVhdGUgcGxhaW4gdGV4dCBub2RlXG4gICAgcGxhaW46IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIC8qIGNsZWFyIGlmIGJ1aWxkIG1vZGUgaXMgZGlzYWJsZWQgKi9cbiAgICAgIGlmICh0aGlzLl9idWlsZCA9PT0gZmFsc2UpXG4gICAgICAgIHRoaXMuY2xlYXIoKVxuICBcbiAgICAgIC8qIGNyZWF0ZSB0ZXh0IG5vZGUgKi9cbiAgICAgIHRoaXMubm9kZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgodGhpcy5jb250ZW50ID0gdGV4dCkpKVxuICAgICAgXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICAvLyBDcmVhdGUgYSB0c3BhblxuICAsIHRzcGFuOiBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICB2YXIgbm9kZSAgPSAodGhpcy50ZXh0UGF0aCB8fCB0aGlzKS5ub2RlXG4gICAgICAgICwgdHNwYW4gPSBuZXcgU1ZHLlRTcGFuXG4gIFxuICAgICAgLyogY2xlYXIgaWYgYnVpbGQgbW9kZSBpcyBkaXNhYmxlZCAqL1xuICAgICAgaWYgKHRoaXMuX2J1aWxkID09PSBmYWxzZSlcbiAgICAgICAgdGhpcy5jbGVhcigpXG4gICAgICBcbiAgICAgIC8qIGFkZCBuZXcgdHNwYW4gYW5kIHJlZmVyZW5jZSAqL1xuICAgICAgbm9kZS5hcHBlbmRDaGlsZCh0c3Bhbi5ub2RlKVxuICAgICAgdHNwYW4ucGFyZW50ID0gdGhpc1xuICBcbiAgICAgIC8qIG9ubHkgZmlyc3QgbGV2ZWwgdHNwYW5zIGFyZSBjb25zaWRlcmVkIHRvIGJlIFwibGluZXNcIiAqL1xuICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBTVkcuVGV4dClcbiAgICAgICAgdGhpcy5saW5lcy5hZGQodHNwYW4pXG4gIFxuICAgICAgcmV0dXJuIHRzcGFuLnRleHQodGV4dClcbiAgICB9XG4gICAgLy8gQ2xlYXIgYWxsIGxpbmVzXG4gICwgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG5vZGUgPSAodGhpcy50ZXh0UGF0aCB8fCB0aGlzKS5ub2RlXG4gIFxuICAgICAgLyogcmVtb3ZlIGV4aXN0aW5nIGNoaWxkIG5vZGVzICovXG4gICAgICB3aGlsZSAobm9kZS5oYXNDaGlsZE5vZGVzKCkpXG4gICAgICAgIG5vZGUucmVtb3ZlQ2hpbGQobm9kZS5sYXN0Q2hpbGQpXG4gICAgICBcbiAgICAgIC8qIHJlc2V0IGNvbnRlbnQgcmVmZXJlbmNlcyAgKi9cbiAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgU1ZHLlRleHQpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMubGluZXNcbiAgICAgICAgdGhpcy5saW5lcyA9IG5ldyBTVkcuU2V0XG4gICAgICAgIHRoaXMuY29udGVudCA9ICcnXG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICB9KVxuICBcblxuXG4gIFNWRy5UZXh0UGF0aCA9IFNWRy5pbnZlbnQoe1xuICAgIC8vIEluaXRpYWxpemUgbm9kZVxuICAgIGNyZWF0ZTogJ3RleHRQYXRoJ1xuICBcbiAgICAvLyBJbmhlcml0IGZyb21cbiAgLCBpbmhlcml0OiBTVkcuRWxlbWVudFxuICBcbiAgICAvLyBEZWZpbmUgcGFyZW50IGNsYXNzXG4gICwgcGFyZW50OiBTVkcuVGV4dFxuICBcbiAgICAvLyBBZGQgcGFyZW50IG1ldGhvZFxuICAsIGNvbnN0cnVjdDoge1xuICAgICAgLy8gQ3JlYXRlIHBhdGggZm9yIHRleHQgdG8gcnVuIG9uXG4gICAgICBwYXRoOiBmdW5jdGlvbihkKSB7XG4gICAgICAgIC8qIGNyZWF0ZSB0ZXh0UGF0aCBlbGVtZW50ICovXG4gICAgICAgIHRoaXMudGV4dFBhdGggPSBuZXcgU1ZHLlRleHRQYXRoXG4gIFxuICAgICAgICAvKiBtb3ZlIGxpbmVzIHRvIHRleHRwYXRoICovXG4gICAgICAgIHdoaWxlKHRoaXMubm9kZS5oYXNDaGlsZE5vZGVzKCkpXG4gICAgICAgICAgdGhpcy50ZXh0UGF0aC5ub2RlLmFwcGVuZENoaWxkKHRoaXMubm9kZS5maXJzdENoaWxkKVxuICBcbiAgICAgICAgLyogYWRkIHRleHRQYXRoIGVsZW1lbnQgYXMgY2hpbGQgbm9kZSAqL1xuICAgICAgICB0aGlzLm5vZGUuYXBwZW5kQ2hpbGQodGhpcy50ZXh0UGF0aC5ub2RlKVxuICBcbiAgICAgICAgLyogY3JlYXRlIHBhdGggaW4gZGVmcyAqL1xuICAgICAgICB0aGlzLnRyYWNrID0gdGhpcy5kb2MoKS5kZWZzKCkucGF0aChkKVxuICBcbiAgICAgICAgLyogY3JlYXRlIGNpcmN1bGFyIHJlZmVyZW5jZSAqL1xuICAgICAgICB0aGlzLnRleHRQYXRoLnBhcmVudCA9IHRoaXNcbiAgXG4gICAgICAgIC8qIGxpbmsgdGV4dFBhdGggdG8gcGF0aCBhbmQgYWRkIGNvbnRlbnQgKi9cbiAgICAgICAgdGhpcy50ZXh0UGF0aC5hdHRyKCdocmVmJywgJyMnICsgdGhpcy50cmFjaywgU1ZHLnhsaW5rKVxuICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICAgIC8vIFBsb3QgcGF0aCBpZiBhbnlcbiAgICAsIHBsb3Q6IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgaWYgKHRoaXMudHJhY2spIHRoaXMudHJhY2sucGxvdChkKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICBTVkcuTmVzdGVkID0gU1ZHLmludmVudCh7XG4gICAgLy8gSW5pdGlhbGl6ZSBub2RlXG4gICAgY3JlYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBTVkcuY3JlYXRlKCdzdmcnKSlcbiAgICAgIFxuICAgICAgdGhpcy5zdHlsZSgnb3ZlcmZsb3cnLCAndmlzaWJsZScpXG4gICAgfVxuICBcbiAgICAvLyBJbmhlcml0IGZyb21cbiAgLCBpbmhlcml0OiBTVkcuQ29udGFpbmVyXG4gICAgXG4gICAgLy8gQWRkIHBhcmVudCBtZXRob2RcbiAgLCBjb25zdHJ1Y3Q6IHtcbiAgICAgIC8vIENyZWF0ZSBuZXN0ZWQgc3ZnIGRvY3VtZW50XG4gICAgICBuZXN0ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5OZXN0ZWQpXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIFNWRy5BID0gU1ZHLmludmVudCh7XG4gICAgLy8gSW5pdGlhbGl6ZSBub2RlXG4gICAgY3JlYXRlOiAnYSdcbiAgXG4gICAgLy8gSW5oZXJpdCBmcm9tXG4gICwgaW5oZXJpdDogU1ZHLkNvbnRhaW5lclxuICBcbiAgICAvLyBBZGQgY2xhc3MgbWV0aG9kc1xuICAsIGV4dGVuZDoge1xuICAgICAgLy8gTGluayB1cmxcbiAgICAgIHRvOiBmdW5jdGlvbih1cmwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cignaHJlZicsIHVybCwgU1ZHLnhsaW5rKVxuICAgICAgfVxuICAgICAgLy8gTGluayBzaG93IGF0dHJpYnV0ZVxuICAgICwgc2hvdzogZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmF0dHIoJ3Nob3cnLCB0YXJnZXQsIFNWRy54bGluaylcbiAgICAgIH1cbiAgICAgIC8vIExpbmsgdGFyZ2V0IGF0dHJpYnV0ZVxuICAgICwgdGFyZ2V0OiBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXR0cigndGFyZ2V0JywgdGFyZ2V0KVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBBZGQgcGFyZW50IG1ldGhvZFxuICAsIGNvbnN0cnVjdDoge1xuICAgICAgLy8gQ3JlYXRlIGEgaHlwZXJsaW5rIGVsZW1lbnRcbiAgICAgIGxpbms6IGZ1bmN0aW9uKHVybCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wdXQobmV3IFNWRy5BKS50byh1cmwpXG4gICAgICB9XG4gICAgfVxuICB9KVxuICBcbiAgU1ZHLmV4dGVuZChTVkcuRWxlbWVudCwge1xuICAgIC8vIENyZWF0ZSBhIGh5cGVybGluayBlbGVtZW50XG4gICAgbGlua1RvOiBmdW5jdGlvbih1cmwpIHtcbiAgICAgIHZhciBsaW5rID0gbmV3IFNWRy5BXG4gIFxuICAgICAgaWYgKHR5cGVvZiB1cmwgPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgdXJsLmNhbGwobGluaywgbGluaylcbiAgICAgIGVsc2VcbiAgICAgICAgbGluay50byh1cmwpXG4gIFxuICAgICAgcmV0dXJuIHRoaXMucGFyZW50LnB1dChsaW5rKS5wdXQodGhpcylcbiAgICB9XG4gICAgXG4gIH0pXG5cbiAgdmFyIHN1Z2FyID0ge1xuICAgIHN0cm9rZTogWydjb2xvcicsICd3aWR0aCcsICdvcGFjaXR5JywgJ2xpbmVjYXAnLCAnbGluZWpvaW4nLCAnbWl0ZXJsaW1pdCcsICdkYXNoYXJyYXknLCAnZGFzaG9mZnNldCddXG4gICwgZmlsbDogICBbJ2NvbG9yJywgJ29wYWNpdHknLCAncnVsZSddXG4gICwgcHJlZml4OiBmdW5jdGlvbih0LCBhKSB7XG4gICAgICByZXR1cm4gYSA9PSAnY29sb3InID8gdCA6IHQgKyAnLScgKyBhXG4gICAgfVxuICB9XG4gIFxuICAvKiBBZGQgc3VnYXIgZm9yIGZpbGwgYW5kIHN0cm9rZSAqL1xuICA7WydmaWxsJywgJ3N0cm9rZSddLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgIHZhciBpLCBleHRlbnNpb24gPSB7fVxuICAgIFxuICAgIGV4dGVuc2lvblttXSA9IGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmICh0eXBlb2YgbyA9PSAnc3RyaW5nJyB8fCBTVkcuQ29sb3IuaXNSZ2IobykgfHwgKG8gJiYgdHlwZW9mIG8uZmlsbCA9PT0gJ2Z1bmN0aW9uJykpXG4gICAgICAgIHRoaXMuYXR0cihtLCBvKVxuICBcbiAgICAgIGVsc2VcbiAgICAgICAgLyogc2V0IGFsbCBhdHRyaWJ1dGVzIGZyb20gc3VnYXIuZmlsbCBhbmQgc3VnYXIuc3Ryb2tlIGxpc3QgKi9cbiAgICAgICAgZm9yIChpID0gc3VnYXJbbV0ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXG4gICAgICAgICAgaWYgKG9bc3VnYXJbbV1baV1dICE9IG51bGwpXG4gICAgICAgICAgICB0aGlzLmF0dHIoc3VnYXIucHJlZml4KG0sIHN1Z2FyW21dW2ldKSwgb1tzdWdhclttXVtpXV0pXG4gICAgICBcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIFxuICAgIFNWRy5leHRlbmQoU1ZHLkVsZW1lbnQsIFNWRy5GWCwgZXh0ZW5zaW9uKVxuICAgIFxuICB9KVxuICBcbiAgU1ZHLmV4dGVuZChTVkcuRWxlbWVudCwgU1ZHLkZYLCB7XG4gICAgLy8gUm90YXRpb25cbiAgICByb3RhdGU6IGZ1bmN0aW9uKGRlZywgeCwgeSkge1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtKHtcbiAgICAgICAgcm90YXRpb246IGRlZyB8fCAwXG4gICAgICAsIGN4OiB4XG4gICAgICAsIGN5OiB5XG4gICAgICB9KVxuICAgIH1cbiAgICAvLyBTa2V3XG4gICwgc2tldzogZnVuY3Rpb24oeCwgeSkge1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtKHtcbiAgICAgICAgc2tld1g6IHggfHwgMFxuICAgICAgLCBza2V3WTogeSB8fCAwXG4gICAgICB9KVxuICAgIH1cbiAgICAvLyBTY2FsZVxuICAsIHNjYWxlOiBmdW5jdGlvbih4LCB5KSB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm0oe1xuICAgICAgICBzY2FsZVg6IHhcbiAgICAgICwgc2NhbGVZOiB5ID09IG51bGwgPyB4IDogeVxuICAgICAgfSlcbiAgICB9XG4gICAgLy8gVHJhbnNsYXRlXG4gICwgdHJhbnNsYXRlOiBmdW5jdGlvbih4LCB5KSB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm0oe1xuICAgICAgICB4OiB4XG4gICAgICAsIHk6IHlcbiAgICAgIH0pXG4gICAgfVxuICAgIC8vIE1hdHJpeFxuICAsIG1hdHJpeDogZnVuY3Rpb24obSkge1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtKHsgbWF0cml4OiBtIH0pXG4gICAgfVxuICAgIC8vIE9wYWNpdHlcbiAgLCBvcGFjaXR5OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuYXR0cignb3BhY2l0eScsIHZhbHVlKVxuICAgIH1cbiAgXG4gIH0pXG4gIFxuICBTVkcuZXh0ZW5kKFNWRy5SZWN0LCBTVkcuRWxsaXBzZSwgU1ZHLkZYLCB7XG4gICAgLy8gQWRkIHggYW5kIHkgcmFkaXVzXG4gICAgcmFkaXVzOiBmdW5jdGlvbih4LCB5KSB7XG4gICAgICByZXR1cm4gdGhpcy5hdHRyKHsgcng6IHgsIHJ5OiB5IHx8IHggfSlcbiAgICB9XG4gIFxuICB9KVxuICBcbiAgU1ZHLmV4dGVuZChTVkcuUGF0aCwge1xuICAgIC8vIEdldCBwYXRoIGxlbmd0aFxuICAgIGxlbmd0aDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5ub2RlLmdldFRvdGFsTGVuZ3RoKClcbiAgICB9XG4gICAgLy8gR2V0IHBvaW50IGF0IGxlbmd0aFxuICAsIHBvaW50QXQ6IGZ1bmN0aW9uKGxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRoaXMubm9kZS5nZXRQb2ludEF0TGVuZ3RoKGxlbmd0aClcbiAgICB9XG4gIFxuICB9KVxuICBcbiAgU1ZHLmV4dGVuZChTVkcuUGFyZW50LCBTVkcuVGV4dCwgU1ZHLkZYLCB7XG4gICAgLy8gU2V0IGZvbnQgXG4gICAgZm9udDogZnVuY3Rpb24obykge1xuICAgICAgZm9yICh2YXIgayBpbiBvKVxuICAgICAgICBrID09ICdsZWFkaW5nJyA/XG4gICAgICAgICAgdGhpcy5sZWFkaW5nKG9ba10pIDpcbiAgICAgICAgayA9PSAnYW5jaG9yJyA/XG4gICAgICAgICAgdGhpcy5hdHRyKCd0ZXh0LWFuY2hvcicsIG9ba10pIDpcbiAgICAgICAgayA9PSAnc2l6ZScgfHwgayA9PSAnZmFtaWx5JyB8fCBrID09ICd3ZWlnaHQnIHx8IGsgPT0gJ3N0cmV0Y2gnIHx8IGsgPT0gJ3ZhcmlhbnQnIHx8IGsgPT0gJ3N0eWxlJyA/XG4gICAgICAgICAgdGhpcy5hdHRyKCdmb250LScrIGssIG9ba10pIDpcbiAgICAgICAgICB0aGlzLmF0dHIoaywgb1trXSlcbiAgICAgIFxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgXG4gIH0pXG4gIFxuXG5cbiAgU1ZHLlNldCA9IFNWRy5pbnZlbnQoe1xuICAgIC8vIEluaXRpYWxpemVcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgLyogc2V0IGluaXRpYWwgc3RhdGUgKi9cbiAgICAgIHRoaXMuY2xlYXIoKVxuICAgIH1cbiAgXG4gICAgLy8gQWRkIGNsYXNzIG1ldGhvZHNcbiAgLCBleHRlbmQ6IHtcbiAgICAgIC8vIEFkZCBlbGVtZW50IHRvIHNldFxuICAgICAgYWRkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGksIGlsLCBlbGVtZW50cyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxuICBcbiAgICAgICAgZm9yIChpID0gMCwgaWwgPSBlbGVtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKVxuICAgICAgICAgIHRoaXMubWVtYmVycy5wdXNoKGVsZW1lbnRzW2ldKVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICAgIC8vIFJlbW92ZSBlbGVtZW50IGZyb20gc2V0XG4gICAgLCByZW1vdmU6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGkgPSB0aGlzLmluZGV4KGVsZW1lbnQpXG4gICAgICAgIFxuICAgICAgICAvKiByZW1vdmUgZ2l2ZW4gY2hpbGQgKi9cbiAgICAgICAgaWYgKGkgPiAtMSlcbiAgICAgICAgICB0aGlzLm1lbWJlcnMuc3BsaWNlKGksIDEpXG4gIFxuICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgfVxuICAgICAgLy8gSXRlcmF0ZSBvdmVyIGFsbCBtZW1iZXJzXG4gICAgLCBlYWNoOiBmdW5jdGlvbihibG9jaykge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgaWwgPSB0aGlzLm1lbWJlcnMubGVuZ3RoOyBpIDwgaWw7IGkrKylcbiAgICAgICAgICBibG9jay5hcHBseSh0aGlzLm1lbWJlcnNbaV0sIFtpLCB0aGlzLm1lbWJlcnNdKVxuICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICAgIC8vIFJlc3RvcmUgdG8gZGVmYXVsdHNcbiAgICAsIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLyogaW5pdGlhbGl6ZSBzdG9yZSAqL1xuICAgICAgICB0aGlzLm1lbWJlcnMgPSBbXVxuICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICAgIC8vIENoZWNrcyBpZiBhIGdpdmVuIGVsZW1lbnQgaXMgcHJlc2VudCBpbiBzZXRcbiAgICAsIGhhczogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbmRleChlbGVtZW50KSA+PSAwXG4gICAgICB9XG4gICAgICAvLyByZXR1bnMgaW5kZXggb2YgZ2l2ZW4gZWxlbWVudCBpbiBzZXRcbiAgICAsIGluZGV4OiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1lbWJlcnMuaW5kZXhPZihlbGVtZW50KVxuICAgICAgfVxuICAgICAgLy8gR2V0IG1lbWJlciBhdCBnaXZlbiBpbmRleFxuICAgICwgZ2V0OiBmdW5jdGlvbihpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1lbWJlcnNbaV1cbiAgICAgIH1cbiAgICAgIC8vIERlZmF1bHQgdmFsdWVcbiAgICAsIHZhbHVlT2Y6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZW1iZXJzXG4gICAgICB9XG4gICAgICAvLyBHZXQgdGhlIGJvdW5kaW5nIGJveCBvZiBhbGwgbWVtYmVycyBpbmNsdWRlZCBvciBlbXB0eSBib3ggaWYgc2V0IGhhcyBubyBpdGVtc1xuICAgICwgYmJveDogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGJveCA9IG5ldyBTVkcuQkJveCgpXG4gIFxuICAgICAgICAvKiByZXR1cm4gYW4gZW1wdHkgYm94IG9mIHRoZXJlIGFyZSBubyBtZW1iZXJzICovXG4gICAgICAgIGlmICh0aGlzLm1lbWJlcnMubGVuZ3RoID09IDApXG4gICAgICAgICAgcmV0dXJuIGJveFxuICBcbiAgICAgICAgLyogZ2V0IHRoZSBmaXJzdCByYm94IGFuZCB1cGRhdGUgdGhlIHRhcmdldCBiYm94ICovXG4gICAgICAgIHZhciByYm94ID0gdGhpcy5tZW1iZXJzWzBdLnJib3goKVxuICAgICAgICBib3gueCAgICAgID0gcmJveC54XG4gICAgICAgIGJveC55ICAgICAgPSByYm94LnlcbiAgICAgICAgYm94LndpZHRoICA9IHJib3gud2lkdGhcbiAgICAgICAgYm94LmhlaWdodCA9IHJib3guaGVpZ2h0XG4gIFxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgLyogdXNlciByYm94IGZvciBjb3JyZWN0IHBvc2l0aW9uIGFuZCB2aXN1YWwgcmVwcmVzZW50YXRpb24gKi9cbiAgICAgICAgICBib3ggPSBib3gubWVyZ2UodGhpcy5yYm94KCkpXG4gICAgICAgIH0pXG4gIFxuICAgICAgICByZXR1cm4gYm94XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIEFkZCBwYXJlbnQgbWV0aG9kXG4gICwgY29uc3RydWN0OiB7XG4gICAgICAvLyBDcmVhdGUgYSBuZXcgc2V0XG4gICAgICBzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV3IFNWRy5TZXRcbiAgICAgIH1cbiAgICB9XG4gIH0pXG4gIFxuICBTVkcuU2V0RlggPSBTVkcuaW52ZW50KHtcbiAgICAvLyBJbml0aWFsaXplIG5vZGVcbiAgICBjcmVhdGU6IGZ1bmN0aW9uKHNldCkge1xuICAgICAgLyogc3RvcmUgcmVmZXJlbmNlIHRvIHNldCAqL1xuICAgICAgdGhpcy5zZXQgPSBzZXRcbiAgICB9XG4gIFxuICB9KVxuICBcbiAgLy8gQWxpYXMgbWV0aG9kc1xuICBTVkcuU2V0LmluaGVyaXQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbVxuICAgICAgLCBtZXRob2RzID0gW11cbiAgICBcbiAgICAvKiBnYXRoZXIgc2hhcGUgbWV0aG9kcyAqL1xuICAgIGZvcih2YXIgbSBpbiBTVkcuU2hhcGUucHJvdG90eXBlKVxuICAgICAgaWYgKHR5cGVvZiBTVkcuU2hhcGUucHJvdG90eXBlW21dID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIFNWRy5TZXQucHJvdG90eXBlW21dICE9ICdmdW5jdGlvbicpXG4gICAgICAgIG1ldGhvZHMucHVzaChtKVxuICBcbiAgICAvKiBhcHBseSBzaGFwZSBhbGlhc3NlcyAqL1xuICAgIG1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIFNWRy5TZXQucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlsID0gdGhpcy5tZW1iZXJzLmxlbmd0aDsgaSA8IGlsOyBpKyspXG4gICAgICAgICAgaWYgKHRoaXMubWVtYmVyc1tpXSAmJiB0eXBlb2YgdGhpcy5tZW1iZXJzW2ldW21ldGhvZF0gPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIHRoaXMubWVtYmVyc1tpXVttZXRob2RdLmFwcGx5KHRoaXMubWVtYmVyc1tpXSwgYXJndW1lbnRzKVxuICBcbiAgICAgICAgcmV0dXJuIG1ldGhvZCA9PSAnYW5pbWF0ZScgPyAodGhpcy5meCB8fCAodGhpcy5meCA9IG5ldyBTVkcuU2V0RlgodGhpcykpKSA6IHRoaXNcbiAgICAgIH1cbiAgICB9KVxuICBcbiAgICAvKiBjbGVhciBtZXRob2RzIGZvciB0aGUgbmV4dCByb3VuZCAqL1xuICAgIG1ldGhvZHMgPSBbXVxuICBcbiAgICAvKiBnYXRoZXIgZnggbWV0aG9kcyAqL1xuICAgIGZvcih2YXIgbSBpbiBTVkcuRlgucHJvdG90eXBlKVxuICAgICAgaWYgKHR5cGVvZiBTVkcuRlgucHJvdG90eXBlW21dID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIFNWRy5TZXRGWC5wcm90b3R5cGVbbV0gIT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgbWV0aG9kcy5wdXNoKG0pXG4gIFxuICAgIC8qIGFwcGx5IGZ4IGFsaWFzc2VzICovXG4gICAgbWV0aG9kcy5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgU1ZHLlNldEZYLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IHRoaXMuc2V0Lm1lbWJlcnMubGVuZ3RoOyBpIDwgaWw7IGkrKylcbiAgICAgICAgICB0aGlzLnNldC5tZW1iZXJzW2ldLmZ4W21ldGhvZF0uYXBwbHkodGhpcy5zZXQubWVtYmVyc1tpXS5meCwgYXJndW1lbnRzKVxuICBcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIFxuICBcblxuXG4gIFNWRy5leHRlbmQoU1ZHLkVsZW1lbnQsIHtcbiAgXHQvLyBTdG9yZSBkYXRhIHZhbHVlcyBvbiBzdmcgbm9kZXNcbiAgICBkYXRhOiBmdW5jdGlvbihhLCB2LCByKSB7XG4gICAgXHRpZiAodHlwZW9mIGEgPT0gJ29iamVjdCcpIHtcbiAgICBcdFx0Zm9yICh2IGluIGEpXG4gICAgXHRcdFx0dGhpcy5kYXRhKHYsIGFbdl0pXG4gIFxuICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMuYXR0cignZGF0YS0nICsgYSkpXG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmF0dHIoJ2RhdGEtJyArIGEpXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmF0dHIoXG4gICAgICAgICAgJ2RhdGEtJyArIGFcbiAgICAgICAgLCB2ID09PSBudWxsID9cbiAgICAgICAgICAgIG51bGwgOlxuICAgICAgICAgIHIgPT09IHRydWUgfHwgdHlwZW9mIHYgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB2ID09PSAnbnVtYmVyJyA/XG4gICAgICAgICAgICB2IDpcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHYpXG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gIH0pXG5cbiAgU1ZHLmV4dGVuZChTVkcuRWxlbWVudCwge1xuICAgIC8vIFJlbWVtYmVyIGFyYml0cmFyeSBkYXRhXG4gICAgcmVtZW1iZXI6IGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIC8qIHJlbWVtYmVyIGV2ZXJ5IGl0ZW0gaW4gYW4gb2JqZWN0IGluZGl2aWR1YWxseSAqL1xuICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT0gJ29iamVjdCcpXG4gICAgICAgIGZvciAodmFyIHYgaW4gaylcbiAgICAgICAgICB0aGlzLnJlbWVtYmVyKHYsIGtbdl0pXG4gIFxuICAgICAgLyogcmV0cmlldmUgbWVtb3J5ICovXG4gICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDEpXG4gICAgICAgIHJldHVybiB0aGlzLm1lbW9yeSgpW2tdXG4gIFxuICAgICAgLyogc3RvcmUgbWVtb3J5ICovXG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMubWVtb3J5KClba10gPSB2XG4gIFxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gIFxuICAgIC8vIEVyYXNlIGEgZ2l2ZW4gbWVtb3J5XG4gICwgZm9yZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDApXG4gICAgICAgIHRoaXMuX21lbW9yeSA9IHt9XG4gICAgICBlbHNlXG4gICAgICAgIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXG4gICAgICAgICAgZGVsZXRlIHRoaXMubWVtb3J5KClbYXJndW1lbnRzW2ldXVxuICBcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICBcbiAgICAvLyBJbml0aWFsaXplIG9yIHJldHVybiBsb2NhbCBtZW1vcnkgb2JqZWN0XG4gICwgbWVtb3J5OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tZW1vcnkgfHwgKHRoaXMuX21lbW9yeSA9IHt9KVxuICAgIH1cbiAgXG4gIH0pXG5cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBTVkcgfSlcbiAgZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKVxuICAgIGV4cG9ydHMuU1ZHID0gU1ZHXG5cbiAgZnVuY3Rpb24gY2FtZWxDYXNlKHMpIHsgXG4gICAgcmV0dXJuIHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8tKC4pL2csIGZ1bmN0aW9uKG0sIGcpIHtcbiAgICAgIHJldHVybiBnLnRvVXBwZXJDYXNlKClcbiAgICB9KVxuICB9XG4gIFxuICAvLyBFbnN1cmUgdG8gc2l4LWJhc2VkIGhleCBcbiAgZnVuY3Rpb24gZnVsbEhleChoZXgpIHtcbiAgICByZXR1cm4gaGV4Lmxlbmd0aCA9PSA0ID9cbiAgICAgIFsgJyMnLFxuICAgICAgICBoZXguc3Vic3RyaW5nKDEsIDIpLCBoZXguc3Vic3RyaW5nKDEsIDIpXG4gICAgICAsIGhleC5zdWJzdHJpbmcoMiwgMyksIGhleC5zdWJzdHJpbmcoMiwgMylcbiAgICAgICwgaGV4LnN1YnN0cmluZygzLCA0KSwgaGV4LnN1YnN0cmluZygzLCA0KVxuICAgICAgXS5qb2luKCcnKSA6IGhleFxuICB9XG4gIFxuICAvLyBDb21wb25lbnQgdG8gaGV4IHZhbHVlXG4gIGZ1bmN0aW9uIGNvbXBUb0hleChjb21wKSB7XG4gICAgdmFyIGhleCA9IGNvbXAudG9TdHJpbmcoMTYpXG4gICAgcmV0dXJuIGhleC5sZW5ndGggPT0gMSA/ICcwJyArIGhleCA6IGhleFxuICB9XG4gIFxuICAvLyBDYWxjdWxhdGUgcHJvcG9ydGlvbmFsIHdpZHRoIGFuZCBoZWlnaHQgdmFsdWVzIHdoZW4gbmVjZXNzYXJ5XG4gIGZ1bmN0aW9uIHByb3BvcnRpb25hbFNpemUoYm94LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgaWYgKHdpZHRoID09IG51bGwgfHwgaGVpZ2h0ID09IG51bGwpIHtcbiAgICAgIGlmIChoZWlnaHQgPT0gbnVsbClcbiAgICAgICAgaGVpZ2h0ID0gYm94LmhlaWdodCAvIGJveC53aWR0aCAqIHdpZHRoXG4gICAgICBlbHNlIGlmICh3aWR0aCA9PSBudWxsKVxuICAgICAgICB3aWR0aCA9IGJveC53aWR0aCAvIGJveC5oZWlnaHQgKiBoZWlnaHRcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgIHdpZHRoOiAgd2lkdGhcbiAgICAsIGhlaWdodDogaGVpZ2h0XG4gICAgfVxuICB9XG4gIFxuICAvLyBDYWxjdWxhdGUgcG9zaXRpb24gYWNjb3JkaW5nIHRvIGZyb20gYW5kIHRvXG4gIGZ1bmN0aW9uIGF0KG8sIHBvcykge1xuICAgIC8qIG51bWJlciByZWNhbGN1bGF0aW9uIChkb24ndCBib3RoZXIgY29udmVydGluZyB0byBTVkcuTnVtYmVyIGZvciBwZXJmb3JtYW5jZSByZWFzb25zKSAqL1xuICAgIHJldHVybiB0eXBlb2Ygby5mcm9tID09ICdudW1iZXInID9cbiAgICAgIG8uZnJvbSArIChvLnRvIC0gby5mcm9tKSAqIHBvcyA6XG4gICAgXG4gICAgLyogaW5zdGFuY2UgcmVjYWxjdWxhdGlvbiAqL1xuICAgIG8gaW5zdGFuY2VvZiBTVkcuQ29sb3IgfHwgbyBpbnN0YW5jZW9mIFNWRy5OdW1iZXIgPyBvLmF0KHBvcykgOlxuICAgIFxuICAgIC8qIGZvciBhbGwgb3RoZXIgdmFsdWVzIHdhaXQgdW50aWwgcG9zIGhhcyByZWFjaGVkIDEgdG8gcmV0dXJuIHRoZSBmaW5hbCB2YWx1ZSAqL1xuICAgIHBvcyA8IDEgPyBvLmZyb20gOiBvLnRvXG4gIH1cbiAgXG4gIC8vIFBhdGhBcnJheSBIZWxwZXJzXG4gIGZ1bmN0aW9uIGFycmF5VG9TdHJpbmcoYSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBpbCA9IGEubGVuZ3RoLCBzID0gJyc7IGkgPCBpbDsgaSsrKSB7XG4gICAgICBzICs9IGFbaV1bMF1cbiAgXG4gICAgICBpZiAoYVtpXVsxXSAhPSBudWxsKSB7XG4gICAgICAgIHMgKz0gYVtpXVsxXVxuICBcbiAgICAgICAgaWYgKGFbaV1bMl0gIT0gbnVsbCkge1xuICAgICAgICAgIHMgKz0gJyAnXG4gICAgICAgICAgcyArPSBhW2ldWzJdXG4gIFxuICAgICAgICAgIGlmIChhW2ldWzNdICE9IG51bGwpIHtcbiAgICAgICAgICAgIHMgKz0gJyAnXG4gICAgICAgICAgICBzICs9IGFbaV1bM11cbiAgICAgICAgICAgIHMgKz0gJyAnXG4gICAgICAgICAgICBzICs9IGFbaV1bNF1cbiAgXG4gICAgICAgICAgICBpZiAoYVtpXVs1XSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHMgKz0gJyAnXG4gICAgICAgICAgICAgIHMgKz0gYVtpXVs1XVxuICAgICAgICAgICAgICBzICs9ICcgJ1xuICAgICAgICAgICAgICBzICs9IGFbaV1bNl1cbiAgXG4gICAgICAgICAgICAgIGlmIChhW2ldWzddICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBzICs9ICcgJ1xuICAgICAgICAgICAgICAgIHMgKz0gYVtpXVs3XVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBzICsgJyAnXG4gIH1cbiAgXG4gIC8vIEFkZCBtb3JlIGJvdW5kaW5nIGJveCBwcm9wZXJ0aWVzXG4gIGZ1bmN0aW9uIGJveFByb3BlcnRpZXMoYikge1xuICAgIGIueDIgPSBiLnggKyBiLndpZHRoXG4gICAgYi55MiA9IGIueSArIGIuaGVpZ2h0XG4gICAgYi5jeCA9IGIueCArIGIud2lkdGggLyAyXG4gICAgYi5jeSA9IGIueSArIGIuaGVpZ2h0IC8gMlxuICB9XG4gIFxuICAvLyBQYXJzZSBhIG1hdHJpeCBzdHJpbmdcbiAgZnVuY3Rpb24gcGFyc2VNYXRyaXgobykge1xuICAgIGlmIChvLm1hdHJpeCkge1xuICAgICAgLyogc3BsaXQgbWF0cml4IHN0cmluZyAqL1xuICAgICAgdmFyIG0gPSBvLm1hdHJpeC5yZXBsYWNlKC9cXHMvZywgJycpLnNwbGl0KCcsJylcbiAgICAgIFxuICAgICAgLyogcGFzcnNlIHZhbHVlcyAqL1xuICAgICAgaWYgKG0ubGVuZ3RoID09IDYpIHtcbiAgICAgICAgby5hID0gcGFyc2VGbG9hdChtWzBdKVxuICAgICAgICBvLmIgPSBwYXJzZUZsb2F0KG1bMV0pXG4gICAgICAgIG8uYyA9IHBhcnNlRmxvYXQobVsyXSlcbiAgICAgICAgby5kID0gcGFyc2VGbG9hdChtWzNdKVxuICAgICAgICBvLmUgPSBwYXJzZUZsb2F0KG1bNF0pXG4gICAgICAgIG8uZiA9IHBhcnNlRmxvYXQobVs1XSlcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIG9cbiAgfVxuICBcbiAgLy8gU2hpbSBsYXllciB3aXRoIHNldFRpbWVvdXQgZmFsbGJhY2sgYnkgUGF1bCBJcmlzaFxuICB3aW5kb3cucmVxdWVzdEFuaW1GcmFtZSA9IChmdW5jdGlvbigpe1xuICAgIHJldHVybiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSAgICAgICB8fFxuICAgICAgICAgICAgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSAgICB8fFxuICAgICAgICAgICAgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgICB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGMpIHsgd2luZG93LnNldFRpbWVvdXQoYywgMTAwMCAvIDYwKSB9XG4gIH0pKClcblxufSkuY2FsbCh0aGlzKTtcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xyXG52YXIgU1ZHID0gcmVxdWlyZSgnLi9saWIvc3ZnLmpzJyk7XHJcbnZhciBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxuXHJcbnZhciBrID0gcmVxdWlyZSgnLi9saWIvay9rLmpzJyk7XHJcbnZhciBrX2RhdGEgPSByZXF1aXJlKCcuL2xpYi9rL2tfZGF0YS5qcycpO1xyXG52YXIgJCA9IHJlcXVpcmUoJy4vbGliL2sva19ET00uanMnKTtcclxudmFyICRfZXh0cmEgPSByZXF1aXJlKCcuL2xpYi9rL2tfRE9NX2V4dHJhLmpzJyk7XHJcblxyXG5cclxuLy92YXIgTUlOSSA9IHJlcXVpcmUoJ21pbmlmaWVkJyk7XHJcbi8vdmFyIF89TUlOSS5fLCAkPU1JTkkuJCwgJCQ9TUlOSS4kJCwgRUU9TUlOSS5FRSwgSFRNTD1NSU5JLkhUTUw7XHJcblxyXG5pZiggbmF2aWdhdG9yLmdlb2xvY2F0aW9uICl7XHJcbiAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGxvb2t1cExvY2F0aW9uKTtcclxufSBlbHNlIHtcclxuICAgIGxvZygnbm8gcG9zc2l0aW9uJyk7XHJcbn1cclxuXHJcbnZhciBnX3RhYmxlcztcclxuXHJcbmZ1bmN0aW9uIGxvYWRUYWJsZXMoc3RyaW5nKXtcclxuICAgIHZhciB0YWJsZXMgPSB7fTtcclxuICAgIHZhciBsID0gc3RyaW5nLnNwbGl0KCdcXG4nKVxyXG4gICAgdmFyIHRpdGxlO1xyXG4gICAgdmFyIGZpZWxkcztcclxuICAgIHZhciBuZWVkX3RpdGxlID0gdHJ1ZTtcclxuICAgIHZhciBuZWVkX2ZpZWxkcyA9IHRydWU7XHJcbiAgICBsLmZvckVhY2goIGZ1bmN0aW9uKHN0cmluZywgaSl7XHJcbiAgICAgICAgdmFyIGxpbmUgPSBzdHJpbmcudHJpbSgpO1xyXG4gICAgICAgIGlmKCBsaW5lLmxlbmd0aCA9PT0gMCApe1xyXG4gICAgICAgICAgICBuZWVkX3RpdGxlID0gdHJ1ZTtcclxuICAgICAgICAgICAgbmVlZF9maWVsZHMgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiggbmVlZF90aXRsZSApIHtcclxuICAgICAgICAgICAgdGl0bGUgPSBsaW5lO1xyXG4gICAgICAgICAgICB0YWJsZXNbdGl0bGVdID0gW107XHJcbiAgICAgICAgICAgIG5lZWRfdGl0bGUgPSBmYWxzZTsgXHJcbiAgICAgICAgICAgIC8vbG9nKCduZXcgdGFibGUgJywgdGl0bGUpXHJcbiAgICAgICAgfSBlbHNlIGlmKCBuZWVkX2ZpZWxkcyApIHtcclxuICAgICAgICAgICAgZmllbGRzID0gbGluZS5zcGxpdCgnLCcpXHJcbiAgICAgICAgICAgIG5lZWRfZmllbGRzID0gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGVudHJ5ID0ge307XHJcbiAgICAgICAgICAgIHZhciBsaW5lX2FycmF5ID0gbGluZS5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICBmaWVsZHMuZm9yRWFjaCggZnVuY3Rpb24oZmllbGQsIGlkKXtcclxuICAgICAgICAgICAgICAgIGVudHJ5W2ZpZWxkLnRyaW0oKV0gPSBsaW5lX2FycmF5W2lkXS50cmltKCk7IFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB0YWJsZXNbdGl0bGVdLnB1c2goIGVudHJ5ICk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIGxvZygndGFibGVzJywgdGFibGVzKTtcclxuICAgIGdfdGFibGVzID0gdGFibGVzO1xyXG59XHJcblxyXG5rLkFKQVgoJ3RhYmxlcy50eHQnLCBsb2FkVGFibGVzKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIG1pc2MgZnVuY3Rpb25zXHJcblxyXG5cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy9cclxuLy8jc3lzdGVtIHBhcmFtZXRlcnNcclxuXHJcbnZhciBzZXR0aW5nc19yZWdpc3RyeSA9IFtdO1xyXG5cclxudmFyIGNvbXBvbmVudHMgPSB7fTtcclxuY29tcG9uZW50cy5pbnZlcnRlcnMgPSB7fTtcclxuY29tcG9uZW50cy5pbnZlcnRlcnNbJ1NJMzAwMCddID0ge1xyXG4gICAgTWFrZTonU01BJyxcclxuICAgIG1vZGVsOiczMDAwJyxcclxuXHJcbiAgICBEQ192b2x0YWdlV2luZG93X2xvdzogMTUwLFxyXG4gICAgRENfdm9sdGFnZVdpbmRvd19oaWdoOiAzNTAsXHJcbiAgICBtYXhfcG93ZXI6IDMzMDAsXHJcblxyXG4gICAgQUNfb3B0aW9uczogWycyNDAnLCcyMDgnXSxcclxuXHJcbn07XHJcblxyXG5jb21wb25lbnRzLm1vZHVsZXMgPSB7fTtcclxuXHJcbmsuQUpBWCggJ21vZHVsZXMuY3N2JywgbG9hZE1vZHVsZXMgKTtcclxuXHJcbmZ1bmN0aW9uIGxvYWRNb2R1bGVzKHN0cmluZyl7XHJcbiAgICB2YXIgZGIgPSBrLnBhcnNlQ1NWKHN0cmluZyk7XHJcbiAgICBsb2coJ2RiJywgZGIpXHJcbiAgICBcclxuICAgIGZvciggdmFyIGkgaW4gZGIgKXtcclxuICAgICAgICB2YXIgbW9kdWxlID0gZGJbaV07XHJcbiAgICAgICAgaWYoIGNvbXBvbmVudHMubW9kdWxlc1ttb2R1bGUuTWFrZV0gPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICAgICAgICBjb21wb25lbnRzLm1vZHVsZXNbbW9kdWxlLk1ha2VdID0ge307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKCBjb21wb25lbnRzLm1vZHVsZXNbbW9kdWxlLk1ha2VdW21vZHVsZS5Nb2RlbF0gPT09IHVuZGVmaW5lZCApe1xyXG4gICAgICAgICAgICBjb21wb25lbnRzLm1vZHVsZXNbbW9kdWxlLk1ha2VdW21vZHVsZS5Nb2RlbF0gPSB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29tcG9uZW50cy5tb2R1bGVzW21vZHVsZS5NYWtlXVttb2R1bGUuTW9kZWxdID0gbW9kdWxlO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZV9zeXN0ZW0oKTtcclxuICAgIGxvZygnc3lzdGVtJywgc3lzdGVtKVxyXG5cclxufVxyXG5cclxubG9nKCdjb21wb25lbnRzJywgY29tcG9uZW50cyApO1xyXG5cclxudmFyIGFkZEludmVydGVyID0gZnVuY3Rpb24oKXtcclxuXHJcbn07XHJcblxyXG52YXIgQUNfdHlwZXMgPSB7XHJcbiAgICAnMTIwVicgICAgICA6IFsnZ3JvdW5kJywgJ25ldXRyYWwnLCAnTDEnIF0sXHJcbiAgICAnMjQwVicgICAgICA6IFsnZ3JvdW5kJywgJ25ldXRyYWwnLCAnTDEnLCAnTDInIF0sXHJcbiAgICAnMjA4VicgICAgICA6IFsnZ3JvdW5kJywgJ25ldXRyYWwnLCAnTDEnLCAnTDInIF0sXHJcbiAgICAnMjc3VicgICAgICA6IFsnZ3JvdW5kJywgJ25ldXRyYWwnLCAnTDEnIF0sXHJcbiAgICAnNDgwViBXeWUnICA6IFsnZ3JvdW5kJywgJ25ldXRyYWwnLCAnTDEnLCAnTDInLCAnTDMnIF0sXHJcbiAgICAnNDgwViBEZWx0YSc6IFsnZ3JvdW5kJywgJ0wxJywgJ0wyJywgJ0wzJyBdLFxyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldFNldHRpbmcocmVmZXJlbmNlKXtcclxuICAgIHZhciBjaGFpbiA9IHJlZmVyZW5jZS5zcGxpdCgnLicpO1xyXG4gICAgdmFyIG91dHB1dCA9IHNldHRpbmdzO1xyXG4gICAgY2hhaW4uZm9yRWFjaCggZnVuY3Rpb24obmFtZSl7XHJcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0W25hbWVdXHJcbiAgICB9KVxyXG59XHJcblxyXG5cclxuXHJcbnZhciBzZXR0aW5ncyA9IHt9O1xyXG5zZXR0aW5ncy5zdHJpbmdfbnVtID0gNDtcclxuc2V0dGluZ3Muc3RyaW5nX21vZHVsZXMgPSA2O1xyXG5zZXR0aW5ncy5pbnZlcnRlciA9ICdTSTMwMDAnO1xyXG5zZXR0aW5ncy5BQ190eXBlID0gJzQ4MFYgRGVsdGEnO1xyXG5zZXR0aW5ncy5BQ190eXBlX29wdGlvbnMgPSBbJzEyMFYnLCAnMjQwVicsICcyMDhWJywgJzI3N1YnLCAnNDgwViBXeWUnLCAnNDgwViBEZWx0YSddO1xyXG5zZXR0aW5ncy5zdHJpbmdfbnVtX29wdGlvbnMgPSBbMSwyLDMsNCw1LDZdO1xyXG5zZXR0aW5ncy5zdHJpbmdfbW9kdWxlc19vcHRpb25zID0gWzEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDE4LDE5LDIwXTtcclxuXHJcbmxvZygnc2V0dGluZ3MnLCBzZXR0aW5ncyk7XHJcblxyXG52YXIgdmFsdWVzID0ge307XHJcblxyXG52YXIgc3lzdGVtID0ge307XHJcbnN5c3RlbS5EQyA9IHt9O1xyXG5cclxuZnVuY3Rpb24gdXBkYXRlX3N5c3RlbSgpIHtcclxuICAgIHN5c3RlbS5EQy5zdHJpbmdfbnVtID0gc2V0dGluZ3Muc3RyaW5nX251bTsgXHJcbiAgICBzeXN0ZW0uREMuc3RyaW5nX21vZHVsZXMgPSBzZXR0aW5ncy5zdHJpbmdfbW9kdWxlcztcclxuICAgIHN5c3RlbS5EQy5tb2R1bGUgPSB7fVxyXG4gICAgc3lzdGVtLkRDLm1vZHVsZS5tYWtlID0gc2V0dGluZ3NbJ3B2X21ha2UnXSB8fCBPYmplY3Qua2V5cyggY29tcG9uZW50cy5tb2R1bGVzIClbMF07XHJcblxyXG4gICAgc3lzdGVtLkRDLm1vZHVsZS5tb2RlbCA9IHNldHRpbmdzWydwdl9tb2RlbCddIHx8IE9iamVjdC5rZXlzKCBjb21wb25lbnRzLm1vZHVsZXNbc3lzdGVtLkRDLm1vZHVsZS5tYWtlXSApWzBdO1xyXG4gICAgc3lzdGVtLkRDLm1vZHVsZS5zcGVjcyA9IGNvbXBvbmVudHMubW9kdWxlc1tzeXN0ZW0uREMubW9kdWxlLm1ha2VdW3N5c3RlbS5EQy5tb2R1bGUubW9kZWxdO1xyXG5cclxuICAgIC8vc3lzdGVtLm1vZHVsZSA9IGNvbXBvbmVudHMubW9kdWxlc1tzZXR0aW5ncy5tb2R1bGVdO1xyXG5cclxuICAgIGlmKCBzeXN0ZW0uREMubW9kdWxlLnNwZWNzICl7XHJcbiAgICAgICAgc3lzdGVtLkRDLmN1cnJlbnQgPSBzeXN0ZW0uREMubW9kdWxlLnNwZWNzLklzYyAqIHN5c3RlbS5EQy5zdHJpbmdfbnVtO1xyXG4gICAgICAgIHN5c3RlbS5EQy52b2x0YWdlID0gc3lzdGVtLkRDLm1vZHVsZS5zcGVjcy5Wb2MgKiBzeXN0ZW0uREMuc3RyaW5nX21vZHVsZXM7XHJcbiAgICB9XHJcblxyXG4gICAgc3lzdGVtLmludmVydGVyID0gY29tcG9uZW50cy5pbnZlcnRlcnNbc2V0dGluZ3MuaW52ZXJ0ZXJdO1xyXG5cclxuICAgIHN5c3RlbS5BQ19sb2FkY2VudGVyX3R5cGUgPSAnNDgwLzI3N1YnO1xyXG5cclxuICAgIHN5c3RlbS5BQ190eXBlID0gc2V0dGluZ3MuQUNfdHlwZTtcclxuXHJcbiAgICBzeXN0ZW0uQUNfY29uZHVjdG9ycyA9IEFDX3R5cGVzW3N5c3RlbS5BQ190eXBlXTtcclxuXHJcblxyXG4gICAgc3lzdGVtLndpcmVfY29uZmlnX251bSA9IDU7XHJcbiAgICBcclxufVxyXG5cclxuZnVuY3Rpb24gbG9va3VwTG9jYXRpb24ocG9zaXRpb24pe1xyXG4gICAgdmFyIHVybCA9ICdodHRwOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9nZW9jb2RlL2pzb24/bGF0bG5nPScrcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlKycsJytwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKycmc2Vuc29yPXRydWUnO1xyXG4gICAgay5BSkFYKHVybCwgc2hvd0xvY2F0aW9uKTtcclxufVxyXG5mdW5jdGlvbiBzaG93TG9jYXRpb24obG9jYXRpb25fanNvbil7XHJcbiAgICB2YXIgbG9jYXRpb24gPSBKU09OLnBhcnNlKGxvY2F0aW9uX2pzb24pO1xyXG4gICAgbG9jYXRpb24ucmVzdWx0c1swXS5hZGRyZXNzX2NvbXBvbmVudHMuZm9yRWFjaCggZnVuY3Rpb24oY29tcG9uZW50KXtcclxuICAgICAgICBpZiggY29tcG9uZW50LnR5cGVzWzBdID09PSBcImxvY2FsaXR5XCIgKSB7XHJcbiAgICAgICAgICAgIHNldHRpbmdzLmNpdHkgPSBjb21wb25lbnQubG9uZ19uYW1lIFxyXG4gICAgICAgICAgICAvL2xvZygnY2l0eSAnLCBzZXR0aW5ncy5jaXR5KSBcclxuICAgICAgICB9IGVsc2UgaWYoIGNvbXBvbmVudC50eXBlc1swXSA9PT0gXCJhZG1pbmlzdHJhdGl2ZV9hcmVhX2xldmVsXzJcIiApe1xyXG4gICAgICAgICAgICBzZXR0aW5ncy5jb3VudHkgPSBjb21wb25lbnQubG9uZ19uYW1lIFxyXG4gICAgICAgICAgICAvL2xvZygnY291bnR5ICcsIHNldHRpbmdzLmNvdW50eSlcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgdXBkYXRlKCk7XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIERSQVdJTkdcclxuXHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy9cclxuLy8gTW9kZWxcclxuXHJcblxyXG4vLy8vLy8vLy8vLy9cclxuLy8gbGF5ZXJzXHJcblxyXG52YXIgbF9hdHRyID0ge307XHJcblxyXG5sX2F0dHIuYmFzZSA9IHtcclxuICAgICdmaWxsJzogJ25vbmUnLFxyXG4gICAgJ3N0cm9rZSc6JyMwMDAwMDAnLFxyXG4gICAgJ3N0cm9rZS13aWR0aCc6JzFweCcsXHJcbiAgICAnc3Ryb2tlLWxpbmVjYXAnOididXR0JyxcclxuICAgICdzdHJva2UtbGluZWpvaW4nOidtaXRlcicsXHJcbiAgICAnc3Ryb2tlLW9wYWNpdHknOjEsXHJcblxyXG59O1xyXG5sX2F0dHIuYmxvY2sgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcclxubF9hdHRyLmZyYW1lID0gT2JqZWN0LmNyZWF0ZShsX2F0dHIuYmFzZSk7XHJcbmxfYXR0ci5mcmFtZS5zdHJva2UgPSAnIzAwMDA0MidcclxubF9hdHRyLnRhYmxlID0gT2JqZWN0LmNyZWF0ZShsX2F0dHIuYmFzZSk7XHJcbmxfYXR0ci50YWJsZS5zdHJva2UgPSAnIzAwMDA0MidcclxuXHJcbmxfYXR0ci5EQ19wb3MgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcclxubF9hdHRyLkRDX3Bvcy5zdHJva2UgPSAnI2ZmMDAwMCc7XHJcbmxfYXR0ci5EQ19uZWcgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcclxubF9hdHRyLkRDX25lZy5zdHJva2UgPSAnIzAwMDAwMCc7XHJcbmxfYXR0ci5EQ19ncm91bmQgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcclxubF9hdHRyLkRDX2dyb3VuZC5zdHJva2UgPSAnIzAwNjYwMCc7XHJcbmxfYXR0ci5tb2R1bGUgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcclxubF9hdHRyLmJveCA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xyXG5sX2F0dHIudGV4dCA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xyXG5sX2F0dHIudGV4dC5zdHJva2UgPSAnIzAwMDBmZic7XHJcbmxfYXR0ci50ZXJtaW5hbCA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xyXG5cclxubF9hdHRyLkFDX2dyb3VuZCA9IE9iamVjdC5jcmVhdGUobF9hdHRyLmJhc2UpO1xyXG5sX2F0dHIuQUNfZ3JvdW5kLnN0cm9rZSA9ICdHcmVlbic7XHJcbmxfYXR0ci5BQ19uZXV0cmFsID0gT2JqZWN0LmNyZWF0ZShsX2F0dHIuYmFzZSk7XHJcbmxfYXR0ci5BQ19uZXV0cmFsLnN0cm9rZSA9ICdHcmF5JztcclxubF9hdHRyLkFDX0wxID0gT2JqZWN0LmNyZWF0ZShsX2F0dHIuYmFzZSk7XHJcbmxfYXR0ci5BQ19MMS5zdHJva2UgPSAnQmxhY2snO1xyXG5sX2F0dHIuQUNfTDIgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcclxubF9hdHRyLkFDX0wyLnN0cm9rZSA9ICdSZWQnO1xyXG5sX2F0dHIuQUNfTDMgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKTtcclxubF9hdHRyLkFDX0wzLnN0cm9rZSA9ICdCbHVlJztcclxuXHJcbi8vLy8vLy8vLy8vLy8vL1xyXG4vLyBmb250c1xyXG5cclxudmFyIGZvbnRzID0ge307XHJcbmZvbnRzWydzaWducyddID0ge1xyXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXHJcbiAgICAnZm9udC1zaXplJzogICAgIDUsXHJcbiAgICAndGV4dC1hbmNob3InOiAgICdtaWRkbGUnLFxyXG59O1xyXG5mb250c1snbGFiZWwnXSA9IHtcclxuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxyXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAxMixcclxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ21pZGRsZScsXHJcbn07XHJcbmZvbnRzWyd0aXRsZTEnXSA9IHtcclxuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxyXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAxNCxcclxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ2xlZnQnLFxyXG59O1xyXG5mb250c1sndGl0bGUyJ10gPSB7XHJcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcclxuICAgICdmb250LXNpemUnOiAgICAgMTIsXHJcbiAgICAndGV4dC1hbmNob3InOiAgICdsZWZ0JyxcclxufTtcclxuZm9udHNbJ3BhZ2UnXSA9IHtcclxuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxyXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAyMCxcclxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ2xlZnQnLFxyXG59XHJcbmZvbnRzWyd0YWJsZSddID0ge1xyXG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXHJcbiAgICAnZm9udC1zaXplJzogICAgIDYsXHJcbiAgICAndGV4dC1hbmNob3InOiAgICdtaWRkbGUnLFxyXG59O1xyXG5cclxuXHJcbi8vLy8vLy9cclxuLy8gc2V0dXAgZHJhd2luZyBjb250YWluZXJzXHJcblxyXG52YXIgZWxlbWVudHMgPSBbXTtcclxuXHJcblxyXG5cclxuLy8gQkxPQ0tTXHJcblxyXG52YXIgQmxrID0ge1xyXG4gICAgdHlwZTogJ2Jsb2NrJyxcclxufTtcclxuQmxrLm1vdmUgPSBmdW5jdGlvbih4LCB5KXtcclxuICAgIGZvciggdmFyIGkgaW4gdGhpcy5lbGVtZW50cyApe1xyXG4gICAgICAgIHRoaXMuZWxlbWVudHNbaV0ubW92ZSh4LHkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcbkJsay5hZGQgPSBmdW5jdGlvbigpe1xyXG4gICAgaWYoIHR5cGVvZiB0aGlzLmVsZW1lbnRzID09ICd1bmRlZmluZWQnKXsgdGhpcy5lbGVtZW50cyA9IFtdO31cclxuICAgIGZvciggdmFyIGkgaW4gYXJndW1lbnRzKXtcclxuICAgICAgICB0aGlzLmVsZW1lbnRzLnB1c2goYXJndW1lbnRzW2ldKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5CbGsucm90YXRlID0gZnVuY3Rpb24oZGVnKXtcclxuICAgIHRoaXMucm90YXRlID0gZGVnO1xyXG59O1xyXG5cclxudmFyIGJsb2NrcyA9IHt9O1xyXG52YXIgYmxvY2tfYWN0aXZlID0gZmFsc2U7XHJcbi8vIENyZWF0ZSBkZWZhdWx0IGxheWVyLGJsb2NrIGNvbnRhaW5lciBhbmQgZnVuY3Rpb25zXHJcblxyXG4vLyBMYXllcnNcclxuXHJcbnZhciBsYXllcl9hY3RpdmUgPSBmYWxzZTtcclxuXHJcbnZhciBsYXllciA9IGZ1bmN0aW9uKG5hbWUpeyAvLyBzZXQgY3VycmVudCBsYXllclxyXG4gICAgaWYoIHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJyApeyAvLyBpZiBubyBsYXllciBuYW1lIGdpdmVuLCByZXNldCB0byBkZWZhdWx0IFxyXG4gICAgICAgIGxheWVyX2FjdGl2ZSA9IGZhbHNlO1xyXG4gICAgfSBlbHNlIGlmICggISAobmFtZSBpbiBsX2F0dHIpICkge1xyXG4gICAgICAgIGxvZygnRXJyb3I6IHVua25vd24gbGF5ZXIsIHVzaW5nIGJhc2UnKVxyXG4gICAgICAgIGxheWVyX2FjdGl2ZSA9ICdiYXNlJyBcclxuICAgIH0gZWxzZSB7IC8vIGZpbmFseSBhY3RpdmF0ZSByZXF1ZXN0ZWQgbGF5ZXJcclxuICAgICAgICBsYXllcl9hY3RpdmUgPSBuYW1lO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLypcclxudmFyIGJsb2NrID0gZnVuY3Rpb24obmFtZSkgey8vIHNldCBjdXJyZW50IGJsb2NrXHJcbiAgICAvLyBpZiBjdXJyZW50IGJsb2NrIGhhcyBiZWVuIHVzZWQsIHNhdmUgaXQgYmVmb3JlIGNyZWF0aW5nIGEgbmV3IG9uZS5cclxuICAgIGlmKCBibG9ja3NbYmxvY2tfYWN0aXZlXS5sZW5ndGggPiAwICkgeyBibG9ja3MucHVzaChibG9ja3NbYmxvY2tfYWN0aXZlXSk7IH1cclxuICAgIGlmKCB0eXBlb2YgbmFtZSAhPT0gJ3VuZGVmaW5lZCcgKXsgLy8gaWYgbmFtZSBhcmd1bWVudCBpcyBzdWJtaXR0ZWQsIGNyZWF0ZSBuZXcgYmxvY2tcclxuICAgICAgICB2YXIgYmxrID0gT2JqZWN0LmNyZWF0ZShCbGspO1xyXG4gICAgICAgIGJsay5uYW1lID0gbmFtZTsgLy8gYmxvY2sgbmFtZVxyXG4gICAgICAgIGJsb2Nrc1tibG9ja19hY3RpdmVdID0gYmxrO1xyXG4gICAgfSBlbHNlIHsgLy8gZWxzZSB1c2UgZGVmYXVsdCBibG9ja1xyXG4gICAgICAgIGJsb2Nrc1tibG9ja19hY3RpdmVdID0gYmxvY2tzWzBdO1xyXG4gICAgfVxyXG59XHJcbmJsb2NrKCdkZWZhdWx0Jyk7IC8vIHNldCBjdXJyZW50IGJsb2NrIHRvIGRlZmF1bHRcclxuKi9cclxudmFyIGJsb2NrX3N0YXJ0ID0gZnVuY3Rpb24obmFtZSkge1xyXG4gICAgaWYoIHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJyApeyAvLyBpZiBuYW1lIGFyZ3VtZW50IGlzIHN1Ym1pdHRlZFxyXG4gICAgICAgIGxvZygnRXJyb3I6IG5hbWUgcmVxdWlyZWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gVE9ETzogV2hhdCBpZiB0aGUgc2FtZSBuYW1lIGlzIHN1Ym1pdHRlZCB0d2ljZT8gdGhyb3cgZXJyb3Igb3IgZml4P1xyXG4gICAgICAgIGJsb2NrX2FjdGl2ZSA9IG5hbWU7XHJcbiAgICAgICAgaWYoIHR5cGVvZiBibG9ja3NbYmxvY2tfYWN0aXZlXSAhPT0gJ29iamVjdCcpe1xyXG4gICAgICAgICAgICB2YXIgYmxrID0gT2JqZWN0LmNyZWF0ZShCbGspO1xyXG4gICAgICAgICAgICAvL2Jsay5uYW1lID0gbmFtZTsgLy8gYmxvY2sgbmFtZVxyXG4gICAgICAgICAgICBibG9ja3NbYmxvY2tfYWN0aXZlXSA9IGJsaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGJsaztcclxuICAgIH1cclxufTtcclxuXHJcbiAgICAvKlxyXG4gICAgeCA9IGxvYy53aXJlX3RhYmxlLnggLSB3LzI7XHJcbiAgICB5ID0gbG9jLndpcmVfdGFibGUueSAtIGgvMjtcclxuICAgIGlmKCB0eXBlb2YgbGF5ZXJfbmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApIHtcclxuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSBsYXllcnNbbGF5ZXJfbmFtZV1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYoICEgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApeyBsb2coXCJlcnJvciwgbGF5ZXIgZG9lcyBub3QgZXhpc3QsIHVzaW5nIGN1cnJlbnRcIik7fVxyXG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9ICBsYXllcl9hY3RpdmVcclxuICAgIH1cclxuICAgICovXHJcbnZhciBibG9ja19lbmQgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciBibGsgPSBibG9ja3NbYmxvY2tfYWN0aXZlXTtcclxuICAgIGJsb2NrX2FjdGl2ZSA9IGZhbHNlO1xyXG4gICAgcmV0dXJuIGJsaztcclxufTtcclxuXHJcblxyXG5cclxuLy8gY2xlYXIgZHJhd2luZyBcclxudmFyIGNsZWFyX2RyYXdpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgIGZvciggdmFyIGlkIGluIGJsb2NrcyApe1xyXG4gICAgICAgIGlmKCBibG9ja3MuaGFzT3duUHJvcGVydHkoaWQpKXtcclxuICAgICAgICAgICAgZGVsZXRlIGJsb2Nrc1tpZF07IFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsZW1lbnRzLmxlbmd0aCA9IDA7XHJcbn07XHJcblxyXG5cclxuLy8vLy8vXHJcbi8vIGJ1aWxkIHByb3RvdHlwZSBlbGVtZW50XHJcblxyXG4gICAgLypcclxuICAgIGlmKCB0eXBlb2YgbGF5ZXJfbmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApIHtcclxuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSBsYXllcnNbbGF5ZXJfbmFtZV1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYoICEgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApeyBsb2coXCJlcnJvciwgbGF5ZXIgZG9lcyBub3QgZXhpc3QsIHVzaW5nIGN1cnJlbnRcIik7fVxyXG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9ICBsYXllcl9hY3RpdmVcclxuICAgIH1cclxuICAgICovXHJcblxyXG5cclxudmFyIFN2Z0VsZW0gPSB7XHJcbiAgICBvYmplY3Q6ICdTdmdFbGVtJ1xyXG59O1xyXG5TdmdFbGVtLm1vdmUgPSBmdW5jdGlvbih4LCB5KXtcclxuICAgIGlmKCB0eXBlb2YgdGhpcy5wb2ludHMgIT0gJ3VuZGVmaW5lZCcgKSB7XHJcbiAgICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLnBvaW50cyApIHtcclxuICAgICAgICAgICAgdGhpcy5wb2ludHNbaV1bMF0gKz0geDtcclxuICAgICAgICAgICAgdGhpcy5wb2ludHNbaV1bMV0gKz0geTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuU3ZnRWxlbS5yb3RhdGUgPSBmdW5jdGlvbihkZWcpe1xyXG4gICAgdGhpcy5yb3RhdGVkID0gZGVnO1xyXG59O1xyXG5cclxuLy8vLy8vL1xyXG4vLyBmdW5jdGlvbnMgZm9yIGFkZGluZyBlbGVtZW50c1xyXG5cclxudmFyIGFkZCA9IGZ1bmN0aW9uKHR5cGUsIHBvaW50cywgbGF5ZXJfbmFtZSkge1xyXG5cclxuICAgIGlmKCB0eXBlb2YgbGF5ZXJfbmFtZSA9PT0gJ3VuZGVmaW5lZCcgKSB7IGxheWVyX25hbWUgPSBsYXllcl9hY3RpdmU7IH0gXHJcbiAgICBpZiggISAobGF5ZXJfbmFtZSBpbiBsX2F0dHIpICkgeyBcclxuICAgICAgICBsb2coJ0xheWVyIG5hbWUgbm90IGZvdW5kLCB1c2luZyBiYXNlJyk7XHJcbiAgICAgICAgbGF5ZXJfbmFtZSA9ICdiYXNlJzsgXHJcbiAgICB9XHJcblxyXG4gICAgaWYoIHR5cGVvZiBwb2ludHMgPT0gJ3N0cmluZycpIHtcclxuICAgICAgICB2YXIgcG9pbnRzID0gcG9pbnRzLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgZm9yKCB2YXIgaSBpbiBwb2ludHMgKSB7XHJcbiAgICAgICAgICAgIHBvaW50c1tpXSA9IHBvaW50c1tpXS5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICBmb3IoIHZhciBjIGluIHBvaW50c1tpXSApIHtcclxuICAgICAgICAgICAgICAgIHBvaW50c1tpXVtjXSA9IE51bWJlcihwb2ludHNbaV1bY10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBlbGVtID0gT2JqZWN0LmNyZWF0ZShTdmdFbGVtKTtcclxuICAgIGVsZW0udHlwZSA9IHR5cGU7XHJcbiAgICBlbGVtLmxheWVyX25hbWUgPSBsYXllcl9uYW1lO1xyXG4gICAgaWYoIHR5cGUgPT09ICdsaW5lJyApIHtcclxuICAgICAgICBlbGVtLnBvaW50cyA9IHBvaW50cztcclxuICAgIH0gZWxzZSBpZiggdHlwZW9mIHBvaW50c1swXS54ID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGVsZW0ueCA9IHBvaW50c1swXVswXTsgXHJcbiAgICAgICAgZWxlbS55ID0gcG9pbnRzWzBdWzFdOyBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZWxlbS54ID0gcG9pbnRzWzBdLnhcclxuICAgICAgICBlbGVtLnkgPSBwb2ludHNbMF0ueTsgXHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBpZihibG9ja19hY3RpdmUpIHsgXHJcbiAgICAgICAgYmxvY2tzW2Jsb2NrX2FjdGl2ZV0uYWRkKGVsZW0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBlbGVtZW50cy5wdXNoKGVsZW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlbGVtO1xyXG59O1xyXG5cclxudmFyIGxpbmUgPSBmdW5jdGlvbihwb2ludHMsIGxheWVyKXsgLy8gKHBvaW50cywgW2xheWVyXSlcclxuICAgIC8vcmV0dXJuIGFkZCgnbGluZScsIHBvaW50cywgbGF5ZXIpXHJcbiAgICB2YXIgbGluZSA9ICBhZGQoJ2xpbmUnLCBwb2ludHMsIGxheWVyKTtcclxuICAgIHJldHVybiBsaW5lO1xyXG59O1xyXG5cclxudmFyIHJlY3QgPSBmdW5jdGlvbihsb2MsIHNpemUsIGxheWVyKXtcclxuICAgIHZhciByZWMgPSBhZGQoJ3JlY3QnLCBbbG9jXSwgbGF5ZXIpO1xyXG4gICAgcmVjLncgPSBzaXplWzBdO1xyXG4gICAgLypcclxuICAgIGlmKCB0eXBlb2YgbGF5ZXJfbmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApIHtcclxuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSBsYXllcnNbbGF5ZXJfbmFtZV1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYoICEgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApeyBsb2coXCJlcnJvciwgbGF5ZXIgZG9lcyBub3QgZXhpc3QsIHVzaW5nIGN1cnJlbnRcIik7fVxyXG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9ICBsYXllcl9hY3RpdmVcclxuICAgIH1cclxuICAgICovXHJcbiAgICByZWMuaCA9IHNpemVbMV07XHJcbiAgICByZXR1cm4gcmVjO1xyXG59O1xyXG5cclxudmFyIGNpcmMgPSBmdW5jdGlvbihsb2MsIGRpYW1ldGVyLCBsYXllcil7XHJcbiAgICB2YXIgY2lyID0gYWRkKCdjaXJjJywgW2xvY10sIGxheWVyKTtcclxuICAgIGNpci5kID0gZGlhbWV0ZXI7XHJcbiAgICByZXR1cm4gY2lyO1xyXG59O1xyXG5cclxudmFyIHRleHQgPSBmdW5jdGlvbihsb2MsIHN0cmluZ3MsIGZvbnQsIGxheWVyKXtcclxuICAgIHZhciB0eHQgPSBhZGQoJ3RleHQnLCBbbG9jXSwgbGF5ZXIpO1xyXG4gICAgaWYoIHR5cGVvZiBzdHJpbmdzID09ICdzdHJpbmcnKXtcclxuICAgICAgICBzdHJpbmdzID0gW3N0cmluZ3NdO1xyXG4gICAgfVxyXG4gICAgdHh0LnN0cmluZ3MgPSBzdHJpbmdzO1xyXG4gICAgdHh0LmZvbnQgPSBmb250O1xyXG4gICAgcmV0dXJuIHR4dDtcclxufTtcclxuXHJcbnZhciBibG9jayA9IGZ1bmN0aW9uKG5hbWUpIHsvLyBzZXQgY3VycmVudCBibG9ja1xyXG4gICAgaWYoIGFyZ3VtZW50cy5sZW5ndGggPT09IDIgKXsgLy8gaWYgY29vciBpcyBwYXNzZWRcclxuICAgICAgICBpZiggdHlwZW9mIGFyZ3VtZW50c1sxXS54ICE9PSAndW5kZWZpbmVkJyApe1xyXG4gICAgICAgICAgICB2YXIgeCA9IGFyZ3VtZW50c1sxXS54O1xyXG4gICAgICAgICAgICB2YXIgeSA9IGFyZ3VtZW50c1sxXS55O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB4ID0gYXJndW1lbnRzWzFdWzBdO1xyXG4gICAgICAgICAgICB2YXIgeSA9IGFyZ3VtZW50c1sxXVsxXTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYoIGFyZ3VtZW50cy5sZW5ndGggPT09IDMgKXsgLy8gaWYgeCx5IGlzIHBhc3NlZFxyXG4gICAgICAgIHZhciB4ID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgIHZhciB5ID0gYXJndW1lbnRzWzJdO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRPRE86IHdoYXQgaWYgYmxvY2sgZG9lcyBub3QgZXhpc3Q/IHByaW50IGxpc3Qgb2YgYmxvY2tzP1xyXG4gICAgdmFyIGJsayA9IE9iamVjdC5jcmVhdGUoYmxvY2tzW25hbWVdKTtcclxuICAgIGJsay54ID0geDtcclxuICAgIGJsay55ID0geTtcclxuXHJcbiAgICBpZihibG9ja19hY3RpdmUpeyBcclxuICAgICAgICBibG9ja3NbYmxvY2tfYWN0aXZlXS5hZGQoYmxrKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZWxlbWVudHMucHVzaChibGspO2xfYXR0ci5BQ19ncm91bmQgPSBPYmplY3QuY3JlYXRlKGxfYXR0ci5iYXNlKVxyXG5sX2F0dHIuQUNfZ3JvdW5kLnN0cm9rZSA9ICcjMDA2NjAwJ1xyXG5cclxuICAgIH1cclxuICAgIHJldHVybiBibGtcclxufTtcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcbmxvZygnZWxlbWVudHMnLCBlbGVtZW50cyk7XHJcbmxvZygnYmxvY2tzJywgYmxvY2tzKTtcclxuXHJcblxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vXHJcbi8vI2RyYXdpbmcgcGFyYW1ldGVyc1xyXG5cclxudmFyIHNpemUgPSB7fTtcclxudmFyIGxvYyA9IHt9O1xyXG5cclxudmFyIHVwZGF0ZV92YWx1ZXMgPSBmdW5jdGlvbigpe1xyXG5cclxuICAgIC8vIHNpemVzXHJcbiAgICBzaXplLmRyYXdpbmcgPSB7XHJcbiAgICAgICAgdzogMTAwMCxcclxuICAgICAgICBoOiA3ODAsXHJcbiAgICAgICAgZnJhbWVfcGFkZGluZzogNSxcclxuICAgICAgICB0aXRsZWJveDogNTAsXHJcbiAgICB9XHJcblxyXG4gICAgc2l6ZS5tb2R1bGUgPSB7fTtcclxuICAgIHNpemUubW9kdWxlLmZyYW1lID0ge1xyXG4gICAgICAgIHc6IDEwLFxyXG4gICAgICAgIGg6IDMwLFxyXG4gICAgfVxyXG4gICAgc2l6ZS5tb2R1bGUubGVhZCA9IHNpemUubW9kdWxlLmZyYW1lLncqMi8zO1xyXG4gICAgc2l6ZS5tb2R1bGUuaCA9IHNpemUubW9kdWxlLmZyYW1lLmggKyBzaXplLm1vZHVsZS5sZWFkKjI7XHJcbiAgICBzaXplLm1vZHVsZS53ID0gc2l6ZS5tb2R1bGUuZnJhbWUudztcclxuXHJcbiAgICBzaXplLndpcmVfb2Zmc2V0ID0ge1xyXG4gICAgICAgIGJhc2U6IDUsXHJcbiAgICAgICAgZ2FwOiBzaXplLm1vZHVsZS53LFxyXG4gICAgfSAgICBcclxuICAgIHNpemUud2lyZV9vZmZzZXQubWF4ID0gc3lzdGVtLkRDLnN0cmluZ19udW0gKiBzaXplLndpcmVfb2Zmc2V0LmJhc2U7XHJcbiAgICBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCA9IHNpemUud2lyZV9vZmZzZXQubWF4ICsgc2l6ZS53aXJlX29mZnNldC5iYXNlKjI7XHJcblxyXG4gICAgc2l6ZS5zdHJpbmcgPSB7fTtcclxuICAgIHNpemUuc3RyaW5nLmdhcCA9IHNpemUubW9kdWxlLmZyYW1lLncvNDI7XHJcbiAgICBzaXplLnN0cmluZy5nYXBfbWlzc2luZyA9IHNpemUuc3RyaW5nLmdhcCArIHNpemUubW9kdWxlLmZyYW1lLnc7XHJcbiAgICBzaXplLnN0cmluZy5oID0gKHNpemUubW9kdWxlLmggKiA0KSArIChzaXplLnN0cmluZy5nYXAgKiAyKSArIHNpemUuc3RyaW5nLmdhcF9taXNzaW5nO1xyXG4gICAgc2l6ZS5zdHJpbmcudyA9IHNpemUubW9kdWxlLmZyYW1lLncgKiAyLjU7XHJcblxyXG4gICAgc2l6ZS5qYl9ib3ggPSB7XHJcbiAgICAgICAgaDogMTQwICsgc2l6ZS53aXJlX29mZnNldC5iYXNlKjIgKiBzeXN0ZW0uREMuc3RyaW5nX251bSxcclxuICAgICAgICB3OiA4MCxcclxuICAgIH1cclxuXHJcbiAgICBzaXplLmRpc2Nib3ggPSB7XHJcbiAgICAgICAgdzogODAgKyBzaXplLndpcmVfb2Zmc2V0LmJhc2UqMiAqIHN5c3RlbS5EQy5zdHJpbmdfbnVtLFxyXG4gICAgICAgIGg6IDE0MCxcclxuICAgIH1cclxuXHJcbiAgICBzaXplLnRlcm1pbmFsX2RpYW0gPSA1O1xyXG5cclxuICAgIHNpemUuaW52ZXJ0ZXIgPSB7IHc6IDIwMCwgaDogMTUwIH07XHJcbiAgICBzaXplLmludmVydGVyLnRleHRfZ2FwID0gMTU7XHJcbiAgICBzaXplLmludmVydGVyLnN5bWJvbF93ID0gNTA7XHJcbiAgICBzaXplLmludmVydGVyLnN5bWJvbF9oID0gMjU7XHJcblxyXG4gICAgc2l6ZS5BQ19kaXNjID0geyB3OiA3NSwgaDogMTAwIH07XHJcblxyXG4gICAgc2l6ZS5BQ19sb2FkY2VudGVyID0geyB3OiAxMjUsIGg6IDMwMCB9OyBcclxuICAgIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyID0geyB3OiAyMCwgaDogNSwgfTtcclxuXHJcbiAgICBzaXplLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhciA9IHsgdzo1LCBoOjQwIH1cclxuICAgIHNpemUuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIgPSB7IHc6NDAsIGg6NSB9XHJcblxyXG4gICAgc2l6ZS53aXJlX3RhYmxlID0ge31cclxuICAgIHNpemUud2lyZV90YWJsZS53ID0gMjAwO1xyXG4gICAgc2l6ZS53aXJlX3RhYmxlLnJvd19oID0gMTA7XHJcbiAgICBzaXplLndpcmVfdGFibGUuaCA9IChzeXN0ZW0ud2lyZV9jb25maWdfbnVtKzMpICogc2l6ZS53aXJlX3RhYmxlLnJvd19oO1xyXG5cclxuXHJcbiAgICAvLyBsb2NhdGlvblxyXG4gICAgbG9jLmFycmF5ID0geyB4OjIwMCwgeTo2MDAgfTtcclxuICAgIGxvYy5hcnJheS51cHBlciA9IGxvYy5hcnJheS55IC0gc2l6ZS5zdHJpbmcuaC8yO1xyXG4gICAgbG9jLmFycmF5Lmxvd2VyID0gbG9jLmFycmF5LnVwcGVyICsgc2l6ZS5zdHJpbmcuaDtcclxuICAgIGxvYy5hcnJheS5yaWdodCA9IGxvYy5hcnJheS54IC0gc2l6ZS5tb2R1bGUuZnJhbWUuaCoyO1xyXG4gICAgbG9jLmFycmF5LmxlZnQgPSBsb2MuYXJyYXkucmlnaHQgLSAoIHNpemUuc3RyaW5nLncgKiBzeXN0ZW0uREMuc3RyaW5nX251bSApIC0gKCBzaXplLm1vZHVsZS53ICogMS4yNSApIDtcclxuXHJcbiAgICBsb2MuREMgPSBsb2MuYXJyYXk7XHJcblxyXG4gICAgbG9jLmludmVydGVyID0geyB4OmxvYy5hcnJheS54KzMwMCwgeTpsb2MuYXJyYXkueS0zNTAgfTtcclxuICAgIGxvYy5pbnZlcnRlci5ib3R0b20gPSBsb2MuaW52ZXJ0ZXIueSArIHNpemUuaW52ZXJ0ZXIuaC8yO1xyXG4gICAgbG9jLmludmVydGVyLnRvcCA9IGxvYy5pbnZlcnRlci55IC0gc2l6ZS5pbnZlcnRlci5oLzI7XHJcbiAgICBsb2MuaW52ZXJ0ZXIuYm90dG9tX3JpZ2h0ID0ge1xyXG4gICAgICAgIHg6IGxvYy5pbnZlcnRlci54ICsgc2l6ZS5pbnZlcnRlci53LzIsXHJcbiAgICAgICAgeTogbG9jLmludmVydGVyLnkgKyBzaXplLmludmVydGVyLmgvMixcclxuICAgIH07XHJcbiAgICBsb2MuQUNfZGlzYyA9IHsgeDogbG9jLmFycmF5LngrNDc1LCB5OiBsb2MuYXJyYXkueS0xMDAgfTtcclxuICAgIGxvYy5BQ19kaXNjLmJvdHRvbSA9IGxvYy5BQ19kaXNjLnkgKyBzaXplLkFDX2Rpc2MuaC8yO1xyXG4gICAgbG9jLkFDX2Rpc2MudG9wID0gbG9jLkFDX2Rpc2MueSAtIHNpemUuQUNfZGlzYy5oLzI7XHJcbiAgICBsb2MuQUNfZGlzYy5sZWZ0ID0gbG9jLkFDX2Rpc2MueCAtIHNpemUuQUNfZGlzYy53LzI7XHJcbiAgICBsb2MuQUNfZGlzYy5zd2l0Y2hfdG9wID0gbG9jLkFDX2Rpc2MudG9wICsgMTU7XHJcbiAgICBsb2MuQUNfZGlzYy5zd2l0Y2hfYm90dG9tID0gbG9jLkFDX2Rpc2Muc3dpdGNoX3RvcCArIDMwO1xyXG4gICAgXHJcblxyXG5cclxuICAgIGxvYy5BQ19sb2FkY2VudGVyID0ge1xyXG4gICAgICAgIHg6IGxvYy5BQ19kaXNjLngrMTUwLCBcclxuICAgICAgICB5OiBsb2MuQUNfZGlzYy55LTEwMFxyXG4gICAgfTtcclxuICAgIGxvYy5BQ19sb2FkY2VudGVyLndpcmVfYnVuZGxlX2JvdHRvbSA9IGxvYy5BQ19kaXNjLnRvcCAtIDIwO1xyXG4gICAgbG9jLkFDX2xvYWRjZW50ZXIubGVmdCA9IGxvYy5BQ19sb2FkY2VudGVyLnggLSBzaXplLkFDX2xvYWRjZW50ZXIudy8yO1xyXG4gICAgbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMgPSB7XHJcbiAgICAgICAgbGVmdDogbG9jLkFDX2xvYWRjZW50ZXIueCAtICggc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIudyAqIDEuMSApLFxyXG4gICAgICAgIHNwYWNpbmc6IHNpemUudGVybWluYWxfZGlhbSxcclxuICAgIH07XHJcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyID0ge1xyXG4gICAgICAgIHg6IGxvYy5BQ19sb2FkY2VudGVyLmxlZnQgKyAyMCwgXHJcbiAgICAgICAgeTogbG9jLkFDX2xvYWRjZW50ZXIueSArIHNpemUuQUNfbG9hZGNlbnRlci5oKjAuMiBcclxuICAgIH07XHJcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIgPSB7XHJcbiAgICAgICAgeDogbG9jLkFDX2xvYWRjZW50ZXIueCArIDEwLCBcclxuICAgICAgICB5OiBsb2MuQUNfbG9hZGNlbnRlci55ICsgc2l6ZS5BQ19sb2FkY2VudGVyLmgqMC40NVxyXG4gICAgfTtcclxuXHJcbiAgICBsb2Mud2lyZV90YWJsZSA9IHtcclxuICAgICAgICB4OiBzaXplLmRyYXdpbmcudyAtIHNpemUuZHJhd2luZy50aXRsZWJveCAtIHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nKjMgLSBzaXplLndpcmVfdGFibGUudy8yIC0gMjUsXHJcbiAgICAgICAgeTogc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmcqMyArIHNpemUud2lyZV90YWJsZS5oLzIsXHJcbiAgICB9XHJcbiAgICBsb2Mud2lyZV90YWJsZS50b3AgPSBsb2Mud2lyZV90YWJsZS55IC0gc2l6ZS53aXJlX3RhYmxlLmgvMjtcclxuICAgIGxvYy53aXJlX3RhYmxlLmJvdHRvbSA9IGxvYy53aXJlX3RhYmxlLnkgKyBzaXplLndpcmVfdGFibGUuaC8yO1xyXG5cclxuICAgIC8vbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMgPSBcclxuXHJcbn1cclxuXHJcbmxvZygnc2l6ZScsIHNpemUpO1xyXG4gICAgXHJcbmxvZygnbG9jJywgbG9jKTtcclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy9cclxuLy8gYnVpbGQgZHJhd2luZ1xyXG5cclxuLy8jc3RhcnQgZHJhd2luZ1xyXG52YXIgbWtfZHJhd2luZyA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgdmFyIHgsIHksIGgsIHc7XHJcblxyXG5cclxuLy8gRGVmaW5lIGJsb2Nrc1xyXG4vLyBtb2R1bGUgYmxvY2tcclxuICAgIHcgPSBzaXplLm1vZHVsZS5mcmFtZS53O1xyXG4gICAgaCA9IHNpemUubW9kdWxlLmZyYW1lLmg7XHJcblxyXG4gICAgYmxvY2tfc3RhcnQoJ21vZHVsZScpO1xyXG5cclxuICAgIC8vIGZyYW1lXHJcbiAgICBsYXllcignbW9kdWxlJyk7XHJcbiAgICByZWN0KCBbMCxoLzJdLCBbdyxoXSApO1xyXG4gICAgLy8gZnJhbWUgdHJpYW5nbGU/XHJcbiAgICBsaW5lKFtcclxuICAgICAgICBbLXcvMiwwXSxcclxuICAgICAgICBbMCx3LzJdLFxyXG4gICAgXSk7XHJcbiAgICBsaW5lKFtcclxuICAgICAgICBbMCx3LzJdLFxyXG4gICAgICAgIFt3LzIsMF0sXHJcbiAgICBdKTtcclxuICAgIC8vIGxlYWRzXHJcbiAgICBsYXllcignRENfcG9zJyk7XHJcbiAgICBsaW5lKFtcclxuICAgICAgICBbMCwgMF0sXHJcbiAgICAgICAgWzAsIC1zaXplLm1vZHVsZS5sZWFkXVxyXG4gICAgXSk7XHJcbiAgICBsYXllcignRENfbmVnJyk7XHJcbiAgICBsaW5lKFtcclxuICAgICAgICBbMCwgaF0sXHJcbiAgICAgICAgWzAsIGgrKHNpemUubW9kdWxlLmxlYWQpXVxyXG4gICAgXSk7XHJcbiAgICAvLyBwb3Mgc2lnblxyXG4gICAgbGF5ZXIoJ3RleHQnKTtcclxuICAgIHRleHQoXHJcbiAgICAgICAgW3NpemUubW9kdWxlLmxlYWQvMiwgLXNpemUubW9kdWxlLmxlYWQvMl0sXHJcbiAgICAgICAgJysnLFxyXG4gICAgICAgICdzaWducydcclxuICAgICk7XHJcbiAgICAvLyBuZWcgc2lnblxyXG4gICAgdGV4dChcclxuICAgICAgICBbc2l6ZS5tb2R1bGUubGVhZC8yLCBoK3NpemUubW9kdWxlLmxlYWQvMl0sXHJcbiAgICAgICAgJy0nLFxyXG4gICAgICAgICdzaWducydcclxuICAgICk7XHJcbiAgICAvLyBncm91bmRcclxuICAgIGxheWVyKCdEQ19ncm91bmQnKTtcclxuICAgIGxpbmUoW1xyXG4gICAgICAgIFstdy8yLCBoLzJdLFxyXG4gICAgICAgIFstdy8yLXcvNCwgaC8yXSxcclxuICAgIF0pO1xyXG5cclxuICAgIGxheWVyKCk7XHJcbiAgICBibG9ja19lbmQoKTtcclxuXHJcbi8vI3N0cmluZ1xyXG4gICAgYmxvY2tfc3RhcnQoJ3N0cmluZycpO1xyXG5cclxuICAgIHggPSAwO1xyXG4gICAgeSA9IDA7XHJcblxyXG4gICAgeSArPSBzaXplLm1vZHVsZS5sZWFkOyBcclxuXHJcbiAgICAvL1RPRE86IGFkZCBsb29wIHRvIGp1bXAgb3ZlciBuZWdhdGl2ZSByZXR1cm4gd2lyZXMgXHJcbiAgICBsYXllcignRENfZ3JvdW5kJyk7XHJcbiAgICBsaW5lKFtcclxuICAgICAgICBbeC1zaXplLm1vZHVsZS5mcmFtZS53KjMvNCwgeStzaXplLm1vZHVsZS5mcmFtZS5oLzJdLFxyXG4gICAgICAgIFt4LXNpemUubW9kdWxlLmZyYW1lLncqMy80LCB5K3NpemUuc3RyaW5nLmggKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCArIHNpemUubW9kdWxlLmxlYWQqMC41IF0sXHJcbiAgICBdKTtcclxuICAgIGxheWVyKCk7XHJcblxyXG4gICAgYmxvY2soJ21vZHVsZScsIFt4LHldKTtcclxuICAgIHkgKz0gc2l6ZS5tb2R1bGUuZnJhbWUuaCArIHNpemUubW9kdWxlLmxlYWQqMiArIHNpemUuc3RyaW5nLmdhcF9taXNzaW5nO1xyXG4gICAgYmxvY2soJ21vZHVsZScsIFt4LHldKTtcclxuICAgIHkgKz0gc2l6ZS5tb2R1bGUuZnJhbWUuaCArIHNpemUubW9kdWxlLmxlYWQqMiArIHNpemUuc3RyaW5nLmdhcDtcclxuICAgIGJsb2NrKCdtb2R1bGUnLCBbeCx5XSk7XHJcbiAgICB5ICs9IHNpemUubW9kdWxlLmZyYW1lLmggKyBzaXplLm1vZHVsZS5sZWFkKjIgKyBzaXplLnN0cmluZy5nYXA7XHJcbiAgICBibG9jaygnbW9kdWxlJywgW3gseV0pO1xyXG5cclxuICAgIGJsb2NrX2VuZCgpO1xyXG5cclxuXHJcbi8vIHRlcm1pbmFsXHJcbiAgICBibG9ja19zdGFydCgndGVybWluYWwnKTtcclxuICAgIHggPSAwO1xyXG4gICAgeSA9IDA7XHJcblxyXG4gICAgbGF5ZXIoJ3Rlcm1pbmFsJyk7XHJcbiAgICBjaXJjKFxyXG4gICAgICAgIFt4LHldLFxyXG4gICAgICAgIHNpemUudGVybWluYWxfZGlhbVxyXG4gICAgKVxyXG4gICAgbGF5ZXIoKTtcclxuICAgIGJsb2NrX2VuZCgpO1xyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBGcmFtZVxyXG5cclxuICAgIHcgPSBzaXplLmRyYXdpbmcudztcclxuICAgIGggPSBzaXplLmRyYXdpbmcuaDtcclxuICAgIHZhciBwYWRkaW5nID0gc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmc7IFxyXG5cclxuICAgIGxheWVyKCdmcmFtZScpO1xyXG5cclxuICAgIC8vYm9yZGVyXHJcbiAgICByZWN0KCBbdy8yICwgaC8yXSwgW3cgLSBwYWRkaW5nKjIsIGggLSBwYWRkaW5nKjIgXSApO1xyXG4gICAgXHJcbiAgICB4ID0gdyAtIHBhZGRpbmcgKiAzO1xyXG4gICAgeSA9IHBhZGRpbmcgKiAzO1xyXG5cclxuICAgIHcgPSBzaXplLmRyYXdpbmcudGl0bGVib3g7XHJcbiAgICBoID0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94O1xyXG5cclxuICAgIC8vIGJveCB0b3AtcmlnaHRcclxuICAgIHJlY3QoIFt4LXcvMiwgeStoLzJdLCBbdyxoXSApO1xyXG4gICAgXHJcbiAgICB5ICs9IGggKyBwYWRkaW5nOyBcclxuXHJcbiAgICB3ID0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94O1xyXG4gICAgaCA9IHNpemUuZHJhd2luZy5oIC0gcGFkZGluZyo4IC0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94KjIuNTtcclxuICAgIFxyXG4gICAgLy90aXRsZSBib3hcclxuICAgIHJlY3QoIFt4LXcvMiwgeStoLzJdLCBbdyxoXSApO1xyXG5cclxuICAgIHZhciB0aXRsZSA9IHt9O1xyXG4gICAgdGl0bGUudG9wID0geTtcclxuICAgIHRpdGxlLmJvdHRvbSA9IHkraDtcclxuICAgIHRpdGxlLnJpZ2h0ID0geDtcclxuICAgIHRpdGxlLmxlZnQgPSB4LXcgO1xyXG5cclxuXHJcbiAgICAvLyBib3ggYm90dG9tLXJpZ2h0XHJcbiAgICBoID0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94ICogMS41O1xyXG4gICAgeSA9IHRpdGxlLmJvdHRvbSArIHBhZGRpbmc7IFxyXG4gICAgcmVjdCggW3gtdy8yLCB5K2gvMl0sIFt3LGhdICk7XHJcbiAgICBcclxuICAgIHZhciBwYWdlID0ge307XHJcbiAgICBwYWdlLnJpZ2h0ID0gdGl0bGUucmlnaHQ7XHJcbiAgICBwYWdlLmxlZnQgPSB0aXRsZS5sZWZ0O1xyXG4gICAgcGFnZS50b3AgPSB0aXRsZS5ib3R0b20gKyBwYWRkaW5nO1xyXG4gICAgcGFnZS5ib3R0b20gPSBwYWdlLnRvcCArIHNpemUuZHJhd2luZy50aXRsZWJveCoxLjU7XHJcbiAgICAvLyBUZXh0XHJcblxyXG4gICAgeCA9IHRpdGxlLmxlZnQgKyBwYWRkaW5nO1xyXG4gICAgeSA9IHRpdGxlLmJvdHRvbSAtIHBhZGRpbmc7XHJcblxyXG4gICAgeCArPSAxMDtcclxuICAgIHRleHQoW3gseV0sIFxyXG4gICAgICAgICBbIHN5c3RlbS5pbnZlcnRlci5NYWtlICsgXCIgXCIgKyBzeXN0ZW0uaW52ZXJ0ZXIubW9kZWwgKyBcIiBJbnZlcnRlciBTeXN0ZW1cIiBdLFxyXG4gICAgICAgICd0aXRsZTEnLCAndGV4dCcpLnJvdGF0ZSgtOTApO1xyXG5cclxuICAgIHggKz0gMTQ7XHJcbiAgICB0ZXh0KFt4LHldLCBbXHJcbiAgICAgICAgc3lzdGVtLkRDLm1vZHVsZS5zcGVjcy5NYWtlICsgXCIgXCIgKyBzeXN0ZW0uREMubW9kdWxlLnNwZWNzLm1vZGVsICsgXHJcbiAgICAgICAgICAgIFwiIChcIiArIHN5c3RlbS5EQy5zdHJpbmdfbnVtICArIFwiIHN0cmluZ3Mgb2YgXCIgKyBzeXN0ZW0uREMuc3RyaW5nX21vZHVsZXMgKyBcIiBtb2R1bGVzIClcIlxyXG4gICAgXSwgJ3RpdGxlMicsICd0ZXh0Jykucm90YXRlKC05MCk7XHJcbiAgICAgICAgXHJcbiAgICB4ID0gcGFnZS5sZWZ0ICsgcGFkZGluZztcclxuICAgIHkgPSBwYWdlLnRvcCArIHBhZGRpbmc7XHJcbiAgICB5ICs9IHNpemUuZHJhd2luZy50aXRsZWJveCAqIDEuNSAqIDMvNDtcclxuXHJcblxyXG4gICAgdGV4dChbeCx5XSxcclxuICAgICAgICBbJ1BWMSddLFxyXG4gICAgICAgICdwYWdlJywgJ3RleHQnKTtcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8jYXJyYXlcclxuICAgIC8vIFBWIGFycmF5XHJcblxyXG5cclxuICAgIHggPSBsb2MuYXJyYXkueDtcclxuICAgIHkgPSBsb2MuYXJyYXkueTtcclxuXHJcbiAgICBjaXJjKFt4LHldLCA1LCAnYmFzZScpOyAvLyBNQVJLRVJcclxuXHJcbiAgICB4IC09IHNpemUubW9kdWxlLmZyYW1lLmgqMztcclxuICAgIHkgLT0gc2l6ZS5zdHJpbmcuaC8yO1xyXG5cclxuICAgIGZvciggdmFyIGk9MDsgaTxzeXN0ZW0uREMuc3RyaW5nX251bTsgaSsrICkge1xyXG4gICAgICAgIHZhciBvZmZzZXQgPSBpICogc2l6ZS53aXJlX29mZnNldC5iYXNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGJsb2NrKCdzdHJpbmcnLCBbeCx5XSk7XHJcbiAgICAgICAgLy8gcG9zaXRpdmUgaG9tZSBydW5cclxuICAgICAgICBsYXllcignRENfcG9zJyk7XHJcbiAgICAgICAgbGluZShbXHJcbiAgICAgICAgICAgIFsgeCAsIGxvYy5hcnJheS51cHBlciBdLFxyXG4gICAgICAgICAgICBbIHggLCBsb2MuYXJyYXkudXBwZXItc2l6ZS5tb2R1bGUudy1vZmZzZXQgXSxcclxuICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrb2Zmc2V0ICwgbG9jLmFycmF5LnVwcGVyLXNpemUubW9kdWxlLnctb2Zmc2V0IF0sXHJcbiAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K29mZnNldCAsIGxvYy5hcnJheS55LXNpemUubW9kdWxlLnctb2Zmc2V0XSxcclxuICAgICAgICAgICAgWyBsb2MuYXJyYXkueCAsIGxvYy5hcnJheS55LXNpemUubW9kdWxlLnctb2Zmc2V0XSxcclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgLy8gbmVnYXRpdmUgaG9tZSBydW5cclxuICAgICAgICBsYXllcignRENfbmVnJyk7XHJcbiAgICAgICAgbGluZShbXHJcbiAgICAgICAgICAgIFsgeCAsIGxvYy5hcnJheS5sb3dlciBdLFxyXG4gICAgICAgICAgICBbIHggLCBsb2MuYXJyYXkubG93ZXIrc2l6ZS5tb2R1bGUudytvZmZzZXQgXSxcclxuICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrb2Zmc2V0ICwgbG9jLmFycmF5Lmxvd2VyK3NpemUubW9kdWxlLncrb2Zmc2V0IF0sXHJcbiAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K29mZnNldCAsIGxvYy5hcnJheS55K3NpemUubW9kdWxlLncrb2Zmc2V0XSxcclxuICAgICAgICAgICAgWyBsb2MuYXJyYXkueCAsIGxvYy5hcnJheS55K3NpemUubW9kdWxlLncrb2Zmc2V0XSxcclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgeCAtPSBzaXplLnN0cmluZy53O1xyXG4gICAgfVxyXG5cclxuICAgIGxheWVyKCdEQ19ncm91bmQnKTtcclxuICAgIGxpbmUoW1xyXG4gICAgICAgIFsgbG9jLmFycmF5LmxlZnQgLCBsb2MuYXJyYXkubG93ZXIgKyBzaXplLm1vZHVsZS53ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcclxuICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCAsIGxvYy5hcnJheS5sb3dlciArIHNpemUubW9kdWxlLncgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxyXG4gICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kICwgbG9jLmFycmF5LnkgKyBzaXplLm1vZHVsZS53ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmRdLFxyXG4gICAgICAgIFsgbG9jLmFycmF5LnggLCBsb2MuYXJyYXkueStzaXplLm1vZHVsZS53K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcclxuICAgIF0pO1xyXG5cclxuICAgIGxheWVyKCk7XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBjb21iaW5lciBib3hcclxuICAgIHggPSBsb2MuYXJyYXkueDtcclxuICAgIHkgPSBsb2MuYXJyYXkueTtcclxuXHJcbiAgICB2YXIgZnVzZV93aWR0aCA9IHNpemUud2lyZV9vZmZzZXQuZ2FwO1xyXG4gICAgdmFyIHRvX2Rpc2Nvbm5lY3RfeCA9IDE1MDtcclxuICAgIHZhciB0b19kaXNjb25uZWN0X3kgPSAtMTAwO1xyXG5cclxuICAgIFxyXG4gICAgcmVjdChcclxuICAgICAgICBbeCtzaXplLmpiX2JveC53LzIseS1zaXplLmpiX2JveC5oLzEwXSxcclxuICAgICAgICBbc2l6ZS5qYl9ib3gudyxzaXplLmpiX2JveC5oXSxcclxuICAgICAgICAnYm94J1xyXG4gICAgKTtcclxuXHJcblxyXG4gICAgZm9yKCB2YXIgaSBpbiBfLnJhbmdlKHN5c3RlbS5EQy5zdHJpbmdfbnVtKSkge1xyXG4gICAgICAgIHZhciBvZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0LmdhcCArICggaSAqIHNpemUud2lyZV9vZmZzZXQuYmFzZSApO1xyXG5cclxuICAgICAgICBsYXllcignRENfcG9zJyk7XHJcbiAgICAgICAgbGluZShbXHJcbiAgICAgICAgICAgIFsgeCAsIHktb2Zmc2V0XSxcclxuICAgICAgICAgICAgWyB4KyhzaXplLmpiX2JveC53LWZ1c2Vfd2lkdGgpLzIgLCB5LW9mZnNldF0sXHJcbiAgICAgICAgXSk7XHJcbiAgICAgICAgbGluZShbXHJcbiAgICAgICAgICAgIFsgeCsoc2l6ZS5qYl9ib3gudytmdXNlX3dpZHRoKS8yICwgeS1vZmZzZXRdLFxyXG4gICAgICAgICAgICBbIHgrc2l6ZS5qYl9ib3gudyt0b19kaXNjb25uZWN0X3gtb2Zmc2V0ICwgeS1vZmZzZXRdLFxyXG4gICAgICAgICAgICBbIHgrc2l6ZS5qYl9ib3gudyt0b19kaXNjb25uZWN0X3gtb2Zmc2V0ICwgeSt0b19kaXNjb25uZWN0X3ktc2l6ZS50ZXJtaW5hbF9kaWFtXSxcclxuICAgICAgICAgICAgWyB4K3NpemUuamJfYm94LncrdG9fZGlzY29ubmVjdF94LW9mZnNldCAsIHkrdG9fZGlzY29ubmVjdF95LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXHJcbiAgICAgICAgXSk7XHJcbiAgICAgICAgYmxvY2soICd0ZXJtaW5hbCcsIHtcclxuICAgICAgICAgICAgeDogeCtzaXplLmpiX2JveC53K3RvX2Rpc2Nvbm5lY3RfeC1vZmZzZXQsXHJcbiAgICAgICAgICAgIHk6IHkrdG9fZGlzY29ubmVjdF95LXNpemUudGVybWluYWxfZGlhbVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsYXllcignRENfbmVnJyk7XHJcbiAgICAgICAgbGluZShbXHJcbiAgICAgICAgICAgIFsgeCAsIHkrb2Zmc2V0XSxcclxuICAgICAgICAgICAgWyB4KyhzaXplLmpiX2JveC53LWZ1c2Vfd2lkdGgpLzIgLCB5K29mZnNldF0sXHJcbiAgICAgICAgXSk7XHJcbiAgICAgICAgbGluZShbXHJcbiAgICAgICAgICAgIFsgeCsoc2l6ZS5qYl9ib3gudytmdXNlX3dpZHRoKS8yICwgeStvZmZzZXRdLFxyXG4gICAgICAgICAgICBbIHgrc2l6ZS5qYl9ib3gudyt0b19kaXNjb25uZWN0X3grb2Zmc2V0ICwgeStvZmZzZXRdLFxyXG4gICAgICAgICAgICBbIHgrc2l6ZS5qYl9ib3gudyt0b19kaXNjb25uZWN0X3grb2Zmc2V0ICwgeSt0b19kaXNjb25uZWN0X3ktc2l6ZS50ZXJtaW5hbF9kaWFtXSxcclxuICAgICAgICAgICAgWyB4K3NpemUuamJfYm94LncrdG9fZGlzY29ubmVjdF94K29mZnNldCAsIHkrdG9fZGlzY29ubmVjdF95LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXHJcbiAgICAgICAgXSk7XHJcbiAgICAgICAgYmxvY2soICd0ZXJtaW5hbCcsIHtcclxuICAgICAgICAgICAgeDogeCtzaXplLmpiX2JveC53K3RvX2Rpc2Nvbm5lY3RfeCtvZmZzZXQsXHJcbiAgICAgICAgICAgIHk6IHkrdG9fZGlzY29ubmVjdF95LXNpemUudGVybWluYWxfZGlhbVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHggKz0gc2l6ZS5qYl9ib3gudztcclxuXHJcbiAgICB4ICs9IHRvX2Rpc2Nvbm5lY3RfeDtcclxuICAgIHkgKz0gdG9fZGlzY29ubmVjdF95O1xyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gREMgZGlzY29uZWN0IGNvbWJpbmVyIGxpbmVzXHJcbiAgICBpZiggc3lzdGVtLkRDLnN0cmluZ19udW0gPiAxKXtcclxuICAgICAgICB2YXIgb2Zmc2V0X21pbiA9IHNpemUud2lyZV9vZmZzZXQuZ2FwO1xyXG4gICAgICAgIHZhciBvZmZzZXRfbWF4ID0gc2l6ZS53aXJlX29mZnNldC5nYXAgKyAoIChzeXN0ZW0uREMuc3RyaW5nX251bS0xKSAqIHNpemUud2lyZV9vZmZzZXQuYmFzZSApO1xyXG4gICAgICAgIGxpbmUoW1xyXG4gICAgICAgICAgICBbIHgtb2Zmc2V0X21pbiwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxyXG4gICAgICAgICAgICBbIHgtb2Zmc2V0X21heCAsIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcclxuICAgICAgICBdLCAnRENfcG9zJyk7XHJcbiAgICAgICAgbGluZShbXHJcbiAgICAgICAgICAgIFsgeCtvZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXHJcbiAgICAgICAgICAgIFsgeCtvZmZzZXRfbWF4LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXHJcbiAgICAgICAgXSwgJ0RDX25lZycpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBJbnZlcnRlciBjb25lY3Rpb25cclxuICAgIGxpbmUoW1xyXG4gICAgICAgIFsgeC1vZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXHJcbiAgICAgICAgWyB4LW9mZnNldF9taW4sIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcclxuICAgIF0sJ0RDX3BvcycpXHJcblxyXG5cclxuXHJcbiAgICAvLyBEQyBkaXNjb25lY3RcclxuICAgIHJlY3QoXHJcbiAgICAgICAgW3gsIHktc2l6ZS5kaXNjYm94LmgvMl0sXHJcbiAgICAgICAgW3NpemUuZGlzY2JveC53LHNpemUuZGlzY2JveC5oXSxcclxuICAgICAgICAnYm94J1xyXG4gICAgKTtcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8jaW52ZXJ0ZXJcclxuICAgIHggPSBsb2MuaW52ZXJ0ZXIueDtcclxuICAgIHkgPSBsb2MuaW52ZXJ0ZXIueTtcclxuXHJcblxyXG4gICAgLy9mcmFtZVxyXG4gICAgbGF5ZXIoJ2JveCcpO1xyXG4gICAgcmVjdChcclxuICAgICAgICBbeCx5XSxcclxuICAgICAgICBbc2l6ZS5pbnZlcnRlci53LCBzaXplLmludmVydGVyLmhdXHJcbiAgICApO1xyXG4gICAgLy8gTGFiZWwgYXQgdG9wIChJbnZlcnRlciwgbWFrZSwgbW9kZWwsIC4uLilcclxuICAgIGxheWVyKCd0ZXh0Jyk7XHJcbiAgICB0ZXh0KFxyXG4gICAgICAgIFtsb2MuaW52ZXJ0ZXIueCwgbG9jLmludmVydGVyLnRvcCArIHNpemUuaW52ZXJ0ZXIudGV4dF9nYXAgXSxcclxuICAgICAgICBbICdJbnZlcnRlcicsIGNvbXBvbmVudHMuaW52ZXJ0ZXJzW3NldHRpbmdzLmludmVydGVyXS5NYWtlICsgXCIgXCIgKyBjb21wb25lbnRzLmludmVydGVyc1tzZXR0aW5ncy5pbnZlcnRlcl0ubW9kZWwgXSxcclxuICAgICAgICAnbGFiZWwnXHJcbiAgICApO1xyXG4gICAgbGF5ZXIoKTtcclxuXHJcbi8vI2ludmVydGVyIHN5bWJvbFxyXG5cclxuICAgIHggPSBsb2MuaW52ZXJ0ZXIueDtcclxuICAgIHkgPSBsb2MuaW52ZXJ0ZXIueTtcclxuICAgIFxyXG4gICAgdmFyIHcgPSBzaXplLmludmVydGVyLnN5bWJvbF93O1xyXG4gICAgdmFyIGggPSBzaXplLmludmVydGVyLnN5bWJvbF9oO1xyXG5cclxuICAgIHZhciBzcGFjZSA9IHcqMS8xMjtcclxuXHJcbiAgICAvLyBJbnZlcnRlciBzeW1ib2xcclxuICAgIGxheWVyKCdib3gnKTtcclxuXHJcbiAgICAvLyBib3hcclxuICAgIHJlY3QoXHJcbiAgICAgICAgW3gseV0sXHJcbiAgICAgICAgW3csIGhdXHJcbiAgICApO1xyXG4gICAgLy8gZGlhZ2FuYWxcclxuICAgIGxpbmUoW1xyXG4gICAgICAgIFt4LXcvMiwgeStoLzJdLFxyXG4gICAgICAgIFt4K3cvMiwgeS1oLzJdLFxyXG4gICAgXHJcbiAgICBdKTtcclxuICAgIC8vIERDXHJcbiAgICBsaW5lKFtcclxuICAgICAgICBbeCAtIHcvMiArIHNwYWNlLCBcclxuICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlXSxcclxuICAgICAgICBbeCAtIHcvMiArIHNwYWNlKjYsIFxyXG4gICAgICAgICAgICB5IC0gaC8yICsgc3BhY2VdLFxyXG4gICAgXSk7XHJcbiAgICBsaW5lKFtcclxuICAgICAgICBbeCAtIHcvMiArIHNwYWNlLCBcclxuICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlKjJdLFxyXG4gICAgICAgIFt4IC0gdy8yICsgc3BhY2UqMiwgXHJcbiAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcclxuICAgIF0pO1xyXG4gICAgbGluZShbXHJcbiAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSozLCBcclxuICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlKjJdLFxyXG4gICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNCwgXHJcbiAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcclxuICAgIF0pO1xyXG4gICAgbGluZShbXHJcbiAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSo1LCBcclxuICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlKjJdLFxyXG4gICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNiwgXHJcbiAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcclxuICAgIF0pO1xyXG5cclxuICAgIC8vIEFDXHJcbiAgICBsaW5lKFtcclxuICAgICAgICBbeCArIHcvMiAtIHNwYWNlLCBcclxuICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXHJcbiAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSoyLCBcclxuICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXHJcbiAgICBdKTtcclxuICAgIGxpbmUoW1xyXG4gICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqMywgXHJcbiAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxyXG4gICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqNCwgXHJcbiAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxyXG4gICAgXSk7XHJcbiAgICBsaW5lKFtcclxuICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjUsIFxyXG4gICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcclxuICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjYsIFxyXG4gICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcclxuICAgIF0pO1xyXG4gICAgbGF5ZXIoKTtcclxuICAgICAgICBcclxuXHJcblxyXG5cclxuXHJcblxyXG4vLyNBQ19kaXNjY29uZWN0XHJcbiAgICB4ID0gbG9jLkFDX2Rpc2MueDtcclxuICAgIHkgPSBsb2MuQUNfZGlzYy55O1xyXG4gICAgcGFkZGluZyA9IHNpemUudGVybWluYWxfZGlhbTtcclxuXHJcbiAgICBsYXllcignYm94Jyk7XHJcbiAgICByZWN0KFxyXG4gICAgICAgIFt4LCB5XSxcclxuICAgICAgICBbc2l6ZS5BQ19kaXNjLncsIHNpemUuQUNfZGlzYy5oXVxyXG4gICAgKTtcclxuICAgIGxheWVyKCk7XHJcblxyXG5cclxuLy9sb2coJ3NpemU6JywgW2gsd10pXHJcbi8vbG9nKCdsb2NhdGlvbjonLCBbeCx5XSlcclxuLy9jaXJjKFt4LHldLDUpO1xyXG5cclxuXHJcblxyXG4vLyNBQyBsb2FkIGNlbnRlclxyXG4gICAgdmFyIGJvdHRvbSA9IGxvYy5BQ19sb2FkY2VudGVyLndpcmVfYnVuZGxlX2JvdHRvbTsgICAgXHJcbiAgICB2YXIgYnJlYWtlcl9zcGFjaW5nID0gbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMuc3BhY2luZztcclxuXHJcbiAgICB4ID0gbG9jLkFDX2xvYWRjZW50ZXIueDtcclxuICAgIHkgPSBsb2MuQUNfbG9hZGNlbnRlci55O1xyXG4gICAgdyA9IHNpemUuQUNfbG9hZGNlbnRlci53O1xyXG4gICAgaCA9IHNpemUuQUNfbG9hZGNlbnRlci5oO1xyXG5cclxuICAgIHJlY3QoW3gseV0sXHJcbiAgICAgICAgW3csaF0sXHJcbiAgICAgICAgJ2JveCdcclxuICAgICk7XHJcblxyXG4gICAgdGV4dChbeCx5LWgqMC40XSxcclxuICAgICAgICBbc3lzdGVtLkFDX2xvYWRjZW50ZXJfdHlwZSwgJ0xvYWQgQ2VudGVyJ10sXHJcbiAgICAgICAgJ2xhYmVsJyxcclxuICAgICAgICAndGV4dCdcclxuICAgIClcclxuICAgIHcgPSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci53O1xyXG4gICAgaCA9IHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyLmg7XHJcblxyXG4gICAgeSAtPSBzaXplLkFDX2xvYWRjZW50ZXIuaC80O1xyXG5cclxuICAgIHBhZGRpbmcgPSBsb2MuQUNfbG9hZGNlbnRlci54IC0gbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMubGVmdCAtIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyLnc7XHJcblxyXG4gICAgZm9yKCB2YXIgaT0wOyBpPDMwOyBpKyspe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJlY3QoW3gtcGFkZGluZy13LzIseV0sW3csaF0sJ2JveCcpO1xyXG4gICAgICAgIHJlY3QoW3grcGFkZGluZyt3LzIseV0sW3csaF0sJ2JveCcpO1xyXG4gICAgXHJcbiAgICAgICAgeSArPSBicmVha2VyX3NwYWNpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHMsIGw7XHJcbiAgICBcclxuICAgIGwgPSBsb2MuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyO1xyXG4gICAgcyA9IHNpemUuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyO1xyXG4gICAgcmVjdChbbC54LGwueV0sIFtzLncscy5oXSwgJ0FDX25ldXRyYWwnIClcclxuXHJcbiAgICBsID0gbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyO1xyXG4gICAgcyA9IHNpemUuQUNfbG9hZGNlbnRlci5ncm91bmRiYXI7XHJcbiAgICByZWN0KFtsLngsbC55XSwgW3MudyxzLmhdLCAnQUNfZ3JvdW5kJyApXHJcblxyXG4gICAgXHJcblxyXG5cclxuXHJcbi8vIEFDIGxpbmVzXHJcblxyXG4gICAgeCA9IGxvYy5pbnZlcnRlci5ib3R0b21fcmlnaHQueDtcclxuICAgIHkgPSBsb2MuaW52ZXJ0ZXIuYm90dG9tX3JpZ2h0Lnk7XHJcbiAgICB4IC09IHNpemUudGVybWluYWxfZGlhbSAqIChzeXN0ZW0uQUNfY29uZHVjdG9ycy5sZW5ndGgrMyk7XHJcbiAgICB5IC09IHNpemUudGVybWluYWxfZGlhbTtcclxuXHJcbiAgICAvL3ZhciBBQ19sYXllcl9uYW1lcyA9IFsnQUNfZ3JvdW5kJywgJ0FDX25ldXRyYWwnLCAnQUNfTDEnLCAnQUNfTDInLCAnQUNfTDInXTtcclxuXHJcbiAgICAvL2xvZyhzeXN0ZW0uQUNfY29uZHVjdG9ycy5sZW5ndGgpXHJcblxyXG4gICAgZm9yKCB2YXIgaT0wOyBpIDwgc3lzdGVtLkFDX2NvbmR1Y3RvcnMubGVuZ3RoOyBpKysgKXtcclxuICAgICAgICBibG9jaygndGVybWluYWwnLCBbeCx5XSApO1xyXG4gICAgICAgIGxheWVyKCdBQ18nK3N5c3RlbS5BQ19jb25kdWN0b3JzW2ldKTtcclxuICAgICAgICBsaW5lKFtcclxuICAgICAgICAgICAgW3gsIHldLFxyXG4gICAgICAgICAgICBbeCwgbG9jLkFDX2Rpc2MuYm90dG9tIC0gc2l6ZS50ZXJtaW5hbF9kaWFtICogKGkrMSkgXSxcclxuICAgICAgICAgICAgW2xvYy5BQ19kaXNjLmxlZnQsIGxvYy5BQ19kaXNjLmJvdHRvbSAtIHNpemUudGVybWluYWxfZGlhbSAqIChpKzEpIF0sXHJcbiAgICAgICAgXSk7XHJcbiAgICAgICAgeCArPSBzaXplLnRlcm1pbmFsX2RpYW07XHJcbiAgICB9XHJcbiAgICBsYXllcigpO1xyXG5cclxuICAgIHggPSBsb2MuQUNfZGlzYy54O1xyXG4gICAgeSA9IGxvYy5BQ19kaXNjLnk7XHJcbiAgICBwYWRkaW5nID0gc2l6ZS50ZXJtaW5hbF9kaWFtO1xyXG5cclxuICAgIHggLT0gc2l6ZS5BQ19kaXNjLncvMlxyXG4gICAgeSArPSBzaXplLkFDX2Rpc2MuaC8yXHJcblxyXG4gICAgeSAtPSBwYWRkaW5nO1xyXG5cclxuICAgIGlmKCBzeXN0ZW0uQUNfY29uZHVjdG9ycy5pbmRleE9mKCdncm91bmQnKSsxICkge1xyXG4gICAgICAgIGxheWVyKCdBQ19ncm91bmQnKTtcclxuICAgICAgICBsaW5lKFtcclxuICAgICAgICAgICAgW3gseV0sXHJcbiAgICAgICAgICAgIFsgeCtzaXplLkFDX2Rpc2MudytwYWRkaW5nKjMsIHkgXSxcclxuICAgICAgICAgICAgWyB4K3NpemUuQUNfZGlzYy53K3BhZGRpbmcqMywgYm90dG9tIF0sXHJcbiAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIubGVmdCtwYWRkaW5nKjIsIGJvdHRvbSBdLFxyXG4gICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLmxlZnQrcGFkZGluZyoyLCB5IF0sXHJcbiAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLngtcGFkZGluZywgeSBdLFxyXG4gICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci54LXBhZGRpbmcsIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci55K3NpemUuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIuaC8yIF0sXHJcbiAgICAgICAgXSlcclxuICAgIH1cclxuXHJcbiAgICBpZiggc3lzdGVtLkFDX2NvbmR1Y3RvcnMuaW5kZXhPZignbmV1dHJhbCcpKzEgKSB7XHJcbiAgICAgICAgeSAtPSBwYWRkaW5nO1xyXG4gICAgICAgIGxheWVyKCdBQ19uZXV0cmFsJyk7XHJcbiAgICAgICAgbGluZShbXHJcbiAgICAgICAgICAgIFt4LHldLFxyXG4gICAgICAgICAgICBbIHgrc2l6ZS5BQ19kaXNjLnctcGFkZGluZyoxLCB5IF0sXHJcbiAgICAgICAgICAgIFsgeCtzaXplLkFDX2Rpc2Mudy1wYWRkaW5nKjEsIGJvdHRvbS1icmVha2VyX3NwYWNpbmcqMSBdLFxyXG4gICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIueCwgYm90dG9tLWJyZWFrZXJfc3BhY2luZyoxIF0sXHJcbiAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhci54LCBcclxuICAgICAgICAgICAgICAgIGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIueS1zaXplLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhci5oLzIgXSxcclxuICAgICAgICBdKVxyXG4gICAgfVxyXG4gICAgICAgIFxyXG4gICAgIFxyXG4gICAgZm9yKCB2YXIgaT0xOyBpIDw9IDM7IGkrKyApIHtcclxuICAgICAgICBpZiggc3lzdGVtLkFDX2NvbmR1Y3RvcnMuaW5kZXhPZignTCcraSkrMSApIHtcclxuICAgICAgICAgICAgeSAtPSBwYWRkaW5nO1xyXG4gICAgICAgICAgICBsYXllcignQUNfTCcraSk7XHJcbiAgICAgICAgICAgIGxpbmUoW1xyXG4gICAgICAgICAgICAgICAgW3gseV0sXHJcbiAgICAgICAgICAgICAgICBbIHgrcGFkZGluZyooMTUtaSozKSwgeSBdLFxyXG4gICAgICAgICAgICAgICAgWyB4K3BhZGRpbmcqKDE1LWkqMyksIGxvYy5BQ19kaXNjLnN3aXRjaF9ib3R0b20gXSxcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgICAgIGJsb2NrKCd0ZXJtaW5hbCcsIFsgeCtwYWRkaW5nKigxNS1pKjMpLCBsb2MuQUNfZGlzYy5zd2l0Y2hfYm90dG9tIF0gKVxyXG4gICAgICAgICAgICBibG9jaygndGVybWluYWwnLCBbIHgrcGFkZGluZyooMTUtaSozKSwgbG9jLkFDX2Rpc2Muc3dpdGNoX3RvcCBdIClcclxuICAgICAgICAgICAgbGluZShbXHJcbiAgICAgICAgICAgICAgICBbIHgrcGFkZGluZyooMTUtaSozKSwgbG9jLkFDX2Rpc2Muc3dpdGNoX3RvcCBdLFxyXG4gICAgICAgICAgICAgICAgWyB4K3BhZGRpbmcqKDE1LWkqMyksIGJvdHRvbS1icmVha2VyX3NwYWNpbmcqKGkrMikgXSxcclxuICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMubGVmdCwgYm90dG9tLWJyZWFrZXJfc3BhY2luZyooaSsyKSBdLFxyXG4gICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICB4ID0gbG9jLndpcmVfdGFibGUueDtcclxuICAgIHkgPSBsb2Mud2lyZV90YWJsZS55O1xyXG4gICAgdyA9IHNpemUud2lyZV90YWJsZS53O1xyXG4gICAgaCA9IHNpemUud2lyZV90YWJsZS5oO1xyXG4gICAgdmFyIHJvd19oID0gc2l6ZS53aXJlX3RhYmxlLnJvd19oO1xyXG4gICAgdmFyIHRvcCA9IGxvYy53aXJlX3RhYmxlLnRvcDtcclxuICAgIHZhciBib3R0b20gPSBsb2Mud2lyZV90YWJsZS5ib3R0b207XHJcbiAgICB2YXIgY29sdW1uX3dpZHRoID0ge1xyXG4gICAgICAgIG51bWJlcjogMjUsXHJcbiAgICAgICAgd2lyZV9nYXVnZTogMjUsXHJcbiAgICAgICAgd2lyZV90eXBlOiA1MCxcclxuICAgICAgICBjb25kdWl0X2dhdWdlOiAyNSxcclxuICAgICAgICBjb25kdWl0X3R5cGU6IDUwLFxyXG4gICAgfVxyXG5cclxuICAgIGxheWVyKCd0YWJsZScpXHJcbiAgICByZWN0KCBbeCx5XSwgW3csaF0gKTtcclxuXHJcbiAgICBsaW5lKFtcclxuICAgICAgICBbeC13LzIrMjUgLCB5LWgvMisoMSpyb3dfaCldLFxyXG4gICAgICAgIFt4K3cvMiAsIHktaC8yKygxKnJvd19oKV0sXHJcbiAgICBdKVxyXG5cclxuICAgIGZvciggdmFyIHI9MjsgcjxzeXN0ZW0ud2lyZV9jb25maWdfbnVtKzM7IHIrKyApIHtcclxuICAgIFxyXG4gICAgICAgIGxpbmUoW1xyXG4gICAgICAgICAgICBbeC13LzIgLCB5LWgvMisocipyb3dfaCldLFxyXG4gICAgICAgICAgICBbeCt3LzIgLCB5LWgvMisocipyb3dfaCldLFxyXG4gICAgICAgIF0pXHJcbiAgICB9XHJcbiAgICB4ID0gbG9jLndpcmVfdGFibGUueCAtIHcvMjtcclxuICAgIHkgPSBsb2Mud2lyZV90YWJsZS55IC0gaC8yO1xyXG4gICAgeCArPSBjb2x1bW5fd2lkdGgubnVtYmVyO1xyXG5cclxuICAgIHZhciBjX3cgPSBjb2x1bW5fd2lkdGgud2lyZV9nYXVnZTtcclxuICAgIGxpbmUoWyBbeCx0b3BdLCBbeCxib3R0b20tcm93X2hdIF0pO1xyXG4gICAgdGV4dCggW3grY193LHkrcm93X2gqMC43NV0sICdXaXJlJywgJ3RhYmxlJywgJ3RleHQnKTtcclxuICAgIHRleHQoIFt4K2Nfdy8yLHkrcm93X2gqMS43NV0sICdBV0cnLCAndGFibGUnLCAndGV4dCcpO1xyXG4gICAgeCArPSBjX3c7XHJcblxyXG4gICAgY193ID0gY29sdW1uX3dpZHRoLndpcmVfdHlwZTtcclxuICAgIGxpbmUoWyBbeCx0b3Arcm93X2hdLCBbeCxib3R0b20tcm93X2hdIF0pO1xyXG4gICAgdGV4dCggW3grY193LzIseStyb3dfaCoxLjc1XSwgJ1R5cGUnLCAndGFibGUnLCAndGV4dCcpO1xyXG4gICAgeCArPSBjX3c7XHJcblxyXG4gICAgY193ID0gY29sdW1uX3dpZHRoLmNvbmR1aXRfZ2F1Z2U7XHJcbiAgICBsaW5lKFsgW3gsdG9wXSwgW3gsYm90dG9tLXJvd19oXSBdKTtcclxuICAgIHRleHQoIFt4K2Nfdyx5K3Jvd19oKjAuNzVdLCAnQ29uZHVpdCcsICd0YWJsZScsICd0ZXh0Jyk7XHJcbiAgICB0ZXh0KCBbeCtjX3cvMix5K3Jvd19oKjEuNzVdLCAnU2l6ZScsICd0YWJsZScsICd0ZXh0Jyk7XHJcbiAgICB4ICs9IGNfdztcclxuXHJcbiAgICBsaW5lKFsgW3gsdG9wK3Jvd19oXSwgW3gsYm90dG9tLXJvd19oXSBdKTtcclxuICAgIHRleHQoIFt4K2Nfdy8yLHkrcm93X2gqMS43NV0sICdUeXBlJywgJ3RhYmxlJywgJ3RleHQnKTtcclxuXHJcbiAgICB4ID0gbG9jLndpcmVfdGFibGUueCAtIHcvMjtcclxuICAgIHkgPSBsb2Mud2lyZV90YWJsZS55IC0gaC8yO1xyXG5cclxuICAgIHggKz0gY29sdW1uX3dpZHRoLm51bWJlci8yO1xyXG4gICAgeSArPSByb3dfaCoyICsgcm93X2gqMC43NTtcclxuXHJcbiAgICBmb3IoIHZhciByPTE7IHI8PXN5c3RlbS53aXJlX2NvbmZpZ19udW07IHIrKyApIHtcclxuICAgICAgICB0ZXh0KCBbeCx5XSwgU3RyaW5nKHIpLCAndGFibGUnLCAndGV4dCcpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHkgKz0gcm93X2g7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRGlzcGxheVxyXG5cclxuLy8jc3ZnXHJcbnZhciBkaXNwbGF5X3N2ZyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAvL2xvZygnZGlzcGxheWluZyBzdmcnKTtcclxuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzdmdfY29udGFpbmVyX2lkKTtcclxuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcclxuICAgIC8vY29udGFpbmVyLmVtcHR5KClcclxuXHJcbiAgICAvL3ZhciBzdmdfZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdTdmdqc1N2ZzEwMDAnKVxyXG4gICAgdmFyIHN2Z19lbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3N2ZycpO1xyXG4gICAgc3ZnX2VsZW0uc2V0QXR0cmlidXRlKCdpZCcsJ3N2Z19kcmF3aW5nJyk7XHJcbiAgICBzdmdfZWxlbS5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgc2l6ZS5kcmF3aW5nLncpO1xyXG4gICAgc3ZnX2VsZW0uc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBzaXplLmRyYXdpbmcuaCk7XHJcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc3ZnX2VsZW0pO1xyXG4gICAgdmFyIHN2ZyA9IFNWRyhzdmdfZWxlbSkuc2l6ZShzaXplLmRyYXdpbmcudywgc2l6ZS5kcmF3aW5nLmgpO1xyXG5cclxuICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgdGhlIGRyYXdpbmcgY29udGVudHMsIGNhbGwgdGhlIGZ1bmN0aW9uIGJlbG93LlxyXG4gICAgZWxlbWVudHMuZm9yRWFjaCggZnVuY3Rpb24oZWxlbSxpZCkge1xyXG4gICAgICAgIHNob3dfZWxlbV9hcnJheShlbGVtKTtcclxuICAgIH0pXHJcblxyXG4gICAgZnVuY3Rpb24gc2hvd19lbGVtX2FycmF5KGVsZW0sIG9mZnNldCl7XHJcbiAgICAgICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IHt4OjAseTowfTtcclxuICAgICAgICBpZiggdHlwZW9mIGVsZW0ueCAhPT0gJ3VuZGVmaW5lZCcgKSB7IHZhciB4ID0gZWxlbS54ICsgb2Zmc2V0Lng7IH0gXHJcbiAgICAgICAgaWYoIHR5cGVvZiBlbGVtLnkgIT09ICd1bmRlZmluZWQnICkgeyB2YXIgeSA9IGVsZW0ueSArIG9mZnNldC55OyB9IFxyXG5cclxuICAgICAgICBpZiggZWxlbS50eXBlID09PSAncmVjdCcpIHtcclxuICAgICAgICAgICAgc3ZnLnJlY3QoIGVsZW0udywgZWxlbS5oICkubW92ZSggeC1lbGVtLncvMiwgeS1lbGVtLmgvMiApLmF0dHIoIGxfYXR0cltlbGVtLmxheWVyX25hbWVdICk7XHJcbiAgICAgICAgfSBlbHNlIGlmKCBlbGVtLnR5cGUgPT09ICdsaW5lJykge1xyXG4gICAgICAgICAgICB2YXIgcG9pbnRzMiA9IFtdO1xyXG4gICAgICAgICAgICBlbGVtLnBvaW50cy5mb3JFYWNoKCBmdW5jdGlvbihwb2ludCl7XHJcbiAgICAgICAgICAgICAgICBwb2ludHMyLnB1c2goWyBwb2ludFswXStvZmZzZXQueCwgcG9pbnRbMV0rb2Zmc2V0LnkgXSlcclxuICAgICAgICAgICAgfSkgIFxyXG4gICAgICAgICAgICBzdmcucG9seWxpbmUoIHBvaW50czIgKS5hdHRyKCBsX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApO1xyXG4gICAgICAgIH0gZWxzZSBpZiggZWxlbS50eXBlID09PSAndGV4dCcpIHtcclxuICAgICAgICAgICAgLy92YXIgdCA9IHN2Zy50ZXh0KCBlbGVtLnN0cmluZ3MgKS5tb3ZlKCBlbGVtLnBvaW50c1swXVswXSwgZWxlbS5wb2ludHNbMF1bMV0gKS5hdHRyKCBsX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApXHJcbiAgICAgICAgICAgIHZhciBmb250ID0gZm9udHNbZWxlbS5mb250XTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3RleHQnKTtcclxuICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoJ3gnLCB4KTtcclxuICAgICAgICAgICAgLy90LnNldEF0dHJpYnV0ZSgneScsIHkgKyBmb250Wydmb250LXNpemUnXS8yICk7XHJcbiAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCd5JywgeSApO1xyXG4gICAgICAgICAgICBpZihlbGVtLnJvdGF0ZWQpe1xyXG4gICAgICAgICAgICAgICAgLy90LnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywgXCJyb3RhdGUoXCIgKyBlbGVtLnJvdGF0ZWQgKyBcIiBcIiArIHggKyBcIiBcIiArIHkgKyBcIilcIiApO1xyXG4gICAgICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsIFwicm90YXRlKFwiICsgZWxlbS5yb3RhdGVkICsgXCIgXCIgKyB4ICsgXCIgXCIgKyB5ICsgXCIpXCIgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IoIHZhciBpMiBpbiBsX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApe1xyXG4gICAgICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoIGkyLCBsX2F0dHJbZWxlbS5sYXllcl9uYW1lXVtpMl0gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IoIHZhciBpMiBpbiBmb250ICl7XHJcbiAgICAgICAgICAgICAgICB0LnNldEF0dHJpYnV0ZSggaTIsIGZvbnRbaTJdICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yKCB2YXIgaTIgaW4gZWxlbS5zdHJpbmdzICl7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAndHNwYW4nKTtcclxuICAgICAgICAgICAgICAgIHRzcGFuLnNldEF0dHJpYnV0ZSgnZHknLCBmb250Wydmb250LXNpemUnXSoxLjUqaTIgKTtcclxuICAgICAgICAgICAgICAgIHRzcGFuLnNldEF0dHJpYnV0ZSgneCcsIHgpO1xyXG4gICAgICAgICAgICAgICAgdHNwYW4uaW5uZXJIVE1MID0gZWxlbS5zdHJpbmdzW2kyXTtcclxuICAgICAgICAgICAgICAgIHQuYXBwZW5kQ2hpbGQodHNwYW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN2Z19lbGVtLmFwcGVuZENoaWxkKHQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiggZWxlbS50eXBlID09PSAnY2lyYycpIHtcclxuICAgICAgICAgICAgdmFyIGMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAnZWxsaXBzZScpO1xyXG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZSgncngnLCBlbGVtLmQvMik7XHJcbiAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKCdyeScsIGVsZW0uZC8yKTtcclxuICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoJ2N4JywgeCk7XHJcbiAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKCdjeScsIHkpO1xyXG4gICAgICAgICAgICB2YXIgYXR0ciA9IGxfYXR0cltlbGVtLmxheWVyX25hbWVdO1xyXG4gICAgICAgICAgICBmb3IoIHZhciBpMiBpbiBhdHRyICl7XHJcbiAgICAgICAgICAgICAgICBjLnNldEF0dHJpYnV0ZShpMiwgYXR0cltpMl0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN2Z19lbGVtLmFwcGVuZENoaWxkKGMpO1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBjLmF0dHJpYnV0ZXMoIGxfYXR0cltlbGVtLmxheWVyX25hbWVdIClcclxuICAgICAgICAgICAgYy5hdHRyaWJ1dGVzKHtcclxuICAgICAgICAgICAgICAgIHJ4OiA1LFxyXG4gICAgICAgICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgICAgIHJ5OiA1LFxyXG4gICAgICAgICAgICAgICAgY3g6IGVsZW0ucG9pbnRzWzBdWzBdLWVsZW0uZC8yLFxyXG4gICAgICAgICAgICAgICAgY3k6IGVsZW0ucG9pbnRzWzBdWzFdLWVsZW0uZC8yXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHZhciBjMiA9IHN2Zy5lbGxpcHNlKCBlbGVtLnIsIGVsZW0uciApXHJcbiAgICAgICAgICAgIGMyLm1vdmUoIGVsZW0ucG9pbnRzWzBdWzBdLWVsZW0uZC8yLCBlbGVtLnBvaW50c1swXVsxXS1lbGVtLmQvMiApXHJcbiAgICAgICAgICAgIGMyLmF0dHIoe3J4OjUsIHJ5OjV9KVxyXG4gICAgICAgICAgICBjMi5hdHRyKCBsX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApXHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgfSBlbHNlIGlmKGVsZW0udHlwZSA9PT0gJ2Jsb2NrJykge1xyXG4gICAgICAgICAgICAvLyBpZiBpdCBpcyBhIGJsb2NrLCBydW4gdGhpcyBmdW5jdGlvbiB0aHJvdWdoIGVhY2ggZWxlbWVudC5cclxuICAgICAgICAgICAgZWxlbS5lbGVtZW50cy5mb3JFYWNoKCBmdW5jdGlvbihibG9ja19lbGVtLGlkKXtcclxuICAgICAgICAgICAgICAgIHNob3dfZWxlbV9hcnJheShibG9ja19lbGVtLCB7eDp4LCB5Onl9KSBcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gYWZ0ZXIgcGFnZSBsb2FkcyBmdW5jdGlvbnNcclxuXHJcblxyXG52YXIgdXBkYXRlX3NldHRpbmdzX3JlZ2lzdHJ5ID0gZnVuY3Rpb24oKSB7XHJcbn1cclxuXHJcblxyXG4vLyN1cGRhdGUgZHJhd2luZ1xyXG5mdW5jdGlvbiB1cGRhdGUoKXtcclxuICAgIGxvZygndXBkYXRpbmcnKTtcclxuXHJcbiAgICAvLyBNYWtlIHN1cmUgc2VsZWN0b3JzIGFuZCB2YWx1ZSBkaXNwbGF5cyBhcmUgdXBkYXRlZFxyXG4gICAgc2V0dGluZ3NfcmVnaXN0cnkuZm9yRWFjaChmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICBpdGVtLnVwZGF0ZSgpOyBcclxuICAgIH0pXHJcblxyXG4gICAgLy8gZGVsZXRlIGFsbCBlbGVtZW50cyBvZiBkcmF3aW5nIFxyXG4gICAgY2xlYXJfZHJhd2luZygpO1xyXG5cclxuICAgIC8vIFJlY2FsY3VsYXRlIHN5c3RlbSBzcGVjc1xyXG4gICAgdXBkYXRlX3N5c3RlbSgpO1xyXG4gICAgXHJcbiAgICAvLyBSZWNhbGN1bGF0ZSBkcmF3aW5nIHJlbGF0ZWQgdmFyaWFibGVzXHJcbiAgICB1cGRhdGVfdmFsdWVzKCk7XHJcblxyXG4gICAgLy8gR2VuZXJhdGUgbmV3IGRyYXdpbmcgZWxlbWVudHNcclxuICAgIG1rX2RyYXdpbmcoKTtcclxuXHJcbiAgICAvLyBBZGQgZHJhd2luZyBlbGVtZW50cyB0byBTVkcgb24gc2NyZWVuXHJcbiAgICBkaXNwbGF5X3N2ZygpO1xyXG5cclxufTtcclxuXHJcblxyXG5cclxudmFyIHN2Z19jb250YWluZXJfaWQgPSAnc3ZnX2NvbnRhaW5lcic7XHJcbnZhciBzeXN0ZW1fY29udGFpbmVyX2lkID0gJ3N5c3RlbV9jb250YWluZXInO1xyXG5cclxuXHJcblxyXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgdGl0bGUgPSAnUFYgZHJhd2luZyB0ZXN0JztcclxuXHJcbiAgICBrLnNldHVwX2JvZHkodGl0bGUpO1xyXG4gICAgdmFyIGRyYXdfcGFnZSA9ICQoJ2RpdicpLmF0dHIoJ2lkJywgJ2RyYXdpbmdfcGFnZScpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChkcmF3X3BhZ2UuZWxlbSk7XHJcblxyXG4gICAgdmFyIHN5c3RlbV9jb250YWluZXIgPSAkKCdkaXYnKS5hdHRyKCdpZCcsIHN5c3RlbV9jb250YWluZXJfaWQpLmFwcGVuZFRvKGRyYXdfcGFnZSk7XHJcbiAgICBcclxuICAgIHZhciBzdmdfY29udGFpbmVyX29iamVjdCA9ICQoJ2RpdicpLmF0dHIoJ2lkJywgc3ZnX2NvbnRhaW5lcl9pZCkuYXBwZW5kVG8oZHJhd19wYWdlKTtcclxuICAgIHZhciBzdmdfY29udGFpbmVyID0gc3ZnX2NvbnRhaW5lcl9vYmplY3QuZWxlbVxyXG5cclxuLy9TeXN0ZW0gb3B0aW9uc1xyXG4gICAgLy8vKlxyXG4gICAgdmFyIHN5c3RlbV9jb250YWluZXJfYXJyYXkgPSBbXHJcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJ0lQIGxvY2F0aW9uIHwnKSxcclxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnQ2l0eTogJyksXHJcbiAgICAgICAgJCgndmFsdWUnKS5zZXRSZWYoJ3NldHRpbmdzLmNpdHknKSxcclxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnIHwgJyksXHJcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJ0NvdW50eTogJyksXHJcbiAgICAgICAgJCgndmFsdWUnKS5zZXRSZWYoJ3NldHRpbmdzLmNvdW50eScpLFxyXG4gICAgICAgICQoJ2JyJyksXHJcbiAgICAgICAgLy8qL1xyXG5cclxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnTW9kdWxlIG1ha2U6ICcpLFxyXG4gICAgICAgICQoJ3NlbGVjdG9yJykuc2V0X29wdGlvbnMoICdrLm9ial9pZF9hcnJheShjb21wb25lbnRzLm1vZHVsZXMpJyApLnNldF9zZXR0aW5nKCdwdl9tYWtlJyksXHJcbiAgICAgICAgXHJcbiAgICAgICAgJCgnYnInKSxcclxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnTW9kdWxlIG1vZGVsOiAnKSxcclxuICAgICAgICAkKCdzZWxlY3RvcicpLnNldF9vcHRpb25zKCAnay5vYmpfaWRfYXJyYXkoY29tcG9uZW50cy5tb2R1bGVzW3NldHRpbmdzLnB2X21ha2VdKScgKS5zZXRfc2V0dGluZygncHZfbW9kZWwnKSxcclxuXHJcbiAgICAgICAgJCgnYnInKSxcclxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnUG1heDogJyksXHJcbiAgICAgICAgJCgndmFsdWUnKS5zZXRSZWYoJ3N5c3RlbS5EQy5tb2R1bGUuc3BlY3MuUG1heCcpLFxyXG5cclxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnIHwgJyksXHJcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJ0lzYzogJyksXHJcbiAgICAgICAgJCgndmFsdWUnKS5zZXRSZWYoJ3N5c3RlbS5EQy5tb2R1bGUuc3BlY3MuSXNjJyksXHJcblxyXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCcgfCAnKSxcclxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnVm9jOiAnKSxcclxuICAgICAgICAkKCd2YWx1ZScpLnNldFJlZignc3lzdGVtLkRDLm1vZHVsZS5zcGVjcy5Wb2MnKSxcclxuXHJcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJyB8ICcpLFxyXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCdJbXA6ICcpLFxyXG4gICAgICAgICQoJ3ZhbHVlJykuc2V0UmVmKCdzeXN0ZW0uREMubW9kdWxlLnNwZWNzLkltcCcpLFxyXG4gICAgICAgIFxyXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCcgfCAnKSxcclxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnVm1wOiAnKSxcclxuICAgICAgICAkKCd2YWx1ZScpLnNldFJlZignc3lzdGVtLkRDLm1vZHVsZS5zcGVjcy5WbXAnKSxcclxuXHJcbiAgICAgICAgJCgnYnInKSxcclxuXHJcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJ051bWJlciBvZiBzdHJpbmdzOiAnKSxcclxuICAgICAgICAkKCdzZWxlY3RvcicpLnNldF9vcHRpb25zKCAnc2V0dGluZ3Muc3RyaW5nX251bV9vcHRpb25zJykuc2V0X3NldHRpbmcoJ3N0cmluZ19udW0nKSxcclxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnIHwgJyksXHJcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJ051bWJlciBvZiBtb2R1bGVzIHBlciBzdHJpbmc6ICcpLFxyXG4gICAgICAgICQoJ3NlbGVjdG9yJykuc2V0X29wdGlvbnMoICdzZXR0aW5ncy5zdHJpbmdfbW9kdWxlc19vcHRpb25zJykuc2V0X3NldHRpbmcoJ3N0cmluZ19tb2R1bGVzJyksXHJcbiAgICAgICAgJCgnYnInKSxcclxuICAgICAgICBcclxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnQXJyYXkgdm9sdGFnZTogJyksXHJcbiAgICAgICAgJCgndmFsdWUnKS5zZXRSZWYoJ3N5c3RlbS5EQy52b2x0YWdlJykuc2V0TWF4KDYwMCkuYXR0cignaWQnLCAnRENfdm9sdCcpLFxyXG4gICAgICAgIC8vJCgndmFsdWUnKS5zZXRSZWYoJ3N5c3RlbS5EQy52b2x0YWdlJyksXHJcblxyXG4gICAgICAgICQoJ3NwYW4nKS5odG1sKCcgfCAnKSxcclxuXHJcbiAgICAgICAgJCgnc3BhbicpLmh0bWwoJ0FycmF5IGN1cnJlbnQ6ICcpLFxyXG4gICAgICAgICQoJ3ZhbHVlJykuc2V0UmVmKCdzeXN0ZW0uREMuY3VycmVudCcpLFxyXG5cclxuICAgICAgICAkKCdicicpLFxyXG5cclxuICAgICAgICAkKCdzcGFuJykuaHRtbCgnQUMgdHlwZTogJyksXHJcblxyXG4gICAgICAgICQoJ3NlbGVjdG9yJykuc2V0X29wdGlvbnMoICdzZXR0aW5ncy5BQ190eXBlX29wdGlvbnMnKS5zZXRfc2V0dGluZygnQUNfdHlwZScpLFxyXG5cclxuICAgICAgICAkKCdicicpLFxyXG5cclxuICAgIF0uZm9yRWFjaCggZnVuY3Rpb24oZWxlbSl7XHJcbiAgICAgICAgZWxlbS5hcHBlbmRUbyhzeXN0ZW1fY29udGFpbmVyKTtcclxuICAgICAgICBpZiggZWxlbS50eXBlID09PSAnc2VsZWN0b3InICl7XHJcbiAgICAgICAgICAgIGVsZW0uc2V0VXBkYXRlKHVwZGF0ZSk7XHJcbiAgICAgICAgICAgIGVsZW0udXBkYXRlKCk7IFxyXG4gICAgICAgIH0gZWxzZSBpZiggZWxlbS50eXBlID09PSAndmFsdWUnICl7XHJcbiAgICAgICAgICAgIGVsZW0uc2V0VXBkYXRlKHVwZGF0ZV9zeXN0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHVwZGF0ZSgpO1xyXG5cclxuICAgIHZhciBib290X3RpbWUgPSBtb21lbnQoKTtcclxuICAgIHZhciBzdGF0dXNfaWQgPSBcInN0YXR1c1wiO1xyXG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXsgay51cGRhdGVfc3RhdHVzX3BhZ2Uoc3RhdHVzX2lkLCBib290X3RpbWUpO30sMTAwMCk7XHJcblxyXG5cclxuXHJcblxyXG4gICAgbG9nKHdpbmRvdyk7XHJcblxyXG5cclxufVxyXG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vLyEgbW9tZW50LmpzXG4vLyEgdmVyc2lvbiA6IDIuNy4wXG4vLyEgYXV0aG9ycyA6IFRpbSBXb29kLCBJc2tyZW4gQ2hlcm5ldiwgTW9tZW50LmpzIGNvbnRyaWJ1dG9yc1xuLy8hIGxpY2Vuc2UgOiBNSVRcbi8vISBtb21lbnRqcy5jb21cblxuKGZ1bmN0aW9uICh1bmRlZmluZWQpIHtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgQ29uc3RhbnRzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgdmFyIG1vbWVudCxcbiAgICAgICAgVkVSU0lPTiA9IFwiMi43LjBcIixcbiAgICAgICAgLy8gdGhlIGdsb2JhbC1zY29wZSB0aGlzIGlzIE5PVCB0aGUgZ2xvYmFsIG9iamVjdCBpbiBOb2RlLmpzXG4gICAgICAgIGdsb2JhbFNjb3BlID0gdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB0aGlzLFxuICAgICAgICBvbGRHbG9iYWxNb21lbnQsXG4gICAgICAgIHJvdW5kID0gTWF0aC5yb3VuZCxcbiAgICAgICAgaSxcblxuICAgICAgICBZRUFSID0gMCxcbiAgICAgICAgTU9OVEggPSAxLFxuICAgICAgICBEQVRFID0gMixcbiAgICAgICAgSE9VUiA9IDMsXG4gICAgICAgIE1JTlVURSA9IDQsXG4gICAgICAgIFNFQ09ORCA9IDUsXG4gICAgICAgIE1JTExJU0VDT05EID0gNixcblxuICAgICAgICAvLyBpbnRlcm5hbCBzdG9yYWdlIGZvciBsYW5ndWFnZSBjb25maWcgZmlsZXNcbiAgICAgICAgbGFuZ3VhZ2VzID0ge30sXG5cbiAgICAgICAgLy8gbW9tZW50IGludGVybmFsIHByb3BlcnRpZXNcbiAgICAgICAgbW9tZW50UHJvcGVydGllcyA9IHtcbiAgICAgICAgICAgIF9pc0FNb21lbnRPYmplY3Q6IG51bGwsXG4gICAgICAgICAgICBfaSA6IG51bGwsXG4gICAgICAgICAgICBfZiA6IG51bGwsXG4gICAgICAgICAgICBfbCA6IG51bGwsXG4gICAgICAgICAgICBfc3RyaWN0IDogbnVsbCxcbiAgICAgICAgICAgIF90em0gOiBudWxsLFxuICAgICAgICAgICAgX2lzVVRDIDogbnVsbCxcbiAgICAgICAgICAgIF9vZmZzZXQgOiBudWxsLCAgLy8gb3B0aW9uYWwuIENvbWJpbmUgd2l0aCBfaXNVVENcbiAgICAgICAgICAgIF9wZiA6IG51bGwsXG4gICAgICAgICAgICBfbGFuZyA6IG51bGwgIC8vIG9wdGlvbmFsXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gY2hlY2sgZm9yIG5vZGVKU1xuICAgICAgICBoYXNNb2R1bGUgPSAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpLFxuXG4gICAgICAgIC8vIEFTUC5ORVQganNvbiBkYXRlIGZvcm1hdCByZWdleFxuICAgICAgICBhc3BOZXRKc29uUmVnZXggPSAvXlxcLz9EYXRlXFwoKFxcLT9cXGQrKS9pLFxuICAgICAgICBhc3BOZXRUaW1lU3Bhbkpzb25SZWdleCA9IC8oXFwtKT8oPzooXFxkKilcXC4pPyhcXGQrKVxcOihcXGQrKSg/OlxcOihcXGQrKVxcLj8oXFxkezN9KT8pPy8sXG5cbiAgICAgICAgLy8gZnJvbSBodHRwOi8vZG9jcy5jbG9zdXJlLWxpYnJhcnkuZ29vZ2xlY29kZS5jb20vZ2l0L2Nsb3N1cmVfZ29vZ19kYXRlX2RhdGUuanMuc291cmNlLmh0bWxcbiAgICAgICAgLy8gc29tZXdoYXQgbW9yZSBpbiBsaW5lIHdpdGggNC40LjMuMiAyMDA0IHNwZWMsIGJ1dCBhbGxvd3MgZGVjaW1hbCBhbnl3aGVyZVxuICAgICAgICBpc29EdXJhdGlvblJlZ2V4ID0gL14oLSk/UCg/Oig/OihbMC05LC5dKilZKT8oPzooWzAtOSwuXSopTSk/KD86KFswLTksLl0qKUQpPyg/OlQoPzooWzAtOSwuXSopSCk/KD86KFswLTksLl0qKU0pPyg/OihbMC05LC5dKilTKT8pP3woWzAtOSwuXSopVykkLyxcblxuICAgICAgICAvLyBmb3JtYXQgdG9rZW5zXG4gICAgICAgIGZvcm1hdHRpbmdUb2tlbnMgPSAvKFxcW1teXFxbXSpcXF0pfChcXFxcKT8oTW98TU0/TT9NP3xEb3xERERvfEREP0Q/RD98ZGRkP2Q/fGRvP3x3W298d10/fFdbb3xXXT98UXxZWVlZWVl8WVlZWVl8WVlZWXxZWXxnZyhnZ2c/KT98R0coR0dHPyk/fGV8RXxhfEF8aGg/fEhIP3xtbT98c3M/fFN7MSw0fXxYfHp6P3xaWj98LikvZyxcbiAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zID0gLyhcXFtbXlxcW10qXFxdKXwoXFxcXCk/KExUfExMP0w/TD98bHsxLDR9KS9nLFxuXG4gICAgICAgIC8vIHBhcnNpbmcgdG9rZW4gcmVnZXhlc1xuICAgICAgICBwYXJzZVRva2VuT25lT3JUd29EaWdpdHMgPSAvXFxkXFxkPy8sIC8vIDAgLSA5OVxuICAgICAgICBwYXJzZVRva2VuT25lVG9UaHJlZURpZ2l0cyA9IC9cXGR7MSwzfS8sIC8vIDAgLSA5OTlcbiAgICAgICAgcGFyc2VUb2tlbk9uZVRvRm91ckRpZ2l0cyA9IC9cXGR7MSw0fS8sIC8vIDAgLSA5OTk5XG4gICAgICAgIHBhcnNlVG9rZW5PbmVUb1NpeERpZ2l0cyA9IC9bK1xcLV0/XFxkezEsNn0vLCAvLyAtOTk5LDk5OSAtIDk5OSw5OTlcbiAgICAgICAgcGFyc2VUb2tlbkRpZ2l0cyA9IC9cXGQrLywgLy8gbm9uemVybyBudW1iZXIgb2YgZGlnaXRzXG4gICAgICAgIHBhcnNlVG9rZW5Xb3JkID0gL1swLTldKlsnYS16XFx1MDBBMC1cXHUwNUZGXFx1MDcwMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSt8W1xcdTA2MDAtXFx1MDZGRlxcL10rKFxccyo/W1xcdTA2MDAtXFx1MDZGRl0rKXsxLDJ9L2ksIC8vIGFueSB3b3JkIChvciB0d28pIGNoYXJhY3RlcnMgb3IgbnVtYmVycyBpbmNsdWRpbmcgdHdvL3RocmVlIHdvcmQgbW9udGggaW4gYXJhYmljLlxuICAgICAgICBwYXJzZVRva2VuVGltZXpvbmUgPSAvWnxbXFwrXFwtXVxcZFxcZDo/XFxkXFxkL2dpLCAvLyArMDA6MDAgLTAwOjAwICswMDAwIC0wMDAwIG9yIFpcbiAgICAgICAgcGFyc2VUb2tlblQgPSAvVC9pLCAvLyBUIChJU08gc2VwYXJhdG9yKVxuICAgICAgICBwYXJzZVRva2VuVGltZXN0YW1wTXMgPSAvW1xcK1xcLV0/XFxkKyhcXC5cXGR7MSwzfSk/LywgLy8gMTIzNDU2Nzg5IDEyMzQ1Njc4OS4xMjNcbiAgICAgICAgcGFyc2VUb2tlbk9yZGluYWwgPSAvXFxkezEsMn0vLFxuXG4gICAgICAgIC8vc3RyaWN0IHBhcnNpbmcgcmVnZXhlc1xuICAgICAgICBwYXJzZVRva2VuT25lRGlnaXQgPSAvXFxkLywgLy8gMCAtIDlcbiAgICAgICAgcGFyc2VUb2tlblR3b0RpZ2l0cyA9IC9cXGRcXGQvLCAvLyAwMCAtIDk5XG4gICAgICAgIHBhcnNlVG9rZW5UaHJlZURpZ2l0cyA9IC9cXGR7M30vLCAvLyAwMDAgLSA5OTlcbiAgICAgICAgcGFyc2VUb2tlbkZvdXJEaWdpdHMgPSAvXFxkezR9LywgLy8gMDAwMCAtIDk5OTlcbiAgICAgICAgcGFyc2VUb2tlblNpeERpZ2l0cyA9IC9bKy1dP1xcZHs2fS8sIC8vIC05OTksOTk5IC0gOTk5LDk5OVxuICAgICAgICBwYXJzZVRva2VuU2lnbmVkTnVtYmVyID0gL1srLV0/XFxkKy8sIC8vIC1pbmYgLSBpbmZcblxuICAgICAgICAvLyBpc28gODYwMSByZWdleFxuICAgICAgICAvLyAwMDAwLTAwLTAwIDAwMDAtVzAwIG9yIDAwMDAtVzAwLTAgKyBUICsgMDAgb3IgMDA6MDAgb3IgMDA6MDA6MDAgb3IgMDA6MDA6MDAuMDAwICsgKzAwOjAwIG9yICswMDAwIG9yICswMClcbiAgICAgICAgaXNvUmVnZXggPSAvXlxccyooPzpbKy1dXFxkezZ9fFxcZHs0fSktKD86KFxcZFxcZC1cXGRcXGQpfChXXFxkXFxkJCl8KFdcXGRcXGQtXFxkKXwoXFxkXFxkXFxkKSkoKFR8ICkoXFxkXFxkKDpcXGRcXGQoOlxcZFxcZChcXC5cXGQrKT8pPyk/KT8oW1xcK1xcLV1cXGRcXGQoPzo6P1xcZFxcZCk/fFxccypaKT8pPyQvLFxuXG4gICAgICAgIGlzb0Zvcm1hdCA9ICdZWVlZLU1NLUREVEhIOm1tOnNzWicsXG5cbiAgICAgICAgaXNvRGF0ZXMgPSBbXG4gICAgICAgICAgICBbJ1lZWVlZWS1NTS1ERCcsIC9bKy1dXFxkezZ9LVxcZHsyfS1cXGR7Mn0vXSxcbiAgICAgICAgICAgIFsnWVlZWS1NTS1ERCcsIC9cXGR7NH0tXFxkezJ9LVxcZHsyfS9dLFxuICAgICAgICAgICAgWydHR0dHLVtXXVdXLUUnLCAvXFxkezR9LVdcXGR7Mn0tXFxkL10sXG4gICAgICAgICAgICBbJ0dHR0ctW1ddV1cnLCAvXFxkezR9LVdcXGR7Mn0vXSxcbiAgICAgICAgICAgIFsnWVlZWS1EREQnLCAvXFxkezR9LVxcZHszfS9dXG4gICAgICAgIF0sXG5cbiAgICAgICAgLy8gaXNvIHRpbWUgZm9ybWF0cyBhbmQgcmVnZXhlc1xuICAgICAgICBpc29UaW1lcyA9IFtcbiAgICAgICAgICAgIFsnSEg6bW06c3MuU1NTUycsIC8oVHwgKVxcZFxcZDpcXGRcXGQ6XFxkXFxkXFwuXFxkKy9dLFxuICAgICAgICAgICAgWydISDptbTpzcycsIC8oVHwgKVxcZFxcZDpcXGRcXGQ6XFxkXFxkL10sXG4gICAgICAgICAgICBbJ0hIOm1tJywgLyhUfCApXFxkXFxkOlxcZFxcZC9dLFxuICAgICAgICAgICAgWydISCcsIC8oVHwgKVxcZFxcZC9dXG4gICAgICAgIF0sXG5cbiAgICAgICAgLy8gdGltZXpvbmUgY2h1bmtlciBcIisxMDowMFwiID4gW1wiMTBcIiwgXCIwMFwiXSBvciBcIi0xNTMwXCIgPiBbXCItMTVcIiwgXCIzMFwiXVxuICAgICAgICBwYXJzZVRpbWV6b25lQ2h1bmtlciA9IC8oW1xcK1xcLV18XFxkXFxkKS9naSxcblxuICAgICAgICAvLyBnZXR0ZXIgYW5kIHNldHRlciBuYW1lc1xuICAgICAgICBwcm94eUdldHRlcnNBbmRTZXR0ZXJzID0gJ0RhdGV8SG91cnN8TWludXRlc3xTZWNvbmRzfE1pbGxpc2Vjb25kcycuc3BsaXQoJ3wnKSxcbiAgICAgICAgdW5pdE1pbGxpc2Vjb25kRmFjdG9ycyA9IHtcbiAgICAgICAgICAgICdNaWxsaXNlY29uZHMnIDogMSxcbiAgICAgICAgICAgICdTZWNvbmRzJyA6IDFlMyxcbiAgICAgICAgICAgICdNaW51dGVzJyA6IDZlNCxcbiAgICAgICAgICAgICdIb3VycycgOiAzNmU1LFxuICAgICAgICAgICAgJ0RheXMnIDogODY0ZTUsXG4gICAgICAgICAgICAnTW9udGhzJyA6IDI1OTJlNixcbiAgICAgICAgICAgICdZZWFycycgOiAzMTUzNmU2XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW5pdEFsaWFzZXMgPSB7XG4gICAgICAgICAgICBtcyA6ICdtaWxsaXNlY29uZCcsXG4gICAgICAgICAgICBzIDogJ3NlY29uZCcsXG4gICAgICAgICAgICBtIDogJ21pbnV0ZScsXG4gICAgICAgICAgICBoIDogJ2hvdXInLFxuICAgICAgICAgICAgZCA6ICdkYXknLFxuICAgICAgICAgICAgRCA6ICdkYXRlJyxcbiAgICAgICAgICAgIHcgOiAnd2VlaycsXG4gICAgICAgICAgICBXIDogJ2lzb1dlZWsnLFxuICAgICAgICAgICAgTSA6ICdtb250aCcsXG4gICAgICAgICAgICBRIDogJ3F1YXJ0ZXInLFxuICAgICAgICAgICAgeSA6ICd5ZWFyJyxcbiAgICAgICAgICAgIERERCA6ICdkYXlPZlllYXInLFxuICAgICAgICAgICAgZSA6ICd3ZWVrZGF5JyxcbiAgICAgICAgICAgIEUgOiAnaXNvV2Vla2RheScsXG4gICAgICAgICAgICBnZzogJ3dlZWtZZWFyJyxcbiAgICAgICAgICAgIEdHOiAnaXNvV2Vla1llYXInXG4gICAgICAgIH0sXG5cbiAgICAgICAgY2FtZWxGdW5jdGlvbnMgPSB7XG4gICAgICAgICAgICBkYXlvZnllYXIgOiAnZGF5T2ZZZWFyJyxcbiAgICAgICAgICAgIGlzb3dlZWtkYXkgOiAnaXNvV2Vla2RheScsXG4gICAgICAgICAgICBpc293ZWVrIDogJ2lzb1dlZWsnLFxuICAgICAgICAgICAgd2Vla3llYXIgOiAnd2Vla1llYXInLFxuICAgICAgICAgICAgaXNvd2Vla3llYXIgOiAnaXNvV2Vla1llYXInXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gZm9ybWF0IGZ1bmN0aW9uIHN0cmluZ3NcbiAgICAgICAgZm9ybWF0RnVuY3Rpb25zID0ge30sXG5cbiAgICAgICAgLy8gZGVmYXVsdCByZWxhdGl2ZSB0aW1lIHRocmVzaG9sZHNcbiAgICAgICAgcmVsYXRpdmVUaW1lVGhyZXNob2xkcyA9IHtcbiAgICAgICAgICBzOiA0NSwgICAvL3NlY29uZHMgdG8gbWludXRlc1xuICAgICAgICAgIG06IDQ1LCAgIC8vbWludXRlcyB0byBob3Vyc1xuICAgICAgICAgIGg6IDIyLCAgIC8vaG91cnMgdG8gZGF5c1xuICAgICAgICAgIGRkOiAyNSwgIC8vZGF5cyB0byBtb250aCAobW9udGggPT0gMSlcbiAgICAgICAgICBkbTogNDUsICAvL2RheXMgdG8gbW9udGhzIChtb250aHMgPiAxKVxuICAgICAgICAgIGR5OiAzNDUgIC8vZGF5cyB0byB5ZWFyXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gdG9rZW5zIHRvIG9yZGluYWxpemUgYW5kIHBhZFxuICAgICAgICBvcmRpbmFsaXplVG9rZW5zID0gJ0RERCB3IFcgTSBEIGQnLnNwbGl0KCcgJyksXG4gICAgICAgIHBhZGRlZFRva2VucyA9ICdNIEQgSCBoIG0gcyB3IFcnLnNwbGl0KCcgJyksXG5cbiAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnMgPSB7XG4gICAgICAgICAgICBNICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1vbnRoKCkgKyAxO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE1NTSAgOiBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZygpLm1vbnRoc1Nob3J0KHRoaXMsIGZvcm1hdCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgTU1NTSA6IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nKCkubW9udGhzKHRoaXMsIGZvcm1hdCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRCAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgREREICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXlPZlllYXIoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRheSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRkICAgOiBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZygpLndlZWtkYXlzTWluKHRoaXMsIGZvcm1hdCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGRkICA6IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nKCkud2Vla2RheXNTaG9ydCh0aGlzLCBmb3JtYXQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRkZGQgOiBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZygpLndlZWtkYXlzKHRoaXMsIGZvcm1hdCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdyAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy53ZWVrKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgVyAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pc29XZWVrKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgWVkgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMueWVhcigpICUgMTAwLCAyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBZWVlZIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy55ZWFyKCksIDQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFlZWVlZIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy55ZWFyKCksIDUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFlZWVlZWSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgeSA9IHRoaXMueWVhcigpLCBzaWduID0geSA+PSAwID8gJysnIDogJy0nO1xuICAgICAgICAgICAgICAgIHJldHVybiBzaWduICsgbGVmdFplcm9GaWxsKE1hdGguYWJzKHkpLCA2KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZyAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy53ZWVrWWVhcigpICUgMTAwLCAyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZ2dnIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy53ZWVrWWVhcigpLCA0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZ2dnZyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMud2Vla1llYXIoKSwgNSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgR0cgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMuaXNvV2Vla1llYXIoKSAlIDEwMCwgMik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgR0dHRyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMuaXNvV2Vla1llYXIoKSwgNCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgR0dHR0cgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLmlzb1dlZWtZZWFyKCksIDUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMud2Vla2RheSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNvV2Vla2RheSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGEgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZygpLm1lcmlkaWVtKHRoaXMuaG91cnMoKSwgdGhpcy5taW51dGVzKCksIHRydWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEEgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZygpLm1lcmlkaWVtKHRoaXMuaG91cnMoKSwgdGhpcy5taW51dGVzKCksIGZhbHNlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBIICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhvdXJzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaCAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ob3VycygpICUgMTIgfHwgMTI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbSAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5taW51dGVzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcyAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZWNvbmRzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUyAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9JbnQodGhpcy5taWxsaXNlY29uZHMoKSAvIDEwMCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU1MgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRvSW50KHRoaXMubWlsbGlzZWNvbmRzKCkgLyAxMCksIDIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFNTUyAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLm1pbGxpc2Vjb25kcygpLCAzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTU1NTIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy5taWxsaXNlY29uZHMoKSwgMyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgWiAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYSA9IC10aGlzLnpvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgYiA9IFwiK1wiO1xuICAgICAgICAgICAgICAgIGlmIChhIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBhID0gLWE7XG4gICAgICAgICAgICAgICAgICAgIGIgPSBcIi1cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGIgKyBsZWZ0WmVyb0ZpbGwodG9JbnQoYSAvIDYwKSwgMikgKyBcIjpcIiArIGxlZnRaZXJvRmlsbCh0b0ludChhKSAlIDYwLCAyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBaWiAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhID0gLXRoaXMuem9uZSgpLFxuICAgICAgICAgICAgICAgICAgICBiID0gXCIrXCI7XG4gICAgICAgICAgICAgICAgaWYgKGEgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGEgPSAtYTtcbiAgICAgICAgICAgICAgICAgICAgYiA9IFwiLVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYiArIGxlZnRaZXJvRmlsbCh0b0ludChhIC8gNjApLCAyKSArIGxlZnRaZXJvRmlsbCh0b0ludChhKSAlIDYwLCAyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB6IDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnpvbmVBYmJyKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgenogOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuem9uZU5hbWUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBYICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnVuaXgoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBRIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnF1YXJ0ZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBsaXN0cyA9IFsnbW9udGhzJywgJ21vbnRoc1Nob3J0JywgJ3dlZWtkYXlzJywgJ3dlZWtkYXlzU2hvcnQnLCAnd2Vla2RheXNNaW4nXTtcblxuICAgIC8vIFBpY2sgdGhlIGZpcnN0IGRlZmluZWQgb2YgdHdvIG9yIHRocmVlIGFyZ3VtZW50cy4gZGZsIGNvbWVzIGZyb21cbiAgICAvLyBkZWZhdWx0LlxuICAgIGZ1bmN0aW9uIGRmbChhLCBiLCBjKSB7XG4gICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gYSAhPSBudWxsID8gYSA6IGI7XG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiBhICE9IG51bGwgPyBhIDogYiAhPSBudWxsID8gYiA6IGM7XG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoXCJJbXBsZW1lbnQgbWVcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZWZhdWx0UGFyc2luZ0ZsYWdzKCkge1xuICAgICAgICAvLyBXZSBuZWVkIHRvIGRlZXAgY2xvbmUgdGhpcyBvYmplY3QsIGFuZCBlczUgc3RhbmRhcmQgaXMgbm90IHZlcnlcbiAgICAgICAgLy8gaGVscGZ1bC5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVtcHR5IDogZmFsc2UsXG4gICAgICAgICAgICB1bnVzZWRUb2tlbnMgOiBbXSxcbiAgICAgICAgICAgIHVudXNlZElucHV0IDogW10sXG4gICAgICAgICAgICBvdmVyZmxvdyA6IC0yLFxuICAgICAgICAgICAgY2hhcnNMZWZ0T3ZlciA6IDAsXG4gICAgICAgICAgICBudWxsSW5wdXQgOiBmYWxzZSxcbiAgICAgICAgICAgIGludmFsaWRNb250aCA6IG51bGwsXG4gICAgICAgICAgICBpbnZhbGlkRm9ybWF0IDogZmFsc2UsXG4gICAgICAgICAgICB1c2VySW52YWxpZGF0ZWQgOiBmYWxzZSxcbiAgICAgICAgICAgIGlzbzogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXByZWNhdGUobXNnLCBmbikge1xuICAgICAgICB2YXIgZmlyc3RUaW1lID0gdHJ1ZTtcbiAgICAgICAgZnVuY3Rpb24gcHJpbnRNc2coKSB7XG4gICAgICAgICAgICBpZiAobW9tZW50LnN1cHByZXNzRGVwcmVjYXRpb25XYXJuaW5ncyA9PT0gZmFsc2UgJiZcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUud2Fybikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkRlcHJlY2F0aW9uIHdhcm5pbmc6IFwiICsgbXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXh0ZW5kKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChmaXJzdFRpbWUpIHtcbiAgICAgICAgICAgICAgICBwcmludE1zZygpO1xuICAgICAgICAgICAgICAgIGZpcnN0VGltZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0sIGZuKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYWRUb2tlbihmdW5jLCBjb3VudCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwoZnVuYy5jYWxsKHRoaXMsIGEpLCBjb3VudCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9yZGluYWxpemVUb2tlbihmdW5jLCBwZXJpb2QpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sYW5nKCkub3JkaW5hbChmdW5jLmNhbGwodGhpcywgYSksIHBlcmlvZCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgd2hpbGUgKG9yZGluYWxpemVUb2tlbnMubGVuZ3RoKSB7XG4gICAgICAgIGkgPSBvcmRpbmFsaXplVG9rZW5zLnBvcCgpO1xuICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1tpICsgJ28nXSA9IG9yZGluYWxpemVUb2tlbihmb3JtYXRUb2tlbkZ1bmN0aW9uc1tpXSwgaSk7XG4gICAgfVxuICAgIHdoaWxlIChwYWRkZWRUb2tlbnMubGVuZ3RoKSB7XG4gICAgICAgIGkgPSBwYWRkZWRUb2tlbnMucG9wKCk7XG4gICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW2kgKyBpXSA9IHBhZFRva2VuKGZvcm1hdFRva2VuRnVuY3Rpb25zW2ldLCAyKTtcbiAgICB9XG4gICAgZm9ybWF0VG9rZW5GdW5jdGlvbnMuRERERCA9IHBhZFRva2VuKGZvcm1hdFRva2VuRnVuY3Rpb25zLkRERCwgMyk7XG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgQ29uc3RydWN0b3JzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgZnVuY3Rpb24gTGFuZ3VhZ2UoKSB7XG5cbiAgICB9XG5cbiAgICAvLyBNb21lbnQgcHJvdG90eXBlIG9iamVjdFxuICAgIGZ1bmN0aW9uIE1vbWVudChjb25maWcpIHtcbiAgICAgICAgY2hlY2tPdmVyZmxvdyhjb25maWcpO1xuICAgICAgICBleHRlbmQodGhpcywgY29uZmlnKTtcbiAgICB9XG5cbiAgICAvLyBEdXJhdGlvbiBDb25zdHJ1Y3RvclxuICAgIGZ1bmN0aW9uIER1cmF0aW9uKGR1cmF0aW9uKSB7XG4gICAgICAgIHZhciBub3JtYWxpemVkSW5wdXQgPSBub3JtYWxpemVPYmplY3RVbml0cyhkdXJhdGlvbiksXG4gICAgICAgICAgICB5ZWFycyA9IG5vcm1hbGl6ZWRJbnB1dC55ZWFyIHx8IDAsXG4gICAgICAgICAgICBxdWFydGVycyA9IG5vcm1hbGl6ZWRJbnB1dC5xdWFydGVyIHx8IDAsXG4gICAgICAgICAgICBtb250aHMgPSBub3JtYWxpemVkSW5wdXQubW9udGggfHwgMCxcbiAgICAgICAgICAgIHdlZWtzID0gbm9ybWFsaXplZElucHV0LndlZWsgfHwgMCxcbiAgICAgICAgICAgIGRheXMgPSBub3JtYWxpemVkSW5wdXQuZGF5IHx8IDAsXG4gICAgICAgICAgICBob3VycyA9IG5vcm1hbGl6ZWRJbnB1dC5ob3VyIHx8IDAsXG4gICAgICAgICAgICBtaW51dGVzID0gbm9ybWFsaXplZElucHV0Lm1pbnV0ZSB8fCAwLFxuICAgICAgICAgICAgc2Vjb25kcyA9IG5vcm1hbGl6ZWRJbnB1dC5zZWNvbmQgfHwgMCxcbiAgICAgICAgICAgIG1pbGxpc2Vjb25kcyA9IG5vcm1hbGl6ZWRJbnB1dC5taWxsaXNlY29uZCB8fCAwO1xuXG4gICAgICAgIC8vIHJlcHJlc2VudGF0aW9uIGZvciBkYXRlQWRkUmVtb3ZlXG4gICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyA9ICttaWxsaXNlY29uZHMgK1xuICAgICAgICAgICAgc2Vjb25kcyAqIDFlMyArIC8vIDEwMDBcbiAgICAgICAgICAgIG1pbnV0ZXMgKiA2ZTQgKyAvLyAxMDAwICogNjBcbiAgICAgICAgICAgIGhvdXJzICogMzZlNTsgLy8gMTAwMCAqIDYwICogNjBcbiAgICAgICAgLy8gQmVjYXVzZSBvZiBkYXRlQWRkUmVtb3ZlIHRyZWF0cyAyNCBob3VycyBhcyBkaWZmZXJlbnQgZnJvbSBhXG4gICAgICAgIC8vIGRheSB3aGVuIHdvcmtpbmcgYXJvdW5kIERTVCwgd2UgbmVlZCB0byBzdG9yZSB0aGVtIHNlcGFyYXRlbHlcbiAgICAgICAgdGhpcy5fZGF5cyA9ICtkYXlzICtcbiAgICAgICAgICAgIHdlZWtzICogNztcbiAgICAgICAgLy8gSXQgaXMgaW1wb3NzaWJsZSB0cmFuc2xhdGUgbW9udGhzIGludG8gZGF5cyB3aXRob3V0IGtub3dpbmdcbiAgICAgICAgLy8gd2hpY2ggbW9udGhzIHlvdSBhcmUgYXJlIHRhbGtpbmcgYWJvdXQsIHNvIHdlIGhhdmUgdG8gc3RvcmVcbiAgICAgICAgLy8gaXQgc2VwYXJhdGVseS5cbiAgICAgICAgdGhpcy5fbW9udGhzID0gK21vbnRocyArXG4gICAgICAgICAgICBxdWFydGVycyAqIDMgK1xuICAgICAgICAgICAgeWVhcnMgKiAxMjtcblxuICAgICAgICB0aGlzLl9kYXRhID0ge307XG5cbiAgICAgICAgdGhpcy5fYnViYmxlKCk7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBIZWxwZXJzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICBmdW5jdGlvbiBleHRlbmQoYSwgYikge1xuICAgICAgICBmb3IgKHZhciBpIGluIGIpIHtcbiAgICAgICAgICAgIGlmIChiLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgYVtpXSA9IGJbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYi5oYXNPd25Qcm9wZXJ0eShcInRvU3RyaW5nXCIpKSB7XG4gICAgICAgICAgICBhLnRvU3RyaW5nID0gYi50b1N0cmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChiLmhhc093blByb3BlcnR5KFwidmFsdWVPZlwiKSkge1xuICAgICAgICAgICAgYS52YWx1ZU9mID0gYi52YWx1ZU9mO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xvbmVNb21lbnQobSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge30sIGk7XG4gICAgICAgIGZvciAoaSBpbiBtKSB7XG4gICAgICAgICAgICBpZiAobS5oYXNPd25Qcm9wZXJ0eShpKSAmJiBtb21lbnRQcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W2ldID0gbVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWJzUm91bmQobnVtYmVyKSB7XG4gICAgICAgIGlmIChudW1iZXIgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKG51bWJlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihudW1iZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gbGVmdCB6ZXJvIGZpbGwgYSBudW1iZXJcbiAgICAvLyBzZWUgaHR0cDovL2pzcGVyZi5jb20vbGVmdC16ZXJvLWZpbGxpbmcgZm9yIHBlcmZvcm1hbmNlIGNvbXBhcmlzb25cbiAgICBmdW5jdGlvbiBsZWZ0WmVyb0ZpbGwobnVtYmVyLCB0YXJnZXRMZW5ndGgsIGZvcmNlU2lnbikge1xuICAgICAgICB2YXIgb3V0cHV0ID0gJycgKyBNYXRoLmFicyhudW1iZXIpLFxuICAgICAgICAgICAgc2lnbiA9IG51bWJlciA+PSAwO1xuXG4gICAgICAgIHdoaWxlIChvdXRwdXQubGVuZ3RoIDwgdGFyZ2V0TGVuZ3RoKSB7XG4gICAgICAgICAgICBvdXRwdXQgPSAnMCcgKyBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChzaWduID8gKGZvcmNlU2lnbiA/ICcrJyA6ICcnKSA6ICctJykgKyBvdXRwdXQ7XG4gICAgfVxuXG4gICAgLy8gaGVscGVyIGZ1bmN0aW9uIGZvciBfLmFkZFRpbWUgYW5kIF8uc3VidHJhY3RUaW1lXG4gICAgZnVuY3Rpb24gYWRkT3JTdWJ0cmFjdER1cmF0aW9uRnJvbU1vbWVudChtb20sIGR1cmF0aW9uLCBpc0FkZGluZywgdXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSBkdXJhdGlvbi5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgZGF5cyA9IGR1cmF0aW9uLl9kYXlzLFxuICAgICAgICAgICAgbW9udGhzID0gZHVyYXRpb24uX21vbnRocztcbiAgICAgICAgdXBkYXRlT2Zmc2V0ID0gdXBkYXRlT2Zmc2V0ID09IG51bGwgPyB0cnVlIDogdXBkYXRlT2Zmc2V0O1xuXG4gICAgICAgIGlmIChtaWxsaXNlY29uZHMpIHtcbiAgICAgICAgICAgIG1vbS5fZC5zZXRUaW1lKCttb20uX2QgKyBtaWxsaXNlY29uZHMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRheXMpIHtcbiAgICAgICAgICAgIHJhd1NldHRlcihtb20sICdEYXRlJywgcmF3R2V0dGVyKG1vbSwgJ0RhdGUnKSArIGRheXMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vbnRocykge1xuICAgICAgICAgICAgcmF3TW9udGhTZXR0ZXIobW9tLCByYXdHZXR0ZXIobW9tLCAnTW9udGgnKSArIG1vbnRocyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgICAgICBtb21lbnQudXBkYXRlT2Zmc2V0KG1vbSwgZGF5cyB8fCBtb250aHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaWYgaXMgYW4gYXJyYXlcbiAgICBmdW5jdGlvbiBpc0FycmF5KGlucHV0KSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF0ZShpbnB1dCkge1xuICAgICAgICByZXR1cm4gIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IERhdGVdJyB8fFxuICAgICAgICAgICAgICAgIGlucHV0IGluc3RhbmNlb2YgRGF0ZTtcbiAgICB9XG5cbiAgICAvLyBjb21wYXJlIHR3byBhcnJheXMsIHJldHVybiB0aGUgbnVtYmVyIG9mIGRpZmZlcmVuY2VzXG4gICAgZnVuY3Rpb24gY29tcGFyZUFycmF5cyhhcnJheTEsIGFycmF5MiwgZG9udENvbnZlcnQpIHtcbiAgICAgICAgdmFyIGxlbiA9IE1hdGgubWluKGFycmF5MS5sZW5ndGgsIGFycmF5Mi5sZW5ndGgpLFxuICAgICAgICAgICAgbGVuZ3RoRGlmZiA9IE1hdGguYWJzKGFycmF5MS5sZW5ndGggLSBhcnJheTIubGVuZ3RoKSxcbiAgICAgICAgICAgIGRpZmZzID0gMCxcbiAgICAgICAgICAgIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgaWYgKChkb250Q29udmVydCAmJiBhcnJheTFbaV0gIT09IGFycmF5MltpXSkgfHxcbiAgICAgICAgICAgICAgICAoIWRvbnRDb252ZXJ0ICYmIHRvSW50KGFycmF5MVtpXSkgIT09IHRvSW50KGFycmF5MltpXSkpKSB7XG4gICAgICAgICAgICAgICAgZGlmZnMrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGlmZnMgKyBsZW5ndGhEaWZmO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZVVuaXRzKHVuaXRzKSB7XG4gICAgICAgIGlmICh1bml0cykge1xuICAgICAgICAgICAgdmFyIGxvd2VyZWQgPSB1bml0cy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLyguKXMkLywgJyQxJyk7XG4gICAgICAgICAgICB1bml0cyA9IHVuaXRBbGlhc2VzW3VuaXRzXSB8fCBjYW1lbEZ1bmN0aW9uc1tsb3dlcmVkXSB8fCBsb3dlcmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bml0cztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVPYmplY3RVbml0cyhpbnB1dE9iamVjdCkge1xuICAgICAgICB2YXIgbm9ybWFsaXplZElucHV0ID0ge30sXG4gICAgICAgICAgICBub3JtYWxpemVkUHJvcCxcbiAgICAgICAgICAgIHByb3A7XG5cbiAgICAgICAgZm9yIChwcm9wIGluIGlucHV0T2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAoaW5wdXRPYmplY3QuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICBub3JtYWxpemVkUHJvcCA9IG5vcm1hbGl6ZVVuaXRzKHByb3ApO1xuICAgICAgICAgICAgICAgIGlmIChub3JtYWxpemVkUHJvcCkge1xuICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkSW5wdXRbbm9ybWFsaXplZFByb3BdID0gaW5wdXRPYmplY3RbcHJvcF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWRJbnB1dDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlTGlzdChmaWVsZCkge1xuICAgICAgICB2YXIgY291bnQsIHNldHRlcjtcblxuICAgICAgICBpZiAoZmllbGQuaW5kZXhPZignd2VlaycpID09PSAwKSB7XG4gICAgICAgICAgICBjb3VudCA9IDc7XG4gICAgICAgICAgICBzZXR0ZXIgPSAnZGF5JztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmaWVsZC5pbmRleE9mKCdtb250aCcpID09PSAwKSB7XG4gICAgICAgICAgICBjb3VudCA9IDEyO1xuICAgICAgICAgICAgc2V0dGVyID0gJ21vbnRoJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG1vbWVudFtmaWVsZF0gPSBmdW5jdGlvbiAoZm9ybWF0LCBpbmRleCkge1xuICAgICAgICAgICAgdmFyIGksIGdldHRlcixcbiAgICAgICAgICAgICAgICBtZXRob2QgPSBtb21lbnQuZm4uX2xhbmdbZmllbGRdLFxuICAgICAgICAgICAgICAgIHJlc3VsdHMgPSBbXTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBmb3JtYXQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBmb3JtYXQ7XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBnZXR0ZXIgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgIHZhciBtID0gbW9tZW50KCkudXRjKCkuc2V0KHNldHRlciwgaSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ldGhvZC5jYWxsKG1vbWVudC5mbi5fbGFuZywgbSwgZm9ybWF0IHx8ICcnKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChpbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldHRlcihpbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goZ2V0dGVyKGkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9JbnQoYXJndW1lbnRGb3JDb2VyY2lvbikge1xuICAgICAgICB2YXIgY29lcmNlZE51bWJlciA9ICthcmd1bWVudEZvckNvZXJjaW9uLFxuICAgICAgICAgICAgdmFsdWUgPSAwO1xuXG4gICAgICAgIGlmIChjb2VyY2VkTnVtYmVyICE9PSAwICYmIGlzRmluaXRlKGNvZXJjZWROdW1iZXIpKSB7XG4gICAgICAgICAgICBpZiAoY29lcmNlZE51bWJlciA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBNYXRoLmZsb29yKGNvZXJjZWROdW1iZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IE1hdGguY2VpbChjb2VyY2VkTnVtYmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlzSW5Nb250aCh5ZWFyLCBtb250aCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoeWVhciwgbW9udGggKyAxLCAwKSkuZ2V0VVRDRGF0ZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdlZWtzSW5ZZWFyKHllYXIsIGRvdywgZG95KSB7XG4gICAgICAgIHJldHVybiB3ZWVrT2ZZZWFyKG1vbWVudChbeWVhciwgMTEsIDMxICsgZG93IC0gZG95XSksIGRvdywgZG95KS53ZWVrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheXNJblllYXIoeWVhcikge1xuICAgICAgICByZXR1cm4gaXNMZWFwWWVhcih5ZWFyKSA/IDM2NiA6IDM2NTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0xlYXBZZWFyKHllYXIpIHtcbiAgICAgICAgcmV0dXJuICh5ZWFyICUgNCA9PT0gMCAmJiB5ZWFyICUgMTAwICE9PSAwKSB8fCB5ZWFyICUgNDAwID09PSAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrT3ZlcmZsb3cobSkge1xuICAgICAgICB2YXIgb3ZlcmZsb3c7XG4gICAgICAgIGlmIChtLl9hICYmIG0uX3BmLm92ZXJmbG93ID09PSAtMikge1xuICAgICAgICAgICAgb3ZlcmZsb3cgPVxuICAgICAgICAgICAgICAgIG0uX2FbTU9OVEhdIDwgMCB8fCBtLl9hW01PTlRIXSA+IDExID8gTU9OVEggOlxuICAgICAgICAgICAgICAgIG0uX2FbREFURV0gPCAxIHx8IG0uX2FbREFURV0gPiBkYXlzSW5Nb250aChtLl9hW1lFQVJdLCBtLl9hW01PTlRIXSkgPyBEQVRFIDpcbiAgICAgICAgICAgICAgICBtLl9hW0hPVVJdIDwgMCB8fCBtLl9hW0hPVVJdID4gMjMgPyBIT1VSIDpcbiAgICAgICAgICAgICAgICBtLl9hW01JTlVURV0gPCAwIHx8IG0uX2FbTUlOVVRFXSA+IDU5ID8gTUlOVVRFIDpcbiAgICAgICAgICAgICAgICBtLl9hW1NFQ09ORF0gPCAwIHx8IG0uX2FbU0VDT05EXSA+IDU5ID8gU0VDT05EIDpcbiAgICAgICAgICAgICAgICBtLl9hW01JTExJU0VDT05EXSA8IDAgfHwgbS5fYVtNSUxMSVNFQ09ORF0gPiA5OTkgPyBNSUxMSVNFQ09ORCA6XG4gICAgICAgICAgICAgICAgLTE7XG5cbiAgICAgICAgICAgIGlmIChtLl9wZi5fb3ZlcmZsb3dEYXlPZlllYXIgJiYgKG92ZXJmbG93IDwgWUVBUiB8fCBvdmVyZmxvdyA+IERBVEUpKSB7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSBEQVRFO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtLl9wZi5vdmVyZmxvdyA9IG92ZXJmbG93O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNWYWxpZChtKSB7XG4gICAgICAgIGlmIChtLl9pc1ZhbGlkID09IG51bGwpIHtcbiAgICAgICAgICAgIG0uX2lzVmFsaWQgPSAhaXNOYU4obS5fZC5nZXRUaW1lKCkpICYmXG4gICAgICAgICAgICAgICAgbS5fcGYub3ZlcmZsb3cgPCAwICYmXG4gICAgICAgICAgICAgICAgIW0uX3BmLmVtcHR5ICYmXG4gICAgICAgICAgICAgICAgIW0uX3BmLmludmFsaWRNb250aCAmJlxuICAgICAgICAgICAgICAgICFtLl9wZi5udWxsSW5wdXQgJiZcbiAgICAgICAgICAgICAgICAhbS5fcGYuaW52YWxpZEZvcm1hdCAmJlxuICAgICAgICAgICAgICAgICFtLl9wZi51c2VySW52YWxpZGF0ZWQ7XG5cbiAgICAgICAgICAgIGlmIChtLl9zdHJpY3QpIHtcbiAgICAgICAgICAgICAgICBtLl9pc1ZhbGlkID0gbS5faXNWYWxpZCAmJlxuICAgICAgICAgICAgICAgICAgICBtLl9wZi5jaGFyc0xlZnRPdmVyID09PSAwICYmXG4gICAgICAgICAgICAgICAgICAgIG0uX3BmLnVudXNlZFRva2Vucy5sZW5ndGggPT09IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG0uX2lzVmFsaWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplTGFuZ3VhZ2Uoa2V5KSB7XG4gICAgICAgIHJldHVybiBrZXkgPyBrZXkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCdfJywgJy0nKSA6IGtleTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBtb21lbnQgZnJvbSBpbnB1dCwgdGhhdCBpcyBsb2NhbC91dGMvem9uZSBlcXVpdmFsZW50IHRvIG1vZGVsLlxuICAgIGZ1bmN0aW9uIG1ha2VBcyhpbnB1dCwgbW9kZWwpIHtcbiAgICAgICAgcmV0dXJuIG1vZGVsLl9pc1VUQyA/IG1vbWVudChpbnB1dCkuem9uZShtb2RlbC5fb2Zmc2V0IHx8IDApIDpcbiAgICAgICAgICAgIG1vbWVudChpbnB1dCkubG9jYWwoKTtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIExhbmd1YWdlc1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgZXh0ZW5kKExhbmd1YWdlLnByb3RvdHlwZSwge1xuXG4gICAgICAgIHNldCA6IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgICAgIHZhciBwcm9wLCBpO1xuICAgICAgICAgICAgZm9yIChpIGluIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHByb3AgPSBjb25maWdbaV07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNbaV0gPSBwcm9wO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNbJ18nICsgaV0gPSBwcm9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfbW9udGhzIDogXCJKYW51YXJ5X0ZlYnJ1YXJ5X01hcmNoX0FwcmlsX01heV9KdW5lX0p1bHlfQXVndXN0X1NlcHRlbWJlcl9PY3RvYmVyX05vdmVtYmVyX0RlY2VtYmVyXCIuc3BsaXQoXCJfXCIpLFxuICAgICAgICBtb250aHMgOiBmdW5jdGlvbiAobSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1ttLm1vbnRoKCldO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9tb250aHNTaG9ydCA6IFwiSmFuX0ZlYl9NYXJfQXByX01heV9KdW5fSnVsX0F1Z19TZXBfT2N0X05vdl9EZWNcIi5zcGxpdChcIl9cIiksXG4gICAgICAgIG1vbnRoc1Nob3J0IDogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tb250aHNTaG9ydFttLm1vbnRoKCldO1xuICAgICAgICB9LFxuXG4gICAgICAgIG1vbnRoc1BhcnNlIDogZnVuY3Rpb24gKG1vbnRoTmFtZSkge1xuICAgICAgICAgICAgdmFyIGksIG1vbSwgcmVnZXg7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5fbW9udGhzUGFyc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgICAgICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fbW9udGhzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgbW9tID0gbW9tZW50LnV0YyhbMjAwMCwgaV0pO1xuICAgICAgICAgICAgICAgICAgICByZWdleCA9ICdeJyArIHRoaXMubW9udGhzKG1vbSwgJycpICsgJ3xeJyArIHRoaXMubW9udGhzU2hvcnQobW9tLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlW2ldID0gbmV3IFJlZ0V4cChyZWdleC5yZXBsYWNlKCcuJywgJycpLCAnaScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9tb250aHNQYXJzZVtpXS50ZXN0KG1vbnRoTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF93ZWVrZGF5cyA6IFwiU3VuZGF5X01vbmRheV9UdWVzZGF5X1dlZG5lc2RheV9UaHVyc2RheV9GcmlkYXlfU2F0dXJkYXlcIi5zcGxpdChcIl9cIiksXG4gICAgICAgIHdlZWtkYXlzIDogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1ttLmRheSgpXTtcbiAgICAgICAgfSxcblxuICAgICAgICBfd2Vla2RheXNTaG9ydCA6IFwiU3VuX01vbl9UdWVfV2VkX1RodV9GcmlfU2F0XCIuc3BsaXQoXCJfXCIpLFxuICAgICAgICB3ZWVrZGF5c1Nob3J0IDogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1Nob3J0W20uZGF5KCldO1xuICAgICAgICB9LFxuXG4gICAgICAgIF93ZWVrZGF5c01pbiA6IFwiU3VfTW9fVHVfV2VfVGhfRnJfU2FcIi5zcGxpdChcIl9cIiksXG4gICAgICAgIHdlZWtkYXlzTWluIDogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c01pblttLmRheSgpXTtcbiAgICAgICAgfSxcblxuICAgICAgICB3ZWVrZGF5c1BhcnNlIDogZnVuY3Rpb24gKHdlZWtkYXlOYW1lKSB7XG4gICAgICAgICAgICB2YXIgaSwgbW9tLCByZWdleDtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZSA9IFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl93ZWVrZGF5c1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vbSA9IG1vbWVudChbMjAwMCwgMV0pLmRheShpKTtcbiAgICAgICAgICAgICAgICAgICAgcmVnZXggPSAnXicgKyB0aGlzLndlZWtkYXlzKG1vbSwgJycpICsgJ3xeJyArIHRoaXMud2Vla2RheXNTaG9ydChtb20sICcnKSArICd8XicgKyB0aGlzLndlZWtkYXlzTWluKG1vbSwgJycpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlW2ldID0gbmV3IFJlZ0V4cChyZWdleC5yZXBsYWNlKCcuJywgJycpLCAnaScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB0ZXN0IHRoZSByZWdleFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl93ZWVrZGF5c1BhcnNlW2ldLnRlc3Qod2Vla2RheU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfbG9uZ0RhdGVGb3JtYXQgOiB7XG4gICAgICAgICAgICBMVCA6IFwiaDptbSBBXCIsXG4gICAgICAgICAgICBMIDogXCJNTS9ERC9ZWVlZXCIsXG4gICAgICAgICAgICBMTCA6IFwiTU1NTSBEIFlZWVlcIixcbiAgICAgICAgICAgIExMTCA6IFwiTU1NTSBEIFlZWVkgTFRcIixcbiAgICAgICAgICAgIExMTEwgOiBcImRkZGQsIE1NTU0gRCBZWVlZIExUXCJcbiAgICAgICAgfSxcbiAgICAgICAgbG9uZ0RhdGVGb3JtYXQgOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XTtcbiAgICAgICAgICAgIGlmICghb3V0cHV0ICYmIHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleS50b1VwcGVyQ2FzZSgpXSkge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleS50b1VwcGVyQ2FzZSgpXS5yZXBsYWNlKC9NTU1NfE1NfEREfGRkZGQvZywgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsLnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV0gPSBvdXRwdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzUE0gOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIC8vIElFOCBRdWlya3MgTW9kZSAmIElFNyBTdGFuZGFyZHMgTW9kZSBkbyBub3QgYWxsb3cgYWNjZXNzaW5nIHN0cmluZ3MgbGlrZSBhcnJheXNcbiAgICAgICAgICAgIC8vIFVzaW5nIGNoYXJBdCBzaG91bGQgYmUgbW9yZSBjb21wYXRpYmxlLlxuICAgICAgICAgICAgcmV0dXJuICgoaW5wdXQgKyAnJykudG9Mb3dlckNhc2UoKS5jaGFyQXQoMCkgPT09ICdwJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX21lcmlkaWVtUGFyc2UgOiAvW2FwXVxcLj9tP1xcLj8vaSxcbiAgICAgICAgbWVyaWRpZW0gOiBmdW5jdGlvbiAoaG91cnMsIG1pbnV0ZXMsIGlzTG93ZXIpIHtcbiAgICAgICAgICAgIGlmIChob3VycyA+IDExKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzTG93ZXIgPyAncG0nIDogJ1BNJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzTG93ZXIgPyAnYW0nIDogJ0FNJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfY2FsZW5kYXIgOiB7XG4gICAgICAgICAgICBzYW1lRGF5IDogJ1tUb2RheSBhdF0gTFQnLFxuICAgICAgICAgICAgbmV4dERheSA6ICdbVG9tb3Jyb3cgYXRdIExUJyxcbiAgICAgICAgICAgIG5leHRXZWVrIDogJ2RkZGQgW2F0XSBMVCcsXG4gICAgICAgICAgICBsYXN0RGF5IDogJ1tZZXN0ZXJkYXkgYXRdIExUJyxcbiAgICAgICAgICAgIGxhc3RXZWVrIDogJ1tMYXN0XSBkZGRkIFthdF0gTFQnLFxuICAgICAgICAgICAgc2FtZUVsc2UgOiAnTCdcbiAgICAgICAgfSxcbiAgICAgICAgY2FsZW5kYXIgOiBmdW5jdGlvbiAoa2V5LCBtb20pIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9jYWxlbmRhcltrZXldO1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBvdXRwdXQgPT09ICdmdW5jdGlvbicgPyBvdXRwdXQuYXBwbHkobW9tKSA6IG91dHB1dDtcbiAgICAgICAgfSxcblxuICAgICAgICBfcmVsYXRpdmVUaW1lIDoge1xuICAgICAgICAgICAgZnV0dXJlIDogXCJpbiAlc1wiLFxuICAgICAgICAgICAgcGFzdCA6IFwiJXMgYWdvXCIsXG4gICAgICAgICAgICBzIDogXCJhIGZldyBzZWNvbmRzXCIsXG4gICAgICAgICAgICBtIDogXCJhIG1pbnV0ZVwiLFxuICAgICAgICAgICAgbW0gOiBcIiVkIG1pbnV0ZXNcIixcbiAgICAgICAgICAgIGggOiBcImFuIGhvdXJcIixcbiAgICAgICAgICAgIGhoIDogXCIlZCBob3Vyc1wiLFxuICAgICAgICAgICAgZCA6IFwiYSBkYXlcIixcbiAgICAgICAgICAgIGRkIDogXCIlZCBkYXlzXCIsXG4gICAgICAgICAgICBNIDogXCJhIG1vbnRoXCIsXG4gICAgICAgICAgICBNTSA6IFwiJWQgbW9udGhzXCIsXG4gICAgICAgICAgICB5IDogXCJhIHllYXJcIixcbiAgICAgICAgICAgIHl5IDogXCIlZCB5ZWFyc1wiXG4gICAgICAgIH0sXG4gICAgICAgIHJlbGF0aXZlVGltZSA6IGZ1bmN0aW9uIChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbc3RyaW5nXTtcbiAgICAgICAgICAgIHJldHVybiAodHlwZW9mIG91dHB1dCA9PT0gJ2Z1bmN0aW9uJykgP1xuICAgICAgICAgICAgICAgIG91dHB1dChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIDpcbiAgICAgICAgICAgICAgICBvdXRwdXQucmVwbGFjZSgvJWQvaSwgbnVtYmVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgcGFzdEZ1dHVyZSA6IGZ1bmN0aW9uIChkaWZmLCBvdXRwdXQpIHtcbiAgICAgICAgICAgIHZhciBmb3JtYXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbZGlmZiA+IDAgPyAnZnV0dXJlJyA6ICdwYXN0J107XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGZvcm1hdCA9PT0gJ2Z1bmN0aW9uJyA/IGZvcm1hdChvdXRwdXQpIDogZm9ybWF0LnJlcGxhY2UoLyVzL2ksIG91dHB1dCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgb3JkaW5hbCA6IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vcmRpbmFsLnJlcGxhY2UoXCIlZFwiLCBudW1iZXIpO1xuICAgICAgICB9LFxuICAgICAgICBfb3JkaW5hbCA6IFwiJWRcIixcblxuICAgICAgICBwcmVwYXJzZSA6IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcG9zdGZvcm1hdCA6IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2VlayA6IGZ1bmN0aW9uIChtb20pIHtcbiAgICAgICAgICAgIHJldHVybiB3ZWVrT2ZZZWFyKG1vbSwgdGhpcy5fd2Vlay5kb3csIHRoaXMuX3dlZWsuZG95KS53ZWVrO1xuICAgICAgICB9LFxuXG4gICAgICAgIF93ZWVrIDoge1xuICAgICAgICAgICAgZG93IDogMCwgLy8gU3VuZGF5IGlzIHRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsuXG4gICAgICAgICAgICBkb3kgOiA2ICAvLyBUaGUgd2VlayB0aGF0IGNvbnRhaW5zIEphbiAxc3QgaXMgdGhlIGZpcnN0IHdlZWsgb2YgdGhlIHllYXIuXG4gICAgICAgIH0sXG5cbiAgICAgICAgX2ludmFsaWREYXRlOiAnSW52YWxpZCBkYXRlJyxcbiAgICAgICAgaW52YWxpZERhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnZhbGlkRGF0ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gTG9hZHMgYSBsYW5ndWFnZSBkZWZpbml0aW9uIGludG8gdGhlIGBsYW5ndWFnZXNgIGNhY2hlLiAgVGhlIGZ1bmN0aW9uXG4gICAgLy8gdGFrZXMgYSBrZXkgYW5kIG9wdGlvbmFsbHkgdmFsdWVzLiAgSWYgbm90IGluIHRoZSBicm93c2VyIGFuZCBubyB2YWx1ZXNcbiAgICAvLyBhcmUgcHJvdmlkZWQsIGl0IHdpbGwgbG9hZCB0aGUgbGFuZ3VhZ2UgZmlsZSBtb2R1bGUuICBBcyBhIGNvbnZlbmllbmNlLFxuICAgIC8vIHRoaXMgZnVuY3Rpb24gYWxzbyByZXR1cm5zIHRoZSBsYW5ndWFnZSB2YWx1ZXMuXG4gICAgZnVuY3Rpb24gbG9hZExhbmcoa2V5LCB2YWx1ZXMpIHtcbiAgICAgICAgdmFsdWVzLmFiYnIgPSBrZXk7XG4gICAgICAgIGlmICghbGFuZ3VhZ2VzW2tleV0pIHtcbiAgICAgICAgICAgIGxhbmd1YWdlc1trZXldID0gbmV3IExhbmd1YWdlKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGFuZ3VhZ2VzW2tleV0uc2V0KHZhbHVlcyk7XG4gICAgICAgIHJldHVybiBsYW5ndWFnZXNba2V5XTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgYSBsYW5ndWFnZSBmcm9tIHRoZSBgbGFuZ3VhZ2VzYCBjYWNoZS4gTW9zdGx5IHVzZWZ1bCBpbiB0ZXN0cy5cbiAgICBmdW5jdGlvbiB1bmxvYWRMYW5nKGtleSkge1xuICAgICAgICBkZWxldGUgbGFuZ3VhZ2VzW2tleV07XG4gICAgfVxuXG4gICAgLy8gRGV0ZXJtaW5lcyB3aGljaCBsYW5ndWFnZSBkZWZpbml0aW9uIHRvIHVzZSBhbmQgcmV0dXJucyBpdC5cbiAgICAvL1xuICAgIC8vIFdpdGggbm8gcGFyYW1ldGVycywgaXQgd2lsbCByZXR1cm4gdGhlIGdsb2JhbCBsYW5ndWFnZS4gIElmIHlvdVxuICAgIC8vIHBhc3MgaW4gYSBsYW5ndWFnZSBrZXksIHN1Y2ggYXMgJ2VuJywgaXQgd2lsbCByZXR1cm4gdGhlXG4gICAgLy8gZGVmaW5pdGlvbiBmb3IgJ2VuJywgc28gbG9uZyBhcyAnZW4nIGhhcyBhbHJlYWR5IGJlZW4gbG9hZGVkIHVzaW5nXG4gICAgLy8gbW9tZW50LmxhbmcuXG4gICAgZnVuY3Rpb24gZ2V0TGFuZ0RlZmluaXRpb24oa2V5KSB7XG4gICAgICAgIHZhciBpID0gMCwgaiwgbGFuZywgbmV4dCwgc3BsaXQsXG4gICAgICAgICAgICBnZXQgPSBmdW5jdGlvbiAoaykge1xuICAgICAgICAgICAgICAgIGlmICghbGFuZ3VhZ2VzW2tdICYmIGhhc01vZHVsZSkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZSgnLi9sYW5nLycgKyBrKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkgeyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBsYW5ndWFnZXNba107XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50LmZuLl9sYW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0FycmF5KGtleSkpIHtcbiAgICAgICAgICAgIC8vc2hvcnQtY2lyY3VpdCBldmVyeXRoaW5nIGVsc2VcbiAgICAgICAgICAgIGxhbmcgPSBnZXQoa2V5KTtcbiAgICAgICAgICAgIGlmIChsYW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrZXkgPSBba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vcGljayB0aGUgbGFuZ3VhZ2UgZnJvbSB0aGUgYXJyYXlcbiAgICAgICAgLy90cnkgWydlbi1hdScsICdlbi1nYiddIGFzICdlbi1hdScsICdlbi1nYicsICdlbicsIGFzIGluIG1vdmUgdGhyb3VnaCB0aGUgbGlzdCB0cnlpbmcgZWFjaFxuICAgICAgICAvL3N1YnN0cmluZyBmcm9tIG1vc3Qgc3BlY2lmaWMgdG8gbGVhc3QsIGJ1dCBtb3ZlIHRvIHRoZSBuZXh0IGFycmF5IGl0ZW0gaWYgaXQncyBhIG1vcmUgc3BlY2lmaWMgdmFyaWFudCB0aGFuIHRoZSBjdXJyZW50IHJvb3RcbiAgICAgICAgd2hpbGUgKGkgPCBrZXkubGVuZ3RoKSB7XG4gICAgICAgICAgICBzcGxpdCA9IG5vcm1hbGl6ZUxhbmd1YWdlKGtleVtpXSkuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgIGogPSBzcGxpdC5sZW5ndGg7XG4gICAgICAgICAgICBuZXh0ID0gbm9ybWFsaXplTGFuZ3VhZ2Uoa2V5W2kgKyAxXSk7XG4gICAgICAgICAgICBuZXh0ID0gbmV4dCA/IG5leHQuc3BsaXQoJy0nKSA6IG51bGw7XG4gICAgICAgICAgICB3aGlsZSAoaiA+IDApIHtcbiAgICAgICAgICAgICAgICBsYW5nID0gZ2V0KHNwbGl0LnNsaWNlKDAsIGopLmpvaW4oJy0nKSk7XG4gICAgICAgICAgICAgICAgaWYgKGxhbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhbmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChuZXh0ICYmIG5leHQubGVuZ3RoID49IGogJiYgY29tcGFyZUFycmF5cyhzcGxpdCwgbmV4dCwgdHJ1ZSkgPj0gaiAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy90aGUgbmV4dCBhcnJheSBpdGVtIGlzIGJldHRlciB0aGFuIGEgc2hhbGxvd2VyIHN1YnN0cmluZyBvZiB0aGlzIG9uZVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgai0tO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtb21lbnQuZm4uX2xhbmc7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBGb3JtYXR0aW5nXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICBmdW5jdGlvbiByZW1vdmVGb3JtYXR0aW5nVG9rZW5zKGlucHV0KSB7XG4gICAgICAgIGlmIChpbnB1dC5tYXRjaCgvXFxbW1xcc1xcU10vKSkge1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL15cXFt8XFxdJC9nLCBcIlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvXFxcXC9nLCBcIlwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlRm9ybWF0RnVuY3Rpb24oZm9ybWF0KSB7XG4gICAgICAgIHZhciBhcnJheSA9IGZvcm1hdC5tYXRjaChmb3JtYXR0aW5nVG9rZW5zKSwgaSwgbGVuZ3RoO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0VG9rZW5GdW5jdGlvbnNbYXJyYXlbaV1dKSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSBmb3JtYXRUb2tlbkZ1bmN0aW9uc1thcnJheVtpXV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gcmVtb3ZlRm9ybWF0dGluZ1Rva2VucyhhcnJheVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1vbSkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IFwiXCI7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gYXJyYXlbaV0gaW5zdGFuY2VvZiBGdW5jdGlvbiA/IGFycmF5W2ldLmNhbGwobW9tLCBmb3JtYXQpIDogYXJyYXlbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIGZvcm1hdCBkYXRlIHVzaW5nIG5hdGl2ZSBkYXRlIG9iamVjdFxuICAgIGZ1bmN0aW9uIGZvcm1hdE1vbWVudChtLCBmb3JtYXQpIHtcblxuICAgICAgICBpZiAoIW0uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbS5sYW5nKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1hdCA9IGV4cGFuZEZvcm1hdChmb3JtYXQsIG0ubGFuZygpKTtcblxuICAgICAgICBpZiAoIWZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdKSB7XG4gICAgICAgICAgICBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSA9IG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdKG0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4cGFuZEZvcm1hdChmb3JtYXQsIGxhbmcpIHtcbiAgICAgICAgdmFyIGkgPSA1O1xuXG4gICAgICAgIGZ1bmN0aW9uIHJlcGxhY2VMb25nRGF0ZUZvcm1hdFRva2VucyhpbnB1dCkge1xuICAgICAgICAgICAgcmV0dXJuIGxhbmcubG9uZ0RhdGVGb3JtYXQoaW5wdXQpIHx8IGlucHV0O1xuICAgICAgICB9XG5cbiAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIHdoaWxlIChpID49IDAgJiYgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLnRlc3QoZm9ybWF0KSkge1xuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UobG9jYWxGb3JtYXR0aW5nVG9rZW5zLCByZXBsYWNlTG9uZ0RhdGVGb3JtYXRUb2tlbnMpO1xuICAgICAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICBpIC09IDE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9ybWF0O1xuICAgIH1cblxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBQYXJzaW5nXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICAvLyBnZXQgdGhlIHJlZ2V4IHRvIGZpbmQgdGhlIG5leHQgdG9rZW5cbiAgICBmdW5jdGlvbiBnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4odG9rZW4sIGNvbmZpZykge1xuICAgICAgICB2YXIgYSwgc3RyaWN0ID0gY29uZmlnLl9zdHJpY3Q7XG4gICAgICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgICAgY2FzZSAnUSc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlbk9uZURpZ2l0O1xuICAgICAgICBjYXNlICdEREREJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuVGhyZWVEaWdpdHM7XG4gICAgICAgIGNhc2UgJ1lZWVknOlxuICAgICAgICBjYXNlICdHR0dHJzpcbiAgICAgICAgY2FzZSAnZ2dnZyc6XG4gICAgICAgICAgICByZXR1cm4gc3RyaWN0ID8gcGFyc2VUb2tlbkZvdXJEaWdpdHMgOiBwYXJzZVRva2VuT25lVG9Gb3VyRGlnaXRzO1xuICAgICAgICBjYXNlICdZJzpcbiAgICAgICAgY2FzZSAnRyc6XG4gICAgICAgIGNhc2UgJ2cnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5TaWduZWROdW1iZXI7XG4gICAgICAgIGNhc2UgJ1lZWVlZWSc6XG4gICAgICAgIGNhc2UgJ1lZWVlZJzpcbiAgICAgICAgY2FzZSAnR0dHR0cnOlxuICAgICAgICBjYXNlICdnZ2dnZyc6XG4gICAgICAgICAgICByZXR1cm4gc3RyaWN0ID8gcGFyc2VUb2tlblNpeERpZ2l0cyA6IHBhcnNlVG9rZW5PbmVUb1NpeERpZ2l0cztcbiAgICAgICAgY2FzZSAnUyc6XG4gICAgICAgICAgICBpZiAoc3RyaWN0KSB7IHJldHVybiBwYXJzZVRva2VuT25lRGlnaXQ7IH1cbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnU1MnOlxuICAgICAgICAgICAgaWYgKHN0cmljdCkgeyByZXR1cm4gcGFyc2VUb2tlblR3b0RpZ2l0czsgfVxuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdTU1MnOlxuICAgICAgICAgICAgaWYgKHN0cmljdCkgeyByZXR1cm4gcGFyc2VUb2tlblRocmVlRGlnaXRzOyB9XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ0RERCc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlbk9uZVRvVGhyZWVEaWdpdHM7XG4gICAgICAgIGNhc2UgJ01NTSc6XG4gICAgICAgIGNhc2UgJ01NTU0nOlxuICAgICAgICBjYXNlICdkZCc6XG4gICAgICAgIGNhc2UgJ2RkZCc6XG4gICAgICAgIGNhc2UgJ2RkZGQnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5Xb3JkO1xuICAgICAgICBjYXNlICdhJzpcbiAgICAgICAgY2FzZSAnQSc6XG4gICAgICAgICAgICByZXR1cm4gZ2V0TGFuZ0RlZmluaXRpb24oY29uZmlnLl9sKS5fbWVyaWRpZW1QYXJzZTtcbiAgICAgICAgY2FzZSAnWCc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlblRpbWVzdGFtcE1zO1xuICAgICAgICBjYXNlICdaJzpcbiAgICAgICAgY2FzZSAnWlonOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5UaW1lem9uZTtcbiAgICAgICAgY2FzZSAnVCc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlblQ7XG4gICAgICAgIGNhc2UgJ1NTU1MnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5EaWdpdHM7XG4gICAgICAgIGNhc2UgJ01NJzpcbiAgICAgICAgY2FzZSAnREQnOlxuICAgICAgICBjYXNlICdZWSc6XG4gICAgICAgIGNhc2UgJ0dHJzpcbiAgICAgICAgY2FzZSAnZ2cnOlxuICAgICAgICBjYXNlICdISCc6XG4gICAgICAgIGNhc2UgJ2hoJzpcbiAgICAgICAgY2FzZSAnbW0nOlxuICAgICAgICBjYXNlICdzcyc6XG4gICAgICAgIGNhc2UgJ3d3JzpcbiAgICAgICAgY2FzZSAnV1cnOlxuICAgICAgICAgICAgcmV0dXJuIHN0cmljdCA/IHBhcnNlVG9rZW5Ud29EaWdpdHMgOiBwYXJzZVRva2VuT25lT3JUd29EaWdpdHM7XG4gICAgICAgIGNhc2UgJ00nOlxuICAgICAgICBjYXNlICdEJzpcbiAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgIGNhc2UgJ0gnOlxuICAgICAgICBjYXNlICdoJzpcbiAgICAgICAgY2FzZSAnbSc6XG4gICAgICAgIGNhc2UgJ3MnOlxuICAgICAgICBjYXNlICd3JzpcbiAgICAgICAgY2FzZSAnVyc6XG4gICAgICAgIGNhc2UgJ2UnOlxuICAgICAgICBjYXNlICdFJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuT25lT3JUd29EaWdpdHM7XG4gICAgICAgIGNhc2UgJ0RvJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuT3JkaW5hbDtcbiAgICAgICAgZGVmYXVsdCA6XG4gICAgICAgICAgICBhID0gbmV3IFJlZ0V4cChyZWdleHBFc2NhcGUodW5lc2NhcGVGb3JtYXQodG9rZW4ucmVwbGFjZSgnXFxcXCcsICcnKSksIFwiaVwiKSk7XG4gICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRpbWV6b25lTWludXRlc0Zyb21TdHJpbmcoc3RyaW5nKSB7XG4gICAgICAgIHN0cmluZyA9IHN0cmluZyB8fCBcIlwiO1xuICAgICAgICB2YXIgcG9zc2libGVUek1hdGNoZXMgPSAoc3RyaW5nLm1hdGNoKHBhcnNlVG9rZW5UaW1lem9uZSkgfHwgW10pLFxuICAgICAgICAgICAgdHpDaHVuayA9IHBvc3NpYmxlVHpNYXRjaGVzW3Bvc3NpYmxlVHpNYXRjaGVzLmxlbmd0aCAtIDFdIHx8IFtdLFxuICAgICAgICAgICAgcGFydHMgPSAodHpDaHVuayArICcnKS5tYXRjaChwYXJzZVRpbWV6b25lQ2h1bmtlcikgfHwgWyctJywgMCwgMF0sXG4gICAgICAgICAgICBtaW51dGVzID0gKyhwYXJ0c1sxXSAqIDYwKSArIHRvSW50KHBhcnRzWzJdKTtcblxuICAgICAgICByZXR1cm4gcGFydHNbMF0gPT09ICcrJyA/IC1taW51dGVzIDogbWludXRlcztcbiAgICB9XG5cbiAgICAvLyBmdW5jdGlvbiB0byBjb252ZXJ0IHN0cmluZyBpbnB1dCB0byBkYXRlXG4gICAgZnVuY3Rpb24gYWRkVGltZVRvQXJyYXlGcm9tVG9rZW4odG9rZW4sIGlucHV0LCBjb25maWcpIHtcbiAgICAgICAgdmFyIGEsIGRhdGVQYXJ0QXJyYXkgPSBjb25maWcuX2E7XG5cbiAgICAgICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgICAvLyBRVUFSVEVSXG4gICAgICAgIGNhc2UgJ1EnOlxuICAgICAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkYXRlUGFydEFycmF5W01PTlRIXSA9ICh0b0ludChpbnB1dCkgLSAxKSAqIDM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gTU9OVEhcbiAgICAgICAgY2FzZSAnTScgOiAvLyBmYWxsIHRocm91Z2ggdG8gTU1cbiAgICAgICAgY2FzZSAnTU0nIDpcbiAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtNT05USF0gPSB0b0ludChpbnB1dCkgLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ01NTScgOiAvLyBmYWxsIHRocm91Z2ggdG8gTU1NTVxuICAgICAgICBjYXNlICdNTU1NJyA6XG4gICAgICAgICAgICBhID0gZ2V0TGFuZ0RlZmluaXRpb24oY29uZmlnLl9sKS5tb250aHNQYXJzZShpbnB1dCk7XG4gICAgICAgICAgICAvLyBpZiB3ZSBkaWRuJ3QgZmluZCBhIG1vbnRoIG5hbWUsIG1hcmsgdGhlIGRhdGUgYXMgaW52YWxpZC5cbiAgICAgICAgICAgIGlmIChhICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkYXRlUGFydEFycmF5W01PTlRIXSA9IGE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fcGYuaW52YWxpZE1vbnRoID0gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gREFZIE9GIE1PTlRIXG4gICAgICAgIGNhc2UgJ0QnIDogLy8gZmFsbCB0aHJvdWdoIHRvIEREXG4gICAgICAgIGNhc2UgJ0REJyA6XG4gICAgICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbREFURV0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnRG8nIDpcbiAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtEQVRFXSA9IHRvSW50KHBhcnNlSW50KGlucHV0LCAxMCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIERBWSBPRiBZRUFSXG4gICAgICAgIGNhc2UgJ0RERCcgOiAvLyBmYWxsIHRocm91Z2ggdG8gRERERFxuICAgICAgICBjYXNlICdEREREJyA6XG4gICAgICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fZGF5T2ZZZWFyID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gWUVBUlxuICAgICAgICBjYXNlICdZWScgOlxuICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtZRUFSXSA9IG1vbWVudC5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnWVlZWScgOlxuICAgICAgICBjYXNlICdZWVlZWScgOlxuICAgICAgICBjYXNlICdZWVlZWVknIDpcbiAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbWUVBUl0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gQU0gLyBQTVxuICAgICAgICBjYXNlICdhJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBBXG4gICAgICAgIGNhc2UgJ0EnIDpcbiAgICAgICAgICAgIGNvbmZpZy5faXNQbSA9IGdldExhbmdEZWZpbml0aW9uKGNvbmZpZy5fbCkuaXNQTShpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gMjQgSE9VUlxuICAgICAgICBjYXNlICdIJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBoaFxuICAgICAgICBjYXNlICdISCcgOiAvLyBmYWxsIHRocm91Z2ggdG8gaGhcbiAgICAgICAgY2FzZSAnaCcgOiAvLyBmYWxsIHRocm91Z2ggdG8gaGhcbiAgICAgICAgY2FzZSAnaGgnIDpcbiAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gTUlOVVRFXG4gICAgICAgIGNhc2UgJ20nIDogLy8gZmFsbCB0aHJvdWdoIHRvIG1tXG4gICAgICAgIGNhc2UgJ21tJyA6XG4gICAgICAgICAgICBkYXRlUGFydEFycmF5W01JTlVURV0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gU0VDT05EXG4gICAgICAgIGNhc2UgJ3MnIDogLy8gZmFsbCB0aHJvdWdoIHRvIHNzXG4gICAgICAgIGNhc2UgJ3NzJyA6XG4gICAgICAgICAgICBkYXRlUGFydEFycmF5W1NFQ09ORF0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gTUlMTElTRUNPTkRcbiAgICAgICAgY2FzZSAnUycgOlxuICAgICAgICBjYXNlICdTUycgOlxuICAgICAgICBjYXNlICdTU1MnIDpcbiAgICAgICAgY2FzZSAnU1NTUycgOlxuICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtNSUxMSVNFQ09ORF0gPSB0b0ludCgoJzAuJyArIGlucHV0KSAqIDEwMDApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFVOSVggVElNRVNUQU1QIFdJVEggTVNcbiAgICAgICAgY2FzZSAnWCc6XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShwYXJzZUZsb2F0KGlucHV0KSAqIDEwMDApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFRJTUVaT05FXG4gICAgICAgIGNhc2UgJ1onIDogLy8gZmFsbCB0aHJvdWdoIHRvIFpaXG4gICAgICAgIGNhc2UgJ1paJyA6XG4gICAgICAgICAgICBjb25maWcuX3VzZVVUQyA9IHRydWU7XG4gICAgICAgICAgICBjb25maWcuX3R6bSA9IHRpbWV6b25lTWludXRlc0Zyb21TdHJpbmcoaW5wdXQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFdFRUtEQVkgLSBodW1hblxuICAgICAgICBjYXNlICdkZCc6XG4gICAgICAgIGNhc2UgJ2RkZCc6XG4gICAgICAgIGNhc2UgJ2RkZGQnOlxuICAgICAgICAgICAgYSA9IGdldExhbmdEZWZpbml0aW9uKGNvbmZpZy5fbCkud2Vla2RheXNQYXJzZShpbnB1dCk7XG4gICAgICAgICAgICAvLyBpZiB3ZSBkaWRuJ3QgZ2V0IGEgd2Vla2RheSBuYW1lLCBtYXJrIHRoZSBkYXRlIGFzIGludmFsaWRcbiAgICAgICAgICAgIGlmIChhICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX3cgPSBjb25maWcuX3cgfHwge307XG4gICAgICAgICAgICAgICAgY29uZmlnLl93WydkJ10gPSBhO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX3BmLmludmFsaWRXZWVrZGF5ID0gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gV0VFSywgV0VFSyBEQVkgLSBudW1lcmljXG4gICAgICAgIGNhc2UgJ3cnOlxuICAgICAgICBjYXNlICd3dyc6XG4gICAgICAgIGNhc2UgJ1cnOlxuICAgICAgICBjYXNlICdXVyc6XG4gICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICBjYXNlICdlJzpcbiAgICAgICAgY2FzZSAnRSc6XG4gICAgICAgICAgICB0b2tlbiA9IHRva2VuLnN1YnN0cigwLCAxKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnZ2dnZyc6XG4gICAgICAgIGNhc2UgJ0dHR0cnOlxuICAgICAgICBjYXNlICdHR0dHRyc6XG4gICAgICAgICAgICB0b2tlbiA9IHRva2VuLnN1YnN0cigwLCAyKTtcbiAgICAgICAgICAgIGlmIChpbnB1dCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fdyA9IGNvbmZpZy5fdyB8fCB7fTtcbiAgICAgICAgICAgICAgICBjb25maWcuX3dbdG9rZW5dID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2dnJzpcbiAgICAgICAgY2FzZSAnR0cnOlxuICAgICAgICAgICAgY29uZmlnLl93ID0gY29uZmlnLl93IHx8IHt9O1xuICAgICAgICAgICAgY29uZmlnLl93W3Rva2VuXSA9IG1vbWVudC5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla0luZm8oY29uZmlnKSB7XG4gICAgICAgIHZhciB3LCB3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3ksIHRlbXAsIGxhbmc7XG5cbiAgICAgICAgdyA9IGNvbmZpZy5fdztcbiAgICAgICAgaWYgKHcuR0cgIT0gbnVsbCB8fCB3LlcgIT0gbnVsbCB8fCB3LkUgIT0gbnVsbCkge1xuICAgICAgICAgICAgZG93ID0gMTtcbiAgICAgICAgICAgIGRveSA9IDQ7XG5cbiAgICAgICAgICAgIC8vIFRPRE86IFdlIG5lZWQgdG8gdGFrZSB0aGUgY3VycmVudCBpc29XZWVrWWVhciwgYnV0IHRoYXQgZGVwZW5kcyBvblxuICAgICAgICAgICAgLy8gaG93IHdlIGludGVycHJldCBub3cgKGxvY2FsLCB1dGMsIGZpeGVkIG9mZnNldCkuIFNvIGNyZWF0ZVxuICAgICAgICAgICAgLy8gYSBub3cgdmVyc2lvbiBvZiBjdXJyZW50IGNvbmZpZyAodGFrZSBsb2NhbC91dGMvb2Zmc2V0IGZsYWdzLCBhbmRcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBub3cpLlxuICAgICAgICAgICAgd2Vla1llYXIgPSBkZmwody5HRywgY29uZmlnLl9hW1lFQVJdLCB3ZWVrT2ZZZWFyKG1vbWVudCgpLCAxLCA0KS55ZWFyKTtcbiAgICAgICAgICAgIHdlZWsgPSBkZmwody5XLCAxKTtcbiAgICAgICAgICAgIHdlZWtkYXkgPSBkZmwody5FLCAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxhbmcgPSBnZXRMYW5nRGVmaW5pdGlvbihjb25maWcuX2wpO1xuICAgICAgICAgICAgZG93ID0gbGFuZy5fd2Vlay5kb3c7XG4gICAgICAgICAgICBkb3kgPSBsYW5nLl93ZWVrLmRveTtcblxuICAgICAgICAgICAgd2Vla1llYXIgPSBkZmwody5nZywgY29uZmlnLl9hW1lFQVJdLCB3ZWVrT2ZZZWFyKG1vbWVudCgpLCBkb3csIGRveSkueWVhcik7XG4gICAgICAgICAgICB3ZWVrID0gZGZsKHcudywgMSk7XG5cbiAgICAgICAgICAgIGlmICh3LmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIHdlZWtkYXkgLS0gbG93IGRheSBudW1iZXJzIGFyZSBjb25zaWRlcmVkIG5leHQgd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSB3LmQ7XG4gICAgICAgICAgICAgICAgaWYgKHdlZWtkYXkgPCBkb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgKyt3ZWVrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAody5lICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBsb2NhbCB3ZWVrZGF5IC0tIGNvdW50aW5nIHN0YXJ0cyBmcm9tIGJlZ2luaW5nIG9mIHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gdy5lICsgZG93O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBkZWZhdWx0IHRvIGJlZ2luaW5nIG9mIHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gZG93O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXAgPSBkYXlPZlllYXJGcm9tV2Vla3Mod2Vla1llYXIsIHdlZWssIHdlZWtkYXksIGRveSwgZG93KTtcblxuICAgICAgICBjb25maWcuX2FbWUVBUl0gPSB0ZW1wLnllYXI7XG4gICAgICAgIGNvbmZpZy5fZGF5T2ZZZWFyID0gdGVtcC5kYXlPZlllYXI7XG4gICAgfVxuXG4gICAgLy8gY29udmVydCBhbiBhcnJheSB0byBhIGRhdGUuXG4gICAgLy8gdGhlIGFycmF5IHNob3VsZCBtaXJyb3IgdGhlIHBhcmFtZXRlcnMgYmVsb3dcbiAgICAvLyBub3RlOiBhbGwgdmFsdWVzIHBhc3QgdGhlIHllYXIgYXJlIG9wdGlvbmFsIGFuZCB3aWxsIGRlZmF1bHQgdG8gdGhlIGxvd2VzdCBwb3NzaWJsZSB2YWx1ZS5cbiAgICAvLyBbeWVhciwgbW9udGgsIGRheSAsIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCBtaWxsaXNlY29uZF1cbiAgICBmdW5jdGlvbiBkYXRlRnJvbUNvbmZpZyhjb25maWcpIHtcbiAgICAgICAgdmFyIGksIGRhdGUsIGlucHV0ID0gW10sIGN1cnJlbnREYXRlLCB5ZWFyVG9Vc2U7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudERhdGUgPSBjdXJyZW50RGF0ZUFycmF5KGNvbmZpZyk7XG5cbiAgICAgICAgLy9jb21wdXRlIGRheSBvZiB0aGUgeWVhciBmcm9tIHdlZWtzIGFuZCB3ZWVrZGF5c1xuICAgICAgICBpZiAoY29uZmlnLl93ICYmIGNvbmZpZy5fYVtEQVRFXSA9PSBudWxsICYmIGNvbmZpZy5fYVtNT05USF0gPT0gbnVsbCkge1xuICAgICAgICAgICAgZGF5T2ZZZWFyRnJvbVdlZWtJbmZvKGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2lmIHRoZSBkYXkgb2YgdGhlIHllYXIgaXMgc2V0LCBmaWd1cmUgb3V0IHdoYXQgaXQgaXNcbiAgICAgICAgaWYgKGNvbmZpZy5fZGF5T2ZZZWFyKSB7XG4gICAgICAgICAgICB5ZWFyVG9Vc2UgPSBkZmwoY29uZmlnLl9hW1lFQVJdLCBjdXJyZW50RGF0ZVtZRUFSXSk7XG5cbiAgICAgICAgICAgIGlmIChjb25maWcuX2RheU9mWWVhciA+IGRheXNJblllYXIoeWVhclRvVXNlKSkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fcGYuX292ZXJmbG93RGF5T2ZZZWFyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGF0ZSA9IG1ha2VVVENEYXRlKHllYXJUb1VzZSwgMCwgY29uZmlnLl9kYXlPZlllYXIpO1xuICAgICAgICAgICAgY29uZmlnLl9hW01PTlRIXSA9IGRhdGUuZ2V0VVRDTW9udGgoKTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtEQVRFXSA9IGRhdGUuZ2V0VVRDRGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGVmYXVsdCB0byBjdXJyZW50IGRhdGUuXG4gICAgICAgIC8vICogaWYgbm8geWVhciwgbW9udGgsIGRheSBvZiBtb250aCBhcmUgZ2l2ZW4sIGRlZmF1bHQgdG8gdG9kYXlcbiAgICAgICAgLy8gKiBpZiBkYXkgb2YgbW9udGggaXMgZ2l2ZW4sIGRlZmF1bHQgbW9udGggYW5kIHllYXJcbiAgICAgICAgLy8gKiBpZiBtb250aCBpcyBnaXZlbiwgZGVmYXVsdCBvbmx5IHllYXJcbiAgICAgICAgLy8gKiBpZiB5ZWFyIGlzIGdpdmVuLCBkb24ndCBkZWZhdWx0IGFueXRoaW5nXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAzICYmIGNvbmZpZy5fYVtpXSA9PSBudWxsOyArK2kpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtpXSA9IGlucHV0W2ldID0gY3VycmVudERhdGVbaV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBaZXJvIG91dCB3aGF0ZXZlciB3YXMgbm90IGRlZmF1bHRlZCwgaW5jbHVkaW5nIHRpbWVcbiAgICAgICAgZm9yICg7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtpXSA9IGlucHV0W2ldID0gKGNvbmZpZy5fYVtpXSA9PSBudWxsKSA/IChpID09PSAyID8gMSA6IDApIDogY29uZmlnLl9hW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnLl9kID0gKGNvbmZpZy5fdXNlVVRDID8gbWFrZVVUQ0RhdGUgOiBtYWtlRGF0ZSkuYXBwbHkobnVsbCwgaW5wdXQpO1xuICAgICAgICAvLyBBcHBseSB0aW1lem9uZSBvZmZzZXQgZnJvbSBpbnB1dC4gVGhlIGFjdHVhbCB6b25lIGNhbiBiZSBjaGFuZ2VkXG4gICAgICAgIC8vIHdpdGggcGFyc2Vab25lLlxuICAgICAgICBpZiAoY29uZmlnLl90em0gIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uZmlnLl9kLnNldFVUQ01pbnV0ZXMoY29uZmlnLl9kLmdldFVUQ01pbnV0ZXMoKSArIGNvbmZpZy5fdHptKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRhdGVGcm9tT2JqZWN0KGNvbmZpZykge1xuICAgICAgICB2YXIgbm9ybWFsaXplZElucHV0O1xuXG4gICAgICAgIGlmIChjb25maWcuX2QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vcm1hbGl6ZWRJbnB1dCA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKGNvbmZpZy5faSk7XG4gICAgICAgIGNvbmZpZy5fYSA9IFtcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dC55ZWFyLFxuICAgICAgICAgICAgbm9ybWFsaXplZElucHV0Lm1vbnRoLFxuICAgICAgICAgICAgbm9ybWFsaXplZElucHV0LmRheSxcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dC5ob3VyLFxuICAgICAgICAgICAgbm9ybWFsaXplZElucHV0Lm1pbnV0ZSxcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dC5zZWNvbmQsXG4gICAgICAgICAgICBub3JtYWxpemVkSW5wdXQubWlsbGlzZWNvbmRcbiAgICAgICAgXTtcblxuICAgICAgICBkYXRlRnJvbUNvbmZpZyhjb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGN1cnJlbnREYXRlQXJyYXkoY29uZmlnKSB7XG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBpZiAoY29uZmlnLl91c2VVVEMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgbm93LmdldFVUQ0Z1bGxZZWFyKCksXG4gICAgICAgICAgICAgICAgbm93LmdldFVUQ01vbnRoKCksXG4gICAgICAgICAgICAgICAgbm93LmdldFVUQ0RhdGUoKVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbbm93LmdldEZ1bGxZZWFyKCksIG5vdy5nZXRNb250aCgpLCBub3cuZ2V0RGF0ZSgpXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSBzdHJpbmcgYW5kIGZvcm1hdCBzdHJpbmdcbiAgICBmdW5jdGlvbiBtYWtlRGF0ZUZyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKSB7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fZiA9PT0gbW9tZW50LklTT184NjAxKSB7XG4gICAgICAgICAgICBwYXJzZUlTTyhjb25maWcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnLl9hID0gW107XG4gICAgICAgIGNvbmZpZy5fcGYuZW1wdHkgPSB0cnVlO1xuXG4gICAgICAgIC8vIFRoaXMgYXJyYXkgaXMgdXNlZCB0byBtYWtlIGEgRGF0ZSwgZWl0aGVyIHdpdGggYG5ldyBEYXRlYCBvciBgRGF0ZS5VVENgXG4gICAgICAgIHZhciBsYW5nID0gZ2V0TGFuZ0RlZmluaXRpb24oY29uZmlnLl9sKSxcbiAgICAgICAgICAgIHN0cmluZyA9ICcnICsgY29uZmlnLl9pLFxuICAgICAgICAgICAgaSwgcGFyc2VkSW5wdXQsIHRva2VucywgdG9rZW4sIHNraXBwZWQsXG4gICAgICAgICAgICBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoLFxuICAgICAgICAgICAgdG90YWxQYXJzZWRJbnB1dExlbmd0aCA9IDA7XG5cbiAgICAgICAgdG9rZW5zID0gZXhwYW5kRm9ybWF0KGNvbmZpZy5fZiwgbGFuZykubWF0Y2goZm9ybWF0dGluZ1Rva2VucykgfHwgW107XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgICAgICBwYXJzZWRJbnB1dCA9IChzdHJpbmcubWF0Y2goZ2V0UGFyc2VSZWdleEZvclRva2VuKHRva2VuLCBjb25maWcpKSB8fCBbXSlbMF07XG4gICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBza2lwcGVkID0gc3RyaW5nLnN1YnN0cigwLCBzdHJpbmcuaW5kZXhPZihwYXJzZWRJbnB1dCkpO1xuICAgICAgICAgICAgICAgIGlmIChza2lwcGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9wZi51bnVzZWRJbnB1dC5wdXNoKHNraXBwZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc2xpY2Uoc3RyaW5nLmluZGV4T2YocGFyc2VkSW5wdXQpICsgcGFyc2VkSW5wdXQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoICs9IHBhcnNlZElucHV0Lmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGRvbid0IHBhcnNlIGlmIGl0J3Mgbm90IGEga25vd24gdG9rZW5cbiAgICAgICAgICAgIGlmIChmb3JtYXRUb2tlbkZ1bmN0aW9uc1t0b2tlbl0pIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9wZi5lbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9wZi51bnVzZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBwYXJzZWRJbnB1dCwgY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbmZpZy5fc3RyaWN0ICYmICFwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fcGYudW51c2VkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIHJlbWFpbmluZyB1bnBhcnNlZCBpbnB1dCBsZW5ndGggdG8gdGhlIHN0cmluZ1xuICAgICAgICBjb25maWcuX3BmLmNoYXJzTGVmdE92ZXIgPSBzdHJpbmdMZW5ndGggLSB0b3RhbFBhcnNlZElucHV0TGVuZ3RoO1xuICAgICAgICBpZiAoc3RyaW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbmZpZy5fcGYudW51c2VkSW5wdXQucHVzaChzdHJpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGFuZGxlIGFtIHBtXG4gICAgICAgIGlmIChjb25maWcuX2lzUG0gJiYgY29uZmlnLl9hW0hPVVJdIDwgMTIpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSArPSAxMjtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiBpcyAxMiBhbSwgY2hhbmdlIGhvdXJzIHRvIDBcbiAgICAgICAgaWYgKGNvbmZpZy5faXNQbSA9PT0gZmFsc2UgJiYgY29uZmlnLl9hW0hPVVJdID09PSAxMikge1xuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGVGcm9tQ29uZmlnKGNvbmZpZyk7XG4gICAgICAgIGNoZWNrT3ZlcmZsb3coY29uZmlnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1bmVzY2FwZUZvcm1hdChzKSB7XG4gICAgICAgIHJldHVybiBzLnJlcGxhY2UoL1xcXFwoXFxbKXxcXFxcKFxcXSl8XFxbKFteXFxdXFxbXSopXFxdfFxcXFwoLikvZywgZnVuY3Rpb24gKG1hdGNoZWQsIHAxLCBwMiwgcDMsIHA0KSB7XG4gICAgICAgICAgICByZXR1cm4gcDEgfHwgcDIgfHwgcDMgfHwgcDQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIENvZGUgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM1NjE0OTMvaXMtdGhlcmUtYS1yZWdleHAtZXNjYXBlLWZ1bmN0aW9uLWluLWphdmFzY3JpcHRcbiAgICBmdW5jdGlvbiByZWdleHBFc2NhcGUocykge1xuICAgICAgICByZXR1cm4gcy5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcbiAgICB9XG5cbiAgICAvLyBkYXRlIGZyb20gc3RyaW5nIGFuZCBhcnJheSBvZiBmb3JtYXQgc3RyaW5nc1xuICAgIGZ1bmN0aW9uIG1ha2VEYXRlRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZykge1xuICAgICAgICB2YXIgdGVtcENvbmZpZyxcbiAgICAgICAgICAgIGJlc3RNb21lbnQsXG5cbiAgICAgICAgICAgIHNjb3JlVG9CZWF0LFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZTtcblxuICAgICAgICBpZiAoY29uZmlnLl9mLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29uZmlnLl9wZi5pbnZhbGlkRm9ybWF0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKE5hTik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29uZmlnLl9mLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgPSAwO1xuICAgICAgICAgICAgdGVtcENvbmZpZyA9IGV4dGVuZCh7fSwgY29uZmlnKTtcbiAgICAgICAgICAgIHRlbXBDb25maWcuX3BmID0gZGVmYXVsdFBhcnNpbmdGbGFncygpO1xuICAgICAgICAgICAgdGVtcENvbmZpZy5fZiA9IGNvbmZpZy5fZltpXTtcbiAgICAgICAgICAgIG1ha2VEYXRlRnJvbVN0cmluZ0FuZEZvcm1hdCh0ZW1wQ29uZmlnKTtcblxuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKHRlbXBDb25maWcpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGFueSBpbnB1dCB0aGF0IHdhcyBub3QgcGFyc2VkIGFkZCBhIHBlbmFsdHkgZm9yIHRoYXQgZm9ybWF0XG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgKz0gdGVtcENvbmZpZy5fcGYuY2hhcnNMZWZ0T3ZlcjtcblxuICAgICAgICAgICAgLy9vciB0b2tlbnNcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSArPSB0ZW1wQ29uZmlnLl9wZi51bnVzZWRUb2tlbnMubGVuZ3RoICogMTA7XG5cbiAgICAgICAgICAgIHRlbXBDb25maWcuX3BmLnNjb3JlID0gY3VycmVudFNjb3JlO1xuXG4gICAgICAgICAgICBpZiAoc2NvcmVUb0JlYXQgPT0gbnVsbCB8fCBjdXJyZW50U2NvcmUgPCBzY29yZVRvQmVhdCkge1xuICAgICAgICAgICAgICAgIHNjb3JlVG9CZWF0ID0gY3VycmVudFNjb3JlO1xuICAgICAgICAgICAgICAgIGJlc3RNb21lbnQgPSB0ZW1wQ29uZmlnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXh0ZW5kKGNvbmZpZywgYmVzdE1vbWVudCB8fCB0ZW1wQ29uZmlnKTtcbiAgICB9XG5cbiAgICAvLyBkYXRlIGZyb20gaXNvIGZvcm1hdFxuICAgIGZ1bmN0aW9uIHBhcnNlSVNPKGNvbmZpZykge1xuICAgICAgICB2YXIgaSwgbCxcbiAgICAgICAgICAgIHN0cmluZyA9IGNvbmZpZy5faSxcbiAgICAgICAgICAgIG1hdGNoID0gaXNvUmVnZXguZXhlYyhzdHJpbmcpO1xuXG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgY29uZmlnLl9wZi5pc28gPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IGlzb0RhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpc29EYXRlc1tpXVsxXS5leGVjKHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWF0Y2hbNV0gc2hvdWxkIGJlIFwiVFwiIG9yIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICBjb25maWcuX2YgPSBpc29EYXRlc1tpXVswXSArIChtYXRjaFs2XSB8fCBcIiBcIik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGwgPSBpc29UaW1lcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNvVGltZXNbaV1bMV0uZXhlYyhzdHJpbmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5fZiArPSBpc29UaW1lc1tpXVswXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHN0cmluZy5tYXRjaChwYXJzZVRva2VuVGltZXpvbmUpKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9mICs9IFwiWlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWFrZURhdGVGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSBpc28gZm9ybWF0IG9yIGZhbGxiYWNrXG4gICAgZnVuY3Rpb24gbWFrZURhdGVGcm9tU3RyaW5nKGNvbmZpZykge1xuICAgICAgICBwYXJzZUlTTyhjb25maWcpO1xuICAgICAgICBpZiAoY29uZmlnLl9pc1ZhbGlkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgZGVsZXRlIGNvbmZpZy5faXNWYWxpZDtcbiAgICAgICAgICAgIG1vbWVudC5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayhjb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZURhdGVGcm9tSW5wdXQoY29uZmlnKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IGNvbmZpZy5faSxcbiAgICAgICAgICAgIG1hdGNoZWQgPSBhc3BOZXRKc29uUmVnZXguZXhlYyhpbnB1dCk7XG5cbiAgICAgICAgaWYgKGlucHV0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAobWF0Y2hlZCkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoK21hdGNoZWRbMV0pO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIG1ha2VEYXRlRnJvbVN0cmluZyhjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcuX2EgPSBpbnB1dC5zbGljZSgwKTtcbiAgICAgICAgICAgIGRhdGVGcm9tQ29uZmlnKGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNEYXRlKGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoK2lucHV0KTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YoaW5wdXQpID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgZGF0ZUZyb21PYmplY3QoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YoaW5wdXQpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgLy8gZnJvbSBtaWxsaXNlY29uZHNcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGlucHV0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1vbWVudC5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayhjb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZURhdGUoeSwgbSwgZCwgaCwgTSwgcywgbXMpIHtcbiAgICAgICAgLy9jYW4ndCBqdXN0IGFwcGx5KCkgdG8gY3JlYXRlIGEgZGF0ZTpcbiAgICAgICAgLy9odHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE4MTM0OC9pbnN0YW50aWF0aW5nLWEtamF2YXNjcmlwdC1vYmplY3QtYnktY2FsbGluZy1wcm90b3R5cGUtY29uc3RydWN0b3ItYXBwbHlcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh5LCBtLCBkLCBoLCBNLCBzLCBtcyk7XG5cbiAgICAgICAgLy90aGUgZGF0ZSBjb25zdHJ1Y3RvciBkb2Vzbid0IGFjY2VwdCB5ZWFycyA8IDE5NzBcbiAgICAgICAgaWYgKHkgPCAxOTcwKSB7XG4gICAgICAgICAgICBkYXRlLnNldEZ1bGxZZWFyKHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VVVENEYXRlKHkpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQy5hcHBseShudWxsLCBhcmd1bWVudHMpKTtcbiAgICAgICAgaWYgKHkgPCAxOTcwKSB7XG4gICAgICAgICAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlV2Vla2RheShpbnB1dCwgbGFuZ3VhZ2UpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmICghaXNOYU4oaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBwYXJzZUludChpbnB1dCwgMTApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBsYW5ndWFnZS53ZWVrZGF5c1BhcnNlKGlucHV0KTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgUmVsYXRpdmUgVGltZVxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgLy8gaGVscGVyIGZ1bmN0aW9uIGZvciBtb21lbnQuZm4uZnJvbSwgbW9tZW50LmZuLmZyb21Ob3csIGFuZCBtb21lbnQuZHVyYXRpb24uZm4uaHVtYW5pemVcbiAgICBmdW5jdGlvbiBzdWJzdGl0dXRlVGltZUFnbyhzdHJpbmcsIG51bWJlciwgd2l0aG91dFN1ZmZpeCwgaXNGdXR1cmUsIGxhbmcpIHtcbiAgICAgICAgcmV0dXJuIGxhbmcucmVsYXRpdmVUaW1lKG51bWJlciB8fCAxLCAhIXdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbGF0aXZlVGltZShtaWxsaXNlY29uZHMsIHdpdGhvdXRTdWZmaXgsIGxhbmcpIHtcbiAgICAgICAgdmFyIHNlY29uZHMgPSByb3VuZChNYXRoLmFicyhtaWxsaXNlY29uZHMpIC8gMTAwMCksXG4gICAgICAgICAgICBtaW51dGVzID0gcm91bmQoc2Vjb25kcyAvIDYwKSxcbiAgICAgICAgICAgIGhvdXJzID0gcm91bmQobWludXRlcyAvIDYwKSxcbiAgICAgICAgICAgIGRheXMgPSByb3VuZChob3VycyAvIDI0KSxcbiAgICAgICAgICAgIHllYXJzID0gcm91bmQoZGF5cyAvIDM2NSksXG4gICAgICAgICAgICBhcmdzID0gc2Vjb25kcyA8IHJlbGF0aXZlVGltZVRocmVzaG9sZHMucyAgJiYgWydzJywgc2Vjb25kc10gfHxcbiAgICAgICAgICAgICAgICBtaW51dGVzID09PSAxICYmIFsnbSddIHx8XG4gICAgICAgICAgICAgICAgbWludXRlcyA8IHJlbGF0aXZlVGltZVRocmVzaG9sZHMubSAmJiBbJ21tJywgbWludXRlc10gfHxcbiAgICAgICAgICAgICAgICBob3VycyA9PT0gMSAmJiBbJ2gnXSB8fFxuICAgICAgICAgICAgICAgIGhvdXJzIDwgcmVsYXRpdmVUaW1lVGhyZXNob2xkcy5oICYmIFsnaGgnLCBob3Vyc10gfHxcbiAgICAgICAgICAgICAgICBkYXlzID09PSAxICYmIFsnZCddIHx8XG4gICAgICAgICAgICAgICAgZGF5cyA8PSByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzLmRkICYmIFsnZGQnLCBkYXlzXSB8fFxuICAgICAgICAgICAgICAgIGRheXMgPD0gcmVsYXRpdmVUaW1lVGhyZXNob2xkcy5kbSAmJiBbJ00nXSB8fFxuICAgICAgICAgICAgICAgIGRheXMgPCByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzLmR5ICYmIFsnTU0nLCByb3VuZChkYXlzIC8gMzApXSB8fFxuICAgICAgICAgICAgICAgIHllYXJzID09PSAxICYmIFsneSddIHx8IFsneXknLCB5ZWFyc107XG4gICAgICAgIGFyZ3NbMl0gPSB3aXRob3V0U3VmZml4O1xuICAgICAgICBhcmdzWzNdID0gbWlsbGlzZWNvbmRzID4gMDtcbiAgICAgICAgYXJnc1s0XSA9IGxhbmc7XG4gICAgICAgIHJldHVybiBzdWJzdGl0dXRlVGltZUFnby5hcHBseSh7fSwgYXJncyk7XG4gICAgfVxuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIFdlZWsgb2YgWWVhclxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgLy8gZmlyc3REYXlPZldlZWsgICAgICAgMCA9IHN1biwgNiA9IHNhdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIHRoZSBkYXkgb2YgdGhlIHdlZWsgdGhhdCBzdGFydHMgdGhlIHdlZWtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAodXN1YWxseSBzdW5kYXkgb3IgbW9uZGF5KVxuICAgIC8vIGZpcnN0RGF5T2ZXZWVrT2ZZZWFyIDAgPSBzdW4sIDYgPSBzYXRcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICB0aGUgZmlyc3Qgd2VlayBpcyB0aGUgd2VlayB0aGF0IGNvbnRhaW5zIHRoZSBmaXJzdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIG9mIHRoaXMgZGF5IG9mIHRoZSB3ZWVrXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgKGVnLiBJU08gd2Vla3MgdXNlIHRodXJzZGF5ICg0KSlcbiAgICBmdW5jdGlvbiB3ZWVrT2ZZZWFyKG1vbSwgZmlyc3REYXlPZldlZWssIGZpcnN0RGF5T2ZXZWVrT2ZZZWFyKSB7XG4gICAgICAgIHZhciBlbmQgPSBmaXJzdERheU9mV2Vla09mWWVhciAtIGZpcnN0RGF5T2ZXZWVrLFxuICAgICAgICAgICAgZGF5c1RvRGF5T2ZXZWVrID0gZmlyc3REYXlPZldlZWtPZlllYXIgLSBtb20uZGF5KCksXG4gICAgICAgICAgICBhZGp1c3RlZE1vbWVudDtcblxuXG4gICAgICAgIGlmIChkYXlzVG9EYXlPZldlZWsgPiBlbmQpIHtcbiAgICAgICAgICAgIGRheXNUb0RheU9mV2VlayAtPSA3O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRheXNUb0RheU9mV2VlayA8IGVuZCAtIDcpIHtcbiAgICAgICAgICAgIGRheXNUb0RheU9mV2VlayArPSA3O1xuICAgICAgICB9XG5cbiAgICAgICAgYWRqdXN0ZWRNb21lbnQgPSBtb21lbnQobW9tKS5hZGQoJ2QnLCBkYXlzVG9EYXlPZldlZWspO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2VlazogTWF0aC5jZWlsKGFkanVzdGVkTW9tZW50LmRheU9mWWVhcigpIC8gNyksXG4gICAgICAgICAgICB5ZWFyOiBhZGp1c3RlZE1vbWVudC55ZWFyKClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvL2h0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSVNPX3dlZWtfZGF0ZSNDYWxjdWxhdGluZ19hX2RhdGVfZ2l2ZW5fdGhlX3llYXIuMkNfd2Vla19udW1iZXJfYW5kX3dlZWtkYXlcbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla3MoeWVhciwgd2Vlaywgd2Vla2RheSwgZmlyc3REYXlPZldlZWtPZlllYXIsIGZpcnN0RGF5T2ZXZWVrKSB7XG4gICAgICAgIHZhciBkID0gbWFrZVVUQ0RhdGUoeWVhciwgMCwgMSkuZ2V0VVRDRGF5KCksIGRheXNUb0FkZCwgZGF5T2ZZZWFyO1xuXG4gICAgICAgIGQgPSBkID09PSAwID8gNyA6IGQ7XG4gICAgICAgIHdlZWtkYXkgPSB3ZWVrZGF5ICE9IG51bGwgPyB3ZWVrZGF5IDogZmlyc3REYXlPZldlZWs7XG4gICAgICAgIGRheXNUb0FkZCA9IGZpcnN0RGF5T2ZXZWVrIC0gZCArIChkID4gZmlyc3REYXlPZldlZWtPZlllYXIgPyA3IDogMCkgLSAoZCA8IGZpcnN0RGF5T2ZXZWVrID8gNyA6IDApO1xuICAgICAgICBkYXlPZlllYXIgPSA3ICogKHdlZWsgLSAxKSArICh3ZWVrZGF5IC0gZmlyc3REYXlPZldlZWspICsgZGF5c1RvQWRkICsgMTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeWVhcjogZGF5T2ZZZWFyID4gMCA/IHllYXIgOiB5ZWFyIC0gMSxcbiAgICAgICAgICAgIGRheU9mWWVhcjogZGF5T2ZZZWFyID4gMCA/ICBkYXlPZlllYXIgOiBkYXlzSW5ZZWFyKHllYXIgLSAxKSArIGRheU9mWWVhclxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgVG9wIExldmVsIEZ1bmN0aW9uc1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIGZ1bmN0aW9uIG1ha2VNb21lbnQoY29uZmlnKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IGNvbmZpZy5faSxcbiAgICAgICAgICAgIGZvcm1hdCA9IGNvbmZpZy5fZjtcblxuICAgICAgICBpZiAoaW5wdXQgPT09IG51bGwgfHwgKGZvcm1hdCA9PT0gdW5kZWZpbmVkICYmIGlucHV0ID09PSAnJykpIHtcbiAgICAgICAgICAgIHJldHVybiBtb21lbnQuaW52YWxpZCh7bnVsbElucHV0OiB0cnVlfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uZmlnLl9pID0gaW5wdXQgPSBnZXRMYW5nRGVmaW5pdGlvbigpLnByZXBhcnNlKGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb21lbnQuaXNNb21lbnQoaW5wdXQpKSB7XG4gICAgICAgICAgICBjb25maWcgPSBjbG9uZU1vbWVudChpbnB1dCk7XG5cbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCtpbnB1dC5fZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0KSB7XG4gICAgICAgICAgICBpZiAoaXNBcnJheShmb3JtYXQpKSB7XG4gICAgICAgICAgICAgICAgbWFrZURhdGVGcm9tU3RyaW5nQW5kQXJyYXkoY29uZmlnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWFrZURhdGVGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYWtlRGF0ZUZyb21JbnB1dChjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBNb21lbnQoY29uZmlnKTtcbiAgICB9XG5cbiAgICBtb21lbnQgPSBmdW5jdGlvbiAoaW5wdXQsIGZvcm1hdCwgbGFuZywgc3RyaWN0KSB7XG4gICAgICAgIHZhciBjO1xuXG4gICAgICAgIGlmICh0eXBlb2YobGFuZykgPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICBzdHJpY3QgPSBsYW5nO1xuICAgICAgICAgICAgbGFuZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICAvLyBvYmplY3QgY29uc3RydWN0aW9uIG11c3QgYmUgZG9uZSB0aGlzIHdheS5cbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE0MjNcbiAgICAgICAgYyA9IHt9O1xuICAgICAgICBjLl9pc0FNb21lbnRPYmplY3QgPSB0cnVlO1xuICAgICAgICBjLl9pID0gaW5wdXQ7XG4gICAgICAgIGMuX2YgPSBmb3JtYXQ7XG4gICAgICAgIGMuX2wgPSBsYW5nO1xuICAgICAgICBjLl9zdHJpY3QgPSBzdHJpY3Q7XG4gICAgICAgIGMuX2lzVVRDID0gZmFsc2U7XG4gICAgICAgIGMuX3BmID0gZGVmYXVsdFBhcnNpbmdGbGFncygpO1xuXG4gICAgICAgIHJldHVybiBtYWtlTW9tZW50KGMpO1xuICAgIH07XG5cbiAgICBtb21lbnQuc3VwcHJlc3NEZXByZWNhdGlvbldhcm5pbmdzID0gZmFsc2U7XG5cbiAgICBtb21lbnQuY3JlYXRlRnJvbUlucHV0RmFsbGJhY2sgPSBkZXByZWNhdGUoXG4gICAgICAgICAgICBcIm1vbWVudCBjb25zdHJ1Y3Rpb24gZmFsbHMgYmFjayB0byBqcyBEYXRlLiBUaGlzIGlzIFwiICtcbiAgICAgICAgICAgIFwiZGlzY291cmFnZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB1cGNvbWluZyBtYWpvciBcIiArXG4gICAgICAgICAgICBcInJlbGVhc2UuIFBsZWFzZSByZWZlciB0byBcIiArXG4gICAgICAgICAgICBcImh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNDA3IGZvciBtb3JlIGluZm8uXCIsXG4gICAgICAgICAgICBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGNvbmZpZy5faSk7XG4gICAgfSk7XG5cbiAgICAvLyBQaWNrIGEgbW9tZW50IG0gZnJvbSBtb21lbnRzIHNvIHRoYXQgbVtmbl0ob3RoZXIpIGlzIHRydWUgZm9yIGFsbFxuICAgIC8vIG90aGVyLiBUaGlzIHJlbGllcyBvbiB0aGUgZnVuY3Rpb24gZm4gdG8gYmUgdHJhbnNpdGl2ZS5cbiAgICAvL1xuICAgIC8vIG1vbWVudHMgc2hvdWxkIGVpdGhlciBiZSBhbiBhcnJheSBvZiBtb21lbnQgb2JqZWN0cyBvciBhbiBhcnJheSwgd2hvc2VcbiAgICAvLyBmaXJzdCBlbGVtZW50IGlzIGFuIGFycmF5IG9mIG1vbWVudCBvYmplY3RzLlxuICAgIGZ1bmN0aW9uIHBpY2tCeShmbiwgbW9tZW50cykge1xuICAgICAgICB2YXIgcmVzLCBpO1xuICAgICAgICBpZiAobW9tZW50cy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShtb21lbnRzWzBdKSkge1xuICAgICAgICAgICAgbW9tZW50cyA9IG1vbWVudHNbMF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtb21lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlcyA9IG1vbWVudHNbMF07XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBtb21lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAobW9tZW50c1tpXVtmbl0ocmVzKSkge1xuICAgICAgICAgICAgICAgIHJlcyA9IG1vbWVudHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBtb21lbnQubWluID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0JlZm9yZScsIGFyZ3MpO1xuICAgIH07XG5cbiAgICBtb21lbnQubWF4ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0FmdGVyJywgYXJncyk7XG4gICAgfTtcblxuICAgIC8vIGNyZWF0aW5nIHdpdGggdXRjXG4gICAgbW9tZW50LnV0YyA9IGZ1bmN0aW9uIChpbnB1dCwgZm9ybWF0LCBsYW5nLCBzdHJpY3QpIHtcbiAgICAgICAgdmFyIGM7XG5cbiAgICAgICAgaWYgKHR5cGVvZihsYW5nKSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICAgIHN0cmljdCA9IGxhbmc7XG4gICAgICAgICAgICBsYW5nID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9iamVjdCBjb25zdHJ1Y3Rpb24gbXVzdCBiZSBkb25lIHRoaXMgd2F5LlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTQyM1xuICAgICAgICBjID0ge307XG4gICAgICAgIGMuX2lzQU1vbWVudE9iamVjdCA9IHRydWU7XG4gICAgICAgIGMuX3VzZVVUQyA9IHRydWU7XG4gICAgICAgIGMuX2lzVVRDID0gdHJ1ZTtcbiAgICAgICAgYy5fbCA9IGxhbmc7XG4gICAgICAgIGMuX2kgPSBpbnB1dDtcbiAgICAgICAgYy5fZiA9IGZvcm1hdDtcbiAgICAgICAgYy5fc3RyaWN0ID0gc3RyaWN0O1xuICAgICAgICBjLl9wZiA9IGRlZmF1bHRQYXJzaW5nRmxhZ3MoKTtcblxuICAgICAgICByZXR1cm4gbWFrZU1vbWVudChjKS51dGMoKTtcbiAgICB9O1xuXG4gICAgLy8gY3JlYXRpbmcgd2l0aCB1bml4IHRpbWVzdGFtcCAoaW4gc2Vjb25kcylcbiAgICBtb21lbnQudW5peCA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICByZXR1cm4gbW9tZW50KGlucHV0ICogMTAwMCk7XG4gICAgfTtcblxuICAgIC8vIGR1cmF0aW9uXG4gICAgbW9tZW50LmR1cmF0aW9uID0gZnVuY3Rpb24gKGlucHV0LCBrZXkpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gaW5wdXQsXG4gICAgICAgICAgICAvLyBtYXRjaGluZyBhZ2FpbnN0IHJlZ2V4cCBpcyBleHBlbnNpdmUsIGRvIGl0IG9uIGRlbWFuZFxuICAgICAgICAgICAgbWF0Y2ggPSBudWxsLFxuICAgICAgICAgICAgc2lnbixcbiAgICAgICAgICAgIHJldCxcbiAgICAgICAgICAgIHBhcnNlSXNvO1xuXG4gICAgICAgIGlmIChtb21lbnQuaXNEdXJhdGlvbihpbnB1dCkpIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIG1zOiBpbnB1dC5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgICAgIGQ6IGlucHV0Ll9kYXlzLFxuICAgICAgICAgICAgICAgIE06IGlucHV0Ll9tb250aHNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbltrZXldID0gaW5wdXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uLm1pbGxpc2Vjb25kcyA9IGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCEhKG1hdGNoID0gYXNwTmV0VGltZVNwYW5Kc29uUmVnZXguZXhlYyhpbnB1dCkpKSB7XG4gICAgICAgICAgICBzaWduID0gKG1hdGNoWzFdID09PSBcIi1cIikgPyAtMSA6IDE7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgICAgIGQ6IHRvSW50KG1hdGNoW0RBVEVdKSAqIHNpZ24sXG4gICAgICAgICAgICAgICAgaDogdG9JbnQobWF0Y2hbSE9VUl0pICogc2lnbixcbiAgICAgICAgICAgICAgICBtOiB0b0ludChtYXRjaFtNSU5VVEVdKSAqIHNpZ24sXG4gICAgICAgICAgICAgICAgczogdG9JbnQobWF0Y2hbU0VDT05EXSkgKiBzaWduLFxuICAgICAgICAgICAgICAgIG1zOiB0b0ludChtYXRjaFtNSUxMSVNFQ09ORF0pICogc2lnblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICghIShtYXRjaCA9IGlzb0R1cmF0aW9uUmVnZXguZXhlYyhpbnB1dCkpKSB7XG4gICAgICAgICAgICBzaWduID0gKG1hdGNoWzFdID09PSBcIi1cIikgPyAtMSA6IDE7XG4gICAgICAgICAgICBwYXJzZUlzbyA9IGZ1bmN0aW9uIChpbnApIHtcbiAgICAgICAgICAgICAgICAvLyBXZSdkIG5vcm1hbGx5IHVzZSB+fmlucCBmb3IgdGhpcywgYnV0IHVuZm9ydHVuYXRlbHkgaXQgYWxzb1xuICAgICAgICAgICAgICAgIC8vIGNvbnZlcnRzIGZsb2F0cyB0byBpbnRzLlxuICAgICAgICAgICAgICAgIC8vIGlucCBtYXkgYmUgdW5kZWZpbmVkLCBzbyBjYXJlZnVsIGNhbGxpbmcgcmVwbGFjZSBvbiBpdC5cbiAgICAgICAgICAgICAgICB2YXIgcmVzID0gaW5wICYmIHBhcnNlRmxvYXQoaW5wLnJlcGxhY2UoJywnLCAnLicpKTtcbiAgICAgICAgICAgICAgICAvLyBhcHBseSBzaWduIHdoaWxlIHdlJ3JlIGF0IGl0XG4gICAgICAgICAgICAgICAgcmV0dXJuIChpc05hTihyZXMpID8gMCA6IHJlcykgKiBzaWduO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIHk6IHBhcnNlSXNvKG1hdGNoWzJdKSxcbiAgICAgICAgICAgICAgICBNOiBwYXJzZUlzbyhtYXRjaFszXSksXG4gICAgICAgICAgICAgICAgZDogcGFyc2VJc28obWF0Y2hbNF0pLFxuICAgICAgICAgICAgICAgIGg6IHBhcnNlSXNvKG1hdGNoWzVdKSxcbiAgICAgICAgICAgICAgICBtOiBwYXJzZUlzbyhtYXRjaFs2XSksXG4gICAgICAgICAgICAgICAgczogcGFyc2VJc28obWF0Y2hbN10pLFxuICAgICAgICAgICAgICAgIHc6IHBhcnNlSXNvKG1hdGNoWzhdKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldCA9IG5ldyBEdXJhdGlvbihkdXJhdGlvbik7XG5cbiAgICAgICAgaWYgKG1vbWVudC5pc0R1cmF0aW9uKGlucHV0KSAmJiBpbnB1dC5oYXNPd25Qcm9wZXJ0eSgnX2xhbmcnKSkge1xuICAgICAgICAgICAgcmV0Ll9sYW5nID0gaW5wdXQuX2xhbmc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG5cbiAgICAvLyB2ZXJzaW9uIG51bWJlclxuICAgIG1vbWVudC52ZXJzaW9uID0gVkVSU0lPTjtcblxuICAgIC8vIGRlZmF1bHQgZm9ybWF0XG4gICAgbW9tZW50LmRlZmF1bHRGb3JtYXQgPSBpc29Gb3JtYXQ7XG5cbiAgICAvLyBjb25zdGFudCB0aGF0IHJlZmVycyB0byB0aGUgSVNPIHN0YW5kYXJkXG4gICAgbW9tZW50LklTT184NjAxID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAvLyBQbHVnaW5zIHRoYXQgYWRkIHByb3BlcnRpZXMgc2hvdWxkIGFsc28gYWRkIHRoZSBrZXkgaGVyZSAobnVsbCB2YWx1ZSksXG4gICAgLy8gc28gd2UgY2FuIHByb3Blcmx5IGNsb25lIG91cnNlbHZlcy5cbiAgICBtb21lbnQubW9tZW50UHJvcGVydGllcyA9IG1vbWVudFByb3BlcnRpZXM7XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyIGEgbW9tZW50IGlzIG11dGF0ZWQuXG4gICAgLy8gSXQgaXMgaW50ZW5kZWQgdG8ga2VlcCB0aGUgb2Zmc2V0IGluIHN5bmMgd2l0aCB0aGUgdGltZXpvbmUuXG4gICAgbW9tZW50LnVwZGF0ZU9mZnNldCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgeW91IHRvIHNldCBhIHRocmVzaG9sZCBmb3IgcmVsYXRpdmUgdGltZSBzdHJpbmdzXG4gICAgbW9tZW50LnJlbGF0aXZlVGltZVRocmVzaG9sZCA9IGZ1bmN0aW9uKHRocmVzaG9sZCwgbGltaXQpIHtcbiAgICAgIGlmIChyZWxhdGl2ZVRpbWVUaHJlc2hvbGRzW3RocmVzaG9sZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzW3RocmVzaG9sZF0gPSBsaW1pdDtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgbG9hZCBsYW5ndWFnZXMgYW5kIHRoZW4gc2V0IHRoZSBnbG9iYWwgbGFuZ3VhZ2UuICBJZlxuICAgIC8vIG5vIGFyZ3VtZW50cyBhcmUgcGFzc2VkIGluLCBpdCB3aWxsIHNpbXBseSByZXR1cm4gdGhlIGN1cnJlbnQgZ2xvYmFsXG4gICAgLy8gbGFuZ3VhZ2Uga2V5LlxuICAgIG1vbWVudC5sYW5nID0gZnVuY3Rpb24gKGtleSwgdmFsdWVzKSB7XG4gICAgICAgIHZhciByO1xuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudC5mbi5fbGFuZy5fYWJicjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgICAgICBsb2FkTGFuZyhub3JtYWxpemVMYW5ndWFnZShrZXkpLCB2YWx1ZXMpO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdW5sb2FkTGFuZyhrZXkpO1xuICAgICAgICAgICAga2V5ID0gJ2VuJztcbiAgICAgICAgfSBlbHNlIGlmICghbGFuZ3VhZ2VzW2tleV0pIHtcbiAgICAgICAgICAgIGdldExhbmdEZWZpbml0aW9uKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgciA9IG1vbWVudC5kdXJhdGlvbi5mbi5fbGFuZyA9IG1vbWVudC5mbi5fbGFuZyA9IGdldExhbmdEZWZpbml0aW9uKGtleSk7XG4gICAgICAgIHJldHVybiByLl9hYmJyO1xuICAgIH07XG5cbiAgICAvLyByZXR1cm5zIGxhbmd1YWdlIGRhdGFcbiAgICBtb21lbnQubGFuZ0RhdGEgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmIChrZXkgJiYga2V5Ll9sYW5nICYmIGtleS5fbGFuZy5fYWJicikge1xuICAgICAgICAgICAga2V5ID0ga2V5Ll9sYW5nLl9hYmJyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnZXRMYW5nRGVmaW5pdGlvbihrZXkpO1xuICAgIH07XG5cbiAgICAvLyBjb21wYXJlIG1vbWVudCBvYmplY3RcbiAgICBtb21lbnQuaXNNb21lbnQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBNb21lbnQgfHxcbiAgICAgICAgICAgIChvYmogIT0gbnVsbCAmJiAgb2JqLmhhc093blByb3BlcnR5KCdfaXNBTW9tZW50T2JqZWN0JykpO1xuICAgIH07XG5cbiAgICAvLyBmb3IgdHlwZWNoZWNraW5nIER1cmF0aW9uIG9iamVjdHNcbiAgICBtb21lbnQuaXNEdXJhdGlvbiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIER1cmF0aW9uO1xuICAgIH07XG5cbiAgICBmb3IgKGkgPSBsaXN0cy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICBtYWtlTGlzdChsaXN0c1tpXSk7XG4gICAgfVxuXG4gICAgbW9tZW50Lm5vcm1hbGl6ZVVuaXRzID0gZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgICAgIHJldHVybiBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgfTtcblxuICAgIG1vbWVudC5pbnZhbGlkID0gZnVuY3Rpb24gKGZsYWdzKSB7XG4gICAgICAgIHZhciBtID0gbW9tZW50LnV0YyhOYU4pO1xuICAgICAgICBpZiAoZmxhZ3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgZXh0ZW5kKG0uX3BmLCBmbGFncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtLl9wZi51c2VySW52YWxpZGF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfTtcblxuICAgIG1vbWVudC5wYXJzZVpvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBtb21lbnQuYXBwbHkobnVsbCwgYXJndW1lbnRzKS5wYXJzZVpvbmUoKTtcbiAgICB9O1xuXG4gICAgbW9tZW50LnBhcnNlVHdvRGlnaXRZZWFyID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0b0ludChpbnB1dCkgKyAodG9JbnQoaW5wdXQpID4gNjggPyAxOTAwIDogMjAwMCk7XG4gICAgfTtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgTW9tZW50IFByb3RvdHlwZVxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgZXh0ZW5kKG1vbWVudC5mbiA9IE1vbWVudC5wcm90b3R5cGUsIHtcblxuICAgICAgICBjbG9uZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBtb21lbnQodGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdmFsdWVPZiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiArdGhpcy5fZCArICgodGhpcy5fb2Zmc2V0IHx8IDApICogNjAwMDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVuaXggOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigrdGhpcyAvIDEwMDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvU3RyaW5nIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sYW5nKCdlbicpLmZvcm1hdChcImRkZCBNTU0gREQgWVlZWSBISDptbTpzcyBbR01UXVpaXCIpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvRGF0ZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXQgPyBuZXcgRGF0ZSgrdGhpcykgOiB0aGlzLl9kO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvSVNPU3RyaW5nIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG0gPSBtb21lbnQodGhpcykudXRjKCk7XG4gICAgICAgICAgICBpZiAoMCA8IG0ueWVhcigpICYmIG0ueWVhcigpIDw9IDk5OTkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0TW9tZW50KG0sICdZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRNb21lbnQobSwgJ1lZWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1taXScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHRvQXJyYXkgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbSA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIG0ueWVhcigpLFxuICAgICAgICAgICAgICAgIG0ubW9udGgoKSxcbiAgICAgICAgICAgICAgICBtLmRhdGUoKSxcbiAgICAgICAgICAgICAgICBtLmhvdXJzKCksXG4gICAgICAgICAgICAgICAgbS5taW51dGVzKCksXG4gICAgICAgICAgICAgICAgbS5zZWNvbmRzKCksXG4gICAgICAgICAgICAgICAgbS5taWxsaXNlY29uZHMoKVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1ZhbGlkIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQodGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNEU1RTaGlmdGVkIDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICBpZiAodGhpcy5fYSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSAmJiBjb21wYXJlQXJyYXlzKHRoaXMuX2EsICh0aGlzLl9pc1VUQyA/IG1vbWVudC51dGModGhpcy5fYSkgOiBtb21lbnQodGhpcy5fYSkpLnRvQXJyYXkoKSkgPiAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2luZ0ZsYWdzIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGV4dGVuZCh7fSwgdGhpcy5fcGYpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGludmFsaWRBdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BmLm92ZXJmbG93O1xuICAgICAgICB9LFxuXG4gICAgICAgIHV0YyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnpvbmUoMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9jYWwgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnpvbmUoMCk7XG4gICAgICAgICAgICB0aGlzLl9pc1VUQyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZm9ybWF0IDogZnVuY3Rpb24gKGlucHV0U3RyaW5nKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gZm9ybWF0TW9tZW50KHRoaXMsIGlucHV0U3RyaW5nIHx8IG1vbWVudC5kZWZhdWx0Rm9ybWF0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxhbmcoKS5wb3N0Zm9ybWF0KG91dHB1dCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkIDogZnVuY3Rpb24gKGlucHV0LCB2YWwpIHtcbiAgICAgICAgICAgIHZhciBkdXI7XG4gICAgICAgICAgICAvLyBzd2l0Y2ggYXJncyB0byBzdXBwb3J0IGFkZCgncycsIDEpIGFuZCBhZGQoMSwgJ3MnKVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBkdXIgPSBtb21lbnQuZHVyYXRpb24oaXNOYU4oK3ZhbCkgPyAraW5wdXQgOiArdmFsLCBpc05hTigrdmFsKSA/IHZhbCA6IGlucHV0KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGR1ciA9IG1vbWVudC5kdXJhdGlvbigrdmFsLCBpbnB1dCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGR1ciA9IG1vbWVudC5kdXJhdGlvbihpbnB1dCwgdmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZE9yU3VidHJhY3REdXJhdGlvbkZyb21Nb21lbnQodGhpcywgZHVyLCAxKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN1YnRyYWN0IDogZnVuY3Rpb24gKGlucHV0LCB2YWwpIHtcbiAgICAgICAgICAgIHZhciBkdXI7XG4gICAgICAgICAgICAvLyBzd2l0Y2ggYXJncyB0byBzdXBwb3J0IHN1YnRyYWN0KCdzJywgMSkgYW5kIHN1YnRyYWN0KDEsICdzJylcbiAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnICYmIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgZHVyID0gbW9tZW50LmR1cmF0aW9uKGlzTmFOKCt2YWwpID8gK2lucHV0IDogK3ZhbCwgaXNOYU4oK3ZhbCkgPyB2YWwgOiBpbnB1dCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBkdXIgPSBtb21lbnQuZHVyYXRpb24oK3ZhbCwgaW5wdXQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkdXIgPSBtb21lbnQuZHVyYXRpb24oaW5wdXQsIHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGRPclN1YnRyYWN0RHVyYXRpb25Gcm9tTW9tZW50KHRoaXMsIGR1ciwgLTEpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGlmZiA6IGZ1bmN0aW9uIChpbnB1dCwgdW5pdHMsIGFzRmxvYXQpIHtcbiAgICAgICAgICAgIHZhciB0aGF0ID0gbWFrZUFzKGlucHV0LCB0aGlzKSxcbiAgICAgICAgICAgICAgICB6b25lRGlmZiA9ICh0aGlzLnpvbmUoKSAtIHRoYXQuem9uZSgpKSAqIDZlNCxcbiAgICAgICAgICAgICAgICBkaWZmLCBvdXRwdXQ7XG5cbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuXG4gICAgICAgICAgICBpZiAodW5pdHMgPT09ICd5ZWFyJyB8fCB1bml0cyA9PT0gJ21vbnRoJykge1xuICAgICAgICAgICAgICAgIC8vIGF2ZXJhZ2UgbnVtYmVyIG9mIGRheXMgaW4gdGhlIG1vbnRocyBpbiB0aGUgZ2l2ZW4gZGF0ZXNcbiAgICAgICAgICAgICAgICBkaWZmID0gKHRoaXMuZGF5c0luTW9udGgoKSArIHRoYXQuZGF5c0luTW9udGgoKSkgKiA0MzJlNTsgLy8gMjQgKiA2MCAqIDYwICogMTAwMCAvIDJcbiAgICAgICAgICAgICAgICAvLyBkaWZmZXJlbmNlIGluIG1vbnRoc1xuICAgICAgICAgICAgICAgIG91dHB1dCA9ICgodGhpcy55ZWFyKCkgLSB0aGF0LnllYXIoKSkgKiAxMikgKyAodGhpcy5tb250aCgpIC0gdGhhdC5tb250aCgpKTtcbiAgICAgICAgICAgICAgICAvLyBhZGp1c3QgYnkgdGFraW5nIGRpZmZlcmVuY2UgaW4gZGF5cywgYXZlcmFnZSBudW1iZXIgb2YgZGF5c1xuICAgICAgICAgICAgICAgIC8vIGFuZCBkc3QgaW4gdGhlIGdpdmVuIG1vbnRocy5cbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gKCh0aGlzIC0gbW9tZW50KHRoaXMpLnN0YXJ0T2YoJ21vbnRoJykpIC1cbiAgICAgICAgICAgICAgICAgICAgICAgICh0aGF0IC0gbW9tZW50KHRoYXQpLnN0YXJ0T2YoJ21vbnRoJykpKSAvIGRpZmY7XG4gICAgICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2l0aCB6b25lcywgdG8gbmVnYXRlIGFsbCBkc3RcbiAgICAgICAgICAgICAgICBvdXRwdXQgLT0gKCh0aGlzLnpvbmUoKSAtIG1vbWVudCh0aGlzKS5zdGFydE9mKCdtb250aCcpLnpvbmUoKSkgLVxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoYXQuem9uZSgpIC0gbW9tZW50KHRoYXQpLnN0YXJ0T2YoJ21vbnRoJykuem9uZSgpKSkgKiA2ZTQgLyBkaWZmO1xuICAgICAgICAgICAgICAgIGlmICh1bml0cyA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dCA9IG91dHB1dCAvIDEyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGlmZiA9ICh0aGlzIC0gdGhhdCk7XG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gdW5pdHMgPT09ICdzZWNvbmQnID8gZGlmZiAvIDFlMyA6IC8vIDEwMDBcbiAgICAgICAgICAgICAgICAgICAgdW5pdHMgPT09ICdtaW51dGUnID8gZGlmZiAvIDZlNCA6IC8vIDEwMDAgKiA2MFxuICAgICAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ2hvdXInID8gZGlmZiAvIDM2ZTUgOiAvLyAxMDAwICogNjAgKiA2MFxuICAgICAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ2RheScgPyAoZGlmZiAtIHpvbmVEaWZmKSAvIDg2NGU1IDogLy8gMTAwMCAqIDYwICogNjAgKiAyNCwgbmVnYXRlIGRzdFxuICAgICAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ3dlZWsnID8gKGRpZmYgLSB6b25lRGlmZikgLyA2MDQ4ZTUgOiAvLyAxMDAwICogNjAgKiA2MCAqIDI0ICogNywgbmVnYXRlIGRzdFxuICAgICAgICAgICAgICAgICAgICBkaWZmO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFzRmxvYXQgPyBvdXRwdXQgOiBhYnNSb3VuZChvdXRwdXQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZyb20gOiBmdW5jdGlvbiAodGltZSwgd2l0aG91dFN1ZmZpeCkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudC5kdXJhdGlvbih0aGlzLmRpZmYodGltZSkpLmxhbmcodGhpcy5sYW5nKCkuX2FiYnIpLmh1bWFuaXplKCF3aXRob3V0U3VmZml4KTtcbiAgICAgICAgfSxcblxuICAgICAgICBmcm9tTm93IDogZnVuY3Rpb24gKHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZyb20obW9tZW50KCksIHdpdGhvdXRTdWZmaXgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNhbGVuZGFyIDogZnVuY3Rpb24gKHRpbWUpIHtcbiAgICAgICAgICAgIC8vIFdlIHdhbnQgdG8gY29tcGFyZSB0aGUgc3RhcnQgb2YgdG9kYXksIHZzIHRoaXMuXG4gICAgICAgICAgICAvLyBHZXR0aW5nIHN0YXJ0LW9mLXRvZGF5IGRlcGVuZHMgb24gd2hldGhlciB3ZSdyZSB6b25lJ2Qgb3Igbm90LlxuICAgICAgICAgICAgdmFyIG5vdyA9IHRpbWUgfHwgbW9tZW50KCksXG4gICAgICAgICAgICAgICAgc29kID0gbWFrZUFzKG5vdywgdGhpcykuc3RhcnRPZignZGF5JyksXG4gICAgICAgICAgICAgICAgZGlmZiA9IHRoaXMuZGlmZihzb2QsICdkYXlzJywgdHJ1ZSksXG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZGlmZiA8IC02ID8gJ3NhbWVFbHNlJyA6XG4gICAgICAgICAgICAgICAgICAgIGRpZmYgPCAtMSA/ICdsYXN0V2VlaycgOlxuICAgICAgICAgICAgICAgICAgICBkaWZmIDwgMCA/ICdsYXN0RGF5JyA6XG4gICAgICAgICAgICAgICAgICAgIGRpZmYgPCAxID8gJ3NhbWVEYXknIDpcbiAgICAgICAgICAgICAgICAgICAgZGlmZiA8IDIgPyAnbmV4dERheScgOlxuICAgICAgICAgICAgICAgICAgICBkaWZmIDwgNyA/ICduZXh0V2VlaycgOiAnc2FtZUVsc2UnO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0KHRoaXMubGFuZygpLmNhbGVuZGFyKGZvcm1hdCwgdGhpcykpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzTGVhcFllYXIgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNMZWFwWWVhcih0aGlzLnllYXIoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNEU1QgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuem9uZSgpIDwgdGhpcy5jbG9uZSgpLm1vbnRoKDApLnpvbmUoKSB8fFxuICAgICAgICAgICAgICAgIHRoaXMuem9uZSgpIDwgdGhpcy5jbG9uZSgpLm1vbnRoKDUpLnpvbmUoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGF5IDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgZGF5ID0gdGhpcy5faXNVVEMgPyB0aGlzLl9kLmdldFVUQ0RheSgpIDogdGhpcy5fZC5nZXREYXkoKTtcbiAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBwYXJzZVdlZWtkYXkoaW5wdXQsIHRoaXMubGFuZygpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hZGQoeyBkIDogaW5wdXQgLSBkYXkgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbW9udGggOiBtYWtlQWNjZXNzb3IoJ01vbnRoJywgdHJ1ZSksXG5cbiAgICAgICAgc3RhcnRPZjogZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIC8vIHRoZSBmb2xsb3dpbmcgc3dpdGNoIGludGVudGlvbmFsbHkgb21pdHMgYnJlYWsga2V5d29yZHNcbiAgICAgICAgICAgIC8vIHRvIHV0aWxpemUgZmFsbGluZyB0aHJvdWdoIHRoZSBjYXNlcy5cbiAgICAgICAgICAgIHN3aXRjaCAodW5pdHMpIHtcbiAgICAgICAgICAgIGNhc2UgJ3llYXInOlxuICAgICAgICAgICAgICAgIHRoaXMubW9udGgoMCk7XG4gICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgY2FzZSAncXVhcnRlcic6XG4gICAgICAgICAgICBjYXNlICdtb250aCc6XG4gICAgICAgICAgICAgICAgdGhpcy5kYXRlKDEpO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ3dlZWsnOlxuICAgICAgICAgICAgY2FzZSAnaXNvV2Vlayc6XG4gICAgICAgICAgICBjYXNlICdkYXknOlxuICAgICAgICAgICAgICAgIHRoaXMuaG91cnMoMCk7XG4gICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgY2FzZSAnaG91cic6XG4gICAgICAgICAgICAgICAgdGhpcy5taW51dGVzKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ21pbnV0ZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRzKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ3NlY29uZCc6XG4gICAgICAgICAgICAgICAgdGhpcy5taWxsaXNlY29uZHMoMCk7XG4gICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB3ZWVrcyBhcmUgYSBzcGVjaWFsIGNhc2VcbiAgICAgICAgICAgIGlmICh1bml0cyA9PT0gJ3dlZWsnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53ZWVrZGF5KDApO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh1bml0cyA9PT0gJ2lzb1dlZWsnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc29XZWVrZGF5KDEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBxdWFydGVycyBhcmUgYWxzbyBzcGVjaWFsXG4gICAgICAgICAgICBpZiAodW5pdHMgPT09ICdxdWFydGVyJykge1xuICAgICAgICAgICAgICAgIHRoaXMubW9udGgoTWF0aC5mbG9vcih0aGlzLm1vbnRoKCkgLyAzKSAqIDMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBlbmRPZjogZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXJ0T2YodW5pdHMpLmFkZCgodW5pdHMgPT09ICdpc29XZWVrJyA/ICd3ZWVrJyA6IHVuaXRzKSwgMSkuc3VidHJhY3QoJ21zJywgMSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNBZnRlcjogZnVuY3Rpb24gKGlucHV0LCB1bml0cykge1xuICAgICAgICAgICAgdW5pdHMgPSB0eXBlb2YgdW5pdHMgIT09ICd1bmRlZmluZWQnID8gdW5pdHMgOiAnbWlsbGlzZWNvbmQnO1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzLmNsb25lKCkuc3RhcnRPZih1bml0cykgPiArbW9tZW50KGlucHV0KS5zdGFydE9mKHVuaXRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0JlZm9yZTogZnVuY3Rpb24gKGlucHV0LCB1bml0cykge1xuICAgICAgICAgICAgdW5pdHMgPSB0eXBlb2YgdW5pdHMgIT09ICd1bmRlZmluZWQnID8gdW5pdHMgOiAnbWlsbGlzZWNvbmQnO1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzLmNsb25lKCkuc3RhcnRPZih1bml0cykgPCArbW9tZW50KGlucHV0KS5zdGFydE9mKHVuaXRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1NhbWU6IGZ1bmN0aW9uIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgICAgIHVuaXRzID0gdW5pdHMgfHwgJ21zJztcbiAgICAgICAgICAgIHJldHVybiArdGhpcy5jbG9uZSgpLnN0YXJ0T2YodW5pdHMpID09PSArbWFrZUFzKGlucHV0LCB0aGlzKS5zdGFydE9mKHVuaXRzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBtaW46IGRlcHJlY2F0ZShcbiAgICAgICAgICAgICAgICAgXCJtb21lbnQoKS5taW4gaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudC5taW4gaW5zdGVhZC4gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE1NDhcIixcbiAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKG90aGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICBvdGhlciA9IG1vbWVudC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG90aGVyIDwgdGhpcyA/IHRoaXMgOiBvdGhlcjtcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgKSxcblxuICAgICAgICBtYXg6IGRlcHJlY2F0ZShcbiAgICAgICAgICAgICAgICBcIm1vbWVudCgpLm1heCBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50Lm1heCBpbnN0ZWFkLiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTU0OFwiLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChvdGhlcikge1xuICAgICAgICAgICAgICAgICAgICBvdGhlciA9IG1vbWVudC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3RoZXIgPiB0aGlzID8gdGhpcyA6IG90aGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgKSxcblxuICAgICAgICAvLyBrZWVwVGltZSA9IHRydWUgbWVhbnMgb25seSBjaGFuZ2UgdGhlIHRpbWV6b25lLCB3aXRob3V0IGFmZmVjdGluZ1xuICAgICAgICAvLyB0aGUgbG9jYWwgaG91ci4gU28gNTozMToyNiArMDMwMCAtLVt6b25lKDIsIHRydWUpXS0tPiA1OjMxOjI2ICswMjAwXG4gICAgICAgIC8vIEl0IGlzIHBvc3NpYmxlIHRoYXQgNTozMToyNiBkb2Vzbid0IGV4aXN0IGludCB6b25lICswMjAwLCBzbyB3ZVxuICAgICAgICAvLyBhZGp1c3QgdGhlIHRpbWUgYXMgbmVlZGVkLCB0byBiZSB2YWxpZC5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gS2VlcGluZyB0aGUgdGltZSBhY3R1YWxseSBhZGRzL3N1YnRyYWN0cyAob25lIGhvdXIpXG4gICAgICAgIC8vIGZyb20gdGhlIGFjdHVhbCByZXByZXNlbnRlZCB0aW1lLiBUaGF0IGlzIHdoeSB3ZSBjYWxsIHVwZGF0ZU9mZnNldFxuICAgICAgICAvLyBhIHNlY29uZCB0aW1lLiBJbiBjYXNlIGl0IHdhbnRzIHVzIHRvIGNoYW5nZSB0aGUgb2Zmc2V0IGFnYWluXG4gICAgICAgIC8vIF9jaGFuZ2VJblByb2dyZXNzID09IHRydWUgY2FzZSwgdGhlbiB3ZSBoYXZlIHRvIGFkanVzdCwgYmVjYXVzZVxuICAgICAgICAvLyB0aGVyZSBpcyBubyBzdWNoIHRpbWUgaW4gdGhlIGdpdmVuIHRpbWV6b25lLlxuICAgICAgICB6b25lIDogZnVuY3Rpb24gKGlucHV0LCBrZWVwVGltZSkge1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuX29mZnNldCB8fCAwO1xuICAgICAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0ID0gdGltZXpvbmVNaW51dGVzRnJvbVN0cmluZyhpbnB1dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhpbnB1dCkgPCAxNikge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IGlucHV0ICogNjA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX29mZnNldCA9IGlucHV0O1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzVVRDID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAob2Zmc2V0ICE9PSBpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWtlZXBUaW1lIHx8IHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZE9yU3VidHJhY3REdXJhdGlvbkZyb21Nb21lbnQodGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9tZW50LmR1cmF0aW9uKG9mZnNldCAtIGlucHV0LCAnbScpLCAxLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9tZW50LnVwZGF0ZU9mZnNldCh0aGlzLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUluUHJvZ3Jlc3MgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyBvZmZzZXQgOiB0aGlzLl9kLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICB6b25lQWJiciA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/IFwiVVRDXCIgOiBcIlwiO1xuICAgICAgICB9LFxuXG4gICAgICAgIHpvbmVOYW1lIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gXCJDb29yZGluYXRlZCBVbml2ZXJzYWwgVGltZVwiIDogXCJcIjtcbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZVpvbmUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fdHptKSB7XG4gICAgICAgICAgICAgICAgdGhpcy56b25lKHRoaXMuX3R6bSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLl9pID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHRoaXMuem9uZSh0aGlzLl9pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGhhc0FsaWduZWRIb3VyT2Zmc2V0IDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICBpZiAoIWlucHV0KSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBtb21lbnQoaW5wdXQpLnpvbmUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnpvbmUoKSAtIGlucHV0KSAlIDYwID09PSAwO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRheXNJbk1vbnRoIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGRheXNJbk1vbnRoKHRoaXMueWVhcigpLCB0aGlzLm1vbnRoKCkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRheU9mWWVhciA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICAgICAgdmFyIGRheU9mWWVhciA9IHJvdW5kKChtb21lbnQodGhpcykuc3RhcnRPZignZGF5JykgLSBtb21lbnQodGhpcykuc3RhcnRPZigneWVhcicpKSAvIDg2NGU1KSArIDE7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IGRheU9mWWVhciA6IHRoaXMuYWRkKFwiZFwiLCAoaW5wdXQgLSBkYXlPZlllYXIpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBxdWFydGVyIDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IE1hdGguY2VpbCgodGhpcy5tb250aCgpICsgMSkgLyAzKSA6IHRoaXMubW9udGgoKGlucHV0IC0gMSkgKiAzICsgdGhpcy5tb250aCgpICUgMyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2Vla1llYXIgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB5ZWFyID0gd2Vla09mWWVhcih0aGlzLCB0aGlzLmxhbmcoKS5fd2Vlay5kb3csIHRoaXMubGFuZygpLl93ZWVrLmRveSkueWVhcjtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8geWVhciA6IHRoaXMuYWRkKFwieVwiLCAoaW5wdXQgLSB5ZWFyKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNvV2Vla1llYXIgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB5ZWFyID0gd2Vla09mWWVhcih0aGlzLCAxLCA0KS55ZWFyO1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB5ZWFyIDogdGhpcy5hZGQoXCJ5XCIsIChpbnB1dCAtIHllYXIpKTtcbiAgICAgICAgfSxcblxuICAgICAgICB3ZWVrIDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgd2VlayA9IHRoaXMubGFuZygpLndlZWsodGhpcyk7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWsgOiB0aGlzLmFkZChcImRcIiwgKGlucHV0IC0gd2VlaykgKiA3KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc29XZWVrIDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgd2VlayA9IHdlZWtPZlllYXIodGhpcywgMSwgNCkud2VlaztcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2VlayA6IHRoaXMuYWRkKFwiZFwiLCAoaW5wdXQgLSB3ZWVrKSAqIDcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdlZWtkYXkgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB3ZWVrZGF5ID0gKHRoaXMuZGF5KCkgKyA3IC0gdGhpcy5sYW5nKCkuX3dlZWsuZG93KSAlIDc7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWtkYXkgOiB0aGlzLmFkZChcImRcIiwgaW5wdXQgLSB3ZWVrZGF5KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc29XZWVrZGF5IDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICAvLyBiZWhhdmVzIHRoZSBzYW1lIGFzIG1vbWVudCNkYXkgZXhjZXB0XG4gICAgICAgICAgICAvLyBhcyBhIGdldHRlciwgcmV0dXJucyA3IGluc3RlYWQgb2YgMCAoMS03IHJhbmdlIGluc3RlYWQgb2YgMC02KVxuICAgICAgICAgICAgLy8gYXMgYSBzZXR0ZXIsIHN1bmRheSBzaG91bGQgYmVsb25nIHRvIHRoZSBwcmV2aW91cyB3ZWVrLlxuICAgICAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB0aGlzLmRheSgpIHx8IDcgOiB0aGlzLmRheSh0aGlzLmRheSgpICUgNyA/IGlucHV0IDogaW5wdXQgLSA3KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc29XZWVrc0luWWVhciA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB3ZWVrc0luWWVhcih0aGlzLnllYXIoKSwgMSwgNCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2Vla3NJblllYXIgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgd2Vla0luZm8gPSB0aGlzLl9sYW5nLl93ZWVrO1xuICAgICAgICAgICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMueWVhcigpLCB3ZWVrSW5mby5kb3csIHdlZWtJbmZvLmRveSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0IDogZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW3VuaXRzXSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldCA6IGZ1bmN0aW9uICh1bml0cywgdmFsdWUpIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzW3VuaXRzXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRoaXNbdW5pdHNdKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIElmIHBhc3NlZCBhIGxhbmd1YWdlIGtleSwgaXQgd2lsbCBzZXQgdGhlIGxhbmd1YWdlIGZvciB0aGlzXG4gICAgICAgIC8vIGluc3RhbmNlLiAgT3RoZXJ3aXNlLCBpdCB3aWxsIHJldHVybiB0aGUgbGFuZ3VhZ2UgY29uZmlndXJhdGlvblxuICAgICAgICAvLyB2YXJpYWJsZXMgZm9yIHRoaXMgaW5zdGFuY2UuXG4gICAgICAgIGxhbmcgOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbGFuZztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbGFuZyA9IGdldExhbmdEZWZpbml0aW9uKGtleSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHJhd01vbnRoU2V0dGVyKG1vbSwgdmFsdWUpIHtcbiAgICAgICAgdmFyIGRheU9mTW9udGg7XG5cbiAgICAgICAgLy8gVE9ETzogTW92ZSB0aGlzIG91dCBvZiBoZXJlIVxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdmFsdWUgPSBtb20ubGFuZygpLm1vbnRoc1BhcnNlKHZhbHVlKTtcbiAgICAgICAgICAgIC8vIFRPRE86IEFub3RoZXIgc2lsZW50IGZhaWx1cmU/XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBtb207XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkYXlPZk1vbnRoID0gTWF0aC5taW4obW9tLmRhdGUoKSxcbiAgICAgICAgICAgICAgICBkYXlzSW5Nb250aChtb20ueWVhcigpLCB2YWx1ZSkpO1xuICAgICAgICBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgJ01vbnRoJ10odmFsdWUsIGRheU9mTW9udGgpO1xuICAgICAgICByZXR1cm4gbW9tO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJhd0dldHRlcihtb20sIHVuaXQpIHtcbiAgICAgICAgcmV0dXJuIG1vbS5fZFsnZ2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJhd1NldHRlcihtb20sIHVuaXQsIHZhbHVlKSB7XG4gICAgICAgIGlmICh1bml0ID09PSAnTW9udGgnKSB7XG4gICAgICAgICAgICByZXR1cm4gcmF3TW9udGhTZXR0ZXIobW9tLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tLl9kWydzZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArIHVuaXRdKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VBY2Nlc3Nvcih1bml0LCBrZWVwVGltZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJhd1NldHRlcih0aGlzLCB1bml0LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgbW9tZW50LnVwZGF0ZU9mZnNldCh0aGlzLCBrZWVwVGltZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiByYXdHZXR0ZXIodGhpcywgdW5pdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgbW9tZW50LmZuLm1pbGxpc2Vjb25kID0gbW9tZW50LmZuLm1pbGxpc2Vjb25kcyA9IG1ha2VBY2Nlc3NvcignTWlsbGlzZWNvbmRzJywgZmFsc2UpO1xuICAgIG1vbWVudC5mbi5zZWNvbmQgPSBtb21lbnQuZm4uc2Vjb25kcyA9IG1ha2VBY2Nlc3NvcignU2Vjb25kcycsIGZhbHNlKTtcbiAgICBtb21lbnQuZm4ubWludXRlID0gbW9tZW50LmZuLm1pbnV0ZXMgPSBtYWtlQWNjZXNzb3IoJ01pbnV0ZXMnLCBmYWxzZSk7XG4gICAgLy8gU2V0dGluZyB0aGUgaG91ciBzaG91bGQga2VlcCB0aGUgdGltZSwgYmVjYXVzZSB0aGUgdXNlciBleHBsaWNpdGx5XG4gICAgLy8gc3BlY2lmaWVkIHdoaWNoIGhvdXIgaGUgd2FudHMuIFNvIHRyeWluZyB0byBtYWludGFpbiB0aGUgc2FtZSBob3VyIChpblxuICAgIC8vIGEgbmV3IHRpbWV6b25lKSBtYWtlcyBzZW5zZS4gQWRkaW5nL3N1YnRyYWN0aW5nIGhvdXJzIGRvZXMgbm90IGZvbGxvd1xuICAgIC8vIHRoaXMgcnVsZS5cbiAgICBtb21lbnQuZm4uaG91ciA9IG1vbWVudC5mbi5ob3VycyA9IG1ha2VBY2Nlc3NvcignSG91cnMnLCB0cnVlKTtcbiAgICAvLyBtb21lbnQuZm4ubW9udGggaXMgZGVmaW5lZCBzZXBhcmF0ZWx5XG4gICAgbW9tZW50LmZuLmRhdGUgPSBtYWtlQWNjZXNzb3IoJ0RhdGUnLCB0cnVlKTtcbiAgICBtb21lbnQuZm4uZGF0ZXMgPSBkZXByZWNhdGUoXCJkYXRlcyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgZGF0ZSBpbnN0ZWFkLlwiLCBtYWtlQWNjZXNzb3IoJ0RhdGUnLCB0cnVlKSk7XG4gICAgbW9tZW50LmZuLnllYXIgPSBtYWtlQWNjZXNzb3IoJ0Z1bGxZZWFyJywgdHJ1ZSk7XG4gICAgbW9tZW50LmZuLnllYXJzID0gZGVwcmVjYXRlKFwieWVhcnMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIHllYXIgaW5zdGVhZC5cIiwgbWFrZUFjY2Vzc29yKCdGdWxsWWVhcicsIHRydWUpKTtcblxuICAgIC8vIGFkZCBwbHVyYWwgbWV0aG9kc1xuICAgIG1vbWVudC5mbi5kYXlzID0gbW9tZW50LmZuLmRheTtcbiAgICBtb21lbnQuZm4ubW9udGhzID0gbW9tZW50LmZuLm1vbnRoO1xuICAgIG1vbWVudC5mbi53ZWVrcyA9IG1vbWVudC5mbi53ZWVrO1xuICAgIG1vbWVudC5mbi5pc29XZWVrcyA9IG1vbWVudC5mbi5pc29XZWVrO1xuICAgIG1vbWVudC5mbi5xdWFydGVycyA9IG1vbWVudC5mbi5xdWFydGVyO1xuXG4gICAgLy8gYWRkIGFsaWFzZWQgZm9ybWF0IG1ldGhvZHNcbiAgICBtb21lbnQuZm4udG9KU09OID0gbW9tZW50LmZuLnRvSVNPU3RyaW5nO1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBEdXJhdGlvbiBQcm90b3R5cGVcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIGV4dGVuZChtb21lbnQuZHVyYXRpb24uZm4gPSBEdXJhdGlvbi5wcm90b3R5cGUsIHtcblxuICAgICAgICBfYnViYmxlIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG1pbGxpc2Vjb25kcyA9IHRoaXMuX21pbGxpc2Vjb25kcyxcbiAgICAgICAgICAgICAgICBkYXlzID0gdGhpcy5fZGF5cyxcbiAgICAgICAgICAgICAgICBtb250aHMgPSB0aGlzLl9tb250aHMsXG4gICAgICAgICAgICAgICAgZGF0YSA9IHRoaXMuX2RhdGEsXG4gICAgICAgICAgICAgICAgc2Vjb25kcywgbWludXRlcywgaG91cnMsIHllYXJzO1xuXG4gICAgICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGNvZGUgYnViYmxlcyB1cCB2YWx1ZXMsIHNlZSB0aGUgdGVzdHMgZm9yXG4gICAgICAgICAgICAvLyBleGFtcGxlcyBvZiB3aGF0IHRoYXQgbWVhbnMuXG4gICAgICAgICAgICBkYXRhLm1pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kcyAlIDEwMDA7XG5cbiAgICAgICAgICAgIHNlY29uZHMgPSBhYnNSb3VuZChtaWxsaXNlY29uZHMgLyAxMDAwKTtcbiAgICAgICAgICAgIGRhdGEuc2Vjb25kcyA9IHNlY29uZHMgJSA2MDtcblxuICAgICAgICAgICAgbWludXRlcyA9IGFic1JvdW5kKHNlY29uZHMgLyA2MCk7XG4gICAgICAgICAgICBkYXRhLm1pbnV0ZXMgPSBtaW51dGVzICUgNjA7XG5cbiAgICAgICAgICAgIGhvdXJzID0gYWJzUm91bmQobWludXRlcyAvIDYwKTtcbiAgICAgICAgICAgIGRhdGEuaG91cnMgPSBob3VycyAlIDI0O1xuXG4gICAgICAgICAgICBkYXlzICs9IGFic1JvdW5kKGhvdXJzIC8gMjQpO1xuICAgICAgICAgICAgZGF0YS5kYXlzID0gZGF5cyAlIDMwO1xuXG4gICAgICAgICAgICBtb250aHMgKz0gYWJzUm91bmQoZGF5cyAvIDMwKTtcbiAgICAgICAgICAgIGRhdGEubW9udGhzID0gbW9udGhzICUgMTI7XG5cbiAgICAgICAgICAgIHllYXJzID0gYWJzUm91bmQobW9udGhzIC8gMTIpO1xuICAgICAgICAgICAgZGF0YS55ZWFycyA9IHllYXJzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdlZWtzIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGFic1JvdW5kKHRoaXMuZGF5cygpIC8gNyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdmFsdWVPZiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9taWxsaXNlY29uZHMgK1xuICAgICAgICAgICAgICB0aGlzLl9kYXlzICogODY0ZTUgK1xuICAgICAgICAgICAgICAodGhpcy5fbW9udGhzICUgMTIpICogMjU5MmU2ICtcbiAgICAgICAgICAgICAgdG9JbnQodGhpcy5fbW9udGhzIC8gMTIpICogMzE1MzZlNjtcbiAgICAgICAgfSxcblxuICAgICAgICBodW1hbml6ZSA6IGZ1bmN0aW9uICh3aXRoU3VmZml4KSB7XG4gICAgICAgICAgICB2YXIgZGlmZmVyZW5jZSA9ICt0aGlzLFxuICAgICAgICAgICAgICAgIG91dHB1dCA9IHJlbGF0aXZlVGltZShkaWZmZXJlbmNlLCAhd2l0aFN1ZmZpeCwgdGhpcy5sYW5nKCkpO1xuXG4gICAgICAgICAgICBpZiAod2l0aFN1ZmZpeCkge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IHRoaXMubGFuZygpLnBhc3RGdXR1cmUoZGlmZmVyZW5jZSwgb3V0cHV0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFuZygpLnBvc3Rmb3JtYXQob3V0cHV0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBhZGQgOiBmdW5jdGlvbiAoaW5wdXQsIHZhbCkge1xuICAgICAgICAgICAgLy8gc3VwcG9ydHMgb25seSAyLjAtc3R5bGUgYWRkKDEsICdzJykgb3IgYWRkKG1vbWVudClcbiAgICAgICAgICAgIHZhciBkdXIgPSBtb21lbnQuZHVyYXRpb24oaW5wdXQsIHZhbCk7XG5cbiAgICAgICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyArPSBkdXIuX21pbGxpc2Vjb25kcztcbiAgICAgICAgICAgIHRoaXMuX2RheXMgKz0gZHVyLl9kYXlzO1xuICAgICAgICAgICAgdGhpcy5fbW9udGhzICs9IGR1ci5fbW9udGhzO1xuXG4gICAgICAgICAgICB0aGlzLl9idWJibGUoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3VidHJhY3QgOiBmdW5jdGlvbiAoaW5wdXQsIHZhbCkge1xuICAgICAgICAgICAgdmFyIGR1ciA9IG1vbWVudC5kdXJhdGlvbihpbnB1dCwgdmFsKTtcblxuICAgICAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzIC09IGR1ci5fbWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgdGhpcy5fZGF5cyAtPSBkdXIuX2RheXM7XG4gICAgICAgICAgICB0aGlzLl9tb250aHMgLT0gZHVyLl9tb250aHM7XG5cbiAgICAgICAgICAgIHRoaXMuX2J1YmJsZSgpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBnZXQgOiBmdW5jdGlvbiAodW5pdHMpIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbdW5pdHMudG9Mb3dlckNhc2UoKSArICdzJ10oKTtcbiAgICAgICAgfSxcblxuICAgICAgICBhcyA6IGZ1bmN0aW9uICh1bml0cykge1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1snYXMnICsgdW5pdHMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB1bml0cy5zbGljZSgxKSArICdzJ10oKTtcbiAgICAgICAgfSxcblxuICAgICAgICBsYW5nIDogbW9tZW50LmZuLmxhbmcsXG5cbiAgICAgICAgdG9Jc29TdHJpbmcgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBpbnNwaXJlZCBieSBodHRwczovL2dpdGh1Yi5jb20vZG9yZGlsbGUvbW9tZW50LWlzb2R1cmF0aW9uL2Jsb2IvbWFzdGVyL21vbWVudC5pc29kdXJhdGlvbi5qc1xuICAgICAgICAgICAgdmFyIHllYXJzID0gTWF0aC5hYnModGhpcy55ZWFycygpKSxcbiAgICAgICAgICAgICAgICBtb250aHMgPSBNYXRoLmFicyh0aGlzLm1vbnRocygpKSxcbiAgICAgICAgICAgICAgICBkYXlzID0gTWF0aC5hYnModGhpcy5kYXlzKCkpLFxuICAgICAgICAgICAgICAgIGhvdXJzID0gTWF0aC5hYnModGhpcy5ob3VycygpKSxcbiAgICAgICAgICAgICAgICBtaW51dGVzID0gTWF0aC5hYnModGhpcy5taW51dGVzKCkpLFxuICAgICAgICAgICAgICAgIHNlY29uZHMgPSBNYXRoLmFicyh0aGlzLnNlY29uZHMoKSArIHRoaXMubWlsbGlzZWNvbmRzKCkgLyAxMDAwKTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmFzU2Vjb25kcygpKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyB0aGUgc2FtZSBhcyBDIydzIChOb2RhKSBhbmQgcHl0aG9uIChpc29kYXRlKS4uLlxuICAgICAgICAgICAgICAgIC8vIGJ1dCBub3Qgb3RoZXIgSlMgKGdvb2cuZGF0ZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gJ1AwRCc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAodGhpcy5hc1NlY29uZHMoKSA8IDAgPyAnLScgOiAnJykgK1xuICAgICAgICAgICAgICAgICdQJyArXG4gICAgICAgICAgICAgICAgKHllYXJzID8geWVhcnMgKyAnWScgOiAnJykgK1xuICAgICAgICAgICAgICAgIChtb250aHMgPyBtb250aHMgKyAnTScgOiAnJykgK1xuICAgICAgICAgICAgICAgIChkYXlzID8gZGF5cyArICdEJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgKChob3VycyB8fCBtaW51dGVzIHx8IHNlY29uZHMpID8gJ1QnIDogJycpICtcbiAgICAgICAgICAgICAgICAoaG91cnMgPyBob3VycyArICdIJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgKG1pbnV0ZXMgPyBtaW51dGVzICsgJ00nIDogJycpICtcbiAgICAgICAgICAgICAgICAoc2Vjb25kcyA/IHNlY29uZHMgKyAnUycgOiAnJyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIG1ha2VEdXJhdGlvbkdldHRlcihuYW1lKSB7XG4gICAgICAgIG1vbWVudC5kdXJhdGlvbi5mbltuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kYXRhW25hbWVdO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VEdXJhdGlvbkFzR2V0dGVyKG5hbWUsIGZhY3Rvcikge1xuICAgICAgICBtb21lbnQuZHVyYXRpb24uZm5bJ2FzJyArIG5hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzIC8gZmFjdG9yO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZvciAoaSBpbiB1bml0TWlsbGlzZWNvbmRGYWN0b3JzKSB7XG4gICAgICAgIGlmICh1bml0TWlsbGlzZWNvbmRGYWN0b3JzLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgICBtYWtlRHVyYXRpb25Bc0dldHRlcihpLCB1bml0TWlsbGlzZWNvbmRGYWN0b3JzW2ldKTtcbiAgICAgICAgICAgIG1ha2VEdXJhdGlvbkdldHRlcihpLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWFrZUR1cmF0aW9uQXNHZXR0ZXIoJ1dlZWtzJywgNjA0OGU1KTtcbiAgICBtb21lbnQuZHVyYXRpb24uZm4uYXNNb250aHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoK3RoaXMgLSB0aGlzLnllYXJzKCkgKiAzMTUzNmU2KSAvIDI1OTJlNiArIHRoaXMueWVhcnMoKSAqIDEyO1xuICAgIH07XG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgRGVmYXVsdCBMYW5nXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICAvLyBTZXQgZGVmYXVsdCBsYW5ndWFnZSwgb3RoZXIgbGFuZ3VhZ2VzIHdpbGwgaW5oZXJpdCBmcm9tIEVuZ2xpc2guXG4gICAgbW9tZW50LmxhbmcoJ2VuJywge1xuICAgICAgICBvcmRpbmFsIDogZnVuY3Rpb24gKG51bWJlcikge1xuICAgICAgICAgICAgdmFyIGIgPSBudW1iZXIgJSAxMCxcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSAodG9JbnQobnVtYmVyICUgMTAwIC8gMTApID09PSAxKSA/ICd0aCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAxKSA/ICdzdCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAyKSA/ICduZCcgOlxuICAgICAgICAgICAgICAgIChiID09PSAzKSA/ICdyZCcgOiAndGgnO1xuICAgICAgICAgICAgcmV0dXJuIG51bWJlciArIG91dHB1dDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyogRU1CRURfTEFOR1VBR0VTICovXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEV4cG9zaW5nIE1vbWVudFxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIGZ1bmN0aW9uIG1ha2VHbG9iYWwoc2hvdWxkRGVwcmVjYXRlKSB7XG4gICAgICAgIC8qZ2xvYmFsIGVuZGVyOmZhbHNlICovXG4gICAgICAgIGlmICh0eXBlb2YgZW5kZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgb2xkR2xvYmFsTW9tZW50ID0gZ2xvYmFsU2NvcGUubW9tZW50O1xuICAgICAgICBpZiAoc2hvdWxkRGVwcmVjYXRlKSB7XG4gICAgICAgICAgICBnbG9iYWxTY29wZS5tb21lbnQgPSBkZXByZWNhdGUoXG4gICAgICAgICAgICAgICAgICAgIFwiQWNjZXNzaW5nIE1vbWVudCB0aHJvdWdoIHRoZSBnbG9iYWwgc2NvcGUgaXMgXCIgK1xuICAgICAgICAgICAgICAgICAgICBcImRlcHJlY2F0ZWQsIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gYW4gdXBjb21pbmcgXCIgK1xuICAgICAgICAgICAgICAgICAgICBcInJlbGVhc2UuXCIsXG4gICAgICAgICAgICAgICAgICAgIG1vbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnbG9iYWxTY29wZS5tb21lbnQgPSBtb21lbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDb21tb25KUyBtb2R1bGUgaXMgZGVmaW5lZFxuICAgIGlmIChoYXNNb2R1bGUpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBtb21lbnQ7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoXCJtb21lbnRcIiwgZnVuY3Rpb24gKHJlcXVpcmUsIGV4cG9ydHMsIG1vZHVsZSkge1xuICAgICAgICAgICAgaWYgKG1vZHVsZS5jb25maWcgJiYgbW9kdWxlLmNvbmZpZygpICYmIG1vZHVsZS5jb25maWcoKS5ub0dsb2JhbCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIC8vIHJlbGVhc2UgdGhlIGdsb2JhbCB2YXJpYWJsZVxuICAgICAgICAgICAgICAgIGdsb2JhbFNjb3BlLm1vbWVudCA9IG9sZEdsb2JhbE1vbWVudDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1vbWVudDtcbiAgICAgICAgfSk7XG4gICAgICAgIG1ha2VHbG9iYWwodHJ1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbWFrZUdsb2JhbCgpO1xuICAgIH1cbn0pLmNhbGwodGhpcyk7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiLy8gICAgIFVuZGVyc2NvcmUuanMgMS42LjBcbi8vICAgICBodHRwOi8vdW5kZXJzY29yZWpzLm9yZ1xuLy8gICAgIChjKSAyMDA5LTIwMTQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbi8vICAgICBVbmRlcnNjb3JlIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG4oZnVuY3Rpb24oKSB7XG5cbiAgLy8gQmFzZWxpbmUgc2V0dXBcbiAgLy8gLS0tLS0tLS0tLS0tLS1cblxuICAvLyBFc3RhYmxpc2ggdGhlIHJvb3Qgb2JqZWN0LCBgd2luZG93YCBpbiB0aGUgYnJvd3Nlciwgb3IgYGV4cG9ydHNgIG9uIHRoZSBzZXJ2ZXIuXG4gIHZhciByb290ID0gdGhpcztcblxuICAvLyBTYXZlIHRoZSBwcmV2aW91cyB2YWx1ZSBvZiB0aGUgYF9gIHZhcmlhYmxlLlxuICB2YXIgcHJldmlvdXNVbmRlcnNjb3JlID0gcm9vdC5fO1xuXG4gIC8vIEVzdGFibGlzaCB0aGUgb2JqZWN0IHRoYXQgZ2V0cyByZXR1cm5lZCB0byBicmVhayBvdXQgb2YgYSBsb29wIGl0ZXJhdGlvbi5cbiAgdmFyIGJyZWFrZXIgPSB7fTtcblxuICAvLyBTYXZlIGJ5dGVzIGluIHRoZSBtaW5pZmllZCAoYnV0IG5vdCBnemlwcGVkKSB2ZXJzaW9uOlxuICB2YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSwgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlLCBGdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbiAgLy8gQ3JlYXRlIHF1aWNrIHJlZmVyZW5jZSB2YXJpYWJsZXMgZm9yIHNwZWVkIGFjY2VzcyB0byBjb3JlIHByb3RvdHlwZXMuXG4gIHZhclxuICAgIHB1c2ggICAgICAgICAgICAgPSBBcnJheVByb3RvLnB1c2gsXG4gICAgc2xpY2UgICAgICAgICAgICA9IEFycmF5UHJvdG8uc2xpY2UsXG4gICAgY29uY2F0ICAgICAgICAgICA9IEFycmF5UHJvdG8uY29uY2F0LFxuICAgIHRvU3RyaW5nICAgICAgICAgPSBPYmpQcm90by50b1N0cmluZyxcbiAgICBoYXNPd25Qcm9wZXJ0eSAgID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbiAgLy8gQWxsICoqRUNNQVNjcmlwdCA1KiogbmF0aXZlIGZ1bmN0aW9uIGltcGxlbWVudGF0aW9ucyB0aGF0IHdlIGhvcGUgdG8gdXNlXG4gIC8vIGFyZSBkZWNsYXJlZCBoZXJlLlxuICB2YXJcbiAgICBuYXRpdmVGb3JFYWNoICAgICAgPSBBcnJheVByb3RvLmZvckVhY2gsXG4gICAgbmF0aXZlTWFwICAgICAgICAgID0gQXJyYXlQcm90by5tYXAsXG4gICAgbmF0aXZlUmVkdWNlICAgICAgID0gQXJyYXlQcm90by5yZWR1Y2UsXG4gICAgbmF0aXZlUmVkdWNlUmlnaHQgID0gQXJyYXlQcm90by5yZWR1Y2VSaWdodCxcbiAgICBuYXRpdmVGaWx0ZXIgICAgICAgPSBBcnJheVByb3RvLmZpbHRlcixcbiAgICBuYXRpdmVFdmVyeSAgICAgICAgPSBBcnJheVByb3RvLmV2ZXJ5LFxuICAgIG5hdGl2ZVNvbWUgICAgICAgICA9IEFycmF5UHJvdG8uc29tZSxcbiAgICBuYXRpdmVJbmRleE9mICAgICAgPSBBcnJheVByb3RvLmluZGV4T2YsXG4gICAgbmF0aXZlTGFzdEluZGV4T2YgID0gQXJyYXlQcm90by5sYXN0SW5kZXhPZixcbiAgICBuYXRpdmVJc0FycmF5ICAgICAgPSBBcnJheS5pc0FycmF5LFxuICAgIG5hdGl2ZUtleXMgICAgICAgICA9IE9iamVjdC5rZXlzLFxuICAgIG5hdGl2ZUJpbmQgICAgICAgICA9IEZ1bmNQcm90by5iaW5kO1xuXG4gIC8vIENyZWF0ZSBhIHNhZmUgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgdXNlIGJlbG93LlxuICB2YXIgXyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogaW5zdGFuY2VvZiBfKSByZXR1cm4gb2JqO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBfKSkgcmV0dXJuIG5ldyBfKG9iaik7XG4gICAgdGhpcy5fd3JhcHBlZCA9IG9iajtcbiAgfTtcblxuICAvLyBFeHBvcnQgdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciAqKk5vZGUuanMqKiwgd2l0aFxuICAvLyBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBmb3IgdGhlIG9sZCBgcmVxdWlyZSgpYCBBUEkuIElmIHdlJ3JlIGluXG4gIC8vIHRoZSBicm93c2VyLCBhZGQgYF9gIGFzIGEgZ2xvYmFsIG9iamVjdCB2aWEgYSBzdHJpbmcgaWRlbnRpZmllcixcbiAgLy8gZm9yIENsb3N1cmUgQ29tcGlsZXIgXCJhZHZhbmNlZFwiIG1vZGUuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IF87XG4gICAgfVxuICAgIGV4cG9ydHMuXyA9IF87XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5fID0gXztcbiAgfVxuXG4gIC8vIEN1cnJlbnQgdmVyc2lvbi5cbiAgXy5WRVJTSU9OID0gJzEuNi4wJztcblxuICAvLyBDb2xsZWN0aW9uIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFRoZSBjb3JuZXJzdG9uZSwgYW4gYGVhY2hgIGltcGxlbWVudGF0aW9uLCBha2EgYGZvckVhY2hgLlxuICAvLyBIYW5kbGVzIG9iamVjdHMgd2l0aCB0aGUgYnVpbHQtaW4gYGZvckVhY2hgLCBhcnJheXMsIGFuZCByYXcgb2JqZWN0cy5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGZvckVhY2hgIGlmIGF2YWlsYWJsZS5cbiAgdmFyIGVhY2ggPSBfLmVhY2ggPSBfLmZvckVhY2ggPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuICAgIGlmIChuYXRpdmVGb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBuYXRpdmVGb3JFYWNoKSB7XG4gICAgICBvYmouZm9yRWFjaChpdGVyYXRvciwgY29udGV4dCk7XG4gICAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmpbaV0sIGksIG9iaikgPT09IGJyZWFrZXIpIHJldHVybjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpdGVyYXRvci5jYWxsKGNvbnRleHQsIG9ialtrZXlzW2ldXSwga2V5c1tpXSwgb2JqKSA9PT0gYnJlYWtlcikgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0b3IgdG8gZWFjaCBlbGVtZW50LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgbWFwYCBpZiBhdmFpbGFibGUuXG4gIF8ubWFwID0gXy5jb2xsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0cztcbiAgICBpZiAobmF0aXZlTWFwICYmIG9iai5tYXAgPT09IG5hdGl2ZU1hcCkgcmV0dXJuIG9iai5tYXAoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJlc3VsdHMucHVzaChpdGVyYXRvci5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIHZhciByZWR1Y2VFcnJvciA9ICdSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJztcblxuICAvLyAqKlJlZHVjZSoqIGJ1aWxkcyB1cCBhIHNpbmdsZSByZXN1bHQgZnJvbSBhIGxpc3Qgb2YgdmFsdWVzLCBha2EgYGluamVjdGAsXG4gIC8vIG9yIGBmb2xkbGAuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGByZWR1Y2VgIGlmIGF2YWlsYWJsZS5cbiAgXy5yZWR1Y2UgPSBfLmZvbGRsID0gXy5pbmplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgdmFyIGluaXRpYWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcbiAgICBpZiAob2JqID09IG51bGwpIG9iaiA9IFtdO1xuICAgIGlmIChuYXRpdmVSZWR1Y2UgJiYgb2JqLnJlZHVjZSA9PT0gbmF0aXZlUmVkdWNlKSB7XG4gICAgICBpZiAoY29udGV4dCkgaXRlcmF0b3IgPSBfLmJpbmQoaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIGluaXRpYWwgPyBvYmoucmVkdWNlKGl0ZXJhdG9yLCBtZW1vKSA6IG9iai5yZWR1Y2UoaXRlcmF0b3IpO1xuICAgIH1cbiAgICBlYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAoIWluaXRpYWwpIHtcbiAgICAgICAgbWVtbyA9IHZhbHVlO1xuICAgICAgICBpbml0aWFsID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRvci5jYWxsKGNvbnRleHQsIG1lbW8sIHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFpbml0aWFsKSB0aHJvdyBuZXcgVHlwZUVycm9yKHJlZHVjZUVycm9yKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfTtcblxuICAvLyBUaGUgcmlnaHQtYXNzb2NpYXRpdmUgdmVyc2lvbiBvZiByZWR1Y2UsIGFsc28ga25vd24gYXMgYGZvbGRyYC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYHJlZHVjZVJpZ2h0YCBpZiBhdmFpbGFibGUuXG4gIF8ucmVkdWNlUmlnaHQgPSBfLmZvbGRyID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRvciwgbWVtbywgY29udGV4dCkge1xuICAgIHZhciBpbml0aWFsID0gYXJndW1lbnRzLmxlbmd0aCA+IDI7XG4gICAgaWYgKG9iaiA9PSBudWxsKSBvYmogPSBbXTtcbiAgICBpZiAobmF0aXZlUmVkdWNlUmlnaHQgJiYgb2JqLnJlZHVjZVJpZ2h0ID09PSBuYXRpdmVSZWR1Y2VSaWdodCkge1xuICAgICAgaWYgKGNvbnRleHQpIGl0ZXJhdG9yID0gXy5iaW5kKGl0ZXJhdG9yLCBjb250ZXh0KTtcbiAgICAgIHJldHVybiBpbml0aWFsID8gb2JqLnJlZHVjZVJpZ2h0KGl0ZXJhdG9yLCBtZW1vKSA6IG9iai5yZWR1Y2VSaWdodChpdGVyYXRvcik7XG4gICAgfVxuICAgIHZhciBsZW5ndGggPSBvYmoubGVuZ3RoO1xuICAgIGlmIChsZW5ndGggIT09ICtsZW5ndGgpIHtcbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB9XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaW5kZXggPSBrZXlzID8ga2V5c1stLWxlbmd0aF0gOiAtLWxlbmd0aDtcbiAgICAgIGlmICghaW5pdGlhbCkge1xuICAgICAgICBtZW1vID0gb2JqW2luZGV4XTtcbiAgICAgICAgaW5pdGlhbCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZW1vID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBtZW1vLCBvYmpbaW5kZXhdLCBpbmRleCwgbGlzdCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFpbml0aWFsKSB0aHJvdyBuZXcgVHlwZUVycm9yKHJlZHVjZUVycm9yKTtcbiAgICByZXR1cm4gbWVtbztcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIGZpcnN0IHZhbHVlIHdoaWNoIHBhc3NlcyBhIHRydXRoIHRlc3QuIEFsaWFzZWQgYXMgYGRldGVjdGAuXG4gIF8uZmluZCA9IF8uZGV0ZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0O1xuICAgIGFueShvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGZpbHRlcmAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBzZWxlY3RgLlxuICBfLmZpbHRlciA9IF8uc2VsZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdHM7XG4gICAgaWYgKG5hdGl2ZUZpbHRlciAmJiBvYmouZmlsdGVyID09PSBuYXRpdmVGaWx0ZXIpIHJldHVybiBvYmouZmlsdGVyKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHMucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGEgdHJ1dGggdGVzdCBmYWlscy5cbiAgXy5yZWplY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmV0dXJuICFwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgIH0sIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIERldGVybWluZSB3aGV0aGVyIGFsbCBvZiB0aGUgZWxlbWVudHMgbWF0Y2ggYSB0cnV0aCB0ZXN0LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgZXZlcnlgIGlmIGF2YWlsYWJsZS5cbiAgLy8gQWxpYXNlZCBhcyBgYWxsYC5cbiAgXy5ldmVyeSA9IF8uYWxsID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgfHwgKHByZWRpY2F0ZSA9IF8uaWRlbnRpdHkpO1xuICAgIHZhciByZXN1bHQgPSB0cnVlO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAobmF0aXZlRXZlcnkgJiYgb2JqLmV2ZXJ5ID09PSBuYXRpdmVFdmVyeSkgcmV0dXJuIG9iai5ldmVyeShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmICghKHJlc3VsdCA9IHJlc3VsdCAmJiBwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpKSkgcmV0dXJuIGJyZWFrZXI7XG4gICAgfSk7XG4gICAgcmV0dXJuICEhcmVzdWx0O1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiBhdCBsZWFzdCBvbmUgZWxlbWVudCBpbiB0aGUgb2JqZWN0IG1hdGNoZXMgYSB0cnV0aCB0ZXN0LlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgc29tZWAgaWYgYXZhaWxhYmxlLlxuICAvLyBBbGlhc2VkIGFzIGBhbnlgLlxuICB2YXIgYW55ID0gXy5zb21lID0gXy5hbnkgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSB8fCAocHJlZGljYXRlID0gXy5pZGVudGl0eSk7XG4gICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAobmF0aXZlU29tZSAmJiBvYmouc29tZSA9PT0gbmF0aXZlU29tZSkgcmV0dXJuIG9iai5zb21lKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHJlc3VsdCB8fCAocmVzdWx0ID0gcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBsaXN0KSkpIHJldHVybiBicmVha2VyO1xuICAgIH0pO1xuICAgIHJldHVybiAhIXJlc3VsdDtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIHZhbHVlICh1c2luZyBgPT09YCkuXG4gIC8vIEFsaWFzZWQgYXMgYGluY2x1ZGVgLlxuICBfLmNvbnRhaW5zID0gXy5pbmNsdWRlID0gZnVuY3Rpb24ob2JqLCB0YXJnZXQpIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICBpZiAobmF0aXZlSW5kZXhPZiAmJiBvYmouaW5kZXhPZiA9PT0gbmF0aXZlSW5kZXhPZikgcmV0dXJuIG9iai5pbmRleE9mKHRhcmdldCkgIT0gLTE7XG4gICAgcmV0dXJuIGFueShvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRhcmdldDtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBJbnZva2UgYSBtZXRob2QgKHdpdGggYXJndW1lbnRzKSBvbiBldmVyeSBpdGVtIGluIGEgY29sbGVjdGlvbi5cbiAgXy5pbnZva2UgPSBmdW5jdGlvbihvYmosIG1ldGhvZCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpc0Z1bmMgPSBfLmlzRnVuY3Rpb24obWV0aG9kKTtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIChpc0Z1bmMgPyBtZXRob2QgOiB2YWx1ZVttZXRob2RdKS5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgXy5wbHVjayA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgXy5wcm9wZXJ0eShrZXkpKTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaWx0ZXJgOiBzZWxlY3Rpbmcgb25seSBvYmplY3RzXG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ud2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgXy5tYXRjaGVzKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmluZGA6IGdldHRpbmcgdGhlIGZpcnN0IG9iamVjdFxuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmZpbmRXaGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy5maW5kKG9iaiwgXy5tYXRjaGVzKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGVsZW1lbnQgb3IgKGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICAvLyBDYW4ndCBvcHRpbWl6ZSBhcnJheXMgb2YgaW50ZWdlcnMgbG9uZ2VyIHRoYW4gNjUsNTM1IGVsZW1lbnRzLlxuICAvLyBTZWUgW1dlYktpdCBCdWcgODA3OTddKGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD04MDc5NylcbiAgXy5tYXggPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKCFpdGVyYXRvciAmJiBfLmlzQXJyYXkob2JqKSAmJiBvYmpbMF0gPT09ICtvYmpbMF0gJiYgb2JqLmxlbmd0aCA8IDY1NTM1KSB7XG4gICAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkoTWF0aCwgb2JqKTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IC1JbmZpbml0eSwgbGFzdENvbXB1dGVkID0gLUluZmluaXR5O1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHZhciBjb21wdXRlZCA9IGl0ZXJhdG9yID8gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpIDogdmFsdWU7XG4gICAgICBpZiAoY29tcHV0ZWQgPiBsYXN0Q29tcHV0ZWQpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtaW5pbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1pbiA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICBpZiAoIWl0ZXJhdG9yICYmIF8uaXNBcnJheShvYmopICYmIG9ialswXSA9PT0gK29ialswXSAmJiBvYmoubGVuZ3RoIDwgNjU1MzUpIHtcbiAgICAgIHJldHVybiBNYXRoLm1pbi5hcHBseShNYXRoLCBvYmopO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IEluZmluaXR5O1xuICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHZhciBjb21wdXRlZCA9IGl0ZXJhdG9yID8gaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpIDogdmFsdWU7XG4gICAgICBpZiAoY29tcHV0ZWQgPCBsYXN0Q29tcHV0ZWQpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gU2h1ZmZsZSBhbiBhcnJheSwgdXNpbmcgdGhlIG1vZGVybiB2ZXJzaW9uIG9mIHRoZVxuICAvLyBbRmlzaGVyLVlhdGVzIHNodWZmbGVdKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRmlzaGVy4oCTWWF0ZXNfc2h1ZmZsZSkuXG4gIF8uc2h1ZmZsZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByYW5kO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHNodWZmbGVkID0gW107XG4gICAgZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByYW5kID0gXy5yYW5kb20oaW5kZXgrKyk7XG4gICAgICBzaHVmZmxlZFtpbmRleCAtIDFdID0gc2h1ZmZsZWRbcmFuZF07XG4gICAgICBzaHVmZmxlZFtyYW5kXSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIHJldHVybiBzaHVmZmxlZDtcbiAgfTtcblxuICAvLyBTYW1wbGUgKipuKiogcmFuZG9tIHZhbHVlcyBmcm9tIGEgY29sbGVjdGlvbi5cbiAgLy8gSWYgKipuKiogaXMgbm90IHNwZWNpZmllZCwgcmV0dXJucyBhIHNpbmdsZSByYW5kb20gZWxlbWVudC5cbiAgLy8gVGhlIGludGVybmFsIGBndWFyZGAgYXJndW1lbnQgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgbWFwYC5cbiAgXy5zYW1wbGUgPSBmdW5jdGlvbihvYmosIG4sIGd1YXJkKSB7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkge1xuICAgICAgaWYgKG9iai5sZW5ndGggIT09ICtvYmoubGVuZ3RoKSBvYmogPSBfLnZhbHVlcyhvYmopO1xuICAgICAgcmV0dXJuIG9ialtfLnJhbmRvbShvYmoubGVuZ3RoIC0gMSldO1xuICAgIH1cbiAgICByZXR1cm4gXy5zaHVmZmxlKG9iaikuc2xpY2UoMCwgTWF0aC5tYXgoMCwgbikpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGxvb2t1cCBpdGVyYXRvcnMuXG4gIHZhciBsb29rdXBJdGVyYXRvciA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHJldHVybiBfLmlkZW50aXR5O1xuICAgIGlmIChfLmlzRnVuY3Rpb24odmFsdWUpKSByZXR1cm4gdmFsdWU7XG4gICAgcmV0dXJuIF8ucHJvcGVydHkodmFsdWUpO1xuICB9O1xuXG4gIC8vIFNvcnQgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiBwcm9kdWNlZCBieSBhbiBpdGVyYXRvci5cbiAgXy5zb3J0QnkgPSBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcihpdGVyYXRvcik7XG4gICAgcmV0dXJuIF8ucGx1Y2soXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICBjcml0ZXJpYTogaXRlcmF0b3IuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGxpc3QpXG4gICAgICB9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYTtcbiAgICAgIHZhciBiID0gcmlnaHQuY3JpdGVyaWE7XG4gICAgICBpZiAoYSAhPT0gYikge1xuICAgICAgICBpZiAoYSA+IGIgfHwgYSA9PT0gdm9pZCAwKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGEgPCBiIHx8IGIgPT09IHZvaWQgMCkgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxlZnQuaW5kZXggLSByaWdodC5pbmRleDtcbiAgICB9KSwgJ3ZhbHVlJyk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdXNlZCBmb3IgYWdncmVnYXRlIFwiZ3JvdXAgYnlcIiBvcGVyYXRpb25zLlxuICB2YXIgZ3JvdXAgPSBmdW5jdGlvbihiZWhhdmlvcikge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICBpdGVyYXRvciA9IGxvb2t1cEl0ZXJhdG9yKGl0ZXJhdG9yKTtcbiAgICAgIGVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGtleSA9IGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBvYmopO1xuICAgICAgICBiZWhhdmlvcihyZXN1bHQsIGtleSwgdmFsdWUpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuICAvLyB0byBncm91cCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNyaXRlcmlvbi5cbiAgXy5ncm91cEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCBrZXksIHZhbHVlKSB7XG4gICAgXy5oYXMocmVzdWx0LCBrZXkpID8gcmVzdWx0W2tleV0ucHVzaCh2YWx1ZSkgOiByZXN1bHRba2V5XSA9IFt2YWx1ZV07XG4gIH0pO1xuXG4gIC8vIEluZGV4ZXMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiwgc2ltaWxhciB0byBgZ3JvdXBCeWAsIGJ1dCBmb3JcbiAgLy8gd2hlbiB5b3Uga25vdyB0aGF0IHlvdXIgaW5kZXggdmFsdWVzIHdpbGwgYmUgdW5pcXVlLlxuICBfLmluZGV4QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIGtleSwgdmFsdWUpIHtcbiAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICB9KTtcblxuICAvLyBDb3VudHMgaW5zdGFuY2VzIG9mIGFuIG9iamVjdCB0aGF0IGdyb3VwIGJ5IGEgY2VydGFpbiBjcml0ZXJpb24uIFBhc3NcbiAgLy8gZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZSB0byBjb3VudCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlXG4gIC8vIGNyaXRlcmlvbi5cbiAgXy5jb3VudEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCBrZXkpIHtcbiAgICBfLmhhcyhyZXN1bHQsIGtleSkgPyByZXN1bHRba2V5XSsrIDogcmVzdWx0W2tleV0gPSAxO1xuICB9KTtcblxuICAvLyBVc2UgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRvIGZpZ3VyZSBvdXQgdGhlIHNtYWxsZXN0IGluZGV4IGF0IHdoaWNoXG4gIC8vIGFuIG9iamVjdCBzaG91bGQgYmUgaW5zZXJ0ZWQgc28gYXMgdG8gbWFpbnRhaW4gb3JkZXIuIFVzZXMgYmluYXJ5IHNlYXJjaC5cbiAgXy5zb3J0ZWRJbmRleCA9IGZ1bmN0aW9uKGFycmF5LCBvYmosIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0b3IgPSBsb29rdXBJdGVyYXRvcihpdGVyYXRvcik7XG4gICAgdmFyIHZhbHVlID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBvYmopO1xuICAgIHZhciBsb3cgPSAwLCBoaWdoID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICB2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+PiAxO1xuICAgICAgaXRlcmF0b3IuY2FsbChjb250ZXh0LCBhcnJheVttaWRdKSA8IHZhbHVlID8gbG93ID0gbWlkICsgMSA6IGhpZ2ggPSBtaWQ7XG4gICAgfVxuICAgIHJldHVybiBsb3c7XG4gIH07XG5cbiAgLy8gU2FmZWx5IGNyZWF0ZSBhIHJlYWwsIGxpdmUgYXJyYXkgZnJvbSBhbnl0aGluZyBpdGVyYWJsZS5cbiAgXy50b0FycmF5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFvYmopIHJldHVybiBbXTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikpIHJldHVybiBzbGljZS5jYWxsKG9iaik7XG4gICAgaWYgKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSByZXR1cm4gXy5tYXAob2JqLCBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gXy52YWx1ZXMob2JqKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiBhbiBvYmplY3QuXG4gIF8uc2l6ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIDA7XG4gICAgcmV0dXJuIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkgPyBvYmoubGVuZ3RoIDogXy5rZXlzKG9iaikubGVuZ3RoO1xuICB9O1xuXG4gIC8vIEFycmF5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS1cblxuICAvLyBHZXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGZpcnN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgaGVhZGAgYW5kIGB0YWtlYC4gVGhlICoqZ3VhcmQqKiBjaGVja1xuICAvLyBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8uZmlyc3QgPSBfLmhlYWQgPSBfLnRha2UgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAoKG4gPT0gbnVsbCkgfHwgZ3VhcmQpIHJldHVybiBhcnJheVswXTtcbiAgICBpZiAobiA8IDApIHJldHVybiBbXTtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgbik7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgbGFzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEVzcGVjaWFsbHkgdXNlZnVsIG9uXG4gIC8vIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIGFsbCB0aGUgdmFsdWVzIGluXG4gIC8vIHRoZSBhcnJheSwgZXhjbHVkaW5nIHRoZSBsYXN0IE4uIFRoZSAqKmd1YXJkKiogY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aFxuICAvLyBgXy5tYXBgLlxuICBfLmluaXRpYWwgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgYXJyYXkubGVuZ3RoIC0gKChuID09IG51bGwpIHx8IGd1YXJkID8gMSA6IG4pKTtcbiAgfTtcblxuICAvLyBHZXQgdGhlIGxhc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgbGFzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuIFRoZSAqKmd1YXJkKiogY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLmxhc3QgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICBpZiAoKG4gPT0gbnVsbCkgfHwgZ3VhcmQpIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgTWF0aC5tYXgoYXJyYXkubGVuZ3RoIC0gbiwgMCkpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGZpcnN0IGVudHJ5IG9mIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgdGFpbGAgYW5kIGBkcm9wYC5cbiAgLy8gRXNwZWNpYWxseSB1c2VmdWwgb24gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgYW4gKipuKiogd2lsbCByZXR1cm5cbiAgLy8gdGhlIHJlc3QgTiB2YWx1ZXMgaW4gdGhlIGFycmF5LiBUaGUgKipndWFyZCoqXG4gIC8vIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5yZXN0ID0gXy50YWlsID0gXy5kcm9wID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIChuID09IG51bGwpIHx8IGd1YXJkID8gMSA6IG4pO1xuICB9O1xuXG4gIC8vIFRyaW0gb3V0IGFsbCBmYWxzeSB2YWx1ZXMgZnJvbSBhbiBhcnJheS5cbiAgXy5jb21wYWN0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIF8uaWRlbnRpdHkpO1xuICB9O1xuXG4gIC8vIEludGVybmFsIGltcGxlbWVudGF0aW9uIG9mIGEgcmVjdXJzaXZlIGBmbGF0dGVuYCBmdW5jdGlvbi5cbiAgdmFyIGZsYXR0ZW4gPSBmdW5jdGlvbihpbnB1dCwgc2hhbGxvdywgb3V0cHV0KSB7XG4gICAgaWYgKHNoYWxsb3cgJiYgXy5ldmVyeShpbnB1dCwgXy5pc0FycmF5KSkge1xuICAgICAgcmV0dXJuIGNvbmNhdC5hcHBseShvdXRwdXQsIGlucHV0KTtcbiAgICB9XG4gICAgZWFjaChpbnB1dCwgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIGlmIChfLmlzQXJyYXkodmFsdWUpIHx8IF8uaXNBcmd1bWVudHModmFsdWUpKSB7XG4gICAgICAgIHNoYWxsb3cgPyBwdXNoLmFwcGx5KG91dHB1dCwgdmFsdWUpIDogZmxhdHRlbih2YWx1ZSwgc2hhbGxvdywgb3V0cHV0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHB1dC5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIC8vIEZsYXR0ZW4gb3V0IGFuIGFycmF5LCBlaXRoZXIgcmVjdXJzaXZlbHkgKGJ5IGRlZmF1bHQpLCBvciBqdXN0IG9uZSBsZXZlbC5cbiAgXy5mbGF0dGVuID0gZnVuY3Rpb24oYXJyYXksIHNoYWxsb3cpIHtcbiAgICByZXR1cm4gZmxhdHRlbihhcnJheSwgc2hhbGxvdywgW10pO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHZlcnNpb24gb2YgdGhlIGFycmF5IHRoYXQgZG9lcyBub3QgY29udGFpbiB0aGUgc3BlY2lmaWVkIHZhbHVlKHMpLlxuICBfLndpdGhvdXQgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmRpZmZlcmVuY2UoYXJyYXksIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gIH07XG5cbiAgLy8gU3BsaXQgYW4gYXJyYXkgaW50byB0d28gYXJyYXlzOiBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIHNhdGlzZnkgdGhlIGdpdmVuXG4gIC8vIHByZWRpY2F0ZSwgYW5kIG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgZG8gbm90IHNhdGlzZnkgdGhlIHByZWRpY2F0ZS5cbiAgXy5wYXJ0aXRpb24gPSBmdW5jdGlvbihhcnJheSwgcHJlZGljYXRlKSB7XG4gICAgdmFyIHBhc3MgPSBbXSwgZmFpbCA9IFtdO1xuICAgIGVhY2goYXJyYXksIGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgIChwcmVkaWNhdGUoZWxlbSkgPyBwYXNzIDogZmFpbCkucHVzaChlbGVtKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW3Bhc3MsIGZhaWxdO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYSBkdXBsaWNhdGUtZnJlZSB2ZXJzaW9uIG9mIHRoZSBhcnJheS4gSWYgdGhlIGFycmF5IGhhcyBhbHJlYWR5XG4gIC8vIGJlZW4gc29ydGVkLCB5b3UgaGF2ZSB0aGUgb3B0aW9uIG9mIHVzaW5nIGEgZmFzdGVyIGFsZ29yaXRobS5cbiAgLy8gQWxpYXNlZCBhcyBgdW5pcXVlYC5cbiAgXy51bmlxID0gXy51bmlxdWUgPSBmdW5jdGlvbihhcnJheSwgaXNTb3J0ZWQsIGl0ZXJhdG9yLCBjb250ZXh0KSB7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihpc1NvcnRlZCkpIHtcbiAgICAgIGNvbnRleHQgPSBpdGVyYXRvcjtcbiAgICAgIGl0ZXJhdG9yID0gaXNTb3J0ZWQ7XG4gICAgICBpc1NvcnRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICB2YXIgaW5pdGlhbCA9IGl0ZXJhdG9yID8gXy5tYXAoYXJyYXksIGl0ZXJhdG9yLCBjb250ZXh0KSA6IGFycmF5O1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgdmFyIHNlZW4gPSBbXTtcbiAgICBlYWNoKGluaXRpYWwsIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgaWYgKGlzU29ydGVkID8gKCFpbmRleCB8fCBzZWVuW3NlZW4ubGVuZ3RoIC0gMV0gIT09IHZhbHVlKSA6ICFfLmNvbnRhaW5zKHNlZW4sIHZhbHVlKSkge1xuICAgICAgICBzZWVuLnB1c2godmFsdWUpO1xuICAgICAgICByZXN1bHRzLnB1c2goYXJyYXlbaW5kZXhdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgdGhlIHVuaW9uOiBlYWNoIGRpc3RpbmN0IGVsZW1lbnQgZnJvbSBhbGwgb2ZcbiAgLy8gdGhlIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8udW5pb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXy51bmlxKF8uZmxhdHRlbihhcmd1bWVudHMsIHRydWUpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgZXZlcnkgaXRlbSBzaGFyZWQgYmV0d2VlbiBhbGwgdGhlXG4gIC8vIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8uaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgcmVzdCA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoXy51bmlxKGFycmF5KSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgcmV0dXJuIF8uZXZlcnkocmVzdCwgZnVuY3Rpb24ob3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMob3RoZXIsIGl0ZW0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gVGFrZSB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIG9uZSBhcnJheSBhbmQgYSBudW1iZXIgb2Ygb3RoZXIgYXJyYXlzLlxuICAvLyBPbmx5IHRoZSBlbGVtZW50cyBwcmVzZW50IGluIGp1c3QgdGhlIGZpcnN0IGFycmF5IHdpbGwgcmVtYWluLlxuICBfLmRpZmZlcmVuY2UgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN0ID0gY29uY2F0LmFwcGx5KEFycmF5UHJvdG8sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBmdW5jdGlvbih2YWx1ZSl7IHJldHVybiAhXy5jb250YWlucyhyZXN0LCB2YWx1ZSk7IH0pO1xuICB9O1xuXG4gIC8vIFppcCB0b2dldGhlciBtdWx0aXBsZSBsaXN0cyBpbnRvIGEgc2luZ2xlIGFycmF5IC0tIGVsZW1lbnRzIHRoYXQgc2hhcmVcbiAgLy8gYW4gaW5kZXggZ28gdG9nZXRoZXIuXG4gIF8uemlwID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxlbmd0aCA9IF8ubWF4KF8ucGx1Y2soYXJndW1lbnRzLCAnbGVuZ3RoJykuY29uY2F0KDApKTtcbiAgICB2YXIgcmVzdWx0cyA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdHNbaV0gPSBfLnBsdWNrKGFyZ3VtZW50cywgJycgKyBpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ29udmVydHMgbGlzdHMgaW50byBvYmplY3RzLiBQYXNzIGVpdGhlciBhIHNpbmdsZSBhcnJheSBvZiBgW2tleSwgdmFsdWVdYFxuICAvLyBwYWlycywgb3IgdHdvIHBhcmFsbGVsIGFycmF5cyBvZiB0aGUgc2FtZSBsZW5ndGggLS0gb25lIG9mIGtleXMsIGFuZCBvbmUgb2ZcbiAgLy8gdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICBfLm9iamVjdCA9IGZ1bmN0aW9uKGxpc3QsIHZhbHVlcykge1xuICAgIGlmIChsaXN0ID09IG51bGwpIHJldHVybiB7fTtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1dID0gdmFsdWVzW2ldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1bMF1dID0gbGlzdFtpXVsxXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBJZiB0aGUgYnJvd3NlciBkb2Vzbid0IHN1cHBseSB1cyB3aXRoIGluZGV4T2YgKEknbSBsb29raW5nIGF0IHlvdSwgKipNU0lFKiopLFxuICAvLyB3ZSBuZWVkIHRoaXMgZnVuY3Rpb24uIFJldHVybiB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYW5cbiAgLy8gaXRlbSBpbiBhbiBhcnJheSwgb3IgLTEgaWYgdGhlIGl0ZW0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBhcnJheS5cbiAgLy8gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYGluZGV4T2ZgIGlmIGF2YWlsYWJsZS5cbiAgLy8gSWYgdGhlIGFycmF5IGlzIGxhcmdlIGFuZCBhbHJlYWR5IGluIHNvcnQgb3JkZXIsIHBhc3MgYHRydWVgXG4gIC8vIGZvciAqKmlzU29ydGVkKiogdG8gdXNlIGJpbmFyeSBzZWFyY2guXG4gIF8uaW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBpc1NvcnRlZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XG4gICAgdmFyIGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gICAgaWYgKGlzU29ydGVkKSB7XG4gICAgICBpZiAodHlwZW9mIGlzU29ydGVkID09ICdudW1iZXInKSB7XG4gICAgICAgIGkgPSAoaXNTb3J0ZWQgPCAwID8gTWF0aC5tYXgoMCwgbGVuZ3RoICsgaXNTb3J0ZWQpIDogaXNTb3J0ZWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaSA9IF8uc29ydGVkSW5kZXgoYXJyYXksIGl0ZW0pO1xuICAgICAgICByZXR1cm4gYXJyYXlbaV0gPT09IGl0ZW0gPyBpIDogLTE7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChuYXRpdmVJbmRleE9mICYmIGFycmF5LmluZGV4T2YgPT09IG5hdGl2ZUluZGV4T2YpIHJldHVybiBhcnJheS5pbmRleE9mKGl0ZW0sIGlzU29ydGVkKTtcbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgbGFzdEluZGV4T2ZgIGlmIGF2YWlsYWJsZS5cbiAgXy5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBmcm9tKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiAtMTtcbiAgICB2YXIgaGFzSW5kZXggPSBmcm9tICE9IG51bGw7XG4gICAgaWYgKG5hdGl2ZUxhc3RJbmRleE9mICYmIGFycmF5Lmxhc3RJbmRleE9mID09PSBuYXRpdmVMYXN0SW5kZXhPZikge1xuICAgICAgcmV0dXJuIGhhc0luZGV4ID8gYXJyYXkubGFzdEluZGV4T2YoaXRlbSwgZnJvbSkgOiBhcnJheS5sYXN0SW5kZXhPZihpdGVtKTtcbiAgICB9XG4gICAgdmFyIGkgPSAoaGFzSW5kZXggPyBmcm9tIDogYXJyYXkubGVuZ3RoKTtcbiAgICB3aGlsZSAoaS0tKSBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhbiBpbnRlZ2VyIEFycmF5IGNvbnRhaW5pbmcgYW4gYXJpdGhtZXRpYyBwcm9ncmVzc2lvbi4gQSBwb3J0IG9mXG4gIC8vIHRoZSBuYXRpdmUgUHl0aG9uIGByYW5nZSgpYCBmdW5jdGlvbi4gU2VlXG4gIC8vIFt0aGUgUHl0aG9uIGRvY3VtZW50YXRpb25dKGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS9mdW5jdGlvbnMuaHRtbCNyYW5nZSkuXG4gIF8ucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDw9IDEpIHtcbiAgICAgIHN0b3AgPSBzdGFydCB8fCAwO1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgICBzdGVwID0gYXJndW1lbnRzWzJdIHx8IDE7XG5cbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5tYXgoTWF0aC5jZWlsKChzdG9wIC0gc3RhcnQpIC8gc3RlcCksIDApO1xuICAgIHZhciBpZHggPSAwO1xuICAgIHZhciByYW5nZSA9IG5ldyBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUoaWR4IDwgbGVuZ3RoKSB7XG4gICAgICByYW5nZVtpZHgrK10gPSBzdGFydDtcbiAgICAgIHN0YXJ0ICs9IHN0ZXA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJhbmdlO1xuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIChhaGVtKSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUmV1c2FibGUgY29uc3RydWN0b3IgZnVuY3Rpb24gZm9yIHByb3RvdHlwZSBzZXR0aW5nLlxuICB2YXIgY3RvciA9IGZ1bmN0aW9uKCl7fTtcblxuICAvLyBDcmVhdGUgYSBmdW5jdGlvbiBib3VuZCB0byBhIGdpdmVuIG9iamVjdCAoYXNzaWduaW5nIGB0aGlzYCwgYW5kIGFyZ3VtZW50cyxcbiAgLy8gb3B0aW9uYWxseSkuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBGdW5jdGlvbi5iaW5kYCBpZlxuICAvLyBhdmFpbGFibGUuXG4gIF8uYmluZCA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQpIHtcbiAgICB2YXIgYXJncywgYm91bmQ7XG4gICAgaWYgKG5hdGl2ZUJpbmQgJiYgZnVuYy5iaW5kID09PSBuYXRpdmVCaW5kKSByZXR1cm4gbmF0aXZlQmluZC5hcHBseShmdW5jLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGlmICghXy5pc0Z1bmN0aW9uKGZ1bmMpKSB0aHJvdyBuZXcgVHlwZUVycm9yO1xuICAgIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgYm91bmQpKSByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgIGN0b3IucHJvdG90eXBlID0gZnVuYy5wcm90b3R5cGU7XG4gICAgICB2YXIgc2VsZiA9IG5ldyBjdG9yO1xuICAgICAgY3Rvci5wcm90b3R5cGUgPSBudWxsO1xuICAgICAgdmFyIHJlc3VsdCA9IGZ1bmMuYXBwbHkoc2VsZiwgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICBpZiAoT2JqZWN0KHJlc3VsdCkgPT09IHJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUGFydGlhbGx5IGFwcGx5IGEgZnVuY3Rpb24gYnkgY3JlYXRpbmcgYSB2ZXJzaW9uIHRoYXQgaGFzIGhhZCBzb21lIG9mIGl0c1xuICAvLyBhcmd1bWVudHMgcHJlLWZpbGxlZCwgd2l0aG91dCBjaGFuZ2luZyBpdHMgZHluYW1pYyBgdGhpc2AgY29udGV4dC4gXyBhY3RzXG4gIC8vIGFzIGEgcGxhY2Vob2xkZXIsIGFsbG93aW5nIGFueSBjb21iaW5hdGlvbiBvZiBhcmd1bWVudHMgdG8gYmUgcHJlLWZpbGxlZC5cbiAgXy5wYXJ0aWFsID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHZhciBib3VuZEFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBvc2l0aW9uID0gMDtcbiAgICAgIHZhciBhcmdzID0gYm91bmRBcmdzLnNsaWNlKCk7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gYXJncy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYXJnc1tpXSA9PT0gXykgYXJnc1tpXSA9IGFyZ3VtZW50c1twb3NpdGlvbisrXTtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChwb3NpdGlvbiA8IGFyZ3VtZW50cy5sZW5ndGgpIGFyZ3MucHVzaChhcmd1bWVudHNbcG9zaXRpb24rK10pO1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBCaW5kIGEgbnVtYmVyIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFJlbWFpbmluZyBhcmd1bWVudHNcbiAgLy8gYXJlIHRoZSBtZXRob2QgbmFtZXMgdG8gYmUgYm91bmQuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdCBhbGwgY2FsbGJhY2tzXG4gIC8vIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgXy5iaW5kQWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGZ1bmNzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGlmIChmdW5jcy5sZW5ndGggPT09IDApIHRocm93IG5ldyBFcnJvcignYmluZEFsbCBtdXN0IGJlIHBhc3NlZCBmdW5jdGlvbiBuYW1lcycpO1xuICAgIGVhY2goZnVuY3MsIGZ1bmN0aW9uKGYpIHsgb2JqW2ZdID0gXy5iaW5kKG9ialtmXSwgb2JqKTsgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBNZW1vaXplIGFuIGV4cGVuc2l2ZSBmdW5jdGlvbiBieSBzdG9yaW5nIGl0cyByZXN1bHRzLlxuICBfLm1lbW9pemUgPSBmdW5jdGlvbihmdW5jLCBoYXNoZXIpIHtcbiAgICB2YXIgbWVtbyA9IHt9O1xuICAgIGhhc2hlciB8fCAoaGFzaGVyID0gXy5pZGVudGl0eSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGtleSA9IGhhc2hlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIF8uaGFzKG1lbW8sIGtleSkgPyBtZW1vW2tleV0gOiAobWVtb1trZXldID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIERlbGF5cyBhIGZ1bmN0aW9uIGZvciB0aGUgZ2l2ZW4gbnVtYmVyIG9mIG1pbGxpc2Vjb25kcywgYW5kIHRoZW4gY2FsbHNcbiAgLy8gaXQgd2l0aCB0aGUgYXJndW1lbnRzIHN1cHBsaWVkLlxuICBfLmRlbGF5ID0gZnVuY3Rpb24oZnVuYywgd2FpdCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IHJldHVybiBmdW5jLmFwcGx5KG51bGwsIGFyZ3MpOyB9LCB3YWl0KTtcbiAgfTtcblxuICAvLyBEZWZlcnMgYSBmdW5jdGlvbiwgc2NoZWR1bGluZyBpdCB0byBydW4gYWZ0ZXIgdGhlIGN1cnJlbnQgY2FsbCBzdGFjayBoYXNcbiAgLy8gY2xlYXJlZC5cbiAgXy5kZWZlciA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICByZXR1cm4gXy5kZWxheS5hcHBseShfLCBbZnVuYywgMV0uY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSkpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgd2hlbiBpbnZva2VkLCB3aWxsIG9ubHkgYmUgdHJpZ2dlcmVkIGF0IG1vc3Qgb25jZVxuICAvLyBkdXJpbmcgYSBnaXZlbiB3aW5kb3cgb2YgdGltZS4gTm9ybWFsbHksIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbCBydW5cbiAgLy8gYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuICAvLyBidXQgaWYgeW91J2QgbGlrZSB0byBkaXNhYmxlIHRoZSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSwgcGFzc1xuICAvLyBge2xlYWRpbmc6IGZhbHNlfWAuIFRvIGRpc2FibGUgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlLCBkaXR0by5cbiAgXy50aHJvdHRsZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICB2YXIgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICAgIHZhciB0aW1lb3V0ID0gbnVsbDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIG9wdGlvbnMgfHwgKG9wdGlvbnMgPSB7fSk7XG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogXy5ub3coKTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub3cgPSBfLm5vdygpO1xuICAgICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKSBwcmV2aW91cyA9IG5vdztcbiAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gIC8vIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3JcbiAgLy8gTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4gIC8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gIF8uZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHQ7XG5cbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsYXN0ID0gXy5ub3coKSAtIHRpbWVzdGFtcDtcbiAgICAgIGlmIChsYXN0IDwgd2FpdCkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgdGltZXN0YW1wID0gXy5ub3coKTtcbiAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgaWYgKCF0aW1lb3V0KSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgIH1cbiAgICAgIGlmIChjYWxsTm93KSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYXQgbW9zdCBvbmUgdGltZSwgbm8gbWF0dGVyIGhvd1xuICAvLyBvZnRlbiB5b3UgY2FsbCBpdC4gVXNlZnVsIGZvciBsYXp5IGluaXRpYWxpemF0aW9uLlxuICBfLm9uY2UgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgdmFyIHJhbiA9IGZhbHNlLCBtZW1vO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChyYW4pIHJldHVybiBtZW1vO1xuICAgICAgcmFuID0gdHJ1ZTtcbiAgICAgIG1lbW8gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICBmdW5jID0gbnVsbDtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgZnVuY3Rpb24gcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSBzZWNvbmQsXG4gIC8vIGFsbG93aW5nIHlvdSB0byBhZGp1c3QgYXJndW1lbnRzLCBydW4gY29kZSBiZWZvcmUgYW5kIGFmdGVyLCBhbmRcbiAgLy8gY29uZGl0aW9uYWxseSBleGVjdXRlIHRoZSBvcmlnaW5hbCBmdW5jdGlvbi5cbiAgXy53cmFwID0gZnVuY3Rpb24oZnVuYywgd3JhcHBlcikge1xuICAgIHJldHVybiBfLnBhcnRpYWwod3JhcHBlciwgZnVuYyk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgaXMgdGhlIGNvbXBvc2l0aW9uIG9mIGEgbGlzdCBvZiBmdW5jdGlvbnMsIGVhY2hcbiAgLy8gY29uc3VtaW5nIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZ1bmN0aW9uIHRoYXQgZm9sbG93cy5cbiAgXy5jb21wb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZ1bmNzID0gYXJndW1lbnRzO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgZm9yICh2YXIgaSA9IGZ1bmNzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGFyZ3MgPSBbZnVuY3NbaV0uYXBwbHkodGhpcywgYXJncyldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFyZ3NbMF07XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgYWZ0ZXIgYmVpbmcgY2FsbGVkIE4gdGltZXMuXG4gIF8uYWZ0ZXIgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzIDwgMSkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgLy8gT2JqZWN0IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUmV0cmlldmUgdGhlIG5hbWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBPYmplY3Qua2V5c2BcbiAgXy5rZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICBpZiAobmF0aXZlS2V5cykgcmV0dXJuIG5hdGl2ZUtleXMob2JqKTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIHRoZSB2YWx1ZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgXy52YWx1ZXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgdmFsdWVzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFsdWVzW2ldID0gb2JqW2tleXNbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9O1xuXG4gIC8vIENvbnZlcnQgYW4gb2JqZWN0IGludG8gYSBsaXN0IG9mIGBba2V5LCB2YWx1ZV1gIHBhaXJzLlxuICBfLnBhaXJzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHBhaXJzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcGFpcnNbaV0gPSBba2V5c1tpXSwgb2JqW2tleXNbaV1dXTtcbiAgICB9XG4gICAgcmV0dXJuIHBhaXJzO1xuICB9O1xuXG4gIC8vIEludmVydCB0aGUga2V5cyBhbmQgdmFsdWVzIG9mIGFuIG9iamVjdC4gVGhlIHZhbHVlcyBtdXN0IGJlIHNlcmlhbGl6YWJsZS5cbiAgXy5pbnZlcnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0W29ialtrZXlzW2ldXV0gPSBrZXlzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHNvcnRlZCBsaXN0IG9mIHRoZSBmdW5jdGlvbiBuYW1lcyBhdmFpbGFibGUgb24gdGhlIG9iamVjdC5cbiAgLy8gQWxpYXNlZCBhcyBgbWV0aG9kc2BcbiAgXy5mdW5jdGlvbnMgPSBfLm1ldGhvZHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgbmFtZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZiAoXy5pc0Z1bmN0aW9uKG9ialtrZXldKSkgbmFtZXMucHVzaChrZXkpO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZXMuc29ydCgpO1xuICB9O1xuXG4gIC8vIEV4dGVuZCBhIGdpdmVuIG9iamVjdCB3aXRoIGFsbCB0aGUgcHJvcGVydGllcyBpbiBwYXNzZWQtaW4gb2JqZWN0KHMpLlxuICBfLmV4dGVuZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGVhY2goc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLCBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCBvbmx5IGNvbnRhaW5pbmcgdGhlIHdoaXRlbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ucGljayA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBjb3B5ID0ge307XG4gICAgdmFyIGtleXMgPSBjb25jYXQuYXBwbHkoQXJyYXlQcm90bywgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICBlYWNoKGtleXMsIGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKGtleSBpbiBvYmopIGNvcHlba2V5XSA9IG9ialtrZXldO1xuICAgIH0pO1xuICAgIHJldHVybiBjb3B5O1xuICB9O1xuXG4gICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgd2l0aG91dCB0aGUgYmxhY2tsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5vbWl0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGNvcHkgPSB7fTtcbiAgICB2YXIga2V5cyA9IGNvbmNhdC5hcHBseShBcnJheVByb3RvLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmICghXy5jb250YWlucyhrZXlzLCBrZXkpKSBjb3B5W2tleV0gPSBvYmpba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIGNvcHk7XG4gIH07XG5cbiAgLy8gRmlsbCBpbiBhIGdpdmVuIG9iamVjdCB3aXRoIGRlZmF1bHQgcHJvcGVydGllcy5cbiAgXy5kZWZhdWx0cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGVhY2goc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLCBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBpZiAob2JqW3Byb3BdID09PSB2b2lkIDApIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgKHNoYWxsb3ctY2xvbmVkKSBkdXBsaWNhdGUgb2YgYW4gb2JqZWN0LlxuICBfLmNsb25lID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gICAgcmV0dXJuIF8uaXNBcnJheShvYmopID8gb2JqLnNsaWNlKCkgOiBfLmV4dGVuZCh7fSwgb2JqKTtcbiAgfTtcblxuICAvLyBJbnZva2VzIGludGVyY2VwdG9yIHdpdGggdGhlIG9iaiwgYW5kIHRoZW4gcmV0dXJucyBvYmouXG4gIC8vIFRoZSBwcmltYXJ5IHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gXCJ0YXAgaW50b1wiIGEgbWV0aG9kIGNoYWluLCBpblxuICAvLyBvcmRlciB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gaW50ZXJtZWRpYXRlIHJlc3VsdHMgd2l0aGluIHRoZSBjaGFpbi5cbiAgXy50YXAgPSBmdW5jdGlvbihvYmosIGludGVyY2VwdG9yKSB7XG4gICAgaW50ZXJjZXB0b3Iob2JqKTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIEludGVybmFsIHJlY3Vyc2l2ZSBjb21wYXJpc29uIGZ1bmN0aW9uIGZvciBgaXNFcXVhbGAuXG4gIHZhciBlcSA9IGZ1bmN0aW9uKGEsIGIsIGFTdGFjaywgYlN0YWNrKSB7XG4gICAgLy8gSWRlbnRpY2FsIG9iamVjdHMgYXJlIGVxdWFsLiBgMCA9PT0gLTBgLCBidXQgdGhleSBhcmVuJ3QgaWRlbnRpY2FsLlxuICAgIC8vIFNlZSB0aGUgW0hhcm1vbnkgYGVnYWxgIHByb3Bvc2FsXShodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWwpLlxuICAgIGlmIChhID09PSBiKSByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PSAxIC8gYjtcbiAgICAvLyBBIHN0cmljdCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGBudWxsID09IHVuZGVmaW5lZGAuXG4gICAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHJldHVybiBhID09PSBiO1xuICAgIC8vIFVud3JhcCBhbnkgd3JhcHBlZCBvYmplY3RzLlxuICAgIGlmIChhIGluc3RhbmNlb2YgXykgYSA9IGEuX3dyYXBwZWQ7XG4gICAgaWYgKGIgaW5zdGFuY2VvZiBfKSBiID0gYi5fd3JhcHBlZDtcbiAgICAvLyBDb21wYXJlIGBbW0NsYXNzXV1gIG5hbWVzLlxuICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKGEpO1xuICAgIGlmIChjbGFzc05hbWUgIT0gdG9TdHJpbmcuY2FsbChiKSkgcmV0dXJuIGZhbHNlO1xuICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAvLyBTdHJpbmdzLCBudW1iZXJzLCBkYXRlcywgYW5kIGJvb2xlYW5zIGFyZSBjb21wYXJlZCBieSB2YWx1ZS5cbiAgICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6XG4gICAgICAgIC8vIFByaW1pdGl2ZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgb2JqZWN0IHdyYXBwZXJzIGFyZSBlcXVpdmFsZW50OyB0aHVzLCBgXCI1XCJgIGlzXG4gICAgICAgIC8vIGVxdWl2YWxlbnQgdG8gYG5ldyBTdHJpbmcoXCI1XCIpYC5cbiAgICAgICAgcmV0dXJuIGEgPT0gU3RyaW5nKGIpO1xuICAgICAgY2FzZSAnW29iamVjdCBOdW1iZXJdJzpcbiAgICAgICAgLy8gYE5hTmBzIGFyZSBlcXVpdmFsZW50LCBidXQgbm9uLXJlZmxleGl2ZS4gQW4gYGVnYWxgIGNvbXBhcmlzb24gaXMgcGVyZm9ybWVkIGZvclxuICAgICAgICAvLyBvdGhlciBudW1lcmljIHZhbHVlcy5cbiAgICAgICAgcmV0dXJuIGEgIT0gK2EgPyBiICE9ICtiIDogKGEgPT0gMCA/IDEgLyBhID09IDEgLyBiIDogYSA9PSArYik7XG4gICAgICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICAgIGNhc2UgJ1tvYmplY3QgQm9vbGVhbl0nOlxuICAgICAgICAvLyBDb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWVyaWMgcHJpbWl0aXZlIHZhbHVlcy4gRGF0ZXMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyXG4gICAgICAgIC8vIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9ucy4gTm90ZSB0aGF0IGludmFsaWQgZGF0ZXMgd2l0aCBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnNcbiAgICAgICAgLy8gb2YgYE5hTmAgYXJlIG5vdCBlcXVpdmFsZW50LlxuICAgICAgICByZXR1cm4gK2EgPT0gK2I7XG4gICAgICAvLyBSZWdFeHBzIGFyZSBjb21wYXJlZCBieSB0aGVpciBzb3VyY2UgcGF0dGVybnMgYW5kIGZsYWdzLlxuICAgICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcbiAgICAgICAgcmV0dXJuIGEuc291cmNlID09IGIuc291cmNlICYmXG4gICAgICAgICAgICAgICBhLmdsb2JhbCA9PSBiLmdsb2JhbCAmJlxuICAgICAgICAgICAgICAgYS5tdWx0aWxpbmUgPT0gYi5tdWx0aWxpbmUgJiZcbiAgICAgICAgICAgICAgIGEuaWdub3JlQ2FzZSA9PSBiLmlnbm9yZUNhc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgYSAhPSAnb2JqZWN0JyB8fCB0eXBlb2YgYiAhPSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuICAgIC8vIEFzc3VtZSBlcXVhbGl0eSBmb3IgY3ljbGljIHN0cnVjdHVyZXMuIFRoZSBhbGdvcml0aG0gZm9yIGRldGVjdGluZyBjeWNsaWNcbiAgICAvLyBzdHJ1Y3R1cmVzIGlzIGFkYXB0ZWQgZnJvbSBFUyA1LjEgc2VjdGlvbiAxNS4xMi4zLCBhYnN0cmFjdCBvcGVyYXRpb24gYEpPYC5cbiAgICB2YXIgbGVuZ3RoID0gYVN0YWNrLmxlbmd0aDtcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIC8vIExpbmVhciBzZWFyY2guIFBlcmZvcm1hbmNlIGlzIGludmVyc2VseSBwcm9wb3J0aW9uYWwgdG8gdGhlIG51bWJlciBvZlxuICAgICAgLy8gdW5pcXVlIG5lc3RlZCBzdHJ1Y3R1cmVzLlxuICAgICAgaWYgKGFTdGFja1tsZW5ndGhdID09IGEpIHJldHVybiBiU3RhY2tbbGVuZ3RoXSA9PSBiO1xuICAgIH1cbiAgICAvLyBPYmplY3RzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWl2YWxlbnQsIGJ1dCBgT2JqZWN0YHNcbiAgICAvLyBmcm9tIGRpZmZlcmVudCBmcmFtZXMgYXJlLlxuICAgIHZhciBhQ3RvciA9IGEuY29uc3RydWN0b3IsIGJDdG9yID0gYi5jb25zdHJ1Y3RvcjtcbiAgICBpZiAoYUN0b3IgIT09IGJDdG9yICYmICEoXy5pc0Z1bmN0aW9uKGFDdG9yKSAmJiAoYUN0b3IgaW5zdGFuY2VvZiBhQ3RvcikgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXy5pc0Z1bmN0aW9uKGJDdG9yKSAmJiAoYkN0b3IgaW5zdGFuY2VvZiBiQ3RvcikpXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAoJ2NvbnN0cnVjdG9yJyBpbiBhICYmICdjb25zdHJ1Y3RvcicgaW4gYikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gQWRkIHRoZSBmaXJzdCBvYmplY3QgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wdXNoKGEpO1xuICAgIGJTdGFjay5wdXNoKGIpO1xuICAgIHZhciBzaXplID0gMCwgcmVzdWx0ID0gdHJ1ZTtcbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgYW5kIGFycmF5cy5cbiAgICBpZiAoY2xhc3NOYW1lID09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgIC8vIENvbXBhcmUgYXJyYXkgbGVuZ3RocyB0byBkZXRlcm1pbmUgaWYgYSBkZWVwIGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5LlxuICAgICAgc2l6ZSA9IGEubGVuZ3RoO1xuICAgICAgcmVzdWx0ID0gc2l6ZSA9PSBiLmxlbmd0aDtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgLy8gRGVlcCBjb21wYXJlIHRoZSBjb250ZW50cywgaWdub3Jpbmcgbm9uLW51bWVyaWMgcHJvcGVydGllcy5cbiAgICAgICAgd2hpbGUgKHNpemUtLSkge1xuICAgICAgICAgIGlmICghKHJlc3VsdCA9IGVxKGFbc2l6ZV0sIGJbc2l6ZV0sIGFTdGFjaywgYlN0YWNrKSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERlZXAgY29tcGFyZSBvYmplY3RzLlxuICAgICAgZm9yICh2YXIga2V5IGluIGEpIHtcbiAgICAgICAgaWYgKF8uaGFzKGEsIGtleSkpIHtcbiAgICAgICAgICAvLyBDb3VudCB0aGUgZXhwZWN0ZWQgbnVtYmVyIG9mIHByb3BlcnRpZXMuXG4gICAgICAgICAgc2l6ZSsrO1xuICAgICAgICAgIC8vIERlZXAgY29tcGFyZSBlYWNoIG1lbWJlci5cbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSBfLmhhcyhiLCBrZXkpICYmIGVxKGFba2V5XSwgYltrZXldLCBhU3RhY2ssIGJTdGFjaykpKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRW5zdXJlIHRoYXQgYm90aCBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIHByb3BlcnRpZXMuXG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIGZvciAoa2V5IGluIGIpIHtcbiAgICAgICAgICBpZiAoXy5oYXMoYiwga2V5KSAmJiAhKHNpemUtLSkpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9ICFzaXplO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBSZW1vdmUgdGhlIGZpcnN0IG9iamVjdCBmcm9tIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucG9wKCk7XG4gICAgYlN0YWNrLnBvcCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUGVyZm9ybSBhIGRlZXAgY29tcGFyaXNvbiB0byBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgZXF1YWwuXG4gIF8uaXNFcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gZXEoYSwgYiwgW10sIFtdKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIGFycmF5LCBzdHJpbmcsIG9yIG9iamVjdCBlbXB0eT9cbiAgLy8gQW4gXCJlbXB0eVwiIG9iamVjdCBoYXMgbm8gZW51bWVyYWJsZSBvd24tcHJvcGVydGllcy5cbiAgXy5pc0VtcHR5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikgfHwgXy5pc1N0cmluZyhvYmopKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIERPTSBlbGVtZW50P1xuICBfLmlzRWxlbWVudCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGFuIGFycmF5P1xuICAvLyBEZWxlZ2F0ZXMgdG8gRUNNQTUncyBuYXRpdmUgQXJyYXkuaXNBcnJheVxuICBfLmlzQXJyYXkgPSBuYXRpdmVJc0FycmF5IHx8IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIGFuIG9iamVjdD9cbiAgXy5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IE9iamVjdChvYmopO1xuICB9O1xuXG4gIC8vIEFkZCBzb21lIGlzVHlwZSBtZXRob2RzOiBpc0FyZ3VtZW50cywgaXNGdW5jdGlvbiwgaXNTdHJpbmcsIGlzTnVtYmVyLCBpc0RhdGUsIGlzUmVnRXhwLlxuICBlYWNoKFsnQXJndW1lbnRzJywgJ0Z1bmN0aW9uJywgJ1N0cmluZycsICdOdW1iZXInLCAnRGF0ZScsICdSZWdFeHAnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIF9bJ2lzJyArIG5hbWVdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIERlZmluZSBhIGZhbGxiYWNrIHZlcnNpb24gb2YgdGhlIG1ldGhvZCBpbiBicm93c2VycyAoYWhlbSwgSUUpLCB3aGVyZVxuICAvLyB0aGVyZSBpc24ndCBhbnkgaW5zcGVjdGFibGUgXCJBcmd1bWVudHNcIiB0eXBlLlxuICBpZiAoIV8uaXNBcmd1bWVudHMoYXJndW1lbnRzKSkge1xuICAgIF8uaXNBcmd1bWVudHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiAhIShvYmogJiYgXy5oYXMob2JqLCAnY2FsbGVlJykpO1xuICAgIH07XG4gIH1cblxuICAvLyBPcHRpbWl6ZSBgaXNGdW5jdGlvbmAgaWYgYXBwcm9wcmlhdGUuXG4gIGlmICh0eXBlb2YgKC8uLykgIT09ICdmdW5jdGlvbicpIHtcbiAgICBfLmlzRnVuY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nO1xuICAgIH07XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIG9iamVjdCBhIGZpbml0ZSBudW1iZXI/XG4gIF8uaXNGaW5pdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4ocGFyc2VGbG9hdChvYmopKTtcbiAgfTtcblxuICAvLyBJcyB0aGUgZ2l2ZW4gdmFsdWUgYE5hTmA/IChOYU4gaXMgdGhlIG9ubHkgbnVtYmVyIHdoaWNoIGRvZXMgbm90IGVxdWFsIGl0c2VsZikuXG4gIF8uaXNOYU4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc051bWJlcihvYmopICYmIG9iaiAhPSArb2JqO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBib29sZWFuP1xuICBfLmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgZXF1YWwgdG8gbnVsbD9cbiAgXy5pc051bGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBudWxsO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgdW5kZWZpbmVkP1xuICBfLmlzVW5kZWZpbmVkID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdm9pZCAwO1xuICB9O1xuXG4gIC8vIFNob3J0Y3V0IGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gcHJvcGVydHkgZGlyZWN0bHlcbiAgLy8gb24gaXRzZWxmIChpbiBvdGhlciB3b3Jkcywgbm90IG9uIGEgcHJvdG90eXBlKS5cbiAgXy5oYXMgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbiAgfTtcblxuICAvLyBVdGlsaXR5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJ1biBVbmRlcnNjb3JlLmpzIGluICpub0NvbmZsaWN0KiBtb2RlLCByZXR1cm5pbmcgdGhlIGBfYCB2YXJpYWJsZSB0byBpdHNcbiAgLy8gcHJldmlvdXMgb3duZXIuIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICByb290Ll8gPSBwcmV2aW91c1VuZGVyc2NvcmU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gS2VlcCB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gYXJvdW5kIGZvciBkZWZhdWx0IGl0ZXJhdG9ycy5cbiAgXy5pZGVudGl0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIF8uY29uc3RhbnQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgfTtcblxuICBfLnByb3BlcnR5ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIHByZWRpY2F0ZSBmb3IgY2hlY2tpbmcgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLm1hdGNoZXMgPSBmdW5jdGlvbihhdHRycykge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIGlmIChvYmogPT09IGF0dHJzKSByZXR1cm4gdHJ1ZTsgLy9hdm9pZCBjb21wYXJpbmcgYW4gb2JqZWN0IHRvIGl0c2VsZi5cbiAgICAgIGZvciAodmFyIGtleSBpbiBhdHRycykge1xuICAgICAgICBpZiAoYXR0cnNba2V5XSAhPT0gb2JqW2tleV0pXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJ1biBhIGZ1bmN0aW9uICoqbioqIHRpbWVzLlxuICBfLnRpbWVzID0gZnVuY3Rpb24obiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgYWNjdW0gPSBBcnJheShNYXRoLm1heCgwLCBuKSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIGFjY3VtW2ldID0gaXRlcmF0b3IuY2FsbChjb250ZXh0LCBpKTtcbiAgICByZXR1cm4gYWNjdW07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gYW5kIG1heCAoaW5jbHVzaXZlKS5cbiAgXy5yYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIGlmIChtYXggPT0gbnVsbCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG4gIH07XG5cbiAgLy8gQSAocG9zc2libHkgZmFzdGVyKSB3YXkgdG8gZ2V0IHRoZSBjdXJyZW50IHRpbWVzdGFtcCBhcyBhbiBpbnRlZ2VyLlxuICBfLm5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkgeyByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7IH07XG5cbiAgLy8gTGlzdCBvZiBIVE1MIGVudGl0aWVzIGZvciBlc2NhcGluZy5cbiAgdmFyIGVudGl0eU1hcCA9IHtcbiAgICBlc2NhcGU6IHtcbiAgICAgICcmJzogJyZhbXA7JyxcbiAgICAgICc8JzogJyZsdDsnLFxuICAgICAgJz4nOiAnJmd0OycsXG4gICAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICAgIFwiJ1wiOiAnJiN4Mjc7J1xuICAgIH1cbiAgfTtcbiAgZW50aXR5TWFwLnVuZXNjYXBlID0gXy5pbnZlcnQoZW50aXR5TWFwLmVzY2FwZSk7XG5cbiAgLy8gUmVnZXhlcyBjb250YWluaW5nIHRoZSBrZXlzIGFuZCB2YWx1ZXMgbGlzdGVkIGltbWVkaWF0ZWx5IGFib3ZlLlxuICB2YXIgZW50aXR5UmVnZXhlcyA9IHtcbiAgICBlc2NhcGU6ICAgbmV3IFJlZ0V4cCgnWycgKyBfLmtleXMoZW50aXR5TWFwLmVzY2FwZSkuam9pbignJykgKyAnXScsICdnJyksXG4gICAgdW5lc2NhcGU6IG5ldyBSZWdFeHAoJygnICsgXy5rZXlzKGVudGl0eU1hcC51bmVzY2FwZSkuam9pbignfCcpICsgJyknLCAnZycpXG4gIH07XG5cbiAgLy8gRnVuY3Rpb25zIGZvciBlc2NhcGluZyBhbmQgdW5lc2NhcGluZyBzdHJpbmdzIHRvL2Zyb20gSFRNTCBpbnRlcnBvbGF0aW9uLlxuICBfLmVhY2goWydlc2NhcGUnLCAndW5lc2NhcGUnXSwgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgX1ttZXRob2RdID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICBpZiAoc3RyaW5nID09IG51bGwpIHJldHVybiAnJztcbiAgICAgIHJldHVybiAoJycgKyBzdHJpbmcpLnJlcGxhY2UoZW50aXR5UmVnZXhlc1ttZXRob2RdLCBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgICByZXR1cm4gZW50aXR5TWFwW21ldGhvZF1bbWF0Y2hdO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gSWYgdGhlIHZhbHVlIG9mIHRoZSBuYW1lZCBgcHJvcGVydHlgIGlzIGEgZnVuY3Rpb24gdGhlbiBpbnZva2UgaXQgd2l0aCB0aGVcbiAgLy8gYG9iamVjdGAgYXMgY29udGV4dDsgb3RoZXJ3aXNlLCByZXR1cm4gaXQuXG4gIF8ucmVzdWx0ID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkgcmV0dXJuIHZvaWQgMDtcbiAgICB2YXIgdmFsdWUgPSBvYmplY3RbcHJvcGVydHldO1xuICAgIHJldHVybiBfLmlzRnVuY3Rpb24odmFsdWUpID8gdmFsdWUuY2FsbChvYmplY3QpIDogdmFsdWU7XG4gIH07XG5cbiAgLy8gQWRkIHlvdXIgb3duIGN1c3RvbSBmdW5jdGlvbnMgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEdlbmVyYXRlIGEgdW5pcXVlIGludGVnZXIgaWQgKHVuaXF1ZSB3aXRoaW4gdGhlIGVudGlyZSBjbGllbnQgc2Vzc2lvbikuXG4gIC8vIFVzZWZ1bCBmb3IgdGVtcG9yYXJ5IERPTSBpZHMuXG4gIHZhciBpZENvdW50ZXIgPSAwO1xuICBfLnVuaXF1ZUlkID0gZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgdmFyIGlkID0gKytpZENvdW50ZXIgKyAnJztcbiAgICByZXR1cm4gcHJlZml4ID8gcHJlZml4ICsgaWQgOiBpZDtcbiAgfTtcblxuICAvLyBCeSBkZWZhdWx0LCBVbmRlcnNjb3JlIHVzZXMgRVJCLXN0eWxlIHRlbXBsYXRlIGRlbGltaXRlcnMsIGNoYW5nZSB0aGVcbiAgLy8gZm9sbG93aW5nIHRlbXBsYXRlIHNldHRpbmdzIHRvIHVzZSBhbHRlcm5hdGl2ZSBkZWxpbWl0ZXJzLlxuICBfLnRlbXBsYXRlU2V0dGluZ3MgPSB7XG4gICAgZXZhbHVhdGUgICAgOiAvPCUoW1xcc1xcU10rPyklPi9nLFxuICAgIGludGVycG9sYXRlIDogLzwlPShbXFxzXFxTXSs/KSU+L2csXG4gICAgZXNjYXBlICAgICAgOiAvPCUtKFtcXHNcXFNdKz8pJT4vZ1xuICB9O1xuXG4gIC8vIFdoZW4gY3VzdG9taXppbmcgYHRlbXBsYXRlU2V0dGluZ3NgLCBpZiB5b3UgZG9uJ3Qgd2FudCB0byBkZWZpbmUgYW5cbiAgLy8gaW50ZXJwb2xhdGlvbiwgZXZhbHVhdGlvbiBvciBlc2NhcGluZyByZWdleCwgd2UgbmVlZCBvbmUgdGhhdCBpc1xuICAvLyBndWFyYW50ZWVkIG5vdCB0byBtYXRjaC5cbiAgdmFyIG5vTWF0Y2ggPSAvKC4pXi87XG5cbiAgLy8gQ2VydGFpbiBjaGFyYWN0ZXJzIG5lZWQgdG8gYmUgZXNjYXBlZCBzbyB0aGF0IHRoZXkgY2FuIGJlIHB1dCBpbnRvIGFcbiAgLy8gc3RyaW5nIGxpdGVyYWwuXG4gIHZhciBlc2NhcGVzID0ge1xuICAgIFwiJ1wiOiAgICAgIFwiJ1wiLFxuICAgICdcXFxcJzogICAgICdcXFxcJyxcbiAgICAnXFxyJzogICAgICdyJyxcbiAgICAnXFxuJzogICAgICduJyxcbiAgICAnXFx0JzogICAgICd0JyxcbiAgICAnXFx1MjAyOCc6ICd1MjAyOCcsXG4gICAgJ1xcdTIwMjknOiAndTIwMjknXG4gIH07XG5cbiAgdmFyIGVzY2FwZXIgPSAvXFxcXHwnfFxccnxcXG58XFx0fFxcdTIwMjh8XFx1MjAyOS9nO1xuXG4gIC8vIEphdmFTY3JpcHQgbWljcm8tdGVtcGxhdGluZywgc2ltaWxhciB0byBKb2huIFJlc2lnJ3MgaW1wbGVtZW50YXRpb24uXG4gIC8vIFVuZGVyc2NvcmUgdGVtcGxhdGluZyBoYW5kbGVzIGFyYml0cmFyeSBkZWxpbWl0ZXJzLCBwcmVzZXJ2ZXMgd2hpdGVzcGFjZSxcbiAgLy8gYW5kIGNvcnJlY3RseSBlc2NhcGVzIHF1b3RlcyB3aXRoaW4gaW50ZXJwb2xhdGVkIGNvZGUuXG4gIF8udGVtcGxhdGUgPSBmdW5jdGlvbih0ZXh0LCBkYXRhLCBzZXR0aW5ncykge1xuICAgIHZhciByZW5kZXI7XG4gICAgc2V0dGluZ3MgPSBfLmRlZmF1bHRzKHt9LCBzZXR0aW5ncywgXy50ZW1wbGF0ZVNldHRpbmdzKTtcblxuICAgIC8vIENvbWJpbmUgZGVsaW1pdGVycyBpbnRvIG9uZSByZWd1bGFyIGV4cHJlc3Npb24gdmlhIGFsdGVybmF0aW9uLlxuICAgIHZhciBtYXRjaGVyID0gbmV3IFJlZ0V4cChbXG4gICAgICAoc2V0dGluZ3MuZXNjYXBlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5pbnRlcnBvbGF0ZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuZXZhbHVhdGUgfHwgbm9NYXRjaCkuc291cmNlXG4gICAgXS5qb2luKCd8JykgKyAnfCQnLCAnZycpO1xuXG4gICAgLy8gQ29tcGlsZSB0aGUgdGVtcGxhdGUgc291cmNlLCBlc2NhcGluZyBzdHJpbmcgbGl0ZXJhbHMgYXBwcm9wcmlhdGVseS5cbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzb3VyY2UgPSBcIl9fcCs9J1wiO1xuICAgIHRleHQucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbihtYXRjaCwgZXNjYXBlLCBpbnRlcnBvbGF0ZSwgZXZhbHVhdGUsIG9mZnNldCkge1xuICAgICAgc291cmNlICs9IHRleHQuc2xpY2UoaW5kZXgsIG9mZnNldClcbiAgICAgICAgLnJlcGxhY2UoZXNjYXBlciwgZnVuY3Rpb24obWF0Y2gpIHsgcmV0dXJuICdcXFxcJyArIGVzY2FwZXNbbWF0Y2hdOyB9KTtcblxuICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGVzY2FwZSArIFwiKSk9PW51bGw/Jyc6Xy5lc2NhcGUoX190KSkrXFxuJ1wiO1xuICAgICAgfVxuICAgICAgaWYgKGludGVycG9sYXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgaW50ZXJwb2xhdGUgKyBcIikpPT1udWxsPycnOl9fdCkrXFxuJ1wiO1xuICAgICAgfVxuICAgICAgaWYgKGV2YWx1YXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIic7XFxuXCIgKyBldmFsdWF0ZSArIFwiXFxuX19wKz0nXCI7XG4gICAgICB9XG4gICAgICBpbmRleCA9IG9mZnNldCArIG1hdGNoLmxlbmd0aDtcbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcbiAgICBzb3VyY2UgKz0gXCInO1xcblwiO1xuXG4gICAgLy8gSWYgYSB2YXJpYWJsZSBpcyBub3Qgc3BlY2lmaWVkLCBwbGFjZSBkYXRhIHZhbHVlcyBpbiBsb2NhbCBzY29wZS5cbiAgICBpZiAoIXNldHRpbmdzLnZhcmlhYmxlKSBzb3VyY2UgPSAnd2l0aChvYmp8fHt9KXtcXG4nICsgc291cmNlICsgJ31cXG4nO1xuXG4gICAgc291cmNlID0gXCJ2YXIgX190LF9fcD0nJyxfX2o9QXJyYXkucHJvdG90eXBlLmpvaW4sXCIgK1xuICAgICAgXCJwcmludD1mdW5jdGlvbigpe19fcCs9X19qLmNhbGwoYXJndW1lbnRzLCcnKTt9O1xcblwiICtcbiAgICAgIHNvdXJjZSArIFwicmV0dXJuIF9fcDtcXG5cIjtcblxuICAgIHRyeSB7XG4gICAgICByZW5kZXIgPSBuZXcgRnVuY3Rpb24oc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaicsICdfJywgc291cmNlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEpIHJldHVybiByZW5kZXIoZGF0YSwgXyk7XG4gICAgdmFyIHRlbXBsYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIHJlbmRlci5jYWxsKHRoaXMsIGRhdGEsIF8pO1xuICAgIH07XG5cbiAgICAvLyBQcm92aWRlIHRoZSBjb21waWxlZCBmdW5jdGlvbiBzb3VyY2UgYXMgYSBjb252ZW5pZW5jZSBmb3IgcHJlY29tcGlsYXRpb24uXG4gICAgdGVtcGxhdGUuc291cmNlID0gJ2Z1bmN0aW9uKCcgKyAoc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaicpICsgJyl7XFxuJyArIHNvdXJjZSArICd9JztcblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfTtcblxuICAvLyBBZGQgYSBcImNoYWluXCIgZnVuY3Rpb24sIHdoaWNoIHdpbGwgZGVsZWdhdGUgdG8gdGhlIHdyYXBwZXIuXG4gIF8uY2hhaW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXyhvYmopLmNoYWluKCk7XG4gIH07XG5cbiAgLy8gT09QXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuICAvLyBJZiBVbmRlcnNjb3JlIGlzIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLCBpdCByZXR1cm5zIGEgd3JhcHBlZCBvYmplY3QgdGhhdFxuICAvLyBjYW4gYmUgdXNlZCBPTy1zdHlsZS4gVGhpcyB3cmFwcGVyIGhvbGRzIGFsdGVyZWQgdmVyc2lvbnMgb2YgYWxsIHRoZVxuICAvLyB1bmRlcnNjb3JlIGZ1bmN0aW9ucy4gV3JhcHBlZCBvYmplY3RzIG1heSBiZSBjaGFpbmVkLlxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjb250aW51ZSBjaGFpbmluZyBpbnRlcm1lZGlhdGUgcmVzdWx0cy5cbiAgdmFyIHJlc3VsdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0aGlzLl9jaGFpbiA/IF8ob2JqKS5jaGFpbigpIDogb2JqO1xuICB9O1xuXG4gIC8vIEFkZCBhbGwgb2YgdGhlIFVuZGVyc2NvcmUgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyIG9iamVjdC5cbiAgXy5taXhpbihfKTtcblxuICAvLyBBZGQgYWxsIG11dGF0b3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBlYWNoKFsncG9wJywgJ3B1c2gnLCAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iaiA9IHRoaXMuX3dyYXBwZWQ7XG4gICAgICBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKChuYW1lID09ICdzaGlmdCcgfHwgbmFtZSA9PSAnc3BsaWNlJykgJiYgb2JqLmxlbmd0aCA9PT0gMCkgZGVsZXRlIG9ialswXTtcbiAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBvYmopO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEFkZCBhbGwgYWNjZXNzb3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBlYWNoKFsnY29uY2F0JywgJ2pvaW4nLCAnc2xpY2UnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgbWV0aG9kLmFwcGx5KHRoaXMuX3dyYXBwZWQsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH0pO1xuXG4gIF8uZXh0ZW5kKF8ucHJvdG90eXBlLCB7XG5cbiAgICAvLyBTdGFydCBjaGFpbmluZyBhIHdyYXBwZWQgVW5kZXJzY29yZSBvYmplY3QuXG4gICAgY2hhaW46IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fY2hhaW4gPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8vIEV4dHJhY3RzIHRoZSByZXN1bHQgZnJvbSBhIHdyYXBwZWQgYW5kIGNoYWluZWQgb2JqZWN0LlxuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl93cmFwcGVkO1xuICAgIH1cblxuICB9KTtcblxuICAvLyBBTUQgcmVnaXN0cmF0aW9uIGhhcHBlbnMgYXQgdGhlIGVuZCBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIEFNRCBsb2FkZXJzXG4gIC8vIHRoYXQgbWF5IG5vdCBlbmZvcmNlIG5leHQtdHVybiBzZW1hbnRpY3Mgb24gbW9kdWxlcy4gRXZlbiB0aG91Z2ggZ2VuZXJhbFxuICAvLyBwcmFjdGljZSBmb3IgQU1EIHJlZ2lzdHJhdGlvbiBpcyB0byBiZSBhbm9ueW1vdXMsIHVuZGVyc2NvcmUgcmVnaXN0ZXJzXG4gIC8vIGFzIGEgbmFtZWQgbW9kdWxlIGJlY2F1c2UsIGxpa2UgalF1ZXJ5LCBpdCBpcyBhIGJhc2UgbGlicmFyeSB0aGF0IGlzXG4gIC8vIHBvcHVsYXIgZW5vdWdoIHRvIGJlIGJ1bmRsZWQgaW4gYSB0aGlyZCBwYXJ0eSBsaWIsIGJ1dCBub3QgYmUgcGFydCBvZlxuICAvLyBhbiBBTUQgbG9hZCByZXF1ZXN0LiBUaG9zZSBjYXNlcyBjb3VsZCBnZW5lcmF0ZSBhbiBlcnJvciB3aGVuIGFuXG4gIC8vIGFub255bW91cyBkZWZpbmUoKSBpcyBjYWxsZWQgb3V0c2lkZSBvZiBhIGxvYWRlciByZXF1ZXN0LlxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCd1bmRlcnNjb3JlJywgW10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF87XG4gICAgfSk7XG4gIH1cbn0pLmNhbGwodGhpcyk7XG4iXX0=
