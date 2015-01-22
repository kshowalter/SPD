(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/functions.js":[function(require,module,exports){
'use strict';
//var $ = require('jquery');
var k$ = require('../lib/k/k_DOM');
var k = require('../lib/k/k');
var kontainer = require('../lib/k/kontainer');

var f = {};

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

/*
f.kelem_setup = function(kelem, settings){
    if( !settings) console.log(settings);
    if( kelem.type === 'selector' ){
        kelem.setRefObj(settings);
        kelem.setUpdate(settings.update);
        settings.select_registry.push(kelem);
        kelem.update();
    } else if( kelem.type === 'value' ){
        kelem.setRefObj(settings);
        //kelem.setUpdate(settings_update);
        settings.value_registry.push(kelem);
    }
    return kelem;
};
*/
//f.scope_preserver = function(v){
//    return function(){
//        return v;
//    };
//};

f.mk_drawer = function(title, content){
    var drawer_container = $('<div>').attr('class', 'input_section').attr('id', title );
    //drawer_container.get(0).style.display = display_type;
    var system_div = $('<div>').attr('class', 'title_bar')
        .attr('id', 'section_'+title)
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

            } else if( selector.type === 'input' ){
                selector.elem = $('<input>')
                    .attr('class', 'number_input')
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

f.show_hide_params = function(page_sections, settings){
    for( var list_name in page_sections ){
        var id = '#'+list_name;
        var section_name = list_name.split('_')[0];
        var section = k$(id);
        if( settings.status.sections[section_name].set ) section.show();
        else section.hide();
    }
};

f.show_hide_selections = function(settings, active_section_name){
    $('#sectionSelector').val(active_section_name);
    for( var list_name in settings.input ){
        var id = '#'+list_name;
        var section_name = list_name.split('_')[0];
        var section = k$(id);
        if( section_name === active_section_name ) section.show();
        else section.hide();
    }
};

//f.setDownloadLink(settings){
//
//    if( settings.PDF && settings.PDF.url ){
//        var link = $('a').attr('href', settings.PDF.url ).attr('download', 'PV_drawing.pdf').html('Download Drawing');
//        $('#download').html('').append(link);
//    }
//}

f.loadTables = function(string){
    var tables = {};
    var l = string.split('\n');
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
        } else if( need_fields ) {
            fields = line.split(',');
            tables[title+"_fields"] = fields;
            need_fields = false;
        //} else {
        //    var entry = {};
        //    var line_array = line.split(',');
        //    fields.forEach( function(field, id){
        //        entry[field.trim()] = line_array[id].trim();
        //    });
        //    tables[title].push( entry );
        //}
        } else {
            var line_array = line.split(',');
            tables[title][line_array[0].trim()] = line_array[1].trim();
        }
    });

    return tables;
};

f.loadComponents = function(string){
    var db = k.parseCSV(string);
    var object = {};
    for( var i in db ){
        var component = db[i];
        if( object[component.Make] === undefined ){
            object[component.Make] = {};
        }
        if( object[component.Make][component.Model] === undefined ){
            object[component.Make][component.Model] = {};
        }

        var fields = k.objIdArray(component);
        fields.forEach( function( field ){
            var param = component[field];
            if( !( field in ['Make', 'Model'] ) && !( isNaN(parseFloat(param)) ) ){
                component[field] = parseFloat(param);
            }
        })
        object[component.Make][component.Model] = component;
    }
    return object;
};




f.load_database = function(FSEC_database_JSON){
    FSEC_database_JSON = f.lowercase_properties(FSEC_database_JSON);
    var settings = f.settings;
    settings.components.inverters = {};
    FSEC_database_JSON.inverters.forEach(function(component){
        if( settings.components.inverters[component.make] === undefined ) settings.components.inverters[component.make] = {};
        //settings.components.inverters[component.make][component.make] = f.pretty_names(component);
        settings.components.inverters[component.make][component.model] = component;
    });
    settings.components.modules = {};
    FSEC_database_JSON.modules.forEach(function(component){
        if( settings.components.modules[component.make] === undefined ) settings.components.modules[component.make] = {};
        //settings.components.modules[component.make][component.make] = f.pretty_names(component);
        settings.components.modules[component.make][component.model] = component;
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
    if(f.settings.state.database_loaded) {
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

module.exports = f;

},{"../lib/k/k":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/k.js","../lib/k/k_DOM":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/k_DOM.js","../lib/k/kontainer":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/kontainer.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_border.js":[function(require,module,exports){
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
             [ system.inverter.make + " " + system.inverter.model + " Inverter System" ],
            'title1', 'text').rotate(-90);

    }

    x += 14;
    if( system.module.model && system.array.num_strings && system.array.modules_per_string  ){
        d.text([x,y], [
            system.module.make + " " + system.module.model +
                " (" + system.array.num_strings  + " strings of " + system.array.modules_per_string + " modules )"
        ], 'title2', 'text').rotate(-90);
    }

    x = page.left + padding;
    y = page.top + padding;
    y += size.drawing.titlebox * 1.5 * 3/4;







    return d.drawing_parts;
};



module.exports = add_border;

},{"./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_drawing.js":[function(require,module,exports){
'use strict';

var k = require('../lib/k/k.js');
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

},{"../lib/k/k.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/k.js","./functions.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/functions.js","./settings":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_1.js":[function(require,module,exports){
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
            'FSEC Plans Machine',
            'DEMO'
        ],
        'project title'
    );

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









////////////////////////////////////////
// Frame
/*
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
    d.rect( [x-w/2, y+h/2], [w,h] );

    var page = {};
    page.right = title.right;
    page.left = title.left;
    page.top = title.bottom + padding;
    page.bottom = page.top + size.drawing.titlebox*1.5;
    // d.text

    x = title.left + padding;
    y = title.bottom - padding;

    x += 10;
    d.text([x,y],
         [ system.inverter.make + " " + system.inverter.model + " Inverter System" ],
        'title1', 'text').rotate(-90);

    x += 14;
    if( system.module.specs !== undefined && system.module.specs !== null  ){
        d.text([x,y], [
            system.module.make + " " + system.module.model +
                " (" + system.array.num_strings  + " strings of " + system.array.modules_per_string + " modules )"
        ], 'title2', 'text').rotate(-90);
    }

    x = page.left + padding;
    y = page.top + padding;
    y += size.drawing.titlebox * 1.5 * 3/4;


    d.text([x,y],
        ['PV1'],
        'page', 'text');


//*/






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



        for( var i in _.range(system.array.num_strings)) {
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

        } else {

            //console.log('not defined: ', section_name, section);
        }




    }

    d.layer();


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

    console.log(f.section_defined('roof'));

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
var k = require('../lib/k/k.js');

var i;
//var settingsCalculated = require('./settingsCalculated.js');

// Load 'user' defined settings
//var mk_settings = require('../data/settings.json.js');
//f.mk_settings = mk_settings;

var settings = {};

settings.temp = {};

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
settings.inputs.roof = {};
settings.inputs.roof.width = {};
settings.inputs.roof.width.options = [];
//for( i=15; i<=70; i+=5 ) settings.inputs.roof.width.options.push(i);
settings.inputs.roof.width.units = 'ft.';
settings.inputs.roof.width.note = 'This the full size of the roof, perpendictular to the slope.';
settings.inputs.roof.width.type = 'input';
settings.inputs.roof.length = {};
settings.inputs.roof.length.options = [];
//for( i=10; i<=60; i+=5 ) settings.inputs.roof.length.options.push(i);
settings.inputs.roof.length.units = 'ft.';
settings.inputs.roof.length.note = 'This the full length of the roof, measured from low to high.';
settings.inputs.roof.length.type = 'input';
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
settings.inputs.module.width = {};
settings.inputs.module.width.options = [20,25,30,35,40];
settings.inputs.module.width.units = 'in.';
settings.inputs.module.width.note = 'This the full frame size (outer).';
settings.inputs.module.width.type = 'input';
settings.inputs.module.length = {};
settings.inputs.module.length.options = [30,35,40,45,50];
settings.inputs.module.length.units = 'in.';
settings.inputs.module.length.note = 'This the full frame size (outer).';
settings.inputs.module.length.type = 'input';
settings.inputs.array = {};
settings.inputs.array.modules_per_string = {};
settings.inputs.array.modules_per_string.options = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
settings.inputs.array.num_strings = {};
settings.inputs.array.num_strings.options = [1,2,3,4,5,6];
settings.inputs.DC = {};
settings.inputs.DC.home_run_length = {};
//settings.inputs.DC.home_run_length.options = [25,50,75,100,125,150];
settings.inputs.DC.home_run_length.type = 'input';
settings.inputs.inverter = {};
settings.inputs.inverter.make = {};
//settings.inputs.inverter.make.options = null;
settings.inputs.inverter.model = {};
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
settings.inputs.AC.distance_to_loadcenter.type = 'input';



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


/*
for( var section_name in settings.inputs ){
    for( var input_name in settings.inputs[section_name]){
        if( typeof settings.inputs[section_name][input_name] === 'string' ){
            console.log(settings.inputs[section_name][input_name])
            "obj_names(setttings" + settings.inputs[section_name][input_name] + ")";
            // eval is only being used on strings defined in the settings.json file that is built into the application
            settings.inputs[section_name][input_name] = eval(settings.inputs[section_name][input_name]);
        }
    }
}
//*/


/*
settings.state.sections = {
    modules: {},
    array: {},
    DC: {},
    inverter: {},
    AC: {},
};
config_options.section_options = obj_names(settings.state.sections);
settings.state.active_section = 'modules';

config_options.AC_loadcenter_type_options = obj_names( config_options.AC_loadcenter_types );
config_options.AC_type_options = obj_names( config_options.AC_types );

config_options.inverters = {};

config_options.page_options = ['Page 1 of 1'];
settings.state.active_page = config_options.page_options[0];

system.inverter = {};


config_options.DC_homerun_lengths = config_options.DC_homerun_lengths || [25,50,75,100];
config_options.DC_homerun_AWG_options =
    config_options.DC_homerun_AWG_options ||
    obj_names( config_options.NEC_tables["Ch 9 Table 8 Conductor Properties"] );
//*/


module.exports = settings;

},{"../data/tables.json":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/data/tables.json","../lib/k/k.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/k.js","./functions":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/functions.js","./settings_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings_drawing.js","./settings_fonts":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings_fonts.js","./settings_layers":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings_layers.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings_drawing.js":[function(require,module,exports){
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


module.exports = layer_attr;

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings_update.js":[function(require,module,exports){
'use strict';

var k = require('../lib/k/k.js');
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
        inputs.DC.wire_size.options = inputs.DC.wire_size.options || k.obj_names(settings.config_options.NEC_tables['Ch 9 Table 8 Conductor Properties']);


    }

    //var show_defaults = false;
    ///*
    if( state.mode === 'dev'){
        //show_defaults = true;
        //console.log('Dev mode - defaults on');

        system.array.num_strings = system.array.num_strings || 4;
        system.array.modules_per_string = system.array.modules_per_string || 6;
        system.DC.home_run_length = system.DC.home_run_length || 50;

        system.roof.width  = system.roof.width || 25;
        system.roof.length = system.roof.length || 15;
        system.roof.slope  = system.roof.slope || "6:12";
        system.roof.type = system.roof.type || "Gable";

        system.module.orientation = system.module.orientation || "Portrait";
        system.module.width = system.module.width || 30;
        system.module.length = system.module.length || 50;


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
        }
    }
    //*/


    //console.log("settings_update");
    //console.log(system.module.make);

    inputs.module.make.options = k.obj_names(settings.components.modules);
    if( system.module.make ) {
        inputs.module.model.options  = k.obj_names( settings.components.modules[system.module.make] );
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

    inputs.inverter.make.options = k.obj_names(settings.components.inverters);
    if( system.inverter.make ) {
        inputs.inverter.model.options = k.obj_names( settings.components.inverters[system.inverter.make] );
    }
    if( f.section_defined('inverter') ){

    }

    //inputs.AC.loadcenter_type = settings.f.obj_names(inputs.AC.loadcenter_types);
    if( system.AC.loadcenter_types ) {
        var loadcenter_type = system.AC.loadcenter_types;
        var AC_options = inputs.AC.loadcenter_types[loadcenter_type];
        inputs.AC.type.options = AC_options;
        //in.opt.AC.types[loadcenter_type];

        //inputs.AC['type'] = k.obj_names( settings.in.opt.AC.type );
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









    /*
    //settings.drawing_settings.size.wire_table.h = (system.AC.num_conductors+3) * settings.drawing_settings.size.wire_table.row_h;
    for( var section_name in inputs ){
        for( var input_name in settings.inputs[section_name] ){
            if( typeof settings.inputs[section_name][input_name] === 'string' ){
                console.log( settings.inputs[section_name][input_name] );
                console.log( k.obj_names(
                    f.get_ref(settings.inputs[section_name][input_name], settings)
                ));

                var to_eval = "k.obj_names(setttings." + settings.inputs[section_name][input_name] + ")";
                console.log(to_eval);
                // eval is only being used on strings defined in the settings.json file that is built into the application
                /* jshint evil:true //*/
                // TODO: Look for alternative solutions that is more universal.
                // http://perfectionkills.com/global-eval-what-are-the-options/#indirect_eval_call_examples
                /*
                var e = eval; // This allows eval to be called indirectly, triggering a global call in modern browsers.
                settings.inputs[section_name][input_name] = e(to_eval);
                /* jshint evil:false //*/
                /*
            }
        }
    }

    //*/

};

/*

    if( state.data_loaded ) {

        //system.DC.num_strings = settings.system.num_strings;
        //system.DC.num_module = settings.system.num_module;
        //if( settings.config_options.modules !== undefined ){

        var old_active_section = state.active_section;

        // Modules
        if( true ){
            f.object_defined(system.DC.module);

            settings.config_options.moduleMakeArray = k.objIdArray(settings.config_options.modules);
            if( system.DC.module.make ) settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.modules[system.DC.module.make]);
            if( system.DC.module.model ) system.DC.module.specs = settings.config_options.modules[system.DC.module.make][system.DC.module.model];

            state.active_section = 'array';
        }

        // Array
        if( object_defined(input.module) ) {
            //system.module = settings.config_options.modules[settings.f.module];
            if( system.DC.module.specs ){
                system.DC.array = {};
                system.DC.array.Isc = system.DC.module.specs.Isc * system.DC.num_strings;
                system.DC.array.Voc = system.DC.module.specs.Voc * system.DC.string_modules;
                system.DC.array.Imp = system.DC.module.specs.Imp * system.DC.num_strings;
                system.DC.array.Vmp = system.DC.module.specs.Vmp * system.DC.string_modules;
                system.DC.array.Pmp = system.DC.array.Vmp * system.DC.array.Imp;

                state.active_section = 'DC';
            }

            // DC
            if( object_defined(inputs.DC) ) {

                system.DC.homerun.resistance = config_options.NEC_tables['Ch 9 Table 8 Conductor Properties'][system.DC.homerun.AWG];
                state.sections.inverter.ready = true;
                state.active_section = 'inverter';
            }

            // Inverter
            if( object_defined(inputs.DC) ) {

                settings.config_options.inverterMakeArray = k.objIdArray(settings.config_options.inverters);
                if( system.inverter.make ) {
                    settings.config_options.inverterModelArray = k.objIdArray(settings.config_options.inverters[system.inverter.make]);
                }
                if( system.inverter.model ) system.inverter.specs = settings.config_options.inverters[system.inverter.make][system.inverter.model];

                state.active_section = 'AC';
            }

            // AC
            if( object_defined(inputs.inverter) ) {
                if( system.AC_loadcenter_type ) {

                    system.AC_types_availible = config_options.AC_loadcenter_types[system.AC_loadcenter_type];

                    config_options.AC_type_options.forEach( function( elem, id ){
                        if( ! (elem in system.AC_types_availible) ) {
                            config_options.AC_type_options.splice(id, 1);
                        }

                    });

                    //system.AC.type = settings.system.AC_type;
                    system.AC_conductors = settings.config_options.AC_types[system.AC_type];
                }
            }


            if( object_defined(inputs.AC) ) {
                state.active_section = old_active_section;
            }

            size.wire_offset.max = size.wire_offset.min + system.DC.num_strings * size.wire_offset.base;
            size.wire_offset.ground = size.wire_offset.max + size.wire_offset.base*1;

            loc.array.left = loc.array.right - ( size.string.w * system.DC.num_strings ) - ( size.module.frame.w*3/4 ) ;

            //return settings;

        }
    }
};

//*/

module.exports = settings_update;

},{"../lib/k/k.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/k.js","./functions":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/functions.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/data/tables.json":[function(require,module,exports){
module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports={

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

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/k.js":[function(require,module,exports){
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// This is the k javascript library
// a collection of functions used by kshowalter
/////////////////////////////////////////////////////////////////////////////////////////////////////////

//var moment = require('moment');
//var $ = require('./k_DOM.js');


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Misc. variables  /////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// log shortcut
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

k.obj_names = function( object ) {
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

k.objIdArray = function( object ) {
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

k.AJAX = function(url, callback, object) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
            if(xmlhttp.status == 200){
                callback(xmlhttp.responseText, object);
            }
            else if(xmlhttp.status == 400) {
                console.log('There was an error 400')
            }
            else {
                console.log('something else other than 200 was returned')
            }
        }
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

k.parseCSV = function(file_content) {
    var r = []
    var lines = file_content.split('\n');
    var header = lines.shift().split(',');
    header.forEach(function(elem, id){
        header[id] = elem.trim();
    });
    for(var l = 0, len = lines.length; l < len; l++){
        var line = lines[l];
        if(line.length > 0){
            var line_obj = {};
            line.split(',').forEach(function(item,i){
                line_obj[header[i]] = item.trim();
            });
            r.push(line_obj);
        }
    }
    return(r);
};

k.getCSV = function(URL, callback) {
    k.AJAX(URL, k.parseCSV() )
}

/*
$.ajaxSetup ({
    cache: false
})



k.get_JSON = function(URL, callback, string) {
//    var filename = URL.split('/').pop()
//    console.log(URL)
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
k.update_status_page = function(status_id, boot_time, string) {
    var status_div = document.getElementById(status_id)
    status_div.innerHTML = string
    status_div.innerHTML += ' | '

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
    console.log(obj_name)
    var str = '-' + obj_name + '-'
    max_level++
    level_indent = 2
    str = levels(obj, level_indent, str)
    console.log(str)
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


//            console.log(key,level)
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
    //        console.log(key, typeof(item))
            if( typeof(item) == 'object' ){
    //            ('<li>').text("&nbsp;".repeat(level) + key))
                ('<li>').text(key))
                subobj_ul.append(levels(item,level+1))
    //            console.log("&nbsp;".repeat(level) + key)
            } else {
    //            subobj_div.append('<span>').text("&nbsp;".repeat(level) + key+": "+ item)
    //            ('<li>').text("&nbsp;".repeat(level) + key +": "+ item))
                ('<li>').text(key +": "+ item))
    //            console.log("&nbsp;".repeat(level) + key+": "+ item)
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
                    console.log(a.join(','))
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
    console.log( length)
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
    console.log(moment().format('YYYY-MM-DD'))
    console.log(moment().fromNow())
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

    console.log(bar.width+'%')
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


// Browserify
module.exports = k;

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/k_DOM.js":[function(require,module,exports){
'use strict';
var log = console.log.bind(console);

var value = require('./k_DOM_extra.js').value;
var selector = require('./k_DOM_extra.js').selector;
//log( 'value', value() );
//log( 'selector', selector() ); var k = require('./k'); //var selector = require('./k_DOM_extra.js').selector; 


var wrapper_prototype = require('./wrapper_prototype');

/*
var wrapper_prototype = {

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



};
*/

var Wrap = function(element){
    var W = Object.create(wrapper_prototype);


    W.elem = element;
    if( W.elem.tagName === "SELECT" ) {
        W.setOptions = function( option_array ) {
            W.elem.options.length = 0; 
            //log("option_array", option_array);
            option_array.forEach( function(option_str,i){
                var opt = document.createElement('option');
                opt.text = option_str;
                opt.value = option_str;
                W.elem.add(opt);
            });

        };
    }
    return W;

};

var $ = function(input){
    var element;

    if( typeof input === 'undefined' ) {
        //log('input needed');
        return false;
    }
    if( (input instanceof HTMLElement) || (input instanceof SVGElement) ){
        return Wrap(input);
    }
    if( input.substr(0,1) === '#' ) {
        element = document.getElementById(input.substr(1));
        return Wrap(element);
    } else if( input.substr(0,1) === '.' ) {
        element = document.getElementByClassName(input.substr(1)[0]);
        return Wrap(element);
    } else {
        if( input === 'value' ) {
            if( value !== undefined ) {
                element = value(); 
                return element;
            } else {
                console.log("Error: value not defined");
                return false;
            }
        } else if( input === 'selector' ) {
            if( selector !== undefined ) {
                element = selector(); 
                return element;
            } else {
                console.log("Error: selector not defined");
                return false;
            }
        } else {
            element = document.createElement(input);
            return Wrap(element);
        }
    }
    


};

// Browserify
module.exports = $;
//module.exports.wrapper_prototype = wrapper_prototype;

},{"./k_DOM_extra.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/k_DOM_extra.js","./wrapper_prototype":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/wrapper_prototype.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/k_DOM_extra.js":[function(require,module,exports){
'use strict';

var k = require('./k.js');
var kontainer = require('./kontainer');

var k_DOM = require('./k_DOM.js');
var wrapper_prototype = require('./wrapper_prototype');


var selector_prototype = {
    change: function(new_value){
        this.set_value();

        if( this.g_update !== undefined ){
            this.g_update();
        }
    },
    set_value: function(){
        if( this.elem.options[this.elem.selectedIndex] && this.elem.options[this.elem.selectedIndex].value ){
            //console.log('selected_value', this.elem.options[this.elem.selectedIndex].value);
            var new_value = this.elem.options[this.elem.selectedIndex].value;
            if( this.optionsKontainer.ready ) {
                //console.log('kontainer ready, setting to: ', new_value)
                //if( ! isNaN(parseFloat(new_value))) new_value = parseFloat(new_value);
                this.kontainer.set(new_value);
                this.value = new_value;
            }
            return this;
        }
    },
    update: function(){
        //console.log('updating: ', this)
        //this.set_value();
        this.update_options();
        return this;
    },
    update_options: function(){
        var old_value = this.value;
        if( this.kontainer.ready ) {
            this.value = this.kontainer.get();
            if( typeof this.value == "object") this.value = null;
        } else {
            this.value = null;
        }

        if( this.optionsKontainer.ready && this.kontainer.ready ) {
            var old_options = this.options;
            this.options = this.optionsKontainer.get();
            if( this.options instanceof Array ){
                //this.options.unshift('');
                if( this.options !== old_options|| this.value !== old_value ){
                    if( this.options !== undefined && this.options instanceof Array) {
                        //this.elem.innerHTML = '';
                        this.elem.innerHTML = '<option selected disabled hidden></option>'
                        this.options.forEach(function(value,id){
                            var o = document.createElement('option');
                            o.value = value;
                            if( this.value ){
                                if( value.toString() === this.value.toString() ) {
                                    //console.log('found it:', value);
                                    o.selected = "selected";
                                } else {
                                    //console.log('does not match: ', value, this.value)
                                }
                                //o.setAttribute('class', 'selector_option');
                            } else {
                                //console.log('no current value')
                            }
                            o.innerHTML = value;
                            var that = this;
                            this.elem.appendChild(o);
                        }, this);
                        var selector_obj = this;
                        this.elem.addEventListener('change', function(){
                            selector_obj.change();
                        }, false);
                        //if( ! (this.options.indexOf(this.kontainer.get())+1) ){
                        //    this.set_value(this.options[0].value);
                        //}
                    }
                }
            }
        }


        return this;
    },
    setUpdate: function(update_function){
        this.g_update = update_function;
        return this;
    },
    setRef: function(refString){
        this.refString = refString;
        if( this.kontainer === undefined && this.refObject !== undefined ){
            this.kontainer = Object.create(kontainer);
        }
        if( this.kontainer !== undefined ) {
            this.kontainer.ref(this.refString);
            this.kontainer.obj(this.refObject);
        }

        return this;
    },
    setRefObj: function(refObject){
        this.refObject = refObject;
        if( this.kontainer === undefined && this.refString !== undefined ){
            this.kontainer = Object.create(kontainer);
        }
        if( this.kontainer !== undefined ) {
            this.kontainer.ref(this.refString);
            this.kontainer.obj(this.refObject);
        }
        if( this.optionsKontainer === undefined && this.refOptionsString !== undefined ){
            this.optionsKontainer = Object.create(kontainer);
        }
        if( this.optionsKontainer !== undefined ) {
            this.optionsKontainer.ref(this.refOptionsString);
            this.optionsKontainer.obj(this.refObject);
        }
        return this;
    },
    setOptionsRef: function(refString){
        this.refOptionsString = refString;
        if( this.optionsKontainer === undefined && this.refObject !== undefined ){
            this.optionsKontainer = Object.create(kontainer);
        }
        if( this.optionsKontainer !== undefined ) {
            this.optionsKontainer.ref(this.refOptionsString);
            this.optionsKontainer.obj(this.refObject);
        }

        return this;
    },
};
for( var id in wrapper_prototype ) {
    if( wrapper_prototype.hasOwnProperty(id) ) {
        selector_prototype[id] = wrapper_prototype[id];
    }
}

var selector = function(){
    var s = Object.create(selector_prototype);
    s.type = 'selector';
    s.elem= document.createElement('select');
    s.elem.setAttribute('class', 'selector_menu');

    return s;
};





var value_prototype = {
    update: function(){
        //console.log('running value update', this)
        /*
        if( this.g_update !== undefined ){
            this.g_update();
        }
        */
       var decimals = this.decimals || 3;
        if( typeof this.kontainer !== 'undefined' ){
            this.value = this.kontainer.get();
            //console.log('updating value', this.value)
        }
        if( isNaN(Number(this.value)) ){
            this.elem.innerHTML = this.value;
        } else {
            this.elem.innerHTML = Number(this.value).toFixed(decimals);
            if( this.min !== undefined && this.value <= this.min ) {
                this.attr('class', 'valueOutOfRange');
            } else if( this.max !== undefined && this.value >= this.max ) {
                this.attr('class', 'valueOutOfRange');
            } else {
                this.attr('class', '');
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
//    setUpdate: function(update_function){
//        this.g_update = update_function;
//    },
    setRef: function(refString){
        this.refString = refString;
        if( this.kontainer === undefined && this.refObject !== undefined ){
            this.kontainer = Object.create(kontainer);
        }
        if( this.kontainer !== undefined ) {
            this.kontainer.ref(this.refString);
            this.kontainer.obj(this.refObject);
        }

        return this;
    },
    setRefObj: function(refObject){
        this.refObject = refObject;
        if( this.kontainer === undefined && this.refString !== undefined ){
            this.kontainer = Object.create(kontainer);
        }
        if( this.kontainer !== undefined ) {
            this.kontainer.ref(this.refString);
            this.kontainer.obj(this.refObject);
        }
        return this;
    },
    setMax: function(value){
        this.max = value;
        this.update();
        return this;
    },
    setMin: function(value){
        this.min = value;
        this.update();
        return this;
    },
    setDecimals: function(n){
        this.decimals = n;
        this.update();
        return this;
    },
};
for( var id in wrapper_prototype ) {
    if( wrapper_prototype.hasOwnProperty(id) ) {
        value_prototype[id] = wrapper_prototype[id];
    }
}



function value() {
    var v = Object.create(value_prototype);
    v.type = 'value';
    v.elem = document.createElement('span');

    v.value = '-';
    v.innerHTML = v.value;
    v.reference = false;


    v.update();

    return v;
}



// Browserify
module.exports.selector = selector;
module.exports.value = value;
//module.exports.$ = $;

},{"./k.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/k.js","./k_DOM.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/k_DOM.js","./kontainer":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/kontainer.js","./wrapper_prototype":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/wrapper_prototype.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/kontainer.js":[function(require,module,exports){
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

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/wrapper_prototype.js":[function(require,module,exports){
var wrapper_prototype = {

    html: function(html){
       this.elem.innerHTML = html;
       return this;
    },
    href: function(link){
       this.elem.href = link;
       return this;
    },
    append: function(sub_element){
        this.get(0).appendChild(sub_element.elem);
        return this;
    },
    appendTo: function(parent_element){
        //parent_element.append(this);
        parent_element.get(0).appendChild(this.elem);
        return this;
    },
    attr: function(name, value){
        var attributeName;
        if( name === 'class'){
            attributeName = 'className';
        } else {
            attributeName = name;
        }
        this.elem[attributeName] = value;
        return this;
    },
    click: function(clickFunction){
        console.log('setting click to ', typeof clickFunction, clickFunction)
        this.elem.addEventListener("click", function(){ clickFunction(); }, false);
        return this;
    },
    show: function(){
        this.elem.style.display = 'inline';
        return this;
    },
    hide: function(){
        this.elem.style.display = 'none';
        return this;
    },
    style: function(field, value){
        this.elem.style[field] = value;
        return this;
    },
    css: function(field, value){
        this.elem.style[field] = value;
        return this;
    },
    /*
    /*
    pushTo: function(array){
        array.push(this);
    }
    */
    get: function(i){
        return this.elem
}

};

module.exports = wrapper_prototype;

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/main.js":[function(require,module,exports){
'use strict';
//var version_string = 'Dev';
//var version_string = 'Alpha201401--';
var version_string = 'Preview'+moment().format('YYYYMMDD');

// Moved to index.html
// TODO: look into ways to further reduce size. It seems way to big.
//var _ = require('underscore');
//var moment = require('moment');
//var $ = require('jquery');

var k = require('./lib/k/k.js');
//var k_data = require('./lib/k/k_data');

var settings = require('./app/settings');
window.g = settings;
settings.state.version_string = version_string;
console.log('settings', settings);

var mk_page = {};
mk_page[1] = require('./app/mk_page_1');
mk_page[2] = require('./app/mk_page_2');
mk_page[3] = require('./app/mk_page_3');

var mk_preview = {};
mk_preview[1] = require('./app/mk_page_preview_1');
mk_preview[2] = require('./app/mk_page_preview_2');

var mk_svg= require('./app/mk_svg');
//var mk_pdf = require('./app/mk_pdf.js');
var settings_update = require('./app/settings_update');



var f = require('./app/functions');
f.settings = settings;
settings.f = f;

//var database_json_URL = 'http://10.173.64.204:8000/temporary/';
var database_json_URL = 'data/fsec_copy.json';

var components = settings.components;
var system = settings.system;


var query = f.query_string();
//console.log(query);
if( query['mode'] === "dev" ) {
    g.state.mode = 'dev';
} else {
    g.state.mode = 'release';
}



$.getJSON( database_json_URL)
    .done(function(json){
        settings.database = json;
        //console.log('database loaded', settings.database);
        f.load_database(json);
        settings.state.database_loaded = true;
        update();
        //console.log( 'settings.elements', JSON.stringify(settings.elements, null, 4));
        //console.log( 'system', JSON.stringify(settings.system, null, 4));
        //console.log( 'inputs', JSON.stringify(settings.inputs, null, 4));
        //console.log( 'drawing', JSON.stringify(settings.drawing, null, 4));
    });


var active_section = g.webpage.sections[0];

var update = settings.update = function(){
    console.log('/--- begin update');
    f.clear_drawing();


    settings.select_registry.forEach(function(selector){
        //console.log(selector.value());
        if(selector.value()) selector.system_ref.set(selector.value());
        //if(selector.value()) selector.input_ref.set(selector.value());
        //console.log(selector.set_ref.refString, selector.value(), selector.set_ref.get());

    });


    //copy inputs from settings.input to settings.system.


    settings_update(settings);

    settings.select_registry.forEach(function(selector){
        if( selector.type === 'select' ){
            f.selector_add_options(selector);
        } else if( selector.type === 'input' ) {
            selector.elem.value = selector.system_ref.get();
        }
    });

    settings.value_registry.forEach(function(value_item){
        value_item.elem.innerHTML = value_item.value_ref.get();
    });

    // Determine active section based on section inputs entered by user
    var sections = g.webpage.sections;
    sections.every(function(section_name,id){ //TODO: find pre IE9 way to do this?
        if( ! g.f.section_defined(section_name) ){
            active_section = section_name;
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
            $('.input_section#'+section_name).children('.drawer').children('.drawer_content').slideDown('fast');
        } else if( ! g.webpage.selections_manual_toggled[section_name] ){
            $('.input_section#'+section_name).children('.drawer').children('.drawer_content').slideUp('fast');
        }
    });



    // Make preview
    settings.drawing.preview_parts = {};
    settings.drawing.preview_svgs = {};
    $('#drawing_preview').empty().html('');
    for( var p in mk_preview ){
        settings.drawing.preview_parts[p] = mk_preview[p](settings);
        settings.drawing.preview_svgs[p] = mk_svg(settings.drawing.preview_parts[p], settings);
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
    for( p in mk_page ){
        settings.drawing.parts[p] = mk_page[p](settings);
        settings.drawing.svgs[p] = mk_svg(settings.drawing.parts[p], settings);
        $('#drawing')
            //.append($('<p>Page '+p+'</p>'))
            .append($(settings.drawing.svgs[p]))
            .append($('</br>'))
            .append($('</br>'));

    }





    //*/
    //var pdf_download = mk_pdf(settings, setDownloadLink);
    //mk_pdf(settings, setDownloadLink);
    //pdf_download.html('Download PDF');
    //console.log(pdf_download);
    //if( settings.PDF && settings.PDF.url ){
    //    var link = $('a').attr('href', settings.PDF.url ).html('download..');
    //    $('#download').append(link);
    //}


    //k.show_hide_params(page_sections_params, settings);
//    show_hide_selections(page_sections_config, settings.state.active_section);

    //console.log( f.object_defined(settings.state) );

    //console.log( 'system', JSON.stringify(settings.system, null, 4));
    //console.log( 'inputs', JSON.stringify(settings.inputs, null, 4));
    //console.log( 'drawing', JSON.stringify(settings.drawing, null, 4));

    console.log('\\--- end update');
};
f.update = update;









// Dev settings
/*
if( version_string === 'Dev' && true ){
    for( var section in settings.state.sections ){
        settings.state.sections[section].ready = true;
        settings.state.sections[section].set = true;
    }
} else {
    settings.state.sections.modules.ready = true;
}
//*/
////////




function page_setup(settings){
    var system_frame_id = 'system_frame';
    var title = 'PV drawing test';

    k.setup_body(title);

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

    //console.log(section_selector);



    var location_div = $('<div>');

    var list_element = $('<ul>').appendTo(location_div);
    $('<li>').appendTo(list_element).append(
        $('<a>').text('Wind Zone ').attr('href', 'http://www.solarabcs.org/about/publications/reports/expedited-permit/map/index.html')
    );
    $('<li>').appendTo(list_element).append(
        $('<a>').text('Climate Conditions').attr('href', 'http://windspeed.atcouncil.org/')
    );
    $('<div>').appendTo(location_div).append(
        $('<iframe src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d3603459.854089046!2d-81.37028081834715!3d28.115916011428208!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1421954460385" width="485" height="300" frameborder="0" style="border:0"></iframe>')
    );

    var location_drawer = f.mk_drawer('Location', location_div);
    location_drawer.appendTo(config_frame);


    f.add_selectors(settings, config_frame);

    // Parameters and specifications
    /*
    $('<div>').html('System Parameters').attr('class', 'section_title').appendTo(system_frame);
    var params_container = $('<div>').attr('class', 'section');
    params_container.appendTo(system_frame);
    f.add_params( settings, params_container );
    //*/

    //TODO: add svg display of modules
    // http://quote.snapnrack.com/ui/o100.php#step-2

    // drawing
    //var drawing = $('div').attr('id', 'drawing_frame').attr('class', 'section').appendTo(page);


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
        .attr('href', 'data/sample.pdf')
        .attr('id', 'download')
        .attr('class', 'float_right')
        .appendTo(drawing_section);

    var svg_container_object = $('<div>').attr('id', 'drawing').attr('class', 'drawing').css('clear', 'both').appendTo(drawing_section);
    //svg_container_object.style('width', settings.drawing_settings.size.drawing.w+'px' )
    //var svg_container = svg_container_object.elem;
    $('<br>').appendTo(drawing_section);

    ///////////////////
    $('<div>').html(' ').attr('class', 'section_title').appendTo(drawing_section);

}

page_setup(settings);

var boot_time = moment();
var status_id = 'status';
setInterval(function(){ k.update_status_page(status_id, boot_time, version_string);},1000);

update();

//console.log('window', window);

},{"./app/functions":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/functions.js","./app/mk_page_1":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_1.js","./app/mk_page_2":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_2.js","./app/mk_page_3":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_3.js","./app/mk_page_preview_1":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_preview_1.js","./app/mk_page_preview_2":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_preview_2.js","./app/mk_svg":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_svg.js","./app/settings":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings.js","./app/settings_update":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings_update.js","./lib/k/k.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/k.js"}]},{},["/home/kshowalter/Dropbox/server/express_default/public/plans_machine/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9mdW5jdGlvbnMuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvbWtfYm9yZGVyLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvYXBwL21rX2RyYXdpbmcuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvbWtfcGFnZV8xLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvYXBwL21rX3BhZ2VfMi5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19wYWdlXzMuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvbWtfcGFnZV9wcmV2aWV3XzEuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvbWtfcGFnZV9wcmV2aWV3XzIuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvbWtfc3ZnLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvYXBwL3NldHRpbmdzLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvYXBwL3NldHRpbmdzX2RyYXdpbmcuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvc2V0dGluZ3NfZm9udHMuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvc2V0dGluZ3NfbGF5ZXJzLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvYXBwL3NldHRpbmdzX3VwZGF0ZS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2RhdGEvdGFibGVzLmpzb24iLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9saWIvay9rLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvbGliL2sva19ET00uanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9saWIvay9rX0RPTV9leHRyYS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2xpYi9rL2tvbnRhaW5lci5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2xpYi9rL3dyYXBwZXJfcHJvdG90eXBlLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeGtCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDejVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuLy92YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xudmFyIGskID0gcmVxdWlyZSgnLi4vbGliL2sva19ET00nKTtcbnZhciBrID0gcmVxdWlyZSgnLi4vbGliL2svaycpO1xudmFyIGtvbnRhaW5lciA9IHJlcXVpcmUoJy4uL2xpYi9rL2tvbnRhaW5lcicpO1xuXG52YXIgZiA9IHt9O1xuXG5mLm9ial9uYW1lcyA9IGZ1bmN0aW9uKCBvYmplY3QgKSB7XG4gICAgaWYoIG9iamVjdCAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICB2YXIgYSA9IFtdO1xuICAgICAgICBmb3IoIHZhciBpZCBpbiBvYmplY3QgKSB7XG4gICAgICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGlkKSApICB7XG4gICAgICAgICAgICAgICAgYS5wdXNoKGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG59O1xuXG5mLm9iamVjdF9kZWZpbmVkID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICAvL2NvbnNvbGUubG9nKG9iamVjdCk7XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdCApe1xuICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coa2V5KTtcbiAgICAgICAgICAgIGlmKCBvYmplY3Rba2V5XSA9PT0gbnVsbCB8fCBvYmplY3Rba2V5XSA9PT0gdW5kZWZpbmVkICkgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufTtcblxuZi5zZWN0aW9uX2RlZmluZWQgPSBmdW5jdGlvbihzZWN0aW9uX25hbWUpe1xuICAgIC8vY29uc29sZS5sb2coXCItXCIrc2VjdGlvbl9uYW1lKTtcbiAgICAvL3ZhciBpbnB1dF9zZWN0aW9uID0gZy5pbnB1dHNbc2VjdGlvbl9uYW1lXTtcbiAgICB2YXIgb3V0cHV0X3NlY3Rpb24gPSBnLnN5c3RlbVtzZWN0aW9uX25hbWVdO1xuICAgIGZvciggdmFyIGtleSBpbiBvdXRwdXRfc2VjdGlvbiApe1xuICAgICAgICBpZiggb3V0cHV0X3NlY3Rpb24uaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhrZXkpO1xuXG4gICAgICAgICAgICBpZiggb3V0cHV0X3NlY3Rpb25ba2V5XSA9PT0gdW5kZWZpbmVkIHx8IG91dHB1dF9zZWN0aW9uW2tleV0gPT09IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufTtcblxuZi5udWxsVG9PYmplY3QgPSBmdW5jdGlvbihvYmplY3Qpe1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QgKXtcbiAgICAgICAgaWYoIG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpICl7XG4gICAgICAgICAgICBpZiggb2JqZWN0W2tleV0gPT09IG51bGwgKXtcbiAgICAgICAgICAgICAgICBvYmplY3Rba2V5XSA9IHt9O1xuICAgICAgICAgICAgfSBlbHNlIGlmKCB0eXBlb2Ygb2JqZWN0W2tleV0gPT09ICdvYmplY3QnICkge1xuICAgICAgICAgICAgICAgIG9iamVjdFtrZXldID0gZi5udWxsVG9PYmplY3Qob2JqZWN0W2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG59O1xuXG5mLmJsYW5rX2NvcHkgPSBmdW5jdGlvbihvYmplY3Qpe1xuICAgIHZhciBuZXdPYmplY3QgPSB7fTtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0ICl7XG4gICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgaWYoIG9iamVjdFtrZXldLmNvbnN0cnVjdG9yID09PSBPYmplY3QgKSB7XG4gICAgICAgICAgICAgICAgbmV3T2JqZWN0W2tleV0gPSB7fTtcbiAgICAgICAgICAgICAgICBmb3IoIHZhciBrZXkyIGluIG9iamVjdFtrZXldICl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCBvYmplY3Rba2V5XS5oYXNPd25Qcm9wZXJ0eShrZXkyKSApe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0W2tleV1ba2V5Ml0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdPYmplY3Rba2V5XSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld09iamVjdDtcbn07XG5cbmYuYmxhbmtfY2xlYW5fY29weSA9IGZ1bmN0aW9uKG9iamVjdCl7XG4gICAgdmFyIG5ld09iamVjdCA9IHt9O1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QgKXtcbiAgICAgICAgaWYoIG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpICl7XG4gICAgICAgICAgICBpZiggb2JqZWN0W2tleV0uY29uc3RydWN0b3IgPT09IE9iamVjdCApIHtcbiAgICAgICAgICAgICAgICBuZXdPYmplY3Rba2V5XSA9IHt9O1xuICAgICAgICAgICAgICAgIGZvciggdmFyIGtleTIgaW4gb2JqZWN0W2tleV0gKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIG9iamVjdFtrZXldLmhhc093blByb3BlcnR5KGtleTIpICl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xlYW5fa2V5ID0gZi5jbGVhbl9uYW1lKGtleTIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0W2tleV1bY2xlYW5fa2V5XSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3T2JqZWN0O1xufTtcblxuZi5tZXJnZV9vYmplY3RzID0gZnVuY3Rpb24gbWVyZ2Vfb2JqZWN0cyhvYmplY3QxLCBvYmplY3QyKXtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0MSApe1xuICAgICAgICBpZiggb2JqZWN0MS5oYXNPd25Qcm9wZXJ0eShrZXkpICl7XG4gICAgICAgICAgICAvL2lmKCBrZXkgPT09ICdtYWtlJyApIGNvbnNvbGUubG9nKGtleSwgb2JqZWN0MSwgdHlwZW9mIG9iamVjdDFba2V5XSwgdHlwZW9mIG9iamVjdDJba2V5XSk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGtleSwgb2JqZWN0MSwgdHlwZW9mIG9iamVjdDFba2V5XSwgdHlwZW9mIG9iamVjdDJba2V5XSk7XG4gICAgICAgICAgICBpZiggb2JqZWN0MVtrZXldICYmIG9iamVjdDFba2V5XS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICkge1xuICAgICAgICAgICAgICAgIGlmKCBvYmplY3QyW2tleV0gPT09IHVuZGVmaW5lZCApIG9iamVjdDJba2V5XSA9IHt9O1xuICAgICAgICAgICAgICAgIG1lcmdlX29iamVjdHMoIG9iamVjdDFba2V5XSwgb2JqZWN0MltrZXldICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmKCBvYmplY3QyW2tleV0gPT09IHVuZGVmaW5lZCApIG9iamVjdDJba2V5XSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5mLmFycmF5X3RvX29iamVjdCA9IGZ1bmN0aW9uKGFycikge1xuICAgIHZhciByID0ge307XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpXG4gICAgICAgIHJbaV0gPSBhcnJbaV07XG4gICAgcmV0dXJuIHI7XG59O1xuXG5mLm5hbl9jaGVjayA9IGZ1bmN0aW9uIG5hbl9jaGVjayhvYmplY3QsIHBhdGgpe1xuICAgIGlmKCBwYXRoID09PSB1bmRlZmluZWQgKSBwYXRoID0gXCJcIjtcbiAgICBwYXRoID0gcGF0aCtcIi5cIjtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0ICl7XG4gICAgICAgIC8vY29uc29sZS5sb2coIFwiTmFOY2hlY2s6IFwiK3BhdGgra2V5ICk7XG5cbiAgICAgICAgaWYoIG9iamVjdFtrZXldICYmIG9iamVjdFtrZXldLmNvbnN0cnVjdG9yID09PSBBcnJheSApIG9iamVjdFtrZXldID0gZi5hcnJheV90b19vYmplY3Qob2JqZWN0W2tleV0pO1xuXG5cbiAgICAgICAgaWYoICBvYmplY3Rba2V5XSAmJiAoIG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpIHx8IG9iamVjdFtrZXldICE9PSBudWxsICkpe1xuICAgICAgICAgICAgaWYoIG9iamVjdFtrZXldLmNvbnN0cnVjdG9yID09PSBPYmplY3QgKXtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCBcIiAgT2JqZWN0OiBcIitwYXRoK2tleSApO1xuICAgICAgICAgICAgICAgIG5hbl9jaGVjayggb2JqZWN0W2tleV0sIHBhdGgra2V5ICk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoIG9iamVjdFtrZXldID09PSBOYU4gfHwgb2JqZWN0W2tleV0gPT09IG51bGwgKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggXCJOYU46IFwiK3BhdGgra2V5ICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coIFwiRGVmaW5lZDogXCIrcGF0aCtrZXksIG9iamVjdFtrZXldKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG59O1xuXG5mLnN0cl90b19udW0gPSBmdW5jdGlvbiBzdHJfdG9fbnVtKGlucHV0KXtcbiAgICB2YXIgb3V0cHV0O1xuICAgIGlmKCFpc05hTihpbnB1dCkpIG91dHB1dCA9IE51bWJlcihpbnB1dCk7XG4gICAgZWxzZSBvdXRwdXQgPSBpbnB1dDtcbiAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuXG5mLnByZXR0eV93b3JkID0gZnVuY3Rpb24obmFtZSl7XG4gICAgcmV0dXJuIG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnNsaWNlKDEpO1xufTtcblxuZi5wcmV0dHlfbmFtZSA9IGZ1bmN0aW9uKG5hbWUpe1xuICAgIHZhciBsID0gbmFtZS5zcGxpdCgnXycpO1xuICAgIGwuZm9yRWFjaChmdW5jdGlvbihuYW1lX3NlcW1lbnQsaSl7XG4gICAgICAgIGxbaV0gPSBmLnByZXR0eV93b3JkKG5hbWVfc2VxbWVudCk7XG4gICAgfSk7XG4gICAgdmFyIHByZXR0eSA9IGwuam9pbignICcpO1xuXG4gICAgcmV0dXJuIHByZXR0eTtcbn07XG5cbmYucHJldHR5X25hbWVzID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICB2YXIgbmV3X29iamVjdCA9IHt9O1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QgKXtcbiAgICAgICAgaWYoIG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpICl7XG4gICAgICAgICAgICB2YXIgbmV3X2tleSA9IGYucHJldHR5X25hbWUoa2V5KTtcbiAgICAgICAgICAgIG5ld19vYmplY3RbbmV3X2tleV0gPSBvYmplY3Rba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3X29iamVjdDtcbn07XG5cbmYuY2xlYW5fbmFtZSA9IGZ1bmN0aW9uKG5hbWUpe1xuICAgIHJldHVybiBuYW1lLnNwbGl0KCcgJylbMF07XG59O1xuXG4vKlxuZi5rZWxlbV9zZXR1cCA9IGZ1bmN0aW9uKGtlbGVtLCBzZXR0aW5ncyl7XG4gICAgaWYoICFzZXR0aW5ncykgY29uc29sZS5sb2coc2V0dGluZ3MpO1xuICAgIGlmKCBrZWxlbS50eXBlID09PSAnc2VsZWN0b3InICl7XG4gICAgICAgIGtlbGVtLnNldFJlZk9iaihzZXR0aW5ncyk7XG4gICAgICAgIGtlbGVtLnNldFVwZGF0ZShzZXR0aW5ncy51cGRhdGUpO1xuICAgICAgICBzZXR0aW5ncy5zZWxlY3RfcmVnaXN0cnkucHVzaChrZWxlbSk7XG4gICAgICAgIGtlbGVtLnVwZGF0ZSgpO1xuICAgIH0gZWxzZSBpZigga2VsZW0udHlwZSA9PT0gJ3ZhbHVlJyApe1xuICAgICAgICBrZWxlbS5zZXRSZWZPYmooc2V0dGluZ3MpO1xuICAgICAgICAvL2tlbGVtLnNldFVwZGF0ZShzZXR0aW5nc191cGRhdGUpO1xuICAgICAgICBzZXR0aW5ncy52YWx1ZV9yZWdpc3RyeS5wdXNoKGtlbGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIGtlbGVtO1xufTtcbiovXG4vL2Yuc2NvcGVfcHJlc2VydmVyID0gZnVuY3Rpb24odil7XG4vLyAgICByZXR1cm4gZnVuY3Rpb24oKXtcbi8vICAgICAgICByZXR1cm4gdjtcbi8vICAgIH07XG4vL307XG5cbmYubWtfZHJhd2VyID0gZnVuY3Rpb24odGl0bGUsIGNvbnRlbnQpe1xuICAgIHZhciBkcmF3ZXJfY29udGFpbmVyID0gJCgnPGRpdj4nKS5hdHRyKCdjbGFzcycsICdpbnB1dF9zZWN0aW9uJykuYXR0cignaWQnLCB0aXRsZSApO1xuICAgIC8vZHJhd2VyX2NvbnRhaW5lci5nZXQoMCkuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlfdHlwZTtcbiAgICB2YXIgc3lzdGVtX2RpdiA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAndGl0bGVfYmFyJylcbiAgICAgICAgLmF0dHIoJ2lkJywgJ3NlY3Rpb25fJyt0aXRsZSlcbiAgICAgICAgLmF0dHIoJ3NlY3Rpb25fbm9tJywgdGl0bGUpXG4gICAgICAgIC5hcHBlbmRUbyhkcmF3ZXJfY29udGFpbmVyKVxuICAgICAgICAvKiBqc2hpbnQgLVcwODMgKi9cbiAgICAgICAgLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgbmFtZSA9ICQodGhpcykuYXR0cignc2VjdGlvbl9ub20nKTtcbiAgICAgICAgICAgIGcud2VicGFnZS5zZWxlY3Rpb25zX21hbnVhbF90b2dnbGVkW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuY2hpbGRyZW4oJy5kcmF3ZXInKS5jaGlsZHJlbignLmRyYXdlcl9jb250ZW50Jykuc2xpZGVUb2dnbGUoJ2Zhc3QnKTtcbiAgICAgICAgfSk7XG4gICAgdmFyIHN5c3RlbV90aXRsZSA9ICQoJzxhPicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICd0aXRsZV9iYXJfdGV4dCcpXG4gICAgICAgIC5hdHRyKCdocmVmJywgJyMnKVxuICAgICAgICAudGV4dChmLnByZXR0eV9uYW1lKHRpdGxlKSlcbiAgICAgICAgLmFwcGVuZFRvKHN5c3RlbV9kaXYpO1xuXG4gICAgdmFyIGRyYXdlciA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAnZHJhd2VyJykuYXBwZW5kVG8oZHJhd2VyX2NvbnRhaW5lcik7XG4gICAgY29udGVudC5hdHRyKCdjbGFzcycsICdkcmF3ZXJfY29udGVudCcpLmFwcGVuZFRvKGRyYXdlcik7XG5cblxuICAgIHJldHVybiBkcmF3ZXJfY29udGFpbmVyO1xuXG5cbn07XG5cblxuZi5hZGRfc2VsZWN0b3JzID0gZnVuY3Rpb24oc2V0dGluZ3MsIHBhcmVudF9jb250YWluZXIpe1xuICAgIGZvciggdmFyIHNlY3Rpb25fbmFtZSBpbiBzZXR0aW5ncy5pbnB1dHMgKXtcblxuICAgICAgICAvLyQodGhpcykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgdmFyIGRyYXdlcl9jb250ZW50ID0gJCgnPGRpdj4nKTtcbiAgICAgICAgZm9yKCB2YXIgaW5wdXRfbmFtZSBpbiBzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXSApe1xuICAgICAgICAgICAgdmFyIHVuaXRzO1xuICAgICAgICAgICAgaWYoIChzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSAhPT0gdW5kZWZpbmVkKSAmJiAoc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0udW5pdHMgIT09IHVuZGVmaW5lZCkgKSB7XG4gICAgICAgICAgICAgICAgdW5pdHMgPSBcIihcIiArIHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdLnVuaXRzICsgXCIpXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHVuaXRzID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBub3RlO1xuICAgICAgICAgICAgaWYoIChzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSAhPT0gdW5kZWZpbmVkKSAmJiAoc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0ubm90ZSAhPT0gdW5kZWZpbmVkKSApIHtcbiAgICAgICAgICAgICAgICBub3RlID0gc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0ubm90ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbm90ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG5cblxuXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3Jfc2V0ID0gJCgnPHNwYW4+JykuYXR0cignY2xhc3MnLCAnc2VsZWN0b3Jfc2V0JykuYXBwZW5kVG8oZHJhd2VyX2NvbnRlbnQpO1xuICAgICAgICAgICAgdmFyIGlucHV0X3RleHQgPSAkKCc8c3Bhbj4nKS5odG1sKGYucHJldHR5X25hbWUoaW5wdXRfbmFtZSkgKyAnOiAnICsgdW5pdHMgKS5hcHBlbmRUbyhzZWxlY3Rvcl9zZXQpO1xuICAgICAgICAgICAgaWYoIG5vdGUgKSBpbnB1dF90ZXh0LmF0dHIoJ3RpdGxlJywgbm90ZSk7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gayQoJ3NlbGVjdG9yJylcbiAgICAgICAgICAgICAgICAuc2V0T3B0aW9uc1JlZiggJ2lucHV0cy4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSApXG4gICAgICAgICAgICAgICAgLnNldFJlZiggJ3N5c3RlbS4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSApXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKHNlbGVjdG9yX3NldCk7XG4gICAgICAgICAgICBmLmtlbGVtX3NldHVwKHNlbGVjdG9yLCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAvLyovXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgICAgc3lzdGVtX3JlZjogT2JqZWN0LmNyZWF0ZShrb250YWluZXIpLm9iaihzZXR0aW5ncykucmVmKCdzeXN0ZW0uJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUpLFxuICAgICAgICAgICAgICAgIC8vaW5wdXRfcmVmOiBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcikub2JqKHNldHRpbmdzKS5yZWYoJ2lucHV0cy4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSArICcudmFsdWUnKSxcbiAgICAgICAgICAgICAgICBsaXN0X3JlZjogT2JqZWN0LmNyZWF0ZShrb250YWluZXIpLm9iaihzZXR0aW5ncykucmVmKCdpbnB1dHMuJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUgKyAnLm9wdGlvbnMnKSxcbiAgICAgICAgICAgICAgICBpbnRlcmFjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiggKHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdICE9PSB1bmRlZmluZWQpICYmIChzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXS50eXBlICE9PSB1bmRlZmluZWQpICkge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLnR5cGUgPSBzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXS50eXBlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci50eXBlID0gJ3NlbGVjdCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiggc2VsZWN0b3IudHlwZSA9PT0gJ3NlbGVjdCcgKXtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci5lbGVtID0gJCgnPHNlbGVjdD4nKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnc2VsZWN0b3InKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oc2VsZWN0b3Jfc2V0KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KClbMF07XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IudmFsdWUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCB0aGlzLnNldF9yZWYucmVmU3RyaW5nLCB0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleCApO1xuICAgICAgICAgICAgICAgICAgICAvL2lmKCB0aGlzLmludGVyYWN0ZWQgKVxuICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXggPj0gMCkgcmV0dXJuIHRoaXMuZWxlbS5vcHRpb25zW3RoaXMuZWxlbS5zZWxlY3RlZEluZGV4XS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBmLnNlbGVjdG9yX2FkZF9vcHRpb25zKHNlbGVjdG9yKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmKCBzZWxlY3Rvci50eXBlID09PSAnaW5wdXQnICl7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IuZWxlbSA9ICQoJzxpbnB1dD4nKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnbnVtYmVyX2lucHV0JylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3R5cGUnLCAndGV4dCcpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhzZWxlY3Rvcl9zZXQpXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoKVswXTtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci52YWx1ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coIHRoaXMuc2V0X3JlZi5yZWZTdHJpbmcsIHRoaXMuZWxlbS5zZWxlY3RlZEluZGV4ICk7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coIHRoaXMuZWxlbSwgdGhpcy5lbGVtLnZhbHVlICk7XG4gICAgICAgICAgICAgICAgICAgIC8vaWYoIHRoaXMuaW50ZXJhY3RlZCApXG4gICAgICAgICAgICAgICAgICAgIC8vaWYoIHRoaXMuZWxlbS5zZWxlY3RlZEluZGV4ID49IDApIHJldHVybiB0aGlzLmVsZW0ub3B0aW9uc1t0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIC8vZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW0udmFsdWU7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci5lbGVtLnZhbHVlID0gc2VsZWN0b3Iuc3lzdGVtX3JlZi5nZXQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoc2VsZWN0b3IuZWxlbSkuY2hhbmdlKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5mLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZXR0aW5ncy5zZWxlY3RfcmVnaXN0cnkucHVzaChzZWxlY3Rvcik7XG4gICAgICAgICAgICAvLyQoJzwvYnI+JykuYXBwZW5kVG8oZHJhd2VyX2NvbnRlbnQpO1xuXG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2VsZWN0aW9uX2NvbnRhaW5lciA9IGYubWtfZHJhd2VyKHNlY3Rpb25fbmFtZSwgZHJhd2VyX2NvbnRlbnQpO1xuXG4gICAgICAgIHNlbGVjdGlvbl9jb250YWluZXIuYXBwZW5kVG8ocGFyZW50X2NvbnRhaW5lcik7XG5cbiAgICAgICAgJChzZWxlY3Rpb25fY29udGFpbmVyKS5jaGlsZHJlbignLmRyYXdlcicpLmNoaWxkcmVuKCcuZHJhd2VyX2NvbnRlbnQnKS5zbGlkZVVwKCdmYXN0Jyk7XG4gICAgfVxufTtcblxuZi5zZWxlY3Rvcl9hZGRfb3B0aW9ucyA9IGZ1bmN0aW9uKHNlbGVjdG9yKXtcbiAgICB2YXIgbGlzdCA9IHNlbGVjdG9yLmxpc3RfcmVmLmdldCgpO1xuICAgIGlmKCBsaXN0ICYmIGxpc3QuY29uc3RydWN0b3IgPT09IE9iamVjdCApIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnXCJsaXN0XCInLCBsaXN0KTtcbiAgICAgICAgbGlzdCA9IGYub2JqX25hbWVzKGxpc3QpO1xuICAgIH1cbiAgICBzZWxlY3Rvci5lbGVtLmlubmVySFRNTCA9IFwiXCI7XG4gICAgaWYoIGxpc3QgaW5zdGFuY2VvZiBBcnJheSApe1xuICAgICAgICB2YXIgY3VycmVudF92YWx1ZSA9IHNlbGVjdG9yLnN5c3RlbV9yZWYuZ2V0KCk7XG4gICAgICAgICQoJzxvcHRpb24+JykuYXR0cignc2VsZWN0ZWQnLHRydWUpLmF0dHIoJ2Rpc2FibGVkJyx0cnVlKS5hdHRyKCdoaWRkZW4nLHRydWUpLmFwcGVuZFRvKHNlbGVjdG9yLmVsZW0pO1xuXG4gICAgICAgIGxpc3QuZm9yRWFjaChmdW5jdGlvbihvcHRfbmFtZSl7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKG9wdF9uYW1lKTtcbiAgICAgICAgICAgIHZhciBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICBvLnZhbHVlID0gb3B0X25hbWU7XG4gICAgICAgICAgICBpZiggY3VycmVudF92YWx1ZSApe1xuICAgICAgICAgICAgICAgIGlmKCBvcHRfbmFtZS50b1N0cmluZygpID09PSBjdXJyZW50X3ZhbHVlLnRvU3RyaW5nKCkgKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2ZvdW5kIGl0OicsIG9wdF9uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgby5zZWxlY3RlZCA9IFwic2VsZWN0ZWRcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdkb2VzIG5vdCBtYXRjaDogJywgb3B0X25hbWUsIFwiLFwiLCAgY3VycmVudF92YWx1ZSwgXCIuXCIgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9vLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VsZWN0b3Jfb3B0aW9uJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ25vIGN1cnJlbnQgdmFsdWUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgby5pbm5lckhUTUwgPSBvcHRfbmFtZTtcbiAgICAgICAgICAgIHNlbGVjdG9yLmVsZW0uYXBwZW5kQ2hpbGQobyk7XG4gICAgICAgIH0pO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnbGlzdCBub3QgYSBsaXN0JywgbGlzdCwgc2VsZWN0KTtcbiAgICB9XG59O1xuXG5mLmFkZF9vcHRpb25zID0gZnVuY3Rpb24oc2VsZWN0LCBhcnJheSl7XG4gICAgYXJyYXkuZm9yRWFjaCggZnVuY3Rpb24ob3B0aW9uKXtcbiAgICAgICAgJCgnPG9wdGlvbj4nKS5hdHRyKCAndmFsdWUnLCBvcHRpb24gKS50ZXh0KG9wdGlvbikuYXBwZW5kVG8oc2VsZWN0KTtcbiAgICB9KTtcbn07XG5cbmYuYWRkX3BhcmFtcyA9IGZ1bmN0aW9uKHNldHRpbmdzLCBwYXJlbnRfY29udGFpbmVyKXtcbiAgICBmb3IoIHZhciBzZWN0aW9uX25hbWUgaW4gc2V0dGluZ3Muc3lzdGVtICl7XG4gICAgICAgIGlmKCB0cnVlIHx8IGYub2JqZWN0X2RlZmluZWQoc2V0dGluZ3Muc3lzdGVtW3NlY3Rpb25fbmFtZV0pICl7XG4gICAgICAgICAgICB2YXIgc2VsZWN0aW9uX2NvbnRhaW5lciA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAncGFyYW1fc2VjdGlvbicpLmF0dHIoJ2lkJywgc2VjdGlvbl9uYW1lICkuYXBwZW5kVG8ocGFyZW50X2NvbnRhaW5lcik7XG4gICAgICAgICAgICAvL3NlbGVjdGlvbl9jb250YWluZXIuZ2V0KDApLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5X3R5cGU7XG4gICAgICAgICAgICB2YXIgc3lzdGVtX2RpdiA9ICQoJzxkaXY+JylcbiAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAndGl0bGVfbGluZScpXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKHNlbGVjdGlvbl9jb250YWluZXIpXG4gICAgICAgICAgICAgICAgLyoganNoaW50IC1XMDgzICovXG4gICAgICAgICAgICAgICAgLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuY2hpbGRyZW4oJy5kcmF3ZXInKS5jaGlsZHJlbignLmRyYXdlcl9jb250ZW50Jykuc2xpZGVUb2dnbGUoJ2Zhc3QnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBzeXN0ZW1fdGl0bGUgPSAkKCc8YT4nKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd0aXRsZV9saW5lX3RleHQnKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdocmVmJywgJyMnKVxuICAgICAgICAgICAgICAgIC50ZXh0KGYucHJldHR5X25hbWUoc2VjdGlvbl9uYW1lKSlcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8oc3lzdGVtX2Rpdik7XG4gICAgICAgICAgICAkKHRoaXMpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICB2YXIgZHJhd2VyID0gJCgnPGRpdj4nKS5hdHRyKCdjbGFzcycsICcnKS5hcHBlbmRUbyhzZWxlY3Rpb25fY29udGFpbmVyKTtcbiAgICAgICAgICAgIHZhciBkcmF3ZXJfY29udGVudCA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAncGFyYW1fc2VjdGlvbl9jb250ZW50JykuYXBwZW5kVG8oZHJhd2VyKTtcbiAgICAgICAgICAgIGZvciggdmFyIGlucHV0X25hbWUgaW4gc2V0dGluZ3Muc3lzdGVtW3NlY3Rpb25fbmFtZV0gKXtcbiAgICAgICAgICAgICAgICAkKCc8c3Bhbj4nKS5odG1sKGYucHJldHR5X25hbWUoaW5wdXRfbmFtZSkgKyAnOiAnKS5hcHBlbmRUbyhkcmF3ZXJfY29udGVudCk7XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0b3IgPSBrJCgndmFsdWUnKVxuICAgICAgICAgICAgICAgICAgICAvLy5zZXRPcHRpb25zUmVmKCAnaW5wdXRzLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lIClcbiAgICAgICAgICAgICAgICAgICAgLnNldFJlZiggJ3N5c3RlbS4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSApXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhkcmF3ZXJfY29udGVudCk7XG4gICAgICAgICAgICAgICAgZi5rZWxlbV9zZXR1cChzZWxlY3Rvciwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgIC8vKi9cbiAgICAgICAgICAgICAgICB2YXIgdmFsdWVfa29udGFpbmVyID0gT2JqZWN0LmNyZWF0ZShrb250YWluZXIpXG4gICAgICAgICAgICAgICAgICAgIC5vYmooc2V0dGluZ3MpXG4gICAgICAgICAgICAgICAgICAgIC5yZWYoJ3N5c3RlbS4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSk7XG4gICAgICAgICAgICAgICAgdmFyICRlbGVtID0gJCgnPHNwYW4+JylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJycpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhkcmF3ZXJfY29udGVudClcbiAgICAgICAgICAgICAgICAgICAgLnRleHQodmFsdWVfa29udGFpbmVyLmdldCgpKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW06ICRlbGVtLmdldCgpWzBdLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZV9yZWY6IHZhbHVlX2tvbnRhaW5lclxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgc2V0dGluZ3MudmFsdWVfcmVnaXN0cnkucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgJCgnPC9icj4nKS5hcHBlbmRUbyhkcmF3ZXJfY29udGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5mLnVwZGF0ZV92YWx1ZXMgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgc2V0dGluZ3MudmFsdWVfcmVnaXN0cnkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZV9pdGVtKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggdmFsdWVfaXRlbSApO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCB2YWx1ZV9pdGVtLmVsZW0ub3B0aW9ucyApO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCB2YWx1ZV9pdGVtLmVsZW0uc2VsZWN0ZWRJbmRleCApO1xuICAgICAgICBpZih2YWx1ZV9pdGVtLmVsZW0uc2VsZWN0ZWRJbmRleCl7XG4gICAgICAgICAgICB2YWx1ZV9pdGVtLnZhbHVlID0gdmFsdWVfaXRlbS5lbGVtLm9wdGlvbnNbdmFsdWVfaXRlbS5lbGVtLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuICAgICAgICAgICAgdmFsdWVfaXRlbS5rb250YWluZXIuc2V0KHZhbHVlX2l0ZW0udmFsdWUpO1xuXG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbmYuc2hvd19oaWRlX3BhcmFtcyA9IGZ1bmN0aW9uKHBhZ2Vfc2VjdGlvbnMsIHNldHRpbmdzKXtcbiAgICBmb3IoIHZhciBsaXN0X25hbWUgaW4gcGFnZV9zZWN0aW9ucyApe1xuICAgICAgICB2YXIgaWQgPSAnIycrbGlzdF9uYW1lO1xuICAgICAgICB2YXIgc2VjdGlvbl9uYW1lID0gbGlzdF9uYW1lLnNwbGl0KCdfJylbMF07XG4gICAgICAgIHZhciBzZWN0aW9uID0gayQoaWQpO1xuICAgICAgICBpZiggc2V0dGluZ3Muc3RhdHVzLnNlY3Rpb25zW3NlY3Rpb25fbmFtZV0uc2V0ICkgc2VjdGlvbi5zaG93KCk7XG4gICAgICAgIGVsc2Ugc2VjdGlvbi5oaWRlKCk7XG4gICAgfVxufTtcblxuZi5zaG93X2hpZGVfc2VsZWN0aW9ucyA9IGZ1bmN0aW9uKHNldHRpbmdzLCBhY3RpdmVfc2VjdGlvbl9uYW1lKXtcbiAgICAkKCcjc2VjdGlvblNlbGVjdG9yJykudmFsKGFjdGl2ZV9zZWN0aW9uX25hbWUpO1xuICAgIGZvciggdmFyIGxpc3RfbmFtZSBpbiBzZXR0aW5ncy5pbnB1dCApe1xuICAgICAgICB2YXIgaWQgPSAnIycrbGlzdF9uYW1lO1xuICAgICAgICB2YXIgc2VjdGlvbl9uYW1lID0gbGlzdF9uYW1lLnNwbGl0KCdfJylbMF07XG4gICAgICAgIHZhciBzZWN0aW9uID0gayQoaWQpO1xuICAgICAgICBpZiggc2VjdGlvbl9uYW1lID09PSBhY3RpdmVfc2VjdGlvbl9uYW1lICkgc2VjdGlvbi5zaG93KCk7XG4gICAgICAgIGVsc2Ugc2VjdGlvbi5oaWRlKCk7XG4gICAgfVxufTtcblxuLy9mLnNldERvd25sb2FkTGluayhzZXR0aW5ncyl7XG4vL1xuLy8gICAgaWYoIHNldHRpbmdzLlBERiAmJiBzZXR0aW5ncy5QREYudXJsICl7XG4vLyAgICAgICAgdmFyIGxpbmsgPSAkKCdhJykuYXR0cignaHJlZicsIHNldHRpbmdzLlBERi51cmwgKS5hdHRyKCdkb3dubG9hZCcsICdQVl9kcmF3aW5nLnBkZicpLmh0bWwoJ0Rvd25sb2FkIERyYXdpbmcnKTtcbi8vICAgICAgICAkKCcjZG93bmxvYWQnKS5odG1sKCcnKS5hcHBlbmQobGluayk7XG4vLyAgICB9XG4vL31cblxuZi5sb2FkVGFibGVzID0gZnVuY3Rpb24oc3RyaW5nKXtcbiAgICB2YXIgdGFibGVzID0ge307XG4gICAgdmFyIGwgPSBzdHJpbmcuc3BsaXQoJ1xcbicpO1xuICAgIHZhciB0aXRsZTtcbiAgICB2YXIgZmllbGRzO1xuICAgIHZhciBuZWVkX3RpdGxlID0gdHJ1ZTtcbiAgICB2YXIgbmVlZF9maWVsZHMgPSB0cnVlO1xuICAgIGwuZm9yRWFjaCggZnVuY3Rpb24oc3RyaW5nLCBpKXtcbiAgICAgICAgdmFyIGxpbmUgPSBzdHJpbmcudHJpbSgpO1xuICAgICAgICBpZiggbGluZS5sZW5ndGggPT09IDAgKXtcbiAgICAgICAgICAgIG5lZWRfdGl0bGUgPSB0cnVlO1xuICAgICAgICAgICAgbmVlZF9maWVsZHMgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYoIG5lZWRfdGl0bGUgKSB7XG4gICAgICAgICAgICB0aXRsZSA9IGxpbmU7XG4gICAgICAgICAgICB0YWJsZXNbdGl0bGVdID0gW107XG4gICAgICAgICAgICBuZWVkX3RpdGxlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiggbmVlZF9maWVsZHMgKSB7XG4gICAgICAgICAgICBmaWVsZHMgPSBsaW5lLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICB0YWJsZXNbdGl0bGUrXCJfZmllbGRzXCJdID0gZmllbGRzO1xuICAgICAgICAgICAgbmVlZF9maWVsZHMgPSBmYWxzZTtcbiAgICAgICAgLy99IGVsc2Uge1xuICAgICAgICAvLyAgICB2YXIgZW50cnkgPSB7fTtcbiAgICAgICAgLy8gICAgdmFyIGxpbmVfYXJyYXkgPSBsaW5lLnNwbGl0KCcsJyk7XG4gICAgICAgIC8vICAgIGZpZWxkcy5mb3JFYWNoKCBmdW5jdGlvbihmaWVsZCwgaWQpe1xuICAgICAgICAvLyAgICAgICAgZW50cnlbZmllbGQudHJpbSgpXSA9IGxpbmVfYXJyYXlbaWRdLnRyaW0oKTtcbiAgICAgICAgLy8gICAgfSk7XG4gICAgICAgIC8vICAgIHRhYmxlc1t0aXRsZV0ucHVzaCggZW50cnkgKTtcbiAgICAgICAgLy99XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbGluZV9hcnJheSA9IGxpbmUuc3BsaXQoJywnKTtcbiAgICAgICAgICAgIHRhYmxlc1t0aXRsZV1bbGluZV9hcnJheVswXS50cmltKCldID0gbGluZV9hcnJheVsxXS50cmltKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0YWJsZXM7XG59O1xuXG5mLmxvYWRDb21wb25lbnRzID0gZnVuY3Rpb24oc3RyaW5nKXtcbiAgICB2YXIgZGIgPSBrLnBhcnNlQ1NWKHN0cmluZyk7XG4gICAgdmFyIG9iamVjdCA9IHt9O1xuICAgIGZvciggdmFyIGkgaW4gZGIgKXtcbiAgICAgICAgdmFyIGNvbXBvbmVudCA9IGRiW2ldO1xuICAgICAgICBpZiggb2JqZWN0W2NvbXBvbmVudC5NYWtlXSA9PT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICBvYmplY3RbY29tcG9uZW50Lk1ha2VdID0ge307XG4gICAgICAgIH1cbiAgICAgICAgaWYoIG9iamVjdFtjb21wb25lbnQuTWFrZV1bY29tcG9uZW50Lk1vZGVsXSA9PT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICBvYmplY3RbY29tcG9uZW50Lk1ha2VdW2NvbXBvbmVudC5Nb2RlbF0gPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaWVsZHMgPSBrLm9iaklkQXJyYXkoY29tcG9uZW50KTtcbiAgICAgICAgZmllbGRzLmZvckVhY2goIGZ1bmN0aW9uKCBmaWVsZCApe1xuICAgICAgICAgICAgdmFyIHBhcmFtID0gY29tcG9uZW50W2ZpZWxkXTtcbiAgICAgICAgICAgIGlmKCAhKCBmaWVsZCBpbiBbJ01ha2UnLCAnTW9kZWwnXSApICYmICEoIGlzTmFOKHBhcnNlRmxvYXQocGFyYW0pKSApICl7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50W2ZpZWxkXSA9IHBhcnNlRmxvYXQocGFyYW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBvYmplY3RbY29tcG9uZW50Lk1ha2VdW2NvbXBvbmVudC5Nb2RlbF0gPSBjb21wb25lbnQ7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG59O1xuXG5cblxuXG5mLmxvYWRfZGF0YWJhc2UgPSBmdW5jdGlvbihGU0VDX2RhdGFiYXNlX0pTT04pe1xuICAgIEZTRUNfZGF0YWJhc2VfSlNPTiA9IGYubG93ZXJjYXNlX3Byb3BlcnRpZXMoRlNFQ19kYXRhYmFzZV9KU09OKTtcbiAgICB2YXIgc2V0dGluZ3MgPSBmLnNldHRpbmdzO1xuICAgIHNldHRpbmdzLmNvbXBvbmVudHMuaW52ZXJ0ZXJzID0ge307XG4gICAgRlNFQ19kYXRhYmFzZV9KU09OLmludmVydGVycy5mb3JFYWNoKGZ1bmN0aW9uKGNvbXBvbmVudCl7XG4gICAgICAgIGlmKCBzZXR0aW5ncy5jb21wb25lbnRzLmludmVydGVyc1tjb21wb25lbnQubWFrZV0gPT09IHVuZGVmaW5lZCApIHNldHRpbmdzLmNvbXBvbmVudHMuaW52ZXJ0ZXJzW2NvbXBvbmVudC5tYWtlXSA9IHt9O1xuICAgICAgICAvL3NldHRpbmdzLmNvbXBvbmVudHMuaW52ZXJ0ZXJzW2NvbXBvbmVudC5tYWtlXVtjb21wb25lbnQubWFrZV0gPSBmLnByZXR0eV9uYW1lcyhjb21wb25lbnQpO1xuICAgICAgICBzZXR0aW5ncy5jb21wb25lbnRzLmludmVydGVyc1tjb21wb25lbnQubWFrZV1bY29tcG9uZW50Lm1vZGVsXSA9IGNvbXBvbmVudDtcbiAgICB9KTtcbiAgICBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXMgPSB7fTtcbiAgICBGU0VDX2RhdGFiYXNlX0pTT04ubW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uKGNvbXBvbmVudCl7XG4gICAgICAgIGlmKCBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbY29tcG9uZW50Lm1ha2VdID09PSB1bmRlZmluZWQgKSBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbY29tcG9uZW50Lm1ha2VdID0ge307XG4gICAgICAgIC8vc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzW2NvbXBvbmVudC5tYWtlXVtjb21wb25lbnQubWFrZV0gPSBmLnByZXR0eV9uYW1lcyhjb21wb25lbnQpO1xuICAgICAgICBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbY29tcG9uZW50Lm1ha2VdW2NvbXBvbmVudC5tb2RlbF0gPSBjb21wb25lbnQ7XG4gICAgfSk7XG5cbiAgICBmLnVwZGF0ZSgpO1xufTtcblxuXG5mLmdldF9yZWYgPSBmdW5jdGlvbihzdHJpbmcsIG9iamVjdCl7XG4gICAgdmFyIHJlZl9hcnJheSA9IHN0cmluZy5zcGxpdCgnLicpO1xuICAgIHZhciBsZXZlbCA9IG9iamVjdDtcbiAgICByZWZfYXJyYXkuZm9yRWFjaChmdW5jdGlvbihsZXZlbF9uYW1lLGkpe1xuICAgICAgICBpZiggdHlwZW9mIGxldmVsW2xldmVsX25hbWVdID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXZlbCA9IGxldmVsW2xldmVsX25hbWVdO1xuICAgIH0pO1xuICAgIHJldHVybiBsZXZlbDtcbn07XG5mLnNldF9yZWYgPSBmdW5jdGlvbiggb2JqZWN0LCByZWZfc3RyaW5nLCB2YWx1ZSApe1xuICAgIHZhciByZWZfYXJyYXkgPSByZWZfc3RyaW5nLnNwbGl0KCcuJyk7XG4gICAgdmFyIGxldmVsID0gb2JqZWN0O1xuICAgIHJlZl9hcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldmVsX25hbWUsaSl7XG4gICAgICAgIGlmKCB0eXBlb2YgbGV2ZWxbbGV2ZWxfbmFtZV0gPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldmVsID0gbGV2ZWxbbGV2ZWxfbmFtZV07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbGV2ZWw7XG59O1xuXG5cblxuXG5mLmxvZ19pZl9kYXRhYmFzZV9sb2FkZWQgPSBmdW5jdGlvbihlKXtcbiAgICBpZihmLnNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICB9XG59O1xuXG5cblxuZi5sb3dlcmNhc2VfcHJvcGVydGllcyA9IGZ1bmN0aW9uIGxvd2VyY2FzZV9wcm9wZXJ0aWVzKG9iaikge1xuICAgIHZhciBuZXdfb2JqZWN0ID0gbmV3IG9iai5jb25zdHJ1Y3RvcigpO1xuICAgIGZvciggdmFyIG9sZF9uYW1lIGluIG9iaiApe1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KG9sZF9uYW1lKSkge1xuICAgICAgICAgICAgdmFyIG5ld19uYW1lID0gb2xkX25hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGlmKCBvYmpbb2xkX25hbWVdLmNvbnN0cnVjdG9yID09PSBPYmplY3QgfHwgb2JqW29sZF9uYW1lXS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkgKXtcbiAgICAgICAgICAgICAgICBuZXdfb2JqZWN0W25ld19uYW1lXSA9IGxvd2VyY2FzZV9wcm9wZXJ0aWVzKG9ialtvbGRfbmFtZV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdfb2JqZWN0W25ld19uYW1lXSA9IG9ialtvbGRfbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cbiAgICByZXR1cm4gbmV3X29iamVjdDtcbn07XG5cblxuZi50b2dnbGVfbW9kdWxlID0gZnVuY3Rpb24oZWxlbWVudCl7XG4gICAgLy9jb25zb2xlLmxvZygnc3dpdGNoJywgZWxlbWVudCwgZWxlbWVudC5jbGFzc0xpcyApO1xuXG4gICAgLy9lbGVtZW50LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgbnVsbCk7XG5cbiAgICB2YXIgZWxlbSA9ICQoZWxlbWVudCk7XG4gICAgLy9jb25zb2xlLmxvZygnc3dpdGNoJywgZWxlbVswXS5jbGFzc0xpc3QuY29udGFpbnMoJ3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGUnKSApO1xuXG4gICAgdmFyIHIgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnbW9kdWxlX0lEJykuc3BsaXQoJywnKVswXTtcbiAgICB2YXIgYyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdtb2R1bGVfSUQnKS5zcGxpdCgnLCcpWzFdO1xuXG4gICAgaWYoIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzW3JdW2NdICl7XG4gICAgICAgIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzW3JdW2NdID0gZmFsc2U7XG4gICAgICAgIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzX3RvdGFsLS07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl1bY10gPSB0cnVlO1xuICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbCsrO1xuICAgIH1cblxuICAgIC8qXG4gICAgdmFyIGxheWVyO1xuICAgIGlmKCBlbGVtWzBdLmNsYXNzTGlzdC5jb250YWlucygnc3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWQnKSApe1xuICAgICAgICAvL2cud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzW3JdW2NdID0gdHJ1ZTtcbiAgICAgICAgLy9sYXllciA9IGcuZHJhd2luZ19zZXR0aW5ncy5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGU7XG4gICAgICAgIC8vZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzID0gZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXMgKzEgfHwgMTtcbiAgICAgICAgLy9sYXllciA9IGcuZHJhd2luZ19zZXR0aW5ncy5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWQ7XG4gICAgICAgIC8vZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkXCIpO1xuICAgIH1cbiAgICAvLyovXG4gICAgLy9jb25zb2xlLmxvZyggZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXMpO1xuICAgIC8vZm9yKCB2YXIgYXR0cl9uYW1lIGluIGxheWVyICl7XG4gICAgLy8gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cl9uYW1lLCBsYXllclthdHRyX25hbWVdKTtcblxuICAgIC8vfVxuXG4gICAgZy5mLnVwZGF0ZSgpO1xuXG4gICAgLypcbiAgICBpZiggZWxlbS5oYXNDbGFzcyhcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlXCIpICl7XG4gICAgICAgIGVsZW0ucmVtb3ZlQ2xhc3MoXCJzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZVwiKTtcbiAgICAgICAgZWxlbS5hZGRDbGFzcyhcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkXCIpO1xuICAgIH0gZWxzZSBpZiggZWxlbS5oYXNDbGFzcyhcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkXCIpICl7XG4gICAgICAgIGVsZW0ucmVtb3ZlQ2xhc3MoXCJzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZFwiKTtcbiAgICAgICAgZWxlbS5hZGRDbGFzcyhcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW0uYWRkQ2xhc3MoXCJzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZVwiKTtcbiAgICB9XG4gICAgKi9cbn07XG5cblxuZi5jbGVhcl9vYmplY3QgPSBmdW5jdGlvbihvYmope1xuICAgIGZvciggdmFyIGlkIGluIG9iaiApe1xuICAgICAgICBpZiggb2JqLmhhc093blByb3BlcnR5KGlkKSl7XG4gICAgICAgICAgICBkZWxldGUgb2JqW2lkXTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8vIGNsZWFyIGRyYXdpbmdcbmYuY2xlYXJfZHJhd2luZyA9IGZ1bmN0aW9uKCkge1xuICAgIGZvciggdmFyIGlkIGluIGcuZHJhd2luZyApe1xuICAgICAgICBpZiggZy5kcmF3aW5nLmhhc093blByb3BlcnR5KGlkKSl7XG4gICAgICAgICAgICBmLmNsZWFyX29iamVjdChnLmRyYXdpbmdbaWRdKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXG5mLnF1ZXJ5X3N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gQmFzZWQgb25cbiAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvOTc5OTk1XG4gIHZhciBxdWVyeV9zdHJpbmcgPSB7fTtcbiAgdmFyIHF1ZXJ5ID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSk7XG4gIHZhciB2YXJzID0gcXVlcnkuc3BsaXQoXCImXCIpO1xuICB2YXIgaTtcbiAgZm9yICggaT0wOyBpPHZhcnMubGVuZ3RoOyBpKysgKSB7XG4gICAgdmFyIHBhaXIgPSB2YXJzW2ldLnNwbGl0KFwiPVwiKTtcbiAgICAgICAgLy8gSWYgZmlyc3QgZW50cnkgd2l0aCB0aGlzIG5hbWVcbiAgICBpZiAodHlwZW9mIHF1ZXJ5X3N0cmluZ1twYWlyWzBdXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBxdWVyeV9zdHJpbmdbcGFpclswXV0gPSBwYWlyWzFdO1xuICAgICAgICAvLyBJZiBzZWNvbmQgZW50cnkgd2l0aCB0aGlzIG5hbWVcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBxdWVyeV9zdHJpbmdbcGFpclswXV0gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdmFyIGFyciA9IFsgcXVlcnlfc3RyaW5nW3BhaXJbMF1dLCBwYWlyWzFdIF07XG4gICAgICAgIHF1ZXJ5X3N0cmluZ1twYWlyWzBdXSA9IGFycjtcbiAgICAgICAgLy8gSWYgdGhpcmQgb3IgbGF0ZXIgZW50cnkgd2l0aCB0aGlzIG5hbWVcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWVyeV9zdHJpbmdbcGFpclswXV0ucHVzaChwYWlyWzFdKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5X3N0cmluZztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZjtcbiIsInZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG5cbi8vdmFyIGRyYXdpbmdfcGFydHMgPSBbXTtcbi8vZC5saW5rX2RyYXdpbmdfcGFydHMoZHJhd2luZ19wYXJ0cyk7XG5cbnZhciBhZGRfYm9yZGVyID0gZnVuY3Rpb24oc2V0dGluZ3MsIHNoZWV0X3NlY3Rpb24sIHNoZWV0X251bSl7XG4gICAgZCA9IG1rX2RyYXdpbmcoKTtcbiAgICB2YXIgZiA9IHNldHRpbmdzLmY7XG5cbiAgICAvL3ZhciBjb21wb25lbnRzID0gc2V0dGluZ3MuY29tcG9uZW50cztcbiAgICAvL3ZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG4gICAgdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcblxuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxvYztcblxuXG5cblxuICAgIHZhciB4LCB5LCBoLCB3O1xuICAgIHZhciBvZmZzZXQ7XG5cbi8vIERlZmluZSBkLmJsb2Nrc1xuLy8gbW9kdWxlIGQuYmxvY2tcbiAgICB3ID0gc2l6ZS5tb2R1bGUuZnJhbWUudztcbiAgICBoID0gc2l6ZS5tb2R1bGUuZnJhbWUuaDtcblxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBGcmFtZVxuICAgIGQuc2VjdGlvbignRnJhbWUnKTtcblxuICAgIHcgPSBzaXplLmRyYXdpbmcudztcbiAgICBoID0gc2l6ZS5kcmF3aW5nLmg7XG4gICAgdmFyIHBhZGRpbmcgPSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZztcblxuICAgIGQubGF5ZXIoJ2ZyYW1lJyk7XG5cbiAgICAvL2JvcmRlclxuICAgIGQucmVjdCggW3cvMiAsIGgvMl0sIFt3IC0gcGFkZGluZyoyLCBoIC0gcGFkZGluZyoyIF0gKTtcblxuICAgIHggPSB3IC0gcGFkZGluZyAqIDM7XG4gICAgeSA9IHBhZGRpbmcgKiAzO1xuXG4gICAgdyA9IHNpemUuZHJhd2luZy50aXRsZWJveDtcbiAgICBoID0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94O1xuXG4gICAgLy8gYm94IHRvcC1yaWdodFxuICAgIGQucmVjdCggW3gtdy8yLCB5K2gvMl0sIFt3LGhdICk7XG5cbiAgICB5ICs9IGggKyBwYWRkaW5nO1xuXG4gICAgdyA9IHNpemUuZHJhd2luZy50aXRsZWJveDtcbiAgICBoID0gc2l6ZS5kcmF3aW5nLmggLSBwYWRkaW5nKjggLSBzaXplLmRyYXdpbmcudGl0bGVib3gqMi41O1xuXG4gICAgLy90aXRsZSBib3hcbiAgICBkLnJlY3QoIFt4LXcvMiwgeStoLzJdLCBbdyxoXSApO1xuXG4gICAgdmFyIHRpdGxlID0ge307XG4gICAgdGl0bGUudG9wID0geTtcbiAgICB0aXRsZS5ib3R0b20gPSB5K2g7XG4gICAgdGl0bGUucmlnaHQgPSB4O1xuICAgIHRpdGxlLmxlZnQgPSB4LXcgO1xuXG5cbiAgICAvLyBib3ggYm90dG9tLXJpZ2h0XG4gICAgaCA9IHNpemUuZHJhd2luZy50aXRsZWJveCAqIDEuNTtcbiAgICB5ID0gdGl0bGUuYm90dG9tICsgcGFkZGluZztcbiAgICB4ID0geC13LzI7XG4gICAgeSA9IHkraC8yO1xuICAgIGQucmVjdCggW3gsIHldLCBbdyxoXSApO1xuXG4gICAgeSAtPSAyMCoyLzM7XG4gICAgZC50ZXh0KFt4LHldLFxuICAgICAgICBbIHNoZWV0X3NlY3Rpb24sIHNoZWV0X251bSBdLFxuICAgICAgICAncGFnZScsXG4gICAgICAgICd0ZXh0J1xuICAgICAgICApO1xuXG5cbiAgICB2YXIgcGFnZSA9IHt9O1xuICAgIHBhZ2UucmlnaHQgPSB0aXRsZS5yaWdodDtcbiAgICBwYWdlLmxlZnQgPSB0aXRsZS5sZWZ0O1xuICAgIHBhZ2UudG9wID0gdGl0bGUuYm90dG9tICsgcGFkZGluZztcbiAgICBwYWdlLmJvdHRvbSA9IHBhZ2UudG9wICsgc2l6ZS5kcmF3aW5nLnRpdGxlYm94KjEuNTtcbiAgICAvLyBkLnRleHRcblxuICAgIHggPSB0aXRsZS5sZWZ0ICsgcGFkZGluZztcbiAgICB5ID0gdGl0bGUuYm90dG9tIC0gcGFkZGluZztcblxuICAgIHggKz0gMTA7XG4gICAgaWYoIHN5c3RlbS5pbnZlcnRlci5tYWtlICYmIHN5c3RlbS5pbnZlcnRlci5tb2RlbCApe1xuICAgICAgICBkLnRleHQoW3gseV0sXG4gICAgICAgICAgICAgWyBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSArIFwiIFwiICsgc3lzdGVtLmludmVydGVyLm1vZGVsICsgXCIgSW52ZXJ0ZXIgU3lzdGVtXCIgXSxcbiAgICAgICAgICAgICd0aXRsZTEnLCAndGV4dCcpLnJvdGF0ZSgtOTApO1xuXG4gICAgfVxuXG4gICAgeCArPSAxNDtcbiAgICBpZiggc3lzdGVtLm1vZHVsZS5tb2RlbCAmJiBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgJiYgc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZyAgKXtcbiAgICAgICAgZC50ZXh0KFt4LHldLCBbXG4gICAgICAgICAgICBzeXN0ZW0ubW9kdWxlLm1ha2UgKyBcIiBcIiArIHN5c3RlbS5tb2R1bGUubW9kZWwgK1xuICAgICAgICAgICAgICAgIFwiIChcIiArIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyAgKyBcIiBzdHJpbmdzIG9mIFwiICsgc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZyArIFwiIG1vZHVsZXMgKVwiXG4gICAgICAgIF0sICd0aXRsZTInLCAndGV4dCcpLnJvdGF0ZSgtOTApO1xuICAgIH1cblxuICAgIHggPSBwYWdlLmxlZnQgKyBwYWRkaW5nO1xuICAgIHkgPSBwYWdlLnRvcCArIHBhZGRpbmc7XG4gICAgeSArPSBzaXplLmRyYXdpbmcudGl0bGVib3ggKiAxLjUgKiAzLzQ7XG5cblxuXG5cblxuXG5cbiAgICByZXR1cm4gZC5kcmF3aW5nX3BhcnRzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gYWRkX2JvcmRlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGsgPSByZXF1aXJlKCcuLi9saWIvay9rLmpzJyk7XG52YXIgZiA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zLmpzJyk7XG5cbi8vdmFyIHNldHRpbmdzID0gcmVxdWlyZSgnLi9zZXR0aW5ncy5qcycpO1xuLy92YXIgbF9hdHRyID0gc2V0dGluZ3MuZHJhd2luZy5sX2F0dHI7XG4vL3ZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuLy8gc2V0dXAgZHJhd2luZyBjb250YWluZXJzXG5cbnZhciBzZXR0aW5ncyA9IHJlcXVpcmUoJy4vc2V0dGluZ3MnKTtcbnZhciBsYXllcl9hdHRyID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sYXllcl9hdHRyO1xudmFyIGZvbnRzID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5mb250cztcblxuXG5cblxuXG52YXIgZHJhd2luZyA9IHt9O1xuXG5cblxuXG5cblxuXG5cblxuLy8gQkxPQ0tTXG5cbnZhciBCbGsgPSB7XG4gICAgdHlwZTogJ2Jsb2NrJyxcbn07XG5CbGsubW92ZSA9IGZ1bmN0aW9uKHgsIHkpe1xuICAgIGZvciggdmFyIGkgaW4gdGhpcy5kcmF3aW5nX3BhcnRzICl7XG4gICAgICAgIHRoaXMuZHJhd2luZ19wYXJ0c1tpXS5tb3ZlKHgseSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbkJsay5hZGQgPSBmdW5jdGlvbigpe1xuICAgIGlmKCB0eXBlb2YgdGhpcy5kcmF3aW5nX3BhcnRzID09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgdGhpcy5kcmF3aW5nX3BhcnRzID0gW107XG4gICAgfVxuICAgIGZvciggdmFyIGkgaW4gYXJndW1lbnRzKXtcbiAgICAgICAgdGhpcy5kcmF3aW5nX3BhcnRzLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuQmxrLnJvdGF0ZSA9IGZ1bmN0aW9uKGRlZyl7XG4gICAgdGhpcy5yb3RhdGUgPSBkZWc7XG59O1xuXG5cbnZhciBibG9ja19hY3RpdmUgPSBmYWxzZTtcbi8vIENyZWF0ZSBkZWZhdWx0IGxheWVyLGJsb2NrIGNvbnRhaW5lciBhbmQgZnVuY3Rpb25zXG5cbi8vIExheWVyc1xuXG52YXIgbGF5ZXJfYWN0aXZlID0gZmFsc2U7XG5cbmRyYXdpbmcubGF5ZXIgPSBmdW5jdGlvbihuYW1lKXsgLy8gc2V0IGN1cnJlbnQgbGF5ZXJcbiAgICBpZiggdHlwZW9mIG5hbWUgPT09ICd1bmRlZmluZWQnICl7IC8vIGlmIG5vIGxheWVyIG5hbWUgZ2l2ZW4sIHJlc2V0IHRvIGRlZmF1bHRcbiAgICAgICAgbGF5ZXJfYWN0aXZlID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmICggISAobmFtZSBpbiBsYXllcl9hdHRyKSApIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdFcnJvcjogdW5rbm93biBsYXllciBcIicrbmFtZSsnXCIsIHVzaW5nIGJhc2UnKTtcbiAgICAgICAgbGF5ZXJfYWN0aXZlID0gJ2Jhc2UnIDtcbiAgICB9IGVsc2UgeyAvLyBmaW5hbHkgYWN0aXZhdGUgcmVxdWVzdGVkIGxheWVyXG4gICAgICAgIGxheWVyX2FjdGl2ZSA9IG5hbWU7XG4gICAgfVxuICAgIC8vKi9cbn07XG5cbnZhciBzZWN0aW9uX2FjdGl2ZSA9IGZhbHNlO1xuXG5kcmF3aW5nLnNlY3Rpb24gPSBmdW5jdGlvbihuYW1lKXsgLy8gc2V0IGN1cnJlbnQgc2VjdGlvblxuICAgIGlmKCB0eXBlb2YgbmFtZSA9PT0gJ3VuZGVmaW5lZCcgKXsgLy8gaWYgbm8gc2VjdGlvbiBuYW1lIGdpdmVuLCByZXNldCB0byBkZWZhdWx0XG4gICAgICAgIHNlY3Rpb25fYWN0aXZlID0gZmFsc2U7XG4gICAgfSBlbHNlIHsgLy8gZmluYWx5IGFjdGl2YXRlIHJlcXVlc3RlZCBzZWN0aW9uXG4gICAgICAgIHNlY3Rpb25fYWN0aXZlID0gbmFtZTtcbiAgICB9XG4gICAgLy8qL1xufTtcblxuXG5kcmF3aW5nLmJsb2NrX3N0YXJ0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgIGlmKCB0eXBlb2YgbmFtZSA9PT0gJ3VuZGVmaW5lZCcgKXsgLy8gaWYgbmFtZSBhcmd1bWVudCBpcyBzdWJtaXR0ZWRcbiAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiBuYW1lIHJlcXVpcmVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGJsaztcbiAgICAgICAgYmxvY2tfYWN0aXZlID0gbmFtZTtcbiAgICAgICAgaWYoIGcuZHJhd2luZy5ibG9ja3NbYmxvY2tfYWN0aXZlXSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6IGJsb2NrIGFscmVhZHkgZXhpc3RzJyk7XG4gICAgICAgIH1cbiAgICAgICAgYmxrID0gT2JqZWN0LmNyZWF0ZShCbGspO1xuICAgICAgICBnLmRyYXdpbmcuYmxvY2tzW2Jsb2NrX2FjdGl2ZV0gPSBibGs7XG4gICAgICAgIHJldHVybiBibGs7XG4gICAgfVxufTtcblxuICAgIC8qXG4gICAgeCA9IGxvYy53aXJlX3RhYmxlLnggLSB3LzI7XG4gICAgeSA9IGxvYy53aXJlX3RhYmxlLnkgLSBoLzI7XG4gICAgaWYoIHR5cGVvZiBsYXllcl9uYW1lICE9PSAndW5kZWZpbmVkJyAmJiAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICkge1xuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSBsYXllcnNbbGF5ZXJfbmFtZV1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiggISAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICl7IGNvbnNvbGUubG9nKFwiZXJyb3IsIGxheWVyIGRvZXMgbm90IGV4aXN0LCB1c2luZyBjdXJyZW50XCIpO31cbiAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gIGxheWVyX2FjdGl2ZVxuICAgIH1cbiAgICAqL1xuZHJhd2luZy5ibG9ja19lbmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYmxrID0gZy5kcmF3aW5nLmJsb2Nrc1tibG9ja19hY3RpdmVdO1xuICAgIGJsb2NrX2FjdGl2ZSA9IGZhbHNlO1xuICAgIHJldHVybiBibGs7XG59O1xuXG5cblxuXG5cblxuLy8vLy8vXG4vLyBidWlsZCBwcm90b3R5cGUgZWxlbWVudFxuXG4gICAgLypcbiAgICBpZiggdHlwZW9mIGxheWVyX25hbWUgIT09ICd1bmRlZmluZWQnICYmIChsYXllcl9uYW1lIGluIGxheWVycykgKSB7XG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9IGxheWVyc1tsYXllcl9uYW1lXVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCAhIChsYXllcl9uYW1lIGluIGxheWVycykgKXsgY29uc29sZS5sb2coXCJlcnJvciwgbGF5ZXIgZG9lcyBub3QgZXhpc3QsIHVzaW5nIGN1cnJlbnRcIik7fVxuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSAgbGF5ZXJfYWN0aXZlXG4gICAgfVxuICAgICovXG5cblxudmFyIFN2Z0VsZW0gPSB7XG4gICAgb2JqZWN0OiAnU3ZnRWxlbSdcbn07XG5TdmdFbGVtLm1vdmUgPSBmdW5jdGlvbih4LCB5KXtcbiAgICBpZiggdHlwZW9mIHRoaXMucG9pbnRzICE9ICd1bmRlZmluZWQnICkge1xuICAgICAgICBmb3IoIHZhciBpIGluIHRoaXMucG9pbnRzICkge1xuICAgICAgICAgICAgdGhpcy5wb2ludHNbaV1bMF0gKz0geDtcbiAgICAgICAgICAgIHRoaXMucG9pbnRzW2ldWzFdICs9IHk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuU3ZnRWxlbS5yb3RhdGUgPSBmdW5jdGlvbihkZWcpe1xuICAgIHRoaXMucm90YXRlZCA9IGRlZztcbn07XG5cbi8vLy8vLy9cbi8vIGZ1bmN0aW9ucyBmb3IgYWRkaW5nIGRyYXdpbmdfcGFydHNcblxuZHJhd2luZy5hZGQgPSBmdW5jdGlvbih0eXBlLCBwb2ludHMsIGxheWVyX25hbWUsIGF0dHJzKSB7XG4gICAgaWYoIHBvaW50c1swXSA9PT0gdW5kZWZpbmVkICkgY29uc29sZS53YXJuKFwicG9pbnRzIG5vdCBkZWZmaW5lZFwiLCB0eXBlLCBwb2ludHMsIGxheWVyX25hbWUgKTtcblxuICAgIGlmKCB0eXBlb2YgbGF5ZXJfbmFtZSA9PT0gJ3VuZGVmaW5lZCcgKSB7IGxheWVyX25hbWUgPSBsYXllcl9hY3RpdmU7IH1cbiAgICBpZiggISAobGF5ZXJfbmFtZSBpbiBsYXllcl9hdHRyKSApIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdFcnJvcjogTGF5ZXIgXCInKyBsYXllcl9uYW1lICsnXCIgbmFtZSBub3QgZm91bmQsIHVzaW5nIGJhc2UnKTtcbiAgICAgICAgbGF5ZXJfbmFtZSA9ICdiYXNlJztcbiAgICB9XG5cbiAgICBpZiggdHlwZW9mIHBvaW50cyA9PSAnc3RyaW5nJykge1xuICAgICAgICB2YXIgcG9pbnRzX2EgPSBwb2ludHMuc3BsaXQoJyAnKTtcbiAgICAgICAgZm9yKCB2YXIgaSBpbiBwb2ludHNfYSApIHtcbiAgICAgICAgICAgIHBvaW50c19hW2ldID0gcG9pbnRzX2FbaV0uc3BsaXQoJywnKTtcbiAgICAgICAgICAgIGZvciggdmFyIGMgaW4gcG9pbnRzX2FbaV0gKSB7XG4gICAgICAgICAgICAgICAgcG9pbnRzX2FbaV1bY10gPSBOdW1iZXIocG9pbnRzX2FbaV1bY10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGVsZW0gPSBPYmplY3QuY3JlYXRlKFN2Z0VsZW0pO1xuICAgIGVsZW0udHlwZSA9IHR5cGU7XG4gICAgZWxlbS5sYXllcl9uYW1lID0gbGF5ZXJfbmFtZTtcbiAgICBlbGVtLnNlY3Rpb25fbmFtZSA9IHNlY3Rpb25fYWN0aXZlO1xuICAgIGlmKCBhdHRycyAhPT0gdW5kZWZpbmVkICkgZWxlbS5hdHRycyA9IGF0dHJzO1xuICAgIGlmKCB0eXBlID09PSAnbGluZScgKSB7XG4gICAgICAgIGVsZW0ucG9pbnRzID0gcG9pbnRzO1xuICAgIH0gZWxzZSBpZiggdHlwZSA9PT0gJ3BvbHknICkge1xuICAgICAgICBlbGVtLnBvaW50cyA9IHBvaW50cztcbiAgICB9IGVsc2UgaWYoIHR5cGVvZiBwb2ludHNbMF0ueCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZWxlbS54ID0gcG9pbnRzWzBdWzBdO1xuICAgICAgICBlbGVtLnkgPSBwb2ludHNbMF1bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbS54ID0gcG9pbnRzWzBdLng7XG4gICAgICAgIGVsZW0ueSA9IHBvaW50c1swXS55O1xuICAgIH1cblxuICAgIGlmKGJsb2NrX2FjdGl2ZSkge1xuICAgICAgICBlbGVtLmJsb2NrX25hbWUgPSBibG9ja19hY3RpdmU7XG4gICAgICAgIGcuZHJhd2luZy5ibG9ja3NbYmxvY2tfYWN0aXZlXS5hZGQoZWxlbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kcmF3aW5nX3BhcnRzLnB1c2goZWxlbSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW07XG59O1xuXG5kcmF3aW5nLmxpbmUgPSBmdW5jdGlvbihwb2ludHMsIGxheWVyLCBhdHRycyl7IC8vIChwb2ludHMsIFtsYXllcl0pXG4gICAgLy9yZXR1cm4gYWRkKCdsaW5lJywgcG9pbnRzLCBsYXllcilcbiAgICB2YXIgbGluZSA9ICB0aGlzLmFkZCgnbGluZScsIHBvaW50cywgbGF5ZXIsIGF0dHJzKTtcbiAgICByZXR1cm4gbGluZTtcbn07XG5cbmRyYXdpbmcucG9seSA9IGZ1bmN0aW9uKHBvaW50cywgbGF5ZXIsIGF0dHJzKXsgLy8gKHBvaW50cywgW2xheWVyXSlcbiAgICAvL3JldHVybiBhZGQoJ3BvbHknLCBwb2ludHMsIGxheWVyKVxuICAgIHZhciBwb2x5ID0gIHRoaXMuYWRkKCdwb2x5JywgcG9pbnRzLCBsYXllciwgYXR0cnMpO1xuICAgIHJldHVybiBwb2x5O1xufTtcblxuZHJhd2luZy5yZWN0ID0gZnVuY3Rpb24obG9jLCBzaXplLCBsYXllciwgYXR0cnMpe1xuICAgIHZhciByZWMgPSB0aGlzLmFkZCgncmVjdCcsIFtsb2NdLCBsYXllciwgYXR0cnMpO1xuICAgIHJlYy53ID0gc2l6ZVswXTtcbiAgICAvKlxuICAgIGlmKCB0eXBlb2YgbGF5ZXJfbmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApIHtcbiAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gbGF5ZXJzW2xheWVyX25hbWVdXG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYoICEgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApeyBjb25zb2xlLmxvZyhcImVycm9yLCBsYXllciBkb2VzIG5vdCBleGlzdCwgdXNpbmcgY3VycmVudFwiKTt9XG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9ICBsYXllcl9hY3RpdmVcbiAgICB9XG4gICAgKi9cbiAgICByZWMuaCA9IHNpemVbMV07XG4gICAgcmV0dXJuIHJlYztcbn07XG5cbmRyYXdpbmcuY2lyYyA9IGZ1bmN0aW9uKGxvYywgZGlhbWV0ZXIsIGxheWVyLCBhdHRycyl7XG4gICAgdmFyIGNpciA9IHRoaXMuYWRkKCdjaXJjJywgW2xvY10sIGxheWVyLCBhdHRycyk7XG4gICAgY2lyLmQgPSBkaWFtZXRlcjtcbiAgICByZXR1cm4gY2lyO1xufTtcblxuZHJhd2luZy50ZXh0ID0gZnVuY3Rpb24obG9jLCBzdHJpbmdzLCBmb250LCBsYXllciwgYXR0cnMpe1xuICAgIHZhciB0eHQgPSB0aGlzLmFkZCgndGV4dCcsIFtsb2NdLCBsYXllciwgYXR0cnMpO1xuICAgIGlmKCB0eXBlb2Ygc3RyaW5ncyA9PSAnc3RyaW5nJyl7XG4gICAgICAgIHN0cmluZ3MgPSBbc3RyaW5nc107XG4gICAgfVxuICAgIHR4dC5zdHJpbmdzID0gc3RyaW5ncztcbiAgICB0eHQuZm9udCA9IGZvbnQ7XG4gICAgcmV0dXJuIHR4dDtcbn07XG5cbmRyYXdpbmcuYmxvY2sgPSBmdW5jdGlvbihuYW1lKSB7Ly8gc2V0IGN1cnJlbnQgYmxvY2tcbiAgICB2YXIgeCx5O1xuICAgIGlmKCBhcmd1bWVudHMubGVuZ3RoID09PSAyICl7IC8vIGlmIGNvb3IgaXMgcGFzc2VkXG4gICAgICAgIGlmKCB0eXBlb2YgYXJndW1lbnRzWzFdLnggIT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICB4ID0gYXJndW1lbnRzWzFdLng7XG4gICAgICAgICAgICB5ID0gYXJndW1lbnRzWzFdLnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB4ID0gYXJndW1lbnRzWzFdWzBdO1xuICAgICAgICAgICAgeSA9IGFyZ3VtZW50c1sxXVsxXTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiggYXJndW1lbnRzLmxlbmd0aCA9PT0gMyApeyAvLyBpZiB4LHkgaXMgcGFzc2VkXG4gICAgICAgIHggPSBhcmd1bWVudHNbMV07XG4gICAgICAgIHkgPSBhcmd1bWVudHNbMl07XG4gICAgfVxuXG4gICAgLy8gVE9ETzogd2hhdCBpZiBibG9jayBkb2VzIG5vdCBleGlzdD8gcHJpbnQgbGlzdCBvZiBibG9ja3M/XG4gICAgdmFyIGJsayA9IE9iamVjdC5jcmVhdGUoZy5kcmF3aW5nLmJsb2Nrc1tuYW1lXSk7XG4gICAgYmxrLnggPSB4O1xuICAgIGJsay55ID0geTtcblxuICAgIGlmKGJsb2NrX2FjdGl2ZSl7XG4gICAgICAgIGcuZHJhd2luZy5ibG9ja3NbYmxvY2tfYWN0aXZlXS5hZGQoYmxrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRyYXdpbmdfcGFydHMucHVzaChibGspO1xuICAgIH1cbiAgICByZXR1cm4gYmxrO1xufTtcblxuXG5cblxuXG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy9cbi8vIFRhYmxlc1xuXG52YXIgQ2VsbCA9IHtcbiAgICBpbml0OiBmdW5jdGlvbih0YWJsZSwgUiwgQyl7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy50YWJsZSA9IHRhYmxlO1xuICAgICAgICB0aGlzLlIgPSBSO1xuICAgICAgICB0aGlzLkMgPSBDO1xuICAgICAgICAvKlxuICAgICAgICB0aGlzLmJvcmRlcnMgPSB7fTtcbiAgICAgICAgdGhpcy5ib3JkZXJfb3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHNpZGUpe1xuICAgICAgICAgICAgc2VsZi5ib3JkZXJzW3NpZGVdID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyovXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgLypcbiAgICBib3JkZXJfb3B0aW9uczogWydUJywgJ0InLCAnTCcsICdSJ10sXG4gICAgLy8qL1xuICAgIHRleHQ6IGZ1bmN0aW9uKHRleHQpe1xuICAgICAgICB0aGlzLmNlbGxfdGV4dCA9IHRleHQ7XG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfSxcbiAgICBmb250OiBmdW5jdGlvbihmb250X25hbWUpe1xuICAgICAgICB0aGlzLmNlbGxfZm9udF9uYW1lID0gZm9udF9uYW1lO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgYm9yZGVyOiBmdW5jdGlvbihib3JkZXJfc3RyaW5nLCBzdGF0ZSl7XG4gICAgICAgIHRoaXMudGFibGUuYm9yZGVyKCB0aGlzLlIsIHRoaXMuQywgYm9yZGVyX3N0cmluZywgc3RhdGUgKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTtcblxudmFyIFRhYmxlID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKCBkcmF3aW5nLCBudW1fcm93cywgbnVtX2NvbHMgKXtcbiAgICAgICAgdGhpcy5kcmF3aW5nID0gZHJhd2luZztcbiAgICAgICAgdGhpcy5udW1fcm93cyA9IG51bV9yb3dzO1xuICAgICAgICB0aGlzLm51bV9jb2xzID0gbnVtX2NvbHM7XG4gICAgICAgIHZhciByLGM7XG5cbiAgICAgICAgLy8gc2V0dXAgYm9yZGVyIGNvbnRhaW5lcnNcbiAgICAgICAgdGhpcy5ib3JkZXJzX3Jvd3MgPSBbXTtcbiAgICAgICAgZm9yKCByPTA7IHI8PW51bV9yb3dzOyByKyspe1xuICAgICAgICAgICAgdGhpcy5ib3JkZXJzX3Jvd3Nbcl0gPSBbXTtcbiAgICAgICAgICAgIGZvciggYz0xOyBjPD1udW1fY29sczsgYysrKXtcbiAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfcm93c1tyXVtjXSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYm9yZGVyc19jb2xzID0gW107XG4gICAgICAgIGZvciggYz0wOyBjPD1udW1fY29sczsgYysrKXtcbiAgICAgICAgICAgIHRoaXMuYm9yZGVyc19jb2xzW2NdID0gW107XG4gICAgICAgICAgICBmb3IoIHI9MTsgcjw9bnVtX3Jvd3M7IHIrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5ib3JkZXJzX2NvbHNbY11bcl0gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNldCBjb2x1bW4gYW5kIHJvdyBzaXplIGNvbnRhaW5lcnNcbiAgICAgICAgdGhpcy5yb3dfc2l6ZXMgPSBbXTtcbiAgICAgICAgZm9yKCByPTE7IHI8PW51bV9yb3dzOyByKyspe1xuICAgICAgICAgICAgdGhpcy5yb3dfc2l6ZXNbcl0gPSAxNTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbF9zaXplcyA9IFtdO1xuICAgICAgICBmb3IoIGM9MTsgYzw9bnVtX2NvbHM7IGMrKyl7XG4gICAgICAgICAgICB0aGlzLmNvbF9zaXplc1tjXSA9IDYwO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2V0dXAgY2VsbCBjb250YWluZXJcbiAgICAgICAgdGhpcy5jZWxscyA9IFtdO1xuICAgICAgICBmb3IoIHI9MTsgcjw9bnVtX3Jvd3M7IHIrKyl7XG4gICAgICAgICAgICB0aGlzLmNlbGxzW3JdID0gW107XG4gICAgICAgICAgICBmb3IoIGM9MTsgYzw9bnVtX2NvbHM7IGMrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tyXVtjXSA9IE9iamVjdC5jcmVhdGUoQ2VsbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tyXVtjXS5pbml0KCB0aGlzLCByLCBjKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIC8vKi9cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGxvYzogZnVuY3Rpb24oIHgsIHkpe1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNlbGw6IGZ1bmN0aW9uKCBSLCBDICl7XG4gICAgICAgIHJldHVybiB0aGlzLmNlbGxzW1JdW0NdO1xuICAgIH0sXG4gICAgYWxsX2NlbGxzOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgY2VsbF9hcnJheSA9IFtdO1xuICAgICAgICB0aGlzLmNlbGxzLmZvckVhY2goZnVuY3Rpb24ocm93KXtcbiAgICAgICAgICAgIHJvdy5mb3JFYWNoKGZ1bmN0aW9uKGNlbGwpe1xuICAgICAgICAgICAgICAgIGNlbGxfYXJyYXkucHVzaChjZWxsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNlbGxfYXJyYXk7XG4gICAgfSxcbiAgICBjb2xfc2l6ZTogZnVuY3Rpb24oY29sLCBzaXplKXtcbiAgICAgICAgaWYoIHR5cGVvZiBjb2wgPT09ICdzdHJpbmcnICl7XG4gICAgICAgICAgICBpZiggY29sID09PSAnYWxsJyl7XG4gICAgICAgICAgICAgICAgXy5yYW5nZSh0aGlzLm51bV9jb2xzKS5mb3JFYWNoKGZ1bmN0aW9uKGMpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbF9zaXplc1tjKzFdID0gc2l6ZTtcbiAgICAgICAgICAgICAgICB9LHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzaXplID0gTnVtYmVyKHNpemUpO1xuICAgICAgICAgICAgICAgIGlmKCBpc05hTihzaXplKSApe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6IGNvbHVtbiB3cm9uZycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29sX3NpemVzW2NvbF0gPSBzaXplO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLy8gaXMgbnVtYmVyXG4gICAgICAgICAgICB0aGlzLmNvbF9zaXplc1tjb2xdID0gc2l6ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIC8vKi9cbiAgICByb3dfc2l6ZTogZnVuY3Rpb24ocm93LCBzaXplKXtcbiAgICAgICAgaWYoIHR5cGVvZiByb3cgPT09ICdzdHJpbmcnICl7XG4gICAgICAgICAgICBpZiggcm93ID09PSAnYWxsJyl7XG4gICAgICAgICAgICAgICAgXy5yYW5nZSh0aGlzLm51bV9yb3dzKS5mb3JFYWNoKGZ1bmN0aW9uKHIpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvd19zaXplc1tyKzFdID0gc2l6ZTtcbiAgICAgICAgICAgICAgICB9LHRoaXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzaXplID0gTnVtYmVyKHNpemUpO1xuICAgICAgICAgICAgICAgIGlmKCBpc05hTihzaXplKSApe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6IGNvbHVtbiB3cm9uZycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm93X3NpemVzW3Jvd10gPSBzaXplO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLy8gaXMgbnVtYmVyXG4gICAgICAgICAgICB0aGlzLnJvd19zaXplc1tyb3ddID0gc2l6ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIC8vKi9cblxuICAgIC8qXG4gICAgYWRkX2NlbGw6IGZ1bmN0aW9uKCl7XG5cbiAgICB9LFxuICAgIGFkZF9yb3dzOiBmdW5jdGlvbihuKXtcbiAgICAgICAgdGhpcy5udW1fY29sbW5zICs9IG47XG4gICAgICAgIHRoaXMubnVtX3Jvd3MgKz0gbjtcbiAgICAgICAgXy5yYW5nZShuKS5mb3JFYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLnJvd3MucHVzaChbXSk7XG4gICAgICAgIH0pO1xuICAgICAgICBfLnJhbmdlKG4pLmZvckVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMudGV4dF9yb3dzLnB1c2goW10pO1xuICAgICAgICB9KTtcblxuICAgIH0sXG4gICAgdGV4dDogZnVuY3Rpb24oIFIsIEMsIHRleHQpe1xuICAgICAgICB0aGlzLnRleHRfcm93c1tSXVtDXSA9IHRleHQ7XG4gICAgfSxcbiAgICAvLyovXG4gICAgYm9yZGVyOiBmdW5jdGlvbiggUiwgQywgYm9yZGVyX3N0cmluZywgc3RhdGUpe1xuICAgICAgICBpZiggc3RhdGUgPT09IHVuZGVmaW5lZCApIHN0YXRlID0gdHJ1ZTtcblxuICAgICAgICBib3JkZXJfc3RyaW5nID0gYm9yZGVyX3N0cmluZy50b1VwcGVyQ2FzZSgpLnRyaW0oKTtcbiAgICAgICAgdmFyIGJvcmRlcnM7XG4gICAgICAgIGlmKCBib3JkZXJfc3RyaW5nID09PSAnQUxMJyApe1xuICAgICAgICAgICAgYm9yZGVycyA9IFsnVCcsICdCJywgJ0wnLCAnUiddO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYm9yZGVycyA9IGJvcmRlcl9zdHJpbmcuc3BsaXQoL1tcXHMsXSsvKTtcbiAgICAgICAgfVxuICAgICAgICBib3JkZXJzLmZvckVhY2goZnVuY3Rpb24oc2lkZSl7XG4gICAgICAgICAgICBzd2l0Y2goc2lkZSl7XG4gICAgICAgICAgICAgICAgY2FzZSAnVCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyc19yb3dzW1ItMV1bQ10gPSBzdGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyc19yb3dzW1JdW0NdID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0wnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfY29sc1tDLTFdW1JdID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ1InOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfY29sc1tDXVtSXSA9IHN0YXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY29ybmVyOiBmdW5jdGlvbihSLEMpe1xuICAgICAgICB2YXIgeCA9IHRoaXMueDtcbiAgICAgICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgICAgIHZhciByLGM7XG4gICAgICAgIGZvciggcj0xOyByPD1SOyByKysgKXtcbiAgICAgICAgICAgIHkgKz0gdGhpcy5yb3dfc2l6ZXNbcl07XG4gICAgICAgIH1cbiAgICAgICAgZm9yKCBjPTE7IGM8PUM7IGMrKyApe1xuICAgICAgICAgICAgeCArPSB0aGlzLmNvbF9zaXplc1tjXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3gseV07XG4gICAgfSxcbiAgICBjZW50ZXI6IGZ1bmN0aW9uKFIsQyl7XG4gICAgICAgIHZhciB4ID0gdGhpcy54O1xuICAgICAgICB2YXIgeSA9IHRoaXMueTtcbiAgICAgICAgdmFyIHIsYztcbiAgICAgICAgZm9yKCByPTE7IHI8PVI7IHIrKyApe1xuICAgICAgICAgICAgeSArPSB0aGlzLnJvd19zaXplc1tyXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IoIGM9MTsgYzw9QzsgYysrICl7XG4gICAgICAgICAgICB4ICs9IHRoaXMuY29sX3NpemVzW2NdO1xuICAgICAgICB9XG4gICAgICAgIHkgLT0gdGhpcy5yb3dfc2l6ZXNbUl0vMjtcbiAgICAgICAgeCAtPSB0aGlzLmNvbF9zaXplc1tDXS8yO1xuICAgICAgICByZXR1cm4gW3gseV07XG4gICAgfSxcbiAgICBsZWZ0OiBmdW5jdGlvbihSLEMpe1xuICAgICAgICB2YXIgY29vciA9IHRoaXMuY2VudGVyKFIsQyk7XG4gICAgICAgIGNvb3JbMF0gPSBjb29yWzBdIC0gdGhpcy5jb2xfc2l6ZXNbQ10vMiArIHRoaXMucm93X3NpemVzW1JdLzI7XG4gICAgICAgIHJldHVybiBjb29yO1xuICAgIH0sXG4gICAgcmlnaHQ6IGZ1bmN0aW9uKFIsQyl7XG4gICAgICAgIHZhciBjb29yID0gdGhpcy5jZW50ZXIoUixDKTtcbiAgICAgICAgY29vclswXSA9IGNvb3JbMF0gKyB0aGlzLmNvbF9zaXplc1tDXS8yIC0gdGhpcy5yb3dfc2l6ZXNbUl0vMjtcbiAgICAgICAgcmV0dXJuIGNvb3I7XG4gICAgfSxcbiAgICBtazogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgcixjO1xuICAgICAgICBmb3IoIHI9MDsgcjw9dGhpcy5udW1fcm93czsgcisrICl7XG4gICAgICAgICAgICBmb3IoIGM9MTsgYzw9dGhpcy5udW1fY29sczsgYysrICl7XG4gICAgICAgICAgICAgICAgaWYoIHRoaXMuYm9yZGVyc19yb3dzW3JdW2NdID09PSB0cnVlICl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd2luZy5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ybmVyKHIsYy0xKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ybmVyKHIsYyksXG4gICAgICAgICAgICAgICAgICAgICAgICBdLCAnYm9yZGVyJyk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yKCBjPTA7IGM8PXRoaXMubnVtX2NvbHM7IGMrKyApe1xuICAgICAgICAgICAgZm9yKCByPTE7IHI8PXRoaXMubnVtX3Jvd3M7IHIrKyApe1xuICAgICAgICAgICAgICAgIGlmKCB0aGlzLmJvcmRlcnNfY29sc1tjXVtyXSA9PT0gdHJ1ZSApe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdpbmcubGluZShbXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcm5lcihyLTEsYyksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcm5lcihyLGMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSwgJ2JvcmRlcicpO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciggcj0xOyByPD10aGlzLm51bV9yb3dzOyByKysgKXtcbiAgICAgICAgICAgIGZvciggYz0xOyBjPD10aGlzLm51bV9jb2xzOyBjKysgKXtcbiAgICAgICAgICAgICAgICBpZiggdHlwZW9mIHRoaXMuY2VsbChyLGMpLmNlbGxfdGV4dCA9PT0gJ3N0cmluZycgKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGwgPSB0aGlzLmNlbGwocixjKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZvbnRfbmFtZSA9IGNlbGwuY2VsbF9mb250X25hbWUgfHwgJ3RhYmxlJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvb3I7XG4gICAgICAgICAgICAgICAgICAgIGlmKCBnLmRyYXdpbmdfc2V0dGluZ3MuZm9udHNbZm9udF9uYW1lXVsndGV4dC1hbmNob3InXSA9PT0gJ2NlbnRlcicpIGNvb3IgPSB0aGlzLmNlbnRlcihyLGMpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKCBnLmRyYXdpbmdfc2V0dGluZ3MuZm9udHNbZm9udF9uYW1lXVsndGV4dC1hbmNob3InXSA9PT0gJ3JpZ2h0JykgY29vciA9IHRoaXMucmlnaHQocixjKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiggZy5kcmF3aW5nX3NldHRpbmdzLmZvbnRzW2ZvbnRfbmFtZV1bJ3RleHQtYW5jaG9yJ10gPT09ICdsZWZ0JykgY29vciA9IHRoaXMubGVmdChyLGMpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGNvb3IgPSB0aGlzLmNlbnRlcihyLGMpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd2luZy50ZXh0KFxuICAgICAgICAgICAgICAgICAgICAgICAgY29vcixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbChyLGMpLmNlbGxfdGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICd0ZXh0J1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG59O1xuXG5kcmF3aW5nLnRhYmxlID0gZnVuY3Rpb24oIG51bV9yb3dzLCBudW1fY29scyApe1xuICAgIHZhciBuZXdfdGFibGUgPSBPYmplY3QuY3JlYXRlKFRhYmxlKTtcbiAgICBuZXdfdGFibGUuaW5pdCggdGhpcywgbnVtX3Jvd3MsIG51bV9jb2xzICk7XG5cbiAgICByZXR1cm4gbmV3X3RhYmxlO1xuXG59O1xuXG5cbmRyYXdpbmcuYXBwZW5kID0gIGZ1bmN0aW9uKGRyYXdpbmdfcGFydHMpe1xuICAgIHRoaXMuZHJhd2luZ19wYXJ0cyA9IHRoaXMuZHJhd2luZ19wYXJ0cy5jb25jYXQoZHJhd2luZ19wYXJ0cyk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5cblxudmFyIG1rX2RyYXdpbmcgPSBmdW5jdGlvbigpe1xuICAgIHZhciBwYWdlID0gT2JqZWN0LmNyZWF0ZShkcmF3aW5nKTtcbiAgICAvL2NvbnNvbGUubG9nKHBhZ2UpO1xuICAgIHBhZ2UuZHJhd2luZ19wYXJ0cyA9IFtdO1xuICAgIHJldHVybiBwYWdlO1xufTtcblxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gbWtfZHJhd2luZztcbiIsInZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG52YXIgbWtfYm9yZGVyID0gcmVxdWlyZSgnLi9ta19ib3JkZXInKTtcblxudmFyIHBhZ2UgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgY29uc29sZS5sb2coXCIqKiBNYWtpbmcgcGFnZSAxXCIpO1xuXG4gICAgdmFyIGQgPSBta19kcmF3aW5nKCk7XG5cbiAgICB2YXIgc2hlZXRfc2VjdGlvbiA9ICdBJztcbiAgICB2YXIgc2hlZXRfbnVtID0gJzAwJztcbiAgICBkLmFwcGVuZChta19ib3JkZXIoc2V0dGluZ3MsIHNoZWV0X3NlY3Rpb24sIHNoZWV0X251bSApKTtcblxuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxvYztcblxuICAgIHZhciB4LCB5LCBoLCB3O1xuXG4gICAgZC50ZXh0KFxuICAgICAgICBbc2l6ZS5kcmF3aW5nLncqMS8yLCBzaXplLmRyYXdpbmcuaCoxLzNdLFxuICAgICAgICBbXG4gICAgICAgICAgICAnRlNFQyBQbGFucyBNYWNoaW5lJyxcbiAgICAgICAgICAgICdERU1PJ1xuICAgICAgICBdLFxuICAgICAgICAncHJvamVjdCB0aXRsZSdcbiAgICApO1xuXG4gICAgdmFyIG5fcm93cyA9IDQ7XG4gICAgdmFyIG5fY29scyA9IDI7XG4gICAgdyA9IDQwMCs4MDtcbiAgICBoID0gbl9yb3dzKjIwO1xuICAgIHggPSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyo2O1xuICAgIHkgPSBzaXplLmRyYXdpbmcuaCAtIHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nKjYgLSA0KjIwO1xuXG4gICAgZC50ZXh0KCBbeCt3LzIsIHktMjBdLCAnQ29udGVudHMnLCd0YWJsZV9sYXJnZScgKTtcblxuICAgIHZhciB0ID0gZC50YWJsZShuX3Jvd3Msbl9jb2xzKS5sb2MoeCx5KTtcbiAgICB0LnJvd19zaXplKCdhbGwnLCAyMCkuY29sX3NpemUoMiwgNDAwKS5jb2xfc2l6ZSgxLCA4MCk7XG4gICAgdC5jZWxsKDEsMSkudGV4dCgnUFYtMDEnKTtcbiAgICB0LmNlbGwoMSwyKS50ZXh0KCdQViBzeXN0ZW0gd2lyaW5nIGRpYWdyYW0nKTtcbiAgICB0LmNlbGwoMiwxKS50ZXh0KCdQVi0wMicpO1xuICAgIHQuY2VsbCgyLDIpLnRleHQoJ1BWIHN5c3RlbSBzcGVjaWZpY2F0aW9ucycpO1xuXG4gICAgdC5hbGxfY2VsbHMoKS5mb3JFYWNoKGZ1bmN0aW9uKGNlbGwpe1xuICAgICAgICBjZWxsLmZvbnQoJ3RhYmxlX2xhcmdlX2xlZnQnKS5ib3JkZXIoJ2FsbCcpO1xuICAgIH0pO1xuXG4gICAgdC5taygpO1xuXG4gICAgLypcbiAgICBjb25zb2xlLmxvZyh0YWJsZV9wYXJ0cyk7XG4gICAgZC5hcHBlbmQodGFibGVfcGFydHMpO1xuICAgIGQudGV4dChbc2l6ZS5kcmF3aW5nLncvMyxzaXplLmRyYXdpbmcuaC8zXSwgJ1gnLCAndGFibGUnKTtcbiAgICBkLnJlY3QoW3NpemUuZHJhd2luZy53LzMtNSxzaXplLmRyYXdpbmcuaC8zLTVdLFsxMCwxMF0sJ2JveCcpO1xuXG4gICAgdC5jZWxsKDIsMikuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDIsMicpO1xuICAgIHQuY2VsbCgzLDMpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCAzLDMnKTtcbiAgICB0LmNlbGwoNCw0KS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgNCw0Jyk7XG4gICAgdC5jZWxsKDUsNSkuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDUsNScpO1xuXG5cblxuICAgIHQuY2VsbCg0LDYpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCA0LDYnKTtcbiAgICB0LmNlbGwoNCw3KS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgNCw3Jyk7XG4gICAgdC5jZWxsKDUsNikuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDUsNicpO1xuICAgIHQuY2VsbCg1LDcpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCA1LDcnKTtcblxuXG4gICAgLy8qL1xuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xudmFyIG1rX2JvcmRlciA9IHJlcXVpcmUoJy4vbWtfYm9yZGVyJyk7XG5cbi8vdmFyIGRyYXdpbmdfcGFydHMgPSBbXTtcbi8vZC5saW5rX2RyYXdpbmdfcGFydHMoZHJhd2luZ19wYXJ0cyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHBhZ2UgMlwiKTtcbiAgICBkID0gbWtfZHJhd2luZygpO1xuICAgIHZhciBzaGVldF9zZWN0aW9uID0gJ1BWJztcbiAgICB2YXIgc2hlZXRfbnVtID0gJzAxJztcbiAgICBkLmFwcGVuZChta19ib3JkZXIoc2V0dGluZ3MsIHNoZWV0X3NlY3Rpb24sIHNoZWV0X251bSApKTtcblxuICAgIHZhciBmID0gc2V0dGluZ3MuZjtcblxuICAgIC8vdmFyIGNvbXBvbmVudHMgPSBzZXR0aW5ncy5jb21wb25lbnRzO1xuICAgIC8vdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcbiAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuXG5cblxuXG4gICAgdmFyIHgsIHksIGgsIHc7XG4gICAgdmFyIG9mZnNldDtcblxuLy8gRGVmaW5lIGQuYmxvY2tzXG5cbi8vIG1vZHVsZSBkLmJsb2NrXG4gICAgdyA9IHNpemUubW9kdWxlLmZyYW1lLnc7XG4gICAgaCA9IHNpemUubW9kdWxlLmZyYW1lLmg7XG5cbiAgICBkLmJsb2NrX3N0YXJ0KCdtb2R1bGUnKTtcblxuICAgIC8vIGZyYW1lXG4gICAgZC5sYXllcignbW9kdWxlJyk7XG4gICAgeCA9IDA7XG4gICAgeSA9IDArc2l6ZS5tb2R1bGUubGVhZDtcbiAgICBkLnJlY3QoIFt4LHkraC8yXSwgW3csaF0gKTtcbiAgICAvLyBmcmFtZSB0cmlhbmdsZT9cbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC13LzIseV0sXG4gICAgICAgIFt4LHkrdy8yXSxcbiAgICBdKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCx5K3cvMl0sXG4gICAgICAgIFt4K3cvMix5XSxcbiAgICBdKTtcbiAgICAvLyBsZWFkc1xuICAgIGQubGF5ZXIoJ0RDX3BvcycpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3gsIHktc2l6ZS5tb2R1bGUubGVhZF1cbiAgICBdKTtcbiAgICBkLmxheWVyKCdEQ19uZWcnKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCwgeStoXSxcbiAgICAgICAgW3gsIHkraCsoc2l6ZS5tb2R1bGUubGVhZCldXG4gICAgXSk7XG4gICAgLy8gcG9zIHNpZ25cbiAgICBkLmxheWVyKCd0ZXh0Jyk7XG4gICAgZC50ZXh0KFxuICAgICAgICBbeCtzaXplLm1vZHVsZS5sZWFkLzIsIHktc2l6ZS5tb2R1bGUubGVhZC8yXSxcbiAgICAgICAgJysnLFxuICAgICAgICAnc2lnbnMnXG4gICAgKTtcbiAgICAvLyBuZWcgc2lnblxuICAgIGQudGV4dChcbiAgICAgICAgW3grc2l6ZS5tb2R1bGUubGVhZC8yLCB5K2grc2l6ZS5tb2R1bGUubGVhZC8yXSxcbiAgICAgICAgJy0nLFxuICAgICAgICAnc2lnbnMnXG4gICAgKTtcbiAgICAvLyBncm91bmRcbiAgICBkLmxheWVyKCdEQ19ncm91bmQnKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC13LzIsIHkraC8yXSxcbiAgICAgICAgW3gtdy8yLXcvNCwgeStoLzJdLFxuICAgIF0pO1xuXG4gICAgZC5sYXllcigpO1xuICAgIGQuYmxvY2tfZW5kKCk7XG5cbi8vI3N0cmluZ1xuICAgIGQuYmxvY2tfc3RhcnQoJ3N0cmluZycpO1xuXG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG5cblxuXG5cblxuICAgIHZhciBtYXhfZGlzcGxheWVkX21vZHVsZXMgPSA5O1xuICAgIHZhciBicmVha19zdHJpbmcgPSBmYWxzZTtcblxuICAgIGlmKCBzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nID4gbWF4X2Rpc3BsYXllZF9tb2R1bGVzICl7XG4gICAgICAgIGRpc3BsYXllZF9tb2R1bGVzID0gbWF4X2Rpc3BsYXllZF9tb2R1bGVzIC0gMTtcbiAgICAgICAgYnJlYWtfc3RyaW5nID0gdHJ1ZTtcbiAgICAgICAgc2l6ZS5zdHJpbmcuaCA9IChzaXplLm1vZHVsZS5oICogKGRpc3BsYXllZF9tb2R1bGVzKzEpICkgKyBzaXplLnN0cmluZy5nYXBfbWlzc2luZztcbiAgICB9IGVsc2Uge1xuICAgICAgICBkaXNwbGF5ZWRfbW9kdWxlcyA9IHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmc7XG4gICAgICAgIHNpemUuc3RyaW5nLmggPSAoc2l6ZS5tb2R1bGUuaCAqIGRpc3BsYXllZF9tb2R1bGVzKTtcbiAgICB9XG4gICAgbG9jLmFycmF5Lmxvd2VyID0gbG9jLmFycmF5LnVwcGVyICsgc2l6ZS5zdHJpbmcuaDtcblxuICAgIHNpemUuc3RyaW5nLmhfbWF4ID0gKHNpemUubW9kdWxlLmggKiBtYXhfZGlzcGxheWVkX21vZHVsZXMpICsgc2l6ZS5zdHJpbmcuZ2FwX21pc3Npbmc7XG4gICAgbG9jLmFycmF5Lmxvd2VyX2xpbWl0ID0gbG9jLmFycmF5LnVwcGVyICsgc2l6ZS5zdHJpbmcuaF9tYXg7XG5cblxuXG4gICAgZm9yKCB2YXIgcj0wOyByPGRpc3BsYXllZF9tb2R1bGVzOyByKyspe1xuICAgICAgICBkLmJsb2NrKCdtb2R1bGUnLCBbeCx5XSk7XG4gICAgICAgIHkgKz0gc2l6ZS5tb2R1bGUuaDtcblxuICAgIH1cbiAgICBpZiggYnJlYWtfc3RyaW5nICkge1xuICAgICAgICBkLmxpbmUoXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgW3gseV0sXG4gICAgICAgICAgICAgICAgW3gseStzaXplLnN0cmluZy5nYXBfbWlzc2luZ10sXG4gICAgICAgICAgICAvL1t4LXNpemUubW9kdWxlLmZyYW1lLncqMy80LCB5K3NpemUuc3RyaW5nLmggKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdEQ19pbnRlcm1vZHVsZSdcbiAgICAgICAgKTtcblxuICAgICAgICB5ICs9IHNpemUuc3RyaW5nLmdhcF9taXNzaW5nO1xuICAgICAgICBkLmJsb2NrKCdtb2R1bGUnLCBbeCx5XSk7XG4gICAgfVxuXG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG5cbiAgICAvL1RPRE86IGFkZCBsb29wIHRvIGp1bXAgb3ZlciBuZWdhdGl2ZSByZXR1cm4gd2lyZXNcbiAgICBkLmxheWVyKCdEQ19ncm91bmQnKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC1zaXplLm1vZHVsZS5mcmFtZS53KjMvNCwgeStzaXplLm1vZHVsZS5oLzJdLFxuICAgICAgICBbeC1zaXplLm1vZHVsZS5mcmFtZS53KjMvNCwgeStzaXplLnN0cmluZy5oX21heCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAgICAgLy9beC1zaXplLm1vZHVsZS5mcmFtZS53KjMvNCwgeStzaXplLnN0cmluZy5oICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICBdKTtcbiAgICBkLmxheWVyKCk7XG5cblxuICAgIGQuYmxvY2tfZW5kKCk7XG5cblxuLy8gdGVybWluYWxcbiAgICBkLmJsb2NrX3N0YXJ0KCd0ZXJtaW5hbCcpO1xuICAgIHggPSAwO1xuICAgIHkgPSAwO1xuXG4gICAgZC5sYXllcigndGVybWluYWwnKTtcbiAgICBkLmNpcmMoXG4gICAgICAgIFt4LHldLFxuICAgICAgICBzaXplLnRlcm1pbmFsX2RpYW1cbiAgICApO1xuICAgIGQubGF5ZXIoKTtcbiAgICBkLmJsb2NrX2VuZCgpO1xuXG4vLyBmdXNlXG5cbiAgICBkLmJsb2NrX3N0YXJ0KCdmdXNlJyk7XG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG4gICAgdyA9IDEwO1xuICAgIGggPSA1O1xuXG4gICAgZC5sYXllcigndGVybWluYWwnKTtcbiAgICBkLnJlY3QoXG4gICAgICAgIFt4LHldLFxuICAgICAgICBbdyxoXVxuICAgICk7XG4gICAgZC5saW5lKCBbXG4gICAgICAgIFt3LzIseV0sXG4gICAgICAgIFt3LzIrc2l6ZS5mdXNlLncsIHldXG4gICAgXSk7XG4gICAgZC5ibG9jaygndGVybWluYWwnLCBbc2l6ZS5mdXNlLncsIHldICk7XG5cbiAgICBkLmxpbmUoIFtcbiAgICAgICAgWy13LzIseV0sXG4gICAgICAgIFstdy8yLXNpemUuZnVzZS53LCB5XVxuICAgIF0pO1xuICAgIGQuYmxvY2soJ3Rlcm1pbmFsJywgWy1zaXplLmZ1c2UudywgeV0gKTtcblxuICAgIGQubGF5ZXIoKTtcbiAgICBkLmJsb2NrX2VuZCgpO1xuXG4vLyBncm91bmQgc3ltYm9sXG4gICAgZC5ibG9ja19zdGFydCgnZ3JvdW5kJyk7XG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG5cbiAgICBkLmxheWVyKCdBQ19ncm91bmQnKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCx5XSxcbiAgICAgICAgW3gseSs0MF0sXG4gICAgXSk7XG4gICAgeSArPSAyNTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC03LjUseV0sXG4gICAgICAgIFt4KzcuNSx5XSxcbiAgICBdKTtcbiAgICB5ICs9IDU7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gtNSx5XSxcbiAgICAgICAgW3grNSx5XSxcbiAgICBdKTtcbiAgICB5ICs9IDU7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gtMi41LHldLFxuICAgICAgICBbeCsyLjUseV0sXG4gICAgXSk7XG4gICAgZC5sYXllcigpO1xuXG4gICAgZC5ibG9ja19lbmQoKTtcblxuXG5cblxuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEZyYW1lXG4vKlxuICAgIGQuc2VjdGlvbignRnJhbWUnKTtcblxuICAgIHcgPSBzaXplLmRyYXdpbmcudztcbiAgICBoID0gc2l6ZS5kcmF3aW5nLmg7XG4gICAgdmFyIHBhZGRpbmcgPSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZztcblxuICAgIGQubGF5ZXIoJ2ZyYW1lJyk7XG5cbiAgICAvL2JvcmRlclxuICAgIGQucmVjdCggW3cvMiAsIGgvMl0sIFt3IC0gcGFkZGluZyoyLCBoIC0gcGFkZGluZyoyIF0gKTtcblxuICAgIHggPSB3IC0gcGFkZGluZyAqIDM7XG4gICAgeSA9IHBhZGRpbmcgKiAzO1xuXG4gICAgdyA9IHNpemUuZHJhd2luZy50aXRsZWJveDtcbiAgICBoID0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94O1xuXG4gICAgLy8gYm94IHRvcC1yaWdodFxuICAgIGQucmVjdCggW3gtdy8yLCB5K2gvMl0sIFt3LGhdICk7XG5cbiAgICB5ICs9IGggKyBwYWRkaW5nO1xuXG4gICAgdyA9IHNpemUuZHJhd2luZy50aXRsZWJveDtcbiAgICBoID0gc2l6ZS5kcmF3aW5nLmggLSBwYWRkaW5nKjggLSBzaXplLmRyYXdpbmcudGl0bGVib3gqMi41O1xuXG4gICAgLy90aXRsZSBib3hcbiAgICBkLnJlY3QoIFt4LXcvMiwgeStoLzJdLCBbdyxoXSApO1xuXG4gICAgdmFyIHRpdGxlID0ge307XG4gICAgdGl0bGUudG9wID0geTtcbiAgICB0aXRsZS5ib3R0b20gPSB5K2g7XG4gICAgdGl0bGUucmlnaHQgPSB4O1xuICAgIHRpdGxlLmxlZnQgPSB4LXcgO1xuXG5cbiAgICAvLyBib3ggYm90dG9tLXJpZ2h0XG4gICAgaCA9IHNpemUuZHJhd2luZy50aXRsZWJveCAqIDEuNTtcbiAgICB5ID0gdGl0bGUuYm90dG9tICsgcGFkZGluZztcbiAgICBkLnJlY3QoIFt4LXcvMiwgeStoLzJdLCBbdyxoXSApO1xuXG4gICAgdmFyIHBhZ2UgPSB7fTtcbiAgICBwYWdlLnJpZ2h0ID0gdGl0bGUucmlnaHQ7XG4gICAgcGFnZS5sZWZ0ID0gdGl0bGUubGVmdDtcbiAgICBwYWdlLnRvcCA9IHRpdGxlLmJvdHRvbSArIHBhZGRpbmc7XG4gICAgcGFnZS5ib3R0b20gPSBwYWdlLnRvcCArIHNpemUuZHJhd2luZy50aXRsZWJveCoxLjU7XG4gICAgLy8gZC50ZXh0XG5cbiAgICB4ID0gdGl0bGUubGVmdCArIHBhZGRpbmc7XG4gICAgeSA9IHRpdGxlLmJvdHRvbSAtIHBhZGRpbmc7XG5cbiAgICB4ICs9IDEwO1xuICAgIGQudGV4dChbeCx5XSxcbiAgICAgICAgIFsgc3lzdGVtLmludmVydGVyLm1ha2UgKyBcIiBcIiArIHN5c3RlbS5pbnZlcnRlci5tb2RlbCArIFwiIEludmVydGVyIFN5c3RlbVwiIF0sXG4gICAgICAgICd0aXRsZTEnLCAndGV4dCcpLnJvdGF0ZSgtOTApO1xuXG4gICAgeCArPSAxNDtcbiAgICBpZiggc3lzdGVtLm1vZHVsZS5zcGVjcyAhPT0gdW5kZWZpbmVkICYmIHN5c3RlbS5tb2R1bGUuc3BlY3MgIT09IG51bGwgICl7XG4gICAgICAgIGQudGV4dChbeCx5XSwgW1xuICAgICAgICAgICAgc3lzdGVtLm1vZHVsZS5tYWtlICsgXCIgXCIgKyBzeXN0ZW0ubW9kdWxlLm1vZGVsICtcbiAgICAgICAgICAgICAgICBcIiAoXCIgKyBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgICsgXCIgc3RyaW5ncyBvZiBcIiArIHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgKyBcIiBtb2R1bGVzIClcIlxuICAgICAgICBdLCAndGl0bGUyJywgJ3RleHQnKS5yb3RhdGUoLTkwKTtcbiAgICB9XG5cbiAgICB4ID0gcGFnZS5sZWZ0ICsgcGFkZGluZztcbiAgICB5ID0gcGFnZS50b3AgKyBwYWRkaW5nO1xuICAgIHkgKz0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94ICogMS41ICogMy80O1xuXG5cbiAgICBkLnRleHQoW3gseV0sXG4gICAgICAgIFsnUFYxJ10sXG4gICAgICAgICdwYWdlJywgJ3RleHQnKTtcblxuXG4vLyovXG5cblxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyNhcnJheVxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnbW9kdWxlJykgJiYgZi5zZWN0aW9uX2RlZmluZWQoJ2FycmF5JykgKXtcbiAgICAgICAgZC5zZWN0aW9uKCdhcnJheScpO1xuXG5cbiAgICAgICAgeCA9IGxvYy5hcnJheS5yaWdodCAtIHNpemUuc3RyaW5nLnc7XG4gICAgICAgIHkgPSBsb2MuYXJyYXkudXBwZXI7XG4gICAgICAgIC8veSAtPSBzaXplLnN0cmluZy5oLzI7XG5cblxuICAgICAgICAvL2ZvciggdmFyIGk9MDsgaTxzeXN0ZW0uREMuc3RyaW5nX251bTsgaSsrICkge1xuICAgICAgICBmb3IoIHZhciBpIGluIF8ucmFuZ2Uoc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzKSkge1xuICAgICAgICAgICAgLy92YXIgb2Zmc2V0ID0gaSAqIHNpemUud2lyZV9vZmZzZXQuYmFzZVxuICAgICAgICAgICAgdmFyIG9mZnNldF93aXJlID0gc2l6ZS53aXJlX29mZnNldC5taW4gKyAoIHNpemUud2lyZV9vZmZzZXQuYmFzZSAqIGkgKTtcblxuICAgICAgICAgICAgZC5ibG9jaygnc3RyaW5nJywgW3gseV0pO1xuICAgICAgICAgICAgLy8gcG9zaXRpdmUgaG9tZSBydW5cbiAgICAgICAgICAgIGQubGF5ZXIoJ0RDX3BvcycpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHggLCBsb2MuYXJyYXkudXBwZXIgXSxcbiAgICAgICAgICAgICAgICBbIHggLCBsb2MuYXJyYXkudXBwZXItb2Zmc2V0X3dpcmUgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtvZmZzZXRfd2lyZSAsIGxvYy5hcnJheS51cHBlci1vZmZzZXRfd2lyZSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K29mZnNldF93aXJlICwgbG9jLmpiX2JveC55LW9mZnNldF93aXJlXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5qYl9ib3gueCAsIGxvYy5qYl9ib3gueS1vZmZzZXRfd2lyZV0sXG4gICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgLy8gbmVnYXRpdmUgaG9tZSBydW5cbiAgICAgICAgICAgIGQubGF5ZXIoJ0RDX25lZycpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHggLCBsb2MuYXJyYXkubG93ZXIgXSxcbiAgICAgICAgICAgICAgICBbIHggLCBsb2MuYXJyYXkubG93ZXJfbGltaXQrb2Zmc2V0X3dpcmUgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtvZmZzZXRfd2lyZSAsIGxvYy5hcnJheS5sb3dlcl9saW1pdCtvZmZzZXRfd2lyZSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K29mZnNldF93aXJlICwgbG9jLmpiX2JveC55K29mZnNldF93aXJlXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5qYl9ib3gueCAsIGxvYy5qYl9ib3gueStvZmZzZXRfd2lyZV0sXG4gICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgeCAtPSBzaXplLnN0cmluZy53O1xuICAgICAgICB9XG5cbiAgICAvLyAgICBkLnJlY3QoXG4gICAgLy8gICAgICAgIFsgKGxvYy5hcnJheS5yaWdodCtsb2MuYXJyYXkubGVmdCkvMiwgKGxvYy5hcnJheS5sb3dlcitsb2MuYXJyYXkudXBwZXIpLzIgXSxcbiAgICAvLyAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQtbG9jLmFycmF5LmxlZnQsIGxvYy5hcnJheS5sb3dlci1sb2MuYXJyYXkudXBwZXIgXSxcbiAgICAvLyAgICAgICAgJ0RDX3BvcycpO1xuICAgIC8vXG5cbiAgICAgICAgZC5sYXllcignRENfZ3JvdW5kJyk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAvL1sgbG9jLmFycmF5LmxlZnQgLCBsb2MuYXJyYXkubG93ZXIgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICAgICAgWyBsb2MuYXJyYXkubGVmdCwgbG9jLmFycmF5Lmxvd2VyX2xpbWl0ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kICwgbG9jLmFycmF5Lmxvd2VyX2xpbWl0ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kICwgbG9jLmpiX2JveC55ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmRdLFxuICAgICAgICAgICAgWyBsb2MuamJfYm94LnggLCBsb2MuamJfYm94Lnkrc2l6ZS53aXJlX29mZnNldC5ncm91bmRdLFxuICAgICAgICBdKTtcblxuICAgICAgICBkLmxheWVyKCk7XG5cblxuICAgIH0vLyBlbHNlIHsgY29uc29sZS5sb2coXCJEcmF3aW5nOiBhcnJheSBub3QgcmVhZHlcIil9XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIGNvbWJpbmVyIGJveFxuXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdEQycpICl7XG5cbiAgICAgICAgZC5zZWN0aW9uKFwiY29tYmluZXJcIik7XG5cbiAgICAgICAgeCA9IGxvYy5qYl9ib3gueDtcbiAgICAgICAgeSA9IGxvYy5qYl9ib3gueTtcblxuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbeCx5XSxcbiAgICAgICAgICAgIFtzaXplLmpiX2JveC53LHNpemUuamJfYm94LmhdLFxuICAgICAgICAgICAgJ2JveCdcbiAgICAgICAgKTtcblxuXG5cbiAgICAgICAgZm9yKCB2YXIgaSBpbiBfLnJhbmdlKHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncykpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IHNpemUud2lyZV9vZmZzZXQubWluICsgKCBzaXplLndpcmVfb2Zmc2V0LmJhc2UgKiBpICk7XG5cbiAgICAgICAgICAgIGQubGF5ZXIoJ0RDX3BvcycpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHggLCB5LW9mZnNldF0sXG4gICAgICAgICAgICAgICAgWyB4ICwgeS1vZmZzZXRdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgICAgICB5OiB5LW9mZnNldCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHggLCB5LW9mZnNldF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54LW9mZnNldCAsIHktb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngtb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbV0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54LW9mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICAgICAgeDogbG9jLmRpc2Nib3gueC1vZmZzZXQsXG4gICAgICAgICAgICAgICAgeTogbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGQubGF5ZXIoJ0RDX25lZycpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHgsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIHgtc2l6ZS5mdXNlLncvMiAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgZC5ibG9jayggJ2Z1c2UnLCB7XG4gICAgICAgICAgICAgICAgeDogeCAsXG4gICAgICAgICAgICAgICAgeTogeStvZmZzZXQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4K3NpemUuZnVzZS53LzIgLCB5K29mZnNldF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbV0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICAgICAgeDogbG9jLmRpc2Nib3gueCtvZmZzZXQsXG4gICAgICAgICAgICAgICAgeTogbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkLmxheWVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2QubGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgICAgICAvL2QubGluZShbXG4gICAgICAgIC8vICAgIFsgbG9jLmFycmF5LmxlZnQgLCBsb2MuYXJyYXkubG93ZXIgKyBzaXplLm1vZHVsZS53ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgLy8gICAgWyBsb2MuYXJyYXkucmlnaHQrc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLCBsb2MuYXJyYXkubG93ZXIgKyBzaXplLm1vZHVsZS53ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgLy8gICAgWyBsb2MuYXJyYXkucmlnaHQrc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLCBsb2MuYXJyYXkueSArIHNpemUubW9kdWxlLncgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZF0sXG4gICAgICAgIC8vICAgIFsgbG9jLmFycmF5LnggLCBsb2MuYXJyYXkueStzaXplLm1vZHVsZS53K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAgICAgLy9dKTtcblxuICAgICAgICAvL2QubGF5ZXIoKTtcblxuICAgICAgICAvLyBHcm91bmRcbiAgICAgICAgLy9vZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0LmdhcCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kO1xuICAgICAgICBvZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZDtcblxuICAgICAgICBkLmxheWVyKCdEQ19ncm91bmQnKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFsgeCAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgIFsgeCAsIHkrb2Zmc2V0XSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5K29mZnNldCxcbiAgICAgICAgfSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbIHggLCB5K29mZnNldF0sXG4gICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgeStvZmZzZXRdLFxuICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW1dLFxuICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgeDogbG9jLmRpc2Nib3gueCtvZmZzZXQsXG4gICAgICAgICAgICB5OiBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtXG4gICAgICAgIH0pO1xuICAgICAgICBkLmxheWVyKCk7XG5cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgLy8gREMgZGlzY29uZWN0XG4gICAgICAgIGQuc2VjdGlvbihcIkRDIGRpY29uZWN0XCIpO1xuXG5cbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW2xvYy5kaXNjYm94LngsIGxvYy5kaXNjYm94LnldLFxuICAgICAgICAgICAgW3NpemUuZGlzY2JveC53LHNpemUuZGlzY2JveC5oXSxcbiAgICAgICAgICAgICdib3gnXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gREMgZGlzY29uZWN0IGNvbWJpbmVyIGQubGluZXNcblxuICAgICAgICB4ID0gbG9jLmRpc2Nib3gueDtcbiAgICAgICAgeSA9IGxvYy5kaXNjYm94LnkgKyBzaXplLmRpc2Nib3guaC8yO1xuXG4gICAgICAgIGlmKCBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgPiAxKXtcbiAgICAgICAgICAgIHZhciBvZmZzZXRfbWluID0gc2l6ZS53aXJlX29mZnNldC5taW47XG4gICAgICAgICAgICB2YXIgb2Zmc2V0X21heCA9IHNpemUud2lyZV9vZmZzZXQubWluICsgKCAoc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzIC0xKSAqIHNpemUud2lyZV9vZmZzZXQuYmFzZSApO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHgtb2Zmc2V0X21pbiwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgICAgIFsgeC1vZmZzZXRfbWF4LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBdLCAnRENfcG9zJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCtvZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICAgICAgWyB4K29mZnNldF9tYXgsIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIF0sICdEQ19uZWcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEludmVydGVyIGNvbmVjdGlvblxuICAgICAgICAvL2QubGluZShbXG4gICAgICAgIC8vICAgIFsgeC1vZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgIC8vICAgIFsgeC1vZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgIC8vXSwnRENfcG9zJyk7XG5cbiAgICAgICAgLy9vZmZzZXQgPSBvZmZzZXRfbWF4IC0gb2Zmc2V0X21pbjtcbiAgICAgICAgb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5taW47XG5cbiAgICAgICAgLy8gbmVnXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbIHgrb2Zmc2V0LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBbIHgrb2Zmc2V0LCBsb2MuaW52ZXJ0ZXIueStzaXplLmludmVydGVyLmgvMi1zaXplLnRlcm1pbmFsX2RpYW0gXSxcbiAgICAgICAgXSwnRENfbmVnJyk7XG4gICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgIHg6IHgrb2Zmc2V0LFxuICAgICAgICAgICAgeTogbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBwb3NcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFsgeC1vZmZzZXQsIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIFsgeC1vZmZzZXQsIGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSBdLFxuICAgICAgICBdLCdEQ19wb3MnKTtcbiAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgeDogeC1vZmZzZXQsXG4gICAgICAgICAgICB5OiBsb2MuaW52ZXJ0ZXIueStzaXplLmludmVydGVyLmgvMi1zaXplLnRlcm1pbmFsX2RpYW0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGdyb3VuZFxuICAgICAgICAvL29mZnNldCA9IHNpemUud2lyZV9vZmZzZXQuZ2FwICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQ7XG4gICAgICAgIG9mZnNldCA9IHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgWyB4K29mZnNldCwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgWyB4K29mZnNldCwgbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtIF0sXG4gICAgICAgIF0sJ0RDX2dyb3VuZCcpO1xuICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICB4OiB4K29mZnNldCxcbiAgICAgICAgICAgIHk6IGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSxcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vI2ludmVydGVyXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdpbnZlcnRlcicpICl7XG5cbiAgICAgICAgZC5zZWN0aW9uKFwiaW52ZXJ0ZXJcIik7XG5cblxuICAgICAgICB4ID0gbG9jLmludmVydGVyLng7XG4gICAgICAgIHkgPSBsb2MuaW52ZXJ0ZXIueTtcblxuXG4gICAgICAgIC8vZnJhbWVcbiAgICAgICAgZC5sYXllcignYm94Jyk7XG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFt4LHldLFxuICAgICAgICAgICAgW3NpemUuaW52ZXJ0ZXIudywgc2l6ZS5pbnZlcnRlci5oXVxuICAgICAgICApO1xuICAgICAgICAvLyBMYWJlbCBhdCB0b3AgKEludmVydGVyLCBtYWtlLCBtb2RlbCwgLi4uKVxuICAgICAgICBkLmxheWVyKCd0ZXh0Jyk7XG4gICAgICAgIGQudGV4dChcbiAgICAgICAgICAgIFtsb2MuaW52ZXJ0ZXIueCwgbG9jLmludmVydGVyLnRvcCArIHNpemUuaW52ZXJ0ZXIudGV4dF9nYXAgXSxcbiAgICAgICAgICAgIFsgJ0ludmVydGVyJywgc2V0dGluZ3Muc3lzdGVtLmludmVydGVyLm1ha2UgKyBcIiBcIiArIHNldHRpbmdzLnN5c3RlbS5pbnZlcnRlci5tb2RlbCBdLFxuICAgICAgICAgICAgJ2xhYmVsJ1xuICAgICAgICApO1xuICAgICAgICBkLmxheWVyKCk7XG5cbiAgICAvLyNpbnZlcnRlciBzeW1ib2xcbiAgICAgICAgZC5zZWN0aW9uKFwiaW52ZXJ0ZXIgc3ltYm9sXCIpO1xuXG4gICAgICAgIHggPSBsb2MuaW52ZXJ0ZXIueDtcbiAgICAgICAgeSA9IGxvYy5pbnZlcnRlci55O1xuXG4gICAgICAgIHcgPSBzaXplLmludmVydGVyLnN5bWJvbF93O1xuICAgICAgICBoID0gc2l6ZS5pbnZlcnRlci5zeW1ib2xfaDtcblxuICAgICAgICB2YXIgc3BhY2UgPSB3KjEvMTI7XG5cbiAgICAgICAgLy8gSW52ZXJ0ZXIgc3ltYm9sXG4gICAgICAgIGQubGF5ZXIoJ2JveCcpO1xuXG4gICAgICAgIC8vIGJveFxuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbeCx5XSxcbiAgICAgICAgICAgIFt3LCBoXVxuICAgICAgICApO1xuICAgICAgICAvLyBkaWFnYW5hbFxuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3gtdy8yLCB5K2gvMl0sXG4gICAgICAgICAgICBbeCt3LzIsIHktaC8yXSxcblxuICAgICAgICBdKTtcbiAgICAgICAgLy8gRENcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UsXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlXSxcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNixcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2VdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UsXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlKjJdLFxuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSoyLFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlKjMsXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlKjJdLFxuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSo0LFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlKjUsXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlKjJdLFxuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSo2LFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgXSk7XG5cbiAgICAgICAgLy8gQUNcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4ICsgdy8yIC0gc3BhY2UsXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjIsXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSozLFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSo0LFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqNSxcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqNixcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQubGF5ZXIoKTtcblxuXG5cblxuXG4gICAgfVxuXG5cblxuXG5cbi8vI0FDX2Rpc2Njb25lY3RcbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ0FDJykgKXtcbiAgICAgICAgZC5zZWN0aW9uKFwiQUNfZGlzY2NvbmVjdFwiKTtcblxuICAgICAgICB4ID0gbG9jLkFDX2Rpc2MueDtcbiAgICAgICAgeSA9IGxvYy5BQ19kaXNjLnk7XG4gICAgICAgIHBhZGRpbmcgPSBzaXplLnRlcm1pbmFsX2RpYW07XG5cbiAgICAgICAgZC5sYXllcignYm94Jyk7XG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFt4LCB5XSxcbiAgICAgICAgICAgIFtzaXplLkFDX2Rpc2Mudywgc2l6ZS5BQ19kaXNjLmhdXG4gICAgICAgICk7XG4gICAgICAgIGQubGF5ZXIoKTtcblxuXG4gICAgLy9kLmNpcmMoW3gseV0sNSk7XG5cblxuXG4gICAgLy8jQUMgbG9hZCBjZW50ZXJcbiAgICAgICAgZC5zZWN0aW9uKFwiQUMgbG9hZCBjZW50ZXJcIik7XG5cbiAgICAgICAgdmFyIGJyZWFrZXJfc3BhY2luZyA9IHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5zcGFjaW5nO1xuXG4gICAgICAgIHggPSBsb2MuQUNfbG9hZGNlbnRlci54O1xuICAgICAgICB5ID0gbG9jLkFDX2xvYWRjZW50ZXIueTtcbiAgICAgICAgdyA9IHNpemUuQUNfbG9hZGNlbnRlci53O1xuICAgICAgICBoID0gc2l6ZS5BQ19sb2FkY2VudGVyLmg7XG5cbiAgICAgICAgZC5yZWN0KFt4LHldLFxuICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAnYm94J1xuICAgICAgICApO1xuXG4gICAgICAgIGQudGV4dChbeCx5LWgqMC40XSxcbiAgICAgICAgICAgIFtzeXN0ZW0uQUMubG9hZGNlbnRlcl90eXBlcywgJ0xvYWQgQ2VudGVyJ10sXG4gICAgICAgICAgICAnbGFiZWwnLFxuICAgICAgICAgICAgJ3RleHQnXG4gICAgICAgICk7XG4gICAgICAgIHcgPSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci53O1xuICAgICAgICBoID0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIuaDtcblxuICAgICAgICBwYWRkaW5nID0gbG9jLkFDX2xvYWRjZW50ZXIueCAtIGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLmxlZnQgLSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci53O1xuXG4gICAgICAgIHkgPSBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy50b3A7XG4gICAgICAgIHkgKz0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnNwYWNpbmcvMjtcbiAgICAgICAgZm9yKCB2YXIgaT0wOyBpPHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5udW07IGkrKyl7XG4gICAgICAgICAgICBkLnJlY3QoW3gtcGFkZGluZy13LzIseV0sW3csaF0sJ2JveCcpO1xuICAgICAgICAgICAgZC5yZWN0KFt4K3BhZGRpbmcrdy8yLHldLFt3LGhdLCdib3gnKTtcbiAgICAgICAgICAgIHkgKz0gYnJlYWtlcl9zcGFjaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHMsIGw7XG5cbiAgICAgICAgbCA9IGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXI7XG4gICAgICAgIHMgPSBzaXplLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhcjtcbiAgICAgICAgZC5yZWN0KFtsLngsbC55XSwgW3MudyxzLmhdLCAnQUNfbmV1dHJhbCcgKTtcblxuICAgICAgICBsID0gbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyO1xuICAgICAgICBzID0gc2l6ZS5BQ19sb2FkY2VudGVyLmdyb3VuZGJhcjtcbiAgICAgICAgZC5yZWN0KFtsLngsbC55XSwgW3MudyxzLmhdLCAnQUNfZ3JvdW5kJyApO1xuXG4gICAgICAgIGQuYmxvY2soJ2dyb3VuZCcsIFtsLngsbC55K3MuaC8yXSk7XG5cblxuXG4gICAgLy8gQUMgZC5saW5lc1xuICAgICAgICBkLnNlY3Rpb24oXCJBQyBkLmxpbmVzXCIpO1xuXG4gICAgICAgIHggPSBsb2MuaW52ZXJ0ZXIuYm90dG9tX3JpZ2h0Lng7XG4gICAgICAgIHkgPSBsb2MuaW52ZXJ0ZXIuYm90dG9tX3JpZ2h0Lnk7XG4gICAgICAgIHggLT0gc2l6ZS50ZXJtaW5hbF9kaWFtICogKHN5c3RlbS5BQy5udW1fY29uZHVjdG9ycysxKTtcbiAgICAgICAgeSAtPSBzaXplLnRlcm1pbmFsX2RpYW07XG5cbiAgICAgICAgdmFyIGNvbmR1aXRfeSA9IGxvYy5BQ19jb25kdWl0Lnk7XG4gICAgICAgIHBhZGRpbmcgPSBzaXplLnRlcm1pbmFsX2RpYW07XG4gICAgICAgIC8vdmFyIEFDX2QubGF5ZXJfbmFtZXMgPSBbJ0FDX2dyb3VuZCcsICdBQ19uZXV0cmFsJywgJ0FDX0wxJywgJ0FDX0wyJywgJ0FDX0wyJ107XG5cbiAgICAgICAgZm9yKCB2YXIgaT0wOyBpIDwgc3lzdGVtLkFDLm51bV9jb25kdWN0b3JzOyBpKysgKXtcbiAgICAgICAgICAgIGQuYmxvY2soJ3Rlcm1pbmFsJywgW3gseV0gKTtcbiAgICAgICAgICAgIGQubGF5ZXIoJ0FDXycrc3lzdGVtLkFDLmNvbmR1Y3RvcnNbaV0pO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbeCwgeV0sXG4gICAgICAgICAgICAgICAgW3gsIGxvYy5BQ19kaXNjLmJvdHRvbSAtIHBhZGRpbmcqMiAtIHBhZGRpbmcqaSAgXSxcbiAgICAgICAgICAgICAgICBbbG9jLkFDX2Rpc2MubGVmdCwgbG9jLkFDX2Rpc2MuYm90dG9tIC0gcGFkZGluZyoyIC0gcGFkZGluZyppIF0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIHggKz0gc2l6ZS50ZXJtaW5hbF9kaWFtO1xuICAgICAgICB9XG4gICAgICAgIGQubGF5ZXIoKTtcblxuICAgICAgICB4ID0gbG9jLkFDX2Rpc2MueDtcbiAgICAgICAgeSA9IGxvYy5BQ19kaXNjLnkgKyBzaXplLkFDX2Rpc2MuaC8yO1xuICAgICAgICB5IC09IHBhZGRpbmcqMjtcblxuICAgICAgICBpZiggc3lzdGVtLkFDLmNvbmR1Y3RvcnMuaW5kZXhPZignZ3JvdW5kJykrMSApIHtcbiAgICAgICAgICAgIGQubGF5ZXIoJ0FDX2dyb3VuZCcpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHgtc2l6ZS5BQ19kaXNjLncvMiwgeSBdLFxuICAgICAgICAgICAgICAgIFsgeCtzaXplLkFDX2Rpc2Mudy8yK3BhZGRpbmcqMiwgeSBdLFxuICAgICAgICAgICAgICAgIFsgeCtzaXplLkFDX2Rpc2Mudy8yK3BhZGRpbmcqMiwgY29uZHVpdF95ICsgYnJlYWtlcl9zcGFjaW5nKjIgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLmxlZnQrcGFkZGluZyoyLCBjb25kdWl0X3kgKyBicmVha2VyX3NwYWNpbmcqMiBdLFxuICAgICAgICAgICAgICAgIC8vWyBsb2MuQUNfbG9hZGNlbnRlci5sZWZ0K3BhZGRpbmcqMiwgeSBdLFxuICAgICAgICAgICAgICAgIC8vWyBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueC1wYWRkaW5nLCB5IF0sXG4gICAgICAgICAgICAgICAgLy9bIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci54LXBhZGRpbmcsIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci55K3NpemUuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIuaC8yIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5sZWZ0K3BhZGRpbmcqMiwgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLnkgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci54LXNpemUuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIudy8yLCBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueSBdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggc3lzdGVtLkFDLmNvbmR1Y3RvcnMuaW5kZXhPZignbmV1dHJhbCcpKzEgKSB7XG4gICAgICAgICAgICB5IC09IHBhZGRpbmc7XG4gICAgICAgICAgICBkLmxheWVyKCdBQ19uZXV0cmFsJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeC1zaXplLkFDX2Rpc2Mudy8yLCB5IF0sXG4gICAgICAgICAgICAgICAgWyB4K3BhZGRpbmcqMyoyLCB5IF0sXG4gICAgICAgICAgICAgICAgWyB4K3BhZGRpbmcqMyoyLCBjb25kdWl0X3kgKyBicmVha2VyX3NwYWNpbmcqMSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhci54LCBjb25kdWl0X3kgKyBicmVha2VyX3NwYWNpbmcqMSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhci54LFxuICAgICAgICAgICAgICAgICAgICBsb2MuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyLnktc2l6ZS5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIuaC8yIF0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuXG5cblxuICAgICAgICBmb3IoIHZhciBpPTE7IGkgPD0gMzsgaSsrICkge1xuICAgICAgICAgICAgaWYoIHN5c3RlbS5BQy5jb25kdWN0b3JzLmluZGV4T2YoJ0wnK2kpKzEgKSB7XG4gICAgICAgICAgICAgICAgeSAtPSBwYWRkaW5nO1xuICAgICAgICAgICAgICAgIGQubGF5ZXIoJ0FDX0wnK2kpO1xuICAgICAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFsgeC1zaXplLkFDX2Rpc2Mudy8yLCB5IF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeCtwYWRkaW5nKjMqKDItaSksIHkgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB4K3BhZGRpbmcqMyooMi1pKSwgbG9jLkFDX2Rpc2Muc3dpdGNoX2JvdHRvbSBdLFxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIGQuYmxvY2soJ3Rlcm1pbmFsJywgWyB4LXBhZGRpbmcqKGktMikqMywgbG9jLkFDX2Rpc2Muc3dpdGNoX2JvdHRvbSBdICk7XG4gICAgICAgICAgICAgICAgZC5ibG9jaygndGVybWluYWwnLCBbIHgtcGFkZGluZyooaS0yKSozLCBsb2MuQUNfZGlzYy5zd2l0Y2hfdG9wIF0gKTtcbiAgICAgICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbIHgtcGFkZGluZyooaS0yKSozLCBsb2MuQUNfZGlzYy5zd2l0Y2hfdG9wIF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeC1wYWRkaW5nKihpLTIpKjMsIGNvbmR1aXRfeS1icmVha2VyX3NwYWNpbmcqKGktMSkgXSxcbiAgICAgICAgICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy5sZWZ0LCBjb25kdWl0X3ktYnJlYWtlcl9zcGFjaW5nKihpLTEpIF0sXG4gICAgICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG5cblxuXG4vLyBXaXJlIHRhYmxlXG4gICAgZC5zZWN0aW9uKFwiV2lyZSB0YWJsZVwiKTtcblxuLy8vKlxuXG4gICAgeCA9IGxvYy53aXJlX3RhYmxlLng7XG4gICAgeSA9IGxvYy53aXJlX3RhYmxlLnk7XG5cbiAgICBpZiggc3lzdGVtLkFDLm51bV9jb25kdWN0b3JzICkge1xuICAgICAgICB2YXIgbl9yb3dzID0gMiArIHN5c3RlbS5BQy5udW1fY29uZHVjdG9ycztcbiAgICAgICAgdmFyIG5fY29scyA9IDY7XG4gICAgICAgIHZhciByb3dfaGVpZ2h0ID0gMTU7XG4gICAgICAgIHZhciBjb2x1bW5fd2lkdGggPSB7XG4gICAgICAgICAgICBudW1iZXI6IDI1LFxuICAgICAgICAgICAgY29uZHVjdG9yOiA1MCxcbiAgICAgICAgICAgIHdpcmVfZ2F1Z2U6IDI1LFxuICAgICAgICAgICAgd2lyZV90eXBlOiA3NSxcbiAgICAgICAgICAgIGNvbmR1aXRfc2l6ZTogMzUsXG4gICAgICAgICAgICBjb25kdWl0X3R5cGU6IDc1LFxuICAgICAgICB9O1xuXG4gICAgICAgIGggPSBuX3Jvd3Mqcm93X2hlaWdodDtcblxuICAgICAgICB2YXIgdCA9IGQudGFibGUobl9yb3dzLG5fY29scykubG9jKHgseSk7XG4gICAgICAgIHQucm93X3NpemUoJ2FsbCcsIHJvd19oZWlnaHQpXG4gICAgICAgICAgICAuY29sX3NpemUoMSwgY29sdW1uX3dpZHRoLm51bWJlcilcbiAgICAgICAgICAgIC5jb2xfc2l6ZSgyLCBjb2x1bW5fd2lkdGguY29uZHVjdG9yKVxuICAgICAgICAgICAgLmNvbF9zaXplKDMsIGNvbHVtbl93aWR0aC53aXJlX2dhdWdlKVxuICAgICAgICAgICAgLmNvbF9zaXplKDQsIGNvbHVtbl93aWR0aC53aXJlX3R5cGUpXG4gICAgICAgICAgICAuY29sX3NpemUoNSwgY29sdW1uX3dpZHRoLmNvbmR1aXRfc2l6ZSlcbiAgICAgICAgICAgIC5jb2xfc2l6ZSg2LCBjb2x1bW5fd2lkdGguY29uZHVpdF90eXBlKTtcblxuICAgICAgICB0LmFsbF9jZWxscygpLmZvckVhY2goZnVuY3Rpb24oY2VsbCl7XG4gICAgICAgICAgICBjZWxsLmZvbnQoJ3RhYmxlJykuYm9yZGVyKCdhbGwnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHQuY2VsbCgxLDEpLmJvcmRlcignQicsIGZhbHNlKTtcbiAgICAgICAgdC5jZWxsKDEsMykuYm9yZGVyKCdSJywgZmFsc2UpO1xuICAgICAgICB0LmNlbGwoMSw1KS5ib3JkZXIoJ1InLCBmYWxzZSk7XG5cbiAgICAgICAgdC5jZWxsKDEsMykuZm9udCgndGFibGVfbGVmdCcpLnRleHQoJ1dpcmUnKTtcbiAgICAgICAgdC5jZWxsKDEsNSkuZm9udCgndGFibGVfbGVmdCcpLnRleHQoJ0NvbmR1aXQnKTtcblxuICAgICAgICB0LmNlbGwoMiwzKS5mb250KCd0YWJsZScpLnRleHQoJ0NvbmR1Y3RvcnMnKTtcbiAgICAgICAgdC5jZWxsKDIsMykuZm9udCgndGFibGUnKS50ZXh0KCdBV0cnKTtcbiAgICAgICAgdC5jZWxsKDIsNCkuZm9udCgndGFibGUnKS50ZXh0KCdUeXBlJyk7XG4gICAgICAgIHQuY2VsbCgyLDUpLmZvbnQoJ3RhYmxlJykudGV4dCgnU2l6ZScpO1xuICAgICAgICB0LmNlbGwoMiw2KS5mb250KCd0YWJsZScpLnRleHQoJ1R5cGUnKTtcblxuICAgICAgICBmb3IoIGk9MTsgaTw9c3lzdGVtLkFDLm51bV9jb25kdWN0b3JzOyBpKyspe1xuICAgICAgICAgICAgdC5jZWxsKDIraSwxKS5mb250KCd0YWJsZScpLnRleHQoaS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIHQuY2VsbCgyK2ksMikuZm9udCgndGFibGVfbGVmdCcpLnRleHQoIGYucHJldHR5X3dvcmQoc2V0dGluZ3Muc3lzdGVtLkFDLmNvbmR1Y3RvcnNbaS0xXSkgKTtcblxuICAgICAgICB9XG5cblxuICAgICAgICAvL2QudGV4dCggW3grdy8yLCB5LXJvd19oZWlnaHRdLCBmLnByZXR0eV9uYW1lKHNlY3Rpb25fbmFtZSksJ3RhYmxlJyApO1xuXG5cbiAgICAgICAgdC5taygpO1xuXG4gICAgfVxuXG4vLyovXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4vLyB2b2x0YWdlIGRyb3BcbiAgICBkLnNlY3Rpb24oXCJ2b2x0YWdlIGRyb3BcIik7XG5cblxuICAgIHggPSBsb2Mudm9sdF9kcm9wX3RhYmxlLng7XG4gICAgeSA9IGxvYy52b2x0X2Ryb3BfdGFibGUueTtcbiAgICB3ID0gc2l6ZS52b2x0X2Ryb3BfdGFibGUudztcbiAgICBoID0gc2l6ZS52b2x0X2Ryb3BfdGFibGUuaDtcblxuICAgIGQubGF5ZXIoJ3RhYmxlJyk7XG4gICAgZC5yZWN0KCBbeCx5XSwgW3csaF0gKTtcblxuICAgIHkgLT0gaC8yO1xuICAgIHkgKz0gMTA7XG5cbiAgICBkLnRleHQoIFt4LHldLCAnVm9sdGFnZSBEcm9wJywgJ3RhYmxlJywgJ3RleHQnKTtcblxuXG4vLyBnZW5lcmFsIG5vdGVzXG4gICAgZC5zZWN0aW9uKFwiZ2VuZXJhbCBub3Rlc1wiKTtcblxuICAgIHggPSBsb2MuZ2VuZXJhbF9ub3Rlcy54O1xuICAgIHkgPSBsb2MuZ2VuZXJhbF9ub3Rlcy55O1xuICAgIHcgPSBzaXplLmdlbmVyYWxfbm90ZXMudztcbiAgICBoID0gc2l6ZS5nZW5lcmFsX25vdGVzLmg7XG5cbiAgICBkLmxheWVyKCd0YWJsZScpO1xuICAgIGQucmVjdCggW3gseV0sIFt3LGhdICk7XG5cbiAgICB5IC09IGgvMjtcbiAgICB5ICs9IDEwO1xuXG4gICAgZC50ZXh0KCBbeCx5XSwgJ0dlbmVyYWwgTm90ZXMnLCAndGFibGUnLCAndGV4dCcpO1xuXG5cbiAgICBkLnNlY3Rpb24oKTtcblxuICAgIHJldHVybiBkLmRyYXdpbmdfcGFydHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuIiwidmFyIG1rX2RyYXdpbmcgPSByZXF1aXJlKCcuL21rX2RyYXdpbmcnKTtcbnZhciBta19ib3JkZXIgPSByZXF1aXJlKCcuL21rX2JvcmRlcicpO1xuXG52YXIgcGFnZSA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICBjb25zb2xlLmxvZyhcIioqIE1ha2luZyBwYWdlIDNcIik7XG4gICAgdmFyIGYgPSBzZXR0aW5ncy5mO1xuXG4gICAgZCA9IG1rX2RyYXdpbmcoKTtcblxuICAgIHZhciBzaGVldF9zZWN0aW9uID0gJ1BWJztcbiAgICB2YXIgc2hlZXRfbnVtID0gJzAyJztcbiAgICBkLmFwcGVuZChta19ib3JkZXIoc2V0dGluZ3MsIHNoZWV0X3NlY3Rpb24sIHNoZWV0X251bSApKTtcblxuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxvYztcblxuXG4gICAgZC50ZXh0KFxuICAgICAgICBbc2l6ZS5kcmF3aW5nLncvMiwgc2l6ZS5kcmF3aW5nLmgvMl0sXG4gICAgICAgICdDYWxjdWxhdGlvbiBTaGVldCcsXG4gICAgICAgICd0aXRsZTInXG4gICAgKTtcblxuXG4gICAgeCA9IHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nKjY7XG4gICAgeSA9IHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nKjYgKzIwO1xuXG4gICAgZC5sYXllcigndGFibGUnKTtcblxuXG4gICAgZm9yKCB2YXIgc2VjdGlvbl9uYW1lIGluIHNldHRpbmdzLnN5c3RlbSApe1xuICAgICAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoc2VjdGlvbl9uYW1lKSApe1xuICAgICAgICAgICAgdmFyIHNlY3Rpb24gPSBzZXR0aW5ncy5zeXN0ZW1bc2VjdGlvbl9uYW1lXTtcblxuICAgICAgICAgICAgdmFyIG4gPSBPYmplY3Qua2V5cyhzZWN0aW9uKS5sZW5ndGg7XG5cbiAgICAgICAgICAgIHZhciBuX3Jvd3MgPSBuKzA7XG4gICAgICAgICAgICB2YXIgbl9jb2xzID0gMjtcblxuICAgICAgICAgICAgdmFyIHJvd19oZWlnaHQgPSAxNTtcbiAgICAgICAgICAgIGggPSBuX3Jvd3Mqcm93X2hlaWdodDtcblxuXG4gICAgICAgICAgICB2YXIgdCA9IGQudGFibGUobl9yb3dzLG5fY29scykubG9jKHgseSk7XG4gICAgICAgICAgICB0LnJvd19zaXplKCdhbGwnLCByb3dfaGVpZ2h0KS5jb2xfc2l6ZSgxLCAxMDApLmNvbF9zaXplKDIsIDEyNSk7XG4gICAgICAgICAgICB3ID0gMTAwKzgwO1xuXG4gICAgICAgICAgICB2YXIgciA9IDE7XG4gICAgICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgICAgICBmb3IoIHZhciB2YWx1ZV9uYW1lIGluIHNlY3Rpb24gKXtcbiAgICAgICAgICAgICAgICB0LmNlbGwociwxKS50ZXh0KCBmLnByZXR0eV9uYW1lKHZhbHVlX25hbWUpICk7XG4gICAgICAgICAgICAgICAgaWYoICEgc2VjdGlvblt2YWx1ZV9uYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9ICctJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoIHNlY3Rpb25bdmFsdWVfbmFtZV0uY29uc3RydWN0b3IgPT09IEFycmF5ICl7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gc2VjdGlvblt2YWx1ZV9uYW1lXS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiggc2VjdGlvblt2YWx1ZV9uYW1lXS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICl7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gJyggKSc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKCBpc05hTihzZWN0aW9uW3ZhbHVlX25hbWVdKSApe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHNlY3Rpb25bdmFsdWVfbmFtZV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHNlY3Rpb25bdmFsdWVfbmFtZV0pLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHQuY2VsbChyLDIpLnRleHQoIHZhbHVlICk7XG4gICAgICAgICAgICAgICAgcisrO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGQudGV4dCggW3grdy8yLCB5LXJvd19oZWlnaHRdLCBmLnByZXR0eV9uYW1lKHNlY3Rpb25fbmFtZSksJ3RhYmxlJyApO1xuXG5cblxuXG4gICAgICAgICAgICB0LmFsbF9jZWxscygpLmZvckVhY2goZnVuY3Rpb24oY2VsbCl7XG4gICAgICAgICAgICAgICAgY2VsbC5mb250KCd0YWJsZScpLmJvcmRlcignYWxsJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdC5taygpO1xuXG4gICAgICAgICAgICAvLyovXG4gICAgICAgICAgICB5ICs9IGggKyAzMDtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdub3QgZGVmaW5lZDogJywgc2VjdGlvbl9uYW1lLCBzZWN0aW9uKTtcbiAgICAgICAgfVxuXG5cblxuXG4gICAgfVxuXG4gICAgZC5sYXllcigpO1xuXG5cbiAgICByZXR1cm4gZC5kcmF3aW5nX3BhcnRzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcGFnZTtcbiIsInZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG52YXIgbWtfYm9yZGVyID0gcmVxdWlyZSgnLi9ta19ib3JkZXInKTtcbnZhciBmID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMnKTtcblxudmFyIHBhZ2UgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgY29uc29sZS5sb2coXCIqKiBNYWtpbmcgcHJldmlldyAxXCIpO1xuXG4gICAgdmFyIGQgPSBta19kcmF3aW5nKCk7XG5cblxuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5cbiAgICB2YXIgeCwgeSwgaCwgdywgc2VjdGlvbl94LCBzZWN0aW9uX3k7XG5cbiAgICB3ID0gc2l6ZS5wcmV2aWV3Lm1vZHVsZS53O1xuICAgIGggPSBzaXplLnByZXZpZXcubW9kdWxlLmg7XG4gICAgbG9jLnByZXZpZXcuYXJyYXkuYm90dG9tID0gbG9jLnByZXZpZXcuYXJyYXkudG9wICsgaCoxLjI1KnN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgKyBoKjMvNDtcbiAgICAvL2xvYy5wcmV2aWV3LmFycmF5LnJpZ2h0ID0gbG9jLnByZXZpZXcuYXJyYXkubGVmdCArIHcqMS4yNSpzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgKyB3KjI7XG4gICAgbG9jLnByZXZpZXcuYXJyYXkucmlnaHQgPSBsb2MucHJldmlldy5hcnJheS5sZWZ0ICsgdyoxLjI1KjggKyB3KjI7XG5cbiAgICBsb2MucHJldmlldy5pbnZlcnRlci5jZW50ZXIgPSA1MDAgO1xuICAgIHcgPSBzaXplLnByZXZpZXcuaW52ZXJ0ZXIudztcbiAgICBsb2MucHJldmlldy5pbnZlcnRlci5sZWZ0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIuY2VudGVyIC0gdy8yO1xuICAgIGxvYy5wcmV2aWV3LmludmVydGVyLnJpZ2h0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIuY2VudGVyICsgdy8yO1xuXG4gICAgbG9jLnByZXZpZXcuREMubGVmdCA9IGxvYy5wcmV2aWV3LmFycmF5LnJpZ2h0O1xuICAgIGxvYy5wcmV2aWV3LkRDLnJpZ2h0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIubGVmdDtcbiAgICBsb2MucHJldmlldy5EQy5jZW50ZXIgPSAoIGxvYy5wcmV2aWV3LkRDLnJpZ2h0ICsgbG9jLnByZXZpZXcuREMubGVmdCApLzI7XG5cbiAgICBsb2MucHJldmlldy5BQy5sZWZ0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIucmlnaHQ7XG4gICAgbG9jLnByZXZpZXcuQUMucmlnaHQgPSBsb2MucHJldmlldy5BQy5sZWZ0ICsgMzAwO1xuICAgIGxvYy5wcmV2aWV3LkFDLmNlbnRlciA9ICggbG9jLnByZXZpZXcuQUMucmlnaHQgKyBsb2MucHJldmlldy5BQy5sZWZ0ICkvMjtcblxuXG4vLyBUT0RPIGZpeDogc2VjdGlvbnMgbXVzdCBiZSBkZWZpbmVkIGluIG9yZGVyLCBvciB0aGVyZSBhcmUgYXJlYXNcblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnYXJyYXknKSAmJiBmLnNlY3Rpb25fZGVmaW5lZCgnbW9kdWxlJykgKXtcbiAgICAgICAgZC5sYXllcigncHJldmlld19hcnJheScpO1xuXG4gICAgICAgIHcgPSBzaXplLnByZXZpZXcubW9kdWxlLnc7XG4gICAgICAgIGggPSBzaXplLnByZXZpZXcubW9kdWxlLmg7XG4gICAgICAgIHZhciBvZmZzZXQgPSA0MDtcblxuICAgICAgICBmb3IoIHZhciBzPTA7IHM8c3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzOyBzKysgKXtcbiAgICAgICAgICAgIHggPSBsb2MucHJldmlldy5hcnJheS5sZWZ0ICsgdyoxLjI1KnM7XG4gICAgICAgICAgICAvLyBzdHJpbmcgd2lyaW5nXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbIHggLCBsb2MucHJldmlldy5hcnJheS50b3AgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB4ICwgbG9jLnByZXZpZXcuYXJyYXkuYm90dG9tIF0sXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIC8vIG1vZHVsZXNcbiAgICAgICAgICAgIGZvciggdmFyIG09MDsgbTxzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nOyBtKysgKXtcbiAgICAgICAgICAgICAgICB5ID0gbG9jLnByZXZpZXcuYXJyYXkudG9wICsgaCArIGgqMS4yNSptO1xuICAgICAgICAgICAgICAgIC8vIG1vZHVsZXNcbiAgICAgICAgICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICAgICAgICAgIFsgeCAsIHkgXSxcbiAgICAgICAgICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAgICAgICAgICdwcmV2aWV3X21vZHVsZSdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdG9wIGFycmF5IGNvbmR1aXRcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LmFycmF5LmxlZnQgLCBsb2MucHJldmlldy5hcnJheS50b3AgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LmFycmF5LnJpZ2h0IC0gdywgbG9jLnByZXZpZXcuYXJyYXkudG9wIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5hcnJheS5yaWdodCAsIGxvYy5wcmV2aWV3LmFycmF5LnRvcCBdLFxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgICAgICAvLyBib3R0b20gYXJyYXkgY29uZHVpdFxuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuYXJyYXkubGVmdCAsIGxvYy5wcmV2aWV3LmFycmF5LmJvdHRvbSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuYXJyYXkucmlnaHQgLSB3ICwgbG9jLnByZXZpZXcuYXJyYXkuYm90dG9tIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5hcnJheS5yaWdodCAtIHcgLCBsb2MucHJldmlldy5hcnJheS50b3AgXSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgKTtcblxuICAgICAgICB5ID0gbG9jLnByZXZpZXcuYXJyYXkudG9wO1xuICAgICAgICBoID0gc2l6ZS5wcmV2aWV3Lm1vZHVsZS5oO1xuXG4gICAgICAgIGQudGV4dChcbiAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuREMuY2VudGVyLCB5K2gvMitvZmZzZXQgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnQXJyYXkgREMnLFxuICAgICAgICAgICAgICAgICdTdHJpbmdzOiAnICsgcGFyc2VGbG9hdChzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MpLnRvRml4ZWQoKSxcbiAgICAgICAgICAgICAgICAnTW9kdWxlczogJyArIHBhcnNlRmxvYXQoc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZykudG9GaXhlZCgpLFxuICAgICAgICAgICAgICAgICdQbXA6ICcgKyBwYXJzZUZsb2F0KHN5c3RlbS5hcnJheS5wbXApLnRvRml4ZWQoKSxcbiAgICAgICAgICAgICAgICAnSW1wOiAnICsgcGFyc2VGbG9hdChzeXN0ZW0uYXJyYXkuaW1wKS50b0ZpeGVkKCksXG4gICAgICAgICAgICAgICAgJ1ZtcDogJyArIHBhcnNlRmxvYXQoc3lzdGVtLmFycmF5LnZtcCkudG9GaXhlZCgpLFxuICAgICAgICAgICAgICAgICdJc2M6ICcgKyBwYXJzZUZsb2F0KHN5c3RlbS5hcnJheS5pc2MpLnRvRml4ZWQoKSxcbiAgICAgICAgICAgICAgICAnVm9jOiAnICsgcGFyc2VGbG9hdChzeXN0ZW0uYXJyYXkudm9jKS50b0ZpeGVkKCksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ3ByZXZpZXcgdGV4dCdcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ0RDJykgKXtcbiAgICAgICAgZC5sYXllcigncHJldmlld19EQycpO1xuXG4gICAgICAgIC8veSA9IHk7XG4gICAgICAgIHkgPSBsb2MucHJldmlldy5hcnJheS50b3A7XG4gICAgICAgIHcgPSBzaXplLnByZXZpZXcubW9kdWxlLnc7XG4gICAgICAgIGggPSBzaXplLnByZXZpZXcubW9kdWxlLmg7XG5cbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LkRDLmxlZnQgLCB5IF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5EQy5yaWdodCwgeSBdLFxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbbG9jLnByZXZpZXcuREMuY2VudGVyLHldLFxuICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAncHJldmlld19EQ19ib3gnXG4gICAgICAgICk7XG5cbiAgICB9XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ2ludmVydGVyJykgKXtcblxuICAgICAgICBkLmxheWVyKCdwcmV2aWV3X2ludmVydGVyJyk7XG5cbiAgICAgICAgeSA9IHk7XG4gICAgICAgIHcgPSBzaXplLnByZXZpZXcuaW52ZXJ0ZXIudztcbiAgICAgICAgaCA9IHNpemUucHJldmlldy5pbnZlcnRlci5oO1xuXG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFtsb2MucHJldmlldy5pbnZlcnRlci5jZW50ZXIseV0sXG4gICAgICAgICAgICBbdyxoXSxcbiAgICAgICAgICAgICdwcmV2aWV3X2ludmVydGVyX2JveCdcbiAgICAgICAgKTtcbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgW2xvYy5wcmV2aWV3LmludmVydGVyLmNlbnRlcix5K2gvMitvZmZzZXRdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdJbnZlcnRlcicsXG4gICAgICAgICAgICAgICAgc3lzdGVtLmludmVydGVyLm1ha2UsXG4gICAgICAgICAgICAgICAgc3lzdGVtLmludmVydGVyLm1vZGVsLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwcmV2aWV3IHRleHQnXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdBQycpICl7XG5cbiAgICAgICAgZC5sYXllcigncHJldmlld19BQycpO1xuXG5cbiAgICAgICAgeSA9IHk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5BQy5sZWZ0LCB5IF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5BQy5yaWdodCwgeSBdLFxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgICAgICB3ID0gc2l6ZS5wcmV2aWV3LkFDLnc7XG4gICAgICAgIGggPSBzaXplLnByZXZpZXcuQUMuaDtcbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW2xvYy5wcmV2aWV3LkFDLmNlbnRlcix5XSxcbiAgICAgICAgICAgIFt3LGhdLFxuICAgICAgICAgICAgJ3ByZXZpZXdfQUNfYm94J1xuICAgICAgICApO1xuICAgICAgICB3ID0gc2l6ZS5wcmV2aWV3LmxvYWRjZW50ZXIudztcbiAgICAgICAgaCA9IHNpemUucHJldmlldy5sb2FkY2VudGVyLmg7XG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuQUMucmlnaHQtdy8yLCB5K2gvNCBdLFxuICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAncHJldmlld19BQ19ib3gnXG4gICAgICAgICk7XG5cbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgW2xvYy5wcmV2aWV3LkFDLmNlbnRlcix5K2gvMitvZmZzZXRdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdBQycsXG5cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAncHJldmlldyB0ZXh0J1xuICAgICAgICApO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xudmFyIG1rX2JvcmRlciA9IHJlcXVpcmUoJy4vbWtfYm9yZGVyJyk7XG52YXIgZiA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zJyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHByZXZpZXcgMlwiKTtcblxuICAgIHZhciBkID0gbWtfZHJhd2luZygpO1xuXG4gICAgY29uc29sZS5sb2coZi5zZWN0aW9uX2RlZmluZWQoJ3Jvb2YnKSk7XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ3Jvb2YnKSApe1xuXG4gICAgICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgICAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG4gICAgICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5cbiAgICAgICAgdmFyIHgsIHksIGgsIHcsIHNlY3Rpb25feCwgc2VjdGlvbl95LCBsZW5ndGhfcCwgc2NhbGU7XG5cbiAgICAgICAgdmFyIHNsb3BlID0gc3lzdGVtLnJvb2Yuc2xvcGUuc3BsaXQoJzonKVswXTtcbiAgICAgICAgdmFyIGFuZ2xlX3JhZCA9IE1hdGguYXRhbiggTnVtYmVyKHNsb3BlKSAvMTIgKTtcbiAgICAgICAgLy9hbmdsZV9yYWQgPSBhbmdsZSAqIChNYXRoLlBJLzE4MCk7XG5cblxuICAgICAgICBsZW5ndGhfcCA9IHN5c3RlbS5yb29mLmxlbmd0aCAqIE1hdGguY29zKGFuZ2xlX3JhZCk7XG4gICAgICAgIHN5c3RlbS5yb29mLmhlaWdodCA9IHN5c3RlbS5yb29mLmxlbmd0aCAqIE1hdGguc2luKGFuZ2xlX3JhZCk7XG5cbiAgICAgICAgdmFyIHJvb2ZfcmF0aW8gPSBzeXN0ZW0ucm9vZi5sZW5ndGggLyBzeXN0ZW0ucm9vZi53aWR0aDtcbiAgICAgICAgdmFyIHJvb2ZfcGxhbl9yYXRpbyA9IGxlbmd0aF9wIC8gc3lzdGVtLnJvb2Yud2lkdGg7XG5cblxuICAgICAgICBpZiggc3lzdGVtLnJvb2YudHlwZSA9PT0gXCJHYWJsZVwiKXtcblxuXG4gICAgICAgICAgICAvLy8vLy8vXG4gICAgICAgICAgICAvLyBSb29kIHBsYW4gdmlld1xuICAgICAgICAgICAgdmFyIHBsYW5feCA9IDMwO1xuICAgICAgICAgICAgdmFyIHBsYW5feSA9IDMwO1xuXG4gICAgICAgICAgICB2YXIgcGxhbl93LCBwbGFuX2g7XG4gICAgICAgICAgICBpZiggbGVuZ3RoX3AqMiA+IHN5c3RlbS5yb29mLndpZHRoICl7XG4gICAgICAgICAgICAgICAgc2NhbGUgPSAyNTAvKGxlbmd0aF9wKjIpO1xuICAgICAgICAgICAgICAgIHBsYW5fdyA9IChsZW5ndGhfcCoyKSAqIHNjYWxlO1xuICAgICAgICAgICAgICAgIHBsYW5faCA9IHBsYW5fdyAvIChsZW5ndGhfcCoyIC8gc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDQwMC8oc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgICAgIHBsYW5faCA9IHN5c3RlbS5yb29mLndpZHRoICogc2NhbGU7XG4gICAgICAgICAgICAgICAgcGxhbl93ID0gcGxhbl9oICogKGxlbmd0aF9wKjIgLyBzeXN0ZW0ucm9vZi53aWR0aCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGQucmVjdChcbiAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3krcGxhbl9oLzJdLFxuICAgICAgICAgICAgICAgIFtwbGFuX3csIHBsYW5faF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZC5wb2x5KFtcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCAgICAgICAsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feStwbGFuX2hdLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94LCAgICAgICAgcGxhbl95K3BsYW5faF0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3ggICAgICAgLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfcG9seV91bnNlbGVjdGVkXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnBvbHkoW1xuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yICAgICAgICwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMitwbGFuX3cvMiwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMitwbGFuX3cvMiwgcGxhbl95K3BsYW5faF0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsICAgICAgICBwbGFuX3krcGxhbl9oXSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiAgICAgICAsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3NlbGVjdGVkXCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feStwbGFuX2hdXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbcGxhbl94LTIwLCBwbGFuX3krcGxhbl9oLzJdLFxuICAgICAgICAgICAgICAgIHN5c3RlbS5yb29mLmxlbmd0aC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93KzIwLCBwbGFuX3krcGxhbl9oLzJdLFxuICAgICAgICAgICAgICAgIHN5c3RlbS5yb29mLndpZHRoLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG5cblxuXG5cbiAgICAgICAgICAgIC8vLy8vLy8vXG4gICAgICAgICAgICAvLyByb29mIGNyb3NzZWN0aW9uXG5cbiAgICAgICAgICAgIHZhciBjc194ID0gMzA7XG4gICAgICAgICAgICB2YXIgY3NfeSA9IDMwK3BsYW5faCs1MDtcbiAgICAgICAgICAgIHZhciBjc19oID0gc3lzdGVtLnJvb2YuaGVpZ2h0ICogc2NhbGU7XG4gICAgICAgICAgICB2YXIgY3NfdyA9IHBsYW5fdy8yO1xuXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3ldLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3krY3NfaF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3csICAgY3NfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3cqMiwgY3NfeStjc19oXSxcbiAgICAgICAgICAgICAgICAgICAgW2NzX3gsICAgICAgICBjc195K2NzX2hdLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3ldLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbY3NfeCtjc193LTE1LCBjc195K2NzX2gqMi8zXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi5oZWlnaHQgKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbY3NfeCtjc193KjEuNSsyMCwgY3NfeStjc19oLzNdLFxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHN5c3RlbS5yb29mLmxlbmd0aCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG5cblxuICAgICAgICAgICAgLy8vLy8vXG4gICAgICAgICAgICAvLyByb29mIGRldGFpbFxuXG4gICAgICAgICAgICB2YXIgZGV0YWlsX3ggPSAzMCs0NTA7XG4gICAgICAgICAgICB2YXIgZGV0YWlsX3kgPSAzMDtcblxuICAgICAgICAgICAgaWYoIE51bWJlcihzeXN0ZW0ucm9vZi53aWR0aCkgPj0gTnVtYmVyKHN5c3RlbS5yb29mLmxlbmd0aCkgKXtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDQ1MC8oc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDQ1MC8oc3lzdGVtLnJvb2YubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkZXRhaWxfdyA9IHN5c3RlbS5yb29mLndpZHRoICogc2NhbGU7XG4gICAgICAgICAgICB2YXIgZGV0YWlsX2ggPSBzeXN0ZW0ucm9vZi5sZW5ndGggKiBzY2FsZTtcblxuICAgICAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy8yLCBkZXRhaWxfeStkZXRhaWxfaC8yXSxcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3csIGRldGFpbF9oXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3NlbGVjdGVkX2ZyYW1lZFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB2YXIgYSA9IDM7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0X2EgPSBhICogc2NhbGU7XG5cbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCwgICBkZXRhaWxfeStvZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdywgICBkZXRhaWxfeStvZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCwgICAgICAgICAgZGV0YWlsX3krZGV0YWlsX2gtb2Zmc2V0X2FdLFxuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3csIGRldGFpbF95K2RldGFpbF9oLW9mZnNldF9hXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K29mZnNldF9hLCBkZXRhaWxfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtvZmZzZXRfYSwgZGV0YWlsX3krZGV0YWlsX2hdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3ctb2Zmc2V0X2EsIGRldGFpbF95XSxcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LW9mZnNldF9hLCBkZXRhaWxfeStkZXRhaWxfaF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeC00MCwgZGV0YWlsX3krZGV0YWlsX2gvMl0sXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggc3lzdGVtLnJvb2YubGVuZ3RoICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LzIsIGRldGFpbF95K2RldGFpbF9oKzQwXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi53aWR0aCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94KyAob2Zmc2V0X2EpLzIsIGRldGFpbF95K2RldGFpbF9oKzE1XSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LShvZmZzZXRfYSkvMiwgZGV0YWlsX3krZGV0YWlsX2grMTVdLFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3gtMTUsIGRldGFpbF95K2RldGFpbF9oLShvZmZzZXRfYSkvMl0sXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeC0xNSwgZGV0YWlsX3krKG9mZnNldF9hKS8yXSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG5cblxuXG5cblxuICAgICAgICAgICAgLy8vLy8vXG4gICAgICAgICAgICAvLyBNb2R1bGUgb3B0aW9uc1xuICAgICAgICAgICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdtb2R1bGUnKSAmJiBmLnNlY3Rpb25fZGVmaW5lZCgnYXJyYXknKSl7XG4gICAgICAgICAgICAgICAgdmFyIHIsYztcblxuXG5cbiAgICAgICAgICAgICAgICB2YXIgcm9vZl9sZW5ndGhfYXZhaWwgPSBzeXN0ZW0ucm9vZi5sZW5ndGggLSAoYSoyKTtcbiAgICAgICAgICAgICAgICB2YXIgcm9vZl93aWR0aF9hdmFpbCA9IHN5c3RlbS5yb29mLndpZHRoIC0gKGEqMik7XG5cbiAgICAgICAgICAgICAgICB2YXIgcm93X3NwYWNpbmc7XG4gICAgICAgICAgICAgICAgaWYoIHN5c3RlbS5tb2R1bGUub3JpZW50YXRpb24gPT09ICdQb3J0cmFpdCcgKXtcbiAgICAgICAgICAgICAgICAgICAgcm93X3NwYWNpbmcgPSBOdW1iZXIoc3lzdGVtLm1vZHVsZS5sZW5ndGgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgY29sX3NwYWNpbmcgPSBOdW1iZXIoc3lzdGVtLm1vZHVsZS53aWR0aCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVfdyA9IChOdW1iZXIoc3lzdGVtLm1vZHVsZS53aWR0aCkgICkvMTI7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV9oID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLmxlbmd0aCkgKS8xMjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByb3dfc3BhY2luZyA9IE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIGNvbF9zcGFjaW5nID0gTnVtYmVyKHN5c3RlbS5tb2R1bGUubGVuZ3RoKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV93ID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLmxlbmd0aCkpLzEyO1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVfaCA9IChOdW1iZXIoc3lzdGVtLm1vZHVsZS53aWR0aCkgKS8xMjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByb3dfc3BhY2luZyA9IHJvd19zcGFjaW5nLzEyOyAvL21vZHVsZSBkaW1lbnRpb25zIGFyZSBpbiBpbmNoZXNcbiAgICAgICAgICAgICAgICBjb2xfc3BhY2luZyA9IGNvbF9zcGFjaW5nLzEyOyAvL21vZHVsZSBkaW1lbnRpb25zIGFyZSBpbiBpbmNoZXNcblxuICAgICAgICAgICAgICAgIHZhciBudW1fcm93cyA9IE1hdGguZmxvb3Iocm9vZl9sZW5ndGhfYXZhaWwvcm93X3NwYWNpbmcpO1xuICAgICAgICAgICAgICAgIHZhciBudW1fY29scyA9IE1hdGguZmxvb3Iocm9vZl93aWR0aF9hdmFpbC9jb2xfc3BhY2luZyk7XG5cbiAgICAgICAgICAgICAgICAvL3NlbGVjdGVkIG1vZHVsZXNcblxuICAgICAgICAgICAgICAgIGlmKCBudW1fY29scyAhPT0gZy50ZW1wLm51bV9jb2xzIHx8IG51bV9yb3dzICE9PSBnLnRlbXAubnVtX3Jvd3MgKXtcbiAgICAgICAgICAgICAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNfdG90YWwgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciggcj0xOyByPD1udW1fcm93czsgcisrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzW3JdID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IoIGM9MTsgYzw9bnVtX2NvbHM7IGMrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl1bY10gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICAgICAgZy50ZW1wLm51bV9jb2xzID0gbnVtX2NvbHM7XG4gICAgICAgICAgICAgICAgICAgIGcudGVtcC5udW1fcm93cyA9IG51bV9yb3dzO1xuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgeCA9IGRldGFpbF94ICsgb2Zmc2V0X2E7IC8vY29ybmVyIG9mIHVzYWJsZSBzcGFjZVxuICAgICAgICAgICAgICAgIHkgPSBkZXRhaWxfeSArIG9mZnNldF9hO1xuICAgICAgICAgICAgICAgIHggKz0gKCByb29mX3dpZHRoX2F2YWlsIC0gKGNvbF9zcGFjaW5nKm51bV9jb2xzKSkvMiAqc2NhbGU7IC8vIGNlbnRlciBhcnJheSBvbiByb29mXG4gICAgICAgICAgICAgICAgeSArPSAoIHJvb2ZfbGVuZ3RoX2F2YWlsIC0gKHJvd19zcGFjaW5nKm51bV9yb3dzKSkvMiAqc2NhbGU7XG4gICAgICAgICAgICAgICAgbW9kdWxlX3cgPSBtb2R1bGVfdyAqIHNjYWxlO1xuICAgICAgICAgICAgICAgIG1vZHVsZV9oID0gbW9kdWxlX2ggKiBzY2FsZTtcblxuXG5cbiAgICAgICAgICAgICAgICBmb3IoIHI9MTsgcjw9bnVtX3Jvd3M7IHIrKyl7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yKCBjPTE7IGM8PW51bV9jb2xzOyBjKyspe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF5ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl1bY10gKSBsYXllciA9ICdwcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgbGF5ZXIgPSAncHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVfeCA9IChjLTEpICogY29sX3NwYWNpbmcgKiBzY2FsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZV95ID0gKHItMSkgKiByb3dfc3BhY2luZyAqIHNjYWxlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3grbW9kdWxlX3grbW9kdWxlX3cvMiwgeSttb2R1bGVfeSttb2R1bGVfaC8yXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbW9kdWxlX3csIG1vZHVsZV9oXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXllcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s6IFwiZy5mLnRvZ2dsZV9tb2R1bGUodGhpcylcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlX0lEOiAgKHIpICsgJywnICsgKGMpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy8yLCBkZXRhaWxfeStkZXRhaWxfaCsxMDBdLFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlNlbGVjdGVkIG1vZHVsZXM6IFwiICsgcGFyc2VGbG9hdCggZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNfdG90YWwgKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ2FsY3VsYXRlZCBtb2R1bGVzOiBcIiArIHBhcnNlRmxvYXQoIGcuc3lzdGVtLmFycmF5Lm51bWJlcl9vZl9tb2R1bGVzICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgfVxuXG4vLyovXG4gICAgICAgIH1cblxuXG5cbiAgICAgICAgLypcblxuXG5cblxuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3gsICAgIHldLFxuICAgICAgICAgICAgW3grZHgsIHktZHldLFxuICAgICAgICAgICAgW3grZHgsIHldLFxuICAgICAgICAgICAgW3gsICAgIHldLFxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuXG4gICAgICAgIGQudGV4dChcbiAgICAgICAgICAgIFt4K2R4LzItMTAsIHktZHkvMi0yMF0sXG4gICAgICAgICAgICBzeXN0ZW0ucm9vZi5oZWlnaHQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICk7XG4gICAgICAgIGQudGV4dChcbiAgICAgICAgICAgIFt4K2R4LzIrNSwgeS0xNV0sXG4gICAgICAgICAgICBhbmdsZS50b1N0cmluZygpLFxuICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgKTtcblxuXG4gICAgICAgIHggPSB4K2R4KzEwMDtcbiAgICAgICAgeSA9IHk7XG5cblxuICAgICAgICAvLyovXG5cbiAgICB9XG5cbiAgICByZXR1cm4gZC5kcmF3aW5nX3BhcnRzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcGFnZTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vdmFyIHNldHRpbmdzID0gcmVxdWlyZSgnLi9zZXR0aW5ncy5qcycpO1xuLy92YXIgc25hcHN2ZyA9IHJlcXVpcmUoJ3NuYXBzdmcnKTtcbi8vbG9nKHNldHRpbmdzKTtcblxuXG5cbnZhciBkaXNwbGF5X3N2ZyA9IGZ1bmN0aW9uKGRyYXdpbmdfcGFydHMsIHNldHRpbmdzKXtcbiAgICAvL2NvbnNvbGUubG9nKCdkaXNwbGF5aW5nIHN2ZycpO1xuICAgIHZhciBsYXllcl9hdHRyID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sYXllcl9hdHRyO1xuICAgIHZhciBmb250cyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MuZm9udHM7XG4gICAgLy9jb25zb2xlLmxvZygnZHJhd2luZ19wYXJ0czogJywgZHJhd2luZ19wYXJ0cyk7XG4gICAgLy9jb250YWluZXIuZW1wdHkoKVxuXG4gICAgLy92YXIgc3ZnX2VsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnU3ZnanNTdmcxMDAwJylcbiAgICB2YXIgc3ZnX2VsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAnc3ZnJyk7XG4gICAgc3ZnX2VsZW0uc2V0QXR0cmlidXRlKCdjbGFzcycsJ3N2Z19kcmF3aW5nJyk7XG4gICAgLy9zdmdfZWxlbS5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcudyk7XG4gICAgLy9zdmdfZWxlbS5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS5kcmF3aW5nLmgpO1xuICAgIHZhciB2aWV3X2JveCA9ICcwIDAgJyArXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS5kcmF3aW5nLncgKyAnICcgK1xuICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy5oICsgJyAnO1xuICAgIHN2Z19lbGVtLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIHZpZXdfYm94KTtcbiAgICAvL3ZhciBzdmcgPSBzbmFwc3ZnKHN2Z19lbGVtKS5zaXplKHNpemUuZHJhd2luZy53LCBzaXplLmRyYXdpbmcuaCk7XG4gICAgLy92YXIgc3ZnID0gc25hcHN2ZygnI3N2Z19kcmF3aW5nJyk7XG5cbiAgICAvLyBMb29wIHRocm91Z2ggYWxsIHRoZSBkcmF3aW5nIGNvbnRlbnRzLCBjYWxsIHRoZSBmdW5jdGlvbiBiZWxvdy5cbiAgICBkcmF3aW5nX3BhcnRzLmZvckVhY2goIGZ1bmN0aW9uKGVsZW0saWQpIHtcbiAgICAgICAgc2hvd19lbGVtX2FycmF5KGVsZW0pO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gc2hvd19lbGVtX2FycmF5KGVsZW0sIG9mZnNldCl7XG4gICAgICAgIG9mZnNldCA9IG9mZnNldCB8fCB7eDowLHk6MH07XG4gICAgICAgIHZhciB4LHksYXR0cl9uYW1lO1xuICAgICAgICBpZiggdHlwZW9mIGVsZW0ueCAhPT0gJ3VuZGVmaW5lZCcgKSB7IHggPSBlbGVtLnggKyBvZmZzZXQueDsgfVxuICAgICAgICBpZiggdHlwZW9mIGVsZW0ueSAhPT0gJ3VuZGVmaW5lZCcgKSB7IHkgPSBlbGVtLnkgKyBvZmZzZXQueTsgfVxuXG4gICAgICAgIHZhciBhdHRycyA9IGxheWVyX2F0dHJbZWxlbS5sYXllcl9uYW1lXTtcbiAgICAgICAgaWYoIGVsZW0uYXR0cnMgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICBmb3IoIGF0dHJfbmFtZSBpbiBlbGVtLmF0dHJzICl7XG4gICAgICAgICAgICAgICAgYXR0cnNbYXR0cl9uYW1lXSA9IGVsZW0uYXR0cnNbYXR0cl9uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCBlbGVtLnR5cGUgPT09ICdyZWN0Jykge1xuICAgICAgICAgICAgLy9zdmcucmVjdCggZWxlbS53LCBlbGVtLmggKS5tb3ZlKCB4LWVsZW0udy8yLCB5LWVsZW0uaC8yICkuYXR0ciggbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdICk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdlbGVtOicsIGVsZW0gKTtcbiAgICAgICAgICAgIC8vaWYoIGlzTmFOKGVsZW0udykgKSB7XG4gICAgICAgICAgICAvLyAgICBjb25zb2xlLmxvZygnZXJyb3I6IGVsZW0gbm90IGZ1bGx5IGRlZmluZWQnLCBlbGVtKVxuICAgICAgICAgICAgLy8gICAgZWxlbS53ID0gMTA7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIC8vaWYoIGlzTmFOKGVsZW0uaCkgKSB7XG4gICAgICAgICAgICAvLyAgICBjb25zb2xlLmxvZygnZXJyb3I6IGVsZW0gbm90IGZ1bGx5IGRlZmluZWQnLCBlbGVtKVxuICAgICAgICAgICAgLy8gICAgZWxlbS5oID0gMTA7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIHZhciByID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3JlY3QnKTtcbiAgICAgICAgICAgIHIuc2V0QXR0cmlidXRlKCd3aWR0aCcsIGVsZW0udyk7XG4gICAgICAgICAgICByLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgZWxlbS5oKTtcbiAgICAgICAgICAgIHIuc2V0QXR0cmlidXRlKCd4JywgeC1lbGVtLncvMik7XG4gICAgICAgICAgICByLnNldEF0dHJpYnV0ZSgneScsIHktZWxlbS5oLzIpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhlbGVtLmxheWVyX25hbWUpO1xuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gYXR0cnMgKXtcbiAgICAgICAgICAgICAgICByLnNldEF0dHJpYnV0ZShhdHRyX25hbWUsIGF0dHJzW2F0dHJfbmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3ZnX2VsZW0uYXBwZW5kQ2hpbGQocik7XG4gICAgICAgIH0gZWxzZSBpZiggZWxlbS50eXBlID09PSAnbGluZScpIHtcbiAgICAgICAgICAgIHZhciBwb2ludHMyID0gW107XG4gICAgICAgICAgICBlbGVtLnBvaW50cy5mb3JFYWNoKCBmdW5jdGlvbihwb2ludCl7XG4gICAgICAgICAgICAgICAgaWYoICEgaXNOYU4ocG9pbnRbMF0pICYmICEgaXNOYU4ocG9pbnRbMV0pICl7XG4gICAgICAgICAgICAgICAgICAgIHBvaW50czIucHVzaChbIHBvaW50WzBdK29mZnNldC54LCBwb2ludFsxXStvZmZzZXQueSBdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3I6IGVsZW0gbm90IGZ1bGx5IGRlZmluZWQnLCBlbGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vc3ZnLnBvbHlsaW5lKCBwb2ludHMyICkuYXR0ciggbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdICk7XG5cbiAgICAgICAgICAgIHZhciBsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3BvbHlsaW5lJyk7XG4gICAgICAgICAgICBsLnNldEF0dHJpYnV0ZSggJ3BvaW50cycsIHBvaW50czIuam9pbignICcpICk7XG4gICAgICAgICAgICBmb3IoIGF0dHJfbmFtZSBpbiBhdHRycyApe1xuICAgICAgICAgICAgICAgIGwuc2V0QXR0cmlidXRlKGF0dHJfbmFtZSwgYXR0cnNbYXR0cl9uYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdmdfZWxlbS5hcHBlbmRDaGlsZChsKTtcbiAgICAgICAgfSBlbHNlIGlmKCBlbGVtLnR5cGUgPT09ICdwb2x5Jykge1xuICAgICAgICAgICAgdmFyIHBvaW50czIgPSBbXTtcbiAgICAgICAgICAgIGVsZW0ucG9pbnRzLmZvckVhY2goIGZ1bmN0aW9uKHBvaW50KXtcbiAgICAgICAgICAgICAgICBpZiggISBpc05hTihwb2ludFswXSkgJiYgISBpc05hTihwb2ludFsxXSkgKXtcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzMi5wdXNoKFsgcG9pbnRbMF0rb2Zmc2V0LngsIHBvaW50WzFdK29mZnNldC55IF0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjogZWxlbSBub3QgZnVsbHkgZGVmaW5lZCcsIGVsZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9zdmcucG9seWxpbmUoIHBvaW50czIgKS5hdHRyKCBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV0gKTtcblxuICAgICAgICAgICAgdmFyIGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAncG9seWxpbmUnKTtcbiAgICAgICAgICAgIGwuc2V0QXR0cmlidXRlKCAncG9pbnRzJywgcG9pbnRzMi5qb2luKCcgJykgKTtcbiAgICAgICAgICAgIGZvciggYXR0cl9uYW1lIGluIGF0dHJzICl7XG4gICAgICAgICAgICAgICAgbC5zZXRBdHRyaWJ1dGUoYXR0cl9uYW1lLCBhdHRyc1thdHRyX25hbWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN2Z19lbGVtLmFwcGVuZENoaWxkKGwpO1xuICAgICAgICB9IGVsc2UgaWYoIGVsZW0udHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAvL3ZhciB0ID0gc3ZnLnRleHQoIGVsZW0uc3RyaW5ncyApLm1vdmUoIGVsZW0ucG9pbnRzWzBdWzBdLCBlbGVtLnBvaW50c1swXVsxXSApLmF0dHIoIGxheWVyX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApXG4gICAgICAgICAgICB2YXIgZm9udDtcbiAgICAgICAgICAgIGlmKCBlbGVtLmZvbnQgKXtcbiAgICAgICAgICAgICAgICBmb250ID0gZm9udHNbZWxlbS5mb250XTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9udCA9IGZvbnRzW2F0dHJzLmZvbnRdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAndGV4dCcpO1xuICAgICAgICAgICAgaWYoZWxlbS5yb3RhdGVkKXtcbiAgICAgICAgICAgICAgICAvL3Quc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCBcInJvdGF0ZShcIiArIGVsZW0ucm90YXRlZCArIFwiIFwiICsgeCArIFwiIFwiICsgeSArIFwiKVwiICk7XG4gICAgICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsIFwicm90YXRlKFwiICsgZWxlbS5yb3RhdGVkICsgXCIgXCIgKyB4ICsgXCIgXCIgKyB5ICsgXCIpXCIgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9pZiggZm9udFsndGV4dC1hbmNob3InXSA9PT0gJ21pZGRsZScgKSB5ICs9IGZvbnRbJ2ZvbnQtc2l6ZSddKjEvMztcbiAgICAgICAgICAgICAgICB5ICs9IGZvbnRbJ2ZvbnQtc2l6ZSddKjEvMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkeSA9IGZvbnRbJ2ZvbnQtc2l6ZSddKjEuNTtcbiAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCd4JywgeCk7XG4gICAgICAgICAgICAvL3Quc2V0QXR0cmlidXRlKCd5JywgeSArIGZvbnRbJ2ZvbnQtc2l6ZSddLzIgKTtcbiAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCd5JywgeS1keSApO1xuXG4gICAgICAgICAgICBmb3IoIGF0dHJfbmFtZSBpbiBhdHRycyApe1xuICAgICAgICAgICAgICAgIGlmKCBhdHRyX25hbWUgPT09ICdzdHJva2UnICkge1xuICAgICAgICAgICAgICAgICAgICB0LnNldEF0dHJpYnV0ZSggJ2ZpbGwnLCBhdHRyc1thdHRyX25hbWVdICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKCBhdHRyX25hbWUgPT09ICdmaWxsJyApIHtcbiAgICAgICAgICAgICAgICAgICAgLy90LnNldEF0dHJpYnV0ZSggJ3N0cm9rZScsICdub25lJyApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCBhdHRyX25hbWUsIGF0dHJzW2F0dHJfbmFtZV0gKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciggYXR0cl9uYW1lIGluIGZvbnQgKXtcbiAgICAgICAgICAgICAgICB0LnNldEF0dHJpYnV0ZSggYXR0cl9uYW1lLCBmb250W2F0dHJfbmFtZV0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciggYXR0cl9uYW1lIGluIGVsZW0uc3RyaW5ncyApe1xuICAgICAgICAgICAgICAgIHZhciB0c3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICd0c3BhbicpO1xuICAgICAgICAgICAgICAgIHRzcGFuLnNldEF0dHJpYnV0ZSgnZHknLCBkeSApO1xuICAgICAgICAgICAgICAgIHRzcGFuLnNldEF0dHJpYnV0ZSgneCcsIHgpO1xuICAgICAgICAgICAgICAgIHRzcGFuLmlubmVySFRNTCA9IGVsZW0uc3RyaW5nc1thdHRyX25hbWVdO1xuICAgICAgICAgICAgICAgIHQuYXBwZW5kQ2hpbGQodHNwYW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3ZnX2VsZW0uYXBwZW5kQ2hpbGQodCk7XG4gICAgICAgIH0gZWxzZSBpZiggZWxlbS50eXBlID09PSAnY2lyYycpIHtcbiAgICAgICAgICAgIHZhciBjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ2VsbGlwc2UnKTtcbiAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKCdyeCcsIGVsZW0uZC8yKTtcbiAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKCdyeScsIGVsZW0uZC8yKTtcbiAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKCdjeCcsIHgpO1xuICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoJ2N5JywgeSk7XG4gICAgICAgICAgICBmb3IoIGF0dHJfbmFtZSBpbiBhdHRycyApe1xuICAgICAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKGF0dHJfbmFtZSwgYXR0cnNbYXR0cl9uYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdmdfZWxlbS5hcHBlbmRDaGlsZChjKTtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBjLmF0dHJpYnV0ZXMoIGxheWVyX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApXG4gICAgICAgICAgICBjLmF0dHJpYnV0ZXMoe1xuICAgICAgICAgICAgICAgIHJ4OiA1LFxuICAgICAgICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgcnk6IDUsXG4gICAgICAgICAgICAgICAgY3g6IGVsZW0ucG9pbnRzWzBdWzBdLWVsZW0uZC8yLFxuICAgICAgICAgICAgICAgIGN5OiBlbGVtLnBvaW50c1swXVsxXS1lbGVtLmQvMlxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHZhciBjMiA9IHN2Zy5lbGxpcHNlKCBlbGVtLnIsIGVsZW0uciApXG4gICAgICAgICAgICBjMi5tb3ZlKCBlbGVtLnBvaW50c1swXVswXS1lbGVtLmQvMiwgZWxlbS5wb2ludHNbMF1bMV0tZWxlbS5kLzIgKVxuICAgICAgICAgICAgYzIuYXR0cih7cng6NSwgcnk6NX0pXG4gICAgICAgICAgICBjMi5hdHRyKCBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV0gKVxuICAgICAgICAgICAgKi9cbiAgICAgICAgfSBlbHNlIGlmKGVsZW0udHlwZSA9PT0gJ2Jsb2NrJykge1xuICAgICAgICAgICAgLy8gaWYgaXQgaXMgYSBibG9jaywgcnVuIHRoaXMgZnVuY3Rpb24gdGhyb3VnaCBlYWNoIGVsZW1lbnQuXG4gICAgICAgICAgICBlbGVtLmRyYXdpbmdfcGFydHMuZm9yRWFjaCggZnVuY3Rpb24oYmxvY2tfZWxlbSxpZCl7XG4gICAgICAgICAgICAgICAgc2hvd19lbGVtX2FycmF5KGJsb2NrX2VsZW0sIHt4OngsIHk6eX0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN2Z19lbGVtO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRpc3BsYXlfc3ZnO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgZiA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zJyk7XG52YXIgayA9IHJlcXVpcmUoJy4uL2xpYi9rL2suanMnKTtcblxudmFyIGk7XG4vL3ZhciBzZXR0aW5nc0NhbGN1bGF0ZWQgPSByZXF1aXJlKCcuL3NldHRpbmdzQ2FsY3VsYXRlZC5qcycpO1xuXG4vLyBMb2FkICd1c2VyJyBkZWZpbmVkIHNldHRpbmdzXG4vL3ZhciBta19zZXR0aW5ncyA9IHJlcXVpcmUoJy4uL2RhdGEvc2V0dGluZ3MuanNvbi5qcycpO1xuLy9mLm1rX3NldHRpbmdzID0gbWtfc2V0dGluZ3M7XG5cbnZhciBzZXR0aW5ncyA9IHt9O1xuXG5zZXR0aW5ncy50ZW1wID0ge307XG5cbnNldHRpbmdzLmNvbmZpZ19vcHRpb25zID0ge307XG5zZXR0aW5ncy5jb25maWdfb3B0aW9ucy5ORUNfdGFibGVzID0gcmVxdWlyZSgnLi4vZGF0YS90YWJsZXMuanNvbicpO1xuLy9jb25zb2xlLmxvZyhzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5ORUNfdGFibGVzKTtcblxuc2V0dGluZ3Muc3RhdGUgPSB7fTtcbnNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCA9IGZhbHNlO1xuXG5zZXR0aW5ncy5pbiA9IHt9O1xuXG5zZXR0aW5ncy5pbi5vcHQgPSB7fTtcbnNldHRpbmdzLmluLm9wdC5BQyA9IHt9O1xuc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzID0ge307XG5zZXR0aW5ncy5pbi5vcHQuQUMudHlwZXNbXCIxMjBWXCJdID0gW1wiZ3JvdW5kXCIsXCJuZXV0cmFsXCIsXCJMMVwiXTtcbnNldHRpbmdzLmluLm9wdC5BQy50eXBlc1tcIjI0MFZcIl0gPSBbXCJncm91bmRcIixcIm5ldXRyYWxcIixcIkwxXCIsXCJMMlwiXTtcbnNldHRpbmdzLmluLm9wdC5BQy50eXBlc1tcIjIwOFZcIl0gPSBbXCJncm91bmRcIixcIm5ldXRyYWxcIixcIkwxXCIsXCJMMlwiXTtcbnNldHRpbmdzLmluLm9wdC5BQy50eXBlc1tcIjI3N1ZcIl0gPSBbXCJncm91bmRcIixcIm5ldXRyYWxcIixcIkwxXCJdO1xuc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzW1wiNDgwViBXeWVcIl0gPSBbXCJncm91bmRcIixcIm5ldXRyYWxcIixcIkwxXCIsXCJMMlwiLFwiTDNcIl07XG5zZXR0aW5ncy5pbi5vcHQuQUMudHlwZXNbXCI0ODBWIERlbHRhXCJdID0gW1wiZ3JvdW5kXCIsXCJMMVwiLFwiTDJcIixcIkwzXCJdO1xuXG5zZXR0aW5ncy5pbnB1dHMgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5yb29mID0ge307XG5zZXR0aW5ncy5pbnB1dHMucm9vZi53aWR0aCA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLnJvb2Yud2lkdGgub3B0aW9ucyA9IFtdO1xuLy9mb3IoIGk9MTU7IGk8PTcwOyBpKz01ICkgc2V0dGluZ3MuaW5wdXRzLnJvb2Yud2lkdGgub3B0aW9ucy5wdXNoKGkpO1xuc2V0dGluZ3MuaW5wdXRzLnJvb2Yud2lkdGgudW5pdHMgPSAnZnQuJztcbnNldHRpbmdzLmlucHV0cy5yb29mLndpZHRoLm5vdGUgPSAnVGhpcyB0aGUgZnVsbCBzaXplIG9mIHRoZSByb29mLCBwZXJwZW5kaWN0dWxhciB0byB0aGUgc2xvcGUuJztcbnNldHRpbmdzLmlucHV0cy5yb29mLndpZHRoLnR5cGUgPSAnaW5wdXQnO1xuc2V0dGluZ3MuaW5wdXRzLnJvb2YubGVuZ3RoID0ge307XG5zZXR0aW5ncy5pbnB1dHMucm9vZi5sZW5ndGgub3B0aW9ucyA9IFtdO1xuLy9mb3IoIGk9MTA7IGk8PTYwOyBpKz01ICkgc2V0dGluZ3MuaW5wdXRzLnJvb2YubGVuZ3RoLm9wdGlvbnMucHVzaChpKTtcbnNldHRpbmdzLmlucHV0cy5yb29mLmxlbmd0aC51bml0cyA9ICdmdC4nO1xuc2V0dGluZ3MuaW5wdXRzLnJvb2YubGVuZ3RoLm5vdGUgPSAnVGhpcyB0aGUgZnVsbCBsZW5ndGggb2YgdGhlIHJvb2YsIG1lYXN1cmVkIGZyb20gbG93IHRvIGhpZ2guJztcbnNldHRpbmdzLmlucHV0cy5yb29mLmxlbmd0aC50eXBlID0gJ2lucHV0JztcbnNldHRpbmdzLmlucHV0cy5yb29mLnNsb3BlID0ge307XG5zZXR0aW5ncy5pbnB1dHMucm9vZi5zbG9wZS5vcHRpb25zID0gWycxOjEyJywnMjoxMicsJzM6MTInLCc0OjEyJywnNToxMicsJzY6MTInLCc3OjEyJywnODoxMicsJzk6MTInLCcxMDoxMicsJzExOjEyJywnMTI6MTInXTtcbnNldHRpbmdzLmlucHV0cy5yb29mLnR5cGUgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5yb29mLnR5cGUub3B0aW9ucyA9IFsnR2FibGUnLCdTaGVkJywnSGlwcGVkJ107XG5zZXR0aW5ncy5pbnB1dHMubW9kdWxlID0ge307XG5zZXR0aW5ncy5pbnB1dHMubW9kdWxlLm1ha2UgPSB7fTtcbi8vc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5tYWtlLm9wdGlvbnMgPSBudWxsO1xuc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5tb2RlbCA9IHt9O1xuLy9zZXR0aW5ncy5pbnB1dHMubW9kdWxlLm1vZGVsLm9wdGlvbnMgPSBudWxsO1xuc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5vcmllbnRhdGlvbiA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5vcmllbnRhdGlvbi5vcHRpb25zID0gWydQb3J0cmFpdCcsJ0xhbmRzY2FwZSddO1xuc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS53aWR0aCA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS53aWR0aC5vcHRpb25zID0gWzIwLDI1LDMwLDM1LDQwXTtcbnNldHRpbmdzLmlucHV0cy5tb2R1bGUud2lkdGgudW5pdHMgPSAnaW4uJztcbnNldHRpbmdzLmlucHV0cy5tb2R1bGUud2lkdGgubm90ZSA9ICdUaGlzIHRoZSBmdWxsIGZyYW1lIHNpemUgKG91dGVyKS4nO1xuc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS53aWR0aC50eXBlID0gJ2lucHV0JztcbnNldHRpbmdzLmlucHV0cy5tb2R1bGUubGVuZ3RoID0ge307XG5zZXR0aW5ncy5pbnB1dHMubW9kdWxlLmxlbmd0aC5vcHRpb25zID0gWzMwLDM1LDQwLDQ1LDUwXTtcbnNldHRpbmdzLmlucHV0cy5tb2R1bGUubGVuZ3RoLnVuaXRzID0gJ2luLic7XG5zZXR0aW5ncy5pbnB1dHMubW9kdWxlLmxlbmd0aC5ub3RlID0gJ1RoaXMgdGhlIGZ1bGwgZnJhbWUgc2l6ZSAob3V0ZXIpLic7XG5zZXR0aW5ncy5pbnB1dHMubW9kdWxlLmxlbmd0aC50eXBlID0gJ2lucHV0JztcbnNldHRpbmdzLmlucHV0cy5hcnJheSA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZyA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZy5vcHRpb25zID0gWzEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDE4LDE5LDIwXTtcbnNldHRpbmdzLmlucHV0cy5hcnJheS5udW1fc3RyaW5ncyA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLmFycmF5Lm51bV9zdHJpbmdzLm9wdGlvbnMgPSBbMSwyLDMsNCw1LDZdO1xuc2V0dGluZ3MuaW5wdXRzLkRDID0ge307XG5zZXR0aW5ncy5pbnB1dHMuREMuaG9tZV9ydW5fbGVuZ3RoID0ge307XG4vL3NldHRpbmdzLmlucHV0cy5EQy5ob21lX3J1bl9sZW5ndGgub3B0aW9ucyA9IFsyNSw1MCw3NSwxMDAsMTI1LDE1MF07XG5zZXR0aW5ncy5pbnB1dHMuREMuaG9tZV9ydW5fbGVuZ3RoLnR5cGUgPSAnaW5wdXQnO1xuc2V0dGluZ3MuaW5wdXRzLmludmVydGVyID0ge307XG5zZXR0aW5ncy5pbnB1dHMuaW52ZXJ0ZXIubWFrZSA9IHt9O1xuLy9zZXR0aW5ncy5pbnB1dHMuaW52ZXJ0ZXIubWFrZS5vcHRpb25zID0gbnVsbDtcbnNldHRpbmdzLmlucHV0cy5pbnZlcnRlci5tb2RlbCA9IHt9O1xuLy9zZXR0aW5ncy5pbnB1dHMuaW52ZXJ0ZXIubW9kZWwub3B0aW9ucyA9IG51bGw7XG5zZXR0aW5ncy5pbnB1dHMuQUMgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzID0ge307XG5zZXR0aW5ncy5pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlc1snMjQwViddID0ge307XG5zZXR0aW5ncy5pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlc1snMjQwViddID0gWycyNDBWJywnMTIwViddO1xuc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbJzIwOC8xMjBWJ10gPSB7fTtcbnNldHRpbmdzLmlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzWycyMDgvMTIwViddID0gWycyMDhWJywnMTIwViddO1xuc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbJzQ4MC8yNzdWJ10gPSB7fTtcbnNldHRpbmdzLmlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzWyc0ODAvMjc3ViddID0gWyc0ODBWIFd5ZScsJzQ4MFYgRGVsdGEnLCcyNzdWJ107XG5zZXR0aW5ncy5pbnB1dHMuQUMudHlwZSA9IHt9O1xuLy9zZXR0aW5ncy5pbnB1dHMuQUMudHlwZS5vcHRpb25zID0gbnVsbDtcbnNldHRpbmdzLmlucHV0cy5BQy5kaXN0YW5jZV90b19sb2FkY2VudGVyID0ge307XG4vL3NldHRpbmdzLmlucHV0cy5BQy5kaXN0YW5jZV90b19sb2FkY2VudGVyLm9wdGlvbnMgPSBbMyw1LDEwLDE1LDIwLDMwXTtcbnNldHRpbmdzLmlucHV0cy5BQy5kaXN0YW5jZV90b19sb2FkY2VudGVyLnR5cGUgPSAnaW5wdXQnO1xuXG5cblxuLy9zZXR0aW5ncy5pbnB1dHMgPSBzZXR0aW5ncy5pbnB1dHM7IC8vIGNvcHkgaW5wdXQgcmVmZXJlbmNlIHdpdGggb3B0aW9ucyB0byBpbnB1dHNcbi8vc2V0dGluZ3MuaW5wdXRzID0gZi5ibGFua19jb3B5KHNldHRpbmdzLmlucHV0cyk7IC8vIG1ha2UgaW5wdXQgc2VjdGlvbiBibGFua1xuLy9zZXR0aW5ncy5zeXN0ZW1fZm9ybXVsYXMgPSBzZXR0aW5ncy5zeXN0ZW07IC8vIGNvcHkgc3lzdGVtIHJlZmVyZW5jZSB0byBzeXN0ZW1fZm9ybXVsYXNcbnNldHRpbmdzLnN5c3RlbSA9IGYuYmxhbmtfY29weShzZXR0aW5ncy5pbnB1dHMpOyAvLyBtYWtlIHN5c3RlbSBzZWN0aW9uIGJsYW5rXG4vL2YubWVyZ2Vfb2JqZWN0cyggc2V0dGluZ3MuaW5wdXRzLCBzZXR0aW5ncy5zeXN0ZW0gKTtcblxuXG4vLyBsb2FkIGxheWVyc1xuXG5zZXR0aW5ncy5kcmF3aW5nID0ge307XG5cbnNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MgPSB7fTtcbnNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubGF5ZXJfYXR0ciA9IHJlcXVpcmUoJy4vc2V0dGluZ3NfbGF5ZXJzJyk7XG5zZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmZvbnRzID0gcmVxdWlyZSgnLi9zZXR0aW5nc19mb250cycpO1xuXG5zZXR0aW5ncy5kcmF3aW5nLmJsb2NrcyA9IHt9O1xuXG4vLyBMb2FkIGRyYXdpbmcgc3BlY2lmaWMgc2V0dGluZ3Ncbi8vIFRPRE8gRml4IHNldHRpbmdzX2RyYXdpbmcgd2l0aCBuZXcgdmFyaWFibGUgbG9jYXRpb25zXG52YXIgc2V0dGluZ3NfZHJhd2luZyA9IHJlcXVpcmUoJy4vc2V0dGluZ3NfZHJhd2luZycpO1xuc2V0dGluZ3MgPSBzZXR0aW5nc19kcmF3aW5nKHNldHRpbmdzKTtcblxuLy9zZXR0aW5ncy5zdGF0ZV9hcHAudmVyc2lvbl9zdHJpbmcgPSB2ZXJzaW9uX3N0cmluZztcblxuLy9zZXR0aW5ncyA9IGYubnVsbFRvT2JqZWN0KHNldHRpbmdzKTtcblxuc2V0dGluZ3Muc2VsZWN0X3JlZ2lzdHJ5ID0gW107XG5zZXR0aW5ncy52YWx1ZV9yZWdpc3RyeSA9IFtdO1xuXG5cbi8vdmFyIGNvbmZpZ19vcHRpb25zID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnMgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucyB8fCB7fTtcblxuc2V0dGluZ3Mud2VicGFnZSA9IHt9O1xuc2V0dGluZ3Mud2VicGFnZS5zZWxlY3Rpb25zX21hbnVhbF90b2dnbGVkID0ge307XG5zZXR0aW5ncy53ZWJwYWdlLnNlY3Rpb25zID0gT2JqZWN0LmtleXMoc2V0dGluZ3MuaW5wdXRzKTtcblxuXG5zZXR0aW5ncy53ZWJwYWdlLnNlY3Rpb25zLmZvckVhY2goIGZ1bmN0aW9uKHNlY3Rpb25fbmFtZSl7XG4gICAgc2V0dGluZ3Mud2VicGFnZS5zZWxlY3Rpb25zX21hbnVhbF90b2dnbGVkW3NlY3Rpb25fbmFtZV0gPSBmYWxzZTtcbn0pO1xuXG5zZXR0aW5ncy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNfdG90YWwgPSAwO1xuc2V0dGluZ3Mud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzID0ge307XG5cblxuXG5cbnNldHRpbmdzLmNvbXBvbmVudHMgPSB7fTtcblxuXG4vKlxuZm9yKCB2YXIgc2VjdGlvbl9uYW1lIGluIHNldHRpbmdzLmlucHV0cyApe1xuICAgIGZvciggdmFyIGlucHV0X25hbWUgaW4gc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV0pe1xuICAgICAgICBpZiggdHlwZW9mIHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdID09PSAnc3RyaW5nJyApe1xuICAgICAgICAgICAgY29uc29sZS5sb2coc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0pXG4gICAgICAgICAgICBcIm9ial9uYW1lcyhzZXR0dGluZ3NcIiArIHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdICsgXCIpXCI7XG4gICAgICAgICAgICAvLyBldmFsIGlzIG9ubHkgYmVpbmcgdXNlZCBvbiBzdHJpbmdzIGRlZmluZWQgaW4gdGhlIHNldHRpbmdzLmpzb24gZmlsZSB0aGF0IGlzIGJ1aWx0IGludG8gdGhlIGFwcGxpY2F0aW9uXG4gICAgICAgICAgICBzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSA9IGV2YWwoc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0pO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8qL1xuXG5cbi8qXG5zZXR0aW5ncy5zdGF0ZS5zZWN0aW9ucyA9IHtcbiAgICBtb2R1bGVzOiB7fSxcbiAgICBhcnJheToge30sXG4gICAgREM6IHt9LFxuICAgIGludmVydGVyOiB7fSxcbiAgICBBQzoge30sXG59O1xuY29uZmlnX29wdGlvbnMuc2VjdGlvbl9vcHRpb25zID0gb2JqX25hbWVzKHNldHRpbmdzLnN0YXRlLnNlY3Rpb25zKTtcbnNldHRpbmdzLnN0YXRlLmFjdGl2ZV9zZWN0aW9uID0gJ21vZHVsZXMnO1xuXG5jb25maWdfb3B0aW9ucy5BQ19sb2FkY2VudGVyX3R5cGVfb3B0aW9ucyA9IG9ial9uYW1lcyggY29uZmlnX29wdGlvbnMuQUNfbG9hZGNlbnRlcl90eXBlcyApO1xuY29uZmlnX29wdGlvbnMuQUNfdHlwZV9vcHRpb25zID0gb2JqX25hbWVzKCBjb25maWdfb3B0aW9ucy5BQ190eXBlcyApO1xuXG5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnMgPSB7fTtcblxuY29uZmlnX29wdGlvbnMucGFnZV9vcHRpb25zID0gWydQYWdlIDEgb2YgMSddO1xuc2V0dGluZ3Muc3RhdGUuYWN0aXZlX3BhZ2UgPSBjb25maWdfb3B0aW9ucy5wYWdlX29wdGlvbnNbMF07XG5cbnN5c3RlbS5pbnZlcnRlciA9IHt9O1xuXG5cbmNvbmZpZ19vcHRpb25zLkRDX2hvbWVydW5fbGVuZ3RocyA9IGNvbmZpZ19vcHRpb25zLkRDX2hvbWVydW5fbGVuZ3RocyB8fCBbMjUsNTAsNzUsMTAwXTtcbmNvbmZpZ19vcHRpb25zLkRDX2hvbWVydW5fQVdHX29wdGlvbnMgPVxuICAgIGNvbmZpZ19vcHRpb25zLkRDX2hvbWVydW5fQVdHX29wdGlvbnMgfHxcbiAgICBvYmpfbmFtZXMoIGNvbmZpZ19vcHRpb25zLk5FQ190YWJsZXNbXCJDaCA5IFRhYmxlIDggQ29uZHVjdG9yIFByb3BlcnRpZXNcIl0gKTtcbi8vKi9cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldHRpbmdzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIHNldHRpbmdzX2RyYXdpbmcoc2V0dGluZ3Mpe1xuXG4gICAgdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcbiAgICB2YXIgc3RhdHVzID0gc2V0dGluZ3Muc3RhdHVzO1xuXG4gICAgLy8gRHJhd2luZyBzcGVjaWZpY1xuICAgIC8vc2V0dGluZ3MuZHJhd2luZyA9IHNldHRpbmdzLmRyYXdpbmcgfHwge307XG5cblxuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplID0ge307XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jID0ge307XG5cblxuICAgIC8vIHNpemVzXG4gICAgc2l6ZS5kcmF3aW5nID0ge1xuICAgICAgICB3OiAxMDAwLFxuICAgICAgICBoOiA3ODAsXG4gICAgICAgIGZyYW1lX3BhZGRpbmc6IDUsXG4gICAgICAgIHRpdGxlYm94OiA1MCxcbiAgICB9O1xuXG4gICAgc2l6ZS5tb2R1bGUgPSB7fTtcbiAgICBzaXplLm1vZHVsZS5mcmFtZSA9IHtcbiAgICAgICAgdzogMTAsXG4gICAgICAgIGg6IDMwLFxuICAgIH07XG4gICAgc2l6ZS5tb2R1bGUubGVhZCA9IHNpemUubW9kdWxlLmZyYW1lLncqMi8zO1xuICAgIHNpemUubW9kdWxlLmggPSBzaXplLm1vZHVsZS5mcmFtZS5oICsgc2l6ZS5tb2R1bGUubGVhZCoyO1xuICAgIHNpemUubW9kdWxlLncgPSBzaXplLm1vZHVsZS5mcmFtZS53O1xuXG4gICAgc2l6ZS53aXJlX29mZnNldCA9IHtcbiAgICAgICAgYmFzZTogNyxcbiAgICAgICAgZ2FwOiBzaXplLm1vZHVsZS53LFxuICAgIH07XG4gICAgc2l6ZS53aXJlX29mZnNldC5taW4gPSBzaXplLndpcmVfb2Zmc2V0LmJhc2UgKiAxO1xuXG4gICAgc2l6ZS5zdHJpbmcgPSB7fTtcbiAgICBzaXplLnN0cmluZy5nYXAgPSBzaXplLm1vZHVsZS5mcmFtZS53LzQyO1xuICAgIHNpemUuc3RyaW5nLmdhcF9taXNzaW5nID0gc2l6ZS5tb2R1bGUuaDtcbiAgICBzaXplLnN0cmluZy53ID0gc2l6ZS5tb2R1bGUuZnJhbWUudyAqIDIuNTtcblxuICAgIHNpemUudGVybWluYWxfZGlhbSA9IDU7XG4gICAgc2l6ZS5mdXNlID0ge307XG4gICAgc2l6ZS5mdXNlLncgPSAxNTtcbiAgICBzaXplLmZ1c2UuaCA9IDQ7XG5cblxuICAgIC8vIEludmVydGVyXG4gICAgc2l6ZS5pbnZlcnRlciA9IHsgdzogMjUwLCBoOiAxNTAgfTtcbiAgICBzaXplLmludmVydGVyLnRleHRfZ2FwID0gMTU7XG4gICAgc2l6ZS5pbnZlcnRlci5zeW1ib2xfdyA9IDUwO1xuICAgIHNpemUuaW52ZXJ0ZXIuc3ltYm9sX2ggPSAyNTtcblxuICAgIGxvYy5pbnZlcnRlciA9IHtcbiAgICAgICAgeDogc2l6ZS5kcmF3aW5nLncvMixcbiAgICAgICAgeTogc2l6ZS5kcmF3aW5nLmgvMyxcbiAgICB9O1xuICAgIGxvYy5pbnZlcnRlci5ib3R0b20gPSBsb2MuaW52ZXJ0ZXIueSArIHNpemUuaW52ZXJ0ZXIuaC8yO1xuICAgIGxvYy5pbnZlcnRlci50b3AgPSBsb2MuaW52ZXJ0ZXIueSAtIHNpemUuaW52ZXJ0ZXIuaC8yO1xuICAgIGxvYy5pbnZlcnRlci5ib3R0b21fcmlnaHQgPSB7XG4gICAgICAgIHg6IGxvYy5pbnZlcnRlci54ICsgc2l6ZS5pbnZlcnRlci53LzIsXG4gICAgICAgIHk6IGxvYy5pbnZlcnRlci55ICsgc2l6ZS5pbnZlcnRlci5oLzIsXG4gICAgfTtcblxuICAgIC8vIGFycmF5XG4gICAgbG9jLmFycmF5ID0ge1xuICAgICAgICB4OiBsb2MuaW52ZXJ0ZXIueCAtIDIwMCxcbiAgICAgICAgdXBwZXI6IGxvYy5pbnZlcnRlci55IC0gMjAsXG4gICAgfTtcbiAgICAvL2xvYy5hcnJheS51cHBlciA9IGxvYy5hcnJheS55IC0gc2l6ZS5zdHJpbmcuaC8yO1xuICAgIGxvYy5hcnJheS5yaWdodCA9IGxvYy5hcnJheS54IC0gc2l6ZS5tb2R1bGUuZnJhbWUuaCozO1xuXG5cblxuXG4gICAgbG9jLkRDID0gbG9jLmFycmF5O1xuXG4gICAgLy8gREMgamJcbiAgICBzaXplLmpiX2JveCA9IHtcbiAgICAgICAgaDogMTUwLFxuICAgICAgICB3OiA4MCxcbiAgICB9O1xuICAgIGxvYy5qYl9ib3ggPSB7XG4gICAgICAgIHg6IDM1MCxcbiAgICAgICAgeTogNTUwLFxuICAgIH07XG5cbiAgICAvLyBEQyBkaWNvbmVjdFxuICAgIHNpemUuZGlzY2JveCA9IHtcbiAgICAgICAgdzogMTQwLFxuICAgICAgICBoOiA1MCxcbiAgICB9O1xuICAgIGxvYy5kaXNjYm94ID0ge1xuICAgICAgICB4OiBsb2MuaW52ZXJ0ZXIueCAtIHNpemUuaW52ZXJ0ZXIudy8yICsgc2l6ZS5kaXNjYm94LncvMixcbiAgICAgICAgeTogbG9jLmludmVydGVyLnkgKyBzaXplLmludmVydGVyLmgvMiArIHNpemUuZGlzY2JveC5oLzIgKyAxMCxcbiAgICB9O1xuXG4gICAgLy8gQUMgZGljb25lY3RcbiAgICBzaXplLkFDX2Rpc2MgPSB7IHc6IDgwLCBoOiAxMjUgfTtcblxuICAgIGxvYy5BQ19kaXNjID0ge1xuICAgICAgICB4OiBsb2MuaW52ZXJ0ZXIueCsyMDAsXG4gICAgICAgIHk6IGxvYy5pbnZlcnRlci55KzI1MFxuICAgIH07XG4gICAgbG9jLkFDX2Rpc2MuYm90dG9tID0gbG9jLkFDX2Rpc2MueSArIHNpemUuQUNfZGlzYy5oLzI7XG4gICAgbG9jLkFDX2Rpc2MudG9wID0gbG9jLkFDX2Rpc2MueSAtIHNpemUuQUNfZGlzYy5oLzI7XG4gICAgbG9jLkFDX2Rpc2MubGVmdCA9IGxvYy5BQ19kaXNjLnggLSBzaXplLkFDX2Rpc2Mudy8yO1xuICAgIGxvYy5BQ19kaXNjLnN3aXRjaF90b3AgPSBsb2MuQUNfZGlzYy50b3AgKyAxNTtcbiAgICBsb2MuQUNfZGlzYy5zd2l0Y2hfYm90dG9tID0gbG9jLkFDX2Rpc2Muc3dpdGNoX3RvcCArIDMwO1xuXG5cbiAgICAvLyBBQyBwYW5lbFxuXG4gICAgbG9jLkFDX2xvYWRjZW50ZXIgPSB7XG4gICAgICAgIHg6IGxvYy5pbnZlcnRlci54KzM1MCxcbiAgICAgICAgeTogbG9jLmludmVydGVyLnkrMTAwXG4gICAgfTtcbiAgICBzaXplLkFDX2xvYWRjZW50ZXIgPSB7IHc6IDEyNSwgaDogMzAwIH07XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIubGVmdCA9IGxvYy5BQ19sb2FkY2VudGVyLnggLSBzaXplLkFDX2xvYWRjZW50ZXIudy8yO1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLnRvcCA9IGxvYy5BQ19sb2FkY2VudGVyLnkgLSBzaXplLkFDX2xvYWRjZW50ZXIuaC8yO1xuXG5cbiAgICBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlciA9IHsgdzogMjAsIGg6IHNpemUudGVybWluYWxfZGlhbSwgfTtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5icmVha2VycyA9IHtcbiAgICAgICAgbGVmdDogbG9jLkFDX2xvYWRjZW50ZXIueCAtICggc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIudyAqIDEuMSApLFxuICAgIH07XG4gICAgc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzID0ge1xuICAgICAgICBudW06IDIwLFxuICAgICAgICBzcGFjaW5nOiBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci5oICsgMSxcbiAgICB9O1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnRvcCA9IGxvYy5BQ19sb2FkY2VudGVyLnRvcCArIHNpemUuQUNfbG9hZGNlbnRlci5oLzU7XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMuYm90dG9tID0gbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMudG9wICsgc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnNwYWNpbmcqc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLm51bTtcblxuXG4gICAgc2l6ZS5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIgPSB7IHc6NSwgaDo0MCB9O1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIgPSB7XG4gICAgICAgIHg6IGxvYy5BQ19sb2FkY2VudGVyLmxlZnQgKyAyMCxcbiAgICAgICAgeTogbG9jLkFDX2xvYWRjZW50ZXIueSArIHNpemUuQUNfbG9hZGNlbnRlci5oKjAuM1xuICAgIH07XG5cbiAgICBzaXplLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyID0geyB3OjQwLCBoOjUgfTtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIgPSB7XG4gICAgICAgIHg6IGxvYy5BQ19sb2FkY2VudGVyLnggKyAxMCxcbiAgICAgICAgeTogbG9jLkFDX2xvYWRjZW50ZXIueSArIHNpemUuQUNfbG9hZGNlbnRlci5oKjAuNDVcbiAgICB9O1xuXG4gICAgbG9jLkFDX2NvbmR1aXQgPSB7XG4gICAgICAgIHk6IGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLmJvdHRvbSAtIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5zcGFjaW5nLzIsXG4gICAgfTtcblxuXG4gICAgLy8gd2lyZSB0YWJsZVxuICAgIGxvYy53aXJlX3RhYmxlID0ge1xuICAgICAgICB4OiBzaXplLmRyYXdpbmcudyAtIHNpemUuZHJhd2luZy50aXRsZWJveCAtIHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nKjMgLSAzMjUsXG4gICAgICAgIHk6IHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nKjMsXG4gICAgfTtcblxuICAgIC8vIHZvbHRhZ2UgZHJvcCB0YWJsZVxuICAgIHNpemUudm9sdF9kcm9wX3RhYmxlID0ge307XG4gICAgc2l6ZS52b2x0X2Ryb3BfdGFibGUudyA9IDE1MDtcbiAgICBzaXplLnZvbHRfZHJvcF90YWJsZS5oID0gMTAwO1xuICAgIGxvYy52b2x0X2Ryb3BfdGFibGUgPSB7fTtcbiAgICBsb2Mudm9sdF9kcm9wX3RhYmxlLnggPSBzaXplLmRyYXdpbmcudyAtIHNpemUudm9sdF9kcm9wX3RhYmxlLncvMiAtIDkwO1xuICAgIGxvYy52b2x0X2Ryb3BfdGFibGUueSA9IHNpemUuZHJhd2luZy5oIC0gc2l6ZS52b2x0X2Ryb3BfdGFibGUuaC8yIC0gMzA7XG5cblxuICAgIC8vIHZvbHRhZ2UgZHJvcCB0YWJsZVxuICAgIHNpemUuZ2VuZXJhbF9ub3RlcyA9IHt9O1xuICAgIHNpemUuZ2VuZXJhbF9ub3Rlcy53ID0gMTUwO1xuICAgIHNpemUuZ2VuZXJhbF9ub3Rlcy5oID0gMTAwO1xuICAgIGxvYy5nZW5lcmFsX25vdGVzID0ge307XG4gICAgbG9jLmdlbmVyYWxfbm90ZXMueCA9IHNpemUuZ2VuZXJhbF9ub3Rlcy53LzIgKyAzMDtcbiAgICBsb2MuZ2VuZXJhbF9ub3Rlcy55ID0gc2l6ZS5nZW5lcmFsX25vdGVzLmgvMiArIDMwO1xuXG5cblxuXG4gICAgc2V0dGluZ3MucGFnZXMgPSB7fTtcbiAgICBzZXR0aW5ncy5wYWdlcy5sZXR0ZXIgPSB7XG4gICAgICAgIHVuaXRzOiAnaW5jaGVzJyxcbiAgICAgICAgdzogMTEuMCxcbiAgICAgICAgaDogOC41LFxuICAgIH07XG4gICAgc2V0dGluZ3MucGFnZSA9IHNldHRpbmdzLnBhZ2VzLmxldHRlcjtcblxuICAgIHNldHRpbmdzLnBhZ2VzLlBERiA9IHtcbiAgICAgICAgdzogc2V0dGluZ3MucGFnZS53ICogNzIsXG4gICAgICAgIGg6IHNldHRpbmdzLnBhZ2UuaCAqIDcyLFxuICAgIH07XG5cbiAgICBzZXR0aW5ncy5wYWdlcy5QREYuc2NhbGUgPSB7XG4gICAgICAgIHg6IHNldHRpbmdzLnBhZ2VzLlBERi53IC8gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcudyxcbiAgICAgICAgeTogc2V0dGluZ3MucGFnZXMuUERGLmggLyBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy5oLFxuICAgIH07XG5cbiAgICBpZiggc2V0dGluZ3MucGFnZXMuUERGLnNjYWxlLnggPCBzZXR0aW5ncy5wYWdlcy5QREYuc2NhbGUueSApIHtcbiAgICAgICAgc2V0dGluZ3MucGFnZS5zY2FsZSA9IHNldHRpbmdzLnBhZ2VzLlBERi5zY2FsZS54O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNldHRpbmdzLnBhZ2Uuc2NhbGUgPSBzZXR0aW5ncy5wYWdlcy5QREYuc2NhbGUueTtcbiAgICB9XG5cblxuICAgIGxvYy5wcmV2aWV3ID0gbG9jLnByZXZpZXcgfHwge307XG4gICAgbG9jLnByZXZpZXcuYXJyYXkgPSBsb2MucHJldmlldy5hcnJheSA9IHt9O1xuICAgIGxvYy5wcmV2aWV3LmFycmF5LnRvcCA9IDEwMDtcbiAgICBsb2MucHJldmlldy5hcnJheS5sZWZ0ID0gNTA7XG5cbiAgICBsb2MucHJldmlldy5EQyA9IGxvYy5wcmV2aWV3LkRDID0ge307XG4gICAgbG9jLnByZXZpZXcuaW52ZXJ0ZXIgPSBsb2MucHJldmlldy5pbnZlcnRlciA9IHt9O1xuICAgIGxvYy5wcmV2aWV3LkFDID0gbG9jLnByZXZpZXcuQUMgPSB7fTtcblxuICAgIHNpemUucHJldmlldyA9IHNpemUucHJldmlldyB8fCB7fTtcbiAgICBzaXplLnByZXZpZXcubW9kdWxlID0ge1xuICAgICAgICB3OiAxNSxcbiAgICAgICAgaDogMjUsXG4gICAgfTtcbiAgICBzaXplLnByZXZpZXcuREMgPSB7XG4gICAgICAgIHc6IDMwLFxuICAgICAgICBoOiA1MCxcbiAgICB9O1xuICAgIHNpemUucHJldmlldy5pbnZlcnRlciA9IHtcbiAgICAgICAgdzogMTUwLFxuICAgICAgICBoOiA3NSxcbiAgICB9O1xuICAgIHNpemUucHJldmlldy5BQyA9IHtcbiAgICAgICAgdzogMzAsXG4gICAgICAgIGg6IDUwLFxuICAgIH07XG4gICAgc2l6ZS5wcmV2aWV3LmxvYWRjZW50ZXIgPSB7XG4gICAgICAgIHc6IDUwLFxuICAgICAgICBoOiAxMDAsXG4gICAgfTtcblxuXG5cbiAgcmV0dXJuIHNldHRpbmdzO1xuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBzZXR0aW5nc19kcmF3aW5nO1xuIiwiLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnblxuaWYgKCFPYmplY3QuYXNzaWduKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPYmplY3QsIFwiYXNzaWduXCIsIHtcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgdmFsdWU6IGZ1bmN0aW9uKHRhcmdldCwgZmlyc3RTb3VyY2UpIHtcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PT0gbnVsbClcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjb252ZXJ0IGZpcnN0IGFyZ3VtZW50IHRvIG9iamVjdFwiKTtcbiAgICAgIHZhciB0byA9IE9iamVjdCh0YXJnZXQpO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5leHRTb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGlmIChuZXh0U291cmNlID09PSB1bmRlZmluZWQgfHwgbmV4dFNvdXJjZSA9PT0gbnVsbCkgY29udGludWU7XG4gICAgICAgIHZhciBrZXlzQXJyYXkgPSBPYmplY3Qua2V5cyhPYmplY3QobmV4dFNvdXJjZSkpO1xuICAgICAgICBmb3IgKHZhciBuZXh0SW5kZXggPSAwLCBsZW4gPSBrZXlzQXJyYXkubGVuZ3RoOyBuZXh0SW5kZXggPCBsZW47IG5leHRJbmRleCsrKSB7XG4gICAgICAgICAgdmFyIG5leHRLZXkgPSBrZXlzQXJyYXlbbmV4dEluZGV4XTtcbiAgICAgICAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobmV4dFNvdXJjZSwgbmV4dEtleSk7XG4gICAgICAgICAgaWYgKGRlc2MgIT09IHVuZGVmaW5lZCAmJiBkZXNjLmVudW1lcmFibGUpIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRvO1xuICAgIH1cbiAgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vXG4vLyBmb250c1xuXG52YXIgZm9udHMgPSB7fTtcblxuZm9udHNbJ3NpZ25zJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICA1LFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ21pZGRsZScsXG59O1xuZm9udHNbJ2xhYmVsJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAxMixcbiAgICAndGV4dC1hbmNob3InOiAgICdtaWRkbGUnLFxufTtcbmZvbnRzWyd0aXRsZTEnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDE0LFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ2xlZnQnLFxufTtcbmZvbnRzWyd0aXRsZTInXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDEyLFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ2xlZnQnLFxufTtcbmZvbnRzWydwYWdlJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAyMCxcbiAgICAndGV4dC1hbmNob3InOiAgICdtaWRkbGUnLFxufTtcbmZvbnRzWyd0YWJsZSddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdzZXJpZicsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICA4LFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ21pZGRsZScsXG59O1xuZm9udHNbJ3RhYmxlX2xlZnQnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnc2VyaWYnLFxuICAgICdmb250LXNpemUnOiAgICAgOCxcbiAgICAndGV4dC1hbmNob3InOiAgICdsZWZ0Jyxcbn07XG5mb250c1sndGFibGVfbGFyZ2VfbGVmdCddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTQsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbGVmdCcsXG59O1xuZm9udHNbJ3RhYmxlX2xhcmdlJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAxNCxcbiAgICAndGV4dC1hbmNob3InOiAgICdtaWRkbGUnLFxufTtcbmZvbnRzWydwcm9qZWN0IHRpdGxlJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAxNixcbiAgICAndGV4dC1hbmNob3InOiAgICdtaWRkbGUnLFxufTtcbmZvbnRzWydwcmV2aWV3IHRleHQnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJyAgOiAyMCxcbiAgICAndGV4dC1hbmNob3InOiAnbWlkZGxlJyxcbn07XG5mb250c1snZGltZW50aW9uJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZScgIDogMjAsXG4gICAgJ3RleHQtYW5jaG9yJzogJ21pZGRsZScsXG59O1xuXG5cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gZm9udHM7XG4iLCIvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduXG5pZiAoIU9iamVjdC5hc3NpZ24pIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdCwgXCJhc3NpZ25cIiwge1xuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogZnVuY3Rpb24odGFyZ2V0LCBmaXJzdFNvdXJjZSkge1xuICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQgfHwgdGFyZ2V0ID09PSBudWxsKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNvbnZlcnQgZmlyc3QgYXJndW1lbnQgdG8gb2JqZWN0XCIpO1xuICAgICAgdmFyIHRvID0gT2JqZWN0KHRhcmdldCk7XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbmV4dFNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaWYgKG5leHRTb3VyY2UgPT09IHVuZGVmaW5lZCB8fCBuZXh0U291cmNlID09PSBudWxsKSBjb250aW51ZTtcbiAgICAgICAgdmFyIGtleXNBcnJheSA9IE9iamVjdC5rZXlzKE9iamVjdChuZXh0U291cmNlKSk7XG4gICAgICAgIGZvciAodmFyIG5leHRJbmRleCA9IDAsIGxlbiA9IGtleXNBcnJheS5sZW5ndGg7IG5leHRJbmRleCA8IGxlbjsgbmV4dEluZGV4KyspIHtcbiAgICAgICAgICB2YXIgbmV4dEtleSA9IGtleXNBcnJheVtuZXh0SW5kZXhdO1xuICAgICAgICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihuZXh0U291cmNlLCBuZXh0S2V5KTtcbiAgICAgICAgICBpZiAoZGVzYyAhPT0gdW5kZWZpbmVkICYmIGRlc2MuZW51bWVyYWJsZSkgdG9bbmV4dEtleV0gPSBuZXh0U291cmNlW25leHRLZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdG87XG4gICAgfVxuICB9KTtcbn1cblxuXG52YXIgbGF5ZXJfYXR0ciA9IHt9O1xuXG5sYXllcl9hdHRyLmJhc2UgPSB7XG4gICAgJ2ZpbGwnOiAnbm9uZScsXG4gICAgJ3N0cm9rZSc6JyMwMDAwMDAnLFxuICAgICdzdHJva2Utd2lkdGgnOicxcHgnLFxuICAgICdzdHJva2UtbGluZWNhcCc6J2J1dHQnLFxuICAgICdzdHJva2UtbGluZWpvaW4nOidtaXRlcicsXG4gICAgJ3N0cm9rZS1vcGFjaXR5JzoxLFxuXG59O1xubGF5ZXJfYXR0ci5ibG9jayA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuZnJhbWUgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLmZyYW1lLnN0cm9rZSA9ICcjMDAwMDQyJztcbmxheWVyX2F0dHIudGFibGUgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLnRhYmxlLnN0cm9rZSA9ICcjMDAwMDAwJztcblxubGF5ZXJfYXR0ci5EQ19pbnRlcm1vZHVsZSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpLHtcbiAgICBzdHJva2U6ICcjYmViZWJlJyxcbiAgICBcInN0cm9rZS1kYXNoYXJyYXlcIjogXCIxLCAxXCIsXG5cblxufSk7XG5cbmxheWVyX2F0dHIuRENfcG9zID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5EQ19wb3Muc3Ryb2tlID0gJyNmZjAwMDAnO1xubGF5ZXJfYXR0ci5EQ19uZWcgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkRDX25lZy5zdHJva2UgPSAnIzAwMDAwMCc7XG5sYXllcl9hdHRyLkRDX2dyb3VuZCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuRENfZ3JvdW5kLnN0cm9rZSA9ICcjMDA2NjAwJztcbmxheWVyX2F0dHIubW9kdWxlID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5ib3ggPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5cblxuXG5sYXllcl9hdHRyLnRleHQgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLnRleHQuc3Ryb2tlID0gJyMwMDAwZmYnO1xubGF5ZXJfYXR0ci50ZXJtaW5hbCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuYm9yZGVyID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xuXG5sYXllcl9hdHRyLkFDX2dyb3VuZCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuQUNfZ3JvdW5kLnN0cm9rZSA9ICcjMDA5OTAwJztcbmxheWVyX2F0dHIuQUNfbmV1dHJhbCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuQUNfbmV1dHJhbC5zdHJva2UgPSAnIzk5OTc5Nyc7XG5sYXllcl9hdHRyLkFDX0wxID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5BQ19MMS5zdHJva2UgPSAnIzAwMDAwMCc7XG5sYXllcl9hdHRyLkFDX0wyID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5BQ19MMi5zdHJva2UgPSAnI0ZGMDAwMCc7XG5sYXllcl9hdHRyLkFDX0wzID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5BQ19MMy5zdHJva2UgPSAnIzAwMDBGRic7XG5cblxubGF5ZXJfYXR0ci5wcmV2aWV3ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSkse1xuICAgICdzdHJva2Utd2lkdGgnOiAnMicsXG59KTtcblxubGF5ZXJfYXR0ci5wcmV2aWV3X21vZHVsZSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnI2ZmYjMwMCcsXG4gICAgc3Ryb2tlOiAnbm9uZScsXG59KTtcblxubGF5ZXJfYXR0ci5wcmV2aWV3X2FycmF5ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIHN0cm9rZTogJyNmZjVkMDAnLFxufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19EQyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6ICcjYjA5MmM0Jyxcbn0pO1xubGF5ZXJfYXR0ci5wcmV2aWV3X0RDX2JveCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnI2IwOTJjNCcsXG4gICAgc3Ryb2tlOiAnbm9uZScsXG59KTtcblxubGF5ZXJfYXR0ci5wcmV2aWV3X2ludmVydGVyID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIHN0cm9rZTonIzg2Yzk3NCcsXG59KTtcbmxheWVyX2F0dHIucHJldmlld19pbnZlcnRlcl9ib3ggPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyM4NmM5NzQnLFxuICAgIHN0cm9rZTogJ25vbmUnLFxufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19BQyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6ICcjODE4OGExJyxcbn0pO1xuXG5sYXllcl9hdHRyLnByZXZpZXdfQUNfYm94ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjODE4OGExJyxcbiAgICBzdHJva2U6ICdub25lJyxcbn0pO1xuXG5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6ICcjMDAwMDAwJyxcbn0pO1xubGF5ZXJfYXR0ci5wcmV2aWV3X3N0cnVjdHVyYWxfZG90ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIHN0cm9rZTogJyMwMDAwMDAnLFxuICAgIFwic3Ryb2tlLWRhc2hhcnJheVwiOiBcIjUsIDVcIlxufSk7XG5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3Vuc2VsZWN0ZWQgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyNlMWUxZTEnLFxuICAgIHN0cm9rZTogJ25vbmUnXG59KTtcbmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX3BvbHlfc2VsZWN0ZWQgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyNmZmU3Y2InLFxuICAgIHN0cm9rZTogJ25vbmUnXG59KTtcbmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX3BvbHlfc2VsZWN0ZWRfZnJhbWVkID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjZmZlN2NiJyxcbiAgICBzdHJva2U6ICcjMDAwMDAwJ1xufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnI2ZmZmZmZicsXG4gICAgc3Ryb2tlOiAnbm9uZSdcbn0pO1xubGF5ZXJfYXR0ci5wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjODM5N2U4JyxcbiAgICBzdHJva2U6ICcjZGZmYWZmJ1xufSk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBsYXllcl9hdHRyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgayA9IHJlcXVpcmUoJy4uL2xpYi9rL2suanMnKTtcbnZhciBmID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMnKTtcbi8vdmFyIG1rX2RyYXdpbmcgPSByZXF1aXJlKCcuL21rX2RyYXdpbmcnKTtcbi8vdmFyIGRpc3BsYXlfc3ZnID0gcmVxdWlyZSgnLi9kaXNwbGF5X3N2ZycpO1xuXG52YXIgb2JqZWN0X2RlZmluZWQgPSBmLm9iamVjdF9kZWZpbmVkO1xuXG52YXIgc2V0dGluZ3NfdXBkYXRlID0gZnVuY3Rpb24oc2V0dGluZ3MpIHtcblxuICAgIC8vY29uc29sZS5sb2coJy0tLXNldHRpbmdzLS0tJywgc2V0dGluZ3MpO1xuICAgIHZhciBjb25maWdfb3B0aW9ucyA9IHNldHRpbmdzLmNvbmZpZ19vcHRpb25zO1xuICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgIHZhciBzdGF0ZSA9IHNldHRpbmdzLnN0YXRlO1xuXG4gICAgdmFyIGlucHV0cyA9IHNldHRpbmdzLmlucHV0cztcblxuXG5cblxuXG4gICAgaWYoIHN0YXRlLmRhdGFiYXNlX2xvYWRlZCApe1xuICAgICAgICBpbnB1dHMuREMgPSBzZXR0aW5ncy5pbnB1dHMuREMgfHwge307XG4gICAgICAgIGlucHV0cy5EQy53aXJlX3NpemUgPSBzZXR0aW5ncy5pbnB1dHMuREMud2lyZV9zaXplIHx8IHt9O1xuICAgICAgICBpbnB1dHMuREMud2lyZV9zaXplLm9wdGlvbnMgPSBpbnB1dHMuREMud2lyZV9zaXplLm9wdGlvbnMgfHwgay5vYmpfbmFtZXMoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuTkVDX3RhYmxlc1snQ2ggOSBUYWJsZSA4IENvbmR1Y3RvciBQcm9wZXJ0aWVzJ10pO1xuXG5cbiAgICB9XG5cbiAgICAvL3ZhciBzaG93X2RlZmF1bHRzID0gZmFsc2U7XG4gICAgLy8vKlxuICAgIGlmKCBzdGF0ZS5tb2RlID09PSAnZGV2Jyl7XG4gICAgICAgIC8vc2hvd19kZWZhdWx0cyA9IHRydWU7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ0RldiBtb2RlIC0gZGVmYXVsdHMgb24nKTtcblxuICAgICAgICBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgPSBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgfHwgNDtcbiAgICAgICAgc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZyA9IHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgfHwgNjtcbiAgICAgICAgc3lzdGVtLkRDLmhvbWVfcnVuX2xlbmd0aCA9IHN5c3RlbS5EQy5ob21lX3J1bl9sZW5ndGggfHwgNTA7XG5cbiAgICAgICAgc3lzdGVtLnJvb2Yud2lkdGggID0gc3lzdGVtLnJvb2Yud2lkdGggfHwgMjU7XG4gICAgICAgIHN5c3RlbS5yb29mLmxlbmd0aCA9IHN5c3RlbS5yb29mLmxlbmd0aCB8fCAxNTtcbiAgICAgICAgc3lzdGVtLnJvb2Yuc2xvcGUgID0gc3lzdGVtLnJvb2Yuc2xvcGUgfHwgXCI2OjEyXCI7XG4gICAgICAgIHN5c3RlbS5yb29mLnR5cGUgPSBzeXN0ZW0ucm9vZi50eXBlIHx8IFwiR2FibGVcIjtcblxuICAgICAgICBzeXN0ZW0ubW9kdWxlLm9yaWVudGF0aW9uID0gc3lzdGVtLm1vZHVsZS5vcmllbnRhdGlvbiB8fCBcIlBvcnRyYWl0XCI7XG4gICAgICAgIHN5c3RlbS5tb2R1bGUud2lkdGggPSBzeXN0ZW0ubW9kdWxlLndpZHRoIHx8IDMwO1xuICAgICAgICBzeXN0ZW0ubW9kdWxlLmxlbmd0aCA9IHN5c3RlbS5tb2R1bGUubGVuZ3RoIHx8IDUwO1xuXG5cbiAgICAgICAgaWYoIHN0YXRlLmRhdGFiYXNlX2xvYWRlZCApe1xuICAgICAgICAgICAgc3lzdGVtLmludmVydGVyLm1ha2UgPSBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSB8fFxuICAgICAgICAgICAgICAgICdTTUEnO1xuICAgICAgICAgICAgc3lzdGVtLmludmVydGVyLm1vZGVsID0gc3lzdGVtLmludmVydGVyLm1vZGVsIHx8XG4gICAgICAgICAgICAgICAgJ1NJMzAwMCc7XG5cbiAgICAgICAgICAgIHN5c3RlbS5tb2R1bGUubWFrZSA9IHN5c3RlbS5tb2R1bGUubWFrZSB8fFxuICAgICAgICAgICAgICAgIGYub2JqX25hbWVzKCBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXMgKVswXTtcbiAgICAgICAgICAgIC8vaWYoIHN5c3RlbS5tb2R1bGUubWFrZSkgc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlTW9kZWxBcnJheSA9IGsub2JqSWRBcnJheShzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVzW3N5c3RlbS5tb2R1bGUubWFrZV0pO1xuICAgICAgICAgICAgc3lzdGVtLm1vZHVsZS5tb2RlbCA9IHN5c3RlbS5tb2R1bGUubW9kZWwgfHxcbiAgICAgICAgICAgICAgICBmLm9ial9uYW1lcyggc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzW3N5c3RlbS5tb2R1bGUubWFrZV0gKVswXTtcblxuXG4gICAgICAgICAgICBzeXN0ZW0ubW9kdWxlLm1vZGVsID0gc3lzdGVtLm1vZHVsZS5tb2RlbCB8fFxuICAgICAgICAgICAgICAgIGYub2JqX25hbWVzKCBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbc3lzdGVtLm1vZHVsZS5tYWtlXSApWzBdO1xuXG4gICAgICAgICAgICBzeXN0ZW0uQUMubG9hZGNlbnRlcl90eXBlcyA9IHN5c3RlbS5BQy5sb2FkY2VudGVyX3R5cGVzIHx8XG4gICAgICAgICAgICAvLyAgICBmLm9ial9uYW1lcyhpbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlcylbMF07XG4gICAgICAgICAgICAgICAgJzQ4MC8yNzdWJztcblxuXG4gICAgICAgICAgICBzeXN0ZW0uQUMudHlwZSA9IHN5c3RlbS5BQy50eXBlIHx8ICc0ODBWIFd5ZSc7XG4gICAgICAgICAgICAvL3N5c3RlbS5BQy50eXBlID0gc3lzdGVtLkFDLnR5cGUgfHxcbiAgICAgICAgICAgIC8vICAgIHN5c3RlbS5BQy5sb2FkY2VudGVyX3R5cGVzW3N5c3RlbS5BQy5sb2FkY2VudGVyX3R5cGVzXVswXTtcblxuICAgICAgICAgICAgc3lzdGVtLkFDLmRpc3RhbmNlX3RvX2xvYWRjZW50ZXIgPSBzeXN0ZW0uQUMuZGlzdGFuY2VfdG9fbG9hZGNlbnRlciB8fFxuICAgICAgICAgICAgICAgIDUwO1xuXG5cbiAgICAgICAgICAgIHN5c3RlbS5EQy53aXJlX3NpemUgPSBpbnB1dHMuREMud2lyZV9zaXplLm9wdGlvbnNbM107XG4gICAgICAgICAgICAvKlxuXG4gICAgICAgICAgICBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlck1ha2VBcnJheSA9IGsub2JqSWRBcnJheShzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnMpO1xuICAgICAgICAgICAgc3lzdGVtLmludmVydGVyLm1ha2UgPSBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSB8fCBPYmplY3Qua2V5cyggc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzIClbMF07XG4gICAgICAgICAgICBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlck1vZGVsQXJyYXkgPSBrLm9iaklkQXJyYXkoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzW3N5c3RlbS5pbnZlcnRlci5tYWtlXSk7XG5cbiAgICAgICAgICAgIHN5c3RlbS5BQ19sb2FkY2VudGVyX3R5cGUgPSBzeXN0ZW0uQUNfbG9hZGNlbnRlcl90eXBlIHx8IGNvbmZpZ19vcHRpb25zLkFDX2xvYWRjZW50ZXJfdHlwZV9vcHRpb25zWzBdO1xuICAgICAgICAgICAgLy8qL1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vKi9cblxuXG4gICAgLy9jb25zb2xlLmxvZyhcInNldHRpbmdzX3VwZGF0ZVwiKTtcbiAgICAvL2NvbnNvbGUubG9nKHN5c3RlbS5tb2R1bGUubWFrZSk7XG5cbiAgICBpbnB1dHMubW9kdWxlLm1ha2Uub3B0aW9ucyA9IGsub2JqX25hbWVzKHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlcyk7XG4gICAgaWYoIHN5c3RlbS5tb2R1bGUubWFrZSApIHtcbiAgICAgICAgaW5wdXRzLm1vZHVsZS5tb2RlbC5vcHRpb25zICA9IGsub2JqX25hbWVzKCBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbc3lzdGVtLm1vZHVsZS5tYWtlXSApO1xuICAgIH1cblxuICAgIGlmKCBzeXN0ZW0ubW9kdWxlLm1vZGVsICkge1xuICAgICAgICB2YXIgc3BlY3MgPSBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbc3lzdGVtLm1vZHVsZS5tYWtlXVtzeXN0ZW0ubW9kdWxlLm1vZGVsXTtcbiAgICAgICAgZm9yKCB2YXIgc3BlY19uYW1lIGluIHNwZWNzICl7XG4gICAgICAgICAgICBpZiggc3BlY19uYW1lICE9PSAnbW9kdWxlX2lkJyApe1xuICAgICAgICAgICAgICAgIHN5c3RlbS5tb2R1bGVbc3BlY19uYW1lXSA9IHNwZWNzW3NwZWNfbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy9zeXN0ZW0ubW9kdWxlLnNwZWNzID0gc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzW3N5c3RlbS5tb2R1bGUubWFrZV1bc3lzdGVtLm1vZHVsZS5tb2RlbF07XG4gICAgfVxuXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdhcnJheScpICYmIGYuc2VjdGlvbl9kZWZpbmVkKCdtb2R1bGUnKSApe1xuICAgICAgICBzeXN0ZW0uYXJyYXkgPSBzeXN0ZW0uYXJyYXkgfHwge307XG4gICAgICAgIHN5c3RlbS5hcnJheS5pc2MgPSBzeXN0ZW0ubW9kdWxlLmlzYyAqIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncztcbiAgICAgICAgc3lzdGVtLmFycmF5LnZvYyA9IHN5c3RlbS5tb2R1bGUudm9jICogc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZztcbiAgICAgICAgc3lzdGVtLmFycmF5LmltcCA9IHN5c3RlbS5tb2R1bGUuaW1wICogc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzO1xuICAgICAgICBzeXN0ZW0uYXJyYXkudm1wID0gc3lzdGVtLm1vZHVsZS52bXAgKiBzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nO1xuICAgICAgICBzeXN0ZW0uYXJyYXkucG1wID0gc3lzdGVtLmFycmF5LnZtcCAgKiBzeXN0ZW0uYXJyYXkuaW1wO1xuXG4gICAgICAgIHN5c3RlbS5hcnJheS5udW1iZXJfb2ZfbW9kdWxlcyA9IHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgKiBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3M7XG5cblxuICAgIH1cblxuXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdEQycpICl7XG5cbiAgICAgICAgc3lzdGVtLkRDLndpcmVfc2l6ZSA9IFwiLVVuZGVmaW5lZC1cIjtcblxuICAgIH1cblxuICAgIGlucHV0cy5pbnZlcnRlci5tYWtlLm9wdGlvbnMgPSBrLm9ial9uYW1lcyhzZXR0aW5ncy5jb21wb25lbnRzLmludmVydGVycyk7XG4gICAgaWYoIHN5c3RlbS5pbnZlcnRlci5tYWtlICkge1xuICAgICAgICBpbnB1dHMuaW52ZXJ0ZXIubW9kZWwub3B0aW9ucyA9IGsub2JqX25hbWVzKCBzZXR0aW5ncy5jb21wb25lbnRzLmludmVydGVyc1tzeXN0ZW0uaW52ZXJ0ZXIubWFrZV0gKTtcbiAgICB9XG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdpbnZlcnRlcicpICl7XG5cbiAgICB9XG5cbiAgICAvL2lucHV0cy5BQy5sb2FkY2VudGVyX3R5cGUgPSBzZXR0aW5ncy5mLm9ial9uYW1lcyhpbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlcyk7XG4gICAgaWYoIHN5c3RlbS5BQy5sb2FkY2VudGVyX3R5cGVzICkge1xuICAgICAgICB2YXIgbG9hZGNlbnRlcl90eXBlID0gc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXM7XG4gICAgICAgIHZhciBBQ19vcHRpb25zID0gaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbbG9hZGNlbnRlcl90eXBlXTtcbiAgICAgICAgaW5wdXRzLkFDLnR5cGUub3B0aW9ucyA9IEFDX29wdGlvbnM7XG4gICAgICAgIC8vaW4ub3B0LkFDLnR5cGVzW2xvYWRjZW50ZXJfdHlwZV07XG5cbiAgICAgICAgLy9pbnB1dHMuQUNbJ3R5cGUnXSA9IGsub2JqX25hbWVzKCBzZXR0aW5ncy5pbi5vcHQuQUMudHlwZSApO1xuICAgIH1cbiAgICBpZiggc3lzdGVtLkFDLnR5cGUgKSB7XG4gICAgICAgIHN5c3RlbS5BQy5jb25kdWN0b3JzID0gc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzW3N5c3RlbS5BQy50eXBlXTtcbiAgICAgICAgc3lzdGVtLkFDLm51bV9jb25kdWN0b3JzID0gc3lzdGVtLkFDLmNvbmR1Y3RvcnMubGVuZ3RoO1xuXG4gICAgfVxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnQUMnKSApe1xuXG4gICAgICAgIHN5c3RlbS5BQy53aXJlX3NpemUgPSBcIi1VbmRlZmluZWQtXCI7XG4gICAgfVxuXG4gICAgc2l6ZS53aXJlX29mZnNldC5tYXggPSBzaXplLndpcmVfb2Zmc2V0Lm1pbiArIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyAqIHNpemUud2lyZV9vZmZzZXQuYmFzZTtcbiAgICBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCA9IHNpemUud2lyZV9vZmZzZXQubWF4ICsgc2l6ZS53aXJlX29mZnNldC5iYXNlKjE7XG4gICAgbG9jLmFycmF5LmxlZnQgPSBsb2MuYXJyYXkucmlnaHQgLSAoIHNpemUuc3RyaW5nLncgKiBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgKSAtICggc2l6ZS5tb2R1bGUuZnJhbWUudyozLzQgKSA7XG5cblxuXG5cblxuXG5cblxuXG4gICAgLypcbiAgICAvL3NldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS53aXJlX3RhYmxlLmggPSAoc3lzdGVtLkFDLm51bV9jb25kdWN0b3JzKzMpICogc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLndpcmVfdGFibGUucm93X2g7XG4gICAgZm9yKCB2YXIgc2VjdGlvbl9uYW1lIGluIGlucHV0cyApe1xuICAgICAgICBmb3IoIHZhciBpbnB1dF9uYW1lIGluIHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdICl7XG4gICAgICAgICAgICBpZiggdHlwZW9mIHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdID09PSAnc3RyaW5nJyApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSApO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBrLm9ial9uYW1lcyhcbiAgICAgICAgICAgICAgICAgICAgZi5nZXRfcmVmKHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdLCBzZXR0aW5ncylcbiAgICAgICAgICAgICAgICApKTtcblxuICAgICAgICAgICAgICAgIHZhciB0b19ldmFsID0gXCJrLm9ial9uYW1lcyhzZXR0dGluZ3MuXCIgKyBzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSArIFwiKVwiO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRvX2V2YWwpO1xuICAgICAgICAgICAgICAgIC8vIGV2YWwgaXMgb25seSBiZWluZyB1c2VkIG9uIHN0cmluZ3MgZGVmaW5lZCBpbiB0aGUgc2V0dGluZ3MuanNvbiBmaWxlIHRoYXQgaXMgYnVpbHQgaW50byB0aGUgYXBwbGljYXRpb25cbiAgICAgICAgICAgICAgICAvKiBqc2hpbnQgZXZpbDp0cnVlIC8vKi9cbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBMb29rIGZvciBhbHRlcm5hdGl2ZSBzb2x1dGlvbnMgdGhhdCBpcyBtb3JlIHVuaXZlcnNhbC5cbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vcGVyZmVjdGlvbmtpbGxzLmNvbS9nbG9iYWwtZXZhbC13aGF0LWFyZS10aGUtb3B0aW9ucy8jaW5kaXJlY3RfZXZhbF9jYWxsX2V4YW1wbGVzXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICB2YXIgZSA9IGV2YWw7IC8vIFRoaXMgYWxsb3dzIGV2YWwgdG8gYmUgY2FsbGVkIGluZGlyZWN0bHksIHRyaWdnZXJpbmcgYSBnbG9iYWwgY2FsbCBpbiBtb2Rlcm4gYnJvd3NlcnMuXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0gPSBlKHRvX2V2YWwpO1xuICAgICAgICAgICAgICAgIC8qIGpzaGludCBldmlsOmZhbHNlIC8vKi9cbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8qL1xuXG59O1xuXG4vKlxuXG4gICAgaWYoIHN0YXRlLmRhdGFfbG9hZGVkICkge1xuXG4gICAgICAgIC8vc3lzdGVtLkRDLm51bV9zdHJpbmdzID0gc2V0dGluZ3Muc3lzdGVtLm51bV9zdHJpbmdzO1xuICAgICAgICAvL3N5c3RlbS5EQy5udW1fbW9kdWxlID0gc2V0dGluZ3Muc3lzdGVtLm51bV9tb2R1bGU7XG4gICAgICAgIC8vaWYoIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZXMgIT09IHVuZGVmaW5lZCApe1xuXG4gICAgICAgIHZhciBvbGRfYWN0aXZlX3NlY3Rpb24gPSBzdGF0ZS5hY3RpdmVfc2VjdGlvbjtcblxuICAgICAgICAvLyBNb2R1bGVzXG4gICAgICAgIGlmKCB0cnVlICl7XG4gICAgICAgICAgICBmLm9iamVjdF9kZWZpbmVkKHN5c3RlbS5EQy5tb2R1bGUpO1xuXG4gICAgICAgICAgICBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVNYWtlQXJyYXkgPSBrLm9iaklkQXJyYXkoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlcyk7XG4gICAgICAgICAgICBpZiggc3lzdGVtLkRDLm1vZHVsZS5tYWtlICkgc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlTW9kZWxBcnJheSA9IGsub2JqSWRBcnJheShzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVzW3N5c3RlbS5EQy5tb2R1bGUubWFrZV0pO1xuICAgICAgICAgICAgaWYoIHN5c3RlbS5EQy5tb2R1bGUubW9kZWwgKSBzeXN0ZW0uREMubW9kdWxlLnNwZWNzID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlc1tzeXN0ZW0uREMubW9kdWxlLm1ha2VdW3N5c3RlbS5EQy5tb2R1bGUubW9kZWxdO1xuXG4gICAgICAgICAgICBzdGF0ZS5hY3RpdmVfc2VjdGlvbiA9ICdhcnJheSc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBcnJheVxuICAgICAgICBpZiggb2JqZWN0X2RlZmluZWQoaW5wdXQubW9kdWxlKSApIHtcbiAgICAgICAgICAgIC8vc3lzdGVtLm1vZHVsZSA9IHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZXNbc2V0dGluZ3MuZi5tb2R1bGVdO1xuICAgICAgICAgICAgaWYoIHN5c3RlbS5EQy5tb2R1bGUuc3BlY3MgKXtcbiAgICAgICAgICAgICAgICBzeXN0ZW0uREMuYXJyYXkgPSB7fTtcbiAgICAgICAgICAgICAgICBzeXN0ZW0uREMuYXJyYXkuSXNjID0gc3lzdGVtLkRDLm1vZHVsZS5zcGVjcy5Jc2MgKiBzeXN0ZW0uREMubnVtX3N0cmluZ3M7XG4gICAgICAgICAgICAgICAgc3lzdGVtLkRDLmFycmF5LlZvYyA9IHN5c3RlbS5EQy5tb2R1bGUuc3BlY3MuVm9jICogc3lzdGVtLkRDLnN0cmluZ19tb2R1bGVzO1xuICAgICAgICAgICAgICAgIHN5c3RlbS5EQy5hcnJheS5JbXAgPSBzeXN0ZW0uREMubW9kdWxlLnNwZWNzLkltcCAqIHN5c3RlbS5EQy5udW1fc3RyaW5ncztcbiAgICAgICAgICAgICAgICBzeXN0ZW0uREMuYXJyYXkuVm1wID0gc3lzdGVtLkRDLm1vZHVsZS5zcGVjcy5WbXAgKiBzeXN0ZW0uREMuc3RyaW5nX21vZHVsZXM7XG4gICAgICAgICAgICAgICAgc3lzdGVtLkRDLmFycmF5LlBtcCA9IHN5c3RlbS5EQy5hcnJheS5WbXAgKiBzeXN0ZW0uREMuYXJyYXkuSW1wO1xuXG4gICAgICAgICAgICAgICAgc3RhdGUuYWN0aXZlX3NlY3Rpb24gPSAnREMnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBEQ1xuICAgICAgICAgICAgaWYoIG9iamVjdF9kZWZpbmVkKGlucHV0cy5EQykgKSB7XG5cbiAgICAgICAgICAgICAgICBzeXN0ZW0uREMuaG9tZXJ1bi5yZXNpc3RhbmNlID0gY29uZmlnX29wdGlvbnMuTkVDX3RhYmxlc1snQ2ggOSBUYWJsZSA4IENvbmR1Y3RvciBQcm9wZXJ0aWVzJ11bc3lzdGVtLkRDLmhvbWVydW4uQVdHXTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5zZWN0aW9ucy5pbnZlcnRlci5yZWFkeSA9IHRydWU7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWN0aXZlX3NlY3Rpb24gPSAnaW52ZXJ0ZXInO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJbnZlcnRlclxuICAgICAgICAgICAgaWYoIG9iamVjdF9kZWZpbmVkKGlucHV0cy5EQykgKSB7XG5cbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlck1ha2VBcnJheSA9IGsub2JqSWRBcnJheShzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnMpO1xuICAgICAgICAgICAgICAgIGlmKCBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSApIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJNb2RlbEFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyc1tzeXN0ZW0uaW52ZXJ0ZXIubWFrZV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiggc3lzdGVtLmludmVydGVyLm1vZGVsICkgc3lzdGVtLmludmVydGVyLnNwZWNzID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzW3N5c3RlbS5pbnZlcnRlci5tYWtlXVtzeXN0ZW0uaW52ZXJ0ZXIubW9kZWxdO1xuXG4gICAgICAgICAgICAgICAgc3RhdGUuYWN0aXZlX3NlY3Rpb24gPSAnQUMnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBQ1xuICAgICAgICAgICAgaWYoIG9iamVjdF9kZWZpbmVkKGlucHV0cy5pbnZlcnRlcikgKSB7XG4gICAgICAgICAgICAgICAgaWYoIHN5c3RlbS5BQ19sb2FkY2VudGVyX3R5cGUgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgc3lzdGVtLkFDX3R5cGVzX2F2YWlsaWJsZSA9IGNvbmZpZ19vcHRpb25zLkFDX2xvYWRjZW50ZXJfdHlwZXNbc3lzdGVtLkFDX2xvYWRjZW50ZXJfdHlwZV07XG5cbiAgICAgICAgICAgICAgICAgICAgY29uZmlnX29wdGlvbnMuQUNfdHlwZV9vcHRpb25zLmZvckVhY2goIGZ1bmN0aW9uKCBlbGVtLCBpZCApe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoICEgKGVsZW0gaW4gc3lzdGVtLkFDX3R5cGVzX2F2YWlsaWJsZSkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnX29wdGlvbnMuQUNfdHlwZV9vcHRpb25zLnNwbGljZShpZCwgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9zeXN0ZW0uQUMudHlwZSA9IHNldHRpbmdzLnN5c3RlbS5BQ190eXBlO1xuICAgICAgICAgICAgICAgICAgICBzeXN0ZW0uQUNfY29uZHVjdG9ycyA9IHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLkFDX3R5cGVzW3N5c3RlbS5BQ190eXBlXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYoIG9iamVjdF9kZWZpbmVkKGlucHV0cy5BQykgKSB7XG4gICAgICAgICAgICAgICAgc3RhdGUuYWN0aXZlX3NlY3Rpb24gPSBvbGRfYWN0aXZlX3NlY3Rpb247XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNpemUud2lyZV9vZmZzZXQubWF4ID0gc2l6ZS53aXJlX29mZnNldC5taW4gKyBzeXN0ZW0uREMubnVtX3N0cmluZ3MgKiBzaXplLndpcmVfb2Zmc2V0LmJhc2U7XG4gICAgICAgICAgICBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCA9IHNpemUud2lyZV9vZmZzZXQubWF4ICsgc2l6ZS53aXJlX29mZnNldC5iYXNlKjE7XG5cbiAgICAgICAgICAgIGxvYy5hcnJheS5sZWZ0ID0gbG9jLmFycmF5LnJpZ2h0IC0gKCBzaXplLnN0cmluZy53ICogc3lzdGVtLkRDLm51bV9zdHJpbmdzICkgLSAoIHNpemUubW9kdWxlLmZyYW1lLncqMy80ICkgO1xuXG4gICAgICAgICAgICAvL3JldHVybiBzZXR0aW5ncztcblxuICAgICAgICB9XG4gICAgfVxufTtcblxuLy8qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNldHRpbmdzX3VwZGF0ZTtcbiIsIm1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPXtcblxuICAgIFwiTkVDIDI1MC4xMjJfaGVhZGVyXCI6IFtcIkFtcFwiLFwiQVdHXCJdLFxuICAgIFwiTkVDIDI1MC4xMjJcIjoge1xuICAgICAgICBcIjE1XCI6XCIxNFwiLFxuICAgICAgICBcIjIwXCI6XCIxMlwiLFxuICAgICAgICBcIjMwXCI6XCIxMFwiLFxuICAgICAgICBcIjQwXCI6XCIxMFwiLFxuICAgICAgICBcIjYwXCI6XCIxMFwiLFxuICAgICAgICBcIjEwMFwiOlwiOFwiLFxuICAgICAgICBcIjIwMFwiOlwiNlwiLFxuICAgICAgICBcIjMwMFwiOlwiNFwiLFxuICAgICAgICBcIjQwMFwiOlwiM1wiLFxuICAgICAgICBcIjUwMFwiOlwiMlwiLFxuICAgICAgICBcIjYwMFwiOlwiMVwiLFxuICAgICAgICBcIjgwMFwiOlwiMS8wXCIsXG4gICAgICAgIFwiMTAwMFwiOlwiMi8wXCIsXG4gICAgICAgIFwiMTIwMFwiOlwiMy8wXCIsXG4gICAgICAgIFwiMTYwMFwiOlwiNC8wXCIsXG4gICAgICAgIFwiMjAwMFwiOlwiMjUwXCIsXG4gICAgICAgIFwiMjUwMFwiOlwiMzUwXCIsXG4gICAgICAgIFwiMzAwMFwiOlwiNDAwXCIsXG4gICAgICAgIFwiNDAwMFwiOlwiNTAwXCIsXG4gICAgICAgIFwiNTAwMFwiOlwiNzAwXCIsXG4gICAgICAgIFwiNjAwMFwiOlwiODAwXCIsXG4gICAgfSxcblxuICAgIFwiTkVDIFQ2OTAuN19oZWFkZXJcIjogW1wiQW1iaWVudCBUZW1wZXJhdHVyZSAoQylcIiwgXCJDb3JyZWN0aW9uIEZhY3RvclwiXSxcbiAgICBcIk5FQyBUNjkwLjdcIjoge1xuICAgICAgICBcIjI1IHRvIDIwXCI6XCIxLjAyXCIsXG4gICAgICAgIFwiMTkgdG8gMTVcIjpcIjEuMDRcIixcbiAgICAgICAgXCIxNSB0byAxMFwiOlwiMS4wNlwiLFxuICAgICAgICBcIjkgdG8gNVwiOlwiMS4wOFwiLFxuICAgICAgICBcIjQgdG8gMFwiOlwiMS4xMFwiLFxuICAgICAgICBcIi0xIHRvIC01XCI6XCIxLjEyXCIsXG4gICAgICAgIFwiLTYgdG8gLTEwXCI6XCIxLjE0XCIsXG4gICAgICAgIFwiLTExIHRvIC0xNVwiOlwiMS4xNlwiLFxuICAgICAgICBcIi0xNiB0byAtMjBcIjpcIjEuMThcIixcbiAgICAgICAgXCItMjEgdG8gLTI1XCI6XCIxLjIwXCIsXG4gICAgICAgIFwiLTI2IHRvIC0zMFwiOlwiMS4yMVwiLFxuICAgICAgICBcIi0zMSB0byAtMzVcIjpcIjEuMjNcIixcbiAgICAgICAgXCItMzYgdG8gLTQwXCI6XCIxLjI1XCIsXG4gICAgfSxcblxuICAgIFwiQ2ggOSBUYWJsZSA4IENvbmR1Y3RvciBQcm9wZXJ0aWVzX2hlYWRlclwiOiBbXCJTaXplXCIsXCJvaG0va2Z0XCJdLFxuICAgIFwiQ2ggOSBUYWJsZSA4IENvbmR1Y3RvciBQcm9wZXJ0aWVzXCI6IHtcbiAgICAgICAgXCIjMDFcIjpcIiAwLjE1NFwiLFxuICAgICAgICBcIiMwMS8wXCI6XCIwLjEyMlwiLFxuICAgICAgICBcIiMwMlwiOlwiMC4xOTRcIixcbiAgICAgICAgXCIjMDIvMFwiOlwiMC4wOTY3XCIsXG4gICAgICAgIFwiIzAzXCI6XCIwLjI0NVwiLFxuICAgICAgICBcIiMwMy8wXCI6XCIwLjA3NjZcIixcbiAgICAgICAgXCIjMDRcIjpcIjAuMzA4XCIsXG4gICAgICAgIFwiIzA0LzBcIjpcIjAuMDYwOFwiLFxuICAgICAgICBcIiMwNlwiOlwiMC40OTFcIixcbiAgICAgICAgXCIjMDhcIjpcIjAuNzc4XCIsXG4gICAgICAgIFwiIzEwXCI6XCIxLjI0XCIsXG4gICAgICAgIFwiIzEyXCI6XCIxLjk4XCIsXG4gICAgICAgIFwiIzE0XCI6XCIzLjE0XCIsXG4gICAgfVxufVxuIiwiLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIFRoaXMgaXMgdGhlIGsgamF2YXNjcmlwdCBsaWJyYXJ5XHJcbi8vIGEgY29sbGVjdGlvbiBvZiBmdW5jdGlvbnMgdXNlZCBieSBrc2hvd2FsdGVyXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLy92YXIgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XHJcbi8vdmFyICQgPSByZXF1aXJlKCcuL2tfRE9NLmpzJyk7XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIE1pc2MuIHZhcmlhYmxlcyAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbi8vIGxvZyBzaG9ydGN1dFxyXG52YXIgbG9nT2JqID0gZnVuY3Rpb24ob2JqKXtcclxuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KG9iaikpXHJcbn1cclxudmFyIGxvZ09iakZ1bGwgPSBmdW5jdGlvbihvYmope1xyXG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkob2JqLCBudWxsLCA0KSlcclxufVxyXG5cclxuLy8gfiBwYWdlIGxvYWQgdGltZVxyXG52YXIgYm9vdF90aW1lID0gbW9tZW50KClcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBTdGFydCBvZiBsaWJhcnkgb2JqZWN0ICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG52YXIgayA9IHt9XHJcblxyXG5cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gSmF2YXNyaXB0IGZ1bmN0aW9ucyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcblxyXG5rLm9ial9leHRlbmQgPSBmdW5jdGlvbihvYmosIHByb3BzKSB7XHJcbiAgICBmb3IodmFyIHByb3AgaW4gcHJvcHMpIHtcclxuICAgICAgICBpZihwcm9wcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgICAgICBvYmpbcHJvcF0gPSBwcm9wc1twcm9wXVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuay5vYmpfcmVuYW1lID0gZnVuY3Rpb24ob2JqLCBvbGRfbmFtZSwgbmV3X25hbWUpe1xyXG4gICAgLy8gQ2hlY2sgZm9yIHRoZSBvbGQgcHJvcGVydHkgbmFtZSB0byBhdm9pZCBhIFJlZmVyZW5jZUVycm9yIGluIHN0cmljdCBtb2RlLlxyXG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShvbGRfbmFtZSkpIHtcclxuICAgICAgICBvYmpbbmV3X25hbWVdID0gb2JqW29sZF9uYW1lXVxyXG4gICAgICAgIGRlbGV0ZSBvYmpbb2xkX25hbWVdXHJcbiAgICB9XHJcbiAgICByZXR1cm4gb2JqXHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gTWlzYyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcbi8vIGh0dHA6Ly9jc3MtdHJpY2tzLmNvbS9zbmlwcGV0cy9qYXZhc2NyaXB0L2dldC11cmwtdmFyaWFibGVzL1xyXG5rLmdldFF1ZXJ5VmFyaWFibGUgPSBmdW5jdGlvbih2YXJpYWJsZSkge1xyXG4gICAgICAgdmFyIHF1ZXJ5ID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSlcclxuICAgICAgIHZhciB2YXJzID0gcXVlcnkuc3BsaXQoXCImXCIpXHJcbiAgICAgICBmb3IgKHZhciBpPTA7aTx2YXJzLmxlbmd0aDtpKyspIHtcclxuICAgICAgICAgICAgICAgdmFyIHBhaXIgPSB2YXJzW2ldLnNwbGl0KFwiPVwiKVxyXG4gICAgICAgICAgICAgICBpZihwYWlyWzBdID09IHZhcmlhYmxlKXtcclxuICAgICAgICAgICAgICAgICAgIHJldHVybiBwYWlyWzFdXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIHJldHVybihmYWxzZSlcclxufVxyXG5cclxuay5zdHJfcmVwZWF0ID0gZnVuY3Rpb24oc3RyaW5nLCBjb3VudCkge1xyXG4gICAgaWYgKGNvdW50IDwgMSkgcmV0dXJuICcnXHJcbiAgICB2YXIgcmVzdWx0ID0gJydcclxuICAgIHZhciBwYXR0ZXJuID0gc3RyaW5nLnZhbHVlT2YoKVxyXG4gICAgd2hpbGUgKGNvdW50ID4gMCkge1xyXG4gICAgICAgIGlmIChjb3VudCAmIDEpIHJlc3VsdCArPSBwYXR0ZXJuXHJcbiAgICAgICAgY291bnQgPj49IDFcclxuICAgICAgICBwYXR0ZXJuICs9IHBhdHRlcm5cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHRcclxufVxyXG5cclxuay5vYmpfbmFtZXMgPSBmdW5jdGlvbiggb2JqZWN0ICkge1xyXG4gICAgaWYoIG9iamVjdCAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgIHZhciBhID0gW107XHJcbiAgICAgICAgZm9yKCB2YXIgaWQgaW4gb2JqZWN0ICkge1xyXG4gICAgICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGlkKSApICB7XHJcbiAgICAgICAgICAgICAgICBhLnB1c2goaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhO1xyXG4gICAgfVxyXG59XHJcblxyXG5rLm9iaklkQXJyYXkgPSBmdW5jdGlvbiggb2JqZWN0ICkge1xyXG4gICAgaWYoIG9iamVjdCAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgIHZhciBhID0gW107XHJcbiAgICAgICAgZm9yKCB2YXIgaWQgaW4gb2JqZWN0ICkge1xyXG4gICAgICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGlkKSApICB7XHJcbiAgICAgICAgICAgICAgICBhLnB1c2goaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIE1hdGgsIG51bWJlcnMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG4vKlxyXG4gKiAgbm9ybVJhbmQ6IHJldHVybnMgbm9ybWFsbHkgZGlzdHJpYnV0ZWQgcmFuZG9tIG51bWJlcnNcclxuICogIGh0dHA6Ly9tZW1vcnkucHN5Y2gubXVuLmNhL3RlY2gvc25pcHBldHMvcmFuZG9tX25vcm1hbC9cclxuICovXHJcbmsubm9ybVJhbmQgPSBmdW5jdGlvbihtdSwgc2lnbWEpIHtcclxuICAgIHZhciB4MSwgeDIsIHJhZDtcclxuXHJcbiAgICBkbyB7XHJcbiAgICAgICAgeDEgPSAyICogTWF0aC5yYW5kb20oKSAtIDE7XHJcbiAgICAgICAgeDIgPSAyICogTWF0aC5yYW5kb20oKSAtIDE7XHJcbiAgICAgICAgcmFkID0geDEgKiB4MSArIHgyICogeDI7XHJcbiAgICB9IHdoaWxlKHJhZCA+PSAxIHx8IHJhZCA9PT0gMCk7XHJcblxyXG4gICAgdmFyIGMgPSBNYXRoLnNxcnQoLTIgKiBNYXRoLmxvZyhyYWQpIC8gcmFkKTtcclxuICAgIHZhciBuID0geDEgKiBjO1xyXG4gICAgcmV0dXJuIChuICogbXUpICsgc2lnbWE7XHJcbn1cclxuXHJcbmsucGFkX3plcm8gPSBmdW5jdGlvbihudW0sIHNpemUpe1xyXG4gICAgdmFyIHMgPSAnMDAwMDAwMDAwJyArIG51bVxyXG4gICAgcmV0dXJuIHMuc3Vic3RyKHMubGVuZ3RoLXNpemUpXHJcbn1cclxuXHJcblxyXG5rLnVwdGltZSA9IGZ1bmN0aW9uKGJvb3RfdGltZSl7XHJcbiAgICB2YXIgdXB0aW1lX3NlY29uZHNfdG90YWwgPSBtb21lbnQoKS5kaWZmKGJvb3RfdGltZSwgJ3NlY29uZHMnKVxyXG4gICAgdmFyIHVwdGltZV9ob3VycyA9IE1hdGguZmxvb3IoICB1cHRpbWVfc2Vjb25kc190b3RhbCAvKDYwKjYwKSApXHJcbiAgICB2YXIgbWludXRlc19sZWZ0ID0gdXB0aW1lX3NlY29uZHNfdG90YWwgJSg2MCo2MClcclxuICAgIHZhciB1cHRpbWVfbWludXRlcyA9IGsucGFkX3plcm8oIE1hdGguZmxvb3IoICBtaW51dGVzX2xlZnQgLzYwICksIDIgKVxyXG4gICAgdmFyIHVwdGltZV9zZWNvbmRzID0gay5wYWRfemVybyggKG1pbnV0ZXNfbGVmdCAlIDYwKSwgMiApXHJcbiAgICByZXR1cm4gdXB0aW1lX2hvdXJzICtcIjpcIisgdXB0aW1lX21pbnV0ZXMgK1wiOlwiKyB1cHRpbWVfc2Vjb25kc1xyXG59XHJcblxyXG5cclxuXHJcbmsubGFzdF9uX3ZhbHVlcyA9IGZ1bmN0aW9uKG4pe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuOiBuLFxyXG4gICAgICAgIGFycmF5OiBbXSxcclxuICAgICAgICBhZGQ6IGZ1bmN0aW9uKG5ld192YWx1ZSl7XHJcbiAgICAgICAgICAgIHRoaXMuYXJyYXkucHVzaChuZXdfdmFsdWUpXHJcbiAgICAgICAgICAgIGlmKCB0aGlzLmFycmF5Lmxlbmd0aCA+IG4gKSB0aGlzLmFycmF5LnNoaWZ0KClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmsuYXJyYXlNYXggPSBmdW5jdGlvbihudW1BcnJheSkge1xyXG4gICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KG51bGwsIG51bUFycmF5KTtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gQUpBWCAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuay5BSkFYID0gZnVuY3Rpb24odXJsLCBjYWxsYmFjaywgb2JqZWN0KSB7XHJcbiAgICB2YXIgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgIHhtbGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHhtbGh0dHAucmVhZHlTdGF0ZSA9PSBYTUxIdHRwUmVxdWVzdC5ET05FICkge1xyXG4gICAgICAgICAgICBpZih4bWxodHRwLnN0YXR1cyA9PSAyMDApe1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soeG1saHR0cC5yZXNwb25zZVRleHQsIG9iamVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih4bWxodHRwLnN0YXR1cyA9PSA0MDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdUaGVyZSB3YXMgYW4gZXJyb3IgNDAwJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzb21ldGhpbmcgZWxzZSBvdGhlciB0aGFuIDIwMCB3YXMgcmV0dXJuZWQnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHhtbGh0dHAub3BlbihcIkdFVFwiLCB1cmwsIHRydWUpO1xyXG4gICAgeG1saHR0cC5zZW5kKCk7XHJcbn1cclxuXHJcbmsucGFyc2VDU1YgPSBmdW5jdGlvbihmaWxlX2NvbnRlbnQpIHtcclxuICAgIHZhciByID0gW11cclxuICAgIHZhciBsaW5lcyA9IGZpbGVfY29udGVudC5zcGxpdCgnXFxuJyk7XHJcbiAgICB2YXIgaGVhZGVyID0gbGluZXMuc2hpZnQoKS5zcGxpdCgnLCcpO1xyXG4gICAgaGVhZGVyLmZvckVhY2goZnVuY3Rpb24oZWxlbSwgaWQpe1xyXG4gICAgICAgIGhlYWRlcltpZF0gPSBlbGVtLnRyaW0oKTtcclxuICAgIH0pO1xyXG4gICAgZm9yKHZhciBsID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBsIDwgbGVuOyBsKyspe1xyXG4gICAgICAgIHZhciBsaW5lID0gbGluZXNbbF07XHJcbiAgICAgICAgaWYobGluZS5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgdmFyIGxpbmVfb2JqID0ge307XHJcbiAgICAgICAgICAgIGxpbmUuc3BsaXQoJywnKS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0saSl7XHJcbiAgICAgICAgICAgICAgICBsaW5lX29ialtoZWFkZXJbaV1dID0gaXRlbS50cmltKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByLnB1c2gobGluZV9vYmopO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybihyKTtcclxufTtcclxuXHJcbmsuZ2V0Q1NWID0gZnVuY3Rpb24oVVJMLCBjYWxsYmFjaykge1xyXG4gICAgay5BSkFYKFVSTCwgay5wYXJzZUNTVigpIClcclxufVxyXG5cclxuLypcclxuJC5hamF4U2V0dXAgKHtcclxuICAgIGNhY2hlOiBmYWxzZVxyXG59KVxyXG5cclxuXHJcblxyXG5rLmdldF9KU09OID0gZnVuY3Rpb24oVVJMLCBjYWxsYmFjaywgc3RyaW5nKSB7XHJcbi8vICAgIHZhciBmaWxlbmFtZSA9IFVSTC5zcGxpdCgnLycpLnBvcCgpXHJcbi8vICAgIGNvbnNvbGUubG9nKFVSTClcclxuICAgICQuZ2V0SlNPTiggVVJMLCBmdW5jdGlvbigganNvbiApIHtcclxuICAgICAgICBjYWxsYmFjayhqc29uLCBVUkwsIHN0cmluZylcclxuICAgIH0pLmZhaWwoZnVuY3Rpb24oanF4aHIsIHRleHRTdGF0dXMsIGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coIFwiZXJyb3JcIiwgdGV4dFN0YXR1cywgZXJyb3IgIClcclxuICAgIH0pXHJcbn1cclxuXHJcblxyXG5rLmxvYWRfZmlsZXMgPSBmdW5jdGlvbihmaWxlX2xpc3QsIGNhbGxiYWNrKXtcclxuICAgIHZhciBkID0ge31cclxuXHJcbiAgICBmdW5jdGlvbiBsb2FkX2ZpbGUoVVJMKXtcclxuICAgICAgICB2YXIgZmlsZW5hbWUgPSBVUkwuc3BsaXQoJy8nKS5wb3AoKVxyXG4vLyAgICAgICAgdmFyIG5hbWUgPSBmaWxlbmFtZS5zcGxpdCgnLicpWzBdXHJcbiAgICAgICAgJC5nZXRKU09OKCBVUkwsIGZ1bmN0aW9uKCBqc29uICkgeyAvLyAsIHRleHRTdGF0dXMsIGpxWEhSKSB7XHJcbiAgICAgICAgICAgIGFkZF9KU09OKGZpbGVuYW1lLCBqc29uKVxyXG4gICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oanF4aHIsIHRleHRTdGF0dXMsIGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcImVycm9yXCIsIHRleHRTdGF0dXMsIGVycm9yICApXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhZGRfSlNPTihuYW1lLCBqc29uKXtcclxuICAgICAgICBkW25hbWVdID0ganNvblxyXG4gICAgICAgIGlmKE9iamVjdC5rZXlzKGQpLmxlbmd0aCA9PSBkX2ZpbGVzLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGQpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciggdmFyIGtleSBpbiBmaWxlX2xpc3Qpe1xyXG4gICAgICAgIHZhciBVUkwgPSBmaWxlX2xpc3Rba2V5XVxyXG4gICAgICAgIGxvYWRfZmlsZShVUkwpXHJcbiAgICB9XHJcblxyXG4vLyAgICBjYWxsYmFjayhkKVxyXG59XHJcblxyXG5rLmdldEZpbGUgPSBmdW5jdGlvbihVUkwsIGNhbGxiYWNrKXtcclxuICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiBVUkwsXHJcbiAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24oIHhociApIHtcclxuICAgICAgICAgICAgeGhyLm92ZXJyaWRlTWltZVR5cGUoIFwidGV4dC9wbGFpbjsgY2hhcnNldD14LXVzZXItZGVmaW5lZFwiICk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIC5kb25lKGZ1bmN0aW9uKCBkYXRhICkge1xyXG4gICAgICAgIGNhbGxiYWNrKGRhdGEpXHJcbiAgICB9KVxyXG4gICAgLmZhaWwoZnVuY3Rpb24oanF4aHIsIHRleHRTdGF0dXMsIGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcImVycm9yXCIsIHRleHRTdGF0dXMsIGVycm9yICApXHJcbiAgICB9KVxyXG5cclxuXHJcbn1cclxuKi9cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gSFRNTCAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcblxyXG5cclxuay5zZXR1cF9ib2R5ID0gZnVuY3Rpb24odGl0bGUsIHNlY3Rpb25zKXtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGVcclxuICAgIHZhciBib2R5ID0gZG9jdW1lbnQuYm9keVxyXG4gICAgdmFyIHN0YXR1c19iYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgc3RhdHVzX2Jhci5pZCA9ICdzdGF0dXMnXHJcbiAgICBzdGF0dXNfYmFyLmlubmVySFRNTCA9ICdsb2FkaW5nIHN0YXR1cy4uLidcclxuICAgIC8qXHJcbiAgICB2YXIgdGl0bGVfaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKVxyXG4gICAgdGl0bGVfaGVhZGVyLmlubmVySFRNTCA9IHRpdGxlXHJcbiAgICBib2R5Lmluc2VydEJlZm9yZSh0aXRsZV9oZWFkZXIsIGJvZHkuZmlyc3RDaGlsZClcclxuICAgICovXHJcbiAgICBib2R5Lmluc2VydEJlZm9yZShzdGF0dXNfYmFyLCBib2R5LmZpcnN0Q2hpbGQpXHJcbiAgICAvKlxyXG4gICAgdmFyIHRhYnNfZGl2ID0gay5tYWtlX3RhYnMoc2VjdGlvbnMpXHJcbiAgICAkKCdib2R5JykuYXBwZW5kKHRhYnNfZGl2KVxyXG4gICAgJCggJy50YWJzJyApLnRhYnMoe1xyXG4gICAgICAgIGFjdGl2YXRlOiBmdW5jdGlvbiggZXZlbnQsIHVpICkge1xyXG4gICAgICAgICAgICB2YXIgZnVsbF90aXRsZSA9IHRpdGxlICsgXCIgLyBcIiArIHVpLm5ld1RhYlswXS50ZXh0Q29udGVudFxyXG4gICAgICAgICAgICBkb2N1bWVudC50aXRsZSA9IGZ1bGxfdGl0bGVcclxuICAgICAgICAgICAgJCgnI3RpdGxlJykudGV4dChmdWxsX3RpdGxlKVxyXG4gICAgICAgICAgICAvL2R1bXAobW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJykpXHJcbiAgICAgICAgICAgICQuc3BhcmtsaW5lX2Rpc3BsYXlfdmlzaWJsZSgpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHZhciBzZWN0aW9uID0gay5nZXRRdWVyeVZhcmlhYmxlKCdzZWMnKVxyXG4gICAgaWYoc2VjdGlvbiBpbiBzZWN0aW9ucykge1xyXG4gICAgICAgIHZhciBpbmRleCA9ICQoJy50YWJzIGFbaHJlZj1cIiMnK3NlY3Rpb24rJ1wiXScpLnBhcmVudCgpLmluZGV4KClcclxuICAgICAgICAkKFwiLnRhYnNcIikudGFicyhcIm9wdGlvblwiLCBcImFjdGl2ZVwiLCBpbmRleClcclxuICAgIH1cclxuICAgICovXHJcblxyXG59XHJcbi8qXHJcbmsubWFrZV90YWJzID0gZnVuY3Rpb24oc2VjdGlvbl9vYmope1xyXG4gICAgdmFyIHRhYnNfZGl2ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygndGFicycpXHJcbiAgICB2YXIgaGVhZF9kaXYgPSAkKCc8dWw+JykuYXBwZW5kVG8odGFic19kaXYpXHJcblxyXG4gICAgZm9yICh2YXIgaWQgaW4gc2VjdGlvbl9vYmope1xyXG4gICAgICAgIHZhciB0aXRsZSA9IHNlY3Rpb25fb2JqW2lkXVxyXG4gICAgICAgIC8vKCc8bGk+PGEgaHJlZj1cIiMnK2lkKydcIj4nK3RpdGxlKyc8L2E+PC9saT4nKSlcclxuICAgICAgICAvLygnPGRpdiBpZD1cIicraWQrJ1wiPjwvZGl2PicpKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0YWJzX2RpdlxyXG59XHJcblxyXG4qL1xyXG5rLnVwZGF0ZV9zdGF0dXNfcGFnZSA9IGZ1bmN0aW9uKHN0YXR1c19pZCwgYm9vdF90aW1lLCBzdHJpbmcpIHtcclxuICAgIHZhciBzdGF0dXNfZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3RhdHVzX2lkKVxyXG4gICAgc3RhdHVzX2Rpdi5pbm5lckhUTUwgPSBzdHJpbmdcclxuICAgIHN0YXR1c19kaXYuaW5uZXJIVE1MICs9ICcgfCAnXHJcblxyXG4gICAgdmFyIGNsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgICBjbG9jay5pbm5lckhUTUwgPSBtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKVxyXG5cclxuICAgIHZhciB1cHRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgIHVwdGltZS5pbm5lckhUTUwgPSAnVXB0aW1lOiAnICsgay51cHRpbWUoYm9vdF90aW1lKVxyXG5cclxuICAgIHN0YXR1c19kaXYuYXBwZW5kQ2hpbGQoY2xvY2spXHJcbiAgICBzdGF0dXNfZGl2LmlubmVySFRNTCArPSAnIHwgJ1xyXG4gICAgc3RhdHVzX2Rpdi5hcHBlbmRDaGlsZCh1cHRpbWUpXHJcbiAgICBzdGF0dXNfZGl2LmlubmVySFRNTCArPSAnIHwgJ1xyXG59XHJcblxyXG4vKlxyXG5rLm9ial9sb2cgPSBmdW5jdGlvbihvYmosIG9ial9uYW1lLCBtYXhfbGV2ZWwpe1xyXG4gICAgdmFyIGxldmVscyA9IGZ1bmN0aW9uKG9iaiwgbGV2ZWxfaW5kZW50LCBzdHIpe1xyXG4gICAgICAgIGZvcih2YXIgbmFtZSBpbiBvYmopIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBvYmpbbmFtZV1cclxuICAgICAgICAgICAgaWYoIGxldmVsX2luZGVudCA8PSBtYXhfbGV2ZWwgJiYgdHlwZW9mKGl0ZW0pID09ICdvYmplY3QnICkge1xyXG4gICAgICAgICAgICAgICAgc3RyICs9IFwiXFxuXCIgKyBrLnN0cl9yZXBlYXQoXCIgXCIsIGxldmVsX2luZGVudCoyKSArIG5hbWVcclxuICAgICAgICAgICAgICAgIHN0ciA9IGxldmVscyhpdGVtLCBsZXZlbF9pbmRlbnQrMSwgc3RyIClcclxuICAgICAgICAgICAgfSBlbHNlIGlmKHR5cGVvZiBpdGVtICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBzdHIgKz0gXCJcXG5cIiArIGsuc3RyX3JlcGVhdChcIiBcIiwgbGV2ZWxfaW5kZW50KjIpICsgbmFtZSArIFwiOiBcIiArIGl0ZW1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHN0ciArPSBcIlxcblwiICsgay5zdHJfcmVwZWF0KFwiIFwiLCBsZXZlbF9pbmRlbnQqMikgKyBuYW1lICsgXCI6IDxmdW5jdGlvbj5cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHJcclxuICAgIH1cclxuICAgIHZhciBtYXhfbGV2ZWwgPSBtYXhfbGV2ZWwgfHwgMTAwXHJcbiAgICBjb25zb2xlLmxvZyhvYmpfbmFtZSlcclxuICAgIHZhciBzdHIgPSAnLScgKyBvYmpfbmFtZSArICctJ1xyXG4gICAgbWF4X2xldmVsKytcclxuICAgIGxldmVsX2luZGVudCA9IDJcclxuICAgIHN0ciA9IGxldmVscyhvYmosIGxldmVsX2luZGVudCwgc3RyKVxyXG4gICAgY29uc29sZS5sb2coc3RyKVxyXG59XHJcblxyXG5cclxuay5vYmpfdHJlZSA9IGZ1bmN0aW9uKG9iaiwgdGl0bGUpe1xyXG4gICAgLy8gdGFrZXMgYSBqYXZhc2NyaXB0LCBhbmQgcmV0dXJlbnMgYSBqcXVlcnkgRElWXHJcbiAgICB2YXIgb2JqX2RpdiA9ICQoJzxwcmU+JykgLy8uYWRkQ2xhc3MoJ2JveCcpXHJcbiAgICB2YXIgbGV2ZWxzID0gZnVuY3Rpb24ob2JqLCBsZXZlbF9pbmRlbnQpeyhsaW5lLCBjaXJjbGUsIHRleHQgKVxyXG4gICAgICAgIHZhciBsaXN0ID0gW11cclxuICAgICAgICB2YXIgb2JqX2xlbmd0aCA9IDBcclxuICAgICAgICBmb3IoIHZhciBrZXkgaW4gb2JqKSB7b2JqX2xlbmd0aCsrfVxyXG4gICAgICAgIHZhciBjb3VudCA9IDBcclxuICAgICAgICBmb3IodmFyIGtleSBpbiBvYmopIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBvYmpba2V5XVxyXG5cclxuLy8gICAgICAgICAgICB2YXIgaW5kZW50X3N0cmluZyA9ICcmbmJzcDsmbmJzcDsmbmJzcDsmIzk0NzQnLnJlcGVhdChsZXZlbCkgKyAnJm5ic3A7Jm5ic3A7Jm5ic3A7J1xyXG4vLyAgICAgICAgICAgIGlmKGxldmVsX2luZGVudCA9PT0gJycgKXtcclxuLy8gICAgICAgICAgICAgICAgbmV4dF9sZXZlbF9pbmRlbnQgPSBsZXZlbF9pbmRlbnQgKyAnJm5ic3A7Jm5ic3A7J1xyXG4vLyAgICAgICAgICAgICAgICB0aGlzX2xldmVsX2luZGVudCA9IGxldmVsX2luZGVudCArICcmbmJzcDsmbmJzcDsnXHJcbi8vICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIGlmKGNvdW50ID09IG9ial9sZW5ndGgtMSApIHsgICAvLyBJZiBsYXN0IGl0ZW0sIGZpbnNoIHRyZWUgc2VjdGlvblxyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyZuYnNwOydcclxuICAgICAgICAgICAgICAgIHZhciB0aGlzX2xldmVsX2luZGVudCA9IGxldmVsX2luZGVudCArICcmbmJzcDsmIzk0OTI7JiM5NDcyOydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyYjOTQ3NDsnXHJcbiAgICAgICAgICAgICAgICB2YXIgdGhpc19sZXZlbF9pbmRlbnQgPSBsZXZlbF9pbmRlbnQgKyAnJm5ic3A7JiM5NTAwOyYjOTQ3MjsnXHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICBpZiggdHlwZW9mKGl0ZW0pID09ICdvYmplY3QnICl7XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2goIHRoaXNfbGV2ZWxfaW5kZW50ICsga2V5KVxyXG4gICAgICAgICAgICAgICAgbGlzdCA9IGxpc3QuY29uY2F0KCBsZXZlbHMoaXRlbSwgbmV4dF9sZXZlbF9pbmRlbnQpIClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSBpdGVtLnRvU3RyaW5nKCkucmVwbGFjZSgvKFxcclxcbnxcXG58XFxyKS9nbSxcIiBcIikucmVwbGFjZSgvXFxzKy9nLFwiIFwiKSAvL2h0dHA6Ly93d3cudGV4dGZpeGVyLmNvbS90dXRvcmlhbHMvamF2YXNjcmlwdC1saW5lLWJyZWFrcy5waHBcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzX2xldmVsX2luZGVudCArIGtleStcIjogXCIrIGl0ZW0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4vLyAgICAgICAgICAgIGNvbnNvbGUubG9nKGtleSxsZXZlbClcclxuICAgICAgICAgICAgY291bnQrK1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3RcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGlzdCA9IFt0aXRsZV0uY29uY2F0KGxldmVscyhvYmosJycpKVxyXG4gICAgbGlzdC5mb3JFYWNoKCBmdW5jdGlvbihsaW5lLGtleSl7XHJcbiAgICAgICAgb2JqX2Rpdi5hcHBlbmQobGluZSArICc8L2JyPicpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIG9ial9kaXZcclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuay5vYmpfZGlzcGxheSA9IGZ1bmN0aW9uKG9iail7XHJcbiAgICBmdW5jdGlvbiBsZXZlbHMob2JqLGxldmVsKXtcclxuICAgIC8vICAgIHZhciBzdWJvYmpfZGl2ID0gJCgnPGRpdj4nKVxyXG4gICAgICAgIHZhciBzdWJvYmpfdWwgPSAkKCc8dWw+JykuYWRkQ2xhc3MoJ3RyZWUnKVxyXG5cclxuICAgICAgICBmb3IodmFyIGtleSBpbiBvYmopIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBvYmpba2V5XVxyXG4gICAgLy8gICAgICAgIGNvbnNvbGUubG9nKGtleSwgdHlwZW9mKGl0ZW0pKVxyXG4gICAgICAgICAgICBpZiggdHlwZW9mKGl0ZW0pID09ICdvYmplY3QnICl7XHJcbiAgICAvLyAgICAgICAgICAgICgnPGxpPicpLnRleHQoXCImbmJzcDtcIi5yZXBlYXQobGV2ZWwpICsga2V5KSlcclxuICAgICAgICAgICAgICAgICgnPGxpPicpLnRleHQoa2V5KSlcclxuICAgICAgICAgICAgICAgIHN1Ym9ial91bC5hcHBlbmQobGV2ZWxzKGl0ZW0sbGV2ZWwrMSkpXHJcbiAgICAvLyAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiJm5ic3A7XCIucmVwZWF0KGxldmVsKSArIGtleSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgICAgc3Vib2JqX2Rpdi5hcHBlbmQoJzxzcGFuPicpLnRleHQoXCImbmJzcDtcIi5yZXBlYXQobGV2ZWwpICsga2V5K1wiOiBcIisgaXRlbSlcclxuICAgIC8vICAgICAgICAgICAgKCc8bGk+JykudGV4dChcIiZuYnNwO1wiLnJlcGVhdChsZXZlbCkgKyBrZXkgK1wiOiBcIisgaXRlbSkpXHJcbiAgICAgICAgICAgICAgICAoJzxsaT4nKS50ZXh0KGtleSArXCI6IFwiKyBpdGVtKSlcclxuICAgIC8vICAgICAgICAgICAgY29uc29sZS5sb2coXCImbmJzcDtcIi5yZXBlYXQobGV2ZWwpICsga2V5K1wiOiBcIisgaXRlbSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3Vib2JqX3VsXHJcbiAgICB9XHJcbiAgICAvLyB0YWtlcyBhIGphdmFzY3JpcHQsIGFuZCByZXR1cmVucyBhIGpxdWVyeSBESVZcclxuICAgIHZhciBvYmpfZGl2ID0gJCgnPGRpdj4nKS8vLmFkZENsYXNzKCdib3gnKVxyXG5cclxuICAgIG9ial9kaXYuYXBwZW5kKGxldmVscyhvYmosMCkpXHJcbiAgICByZXR1cm4gb2JqX2RpdlxyXG59XHJcblxyXG5rLnNob3dfb2JqID0gZnVuY3Rpb24oY29udGFpbmVyX2lkLCBvYmosIG5hbWUpe1xyXG4gICAgdmFyIGlkID0gJyMnICsgbmFtZVxyXG4gICAgaWYoICEgJChjb250YWluZXJfaWQpLmNoaWxkcmVuKGlkKS5sZW5ndGggKSB7XHJcbiAgICAgICAgKCc8ZGl2PicpLmF0dHIoJ2lkJywgbmFtZSkpXHJcbiAgICB9XHJcbiAgICB2YXIgYm94ID0gJChjb250YWluZXJfaWQpLmNoaWxkcmVuKGlkKVxyXG4gICAgYm94LmVtcHR5KClcclxuXHJcbiAgICB2YXIgb2JqX2RpdiA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ2JveCcpXHJcbiAgICBvYmpfZGl2LmFwcGVuZChrLm9ial90cmVlKG9iaiwgbmFtZSkpXHJcbiAgICBib3guYXBwZW5kKG9ial9kaXYpXHJcblxyXG59XHJcblxyXG4qL1xyXG5rLmxvZ19vYmplY3RfdHJlZSA9IGZ1bmN0aW9uKGNvbXBvbmVudHMpe1xyXG4gICAgZm9yKCB2YXIgbWFrZSBpbiBjb21wb25lbnRzLm1vZHVsZXMgKXtcclxuICAgICAgICBpZiggY29tcG9uZW50cy5tb2R1bGVzLmhhc093blByb3BlcnR5KG1ha2UpKXtcclxuICAgICAgICAgICAgZm9yKCB2YXIgbW9kZWwgaW4gY29tcG9uZW50cy5tb2R1bGVzW21ha2VdICl7XHJcbiAgICAgICAgICAgICAgICBpZiggY29tcG9uZW50cy5tb2R1bGVzW21ha2VdLmhhc093blByb3BlcnR5KG1vZGVsKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSBjb21wb25lbnRzLm1vZHVsZXNbbWFrZV1bbW9kZWxdXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGEgPSBbbWFrZSxtb2RlbF1cclxuICAgICAgICAgICAgICAgICAgICBmb3IoIHZhciBzcGVjIGluIG8gKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIG8uaGFzT3duUHJvcGVydHkoc3BlYykpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYS5wdXNoKG9bc3BlY10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGEuam9pbignLCcpKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRlNFQyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcblxyXG5cclxuay5jcjEwMDBfanNvbiA9IGZ1bmN0aW9uKGpzb24pe1xyXG4vLyAgICB2YXIgZmllbGRzID0gW11cclxuLy8gICAgJC5lYWNoKGpzb24uaGVhZC5maWVsZHMsIGZ1bmN0aW9uKGtleSwgZmllbGQpIHtcclxuLy8gICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkLm5hbWUpXHJcbi8vICAgIH0pXHJcbi8vICAgIHZhciBkYXRhID0gXy56aXAoZmllbGRzLCBqc29uLmRhdGFbMF0udmFscylcclxuLy9cclxuICAgIHZhciB0aW1lc3RhbXAgPSBqc29uLmRhdGFbMF0udGltZVxyXG4gICAgdmFyIGRhdGEgPSB7fVxyXG4gICAgZGF0YS5UaW1lc3RhbXAgPSBqc29uLmRhdGFbMF0udGltZVxyXG4gICAgZGF0YS5SZWNvcmROdW0gPSBqc29uLmRhdGFbMF0ubm9cclxuICAgIGZvcih2YXIgaSA9IDAsIGwgPSBqc29uLmhlYWQuZmllbGRzLmxlbmd0aDsgaSA8IGw7IGkrKyApe1xyXG4gICAgICAgIGRhdGFbanNvbi5oZWFkLmZpZWxkc1tpXS5uYW1lXSA9IGpzb24uZGF0YVswXS52YWxzW2ldXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRhdGFcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRDMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcblxyXG5rLmQzID0ge31cclxuXHJcbmsuZDMubGl2ZV9zcGFya2xpbmUgPSBmdW5jdGlvbihpZCwgaGlzdG9yeSkge1xyXG4gICAgdmFyIGRhdGEgPSBoaXN0b3J5LmFycmF5XHJcbiAgICB2YXIgbGVuZ3RoID0gaGlzdG9yeS5hcnJheS5sZW5ndGhcclxuICAgIHZhciBuID0gaGlzdG9yeS5uXHJcbiAgICAvL2suZDMubGl2ZV9zcGFya2xpbmUgPSBmdW5jdGlvbihpZCwgd2lkdGgsIGhlaWdodCwgaW50ZXJwb2xhdGlvbiwgYW5pbWF0ZSwgdXBkYXRlRGVsYXksIHRyYW5zaXRpb25EZWxheSkge1xyXG4gICAgLy8gYmFzZWQgb24gY29kZSBwb3N0ZWQgYnkgQmVuIENocmlzdGVuc2VuIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2JlbmpjaHJpc3RlbnNlbi8xMTQ4Mzc0XHJcblxyXG4gICAgdmFyIHdpZHRoID0gNDAwLFxyXG4gICAgICAgIGhlaWdodCA9IDUwLFxyXG4gICAgICAgIGludGVycG9sYXRpb24gPSAnYmFzaXMnLFxyXG4gICAgICAgIGFuaW1hdGUgPSB0cnVlLFxyXG4gICAgICAgIHVwZGF0ZURlbGF5ID0gMTAwMCxcclxuICAgICAgICB0cmFuc2l0aW9uRGVsYXkgPSAxMDAwXHJcblxyXG4gICAgLy8gWCBzY2FsZSB3aWxsIGZpdCB2YWx1ZXMgZnJvbSAwLTEwIHdpdGhpbiBwaXhlbHMgMC0xMDBcclxuICAgIC8vIHN0YXJ0aW5nIHBvaW50IGlzIC01IHNvIHRoZSBmaXJzdCB2YWx1ZSBkb2Vzbid0IHNob3cgYW5kIHNsaWRlcyBvZmYgdGhlIGVkZ2UgYXMgcGFydCBvZiB0aGUgdHJhbnNpdGlvblxyXG4gICAgdmFyIHggPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDU5XSkucmFuZ2UoWzAsIHdpZHRoXSk7XHJcbiAgICAvLyBZIHNjYWxlIHdpbGwgZml0IHZhbHVlcyBmcm9tIDAtMTAgd2l0aGluIHBpeGVscyAwLTEwMFxyXG4gICAgdmFyIHkgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzIwLCA0MF0pLnJhbmdlKFtoZWlnaHQsIDBdKTtcclxuXHJcbiAgICAvLyBjcmVhdGUgYSBsaW5lIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgdGhlIFNWTiBsaW5lIHdlJ3JlIGNyZWF0aW5nXHJcbiAgICB2YXIgbGluZSA9IGQzLnN2Zy5saW5lKClcclxuICAgICAgICAvLyBhc3NpZ24gdGhlIFggZnVuY3Rpb24gdG8gcGxvdCBvdXIgbGluZSBhcyB3ZSB3aXNoXHJcbiAgICAgICAgLngoZnVuY3Rpb24oZCxpKSB7XHJcbiAgICAgICAgICAgIC8vIHZlcmJvc2UgbG9nZ2luZyB0byBzaG93IHdoYXQncyBhY3R1YWxseSBiZWluZyBkb25lXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ1Bsb3R0aW5nIFggdmFsdWUgZm9yIGRhdGEgcG9pbnQ6ICcgKyBkICsgJyB1c2luZyBpbmRleDogJyArIGkgKyAnIHRvIGJlIGF0OiAnICsgeChpKSArICcgdXNpbmcgb3VyIHhTY2FsZS4nKTtcclxuICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBYIGNvb3JkaW5hdGUgd2hlcmUgd2Ugd2FudCB0byBwbG90IHRoaXMgZGF0YXBvaW50XHJcbiAgICAgICAgICAgIHJldHVybiB4KGkpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnkoZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAvLyB2ZXJib3NlIGxvZ2dpbmcgdG8gc2hvdyB3aGF0J3MgYWN0dWFsbHkgYmVpbmcgZG9uZVxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdQbG90dGluZyBZIHZhbHVlIGZvciBkYXRhIHBvaW50OiAnICsgZCArICcgdG8gYmUgYXQ6ICcgKyB5KGQpICsgXCIgdXNpbmcgb3VyIHlTY2FsZS5cIik7XHJcbiAgICAgICAgICAgIC8vIHJldHVybiB0aGUgWSBjb29yZGluYXRlIHdoZXJlIHdlIHdhbnQgdG8gcGxvdCB0aGlzIGRhdGFwb2ludFxyXG4gICAgICAgICAgICByZXR1cm4geShkKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5pbnRlcnBvbGF0ZShpbnRlcnBvbGF0aW9uKVxyXG5cclxuICAgIC8vIElmIHN2ZyBkb2VzIG5vdCBleGlzdCwgY3JlYXRlIGl0XHJcbiAgICBpZiggISBkMy5zZWxlY3QoJyMnK2lkKS5zZWxlY3QoJ3N2ZycpWzBdWzBdICl7XHJcbiAgICAgICAgLy8gY3JlYXRlIGFuIFNWRyBlbGVtZW50IGluc2lkZSB0aGUgI2dyYXBoIGRpdiB0aGF0IGZpbGxzIDEwMCUgb2YgdGhlIGRpdlxyXG4gICAgICAgIHZhciBncmFwaCA9IGQzLnNlbGVjdCgnIycraWQpLmFwcGVuZChcInN2ZzpzdmdcIikuYXR0cihcIndpZHRoXCIsIHdpZHRoKS5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIC8vIGRpc3BsYXkgdGhlIGxpbmUgYnkgYXBwZW5kaW5nIGFuIHN2ZzpwYXRoIGVsZW1lbnQgd2l0aCB0aGUgZGF0YSBsaW5lIHdlIGNyZWF0ZWQgYWJvdmVcclxuLy8gICAgICAgIGdyYXBoLmFwcGVuZChcInN2ZzpwYXRoXCIpLmF0dHIoXCJkXCIsIGxpbmUoZGF0YSkpO1xyXG4gICAgICAgIC8vIG9yIGl0IGNhbiBiZSBkb25lIGxpa2UgdGhpc1xyXG4gICAgICAgIGdyYXBoLnNlbGVjdEFsbChcInBhdGhcIikuZGF0YShbZGF0YV0pLmVudGVyKCkuYXBwZW5kKFwic3ZnOnBhdGhcIikuYXR0cihcImRcIiwgbGluZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGdyYXBoID0gZDMuc2VsZWN0KCcjJytpZCsnIHN2ZycpXHJcbiAgICBjb25zb2xlLmxvZyggbGVuZ3RoKVxyXG4gICAgLy8gdXBkYXRlIHdpdGggYW5pbWF0aW9uXHJcbiAgICBncmFwaC5zZWxlY3RBbGwoXCJwYXRoXCIpXHJcbiAgICAgICAgLmRhdGEoW2RhdGFdKSAvLyBzZXQgdGhlIG5ldyBkYXRhXHJcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyB4KG4tbGVuZ3RoICsxKSArIFwiKVwiKSAvLyBzZXQgdGhlIHRyYW5zZm9ybSB0byB0aGUgcmlnaHQgYnkgeCgxKSBwaXhlbHMgKDYgZm9yIHRoZSBzY2FsZSB3ZSd2ZSBzZXQpIHRvIGhpZGUgdGhlIG5ldyB2YWx1ZVxyXG4gICAgICAgIC5hdHRyKFwiZFwiLCBsaW5lKSAvLyBhcHBseSB0aGUgbmV3IGRhdGEgdmFsdWVzIC4uLiBidXQgdGhlIG5ldyB2YWx1ZSBpcyBoaWRkZW4gYXQgdGhpcyBwb2ludCBvZmYgdGhlIHJpZ2h0IG9mIHRoZSBjYW52YXNcclxuICAgICAgICAudHJhbnNpdGlvbigpIC8vIHN0YXJ0IGEgdHJhbnNpdGlvbiB0byBicmluZyB0aGUgbmV3IHZhbHVlIGludG8gdmlld1xyXG4gICAgICAgIC5lYXNlKFwibGluZWFyXCIpXHJcbiAgICAgICAgLmR1cmF0aW9uKHRyYW5zaXRpb25EZWxheSkgLy8gZm9yIHRoaXMgZGVtbyB3ZSB3YW50IGEgY29udGludWFsIHNsaWRlIHNvIHNldCB0aGlzIHRvIHRoZSBzYW1lIGFzIHRoZSBzZXRJbnRlcnZhbCBhbW91bnQgYmVsb3dcclxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIHgobi1sZW5ndGgpICsgXCIpXCIpOyAvLyBhbmltYXRlIGEgc2xpZGUgdG8gdGhlIGxlZnQgYmFjayB0byB4KDApIHBpeGVscyB0byByZXZlYWwgdGhlIG5ldyB2YWx1ZVxyXG5cclxuICAgICAgICAvKiB0aGFua3MgdG8gJ2JhcnJ5bScgZm9yIGV4YW1wbGVzIG9mIHRyYW5zZm9ybTogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vMTEzNzEzMSAqL1xyXG4vLyAgICAgZ3JhcGguYXBwZW5kKFwicmVjdFwiKVxyXG4vLyAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuLy8gICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbi8vICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodClcclxuLy8gICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcclxuLy8gICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsICcjZjAwJylcclxuLy8gICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIm5vbmVcIilcclxuLy8gICAgICAgICAgLnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsICcxcHgnKVxyXG5cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBFdmVudHMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5rLmUgPSB7fVxyXG5cclxuay51cHRpbWUgPSBmdW5jdGlvbihib290X3RpbWUpe1xyXG4gICAgdmFyIHVwdGltZV9zZWNvbmRzX3RvdGFsID0gbW9tZW50KCkuZGlmZihib290X3RpbWUsICdzZWNvbmRzJylcclxuICAgIHZhciB1cHRpbWVfaG91cnMgPSBNYXRoLmZsb29yKCAgdXB0aW1lX3NlY29uZHNfdG90YWwgLyg2MCo2MCkgKVxyXG4gICAgdmFyIG1pbnV0ZXNfbGVmdCA9IHVwdGltZV9zZWNvbmRzX3RvdGFsICUoNjAqNjApXHJcbiAgICB2YXIgdXB0aW1lX21pbnV0ZXMgPSBrLnBhZF96ZXJvKCBNYXRoLmZsb29yKCAgbWludXRlc19sZWZ0IC82MCApLCAyIClcclxuICAgIHZhciB1cHRpbWVfc2Vjb25kcyA9IGsucGFkX3plcm8oIChtaW51dGVzX2xlZnQgJSA2MCksIDIgKVxyXG4gICAgcmV0dXJuIHVwdGltZV9ob3VycyArXCI6XCIrIHVwdGltZV9taW51dGVzICtcIjpcIisgdXB0aW1lX3NlY29uZHNcclxufVxyXG5cclxuay5lLmFkZFRpbWVTaW5jZSA9IGZ1bmN0aW9uKGV2ZW50X2xpc3Qpe1xyXG4gICAgY29uc29sZS5sb2cobW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREJykpXHJcbiAgICBjb25zb2xlLmxvZyhtb21lbnQoKS5mcm9tTm93KCkpXHJcbiAgICBldmVudF9saXN0LmZvckVhY2goZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgIHZhciBkYXRlX2FycmF5ID0gZXZlbnQuZGF0ZS5zcGxpdCgnLScpLm1hcChOdW1iZXIpXHJcbiAgICAgICAgdmFyIHllYXIgPSBkYXRlX2FycmF5WzBdXHJcbiAgICAgICAgdmFyIG1vbnRoID0gZGF0ZV9hcnJheVsxXVxyXG4gICAgICAgIHZhciBkYXkgPSBkYXRlX2FycmF5WzJdXHJcbiAgICAgICAgdmFyIHRoaXNfeWVhciA9IG1vbWVudCgpLnllYXIoKVxyXG4gICAgICAgIGlmKG1vbWVudCgpLmRpZmYobW9tZW50KFt0aGlzX3llYXIsIG1vbnRoLTEsIGRheV0pLCAnZGF5cycpID4gMCkge3RoaXNfeWVhcisrfVxyXG4gICAgICAgIHZhciBldmVudF9tb21lbnQgPSBtb21lbnQoZXZlbnQuZGF0ZSwgJ1lZWVktTU0tREQnKVxyXG4gICAgICAgIHZhciBkYXlzX2FnbyA9IG1vbWVudCgpLmRpZmYoZXZlbnRfbW9tZW50LCAnZGF5JylcclxuICAgICAgICBldmVudC50aW1lX3NpbmNlID0gZXZlbnRfbW9tZW50LmZyb21Ob3coKVxyXG4gICAgICAgIGV2ZW50LnllYXJzX2FnbyA9IG1vbWVudCgpLmRpZmYoZXZlbnRfbW9tZW50LCAneWVhcnMnKVxyXG4gICAgICAgIGV2ZW50LmRheXNfdGlsbF9uZXh0ID0gLW1vbWVudCgpLmRpZmYobW9tZW50KFt0aGlzX3llYXIsIG1vbnRoLTEsIGRheV0pLCAnZGF5cycpXHJcbiAgICB9KVxyXG4gICAgZXZlbnRfbGlzdC5zb3J0KGZ1bmN0aW9uKGEsYil7XHJcbiAgICAgICAgcmV0dXJuIGEuZGF5c190aWxsX25leHQgLSBiLmRheXNfdGlsbF9uZXh0XHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGV2ZW50X2xpc3RcclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIERpc3BsYXlzIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmsuZCA9IHt9XHJcblxyXG4vKlxyXG5rLmQgPSB7XHJcbiAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgdmFsdWU6IDAsXHJcblxyXG59XHJcblxyXG5rLmQucHJvdG90eXBlLnNldFBlciA9IGZ1bmN0aW9uKHBlcmNlbnQpe1xyXG4gICAgdGhpcy5iYXIuY3NzKCd3aWR0aCcsIHBlcmNlbnQrJyUnKVxyXG59XHJcbiovXHJcblxyXG5cclxuLypcclxuay5kLmJhciA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgYmFyID0ge31cclxuXHJcbiAgICBiYXIud2lkdGggPSAxMDBcclxuICAgIGJhci53aWR0aF91bml0ID0gJyUnXHJcbiAgICBiYXIuaGVpZ2h0ID0gJzhweCdcclxuXHJcbiAgICBjb25zb2xlLmxvZyhiYXIud2lkdGgrJyUnKVxyXG4gICAgYmFyLmRpdiA9ICQoJzxkaXY+JykuY3NzKCd3aWR0aCcsICcwJScpXHJcbiAgICBiYXIuZWxlbWVudCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ3Byb2dyZXNzYmFyJykuY3NzKCd3aWR0aCcsIDEwMClcclxuICAgIGJhci5lbGVtZW50LmFwcGVuZChiYXIuZGl2KVxyXG5cclxuICAgIGJhci5zZXRQZXJjZW50ID0gZnVuY3Rpb24ocGVyY2VudCl7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHBlcmNlbnRcclxuICAgICAgICB0aGlzLndpZHRoX3VuaXQgPSAnJSdcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcbiAgICBiYXIudXBkYXRlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGlzLmRpdi5jc3MoJ3dpZHRoJywgdGhpcy53aWR0aCt0aGlzLndpZHRoX3VuaXQpXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNzcygnaGVpZ2h0JywgdG9TdHJpbmcodGhpcy5oZWlnaHQpKydweCcpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gYmFyXHJcbn1cclxuKi9cclxuXHJcblxyXG4vLyBCcm93c2VyaWZ5XHJcbm1vZHVsZS5leHBvcnRzID0gaztcclxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGxvZyA9IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XG5cbnZhciB2YWx1ZSA9IHJlcXVpcmUoJy4va19ET01fZXh0cmEuanMnKS52YWx1ZTtcbnZhciBzZWxlY3RvciA9IHJlcXVpcmUoJy4va19ET01fZXh0cmEuanMnKS5zZWxlY3Rvcjtcbi8vbG9nKCAndmFsdWUnLCB2YWx1ZSgpICk7XG4vL2xvZyggJ3NlbGVjdG9yJywgc2VsZWN0b3IoKSApOyB2YXIgayA9IHJlcXVpcmUoJy4vaycpOyAvL3ZhciBzZWxlY3RvciA9IHJlcXVpcmUoJy4va19ET01fZXh0cmEuanMnKS5zZWxlY3RvcjsgXG5cblxudmFyIHdyYXBwZXJfcHJvdG90eXBlID0gcmVxdWlyZSgnLi93cmFwcGVyX3Byb3RvdHlwZScpO1xuXG4vKlxudmFyIHdyYXBwZXJfcHJvdG90eXBlID0ge1xuXG4gICAgaHRtbDogZnVuY3Rpb24oaHRtbCl7XG4gICAgICAgdGhpcy5lbGVtLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBhcHBlbmQ6IGZ1bmN0aW9uKHN1Yl9lbGVtZW50KXtcbiAgICAgICAgdGhpcy5lbGVtLmFwcGVuZENoaWxkKHN1Yl9lbGVtZW50LmVsZW0pOyBcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBhcHBlbmRUbzogZnVuY3Rpb24ocGFyZW50X2VsZW1lbnQpe1xuICAgICAgICBwYXJlbnRfZWxlbWVudC5hcHBlbmQodGhpcyk7IFxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGF0dHI6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlICl7XG4gICAgICAgIHZhciBhdHRyaWJ1dGVOYW1lO1xuICAgICAgICBpZiggbmFtZSA9PT0gJ2NsYXNzJyl7XG4gICAgICAgICAgICBhdHRyaWJ1dGVOYW1lID0gJ2NsYXNzTmFtZSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVOYW1lID0gbmFtZTsgXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtW2F0dHJpYnV0ZU5hbWVdID0gdmFsdWU7IFxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG5cblxufTtcbiovXG5cbnZhciBXcmFwID0gZnVuY3Rpb24oZWxlbWVudCl7XG4gICAgdmFyIFcgPSBPYmplY3QuY3JlYXRlKHdyYXBwZXJfcHJvdG90eXBlKTtcblxuXG4gICAgVy5lbGVtID0gZWxlbWVudDtcbiAgICBpZiggVy5lbGVtLnRhZ05hbWUgPT09IFwiU0VMRUNUXCIgKSB7XG4gICAgICAgIFcuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uKCBvcHRpb25fYXJyYXkgKSB7XG4gICAgICAgICAgICBXLmVsZW0ub3B0aW9ucy5sZW5ndGggPSAwOyBcbiAgICAgICAgICAgIC8vbG9nKFwib3B0aW9uX2FycmF5XCIsIG9wdGlvbl9hcnJheSk7XG4gICAgICAgICAgICBvcHRpb25fYXJyYXkuZm9yRWFjaCggZnVuY3Rpb24ob3B0aW9uX3N0cixpKXtcbiAgICAgICAgICAgICAgICB2YXIgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgb3B0LnRleHQgPSBvcHRpb25fc3RyO1xuICAgICAgICAgICAgICAgIG9wdC52YWx1ZSA9IG9wdGlvbl9zdHI7XG4gICAgICAgICAgICAgICAgVy5lbGVtLmFkZChvcHQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIFc7XG5cbn07XG5cbnZhciAkID0gZnVuY3Rpb24oaW5wdXQpe1xuICAgIHZhciBlbGVtZW50O1xuXG4gICAgaWYoIHR5cGVvZiBpbnB1dCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgIC8vbG9nKCdpbnB1dCBuZWVkZWQnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiggKGlucHV0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHx8IChpbnB1dCBpbnN0YW5jZW9mIFNWR0VsZW1lbnQpICl7XG4gICAgICAgIHJldHVybiBXcmFwKGlucHV0KTtcbiAgICB9XG4gICAgaWYoIGlucHV0LnN1YnN0cigwLDEpID09PSAnIycgKSB7XG4gICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbnB1dC5zdWJzdHIoMSkpO1xuICAgICAgICByZXR1cm4gV3JhcChlbGVtZW50KTtcbiAgICB9IGVsc2UgaWYoIGlucHV0LnN1YnN0cigwLDEpID09PSAnLicgKSB7XG4gICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlDbGFzc05hbWUoaW5wdXQuc3Vic3RyKDEpWzBdKTtcbiAgICAgICAgcmV0dXJuIFdyYXAoZWxlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYoIGlucHV0ID09PSAndmFsdWUnICkge1xuICAgICAgICAgICAgaWYoIHZhbHVlICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IHZhbHVlKCk7IFxuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiB2YWx1ZSBub3QgZGVmaW5lZFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiggaW5wdXQgPT09ICdzZWxlY3RvcicgKSB7XG4gICAgICAgICAgICBpZiggc2VsZWN0b3IgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gc2VsZWN0b3IoKTsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IHNlbGVjdG9yIG5vdCBkZWZpbmVkXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiBXcmFwKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuXG5cbn07XG5cbi8vIEJyb3dzZXJpZnlcbm1vZHVsZS5leHBvcnRzID0gJDtcbi8vbW9kdWxlLmV4cG9ydHMud3JhcHBlcl9wcm90b3R5cGUgPSB3cmFwcGVyX3Byb3RvdHlwZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGsgPSByZXF1aXJlKCcuL2suanMnKTtcbnZhciBrb250YWluZXIgPSByZXF1aXJlKCcuL2tvbnRhaW5lcicpO1xuXG52YXIga19ET00gPSByZXF1aXJlKCcuL2tfRE9NLmpzJyk7XG52YXIgd3JhcHBlcl9wcm90b3R5cGUgPSByZXF1aXJlKCcuL3dyYXBwZXJfcHJvdG90eXBlJyk7XG5cblxudmFyIHNlbGVjdG9yX3Byb3RvdHlwZSA9IHtcbiAgICBjaGFuZ2U6IGZ1bmN0aW9uKG5ld192YWx1ZSl7XG4gICAgICAgIHRoaXMuc2V0X3ZhbHVlKCk7XG5cbiAgICAgICAgaWYoIHRoaXMuZ191cGRhdGUgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgdGhpcy5nX3VwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRfdmFsdWU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCB0aGlzLmVsZW0ub3B0aW9uc1t0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleF0gJiYgdGhpcy5lbGVtLm9wdGlvbnNbdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXhdLnZhbHVlICl7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzZWxlY3RlZF92YWx1ZScsIHRoaXMuZWxlbS5vcHRpb25zW3RoaXMuZWxlbS5zZWxlY3RlZEluZGV4XS52YWx1ZSk7XG4gICAgICAgICAgICB2YXIgbmV3X3ZhbHVlID0gdGhpcy5lbGVtLm9wdGlvbnNbdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuICAgICAgICAgICAgaWYoIHRoaXMub3B0aW9uc0tvbnRhaW5lci5yZWFkeSApIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdrb250YWluZXIgcmVhZHksIHNldHRpbmcgdG86ICcsIG5ld192YWx1ZSlcbiAgICAgICAgICAgICAgICAvL2lmKCAhIGlzTmFOKHBhcnNlRmxvYXQobmV3X3ZhbHVlKSkpIG5ld192YWx1ZSA9IHBhcnNlRmxvYXQobmV3X3ZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmtvbnRhaW5lci5zZXQobmV3X3ZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gbmV3X3ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZygndXBkYXRpbmc6ICcsIHRoaXMpXG4gICAgICAgIC8vdGhpcy5zZXRfdmFsdWUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVfb3B0aW9ucygpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHVwZGF0ZV9vcHRpb25zOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgb2xkX3ZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgICAgaWYoIHRoaXMua29udGFpbmVyLnJlYWR5ICkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMua29udGFpbmVyLmdldCgpO1xuICAgICAgICAgICAgaWYoIHR5cGVvZiB0aGlzLnZhbHVlID09IFwib2JqZWN0XCIpIHRoaXMudmFsdWUgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggdGhpcy5vcHRpb25zS29udGFpbmVyLnJlYWR5ICYmIHRoaXMua29udGFpbmVyLnJlYWR5ICkge1xuICAgICAgICAgICAgdmFyIG9sZF9vcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gdGhpcy5vcHRpb25zS29udGFpbmVyLmdldCgpO1xuICAgICAgICAgICAgaWYoIHRoaXMub3B0aW9ucyBpbnN0YW5jZW9mIEFycmF5ICl7XG4gICAgICAgICAgICAgICAgLy90aGlzLm9wdGlvbnMudW5zaGlmdCgnJyk7XG4gICAgICAgICAgICAgICAgaWYoIHRoaXMub3B0aW9ucyAhPT0gb2xkX29wdGlvbnN8fCB0aGlzLnZhbHVlICE9PSBvbGRfdmFsdWUgKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIHRoaXMub3B0aW9ucyAhPT0gdW5kZWZpbmVkICYmIHRoaXMub3B0aW9ucyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMuZWxlbS5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbS5pbm5lckhUTUwgPSAnPG9wdGlvbiBzZWxlY3RlZCBkaXNhYmxlZCBoaWRkZW4+PC9vcHRpb24+J1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmZvckVhY2goZnVuY3Rpb24odmFsdWUsaWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgby52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLnZhbHVlICl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCB2YWx1ZS50b1N0cmluZygpID09PSB0aGlzLnZhbHVlLnRvU3RyaW5nKCkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdmb3VuZCBpdDonLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLnNlbGVjdGVkID0gXCJzZWxlY3RlZFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZG9lcyBub3QgbWF0Y2g6ICcsIHZhbHVlLCB0aGlzLnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vby5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlbGVjdG9yX29wdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ25vIGN1cnJlbnQgdmFsdWUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLmlubmVySFRNTCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW0uYXBwZW5kQ2hpbGQobyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rvcl9vYmogPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3Jfb2JqLmNoYW5nZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9pZiggISAodGhpcy5vcHRpb25zLmluZGV4T2YodGhpcy5rb250YWluZXIuZ2V0KCkpKzEpICl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICB0aGlzLnNldF92YWx1ZSh0aGlzLm9wdGlvbnNbMF0udmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0VXBkYXRlOiBmdW5jdGlvbih1cGRhdGVfZnVuY3Rpb24pe1xuICAgICAgICB0aGlzLmdfdXBkYXRlID0gdXBkYXRlX2Z1bmN0aW9uO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldFJlZjogZnVuY3Rpb24ocmVmU3RyaW5nKXtcbiAgICAgICAgdGhpcy5yZWZTdHJpbmcgPSByZWZTdHJpbmc7XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmVmT2JqZWN0ICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyID0gT2JqZWN0LmNyZWF0ZShrb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIucmVmKHRoaXMucmVmU3RyaW5nKTtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldFJlZk9iajogZnVuY3Rpb24ocmVmT2JqZWN0KXtcbiAgICAgICAgdGhpcy5yZWZPYmplY3QgPSByZWZPYmplY3Q7XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmVmU3RyaW5nICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyID0gT2JqZWN0LmNyZWF0ZShrb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIucmVmKHRoaXMucmVmU3RyaW5nKTtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMub3B0aW9uc0tvbnRhaW5lciA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmVmT3B0aW9uc1N0cmluZyAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNLb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMub3B0aW9uc0tvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zS29udGFpbmVyLnJlZih0aGlzLnJlZk9wdGlvbnNTdHJpbmcpO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zS29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXRPcHRpb25zUmVmOiBmdW5jdGlvbihyZWZTdHJpbmcpe1xuICAgICAgICB0aGlzLnJlZk9wdGlvbnNTdHJpbmcgPSByZWZTdHJpbmc7XG4gICAgICAgIGlmKCB0aGlzLm9wdGlvbnNLb250YWluZXIgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlZk9iamVjdCAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNLb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMub3B0aW9uc0tvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zS29udGFpbmVyLnJlZih0aGlzLnJlZk9wdGlvbnNTdHJpbmcpO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zS29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxufTtcbmZvciggdmFyIGlkIGluIHdyYXBwZXJfcHJvdG90eXBlICkge1xuICAgIGlmKCB3cmFwcGVyX3Byb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShpZCkgKSB7XG4gICAgICAgIHNlbGVjdG9yX3Byb3RvdHlwZVtpZF0gPSB3cmFwcGVyX3Byb3RvdHlwZVtpZF07XG4gICAgfVxufVxuXG52YXIgc2VsZWN0b3IgPSBmdW5jdGlvbigpe1xuICAgIHZhciBzID0gT2JqZWN0LmNyZWF0ZShzZWxlY3Rvcl9wcm90b3R5cGUpO1xuICAgIHMudHlwZSA9ICdzZWxlY3Rvcic7XG4gICAgcy5lbGVtPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICBzLmVsZW0uc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZWxlY3Rvcl9tZW51Jyk7XG5cbiAgICByZXR1cm4gcztcbn07XG5cblxuXG5cblxudmFyIHZhbHVlX3Byb3RvdHlwZSA9IHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ3J1bm5pbmcgdmFsdWUgdXBkYXRlJywgdGhpcylcbiAgICAgICAgLypcbiAgICAgICAgaWYoIHRoaXMuZ191cGRhdGUgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgdGhpcy5nX3VwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgICovXG4gICAgICAgdmFyIGRlY2ltYWxzID0gdGhpcy5kZWNpbWFscyB8fCAzO1xuICAgICAgICBpZiggdHlwZW9mIHRoaXMua29udGFpbmVyICE9PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMua29udGFpbmVyLmdldCgpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygndXBkYXRpbmcgdmFsdWUnLCB0aGlzLnZhbHVlKVxuICAgICAgICB9XG4gICAgICAgIGlmKCBpc05hTihOdW1iZXIodGhpcy52YWx1ZSkpICl7XG4gICAgICAgICAgICB0aGlzLmVsZW0uaW5uZXJIVE1MID0gdGhpcy52YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbS5pbm5lckhUTUwgPSBOdW1iZXIodGhpcy52YWx1ZSkudG9GaXhlZChkZWNpbWFscyk7XG4gICAgICAgICAgICBpZiggdGhpcy5taW4gIT09IHVuZGVmaW5lZCAmJiB0aGlzLnZhbHVlIDw9IHRoaXMubWluICkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0cignY2xhc3MnLCAndmFsdWVPdXRPZlJhbmdlJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoIHRoaXMubWF4ICE9PSB1bmRlZmluZWQgJiYgdGhpcy52YWx1ZSA+PSB0aGlzLm1heCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHIoJ2NsYXNzJywgJ3ZhbHVlT3V0T2ZSYW5nZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHIoJ2NsYXNzJywgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbihuZXdfdmFsdWUpIHtcbiAgICAgICAgaWYoIHR5cGVvZiBuZXdfdmFsdWUgIT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gbmV3X3ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4vLyAgICBzZXRVcGRhdGU6IGZ1bmN0aW9uKHVwZGF0ZV9mdW5jdGlvbil7XG4vLyAgICAgICAgdGhpcy5nX3VwZGF0ZSA9IHVwZGF0ZV9mdW5jdGlvbjtcbi8vICAgIH0sXG4gICAgc2V0UmVmOiBmdW5jdGlvbihyZWZTdHJpbmcpe1xuICAgICAgICB0aGlzLnJlZlN0cmluZyA9IHJlZlN0cmluZztcbiAgICAgICAgaWYoIHRoaXMua29udGFpbmVyID09PSB1bmRlZmluZWQgJiYgdGhpcy5yZWZPYmplY3QgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMua29udGFpbmVyICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lci5yZWYodGhpcy5yZWZTdHJpbmcpO1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIub2JqKHRoaXMucmVmT2JqZWN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0UmVmT2JqOiBmdW5jdGlvbihyZWZPYmplY3Qpe1xuICAgICAgICB0aGlzLnJlZk9iamVjdCA9IHJlZk9iamVjdDtcbiAgICAgICAgaWYoIHRoaXMua29udGFpbmVyID09PSB1bmRlZmluZWQgJiYgdGhpcy5yZWZTdHJpbmcgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMua29udGFpbmVyICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lci5yZWYodGhpcy5yZWZTdHJpbmcpO1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIub2JqKHRoaXMucmVmT2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldE1heDogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICB0aGlzLm1heCA9IHZhbHVlO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldE1pbjogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICB0aGlzLm1pbiA9IHZhbHVlO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldERlY2ltYWxzOiBmdW5jdGlvbihuKXtcbiAgICAgICAgdGhpcy5kZWNpbWFscyA9IG47XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG59O1xuZm9yKCB2YXIgaWQgaW4gd3JhcHBlcl9wcm90b3R5cGUgKSB7XG4gICAgaWYoIHdyYXBwZXJfcHJvdG90eXBlLmhhc093blByb3BlcnR5KGlkKSApIHtcbiAgICAgICAgdmFsdWVfcHJvdG90eXBlW2lkXSA9IHdyYXBwZXJfcHJvdG90eXBlW2lkXTtcbiAgICB9XG59XG5cblxuXG5mdW5jdGlvbiB2YWx1ZSgpIHtcbiAgICB2YXIgdiA9IE9iamVjdC5jcmVhdGUodmFsdWVfcHJvdG90eXBlKTtcbiAgICB2LnR5cGUgPSAndmFsdWUnO1xuICAgIHYuZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblxuICAgIHYudmFsdWUgPSAnLSc7XG4gICAgdi5pbm5lckhUTUwgPSB2LnZhbHVlO1xuICAgIHYucmVmZXJlbmNlID0gZmFsc2U7XG5cblxuICAgIHYudXBkYXRlKCk7XG5cbiAgICByZXR1cm4gdjtcbn1cblxuXG5cbi8vIEJyb3dzZXJpZnlcbm1vZHVsZS5leHBvcnRzLnNlbGVjdG9yID0gc2VsZWN0b3I7XG5tb2R1bGUuZXhwb3J0cy52YWx1ZSA9IHZhbHVlO1xuLy9tb2R1bGUuZXhwb3J0cy4kID0gJDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGtvbnRhaW5lciA9IHtcbiAgICByZWY6IGZ1bmN0aW9uKHJlZlN0cmluZyl7XG4gICAgICAgIGlmKCB0eXBlb2YgcmVmU3RyaW5nID09PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVmU3RyaW5nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZWZTdHJpbmcgPSByZWZTdHJpbmc7XG4gICAgICAgICAgICB0aGlzLnJlZkFycmF5ID0gcmVmU3RyaW5nLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICBpZiggdHlwZW9mIHRoaXMub2JqZWN0ICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIG9iajogZnVuY3Rpb24ob2JqKXtcbiAgICAgICAgaWYoIHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vYmplY3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9iamVjdCA9IG9iajtcbiAgICAgICAgICAgIGlmKCB0eXBlb2YgdGhpcy5yZWZTdHJpbmcgIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbihpbnB1dCl7XG4gICAgICAgIGlmKCB0eXBlb2YgdGhpcy5vYmplY3QgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiB0aGlzLnJlZlN0cmluZyA9PT0gJ3VuZGVmaW5lZCcgKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5vYmplY3Q7XG4gICAgICAgIHZhciBsYXN0X2xldmVsID0gdGhpcy5yZWZBcnJheVt0aGlzLnJlZkFycmF5Lmxlbmd0aC0xXTtcblxuICAgICAgICB0aGlzLnJlZkFycmF5LmZvckVhY2goZnVuY3Rpb24obGV2ZWxfbmFtZSxpKXtcbiAgICAgICAgICAgIGlmKCB0eXBlb2YgcGFyZW50W2xldmVsX25hbWVdID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRbbGV2ZWxfbmFtZV0gPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCBsZXZlbF9uYW1lICE9PSBsYXN0X2xldmVsICl7XG4gICAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50W2xldmVsX25hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcGFyZW50W2xhc3RfbGV2ZWxdID0gaW5wdXQ7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ3NldHRpbmc6JywgaW5wdXQsIHRoaXMuZ2V0KCksIHRoaXMucmVmU3RyaW5nICk7XG4gICAgICAgIHJldHVybiBwYXJlbnRbbGFzdF9sZXZlbF07XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBsZXZlbCA9IHRoaXMub2JqZWN0O1xuICAgICAgICB0aGlzLnJlZkFycmF5LmZvckVhY2goZnVuY3Rpb24obGV2ZWxfbmFtZSxpKXtcbiAgICAgICAgICAgIGlmKCB0eXBlb2YgbGV2ZWxbbGV2ZWxfbmFtZV0gPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldmVsID0gbGV2ZWxbbGV2ZWxfbmFtZV07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbGV2ZWw7XG4gICAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga29udGFpbmVyO1xuIiwidmFyIHdyYXBwZXJfcHJvdG90eXBlID0ge1xuXG4gICAgaHRtbDogZnVuY3Rpb24oaHRtbCl7XG4gICAgICAgdGhpcy5lbGVtLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBocmVmOiBmdW5jdGlvbihsaW5rKXtcbiAgICAgICB0aGlzLmVsZW0uaHJlZiA9IGxpbms7XG4gICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBhcHBlbmQ6IGZ1bmN0aW9uKHN1Yl9lbGVtZW50KXtcbiAgICAgICAgdGhpcy5nZXQoMCkuYXBwZW5kQ2hpbGQoc3ViX2VsZW1lbnQuZWxlbSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgYXBwZW5kVG86IGZ1bmN0aW9uKHBhcmVudF9lbGVtZW50KXtcbiAgICAgICAgLy9wYXJlbnRfZWxlbWVudC5hcHBlbmQodGhpcyk7XG4gICAgICAgIHBhcmVudF9lbGVtZW50LmdldCgwKS5hcHBlbmRDaGlsZCh0aGlzLmVsZW0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGF0dHI6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKXtcbiAgICAgICAgdmFyIGF0dHJpYnV0ZU5hbWU7XG4gICAgICAgIGlmKCBuYW1lID09PSAnY2xhc3MnKXtcbiAgICAgICAgICAgIGF0dHJpYnV0ZU5hbWUgPSAnY2xhc3NOYW1lJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZU5hbWUgPSBuYW1lO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbVthdHRyaWJ1dGVOYW1lXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNsaWNrOiBmdW5jdGlvbihjbGlja0Z1bmN0aW9uKXtcbiAgICAgICAgY29uc29sZS5sb2coJ3NldHRpbmcgY2xpY2sgdG8gJywgdHlwZW9mIGNsaWNrRnVuY3Rpb24sIGNsaWNrRnVuY3Rpb24pXG4gICAgICAgIHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXsgY2xpY2tGdW5jdGlvbigpOyB9LCBmYWxzZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2hvdzogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5lbGVtLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lJztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBoaWRlOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLmVsZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzdHlsZTogZnVuY3Rpb24oZmllbGQsIHZhbHVlKXtcbiAgICAgICAgdGhpcy5lbGVtLnN0eWxlW2ZpZWxkXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNzczogZnVuY3Rpb24oZmllbGQsIHZhbHVlKXtcbiAgICAgICAgdGhpcy5lbGVtLnN0eWxlW2ZpZWxkXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIC8qXG4gICAgLypcbiAgICBwdXNoVG86IGZ1bmN0aW9uKGFycmF5KXtcbiAgICAgICAgYXJyYXkucHVzaCh0aGlzKTtcbiAgICB9XG4gICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uKGkpe1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtXG59XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gd3JhcHBlcl9wcm90b3R5cGU7XG4iLCIndXNlIHN0cmljdCc7XG4vL3ZhciB2ZXJzaW9uX3N0cmluZyA9ICdEZXYnO1xuLy92YXIgdmVyc2lvbl9zdHJpbmcgPSAnQWxwaGEyMDE0MDEtLSc7XG52YXIgdmVyc2lvbl9zdHJpbmcgPSAnUHJldmlldycrbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1ERCcpO1xuXG4vLyBNb3ZlZCB0byBpbmRleC5odG1sXG4vLyBUT0RPOiBsb29rIGludG8gd2F5cyB0byBmdXJ0aGVyIHJlZHVjZSBzaXplLiBJdCBzZWVtcyB3YXkgdG8gYmlnLlxuLy92YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbi8vdmFyIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xuLy92YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG52YXIgayA9IHJlcXVpcmUoJy4vbGliL2svay5qcycpO1xuLy92YXIga19kYXRhID0gcmVxdWlyZSgnLi9saWIvay9rX2RhdGEnKTtcblxudmFyIHNldHRpbmdzID0gcmVxdWlyZSgnLi9hcHAvc2V0dGluZ3MnKTtcbndpbmRvdy5nID0gc2V0dGluZ3M7XG5zZXR0aW5ncy5zdGF0ZS52ZXJzaW9uX3N0cmluZyA9IHZlcnNpb25fc3RyaW5nO1xuY29uc29sZS5sb2coJ3NldHRpbmdzJywgc2V0dGluZ3MpO1xuXG52YXIgbWtfcGFnZSA9IHt9O1xubWtfcGFnZVsxXSA9IHJlcXVpcmUoJy4vYXBwL21rX3BhZ2VfMScpO1xubWtfcGFnZVsyXSA9IHJlcXVpcmUoJy4vYXBwL21rX3BhZ2VfMicpO1xubWtfcGFnZVszXSA9IHJlcXVpcmUoJy4vYXBwL21rX3BhZ2VfMycpO1xuXG52YXIgbWtfcHJldmlldyA9IHt9O1xubWtfcHJldmlld1sxXSA9IHJlcXVpcmUoJy4vYXBwL21rX3BhZ2VfcHJldmlld18xJyk7XG5ta19wcmV2aWV3WzJdID0gcmVxdWlyZSgnLi9hcHAvbWtfcGFnZV9wcmV2aWV3XzInKTtcblxudmFyIG1rX3N2Zz0gcmVxdWlyZSgnLi9hcHAvbWtfc3ZnJyk7XG4vL3ZhciBta19wZGYgPSByZXF1aXJlKCcuL2FwcC9ta19wZGYuanMnKTtcbnZhciBzZXR0aW5nc191cGRhdGUgPSByZXF1aXJlKCcuL2FwcC9zZXR0aW5nc191cGRhdGUnKTtcblxuXG5cbnZhciBmID0gcmVxdWlyZSgnLi9hcHAvZnVuY3Rpb25zJyk7XG5mLnNldHRpbmdzID0gc2V0dGluZ3M7XG5zZXR0aW5ncy5mID0gZjtcblxuLy92YXIgZGF0YWJhc2VfanNvbl9VUkwgPSAnaHR0cDovLzEwLjE3My42NC4yMDQ6ODAwMC90ZW1wb3JhcnkvJztcbnZhciBkYXRhYmFzZV9qc29uX1VSTCA9ICdkYXRhL2ZzZWNfY29weS5qc29uJztcblxudmFyIGNvbXBvbmVudHMgPSBzZXR0aW5ncy5jb21wb25lbnRzO1xudmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcblxuXG52YXIgcXVlcnkgPSBmLnF1ZXJ5X3N0cmluZygpO1xuLy9jb25zb2xlLmxvZyhxdWVyeSk7XG5pZiggcXVlcnlbJ21vZGUnXSA9PT0gXCJkZXZcIiApIHtcbiAgICBnLnN0YXRlLm1vZGUgPSAnZGV2Jztcbn0gZWxzZSB7XG4gICAgZy5zdGF0ZS5tb2RlID0gJ3JlbGVhc2UnO1xufVxuXG5cblxuJC5nZXRKU09OKCBkYXRhYmFzZV9qc29uX1VSTClcbiAgICAuZG9uZShmdW5jdGlvbihqc29uKXtcbiAgICAgICAgc2V0dGluZ3MuZGF0YWJhc2UgPSBqc29uO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdkYXRhYmFzZSBsb2FkZWQnLCBzZXR0aW5ncy5kYXRhYmFzZSk7XG4gICAgICAgIGYubG9hZF9kYXRhYmFzZShqc29uKTtcbiAgICAgICAgc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgdXBkYXRlKCk7XG4gICAgICAgIC8vY29uc29sZS5sb2coICdzZXR0aW5ncy5lbGVtZW50cycsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzLmVsZW1lbnRzLCBudWxsLCA0KSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coICdzeXN0ZW0nLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncy5zeXN0ZW0sIG51bGwsIDQpKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggJ2lucHV0cycsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzLmlucHV0cywgbnVsbCwgNCkpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCAnZHJhd2luZycsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzLmRyYXdpbmcsIG51bGwsIDQpKTtcbiAgICB9KTtcblxuXG52YXIgYWN0aXZlX3NlY3Rpb24gPSBnLndlYnBhZ2Uuc2VjdGlvbnNbMF07XG5cbnZhciB1cGRhdGUgPSBzZXR0aW5ncy51cGRhdGUgPSBmdW5jdGlvbigpe1xuICAgIGNvbnNvbGUubG9nKCcvLS0tIGJlZ2luIHVwZGF0ZScpO1xuICAgIGYuY2xlYXJfZHJhd2luZygpO1xuXG5cbiAgICBzZXR0aW5ncy5zZWxlY3RfcmVnaXN0cnkuZm9yRWFjaChmdW5jdGlvbihzZWxlY3Rvcil7XG4gICAgICAgIC8vY29uc29sZS5sb2coc2VsZWN0b3IudmFsdWUoKSk7XG4gICAgICAgIGlmKHNlbGVjdG9yLnZhbHVlKCkpIHNlbGVjdG9yLnN5c3RlbV9yZWYuc2V0KHNlbGVjdG9yLnZhbHVlKCkpO1xuICAgICAgICAvL2lmKHNlbGVjdG9yLnZhbHVlKCkpIHNlbGVjdG9yLmlucHV0X3JlZi5zZXQoc2VsZWN0b3IudmFsdWUoKSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coc2VsZWN0b3Iuc2V0X3JlZi5yZWZTdHJpbmcsIHNlbGVjdG9yLnZhbHVlKCksIHNlbGVjdG9yLnNldF9yZWYuZ2V0KCkpO1xuXG4gICAgfSk7XG5cblxuICAgIC8vY29weSBpbnB1dHMgZnJvbSBzZXR0aW5ncy5pbnB1dCB0byBzZXR0aW5ncy5zeXN0ZW0uXG5cblxuICAgIHNldHRpbmdzX3VwZGF0ZShzZXR0aW5ncyk7XG5cbiAgICBzZXR0aW5ncy5zZWxlY3RfcmVnaXN0cnkuZm9yRWFjaChmdW5jdGlvbihzZWxlY3Rvcil7XG4gICAgICAgIGlmKCBzZWxlY3Rvci50eXBlID09PSAnc2VsZWN0JyApe1xuICAgICAgICAgICAgZi5zZWxlY3Rvcl9hZGRfb3B0aW9ucyhzZWxlY3Rvcik7XG4gICAgICAgIH0gZWxzZSBpZiggc2VsZWN0b3IudHlwZSA9PT0gJ2lucHV0JyApIHtcbiAgICAgICAgICAgIHNlbGVjdG9yLmVsZW0udmFsdWUgPSBzZWxlY3Rvci5zeXN0ZW1fcmVmLmdldCgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBzZXR0aW5ncy52YWx1ZV9yZWdpc3RyeS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlX2l0ZW0pe1xuICAgICAgICB2YWx1ZV9pdGVtLmVsZW0uaW5uZXJIVE1MID0gdmFsdWVfaXRlbS52YWx1ZV9yZWYuZ2V0KCk7XG4gICAgfSk7XG5cbiAgICAvLyBEZXRlcm1pbmUgYWN0aXZlIHNlY3Rpb24gYmFzZWQgb24gc2VjdGlvbiBpbnB1dHMgZW50ZXJlZCBieSB1c2VyXG4gICAgdmFyIHNlY3Rpb25zID0gZy53ZWJwYWdlLnNlY3Rpb25zO1xuICAgIHNlY3Rpb25zLmV2ZXJ5KGZ1bmN0aW9uKHNlY3Rpb25fbmFtZSxpZCl7IC8vVE9ETzogZmluZCBwcmUgSUU5IHdheSB0byBkbyB0aGlzP1xuICAgICAgICBpZiggISBnLmYuc2VjdGlvbl9kZWZpbmVkKHNlY3Rpb25fbmFtZSkgKXtcbiAgICAgICAgICAgIGFjdGl2ZV9zZWN0aW9uID0gc2VjdGlvbl9uYW1lO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYoIGlkID09PSBzZWN0aW9ucy5sZW5ndGgtMSApeyAvL0lmIGxhc3Qgc2VjdGlvbiBpcyBkZWZpbmVkLCB0aGVyZSBpcyBubyBhY3RpdmUgc2VjdGlvblxuICAgICAgICAgICAgICAgIGFjdGl2ZV9zZWN0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vIENsb3NlIHNlY3Rpb24gaWYgdGhleSBhcmUgbm90IGFjdGl2ZSBzZWN0aW9ucywgdW5sZXNzIHRoZXkgaGF2ZSBiZWVuIG9wZW5lZCBieSB0aGUgdXNlciwgb3BlbiB0aGUgYWN0aXZlIHNlY3Rpb25cbiAgICBzZWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHNlY3Rpb25fbmFtZSxpZCl7IC8vVE9ETzogZmluZCBwcmUgSUU5IHdheSB0byBkbyB0aGlzP1xuICAgICAgICBpZiggc2VjdGlvbl9uYW1lID09PSBhY3RpdmVfc2VjdGlvbiApe1xuICAgICAgICAgICAgJCgnLmlucHV0X3NlY3Rpb24jJytzZWN0aW9uX25hbWUpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlRG93bignZmFzdCcpO1xuICAgICAgICB9IGVsc2UgaWYoICEgZy53ZWJwYWdlLnNlbGVjdGlvbnNfbWFudWFsX3RvZ2dsZWRbc2VjdGlvbl9uYW1lXSApe1xuICAgICAgICAgICAgJCgnLmlucHV0X3NlY3Rpb24jJytzZWN0aW9uX25hbWUpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlVXAoJ2Zhc3QnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cblxuICAgIC8vIE1ha2UgcHJldmlld1xuICAgIHNldHRpbmdzLmRyYXdpbmcucHJldmlld19wYXJ0cyA9IHt9O1xuICAgIHNldHRpbmdzLmRyYXdpbmcucHJldmlld19zdmdzID0ge307XG4gICAgJCgnI2RyYXdpbmdfcHJldmlldycpLmVtcHR5KCkuaHRtbCgnJyk7XG4gICAgZm9yKCB2YXIgcCBpbiBta19wcmV2aWV3ICl7XG4gICAgICAgIHNldHRpbmdzLmRyYXdpbmcucHJldmlld19wYXJ0c1twXSA9IG1rX3ByZXZpZXdbcF0oc2V0dGluZ3MpO1xuICAgICAgICBzZXR0aW5ncy5kcmF3aW5nLnByZXZpZXdfc3Znc1twXSA9IG1rX3N2ZyhzZXR0aW5ncy5kcmF3aW5nLnByZXZpZXdfcGFydHNbcF0sIHNldHRpbmdzKTtcbiAgICAgICAgdmFyIHNlY3Rpb24gPSBbJycsJ0VsZWN0cmljYWwnLCdTdHJ1Y3R1cmFsJ11bcF07XG4gICAgICAgICQoJyNkcmF3aW5nX3ByZXZpZXcnKVxuICAgICAgICAgICAgLy8uYXBwZW5kKCQoJzxwPlBhZ2UgJytwKyc8L3A+JykpXG4gICAgICAgICAgICAuYXBwZW5kKCQoJzxwPicrc2VjdGlvbisnPC9wPicpKVxuICAgICAgICAgICAgLmFwcGVuZCgkKHNldHRpbmdzLmRyYXdpbmcucHJldmlld19zdmdzW3BdKSlcbiAgICAgICAgICAgIC5hcHBlbmQoJCgnPC9icj4nKSlcbiAgICAgICAgICAgIC5hcHBlbmQoJCgnPC9icj4nKSk7XG5cbiAgICB9XG5cblxuXG4gICAgLy8gTWFrZSBkcmF3aW5nXG4gICAgc2V0dGluZ3MuZHJhd2luZy5wYXJ0cyA9IHt9O1xuICAgIHNldHRpbmdzLmRyYXdpbmcuc3ZncyA9IHt9O1xuICAgICQoJyNkcmF3aW5nJykuZW1wdHkoKS5odG1sKCdFbGVjdHJpY2FsJyk7XG4gICAgZm9yKCBwIGluIG1rX3BhZ2UgKXtcbiAgICAgICAgc2V0dGluZ3MuZHJhd2luZy5wYXJ0c1twXSA9IG1rX3BhZ2VbcF0oc2V0dGluZ3MpO1xuICAgICAgICBzZXR0aW5ncy5kcmF3aW5nLnN2Z3NbcF0gPSBta19zdmcoc2V0dGluZ3MuZHJhd2luZy5wYXJ0c1twXSwgc2V0dGluZ3MpO1xuICAgICAgICAkKCcjZHJhd2luZycpXG4gICAgICAgICAgICAvLy5hcHBlbmQoJCgnPHA+UGFnZSAnK3ArJzwvcD4nKSlcbiAgICAgICAgICAgIC5hcHBlbmQoJChzZXR0aW5ncy5kcmF3aW5nLnN2Z3NbcF0pKVxuICAgICAgICAgICAgLmFwcGVuZCgkKCc8L2JyPicpKVxuICAgICAgICAgICAgLmFwcGVuZCgkKCc8L2JyPicpKTtcblxuICAgIH1cblxuXG5cblxuXG4gICAgLy8qL1xuICAgIC8vdmFyIHBkZl9kb3dubG9hZCA9IG1rX3BkZihzZXR0aW5ncywgc2V0RG93bmxvYWRMaW5rKTtcbiAgICAvL21rX3BkZihzZXR0aW5ncywgc2V0RG93bmxvYWRMaW5rKTtcbiAgICAvL3BkZl9kb3dubG9hZC5odG1sKCdEb3dubG9hZCBQREYnKTtcbiAgICAvL2NvbnNvbGUubG9nKHBkZl9kb3dubG9hZCk7XG4gICAgLy9pZiggc2V0dGluZ3MuUERGICYmIHNldHRpbmdzLlBERi51cmwgKXtcbiAgICAvLyAgICB2YXIgbGluayA9ICQoJ2EnKS5hdHRyKCdocmVmJywgc2V0dGluZ3MuUERGLnVybCApLmh0bWwoJ2Rvd25sb2FkLi4nKTtcbiAgICAvLyAgICAkKCcjZG93bmxvYWQnKS5hcHBlbmQobGluayk7XG4gICAgLy99XG5cblxuICAgIC8vay5zaG93X2hpZGVfcGFyYW1zKHBhZ2Vfc2VjdGlvbnNfcGFyYW1zLCBzZXR0aW5ncyk7XG4vLyAgICBzaG93X2hpZGVfc2VsZWN0aW9ucyhwYWdlX3NlY3Rpb25zX2NvbmZpZywgc2V0dGluZ3Muc3RhdGUuYWN0aXZlX3NlY3Rpb24pO1xuXG4gICAgLy9jb25zb2xlLmxvZyggZi5vYmplY3RfZGVmaW5lZChzZXR0aW5ncy5zdGF0ZSkgKTtcblxuICAgIC8vY29uc29sZS5sb2coICdzeXN0ZW0nLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncy5zeXN0ZW0sIG51bGwsIDQpKTtcbiAgICAvL2NvbnNvbGUubG9nKCAnaW5wdXRzJywgSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MuaW5wdXRzLCBudWxsLCA0KSk7XG4gICAgLy9jb25zb2xlLmxvZyggJ2RyYXdpbmcnLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncy5kcmF3aW5nLCBudWxsLCA0KSk7XG5cbiAgICBjb25zb2xlLmxvZygnXFxcXC0tLSBlbmQgdXBkYXRlJyk7XG59O1xuZi51cGRhdGUgPSB1cGRhdGU7XG5cblxuXG5cblxuXG5cblxuXG4vLyBEZXYgc2V0dGluZ3Ncbi8qXG5pZiggdmVyc2lvbl9zdHJpbmcgPT09ICdEZXYnICYmIHRydWUgKXtcbiAgICBmb3IoIHZhciBzZWN0aW9uIGluIHNldHRpbmdzLnN0YXRlLnNlY3Rpb25zICl7XG4gICAgICAgIHNldHRpbmdzLnN0YXRlLnNlY3Rpb25zW3NlY3Rpb25dLnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgc2V0dGluZ3Muc3RhdGUuc2VjdGlvbnNbc2VjdGlvbl0uc2V0ID0gdHJ1ZTtcbiAgICB9XG59IGVsc2Uge1xuICAgIHNldHRpbmdzLnN0YXRlLnNlY3Rpb25zLm1vZHVsZXMucmVhZHkgPSB0cnVlO1xufVxuLy8qL1xuLy8vLy8vLy9cblxuXG5cblxuZnVuY3Rpb24gcGFnZV9zZXR1cChzZXR0aW5ncyl7XG4gICAgdmFyIHN5c3RlbV9mcmFtZV9pZCA9ICdzeXN0ZW1fZnJhbWUnO1xuICAgIHZhciB0aXRsZSA9ICdQViBkcmF3aW5nIHRlc3QnO1xuXG4gICAgay5zZXR1cF9ib2R5KHRpdGxlKTtcblxuICAgIHZhciBwYWdlID0gJCgnPGRpdj4nKS5hdHRyKCdjbGFzcycsICdwYWdlJykuYXBwZW5kVG8oJChkb2N1bWVudC5ib2R5KSk7XG4gICAgLy9wYWdlLnN0eWxlKCd3aWR0aCcsIChzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy53KzIwKS50b1N0cmluZygpICsgJ3B4JyApXG5cbiAgICB2YXIgc3lzdGVtX2ZyYW1lID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsIHN5c3RlbV9mcmFtZV9pZCkuYXBwZW5kVG8ocGFnZSk7XG5cblxuICAgIHZhciBoZWFkZXJfY29udGFpbmVyID0gJCgnPGRpdj4nKS5hcHBlbmRUbyhzeXN0ZW1fZnJhbWUpO1xuICAgICQoJzxzcGFuPicpLmh0bWwoJ1BsZWFzZSBzZWxlY3QgeW91ciBzeXN0ZW0gc3BlYyBiZWxvdycpLmF0dHIoJ2NsYXNzJywgJ2NhdGVnb3J5X3RpdGxlJykuYXBwZW5kVG8oaGVhZGVyX2NvbnRhaW5lcik7XG4gICAgJCgnPHNwYW4+JykuaHRtbCgnIHwgJykuYXBwZW5kVG8oaGVhZGVyX2NvbnRhaW5lcik7XG4gICAgLy8kKCc8aW5wdXQ+JykuYXR0cigndHlwZScsICdidXR0b24nKS5hdHRyKCd2YWx1ZScsICdjbGVhciBzZWxlY3Rpb25zJykuY2xpY2sod2luZG93LmxvY2F0aW9uLnJlbG9hZCksXG4gICAgJCgnPGE+JykuYXR0cignaHJlZicsICdqYXZhc2NyaXB0OndpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKScpLmh0bWwoJ2NsZWFyIHNlbGVjdGlvbnMnKS5hcHBlbmRUbyhoZWFkZXJfY29udGFpbmVyKTtcblxuXG4gICAgLy8gU3lzdGVtIHNldHVwXG4gICAgJCgnPGRpdj4nKS5odG1sKCdTeXN0ZW0gU2V0dXAnKS5hdHRyKCdjbGFzcycsICdzZWN0aW9uX3RpdGxlJykuYXBwZW5kVG8oc3lzdGVtX2ZyYW1lKTtcbiAgICB2YXIgY29uZmlnX2ZyYW1lID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdjb25maWdfZnJhbWUnKS5hcHBlbmRUbyhzeXN0ZW1fZnJhbWUpO1xuXG4gICAgLy9jb25zb2xlLmxvZyhzZWN0aW9uX3NlbGVjdG9yKTtcblxuXG5cbiAgICB2YXIgbG9jYXRpb25fZGl2ID0gJCgnPGRpdj4nKTtcblxuICAgIHZhciBsaXN0X2VsZW1lbnQgPSAkKCc8dWw+JykuYXBwZW5kVG8obG9jYXRpb25fZGl2KTtcbiAgICAkKCc8bGk+JykuYXBwZW5kVG8obGlzdF9lbGVtZW50KS5hcHBlbmQoXG4gICAgICAgICQoJzxhPicpLnRleHQoJ1dpbmQgWm9uZSAnKS5hdHRyKCdocmVmJywgJ2h0dHA6Ly93d3cuc29sYXJhYmNzLm9yZy9hYm91dC9wdWJsaWNhdGlvbnMvcmVwb3J0cy9leHBlZGl0ZWQtcGVybWl0L21hcC9pbmRleC5odG1sJylcbiAgICApO1xuICAgICQoJzxsaT4nKS5hcHBlbmRUbyhsaXN0X2VsZW1lbnQpLmFwcGVuZChcbiAgICAgICAgJCgnPGE+JykudGV4dCgnQ2xpbWF0ZSBDb25kaXRpb25zJykuYXR0cignaHJlZicsICdodHRwOi8vd2luZHNwZWVkLmF0Y291bmNpbC5vcmcvJylcbiAgICApO1xuICAgICQoJzxkaXY+JykuYXBwZW5kVG8obG9jYXRpb25fZGl2KS5hcHBlbmQoXG4gICAgICAgICQoJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9tYXBzL2VtYmVkP3BiPSExbTEwITFtOCExbTMhMWQzNjAzNDU5Ljg1NDA4OTA0NiEyZC04MS4zNzAyODA4MTgzNDcxNSEzZDI4LjExNTkxNjAxMTQyODIwOCEzbTIhMWkxMDI0ITJpNzY4ITRmMTMuMSE1ZTAhM20yITFzZW4hMnN1cyE0djE0MjE5NTQ0NjAzODVcIiB3aWR0aD1cIjQ4NVwiIGhlaWdodD1cIjMwMFwiIGZyYW1lYm9yZGVyPVwiMFwiIHN0eWxlPVwiYm9yZGVyOjBcIj48L2lmcmFtZT4nKVxuICAgICk7XG5cbiAgICB2YXIgbG9jYXRpb25fZHJhd2VyID0gZi5ta19kcmF3ZXIoJ0xvY2F0aW9uJywgbG9jYXRpb25fZGl2KTtcbiAgICBsb2NhdGlvbl9kcmF3ZXIuYXBwZW5kVG8oY29uZmlnX2ZyYW1lKTtcblxuXG4gICAgZi5hZGRfc2VsZWN0b3JzKHNldHRpbmdzLCBjb25maWdfZnJhbWUpO1xuXG4gICAgLy8gUGFyYW1ldGVycyBhbmQgc3BlY2lmaWNhdGlvbnNcbiAgICAvKlxuICAgICQoJzxkaXY+JykuaHRtbCgnU3lzdGVtIFBhcmFtZXRlcnMnKS5hdHRyKCdjbGFzcycsICdzZWN0aW9uX3RpdGxlJykuYXBwZW5kVG8oc3lzdGVtX2ZyYW1lKTtcbiAgICB2YXIgcGFyYW1zX2NvbnRhaW5lciA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAnc2VjdGlvbicpO1xuICAgIHBhcmFtc19jb250YWluZXIuYXBwZW5kVG8oc3lzdGVtX2ZyYW1lKTtcbiAgICBmLmFkZF9wYXJhbXMoIHNldHRpbmdzLCBwYXJhbXNfY29udGFpbmVyICk7XG4gICAgLy8qL1xuXG4gICAgLy9UT0RPOiBhZGQgc3ZnIGRpc3BsYXkgb2YgbW9kdWxlc1xuICAgIC8vIGh0dHA6Ly9xdW90ZS5zbmFwbnJhY2suY29tL3VpL28xMDAucGhwI3N0ZXAtMlxuXG4gICAgLy8gZHJhd2luZ1xuICAgIC8vdmFyIGRyYXdpbmcgPSAkKCdkaXYnKS5hdHRyKCdpZCcsICdkcmF3aW5nX2ZyYW1lJykuYXR0cignY2xhc3MnLCAnc2VjdGlvbicpLmFwcGVuZFRvKHBhZ2UpO1xuXG5cbiAgICB2YXIgZHJhd2luZ19wcmV2aWV3ID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkcmF3aW5nX2ZyYW1lX3ByZXZpZXcnKS5hcHBlbmRUbyhwYWdlKTtcbiAgICAkKCc8ZGl2PicpLmh0bWwoJ1ByZXZpZXcnKS5hdHRyKCdjbGFzcycsICdzZWN0aW9uX3RpdGxlJykuYXBwZW5kVG8oZHJhd2luZ19wcmV2aWV3KTtcbiAgICAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2RyYXdpbmdfcHJldmlldycpLmF0dHIoJ2NsYXNzJywgJ2RyYXdpbmcnKS5jc3MoJ2NsZWFyJywgJ2JvdGgnKS5hcHBlbmRUbyhkcmF3aW5nX3ByZXZpZXcpO1xuXG5cblxuXG5cbiAgICB2YXIgZHJhd2luZ19zZWN0aW9uID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkcmF3aW5nX2ZyYW1lJykuYXBwZW5kVG8ocGFnZSk7XG4gICAgLy9kcmF3aW5nLmNzcygnd2lkdGgnLCAoc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcudysyMCkudG9TdHJpbmcoKSArICdweCcgKTtcbiAgICAkKCc8ZGl2PicpLmh0bWwoJ0RyYXdpbmcnKS5hdHRyKCdjbGFzcycsICdzZWN0aW9uX3RpdGxlJykuYXBwZW5kVG8oZHJhd2luZ19zZWN0aW9uKTtcblxuXG4gICAgLy8kKCc8Zm9ybSBtZXRob2Q9XCJnZXRcIiBhY3Rpb249XCJkYXRhL3NhbXBsZS5wZGZcIj48YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5Eb3dubG9hZDwvYnV0dG9uPjwvZm9ybT4nKS5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pO1xuICAgIC8vJCgnPHNwYW4+JykuYXR0cignaWQnLCAnZG93bmxvYWQnKS5hdHRyKCdjbGFzcycsICdmbG9hdF9yaWdodCcpLmFwcGVuZFRvKGRyYXdpbmdfc2VjdGlvbik7XG4gICAgJCgnPGE+JylcbiAgICAgICAgLnRleHQoJ0Rvd25sb2FkIERyYXdpbmcgKHNhbXBsZSknKVxuICAgICAgICAuYXR0cignaHJlZicsICdkYXRhL3NhbXBsZS5wZGYnKVxuICAgICAgICAuYXR0cignaWQnLCAnZG93bmxvYWQnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnZmxvYXRfcmlnaHQnKVxuICAgICAgICAuYXBwZW5kVG8oZHJhd2luZ19zZWN0aW9uKTtcblxuICAgIHZhciBzdmdfY29udGFpbmVyX29iamVjdCA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAnZHJhd2luZycpLmF0dHIoJ2NsYXNzJywgJ2RyYXdpbmcnKS5jc3MoJ2NsZWFyJywgJ2JvdGgnKS5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pO1xuICAgIC8vc3ZnX2NvbnRhaW5lcl9vYmplY3Quc3R5bGUoJ3dpZHRoJywgc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcudysncHgnIClcbiAgICAvL3ZhciBzdmdfY29udGFpbmVyID0gc3ZnX2NvbnRhaW5lcl9vYmplY3QuZWxlbTtcbiAgICAkKCc8YnI+JykuYXBwZW5kVG8oZHJhd2luZ19zZWN0aW9uKTtcblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAkKCc8ZGl2PicpLmh0bWwoJyAnKS5hdHRyKCdjbGFzcycsICdzZWN0aW9uX3RpdGxlJykuYXBwZW5kVG8oZHJhd2luZ19zZWN0aW9uKTtcblxufVxuXG5wYWdlX3NldHVwKHNldHRpbmdzKTtcblxudmFyIGJvb3RfdGltZSA9IG1vbWVudCgpO1xudmFyIHN0YXR1c19pZCA9ICdzdGF0dXMnO1xuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXsgay51cGRhdGVfc3RhdHVzX3BhZ2Uoc3RhdHVzX2lkLCBib290X3RpbWUsIHZlcnNpb25fc3RyaW5nKTt9LDEwMDApO1xuXG51cGRhdGUoKTtcblxuLy9jb25zb2xlLmxvZygnd2luZG93Jywgd2luZG93KTtcbiJdfQ==
