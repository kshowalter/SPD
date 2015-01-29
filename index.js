(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/functions.js":[function(require,module,exports){
'use strict';
var kontainer = require('../lib/kontainer');

var f = {};


f.setup_body = function(title, sections){
    document.title = title;
    var body = document.body;
    var status_bar = document.createElement('div');
    status_bar.id = 'status';
    status_bar.innerHTML = 'loading status...';
    body.insertBefore(status_bar, body.firstChild);
};

f.pad_zero = function(num, size){
    var s = '000000000' + num;
    return s.substr(s.length-size);
};

f.uptime = function(boot_time){
    var uptime_seconds_total = moment().diff(boot_time, 'seconds');
    var uptime_hours = Math.floor(  uptime_seconds_total /(60*60) );
    var minutes_left = uptime_seconds_total %(60*60);
    var uptime_minutes = f.pad_zero( Math.floor(  minutes_left /60 ), 2 );
    var uptime_seconds = f.pad_zero( (minutes_left % 60), 2 );
    return uptime_hours +":"+ uptime_minutes +":"+ uptime_seconds;
};

f.update_status_bar = function(status_id, boot_time, string) {
    var status_div = document.getElementById(status_id);
    status_div.innerHTML = string;
    status_div.innerHTML += ' | ';

    var clock = document.createElement('span');
    clock.innerHTML = moment().format('YYYY-MM-DD HH:mm:ss');

    var uptime = document.createElement('span');
    uptime.innerHTML = 'Uptime: ' + f.uptime(boot_time);

    status_div.appendChild(clock);
    status_div.innerHTML += ' | ';
    status_div.appendChild(uptime);
    status_div.innerHTML += ' | ';
};


f.obj_names = function( object ) {
    if( object !== undefined ) {
        var a = [];
        for( var id in object ) {
            if( object.hasOwnProperty(id) )  {
                a.push(id);
            }
        }
        return a;
    }
};

f.object_defined = function(object){
    //console.log(object);
    for( var key in object ){
        if( object.hasOwnProperty(key) ){
            //console.log(key);
            if( object[key] === null || object[key] === undefined ) return false;
        }
    }
    return true;
};

f.section_defined = function(section_name){
    //console.log("-"+section_name);
    //var input_section = g.inputs[section_name];
    var output_section = g.system[section_name];
    for( var key in output_section ){
        if( output_section.hasOwnProperty(key) ){
            //console.log(key);

            if( output_section[key] === undefined || output_section[key] === null ) {
                return false;
            }
        }
    }
    return true;
};

f.nullToObject = function(object){
    for( var key in object ){
        if( object.hasOwnProperty(key) ){
            if( object[key] === null ){
                object[key] = {};
            } else if( typeof object[key] === 'object' ) {
                object[key] = f.nullToObject(object[key]);
            }
        }
    }
    return object;
};

f.blank_copy = function(object){
    var newObject = {};
    for( var key in object ){
        if( object.hasOwnProperty(key) ){
            if( object[key].constructor === Object ) {
                newObject[key] = {};
                for( var key2 in object[key] ){
                    if( object[key].hasOwnProperty(key2) ){
                        newObject[key][key2] = null;
                    }
                }
            } else {
                newObject[key] = null;
            }
        }
    }
    return newObject;
};

f.blank_clean_copy = function(object){
    var newObject = {};
    for( var key in object ){
        if( object.hasOwnProperty(key) ){
            if( object[key].constructor === Object ) {
                newObject[key] = {};
                for( var key2 in object[key] ){
                    if( object[key].hasOwnProperty(key2) ){
                        var clean_key = f.clean_name(key2);
                        newObject[key][clean_key] = null;
                    }
                }
            } else {
                newObject[key] = null;
            }
        }
    }
    return newObject;
};

f.merge_objects = function merge_objects(object1, object2){
    for( var key in object1 ){
        if( object1.hasOwnProperty(key) ){
            //if( key === 'make' ) console.log(key, object1, typeof object1[key], typeof object2[key]);
            //console.log(key, object1, typeof object1[key], typeof object2[key]);
            if( object1[key] && object1[key].constructor === Object ) {
                if( object2[key] === undefined ) object2[key] = {};
                merge_objects( object1[key], object2[key] );
            } else {
                if( object2[key] === undefined ) object2[key] = null;
            }
        }
    }
};

f.array_to_object = function(arr) {
    var r = {};
    for (var i = 0; i < arr.length; ++i)
        r[i] = arr[i];
    return r;
};

f.nan_check = function nan_check(object, path){
    if( path === undefined ) path = "";
    path = path+".";
    for( var key in object ){
        //console.log( "NaNcheck: "+path+key );

        if( object[key] && object[key].constructor === Array ) object[key] = f.array_to_object(object[key]);


        if(  object[key] && ( object.hasOwnProperty(key) || object[key] !== null )){
            if( object[key].constructor === Object ){
                //console.log( "  Object: "+path+key );
                nan_check( object[key], path+key );
            } else if( object[key] === NaN || object[key] === null ){
                console.log( "NaN: "+path+key );
            } else {
                //console.log( "Defined: "+path+key, object[key]);

            }
        }

    }
};

f.str_to_num = function str_to_num(input){
    var output;
    if(!isNaN(input)) output = Number(input);
    else output = input;
    return output;
};


f.pretty_word = function(name){
    return name.charAt(0).toUpperCase() + name.slice(1);
};

f.pretty_name = function(name){
    var l = name.split('_');
    l.forEach(function(name_seqment,i){
        l[i] = f.pretty_word(name_seqment);
    });
    var pretty = l.join(' ');

    return pretty;
};

f.pretty_names = function(object){
    var new_object = {};
    for( var key in object ){
        if( object.hasOwnProperty(key) ){
            var new_key = f.pretty_name(key);
            new_object[new_key] = object[key];
        }
    }
    return new_object;
};

f.clean_name = function(name){
    return name.split(' ')[0];
};


f.mk_drawer = function(title, content){
    var drawer_container = $('<div>')
                            .attr('class', 'input_section')
                            .attr('id', 'section_'+title);
                            //.attr('id', title );
    //drawer_container.get(0).style.display = display_type;
    var system_div = $('<div>').attr('class', 'title_bar')
        .attr('section_nom', title)
        .appendTo(drawer_container)
        /* jshint -W083 */
        .click(function(){
            var name = $(this).attr('section_nom');
            g.webpage.selections_manual_toggled[name] = true;
            $(this).parent().children('.drawer').children('.drawer_content').slideToggle('fast');
        });
    var system_title = $('<a>')
        .attr('class', 'title_bar_text')
        .attr('href', '#')
        .text(f.pretty_name(title))
        .appendTo(system_div);

    var drawer = $('<div>').attr('class', 'drawer').appendTo(drawer_container);
    content.attr('class', 'drawer_content').appendTo(drawer);


    return drawer_container;


};


f.add_selectors = function(settings, parent_container){
    for( var section_name in settings.inputs ){

        //$(this).trigger('click');
        var drawer_content = $('<div>');
        for( var input_name in settings.inputs[section_name] ){
            var units;
            if( (settings.inputs[section_name][input_name] !== undefined) && (settings.inputs[section_name][input_name].units !== undefined) ) {
                units = "(" + settings.inputs[section_name][input_name].units + ")";
            } else {
                units = "";
            }
            var note;
            if( (settings.inputs[section_name][input_name] !== undefined) && (settings.inputs[section_name][input_name].note !== undefined) ) {
                note = settings.inputs[section_name][input_name].note;
            } else {
                note = false;
            }




            var selector_set = $('<span>').attr('class', 'selector_set').appendTo(drawer_content);
            var input_text = $('<span>').html(f.pretty_name(input_name) + ': ' + units ).appendTo(selector_set);
            if( note ) input_text.attr('title', note);
            /*
            var selector = k$('selector')
                .setOptionsRef( 'inputs.' + section_name + '.' + input_name )
                .setRef( 'system.' + section_name + '.' + input_name )
                .appendTo(selector_set);
            f.kelem_setup(selector, settings);
            //*/
            var selector = {
                system_ref: Object.create(kontainer).obj(settings).ref('system.' + section_name + '.' + input_name),
                //input_ref: Object.create(kontainer).obj(settings).ref('inputs.' + section_name + '.' + input_name + '.value'),
                list_ref: Object.create(kontainer).obj(settings).ref('inputs.' + section_name + '.' + input_name + '.options'),
                interacted: false,
            };
            if( (settings.inputs[section_name][input_name] !== undefined) && (settings.inputs[section_name][input_name].type !== undefined) ) {
                selector.type = settings.inputs[section_name][input_name].type;
            } else {
                selector.type = 'select';
            }
            if( selector.type === 'select' ){
                selector.elem = $('<select>')
                    .attr('class', 'selector')
                    .appendTo(selector_set)
                    .get()[0];
                selector.value = function(){
                    //console.log( this.set_ref.refString, this.elem.selectedIndex );
                    //if( this.interacted )
                    if( this.elem.selectedIndex >= 0) return this.elem.options[this.elem.selectedIndex].value;
                    else return false;
                };
                f.selector_add_options(selector);

            } else if( selector.type === 'number_input' || selector.type === 'text_input'){
                selector.elem = $('<input>')
                    .attr('class', selector.type)
                    .attr('type', 'text')
                    .appendTo(selector_set)
                    .get()[0];
                selector.value = function(){
                    //console.log( this.set_ref.refString, this.elem.selectedIndex );
                    //console.log( this.elem, this.elem.value );
                    //if( this.interacted )
                    //if( this.elem.selectedIndex >= 0) return this.elem.options[this.elem.selectedIndex].value;
                    //else return false;
                    return this.elem.value;
                };
                selector.elem.value = selector.system_ref.get();
            }
            $(selector.elem).change(function(event){
                settings.f.update();
            });
            settings.select_registry.push(selector);
            //$('</br>').appendTo(drawer_content);

        }

        var selection_container = f.mk_drawer(section_name, drawer_content);

        selection_container.appendTo(parent_container);

        $(selection_container).children('.drawer').children('.drawer_content').slideUp('fast');
    }
};

f.selector_add_options = function(selector){
    var list = selector.list_ref.get();
    if( list && list.constructor === Object ) {
        //console.log('"list"', list);
        list = f.obj_names(list);
    }
    selector.elem.innerHTML = "";
    if( list instanceof Array ){
        var current_value = selector.system_ref.get();
        $('<option>').attr('selected',true).attr('disabled',true).attr('hidden',true).appendTo(selector.elem);

        list.forEach(function(opt_name){
            //console.log(opt_name);
            var o = document.createElement('option');
            o.value = opt_name;
            if( current_value ){
                if( opt_name.toString() === current_value.toString() ) {
                    //console.log('found it:', opt_name);
                    o.selected = "selected";
                } else {
                    //console.log('does not match: ', opt_name, ",",  current_value, "." );
                }
                //o.setAttribute('class', 'selector_option');
            } else {
                //console.log('no current value')
            }
            o.innerHTML = opt_name;
            selector.elem.appendChild(o);
        });

    } else {
        //console.log('list not a list', list, select);
    }
};

f.add_options = function(select, array){
    array.forEach( function(option){
        $('<option>').attr( 'value', option ).text(option).appendTo(select);
    });
};

f.add_params = function(settings, parent_container){
    for( var section_name in settings.system ){
        if( true || f.object_defined(settings.system[section_name]) ){
            var selection_container = $('<div>').attr('class', 'param_section').attr('id', section_name ).appendTo(parent_container);
            //selection_container.get(0).style.display = display_type;
            var system_div = $('<div>')
                .attr('class', 'title_line')
                .appendTo(selection_container)
                /* jshint -W083 */
                .click(function(){
                    $(this).parent().children('.drawer').children('.drawer_content').slideToggle('fast');
                });
            var system_title = $('<a>')
                .attr('class', 'title_line_text')
                .attr('href', '#')
                .text(f.pretty_name(section_name))
                .appendTo(system_div);
            $(this).trigger('click');
            var drawer = $('<div>').attr('class', '').appendTo(selection_container);
            var drawer_content = $('<div>').attr('class', 'param_section_content').appendTo(drawer);
            for( var input_name in settings.system[section_name] ){
                $('<span>').html(f.pretty_name(input_name) + ': ').appendTo(drawer_content);
                /*
                var selector = k$('value')
                    //.setOptionsRef( 'inputs.' + section_name + '.' + input_name )
                    .setRef( 'system.' + section_name + '.' + input_name )
                    .appendTo(drawer_content);
                f.kelem_setup(selector, settings);
                //*/
                var value_kontainer = Object.create(kontainer)
                    .obj(settings)
                    .ref('system.' + section_name + '.' + input_name);
                var $elem = $('<span>')
                    .attr('class', '')
                    .appendTo(drawer_content)
                    .text(value_kontainer.get());
                var value = {
                    elem: $elem.get()[0],
                    value_ref: value_kontainer
                };
                settings.value_registry.push(value);
                $('</br>').appendTo(drawer_content);
            }
        }
    }
};

f.update_values = function(settings){
    settings.value_registry.forEach(function(value_item){
        //console.log( value_item );
        //console.log( value_item.elem.options );
        //console.log( value_item.elem.selectedIndex );
        if(value_item.elem.selectedIndex){
            value_item.value = value_item.elem.options[value_item.elem.selectedIndex].value;
            value_item.kontainer.set(value_item.value);

        }
    });
};

//f.show_hide_params = function(page_sections, settings){
//    for( var list_name in page_sections ){
//        var id = '#'+list_name;
//        var section_name = list_name.split('_')[0];
//        var section = k$(id);
//        if( settings.status.sections[section_name].set ) section.show();
//        else section.hide();
//    }
//};

//f.show_hide_selections = function(settings, active_section_name){
//    $('#sectionSelector').val(active_section_name);
//    for( var list_name in settings.input ){
//        var id = '#'+list_name;
//        var section_name = list_name.split('_')[0];
//        var section = k$(id);
//        if( section_name === active_section_name ) section.show();
//        else section.hide();
//    }
//};

//f.setDownloadLink(settings){
//
//    if( settings.PDF && settings.PDF.url ){
//        var link = $('a').attr('href', settings.PDF.url ).attr('download', 'PV_drawing.pdf').html('Download Drawing');
//        $('#download').html('').append(link);
//    }
//}

//f.loadTables = function(string){
//    var tables = {};
//    var l = string.split('\n');
//    var title;
//    var fields;
//    var need_title = true;
//    var need_fields = true;
//    l.forEach( function(string, i){
//        var line = string.trim();
//        if( line.length === 0 ){
//            need_title = true;
//            need_fields = true;
//        } else if( need_title ) {
//            title = line;
//            tables[title] = [];
//            need_title = false;
//        } else if( need_fields ) {
//            fields = line.split(',');
//            tables[title+"_fields"] = fields;
//            need_fields = false;
//        //} else {
//        //    var entry = {};
//        //    var line_array = line.split(',');
//        //    fields.forEach( function(field, id){
//        //        entry[field.trim()] = line_array[id].trim();
//        //    });
//        //    tables[title].push( entry );
//        //}
//        } else {
//            var line_array = line.split(',');
//            tables[title][line_array[0].trim()] = line_array[1].trim();
//        }
//    });
//
//    return tables;
//};
//
//f.loadComponents = function(string){
//    var db = k.parseCSV(string);
//    var object = {};
//    for( var i in db ){
//        var component = db[i];
//        if( object[component.Make] === undefined ){
//            object[component.Make] = {};
//        }
//        if( object[component.Make][component.Model] === undefined ){
//            object[component.Make][component.Model] = {};
//        }
//
//        var fields = k.objIdArray(component);
//        fields.forEach( function( field ){
//            var param = component[field];
//            if( !( field in ['Make', 'Model'] ) && !( isNaN(parseFloat(param)) ) ){
//                component[field] = parseFloat(param);
//            }
//        })
//        object[component.Make][component.Model] = component;
//    }
//    return object;
//};




f.load_database = function(FSEC_database_JSON){
    FSEC_database_JSON = f.lowercase_properties(FSEC_database_JSON);
    g.components.inverters = {};
    FSEC_database_JSON.inverters.forEach(function(component){
        if( g.components.inverters[component.make] === undefined ) g.components.inverters[component.make] = {};
        //g.components.inverters[component.make][component.make] = f.pretty_names(component);
        g.components.inverters[component.make][component.model] = component;
    });
    g.components.modules = {};
    FSEC_database_JSON.modules.forEach(function(component){
        if( g.components.modules[component.make] === undefined ) g.components.modules[component.make] = {};
        //g.components.modules[component.make][component.make] = f.pretty_names(component);
        g.components.modules[component.make][component.model] = component;
    });

    f.update();
};


f.get_ref = function(string, object){
    var ref_array = string.split('.');
    var level = object;
    ref_array.forEach(function(level_name,i){
        if( typeof level[level_name] === 'undefined' ) {
            return false;
        }
        level = level[level_name];
    });
    return level;
};
f.set_ref = function( object, ref_string, value ){
    var ref_array = ref_string.split('.');
    var level = object;
    ref_array.forEach(function(level_name,i){
        if( typeof level[level_name] === 'undefined' ) {
            return false;
        }
        level = level[level_name];
    });

    return level;
};




f.log_if_database_loaded = function(e){
    if(f.g.state.database_loaded) {
        console.log(e);
    }
};



f.lowercase_properties = function lowercase_properties(obj) {
    var new_object = new obj.constructor();
    for( var old_name in obj ){
        if (obj.hasOwnProperty(old_name)) {
            var new_name = old_name.toLowerCase();
            if( obj[old_name].constructor === Object || obj[old_name].constructor === Array ){
                new_object[new_name] = lowercase_properties(obj[old_name]);
            } else {
                new_object[new_name] = obj[old_name];
            }
        }

    }
    return new_object;
};


f.toggle_module = function(element){
    //console.log('switch', element, element.classLis );

    //element.setAttribute("fill", null);

    var elem = $(element);
    //console.log('switch', elem[0].classList.contains('preview_structural_module') );

    var r = element.getAttribute('module_ID').split(',')[0];
    var c = element.getAttribute('module_ID').split(',')[1];

    if( g.webpage.selected_modules[r][c] ){
        g.webpage.selected_modules[r][c] = false;
        g.webpage.selected_modules_total--;
    } else {
        g.webpage.selected_modules[r][c] = true;
        g.webpage.selected_modules_total++;
    }

    /*
    var layer;
    if( elem[0].classList.contains('svg_preview_structural_module_selected') ){
        //g.webpage.selected_modules[r][c] = true;
        //layer = g.drawing_settings.layer_attr.preview_structural_module;
        //element.setAttribute("class", "svg_preview_structural_module");
    } else {
        g.webpage.selected_modules = g.webpage.selected_modules +1 || 1;
        //layer = g.drawing_settings.layer_attr.preview_structural_module_selected;
        //element.setAttribute("class", "svg_preview_structural_module_selected");
    }
    //*/
    //console.log( g.webpage.selected_modules);
    //for( var attr_name in layer ){
    //    element.setAttribute(attr_name, layer[attr_name]);

    //}

    g.f.update();

    /*
    if( elem.hasClass("svg_preview_structural_module") ){
        elem.removeClass("svg_preview_structural_module");
        elem.addClass("svg_preview_structural_module_selected");
    } else if( elem.hasClass("svg_preview_structural_module_selected") ){
        elem.removeClass("svg_preview_structural_module_selected");
        elem.addClass("svg_preview_structural_module");
    } else {
        elem.addClass("svg_preview_structural_module");
    }
    */
};


f.clear_object = function(obj){
    for( var id in obj ){
        if( obj.hasOwnProperty(id)){
            delete obj[id];
        }
    }
};

// clear drawing
f.clear_drawing = function() {
    for( var id in g.drawing ){
        if( g.drawing.hasOwnProperty(id)){
            f.clear_object(g.drawing[id]);
        }
    }
};



f.query_string = function () {
  // Based on
  // http://stackoverflow.com/a/979995
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  var i;
  for ( i=0; i<vars.length; i++ ) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = pair[1];
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
        var arr = [ query_string[pair[0]], pair[1] ];
        query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
        query_string[pair[0]].push(pair[1]);
    }
  }
  return query_string;
};

f.request_geocode = function(){
    if( f.section_defined('location') ){
        var address_new = g.perm.location.new_address;

        if( address_new || g.perm.location.lat === undefined || g.perm.location.lat === undefined ) {
            console.log('new address');
            var address = encodeURIComponent([
                    g.perm.location.address,
                    g.perm.location.city,
                    'FL',
                    g.perm.location.zip
                ].join(', ') );
            //console.log(address);
            $('#geocode_display').text('Requesting coordinates...');
            $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + address, f.set_coordinates_from_geocode );

        } else {
            $('#geocode_display').text('Address unchanged');
            f.set_coordinates_from_geocode();
        }
    } else {
        $('#geocode_display').text('Please enter address');
    }
};


f.set_sat_map_marker = function(){
    var latlng = L.latLng( g.perm.location.lat, g.perm.location.lon );
    g.perm.maps.marker_sat.setLatLng( latlng );
    g.perm.maps.marker_road.setLatLng( latlng );
    g.perm.maps.map_sat.setView( latlng );
};

f.set_coordinates_from_map = function(e){
    g.perm.location.lat = e.latlng.lat;
    g.perm.location.lon = e.latlng.lng;
    f.update();
};

f.set_coordinates_from_geocode = function(data){
    if( data === undefined && g.perm.location.lat !== undefined ){ // loading last locations
        g.perm.location.lat = g.perm.geocode.lat;
        g.perm.location.lon = g.perm.geocode.lon;
        f.update();
    } else if( data[0] !== undefined ){
        $('#geocode_display').text('Address loaded');
        console.log('New location from address', data);
        g.perm.geocode.data = data;
        g.perm.geocode.lat = data[0].lat;
        g.perm.geocode.lon = data[0].lon;
        g.perm.location.lat = g.perm.geocode.lat;
        g.perm.location.lon = g.perm.geocode.lon;
        f.update();
    } else {
        $('#geocode_display').text('Address not found');
    }
};



module.exports = f;

},{"../lib/kontainer":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/kontainer.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_blocks.js":[function(require,module,exports){
var mk_drawing = require('./mk_drawing');

//var drawing_parts = [];
//d.link_drawing_parts(drawing_parts);

var page = function(){
    console.log("** Making page 2");
    d = mk_drawing();

    var f = g.f;

    //var components = g.components;
    //var system = g.system;
    var system = g.system;

    var size = g.drawing_settings.size;
    var loc = g.drawing_settings.loc;




    var x, y, h, w;
    var offset;

// Define d.blocks

// module d.block
    w = size.module.frame.w;
    h = size.module.frame.h;

    d.block_start('module');

    // frame
    d.layer('module');
    x = 0;
    y = 0+size.module.lead;
    d.rect( [x,y+h/2], [w,h] );
    // frame triangle?
    d.line([
        [x-w/2,y],
        [x,y+w/2],
    ]);
    d.line([
        [x,y+w/2],
        [x+w/2,y],
    ]);
    // leads
    d.layer('DC_pos');
    d.line([
        [x, y],
        [x, y-size.module.lead]
    ]);
    d.layer('DC_neg');
    d.line([
        [x, y+h],
        [x, y+h+(size.module.lead)]
    ]);
    // pos sign
    d.layer('text');
    d.text(
        [x+size.module.lead/2, y-size.module.lead/2],
        '+',
        'signs'
    );
    // neg sign
    d.text(
        [x+size.module.lead/2, y+h+size.module.lead/2],
        '-',
        'signs'
    );
    // ground
    d.layer('DC_ground');
    d.line([
        [x-w/2, y+h/2],
        [x-w/2-w/4, y+h/2],
    ]);

    d.layer();
    d.block_end();

//#string
    d.block_start('string');

    x = 0;
    y = 0;





    var max_displayed_modules = 9;
    var break_string = false;

    if( system.array.modules_per_string > max_displayed_modules ){
        displayed_modules = max_displayed_modules - 1;
        break_string = true;
        size.string.h = (size.module.h * (displayed_modules+1) ) + size.string.gap_missing;
    } else {
        displayed_modules = system.array.modules_per_string;
        size.string.h = (size.module.h * displayed_modules);
    }
    loc.array.lower = loc.array.upper + size.string.h;

    size.string.h_max = (size.module.h * max_displayed_modules) + size.string.gap_missing;
    loc.array.lower_limit = loc.array.upper + size.string.h_max;



    for( var r=0; r<displayed_modules; r++){
        d.block('module', [x,y]);
        y += size.module.h;

    }
    if( break_string ) {
        d.line(
            [
                [x,y],
                [x,y+size.string.gap_missing],
            //[x-size.module.frame.w*3/4, y+size.string.h + size.wire_offset.ground ],
            ],
            'DC_intermodule'
        );

        y += size.string.gap_missing;
        d.block('module', [x,y]);
    }

    x = 0;
    y = 0;

    //TODO: add loop to jump over negative return wires
    d.layer('DC_ground');
    d.line([
        [x-size.module.frame.w*3/4, y+size.module.h/2],
        [x-size.module.frame.w*3/4, y+size.string.h_max + size.wire_offset.ground],
        //[x-size.module.frame.w*3/4, y+size.string.h + size.wire_offset.ground ],
    ]);
    d.layer();


    d.block_end();


// terminal
    d.block_start('terminal');
    x = 0;
    y = 0;

    d.layer('terminal');
    d.circ(
        [x,y],
        size.terminal_diam
    );
    d.layer();
    d.block_end();

// fuse

    d.block_start('fuse');
    x = 0;
    y = 0;
    w = 10;
    h = 5;

    d.layer('terminal');
    d.rect(
        [x,y],
        [w,h]
    );
    d.line( [
        [w/2,y],
        [w/2+size.fuse.w, y]
    ]);
    d.block('terminal', [size.fuse.w, y] );

    d.line( [
        [-w/2,y],
        [-w/2-size.fuse.w, y]
    ]);
    d.block('terminal', [-size.fuse.w, y] );

    d.layer();
    d.block_end();

// ground symbol
    d.block_start('ground');
    x = 0;
    y = 0;

    d.layer('AC_ground');
    d.line([
        [x,y],
        [x,y+40],
    ]);
    y += 25;
    d.line([
        [x-7.5,y],
        [x+7.5,y],
    ]);
    y += 5;
    d.line([
        [x-5,y],
        [x+5,y],
    ]);
    y += 5;
    d.line([
        [x-2.5,y],
        [x+2.5,y],
    ]);
    d.layer();

    d.block_end();



// North arrow
    x = 0;
    y = 0;

    var arrow_w = 7;
    var letter_h = 14;
    var arrow_h = 50;

    d.block_start('north arrow_up');
    d.layer('north_letter');
    d.line([
        [x, y+letter_h],
        [x, y],
        [x+arrow_w, y+letter_h],
        [x+arrow_w, y],
    ]);
    d.layer('north_arrow');
    d.line([
        [x, y+arrow_h],
        [x, y],
        [x+arrow_w/2, y+letter_h/2],
    ]);
    d.line([
        [x, y],
        [x-arrow_w/2, y+letter_h/2],
    ]);
    d.layer();
    d.block_end('north arrow');

    d.block_start('north arrow_left');
    d.layer('north_letter');
    d.line([
        [x+letter_h, y],
        [x, y],
        [x+letter_h, y-arrow_w],
        [x,          y-arrow_w],
    ]);
    d.layer('north_arrow');
    d.line([
        [x+arrow_h, y],
        [x, y],
        [x+letter_h/2, y-arrow_w/2],
    ]);
    d.line([
        [x, y],
        [x+letter_h/2, y+arrow_w/2],
    ]);
    d.layer();
    d.block_end('north arrow');

//*/

    return d.drawing_parts;
};



module.exports = page;

},{"./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_border.js":[function(require,module,exports){
var mk_drawing = require('./mk_drawing');

//var drawing_parts = [];
//d.link_drawing_parts(drawing_parts);

var add_border = function(settings, sheet_section, sheet_num){
    d = mk_drawing();
    var f = settings.f;

    //var components = settings.components;
    //var system = settings.system;
    var system = settings.system;

    var size = settings.drawing_settings.size;
    var loc = settings.drawing_settings.loc;




    var x, y, h, w;
    var offset;

// Define d.blocks
// module d.block
    w = size.module.frame.w;
    h = size.module.frame.h;





////////////////////////////////////////
// Frame
    d.section('Frame');

    w = size.drawing.w;
    h = size.drawing.h;
    var padding = size.drawing.frame_padding;

    d.layer('frame');

    //border
    d.rect( [w/2 , h/2], [w - padding*2, h - padding*2 ] );

    x = w - padding * 3;
    y = padding * 3;

    w = size.drawing.titlebox;
    h = size.drawing.titlebox;

    // box top-right
    d.rect( [x-w/2, y+h/2], [w,h] );

    y += h + padding;

    w = size.drawing.titlebox;
    h = size.drawing.h - padding*8 - size.drawing.titlebox*2.5;

    //title box
    d.rect( [x-w/2, y+h/2], [w,h] );

    var title = {};
    title.top = y;
    title.bottom = y+h;
    title.right = x;
    title.left = x-w ;


    // box bottom-right
    h = size.drawing.titlebox * 1.5;
    y = title.bottom + padding;
    x = x-w/2;
    y = y+h/2;
    d.rect( [x, y], [w,h] );

    y -= 20*2/3;
    d.text([x,y],
        [ sheet_section, sheet_num ],
        'page',
        'text'
        );


    var page = {};
    page.right = title.right;
    page.left = title.left;
    page.top = title.bottom + padding;
    page.bottom = page.top + size.drawing.titlebox*1.5;
    // d.text

    x = title.left + padding;
    y = title.bottom - padding;

    x += 10;
    if( system.inverter.make && system.inverter.model ){
        d.text([x,y],
             [ 'PV System Design' ],
            'title1', 'text').rotate(-90);

    }

    x += 14;
    if( g.f.section_defined('location')  ){
        d.text([x,y], [
            g.perm.location.address,
            g.perm.location.city + ', ' + g.perm.location.county + ', FL, ' + g.perm.location.zip,

        ], 'title3', 'text').rotate(-90);
    }

    x = page.left + padding;
    y = page.top + padding;
    y += size.drawing.titlebox * 1.5 * 3/4;







    return d.drawing_parts;
};



module.exports = add_border;

},{"./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_drawing.js":[function(require,module,exports){
'use strict';

var f = require('./functions.js');

//var settings = require('./settings.js');
//var l_attr = settings.drawing.l_attr;
//var _ = require('underscore');
// setup drawing containers

var settings = require('./settings');
var layer_attr = settings.drawing_settings.layer_attr;
var fonts = settings.drawing_settings.fonts;





var drawing = {};









// BLOCKS

var Blk = {
    type: 'block',
};
Blk.move = function(x, y){
    for( var i in this.drawing_parts ){
        this.drawing_parts[i].move(x,y);
    }
    return this;
};
Blk.add = function(){
    if( typeof this.drawing_parts == 'undefined'){
        this.drawing_parts = [];
    }
    for( var i in arguments){
        this.drawing_parts.push(arguments[i]);
    }
    return this;
};
Blk.rotate = function(deg){
    this.rotate = deg;
};


var block_active = false;
// Create default layer,block container and functions

// Layers

var layer_active = false;

drawing.layer = function(name){ // set current layer
    if( typeof name === 'undefined' ){ // if no layer name given, reset to default
        layer_active = false;
    } else if ( ! (name in layer_attr) ) {
        console.warn('Error: unknown layer "'+name+'", using base');
        layer_active = 'base' ;
    } else { // finaly activate requested layer
        layer_active = name;
    }
    //*/
};

var section_active = false;

drawing.section = function(name){ // set current section
    if( typeof name === 'undefined' ){ // if no section name given, reset to default
        section_active = false;
    } else { // finaly activate requested section
        section_active = name;
    }
    //*/
};


drawing.block_start = function(name) {
    if( typeof name === 'undefined' ){ // if name argument is submitted
        console.log('Error: name required');
    } else {
        var blk;
        block_active = name;
        if( g.drawing.blocks[block_active] !== undefined ){
            console.log('Error: block already exists');
        }
        blk = Object.create(Blk);
        g.drawing.blocks[block_active] = blk;
        return blk;
    }
};

    /*
    x = loc.wire_table.x - w/2;
    y = loc.wire_table.y - h/2;
    if( typeof layer_name !== 'undefined' && (layer_name in layers) ) {
        var layer_selected = layers[layer_name]
    } else {
        if( ! (layer_name in layers) ){ console.log("error, layer does not exist, using current");}
        var layer_selected =  layer_active
    }
    */
drawing.block_end = function() {
    var blk = g.drawing.blocks[block_active];
    block_active = false;
    return blk;
};






//////
// build prototype element

    /*
    if( typeof layer_name !== 'undefined' && (layer_name in layers) ) {
        var layer_selected = layers[layer_name]
    } else {
        if( ! (layer_name in layers) ){ console.log("error, layer does not exist, using current");}
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
// functions for adding drawing_parts

drawing.add = function(type, points, layer_name, attrs) {
    if( points[0] === undefined ) console.warn("points not deffined", type, points, layer_name );

    if( typeof layer_name === 'undefined' ) { layer_name = layer_active; }
    if( ! (layer_name in layer_attr) ) {
        console.warn('Error: Layer "'+ layer_name +'" name not found, using base');
        layer_name = 'base';
    }

    if( typeof points == 'string') {
        var points_a = points.split(' ');
        for( var i in points_a ) {
            points_a[i] = points_a[i].split(',');
            for( var c in points_a[i] ) {
                points_a[i][c] = Number(points_a[i][c]);
            }
        }
    }

    var elem = Object.create(SvgElem);
    elem.type = type;
    elem.layer_name = layer_name;
    elem.section_name = section_active;
    if( attrs !== undefined ) elem.attrs = attrs;
    if( type === 'line' ) {
        elem.points = points;
    } else if( type === 'poly' ) {
        elem.points = points;
    } else if( typeof points[0].x === 'undefined') {
        elem.x = points[0][0];
        elem.y = points[0][1];
    } else {
        elem.x = points[0].x;
        elem.y = points[0].y;
    }

    if(block_active) {
        elem.block_name = block_active;
        g.drawing.blocks[block_active].add(elem);
    } else {
        this.drawing_parts.push(elem);
    }

    return elem;
};

drawing.line = function(points, layer, attrs){ // (points, [layer])
    //return add('line', points, layer)
    var line =  this.add('line', points, layer, attrs);
    return line;
};

drawing.poly = function(points, layer, attrs){ // (points, [layer])
    //return add('poly', points, layer)
    var poly =  this.add('poly', points, layer, attrs);
    return poly;
};

drawing.rect = function(loc, size, layer, attrs){
    var rec = this.add('rect', [loc], layer, attrs);
    rec.w = size[0];
    /*
    if( typeof layer_name !== 'undefined' && (layer_name in layers) ) {
        var layer_selected = layers[layer_name]
    } else {
        if( ! (layer_name in layers) ){ console.log("error, layer does not exist, using current");}
        var layer_selected =  layer_active
    }
    */
    rec.h = size[1];
    return rec;
};

drawing.circ = function(loc, diameter, layer, attrs){
    var cir = this.add('circ', [loc], layer, attrs);
    cir.d = diameter;
    return cir;
};

drawing.text = function(loc, strings, font, layer, attrs){
    var txt = this.add('text', [loc], layer, attrs);
    if( typeof strings == 'string'){
        strings = [strings];
    }
    txt.strings = strings;
    txt.font = font;
    return txt;
};

drawing.block = function(name) {// set current block
    var x,y;
    if( arguments.length === 2 ){ // if coor is passed
        if( typeof arguments[1].x !== 'undefined' ){
            x = arguments[1].x;
            y = arguments[1].y;
        } else {
            x = arguments[1][0];
            y = arguments[1][1];
        }
    } else if( arguments.length === 3 ){ // if x,y is passed
        x = arguments[1];
        y = arguments[2];
    }

    // TODO: what if block does not exist? print list of blocks?
    var blk = Object.create(g.drawing.blocks[name]);
    blk.x = x;
    blk.y = y;

    if(block_active){
        g.drawing.blocks[block_active].add(blk);
    } else {
        this.drawing_parts.push(blk);
    }
    return blk;
};










//////////////
// Tables

var Cell = {
    init: function(table, R, C){
        var self = this;
        this.table = table;
        this.R = R;
        this.C = C;
        /*
        this.borders = {};
        this.border_options.forEach(function(side){
            self.borders[side] = false;
        });
        //*/
        return this;
    },
    /*
    border_options: ['T', 'B', 'L', 'R'],
    //*/
    text: function(text){
        this.cell_text = text;
        return this;

    },
    font: function(font_name){
        this.cell_font_name = font_name;
        return this;
    },

    border: function(border_string, state){
        this.table.border( this.R, this.C, border_string, state );
        return this;
    }
};

var Table = {
    init: function( drawing, num_rows, num_cols ){
        this.drawing = drawing;
        this.num_rows = num_rows;
        this.num_cols = num_cols;
        var r,c;

        // setup border containers
        this.borders_rows = [];
        for( r=0; r<=num_rows; r++){
            this.borders_rows[r] = [];
            for( c=1; c<=num_cols; c++){
                this.borders_rows[r][c] = false;
            }
        }
        this.borders_cols = [];
        for( c=0; c<=num_cols; c++){
            this.borders_cols[c] = [];
            for( r=1; r<=num_rows; r++){
                this.borders_cols[c][r] = false;
            }
        }

        // set column and row size containers
        this.row_sizes = [];
        for( r=1; r<=num_rows; r++){
            this.row_sizes[r] = 15;
        }
        this.col_sizes = [];
        for( c=1; c<=num_cols; c++){
            this.col_sizes[c] = 60;
        }

        // setup cell container
        this.cells = [];
        for( r=1; r<=num_rows; r++){
            this.cells[r] = [];
            for( c=1; c<=num_cols; c++){
                this.cells[r][c] = Object.create(Cell);
                this.cells[r][c].init( this, r, c);
            }

        }
        //*/

        return this;
    },
    loc: function( x, y){
        this.x = x;
        this.y = y;
        return this;
    },
    cell: function( R, C ){
        return this.cells[R][C];
    },
    all_cells: function(){
        var cell_array = [];
        this.cells.forEach(function(row){
            row.forEach(function(cell){
                cell_array.push(cell);
            });
        });
        return cell_array;
    },
    col_size: function(col, size){
        if( typeof col === 'string' ){
            if( col === 'all'){
                _.range(this.num_cols).forEach(function(c){
                    this.col_sizes[c+1] = size;
                },this);
            } else {
                size = Number(size);
                if( isNaN(size) ){
                    console.log('Error: column wrong');
                } else {
                    this.col_sizes[col] = size;
                }
            }
        } else { // is number
            this.col_sizes[col] = size;
        }
        return this;
    },
    //*/
    row_size: function(row, size){
        if( typeof row === 'string' ){
            if( row === 'all'){
                _.range(this.num_rows).forEach(function(r){
                    this.row_sizes[r+1] = size;
                },this);
            } else {
                size = Number(size);
                if( isNaN(size) ){
                    console.log('Error: column wrong');
                } else {
                    this.row_sizes[row] = size;
                }
            }
        } else { // is number
            this.row_sizes[row] = size;
        }
        return this;
    },
    //*/

    /*
    add_cell: function(){

    },
    add_rows: function(n){
        this.num_colmns += n;
        this.num_rows += n;
        _.range(n).forEach(function(){
            this.rows.push([]);
        });
        _.range(n).forEach(function(){
            this.text_rows.push([]);
        });

    },
    text: function( R, C, text){
        this.text_rows[R][C] = text;
    },
    //*/
    border: function( R, C, border_string, state){
        if( state === undefined ) state = true;

        border_string = border_string.toUpperCase().trim();
        var borders;
        if( border_string === 'ALL' ){
            borders = ['T', 'B', 'L', 'R'];
        } else {
            borders = border_string.split(/[\s,]+/);
        }
        borders.forEach(function(side){
            switch(side){
                case 'T':
                    this.borders_rows[R-1][C] = state;
                    break;
                case 'B':
                    this.borders_rows[R][C] = state;
                    break;
                case 'L':
                    this.borders_cols[C-1][R] = state;
                    break;
                case 'R':
                    this.borders_cols[C][R] = state;
                    break;
            }
        }, this);
        return this;
    },
    corner: function(R,C){
        var x = this.x;
        var y = this.y;
        var r,c;
        for( r=1; r<=R; r++ ){
            y += this.row_sizes[r];
        }
        for( c=1; c<=C; c++ ){
            x += this.col_sizes[c];
        }
        return [x,y];
    },
    center: function(R,C){
        var x = this.x;
        var y = this.y;
        var r,c;
        for( r=1; r<=R; r++ ){
            y += this.row_sizes[r];
        }
        for( c=1; c<=C; c++ ){
            x += this.col_sizes[c];
        }
        y -= this.row_sizes[R]/2;
        x -= this.col_sizes[C]/2;
        return [x,y];
    },
    left: function(R,C){
        var coor = this.center(R,C);
        coor[0] = coor[0] - this.col_sizes[C]/2 + this.row_sizes[R]/2;
        return coor;
    },
    right: function(R,C){
        var coor = this.center(R,C);
        coor[0] = coor[0] + this.col_sizes[C]/2 - this.row_sizes[R]/2;
        return coor;
    },
    mk: function(){
        var self = this;
        var r,c;
        for( r=0; r<=this.num_rows; r++ ){
            for( c=1; c<=this.num_cols; c++ ){
                if( this.borders_rows[r][c] === true ){
                    this.drawing.line([
                        this.corner(r,c-1),
                        this.corner(r,c),
                        ], 'border');

                }
            }
        }
        for( c=0; c<=this.num_cols; c++ ){
            for( r=1; r<=this.num_rows; r++ ){
                if( this.borders_cols[c][r] === true ){
                    this.drawing.line([
                        this.corner(r-1,c),
                        this.corner(r,c),
                        ], 'border');

                }
            }
        }
        for( r=1; r<=this.num_rows; r++ ){
            for( c=1; c<=this.num_cols; c++ ){
                if( typeof this.cell(r,c).cell_text === 'string' ){
                    var cell = this.cell(r,c);
                    var font_name = cell.cell_font_name || 'table';
                    var coor;
                    if( g.drawing_settings.fonts[font_name]['text-anchor'] === 'center') coor = this.center(r,c);
                    else if( g.drawing_settings.fonts[font_name]['text-anchor'] === 'right') coor = this.right(r,c);
                    else if( g.drawing_settings.fonts[font_name]['text-anchor'] === 'left') coor = this.left(r,c);
                    else coor = this.center(r,c);

                    this.drawing.text(
                        coor,
                        this.cell(r,c).cell_text,
                        font_name,
                        'text'
                    );
                }
            }
        }

    }

};

drawing.table = function( num_rows, num_cols ){
    var new_table = Object.create(Table);
    new_table.init( this, num_rows, num_cols );

    return new_table;

};


drawing.append =  function(drawing_parts){
    this.drawing_parts = this.drawing_parts.concat(drawing_parts);
    return this;
};



var mk_drawing = function(){
    var page = Object.create(drawing);
    //console.log(page);
    page.drawing_parts = [];
    return page;
};





/////////////////////////////////



module.exports = mk_drawing;

},{"./functions.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/functions.js","./settings":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_1.js":[function(require,module,exports){
var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');

var page = function(settings){
    console.log("** Making page 1");

    var d = mk_drawing();

    var sheet_section = 'A';
    var sheet_num = '00';
    d.append(mk_border(settings, sheet_section, sheet_num ));

    var size = settings.drawing_settings.size;
    var loc = settings.drawing_settings.loc;

    var x, y, h, w;

    d.text(
        [size.drawing.w*1/2, size.drawing.h*1/3],
        [
            'PV System Design',
        ],
        'project title'
    );

    if( g.f.section_defined('location')  ){
        d.text(
            [size.drawing.w*1/2, size.drawing.h*1/3 +30],
            [
                g.perm.location.address,
                g.perm.location.city + ', ' + g.perm.location.county + ', FL, ' + g.perm.location.zip,
            ],
            'project title'
        );
    }
    var n_rows = 4;
    var n_cols = 2;
    w = 400+80;
    h = n_rows*20;
    x = size.drawing.frame_padding*6;
    y = size.drawing.h - size.drawing.frame_padding*6 - 4*20;

    d.text( [x+w/2, y-20], 'Contents','table_large' );

    var t = d.table(n_rows,n_cols).loc(x,y);
    t.row_size('all', 20).col_size(2, 400).col_size(1, 80);
    t.cell(1,1).text('PV-01');
    t.cell(1,2).text('PV system wiring diagram');
    t.cell(2,1).text('PV-02');
    t.cell(2,2).text('PV system specifications');
    t.cell(3,1).text('S-01');
    t.cell(3,2).text('Roof details');

    t.all_cells().forEach(function(cell){
        cell.font('table_large_left').border('all');
    });

    t.mk();

    /*
    console.log(table_parts);
    d.append(table_parts);
    d.text([size.drawing.w/3,size.drawing.h/3], 'X', 'table');
    d.rect([size.drawing.w/3-5,size.drawing.h/3-5],[10,10],'box');

    t.cell(2,2).border('all').text('cell 2,2');
    t.cell(3,3).border('all').text('cell 3,3');
    t.cell(4,4).border('all').text('cell 4,4');
    t.cell(5,5).border('all').text('cell 5,5');



    t.cell(4,6).border('all').text('cell 4,6');
    t.cell(4,7).border('all').text('cell 4,7');
    t.cell(5,6).border('all').text('cell 5,6');
    t.cell(5,7).border('all').text('cell 5,7');


    //*/

    return d.drawing_parts;
};



module.exports = page;

},{"./mk_border":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_border.js","./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_2.js":[function(require,module,exports){
var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');

//var drawing_parts = [];
//d.link_drawing_parts(drawing_parts);

var page = function(settings){
    console.log("** Making page 2");
    d = mk_drawing();
    var sheet_section = 'PV';
    var sheet_num = '01';
    d.append(mk_border(settings, sheet_section, sheet_num ));

    var f = settings.f;

    //var components = settings.components;
    //var system = settings.system;
    var system = settings.system;

    var size = settings.drawing_settings.size;
    var loc = settings.drawing_settings.loc;




    var x, y, h, w;
    var offset;






////////////////////////////////////////
//#array
    if( f.section_defined('module') && f.section_defined('array') ){
        d.section('array');


        x = loc.array.right - size.string.w;
        y = loc.array.upper;
        //y -= size.string.h/2;


        //for( var i=0; i<system.DC.string_num; i++ ) {
        for( var i in _.range(system.array.num_strings)) {
            //var offset = i * size.wire_offset.base
            var offset_wire = size.wire_offset.min + ( size.wire_offset.base * i );

            d.block('string', [x,y]);
            // positive home run
            d.layer('DC_pos');
            d.line([
                [ x , loc.array.upper ],
                [ x , loc.array.upper-offset_wire ],
                [ loc.array.right+offset_wire , loc.array.upper-offset_wire ],
                [ loc.array.right+offset_wire , loc.jb_box.y-offset_wire],
                [ loc.jb_box.x , loc.jb_box.y-offset_wire],
            ]);

            // negative home run
            d.layer('DC_neg');
            d.line([
                [ x , loc.array.lower ],
                [ x , loc.array.lower_limit+offset_wire ],
                [ loc.array.right+offset_wire , loc.array.lower_limit+offset_wire ],
                [ loc.array.right+offset_wire , loc.jb_box.y+offset_wire],
                [ loc.jb_box.x , loc.jb_box.y+offset_wire],
            ]);

            x -= size.string.w;
        }

    //    d.rect(
    //        [ (loc.array.right+loc.array.left)/2, (loc.array.lower+loc.array.upper)/2 ],
    //        [ loc.array.right-loc.array.left, loc.array.lower-loc.array.upper ],
    //        'DC_pos');
    //

        d.layer('DC_ground');
        d.line([
            //[ loc.array.left , loc.array.lower + size.wire_offset.ground ],
            [ loc.array.left, loc.array.lower_limit + size.wire_offset.ground ],
            [ loc.array.right+size.wire_offset.ground , loc.array.lower_limit + size.wire_offset.ground ],
            [ loc.array.right+size.wire_offset.ground , loc.jb_box.y + size.wire_offset.ground],
            [ loc.jb_box.x , loc.jb_box.y+size.wire_offset.ground],
        ]);

        d.layer();


    }// else { console.log("Drawing: array not ready")}

///////////////////////////////
// combiner box

    if( f.section_defined('DC') ){

        d.section("combiner");

        x = loc.jb_box.x;
        y = loc.jb_box.y;

        d.rect(
            [x,y],
            [size.jb_box.w,size.jb_box.h],
            'box'
        );


        for( i in _.range(system.array.num_strings)) {
            offset = size.wire_offset.min + ( size.wire_offset.base * i );

            d.layer('DC_pos');
            d.line([
                [ x , y-offset],
                [ x , y-offset],
            ]);
            d.block( 'terminal', {
                x: x,
                y: y-offset,
            });
            d.line([
                [ x , y-offset],
                [ loc.discbox.x-offset , y-offset],
                [ loc.discbox.x-offset , loc.discbox.y+size.discbox.h/2-size.terminal_diam],
                [ loc.discbox.x-offset , loc.discbox.y+size.discbox.h/2-size.terminal_diam-size.terminal_diam*3],
            ]);
            d.block( 'terminal', {
                x: loc.discbox.x-offset,
                y: loc.discbox.y+size.discbox.h/2-size.terminal_diam
            });

            d.layer('DC_neg');
            d.line([
                [ x, y+offset],
                [ x-size.fuse.w/2 , y+offset],
            ]);
            d.block( 'fuse', {
                x: x ,
                y: y+offset,
            });
            d.line([
                [ x+size.fuse.w/2 , y+offset],
                [ loc.discbox.x+offset , y+offset],
                [ loc.discbox.x+offset , loc.discbox.y+size.discbox.h/2-size.terminal_diam],
                [ loc.discbox.x+offset , loc.discbox.y+size.discbox.h/2-size.terminal_diam-size.terminal_diam*3],
            ]);
            d.block( 'terminal', {
                x: loc.discbox.x+offset,
                y: loc.discbox.y+size.discbox.h/2-size.terminal_diam
            });
            d.layer();
        }

        //d.layer('DC_ground');
        //d.line([
        //    [ loc.array.left , loc.array.lower + size.module.w + size.wire_offset.ground ],
        //    [ loc.array.right+size.wire_offset.ground , loc.array.lower + size.module.w + size.wire_offset.ground ],
        //    [ loc.array.right+size.wire_offset.ground , loc.array.y + size.module.w + size.wire_offset.ground],
        //    [ loc.array.x , loc.array.y+size.module.w+size.wire_offset.ground],
        //]);

        //d.layer();

        // Ground
        //offset = size.wire_offset.gap + size.wire_offset.ground;
        offset = size.wire_offset.ground;

        d.layer('DC_ground');
        d.line([
            [ x , y+offset],
            [ x , y+offset],
        ]);
        d.block( 'terminal', {
            x: x,
            y: y+offset,
        });
        d.line([
            [ x , y+offset],
            [ loc.discbox.x+offset , y+offset],
            [ loc.discbox.x+offset , loc.discbox.y+size.discbox.h/2-size.terminal_diam],
            [ loc.discbox.x+offset , loc.discbox.y+size.discbox.h/2-size.terminal_diam-size.terminal_diam*3],
        ]);
        d.block( 'terminal', {
            x: loc.discbox.x+offset,
            y: loc.discbox.y+size.discbox.h/2-size.terminal_diam
        });
        d.layer();


    ///////////////////////////////
        // DC disconect
        d.section("DC diconect");


        d.rect(
            [loc.discbox.x, loc.discbox.y],
            [size.discbox.w,size.discbox.h],
            'box'
        );

        // DC disconect combiner d.lines

        x = loc.discbox.x;
        y = loc.discbox.y + size.discbox.h/2;

        if( system.array.num_strings > 1){
            var offset_min = size.wire_offset.min;
            var offset_max = size.wire_offset.min + ( (system.array.num_strings -1) * size.wire_offset.base );
            d.line([
                [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
                [ x-offset_max, y-size.terminal_diam-size.terminal_diam*3],
            ], 'DC_pos');
            d.line([
                [ x+offset_min, y-size.terminal_diam-size.terminal_diam*3],
                [ x+offset_max, y-size.terminal_diam-size.terminal_diam*3],
            ], 'DC_neg');
        }

        // Inverter conection
        //d.line([
        //    [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
        //    [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
        //],'DC_pos');

        //offset = offset_max - offset_min;
        offset = size.wire_offset.min;

        // neg
        d.line([
            [ x+offset, y-size.terminal_diam-size.terminal_diam*3],
            [ x+offset, loc.inverter.y+size.inverter.h/2-size.terminal_diam ],
        ],'DC_neg');
        d.block( 'terminal', {
            x: x+offset,
            y: loc.inverter.y+size.inverter.h/2-size.terminal_diam,
        });

        // pos
        d.line([
            [ x-offset, y-size.terminal_diam-size.terminal_diam*3],
            [ x-offset, loc.inverter.y+size.inverter.h/2-size.terminal_diam ],
        ],'DC_pos');
        d.block( 'terminal', {
            x: x-offset,
            y: loc.inverter.y+size.inverter.h/2-size.terminal_diam,
        });

        // ground
        //offset = size.wire_offset.gap + size.wire_offset.ground;
        offset = size.wire_offset.ground;
        d.line([
            [ x+offset, y-size.terminal_diam-size.terminal_diam*3],
            [ x+offset, loc.inverter.y+size.inverter.h/2-size.terminal_diam ],
        ],'DC_ground');
        d.block( 'terminal', {
            x: x+offset,
            y: loc.inverter.y+size.inverter.h/2-size.terminal_diam,
        });

    }




///////////////////////////////
//#inverter
    if( f.section_defined('inverter') ){

        d.section("inverter");


        x = loc.inverter.x;
        y = loc.inverter.y;


        //frame
        d.layer('box');
        d.rect(
            [x,y],
            [size.inverter.w, size.inverter.h]
        );
        // Label at top (Inverter, make, model, ...)
        d.layer('text');
        d.text(
            [loc.inverter.x, loc.inverter.top + size.inverter.text_gap ],
            [ 'Inverter', settings.system.inverter.make + " " + settings.system.inverter.model ],
            'label'
        );
        d.layer();

    //#inverter symbol
        d.section("inverter symbol");

        x = loc.inverter.x;
        y = loc.inverter.y;

        w = size.inverter.symbol_w;
        h = size.inverter.symbol_h;

        var space = w*1/12;

        // Inverter symbol
        d.layer('box');

        // box
        d.rect(
            [x,y],
            [w, h]
        );
        // diaganal
        d.line([
            [x-w/2, y+h/2],
            [x+w/2, y-h/2],

        ]);
        // DC
        d.line([
            [x - w/2 + space,
                y - h/2 + space],
            [x - w/2 + space*6,
                y - h/2 + space],
        ]);
        d.line([
            [x - w/2 + space,
                y - h/2 + space*2],
            [x - w/2 + space*2,
                y - h/2 + space*2],
        ]);
        d.line([
            [x - w/2 + space*3,
                y - h/2 + space*2],
            [x - w/2 + space*4,
                y - h/2 + space*2],
        ]);
        d.line([
            [x - w/2 + space*5,
                y - h/2 + space*2],
            [x - w/2 + space*6,
                y - h/2 + space*2],
        ]);

        // AC
        d.line([
            [x + w/2 - space,
                y + h/2 - space*1.5],
            [x + w/2 - space*2,
                y + h/2 - space*1.5],
        ]);
        d.line([
            [x + w/2 - space*3,
                y + h/2 - space*1.5],
            [x + w/2 - space*4,
                y + h/2 - space*1.5],
        ]);
        d.line([
            [x + w/2 - space*5,
                y + h/2 - space*1.5],
            [x + w/2 - space*6,
                y + h/2 - space*1.5],
        ]);
        d.layer();





    }





//#AC_discconect
    if( f.section_defined('AC') ){
        d.section("AC_discconect");

        x = loc.AC_disc.x;
        y = loc.AC_disc.y;
        padding = size.terminal_diam;

        d.layer('box');
        d.rect(
            [x, y],
            [size.AC_disc.w, size.AC_disc.h]
        );
        d.layer();


    //d.circ([x,y],5);



    //#AC load center
        d.section("AC load center");

        var breaker_spacing = size.AC_loadcenter.breakers.spacing;

        x = loc.AC_loadcenter.x;
        y = loc.AC_loadcenter.y;
        w = size.AC_loadcenter.w;
        h = size.AC_loadcenter.h;

        d.rect([x,y],
            [w,h],
            'box'
        );

        d.text([x,y-h*0.4],
            [system.AC.loadcenter_types, 'Load Center'],
            'label',
            'text'
        );
        w = size.AC_loadcenter.breaker.w;
        h = size.AC_loadcenter.breaker.h;

        padding = loc.AC_loadcenter.x - loc.AC_loadcenter.breakers.left - size.AC_loadcenter.breaker.w;

        y = loc.AC_loadcenter.breakers.top;
        y += size.AC_loadcenter.breakers.spacing/2;
        for( var i=0; i<size.AC_loadcenter.breakers.num; i++){
            d.rect([x-padding-w/2,y],[w,h],'box');
            d.rect([x+padding+w/2,y],[w,h],'box');
            y += breaker_spacing;
        }

        var s, l;

        l = loc.AC_loadcenter.neutralbar;
        s = size.AC_loadcenter.neutralbar;
        d.rect([l.x,l.y], [s.w,s.h], 'AC_neutral' );

        l = loc.AC_loadcenter.groundbar;
        s = size.AC_loadcenter.groundbar;
        d.rect([l.x,l.y], [s.w,s.h], 'AC_ground' );

        d.block('ground', [l.x,l.y+s.h/2]);



    // AC d.lines
        d.section("AC d.lines");

        x = loc.inverter.bottom_right.x;
        y = loc.inverter.bottom_right.y;
        x -= size.terminal_diam * (system.AC.num_conductors+1);
        y -= size.terminal_diam;

        var conduit_y = loc.AC_conduit.y;
        padding = size.terminal_diam;
        //var AC_d.layer_names = ['AC_ground', 'AC_neutral', 'AC_L1', 'AC_L2', 'AC_L2'];

        for( var i=0; i < system.AC.num_conductors; i++ ){
            d.block('terminal', [x,y] );
            d.layer('AC_'+system.AC.conductors[i]);
            d.line([
                [x, y],
                [x, loc.AC_disc.bottom - padding*2 - padding*i  ],
                [loc.AC_disc.left, loc.AC_disc.bottom - padding*2 - padding*i ],
            ]);
            x += size.terminal_diam;
        }
        d.layer();

        x = loc.AC_disc.x;
        y = loc.AC_disc.y + size.AC_disc.h/2;
        y -= padding*2;

        if( system.AC.conductors.indexOf('ground')+1 ) {
            d.layer('AC_ground');
            d.line([
                [ x-size.AC_disc.w/2, y ],
                [ x+size.AC_disc.w/2+padding*2, y ],
                [ x+size.AC_disc.w/2+padding*2, conduit_y + breaker_spacing*2 ],
                [ loc.AC_loadcenter.left+padding*2, conduit_y + breaker_spacing*2 ],
                //[ loc.AC_loadcenter.left+padding*2, y ],
                //[ loc.AC_loadcenter.groundbar.x-padding, y ],
                //[ loc.AC_loadcenter.groundbar.x-padding, loc.AC_loadcenter.groundbar.y+size.AC_loadcenter.groundbar.h/2 ],
                [ loc.AC_loadcenter.left+padding*2, loc.AC_loadcenter.groundbar.y ],
                [ loc.AC_loadcenter.groundbar.x-size.AC_loadcenter.groundbar.w/2, loc.AC_loadcenter.groundbar.y ],
            ]);
        }

        if( system.AC.conductors.indexOf('neutral')+1 ) {
            y -= padding;
            d.layer('AC_neutral');
            d.line([
                [ x-size.AC_disc.w/2, y ],
                [ x+padding*3*2, y ],
                [ x+padding*3*2, conduit_y + breaker_spacing*1 ],
                [ loc.AC_loadcenter.neutralbar.x, conduit_y + breaker_spacing*1 ],
                [ loc.AC_loadcenter.neutralbar.x,
                    loc.AC_loadcenter.neutralbar.y-size.AC_loadcenter.neutralbar.h/2 ],
            ]);
        }



        for( var i=1; i <= 3; i++ ) {
            if( system.AC.conductors.indexOf('L'+i)+1 ) {
                y -= padding;
                d.layer('AC_L'+i);
                d.line([
                    [ x-size.AC_disc.w/2, y ],
                    [ x+padding*3*(2-i), y ],
                    [ x+padding*3*(2-i), loc.AC_disc.switch_bottom ],
                ]);
                d.block('terminal', [ x-padding*(i-2)*3, loc.AC_disc.switch_bottom ] );
                d.block('terminal', [ x-padding*(i-2)*3, loc.AC_disc.switch_top ] );
                d.line([
                    [ x-padding*(i-2)*3, loc.AC_disc.switch_top ],
                    [ x-padding*(i-2)*3, conduit_y-breaker_spacing*(i-1) ],
                    [ loc.AC_loadcenter.breakers.left, conduit_y-breaker_spacing*(i-1) ],
                ]);

            }

        }



    }




// Wire table
    d.section("Wire table");

///*

    x = loc.wire_table.x;
    y = loc.wire_table.y;

    if( system.AC.num_conductors ) {
        var n_rows = 2 + system.AC.num_conductors;
        var n_cols = 6;
        var row_height = 15;
        var column_width = {
            number: 25,
            conductor: 50,
            wire_gauge: 25,
            wire_type: 75,
            conduit_size: 35,
            conduit_type: 75,
        };

        h = n_rows*row_height;

        var t = d.table(n_rows,n_cols).loc(x,y);
        t.row_size('all', row_height)
            .col_size(1, column_width.number)
            .col_size(2, column_width.conductor)
            .col_size(3, column_width.wire_gauge)
            .col_size(4, column_width.wire_type)
            .col_size(5, column_width.conduit_size)
            .col_size(6, column_width.conduit_type);

        t.all_cells().forEach(function(cell){
            cell.font('table').border('all');
        });
        t.cell(1,1).border('B', false);
        t.cell(1,3).border('R', false);
        t.cell(1,5).border('R', false);

        t.cell(1,3).font('table_left').text('Wire');
        t.cell(1,5).font('table_left').text('Conduit');

        t.cell(2,3).font('table').text('Conductors');
        t.cell(2,3).font('table').text('AWG');
        t.cell(2,4).font('table').text('Type');
        t.cell(2,5).font('table').text('Size');
        t.cell(2,6).font('table').text('Type');

        for( i=1; i<=system.AC.num_conductors; i++){
            t.cell(2+i,1).font('table').text(i.toString());
            t.cell(2+i,2).font('table_left').text( f.pretty_word(settings.system.AC.conductors[i-1]) );

        }


        //d.text( [x+w/2, y-row_height], f.pretty_name(section_name),'table' );


        t.mk();

    }

//*/












// voltage drop
    d.section("voltage drop");


    x = loc.volt_drop_table.x;
    y = loc.volt_drop_table.y;
    w = size.volt_drop_table.w;
    h = size.volt_drop_table.h;

    d.layer('table');
    d.rect( [x,y], [w,h] );

    y -= h/2;
    y += 10;

    d.text( [x,y], 'Voltage Drop', 'table', 'text');


// general notes
    d.section("general notes");

    x = loc.general_notes.x;
    y = loc.general_notes.y;
    w = size.general_notes.w;
    h = size.general_notes.h;

    d.layer('table');
    d.rect( [x,y], [w,h] );

    y -= h/2;
    y += 10;

    d.text( [x,y], 'General Notes', 'table', 'text');


    d.section();

    return d.drawing_parts;
};



module.exports = page;

},{"./mk_border":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_border.js","./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_3.js":[function(require,module,exports){
var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');

var page = function(settings){
    console.log("** Making page 3");
    var f = settings.f;

    d = mk_drawing();

    var sheet_section = 'PV';
    var sheet_num = '02';
    d.append(mk_border(settings, sheet_section, sheet_num ));

    var size = settings.drawing_settings.size;
    var loc = settings.drawing_settings.loc;


    d.text(
        [size.drawing.w/2, size.drawing.h/2],
        'Calculation Sheet',
        'title2'
    );


    x = size.drawing.frame_padding*6;
    y = size.drawing.frame_padding*6 +20;

    d.layer('table');


    for( var section_name in settings.system ){
        if( f.section_defined(section_name) ){
            var section = settings.system[section_name];

            var n = Object.keys(section).length;

            var n_rows = n+0;
            var n_cols = 2;

            var row_height = 15;
            h = n_rows*row_height;


            var t = d.table(n_rows,n_cols).loc(x,y);
            t.row_size('all', row_height).col_size(1, 100).col_size(2, 125);
            w = 100+80;

            var r = 1;
            var value;
            for( var value_name in section ){
                t.cell(r,1).text( f.pretty_name(value_name) );
                if( ! section[value_name]) {
                    value = '-';
                } else if( section[value_name].constructor === Array ){
                    value = section[value_name].toString();
                } else if( section[value_name].constructor === Object ){
                    value = '( )';
                } else if( isNaN(section[value_name]) ){
                    value = section[value_name];
                } else {
                    value = parseFloat(section[value_name]).toFixed(2);
                }
                t.cell(r,2).text( value );
                r++;

            }

            d.text( [x+w/2, y-row_height], f.pretty_name(section_name),'table' );




            t.all_cells().forEach(function(cell){
                cell.font('table').border('all');
            });

            t.mk();

            //*/
            y += h + 30;

            if( y > ( g.drawing_settings.size.drawing.h * 0.8 ) ) {
                y =
                    y = size.drawing.frame_padding*6 +20;
                    x += w*1.5;
            }

        } else {

            //console.log('not defined: ', section_name, section);
        }




    }

    d.layer();


    return d.drawing_parts;
};



module.exports = page;

},{"./mk_border":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_border.js","./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_4.js":[function(require,module,exports){
var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');

var page = function(settings){
    console.log("** Making page 3");
    var f = settings.f;

    d = mk_drawing();

    var sheet_section = 'S';
    var sheet_num = '01';
    d.append(mk_border(settings, sheet_section, sheet_num ));

    var size = settings.drawing_settings.size;
    var loc = settings.drawing_settings.loc;
    var system = settings.system;












    if( f.section_defined('roof') ){



        var x, y, h, w, section_x, section_y, length_p, scale;

        var slope = system.roof.slope.split(':')[0];
        var angle_rad = Math.atan( Number(slope) /12 );
        //angle_rad = angle * (Math.PI/180);


        length_p = system.roof.length * Math.cos(angle_rad);
        system.roof.height = system.roof.length * Math.sin(angle_rad);

        var roof_ratio = system.roof.length / system.roof.width;
        var roof_plan_ratio = length_p / system.roof.width;


        if( system.roof.type === "Gable"){


            ///////
            // Rood plan view
            var plan_x = 60;
            var plan_y = 60;

            var plan_w, plan_h;
            if( length_p*2 > system.roof.width ){
                scale = 200/(length_p*2);
                plan_w = (length_p*2) * scale;
                plan_h = plan_w / (length_p*2 / system.roof.width);
            } else {
                scale = 300/(system.roof.width);
                plan_h = system.roof.width * scale;
                plan_w = plan_h * (length_p*2 / system.roof.width);
            }

            d.rect(
                [plan_x+plan_w/2, plan_y+plan_h/2],
                [plan_w, plan_h],
                "preview_structural"
            );

            d.poly([
                    [plan_x       , plan_y],
                    [plan_x+plan_w/2, plan_y],
                    [plan_x+plan_w/2, plan_y+plan_h],
                    [plan_x,        plan_y+plan_h],
                    [plan_x       , plan_y],
                ],
                "preview_structural_poly_unselected"
            );
            d.poly([
                    [plan_x+plan_w/2       , plan_y],
                    [plan_x+plan_w/2+plan_w/2, plan_y],
                    [plan_x+plan_w/2+plan_w/2, plan_y+plan_h],
                    [plan_x+plan_w/2,        plan_y+plan_h],
                    [plan_x+plan_w/2       , plan_y],
                ],
                "preview_structural_poly_selected"
            );

            d.line([
                    [plan_x+plan_w/2, plan_y],
                    [plan_x+plan_w/2, plan_y+plan_h]
                ],
                "preview_structural_dot"
            );

            /*
            d.text(
                [plan_x-20, plan_y+plan_h/2],
                system.roof.length.toString(),
                'dimention'
            );
            */

            d.text(
                [plan_x+plan_w+20, plan_y+plan_h/2],
                system.roof.width.toString(),
                'dimention'
            );


            x = plan_x + 120;
            y = plan_y - 20;

            d.block('north arrow_left', [x,y]);


            ////////
            // roof crossection

            var cs_x = plan_x;
            var cs_y = plan_y + plan_h + 50;
            var cs_h = system.roof.height * scale;
            var cs_w = plan_w/2;

            d.line([
                    [cs_x+cs_w,   cs_y],
                    [cs_x+cs_w,   cs_y+cs_h],
                ],
                "preview_structural_dot"
            );
            d.line([
                    [cs_x+cs_w,   cs_y],
                    [cs_x+cs_w*2, cs_y+cs_h],
                    [cs_x,        cs_y+cs_h],
                    [cs_x+cs_w,   cs_y],
                ],
                "preview_structural"
            );
            d.text(
                [cs_x+cs_w-15, cs_y+cs_h*2/3],
                parseFloat( system.roof.height ).toFixed().toString(),
                'dimention'
            );
            d.text(
                [cs_x+cs_w*1.5+20, cs_y+cs_h/3],
                parseFloat( system.roof.length ).toFixed().toString(),
                'dimention'
            );



            //////
            // roof detail

            var detail_x = 30+400;
            var detail_y = 30;

            if( Number(system.roof.width) >= Number(system.roof.length) ){
                scale = 350/(system.roof.width);
            } else {
                scale = 350/(system.roof.length);
            }
            var detail_w = system.roof.width * scale;
            var detail_h = system.roof.length * scale;

            d.rect(
                [detail_x+detail_w/2, detail_y+detail_h/2],
                [detail_w, detail_h],
                "preview_structural_poly_selected_framed"
            );

            var a = 3;
            var offset_a = a * scale;

            d.line([
                    [detail_x,   detail_y+offset_a],
                    [detail_x+detail_w,   detail_y+offset_a],
                ],
                "preview_structural_dot"
            );
            d.line([
                    [detail_x,          detail_y+detail_h-offset_a],
                    [detail_x+detail_w, detail_y+detail_h-offset_a],
                ],
                "preview_structural_dot"
            );
            d.line([
                    [detail_x+offset_a, detail_y],
                    [detail_x+offset_a, detail_y+detail_h],
                ],
                "preview_structural_dot"
            );
            d.line([
                    [detail_x+detail_w-offset_a, detail_y],
                    [detail_x+detail_w-offset_a, detail_y+detail_h],
                ],
                "preview_structural_dot"
            );

            d.text(
                [detail_x-40, detail_y+detail_h/2],
                parseFloat( system.roof.length ).toFixed().toString(),
                'dimention'
            );
            d.text(
                [detail_x+detail_w/2, detail_y+detail_h+40],
                parseFloat( system.roof.width ).toFixed().toString(),
                'dimention'
            );

            d.text(
                [detail_x+ (offset_a)/2, detail_y+detail_h+15],
                'a',
                'dimention'
            );
            d.text(
                [detail_x+detail_w-(offset_a)/2, detail_y+detail_h+15],
                'a',
                'dimention'
            );
            d.text(
                [detail_x-15, detail_y+detail_h-(offset_a)/2],
                'a',
                'dimention'
            );
            d.text(
                [detail_x-15, detail_y+(offset_a)/2],
                'a',
                'dimention'
            );

            x = detail_x + detail_w + 25;
            y = detail_y + 120;

            d.block('north arrow_up', [x,y]);



            //////
            // Module options
            if( f.section_defined('module') && f.section_defined('array')){
                var r,c;

                var roof_length_avail = system.roof.length - (a*2);
                var roof_width_avail = system.roof.width - (a*2);

                var row_spacing;
                if( system.module.orientation === 'Portrait' ){
                    row_spacing = Number(system.module.length) + 1;
                    col_spacing = Number(system.module.width) + 1;
                    module_w = (Number(system.module.width)  )/12;
                    module_h = (Number(system.module.length) )/12;
                } else {
                    row_spacing = Number(system.module.width) + 1;
                    col_spacing = Number(system.module.length) + 1;
                    module_w = (Number(system.module.length))/12;
                    module_h = (Number(system.module.width) )/12;
                }

                row_spacing = row_spacing/12; //module dimentions are in inches
                col_spacing = col_spacing/12; //module dimentions are in inches

                var num_rows = Math.floor(roof_length_avail/row_spacing);
                var num_cols = Math.floor(roof_width_avail/col_spacing);

                //selected modules

                if( num_cols !== g.temp.num_cols || num_rows !== g.temp.num_rows ){
                    g.webpage.selected_modules = {};
                    g.webpage.selected_modules_total = 0;

                    for( r=1; r<=num_rows; r++){
                        g.webpage.selected_modules[r] = {};
                        for( c=1; c<=num_cols; c++){
                            g.webpage.selected_modules[r][c] = false;
                        }
                    }


                    g.temp.num_cols = num_cols;
                    g.temp.num_rows = num_rows;
                }


                x = detail_x + offset_a; //corner of usable space
                y = detail_y + offset_a;
                x += ( roof_width_avail - (col_spacing*num_cols))/2 *scale; // center array on roof
                y += ( roof_length_avail - (row_spacing*num_rows))/2 *scale;
                module_w = module_w * scale;
                module_h = module_h * scale;



                for( r=1; r<=num_rows; r++){

                    for( c=1; c<=num_cols; c++){

                        var layer;
                        if( g.webpage.selected_modules[r][c] ) layer = 'preview_structural_module_selected';
                        else layer = 'preview_structural_module';
                        module_x = (c-1) * col_spacing * scale;
                        module_y = (r-1) * row_spacing * scale;

                        d.rect(
                            [x+module_x+module_w/2, y+module_y+module_h/2],
                            [module_w, module_h],
                            layer,
                            {
                                onclick: "g.f.toggle_module(this)",
                                module_ID:  (r) + ',' + (c)

                            }
                        );

                    }
                }

                d.text(
                    [detail_x+detail_w/2, detail_y+detail_h+100],
                    [
                        "Selected modules: " + parseFloat( g.webpage.selected_modules_total ).toFixed().toString(),
                        "Calculated modules: " + parseFloat( g.system.array.number_of_modules ).toFixed().toString(),
                    ],
                    'dimention'
                );

            }




        }
    }






    return d.drawing_parts;
};



module.exports = page;

},{"./mk_border":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_border.js","./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_preview_1.js":[function(require,module,exports){
var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');
var f = require('./functions');

var page = function(settings){
    console.log("** Making preview 1");

    var d = mk_drawing();



    var size = settings.drawing_settings.size;
    var loc = settings.drawing_settings.loc;
    var system = settings.system;

    var x, y, h, w, section_x, section_y;

    w = size.preview.module.w;
    h = size.preview.module.h;
    loc.preview.array.bottom = loc.preview.array.top + h*1.25*system.array.modules_per_string + h*3/4;
    //loc.preview.array.right = loc.preview.array.left + w*1.25*system.array.num_strings + w*2;
    loc.preview.array.right = loc.preview.array.left + w*1.25*8 + w*2;

    loc.preview.inverter.center = 500 ;
    w = size.preview.inverter.w;
    loc.preview.inverter.left = loc.preview.inverter.center - w/2;
    loc.preview.inverter.right = loc.preview.inverter.center + w/2;

    loc.preview.DC.left = loc.preview.array.right;
    loc.preview.DC.right = loc.preview.inverter.left;
    loc.preview.DC.center = ( loc.preview.DC.right + loc.preview.DC.left )/2;

    loc.preview.AC.left = loc.preview.inverter.right;
    loc.preview.AC.right = loc.preview.AC.left + 300;
    loc.preview.AC.center = ( loc.preview.AC.right + loc.preview.AC.left )/2;


// TODO fix: sections must be defined in order, or there are areas

    if( f.section_defined('array') && f.section_defined('module') ){
        d.layer('preview_array');

        w = size.preview.module.w;
        h = size.preview.module.h;
        var offset = 40;

        for( var s=0; s<system.array.num_strings; s++ ){
            x = loc.preview.array.left + w*1.25*s;
            // string wiring
            d.line([
                    [ x , loc.preview.array.top ],
                    [ x , loc.preview.array.bottom ],
                ]
            );
            // modules
            for( var m=0; m<system.array.modules_per_string; m++ ){
                y = loc.preview.array.top + h + h*1.25*m;
                // modules
                d.rect(
                    [ x , y ],
                    [w,h],
                    'preview_module'
                );
            }
        }

        // top array conduit
        d.line([
                [ loc.preview.array.left , loc.preview.array.top ],
                [ loc.preview.array.right - w, loc.preview.array.top ],
                [ loc.preview.array.right , loc.preview.array.top ],
            ]
        );
        // bottom array conduit
        d.line([
                [ loc.preview.array.left , loc.preview.array.bottom ],
                [ loc.preview.array.right - w , loc.preview.array.bottom ],
                [ loc.preview.array.right - w , loc.preview.array.top ],
            ]
        );

        y = loc.preview.array.top;
        h = size.preview.module.h;

        d.text(
            [ loc.preview.DC.center, y+h/2+offset ],
            [
                'Array DC',
                'Strings: ' + parseFloat(system.array.num_strings).toFixed(),
                'Modules: ' + parseFloat(system.array.modules_per_string).toFixed(),
                'Pmp: ' + parseFloat(system.array.pmp).toFixed(),
                'Imp: ' + parseFloat(system.array.imp).toFixed(),
                'Vmp: ' + parseFloat(system.array.vmp).toFixed(),
                'Isc: ' + parseFloat(system.array.isc).toFixed(),
                'Voc: ' + parseFloat(system.array.voc).toFixed(),
            ],
            'preview text'
        );
    }

    if( f.section_defined('DC') ){
        d.layer('preview_DC');

        //y = y;
        y = loc.preview.array.top;
        w = size.preview.module.w;
        h = size.preview.module.h;

        d.line([
                [ loc.preview.DC.left , y ],
                [ loc.preview.DC.right, y ],
            ]
        );
        d.rect(
            [loc.preview.DC.center,y],
            [w,h],
            'preview_DC_box'
        );

    }

    if( f.section_defined('inverter') ){

        d.layer('preview_inverter');

        y = y;
        w = size.preview.inverter.w;
        h = size.preview.inverter.h;

        d.rect(
            [loc.preview.inverter.center,y],
            [w,h],
            'preview_inverter_box'
        );
        d.text(
            [loc.preview.inverter.center,y+h/2+offset],
            [
                'Inverter',
                system.inverter.make,
                system.inverter.model,
            ],
            'preview text'
        );
    }

    if( f.section_defined('AC') ){

        d.layer('preview_AC');


        y = y;
        d.line([
                [ loc.preview.AC.left, y ],
                [ loc.preview.AC.right, y ],
            ]
        );
        w = size.preview.AC.w;
        h = size.preview.AC.h;
        d.rect(
            [loc.preview.AC.center,y],
            [w,h],
            'preview_AC_box'
        );
        w = size.preview.loadcenter.w;
        h = size.preview.loadcenter.h;
        d.rect(
            [ loc.preview.AC.right-w/2, y+h/4 ],
            [w,h],
            'preview_AC_box'
        );

        d.text(
            [loc.preview.AC.center,y+h/2+offset],
            [
                'AC',

            ],
            'preview text'
        );

    }

    return d.drawing_parts;
};



module.exports = page;

},{"./functions":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/functions.js","./mk_border":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_border.js","./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_preview_2.js":[function(require,module,exports){
var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');
var f = require('./functions');

var page = function(settings){
    console.log("** Making preview 2");

    var d = mk_drawing();

    if( f.section_defined('roof') ){

        var size = settings.drawing_settings.size;
        var loc = settings.drawing_settings.loc;
        var system = settings.system;

        var x, y, h, w, section_x, section_y, length_p, scale;

        var slope = system.roof.slope.split(':')[0];
        var angle_rad = Math.atan( Number(slope) /12 );
        //angle_rad = angle * (Math.PI/180);


        length_p = system.roof.length * Math.cos(angle_rad);
        system.roof.height = system.roof.length * Math.sin(angle_rad);

        var roof_ratio = system.roof.length / system.roof.width;
        var roof_plan_ratio = length_p / system.roof.width;


        if( system.roof.type === "Gable"){


            ///////
            // Rood plan view
            var plan_x = 30;
            var plan_y = 30;

            var plan_w, plan_h;
            if( length_p*2 > system.roof.width ){
                scale = 250/(length_p*2);
                plan_w = (length_p*2) * scale;
                plan_h = plan_w / (length_p*2 / system.roof.width);
            } else {
                scale = 400/(system.roof.width);
                plan_h = system.roof.width * scale;
                plan_w = plan_h * (length_p*2 / system.roof.width);
            }

            d.rect(
                [plan_x+plan_w/2, plan_y+plan_h/2],
                [plan_w, plan_h],
                "preview_structural"
            );

            d.poly([
                    [plan_x       , plan_y],
                    [plan_x+plan_w/2, plan_y],
                    [plan_x+plan_w/2, plan_y+plan_h],
                    [plan_x,        plan_y+plan_h],
                    [plan_x       , plan_y],
                ],
                "preview_structural_poly_unselected"
            );
            d.poly([
                    [plan_x+plan_w/2       , plan_y],
                    [plan_x+plan_w/2+plan_w/2, plan_y],
                    [plan_x+plan_w/2+plan_w/2, plan_y+plan_h],
                    [plan_x+plan_w/2,        plan_y+plan_h],
                    [plan_x+plan_w/2       , plan_y],
                ],
                "preview_structural_poly_selected"
            );

            d.line([
                    [plan_x+plan_w/2, plan_y],
                    [plan_x+plan_w/2, plan_y+plan_h]
                ],
                "preview_structural_dot"
            );

            /*
            d.text(
                [plan_x-20, plan_y+plan_h/2],
                system.roof.length.toString(),
                'dimention'
            );
            */

            d.text(
                [plan_x+plan_w+20, plan_y+plan_h/2],
                system.roof.width.toString(),
                'dimention'
            );




            ////////
            // roof crossection

            var cs_x = 30;
            var cs_y = 30+plan_h+50;
            var cs_h = system.roof.height * scale;
            var cs_w = plan_w/2;

            d.line([
                    [cs_x+cs_w,   cs_y],
                    [cs_x+cs_w,   cs_y+cs_h],
                ],
                "preview_structural_dot"
            );
            d.line([
                    [cs_x+cs_w,   cs_y],
                    [cs_x+cs_w*2, cs_y+cs_h],
                    [cs_x,        cs_y+cs_h],
                    [cs_x+cs_w,   cs_y],
                ],
                "preview_structural"
            );
            d.text(
                [cs_x+cs_w-15, cs_y+cs_h*2/3],
                parseFloat( system.roof.height ).toFixed().toString(),
                'dimention'
            );
            d.text(
                [cs_x+cs_w*1.5+20, cs_y+cs_h/3],
                parseFloat( system.roof.length ).toFixed().toString(),
                'dimention'
            );



            //////
            // roof detail

            var detail_x = 30+450;
            var detail_y = 30;

            if( Number(system.roof.width) >= Number(system.roof.length) ){
                scale = 450/(system.roof.width);
            } else {
                scale = 450/(system.roof.length);
            }
            var detail_w = system.roof.width * scale;
            var detail_h = system.roof.length * scale;

            d.rect(
                [detail_x+detail_w/2, detail_y+detail_h/2],
                [detail_w, detail_h],
                "preview_structural_poly_selected_framed"
            );

            var a = 3;
            var offset_a = a * scale;

            d.line([
                    [detail_x,   detail_y+offset_a],
                    [detail_x+detail_w,   detail_y+offset_a],
                ],
                "preview_structural_dot"
            );
            d.line([
                    [detail_x,          detail_y+detail_h-offset_a],
                    [detail_x+detail_w, detail_y+detail_h-offset_a],
                ],
                "preview_structural_dot"
            );
            d.line([
                    [detail_x+offset_a, detail_y],
                    [detail_x+offset_a, detail_y+detail_h],
                ],
                "preview_structural_dot"
            );
            d.line([
                    [detail_x+detail_w-offset_a, detail_y],
                    [detail_x+detail_w-offset_a, detail_y+detail_h],
                ],
                "preview_structural_dot"
            );

            d.text(
                [detail_x-40, detail_y+detail_h/2],
                parseFloat( system.roof.length ).toFixed().toString(),
                'dimention'
            );
            d.text(
                [detail_x+detail_w/2, detail_y+detail_h+40],
                parseFloat( system.roof.width ).toFixed().toString(),
                'dimention'
            );

            d.text(
                [detail_x+ (offset_a)/2, detail_y+detail_h+15],
                'a',
                'dimention'
            );
            d.text(
                [detail_x+detail_w-(offset_a)/2, detail_y+detail_h+15],
                'a',
                'dimention'
            );
            d.text(
                [detail_x-15, detail_y+detail_h-(offset_a)/2],
                'a',
                'dimention'
            );
            d.text(
                [detail_x-15, detail_y+(offset_a)/2],
                'a',
                'dimention'
            );





            //////
            // Module options
            if( f.section_defined('module') && f.section_defined('array')){
                var r,c;

                var roof_length_avail = system.roof.length - (a*2);
                var roof_width_avail = system.roof.width - (a*2);

                var row_spacing;
                if( system.module.orientation === 'Portrait' ){
                    row_spacing = Number(system.module.length) + 1;
                    col_spacing = Number(system.module.width) + 1;
                    module_w = (Number(system.module.width)  )/12;
                    module_h = (Number(system.module.length) )/12;
                } else {
                    row_spacing = Number(system.module.width) + 1;
                    col_spacing = Number(system.module.length) + 1;
                    module_w = (Number(system.module.length))/12;
                    module_h = (Number(system.module.width) )/12;
                }

                row_spacing = row_spacing/12; //module dimentions are in inches
                col_spacing = col_spacing/12; //module dimentions are in inches

                var num_rows = Math.floor(roof_length_avail/row_spacing);
                var num_cols = Math.floor(roof_width_avail/col_spacing);

                //selected modules

                if( num_cols !== g.temp.num_cols || num_rows !== g.temp.num_rows ){
                    g.webpage.selected_modules = {};
                    g.webpage.selected_modules_total = 0;

                    for( r=1; r<=num_rows; r++){
                        g.webpage.selected_modules[r] = {};
                        for( c=1; c<=num_cols; c++){
                            g.webpage.selected_modules[r][c] = false;
                        }
                    }


                    g.temp.num_cols = num_cols;
                    g.temp.num_rows = num_rows;
                }


                x = detail_x + offset_a; //corner of usable space
                y = detail_y + offset_a;
                x += ( roof_width_avail - (col_spacing*num_cols))/2 *scale; // center array on roof
                y += ( roof_length_avail - (row_spacing*num_rows))/2 *scale;
                module_w = module_w * scale;
                module_h = module_h * scale;



                for( r=1; r<=num_rows; r++){

                    for( c=1; c<=num_cols; c++){

                        var layer;
                        if( g.webpage.selected_modules[r][c] ) layer = 'preview_structural_module_selected';
                        else layer = 'preview_structural_module';
                        module_x = (c-1) * col_spacing * scale;
                        module_y = (r-1) * row_spacing * scale;

                        d.rect(
                            [x+module_x+module_w/2, y+module_y+module_h/2],
                            [module_w, module_h],
                            layer,
                            {
                                onclick: "g.f.toggle_module(this)",
                                module_ID:  (r) + ',' + (c)

                            }
                        );

                    }
                }

                d.text(
                    [detail_x+detail_w/2, detail_y+detail_h+100],
                    [
                        "Selected modules: " + parseFloat( g.webpage.selected_modules_total ).toFixed().toString(),
                        "Calculated modules: " + parseFloat( g.system.array.number_of_modules ).toFixed().toString(),
                    ],
                    'dimention'
                );

            }

            x = detail_x + 475;
            y = detail_y + 120;

            d.block('north arrow_up', [x,y]);

            x = 120;
            y = 15;

            d.block('north arrow_left', [x,y]);
//*/
        }


        /*




        d.line([
            [x,    y],
            [x+dx, y-dy],
            [x+dx, y],
            [x,    y],
            ]
        );

        d.text(
            [x+dx/2-10, y-dy/2-20],
            system.roof.height.toString(),
            'dimention'
        );
        d.text(
            [x+dx/2+5, y-15],
            angle.toString(),
            'dimention'
        );


        x = x+dx+100;
        y = y;


        //*/

    }

    return d.drawing_parts;
};



module.exports = page;

},{"./functions":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/functions.js","./mk_border":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_border.js","./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_svg.js":[function(require,module,exports){
'use strict';
//var settings = require('./settings.js');
//var snapsvg = require('snapsvg');
//log(settings);



var display_svg = function(drawing_parts, settings){
    //console.log('displaying svg');
    var layer_attr = settings.drawing_settings.layer_attr;
    var fonts = settings.drawing_settings.fonts;
    //console.log('drawing_parts: ', drawing_parts);
    //container.empty()

    //var svg_elem = document.getElementById('SvgjsSvg1000')
    var svg_elem = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svg_elem.setAttribute('class','svg_drawing');
    //svg_elem.setAttribute('width', settings.drawing_settings.size.drawing.w);
    //svg_elem.setAttribute('height', settings.drawing_settings.size.drawing.h);
    var view_box = '0 0 ' +
                    settings.drawing_settings.size.drawing.w + ' ' +
                    settings.drawing_settings.size.drawing.h + ' ';
    svg_elem.setAttribute('viewBox', view_box);
    //var svg = snapsvg(svg_elem).size(size.drawing.w, size.drawing.h);
    //var svg = snapsvg('#svg_drawing');

    // Loop through all the drawing contents, call the function below.
    drawing_parts.forEach( function(elem,id) {
        show_elem_array(elem);
    });

    function show_elem_array(elem, offset){
        offset = offset || {x:0,y:0};
        var x,y,attr_name;
        if( typeof elem.x !== 'undefined' ) { x = elem.x + offset.x; }
        if( typeof elem.y !== 'undefined' ) { y = elem.y + offset.y; }

        var attrs = layer_attr[elem.layer_name];
        if( elem.attrs !== undefined){
            for( attr_name in elem.attrs ){
                attrs[attr_name] = elem.attrs[attr_name];
            }
        }

        if( elem.type === 'rect') {
            //svg.rect( elem.w, elem.h ).move( x-elem.w/2, y-elem.h/2 ).attr( layer_attr[elem.layer_name] );
            //console.log('elem:', elem );
            //if( isNaN(elem.w) ) {
            //    console.log('error: elem not fully defined', elem)
            //    elem.w = 10;
            //}
            //if( isNaN(elem.h) ) {
            //    console.log('error: elem not fully defined', elem)
            //    elem.h = 10;
            //}
            var r = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            r.setAttribute('width', elem.w);
            r.setAttribute('height', elem.h);
            r.setAttribute('x', x-elem.w/2);
            r.setAttribute('y', y-elem.h/2);
            //console.log(elem.layer_name);
            for( attr_name in attrs ){
                r.setAttribute(attr_name, attrs[attr_name]);
            }
            svg_elem.appendChild(r);
        } else if( elem.type === 'line') {
            var points2 = [];
            elem.points.forEach( function(point){
                if( ! isNaN(point[0]) && ! isNaN(point[1]) ){
                    points2.push([ point[0]+offset.x, point[1]+offset.y ]);
                } else {
                    console.log('error: elem not fully defined', elem);
                }
            });
            //svg.polyline( points2 ).attr( layer_attr[elem.layer_name] );

            var l = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
            l.setAttribute( 'points', points2.join(' ') );
            for( attr_name in attrs ){
                l.setAttribute(attr_name, attrs[attr_name]);
            }
            svg_elem.appendChild(l);
        } else if( elem.type === 'poly') {
            var points2 = [];
            elem.points.forEach( function(point){
                if( ! isNaN(point[0]) && ! isNaN(point[1]) ){
                    points2.push([ point[0]+offset.x, point[1]+offset.y ]);
                } else {
                    console.log('error: elem not fully defined', elem);
                }
            });
            //svg.polyline( points2 ).attr( layer_attr[elem.layer_name] );

            var l = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
            l.setAttribute( 'points', points2.join(' ') );
            for( attr_name in attrs ){
                l.setAttribute(attr_name, attrs[attr_name]);
            }
            svg_elem.appendChild(l);
        } else if( elem.type === 'text') {
            //var t = svg.text( elem.strings ).move( elem.points[0][0], elem.points[0][1] ).attr( layer_attr[elem.layer_name] )
            var font;
            if( elem.font ){
                font = fonts[elem.font];
            } else {
                font = fonts[attrs.font];
            }
            var t = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            if(elem.rotated){
                //t.setAttribute('transform', "rotate(" + elem.rotated + " " + x + " " + y + ")" );
                t.setAttribute('transform', "rotate(" + elem.rotated + " " + x + " " + y + ")" );
            } else {
                //if( font['text-anchor'] === 'middle' ) y += font['font-size']*1/3;
                y += font['font-size']*1/3;
            }
            var dy = font['font-size']*1.5;
            t.setAttribute('x', x);
            //t.setAttribute('y', y + font['font-size']/2 );
            t.setAttribute('y', y-dy );

            for( attr_name in attrs ){
                if( attr_name === 'stroke' ) {
                    t.setAttribute( 'fill', attrs[attr_name] );
                } else if( attr_name === 'fill' ) {
                    //t.setAttribute( 'stroke', 'none' );
                } else {
                    t.setAttribute( attr_name, attrs[attr_name] );
                }

            }
            for( attr_name in font ){
                t.setAttribute( attr_name, font[attr_name] );
            }
            for( attr_name in elem.strings ){
                var tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
                tspan.setAttribute('dy', dy );
                tspan.setAttribute('x', x);
                tspan.innerHTML = elem.strings[attr_name];
                t.appendChild(tspan);
            }
            svg_elem.appendChild(t);
        } else if( elem.type === 'circ') {
            var c = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
            c.setAttribute('rx', elem.d/2);
            c.setAttribute('ry', elem.d/2);
            c.setAttribute('cx', x);
            c.setAttribute('cy', y);
            for( attr_name in attrs ){
                c.setAttribute(attr_name, attrs[attr_name]);
            }
            svg_elem.appendChild(c);
            /*
            c.attributes( layer_attr[elem.layer_name] )
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
            c2.attr( layer_attr[elem.layer_name] )
            */
        } else if(elem.type === 'block') {
            // if it is a block, run this function through each element.
            elem.drawing_parts.forEach( function(block_elem,id){
                show_elem_array(block_elem, {x:x, y:y});
            });
        }
    }
    return svg_elem;
};


module.exports = display_svg;

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings.js":[function(require,module,exports){
"use strict";
var f = require('./functions');

var i;
//var settingsCalculated = require('./settingsCalculated.js');

// Load 'user' defined settings
//var mk_settings = require('../data/settings.json.js');
//f.mk_settings = mk_settings;

var settings = {};

settings.temp = {};

settings.perm = {};
settings.perm.geocode = {};
settings.perm.location = {};
settings.perm.location.new_address = false;
settings.perm.maps = {};

settings.config_options = {};
settings.config_options.NEC_tables = require('../data/tables.json');
//console.log(settings.config_options.NEC_tables);

settings.state = {};
settings.state.database_loaded = false;

settings.in = {};

settings.in.opt = {};
settings.in.opt.AC = {};
settings.in.opt.AC.types = {};
settings.in.opt.AC.types["120V"] = ["ground","neutral","L1"];
settings.in.opt.AC.types["240V"] = ["ground","neutral","L1","L2"];
settings.in.opt.AC.types["208V"] = ["ground","neutral","L1","L2"];
settings.in.opt.AC.types["277V"] = ["ground","neutral","L1"];
settings.in.opt.AC.types["480V Wye"] = ["ground","neutral","L1","L2","L3"];
settings.in.opt.AC.types["480V Delta"] = ["ground","L1","L2","L3"];

settings.inputs = {};
settings.inputs.location = {};
settings.inputs.location.county = {};
settings.inputs.location.county.type = 'text_input';
settings.inputs.location.address = {};
settings.inputs.location.address.type = 'text_input';
settings.inputs.location.city = {};
settings.inputs.location.city.type = 'text_input';
settings.inputs.location.zip = {};
settings.inputs.location.zip.type = 'text_input';

settings.inputs.roof = {};
settings.inputs.roof.width = {};
settings.inputs.roof.width.options = [];
//for( i=15; i<=70; i+=5 ) settings.inputs.roof.width.options.push(i);
settings.inputs.roof.width.units = 'ft.';
settings.inputs.roof.width.note = 'This the full size of the roof, perpendictular to the slope.';
settings.inputs.roof.width.type = 'number_input';
settings.inputs.roof.length = {};
settings.inputs.roof.length.options = [];
//for( i=10; i<=60; i+=5 ) settings.inputs.roof.length.options.push(i);
settings.inputs.roof.length.units = 'ft.';
settings.inputs.roof.length.note = 'This the full length of the roof, measured from low to high.';
settings.inputs.roof.length.type = 'number_input';
settings.inputs.roof.slope = {};
settings.inputs.roof.slope.options = ['1:12','2:12','3:12','4:12','5:12','6:12','7:12','8:12','9:12','10:12','11:12','12:12'];
settings.inputs.roof.type = {};
settings.inputs.roof.type.options = ['Gable','Shed','Hipped'];
settings.inputs.module = {};
settings.inputs.module.make = {};
//settings.inputs.module.make.options = null;
settings.inputs.module.model = {};
//settings.inputs.module.model.options = null;
settings.inputs.module.orientation = {};
settings.inputs.module.orientation.options = ['Portrait','Landscape'];
settings.inputs.array = {};
settings.inputs.array.modules_per_string = {};
settings.inputs.array.modules_per_string.options = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
settings.inputs.array.num_strings = {};
settings.inputs.array.num_strings.options = [1,2,3,4,5,6];
settings.inputs.DC = {};
settings.inputs.DC.home_run_length = {};
//settings.inputs.DC.home_run_length.options = [25,50,75,100,125,150];
settings.inputs.DC.home_run_length.type = 'number_input';
settings.inputs.inverter = {};
settings.inputs.inverter.make = {};
//settings.inputs.inverter.make.options = null;
settings.inputs.inverter.model = {};
settings.inputs.inverter.location = {};
settings.inputs.inverter.location.options = ['Inside', 'Outside'];
//settings.inputs.inverter.model.options = null;
settings.inputs.AC = {};
settings.inputs.AC.loadcenter_types = {};
settings.inputs.AC.loadcenter_types['240V'] = {};
settings.inputs.AC.loadcenter_types['240V'] = ['240V','120V'];
settings.inputs.AC.loadcenter_types['208/120V'] = {};
settings.inputs.AC.loadcenter_types['208/120V'] = ['208V','120V'];
settings.inputs.AC.loadcenter_types['480/277V'] = {};
settings.inputs.AC.loadcenter_types['480/277V'] = ['480V Wye','480V Delta','277V'];
settings.inputs.AC.type = {};
//settings.inputs.AC.type.options = null;
settings.inputs.AC.distance_to_loadcenter = {};
//settings.inputs.AC.distance_to_loadcenter.options = [3,5,10,15,20,30];
settings.inputs.AC.distance_to_loadcenter.type = 'number_input';

settings.inputs.attachment_system = {};
settings.inputs.attachment_system.make = {
    options: ['UNIRAC'],
    type: 'select',
};
settings.inputs.attachment_system.model = {
    options: ['SOLARMOUNT'],
    type: 'select',
};





//settings.inputs = settings.inputs; // copy input reference with options to inputs
//settings.inputs = f.blank_copy(settings.inputs); // make input section blank
//settings.system_formulas = settings.system; // copy system reference to system_formulas
settings.system = f.blank_copy(settings.inputs); // make system section blank
//f.merge_objects( settings.inputs, settings.system );


// load layers

settings.drawing = {};

settings.drawing_settings = {};
settings.drawing_settings.layer_attr = require('./settings_layers');
settings.drawing_settings.fonts = require('./settings_fonts');

settings.drawing.blocks = {};

// Load drawing specific settings
// TODO Fix settings_drawing with new variable locations
var settings_drawing = require('./settings_drawing');
settings = settings_drawing(settings);

//settings.state_app.version_string = version_string;

//settings = f.nullToObject(settings);

settings.select_registry = [];
settings.value_registry = [];


//var config_options = settings.config_options = settings.config_options || {};

settings.webpage = {};
settings.webpage.selections_manual_toggled = {};
settings.webpage.sections = Object.keys(settings.inputs);


settings.webpage.sections.forEach( function(section_name){
    settings.webpage.selections_manual_toggled[section_name] = false;
});

settings.webpage.selected_modules_total = 0;
settings.webpage.selected_modules = {};




settings.components = {};



module.exports = settings;

},{"../data/tables.json":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/data/tables.json","./functions":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/functions.js","./settings_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings_drawing.js","./settings_fonts":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings_fonts.js","./settings_layers":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings_layers.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings_drawing.js":[function(require,module,exports){
"use strict";

function settings_drawing(settings){

    var system = settings.system;
    var status = settings.status;

    // Drawing specific
    //settings.drawing = settings.drawing || {};


    var size = settings.drawing_settings.size = {};
    var loc = settings.drawing_settings.loc = {};


    // sizes
    size.drawing = {
        w: 1000,
        h: 780,
        frame_padding: 5,
        titlebox: 50,
    };

    size.module = {};
    size.module.frame = {
        w: 10,
        h: 30,
    };
    size.module.lead = size.module.frame.w*2/3;
    size.module.h = size.module.frame.h + size.module.lead*2;
    size.module.w = size.module.frame.w;

    size.wire_offset = {
        base: 7,
        gap: size.module.w,
    };
    size.wire_offset.min = size.wire_offset.base * 1;

    size.string = {};
    size.string.gap = size.module.frame.w/42;
    size.string.gap_missing = size.module.h;
    size.string.w = size.module.frame.w * 2.5;

    size.terminal_diam = 5;
    size.fuse = {};
    size.fuse.w = 15;
    size.fuse.h = 4;


    // Inverter
    size.inverter = { w: 250, h: 150 };
    size.inverter.text_gap = 15;
    size.inverter.symbol_w = 50;
    size.inverter.symbol_h = 25;

    loc.inverter = {
        x: size.drawing.w/2,
        y: size.drawing.h/3,
    };
    loc.inverter.bottom = loc.inverter.y + size.inverter.h/2;
    loc.inverter.top = loc.inverter.y - size.inverter.h/2;
    loc.inverter.bottom_right = {
        x: loc.inverter.x + size.inverter.w/2,
        y: loc.inverter.y + size.inverter.h/2,
    };

    // array
    loc.array = {
        x: loc.inverter.x - 200,
        upper: loc.inverter.y - 20,
    };
    //loc.array.upper = loc.array.y - size.string.h/2;
    loc.array.right = loc.array.x - size.module.frame.h*3;




    loc.DC = loc.array;

    // DC jb
    size.jb_box = {
        h: 150,
        w: 80,
    };
    loc.jb_box = {
        x: 350,
        y: 550,
    };

    // DC diconect
    size.discbox = {
        w: 140,
        h: 50,
    };
    loc.discbox = {
        x: loc.inverter.x - size.inverter.w/2 + size.discbox.w/2,
        y: loc.inverter.y + size.inverter.h/2 + size.discbox.h/2 + 10,
    };

    // AC diconect
    size.AC_disc = { w: 80, h: 125 };

    loc.AC_disc = {
        x: loc.inverter.x+200,
        y: loc.inverter.y+250
    };
    loc.AC_disc.bottom = loc.AC_disc.y + size.AC_disc.h/2;
    loc.AC_disc.top = loc.AC_disc.y - size.AC_disc.h/2;
    loc.AC_disc.left = loc.AC_disc.x - size.AC_disc.w/2;
    loc.AC_disc.switch_top = loc.AC_disc.top + 15;
    loc.AC_disc.switch_bottom = loc.AC_disc.switch_top + 30;


    // AC panel

    loc.AC_loadcenter = {
        x: loc.inverter.x+350,
        y: loc.inverter.y+100
    };
    size.AC_loadcenter = { w: 125, h: 300 };
    loc.AC_loadcenter.left = loc.AC_loadcenter.x - size.AC_loadcenter.w/2;
    loc.AC_loadcenter.top = loc.AC_loadcenter.y - size.AC_loadcenter.h/2;


    size.AC_loadcenter.breaker = { w: 20, h: size.terminal_diam, };
    loc.AC_loadcenter.breakers = {
        left: loc.AC_loadcenter.x - ( size.AC_loadcenter.breaker.w * 1.1 ),
    };
    size.AC_loadcenter.breakers = {
        num: 20,
        spacing: size.AC_loadcenter.breaker.h + 1,
    };
    loc.AC_loadcenter.breakers.top = loc.AC_loadcenter.top + size.AC_loadcenter.h/5;
    loc.AC_loadcenter.breakers.bottom = loc.AC_loadcenter.breakers.top + size.AC_loadcenter.breakers.spacing*size.AC_loadcenter.breakers.num;


    size.AC_loadcenter.neutralbar = { w:5, h:40 };
    loc.AC_loadcenter.neutralbar = {
        x: loc.AC_loadcenter.left + 20,
        y: loc.AC_loadcenter.y + size.AC_loadcenter.h*0.3
    };

    size.AC_loadcenter.groundbar = { w:40, h:5 };
    loc.AC_loadcenter.groundbar = {
        x: loc.AC_loadcenter.x + 10,
        y: loc.AC_loadcenter.y + size.AC_loadcenter.h*0.45
    };

    loc.AC_conduit = {
        y: loc.AC_loadcenter.breakers.bottom - size.AC_loadcenter.breakers.spacing/2,
    };


    // wire table
    loc.wire_table = {
        x: size.drawing.w - size.drawing.titlebox - size.drawing.frame_padding*3 - 325,
        y: size.drawing.frame_padding*3,
    };

    // voltage drop table
    size.volt_drop_table = {};
    size.volt_drop_table.w = 150;
    size.volt_drop_table.h = 100;
    loc.volt_drop_table = {};
    loc.volt_drop_table.x = size.drawing.w - size.volt_drop_table.w/2 - 90;
    loc.volt_drop_table.y = size.drawing.h - size.volt_drop_table.h/2 - 30;


    // voltage drop table
    size.general_notes = {};
    size.general_notes.w = 150;
    size.general_notes.h = 100;
    loc.general_notes = {};
    loc.general_notes.x = size.general_notes.w/2 + 30;
    loc.general_notes.y = size.general_notes.h/2 + 30;




    settings.pages = {};
    settings.pages.letter = {
        units: 'inches',
        w: 11.0,
        h: 8.5,
    };
    settings.page = settings.pages.letter;

    settings.pages.PDF = {
        w: settings.page.w * 72,
        h: settings.page.h * 72,
    };

    settings.pages.PDF.scale = {
        x: settings.pages.PDF.w / settings.drawing_settings.size.drawing.w,
        y: settings.pages.PDF.h / settings.drawing_settings.size.drawing.h,
    };

    if( settings.pages.PDF.scale.x < settings.pages.PDF.scale.y ) {
        settings.page.scale = settings.pages.PDF.scale.x;
    } else {
        settings.page.scale = settings.pages.PDF.scale.y;
    }


    loc.preview = loc.preview || {};
    loc.preview.array = loc.preview.array = {};
    loc.preview.array.top = 100;
    loc.preview.array.left = 50;

    loc.preview.DC = loc.preview.DC = {};
    loc.preview.inverter = loc.preview.inverter = {};
    loc.preview.AC = loc.preview.AC = {};

    size.preview = size.preview || {};
    size.preview.module = {
        w: 15,
        h: 25,
    };
    size.preview.DC = {
        w: 30,
        h: 50,
    };
    size.preview.inverter = {
        w: 150,
        h: 75,
    };
    size.preview.AC = {
        w: 30,
        h: 50,
    };
    size.preview.loadcenter = {
        w: 50,
        h: 100,
    };



  return settings;

}


module.exports = settings_drawing;

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings_fonts.js":[function(require,module,exports){
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (!Object.assign) {
  Object.defineProperty(Object, "assign", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target, firstSource) {
      "use strict";
      if (target === undefined || target === null)
        throw new TypeError("Cannot convert first argument to object");
      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) continue;
        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
        }
      }
      return to;
    }
  });
}


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
fonts['title3'] = {
    'font-family': 'monospace',
    'font-size':     10,
    'text-anchor':   'left',
};
fonts['page'] = {
    'font-family': 'monospace',
    'font-size':     20,
    'text-anchor':   'middle',
};
fonts['table'] = {
    'font-family': 'serif',
    'font-size':     8,
    'text-anchor':   'middle',
};
fonts['table_left'] = {
    'font-family': 'serif',
    'font-size':     8,
    'text-anchor':   'left',
};
fonts['table_large_left'] = {
    'font-family': 'monospace',
    'font-size':     14,
    'text-anchor':   'left',
};
fonts['table_large'] = {
    'font-family': 'monospace',
    'font-size':     14,
    'text-anchor':   'middle',
};
fonts['project title'] = {
    'font-family': 'monospace',
    'font-size':     16,
    'text-anchor':   'middle',
};
fonts['preview text'] = {
    'font-family': 'monospace',
    'font-size'  : 20,
    'text-anchor': 'middle',
};
fonts['dimention'] = {
    'font-family': 'monospace',
    'font-size'  : 20,
    'text-anchor': 'middle',
};





module.exports = fonts;

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings_layers.js":[function(require,module,exports){
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (!Object.assign) {
  Object.defineProperty(Object, "assign", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target, firstSource) {
      "use strict";
      if (target === undefined || target === null)
        throw new TypeError("Cannot convert first argument to object");
      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) continue;
        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
        }
      }
      return to;
    }
  });
}


var layer_attr = {};

layer_attr.base = {
    'fill': 'none',
    'stroke':'#000000',
    'stroke-width':'1px',
    'stroke-linecap':'butt',
    'stroke-linejoin':'miter',
    'stroke-opacity':1,

};
layer_attr.block = Object.create(layer_attr.base);
layer_attr.frame = Object.create(layer_attr.base);
layer_attr.frame.stroke = '#000042';
layer_attr.table = Object.create(layer_attr.base);
layer_attr.table.stroke = '#000000';

layer_attr.DC_intermodule = Object.assign(Object.create(layer_attr.base),{
    stroke: '#bebebe',
    "stroke-dasharray": "1, 1",


});

layer_attr.DC_pos = Object.create(layer_attr.base);
layer_attr.DC_pos.stroke = '#ff0000';
layer_attr.DC_neg = Object.create(layer_attr.base);
layer_attr.DC_neg.stroke = '#000000';
layer_attr.DC_ground = Object.create(layer_attr.base);
layer_attr.DC_ground.stroke = '#006600';
layer_attr.module = Object.create(layer_attr.base);
layer_attr.box = Object.create(layer_attr.base);



layer_attr.text = Object.create(layer_attr.base);
layer_attr.text.stroke = '#0000ff';
layer_attr.terminal = Object.create(layer_attr.base);
layer_attr.border = Object.create(layer_attr.base);

layer_attr.AC_ground = Object.create(layer_attr.base);
layer_attr.AC_ground.stroke = '#009900';
layer_attr.AC_neutral = Object.create(layer_attr.base);
layer_attr.AC_neutral.stroke = '#999797';
layer_attr.AC_L1 = Object.create(layer_attr.base);
layer_attr.AC_L1.stroke = '#000000';
layer_attr.AC_L2 = Object.create(layer_attr.base);
layer_attr.AC_L2.stroke = '#FF0000';
layer_attr.AC_L3 = Object.create(layer_attr.base);
layer_attr.AC_L3.stroke = '#0000FF';


layer_attr.preview = Object.assign(Object.create(layer_attr.base),{
    'stroke-width': '2',
});

layer_attr.preview_module = Object.assign(Object.create(layer_attr.preview),{
    fill: '#ffb300',
    stroke: 'none',
});

layer_attr.preview_array = Object.assign(Object.create(layer_attr.preview),{
    stroke: '#ff5d00',
});

layer_attr.preview_DC = Object.assign(Object.create(layer_attr.preview),{
    stroke: '#b092c4',
});
layer_attr.preview_DC_box = Object.assign(Object.create(layer_attr.preview),{
    fill: '#b092c4',
    stroke: 'none',
});

layer_attr.preview_inverter = Object.assign(Object.create(layer_attr.preview),{
    stroke:'#86c974',
});
layer_attr.preview_inverter_box = Object.assign(Object.create(layer_attr.preview),{
    fill: '#86c974',
    stroke: 'none',
});

layer_attr.preview_AC = Object.assign(Object.create(layer_attr.preview),{
    stroke: '#8188a1',
});

layer_attr.preview_AC_box = Object.assign(Object.create(layer_attr.preview),{
    fill: '#8188a1',
    stroke: 'none',
});

layer_attr.preview_structural = Object.assign(Object.create(layer_attr.preview),{
    stroke: '#000000',
});
layer_attr.preview_structural_dot = Object.assign(Object.create(layer_attr.preview),{
    stroke: '#000000',
    "stroke-dasharray": "5, 5"
});
layer_attr.preview_structural_poly_unselected = Object.assign(Object.create(layer_attr.preview),{
    fill: '#e1e1e1',
    stroke: 'none'
});
layer_attr.preview_structural_poly_selected = Object.assign(Object.create(layer_attr.preview),{
    fill: '#ffe7cb',
    stroke: 'none'
});
layer_attr.preview_structural_poly_selected_framed = Object.assign(Object.create(layer_attr.preview),{
    fill: '#ffe7cb',
    stroke: '#000000'
});

layer_attr.preview_structural_module = Object.assign(Object.create(layer_attr.preview),{
    fill: '#ffffff',
    stroke: 'none'
});
layer_attr.preview_structural_module_selected = Object.assign(Object.create(layer_attr.preview),{
    fill: '#8397e8',
    stroke: '#dffaff'
});

layer_attr.north_arrow = Object.assign(Object.create(layer_attr.preview),{
    stroke: '#000000',
    'stroke-width': 1,
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
layer_attr.north_letter = Object.assign(Object.create(layer_attr.preview),{
    stroke: '#949494',
    'stroke-width': 5,
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});


module.exports = layer_attr;

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings_update.js":[function(require,module,exports){
'use strict';

var f = require('./functions');
//var mk_drawing = require('./mk_drawing');
//var display_svg = require('./display_svg');

var object_defined = f.object_defined;

var settings_update = function(settings) {

    //console.log('---settings---', settings);
    var config_options = settings.config_options;
    var system = settings.system;
    var loc = settings.drawing_settings.loc;
    var size = settings.drawing_settings.size;
    var state = settings.state;

    var inputs = settings.inputs;





    if( state.database_loaded ){
        inputs.DC = settings.inputs.DC || {};
        inputs.DC.wire_size = settings.inputs.DC.wire_size || {};
        inputs.DC.wire_size.options = inputs.DC.wire_size.options || f.obj_names(settings.config_options.NEC_tables['Ch 9 Table 8 Conductor Properties']);


    }

    //var show_defaults = false;
    ///*
    if( state.mode === 'dev'){
        //show_defaults = true;
        //console.log('Dev mode - defaults on');

        system.array.num_strings = system.array.num_strings || 4;
        system.array.modules_per_string = system.array.modules_per_string || 6;
        system.DC.home_run_length = system.DC.home_run_length || 50;

        system.roof.width  = system.roof.width || 60;
        system.roof.length = system.roof.length || 25;
        system.roof.slope  = system.roof.slope || "6:12";
        system.roof.type   = system.roof.type || "Gable";

        system.inverter.location = system.inverter.location  || "Inside";

        system.module.orientation = system.module.orientation || "Portrait";

        system.location.address = system.location.address || '1679 Clearlake Road';
        system.location.city    = system.location.city || 'Cocoa';
        system.location.zip     = system.location.zip || '32922';
        system.location.county   = system.location.county || 'Brevard';


        if( state.database_loaded ){
            system.inverter.make = system.inverter.make ||
                'SMA';
            system.inverter.model = system.inverter.model ||
                'SI3000';

            system.module.make = system.module.make ||
                f.obj_names( settings.components.modules )[0];
            //if( system.module.make) settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.modules[system.module.make]);
            system.module.model = system.module.model ||
                f.obj_names( settings.components.modules[system.module.make] )[0];


            system.module.model = system.module.model ||
                f.obj_names( settings.components.modules[system.module.make] )[0];

            system.AC.loadcenter_types = system.AC.loadcenter_types ||
            //    f.obj_names(inputs.AC.loadcenter_types)[0];
                '480/277V';


            system.AC.type = system.AC.type || '480V Wye';
            //system.AC.type = system.AC.type ||
            //    system.AC.loadcenter_types[system.AC.loadcenter_types][0];

            system.AC.distance_to_loadcenter = system.AC.distance_to_loadcenter ||
                50;


            system.DC.wire_size = inputs.DC.wire_size.options[3];
            /*

            settings.config_options.inverterMakeArray = k.objIdArray(settings.config_options.inverters);
            system.inverter.make = system.inverter.make || Object.keys( settings.config_options.inverters )[0];
            settings.config_options.inverterModelArray = k.objIdArray(settings.config_options.inverters[system.inverter.make]);

            system.AC_loadcenter_type = system.AC_loadcenter_type || config_options.AC_loadcenter_type_options[0];
            //*/


            system.attachment_system.make = system.attachment_system.make ||
                inputs.attachment_system.make.options[0];
            system.attachment_system.model = system.attachment_system.model ||
                inputs.attachment_system.model.options[0];

        }
    }
    //*/


    //console.log("settings_update");
    //console.log(system.module.make);

    inputs.module.make.options = f.obj_names(settings.components.modules);
    if( system.module.make ) {
        inputs.module.model.options  = f.obj_names( settings.components.modules[system.module.make] );
    }

    if( system.module.model ) {
        var specs = settings.components.modules[system.module.make][system.module.model];
        for( var spec_name in specs ){
            if( spec_name !== 'module_id' ){
                system.module[spec_name] = specs[spec_name];
            }
        }
        //system.module.specs = settings.components.modules[system.module.make][system.module.model];
    }

    if( f.section_defined('array') && f.section_defined('module') ){
        system.array = system.array || {};
        system.array.isc = system.module.isc * system.array.num_strings;
        system.array.voc = system.module.voc * system.array.modules_per_string;
        system.array.imp = system.module.imp * system.array.num_strings;
        system.array.vmp = system.module.vmp * system.array.modules_per_string;
        system.array.pmp = system.array.vmp  * system.array.imp;

        system.array.number_of_modules = system.array.modules_per_string * system.array.num_strings;


    }


    if( f.section_defined('DC') ){

        system.DC.wire_size = "-Undefined-";

    }

    inputs.inverter.make.options = f.obj_names(settings.components.inverters);
    if( system.inverter.make ) {
        inputs.inverter.model.options = f.obj_names( settings.components.inverters[system.inverter.make] );
    }
    if( f.section_defined('inverter') ){

    }

    //inputs.AC.loadcenter_type = settings.f.obj_names(inputs.AC.loadcenter_types);
    if( system.AC.loadcenter_types ) {
        var loadcenter_type = system.AC.loadcenter_types;
        var AC_options = inputs.AC.loadcenter_types[loadcenter_type];
        inputs.AC.type.options = AC_options;
        //in.opt.AC.types[loadcenter_type];

        //inputs.AC['type'] = f.obj_names( settings.in.opt.AC.type );
    }
    if( system.AC.type ) {
        system.AC.conductors = settings.in.opt.AC.types[system.AC.type];
        system.AC.num_conductors = system.AC.conductors.length;

    }
    if( f.section_defined('AC') ){

        system.AC.wire_size = "-Undefined-";
    }

    size.wire_offset.max = size.wire_offset.min + system.array.num_strings * size.wire_offset.base;
    size.wire_offset.ground = size.wire_offset.max + size.wire_offset.base*1;
    loc.array.left = loc.array.right - ( size.string.w * system.array.num_strings ) - ( size.module.frame.w*3/4 ) ;




    if( f.section_defined('location') ){
        //console.log('address ready');
        //f.request_geocode();
        g.perm.location.new_address = false;
        for( var name in g.system.location ){
            if( g.system.location[name] !== g.perm.location[name]){
                g.perm.location.new_address = true;
            }
            g.perm.location[name] = g.system.location[name];
        }

    }




};



module.exports = settings_update;

},{"./functions":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/functions.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/setup_webpage.js":[function(require,module,exports){



function setup_webpage(){
    var settings = g;
    var f = g.f;

    var system_frame_id = 'system_frame';
    var title = 'PV drawing test';

    g.f.setup_body(title);

    var page = $('<div>').attr('class', 'page').appendTo($(document.body));
    //page.style('width', (settings.drawing_settings.size.drawing.w+20).toString() + 'px' )

    var system_frame = $('<div>').attr('id', system_frame_id).appendTo(page);


    var header_container = $('<div>').appendTo(system_frame);
    $('<span>').html('Please select your system spec below').attr('class', 'category_title').appendTo(header_container);
    $('<span>').html(' | ').appendTo(header_container);
    //$('<input>').attr('type', 'button').attr('value', 'clear selections').click(window.location.reload),
    $('<a>').attr('href', 'javascript:window.location.reload()').html('clear selections').appendTo(header_container);


    // System setup
    $('<div>').html('System Setup').attr('class', 'section_title').appendTo(system_frame);
    var config_frame = $('<div>').attr('id', 'config_frame').appendTo(system_frame);

    g.f.add_selectors(settings, config_frame);
    //console.log(section_selector);



    //var location_drawer = $('#section_location').children('.drawer').children('.drawer_content');
    //console.log(location_drawer);


    var map_div = $('<div>');
    var map_drawer = f.mk_drawer('map',map_div)
                        //.appendTo(config_frame);
                        .insertAfter( $('#section_location') );
    map_drawer.children('.drawer').children('.drawer_content').slideUp('fast');



    var list_element = $('<ul>').appendTo(map_div);
    $('<li>').appendTo(list_element).append(
        $('<a>')
            .text('Wind Zone ')
            .attr('href', 'http://windspeed.atcouncil.org/')
            .attr('target', '_blank')
    );
    $('<li>').appendTo(list_element).append(
        $('<a>')
            .text('Climate Conditions')
            .attr('href', 'http://www.solarabcs.org/about/publications/reports/expedited-permit/map/index.html')
            .attr('target', '_blank')
    );


    var geocode_div = $('<div>')
        .attr('class', 'geocode_line')
        .appendTo(map_div);
    $('<a>').appendTo(geocode_div)
        .attr('class', 'geocode_button')
        .text('Find location from address')
        .attr('href', '#')
        .click(f.request_geocode);
    $('<span>').appendTo(geocode_div)
        .attr('class', 'geocode_display')
        .attr('id','geocode_display')
        .text('');

    $('<div>')
        .attr('id', 'map_road')
        .attr('class', 'map_road')
        .attr('style', 'width:485px;height:380px')
        .appendTo(map_div);
    $('<div>')
        .attr('id', 'map_sat')
        .attr('class', 'map_sat')
        .attr('style', 'width:485px;height:380px')
        .appendTo(map_div);


    var lat_fl_center = 27.75;
    var lon_fl_center = -84.0;

    var lat = 28.387399;
    var lon = -80.757833;
    var coor = [-80.757833, 28.387399];

    L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
    var sun_marker = L.AwesomeMarkers.icon({
        icon: 'sun-o',
        markerColor: 'blue  ',
        iconColor: 'yellow'
    });

    var map_road  = g.perm.maps.map_road = L.map( 'map_road', {
        center: [lat_fl_center, lon_fl_center],
        zoom: 6
    });

    L.tileLayer( 'http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors | Tiles Courtesy of <a href="http://www.mapquest.com/" title="MapQuest" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" width="16" height="16">',
        subdomains: ['otile1','otile2','otile3','otile4']
    }).addTo( map_road );

    g.perm.maps.marker_road = L.marker([lat,lon], {icon: sun_marker}).addTo(map_road);

    map_road.on('click', f.set_coordinates_from_map );




    var map_sat = g.perm.maps.map_sat = L.map( 'map_sat', {
        center: [lat, lon],
        zoom: 16
    });
    L.tileLayer( 'http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png', {
        subdomains: ['otile1','otile2','otile3','otile4']
    }).addTo( map_sat );

    g.perm.maps.marker_sat = L.marker([lat,lon], {icon: sun_marker}).addTo(map_sat);

    map_sat.on('click', f.set_coordinates_from_map );






    var drawing_preview = $('<div>').attr('id', 'drawing_frame_preview').appendTo(page);
    $('<div>').html('Preview').attr('class', 'section_title').appendTo(drawing_preview);
    $('<div>').attr('id', 'drawing_preview').attr('class', 'drawing').css('clear', 'both').appendTo(drawing_preview);





    var drawing_section = $('<div>').attr('id', 'drawing_frame').appendTo(page);
    //drawing.css('width', (settings.drawing_settings.size.drawing.w+20).toString() + 'px' );
    $('<div>').html('Drawing').attr('class', 'section_title').appendTo(drawing_section);


    //$('<form method="get" action="data/sample.pdf"><button type="submit">Download</button></form>').appendTo(drawing_section);
    //$('<span>').attr('id', 'download').attr('class', 'float_right').appendTo(drawing_section);
    $('<a>')
        .text('Download Drawing (sample)')
        .attr('href', 'sample_pdf/sample.pdf')
        .attr('id', 'download')
        .attr('class', 'float_right')
        .attr('target', '_blank')
        .appendTo(drawing_section);

    var svg_container_object = $('<div>').attr('id', 'drawing').attr('class', 'drawing').css('clear', 'both').appendTo(drawing_section);
    //svg_container_object.style('width', settings.drawing_settings.size.drawing.w+'px' )
    //var svg_container = svg_container_object.elem;
    $('<br>').appendTo(drawing_section);

    ///////////////////
    $('<div>').html(' ').attr('class', 'section_title').appendTo(drawing_section);

}



module.exports = setup_webpage;

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/update.js":[function(require,module,exports){


var update = function(){
    var settings = g;
    var f = g.f;

    console.log('/--- begin update');
    f.clear_drawing();


    settings.select_registry.forEach(function(selector){
        //console.log(selector.value());
        if(selector.value()) selector.system_ref.set(selector.value());
        //if(selector.value()) selector.input_ref.set(selector.value());
        //console.log(selector.set_ref.refString, selector.value(), selector.set_ref.get());

    });

    if( g.perm.location.lat && g.perm.location.lon) {
        f.set_sat_map_marker();
    }
    //copy inputs from settings.input to settings.system.


    f.settings_update(settings);

    settings.select_registry.forEach(function(selector){
        if( selector.type === 'select' ){
            f.selector_add_options(selector);
        } else if( selector.type === 'number_input' || selector.type === 'text_input' ) {
            selector.elem.value = selector.system_ref.get();
        }
    });

    settings.value_registry.forEach(function(value_item){
        value_item.elem.innerHTML = value_item.value_ref.get();
    });

    // Determine active section based on section inputs entered by user
    var sections = g.webpage.sections;
    var active_section;
    sections.every(function(section_name,id){ //TODO: find pre IE9 way to do this?
        if( ! g.f.section_defined(section_name) ){
            active_section = section_name;
            console.log('active section:', section_name);
            return false;
        } else {
            if( id === sections.length-1 ){ //If last section is defined, there is no active section
                active_section = false;
            }
            return true;
        }
    });
    // Close section if they are not active sections, unless they have been opened by the user, open the active section
    sections.forEach(function(section_name,id){ //TODO: find pre IE9 way to do this?
        if( section_name === active_section ){
            $('#section_'+section_name).children('.drawer').children('.drawer_content').slideDown('fast');
        } else if( ! g.webpage.selections_manual_toggled[section_name] ){
            $('#section_'+section_name).children('.drawer').children('.drawer_content').slideUp('fast');
        }
    });
    //If the location is defined, open the map.
    if( (! g.webpage.selections_manual_toggled.location) &&  g.f.section_defined('location') ){
            $('#section_map').children('.drawer').children('.drawer_content').slideDown('fast');
    }

    // Make blocks
    f.mk_blocks();

    // Make preview
    settings.drawing.preview_parts = {};
    settings.drawing.preview_svgs = {};
    $('#drawing_preview').empty().html('');
    for( var p in f.mk_preview ){
        settings.drawing.preview_parts[p] = f.mk_preview[p](settings);
        settings.drawing.preview_svgs[p] = f.mk_svg(settings.drawing.preview_parts[p], settings);
        var section = ['','Electrical','Structural'][p];
        $('#drawing_preview')
            //.append($('<p>Page '+p+'</p>'))
            .append($('<p>'+section+'</p>'))
            .append($(settings.drawing.preview_svgs[p]))
            .append($('</br>'))
            .append($('</br>'));

    }



    // Make drawing
    settings.drawing.parts = {};
    settings.drawing.svgs = {};
    $('#drawing').empty().html('Electrical');
    for( p in f.mk_page ){
        settings.drawing.parts[p] = f.mk_page[p](settings);
        settings.drawing.svgs[p] = f.mk_svg(settings.drawing.parts[p], settings);
        $('#drawing')
            //.append($('<p>Page '+p+'</p>'))
            .append($(settings.drawing.svgs[p]))
            .append($('</br>'))
            .append($('</br>'));

    }


    //var site_plan_element = document.createElementNS("http://www.w3.org/2000/svg", "image");
    //var site_plan_img = $(site_plan_element)
    //    .attr('x',100)
    //    .attr('y',100)
    //    .prependTo(
    //        $('#drawing').children('.svg_drawing')[0]
    //    );
    //L_PREFER_CANVAS = true;
    //var map = g.perm.maps.map_road;
    //leafletImage( map, function(err, canvas) {
    //    // now you have canvas
    //    // example thing to do with that canvas:
    //    var img = document.createElement('img');
    //    var dimensions = map.getSize();
    //    img.width = dimensions.x;
    //    img.height = dimensions.y;
    //    img.src = canvas.toDataURL();
    //    console.log(img);
    //    $('body').append(img);
    //});


    console.log('\\--- end update');
};


module.exports = update;

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/data/tables.json":[function(require,module,exports){
module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports={

    "NEC 250.122_header": ["Amp","AWG"],
    "NEC 250.122": {
        "15":"14",
        "20":"12",
        "30":"10",
        "40":"10",
        "60":"10",
        "100":"8",
        "200":"6",
        "300":"4",
        "400":"3",
        "500":"2",
        "600":"1",
        "800":"1/0",
        "1000":"2/0",
        "1200":"3/0",
        "1600":"4/0",
        "2000":"250",
        "2500":"350",
        "3000":"400",
        "4000":"500",
        "5000":"700",
        "6000":"800",
    },

    "NEC T690.7_header": ["Ambient Temperature (C)", "Correction Factor"],
    "NEC T690.7": {
        "25 to 20":"1.02",
        "19 to 15":"1.04",
        "15 to 10":"1.06",
        "9 to 5":"1.08",
        "4 to 0":"1.10",
        "-1 to -5":"1.12",
        "-6 to -10":"1.14",
        "-11 to -15":"1.16",
        "-16 to -20":"1.18",
        "-21 to -25":"1.20",
        "-26 to -30":"1.21",
        "-31 to -35":"1.23",
        "-36 to -40":"1.25",
    },

    "Ch 9 Table 8 Conductor Properties_header": ["Size","ohm/kft"],
    "Ch 9 Table 8 Conductor Properties": {
        "#01":" 0.154",
        "#01/0":"0.122",
        "#02":"0.194",
        "#02/0":"0.0967",
        "#03":"0.245",
        "#03/0":"0.0766",
        "#04":"0.308",
        "#04/0":"0.0608",
        "#06":"0.491",
        "#08":"0.778",
        "#10":"1.24",
        "#12":"1.98",
        "#14":"3.14",
    }
}

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/kontainer.js":[function(require,module,exports){
'use strict';

var kontainer = {
    ref: function(refString){
        if( typeof refString === 'undefined' ){
            return this.refString;
        } else {
            this.refString = refString;
            this.refArray = refString.split('.');
            if( typeof this.object !== 'undefined'){
                this.ready = true;
            } else {
                this.ready = false;
            }
        }
        return this;
    },
    obj: function(obj){
        if( typeof obj === 'undefined' ){
            return this.object;
        } else {
            this.object = obj;
            if( typeof this.refString !== 'undefined'){
                this.ready = true;
            } else {
                this.ready = false;
            }
        }
        return this;
    },
    set: function(input){
        if( typeof this.object === 'undefined' || typeof this.refString === 'undefined' ){
            return false;
        }
        var parent = this.object;
        var last_level = this.refArray[this.refArray.length-1];

        this.refArray.forEach(function(level_name,i){
            if( typeof parent[level_name] === 'undefined' ) {
                parent[level_name] = {};
            }
            if( level_name !== last_level ){
                parent = parent[level_name];
            }
        });
        parent[last_level] = input;
        //console.log('setting:', input, this.get(), this.refString );
        return parent[last_level];
    },
    get: function(){
        var level = this.object;
        this.refArray.forEach(function(level_name,i){
            if( typeof level[level_name] === 'undefined' ) {
                return false;
            }
            level = level[level_name];
        });
        return level;
    },
};

module.exports = kontainer;

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/main.js":[function(require,module,exports){
'use strict';
//var version_string = 'Dev';
//var version_string = 'Alpha201401--';
var version_string = 'Preview'+moment().format('YYYYMMDD');



window.g = require('./app/settings');
console.log('settings', g);

g.state.version_string = version_string;

var f = require('./app/functions');
f.g = g;
g.f = f;

var query = f.query_string();
//console.log(query);
if( query['mode'] === "dev" ) {
    g.state.mode = 'dev';
} else {
    g.state.mode = 'release';
}

f.setup_webpage = require('./app/setup_webpage');

f.settings_update = require('./app/settings_update');
f.update = require('./app/update');


f.mk_blocks = require('./app/mk_blocks');

f.mk_page = {};
f.mk_page[1] = require('./app/mk_page_1');
f.mk_page[2] = require('./app/mk_page_2');
f.mk_page[3] = require('./app/mk_page_3');
f.mk_page[4] = require('./app/mk_page_4');

f.mk_preview = {};
f.mk_preview[1] = require('./app/mk_page_preview_1');
f.mk_preview[2] = require('./app/mk_page_preview_2');

f.mk_svg= require('./app/mk_svg');




// request external data
//var database_json_URL = 'http://10.173.64.204:8000/temporary/';
var database_json_URL = 'data/fsec_copy.json';
$.getJSON( database_json_URL)
    .done(function(json){
        g.database = json;
        //console.log('database loaded', settings.database);
        f.load_database(json);
        g.state.database_loaded = true;
        f.update();

    });


// Build webpage
f.setup_webpage();

// Add status bar
var boot_time = moment();
var status_id = 'status';
setInterval(function(){ f.update_status_bar(status_id, boot_time, version_string);},1000);

// Update
f.update();

},{"./app/functions":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/functions.js","./app/mk_blocks":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_blocks.js","./app/mk_page_1":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_1.js","./app/mk_page_2":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_2.js","./app/mk_page_3":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_3.js","./app/mk_page_4":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_4.js","./app/mk_page_preview_1":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_preview_1.js","./app/mk_page_preview_2":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_preview_2.js","./app/mk_svg":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_svg.js","./app/settings":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings.js","./app/settings_update":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings_update.js","./app/setup_webpage":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/setup_webpage.js","./app/update":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/update.js"}]},{},["/home/kshowalter/Dropbox/server/express_default/public/plans_machine/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9mdW5jdGlvbnMuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvbWtfYmxvY2tzLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvYXBwL21rX2JvcmRlci5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19kcmF3aW5nLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvYXBwL21rX3BhZ2VfMS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19wYWdlXzIuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvbWtfcGFnZV8zLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvYXBwL21rX3BhZ2VfNC5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19wYWdlX3ByZXZpZXdfMS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19wYWdlX3ByZXZpZXdfMi5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19zdmcuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvc2V0dGluZ3MuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvc2V0dGluZ3NfZHJhd2luZy5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9zZXR0aW5nc19mb250cy5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9zZXR0aW5nc19sYXllcnMuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvc2V0dGluZ3NfdXBkYXRlLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvYXBwL3NldHVwX3dlYnBhZ2UuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvdXBkYXRlLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvZGF0YS90YWJsZXMuanNvbiIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2xpYi9rb250YWluZXIuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2a0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcm9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcbnZhciBrb250YWluZXIgPSByZXF1aXJlKCcuLi9saWIva29udGFpbmVyJyk7XG5cbnZhciBmID0ge307XG5cblxuZi5zZXR1cF9ib2R5ID0gZnVuY3Rpb24odGl0bGUsIHNlY3Rpb25zKXtcbiAgICBkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xuICAgIHZhciBib2R5ID0gZG9jdW1lbnQuYm9keTtcbiAgICB2YXIgc3RhdHVzX2JhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHN0YXR1c19iYXIuaWQgPSAnc3RhdHVzJztcbiAgICBzdGF0dXNfYmFyLmlubmVySFRNTCA9ICdsb2FkaW5nIHN0YXR1cy4uLic7XG4gICAgYm9keS5pbnNlcnRCZWZvcmUoc3RhdHVzX2JhciwgYm9keS5maXJzdENoaWxkKTtcbn07XG5cbmYucGFkX3plcm8gPSBmdW5jdGlvbihudW0sIHNpemUpe1xuICAgIHZhciBzID0gJzAwMDAwMDAwMCcgKyBudW07XG4gICAgcmV0dXJuIHMuc3Vic3RyKHMubGVuZ3RoLXNpemUpO1xufTtcblxuZi51cHRpbWUgPSBmdW5jdGlvbihib290X3RpbWUpe1xuICAgIHZhciB1cHRpbWVfc2Vjb25kc190b3RhbCA9IG1vbWVudCgpLmRpZmYoYm9vdF90aW1lLCAnc2Vjb25kcycpO1xuICAgIHZhciB1cHRpbWVfaG91cnMgPSBNYXRoLmZsb29yKCAgdXB0aW1lX3NlY29uZHNfdG90YWwgLyg2MCo2MCkgKTtcbiAgICB2YXIgbWludXRlc19sZWZ0ID0gdXB0aW1lX3NlY29uZHNfdG90YWwgJSg2MCo2MCk7XG4gICAgdmFyIHVwdGltZV9taW51dGVzID0gZi5wYWRfemVybyggTWF0aC5mbG9vciggIG1pbnV0ZXNfbGVmdCAvNjAgKSwgMiApO1xuICAgIHZhciB1cHRpbWVfc2Vjb25kcyA9IGYucGFkX3plcm8oIChtaW51dGVzX2xlZnQgJSA2MCksIDIgKTtcbiAgICByZXR1cm4gdXB0aW1lX2hvdXJzICtcIjpcIisgdXB0aW1lX21pbnV0ZXMgK1wiOlwiKyB1cHRpbWVfc2Vjb25kcztcbn07XG5cbmYudXBkYXRlX3N0YXR1c19iYXIgPSBmdW5jdGlvbihzdGF0dXNfaWQsIGJvb3RfdGltZSwgc3RyaW5nKSB7XG4gICAgdmFyIHN0YXR1c19kaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzdGF0dXNfaWQpO1xuICAgIHN0YXR1c19kaXYuaW5uZXJIVE1MID0gc3RyaW5nO1xuICAgIHN0YXR1c19kaXYuaW5uZXJIVE1MICs9ICcgfCAnO1xuXG4gICAgdmFyIGNsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNsb2NrLmlubmVySFRNTCA9IG1vbWVudCgpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpO1xuXG4gICAgdmFyIHVwdGltZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB1cHRpbWUuaW5uZXJIVE1MID0gJ1VwdGltZTogJyArIGYudXB0aW1lKGJvb3RfdGltZSk7XG5cbiAgICBzdGF0dXNfZGl2LmFwcGVuZENoaWxkKGNsb2NrKTtcbiAgICBzdGF0dXNfZGl2LmlubmVySFRNTCArPSAnIHwgJztcbiAgICBzdGF0dXNfZGl2LmFwcGVuZENoaWxkKHVwdGltZSk7XG4gICAgc3RhdHVzX2Rpdi5pbm5lckhUTUwgKz0gJyB8ICc7XG59O1xuXG5cbmYub2JqX25hbWVzID0gZnVuY3Rpb24oIG9iamVjdCApIHtcbiAgICBpZiggb2JqZWN0ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHZhciBhID0gW107XG4gICAgICAgIGZvciggdmFyIGlkIGluIG9iamVjdCApIHtcbiAgICAgICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoaWQpICkgIHtcbiAgICAgICAgICAgICAgICBhLnB1c2goaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbn07XG5cbmYub2JqZWN0X2RlZmluZWQgPSBmdW5jdGlvbihvYmplY3Qpe1xuICAgIC8vY29uc29sZS5sb2cob2JqZWN0KTtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0ICl7XG4gICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhrZXkpO1xuICAgICAgICAgICAgaWYoIG9iamVjdFtrZXldID09PSBudWxsIHx8IG9iamVjdFtrZXldID09PSB1bmRlZmluZWQgKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5mLnNlY3Rpb25fZGVmaW5lZCA9IGZ1bmN0aW9uKHNlY3Rpb25fbmFtZSl7XG4gICAgLy9jb25zb2xlLmxvZyhcIi1cIitzZWN0aW9uX25hbWUpO1xuICAgIC8vdmFyIGlucHV0X3NlY3Rpb24gPSBnLmlucHV0c1tzZWN0aW9uX25hbWVdO1xuICAgIHZhciBvdXRwdXRfc2VjdGlvbiA9IGcuc3lzdGVtW3NlY3Rpb25fbmFtZV07XG4gICAgZm9yKCB2YXIga2V5IGluIG91dHB1dF9zZWN0aW9uICl7XG4gICAgICAgIGlmKCBvdXRwdXRfc2VjdGlvbi5oYXNPd25Qcm9wZXJ0eShrZXkpICl7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGtleSk7XG5cbiAgICAgICAgICAgIGlmKCBvdXRwdXRfc2VjdGlvbltrZXldID09PSB1bmRlZmluZWQgfHwgb3V0cHV0X3NlY3Rpb25ba2V5XSA9PT0gbnVsbCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5mLm51bGxUb09iamVjdCA9IGZ1bmN0aW9uKG9iamVjdCl7XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdCApe1xuICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIGlmKCBvYmplY3Rba2V5XSA9PT0gbnVsbCApe1xuICAgICAgICAgICAgICAgIG9iamVjdFtrZXldID0ge307XG4gICAgICAgICAgICB9IGVsc2UgaWYoIHR5cGVvZiBvYmplY3Rba2V5XSA9PT0gJ29iamVjdCcgKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0W2tleV0gPSBmLm51bGxUb09iamVjdChvYmplY3Rba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbn07XG5cbmYuYmxhbmtfY29weSA9IGZ1bmN0aW9uKG9iamVjdCl7XG4gICAgdmFyIG5ld09iamVjdCA9IHt9O1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QgKXtcbiAgICAgICAgaWYoIG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpICl7XG4gICAgICAgICAgICBpZiggb2JqZWN0W2tleV0uY29uc3RydWN0b3IgPT09IE9iamVjdCApIHtcbiAgICAgICAgICAgICAgICBuZXdPYmplY3Rba2V5XSA9IHt9O1xuICAgICAgICAgICAgICAgIGZvciggdmFyIGtleTIgaW4gb2JqZWN0W2tleV0gKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIG9iamVjdFtrZXldLmhhc093blByb3BlcnR5KGtleTIpICl7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3Rba2V5XVtrZXkyXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3T2JqZWN0O1xufTtcblxuZi5ibGFua19jbGVhbl9jb3B5ID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICB2YXIgbmV3T2JqZWN0ID0ge307XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdCApe1xuICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIGlmKCBvYmplY3Rba2V5XS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICkge1xuICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldID0ge307XG4gICAgICAgICAgICAgICAgZm9yKCB2YXIga2V5MiBpbiBvYmplY3Rba2V5XSApe1xuICAgICAgICAgICAgICAgICAgICBpZiggb2JqZWN0W2tleV0uaGFzT3duUHJvcGVydHkoa2V5MikgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjbGVhbl9rZXkgPSBmLmNsZWFuX25hbWUoa2V5Mik7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3Rba2V5XVtjbGVhbl9rZXldID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3T2JqZWN0W2tleV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdPYmplY3Q7XG59O1xuXG5mLm1lcmdlX29iamVjdHMgPSBmdW5jdGlvbiBtZXJnZV9vYmplY3RzKG9iamVjdDEsIG9iamVjdDIpe1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QxICl7XG4gICAgICAgIGlmKCBvYmplY3QxLmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIC8vaWYoIGtleSA9PT0gJ21ha2UnICkgY29uc29sZS5sb2coa2V5LCBvYmplY3QxLCB0eXBlb2Ygb2JqZWN0MVtrZXldLCB0eXBlb2Ygb2JqZWN0MltrZXldKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coa2V5LCBvYmplY3QxLCB0eXBlb2Ygb2JqZWN0MVtrZXldLCB0eXBlb2Ygb2JqZWN0MltrZXldKTtcbiAgICAgICAgICAgIGlmKCBvYmplY3QxW2tleV0gJiYgb2JqZWN0MVtrZXldLmNvbnN0cnVjdG9yID09PSBPYmplY3QgKSB7XG4gICAgICAgICAgICAgICAgaWYoIG9iamVjdDJba2V5XSA9PT0gdW5kZWZpbmVkICkgb2JqZWN0MltrZXldID0ge307XG4gICAgICAgICAgICAgICAgbWVyZ2Vfb2JqZWN0cyggb2JqZWN0MVtrZXldLCBvYmplY3QyW2tleV0gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYoIG9iamVjdDJba2V5XSA9PT0gdW5kZWZpbmVkICkgb2JqZWN0MltrZXldID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmYuYXJyYXlfdG9fb2JqZWN0ID0gZnVuY3Rpb24oYXJyKSB7XG4gICAgdmFyIHIgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7ICsraSlcbiAgICAgICAgcltpXSA9IGFycltpXTtcbiAgICByZXR1cm4gcjtcbn07XG5cbmYubmFuX2NoZWNrID0gZnVuY3Rpb24gbmFuX2NoZWNrKG9iamVjdCwgcGF0aCl7XG4gICAgaWYoIHBhdGggPT09IHVuZGVmaW5lZCApIHBhdGggPSBcIlwiO1xuICAgIHBhdGggPSBwYXRoK1wiLlwiO1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QgKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggXCJOYU5jaGVjazogXCIrcGF0aCtrZXkgKTtcblxuICAgICAgICBpZiggb2JqZWN0W2tleV0gJiYgb2JqZWN0W2tleV0uY29uc3RydWN0b3IgPT09IEFycmF5ICkgb2JqZWN0W2tleV0gPSBmLmFycmF5X3RvX29iamVjdChvYmplY3Rba2V5XSk7XG5cblxuICAgICAgICBpZiggIG9iamVjdFtrZXldICYmICggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgfHwgb2JqZWN0W2tleV0gIT09IG51bGwgKSl7XG4gICAgICAgICAgICBpZiggb2JqZWN0W2tleV0uY29uc3RydWN0b3IgPT09IE9iamVjdCApe1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coIFwiICBPYmplY3Q6IFwiK3BhdGgra2V5ICk7XG4gICAgICAgICAgICAgICAgbmFuX2NoZWNrKCBvYmplY3Rba2V5XSwgcGF0aCtrZXkgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiggb2JqZWN0W2tleV0gPT09IE5hTiB8fCBvYmplY3Rba2V5XSA9PT0gbnVsbCApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcIk5hTjogXCIrcGF0aCtrZXkgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggXCJEZWZpbmVkOiBcIitwYXRoK2tleSwgb2JqZWN0W2tleV0pO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cbn07XG5cbmYuc3RyX3RvX251bSA9IGZ1bmN0aW9uIHN0cl90b19udW0oaW5wdXQpe1xuICAgIHZhciBvdXRwdXQ7XG4gICAgaWYoIWlzTmFOKGlucHV0KSkgb3V0cHV0ID0gTnVtYmVyKGlucHV0KTtcbiAgICBlbHNlIG91dHB1dCA9IGlucHV0O1xuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG5cbmYucHJldHR5X3dvcmQgPSBmdW5jdGlvbihuYW1lKXtcbiAgICByZXR1cm4gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSk7XG59O1xuXG5mLnByZXR0eV9uYW1lID0gZnVuY3Rpb24obmFtZSl7XG4gICAgdmFyIGwgPSBuYW1lLnNwbGl0KCdfJyk7XG4gICAgbC5mb3JFYWNoKGZ1bmN0aW9uKG5hbWVfc2VxbWVudCxpKXtcbiAgICAgICAgbFtpXSA9IGYucHJldHR5X3dvcmQobmFtZV9zZXFtZW50KTtcbiAgICB9KTtcbiAgICB2YXIgcHJldHR5ID0gbC5qb2luKCcgJyk7XG5cbiAgICByZXR1cm4gcHJldHR5O1xufTtcblxuZi5wcmV0dHlfbmFtZXMgPSBmdW5jdGlvbihvYmplY3Qpe1xuICAgIHZhciBuZXdfb2JqZWN0ID0ge307XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdCApe1xuICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIHZhciBuZXdfa2V5ID0gZi5wcmV0dHlfbmFtZShrZXkpO1xuICAgICAgICAgICAgbmV3X29iamVjdFtuZXdfa2V5XSA9IG9iamVjdFtrZXldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdfb2JqZWN0O1xufTtcblxuZi5jbGVhbl9uYW1lID0gZnVuY3Rpb24obmFtZSl7XG4gICAgcmV0dXJuIG5hbWUuc3BsaXQoJyAnKVswXTtcbn07XG5cblxuZi5ta19kcmF3ZXIgPSBmdW5jdGlvbih0aXRsZSwgY29udGVudCl7XG4gICAgdmFyIGRyYXdlcl9jb250YWluZXIgPSAkKCc8ZGl2PicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2lucHV0X3NlY3Rpb24nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdpZCcsICdzZWN0aW9uXycrdGl0bGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLmF0dHIoJ2lkJywgdGl0bGUgKTtcbiAgICAvL2RyYXdlcl9jb250YWluZXIuZ2V0KDApLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5X3R5cGU7XG4gICAgdmFyIHN5c3RlbV9kaXYgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3RpdGxlX2JhcicpXG4gICAgICAgIC5hdHRyKCdzZWN0aW9uX25vbScsIHRpdGxlKVxuICAgICAgICAuYXBwZW5kVG8oZHJhd2VyX2NvbnRhaW5lcilcbiAgICAgICAgLyoganNoaW50IC1XMDgzICovXG4gICAgICAgIC5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIG5hbWUgPSAkKHRoaXMpLmF0dHIoJ3NlY3Rpb25fbm9tJyk7XG4gICAgICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0aW9uc19tYW51YWxfdG9nZ2xlZFtuYW1lXSA9IHRydWU7XG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlVG9nZ2xlKCdmYXN0Jyk7XG4gICAgICAgIH0pO1xuICAgIHZhciBzeXN0ZW1fdGl0bGUgPSAkKCc8YT4nKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAndGl0bGVfYmFyX3RleHQnKVxuICAgICAgICAuYXR0cignaHJlZicsICcjJylcbiAgICAgICAgLnRleHQoZi5wcmV0dHlfbmFtZSh0aXRsZSkpXG4gICAgICAgIC5hcHBlbmRUbyhzeXN0ZW1fZGl2KTtcblxuICAgIHZhciBkcmF3ZXIgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ2RyYXdlcicpLmFwcGVuZFRvKGRyYXdlcl9jb250YWluZXIpO1xuICAgIGNvbnRlbnQuYXR0cignY2xhc3MnLCAnZHJhd2VyX2NvbnRlbnQnKS5hcHBlbmRUbyhkcmF3ZXIpO1xuXG5cbiAgICByZXR1cm4gZHJhd2VyX2NvbnRhaW5lcjtcblxuXG59O1xuXG5cbmYuYWRkX3NlbGVjdG9ycyA9IGZ1bmN0aW9uKHNldHRpbmdzLCBwYXJlbnRfY29udGFpbmVyKXtcbiAgICBmb3IoIHZhciBzZWN0aW9uX25hbWUgaW4gc2V0dGluZ3MuaW5wdXRzICl7XG5cbiAgICAgICAgLy8kKHRoaXMpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgIHZhciBkcmF3ZXJfY29udGVudCA9ICQoJzxkaXY+Jyk7XG4gICAgICAgIGZvciggdmFyIGlucHV0X25hbWUgaW4gc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV0gKXtcbiAgICAgICAgICAgIHZhciB1bml0cztcbiAgICAgICAgICAgIGlmKCAoc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0gIT09IHVuZGVmaW5lZCkgJiYgKHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdLnVuaXRzICE9PSB1bmRlZmluZWQpICkge1xuICAgICAgICAgICAgICAgIHVuaXRzID0gXCIoXCIgKyBzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXS51bml0cyArIFwiKVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1bml0cyA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbm90ZTtcbiAgICAgICAgICAgIGlmKCAoc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0gIT09IHVuZGVmaW5lZCkgJiYgKHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdLm5vdGUgIT09IHVuZGVmaW5lZCkgKSB7XG4gICAgICAgICAgICAgICAgbm90ZSA9IHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdLm5vdGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5vdGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuXG5cblxuICAgICAgICAgICAgdmFyIHNlbGVjdG9yX3NldCA9ICQoJzxzcGFuPicpLmF0dHIoJ2NsYXNzJywgJ3NlbGVjdG9yX3NldCcpLmFwcGVuZFRvKGRyYXdlcl9jb250ZW50KTtcbiAgICAgICAgICAgIHZhciBpbnB1dF90ZXh0ID0gJCgnPHNwYW4+JykuaHRtbChmLnByZXR0eV9uYW1lKGlucHV0X25hbWUpICsgJzogJyArIHVuaXRzICkuYXBwZW5kVG8oc2VsZWN0b3Jfc2V0KTtcbiAgICAgICAgICAgIGlmKCBub3RlICkgaW5wdXRfdGV4dC5hdHRyKCd0aXRsZScsIG5vdGUpO1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIHZhciBzZWxlY3RvciA9IGskKCdzZWxlY3RvcicpXG4gICAgICAgICAgICAgICAgLnNldE9wdGlvbnNSZWYoICdpbnB1dHMuJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUgKVxuICAgICAgICAgICAgICAgIC5zZXRSZWYoICdzeXN0ZW0uJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUgKVxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhzZWxlY3Rvcl9zZXQpO1xuICAgICAgICAgICAgZi5rZWxlbV9zZXR1cChzZWxlY3Rvciwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgLy8qL1xuICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICAgIHN5c3RlbV9yZWY6IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKS5vYmooc2V0dGluZ3MpLnJlZignc3lzdGVtLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lKSxcbiAgICAgICAgICAgICAgICAvL2lucHV0X3JlZjogT2JqZWN0LmNyZWF0ZShrb250YWluZXIpLm9iaihzZXR0aW5ncykucmVmKCdpbnB1dHMuJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUgKyAnLnZhbHVlJyksXG4gICAgICAgICAgICAgICAgbGlzdF9yZWY6IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKS5vYmooc2V0dGluZ3MpLnJlZignaW5wdXRzLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lICsgJy5vcHRpb25zJyksXG4gICAgICAgICAgICAgICAgaW50ZXJhY3RlZDogZmFsc2UsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYoIChzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSAhPT0gdW5kZWZpbmVkKSAmJiAoc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0udHlwZSAhPT0gdW5kZWZpbmVkKSApIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci50eXBlID0gc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0udHlwZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IudHlwZSA9ICdzZWxlY3QnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoIHNlbGVjdG9yLnR5cGUgPT09ICdzZWxlY3QnICl7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IuZWxlbSA9ICQoJzxzZWxlY3Q+JylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3NlbGVjdG9yJylcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKHNlbGVjdG9yX3NldClcbiAgICAgICAgICAgICAgICAgICAgLmdldCgpWzBdO1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLnZhbHVlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggdGhpcy5zZXRfcmVmLnJlZlN0cmluZywgdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXggKTtcbiAgICAgICAgICAgICAgICAgICAgLy9pZiggdGhpcy5pbnRlcmFjdGVkIClcbiAgICAgICAgICAgICAgICAgICAgaWYoIHRoaXMuZWxlbS5zZWxlY3RlZEluZGV4ID49IDApIHJldHVybiB0aGlzLmVsZW0ub3B0aW9uc1t0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZi5zZWxlY3Rvcl9hZGRfb3B0aW9ucyhzZWxlY3Rvcik7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiggc2VsZWN0b3IudHlwZSA9PT0gJ251bWJlcl9pbnB1dCcgfHwgc2VsZWN0b3IudHlwZSA9PT0gJ3RleHRfaW5wdXQnKXtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci5lbGVtID0gJCgnPGlucHV0PicpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIHNlbGVjdG9yLnR5cGUpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCd0eXBlJywgJ3RleHQnKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oc2VsZWN0b3Jfc2V0KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KClbMF07XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IudmFsdWUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCB0aGlzLnNldF9yZWYucmVmU3RyaW5nLCB0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleCApO1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCB0aGlzLmVsZW0sIHRoaXMuZWxlbS52YWx1ZSApO1xuICAgICAgICAgICAgICAgICAgICAvL2lmKCB0aGlzLmludGVyYWN0ZWQgKVxuICAgICAgICAgICAgICAgICAgICAvL2lmKCB0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleCA+PSAwKSByZXR1cm4gdGhpcy5lbGVtLm9wdGlvbnNbdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAvL2Vsc2UgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtLnZhbHVlO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IuZWxlbS52YWx1ZSA9IHNlbGVjdG9yLnN5c3RlbV9yZWYuZ2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKHNlbGVjdG9yLmVsZW0pLmNoYW5nZShmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuZi51cGRhdGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc2V0dGluZ3Muc2VsZWN0X3JlZ2lzdHJ5LnB1c2goc2VsZWN0b3IpO1xuICAgICAgICAgICAgLy8kKCc8L2JyPicpLmFwcGVuZFRvKGRyYXdlcl9jb250ZW50KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlbGVjdGlvbl9jb250YWluZXIgPSBmLm1rX2RyYXdlcihzZWN0aW9uX25hbWUsIGRyYXdlcl9jb250ZW50KTtcblxuICAgICAgICBzZWxlY3Rpb25fY29udGFpbmVyLmFwcGVuZFRvKHBhcmVudF9jb250YWluZXIpO1xuXG4gICAgICAgICQoc2VsZWN0aW9uX2NvbnRhaW5lcikuY2hpbGRyZW4oJy5kcmF3ZXInKS5jaGlsZHJlbignLmRyYXdlcl9jb250ZW50Jykuc2xpZGVVcCgnZmFzdCcpO1xuICAgIH1cbn07XG5cbmYuc2VsZWN0b3JfYWRkX29wdGlvbnMgPSBmdW5jdGlvbihzZWxlY3Rvcil7XG4gICAgdmFyIGxpc3QgPSBzZWxlY3Rvci5saXN0X3JlZi5nZXQoKTtcbiAgICBpZiggbGlzdCAmJiBsaXN0LmNvbnN0cnVjdG9yID09PSBPYmplY3QgKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ1wibGlzdFwiJywgbGlzdCk7XG4gICAgICAgIGxpc3QgPSBmLm9ial9uYW1lcyhsaXN0KTtcbiAgICB9XG4gICAgc2VsZWN0b3IuZWxlbS5pbm5lckhUTUwgPSBcIlwiO1xuICAgIGlmKCBsaXN0IGluc3RhbmNlb2YgQXJyYXkgKXtcbiAgICAgICAgdmFyIGN1cnJlbnRfdmFsdWUgPSBzZWxlY3Rvci5zeXN0ZW1fcmVmLmdldCgpO1xuICAgICAgICAkKCc8b3B0aW9uPicpLmF0dHIoJ3NlbGVjdGVkJyx0cnVlKS5hdHRyKCdkaXNhYmxlZCcsdHJ1ZSkuYXR0cignaGlkZGVuJyx0cnVlKS5hcHBlbmRUbyhzZWxlY3Rvci5lbGVtKTtcblxuICAgICAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24ob3B0X25hbWUpe1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhvcHRfbmFtZSk7XG4gICAgICAgICAgICB2YXIgbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICAgICAgby52YWx1ZSA9IG9wdF9uYW1lO1xuICAgICAgICAgICAgaWYoIGN1cnJlbnRfdmFsdWUgKXtcbiAgICAgICAgICAgICAgICBpZiggb3B0X25hbWUudG9TdHJpbmcoKSA9PT0gY3VycmVudF92YWx1ZS50b1N0cmluZygpICkge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdmb3VuZCBpdDonLCBvcHRfbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIG8uc2VsZWN0ZWQgPSBcInNlbGVjdGVkXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZG9lcyBub3QgbWF0Y2g6ICcsIG9wdF9uYW1lLCBcIixcIiwgIGN1cnJlbnRfdmFsdWUsIFwiLlwiICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vby5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlbGVjdG9yX29wdGlvbicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdubyBjdXJyZW50IHZhbHVlJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG8uaW5uZXJIVE1MID0gb3B0X25hbWU7XG4gICAgICAgICAgICBzZWxlY3Rvci5lbGVtLmFwcGVuZENoaWxkKG8pO1xuICAgICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2xpc3Qgbm90IGEgbGlzdCcsIGxpc3QsIHNlbGVjdCk7XG4gICAgfVxufTtcblxuZi5hZGRfb3B0aW9ucyA9IGZ1bmN0aW9uKHNlbGVjdCwgYXJyYXkpe1xuICAgIGFycmF5LmZvckVhY2goIGZ1bmN0aW9uKG9wdGlvbil7XG4gICAgICAgICQoJzxvcHRpb24+JykuYXR0ciggJ3ZhbHVlJywgb3B0aW9uICkudGV4dChvcHRpb24pLmFwcGVuZFRvKHNlbGVjdCk7XG4gICAgfSk7XG59O1xuXG5mLmFkZF9wYXJhbXMgPSBmdW5jdGlvbihzZXR0aW5ncywgcGFyZW50X2NvbnRhaW5lcil7XG4gICAgZm9yKCB2YXIgc2VjdGlvbl9uYW1lIGluIHNldHRpbmdzLnN5c3RlbSApe1xuICAgICAgICBpZiggdHJ1ZSB8fCBmLm9iamVjdF9kZWZpbmVkKHNldHRpbmdzLnN5c3RlbVtzZWN0aW9uX25hbWVdKSApe1xuICAgICAgICAgICAgdmFyIHNlbGVjdGlvbl9jb250YWluZXIgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3BhcmFtX3NlY3Rpb24nKS5hdHRyKCdpZCcsIHNlY3Rpb25fbmFtZSApLmFwcGVuZFRvKHBhcmVudF9jb250YWluZXIpO1xuICAgICAgICAgICAgLy9zZWxlY3Rpb25fY29udGFpbmVyLmdldCgwKS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheV90eXBlO1xuICAgICAgICAgICAgdmFyIHN5c3RlbV9kaXYgPSAkKCc8ZGl2PicpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpdGxlX2xpbmUnKVxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhzZWxlY3Rpb25fY29udGFpbmVyKVxuICAgICAgICAgICAgICAgIC8qIGpzaGludCAtVzA4MyAqL1xuICAgICAgICAgICAgICAgIC5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlVG9nZ2xlKCdmYXN0Jyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgc3lzdGVtX3RpdGxlID0gJCgnPGE+JylcbiAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAndGl0bGVfbGluZV90ZXh0JylcbiAgICAgICAgICAgICAgICAuYXR0cignaHJlZicsICcjJylcbiAgICAgICAgICAgICAgICAudGV4dChmLnByZXR0eV9uYW1lKHNlY3Rpb25fbmFtZSkpXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKHN5c3RlbV9kaXYpO1xuICAgICAgICAgICAgJCh0aGlzKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgdmFyIGRyYXdlciA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAnJykuYXBwZW5kVG8oc2VsZWN0aW9uX2NvbnRhaW5lcik7XG4gICAgICAgICAgICB2YXIgZHJhd2VyX2NvbnRlbnQgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3BhcmFtX3NlY3Rpb25fY29udGVudCcpLmFwcGVuZFRvKGRyYXdlcik7XG4gICAgICAgICAgICBmb3IoIHZhciBpbnB1dF9uYW1lIGluIHNldHRpbmdzLnN5c3RlbVtzZWN0aW9uX25hbWVdICl7XG4gICAgICAgICAgICAgICAgJCgnPHNwYW4+JykuaHRtbChmLnByZXR0eV9uYW1lKGlucHV0X25hbWUpICsgJzogJykuYXBwZW5kVG8oZHJhd2VyX2NvbnRlbnQpO1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gayQoJ3ZhbHVlJylcbiAgICAgICAgICAgICAgICAgICAgLy8uc2V0T3B0aW9uc1JlZiggJ2lucHV0cy4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSApXG4gICAgICAgICAgICAgICAgICAgIC5zZXRSZWYoICdzeXN0ZW0uJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUgKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oZHJhd2VyX2NvbnRlbnQpO1xuICAgICAgICAgICAgICAgIGYua2VsZW1fc2V0dXAoc2VsZWN0b3IsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAvLyovXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlX2tvbnRhaW5lciA9IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKVxuICAgICAgICAgICAgICAgICAgICAub2JqKHNldHRpbmdzKVxuICAgICAgICAgICAgICAgICAgICAucmVmKCdzeXN0ZW0uJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUpO1xuICAgICAgICAgICAgICAgIHZhciAkZWxlbSA9ICQoJzxzcGFuPicpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICcnKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oZHJhd2VyX2NvbnRlbnQpXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0KHZhbHVlX2tvbnRhaW5lci5nZXQoKSk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0ge1xuICAgICAgICAgICAgICAgICAgICBlbGVtOiAkZWxlbS5nZXQoKVswXSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVfcmVmOiB2YWx1ZV9rb250YWluZXJcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHNldHRpbmdzLnZhbHVlX3JlZ2lzdHJ5LnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgICQoJzwvYnI+JykuYXBwZW5kVG8oZHJhd2VyX2NvbnRlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuZi51cGRhdGVfdmFsdWVzID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIHNldHRpbmdzLnZhbHVlX3JlZ2lzdHJ5LmZvckVhY2goZnVuY3Rpb24odmFsdWVfaXRlbSl7XG4gICAgICAgIC8vY29uc29sZS5sb2coIHZhbHVlX2l0ZW0gKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggdmFsdWVfaXRlbS5lbGVtLm9wdGlvbnMgKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggdmFsdWVfaXRlbS5lbGVtLnNlbGVjdGVkSW5kZXggKTtcbiAgICAgICAgaWYodmFsdWVfaXRlbS5lbGVtLnNlbGVjdGVkSW5kZXgpe1xuICAgICAgICAgICAgdmFsdWVfaXRlbS52YWx1ZSA9IHZhbHVlX2l0ZW0uZWxlbS5vcHRpb25zW3ZhbHVlX2l0ZW0uZWxlbS5zZWxlY3RlZEluZGV4XS52YWx1ZTtcbiAgICAgICAgICAgIHZhbHVlX2l0ZW0ua29udGFpbmVyLnNldCh2YWx1ZV9pdGVtLnZhbHVlKTtcblxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG4vL2Yuc2hvd19oaWRlX3BhcmFtcyA9IGZ1bmN0aW9uKHBhZ2Vfc2VjdGlvbnMsIHNldHRpbmdzKXtcbi8vICAgIGZvciggdmFyIGxpc3RfbmFtZSBpbiBwYWdlX3NlY3Rpb25zICl7XG4vLyAgICAgICAgdmFyIGlkID0gJyMnK2xpc3RfbmFtZTtcbi8vICAgICAgICB2YXIgc2VjdGlvbl9uYW1lID0gbGlzdF9uYW1lLnNwbGl0KCdfJylbMF07XG4vLyAgICAgICAgdmFyIHNlY3Rpb24gPSBrJChpZCk7XG4vLyAgICAgICAgaWYoIHNldHRpbmdzLnN0YXR1cy5zZWN0aW9uc1tzZWN0aW9uX25hbWVdLnNldCApIHNlY3Rpb24uc2hvdygpO1xuLy8gICAgICAgIGVsc2Ugc2VjdGlvbi5oaWRlKCk7XG4vLyAgICB9XG4vL307XG5cbi8vZi5zaG93X2hpZGVfc2VsZWN0aW9ucyA9IGZ1bmN0aW9uKHNldHRpbmdzLCBhY3RpdmVfc2VjdGlvbl9uYW1lKXtcbi8vICAgICQoJyNzZWN0aW9uU2VsZWN0b3InKS52YWwoYWN0aXZlX3NlY3Rpb25fbmFtZSk7XG4vLyAgICBmb3IoIHZhciBsaXN0X25hbWUgaW4gc2V0dGluZ3MuaW5wdXQgKXtcbi8vICAgICAgICB2YXIgaWQgPSAnIycrbGlzdF9uYW1lO1xuLy8gICAgICAgIHZhciBzZWN0aW9uX25hbWUgPSBsaXN0X25hbWUuc3BsaXQoJ18nKVswXTtcbi8vICAgICAgICB2YXIgc2VjdGlvbiA9IGskKGlkKTtcbi8vICAgICAgICBpZiggc2VjdGlvbl9uYW1lID09PSBhY3RpdmVfc2VjdGlvbl9uYW1lICkgc2VjdGlvbi5zaG93KCk7XG4vLyAgICAgICAgZWxzZSBzZWN0aW9uLmhpZGUoKTtcbi8vICAgIH1cbi8vfTtcblxuLy9mLnNldERvd25sb2FkTGluayhzZXR0aW5ncyl7XG4vL1xuLy8gICAgaWYoIHNldHRpbmdzLlBERiAmJiBzZXR0aW5ncy5QREYudXJsICl7XG4vLyAgICAgICAgdmFyIGxpbmsgPSAkKCdhJykuYXR0cignaHJlZicsIHNldHRpbmdzLlBERi51cmwgKS5hdHRyKCdkb3dubG9hZCcsICdQVl9kcmF3aW5nLnBkZicpLmh0bWwoJ0Rvd25sb2FkIERyYXdpbmcnKTtcbi8vICAgICAgICAkKCcjZG93bmxvYWQnKS5odG1sKCcnKS5hcHBlbmQobGluayk7XG4vLyAgICB9XG4vL31cblxuLy9mLmxvYWRUYWJsZXMgPSBmdW5jdGlvbihzdHJpbmcpe1xuLy8gICAgdmFyIHRhYmxlcyA9IHt9O1xuLy8gICAgdmFyIGwgPSBzdHJpbmcuc3BsaXQoJ1xcbicpO1xuLy8gICAgdmFyIHRpdGxlO1xuLy8gICAgdmFyIGZpZWxkcztcbi8vICAgIHZhciBuZWVkX3RpdGxlID0gdHJ1ZTtcbi8vICAgIHZhciBuZWVkX2ZpZWxkcyA9IHRydWU7XG4vLyAgICBsLmZvckVhY2goIGZ1bmN0aW9uKHN0cmluZywgaSl7XG4vLyAgICAgICAgdmFyIGxpbmUgPSBzdHJpbmcudHJpbSgpO1xuLy8gICAgICAgIGlmKCBsaW5lLmxlbmd0aCA9PT0gMCApe1xuLy8gICAgICAgICAgICBuZWVkX3RpdGxlID0gdHJ1ZTtcbi8vICAgICAgICAgICAgbmVlZF9maWVsZHMgPSB0cnVlO1xuLy8gICAgICAgIH0gZWxzZSBpZiggbmVlZF90aXRsZSApIHtcbi8vICAgICAgICAgICAgdGl0bGUgPSBsaW5lO1xuLy8gICAgICAgICAgICB0YWJsZXNbdGl0bGVdID0gW107XG4vLyAgICAgICAgICAgIG5lZWRfdGl0bGUgPSBmYWxzZTtcbi8vICAgICAgICB9IGVsc2UgaWYoIG5lZWRfZmllbGRzICkge1xuLy8gICAgICAgICAgICBmaWVsZHMgPSBsaW5lLnNwbGl0KCcsJyk7XG4vLyAgICAgICAgICAgIHRhYmxlc1t0aXRsZStcIl9maWVsZHNcIl0gPSBmaWVsZHM7XG4vLyAgICAgICAgICAgIG5lZWRfZmllbGRzID0gZmFsc2U7XG4vLyAgICAgICAgLy99IGVsc2Uge1xuLy8gICAgICAgIC8vICAgIHZhciBlbnRyeSA9IHt9O1xuLy8gICAgICAgIC8vICAgIHZhciBsaW5lX2FycmF5ID0gbGluZS5zcGxpdCgnLCcpO1xuLy8gICAgICAgIC8vICAgIGZpZWxkcy5mb3JFYWNoKCBmdW5jdGlvbihmaWVsZCwgaWQpe1xuLy8gICAgICAgIC8vICAgICAgICBlbnRyeVtmaWVsZC50cmltKCldID0gbGluZV9hcnJheVtpZF0udHJpbSgpO1xuLy8gICAgICAgIC8vICAgIH0pO1xuLy8gICAgICAgIC8vICAgIHRhYmxlc1t0aXRsZV0ucHVzaCggZW50cnkgKTtcbi8vICAgICAgICAvL31cbi8vICAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgICB2YXIgbGluZV9hcnJheSA9IGxpbmUuc3BsaXQoJywnKTtcbi8vICAgICAgICAgICAgdGFibGVzW3RpdGxlXVtsaW5lX2FycmF5WzBdLnRyaW0oKV0gPSBsaW5lX2FycmF5WzFdLnRyaW0oKTtcbi8vICAgICAgICB9XG4vLyAgICB9KTtcbi8vXG4vLyAgICByZXR1cm4gdGFibGVzO1xuLy99O1xuLy9cbi8vZi5sb2FkQ29tcG9uZW50cyA9IGZ1bmN0aW9uKHN0cmluZyl7XG4vLyAgICB2YXIgZGIgPSBrLnBhcnNlQ1NWKHN0cmluZyk7XG4vLyAgICB2YXIgb2JqZWN0ID0ge307XG4vLyAgICBmb3IoIHZhciBpIGluIGRiICl7XG4vLyAgICAgICAgdmFyIGNvbXBvbmVudCA9IGRiW2ldO1xuLy8gICAgICAgIGlmKCBvYmplY3RbY29tcG9uZW50Lk1ha2VdID09PSB1bmRlZmluZWQgKXtcbi8vICAgICAgICAgICAgb2JqZWN0W2NvbXBvbmVudC5NYWtlXSA9IHt9O1xuLy8gICAgICAgIH1cbi8vICAgICAgICBpZiggb2JqZWN0W2NvbXBvbmVudC5NYWtlXVtjb21wb25lbnQuTW9kZWxdID09PSB1bmRlZmluZWQgKXtcbi8vICAgICAgICAgICAgb2JqZWN0W2NvbXBvbmVudC5NYWtlXVtjb21wb25lbnQuTW9kZWxdID0ge307XG4vLyAgICAgICAgfVxuLy9cbi8vICAgICAgICB2YXIgZmllbGRzID0gay5vYmpJZEFycmF5KGNvbXBvbmVudCk7XG4vLyAgICAgICAgZmllbGRzLmZvckVhY2goIGZ1bmN0aW9uKCBmaWVsZCApe1xuLy8gICAgICAgICAgICB2YXIgcGFyYW0gPSBjb21wb25lbnRbZmllbGRdO1xuLy8gICAgICAgICAgICBpZiggISggZmllbGQgaW4gWydNYWtlJywgJ01vZGVsJ10gKSAmJiAhKCBpc05hTihwYXJzZUZsb2F0KHBhcmFtKSkgKSApe1xuLy8gICAgICAgICAgICAgICAgY29tcG9uZW50W2ZpZWxkXSA9IHBhcnNlRmxvYXQocGFyYW0pO1xuLy8gICAgICAgICAgICB9XG4vLyAgICAgICAgfSlcbi8vICAgICAgICBvYmplY3RbY29tcG9uZW50Lk1ha2VdW2NvbXBvbmVudC5Nb2RlbF0gPSBjb21wb25lbnQ7XG4vLyAgICB9XG4vLyAgICByZXR1cm4gb2JqZWN0O1xuLy99O1xuXG5cblxuXG5mLmxvYWRfZGF0YWJhc2UgPSBmdW5jdGlvbihGU0VDX2RhdGFiYXNlX0pTT04pe1xuICAgIEZTRUNfZGF0YWJhc2VfSlNPTiA9IGYubG93ZXJjYXNlX3Byb3BlcnRpZXMoRlNFQ19kYXRhYmFzZV9KU09OKTtcbiAgICBnLmNvbXBvbmVudHMuaW52ZXJ0ZXJzID0ge307XG4gICAgRlNFQ19kYXRhYmFzZV9KU09OLmludmVydGVycy5mb3JFYWNoKGZ1bmN0aW9uKGNvbXBvbmVudCl7XG4gICAgICAgIGlmKCBnLmNvbXBvbmVudHMuaW52ZXJ0ZXJzW2NvbXBvbmVudC5tYWtlXSA9PT0gdW5kZWZpbmVkICkgZy5jb21wb25lbnRzLmludmVydGVyc1tjb21wb25lbnQubWFrZV0gPSB7fTtcbiAgICAgICAgLy9nLmNvbXBvbmVudHMuaW52ZXJ0ZXJzW2NvbXBvbmVudC5tYWtlXVtjb21wb25lbnQubWFrZV0gPSBmLnByZXR0eV9uYW1lcyhjb21wb25lbnQpO1xuICAgICAgICBnLmNvbXBvbmVudHMuaW52ZXJ0ZXJzW2NvbXBvbmVudC5tYWtlXVtjb21wb25lbnQubW9kZWxdID0gY29tcG9uZW50O1xuICAgIH0pO1xuICAgIGcuY29tcG9uZW50cy5tb2R1bGVzID0ge307XG4gICAgRlNFQ19kYXRhYmFzZV9KU09OLm1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihjb21wb25lbnQpe1xuICAgICAgICBpZiggZy5jb21wb25lbnRzLm1vZHVsZXNbY29tcG9uZW50Lm1ha2VdID09PSB1bmRlZmluZWQgKSBnLmNvbXBvbmVudHMubW9kdWxlc1tjb21wb25lbnQubWFrZV0gPSB7fTtcbiAgICAgICAgLy9nLmNvbXBvbmVudHMubW9kdWxlc1tjb21wb25lbnQubWFrZV1bY29tcG9uZW50Lm1ha2VdID0gZi5wcmV0dHlfbmFtZXMoY29tcG9uZW50KTtcbiAgICAgICAgZy5jb21wb25lbnRzLm1vZHVsZXNbY29tcG9uZW50Lm1ha2VdW2NvbXBvbmVudC5tb2RlbF0gPSBjb21wb25lbnQ7XG4gICAgfSk7XG5cbiAgICBmLnVwZGF0ZSgpO1xufTtcblxuXG5mLmdldF9yZWYgPSBmdW5jdGlvbihzdHJpbmcsIG9iamVjdCl7XG4gICAgdmFyIHJlZl9hcnJheSA9IHN0cmluZy5zcGxpdCgnLicpO1xuICAgIHZhciBsZXZlbCA9IG9iamVjdDtcbiAgICByZWZfYXJyYXkuZm9yRWFjaChmdW5jdGlvbihsZXZlbF9uYW1lLGkpe1xuICAgICAgICBpZiggdHlwZW9mIGxldmVsW2xldmVsX25hbWVdID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXZlbCA9IGxldmVsW2xldmVsX25hbWVdO1xuICAgIH0pO1xuICAgIHJldHVybiBsZXZlbDtcbn07XG5mLnNldF9yZWYgPSBmdW5jdGlvbiggb2JqZWN0LCByZWZfc3RyaW5nLCB2YWx1ZSApe1xuICAgIHZhciByZWZfYXJyYXkgPSByZWZfc3RyaW5nLnNwbGl0KCcuJyk7XG4gICAgdmFyIGxldmVsID0gb2JqZWN0O1xuICAgIHJlZl9hcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldmVsX25hbWUsaSl7XG4gICAgICAgIGlmKCB0eXBlb2YgbGV2ZWxbbGV2ZWxfbmFtZV0gPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldmVsID0gbGV2ZWxbbGV2ZWxfbmFtZV07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbGV2ZWw7XG59O1xuXG5cblxuXG5mLmxvZ19pZl9kYXRhYmFzZV9sb2FkZWQgPSBmdW5jdGlvbihlKXtcbiAgICBpZihmLmcuc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIH1cbn07XG5cblxuXG5mLmxvd2VyY2FzZV9wcm9wZXJ0aWVzID0gZnVuY3Rpb24gbG93ZXJjYXNlX3Byb3BlcnRpZXMob2JqKSB7XG4gICAgdmFyIG5ld19vYmplY3QgPSBuZXcgb2JqLmNvbnN0cnVjdG9yKCk7XG4gICAgZm9yKCB2YXIgb2xkX25hbWUgaW4gb2JqICl7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkob2xkX25hbWUpKSB7XG4gICAgICAgICAgICB2YXIgbmV3X25hbWUgPSBvbGRfbmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYoIG9ialtvbGRfbmFtZV0uY29uc3RydWN0b3IgPT09IE9iamVjdCB8fCBvYmpbb2xkX25hbWVdLmNvbnN0cnVjdG9yID09PSBBcnJheSApe1xuICAgICAgICAgICAgICAgIG5ld19vYmplY3RbbmV3X25hbWVdID0gbG93ZXJjYXNlX3Byb3BlcnRpZXMob2JqW29sZF9uYW1lXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld19vYmplY3RbbmV3X25hbWVdID0gb2JqW29sZF9uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuICAgIHJldHVybiBuZXdfb2JqZWN0O1xufTtcblxuXG5mLnRvZ2dsZV9tb2R1bGUgPSBmdW5jdGlvbihlbGVtZW50KXtcbiAgICAvL2NvbnNvbGUubG9nKCdzd2l0Y2gnLCBlbGVtZW50LCBlbGVtZW50LmNsYXNzTGlzICk7XG5cbiAgICAvL2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBudWxsKTtcblxuICAgIHZhciBlbGVtID0gJChlbGVtZW50KTtcbiAgICAvL2NvbnNvbGUubG9nKCdzd2l0Y2gnLCBlbGVtWzBdLmNsYXNzTGlzdC5jb250YWlucygncHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZScpICk7XG5cbiAgICB2YXIgciA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdtb2R1bGVfSUQnKS5zcGxpdCgnLCcpWzBdO1xuICAgIHZhciBjID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ21vZHVsZV9JRCcpLnNwbGl0KCcsJylbMV07XG5cbiAgICBpZiggZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl1bY10gKXtcbiAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl1bY10gPSBmYWxzZTtcbiAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNfdG90YWwtLTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSA9IHRydWU7XG4gICAgICAgIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzX3RvdGFsKys7XG4gICAgfVxuXG4gICAgLypcbiAgICB2YXIgbGF5ZXI7XG4gICAgaWYoIGVsZW1bMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZCcpICl7XG4gICAgICAgIC8vZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl1bY10gPSB0cnVlO1xuICAgICAgICAvL2xheWVyID0gZy5kcmF3aW5nX3NldHRpbmdzLmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZTtcbiAgICAgICAgLy9lbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXMgPSBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlcyArMSB8fCAxO1xuICAgICAgICAvL2xheWVyID0gZy5kcmF3aW5nX3NldHRpbmdzLmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZDtcbiAgICAgICAgLy9lbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWRcIik7XG4gICAgfVxuICAgIC8vKi9cbiAgICAvL2NvbnNvbGUubG9nKCBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlcyk7XG4gICAgLy9mb3IoIHZhciBhdHRyX25hbWUgaW4gbGF5ZXIgKXtcbiAgICAvLyAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyX25hbWUsIGxheWVyW2F0dHJfbmFtZV0pO1xuXG4gICAgLy99XG5cbiAgICBnLmYudXBkYXRlKCk7XG5cbiAgICAvKlxuICAgIGlmKCBlbGVtLmhhc0NsYXNzKFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVcIikgKXtcbiAgICAgICAgZWxlbS5yZW1vdmVDbGFzcyhcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlXCIpO1xuICAgICAgICBlbGVtLmFkZENsYXNzKFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWRcIik7XG4gICAgfSBlbHNlIGlmKCBlbGVtLmhhc0NsYXNzKFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWRcIikgKXtcbiAgICAgICAgZWxlbS5yZW1vdmVDbGFzcyhcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkXCIpO1xuICAgICAgICBlbGVtLmFkZENsYXNzKFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbS5hZGRDbGFzcyhcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlXCIpO1xuICAgIH1cbiAgICAqL1xufTtcblxuXG5mLmNsZWFyX29iamVjdCA9IGZ1bmN0aW9uKG9iail7XG4gICAgZm9yKCB2YXIgaWQgaW4gb2JqICl7XG4gICAgICAgIGlmKCBvYmouaGFzT3duUHJvcGVydHkoaWQpKXtcbiAgICAgICAgICAgIGRlbGV0ZSBvYmpbaWRdO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLy8gY2xlYXIgZHJhd2luZ1xuZi5jbGVhcl9kcmF3aW5nID0gZnVuY3Rpb24oKSB7XG4gICAgZm9yKCB2YXIgaWQgaW4gZy5kcmF3aW5nICl7XG4gICAgICAgIGlmKCBnLmRyYXdpbmcuaGFzT3duUHJvcGVydHkoaWQpKXtcbiAgICAgICAgICAgIGYuY2xlYXJfb2JqZWN0KGcuZHJhd2luZ1tpZF0pO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuXG5cbmYucXVlcnlfc3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAvLyBCYXNlZCBvblxuICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS85Nzk5OTVcbiAgdmFyIHF1ZXJ5X3N0cmluZyA9IHt9O1xuICB2YXIgcXVlcnkgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKTtcbiAgdmFyIHZhcnMgPSBxdWVyeS5zcGxpdChcIiZcIik7XG4gIHZhciBpO1xuICBmb3IgKCBpPTA7IGk8dmFycy5sZW5ndGg7IGkrKyApIHtcbiAgICB2YXIgcGFpciA9IHZhcnNbaV0uc3BsaXQoXCI9XCIpO1xuICAgICAgICAvLyBJZiBmaXJzdCBlbnRyeSB3aXRoIHRoaXMgbmFtZVxuICAgIGlmICh0eXBlb2YgcXVlcnlfc3RyaW5nW3BhaXJbMF1dID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHF1ZXJ5X3N0cmluZ1twYWlyWzBdXSA9IHBhaXJbMV07XG4gICAgICAgIC8vIElmIHNlY29uZCBlbnRyeSB3aXRoIHRoaXMgbmFtZVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHF1ZXJ5X3N0cmluZ1twYWlyWzBdXSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB2YXIgYXJyID0gWyBxdWVyeV9zdHJpbmdbcGFpclswXV0sIHBhaXJbMV0gXTtcbiAgICAgICAgcXVlcnlfc3RyaW5nW3BhaXJbMF1dID0gYXJyO1xuICAgICAgICAvLyBJZiB0aGlyZCBvciBsYXRlciBlbnRyeSB3aXRoIHRoaXMgbmFtZVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXJ5X3N0cmluZ1twYWlyWzBdXS5wdXNoKHBhaXJbMV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcXVlcnlfc3RyaW5nO1xufTtcblxuZi5yZXF1ZXN0X2dlb2NvZGUgPSBmdW5jdGlvbigpe1xuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnbG9jYXRpb24nKSApe1xuICAgICAgICB2YXIgYWRkcmVzc19uZXcgPSBnLnBlcm0ubG9jYXRpb24ubmV3X2FkZHJlc3M7XG5cbiAgICAgICAgaWYoIGFkZHJlc3NfbmV3IHx8IGcucGVybS5sb2NhdGlvbi5sYXQgPT09IHVuZGVmaW5lZCB8fCBnLnBlcm0ubG9jYXRpb24ubGF0ID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbmV3IGFkZHJlc3MnKTtcbiAgICAgICAgICAgIHZhciBhZGRyZXNzID0gZW5jb2RlVVJJQ29tcG9uZW50KFtcbiAgICAgICAgICAgICAgICAgICAgZy5wZXJtLmxvY2F0aW9uLmFkZHJlc3MsXG4gICAgICAgICAgICAgICAgICAgIGcucGVybS5sb2NhdGlvbi5jaXR5LFxuICAgICAgICAgICAgICAgICAgICAnRkwnLFxuICAgICAgICAgICAgICAgICAgICBnLnBlcm0ubG9jYXRpb24uemlwXG4gICAgICAgICAgICAgICAgXS5qb2luKCcsICcpICk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGFkZHJlc3MpO1xuICAgICAgICAgICAgJCgnI2dlb2NvZGVfZGlzcGxheScpLnRleHQoJ1JlcXVlc3RpbmcgY29vcmRpbmF0ZXMuLi4nKTtcbiAgICAgICAgICAgICQuZ2V0SlNPTignaHR0cDovL25vbWluYXRpbS5vcGVuc3RyZWV0bWFwLm9yZy9zZWFyY2g/Zm9ybWF0PWpzb24mbGltaXQ9NSZxPScgKyBhZGRyZXNzLCBmLnNldF9jb29yZGluYXRlc19mcm9tX2dlb2NvZGUgKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCgnI2dlb2NvZGVfZGlzcGxheScpLnRleHQoJ0FkZHJlc3MgdW5jaGFuZ2VkJyk7XG4gICAgICAgICAgICBmLnNldF9jb29yZGluYXRlc19mcm9tX2dlb2NvZGUoKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgICQoJyNnZW9jb2RlX2Rpc3BsYXknKS50ZXh0KCdQbGVhc2UgZW50ZXIgYWRkcmVzcycpO1xuICAgIH1cbn07XG5cblxuZi5zZXRfc2F0X21hcF9tYXJrZXIgPSBmdW5jdGlvbigpe1xuICAgIHZhciBsYXRsbmcgPSBMLmxhdExuZyggZy5wZXJtLmxvY2F0aW9uLmxhdCwgZy5wZXJtLmxvY2F0aW9uLmxvbiApO1xuICAgIGcucGVybS5tYXBzLm1hcmtlcl9zYXQuc2V0TGF0TG5nKCBsYXRsbmcgKTtcbiAgICBnLnBlcm0ubWFwcy5tYXJrZXJfcm9hZC5zZXRMYXRMbmcoIGxhdGxuZyApO1xuICAgIGcucGVybS5tYXBzLm1hcF9zYXQuc2V0VmlldyggbGF0bG5nICk7XG59O1xuXG5mLnNldF9jb29yZGluYXRlc19mcm9tX21hcCA9IGZ1bmN0aW9uKGUpe1xuICAgIGcucGVybS5sb2NhdGlvbi5sYXQgPSBlLmxhdGxuZy5sYXQ7XG4gICAgZy5wZXJtLmxvY2F0aW9uLmxvbiA9IGUubGF0bG5nLmxuZztcbiAgICBmLnVwZGF0ZSgpO1xufTtcblxuZi5zZXRfY29vcmRpbmF0ZXNfZnJvbV9nZW9jb2RlID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgaWYoIGRhdGEgPT09IHVuZGVmaW5lZCAmJiBnLnBlcm0ubG9jYXRpb24ubGF0ICE9PSB1bmRlZmluZWQgKXsgLy8gbG9hZGluZyBsYXN0IGxvY2F0aW9uc1xuICAgICAgICBnLnBlcm0ubG9jYXRpb24ubGF0ID0gZy5wZXJtLmdlb2NvZGUubGF0O1xuICAgICAgICBnLnBlcm0ubG9jYXRpb24ubG9uID0gZy5wZXJtLmdlb2NvZGUubG9uO1xuICAgICAgICBmLnVwZGF0ZSgpO1xuICAgIH0gZWxzZSBpZiggZGF0YVswXSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICQoJyNnZW9jb2RlX2Rpc3BsYXknKS50ZXh0KCdBZGRyZXNzIGxvYWRlZCcpO1xuICAgICAgICBjb25zb2xlLmxvZygnTmV3IGxvY2F0aW9uIGZyb20gYWRkcmVzcycsIGRhdGEpO1xuICAgICAgICBnLnBlcm0uZ2VvY29kZS5kYXRhID0gZGF0YTtcbiAgICAgICAgZy5wZXJtLmdlb2NvZGUubGF0ID0gZGF0YVswXS5sYXQ7XG4gICAgICAgIGcucGVybS5nZW9jb2RlLmxvbiA9IGRhdGFbMF0ubG9uO1xuICAgICAgICBnLnBlcm0ubG9jYXRpb24ubGF0ID0gZy5wZXJtLmdlb2NvZGUubGF0O1xuICAgICAgICBnLnBlcm0ubG9jYXRpb24ubG9uID0gZy5wZXJtLmdlb2NvZGUubG9uO1xuICAgICAgICBmLnVwZGF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICQoJyNnZW9jb2RlX2Rpc3BsYXknKS50ZXh0KCdBZGRyZXNzIG5vdCBmb3VuZCcpO1xuICAgIH1cbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGY7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xuXG4vL3ZhciBkcmF3aW5nX3BhcnRzID0gW107XG4vL2QubGlua19kcmF3aW5nX3BhcnRzKGRyYXdpbmdfcGFydHMpO1xuXG52YXIgcGFnZSA9IGZ1bmN0aW9uKCl7XG4gICAgY29uc29sZS5sb2coXCIqKiBNYWtpbmcgcGFnZSAyXCIpO1xuICAgIGQgPSBta19kcmF3aW5nKCk7XG5cbiAgICB2YXIgZiA9IGcuZjtcblxuICAgIC8vdmFyIGNvbXBvbmVudHMgPSBnLmNvbXBvbmVudHM7XG4gICAgLy92YXIgc3lzdGVtID0gZy5zeXN0ZW07XG4gICAgdmFyIHN5c3RlbSA9IGcuc3lzdGVtO1xuXG4gICAgdmFyIHNpemUgPSBnLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgbG9jID0gZy5kcmF3aW5nX3NldHRpbmdzLmxvYztcblxuXG5cblxuICAgIHZhciB4LCB5LCBoLCB3O1xuICAgIHZhciBvZmZzZXQ7XG5cbi8vIERlZmluZSBkLmJsb2Nrc1xuXG4vLyBtb2R1bGUgZC5ibG9ja1xuICAgIHcgPSBzaXplLm1vZHVsZS5mcmFtZS53O1xuICAgIGggPSBzaXplLm1vZHVsZS5mcmFtZS5oO1xuXG4gICAgZC5ibG9ja19zdGFydCgnbW9kdWxlJyk7XG5cbiAgICAvLyBmcmFtZVxuICAgIGQubGF5ZXIoJ21vZHVsZScpO1xuICAgIHggPSAwO1xuICAgIHkgPSAwK3NpemUubW9kdWxlLmxlYWQ7XG4gICAgZC5yZWN0KCBbeCx5K2gvMl0sIFt3LGhdICk7XG4gICAgLy8gZnJhbWUgdHJpYW5nbGU/XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gtdy8yLHldLFxuICAgICAgICBbeCx5K3cvMl0sXG4gICAgXSk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gseSt3LzJdLFxuICAgICAgICBbeCt3LzIseV0sXG4gICAgXSk7XG4gICAgLy8gbGVhZHNcbiAgICBkLmxheWVyKCdEQ19wb3MnKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCwgeV0sXG4gICAgICAgIFt4LCB5LXNpemUubW9kdWxlLmxlYWRdXG4gICAgXSk7XG4gICAgZC5sYXllcignRENfbmVnJyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gsIHkraF0sXG4gICAgICAgIFt4LCB5K2grKHNpemUubW9kdWxlLmxlYWQpXVxuICAgIF0pO1xuICAgIC8vIHBvcyBzaWduXG4gICAgZC5sYXllcigndGV4dCcpO1xuICAgIGQudGV4dChcbiAgICAgICAgW3grc2l6ZS5tb2R1bGUubGVhZC8yLCB5LXNpemUubW9kdWxlLmxlYWQvMl0sXG4gICAgICAgICcrJyxcbiAgICAgICAgJ3NpZ25zJ1xuICAgICk7XG4gICAgLy8gbmVnIHNpZ25cbiAgICBkLnRleHQoXG4gICAgICAgIFt4K3NpemUubW9kdWxlLmxlYWQvMiwgeStoK3NpemUubW9kdWxlLmxlYWQvMl0sXG4gICAgICAgICctJyxcbiAgICAgICAgJ3NpZ25zJ1xuICAgICk7XG4gICAgLy8gZ3JvdW5kXG4gICAgZC5sYXllcignRENfZ3JvdW5kJyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gtdy8yLCB5K2gvMl0sXG4gICAgICAgIFt4LXcvMi13LzQsIHkraC8yXSxcbiAgICBdKTtcblxuICAgIGQubGF5ZXIoKTtcbiAgICBkLmJsb2NrX2VuZCgpO1xuXG4vLyNzdHJpbmdcbiAgICBkLmJsb2NrX3N0YXJ0KCdzdHJpbmcnKTtcblxuICAgIHggPSAwO1xuICAgIHkgPSAwO1xuXG5cblxuXG5cbiAgICB2YXIgbWF4X2Rpc3BsYXllZF9tb2R1bGVzID0gOTtcbiAgICB2YXIgYnJlYWtfc3RyaW5nID0gZmFsc2U7XG5cbiAgICBpZiggc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZyA+IG1heF9kaXNwbGF5ZWRfbW9kdWxlcyApe1xuICAgICAgICBkaXNwbGF5ZWRfbW9kdWxlcyA9IG1heF9kaXNwbGF5ZWRfbW9kdWxlcyAtIDE7XG4gICAgICAgIGJyZWFrX3N0cmluZyA9IHRydWU7XG4gICAgICAgIHNpemUuc3RyaW5nLmggPSAoc2l6ZS5tb2R1bGUuaCAqIChkaXNwbGF5ZWRfbW9kdWxlcysxKSApICsgc2l6ZS5zdHJpbmcuZ2FwX21pc3Npbmc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZGlzcGxheWVkX21vZHVsZXMgPSBzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nO1xuICAgICAgICBzaXplLnN0cmluZy5oID0gKHNpemUubW9kdWxlLmggKiBkaXNwbGF5ZWRfbW9kdWxlcyk7XG4gICAgfVxuICAgIGxvYy5hcnJheS5sb3dlciA9IGxvYy5hcnJheS51cHBlciArIHNpemUuc3RyaW5nLmg7XG5cbiAgICBzaXplLnN0cmluZy5oX21heCA9IChzaXplLm1vZHVsZS5oICogbWF4X2Rpc3BsYXllZF9tb2R1bGVzKSArIHNpemUuc3RyaW5nLmdhcF9taXNzaW5nO1xuICAgIGxvYy5hcnJheS5sb3dlcl9saW1pdCA9IGxvYy5hcnJheS51cHBlciArIHNpemUuc3RyaW5nLmhfbWF4O1xuXG5cblxuICAgIGZvciggdmFyIHI9MDsgcjxkaXNwbGF5ZWRfbW9kdWxlczsgcisrKXtcbiAgICAgICAgZC5ibG9jaygnbW9kdWxlJywgW3gseV0pO1xuICAgICAgICB5ICs9IHNpemUubW9kdWxlLmg7XG5cbiAgICB9XG4gICAgaWYoIGJyZWFrX3N0cmluZyApIHtcbiAgICAgICAgZC5saW5lKFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIFt4LHldLFxuICAgICAgICAgICAgICAgIFt4LHkrc2l6ZS5zdHJpbmcuZ2FwX21pc3NpbmddLFxuICAgICAgICAgICAgLy9beC1zaXplLm1vZHVsZS5mcmFtZS53KjMvNCwgeStzaXplLnN0cmluZy5oICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAnRENfaW50ZXJtb2R1bGUnXG4gICAgICAgICk7XG5cbiAgICAgICAgeSArPSBzaXplLnN0cmluZy5nYXBfbWlzc2luZztcbiAgICAgICAgZC5ibG9jaygnbW9kdWxlJywgW3gseV0pO1xuICAgIH1cblxuICAgIHggPSAwO1xuICAgIHkgPSAwO1xuXG4gICAgLy9UT0RPOiBhZGQgbG9vcCB0byBqdW1wIG92ZXIgbmVnYXRpdmUgcmV0dXJuIHdpcmVzXG4gICAgZC5sYXllcignRENfZ3JvdW5kJyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gtc2l6ZS5tb2R1bGUuZnJhbWUudyozLzQsIHkrc2l6ZS5tb2R1bGUuaC8yXSxcbiAgICAgICAgW3gtc2l6ZS5tb2R1bGUuZnJhbWUudyozLzQsIHkrc2l6ZS5zdHJpbmcuaF9tYXggKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZF0sXG4gICAgICAgIC8vW3gtc2l6ZS5tb2R1bGUuZnJhbWUudyozLzQsIHkrc2l6ZS5zdHJpbmcuaCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgXSk7XG4gICAgZC5sYXllcigpO1xuXG5cbiAgICBkLmJsb2NrX2VuZCgpO1xuXG5cbi8vIHRlcm1pbmFsXG4gICAgZC5ibG9ja19zdGFydCgndGVybWluYWwnKTtcbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcblxuICAgIGQubGF5ZXIoJ3Rlcm1pbmFsJyk7XG4gICAgZC5jaXJjKFxuICAgICAgICBbeCx5XSxcbiAgICAgICAgc2l6ZS50ZXJtaW5hbF9kaWFtXG4gICAgKTtcbiAgICBkLmxheWVyKCk7XG4gICAgZC5ibG9ja19lbmQoKTtcblxuLy8gZnVzZVxuXG4gICAgZC5ibG9ja19zdGFydCgnZnVzZScpO1xuICAgIHggPSAwO1xuICAgIHkgPSAwO1xuICAgIHcgPSAxMDtcbiAgICBoID0gNTtcblxuICAgIGQubGF5ZXIoJ3Rlcm1pbmFsJyk7XG4gICAgZC5yZWN0KFxuICAgICAgICBbeCx5XSxcbiAgICAgICAgW3csaF1cbiAgICApO1xuICAgIGQubGluZSggW1xuICAgICAgICBbdy8yLHldLFxuICAgICAgICBbdy8yK3NpemUuZnVzZS53LCB5XVxuICAgIF0pO1xuICAgIGQuYmxvY2soJ3Rlcm1pbmFsJywgW3NpemUuZnVzZS53LCB5XSApO1xuXG4gICAgZC5saW5lKCBbXG4gICAgICAgIFstdy8yLHldLFxuICAgICAgICBbLXcvMi1zaXplLmZ1c2UudywgeV1cbiAgICBdKTtcbiAgICBkLmJsb2NrKCd0ZXJtaW5hbCcsIFstc2l6ZS5mdXNlLncsIHldICk7XG5cbiAgICBkLmxheWVyKCk7XG4gICAgZC5ibG9ja19lbmQoKTtcblxuLy8gZ3JvdW5kIHN5bWJvbFxuICAgIGQuYmxvY2tfc3RhcnQoJ2dyb3VuZCcpO1xuICAgIHggPSAwO1xuICAgIHkgPSAwO1xuXG4gICAgZC5sYXllcignQUNfZ3JvdW5kJyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gseV0sXG4gICAgICAgIFt4LHkrNDBdLFxuICAgIF0pO1xuICAgIHkgKz0gMjU7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gtNy41LHldLFxuICAgICAgICBbeCs3LjUseV0sXG4gICAgXSk7XG4gICAgeSArPSA1O1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LTUseV0sXG4gICAgICAgIFt4KzUseV0sXG4gICAgXSk7XG4gICAgeSArPSA1O1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LTIuNSx5XSxcbiAgICAgICAgW3grMi41LHldLFxuICAgIF0pO1xuICAgIGQubGF5ZXIoKTtcblxuICAgIGQuYmxvY2tfZW5kKCk7XG5cblxuXG4vLyBOb3J0aCBhcnJvd1xuICAgIHggPSAwO1xuICAgIHkgPSAwO1xuXG4gICAgdmFyIGFycm93X3cgPSA3O1xuICAgIHZhciBsZXR0ZXJfaCA9IDE0O1xuICAgIHZhciBhcnJvd19oID0gNTA7XG5cbiAgICBkLmJsb2NrX3N0YXJ0KCdub3J0aCBhcnJvd191cCcpO1xuICAgIGQubGF5ZXIoJ25vcnRoX2xldHRlcicpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LCB5K2xldHRlcl9oXSxcbiAgICAgICAgW3gsIHldLFxuICAgICAgICBbeCthcnJvd193LCB5K2xldHRlcl9oXSxcbiAgICAgICAgW3grYXJyb3dfdywgeV0sXG4gICAgXSk7XG4gICAgZC5sYXllcignbm9ydGhfYXJyb3cnKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCwgeSthcnJvd19oXSxcbiAgICAgICAgW3gsIHldLFxuICAgICAgICBbeCthcnJvd193LzIsIHkrbGV0dGVyX2gvMl0sXG4gICAgXSk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gsIHldLFxuICAgICAgICBbeC1hcnJvd193LzIsIHkrbGV0dGVyX2gvMl0sXG4gICAgXSk7XG4gICAgZC5sYXllcigpO1xuICAgIGQuYmxvY2tfZW5kKCdub3J0aCBhcnJvdycpO1xuXG4gICAgZC5ibG9ja19zdGFydCgnbm9ydGggYXJyb3dfbGVmdCcpO1xuICAgIGQubGF5ZXIoJ25vcnRoX2xldHRlcicpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4K2xldHRlcl9oLCB5XSxcbiAgICAgICAgW3gsIHldLFxuICAgICAgICBbeCtsZXR0ZXJfaCwgeS1hcnJvd193XSxcbiAgICAgICAgW3gsICAgICAgICAgIHktYXJyb3dfd10sXG4gICAgXSk7XG4gICAgZC5sYXllcignbm9ydGhfYXJyb3cnKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCthcnJvd19oLCB5XSxcbiAgICAgICAgW3gsIHldLFxuICAgICAgICBbeCtsZXR0ZXJfaC8yLCB5LWFycm93X3cvMl0sXG4gICAgXSk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gsIHldLFxuICAgICAgICBbeCtsZXR0ZXJfaC8yLCB5K2Fycm93X3cvMl0sXG4gICAgXSk7XG4gICAgZC5sYXllcigpO1xuICAgIGQuYmxvY2tfZW5kKCdub3J0aCBhcnJvdycpO1xuXG4vLyovXG5cbiAgICByZXR1cm4gZC5kcmF3aW5nX3BhcnRzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcGFnZTtcbiIsInZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG5cbi8vdmFyIGRyYXdpbmdfcGFydHMgPSBbXTtcbi8vZC5saW5rX2RyYXdpbmdfcGFydHMoZHJhd2luZ19wYXJ0cyk7XG5cbnZhciBhZGRfYm9yZGVyID0gZnVuY3Rpb24oc2V0dGluZ3MsIHNoZWV0X3NlY3Rpb24sIHNoZWV0X251bSl7XG4gICAgZCA9IG1rX2RyYXdpbmcoKTtcbiAgICB2YXIgZiA9IHNldHRpbmdzLmY7XG5cbiAgICAvL3ZhciBjb21wb25lbnRzID0gc2V0dGluZ3MuY29tcG9uZW50cztcbiAgICAvL3ZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG4gICAgdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcblxuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxvYztcblxuXG5cblxuICAgIHZhciB4LCB5LCBoLCB3O1xuICAgIHZhciBvZmZzZXQ7XG5cbi8vIERlZmluZSBkLmJsb2Nrc1xuLy8gbW9kdWxlIGQuYmxvY2tcbiAgICB3ID0gc2l6ZS5tb2R1bGUuZnJhbWUudztcbiAgICBoID0gc2l6ZS5tb2R1bGUuZnJhbWUuaDtcblxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBGcmFtZVxuICAgIGQuc2VjdGlvbignRnJhbWUnKTtcblxuICAgIHcgPSBzaXplLmRyYXdpbmcudztcbiAgICBoID0gc2l6ZS5kcmF3aW5nLmg7XG4gICAgdmFyIHBhZGRpbmcgPSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZztcblxuICAgIGQubGF5ZXIoJ2ZyYW1lJyk7XG5cbiAgICAvL2JvcmRlclxuICAgIGQucmVjdCggW3cvMiAsIGgvMl0sIFt3IC0gcGFkZGluZyoyLCBoIC0gcGFkZGluZyoyIF0gKTtcblxuICAgIHggPSB3IC0gcGFkZGluZyAqIDM7XG4gICAgeSA9IHBhZGRpbmcgKiAzO1xuXG4gICAgdyA9IHNpemUuZHJhd2luZy50aXRsZWJveDtcbiAgICBoID0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94O1xuXG4gICAgLy8gYm94IHRvcC1yaWdodFxuICAgIGQucmVjdCggW3gtdy8yLCB5K2gvMl0sIFt3LGhdICk7XG5cbiAgICB5ICs9IGggKyBwYWRkaW5nO1xuXG4gICAgdyA9IHNpemUuZHJhd2luZy50aXRsZWJveDtcbiAgICBoID0gc2l6ZS5kcmF3aW5nLmggLSBwYWRkaW5nKjggLSBzaXplLmRyYXdpbmcudGl0bGVib3gqMi41O1xuXG4gICAgLy90aXRsZSBib3hcbiAgICBkLnJlY3QoIFt4LXcvMiwgeStoLzJdLCBbdyxoXSApO1xuXG4gICAgdmFyIHRpdGxlID0ge307XG4gICAgdGl0bGUudG9wID0geTtcbiAgICB0aXRsZS5ib3R0b20gPSB5K2g7XG4gICAgdGl0bGUucmlnaHQgPSB4O1xuICAgIHRpdGxlLmxlZnQgPSB4LXcgO1xuXG5cbiAgICAvLyBib3ggYm90dG9tLXJpZ2h0XG4gICAgaCA9IHNpemUuZHJhd2luZy50aXRsZWJveCAqIDEuNTtcbiAgICB5ID0gdGl0bGUuYm90dG9tICsgcGFkZGluZztcbiAgICB4ID0geC13LzI7XG4gICAgeSA9IHkraC8yO1xuICAgIGQucmVjdCggW3gsIHldLCBbdyxoXSApO1xuXG4gICAgeSAtPSAyMCoyLzM7XG4gICAgZC50ZXh0KFt4LHldLFxuICAgICAgICBbIHNoZWV0X3NlY3Rpb24sIHNoZWV0X251bSBdLFxuICAgICAgICAncGFnZScsXG4gICAgICAgICd0ZXh0J1xuICAgICAgICApO1xuXG5cbiAgICB2YXIgcGFnZSA9IHt9O1xuICAgIHBhZ2UucmlnaHQgPSB0aXRsZS5yaWdodDtcbiAgICBwYWdlLmxlZnQgPSB0aXRsZS5sZWZ0O1xuICAgIHBhZ2UudG9wID0gdGl0bGUuYm90dG9tICsgcGFkZGluZztcbiAgICBwYWdlLmJvdHRvbSA9IHBhZ2UudG9wICsgc2l6ZS5kcmF3aW5nLnRpdGxlYm94KjEuNTtcbiAgICAvLyBkLnRleHRcblxuICAgIHggPSB0aXRsZS5sZWZ0ICsgcGFkZGluZztcbiAgICB5ID0gdGl0bGUuYm90dG9tIC0gcGFkZGluZztcblxuICAgIHggKz0gMTA7XG4gICAgaWYoIHN5c3RlbS5pbnZlcnRlci5tYWtlICYmIHN5c3RlbS5pbnZlcnRlci5tb2RlbCApe1xuICAgICAgICBkLnRleHQoW3gseV0sXG4gICAgICAgICAgICAgWyAnUFYgU3lzdGVtIERlc2lnbicgXSxcbiAgICAgICAgICAgICd0aXRsZTEnLCAndGV4dCcpLnJvdGF0ZSgtOTApO1xuXG4gICAgfVxuXG4gICAgeCArPSAxNDtcbiAgICBpZiggZy5mLnNlY3Rpb25fZGVmaW5lZCgnbG9jYXRpb24nKSAgKXtcbiAgICAgICAgZC50ZXh0KFt4LHldLCBbXG4gICAgICAgICAgICBnLnBlcm0ubG9jYXRpb24uYWRkcmVzcyxcbiAgICAgICAgICAgIGcucGVybS5sb2NhdGlvbi5jaXR5ICsgJywgJyArIGcucGVybS5sb2NhdGlvbi5jb3VudHkgKyAnLCBGTCwgJyArIGcucGVybS5sb2NhdGlvbi56aXAsXG5cbiAgICAgICAgXSwgJ3RpdGxlMycsICd0ZXh0Jykucm90YXRlKC05MCk7XG4gICAgfVxuXG4gICAgeCA9IHBhZ2UubGVmdCArIHBhZGRpbmc7XG4gICAgeSA9IHBhZ2UudG9wICsgcGFkZGluZztcbiAgICB5ICs9IHNpemUuZHJhd2luZy50aXRsZWJveCAqIDEuNSAqIDMvNDtcblxuXG5cblxuXG5cblxuICAgIHJldHVybiBkLmRyYXdpbmdfcGFydHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhZGRfYm9yZGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZiA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zLmpzJyk7XG5cbi8vdmFyIHNldHRpbmdzID0gcmVxdWlyZSgnLi9zZXR0aW5ncy5qcycpO1xuLy92YXIgbF9hdHRyID0gc2V0dGluZ3MuZHJhd2luZy5sX2F0dHI7XG4vL3ZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuLy8gc2V0dXAgZHJhd2luZyBjb250YWluZXJzXG5cbnZhciBzZXR0aW5ncyA9IHJlcXVpcmUoJy4vc2V0dGluZ3MnKTtcbnZhciBsYXllcl9hdHRyID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sYXllcl9hdHRyO1xudmFyIGZvbnRzID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5mb250cztcblxuXG5cblxuXG52YXIgZHJhd2luZyA9IHt9O1xuXG5cblxuXG5cblxuXG5cblxuLy8gQkxPQ0tTXG5cbnZhciBCbGsgPSB7XG4gICAgdHlwZTogJ2Jsb2NrJyxcbn07XG5CbGsubW92ZSA9IGZ1bmN0aW9uKHgsIHkpe1xuICAgIGZvciggdmFyIGkgaW4gdGhpcy5kcmF3aW5nX3BhcnRzICl7XG4gICAgICAgIHRoaXMuZHJhd2luZ19wYXJ0c1tpXS5tb3ZlKHgseSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbkJsay5hZGQgPSBmdW5jdGlvbigpe1xuICAgIGlmKCB0eXBlb2YgdGhpcy5kcmF3aW5nX3BhcnRzID09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgdGhpcy5kcmF3aW5nX3BhcnRzID0gW107XG4gICAgfVxuICAgIGZvciggdmFyIGkgaW4gYXJndW1lbnRzKXtcbiAgICAgICAgdGhpcy5kcmF3aW5nX3BhcnRzLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuQmxrLnJvdGF0ZSA9IGZ1bmN0aW9uKGRlZyl7XG4gICAgdGhpcy5yb3RhdGUgPSBkZWc7XG59O1xuXG5cbnZhciBibG9ja19hY3RpdmUgPSBmYWxzZTtcbi8vIENyZWF0ZSBkZWZhdWx0IGxheWVyLGJsb2NrIGNvbnRhaW5lciBhbmQgZnVuY3Rpb25zXG5cbi8vIExheWVyc1xuXG52YXIgbGF5ZXJfYWN0aXZlID0gZmFsc2U7XG5cbmRyYXdpbmcubGF5ZXIgPSBmdW5jdGlvbihuYW1lKXsgLy8gc2V0IGN1cnJlbnQgbGF5ZXJcbiAgICBpZiggdHlwZW9mIG5hbWUgPT09ICd1bmRlZmluZWQnICl7IC8vIGlmIG5vIGxheWVyIG5hbWUgZ2l2ZW4sIHJlc2V0IHRvIGRlZmF1bHRcbiAgICAgICAgbGF5ZXJfYWN0aXZlID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmICggISAobmFtZSBpbiBsYXllcl9hdHRyKSApIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdFcnJvcjogdW5rbm93biBsYXllciBcIicrbmFtZSsnXCIsIHVzaW5nIGJhc2UnKTtcbiAgICAgICAgbGF5ZXJfYWN0aXZlID0gJ2Jhc2UnIDtcbiAgICB9IGVsc2UgeyAvLyBmaW5hbHkgYWN0aXZhdGUgcmVxdWVzdGVkIGxheWVyXG4gICAgICAgIGxheWVyX2FjdGl2ZSA9IG5hbWU7XG4gICAgfVxuICAgIC8vKi9cbn07XG5cbnZhciBzZWN0aW9uX2FjdGl2ZSA9IGZhbHNlO1xuXG5kcmF3aW5nLnNlY3Rpb24gPSBmdW5jdGlvbihuYW1lKXsgLy8gc2V0IGN1cnJlbnQgc2VjdGlvblxuICAgIGlmKCB0eXBlb2YgbmFtZSA9PT0gJ3VuZGVmaW5lZCcgKXsgLy8gaWYgbm8gc2VjdGlvbiBuYW1lIGdpdmVuLCByZXNldCB0byBkZWZhdWx0XG4gICAgICAgIHNlY3Rpb25fYWN0aXZlID0gZmFsc2U7XG4gICAgfSBlbHNlIHsgLy8gZmluYWx5IGFjdGl2YXRlIHJlcXVlc3RlZCBzZWN0aW9uXG4gICAgICAgIHNlY3Rpb25fYWN0aXZlID0gbmFtZTtcbiAgICB9XG4gICAgLy8qL1xufTtcblxuXG5kcmF3aW5nLmJsb2NrX3N0YXJ0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgIGlmKCB0eXBlb2YgbmFtZSA9PT0gJ3VuZGVmaW5lZCcgKXsgLy8gaWYgbmFtZSBhcmd1bWVudCBpcyBzdWJtaXR0ZWRcbiAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiBuYW1lIHJlcXVpcmVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGJsaztcbiAgICAgICAgYmxvY2tfYWN0aXZlID0gbmFtZTtcbiAgICAgICAgaWYoIGcuZHJhd2luZy5ibG9ja3NbYmxvY2tfYWN0aXZlXSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6IGJsb2NrIGFscmVhZHkgZXhpc3RzJyk7XG4gICAgICAgIH1cbiAgICAgICAgYmxrID0gT2JqZWN0LmNyZWF0ZShCbGspO1xuICAgICAgICBnLmRyYXdpbmcuYmxvY2tzW2Jsb2NrX2FjdGl2ZV0gPSBibGs7XG4gICAgICAgIHJldHVybiBibGs7XG4gICAgfVxufTtcblxuICAgIC8qXG4gICAgeCA9IGxvYy53aXJlX3RhYmxlLnggLSB3LzI7XG4gICAgeSA9IGxvYy53aXJlX3RhYmxlLnkgLSBoLzI7XG4gICAgaWYoIHR5cGVvZiBsYXllcl9uYW1lICE9PSAndW5kZWZpbmVkJyAmJiAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICkge1xuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSBsYXllcnNbbGF5ZXJfbmFtZV1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiggISAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICl7IGNvbnNvbGUubG9nKFwiZXJyb3IsIGxheWVyIGRvZXMgbm90IGV4aXN0LCB1c2luZyBjdXJyZW50XCIpO31cbiAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gIGxheWVyX2FjdGl2ZVxuICAgIH1cbiAgICAqL1xuZHJhd2luZy5ibG9ja19lbmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYmxrID0gZy5kcmF3aW5nLmJsb2Nrc1tibG9ja19hY3RpdmVdO1xuICAgIGJsb2NrX2FjdGl2ZSA9IGZhbHNlO1xuICAgIHJldHVybiBibGs7XG59O1xuXG5cblxuXG5cblxuLy8vLy8vXG4vLyBidWlsZCBwcm90b3R5cGUgZWxlbWVudFxuXG4gICAgLypcbiAgICBpZiggdHlwZW9mIGxheWVyX25hbWUgIT09ICd1bmRlZmluZWQnICYmIChsYXllcl9uYW1lIGluIGxheWVycykgKSB7XG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9IGxheWVyc1tsYXllcl9uYW1lXVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCAhIChsYXllcl9uYW1lIGluIGxheWVycykgKXsgY29uc29sZS5sb2coXCJlcnJvciwgbGF5ZXIgZG9lcyBub3QgZXhpc3QsIHVzaW5nIGN1cnJlbnRcIik7fVxuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSAgbGF5ZXJfYWN0aXZlXG4gICAgfVxuICAgICovXG5cblxudmFyIFN2Z0VsZW0gPSB7XG4gICAgb2JqZWN0OiAnU3ZnRWxlbSdcbn07XG5TdmdFbGVtLm1vdmUgPSBmdW5jdGlvbih4LCB5KXtcbiAgICBpZiggdHlwZW9mIHRoaXMucG9pbnRzICE9ICd1bmRlZmluZWQnICkge1xuICAgICAgICBmb3IoIHZhciBpIGluIHRoaXMucG9pbnRzICkge1xuICAgICAgICAgICAgdGhpcy5wb2ludHNbaV1bMF0gKz0geDtcbiAgICAgICAgICAgIHRoaXMucG9pbnRzW2ldWzFdICs9IHk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuU3ZnRWxlbS5yb3RhdGUgPSBmdW5jdGlvbihkZWcpe1xuICAgIHRoaXMucm90YXRlZCA9IGRlZztcbn07XG5cbi8vLy8vLy9cbi8vIGZ1bmN0aW9ucyBmb3IgYWRkaW5nIGRyYXdpbmdfcGFydHNcblxuZHJhd2luZy5hZGQgPSBmdW5jdGlvbih0eXBlLCBwb2ludHMsIGxheWVyX25hbWUsIGF0dHJzKSB7XG4gICAgaWYoIHBvaW50c1swXSA9PT0gdW5kZWZpbmVkICkgY29uc29sZS53YXJuKFwicG9pbnRzIG5vdCBkZWZmaW5lZFwiLCB0eXBlLCBwb2ludHMsIGxheWVyX25hbWUgKTtcblxuICAgIGlmKCB0eXBlb2YgbGF5ZXJfbmFtZSA9PT0gJ3VuZGVmaW5lZCcgKSB7IGxheWVyX25hbWUgPSBsYXllcl9hY3RpdmU7IH1cbiAgICBpZiggISAobGF5ZXJfbmFtZSBpbiBsYXllcl9hdHRyKSApIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdFcnJvcjogTGF5ZXIgXCInKyBsYXllcl9uYW1lICsnXCIgbmFtZSBub3QgZm91bmQsIHVzaW5nIGJhc2UnKTtcbiAgICAgICAgbGF5ZXJfbmFtZSA9ICdiYXNlJztcbiAgICB9XG5cbiAgICBpZiggdHlwZW9mIHBvaW50cyA9PSAnc3RyaW5nJykge1xuICAgICAgICB2YXIgcG9pbnRzX2EgPSBwb2ludHMuc3BsaXQoJyAnKTtcbiAgICAgICAgZm9yKCB2YXIgaSBpbiBwb2ludHNfYSApIHtcbiAgICAgICAgICAgIHBvaW50c19hW2ldID0gcG9pbnRzX2FbaV0uc3BsaXQoJywnKTtcbiAgICAgICAgICAgIGZvciggdmFyIGMgaW4gcG9pbnRzX2FbaV0gKSB7XG4gICAgICAgICAgICAgICAgcG9pbnRzX2FbaV1bY10gPSBOdW1iZXIocG9pbnRzX2FbaV1bY10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGVsZW0gPSBPYmplY3QuY3JlYXRlKFN2Z0VsZW0pO1xuICAgIGVsZW0udHlwZSA9IHR5cGU7XG4gICAgZWxlbS5sYXllcl9uYW1lID0gbGF5ZXJfbmFtZTtcbiAgICBlbGVtLnNlY3Rpb25fbmFtZSA9IHNlY3Rpb25fYWN0aXZlO1xuICAgIGlmKCBhdHRycyAhPT0gdW5kZWZpbmVkICkgZWxlbS5hdHRycyA9IGF0dHJzO1xuICAgIGlmKCB0eXBlID09PSAnbGluZScgKSB7XG4gICAgICAgIGVsZW0ucG9pbnRzID0gcG9pbnRzO1xuICAgIH0gZWxzZSBpZiggdHlwZSA9PT0gJ3BvbHknICkge1xuICAgICAgICBlbGVtLnBvaW50cyA9IHBvaW50cztcbiAgICB9IGVsc2UgaWYoIHR5cGVvZiBwb2ludHNbMF0ueCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZWxlbS54ID0gcG9pbnRzWzBdWzBdO1xuICAgICAgICBlbGVtLnkgPSBwb2ludHNbMF1bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbS54ID0gcG9pbnRzWzBdLng7XG4gICAgICAgIGVsZW0ueSA9IHBvaW50c1swXS55O1xuICAgIH1cblxuICAgIGlmKGJsb2NrX2FjdGl2ZSkge1xuICAgICAgICBlbGVtLmJsb2NrX25hbWUgPSBibG9ja19hY3RpdmU7XG4gICAgICAgIGcuZHJhd2luZy5ibG9ja3NbYmxvY2tfYWN0aXZlXS5hZGQoZWxlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kcmF3aW5nX3BhcnRzLnB1c2goZWxlbSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW07XG59O1xuXG5kcmF3aW5nLmxpbmUgPSBmdW5jdGlvbihwb2ludHMsIGxheWVyLCBhdHRycyl7IC8vIChwb2ludHMsIFtsYXllcl0pXG4gICAgLy9yZXR1cm4gYWRkKCdsaW5lJywgcG9pbnRzLCBsYXllcilcbiAgICB2YXIgbGluZSA9ICB0aGlzLmFkZCgnbGluZScsIHBvaW50cywgbGF5ZXIsIGF0dHJzKTtcbiAgICByZXR1cm4gbGluZTtcbn07XG5cbmRyYXdpbmcucG9seSA9IGZ1bmN0aW9uKHBvaW50cywgbGF5ZXIsIGF0dHJzKXsgLy8gKHBvaW50cywgW2xheWVyXSlcbiAgICAvL3JldHVybiBhZGQoJ3BvbHknLCBwb2ludHMsIGxheWVyKVxuICAgIHZhciBwb2x5ID0gIHRoaXMuYWRkKCdwb2x5JywgcG9pbnRzLCBsYXllciwgYXR0cnMpO1xuICAgIHJldHVybiBwb2x5O1xufTtcblxuZHJhd2luZy5yZWN0ID0gZnVuY3Rpb24obG9jLCBzaXplLCBsYXllciwgYXR0cnMpe1xuICAgIHZhciByZWMgPSB0aGlzLmFkZCgncmVjdCcsIFtsb2NdLCBsYXllciwgYXR0cnMpO1xuICAgIHJlYy53ID0gc2l6ZVswXTtcbiAgICAvKlxuICAgIGlmKCB0eXBlb2YgbGF5ZXJfbmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApIHtcbiAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gbGF5ZXJzW2xheWVyX25hbWVdXG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYoICEgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApeyBjb25zb2xlLmxvZyhcImVycm9yLCBsYXllciBkb2VzIG5vdCBleGlzdCwgdXNpbmcgY3VycmVudFwiKTt9XG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9ICBsYXllcl9hY3RpdmVcbiAgICB9XG4gICAgKi9cbiAgICByZWMuaCA9IHNpemVbMV07XG4gICAgcmV0dXJuIHJlYztcbn07XG5cbmRyYXdpbmcuY2lyYyA9IGZ1bmN0aW9uKGxvYywgZGlhbWV0ZXIsIGxheWVyLCBhdHRycyl7XG4gICAgdmFyIGNpciA9IHRoaXMuYWRkKCdjaXJjJywgW2xvY10sIGxheWVyLCBhdHRycyk7XG4gICAgY2lyLmQgPSBkaWFtZXRlcjtcbiAgICByZXR1cm4gY2lyO1xufTtcblxuZHJhd2luZy50ZXh0ID0gZnVuY3Rpb24obG9jLCBzdHJpbmdzLCBmb250LCBsYXllciwgYXR0cnMpe1xuICAgIHZhciB0eHQgPSB0aGlzLmFkZCgndGV4dCcsIFtsb2NdLCBsYXllciwgYXR0cnMpO1xuICAgIGlmKCB0eXBlb2Ygc3RyaW5ncyA9PSAnc3RyaW5nJyl7XG4gICAgICAgIHN0cmluZ3MgPSBbc3RyaW5nc107XG4gICAgfVxuICAgIHR4dC5zdHJpbmdzID0gc3RyaW5ncztcbiAgICB0eHQuZm9udCA9IGZvbnQ7XG4gICAgcmV0dXJuIHR4dDtcbn07XG5cbmRyYXdpbmcuYmxvY2sgPSBmdW5jdGlvbihuYW1lKSB7Ly8gc2V0IGN1cnJlbnQgYmxvY2tcbiAgICB2YXIgeCx5O1xuICAgIGlmKCBhcmd1bWVudHMubGVuZ3RoID09PSAyICl7IC8vIGlmIGNvb3IgaXMgcGFzc2VkXG4gICAgICAgIGlmKCB0eXBlb2YgYXJndW1lbnRzWzFdLnggIT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICB4ID0gYXJndW1lbnRzWzFdLng7XG4gICAgICAgICAgICB5ID0gYXJndW1lbnRzWzFdLnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB4ID0gYXJndW1lbnRzWzFdWzBdO1xuICAgICAgICAgICAgeSA9IGFyZ3VtZW50c1sxXVsxXTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiggYXJndW1lbnRzLmxlbmd0aCA9PT0gMyApeyAvLyBpZiB4LHkgaXMgcGFzc2VkXG4gICAgICAgIHggPSBhcmd1bWVudHNbMV07XG4gICAgICAgIHkgPSBhcmd1bWVudHNbMl07XG4gICAgfVxuXG4gICAgLy8gVE9ETzogd2hhdCBpZiBibG9jayBkb2VzIG5vdCBleGlzdD8gcHJpbnQgbGlzdCBvZiBibG9ja3M/XG4gICAgdmFyIGJsayA9IE9iamVjdC5jcmVhdGUoZy5kcmF3aW5nLmJsb2Nrc1tuYW1lXSk7XG4gICAgYmxrLnggPSB4O1xuICAgIGJsay55ID0geTtcblxuICAgIGlmKGJsb2NrX2FjdGl2ZSl7XG4gICAgICAgIGcuZHJhd2luZy5ibG9ja3NbYmxvY2tfYWN0aXZlXS5hZGQoYmxrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRyYXdpbmdfcGFydHMucHVzaChibGspO1xuICAgIH1cbiAgICByZXR1cm4gYmxrO1xufTtcblxuXG5cblxuXG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy9cbi8vIFRhYmxlc1xuXG52YXIgQ2VsbCA9IHtcbiAgICBpbml0OiBmdW5jdGlvbih0YWJsZSwgUiwgQyl7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy50YWJsZSA9IHRhYmxlO1xuICAgICAgICB0aGlzLlIgPSBSO1xuICAgICAgICB0aGlzLkMgPSBDO1xuICAgICAgICAvKlxuICAgICAgICB0aGlzLmJvcmRlcnMgPSB7fTtcbiAgICAgICAgdGhpcy5ib3JkZXJfb3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHNpZGUpe1xuICAgICAgICAgICAgc2VsZi5ib3JkZXJzW3NpZGVdID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyovXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgLypcbiAgICBib3JkZXJfb3B0aW9uczogWydUJywgJ0InLCAnTCcsICdSJ10sXG4gICAgLy8qL1xuICAgIHRleHQ6IGZ1bmN0aW9uKHRleHQpe1xuICAgICAgICB0aGlzLmNlbGxfdGV4dCA9IHRleHQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfSxcbiAgICBmb250OiBmdW5jdGlvbihmb250X25hbWUpe1xuICAgICAgICB0aGlzLmNlbGxfZm9udF9uYW1lID0gZm9udF9uYW1lO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgYm9yZGVyOiBmdW5jdGlvbihib3JkZXJfc3RyaW5nLCBzdGF0ZSl7XG4gICAgICAgIHRoaXMudGFibGUuYm9yZGVyKCB0aGlzLlIsIHRoaXMuQywgYm9yZGVyX3N0cmluZywgc3RhdGUgKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTtcblxudmFyIFRhYmxlID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKCBkcmF3aW5nLCBudW1fcm93cywgbnVtX2NvbHMgKXtcbiAgICAgICAgdGhpcy5kcmF3aW5nID0gZHJhd2luZztcbiAgICAgICAgdGhpcy5udW1fcm93cyA9IG51bV9yb3dzO1xuICAgICAgICB0aGlzLm51bV9jb2xzID0gbnVtX2NvbHM7XG4gICAgICAgIHZhciByLGM7XG5cbiAgICAgICAgLy8gc2V0dXAgYm9yZGVyIGNvbnRhaW5lcnNcbiAgICAgICAgdGhpcy5ib3JkZXJzX3Jvd3MgPSBbXTtcbiAgICAgICAgZm9yKCByPTA7IHI8PW51bV9yb3dzOyByKyspe1xuICAgICAgICAgICAgdGhpcy5ib3JkZXJzX3Jvd3Nbcl0gPSBbXTtcbiAgICAgICAgICAgIGZvciggYz0xOyBjPD1udW1fY29sczsgYysrKXtcbiAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfcm93c1tyXVtjXSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYm9yZGVyc19jb2xzID0gW107XG4gICAgICAgIGZvciggYz0wOyBjPD1udW1fY29sczsgYysrKXtcbiAgICAgICAgICAgIHRoaXMuYm9yZGVyc19jb2xzW2NdID0gW107XG4gICAgICAgICAgICBmb3IoIHI9MTsgcjw9bnVtX3Jvd3M7IHIrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5ib3JkZXJzX2NvbHNbY11bcl0gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNldCBjb2x1bW4gYW5kIHJvdyBzaXplIGNvbnRhaW5lcnNcbiAgICAgICAgdGhpcy5yb3dfc2l6ZXMgPSBbXTtcbiAgICAgICAgZm9yKCByPTE7IHI8PW51bV9yb3dzOyByKyspe1xuICAgICAgICAgICAgdGhpcy5yb3dfc2l6ZXNbcl0gPSAxNTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbF9zaXplcyA9IFtdO1xuICAgICAgICBmb3IoIGM9MTsgYzw9bnVtX2NvbHM7IGMrKyl7XG4gICAgICAgICAgICB0aGlzLmNvbF9zaXplc1tjXSA9IDYwO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2V0dXAgY2VsbCBjb250YWluZXJcbiAgICAgICAgdGhpcy5jZWxscyA9IFtdO1xuICAgICAgICBmb3IoIHI9MTsgcjw9bnVtX3Jvd3M7IHIrKyl7XG4gICAgICAgICAgICB0aGlzLmNlbGxzW3JdID0gW107XG4gICAgICAgICAgICBmb3IoIGM9MTsgYzw9bnVtX2NvbHM7IGMrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tyXVtjXSA9IE9iamVjdC5jcmVhdGUoQ2VsbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tyXVtjXS5pbml0KCB0aGlzLCByLCBjKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIC8vKi9cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGxvYzogZnVuY3Rpb24oIHgsIHkpe1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNlbGw6IGZ1bmN0aW9uKCBSLCBDICl7XG4gICAgICAgIHJldHVybiB0aGlzLmNlbGxzW1JdW0NdO1xuICAgIH0sXG4gICAgYWxsX2NlbGxzOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgY2VsbF9hcnJheSA9IFtdO1xuICAgICAgICB0aGlzLmNlbGxzLmZvckVhY2goZnVuY3Rpb24ocm93KXtcbiAgICAgICAgICAgIHJvdy5mb3JFYWNoKGZ1bmN0aW9uKGNlbGwpe1xuICAgICAgICAgICAgICAgIGNlbGxfYXJyYXkucHVzaChjZWxsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNlbGxfYXJyYXk7XG4gICAgfSxcbiAgICBjb2xfc2l6ZTogZnVuY3Rpb24oY29sLCBzaXplKXtcbiAgICAgICAgaWYoIHR5cGVvZiBjb2wgPT09ICdzdHJpbmcnICl7XG4gICAgICAgICAgICBpZiggY29sID09PSAnYWxsJyl7XG4gICAgICAgICAgICAgICAgXy5yYW5nZSh0aGlzLm51bV9jb2xzKS5mb3JFYWNoKGZ1bmN0aW9uKGMpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbF9zaXplc1tjKzFdID0gc2l6ZTtcbiAgICAgICAgICAgICAgICB9LHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzaXplID0gTnVtYmVyKHNpemUpO1xuICAgICAgICAgICAgICAgIGlmKCBpc05hTihzaXplKSApe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6IGNvbHVtbiB3cm9uZycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29sX3NpemVzW2NvbF0gPSBzaXplO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLy8gaXMgbnVtYmVyXG4gICAgICAgICAgICB0aGlzLmNvbF9zaXplc1tjb2xdID0gc2l6ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIC8vKi9cbiAgICByb3dfc2l6ZTogZnVuY3Rpb24ocm93LCBzaXplKXtcbiAgICAgICAgaWYoIHR5cGVvZiByb3cgPT09ICdzdHJpbmcnICl7XG4gICAgICAgICAgICBpZiggcm93ID09PSAnYWxsJyl7XG4gICAgICAgICAgICAgICAgXy5yYW5nZSh0aGlzLm51bV9yb3dzKS5mb3JFYWNoKGZ1bmN0aW9uKHIpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvd19zaXplc1tyKzFdID0gc2l6ZTtcbiAgICAgICAgICAgICAgICB9LHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzaXplID0gTnVtYmVyKHNpemUpO1xuICAgICAgICAgICAgICAgIGlmKCBpc05hTihzaXplKSApe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6IGNvbHVtbiB3cm9uZycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm93X3NpemVzW3Jvd10gPSBzaXplO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLy8gaXMgbnVtYmVyXG4gICAgICAgICAgICB0aGlzLnJvd19zaXplc1tyb3ddID0gc2l6ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIC8vKi9cblxuICAgIC8qXG4gICAgYWRkX2NlbGw6IGZ1bmN0aW9uKCl7XG5cbiAgICB9LFxuICAgIGFkZF9yb3dzOiBmdW5jdGlvbihuKXtcbiAgICAgICAgdGhpcy5udW1fY29sbW5zICs9IG47XG4gICAgICAgIHRoaXMubnVtX3Jvd3MgKz0gbjtcbiAgICAgICAgXy5yYW5nZShuKS5mb3JFYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLnJvd3MucHVzaChbXSk7XG4gICAgICAgIH0pO1xuICAgICAgICBfLnJhbmdlKG4pLmZvckVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMudGV4dF9yb3dzLnB1c2goW10pO1xuICAgICAgICB9KTtcblxuICAgIH0sXG4gICAgdGV4dDogZnVuY3Rpb24oIFIsIEMsIHRleHQpe1xuICAgICAgICB0aGlzLnRleHRfcm93c1tSXVtDXSA9IHRleHQ7XG4gICAgfSxcbiAgICAvLyovXG4gICAgYm9yZGVyOiBmdW5jdGlvbiggUiwgQywgYm9yZGVyX3N0cmluZywgc3RhdGUpe1xuICAgICAgICBpZiggc3RhdGUgPT09IHVuZGVmaW5lZCApIHN0YXRlID0gdHJ1ZTtcblxuICAgICAgICBib3JkZXJfc3RyaW5nID0gYm9yZGVyX3N0cmluZy50b1VwcGVyQ2FzZSgpLnRyaW0oKTtcbiAgICAgICAgdmFyIGJvcmRlcnM7XG4gICAgICAgIGlmKCBib3JkZXJfc3RyaW5nID09PSAnQUxMJyApe1xuICAgICAgICAgICAgYm9yZGVycyA9IFsnVCcsICdCJywgJ0wnLCAnUiddO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYm9yZGVycyA9IGJvcmRlcl9zdHJpbmcuc3BsaXQoL1tcXHMsXSsvKTtcbiAgICAgICAgfVxuICAgICAgICBib3JkZXJzLmZvckVhY2goZnVuY3Rpb24oc2lkZSl7XG4gICAgICAgICAgICBzd2l0Y2goc2lkZSl7XG4gICAgICAgICAgICAgICAgY2FzZSAnVCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyc19yb3dzW1ItMV1bQ10gPSBzdGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyc19yb3dzW1JdW0NdID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0wnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfY29sc1tDLTFdW1JdID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ1InOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfY29sc1tDXVtSXSA9IHN0YXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY29ybmVyOiBmdW5jdGlvbihSLEMpe1xuICAgICAgICB2YXIgeCA9IHRoaXMueDtcbiAgICAgICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgICAgIHZhciByLGM7XG4gICAgICAgIGZvciggcj0xOyByPD1SOyByKysgKXtcbiAgICAgICAgICAgIHkgKz0gdGhpcy5yb3dfc2l6ZXNbcl07XG4gICAgICAgIH1cbiAgICAgICAgZm9yKCBjPTE7IGM8PUM7IGMrKyApe1xuICAgICAgICAgICAgeCArPSB0aGlzLmNvbF9zaXplc1tjXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3gseV07XG4gICAgfSxcbiAgICBjZW50ZXI6IGZ1bmN0aW9uKFIsQyl7XG4gICAgICAgIHZhciB4ID0gdGhpcy54O1xuICAgICAgICB2YXIgeSA9IHRoaXMueTtcbiAgICAgICAgdmFyIHIsYztcbiAgICAgICAgZm9yKCByPTE7IHI8PVI7IHIrKyApe1xuICAgICAgICAgICAgeSArPSB0aGlzLnJvd19zaXplc1tyXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IoIGM9MTsgYzw9QzsgYysrICl7XG4gICAgICAgICAgICB4ICs9IHRoaXMuY29sX3NpemVzW2NdO1xuICAgICAgICB9XG4gICAgICAgIHkgLT0gdGhpcy5yb3dfc2l6ZXNbUl0vMjtcbiAgICAgICAgeCAtPSB0aGlzLmNvbF9zaXplc1tDXS8yO1xuICAgICAgICByZXR1cm4gW3gseV07XG4gICAgfSxcbiAgICBsZWZ0OiBmdW5jdGlvbihSLEMpe1xuICAgICAgICB2YXIgY29vciA9IHRoaXMuY2VudGVyKFIsQyk7XG4gICAgICAgIGNvb3JbMF0gPSBjb29yWzBdIC0gdGhpcy5jb2xfc2l6ZXNbQ10vMiArIHRoaXMucm93X3NpemVzW1JdLzI7XG4gICAgICAgIHJldHVybiBjb29yO1xuICAgIH0sXG4gICAgcmlnaHQ6IGZ1bmN0aW9uKFIsQyl7XG4gICAgICAgIHZhciBjb29yID0gdGhpcy5jZW50ZXIoUixDKTtcbiAgICAgICAgY29vclswXSA9IGNvb3JbMF0gKyB0aGlzLmNvbF9zaXplc1tDXS8yIC0gdGhpcy5yb3dfc2l6ZXNbUl0vMjtcbiAgICAgICAgcmV0dXJuIGNvb3I7XG4gICAgfSxcbiAgICBtazogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgcixjO1xuICAgICAgICBmb3IoIHI9MDsgcjw9dGhpcy5udW1fcm93czsgcisrICl7XG4gICAgICAgICAgICBmb3IoIGM9MTsgYzw9dGhpcy5udW1fY29sczsgYysrICl7XG4gICAgICAgICAgICAgICAgaWYoIHRoaXMuYm9yZGVyc19yb3dzW3JdW2NdID09PSB0cnVlICl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd2luZy5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ybmVyKHIsYy0xKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ybmVyKHIsYyksXG4gICAgICAgICAgICAgICAgICAgICAgICBdLCAnYm9yZGVyJyk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yKCBjPTA7IGM8PXRoaXMubnVtX2NvbHM7IGMrKyApe1xuICAgICAgICAgICAgZm9yKCByPTE7IHI8PXRoaXMubnVtX3Jvd3M7IHIrKyApe1xuICAgICAgICAgICAgICAgIGlmKCB0aGlzLmJvcmRlcnNfY29sc1tjXVtyXSA9PT0gdHJ1ZSApe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdpbmcubGluZShbXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcm5lcihyLTEsYyksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcm5lcihyLGMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSwgJ2JvcmRlcicpO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciggcj0xOyByPD10aGlzLm51bV9yb3dzOyByKysgKXtcbiAgICAgICAgICAgIGZvciggYz0xOyBjPD10aGlzLm51bV9jb2xzOyBjKysgKXtcbiAgICAgICAgICAgICAgICBpZiggdHlwZW9mIHRoaXMuY2VsbChyLGMpLmNlbGxfdGV4dCA9PT0gJ3N0cmluZycgKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGwgPSB0aGlzLmNlbGwocixjKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZvbnRfbmFtZSA9IGNlbGwuY2VsbF9mb250X25hbWUgfHwgJ3RhYmxlJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvb3I7XG4gICAgICAgICAgICAgICAgICAgIGlmKCBnLmRyYXdpbmdfc2V0dGluZ3MuZm9udHNbZm9udF9uYW1lXVsndGV4dC1hbmNob3InXSA9PT0gJ2NlbnRlcicpIGNvb3IgPSB0aGlzLmNlbnRlcihyLGMpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKCBnLmRyYXdpbmdfc2V0dGluZ3MuZm9udHNbZm9udF9uYW1lXVsndGV4dC1hbmNob3InXSA9PT0gJ3JpZ2h0JykgY29vciA9IHRoaXMucmlnaHQocixjKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiggZy5kcmF3aW5nX3NldHRpbmdzLmZvbnRzW2ZvbnRfbmFtZV1bJ3RleHQtYW5jaG9yJ10gPT09ICdsZWZ0JykgY29vciA9IHRoaXMubGVmdChyLGMpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGNvb3IgPSB0aGlzLmNlbnRlcihyLGMpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd2luZy50ZXh0KFxuICAgICAgICAgICAgICAgICAgICAgICAgY29vcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbChyLGMpLmNlbGxfdGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0ZXh0J1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG59O1xuXG5kcmF3aW5nLnRhYmxlID0gZnVuY3Rpb24oIG51bV9yb3dzLCBudW1fY29scyApe1xuICAgIHZhciBuZXdfdGFibGUgPSBPYmplY3QuY3JlYXRlKFRhYmxlKTtcbiAgICBuZXdfdGFibGUuaW5pdCggdGhpcywgbnVtX3Jvd3MsIG51bV9jb2xzICk7XG5cbiAgICByZXR1cm4gbmV3X3RhYmxlO1xuXG59O1xuXG5cbmRyYXdpbmcuYXBwZW5kID0gIGZ1bmN0aW9uKGRyYXdpbmdfcGFydHMpe1xuICAgIHRoaXMuZHJhd2luZ19wYXJ0cyA9IHRoaXMuZHJhd2luZ19wYXJ0cy5jb25jYXQoZHJhd2luZ19wYXJ0cyk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5cblxudmFyIG1rX2RyYXdpbmcgPSBmdW5jdGlvbigpe1xuICAgIHZhciBwYWdlID0gT2JqZWN0LmNyZWF0ZShkcmF3aW5nKTtcbiAgICAvL2NvbnNvbGUubG9nKHBhZ2UpO1xuICAgIHBhZ2UuZHJhd2luZ19wYXJ0cyA9IFtdO1xuICAgIHJldHVybiBwYWdlO1xufTtcblxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gbWtfZHJhd2luZztcbiIsInZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG52YXIgbWtfYm9yZGVyID0gcmVxdWlyZSgnLi9ta19ib3JkZXInKTtcblxudmFyIHBhZ2UgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgY29uc29sZS5sb2coXCIqKiBNYWtpbmcgcGFnZSAxXCIpO1xuXG4gICAgdmFyIGQgPSBta19kcmF3aW5nKCk7XG5cbiAgICB2YXIgc2hlZXRfc2VjdGlvbiA9ICdBJztcbiAgICB2YXIgc2hlZXRfbnVtID0gJzAwJztcbiAgICBkLmFwcGVuZChta19ib3JkZXIoc2V0dGluZ3MsIHNoZWV0X3NlY3Rpb24sIHNoZWV0X251bSApKTtcblxuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxvYztcblxuICAgIHZhciB4LCB5LCBoLCB3O1xuXG4gICAgZC50ZXh0KFxuICAgICAgICBbc2l6ZS5kcmF3aW5nLncqMS8yLCBzaXplLmRyYXdpbmcuaCoxLzNdLFxuICAgICAgICBbXG4gICAgICAgICAgICAnUFYgU3lzdGVtIERlc2lnbicsXG4gICAgICAgIF0sXG4gICAgICAgICdwcm9qZWN0IHRpdGxlJ1xuICAgICk7XG5cbiAgICBpZiggZy5mLnNlY3Rpb25fZGVmaW5lZCgnbG9jYXRpb24nKSAgKXtcbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgW3NpemUuZHJhd2luZy53KjEvMiwgc2l6ZS5kcmF3aW5nLmgqMS8zICszMF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgZy5wZXJtLmxvY2F0aW9uLmFkZHJlc3MsXG4gICAgICAgICAgICAgICAgZy5wZXJtLmxvY2F0aW9uLmNpdHkgKyAnLCAnICsgZy5wZXJtLmxvY2F0aW9uLmNvdW50eSArICcsIEZMLCAnICsgZy5wZXJtLmxvY2F0aW9uLnppcCxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAncHJvamVjdCB0aXRsZSdcbiAgICAgICAgKTtcbiAgICB9XG4gICAgdmFyIG5fcm93cyA9IDQ7XG4gICAgdmFyIG5fY29scyA9IDI7XG4gICAgdyA9IDQwMCs4MDtcbiAgICBoID0gbl9yb3dzKjIwO1xuICAgIHggPSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyo2O1xuICAgIHkgPSBzaXplLmRyYXdpbmcuaCAtIHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nKjYgLSA0KjIwO1xuXG4gICAgZC50ZXh0KCBbeCt3LzIsIHktMjBdLCAnQ29udGVudHMnLCd0YWJsZV9sYXJnZScgKTtcblxuICAgIHZhciB0ID0gZC50YWJsZShuX3Jvd3Msbl9jb2xzKS5sb2MoeCx5KTtcbiAgICB0LnJvd19zaXplKCdhbGwnLCAyMCkuY29sX3NpemUoMiwgNDAwKS5jb2xfc2l6ZSgxLCA4MCk7XG4gICAgdC5jZWxsKDEsMSkudGV4dCgnUFYtMDEnKTtcbiAgICB0LmNlbGwoMSwyKS50ZXh0KCdQViBzeXN0ZW0gd2lyaW5nIGRpYWdyYW0nKTtcbiAgICB0LmNlbGwoMiwxKS50ZXh0KCdQVi0wMicpO1xuICAgIHQuY2VsbCgyLDIpLnRleHQoJ1BWIHN5c3RlbSBzcGVjaWZpY2F0aW9ucycpO1xuICAgIHQuY2VsbCgzLDEpLnRleHQoJ1MtMDEnKTtcbiAgICB0LmNlbGwoMywyKS50ZXh0KCdSb29mIGRldGFpbHMnKTtcblxuICAgIHQuYWxsX2NlbGxzKCkuZm9yRWFjaChmdW5jdGlvbihjZWxsKXtcbiAgICAgICAgY2VsbC5mb250KCd0YWJsZV9sYXJnZV9sZWZ0JykuYm9yZGVyKCdhbGwnKTtcbiAgICB9KTtcblxuICAgIHQubWsoKTtcblxuICAgIC8qXG4gICAgY29uc29sZS5sb2codGFibGVfcGFydHMpO1xuICAgIGQuYXBwZW5kKHRhYmxlX3BhcnRzKTtcbiAgICBkLnRleHQoW3NpemUuZHJhd2luZy53LzMsc2l6ZS5kcmF3aW5nLmgvM10sICdYJywgJ3RhYmxlJyk7XG4gICAgZC5yZWN0KFtzaXplLmRyYXdpbmcudy8zLTUsc2l6ZS5kcmF3aW5nLmgvMy01XSxbMTAsMTBdLCdib3gnKTtcblxuICAgIHQuY2VsbCgyLDIpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCAyLDInKTtcbiAgICB0LmNlbGwoMywzKS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgMywzJyk7XG4gICAgdC5jZWxsKDQsNCkuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDQsNCcpO1xuICAgIHQuY2VsbCg1LDUpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCA1LDUnKTtcblxuXG5cbiAgICB0LmNlbGwoNCw2KS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgNCw2Jyk7XG4gICAgdC5jZWxsKDQsNykuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDQsNycpO1xuICAgIHQuY2VsbCg1LDYpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCA1LDYnKTtcbiAgICB0LmNlbGwoNSw3KS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgNSw3Jyk7XG5cblxuICAgIC8vKi9cblxuICAgIHJldHVybiBkLmRyYXdpbmdfcGFydHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuIiwidmFyIG1rX2RyYXdpbmcgPSByZXF1aXJlKCcuL21rX2RyYXdpbmcnKTtcbnZhciBta19ib3JkZXIgPSByZXF1aXJlKCcuL21rX2JvcmRlcicpO1xuXG4vL3ZhciBkcmF3aW5nX3BhcnRzID0gW107XG4vL2QubGlua19kcmF3aW5nX3BhcnRzKGRyYXdpbmdfcGFydHMpO1xuXG52YXIgcGFnZSA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICBjb25zb2xlLmxvZyhcIioqIE1ha2luZyBwYWdlIDJcIik7XG4gICAgZCA9IG1rX2RyYXdpbmcoKTtcbiAgICB2YXIgc2hlZXRfc2VjdGlvbiA9ICdQVic7XG4gICAgdmFyIHNoZWV0X251bSA9ICcwMSc7XG4gICAgZC5hcHBlbmQobWtfYm9yZGVyKHNldHRpbmdzLCBzaGVldF9zZWN0aW9uLCBzaGVldF9udW0gKSk7XG5cbiAgICB2YXIgZiA9IHNldHRpbmdzLmY7XG5cbiAgICAvL3ZhciBjb21wb25lbnRzID0gc2V0dGluZ3MuY29tcG9uZW50cztcbiAgICAvL3ZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG4gICAgdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcblxuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxvYztcblxuXG5cblxuICAgIHZhciB4LCB5LCBoLCB3O1xuICAgIHZhciBvZmZzZXQ7XG5cblxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyNhcnJheVxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnbW9kdWxlJykgJiYgZi5zZWN0aW9uX2RlZmluZWQoJ2FycmF5JykgKXtcbiAgICAgICAgZC5zZWN0aW9uKCdhcnJheScpO1xuXG5cbiAgICAgICAgeCA9IGxvYy5hcnJheS5yaWdodCAtIHNpemUuc3RyaW5nLnc7XG4gICAgICAgIHkgPSBsb2MuYXJyYXkudXBwZXI7XG4gICAgICAgIC8veSAtPSBzaXplLnN0cmluZy5oLzI7XG5cblxuICAgICAgICAvL2ZvciggdmFyIGk9MDsgaTxzeXN0ZW0uREMuc3RyaW5nX251bTsgaSsrICkge1xuICAgICAgICBmb3IoIHZhciBpIGluIF8ucmFuZ2Uoc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzKSkge1xuICAgICAgICAgICAgLy92YXIgb2Zmc2V0ID0gaSAqIHNpemUud2lyZV9vZmZzZXQuYmFzZVxuICAgICAgICAgICAgdmFyIG9mZnNldF93aXJlID0gc2l6ZS53aXJlX29mZnNldC5taW4gKyAoIHNpemUud2lyZV9vZmZzZXQuYmFzZSAqIGkgKTtcblxuICAgICAgICAgICAgZC5ibG9jaygnc3RyaW5nJywgW3gseV0pO1xuICAgICAgICAgICAgLy8gcG9zaXRpdmUgaG9tZSBydW5cbiAgICAgICAgICAgIGQubGF5ZXIoJ0RDX3BvcycpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHggLCBsb2MuYXJyYXkudXBwZXIgXSxcbiAgICAgICAgICAgICAgICBbIHggLCBsb2MuYXJyYXkudXBwZXItb2Zmc2V0X3dpcmUgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtvZmZzZXRfd2lyZSAsIGxvYy5hcnJheS51cHBlci1vZmZzZXRfd2lyZSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K29mZnNldF93aXJlICwgbG9jLmpiX2JveC55LW9mZnNldF93aXJlXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5qYl9ib3gueCAsIGxvYy5qYl9ib3gueS1vZmZzZXRfd2lyZV0sXG4gICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgLy8gbmVnYXRpdmUgaG9tZSBydW5cbiAgICAgICAgICAgIGQubGF5ZXIoJ0RDX25lZycpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHggLCBsb2MuYXJyYXkubG93ZXIgXSxcbiAgICAgICAgICAgICAgICBbIHggLCBsb2MuYXJyYXkubG93ZXJfbGltaXQrb2Zmc2V0X3dpcmUgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtvZmZzZXRfd2lyZSAsIGxvYy5hcnJheS5sb3dlcl9saW1pdCtvZmZzZXRfd2lyZSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K29mZnNldF93aXJlICwgbG9jLmpiX2JveC55K29mZnNldF93aXJlXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5qYl9ib3gueCAsIGxvYy5qYl9ib3gueStvZmZzZXRfd2lyZV0sXG4gICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgeCAtPSBzaXplLnN0cmluZy53O1xuICAgICAgICB9XG5cbiAgICAvLyAgICBkLnJlY3QoXG4gICAgLy8gICAgICAgIFsgKGxvYy5hcnJheS5yaWdodCtsb2MuYXJyYXkubGVmdCkvMiwgKGxvYy5hcnJheS5sb3dlcitsb2MuYXJyYXkudXBwZXIpLzIgXSxcbiAgICAvLyAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQtbG9jLmFycmF5LmxlZnQsIGxvYy5hcnJheS5sb3dlci1sb2MuYXJyYXkudXBwZXIgXSxcbiAgICAvLyAgICAgICAgJ0RDX3BvcycpO1xuICAgIC8vXG5cbiAgICAgICAgZC5sYXllcignRENfZ3JvdW5kJyk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAvL1sgbG9jLmFycmF5LmxlZnQgLCBsb2MuYXJyYXkubG93ZXIgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICAgICAgWyBsb2MuYXJyYXkubGVmdCwgbG9jLmFycmF5Lmxvd2VyX2xpbWl0ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kICwgbG9jLmFycmF5Lmxvd2VyX2xpbWl0ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kICwgbG9jLmpiX2JveC55ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmRdLFxuICAgICAgICAgICAgWyBsb2MuamJfYm94LnggLCBsb2MuamJfYm94Lnkrc2l6ZS53aXJlX29mZnNldC5ncm91bmRdLFxuICAgICAgICBdKTtcblxuICAgICAgICBkLmxheWVyKCk7XG5cblxuICAgIH0vLyBlbHNlIHsgY29uc29sZS5sb2coXCJEcmF3aW5nOiBhcnJheSBub3QgcmVhZHlcIil9XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIGNvbWJpbmVyIGJveFxuXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdEQycpICl7XG5cbiAgICAgICAgZC5zZWN0aW9uKFwiY29tYmluZXJcIik7XG5cbiAgICAgICAgeCA9IGxvYy5qYl9ib3gueDtcbiAgICAgICAgeSA9IGxvYy5qYl9ib3gueTtcblxuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbeCx5XSxcbiAgICAgICAgICAgIFtzaXplLmpiX2JveC53LHNpemUuamJfYm94LmhdLFxuICAgICAgICAgICAgJ2JveCdcbiAgICAgICAgKTtcblxuXG4gICAgICAgIGZvciggaSBpbiBfLnJhbmdlKHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncykpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IHNpemUud2lyZV9vZmZzZXQubWluICsgKCBzaXplLndpcmVfb2Zmc2V0LmJhc2UgKiBpICk7XG5cbiAgICAgICAgICAgIGQubGF5ZXIoJ0RDX3BvcycpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHggLCB5LW9mZnNldF0sXG4gICAgICAgICAgICAgICAgWyB4ICwgeS1vZmZzZXRdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgICAgICB5OiB5LW9mZnNldCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHggLCB5LW9mZnNldF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54LW9mZnNldCAsIHktb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngtb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbV0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54LW9mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICAgICAgeDogbG9jLmRpc2Nib3gueC1vZmZzZXQsXG4gICAgICAgICAgICAgICAgeTogbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGQubGF5ZXIoJ0RDX25lZycpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHgsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIHgtc2l6ZS5mdXNlLncvMiAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgZC5ibG9jayggJ2Z1c2UnLCB7XG4gICAgICAgICAgICAgICAgeDogeCAsXG4gICAgICAgICAgICAgICAgeTogeStvZmZzZXQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4K3NpemUuZnVzZS53LzIgLCB5K29mZnNldF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbV0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICAgICAgeDogbG9jLmRpc2Nib3gueCtvZmZzZXQsXG4gICAgICAgICAgICAgICAgeTogbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkLmxheWVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2QubGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgICAgICAvL2QubGluZShbXG4gICAgICAgIC8vICAgIFsgbG9jLmFycmF5LmxlZnQgLCBsb2MuYXJyYXkubG93ZXIgKyBzaXplLm1vZHVsZS53ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgLy8gICAgWyBsb2MuYXJyYXkucmlnaHQrc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLCBsb2MuYXJyYXkubG93ZXIgKyBzaXplLm1vZHVsZS53ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgLy8gICAgWyBsb2MuYXJyYXkucmlnaHQrc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLCBsb2MuYXJyYXkueSArIHNpemUubW9kdWxlLncgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZF0sXG4gICAgICAgIC8vICAgIFsgbG9jLmFycmF5LnggLCBsb2MuYXJyYXkueStzaXplLm1vZHVsZS53K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAgICAgLy9dKTtcblxuICAgICAgICAvL2QubGF5ZXIoKTtcblxuICAgICAgICAvLyBHcm91bmRcbiAgICAgICAgLy9vZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0LmdhcCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kO1xuICAgICAgICBvZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZDtcblxuICAgICAgICBkLmxheWVyKCdEQ19ncm91bmQnKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFsgeCAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgIFsgeCAsIHkrb2Zmc2V0XSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5K29mZnNldCxcbiAgICAgICAgfSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbIHggLCB5K29mZnNldF0sXG4gICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgeStvZmZzZXRdLFxuICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW1dLFxuICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgeDogbG9jLmRpc2Nib3gueCtvZmZzZXQsXG4gICAgICAgICAgICB5OiBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtXG4gICAgICAgIH0pO1xuICAgICAgICBkLmxheWVyKCk7XG5cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgLy8gREMgZGlzY29uZWN0XG4gICAgICAgIGQuc2VjdGlvbihcIkRDIGRpY29uZWN0XCIpO1xuXG5cbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW2xvYy5kaXNjYm94LngsIGxvYy5kaXNjYm94LnldLFxuICAgICAgICAgICAgW3NpemUuZGlzY2JveC53LHNpemUuZGlzY2JveC5oXSxcbiAgICAgICAgICAgICdib3gnXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gREMgZGlzY29uZWN0IGNvbWJpbmVyIGQubGluZXNcblxuICAgICAgICB4ID0gbG9jLmRpc2Nib3gueDtcbiAgICAgICAgeSA9IGxvYy5kaXNjYm94LnkgKyBzaXplLmRpc2Nib3guaC8yO1xuXG4gICAgICAgIGlmKCBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgPiAxKXtcbiAgICAgICAgICAgIHZhciBvZmZzZXRfbWluID0gc2l6ZS53aXJlX29mZnNldC5taW47XG4gICAgICAgICAgICB2YXIgb2Zmc2V0X21heCA9IHNpemUud2lyZV9vZmZzZXQubWluICsgKCAoc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzIC0xKSAqIHNpemUud2lyZV9vZmZzZXQuYmFzZSApO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHgtb2Zmc2V0X21pbiwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgICAgIFsgeC1vZmZzZXRfbWF4LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBdLCAnRENfcG9zJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCtvZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICAgICAgWyB4K29mZnNldF9tYXgsIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIF0sICdEQ19uZWcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEludmVydGVyIGNvbmVjdGlvblxuICAgICAgICAvL2QubGluZShbXG4gICAgICAgIC8vICAgIFsgeC1vZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgIC8vICAgIFsgeC1vZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgIC8vXSwnRENfcG9zJyk7XG5cbiAgICAgICAgLy9vZmZzZXQgPSBvZmZzZXRfbWF4IC0gb2Zmc2V0X21pbjtcbiAgICAgICAgb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5taW47XG5cbiAgICAgICAgLy8gbmVnXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbIHgrb2Zmc2V0LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBbIHgrb2Zmc2V0LCBsb2MuaW52ZXJ0ZXIueStzaXplLmludmVydGVyLmgvMi1zaXplLnRlcm1pbmFsX2RpYW0gXSxcbiAgICAgICAgXSwnRENfbmVnJyk7XG4gICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgIHg6IHgrb2Zmc2V0LFxuICAgICAgICAgICAgeTogbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBwb3NcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFsgeC1vZmZzZXQsIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIFsgeC1vZmZzZXQsIGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSBdLFxuICAgICAgICBdLCdEQ19wb3MnKTtcbiAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgeDogeC1vZmZzZXQsXG4gICAgICAgICAgICB5OiBsb2MuaW52ZXJ0ZXIueStzaXplLmludmVydGVyLmgvMi1zaXplLnRlcm1pbmFsX2RpYW0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGdyb3VuZFxuICAgICAgICAvL29mZnNldCA9IHNpemUud2lyZV9vZmZzZXQuZ2FwICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQ7XG4gICAgICAgIG9mZnNldCA9IHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgWyB4K29mZnNldCwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgWyB4K29mZnNldCwgbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtIF0sXG4gICAgICAgIF0sJ0RDX2dyb3VuZCcpO1xuICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICB4OiB4K29mZnNldCxcbiAgICAgICAgICAgIHk6IGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSxcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vI2ludmVydGVyXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdpbnZlcnRlcicpICl7XG5cbiAgICAgICAgZC5zZWN0aW9uKFwiaW52ZXJ0ZXJcIik7XG5cblxuICAgICAgICB4ID0gbG9jLmludmVydGVyLng7XG4gICAgICAgIHkgPSBsb2MuaW52ZXJ0ZXIueTtcblxuXG4gICAgICAgIC8vZnJhbWVcbiAgICAgICAgZC5sYXllcignYm94Jyk7XG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFt4LHldLFxuICAgICAgICAgICAgW3NpemUuaW52ZXJ0ZXIudywgc2l6ZS5pbnZlcnRlci5oXVxuICAgICAgICApO1xuICAgICAgICAvLyBMYWJlbCBhdCB0b3AgKEludmVydGVyLCBtYWtlLCBtb2RlbCwgLi4uKVxuICAgICAgICBkLmxheWVyKCd0ZXh0Jyk7XG4gICAgICAgIGQudGV4dChcbiAgICAgICAgICAgIFtsb2MuaW52ZXJ0ZXIueCwgbG9jLmludmVydGVyLnRvcCArIHNpemUuaW52ZXJ0ZXIudGV4dF9nYXAgXSxcbiAgICAgICAgICAgIFsgJ0ludmVydGVyJywgc2V0dGluZ3Muc3lzdGVtLmludmVydGVyLm1ha2UgKyBcIiBcIiArIHNldHRpbmdzLnN5c3RlbS5pbnZlcnRlci5tb2RlbCBdLFxuICAgICAgICAgICAgJ2xhYmVsJ1xuICAgICAgICApO1xuICAgICAgICBkLmxheWVyKCk7XG5cbiAgICAvLyNpbnZlcnRlciBzeW1ib2xcbiAgICAgICAgZC5zZWN0aW9uKFwiaW52ZXJ0ZXIgc3ltYm9sXCIpO1xuXG4gICAgICAgIHggPSBsb2MuaW52ZXJ0ZXIueDtcbiAgICAgICAgeSA9IGxvYy5pbnZlcnRlci55O1xuXG4gICAgICAgIHcgPSBzaXplLmludmVydGVyLnN5bWJvbF93O1xuICAgICAgICBoID0gc2l6ZS5pbnZlcnRlci5zeW1ib2xfaDtcblxuICAgICAgICB2YXIgc3BhY2UgPSB3KjEvMTI7XG5cbiAgICAgICAgLy8gSW52ZXJ0ZXIgc3ltYm9sXG4gICAgICAgIGQubGF5ZXIoJ2JveCcpO1xuXG4gICAgICAgIC8vIGJveFxuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbeCx5XSxcbiAgICAgICAgICAgIFt3LCBoXVxuICAgICAgICApO1xuICAgICAgICAvLyBkaWFnYW5hbFxuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3gtdy8yLCB5K2gvMl0sXG4gICAgICAgICAgICBbeCt3LzIsIHktaC8yXSxcblxuICAgICAgICBdKTtcbiAgICAgICAgLy8gRENcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UsXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlXSxcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNixcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2VdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UsXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlKjJdLFxuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSoyLFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlKjMsXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlKjJdLFxuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSo0LFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlKjUsXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlKjJdLFxuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSo2LFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgXSk7XG5cbiAgICAgICAgLy8gQUNcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4ICsgdy8yIC0gc3BhY2UsXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjIsXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSozLFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSo0LFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqNSxcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqNixcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQubGF5ZXIoKTtcblxuXG5cblxuXG4gICAgfVxuXG5cblxuXG5cbi8vI0FDX2Rpc2Njb25lY3RcbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ0FDJykgKXtcbiAgICAgICAgZC5zZWN0aW9uKFwiQUNfZGlzY2NvbmVjdFwiKTtcblxuICAgICAgICB4ID0gbG9jLkFDX2Rpc2MueDtcbiAgICAgICAgeSA9IGxvYy5BQ19kaXNjLnk7XG4gICAgICAgIHBhZGRpbmcgPSBzaXplLnRlcm1pbmFsX2RpYW07XG5cbiAgICAgICAgZC5sYXllcignYm94Jyk7XG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFt4LCB5XSxcbiAgICAgICAgICAgIFtzaXplLkFDX2Rpc2Mudywgc2l6ZS5BQ19kaXNjLmhdXG4gICAgICAgICk7XG4gICAgICAgIGQubGF5ZXIoKTtcblxuXG4gICAgLy9kLmNpcmMoW3gseV0sNSk7XG5cblxuXG4gICAgLy8jQUMgbG9hZCBjZW50ZXJcbiAgICAgICAgZC5zZWN0aW9uKFwiQUMgbG9hZCBjZW50ZXJcIik7XG5cbiAgICAgICAgdmFyIGJyZWFrZXJfc3BhY2luZyA9IHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5zcGFjaW5nO1xuXG4gICAgICAgIHggPSBsb2MuQUNfbG9hZGNlbnRlci54O1xuICAgICAgICB5ID0gbG9jLkFDX2xvYWRjZW50ZXIueTtcbiAgICAgICAgdyA9IHNpemUuQUNfbG9hZGNlbnRlci53O1xuICAgICAgICBoID0gc2l6ZS5BQ19sb2FkY2VudGVyLmg7XG5cbiAgICAgICAgZC5yZWN0KFt4LHldLFxuICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAnYm94J1xuICAgICAgICApO1xuXG4gICAgICAgIGQudGV4dChbeCx5LWgqMC40XSxcbiAgICAgICAgICAgIFtzeXN0ZW0uQUMubG9hZGNlbnRlcl90eXBlcywgJ0xvYWQgQ2VudGVyJ10sXG4gICAgICAgICAgICAnbGFiZWwnLFxuICAgICAgICAgICAgJ3RleHQnXG4gICAgICAgICk7XG4gICAgICAgIHcgPSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci53O1xuICAgICAgICBoID0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIuaDtcblxuICAgICAgICBwYWRkaW5nID0gbG9jLkFDX2xvYWRjZW50ZXIueCAtIGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLmxlZnQgLSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci53O1xuXG4gICAgICAgIHkgPSBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy50b3A7XG4gICAgICAgIHkgKz0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnNwYWNpbmcvMjtcbiAgICAgICAgZm9yKCB2YXIgaT0wOyBpPHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5udW07IGkrKyl7XG4gICAgICAgICAgICBkLnJlY3QoW3gtcGFkZGluZy13LzIseV0sW3csaF0sJ2JveCcpO1xuICAgICAgICAgICAgZC5yZWN0KFt4K3BhZGRpbmcrdy8yLHldLFt3LGhdLCdib3gnKTtcbiAgICAgICAgICAgIHkgKz0gYnJlYWtlcl9zcGFjaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHMsIGw7XG5cbiAgICAgICAgbCA9IGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXI7XG4gICAgICAgIHMgPSBzaXplLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhcjtcbiAgICAgICAgZC5yZWN0KFtsLngsbC55XSwgW3MudyxzLmhdLCAnQUNfbmV1dHJhbCcgKTtcblxuICAgICAgICBsID0gbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyO1xuICAgICAgICBzID0gc2l6ZS5BQ19sb2FkY2VudGVyLmdyb3VuZGJhcjtcbiAgICAgICAgZC5yZWN0KFtsLngsbC55XSwgW3MudyxzLmhdLCAnQUNfZ3JvdW5kJyApO1xuXG4gICAgICAgIGQuYmxvY2soJ2dyb3VuZCcsIFtsLngsbC55K3MuaC8yXSk7XG5cblxuXG4gICAgLy8gQUMgZC5saW5lc1xuICAgICAgICBkLnNlY3Rpb24oXCJBQyBkLmxpbmVzXCIpO1xuXG4gICAgICAgIHggPSBsb2MuaW52ZXJ0ZXIuYm90dG9tX3JpZ2h0Lng7XG4gICAgICAgIHkgPSBsb2MuaW52ZXJ0ZXIuYm90dG9tX3JpZ2h0Lnk7XG4gICAgICAgIHggLT0gc2l6ZS50ZXJtaW5hbF9kaWFtICogKHN5c3RlbS5BQy5udW1fY29uZHVjdG9ycysxKTtcbiAgICAgICAgeSAtPSBzaXplLnRlcm1pbmFsX2RpYW07XG5cbiAgICAgICAgdmFyIGNvbmR1aXRfeSA9IGxvYy5BQ19jb25kdWl0Lnk7XG4gICAgICAgIHBhZGRpbmcgPSBzaXplLnRlcm1pbmFsX2RpYW07XG4gICAgICAgIC8vdmFyIEFDX2QubGF5ZXJfbmFtZXMgPSBbJ0FDX2dyb3VuZCcsICdBQ19uZXV0cmFsJywgJ0FDX0wxJywgJ0FDX0wyJywgJ0FDX0wyJ107XG5cbiAgICAgICAgZm9yKCB2YXIgaT0wOyBpIDwgc3lzdGVtLkFDLm51bV9jb25kdWN0b3JzOyBpKysgKXtcbiAgICAgICAgICAgIGQuYmxvY2soJ3Rlcm1pbmFsJywgW3gseV0gKTtcbiAgICAgICAgICAgIGQubGF5ZXIoJ0FDXycrc3lzdGVtLkFDLmNvbmR1Y3RvcnNbaV0pO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbeCwgeV0sXG4gICAgICAgICAgICAgICAgW3gsIGxvYy5BQ19kaXNjLmJvdHRvbSAtIHBhZGRpbmcqMiAtIHBhZGRpbmcqaSAgXSxcbiAgICAgICAgICAgICAgICBbbG9jLkFDX2Rpc2MubGVmdCwgbG9jLkFDX2Rpc2MuYm90dG9tIC0gcGFkZGluZyoyIC0gcGFkZGluZyppIF0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIHggKz0gc2l6ZS50ZXJtaW5hbF9kaWFtO1xuICAgICAgICB9XG4gICAgICAgIGQubGF5ZXIoKTtcblxuICAgICAgICB4ID0gbG9jLkFDX2Rpc2MueDtcbiAgICAgICAgeSA9IGxvYy5BQ19kaXNjLnkgKyBzaXplLkFDX2Rpc2MuaC8yO1xuICAgICAgICB5IC09IHBhZGRpbmcqMjtcblxuICAgICAgICBpZiggc3lzdGVtLkFDLmNvbmR1Y3RvcnMuaW5kZXhPZignZ3JvdW5kJykrMSApIHtcbiAgICAgICAgICAgIGQubGF5ZXIoJ0FDX2dyb3VuZCcpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHgtc2l6ZS5BQ19kaXNjLncvMiwgeSBdLFxuICAgICAgICAgICAgICAgIFsgeCtzaXplLkFDX2Rpc2Mudy8yK3BhZGRpbmcqMiwgeSBdLFxuICAgICAgICAgICAgICAgIFsgeCtzaXplLkFDX2Rpc2Mudy8yK3BhZGRpbmcqMiwgY29uZHVpdF95ICsgYnJlYWtlcl9zcGFjaW5nKjIgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLmxlZnQrcGFkZGluZyoyLCBjb25kdWl0X3kgKyBicmVha2VyX3NwYWNpbmcqMiBdLFxuICAgICAgICAgICAgICAgIC8vWyBsb2MuQUNfbG9hZGNlbnRlci5sZWZ0K3BhZGRpbmcqMiwgeSBdLFxuICAgICAgICAgICAgICAgIC8vWyBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueC1wYWRkaW5nLCB5IF0sXG4gICAgICAgICAgICAgICAgLy9bIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci54LXBhZGRpbmcsIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci55K3NpemUuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIuaC8yIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5sZWZ0K3BhZGRpbmcqMiwgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLnkgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci54LXNpemUuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIudy8yLCBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueSBdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggc3lzdGVtLkFDLmNvbmR1Y3RvcnMuaW5kZXhPZignbmV1dHJhbCcpKzEgKSB7XG4gICAgICAgICAgICB5IC09IHBhZGRpbmc7XG4gICAgICAgICAgICBkLmxheWVyKCdBQ19uZXV0cmFsJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeC1zaXplLkFDX2Rpc2Mudy8yLCB5IF0sXG4gICAgICAgICAgICAgICAgWyB4K3BhZGRpbmcqMyoyLCB5IF0sXG4gICAgICAgICAgICAgICAgWyB4K3BhZGRpbmcqMyoyLCBjb25kdWl0X3kgKyBicmVha2VyX3NwYWNpbmcqMSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhci54LCBjb25kdWl0X3kgKyBicmVha2VyX3NwYWNpbmcqMSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhci54LFxuICAgICAgICAgICAgICAgICAgICBsb2MuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyLnktc2l6ZS5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIuaC8yIF0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuXG5cblxuICAgICAgICBmb3IoIHZhciBpPTE7IGkgPD0gMzsgaSsrICkge1xuICAgICAgICAgICAgaWYoIHN5c3RlbS5BQy5jb25kdWN0b3JzLmluZGV4T2YoJ0wnK2kpKzEgKSB7XG4gICAgICAgICAgICAgICAgeSAtPSBwYWRkaW5nO1xuICAgICAgICAgICAgICAgIGQubGF5ZXIoJ0FDX0wnK2kpO1xuICAgICAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFsgeC1zaXplLkFDX2Rpc2Mudy8yLCB5IF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeCtwYWRkaW5nKjMqKDItaSksIHkgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB4K3BhZGRpbmcqMyooMi1pKSwgbG9jLkFDX2Rpc2Muc3dpdGNoX2JvdHRvbSBdLFxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIGQuYmxvY2soJ3Rlcm1pbmFsJywgWyB4LXBhZGRpbmcqKGktMikqMywgbG9jLkFDX2Rpc2Muc3dpdGNoX2JvdHRvbSBdICk7XG4gICAgICAgICAgICAgICAgZC5ibG9jaygndGVybWluYWwnLCBbIHgtcGFkZGluZyooaS0yKSozLCBsb2MuQUNfZGlzYy5zd2l0Y2hfdG9wIF0gKTtcbiAgICAgICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbIHgtcGFkZGluZyooaS0yKSozLCBsb2MuQUNfZGlzYy5zd2l0Y2hfdG9wIF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeC1wYWRkaW5nKihpLTIpKjMsIGNvbmR1aXRfeS1icmVha2VyX3NwYWNpbmcqKGktMSkgXSxcbiAgICAgICAgICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy5sZWZ0LCBjb25kdWl0X3ktYnJlYWtlcl9zcGFjaW5nKihpLTEpIF0sXG4gICAgICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG5cblxuXG4vLyBXaXJlIHRhYmxlXG4gICAgZC5zZWN0aW9uKFwiV2lyZSB0YWJsZVwiKTtcblxuLy8vKlxuXG4gICAgeCA9IGxvYy53aXJlX3RhYmxlLng7XG4gICAgeSA9IGxvYy53aXJlX3RhYmxlLnk7XG5cbiAgICBpZiggc3lzdGVtLkFDLm51bV9jb25kdWN0b3JzICkge1xuICAgICAgICB2YXIgbl9yb3dzID0gMiArIHN5c3RlbS5BQy5udW1fY29uZHVjdG9ycztcbiAgICAgICAgdmFyIG5fY29scyA9IDY7XG4gICAgICAgIHZhciByb3dfaGVpZ2h0ID0gMTU7XG4gICAgICAgIHZhciBjb2x1bW5fd2lkdGggPSB7XG4gICAgICAgICAgICBudW1iZXI6IDI1LFxuICAgICAgICAgICAgY29uZHVjdG9yOiA1MCxcbiAgICAgICAgICAgIHdpcmVfZ2F1Z2U6IDI1LFxuICAgICAgICAgICAgd2lyZV90eXBlOiA3NSxcbiAgICAgICAgICAgIGNvbmR1aXRfc2l6ZTogMzUsXG4gICAgICAgICAgICBjb25kdWl0X3R5cGU6IDc1LFxuICAgICAgICB9O1xuXG4gICAgICAgIGggPSBuX3Jvd3Mqcm93X2hlaWdodDtcblxuICAgICAgICB2YXIgdCA9IGQudGFibGUobl9yb3dzLG5fY29scykubG9jKHgseSk7XG4gICAgICAgIHQucm93X3NpemUoJ2FsbCcsIHJvd19oZWlnaHQpXG4gICAgICAgICAgICAuY29sX3NpemUoMSwgY29sdW1uX3dpZHRoLm51bWJlcilcbiAgICAgICAgICAgIC5jb2xfc2l6ZSgyLCBjb2x1bW5fd2lkdGguY29uZHVjdG9yKVxuICAgICAgICAgICAgLmNvbF9zaXplKDMsIGNvbHVtbl93aWR0aC53aXJlX2dhdWdlKVxuICAgICAgICAgICAgLmNvbF9zaXplKDQsIGNvbHVtbl93aWR0aC53aXJlX3R5cGUpXG4gICAgICAgICAgICAuY29sX3NpemUoNSwgY29sdW1uX3dpZHRoLmNvbmR1aXRfc2l6ZSlcbiAgICAgICAgICAgIC5jb2xfc2l6ZSg2LCBjb2x1bW5fd2lkdGguY29uZHVpdF90eXBlKTtcblxuICAgICAgICB0LmFsbF9jZWxscygpLmZvckVhY2goZnVuY3Rpb24oY2VsbCl7XG4gICAgICAgICAgICBjZWxsLmZvbnQoJ3RhYmxlJykuYm9yZGVyKCdhbGwnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHQuY2VsbCgxLDEpLmJvcmRlcignQicsIGZhbHNlKTtcbiAgICAgICAgdC5jZWxsKDEsMykuYm9yZGVyKCdSJywgZmFsc2UpO1xuICAgICAgICB0LmNlbGwoMSw1KS5ib3JkZXIoJ1InLCBmYWxzZSk7XG5cbiAgICAgICAgdC5jZWxsKDEsMykuZm9udCgndGFibGVfbGVmdCcpLnRleHQoJ1dpcmUnKTtcbiAgICAgICAgdC5jZWxsKDEsNSkuZm9udCgndGFibGVfbGVmdCcpLnRleHQoJ0NvbmR1aXQnKTtcblxuICAgICAgICB0LmNlbGwoMiwzKS5mb250KCd0YWJsZScpLnRleHQoJ0NvbmR1Y3RvcnMnKTtcbiAgICAgICAgdC5jZWxsKDIsMykuZm9udCgndGFibGUnKS50ZXh0KCdBV0cnKTtcbiAgICAgICAgdC5jZWxsKDIsNCkuZm9udCgndGFibGUnKS50ZXh0KCdUeXBlJyk7XG4gICAgICAgIHQuY2VsbCgyLDUpLmZvbnQoJ3RhYmxlJykudGV4dCgnU2l6ZScpO1xuICAgICAgICB0LmNlbGwoMiw2KS5mb250KCd0YWJsZScpLnRleHQoJ1R5cGUnKTtcblxuICAgICAgICBmb3IoIGk9MTsgaTw9c3lzdGVtLkFDLm51bV9jb25kdWN0b3JzOyBpKyspe1xuICAgICAgICAgICAgdC5jZWxsKDIraSwxKS5mb250KCd0YWJsZScpLnRleHQoaS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIHQuY2VsbCgyK2ksMikuZm9udCgndGFibGVfbGVmdCcpLnRleHQoIGYucHJldHR5X3dvcmQoc2V0dGluZ3Muc3lzdGVtLkFDLmNvbmR1Y3RvcnNbaS0xXSkgKTtcblxuICAgICAgICB9XG5cblxuICAgICAgICAvL2QudGV4dCggW3grdy8yLCB5LXJvd19oZWlnaHRdLCBmLnByZXR0eV9uYW1lKHNlY3Rpb25fbmFtZSksJ3RhYmxlJyApO1xuXG5cbiAgICAgICAgdC5taygpO1xuXG4gICAgfVxuXG4vLyovXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4vLyB2b2x0YWdlIGRyb3BcbiAgICBkLnNlY3Rpb24oXCJ2b2x0YWdlIGRyb3BcIik7XG5cblxuICAgIHggPSBsb2Mudm9sdF9kcm9wX3RhYmxlLng7XG4gICAgeSA9IGxvYy52b2x0X2Ryb3BfdGFibGUueTtcbiAgICB3ID0gc2l6ZS52b2x0X2Ryb3BfdGFibGUudztcbiAgICBoID0gc2l6ZS52b2x0X2Ryb3BfdGFibGUuaDtcblxuICAgIGQubGF5ZXIoJ3RhYmxlJyk7XG4gICAgZC5yZWN0KCBbeCx5XSwgW3csaF0gKTtcblxuICAgIHkgLT0gaC8yO1xuICAgIHkgKz0gMTA7XG5cbiAgICBkLnRleHQoIFt4LHldLCAnVm9sdGFnZSBEcm9wJywgJ3RhYmxlJywgJ3RleHQnKTtcblxuXG4vLyBnZW5lcmFsIG5vdGVzXG4gICAgZC5zZWN0aW9uKFwiZ2VuZXJhbCBub3Rlc1wiKTtcblxuICAgIHggPSBsb2MuZ2VuZXJhbF9ub3Rlcy54O1xuICAgIHkgPSBsb2MuZ2VuZXJhbF9ub3Rlcy55O1xuICAgIHcgPSBzaXplLmdlbmVyYWxfbm90ZXMudztcbiAgICBoID0gc2l6ZS5nZW5lcmFsX25vdGVzLmg7XG5cbiAgICBkLmxheWVyKCd0YWJsZScpO1xuICAgIGQucmVjdCggW3gseV0sIFt3LGhdICk7XG5cbiAgICB5IC09IGgvMjtcbiAgICB5ICs9IDEwO1xuXG4gICAgZC50ZXh0KCBbeCx5XSwgJ0dlbmVyYWwgTm90ZXMnLCAndGFibGUnLCAndGV4dCcpO1xuXG5cbiAgICBkLnNlY3Rpb24oKTtcblxuICAgIHJldHVybiBkLmRyYXdpbmdfcGFydHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuIiwidmFyIG1rX2RyYXdpbmcgPSByZXF1aXJlKCcuL21rX2RyYXdpbmcnKTtcbnZhciBta19ib3JkZXIgPSByZXF1aXJlKCcuL21rX2JvcmRlcicpO1xuXG52YXIgcGFnZSA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICBjb25zb2xlLmxvZyhcIioqIE1ha2luZyBwYWdlIDNcIik7XG4gICAgdmFyIGYgPSBzZXR0aW5ncy5mO1xuXG4gICAgZCA9IG1rX2RyYXdpbmcoKTtcblxuICAgIHZhciBzaGVldF9zZWN0aW9uID0gJ1BWJztcbiAgICB2YXIgc2hlZXRfbnVtID0gJzAyJztcbiAgICBkLmFwcGVuZChta19ib3JkZXIoc2V0dGluZ3MsIHNoZWV0X3NlY3Rpb24sIHNoZWV0X251bSApKTtcblxuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxvYztcblxuXG4gICAgZC50ZXh0KFxuICAgICAgICBbc2l6ZS5kcmF3aW5nLncvMiwgc2l6ZS5kcmF3aW5nLmgvMl0sXG4gICAgICAgICdDYWxjdWxhdGlvbiBTaGVldCcsXG4gICAgICAgICd0aXRsZTInXG4gICAgKTtcblxuXG4gICAgeCA9IHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nKjY7XG4gICAgeSA9IHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nKjYgKzIwO1xuXG4gICAgZC5sYXllcigndGFibGUnKTtcblxuXG4gICAgZm9yKCB2YXIgc2VjdGlvbl9uYW1lIGluIHNldHRpbmdzLnN5c3RlbSApe1xuICAgICAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoc2VjdGlvbl9uYW1lKSApe1xuICAgICAgICAgICAgdmFyIHNlY3Rpb24gPSBzZXR0aW5ncy5zeXN0ZW1bc2VjdGlvbl9uYW1lXTtcblxuICAgICAgICAgICAgdmFyIG4gPSBPYmplY3Qua2V5cyhzZWN0aW9uKS5sZW5ndGg7XG5cbiAgICAgICAgICAgIHZhciBuX3Jvd3MgPSBuKzA7XG4gICAgICAgICAgICB2YXIgbl9jb2xzID0gMjtcblxuICAgICAgICAgICAgdmFyIHJvd19oZWlnaHQgPSAxNTtcbiAgICAgICAgICAgIGggPSBuX3Jvd3Mqcm93X2hlaWdodDtcblxuXG4gICAgICAgICAgICB2YXIgdCA9IGQudGFibGUobl9yb3dzLG5fY29scykubG9jKHgseSk7XG4gICAgICAgICAgICB0LnJvd19zaXplKCdhbGwnLCByb3dfaGVpZ2h0KS5jb2xfc2l6ZSgxLCAxMDApLmNvbF9zaXplKDIsIDEyNSk7XG4gICAgICAgICAgICB3ID0gMTAwKzgwO1xuXG4gICAgICAgICAgICB2YXIgciA9IDE7XG4gICAgICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgICAgICBmb3IoIHZhciB2YWx1ZV9uYW1lIGluIHNlY3Rpb24gKXtcbiAgICAgICAgICAgICAgICB0LmNlbGwociwxKS50ZXh0KCBmLnByZXR0eV9uYW1lKHZhbHVlX25hbWUpICk7XG4gICAgICAgICAgICAgICAgaWYoICEgc2VjdGlvblt2YWx1ZV9uYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9ICctJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoIHNlY3Rpb25bdmFsdWVfbmFtZV0uY29uc3RydWN0b3IgPT09IEFycmF5ICl7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gc2VjdGlvblt2YWx1ZV9uYW1lXS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiggc2VjdGlvblt2YWx1ZV9uYW1lXS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICl7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gJyggKSc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKCBpc05hTihzZWN0aW9uW3ZhbHVlX25hbWVdKSApe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHNlY3Rpb25bdmFsdWVfbmFtZV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHNlY3Rpb25bdmFsdWVfbmFtZV0pLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHQuY2VsbChyLDIpLnRleHQoIHZhbHVlICk7XG4gICAgICAgICAgICAgICAgcisrO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGQudGV4dCggW3grdy8yLCB5LXJvd19oZWlnaHRdLCBmLnByZXR0eV9uYW1lKHNlY3Rpb25fbmFtZSksJ3RhYmxlJyApO1xuXG5cblxuXG4gICAgICAgICAgICB0LmFsbF9jZWxscygpLmZvckVhY2goZnVuY3Rpb24oY2VsbCl7XG4gICAgICAgICAgICAgICAgY2VsbC5mb250KCd0YWJsZScpLmJvcmRlcignYWxsJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdC5taygpO1xuXG4gICAgICAgICAgICAvLyovXG4gICAgICAgICAgICB5ICs9IGggKyAzMDtcblxuICAgICAgICAgICAgaWYoIHkgPiAoIGcuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcuaCAqIDAuOCApICkge1xuICAgICAgICAgICAgICAgIHkgPVxuICAgICAgICAgICAgICAgICAgICB5ID0gc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmcqNiArMjA7XG4gICAgICAgICAgICAgICAgICAgIHggKz0gdyoxLjU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnbm90IGRlZmluZWQ6ICcsIHNlY3Rpb25fbmFtZSwgc2VjdGlvbik7XG4gICAgICAgIH1cblxuXG5cblxuICAgIH1cblxuICAgIGQubGF5ZXIoKTtcblxuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xudmFyIG1rX2JvcmRlciA9IHJlcXVpcmUoJy4vbWtfYm9yZGVyJyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHBhZ2UgM1wiKTtcbiAgICB2YXIgZiA9IHNldHRpbmdzLmY7XG5cbiAgICBkID0gbWtfZHJhd2luZygpO1xuXG4gICAgdmFyIHNoZWV0X3NlY3Rpb24gPSAnUyc7XG4gICAgdmFyIHNoZWV0X251bSA9ICcwMSc7XG4gICAgZC5hcHBlbmQobWtfYm9yZGVyKHNldHRpbmdzLCBzaGVldF9zZWN0aW9uLCBzaGVldF9udW0gKSk7XG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG4gICAgdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ3Jvb2YnKSApe1xuXG5cblxuICAgICAgICB2YXIgeCwgeSwgaCwgdywgc2VjdGlvbl94LCBzZWN0aW9uX3ksIGxlbmd0aF9wLCBzY2FsZTtcblxuICAgICAgICB2YXIgc2xvcGUgPSBzeXN0ZW0ucm9vZi5zbG9wZS5zcGxpdCgnOicpWzBdO1xuICAgICAgICB2YXIgYW5nbGVfcmFkID0gTWF0aC5hdGFuKCBOdW1iZXIoc2xvcGUpIC8xMiApO1xuICAgICAgICAvL2FuZ2xlX3JhZCA9IGFuZ2xlICogKE1hdGguUEkvMTgwKTtcblxuXG4gICAgICAgIGxlbmd0aF9wID0gc3lzdGVtLnJvb2YubGVuZ3RoICogTWF0aC5jb3MoYW5nbGVfcmFkKTtcbiAgICAgICAgc3lzdGVtLnJvb2YuaGVpZ2h0ID0gc3lzdGVtLnJvb2YubGVuZ3RoICogTWF0aC5zaW4oYW5nbGVfcmFkKTtcblxuICAgICAgICB2YXIgcm9vZl9yYXRpbyA9IHN5c3RlbS5yb29mLmxlbmd0aCAvIHN5c3RlbS5yb29mLndpZHRoO1xuICAgICAgICB2YXIgcm9vZl9wbGFuX3JhdGlvID0gbGVuZ3RoX3AgLyBzeXN0ZW0ucm9vZi53aWR0aDtcblxuXG4gICAgICAgIGlmKCBzeXN0ZW0ucm9vZi50eXBlID09PSBcIkdhYmxlXCIpe1xuXG5cbiAgICAgICAgICAgIC8vLy8vLy9cbiAgICAgICAgICAgIC8vIFJvb2QgcGxhbiB2aWV3XG4gICAgICAgICAgICB2YXIgcGxhbl94ID0gNjA7XG4gICAgICAgICAgICB2YXIgcGxhbl95ID0gNjA7XG5cbiAgICAgICAgICAgIHZhciBwbGFuX3csIHBsYW5faDtcbiAgICAgICAgICAgIGlmKCBsZW5ndGhfcCoyID4gc3lzdGVtLnJvb2Yud2lkdGggKXtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDIwMC8obGVuZ3RoX3AqMik7XG4gICAgICAgICAgICAgICAgcGxhbl93ID0gKGxlbmd0aF9wKjIpICogc2NhbGU7XG4gICAgICAgICAgICAgICAgcGxhbl9oID0gcGxhbl93IC8gKGxlbmd0aF9wKjIgLyBzeXN0ZW0ucm9vZi53aWR0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNjYWxlID0gMzAwLyhzeXN0ZW0ucm9vZi53aWR0aCk7XG4gICAgICAgICAgICAgICAgcGxhbl9oID0gc3lzdGVtLnJvb2Yud2lkdGggKiBzY2FsZTtcbiAgICAgICAgICAgICAgICBwbGFuX3cgPSBwbGFuX2ggKiAobGVuZ3RoX3AqMiAvIHN5c3RlbS5yb29mLndpZHRoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feStwbGFuX2gvMl0sXG4gICAgICAgICAgICAgICAgW3BsYW5fdywgcGxhbl9oXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkLnBvbHkoW1xuICAgICAgICAgICAgICAgICAgICBbcGxhbl94ICAgICAgICwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95K3BsYW5faF0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3gsICAgICAgICBwbGFuX3krcGxhbl9oXSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCAgICAgICAsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3Vuc2VsZWN0ZWRcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQucG9seShbXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIgICAgICAgLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yK3BsYW5fdy8yLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yK3BsYW5fdy8yLCBwbGFuX3krcGxhbl9oXSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgICAgICAgIHBsYW5feStwbGFuX2hdLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yICAgICAgICwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX3BvbHlfc2VsZWN0ZWRcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95K3BsYW5faF1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtwbGFuX3gtMjAsIHBsYW5feStwbGFuX2gvMl0sXG4gICAgICAgICAgICAgICAgc3lzdGVtLnJvb2YubGVuZ3RoLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3crMjAsIHBsYW5feStwbGFuX2gvMl0sXG4gICAgICAgICAgICAgICAgc3lzdGVtLnJvb2Yud2lkdGgudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcblxuXG4gICAgICAgICAgICB4ID0gcGxhbl94ICsgMTIwO1xuICAgICAgICAgICAgeSA9IHBsYW5feSAtIDIwO1xuXG4gICAgICAgICAgICBkLmJsb2NrKCdub3J0aCBhcnJvd19sZWZ0JywgW3gseV0pO1xuXG5cbiAgICAgICAgICAgIC8vLy8vLy8vXG4gICAgICAgICAgICAvLyByb29mIGNyb3NzZWN0aW9uXG5cbiAgICAgICAgICAgIHZhciBjc194ID0gcGxhbl94O1xuICAgICAgICAgICAgdmFyIGNzX3kgPSBwbGFuX3kgKyBwbGFuX2ggKyA1MDtcbiAgICAgICAgICAgIHZhciBjc19oID0gc3lzdGVtLnJvb2YuaGVpZ2h0ICogc2NhbGU7XG4gICAgICAgICAgICB2YXIgY3NfdyA9IHBsYW5fdy8yO1xuXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3ldLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3krY3NfaF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3csICAgY3NfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3cqMiwgY3NfeStjc19oXSxcbiAgICAgICAgICAgICAgICAgICAgW2NzX3gsICAgICAgICBjc195K2NzX2hdLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3ldLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbY3NfeCtjc193LTE1LCBjc195K2NzX2gqMi8zXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi5oZWlnaHQgKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbY3NfeCtjc193KjEuNSsyMCwgY3NfeStjc19oLzNdLFxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHN5c3RlbS5yb29mLmxlbmd0aCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG5cblxuICAgICAgICAgICAgLy8vLy8vXG4gICAgICAgICAgICAvLyByb29mIGRldGFpbFxuXG4gICAgICAgICAgICB2YXIgZGV0YWlsX3ggPSAzMCs0MDA7XG4gICAgICAgICAgICB2YXIgZGV0YWlsX3kgPSAzMDtcblxuICAgICAgICAgICAgaWYoIE51bWJlcihzeXN0ZW0ucm9vZi53aWR0aCkgPj0gTnVtYmVyKHN5c3RlbS5yb29mLmxlbmd0aCkgKXtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDM1MC8oc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDM1MC8oc3lzdGVtLnJvb2YubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkZXRhaWxfdyA9IHN5c3RlbS5yb29mLndpZHRoICogc2NhbGU7XG4gICAgICAgICAgICB2YXIgZGV0YWlsX2ggPSBzeXN0ZW0ucm9vZi5sZW5ndGggKiBzY2FsZTtcblxuICAgICAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy8yLCBkZXRhaWxfeStkZXRhaWxfaC8yXSxcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3csIGRldGFpbF9oXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3NlbGVjdGVkX2ZyYW1lZFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB2YXIgYSA9IDM7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0X2EgPSBhICogc2NhbGU7XG5cbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCwgICBkZXRhaWxfeStvZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdywgICBkZXRhaWxfeStvZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCwgICAgICAgICAgZGV0YWlsX3krZGV0YWlsX2gtb2Zmc2V0X2FdLFxuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3csIGRldGFpbF95K2RldGFpbF9oLW9mZnNldF9hXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K29mZnNldF9hLCBkZXRhaWxfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtvZmZzZXRfYSwgZGV0YWlsX3krZGV0YWlsX2hdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3ctb2Zmc2V0X2EsIGRldGFpbF95XSxcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LW9mZnNldF9hLCBkZXRhaWxfeStkZXRhaWxfaF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeC00MCwgZGV0YWlsX3krZGV0YWlsX2gvMl0sXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggc3lzdGVtLnJvb2YubGVuZ3RoICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LzIsIGRldGFpbF95K2RldGFpbF9oKzQwXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi53aWR0aCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94KyAob2Zmc2V0X2EpLzIsIGRldGFpbF95K2RldGFpbF9oKzE1XSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LShvZmZzZXRfYSkvMiwgZGV0YWlsX3krZGV0YWlsX2grMTVdLFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3gtMTUsIGRldGFpbF95K2RldGFpbF9oLShvZmZzZXRfYSkvMl0sXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeC0xNSwgZGV0YWlsX3krKG9mZnNldF9hKS8yXSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHggPSBkZXRhaWxfeCArIGRldGFpbF93ICsgMjU7XG4gICAgICAgICAgICB5ID0gZGV0YWlsX3kgKyAxMjA7XG5cbiAgICAgICAgICAgIGQuYmxvY2soJ25vcnRoIGFycm93X3VwJywgW3gseV0pO1xuXG5cblxuICAgICAgICAgICAgLy8vLy8vXG4gICAgICAgICAgICAvLyBNb2R1bGUgb3B0aW9uc1xuICAgICAgICAgICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdtb2R1bGUnKSAmJiBmLnNlY3Rpb25fZGVmaW5lZCgnYXJyYXknKSl7XG4gICAgICAgICAgICAgICAgdmFyIHIsYztcblxuICAgICAgICAgICAgICAgIHZhciByb29mX2xlbmd0aF9hdmFpbCA9IHN5c3RlbS5yb29mLmxlbmd0aCAtIChhKjIpO1xuICAgICAgICAgICAgICAgIHZhciByb29mX3dpZHRoX2F2YWlsID0gc3lzdGVtLnJvb2Yud2lkdGggLSAoYSoyKTtcblxuICAgICAgICAgICAgICAgIHZhciByb3dfc3BhY2luZztcbiAgICAgICAgICAgICAgICBpZiggc3lzdGVtLm1vZHVsZS5vcmllbnRhdGlvbiA9PT0gJ1BvcnRyYWl0JyApe1xuICAgICAgICAgICAgICAgICAgICByb3dfc3BhY2luZyA9IE51bWJlcihzeXN0ZW0ubW9kdWxlLmxlbmd0aCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBjb2xfc3BhY2luZyA9IE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV93ID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSAgKS8xMjtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlX2ggPSAoTnVtYmVyKHN5c3RlbS5tb2R1bGUubGVuZ3RoKSApLzEyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd19zcGFjaW5nID0gTnVtYmVyKHN5c3RlbS5tb2R1bGUud2lkdGgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgY29sX3NwYWNpbmcgPSBOdW1iZXIoc3lzdGVtLm1vZHVsZS5sZW5ndGgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlX3cgPSAoTnVtYmVyKHN5c3RlbS5tb2R1bGUubGVuZ3RoKSkvMTI7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV9oID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSApLzEyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJvd19zcGFjaW5nID0gcm93X3NwYWNpbmcvMTI7IC8vbW9kdWxlIGRpbWVudGlvbnMgYXJlIGluIGluY2hlc1xuICAgICAgICAgICAgICAgIGNvbF9zcGFjaW5nID0gY29sX3NwYWNpbmcvMTI7IC8vbW9kdWxlIGRpbWVudGlvbnMgYXJlIGluIGluY2hlc1xuXG4gICAgICAgICAgICAgICAgdmFyIG51bV9yb3dzID0gTWF0aC5mbG9vcihyb29mX2xlbmd0aF9hdmFpbC9yb3dfc3BhY2luZyk7XG4gICAgICAgICAgICAgICAgdmFyIG51bV9jb2xzID0gTWF0aC5mbG9vcihyb29mX3dpZHRoX2F2YWlsL2NvbF9zcGFjaW5nKTtcblxuICAgICAgICAgICAgICAgIC8vc2VsZWN0ZWQgbW9kdWxlc1xuXG4gICAgICAgICAgICAgICAgaWYoIG51bV9jb2xzICE9PSBnLnRlbXAubnVtX2NvbHMgfHwgbnVtX3Jvd3MgIT09IGcudGVtcC5udW1fcm93cyApe1xuICAgICAgICAgICAgICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlcyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yKCByPTE7IHI8PW51bV9yb3dzOyByKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciggYz0xOyBjPD1udW1fY29sczsgYysrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICBnLnRlbXAubnVtX2NvbHMgPSBudW1fY29scztcbiAgICAgICAgICAgICAgICAgICAgZy50ZW1wLm51bV9yb3dzID0gbnVtX3Jvd3M7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB4ID0gZGV0YWlsX3ggKyBvZmZzZXRfYTsgLy9jb3JuZXIgb2YgdXNhYmxlIHNwYWNlXG4gICAgICAgICAgICAgICAgeSA9IGRldGFpbF95ICsgb2Zmc2V0X2E7XG4gICAgICAgICAgICAgICAgeCArPSAoIHJvb2Zfd2lkdGhfYXZhaWwgLSAoY29sX3NwYWNpbmcqbnVtX2NvbHMpKS8yICpzY2FsZTsgLy8gY2VudGVyIGFycmF5IG9uIHJvb2ZcbiAgICAgICAgICAgICAgICB5ICs9ICggcm9vZl9sZW5ndGhfYXZhaWwgLSAocm93X3NwYWNpbmcqbnVtX3Jvd3MpKS8yICpzY2FsZTtcbiAgICAgICAgICAgICAgICBtb2R1bGVfdyA9IG1vZHVsZV93ICogc2NhbGU7XG4gICAgICAgICAgICAgICAgbW9kdWxlX2ggPSBtb2R1bGVfaCAqIHNjYWxlO1xuXG5cblxuICAgICAgICAgICAgICAgIGZvciggcj0xOyByPD1udW1fcm93czsgcisrKXtcblxuICAgICAgICAgICAgICAgICAgICBmb3IoIGM9MTsgYzw9bnVtX2NvbHM7IGMrKyl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXllcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSApIGxheWVyID0gJ3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBsYXllciA9ICdwcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZV94ID0gKGMtMSkgKiBjb2xfc3BhY2luZyAqIHNjYWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlX3kgPSAoci0xKSAqIHJvd19zcGFjaW5nICogc2NhbGU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGQucmVjdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbeCttb2R1bGVfeCttb2R1bGVfdy8yLCB5K21vZHVsZV95K21vZHVsZV9oLzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFttb2R1bGVfdywgbW9kdWxlX2hdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljazogXCJnLmYudG9nZ2xlX21vZHVsZSh0aGlzKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVfSUQ6ICAocikgKyAnLCcgKyAoYylcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LzIsIGRldGFpbF95K2RldGFpbF9oKzEwMF0sXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiU2VsZWN0ZWQgbW9kdWxlczogXCIgKyBwYXJzZUZsb2F0KCBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDYWxjdWxhdGVkIG1vZHVsZXM6IFwiICsgcGFyc2VGbG9hdCggZy5zeXN0ZW0uYXJyYXkubnVtYmVyX29mX21vZHVsZXMgKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB9XG5cblxuXG5cbiAgICAgICAgfVxuICAgIH1cblxuXG5cblxuXG5cbiAgICByZXR1cm4gZC5kcmF3aW5nX3BhcnRzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcGFnZTtcbiIsInZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG52YXIgbWtfYm9yZGVyID0gcmVxdWlyZSgnLi9ta19ib3JkZXInKTtcbnZhciBmID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMnKTtcblxudmFyIHBhZ2UgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgY29uc29sZS5sb2coXCIqKiBNYWtpbmcgcHJldmlldyAxXCIpO1xuXG4gICAgdmFyIGQgPSBta19kcmF3aW5nKCk7XG5cblxuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5cbiAgICB2YXIgeCwgeSwgaCwgdywgc2VjdGlvbl94LCBzZWN0aW9uX3k7XG5cbiAgICB3ID0gc2l6ZS5wcmV2aWV3Lm1vZHVsZS53O1xuICAgIGggPSBzaXplLnByZXZpZXcubW9kdWxlLmg7XG4gICAgbG9jLnByZXZpZXcuYXJyYXkuYm90dG9tID0gbG9jLnByZXZpZXcuYXJyYXkudG9wICsgaCoxLjI1KnN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgKyBoKjMvNDtcbiAgICAvL2xvYy5wcmV2aWV3LmFycmF5LnJpZ2h0ID0gbG9jLnByZXZpZXcuYXJyYXkubGVmdCArIHcqMS4yNSpzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgKyB3KjI7XG4gICAgbG9jLnByZXZpZXcuYXJyYXkucmlnaHQgPSBsb2MucHJldmlldy5hcnJheS5sZWZ0ICsgdyoxLjI1KjggKyB3KjI7XG5cbiAgICBsb2MucHJldmlldy5pbnZlcnRlci5jZW50ZXIgPSA1MDAgO1xuICAgIHcgPSBzaXplLnByZXZpZXcuaW52ZXJ0ZXIudztcbiAgICBsb2MucHJldmlldy5pbnZlcnRlci5sZWZ0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIuY2VudGVyIC0gdy8yO1xuICAgIGxvYy5wcmV2aWV3LmludmVydGVyLnJpZ2h0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIuY2VudGVyICsgdy8yO1xuXG4gICAgbG9jLnByZXZpZXcuREMubGVmdCA9IGxvYy5wcmV2aWV3LmFycmF5LnJpZ2h0O1xuICAgIGxvYy5wcmV2aWV3LkRDLnJpZ2h0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIubGVmdDtcbiAgICBsb2MucHJldmlldy5EQy5jZW50ZXIgPSAoIGxvYy5wcmV2aWV3LkRDLnJpZ2h0ICsgbG9jLnByZXZpZXcuREMubGVmdCApLzI7XG5cbiAgICBsb2MucHJldmlldy5BQy5sZWZ0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIucmlnaHQ7XG4gICAgbG9jLnByZXZpZXcuQUMucmlnaHQgPSBsb2MucHJldmlldy5BQy5sZWZ0ICsgMzAwO1xuICAgIGxvYy5wcmV2aWV3LkFDLmNlbnRlciA9ICggbG9jLnByZXZpZXcuQUMucmlnaHQgKyBsb2MucHJldmlldy5BQy5sZWZ0ICkvMjtcblxuXG4vLyBUT0RPIGZpeDogc2VjdGlvbnMgbXVzdCBiZSBkZWZpbmVkIGluIG9yZGVyLCBvciB0aGVyZSBhcmUgYXJlYXNcblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnYXJyYXknKSAmJiBmLnNlY3Rpb25fZGVmaW5lZCgnbW9kdWxlJykgKXtcbiAgICAgICAgZC5sYXllcigncHJldmlld19hcnJheScpO1xuXG4gICAgICAgIHcgPSBzaXplLnByZXZpZXcubW9kdWxlLnc7XG4gICAgICAgIGggPSBzaXplLnByZXZpZXcubW9kdWxlLmg7XG4gICAgICAgIHZhciBvZmZzZXQgPSA0MDtcblxuICAgICAgICBmb3IoIHZhciBzPTA7IHM8c3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzOyBzKysgKXtcbiAgICAgICAgICAgIHggPSBsb2MucHJldmlldy5hcnJheS5sZWZ0ICsgdyoxLjI1KnM7XG4gICAgICAgICAgICAvLyBzdHJpbmcgd2lyaW5nXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbIHggLCBsb2MucHJldmlldy5hcnJheS50b3AgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB4ICwgbG9jLnByZXZpZXcuYXJyYXkuYm90dG9tIF0sXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIC8vIG1vZHVsZXNcbiAgICAgICAgICAgIGZvciggdmFyIG09MDsgbTxzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nOyBtKysgKXtcbiAgICAgICAgICAgICAgICB5ID0gbG9jLnByZXZpZXcuYXJyYXkudG9wICsgaCArIGgqMS4yNSptO1xuICAgICAgICAgICAgICAgIC8vIG1vZHVsZXNcbiAgICAgICAgICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICAgICAgICAgIFsgeCAsIHkgXSxcbiAgICAgICAgICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAgICAgICAgICdwcmV2aWV3X21vZHVsZSdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdG9wIGFycmF5IGNvbmR1aXRcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LmFycmF5LmxlZnQgLCBsb2MucHJldmlldy5hcnJheS50b3AgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LmFycmF5LnJpZ2h0IC0gdywgbG9jLnByZXZpZXcuYXJyYXkudG9wIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5hcnJheS5yaWdodCAsIGxvYy5wcmV2aWV3LmFycmF5LnRvcCBdLFxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgICAgICAvLyBib3R0b20gYXJyYXkgY29uZHVpdFxuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuYXJyYXkubGVmdCAsIGxvYy5wcmV2aWV3LmFycmF5LmJvdHRvbSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuYXJyYXkucmlnaHQgLSB3ICwgbG9jLnByZXZpZXcuYXJyYXkuYm90dG9tIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5hcnJheS5yaWdodCAtIHcgLCBsb2MucHJldmlldy5hcnJheS50b3AgXSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgKTtcblxuICAgICAgICB5ID0gbG9jLnByZXZpZXcuYXJyYXkudG9wO1xuICAgICAgICBoID0gc2l6ZS5wcmV2aWV3Lm1vZHVsZS5oO1xuXG4gICAgICAgIGQudGV4dChcbiAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuREMuY2VudGVyLCB5K2gvMitvZmZzZXQgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnQXJyYXkgREMnLFxuICAgICAgICAgICAgICAgICdTdHJpbmdzOiAnICsgcGFyc2VGbG9hdChzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MpLnRvRml4ZWQoKSxcbiAgICAgICAgICAgICAgICAnTW9kdWxlczogJyArIHBhcnNlRmxvYXQoc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZykudG9GaXhlZCgpLFxuICAgICAgICAgICAgICAgICdQbXA6ICcgKyBwYXJzZUZsb2F0KHN5c3RlbS5hcnJheS5wbXApLnRvRml4ZWQoKSxcbiAgICAgICAgICAgICAgICAnSW1wOiAnICsgcGFyc2VGbG9hdChzeXN0ZW0uYXJyYXkuaW1wKS50b0ZpeGVkKCksXG4gICAgICAgICAgICAgICAgJ1ZtcDogJyArIHBhcnNlRmxvYXQoc3lzdGVtLmFycmF5LnZtcCkudG9GaXhlZCgpLFxuICAgICAgICAgICAgICAgICdJc2M6ICcgKyBwYXJzZUZsb2F0KHN5c3RlbS5hcnJheS5pc2MpLnRvRml4ZWQoKSxcbiAgICAgICAgICAgICAgICAnVm9jOiAnICsgcGFyc2VGbG9hdChzeXN0ZW0uYXJyYXkudm9jKS50b0ZpeGVkKCksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ3ByZXZpZXcgdGV4dCdcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ0RDJykgKXtcbiAgICAgICAgZC5sYXllcigncHJldmlld19EQycpO1xuXG4gICAgICAgIC8veSA9IHk7XG4gICAgICAgIHkgPSBsb2MucHJldmlldy5hcnJheS50b3A7XG4gICAgICAgIHcgPSBzaXplLnByZXZpZXcubW9kdWxlLnc7XG4gICAgICAgIGggPSBzaXplLnByZXZpZXcubW9kdWxlLmg7XG5cbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LkRDLmxlZnQgLCB5IF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5EQy5yaWdodCwgeSBdLFxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbbG9jLnByZXZpZXcuREMuY2VudGVyLHldLFxuICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAncHJldmlld19EQ19ib3gnXG4gICAgICAgICk7XG5cbiAgICB9XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ2ludmVydGVyJykgKXtcblxuICAgICAgICBkLmxheWVyKCdwcmV2aWV3X2ludmVydGVyJyk7XG5cbiAgICAgICAgeSA9IHk7XG4gICAgICAgIHcgPSBzaXplLnByZXZpZXcuaW52ZXJ0ZXIudztcbiAgICAgICAgaCA9IHNpemUucHJldmlldy5pbnZlcnRlci5oO1xuXG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFtsb2MucHJldmlldy5pbnZlcnRlci5jZW50ZXIseV0sXG4gICAgICAgICAgICBbdyxoXSxcbiAgICAgICAgICAgICdwcmV2aWV3X2ludmVydGVyX2JveCdcbiAgICAgICAgKTtcbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgW2xvYy5wcmV2aWV3LmludmVydGVyLmNlbnRlcix5K2gvMitvZmZzZXRdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdJbnZlcnRlcicsXG4gICAgICAgICAgICAgICAgc3lzdGVtLmludmVydGVyLm1ha2UsXG4gICAgICAgICAgICAgICAgc3lzdGVtLmludmVydGVyLm1vZGVsLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwcmV2aWV3IHRleHQnXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdBQycpICl7XG5cbiAgICAgICAgZC5sYXllcigncHJldmlld19BQycpO1xuXG5cbiAgICAgICAgeSA9IHk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5BQy5sZWZ0LCB5IF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5BQy5yaWdodCwgeSBdLFxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgICAgICB3ID0gc2l6ZS5wcmV2aWV3LkFDLnc7XG4gICAgICAgIGggPSBzaXplLnByZXZpZXcuQUMuaDtcbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW2xvYy5wcmV2aWV3LkFDLmNlbnRlcix5XSxcbiAgICAgICAgICAgIFt3LGhdLFxuICAgICAgICAgICAgJ3ByZXZpZXdfQUNfYm94J1xuICAgICAgICApO1xuICAgICAgICB3ID0gc2l6ZS5wcmV2aWV3LmxvYWRjZW50ZXIudztcbiAgICAgICAgaCA9IHNpemUucHJldmlldy5sb2FkY2VudGVyLmg7XG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuQUMucmlnaHQtdy8yLCB5K2gvNCBdLFxuICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAncHJldmlld19BQ19ib3gnXG4gICAgICAgICk7XG5cbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgW2xvYy5wcmV2aWV3LkFDLmNlbnRlcix5K2gvMitvZmZzZXRdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdBQycsXG5cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAncHJldmlldyB0ZXh0J1xuICAgICAgICApO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xudmFyIG1rX2JvcmRlciA9IHJlcXVpcmUoJy4vbWtfYm9yZGVyJyk7XG52YXIgZiA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zJyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHByZXZpZXcgMlwiKTtcblxuICAgIHZhciBkID0gbWtfZHJhd2luZygpO1xuXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdyb29mJykgKXtcblxuICAgICAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICAgICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuICAgICAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuXG4gICAgICAgIHZhciB4LCB5LCBoLCB3LCBzZWN0aW9uX3gsIHNlY3Rpb25feSwgbGVuZ3RoX3AsIHNjYWxlO1xuXG4gICAgICAgIHZhciBzbG9wZSA9IHN5c3RlbS5yb29mLnNsb3BlLnNwbGl0KCc6JylbMF07XG4gICAgICAgIHZhciBhbmdsZV9yYWQgPSBNYXRoLmF0YW4oIE51bWJlcihzbG9wZSkgLzEyICk7XG4gICAgICAgIC8vYW5nbGVfcmFkID0gYW5nbGUgKiAoTWF0aC5QSS8xODApO1xuXG5cbiAgICAgICAgbGVuZ3RoX3AgPSBzeXN0ZW0ucm9vZi5sZW5ndGggKiBNYXRoLmNvcyhhbmdsZV9yYWQpO1xuICAgICAgICBzeXN0ZW0ucm9vZi5oZWlnaHQgPSBzeXN0ZW0ucm9vZi5sZW5ndGggKiBNYXRoLnNpbihhbmdsZV9yYWQpO1xuXG4gICAgICAgIHZhciByb29mX3JhdGlvID0gc3lzdGVtLnJvb2YubGVuZ3RoIC8gc3lzdGVtLnJvb2Yud2lkdGg7XG4gICAgICAgIHZhciByb29mX3BsYW5fcmF0aW8gPSBsZW5ndGhfcCAvIHN5c3RlbS5yb29mLndpZHRoO1xuXG5cbiAgICAgICAgaWYoIHN5c3RlbS5yb29mLnR5cGUgPT09IFwiR2FibGVcIil7XG5cblxuICAgICAgICAgICAgLy8vLy8vL1xuICAgICAgICAgICAgLy8gUm9vZCBwbGFuIHZpZXdcbiAgICAgICAgICAgIHZhciBwbGFuX3ggPSAzMDtcbiAgICAgICAgICAgIHZhciBwbGFuX3kgPSAzMDtcblxuICAgICAgICAgICAgdmFyIHBsYW5fdywgcGxhbl9oO1xuICAgICAgICAgICAgaWYoIGxlbmd0aF9wKjIgPiBzeXN0ZW0ucm9vZi53aWR0aCApe1xuICAgICAgICAgICAgICAgIHNjYWxlID0gMjUwLyhsZW5ndGhfcCoyKTtcbiAgICAgICAgICAgICAgICBwbGFuX3cgPSAobGVuZ3RoX3AqMikgKiBzY2FsZTtcbiAgICAgICAgICAgICAgICBwbGFuX2ggPSBwbGFuX3cgLyAobGVuZ3RoX3AqMiAvIHN5c3RlbS5yb29mLndpZHRoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2NhbGUgPSA0MDAvKHN5c3RlbS5yb29mLndpZHRoKTtcbiAgICAgICAgICAgICAgICBwbGFuX2ggPSBzeXN0ZW0ucm9vZi53aWR0aCAqIHNjYWxlO1xuICAgICAgICAgICAgICAgIHBsYW5fdyA9IHBsYW5faCAqIChsZW5ndGhfcCoyIC8gc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95K3BsYW5faC8yXSxcbiAgICAgICAgICAgICAgICBbcGxhbl93LCBwbGFuX2hdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsXCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGQucG9seShbXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3ggICAgICAgLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3krcGxhbl9oXSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCwgICAgICAgIHBsYW5feStwbGFuX2hdLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94ICAgICAgICwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX3BvbHlfdW5zZWxlY3RlZFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5wb2x5KFtcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiAgICAgICAsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIrcGxhbl93LzIsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIrcGxhbl93LzIsIHBsYW5feStwbGFuX2hdLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCAgICAgICAgcGxhbl95K3BsYW5faF0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIgICAgICAgLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfcG9seV9zZWxlY3RlZFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3krcGxhbl9oXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW3BsYW5feC0yMCwgcGxhbl95K3BsYW5faC8yXSxcbiAgICAgICAgICAgICAgICBzeXN0ZW0ucm9vZi5sZW5ndGgudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdysyMCwgcGxhbl95K3BsYW5faC8yXSxcbiAgICAgICAgICAgICAgICBzeXN0ZW0ucm9vZi53aWR0aC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG5cblxuXG4gICAgICAgICAgICAvLy8vLy8vL1xuICAgICAgICAgICAgLy8gcm9vZiBjcm9zc2VjdGlvblxuXG4gICAgICAgICAgICB2YXIgY3NfeCA9IDMwO1xuICAgICAgICAgICAgdmFyIGNzX3kgPSAzMCtwbGFuX2grNTA7XG4gICAgICAgICAgICB2YXIgY3NfaCA9IHN5c3RlbS5yb29mLmhlaWdodCAqIHNjYWxlO1xuICAgICAgICAgICAgdmFyIGNzX3cgPSBwbGFuX3cvMjtcblxuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2NzX3grY3NfdywgICBjc195XSxcbiAgICAgICAgICAgICAgICAgICAgW2NzX3grY3NfdywgICBjc195K2NzX2hdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3ldLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193KjIsIGNzX3krY3NfaF0sXG4gICAgICAgICAgICAgICAgICAgIFtjc194LCAgICAgICAgY3NfeStjc19oXSxcbiAgICAgICAgICAgICAgICAgICAgW2NzX3grY3NfdywgICBjc195XSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2NzX3grY3Nfdy0xNSwgY3NfeStjc19oKjIvM10sXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggc3lzdGVtLnJvb2YuaGVpZ2h0ICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2NzX3grY3NfdyoxLjUrMjAsIGNzX3krY3NfaC8zXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi5sZW5ndGggKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcblxuXG5cbiAgICAgICAgICAgIC8vLy8vL1xuICAgICAgICAgICAgLy8gcm9vZiBkZXRhaWxcblxuICAgICAgICAgICAgdmFyIGRldGFpbF94ID0gMzArNDUwO1xuICAgICAgICAgICAgdmFyIGRldGFpbF95ID0gMzA7XG5cbiAgICAgICAgICAgIGlmKCBOdW1iZXIoc3lzdGVtLnJvb2Yud2lkdGgpID49IE51bWJlcihzeXN0ZW0ucm9vZi5sZW5ndGgpICl7XG4gICAgICAgICAgICAgICAgc2NhbGUgPSA0NTAvKHN5c3RlbS5yb29mLndpZHRoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2NhbGUgPSA0NTAvKHN5c3RlbS5yb29mLmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZGV0YWlsX3cgPSBzeXN0ZW0ucm9vZi53aWR0aCAqIHNjYWxlO1xuICAgICAgICAgICAgdmFyIGRldGFpbF9oID0gc3lzdGVtLnJvb2YubGVuZ3RoICogc2NhbGU7XG5cbiAgICAgICAgICAgIGQucmVjdChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3cvMiwgZGV0YWlsX3krZGV0YWlsX2gvMl0sXG4gICAgICAgICAgICAgICAgW2RldGFpbF93LCBkZXRhaWxfaF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfcG9seV9zZWxlY3RlZF9mcmFtZWRcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdmFyIGEgPSAzO1xuICAgICAgICAgICAgdmFyIG9mZnNldF9hID0gYSAqIHNjYWxlO1xuXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3gsICAgZGV0YWlsX3krb2Zmc2V0X2FdLFxuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3csICAgZGV0YWlsX3krb2Zmc2V0X2FdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3gsICAgICAgICAgIGRldGFpbF95K2RldGFpbF9oLW9mZnNldF9hXSxcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LCBkZXRhaWxfeStkZXRhaWxfaC1vZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtvZmZzZXRfYSwgZGV0YWlsX3ldLFxuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grb2Zmc2V0X2EsIGRldGFpbF95K2RldGFpbF9oXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LW9mZnNldF9hLCBkZXRhaWxfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy1vZmZzZXRfYSwgZGV0YWlsX3krZGV0YWlsX2hdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3gtNDAsIGRldGFpbF95K2RldGFpbF9oLzJdLFxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHN5c3RlbS5yb29mLmxlbmd0aCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy8yLCBkZXRhaWxfeStkZXRhaWxfaCs0MF0sXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggc3lzdGVtLnJvb2Yud2lkdGggKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeCsgKG9mZnNldF9hKS8yLCBkZXRhaWxfeStkZXRhaWxfaCsxNV0sXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy0ob2Zmc2V0X2EpLzIsIGRldGFpbF95K2RldGFpbF9oKzE1XSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94LTE1LCBkZXRhaWxfeStkZXRhaWxfaC0ob2Zmc2V0X2EpLzJdLFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3gtMTUsIGRldGFpbF95KyhvZmZzZXRfYSkvMl0sXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG5cblxuXG5cbiAgICAgICAgICAgIC8vLy8vL1xuICAgICAgICAgICAgLy8gTW9kdWxlIG9wdGlvbnNcbiAgICAgICAgICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnbW9kdWxlJykgJiYgZi5zZWN0aW9uX2RlZmluZWQoJ2FycmF5Jykpe1xuICAgICAgICAgICAgICAgIHZhciByLGM7XG5cbiAgICAgICAgICAgICAgICB2YXIgcm9vZl9sZW5ndGhfYXZhaWwgPSBzeXN0ZW0ucm9vZi5sZW5ndGggLSAoYSoyKTtcbiAgICAgICAgICAgICAgICB2YXIgcm9vZl93aWR0aF9hdmFpbCA9IHN5c3RlbS5yb29mLndpZHRoIC0gKGEqMik7XG5cbiAgICAgICAgICAgICAgICB2YXIgcm93X3NwYWNpbmc7XG4gICAgICAgICAgICAgICAgaWYoIHN5c3RlbS5tb2R1bGUub3JpZW50YXRpb24gPT09ICdQb3J0cmFpdCcgKXtcbiAgICAgICAgICAgICAgICAgICAgcm93X3NwYWNpbmcgPSBOdW1iZXIoc3lzdGVtLm1vZHVsZS5sZW5ndGgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgY29sX3NwYWNpbmcgPSBOdW1iZXIoc3lzdGVtLm1vZHVsZS53aWR0aCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVfdyA9IChOdW1iZXIoc3lzdGVtLm1vZHVsZS53aWR0aCkgICkvMTI7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV9oID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLmxlbmd0aCkgKS8xMjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByb3dfc3BhY2luZyA9IE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIGNvbF9zcGFjaW5nID0gTnVtYmVyKHN5c3RlbS5tb2R1bGUubGVuZ3RoKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV93ID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLmxlbmd0aCkpLzEyO1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVfaCA9IChOdW1iZXIoc3lzdGVtLm1vZHVsZS53aWR0aCkgKS8xMjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByb3dfc3BhY2luZyA9IHJvd19zcGFjaW5nLzEyOyAvL21vZHVsZSBkaW1lbnRpb25zIGFyZSBpbiBpbmNoZXNcbiAgICAgICAgICAgICAgICBjb2xfc3BhY2luZyA9IGNvbF9zcGFjaW5nLzEyOyAvL21vZHVsZSBkaW1lbnRpb25zIGFyZSBpbiBpbmNoZXNcblxuICAgICAgICAgICAgICAgIHZhciBudW1fcm93cyA9IE1hdGguZmxvb3Iocm9vZl9sZW5ndGhfYXZhaWwvcm93X3NwYWNpbmcpO1xuICAgICAgICAgICAgICAgIHZhciBudW1fY29scyA9IE1hdGguZmxvb3Iocm9vZl93aWR0aF9hdmFpbC9jb2xfc3BhY2luZyk7XG5cbiAgICAgICAgICAgICAgICAvL3NlbGVjdGVkIG1vZHVsZXNcblxuICAgICAgICAgICAgICAgIGlmKCBudW1fY29scyAhPT0gZy50ZW1wLm51bV9jb2xzIHx8IG51bV9yb3dzICE9PSBnLnRlbXAubnVtX3Jvd3MgKXtcbiAgICAgICAgICAgICAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNfdG90YWwgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciggcj0xOyByPD1udW1fcm93czsgcisrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzW3JdID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IoIGM9MTsgYzw9bnVtX2NvbHM7IGMrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl1bY10gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICAgICAgZy50ZW1wLm51bV9jb2xzID0gbnVtX2NvbHM7XG4gICAgICAgICAgICAgICAgICAgIGcudGVtcC5udW1fcm93cyA9IG51bV9yb3dzO1xuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgeCA9IGRldGFpbF94ICsgb2Zmc2V0X2E7IC8vY29ybmVyIG9mIHVzYWJsZSBzcGFjZVxuICAgICAgICAgICAgICAgIHkgPSBkZXRhaWxfeSArIG9mZnNldF9hO1xuICAgICAgICAgICAgICAgIHggKz0gKCByb29mX3dpZHRoX2F2YWlsIC0gKGNvbF9zcGFjaW5nKm51bV9jb2xzKSkvMiAqc2NhbGU7IC8vIGNlbnRlciBhcnJheSBvbiByb29mXG4gICAgICAgICAgICAgICAgeSArPSAoIHJvb2ZfbGVuZ3RoX2F2YWlsIC0gKHJvd19zcGFjaW5nKm51bV9yb3dzKSkvMiAqc2NhbGU7XG4gICAgICAgICAgICAgICAgbW9kdWxlX3cgPSBtb2R1bGVfdyAqIHNjYWxlO1xuICAgICAgICAgICAgICAgIG1vZHVsZV9oID0gbW9kdWxlX2ggKiBzY2FsZTtcblxuXG5cbiAgICAgICAgICAgICAgICBmb3IoIHI9MTsgcjw9bnVtX3Jvd3M7IHIrKyl7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yKCBjPTE7IGM8PW51bV9jb2xzOyBjKyspe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF5ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl1bY10gKSBsYXllciA9ICdwcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgbGF5ZXIgPSAncHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVfeCA9IChjLTEpICogY29sX3NwYWNpbmcgKiBzY2FsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZV95ID0gKHItMSkgKiByb3dfc3BhY2luZyAqIHNjYWxlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3grbW9kdWxlX3grbW9kdWxlX3cvMiwgeSttb2R1bGVfeSttb2R1bGVfaC8yXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbW9kdWxlX3csIG1vZHVsZV9oXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXllcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s6IFwiZy5mLnRvZ2dsZV9tb2R1bGUodGhpcylcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlX0lEOiAgKHIpICsgJywnICsgKGMpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy8yLCBkZXRhaWxfeStkZXRhaWxfaCsxMDBdLFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlNlbGVjdGVkIG1vZHVsZXM6IFwiICsgcGFyc2VGbG9hdCggZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNfdG90YWwgKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ2FsY3VsYXRlZCBtb2R1bGVzOiBcIiArIHBhcnNlRmxvYXQoIGcuc3lzdGVtLmFycmF5Lm51bWJlcl9vZl9tb2R1bGVzICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB4ID0gZGV0YWlsX3ggKyA0NzU7XG4gICAgICAgICAgICB5ID0gZGV0YWlsX3kgKyAxMjA7XG5cbiAgICAgICAgICAgIGQuYmxvY2soJ25vcnRoIGFycm93X3VwJywgW3gseV0pO1xuXG4gICAgICAgICAgICB4ID0gMTIwO1xuICAgICAgICAgICAgeSA9IDE1O1xuXG4gICAgICAgICAgICBkLmJsb2NrKCdub3J0aCBhcnJvd19sZWZ0JywgW3gseV0pO1xuLy8qL1xuICAgICAgICB9XG5cblxuICAgICAgICAvKlxuXG5cblxuXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCwgICAgeV0sXG4gICAgICAgICAgICBbeCtkeCwgeS1keV0sXG4gICAgICAgICAgICBbeCtkeCwgeV0sXG4gICAgICAgICAgICBbeCwgICAgeV0sXG4gICAgICAgICAgICBdXG4gICAgICAgICk7XG5cbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgW3grZHgvMi0xMCwgeS1keS8yLTIwXSxcbiAgICAgICAgICAgIHN5c3RlbS5yb29mLmhlaWdodC50b1N0cmluZygpLFxuICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgKTtcbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgW3grZHgvMis1LCB5LTE1XSxcbiAgICAgICAgICAgIGFuZ2xlLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICApO1xuXG5cbiAgICAgICAgeCA9IHgrZHgrMTAwO1xuICAgICAgICB5ID0geTtcblxuXG4gICAgICAgIC8vKi9cblxuICAgIH1cblxuICAgIHJldHVybiBkLmRyYXdpbmdfcGFydHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy92YXIgc2V0dGluZ3MgPSByZXF1aXJlKCcuL3NldHRpbmdzLmpzJyk7XG4vL3ZhciBzbmFwc3ZnID0gcmVxdWlyZSgnc25hcHN2ZycpO1xuLy9sb2coc2V0dGluZ3MpO1xuXG5cblxudmFyIGRpc3BsYXlfc3ZnID0gZnVuY3Rpb24oZHJhd2luZ19wYXJ0cywgc2V0dGluZ3Mpe1xuICAgIC8vY29uc29sZS5sb2coJ2Rpc3BsYXlpbmcgc3ZnJyk7XG4gICAgdmFyIGxheWVyX2F0dHIgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxheWVyX2F0dHI7XG4gICAgdmFyIGZvbnRzID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5mb250cztcbiAgICAvL2NvbnNvbGUubG9nKCdkcmF3aW5nX3BhcnRzOiAnLCBkcmF3aW5nX3BhcnRzKTtcbiAgICAvL2NvbnRhaW5lci5lbXB0eSgpXG5cbiAgICAvL3ZhciBzdmdfZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdTdmdqc1N2ZzEwMDAnKVxuICAgIHZhciBzdmdfZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdzdmcnKTtcbiAgICBzdmdfZWxlbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywnc3ZnX2RyYXdpbmcnKTtcbiAgICAvL3N2Z19lbGVtLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy53KTtcbiAgICAvL3N2Z19lbGVtLnNldEF0dHJpYnV0ZSgnaGVpZ2h0Jywgc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcuaCk7XG4gICAgdmFyIHZpZXdfYm94ID0gJzAgMCAnICtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcudyArICcgJyArXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS5kcmF3aW5nLmggKyAnICc7XG4gICAgc3ZnX2VsZW0uc2V0QXR0cmlidXRlKCd2aWV3Qm94Jywgdmlld19ib3gpO1xuICAgIC8vdmFyIHN2ZyA9IHNuYXBzdmcoc3ZnX2VsZW0pLnNpemUoc2l6ZS5kcmF3aW5nLncsIHNpemUuZHJhd2luZy5oKTtcbiAgICAvL3ZhciBzdmcgPSBzbmFwc3ZnKCcjc3ZnX2RyYXdpbmcnKTtcblxuICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgdGhlIGRyYXdpbmcgY29udGVudHMsIGNhbGwgdGhlIGZ1bmN0aW9uIGJlbG93LlxuICAgIGRyYXdpbmdfcGFydHMuZm9yRWFjaCggZnVuY3Rpb24oZWxlbSxpZCkge1xuICAgICAgICBzaG93X2VsZW1fYXJyYXkoZWxlbSk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzaG93X2VsZW1fYXJyYXkoZWxlbSwgb2Zmc2V0KXtcbiAgICAgICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IHt4OjAseTowfTtcbiAgICAgICAgdmFyIHgseSxhdHRyX25hbWU7XG4gICAgICAgIGlmKCB0eXBlb2YgZWxlbS54ICE9PSAndW5kZWZpbmVkJyApIHsgeCA9IGVsZW0ueCArIG9mZnNldC54OyB9XG4gICAgICAgIGlmKCB0eXBlb2YgZWxlbS55ICE9PSAndW5kZWZpbmVkJyApIHsgeSA9IGVsZW0ueSArIG9mZnNldC55OyB9XG5cbiAgICAgICAgdmFyIGF0dHJzID0gbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdO1xuICAgICAgICBpZiggZWxlbS5hdHRycyAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIGZvciggYXR0cl9uYW1lIGluIGVsZW0uYXR0cnMgKXtcbiAgICAgICAgICAgICAgICBhdHRyc1thdHRyX25hbWVdID0gZWxlbS5hdHRyc1thdHRyX25hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYoIGVsZW0udHlwZSA9PT0gJ3JlY3QnKSB7XG4gICAgICAgICAgICAvL3N2Zy5yZWN0KCBlbGVtLncsIGVsZW0uaCApLm1vdmUoIHgtZWxlbS53LzIsIHktZWxlbS5oLzIgKS5hdHRyKCBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV0gKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2VsZW06JywgZWxlbSApO1xuICAgICAgICAgICAgLy9pZiggaXNOYU4oZWxlbS53KSApIHtcbiAgICAgICAgICAgIC8vICAgIGNvbnNvbGUubG9nKCdlcnJvcjogZWxlbSBub3QgZnVsbHkgZGVmaW5lZCcsIGVsZW0pXG4gICAgICAgICAgICAvLyAgICBlbGVtLncgPSAxMDtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgLy9pZiggaXNOYU4oZWxlbS5oKSApIHtcbiAgICAgICAgICAgIC8vICAgIGNvbnNvbGUubG9nKCdlcnJvcjogZWxlbSBub3QgZnVsbHkgZGVmaW5lZCcsIGVsZW0pXG4gICAgICAgICAgICAvLyAgICBlbGVtLmggPSAxMDtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgdmFyIHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAncmVjdCcpO1xuICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgZWxlbS53KTtcbiAgICAgICAgICAgIHIuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBlbGVtLmgpO1xuICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoJ3gnLCB4LWVsZW0udy8yKTtcbiAgICAgICAgICAgIHIuc2V0QXR0cmlidXRlKCd5JywgeS1lbGVtLmgvMik7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGVsZW0ubGF5ZXJfbmFtZSk7XG4gICAgICAgICAgICBmb3IoIGF0dHJfbmFtZSBpbiBhdHRycyApe1xuICAgICAgICAgICAgICAgIHIuc2V0QXR0cmlidXRlKGF0dHJfbmFtZSwgYXR0cnNbYXR0cl9uYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdmdfZWxlbS5hcHBlbmRDaGlsZChyKTtcbiAgICAgICAgfSBlbHNlIGlmKCBlbGVtLnR5cGUgPT09ICdsaW5lJykge1xuICAgICAgICAgICAgdmFyIHBvaW50czIgPSBbXTtcbiAgICAgICAgICAgIGVsZW0ucG9pbnRzLmZvckVhY2goIGZ1bmN0aW9uKHBvaW50KXtcbiAgICAgICAgICAgICAgICBpZiggISBpc05hTihwb2ludFswXSkgJiYgISBpc05hTihwb2ludFsxXSkgKXtcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzMi5wdXNoKFsgcG9pbnRbMF0rb2Zmc2V0LngsIHBvaW50WzFdK29mZnNldC55IF0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjogZWxlbSBub3QgZnVsbHkgZGVmaW5lZCcsIGVsZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9zdmcucG9seWxpbmUoIHBvaW50czIgKS5hdHRyKCBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV0gKTtcblxuICAgICAgICAgICAgdmFyIGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAncG9seWxpbmUnKTtcbiAgICAgICAgICAgIGwuc2V0QXR0cmlidXRlKCAncG9pbnRzJywgcG9pbnRzMi5qb2luKCcgJykgKTtcbiAgICAgICAgICAgIGZvciggYXR0cl9uYW1lIGluIGF0dHJzICl7XG4gICAgICAgICAgICAgICAgbC5zZXRBdHRyaWJ1dGUoYXR0cl9uYW1lLCBhdHRyc1thdHRyX25hbWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN2Z19lbGVtLmFwcGVuZENoaWxkKGwpO1xuICAgICAgICB9IGVsc2UgaWYoIGVsZW0udHlwZSA9PT0gJ3BvbHknKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnRzMiA9IFtdO1xuICAgICAgICAgICAgZWxlbS5wb2ludHMuZm9yRWFjaCggZnVuY3Rpb24ocG9pbnQpe1xuICAgICAgICAgICAgICAgIGlmKCAhIGlzTmFOKHBvaW50WzBdKSAmJiAhIGlzTmFOKHBvaW50WzFdKSApe1xuICAgICAgICAgICAgICAgICAgICBwb2ludHMyLnB1c2goWyBwb2ludFswXStvZmZzZXQueCwgcG9pbnRbMV0rb2Zmc2V0LnkgXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yOiBlbGVtIG5vdCBmdWxseSBkZWZpbmVkJywgZWxlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL3N2Zy5wb2x5bGluZSggcG9pbnRzMiApLmF0dHIoIGxheWVyX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApO1xuXG4gICAgICAgICAgICB2YXIgbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdwb2x5bGluZScpO1xuICAgICAgICAgICAgbC5zZXRBdHRyaWJ1dGUoICdwb2ludHMnLCBwb2ludHMyLmpvaW4oJyAnKSApO1xuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gYXR0cnMgKXtcbiAgICAgICAgICAgICAgICBsLnNldEF0dHJpYnV0ZShhdHRyX25hbWUsIGF0dHJzW2F0dHJfbmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3ZnX2VsZW0uYXBwZW5kQ2hpbGQobCk7XG4gICAgICAgIH0gZWxzZSBpZiggZWxlbS50eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgIC8vdmFyIHQgPSBzdmcudGV4dCggZWxlbS5zdHJpbmdzICkubW92ZSggZWxlbS5wb2ludHNbMF1bMF0sIGVsZW0ucG9pbnRzWzBdWzFdICkuYXR0ciggbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdIClcbiAgICAgICAgICAgIHZhciBmb250O1xuICAgICAgICAgICAgaWYoIGVsZW0uZm9udCApe1xuICAgICAgICAgICAgICAgIGZvbnQgPSBmb250c1tlbGVtLmZvbnRdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb250ID0gZm9udHNbYXR0cnMuZm9udF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICd0ZXh0Jyk7XG4gICAgICAgICAgICBpZihlbGVtLnJvdGF0ZWQpe1xuICAgICAgICAgICAgICAgIC8vdC5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsIFwicm90YXRlKFwiICsgZWxlbS5yb3RhdGVkICsgXCIgXCIgKyB4ICsgXCIgXCIgKyB5ICsgXCIpXCIgKTtcbiAgICAgICAgICAgICAgICB0LnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywgXCJyb3RhdGUoXCIgKyBlbGVtLnJvdGF0ZWQgKyBcIiBcIiArIHggKyBcIiBcIiArIHkgKyBcIilcIiApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL2lmKCBmb250Wyd0ZXh0LWFuY2hvciddID09PSAnbWlkZGxlJyApIHkgKz0gZm9udFsnZm9udC1zaXplJ10qMS8zO1xuICAgICAgICAgICAgICAgIHkgKz0gZm9udFsnZm9udC1zaXplJ10qMS8zO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGR5ID0gZm9udFsnZm9udC1zaXplJ10qMS41O1xuICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoJ3gnLCB4KTtcbiAgICAgICAgICAgIC8vdC5zZXRBdHRyaWJ1dGUoJ3knLCB5ICsgZm9udFsnZm9udC1zaXplJ10vMiApO1xuICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoJ3knLCB5LWR5ICk7XG5cbiAgICAgICAgICAgIGZvciggYXR0cl9uYW1lIGluIGF0dHJzICl7XG4gICAgICAgICAgICAgICAgaWYoIGF0dHJfbmFtZSA9PT0gJ3N0cm9rZScgKSB7XG4gICAgICAgICAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCAnZmlsbCcsIGF0dHJzW2F0dHJfbmFtZV0gKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoIGF0dHJfbmFtZSA9PT0gJ2ZpbGwnICkge1xuICAgICAgICAgICAgICAgICAgICAvL3Quc2V0QXR0cmlidXRlKCAnc3Ryb2tlJywgJ25vbmUnICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoIGF0dHJfbmFtZSwgYXR0cnNbYXR0cl9uYW1lXSApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gZm9udCApe1xuICAgICAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCBhdHRyX25hbWUsIGZvbnRbYXR0cl9uYW1lXSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gZWxlbS5zdHJpbmdzICl7XG4gICAgICAgICAgICAgICAgdmFyIHRzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3RzcGFuJyk7XG4gICAgICAgICAgICAgICAgdHNwYW4uc2V0QXR0cmlidXRlKCdkeScsIGR5ICk7XG4gICAgICAgICAgICAgICAgdHNwYW4uc2V0QXR0cmlidXRlKCd4JywgeCk7XG4gICAgICAgICAgICAgICAgdHNwYW4uaW5uZXJIVE1MID0gZWxlbS5zdHJpbmdzW2F0dHJfbmFtZV07XG4gICAgICAgICAgICAgICAgdC5hcHBlbmRDaGlsZCh0c3Bhbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdmdfZWxlbS5hcHBlbmRDaGlsZCh0KTtcbiAgICAgICAgfSBlbHNlIGlmKCBlbGVtLnR5cGUgPT09ICdjaXJjJykge1xuICAgICAgICAgICAgdmFyIGMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAnZWxsaXBzZScpO1xuICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoJ3J4JywgZWxlbS5kLzIpO1xuICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoJ3J5JywgZWxlbS5kLzIpO1xuICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoJ2N4JywgeCk7XG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZSgnY3knLCB5KTtcbiAgICAgICAgICAgIGZvciggYXR0cl9uYW1lIGluIGF0dHJzICl7XG4gICAgICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoYXR0cl9uYW1lLCBhdHRyc1thdHRyX25hbWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN2Z19lbGVtLmFwcGVuZENoaWxkKGMpO1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGMuYXR0cmlidXRlcyggbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdIClcbiAgICAgICAgICAgIGMuYXR0cmlidXRlcyh7XG4gICAgICAgICAgICAgICAgcng6IDUsXG4gICAgICAgICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICByeTogNSxcbiAgICAgICAgICAgICAgICBjeDogZWxlbS5wb2ludHNbMF1bMF0tZWxlbS5kLzIsXG4gICAgICAgICAgICAgICAgY3k6IGVsZW0ucG9pbnRzWzBdWzFdLWVsZW0uZC8yXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdmFyIGMyID0gc3ZnLmVsbGlwc2UoIGVsZW0uciwgZWxlbS5yIClcbiAgICAgICAgICAgIGMyLm1vdmUoIGVsZW0ucG9pbnRzWzBdWzBdLWVsZW0uZC8yLCBlbGVtLnBvaW50c1swXVsxXS1lbGVtLmQvMiApXG4gICAgICAgICAgICBjMi5hdHRyKHtyeDo1LCByeTo1fSlcbiAgICAgICAgICAgIGMyLmF0dHIoIGxheWVyX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApXG4gICAgICAgICAgICAqL1xuICAgICAgICB9IGVsc2UgaWYoZWxlbS50eXBlID09PSAnYmxvY2snKSB7XG4gICAgICAgICAgICAvLyBpZiBpdCBpcyBhIGJsb2NrLCBydW4gdGhpcyBmdW5jdGlvbiB0aHJvdWdoIGVhY2ggZWxlbWVudC5cbiAgICAgICAgICAgIGVsZW0uZHJhd2luZ19wYXJ0cy5mb3JFYWNoKCBmdW5jdGlvbihibG9ja19lbGVtLGlkKXtcbiAgICAgICAgICAgICAgICBzaG93X2VsZW1fYXJyYXkoYmxvY2tfZWxlbSwge3g6eCwgeTp5fSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3ZnX2VsZW07XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZGlzcGxheV9zdmc7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBmID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMnKTtcblxudmFyIGk7XG4vL3ZhciBzZXR0aW5nc0NhbGN1bGF0ZWQgPSByZXF1aXJlKCcuL3NldHRpbmdzQ2FsY3VsYXRlZC5qcycpO1xuXG4vLyBMb2FkICd1c2VyJyBkZWZpbmVkIHNldHRpbmdzXG4vL3ZhciBta19zZXR0aW5ncyA9IHJlcXVpcmUoJy4uL2RhdGEvc2V0dGluZ3MuanNvbi5qcycpO1xuLy9mLm1rX3NldHRpbmdzID0gbWtfc2V0dGluZ3M7XG5cbnZhciBzZXR0aW5ncyA9IHt9O1xuXG5zZXR0aW5ncy50ZW1wID0ge307XG5cbnNldHRpbmdzLnBlcm0gPSB7fTtcbnNldHRpbmdzLnBlcm0uZ2VvY29kZSA9IHt9O1xuc2V0dGluZ3MucGVybS5sb2NhdGlvbiA9IHt9O1xuc2V0dGluZ3MucGVybS5sb2NhdGlvbi5uZXdfYWRkcmVzcyA9IGZhbHNlO1xuc2V0dGluZ3MucGVybS5tYXBzID0ge307XG5cbnNldHRpbmdzLmNvbmZpZ19vcHRpb25zID0ge307XG5zZXR0aW5ncy5jb25maWdfb3B0aW9ucy5ORUNfdGFibGVzID0gcmVxdWlyZSgnLi4vZGF0YS90YWJsZXMuanNvbicpO1xuLy9jb25zb2xlLmxvZyhzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5ORUNfdGFibGVzKTtcblxuc2V0dGluZ3Muc3RhdGUgPSB7fTtcbnNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCA9IGZhbHNlO1xuXG5zZXR0aW5ncy5pbiA9IHt9O1xuXG5zZXR0aW5ncy5pbi5vcHQgPSB7fTtcbnNldHRpbmdzLmluLm9wdC5BQyA9IHt9O1xuc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzID0ge307XG5zZXR0aW5ncy5pbi5vcHQuQUMudHlwZXNbXCIxMjBWXCJdID0gW1wiZ3JvdW5kXCIsXCJuZXV0cmFsXCIsXCJMMVwiXTtcbnNldHRpbmdzLmluLm9wdC5BQy50eXBlc1tcIjI0MFZcIl0gPSBbXCJncm91bmRcIixcIm5ldXRyYWxcIixcIkwxXCIsXCJMMlwiXTtcbnNldHRpbmdzLmluLm9wdC5BQy50eXBlc1tcIjIwOFZcIl0gPSBbXCJncm91bmRcIixcIm5ldXRyYWxcIixcIkwxXCIsXCJMMlwiXTtcbnNldHRpbmdzLmluLm9wdC5BQy50eXBlc1tcIjI3N1ZcIl0gPSBbXCJncm91bmRcIixcIm5ldXRyYWxcIixcIkwxXCJdO1xuc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzW1wiNDgwViBXeWVcIl0gPSBbXCJncm91bmRcIixcIm5ldXRyYWxcIixcIkwxXCIsXCJMMlwiLFwiTDNcIl07XG5zZXR0aW5ncy5pbi5vcHQuQUMudHlwZXNbXCI0ODBWIERlbHRhXCJdID0gW1wiZ3JvdW5kXCIsXCJMMVwiLFwiTDJcIixcIkwzXCJdO1xuXG5zZXR0aW5ncy5pbnB1dHMgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5sb2NhdGlvbiA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLmxvY2F0aW9uLmNvdW50eSA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLmxvY2F0aW9uLmNvdW50eS50eXBlID0gJ3RleHRfaW5wdXQnO1xuc2V0dGluZ3MuaW5wdXRzLmxvY2F0aW9uLmFkZHJlc3MgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5sb2NhdGlvbi5hZGRyZXNzLnR5cGUgPSAndGV4dF9pbnB1dCc7XG5zZXR0aW5ncy5pbnB1dHMubG9jYXRpb24uY2l0eSA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLmxvY2F0aW9uLmNpdHkudHlwZSA9ICd0ZXh0X2lucHV0JztcbnNldHRpbmdzLmlucHV0cy5sb2NhdGlvbi56aXAgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5sb2NhdGlvbi56aXAudHlwZSA9ICd0ZXh0X2lucHV0Jztcblxuc2V0dGluZ3MuaW5wdXRzLnJvb2YgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5yb29mLndpZHRoID0ge307XG5zZXR0aW5ncy5pbnB1dHMucm9vZi53aWR0aC5vcHRpb25zID0gW107XG4vL2ZvciggaT0xNTsgaTw9NzA7IGkrPTUgKSBzZXR0aW5ncy5pbnB1dHMucm9vZi53aWR0aC5vcHRpb25zLnB1c2goaSk7XG5zZXR0aW5ncy5pbnB1dHMucm9vZi53aWR0aC51bml0cyA9ICdmdC4nO1xuc2V0dGluZ3MuaW5wdXRzLnJvb2Yud2lkdGgubm90ZSA9ICdUaGlzIHRoZSBmdWxsIHNpemUgb2YgdGhlIHJvb2YsIHBlcnBlbmRpY3R1bGFyIHRvIHRoZSBzbG9wZS4nO1xuc2V0dGluZ3MuaW5wdXRzLnJvb2Yud2lkdGgudHlwZSA9ICdudW1iZXJfaW5wdXQnO1xuc2V0dGluZ3MuaW5wdXRzLnJvb2YubGVuZ3RoID0ge307XG5zZXR0aW5ncy5pbnB1dHMucm9vZi5sZW5ndGgub3B0aW9ucyA9IFtdO1xuLy9mb3IoIGk9MTA7IGk8PTYwOyBpKz01ICkgc2V0dGluZ3MuaW5wdXRzLnJvb2YubGVuZ3RoLm9wdGlvbnMucHVzaChpKTtcbnNldHRpbmdzLmlucHV0cy5yb29mLmxlbmd0aC51bml0cyA9ICdmdC4nO1xuc2V0dGluZ3MuaW5wdXRzLnJvb2YubGVuZ3RoLm5vdGUgPSAnVGhpcyB0aGUgZnVsbCBsZW5ndGggb2YgdGhlIHJvb2YsIG1lYXN1cmVkIGZyb20gbG93IHRvIGhpZ2guJztcbnNldHRpbmdzLmlucHV0cy5yb29mLmxlbmd0aC50eXBlID0gJ251bWJlcl9pbnB1dCc7XG5zZXR0aW5ncy5pbnB1dHMucm9vZi5zbG9wZSA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLnJvb2Yuc2xvcGUub3B0aW9ucyA9IFsnMToxMicsJzI6MTInLCczOjEyJywnNDoxMicsJzU6MTInLCc2OjEyJywnNzoxMicsJzg6MTInLCc5OjEyJywnMTA6MTInLCcxMToxMicsJzEyOjEyJ107XG5zZXR0aW5ncy5pbnB1dHMucm9vZi50eXBlID0ge307XG5zZXR0aW5ncy5pbnB1dHMucm9vZi50eXBlLm9wdGlvbnMgPSBbJ0dhYmxlJywnU2hlZCcsJ0hpcHBlZCddO1xuc2V0dGluZ3MuaW5wdXRzLm1vZHVsZSA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5tYWtlID0ge307XG4vL3NldHRpbmdzLmlucHV0cy5tb2R1bGUubWFrZS5vcHRpb25zID0gbnVsbDtcbnNldHRpbmdzLmlucHV0cy5tb2R1bGUubW9kZWwgPSB7fTtcbi8vc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5tb2RlbC5vcHRpb25zID0gbnVsbDtcbnNldHRpbmdzLmlucHV0cy5tb2R1bGUub3JpZW50YXRpb24gPSB7fTtcbnNldHRpbmdzLmlucHV0cy5tb2R1bGUub3JpZW50YXRpb24ub3B0aW9ucyA9IFsnUG9ydHJhaXQnLCdMYW5kc2NhcGUnXTtcbnNldHRpbmdzLmlucHV0cy5hcnJheSA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZyA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZy5vcHRpb25zID0gWzEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDE4LDE5LDIwXTtcbnNldHRpbmdzLmlucHV0cy5hcnJheS5udW1fc3RyaW5ncyA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLmFycmF5Lm51bV9zdHJpbmdzLm9wdGlvbnMgPSBbMSwyLDMsNCw1LDZdO1xuc2V0dGluZ3MuaW5wdXRzLkRDID0ge307XG5zZXR0aW5ncy5pbnB1dHMuREMuaG9tZV9ydW5fbGVuZ3RoID0ge307XG4vL3NldHRpbmdzLmlucHV0cy5EQy5ob21lX3J1bl9sZW5ndGgub3B0aW9ucyA9IFsyNSw1MCw3NSwxMDAsMTI1LDE1MF07XG5zZXR0aW5ncy5pbnB1dHMuREMuaG9tZV9ydW5fbGVuZ3RoLnR5cGUgPSAnbnVtYmVyX2lucHV0JztcbnNldHRpbmdzLmlucHV0cy5pbnZlcnRlciA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLmludmVydGVyLm1ha2UgPSB7fTtcbi8vc2V0dGluZ3MuaW5wdXRzLmludmVydGVyLm1ha2Uub3B0aW9ucyA9IG51bGw7XG5zZXR0aW5ncy5pbnB1dHMuaW52ZXJ0ZXIubW9kZWwgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5pbnZlcnRlci5sb2NhdGlvbiA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLmludmVydGVyLmxvY2F0aW9uLm9wdGlvbnMgPSBbJ0luc2lkZScsICdPdXRzaWRlJ107XG4vL3NldHRpbmdzLmlucHV0cy5pbnZlcnRlci5tb2RlbC5vcHRpb25zID0gbnVsbDtcbnNldHRpbmdzLmlucHV0cy5BQyA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXMgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzWycyNDBWJ10gPSB7fTtcbnNldHRpbmdzLmlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzWycyNDBWJ10gPSBbJzI0MFYnLCcxMjBWJ107XG5zZXR0aW5ncy5pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlc1snMjA4LzEyMFYnXSA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbJzIwOC8xMjBWJ10gPSBbJzIwOFYnLCcxMjBWJ107XG5zZXR0aW5ncy5pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlc1snNDgwLzI3N1YnXSA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbJzQ4MC8yNzdWJ10gPSBbJzQ4MFYgV3llJywnNDgwViBEZWx0YScsJzI3N1YnXTtcbnNldHRpbmdzLmlucHV0cy5BQy50eXBlID0ge307XG4vL3NldHRpbmdzLmlucHV0cy5BQy50eXBlLm9wdGlvbnMgPSBudWxsO1xuc2V0dGluZ3MuaW5wdXRzLkFDLmRpc3RhbmNlX3RvX2xvYWRjZW50ZXIgPSB7fTtcbi8vc2V0dGluZ3MuaW5wdXRzLkFDLmRpc3RhbmNlX3RvX2xvYWRjZW50ZXIub3B0aW9ucyA9IFszLDUsMTAsMTUsMjAsMzBdO1xuc2V0dGluZ3MuaW5wdXRzLkFDLmRpc3RhbmNlX3RvX2xvYWRjZW50ZXIudHlwZSA9ICdudW1iZXJfaW5wdXQnO1xuXG5zZXR0aW5ncy5pbnB1dHMuYXR0YWNobWVudF9zeXN0ZW0gPSB7fTtcbnNldHRpbmdzLmlucHV0cy5hdHRhY2htZW50X3N5c3RlbS5tYWtlID0ge1xuICAgIG9wdGlvbnM6IFsnVU5JUkFDJ10sXG4gICAgdHlwZTogJ3NlbGVjdCcsXG59O1xuc2V0dGluZ3MuaW5wdXRzLmF0dGFjaG1lbnRfc3lzdGVtLm1vZGVsID0ge1xuICAgIG9wdGlvbnM6IFsnU09MQVJNT1VOVCddLFxuICAgIHR5cGU6ICdzZWxlY3QnLFxufTtcblxuXG5cblxuXG4vL3NldHRpbmdzLmlucHV0cyA9IHNldHRpbmdzLmlucHV0czsgLy8gY29weSBpbnB1dCByZWZlcmVuY2Ugd2l0aCBvcHRpb25zIHRvIGlucHV0c1xuLy9zZXR0aW5ncy5pbnB1dHMgPSBmLmJsYW5rX2NvcHkoc2V0dGluZ3MuaW5wdXRzKTsgLy8gbWFrZSBpbnB1dCBzZWN0aW9uIGJsYW5rXG4vL3NldHRpbmdzLnN5c3RlbV9mb3JtdWxhcyA9IHNldHRpbmdzLnN5c3RlbTsgLy8gY29weSBzeXN0ZW0gcmVmZXJlbmNlIHRvIHN5c3RlbV9mb3JtdWxhc1xuc2V0dGluZ3Muc3lzdGVtID0gZi5ibGFua19jb3B5KHNldHRpbmdzLmlucHV0cyk7IC8vIG1ha2Ugc3lzdGVtIHNlY3Rpb24gYmxhbmtcbi8vZi5tZXJnZV9vYmplY3RzKCBzZXR0aW5ncy5pbnB1dHMsIHNldHRpbmdzLnN5c3RlbSApO1xuXG5cbi8vIGxvYWQgbGF5ZXJzXG5cbnNldHRpbmdzLmRyYXdpbmcgPSB7fTtcblxuc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncyA9IHt9O1xuc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sYXllcl9hdHRyID0gcmVxdWlyZSgnLi9zZXR0aW5nc19sYXllcnMnKTtcbnNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MuZm9udHMgPSByZXF1aXJlKCcuL3NldHRpbmdzX2ZvbnRzJyk7XG5cbnNldHRpbmdzLmRyYXdpbmcuYmxvY2tzID0ge307XG5cbi8vIExvYWQgZHJhd2luZyBzcGVjaWZpYyBzZXR0aW5nc1xuLy8gVE9ETyBGaXggc2V0dGluZ3NfZHJhd2luZyB3aXRoIG5ldyB2YXJpYWJsZSBsb2NhdGlvbnNcbnZhciBzZXR0aW5nc19kcmF3aW5nID0gcmVxdWlyZSgnLi9zZXR0aW5nc19kcmF3aW5nJyk7XG5zZXR0aW5ncyA9IHNldHRpbmdzX2RyYXdpbmcoc2V0dGluZ3MpO1xuXG4vL3NldHRpbmdzLnN0YXRlX2FwcC52ZXJzaW9uX3N0cmluZyA9IHZlcnNpb25fc3RyaW5nO1xuXG4vL3NldHRpbmdzID0gZi5udWxsVG9PYmplY3Qoc2V0dGluZ3MpO1xuXG5zZXR0aW5ncy5zZWxlY3RfcmVnaXN0cnkgPSBbXTtcbnNldHRpbmdzLnZhbHVlX3JlZ2lzdHJ5ID0gW107XG5cblxuLy92YXIgY29uZmlnX29wdGlvbnMgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucyA9IHNldHRpbmdzLmNvbmZpZ19vcHRpb25zIHx8IHt9O1xuXG5zZXR0aW5ncy53ZWJwYWdlID0ge307XG5zZXR0aW5ncy53ZWJwYWdlLnNlbGVjdGlvbnNfbWFudWFsX3RvZ2dsZWQgPSB7fTtcbnNldHRpbmdzLndlYnBhZ2Uuc2VjdGlvbnMgPSBPYmplY3Qua2V5cyhzZXR0aW5ncy5pbnB1dHMpO1xuXG5cbnNldHRpbmdzLndlYnBhZ2Uuc2VjdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oc2VjdGlvbl9uYW1lKXtcbiAgICBzZXR0aW5ncy53ZWJwYWdlLnNlbGVjdGlvbnNfbWFudWFsX3RvZ2dsZWRbc2VjdGlvbl9uYW1lXSA9IGZhbHNlO1xufSk7XG5cbnNldHRpbmdzLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbCA9IDA7XG5zZXR0aW5ncy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXMgPSB7fTtcblxuXG5cblxuc2V0dGluZ3MuY29tcG9uZW50cyA9IHt9O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBzZXR0aW5ncztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBzZXR0aW5nc19kcmF3aW5nKHNldHRpbmdzKXtcblxuICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG4gICAgdmFyIHN0YXR1cyA9IHNldHRpbmdzLnN0YXR1cztcblxuICAgIC8vIERyYXdpbmcgc3BlY2lmaWNcbiAgICAvL3NldHRpbmdzLmRyYXdpbmcgPSBzZXR0aW5ncy5kcmF3aW5nIHx8IHt9O1xuXG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZSA9IHt9O1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxvYyA9IHt9O1xuXG5cbiAgICAvLyBzaXplc1xuICAgIHNpemUuZHJhd2luZyA9IHtcbiAgICAgICAgdzogMTAwMCxcbiAgICAgICAgaDogNzgwLFxuICAgICAgICBmcmFtZV9wYWRkaW5nOiA1LFxuICAgICAgICB0aXRsZWJveDogNTAsXG4gICAgfTtcblxuICAgIHNpemUubW9kdWxlID0ge307XG4gICAgc2l6ZS5tb2R1bGUuZnJhbWUgPSB7XG4gICAgICAgIHc6IDEwLFxuICAgICAgICBoOiAzMCxcbiAgICB9O1xuICAgIHNpemUubW9kdWxlLmxlYWQgPSBzaXplLm1vZHVsZS5mcmFtZS53KjIvMztcbiAgICBzaXplLm1vZHVsZS5oID0gc2l6ZS5tb2R1bGUuZnJhbWUuaCArIHNpemUubW9kdWxlLmxlYWQqMjtcbiAgICBzaXplLm1vZHVsZS53ID0gc2l6ZS5tb2R1bGUuZnJhbWUudztcblxuICAgIHNpemUud2lyZV9vZmZzZXQgPSB7XG4gICAgICAgIGJhc2U6IDcsXG4gICAgICAgIGdhcDogc2l6ZS5tb2R1bGUudyxcbiAgICB9O1xuICAgIHNpemUud2lyZV9vZmZzZXQubWluID0gc2l6ZS53aXJlX29mZnNldC5iYXNlICogMTtcblxuICAgIHNpemUuc3RyaW5nID0ge307XG4gICAgc2l6ZS5zdHJpbmcuZ2FwID0gc2l6ZS5tb2R1bGUuZnJhbWUudy80MjtcbiAgICBzaXplLnN0cmluZy5nYXBfbWlzc2luZyA9IHNpemUubW9kdWxlLmg7XG4gICAgc2l6ZS5zdHJpbmcudyA9IHNpemUubW9kdWxlLmZyYW1lLncgKiAyLjU7XG5cbiAgICBzaXplLnRlcm1pbmFsX2RpYW0gPSA1O1xuICAgIHNpemUuZnVzZSA9IHt9O1xuICAgIHNpemUuZnVzZS53ID0gMTU7XG4gICAgc2l6ZS5mdXNlLmggPSA0O1xuXG5cbiAgICAvLyBJbnZlcnRlclxuICAgIHNpemUuaW52ZXJ0ZXIgPSB7IHc6IDI1MCwgaDogMTUwIH07XG4gICAgc2l6ZS5pbnZlcnRlci50ZXh0X2dhcCA9IDE1O1xuICAgIHNpemUuaW52ZXJ0ZXIuc3ltYm9sX3cgPSA1MDtcbiAgICBzaXplLmludmVydGVyLnN5bWJvbF9oID0gMjU7XG5cbiAgICBsb2MuaW52ZXJ0ZXIgPSB7XG4gICAgICAgIHg6IHNpemUuZHJhd2luZy53LzIsXG4gICAgICAgIHk6IHNpemUuZHJhd2luZy5oLzMsXG4gICAgfTtcbiAgICBsb2MuaW52ZXJ0ZXIuYm90dG9tID0gbG9jLmludmVydGVyLnkgKyBzaXplLmludmVydGVyLmgvMjtcbiAgICBsb2MuaW52ZXJ0ZXIudG9wID0gbG9jLmludmVydGVyLnkgLSBzaXplLmludmVydGVyLmgvMjtcbiAgICBsb2MuaW52ZXJ0ZXIuYm90dG9tX3JpZ2h0ID0ge1xuICAgICAgICB4OiBsb2MuaW52ZXJ0ZXIueCArIHNpemUuaW52ZXJ0ZXIudy8yLFxuICAgICAgICB5OiBsb2MuaW52ZXJ0ZXIueSArIHNpemUuaW52ZXJ0ZXIuaC8yLFxuICAgIH07XG5cbiAgICAvLyBhcnJheVxuICAgIGxvYy5hcnJheSA9IHtcbiAgICAgICAgeDogbG9jLmludmVydGVyLnggLSAyMDAsXG4gICAgICAgIHVwcGVyOiBsb2MuaW52ZXJ0ZXIueSAtIDIwLFxuICAgIH07XG4gICAgLy9sb2MuYXJyYXkudXBwZXIgPSBsb2MuYXJyYXkueSAtIHNpemUuc3RyaW5nLmgvMjtcbiAgICBsb2MuYXJyYXkucmlnaHQgPSBsb2MuYXJyYXkueCAtIHNpemUubW9kdWxlLmZyYW1lLmgqMztcblxuXG5cblxuICAgIGxvYy5EQyA9IGxvYy5hcnJheTtcblxuICAgIC8vIERDIGpiXG4gICAgc2l6ZS5qYl9ib3ggPSB7XG4gICAgICAgIGg6IDE1MCxcbiAgICAgICAgdzogODAsXG4gICAgfTtcbiAgICBsb2MuamJfYm94ID0ge1xuICAgICAgICB4OiAzNTAsXG4gICAgICAgIHk6IDU1MCxcbiAgICB9O1xuXG4gICAgLy8gREMgZGljb25lY3RcbiAgICBzaXplLmRpc2Nib3ggPSB7XG4gICAgICAgIHc6IDE0MCxcbiAgICAgICAgaDogNTAsXG4gICAgfTtcbiAgICBsb2MuZGlzY2JveCA9IHtcbiAgICAgICAgeDogbG9jLmludmVydGVyLnggLSBzaXplLmludmVydGVyLncvMiArIHNpemUuZGlzY2JveC53LzIsXG4gICAgICAgIHk6IGxvYy5pbnZlcnRlci55ICsgc2l6ZS5pbnZlcnRlci5oLzIgKyBzaXplLmRpc2Nib3guaC8yICsgMTAsXG4gICAgfTtcblxuICAgIC8vIEFDIGRpY29uZWN0XG4gICAgc2l6ZS5BQ19kaXNjID0geyB3OiA4MCwgaDogMTI1IH07XG5cbiAgICBsb2MuQUNfZGlzYyA9IHtcbiAgICAgICAgeDogbG9jLmludmVydGVyLngrMjAwLFxuICAgICAgICB5OiBsb2MuaW52ZXJ0ZXIueSsyNTBcbiAgICB9O1xuICAgIGxvYy5BQ19kaXNjLmJvdHRvbSA9IGxvYy5BQ19kaXNjLnkgKyBzaXplLkFDX2Rpc2MuaC8yO1xuICAgIGxvYy5BQ19kaXNjLnRvcCA9IGxvYy5BQ19kaXNjLnkgLSBzaXplLkFDX2Rpc2MuaC8yO1xuICAgIGxvYy5BQ19kaXNjLmxlZnQgPSBsb2MuQUNfZGlzYy54IC0gc2l6ZS5BQ19kaXNjLncvMjtcbiAgICBsb2MuQUNfZGlzYy5zd2l0Y2hfdG9wID0gbG9jLkFDX2Rpc2MudG9wICsgMTU7XG4gICAgbG9jLkFDX2Rpc2Muc3dpdGNoX2JvdHRvbSA9IGxvYy5BQ19kaXNjLnN3aXRjaF90b3AgKyAzMDtcblxuXG4gICAgLy8gQUMgcGFuZWxcblxuICAgIGxvYy5BQ19sb2FkY2VudGVyID0ge1xuICAgICAgICB4OiBsb2MuaW52ZXJ0ZXIueCszNTAsXG4gICAgICAgIHk6IGxvYy5pbnZlcnRlci55KzEwMFxuICAgIH07XG4gICAgc2l6ZS5BQ19sb2FkY2VudGVyID0geyB3OiAxMjUsIGg6IDMwMCB9O1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLmxlZnQgPSBsb2MuQUNfbG9hZGNlbnRlci54IC0gc2l6ZS5BQ19sb2FkY2VudGVyLncvMjtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci50b3AgPSBsb2MuQUNfbG9hZGNlbnRlci55IC0gc2l6ZS5BQ19sb2FkY2VudGVyLmgvMjtcblxuXG4gICAgc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIgPSB7IHc6IDIwLCBoOiBzaXplLnRlcm1pbmFsX2RpYW0sIH07XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMgPSB7XG4gICAgICAgIGxlZnQ6IGxvYy5BQ19sb2FkY2VudGVyLnggLSAoIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyLncgKiAxLjEgKSxcbiAgICB9O1xuICAgIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VycyA9IHtcbiAgICAgICAgbnVtOiAyMCxcbiAgICAgICAgc3BhY2luZzogc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIuaCArIDEsXG4gICAgfTtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy50b3AgPSBsb2MuQUNfbG9hZGNlbnRlci50b3AgKyBzaXplLkFDX2xvYWRjZW50ZXIuaC81O1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLmJvdHRvbSA9IGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnRvcCArIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5zcGFjaW5nKnNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5udW07XG5cblxuICAgIHNpemUuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyID0geyB3OjUsIGg6NDAgfTtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyID0ge1xuICAgICAgICB4OiBsb2MuQUNfbG9hZGNlbnRlci5sZWZ0ICsgMjAsXG4gICAgICAgIHk6IGxvYy5BQ19sb2FkY2VudGVyLnkgKyBzaXplLkFDX2xvYWRjZW50ZXIuaCowLjNcbiAgICB9O1xuXG4gICAgc2l6ZS5BQ19sb2FkY2VudGVyLmdyb3VuZGJhciA9IHsgdzo0MCwgaDo1IH07XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyID0ge1xuICAgICAgICB4OiBsb2MuQUNfbG9hZGNlbnRlci54ICsgMTAsXG4gICAgICAgIHk6IGxvYy5BQ19sb2FkY2VudGVyLnkgKyBzaXplLkFDX2xvYWRjZW50ZXIuaCowLjQ1XG4gICAgfTtcblxuICAgIGxvYy5BQ19jb25kdWl0ID0ge1xuICAgICAgICB5OiBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy5ib3R0b20gLSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMuc3BhY2luZy8yLFxuICAgIH07XG5cblxuICAgIC8vIHdpcmUgdGFibGVcbiAgICBsb2Mud2lyZV90YWJsZSA9IHtcbiAgICAgICAgeDogc2l6ZS5kcmF3aW5nLncgLSBzaXplLmRyYXdpbmcudGl0bGVib3ggLSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyozIC0gMzI1LFxuICAgICAgICB5OiBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyozLFxuICAgIH07XG5cbiAgICAvLyB2b2x0YWdlIGRyb3AgdGFibGVcbiAgICBzaXplLnZvbHRfZHJvcF90YWJsZSA9IHt9O1xuICAgIHNpemUudm9sdF9kcm9wX3RhYmxlLncgPSAxNTA7XG4gICAgc2l6ZS52b2x0X2Ryb3BfdGFibGUuaCA9IDEwMDtcbiAgICBsb2Mudm9sdF9kcm9wX3RhYmxlID0ge307XG4gICAgbG9jLnZvbHRfZHJvcF90YWJsZS54ID0gc2l6ZS5kcmF3aW5nLncgLSBzaXplLnZvbHRfZHJvcF90YWJsZS53LzIgLSA5MDtcbiAgICBsb2Mudm9sdF9kcm9wX3RhYmxlLnkgPSBzaXplLmRyYXdpbmcuaCAtIHNpemUudm9sdF9kcm9wX3RhYmxlLmgvMiAtIDMwO1xuXG5cbiAgICAvLyB2b2x0YWdlIGRyb3AgdGFibGVcbiAgICBzaXplLmdlbmVyYWxfbm90ZXMgPSB7fTtcbiAgICBzaXplLmdlbmVyYWxfbm90ZXMudyA9IDE1MDtcbiAgICBzaXplLmdlbmVyYWxfbm90ZXMuaCA9IDEwMDtcbiAgICBsb2MuZ2VuZXJhbF9ub3RlcyA9IHt9O1xuICAgIGxvYy5nZW5lcmFsX25vdGVzLnggPSBzaXplLmdlbmVyYWxfbm90ZXMudy8yICsgMzA7XG4gICAgbG9jLmdlbmVyYWxfbm90ZXMueSA9IHNpemUuZ2VuZXJhbF9ub3Rlcy5oLzIgKyAzMDtcblxuXG5cblxuICAgIHNldHRpbmdzLnBhZ2VzID0ge307XG4gICAgc2V0dGluZ3MucGFnZXMubGV0dGVyID0ge1xuICAgICAgICB1bml0czogJ2luY2hlcycsXG4gICAgICAgIHc6IDExLjAsXG4gICAgICAgIGg6IDguNSxcbiAgICB9O1xuICAgIHNldHRpbmdzLnBhZ2UgPSBzZXR0aW5ncy5wYWdlcy5sZXR0ZXI7XG5cbiAgICBzZXR0aW5ncy5wYWdlcy5QREYgPSB7XG4gICAgICAgIHc6IHNldHRpbmdzLnBhZ2UudyAqIDcyLFxuICAgICAgICBoOiBzZXR0aW5ncy5wYWdlLmggKiA3MixcbiAgICB9O1xuXG4gICAgc2V0dGluZ3MucGFnZXMuUERGLnNjYWxlID0ge1xuICAgICAgICB4OiBzZXR0aW5ncy5wYWdlcy5QREYudyAvIHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS5kcmF3aW5nLncsXG4gICAgICAgIHk6IHNldHRpbmdzLnBhZ2VzLlBERi5oIC8gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcuaCxcbiAgICB9O1xuXG4gICAgaWYoIHNldHRpbmdzLnBhZ2VzLlBERi5zY2FsZS54IDwgc2V0dGluZ3MucGFnZXMuUERGLnNjYWxlLnkgKSB7XG4gICAgICAgIHNldHRpbmdzLnBhZ2Uuc2NhbGUgPSBzZXR0aW5ncy5wYWdlcy5QREYuc2NhbGUueDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzZXR0aW5ncy5wYWdlLnNjYWxlID0gc2V0dGluZ3MucGFnZXMuUERGLnNjYWxlLnk7XG4gICAgfVxuXG5cbiAgICBsb2MucHJldmlldyA9IGxvYy5wcmV2aWV3IHx8IHt9O1xuICAgIGxvYy5wcmV2aWV3LmFycmF5ID0gbG9jLnByZXZpZXcuYXJyYXkgPSB7fTtcbiAgICBsb2MucHJldmlldy5hcnJheS50b3AgPSAxMDA7XG4gICAgbG9jLnByZXZpZXcuYXJyYXkubGVmdCA9IDUwO1xuXG4gICAgbG9jLnByZXZpZXcuREMgPSBsb2MucHJldmlldy5EQyA9IHt9O1xuICAgIGxvYy5wcmV2aWV3LmludmVydGVyID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIgPSB7fTtcbiAgICBsb2MucHJldmlldy5BQyA9IGxvYy5wcmV2aWV3LkFDID0ge307XG5cbiAgICBzaXplLnByZXZpZXcgPSBzaXplLnByZXZpZXcgfHwge307XG4gICAgc2l6ZS5wcmV2aWV3Lm1vZHVsZSA9IHtcbiAgICAgICAgdzogMTUsXG4gICAgICAgIGg6IDI1LFxuICAgIH07XG4gICAgc2l6ZS5wcmV2aWV3LkRDID0ge1xuICAgICAgICB3OiAzMCxcbiAgICAgICAgaDogNTAsXG4gICAgfTtcbiAgICBzaXplLnByZXZpZXcuaW52ZXJ0ZXIgPSB7XG4gICAgICAgIHc6IDE1MCxcbiAgICAgICAgaDogNzUsXG4gICAgfTtcbiAgICBzaXplLnByZXZpZXcuQUMgPSB7XG4gICAgICAgIHc6IDMwLFxuICAgICAgICBoOiA1MCxcbiAgICB9O1xuICAgIHNpemUucHJldmlldy5sb2FkY2VudGVyID0ge1xuICAgICAgICB3OiA1MCxcbiAgICAgICAgaDogMTAwLFxuICAgIH07XG5cblxuXG4gIHJldHVybiBzZXR0aW5ncztcblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gc2V0dGluZ3NfZHJhd2luZztcbiIsIi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ25cbmlmICghT2JqZWN0LmFzc2lnbikge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0LCBcImFzc2lnblwiLCB7XG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiBmdW5jdGlvbih0YXJnZXQsIGZpcnN0U291cmNlKSB7XG4gICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY29udmVydCBmaXJzdCBhcmd1bWVudCB0byBvYmplY3RcIik7XG4gICAgICB2YXIgdG8gPSBPYmplY3QodGFyZ2V0KTtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBuZXh0U291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBpZiAobmV4dFNvdXJjZSA9PT0gdW5kZWZpbmVkIHx8IG5leHRTb3VyY2UgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgICAgICB2YXIga2V5c0FycmF5ID0gT2JqZWN0LmtleXMoT2JqZWN0KG5leHRTb3VyY2UpKTtcbiAgICAgICAgZm9yICh2YXIgbmV4dEluZGV4ID0gMCwgbGVuID0ga2V5c0FycmF5Lmxlbmd0aDsgbmV4dEluZGV4IDwgbGVuOyBuZXh0SW5kZXgrKykge1xuICAgICAgICAgIHZhciBuZXh0S2V5ID0ga2V5c0FycmF5W25leHRJbmRleF07XG4gICAgICAgICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG5leHRTb3VyY2UsIG5leHRLZXkpO1xuICAgICAgICAgIGlmIChkZXNjICE9PSB1bmRlZmluZWQgJiYgZGVzYy5lbnVtZXJhYmxlKSB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0bztcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vL1xuLy8gZm9udHNcblxudmFyIGZvbnRzID0ge307XG5cbmZvbnRzWydzaWducyddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgNSxcbiAgICAndGV4dC1hbmNob3InOiAgICdtaWRkbGUnLFxufTtcbmZvbnRzWydsYWJlbCddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTIsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5mb250c1sndGl0bGUxJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAxNCxcbiAgICAndGV4dC1hbmNob3InOiAgICdsZWZ0Jyxcbn07XG5mb250c1sndGl0bGUyJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAxMixcbiAgICAndGV4dC1hbmNob3InOiAgICdsZWZ0Jyxcbn07XG5mb250c1sndGl0bGUzJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAxMCxcbiAgICAndGV4dC1hbmNob3InOiAgICdsZWZ0Jyxcbn07XG5mb250c1sncGFnZSddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMjAsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5mb250c1sndGFibGUnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnc2VyaWYnLFxuICAgICdmb250LXNpemUnOiAgICAgOCxcbiAgICAndGV4dC1hbmNob3InOiAgICdtaWRkbGUnLFxufTtcbmZvbnRzWyd0YWJsZV9sZWZ0J10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ3NlcmlmJyxcbiAgICAnZm9udC1zaXplJzogICAgIDgsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbGVmdCcsXG59O1xuZm9udHNbJ3RhYmxlX2xhcmdlX2xlZnQnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDE0LFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ2xlZnQnLFxufTtcbmZvbnRzWyd0YWJsZV9sYXJnZSddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTQsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5mb250c1sncHJvamVjdCB0aXRsZSddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTYsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5mb250c1sncHJldmlldyB0ZXh0J10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZScgIDogMjAsXG4gICAgJ3RleHQtYW5jaG9yJzogJ21pZGRsZScsXG59O1xuZm9udHNbJ2RpbWVudGlvbiddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnICA6IDIwLFxuICAgICd0ZXh0LWFuY2hvcic6ICdtaWRkbGUnLFxufTtcblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvbnRzO1xuIiwiLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnblxuaWYgKCFPYmplY3QuYXNzaWduKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPYmplY3QsIFwiYXNzaWduXCIsIHtcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgdmFsdWU6IGZ1bmN0aW9uKHRhcmdldCwgZmlyc3RTb3VyY2UpIHtcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PT0gbnVsbClcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjb252ZXJ0IGZpcnN0IGFyZ3VtZW50IHRvIG9iamVjdFwiKTtcbiAgICAgIHZhciB0byA9IE9iamVjdCh0YXJnZXQpO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5leHRTb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGlmIChuZXh0U291cmNlID09PSB1bmRlZmluZWQgfHwgbmV4dFNvdXJjZSA9PT0gbnVsbCkgY29udGludWU7XG4gICAgICAgIHZhciBrZXlzQXJyYXkgPSBPYmplY3Qua2V5cyhPYmplY3QobmV4dFNvdXJjZSkpO1xuICAgICAgICBmb3IgKHZhciBuZXh0SW5kZXggPSAwLCBsZW4gPSBrZXlzQXJyYXkubGVuZ3RoOyBuZXh0SW5kZXggPCBsZW47IG5leHRJbmRleCsrKSB7XG4gICAgICAgICAgdmFyIG5leHRLZXkgPSBrZXlzQXJyYXlbbmV4dEluZGV4XTtcbiAgICAgICAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobmV4dFNvdXJjZSwgbmV4dEtleSk7XG4gICAgICAgICAgaWYgKGRlc2MgIT09IHVuZGVmaW5lZCAmJiBkZXNjLmVudW1lcmFibGUpIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRvO1xuICAgIH1cbiAgfSk7XG59XG5cblxudmFyIGxheWVyX2F0dHIgPSB7fTtcblxubGF5ZXJfYXR0ci5iYXNlID0ge1xuICAgICdmaWxsJzogJ25vbmUnLFxuICAgICdzdHJva2UnOicjMDAwMDAwJyxcbiAgICAnc3Ryb2tlLXdpZHRoJzonMXB4JyxcbiAgICAnc3Ryb2tlLWxpbmVjYXAnOididXR0JyxcbiAgICAnc3Ryb2tlLWxpbmVqb2luJzonbWl0ZXInLFxuICAgICdzdHJva2Utb3BhY2l0eSc6MSxcblxufTtcbmxheWVyX2F0dHIuYmxvY2sgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLmZyYW1lID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5mcmFtZS5zdHJva2UgPSAnIzAwMDA0Mic7XG5sYXllcl9hdHRyLnRhYmxlID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci50YWJsZS5zdHJva2UgPSAnIzAwMDAwMCc7XG5cbmxheWVyX2F0dHIuRENfaW50ZXJtb2R1bGUgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKSx7XG4gICAgc3Ryb2tlOiAnI2JlYmViZScsXG4gICAgXCJzdHJva2UtZGFzaGFycmF5XCI6IFwiMSwgMVwiLFxuXG5cbn0pO1xuXG5sYXllcl9hdHRyLkRDX3BvcyA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuRENfcG9zLnN0cm9rZSA9ICcjZmYwMDAwJztcbmxheWVyX2F0dHIuRENfbmVnID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5EQ19uZWcuc3Ryb2tlID0gJyMwMDAwMDAnO1xubGF5ZXJfYXR0ci5EQ19ncm91bmQgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkRDX2dyb3VuZC5zdHJva2UgPSAnIzAwNjYwMCc7XG5sYXllcl9hdHRyLm1vZHVsZSA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuYm94ID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xuXG5cblxubGF5ZXJfYXR0ci50ZXh0ID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci50ZXh0LnN0cm9rZSA9ICcjMDAwMGZmJztcbmxheWVyX2F0dHIudGVybWluYWwgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLmJvcmRlciA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcblxubGF5ZXJfYXR0ci5BQ19ncm91bmQgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkFDX2dyb3VuZC5zdHJva2UgPSAnIzAwOTkwMCc7XG5sYXllcl9hdHRyLkFDX25ldXRyYWwgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkFDX25ldXRyYWwuc3Ryb2tlID0gJyM5OTk3OTcnO1xubGF5ZXJfYXR0ci5BQ19MMSA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuQUNfTDEuc3Ryb2tlID0gJyMwMDAwMDAnO1xubGF5ZXJfYXR0ci5BQ19MMiA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuQUNfTDIuc3Ryb2tlID0gJyNGRjAwMDAnO1xubGF5ZXJfYXR0ci5BQ19MMyA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuQUNfTDMuc3Ryb2tlID0gJyMwMDAwRkYnO1xuXG5cbmxheWVyX2F0dHIucHJldmlldyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpLHtcbiAgICAnc3Ryb2tlLXdpZHRoJzogJzInLFxufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19tb2R1bGUgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyNmZmIzMDAnLFxuICAgIHN0cm9rZTogJ25vbmUnLFxufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19hcnJheSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6ICcjZmY1ZDAwJyxcbn0pO1xuXG5sYXllcl9hdHRyLnByZXZpZXdfREMgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgc3Ryb2tlOiAnI2IwOTJjNCcsXG59KTtcbmxheWVyX2F0dHIucHJldmlld19EQ19ib3ggPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyNiMDkyYzQnLFxuICAgIHN0cm9rZTogJ25vbmUnLFxufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19pbnZlcnRlciA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6JyM4NmM5NzQnLFxufSk7XG5sYXllcl9hdHRyLnByZXZpZXdfaW52ZXJ0ZXJfYm94ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjODZjOTc0JyxcbiAgICBzdHJva2U6ICdub25lJyxcbn0pO1xuXG5sYXllcl9hdHRyLnByZXZpZXdfQUMgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgc3Ryb2tlOiAnIzgxODhhMScsXG59KTtcblxubGF5ZXJfYXR0ci5wcmV2aWV3X0FDX2JveCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnIzgxODhhMScsXG4gICAgc3Ryb2tlOiAnbm9uZScsXG59KTtcblxubGF5ZXJfYXR0ci5wcmV2aWV3X3N0cnVjdHVyYWwgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgc3Ryb2tlOiAnIzAwMDAwMCcsXG59KTtcbmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX2RvdCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6ICcjMDAwMDAwJyxcbiAgICBcInN0cm9rZS1kYXNoYXJyYXlcIjogXCI1LCA1XCJcbn0pO1xubGF5ZXJfYXR0ci5wcmV2aWV3X3N0cnVjdHVyYWxfcG9seV91bnNlbGVjdGVkID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjZTFlMWUxJyxcbiAgICBzdHJva2U6ICdub25lJ1xufSk7XG5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3NlbGVjdGVkID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjZmZlN2NiJyxcbiAgICBzdHJva2U6ICdub25lJ1xufSk7XG5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3NlbGVjdGVkX2ZyYW1lZCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnI2ZmZTdjYicsXG4gICAgc3Ryb2tlOiAnIzAwMDAwMCdcbn0pO1xuXG5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGUgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyNmZmZmZmYnLFxuICAgIHN0cm9rZTogJ25vbmUnXG59KTtcbmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnIzgzOTdlOCcsXG4gICAgc3Ryb2tlOiAnI2RmZmFmZidcbn0pO1xuXG5sYXllcl9hdHRyLm5vcnRoX2Fycm93ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIHN0cm9rZTogJyMwMDAwMDAnLFxuICAgICdzdHJva2Utd2lkdGgnOiAxLFxuICAgICdzdHJva2UtbGluZWNhcCc6IFwicm91bmRcIixcbiAgICAnc3Ryb2tlLWxpbmVqb2luJzogXCJyb3VuZFwiLFxufSk7XG5sYXllcl9hdHRyLm5vcnRoX2xldHRlciA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6ICcjOTQ5NDk0JyxcbiAgICAnc3Ryb2tlLXdpZHRoJzogNSxcbiAgICAnc3Ryb2tlLWxpbmVjYXAnOiBcInJvdW5kXCIsXG4gICAgJ3N0cm9rZS1saW5lam9pbic6IFwicm91bmRcIixcbn0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gbGF5ZXJfYXR0cjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGYgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucycpO1xuLy92YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xuLy92YXIgZGlzcGxheV9zdmcgPSByZXF1aXJlKCcuL2Rpc3BsYXlfc3ZnJyk7XG5cbnZhciBvYmplY3RfZGVmaW5lZCA9IGYub2JqZWN0X2RlZmluZWQ7XG5cbnZhciBzZXR0aW5nc191cGRhdGUgPSBmdW5jdGlvbihzZXR0aW5ncykge1xuXG4gICAgLy9jb25zb2xlLmxvZygnLS0tc2V0dGluZ3MtLS0nLCBzZXR0aW5ncyk7XG4gICAgdmFyIGNvbmZpZ19vcHRpb25zID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnM7XG4gICAgdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIHN0YXRlID0gc2V0dGluZ3Muc3RhdGU7XG5cbiAgICB2YXIgaW5wdXRzID0gc2V0dGluZ3MuaW5wdXRzO1xuXG5cblxuXG5cbiAgICBpZiggc3RhdGUuZGF0YWJhc2VfbG9hZGVkICl7XG4gICAgICAgIGlucHV0cy5EQyA9IHNldHRpbmdzLmlucHV0cy5EQyB8fCB7fTtcbiAgICAgICAgaW5wdXRzLkRDLndpcmVfc2l6ZSA9IHNldHRpbmdzLmlucHV0cy5EQy53aXJlX3NpemUgfHwge307XG4gICAgICAgIGlucHV0cy5EQy53aXJlX3NpemUub3B0aW9ucyA9IGlucHV0cy5EQy53aXJlX3NpemUub3B0aW9ucyB8fCBmLm9ial9uYW1lcyhzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5ORUNfdGFibGVzWydDaCA5IFRhYmxlIDggQ29uZHVjdG9yIFByb3BlcnRpZXMnXSk7XG5cblxuICAgIH1cblxuICAgIC8vdmFyIHNob3dfZGVmYXVsdHMgPSBmYWxzZTtcbiAgICAvLy8qXG4gICAgaWYoIHN0YXRlLm1vZGUgPT09ICdkZXYnKXtcbiAgICAgICAgLy9zaG93X2RlZmF1bHRzID0gdHJ1ZTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnRGV2IG1vZGUgLSBkZWZhdWx0cyBvbicpO1xuXG4gICAgICAgIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyA9IHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyB8fCA0O1xuICAgICAgICBzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nID0gc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZyB8fCA2O1xuICAgICAgICBzeXN0ZW0uREMuaG9tZV9ydW5fbGVuZ3RoID0gc3lzdGVtLkRDLmhvbWVfcnVuX2xlbmd0aCB8fCA1MDtcblxuICAgICAgICBzeXN0ZW0ucm9vZi53aWR0aCAgPSBzeXN0ZW0ucm9vZi53aWR0aCB8fCA2MDtcbiAgICAgICAgc3lzdGVtLnJvb2YubGVuZ3RoID0gc3lzdGVtLnJvb2YubGVuZ3RoIHx8IDI1O1xuICAgICAgICBzeXN0ZW0ucm9vZi5zbG9wZSAgPSBzeXN0ZW0ucm9vZi5zbG9wZSB8fCBcIjY6MTJcIjtcbiAgICAgICAgc3lzdGVtLnJvb2YudHlwZSAgID0gc3lzdGVtLnJvb2YudHlwZSB8fCBcIkdhYmxlXCI7XG5cbiAgICAgICAgc3lzdGVtLmludmVydGVyLmxvY2F0aW9uID0gc3lzdGVtLmludmVydGVyLmxvY2F0aW9uICB8fCBcIkluc2lkZVwiO1xuXG4gICAgICAgIHN5c3RlbS5tb2R1bGUub3JpZW50YXRpb24gPSBzeXN0ZW0ubW9kdWxlLm9yaWVudGF0aW9uIHx8IFwiUG9ydHJhaXRcIjtcblxuICAgICAgICBzeXN0ZW0ubG9jYXRpb24uYWRkcmVzcyA9IHN5c3RlbS5sb2NhdGlvbi5hZGRyZXNzIHx8ICcxNjc5IENsZWFybGFrZSBSb2FkJztcbiAgICAgICAgc3lzdGVtLmxvY2F0aW9uLmNpdHkgICAgPSBzeXN0ZW0ubG9jYXRpb24uY2l0eSB8fCAnQ29jb2EnO1xuICAgICAgICBzeXN0ZW0ubG9jYXRpb24uemlwICAgICA9IHN5c3RlbS5sb2NhdGlvbi56aXAgfHwgJzMyOTIyJztcbiAgICAgICAgc3lzdGVtLmxvY2F0aW9uLmNvdW50eSAgID0gc3lzdGVtLmxvY2F0aW9uLmNvdW50eSB8fCAnQnJldmFyZCc7XG5cblxuICAgICAgICBpZiggc3RhdGUuZGF0YWJhc2VfbG9hZGVkICl7XG4gICAgICAgICAgICBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSA9IHN5c3RlbS5pbnZlcnRlci5tYWtlIHx8XG4gICAgICAgICAgICAgICAgJ1NNQSc7XG4gICAgICAgICAgICBzeXN0ZW0uaW52ZXJ0ZXIubW9kZWwgPSBzeXN0ZW0uaW52ZXJ0ZXIubW9kZWwgfHxcbiAgICAgICAgICAgICAgICAnU0kzMDAwJztcblxuICAgICAgICAgICAgc3lzdGVtLm1vZHVsZS5tYWtlID0gc3lzdGVtLm1vZHVsZS5tYWtlIHx8XG4gICAgICAgICAgICAgICAgZi5vYmpfbmFtZXMoIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlcyApWzBdO1xuICAgICAgICAgICAgLy9pZiggc3lzdGVtLm1vZHVsZS5tYWtlKSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVNb2RlbEFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZXNbc3lzdGVtLm1vZHVsZS5tYWtlXSk7XG4gICAgICAgICAgICBzeXN0ZW0ubW9kdWxlLm1vZGVsID0gc3lzdGVtLm1vZHVsZS5tb2RlbCB8fFxuICAgICAgICAgICAgICAgIGYub2JqX25hbWVzKCBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbc3lzdGVtLm1vZHVsZS5tYWtlXSApWzBdO1xuXG5cbiAgICAgICAgICAgIHN5c3RlbS5tb2R1bGUubW9kZWwgPSBzeXN0ZW0ubW9kdWxlLm1vZGVsIHx8XG4gICAgICAgICAgICAgICAgZi5vYmpfbmFtZXMoIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tzeXN0ZW0ubW9kdWxlLm1ha2VdIClbMF07XG5cbiAgICAgICAgICAgIHN5c3RlbS5BQy5sb2FkY2VudGVyX3R5cGVzID0gc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXMgfHxcbiAgICAgICAgICAgIC8vICAgIGYub2JqX25hbWVzKGlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzKVswXTtcbiAgICAgICAgICAgICAgICAnNDgwLzI3N1YnO1xuXG5cbiAgICAgICAgICAgIHN5c3RlbS5BQy50eXBlID0gc3lzdGVtLkFDLnR5cGUgfHwgJzQ4MFYgV3llJztcbiAgICAgICAgICAgIC8vc3lzdGVtLkFDLnR5cGUgPSBzeXN0ZW0uQUMudHlwZSB8fFxuICAgICAgICAgICAgLy8gICAgc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXNbc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXNdWzBdO1xuXG4gICAgICAgICAgICBzeXN0ZW0uQUMuZGlzdGFuY2VfdG9fbG9hZGNlbnRlciA9IHN5c3RlbS5BQy5kaXN0YW5jZV90b19sb2FkY2VudGVyIHx8XG4gICAgICAgICAgICAgICAgNTA7XG5cblxuICAgICAgICAgICAgc3lzdGVtLkRDLndpcmVfc2l6ZSA9IGlucHV0cy5EQy53aXJlX3NpemUub3B0aW9uc1szXTtcbiAgICAgICAgICAgIC8qXG5cbiAgICAgICAgICAgIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyTWFrZUFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVycyk7XG4gICAgICAgICAgICBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSA9IHN5c3RlbS5pbnZlcnRlci5tYWtlIHx8IE9iamVjdC5rZXlzKCBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnMgKVswXTtcbiAgICAgICAgICAgIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyTW9kZWxBcnJheSA9IGsub2JqSWRBcnJheShzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnNbc3lzdGVtLmludmVydGVyLm1ha2VdKTtcblxuICAgICAgICAgICAgc3lzdGVtLkFDX2xvYWRjZW50ZXJfdHlwZSA9IHN5c3RlbS5BQ19sb2FkY2VudGVyX3R5cGUgfHwgY29uZmlnX29wdGlvbnMuQUNfbG9hZGNlbnRlcl90eXBlX29wdGlvbnNbMF07XG4gICAgICAgICAgICAvLyovXG5cblxuICAgICAgICAgICAgc3lzdGVtLmF0dGFjaG1lbnRfc3lzdGVtLm1ha2UgPSBzeXN0ZW0uYXR0YWNobWVudF9zeXN0ZW0ubWFrZSB8fFxuICAgICAgICAgICAgICAgIGlucHV0cy5hdHRhY2htZW50X3N5c3RlbS5tYWtlLm9wdGlvbnNbMF07XG4gICAgICAgICAgICBzeXN0ZW0uYXR0YWNobWVudF9zeXN0ZW0ubW9kZWwgPSBzeXN0ZW0uYXR0YWNobWVudF9zeXN0ZW0ubW9kZWwgfHxcbiAgICAgICAgICAgICAgICBpbnB1dHMuYXR0YWNobWVudF9zeXN0ZW0ubW9kZWwub3B0aW9uc1swXTtcblxuICAgICAgICB9XG4gICAgfVxuICAgIC8vKi9cblxuXG4gICAgLy9jb25zb2xlLmxvZyhcInNldHRpbmdzX3VwZGF0ZVwiKTtcbiAgICAvL2NvbnNvbGUubG9nKHN5c3RlbS5tb2R1bGUubWFrZSk7XG5cbiAgICBpbnB1dHMubW9kdWxlLm1ha2Uub3B0aW9ucyA9IGYub2JqX25hbWVzKHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlcyk7XG4gICAgaWYoIHN5c3RlbS5tb2R1bGUubWFrZSApIHtcbiAgICAgICAgaW5wdXRzLm1vZHVsZS5tb2RlbC5vcHRpb25zICA9IGYub2JqX25hbWVzKCBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbc3lzdGVtLm1vZHVsZS5tYWtlXSApO1xuICAgIH1cblxuICAgIGlmKCBzeXN0ZW0ubW9kdWxlLm1vZGVsICkge1xuICAgICAgICB2YXIgc3BlY3MgPSBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbc3lzdGVtLm1vZHVsZS5tYWtlXVtzeXN0ZW0ubW9kdWxlLm1vZGVsXTtcbiAgICAgICAgZm9yKCB2YXIgc3BlY19uYW1lIGluIHNwZWNzICl7XG4gICAgICAgICAgICBpZiggc3BlY19uYW1lICE9PSAnbW9kdWxlX2lkJyApe1xuICAgICAgICAgICAgICAgIHN5c3RlbS5tb2R1bGVbc3BlY19uYW1lXSA9IHNwZWNzW3NwZWNfbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy9zeXN0ZW0ubW9kdWxlLnNwZWNzID0gc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzW3N5c3RlbS5tb2R1bGUubWFrZV1bc3lzdGVtLm1vZHVsZS5tb2RlbF07XG4gICAgfVxuXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdhcnJheScpICYmIGYuc2VjdGlvbl9kZWZpbmVkKCdtb2R1bGUnKSApe1xuICAgICAgICBzeXN0ZW0uYXJyYXkgPSBzeXN0ZW0uYXJyYXkgfHwge307XG4gICAgICAgIHN5c3RlbS5hcnJheS5pc2MgPSBzeXN0ZW0ubW9kdWxlLmlzYyAqIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncztcbiAgICAgICAgc3lzdGVtLmFycmF5LnZvYyA9IHN5c3RlbS5tb2R1bGUudm9jICogc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZztcbiAgICAgICAgc3lzdGVtLmFycmF5LmltcCA9IHN5c3RlbS5tb2R1bGUuaW1wICogc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzO1xuICAgICAgICBzeXN0ZW0uYXJyYXkudm1wID0gc3lzdGVtLm1vZHVsZS52bXAgKiBzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nO1xuICAgICAgICBzeXN0ZW0uYXJyYXkucG1wID0gc3lzdGVtLmFycmF5LnZtcCAgKiBzeXN0ZW0uYXJyYXkuaW1wO1xuXG4gICAgICAgIHN5c3RlbS5hcnJheS5udW1iZXJfb2ZfbW9kdWxlcyA9IHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgKiBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3M7XG5cblxuICAgIH1cblxuXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdEQycpICl7XG5cbiAgICAgICAgc3lzdGVtLkRDLndpcmVfc2l6ZSA9IFwiLVVuZGVmaW5lZC1cIjtcblxuICAgIH1cblxuICAgIGlucHV0cy5pbnZlcnRlci5tYWtlLm9wdGlvbnMgPSBmLm9ial9uYW1lcyhzZXR0aW5ncy5jb21wb25lbnRzLmludmVydGVycyk7XG4gICAgaWYoIHN5c3RlbS5pbnZlcnRlci5tYWtlICkge1xuICAgICAgICBpbnB1dHMuaW52ZXJ0ZXIubW9kZWwub3B0aW9ucyA9IGYub2JqX25hbWVzKCBzZXR0aW5ncy5jb21wb25lbnRzLmludmVydGVyc1tzeXN0ZW0uaW52ZXJ0ZXIubWFrZV0gKTtcbiAgICB9XG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdpbnZlcnRlcicpICl7XG5cbiAgICB9XG5cbiAgICAvL2lucHV0cy5BQy5sb2FkY2VudGVyX3R5cGUgPSBzZXR0aW5ncy5mLm9ial9uYW1lcyhpbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlcyk7XG4gICAgaWYoIHN5c3RlbS5BQy5sb2FkY2VudGVyX3R5cGVzICkge1xuICAgICAgICB2YXIgbG9hZGNlbnRlcl90eXBlID0gc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXM7XG4gICAgICAgIHZhciBBQ19vcHRpb25zID0gaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbbG9hZGNlbnRlcl90eXBlXTtcbiAgICAgICAgaW5wdXRzLkFDLnR5cGUub3B0aW9ucyA9IEFDX29wdGlvbnM7XG4gICAgICAgIC8vaW4ub3B0LkFDLnR5cGVzW2xvYWRjZW50ZXJfdHlwZV07XG5cbiAgICAgICAgLy9pbnB1dHMuQUNbJ3R5cGUnXSA9IGYub2JqX25hbWVzKCBzZXR0aW5ncy5pbi5vcHQuQUMudHlwZSApO1xuICAgIH1cbiAgICBpZiggc3lzdGVtLkFDLnR5cGUgKSB7XG4gICAgICAgIHN5c3RlbS5BQy5jb25kdWN0b3JzID0gc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzW3N5c3RlbS5BQy50eXBlXTtcbiAgICAgICAgc3lzdGVtLkFDLm51bV9jb25kdWN0b3JzID0gc3lzdGVtLkFDLmNvbmR1Y3RvcnMubGVuZ3RoO1xuXG4gICAgfVxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnQUMnKSApe1xuXG4gICAgICAgIHN5c3RlbS5BQy53aXJlX3NpemUgPSBcIi1VbmRlZmluZWQtXCI7XG4gICAgfVxuXG4gICAgc2l6ZS53aXJlX29mZnNldC5tYXggPSBzaXplLndpcmVfb2Zmc2V0Lm1pbiArIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyAqIHNpemUud2lyZV9vZmZzZXQuYmFzZTtcbiAgICBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCA9IHNpemUud2lyZV9vZmZzZXQubWF4ICsgc2l6ZS53aXJlX29mZnNldC5iYXNlKjE7XG4gICAgbG9jLmFycmF5LmxlZnQgPSBsb2MuYXJyYXkucmlnaHQgLSAoIHNpemUuc3RyaW5nLncgKiBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgKSAtICggc2l6ZS5tb2R1bGUuZnJhbWUudyozLzQgKSA7XG5cblxuXG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ2xvY2F0aW9uJykgKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnYWRkcmVzcyByZWFkeScpO1xuICAgICAgICAvL2YucmVxdWVzdF9nZW9jb2RlKCk7XG4gICAgICAgIGcucGVybS5sb2NhdGlvbi5uZXdfYWRkcmVzcyA9IGZhbHNlO1xuICAgICAgICBmb3IoIHZhciBuYW1lIGluIGcuc3lzdGVtLmxvY2F0aW9uICl7XG4gICAgICAgICAgICBpZiggZy5zeXN0ZW0ubG9jYXRpb25bbmFtZV0gIT09IGcucGVybS5sb2NhdGlvbltuYW1lXSl7XG4gICAgICAgICAgICAgICAgZy5wZXJtLmxvY2F0aW9uLm5ld19hZGRyZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGcucGVybS5sb2NhdGlvbltuYW1lXSA9IGcuc3lzdGVtLmxvY2F0aW9uW25hbWVdO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuXG5cbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldHRpbmdzX3VwZGF0ZTtcbiIsIlxuXG5cbmZ1bmN0aW9uIHNldHVwX3dlYnBhZ2UoKXtcbiAgICB2YXIgc2V0dGluZ3MgPSBnO1xuICAgIHZhciBmID0gZy5mO1xuXG4gICAgdmFyIHN5c3RlbV9mcmFtZV9pZCA9ICdzeXN0ZW1fZnJhbWUnO1xuICAgIHZhciB0aXRsZSA9ICdQViBkcmF3aW5nIHRlc3QnO1xuXG4gICAgZy5mLnNldHVwX2JvZHkodGl0bGUpO1xuXG4gICAgdmFyIHBhZ2UgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3BhZ2UnKS5hcHBlbmRUbygkKGRvY3VtZW50LmJvZHkpKTtcbiAgICAvL3BhZ2Uuc3R5bGUoJ3dpZHRoJywgKHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS5kcmF3aW5nLncrMjApLnRvU3RyaW5nKCkgKyAncHgnIClcblxuICAgIHZhciBzeXN0ZW1fZnJhbWUgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgc3lzdGVtX2ZyYW1lX2lkKS5hcHBlbmRUbyhwYWdlKTtcblxuXG4gICAgdmFyIGhlYWRlcl9jb250YWluZXIgPSAkKCc8ZGl2PicpLmFwcGVuZFRvKHN5c3RlbV9mcmFtZSk7XG4gICAgJCgnPHNwYW4+JykuaHRtbCgnUGxlYXNlIHNlbGVjdCB5b3VyIHN5c3RlbSBzcGVjIGJlbG93JykuYXR0cignY2xhc3MnLCAnY2F0ZWdvcnlfdGl0bGUnKS5hcHBlbmRUbyhoZWFkZXJfY29udGFpbmVyKTtcbiAgICAkKCc8c3Bhbj4nKS5odG1sKCcgfCAnKS5hcHBlbmRUbyhoZWFkZXJfY29udGFpbmVyKTtcbiAgICAvLyQoJzxpbnB1dD4nKS5hdHRyKCd0eXBlJywgJ2J1dHRvbicpLmF0dHIoJ3ZhbHVlJywgJ2NsZWFyIHNlbGVjdGlvbnMnKS5jbGljayh3aW5kb3cubG9jYXRpb24ucmVsb2FkKSxcbiAgICAkKCc8YT4nKS5hdHRyKCdocmVmJywgJ2phdmFzY3JpcHQ6d2luZG93LmxvY2F0aW9uLnJlbG9hZCgpJykuaHRtbCgnY2xlYXIgc2VsZWN0aW9ucycpLmFwcGVuZFRvKGhlYWRlcl9jb250YWluZXIpO1xuXG5cbiAgICAvLyBTeXN0ZW0gc2V0dXBcbiAgICAkKCc8ZGl2PicpLmh0bWwoJ1N5c3RlbSBTZXR1cCcpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25fdGl0bGUnKS5hcHBlbmRUbyhzeXN0ZW1fZnJhbWUpO1xuICAgIHZhciBjb25maWdfZnJhbWUgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2NvbmZpZ19mcmFtZScpLmFwcGVuZFRvKHN5c3RlbV9mcmFtZSk7XG5cbiAgICBnLmYuYWRkX3NlbGVjdG9ycyhzZXR0aW5ncywgY29uZmlnX2ZyYW1lKTtcbiAgICAvL2NvbnNvbGUubG9nKHNlY3Rpb25fc2VsZWN0b3IpO1xuXG5cblxuICAgIC8vdmFyIGxvY2F0aW9uX2RyYXdlciA9ICQoJyNzZWN0aW9uX2xvY2F0aW9uJykuY2hpbGRyZW4oJy5kcmF3ZXInKS5jaGlsZHJlbignLmRyYXdlcl9jb250ZW50Jyk7XG4gICAgLy9jb25zb2xlLmxvZyhsb2NhdGlvbl9kcmF3ZXIpO1xuXG5cbiAgICB2YXIgbWFwX2RpdiA9ICQoJzxkaXY+Jyk7XG4gICAgdmFyIG1hcF9kcmF3ZXIgPSBmLm1rX2RyYXdlcignbWFwJyxtYXBfZGl2KVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8uYXBwZW5kVG8oY29uZmlnX2ZyYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC5pbnNlcnRBZnRlciggJCgnI3NlY3Rpb25fbG9jYXRpb24nKSApO1xuICAgIG1hcF9kcmF3ZXIuY2hpbGRyZW4oJy5kcmF3ZXInKS5jaGlsZHJlbignLmRyYXdlcl9jb250ZW50Jykuc2xpZGVVcCgnZmFzdCcpO1xuXG5cblxuICAgIHZhciBsaXN0X2VsZW1lbnQgPSAkKCc8dWw+JykuYXBwZW5kVG8obWFwX2Rpdik7XG4gICAgJCgnPGxpPicpLmFwcGVuZFRvKGxpc3RfZWxlbWVudCkuYXBwZW5kKFxuICAgICAgICAkKCc8YT4nKVxuICAgICAgICAgICAgLnRleHQoJ1dpbmQgWm9uZSAnKVxuICAgICAgICAgICAgLmF0dHIoJ2hyZWYnLCAnaHR0cDovL3dpbmRzcGVlZC5hdGNvdW5jaWwub3JnLycpXG4gICAgICAgICAgICAuYXR0cigndGFyZ2V0JywgJ19ibGFuaycpXG4gICAgKTtcbiAgICAkKCc8bGk+JykuYXBwZW5kVG8obGlzdF9lbGVtZW50KS5hcHBlbmQoXG4gICAgICAgICQoJzxhPicpXG4gICAgICAgICAgICAudGV4dCgnQ2xpbWF0ZSBDb25kaXRpb25zJylcbiAgICAgICAgICAgIC5hdHRyKCdocmVmJywgJ2h0dHA6Ly93d3cuc29sYXJhYmNzLm9yZy9hYm91dC9wdWJsaWNhdGlvbnMvcmVwb3J0cy9leHBlZGl0ZWQtcGVybWl0L21hcC9pbmRleC5odG1sJylcbiAgICAgICAgICAgIC5hdHRyKCd0YXJnZXQnLCAnX2JsYW5rJylcbiAgICApO1xuXG5cbiAgICB2YXIgZ2VvY29kZV9kaXYgPSAkKCc8ZGl2PicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdnZW9jb2RlX2xpbmUnKVxuICAgICAgICAuYXBwZW5kVG8obWFwX2Rpdik7XG4gICAgJCgnPGE+JykuYXBwZW5kVG8oZ2VvY29kZV9kaXYpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdnZW9jb2RlX2J1dHRvbicpXG4gICAgICAgIC50ZXh0KCdGaW5kIGxvY2F0aW9uIGZyb20gYWRkcmVzcycpXG4gICAgICAgIC5hdHRyKCdocmVmJywgJyMnKVxuICAgICAgICAuY2xpY2soZi5yZXF1ZXN0X2dlb2NvZGUpO1xuICAgICQoJzxzcGFuPicpLmFwcGVuZFRvKGdlb2NvZGVfZGl2KVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnZ2VvY29kZV9kaXNwbGF5JylcbiAgICAgICAgLmF0dHIoJ2lkJywnZ2VvY29kZV9kaXNwbGF5JylcbiAgICAgICAgLnRleHQoJycpO1xuXG4gICAgJCgnPGRpdj4nKVxuICAgICAgICAuYXR0cignaWQnLCAnbWFwX3JvYWQnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwX3JvYWQnKVxuICAgICAgICAuYXR0cignc3R5bGUnLCAnd2lkdGg6NDg1cHg7aGVpZ2h0OjM4MHB4JylcbiAgICAgICAgLmFwcGVuZFRvKG1hcF9kaXYpO1xuICAgICQoJzxkaXY+JylcbiAgICAgICAgLmF0dHIoJ2lkJywgJ21hcF9zYXQnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnbWFwX3NhdCcpXG4gICAgICAgIC5hdHRyKCdzdHlsZScsICd3aWR0aDo0ODVweDtoZWlnaHQ6MzgwcHgnKVxuICAgICAgICAuYXBwZW5kVG8obWFwX2Rpdik7XG5cblxuICAgIHZhciBsYXRfZmxfY2VudGVyID0gMjcuNzU7XG4gICAgdmFyIGxvbl9mbF9jZW50ZXIgPSAtODQuMDtcblxuICAgIHZhciBsYXQgPSAyOC4zODczOTk7XG4gICAgdmFyIGxvbiA9IC04MC43NTc4MzM7XG4gICAgdmFyIGNvb3IgPSBbLTgwLjc1NzgzMywgMjguMzg3Mzk5XTtcblxuICAgIEwuQXdlc29tZU1hcmtlcnMuSWNvbi5wcm90b3R5cGUub3B0aW9ucy5wcmVmaXggPSAnZmEnO1xuICAgIHZhciBzdW5fbWFya2VyID0gTC5Bd2Vzb21lTWFya2Vycy5pY29uKHtcbiAgICAgICAgaWNvbjogJ3N1bi1vJyxcbiAgICAgICAgbWFya2VyQ29sb3I6ICdibHVlICAnLFxuICAgICAgICBpY29uQ29sb3I6ICd5ZWxsb3cnXG4gICAgfSk7XG5cbiAgICB2YXIgbWFwX3JvYWQgID0gZy5wZXJtLm1hcHMubWFwX3JvYWQgPSBMLm1hcCggJ21hcF9yb2FkJywge1xuICAgICAgICBjZW50ZXI6IFtsYXRfZmxfY2VudGVyLCBsb25fZmxfY2VudGVyXSxcbiAgICAgICAgem9vbTogNlxuICAgIH0pO1xuXG4gICAgTC50aWxlTGF5ZXIoICdodHRwOi8ve3N9Lm1xY2RuLmNvbS90aWxlcy8xLjAuMC9tYXAve3p9L3t4fS97eX0ucG5nJywge1xuICAgICAgICBhdHRyaWJ1dGlvbjogJyZjb3B5OyA8YSBocmVmPVwiaHR0cDovL29zbS5vcmcvY29weXJpZ2h0XCIgdGl0bGU9XCJPcGVuU3RyZWV0TWFwXCIgdGFyZ2V0PVwiX2JsYW5rXCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzIHwgVGlsZXMgQ291cnRlc3kgb2YgPGEgaHJlZj1cImh0dHA6Ly93d3cubWFwcXVlc3QuY29tL1wiIHRpdGxlPVwiTWFwUXVlc3RcIiB0YXJnZXQ9XCJfYmxhbmtcIj5NYXBRdWVzdDwvYT4gPGltZyBzcmM9XCJodHRwOi8vZGV2ZWxvcGVyLm1hcHF1ZXN0LmNvbS9jb250ZW50L29zbS9tcV9sb2dvLnBuZ1wiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiPicsXG4gICAgICAgIHN1YmRvbWFpbnM6IFsnb3RpbGUxJywnb3RpbGUyJywnb3RpbGUzJywnb3RpbGU0J11cbiAgICB9KS5hZGRUbyggbWFwX3JvYWQgKTtcblxuICAgIGcucGVybS5tYXBzLm1hcmtlcl9yb2FkID0gTC5tYXJrZXIoW2xhdCxsb25dLCB7aWNvbjogc3VuX21hcmtlcn0pLmFkZFRvKG1hcF9yb2FkKTtcblxuICAgIG1hcF9yb2FkLm9uKCdjbGljaycsIGYuc2V0X2Nvb3JkaW5hdGVzX2Zyb21fbWFwICk7XG5cblxuXG5cbiAgICB2YXIgbWFwX3NhdCA9IGcucGVybS5tYXBzLm1hcF9zYXQgPSBMLm1hcCggJ21hcF9zYXQnLCB7XG4gICAgICAgIGNlbnRlcjogW2xhdCwgbG9uXSxcbiAgICAgICAgem9vbTogMTZcbiAgICB9KTtcbiAgICBMLnRpbGVMYXllciggJ2h0dHA6Ly97c30ubXFjZG4uY29tL3RpbGVzLzEuMC4wL3NhdC97en0ve3h9L3t5fS5wbmcnLCB7XG4gICAgICAgIHN1YmRvbWFpbnM6IFsnb3RpbGUxJywnb3RpbGUyJywnb3RpbGUzJywnb3RpbGU0J11cbiAgICB9KS5hZGRUbyggbWFwX3NhdCApO1xuXG4gICAgZy5wZXJtLm1hcHMubWFya2VyX3NhdCA9IEwubWFya2VyKFtsYXQsbG9uXSwge2ljb246IHN1bl9tYXJrZXJ9KS5hZGRUbyhtYXBfc2F0KTtcblxuICAgIG1hcF9zYXQub24oJ2NsaWNrJywgZi5zZXRfY29vcmRpbmF0ZXNfZnJvbV9tYXAgKTtcblxuXG5cblxuXG5cbiAgICB2YXIgZHJhd2luZ19wcmV2aWV3ID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkcmF3aW5nX2ZyYW1lX3ByZXZpZXcnKS5hcHBlbmRUbyhwYWdlKTtcbiAgICAkKCc8ZGl2PicpLmh0bWwoJ1ByZXZpZXcnKS5hdHRyKCdjbGFzcycsICdzZWN0aW9uX3RpdGxlJykuYXBwZW5kVG8oZHJhd2luZ19wcmV2aWV3KTtcbiAgICAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2RyYXdpbmdfcHJldmlldycpLmF0dHIoJ2NsYXNzJywgJ2RyYXdpbmcnKS5jc3MoJ2NsZWFyJywgJ2JvdGgnKS5hcHBlbmRUbyhkcmF3aW5nX3ByZXZpZXcpO1xuXG5cblxuXG5cbiAgICB2YXIgZHJhd2luZ19zZWN0aW9uID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkcmF3aW5nX2ZyYW1lJykuYXBwZW5kVG8ocGFnZSk7XG4gICAgLy9kcmF3aW5nLmNzcygnd2lkdGgnLCAoc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcudysyMCkudG9TdHJpbmcoKSArICdweCcgKTtcbiAgICAkKCc8ZGl2PicpLmh0bWwoJ0RyYXdpbmcnKS5hdHRyKCdjbGFzcycsICdzZWN0aW9uX3RpdGxlJykuYXBwZW5kVG8oZHJhd2luZ19zZWN0aW9uKTtcblxuXG4gICAgLy8kKCc8Zm9ybSBtZXRob2Q9XCJnZXRcIiBhY3Rpb249XCJkYXRhL3NhbXBsZS5wZGZcIj48YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5Eb3dubG9hZDwvYnV0dG9uPjwvZm9ybT4nKS5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pO1xuICAgIC8vJCgnPHNwYW4+JykuYXR0cignaWQnLCAnZG93bmxvYWQnKS5hdHRyKCdjbGFzcycsICdmbG9hdF9yaWdodCcpLmFwcGVuZFRvKGRyYXdpbmdfc2VjdGlvbik7XG4gICAgJCgnPGE+JylcbiAgICAgICAgLnRleHQoJ0Rvd25sb2FkIERyYXdpbmcgKHNhbXBsZSknKVxuICAgICAgICAuYXR0cignaHJlZicsICdzYW1wbGVfcGRmL3NhbXBsZS5wZGYnKVxuICAgICAgICAuYXR0cignaWQnLCAnZG93bmxvYWQnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnZmxvYXRfcmlnaHQnKVxuICAgICAgICAuYXR0cigndGFyZ2V0JywgJ19ibGFuaycpXG4gICAgICAgIC5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pO1xuXG4gICAgdmFyIHN2Z19jb250YWluZXJfb2JqZWN0ID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkcmF3aW5nJykuYXR0cignY2xhc3MnLCAnZHJhd2luZycpLmNzcygnY2xlYXInLCAnYm90aCcpLmFwcGVuZFRvKGRyYXdpbmdfc2VjdGlvbik7XG4gICAgLy9zdmdfY29udGFpbmVyX29iamVjdC5zdHlsZSgnd2lkdGgnLCBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy53KydweCcgKVxuICAgIC8vdmFyIHN2Z19jb250YWluZXIgPSBzdmdfY29udGFpbmVyX29iamVjdC5lbGVtO1xuICAgICQoJzxicj4nKS5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pO1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICQoJzxkaXY+JykuaHRtbCgnICcpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25fdGl0bGUnKS5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pO1xuXG59XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldHVwX3dlYnBhZ2U7XG4iLCJcblxudmFyIHVwZGF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHNldHRpbmdzID0gZztcbiAgICB2YXIgZiA9IGcuZjtcblxuICAgIGNvbnNvbGUubG9nKCcvLS0tIGJlZ2luIHVwZGF0ZScpO1xuICAgIGYuY2xlYXJfZHJhd2luZygpO1xuXG5cbiAgICBzZXR0aW5ncy5zZWxlY3RfcmVnaXN0cnkuZm9yRWFjaChmdW5jdGlvbihzZWxlY3Rvcil7XG4gICAgICAgIC8vY29uc29sZS5sb2coc2VsZWN0b3IudmFsdWUoKSk7XG4gICAgICAgIGlmKHNlbGVjdG9yLnZhbHVlKCkpIHNlbGVjdG9yLnN5c3RlbV9yZWYuc2V0KHNlbGVjdG9yLnZhbHVlKCkpO1xuICAgICAgICAvL2lmKHNlbGVjdG9yLnZhbHVlKCkpIHNlbGVjdG9yLmlucHV0X3JlZi5zZXQoc2VsZWN0b3IudmFsdWUoKSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coc2VsZWN0b3Iuc2V0X3JlZi5yZWZTdHJpbmcsIHNlbGVjdG9yLnZhbHVlKCksIHNlbGVjdG9yLnNldF9yZWYuZ2V0KCkpO1xuXG4gICAgfSk7XG5cbiAgICBpZiggZy5wZXJtLmxvY2F0aW9uLmxhdCAmJiBnLnBlcm0ubG9jYXRpb24ubG9uKSB7XG4gICAgICAgIGYuc2V0X3NhdF9tYXBfbWFya2VyKCk7XG4gICAgfVxuICAgIC8vY29weSBpbnB1dHMgZnJvbSBzZXR0aW5ncy5pbnB1dCB0byBzZXR0aW5ncy5zeXN0ZW0uXG5cblxuICAgIGYuc2V0dGluZ3NfdXBkYXRlKHNldHRpbmdzKTtcblxuICAgIHNldHRpbmdzLnNlbGVjdF9yZWdpc3RyeS5mb3JFYWNoKGZ1bmN0aW9uKHNlbGVjdG9yKXtcbiAgICAgICAgaWYoIHNlbGVjdG9yLnR5cGUgPT09ICdzZWxlY3QnICl7XG4gICAgICAgICAgICBmLnNlbGVjdG9yX2FkZF9vcHRpb25zKHNlbGVjdG9yKTtcbiAgICAgICAgfSBlbHNlIGlmKCBzZWxlY3Rvci50eXBlID09PSAnbnVtYmVyX2lucHV0JyB8fCBzZWxlY3Rvci50eXBlID09PSAndGV4dF9pbnB1dCcgKSB7XG4gICAgICAgICAgICBzZWxlY3Rvci5lbGVtLnZhbHVlID0gc2VsZWN0b3Iuc3lzdGVtX3JlZi5nZXQoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2V0dGluZ3MudmFsdWVfcmVnaXN0cnkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZV9pdGVtKXtcbiAgICAgICAgdmFsdWVfaXRlbS5lbGVtLmlubmVySFRNTCA9IHZhbHVlX2l0ZW0udmFsdWVfcmVmLmdldCgpO1xuICAgIH0pO1xuXG4gICAgLy8gRGV0ZXJtaW5lIGFjdGl2ZSBzZWN0aW9uIGJhc2VkIG9uIHNlY3Rpb24gaW5wdXRzIGVudGVyZWQgYnkgdXNlclxuICAgIHZhciBzZWN0aW9ucyA9IGcud2VicGFnZS5zZWN0aW9ucztcbiAgICB2YXIgYWN0aXZlX3NlY3Rpb247XG4gICAgc2VjdGlvbnMuZXZlcnkoZnVuY3Rpb24oc2VjdGlvbl9uYW1lLGlkKXsgLy9UT0RPOiBmaW5kIHByZSBJRTkgd2F5IHRvIGRvIHRoaXM/XG4gICAgICAgIGlmKCAhIGcuZi5zZWN0aW9uX2RlZmluZWQoc2VjdGlvbl9uYW1lKSApe1xuICAgICAgICAgICAgYWN0aXZlX3NlY3Rpb24gPSBzZWN0aW9uX25hbWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYWN0aXZlIHNlY3Rpb246Jywgc2VjdGlvbl9uYW1lKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKCBpZCA9PT0gc2VjdGlvbnMubGVuZ3RoLTEgKXsgLy9JZiBsYXN0IHNlY3Rpb24gaXMgZGVmaW5lZCwgdGhlcmUgaXMgbm8gYWN0aXZlIHNlY3Rpb25cbiAgICAgICAgICAgICAgICBhY3RpdmVfc2VjdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBDbG9zZSBzZWN0aW9uIGlmIHRoZXkgYXJlIG5vdCBhY3RpdmUgc2VjdGlvbnMsIHVubGVzcyB0aGV5IGhhdmUgYmVlbiBvcGVuZWQgYnkgdGhlIHVzZXIsIG9wZW4gdGhlIGFjdGl2ZSBzZWN0aW9uXG4gICAgc2VjdGlvbnMuZm9yRWFjaChmdW5jdGlvbihzZWN0aW9uX25hbWUsaWQpeyAvL1RPRE86IGZpbmQgcHJlIElFOSB3YXkgdG8gZG8gdGhpcz9cbiAgICAgICAgaWYoIHNlY3Rpb25fbmFtZSA9PT0gYWN0aXZlX3NlY3Rpb24gKXtcbiAgICAgICAgICAgICQoJyNzZWN0aW9uXycrc2VjdGlvbl9uYW1lKS5jaGlsZHJlbignLmRyYXdlcicpLmNoaWxkcmVuKCcuZHJhd2VyX2NvbnRlbnQnKS5zbGlkZURvd24oJ2Zhc3QnKTtcbiAgICAgICAgfSBlbHNlIGlmKCAhIGcud2VicGFnZS5zZWxlY3Rpb25zX21hbnVhbF90b2dnbGVkW3NlY3Rpb25fbmFtZV0gKXtcbiAgICAgICAgICAgICQoJyNzZWN0aW9uXycrc2VjdGlvbl9uYW1lKS5jaGlsZHJlbignLmRyYXdlcicpLmNoaWxkcmVuKCcuZHJhd2VyX2NvbnRlbnQnKS5zbGlkZVVwKCdmYXN0Jyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvL0lmIHRoZSBsb2NhdGlvbiBpcyBkZWZpbmVkLCBvcGVuIHRoZSBtYXAuXG4gICAgaWYoICghIGcud2VicGFnZS5zZWxlY3Rpb25zX21hbnVhbF90b2dnbGVkLmxvY2F0aW9uKSAmJiAgZy5mLnNlY3Rpb25fZGVmaW5lZCgnbG9jYXRpb24nKSApe1xuICAgICAgICAgICAgJCgnI3NlY3Rpb25fbWFwJykuY2hpbGRyZW4oJy5kcmF3ZXInKS5jaGlsZHJlbignLmRyYXdlcl9jb250ZW50Jykuc2xpZGVEb3duKCdmYXN0Jyk7XG4gICAgfVxuXG4gICAgLy8gTWFrZSBibG9ja3NcbiAgICBmLm1rX2Jsb2NrcygpO1xuXG4gICAgLy8gTWFrZSBwcmV2aWV3XG4gICAgc2V0dGluZ3MuZHJhd2luZy5wcmV2aWV3X3BhcnRzID0ge307XG4gICAgc2V0dGluZ3MuZHJhd2luZy5wcmV2aWV3X3N2Z3MgPSB7fTtcbiAgICAkKCcjZHJhd2luZ19wcmV2aWV3JykuZW1wdHkoKS5odG1sKCcnKTtcbiAgICBmb3IoIHZhciBwIGluIGYubWtfcHJldmlldyApe1xuICAgICAgICBzZXR0aW5ncy5kcmF3aW5nLnByZXZpZXdfcGFydHNbcF0gPSBmLm1rX3ByZXZpZXdbcF0oc2V0dGluZ3MpO1xuICAgICAgICBzZXR0aW5ncy5kcmF3aW5nLnByZXZpZXdfc3Znc1twXSA9IGYubWtfc3ZnKHNldHRpbmdzLmRyYXdpbmcucHJldmlld19wYXJ0c1twXSwgc2V0dGluZ3MpO1xuICAgICAgICB2YXIgc2VjdGlvbiA9IFsnJywnRWxlY3RyaWNhbCcsJ1N0cnVjdHVyYWwnXVtwXTtcbiAgICAgICAgJCgnI2RyYXdpbmdfcHJldmlldycpXG4gICAgICAgICAgICAvLy5hcHBlbmQoJCgnPHA+UGFnZSAnK3ArJzwvcD4nKSlcbiAgICAgICAgICAgIC5hcHBlbmQoJCgnPHA+JytzZWN0aW9uKyc8L3A+JykpXG4gICAgICAgICAgICAuYXBwZW5kKCQoc2V0dGluZ3MuZHJhd2luZy5wcmV2aWV3X3N2Z3NbcF0pKVxuICAgICAgICAgICAgLmFwcGVuZCgkKCc8L2JyPicpKVxuICAgICAgICAgICAgLmFwcGVuZCgkKCc8L2JyPicpKTtcblxuICAgIH1cblxuXG5cbiAgICAvLyBNYWtlIGRyYXdpbmdcbiAgICBzZXR0aW5ncy5kcmF3aW5nLnBhcnRzID0ge307XG4gICAgc2V0dGluZ3MuZHJhd2luZy5zdmdzID0ge307XG4gICAgJCgnI2RyYXdpbmcnKS5lbXB0eSgpLmh0bWwoJ0VsZWN0cmljYWwnKTtcbiAgICBmb3IoIHAgaW4gZi5ta19wYWdlICl7XG4gICAgICAgIHNldHRpbmdzLmRyYXdpbmcucGFydHNbcF0gPSBmLm1rX3BhZ2VbcF0oc2V0dGluZ3MpO1xuICAgICAgICBzZXR0aW5ncy5kcmF3aW5nLnN2Z3NbcF0gPSBmLm1rX3N2ZyhzZXR0aW5ncy5kcmF3aW5nLnBhcnRzW3BdLCBzZXR0aW5ncyk7XG4gICAgICAgICQoJyNkcmF3aW5nJylcbiAgICAgICAgICAgIC8vLmFwcGVuZCgkKCc8cD5QYWdlICcrcCsnPC9wPicpKVxuICAgICAgICAgICAgLmFwcGVuZCgkKHNldHRpbmdzLmRyYXdpbmcuc3Znc1twXSkpXG4gICAgICAgICAgICAuYXBwZW5kKCQoJzwvYnI+JykpXG4gICAgICAgICAgICAuYXBwZW5kKCQoJzwvYnI+JykpO1xuXG4gICAgfVxuXG5cbiAgICAvL3ZhciBzaXRlX3BsYW5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwiaW1hZ2VcIik7XG4gICAgLy92YXIgc2l0ZV9wbGFuX2ltZyA9ICQoc2l0ZV9wbGFuX2VsZW1lbnQpXG4gICAgLy8gICAgLmF0dHIoJ3gnLDEwMClcbiAgICAvLyAgICAuYXR0cigneScsMTAwKVxuICAgIC8vICAgIC5wcmVwZW5kVG8oXG4gICAgLy8gICAgICAgICQoJyNkcmF3aW5nJykuY2hpbGRyZW4oJy5zdmdfZHJhd2luZycpWzBdXG4gICAgLy8gICAgKTtcbiAgICAvL0xfUFJFRkVSX0NBTlZBUyA9IHRydWU7XG4gICAgLy92YXIgbWFwID0gZy5wZXJtLm1hcHMubWFwX3JvYWQ7XG4gICAgLy9sZWFmbGV0SW1hZ2UoIG1hcCwgZnVuY3Rpb24oZXJyLCBjYW52YXMpIHtcbiAgICAvLyAgICAvLyBub3cgeW91IGhhdmUgY2FudmFzXG4gICAgLy8gICAgLy8gZXhhbXBsZSB0aGluZyB0byBkbyB3aXRoIHRoYXQgY2FudmFzOlxuICAgIC8vICAgIHZhciBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAvLyAgICB2YXIgZGltZW5zaW9ucyA9IG1hcC5nZXRTaXplKCk7XG4gICAgLy8gICAgaW1nLndpZHRoID0gZGltZW5zaW9ucy54O1xuICAgIC8vICAgIGltZy5oZWlnaHQgPSBkaW1lbnNpb25zLnk7XG4gICAgLy8gICAgaW1nLnNyYyA9IGNhbnZhcy50b0RhdGFVUkwoKTtcbiAgICAvLyAgICBjb25zb2xlLmxvZyhpbWcpO1xuICAgIC8vICAgICQoJ2JvZHknKS5hcHBlbmQoaW1nKTtcbiAgICAvL30pO1xuXG5cbiAgICBjb25zb2xlLmxvZygnXFxcXC0tLSBlbmQgdXBkYXRlJyk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gdXBkYXRlO1xuIiwibW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9e1xuXG4gICAgXCJORUMgMjUwLjEyMl9oZWFkZXJcIjogW1wiQW1wXCIsXCJBV0dcIl0sXG4gICAgXCJORUMgMjUwLjEyMlwiOiB7XG4gICAgICAgIFwiMTVcIjpcIjE0XCIsXG4gICAgICAgIFwiMjBcIjpcIjEyXCIsXG4gICAgICAgIFwiMzBcIjpcIjEwXCIsXG4gICAgICAgIFwiNDBcIjpcIjEwXCIsXG4gICAgICAgIFwiNjBcIjpcIjEwXCIsXG4gICAgICAgIFwiMTAwXCI6XCI4XCIsXG4gICAgICAgIFwiMjAwXCI6XCI2XCIsXG4gICAgICAgIFwiMzAwXCI6XCI0XCIsXG4gICAgICAgIFwiNDAwXCI6XCIzXCIsXG4gICAgICAgIFwiNTAwXCI6XCIyXCIsXG4gICAgICAgIFwiNjAwXCI6XCIxXCIsXG4gICAgICAgIFwiODAwXCI6XCIxLzBcIixcbiAgICAgICAgXCIxMDAwXCI6XCIyLzBcIixcbiAgICAgICAgXCIxMjAwXCI6XCIzLzBcIixcbiAgICAgICAgXCIxNjAwXCI6XCI0LzBcIixcbiAgICAgICAgXCIyMDAwXCI6XCIyNTBcIixcbiAgICAgICAgXCIyNTAwXCI6XCIzNTBcIixcbiAgICAgICAgXCIzMDAwXCI6XCI0MDBcIixcbiAgICAgICAgXCI0MDAwXCI6XCI1MDBcIixcbiAgICAgICAgXCI1MDAwXCI6XCI3MDBcIixcbiAgICAgICAgXCI2MDAwXCI6XCI4MDBcIixcbiAgICB9LFxuXG4gICAgXCJORUMgVDY5MC43X2hlYWRlclwiOiBbXCJBbWJpZW50IFRlbXBlcmF0dXJlIChDKVwiLCBcIkNvcnJlY3Rpb24gRmFjdG9yXCJdLFxuICAgIFwiTkVDIFQ2OTAuN1wiOiB7XG4gICAgICAgIFwiMjUgdG8gMjBcIjpcIjEuMDJcIixcbiAgICAgICAgXCIxOSB0byAxNVwiOlwiMS4wNFwiLFxuICAgICAgICBcIjE1IHRvIDEwXCI6XCIxLjA2XCIsXG4gICAgICAgIFwiOSB0byA1XCI6XCIxLjA4XCIsXG4gICAgICAgIFwiNCB0byAwXCI6XCIxLjEwXCIsXG4gICAgICAgIFwiLTEgdG8gLTVcIjpcIjEuMTJcIixcbiAgICAgICAgXCItNiB0byAtMTBcIjpcIjEuMTRcIixcbiAgICAgICAgXCItMTEgdG8gLTE1XCI6XCIxLjE2XCIsXG4gICAgICAgIFwiLTE2IHRvIC0yMFwiOlwiMS4xOFwiLFxuICAgICAgICBcIi0yMSB0byAtMjVcIjpcIjEuMjBcIixcbiAgICAgICAgXCItMjYgdG8gLTMwXCI6XCIxLjIxXCIsXG4gICAgICAgIFwiLTMxIHRvIC0zNVwiOlwiMS4yM1wiLFxuICAgICAgICBcIi0zNiB0byAtNDBcIjpcIjEuMjVcIixcbiAgICB9LFxuXG4gICAgXCJDaCA5IFRhYmxlIDggQ29uZHVjdG9yIFByb3BlcnRpZXNfaGVhZGVyXCI6IFtcIlNpemVcIixcIm9obS9rZnRcIl0sXG4gICAgXCJDaCA5IFRhYmxlIDggQ29uZHVjdG9yIFByb3BlcnRpZXNcIjoge1xuICAgICAgICBcIiMwMVwiOlwiIDAuMTU0XCIsXG4gICAgICAgIFwiIzAxLzBcIjpcIjAuMTIyXCIsXG4gICAgICAgIFwiIzAyXCI6XCIwLjE5NFwiLFxuICAgICAgICBcIiMwMi8wXCI6XCIwLjA5NjdcIixcbiAgICAgICAgXCIjMDNcIjpcIjAuMjQ1XCIsXG4gICAgICAgIFwiIzAzLzBcIjpcIjAuMDc2NlwiLFxuICAgICAgICBcIiMwNFwiOlwiMC4zMDhcIixcbiAgICAgICAgXCIjMDQvMFwiOlwiMC4wNjA4XCIsXG4gICAgICAgIFwiIzA2XCI6XCIwLjQ5MVwiLFxuICAgICAgICBcIiMwOFwiOlwiMC43NzhcIixcbiAgICAgICAgXCIjMTBcIjpcIjEuMjRcIixcbiAgICAgICAgXCIjMTJcIjpcIjEuOThcIixcbiAgICAgICAgXCIjMTRcIjpcIjMuMTRcIixcbiAgICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBrb250YWluZXIgPSB7XG4gICAgcmVmOiBmdW5jdGlvbihyZWZTdHJpbmcpe1xuICAgICAgICBpZiggdHlwZW9mIHJlZlN0cmluZyA9PT0gJ3VuZGVmaW5lZCcgKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlZlN0cmluZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVmU3RyaW5nID0gcmVmU3RyaW5nO1xuICAgICAgICAgICAgdGhpcy5yZWZBcnJheSA9IHJlZlN0cmluZy5zcGxpdCgnLicpO1xuICAgICAgICAgICAgaWYoIHR5cGVvZiB0aGlzLm9iamVjdCAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBvYmo6IGZ1bmN0aW9uKG9iail7XG4gICAgICAgIGlmKCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vYmplY3QgPSBvYmo7XG4gICAgICAgICAgICBpZiggdHlwZW9mIHRoaXMucmVmU3RyaW5nICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24oaW5wdXQpe1xuICAgICAgICBpZiggdHlwZW9mIHRoaXMub2JqZWN0ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgdGhpcy5yZWZTdHJpbmcgPT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMub2JqZWN0O1xuICAgICAgICB2YXIgbGFzdF9sZXZlbCA9IHRoaXMucmVmQXJyYXlbdGhpcy5yZWZBcnJheS5sZW5ndGgtMV07XG5cbiAgICAgICAgdGhpcy5yZWZBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldmVsX25hbWUsaSl7XG4gICAgICAgICAgICBpZiggdHlwZW9mIHBhcmVudFtsZXZlbF9uYW1lXSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50W2xldmVsX25hbWVdID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiggbGV2ZWxfbmFtZSAhPT0gbGFzdF9sZXZlbCApe1xuICAgICAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudFtsZXZlbF9uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHBhcmVudFtsYXN0X2xldmVsXSA9IGlucHV0O1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdzZXR0aW5nOicsIGlucHV0LCB0aGlzLmdldCgpLCB0aGlzLnJlZlN0cmluZyApO1xuICAgICAgICByZXR1cm4gcGFyZW50W2xhc3RfbGV2ZWxdO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbGV2ZWwgPSB0aGlzLm9iamVjdDtcbiAgICAgICAgdGhpcy5yZWZBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldmVsX25hbWUsaSl7XG4gICAgICAgICAgICBpZiggdHlwZW9mIGxldmVsW2xldmVsX25hbWVdID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXZlbCA9IGxldmVsW2xldmVsX25hbWVdO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGxldmVsO1xuICAgIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtvbnRhaW5lcjtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vdmFyIHZlcnNpb25fc3RyaW5nID0gJ0Rldic7XG4vL3ZhciB2ZXJzaW9uX3N0cmluZyA9ICdBbHBoYTIwMTQwMS0tJztcbnZhciB2ZXJzaW9uX3N0cmluZyA9ICdQcmV2aWV3Jyttb21lbnQoKS5mb3JtYXQoJ1lZWVlNTUREJyk7XG5cblxuXG53aW5kb3cuZyA9IHJlcXVpcmUoJy4vYXBwL3NldHRpbmdzJyk7XG5jb25zb2xlLmxvZygnc2V0dGluZ3MnLCBnKTtcblxuZy5zdGF0ZS52ZXJzaW9uX3N0cmluZyA9IHZlcnNpb25fc3RyaW5nO1xuXG52YXIgZiA9IHJlcXVpcmUoJy4vYXBwL2Z1bmN0aW9ucycpO1xuZi5nID0gZztcbmcuZiA9IGY7XG5cbnZhciBxdWVyeSA9IGYucXVlcnlfc3RyaW5nKCk7XG4vL2NvbnNvbGUubG9nKHF1ZXJ5KTtcbmlmKCBxdWVyeVsnbW9kZSddID09PSBcImRldlwiICkge1xuICAgIGcuc3RhdGUubW9kZSA9ICdkZXYnO1xufSBlbHNlIHtcbiAgICBnLnN0YXRlLm1vZGUgPSAncmVsZWFzZSc7XG59XG5cbmYuc2V0dXBfd2VicGFnZSA9IHJlcXVpcmUoJy4vYXBwL3NldHVwX3dlYnBhZ2UnKTtcblxuZi5zZXR0aW5nc191cGRhdGUgPSByZXF1aXJlKCcuL2FwcC9zZXR0aW5nc191cGRhdGUnKTtcbmYudXBkYXRlID0gcmVxdWlyZSgnLi9hcHAvdXBkYXRlJyk7XG5cblxuZi5ta19ibG9ja3MgPSByZXF1aXJlKCcuL2FwcC9ta19ibG9ja3MnKTtcblxuZi5ta19wYWdlID0ge307XG5mLm1rX3BhZ2VbMV0gPSByZXF1aXJlKCcuL2FwcC9ta19wYWdlXzEnKTtcbmYubWtfcGFnZVsyXSA9IHJlcXVpcmUoJy4vYXBwL21rX3BhZ2VfMicpO1xuZi5ta19wYWdlWzNdID0gcmVxdWlyZSgnLi9hcHAvbWtfcGFnZV8zJyk7XG5mLm1rX3BhZ2VbNF0gPSByZXF1aXJlKCcuL2FwcC9ta19wYWdlXzQnKTtcblxuZi5ta19wcmV2aWV3ID0ge307XG5mLm1rX3ByZXZpZXdbMV0gPSByZXF1aXJlKCcuL2FwcC9ta19wYWdlX3ByZXZpZXdfMScpO1xuZi5ta19wcmV2aWV3WzJdID0gcmVxdWlyZSgnLi9hcHAvbWtfcGFnZV9wcmV2aWV3XzInKTtcblxuZi5ta19zdmc9IHJlcXVpcmUoJy4vYXBwL21rX3N2ZycpO1xuXG5cblxuXG4vLyByZXF1ZXN0IGV4dGVybmFsIGRhdGFcbi8vdmFyIGRhdGFiYXNlX2pzb25fVVJMID0gJ2h0dHA6Ly8xMC4xNzMuNjQuMjA0OjgwMDAvdGVtcG9yYXJ5Lyc7XG52YXIgZGF0YWJhc2VfanNvbl9VUkwgPSAnZGF0YS9mc2VjX2NvcHkuanNvbic7XG4kLmdldEpTT04oIGRhdGFiYXNlX2pzb25fVVJMKVxuICAgIC5kb25lKGZ1bmN0aW9uKGpzb24pe1xuICAgICAgICBnLmRhdGFiYXNlID0ganNvbjtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnZGF0YWJhc2UgbG9hZGVkJywgc2V0dGluZ3MuZGF0YWJhc2UpO1xuICAgICAgICBmLmxvYWRfZGF0YWJhc2UoanNvbik7XG4gICAgICAgIGcuc3RhdGUuZGF0YWJhc2VfbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgZi51cGRhdGUoKTtcblxuICAgIH0pO1xuXG5cbi8vIEJ1aWxkIHdlYnBhZ2VcbmYuc2V0dXBfd2VicGFnZSgpO1xuXG4vLyBBZGQgc3RhdHVzIGJhclxudmFyIGJvb3RfdGltZSA9IG1vbWVudCgpO1xudmFyIHN0YXR1c19pZCA9ICdzdGF0dXMnO1xuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXsgZi51cGRhdGVfc3RhdHVzX2JhcihzdGF0dXNfaWQsIGJvb3RfdGltZSwgdmVyc2lvbl9zdHJpbmcpO30sMTAwMCk7XG5cbi8vIFVwZGF0ZVxuZi51cGRhdGUoKTtcbiJdfQ==
