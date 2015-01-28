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


    var map_road  = g.perm.maps.map_road = L.map( 'map_road', {
        center: [lat_fl_center, lon_fl_center],
        zoom: 6
    });

    L.tileLayer( 'http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a> contributors | Tiles Courtesy of <a href="http://www.mapquest.com/" title="MapQuest" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png" width="16" height="16">',
        subdomains: ['otile1','otile2','otile3','otile4']
    }).addTo( map_road );

    g.perm.maps.marker_road = L.marker([lat,lon]).addTo(map_road);

    map_road.on('click', f.set_coordinates_from_map );




    var map_sat = g.perm.maps.map_sat = L.map( 'map_sat', {
        center: [lat, lon],
        zoom: 16
    });
    L.tileLayer( 'http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.png', {
        subdomains: ['otile1','otile2','otile3','otile4']
    }).addTo( map_sat );

    g.perm.maps.marker_sat = L.marker([lat,lon]).addTo(map_sat);

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




    console.log('\\--- end update');
};


module.exports = update;

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/data/tables.json":[function(require,module,exports){
module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports={

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9mdW5jdGlvbnMuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvbWtfYmxvY2tzLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvYXBwL21rX2JvcmRlci5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19kcmF3aW5nLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvYXBwL21rX3BhZ2VfMS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19wYWdlXzIuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvbWtfcGFnZV8zLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvYXBwL21rX3BhZ2VfNC5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19wYWdlX3ByZXZpZXdfMS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19wYWdlX3ByZXZpZXdfMi5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19zdmcuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvc2V0dGluZ3MuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvc2V0dGluZ3NfZHJhd2luZy5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9zZXR0aW5nc19mb250cy5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9zZXR0aW5nc19sYXllcnMuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvc2V0dGluZ3NfdXBkYXRlLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvYXBwL3NldHVwX3dlYnBhZ2UuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvdXBkYXRlLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvZGF0YS90YWJsZXMuanNvbiIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2xpYi9rb250YWluZXIuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2a0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcm9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGtvbnRhaW5lciA9IHJlcXVpcmUoJy4uL2xpYi9rb250YWluZXInKTtcblxudmFyIGYgPSB7fTtcblxuXG5mLnNldHVwX2JvZHkgPSBmdW5jdGlvbih0aXRsZSwgc2VjdGlvbnMpe1xuICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGU7XG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICAgIHZhciBzdGF0dXNfYmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgc3RhdHVzX2Jhci5pZCA9ICdzdGF0dXMnO1xuICAgIHN0YXR1c19iYXIuaW5uZXJIVE1MID0gJ2xvYWRpbmcgc3RhdHVzLi4uJztcbiAgICBib2R5Lmluc2VydEJlZm9yZShzdGF0dXNfYmFyLCBib2R5LmZpcnN0Q2hpbGQpO1xufTtcblxuZi5wYWRfemVybyA9IGZ1bmN0aW9uKG51bSwgc2l6ZSl7XG4gICAgdmFyIHMgPSAnMDAwMDAwMDAwJyArIG51bTtcbiAgICByZXR1cm4gcy5zdWJzdHIocy5sZW5ndGgtc2l6ZSk7XG59O1xuXG5mLnVwdGltZSA9IGZ1bmN0aW9uKGJvb3RfdGltZSl7XG4gICAgdmFyIHVwdGltZV9zZWNvbmRzX3RvdGFsID0gbW9tZW50KCkuZGlmZihib290X3RpbWUsICdzZWNvbmRzJyk7XG4gICAgdmFyIHVwdGltZV9ob3VycyA9IE1hdGguZmxvb3IoICB1cHRpbWVfc2Vjb25kc190b3RhbCAvKDYwKjYwKSApO1xuICAgIHZhciBtaW51dGVzX2xlZnQgPSB1cHRpbWVfc2Vjb25kc190b3RhbCAlKDYwKjYwKTtcbiAgICB2YXIgdXB0aW1lX21pbnV0ZXMgPSBmLnBhZF96ZXJvKCBNYXRoLmZsb29yKCAgbWludXRlc19sZWZ0IC82MCApLCAyICk7XG4gICAgdmFyIHVwdGltZV9zZWNvbmRzID0gZi5wYWRfemVybyggKG1pbnV0ZXNfbGVmdCAlIDYwKSwgMiApO1xuICAgIHJldHVybiB1cHRpbWVfaG91cnMgK1wiOlwiKyB1cHRpbWVfbWludXRlcyArXCI6XCIrIHVwdGltZV9zZWNvbmRzO1xufTtcblxuZi51cGRhdGVfc3RhdHVzX2JhciA9IGZ1bmN0aW9uKHN0YXR1c19pZCwgYm9vdF90aW1lLCBzdHJpbmcpIHtcbiAgICB2YXIgc3RhdHVzX2RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHN0YXR1c19pZCk7XG4gICAgc3RhdHVzX2Rpdi5pbm5lckhUTUwgPSBzdHJpbmc7XG4gICAgc3RhdHVzX2Rpdi5pbm5lckhUTUwgKz0gJyB8ICc7XG5cbiAgICB2YXIgY2xvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY2xvY2suaW5uZXJIVE1MID0gbW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJyk7XG5cbiAgICB2YXIgdXB0aW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHVwdGltZS5pbm5lckhUTUwgPSAnVXB0aW1lOiAnICsgZi51cHRpbWUoYm9vdF90aW1lKTtcblxuICAgIHN0YXR1c19kaXYuYXBwZW5kQ2hpbGQoY2xvY2spO1xuICAgIHN0YXR1c19kaXYuaW5uZXJIVE1MICs9ICcgfCAnO1xuICAgIHN0YXR1c19kaXYuYXBwZW5kQ2hpbGQodXB0aW1lKTtcbiAgICBzdGF0dXNfZGl2LmlubmVySFRNTCArPSAnIHwgJztcbn07XG5cblxuZi5vYmpfbmFtZXMgPSBmdW5jdGlvbiggb2JqZWN0ICkge1xuICAgIGlmKCBvYmplY3QgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgdmFyIGEgPSBbXTtcbiAgICAgICAgZm9yKCB2YXIgaWQgaW4gb2JqZWN0ICkge1xuICAgICAgICAgICAgaWYoIG9iamVjdC5oYXNPd25Qcm9wZXJ0eShpZCkgKSAge1xuICAgICAgICAgICAgICAgIGEucHVzaChpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxufTtcblxuZi5vYmplY3RfZGVmaW5lZCA9IGZ1bmN0aW9uKG9iamVjdCl7XG4gICAgLy9jb25zb2xlLmxvZyhvYmplY3QpO1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QgKXtcbiAgICAgICAgaWYoIG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpICl7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGtleSk7XG4gICAgICAgICAgICBpZiggb2JqZWN0W2tleV0gPT09IG51bGwgfHwgb2JqZWN0W2tleV0gPT09IHVuZGVmaW5lZCApIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbmYuc2VjdGlvbl9kZWZpbmVkID0gZnVuY3Rpb24oc2VjdGlvbl9uYW1lKXtcbiAgICAvL2NvbnNvbGUubG9nKFwiLVwiK3NlY3Rpb25fbmFtZSk7XG4gICAgLy92YXIgaW5wdXRfc2VjdGlvbiA9IGcuaW5wdXRzW3NlY3Rpb25fbmFtZV07XG4gICAgdmFyIG91dHB1dF9zZWN0aW9uID0gZy5zeXN0ZW1bc2VjdGlvbl9uYW1lXTtcbiAgICBmb3IoIHZhciBrZXkgaW4gb3V0cHV0X3NlY3Rpb24gKXtcbiAgICAgICAgaWYoIG91dHB1dF9zZWN0aW9uLmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coa2V5KTtcblxuICAgICAgICAgICAgaWYoIG91dHB1dF9zZWN0aW9uW2tleV0gPT09IHVuZGVmaW5lZCB8fCBvdXRwdXRfc2VjdGlvbltrZXldID09PSBudWxsICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbmYubnVsbFRvT2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0ICl7XG4gICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgaWYoIG9iamVjdFtrZXldID09PSBudWxsICl7XG4gICAgICAgICAgICAgICAgb2JqZWN0W2tleV0gPSB7fTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiggdHlwZW9mIG9iamVjdFtrZXldID09PSAnb2JqZWN0JyApIHtcbiAgICAgICAgICAgICAgICBvYmplY3Rba2V5XSA9IGYubnVsbFRvT2JqZWN0KG9iamVjdFtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xufTtcblxuZi5ibGFua19jb3B5ID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICB2YXIgbmV3T2JqZWN0ID0ge307XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdCApe1xuICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIGlmKCBvYmplY3Rba2V5XS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICkge1xuICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldID0ge307XG4gICAgICAgICAgICAgICAgZm9yKCB2YXIga2V5MiBpbiBvYmplY3Rba2V5XSApe1xuICAgICAgICAgICAgICAgICAgICBpZiggb2JqZWN0W2tleV0uaGFzT3duUHJvcGVydHkoa2V5MikgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldW2tleTJdID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3T2JqZWN0W2tleV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdPYmplY3Q7XG59O1xuXG5mLmJsYW5rX2NsZWFuX2NvcHkgPSBmdW5jdGlvbihvYmplY3Qpe1xuICAgIHZhciBuZXdPYmplY3QgPSB7fTtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0ICl7XG4gICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgaWYoIG9iamVjdFtrZXldLmNvbnN0cnVjdG9yID09PSBPYmplY3QgKSB7XG4gICAgICAgICAgICAgICAgbmV3T2JqZWN0W2tleV0gPSB7fTtcbiAgICAgICAgICAgICAgICBmb3IoIHZhciBrZXkyIGluIG9iamVjdFtrZXldICl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCBvYmplY3Rba2V5XS5oYXNPd25Qcm9wZXJ0eShrZXkyKSApe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNsZWFuX2tleSA9IGYuY2xlYW5fbmFtZShrZXkyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldW2NsZWFuX2tleV0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdPYmplY3Rba2V5XSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld09iamVjdDtcbn07XG5cbmYubWVyZ2Vfb2JqZWN0cyA9IGZ1bmN0aW9uIG1lcmdlX29iamVjdHMob2JqZWN0MSwgb2JqZWN0Mil7XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdDEgKXtcbiAgICAgICAgaWYoIG9iamVjdDEuaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgLy9pZigga2V5ID09PSAnbWFrZScgKSBjb25zb2xlLmxvZyhrZXksIG9iamVjdDEsIHR5cGVvZiBvYmplY3QxW2tleV0sIHR5cGVvZiBvYmplY3QyW2tleV0pO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhrZXksIG9iamVjdDEsIHR5cGVvZiBvYmplY3QxW2tleV0sIHR5cGVvZiBvYmplY3QyW2tleV0pO1xuICAgICAgICAgICAgaWYoIG9iamVjdDFba2V5XSAmJiBvYmplY3QxW2tleV0uY29uc3RydWN0b3IgPT09IE9iamVjdCApIHtcbiAgICAgICAgICAgICAgICBpZiggb2JqZWN0MltrZXldID09PSB1bmRlZmluZWQgKSBvYmplY3QyW2tleV0gPSB7fTtcbiAgICAgICAgICAgICAgICBtZXJnZV9vYmplY3RzKCBvYmplY3QxW2tleV0sIG9iamVjdDJba2V5XSApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiggb2JqZWN0MltrZXldID09PSB1bmRlZmluZWQgKSBvYmplY3QyW2tleV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuZi5hcnJheV90b19vYmplY3QgPSBmdW5jdGlvbihhcnIpIHtcbiAgICB2YXIgciA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKVxuICAgICAgICByW2ldID0gYXJyW2ldO1xuICAgIHJldHVybiByO1xufTtcblxuZi5uYW5fY2hlY2sgPSBmdW5jdGlvbiBuYW5fY2hlY2sob2JqZWN0LCBwYXRoKXtcbiAgICBpZiggcGF0aCA9PT0gdW5kZWZpbmVkICkgcGF0aCA9IFwiXCI7XG4gICAgcGF0aCA9IHBhdGgrXCIuXCI7XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdCApe1xuICAgICAgICAvL2NvbnNvbGUubG9nKCBcIk5hTmNoZWNrOiBcIitwYXRoK2tleSApO1xuXG4gICAgICAgIGlmKCBvYmplY3Rba2V5XSAmJiBvYmplY3Rba2V5XS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkgKSBvYmplY3Rba2V5XSA9IGYuYXJyYXlfdG9fb2JqZWN0KG9iamVjdFtrZXldKTtcblxuXG4gICAgICAgIGlmKCAgb2JqZWN0W2tleV0gJiYgKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSB8fCBvYmplY3Rba2V5XSAhPT0gbnVsbCApKXtcbiAgICAgICAgICAgIGlmKCBvYmplY3Rba2V5XS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICl7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggXCIgIE9iamVjdDogXCIrcGF0aCtrZXkgKTtcbiAgICAgICAgICAgICAgICBuYW5fY2hlY2soIG9iamVjdFtrZXldLCBwYXRoK2tleSApO1xuICAgICAgICAgICAgfSBlbHNlIGlmKCBvYmplY3Rba2V5XSA9PT0gTmFOIHx8IG9iamVjdFtrZXldID09PSBudWxsICl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIFwiTmFOOiBcIitwYXRoK2tleSApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCBcIkRlZmluZWQ6IFwiK3BhdGgra2V5LCBvYmplY3Rba2V5XSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxufTtcblxuZi5zdHJfdG9fbnVtID0gZnVuY3Rpb24gc3RyX3RvX251bShpbnB1dCl7XG4gICAgdmFyIG91dHB1dDtcbiAgICBpZighaXNOYU4oaW5wdXQpKSBvdXRwdXQgPSBOdW1iZXIoaW5wdXQpO1xuICAgIGVsc2Ugb3V0cHV0ID0gaW5wdXQ7XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cblxuZi5wcmV0dHlfd29yZCA9IGZ1bmN0aW9uKG5hbWUpe1xuICAgIHJldHVybiBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKTtcbn07XG5cbmYucHJldHR5X25hbWUgPSBmdW5jdGlvbihuYW1lKXtcbiAgICB2YXIgbCA9IG5hbWUuc3BsaXQoJ18nKTtcbiAgICBsLmZvckVhY2goZnVuY3Rpb24obmFtZV9zZXFtZW50LGkpe1xuICAgICAgICBsW2ldID0gZi5wcmV0dHlfd29yZChuYW1lX3NlcW1lbnQpO1xuICAgIH0pO1xuICAgIHZhciBwcmV0dHkgPSBsLmpvaW4oJyAnKTtcblxuICAgIHJldHVybiBwcmV0dHk7XG59O1xuXG5mLnByZXR0eV9uYW1lcyA9IGZ1bmN0aW9uKG9iamVjdCl7XG4gICAgdmFyIG5ld19vYmplY3QgPSB7fTtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0ICl7XG4gICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgdmFyIG5ld19rZXkgPSBmLnByZXR0eV9uYW1lKGtleSk7XG4gICAgICAgICAgICBuZXdfb2JqZWN0W25ld19rZXldID0gb2JqZWN0W2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld19vYmplY3Q7XG59O1xuXG5mLmNsZWFuX25hbWUgPSBmdW5jdGlvbihuYW1lKXtcbiAgICByZXR1cm4gbmFtZS5zcGxpdCgnICcpWzBdO1xufTtcblxuXG5mLm1rX2RyYXdlciA9IGZ1bmN0aW9uKHRpdGxlLCBjb250ZW50KXtcbiAgICB2YXIgZHJhd2VyX2NvbnRhaW5lciA9ICQoJzxkaXY+JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnaW5wdXRfc2VjdGlvbicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2lkJywgJ3NlY3Rpb25fJyt0aXRsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8uYXR0cignaWQnLCB0aXRsZSApO1xuICAgIC8vZHJhd2VyX2NvbnRhaW5lci5nZXQoMCkuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlfdHlwZTtcbiAgICB2YXIgc3lzdGVtX2RpdiA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAndGl0bGVfYmFyJylcbiAgICAgICAgLmF0dHIoJ3NlY3Rpb25fbm9tJywgdGl0bGUpXG4gICAgICAgIC5hcHBlbmRUbyhkcmF3ZXJfY29udGFpbmVyKVxuICAgICAgICAvKiBqc2hpbnQgLVcwODMgKi9cbiAgICAgICAgLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgbmFtZSA9ICQodGhpcykuYXR0cignc2VjdGlvbl9ub20nKTtcbiAgICAgICAgICAgIGcud2VicGFnZS5zZWxlY3Rpb25zX21hbnVhbF90b2dnbGVkW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuY2hpbGRyZW4oJy5kcmF3ZXInKS5jaGlsZHJlbignLmRyYXdlcl9jb250ZW50Jykuc2xpZGVUb2dnbGUoJ2Zhc3QnKTtcbiAgICAgICAgfSk7XG4gICAgdmFyIHN5c3RlbV90aXRsZSA9ICQoJzxhPicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICd0aXRsZV9iYXJfdGV4dCcpXG4gICAgICAgIC5hdHRyKCdocmVmJywgJyMnKVxuICAgICAgICAudGV4dChmLnByZXR0eV9uYW1lKHRpdGxlKSlcbiAgICAgICAgLmFwcGVuZFRvKHN5c3RlbV9kaXYpO1xuXG4gICAgdmFyIGRyYXdlciA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAnZHJhd2VyJykuYXBwZW5kVG8oZHJhd2VyX2NvbnRhaW5lcik7XG4gICAgY29udGVudC5hdHRyKCdjbGFzcycsICdkcmF3ZXJfY29udGVudCcpLmFwcGVuZFRvKGRyYXdlcik7XG5cblxuICAgIHJldHVybiBkcmF3ZXJfY29udGFpbmVyO1xuXG5cbn07XG5cblxuZi5hZGRfc2VsZWN0b3JzID0gZnVuY3Rpb24oc2V0dGluZ3MsIHBhcmVudF9jb250YWluZXIpe1xuICAgIGZvciggdmFyIHNlY3Rpb25fbmFtZSBpbiBzZXR0aW5ncy5pbnB1dHMgKXtcblxuICAgICAgICAvLyQodGhpcykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgdmFyIGRyYXdlcl9jb250ZW50ID0gJCgnPGRpdj4nKTtcbiAgICAgICAgZm9yKCB2YXIgaW5wdXRfbmFtZSBpbiBzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXSApe1xuICAgICAgICAgICAgdmFyIHVuaXRzO1xuICAgICAgICAgICAgaWYoIChzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSAhPT0gdW5kZWZpbmVkKSAmJiAoc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0udW5pdHMgIT09IHVuZGVmaW5lZCkgKSB7XG4gICAgICAgICAgICAgICAgdW5pdHMgPSBcIihcIiArIHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdLnVuaXRzICsgXCIpXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHVuaXRzID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBub3RlO1xuICAgICAgICAgICAgaWYoIChzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSAhPT0gdW5kZWZpbmVkKSAmJiAoc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0ubm90ZSAhPT0gdW5kZWZpbmVkKSApIHtcbiAgICAgICAgICAgICAgICBub3RlID0gc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0ubm90ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbm90ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG5cblxuXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3Jfc2V0ID0gJCgnPHNwYW4+JykuYXR0cignY2xhc3MnLCAnc2VsZWN0b3Jfc2V0JykuYXBwZW5kVG8oZHJhd2VyX2NvbnRlbnQpO1xuICAgICAgICAgICAgdmFyIGlucHV0X3RleHQgPSAkKCc8c3Bhbj4nKS5odG1sKGYucHJldHR5X25hbWUoaW5wdXRfbmFtZSkgKyAnOiAnICsgdW5pdHMgKS5hcHBlbmRUbyhzZWxlY3Rvcl9zZXQpO1xuICAgICAgICAgICAgaWYoIG5vdGUgKSBpbnB1dF90ZXh0LmF0dHIoJ3RpdGxlJywgbm90ZSk7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gayQoJ3NlbGVjdG9yJylcbiAgICAgICAgICAgICAgICAuc2V0T3B0aW9uc1JlZiggJ2lucHV0cy4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSApXG4gICAgICAgICAgICAgICAgLnNldFJlZiggJ3N5c3RlbS4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSApXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKHNlbGVjdG9yX3NldCk7XG4gICAgICAgICAgICBmLmtlbGVtX3NldHVwKHNlbGVjdG9yLCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAvLyovXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgICAgc3lzdGVtX3JlZjogT2JqZWN0LmNyZWF0ZShrb250YWluZXIpLm9iaihzZXR0aW5ncykucmVmKCdzeXN0ZW0uJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUpLFxuICAgICAgICAgICAgICAgIC8vaW5wdXRfcmVmOiBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcikub2JqKHNldHRpbmdzKS5yZWYoJ2lucHV0cy4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSArICcudmFsdWUnKSxcbiAgICAgICAgICAgICAgICBsaXN0X3JlZjogT2JqZWN0LmNyZWF0ZShrb250YWluZXIpLm9iaihzZXR0aW5ncykucmVmKCdpbnB1dHMuJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUgKyAnLm9wdGlvbnMnKSxcbiAgICAgICAgICAgICAgICBpbnRlcmFjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiggKHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdICE9PSB1bmRlZmluZWQpICYmIChzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXS50eXBlICE9PSB1bmRlZmluZWQpICkge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLnR5cGUgPSBzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXS50eXBlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci50eXBlID0gJ3NlbGVjdCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiggc2VsZWN0b3IudHlwZSA9PT0gJ3NlbGVjdCcgKXtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci5lbGVtID0gJCgnPHNlbGVjdD4nKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnc2VsZWN0b3InKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oc2VsZWN0b3Jfc2V0KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KClbMF07XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IudmFsdWUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCB0aGlzLnNldF9yZWYucmVmU3RyaW5nLCB0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleCApO1xuICAgICAgICAgICAgICAgICAgICAvL2lmKCB0aGlzLmludGVyYWN0ZWQgKVxuICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXggPj0gMCkgcmV0dXJuIHRoaXMuZWxlbS5vcHRpb25zW3RoaXMuZWxlbS5zZWxlY3RlZEluZGV4XS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBmLnNlbGVjdG9yX2FkZF9vcHRpb25zKHNlbGVjdG9yKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmKCBzZWxlY3Rvci50eXBlID09PSAnbnVtYmVyX2lucHV0JyB8fCBzZWxlY3Rvci50eXBlID09PSAndGV4dF9pbnB1dCcpe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLmVsZW0gPSAkKCc8aW5wdXQ+JylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgc2VsZWN0b3IudHlwZSlcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3R5cGUnLCAndGV4dCcpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhzZWxlY3Rvcl9zZXQpXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoKVswXTtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci52YWx1ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coIHRoaXMuc2V0X3JlZi5yZWZTdHJpbmcsIHRoaXMuZWxlbS5zZWxlY3RlZEluZGV4ICk7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coIHRoaXMuZWxlbSwgdGhpcy5lbGVtLnZhbHVlICk7XG4gICAgICAgICAgICAgICAgICAgIC8vaWYoIHRoaXMuaW50ZXJhY3RlZCApXG4gICAgICAgICAgICAgICAgICAgIC8vaWYoIHRoaXMuZWxlbS5zZWxlY3RlZEluZGV4ID49IDApIHJldHVybiB0aGlzLmVsZW0ub3B0aW9uc1t0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIC8vZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW0udmFsdWU7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci5lbGVtLnZhbHVlID0gc2VsZWN0b3Iuc3lzdGVtX3JlZi5nZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoc2VsZWN0b3IuZWxlbSkuY2hhbmdlKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5mLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZXR0aW5ncy5zZWxlY3RfcmVnaXN0cnkucHVzaChzZWxlY3Rvcik7XG4gICAgICAgICAgICAvLyQoJzwvYnI+JykuYXBwZW5kVG8oZHJhd2VyX2NvbnRlbnQpO1xuXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2VsZWN0aW9uX2NvbnRhaW5lciA9IGYubWtfZHJhd2VyKHNlY3Rpb25fbmFtZSwgZHJhd2VyX2NvbnRlbnQpO1xuXG4gICAgICAgIHNlbGVjdGlvbl9jb250YWluZXIuYXBwZW5kVG8ocGFyZW50X2NvbnRhaW5lcik7XG5cbiAgICAgICAgJChzZWxlY3Rpb25fY29udGFpbmVyKS5jaGlsZHJlbignLmRyYXdlcicpLmNoaWxkcmVuKCcuZHJhd2VyX2NvbnRlbnQnKS5zbGlkZVVwKCdmYXN0Jyk7XG4gICAgfVxufTtcblxuZi5zZWxlY3Rvcl9hZGRfb3B0aW9ucyA9IGZ1bmN0aW9uKHNlbGVjdG9yKXtcbiAgICB2YXIgbGlzdCA9IHNlbGVjdG9yLmxpc3RfcmVmLmdldCgpO1xuICAgIGlmKCBsaXN0ICYmIGxpc3QuY29uc3RydWN0b3IgPT09IE9iamVjdCApIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnXCJsaXN0XCInLCBsaXN0KTtcbiAgICAgICAgbGlzdCA9IGYub2JqX25hbWVzKGxpc3QpO1xuICAgIH1cbiAgICBzZWxlY3Rvci5lbGVtLmlubmVySFRNTCA9IFwiXCI7XG4gICAgaWYoIGxpc3QgaW5zdGFuY2VvZiBBcnJheSApe1xuICAgICAgICB2YXIgY3VycmVudF92YWx1ZSA9IHNlbGVjdG9yLnN5c3RlbV9yZWYuZ2V0KCk7XG4gICAgICAgICQoJzxvcHRpb24+JykuYXR0cignc2VsZWN0ZWQnLHRydWUpLmF0dHIoJ2Rpc2FibGVkJyx0cnVlKS5hdHRyKCdoaWRkZW4nLHRydWUpLmFwcGVuZFRvKHNlbGVjdG9yLmVsZW0pO1xuXG4gICAgICAgIGxpc3QuZm9yRWFjaChmdW5jdGlvbihvcHRfbmFtZSl7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKG9wdF9uYW1lKTtcbiAgICAgICAgICAgIHZhciBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICBvLnZhbHVlID0gb3B0X25hbWU7XG4gICAgICAgICAgICBpZiggY3VycmVudF92YWx1ZSApe1xuICAgICAgICAgICAgICAgIGlmKCBvcHRfbmFtZS50b1N0cmluZygpID09PSBjdXJyZW50X3ZhbHVlLnRvU3RyaW5nKCkgKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2ZvdW5kIGl0OicsIG9wdF9uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgby5zZWxlY3RlZCA9IFwic2VsZWN0ZWRcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdkb2VzIG5vdCBtYXRjaDogJywgb3B0X25hbWUsIFwiLFwiLCAgY3VycmVudF92YWx1ZSwgXCIuXCIgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9vLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VsZWN0b3Jfb3B0aW9uJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ25vIGN1cnJlbnQgdmFsdWUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgby5pbm5lckhUTUwgPSBvcHRfbmFtZTtcbiAgICAgICAgICAgIHNlbGVjdG9yLmVsZW0uYXBwZW5kQ2hpbGQobyk7XG4gICAgICAgIH0pO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnbGlzdCBub3QgYSBsaXN0JywgbGlzdCwgc2VsZWN0KTtcbiAgICB9XG59O1xuXG5mLmFkZF9vcHRpb25zID0gZnVuY3Rpb24oc2VsZWN0LCBhcnJheSl7XG4gICAgYXJyYXkuZm9yRWFjaCggZnVuY3Rpb24ob3B0aW9uKXtcbiAgICAgICAgJCgnPG9wdGlvbj4nKS5hdHRyKCAndmFsdWUnLCBvcHRpb24gKS50ZXh0KG9wdGlvbikuYXBwZW5kVG8oc2VsZWN0KTtcbiAgICB9KTtcbn07XG5cbmYuYWRkX3BhcmFtcyA9IGZ1bmN0aW9uKHNldHRpbmdzLCBwYXJlbnRfY29udGFpbmVyKXtcbiAgICBmb3IoIHZhciBzZWN0aW9uX25hbWUgaW4gc2V0dGluZ3Muc3lzdGVtICl7XG4gICAgICAgIGlmKCB0cnVlIHx8IGYub2JqZWN0X2RlZmluZWQoc2V0dGluZ3Muc3lzdGVtW3NlY3Rpb25fbmFtZV0pICl7XG4gICAgICAgICAgICB2YXIgc2VsZWN0aW9uX2NvbnRhaW5lciA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAncGFyYW1fc2VjdGlvbicpLmF0dHIoJ2lkJywgc2VjdGlvbl9uYW1lICkuYXBwZW5kVG8ocGFyZW50X2NvbnRhaW5lcik7XG4gICAgICAgICAgICAvL3NlbGVjdGlvbl9jb250YWluZXIuZ2V0KDApLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5X3R5cGU7XG4gICAgICAgICAgICB2YXIgc3lzdGVtX2RpdiA9ICQoJzxkaXY+JylcbiAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAndGl0bGVfbGluZScpXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKHNlbGVjdGlvbl9jb250YWluZXIpXG4gICAgICAgICAgICAgICAgLyoganNoaW50IC1XMDgzICovXG4gICAgICAgICAgICAgICAgLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuY2hpbGRyZW4oJy5kcmF3ZXInKS5jaGlsZHJlbignLmRyYXdlcl9jb250ZW50Jykuc2xpZGVUb2dnbGUoJ2Zhc3QnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBzeXN0ZW1fdGl0bGUgPSAkKCc8YT4nKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd0aXRsZV9saW5lX3RleHQnKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdocmVmJywgJyMnKVxuICAgICAgICAgICAgICAgIC50ZXh0KGYucHJldHR5X25hbWUoc2VjdGlvbl9uYW1lKSlcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8oc3lzdGVtX2Rpdik7XG4gICAgICAgICAgICAkKHRoaXMpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICB2YXIgZHJhd2VyID0gJCgnPGRpdj4nKS5hdHRyKCdjbGFzcycsICcnKS5hcHBlbmRUbyhzZWxlY3Rpb25fY29udGFpbmVyKTtcbiAgICAgICAgICAgIHZhciBkcmF3ZXJfY29udGVudCA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAncGFyYW1fc2VjdGlvbl9jb250ZW50JykuYXBwZW5kVG8oZHJhd2VyKTtcbiAgICAgICAgICAgIGZvciggdmFyIGlucHV0X25hbWUgaW4gc2V0dGluZ3Muc3lzdGVtW3NlY3Rpb25fbmFtZV0gKXtcbiAgICAgICAgICAgICAgICAkKCc8c3Bhbj4nKS5odG1sKGYucHJldHR5X25hbWUoaW5wdXRfbmFtZSkgKyAnOiAnKS5hcHBlbmRUbyhkcmF3ZXJfY29udGVudCk7XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0b3IgPSBrJCgndmFsdWUnKVxuICAgICAgICAgICAgICAgICAgICAvLy5zZXRPcHRpb25zUmVmKCAnaW5wdXRzLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lIClcbiAgICAgICAgICAgICAgICAgICAgLnNldFJlZiggJ3N5c3RlbS4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSApXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhkcmF3ZXJfY29udGVudCk7XG4gICAgICAgICAgICAgICAgZi5rZWxlbV9zZXR1cChzZWxlY3Rvciwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIC8vKi9cbiAgICAgICAgICAgICAgICB2YXIgdmFsdWVfa29udGFpbmVyID0gT2JqZWN0LmNyZWF0ZShrb250YWluZXIpXG4gICAgICAgICAgICAgICAgICAgIC5vYmooc2V0dGluZ3MpXG4gICAgICAgICAgICAgICAgICAgIC5yZWYoJ3N5c3RlbS4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSk7XG4gICAgICAgICAgICAgICAgdmFyICRlbGVtID0gJCgnPHNwYW4+JylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJycpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhkcmF3ZXJfY29udGVudClcbiAgICAgICAgICAgICAgICAgICAgLnRleHQodmFsdWVfa29udGFpbmVyLmdldCgpKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW06ICRlbGVtLmdldCgpWzBdLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZV9yZWY6IHZhbHVlX2tvbnRhaW5lclxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgc2V0dGluZ3MudmFsdWVfcmVnaXN0cnkucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgJCgnPC9icj4nKS5hcHBlbmRUbyhkcmF3ZXJfY29udGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5mLnVwZGF0ZV92YWx1ZXMgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgc2V0dGluZ3MudmFsdWVfcmVnaXN0cnkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZV9pdGVtKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggdmFsdWVfaXRlbSApO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCB2YWx1ZV9pdGVtLmVsZW0ub3B0aW9ucyApO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCB2YWx1ZV9pdGVtLmVsZW0uc2VsZWN0ZWRJbmRleCApO1xuICAgICAgICBpZih2YWx1ZV9pdGVtLmVsZW0uc2VsZWN0ZWRJbmRleCl7XG4gICAgICAgICAgICB2YWx1ZV9pdGVtLnZhbHVlID0gdmFsdWVfaXRlbS5lbGVtLm9wdGlvbnNbdmFsdWVfaXRlbS5lbGVtLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuICAgICAgICAgICAgdmFsdWVfaXRlbS5rb250YWluZXIuc2V0KHZhbHVlX2l0ZW0udmFsdWUpO1xuXG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbi8vZi5zaG93X2hpZGVfcGFyYW1zID0gZnVuY3Rpb24ocGFnZV9zZWN0aW9ucywgc2V0dGluZ3Mpe1xuLy8gICAgZm9yKCB2YXIgbGlzdF9uYW1lIGluIHBhZ2Vfc2VjdGlvbnMgKXtcbi8vICAgICAgICB2YXIgaWQgPSAnIycrbGlzdF9uYW1lO1xuLy8gICAgICAgIHZhciBzZWN0aW9uX25hbWUgPSBsaXN0X25hbWUuc3BsaXQoJ18nKVswXTtcbi8vICAgICAgICB2YXIgc2VjdGlvbiA9IGskKGlkKTtcbi8vICAgICAgICBpZiggc2V0dGluZ3Muc3RhdHVzLnNlY3Rpb25zW3NlY3Rpb25fbmFtZV0uc2V0ICkgc2VjdGlvbi5zaG93KCk7XG4vLyAgICAgICAgZWxzZSBzZWN0aW9uLmhpZGUoKTtcbi8vICAgIH1cbi8vfTtcblxuLy9mLnNob3dfaGlkZV9zZWxlY3Rpb25zID0gZnVuY3Rpb24oc2V0dGluZ3MsIGFjdGl2ZV9zZWN0aW9uX25hbWUpe1xuLy8gICAgJCgnI3NlY3Rpb25TZWxlY3RvcicpLnZhbChhY3RpdmVfc2VjdGlvbl9uYW1lKTtcbi8vICAgIGZvciggdmFyIGxpc3RfbmFtZSBpbiBzZXR0aW5ncy5pbnB1dCApe1xuLy8gICAgICAgIHZhciBpZCA9ICcjJytsaXN0X25hbWU7XG4vLyAgICAgICAgdmFyIHNlY3Rpb25fbmFtZSA9IGxpc3RfbmFtZS5zcGxpdCgnXycpWzBdO1xuLy8gICAgICAgIHZhciBzZWN0aW9uID0gayQoaWQpO1xuLy8gICAgICAgIGlmKCBzZWN0aW9uX25hbWUgPT09IGFjdGl2ZV9zZWN0aW9uX25hbWUgKSBzZWN0aW9uLnNob3coKTtcbi8vICAgICAgICBlbHNlIHNlY3Rpb24uaGlkZSgpO1xuLy8gICAgfVxuLy99O1xuXG4vL2Yuc2V0RG93bmxvYWRMaW5rKHNldHRpbmdzKXtcbi8vXG4vLyAgICBpZiggc2V0dGluZ3MuUERGICYmIHNldHRpbmdzLlBERi51cmwgKXtcbi8vICAgICAgICB2YXIgbGluayA9ICQoJ2EnKS5hdHRyKCdocmVmJywgc2V0dGluZ3MuUERGLnVybCApLmF0dHIoJ2Rvd25sb2FkJywgJ1BWX2RyYXdpbmcucGRmJykuaHRtbCgnRG93bmxvYWQgRHJhd2luZycpO1xuLy8gICAgICAgICQoJyNkb3dubG9hZCcpLmh0bWwoJycpLmFwcGVuZChsaW5rKTtcbi8vICAgIH1cbi8vfVxuXG4vL2YubG9hZFRhYmxlcyA9IGZ1bmN0aW9uKHN0cmluZyl7XG4vLyAgICB2YXIgdGFibGVzID0ge307XG4vLyAgICB2YXIgbCA9IHN0cmluZy5zcGxpdCgnXFxuJyk7XG4vLyAgICB2YXIgdGl0bGU7XG4vLyAgICB2YXIgZmllbGRzO1xuLy8gICAgdmFyIG5lZWRfdGl0bGUgPSB0cnVlO1xuLy8gICAgdmFyIG5lZWRfZmllbGRzID0gdHJ1ZTtcbi8vICAgIGwuZm9yRWFjaCggZnVuY3Rpb24oc3RyaW5nLCBpKXtcbi8vICAgICAgICB2YXIgbGluZSA9IHN0cmluZy50cmltKCk7XG4vLyAgICAgICAgaWYoIGxpbmUubGVuZ3RoID09PSAwICl7XG4vLyAgICAgICAgICAgIG5lZWRfdGl0bGUgPSB0cnVlO1xuLy8gICAgICAgICAgICBuZWVkX2ZpZWxkcyA9IHRydWU7XG4vLyAgICAgICAgfSBlbHNlIGlmKCBuZWVkX3RpdGxlICkge1xuLy8gICAgICAgICAgICB0aXRsZSA9IGxpbmU7XG4vLyAgICAgICAgICAgIHRhYmxlc1t0aXRsZV0gPSBbXTtcbi8vICAgICAgICAgICAgbmVlZF90aXRsZSA9IGZhbHNlO1xuLy8gICAgICAgIH0gZWxzZSBpZiggbmVlZF9maWVsZHMgKSB7XG4vLyAgICAgICAgICAgIGZpZWxkcyA9IGxpbmUuc3BsaXQoJywnKTtcbi8vICAgICAgICAgICAgdGFibGVzW3RpdGxlK1wiX2ZpZWxkc1wiXSA9IGZpZWxkcztcbi8vICAgICAgICAgICAgbmVlZF9maWVsZHMgPSBmYWxzZTtcbi8vICAgICAgICAvL30gZWxzZSB7XG4vLyAgICAgICAgLy8gICAgdmFyIGVudHJ5ID0ge307XG4vLyAgICAgICAgLy8gICAgdmFyIGxpbmVfYXJyYXkgPSBsaW5lLnNwbGl0KCcsJyk7XG4vLyAgICAgICAgLy8gICAgZmllbGRzLmZvckVhY2goIGZ1bmN0aW9uKGZpZWxkLCBpZCl7XG4vLyAgICAgICAgLy8gICAgICAgIGVudHJ5W2ZpZWxkLnRyaW0oKV0gPSBsaW5lX2FycmF5W2lkXS50cmltKCk7XG4vLyAgICAgICAgLy8gICAgfSk7XG4vLyAgICAgICAgLy8gICAgdGFibGVzW3RpdGxlXS5wdXNoKCBlbnRyeSApO1xuLy8gICAgICAgIC8vfVxuLy8gICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgICAgIHZhciBsaW5lX2FycmF5ID0gbGluZS5zcGxpdCgnLCcpO1xuLy8gICAgICAgICAgICB0YWJsZXNbdGl0bGVdW2xpbmVfYXJyYXlbMF0udHJpbSgpXSA9IGxpbmVfYXJyYXlbMV0udHJpbSgpO1xuLy8gICAgICAgIH1cbi8vICAgIH0pO1xuLy9cbi8vICAgIHJldHVybiB0YWJsZXM7XG4vL307XG4vL1xuLy9mLmxvYWRDb21wb25lbnRzID0gZnVuY3Rpb24oc3RyaW5nKXtcbi8vICAgIHZhciBkYiA9IGsucGFyc2VDU1Yoc3RyaW5nKTtcbi8vICAgIHZhciBvYmplY3QgPSB7fTtcbi8vICAgIGZvciggdmFyIGkgaW4gZGIgKXtcbi8vICAgICAgICB2YXIgY29tcG9uZW50ID0gZGJbaV07XG4vLyAgICAgICAgaWYoIG9iamVjdFtjb21wb25lbnQuTWFrZV0gPT09IHVuZGVmaW5lZCApe1xuLy8gICAgICAgICAgICBvYmplY3RbY29tcG9uZW50Lk1ha2VdID0ge307XG4vLyAgICAgICAgfVxuLy8gICAgICAgIGlmKCBvYmplY3RbY29tcG9uZW50Lk1ha2VdW2NvbXBvbmVudC5Nb2RlbF0gPT09IHVuZGVmaW5lZCApe1xuLy8gICAgICAgICAgICBvYmplY3RbY29tcG9uZW50Lk1ha2VdW2NvbXBvbmVudC5Nb2RlbF0gPSB7fTtcbi8vICAgICAgICB9XG4vL1xuLy8gICAgICAgIHZhciBmaWVsZHMgPSBrLm9iaklkQXJyYXkoY29tcG9uZW50KTtcbi8vICAgICAgICBmaWVsZHMuZm9yRWFjaCggZnVuY3Rpb24oIGZpZWxkICl7XG4vLyAgICAgICAgICAgIHZhciBwYXJhbSA9IGNvbXBvbmVudFtmaWVsZF07XG4vLyAgICAgICAgICAgIGlmKCAhKCBmaWVsZCBpbiBbJ01ha2UnLCAnTW9kZWwnXSApICYmICEoIGlzTmFOKHBhcnNlRmxvYXQocGFyYW0pKSApICl7XG4vLyAgICAgICAgICAgICAgICBjb21wb25lbnRbZmllbGRdID0gcGFyc2VGbG9hdChwYXJhbSk7XG4vLyAgICAgICAgICAgIH1cbi8vICAgICAgICB9KVxuLy8gICAgICAgIG9iamVjdFtjb21wb25lbnQuTWFrZV1bY29tcG9uZW50Lk1vZGVsXSA9IGNvbXBvbmVudDtcbi8vICAgIH1cbi8vICAgIHJldHVybiBvYmplY3Q7XG4vL307XG5cblxuXG5cbmYubG9hZF9kYXRhYmFzZSA9IGZ1bmN0aW9uKEZTRUNfZGF0YWJhc2VfSlNPTil7XG4gICAgRlNFQ19kYXRhYmFzZV9KU09OID0gZi5sb3dlcmNhc2VfcHJvcGVydGllcyhGU0VDX2RhdGFiYXNlX0pTT04pO1xuICAgIGcuY29tcG9uZW50cy5pbnZlcnRlcnMgPSB7fTtcbiAgICBGU0VDX2RhdGFiYXNlX0pTT04uaW52ZXJ0ZXJzLmZvckVhY2goZnVuY3Rpb24oY29tcG9uZW50KXtcbiAgICAgICAgaWYoIGcuY29tcG9uZW50cy5pbnZlcnRlcnNbY29tcG9uZW50Lm1ha2VdID09PSB1bmRlZmluZWQgKSBnLmNvbXBvbmVudHMuaW52ZXJ0ZXJzW2NvbXBvbmVudC5tYWtlXSA9IHt9O1xuICAgICAgICAvL2cuY29tcG9uZW50cy5pbnZlcnRlcnNbY29tcG9uZW50Lm1ha2VdW2NvbXBvbmVudC5tYWtlXSA9IGYucHJldHR5X25hbWVzKGNvbXBvbmVudCk7XG4gICAgICAgIGcuY29tcG9uZW50cy5pbnZlcnRlcnNbY29tcG9uZW50Lm1ha2VdW2NvbXBvbmVudC5tb2RlbF0gPSBjb21wb25lbnQ7XG4gICAgfSk7XG4gICAgZy5jb21wb25lbnRzLm1vZHVsZXMgPSB7fTtcbiAgICBGU0VDX2RhdGFiYXNlX0pTT04ubW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uKGNvbXBvbmVudCl7XG4gICAgICAgIGlmKCBnLmNvbXBvbmVudHMubW9kdWxlc1tjb21wb25lbnQubWFrZV0gPT09IHVuZGVmaW5lZCApIGcuY29tcG9uZW50cy5tb2R1bGVzW2NvbXBvbmVudC5tYWtlXSA9IHt9O1xuICAgICAgICAvL2cuY29tcG9uZW50cy5tb2R1bGVzW2NvbXBvbmVudC5tYWtlXVtjb21wb25lbnQubWFrZV0gPSBmLnByZXR0eV9uYW1lcyhjb21wb25lbnQpO1xuICAgICAgICBnLmNvbXBvbmVudHMubW9kdWxlc1tjb21wb25lbnQubWFrZV1bY29tcG9uZW50Lm1vZGVsXSA9IGNvbXBvbmVudDtcbiAgICB9KTtcblxuICAgIGYudXBkYXRlKCk7XG59O1xuXG5cbmYuZ2V0X3JlZiA9IGZ1bmN0aW9uKHN0cmluZywgb2JqZWN0KXtcbiAgICB2YXIgcmVmX2FycmF5ID0gc3RyaW5nLnNwbGl0KCcuJyk7XG4gICAgdmFyIGxldmVsID0gb2JqZWN0O1xuICAgIHJlZl9hcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldmVsX25hbWUsaSl7XG4gICAgICAgIGlmKCB0eXBlb2YgbGV2ZWxbbGV2ZWxfbmFtZV0gPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldmVsID0gbGV2ZWxbbGV2ZWxfbmFtZV07XG4gICAgfSk7XG4gICAgcmV0dXJuIGxldmVsO1xufTtcbmYuc2V0X3JlZiA9IGZ1bmN0aW9uKCBvYmplY3QsIHJlZl9zdHJpbmcsIHZhbHVlICl7XG4gICAgdmFyIHJlZl9hcnJheSA9IHJlZl9zdHJpbmcuc3BsaXQoJy4nKTtcbiAgICB2YXIgbGV2ZWwgPSBvYmplY3Q7XG4gICAgcmVmX2FycmF5LmZvckVhY2goZnVuY3Rpb24obGV2ZWxfbmFtZSxpKXtcbiAgICAgICAgaWYoIHR5cGVvZiBsZXZlbFtsZXZlbF9uYW1lXSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbGV2ZWwgPSBsZXZlbFtsZXZlbF9uYW1lXTtcbiAgICB9KTtcblxuICAgIHJldHVybiBsZXZlbDtcbn07XG5cblxuXG5cbmYubG9nX2lmX2RhdGFiYXNlX2xvYWRlZCA9IGZ1bmN0aW9uKGUpe1xuICAgIGlmKGYuZy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIHtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgfVxufTtcblxuXG5cbmYubG93ZXJjYXNlX3Byb3BlcnRpZXMgPSBmdW5jdGlvbiBsb3dlcmNhc2VfcHJvcGVydGllcyhvYmopIHtcbiAgICB2YXIgbmV3X29iamVjdCA9IG5ldyBvYmouY29uc3RydWN0b3IoKTtcbiAgICBmb3IoIHZhciBvbGRfbmFtZSBpbiBvYmogKXtcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShvbGRfbmFtZSkpIHtcbiAgICAgICAgICAgIHZhciBuZXdfbmFtZSA9IG9sZF9uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiggb2JqW29sZF9uYW1lXS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0IHx8IG9ialtvbGRfbmFtZV0uY29uc3RydWN0b3IgPT09IEFycmF5ICl7XG4gICAgICAgICAgICAgICAgbmV3X29iamVjdFtuZXdfbmFtZV0gPSBsb3dlcmNhc2VfcHJvcGVydGllcyhvYmpbb2xkX25hbWVdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3X29iamVjdFtuZXdfbmFtZV0gPSBvYmpbb2xkX25hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG4gICAgcmV0dXJuIG5ld19vYmplY3Q7XG59O1xuXG5cbmYudG9nZ2xlX21vZHVsZSA9IGZ1bmN0aW9uKGVsZW1lbnQpe1xuICAgIC8vY29uc29sZS5sb2coJ3N3aXRjaCcsIGVsZW1lbnQsIGVsZW1lbnQuY2xhc3NMaXMgKTtcblxuICAgIC8vZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIG51bGwpO1xuXG4gICAgdmFyIGVsZW0gPSAkKGVsZW1lbnQpO1xuICAgIC8vY29uc29sZS5sb2coJ3N3aXRjaCcsIGVsZW1bMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdwcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlJykgKTtcblxuICAgIHZhciByID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ21vZHVsZV9JRCcpLnNwbGl0KCcsJylbMF07XG4gICAgdmFyIGMgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnbW9kdWxlX0lEJykuc3BsaXQoJywnKVsxXTtcblxuICAgIGlmKCBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSApe1xuICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSA9IGZhbHNlO1xuICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbC0tO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzW3JdW2NdID0gdHJ1ZTtcbiAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNfdG90YWwrKztcbiAgICB9XG5cbiAgICAvKlxuICAgIHZhciBsYXllcjtcbiAgICBpZiggZWxlbVswXS5jbGFzc0xpc3QuY29udGFpbnMoJ3N2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkJykgKXtcbiAgICAgICAgLy9nLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSA9IHRydWU7XG4gICAgICAgIC8vbGF5ZXIgPSBnLmRyYXdpbmdfc2V0dGluZ3MubGF5ZXJfYXR0ci5wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlO1xuICAgICAgICAvL2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlcyA9IGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzICsxIHx8IDE7XG4gICAgICAgIC8vbGF5ZXIgPSBnLmRyYXdpbmdfc2V0dGluZ3MubGF5ZXJfYXR0ci5wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkO1xuICAgICAgICAvL2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZFwiKTtcbiAgICB9XG4gICAgLy8qL1xuICAgIC8vY29uc29sZS5sb2coIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzKTtcbiAgICAvL2ZvciggdmFyIGF0dHJfbmFtZSBpbiBsYXllciApe1xuICAgIC8vICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJfbmFtZSwgbGF5ZXJbYXR0cl9uYW1lXSk7XG5cbiAgICAvL31cblxuICAgIGcuZi51cGRhdGUoKTtcblxuICAgIC8qXG4gICAgaWYoIGVsZW0uaGFzQ2xhc3MoXCJzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZVwiKSApe1xuICAgICAgICBlbGVtLnJlbW92ZUNsYXNzKFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVcIik7XG4gICAgICAgIGVsZW0uYWRkQ2xhc3MoXCJzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZFwiKTtcbiAgICB9IGVsc2UgaWYoIGVsZW0uaGFzQ2xhc3MoXCJzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZFwiKSApe1xuICAgICAgICBlbGVtLnJlbW92ZUNsYXNzKFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWRcIik7XG4gICAgICAgIGVsZW0uYWRkQ2xhc3MoXCJzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtLmFkZENsYXNzKFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVcIik7XG4gICAgfVxuICAgICovXG59O1xuXG5cbmYuY2xlYXJfb2JqZWN0ID0gZnVuY3Rpb24ob2JqKXtcbiAgICBmb3IoIHZhciBpZCBpbiBvYmogKXtcbiAgICAgICAgaWYoIG9iai5oYXNPd25Qcm9wZXJ0eShpZCkpe1xuICAgICAgICAgICAgZGVsZXRlIG9ialtpZF07XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vLyBjbGVhciBkcmF3aW5nXG5mLmNsZWFyX2RyYXdpbmcgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IoIHZhciBpZCBpbiBnLmRyYXdpbmcgKXtcbiAgICAgICAgaWYoIGcuZHJhd2luZy5oYXNPd25Qcm9wZXJ0eShpZCkpe1xuICAgICAgICAgICAgZi5jbGVhcl9vYmplY3QoZy5kcmF3aW5nW2lkXSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cblxuZi5xdWVyeV9zdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIEJhc2VkIG9uXG4gIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzk3OTk5NVxuICB2YXIgcXVlcnlfc3RyaW5nID0ge307XG4gIHZhciBxdWVyeSA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyaW5nKDEpO1xuICB2YXIgdmFycyA9IHF1ZXJ5LnNwbGl0KFwiJlwiKTtcbiAgdmFyIGk7XG4gIGZvciAoIGk9MDsgaTx2YXJzLmxlbmd0aDsgaSsrICkge1xuICAgIHZhciBwYWlyID0gdmFyc1tpXS5zcGxpdChcIj1cIik7XG4gICAgICAgIC8vIElmIGZpcnN0IGVudHJ5IHdpdGggdGhpcyBuYW1lXG4gICAgaWYgKHR5cGVvZiBxdWVyeV9zdHJpbmdbcGFpclswXV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcXVlcnlfc3RyaW5nW3BhaXJbMF1dID0gcGFpclsxXTtcbiAgICAgICAgLy8gSWYgc2Vjb25kIGVudHJ5IHdpdGggdGhpcyBuYW1lXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcXVlcnlfc3RyaW5nW3BhaXJbMF1dID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHZhciBhcnIgPSBbIHF1ZXJ5X3N0cmluZ1twYWlyWzBdXSwgcGFpclsxXSBdO1xuICAgICAgICBxdWVyeV9zdHJpbmdbcGFpclswXV0gPSBhcnI7XG4gICAgICAgIC8vIElmIHRoaXJkIG9yIGxhdGVyIGVudHJ5IHdpdGggdGhpcyBuYW1lXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVlcnlfc3RyaW5nW3BhaXJbMF1dLnB1c2gocGFpclsxXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBxdWVyeV9zdHJpbmc7XG59O1xuXG5mLnJlcXVlc3RfZ2VvY29kZSA9IGZ1bmN0aW9uKCl7XG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdsb2NhdGlvbicpICl7XG4gICAgICAgIHZhciBhZGRyZXNzX25ldyA9IGcucGVybS5sb2NhdGlvbi5uZXdfYWRkcmVzcztcblxuICAgICAgICBpZiggYWRkcmVzc19uZXcgfHwgZy5wZXJtLmxvY2F0aW9uLmxhdCA9PT0gdW5kZWZpbmVkIHx8IGcucGVybS5sb2NhdGlvbi5sYXQgPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCduZXcgYWRkcmVzcycpO1xuICAgICAgICAgICAgdmFyIGFkZHJlc3MgPSBlbmNvZGVVUklDb21wb25lbnQoW1xuICAgICAgICAgICAgICAgICAgICBnLnBlcm0ubG9jYXRpb24uYWRkcmVzcyxcbiAgICAgICAgICAgICAgICAgICAgZy5wZXJtLmxvY2F0aW9uLmNpdHksXG4gICAgICAgICAgICAgICAgICAgICdGTCcsXG4gICAgICAgICAgICAgICAgICAgIGcucGVybS5sb2NhdGlvbi56aXBcbiAgICAgICAgICAgICAgICBdLmpvaW4oJywgJykgKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coYWRkcmVzcyk7XG4gICAgICAgICAgICAkKCcjZ2VvY29kZV9kaXNwbGF5JykudGV4dCgnUmVxdWVzdGluZyBjb29yZGluYXRlcy4uLicpO1xuICAgICAgICAgICAgJC5nZXRKU09OKCdodHRwOi8vbm9taW5hdGltLm9wZW5zdHJlZXRtYXAub3JnL3NlYXJjaD9mb3JtYXQ9anNvbiZsaW1pdD01JnE9JyArIGFkZHJlc3MsIGYuc2V0X2Nvb3JkaW5hdGVzX2Zyb21fZ2VvY29kZSApO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcjZ2VvY29kZV9kaXNwbGF5JykudGV4dCgnQWRkcmVzcyB1bmNoYW5nZWQnKTtcbiAgICAgICAgICAgIGYuc2V0X2Nvb3JkaW5hdGVzX2Zyb21fZ2VvY29kZSgpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnI2dlb2NvZGVfZGlzcGxheScpLnRleHQoJ1BsZWFzZSBlbnRlciBhZGRyZXNzJyk7XG4gICAgfVxufTtcblxuXG5mLnNldF9zYXRfbWFwX21hcmtlciA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIGxhdGxuZyA9IEwubGF0TG5nKCBnLnBlcm0ubG9jYXRpb24ubGF0LCBnLnBlcm0ubG9jYXRpb24ubG9uICk7XG4gICAgZy5wZXJtLm1hcHMubWFya2VyX3NhdC5zZXRMYXRMbmcoIGxhdGxuZyApO1xuICAgIGcucGVybS5tYXBzLm1hcmtlcl9yb2FkLnNldExhdExuZyggbGF0bG5nICk7XG4gICAgZy5wZXJtLm1hcHMubWFwX3NhdC5zZXRWaWV3KCBsYXRsbmcgKTtcbn07XG5cbmYuc2V0X2Nvb3JkaW5hdGVzX2Zyb21fbWFwID0gZnVuY3Rpb24oZSl7XG4gICAgZy5wZXJtLmxvY2F0aW9uLmxhdCA9IGUubGF0bG5nLmxhdDtcbiAgICBnLnBlcm0ubG9jYXRpb24ubG9uID0gZS5sYXRsbmcubG5nO1xuICAgIGYudXBkYXRlKCk7XG59O1xuXG5mLnNldF9jb29yZGluYXRlc19mcm9tX2dlb2NvZGUgPSBmdW5jdGlvbihkYXRhKXtcbiAgICBpZiggZGF0YSA9PT0gdW5kZWZpbmVkICYmIGcucGVybS5sb2NhdGlvbi5sYXQgIT09IHVuZGVmaW5lZCApeyAvLyBsb2FkaW5nIGxhc3QgbG9jYXRpb25zXG4gICAgICAgIGcucGVybS5sb2NhdGlvbi5sYXQgPSBnLnBlcm0uZ2VvY29kZS5sYXQ7XG4gICAgICAgIGcucGVybS5sb2NhdGlvbi5sb24gPSBnLnBlcm0uZ2VvY29kZS5sb247XG4gICAgICAgIGYudXBkYXRlKCk7XG4gICAgfSBlbHNlIGlmKCBkYXRhWzBdICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgJCgnI2dlb2NvZGVfZGlzcGxheScpLnRleHQoJ0FkZHJlc3MgbG9hZGVkJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdOZXcgbG9jYXRpb24gZnJvbSBhZGRyZXNzJywgZGF0YSk7XG4gICAgICAgIGcucGVybS5nZW9jb2RlLmRhdGEgPSBkYXRhO1xuICAgICAgICBnLnBlcm0uZ2VvY29kZS5sYXQgPSBkYXRhWzBdLmxhdDtcbiAgICAgICAgZy5wZXJtLmdlb2NvZGUubG9uID0gZGF0YVswXS5sb247XG4gICAgICAgIGcucGVybS5sb2NhdGlvbi5sYXQgPSBnLnBlcm0uZ2VvY29kZS5sYXQ7XG4gICAgICAgIGcucGVybS5sb2NhdGlvbi5sb24gPSBnLnBlcm0uZ2VvY29kZS5sb247XG4gICAgICAgIGYudXBkYXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJCgnI2dlb2NvZGVfZGlzcGxheScpLnRleHQoJ0FkZHJlc3Mgbm90IGZvdW5kJyk7XG4gICAgfVxufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gZjtcbiIsInZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG5cbi8vdmFyIGRyYXdpbmdfcGFydHMgPSBbXTtcbi8vZC5saW5rX2RyYXdpbmdfcGFydHMoZHJhd2luZ19wYXJ0cyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oKXtcbiAgICBjb25zb2xlLmxvZyhcIioqIE1ha2luZyBwYWdlIDJcIik7XG4gICAgZCA9IG1rX2RyYXdpbmcoKTtcblxuICAgIHZhciBmID0gZy5mO1xuXG4gICAgLy92YXIgY29tcG9uZW50cyA9IGcuY29tcG9uZW50cztcbiAgICAvL3ZhciBzeXN0ZW0gPSBnLnN5c3RlbTtcbiAgICB2YXIgc3lzdGVtID0gZy5zeXN0ZW07XG5cbiAgICB2YXIgc2l6ZSA9IGcuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgIHZhciBsb2MgPSBnLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuXG5cblxuXG4gICAgdmFyIHgsIHksIGgsIHc7XG4gICAgdmFyIG9mZnNldDtcblxuLy8gRGVmaW5lIGQuYmxvY2tzXG5cbi8vIG1vZHVsZSBkLmJsb2NrXG4gICAgdyA9IHNpemUubW9kdWxlLmZyYW1lLnc7XG4gICAgaCA9IHNpemUubW9kdWxlLmZyYW1lLmg7XG5cbiAgICBkLmJsb2NrX3N0YXJ0KCdtb2R1bGUnKTtcblxuICAgIC8vIGZyYW1lXG4gICAgZC5sYXllcignbW9kdWxlJyk7XG4gICAgeCA9IDA7XG4gICAgeSA9IDArc2l6ZS5tb2R1bGUubGVhZDtcbiAgICBkLnJlY3QoIFt4LHkraC8yXSwgW3csaF0gKTtcbiAgICAvLyBmcmFtZSB0cmlhbmdsZT9cbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC13LzIseV0sXG4gICAgICAgIFt4LHkrdy8yXSxcbiAgICBdKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCx5K3cvMl0sXG4gICAgICAgIFt4K3cvMix5XSxcbiAgICBdKTtcbiAgICAvLyBsZWFkc1xuICAgIGQubGF5ZXIoJ0RDX3BvcycpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3gsIHktc2l6ZS5tb2R1bGUubGVhZF1cbiAgICBdKTtcbiAgICBkLmxheWVyKCdEQ19uZWcnKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCwgeStoXSxcbiAgICAgICAgW3gsIHkraCsoc2l6ZS5tb2R1bGUubGVhZCldXG4gICAgXSk7XG4gICAgLy8gcG9zIHNpZ25cbiAgICBkLmxheWVyKCd0ZXh0Jyk7XG4gICAgZC50ZXh0KFxuICAgICAgICBbeCtzaXplLm1vZHVsZS5sZWFkLzIsIHktc2l6ZS5tb2R1bGUubGVhZC8yXSxcbiAgICAgICAgJysnLFxuICAgICAgICAnc2lnbnMnXG4gICAgKTtcbiAgICAvLyBuZWcgc2lnblxuICAgIGQudGV4dChcbiAgICAgICAgW3grc2l6ZS5tb2R1bGUubGVhZC8yLCB5K2grc2l6ZS5tb2R1bGUubGVhZC8yXSxcbiAgICAgICAgJy0nLFxuICAgICAgICAnc2lnbnMnXG4gICAgKTtcbiAgICAvLyBncm91bmRcbiAgICBkLmxheWVyKCdEQ19ncm91bmQnKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC13LzIsIHkraC8yXSxcbiAgICAgICAgW3gtdy8yLXcvNCwgeStoLzJdLFxuICAgIF0pO1xuXG4gICAgZC5sYXllcigpO1xuICAgIGQuYmxvY2tfZW5kKCk7XG5cbi8vI3N0cmluZ1xuICAgIGQuYmxvY2tfc3RhcnQoJ3N0cmluZycpO1xuXG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG5cblxuXG5cblxuICAgIHZhciBtYXhfZGlzcGxheWVkX21vZHVsZXMgPSA5O1xuICAgIHZhciBicmVha19zdHJpbmcgPSBmYWxzZTtcblxuICAgIGlmKCBzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nID4gbWF4X2Rpc3BsYXllZF9tb2R1bGVzICl7XG4gICAgICAgIGRpc3BsYXllZF9tb2R1bGVzID0gbWF4X2Rpc3BsYXllZF9tb2R1bGVzIC0gMTtcbiAgICAgICAgYnJlYWtfc3RyaW5nID0gdHJ1ZTtcbiAgICAgICAgc2l6ZS5zdHJpbmcuaCA9IChzaXplLm1vZHVsZS5oICogKGRpc3BsYXllZF9tb2R1bGVzKzEpICkgKyBzaXplLnN0cmluZy5nYXBfbWlzc2luZztcbiAgICB9IGVsc2Uge1xuICAgICAgICBkaXNwbGF5ZWRfbW9kdWxlcyA9IHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmc7XG4gICAgICAgIHNpemUuc3RyaW5nLmggPSAoc2l6ZS5tb2R1bGUuaCAqIGRpc3BsYXllZF9tb2R1bGVzKTtcbiAgICB9XG4gICAgbG9jLmFycmF5Lmxvd2VyID0gbG9jLmFycmF5LnVwcGVyICsgc2l6ZS5zdHJpbmcuaDtcblxuICAgIHNpemUuc3RyaW5nLmhfbWF4ID0gKHNpemUubW9kdWxlLmggKiBtYXhfZGlzcGxheWVkX21vZHVsZXMpICsgc2l6ZS5zdHJpbmcuZ2FwX21pc3Npbmc7XG4gICAgbG9jLmFycmF5Lmxvd2VyX2xpbWl0ID0gbG9jLmFycmF5LnVwcGVyICsgc2l6ZS5zdHJpbmcuaF9tYXg7XG5cblxuXG4gICAgZm9yKCB2YXIgcj0wOyByPGRpc3BsYXllZF9tb2R1bGVzOyByKyspe1xuICAgICAgICBkLmJsb2NrKCdtb2R1bGUnLCBbeCx5XSk7XG4gICAgICAgIHkgKz0gc2l6ZS5tb2R1bGUuaDtcblxuICAgIH1cbiAgICBpZiggYnJlYWtfc3RyaW5nICkge1xuICAgICAgICBkLmxpbmUoXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgW3gseV0sXG4gICAgICAgICAgICAgICAgW3gseStzaXplLnN0cmluZy5nYXBfbWlzc2luZ10sXG4gICAgICAgICAgICAvL1t4LXNpemUubW9kdWxlLmZyYW1lLncqMy80LCB5K3NpemUuc3RyaW5nLmggKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdEQ19pbnRlcm1vZHVsZSdcbiAgICAgICAgKTtcblxuICAgICAgICB5ICs9IHNpemUuc3RyaW5nLmdhcF9taXNzaW5nO1xuICAgICAgICBkLmJsb2NrKCdtb2R1bGUnLCBbeCx5XSk7XG4gICAgfVxuXG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG5cbiAgICAvL1RPRE86IGFkZCBsb29wIHRvIGp1bXAgb3ZlciBuZWdhdGl2ZSByZXR1cm4gd2lyZXNcbiAgICBkLmxheWVyKCdEQ19ncm91bmQnKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC1zaXplLm1vZHVsZS5mcmFtZS53KjMvNCwgeStzaXplLm1vZHVsZS5oLzJdLFxuICAgICAgICBbeC1zaXplLm1vZHVsZS5mcmFtZS53KjMvNCwgeStzaXplLnN0cmluZy5oX21heCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAgICAgLy9beC1zaXplLm1vZHVsZS5mcmFtZS53KjMvNCwgeStzaXplLnN0cmluZy5oICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICBdKTtcbiAgICBkLmxheWVyKCk7XG5cblxuICAgIGQuYmxvY2tfZW5kKCk7XG5cblxuLy8gdGVybWluYWxcbiAgICBkLmJsb2NrX3N0YXJ0KCd0ZXJtaW5hbCcpO1xuICAgIHggPSAwO1xuICAgIHkgPSAwO1xuXG4gICAgZC5sYXllcigndGVybWluYWwnKTtcbiAgICBkLmNpcmMoXG4gICAgICAgIFt4LHldLFxuICAgICAgICBzaXplLnRlcm1pbmFsX2RpYW1cbiAgICApO1xuICAgIGQubGF5ZXIoKTtcbiAgICBkLmJsb2NrX2VuZCgpO1xuXG4vLyBmdXNlXG5cbiAgICBkLmJsb2NrX3N0YXJ0KCdmdXNlJyk7XG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG4gICAgdyA9IDEwO1xuICAgIGggPSA1O1xuXG4gICAgZC5sYXllcigndGVybWluYWwnKTtcbiAgICBkLnJlY3QoXG4gICAgICAgIFt4LHldLFxuICAgICAgICBbdyxoXVxuICAgICk7XG4gICAgZC5saW5lKCBbXG4gICAgICAgIFt3LzIseV0sXG4gICAgICAgIFt3LzIrc2l6ZS5mdXNlLncsIHldXG4gICAgXSk7XG4gICAgZC5ibG9jaygndGVybWluYWwnLCBbc2l6ZS5mdXNlLncsIHldICk7XG5cbiAgICBkLmxpbmUoIFtcbiAgICAgICAgWy13LzIseV0sXG4gICAgICAgIFstdy8yLXNpemUuZnVzZS53LCB5XVxuICAgIF0pO1xuICAgIGQuYmxvY2soJ3Rlcm1pbmFsJywgWy1zaXplLmZ1c2UudywgeV0gKTtcblxuICAgIGQubGF5ZXIoKTtcbiAgICBkLmJsb2NrX2VuZCgpO1xuXG4vLyBncm91bmQgc3ltYm9sXG4gICAgZC5ibG9ja19zdGFydCgnZ3JvdW5kJyk7XG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG5cbiAgICBkLmxheWVyKCdBQ19ncm91bmQnKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCx5XSxcbiAgICAgICAgW3gseSs0MF0sXG4gICAgXSk7XG4gICAgeSArPSAyNTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC03LjUseV0sXG4gICAgICAgIFt4KzcuNSx5XSxcbiAgICBdKTtcbiAgICB5ICs9IDU7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gtNSx5XSxcbiAgICAgICAgW3grNSx5XSxcbiAgICBdKTtcbiAgICB5ICs9IDU7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gtMi41LHldLFxuICAgICAgICBbeCsyLjUseV0sXG4gICAgXSk7XG4gICAgZC5sYXllcigpO1xuXG4gICAgZC5ibG9ja19lbmQoKTtcblxuXG5cbi8vIE5vcnRoIGFycm93XG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG5cbiAgICB2YXIgYXJyb3dfdyA9IDc7XG4gICAgdmFyIGxldHRlcl9oID0gMTQ7XG4gICAgdmFyIGFycm93X2ggPSA1MDtcblxuICAgIGQuYmxvY2tfc3RhcnQoJ25vcnRoIGFycm93X3VwJyk7XG4gICAgZC5sYXllcignbm9ydGhfbGV0dGVyJyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gsIHkrbGV0dGVyX2hdLFxuICAgICAgICBbeCwgeV0sXG4gICAgICAgIFt4K2Fycm93X3csIHkrbGV0dGVyX2hdLFxuICAgICAgICBbeCthcnJvd193LCB5XSxcbiAgICBdKTtcbiAgICBkLmxheWVyKCdub3J0aF9hcnJvdycpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LCB5K2Fycm93X2hdLFxuICAgICAgICBbeCwgeV0sXG4gICAgICAgIFt4K2Fycm93X3cvMiwgeStsZXR0ZXJfaC8yXSxcbiAgICBdKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCwgeV0sXG4gICAgICAgIFt4LWFycm93X3cvMiwgeStsZXR0ZXJfaC8yXSxcbiAgICBdKTtcbiAgICBkLmxheWVyKCk7XG4gICAgZC5ibG9ja19lbmQoJ25vcnRoIGFycm93Jyk7XG5cbiAgICBkLmJsb2NrX3N0YXJ0KCdub3J0aCBhcnJvd19sZWZ0Jyk7XG4gICAgZC5sYXllcignbm9ydGhfbGV0dGVyJyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3grbGV0dGVyX2gsIHldLFxuICAgICAgICBbeCwgeV0sXG4gICAgICAgIFt4K2xldHRlcl9oLCB5LWFycm93X3ddLFxuICAgICAgICBbeCwgICAgICAgICAgeS1hcnJvd193XSxcbiAgICBdKTtcbiAgICBkLmxheWVyKCdub3J0aF9hcnJvdycpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4K2Fycm93X2gsIHldLFxuICAgICAgICBbeCwgeV0sXG4gICAgICAgIFt4K2xldHRlcl9oLzIsIHktYXJyb3dfdy8yXSxcbiAgICBdKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCwgeV0sXG4gICAgICAgIFt4K2xldHRlcl9oLzIsIHkrYXJyb3dfdy8yXSxcbiAgICBdKTtcbiAgICBkLmxheWVyKCk7XG4gICAgZC5ibG9ja19lbmQoJ25vcnRoIGFycm93Jyk7XG5cbi8vKi9cblxuICAgIHJldHVybiBkLmRyYXdpbmdfcGFydHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuIiwidmFyIG1rX2RyYXdpbmcgPSByZXF1aXJlKCcuL21rX2RyYXdpbmcnKTtcblxuLy92YXIgZHJhd2luZ19wYXJ0cyA9IFtdO1xuLy9kLmxpbmtfZHJhd2luZ19wYXJ0cyhkcmF3aW5nX3BhcnRzKTtcblxudmFyIGFkZF9ib3JkZXIgPSBmdW5jdGlvbihzZXR0aW5ncywgc2hlZXRfc2VjdGlvbiwgc2hlZXRfbnVtKXtcbiAgICBkID0gbWtfZHJhd2luZygpO1xuICAgIHZhciBmID0gc2V0dGluZ3MuZjtcblxuICAgIC8vdmFyIGNvbXBvbmVudHMgPSBzZXR0aW5ncy5jb21wb25lbnRzO1xuICAgIC8vdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcbiAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuXG5cblxuXG4gICAgdmFyIHgsIHksIGgsIHc7XG4gICAgdmFyIG9mZnNldDtcblxuLy8gRGVmaW5lIGQuYmxvY2tzXG4vLyBtb2R1bGUgZC5ibG9ja1xuICAgIHcgPSBzaXplLm1vZHVsZS5mcmFtZS53O1xuICAgIGggPSBzaXplLm1vZHVsZS5mcmFtZS5oO1xuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEZyYW1lXG4gICAgZC5zZWN0aW9uKCdGcmFtZScpO1xuXG4gICAgdyA9IHNpemUuZHJhd2luZy53O1xuICAgIGggPSBzaXplLmRyYXdpbmcuaDtcbiAgICB2YXIgcGFkZGluZyA9IHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nO1xuXG4gICAgZC5sYXllcignZnJhbWUnKTtcblxuICAgIC8vYm9yZGVyXG4gICAgZC5yZWN0KCBbdy8yICwgaC8yXSwgW3cgLSBwYWRkaW5nKjIsIGggLSBwYWRkaW5nKjIgXSApO1xuXG4gICAgeCA9IHcgLSBwYWRkaW5nICogMztcbiAgICB5ID0gcGFkZGluZyAqIDM7XG5cbiAgICB3ID0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94O1xuICAgIGggPSBzaXplLmRyYXdpbmcudGl0bGVib3g7XG5cbiAgICAvLyBib3ggdG9wLXJpZ2h0XG4gICAgZC5yZWN0KCBbeC13LzIsIHkraC8yXSwgW3csaF0gKTtcblxuICAgIHkgKz0gaCArIHBhZGRpbmc7XG5cbiAgICB3ID0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94O1xuICAgIGggPSBzaXplLmRyYXdpbmcuaCAtIHBhZGRpbmcqOCAtIHNpemUuZHJhd2luZy50aXRsZWJveCoyLjU7XG5cbiAgICAvL3RpdGxlIGJveFxuICAgIGQucmVjdCggW3gtdy8yLCB5K2gvMl0sIFt3LGhdICk7XG5cbiAgICB2YXIgdGl0bGUgPSB7fTtcbiAgICB0aXRsZS50b3AgPSB5O1xuICAgIHRpdGxlLmJvdHRvbSA9IHkraDtcbiAgICB0aXRsZS5yaWdodCA9IHg7XG4gICAgdGl0bGUubGVmdCA9IHgtdyA7XG5cblxuICAgIC8vIGJveCBib3R0b20tcmlnaHRcbiAgICBoID0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94ICogMS41O1xuICAgIHkgPSB0aXRsZS5ib3R0b20gKyBwYWRkaW5nO1xuICAgIHggPSB4LXcvMjtcbiAgICB5ID0geStoLzI7XG4gICAgZC5yZWN0KCBbeCwgeV0sIFt3LGhdICk7XG5cbiAgICB5IC09IDIwKjIvMztcbiAgICBkLnRleHQoW3gseV0sXG4gICAgICAgIFsgc2hlZXRfc2VjdGlvbiwgc2hlZXRfbnVtIF0sXG4gICAgICAgICdwYWdlJyxcbiAgICAgICAgJ3RleHQnXG4gICAgICAgICk7XG5cblxuICAgIHZhciBwYWdlID0ge307XG4gICAgcGFnZS5yaWdodCA9IHRpdGxlLnJpZ2h0O1xuICAgIHBhZ2UubGVmdCA9IHRpdGxlLmxlZnQ7XG4gICAgcGFnZS50b3AgPSB0aXRsZS5ib3R0b20gKyBwYWRkaW5nO1xuICAgIHBhZ2UuYm90dG9tID0gcGFnZS50b3AgKyBzaXplLmRyYXdpbmcudGl0bGVib3gqMS41O1xuICAgIC8vIGQudGV4dFxuXG4gICAgeCA9IHRpdGxlLmxlZnQgKyBwYWRkaW5nO1xuICAgIHkgPSB0aXRsZS5ib3R0b20gLSBwYWRkaW5nO1xuXG4gICAgeCArPSAxMDtcbiAgICBpZiggc3lzdGVtLmludmVydGVyLm1ha2UgJiYgc3lzdGVtLmludmVydGVyLm1vZGVsICl7XG4gICAgICAgIGQudGV4dChbeCx5XSxcbiAgICAgICAgICAgICBbICdQViBTeXN0ZW0gRGVzaWduJyBdLFxuICAgICAgICAgICAgJ3RpdGxlMScsICd0ZXh0Jykucm90YXRlKC05MCk7XG5cbiAgICB9XG5cbiAgICB4ICs9IDE0O1xuICAgIGlmKCBnLmYuc2VjdGlvbl9kZWZpbmVkKCdsb2NhdGlvbicpICApe1xuICAgICAgICBkLnRleHQoW3gseV0sIFtcbiAgICAgICAgICAgIGcucGVybS5sb2NhdGlvbi5hZGRyZXNzLFxuICAgICAgICAgICAgZy5wZXJtLmxvY2F0aW9uLmNpdHkgKyAnLCAnICsgZy5wZXJtLmxvY2F0aW9uLmNvdW50eSArICcsIEZMLCAnICsgZy5wZXJtLmxvY2F0aW9uLnppcCxcblxuICAgICAgICBdLCAndGl0bGUzJywgJ3RleHQnKS5yb3RhdGUoLTkwKTtcbiAgICB9XG5cbiAgICB4ID0gcGFnZS5sZWZ0ICsgcGFkZGluZztcbiAgICB5ID0gcGFnZS50b3AgKyBwYWRkaW5nO1xuICAgIHkgKz0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94ICogMS41ICogMy80O1xuXG5cblxuXG5cblxuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZF9ib3JkZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBmID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMuanMnKTtcblxuLy92YXIgc2V0dGluZ3MgPSByZXF1aXJlKCcuL3NldHRpbmdzLmpzJyk7XG4vL3ZhciBsX2F0dHIgPSBzZXR0aW5ncy5kcmF3aW5nLmxfYXR0cjtcbi8vdmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG4vLyBzZXR1cCBkcmF3aW5nIGNvbnRhaW5lcnNcblxudmFyIHNldHRpbmdzID0gcmVxdWlyZSgnLi9zZXR0aW5ncycpO1xudmFyIGxheWVyX2F0dHIgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxheWVyX2F0dHI7XG52YXIgZm9udHMgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmZvbnRzO1xuXG5cblxuXG5cbnZhciBkcmF3aW5nID0ge307XG5cblxuXG5cblxuXG5cblxuXG4vLyBCTE9DS1NcblxudmFyIEJsayA9IHtcbiAgICB0eXBlOiAnYmxvY2snLFxufTtcbkJsay5tb3ZlID0gZnVuY3Rpb24oeCwgeSl7XG4gICAgZm9yKCB2YXIgaSBpbiB0aGlzLmRyYXdpbmdfcGFydHMgKXtcbiAgICAgICAgdGhpcy5kcmF3aW5nX3BhcnRzW2ldLm1vdmUoeCx5KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuQmxrLmFkZCA9IGZ1bmN0aW9uKCl7XG4gICAgaWYoIHR5cGVvZiB0aGlzLmRyYXdpbmdfcGFydHMgPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICB0aGlzLmRyYXdpbmdfcGFydHMgPSBbXTtcbiAgICB9XG4gICAgZm9yKCB2YXIgaSBpbiBhcmd1bWVudHMpe1xuICAgICAgICB0aGlzLmRyYXdpbmdfcGFydHMucHVzaChhcmd1bWVudHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5CbGsucm90YXRlID0gZnVuY3Rpb24oZGVnKXtcbiAgICB0aGlzLnJvdGF0ZSA9IGRlZztcbn07XG5cblxudmFyIGJsb2NrX2FjdGl2ZSA9IGZhbHNlO1xuLy8gQ3JlYXRlIGRlZmF1bHQgbGF5ZXIsYmxvY2sgY29udGFpbmVyIGFuZCBmdW5jdGlvbnNcblxuLy8gTGF5ZXJzXG5cbnZhciBsYXllcl9hY3RpdmUgPSBmYWxzZTtcblxuZHJhd2luZy5sYXllciA9IGZ1bmN0aW9uKG5hbWUpeyAvLyBzZXQgY3VycmVudCBsYXllclxuICAgIGlmKCB0eXBlb2YgbmFtZSA9PT0gJ3VuZGVmaW5lZCcgKXsgLy8gaWYgbm8gbGF5ZXIgbmFtZSBnaXZlbiwgcmVzZXQgdG8gZGVmYXVsdFxuICAgICAgICBsYXllcl9hY3RpdmUgPSBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKCAhIChuYW1lIGluIGxheWVyX2F0dHIpICkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0Vycm9yOiB1bmtub3duIGxheWVyIFwiJytuYW1lKydcIiwgdXNpbmcgYmFzZScpO1xuICAgICAgICBsYXllcl9hY3RpdmUgPSAnYmFzZScgO1xuICAgIH0gZWxzZSB7IC8vIGZpbmFseSBhY3RpdmF0ZSByZXF1ZXN0ZWQgbGF5ZXJcbiAgICAgICAgbGF5ZXJfYWN0aXZlID0gbmFtZTtcbiAgICB9XG4gICAgLy8qL1xufTtcblxudmFyIHNlY3Rpb25fYWN0aXZlID0gZmFsc2U7XG5cbmRyYXdpbmcuc2VjdGlvbiA9IGZ1bmN0aW9uKG5hbWUpeyAvLyBzZXQgY3VycmVudCBzZWN0aW9uXG4gICAgaWYoIHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJyApeyAvLyBpZiBubyBzZWN0aW9uIG5hbWUgZ2l2ZW4sIHJlc2V0IHRvIGRlZmF1bHRcbiAgICAgICAgc2VjdGlvbl9hY3RpdmUgPSBmYWxzZTtcbiAgICB9IGVsc2UgeyAvLyBmaW5hbHkgYWN0aXZhdGUgcmVxdWVzdGVkIHNlY3Rpb25cbiAgICAgICAgc2VjdGlvbl9hY3RpdmUgPSBuYW1lO1xuICAgIH1cbiAgICAvLyovXG59O1xuXG5cbmRyYXdpbmcuYmxvY2tfc3RhcnQgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgaWYoIHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJyApeyAvLyBpZiBuYW1lIGFyZ3VtZW50IGlzIHN1Ym1pdHRlZFxuICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6IG5hbWUgcmVxdWlyZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgYmxrO1xuICAgICAgICBibG9ja19hY3RpdmUgPSBuYW1lO1xuICAgICAgICBpZiggZy5kcmF3aW5nLmJsb2Nrc1tibG9ja19hY3RpdmVdICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogYmxvY2sgYWxyZWFkeSBleGlzdHMnKTtcbiAgICAgICAgfVxuICAgICAgICBibGsgPSBPYmplY3QuY3JlYXRlKEJsayk7XG4gICAgICAgIGcuZHJhd2luZy5ibG9ja3NbYmxvY2tfYWN0aXZlXSA9IGJsaztcbiAgICAgICAgcmV0dXJuIGJsaztcbiAgICB9XG59O1xuXG4gICAgLypcbiAgICB4ID0gbG9jLndpcmVfdGFibGUueCAtIHcvMjtcbiAgICB5ID0gbG9jLndpcmVfdGFibGUueSAtIGgvMjtcbiAgICBpZiggdHlwZW9mIGxheWVyX25hbWUgIT09ICd1bmRlZmluZWQnICYmIChsYXllcl9uYW1lIGluIGxheWVycykgKSB7XG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9IGxheWVyc1tsYXllcl9uYW1lXVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCAhIChsYXllcl9uYW1lIGluIGxheWVycykgKXsgY29uc29sZS5sb2coXCJlcnJvciwgbGF5ZXIgZG9lcyBub3QgZXhpc3QsIHVzaW5nIGN1cnJlbnRcIik7fVxuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSAgbGF5ZXJfYWN0aXZlXG4gICAgfVxuICAgICovXG5kcmF3aW5nLmJsb2NrX2VuZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBibGsgPSBnLmRyYXdpbmcuYmxvY2tzW2Jsb2NrX2FjdGl2ZV07XG4gICAgYmxvY2tfYWN0aXZlID0gZmFsc2U7XG4gICAgcmV0dXJuIGJsaztcbn07XG5cblxuXG5cblxuXG4vLy8vLy9cbi8vIGJ1aWxkIHByb3RvdHlwZSBlbGVtZW50XG5cbiAgICAvKlxuICAgIGlmKCB0eXBlb2YgbGF5ZXJfbmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApIHtcbiAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gbGF5ZXJzW2xheWVyX25hbWVdXG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYoICEgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApeyBjb25zb2xlLmxvZyhcImVycm9yLCBsYXllciBkb2VzIG5vdCBleGlzdCwgdXNpbmcgY3VycmVudFwiKTt9XG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9ICBsYXllcl9hY3RpdmVcbiAgICB9XG4gICAgKi9cblxuXG52YXIgU3ZnRWxlbSA9IHtcbiAgICBvYmplY3Q6ICdTdmdFbGVtJ1xufTtcblN2Z0VsZW0ubW92ZSA9IGZ1bmN0aW9uKHgsIHkpe1xuICAgIGlmKCB0eXBlb2YgdGhpcy5wb2ludHMgIT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgIGZvciggdmFyIGkgaW4gdGhpcy5wb2ludHMgKSB7XG4gICAgICAgICAgICB0aGlzLnBvaW50c1tpXVswXSArPSB4O1xuICAgICAgICAgICAgdGhpcy5wb2ludHNbaV1bMV0gKz0geTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5TdmdFbGVtLnJvdGF0ZSA9IGZ1bmN0aW9uKGRlZyl7XG4gICAgdGhpcy5yb3RhdGVkID0gZGVnO1xufTtcblxuLy8vLy8vL1xuLy8gZnVuY3Rpb25zIGZvciBhZGRpbmcgZHJhd2luZ19wYXJ0c1xuXG5kcmF3aW5nLmFkZCA9IGZ1bmN0aW9uKHR5cGUsIHBvaW50cywgbGF5ZXJfbmFtZSwgYXR0cnMpIHtcbiAgICBpZiggcG9pbnRzWzBdID09PSB1bmRlZmluZWQgKSBjb25zb2xlLndhcm4oXCJwb2ludHMgbm90IGRlZmZpbmVkXCIsIHR5cGUsIHBvaW50cywgbGF5ZXJfbmFtZSApO1xuXG4gICAgaWYoIHR5cGVvZiBsYXllcl9uYW1lID09PSAndW5kZWZpbmVkJyApIHsgbGF5ZXJfbmFtZSA9IGxheWVyX2FjdGl2ZTsgfVxuICAgIGlmKCAhIChsYXllcl9uYW1lIGluIGxheWVyX2F0dHIpICkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0Vycm9yOiBMYXllciBcIicrIGxheWVyX25hbWUgKydcIiBuYW1lIG5vdCBmb3VuZCwgdXNpbmcgYmFzZScpO1xuICAgICAgICBsYXllcl9uYW1lID0gJ2Jhc2UnO1xuICAgIH1cblxuICAgIGlmKCB0eXBlb2YgcG9pbnRzID09ICdzdHJpbmcnKSB7XG4gICAgICAgIHZhciBwb2ludHNfYSA9IHBvaW50cy5zcGxpdCgnICcpO1xuICAgICAgICBmb3IoIHZhciBpIGluIHBvaW50c19hICkge1xuICAgICAgICAgICAgcG9pbnRzX2FbaV0gPSBwb2ludHNfYVtpXS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgZm9yKCB2YXIgYyBpbiBwb2ludHNfYVtpXSApIHtcbiAgICAgICAgICAgICAgICBwb2ludHNfYVtpXVtjXSA9IE51bWJlcihwb2ludHNfYVtpXVtjXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZWxlbSA9IE9iamVjdC5jcmVhdGUoU3ZnRWxlbSk7XG4gICAgZWxlbS50eXBlID0gdHlwZTtcbiAgICBlbGVtLmxheWVyX25hbWUgPSBsYXllcl9uYW1lO1xuICAgIGVsZW0uc2VjdGlvbl9uYW1lID0gc2VjdGlvbl9hY3RpdmU7XG4gICAgaWYoIGF0dHJzICE9PSB1bmRlZmluZWQgKSBlbGVtLmF0dHJzID0gYXR0cnM7XG4gICAgaWYoIHR5cGUgPT09ICdsaW5lJyApIHtcbiAgICAgICAgZWxlbS5wb2ludHMgPSBwb2ludHM7XG4gICAgfSBlbHNlIGlmKCB0eXBlID09PSAncG9seScgKSB7XG4gICAgICAgIGVsZW0ucG9pbnRzID0gcG9pbnRzO1xuICAgIH0gZWxzZSBpZiggdHlwZW9mIHBvaW50c1swXS54ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBlbGVtLnggPSBwb2ludHNbMF1bMF07XG4gICAgICAgIGVsZW0ueSA9IHBvaW50c1swXVsxXTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtLnggPSBwb2ludHNbMF0ueDtcbiAgICAgICAgZWxlbS55ID0gcG9pbnRzWzBdLnk7XG4gICAgfVxuXG4gICAgaWYoYmxvY2tfYWN0aXZlKSB7XG4gICAgICAgIGVsZW0uYmxvY2tfbmFtZSA9IGJsb2NrX2FjdGl2ZTtcbiAgICAgICAgZy5kcmF3aW5nLmJsb2Nrc1tibG9ja19hY3RpdmVdLmFkZChlbGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRyYXdpbmdfcGFydHMucHVzaChlbGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbTtcbn07XG5cbmRyYXdpbmcubGluZSA9IGZ1bmN0aW9uKHBvaW50cywgbGF5ZXIsIGF0dHJzKXsgLy8gKHBvaW50cywgW2xheWVyXSlcbiAgICAvL3JldHVybiBhZGQoJ2xpbmUnLCBwb2ludHMsIGxheWVyKVxuICAgIHZhciBsaW5lID0gIHRoaXMuYWRkKCdsaW5lJywgcG9pbnRzLCBsYXllciwgYXR0cnMpO1xuICAgIHJldHVybiBsaW5lO1xufTtcblxuZHJhd2luZy5wb2x5ID0gZnVuY3Rpb24ocG9pbnRzLCBsYXllciwgYXR0cnMpeyAvLyAocG9pbnRzLCBbbGF5ZXJdKVxuICAgIC8vcmV0dXJuIGFkZCgncG9seScsIHBvaW50cywgbGF5ZXIpXG4gICAgdmFyIHBvbHkgPSAgdGhpcy5hZGQoJ3BvbHknLCBwb2ludHMsIGxheWVyLCBhdHRycyk7XG4gICAgcmV0dXJuIHBvbHk7XG59O1xuXG5kcmF3aW5nLnJlY3QgPSBmdW5jdGlvbihsb2MsIHNpemUsIGxheWVyLCBhdHRycyl7XG4gICAgdmFyIHJlYyA9IHRoaXMuYWRkKCdyZWN0JywgW2xvY10sIGxheWVyLCBhdHRycyk7XG4gICAgcmVjLncgPSBzaXplWzBdO1xuICAgIC8qXG4gICAgaWYoIHR5cGVvZiBsYXllcl9uYW1lICE9PSAndW5kZWZpbmVkJyAmJiAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICkge1xuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSBsYXllcnNbbGF5ZXJfbmFtZV1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiggISAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICl7IGNvbnNvbGUubG9nKFwiZXJyb3IsIGxheWVyIGRvZXMgbm90IGV4aXN0LCB1c2luZyBjdXJyZW50XCIpO31cbiAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gIGxheWVyX2FjdGl2ZVxuICAgIH1cbiAgICAqL1xuICAgIHJlYy5oID0gc2l6ZVsxXTtcbiAgICByZXR1cm4gcmVjO1xufTtcblxuZHJhd2luZy5jaXJjID0gZnVuY3Rpb24obG9jLCBkaWFtZXRlciwgbGF5ZXIsIGF0dHJzKXtcbiAgICB2YXIgY2lyID0gdGhpcy5hZGQoJ2NpcmMnLCBbbG9jXSwgbGF5ZXIsIGF0dHJzKTtcbiAgICBjaXIuZCA9IGRpYW1ldGVyO1xuICAgIHJldHVybiBjaXI7XG59O1xuXG5kcmF3aW5nLnRleHQgPSBmdW5jdGlvbihsb2MsIHN0cmluZ3MsIGZvbnQsIGxheWVyLCBhdHRycyl7XG4gICAgdmFyIHR4dCA9IHRoaXMuYWRkKCd0ZXh0JywgW2xvY10sIGxheWVyLCBhdHRycyk7XG4gICAgaWYoIHR5cGVvZiBzdHJpbmdzID09ICdzdHJpbmcnKXtcbiAgICAgICAgc3RyaW5ncyA9IFtzdHJpbmdzXTtcbiAgICB9XG4gICAgdHh0LnN0cmluZ3MgPSBzdHJpbmdzO1xuICAgIHR4dC5mb250ID0gZm9udDtcbiAgICByZXR1cm4gdHh0O1xufTtcblxuZHJhd2luZy5ibG9jayA9IGZ1bmN0aW9uKG5hbWUpIHsvLyBzZXQgY3VycmVudCBibG9ja1xuICAgIHZhciB4LHk7XG4gICAgaWYoIGFyZ3VtZW50cy5sZW5ndGggPT09IDIgKXsgLy8gaWYgY29vciBpcyBwYXNzZWRcbiAgICAgICAgaWYoIHR5cGVvZiBhcmd1bWVudHNbMV0ueCAhPT0gJ3VuZGVmaW5lZCcgKXtcbiAgICAgICAgICAgIHggPSBhcmd1bWVudHNbMV0ueDtcbiAgICAgICAgICAgIHkgPSBhcmd1bWVudHNbMV0ueTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHggPSBhcmd1bWVudHNbMV1bMF07XG4gICAgICAgICAgICB5ID0gYXJndW1lbnRzWzFdWzFdO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmKCBhcmd1bWVudHMubGVuZ3RoID09PSAzICl7IC8vIGlmIHgseSBpcyBwYXNzZWRcbiAgICAgICAgeCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgeSA9IGFyZ3VtZW50c1syXTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiB3aGF0IGlmIGJsb2NrIGRvZXMgbm90IGV4aXN0PyBwcmludCBsaXN0IG9mIGJsb2Nrcz9cbiAgICB2YXIgYmxrID0gT2JqZWN0LmNyZWF0ZShnLmRyYXdpbmcuYmxvY2tzW25hbWVdKTtcbiAgICBibGsueCA9IHg7XG4gICAgYmxrLnkgPSB5O1xuXG4gICAgaWYoYmxvY2tfYWN0aXZlKXtcbiAgICAgICAgZy5kcmF3aW5nLmJsb2Nrc1tibG9ja19hY3RpdmVdLmFkZChibGspO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZHJhd2luZ19wYXJ0cy5wdXNoKGJsayk7XG4gICAgfVxuICAgIHJldHVybiBibGs7XG59O1xuXG5cblxuXG5cblxuXG5cblxuXG4vLy8vLy8vLy8vLy8vL1xuLy8gVGFibGVzXG5cbnZhciBDZWxsID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKHRhYmxlLCBSLCBDKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLnRhYmxlID0gdGFibGU7XG4gICAgICAgIHRoaXMuUiA9IFI7XG4gICAgICAgIHRoaXMuQyA9IEM7XG4gICAgICAgIC8qXG4gICAgICAgIHRoaXMuYm9yZGVycyA9IHt9O1xuICAgICAgICB0aGlzLmJvcmRlcl9vcHRpb25zLmZvckVhY2goZnVuY3Rpb24oc2lkZSl7XG4gICAgICAgICAgICBzZWxmLmJvcmRlcnNbc2lkZV0gPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vKi9cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICAvKlxuICAgIGJvcmRlcl9vcHRpb25zOiBbJ1QnLCAnQicsICdMJywgJ1InXSxcbiAgICAvLyovXG4gICAgdGV4dDogZnVuY3Rpb24odGV4dCl7XG4gICAgICAgIHRoaXMuY2VsbF90ZXh0ID0gdGV4dDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9LFxuICAgIGZvbnQ6IGZ1bmN0aW9uKGZvbnRfbmFtZSl7XG4gICAgICAgIHRoaXMuY2VsbF9mb250X25hbWUgPSBmb250X25hbWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICBib3JkZXI6IGZ1bmN0aW9uKGJvcmRlcl9zdHJpbmcsIHN0YXRlKXtcbiAgICAgICAgdGhpcy50YWJsZS5ib3JkZXIoIHRoaXMuUiwgdGhpcy5DLCBib3JkZXJfc3RyaW5nLCBzdGF0ZSApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59O1xuXG52YXIgVGFibGUgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oIGRyYXdpbmcsIG51bV9yb3dzLCBudW1fY29scyApe1xuICAgICAgICB0aGlzLmRyYXdpbmcgPSBkcmF3aW5nO1xuICAgICAgICB0aGlzLm51bV9yb3dzID0gbnVtX3Jvd3M7XG4gICAgICAgIHRoaXMubnVtX2NvbHMgPSBudW1fY29scztcbiAgICAgICAgdmFyIHIsYztcblxuICAgICAgICAvLyBzZXR1cCBib3JkZXIgY29udGFpbmVyc1xuICAgICAgICB0aGlzLmJvcmRlcnNfcm93cyA9IFtdO1xuICAgICAgICBmb3IoIHI9MDsgcjw9bnVtX3Jvd3M7IHIrKyl7XG4gICAgICAgICAgICB0aGlzLmJvcmRlcnNfcm93c1tyXSA9IFtdO1xuICAgICAgICAgICAgZm9yKCBjPTE7IGM8PW51bV9jb2xzOyBjKyspe1xuICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyc19yb3dzW3JdW2NdID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ib3JkZXJzX2NvbHMgPSBbXTtcbiAgICAgICAgZm9yKCBjPTA7IGM8PW51bV9jb2xzOyBjKyspe1xuICAgICAgICAgICAgdGhpcy5ib3JkZXJzX2NvbHNbY10gPSBbXTtcbiAgICAgICAgICAgIGZvciggcj0xOyByPD1udW1fcm93czsgcisrKXtcbiAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfY29sc1tjXVtyXSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2V0IGNvbHVtbiBhbmQgcm93IHNpemUgY29udGFpbmVyc1xuICAgICAgICB0aGlzLnJvd19zaXplcyA9IFtdO1xuICAgICAgICBmb3IoIHI9MTsgcjw9bnVtX3Jvd3M7IHIrKyl7XG4gICAgICAgICAgICB0aGlzLnJvd19zaXplc1tyXSA9IDE1O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29sX3NpemVzID0gW107XG4gICAgICAgIGZvciggYz0xOyBjPD1udW1fY29sczsgYysrKXtcbiAgICAgICAgICAgIHRoaXMuY29sX3NpemVzW2NdID0gNjA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzZXR1cCBjZWxsIGNvbnRhaW5lclxuICAgICAgICB0aGlzLmNlbGxzID0gW107XG4gICAgICAgIGZvciggcj0xOyByPD1udW1fcm93czsgcisrKXtcbiAgICAgICAgICAgIHRoaXMuY2VsbHNbcl0gPSBbXTtcbiAgICAgICAgICAgIGZvciggYz0xOyBjPD1udW1fY29sczsgYysrKXtcbiAgICAgICAgICAgICAgICB0aGlzLmNlbGxzW3JdW2NdID0gT2JqZWN0LmNyZWF0ZShDZWxsKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNlbGxzW3JdW2NdLmluaXQoIHRoaXMsIHIsIGMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgLy8qL1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgbG9jOiBmdW5jdGlvbiggeCwgeSl7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY2VsbDogZnVuY3Rpb24oIFIsIEMgKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2VsbHNbUl1bQ107XG4gICAgfSxcbiAgICBhbGxfY2VsbHM6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBjZWxsX2FycmF5ID0gW107XG4gICAgICAgIHRoaXMuY2VsbHMuZm9yRWFjaChmdW5jdGlvbihyb3cpe1xuICAgICAgICAgICAgcm93LmZvckVhY2goZnVuY3Rpb24oY2VsbCl7XG4gICAgICAgICAgICAgICAgY2VsbF9hcnJheS5wdXNoKGNlbGwpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY2VsbF9hcnJheTtcbiAgICB9LFxuICAgIGNvbF9zaXplOiBmdW5jdGlvbihjb2wsIHNpemUpe1xuICAgICAgICBpZiggdHlwZW9mIGNvbCA9PT0gJ3N0cmluZycgKXtcbiAgICAgICAgICAgIGlmKCBjb2wgPT09ICdhbGwnKXtcbiAgICAgICAgICAgICAgICBfLnJhbmdlKHRoaXMubnVtX2NvbHMpLmZvckVhY2goZnVuY3Rpb24oYyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29sX3NpemVzW2MrMV0gPSBzaXplO1xuICAgICAgICAgICAgICAgIH0sdGhpcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNpemUgPSBOdW1iZXIoc2l6ZSk7XG4gICAgICAgICAgICAgICAgaWYoIGlzTmFOKHNpemUpICl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogY29sdW1uIHdyb25nJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xfc2l6ZXNbY29sXSA9IHNpemU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgeyAvLyBpcyBudW1iZXJcbiAgICAgICAgICAgIHRoaXMuY29sX3NpemVzW2NvbF0gPSBzaXplO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgLy8qL1xuICAgIHJvd19zaXplOiBmdW5jdGlvbihyb3csIHNpemUpe1xuICAgICAgICBpZiggdHlwZW9mIHJvdyA9PT0gJ3N0cmluZycgKXtcbiAgICAgICAgICAgIGlmKCByb3cgPT09ICdhbGwnKXtcbiAgICAgICAgICAgICAgICBfLnJhbmdlKHRoaXMubnVtX3Jvd3MpLmZvckVhY2goZnVuY3Rpb24ocil7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm93X3NpemVzW3IrMV0gPSBzaXplO1xuICAgICAgICAgICAgICAgIH0sdGhpcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNpemUgPSBOdW1iZXIoc2l6ZSk7XG4gICAgICAgICAgICAgICAgaWYoIGlzTmFOKHNpemUpICl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogY29sdW1uIHdyb25nJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3dfc2l6ZXNbcm93XSA9IHNpemU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgeyAvLyBpcyBudW1iZXJcbiAgICAgICAgICAgIHRoaXMucm93X3NpemVzW3Jvd10gPSBzaXplO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgLy8qL1xuXG4gICAgLypcbiAgICBhZGRfY2VsbDogZnVuY3Rpb24oKXtcblxuICAgIH0sXG4gICAgYWRkX3Jvd3M6IGZ1bmN0aW9uKG4pe1xuICAgICAgICB0aGlzLm51bV9jb2xtbnMgKz0gbjtcbiAgICAgICAgdGhpcy5udW1fcm93cyArPSBuO1xuICAgICAgICBfLnJhbmdlKG4pLmZvckVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMucm93cy5wdXNoKFtdKTtcbiAgICAgICAgfSk7XG4gICAgICAgIF8ucmFuZ2UobikuZm9yRWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy50ZXh0X3Jvd3MucHVzaChbXSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSxcbiAgICB0ZXh0OiBmdW5jdGlvbiggUiwgQywgdGV4dCl7XG4gICAgICAgIHRoaXMudGV4dF9yb3dzW1JdW0NdID0gdGV4dDtcbiAgICB9LFxuICAgIC8vKi9cbiAgICBib3JkZXI6IGZ1bmN0aW9uKCBSLCBDLCBib3JkZXJfc3RyaW5nLCBzdGF0ZSl7XG4gICAgICAgIGlmKCBzdGF0ZSA9PT0gdW5kZWZpbmVkICkgc3RhdGUgPSB0cnVlO1xuXG4gICAgICAgIGJvcmRlcl9zdHJpbmcgPSBib3JkZXJfc3RyaW5nLnRvVXBwZXJDYXNlKCkudHJpbSgpO1xuICAgICAgICB2YXIgYm9yZGVycztcbiAgICAgICAgaWYoIGJvcmRlcl9zdHJpbmcgPT09ICdBTEwnICl7XG4gICAgICAgICAgICBib3JkZXJzID0gWydUJywgJ0InLCAnTCcsICdSJ107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBib3JkZXJzID0gYm9yZGVyX3N0cmluZy5zcGxpdCgvW1xccyxdKy8pO1xuICAgICAgICB9XG4gICAgICAgIGJvcmRlcnMuZm9yRWFjaChmdW5jdGlvbihzaWRlKXtcbiAgICAgICAgICAgIHN3aXRjaChzaWRlKXtcbiAgICAgICAgICAgICAgICBjYXNlICdUJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3JkZXJzX3Jvd3NbUi0xXVtDXSA9IHN0YXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdCJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3JkZXJzX3Jvd3NbUl1bQ10gPSBzdGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnTCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyc19jb2xzW0MtMV1bUl0gPSBzdGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnUic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyc19jb2xzW0NdW1JdID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjb3JuZXI6IGZ1bmN0aW9uKFIsQyl7XG4gICAgICAgIHZhciB4ID0gdGhpcy54O1xuICAgICAgICB2YXIgeSA9IHRoaXMueTtcbiAgICAgICAgdmFyIHIsYztcbiAgICAgICAgZm9yKCByPTE7IHI8PVI7IHIrKyApe1xuICAgICAgICAgICAgeSArPSB0aGlzLnJvd19zaXplc1tyXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IoIGM9MTsgYzw9QzsgYysrICl7XG4gICAgICAgICAgICB4ICs9IHRoaXMuY29sX3NpemVzW2NdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbeCx5XTtcbiAgICB9LFxuICAgIGNlbnRlcjogZnVuY3Rpb24oUixDKXtcbiAgICAgICAgdmFyIHggPSB0aGlzLng7XG4gICAgICAgIHZhciB5ID0gdGhpcy55O1xuICAgICAgICB2YXIgcixjO1xuICAgICAgICBmb3IoIHI9MTsgcjw9UjsgcisrICl7XG4gICAgICAgICAgICB5ICs9IHRoaXMucm93X3NpemVzW3JdO1xuICAgICAgICB9XG4gICAgICAgIGZvciggYz0xOyBjPD1DOyBjKysgKXtcbiAgICAgICAgICAgIHggKz0gdGhpcy5jb2xfc2l6ZXNbY107XG4gICAgICAgIH1cbiAgICAgICAgeSAtPSB0aGlzLnJvd19zaXplc1tSXS8yO1xuICAgICAgICB4IC09IHRoaXMuY29sX3NpemVzW0NdLzI7XG4gICAgICAgIHJldHVybiBbeCx5XTtcbiAgICB9LFxuICAgIGxlZnQ6IGZ1bmN0aW9uKFIsQyl7XG4gICAgICAgIHZhciBjb29yID0gdGhpcy5jZW50ZXIoUixDKTtcbiAgICAgICAgY29vclswXSA9IGNvb3JbMF0gLSB0aGlzLmNvbF9zaXplc1tDXS8yICsgdGhpcy5yb3dfc2l6ZXNbUl0vMjtcbiAgICAgICAgcmV0dXJuIGNvb3I7XG4gICAgfSxcbiAgICByaWdodDogZnVuY3Rpb24oUixDKXtcbiAgICAgICAgdmFyIGNvb3IgPSB0aGlzLmNlbnRlcihSLEMpO1xuICAgICAgICBjb29yWzBdID0gY29vclswXSArIHRoaXMuY29sX3NpemVzW0NdLzIgLSB0aGlzLnJvd19zaXplc1tSXS8yO1xuICAgICAgICByZXR1cm4gY29vcjtcbiAgICB9LFxuICAgIG1rOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHZhciByLGM7XG4gICAgICAgIGZvciggcj0wOyByPD10aGlzLm51bV9yb3dzOyByKysgKXtcbiAgICAgICAgICAgIGZvciggYz0xOyBjPD10aGlzLm51bV9jb2xzOyBjKysgKXtcbiAgICAgICAgICAgICAgICBpZiggdGhpcy5ib3JkZXJzX3Jvd3Nbcl1bY10gPT09IHRydWUgKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3aW5nLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JuZXIocixjLTEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JuZXIocixjKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sICdib3JkZXInKTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IoIGM9MDsgYzw9dGhpcy5udW1fY29sczsgYysrICl7XG4gICAgICAgICAgICBmb3IoIHI9MTsgcjw9dGhpcy5udW1fcm93czsgcisrICl7XG4gICAgICAgICAgICAgICAgaWYoIHRoaXMuYm9yZGVyc19jb2xzW2NdW3JdID09PSB0cnVlICl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd2luZy5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ybmVyKHItMSxjKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ybmVyKHIsYyksXG4gICAgICAgICAgICAgICAgICAgICAgICBdLCAnYm9yZGVyJyk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yKCByPTE7IHI8PXRoaXMubnVtX3Jvd3M7IHIrKyApe1xuICAgICAgICAgICAgZm9yKCBjPTE7IGM8PXRoaXMubnVtX2NvbHM7IGMrKyApe1xuICAgICAgICAgICAgICAgIGlmKCB0eXBlb2YgdGhpcy5jZWxsKHIsYykuY2VsbF90ZXh0ID09PSAnc3RyaW5nJyApe1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IHRoaXMuY2VsbChyLGMpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm9udF9uYW1lID0gY2VsbC5jZWxsX2ZvbnRfbmFtZSB8fCAndGFibGUnO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29vcjtcbiAgICAgICAgICAgICAgICAgICAgaWYoIGcuZHJhd2luZ19zZXR0aW5ncy5mb250c1tmb250X25hbWVdWyd0ZXh0LWFuY2hvciddID09PSAnY2VudGVyJykgY29vciA9IHRoaXMuY2VudGVyKHIsYyk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoIGcuZHJhd2luZ19zZXR0aW5ncy5mb250c1tmb250X25hbWVdWyd0ZXh0LWFuY2hvciddID09PSAncmlnaHQnKSBjb29yID0gdGhpcy5yaWdodChyLGMpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKCBnLmRyYXdpbmdfc2V0dGluZ3MuZm9udHNbZm9udF9uYW1lXVsndGV4dC1hbmNob3InXSA9PT0gJ2xlZnQnKSBjb29yID0gdGhpcy5sZWZ0KHIsYyk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgY29vciA9IHRoaXMuY2VudGVyKHIsYyk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3aW5nLnRleHQoXG4gICAgICAgICAgICAgICAgICAgICAgICBjb29yLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsKHIsYykuY2VsbF90ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udF9uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQnXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbn07XG5cbmRyYXdpbmcudGFibGUgPSBmdW5jdGlvbiggbnVtX3Jvd3MsIG51bV9jb2xzICl7XG4gICAgdmFyIG5ld190YWJsZSA9IE9iamVjdC5jcmVhdGUoVGFibGUpO1xuICAgIG5ld190YWJsZS5pbml0KCB0aGlzLCBudW1fcm93cywgbnVtX2NvbHMgKTtcblxuICAgIHJldHVybiBuZXdfdGFibGU7XG5cbn07XG5cblxuZHJhd2luZy5hcHBlbmQgPSAgZnVuY3Rpb24oZHJhd2luZ19wYXJ0cyl7XG4gICAgdGhpcy5kcmF3aW5nX3BhcnRzID0gdGhpcy5kcmF3aW5nX3BhcnRzLmNvbmNhdChkcmF3aW5nX3BhcnRzKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cblxuXG52YXIgbWtfZHJhd2luZyA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHBhZ2UgPSBPYmplY3QuY3JlYXRlKGRyYXdpbmcpO1xuICAgIC8vY29uc29sZS5sb2cocGFnZSk7XG4gICAgcGFnZS5kcmF3aW5nX3BhcnRzID0gW107XG4gICAgcmV0dXJuIHBhZ2U7XG59O1xuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBta19kcmF3aW5nO1xuIiwidmFyIG1rX2RyYXdpbmcgPSByZXF1aXJlKCcuL21rX2RyYXdpbmcnKTtcbnZhciBta19ib3JkZXIgPSByZXF1aXJlKCcuL21rX2JvcmRlcicpO1xuXG52YXIgcGFnZSA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICBjb25zb2xlLmxvZyhcIioqIE1ha2luZyBwYWdlIDFcIik7XG5cbiAgICB2YXIgZCA9IG1rX2RyYXdpbmcoKTtcblxuICAgIHZhciBzaGVldF9zZWN0aW9uID0gJ0EnO1xuICAgIHZhciBzaGVldF9udW0gPSAnMDAnO1xuICAgIGQuYXBwZW5kKG1rX2JvcmRlcihzZXR0aW5ncywgc2hlZXRfc2VjdGlvbiwgc2hlZXRfbnVtICkpO1xuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuXG4gICAgdmFyIHgsIHksIGgsIHc7XG5cbiAgICBkLnRleHQoXG4gICAgICAgIFtzaXplLmRyYXdpbmcudyoxLzIsIHNpemUuZHJhd2luZy5oKjEvM10sXG4gICAgICAgIFtcbiAgICAgICAgICAgICdQViBTeXN0ZW0gRGVzaWduJyxcbiAgICAgICAgXSxcbiAgICAgICAgJ3Byb2plY3QgdGl0bGUnXG4gICAgKTtcblxuICAgIGlmKCBnLmYuc2VjdGlvbl9kZWZpbmVkKCdsb2NhdGlvbicpICApe1xuICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICBbc2l6ZS5kcmF3aW5nLncqMS8yLCBzaXplLmRyYXdpbmcuaCoxLzMgKzMwXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBnLnBlcm0ubG9jYXRpb24uYWRkcmVzcyxcbiAgICAgICAgICAgICAgICBnLnBlcm0ubG9jYXRpb24uY2l0eSArICcsICcgKyBnLnBlcm0ubG9jYXRpb24uY291bnR5ICsgJywgRkwsICcgKyBnLnBlcm0ubG9jYXRpb24uemlwLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwcm9qZWN0IHRpdGxlJ1xuICAgICAgICApO1xuICAgIH1cbiAgICB2YXIgbl9yb3dzID0gNDtcbiAgICB2YXIgbl9jb2xzID0gMjtcbiAgICB3ID0gNDAwKzgwO1xuICAgIGggPSBuX3Jvd3MqMjA7XG4gICAgeCA9IHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nKjY7XG4gICAgeSA9IHNpemUuZHJhd2luZy5oIC0gc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmcqNiAtIDQqMjA7XG5cbiAgICBkLnRleHQoIFt4K3cvMiwgeS0yMF0sICdDb250ZW50cycsJ3RhYmxlX2xhcmdlJyApO1xuXG4gICAgdmFyIHQgPSBkLnRhYmxlKG5fcm93cyxuX2NvbHMpLmxvYyh4LHkpO1xuICAgIHQucm93X3NpemUoJ2FsbCcsIDIwKS5jb2xfc2l6ZSgyLCA0MDApLmNvbF9zaXplKDEsIDgwKTtcbiAgICB0LmNlbGwoMSwxKS50ZXh0KCdQVi0wMScpO1xuICAgIHQuY2VsbCgxLDIpLnRleHQoJ1BWIHN5c3RlbSB3aXJpbmcgZGlhZ3JhbScpO1xuICAgIHQuY2VsbCgyLDEpLnRleHQoJ1BWLTAyJyk7XG4gICAgdC5jZWxsKDIsMikudGV4dCgnUFYgc3lzdGVtIHNwZWNpZmljYXRpb25zJyk7XG4gICAgdC5jZWxsKDMsMSkudGV4dCgnUy0wMScpO1xuICAgIHQuY2VsbCgzLDIpLnRleHQoJ1Jvb2YgZGV0YWlscycpO1xuXG4gICAgdC5hbGxfY2VsbHMoKS5mb3JFYWNoKGZ1bmN0aW9uKGNlbGwpe1xuICAgICAgICBjZWxsLmZvbnQoJ3RhYmxlX2xhcmdlX2xlZnQnKS5ib3JkZXIoJ2FsbCcpO1xuICAgIH0pO1xuXG4gICAgdC5taygpO1xuXG4gICAgLypcbiAgICBjb25zb2xlLmxvZyh0YWJsZV9wYXJ0cyk7XG4gICAgZC5hcHBlbmQodGFibGVfcGFydHMpO1xuICAgIGQudGV4dChbc2l6ZS5kcmF3aW5nLncvMyxzaXplLmRyYXdpbmcuaC8zXSwgJ1gnLCAndGFibGUnKTtcbiAgICBkLnJlY3QoW3NpemUuZHJhd2luZy53LzMtNSxzaXplLmRyYXdpbmcuaC8zLTVdLFsxMCwxMF0sJ2JveCcpO1xuXG4gICAgdC5jZWxsKDIsMikuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDIsMicpO1xuICAgIHQuY2VsbCgzLDMpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCAzLDMnKTtcbiAgICB0LmNlbGwoNCw0KS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgNCw0Jyk7XG4gICAgdC5jZWxsKDUsNSkuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDUsNScpO1xuXG5cblxuICAgIHQuY2VsbCg0LDYpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCA0LDYnKTtcbiAgICB0LmNlbGwoNCw3KS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgNCw3Jyk7XG4gICAgdC5jZWxsKDUsNikuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDUsNicpO1xuICAgIHQuY2VsbCg1LDcpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCA1LDcnKTtcblxuXG4gICAgLy8qL1xuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xudmFyIG1rX2JvcmRlciA9IHJlcXVpcmUoJy4vbWtfYm9yZGVyJyk7XG5cbi8vdmFyIGRyYXdpbmdfcGFydHMgPSBbXTtcbi8vZC5saW5rX2RyYXdpbmdfcGFydHMoZHJhd2luZ19wYXJ0cyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHBhZ2UgMlwiKTtcbiAgICBkID0gbWtfZHJhd2luZygpO1xuICAgIHZhciBzaGVldF9zZWN0aW9uID0gJ1BWJztcbiAgICB2YXIgc2hlZXRfbnVtID0gJzAxJztcbiAgICBkLmFwcGVuZChta19ib3JkZXIoc2V0dGluZ3MsIHNoZWV0X3NlY3Rpb24sIHNoZWV0X251bSApKTtcblxuICAgIHZhciBmID0gc2V0dGluZ3MuZjtcblxuICAgIC8vdmFyIGNvbXBvbmVudHMgPSBzZXR0aW5ncy5jb21wb25lbnRzO1xuICAgIC8vdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcbiAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuXG5cblxuXG4gICAgdmFyIHgsIHksIGgsIHc7XG4gICAgdmFyIG9mZnNldDtcblxuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vI2FycmF5XG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdtb2R1bGUnKSAmJiBmLnNlY3Rpb25fZGVmaW5lZCgnYXJyYXknKSApe1xuICAgICAgICBkLnNlY3Rpb24oJ2FycmF5Jyk7XG5cblxuICAgICAgICB4ID0gbG9jLmFycmF5LnJpZ2h0IC0gc2l6ZS5zdHJpbmcudztcbiAgICAgICAgeSA9IGxvYy5hcnJheS51cHBlcjtcbiAgICAgICAgLy95IC09IHNpemUuc3RyaW5nLmgvMjtcblxuXG4gICAgICAgIC8vZm9yKCB2YXIgaT0wOyBpPHN5c3RlbS5EQy5zdHJpbmdfbnVtOyBpKysgKSB7XG4gICAgICAgIGZvciggdmFyIGkgaW4gXy5yYW5nZShzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MpKSB7XG4gICAgICAgICAgICAvL3ZhciBvZmZzZXQgPSBpICogc2l6ZS53aXJlX29mZnNldC5iYXNlXG4gICAgICAgICAgICB2YXIgb2Zmc2V0X3dpcmUgPSBzaXplLndpcmVfb2Zmc2V0Lm1pbiArICggc2l6ZS53aXJlX29mZnNldC5iYXNlICogaSApO1xuXG4gICAgICAgICAgICBkLmJsb2NrKCdzdHJpbmcnLCBbeCx5XSk7XG4gICAgICAgICAgICAvLyBwb3NpdGl2ZSBob21lIHJ1blxuICAgICAgICAgICAgZC5sYXllcignRENfcG9zJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCAsIGxvYy5hcnJheS51cHBlciBdLFxuICAgICAgICAgICAgICAgIFsgeCAsIGxvYy5hcnJheS51cHBlci1vZmZzZXRfd2lyZSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K29mZnNldF93aXJlICwgbG9jLmFycmF5LnVwcGVyLW9mZnNldF93aXJlIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrb2Zmc2V0X3dpcmUgLCBsb2MuamJfYm94Lnktb2Zmc2V0X3dpcmVdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmpiX2JveC54ICwgbG9jLmpiX2JveC55LW9mZnNldF93aXJlXSxcbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICAvLyBuZWdhdGl2ZSBob21lIHJ1blxuICAgICAgICAgICAgZC5sYXllcignRENfbmVnJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCAsIGxvYy5hcnJheS5sb3dlciBdLFxuICAgICAgICAgICAgICAgIFsgeCAsIGxvYy5hcnJheS5sb3dlcl9saW1pdCtvZmZzZXRfd2lyZSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K29mZnNldF93aXJlICwgbG9jLmFycmF5Lmxvd2VyX2xpbWl0K29mZnNldF93aXJlIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrb2Zmc2V0X3dpcmUgLCBsb2MuamJfYm94Lnkrb2Zmc2V0X3dpcmVdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmpiX2JveC54ICwgbG9jLmpiX2JveC55K29mZnNldF93aXJlXSxcbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICB4IC09IHNpemUuc3RyaW5nLnc7XG4gICAgICAgIH1cblxuICAgIC8vICAgIGQucmVjdChcbiAgICAvLyAgICAgICAgWyAobG9jLmFycmF5LnJpZ2h0K2xvYy5hcnJheS5sZWZ0KS8yLCAobG9jLmFycmF5Lmxvd2VyK2xvYy5hcnJheS51cHBlcikvMiBdLFxuICAgIC8vICAgICAgICBbIGxvYy5hcnJheS5yaWdodC1sb2MuYXJyYXkubGVmdCwgbG9jLmFycmF5Lmxvd2VyLWxvYy5hcnJheS51cHBlciBdLFxuICAgIC8vICAgICAgICAnRENfcG9zJyk7XG4gICAgLy9cblxuICAgICAgICBkLmxheWVyKCdEQ19ncm91bmQnKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIC8vWyBsb2MuYXJyYXkubGVmdCAsIGxvYy5hcnJheS5sb3dlciArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgICAgICAgICBbIGxvYy5hcnJheS5sZWZ0LCBsb2MuYXJyYXkubG93ZXJfbGltaXQgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLCBsb2MuYXJyYXkubG93ZXJfbGltaXQgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLCBsb2MuamJfYm94LnkgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZF0sXG4gICAgICAgICAgICBbIGxvYy5qYl9ib3gueCAsIGxvYy5qYl9ib3gueStzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZF0sXG4gICAgICAgIF0pO1xuXG4gICAgICAgIGQubGF5ZXIoKTtcblxuXG4gICAgfS8vIGVsc2UgeyBjb25zb2xlLmxvZyhcIkRyYXdpbmc6IGFycmF5IG5vdCByZWFkeVwiKX1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gY29tYmluZXIgYm94XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ0RDJykgKXtcblxuICAgICAgICBkLnNlY3Rpb24oXCJjb21iaW5lclwiKTtcblxuICAgICAgICB4ID0gbG9jLmpiX2JveC54O1xuICAgICAgICB5ID0gbG9jLmpiX2JveC55O1xuXG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFt4LHldLFxuICAgICAgICAgICAgW3NpemUuamJfYm94Lncsc2l6ZS5qYl9ib3guaF0sXG4gICAgICAgICAgICAnYm94J1xuICAgICAgICApO1xuXG5cbiAgICAgICAgZm9yKCBpIGluIF8ucmFuZ2Uoc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzKSkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5taW4gKyAoIHNpemUud2lyZV9vZmZzZXQuYmFzZSAqIGkgKTtcblxuICAgICAgICAgICAgZC5sYXllcignRENfcG9zJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCAsIHktb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIHggLCB5LW9mZnNldF0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgICAgIHk6IHktb2Zmc2V0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCAsIHktb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngtb2Zmc2V0ICwgeS1vZmZzZXRdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueC1vZmZzZXQgLCBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngtb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgICAgICB4OiBsb2MuZGlzY2JveC54LW9mZnNldCxcbiAgICAgICAgICAgICAgICB5OiBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZC5sYXllcignRENfbmVnJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCwgeStvZmZzZXRdLFxuICAgICAgICAgICAgICAgIFsgeC1zaXplLmZ1c2Uudy8yICwgeStvZmZzZXRdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBkLmJsb2NrKCAnZnVzZScsIHtcbiAgICAgICAgICAgICAgICB4OiB4ICxcbiAgICAgICAgICAgICAgICB5OiB5K29mZnNldCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHgrc2l6ZS5mdXNlLncvMiAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgeStvZmZzZXRdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueCtvZmZzZXQgLCBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgICAgICB4OiBsb2MuZGlzY2JveC54K29mZnNldCxcbiAgICAgICAgICAgICAgICB5OiBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGQubGF5ZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZC5sYXllcignRENfZ3JvdW5kJyk7XG4gICAgICAgIC8vZC5saW5lKFtcbiAgICAgICAgLy8gICAgWyBsb2MuYXJyYXkubGVmdCAsIGxvYy5hcnJheS5sb3dlciArIHNpemUubW9kdWxlLncgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICAvLyAgICBbIGxvYy5hcnJheS5yaWdodCtzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCAsIGxvYy5hcnJheS5sb3dlciArIHNpemUubW9kdWxlLncgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICAvLyAgICBbIGxvYy5hcnJheS5yaWdodCtzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCAsIGxvYy5hcnJheS55ICsgc2l6ZS5tb2R1bGUudyArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAgICAgLy8gICAgWyBsb2MuYXJyYXkueCAsIGxvYy5hcnJheS55K3NpemUubW9kdWxlLncrc2l6ZS53aXJlX29mZnNldC5ncm91bmRdLFxuICAgICAgICAvL10pO1xuXG4gICAgICAgIC8vZC5sYXllcigpO1xuXG4gICAgICAgIC8vIEdyb3VuZFxuICAgICAgICAvL29mZnNldCA9IHNpemUud2lyZV9vZmZzZXQuZ2FwICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQ7XG4gICAgICAgIG9mZnNldCA9IHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kO1xuXG4gICAgICAgIGQubGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgWyB4ICwgeStvZmZzZXRdLFxuICAgICAgICAgICAgWyB4ICwgeStvZmZzZXRdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgIHk6IHkrb2Zmc2V0LFxuICAgICAgICB9KTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFsgeCAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueCtvZmZzZXQgLCB5K29mZnNldF0sXG4gICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbV0sXG4gICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICB4OiBsb2MuZGlzY2JveC54K29mZnNldCxcbiAgICAgICAgICAgIHk6IGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW1cbiAgICAgICAgfSk7XG4gICAgICAgIGQubGF5ZXIoKTtcblxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAvLyBEQyBkaXNjb25lY3RcbiAgICAgICAgZC5zZWN0aW9uKFwiREMgZGljb25lY3RcIik7XG5cblxuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbbG9jLmRpc2Nib3gueCwgbG9jLmRpc2Nib3gueV0sXG4gICAgICAgICAgICBbc2l6ZS5kaXNjYm94Lncsc2l6ZS5kaXNjYm94LmhdLFxuICAgICAgICAgICAgJ2JveCdcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBEQyBkaXNjb25lY3QgY29tYmluZXIgZC5saW5lc1xuXG4gICAgICAgIHggPSBsb2MuZGlzY2JveC54O1xuICAgICAgICB5ID0gbG9jLmRpc2Nib3gueSArIHNpemUuZGlzY2JveC5oLzI7XG5cbiAgICAgICAgaWYoIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyA+IDEpe1xuICAgICAgICAgICAgdmFyIG9mZnNldF9taW4gPSBzaXplLndpcmVfb2Zmc2V0Lm1pbjtcbiAgICAgICAgICAgIHZhciBvZmZzZXRfbWF4ID0gc2l6ZS53aXJlX29mZnNldC5taW4gKyAoIChzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgLTEpICogc2l6ZS53aXJlX29mZnNldC5iYXNlICk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeC1vZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICAgICAgWyB4LW9mZnNldF9tYXgsIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIF0sICdEQ19wb3MnKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4K29mZnNldF9taW4sIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgICAgICBbIHgrb2Zmc2V0X21heCwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgXSwgJ0RDX25lZycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW52ZXJ0ZXIgY29uZWN0aW9uXG4gICAgICAgIC8vZC5saW5lKFtcbiAgICAgICAgLy8gICAgWyB4LW9mZnNldF9taW4sIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgLy8gICAgWyB4LW9mZnNldF9taW4sIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgLy9dLCdEQ19wb3MnKTtcblxuICAgICAgICAvL29mZnNldCA9IG9mZnNldF9tYXggLSBvZmZzZXRfbWluO1xuICAgICAgICBvZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0Lm1pbjtcblxuICAgICAgICAvLyBuZWdcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFsgeCtvZmZzZXQsIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIFsgeCtvZmZzZXQsIGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSBdLFxuICAgICAgICBdLCdEQ19uZWcnKTtcbiAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgeDogeCtvZmZzZXQsXG4gICAgICAgICAgICB5OiBsb2MuaW52ZXJ0ZXIueStzaXplLmludmVydGVyLmgvMi1zaXplLnRlcm1pbmFsX2RpYW0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHBvc1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgWyB4LW9mZnNldCwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgWyB4LW9mZnNldCwgbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtIF0sXG4gICAgICAgIF0sJ0RDX3BvcycpO1xuICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICB4OiB4LW9mZnNldCxcbiAgICAgICAgICAgIHk6IGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZ3JvdW5kXG4gICAgICAgIC8vb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5nYXAgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZDtcbiAgICAgICAgb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5ncm91bmQ7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbIHgrb2Zmc2V0LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBbIHgrb2Zmc2V0LCBsb2MuaW52ZXJ0ZXIueStzaXplLmludmVydGVyLmgvMi1zaXplLnRlcm1pbmFsX2RpYW0gXSxcbiAgICAgICAgXSwnRENfZ3JvdW5kJyk7XG4gICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgIHg6IHgrb2Zmc2V0LFxuICAgICAgICAgICAgeTogbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtLFxuICAgICAgICB9KTtcblxuICAgIH1cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8jaW52ZXJ0ZXJcbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ2ludmVydGVyJykgKXtcblxuICAgICAgICBkLnNlY3Rpb24oXCJpbnZlcnRlclwiKTtcblxuXG4gICAgICAgIHggPSBsb2MuaW52ZXJ0ZXIueDtcbiAgICAgICAgeSA9IGxvYy5pbnZlcnRlci55O1xuXG5cbiAgICAgICAgLy9mcmFtZVxuICAgICAgICBkLmxheWVyKCdib3gnKTtcbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW3gseV0sXG4gICAgICAgICAgICBbc2l6ZS5pbnZlcnRlci53LCBzaXplLmludmVydGVyLmhdXG4gICAgICAgICk7XG4gICAgICAgIC8vIExhYmVsIGF0IHRvcCAoSW52ZXJ0ZXIsIG1ha2UsIG1vZGVsLCAuLi4pXG4gICAgICAgIGQubGF5ZXIoJ3RleHQnKTtcbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgW2xvYy5pbnZlcnRlci54LCBsb2MuaW52ZXJ0ZXIudG9wICsgc2l6ZS5pbnZlcnRlci50ZXh0X2dhcCBdLFxuICAgICAgICAgICAgWyAnSW52ZXJ0ZXInLCBzZXR0aW5ncy5zeXN0ZW0uaW52ZXJ0ZXIubWFrZSArIFwiIFwiICsgc2V0dGluZ3Muc3lzdGVtLmludmVydGVyLm1vZGVsIF0sXG4gICAgICAgICAgICAnbGFiZWwnXG4gICAgICAgICk7XG4gICAgICAgIGQubGF5ZXIoKTtcblxuICAgIC8vI2ludmVydGVyIHN5bWJvbFxuICAgICAgICBkLnNlY3Rpb24oXCJpbnZlcnRlciBzeW1ib2xcIik7XG5cbiAgICAgICAgeCA9IGxvYy5pbnZlcnRlci54O1xuICAgICAgICB5ID0gbG9jLmludmVydGVyLnk7XG5cbiAgICAgICAgdyA9IHNpemUuaW52ZXJ0ZXIuc3ltYm9sX3c7XG4gICAgICAgIGggPSBzaXplLmludmVydGVyLnN5bWJvbF9oO1xuXG4gICAgICAgIHZhciBzcGFjZSA9IHcqMS8xMjtcblxuICAgICAgICAvLyBJbnZlcnRlciBzeW1ib2xcbiAgICAgICAgZC5sYXllcignYm94Jyk7XG5cbiAgICAgICAgLy8gYm94XG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFt4LHldLFxuICAgICAgICAgICAgW3csIGhdXG4gICAgICAgICk7XG4gICAgICAgIC8vIGRpYWdhbmFsXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeC13LzIsIHkraC8yXSxcbiAgICAgICAgICAgIFt4K3cvMiwgeS1oLzJdLFxuXG4gICAgICAgIF0pO1xuICAgICAgICAvLyBEQ1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSxcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2VdLFxuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSo2LFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZV0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSxcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlKjIsXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlKjJdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqMyxcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlKjQsXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlKjJdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNSxcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlKjYsXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlKjJdLFxuICAgICAgICBdKTtcblxuICAgICAgICAvLyBBQ1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSxcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqMixcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjMsXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjQsXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSo1LFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSo2LFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5sYXllcigpO1xuXG5cblxuXG5cbiAgICB9XG5cblxuXG5cblxuLy8jQUNfZGlzY2NvbmVjdFxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnQUMnKSApe1xuICAgICAgICBkLnNlY3Rpb24oXCJBQ19kaXNjY29uZWN0XCIpO1xuXG4gICAgICAgIHggPSBsb2MuQUNfZGlzYy54O1xuICAgICAgICB5ID0gbG9jLkFDX2Rpc2MueTtcbiAgICAgICAgcGFkZGluZyA9IHNpemUudGVybWluYWxfZGlhbTtcblxuICAgICAgICBkLmxheWVyKCdib3gnKTtcbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW3gsIHldLFxuICAgICAgICAgICAgW3NpemUuQUNfZGlzYy53LCBzaXplLkFDX2Rpc2MuaF1cbiAgICAgICAgKTtcbiAgICAgICAgZC5sYXllcigpO1xuXG5cbiAgICAvL2QuY2lyYyhbeCx5XSw1KTtcblxuXG5cbiAgICAvLyNBQyBsb2FkIGNlbnRlclxuICAgICAgICBkLnNlY3Rpb24oXCJBQyBsb2FkIGNlbnRlclwiKTtcblxuICAgICAgICB2YXIgYnJlYWtlcl9zcGFjaW5nID0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnNwYWNpbmc7XG5cbiAgICAgICAgeCA9IGxvYy5BQ19sb2FkY2VudGVyLng7XG4gICAgICAgIHkgPSBsb2MuQUNfbG9hZGNlbnRlci55O1xuICAgICAgICB3ID0gc2l6ZS5BQ19sb2FkY2VudGVyLnc7XG4gICAgICAgIGggPSBzaXplLkFDX2xvYWRjZW50ZXIuaDtcblxuICAgICAgICBkLnJlY3QoW3gseV0sXG4gICAgICAgICAgICBbdyxoXSxcbiAgICAgICAgICAgICdib3gnXG4gICAgICAgICk7XG5cbiAgICAgICAgZC50ZXh0KFt4LHktaCowLjRdLFxuICAgICAgICAgICAgW3N5c3RlbS5BQy5sb2FkY2VudGVyX3R5cGVzLCAnTG9hZCBDZW50ZXInXSxcbiAgICAgICAgICAgICdsYWJlbCcsXG4gICAgICAgICAgICAndGV4dCdcbiAgICAgICAgKTtcbiAgICAgICAgdyA9IHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyLnc7XG4gICAgICAgIGggPSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci5oO1xuXG4gICAgICAgIHBhZGRpbmcgPSBsb2MuQUNfbG9hZGNlbnRlci54IC0gbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMubGVmdCAtIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyLnc7XG5cbiAgICAgICAgeSA9IGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnRvcDtcbiAgICAgICAgeSArPSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMuc3BhY2luZy8yO1xuICAgICAgICBmb3IoIHZhciBpPTA7IGk8c2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLm51bTsgaSsrKXtcbiAgICAgICAgICAgIGQucmVjdChbeC1wYWRkaW5nLXcvMix5XSxbdyxoXSwnYm94Jyk7XG4gICAgICAgICAgICBkLnJlY3QoW3grcGFkZGluZyt3LzIseV0sW3csaF0sJ2JveCcpO1xuICAgICAgICAgICAgeSArPSBicmVha2VyX3NwYWNpbmc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcywgbDtcblxuICAgICAgICBsID0gbG9jLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhcjtcbiAgICAgICAgcyA9IHNpemUuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyO1xuICAgICAgICBkLnJlY3QoW2wueCxsLnldLCBbcy53LHMuaF0sICdBQ19uZXV0cmFsJyApO1xuXG4gICAgICAgIGwgPSBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXI7XG4gICAgICAgIHMgPSBzaXplLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyO1xuICAgICAgICBkLnJlY3QoW2wueCxsLnldLCBbcy53LHMuaF0sICdBQ19ncm91bmQnICk7XG5cbiAgICAgICAgZC5ibG9jaygnZ3JvdW5kJywgW2wueCxsLnkrcy5oLzJdKTtcblxuXG5cbiAgICAvLyBBQyBkLmxpbmVzXG4gICAgICAgIGQuc2VjdGlvbihcIkFDIGQubGluZXNcIik7XG5cbiAgICAgICAgeCA9IGxvYy5pbnZlcnRlci5ib3R0b21fcmlnaHQueDtcbiAgICAgICAgeSA9IGxvYy5pbnZlcnRlci5ib3R0b21fcmlnaHQueTtcbiAgICAgICAgeCAtPSBzaXplLnRlcm1pbmFsX2RpYW0gKiAoc3lzdGVtLkFDLm51bV9jb25kdWN0b3JzKzEpO1xuICAgICAgICB5IC09IHNpemUudGVybWluYWxfZGlhbTtcblxuICAgICAgICB2YXIgY29uZHVpdF95ID0gbG9jLkFDX2NvbmR1aXQueTtcbiAgICAgICAgcGFkZGluZyA9IHNpemUudGVybWluYWxfZGlhbTtcbiAgICAgICAgLy92YXIgQUNfZC5sYXllcl9uYW1lcyA9IFsnQUNfZ3JvdW5kJywgJ0FDX25ldXRyYWwnLCAnQUNfTDEnLCAnQUNfTDInLCAnQUNfTDInXTtcblxuICAgICAgICBmb3IoIHZhciBpPTA7IGkgPCBzeXN0ZW0uQUMubnVtX2NvbmR1Y3RvcnM7IGkrKyApe1xuICAgICAgICAgICAgZC5ibG9jaygndGVybWluYWwnLCBbeCx5XSApO1xuICAgICAgICAgICAgZC5sYXllcignQUNfJytzeXN0ZW0uQUMuY29uZHVjdG9yc1tpXSk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFt4LCB5XSxcbiAgICAgICAgICAgICAgICBbeCwgbG9jLkFDX2Rpc2MuYm90dG9tIC0gcGFkZGluZyoyIC0gcGFkZGluZyppICBdLFxuICAgICAgICAgICAgICAgIFtsb2MuQUNfZGlzYy5sZWZ0LCBsb2MuQUNfZGlzYy5ib3R0b20gLSBwYWRkaW5nKjIgLSBwYWRkaW5nKmkgXSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgeCArPSBzaXplLnRlcm1pbmFsX2RpYW07XG4gICAgICAgIH1cbiAgICAgICAgZC5sYXllcigpO1xuXG4gICAgICAgIHggPSBsb2MuQUNfZGlzYy54O1xuICAgICAgICB5ID0gbG9jLkFDX2Rpc2MueSArIHNpemUuQUNfZGlzYy5oLzI7XG4gICAgICAgIHkgLT0gcGFkZGluZyoyO1xuXG4gICAgICAgIGlmKCBzeXN0ZW0uQUMuY29uZHVjdG9ycy5pbmRleE9mKCdncm91bmQnKSsxICkge1xuICAgICAgICAgICAgZC5sYXllcignQUNfZ3JvdW5kJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeC1zaXplLkFDX2Rpc2Mudy8yLCB5IF0sXG4gICAgICAgICAgICAgICAgWyB4K3NpemUuQUNfZGlzYy53LzIrcGFkZGluZyoyLCB5IF0sXG4gICAgICAgICAgICAgICAgWyB4K3NpemUuQUNfZGlzYy53LzIrcGFkZGluZyoyLCBjb25kdWl0X3kgKyBicmVha2VyX3NwYWNpbmcqMiBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIubGVmdCtwYWRkaW5nKjIsIGNvbmR1aXRfeSArIGJyZWFrZXJfc3BhY2luZyoyIF0sXG4gICAgICAgICAgICAgICAgLy9bIGxvYy5BQ19sb2FkY2VudGVyLmxlZnQrcGFkZGluZyoyLCB5IF0sXG4gICAgICAgICAgICAgICAgLy9bIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci54LXBhZGRpbmcsIHkgXSxcbiAgICAgICAgICAgICAgICAvL1sgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLngtcGFkZGluZywgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLnkrc2l6ZS5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci5oLzIgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLmxlZnQrcGFkZGluZyoyLCBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLngtc2l6ZS5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci53LzIsIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci55IF0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCBzeXN0ZW0uQUMuY29uZHVjdG9ycy5pbmRleE9mKCduZXV0cmFsJykrMSApIHtcbiAgICAgICAgICAgIHkgLT0gcGFkZGluZztcbiAgICAgICAgICAgIGQubGF5ZXIoJ0FDX25ldXRyYWwnKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4LXNpemUuQUNfZGlzYy53LzIsIHkgXSxcbiAgICAgICAgICAgICAgICBbIHgrcGFkZGluZyozKjIsIHkgXSxcbiAgICAgICAgICAgICAgICBbIHgrcGFkZGluZyozKjIsIGNvbmR1aXRfeSArIGJyZWFrZXJfc3BhY2luZyoxIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyLngsIGNvbmR1aXRfeSArIGJyZWFrZXJfc3BhY2luZyoxIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyLngsXG4gICAgICAgICAgICAgICAgICAgIGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIueS1zaXplLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhci5oLzIgXSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9XG5cblxuXG4gICAgICAgIGZvciggdmFyIGk9MTsgaSA8PSAzOyBpKysgKSB7XG4gICAgICAgICAgICBpZiggc3lzdGVtLkFDLmNvbmR1Y3RvcnMuaW5kZXhPZignTCcraSkrMSApIHtcbiAgICAgICAgICAgICAgICB5IC09IHBhZGRpbmc7XG4gICAgICAgICAgICAgICAgZC5sYXllcignQUNfTCcraSk7XG4gICAgICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgWyB4LXNpemUuQUNfZGlzYy53LzIsIHkgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB4K3BhZGRpbmcqMyooMi1pKSwgeSBdLFxuICAgICAgICAgICAgICAgICAgICBbIHgrcGFkZGluZyozKigyLWkpLCBsb2MuQUNfZGlzYy5zd2l0Y2hfYm90dG9tIF0sXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgZC5ibG9jaygndGVybWluYWwnLCBbIHgtcGFkZGluZyooaS0yKSozLCBsb2MuQUNfZGlzYy5zd2l0Y2hfYm90dG9tIF0gKTtcbiAgICAgICAgICAgICAgICBkLmJsb2NrKCd0ZXJtaW5hbCcsIFsgeC1wYWRkaW5nKihpLTIpKjMsIGxvYy5BQ19kaXNjLnN3aXRjaF90b3AgXSApO1xuICAgICAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFsgeC1wYWRkaW5nKihpLTIpKjMsIGxvYy5BQ19kaXNjLnN3aXRjaF90b3AgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB4LXBhZGRpbmcqKGktMikqMywgY29uZHVpdF95LWJyZWFrZXJfc3BhY2luZyooaS0xKSBdLFxuICAgICAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLmxlZnQsIGNvbmR1aXRfeS1icmVha2VyX3NwYWNpbmcqKGktMSkgXSxcbiAgICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cblxuXG5cbi8vIFdpcmUgdGFibGVcbiAgICBkLnNlY3Rpb24oXCJXaXJlIHRhYmxlXCIpO1xuXG4vLy8qXG5cbiAgICB4ID0gbG9jLndpcmVfdGFibGUueDtcbiAgICB5ID0gbG9jLndpcmVfdGFibGUueTtcblxuICAgIGlmKCBzeXN0ZW0uQUMubnVtX2NvbmR1Y3RvcnMgKSB7XG4gICAgICAgIHZhciBuX3Jvd3MgPSAyICsgc3lzdGVtLkFDLm51bV9jb25kdWN0b3JzO1xuICAgICAgICB2YXIgbl9jb2xzID0gNjtcbiAgICAgICAgdmFyIHJvd19oZWlnaHQgPSAxNTtcbiAgICAgICAgdmFyIGNvbHVtbl93aWR0aCA9IHtcbiAgICAgICAgICAgIG51bWJlcjogMjUsXG4gICAgICAgICAgICBjb25kdWN0b3I6IDUwLFxuICAgICAgICAgICAgd2lyZV9nYXVnZTogMjUsXG4gICAgICAgICAgICB3aXJlX3R5cGU6IDc1LFxuICAgICAgICAgICAgY29uZHVpdF9zaXplOiAzNSxcbiAgICAgICAgICAgIGNvbmR1aXRfdHlwZTogNzUsXG4gICAgICAgIH07XG5cbiAgICAgICAgaCA9IG5fcm93cypyb3dfaGVpZ2h0O1xuXG4gICAgICAgIHZhciB0ID0gZC50YWJsZShuX3Jvd3Msbl9jb2xzKS5sb2MoeCx5KTtcbiAgICAgICAgdC5yb3dfc2l6ZSgnYWxsJywgcm93X2hlaWdodClcbiAgICAgICAgICAgIC5jb2xfc2l6ZSgxLCBjb2x1bW5fd2lkdGgubnVtYmVyKVxuICAgICAgICAgICAgLmNvbF9zaXplKDIsIGNvbHVtbl93aWR0aC5jb25kdWN0b3IpXG4gICAgICAgICAgICAuY29sX3NpemUoMywgY29sdW1uX3dpZHRoLndpcmVfZ2F1Z2UpXG4gICAgICAgICAgICAuY29sX3NpemUoNCwgY29sdW1uX3dpZHRoLndpcmVfdHlwZSlcbiAgICAgICAgICAgIC5jb2xfc2l6ZSg1LCBjb2x1bW5fd2lkdGguY29uZHVpdF9zaXplKVxuICAgICAgICAgICAgLmNvbF9zaXplKDYsIGNvbHVtbl93aWR0aC5jb25kdWl0X3R5cGUpO1xuXG4gICAgICAgIHQuYWxsX2NlbGxzKCkuZm9yRWFjaChmdW5jdGlvbihjZWxsKXtcbiAgICAgICAgICAgIGNlbGwuZm9udCgndGFibGUnKS5ib3JkZXIoJ2FsbCcpO1xuICAgICAgICB9KTtcbiAgICAgICAgdC5jZWxsKDEsMSkuYm9yZGVyKCdCJywgZmFsc2UpO1xuICAgICAgICB0LmNlbGwoMSwzKS5ib3JkZXIoJ1InLCBmYWxzZSk7XG4gICAgICAgIHQuY2VsbCgxLDUpLmJvcmRlcignUicsIGZhbHNlKTtcblxuICAgICAgICB0LmNlbGwoMSwzKS5mb250KCd0YWJsZV9sZWZ0JykudGV4dCgnV2lyZScpO1xuICAgICAgICB0LmNlbGwoMSw1KS5mb250KCd0YWJsZV9sZWZ0JykudGV4dCgnQ29uZHVpdCcpO1xuXG4gICAgICAgIHQuY2VsbCgyLDMpLmZvbnQoJ3RhYmxlJykudGV4dCgnQ29uZHVjdG9ycycpO1xuICAgICAgICB0LmNlbGwoMiwzKS5mb250KCd0YWJsZScpLnRleHQoJ0FXRycpO1xuICAgICAgICB0LmNlbGwoMiw0KS5mb250KCd0YWJsZScpLnRleHQoJ1R5cGUnKTtcbiAgICAgICAgdC5jZWxsKDIsNSkuZm9udCgndGFibGUnKS50ZXh0KCdTaXplJyk7XG4gICAgICAgIHQuY2VsbCgyLDYpLmZvbnQoJ3RhYmxlJykudGV4dCgnVHlwZScpO1xuXG4gICAgICAgIGZvciggaT0xOyBpPD1zeXN0ZW0uQUMubnVtX2NvbmR1Y3RvcnM7IGkrKyl7XG4gICAgICAgICAgICB0LmNlbGwoMitpLDEpLmZvbnQoJ3RhYmxlJykudGV4dChpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgdC5jZWxsKDIraSwyKS5mb250KCd0YWJsZV9sZWZ0JykudGV4dCggZi5wcmV0dHlfd29yZChzZXR0aW5ncy5zeXN0ZW0uQUMuY29uZHVjdG9yc1tpLTFdKSApO1xuXG4gICAgICAgIH1cblxuXG4gICAgICAgIC8vZC50ZXh0KCBbeCt3LzIsIHktcm93X2hlaWdodF0sIGYucHJldHR5X25hbWUoc2VjdGlvbl9uYW1lKSwndGFibGUnICk7XG5cblxuICAgICAgICB0Lm1rKCk7XG5cbiAgICB9XG5cbi8vKi9cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbi8vIHZvbHRhZ2UgZHJvcFxuICAgIGQuc2VjdGlvbihcInZvbHRhZ2UgZHJvcFwiKTtcblxuXG4gICAgeCA9IGxvYy52b2x0X2Ryb3BfdGFibGUueDtcbiAgICB5ID0gbG9jLnZvbHRfZHJvcF90YWJsZS55O1xuICAgIHcgPSBzaXplLnZvbHRfZHJvcF90YWJsZS53O1xuICAgIGggPSBzaXplLnZvbHRfZHJvcF90YWJsZS5oO1xuXG4gICAgZC5sYXllcigndGFibGUnKTtcbiAgICBkLnJlY3QoIFt4LHldLCBbdyxoXSApO1xuXG4gICAgeSAtPSBoLzI7XG4gICAgeSArPSAxMDtcblxuICAgIGQudGV4dCggW3gseV0sICdWb2x0YWdlIERyb3AnLCAndGFibGUnLCAndGV4dCcpO1xuXG5cbi8vIGdlbmVyYWwgbm90ZXNcbiAgICBkLnNlY3Rpb24oXCJnZW5lcmFsIG5vdGVzXCIpO1xuXG4gICAgeCA9IGxvYy5nZW5lcmFsX25vdGVzLng7XG4gICAgeSA9IGxvYy5nZW5lcmFsX25vdGVzLnk7XG4gICAgdyA9IHNpemUuZ2VuZXJhbF9ub3Rlcy53O1xuICAgIGggPSBzaXplLmdlbmVyYWxfbm90ZXMuaDtcblxuICAgIGQubGF5ZXIoJ3RhYmxlJyk7XG4gICAgZC5yZWN0KCBbeCx5XSwgW3csaF0gKTtcblxuICAgIHkgLT0gaC8yO1xuICAgIHkgKz0gMTA7XG5cbiAgICBkLnRleHQoIFt4LHldLCAnR2VuZXJhbCBOb3RlcycsICd0YWJsZScsICd0ZXh0Jyk7XG5cblxuICAgIGQuc2VjdGlvbigpO1xuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xudmFyIG1rX2JvcmRlciA9IHJlcXVpcmUoJy4vbWtfYm9yZGVyJyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHBhZ2UgM1wiKTtcbiAgICB2YXIgZiA9IHNldHRpbmdzLmY7XG5cbiAgICBkID0gbWtfZHJhd2luZygpO1xuXG4gICAgdmFyIHNoZWV0X3NlY3Rpb24gPSAnUFYnO1xuICAgIHZhciBzaGVldF9udW0gPSAnMDInO1xuICAgIGQuYXBwZW5kKG1rX2JvcmRlcihzZXR0aW5ncywgc2hlZXRfc2VjdGlvbiwgc2hlZXRfbnVtICkpO1xuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuXG5cbiAgICBkLnRleHQoXG4gICAgICAgIFtzaXplLmRyYXdpbmcudy8yLCBzaXplLmRyYXdpbmcuaC8yXSxcbiAgICAgICAgJ0NhbGN1bGF0aW9uIFNoZWV0JyxcbiAgICAgICAgJ3RpdGxlMidcbiAgICApO1xuXG5cbiAgICB4ID0gc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmcqNjtcbiAgICB5ID0gc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmcqNiArMjA7XG5cbiAgICBkLmxheWVyKCd0YWJsZScpO1xuXG5cbiAgICBmb3IoIHZhciBzZWN0aW9uX25hbWUgaW4gc2V0dGluZ3Muc3lzdGVtICl7XG4gICAgICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZChzZWN0aW9uX25hbWUpICl7XG4gICAgICAgICAgICB2YXIgc2VjdGlvbiA9IHNldHRpbmdzLnN5c3RlbVtzZWN0aW9uX25hbWVdO1xuXG4gICAgICAgICAgICB2YXIgbiA9IE9iamVjdC5rZXlzKHNlY3Rpb24pLmxlbmd0aDtcblxuICAgICAgICAgICAgdmFyIG5fcm93cyA9IG4rMDtcbiAgICAgICAgICAgIHZhciBuX2NvbHMgPSAyO1xuXG4gICAgICAgICAgICB2YXIgcm93X2hlaWdodCA9IDE1O1xuICAgICAgICAgICAgaCA9IG5fcm93cypyb3dfaGVpZ2h0O1xuXG5cbiAgICAgICAgICAgIHZhciB0ID0gZC50YWJsZShuX3Jvd3Msbl9jb2xzKS5sb2MoeCx5KTtcbiAgICAgICAgICAgIHQucm93X3NpemUoJ2FsbCcsIHJvd19oZWlnaHQpLmNvbF9zaXplKDEsIDEwMCkuY29sX3NpemUoMiwgMTI1KTtcbiAgICAgICAgICAgIHcgPSAxMDArODA7XG5cbiAgICAgICAgICAgIHZhciByID0gMTtcbiAgICAgICAgICAgIHZhciB2YWx1ZTtcbiAgICAgICAgICAgIGZvciggdmFyIHZhbHVlX25hbWUgaW4gc2VjdGlvbiApe1xuICAgICAgICAgICAgICAgIHQuY2VsbChyLDEpLnRleHQoIGYucHJldHR5X25hbWUodmFsdWVfbmFtZSkgKTtcbiAgICAgICAgICAgICAgICBpZiggISBzZWN0aW9uW3ZhbHVlX25hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gJy0nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiggc2VjdGlvblt2YWx1ZV9uYW1lXS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkgKXtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBzZWN0aW9uW3ZhbHVlX25hbWVdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKCBzZWN0aW9uW3ZhbHVlX25hbWVdLmNvbnN0cnVjdG9yID09PSBPYmplY3QgKXtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSAnKCApJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoIGlzTmFOKHNlY3Rpb25bdmFsdWVfbmFtZV0pICl7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gc2VjdGlvblt2YWx1ZV9uYW1lXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQoc2VjdGlvblt2YWx1ZV9uYW1lXSkudG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdC5jZWxsKHIsMikudGV4dCggdmFsdWUgKTtcbiAgICAgICAgICAgICAgICByKys7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZC50ZXh0KCBbeCt3LzIsIHktcm93X2hlaWdodF0sIGYucHJldHR5X25hbWUoc2VjdGlvbl9uYW1lKSwndGFibGUnICk7XG5cblxuXG5cbiAgICAgICAgICAgIHQuYWxsX2NlbGxzKCkuZm9yRWFjaChmdW5jdGlvbihjZWxsKXtcbiAgICAgICAgICAgICAgICBjZWxsLmZvbnQoJ3RhYmxlJykuYm9yZGVyKCdhbGwnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0Lm1rKCk7XG5cbiAgICAgICAgICAgIC8vKi9cbiAgICAgICAgICAgIHkgKz0gaCArIDMwO1xuXG4gICAgICAgICAgICBpZiggeSA+ICggZy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy5oICogMC44ICkgKSB7XG4gICAgICAgICAgICAgICAgeSA9XG4gICAgICAgICAgICAgICAgICAgIHkgPSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyo2ICsyMDtcbiAgICAgICAgICAgICAgICAgICAgeCArPSB3KjEuNTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdub3QgZGVmaW5lZDogJywgc2VjdGlvbl9uYW1lLCBzZWN0aW9uKTtcbiAgICAgICAgfVxuXG5cblxuXG4gICAgfVxuXG4gICAgZC5sYXllcigpO1xuXG5cbiAgICByZXR1cm4gZC5kcmF3aW5nX3BhcnRzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcGFnZTtcbiIsInZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG52YXIgbWtfYm9yZGVyID0gcmVxdWlyZSgnLi9ta19ib3JkZXInKTtcblxudmFyIHBhZ2UgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgY29uc29sZS5sb2coXCIqKiBNYWtpbmcgcGFnZSAzXCIpO1xuICAgIHZhciBmID0gc2V0dGluZ3MuZjtcblxuICAgIGQgPSBta19kcmF3aW5nKCk7XG5cbiAgICB2YXIgc2hlZXRfc2VjdGlvbiA9ICdTJztcbiAgICB2YXIgc2hlZXRfbnVtID0gJzAxJztcbiAgICBkLmFwcGVuZChta19ib3JkZXIoc2V0dGluZ3MsIHNoZWV0X3NlY3Rpb24sIHNoZWV0X251bSApKTtcblxuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxvYztcbiAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgncm9vZicpICl7XG5cblxuXG4gICAgICAgIHZhciB4LCB5LCBoLCB3LCBzZWN0aW9uX3gsIHNlY3Rpb25feSwgbGVuZ3RoX3AsIHNjYWxlO1xuXG4gICAgICAgIHZhciBzbG9wZSA9IHN5c3RlbS5yb29mLnNsb3BlLnNwbGl0KCc6JylbMF07XG4gICAgICAgIHZhciBhbmdsZV9yYWQgPSBNYXRoLmF0YW4oIE51bWJlcihzbG9wZSkgLzEyICk7XG4gICAgICAgIC8vYW5nbGVfcmFkID0gYW5nbGUgKiAoTWF0aC5QSS8xODApO1xuXG5cbiAgICAgICAgbGVuZ3RoX3AgPSBzeXN0ZW0ucm9vZi5sZW5ndGggKiBNYXRoLmNvcyhhbmdsZV9yYWQpO1xuICAgICAgICBzeXN0ZW0ucm9vZi5oZWlnaHQgPSBzeXN0ZW0ucm9vZi5sZW5ndGggKiBNYXRoLnNpbihhbmdsZV9yYWQpO1xuXG4gICAgICAgIHZhciByb29mX3JhdGlvID0gc3lzdGVtLnJvb2YubGVuZ3RoIC8gc3lzdGVtLnJvb2Yud2lkdGg7XG4gICAgICAgIHZhciByb29mX3BsYW5fcmF0aW8gPSBsZW5ndGhfcCAvIHN5c3RlbS5yb29mLndpZHRoO1xuXG5cbiAgICAgICAgaWYoIHN5c3RlbS5yb29mLnR5cGUgPT09IFwiR2FibGVcIil7XG5cblxuICAgICAgICAgICAgLy8vLy8vL1xuICAgICAgICAgICAgLy8gUm9vZCBwbGFuIHZpZXdcbiAgICAgICAgICAgIHZhciBwbGFuX3ggPSA2MDtcbiAgICAgICAgICAgIHZhciBwbGFuX3kgPSA2MDtcblxuICAgICAgICAgICAgdmFyIHBsYW5fdywgcGxhbl9oO1xuICAgICAgICAgICAgaWYoIGxlbmd0aF9wKjIgPiBzeXN0ZW0ucm9vZi53aWR0aCApe1xuICAgICAgICAgICAgICAgIHNjYWxlID0gMjAwLyhsZW5ndGhfcCoyKTtcbiAgICAgICAgICAgICAgICBwbGFuX3cgPSAobGVuZ3RoX3AqMikgKiBzY2FsZTtcbiAgICAgICAgICAgICAgICBwbGFuX2ggPSBwbGFuX3cgLyAobGVuZ3RoX3AqMiAvIHN5c3RlbS5yb29mLndpZHRoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2NhbGUgPSAzMDAvKHN5c3RlbS5yb29mLndpZHRoKTtcbiAgICAgICAgICAgICAgICBwbGFuX2ggPSBzeXN0ZW0ucm9vZi53aWR0aCAqIHNjYWxlO1xuICAgICAgICAgICAgICAgIHBsYW5fdyA9IHBsYW5faCAqIChsZW5ndGhfcCoyIC8gc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95K3BsYW5faC8yXSxcbiAgICAgICAgICAgICAgICBbcGxhbl93LCBwbGFuX2hdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsXCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGQucG9seShbXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3ggICAgICAgLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3krcGxhbl9oXSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCwgICAgICAgIHBsYW5feStwbGFuX2hdLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94ICAgICAgICwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX3BvbHlfdW5zZWxlY3RlZFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5wb2x5KFtcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiAgICAgICAsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIrcGxhbl93LzIsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIrcGxhbl93LzIsIHBsYW5feStwbGFuX2hdLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCAgICAgICAgcGxhbl95K3BsYW5faF0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIgICAgICAgLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfcG9seV9zZWxlY3RlZFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3krcGxhbl9oXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW3BsYW5feC0yMCwgcGxhbl95K3BsYW5faC8yXSxcbiAgICAgICAgICAgICAgICBzeXN0ZW0ucm9vZi5sZW5ndGgudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdysyMCwgcGxhbl95K3BsYW5faC8yXSxcbiAgICAgICAgICAgICAgICBzeXN0ZW0ucm9vZi53aWR0aC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG5cbiAgICAgICAgICAgIHggPSBwbGFuX3ggKyAxMjA7XG4gICAgICAgICAgICB5ID0gcGxhbl95IC0gMjA7XG5cbiAgICAgICAgICAgIGQuYmxvY2soJ25vcnRoIGFycm93X2xlZnQnLCBbeCx5XSk7XG5cblxuICAgICAgICAgICAgLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIHJvb2YgY3Jvc3NlY3Rpb25cblxuICAgICAgICAgICAgdmFyIGNzX3ggPSBwbGFuX3g7XG4gICAgICAgICAgICB2YXIgY3NfeSA9IHBsYW5feSArIHBsYW5faCArIDUwO1xuICAgICAgICAgICAgdmFyIGNzX2ggPSBzeXN0ZW0ucm9vZi5oZWlnaHQgKiBzY2FsZTtcbiAgICAgICAgICAgIHZhciBjc193ID0gcGxhbl93LzI7XG5cbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3csICAgY3NfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3csICAgY3NfeStjc19oXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2NzX3grY3NfdywgICBjc195XSxcbiAgICAgICAgICAgICAgICAgICAgW2NzX3grY3NfdyoyLCBjc195K2NzX2hdLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCwgICAgICAgIGNzX3krY3NfaF0sXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3csICAgY3NfeV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtjc194K2NzX3ctMTUsIGNzX3krY3NfaCoyLzNdLFxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHN5c3RlbS5yb29mLmhlaWdodCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtjc194K2NzX3cqMS41KzIwLCBjc195K2NzX2gvM10sXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggc3lzdGVtLnJvb2YubGVuZ3RoICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG5cblxuXG4gICAgICAgICAgICAvLy8vLy9cbiAgICAgICAgICAgIC8vIHJvb2YgZGV0YWlsXG5cbiAgICAgICAgICAgIHZhciBkZXRhaWxfeCA9IDMwKzQwMDtcbiAgICAgICAgICAgIHZhciBkZXRhaWxfeSA9IDMwO1xuXG4gICAgICAgICAgICBpZiggTnVtYmVyKHN5c3RlbS5yb29mLndpZHRoKSA+PSBOdW1iZXIoc3lzdGVtLnJvb2YubGVuZ3RoKSApe1xuICAgICAgICAgICAgICAgIHNjYWxlID0gMzUwLyhzeXN0ZW0ucm9vZi53aWR0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNjYWxlID0gMzUwLyhzeXN0ZW0ucm9vZi5sZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGRldGFpbF93ID0gc3lzdGVtLnJvb2Yud2lkdGggKiBzY2FsZTtcbiAgICAgICAgICAgIHZhciBkZXRhaWxfaCA9IHN5c3RlbS5yb29mLmxlbmd0aCAqIHNjYWxlO1xuXG4gICAgICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LzIsIGRldGFpbF95K2RldGFpbF9oLzJdLFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfdywgZGV0YWlsX2hdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX3BvbHlfc2VsZWN0ZWRfZnJhbWVkXCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHZhciBhID0gMztcbiAgICAgICAgICAgIHZhciBvZmZzZXRfYSA9IGEgKiBzY2FsZTtcblxuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94LCAgIGRldGFpbF95K29mZnNldF9hXSxcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LCAgIGRldGFpbF95K29mZnNldF9hXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94LCAgICAgICAgICBkZXRhaWxfeStkZXRhaWxfaC1vZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdywgZGV0YWlsX3krZGV0YWlsX2gtb2Zmc2V0X2FdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grb2Zmc2V0X2EsIGRldGFpbF95XSxcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K29mZnNldF9hLCBkZXRhaWxfeStkZXRhaWxfaF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy1vZmZzZXRfYSwgZGV0YWlsX3ldLFxuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3ctb2Zmc2V0X2EsIGRldGFpbF95K2RldGFpbF9oXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94LTQwLCBkZXRhaWxfeStkZXRhaWxfaC8yXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi5sZW5ndGggKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3cvMiwgZGV0YWlsX3krZGV0YWlsX2grNDBdLFxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHN5c3RlbS5yb29mLndpZHRoICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3grIChvZmZzZXRfYSkvMiwgZGV0YWlsX3krZGV0YWlsX2grMTVdLFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3ctKG9mZnNldF9hKS8yLCBkZXRhaWxfeStkZXRhaWxfaCsxNV0sXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeC0xNSwgZGV0YWlsX3krZGV0YWlsX2gtKG9mZnNldF9hKS8yXSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94LTE1LCBkZXRhaWxfeSsob2Zmc2V0X2EpLzJdLFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgeCA9IGRldGFpbF94ICsgZGV0YWlsX3cgKyAyNTtcbiAgICAgICAgICAgIHkgPSBkZXRhaWxfeSArIDEyMDtcblxuICAgICAgICAgICAgZC5ibG9jaygnbm9ydGggYXJyb3dfdXAnLCBbeCx5XSk7XG5cblxuXG4gICAgICAgICAgICAvLy8vLy9cbiAgICAgICAgICAgIC8vIE1vZHVsZSBvcHRpb25zXG4gICAgICAgICAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ21vZHVsZScpICYmIGYuc2VjdGlvbl9kZWZpbmVkKCdhcnJheScpKXtcbiAgICAgICAgICAgICAgICB2YXIgcixjO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJvb2ZfbGVuZ3RoX2F2YWlsID0gc3lzdGVtLnJvb2YubGVuZ3RoIC0gKGEqMik7XG4gICAgICAgICAgICAgICAgdmFyIHJvb2Zfd2lkdGhfYXZhaWwgPSBzeXN0ZW0ucm9vZi53aWR0aCAtIChhKjIpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJvd19zcGFjaW5nO1xuICAgICAgICAgICAgICAgIGlmKCBzeXN0ZW0ubW9kdWxlLm9yaWVudGF0aW9uID09PSAnUG9ydHJhaXQnICl7XG4gICAgICAgICAgICAgICAgICAgIHJvd19zcGFjaW5nID0gTnVtYmVyKHN5c3RlbS5tb2R1bGUubGVuZ3RoKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIGNvbF9zcGFjaW5nID0gTnVtYmVyKHN5c3RlbS5tb2R1bGUud2lkdGgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlX3cgPSAoTnVtYmVyKHN5c3RlbS5tb2R1bGUud2lkdGgpICApLzEyO1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVfaCA9IChOdW1iZXIoc3lzdGVtLm1vZHVsZS5sZW5ndGgpICkvMTI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcm93X3NwYWNpbmcgPSBOdW1iZXIoc3lzdGVtLm1vZHVsZS53aWR0aCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBjb2xfc3BhY2luZyA9IE51bWJlcihzeXN0ZW0ubW9kdWxlLmxlbmd0aCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVfdyA9IChOdW1iZXIoc3lzdGVtLm1vZHVsZS5sZW5ndGgpKS8xMjtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlX2ggPSAoTnVtYmVyKHN5c3RlbS5tb2R1bGUud2lkdGgpICkvMTI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcm93X3NwYWNpbmcgPSByb3dfc3BhY2luZy8xMjsgLy9tb2R1bGUgZGltZW50aW9ucyBhcmUgaW4gaW5jaGVzXG4gICAgICAgICAgICAgICAgY29sX3NwYWNpbmcgPSBjb2xfc3BhY2luZy8xMjsgLy9tb2R1bGUgZGltZW50aW9ucyBhcmUgaW4gaW5jaGVzXG5cbiAgICAgICAgICAgICAgICB2YXIgbnVtX3Jvd3MgPSBNYXRoLmZsb29yKHJvb2ZfbGVuZ3RoX2F2YWlsL3Jvd19zcGFjaW5nKTtcbiAgICAgICAgICAgICAgICB2YXIgbnVtX2NvbHMgPSBNYXRoLmZsb29yKHJvb2Zfd2lkdGhfYXZhaWwvY29sX3NwYWNpbmcpO1xuXG4gICAgICAgICAgICAgICAgLy9zZWxlY3RlZCBtb2R1bGVzXG5cbiAgICAgICAgICAgICAgICBpZiggbnVtX2NvbHMgIT09IGcudGVtcC5udW1fY29scyB8fCBudW1fcm93cyAhPT0gZy50ZW1wLm51bV9yb3dzICl7XG4gICAgICAgICAgICAgICAgICAgIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzID0ge307XG4gICAgICAgICAgICAgICAgICAgIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzX3RvdGFsID0gMDtcblxuICAgICAgICAgICAgICAgICAgICBmb3IoIHI9MTsgcjw9bnVtX3Jvd3M7IHIrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKCBjPTE7IGM8PW51bV9jb2xzOyBjKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzW3JdW2NdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgICAgIGcudGVtcC5udW1fY29scyA9IG51bV9jb2xzO1xuICAgICAgICAgICAgICAgICAgICBnLnRlbXAubnVtX3Jvd3MgPSBudW1fcm93cztcbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIHggPSBkZXRhaWxfeCArIG9mZnNldF9hOyAvL2Nvcm5lciBvZiB1c2FibGUgc3BhY2VcbiAgICAgICAgICAgICAgICB5ID0gZGV0YWlsX3kgKyBvZmZzZXRfYTtcbiAgICAgICAgICAgICAgICB4ICs9ICggcm9vZl93aWR0aF9hdmFpbCAtIChjb2xfc3BhY2luZypudW1fY29scykpLzIgKnNjYWxlOyAvLyBjZW50ZXIgYXJyYXkgb24gcm9vZlxuICAgICAgICAgICAgICAgIHkgKz0gKCByb29mX2xlbmd0aF9hdmFpbCAtIChyb3dfc3BhY2luZypudW1fcm93cykpLzIgKnNjYWxlO1xuICAgICAgICAgICAgICAgIG1vZHVsZV93ID0gbW9kdWxlX3cgKiBzY2FsZTtcbiAgICAgICAgICAgICAgICBtb2R1bGVfaCA9IG1vZHVsZV9oICogc2NhbGU7XG5cblxuXG4gICAgICAgICAgICAgICAgZm9yKCByPTE7IHI8PW51bV9yb3dzOyByKyspe1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciggYz0xOyBjPD1udW1fY29sczsgYysrKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxheWVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzW3JdW2NdICkgbGF5ZXIgPSAncHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGxheWVyID0gJ3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlX3ggPSAoYy0xKSAqIGNvbF9zcGFjaW5nICogc2NhbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVfeSA9IChyLTEpICogcm93X3NwYWNpbmcgKiBzY2FsZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFt4K21vZHVsZV94K21vZHVsZV93LzIsIHkrbW9kdWxlX3krbW9kdWxlX2gvMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW21vZHVsZV93LCBtb2R1bGVfaF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrOiBcImcuZi50b2dnbGVfbW9kdWxlKHRoaXMpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZV9JRDogIChyKSArICcsJyArIChjKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3cvMiwgZGV0YWlsX3krZGV0YWlsX2grMTAwXSxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJTZWxlY3RlZCBtb2R1bGVzOiBcIiArIHBhcnNlRmxvYXQoIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzX3RvdGFsICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNhbGN1bGF0ZWQgbW9kdWxlczogXCIgKyBwYXJzZUZsb2F0KCBnLnN5c3RlbS5hcnJheS5udW1iZXJfb2ZfbW9kdWxlcyApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIH1cblxuXG5cblxuICAgICAgICB9XG4gICAgfVxuXG5cblxuXG5cblxuICAgIHJldHVybiBkLmRyYXdpbmdfcGFydHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuIiwidmFyIG1rX2RyYXdpbmcgPSByZXF1aXJlKCcuL21rX2RyYXdpbmcnKTtcbnZhciBta19ib3JkZXIgPSByZXF1aXJlKCcuL21rX2JvcmRlcicpO1xudmFyIGYgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucycpO1xuXG52YXIgcGFnZSA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICBjb25zb2xlLmxvZyhcIioqIE1ha2luZyBwcmV2aWV3IDFcIik7XG5cbiAgICB2YXIgZCA9IG1rX2RyYXdpbmcoKTtcblxuXG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG4gICAgdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcblxuICAgIHZhciB4LCB5LCBoLCB3LCBzZWN0aW9uX3gsIHNlY3Rpb25feTtcblxuICAgIHcgPSBzaXplLnByZXZpZXcubW9kdWxlLnc7XG4gICAgaCA9IHNpemUucHJldmlldy5tb2R1bGUuaDtcbiAgICBsb2MucHJldmlldy5hcnJheS5ib3R0b20gPSBsb2MucHJldmlldy5hcnJheS50b3AgKyBoKjEuMjUqc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZyArIGgqMy80O1xuICAgIC8vbG9jLnByZXZpZXcuYXJyYXkucmlnaHQgPSBsb2MucHJldmlldy5hcnJheS5sZWZ0ICsgdyoxLjI1KnN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyArIHcqMjtcbiAgICBsb2MucHJldmlldy5hcnJheS5yaWdodCA9IGxvYy5wcmV2aWV3LmFycmF5LmxlZnQgKyB3KjEuMjUqOCArIHcqMjtcblxuICAgIGxvYy5wcmV2aWV3LmludmVydGVyLmNlbnRlciA9IDUwMCA7XG4gICAgdyA9IHNpemUucHJldmlldy5pbnZlcnRlci53O1xuICAgIGxvYy5wcmV2aWV3LmludmVydGVyLmxlZnQgPSBsb2MucHJldmlldy5pbnZlcnRlci5jZW50ZXIgLSB3LzI7XG4gICAgbG9jLnByZXZpZXcuaW52ZXJ0ZXIucmlnaHQgPSBsb2MucHJldmlldy5pbnZlcnRlci5jZW50ZXIgKyB3LzI7XG5cbiAgICBsb2MucHJldmlldy5EQy5sZWZ0ID0gbG9jLnByZXZpZXcuYXJyYXkucmlnaHQ7XG4gICAgbG9jLnByZXZpZXcuREMucmlnaHQgPSBsb2MucHJldmlldy5pbnZlcnRlci5sZWZ0O1xuICAgIGxvYy5wcmV2aWV3LkRDLmNlbnRlciA9ICggbG9jLnByZXZpZXcuREMucmlnaHQgKyBsb2MucHJldmlldy5EQy5sZWZ0ICkvMjtcblxuICAgIGxvYy5wcmV2aWV3LkFDLmxlZnQgPSBsb2MucHJldmlldy5pbnZlcnRlci5yaWdodDtcbiAgICBsb2MucHJldmlldy5BQy5yaWdodCA9IGxvYy5wcmV2aWV3LkFDLmxlZnQgKyAzMDA7XG4gICAgbG9jLnByZXZpZXcuQUMuY2VudGVyID0gKCBsb2MucHJldmlldy5BQy5yaWdodCArIGxvYy5wcmV2aWV3LkFDLmxlZnQgKS8yO1xuXG5cbi8vIFRPRE8gZml4OiBzZWN0aW9ucyBtdXN0IGJlIGRlZmluZWQgaW4gb3JkZXIsIG9yIHRoZXJlIGFyZSBhcmVhc1xuXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdhcnJheScpICYmIGYuc2VjdGlvbl9kZWZpbmVkKCdtb2R1bGUnKSApe1xuICAgICAgICBkLmxheWVyKCdwcmV2aWV3X2FycmF5Jyk7XG5cbiAgICAgICAgdyA9IHNpemUucHJldmlldy5tb2R1bGUudztcbiAgICAgICAgaCA9IHNpemUucHJldmlldy5tb2R1bGUuaDtcbiAgICAgICAgdmFyIG9mZnNldCA9IDQwO1xuXG4gICAgICAgIGZvciggdmFyIHM9MDsgczxzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3M7IHMrKyApe1xuICAgICAgICAgICAgeCA9IGxvYy5wcmV2aWV3LmFycmF5LmxlZnQgKyB3KjEuMjUqcztcbiAgICAgICAgICAgIC8vIHN0cmluZyB3aXJpbmdcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFsgeCAsIGxvYy5wcmV2aWV3LmFycmF5LnRvcCBdLFxuICAgICAgICAgICAgICAgICAgICBbIHggLCBsb2MucHJldmlldy5hcnJheS5ib3R0b20gXSxcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgLy8gbW9kdWxlc1xuICAgICAgICAgICAgZm9yKCB2YXIgbT0wOyBtPHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmc7IG0rKyApe1xuICAgICAgICAgICAgICAgIHkgPSBsb2MucHJldmlldy5hcnJheS50b3AgKyBoICsgaCoxLjI1Km07XG4gICAgICAgICAgICAgICAgLy8gbW9kdWxlc1xuICAgICAgICAgICAgICAgIGQucmVjdChcbiAgICAgICAgICAgICAgICAgICAgWyB4ICwgeSBdLFxuICAgICAgICAgICAgICAgICAgICBbdyxoXSxcbiAgICAgICAgICAgICAgICAgICAgJ3ByZXZpZXdfbW9kdWxlJ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0b3AgYXJyYXkgY29uZHVpdFxuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuYXJyYXkubGVmdCAsIGxvYy5wcmV2aWV3LmFycmF5LnRvcCBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuYXJyYXkucmlnaHQgLSB3LCBsb2MucHJldmlldy5hcnJheS50b3AgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LmFycmF5LnJpZ2h0ICwgbG9jLnByZXZpZXcuYXJyYXkudG9wIF0sXG4gICAgICAgICAgICBdXG4gICAgICAgICk7XG4gICAgICAgIC8vIGJvdHRvbSBhcnJheSBjb25kdWl0XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5hcnJheS5sZWZ0ICwgbG9jLnByZXZpZXcuYXJyYXkuYm90dG9tIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5hcnJheS5yaWdodCAtIHcgLCBsb2MucHJldmlldy5hcnJheS5ib3R0b20gXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LmFycmF5LnJpZ2h0IC0gdyAsIGxvYy5wcmV2aWV3LmFycmF5LnRvcCBdLFxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuXG4gICAgICAgIHkgPSBsb2MucHJldmlldy5hcnJheS50b3A7XG4gICAgICAgIGggPSBzaXplLnByZXZpZXcubW9kdWxlLmg7XG5cbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgWyBsb2MucHJldmlldy5EQy5jZW50ZXIsIHkraC8yK29mZnNldCBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdBcnJheSBEQycsXG4gICAgICAgICAgICAgICAgJ1N0cmluZ3M6ICcgKyBwYXJzZUZsb2F0KHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncykudG9GaXhlZCgpLFxuICAgICAgICAgICAgICAgICdNb2R1bGVzOiAnICsgcGFyc2VGbG9hdChzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nKS50b0ZpeGVkKCksXG4gICAgICAgICAgICAgICAgJ1BtcDogJyArIHBhcnNlRmxvYXQoc3lzdGVtLmFycmF5LnBtcCkudG9GaXhlZCgpLFxuICAgICAgICAgICAgICAgICdJbXA6ICcgKyBwYXJzZUZsb2F0KHN5c3RlbS5hcnJheS5pbXApLnRvRml4ZWQoKSxcbiAgICAgICAgICAgICAgICAnVm1wOiAnICsgcGFyc2VGbG9hdChzeXN0ZW0uYXJyYXkudm1wKS50b0ZpeGVkKCksXG4gICAgICAgICAgICAgICAgJ0lzYzogJyArIHBhcnNlRmxvYXQoc3lzdGVtLmFycmF5LmlzYykudG9GaXhlZCgpLFxuICAgICAgICAgICAgICAgICdWb2M6ICcgKyBwYXJzZUZsb2F0KHN5c3RlbS5hcnJheS52b2MpLnRvRml4ZWQoKSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAncHJldmlldyB0ZXh0J1xuICAgICAgICApO1xuICAgIH1cblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnREMnKSApe1xuICAgICAgICBkLmxheWVyKCdwcmV2aWV3X0RDJyk7XG5cbiAgICAgICAgLy95ID0geTtcbiAgICAgICAgeSA9IGxvYy5wcmV2aWV3LmFycmF5LnRvcDtcbiAgICAgICAgdyA9IHNpemUucHJldmlldy5tb2R1bGUudztcbiAgICAgICAgaCA9IHNpemUucHJldmlldy5tb2R1bGUuaDtcblxuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuREMubGVmdCAsIHkgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LkRDLnJpZ2h0LCB5IF0sXG4gICAgICAgICAgICBdXG4gICAgICAgICk7XG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFtsb2MucHJldmlldy5EQy5jZW50ZXIseV0sXG4gICAgICAgICAgICBbdyxoXSxcbiAgICAgICAgICAgICdwcmV2aWV3X0RDX2JveCdcbiAgICAgICAgKTtcblxuICAgIH1cblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnaW52ZXJ0ZXInKSApe1xuXG4gICAgICAgIGQubGF5ZXIoJ3ByZXZpZXdfaW52ZXJ0ZXInKTtcblxuICAgICAgICB5ID0geTtcbiAgICAgICAgdyA9IHNpemUucHJldmlldy5pbnZlcnRlci53O1xuICAgICAgICBoID0gc2l6ZS5wcmV2aWV3LmludmVydGVyLmg7XG5cbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW2xvYy5wcmV2aWV3LmludmVydGVyLmNlbnRlcix5XSxcbiAgICAgICAgICAgIFt3LGhdLFxuICAgICAgICAgICAgJ3ByZXZpZXdfaW52ZXJ0ZXJfYm94J1xuICAgICAgICApO1xuICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICBbbG9jLnByZXZpZXcuaW52ZXJ0ZXIuY2VudGVyLHkraC8yK29mZnNldF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ0ludmVydGVyJyxcbiAgICAgICAgICAgICAgICBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSxcbiAgICAgICAgICAgICAgICBzeXN0ZW0uaW52ZXJ0ZXIubW9kZWwsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ3ByZXZpZXcgdGV4dCdcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ0FDJykgKXtcblxuICAgICAgICBkLmxheWVyKCdwcmV2aWV3X0FDJyk7XG5cblxuICAgICAgICB5ID0geTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LkFDLmxlZnQsIHkgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LkFDLnJpZ2h0LCB5IF0sXG4gICAgICAgICAgICBdXG4gICAgICAgICk7XG4gICAgICAgIHcgPSBzaXplLnByZXZpZXcuQUMudztcbiAgICAgICAgaCA9IHNpemUucHJldmlldy5BQy5oO1xuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbbG9jLnByZXZpZXcuQUMuY2VudGVyLHldLFxuICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAncHJldmlld19BQ19ib3gnXG4gICAgICAgICk7XG4gICAgICAgIHcgPSBzaXplLnByZXZpZXcubG9hZGNlbnRlci53O1xuICAgICAgICBoID0gc2l6ZS5wcmV2aWV3LmxvYWRjZW50ZXIuaDtcbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgWyBsb2MucHJldmlldy5BQy5yaWdodC13LzIsIHkraC80IF0sXG4gICAgICAgICAgICBbdyxoXSxcbiAgICAgICAgICAgICdwcmV2aWV3X0FDX2JveCdcbiAgICAgICAgKTtcblxuICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICBbbG9jLnByZXZpZXcuQUMuY2VudGVyLHkraC8yK29mZnNldF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ0FDJyxcblxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwcmV2aWV3IHRleHQnXG4gICAgICAgICk7XG5cbiAgICB9XG5cbiAgICByZXR1cm4gZC5kcmF3aW5nX3BhcnRzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcGFnZTtcbiIsInZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG52YXIgbWtfYm9yZGVyID0gcmVxdWlyZSgnLi9ta19ib3JkZXInKTtcbnZhciBmID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMnKTtcblxudmFyIHBhZ2UgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgY29uc29sZS5sb2coXCIqKiBNYWtpbmcgcHJldmlldyAyXCIpO1xuXG4gICAgdmFyIGQgPSBta19kcmF3aW5nKCk7XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ3Jvb2YnKSApe1xuXG4gICAgICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgICAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG4gICAgICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5cbiAgICAgICAgdmFyIHgsIHksIGgsIHcsIHNlY3Rpb25feCwgc2VjdGlvbl95LCBsZW5ndGhfcCwgc2NhbGU7XG5cbiAgICAgICAgdmFyIHNsb3BlID0gc3lzdGVtLnJvb2Yuc2xvcGUuc3BsaXQoJzonKVswXTtcbiAgICAgICAgdmFyIGFuZ2xlX3JhZCA9IE1hdGguYXRhbiggTnVtYmVyKHNsb3BlKSAvMTIgKTtcbiAgICAgICAgLy9hbmdsZV9yYWQgPSBhbmdsZSAqIChNYXRoLlBJLzE4MCk7XG5cblxuICAgICAgICBsZW5ndGhfcCA9IHN5c3RlbS5yb29mLmxlbmd0aCAqIE1hdGguY29zKGFuZ2xlX3JhZCk7XG4gICAgICAgIHN5c3RlbS5yb29mLmhlaWdodCA9IHN5c3RlbS5yb29mLmxlbmd0aCAqIE1hdGguc2luKGFuZ2xlX3JhZCk7XG5cbiAgICAgICAgdmFyIHJvb2ZfcmF0aW8gPSBzeXN0ZW0ucm9vZi5sZW5ndGggLyBzeXN0ZW0ucm9vZi53aWR0aDtcbiAgICAgICAgdmFyIHJvb2ZfcGxhbl9yYXRpbyA9IGxlbmd0aF9wIC8gc3lzdGVtLnJvb2Yud2lkdGg7XG5cblxuICAgICAgICBpZiggc3lzdGVtLnJvb2YudHlwZSA9PT0gXCJHYWJsZVwiKXtcblxuXG4gICAgICAgICAgICAvLy8vLy8vXG4gICAgICAgICAgICAvLyBSb29kIHBsYW4gdmlld1xuICAgICAgICAgICAgdmFyIHBsYW5feCA9IDMwO1xuICAgICAgICAgICAgdmFyIHBsYW5feSA9IDMwO1xuXG4gICAgICAgICAgICB2YXIgcGxhbl93LCBwbGFuX2g7XG4gICAgICAgICAgICBpZiggbGVuZ3RoX3AqMiA+IHN5c3RlbS5yb29mLndpZHRoICl7XG4gICAgICAgICAgICAgICAgc2NhbGUgPSAyNTAvKGxlbmd0aF9wKjIpO1xuICAgICAgICAgICAgICAgIHBsYW5fdyA9IChsZW5ndGhfcCoyKSAqIHNjYWxlO1xuICAgICAgICAgICAgICAgIHBsYW5faCA9IHBsYW5fdyAvIChsZW5ndGhfcCoyIC8gc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDQwMC8oc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgICAgIHBsYW5faCA9IHN5c3RlbS5yb29mLndpZHRoICogc2NhbGU7XG4gICAgICAgICAgICAgICAgcGxhbl93ID0gcGxhbl9oICogKGxlbmd0aF9wKjIgLyBzeXN0ZW0ucm9vZi53aWR0aCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGQucmVjdChcbiAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3krcGxhbl9oLzJdLFxuICAgICAgICAgICAgICAgIFtwbGFuX3csIHBsYW5faF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZC5wb2x5KFtcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCAgICAgICAsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feStwbGFuX2hdLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94LCAgICAgICAgcGxhbl95K3BsYW5faF0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3ggICAgICAgLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfcG9seV91bnNlbGVjdGVkXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnBvbHkoW1xuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yICAgICAgICwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMitwbGFuX3cvMiwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMitwbGFuX3cvMiwgcGxhbl95K3BsYW5faF0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsICAgICAgICBwbGFuX3krcGxhbl9oXSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiAgICAgICAsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3NlbGVjdGVkXCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feStwbGFuX2hdXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbcGxhbl94LTIwLCBwbGFuX3krcGxhbl9oLzJdLFxuICAgICAgICAgICAgICAgIHN5c3RlbS5yb29mLmxlbmd0aC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93KzIwLCBwbGFuX3krcGxhbl9oLzJdLFxuICAgICAgICAgICAgICAgIHN5c3RlbS5yb29mLndpZHRoLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG5cblxuXG5cbiAgICAgICAgICAgIC8vLy8vLy8vXG4gICAgICAgICAgICAvLyByb29mIGNyb3NzZWN0aW9uXG5cbiAgICAgICAgICAgIHZhciBjc194ID0gMzA7XG4gICAgICAgICAgICB2YXIgY3NfeSA9IDMwK3BsYW5faCs1MDtcbiAgICAgICAgICAgIHZhciBjc19oID0gc3lzdGVtLnJvb2YuaGVpZ2h0ICogc2NhbGU7XG4gICAgICAgICAgICB2YXIgY3NfdyA9IHBsYW5fdy8yO1xuXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3ldLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3krY3NfaF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3csICAgY3NfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3cqMiwgY3NfeStjc19oXSxcbiAgICAgICAgICAgICAgICAgICAgW2NzX3gsICAgICAgICBjc195K2NzX2hdLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3ldLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbY3NfeCtjc193LTE1LCBjc195K2NzX2gqMi8zXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi5oZWlnaHQgKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbY3NfeCtjc193KjEuNSsyMCwgY3NfeStjc19oLzNdLFxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHN5c3RlbS5yb29mLmxlbmd0aCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG5cblxuICAgICAgICAgICAgLy8vLy8vXG4gICAgICAgICAgICAvLyByb29mIGRldGFpbFxuXG4gICAgICAgICAgICB2YXIgZGV0YWlsX3ggPSAzMCs0NTA7XG4gICAgICAgICAgICB2YXIgZGV0YWlsX3kgPSAzMDtcblxuICAgICAgICAgICAgaWYoIE51bWJlcihzeXN0ZW0ucm9vZi53aWR0aCkgPj0gTnVtYmVyKHN5c3RlbS5yb29mLmxlbmd0aCkgKXtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDQ1MC8oc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDQ1MC8oc3lzdGVtLnJvb2YubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkZXRhaWxfdyA9IHN5c3RlbS5yb29mLndpZHRoICogc2NhbGU7XG4gICAgICAgICAgICB2YXIgZGV0YWlsX2ggPSBzeXN0ZW0ucm9vZi5sZW5ndGggKiBzY2FsZTtcblxuICAgICAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy8yLCBkZXRhaWxfeStkZXRhaWxfaC8yXSxcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3csIGRldGFpbF9oXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3NlbGVjdGVkX2ZyYW1lZFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB2YXIgYSA9IDM7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0X2EgPSBhICogc2NhbGU7XG5cbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCwgICBkZXRhaWxfeStvZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdywgICBkZXRhaWxfeStvZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCwgICAgICAgICAgZGV0YWlsX3krZGV0YWlsX2gtb2Zmc2V0X2FdLFxuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3csIGRldGFpbF95K2RldGFpbF9oLW9mZnNldF9hXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K29mZnNldF9hLCBkZXRhaWxfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtvZmZzZXRfYSwgZGV0YWlsX3krZGV0YWlsX2hdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3ctb2Zmc2V0X2EsIGRldGFpbF95XSxcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LW9mZnNldF9hLCBkZXRhaWxfeStkZXRhaWxfaF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeC00MCwgZGV0YWlsX3krZGV0YWlsX2gvMl0sXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggc3lzdGVtLnJvb2YubGVuZ3RoICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LzIsIGRldGFpbF95K2RldGFpbF9oKzQwXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi53aWR0aCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94KyAob2Zmc2V0X2EpLzIsIGRldGFpbF95K2RldGFpbF9oKzE1XSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LShvZmZzZXRfYSkvMiwgZGV0YWlsX3krZGV0YWlsX2grMTVdLFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3gtMTUsIGRldGFpbF95K2RldGFpbF9oLShvZmZzZXRfYSkvMl0sXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeC0xNSwgZGV0YWlsX3krKG9mZnNldF9hKS8yXSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG5cblxuXG5cblxuICAgICAgICAgICAgLy8vLy8vXG4gICAgICAgICAgICAvLyBNb2R1bGUgb3B0aW9uc1xuICAgICAgICAgICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdtb2R1bGUnKSAmJiBmLnNlY3Rpb25fZGVmaW5lZCgnYXJyYXknKSl7XG4gICAgICAgICAgICAgICAgdmFyIHIsYztcblxuICAgICAgICAgICAgICAgIHZhciByb29mX2xlbmd0aF9hdmFpbCA9IHN5c3RlbS5yb29mLmxlbmd0aCAtIChhKjIpO1xuICAgICAgICAgICAgICAgIHZhciByb29mX3dpZHRoX2F2YWlsID0gc3lzdGVtLnJvb2Yud2lkdGggLSAoYSoyKTtcblxuICAgICAgICAgICAgICAgIHZhciByb3dfc3BhY2luZztcbiAgICAgICAgICAgICAgICBpZiggc3lzdGVtLm1vZHVsZS5vcmllbnRhdGlvbiA9PT0gJ1BvcnRyYWl0JyApe1xuICAgICAgICAgICAgICAgICAgICByb3dfc3BhY2luZyA9IE51bWJlcihzeXN0ZW0ubW9kdWxlLmxlbmd0aCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBjb2xfc3BhY2luZyA9IE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV93ID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSAgKS8xMjtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlX2ggPSAoTnVtYmVyKHN5c3RlbS5tb2R1bGUubGVuZ3RoKSApLzEyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd19zcGFjaW5nID0gTnVtYmVyKHN5c3RlbS5tb2R1bGUud2lkdGgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgY29sX3NwYWNpbmcgPSBOdW1iZXIoc3lzdGVtLm1vZHVsZS5sZW5ndGgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlX3cgPSAoTnVtYmVyKHN5c3RlbS5tb2R1bGUubGVuZ3RoKSkvMTI7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV9oID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSApLzEyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJvd19zcGFjaW5nID0gcm93X3NwYWNpbmcvMTI7IC8vbW9kdWxlIGRpbWVudGlvbnMgYXJlIGluIGluY2hlc1xuICAgICAgICAgICAgICAgIGNvbF9zcGFjaW5nID0gY29sX3NwYWNpbmcvMTI7IC8vbW9kdWxlIGRpbWVudGlvbnMgYXJlIGluIGluY2hlc1xuXG4gICAgICAgICAgICAgICAgdmFyIG51bV9yb3dzID0gTWF0aC5mbG9vcihyb29mX2xlbmd0aF9hdmFpbC9yb3dfc3BhY2luZyk7XG4gICAgICAgICAgICAgICAgdmFyIG51bV9jb2xzID0gTWF0aC5mbG9vcihyb29mX3dpZHRoX2F2YWlsL2NvbF9zcGFjaW5nKTtcblxuICAgICAgICAgICAgICAgIC8vc2VsZWN0ZWQgbW9kdWxlc1xuXG4gICAgICAgICAgICAgICAgaWYoIG51bV9jb2xzICE9PSBnLnRlbXAubnVtX2NvbHMgfHwgbnVtX3Jvd3MgIT09IGcudGVtcC5udW1fcm93cyApe1xuICAgICAgICAgICAgICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlcyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yKCByPTE7IHI8PW51bV9yb3dzOyByKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciggYz0xOyBjPD1udW1fY29sczsgYysrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICBnLnRlbXAubnVtX2NvbHMgPSBudW1fY29scztcbiAgICAgICAgICAgICAgICAgICAgZy50ZW1wLm51bV9yb3dzID0gbnVtX3Jvd3M7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB4ID0gZGV0YWlsX3ggKyBvZmZzZXRfYTsgLy9jb3JuZXIgb2YgdXNhYmxlIHNwYWNlXG4gICAgICAgICAgICAgICAgeSA9IGRldGFpbF95ICsgb2Zmc2V0X2E7XG4gICAgICAgICAgICAgICAgeCArPSAoIHJvb2Zfd2lkdGhfYXZhaWwgLSAoY29sX3NwYWNpbmcqbnVtX2NvbHMpKS8yICpzY2FsZTsgLy8gY2VudGVyIGFycmF5IG9uIHJvb2ZcbiAgICAgICAgICAgICAgICB5ICs9ICggcm9vZl9sZW5ndGhfYXZhaWwgLSAocm93X3NwYWNpbmcqbnVtX3Jvd3MpKS8yICpzY2FsZTtcbiAgICAgICAgICAgICAgICBtb2R1bGVfdyA9IG1vZHVsZV93ICogc2NhbGU7XG4gICAgICAgICAgICAgICAgbW9kdWxlX2ggPSBtb2R1bGVfaCAqIHNjYWxlO1xuXG5cblxuICAgICAgICAgICAgICAgIGZvciggcj0xOyByPD1udW1fcm93czsgcisrKXtcblxuICAgICAgICAgICAgICAgICAgICBmb3IoIGM9MTsgYzw9bnVtX2NvbHM7IGMrKyl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXllcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSApIGxheWVyID0gJ3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBsYXllciA9ICdwcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZV94ID0gKGMtMSkgKiBjb2xfc3BhY2luZyAqIHNjYWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlX3kgPSAoci0xKSAqIHJvd19zcGFjaW5nICogc2NhbGU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGQucmVjdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbeCttb2R1bGVfeCttb2R1bGVfdy8yLCB5K21vZHVsZV95K21vZHVsZV9oLzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFttb2R1bGVfdywgbW9kdWxlX2hdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljazogXCJnLmYudG9nZ2xlX21vZHVsZSh0aGlzKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVfSUQ6ICAocikgKyAnLCcgKyAoYylcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LzIsIGRldGFpbF95K2RldGFpbF9oKzEwMF0sXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiU2VsZWN0ZWQgbW9kdWxlczogXCIgKyBwYXJzZUZsb2F0KCBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDYWxjdWxhdGVkIG1vZHVsZXM6IFwiICsgcGFyc2VGbG9hdCggZy5zeXN0ZW0uYXJyYXkubnVtYmVyX29mX21vZHVsZXMgKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHggPSBkZXRhaWxfeCArIDQ3NTtcbiAgICAgICAgICAgIHkgPSBkZXRhaWxfeSArIDEyMDtcblxuICAgICAgICAgICAgZC5ibG9jaygnbm9ydGggYXJyb3dfdXAnLCBbeCx5XSk7XG5cbiAgICAgICAgICAgIHggPSAxMjA7XG4gICAgICAgICAgICB5ID0gMTU7XG5cbiAgICAgICAgICAgIGQuYmxvY2soJ25vcnRoIGFycm93X2xlZnQnLCBbeCx5XSk7XG4vLyovXG4gICAgICAgIH1cblxuXG4gICAgICAgIC8qXG5cblxuXG5cbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4LCAgICB5XSxcbiAgICAgICAgICAgIFt4K2R4LCB5LWR5XSxcbiAgICAgICAgICAgIFt4K2R4LCB5XSxcbiAgICAgICAgICAgIFt4LCAgICB5XSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgKTtcblxuICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICBbeCtkeC8yLTEwLCB5LWR5LzItMjBdLFxuICAgICAgICAgICAgc3lzdGVtLnJvb2YuaGVpZ2h0LnRvU3RyaW5nKCksXG4gICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICApO1xuICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICBbeCtkeC8yKzUsIHktMTVdLFxuICAgICAgICAgICAgYW5nbGUudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICk7XG5cblxuICAgICAgICB4ID0geCtkeCsxMDA7XG4gICAgICAgIHkgPSB5O1xuXG5cbiAgICAgICAgLy8qL1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCIndXNlIHN0cmljdCc7XG4vL3ZhciBzZXR0aW5ncyA9IHJlcXVpcmUoJy4vc2V0dGluZ3MuanMnKTtcbi8vdmFyIHNuYXBzdmcgPSByZXF1aXJlKCdzbmFwc3ZnJyk7XG4vL2xvZyhzZXR0aW5ncyk7XG5cblxuXG52YXIgZGlzcGxheV9zdmcgPSBmdW5jdGlvbihkcmF3aW5nX3BhcnRzLCBzZXR0aW5ncyl7XG4gICAgLy9jb25zb2xlLmxvZygnZGlzcGxheWluZyBzdmcnKTtcbiAgICB2YXIgbGF5ZXJfYXR0ciA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubGF5ZXJfYXR0cjtcbiAgICB2YXIgZm9udHMgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmZvbnRzO1xuICAgIC8vY29uc29sZS5sb2coJ2RyYXdpbmdfcGFydHM6ICcsIGRyYXdpbmdfcGFydHMpO1xuICAgIC8vY29udGFpbmVyLmVtcHR5KClcblxuICAgIC8vdmFyIHN2Z19lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ1N2Z2pzU3ZnMTAwMCcpXG4gICAgdmFyIHN2Z19lbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3N2ZycpO1xuICAgIHN2Z19lbGVtLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCdzdmdfZHJhd2luZycpO1xuICAgIC8vc3ZnX2VsZW0uc2V0QXR0cmlidXRlKCd3aWR0aCcsIHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS5kcmF3aW5nLncpO1xuICAgIC8vc3ZnX2VsZW0uc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy5oKTtcbiAgICB2YXIgdmlld19ib3ggPSAnMCAwICcgK1xuICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy53ICsgJyAnICtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcuaCArICcgJztcbiAgICBzdmdfZWxlbS5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCB2aWV3X2JveCk7XG4gICAgLy92YXIgc3ZnID0gc25hcHN2ZyhzdmdfZWxlbSkuc2l6ZShzaXplLmRyYXdpbmcudywgc2l6ZS5kcmF3aW5nLmgpO1xuICAgIC8vdmFyIHN2ZyA9IHNuYXBzdmcoJyNzdmdfZHJhd2luZycpO1xuXG4gICAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgZHJhd2luZyBjb250ZW50cywgY2FsbCB0aGUgZnVuY3Rpb24gYmVsb3cuXG4gICAgZHJhd2luZ19wYXJ0cy5mb3JFYWNoKCBmdW5jdGlvbihlbGVtLGlkKSB7XG4gICAgICAgIHNob3dfZWxlbV9hcnJheShlbGVtKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHNob3dfZWxlbV9hcnJheShlbGVtLCBvZmZzZXQpe1xuICAgICAgICBvZmZzZXQgPSBvZmZzZXQgfHwge3g6MCx5OjB9O1xuICAgICAgICB2YXIgeCx5LGF0dHJfbmFtZTtcbiAgICAgICAgaWYoIHR5cGVvZiBlbGVtLnggIT09ICd1bmRlZmluZWQnICkgeyB4ID0gZWxlbS54ICsgb2Zmc2V0Lng7IH1cbiAgICAgICAgaWYoIHR5cGVvZiBlbGVtLnkgIT09ICd1bmRlZmluZWQnICkgeyB5ID0gZWxlbS55ICsgb2Zmc2V0Lnk7IH1cblxuICAgICAgICB2YXIgYXR0cnMgPSBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV07XG4gICAgICAgIGlmKCBlbGVtLmF0dHJzICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gZWxlbS5hdHRycyApe1xuICAgICAgICAgICAgICAgIGF0dHJzW2F0dHJfbmFtZV0gPSBlbGVtLmF0dHJzW2F0dHJfbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiggZWxlbS50eXBlID09PSAncmVjdCcpIHtcbiAgICAgICAgICAgIC8vc3ZnLnJlY3QoIGVsZW0udywgZWxlbS5oICkubW92ZSggeC1lbGVtLncvMiwgeS1lbGVtLmgvMiApLmF0dHIoIGxheWVyX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZWxlbTonLCBlbGVtICk7XG4gICAgICAgICAgICAvL2lmKCBpc05hTihlbGVtLncpICkge1xuICAgICAgICAgICAgLy8gICAgY29uc29sZS5sb2coJ2Vycm9yOiBlbGVtIG5vdCBmdWxseSBkZWZpbmVkJywgZWxlbSlcbiAgICAgICAgICAgIC8vICAgIGVsZW0udyA9IDEwO1xuICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAvL2lmKCBpc05hTihlbGVtLmgpICkge1xuICAgICAgICAgICAgLy8gICAgY29uc29sZS5sb2coJ2Vycm9yOiBlbGVtIG5vdCBmdWxseSBkZWZpbmVkJywgZWxlbSlcbiAgICAgICAgICAgIC8vICAgIGVsZW0uaCA9IDEwO1xuICAgICAgICAgICAgLy99XG4gICAgICAgICAgICB2YXIgciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdyZWN0Jyk7XG4gICAgICAgICAgICByLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBlbGVtLncpO1xuICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGVsZW0uaCk7XG4gICAgICAgICAgICByLnNldEF0dHJpYnV0ZSgneCcsIHgtZWxlbS53LzIpO1xuICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoJ3knLCB5LWVsZW0uaC8yKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZWxlbS5sYXllcl9uYW1lKTtcbiAgICAgICAgICAgIGZvciggYXR0cl9uYW1lIGluIGF0dHJzICl7XG4gICAgICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoYXR0cl9uYW1lLCBhdHRyc1thdHRyX25hbWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN2Z19lbGVtLmFwcGVuZENoaWxkKHIpO1xuICAgICAgICB9IGVsc2UgaWYoIGVsZW0udHlwZSA9PT0gJ2xpbmUnKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnRzMiA9IFtdO1xuICAgICAgICAgICAgZWxlbS5wb2ludHMuZm9yRWFjaCggZnVuY3Rpb24ocG9pbnQpe1xuICAgICAgICAgICAgICAgIGlmKCAhIGlzTmFOKHBvaW50WzBdKSAmJiAhIGlzTmFOKHBvaW50WzFdKSApe1xuICAgICAgICAgICAgICAgICAgICBwb2ludHMyLnB1c2goWyBwb2ludFswXStvZmZzZXQueCwgcG9pbnRbMV0rb2Zmc2V0LnkgXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yOiBlbGVtIG5vdCBmdWxseSBkZWZpbmVkJywgZWxlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL3N2Zy5wb2x5bGluZSggcG9pbnRzMiApLmF0dHIoIGxheWVyX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApO1xuXG4gICAgICAgICAgICB2YXIgbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdwb2x5bGluZScpO1xuICAgICAgICAgICAgbC5zZXRBdHRyaWJ1dGUoICdwb2ludHMnLCBwb2ludHMyLmpvaW4oJyAnKSApO1xuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gYXR0cnMgKXtcbiAgICAgICAgICAgICAgICBsLnNldEF0dHJpYnV0ZShhdHRyX25hbWUsIGF0dHJzW2F0dHJfbmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3ZnX2VsZW0uYXBwZW5kQ2hpbGQobCk7XG4gICAgICAgIH0gZWxzZSBpZiggZWxlbS50eXBlID09PSAncG9seScpIHtcbiAgICAgICAgICAgIHZhciBwb2ludHMyID0gW107XG4gICAgICAgICAgICBlbGVtLnBvaW50cy5mb3JFYWNoKCBmdW5jdGlvbihwb2ludCl7XG4gICAgICAgICAgICAgICAgaWYoICEgaXNOYU4ocG9pbnRbMF0pICYmICEgaXNOYU4ocG9pbnRbMV0pICl7XG4gICAgICAgICAgICAgICAgICAgIHBvaW50czIucHVzaChbIHBvaW50WzBdK29mZnNldC54LCBwb2ludFsxXStvZmZzZXQueSBdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3I6IGVsZW0gbm90IGZ1bGx5IGRlZmluZWQnLCBlbGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vc3ZnLnBvbHlsaW5lKCBwb2ludHMyICkuYXR0ciggbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdICk7XG5cbiAgICAgICAgICAgIHZhciBsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3BvbHlsaW5lJyk7XG4gICAgICAgICAgICBsLnNldEF0dHJpYnV0ZSggJ3BvaW50cycsIHBvaW50czIuam9pbignICcpICk7XG4gICAgICAgICAgICBmb3IoIGF0dHJfbmFtZSBpbiBhdHRycyApe1xuICAgICAgICAgICAgICAgIGwuc2V0QXR0cmlidXRlKGF0dHJfbmFtZSwgYXR0cnNbYXR0cl9uYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdmdfZWxlbS5hcHBlbmRDaGlsZChsKTtcbiAgICAgICAgfSBlbHNlIGlmKCBlbGVtLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICAgICAgLy92YXIgdCA9IHN2Zy50ZXh0KCBlbGVtLnN0cmluZ3MgKS5tb3ZlKCBlbGVtLnBvaW50c1swXVswXSwgZWxlbS5wb2ludHNbMF1bMV0gKS5hdHRyKCBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV0gKVxuICAgICAgICAgICAgdmFyIGZvbnQ7XG4gICAgICAgICAgICBpZiggZWxlbS5mb250ICl7XG4gICAgICAgICAgICAgICAgZm9udCA9IGZvbnRzW2VsZW0uZm9udF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvbnQgPSBmb250c1thdHRycy5mb250XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3RleHQnKTtcbiAgICAgICAgICAgIGlmKGVsZW0ucm90YXRlZCl7XG4gICAgICAgICAgICAgICAgLy90LnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywgXCJyb3RhdGUoXCIgKyBlbGVtLnJvdGF0ZWQgKyBcIiBcIiArIHggKyBcIiBcIiArIHkgKyBcIilcIiApO1xuICAgICAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCBcInJvdGF0ZShcIiArIGVsZW0ucm90YXRlZCArIFwiIFwiICsgeCArIFwiIFwiICsgeSArIFwiKVwiICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vaWYoIGZvbnRbJ3RleHQtYW5jaG9yJ10gPT09ICdtaWRkbGUnICkgeSArPSBmb250Wydmb250LXNpemUnXSoxLzM7XG4gICAgICAgICAgICAgICAgeSArPSBmb250Wydmb250LXNpemUnXSoxLzM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZHkgPSBmb250Wydmb250LXNpemUnXSoxLjU7XG4gICAgICAgICAgICB0LnNldEF0dHJpYnV0ZSgneCcsIHgpO1xuICAgICAgICAgICAgLy90LnNldEF0dHJpYnV0ZSgneScsIHkgKyBmb250Wydmb250LXNpemUnXS8yICk7XG4gICAgICAgICAgICB0LnNldEF0dHJpYnV0ZSgneScsIHktZHkgKTtcblxuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gYXR0cnMgKXtcbiAgICAgICAgICAgICAgICBpZiggYXR0cl9uYW1lID09PSAnc3Ryb2tlJyApIHtcbiAgICAgICAgICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoICdmaWxsJywgYXR0cnNbYXR0cl9uYW1lXSApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiggYXR0cl9uYW1lID09PSAnZmlsbCcgKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vdC5zZXRBdHRyaWJ1dGUoICdzdHJva2UnLCAnbm9uZScgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0LnNldEF0dHJpYnV0ZSggYXR0cl9uYW1lLCBhdHRyc1thdHRyX25hbWVdICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IoIGF0dHJfbmFtZSBpbiBmb250ICl7XG4gICAgICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoIGF0dHJfbmFtZSwgZm9udFthdHRyX25hbWVdICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IoIGF0dHJfbmFtZSBpbiBlbGVtLnN0cmluZ3MgKXtcbiAgICAgICAgICAgICAgICB2YXIgdHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAndHNwYW4nKTtcbiAgICAgICAgICAgICAgICB0c3Bhbi5zZXRBdHRyaWJ1dGUoJ2R5JywgZHkgKTtcbiAgICAgICAgICAgICAgICB0c3Bhbi5zZXRBdHRyaWJ1dGUoJ3gnLCB4KTtcbiAgICAgICAgICAgICAgICB0c3Bhbi5pbm5lckhUTUwgPSBlbGVtLnN0cmluZ3NbYXR0cl9uYW1lXTtcbiAgICAgICAgICAgICAgICB0LmFwcGVuZENoaWxkKHRzcGFuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN2Z19lbGVtLmFwcGVuZENoaWxkKHQpO1xuICAgICAgICB9IGVsc2UgaWYoIGVsZW0udHlwZSA9PT0gJ2NpcmMnKSB7XG4gICAgICAgICAgICB2YXIgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdlbGxpcHNlJyk7XG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZSgncngnLCBlbGVtLmQvMik7XG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZSgncnknLCBlbGVtLmQvMik7XG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZSgnY3gnLCB4KTtcbiAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKCdjeScsIHkpO1xuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gYXR0cnMgKXtcbiAgICAgICAgICAgICAgICBjLnNldEF0dHJpYnV0ZShhdHRyX25hbWUsIGF0dHJzW2F0dHJfbmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3ZnX2VsZW0uYXBwZW5kQ2hpbGQoYyk7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgYy5hdHRyaWJ1dGVzKCBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV0gKVxuICAgICAgICAgICAgYy5hdHRyaWJ1dGVzKHtcbiAgICAgICAgICAgICAgICByeDogNSxcbiAgICAgICAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgIHJ5OiA1LFxuICAgICAgICAgICAgICAgIGN4OiBlbGVtLnBvaW50c1swXVswXS1lbGVtLmQvMixcbiAgICAgICAgICAgICAgICBjeTogZWxlbS5wb2ludHNbMF1bMV0tZWxlbS5kLzJcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB2YXIgYzIgPSBzdmcuZWxsaXBzZSggZWxlbS5yLCBlbGVtLnIgKVxuICAgICAgICAgICAgYzIubW92ZSggZWxlbS5wb2ludHNbMF1bMF0tZWxlbS5kLzIsIGVsZW0ucG9pbnRzWzBdWzFdLWVsZW0uZC8yIClcbiAgICAgICAgICAgIGMyLmF0dHIoe3J4OjUsIHJ5OjV9KVxuICAgICAgICAgICAgYzIuYXR0ciggbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdIClcbiAgICAgICAgICAgICovXG4gICAgICAgIH0gZWxzZSBpZihlbGVtLnR5cGUgPT09ICdibG9jaycpIHtcbiAgICAgICAgICAgIC8vIGlmIGl0IGlzIGEgYmxvY2ssIHJ1biB0aGlzIGZ1bmN0aW9uIHRocm91Z2ggZWFjaCBlbGVtZW50LlxuICAgICAgICAgICAgZWxlbS5kcmF3aW5nX3BhcnRzLmZvckVhY2goIGZ1bmN0aW9uKGJsb2NrX2VsZW0saWQpe1xuICAgICAgICAgICAgICAgIHNob3dfZWxlbV9hcnJheShibG9ja19lbGVtLCB7eDp4LCB5Onl9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdmdfZWxlbTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBkaXNwbGF5X3N2ZztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIGYgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucycpO1xuXG52YXIgaTtcbi8vdmFyIHNldHRpbmdzQ2FsY3VsYXRlZCA9IHJlcXVpcmUoJy4vc2V0dGluZ3NDYWxjdWxhdGVkLmpzJyk7XG5cbi8vIExvYWQgJ3VzZXInIGRlZmluZWQgc2V0dGluZ3Ncbi8vdmFyIG1rX3NldHRpbmdzID0gcmVxdWlyZSgnLi4vZGF0YS9zZXR0aW5ncy5qc29uLmpzJyk7XG4vL2YubWtfc2V0dGluZ3MgPSBta19zZXR0aW5ncztcblxudmFyIHNldHRpbmdzID0ge307XG5cbnNldHRpbmdzLnRlbXAgPSB7fTtcblxuc2V0dGluZ3MucGVybSA9IHt9O1xuc2V0dGluZ3MucGVybS5nZW9jb2RlID0ge307XG5zZXR0aW5ncy5wZXJtLmxvY2F0aW9uID0ge307XG5zZXR0aW5ncy5wZXJtLmxvY2F0aW9uLm5ld19hZGRyZXNzID0gZmFsc2U7XG5zZXR0aW5ncy5wZXJtLm1hcHMgPSB7fTtcblxuc2V0dGluZ3MuY29uZmlnX29wdGlvbnMgPSB7fTtcbnNldHRpbmdzLmNvbmZpZ19vcHRpb25zLk5FQ190YWJsZXMgPSByZXF1aXJlKCcuLi9kYXRhL3RhYmxlcy5qc29uJyk7XG4vL2NvbnNvbGUubG9nKHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLk5FQ190YWJsZXMpO1xuXG5zZXR0aW5ncy5zdGF0ZSA9IHt9O1xuc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkID0gZmFsc2U7XG5cbnNldHRpbmdzLmluID0ge307XG5cbnNldHRpbmdzLmluLm9wdCA9IHt9O1xuc2V0dGluZ3MuaW4ub3B0LkFDID0ge307XG5zZXR0aW5ncy5pbi5vcHQuQUMudHlwZXMgPSB7fTtcbnNldHRpbmdzLmluLm9wdC5BQy50eXBlc1tcIjEyMFZcIl0gPSBbXCJncm91bmRcIixcIm5ldXRyYWxcIixcIkwxXCJdO1xuc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzW1wiMjQwVlwiXSA9IFtcImdyb3VuZFwiLFwibmV1dHJhbFwiLFwiTDFcIixcIkwyXCJdO1xuc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzW1wiMjA4VlwiXSA9IFtcImdyb3VuZFwiLFwibmV1dHJhbFwiLFwiTDFcIixcIkwyXCJdO1xuc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzW1wiMjc3VlwiXSA9IFtcImdyb3VuZFwiLFwibmV1dHJhbFwiLFwiTDFcIl07XG5zZXR0aW5ncy5pbi5vcHQuQUMudHlwZXNbXCI0ODBWIFd5ZVwiXSA9IFtcImdyb3VuZFwiLFwibmV1dHJhbFwiLFwiTDFcIixcIkwyXCIsXCJMM1wiXTtcbnNldHRpbmdzLmluLm9wdC5BQy50eXBlc1tcIjQ4MFYgRGVsdGFcIl0gPSBbXCJncm91bmRcIixcIkwxXCIsXCJMMlwiLFwiTDNcIl07XG5cbnNldHRpbmdzLmlucHV0cyA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLmxvY2F0aW9uID0ge307XG5zZXR0aW5ncy5pbnB1dHMubG9jYXRpb24uY291bnR5ID0ge307XG5zZXR0aW5ncy5pbnB1dHMubG9jYXRpb24uY291bnR5LnR5cGUgPSAndGV4dF9pbnB1dCc7XG5zZXR0aW5ncy5pbnB1dHMubG9jYXRpb24uYWRkcmVzcyA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLmxvY2F0aW9uLmFkZHJlc3MudHlwZSA9ICd0ZXh0X2lucHV0JztcbnNldHRpbmdzLmlucHV0cy5sb2NhdGlvbi5jaXR5ID0ge307XG5zZXR0aW5ncy5pbnB1dHMubG9jYXRpb24uY2l0eS50eXBlID0gJ3RleHRfaW5wdXQnO1xuc2V0dGluZ3MuaW5wdXRzLmxvY2F0aW9uLnppcCA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLmxvY2F0aW9uLnppcC50eXBlID0gJ3RleHRfaW5wdXQnO1xuXG5zZXR0aW5ncy5pbnB1dHMucm9vZiA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLnJvb2Yud2lkdGggPSB7fTtcbnNldHRpbmdzLmlucHV0cy5yb29mLndpZHRoLm9wdGlvbnMgPSBbXTtcbi8vZm9yKCBpPTE1OyBpPD03MDsgaSs9NSApIHNldHRpbmdzLmlucHV0cy5yb29mLndpZHRoLm9wdGlvbnMucHVzaChpKTtcbnNldHRpbmdzLmlucHV0cy5yb29mLndpZHRoLnVuaXRzID0gJ2Z0Lic7XG5zZXR0aW5ncy5pbnB1dHMucm9vZi53aWR0aC5ub3RlID0gJ1RoaXMgdGhlIGZ1bGwgc2l6ZSBvZiB0aGUgcm9vZiwgcGVycGVuZGljdHVsYXIgdG8gdGhlIHNsb3BlLic7XG5zZXR0aW5ncy5pbnB1dHMucm9vZi53aWR0aC50eXBlID0gJ251bWJlcl9pbnB1dCc7XG5zZXR0aW5ncy5pbnB1dHMucm9vZi5sZW5ndGggPSB7fTtcbnNldHRpbmdzLmlucHV0cy5yb29mLmxlbmd0aC5vcHRpb25zID0gW107XG4vL2ZvciggaT0xMDsgaTw9NjA7IGkrPTUgKSBzZXR0aW5ncy5pbnB1dHMucm9vZi5sZW5ndGgub3B0aW9ucy5wdXNoKGkpO1xuc2V0dGluZ3MuaW5wdXRzLnJvb2YubGVuZ3RoLnVuaXRzID0gJ2Z0Lic7XG5zZXR0aW5ncy5pbnB1dHMucm9vZi5sZW5ndGgubm90ZSA9ICdUaGlzIHRoZSBmdWxsIGxlbmd0aCBvZiB0aGUgcm9vZiwgbWVhc3VyZWQgZnJvbSBsb3cgdG8gaGlnaC4nO1xuc2V0dGluZ3MuaW5wdXRzLnJvb2YubGVuZ3RoLnR5cGUgPSAnbnVtYmVyX2lucHV0JztcbnNldHRpbmdzLmlucHV0cy5yb29mLnNsb3BlID0ge307XG5zZXR0aW5ncy5pbnB1dHMucm9vZi5zbG9wZS5vcHRpb25zID0gWycxOjEyJywnMjoxMicsJzM6MTInLCc0OjEyJywnNToxMicsJzY6MTInLCc3OjEyJywnODoxMicsJzk6MTInLCcxMDoxMicsJzExOjEyJywnMTI6MTInXTtcbnNldHRpbmdzLmlucHV0cy5yb29mLnR5cGUgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5yb29mLnR5cGUub3B0aW9ucyA9IFsnR2FibGUnLCdTaGVkJywnSGlwcGVkJ107XG5zZXR0aW5ncy5pbnB1dHMubW9kdWxlID0ge307XG5zZXR0aW5ncy5pbnB1dHMubW9kdWxlLm1ha2UgPSB7fTtcbi8vc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5tYWtlLm9wdGlvbnMgPSBudWxsO1xuc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5tb2RlbCA9IHt9O1xuLy9zZXR0aW5ncy5pbnB1dHMubW9kdWxlLm1vZGVsLm9wdGlvbnMgPSBudWxsO1xuc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5vcmllbnRhdGlvbiA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5vcmllbnRhdGlvbi5vcHRpb25zID0gWydQb3J0cmFpdCcsJ0xhbmRzY2FwZSddO1xuc2V0dGluZ3MuaW5wdXRzLmFycmF5ID0ge307XG5zZXR0aW5ncy5pbnB1dHMuYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nID0ge307XG5zZXR0aW5ncy5pbnB1dHMuYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nLm9wdGlvbnMgPSBbMSwyLDMsNCw1LDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTUsMTYsMTcsMTgsMTksMjBdO1xuc2V0dGluZ3MuaW5wdXRzLmFycmF5Lm51bV9zdHJpbmdzID0ge307XG5zZXR0aW5ncy5pbnB1dHMuYXJyYXkubnVtX3N0cmluZ3Mub3B0aW9ucyA9IFsxLDIsMyw0LDUsNl07XG5zZXR0aW5ncy5pbnB1dHMuREMgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5EQy5ob21lX3J1bl9sZW5ndGggPSB7fTtcbi8vc2V0dGluZ3MuaW5wdXRzLkRDLmhvbWVfcnVuX2xlbmd0aC5vcHRpb25zID0gWzI1LDUwLDc1LDEwMCwxMjUsMTUwXTtcbnNldHRpbmdzLmlucHV0cy5EQy5ob21lX3J1bl9sZW5ndGgudHlwZSA9ICdudW1iZXJfaW5wdXQnO1xuc2V0dGluZ3MuaW5wdXRzLmludmVydGVyID0ge307XG5zZXR0aW5ncy5pbnB1dHMuaW52ZXJ0ZXIubWFrZSA9IHt9O1xuLy9zZXR0aW5ncy5pbnB1dHMuaW52ZXJ0ZXIubWFrZS5vcHRpb25zID0gbnVsbDtcbnNldHRpbmdzLmlucHV0cy5pbnZlcnRlci5tb2RlbCA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLmludmVydGVyLmxvY2F0aW9uID0ge307XG5zZXR0aW5ncy5pbnB1dHMuaW52ZXJ0ZXIubG9jYXRpb24ub3B0aW9ucyA9IFsnSW5zaWRlJywgJ091dHNpZGUnXTtcbi8vc2V0dGluZ3MuaW5wdXRzLmludmVydGVyLm1vZGVsLm9wdGlvbnMgPSBudWxsO1xuc2V0dGluZ3MuaW5wdXRzLkFDID0ge307XG5zZXR0aW5ncy5pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlcyA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbJzI0MFYnXSA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbJzI0MFYnXSA9IFsnMjQwVicsJzEyMFYnXTtcbnNldHRpbmdzLmlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzWycyMDgvMTIwViddID0ge307XG5zZXR0aW5ncy5pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlc1snMjA4LzEyMFYnXSA9IFsnMjA4VicsJzEyMFYnXTtcbnNldHRpbmdzLmlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzWyc0ODAvMjc3ViddID0ge307XG5zZXR0aW5ncy5pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlc1snNDgwLzI3N1YnXSA9IFsnNDgwViBXeWUnLCc0ODBWIERlbHRhJywnMjc3ViddO1xuc2V0dGluZ3MuaW5wdXRzLkFDLnR5cGUgPSB7fTtcbi8vc2V0dGluZ3MuaW5wdXRzLkFDLnR5cGUub3B0aW9ucyA9IG51bGw7XG5zZXR0aW5ncy5pbnB1dHMuQUMuZGlzdGFuY2VfdG9fbG9hZGNlbnRlciA9IHt9O1xuLy9zZXR0aW5ncy5pbnB1dHMuQUMuZGlzdGFuY2VfdG9fbG9hZGNlbnRlci5vcHRpb25zID0gWzMsNSwxMCwxNSwyMCwzMF07XG5zZXR0aW5ncy5pbnB1dHMuQUMuZGlzdGFuY2VfdG9fbG9hZGNlbnRlci50eXBlID0gJ251bWJlcl9pbnB1dCc7XG5cbnNldHRpbmdzLmlucHV0cy5hdHRhY2htZW50X3N5c3RlbSA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLmF0dGFjaG1lbnRfc3lzdGVtLm1ha2UgPSB7XG4gICAgb3B0aW9uczogWydVTklSQUMnXSxcbiAgICB0eXBlOiAnc2VsZWN0Jyxcbn07XG5zZXR0aW5ncy5pbnB1dHMuYXR0YWNobWVudF9zeXN0ZW0ubW9kZWwgPSB7XG4gICAgb3B0aW9uczogWydTT0xBUk1PVU5UJ10sXG4gICAgdHlwZTogJ3NlbGVjdCcsXG59O1xuXG5cblxuXG5cbi8vc2V0dGluZ3MuaW5wdXRzID0gc2V0dGluZ3MuaW5wdXRzOyAvLyBjb3B5IGlucHV0IHJlZmVyZW5jZSB3aXRoIG9wdGlvbnMgdG8gaW5wdXRzXG4vL3NldHRpbmdzLmlucHV0cyA9IGYuYmxhbmtfY29weShzZXR0aW5ncy5pbnB1dHMpOyAvLyBtYWtlIGlucHV0IHNlY3Rpb24gYmxhbmtcbi8vc2V0dGluZ3Muc3lzdGVtX2Zvcm11bGFzID0gc2V0dGluZ3Muc3lzdGVtOyAvLyBjb3B5IHN5c3RlbSByZWZlcmVuY2UgdG8gc3lzdGVtX2Zvcm11bGFzXG5zZXR0aW5ncy5zeXN0ZW0gPSBmLmJsYW5rX2NvcHkoc2V0dGluZ3MuaW5wdXRzKTsgLy8gbWFrZSBzeXN0ZW0gc2VjdGlvbiBibGFua1xuLy9mLm1lcmdlX29iamVjdHMoIHNldHRpbmdzLmlucHV0cywgc2V0dGluZ3Muc3lzdGVtICk7XG5cblxuLy8gbG9hZCBsYXllcnNcblxuc2V0dGluZ3MuZHJhd2luZyA9IHt9O1xuXG5zZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzID0ge307XG5zZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxheWVyX2F0dHIgPSByZXF1aXJlKCcuL3NldHRpbmdzX2xheWVycycpO1xuc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5mb250cyA9IHJlcXVpcmUoJy4vc2V0dGluZ3NfZm9udHMnKTtcblxuc2V0dGluZ3MuZHJhd2luZy5ibG9ja3MgPSB7fTtcblxuLy8gTG9hZCBkcmF3aW5nIHNwZWNpZmljIHNldHRpbmdzXG4vLyBUT0RPIEZpeCBzZXR0aW5nc19kcmF3aW5nIHdpdGggbmV3IHZhcmlhYmxlIGxvY2F0aW9uc1xudmFyIHNldHRpbmdzX2RyYXdpbmcgPSByZXF1aXJlKCcuL3NldHRpbmdzX2RyYXdpbmcnKTtcbnNldHRpbmdzID0gc2V0dGluZ3NfZHJhd2luZyhzZXR0aW5ncyk7XG5cbi8vc2V0dGluZ3Muc3RhdGVfYXBwLnZlcnNpb25fc3RyaW5nID0gdmVyc2lvbl9zdHJpbmc7XG5cbi8vc2V0dGluZ3MgPSBmLm51bGxUb09iamVjdChzZXR0aW5ncyk7XG5cbnNldHRpbmdzLnNlbGVjdF9yZWdpc3RyeSA9IFtdO1xuc2V0dGluZ3MudmFsdWVfcmVnaXN0cnkgPSBbXTtcblxuXG4vL3ZhciBjb25maWdfb3B0aW9ucyA9IHNldHRpbmdzLmNvbmZpZ19vcHRpb25zID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnMgfHwge307XG5cbnNldHRpbmdzLndlYnBhZ2UgPSB7fTtcbnNldHRpbmdzLndlYnBhZ2Uuc2VsZWN0aW9uc19tYW51YWxfdG9nZ2xlZCA9IHt9O1xuc2V0dGluZ3Mud2VicGFnZS5zZWN0aW9ucyA9IE9iamVjdC5rZXlzKHNldHRpbmdzLmlucHV0cyk7XG5cblxuc2V0dGluZ3Mud2VicGFnZS5zZWN0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbihzZWN0aW9uX25hbWUpe1xuICAgIHNldHRpbmdzLndlYnBhZ2Uuc2VsZWN0aW9uc19tYW51YWxfdG9nZ2xlZFtzZWN0aW9uX25hbWVdID0gZmFsc2U7XG59KTtcblxuc2V0dGluZ3Mud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzX3RvdGFsID0gMDtcbnNldHRpbmdzLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlcyA9IHt9O1xuXG5cblxuXG5zZXR0aW5ncy5jb21wb25lbnRzID0ge307XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldHRpbmdzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIHNldHRpbmdzX2RyYXdpbmcoc2V0dGluZ3Mpe1xuXG4gICAgdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcbiAgICB2YXIgc3RhdHVzID0gc2V0dGluZ3Muc3RhdHVzO1xuXG4gICAgLy8gRHJhd2luZyBzcGVjaWZpY1xuICAgIC8vc2V0dGluZ3MuZHJhd2luZyA9IHNldHRpbmdzLmRyYXdpbmcgfHwge307XG5cblxuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplID0ge307XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jID0ge307XG5cblxuICAgIC8vIHNpemVzXG4gICAgc2l6ZS5kcmF3aW5nID0ge1xuICAgICAgICB3OiAxMDAwLFxuICAgICAgICBoOiA3ODAsXG4gICAgICAgIGZyYW1lX3BhZGRpbmc6IDUsXG4gICAgICAgIHRpdGxlYm94OiA1MCxcbiAgICB9O1xuXG4gICAgc2l6ZS5tb2R1bGUgPSB7fTtcbiAgICBzaXplLm1vZHVsZS5mcmFtZSA9IHtcbiAgICAgICAgdzogMTAsXG4gICAgICAgIGg6IDMwLFxuICAgIH07XG4gICAgc2l6ZS5tb2R1bGUubGVhZCA9IHNpemUubW9kdWxlLmZyYW1lLncqMi8zO1xuICAgIHNpemUubW9kdWxlLmggPSBzaXplLm1vZHVsZS5mcmFtZS5oICsgc2l6ZS5tb2R1bGUubGVhZCoyO1xuICAgIHNpemUubW9kdWxlLncgPSBzaXplLm1vZHVsZS5mcmFtZS53O1xuXG4gICAgc2l6ZS53aXJlX29mZnNldCA9IHtcbiAgICAgICAgYmFzZTogNyxcbiAgICAgICAgZ2FwOiBzaXplLm1vZHVsZS53LFxuICAgIH07XG4gICAgc2l6ZS53aXJlX29mZnNldC5taW4gPSBzaXplLndpcmVfb2Zmc2V0LmJhc2UgKiAxO1xuXG4gICAgc2l6ZS5zdHJpbmcgPSB7fTtcbiAgICBzaXplLnN0cmluZy5nYXAgPSBzaXplLm1vZHVsZS5mcmFtZS53LzQyO1xuICAgIHNpemUuc3RyaW5nLmdhcF9taXNzaW5nID0gc2l6ZS5tb2R1bGUuaDtcbiAgICBzaXplLnN0cmluZy53ID0gc2l6ZS5tb2R1bGUuZnJhbWUudyAqIDIuNTtcblxuICAgIHNpemUudGVybWluYWxfZGlhbSA9IDU7XG4gICAgc2l6ZS5mdXNlID0ge307XG4gICAgc2l6ZS5mdXNlLncgPSAxNTtcbiAgICBzaXplLmZ1c2UuaCA9IDQ7XG5cblxuICAgIC8vIEludmVydGVyXG4gICAgc2l6ZS5pbnZlcnRlciA9IHsgdzogMjUwLCBoOiAxNTAgfTtcbiAgICBzaXplLmludmVydGVyLnRleHRfZ2FwID0gMTU7XG4gICAgc2l6ZS5pbnZlcnRlci5zeW1ib2xfdyA9IDUwO1xuICAgIHNpemUuaW52ZXJ0ZXIuc3ltYm9sX2ggPSAyNTtcblxuICAgIGxvYy5pbnZlcnRlciA9IHtcbiAgICAgICAgeDogc2l6ZS5kcmF3aW5nLncvMixcbiAgICAgICAgeTogc2l6ZS5kcmF3aW5nLmgvMyxcbiAgICB9O1xuICAgIGxvYy5pbnZlcnRlci5ib3R0b20gPSBsb2MuaW52ZXJ0ZXIueSArIHNpemUuaW52ZXJ0ZXIuaC8yO1xuICAgIGxvYy5pbnZlcnRlci50b3AgPSBsb2MuaW52ZXJ0ZXIueSAtIHNpemUuaW52ZXJ0ZXIuaC8yO1xuICAgIGxvYy5pbnZlcnRlci5ib3R0b21fcmlnaHQgPSB7XG4gICAgICAgIHg6IGxvYy5pbnZlcnRlci54ICsgc2l6ZS5pbnZlcnRlci53LzIsXG4gICAgICAgIHk6IGxvYy5pbnZlcnRlci55ICsgc2l6ZS5pbnZlcnRlci5oLzIsXG4gICAgfTtcblxuICAgIC8vIGFycmF5XG4gICAgbG9jLmFycmF5ID0ge1xuICAgICAgICB4OiBsb2MuaW52ZXJ0ZXIueCAtIDIwMCxcbiAgICAgICAgdXBwZXI6IGxvYy5pbnZlcnRlci55IC0gMjAsXG4gICAgfTtcbiAgICAvL2xvYy5hcnJheS51cHBlciA9IGxvYy5hcnJheS55IC0gc2l6ZS5zdHJpbmcuaC8yO1xuICAgIGxvYy5hcnJheS5yaWdodCA9IGxvYy5hcnJheS54IC0gc2l6ZS5tb2R1bGUuZnJhbWUuaCozO1xuXG5cblxuXG4gICAgbG9jLkRDID0gbG9jLmFycmF5O1xuXG4gICAgLy8gREMgamJcbiAgICBzaXplLmpiX2JveCA9IHtcbiAgICAgICAgaDogMTUwLFxuICAgICAgICB3OiA4MCxcbiAgICB9O1xuICAgIGxvYy5qYl9ib3ggPSB7XG4gICAgICAgIHg6IDM1MCxcbiAgICAgICAgeTogNTUwLFxuICAgIH07XG5cbiAgICAvLyBEQyBkaWNvbmVjdFxuICAgIHNpemUuZGlzY2JveCA9IHtcbiAgICAgICAgdzogMTQwLFxuICAgICAgICBoOiA1MCxcbiAgICB9O1xuICAgIGxvYy5kaXNjYm94ID0ge1xuICAgICAgICB4OiBsb2MuaW52ZXJ0ZXIueCAtIHNpemUuaW52ZXJ0ZXIudy8yICsgc2l6ZS5kaXNjYm94LncvMixcbiAgICAgICAgeTogbG9jLmludmVydGVyLnkgKyBzaXplLmludmVydGVyLmgvMiArIHNpemUuZGlzY2JveC5oLzIgKyAxMCxcbiAgICB9O1xuXG4gICAgLy8gQUMgZGljb25lY3RcbiAgICBzaXplLkFDX2Rpc2MgPSB7IHc6IDgwLCBoOiAxMjUgfTtcblxuICAgIGxvYy5BQ19kaXNjID0ge1xuICAgICAgICB4OiBsb2MuaW52ZXJ0ZXIueCsyMDAsXG4gICAgICAgIHk6IGxvYy5pbnZlcnRlci55KzI1MFxuICAgIH07XG4gICAgbG9jLkFDX2Rpc2MuYm90dG9tID0gbG9jLkFDX2Rpc2MueSArIHNpemUuQUNfZGlzYy5oLzI7XG4gICAgbG9jLkFDX2Rpc2MudG9wID0gbG9jLkFDX2Rpc2MueSAtIHNpemUuQUNfZGlzYy5oLzI7XG4gICAgbG9jLkFDX2Rpc2MubGVmdCA9IGxvYy5BQ19kaXNjLnggLSBzaXplLkFDX2Rpc2Mudy8yO1xuICAgIGxvYy5BQ19kaXNjLnN3aXRjaF90b3AgPSBsb2MuQUNfZGlzYy50b3AgKyAxNTtcbiAgICBsb2MuQUNfZGlzYy5zd2l0Y2hfYm90dG9tID0gbG9jLkFDX2Rpc2Muc3dpdGNoX3RvcCArIDMwO1xuXG5cbiAgICAvLyBBQyBwYW5lbFxuXG4gICAgbG9jLkFDX2xvYWRjZW50ZXIgPSB7XG4gICAgICAgIHg6IGxvYy5pbnZlcnRlci54KzM1MCxcbiAgICAgICAgeTogbG9jLmludmVydGVyLnkrMTAwXG4gICAgfTtcbiAgICBzaXplLkFDX2xvYWRjZW50ZXIgPSB7IHc6IDEyNSwgaDogMzAwIH07XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIubGVmdCA9IGxvYy5BQ19sb2FkY2VudGVyLnggLSBzaXplLkFDX2xvYWRjZW50ZXIudy8yO1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLnRvcCA9IGxvYy5BQ19sb2FkY2VudGVyLnkgLSBzaXplLkFDX2xvYWRjZW50ZXIuaC8yO1xuXG5cbiAgICBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlciA9IHsgdzogMjAsIGg6IHNpemUudGVybWluYWxfZGlhbSwgfTtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5icmVha2VycyA9IHtcbiAgICAgICAgbGVmdDogbG9jLkFDX2xvYWRjZW50ZXIueCAtICggc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIudyAqIDEuMSApLFxuICAgIH07XG4gICAgc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzID0ge1xuICAgICAgICBudW06IDIwLFxuICAgICAgICBzcGFjaW5nOiBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci5oICsgMSxcbiAgICB9O1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnRvcCA9IGxvYy5BQ19sb2FkY2VudGVyLnRvcCArIHNpemUuQUNfbG9hZGNlbnRlci5oLzU7XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMuYm90dG9tID0gbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMudG9wICsgc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnNwYWNpbmcqc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLm51bTtcblxuXG4gICAgc2l6ZS5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIgPSB7IHc6NSwgaDo0MCB9O1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIgPSB7XG4gICAgICAgIHg6IGxvYy5BQ19sb2FkY2VudGVyLmxlZnQgKyAyMCxcbiAgICAgICAgeTogbG9jLkFDX2xvYWRjZW50ZXIueSArIHNpemUuQUNfbG9hZGNlbnRlci5oKjAuM1xuICAgIH07XG5cbiAgICBzaXplLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyID0geyB3OjQwLCBoOjUgfTtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIgPSB7XG4gICAgICAgIHg6IGxvYy5BQ19sb2FkY2VudGVyLnggKyAxMCxcbiAgICAgICAgeTogbG9jLkFDX2xvYWRjZW50ZXIueSArIHNpemUuQUNfbG9hZGNlbnRlci5oKjAuNDVcbiAgICB9O1xuXG4gICAgbG9jLkFDX2NvbmR1aXQgPSB7XG4gICAgICAgIHk6IGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLmJvdHRvbSAtIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5zcGFjaW5nLzIsXG4gICAgfTtcblxuXG4gICAgLy8gd2lyZSB0YWJsZVxuICAgIGxvYy53aXJlX3RhYmxlID0ge1xuICAgICAgICB4OiBzaXplLmRyYXdpbmcudyAtIHNpemUuZHJhd2luZy50aXRsZWJveCAtIHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nKjMgLSAzMjUsXG4gICAgICAgIHk6IHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nKjMsXG4gICAgfTtcblxuICAgIC8vIHZvbHRhZ2UgZHJvcCB0YWJsZVxuICAgIHNpemUudm9sdF9kcm9wX3RhYmxlID0ge307XG4gICAgc2l6ZS52b2x0X2Ryb3BfdGFibGUudyA9IDE1MDtcbiAgICBzaXplLnZvbHRfZHJvcF90YWJsZS5oID0gMTAwO1xuICAgIGxvYy52b2x0X2Ryb3BfdGFibGUgPSB7fTtcbiAgICBsb2Mudm9sdF9kcm9wX3RhYmxlLnggPSBzaXplLmRyYXdpbmcudyAtIHNpemUudm9sdF9kcm9wX3RhYmxlLncvMiAtIDkwO1xuICAgIGxvYy52b2x0X2Ryb3BfdGFibGUueSA9IHNpemUuZHJhd2luZy5oIC0gc2l6ZS52b2x0X2Ryb3BfdGFibGUuaC8yIC0gMzA7XG5cblxuICAgIC8vIHZvbHRhZ2UgZHJvcCB0YWJsZVxuICAgIHNpemUuZ2VuZXJhbF9ub3RlcyA9IHt9O1xuICAgIHNpemUuZ2VuZXJhbF9ub3Rlcy53ID0gMTUwO1xuICAgIHNpemUuZ2VuZXJhbF9ub3Rlcy5oID0gMTAwO1xuICAgIGxvYy5nZW5lcmFsX25vdGVzID0ge307XG4gICAgbG9jLmdlbmVyYWxfbm90ZXMueCA9IHNpemUuZ2VuZXJhbF9ub3Rlcy53LzIgKyAzMDtcbiAgICBsb2MuZ2VuZXJhbF9ub3Rlcy55ID0gc2l6ZS5nZW5lcmFsX25vdGVzLmgvMiArIDMwO1xuXG5cblxuXG4gICAgc2V0dGluZ3MucGFnZXMgPSB7fTtcbiAgICBzZXR0aW5ncy5wYWdlcy5sZXR0ZXIgPSB7XG4gICAgICAgIHVuaXRzOiAnaW5jaGVzJyxcbiAgICAgICAgdzogMTEuMCxcbiAgICAgICAgaDogOC41LFxuICAgIH07XG4gICAgc2V0dGluZ3MucGFnZSA9IHNldHRpbmdzLnBhZ2VzLmxldHRlcjtcblxuICAgIHNldHRpbmdzLnBhZ2VzLlBERiA9IHtcbiAgICAgICAgdzogc2V0dGluZ3MucGFnZS53ICogNzIsXG4gICAgICAgIGg6IHNldHRpbmdzLnBhZ2UuaCAqIDcyLFxuICAgIH07XG5cbiAgICBzZXR0aW5ncy5wYWdlcy5QREYuc2NhbGUgPSB7XG4gICAgICAgIHg6IHNldHRpbmdzLnBhZ2VzLlBERi53IC8gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcudyxcbiAgICAgICAgeTogc2V0dGluZ3MucGFnZXMuUERGLmggLyBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy5oLFxuICAgIH07XG5cbiAgICBpZiggc2V0dGluZ3MucGFnZXMuUERGLnNjYWxlLnggPCBzZXR0aW5ncy5wYWdlcy5QREYuc2NhbGUueSApIHtcbiAgICAgICAgc2V0dGluZ3MucGFnZS5zY2FsZSA9IHNldHRpbmdzLnBhZ2VzLlBERi5zY2FsZS54O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNldHRpbmdzLnBhZ2Uuc2NhbGUgPSBzZXR0aW5ncy5wYWdlcy5QREYuc2NhbGUueTtcbiAgICB9XG5cblxuICAgIGxvYy5wcmV2aWV3ID0gbG9jLnByZXZpZXcgfHwge307XG4gICAgbG9jLnByZXZpZXcuYXJyYXkgPSBsb2MucHJldmlldy5hcnJheSA9IHt9O1xuICAgIGxvYy5wcmV2aWV3LmFycmF5LnRvcCA9IDEwMDtcbiAgICBsb2MucHJldmlldy5hcnJheS5sZWZ0ID0gNTA7XG5cbiAgICBsb2MucHJldmlldy5EQyA9IGxvYy5wcmV2aWV3LkRDID0ge307XG4gICAgbG9jLnByZXZpZXcuaW52ZXJ0ZXIgPSBsb2MucHJldmlldy5pbnZlcnRlciA9IHt9O1xuICAgIGxvYy5wcmV2aWV3LkFDID0gbG9jLnByZXZpZXcuQUMgPSB7fTtcblxuICAgIHNpemUucHJldmlldyA9IHNpemUucHJldmlldyB8fCB7fTtcbiAgICBzaXplLnByZXZpZXcubW9kdWxlID0ge1xuICAgICAgICB3OiAxNSxcbiAgICAgICAgaDogMjUsXG4gICAgfTtcbiAgICBzaXplLnByZXZpZXcuREMgPSB7XG4gICAgICAgIHc6IDMwLFxuICAgICAgICBoOiA1MCxcbiAgICB9O1xuICAgIHNpemUucHJldmlldy5pbnZlcnRlciA9IHtcbiAgICAgICAgdzogMTUwLFxuICAgICAgICBoOiA3NSxcbiAgICB9O1xuICAgIHNpemUucHJldmlldy5BQyA9IHtcbiAgICAgICAgdzogMzAsXG4gICAgICAgIGg6IDUwLFxuICAgIH07XG4gICAgc2l6ZS5wcmV2aWV3LmxvYWRjZW50ZXIgPSB7XG4gICAgICAgIHc6IDUwLFxuICAgICAgICBoOiAxMDAsXG4gICAgfTtcblxuXG5cbiAgcmV0dXJuIHNldHRpbmdzO1xuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBzZXR0aW5nc19kcmF3aW5nO1xuIiwiLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnblxuaWYgKCFPYmplY3QuYXNzaWduKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPYmplY3QsIFwiYXNzaWduXCIsIHtcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgdmFsdWU6IGZ1bmN0aW9uKHRhcmdldCwgZmlyc3RTb3VyY2UpIHtcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PT0gbnVsbClcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjb252ZXJ0IGZpcnN0IGFyZ3VtZW50IHRvIG9iamVjdFwiKTtcbiAgICAgIHZhciB0byA9IE9iamVjdCh0YXJnZXQpO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5leHRTb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGlmIChuZXh0U291cmNlID09PSB1bmRlZmluZWQgfHwgbmV4dFNvdXJjZSA9PT0gbnVsbCkgY29udGludWU7XG4gICAgICAgIHZhciBrZXlzQXJyYXkgPSBPYmplY3Qua2V5cyhPYmplY3QobmV4dFNvdXJjZSkpO1xuICAgICAgICBmb3IgKHZhciBuZXh0SW5kZXggPSAwLCBsZW4gPSBrZXlzQXJyYXkubGVuZ3RoOyBuZXh0SW5kZXggPCBsZW47IG5leHRJbmRleCsrKSB7XG4gICAgICAgICAgdmFyIG5leHRLZXkgPSBrZXlzQXJyYXlbbmV4dEluZGV4XTtcbiAgICAgICAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobmV4dFNvdXJjZSwgbmV4dEtleSk7XG4gICAgICAgICAgaWYgKGRlc2MgIT09IHVuZGVmaW5lZCAmJiBkZXNjLmVudW1lcmFibGUpIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRvO1xuICAgIH1cbiAgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vXG4vLyBmb250c1xuXG52YXIgZm9udHMgPSB7fTtcblxuZm9udHNbJ3NpZ25zJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICA1LFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ21pZGRsZScsXG59O1xuZm9udHNbJ2xhYmVsJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAxMixcbiAgICAndGV4dC1hbmNob3InOiAgICdtaWRkbGUnLFxufTtcbmZvbnRzWyd0aXRsZTEnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDE0LFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ2xlZnQnLFxufTtcbmZvbnRzWyd0aXRsZTInXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDEyLFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ2xlZnQnLFxufTtcbmZvbnRzWyd0aXRsZTMnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDEwLFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ2xlZnQnLFxufTtcbmZvbnRzWydwYWdlJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAyMCxcbiAgICAndGV4dC1hbmNob3InOiAgICdtaWRkbGUnLFxufTtcbmZvbnRzWyd0YWJsZSddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdzZXJpZicsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICA4LFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ21pZGRsZScsXG59O1xuZm9udHNbJ3RhYmxlX2xlZnQnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnc2VyaWYnLFxuICAgICdmb250LXNpemUnOiAgICAgOCxcbiAgICAndGV4dC1hbmNob3InOiAgICdsZWZ0Jyxcbn07XG5mb250c1sndGFibGVfbGFyZ2VfbGVmdCddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTQsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbGVmdCcsXG59O1xuZm9udHNbJ3RhYmxlX2xhcmdlJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAxNCxcbiAgICAndGV4dC1hbmNob3InOiAgICdtaWRkbGUnLFxufTtcbmZvbnRzWydwcm9qZWN0IHRpdGxlJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAxNixcbiAgICAndGV4dC1hbmNob3InOiAgICdtaWRkbGUnLFxufTtcbmZvbnRzWydwcmV2aWV3IHRleHQnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJyAgOiAyMCxcbiAgICAndGV4dC1hbmNob3InOiAnbWlkZGxlJyxcbn07XG5mb250c1snZGltZW50aW9uJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZScgIDogMjAsXG4gICAgJ3RleHQtYW5jaG9yJzogJ21pZGRsZScsXG59O1xuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gZm9udHM7XG4iLCIvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduXG5pZiAoIU9iamVjdC5hc3NpZ24pIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdCwgXCJhc3NpZ25cIiwge1xuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogZnVuY3Rpb24odGFyZ2V0LCBmaXJzdFNvdXJjZSkge1xuICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQgfHwgdGFyZ2V0ID09PSBudWxsKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNvbnZlcnQgZmlyc3QgYXJndW1lbnQgdG8gb2JqZWN0XCIpO1xuICAgICAgdmFyIHRvID0gT2JqZWN0KHRhcmdldCk7XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbmV4dFNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaWYgKG5leHRTb3VyY2UgPT09IHVuZGVmaW5lZCB8fCBuZXh0U291cmNlID09PSBudWxsKSBjb250aW51ZTtcbiAgICAgICAgdmFyIGtleXNBcnJheSA9IE9iamVjdC5rZXlzKE9iamVjdChuZXh0U291cmNlKSk7XG4gICAgICAgIGZvciAodmFyIG5leHRJbmRleCA9IDAsIGxlbiA9IGtleXNBcnJheS5sZW5ndGg7IG5leHRJbmRleCA8IGxlbjsgbmV4dEluZGV4KyspIHtcbiAgICAgICAgICB2YXIgbmV4dEtleSA9IGtleXNBcnJheVtuZXh0SW5kZXhdO1xuICAgICAgICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihuZXh0U291cmNlLCBuZXh0S2V5KTtcbiAgICAgICAgICBpZiAoZGVzYyAhPT0gdW5kZWZpbmVkICYmIGRlc2MuZW51bWVyYWJsZSkgdG9bbmV4dEtleV0gPSBuZXh0U291cmNlW25leHRLZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdG87XG4gICAgfVxuICB9KTtcbn1cblxuXG52YXIgbGF5ZXJfYXR0ciA9IHt9O1xuXG5sYXllcl9hdHRyLmJhc2UgPSB7XG4gICAgJ2ZpbGwnOiAnbm9uZScsXG4gICAgJ3N0cm9rZSc6JyMwMDAwMDAnLFxuICAgICdzdHJva2Utd2lkdGgnOicxcHgnLFxuICAgICdzdHJva2UtbGluZWNhcCc6J2J1dHQnLFxuICAgICdzdHJva2UtbGluZWpvaW4nOidtaXRlcicsXG4gICAgJ3N0cm9rZS1vcGFjaXR5JzoxLFxuXG59O1xubGF5ZXJfYXR0ci5ibG9jayA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuZnJhbWUgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLmZyYW1lLnN0cm9rZSA9ICcjMDAwMDQyJztcbmxheWVyX2F0dHIudGFibGUgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLnRhYmxlLnN0cm9rZSA9ICcjMDAwMDAwJztcblxubGF5ZXJfYXR0ci5EQ19pbnRlcm1vZHVsZSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpLHtcbiAgICBzdHJva2U6ICcjYmViZWJlJyxcbiAgICBcInN0cm9rZS1kYXNoYXJyYXlcIjogXCIxLCAxXCIsXG5cblxufSk7XG5cbmxheWVyX2F0dHIuRENfcG9zID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5EQ19wb3Muc3Ryb2tlID0gJyNmZjAwMDAnO1xubGF5ZXJfYXR0ci5EQ19uZWcgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkRDX25lZy5zdHJva2UgPSAnIzAwMDAwMCc7XG5sYXllcl9hdHRyLkRDX2dyb3VuZCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuRENfZ3JvdW5kLnN0cm9rZSA9ICcjMDA2NjAwJztcbmxheWVyX2F0dHIubW9kdWxlID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5ib3ggPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5cblxuXG5sYXllcl9hdHRyLnRleHQgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLnRleHQuc3Ryb2tlID0gJyMwMDAwZmYnO1xubGF5ZXJfYXR0ci50ZXJtaW5hbCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuYm9yZGVyID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xuXG5sYXllcl9hdHRyLkFDX2dyb3VuZCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuQUNfZ3JvdW5kLnN0cm9rZSA9ICcjMDA5OTAwJztcbmxheWVyX2F0dHIuQUNfbmV1dHJhbCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuQUNfbmV1dHJhbC5zdHJva2UgPSAnIzk5OTc5Nyc7XG5sYXllcl9hdHRyLkFDX0wxID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5BQ19MMS5zdHJva2UgPSAnIzAwMDAwMCc7XG5sYXllcl9hdHRyLkFDX0wyID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5BQ19MMi5zdHJva2UgPSAnI0ZGMDAwMCc7XG5sYXllcl9hdHRyLkFDX0wzID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5BQ19MMy5zdHJva2UgPSAnIzAwMDBGRic7XG5cblxubGF5ZXJfYXR0ci5wcmV2aWV3ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSkse1xuICAgICdzdHJva2Utd2lkdGgnOiAnMicsXG59KTtcblxubGF5ZXJfYXR0ci5wcmV2aWV3X21vZHVsZSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnI2ZmYjMwMCcsXG4gICAgc3Ryb2tlOiAnbm9uZScsXG59KTtcblxubGF5ZXJfYXR0ci5wcmV2aWV3X2FycmF5ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIHN0cm9rZTogJyNmZjVkMDAnLFxufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19EQyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6ICcjYjA5MmM0Jyxcbn0pO1xubGF5ZXJfYXR0ci5wcmV2aWV3X0RDX2JveCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnI2IwOTJjNCcsXG4gICAgc3Ryb2tlOiAnbm9uZScsXG59KTtcblxubGF5ZXJfYXR0ci5wcmV2aWV3X2ludmVydGVyID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIHN0cm9rZTonIzg2Yzk3NCcsXG59KTtcbmxheWVyX2F0dHIucHJldmlld19pbnZlcnRlcl9ib3ggPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyM4NmM5NzQnLFxuICAgIHN0cm9rZTogJ25vbmUnLFxufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19BQyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6ICcjODE4OGExJyxcbn0pO1xuXG5sYXllcl9hdHRyLnByZXZpZXdfQUNfYm94ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjODE4OGExJyxcbiAgICBzdHJva2U6ICdub25lJyxcbn0pO1xuXG5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6ICcjMDAwMDAwJyxcbn0pO1xubGF5ZXJfYXR0ci5wcmV2aWV3X3N0cnVjdHVyYWxfZG90ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIHN0cm9rZTogJyMwMDAwMDAnLFxuICAgIFwic3Ryb2tlLWRhc2hhcnJheVwiOiBcIjUsIDVcIlxufSk7XG5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3Vuc2VsZWN0ZWQgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyNlMWUxZTEnLFxuICAgIHN0cm9rZTogJ25vbmUnXG59KTtcbmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX3BvbHlfc2VsZWN0ZWQgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyNmZmU3Y2InLFxuICAgIHN0cm9rZTogJ25vbmUnXG59KTtcbmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX3BvbHlfc2VsZWN0ZWRfZnJhbWVkID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjZmZlN2NiJyxcbiAgICBzdHJva2U6ICcjMDAwMDAwJ1xufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnI2ZmZmZmZicsXG4gICAgc3Ryb2tlOiAnbm9uZSdcbn0pO1xubGF5ZXJfYXR0ci5wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjODM5N2U4JyxcbiAgICBzdHJva2U6ICcjZGZmYWZmJ1xufSk7XG5cbmxheWVyX2F0dHIubm9ydGhfYXJyb3cgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgc3Ryb2tlOiAnIzAwMDAwMCcsXG4gICAgJ3N0cm9rZS13aWR0aCc6IDEsXG4gICAgJ3N0cm9rZS1saW5lY2FwJzogXCJyb3VuZFwiLFxuICAgICdzdHJva2UtbGluZWpvaW4nOiBcInJvdW5kXCIsXG59KTtcbmxheWVyX2F0dHIubm9ydGhfbGV0dGVyID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIHN0cm9rZTogJyM5NDk0OTQnLFxuICAgICdzdHJva2Utd2lkdGgnOiA1LFxuICAgICdzdHJva2UtbGluZWNhcCc6IFwicm91bmRcIixcbiAgICAnc3Ryb2tlLWxpbmVqb2luJzogXCJyb3VuZFwiLFxufSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBsYXllcl9hdHRyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZiA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zJyk7XG4vL3ZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG4vL3ZhciBkaXNwbGF5X3N2ZyA9IHJlcXVpcmUoJy4vZGlzcGxheV9zdmcnKTtcblxudmFyIG9iamVjdF9kZWZpbmVkID0gZi5vYmplY3RfZGVmaW5lZDtcblxudmFyIHNldHRpbmdzX3VwZGF0ZSA9IGZ1bmN0aW9uKHNldHRpbmdzKSB7XG5cbiAgICAvL2NvbnNvbGUubG9nKCctLS1zZXR0aW5ncy0tLScsIHNldHRpbmdzKTtcbiAgICB2YXIgY29uZmlnX29wdGlvbnMgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucztcbiAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxvYztcbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgc3RhdGUgPSBzZXR0aW5ncy5zdGF0ZTtcblxuICAgIHZhciBpbnB1dHMgPSBzZXR0aW5ncy5pbnB1dHM7XG5cblxuXG5cblxuICAgIGlmKCBzdGF0ZS5kYXRhYmFzZV9sb2FkZWQgKXtcbiAgICAgICAgaW5wdXRzLkRDID0gc2V0dGluZ3MuaW5wdXRzLkRDIHx8IHt9O1xuICAgICAgICBpbnB1dHMuREMud2lyZV9zaXplID0gc2V0dGluZ3MuaW5wdXRzLkRDLndpcmVfc2l6ZSB8fCB7fTtcbiAgICAgICAgaW5wdXRzLkRDLndpcmVfc2l6ZS5vcHRpb25zID0gaW5wdXRzLkRDLndpcmVfc2l6ZS5vcHRpb25zIHx8IGYub2JqX25hbWVzKHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLk5FQ190YWJsZXNbJ0NoIDkgVGFibGUgOCBDb25kdWN0b3IgUHJvcGVydGllcyddKTtcblxuXG4gICAgfVxuXG4gICAgLy92YXIgc2hvd19kZWZhdWx0cyA9IGZhbHNlO1xuICAgIC8vLypcbiAgICBpZiggc3RhdGUubW9kZSA9PT0gJ2Rldicpe1xuICAgICAgICAvL3Nob3dfZGVmYXVsdHMgPSB0cnVlO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdEZXYgbW9kZSAtIGRlZmF1bHRzIG9uJyk7XG5cbiAgICAgICAgc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzID0gc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzIHx8IDQ7XG4gICAgICAgIHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgPSBzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nIHx8IDY7XG4gICAgICAgIHN5c3RlbS5EQy5ob21lX3J1bl9sZW5ndGggPSBzeXN0ZW0uREMuaG9tZV9ydW5fbGVuZ3RoIHx8IDUwO1xuXG4gICAgICAgIHN5c3RlbS5yb29mLndpZHRoICA9IHN5c3RlbS5yb29mLndpZHRoIHx8IDYwO1xuICAgICAgICBzeXN0ZW0ucm9vZi5sZW5ndGggPSBzeXN0ZW0ucm9vZi5sZW5ndGggfHwgMjU7XG4gICAgICAgIHN5c3RlbS5yb29mLnNsb3BlICA9IHN5c3RlbS5yb29mLnNsb3BlIHx8IFwiNjoxMlwiO1xuICAgICAgICBzeXN0ZW0ucm9vZi50eXBlICAgPSBzeXN0ZW0ucm9vZi50eXBlIHx8IFwiR2FibGVcIjtcblxuICAgICAgICBzeXN0ZW0uaW52ZXJ0ZXIubG9jYXRpb24gPSBzeXN0ZW0uaW52ZXJ0ZXIubG9jYXRpb24gIHx8IFwiSW5zaWRlXCI7XG5cbiAgICAgICAgc3lzdGVtLm1vZHVsZS5vcmllbnRhdGlvbiA9IHN5c3RlbS5tb2R1bGUub3JpZW50YXRpb24gfHwgXCJQb3J0cmFpdFwiO1xuXG4gICAgICAgIHN5c3RlbS5sb2NhdGlvbi5hZGRyZXNzID0gc3lzdGVtLmxvY2F0aW9uLmFkZHJlc3MgfHwgJzE2NzkgQ2xlYXJsYWtlIFJvYWQnO1xuICAgICAgICBzeXN0ZW0ubG9jYXRpb24uY2l0eSAgICA9IHN5c3RlbS5sb2NhdGlvbi5jaXR5IHx8ICdDb2NvYSc7XG4gICAgICAgIHN5c3RlbS5sb2NhdGlvbi56aXAgICAgID0gc3lzdGVtLmxvY2F0aW9uLnppcCB8fCAnMzI5MjInO1xuICAgICAgICBzeXN0ZW0ubG9jYXRpb24uY291bnR5ICAgPSBzeXN0ZW0ubG9jYXRpb24uY291bnR5IHx8ICdCcmV2YXJkJztcblxuXG4gICAgICAgIGlmKCBzdGF0ZS5kYXRhYmFzZV9sb2FkZWQgKXtcbiAgICAgICAgICAgIHN5c3RlbS5pbnZlcnRlci5tYWtlID0gc3lzdGVtLmludmVydGVyLm1ha2UgfHxcbiAgICAgICAgICAgICAgICAnU01BJztcbiAgICAgICAgICAgIHN5c3RlbS5pbnZlcnRlci5tb2RlbCA9IHN5c3RlbS5pbnZlcnRlci5tb2RlbCB8fFxuICAgICAgICAgICAgICAgICdTSTMwMDAnO1xuXG4gICAgICAgICAgICBzeXN0ZW0ubW9kdWxlLm1ha2UgPSBzeXN0ZW0ubW9kdWxlLm1ha2UgfHxcbiAgICAgICAgICAgICAgICBmLm9ial9uYW1lcyggc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzIClbMF07XG4gICAgICAgICAgICAvL2lmKCBzeXN0ZW0ubW9kdWxlLm1ha2UpIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZU1vZGVsQXJyYXkgPSBrLm9iaklkQXJyYXkoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlc1tzeXN0ZW0ubW9kdWxlLm1ha2VdKTtcbiAgICAgICAgICAgIHN5c3RlbS5tb2R1bGUubW9kZWwgPSBzeXN0ZW0ubW9kdWxlLm1vZGVsIHx8XG4gICAgICAgICAgICAgICAgZi5vYmpfbmFtZXMoIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tzeXN0ZW0ubW9kdWxlLm1ha2VdIClbMF07XG5cblxuICAgICAgICAgICAgc3lzdGVtLm1vZHVsZS5tb2RlbCA9IHN5c3RlbS5tb2R1bGUubW9kZWwgfHxcbiAgICAgICAgICAgICAgICBmLm9ial9uYW1lcyggc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzW3N5c3RlbS5tb2R1bGUubWFrZV0gKVswXTtcblxuICAgICAgICAgICAgc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXMgPSBzeXN0ZW0uQUMubG9hZGNlbnRlcl90eXBlcyB8fFxuICAgICAgICAgICAgLy8gICAgZi5vYmpfbmFtZXMoaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXMpWzBdO1xuICAgICAgICAgICAgICAgICc0ODAvMjc3Vic7XG5cblxuICAgICAgICAgICAgc3lzdGVtLkFDLnR5cGUgPSBzeXN0ZW0uQUMudHlwZSB8fCAnNDgwViBXeWUnO1xuICAgICAgICAgICAgLy9zeXN0ZW0uQUMudHlwZSA9IHN5c3RlbS5BQy50eXBlIHx8XG4gICAgICAgICAgICAvLyAgICBzeXN0ZW0uQUMubG9hZGNlbnRlcl90eXBlc1tzeXN0ZW0uQUMubG9hZGNlbnRlcl90eXBlc11bMF07XG5cbiAgICAgICAgICAgIHN5c3RlbS5BQy5kaXN0YW5jZV90b19sb2FkY2VudGVyID0gc3lzdGVtLkFDLmRpc3RhbmNlX3RvX2xvYWRjZW50ZXIgfHxcbiAgICAgICAgICAgICAgICA1MDtcblxuXG4gICAgICAgICAgICBzeXN0ZW0uREMud2lyZV9zaXplID0gaW5wdXRzLkRDLndpcmVfc2l6ZS5vcHRpb25zWzNdO1xuICAgICAgICAgICAgLypcblxuICAgICAgICAgICAgc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJNYWtlQXJyYXkgPSBrLm9iaklkQXJyYXkoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzKTtcbiAgICAgICAgICAgIHN5c3RlbS5pbnZlcnRlci5tYWtlID0gc3lzdGVtLmludmVydGVyLm1ha2UgfHwgT2JqZWN0LmtleXMoIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVycyApWzBdO1xuICAgICAgICAgICAgc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJNb2RlbEFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyc1tzeXN0ZW0uaW52ZXJ0ZXIubWFrZV0pO1xuXG4gICAgICAgICAgICBzeXN0ZW0uQUNfbG9hZGNlbnRlcl90eXBlID0gc3lzdGVtLkFDX2xvYWRjZW50ZXJfdHlwZSB8fCBjb25maWdfb3B0aW9ucy5BQ19sb2FkY2VudGVyX3R5cGVfb3B0aW9uc1swXTtcbiAgICAgICAgICAgIC8vKi9cblxuXG4gICAgICAgICAgICBzeXN0ZW0uYXR0YWNobWVudF9zeXN0ZW0ubWFrZSA9IHN5c3RlbS5hdHRhY2htZW50X3N5c3RlbS5tYWtlIHx8XG4gICAgICAgICAgICAgICAgaW5wdXRzLmF0dGFjaG1lbnRfc3lzdGVtLm1ha2Uub3B0aW9uc1swXTtcbiAgICAgICAgICAgIHN5c3RlbS5hdHRhY2htZW50X3N5c3RlbS5tb2RlbCA9IHN5c3RlbS5hdHRhY2htZW50X3N5c3RlbS5tb2RlbCB8fFxuICAgICAgICAgICAgICAgIGlucHV0cy5hdHRhY2htZW50X3N5c3RlbS5tb2RlbC5vcHRpb25zWzBdO1xuXG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8qL1xuXG5cbiAgICAvL2NvbnNvbGUubG9nKFwic2V0dGluZ3NfdXBkYXRlXCIpO1xuICAgIC8vY29uc29sZS5sb2coc3lzdGVtLm1vZHVsZS5tYWtlKTtcblxuICAgIGlucHV0cy5tb2R1bGUubWFrZS5vcHRpb25zID0gZi5vYmpfbmFtZXMoc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzKTtcbiAgICBpZiggc3lzdGVtLm1vZHVsZS5tYWtlICkge1xuICAgICAgICBpbnB1dHMubW9kdWxlLm1vZGVsLm9wdGlvbnMgID0gZi5vYmpfbmFtZXMoIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tzeXN0ZW0ubW9kdWxlLm1ha2VdICk7XG4gICAgfVxuXG4gICAgaWYoIHN5c3RlbS5tb2R1bGUubW9kZWwgKSB7XG4gICAgICAgIHZhciBzcGVjcyA9IHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tzeXN0ZW0ubW9kdWxlLm1ha2VdW3N5c3RlbS5tb2R1bGUubW9kZWxdO1xuICAgICAgICBmb3IoIHZhciBzcGVjX25hbWUgaW4gc3BlY3MgKXtcbiAgICAgICAgICAgIGlmKCBzcGVjX25hbWUgIT09ICdtb2R1bGVfaWQnICl7XG4gICAgICAgICAgICAgICAgc3lzdGVtLm1vZHVsZVtzcGVjX25hbWVdID0gc3BlY3Nbc3BlY19uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL3N5c3RlbS5tb2R1bGUuc3BlY3MgPSBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbc3lzdGVtLm1vZHVsZS5tYWtlXVtzeXN0ZW0ubW9kdWxlLm1vZGVsXTtcbiAgICB9XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ2FycmF5JykgJiYgZi5zZWN0aW9uX2RlZmluZWQoJ21vZHVsZScpICl7XG4gICAgICAgIHN5c3RlbS5hcnJheSA9IHN5c3RlbS5hcnJheSB8fCB7fTtcbiAgICAgICAgc3lzdGVtLmFycmF5LmlzYyA9IHN5c3RlbS5tb2R1bGUuaXNjICogc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzO1xuICAgICAgICBzeXN0ZW0uYXJyYXkudm9jID0gc3lzdGVtLm1vZHVsZS52b2MgKiBzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nO1xuICAgICAgICBzeXN0ZW0uYXJyYXkuaW1wID0gc3lzdGVtLm1vZHVsZS5pbXAgKiBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3M7XG4gICAgICAgIHN5c3RlbS5hcnJheS52bXAgPSBzeXN0ZW0ubW9kdWxlLnZtcCAqIHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmc7XG4gICAgICAgIHN5c3RlbS5hcnJheS5wbXAgPSBzeXN0ZW0uYXJyYXkudm1wICAqIHN5c3RlbS5hcnJheS5pbXA7XG5cbiAgICAgICAgc3lzdGVtLmFycmF5Lm51bWJlcl9vZl9tb2R1bGVzID0gc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZyAqIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncztcblxuXG4gICAgfVxuXG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ0RDJykgKXtcblxuICAgICAgICBzeXN0ZW0uREMud2lyZV9zaXplID0gXCItVW5kZWZpbmVkLVwiO1xuXG4gICAgfVxuXG4gICAgaW5wdXRzLmludmVydGVyLm1ha2Uub3B0aW9ucyA9IGYub2JqX25hbWVzKHNldHRpbmdzLmNvbXBvbmVudHMuaW52ZXJ0ZXJzKTtcbiAgICBpZiggc3lzdGVtLmludmVydGVyLm1ha2UgKSB7XG4gICAgICAgIGlucHV0cy5pbnZlcnRlci5tb2RlbC5vcHRpb25zID0gZi5vYmpfbmFtZXMoIHNldHRpbmdzLmNvbXBvbmVudHMuaW52ZXJ0ZXJzW3N5c3RlbS5pbnZlcnRlci5tYWtlXSApO1xuICAgIH1cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ2ludmVydGVyJykgKXtcblxuICAgIH1cblxuICAgIC8vaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZSA9IHNldHRpbmdzLmYub2JqX25hbWVzKGlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzKTtcbiAgICBpZiggc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXMgKSB7XG4gICAgICAgIHZhciBsb2FkY2VudGVyX3R5cGUgPSBzeXN0ZW0uQUMubG9hZGNlbnRlcl90eXBlcztcbiAgICAgICAgdmFyIEFDX29wdGlvbnMgPSBpbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlc1tsb2FkY2VudGVyX3R5cGVdO1xuICAgICAgICBpbnB1dHMuQUMudHlwZS5vcHRpb25zID0gQUNfb3B0aW9ucztcbiAgICAgICAgLy9pbi5vcHQuQUMudHlwZXNbbG9hZGNlbnRlcl90eXBlXTtcblxuICAgICAgICAvL2lucHV0cy5BQ1sndHlwZSddID0gZi5vYmpfbmFtZXMoIHNldHRpbmdzLmluLm9wdC5BQy50eXBlICk7XG4gICAgfVxuICAgIGlmKCBzeXN0ZW0uQUMudHlwZSApIHtcbiAgICAgICAgc3lzdGVtLkFDLmNvbmR1Y3RvcnMgPSBzZXR0aW5ncy5pbi5vcHQuQUMudHlwZXNbc3lzdGVtLkFDLnR5cGVdO1xuICAgICAgICBzeXN0ZW0uQUMubnVtX2NvbmR1Y3RvcnMgPSBzeXN0ZW0uQUMuY29uZHVjdG9ycy5sZW5ndGg7XG5cbiAgICB9XG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdBQycpICl7XG5cbiAgICAgICAgc3lzdGVtLkFDLndpcmVfc2l6ZSA9IFwiLVVuZGVmaW5lZC1cIjtcbiAgICB9XG5cbiAgICBzaXplLndpcmVfb2Zmc2V0Lm1heCA9IHNpemUud2lyZV9vZmZzZXQubWluICsgc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzICogc2l6ZS53aXJlX29mZnNldC5iYXNlO1xuICAgIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kID0gc2l6ZS53aXJlX29mZnNldC5tYXggKyBzaXplLndpcmVfb2Zmc2V0LmJhc2UqMTtcbiAgICBsb2MuYXJyYXkubGVmdCA9IGxvYy5hcnJheS5yaWdodCAtICggc2l6ZS5zdHJpbmcudyAqIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyApIC0gKCBzaXplLm1vZHVsZS5mcmFtZS53KjMvNCApIDtcblxuXG5cblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnbG9jYXRpb24nKSApe1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdhZGRyZXNzIHJlYWR5Jyk7XG4gICAgICAgIC8vZi5yZXF1ZXN0X2dlb2NvZGUoKTtcbiAgICAgICAgZy5wZXJtLmxvY2F0aW9uLm5ld19hZGRyZXNzID0gZmFsc2U7XG4gICAgICAgIGZvciggdmFyIG5hbWUgaW4gZy5zeXN0ZW0ubG9jYXRpb24gKXtcbiAgICAgICAgICAgIGlmKCBnLnN5c3RlbS5sb2NhdGlvbltuYW1lXSAhPT0gZy5wZXJtLmxvY2F0aW9uW25hbWVdKXtcbiAgICAgICAgICAgICAgICBnLnBlcm0ubG9jYXRpb24ubmV3X2FkZHJlc3MgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZy5wZXJtLmxvY2F0aW9uW25hbWVdID0gZy5zeXN0ZW0ubG9jYXRpb25bbmFtZV07XG4gICAgICAgIH1cblxuICAgIH1cblxuXG5cblxufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gc2V0dGluZ3NfdXBkYXRlO1xuIiwiXG5cblxuZnVuY3Rpb24gc2V0dXBfd2VicGFnZSgpe1xuICAgIHZhciBzZXR0aW5ncyA9IGc7XG4gICAgdmFyIGYgPSBnLmY7XG5cbiAgICB2YXIgc3lzdGVtX2ZyYW1lX2lkID0gJ3N5c3RlbV9mcmFtZSc7XG4gICAgdmFyIHRpdGxlID0gJ1BWIGRyYXdpbmcgdGVzdCc7XG5cbiAgICBnLmYuc2V0dXBfYm9keSh0aXRsZSk7XG5cbiAgICB2YXIgcGFnZSA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAncGFnZScpLmFwcGVuZFRvKCQoZG9jdW1lbnQuYm9keSkpO1xuICAgIC8vcGFnZS5zdHlsZSgnd2lkdGgnLCAoc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcudysyMCkudG9TdHJpbmcoKSArICdweCcgKVxuXG4gICAgdmFyIHN5c3RlbV9mcmFtZSA9ICQoJzxkaXY+JykuYXR0cignaWQnLCBzeXN0ZW1fZnJhbWVfaWQpLmFwcGVuZFRvKHBhZ2UpO1xuXG5cbiAgICB2YXIgaGVhZGVyX2NvbnRhaW5lciA9ICQoJzxkaXY+JykuYXBwZW5kVG8oc3lzdGVtX2ZyYW1lKTtcbiAgICAkKCc8c3Bhbj4nKS5odG1sKCdQbGVhc2Ugc2VsZWN0IHlvdXIgc3lzdGVtIHNwZWMgYmVsb3cnKS5hdHRyKCdjbGFzcycsICdjYXRlZ29yeV90aXRsZScpLmFwcGVuZFRvKGhlYWRlcl9jb250YWluZXIpO1xuICAgICQoJzxzcGFuPicpLmh0bWwoJyB8ICcpLmFwcGVuZFRvKGhlYWRlcl9jb250YWluZXIpO1xuICAgIC8vJCgnPGlucHV0PicpLmF0dHIoJ3R5cGUnLCAnYnV0dG9uJykuYXR0cigndmFsdWUnLCAnY2xlYXIgc2VsZWN0aW9ucycpLmNsaWNrKHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQpLFxuICAgICQoJzxhPicpLmF0dHIoJ2hyZWYnLCAnamF2YXNjcmlwdDp3aW5kb3cubG9jYXRpb24ucmVsb2FkKCknKS5odG1sKCdjbGVhciBzZWxlY3Rpb25zJykuYXBwZW5kVG8oaGVhZGVyX2NvbnRhaW5lcik7XG5cblxuICAgIC8vIFN5c3RlbSBzZXR1cFxuICAgICQoJzxkaXY+JykuaHRtbCgnU3lzdGVtIFNldHVwJykuYXR0cignY2xhc3MnLCAnc2VjdGlvbl90aXRsZScpLmFwcGVuZFRvKHN5c3RlbV9mcmFtZSk7XG4gICAgdmFyIGNvbmZpZ19mcmFtZSA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAnY29uZmlnX2ZyYW1lJykuYXBwZW5kVG8oc3lzdGVtX2ZyYW1lKTtcblxuICAgIGcuZi5hZGRfc2VsZWN0b3JzKHNldHRpbmdzLCBjb25maWdfZnJhbWUpO1xuICAgIC8vY29uc29sZS5sb2coc2VjdGlvbl9zZWxlY3Rvcik7XG5cblxuXG4gICAgLy92YXIgbG9jYXRpb25fZHJhd2VyID0gJCgnI3NlY3Rpb25fbG9jYXRpb24nKS5jaGlsZHJlbignLmRyYXdlcicpLmNoaWxkcmVuKCcuZHJhd2VyX2NvbnRlbnQnKTtcbiAgICAvL2NvbnNvbGUubG9nKGxvY2F0aW9uX2RyYXdlcik7XG5cblxuICAgIHZhciBtYXBfZGl2ID0gJCgnPGRpdj4nKTtcbiAgICB2YXIgbWFwX2RyYXdlciA9IGYubWtfZHJhd2VyKCdtYXAnLG1hcF9kaXYpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLy5hcHBlbmRUbyhjb25maWdfZnJhbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLmluc2VydEFmdGVyKCAkKCcjc2VjdGlvbl9sb2NhdGlvbicpICk7XG4gICAgbWFwX2RyYXdlci5jaGlsZHJlbignLmRyYXdlcicpLmNoaWxkcmVuKCcuZHJhd2VyX2NvbnRlbnQnKS5zbGlkZVVwKCdmYXN0Jyk7XG5cblxuXG4gICAgdmFyIGxpc3RfZWxlbWVudCA9ICQoJzx1bD4nKS5hcHBlbmRUbyhtYXBfZGl2KTtcbiAgICAkKCc8bGk+JykuYXBwZW5kVG8obGlzdF9lbGVtZW50KS5hcHBlbmQoXG4gICAgICAgICQoJzxhPicpXG4gICAgICAgICAgICAudGV4dCgnV2luZCBab25lICcpXG4gICAgICAgICAgICAuYXR0cignaHJlZicsICdodHRwOi8vd2luZHNwZWVkLmF0Y291bmNpbC5vcmcvJylcbiAgICAgICAgICAgIC5hdHRyKCd0YXJnZXQnLCAnX2JsYW5rJylcbiAgICApO1xuICAgICQoJzxsaT4nKS5hcHBlbmRUbyhsaXN0X2VsZW1lbnQpLmFwcGVuZChcbiAgICAgICAgJCgnPGE+JylcbiAgICAgICAgICAgIC50ZXh0KCdDbGltYXRlIENvbmRpdGlvbnMnKVxuICAgICAgICAgICAgLmF0dHIoJ2hyZWYnLCAnaHR0cDovL3d3dy5zb2xhcmFiY3Mub3JnL2Fib3V0L3B1YmxpY2F0aW9ucy9yZXBvcnRzL2V4cGVkaXRlZC1wZXJtaXQvbWFwL2luZGV4Lmh0bWwnKVxuICAgICAgICAgICAgLmF0dHIoJ3RhcmdldCcsICdfYmxhbmsnKVxuICAgICk7XG5cblxuICAgIHZhciBnZW9jb2RlX2RpdiA9ICQoJzxkaXY+JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dlb2NvZGVfbGluZScpXG4gICAgICAgIC5hcHBlbmRUbyhtYXBfZGl2KTtcbiAgICAkKCc8YT4nKS5hcHBlbmRUbyhnZW9jb2RlX2RpdilcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dlb2NvZGVfYnV0dG9uJylcbiAgICAgICAgLnRleHQoJ0ZpbmQgbG9jYXRpb24gZnJvbSBhZGRyZXNzJylcbiAgICAgICAgLmF0dHIoJ2hyZWYnLCAnIycpXG4gICAgICAgIC5jbGljayhmLnJlcXVlc3RfZ2VvY29kZSk7XG4gICAgJCgnPHNwYW4+JykuYXBwZW5kVG8oZ2VvY29kZV9kaXYpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdnZW9jb2RlX2Rpc3BsYXknKVxuICAgICAgICAuYXR0cignaWQnLCdnZW9jb2RlX2Rpc3BsYXknKVxuICAgICAgICAudGV4dCgnJyk7XG5cbiAgICAkKCc8ZGl2PicpXG4gICAgICAgIC5hdHRyKCdpZCcsICdtYXBfcm9hZCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBfcm9hZCcpXG4gICAgICAgIC5hdHRyKCdzdHlsZScsICd3aWR0aDo0ODVweDtoZWlnaHQ6MzgwcHgnKVxuICAgICAgICAuYXBwZW5kVG8obWFwX2Rpdik7XG4gICAgJCgnPGRpdj4nKVxuICAgICAgICAuYXR0cignaWQnLCAnbWFwX3NhdCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBfc2F0JylcbiAgICAgICAgLmF0dHIoJ3N0eWxlJywgJ3dpZHRoOjQ4NXB4O2hlaWdodDozODBweCcpXG4gICAgICAgIC5hcHBlbmRUbyhtYXBfZGl2KTtcblxuXG4gICAgdmFyIGxhdF9mbF9jZW50ZXIgPSAyNy43NTtcbiAgICB2YXIgbG9uX2ZsX2NlbnRlciA9IC04NC4wO1xuXG4gICAgdmFyIGxhdCA9IDI4LjM4NzM5OTtcbiAgICB2YXIgbG9uID0gLTgwLjc1NzgzMztcbiAgICB2YXIgY29vciA9IFstODAuNzU3ODMzLCAyOC4zODczOTldO1xuXG5cbiAgICB2YXIgbWFwX3JvYWQgID0gZy5wZXJtLm1hcHMubWFwX3JvYWQgPSBMLm1hcCggJ21hcF9yb2FkJywge1xuICAgICAgICBjZW50ZXI6IFtsYXRfZmxfY2VudGVyLCBsb25fZmxfY2VudGVyXSxcbiAgICAgICAgem9vbTogNlxuICAgIH0pO1xuXG4gICAgTC50aWxlTGF5ZXIoICdodHRwOi8ve3N9Lm1xY2RuLmNvbS90aWxlcy8xLjAuMC9tYXAve3p9L3t4fS97eX0ucG5nJywge1xuICAgICAgICBhdHRyaWJ1dGlvbjogJyZjb3B5OyA8YSBocmVmPVwiaHR0cDovL29zbS5vcmcvY29weXJpZ2h0XCIgdGl0bGU9XCJPcGVuU3RyZWV0TWFwXCIgdGFyZ2V0PVwiX2JsYW5rXCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzIHwgVGlsZXMgQ291cnRlc3kgb2YgPGEgaHJlZj1cImh0dHA6Ly93d3cubWFwcXVlc3QuY29tL1wiIHRpdGxlPVwiTWFwUXVlc3RcIiB0YXJnZXQ9XCJfYmxhbmtcIj5NYXBRdWVzdDwvYT4gPGltZyBzcmM9XCJodHRwOi8vZGV2ZWxvcGVyLm1hcHF1ZXN0LmNvbS9jb250ZW50L29zbS9tcV9sb2dvLnBuZ1wiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiPicsXG4gICAgICAgIHN1YmRvbWFpbnM6IFsnb3RpbGUxJywnb3RpbGUyJywnb3RpbGUzJywnb3RpbGU0J11cbiAgICB9KS5hZGRUbyggbWFwX3JvYWQgKTtcblxuICAgIGcucGVybS5tYXBzLm1hcmtlcl9yb2FkID0gTC5tYXJrZXIoW2xhdCxsb25dKS5hZGRUbyhtYXBfcm9hZCk7XG5cbiAgICBtYXBfcm9hZC5vbignY2xpY2snLCBmLnNldF9jb29yZGluYXRlc19mcm9tX21hcCApO1xuXG5cblxuXG4gICAgdmFyIG1hcF9zYXQgPSBnLnBlcm0ubWFwcy5tYXBfc2F0ID0gTC5tYXAoICdtYXBfc2F0Jywge1xuICAgICAgICBjZW50ZXI6IFtsYXQsIGxvbl0sXG4gICAgICAgIHpvb206IDE2XG4gICAgfSk7XG4gICAgTC50aWxlTGF5ZXIoICdodHRwOi8ve3N9Lm1xY2RuLmNvbS90aWxlcy8xLjAuMC9zYXQve3p9L3t4fS97eX0ucG5nJywge1xuICAgICAgICBzdWJkb21haW5zOiBbJ290aWxlMScsJ290aWxlMicsJ290aWxlMycsJ290aWxlNCddXG4gICAgfSkuYWRkVG8oIG1hcF9zYXQgKTtcblxuICAgIGcucGVybS5tYXBzLm1hcmtlcl9zYXQgPSBMLm1hcmtlcihbbGF0LGxvbl0pLmFkZFRvKG1hcF9zYXQpO1xuXG4gICAgbWFwX3NhdC5vbignY2xpY2snLCBmLnNldF9jb29yZGluYXRlc19mcm9tX21hcCApO1xuXG5cblxuXG5cblxuICAgIHZhciBkcmF3aW5nX3ByZXZpZXcgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2RyYXdpbmdfZnJhbWVfcHJldmlldycpLmFwcGVuZFRvKHBhZ2UpO1xuICAgICQoJzxkaXY+JykuaHRtbCgnUHJldmlldycpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25fdGl0bGUnKS5hcHBlbmRUbyhkcmF3aW5nX3ByZXZpZXcpO1xuICAgICQoJzxkaXY+JykuYXR0cignaWQnLCAnZHJhd2luZ19wcmV2aWV3JykuYXR0cignY2xhc3MnLCAnZHJhd2luZycpLmNzcygnY2xlYXInLCAnYm90aCcpLmFwcGVuZFRvKGRyYXdpbmdfcHJldmlldyk7XG5cblxuXG5cblxuICAgIHZhciBkcmF3aW5nX3NlY3Rpb24gPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2RyYXdpbmdfZnJhbWUnKS5hcHBlbmRUbyhwYWdlKTtcbiAgICAvL2RyYXdpbmcuY3NzKCd3aWR0aCcsIChzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy53KzIwKS50b1N0cmluZygpICsgJ3B4JyApO1xuICAgICQoJzxkaXY+JykuaHRtbCgnRHJhd2luZycpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25fdGl0bGUnKS5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pO1xuXG5cbiAgICAvLyQoJzxmb3JtIG1ldGhvZD1cImdldFwiIGFjdGlvbj1cImRhdGEvc2FtcGxlLnBkZlwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiPkRvd25sb2FkPC9idXR0b24+PC9mb3JtPicpLmFwcGVuZFRvKGRyYXdpbmdfc2VjdGlvbik7XG4gICAgLy8kKCc8c3Bhbj4nKS5hdHRyKCdpZCcsICdkb3dubG9hZCcpLmF0dHIoJ2NsYXNzJywgJ2Zsb2F0X3JpZ2h0JykuYXBwZW5kVG8oZHJhd2luZ19zZWN0aW9uKTtcbiAgICAkKCc8YT4nKVxuICAgICAgICAudGV4dCgnRG93bmxvYWQgRHJhd2luZyAoc2FtcGxlKScpXG4gICAgICAgIC5hdHRyKCdocmVmJywgJ3NhbXBsZV9wZGYvc2FtcGxlLnBkZicpXG4gICAgICAgIC5hdHRyKCdpZCcsICdkb3dubG9hZCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdmbG9hdF9yaWdodCcpXG4gICAgICAgIC5hdHRyKCd0YXJnZXQnLCAnX2JsYW5rJylcbiAgICAgICAgLmFwcGVuZFRvKGRyYXdpbmdfc2VjdGlvbik7XG5cbiAgICB2YXIgc3ZnX2NvbnRhaW5lcl9vYmplY3QgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2RyYXdpbmcnKS5hdHRyKCdjbGFzcycsICdkcmF3aW5nJykuY3NzKCdjbGVhcicsICdib3RoJykuYXBwZW5kVG8oZHJhd2luZ19zZWN0aW9uKTtcbiAgICAvL3N2Z19jb250YWluZXJfb2JqZWN0LnN0eWxlKCd3aWR0aCcsIHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS5kcmF3aW5nLncrJ3B4JyApXG4gICAgLy92YXIgc3ZnX2NvbnRhaW5lciA9IHN2Z19jb250YWluZXJfb2JqZWN0LmVsZW07XG4gICAgJCgnPGJyPicpLmFwcGVuZFRvKGRyYXdpbmdfc2VjdGlvbik7XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgJCgnPGRpdj4nKS5odG1sKCcgJykuYXR0cignY2xhc3MnLCAnc2VjdGlvbl90aXRsZScpLmFwcGVuZFRvKGRyYXdpbmdfc2VjdGlvbik7XG5cbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gc2V0dXBfd2VicGFnZTtcbiIsIlxuXG52YXIgdXBkYXRlID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgc2V0dGluZ3MgPSBnO1xuICAgIHZhciBmID0gZy5mO1xuXG4gICAgY29uc29sZS5sb2coJy8tLS0gYmVnaW4gdXBkYXRlJyk7XG4gICAgZi5jbGVhcl9kcmF3aW5nKCk7XG5cblxuICAgIHNldHRpbmdzLnNlbGVjdF9yZWdpc3RyeS5mb3JFYWNoKGZ1bmN0aW9uKHNlbGVjdG9yKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxlY3Rvci52YWx1ZSgpKTtcbiAgICAgICAgaWYoc2VsZWN0b3IudmFsdWUoKSkgc2VsZWN0b3Iuc3lzdGVtX3JlZi5zZXQoc2VsZWN0b3IudmFsdWUoKSk7XG4gICAgICAgIC8vaWYoc2VsZWN0b3IudmFsdWUoKSkgc2VsZWN0b3IuaW5wdXRfcmVmLnNldChzZWxlY3Rvci52YWx1ZSgpKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxlY3Rvci5zZXRfcmVmLnJlZlN0cmluZywgc2VsZWN0b3IudmFsdWUoKSwgc2VsZWN0b3Iuc2V0X3JlZi5nZXQoKSk7XG5cbiAgICB9KTtcblxuICAgIGlmKCBnLnBlcm0ubG9jYXRpb24ubGF0ICYmIGcucGVybS5sb2NhdGlvbi5sb24pIHtcbiAgICAgICAgZi5zZXRfc2F0X21hcF9tYXJrZXIoKTtcbiAgICB9XG4gICAgLy9jb3B5IGlucHV0cyBmcm9tIHNldHRpbmdzLmlucHV0IHRvIHNldHRpbmdzLnN5c3RlbS5cblxuXG4gICAgZi5zZXR0aW5nc191cGRhdGUoc2V0dGluZ3MpO1xuXG4gICAgc2V0dGluZ3Muc2VsZWN0X3JlZ2lzdHJ5LmZvckVhY2goZnVuY3Rpb24oc2VsZWN0b3Ipe1xuICAgICAgICBpZiggc2VsZWN0b3IudHlwZSA9PT0gJ3NlbGVjdCcgKXtcbiAgICAgICAgICAgIGYuc2VsZWN0b3JfYWRkX29wdGlvbnMoc2VsZWN0b3IpO1xuICAgICAgICB9IGVsc2UgaWYoIHNlbGVjdG9yLnR5cGUgPT09ICdudW1iZXJfaW5wdXQnIHx8IHNlbGVjdG9yLnR5cGUgPT09ICd0ZXh0X2lucHV0JyApIHtcbiAgICAgICAgICAgIHNlbGVjdG9yLmVsZW0udmFsdWUgPSBzZWxlY3Rvci5zeXN0ZW1fcmVmLmdldCgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBzZXR0aW5ncy52YWx1ZV9yZWdpc3RyeS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlX2l0ZW0pe1xuICAgICAgICB2YWx1ZV9pdGVtLmVsZW0uaW5uZXJIVE1MID0gdmFsdWVfaXRlbS52YWx1ZV9yZWYuZ2V0KCk7XG4gICAgfSk7XG5cbiAgICAvLyBEZXRlcm1pbmUgYWN0aXZlIHNlY3Rpb24gYmFzZWQgb24gc2VjdGlvbiBpbnB1dHMgZW50ZXJlZCBieSB1c2VyXG4gICAgdmFyIHNlY3Rpb25zID0gZy53ZWJwYWdlLnNlY3Rpb25zO1xuICAgIHZhciBhY3RpdmVfc2VjdGlvbjtcbiAgICBzZWN0aW9ucy5ldmVyeShmdW5jdGlvbihzZWN0aW9uX25hbWUsaWQpeyAvL1RPRE86IGZpbmQgcHJlIElFOSB3YXkgdG8gZG8gdGhpcz9cbiAgICAgICAgaWYoICEgZy5mLnNlY3Rpb25fZGVmaW5lZChzZWN0aW9uX25hbWUpICl7XG4gICAgICAgICAgICBhY3RpdmVfc2VjdGlvbiA9IHNlY3Rpb25fbmFtZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhY3RpdmUgc2VjdGlvbjonLCBzZWN0aW9uX25hbWUpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYoIGlkID09PSBzZWN0aW9ucy5sZW5ndGgtMSApeyAvL0lmIGxhc3Qgc2VjdGlvbiBpcyBkZWZpbmVkLCB0aGVyZSBpcyBubyBhY3RpdmUgc2VjdGlvblxuICAgICAgICAgICAgICAgIGFjdGl2ZV9zZWN0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vIENsb3NlIHNlY3Rpb24gaWYgdGhleSBhcmUgbm90IGFjdGl2ZSBzZWN0aW9ucywgdW5sZXNzIHRoZXkgaGF2ZSBiZWVuIG9wZW5lZCBieSB0aGUgdXNlciwgb3BlbiB0aGUgYWN0aXZlIHNlY3Rpb25cbiAgICBzZWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHNlY3Rpb25fbmFtZSxpZCl7IC8vVE9ETzogZmluZCBwcmUgSUU5IHdheSB0byBkbyB0aGlzP1xuICAgICAgICBpZiggc2VjdGlvbl9uYW1lID09PSBhY3RpdmVfc2VjdGlvbiApe1xuICAgICAgICAgICAgJCgnI3NlY3Rpb25fJytzZWN0aW9uX25hbWUpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlRG93bignZmFzdCcpO1xuICAgICAgICB9IGVsc2UgaWYoICEgZy53ZWJwYWdlLnNlbGVjdGlvbnNfbWFudWFsX3RvZ2dsZWRbc2VjdGlvbl9uYW1lXSApe1xuICAgICAgICAgICAgJCgnI3NlY3Rpb25fJytzZWN0aW9uX25hbWUpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlVXAoJ2Zhc3QnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vSWYgdGhlIGxvY2F0aW9uIGlzIGRlZmluZWQsIG9wZW4gdGhlIG1hcC5cbiAgICBpZiggKCEgZy53ZWJwYWdlLnNlbGVjdGlvbnNfbWFudWFsX3RvZ2dsZWQubG9jYXRpb24pICYmICBnLmYuc2VjdGlvbl9kZWZpbmVkKCdsb2NhdGlvbicpICl7XG4gICAgICAgICAgICAkKCcjc2VjdGlvbl9tYXAnKS5jaGlsZHJlbignLmRyYXdlcicpLmNoaWxkcmVuKCcuZHJhd2VyX2NvbnRlbnQnKS5zbGlkZURvd24oJ2Zhc3QnKTtcbiAgICB9XG5cbiAgICAvLyBNYWtlIGJsb2Nrc1xuICAgIGYubWtfYmxvY2tzKCk7XG5cbiAgICAvLyBNYWtlIHByZXZpZXdcbiAgICBzZXR0aW5ncy5kcmF3aW5nLnByZXZpZXdfcGFydHMgPSB7fTtcbiAgICBzZXR0aW5ncy5kcmF3aW5nLnByZXZpZXdfc3ZncyA9IHt9O1xuICAgICQoJyNkcmF3aW5nX3ByZXZpZXcnKS5lbXB0eSgpLmh0bWwoJycpO1xuICAgIGZvciggdmFyIHAgaW4gZi5ta19wcmV2aWV3ICl7XG4gICAgICAgIHNldHRpbmdzLmRyYXdpbmcucHJldmlld19wYXJ0c1twXSA9IGYubWtfcHJldmlld1twXShzZXR0aW5ncyk7XG4gICAgICAgIHNldHRpbmdzLmRyYXdpbmcucHJldmlld19zdmdzW3BdID0gZi5ta19zdmcoc2V0dGluZ3MuZHJhd2luZy5wcmV2aWV3X3BhcnRzW3BdLCBzZXR0aW5ncyk7XG4gICAgICAgIHZhciBzZWN0aW9uID0gWycnLCdFbGVjdHJpY2FsJywnU3RydWN0dXJhbCddW3BdO1xuICAgICAgICAkKCcjZHJhd2luZ19wcmV2aWV3JylcbiAgICAgICAgICAgIC8vLmFwcGVuZCgkKCc8cD5QYWdlICcrcCsnPC9wPicpKVxuICAgICAgICAgICAgLmFwcGVuZCgkKCc8cD4nK3NlY3Rpb24rJzwvcD4nKSlcbiAgICAgICAgICAgIC5hcHBlbmQoJChzZXR0aW5ncy5kcmF3aW5nLnByZXZpZXdfc3Znc1twXSkpXG4gICAgICAgICAgICAuYXBwZW5kKCQoJzwvYnI+JykpXG4gICAgICAgICAgICAuYXBwZW5kKCQoJzwvYnI+JykpO1xuXG4gICAgfVxuXG5cblxuICAgIC8vIE1ha2UgZHJhd2luZ1xuICAgIHNldHRpbmdzLmRyYXdpbmcucGFydHMgPSB7fTtcbiAgICBzZXR0aW5ncy5kcmF3aW5nLnN2Z3MgPSB7fTtcbiAgICAkKCcjZHJhd2luZycpLmVtcHR5KCkuaHRtbCgnRWxlY3RyaWNhbCcpO1xuICAgIGZvciggcCBpbiBmLm1rX3BhZ2UgKXtcbiAgICAgICAgc2V0dGluZ3MuZHJhd2luZy5wYXJ0c1twXSA9IGYubWtfcGFnZVtwXShzZXR0aW5ncyk7XG4gICAgICAgIHNldHRpbmdzLmRyYXdpbmcuc3Znc1twXSA9IGYubWtfc3ZnKHNldHRpbmdzLmRyYXdpbmcucGFydHNbcF0sIHNldHRpbmdzKTtcbiAgICAgICAgJCgnI2RyYXdpbmcnKVxuICAgICAgICAgICAgLy8uYXBwZW5kKCQoJzxwPlBhZ2UgJytwKyc8L3A+JykpXG4gICAgICAgICAgICAuYXBwZW5kKCQoc2V0dGluZ3MuZHJhd2luZy5zdmdzW3BdKSlcbiAgICAgICAgICAgIC5hcHBlbmQoJCgnPC9icj4nKSlcbiAgICAgICAgICAgIC5hcHBlbmQoJCgnPC9icj4nKSk7XG5cbiAgICB9XG5cblxuXG5cbiAgICBjb25zb2xlLmxvZygnXFxcXC0tLSBlbmQgdXBkYXRlJyk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gdXBkYXRlO1xuIiwibW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9e1xuXG4gICAgXCJORUMgMjUwLjEyMl9oZWFkZXJcIjogW1wiQW1wXCIsXCJBV0dcIl0sXG4gICAgXCJORUMgMjUwLjEyMlwiOiB7XG4gICAgICAgIFwiMTVcIjpcIjE0XCIsXG4gICAgICAgIFwiMjBcIjpcIjEyXCIsXG4gICAgICAgIFwiMzBcIjpcIjEwXCIsXG4gICAgICAgIFwiNDBcIjpcIjEwXCIsXG4gICAgICAgIFwiNjBcIjpcIjEwXCIsXG4gICAgICAgIFwiMTAwXCI6XCI4XCIsXG4gICAgICAgIFwiMjAwXCI6XCI2XCIsXG4gICAgICAgIFwiMzAwXCI6XCI0XCIsXG4gICAgICAgIFwiNDAwXCI6XCIzXCIsXG4gICAgICAgIFwiNTAwXCI6XCIyXCIsXG4gICAgICAgIFwiNjAwXCI6XCIxXCIsXG4gICAgICAgIFwiODAwXCI6XCIxLzBcIixcbiAgICAgICAgXCIxMDAwXCI6XCIyLzBcIixcbiAgICAgICAgXCIxMjAwXCI6XCIzLzBcIixcbiAgICAgICAgXCIxNjAwXCI6XCI0LzBcIixcbiAgICAgICAgXCIyMDAwXCI6XCIyNTBcIixcbiAgICAgICAgXCIyNTAwXCI6XCIzNTBcIixcbiAgICAgICAgXCIzMDAwXCI6XCI0MDBcIixcbiAgICAgICAgXCI0MDAwXCI6XCI1MDBcIixcbiAgICAgICAgXCI1MDAwXCI6XCI3MDBcIixcbiAgICAgICAgXCI2MDAwXCI6XCI4MDBcIixcbiAgICB9LFxuXG4gICAgXCJORUMgVDY5MC43X2hlYWRlclwiOiBbXCJBbWJpZW50IFRlbXBlcmF0dXJlIChDKVwiLCBcIkNvcnJlY3Rpb24gRmFjdG9yXCJdLFxuICAgIFwiTkVDIFQ2OTAuN1wiOiB7XG4gICAgICAgIFwiMjUgdG8gMjBcIjpcIjEuMDJcIixcbiAgICAgICAgXCIxOSB0byAxNVwiOlwiMS4wNFwiLFxuICAgICAgICBcIjE1IHRvIDEwXCI6XCIxLjA2XCIsXG4gICAgICAgIFwiOSB0byA1XCI6XCIxLjA4XCIsXG4gICAgICAgIFwiNCB0byAwXCI6XCIxLjEwXCIsXG4gICAgICAgIFwiLTEgdG8gLTVcIjpcIjEuMTJcIixcbiAgICAgICAgXCItNiB0byAtMTBcIjpcIjEuMTRcIixcbiAgICAgICAgXCItMTEgdG8gLTE1XCI6XCIxLjE2XCIsXG4gICAgICAgIFwiLTE2IHRvIC0yMFwiOlwiMS4xOFwiLFxuICAgICAgICBcIi0yMSB0byAtMjVcIjpcIjEuMjBcIixcbiAgICAgICAgXCItMjYgdG8gLTMwXCI6XCIxLjIxXCIsXG4gICAgICAgIFwiLTMxIHRvIC0zNVwiOlwiMS4yM1wiLFxuICAgICAgICBcIi0zNiB0byAtNDBcIjpcIjEuMjVcIixcbiAgICB9LFxuXG4gICAgXCJDaCA5IFRhYmxlIDggQ29uZHVjdG9yIFByb3BlcnRpZXNfaGVhZGVyXCI6IFtcIlNpemVcIixcIm9obS9rZnRcIl0sXG4gICAgXCJDaCA5IFRhYmxlIDggQ29uZHVjdG9yIFByb3BlcnRpZXNcIjoge1xuICAgICAgICBcIiMwMVwiOlwiIDAuMTU0XCIsXG4gICAgICAgIFwiIzAxLzBcIjpcIjAuMTIyXCIsXG4gICAgICAgIFwiIzAyXCI6XCIwLjE5NFwiLFxuICAgICAgICBcIiMwMi8wXCI6XCIwLjA5NjdcIixcbiAgICAgICAgXCIjMDNcIjpcIjAuMjQ1XCIsXG4gICAgICAgIFwiIzAzLzBcIjpcIjAuMDc2NlwiLFxuICAgICAgICBcIiMwNFwiOlwiMC4zMDhcIixcbiAgICAgICAgXCIjMDQvMFwiOlwiMC4wNjA4XCIsXG4gICAgICAgIFwiIzA2XCI6XCIwLjQ5MVwiLFxuICAgICAgICBcIiMwOFwiOlwiMC43NzhcIixcbiAgICAgICAgXCIjMTBcIjpcIjEuMjRcIixcbiAgICAgICAgXCIjMTJcIjpcIjEuOThcIixcbiAgICAgICAgXCIjMTRcIjpcIjMuMTRcIixcbiAgICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBrb250YWluZXIgPSB7XG4gICAgcmVmOiBmdW5jdGlvbihyZWZTdHJpbmcpe1xuICAgICAgICBpZiggdHlwZW9mIHJlZlN0cmluZyA9PT0gJ3VuZGVmaW5lZCcgKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlZlN0cmluZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVmU3RyaW5nID0gcmVmU3RyaW5nO1xuICAgICAgICAgICAgdGhpcy5yZWZBcnJheSA9IHJlZlN0cmluZy5zcGxpdCgnLicpO1xuICAgICAgICAgICAgaWYoIHR5cGVvZiB0aGlzLm9iamVjdCAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBvYmo6IGZ1bmN0aW9uKG9iail7XG4gICAgICAgIGlmKCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vYmplY3QgPSBvYmo7XG4gICAgICAgICAgICBpZiggdHlwZW9mIHRoaXMucmVmU3RyaW5nICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24oaW5wdXQpe1xuICAgICAgICBpZiggdHlwZW9mIHRoaXMub2JqZWN0ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgdGhpcy5yZWZTdHJpbmcgPT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMub2JqZWN0O1xuICAgICAgICB2YXIgbGFzdF9sZXZlbCA9IHRoaXMucmVmQXJyYXlbdGhpcy5yZWZBcnJheS5sZW5ndGgtMV07XG5cbiAgICAgICAgdGhpcy5yZWZBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldmVsX25hbWUsaSl7XG4gICAgICAgICAgICBpZiggdHlwZW9mIHBhcmVudFtsZXZlbF9uYW1lXSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50W2xldmVsX25hbWVdID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiggbGV2ZWxfbmFtZSAhPT0gbGFzdF9sZXZlbCApe1xuICAgICAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudFtsZXZlbF9uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHBhcmVudFtsYXN0X2xldmVsXSA9IGlucHV0O1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdzZXR0aW5nOicsIGlucHV0LCB0aGlzLmdldCgpLCB0aGlzLnJlZlN0cmluZyApO1xuICAgICAgICByZXR1cm4gcGFyZW50W2xhc3RfbGV2ZWxdO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbGV2ZWwgPSB0aGlzLm9iamVjdDtcbiAgICAgICAgdGhpcy5yZWZBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldmVsX25hbWUsaSl7XG4gICAgICAgICAgICBpZiggdHlwZW9mIGxldmVsW2xldmVsX25hbWVdID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXZlbCA9IGxldmVsW2xldmVsX25hbWVdO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGxldmVsO1xuICAgIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtvbnRhaW5lcjtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vdmFyIHZlcnNpb25fc3RyaW5nID0gJ0Rldic7XG4vL3ZhciB2ZXJzaW9uX3N0cmluZyA9ICdBbHBoYTIwMTQwMS0tJztcbnZhciB2ZXJzaW9uX3N0cmluZyA9ICdQcmV2aWV3Jyttb21lbnQoKS5mb3JtYXQoJ1lZWVlNTUREJyk7XG5cblxuXG53aW5kb3cuZyA9IHJlcXVpcmUoJy4vYXBwL3NldHRpbmdzJyk7XG5jb25zb2xlLmxvZygnc2V0dGluZ3MnLCBnKTtcblxuZy5zdGF0ZS52ZXJzaW9uX3N0cmluZyA9IHZlcnNpb25fc3RyaW5nO1xuXG52YXIgZiA9IHJlcXVpcmUoJy4vYXBwL2Z1bmN0aW9ucycpO1xuZi5nID0gZztcbmcuZiA9IGY7XG5cbnZhciBxdWVyeSA9IGYucXVlcnlfc3RyaW5nKCk7XG4vL2NvbnNvbGUubG9nKHF1ZXJ5KTtcbmlmKCBxdWVyeVsnbW9kZSddID09PSBcImRldlwiICkge1xuICAgIGcuc3RhdGUubW9kZSA9ICdkZXYnO1xufSBlbHNlIHtcbiAgICBnLnN0YXRlLm1vZGUgPSAncmVsZWFzZSc7XG59XG5cbmYuc2V0dXBfd2VicGFnZSA9IHJlcXVpcmUoJy4vYXBwL3NldHVwX3dlYnBhZ2UnKTtcblxuZi5zZXR0aW5nc191cGRhdGUgPSByZXF1aXJlKCcuL2FwcC9zZXR0aW5nc191cGRhdGUnKTtcbmYudXBkYXRlID0gcmVxdWlyZSgnLi9hcHAvdXBkYXRlJyk7XG5cblxuZi5ta19ibG9ja3MgPSByZXF1aXJlKCcuL2FwcC9ta19ibG9ja3MnKTtcblxuZi5ta19wYWdlID0ge307XG5mLm1rX3BhZ2VbMV0gPSByZXF1aXJlKCcuL2FwcC9ta19wYWdlXzEnKTtcbmYubWtfcGFnZVsyXSA9IHJlcXVpcmUoJy4vYXBwL21rX3BhZ2VfMicpO1xuZi5ta19wYWdlWzNdID0gcmVxdWlyZSgnLi9hcHAvbWtfcGFnZV8zJyk7XG5mLm1rX3BhZ2VbNF0gPSByZXF1aXJlKCcuL2FwcC9ta19wYWdlXzQnKTtcblxuZi5ta19wcmV2aWV3ID0ge307XG5mLm1rX3ByZXZpZXdbMV0gPSByZXF1aXJlKCcuL2FwcC9ta19wYWdlX3ByZXZpZXdfMScpO1xuZi5ta19wcmV2aWV3WzJdID0gcmVxdWlyZSgnLi9hcHAvbWtfcGFnZV9wcmV2aWV3XzInKTtcblxuZi5ta19zdmc9IHJlcXVpcmUoJy4vYXBwL21rX3N2ZycpO1xuXG5cblxuXG4vLyByZXF1ZXN0IGV4dGVybmFsIGRhdGFcbi8vdmFyIGRhdGFiYXNlX2pzb25fVVJMID0gJ2h0dHA6Ly8xMC4xNzMuNjQuMjA0OjgwMDAvdGVtcG9yYXJ5Lyc7XG52YXIgZGF0YWJhc2VfanNvbl9VUkwgPSAnZGF0YS9mc2VjX2NvcHkuanNvbic7XG4kLmdldEpTT04oIGRhdGFiYXNlX2pzb25fVVJMKVxuICAgIC5kb25lKGZ1bmN0aW9uKGpzb24pe1xuICAgICAgICBnLmRhdGFiYXNlID0ganNvbjtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnZGF0YWJhc2UgbG9hZGVkJywgc2V0dGluZ3MuZGF0YWJhc2UpO1xuICAgICAgICBmLmxvYWRfZGF0YWJhc2UoanNvbik7XG4gICAgICAgIGcuc3RhdGUuZGF0YWJhc2VfbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgZi51cGRhdGUoKTtcblxuICAgIH0pO1xuXG5cbi8vIEJ1aWxkIHdlYnBhZ2VcbmYuc2V0dXBfd2VicGFnZSgpO1xuXG4vLyBBZGQgc3RhdHVzIGJhclxudmFyIGJvb3RfdGltZSA9IG1vbWVudCgpO1xudmFyIHN0YXR1c19pZCA9ICdzdGF0dXMnO1xuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXsgZi51cGRhdGVfc3RhdHVzX2JhcihzdGF0dXNfaWQsIGJvb3RfdGltZSwgdmVyc2lvbl9zdHJpbmcpO30sMTAwMCk7XG5cbi8vIFVwZGF0ZVxuZi51cGRhdGUoKTtcbiJdfQ==
