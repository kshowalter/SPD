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

},{"../lib/k/k":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/k.js","../lib/k/k_DOM":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/k_DOM.js","../lib/k/kontainer":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/kontainer.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_blocks.js":[function(require,module,exports){
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

        system.roof.width  = system.roof.width || 60;
        system.roof.length = system.roof.length || 25;
        system.roof.slope  = system.roof.slope || "6:12";
        system.roof.type = system.roof.type || "Gable";

        system.inverter.location = system.inverter.location  || "Inside";

        system.module.orientation = system.module.orientation || "Portrait";


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
module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports={

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

var mk_blocks = require('./app/mk_blocks');

var mk_page = {};
mk_page[1] = require('./app/mk_page_1');
mk_page[2] = require('./app/mk_page_2');
mk_page[3] = require('./app/mk_page_3');
mk_page[4] = require('./app/mk_page_4');

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


    // Make blocks
    mk_blocks();

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

/*
    $('<iframe src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d3603459.854089046!2d-81.37028081834715!3d28.115916011428208!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1421954460385" width="485" height="300" frameborder="0" style="border:0"></iframe>')
        .appendTo(location_div);
    $('<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d546.6809043810994!2d-80.75649465851953!3d28.387302871406444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sus!4v1422038801287" width="485" height="300" frameborder="0" style="border:0"></iframe>')
        .appendTo(location_div);
//*/

    $('<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603348.697924068!2d-81.48660688926068!3d28.119223679502593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e0aa452b99af53%3A0x5e524913e44a8a65!2s1970+Michigan+Ave%2C+Cocoa%2C+FL+32922!5e0!3m2!1sen!2sus!4v1422050912489" width="485" height="300" frameborder="0" style="border:0"></iframe>')
        .appendTo(location_div);

    $('<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d323.1100977381417!2d-80.75332433820344!3d28.388875465695406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sus!4v1422051030319" width="485" height="300" frameborder="0" style="border:0"></iframe>')
        .appendTo(location_div);




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
        .attr('target', '_blank')
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

},{"./app/functions":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/functions.js","./app/mk_blocks":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_blocks.js","./app/mk_page_1":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_1.js","./app/mk_page_2":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_2.js","./app/mk_page_3":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_3.js","./app/mk_page_4":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_4.js","./app/mk_page_preview_1":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_preview_1.js","./app/mk_page_preview_2":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_page_preview_2.js","./app/mk_svg":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/mk_svg.js","./app/settings":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings.js","./app/settings_update":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/app/settings_update.js","./lib/k/k.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/k/k.js"}]},{},["/home/kshowalter/Dropbox/server/express_default/public/plans_machine/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9mdW5jdGlvbnMuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvbWtfYmxvY2tzLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvYXBwL21rX2JvcmRlci5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19kcmF3aW5nLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvYXBwL21rX3BhZ2VfMS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19wYWdlXzIuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvbWtfcGFnZV8zLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvYXBwL21rX3BhZ2VfNC5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19wYWdlX3ByZXZpZXdfMS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19wYWdlX3ByZXZpZXdfMi5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19zdmcuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvc2V0dGluZ3MuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvc2V0dGluZ3NfZHJhd2luZy5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9zZXR0aW5nc19mb250cy5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9zZXR0aW5nc19sYXllcnMuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvc2V0dGluZ3NfdXBkYXRlLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvZGF0YS90YWJsZXMuanNvbiIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2xpYi9rL2suanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9saWIvay9rX0RPTS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2xpYi9rL2tfRE9NX2V4dHJhLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvbGliL2sva29udGFpbmVyLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvbGliL2svd3JhcHBlcl9wcm90b3R5cGUuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNXFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeGtCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25QQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG4vL3ZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgayQgPSByZXF1aXJlKCcuLi9saWIvay9rX0RPTScpO1xudmFyIGsgPSByZXF1aXJlKCcuLi9saWIvay9rJyk7XG52YXIga29udGFpbmVyID0gcmVxdWlyZSgnLi4vbGliL2sva29udGFpbmVyJyk7XG5cbnZhciBmID0ge307XG5cbmYub2JqX25hbWVzID0gZnVuY3Rpb24oIG9iamVjdCApIHtcbiAgICBpZiggb2JqZWN0ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHZhciBhID0gW107XG4gICAgICAgIGZvciggdmFyIGlkIGluIG9iamVjdCApIHtcbiAgICAgICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoaWQpICkgIHtcbiAgICAgICAgICAgICAgICBhLnB1c2goaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbn07XG5cbmYub2JqZWN0X2RlZmluZWQgPSBmdW5jdGlvbihvYmplY3Qpe1xuICAgIC8vY29uc29sZS5sb2cob2JqZWN0KTtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0ICl7XG4gICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhrZXkpO1xuICAgICAgICAgICAgaWYoIG9iamVjdFtrZXldID09PSBudWxsIHx8IG9iamVjdFtrZXldID09PSB1bmRlZmluZWQgKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5mLnNlY3Rpb25fZGVmaW5lZCA9IGZ1bmN0aW9uKHNlY3Rpb25fbmFtZSl7XG4gICAgLy9jb25zb2xlLmxvZyhcIi1cIitzZWN0aW9uX25hbWUpO1xuICAgIC8vdmFyIGlucHV0X3NlY3Rpb24gPSBnLmlucHV0c1tzZWN0aW9uX25hbWVdO1xuICAgIHZhciBvdXRwdXRfc2VjdGlvbiA9IGcuc3lzdGVtW3NlY3Rpb25fbmFtZV07XG4gICAgZm9yKCB2YXIga2V5IGluIG91dHB1dF9zZWN0aW9uICl7XG4gICAgICAgIGlmKCBvdXRwdXRfc2VjdGlvbi5oYXNPd25Qcm9wZXJ0eShrZXkpICl7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGtleSk7XG5cbiAgICAgICAgICAgIGlmKCBvdXRwdXRfc2VjdGlvbltrZXldID09PSB1bmRlZmluZWQgfHwgb3V0cHV0X3NlY3Rpb25ba2V5XSA9PT0gbnVsbCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5mLm51bGxUb09iamVjdCA9IGZ1bmN0aW9uKG9iamVjdCl7XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdCApe1xuICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIGlmKCBvYmplY3Rba2V5XSA9PT0gbnVsbCApe1xuICAgICAgICAgICAgICAgIG9iamVjdFtrZXldID0ge307XG4gICAgICAgICAgICB9IGVsc2UgaWYoIHR5cGVvZiBvYmplY3Rba2V5XSA9PT0gJ29iamVjdCcgKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0W2tleV0gPSBmLm51bGxUb09iamVjdChvYmplY3Rba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbn07XG5cbmYuYmxhbmtfY29weSA9IGZ1bmN0aW9uKG9iamVjdCl7XG4gICAgdmFyIG5ld09iamVjdCA9IHt9O1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QgKXtcbiAgICAgICAgaWYoIG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpICl7XG4gICAgICAgICAgICBpZiggb2JqZWN0W2tleV0uY29uc3RydWN0b3IgPT09IE9iamVjdCApIHtcbiAgICAgICAgICAgICAgICBuZXdPYmplY3Rba2V5XSA9IHt9O1xuICAgICAgICAgICAgICAgIGZvciggdmFyIGtleTIgaW4gb2JqZWN0W2tleV0gKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIG9iamVjdFtrZXldLmhhc093blByb3BlcnR5KGtleTIpICl7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3Rba2V5XVtrZXkyXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3T2JqZWN0O1xufTtcblxuZi5ibGFua19jbGVhbl9jb3B5ID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICB2YXIgbmV3T2JqZWN0ID0ge307XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdCApe1xuICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIGlmKCBvYmplY3Rba2V5XS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICkge1xuICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldID0ge307XG4gICAgICAgICAgICAgICAgZm9yKCB2YXIga2V5MiBpbiBvYmplY3Rba2V5XSApe1xuICAgICAgICAgICAgICAgICAgICBpZiggb2JqZWN0W2tleV0uaGFzT3duUHJvcGVydHkoa2V5MikgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjbGVhbl9rZXkgPSBmLmNsZWFuX25hbWUoa2V5Mik7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3Rba2V5XVtjbGVhbl9rZXldID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3T2JqZWN0W2tleV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdPYmplY3Q7XG59O1xuXG5mLm1lcmdlX29iamVjdHMgPSBmdW5jdGlvbiBtZXJnZV9vYmplY3RzKG9iamVjdDEsIG9iamVjdDIpe1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QxICl7XG4gICAgICAgIGlmKCBvYmplY3QxLmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIC8vaWYoIGtleSA9PT0gJ21ha2UnICkgY29uc29sZS5sb2coa2V5LCBvYmplY3QxLCB0eXBlb2Ygb2JqZWN0MVtrZXldLCB0eXBlb2Ygb2JqZWN0MltrZXldKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coa2V5LCBvYmplY3QxLCB0eXBlb2Ygb2JqZWN0MVtrZXldLCB0eXBlb2Ygb2JqZWN0MltrZXldKTtcbiAgICAgICAgICAgIGlmKCBvYmplY3QxW2tleV0gJiYgb2JqZWN0MVtrZXldLmNvbnN0cnVjdG9yID09PSBPYmplY3QgKSB7XG4gICAgICAgICAgICAgICAgaWYoIG9iamVjdDJba2V5XSA9PT0gdW5kZWZpbmVkICkgb2JqZWN0MltrZXldID0ge307XG4gICAgICAgICAgICAgICAgbWVyZ2Vfb2JqZWN0cyggb2JqZWN0MVtrZXldLCBvYmplY3QyW2tleV0gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYoIG9iamVjdDJba2V5XSA9PT0gdW5kZWZpbmVkICkgb2JqZWN0MltrZXldID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmYuYXJyYXlfdG9fb2JqZWN0ID0gZnVuY3Rpb24oYXJyKSB7XG4gICAgdmFyIHIgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7ICsraSlcbiAgICAgICAgcltpXSA9IGFycltpXTtcbiAgICByZXR1cm4gcjtcbn07XG5cbmYubmFuX2NoZWNrID0gZnVuY3Rpb24gbmFuX2NoZWNrKG9iamVjdCwgcGF0aCl7XG4gICAgaWYoIHBhdGggPT09IHVuZGVmaW5lZCApIHBhdGggPSBcIlwiO1xuICAgIHBhdGggPSBwYXRoK1wiLlwiO1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QgKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggXCJOYU5jaGVjazogXCIrcGF0aCtrZXkgKTtcblxuICAgICAgICBpZiggb2JqZWN0W2tleV0gJiYgb2JqZWN0W2tleV0uY29uc3RydWN0b3IgPT09IEFycmF5ICkgb2JqZWN0W2tleV0gPSBmLmFycmF5X3RvX29iamVjdChvYmplY3Rba2V5XSk7XG5cblxuICAgICAgICBpZiggIG9iamVjdFtrZXldICYmICggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgfHwgb2JqZWN0W2tleV0gIT09IG51bGwgKSl7XG4gICAgICAgICAgICBpZiggb2JqZWN0W2tleV0uY29uc3RydWN0b3IgPT09IE9iamVjdCApe1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coIFwiICBPYmplY3Q6IFwiK3BhdGgra2V5ICk7XG4gICAgICAgICAgICAgICAgbmFuX2NoZWNrKCBvYmplY3Rba2V5XSwgcGF0aCtrZXkgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiggb2JqZWN0W2tleV0gPT09IE5hTiB8fCBvYmplY3Rba2V5XSA9PT0gbnVsbCApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcIk5hTjogXCIrcGF0aCtrZXkgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggXCJEZWZpbmVkOiBcIitwYXRoK2tleSwgb2JqZWN0W2tleV0pO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cbn07XG5cbmYuc3RyX3RvX251bSA9IGZ1bmN0aW9uIHN0cl90b19udW0oaW5wdXQpe1xuICAgIHZhciBvdXRwdXQ7XG4gICAgaWYoIWlzTmFOKGlucHV0KSkgb3V0cHV0ID0gTnVtYmVyKGlucHV0KTtcbiAgICBlbHNlIG91dHB1dCA9IGlucHV0O1xuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG5cbmYucHJldHR5X3dvcmQgPSBmdW5jdGlvbihuYW1lKXtcbiAgICByZXR1cm4gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSk7XG59O1xuXG5mLnByZXR0eV9uYW1lID0gZnVuY3Rpb24obmFtZSl7XG4gICAgdmFyIGwgPSBuYW1lLnNwbGl0KCdfJyk7XG4gICAgbC5mb3JFYWNoKGZ1bmN0aW9uKG5hbWVfc2VxbWVudCxpKXtcbiAgICAgICAgbFtpXSA9IGYucHJldHR5X3dvcmQobmFtZV9zZXFtZW50KTtcbiAgICB9KTtcbiAgICB2YXIgcHJldHR5ID0gbC5qb2luKCcgJyk7XG5cbiAgICByZXR1cm4gcHJldHR5O1xufTtcblxuZi5wcmV0dHlfbmFtZXMgPSBmdW5jdGlvbihvYmplY3Qpe1xuICAgIHZhciBuZXdfb2JqZWN0ID0ge307XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdCApe1xuICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIHZhciBuZXdfa2V5ID0gZi5wcmV0dHlfbmFtZShrZXkpO1xuICAgICAgICAgICAgbmV3X29iamVjdFtuZXdfa2V5XSA9IG9iamVjdFtrZXldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdfb2JqZWN0O1xufTtcblxuZi5jbGVhbl9uYW1lID0gZnVuY3Rpb24obmFtZSl7XG4gICAgcmV0dXJuIG5hbWUuc3BsaXQoJyAnKVswXTtcbn07XG5cbi8qXG5mLmtlbGVtX3NldHVwID0gZnVuY3Rpb24oa2VsZW0sIHNldHRpbmdzKXtcbiAgICBpZiggIXNldHRpbmdzKSBjb25zb2xlLmxvZyhzZXR0aW5ncyk7XG4gICAgaWYoIGtlbGVtLnR5cGUgPT09ICdzZWxlY3RvcicgKXtcbiAgICAgICAga2VsZW0uc2V0UmVmT2JqKHNldHRpbmdzKTtcbiAgICAgICAga2VsZW0uc2V0VXBkYXRlKHNldHRpbmdzLnVwZGF0ZSk7XG4gICAgICAgIHNldHRpbmdzLnNlbGVjdF9yZWdpc3RyeS5wdXNoKGtlbGVtKTtcbiAgICAgICAga2VsZW0udXBkYXRlKCk7XG4gICAgfSBlbHNlIGlmKCBrZWxlbS50eXBlID09PSAndmFsdWUnICl7XG4gICAgICAgIGtlbGVtLnNldFJlZk9iaihzZXR0aW5ncyk7XG4gICAgICAgIC8va2VsZW0uc2V0VXBkYXRlKHNldHRpbmdzX3VwZGF0ZSk7XG4gICAgICAgIHNldHRpbmdzLnZhbHVlX3JlZ2lzdHJ5LnB1c2goa2VsZW0pO1xuICAgIH1cbiAgICByZXR1cm4ga2VsZW07XG59O1xuKi9cbi8vZi5zY29wZV9wcmVzZXJ2ZXIgPSBmdW5jdGlvbih2KXtcbi8vICAgIHJldHVybiBmdW5jdGlvbigpe1xuLy8gICAgICAgIHJldHVybiB2O1xuLy8gICAgfTtcbi8vfTtcblxuZi5ta19kcmF3ZXIgPSBmdW5jdGlvbih0aXRsZSwgY29udGVudCl7XG4gICAgdmFyIGRyYXdlcl9jb250YWluZXIgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ2lucHV0X3NlY3Rpb24nKS5hdHRyKCdpZCcsIHRpdGxlICk7XG4gICAgLy9kcmF3ZXJfY29udGFpbmVyLmdldCgwKS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheV90eXBlO1xuICAgIHZhciBzeXN0ZW1fZGl2ID0gJCgnPGRpdj4nKS5hdHRyKCdjbGFzcycsICd0aXRsZV9iYXInKVxuICAgICAgICAuYXR0cignaWQnLCAnc2VjdGlvbl8nK3RpdGxlKVxuICAgICAgICAuYXR0cignc2VjdGlvbl9ub20nLCB0aXRsZSlcbiAgICAgICAgLmFwcGVuZFRvKGRyYXdlcl9jb250YWluZXIpXG4gICAgICAgIC8qIGpzaGludCAtVzA4MyAqL1xuICAgICAgICAuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBuYW1lID0gJCh0aGlzKS5hdHRyKCdzZWN0aW9uX25vbScpO1xuICAgICAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGlvbnNfbWFudWFsX3RvZ2dsZWRbbmFtZV0gPSB0cnVlO1xuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5jaGlsZHJlbignLmRyYXdlcicpLmNoaWxkcmVuKCcuZHJhd2VyX2NvbnRlbnQnKS5zbGlkZVRvZ2dsZSgnZmFzdCcpO1xuICAgICAgICB9KTtcbiAgICB2YXIgc3lzdGVtX3RpdGxlID0gJCgnPGE+JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpdGxlX2Jhcl90ZXh0JylcbiAgICAgICAgLmF0dHIoJ2hyZWYnLCAnIycpXG4gICAgICAgIC50ZXh0KGYucHJldHR5X25hbWUodGl0bGUpKVxuICAgICAgICAuYXBwZW5kVG8oc3lzdGVtX2Rpdik7XG5cbiAgICB2YXIgZHJhd2VyID0gJCgnPGRpdj4nKS5hdHRyKCdjbGFzcycsICdkcmF3ZXInKS5hcHBlbmRUbyhkcmF3ZXJfY29udGFpbmVyKTtcbiAgICBjb250ZW50LmF0dHIoJ2NsYXNzJywgJ2RyYXdlcl9jb250ZW50JykuYXBwZW5kVG8oZHJhd2VyKTtcblxuXG4gICAgcmV0dXJuIGRyYXdlcl9jb250YWluZXI7XG5cblxufTtcblxuXG5mLmFkZF9zZWxlY3RvcnMgPSBmdW5jdGlvbihzZXR0aW5ncywgcGFyZW50X2NvbnRhaW5lcil7XG4gICAgZm9yKCB2YXIgc2VjdGlvbl9uYW1lIGluIHNldHRpbmdzLmlucHV0cyApe1xuXG4gICAgICAgIC8vJCh0aGlzKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICB2YXIgZHJhd2VyX2NvbnRlbnQgPSAkKCc8ZGl2PicpO1xuICAgICAgICBmb3IoIHZhciBpbnB1dF9uYW1lIGluIHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdICl7XG4gICAgICAgICAgICB2YXIgdW5pdHM7XG4gICAgICAgICAgICBpZiggKHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdICE9PSB1bmRlZmluZWQpICYmIChzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXS51bml0cyAhPT0gdW5kZWZpbmVkKSApIHtcbiAgICAgICAgICAgICAgICB1bml0cyA9IFwiKFwiICsgc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0udW5pdHMgKyBcIilcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdW5pdHMgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG5vdGU7XG4gICAgICAgICAgICBpZiggKHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdICE9PSB1bmRlZmluZWQpICYmIChzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXS5ub3RlICE9PSB1bmRlZmluZWQpICkge1xuICAgICAgICAgICAgICAgIG5vdGUgPSBzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXS5ub3RlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBub3RlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cblxuXG5cbiAgICAgICAgICAgIHZhciBzZWxlY3Rvcl9zZXQgPSAkKCc8c3Bhbj4nKS5hdHRyKCdjbGFzcycsICdzZWxlY3Rvcl9zZXQnKS5hcHBlbmRUbyhkcmF3ZXJfY29udGVudCk7XG4gICAgICAgICAgICB2YXIgaW5wdXRfdGV4dCA9ICQoJzxzcGFuPicpLmh0bWwoZi5wcmV0dHlfbmFtZShpbnB1dF9uYW1lKSArICc6ICcgKyB1bml0cyApLmFwcGVuZFRvKHNlbGVjdG9yX3NldCk7XG4gICAgICAgICAgICBpZiggbm90ZSApIGlucHV0X3RleHQuYXR0cigndGl0bGUnLCBub3RlKTtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3IgPSBrJCgnc2VsZWN0b3InKVxuICAgICAgICAgICAgICAgIC5zZXRPcHRpb25zUmVmKCAnaW5wdXRzLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lIClcbiAgICAgICAgICAgICAgICAuc2V0UmVmKCAnc3lzdGVtLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lIClcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8oc2VsZWN0b3Jfc2V0KTtcbiAgICAgICAgICAgIGYua2VsZW1fc2V0dXAoc2VsZWN0b3IsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIC8vKi9cbiAgICAgICAgICAgIHZhciBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgICBzeXN0ZW1fcmVmOiBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcikub2JqKHNldHRpbmdzKS5yZWYoJ3N5c3RlbS4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSksXG4gICAgICAgICAgICAgICAgLy9pbnB1dF9yZWY6IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKS5vYmooc2V0dGluZ3MpLnJlZignaW5wdXRzLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lICsgJy52YWx1ZScpLFxuICAgICAgICAgICAgICAgIGxpc3RfcmVmOiBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcikub2JqKHNldHRpbmdzKS5yZWYoJ2lucHV0cy4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSArICcub3B0aW9ucycpLFxuICAgICAgICAgICAgICAgIGludGVyYWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmKCAoc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0gIT09IHVuZGVmaW5lZCkgJiYgKHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdLnR5cGUgIT09IHVuZGVmaW5lZCkgKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IudHlwZSA9IHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdLnR5cGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLnR5cGUgPSAnc2VsZWN0JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCBzZWxlY3Rvci50eXBlID09PSAnc2VsZWN0JyApe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLmVsZW0gPSAkKCc8c2VsZWN0PicpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdzZWxlY3RvcicpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhzZWxlY3Rvcl9zZXQpXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoKVswXTtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci52YWx1ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coIHRoaXMuc2V0X3JlZi5yZWZTdHJpbmcsIHRoaXMuZWxlbS5zZWxlY3RlZEluZGV4ICk7XG4gICAgICAgICAgICAgICAgICAgIC8vaWYoIHRoaXMuaW50ZXJhY3RlZCApXG4gICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleCA+PSAwKSByZXR1cm4gdGhpcy5lbGVtLm9wdGlvbnNbdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGYuc2VsZWN0b3JfYWRkX29wdGlvbnMoc2VsZWN0b3IpO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYoIHNlbGVjdG9yLnR5cGUgPT09ICdpbnB1dCcgKXtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci5lbGVtID0gJCgnPGlucHV0PicpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdudW1iZXJfaW5wdXQnKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cigndHlwZScsICd0ZXh0JylcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKHNlbGVjdG9yX3NldClcbiAgICAgICAgICAgICAgICAgICAgLmdldCgpWzBdO1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLnZhbHVlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggdGhpcy5zZXRfcmVmLnJlZlN0cmluZywgdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXggKTtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggdGhpcy5lbGVtLCB0aGlzLmVsZW0udmFsdWUgKTtcbiAgICAgICAgICAgICAgICAgICAgLy9pZiggdGhpcy5pbnRlcmFjdGVkIClcbiAgICAgICAgICAgICAgICAgICAgLy9pZiggdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXggPj0gMCkgcmV0dXJuIHRoaXMuZWxlbS5vcHRpb25zW3RoaXMuZWxlbS5zZWxlY3RlZEluZGV4XS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgLy9lbHNlIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbS52YWx1ZTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLmVsZW0udmFsdWUgPSBzZWxlY3Rvci5zeXN0ZW1fcmVmLmdldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChzZWxlY3Rvci5lbGVtKS5jaGFuZ2UoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgIHNldHRpbmdzLmYudXBkYXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNldHRpbmdzLnNlbGVjdF9yZWdpc3RyeS5wdXNoKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIC8vJCgnPC9icj4nKS5hcHBlbmRUbyhkcmF3ZXJfY29udGVudCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWxlY3Rpb25fY29udGFpbmVyID0gZi5ta19kcmF3ZXIoc2VjdGlvbl9uYW1lLCBkcmF3ZXJfY29udGVudCk7XG5cbiAgICAgICAgc2VsZWN0aW9uX2NvbnRhaW5lci5hcHBlbmRUbyhwYXJlbnRfY29udGFpbmVyKTtcblxuICAgICAgICAkKHNlbGVjdGlvbl9jb250YWluZXIpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlVXAoJ2Zhc3QnKTtcbiAgICB9XG59O1xuXG5mLnNlbGVjdG9yX2FkZF9vcHRpb25zID0gZnVuY3Rpb24oc2VsZWN0b3Ipe1xuICAgIHZhciBsaXN0ID0gc2VsZWN0b3IubGlzdF9yZWYuZ2V0KCk7XG4gICAgaWYoIGxpc3QgJiYgbGlzdC5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdcImxpc3RcIicsIGxpc3QpO1xuICAgICAgICBsaXN0ID0gZi5vYmpfbmFtZXMobGlzdCk7XG4gICAgfVxuICAgIHNlbGVjdG9yLmVsZW0uaW5uZXJIVE1MID0gXCJcIjtcbiAgICBpZiggbGlzdCBpbnN0YW5jZW9mIEFycmF5ICl7XG4gICAgICAgIHZhciBjdXJyZW50X3ZhbHVlID0gc2VsZWN0b3Iuc3lzdGVtX3JlZi5nZXQoKTtcbiAgICAgICAgJCgnPG9wdGlvbj4nKS5hdHRyKCdzZWxlY3RlZCcsdHJ1ZSkuYXR0cignZGlzYWJsZWQnLHRydWUpLmF0dHIoJ2hpZGRlbicsdHJ1ZSkuYXBwZW5kVG8oc2VsZWN0b3IuZWxlbSk7XG5cbiAgICAgICAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKG9wdF9uYW1lKXtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2cob3B0X25hbWUpO1xuICAgICAgICAgICAgdmFyIG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgICAgIG8udmFsdWUgPSBvcHRfbmFtZTtcbiAgICAgICAgICAgIGlmKCBjdXJyZW50X3ZhbHVlICl7XG4gICAgICAgICAgICAgICAgaWYoIG9wdF9uYW1lLnRvU3RyaW5nKCkgPT09IGN1cnJlbnRfdmFsdWUudG9TdHJpbmcoKSApIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZm91bmQgaXQ6Jywgb3B0X25hbWUpO1xuICAgICAgICAgICAgICAgICAgICBvLnNlbGVjdGVkID0gXCJzZWxlY3RlZFwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2RvZXMgbm90IG1hdGNoOiAnLCBvcHRfbmFtZSwgXCIsXCIsICBjdXJyZW50X3ZhbHVlLCBcIi5cIiApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL28uc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZWxlY3Rvcl9vcHRpb24nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnbm8gY3VycmVudCB2YWx1ZScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvLmlubmVySFRNTCA9IG9wdF9uYW1lO1xuICAgICAgICAgICAgc2VsZWN0b3IuZWxlbS5hcHBlbmRDaGlsZChvKTtcbiAgICAgICAgfSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdsaXN0IG5vdCBhIGxpc3QnLCBsaXN0LCBzZWxlY3QpO1xuICAgIH1cbn07XG5cbmYuYWRkX29wdGlvbnMgPSBmdW5jdGlvbihzZWxlY3QsIGFycmF5KXtcbiAgICBhcnJheS5mb3JFYWNoKCBmdW5jdGlvbihvcHRpb24pe1xuICAgICAgICAkKCc8b3B0aW9uPicpLmF0dHIoICd2YWx1ZScsIG9wdGlvbiApLnRleHQob3B0aW9uKS5hcHBlbmRUbyhzZWxlY3QpO1xuICAgIH0pO1xufTtcblxuZi5hZGRfcGFyYW1zID0gZnVuY3Rpb24oc2V0dGluZ3MsIHBhcmVudF9jb250YWluZXIpe1xuICAgIGZvciggdmFyIHNlY3Rpb25fbmFtZSBpbiBzZXR0aW5ncy5zeXN0ZW0gKXtcbiAgICAgICAgaWYoIHRydWUgfHwgZi5vYmplY3RfZGVmaW5lZChzZXR0aW5ncy5zeXN0ZW1bc2VjdGlvbl9uYW1lXSkgKXtcbiAgICAgICAgICAgIHZhciBzZWxlY3Rpb25fY29udGFpbmVyID0gJCgnPGRpdj4nKS5hdHRyKCdjbGFzcycsICdwYXJhbV9zZWN0aW9uJykuYXR0cignaWQnLCBzZWN0aW9uX25hbWUgKS5hcHBlbmRUbyhwYXJlbnRfY29udGFpbmVyKTtcbiAgICAgICAgICAgIC8vc2VsZWN0aW9uX2NvbnRhaW5lci5nZXQoMCkuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlfdHlwZTtcbiAgICAgICAgICAgIHZhciBzeXN0ZW1fZGl2ID0gJCgnPGRpdj4nKVxuICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd0aXRsZV9saW5lJylcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8oc2VsZWN0aW9uX2NvbnRhaW5lcilcbiAgICAgICAgICAgICAgICAvKiBqc2hpbnQgLVcwODMgKi9cbiAgICAgICAgICAgICAgICAuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5jaGlsZHJlbignLmRyYXdlcicpLmNoaWxkcmVuKCcuZHJhd2VyX2NvbnRlbnQnKS5zbGlkZVRvZ2dsZSgnZmFzdCcpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIHN5c3RlbV90aXRsZSA9ICQoJzxhPicpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpdGxlX2xpbmVfdGV4dCcpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2hyZWYnLCAnIycpXG4gICAgICAgICAgICAgICAgLnRleHQoZi5wcmV0dHlfbmFtZShzZWN0aW9uX25hbWUpKVxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhzeXN0ZW1fZGl2KTtcbiAgICAgICAgICAgICQodGhpcykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgIHZhciBkcmF3ZXIgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJycpLmFwcGVuZFRvKHNlbGVjdGlvbl9jb250YWluZXIpO1xuICAgICAgICAgICAgdmFyIGRyYXdlcl9jb250ZW50ID0gJCgnPGRpdj4nKS5hdHRyKCdjbGFzcycsICdwYXJhbV9zZWN0aW9uX2NvbnRlbnQnKS5hcHBlbmRUbyhkcmF3ZXIpO1xuICAgICAgICAgICAgZm9yKCB2YXIgaW5wdXRfbmFtZSBpbiBzZXR0aW5ncy5zeXN0ZW1bc2VjdGlvbl9uYW1lXSApe1xuICAgICAgICAgICAgICAgICQoJzxzcGFuPicpLmh0bWwoZi5wcmV0dHlfbmFtZShpbnB1dF9uYW1lKSArICc6ICcpLmFwcGVuZFRvKGRyYXdlcl9jb250ZW50KTtcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIHZhciBzZWxlY3RvciA9IGskKCd2YWx1ZScpXG4gICAgICAgICAgICAgICAgICAgIC8vLnNldE9wdGlvbnNSZWYoICdpbnB1dHMuJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUgKVxuICAgICAgICAgICAgICAgICAgICAuc2V0UmVmKCAnc3lzdGVtLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lIClcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKGRyYXdlcl9jb250ZW50KTtcbiAgICAgICAgICAgICAgICBmLmtlbGVtX3NldHVwKHNlbGVjdG9yLCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgLy8qL1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZV9rb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcilcbiAgICAgICAgICAgICAgICAgICAgLm9iaihzZXR0aW5ncylcbiAgICAgICAgICAgICAgICAgICAgLnJlZignc3lzdGVtLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lKTtcbiAgICAgICAgICAgICAgICB2YXIgJGVsZW0gPSAkKCc8c3Bhbj4nKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnJylcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKGRyYXdlcl9jb250ZW50KVxuICAgICAgICAgICAgICAgICAgICAudGV4dCh2YWx1ZV9rb250YWluZXIuZ2V0KCkpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbTogJGVsZW0uZ2V0KClbMF0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlX3JlZjogdmFsdWVfa29udGFpbmVyXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy52YWx1ZV9yZWdpc3RyeS5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAkKCc8L2JyPicpLmFwcGVuZFRvKGRyYXdlcl9jb250ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmYudXBkYXRlX3ZhbHVlcyA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICBzZXR0aW5ncy52YWx1ZV9yZWdpc3RyeS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlX2l0ZW0pe1xuICAgICAgICAvL2NvbnNvbGUubG9nKCB2YWx1ZV9pdGVtICk7XG4gICAgICAgIC8vY29uc29sZS5sb2coIHZhbHVlX2l0ZW0uZWxlbS5vcHRpb25zICk7XG4gICAgICAgIC8vY29uc29sZS5sb2coIHZhbHVlX2l0ZW0uZWxlbS5zZWxlY3RlZEluZGV4ICk7XG4gICAgICAgIGlmKHZhbHVlX2l0ZW0uZWxlbS5zZWxlY3RlZEluZGV4KXtcbiAgICAgICAgICAgIHZhbHVlX2l0ZW0udmFsdWUgPSB2YWx1ZV9pdGVtLmVsZW0ub3B0aW9uc1t2YWx1ZV9pdGVtLmVsZW0uc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4gICAgICAgICAgICB2YWx1ZV9pdGVtLmtvbnRhaW5lci5zZXQodmFsdWVfaXRlbS52YWx1ZSk7XG5cbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuZi5zaG93X2hpZGVfcGFyYW1zID0gZnVuY3Rpb24ocGFnZV9zZWN0aW9ucywgc2V0dGluZ3Mpe1xuICAgIGZvciggdmFyIGxpc3RfbmFtZSBpbiBwYWdlX3NlY3Rpb25zICl7XG4gICAgICAgIHZhciBpZCA9ICcjJytsaXN0X25hbWU7XG4gICAgICAgIHZhciBzZWN0aW9uX25hbWUgPSBsaXN0X25hbWUuc3BsaXQoJ18nKVswXTtcbiAgICAgICAgdmFyIHNlY3Rpb24gPSBrJChpZCk7XG4gICAgICAgIGlmKCBzZXR0aW5ncy5zdGF0dXMuc2VjdGlvbnNbc2VjdGlvbl9uYW1lXS5zZXQgKSBzZWN0aW9uLnNob3coKTtcbiAgICAgICAgZWxzZSBzZWN0aW9uLmhpZGUoKTtcbiAgICB9XG59O1xuXG5mLnNob3dfaGlkZV9zZWxlY3Rpb25zID0gZnVuY3Rpb24oc2V0dGluZ3MsIGFjdGl2ZV9zZWN0aW9uX25hbWUpe1xuICAgICQoJyNzZWN0aW9uU2VsZWN0b3InKS52YWwoYWN0aXZlX3NlY3Rpb25fbmFtZSk7XG4gICAgZm9yKCB2YXIgbGlzdF9uYW1lIGluIHNldHRpbmdzLmlucHV0ICl7XG4gICAgICAgIHZhciBpZCA9ICcjJytsaXN0X25hbWU7XG4gICAgICAgIHZhciBzZWN0aW9uX25hbWUgPSBsaXN0X25hbWUuc3BsaXQoJ18nKVswXTtcbiAgICAgICAgdmFyIHNlY3Rpb24gPSBrJChpZCk7XG4gICAgICAgIGlmKCBzZWN0aW9uX25hbWUgPT09IGFjdGl2ZV9zZWN0aW9uX25hbWUgKSBzZWN0aW9uLnNob3coKTtcbiAgICAgICAgZWxzZSBzZWN0aW9uLmhpZGUoKTtcbiAgICB9XG59O1xuXG4vL2Yuc2V0RG93bmxvYWRMaW5rKHNldHRpbmdzKXtcbi8vXG4vLyAgICBpZiggc2V0dGluZ3MuUERGICYmIHNldHRpbmdzLlBERi51cmwgKXtcbi8vICAgICAgICB2YXIgbGluayA9ICQoJ2EnKS5hdHRyKCdocmVmJywgc2V0dGluZ3MuUERGLnVybCApLmF0dHIoJ2Rvd25sb2FkJywgJ1BWX2RyYXdpbmcucGRmJykuaHRtbCgnRG93bmxvYWQgRHJhd2luZycpO1xuLy8gICAgICAgICQoJyNkb3dubG9hZCcpLmh0bWwoJycpLmFwcGVuZChsaW5rKTtcbi8vICAgIH1cbi8vfVxuXG5mLmxvYWRUYWJsZXMgPSBmdW5jdGlvbihzdHJpbmcpe1xuICAgIHZhciB0YWJsZXMgPSB7fTtcbiAgICB2YXIgbCA9IHN0cmluZy5zcGxpdCgnXFxuJyk7XG4gICAgdmFyIHRpdGxlO1xuICAgIHZhciBmaWVsZHM7XG4gICAgdmFyIG5lZWRfdGl0bGUgPSB0cnVlO1xuICAgIHZhciBuZWVkX2ZpZWxkcyA9IHRydWU7XG4gICAgbC5mb3JFYWNoKCBmdW5jdGlvbihzdHJpbmcsIGkpe1xuICAgICAgICB2YXIgbGluZSA9IHN0cmluZy50cmltKCk7XG4gICAgICAgIGlmKCBsaW5lLmxlbmd0aCA9PT0gMCApe1xuICAgICAgICAgICAgbmVlZF90aXRsZSA9IHRydWU7XG4gICAgICAgICAgICBuZWVkX2ZpZWxkcyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiggbmVlZF90aXRsZSApIHtcbiAgICAgICAgICAgIHRpdGxlID0gbGluZTtcbiAgICAgICAgICAgIHRhYmxlc1t0aXRsZV0gPSBbXTtcbiAgICAgICAgICAgIG5lZWRfdGl0bGUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmKCBuZWVkX2ZpZWxkcyApIHtcbiAgICAgICAgICAgIGZpZWxkcyA9IGxpbmUuc3BsaXQoJywnKTtcbiAgICAgICAgICAgIHRhYmxlc1t0aXRsZStcIl9maWVsZHNcIl0gPSBmaWVsZHM7XG4gICAgICAgICAgICBuZWVkX2ZpZWxkcyA9IGZhbHNlO1xuICAgICAgICAvL30gZWxzZSB7XG4gICAgICAgIC8vICAgIHZhciBlbnRyeSA9IHt9O1xuICAgICAgICAvLyAgICB2YXIgbGluZV9hcnJheSA9IGxpbmUuc3BsaXQoJywnKTtcbiAgICAgICAgLy8gICAgZmllbGRzLmZvckVhY2goIGZ1bmN0aW9uKGZpZWxkLCBpZCl7XG4gICAgICAgIC8vICAgICAgICBlbnRyeVtmaWVsZC50cmltKCldID0gbGluZV9hcnJheVtpZF0udHJpbSgpO1xuICAgICAgICAvLyAgICB9KTtcbiAgICAgICAgLy8gICAgdGFibGVzW3RpdGxlXS5wdXNoKCBlbnRyeSApO1xuICAgICAgICAvL31cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBsaW5lX2FycmF5ID0gbGluZS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgdGFibGVzW3RpdGxlXVtsaW5lX2FycmF5WzBdLnRyaW0oKV0gPSBsaW5lX2FycmF5WzFdLnRyaW0oKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRhYmxlcztcbn07XG5cbmYubG9hZENvbXBvbmVudHMgPSBmdW5jdGlvbihzdHJpbmcpe1xuICAgIHZhciBkYiA9IGsucGFyc2VDU1Yoc3RyaW5nKTtcbiAgICB2YXIgb2JqZWN0ID0ge307XG4gICAgZm9yKCB2YXIgaSBpbiBkYiApe1xuICAgICAgICB2YXIgY29tcG9uZW50ID0gZGJbaV07XG4gICAgICAgIGlmKCBvYmplY3RbY29tcG9uZW50Lk1ha2VdID09PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIG9iamVjdFtjb21wb25lbnQuTWFrZV0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiggb2JqZWN0W2NvbXBvbmVudC5NYWtlXVtjb21wb25lbnQuTW9kZWxdID09PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIG9iamVjdFtjb21wb25lbnQuTWFrZV1bY29tcG9uZW50Lk1vZGVsXSA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpZWxkcyA9IGsub2JqSWRBcnJheShjb21wb25lbnQpO1xuICAgICAgICBmaWVsZHMuZm9yRWFjaCggZnVuY3Rpb24oIGZpZWxkICl7XG4gICAgICAgICAgICB2YXIgcGFyYW0gPSBjb21wb25lbnRbZmllbGRdO1xuICAgICAgICAgICAgaWYoICEoIGZpZWxkIGluIFsnTWFrZScsICdNb2RlbCddICkgJiYgISggaXNOYU4ocGFyc2VGbG9hdChwYXJhbSkpICkgKXtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRbZmllbGRdID0gcGFyc2VGbG9hdChwYXJhbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIG9iamVjdFtjb21wb25lbnQuTWFrZV1bY29tcG9uZW50Lk1vZGVsXSA9IGNvbXBvbmVudDtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbn07XG5cblxuXG5cbmYubG9hZF9kYXRhYmFzZSA9IGZ1bmN0aW9uKEZTRUNfZGF0YWJhc2VfSlNPTil7XG4gICAgRlNFQ19kYXRhYmFzZV9KU09OID0gZi5sb3dlcmNhc2VfcHJvcGVydGllcyhGU0VDX2RhdGFiYXNlX0pTT04pO1xuICAgIHZhciBzZXR0aW5ncyA9IGYuc2V0dGluZ3M7XG4gICAgc2V0dGluZ3MuY29tcG9uZW50cy5pbnZlcnRlcnMgPSB7fTtcbiAgICBGU0VDX2RhdGFiYXNlX0pTT04uaW52ZXJ0ZXJzLmZvckVhY2goZnVuY3Rpb24oY29tcG9uZW50KXtcbiAgICAgICAgaWYoIHNldHRpbmdzLmNvbXBvbmVudHMuaW52ZXJ0ZXJzW2NvbXBvbmVudC5tYWtlXSA9PT0gdW5kZWZpbmVkICkgc2V0dGluZ3MuY29tcG9uZW50cy5pbnZlcnRlcnNbY29tcG9uZW50Lm1ha2VdID0ge307XG4gICAgICAgIC8vc2V0dGluZ3MuY29tcG9uZW50cy5pbnZlcnRlcnNbY29tcG9uZW50Lm1ha2VdW2NvbXBvbmVudC5tYWtlXSA9IGYucHJldHR5X25hbWVzKGNvbXBvbmVudCk7XG4gICAgICAgIHNldHRpbmdzLmNvbXBvbmVudHMuaW52ZXJ0ZXJzW2NvbXBvbmVudC5tYWtlXVtjb21wb25lbnQubW9kZWxdID0gY29tcG9uZW50O1xuICAgIH0pO1xuICAgIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlcyA9IHt9O1xuICAgIEZTRUNfZGF0YWJhc2VfSlNPTi5tb2R1bGVzLmZvckVhY2goZnVuY3Rpb24oY29tcG9uZW50KXtcbiAgICAgICAgaWYoIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tjb21wb25lbnQubWFrZV0gPT09IHVuZGVmaW5lZCApIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tjb21wb25lbnQubWFrZV0gPSB7fTtcbiAgICAgICAgLy9zZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbY29tcG9uZW50Lm1ha2VdW2NvbXBvbmVudC5tYWtlXSA9IGYucHJldHR5X25hbWVzKGNvbXBvbmVudCk7XG4gICAgICAgIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tjb21wb25lbnQubWFrZV1bY29tcG9uZW50Lm1vZGVsXSA9IGNvbXBvbmVudDtcbiAgICB9KTtcblxuICAgIGYudXBkYXRlKCk7XG59O1xuXG5cbmYuZ2V0X3JlZiA9IGZ1bmN0aW9uKHN0cmluZywgb2JqZWN0KXtcbiAgICB2YXIgcmVmX2FycmF5ID0gc3RyaW5nLnNwbGl0KCcuJyk7XG4gICAgdmFyIGxldmVsID0gb2JqZWN0O1xuICAgIHJlZl9hcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldmVsX25hbWUsaSl7XG4gICAgICAgIGlmKCB0eXBlb2YgbGV2ZWxbbGV2ZWxfbmFtZV0gPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldmVsID0gbGV2ZWxbbGV2ZWxfbmFtZV07XG4gICAgfSk7XG4gICAgcmV0dXJuIGxldmVsO1xufTtcbmYuc2V0X3JlZiA9IGZ1bmN0aW9uKCBvYmplY3QsIHJlZl9zdHJpbmcsIHZhbHVlICl7XG4gICAgdmFyIHJlZl9hcnJheSA9IHJlZl9zdHJpbmcuc3BsaXQoJy4nKTtcbiAgICB2YXIgbGV2ZWwgPSBvYmplY3Q7XG4gICAgcmVmX2FycmF5LmZvckVhY2goZnVuY3Rpb24obGV2ZWxfbmFtZSxpKXtcbiAgICAgICAgaWYoIHR5cGVvZiBsZXZlbFtsZXZlbF9uYW1lXSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbGV2ZWwgPSBsZXZlbFtsZXZlbF9uYW1lXTtcbiAgICB9KTtcblxuICAgIHJldHVybiBsZXZlbDtcbn07XG5cblxuXG5cbmYubG9nX2lmX2RhdGFiYXNlX2xvYWRlZCA9IGZ1bmN0aW9uKGUpe1xuICAgIGlmKGYuc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIH1cbn07XG5cblxuXG5mLmxvd2VyY2FzZV9wcm9wZXJ0aWVzID0gZnVuY3Rpb24gbG93ZXJjYXNlX3Byb3BlcnRpZXMob2JqKSB7XG4gICAgdmFyIG5ld19vYmplY3QgPSBuZXcgb2JqLmNvbnN0cnVjdG9yKCk7XG4gICAgZm9yKCB2YXIgb2xkX25hbWUgaW4gb2JqICl7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkob2xkX25hbWUpKSB7XG4gICAgICAgICAgICB2YXIgbmV3X25hbWUgPSBvbGRfbmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYoIG9ialtvbGRfbmFtZV0uY29uc3RydWN0b3IgPT09IE9iamVjdCB8fCBvYmpbb2xkX25hbWVdLmNvbnN0cnVjdG9yID09PSBBcnJheSApe1xuICAgICAgICAgICAgICAgIG5ld19vYmplY3RbbmV3X25hbWVdID0gbG93ZXJjYXNlX3Byb3BlcnRpZXMob2JqW29sZF9uYW1lXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld19vYmplY3RbbmV3X25hbWVdID0gb2JqW29sZF9uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuICAgIHJldHVybiBuZXdfb2JqZWN0O1xufTtcblxuXG5mLnRvZ2dsZV9tb2R1bGUgPSBmdW5jdGlvbihlbGVtZW50KXtcbiAgICAvL2NvbnNvbGUubG9nKCdzd2l0Y2gnLCBlbGVtZW50LCBlbGVtZW50LmNsYXNzTGlzICk7XG5cbiAgICAvL2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBudWxsKTtcblxuICAgIHZhciBlbGVtID0gJChlbGVtZW50KTtcbiAgICAvL2NvbnNvbGUubG9nKCdzd2l0Y2gnLCBlbGVtWzBdLmNsYXNzTGlzdC5jb250YWlucygncHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZScpICk7XG5cbiAgICB2YXIgciA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdtb2R1bGVfSUQnKS5zcGxpdCgnLCcpWzBdO1xuICAgIHZhciBjID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ21vZHVsZV9JRCcpLnNwbGl0KCcsJylbMV07XG5cbiAgICBpZiggZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl1bY10gKXtcbiAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl1bY10gPSBmYWxzZTtcbiAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNfdG90YWwtLTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSA9IHRydWU7XG4gICAgICAgIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzX3RvdGFsKys7XG4gICAgfVxuXG4gICAgLypcbiAgICB2YXIgbGF5ZXI7XG4gICAgaWYoIGVsZW1bMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZCcpICl7XG4gICAgICAgIC8vZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl1bY10gPSB0cnVlO1xuICAgICAgICAvL2xheWVyID0gZy5kcmF3aW5nX3NldHRpbmdzLmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZTtcbiAgICAgICAgLy9lbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXMgPSBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlcyArMSB8fCAxO1xuICAgICAgICAvL2xheWVyID0gZy5kcmF3aW5nX3NldHRpbmdzLmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZDtcbiAgICAgICAgLy9lbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWRcIik7XG4gICAgfVxuICAgIC8vKi9cbiAgICAvL2NvbnNvbGUubG9nKCBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlcyk7XG4gICAgLy9mb3IoIHZhciBhdHRyX25hbWUgaW4gbGF5ZXIgKXtcbiAgICAvLyAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyX25hbWUsIGxheWVyW2F0dHJfbmFtZV0pO1xuXG4gICAgLy99XG5cbiAgICBnLmYudXBkYXRlKCk7XG5cbiAgICAvKlxuICAgIGlmKCBlbGVtLmhhc0NsYXNzKFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVcIikgKXtcbiAgICAgICAgZWxlbS5yZW1vdmVDbGFzcyhcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlXCIpO1xuICAgICAgICBlbGVtLmFkZENsYXNzKFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWRcIik7XG4gICAgfSBlbHNlIGlmKCBlbGVtLmhhc0NsYXNzKFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWRcIikgKXtcbiAgICAgICAgZWxlbS5yZW1vdmVDbGFzcyhcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkXCIpO1xuICAgICAgICBlbGVtLmFkZENsYXNzKFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbS5hZGRDbGFzcyhcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlXCIpO1xuICAgIH1cbiAgICAqL1xufTtcblxuXG5mLmNsZWFyX29iamVjdCA9IGZ1bmN0aW9uKG9iail7XG4gICAgZm9yKCB2YXIgaWQgaW4gb2JqICl7XG4gICAgICAgIGlmKCBvYmouaGFzT3duUHJvcGVydHkoaWQpKXtcbiAgICAgICAgICAgIGRlbGV0ZSBvYmpbaWRdO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLy8gY2xlYXIgZHJhd2luZ1xuZi5jbGVhcl9kcmF3aW5nID0gZnVuY3Rpb24oKSB7XG4gICAgZm9yKCB2YXIgaWQgaW4gZy5kcmF3aW5nICl7XG4gICAgICAgIGlmKCBnLmRyYXdpbmcuaGFzT3duUHJvcGVydHkoaWQpKXtcbiAgICAgICAgICAgIGYuY2xlYXJfb2JqZWN0KGcuZHJhd2luZ1tpZF0pO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuXG5cbmYucXVlcnlfc3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAvLyBCYXNlZCBvblxuICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS85Nzk5OTVcbiAgdmFyIHF1ZXJ5X3N0cmluZyA9IHt9O1xuICB2YXIgcXVlcnkgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKTtcbiAgdmFyIHZhcnMgPSBxdWVyeS5zcGxpdChcIiZcIik7XG4gIHZhciBpO1xuICBmb3IgKCBpPTA7IGk8dmFycy5sZW5ndGg7IGkrKyApIHtcbiAgICB2YXIgcGFpciA9IHZhcnNbaV0uc3BsaXQoXCI9XCIpO1xuICAgICAgICAvLyBJZiBmaXJzdCBlbnRyeSB3aXRoIHRoaXMgbmFtZVxuICAgIGlmICh0eXBlb2YgcXVlcnlfc3RyaW5nW3BhaXJbMF1dID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHF1ZXJ5X3N0cmluZ1twYWlyWzBdXSA9IHBhaXJbMV07XG4gICAgICAgIC8vIElmIHNlY29uZCBlbnRyeSB3aXRoIHRoaXMgbmFtZVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHF1ZXJ5X3N0cmluZ1twYWlyWzBdXSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB2YXIgYXJyID0gWyBxdWVyeV9zdHJpbmdbcGFpclswXV0sIHBhaXJbMV0gXTtcbiAgICAgICAgcXVlcnlfc3RyaW5nW3BhaXJbMF1dID0gYXJyO1xuICAgICAgICAvLyBJZiB0aGlyZCBvciBsYXRlciBlbnRyeSB3aXRoIHRoaXMgbmFtZVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXJ5X3N0cmluZ1twYWlyWzBdXS5wdXNoKHBhaXJbMV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcXVlcnlfc3RyaW5nO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmO1xuIiwidmFyIG1rX2RyYXdpbmcgPSByZXF1aXJlKCcuL21rX2RyYXdpbmcnKTtcblxuLy92YXIgZHJhd2luZ19wYXJ0cyA9IFtdO1xuLy9kLmxpbmtfZHJhd2luZ19wYXJ0cyhkcmF3aW5nX3BhcnRzKTtcblxudmFyIHBhZ2UgPSBmdW5jdGlvbigpe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHBhZ2UgMlwiKTtcbiAgICBkID0gbWtfZHJhd2luZygpO1xuXG4gICAgdmFyIGYgPSBnLmY7XG5cbiAgICAvL3ZhciBjb21wb25lbnRzID0gZy5jb21wb25lbnRzO1xuICAgIC8vdmFyIHN5c3RlbSA9IGcuc3lzdGVtO1xuICAgIHZhciBzeXN0ZW0gPSBnLnN5c3RlbTtcblxuICAgIHZhciBzaXplID0gZy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIGxvYyA9IGcuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG5cblxuXG5cbiAgICB2YXIgeCwgeSwgaCwgdztcbiAgICB2YXIgb2Zmc2V0O1xuXG4vLyBEZWZpbmUgZC5ibG9ja3NcblxuLy8gbW9kdWxlIGQuYmxvY2tcbiAgICB3ID0gc2l6ZS5tb2R1bGUuZnJhbWUudztcbiAgICBoID0gc2l6ZS5tb2R1bGUuZnJhbWUuaDtcblxuICAgIGQuYmxvY2tfc3RhcnQoJ21vZHVsZScpO1xuXG4gICAgLy8gZnJhbWVcbiAgICBkLmxheWVyKCdtb2R1bGUnKTtcbiAgICB4ID0gMDtcbiAgICB5ID0gMCtzaXplLm1vZHVsZS5sZWFkO1xuICAgIGQucmVjdCggW3gseStoLzJdLCBbdyxoXSApO1xuICAgIC8vIGZyYW1lIHRyaWFuZ2xlP1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LXcvMix5XSxcbiAgICAgICAgW3gseSt3LzJdLFxuICAgIF0pO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LHkrdy8yXSxcbiAgICAgICAgW3grdy8yLHldLFxuICAgIF0pO1xuICAgIC8vIGxlYWRzXG4gICAgZC5sYXllcignRENfcG9zJyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gsIHldLFxuICAgICAgICBbeCwgeS1zaXplLm1vZHVsZS5sZWFkXVxuICAgIF0pO1xuICAgIGQubGF5ZXIoJ0RDX25lZycpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LCB5K2hdLFxuICAgICAgICBbeCwgeStoKyhzaXplLm1vZHVsZS5sZWFkKV1cbiAgICBdKTtcbiAgICAvLyBwb3Mgc2lnblxuICAgIGQubGF5ZXIoJ3RleHQnKTtcbiAgICBkLnRleHQoXG4gICAgICAgIFt4K3NpemUubW9kdWxlLmxlYWQvMiwgeS1zaXplLm1vZHVsZS5sZWFkLzJdLFxuICAgICAgICAnKycsXG4gICAgICAgICdzaWducydcbiAgICApO1xuICAgIC8vIG5lZyBzaWduXG4gICAgZC50ZXh0KFxuICAgICAgICBbeCtzaXplLm1vZHVsZS5sZWFkLzIsIHkraCtzaXplLm1vZHVsZS5sZWFkLzJdLFxuICAgICAgICAnLScsXG4gICAgICAgICdzaWducydcbiAgICApO1xuICAgIC8vIGdyb3VuZFxuICAgIGQubGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LXcvMiwgeStoLzJdLFxuICAgICAgICBbeC13LzItdy80LCB5K2gvMl0sXG4gICAgXSk7XG5cbiAgICBkLmxheWVyKCk7XG4gICAgZC5ibG9ja19lbmQoKTtcblxuLy8jc3RyaW5nXG4gICAgZC5ibG9ja19zdGFydCgnc3RyaW5nJyk7XG5cbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcblxuXG5cblxuXG4gICAgdmFyIG1heF9kaXNwbGF5ZWRfbW9kdWxlcyA9IDk7XG4gICAgdmFyIGJyZWFrX3N0cmluZyA9IGZhbHNlO1xuXG4gICAgaWYoIHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgPiBtYXhfZGlzcGxheWVkX21vZHVsZXMgKXtcbiAgICAgICAgZGlzcGxheWVkX21vZHVsZXMgPSBtYXhfZGlzcGxheWVkX21vZHVsZXMgLSAxO1xuICAgICAgICBicmVha19zdHJpbmcgPSB0cnVlO1xuICAgICAgICBzaXplLnN0cmluZy5oID0gKHNpemUubW9kdWxlLmggKiAoZGlzcGxheWVkX21vZHVsZXMrMSkgKSArIHNpemUuc3RyaW5nLmdhcF9taXNzaW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGRpc3BsYXllZF9tb2R1bGVzID0gc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZztcbiAgICAgICAgc2l6ZS5zdHJpbmcuaCA9IChzaXplLm1vZHVsZS5oICogZGlzcGxheWVkX21vZHVsZXMpO1xuICAgIH1cbiAgICBsb2MuYXJyYXkubG93ZXIgPSBsb2MuYXJyYXkudXBwZXIgKyBzaXplLnN0cmluZy5oO1xuXG4gICAgc2l6ZS5zdHJpbmcuaF9tYXggPSAoc2l6ZS5tb2R1bGUuaCAqIG1heF9kaXNwbGF5ZWRfbW9kdWxlcykgKyBzaXplLnN0cmluZy5nYXBfbWlzc2luZztcbiAgICBsb2MuYXJyYXkubG93ZXJfbGltaXQgPSBsb2MuYXJyYXkudXBwZXIgKyBzaXplLnN0cmluZy5oX21heDtcblxuXG5cbiAgICBmb3IoIHZhciByPTA7IHI8ZGlzcGxheWVkX21vZHVsZXM7IHIrKyl7XG4gICAgICAgIGQuYmxvY2soJ21vZHVsZScsIFt4LHldKTtcbiAgICAgICAgeSArPSBzaXplLm1vZHVsZS5oO1xuXG4gICAgfVxuICAgIGlmKCBicmVha19zdHJpbmcgKSB7XG4gICAgICAgIGQubGluZShcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBbeCx5XSxcbiAgICAgICAgICAgICAgICBbeCx5K3NpemUuc3RyaW5nLmdhcF9taXNzaW5nXSxcbiAgICAgICAgICAgIC8vW3gtc2l6ZS5tb2R1bGUuZnJhbWUudyozLzQsIHkrc2l6ZS5zdHJpbmcuaCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ0RDX2ludGVybW9kdWxlJ1xuICAgICAgICApO1xuXG4gICAgICAgIHkgKz0gc2l6ZS5zdHJpbmcuZ2FwX21pc3Npbmc7XG4gICAgICAgIGQuYmxvY2soJ21vZHVsZScsIFt4LHldKTtcbiAgICB9XG5cbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcblxuICAgIC8vVE9ETzogYWRkIGxvb3AgdG8ganVtcCBvdmVyIG5lZ2F0aXZlIHJldHVybiB3aXJlc1xuICAgIGQubGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LXNpemUubW9kdWxlLmZyYW1lLncqMy80LCB5K3NpemUubW9kdWxlLmgvMl0sXG4gICAgICAgIFt4LXNpemUubW9kdWxlLmZyYW1lLncqMy80LCB5K3NpemUuc3RyaW5nLmhfbWF4ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmRdLFxuICAgICAgICAvL1t4LXNpemUubW9kdWxlLmZyYW1lLncqMy80LCB5K3NpemUuc3RyaW5nLmggKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgIF0pO1xuICAgIGQubGF5ZXIoKTtcblxuXG4gICAgZC5ibG9ja19lbmQoKTtcblxuXG4vLyB0ZXJtaW5hbFxuICAgIGQuYmxvY2tfc3RhcnQoJ3Rlcm1pbmFsJyk7XG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG5cbiAgICBkLmxheWVyKCd0ZXJtaW5hbCcpO1xuICAgIGQuY2lyYyhcbiAgICAgICAgW3gseV0sXG4gICAgICAgIHNpemUudGVybWluYWxfZGlhbVxuICAgICk7XG4gICAgZC5sYXllcigpO1xuICAgIGQuYmxvY2tfZW5kKCk7XG5cbi8vIGZ1c2VcblxuICAgIGQuYmxvY2tfc3RhcnQoJ2Z1c2UnKTtcbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcbiAgICB3ID0gMTA7XG4gICAgaCA9IDU7XG5cbiAgICBkLmxheWVyKCd0ZXJtaW5hbCcpO1xuICAgIGQucmVjdChcbiAgICAgICAgW3gseV0sXG4gICAgICAgIFt3LGhdXG4gICAgKTtcbiAgICBkLmxpbmUoIFtcbiAgICAgICAgW3cvMix5XSxcbiAgICAgICAgW3cvMitzaXplLmZ1c2UudywgeV1cbiAgICBdKTtcbiAgICBkLmJsb2NrKCd0ZXJtaW5hbCcsIFtzaXplLmZ1c2UudywgeV0gKTtcblxuICAgIGQubGluZSggW1xuICAgICAgICBbLXcvMix5XSxcbiAgICAgICAgWy13LzItc2l6ZS5mdXNlLncsIHldXG4gICAgXSk7XG4gICAgZC5ibG9jaygndGVybWluYWwnLCBbLXNpemUuZnVzZS53LCB5XSApO1xuXG4gICAgZC5sYXllcigpO1xuICAgIGQuYmxvY2tfZW5kKCk7XG5cbi8vIGdyb3VuZCBzeW1ib2xcbiAgICBkLmJsb2NrX3N0YXJ0KCdncm91bmQnKTtcbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcblxuICAgIGQubGF5ZXIoJ0FDX2dyb3VuZCcpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LHldLFxuICAgICAgICBbeCx5KzQwXSxcbiAgICBdKTtcbiAgICB5ICs9IDI1O1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LTcuNSx5XSxcbiAgICAgICAgW3grNy41LHldLFxuICAgIF0pO1xuICAgIHkgKz0gNTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC01LHldLFxuICAgICAgICBbeCs1LHldLFxuICAgIF0pO1xuICAgIHkgKz0gNTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC0yLjUseV0sXG4gICAgICAgIFt4KzIuNSx5XSxcbiAgICBdKTtcbiAgICBkLmxheWVyKCk7XG5cbiAgICBkLmJsb2NrX2VuZCgpO1xuXG5cblxuLy8gTm9ydGggYXJyb3dcbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcblxuICAgIHZhciBhcnJvd193ID0gNztcbiAgICB2YXIgbGV0dGVyX2ggPSAxNDtcbiAgICB2YXIgYXJyb3dfaCA9IDUwO1xuXG4gICAgZC5ibG9ja19zdGFydCgnbm9ydGggYXJyb3dfdXAnKTtcbiAgICBkLmxheWVyKCdub3J0aF9sZXR0ZXInKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCwgeStsZXR0ZXJfaF0sXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3grYXJyb3dfdywgeStsZXR0ZXJfaF0sXG4gICAgICAgIFt4K2Fycm93X3csIHldLFxuICAgIF0pO1xuICAgIGQubGF5ZXIoJ25vcnRoX2Fycm93Jyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gsIHkrYXJyb3dfaF0sXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3grYXJyb3dfdy8yLCB5K2xldHRlcl9oLzJdLFxuICAgIF0pO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3gtYXJyb3dfdy8yLCB5K2xldHRlcl9oLzJdLFxuICAgIF0pO1xuICAgIGQubGF5ZXIoKTtcbiAgICBkLmJsb2NrX2VuZCgnbm9ydGggYXJyb3cnKTtcblxuICAgIGQuYmxvY2tfc3RhcnQoJ25vcnRoIGFycm93X2xlZnQnKTtcbiAgICBkLmxheWVyKCdub3J0aF9sZXR0ZXInKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCtsZXR0ZXJfaCwgeV0sXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3grbGV0dGVyX2gsIHktYXJyb3dfd10sXG4gICAgICAgIFt4LCAgICAgICAgICB5LWFycm93X3ddLFxuICAgIF0pO1xuICAgIGQubGF5ZXIoJ25vcnRoX2Fycm93Jyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3grYXJyb3dfaCwgeV0sXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3grbGV0dGVyX2gvMiwgeS1hcnJvd193LzJdLFxuICAgIF0pO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3grbGV0dGVyX2gvMiwgeSthcnJvd193LzJdLFxuICAgIF0pO1xuICAgIGQubGF5ZXIoKTtcbiAgICBkLmJsb2NrX2VuZCgnbm9ydGggYXJyb3cnKTtcblxuLy8qL1xuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xuXG4vL3ZhciBkcmF3aW5nX3BhcnRzID0gW107XG4vL2QubGlua19kcmF3aW5nX3BhcnRzKGRyYXdpbmdfcGFydHMpO1xuXG52YXIgYWRkX2JvcmRlciA9IGZ1bmN0aW9uKHNldHRpbmdzLCBzaGVldF9zZWN0aW9uLCBzaGVldF9udW0pe1xuICAgIGQgPSBta19kcmF3aW5nKCk7XG4gICAgdmFyIGYgPSBzZXR0aW5ncy5mO1xuXG4gICAgLy92YXIgY29tcG9uZW50cyA9IHNldHRpbmdzLmNvbXBvbmVudHM7XG4gICAgLy92YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG5cblxuXG5cbiAgICB2YXIgeCwgeSwgaCwgdztcbiAgICB2YXIgb2Zmc2V0O1xuXG4vLyBEZWZpbmUgZC5ibG9ja3Ncbi8vIG1vZHVsZSBkLmJsb2NrXG4gICAgdyA9IHNpemUubW9kdWxlLmZyYW1lLnc7XG4gICAgaCA9IHNpemUubW9kdWxlLmZyYW1lLmg7XG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gRnJhbWVcbiAgICBkLnNlY3Rpb24oJ0ZyYW1lJyk7XG5cbiAgICB3ID0gc2l6ZS5kcmF3aW5nLnc7XG4gICAgaCA9IHNpemUuZHJhd2luZy5oO1xuICAgIHZhciBwYWRkaW5nID0gc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmc7XG5cbiAgICBkLmxheWVyKCdmcmFtZScpO1xuXG4gICAgLy9ib3JkZXJcbiAgICBkLnJlY3QoIFt3LzIgLCBoLzJdLCBbdyAtIHBhZGRpbmcqMiwgaCAtIHBhZGRpbmcqMiBdICk7XG5cbiAgICB4ID0gdyAtIHBhZGRpbmcgKiAzO1xuICAgIHkgPSBwYWRkaW5nICogMztcblxuICAgIHcgPSBzaXplLmRyYXdpbmcudGl0bGVib3g7XG4gICAgaCA9IHNpemUuZHJhd2luZy50aXRsZWJveDtcblxuICAgIC8vIGJveCB0b3AtcmlnaHRcbiAgICBkLnJlY3QoIFt4LXcvMiwgeStoLzJdLCBbdyxoXSApO1xuXG4gICAgeSArPSBoICsgcGFkZGluZztcblxuICAgIHcgPSBzaXplLmRyYXdpbmcudGl0bGVib3g7XG4gICAgaCA9IHNpemUuZHJhd2luZy5oIC0gcGFkZGluZyo4IC0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94KjIuNTtcblxuICAgIC8vdGl0bGUgYm94XG4gICAgZC5yZWN0KCBbeC13LzIsIHkraC8yXSwgW3csaF0gKTtcblxuICAgIHZhciB0aXRsZSA9IHt9O1xuICAgIHRpdGxlLnRvcCA9IHk7XG4gICAgdGl0bGUuYm90dG9tID0geStoO1xuICAgIHRpdGxlLnJpZ2h0ID0geDtcbiAgICB0aXRsZS5sZWZ0ID0geC13IDtcblxuXG4gICAgLy8gYm94IGJvdHRvbS1yaWdodFxuICAgIGggPSBzaXplLmRyYXdpbmcudGl0bGVib3ggKiAxLjU7XG4gICAgeSA9IHRpdGxlLmJvdHRvbSArIHBhZGRpbmc7XG4gICAgeCA9IHgtdy8yO1xuICAgIHkgPSB5K2gvMjtcbiAgICBkLnJlY3QoIFt4LCB5XSwgW3csaF0gKTtcblxuICAgIHkgLT0gMjAqMi8zO1xuICAgIGQudGV4dChbeCx5XSxcbiAgICAgICAgWyBzaGVldF9zZWN0aW9uLCBzaGVldF9udW0gXSxcbiAgICAgICAgJ3BhZ2UnLFxuICAgICAgICAndGV4dCdcbiAgICAgICAgKTtcblxuXG4gICAgdmFyIHBhZ2UgPSB7fTtcbiAgICBwYWdlLnJpZ2h0ID0gdGl0bGUucmlnaHQ7XG4gICAgcGFnZS5sZWZ0ID0gdGl0bGUubGVmdDtcbiAgICBwYWdlLnRvcCA9IHRpdGxlLmJvdHRvbSArIHBhZGRpbmc7XG4gICAgcGFnZS5ib3R0b20gPSBwYWdlLnRvcCArIHNpemUuZHJhd2luZy50aXRsZWJveCoxLjU7XG4gICAgLy8gZC50ZXh0XG5cbiAgICB4ID0gdGl0bGUubGVmdCArIHBhZGRpbmc7XG4gICAgeSA9IHRpdGxlLmJvdHRvbSAtIHBhZGRpbmc7XG5cbiAgICB4ICs9IDEwO1xuICAgIGlmKCBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSAmJiBzeXN0ZW0uaW52ZXJ0ZXIubW9kZWwgKXtcbiAgICAgICAgZC50ZXh0KFt4LHldLFxuICAgICAgICAgICAgIFsgc3lzdGVtLmludmVydGVyLm1ha2UgKyBcIiBcIiArIHN5c3RlbS5pbnZlcnRlci5tb2RlbCArIFwiIEludmVydGVyIFN5c3RlbVwiIF0sXG4gICAgICAgICAgICAndGl0bGUxJywgJ3RleHQnKS5yb3RhdGUoLTkwKTtcblxuICAgIH1cblxuICAgIHggKz0gMTQ7XG4gICAgaWYoIHN5c3RlbS5tb2R1bGUubW9kZWwgJiYgc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzICYmIHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgICl7XG4gICAgICAgIGQudGV4dChbeCx5XSwgW1xuICAgICAgICAgICAgc3lzdGVtLm1vZHVsZS5tYWtlICsgXCIgXCIgKyBzeXN0ZW0ubW9kdWxlLm1vZGVsICtcbiAgICAgICAgICAgICAgICBcIiAoXCIgKyBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgICsgXCIgc3RyaW5ncyBvZiBcIiArIHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgKyBcIiBtb2R1bGVzIClcIlxuICAgICAgICBdLCAndGl0bGUyJywgJ3RleHQnKS5yb3RhdGUoLTkwKTtcbiAgICB9XG5cbiAgICB4ID0gcGFnZS5sZWZ0ICsgcGFkZGluZztcbiAgICB5ID0gcGFnZS50b3AgKyBwYWRkaW5nO1xuICAgIHkgKz0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94ICogMS41ICogMy80O1xuXG5cblxuXG5cblxuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZF9ib3JkZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBrID0gcmVxdWlyZSgnLi4vbGliL2svay5qcycpO1xudmFyIGYgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy5qcycpO1xuXG4vL3ZhciBzZXR0aW5ncyA9IHJlcXVpcmUoJy4vc2V0dGluZ3MuanMnKTtcbi8vdmFyIGxfYXR0ciA9IHNldHRpbmdzLmRyYXdpbmcubF9hdHRyO1xuLy92YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbi8vIHNldHVwIGRyYXdpbmcgY29udGFpbmVyc1xuXG52YXIgc2V0dGluZ3MgPSByZXF1aXJlKCcuL3NldHRpbmdzJyk7XG52YXIgbGF5ZXJfYXR0ciA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubGF5ZXJfYXR0cjtcbnZhciBmb250cyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MuZm9udHM7XG5cblxuXG5cblxudmFyIGRyYXdpbmcgPSB7fTtcblxuXG5cblxuXG5cblxuXG5cbi8vIEJMT0NLU1xuXG52YXIgQmxrID0ge1xuICAgIHR5cGU6ICdibG9jaycsXG59O1xuQmxrLm1vdmUgPSBmdW5jdGlvbih4LCB5KXtcbiAgICBmb3IoIHZhciBpIGluIHRoaXMuZHJhd2luZ19wYXJ0cyApe1xuICAgICAgICB0aGlzLmRyYXdpbmdfcGFydHNbaV0ubW92ZSh4LHkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5CbGsuYWRkID0gZnVuY3Rpb24oKXtcbiAgICBpZiggdHlwZW9mIHRoaXMuZHJhd2luZ19wYXJ0cyA9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgIHRoaXMuZHJhd2luZ19wYXJ0cyA9IFtdO1xuICAgIH1cbiAgICBmb3IoIHZhciBpIGluIGFyZ3VtZW50cyl7XG4gICAgICAgIHRoaXMuZHJhd2luZ19wYXJ0cy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbkJsay5yb3RhdGUgPSBmdW5jdGlvbihkZWcpe1xuICAgIHRoaXMucm90YXRlID0gZGVnO1xufTtcblxuXG52YXIgYmxvY2tfYWN0aXZlID0gZmFsc2U7XG4vLyBDcmVhdGUgZGVmYXVsdCBsYXllcixibG9jayBjb250YWluZXIgYW5kIGZ1bmN0aW9uc1xuXG4vLyBMYXllcnNcblxudmFyIGxheWVyX2FjdGl2ZSA9IGZhbHNlO1xuXG5kcmF3aW5nLmxheWVyID0gZnVuY3Rpb24obmFtZSl7IC8vIHNldCBjdXJyZW50IGxheWVyXG4gICAgaWYoIHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJyApeyAvLyBpZiBubyBsYXllciBuYW1lIGdpdmVuLCByZXNldCB0byBkZWZhdWx0XG4gICAgICAgIGxheWVyX2FjdGl2ZSA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoICEgKG5hbWUgaW4gbGF5ZXJfYXR0cikgKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignRXJyb3I6IHVua25vd24gbGF5ZXIgXCInK25hbWUrJ1wiLCB1c2luZyBiYXNlJyk7XG4gICAgICAgIGxheWVyX2FjdGl2ZSA9ICdiYXNlJyA7XG4gICAgfSBlbHNlIHsgLy8gZmluYWx5IGFjdGl2YXRlIHJlcXVlc3RlZCBsYXllclxuICAgICAgICBsYXllcl9hY3RpdmUgPSBuYW1lO1xuICAgIH1cbiAgICAvLyovXG59O1xuXG52YXIgc2VjdGlvbl9hY3RpdmUgPSBmYWxzZTtcblxuZHJhd2luZy5zZWN0aW9uID0gZnVuY3Rpb24obmFtZSl7IC8vIHNldCBjdXJyZW50IHNlY3Rpb25cbiAgICBpZiggdHlwZW9mIG5hbWUgPT09ICd1bmRlZmluZWQnICl7IC8vIGlmIG5vIHNlY3Rpb24gbmFtZSBnaXZlbiwgcmVzZXQgdG8gZGVmYXVsdFxuICAgICAgICBzZWN0aW9uX2FjdGl2ZSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7IC8vIGZpbmFseSBhY3RpdmF0ZSByZXF1ZXN0ZWQgc2VjdGlvblxuICAgICAgICBzZWN0aW9uX2FjdGl2ZSA9IG5hbWU7XG4gICAgfVxuICAgIC8vKi9cbn07XG5cblxuZHJhd2luZy5ibG9ja19zdGFydCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiggdHlwZW9mIG5hbWUgPT09ICd1bmRlZmluZWQnICl7IC8vIGlmIG5hbWUgYXJndW1lbnQgaXMgc3VibWl0dGVkXG4gICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogbmFtZSByZXF1aXJlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBibGs7XG4gICAgICAgIGJsb2NrX2FjdGl2ZSA9IG5hbWU7XG4gICAgICAgIGlmKCBnLmRyYXdpbmcuYmxvY2tzW2Jsb2NrX2FjdGl2ZV0gIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiBibG9jayBhbHJlYWR5IGV4aXN0cycpO1xuICAgICAgICB9XG4gICAgICAgIGJsayA9IE9iamVjdC5jcmVhdGUoQmxrKTtcbiAgICAgICAgZy5kcmF3aW5nLmJsb2Nrc1tibG9ja19hY3RpdmVdID0gYmxrO1xuICAgICAgICByZXR1cm4gYmxrO1xuICAgIH1cbn07XG5cbiAgICAvKlxuICAgIHggPSBsb2Mud2lyZV90YWJsZS54IC0gdy8yO1xuICAgIHkgPSBsb2Mud2lyZV90YWJsZS55IC0gaC8yO1xuICAgIGlmKCB0eXBlb2YgbGF5ZXJfbmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApIHtcbiAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gbGF5ZXJzW2xheWVyX25hbWVdXG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYoICEgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApeyBjb25zb2xlLmxvZyhcImVycm9yLCBsYXllciBkb2VzIG5vdCBleGlzdCwgdXNpbmcgY3VycmVudFwiKTt9XG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9ICBsYXllcl9hY3RpdmVcbiAgICB9XG4gICAgKi9cbmRyYXdpbmcuYmxvY2tfZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJsayA9IGcuZHJhd2luZy5ibG9ja3NbYmxvY2tfYWN0aXZlXTtcbiAgICBibG9ja19hY3RpdmUgPSBmYWxzZTtcbiAgICByZXR1cm4gYmxrO1xufTtcblxuXG5cblxuXG5cbi8vLy8vL1xuLy8gYnVpbGQgcHJvdG90eXBlIGVsZW1lbnRcblxuICAgIC8qXG4gICAgaWYoIHR5cGVvZiBsYXllcl9uYW1lICE9PSAndW5kZWZpbmVkJyAmJiAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICkge1xuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSBsYXllcnNbbGF5ZXJfbmFtZV1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiggISAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICl7IGNvbnNvbGUubG9nKFwiZXJyb3IsIGxheWVyIGRvZXMgbm90IGV4aXN0LCB1c2luZyBjdXJyZW50XCIpO31cbiAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gIGxheWVyX2FjdGl2ZVxuICAgIH1cbiAgICAqL1xuXG5cbnZhciBTdmdFbGVtID0ge1xuICAgIG9iamVjdDogJ1N2Z0VsZW0nXG59O1xuU3ZnRWxlbS5tb3ZlID0gZnVuY3Rpb24oeCwgeSl7XG4gICAgaWYoIHR5cGVvZiB0aGlzLnBvaW50cyAhPSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLnBvaW50cyApIHtcbiAgICAgICAgICAgIHRoaXMucG9pbnRzW2ldWzBdICs9IHg7XG4gICAgICAgICAgICB0aGlzLnBvaW50c1tpXVsxXSArPSB5O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcblN2Z0VsZW0ucm90YXRlID0gZnVuY3Rpb24oZGVnKXtcbiAgICB0aGlzLnJvdGF0ZWQgPSBkZWc7XG59O1xuXG4vLy8vLy8vXG4vLyBmdW5jdGlvbnMgZm9yIGFkZGluZyBkcmF3aW5nX3BhcnRzXG5cbmRyYXdpbmcuYWRkID0gZnVuY3Rpb24odHlwZSwgcG9pbnRzLCBsYXllcl9uYW1lLCBhdHRycykge1xuICAgIGlmKCBwb2ludHNbMF0gPT09IHVuZGVmaW5lZCApIGNvbnNvbGUud2FybihcInBvaW50cyBub3QgZGVmZmluZWRcIiwgdHlwZSwgcG9pbnRzLCBsYXllcl9uYW1lICk7XG5cbiAgICBpZiggdHlwZW9mIGxheWVyX25hbWUgPT09ICd1bmRlZmluZWQnICkgeyBsYXllcl9uYW1lID0gbGF5ZXJfYWN0aXZlOyB9XG4gICAgaWYoICEgKGxheWVyX25hbWUgaW4gbGF5ZXJfYXR0cikgKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignRXJyb3I6IExheWVyIFwiJysgbGF5ZXJfbmFtZSArJ1wiIG5hbWUgbm90IGZvdW5kLCB1c2luZyBiYXNlJyk7XG4gICAgICAgIGxheWVyX25hbWUgPSAnYmFzZSc7XG4gICAgfVxuXG4gICAgaWYoIHR5cGVvZiBwb2ludHMgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFyIHBvaW50c19hID0gcG9pbnRzLnNwbGl0KCcgJyk7XG4gICAgICAgIGZvciggdmFyIGkgaW4gcG9pbnRzX2EgKSB7XG4gICAgICAgICAgICBwb2ludHNfYVtpXSA9IHBvaW50c19hW2ldLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICBmb3IoIHZhciBjIGluIHBvaW50c19hW2ldICkge1xuICAgICAgICAgICAgICAgIHBvaW50c19hW2ldW2NdID0gTnVtYmVyKHBvaW50c19hW2ldW2NdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBlbGVtID0gT2JqZWN0LmNyZWF0ZShTdmdFbGVtKTtcbiAgICBlbGVtLnR5cGUgPSB0eXBlO1xuICAgIGVsZW0ubGF5ZXJfbmFtZSA9IGxheWVyX25hbWU7XG4gICAgZWxlbS5zZWN0aW9uX25hbWUgPSBzZWN0aW9uX2FjdGl2ZTtcbiAgICBpZiggYXR0cnMgIT09IHVuZGVmaW5lZCApIGVsZW0uYXR0cnMgPSBhdHRycztcbiAgICBpZiggdHlwZSA9PT0gJ2xpbmUnICkge1xuICAgICAgICBlbGVtLnBvaW50cyA9IHBvaW50cztcbiAgICB9IGVsc2UgaWYoIHR5cGUgPT09ICdwb2x5JyApIHtcbiAgICAgICAgZWxlbS5wb2ludHMgPSBwb2ludHM7XG4gICAgfSBlbHNlIGlmKCB0eXBlb2YgcG9pbnRzWzBdLnggPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGVsZW0ueCA9IHBvaW50c1swXVswXTtcbiAgICAgICAgZWxlbS55ID0gcG9pbnRzWzBdWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW0ueCA9IHBvaW50c1swXS54O1xuICAgICAgICBlbGVtLnkgPSBwb2ludHNbMF0ueTtcbiAgICB9XG5cbiAgICBpZihibG9ja19hY3RpdmUpIHtcbiAgICAgICAgZWxlbS5ibG9ja19uYW1lID0gYmxvY2tfYWN0aXZlO1xuICAgICAgICBnLmRyYXdpbmcuYmxvY2tzW2Jsb2NrX2FjdGl2ZV0uYWRkKGVsZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZHJhd2luZ19wYXJ0cy5wdXNoKGVsZW0pO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtO1xufTtcblxuZHJhd2luZy5saW5lID0gZnVuY3Rpb24ocG9pbnRzLCBsYXllciwgYXR0cnMpeyAvLyAocG9pbnRzLCBbbGF5ZXJdKVxuICAgIC8vcmV0dXJuIGFkZCgnbGluZScsIHBvaW50cywgbGF5ZXIpXG4gICAgdmFyIGxpbmUgPSAgdGhpcy5hZGQoJ2xpbmUnLCBwb2ludHMsIGxheWVyLCBhdHRycyk7XG4gICAgcmV0dXJuIGxpbmU7XG59O1xuXG5kcmF3aW5nLnBvbHkgPSBmdW5jdGlvbihwb2ludHMsIGxheWVyLCBhdHRycyl7IC8vIChwb2ludHMsIFtsYXllcl0pXG4gICAgLy9yZXR1cm4gYWRkKCdwb2x5JywgcG9pbnRzLCBsYXllcilcbiAgICB2YXIgcG9seSA9ICB0aGlzLmFkZCgncG9seScsIHBvaW50cywgbGF5ZXIsIGF0dHJzKTtcbiAgICByZXR1cm4gcG9seTtcbn07XG5cbmRyYXdpbmcucmVjdCA9IGZ1bmN0aW9uKGxvYywgc2l6ZSwgbGF5ZXIsIGF0dHJzKXtcbiAgICB2YXIgcmVjID0gdGhpcy5hZGQoJ3JlY3QnLCBbbG9jXSwgbGF5ZXIsIGF0dHJzKTtcbiAgICByZWMudyA9IHNpemVbMF07XG4gICAgLypcbiAgICBpZiggdHlwZW9mIGxheWVyX25hbWUgIT09ICd1bmRlZmluZWQnICYmIChsYXllcl9uYW1lIGluIGxheWVycykgKSB7XG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9IGxheWVyc1tsYXllcl9uYW1lXVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCAhIChsYXllcl9uYW1lIGluIGxheWVycykgKXsgY29uc29sZS5sb2coXCJlcnJvciwgbGF5ZXIgZG9lcyBub3QgZXhpc3QsIHVzaW5nIGN1cnJlbnRcIik7fVxuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSAgbGF5ZXJfYWN0aXZlXG4gICAgfVxuICAgICovXG4gICAgcmVjLmggPSBzaXplWzFdO1xuICAgIHJldHVybiByZWM7XG59O1xuXG5kcmF3aW5nLmNpcmMgPSBmdW5jdGlvbihsb2MsIGRpYW1ldGVyLCBsYXllciwgYXR0cnMpe1xuICAgIHZhciBjaXIgPSB0aGlzLmFkZCgnY2lyYycsIFtsb2NdLCBsYXllciwgYXR0cnMpO1xuICAgIGNpci5kID0gZGlhbWV0ZXI7XG4gICAgcmV0dXJuIGNpcjtcbn07XG5cbmRyYXdpbmcudGV4dCA9IGZ1bmN0aW9uKGxvYywgc3RyaW5ncywgZm9udCwgbGF5ZXIsIGF0dHJzKXtcbiAgICB2YXIgdHh0ID0gdGhpcy5hZGQoJ3RleHQnLCBbbG9jXSwgbGF5ZXIsIGF0dHJzKTtcbiAgICBpZiggdHlwZW9mIHN0cmluZ3MgPT0gJ3N0cmluZycpe1xuICAgICAgICBzdHJpbmdzID0gW3N0cmluZ3NdO1xuICAgIH1cbiAgICB0eHQuc3RyaW5ncyA9IHN0cmluZ3M7XG4gICAgdHh0LmZvbnQgPSBmb250O1xuICAgIHJldHVybiB0eHQ7XG59O1xuXG5kcmF3aW5nLmJsb2NrID0gZnVuY3Rpb24obmFtZSkgey8vIHNldCBjdXJyZW50IGJsb2NrXG4gICAgdmFyIHgseTtcbiAgICBpZiggYXJndW1lbnRzLmxlbmd0aCA9PT0gMiApeyAvLyBpZiBjb29yIGlzIHBhc3NlZFxuICAgICAgICBpZiggdHlwZW9mIGFyZ3VtZW50c1sxXS54ICE9PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgeCA9IGFyZ3VtZW50c1sxXS54O1xuICAgICAgICAgICAgeSA9IGFyZ3VtZW50c1sxXS55O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeCA9IGFyZ3VtZW50c1sxXVswXTtcbiAgICAgICAgICAgIHkgPSBhcmd1bWVudHNbMV1bMV07XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYoIGFyZ3VtZW50cy5sZW5ndGggPT09IDMgKXsgLy8gaWYgeCx5IGlzIHBhc3NlZFxuICAgICAgICB4ID0gYXJndW1lbnRzWzFdO1xuICAgICAgICB5ID0gYXJndW1lbnRzWzJdO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHdoYXQgaWYgYmxvY2sgZG9lcyBub3QgZXhpc3Q/IHByaW50IGxpc3Qgb2YgYmxvY2tzP1xuICAgIHZhciBibGsgPSBPYmplY3QuY3JlYXRlKGcuZHJhd2luZy5ibG9ja3NbbmFtZV0pO1xuICAgIGJsay54ID0geDtcbiAgICBibGsueSA9IHk7XG5cbiAgICBpZihibG9ja19hY3RpdmUpe1xuICAgICAgICBnLmRyYXdpbmcuYmxvY2tzW2Jsb2NrX2FjdGl2ZV0uYWRkKGJsayk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kcmF3aW5nX3BhcnRzLnB1c2goYmxrKTtcbiAgICB9XG4gICAgcmV0dXJuIGJsaztcbn07XG5cblxuXG5cblxuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vXG4vLyBUYWJsZXNcblxudmFyIENlbGwgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24odGFibGUsIFIsIEMpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMudGFibGUgPSB0YWJsZTtcbiAgICAgICAgdGhpcy5SID0gUjtcbiAgICAgICAgdGhpcy5DID0gQztcbiAgICAgICAgLypcbiAgICAgICAgdGhpcy5ib3JkZXJzID0ge307XG4gICAgICAgIHRoaXMuYm9yZGVyX29wdGlvbnMuZm9yRWFjaChmdW5jdGlvbihzaWRlKXtcbiAgICAgICAgICAgIHNlbGYuYm9yZGVyc1tzaWRlXSA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8qL1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIC8qXG4gICAgYm9yZGVyX29wdGlvbnM6IFsnVCcsICdCJywgJ0wnLCAnUiddLFxuICAgIC8vKi9cbiAgICB0ZXh0OiBmdW5jdGlvbih0ZXh0KXtcbiAgICAgICAgdGhpcy5jZWxsX3RleHQgPSB0ZXh0O1xuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH0sXG4gICAgZm9udDogZnVuY3Rpb24oZm9udF9uYW1lKXtcbiAgICAgICAgdGhpcy5jZWxsX2ZvbnRfbmFtZSA9IGZvbnRfbmFtZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGJvcmRlcjogZnVuY3Rpb24oYm9yZGVyX3N0cmluZywgc3RhdGUpe1xuICAgICAgICB0aGlzLnRhYmxlLmJvcmRlciggdGhpcy5SLCB0aGlzLkMsIGJvcmRlcl9zdHJpbmcsIHN0YXRlICk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn07XG5cbnZhciBUYWJsZSA9IHtcbiAgICBpbml0OiBmdW5jdGlvbiggZHJhd2luZywgbnVtX3Jvd3MsIG51bV9jb2xzICl7XG4gICAgICAgIHRoaXMuZHJhd2luZyA9IGRyYXdpbmc7XG4gICAgICAgIHRoaXMubnVtX3Jvd3MgPSBudW1fcm93cztcbiAgICAgICAgdGhpcy5udW1fY29scyA9IG51bV9jb2xzO1xuICAgICAgICB2YXIgcixjO1xuXG4gICAgICAgIC8vIHNldHVwIGJvcmRlciBjb250YWluZXJzXG4gICAgICAgIHRoaXMuYm9yZGVyc19yb3dzID0gW107XG4gICAgICAgIGZvciggcj0wOyByPD1udW1fcm93czsgcisrKXtcbiAgICAgICAgICAgIHRoaXMuYm9yZGVyc19yb3dzW3JdID0gW107XG4gICAgICAgICAgICBmb3IoIGM9MTsgYzw9bnVtX2NvbHM7IGMrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5ib3JkZXJzX3Jvd3Nbcl1bY10gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJvcmRlcnNfY29scyA9IFtdO1xuICAgICAgICBmb3IoIGM9MDsgYzw9bnVtX2NvbHM7IGMrKyl7XG4gICAgICAgICAgICB0aGlzLmJvcmRlcnNfY29sc1tjXSA9IFtdO1xuICAgICAgICAgICAgZm9yKCByPTE7IHI8PW51bV9yb3dzOyByKyspe1xuICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyc19jb2xzW2NdW3JdID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzZXQgY29sdW1uIGFuZCByb3cgc2l6ZSBjb250YWluZXJzXG4gICAgICAgIHRoaXMucm93X3NpemVzID0gW107XG4gICAgICAgIGZvciggcj0xOyByPD1udW1fcm93czsgcisrKXtcbiAgICAgICAgICAgIHRoaXMucm93X3NpemVzW3JdID0gMTU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb2xfc2l6ZXMgPSBbXTtcbiAgICAgICAgZm9yKCBjPTE7IGM8PW51bV9jb2xzOyBjKyspe1xuICAgICAgICAgICAgdGhpcy5jb2xfc2l6ZXNbY10gPSA2MDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNldHVwIGNlbGwgY29udGFpbmVyXG4gICAgICAgIHRoaXMuY2VsbHMgPSBbXTtcbiAgICAgICAgZm9yKCByPTE7IHI8PW51bV9yb3dzOyByKyspe1xuICAgICAgICAgICAgdGhpcy5jZWxsc1tyXSA9IFtdO1xuICAgICAgICAgICAgZm9yKCBjPTE7IGM8PW51bV9jb2xzOyBjKyspe1xuICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbcl1bY10gPSBPYmplY3QuY3JlYXRlKENlbGwpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbcl1bY10uaW5pdCggdGhpcywgciwgYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICAvLyovXG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBsb2M6IGZ1bmN0aW9uKCB4LCB5KXtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjZWxsOiBmdW5jdGlvbiggUiwgQyApe1xuICAgICAgICByZXR1cm4gdGhpcy5jZWxsc1tSXVtDXTtcbiAgICB9LFxuICAgIGFsbF9jZWxsczogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGNlbGxfYXJyYXkgPSBbXTtcbiAgICAgICAgdGhpcy5jZWxscy5mb3JFYWNoKGZ1bmN0aW9uKHJvdyl7XG4gICAgICAgICAgICByb3cuZm9yRWFjaChmdW5jdGlvbihjZWxsKXtcbiAgICAgICAgICAgICAgICBjZWxsX2FycmF5LnB1c2goY2VsbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjZWxsX2FycmF5O1xuICAgIH0sXG4gICAgY29sX3NpemU6IGZ1bmN0aW9uKGNvbCwgc2l6ZSl7XG4gICAgICAgIGlmKCB0eXBlb2YgY29sID09PSAnc3RyaW5nJyApe1xuICAgICAgICAgICAgaWYoIGNvbCA9PT0gJ2FsbCcpe1xuICAgICAgICAgICAgICAgIF8ucmFuZ2UodGhpcy5udW1fY29scykuZm9yRWFjaChmdW5jdGlvbihjKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xfc2l6ZXNbYysxXSA9IHNpemU7XG4gICAgICAgICAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2l6ZSA9IE51bWJlcihzaXplKTtcbiAgICAgICAgICAgICAgICBpZiggaXNOYU4oc2l6ZSkgKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiBjb2x1bW4gd3JvbmcnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbF9zaXplc1tjb2xdID0gc2l6ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7IC8vIGlzIG51bWJlclxuICAgICAgICAgICAgdGhpcy5jb2xfc2l6ZXNbY29sXSA9IHNpemU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICAvLyovXG4gICAgcm93X3NpemU6IGZ1bmN0aW9uKHJvdywgc2l6ZSl7XG4gICAgICAgIGlmKCB0eXBlb2Ygcm93ID09PSAnc3RyaW5nJyApe1xuICAgICAgICAgICAgaWYoIHJvdyA9PT0gJ2FsbCcpe1xuICAgICAgICAgICAgICAgIF8ucmFuZ2UodGhpcy5udW1fcm93cykuZm9yRWFjaChmdW5jdGlvbihyKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3dfc2l6ZXNbcisxXSA9IHNpemU7XG4gICAgICAgICAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2l6ZSA9IE51bWJlcihzaXplKTtcbiAgICAgICAgICAgICAgICBpZiggaXNOYU4oc2l6ZSkgKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiBjb2x1bW4gd3JvbmcnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvd19zaXplc1tyb3ddID0gc2l6ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7IC8vIGlzIG51bWJlclxuICAgICAgICAgICAgdGhpcy5yb3dfc2l6ZXNbcm93XSA9IHNpemU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICAvLyovXG5cbiAgICAvKlxuICAgIGFkZF9jZWxsOiBmdW5jdGlvbigpe1xuXG4gICAgfSxcbiAgICBhZGRfcm93czogZnVuY3Rpb24obil7XG4gICAgICAgIHRoaXMubnVtX2NvbG1ucyArPSBuO1xuICAgICAgICB0aGlzLm51bV9yb3dzICs9IG47XG4gICAgICAgIF8ucmFuZ2UobikuZm9yRWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5yb3dzLnB1c2goW10pO1xuICAgICAgICB9KTtcbiAgICAgICAgXy5yYW5nZShuKS5mb3JFYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLnRleHRfcm93cy5wdXNoKFtdKTtcbiAgICAgICAgfSk7XG5cbiAgICB9LFxuICAgIHRleHQ6IGZ1bmN0aW9uKCBSLCBDLCB0ZXh0KXtcbiAgICAgICAgdGhpcy50ZXh0X3Jvd3NbUl1bQ10gPSB0ZXh0O1xuICAgIH0sXG4gICAgLy8qL1xuICAgIGJvcmRlcjogZnVuY3Rpb24oIFIsIEMsIGJvcmRlcl9zdHJpbmcsIHN0YXRlKXtcbiAgICAgICAgaWYoIHN0YXRlID09PSB1bmRlZmluZWQgKSBzdGF0ZSA9IHRydWU7XG5cbiAgICAgICAgYm9yZGVyX3N0cmluZyA9IGJvcmRlcl9zdHJpbmcudG9VcHBlckNhc2UoKS50cmltKCk7XG4gICAgICAgIHZhciBib3JkZXJzO1xuICAgICAgICBpZiggYm9yZGVyX3N0cmluZyA9PT0gJ0FMTCcgKXtcbiAgICAgICAgICAgIGJvcmRlcnMgPSBbJ1QnLCAnQicsICdMJywgJ1InXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJvcmRlcnMgPSBib3JkZXJfc3RyaW5nLnNwbGl0KC9bXFxzLF0rLyk7XG4gICAgICAgIH1cbiAgICAgICAgYm9yZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHNpZGUpe1xuICAgICAgICAgICAgc3dpdGNoKHNpZGUpe1xuICAgICAgICAgICAgICAgIGNhc2UgJ1QnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfcm93c1tSLTFdW0NdID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0InOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfcm93c1tSXVtDXSA9IHN0YXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdMJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3JkZXJzX2NvbHNbQy0xXVtSXSA9IHN0YXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdSJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3JkZXJzX2NvbHNbQ11bUl0gPSBzdGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNvcm5lcjogZnVuY3Rpb24oUixDKXtcbiAgICAgICAgdmFyIHggPSB0aGlzLng7XG4gICAgICAgIHZhciB5ID0gdGhpcy55O1xuICAgICAgICB2YXIgcixjO1xuICAgICAgICBmb3IoIHI9MTsgcjw9UjsgcisrICl7XG4gICAgICAgICAgICB5ICs9IHRoaXMucm93X3NpemVzW3JdO1xuICAgICAgICB9XG4gICAgICAgIGZvciggYz0xOyBjPD1DOyBjKysgKXtcbiAgICAgICAgICAgIHggKz0gdGhpcy5jb2xfc2l6ZXNbY107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFt4LHldO1xuICAgIH0sXG4gICAgY2VudGVyOiBmdW5jdGlvbihSLEMpe1xuICAgICAgICB2YXIgeCA9IHRoaXMueDtcbiAgICAgICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgICAgIHZhciByLGM7XG4gICAgICAgIGZvciggcj0xOyByPD1SOyByKysgKXtcbiAgICAgICAgICAgIHkgKz0gdGhpcy5yb3dfc2l6ZXNbcl07XG4gICAgICAgIH1cbiAgICAgICAgZm9yKCBjPTE7IGM8PUM7IGMrKyApe1xuICAgICAgICAgICAgeCArPSB0aGlzLmNvbF9zaXplc1tjXTtcbiAgICAgICAgfVxuICAgICAgICB5IC09IHRoaXMucm93X3NpemVzW1JdLzI7XG4gICAgICAgIHggLT0gdGhpcy5jb2xfc2l6ZXNbQ10vMjtcbiAgICAgICAgcmV0dXJuIFt4LHldO1xuICAgIH0sXG4gICAgbGVmdDogZnVuY3Rpb24oUixDKXtcbiAgICAgICAgdmFyIGNvb3IgPSB0aGlzLmNlbnRlcihSLEMpO1xuICAgICAgICBjb29yWzBdID0gY29vclswXSAtIHRoaXMuY29sX3NpemVzW0NdLzIgKyB0aGlzLnJvd19zaXplc1tSXS8yO1xuICAgICAgICByZXR1cm4gY29vcjtcbiAgICB9LFxuICAgIHJpZ2h0OiBmdW5jdGlvbihSLEMpe1xuICAgICAgICB2YXIgY29vciA9IHRoaXMuY2VudGVyKFIsQyk7XG4gICAgICAgIGNvb3JbMF0gPSBjb29yWzBdICsgdGhpcy5jb2xfc2l6ZXNbQ10vMiAtIHRoaXMucm93X3NpemVzW1JdLzI7XG4gICAgICAgIHJldHVybiBjb29yO1xuICAgIH0sXG4gICAgbWs6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHIsYztcbiAgICAgICAgZm9yKCByPTA7IHI8PXRoaXMubnVtX3Jvd3M7IHIrKyApe1xuICAgICAgICAgICAgZm9yKCBjPTE7IGM8PXRoaXMubnVtX2NvbHM7IGMrKyApe1xuICAgICAgICAgICAgICAgIGlmKCB0aGlzLmJvcmRlcnNfcm93c1tyXVtjXSA9PT0gdHJ1ZSApe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdpbmcubGluZShbXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcm5lcihyLGMtMSksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcm5lcihyLGMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSwgJ2JvcmRlcicpO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciggYz0wOyBjPD10aGlzLm51bV9jb2xzOyBjKysgKXtcbiAgICAgICAgICAgIGZvciggcj0xOyByPD10aGlzLm51bV9yb3dzOyByKysgKXtcbiAgICAgICAgICAgICAgICBpZiggdGhpcy5ib3JkZXJzX2NvbHNbY11bcl0gPT09IHRydWUgKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3aW5nLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JuZXIoci0xLGMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JuZXIocixjKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sICdib3JkZXInKTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IoIHI9MTsgcjw9dGhpcy5udW1fcm93czsgcisrICl7XG4gICAgICAgICAgICBmb3IoIGM9MTsgYzw9dGhpcy5udW1fY29sczsgYysrICl7XG4gICAgICAgICAgICAgICAgaWYoIHR5cGVvZiB0aGlzLmNlbGwocixjKS5jZWxsX3RleHQgPT09ICdzdHJpbmcnICl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjZWxsID0gdGhpcy5jZWxsKHIsYyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmb250X25hbWUgPSBjZWxsLmNlbGxfZm9udF9uYW1lIHx8ICd0YWJsZSc7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb29yO1xuICAgICAgICAgICAgICAgICAgICBpZiggZy5kcmF3aW5nX3NldHRpbmdzLmZvbnRzW2ZvbnRfbmFtZV1bJ3RleHQtYW5jaG9yJ10gPT09ICdjZW50ZXInKSBjb29yID0gdGhpcy5jZW50ZXIocixjKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiggZy5kcmF3aW5nX3NldHRpbmdzLmZvbnRzW2ZvbnRfbmFtZV1bJ3RleHQtYW5jaG9yJ10gPT09ICdyaWdodCcpIGNvb3IgPSB0aGlzLnJpZ2h0KHIsYyk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoIGcuZHJhd2luZ19zZXR0aW5ncy5mb250c1tmb250X25hbWVdWyd0ZXh0LWFuY2hvciddID09PSAnbGVmdCcpIGNvb3IgPSB0aGlzLmxlZnQocixjKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBjb29yID0gdGhpcy5jZW50ZXIocixjKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdpbmcudGV4dChcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNlbGwocixjKS5jZWxsX3RleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250X25hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAndGV4dCdcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxufTtcblxuZHJhd2luZy50YWJsZSA9IGZ1bmN0aW9uKCBudW1fcm93cywgbnVtX2NvbHMgKXtcbiAgICB2YXIgbmV3X3RhYmxlID0gT2JqZWN0LmNyZWF0ZShUYWJsZSk7XG4gICAgbmV3X3RhYmxlLmluaXQoIHRoaXMsIG51bV9yb3dzLCBudW1fY29scyApO1xuXG4gICAgcmV0dXJuIG5ld190YWJsZTtcblxufTtcblxuXG5kcmF3aW5nLmFwcGVuZCA9ICBmdW5jdGlvbihkcmF3aW5nX3BhcnRzKXtcbiAgICB0aGlzLmRyYXdpbmdfcGFydHMgPSB0aGlzLmRyYXdpbmdfcGFydHMuY29uY2F0KGRyYXdpbmdfcGFydHMpO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuXG5cbnZhciBta19kcmF3aW5nID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgcGFnZSA9IE9iamVjdC5jcmVhdGUoZHJhd2luZyk7XG4gICAgLy9jb25zb2xlLmxvZyhwYWdlKTtcbiAgICBwYWdlLmRyYXdpbmdfcGFydHMgPSBbXTtcbiAgICByZXR1cm4gcGFnZTtcbn07XG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IG1rX2RyYXdpbmc7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xudmFyIG1rX2JvcmRlciA9IHJlcXVpcmUoJy4vbWtfYm9yZGVyJyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHBhZ2UgMVwiKTtcblxuICAgIHZhciBkID0gbWtfZHJhd2luZygpO1xuXG4gICAgdmFyIHNoZWV0X3NlY3Rpb24gPSAnQSc7XG4gICAgdmFyIHNoZWV0X251bSA9ICcwMCc7XG4gICAgZC5hcHBlbmQobWtfYm9yZGVyKHNldHRpbmdzLCBzaGVldF9zZWN0aW9uLCBzaGVldF9udW0gKSk7XG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG5cbiAgICB2YXIgeCwgeSwgaCwgdztcblxuICAgIGQudGV4dChcbiAgICAgICAgW3NpemUuZHJhd2luZy53KjEvMiwgc2l6ZS5kcmF3aW5nLmgqMS8zXSxcbiAgICAgICAgW1xuICAgICAgICAgICAgJ0ZTRUMgUGxhbnMgTWFjaGluZScsXG4gICAgICAgICAgICAnREVNTydcbiAgICAgICAgXSxcbiAgICAgICAgJ3Byb2plY3QgdGl0bGUnXG4gICAgKTtcblxuICAgIHZhciBuX3Jvd3MgPSA0O1xuICAgIHZhciBuX2NvbHMgPSAyO1xuICAgIHcgPSA0MDArODA7XG4gICAgaCA9IG5fcm93cyoyMDtcbiAgICB4ID0gc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmcqNjtcbiAgICB5ID0gc2l6ZS5kcmF3aW5nLmggLSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyo2IC0gNCoyMDtcblxuICAgIGQudGV4dCggW3grdy8yLCB5LTIwXSwgJ0NvbnRlbnRzJywndGFibGVfbGFyZ2UnICk7XG5cbiAgICB2YXIgdCA9IGQudGFibGUobl9yb3dzLG5fY29scykubG9jKHgseSk7XG4gICAgdC5yb3dfc2l6ZSgnYWxsJywgMjApLmNvbF9zaXplKDIsIDQwMCkuY29sX3NpemUoMSwgODApO1xuICAgIHQuY2VsbCgxLDEpLnRleHQoJ1BWLTAxJyk7XG4gICAgdC5jZWxsKDEsMikudGV4dCgnUFYgc3lzdGVtIHdpcmluZyBkaWFncmFtJyk7XG4gICAgdC5jZWxsKDIsMSkudGV4dCgnUFYtMDInKTtcbiAgICB0LmNlbGwoMiwyKS50ZXh0KCdQViBzeXN0ZW0gc3BlY2lmaWNhdGlvbnMnKTtcbiAgICB0LmNlbGwoMywxKS50ZXh0KCdTLTAxJyk7XG4gICAgdC5jZWxsKDMsMikudGV4dCgnUm9vZiBkZXRhaWxzJyk7XG5cbiAgICB0LmFsbF9jZWxscygpLmZvckVhY2goZnVuY3Rpb24oY2VsbCl7XG4gICAgICAgIGNlbGwuZm9udCgndGFibGVfbGFyZ2VfbGVmdCcpLmJvcmRlcignYWxsJyk7XG4gICAgfSk7XG5cbiAgICB0Lm1rKCk7XG5cbiAgICAvKlxuICAgIGNvbnNvbGUubG9nKHRhYmxlX3BhcnRzKTtcbiAgICBkLmFwcGVuZCh0YWJsZV9wYXJ0cyk7XG4gICAgZC50ZXh0KFtzaXplLmRyYXdpbmcudy8zLHNpemUuZHJhd2luZy5oLzNdLCAnWCcsICd0YWJsZScpO1xuICAgIGQucmVjdChbc2l6ZS5kcmF3aW5nLncvMy01LHNpemUuZHJhd2luZy5oLzMtNV0sWzEwLDEwXSwnYm94Jyk7XG5cbiAgICB0LmNlbGwoMiwyKS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgMiwyJyk7XG4gICAgdC5jZWxsKDMsMykuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDMsMycpO1xuICAgIHQuY2VsbCg0LDQpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCA0LDQnKTtcbiAgICB0LmNlbGwoNSw1KS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgNSw1Jyk7XG5cblxuXG4gICAgdC5jZWxsKDQsNikuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDQsNicpO1xuICAgIHQuY2VsbCg0LDcpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCA0LDcnKTtcbiAgICB0LmNlbGwoNSw2KS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgNSw2Jyk7XG4gICAgdC5jZWxsKDUsNykuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDUsNycpO1xuXG5cbiAgICAvLyovXG5cbiAgICByZXR1cm4gZC5kcmF3aW5nX3BhcnRzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcGFnZTtcbiIsInZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG52YXIgbWtfYm9yZGVyID0gcmVxdWlyZSgnLi9ta19ib3JkZXInKTtcblxuLy92YXIgZHJhd2luZ19wYXJ0cyA9IFtdO1xuLy9kLmxpbmtfZHJhd2luZ19wYXJ0cyhkcmF3aW5nX3BhcnRzKTtcblxudmFyIHBhZ2UgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgY29uc29sZS5sb2coXCIqKiBNYWtpbmcgcGFnZSAyXCIpO1xuICAgIGQgPSBta19kcmF3aW5nKCk7XG4gICAgdmFyIHNoZWV0X3NlY3Rpb24gPSAnUFYnO1xuICAgIHZhciBzaGVldF9udW0gPSAnMDEnO1xuICAgIGQuYXBwZW5kKG1rX2JvcmRlcihzZXR0aW5ncywgc2hlZXRfc2VjdGlvbiwgc2hlZXRfbnVtICkpO1xuXG4gICAgdmFyIGYgPSBzZXR0aW5ncy5mO1xuXG4gICAgLy92YXIgY29tcG9uZW50cyA9IHNldHRpbmdzLmNvbXBvbmVudHM7XG4gICAgLy92YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG5cblxuXG5cbiAgICB2YXIgeCwgeSwgaCwgdztcbiAgICB2YXIgb2Zmc2V0O1xuXG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8jYXJyYXlcbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ21vZHVsZScpICYmIGYuc2VjdGlvbl9kZWZpbmVkKCdhcnJheScpICl7XG4gICAgICAgIGQuc2VjdGlvbignYXJyYXknKTtcblxuXG4gICAgICAgIHggPSBsb2MuYXJyYXkucmlnaHQgLSBzaXplLnN0cmluZy53O1xuICAgICAgICB5ID0gbG9jLmFycmF5LnVwcGVyO1xuICAgICAgICAvL3kgLT0gc2l6ZS5zdHJpbmcuaC8yO1xuXG5cbiAgICAgICAgLy9mb3IoIHZhciBpPTA7IGk8c3lzdGVtLkRDLnN0cmluZ19udW07IGkrKyApIHtcbiAgICAgICAgZm9yKCB2YXIgaSBpbiBfLnJhbmdlKHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncykpIHtcbiAgICAgICAgICAgIC8vdmFyIG9mZnNldCA9IGkgKiBzaXplLndpcmVfb2Zmc2V0LmJhc2VcbiAgICAgICAgICAgIHZhciBvZmZzZXRfd2lyZSA9IHNpemUud2lyZV9vZmZzZXQubWluICsgKCBzaXplLndpcmVfb2Zmc2V0LmJhc2UgKiBpICk7XG5cbiAgICAgICAgICAgIGQuYmxvY2soJ3N0cmluZycsIFt4LHldKTtcbiAgICAgICAgICAgIC8vIHBvc2l0aXZlIGhvbWUgcnVuXG4gICAgICAgICAgICBkLmxheWVyKCdEQ19wb3MnKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4ICwgbG9jLmFycmF5LnVwcGVyIF0sXG4gICAgICAgICAgICAgICAgWyB4ICwgbG9jLmFycmF5LnVwcGVyLW9mZnNldF93aXJlIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrb2Zmc2V0X3dpcmUgLCBsb2MuYXJyYXkudXBwZXItb2Zmc2V0X3dpcmUgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtvZmZzZXRfd2lyZSAsIGxvYy5qYl9ib3gueS1vZmZzZXRfd2lyZV0sXG4gICAgICAgICAgICAgICAgWyBsb2MuamJfYm94LnggLCBsb2MuamJfYm94Lnktb2Zmc2V0X3dpcmVdLFxuICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIC8vIG5lZ2F0aXZlIGhvbWUgcnVuXG4gICAgICAgICAgICBkLmxheWVyKCdEQ19uZWcnKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4ICwgbG9jLmFycmF5Lmxvd2VyIF0sXG4gICAgICAgICAgICAgICAgWyB4ICwgbG9jLmFycmF5Lmxvd2VyX2xpbWl0K29mZnNldF93aXJlIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrb2Zmc2V0X3dpcmUgLCBsb2MuYXJyYXkubG93ZXJfbGltaXQrb2Zmc2V0X3dpcmUgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtvZmZzZXRfd2lyZSAsIGxvYy5qYl9ib3gueStvZmZzZXRfd2lyZV0sXG4gICAgICAgICAgICAgICAgWyBsb2MuamJfYm94LnggLCBsb2MuamJfYm94Lnkrb2Zmc2V0X3dpcmVdLFxuICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIHggLT0gc2l6ZS5zdHJpbmcudztcbiAgICAgICAgfVxuXG4gICAgLy8gICAgZC5yZWN0KFxuICAgIC8vICAgICAgICBbIChsb2MuYXJyYXkucmlnaHQrbG9jLmFycmF5LmxlZnQpLzIsIChsb2MuYXJyYXkubG93ZXIrbG9jLmFycmF5LnVwcGVyKS8yIF0sXG4gICAgLy8gICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0LWxvYy5hcnJheS5sZWZ0LCBsb2MuYXJyYXkubG93ZXItbG9jLmFycmF5LnVwcGVyIF0sXG4gICAgLy8gICAgICAgICdEQ19wb3MnKTtcbiAgICAvL1xuXG4gICAgICAgIGQubGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgLy9bIGxvYy5hcnJheS5sZWZ0ICwgbG9jLmFycmF5Lmxvd2VyICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgICAgIFsgbG9jLmFycmF5LmxlZnQsIGxvYy5hcnJheS5sb3dlcl9saW1pdCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCAsIGxvYy5hcnJheS5sb3dlcl9saW1pdCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCAsIGxvYy5qYl9ib3gueSArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAgICAgICAgIFsgbG9jLmpiX2JveC54ICwgbG9jLmpiX2JveC55K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAgICAgXSk7XG5cbiAgICAgICAgZC5sYXllcigpO1xuXG5cbiAgICB9Ly8gZWxzZSB7IGNvbnNvbGUubG9nKFwiRHJhd2luZzogYXJyYXkgbm90IHJlYWR5XCIpfVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBjb21iaW5lciBib3hcblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnREMnKSApe1xuXG4gICAgICAgIGQuc2VjdGlvbihcImNvbWJpbmVyXCIpO1xuXG4gICAgICAgIHggPSBsb2MuamJfYm94Lng7XG4gICAgICAgIHkgPSBsb2MuamJfYm94Lnk7XG5cbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW3gseV0sXG4gICAgICAgICAgICBbc2l6ZS5qYl9ib3gudyxzaXplLmpiX2JveC5oXSxcbiAgICAgICAgICAgICdib3gnXG4gICAgICAgICk7XG5cblxuICAgICAgICBmb3IoIGkgaW4gXy5yYW5nZShzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MpKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0Lm1pbiArICggc2l6ZS53aXJlX29mZnNldC5iYXNlICogaSApO1xuXG4gICAgICAgICAgICBkLmxheWVyKCdEQ19wb3MnKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4ICwgeS1vZmZzZXRdLFxuICAgICAgICAgICAgICAgIFsgeCAsIHktb2Zmc2V0XSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICAgICAgeTogeS1vZmZzZXQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4ICwgeS1vZmZzZXRdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueC1vZmZzZXQgLCB5LW9mZnNldF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54LW9mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW1dLFxuICAgICAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueC1vZmZzZXQgLCBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgICAgIHg6IGxvYy5kaXNjYm94Lngtb2Zmc2V0LFxuICAgICAgICAgICAgICAgIHk6IGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkLmxheWVyKCdEQ19uZWcnKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4LCB5K29mZnNldF0sXG4gICAgICAgICAgICAgICAgWyB4LXNpemUuZnVzZS53LzIgLCB5K29mZnNldF0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIGQuYmxvY2soICdmdXNlJywge1xuICAgICAgICAgICAgICAgIHg6IHggLFxuICAgICAgICAgICAgICAgIHk6IHkrb2Zmc2V0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCtzaXplLmZ1c2Uudy8yICwgeStvZmZzZXRdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueCtvZmZzZXQgLCB5K29mZnNldF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW1dLFxuICAgICAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueCtvZmZzZXQgLCBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgICAgIHg6IGxvYy5kaXNjYm94Lngrb2Zmc2V0LFxuICAgICAgICAgICAgICAgIHk6IGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZC5sYXllcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9kLmxheWVyKCdEQ19ncm91bmQnKTtcbiAgICAgICAgLy9kLmxpbmUoW1xuICAgICAgICAvLyAgICBbIGxvYy5hcnJheS5sZWZ0ICwgbG9jLmFycmF5Lmxvd2VyICsgc2l6ZS5tb2R1bGUudyArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgICAgIC8vICAgIFsgbG9jLmFycmF5LnJpZ2h0K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kICwgbG9jLmFycmF5Lmxvd2VyICsgc2l6ZS5tb2R1bGUudyArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgICAgIC8vICAgIFsgbG9jLmFycmF5LnJpZ2h0K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kICwgbG9jLmFycmF5LnkgKyBzaXplLm1vZHVsZS53ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmRdLFxuICAgICAgICAvLyAgICBbIGxvYy5hcnJheS54ICwgbG9jLmFycmF5Lnkrc2l6ZS5tb2R1bGUudytzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZF0sXG4gICAgICAgIC8vXSk7XG5cbiAgICAgICAgLy9kLmxheWVyKCk7XG5cbiAgICAgICAgLy8gR3JvdW5kXG4gICAgICAgIC8vb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5nYXAgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZDtcbiAgICAgICAgb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5ncm91bmQ7XG5cbiAgICAgICAgZC5sYXllcignRENfZ3JvdW5kJyk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbIHggLCB5K29mZnNldF0sXG4gICAgICAgICAgICBbIHggLCB5K29mZnNldF0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeStvZmZzZXQsXG4gICAgICAgIH0pO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgWyB4ICwgeStvZmZzZXRdLFxuICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueCtvZmZzZXQgLCBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtXSxcbiAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueCtvZmZzZXQgLCBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgIHg6IGxvYy5kaXNjYm94Lngrb2Zmc2V0LFxuICAgICAgICAgICAgeTogbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbVxuICAgICAgICB9KTtcbiAgICAgICAgZC5sYXllcigpO1xuXG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgIC8vIERDIGRpc2NvbmVjdFxuICAgICAgICBkLnNlY3Rpb24oXCJEQyBkaWNvbmVjdFwiKTtcblxuXG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFtsb2MuZGlzY2JveC54LCBsb2MuZGlzY2JveC55XSxcbiAgICAgICAgICAgIFtzaXplLmRpc2Nib3gudyxzaXplLmRpc2Nib3guaF0sXG4gICAgICAgICAgICAnYm94J1xuICAgICAgICApO1xuXG4gICAgICAgIC8vIERDIGRpc2NvbmVjdCBjb21iaW5lciBkLmxpbmVzXG5cbiAgICAgICAgeCA9IGxvYy5kaXNjYm94Lng7XG4gICAgICAgIHkgPSBsb2MuZGlzY2JveC55ICsgc2l6ZS5kaXNjYm94LmgvMjtcblxuICAgICAgICBpZiggc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzID4gMSl7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0X21pbiA9IHNpemUud2lyZV9vZmZzZXQubWluO1xuICAgICAgICAgICAgdmFyIG9mZnNldF9tYXggPSBzaXplLndpcmVfb2Zmc2V0Lm1pbiArICggKHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyAtMSkgKiBzaXplLndpcmVfb2Zmc2V0LmJhc2UgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4LW9mZnNldF9taW4sIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgICAgICBbIHgtb2Zmc2V0X21heCwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgXSwgJ0RDX3BvcycpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHgrb2Zmc2V0X21pbiwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgICAgIFsgeCtvZmZzZXRfbWF4LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBdLCAnRENfbmVnJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbnZlcnRlciBjb25lY3Rpb25cbiAgICAgICAgLy9kLmxpbmUoW1xuICAgICAgICAvLyAgICBbIHgtb2Zmc2V0X21pbiwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAvLyAgICBbIHgtb2Zmc2V0X21pbiwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAvL10sJ0RDX3BvcycpO1xuXG4gICAgICAgIC8vb2Zmc2V0ID0gb2Zmc2V0X21heCAtIG9mZnNldF9taW47XG4gICAgICAgIG9mZnNldCA9IHNpemUud2lyZV9vZmZzZXQubWluO1xuXG4gICAgICAgIC8vIG5lZ1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgWyB4K29mZnNldCwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgWyB4K29mZnNldCwgbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtIF0sXG4gICAgICAgIF0sJ0RDX25lZycpO1xuICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICB4OiB4K29mZnNldCxcbiAgICAgICAgICAgIHk6IGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcG9zXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbIHgtb2Zmc2V0LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBbIHgtb2Zmc2V0LCBsb2MuaW52ZXJ0ZXIueStzaXplLmludmVydGVyLmgvMi1zaXplLnRlcm1pbmFsX2RpYW0gXSxcbiAgICAgICAgXSwnRENfcG9zJyk7XG4gICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgIHg6IHgtb2Zmc2V0LFxuICAgICAgICAgICAgeTogbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBncm91bmRcbiAgICAgICAgLy9vZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0LmdhcCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kO1xuICAgICAgICBvZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZDtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFsgeCtvZmZzZXQsIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIFsgeCtvZmZzZXQsIGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSBdLFxuICAgICAgICBdLCdEQ19ncm91bmQnKTtcbiAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgeDogeCtvZmZzZXQsXG4gICAgICAgICAgICB5OiBsb2MuaW52ZXJ0ZXIueStzaXplLmludmVydGVyLmgvMi1zaXplLnRlcm1pbmFsX2RpYW0sXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyNpbnZlcnRlclxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnaW52ZXJ0ZXInKSApe1xuXG4gICAgICAgIGQuc2VjdGlvbihcImludmVydGVyXCIpO1xuXG5cbiAgICAgICAgeCA9IGxvYy5pbnZlcnRlci54O1xuICAgICAgICB5ID0gbG9jLmludmVydGVyLnk7XG5cblxuICAgICAgICAvL2ZyYW1lXG4gICAgICAgIGQubGF5ZXIoJ2JveCcpO1xuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbeCx5XSxcbiAgICAgICAgICAgIFtzaXplLmludmVydGVyLncsIHNpemUuaW52ZXJ0ZXIuaF1cbiAgICAgICAgKTtcbiAgICAgICAgLy8gTGFiZWwgYXQgdG9wIChJbnZlcnRlciwgbWFrZSwgbW9kZWwsIC4uLilcbiAgICAgICAgZC5sYXllcigndGV4dCcpO1xuICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICBbbG9jLmludmVydGVyLngsIGxvYy5pbnZlcnRlci50b3AgKyBzaXplLmludmVydGVyLnRleHRfZ2FwIF0sXG4gICAgICAgICAgICBbICdJbnZlcnRlcicsIHNldHRpbmdzLnN5c3RlbS5pbnZlcnRlci5tYWtlICsgXCIgXCIgKyBzZXR0aW5ncy5zeXN0ZW0uaW52ZXJ0ZXIubW9kZWwgXSxcbiAgICAgICAgICAgICdsYWJlbCdcbiAgICAgICAgKTtcbiAgICAgICAgZC5sYXllcigpO1xuXG4gICAgLy8jaW52ZXJ0ZXIgc3ltYm9sXG4gICAgICAgIGQuc2VjdGlvbihcImludmVydGVyIHN5bWJvbFwiKTtcblxuICAgICAgICB4ID0gbG9jLmludmVydGVyLng7XG4gICAgICAgIHkgPSBsb2MuaW52ZXJ0ZXIueTtcblxuICAgICAgICB3ID0gc2l6ZS5pbnZlcnRlci5zeW1ib2xfdztcbiAgICAgICAgaCA9IHNpemUuaW52ZXJ0ZXIuc3ltYm9sX2g7XG5cbiAgICAgICAgdmFyIHNwYWNlID0gdyoxLzEyO1xuXG4gICAgICAgIC8vIEludmVydGVyIHN5bWJvbFxuICAgICAgICBkLmxheWVyKCdib3gnKTtcblxuICAgICAgICAvLyBib3hcbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW3gseV0sXG4gICAgICAgICAgICBbdywgaF1cbiAgICAgICAgKTtcbiAgICAgICAgLy8gZGlhZ2FuYWxcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4LXcvMiwgeStoLzJdLFxuICAgICAgICAgICAgW3grdy8yLCB5LWgvMl0sXG5cbiAgICAgICAgXSk7XG4gICAgICAgIC8vIERDXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlLFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZV0sXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlKjYsXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlXSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlLFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqMixcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSozLFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNCxcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSo1LFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNixcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIF0pO1xuXG4gICAgICAgIC8vIEFDXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlLFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSoyLFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqMyxcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqNCxcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjUsXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjYsXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxheWVyKCk7XG5cblxuXG5cblxuICAgIH1cblxuXG5cblxuXG4vLyNBQ19kaXNjY29uZWN0XG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdBQycpICl7XG4gICAgICAgIGQuc2VjdGlvbihcIkFDX2Rpc2Njb25lY3RcIik7XG5cbiAgICAgICAgeCA9IGxvYy5BQ19kaXNjLng7XG4gICAgICAgIHkgPSBsb2MuQUNfZGlzYy55O1xuICAgICAgICBwYWRkaW5nID0gc2l6ZS50ZXJtaW5hbF9kaWFtO1xuXG4gICAgICAgIGQubGF5ZXIoJ2JveCcpO1xuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbeCwgeV0sXG4gICAgICAgICAgICBbc2l6ZS5BQ19kaXNjLncsIHNpemUuQUNfZGlzYy5oXVxuICAgICAgICApO1xuICAgICAgICBkLmxheWVyKCk7XG5cblxuICAgIC8vZC5jaXJjKFt4LHldLDUpO1xuXG5cblxuICAgIC8vI0FDIGxvYWQgY2VudGVyXG4gICAgICAgIGQuc2VjdGlvbihcIkFDIGxvYWQgY2VudGVyXCIpO1xuXG4gICAgICAgIHZhciBicmVha2VyX3NwYWNpbmcgPSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMuc3BhY2luZztcblxuICAgICAgICB4ID0gbG9jLkFDX2xvYWRjZW50ZXIueDtcbiAgICAgICAgeSA9IGxvYy5BQ19sb2FkY2VudGVyLnk7XG4gICAgICAgIHcgPSBzaXplLkFDX2xvYWRjZW50ZXIudztcbiAgICAgICAgaCA9IHNpemUuQUNfbG9hZGNlbnRlci5oO1xuXG4gICAgICAgIGQucmVjdChbeCx5XSxcbiAgICAgICAgICAgIFt3LGhdLFxuICAgICAgICAgICAgJ2JveCdcbiAgICAgICAgKTtcblxuICAgICAgICBkLnRleHQoW3gseS1oKjAuNF0sXG4gICAgICAgICAgICBbc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXMsICdMb2FkIENlbnRlciddLFxuICAgICAgICAgICAgJ2xhYmVsJyxcbiAgICAgICAgICAgICd0ZXh0J1xuICAgICAgICApO1xuICAgICAgICB3ID0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIudztcbiAgICAgICAgaCA9IHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyLmg7XG5cbiAgICAgICAgcGFkZGluZyA9IGxvYy5BQ19sb2FkY2VudGVyLnggLSBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy5sZWZ0IC0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIudztcblxuICAgICAgICB5ID0gbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMudG9wO1xuICAgICAgICB5ICs9IHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5zcGFjaW5nLzI7XG4gICAgICAgIGZvciggdmFyIGk9MDsgaTxzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMubnVtOyBpKyspe1xuICAgICAgICAgICAgZC5yZWN0KFt4LXBhZGRpbmctdy8yLHldLFt3LGhdLCdib3gnKTtcbiAgICAgICAgICAgIGQucmVjdChbeCtwYWRkaW5nK3cvMix5XSxbdyxoXSwnYm94Jyk7XG4gICAgICAgICAgICB5ICs9IGJyZWFrZXJfc3BhY2luZztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzLCBsO1xuXG4gICAgICAgIGwgPSBsb2MuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyO1xuICAgICAgICBzID0gc2l6ZS5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXI7XG4gICAgICAgIGQucmVjdChbbC54LGwueV0sIFtzLncscy5oXSwgJ0FDX25ldXRyYWwnICk7XG5cbiAgICAgICAgbCA9IGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhcjtcbiAgICAgICAgcyA9IHNpemUuQUNfbG9hZGNlbnRlci5ncm91bmRiYXI7XG4gICAgICAgIGQucmVjdChbbC54LGwueV0sIFtzLncscy5oXSwgJ0FDX2dyb3VuZCcgKTtcblxuICAgICAgICBkLmJsb2NrKCdncm91bmQnLCBbbC54LGwueStzLmgvMl0pO1xuXG5cblxuICAgIC8vIEFDIGQubGluZXNcbiAgICAgICAgZC5zZWN0aW9uKFwiQUMgZC5saW5lc1wiKTtcblxuICAgICAgICB4ID0gbG9jLmludmVydGVyLmJvdHRvbV9yaWdodC54O1xuICAgICAgICB5ID0gbG9jLmludmVydGVyLmJvdHRvbV9yaWdodC55O1xuICAgICAgICB4IC09IHNpemUudGVybWluYWxfZGlhbSAqIChzeXN0ZW0uQUMubnVtX2NvbmR1Y3RvcnMrMSk7XG4gICAgICAgIHkgLT0gc2l6ZS50ZXJtaW5hbF9kaWFtO1xuXG4gICAgICAgIHZhciBjb25kdWl0X3kgPSBsb2MuQUNfY29uZHVpdC55O1xuICAgICAgICBwYWRkaW5nID0gc2l6ZS50ZXJtaW5hbF9kaWFtO1xuICAgICAgICAvL3ZhciBBQ19kLmxheWVyX25hbWVzID0gWydBQ19ncm91bmQnLCAnQUNfbmV1dHJhbCcsICdBQ19MMScsICdBQ19MMicsICdBQ19MMiddO1xuXG4gICAgICAgIGZvciggdmFyIGk9MDsgaSA8IHN5c3RlbS5BQy5udW1fY29uZHVjdG9yczsgaSsrICl7XG4gICAgICAgICAgICBkLmJsb2NrKCd0ZXJtaW5hbCcsIFt4LHldICk7XG4gICAgICAgICAgICBkLmxheWVyKCdBQ18nK3N5c3RlbS5BQy5jb25kdWN0b3JzW2ldKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgW3gsIHldLFxuICAgICAgICAgICAgICAgIFt4LCBsb2MuQUNfZGlzYy5ib3R0b20gLSBwYWRkaW5nKjIgLSBwYWRkaW5nKmkgIF0sXG4gICAgICAgICAgICAgICAgW2xvYy5BQ19kaXNjLmxlZnQsIGxvYy5BQ19kaXNjLmJvdHRvbSAtIHBhZGRpbmcqMiAtIHBhZGRpbmcqaSBdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB4ICs9IHNpemUudGVybWluYWxfZGlhbTtcbiAgICAgICAgfVxuICAgICAgICBkLmxheWVyKCk7XG5cbiAgICAgICAgeCA9IGxvYy5BQ19kaXNjLng7XG4gICAgICAgIHkgPSBsb2MuQUNfZGlzYy55ICsgc2l6ZS5BQ19kaXNjLmgvMjtcbiAgICAgICAgeSAtPSBwYWRkaW5nKjI7XG5cbiAgICAgICAgaWYoIHN5c3RlbS5BQy5jb25kdWN0b3JzLmluZGV4T2YoJ2dyb3VuZCcpKzEgKSB7XG4gICAgICAgICAgICBkLmxheWVyKCdBQ19ncm91bmQnKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4LXNpemUuQUNfZGlzYy53LzIsIHkgXSxcbiAgICAgICAgICAgICAgICBbIHgrc2l6ZS5BQ19kaXNjLncvMitwYWRkaW5nKjIsIHkgXSxcbiAgICAgICAgICAgICAgICBbIHgrc2l6ZS5BQ19kaXNjLncvMitwYWRkaW5nKjIsIGNvbmR1aXRfeSArIGJyZWFrZXJfc3BhY2luZyoyIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5sZWZ0K3BhZGRpbmcqMiwgY29uZHVpdF95ICsgYnJlYWtlcl9zcGFjaW5nKjIgXSxcbiAgICAgICAgICAgICAgICAvL1sgbG9jLkFDX2xvYWRjZW50ZXIubGVmdCtwYWRkaW5nKjIsIHkgXSxcbiAgICAgICAgICAgICAgICAvL1sgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLngtcGFkZGluZywgeSBdLFxuICAgICAgICAgICAgICAgIC8vWyBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueC1wYWRkaW5nLCBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueStzaXplLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLmgvMiBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIubGVmdCtwYWRkaW5nKjIsIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci55IF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueC1zaXplLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLncvMiwgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLnkgXSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIHN5c3RlbS5BQy5jb25kdWN0b3JzLmluZGV4T2YoJ25ldXRyYWwnKSsxICkge1xuICAgICAgICAgICAgeSAtPSBwYWRkaW5nO1xuICAgICAgICAgICAgZC5sYXllcignQUNfbmV1dHJhbCcpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHgtc2l6ZS5BQ19kaXNjLncvMiwgeSBdLFxuICAgICAgICAgICAgICAgIFsgeCtwYWRkaW5nKjMqMiwgeSBdLFxuICAgICAgICAgICAgICAgIFsgeCtwYWRkaW5nKjMqMiwgY29uZHVpdF95ICsgYnJlYWtlcl9zcGFjaW5nKjEgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIueCwgY29uZHVpdF95ICsgYnJlYWtlcl9zcGFjaW5nKjEgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIueCxcbiAgICAgICAgICAgICAgICAgICAgbG9jLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhci55LXNpemUuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyLmgvMiBdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH1cblxuXG5cbiAgICAgICAgZm9yKCB2YXIgaT0xOyBpIDw9IDM7IGkrKyApIHtcbiAgICAgICAgICAgIGlmKCBzeXN0ZW0uQUMuY29uZHVjdG9ycy5pbmRleE9mKCdMJytpKSsxICkge1xuICAgICAgICAgICAgICAgIHkgLT0gcGFkZGluZztcbiAgICAgICAgICAgICAgICBkLmxheWVyKCdBQ19MJytpKTtcbiAgICAgICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbIHgtc2l6ZS5BQ19kaXNjLncvMiwgeSBdLFxuICAgICAgICAgICAgICAgICAgICBbIHgrcGFkZGluZyozKigyLWkpLCB5IF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeCtwYWRkaW5nKjMqKDItaSksIGxvYy5BQ19kaXNjLnN3aXRjaF9ib3R0b20gXSxcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICBkLmJsb2NrKCd0ZXJtaW5hbCcsIFsgeC1wYWRkaW5nKihpLTIpKjMsIGxvYy5BQ19kaXNjLnN3aXRjaF9ib3R0b20gXSApO1xuICAgICAgICAgICAgICAgIGQuYmxvY2soJ3Rlcm1pbmFsJywgWyB4LXBhZGRpbmcqKGktMikqMywgbG9jLkFDX2Rpc2Muc3dpdGNoX3RvcCBdICk7XG4gICAgICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgWyB4LXBhZGRpbmcqKGktMikqMywgbG9jLkFDX2Rpc2Muc3dpdGNoX3RvcCBdLFxuICAgICAgICAgICAgICAgICAgICBbIHgtcGFkZGluZyooaS0yKSozLCBjb25kdWl0X3ktYnJlYWtlcl9zcGFjaW5nKihpLTEpIF0sXG4gICAgICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMubGVmdCwgY29uZHVpdF95LWJyZWFrZXJfc3BhY2luZyooaS0xKSBdLFxuICAgICAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuXG5cblxuLy8gV2lyZSB0YWJsZVxuICAgIGQuc2VjdGlvbihcIldpcmUgdGFibGVcIik7XG5cbi8vLypcblxuICAgIHggPSBsb2Mud2lyZV90YWJsZS54O1xuICAgIHkgPSBsb2Mud2lyZV90YWJsZS55O1xuXG4gICAgaWYoIHN5c3RlbS5BQy5udW1fY29uZHVjdG9ycyApIHtcbiAgICAgICAgdmFyIG5fcm93cyA9IDIgKyBzeXN0ZW0uQUMubnVtX2NvbmR1Y3RvcnM7XG4gICAgICAgIHZhciBuX2NvbHMgPSA2O1xuICAgICAgICB2YXIgcm93X2hlaWdodCA9IDE1O1xuICAgICAgICB2YXIgY29sdW1uX3dpZHRoID0ge1xuICAgICAgICAgICAgbnVtYmVyOiAyNSxcbiAgICAgICAgICAgIGNvbmR1Y3RvcjogNTAsXG4gICAgICAgICAgICB3aXJlX2dhdWdlOiAyNSxcbiAgICAgICAgICAgIHdpcmVfdHlwZTogNzUsXG4gICAgICAgICAgICBjb25kdWl0X3NpemU6IDM1LFxuICAgICAgICAgICAgY29uZHVpdF90eXBlOiA3NSxcbiAgICAgICAgfTtcblxuICAgICAgICBoID0gbl9yb3dzKnJvd19oZWlnaHQ7XG5cbiAgICAgICAgdmFyIHQgPSBkLnRhYmxlKG5fcm93cyxuX2NvbHMpLmxvYyh4LHkpO1xuICAgICAgICB0LnJvd19zaXplKCdhbGwnLCByb3dfaGVpZ2h0KVxuICAgICAgICAgICAgLmNvbF9zaXplKDEsIGNvbHVtbl93aWR0aC5udW1iZXIpXG4gICAgICAgICAgICAuY29sX3NpemUoMiwgY29sdW1uX3dpZHRoLmNvbmR1Y3RvcilcbiAgICAgICAgICAgIC5jb2xfc2l6ZSgzLCBjb2x1bW5fd2lkdGgud2lyZV9nYXVnZSlcbiAgICAgICAgICAgIC5jb2xfc2l6ZSg0LCBjb2x1bW5fd2lkdGgud2lyZV90eXBlKVxuICAgICAgICAgICAgLmNvbF9zaXplKDUsIGNvbHVtbl93aWR0aC5jb25kdWl0X3NpemUpXG4gICAgICAgICAgICAuY29sX3NpemUoNiwgY29sdW1uX3dpZHRoLmNvbmR1aXRfdHlwZSk7XG5cbiAgICAgICAgdC5hbGxfY2VsbHMoKS5mb3JFYWNoKGZ1bmN0aW9uKGNlbGwpe1xuICAgICAgICAgICAgY2VsbC5mb250KCd0YWJsZScpLmJvcmRlcignYWxsJyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0LmNlbGwoMSwxKS5ib3JkZXIoJ0InLCBmYWxzZSk7XG4gICAgICAgIHQuY2VsbCgxLDMpLmJvcmRlcignUicsIGZhbHNlKTtcbiAgICAgICAgdC5jZWxsKDEsNSkuYm9yZGVyKCdSJywgZmFsc2UpO1xuXG4gICAgICAgIHQuY2VsbCgxLDMpLmZvbnQoJ3RhYmxlX2xlZnQnKS50ZXh0KCdXaXJlJyk7XG4gICAgICAgIHQuY2VsbCgxLDUpLmZvbnQoJ3RhYmxlX2xlZnQnKS50ZXh0KCdDb25kdWl0Jyk7XG5cbiAgICAgICAgdC5jZWxsKDIsMykuZm9udCgndGFibGUnKS50ZXh0KCdDb25kdWN0b3JzJyk7XG4gICAgICAgIHQuY2VsbCgyLDMpLmZvbnQoJ3RhYmxlJykudGV4dCgnQVdHJyk7XG4gICAgICAgIHQuY2VsbCgyLDQpLmZvbnQoJ3RhYmxlJykudGV4dCgnVHlwZScpO1xuICAgICAgICB0LmNlbGwoMiw1KS5mb250KCd0YWJsZScpLnRleHQoJ1NpemUnKTtcbiAgICAgICAgdC5jZWxsKDIsNikuZm9udCgndGFibGUnKS50ZXh0KCdUeXBlJyk7XG5cbiAgICAgICAgZm9yKCBpPTE7IGk8PXN5c3RlbS5BQy5udW1fY29uZHVjdG9yczsgaSsrKXtcbiAgICAgICAgICAgIHQuY2VsbCgyK2ksMSkuZm9udCgndGFibGUnKS50ZXh0KGkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB0LmNlbGwoMitpLDIpLmZvbnQoJ3RhYmxlX2xlZnQnKS50ZXh0KCBmLnByZXR0eV93b3JkKHNldHRpbmdzLnN5c3RlbS5BQy5jb25kdWN0b3JzW2ktMV0pICk7XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy9kLnRleHQoIFt4K3cvMiwgeS1yb3dfaGVpZ2h0XSwgZi5wcmV0dHlfbmFtZShzZWN0aW9uX25hbWUpLCd0YWJsZScgKTtcblxuXG4gICAgICAgIHQubWsoKTtcblxuICAgIH1cblxuLy8qL1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuLy8gdm9sdGFnZSBkcm9wXG4gICAgZC5zZWN0aW9uKFwidm9sdGFnZSBkcm9wXCIpO1xuXG5cbiAgICB4ID0gbG9jLnZvbHRfZHJvcF90YWJsZS54O1xuICAgIHkgPSBsb2Mudm9sdF9kcm9wX3RhYmxlLnk7XG4gICAgdyA9IHNpemUudm9sdF9kcm9wX3RhYmxlLnc7XG4gICAgaCA9IHNpemUudm9sdF9kcm9wX3RhYmxlLmg7XG5cbiAgICBkLmxheWVyKCd0YWJsZScpO1xuICAgIGQucmVjdCggW3gseV0sIFt3LGhdICk7XG5cbiAgICB5IC09IGgvMjtcbiAgICB5ICs9IDEwO1xuXG4gICAgZC50ZXh0KCBbeCx5XSwgJ1ZvbHRhZ2UgRHJvcCcsICd0YWJsZScsICd0ZXh0Jyk7XG5cblxuLy8gZ2VuZXJhbCBub3Rlc1xuICAgIGQuc2VjdGlvbihcImdlbmVyYWwgbm90ZXNcIik7XG5cbiAgICB4ID0gbG9jLmdlbmVyYWxfbm90ZXMueDtcbiAgICB5ID0gbG9jLmdlbmVyYWxfbm90ZXMueTtcbiAgICB3ID0gc2l6ZS5nZW5lcmFsX25vdGVzLnc7XG4gICAgaCA9IHNpemUuZ2VuZXJhbF9ub3Rlcy5oO1xuXG4gICAgZC5sYXllcigndGFibGUnKTtcbiAgICBkLnJlY3QoIFt4LHldLCBbdyxoXSApO1xuXG4gICAgeSAtPSBoLzI7XG4gICAgeSArPSAxMDtcblxuICAgIGQudGV4dCggW3gseV0sICdHZW5lcmFsIE5vdGVzJywgJ3RhYmxlJywgJ3RleHQnKTtcblxuXG4gICAgZC5zZWN0aW9uKCk7XG5cbiAgICByZXR1cm4gZC5kcmF3aW5nX3BhcnRzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcGFnZTtcbiIsInZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG52YXIgbWtfYm9yZGVyID0gcmVxdWlyZSgnLi9ta19ib3JkZXInKTtcblxudmFyIHBhZ2UgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgY29uc29sZS5sb2coXCIqKiBNYWtpbmcgcGFnZSAzXCIpO1xuICAgIHZhciBmID0gc2V0dGluZ3MuZjtcblxuICAgIGQgPSBta19kcmF3aW5nKCk7XG5cbiAgICB2YXIgc2hlZXRfc2VjdGlvbiA9ICdQVic7XG4gICAgdmFyIHNoZWV0X251bSA9ICcwMic7XG4gICAgZC5hcHBlbmQobWtfYm9yZGVyKHNldHRpbmdzLCBzaGVldF9zZWN0aW9uLCBzaGVldF9udW0gKSk7XG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG5cblxuICAgIGQudGV4dChcbiAgICAgICAgW3NpemUuZHJhd2luZy53LzIsIHNpemUuZHJhd2luZy5oLzJdLFxuICAgICAgICAnQ2FsY3VsYXRpb24gU2hlZXQnLFxuICAgICAgICAndGl0bGUyJ1xuICAgICk7XG5cblxuICAgIHggPSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyo2O1xuICAgIHkgPSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyo2ICsyMDtcblxuICAgIGQubGF5ZXIoJ3RhYmxlJyk7XG5cblxuICAgIGZvciggdmFyIHNlY3Rpb25fbmFtZSBpbiBzZXR0aW5ncy5zeXN0ZW0gKXtcbiAgICAgICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKHNlY3Rpb25fbmFtZSkgKXtcbiAgICAgICAgICAgIHZhciBzZWN0aW9uID0gc2V0dGluZ3Muc3lzdGVtW3NlY3Rpb25fbmFtZV07XG5cbiAgICAgICAgICAgIHZhciBuID0gT2JqZWN0LmtleXMoc2VjdGlvbikubGVuZ3RoO1xuXG4gICAgICAgICAgICB2YXIgbl9yb3dzID0gbiswO1xuICAgICAgICAgICAgdmFyIG5fY29scyA9IDI7XG5cbiAgICAgICAgICAgIHZhciByb3dfaGVpZ2h0ID0gMTU7XG4gICAgICAgICAgICBoID0gbl9yb3dzKnJvd19oZWlnaHQ7XG5cblxuICAgICAgICAgICAgdmFyIHQgPSBkLnRhYmxlKG5fcm93cyxuX2NvbHMpLmxvYyh4LHkpO1xuICAgICAgICAgICAgdC5yb3dfc2l6ZSgnYWxsJywgcm93X2hlaWdodCkuY29sX3NpemUoMSwgMTAwKS5jb2xfc2l6ZSgyLCAxMjUpO1xuICAgICAgICAgICAgdyA9IDEwMCs4MDtcblxuICAgICAgICAgICAgdmFyIHIgPSAxO1xuICAgICAgICAgICAgdmFyIHZhbHVlO1xuICAgICAgICAgICAgZm9yKCB2YXIgdmFsdWVfbmFtZSBpbiBzZWN0aW9uICl7XG4gICAgICAgICAgICAgICAgdC5jZWxsKHIsMSkudGV4dCggZi5wcmV0dHlfbmFtZSh2YWx1ZV9uYW1lKSApO1xuICAgICAgICAgICAgICAgIGlmKCAhIHNlY3Rpb25bdmFsdWVfbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSAnLSc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKCBzZWN0aW9uW3ZhbHVlX25hbWVdLmNvbnN0cnVjdG9yID09PSBBcnJheSApe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHNlY3Rpb25bdmFsdWVfbmFtZV0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoIHNlY3Rpb25bdmFsdWVfbmFtZV0uY29uc3RydWN0b3IgPT09IE9iamVjdCApe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9ICcoICknO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiggaXNOYU4oc2VjdGlvblt2YWx1ZV9uYW1lXSkgKXtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBzZWN0aW9uW3ZhbHVlX25hbWVdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdChzZWN0aW9uW3ZhbHVlX25hbWVdKS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0LmNlbGwociwyKS50ZXh0KCB2YWx1ZSApO1xuICAgICAgICAgICAgICAgIHIrKztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkLnRleHQoIFt4K3cvMiwgeS1yb3dfaGVpZ2h0XSwgZi5wcmV0dHlfbmFtZShzZWN0aW9uX25hbWUpLCd0YWJsZScgKTtcblxuXG5cblxuICAgICAgICAgICAgdC5hbGxfY2VsbHMoKS5mb3JFYWNoKGZ1bmN0aW9uKGNlbGwpe1xuICAgICAgICAgICAgICAgIGNlbGwuZm9udCgndGFibGUnKS5ib3JkZXIoJ2FsbCcpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHQubWsoKTtcblxuICAgICAgICAgICAgLy8qL1xuICAgICAgICAgICAgeSArPSBoICsgMzA7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnbm90IGRlZmluZWQ6ICcsIHNlY3Rpb25fbmFtZSwgc2VjdGlvbik7XG4gICAgICAgIH1cblxuXG5cblxuICAgIH1cblxuICAgIGQubGF5ZXIoKTtcblxuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xudmFyIG1rX2JvcmRlciA9IHJlcXVpcmUoJy4vbWtfYm9yZGVyJyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHBhZ2UgM1wiKTtcbiAgICB2YXIgZiA9IHNldHRpbmdzLmY7XG5cbiAgICBkID0gbWtfZHJhd2luZygpO1xuXG4gICAgdmFyIHNoZWV0X3NlY3Rpb24gPSAnUyc7XG4gICAgdmFyIHNoZWV0X251bSA9ICcwMSc7XG4gICAgZC5hcHBlbmQobWtfYm9yZGVyKHNldHRpbmdzLCBzaGVldF9zZWN0aW9uLCBzaGVldF9udW0gKSk7XG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG4gICAgdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ3Jvb2YnKSApe1xuXG5cblxuICAgICAgICB2YXIgeCwgeSwgaCwgdywgc2VjdGlvbl94LCBzZWN0aW9uX3ksIGxlbmd0aF9wLCBzY2FsZTtcblxuICAgICAgICB2YXIgc2xvcGUgPSBzeXN0ZW0ucm9vZi5zbG9wZS5zcGxpdCgnOicpWzBdO1xuICAgICAgICB2YXIgYW5nbGVfcmFkID0gTWF0aC5hdGFuKCBOdW1iZXIoc2xvcGUpIC8xMiApO1xuICAgICAgICAvL2FuZ2xlX3JhZCA9IGFuZ2xlICogKE1hdGguUEkvMTgwKTtcblxuXG4gICAgICAgIGxlbmd0aF9wID0gc3lzdGVtLnJvb2YubGVuZ3RoICogTWF0aC5jb3MoYW5nbGVfcmFkKTtcbiAgICAgICAgc3lzdGVtLnJvb2YuaGVpZ2h0ID0gc3lzdGVtLnJvb2YubGVuZ3RoICogTWF0aC5zaW4oYW5nbGVfcmFkKTtcblxuICAgICAgICB2YXIgcm9vZl9yYXRpbyA9IHN5c3RlbS5yb29mLmxlbmd0aCAvIHN5c3RlbS5yb29mLndpZHRoO1xuICAgICAgICB2YXIgcm9vZl9wbGFuX3JhdGlvID0gbGVuZ3RoX3AgLyBzeXN0ZW0ucm9vZi53aWR0aDtcblxuXG4gICAgICAgIGlmKCBzeXN0ZW0ucm9vZi50eXBlID09PSBcIkdhYmxlXCIpe1xuXG5cbiAgICAgICAgICAgIC8vLy8vLy9cbiAgICAgICAgICAgIC8vIFJvb2QgcGxhbiB2aWV3XG4gICAgICAgICAgICB2YXIgcGxhbl94ID0gNjA7XG4gICAgICAgICAgICB2YXIgcGxhbl95ID0gNjA7XG5cbiAgICAgICAgICAgIHZhciBwbGFuX3csIHBsYW5faDtcbiAgICAgICAgICAgIGlmKCBsZW5ndGhfcCoyID4gc3lzdGVtLnJvb2Yud2lkdGggKXtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDIwMC8obGVuZ3RoX3AqMik7XG4gICAgICAgICAgICAgICAgcGxhbl93ID0gKGxlbmd0aF9wKjIpICogc2NhbGU7XG4gICAgICAgICAgICAgICAgcGxhbl9oID0gcGxhbl93IC8gKGxlbmd0aF9wKjIgLyBzeXN0ZW0ucm9vZi53aWR0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNjYWxlID0gMzAwLyhzeXN0ZW0ucm9vZi53aWR0aCk7XG4gICAgICAgICAgICAgICAgcGxhbl9oID0gc3lzdGVtLnJvb2Yud2lkdGggKiBzY2FsZTtcbiAgICAgICAgICAgICAgICBwbGFuX3cgPSBwbGFuX2ggKiAobGVuZ3RoX3AqMiAvIHN5c3RlbS5yb29mLndpZHRoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feStwbGFuX2gvMl0sXG4gICAgICAgICAgICAgICAgW3BsYW5fdywgcGxhbl9oXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkLnBvbHkoW1xuICAgICAgICAgICAgICAgICAgICBbcGxhbl94ICAgICAgICwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95K3BsYW5faF0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3gsICAgICAgICBwbGFuX3krcGxhbl9oXSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCAgICAgICAsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3Vuc2VsZWN0ZWRcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQucG9seShbXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIgICAgICAgLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yK3BsYW5fdy8yLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yK3BsYW5fdy8yLCBwbGFuX3krcGxhbl9oXSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgICAgICAgIHBsYW5feStwbGFuX2hdLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yICAgICAgICwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX3BvbHlfc2VsZWN0ZWRcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95K3BsYW5faF1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtwbGFuX3gtMjAsIHBsYW5feStwbGFuX2gvMl0sXG4gICAgICAgICAgICAgICAgc3lzdGVtLnJvb2YubGVuZ3RoLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3crMjAsIHBsYW5feStwbGFuX2gvMl0sXG4gICAgICAgICAgICAgICAgc3lzdGVtLnJvb2Yud2lkdGgudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcblxuXG4gICAgICAgICAgICB4ID0gcGxhbl94ICsgMTIwO1xuICAgICAgICAgICAgeSA9IHBsYW5feSAtIDIwO1xuXG4gICAgICAgICAgICBkLmJsb2NrKCdub3J0aCBhcnJvd19sZWZ0JywgW3gseV0pO1xuXG5cbiAgICAgICAgICAgIC8vLy8vLy8vXG4gICAgICAgICAgICAvLyByb29mIGNyb3NzZWN0aW9uXG5cbiAgICAgICAgICAgIHZhciBjc194ID0gcGxhbl94O1xuICAgICAgICAgICAgdmFyIGNzX3kgPSBwbGFuX3kgKyBwbGFuX2ggKyA1MDtcbiAgICAgICAgICAgIHZhciBjc19oID0gc3lzdGVtLnJvb2YuaGVpZ2h0ICogc2NhbGU7XG4gICAgICAgICAgICB2YXIgY3NfdyA9IHBsYW5fdy8yO1xuXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3ldLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3krY3NfaF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3csICAgY3NfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3cqMiwgY3NfeStjc19oXSxcbiAgICAgICAgICAgICAgICAgICAgW2NzX3gsICAgICAgICBjc195K2NzX2hdLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3ldLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbY3NfeCtjc193LTE1LCBjc195K2NzX2gqMi8zXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi5oZWlnaHQgKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbY3NfeCtjc193KjEuNSsyMCwgY3NfeStjc19oLzNdLFxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHN5c3RlbS5yb29mLmxlbmd0aCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG5cblxuICAgICAgICAgICAgLy8vLy8vXG4gICAgICAgICAgICAvLyByb29mIGRldGFpbFxuXG4gICAgICAgICAgICB2YXIgZGV0YWlsX3ggPSAzMCs0MDA7XG4gICAgICAgICAgICB2YXIgZGV0YWlsX3kgPSAzMDtcblxuICAgICAgICAgICAgaWYoIE51bWJlcihzeXN0ZW0ucm9vZi53aWR0aCkgPj0gTnVtYmVyKHN5c3RlbS5yb29mLmxlbmd0aCkgKXtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDM1MC8oc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDM1MC8oc3lzdGVtLnJvb2YubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkZXRhaWxfdyA9IHN5c3RlbS5yb29mLndpZHRoICogc2NhbGU7XG4gICAgICAgICAgICB2YXIgZGV0YWlsX2ggPSBzeXN0ZW0ucm9vZi5sZW5ndGggKiBzY2FsZTtcblxuICAgICAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy8yLCBkZXRhaWxfeStkZXRhaWxfaC8yXSxcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3csIGRldGFpbF9oXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3NlbGVjdGVkX2ZyYW1lZFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB2YXIgYSA9IDM7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0X2EgPSBhICogc2NhbGU7XG5cbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCwgICBkZXRhaWxfeStvZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdywgICBkZXRhaWxfeStvZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCwgICAgICAgICAgZGV0YWlsX3krZGV0YWlsX2gtb2Zmc2V0X2FdLFxuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3csIGRldGFpbF95K2RldGFpbF9oLW9mZnNldF9hXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K29mZnNldF9hLCBkZXRhaWxfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtvZmZzZXRfYSwgZGV0YWlsX3krZGV0YWlsX2hdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3ctb2Zmc2V0X2EsIGRldGFpbF95XSxcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LW9mZnNldF9hLCBkZXRhaWxfeStkZXRhaWxfaF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeC00MCwgZGV0YWlsX3krZGV0YWlsX2gvMl0sXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggc3lzdGVtLnJvb2YubGVuZ3RoICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LzIsIGRldGFpbF95K2RldGFpbF9oKzQwXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi53aWR0aCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94KyAob2Zmc2V0X2EpLzIsIGRldGFpbF95K2RldGFpbF9oKzE1XSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LShvZmZzZXRfYSkvMiwgZGV0YWlsX3krZGV0YWlsX2grMTVdLFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3gtMTUsIGRldGFpbF95K2RldGFpbF9oLShvZmZzZXRfYSkvMl0sXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeC0xNSwgZGV0YWlsX3krKG9mZnNldF9hKS8yXSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHggPSBkZXRhaWxfeCArIGRldGFpbF93ICsgMjU7XG4gICAgICAgICAgICB5ID0gZGV0YWlsX3kgKyAxMjA7XG5cbiAgICAgICAgICAgIGQuYmxvY2soJ25vcnRoIGFycm93X3VwJywgW3gseV0pO1xuXG5cblxuICAgICAgICAgICAgLy8vLy8vXG4gICAgICAgICAgICAvLyBNb2R1bGUgb3B0aW9uc1xuICAgICAgICAgICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdtb2R1bGUnKSAmJiBmLnNlY3Rpb25fZGVmaW5lZCgnYXJyYXknKSl7XG4gICAgICAgICAgICAgICAgdmFyIHIsYztcblxuICAgICAgICAgICAgICAgIHZhciByb29mX2xlbmd0aF9hdmFpbCA9IHN5c3RlbS5yb29mLmxlbmd0aCAtIChhKjIpO1xuICAgICAgICAgICAgICAgIHZhciByb29mX3dpZHRoX2F2YWlsID0gc3lzdGVtLnJvb2Yud2lkdGggLSAoYSoyKTtcblxuICAgICAgICAgICAgICAgIHZhciByb3dfc3BhY2luZztcbiAgICAgICAgICAgICAgICBpZiggc3lzdGVtLm1vZHVsZS5vcmllbnRhdGlvbiA9PT0gJ1BvcnRyYWl0JyApe1xuICAgICAgICAgICAgICAgICAgICByb3dfc3BhY2luZyA9IE51bWJlcihzeXN0ZW0ubW9kdWxlLmxlbmd0aCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBjb2xfc3BhY2luZyA9IE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV93ID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSAgKS8xMjtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlX2ggPSAoTnVtYmVyKHN5c3RlbS5tb2R1bGUubGVuZ3RoKSApLzEyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd19zcGFjaW5nID0gTnVtYmVyKHN5c3RlbS5tb2R1bGUud2lkdGgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgY29sX3NwYWNpbmcgPSBOdW1iZXIoc3lzdGVtLm1vZHVsZS5sZW5ndGgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlX3cgPSAoTnVtYmVyKHN5c3RlbS5tb2R1bGUubGVuZ3RoKSkvMTI7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV9oID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSApLzEyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJvd19zcGFjaW5nID0gcm93X3NwYWNpbmcvMTI7IC8vbW9kdWxlIGRpbWVudGlvbnMgYXJlIGluIGluY2hlc1xuICAgICAgICAgICAgICAgIGNvbF9zcGFjaW5nID0gY29sX3NwYWNpbmcvMTI7IC8vbW9kdWxlIGRpbWVudGlvbnMgYXJlIGluIGluY2hlc1xuXG4gICAgICAgICAgICAgICAgdmFyIG51bV9yb3dzID0gTWF0aC5mbG9vcihyb29mX2xlbmd0aF9hdmFpbC9yb3dfc3BhY2luZyk7XG4gICAgICAgICAgICAgICAgdmFyIG51bV9jb2xzID0gTWF0aC5mbG9vcihyb29mX3dpZHRoX2F2YWlsL2NvbF9zcGFjaW5nKTtcblxuICAgICAgICAgICAgICAgIC8vc2VsZWN0ZWQgbW9kdWxlc1xuXG4gICAgICAgICAgICAgICAgaWYoIG51bV9jb2xzICE9PSBnLnRlbXAubnVtX2NvbHMgfHwgbnVtX3Jvd3MgIT09IGcudGVtcC5udW1fcm93cyApe1xuICAgICAgICAgICAgICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlcyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yKCByPTE7IHI8PW51bV9yb3dzOyByKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciggYz0xOyBjPD1udW1fY29sczsgYysrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICBnLnRlbXAubnVtX2NvbHMgPSBudW1fY29scztcbiAgICAgICAgICAgICAgICAgICAgZy50ZW1wLm51bV9yb3dzID0gbnVtX3Jvd3M7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB4ID0gZGV0YWlsX3ggKyBvZmZzZXRfYTsgLy9jb3JuZXIgb2YgdXNhYmxlIHNwYWNlXG4gICAgICAgICAgICAgICAgeSA9IGRldGFpbF95ICsgb2Zmc2V0X2E7XG4gICAgICAgICAgICAgICAgeCArPSAoIHJvb2Zfd2lkdGhfYXZhaWwgLSAoY29sX3NwYWNpbmcqbnVtX2NvbHMpKS8yICpzY2FsZTsgLy8gY2VudGVyIGFycmF5IG9uIHJvb2ZcbiAgICAgICAgICAgICAgICB5ICs9ICggcm9vZl9sZW5ndGhfYXZhaWwgLSAocm93X3NwYWNpbmcqbnVtX3Jvd3MpKS8yICpzY2FsZTtcbiAgICAgICAgICAgICAgICBtb2R1bGVfdyA9IG1vZHVsZV93ICogc2NhbGU7XG4gICAgICAgICAgICAgICAgbW9kdWxlX2ggPSBtb2R1bGVfaCAqIHNjYWxlO1xuXG5cblxuICAgICAgICAgICAgICAgIGZvciggcj0xOyByPD1udW1fcm93czsgcisrKXtcblxuICAgICAgICAgICAgICAgICAgICBmb3IoIGM9MTsgYzw9bnVtX2NvbHM7IGMrKyl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXllcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSApIGxheWVyID0gJ3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBsYXllciA9ICdwcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZV94ID0gKGMtMSkgKiBjb2xfc3BhY2luZyAqIHNjYWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlX3kgPSAoci0xKSAqIHJvd19zcGFjaW5nICogc2NhbGU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGQucmVjdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbeCttb2R1bGVfeCttb2R1bGVfdy8yLCB5K21vZHVsZV95K21vZHVsZV9oLzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFttb2R1bGVfdywgbW9kdWxlX2hdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljazogXCJnLmYudG9nZ2xlX21vZHVsZSh0aGlzKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVfSUQ6ICAocikgKyAnLCcgKyAoYylcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LzIsIGRldGFpbF95K2RldGFpbF9oKzEwMF0sXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiU2VsZWN0ZWQgbW9kdWxlczogXCIgKyBwYXJzZUZsb2F0KCBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDYWxjdWxhdGVkIG1vZHVsZXM6IFwiICsgcGFyc2VGbG9hdCggZy5zeXN0ZW0uYXJyYXkubnVtYmVyX29mX21vZHVsZXMgKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB9XG5cblxuXG5cbiAgICAgICAgfVxuICAgIH1cblxuXG5cblxuXG5cbiAgICByZXR1cm4gZC5kcmF3aW5nX3BhcnRzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcGFnZTtcbiIsInZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG52YXIgbWtfYm9yZGVyID0gcmVxdWlyZSgnLi9ta19ib3JkZXInKTtcbnZhciBmID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMnKTtcblxudmFyIHBhZ2UgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgY29uc29sZS5sb2coXCIqKiBNYWtpbmcgcHJldmlldyAxXCIpO1xuXG4gICAgdmFyIGQgPSBta19kcmF3aW5nKCk7XG5cblxuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5cbiAgICB2YXIgeCwgeSwgaCwgdywgc2VjdGlvbl94LCBzZWN0aW9uX3k7XG5cbiAgICB3ID0gc2l6ZS5wcmV2aWV3Lm1vZHVsZS53O1xuICAgIGggPSBzaXplLnByZXZpZXcubW9kdWxlLmg7XG4gICAgbG9jLnByZXZpZXcuYXJyYXkuYm90dG9tID0gbG9jLnByZXZpZXcuYXJyYXkudG9wICsgaCoxLjI1KnN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgKyBoKjMvNDtcbiAgICAvL2xvYy5wcmV2aWV3LmFycmF5LnJpZ2h0ID0gbG9jLnByZXZpZXcuYXJyYXkubGVmdCArIHcqMS4yNSpzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgKyB3KjI7XG4gICAgbG9jLnByZXZpZXcuYXJyYXkucmlnaHQgPSBsb2MucHJldmlldy5hcnJheS5sZWZ0ICsgdyoxLjI1KjggKyB3KjI7XG5cbiAgICBsb2MucHJldmlldy5pbnZlcnRlci5jZW50ZXIgPSA1MDAgO1xuICAgIHcgPSBzaXplLnByZXZpZXcuaW52ZXJ0ZXIudztcbiAgICBsb2MucHJldmlldy5pbnZlcnRlci5sZWZ0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIuY2VudGVyIC0gdy8yO1xuICAgIGxvYy5wcmV2aWV3LmludmVydGVyLnJpZ2h0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIuY2VudGVyICsgdy8yO1xuXG4gICAgbG9jLnByZXZpZXcuREMubGVmdCA9IGxvYy5wcmV2aWV3LmFycmF5LnJpZ2h0O1xuICAgIGxvYy5wcmV2aWV3LkRDLnJpZ2h0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIubGVmdDtcbiAgICBsb2MucHJldmlldy5EQy5jZW50ZXIgPSAoIGxvYy5wcmV2aWV3LkRDLnJpZ2h0ICsgbG9jLnByZXZpZXcuREMubGVmdCApLzI7XG5cbiAgICBsb2MucHJldmlldy5BQy5sZWZ0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIucmlnaHQ7XG4gICAgbG9jLnByZXZpZXcuQUMucmlnaHQgPSBsb2MucHJldmlldy5BQy5sZWZ0ICsgMzAwO1xuICAgIGxvYy5wcmV2aWV3LkFDLmNlbnRlciA9ICggbG9jLnByZXZpZXcuQUMucmlnaHQgKyBsb2MucHJldmlldy5BQy5sZWZ0ICkvMjtcblxuXG4vLyBUT0RPIGZpeDogc2VjdGlvbnMgbXVzdCBiZSBkZWZpbmVkIGluIG9yZGVyLCBvciB0aGVyZSBhcmUgYXJlYXNcblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnYXJyYXknKSAmJiBmLnNlY3Rpb25fZGVmaW5lZCgnbW9kdWxlJykgKXtcbiAgICAgICAgZC5sYXllcigncHJldmlld19hcnJheScpO1xuXG4gICAgICAgIHcgPSBzaXplLnByZXZpZXcubW9kdWxlLnc7XG4gICAgICAgIGggPSBzaXplLnByZXZpZXcubW9kdWxlLmg7XG4gICAgICAgIHZhciBvZmZzZXQgPSA0MDtcblxuICAgICAgICBmb3IoIHZhciBzPTA7IHM8c3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzOyBzKysgKXtcbiAgICAgICAgICAgIHggPSBsb2MucHJldmlldy5hcnJheS5sZWZ0ICsgdyoxLjI1KnM7XG4gICAgICAgICAgICAvLyBzdHJpbmcgd2lyaW5nXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbIHggLCBsb2MucHJldmlldy5hcnJheS50b3AgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB4ICwgbG9jLnByZXZpZXcuYXJyYXkuYm90dG9tIF0sXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIC8vIG1vZHVsZXNcbiAgICAgICAgICAgIGZvciggdmFyIG09MDsgbTxzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nOyBtKysgKXtcbiAgICAgICAgICAgICAgICB5ID0gbG9jLnByZXZpZXcuYXJyYXkudG9wICsgaCArIGgqMS4yNSptO1xuICAgICAgICAgICAgICAgIC8vIG1vZHVsZXNcbiAgICAgICAgICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICAgICAgICAgIFsgeCAsIHkgXSxcbiAgICAgICAgICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAgICAgICAgICdwcmV2aWV3X21vZHVsZSdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdG9wIGFycmF5IGNvbmR1aXRcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LmFycmF5LmxlZnQgLCBsb2MucHJldmlldy5hcnJheS50b3AgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LmFycmF5LnJpZ2h0IC0gdywgbG9jLnByZXZpZXcuYXJyYXkudG9wIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5hcnJheS5yaWdodCAsIGxvYy5wcmV2aWV3LmFycmF5LnRvcCBdLFxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgICAgICAvLyBib3R0b20gYXJyYXkgY29uZHVpdFxuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuYXJyYXkubGVmdCAsIGxvYy5wcmV2aWV3LmFycmF5LmJvdHRvbSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuYXJyYXkucmlnaHQgLSB3ICwgbG9jLnByZXZpZXcuYXJyYXkuYm90dG9tIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5hcnJheS5yaWdodCAtIHcgLCBsb2MucHJldmlldy5hcnJheS50b3AgXSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgKTtcblxuICAgICAgICB5ID0gbG9jLnByZXZpZXcuYXJyYXkudG9wO1xuICAgICAgICBoID0gc2l6ZS5wcmV2aWV3Lm1vZHVsZS5oO1xuXG4gICAgICAgIGQudGV4dChcbiAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuREMuY2VudGVyLCB5K2gvMitvZmZzZXQgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnQXJyYXkgREMnLFxuICAgICAgICAgICAgICAgICdTdHJpbmdzOiAnICsgcGFyc2VGbG9hdChzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MpLnRvRml4ZWQoKSxcbiAgICAgICAgICAgICAgICAnTW9kdWxlczogJyArIHBhcnNlRmxvYXQoc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZykudG9GaXhlZCgpLFxuICAgICAgICAgICAgICAgICdQbXA6ICcgKyBwYXJzZUZsb2F0KHN5c3RlbS5hcnJheS5wbXApLnRvRml4ZWQoKSxcbiAgICAgICAgICAgICAgICAnSW1wOiAnICsgcGFyc2VGbG9hdChzeXN0ZW0uYXJyYXkuaW1wKS50b0ZpeGVkKCksXG4gICAgICAgICAgICAgICAgJ1ZtcDogJyArIHBhcnNlRmxvYXQoc3lzdGVtLmFycmF5LnZtcCkudG9GaXhlZCgpLFxuICAgICAgICAgICAgICAgICdJc2M6ICcgKyBwYXJzZUZsb2F0KHN5c3RlbS5hcnJheS5pc2MpLnRvRml4ZWQoKSxcbiAgICAgICAgICAgICAgICAnVm9jOiAnICsgcGFyc2VGbG9hdChzeXN0ZW0uYXJyYXkudm9jKS50b0ZpeGVkKCksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ3ByZXZpZXcgdGV4dCdcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ0RDJykgKXtcbiAgICAgICAgZC5sYXllcigncHJldmlld19EQycpO1xuXG4gICAgICAgIC8veSA9IHk7XG4gICAgICAgIHkgPSBsb2MucHJldmlldy5hcnJheS50b3A7XG4gICAgICAgIHcgPSBzaXplLnByZXZpZXcubW9kdWxlLnc7XG4gICAgICAgIGggPSBzaXplLnByZXZpZXcubW9kdWxlLmg7XG5cbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LkRDLmxlZnQgLCB5IF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5EQy5yaWdodCwgeSBdLFxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbbG9jLnByZXZpZXcuREMuY2VudGVyLHldLFxuICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAncHJldmlld19EQ19ib3gnXG4gICAgICAgICk7XG5cbiAgICB9XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ2ludmVydGVyJykgKXtcblxuICAgICAgICBkLmxheWVyKCdwcmV2aWV3X2ludmVydGVyJyk7XG5cbiAgICAgICAgeSA9IHk7XG4gICAgICAgIHcgPSBzaXplLnByZXZpZXcuaW52ZXJ0ZXIudztcbiAgICAgICAgaCA9IHNpemUucHJldmlldy5pbnZlcnRlci5oO1xuXG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFtsb2MucHJldmlldy5pbnZlcnRlci5jZW50ZXIseV0sXG4gICAgICAgICAgICBbdyxoXSxcbiAgICAgICAgICAgICdwcmV2aWV3X2ludmVydGVyX2JveCdcbiAgICAgICAgKTtcbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgW2xvYy5wcmV2aWV3LmludmVydGVyLmNlbnRlcix5K2gvMitvZmZzZXRdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdJbnZlcnRlcicsXG4gICAgICAgICAgICAgICAgc3lzdGVtLmludmVydGVyLm1ha2UsXG4gICAgICAgICAgICAgICAgc3lzdGVtLmludmVydGVyLm1vZGVsLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwcmV2aWV3IHRleHQnXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdBQycpICl7XG5cbiAgICAgICAgZC5sYXllcigncHJldmlld19BQycpO1xuXG5cbiAgICAgICAgeSA9IHk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5BQy5sZWZ0LCB5IF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5BQy5yaWdodCwgeSBdLFxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgICAgICB3ID0gc2l6ZS5wcmV2aWV3LkFDLnc7XG4gICAgICAgIGggPSBzaXplLnByZXZpZXcuQUMuaDtcbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW2xvYy5wcmV2aWV3LkFDLmNlbnRlcix5XSxcbiAgICAgICAgICAgIFt3LGhdLFxuICAgICAgICAgICAgJ3ByZXZpZXdfQUNfYm94J1xuICAgICAgICApO1xuICAgICAgICB3ID0gc2l6ZS5wcmV2aWV3LmxvYWRjZW50ZXIudztcbiAgICAgICAgaCA9IHNpemUucHJldmlldy5sb2FkY2VudGVyLmg7XG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuQUMucmlnaHQtdy8yLCB5K2gvNCBdLFxuICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAncHJldmlld19BQ19ib3gnXG4gICAgICAgICk7XG5cbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgW2xvYy5wcmV2aWV3LkFDLmNlbnRlcix5K2gvMitvZmZzZXRdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdBQycsXG5cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAncHJldmlldyB0ZXh0J1xuICAgICAgICApO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xudmFyIG1rX2JvcmRlciA9IHJlcXVpcmUoJy4vbWtfYm9yZGVyJyk7XG52YXIgZiA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zJyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHByZXZpZXcgMlwiKTtcblxuICAgIHZhciBkID0gbWtfZHJhd2luZygpO1xuXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdyb29mJykgKXtcblxuICAgICAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICAgICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuICAgICAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuXG4gICAgICAgIHZhciB4LCB5LCBoLCB3LCBzZWN0aW9uX3gsIHNlY3Rpb25feSwgbGVuZ3RoX3AsIHNjYWxlO1xuXG4gICAgICAgIHZhciBzbG9wZSA9IHN5c3RlbS5yb29mLnNsb3BlLnNwbGl0KCc6JylbMF07XG4gICAgICAgIHZhciBhbmdsZV9yYWQgPSBNYXRoLmF0YW4oIE51bWJlcihzbG9wZSkgLzEyICk7XG4gICAgICAgIC8vYW5nbGVfcmFkID0gYW5nbGUgKiAoTWF0aC5QSS8xODApO1xuXG5cbiAgICAgICAgbGVuZ3RoX3AgPSBzeXN0ZW0ucm9vZi5sZW5ndGggKiBNYXRoLmNvcyhhbmdsZV9yYWQpO1xuICAgICAgICBzeXN0ZW0ucm9vZi5oZWlnaHQgPSBzeXN0ZW0ucm9vZi5sZW5ndGggKiBNYXRoLnNpbihhbmdsZV9yYWQpO1xuXG4gICAgICAgIHZhciByb29mX3JhdGlvID0gc3lzdGVtLnJvb2YubGVuZ3RoIC8gc3lzdGVtLnJvb2Yud2lkdGg7XG4gICAgICAgIHZhciByb29mX3BsYW5fcmF0aW8gPSBsZW5ndGhfcCAvIHN5c3RlbS5yb29mLndpZHRoO1xuXG5cbiAgICAgICAgaWYoIHN5c3RlbS5yb29mLnR5cGUgPT09IFwiR2FibGVcIil7XG5cblxuICAgICAgICAgICAgLy8vLy8vL1xuICAgICAgICAgICAgLy8gUm9vZCBwbGFuIHZpZXdcbiAgICAgICAgICAgIHZhciBwbGFuX3ggPSAzMDtcbiAgICAgICAgICAgIHZhciBwbGFuX3kgPSAzMDtcblxuICAgICAgICAgICAgdmFyIHBsYW5fdywgcGxhbl9oO1xuICAgICAgICAgICAgaWYoIGxlbmd0aF9wKjIgPiBzeXN0ZW0ucm9vZi53aWR0aCApe1xuICAgICAgICAgICAgICAgIHNjYWxlID0gMjUwLyhsZW5ndGhfcCoyKTtcbiAgICAgICAgICAgICAgICBwbGFuX3cgPSAobGVuZ3RoX3AqMikgKiBzY2FsZTtcbiAgICAgICAgICAgICAgICBwbGFuX2ggPSBwbGFuX3cgLyAobGVuZ3RoX3AqMiAvIHN5c3RlbS5yb29mLndpZHRoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2NhbGUgPSA0MDAvKHN5c3RlbS5yb29mLndpZHRoKTtcbiAgICAgICAgICAgICAgICBwbGFuX2ggPSBzeXN0ZW0ucm9vZi53aWR0aCAqIHNjYWxlO1xuICAgICAgICAgICAgICAgIHBsYW5fdyA9IHBsYW5faCAqIChsZW5ndGhfcCoyIC8gc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95K3BsYW5faC8yXSxcbiAgICAgICAgICAgICAgICBbcGxhbl93LCBwbGFuX2hdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsXCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGQucG9seShbXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3ggICAgICAgLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3krcGxhbl9oXSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCwgICAgICAgIHBsYW5feStwbGFuX2hdLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94ICAgICAgICwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX3BvbHlfdW5zZWxlY3RlZFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5wb2x5KFtcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiAgICAgICAsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIrcGxhbl93LzIsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIrcGxhbl93LzIsIHBsYW5feStwbGFuX2hdLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCAgICAgICAgcGxhbl95K3BsYW5faF0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIgICAgICAgLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfcG9seV9zZWxlY3RlZFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3krcGxhbl9oXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW3BsYW5feC0yMCwgcGxhbl95K3BsYW5faC8yXSxcbiAgICAgICAgICAgICAgICBzeXN0ZW0ucm9vZi5sZW5ndGgudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdysyMCwgcGxhbl95K3BsYW5faC8yXSxcbiAgICAgICAgICAgICAgICBzeXN0ZW0ucm9vZi53aWR0aC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG5cblxuXG4gICAgICAgICAgICAvLy8vLy8vL1xuICAgICAgICAgICAgLy8gcm9vZiBjcm9zc2VjdGlvblxuXG4gICAgICAgICAgICB2YXIgY3NfeCA9IDMwO1xuICAgICAgICAgICAgdmFyIGNzX3kgPSAzMCtwbGFuX2grNTA7XG4gICAgICAgICAgICB2YXIgY3NfaCA9IHN5c3RlbS5yb29mLmhlaWdodCAqIHNjYWxlO1xuICAgICAgICAgICAgdmFyIGNzX3cgPSBwbGFuX3cvMjtcblxuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2NzX3grY3NfdywgICBjc195XSxcbiAgICAgICAgICAgICAgICAgICAgW2NzX3grY3NfdywgICBjc195K2NzX2hdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3ldLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193KjIsIGNzX3krY3NfaF0sXG4gICAgICAgICAgICAgICAgICAgIFtjc194LCAgICAgICAgY3NfeStjc19oXSxcbiAgICAgICAgICAgICAgICAgICAgW2NzX3grY3NfdywgICBjc195XSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2NzX3grY3Nfdy0xNSwgY3NfeStjc19oKjIvM10sXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggc3lzdGVtLnJvb2YuaGVpZ2h0ICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2NzX3grY3NfdyoxLjUrMjAsIGNzX3krY3NfaC8zXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi5sZW5ndGggKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcblxuXG5cbiAgICAgICAgICAgIC8vLy8vL1xuICAgICAgICAgICAgLy8gcm9vZiBkZXRhaWxcblxuICAgICAgICAgICAgdmFyIGRldGFpbF94ID0gMzArNDUwO1xuICAgICAgICAgICAgdmFyIGRldGFpbF95ID0gMzA7XG5cbiAgICAgICAgICAgIGlmKCBOdW1iZXIoc3lzdGVtLnJvb2Yud2lkdGgpID49IE51bWJlcihzeXN0ZW0ucm9vZi5sZW5ndGgpICl7XG4gICAgICAgICAgICAgICAgc2NhbGUgPSA0NTAvKHN5c3RlbS5yb29mLndpZHRoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2NhbGUgPSA0NTAvKHN5c3RlbS5yb29mLmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZGV0YWlsX3cgPSBzeXN0ZW0ucm9vZi53aWR0aCAqIHNjYWxlO1xuICAgICAgICAgICAgdmFyIGRldGFpbF9oID0gc3lzdGVtLnJvb2YubGVuZ3RoICogc2NhbGU7XG5cbiAgICAgICAgICAgIGQucmVjdChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3cvMiwgZGV0YWlsX3krZGV0YWlsX2gvMl0sXG4gICAgICAgICAgICAgICAgW2RldGFpbF93LCBkZXRhaWxfaF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfcG9seV9zZWxlY3RlZF9mcmFtZWRcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdmFyIGEgPSAzO1xuICAgICAgICAgICAgdmFyIG9mZnNldF9hID0gYSAqIHNjYWxlO1xuXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3gsICAgZGV0YWlsX3krb2Zmc2V0X2FdLFxuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3csICAgZGV0YWlsX3krb2Zmc2V0X2FdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3gsICAgICAgICAgIGRldGFpbF95K2RldGFpbF9oLW9mZnNldF9hXSxcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LCBkZXRhaWxfeStkZXRhaWxfaC1vZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtvZmZzZXRfYSwgZGV0YWlsX3ldLFxuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grb2Zmc2V0X2EsIGRldGFpbF95K2RldGFpbF9oXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LW9mZnNldF9hLCBkZXRhaWxfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy1vZmZzZXRfYSwgZGV0YWlsX3krZGV0YWlsX2hdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3gtNDAsIGRldGFpbF95K2RldGFpbF9oLzJdLFxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHN5c3RlbS5yb29mLmxlbmd0aCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy8yLCBkZXRhaWxfeStkZXRhaWxfaCs0MF0sXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggc3lzdGVtLnJvb2Yud2lkdGggKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeCsgKG9mZnNldF9hKS8yLCBkZXRhaWxfeStkZXRhaWxfaCsxNV0sXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy0ob2Zmc2V0X2EpLzIsIGRldGFpbF95K2RldGFpbF9oKzE1XSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94LTE1LCBkZXRhaWxfeStkZXRhaWxfaC0ob2Zmc2V0X2EpLzJdLFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3gtMTUsIGRldGFpbF95KyhvZmZzZXRfYSkvMl0sXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG5cblxuXG5cbiAgICAgICAgICAgIC8vLy8vL1xuICAgICAgICAgICAgLy8gTW9kdWxlIG9wdGlvbnNcbiAgICAgICAgICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnbW9kdWxlJykgJiYgZi5zZWN0aW9uX2RlZmluZWQoJ2FycmF5Jykpe1xuICAgICAgICAgICAgICAgIHZhciByLGM7XG5cbiAgICAgICAgICAgICAgICB2YXIgcm9vZl9sZW5ndGhfYXZhaWwgPSBzeXN0ZW0ucm9vZi5sZW5ndGggLSAoYSoyKTtcbiAgICAgICAgICAgICAgICB2YXIgcm9vZl93aWR0aF9hdmFpbCA9IHN5c3RlbS5yb29mLndpZHRoIC0gKGEqMik7XG5cbiAgICAgICAgICAgICAgICB2YXIgcm93X3NwYWNpbmc7XG4gICAgICAgICAgICAgICAgaWYoIHN5c3RlbS5tb2R1bGUub3JpZW50YXRpb24gPT09ICdQb3J0cmFpdCcgKXtcbiAgICAgICAgICAgICAgICAgICAgcm93X3NwYWNpbmcgPSBOdW1iZXIoc3lzdGVtLm1vZHVsZS5sZW5ndGgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgY29sX3NwYWNpbmcgPSBOdW1iZXIoc3lzdGVtLm1vZHVsZS53aWR0aCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVfdyA9IChOdW1iZXIoc3lzdGVtLm1vZHVsZS53aWR0aCkgICkvMTI7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV9oID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLmxlbmd0aCkgKS8xMjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByb3dfc3BhY2luZyA9IE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIGNvbF9zcGFjaW5nID0gTnVtYmVyKHN5c3RlbS5tb2R1bGUubGVuZ3RoKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV93ID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLmxlbmd0aCkpLzEyO1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVfaCA9IChOdW1iZXIoc3lzdGVtLm1vZHVsZS53aWR0aCkgKS8xMjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByb3dfc3BhY2luZyA9IHJvd19zcGFjaW5nLzEyOyAvL21vZHVsZSBkaW1lbnRpb25zIGFyZSBpbiBpbmNoZXNcbiAgICAgICAgICAgICAgICBjb2xfc3BhY2luZyA9IGNvbF9zcGFjaW5nLzEyOyAvL21vZHVsZSBkaW1lbnRpb25zIGFyZSBpbiBpbmNoZXNcblxuICAgICAgICAgICAgICAgIHZhciBudW1fcm93cyA9IE1hdGguZmxvb3Iocm9vZl9sZW5ndGhfYXZhaWwvcm93X3NwYWNpbmcpO1xuICAgICAgICAgICAgICAgIHZhciBudW1fY29scyA9IE1hdGguZmxvb3Iocm9vZl93aWR0aF9hdmFpbC9jb2xfc3BhY2luZyk7XG5cbiAgICAgICAgICAgICAgICAvL3NlbGVjdGVkIG1vZHVsZXNcblxuICAgICAgICAgICAgICAgIGlmKCBudW1fY29scyAhPT0gZy50ZW1wLm51bV9jb2xzIHx8IG51bV9yb3dzICE9PSBnLnRlbXAubnVtX3Jvd3MgKXtcbiAgICAgICAgICAgICAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNfdG90YWwgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciggcj0xOyByPD1udW1fcm93czsgcisrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzW3JdID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IoIGM9MTsgYzw9bnVtX2NvbHM7IGMrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl1bY10gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICAgICAgZy50ZW1wLm51bV9jb2xzID0gbnVtX2NvbHM7XG4gICAgICAgICAgICAgICAgICAgIGcudGVtcC5udW1fcm93cyA9IG51bV9yb3dzO1xuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgeCA9IGRldGFpbF94ICsgb2Zmc2V0X2E7IC8vY29ybmVyIG9mIHVzYWJsZSBzcGFjZVxuICAgICAgICAgICAgICAgIHkgPSBkZXRhaWxfeSArIG9mZnNldF9hO1xuICAgICAgICAgICAgICAgIHggKz0gKCByb29mX3dpZHRoX2F2YWlsIC0gKGNvbF9zcGFjaW5nKm51bV9jb2xzKSkvMiAqc2NhbGU7IC8vIGNlbnRlciBhcnJheSBvbiByb29mXG4gICAgICAgICAgICAgICAgeSArPSAoIHJvb2ZfbGVuZ3RoX2F2YWlsIC0gKHJvd19zcGFjaW5nKm51bV9yb3dzKSkvMiAqc2NhbGU7XG4gICAgICAgICAgICAgICAgbW9kdWxlX3cgPSBtb2R1bGVfdyAqIHNjYWxlO1xuICAgICAgICAgICAgICAgIG1vZHVsZV9oID0gbW9kdWxlX2ggKiBzY2FsZTtcblxuXG5cbiAgICAgICAgICAgICAgICBmb3IoIHI9MTsgcjw9bnVtX3Jvd3M7IHIrKyl7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yKCBjPTE7IGM8PW51bV9jb2xzOyBjKyspe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF5ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl1bY10gKSBsYXllciA9ICdwcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgbGF5ZXIgPSAncHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVfeCA9IChjLTEpICogY29sX3NwYWNpbmcgKiBzY2FsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZV95ID0gKHItMSkgKiByb3dfc3BhY2luZyAqIHNjYWxlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3grbW9kdWxlX3grbW9kdWxlX3cvMiwgeSttb2R1bGVfeSttb2R1bGVfaC8yXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbW9kdWxlX3csIG1vZHVsZV9oXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXllcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s6IFwiZy5mLnRvZ2dsZV9tb2R1bGUodGhpcylcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlX0lEOiAgKHIpICsgJywnICsgKGMpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy8yLCBkZXRhaWxfeStkZXRhaWxfaCsxMDBdLFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlNlbGVjdGVkIG1vZHVsZXM6IFwiICsgcGFyc2VGbG9hdCggZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNfdG90YWwgKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ2FsY3VsYXRlZCBtb2R1bGVzOiBcIiArIHBhcnNlRmxvYXQoIGcuc3lzdGVtLmFycmF5Lm51bWJlcl9vZl9tb2R1bGVzICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB4ID0gZGV0YWlsX3ggKyA0NzU7XG4gICAgICAgICAgICB5ID0gZGV0YWlsX3kgKyAxMjA7XG5cbiAgICAgICAgICAgIGQuYmxvY2soJ25vcnRoIGFycm93X3VwJywgW3gseV0pO1xuXG4gICAgICAgICAgICB4ID0gMTIwO1xuICAgICAgICAgICAgeSA9IDE1O1xuXG4gICAgICAgICAgICBkLmJsb2NrKCdub3J0aCBhcnJvd19sZWZ0JywgW3gseV0pO1xuLy8qL1xuICAgICAgICB9XG5cblxuICAgICAgICAvKlxuXG5cblxuXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCwgICAgeV0sXG4gICAgICAgICAgICBbeCtkeCwgeS1keV0sXG4gICAgICAgICAgICBbeCtkeCwgeV0sXG4gICAgICAgICAgICBbeCwgICAgeV0sXG4gICAgICAgICAgICBdXG4gICAgICAgICk7XG5cbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgW3grZHgvMi0xMCwgeS1keS8yLTIwXSxcbiAgICAgICAgICAgIHN5c3RlbS5yb29mLmhlaWdodC50b1N0cmluZygpLFxuICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgKTtcbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgW3grZHgvMis1LCB5LTE1XSxcbiAgICAgICAgICAgIGFuZ2xlLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICApO1xuXG5cbiAgICAgICAgeCA9IHgrZHgrMTAwO1xuICAgICAgICB5ID0geTtcblxuXG4gICAgICAgIC8vKi9cblxuICAgIH1cblxuICAgIHJldHVybiBkLmRyYXdpbmdfcGFydHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy92YXIgc2V0dGluZ3MgPSByZXF1aXJlKCcuL3NldHRpbmdzLmpzJyk7XG4vL3ZhciBzbmFwc3ZnID0gcmVxdWlyZSgnc25hcHN2ZycpO1xuLy9sb2coc2V0dGluZ3MpO1xuXG5cblxudmFyIGRpc3BsYXlfc3ZnID0gZnVuY3Rpb24oZHJhd2luZ19wYXJ0cywgc2V0dGluZ3Mpe1xuICAgIC8vY29uc29sZS5sb2coJ2Rpc3BsYXlpbmcgc3ZnJyk7XG4gICAgdmFyIGxheWVyX2F0dHIgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxheWVyX2F0dHI7XG4gICAgdmFyIGZvbnRzID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5mb250cztcbiAgICAvL2NvbnNvbGUubG9nKCdkcmF3aW5nX3BhcnRzOiAnLCBkcmF3aW5nX3BhcnRzKTtcbiAgICAvL2NvbnRhaW5lci5lbXB0eSgpXG5cbiAgICAvL3ZhciBzdmdfZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdTdmdqc1N2ZzEwMDAnKVxuICAgIHZhciBzdmdfZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdzdmcnKTtcbiAgICBzdmdfZWxlbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywnc3ZnX2RyYXdpbmcnKTtcbiAgICAvL3N2Z19lbGVtLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy53KTtcbiAgICAvL3N2Z19lbGVtLnNldEF0dHJpYnV0ZSgnaGVpZ2h0Jywgc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcuaCk7XG4gICAgdmFyIHZpZXdfYm94ID0gJzAgMCAnICtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcudyArICcgJyArXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS5kcmF3aW5nLmggKyAnICc7XG4gICAgc3ZnX2VsZW0uc2V0QXR0cmlidXRlKCd2aWV3Qm94Jywgdmlld19ib3gpO1xuICAgIC8vdmFyIHN2ZyA9IHNuYXBzdmcoc3ZnX2VsZW0pLnNpemUoc2l6ZS5kcmF3aW5nLncsIHNpemUuZHJhd2luZy5oKTtcbiAgICAvL3ZhciBzdmcgPSBzbmFwc3ZnKCcjc3ZnX2RyYXdpbmcnKTtcblxuICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgdGhlIGRyYXdpbmcgY29udGVudHMsIGNhbGwgdGhlIGZ1bmN0aW9uIGJlbG93LlxuICAgIGRyYXdpbmdfcGFydHMuZm9yRWFjaCggZnVuY3Rpb24oZWxlbSxpZCkge1xuICAgICAgICBzaG93X2VsZW1fYXJyYXkoZWxlbSk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzaG93X2VsZW1fYXJyYXkoZWxlbSwgb2Zmc2V0KXtcbiAgICAgICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IHt4OjAseTowfTtcbiAgICAgICAgdmFyIHgseSxhdHRyX25hbWU7XG4gICAgICAgIGlmKCB0eXBlb2YgZWxlbS54ICE9PSAndW5kZWZpbmVkJyApIHsgeCA9IGVsZW0ueCArIG9mZnNldC54OyB9XG4gICAgICAgIGlmKCB0eXBlb2YgZWxlbS55ICE9PSAndW5kZWZpbmVkJyApIHsgeSA9IGVsZW0ueSArIG9mZnNldC55OyB9XG5cbiAgICAgICAgdmFyIGF0dHJzID0gbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdO1xuICAgICAgICBpZiggZWxlbS5hdHRycyAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgIGZvciggYXR0cl9uYW1lIGluIGVsZW0uYXR0cnMgKXtcbiAgICAgICAgICAgICAgICBhdHRyc1thdHRyX25hbWVdID0gZWxlbS5hdHRyc1thdHRyX25hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYoIGVsZW0udHlwZSA9PT0gJ3JlY3QnKSB7XG4gICAgICAgICAgICAvL3N2Zy5yZWN0KCBlbGVtLncsIGVsZW0uaCApLm1vdmUoIHgtZWxlbS53LzIsIHktZWxlbS5oLzIgKS5hdHRyKCBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV0gKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2VsZW06JywgZWxlbSApO1xuICAgICAgICAgICAgLy9pZiggaXNOYU4oZWxlbS53KSApIHtcbiAgICAgICAgICAgIC8vICAgIGNvbnNvbGUubG9nKCdlcnJvcjogZWxlbSBub3QgZnVsbHkgZGVmaW5lZCcsIGVsZW0pXG4gICAgICAgICAgICAvLyAgICBlbGVtLncgPSAxMDtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgLy9pZiggaXNOYU4oZWxlbS5oKSApIHtcbiAgICAgICAgICAgIC8vICAgIGNvbnNvbGUubG9nKCdlcnJvcjogZWxlbSBub3QgZnVsbHkgZGVmaW5lZCcsIGVsZW0pXG4gICAgICAgICAgICAvLyAgICBlbGVtLmggPSAxMDtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgdmFyIHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAncmVjdCcpO1xuICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgZWxlbS53KTtcbiAgICAgICAgICAgIHIuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBlbGVtLmgpO1xuICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoJ3gnLCB4LWVsZW0udy8yKTtcbiAgICAgICAgICAgIHIuc2V0QXR0cmlidXRlKCd5JywgeS1lbGVtLmgvMik7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGVsZW0ubGF5ZXJfbmFtZSk7XG4gICAgICAgICAgICBmb3IoIGF0dHJfbmFtZSBpbiBhdHRycyApe1xuICAgICAgICAgICAgICAgIHIuc2V0QXR0cmlidXRlKGF0dHJfbmFtZSwgYXR0cnNbYXR0cl9uYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdmdfZWxlbS5hcHBlbmRDaGlsZChyKTtcbiAgICAgICAgfSBlbHNlIGlmKCBlbGVtLnR5cGUgPT09ICdsaW5lJykge1xuICAgICAgICAgICAgdmFyIHBvaW50czIgPSBbXTtcbiAgICAgICAgICAgIGVsZW0ucG9pbnRzLmZvckVhY2goIGZ1bmN0aW9uKHBvaW50KXtcbiAgICAgICAgICAgICAgICBpZiggISBpc05hTihwb2ludFswXSkgJiYgISBpc05hTihwb2ludFsxXSkgKXtcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzMi5wdXNoKFsgcG9pbnRbMF0rb2Zmc2V0LngsIHBvaW50WzFdK29mZnNldC55IF0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjogZWxlbSBub3QgZnVsbHkgZGVmaW5lZCcsIGVsZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9zdmcucG9seWxpbmUoIHBvaW50czIgKS5hdHRyKCBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV0gKTtcblxuICAgICAgICAgICAgdmFyIGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAncG9seWxpbmUnKTtcbiAgICAgICAgICAgIGwuc2V0QXR0cmlidXRlKCAncG9pbnRzJywgcG9pbnRzMi5qb2luKCcgJykgKTtcbiAgICAgICAgICAgIGZvciggYXR0cl9uYW1lIGluIGF0dHJzICl7XG4gICAgICAgICAgICAgICAgbC5zZXRBdHRyaWJ1dGUoYXR0cl9uYW1lLCBhdHRyc1thdHRyX25hbWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN2Z19lbGVtLmFwcGVuZENoaWxkKGwpO1xuICAgICAgICB9IGVsc2UgaWYoIGVsZW0udHlwZSA9PT0gJ3BvbHknKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnRzMiA9IFtdO1xuICAgICAgICAgICAgZWxlbS5wb2ludHMuZm9yRWFjaCggZnVuY3Rpb24ocG9pbnQpe1xuICAgICAgICAgICAgICAgIGlmKCAhIGlzTmFOKHBvaW50WzBdKSAmJiAhIGlzTmFOKHBvaW50WzFdKSApe1xuICAgICAgICAgICAgICAgICAgICBwb2ludHMyLnB1c2goWyBwb2ludFswXStvZmZzZXQueCwgcG9pbnRbMV0rb2Zmc2V0LnkgXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yOiBlbGVtIG5vdCBmdWxseSBkZWZpbmVkJywgZWxlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL3N2Zy5wb2x5bGluZSggcG9pbnRzMiApLmF0dHIoIGxheWVyX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApO1xuXG4gICAgICAgICAgICB2YXIgbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdwb2x5bGluZScpO1xuICAgICAgICAgICAgbC5zZXRBdHRyaWJ1dGUoICdwb2ludHMnLCBwb2ludHMyLmpvaW4oJyAnKSApO1xuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gYXR0cnMgKXtcbiAgICAgICAgICAgICAgICBsLnNldEF0dHJpYnV0ZShhdHRyX25hbWUsIGF0dHJzW2F0dHJfbmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3ZnX2VsZW0uYXBwZW5kQ2hpbGQobCk7XG4gICAgICAgIH0gZWxzZSBpZiggZWxlbS50eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgIC8vdmFyIHQgPSBzdmcudGV4dCggZWxlbS5zdHJpbmdzICkubW92ZSggZWxlbS5wb2ludHNbMF1bMF0sIGVsZW0ucG9pbnRzWzBdWzFdICkuYXR0ciggbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdIClcbiAgICAgICAgICAgIHZhciBmb250O1xuICAgICAgICAgICAgaWYoIGVsZW0uZm9udCApe1xuICAgICAgICAgICAgICAgIGZvbnQgPSBmb250c1tlbGVtLmZvbnRdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb250ID0gZm9udHNbYXR0cnMuZm9udF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICd0ZXh0Jyk7XG4gICAgICAgICAgICBpZihlbGVtLnJvdGF0ZWQpe1xuICAgICAgICAgICAgICAgIC8vdC5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsIFwicm90YXRlKFwiICsgZWxlbS5yb3RhdGVkICsgXCIgXCIgKyB4ICsgXCIgXCIgKyB5ICsgXCIpXCIgKTtcbiAgICAgICAgICAgICAgICB0LnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywgXCJyb3RhdGUoXCIgKyBlbGVtLnJvdGF0ZWQgKyBcIiBcIiArIHggKyBcIiBcIiArIHkgKyBcIilcIiApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL2lmKCBmb250Wyd0ZXh0LWFuY2hvciddID09PSAnbWlkZGxlJyApIHkgKz0gZm9udFsnZm9udC1zaXplJ10qMS8zO1xuICAgICAgICAgICAgICAgIHkgKz0gZm9udFsnZm9udC1zaXplJ10qMS8zO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGR5ID0gZm9udFsnZm9udC1zaXplJ10qMS41O1xuICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoJ3gnLCB4KTtcbiAgICAgICAgICAgIC8vdC5zZXRBdHRyaWJ1dGUoJ3knLCB5ICsgZm9udFsnZm9udC1zaXplJ10vMiApO1xuICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoJ3knLCB5LWR5ICk7XG5cbiAgICAgICAgICAgIGZvciggYXR0cl9uYW1lIGluIGF0dHJzICl7XG4gICAgICAgICAgICAgICAgaWYoIGF0dHJfbmFtZSA9PT0gJ3N0cm9rZScgKSB7XG4gICAgICAgICAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCAnZmlsbCcsIGF0dHJzW2F0dHJfbmFtZV0gKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoIGF0dHJfbmFtZSA9PT0gJ2ZpbGwnICkge1xuICAgICAgICAgICAgICAgICAgICAvL3Quc2V0QXR0cmlidXRlKCAnc3Ryb2tlJywgJ25vbmUnICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoIGF0dHJfbmFtZSwgYXR0cnNbYXR0cl9uYW1lXSApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gZm9udCApe1xuICAgICAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCBhdHRyX25hbWUsIGZvbnRbYXR0cl9uYW1lXSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gZWxlbS5zdHJpbmdzICl7XG4gICAgICAgICAgICAgICAgdmFyIHRzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3RzcGFuJyk7XG4gICAgICAgICAgICAgICAgdHNwYW4uc2V0QXR0cmlidXRlKCdkeScsIGR5ICk7XG4gICAgICAgICAgICAgICAgdHNwYW4uc2V0QXR0cmlidXRlKCd4JywgeCk7XG4gICAgICAgICAgICAgICAgdHNwYW4uaW5uZXJIVE1MID0gZWxlbS5zdHJpbmdzW2F0dHJfbmFtZV07XG4gICAgICAgICAgICAgICAgdC5hcHBlbmRDaGlsZCh0c3Bhbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdmdfZWxlbS5hcHBlbmRDaGlsZCh0KTtcbiAgICAgICAgfSBlbHNlIGlmKCBlbGVtLnR5cGUgPT09ICdjaXJjJykge1xuICAgICAgICAgICAgdmFyIGMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAnZWxsaXBzZScpO1xuICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoJ3J4JywgZWxlbS5kLzIpO1xuICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoJ3J5JywgZWxlbS5kLzIpO1xuICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoJ2N4JywgeCk7XG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZSgnY3knLCB5KTtcbiAgICAgICAgICAgIGZvciggYXR0cl9uYW1lIGluIGF0dHJzICl7XG4gICAgICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoYXR0cl9uYW1lLCBhdHRyc1thdHRyX25hbWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN2Z19lbGVtLmFwcGVuZENoaWxkKGMpO1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGMuYXR0cmlidXRlcyggbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdIClcbiAgICAgICAgICAgIGMuYXR0cmlidXRlcyh7XG4gICAgICAgICAgICAgICAgcng6IDUsXG4gICAgICAgICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICByeTogNSxcbiAgICAgICAgICAgICAgICBjeDogZWxlbS5wb2ludHNbMF1bMF0tZWxlbS5kLzIsXG4gICAgICAgICAgICAgICAgY3k6IGVsZW0ucG9pbnRzWzBdWzFdLWVsZW0uZC8yXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdmFyIGMyID0gc3ZnLmVsbGlwc2UoIGVsZW0uciwgZWxlbS5yIClcbiAgICAgICAgICAgIGMyLm1vdmUoIGVsZW0ucG9pbnRzWzBdWzBdLWVsZW0uZC8yLCBlbGVtLnBvaW50c1swXVsxXS1lbGVtLmQvMiApXG4gICAgICAgICAgICBjMi5hdHRyKHtyeDo1LCByeTo1fSlcbiAgICAgICAgICAgIGMyLmF0dHIoIGxheWVyX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApXG4gICAgICAgICAgICAqL1xuICAgICAgICB9IGVsc2UgaWYoZWxlbS50eXBlID09PSAnYmxvY2snKSB7XG4gICAgICAgICAgICAvLyBpZiBpdCBpcyBhIGJsb2NrLCBydW4gdGhpcyBmdW5jdGlvbiB0aHJvdWdoIGVhY2ggZWxlbWVudC5cbiAgICAgICAgICAgIGVsZW0uZHJhd2luZ19wYXJ0cy5mb3JFYWNoKCBmdW5jdGlvbihibG9ja19lbGVtLGlkKXtcbiAgICAgICAgICAgICAgICBzaG93X2VsZW1fYXJyYXkoYmxvY2tfZWxlbSwge3g6eCwgeTp5fSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3ZnX2VsZW07XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZGlzcGxheV9zdmc7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBmID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMnKTtcbnZhciBrID0gcmVxdWlyZSgnLi4vbGliL2svay5qcycpO1xuXG52YXIgaTtcbi8vdmFyIHNldHRpbmdzQ2FsY3VsYXRlZCA9IHJlcXVpcmUoJy4vc2V0dGluZ3NDYWxjdWxhdGVkLmpzJyk7XG5cbi8vIExvYWQgJ3VzZXInIGRlZmluZWQgc2V0dGluZ3Ncbi8vdmFyIG1rX3NldHRpbmdzID0gcmVxdWlyZSgnLi4vZGF0YS9zZXR0aW5ncy5qc29uLmpzJyk7XG4vL2YubWtfc2V0dGluZ3MgPSBta19zZXR0aW5ncztcblxudmFyIHNldHRpbmdzID0ge307XG5cbnNldHRpbmdzLnRlbXAgPSB7fTtcblxuc2V0dGluZ3MuY29uZmlnX29wdGlvbnMgPSB7fTtcbnNldHRpbmdzLmNvbmZpZ19vcHRpb25zLk5FQ190YWJsZXMgPSByZXF1aXJlKCcuLi9kYXRhL3RhYmxlcy5qc29uJyk7XG4vL2NvbnNvbGUubG9nKHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLk5FQ190YWJsZXMpO1xuXG5zZXR0aW5ncy5zdGF0ZSA9IHt9O1xuc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkID0gZmFsc2U7XG5cbnNldHRpbmdzLmluID0ge307XG5cbnNldHRpbmdzLmluLm9wdCA9IHt9O1xuc2V0dGluZ3MuaW4ub3B0LkFDID0ge307XG5zZXR0aW5ncy5pbi5vcHQuQUMudHlwZXMgPSB7fTtcbnNldHRpbmdzLmluLm9wdC5BQy50eXBlc1tcIjEyMFZcIl0gPSBbXCJncm91bmRcIixcIm5ldXRyYWxcIixcIkwxXCJdO1xuc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzW1wiMjQwVlwiXSA9IFtcImdyb3VuZFwiLFwibmV1dHJhbFwiLFwiTDFcIixcIkwyXCJdO1xuc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzW1wiMjA4VlwiXSA9IFtcImdyb3VuZFwiLFwibmV1dHJhbFwiLFwiTDFcIixcIkwyXCJdO1xuc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzW1wiMjc3VlwiXSA9IFtcImdyb3VuZFwiLFwibmV1dHJhbFwiLFwiTDFcIl07XG5zZXR0aW5ncy5pbi5vcHQuQUMudHlwZXNbXCI0ODBWIFd5ZVwiXSA9IFtcImdyb3VuZFwiLFwibmV1dHJhbFwiLFwiTDFcIixcIkwyXCIsXCJMM1wiXTtcbnNldHRpbmdzLmluLm9wdC5BQy50eXBlc1tcIjQ4MFYgRGVsdGFcIl0gPSBbXCJncm91bmRcIixcIkwxXCIsXCJMMlwiLFwiTDNcIl07XG5cbnNldHRpbmdzLmlucHV0cyA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLnJvb2YgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5yb29mLndpZHRoID0ge307XG5zZXR0aW5ncy5pbnB1dHMucm9vZi53aWR0aC5vcHRpb25zID0gW107XG4vL2ZvciggaT0xNTsgaTw9NzA7IGkrPTUgKSBzZXR0aW5ncy5pbnB1dHMucm9vZi53aWR0aC5vcHRpb25zLnB1c2goaSk7XG5zZXR0aW5ncy5pbnB1dHMucm9vZi53aWR0aC51bml0cyA9ICdmdC4nO1xuc2V0dGluZ3MuaW5wdXRzLnJvb2Yud2lkdGgubm90ZSA9ICdUaGlzIHRoZSBmdWxsIHNpemUgb2YgdGhlIHJvb2YsIHBlcnBlbmRpY3R1bGFyIHRvIHRoZSBzbG9wZS4nO1xuc2V0dGluZ3MuaW5wdXRzLnJvb2Yud2lkdGgudHlwZSA9ICdpbnB1dCc7XG5zZXR0aW5ncy5pbnB1dHMucm9vZi5sZW5ndGggPSB7fTtcbnNldHRpbmdzLmlucHV0cy5yb29mLmxlbmd0aC5vcHRpb25zID0gW107XG4vL2ZvciggaT0xMDsgaTw9NjA7IGkrPTUgKSBzZXR0aW5ncy5pbnB1dHMucm9vZi5sZW5ndGgub3B0aW9ucy5wdXNoKGkpO1xuc2V0dGluZ3MuaW5wdXRzLnJvb2YubGVuZ3RoLnVuaXRzID0gJ2Z0Lic7XG5zZXR0aW5ncy5pbnB1dHMucm9vZi5sZW5ndGgubm90ZSA9ICdUaGlzIHRoZSBmdWxsIGxlbmd0aCBvZiB0aGUgcm9vZiwgbWVhc3VyZWQgZnJvbSBsb3cgdG8gaGlnaC4nO1xuc2V0dGluZ3MuaW5wdXRzLnJvb2YubGVuZ3RoLnR5cGUgPSAnaW5wdXQnO1xuc2V0dGluZ3MuaW5wdXRzLnJvb2Yuc2xvcGUgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5yb29mLnNsb3BlLm9wdGlvbnMgPSBbJzE6MTInLCcyOjEyJywnMzoxMicsJzQ6MTInLCc1OjEyJywnNjoxMicsJzc6MTInLCc4OjEyJywnOToxMicsJzEwOjEyJywnMTE6MTInLCcxMjoxMiddO1xuc2V0dGluZ3MuaW5wdXRzLnJvb2YudHlwZSA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLnJvb2YudHlwZS5vcHRpb25zID0gWydHYWJsZScsJ1NoZWQnLCdIaXBwZWQnXTtcbnNldHRpbmdzLmlucHV0cy5tb2R1bGUgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5tb2R1bGUubWFrZSA9IHt9O1xuLy9zZXR0aW5ncy5pbnB1dHMubW9kdWxlLm1ha2Uub3B0aW9ucyA9IG51bGw7XG5zZXR0aW5ncy5pbnB1dHMubW9kdWxlLm1vZGVsID0ge307XG4vL3NldHRpbmdzLmlucHV0cy5tb2R1bGUubW9kZWwub3B0aW9ucyA9IG51bGw7XG5zZXR0aW5ncy5pbnB1dHMubW9kdWxlLm9yaWVudGF0aW9uID0ge307XG5zZXR0aW5ncy5pbnB1dHMubW9kdWxlLm9yaWVudGF0aW9uLm9wdGlvbnMgPSBbJ1BvcnRyYWl0JywnTGFuZHNjYXBlJ107XG5zZXR0aW5ncy5pbnB1dHMuYXJyYXkgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcub3B0aW9ucyA9IFsxLDIsMyw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxNywxOCwxOSwyMF07XG5zZXR0aW5ncy5pbnB1dHMuYXJyYXkubnVtX3N0cmluZ3MgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5hcnJheS5udW1fc3RyaW5ncy5vcHRpb25zID0gWzEsMiwzLDQsNSw2XTtcbnNldHRpbmdzLmlucHV0cy5EQyA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLkRDLmhvbWVfcnVuX2xlbmd0aCA9IHt9O1xuLy9zZXR0aW5ncy5pbnB1dHMuREMuaG9tZV9ydW5fbGVuZ3RoLm9wdGlvbnMgPSBbMjUsNTAsNzUsMTAwLDEyNSwxNTBdO1xuc2V0dGluZ3MuaW5wdXRzLkRDLmhvbWVfcnVuX2xlbmd0aC50eXBlID0gJ2lucHV0JztcbnNldHRpbmdzLmlucHV0cy5pbnZlcnRlciA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLmludmVydGVyLm1ha2UgPSB7fTtcbi8vc2V0dGluZ3MuaW5wdXRzLmludmVydGVyLm1ha2Uub3B0aW9ucyA9IG51bGw7XG5zZXR0aW5ncy5pbnB1dHMuaW52ZXJ0ZXIubW9kZWwgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5pbnZlcnRlci5sb2NhdGlvbiA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLmludmVydGVyLmxvY2F0aW9uLm9wdGlvbnMgPSBbJ0luc2lkZScsICdPdXRzaWRlJ107XG4vL3NldHRpbmdzLmlucHV0cy5pbnZlcnRlci5tb2RlbC5vcHRpb25zID0gbnVsbDtcbnNldHRpbmdzLmlucHV0cy5BQyA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXMgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzWycyNDBWJ10gPSB7fTtcbnNldHRpbmdzLmlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzWycyNDBWJ10gPSBbJzI0MFYnLCcxMjBWJ107XG5zZXR0aW5ncy5pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlc1snMjA4LzEyMFYnXSA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbJzIwOC8xMjBWJ10gPSBbJzIwOFYnLCcxMjBWJ107XG5zZXR0aW5ncy5pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlc1snNDgwLzI3N1YnXSA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbJzQ4MC8yNzdWJ10gPSBbJzQ4MFYgV3llJywnNDgwViBEZWx0YScsJzI3N1YnXTtcbnNldHRpbmdzLmlucHV0cy5BQy50eXBlID0ge307XG4vL3NldHRpbmdzLmlucHV0cy5BQy50eXBlLm9wdGlvbnMgPSBudWxsO1xuc2V0dGluZ3MuaW5wdXRzLkFDLmRpc3RhbmNlX3RvX2xvYWRjZW50ZXIgPSB7fTtcbi8vc2V0dGluZ3MuaW5wdXRzLkFDLmRpc3RhbmNlX3RvX2xvYWRjZW50ZXIub3B0aW9ucyA9IFszLDUsMTAsMTUsMjAsMzBdO1xuc2V0dGluZ3MuaW5wdXRzLkFDLmRpc3RhbmNlX3RvX2xvYWRjZW50ZXIudHlwZSA9ICdpbnB1dCc7XG5cblxuXG4vL3NldHRpbmdzLmlucHV0cyA9IHNldHRpbmdzLmlucHV0czsgLy8gY29weSBpbnB1dCByZWZlcmVuY2Ugd2l0aCBvcHRpb25zIHRvIGlucHV0c1xuLy9zZXR0aW5ncy5pbnB1dHMgPSBmLmJsYW5rX2NvcHkoc2V0dGluZ3MuaW5wdXRzKTsgLy8gbWFrZSBpbnB1dCBzZWN0aW9uIGJsYW5rXG4vL3NldHRpbmdzLnN5c3RlbV9mb3JtdWxhcyA9IHNldHRpbmdzLnN5c3RlbTsgLy8gY29weSBzeXN0ZW0gcmVmZXJlbmNlIHRvIHN5c3RlbV9mb3JtdWxhc1xuc2V0dGluZ3Muc3lzdGVtID0gZi5ibGFua19jb3B5KHNldHRpbmdzLmlucHV0cyk7IC8vIG1ha2Ugc3lzdGVtIHNlY3Rpb24gYmxhbmtcbi8vZi5tZXJnZV9vYmplY3RzKCBzZXR0aW5ncy5pbnB1dHMsIHNldHRpbmdzLnN5c3RlbSApO1xuXG5cbi8vIGxvYWQgbGF5ZXJzXG5cbnNldHRpbmdzLmRyYXdpbmcgPSB7fTtcblxuc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncyA9IHt9O1xuc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sYXllcl9hdHRyID0gcmVxdWlyZSgnLi9zZXR0aW5nc19sYXllcnMnKTtcbnNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MuZm9udHMgPSByZXF1aXJlKCcuL3NldHRpbmdzX2ZvbnRzJyk7XG5cbnNldHRpbmdzLmRyYXdpbmcuYmxvY2tzID0ge307XG5cbi8vIExvYWQgZHJhd2luZyBzcGVjaWZpYyBzZXR0aW5nc1xuLy8gVE9ETyBGaXggc2V0dGluZ3NfZHJhd2luZyB3aXRoIG5ldyB2YXJpYWJsZSBsb2NhdGlvbnNcbnZhciBzZXR0aW5nc19kcmF3aW5nID0gcmVxdWlyZSgnLi9zZXR0aW5nc19kcmF3aW5nJyk7XG5zZXR0aW5ncyA9IHNldHRpbmdzX2RyYXdpbmcoc2V0dGluZ3MpO1xuXG4vL3NldHRpbmdzLnN0YXRlX2FwcC52ZXJzaW9uX3N0cmluZyA9IHZlcnNpb25fc3RyaW5nO1xuXG4vL3NldHRpbmdzID0gZi5udWxsVG9PYmplY3Qoc2V0dGluZ3MpO1xuXG5zZXR0aW5ncy5zZWxlY3RfcmVnaXN0cnkgPSBbXTtcbnNldHRpbmdzLnZhbHVlX3JlZ2lzdHJ5ID0gW107XG5cblxuLy92YXIgY29uZmlnX29wdGlvbnMgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucyA9IHNldHRpbmdzLmNvbmZpZ19vcHRpb25zIHx8IHt9O1xuXG5zZXR0aW5ncy53ZWJwYWdlID0ge307XG5zZXR0aW5ncy53ZWJwYWdlLnNlbGVjdGlvbnNfbWFudWFsX3RvZ2dsZWQgPSB7fTtcbnNldHRpbmdzLndlYnBhZ2Uuc2VjdGlvbnMgPSBPYmplY3Qua2V5cyhzZXR0aW5ncy5pbnB1dHMpO1xuXG5cbnNldHRpbmdzLndlYnBhZ2Uuc2VjdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oc2VjdGlvbl9uYW1lKXtcbiAgICBzZXR0aW5ncy53ZWJwYWdlLnNlbGVjdGlvbnNfbWFudWFsX3RvZ2dsZWRbc2VjdGlvbl9uYW1lXSA9IGZhbHNlO1xufSk7XG5cbnNldHRpbmdzLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbCA9IDA7XG5zZXR0aW5ncy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXMgPSB7fTtcblxuXG5cblxuc2V0dGluZ3MuY29tcG9uZW50cyA9IHt9O1xuXG5cbi8qXG5mb3IoIHZhciBzZWN0aW9uX25hbWUgaW4gc2V0dGluZ3MuaW5wdXRzICl7XG4gICAgZm9yKCB2YXIgaW5wdXRfbmFtZSBpbiBzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXSl7XG4gICAgICAgIGlmKCB0eXBlb2Ygc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0gPT09ICdzdHJpbmcnICl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSlcbiAgICAgICAgICAgIFwib2JqX25hbWVzKHNldHR0aW5nc1wiICsgc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0gKyBcIilcIjtcbiAgICAgICAgICAgIC8vIGV2YWwgaXMgb25seSBiZWluZyB1c2VkIG9uIHN0cmluZ3MgZGVmaW5lZCBpbiB0aGUgc2V0dGluZ3MuanNvbiBmaWxlIHRoYXQgaXMgYnVpbHQgaW50byB0aGUgYXBwbGljYXRpb25cbiAgICAgICAgICAgIHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdID0gZXZhbChzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyovXG5cblxuLypcbnNldHRpbmdzLnN0YXRlLnNlY3Rpb25zID0ge1xuICAgIG1vZHVsZXM6IHt9LFxuICAgIGFycmF5OiB7fSxcbiAgICBEQzoge30sXG4gICAgaW52ZXJ0ZXI6IHt9LFxuICAgIEFDOiB7fSxcbn07XG5jb25maWdfb3B0aW9ucy5zZWN0aW9uX29wdGlvbnMgPSBvYmpfbmFtZXMoc2V0dGluZ3Muc3RhdGUuc2VjdGlvbnMpO1xuc2V0dGluZ3Muc3RhdGUuYWN0aXZlX3NlY3Rpb24gPSAnbW9kdWxlcyc7XG5cbmNvbmZpZ19vcHRpb25zLkFDX2xvYWRjZW50ZXJfdHlwZV9vcHRpb25zID0gb2JqX25hbWVzKCBjb25maWdfb3B0aW9ucy5BQ19sb2FkY2VudGVyX3R5cGVzICk7XG5jb25maWdfb3B0aW9ucy5BQ190eXBlX29wdGlvbnMgPSBvYmpfbmFtZXMoIGNvbmZpZ19vcHRpb25zLkFDX3R5cGVzICk7XG5cbmNvbmZpZ19vcHRpb25zLmludmVydGVycyA9IHt9O1xuXG5jb25maWdfb3B0aW9ucy5wYWdlX29wdGlvbnMgPSBbJ1BhZ2UgMSBvZiAxJ107XG5zZXR0aW5ncy5zdGF0ZS5hY3RpdmVfcGFnZSA9IGNvbmZpZ19vcHRpb25zLnBhZ2Vfb3B0aW9uc1swXTtcblxuc3lzdGVtLmludmVydGVyID0ge307XG5cblxuY29uZmlnX29wdGlvbnMuRENfaG9tZXJ1bl9sZW5ndGhzID0gY29uZmlnX29wdGlvbnMuRENfaG9tZXJ1bl9sZW5ndGhzIHx8IFsyNSw1MCw3NSwxMDBdO1xuY29uZmlnX29wdGlvbnMuRENfaG9tZXJ1bl9BV0dfb3B0aW9ucyA9XG4gICAgY29uZmlnX29wdGlvbnMuRENfaG9tZXJ1bl9BV0dfb3B0aW9ucyB8fFxuICAgIG9ial9uYW1lcyggY29uZmlnX29wdGlvbnMuTkVDX3RhYmxlc1tcIkNoIDkgVGFibGUgOCBDb25kdWN0b3IgUHJvcGVydGllc1wiXSApO1xuLy8qL1xuXG5cbm1vZHVsZS5leHBvcnRzID0gc2V0dGluZ3M7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gc2V0dGluZ3NfZHJhd2luZyhzZXR0aW5ncyl7XG5cbiAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuICAgIHZhciBzdGF0dXMgPSBzZXR0aW5ncy5zdGF0dXM7XG5cbiAgICAvLyBEcmF3aW5nIHNwZWNpZmljXG4gICAgLy9zZXR0aW5ncy5kcmF3aW5nID0gc2V0dGluZ3MuZHJhd2luZyB8fCB7fTtcblxuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUgPSB7fTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2MgPSB7fTtcblxuXG4gICAgLy8gc2l6ZXNcbiAgICBzaXplLmRyYXdpbmcgPSB7XG4gICAgICAgIHc6IDEwMDAsXG4gICAgICAgIGg6IDc4MCxcbiAgICAgICAgZnJhbWVfcGFkZGluZzogNSxcbiAgICAgICAgdGl0bGVib3g6IDUwLFxuICAgIH07XG5cbiAgICBzaXplLm1vZHVsZSA9IHt9O1xuICAgIHNpemUubW9kdWxlLmZyYW1lID0ge1xuICAgICAgICB3OiAxMCxcbiAgICAgICAgaDogMzAsXG4gICAgfTtcbiAgICBzaXplLm1vZHVsZS5sZWFkID0gc2l6ZS5tb2R1bGUuZnJhbWUudyoyLzM7XG4gICAgc2l6ZS5tb2R1bGUuaCA9IHNpemUubW9kdWxlLmZyYW1lLmggKyBzaXplLm1vZHVsZS5sZWFkKjI7XG4gICAgc2l6ZS5tb2R1bGUudyA9IHNpemUubW9kdWxlLmZyYW1lLnc7XG5cbiAgICBzaXplLndpcmVfb2Zmc2V0ID0ge1xuICAgICAgICBiYXNlOiA3LFxuICAgICAgICBnYXA6IHNpemUubW9kdWxlLncsXG4gICAgfTtcbiAgICBzaXplLndpcmVfb2Zmc2V0Lm1pbiA9IHNpemUud2lyZV9vZmZzZXQuYmFzZSAqIDE7XG5cbiAgICBzaXplLnN0cmluZyA9IHt9O1xuICAgIHNpemUuc3RyaW5nLmdhcCA9IHNpemUubW9kdWxlLmZyYW1lLncvNDI7XG4gICAgc2l6ZS5zdHJpbmcuZ2FwX21pc3NpbmcgPSBzaXplLm1vZHVsZS5oO1xuICAgIHNpemUuc3RyaW5nLncgPSBzaXplLm1vZHVsZS5mcmFtZS53ICogMi41O1xuXG4gICAgc2l6ZS50ZXJtaW5hbF9kaWFtID0gNTtcbiAgICBzaXplLmZ1c2UgPSB7fTtcbiAgICBzaXplLmZ1c2UudyA9IDE1O1xuICAgIHNpemUuZnVzZS5oID0gNDtcblxuXG4gICAgLy8gSW52ZXJ0ZXJcbiAgICBzaXplLmludmVydGVyID0geyB3OiAyNTAsIGg6IDE1MCB9O1xuICAgIHNpemUuaW52ZXJ0ZXIudGV4dF9nYXAgPSAxNTtcbiAgICBzaXplLmludmVydGVyLnN5bWJvbF93ID0gNTA7XG4gICAgc2l6ZS5pbnZlcnRlci5zeW1ib2xfaCA9IDI1O1xuXG4gICAgbG9jLmludmVydGVyID0ge1xuICAgICAgICB4OiBzaXplLmRyYXdpbmcudy8yLFxuICAgICAgICB5OiBzaXplLmRyYXdpbmcuaC8zLFxuICAgIH07XG4gICAgbG9jLmludmVydGVyLmJvdHRvbSA9IGxvYy5pbnZlcnRlci55ICsgc2l6ZS5pbnZlcnRlci5oLzI7XG4gICAgbG9jLmludmVydGVyLnRvcCA9IGxvYy5pbnZlcnRlci55IC0gc2l6ZS5pbnZlcnRlci5oLzI7XG4gICAgbG9jLmludmVydGVyLmJvdHRvbV9yaWdodCA9IHtcbiAgICAgICAgeDogbG9jLmludmVydGVyLnggKyBzaXplLmludmVydGVyLncvMixcbiAgICAgICAgeTogbG9jLmludmVydGVyLnkgKyBzaXplLmludmVydGVyLmgvMixcbiAgICB9O1xuXG4gICAgLy8gYXJyYXlcbiAgICBsb2MuYXJyYXkgPSB7XG4gICAgICAgIHg6IGxvYy5pbnZlcnRlci54IC0gMjAwLFxuICAgICAgICB1cHBlcjogbG9jLmludmVydGVyLnkgLSAyMCxcbiAgICB9O1xuICAgIC8vbG9jLmFycmF5LnVwcGVyID0gbG9jLmFycmF5LnkgLSBzaXplLnN0cmluZy5oLzI7XG4gICAgbG9jLmFycmF5LnJpZ2h0ID0gbG9jLmFycmF5LnggLSBzaXplLm1vZHVsZS5mcmFtZS5oKjM7XG5cblxuXG5cbiAgICBsb2MuREMgPSBsb2MuYXJyYXk7XG5cbiAgICAvLyBEQyBqYlxuICAgIHNpemUuamJfYm94ID0ge1xuICAgICAgICBoOiAxNTAsXG4gICAgICAgIHc6IDgwLFxuICAgIH07XG4gICAgbG9jLmpiX2JveCA9IHtcbiAgICAgICAgeDogMzUwLFxuICAgICAgICB5OiA1NTAsXG4gICAgfTtcblxuICAgIC8vIERDIGRpY29uZWN0XG4gICAgc2l6ZS5kaXNjYm94ID0ge1xuICAgICAgICB3OiAxNDAsXG4gICAgICAgIGg6IDUwLFxuICAgIH07XG4gICAgbG9jLmRpc2Nib3ggPSB7XG4gICAgICAgIHg6IGxvYy5pbnZlcnRlci54IC0gc2l6ZS5pbnZlcnRlci53LzIgKyBzaXplLmRpc2Nib3gudy8yLFxuICAgICAgICB5OiBsb2MuaW52ZXJ0ZXIueSArIHNpemUuaW52ZXJ0ZXIuaC8yICsgc2l6ZS5kaXNjYm94LmgvMiArIDEwLFxuICAgIH07XG5cbiAgICAvLyBBQyBkaWNvbmVjdFxuICAgIHNpemUuQUNfZGlzYyA9IHsgdzogODAsIGg6IDEyNSB9O1xuXG4gICAgbG9jLkFDX2Rpc2MgPSB7XG4gICAgICAgIHg6IGxvYy5pbnZlcnRlci54KzIwMCxcbiAgICAgICAgeTogbG9jLmludmVydGVyLnkrMjUwXG4gICAgfTtcbiAgICBsb2MuQUNfZGlzYy5ib3R0b20gPSBsb2MuQUNfZGlzYy55ICsgc2l6ZS5BQ19kaXNjLmgvMjtcbiAgICBsb2MuQUNfZGlzYy50b3AgPSBsb2MuQUNfZGlzYy55IC0gc2l6ZS5BQ19kaXNjLmgvMjtcbiAgICBsb2MuQUNfZGlzYy5sZWZ0ID0gbG9jLkFDX2Rpc2MueCAtIHNpemUuQUNfZGlzYy53LzI7XG4gICAgbG9jLkFDX2Rpc2Muc3dpdGNoX3RvcCA9IGxvYy5BQ19kaXNjLnRvcCArIDE1O1xuICAgIGxvYy5BQ19kaXNjLnN3aXRjaF9ib3R0b20gPSBsb2MuQUNfZGlzYy5zd2l0Y2hfdG9wICsgMzA7XG5cblxuICAgIC8vIEFDIHBhbmVsXG5cbiAgICBsb2MuQUNfbG9hZGNlbnRlciA9IHtcbiAgICAgICAgeDogbG9jLmludmVydGVyLngrMzUwLFxuICAgICAgICB5OiBsb2MuaW52ZXJ0ZXIueSsxMDBcbiAgICB9O1xuICAgIHNpemUuQUNfbG9hZGNlbnRlciA9IHsgdzogMTI1LCBoOiAzMDAgfTtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5sZWZ0ID0gbG9jLkFDX2xvYWRjZW50ZXIueCAtIHNpemUuQUNfbG9hZGNlbnRlci53LzI7XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIudG9wID0gbG9jLkFDX2xvYWRjZW50ZXIueSAtIHNpemUuQUNfbG9hZGNlbnRlci5oLzI7XG5cblxuICAgIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyID0geyB3OiAyMCwgaDogc2l6ZS50ZXJtaW5hbF9kaWFtLCB9O1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzID0ge1xuICAgICAgICBsZWZ0OiBsb2MuQUNfbG9hZGNlbnRlci54IC0gKCBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci53ICogMS4xICksXG4gICAgfTtcbiAgICBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMgPSB7XG4gICAgICAgIG51bTogMjAsXG4gICAgICAgIHNwYWNpbmc6IHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyLmggKyAxLFxuICAgIH07XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMudG9wID0gbG9jLkFDX2xvYWRjZW50ZXIudG9wICsgc2l6ZS5BQ19sb2FkY2VudGVyLmgvNTtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy5ib3R0b20gPSBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy50b3AgKyBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMuc3BhY2luZypzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMubnVtO1xuXG5cbiAgICBzaXplLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhciA9IHsgdzo1LCBoOjQwIH07XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhciA9IHtcbiAgICAgICAgeDogbG9jLkFDX2xvYWRjZW50ZXIubGVmdCArIDIwLFxuICAgICAgICB5OiBsb2MuQUNfbG9hZGNlbnRlci55ICsgc2l6ZS5BQ19sb2FkY2VudGVyLmgqMC4zXG4gICAgfTtcblxuICAgIHNpemUuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIgPSB7IHc6NDAsIGg6NSB9O1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhciA9IHtcbiAgICAgICAgeDogbG9jLkFDX2xvYWRjZW50ZXIueCArIDEwLFxuICAgICAgICB5OiBsb2MuQUNfbG9hZGNlbnRlci55ICsgc2l6ZS5BQ19sb2FkY2VudGVyLmgqMC40NVxuICAgIH07XG5cbiAgICBsb2MuQUNfY29uZHVpdCA9IHtcbiAgICAgICAgeTogbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMuYm90dG9tIC0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnNwYWNpbmcvMixcbiAgICB9O1xuXG5cbiAgICAvLyB3aXJlIHRhYmxlXG4gICAgbG9jLndpcmVfdGFibGUgPSB7XG4gICAgICAgIHg6IHNpemUuZHJhd2luZy53IC0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94IC0gc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmcqMyAtIDMyNSxcbiAgICAgICAgeTogc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmcqMyxcbiAgICB9O1xuXG4gICAgLy8gdm9sdGFnZSBkcm9wIHRhYmxlXG4gICAgc2l6ZS52b2x0X2Ryb3BfdGFibGUgPSB7fTtcbiAgICBzaXplLnZvbHRfZHJvcF90YWJsZS53ID0gMTUwO1xuICAgIHNpemUudm9sdF9kcm9wX3RhYmxlLmggPSAxMDA7XG4gICAgbG9jLnZvbHRfZHJvcF90YWJsZSA9IHt9O1xuICAgIGxvYy52b2x0X2Ryb3BfdGFibGUueCA9IHNpemUuZHJhd2luZy53IC0gc2l6ZS52b2x0X2Ryb3BfdGFibGUudy8yIC0gOTA7XG4gICAgbG9jLnZvbHRfZHJvcF90YWJsZS55ID0gc2l6ZS5kcmF3aW5nLmggLSBzaXplLnZvbHRfZHJvcF90YWJsZS5oLzIgLSAzMDtcblxuXG4gICAgLy8gdm9sdGFnZSBkcm9wIHRhYmxlXG4gICAgc2l6ZS5nZW5lcmFsX25vdGVzID0ge307XG4gICAgc2l6ZS5nZW5lcmFsX25vdGVzLncgPSAxNTA7XG4gICAgc2l6ZS5nZW5lcmFsX25vdGVzLmggPSAxMDA7XG4gICAgbG9jLmdlbmVyYWxfbm90ZXMgPSB7fTtcbiAgICBsb2MuZ2VuZXJhbF9ub3Rlcy54ID0gc2l6ZS5nZW5lcmFsX25vdGVzLncvMiArIDMwO1xuICAgIGxvYy5nZW5lcmFsX25vdGVzLnkgPSBzaXplLmdlbmVyYWxfbm90ZXMuaC8yICsgMzA7XG5cblxuXG5cbiAgICBzZXR0aW5ncy5wYWdlcyA9IHt9O1xuICAgIHNldHRpbmdzLnBhZ2VzLmxldHRlciA9IHtcbiAgICAgICAgdW5pdHM6ICdpbmNoZXMnLFxuICAgICAgICB3OiAxMS4wLFxuICAgICAgICBoOiA4LjUsXG4gICAgfTtcbiAgICBzZXR0aW5ncy5wYWdlID0gc2V0dGluZ3MucGFnZXMubGV0dGVyO1xuXG4gICAgc2V0dGluZ3MucGFnZXMuUERGID0ge1xuICAgICAgICB3OiBzZXR0aW5ncy5wYWdlLncgKiA3MixcbiAgICAgICAgaDogc2V0dGluZ3MucGFnZS5oICogNzIsXG4gICAgfTtcblxuICAgIHNldHRpbmdzLnBhZ2VzLlBERi5zY2FsZSA9IHtcbiAgICAgICAgeDogc2V0dGluZ3MucGFnZXMuUERGLncgLyBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy53LFxuICAgICAgICB5OiBzZXR0aW5ncy5wYWdlcy5QREYuaCAvIHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS5kcmF3aW5nLmgsXG4gICAgfTtcblxuICAgIGlmKCBzZXR0aW5ncy5wYWdlcy5QREYuc2NhbGUueCA8IHNldHRpbmdzLnBhZ2VzLlBERi5zY2FsZS55ICkge1xuICAgICAgICBzZXR0aW5ncy5wYWdlLnNjYWxlID0gc2V0dGluZ3MucGFnZXMuUERGLnNjYWxlLng7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2V0dGluZ3MucGFnZS5zY2FsZSA9IHNldHRpbmdzLnBhZ2VzLlBERi5zY2FsZS55O1xuICAgIH1cblxuXG4gICAgbG9jLnByZXZpZXcgPSBsb2MucHJldmlldyB8fCB7fTtcbiAgICBsb2MucHJldmlldy5hcnJheSA9IGxvYy5wcmV2aWV3LmFycmF5ID0ge307XG4gICAgbG9jLnByZXZpZXcuYXJyYXkudG9wID0gMTAwO1xuICAgIGxvYy5wcmV2aWV3LmFycmF5LmxlZnQgPSA1MDtcblxuICAgIGxvYy5wcmV2aWV3LkRDID0gbG9jLnByZXZpZXcuREMgPSB7fTtcbiAgICBsb2MucHJldmlldy5pbnZlcnRlciA9IGxvYy5wcmV2aWV3LmludmVydGVyID0ge307XG4gICAgbG9jLnByZXZpZXcuQUMgPSBsb2MucHJldmlldy5BQyA9IHt9O1xuXG4gICAgc2l6ZS5wcmV2aWV3ID0gc2l6ZS5wcmV2aWV3IHx8IHt9O1xuICAgIHNpemUucHJldmlldy5tb2R1bGUgPSB7XG4gICAgICAgIHc6IDE1LFxuICAgICAgICBoOiAyNSxcbiAgICB9O1xuICAgIHNpemUucHJldmlldy5EQyA9IHtcbiAgICAgICAgdzogMzAsXG4gICAgICAgIGg6IDUwLFxuICAgIH07XG4gICAgc2l6ZS5wcmV2aWV3LmludmVydGVyID0ge1xuICAgICAgICB3OiAxNTAsXG4gICAgICAgIGg6IDc1LFxuICAgIH07XG4gICAgc2l6ZS5wcmV2aWV3LkFDID0ge1xuICAgICAgICB3OiAzMCxcbiAgICAgICAgaDogNTAsXG4gICAgfTtcbiAgICBzaXplLnByZXZpZXcubG9hZGNlbnRlciA9IHtcbiAgICAgICAgdzogNTAsXG4gICAgICAgIGg6IDEwMCxcbiAgICB9O1xuXG5cblxuICByZXR1cm4gc2V0dGluZ3M7XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldHRpbmdzX2RyYXdpbmc7XG4iLCIvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduXG5pZiAoIU9iamVjdC5hc3NpZ24pIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdCwgXCJhc3NpZ25cIiwge1xuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogZnVuY3Rpb24odGFyZ2V0LCBmaXJzdFNvdXJjZSkge1xuICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQgfHwgdGFyZ2V0ID09PSBudWxsKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNvbnZlcnQgZmlyc3QgYXJndW1lbnQgdG8gb2JqZWN0XCIpO1xuICAgICAgdmFyIHRvID0gT2JqZWN0KHRhcmdldCk7XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbmV4dFNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaWYgKG5leHRTb3VyY2UgPT09IHVuZGVmaW5lZCB8fCBuZXh0U291cmNlID09PSBudWxsKSBjb250aW51ZTtcbiAgICAgICAgdmFyIGtleXNBcnJheSA9IE9iamVjdC5rZXlzKE9iamVjdChuZXh0U291cmNlKSk7XG4gICAgICAgIGZvciAodmFyIG5leHRJbmRleCA9IDAsIGxlbiA9IGtleXNBcnJheS5sZW5ndGg7IG5leHRJbmRleCA8IGxlbjsgbmV4dEluZGV4KyspIHtcbiAgICAgICAgICB2YXIgbmV4dEtleSA9IGtleXNBcnJheVtuZXh0SW5kZXhdO1xuICAgICAgICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihuZXh0U291cmNlLCBuZXh0S2V5KTtcbiAgICAgICAgICBpZiAoZGVzYyAhPT0gdW5kZWZpbmVkICYmIGRlc2MuZW51bWVyYWJsZSkgdG9bbmV4dEtleV0gPSBuZXh0U291cmNlW25leHRLZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdG87XG4gICAgfVxuICB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy9cbi8vIGZvbnRzXG5cbnZhciBmb250cyA9IHt9O1xuXG5mb250c1snc2lnbnMnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDUsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5mb250c1snbGFiZWwnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDEyLFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ21pZGRsZScsXG59O1xuZm9udHNbJ3RpdGxlMSddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTQsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbGVmdCcsXG59O1xuZm9udHNbJ3RpdGxlMiddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTIsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbGVmdCcsXG59O1xuZm9udHNbJ3BhZ2UnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDIwLFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ21pZGRsZScsXG59O1xuZm9udHNbJ3RhYmxlJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ3NlcmlmJyxcbiAgICAnZm9udC1zaXplJzogICAgIDgsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5mb250c1sndGFibGVfbGVmdCddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdzZXJpZicsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICA4LFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ2xlZnQnLFxufTtcbmZvbnRzWyd0YWJsZV9sYXJnZV9sZWZ0J10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAxNCxcbiAgICAndGV4dC1hbmNob3InOiAgICdsZWZ0Jyxcbn07XG5mb250c1sndGFibGVfbGFyZ2UnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDE0LFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ21pZGRsZScsXG59O1xuZm9udHNbJ3Byb2plY3QgdGl0bGUnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDE2LFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ21pZGRsZScsXG59O1xuZm9udHNbJ3ByZXZpZXcgdGV4dCddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnICA6IDIwLFxuICAgICd0ZXh0LWFuY2hvcic6ICdtaWRkbGUnLFxufTtcbmZvbnRzWydkaW1lbnRpb24nXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJyAgOiAyMCxcbiAgICAndGV4dC1hbmNob3InOiAnbWlkZGxlJyxcbn07XG5cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmb250cztcbiIsIi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ25cbmlmICghT2JqZWN0LmFzc2lnbikge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0LCBcImFzc2lnblwiLCB7XG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiBmdW5jdGlvbih0YXJnZXQsIGZpcnN0U291cmNlKSB7XG4gICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY29udmVydCBmaXJzdCBhcmd1bWVudCB0byBvYmplY3RcIik7XG4gICAgICB2YXIgdG8gPSBPYmplY3QodGFyZ2V0KTtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBuZXh0U291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBpZiAobmV4dFNvdXJjZSA9PT0gdW5kZWZpbmVkIHx8IG5leHRTb3VyY2UgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgICAgICB2YXIga2V5c0FycmF5ID0gT2JqZWN0LmtleXMoT2JqZWN0KG5leHRTb3VyY2UpKTtcbiAgICAgICAgZm9yICh2YXIgbmV4dEluZGV4ID0gMCwgbGVuID0ga2V5c0FycmF5Lmxlbmd0aDsgbmV4dEluZGV4IDwgbGVuOyBuZXh0SW5kZXgrKykge1xuICAgICAgICAgIHZhciBuZXh0S2V5ID0ga2V5c0FycmF5W25leHRJbmRleF07XG4gICAgICAgICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG5leHRTb3VyY2UsIG5leHRLZXkpO1xuICAgICAgICAgIGlmIChkZXNjICE9PSB1bmRlZmluZWQgJiYgZGVzYy5lbnVtZXJhYmxlKSB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0bztcbiAgICB9XG4gIH0pO1xufVxuXG5cbnZhciBsYXllcl9hdHRyID0ge307XG5cbmxheWVyX2F0dHIuYmFzZSA9IHtcbiAgICAnZmlsbCc6ICdub25lJyxcbiAgICAnc3Ryb2tlJzonIzAwMDAwMCcsXG4gICAgJ3N0cm9rZS13aWR0aCc6JzFweCcsXG4gICAgJ3N0cm9rZS1saW5lY2FwJzonYnV0dCcsXG4gICAgJ3N0cm9rZS1saW5lam9pbic6J21pdGVyJyxcbiAgICAnc3Ryb2tlLW9wYWNpdHknOjEsXG5cbn07XG5sYXllcl9hdHRyLmJsb2NrID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5mcmFtZSA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuZnJhbWUuc3Ryb2tlID0gJyMwMDAwNDInO1xubGF5ZXJfYXR0ci50YWJsZSA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIudGFibGUuc3Ryb2tlID0gJyMwMDAwMDAnO1xuXG5sYXllcl9hdHRyLkRDX2ludGVybW9kdWxlID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSkse1xuICAgIHN0cm9rZTogJyNiZWJlYmUnLFxuICAgIFwic3Ryb2tlLWRhc2hhcnJheVwiOiBcIjEsIDFcIixcblxuXG59KTtcblxubGF5ZXJfYXR0ci5EQ19wb3MgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkRDX3Bvcy5zdHJva2UgPSAnI2ZmMDAwMCc7XG5sYXllcl9hdHRyLkRDX25lZyA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuRENfbmVnLnN0cm9rZSA9ICcjMDAwMDAwJztcbmxheWVyX2F0dHIuRENfZ3JvdW5kID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5EQ19ncm91bmQuc3Ryb2tlID0gJyMwMDY2MDAnO1xubGF5ZXJfYXR0ci5tb2R1bGUgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLmJveCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcblxuXG5cbmxheWVyX2F0dHIudGV4dCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIudGV4dC5zdHJva2UgPSAnIzAwMDBmZic7XG5sYXllcl9hdHRyLnRlcm1pbmFsID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5ib3JkZXIgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5cbmxheWVyX2F0dHIuQUNfZ3JvdW5kID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5BQ19ncm91bmQuc3Ryb2tlID0gJyMwMDk5MDAnO1xubGF5ZXJfYXR0ci5BQ19uZXV0cmFsID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5BQ19uZXV0cmFsLnN0cm9rZSA9ICcjOTk5Nzk3JztcbmxheWVyX2F0dHIuQUNfTDEgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkFDX0wxLnN0cm9rZSA9ICcjMDAwMDAwJztcbmxheWVyX2F0dHIuQUNfTDIgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkFDX0wyLnN0cm9rZSA9ICcjRkYwMDAwJztcbmxheWVyX2F0dHIuQUNfTDMgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkFDX0wzLnN0cm9rZSA9ICcjMDAwMEZGJztcblxuXG5sYXllcl9hdHRyLnByZXZpZXcgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKSx7XG4gICAgJ3N0cm9rZS13aWR0aCc6ICcyJyxcbn0pO1xuXG5sYXllcl9hdHRyLnByZXZpZXdfbW9kdWxlID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjZmZiMzAwJyxcbiAgICBzdHJva2U6ICdub25lJyxcbn0pO1xuXG5sYXllcl9hdHRyLnByZXZpZXdfYXJyYXkgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgc3Ryb2tlOiAnI2ZmNWQwMCcsXG59KTtcblxubGF5ZXJfYXR0ci5wcmV2aWV3X0RDID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIHN0cm9rZTogJyNiMDkyYzQnLFxufSk7XG5sYXllcl9hdHRyLnByZXZpZXdfRENfYm94ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjYjA5MmM0JyxcbiAgICBzdHJva2U6ICdub25lJyxcbn0pO1xuXG5sYXllcl9hdHRyLnByZXZpZXdfaW52ZXJ0ZXIgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgc3Ryb2tlOicjODZjOTc0Jyxcbn0pO1xubGF5ZXJfYXR0ci5wcmV2aWV3X2ludmVydGVyX2JveCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnIzg2Yzk3NCcsXG4gICAgc3Ryb2tlOiAnbm9uZScsXG59KTtcblxubGF5ZXJfYXR0ci5wcmV2aWV3X0FDID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIHN0cm9rZTogJyM4MTg4YTEnLFxufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19BQ19ib3ggPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyM4MTg4YTEnLFxuICAgIHN0cm9rZTogJ25vbmUnLFxufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIHN0cm9rZTogJyMwMDAwMDAnLFxufSk7XG5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbF9kb3QgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgc3Ryb2tlOiAnIzAwMDAwMCcsXG4gICAgXCJzdHJva2UtZGFzaGFycmF5XCI6IFwiNSwgNVwiXG59KTtcbmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX3BvbHlfdW5zZWxlY3RlZCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnI2UxZTFlMScsXG4gICAgc3Ryb2tlOiAnbm9uZSdcbn0pO1xubGF5ZXJfYXR0ci5wcmV2aWV3X3N0cnVjdHVyYWxfcG9seV9zZWxlY3RlZCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnI2ZmZTdjYicsXG4gICAgc3Ryb2tlOiAnbm9uZSdcbn0pO1xubGF5ZXJfYXR0ci5wcmV2aWV3X3N0cnVjdHVyYWxfcG9seV9zZWxlY3RlZF9mcmFtZWQgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyNmZmU3Y2InLFxuICAgIHN0cm9rZTogJyMwMDAwMDAnXG59KTtcblxubGF5ZXJfYXR0ci5wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjZmZmZmZmJyxcbiAgICBzdHJva2U6ICdub25lJ1xufSk7XG5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWQgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyM4Mzk3ZTgnLFxuICAgIHN0cm9rZTogJyNkZmZhZmYnXG59KTtcblxubGF5ZXJfYXR0ci5ub3J0aF9hcnJvdyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6ICcjMDAwMDAwJyxcbiAgICAnc3Ryb2tlLXdpZHRoJzogMSxcbiAgICAnc3Ryb2tlLWxpbmVjYXAnOiBcInJvdW5kXCIsXG4gICAgJ3N0cm9rZS1saW5lam9pbic6IFwicm91bmRcIixcbn0pO1xubGF5ZXJfYXR0ci5ub3J0aF9sZXR0ZXIgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgc3Ryb2tlOiAnIzk0OTQ5NCcsXG4gICAgJ3N0cm9rZS13aWR0aCc6IDUsXG4gICAgJ3N0cm9rZS1saW5lY2FwJzogXCJyb3VuZFwiLFxuICAgICdzdHJva2UtbGluZWpvaW4nOiBcInJvdW5kXCIsXG59KTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyX2F0dHI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBrID0gcmVxdWlyZSgnLi4vbGliL2svay5qcycpO1xudmFyIGYgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucycpO1xuLy92YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xuLy92YXIgZGlzcGxheV9zdmcgPSByZXF1aXJlKCcuL2Rpc3BsYXlfc3ZnJyk7XG5cbnZhciBvYmplY3RfZGVmaW5lZCA9IGYub2JqZWN0X2RlZmluZWQ7XG5cbnZhciBzZXR0aW5nc191cGRhdGUgPSBmdW5jdGlvbihzZXR0aW5ncykge1xuXG4gICAgLy9jb25zb2xlLmxvZygnLS0tc2V0dGluZ3MtLS0nLCBzZXR0aW5ncyk7XG4gICAgdmFyIGNvbmZpZ19vcHRpb25zID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnM7XG4gICAgdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIHN0YXRlID0gc2V0dGluZ3Muc3RhdGU7XG5cbiAgICB2YXIgaW5wdXRzID0gc2V0dGluZ3MuaW5wdXRzO1xuXG5cblxuXG5cbiAgICBpZiggc3RhdGUuZGF0YWJhc2VfbG9hZGVkICl7XG4gICAgICAgIGlucHV0cy5EQyA9IHNldHRpbmdzLmlucHV0cy5EQyB8fCB7fTtcbiAgICAgICAgaW5wdXRzLkRDLndpcmVfc2l6ZSA9IHNldHRpbmdzLmlucHV0cy5EQy53aXJlX3NpemUgfHwge307XG4gICAgICAgIGlucHV0cy5EQy53aXJlX3NpemUub3B0aW9ucyA9IGlucHV0cy5EQy53aXJlX3NpemUub3B0aW9ucyB8fCBrLm9ial9uYW1lcyhzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5ORUNfdGFibGVzWydDaCA5IFRhYmxlIDggQ29uZHVjdG9yIFByb3BlcnRpZXMnXSk7XG5cblxuICAgIH1cblxuICAgIC8vdmFyIHNob3dfZGVmYXVsdHMgPSBmYWxzZTtcbiAgICAvLy8qXG4gICAgaWYoIHN0YXRlLm1vZGUgPT09ICdkZXYnKXtcbiAgICAgICAgLy9zaG93X2RlZmF1bHRzID0gdHJ1ZTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnRGV2IG1vZGUgLSBkZWZhdWx0cyBvbicpO1xuXG4gICAgICAgIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyA9IHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyB8fCA0O1xuICAgICAgICBzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nID0gc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZyB8fCA2O1xuICAgICAgICBzeXN0ZW0uREMuaG9tZV9ydW5fbGVuZ3RoID0gc3lzdGVtLkRDLmhvbWVfcnVuX2xlbmd0aCB8fCA1MDtcblxuICAgICAgICBzeXN0ZW0ucm9vZi53aWR0aCAgPSBzeXN0ZW0ucm9vZi53aWR0aCB8fCA2MDtcbiAgICAgICAgc3lzdGVtLnJvb2YubGVuZ3RoID0gc3lzdGVtLnJvb2YubGVuZ3RoIHx8IDI1O1xuICAgICAgICBzeXN0ZW0ucm9vZi5zbG9wZSAgPSBzeXN0ZW0ucm9vZi5zbG9wZSB8fCBcIjY6MTJcIjtcbiAgICAgICAgc3lzdGVtLnJvb2YudHlwZSA9IHN5c3RlbS5yb29mLnR5cGUgfHwgXCJHYWJsZVwiO1xuXG4gICAgICAgIHN5c3RlbS5pbnZlcnRlci5sb2NhdGlvbiA9IHN5c3RlbS5pbnZlcnRlci5sb2NhdGlvbiAgfHwgXCJJbnNpZGVcIjtcblxuICAgICAgICBzeXN0ZW0ubW9kdWxlLm9yaWVudGF0aW9uID0gc3lzdGVtLm1vZHVsZS5vcmllbnRhdGlvbiB8fCBcIlBvcnRyYWl0XCI7XG5cblxuICAgICAgICBpZiggc3RhdGUuZGF0YWJhc2VfbG9hZGVkICl7XG4gICAgICAgICAgICBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSA9IHN5c3RlbS5pbnZlcnRlci5tYWtlIHx8XG4gICAgICAgICAgICAgICAgJ1NNQSc7XG4gICAgICAgICAgICBzeXN0ZW0uaW52ZXJ0ZXIubW9kZWwgPSBzeXN0ZW0uaW52ZXJ0ZXIubW9kZWwgfHxcbiAgICAgICAgICAgICAgICAnU0kzMDAwJztcblxuICAgICAgICAgICAgc3lzdGVtLm1vZHVsZS5tYWtlID0gc3lzdGVtLm1vZHVsZS5tYWtlIHx8XG4gICAgICAgICAgICAgICAgZi5vYmpfbmFtZXMoIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlcyApWzBdO1xuICAgICAgICAgICAgLy9pZiggc3lzdGVtLm1vZHVsZS5tYWtlKSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVNb2RlbEFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZXNbc3lzdGVtLm1vZHVsZS5tYWtlXSk7XG4gICAgICAgICAgICBzeXN0ZW0ubW9kdWxlLm1vZGVsID0gc3lzdGVtLm1vZHVsZS5tb2RlbCB8fFxuICAgICAgICAgICAgICAgIGYub2JqX25hbWVzKCBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbc3lzdGVtLm1vZHVsZS5tYWtlXSApWzBdO1xuXG5cbiAgICAgICAgICAgIHN5c3RlbS5tb2R1bGUubW9kZWwgPSBzeXN0ZW0ubW9kdWxlLm1vZGVsIHx8XG4gICAgICAgICAgICAgICAgZi5vYmpfbmFtZXMoIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tzeXN0ZW0ubW9kdWxlLm1ha2VdIClbMF07XG5cbiAgICAgICAgICAgIHN5c3RlbS5BQy5sb2FkY2VudGVyX3R5cGVzID0gc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXMgfHxcbiAgICAgICAgICAgIC8vICAgIGYub2JqX25hbWVzKGlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzKVswXTtcbiAgICAgICAgICAgICAgICAnNDgwLzI3N1YnO1xuXG5cbiAgICAgICAgICAgIHN5c3RlbS5BQy50eXBlID0gc3lzdGVtLkFDLnR5cGUgfHwgJzQ4MFYgV3llJztcbiAgICAgICAgICAgIC8vc3lzdGVtLkFDLnR5cGUgPSBzeXN0ZW0uQUMudHlwZSB8fFxuICAgICAgICAgICAgLy8gICAgc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXNbc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXNdWzBdO1xuXG4gICAgICAgICAgICBzeXN0ZW0uQUMuZGlzdGFuY2VfdG9fbG9hZGNlbnRlciA9IHN5c3RlbS5BQy5kaXN0YW5jZV90b19sb2FkY2VudGVyIHx8XG4gICAgICAgICAgICAgICAgNTA7XG5cblxuICAgICAgICAgICAgc3lzdGVtLkRDLndpcmVfc2l6ZSA9IGlucHV0cy5EQy53aXJlX3NpemUub3B0aW9uc1szXTtcbiAgICAgICAgICAgIC8qXG5cbiAgICAgICAgICAgIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyTWFrZUFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVycyk7XG4gICAgICAgICAgICBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSA9IHN5c3RlbS5pbnZlcnRlci5tYWtlIHx8IE9iamVjdC5rZXlzKCBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnMgKVswXTtcbiAgICAgICAgICAgIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyTW9kZWxBcnJheSA9IGsub2JqSWRBcnJheShzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnNbc3lzdGVtLmludmVydGVyLm1ha2VdKTtcblxuICAgICAgICAgICAgc3lzdGVtLkFDX2xvYWRjZW50ZXJfdHlwZSA9IHN5c3RlbS5BQ19sb2FkY2VudGVyX3R5cGUgfHwgY29uZmlnX29wdGlvbnMuQUNfbG9hZGNlbnRlcl90eXBlX29wdGlvbnNbMF07XG4gICAgICAgICAgICAvLyovXG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8qL1xuXG5cbiAgICAvL2NvbnNvbGUubG9nKFwic2V0dGluZ3NfdXBkYXRlXCIpO1xuICAgIC8vY29uc29sZS5sb2coc3lzdGVtLm1vZHVsZS5tYWtlKTtcblxuICAgIGlucHV0cy5tb2R1bGUubWFrZS5vcHRpb25zID0gay5vYmpfbmFtZXMoc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzKTtcbiAgICBpZiggc3lzdGVtLm1vZHVsZS5tYWtlICkge1xuICAgICAgICBpbnB1dHMubW9kdWxlLm1vZGVsLm9wdGlvbnMgID0gay5vYmpfbmFtZXMoIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tzeXN0ZW0ubW9kdWxlLm1ha2VdICk7XG4gICAgfVxuXG4gICAgaWYoIHN5c3RlbS5tb2R1bGUubW9kZWwgKSB7XG4gICAgICAgIHZhciBzcGVjcyA9IHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tzeXN0ZW0ubW9kdWxlLm1ha2VdW3N5c3RlbS5tb2R1bGUubW9kZWxdO1xuICAgICAgICBmb3IoIHZhciBzcGVjX25hbWUgaW4gc3BlY3MgKXtcbiAgICAgICAgICAgIGlmKCBzcGVjX25hbWUgIT09ICdtb2R1bGVfaWQnICl7XG4gICAgICAgICAgICAgICAgc3lzdGVtLm1vZHVsZVtzcGVjX25hbWVdID0gc3BlY3Nbc3BlY19uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL3N5c3RlbS5tb2R1bGUuc3BlY3MgPSBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbc3lzdGVtLm1vZHVsZS5tYWtlXVtzeXN0ZW0ubW9kdWxlLm1vZGVsXTtcbiAgICB9XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ2FycmF5JykgJiYgZi5zZWN0aW9uX2RlZmluZWQoJ21vZHVsZScpICl7XG4gICAgICAgIHN5c3RlbS5hcnJheSA9IHN5c3RlbS5hcnJheSB8fCB7fTtcbiAgICAgICAgc3lzdGVtLmFycmF5LmlzYyA9IHN5c3RlbS5tb2R1bGUuaXNjICogc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzO1xuICAgICAgICBzeXN0ZW0uYXJyYXkudm9jID0gc3lzdGVtLm1vZHVsZS52b2MgKiBzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nO1xuICAgICAgICBzeXN0ZW0uYXJyYXkuaW1wID0gc3lzdGVtLm1vZHVsZS5pbXAgKiBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3M7XG4gICAgICAgIHN5c3RlbS5hcnJheS52bXAgPSBzeXN0ZW0ubW9kdWxlLnZtcCAqIHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmc7XG4gICAgICAgIHN5c3RlbS5hcnJheS5wbXAgPSBzeXN0ZW0uYXJyYXkudm1wICAqIHN5c3RlbS5hcnJheS5pbXA7XG5cbiAgICAgICAgc3lzdGVtLmFycmF5Lm51bWJlcl9vZl9tb2R1bGVzID0gc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZyAqIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncztcblxuXG4gICAgfVxuXG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ0RDJykgKXtcblxuICAgICAgICBzeXN0ZW0uREMud2lyZV9zaXplID0gXCItVW5kZWZpbmVkLVwiO1xuXG4gICAgfVxuXG4gICAgaW5wdXRzLmludmVydGVyLm1ha2Uub3B0aW9ucyA9IGsub2JqX25hbWVzKHNldHRpbmdzLmNvbXBvbmVudHMuaW52ZXJ0ZXJzKTtcbiAgICBpZiggc3lzdGVtLmludmVydGVyLm1ha2UgKSB7XG4gICAgICAgIGlucHV0cy5pbnZlcnRlci5tb2RlbC5vcHRpb25zID0gay5vYmpfbmFtZXMoIHNldHRpbmdzLmNvbXBvbmVudHMuaW52ZXJ0ZXJzW3N5c3RlbS5pbnZlcnRlci5tYWtlXSApO1xuICAgIH1cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ2ludmVydGVyJykgKXtcblxuICAgIH1cblxuICAgIC8vaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZSA9IHNldHRpbmdzLmYub2JqX25hbWVzKGlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzKTtcbiAgICBpZiggc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXMgKSB7XG4gICAgICAgIHZhciBsb2FkY2VudGVyX3R5cGUgPSBzeXN0ZW0uQUMubG9hZGNlbnRlcl90eXBlcztcbiAgICAgICAgdmFyIEFDX29wdGlvbnMgPSBpbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlc1tsb2FkY2VudGVyX3R5cGVdO1xuICAgICAgICBpbnB1dHMuQUMudHlwZS5vcHRpb25zID0gQUNfb3B0aW9ucztcbiAgICAgICAgLy9pbi5vcHQuQUMudHlwZXNbbG9hZGNlbnRlcl90eXBlXTtcblxuICAgICAgICAvL2lucHV0cy5BQ1sndHlwZSddID0gay5vYmpfbmFtZXMoIHNldHRpbmdzLmluLm9wdC5BQy50eXBlICk7XG4gICAgfVxuICAgIGlmKCBzeXN0ZW0uQUMudHlwZSApIHtcbiAgICAgICAgc3lzdGVtLkFDLmNvbmR1Y3RvcnMgPSBzZXR0aW5ncy5pbi5vcHQuQUMudHlwZXNbc3lzdGVtLkFDLnR5cGVdO1xuICAgICAgICBzeXN0ZW0uQUMubnVtX2NvbmR1Y3RvcnMgPSBzeXN0ZW0uQUMuY29uZHVjdG9ycy5sZW5ndGg7XG5cbiAgICB9XG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdBQycpICl7XG5cbiAgICAgICAgc3lzdGVtLkFDLndpcmVfc2l6ZSA9IFwiLVVuZGVmaW5lZC1cIjtcbiAgICB9XG5cbiAgICBzaXplLndpcmVfb2Zmc2V0Lm1heCA9IHNpemUud2lyZV9vZmZzZXQubWluICsgc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzICogc2l6ZS53aXJlX29mZnNldC5iYXNlO1xuICAgIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kID0gc2l6ZS53aXJlX29mZnNldC5tYXggKyBzaXplLndpcmVfb2Zmc2V0LmJhc2UqMTtcbiAgICBsb2MuYXJyYXkubGVmdCA9IGxvYy5hcnJheS5yaWdodCAtICggc2l6ZS5zdHJpbmcudyAqIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyApIC0gKCBzaXplLm1vZHVsZS5mcmFtZS53KjMvNCApIDtcblxuXG5cblxuXG5cblxuXG5cbiAgICAvKlxuICAgIC8vc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLndpcmVfdGFibGUuaCA9IChzeXN0ZW0uQUMubnVtX2NvbmR1Y3RvcnMrMykgKiBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUud2lyZV90YWJsZS5yb3dfaDtcbiAgICBmb3IoIHZhciBzZWN0aW9uX25hbWUgaW4gaW5wdXRzICl7XG4gICAgICAgIGZvciggdmFyIGlucHV0X25hbWUgaW4gc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV0gKXtcbiAgICAgICAgICAgIGlmKCB0eXBlb2Ygc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0gPT09ICdzdHJpbmcnICl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdICk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIGsub2JqX25hbWVzKFxuICAgICAgICAgICAgICAgICAgICBmLmdldF9yZWYoc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0sIHNldHRpbmdzKVxuICAgICAgICAgICAgICAgICkpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRvX2V2YWwgPSBcImsub2JqX25hbWVzKHNldHR0aW5ncy5cIiArIHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codG9fZXZhbCk7XG4gICAgICAgICAgICAgICAgLy8gZXZhbCBpcyBvbmx5IGJlaW5nIHVzZWQgb24gc3RyaW5ncyBkZWZpbmVkIGluIHRoZSBzZXR0aW5ncy5qc29uIGZpbGUgdGhhdCBpcyBidWlsdCBpbnRvIHRoZSBhcHBsaWNhdGlvblxuICAgICAgICAgICAgICAgIC8qIGpzaGludCBldmlsOnRydWUgLy8qL1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IExvb2sgZm9yIGFsdGVybmF0aXZlIHNvbHV0aW9ucyB0aGF0IGlzIG1vcmUgdW5pdmVyc2FsLlxuICAgICAgICAgICAgICAgIC8vIGh0dHA6Ly9wZXJmZWN0aW9ua2lsbHMuY29tL2dsb2JhbC1ldmFsLXdoYXQtYXJlLXRoZS1vcHRpb25zLyNpbmRpcmVjdF9ldmFsX2NhbGxfZXhhbXBsZXNcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgIHZhciBlID0gZXZhbDsgLy8gVGhpcyBhbGxvd3MgZXZhbCB0byBiZSBjYWxsZWQgaW5kaXJlY3RseSwgdHJpZ2dlcmluZyBhIGdsb2JhbCBjYWxsIGluIG1vZGVybiBicm93c2Vycy5cbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSA9IGUodG9fZXZhbCk7XG4gICAgICAgICAgICAgICAgLyoganNoaW50IGV2aWw6ZmFsc2UgLy8qL1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyovXG5cbn07XG5cbi8qXG5cbiAgICBpZiggc3RhdGUuZGF0YV9sb2FkZWQgKSB7XG5cbiAgICAgICAgLy9zeXN0ZW0uREMubnVtX3N0cmluZ3MgPSBzZXR0aW5ncy5zeXN0ZW0ubnVtX3N0cmluZ3M7XG4gICAgICAgIC8vc3lzdGVtLkRDLm51bV9tb2R1bGUgPSBzZXR0aW5ncy5zeXN0ZW0ubnVtX21vZHVsZTtcbiAgICAgICAgLy9pZiggc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlcyAhPT0gdW5kZWZpbmVkICl7XG5cbiAgICAgICAgdmFyIG9sZF9hY3RpdmVfc2VjdGlvbiA9IHN0YXRlLmFjdGl2ZV9zZWN0aW9uO1xuXG4gICAgICAgIC8vIE1vZHVsZXNcbiAgICAgICAgaWYoIHRydWUgKXtcbiAgICAgICAgICAgIGYub2JqZWN0X2RlZmluZWQoc3lzdGVtLkRDLm1vZHVsZSk7XG5cbiAgICAgICAgICAgIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZU1ha2VBcnJheSA9IGsub2JqSWRBcnJheShzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVzKTtcbiAgICAgICAgICAgIGlmKCBzeXN0ZW0uREMubW9kdWxlLm1ha2UgKSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVNb2RlbEFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZXNbc3lzdGVtLkRDLm1vZHVsZS5tYWtlXSk7XG4gICAgICAgICAgICBpZiggc3lzdGVtLkRDLm1vZHVsZS5tb2RlbCApIHN5c3RlbS5EQy5tb2R1bGUuc3BlY3MgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVzW3N5c3RlbS5EQy5tb2R1bGUubWFrZV1bc3lzdGVtLkRDLm1vZHVsZS5tb2RlbF07XG5cbiAgICAgICAgICAgIHN0YXRlLmFjdGl2ZV9zZWN0aW9uID0gJ2FycmF5JztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFycmF5XG4gICAgICAgIGlmKCBvYmplY3RfZGVmaW5lZChpbnB1dC5tb2R1bGUpICkge1xuICAgICAgICAgICAgLy9zeXN0ZW0ubW9kdWxlID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlc1tzZXR0aW5ncy5mLm1vZHVsZV07XG4gICAgICAgICAgICBpZiggc3lzdGVtLkRDLm1vZHVsZS5zcGVjcyApe1xuICAgICAgICAgICAgICAgIHN5c3RlbS5EQy5hcnJheSA9IHt9O1xuICAgICAgICAgICAgICAgIHN5c3RlbS5EQy5hcnJheS5Jc2MgPSBzeXN0ZW0uREMubW9kdWxlLnNwZWNzLklzYyAqIHN5c3RlbS5EQy5udW1fc3RyaW5ncztcbiAgICAgICAgICAgICAgICBzeXN0ZW0uREMuYXJyYXkuVm9jID0gc3lzdGVtLkRDLm1vZHVsZS5zcGVjcy5Wb2MgKiBzeXN0ZW0uREMuc3RyaW5nX21vZHVsZXM7XG4gICAgICAgICAgICAgICAgc3lzdGVtLkRDLmFycmF5LkltcCA9IHN5c3RlbS5EQy5tb2R1bGUuc3BlY3MuSW1wICogc3lzdGVtLkRDLm51bV9zdHJpbmdzO1xuICAgICAgICAgICAgICAgIHN5c3RlbS5EQy5hcnJheS5WbXAgPSBzeXN0ZW0uREMubW9kdWxlLnNwZWNzLlZtcCAqIHN5c3RlbS5EQy5zdHJpbmdfbW9kdWxlcztcbiAgICAgICAgICAgICAgICBzeXN0ZW0uREMuYXJyYXkuUG1wID0gc3lzdGVtLkRDLmFycmF5LlZtcCAqIHN5c3RlbS5EQy5hcnJheS5JbXA7XG5cbiAgICAgICAgICAgICAgICBzdGF0ZS5hY3RpdmVfc2VjdGlvbiA9ICdEQyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIERDXG4gICAgICAgICAgICBpZiggb2JqZWN0X2RlZmluZWQoaW5wdXRzLkRDKSApIHtcblxuICAgICAgICAgICAgICAgIHN5c3RlbS5EQy5ob21lcnVuLnJlc2lzdGFuY2UgPSBjb25maWdfb3B0aW9ucy5ORUNfdGFibGVzWydDaCA5IFRhYmxlIDggQ29uZHVjdG9yIFByb3BlcnRpZXMnXVtzeXN0ZW0uREMuaG9tZXJ1bi5BV0ddO1xuICAgICAgICAgICAgICAgIHN0YXRlLnNlY3Rpb25zLmludmVydGVyLnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hY3RpdmVfc2VjdGlvbiA9ICdpbnZlcnRlcic7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEludmVydGVyXG4gICAgICAgICAgICBpZiggb2JqZWN0X2RlZmluZWQoaW5wdXRzLkRDKSApIHtcblxuICAgICAgICAgICAgICAgIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyTWFrZUFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVycyk7XG4gICAgICAgICAgICAgICAgaWYoIHN5c3RlbS5pbnZlcnRlci5tYWtlICkge1xuICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlck1vZGVsQXJyYXkgPSBrLm9iaklkQXJyYXkoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzW3N5c3RlbS5pbnZlcnRlci5tYWtlXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKCBzeXN0ZW0uaW52ZXJ0ZXIubW9kZWwgKSBzeXN0ZW0uaW52ZXJ0ZXIuc3BlY3MgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnNbc3lzdGVtLmludmVydGVyLm1ha2VdW3N5c3RlbS5pbnZlcnRlci5tb2RlbF07XG5cbiAgICAgICAgICAgICAgICBzdGF0ZS5hY3RpdmVfc2VjdGlvbiA9ICdBQyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEFDXG4gICAgICAgICAgICBpZiggb2JqZWN0X2RlZmluZWQoaW5wdXRzLmludmVydGVyKSApIHtcbiAgICAgICAgICAgICAgICBpZiggc3lzdGVtLkFDX2xvYWRjZW50ZXJfdHlwZSApIHtcblxuICAgICAgICAgICAgICAgICAgICBzeXN0ZW0uQUNfdHlwZXNfYXZhaWxpYmxlID0gY29uZmlnX29wdGlvbnMuQUNfbG9hZGNlbnRlcl90eXBlc1tzeXN0ZW0uQUNfbG9hZGNlbnRlcl90eXBlXTtcblxuICAgICAgICAgICAgICAgICAgICBjb25maWdfb3B0aW9ucy5BQ190eXBlX29wdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW0sIGlkICl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggISAoZWxlbSBpbiBzeXN0ZW0uQUNfdHlwZXNfYXZhaWxpYmxlKSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWdfb3B0aW9ucy5BQ190eXBlX29wdGlvbnMuc3BsaWNlKGlkLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvL3N5c3RlbS5BQy50eXBlID0gc2V0dGluZ3Muc3lzdGVtLkFDX3R5cGU7XG4gICAgICAgICAgICAgICAgICAgIHN5c3RlbS5BQ19jb25kdWN0b3JzID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuQUNfdHlwZXNbc3lzdGVtLkFDX3R5cGVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiggb2JqZWN0X2RlZmluZWQoaW5wdXRzLkFDKSApIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hY3RpdmVfc2VjdGlvbiA9IG9sZF9hY3RpdmVfc2VjdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2l6ZS53aXJlX29mZnNldC5tYXggPSBzaXplLndpcmVfb2Zmc2V0Lm1pbiArIHN5c3RlbS5EQy5udW1fc3RyaW5ncyAqIHNpemUud2lyZV9vZmZzZXQuYmFzZTtcbiAgICAgICAgICAgIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kID0gc2l6ZS53aXJlX29mZnNldC5tYXggKyBzaXplLndpcmVfb2Zmc2V0LmJhc2UqMTtcblxuICAgICAgICAgICAgbG9jLmFycmF5LmxlZnQgPSBsb2MuYXJyYXkucmlnaHQgLSAoIHNpemUuc3RyaW5nLncgKiBzeXN0ZW0uREMubnVtX3N0cmluZ3MgKSAtICggc2l6ZS5tb2R1bGUuZnJhbWUudyozLzQgKSA7XG5cbiAgICAgICAgICAgIC8vcmV0dXJuIHNldHRpbmdzO1xuXG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vLyovXG5cbm1vZHVsZS5leHBvcnRzID0gc2V0dGluZ3NfdXBkYXRlO1xuIiwibW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9e1xuXG4gICAgXCJORUMgMjUwLjEyMl9oZWFkZXJcIjogW1wiQW1wXCIsXCJBV0dcIl0sXG4gICAgXCJORUMgMjUwLjEyMlwiOiB7XG4gICAgICAgIFwiMTVcIjpcIjE0XCIsXG4gICAgICAgIFwiMjBcIjpcIjEyXCIsXG4gICAgICAgIFwiMzBcIjpcIjEwXCIsXG4gICAgICAgIFwiNDBcIjpcIjEwXCIsXG4gICAgICAgIFwiNjBcIjpcIjEwXCIsXG4gICAgICAgIFwiMTAwXCI6XCI4XCIsXG4gICAgICAgIFwiMjAwXCI6XCI2XCIsXG4gICAgICAgIFwiMzAwXCI6XCI0XCIsXG4gICAgICAgIFwiNDAwXCI6XCIzXCIsXG4gICAgICAgIFwiNTAwXCI6XCIyXCIsXG4gICAgICAgIFwiNjAwXCI6XCIxXCIsXG4gICAgICAgIFwiODAwXCI6XCIxLzBcIixcbiAgICAgICAgXCIxMDAwXCI6XCIyLzBcIixcbiAgICAgICAgXCIxMjAwXCI6XCIzLzBcIixcbiAgICAgICAgXCIxNjAwXCI6XCI0LzBcIixcbiAgICAgICAgXCIyMDAwXCI6XCIyNTBcIixcbiAgICAgICAgXCIyNTAwXCI6XCIzNTBcIixcbiAgICAgICAgXCIzMDAwXCI6XCI0MDBcIixcbiAgICAgICAgXCI0MDAwXCI6XCI1MDBcIixcbiAgICAgICAgXCI1MDAwXCI6XCI3MDBcIixcbiAgICAgICAgXCI2MDAwXCI6XCI4MDBcIixcbiAgICB9LFxuXG4gICAgXCJORUMgVDY5MC43X2hlYWRlclwiOiBbXCJBbWJpZW50IFRlbXBlcmF0dXJlIChDKVwiLCBcIkNvcnJlY3Rpb24gRmFjdG9yXCJdLFxuICAgIFwiTkVDIFQ2OTAuN1wiOiB7XG4gICAgICAgIFwiMjUgdG8gMjBcIjpcIjEuMDJcIixcbiAgICAgICAgXCIxOSB0byAxNVwiOlwiMS4wNFwiLFxuICAgICAgICBcIjE1IHRvIDEwXCI6XCIxLjA2XCIsXG4gICAgICAgIFwiOSB0byA1XCI6XCIxLjA4XCIsXG4gICAgICAgIFwiNCB0byAwXCI6XCIxLjEwXCIsXG4gICAgICAgIFwiLTEgdG8gLTVcIjpcIjEuMTJcIixcbiAgICAgICAgXCItNiB0byAtMTBcIjpcIjEuMTRcIixcbiAgICAgICAgXCItMTEgdG8gLTE1XCI6XCIxLjE2XCIsXG4gICAgICAgIFwiLTE2IHRvIC0yMFwiOlwiMS4xOFwiLFxuICAgICAgICBcIi0yMSB0byAtMjVcIjpcIjEuMjBcIixcbiAgICAgICAgXCItMjYgdG8gLTMwXCI6XCIxLjIxXCIsXG4gICAgICAgIFwiLTMxIHRvIC0zNVwiOlwiMS4yM1wiLFxuICAgICAgICBcIi0zNiB0byAtNDBcIjpcIjEuMjVcIixcbiAgICB9LFxuXG4gICAgXCJDaCA5IFRhYmxlIDggQ29uZHVjdG9yIFByb3BlcnRpZXNfaGVhZGVyXCI6IFtcIlNpemVcIixcIm9obS9rZnRcIl0sXG4gICAgXCJDaCA5IFRhYmxlIDggQ29uZHVjdG9yIFByb3BlcnRpZXNcIjoge1xuICAgICAgICBcIiMwMVwiOlwiIDAuMTU0XCIsXG4gICAgICAgIFwiIzAxLzBcIjpcIjAuMTIyXCIsXG4gICAgICAgIFwiIzAyXCI6XCIwLjE5NFwiLFxuICAgICAgICBcIiMwMi8wXCI6XCIwLjA5NjdcIixcbiAgICAgICAgXCIjMDNcIjpcIjAuMjQ1XCIsXG4gICAgICAgIFwiIzAzLzBcIjpcIjAuMDc2NlwiLFxuICAgICAgICBcIiMwNFwiOlwiMC4zMDhcIixcbiAgICAgICAgXCIjMDQvMFwiOlwiMC4wNjA4XCIsXG4gICAgICAgIFwiIzA2XCI6XCIwLjQ5MVwiLFxuICAgICAgICBcIiMwOFwiOlwiMC43NzhcIixcbiAgICAgICAgXCIjMTBcIjpcIjEuMjRcIixcbiAgICAgICAgXCIjMTJcIjpcIjEuOThcIixcbiAgICAgICAgXCIjMTRcIjpcIjMuMTRcIixcbiAgICB9XG59XG4iLCIvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gVGhpcyBpcyB0aGUgayBqYXZhc2NyaXB0IGxpYnJhcnlcclxuLy8gYSBjb2xsZWN0aW9uIG9mIGZ1bmN0aW9ucyB1c2VkIGJ5IGtzaG93YWx0ZXJcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4vL3ZhciBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxuLy92YXIgJCA9IHJlcXVpcmUoJy4va19ET00uanMnKTtcclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gTWlzYy4gdmFyaWFibGVzICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLy8gbG9nIHNob3J0Y3V0XHJcbnZhciBsb2dPYmogPSBmdW5jdGlvbihvYmope1xyXG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkob2JqKSlcclxufVxyXG52YXIgbG9nT2JqRnVsbCA9IGZ1bmN0aW9uKG9iail7XHJcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDQpKVxyXG59XHJcblxyXG4vLyB+IHBhZ2UgbG9hZCB0aW1lXHJcbnZhciBib290X3RpbWUgPSBtb21lbnQoKVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIFN0YXJ0IG9mIGxpYmFyeSBvYmplY3QgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbnZhciBrID0ge31cclxuXHJcblxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBKYXZhc3JpcHQgZnVuY3Rpb25zIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuXHJcbmsub2JqX2V4dGVuZCA9IGZ1bmN0aW9uKG9iaiwgcHJvcHMpIHtcclxuICAgIGZvcih2YXIgcHJvcCBpbiBwcm9wcykge1xyXG4gICAgICAgIGlmKHByb3BzLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgICAgIG9ialtwcm9wXSA9IHByb3BzW3Byb3BdXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5rLm9ial9yZW5hbWUgPSBmdW5jdGlvbihvYmosIG9sZF9uYW1lLCBuZXdfbmFtZSl7XHJcbiAgICAvLyBDaGVjayBmb3IgdGhlIG9sZCBwcm9wZXJ0eSBuYW1lIHRvIGF2b2lkIGEgUmVmZXJlbmNlRXJyb3IgaW4gc3RyaWN0IG1vZGUuXHJcbiAgICBpZiAob2JqLmhhc093blByb3BlcnR5KG9sZF9uYW1lKSkge1xyXG4gICAgICAgIG9ialtuZXdfbmFtZV0gPSBvYmpbb2xkX25hbWVdXHJcbiAgICAgICAgZGVsZXRlIG9ialtvbGRfbmFtZV1cclxuICAgIH1cclxuICAgIHJldHVybiBvYmpcclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBNaXNjIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuLy8gaHR0cDovL2Nzcy10cmlja3MuY29tL3NuaXBwZXRzL2phdmFzY3JpcHQvZ2V0LXVybC12YXJpYWJsZXMvXHJcbmsuZ2V0UXVlcnlWYXJpYWJsZSA9IGZ1bmN0aW9uKHZhcmlhYmxlKSB7XHJcbiAgICAgICB2YXIgcXVlcnkgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKVxyXG4gICAgICAgdmFyIHZhcnMgPSBxdWVyeS5zcGxpdChcIiZcIilcclxuICAgICAgIGZvciAodmFyIGk9MDtpPHZhcnMubGVuZ3RoO2krKykge1xyXG4gICAgICAgICAgICAgICB2YXIgcGFpciA9IHZhcnNbaV0uc3BsaXQoXCI9XCIpXHJcbiAgICAgICAgICAgICAgIGlmKHBhaXJbMF0gPT0gdmFyaWFibGUpe1xyXG4gICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhaXJbMV1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuKGZhbHNlKVxyXG59XHJcblxyXG5rLnN0cl9yZXBlYXQgPSBmdW5jdGlvbihzdHJpbmcsIGNvdW50KSB7XHJcbiAgICBpZiAoY291bnQgPCAxKSByZXR1cm4gJydcclxuICAgIHZhciByZXN1bHQgPSAnJ1xyXG4gICAgdmFyIHBhdHRlcm4gPSBzdHJpbmcudmFsdWVPZigpXHJcbiAgICB3aGlsZSAoY291bnQgPiAwKSB7XHJcbiAgICAgICAgaWYgKGNvdW50ICYgMSkgcmVzdWx0ICs9IHBhdHRlcm5cclxuICAgICAgICBjb3VudCA+Pj0gMVxyXG4gICAgICAgIHBhdHRlcm4gKz0gcGF0dGVyblxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdFxyXG59XHJcblxyXG5rLm9ial9uYW1lcyA9IGZ1bmN0aW9uKCBvYmplY3QgKSB7XHJcbiAgICBpZiggb2JqZWN0ICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgdmFyIGEgPSBbXTtcclxuICAgICAgICBmb3IoIHZhciBpZCBpbiBvYmplY3QgKSB7XHJcbiAgICAgICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoaWQpICkgIHtcclxuICAgICAgICAgICAgICAgIGEucHVzaChpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmsub2JqSWRBcnJheSA9IGZ1bmN0aW9uKCBvYmplY3QgKSB7XHJcbiAgICBpZiggb2JqZWN0ICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgdmFyIGEgPSBbXTtcclxuICAgICAgICBmb3IoIHZhciBpZCBpbiBvYmplY3QgKSB7XHJcbiAgICAgICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoaWQpICkgIHtcclxuICAgICAgICAgICAgICAgIGEucHVzaChpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGE7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gTWF0aCwgbnVtYmVycyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcbi8qXHJcbiAqICBub3JtUmFuZDogcmV0dXJucyBub3JtYWxseSBkaXN0cmlidXRlZCByYW5kb20gbnVtYmVyc1xyXG4gKiAgaHR0cDovL21lbW9yeS5wc3ljaC5tdW4uY2EvdGVjaC9zbmlwcGV0cy9yYW5kb21fbm9ybWFsL1xyXG4gKi9cclxuay5ub3JtUmFuZCA9IGZ1bmN0aW9uKG11LCBzaWdtYSkge1xyXG4gICAgdmFyIHgxLCB4MiwgcmFkO1xyXG5cclxuICAgIGRvIHtcclxuICAgICAgICB4MSA9IDIgKiBNYXRoLnJhbmRvbSgpIC0gMTtcclxuICAgICAgICB4MiA9IDIgKiBNYXRoLnJhbmRvbSgpIC0gMTtcclxuICAgICAgICByYWQgPSB4MSAqIHgxICsgeDIgKiB4MjtcclxuICAgIH0gd2hpbGUocmFkID49IDEgfHwgcmFkID09PSAwKTtcclxuXHJcbiAgICB2YXIgYyA9IE1hdGguc3FydCgtMiAqIE1hdGgubG9nKHJhZCkgLyByYWQpO1xyXG4gICAgdmFyIG4gPSB4MSAqIGM7XHJcbiAgICByZXR1cm4gKG4gKiBtdSkgKyBzaWdtYTtcclxufVxyXG5cclxuay5wYWRfemVybyA9IGZ1bmN0aW9uKG51bSwgc2l6ZSl7XHJcbiAgICB2YXIgcyA9ICcwMDAwMDAwMDAnICsgbnVtXHJcbiAgICByZXR1cm4gcy5zdWJzdHIocy5sZW5ndGgtc2l6ZSlcclxufVxyXG5cclxuXHJcbmsudXB0aW1lID0gZnVuY3Rpb24oYm9vdF90aW1lKXtcclxuICAgIHZhciB1cHRpbWVfc2Vjb25kc190b3RhbCA9IG1vbWVudCgpLmRpZmYoYm9vdF90aW1lLCAnc2Vjb25kcycpXHJcbiAgICB2YXIgdXB0aW1lX2hvdXJzID0gTWF0aC5mbG9vciggIHVwdGltZV9zZWNvbmRzX3RvdGFsIC8oNjAqNjApIClcclxuICAgIHZhciBtaW51dGVzX2xlZnQgPSB1cHRpbWVfc2Vjb25kc190b3RhbCAlKDYwKjYwKVxyXG4gICAgdmFyIHVwdGltZV9taW51dGVzID0gay5wYWRfemVybyggTWF0aC5mbG9vciggIG1pbnV0ZXNfbGVmdCAvNjAgKSwgMiApXHJcbiAgICB2YXIgdXB0aW1lX3NlY29uZHMgPSBrLnBhZF96ZXJvKCAobWludXRlc19sZWZ0ICUgNjApLCAyIClcclxuICAgIHJldHVybiB1cHRpbWVfaG91cnMgK1wiOlwiKyB1cHRpbWVfbWludXRlcyArXCI6XCIrIHVwdGltZV9zZWNvbmRzXHJcbn1cclxuXHJcblxyXG5cclxuay5sYXN0X25fdmFsdWVzID0gZnVuY3Rpb24obil7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG46IG4sXHJcbiAgICAgICAgYXJyYXk6IFtdLFxyXG4gICAgICAgIGFkZDogZnVuY3Rpb24obmV3X3ZhbHVlKXtcclxuICAgICAgICAgICAgdGhpcy5hcnJheS5wdXNoKG5ld192YWx1ZSlcclxuICAgICAgICAgICAgaWYoIHRoaXMuYXJyYXkubGVuZ3RoID4gbiApIHRoaXMuYXJyYXkuc2hpZnQoKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hcnJheVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuay5hcnJheU1heCA9IGZ1bmN0aW9uKG51bUFycmF5KSB7XHJcbiAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCwgbnVtQXJyYXkpO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBBSkFYIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5rLkFKQVggPSBmdW5jdGlvbih1cmwsIGNhbGxiYWNrLCBvYmplY3QpIHtcclxuICAgIHZhciB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgeG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoeG1saHR0cC5yZWFkeVN0YXRlID09IFhNTEh0dHBSZXF1ZXN0LkRPTkUgKSB7XHJcbiAgICAgICAgICAgIGlmKHhtbGh0dHAuc3RhdHVzID09IDIwMCl7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayh4bWxodHRwLnJlc3BvbnNlVGV4dCwgb2JqZWN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKHhtbGh0dHAuc3RhdHVzID09IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1RoZXJlIHdhcyBhbiBlcnJvciA0MDAnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NvbWV0aGluZyBlbHNlIG90aGVyIHRoYW4gMjAwIHdhcyByZXR1cm5lZCcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgeG1saHR0cC5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XHJcbiAgICB4bWxodHRwLnNlbmQoKTtcclxufVxyXG5cclxuay5wYXJzZUNTViA9IGZ1bmN0aW9uKGZpbGVfY29udGVudCkge1xyXG4gICAgdmFyIHIgPSBbXVxyXG4gICAgdmFyIGxpbmVzID0gZmlsZV9jb250ZW50LnNwbGl0KCdcXG4nKTtcclxuICAgIHZhciBoZWFkZXIgPSBsaW5lcy5zaGlmdCgpLnNwbGl0KCcsJyk7XHJcbiAgICBoZWFkZXIuZm9yRWFjaChmdW5jdGlvbihlbGVtLCBpZCl7XHJcbiAgICAgICAgaGVhZGVyW2lkXSA9IGVsZW0udHJpbSgpO1xyXG4gICAgfSk7XHJcbiAgICBmb3IodmFyIGwgPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGwgPCBsZW47IGwrKyl7XHJcbiAgICAgICAgdmFyIGxpbmUgPSBsaW5lc1tsXTtcclxuICAgICAgICBpZihsaW5lLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICB2YXIgbGluZV9vYmogPSB7fTtcclxuICAgICAgICAgICAgbGluZS5zcGxpdCgnLCcpLmZvckVhY2goZnVuY3Rpb24oaXRlbSxpKXtcclxuICAgICAgICAgICAgICAgIGxpbmVfb2JqW2hlYWRlcltpXV0gPSBpdGVtLnRyaW0oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHIucHVzaChsaW5lX29iaik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuKHIpO1xyXG59O1xyXG5cclxuay5nZXRDU1YgPSBmdW5jdGlvbihVUkwsIGNhbGxiYWNrKSB7XHJcbiAgICBrLkFKQVgoVVJMLCBrLnBhcnNlQ1NWKCkgKVxyXG59XHJcblxyXG4vKlxyXG4kLmFqYXhTZXR1cCAoe1xyXG4gICAgY2FjaGU6IGZhbHNlXHJcbn0pXHJcblxyXG5cclxuXHJcbmsuZ2V0X0pTT04gPSBmdW5jdGlvbihVUkwsIGNhbGxiYWNrLCBzdHJpbmcpIHtcclxuLy8gICAgdmFyIGZpbGVuYW1lID0gVVJMLnNwbGl0KCcvJykucG9wKClcclxuLy8gICAgY29uc29sZS5sb2coVVJMKVxyXG4gICAgJC5nZXRKU09OKCBVUkwsIGZ1bmN0aW9uKCBqc29uICkge1xyXG4gICAgICAgIGNhbGxiYWNrKGpzb24sIFVSTCwgc3RyaW5nKVxyXG4gICAgfSkuZmFpbChmdW5jdGlvbihqcXhociwgdGV4dFN0YXR1cywgZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyggXCJlcnJvclwiLCB0ZXh0U3RhdHVzLCBlcnJvciAgKVxyXG4gICAgfSlcclxufVxyXG5cclxuXHJcbmsubG9hZF9maWxlcyA9IGZ1bmN0aW9uKGZpbGVfbGlzdCwgY2FsbGJhY2spe1xyXG4gICAgdmFyIGQgPSB7fVxyXG5cclxuICAgIGZ1bmN0aW9uIGxvYWRfZmlsZShVUkwpe1xyXG4gICAgICAgIHZhciBmaWxlbmFtZSA9IFVSTC5zcGxpdCgnLycpLnBvcCgpXHJcbi8vICAgICAgICB2YXIgbmFtZSA9IGZpbGVuYW1lLnNwbGl0KCcuJylbMF1cclxuICAgICAgICAkLmdldEpTT04oIFVSTCwgZnVuY3Rpb24oIGpzb24gKSB7IC8vICwgdGV4dFN0YXR1cywganFYSFIpIHtcclxuICAgICAgICAgICAgYWRkX0pTT04oZmlsZW5hbWUsIGpzb24pXHJcbiAgICAgICAgfSkuZmFpbChmdW5jdGlvbihqcXhociwgdGV4dFN0YXR1cywgZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coIFwiZXJyb3JcIiwgdGV4dFN0YXR1cywgZXJyb3IgIClcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFkZF9KU09OKG5hbWUsIGpzb24pe1xyXG4gICAgICAgIGRbbmFtZV0gPSBqc29uXHJcbiAgICAgICAgaWYoT2JqZWN0LmtleXMoZCkubGVuZ3RoID09IGRfZmlsZXMubGVuZ3RoKXtcclxuICAgICAgICAgICAgY2FsbGJhY2soZClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yKCB2YXIga2V5IGluIGZpbGVfbGlzdCl7XHJcbiAgICAgICAgdmFyIFVSTCA9IGZpbGVfbGlzdFtrZXldXHJcbiAgICAgICAgbG9hZF9maWxlKFVSTClcclxuICAgIH1cclxuXHJcbi8vICAgIGNhbGxiYWNrKGQpXHJcbn1cclxuXHJcbmsuZ2V0RmlsZSA9IGZ1bmN0aW9uKFVSTCwgY2FsbGJhY2spe1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IFVSTCxcclxuICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiggeGhyICkge1xyXG4gICAgICAgICAgICB4aHIub3ZlcnJpZGVNaW1lVHlwZSggXCJ0ZXh0L3BsYWluOyBjaGFyc2V0PXgtdXNlci1kZWZpbmVkXCIgKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgLmRvbmUoZnVuY3Rpb24oIGRhdGEgKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZGF0YSlcclxuICAgIH0pXHJcbiAgICAuZmFpbChmdW5jdGlvbihqcXhociwgdGV4dFN0YXR1cywgZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coIFwiZXJyb3JcIiwgdGV4dFN0YXR1cywgZXJyb3IgIClcclxuICAgIH0pXHJcblxyXG5cclxufVxyXG4qL1xyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBIVE1MIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuXHJcblxyXG5rLnNldHVwX2JvZHkgPSBmdW5jdGlvbih0aXRsZSwgc2VjdGlvbnMpe1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZVxyXG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5XHJcbiAgICB2YXIgc3RhdHVzX2JhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICBzdGF0dXNfYmFyLmlkID0gJ3N0YXR1cydcclxuICAgIHN0YXR1c19iYXIuaW5uZXJIVE1MID0gJ2xvYWRpbmcgc3RhdHVzLi4uJ1xyXG4gICAgLypcclxuICAgIHZhciB0aXRsZV9oZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpXHJcbiAgICB0aXRsZV9oZWFkZXIuaW5uZXJIVE1MID0gdGl0bGVcclxuICAgIGJvZHkuaW5zZXJ0QmVmb3JlKHRpdGxlX2hlYWRlciwgYm9keS5maXJzdENoaWxkKVxyXG4gICAgKi9cclxuICAgIGJvZHkuaW5zZXJ0QmVmb3JlKHN0YXR1c19iYXIsIGJvZHkuZmlyc3RDaGlsZClcclxuICAgIC8qXHJcbiAgICB2YXIgdGFic19kaXYgPSBrLm1ha2VfdGFicyhzZWN0aW9ucylcclxuICAgICQoJ2JvZHknKS5hcHBlbmQodGFic19kaXYpXHJcbiAgICAkKCAnLnRhYnMnICkudGFicyh7XHJcbiAgICAgICAgYWN0aXZhdGU6IGZ1bmN0aW9uKCBldmVudCwgdWkgKSB7XHJcbiAgICAgICAgICAgIHZhciBmdWxsX3RpdGxlID0gdGl0bGUgKyBcIiAvIFwiICsgdWkubmV3VGFiWzBdLnRleHRDb250ZW50XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnRpdGxlID0gZnVsbF90aXRsZVxyXG4gICAgICAgICAgICAkKCcjdGl0bGUnKS50ZXh0KGZ1bGxfdGl0bGUpXHJcbiAgICAgICAgICAgIC8vZHVtcChtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKSlcclxuICAgICAgICAgICAgJC5zcGFya2xpbmVfZGlzcGxheV92aXNpYmxlKClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgdmFyIHNlY3Rpb24gPSBrLmdldFF1ZXJ5VmFyaWFibGUoJ3NlYycpXHJcbiAgICBpZihzZWN0aW9uIGluIHNlY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gJCgnLnRhYnMgYVtocmVmPVwiIycrc2VjdGlvbisnXCJdJykucGFyZW50KCkuaW5kZXgoKVxyXG4gICAgICAgICQoXCIudGFic1wiKS50YWJzKFwib3B0aW9uXCIsIFwiYWN0aXZlXCIsIGluZGV4KVxyXG4gICAgfVxyXG4gICAgKi9cclxuXHJcbn1cclxuLypcclxuay5tYWtlX3RhYnMgPSBmdW5jdGlvbihzZWN0aW9uX29iail7XHJcbiAgICB2YXIgdGFic19kaXYgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCd0YWJzJylcclxuICAgIHZhciBoZWFkX2RpdiA9ICQoJzx1bD4nKS5hcHBlbmRUbyh0YWJzX2RpdilcclxuXHJcbiAgICBmb3IgKHZhciBpZCBpbiBzZWN0aW9uX29iail7XHJcbiAgICAgICAgdmFyIHRpdGxlID0gc2VjdGlvbl9vYmpbaWRdXHJcbiAgICAgICAgLy8oJzxsaT48YSBocmVmPVwiIycraWQrJ1wiPicrdGl0bGUrJzwvYT48L2xpPicpKVxyXG4gICAgICAgIC8vKCc8ZGl2IGlkPVwiJytpZCsnXCI+PC9kaXY+JykpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRhYnNfZGl2XHJcbn1cclxuXHJcbiovXHJcbmsudXBkYXRlX3N0YXR1c19wYWdlID0gZnVuY3Rpb24oc3RhdHVzX2lkLCBib290X3RpbWUsIHN0cmluZykge1xyXG4gICAgdmFyIHN0YXR1c19kaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzdGF0dXNfaWQpXHJcbiAgICBzdGF0dXNfZGl2LmlubmVySFRNTCA9IHN0cmluZ1xyXG4gICAgc3RhdHVzX2Rpdi5pbm5lckhUTUwgKz0gJyB8ICdcclxuXHJcbiAgICB2YXIgY2xvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgIGNsb2NrLmlubmVySFRNTCA9IG1vbWVudCgpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpXHJcblxyXG4gICAgdmFyIHVwdGltZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgdXB0aW1lLmlubmVySFRNTCA9ICdVcHRpbWU6ICcgKyBrLnVwdGltZShib290X3RpbWUpXHJcblxyXG4gICAgc3RhdHVzX2Rpdi5hcHBlbmRDaGlsZChjbG9jaylcclxuICAgIHN0YXR1c19kaXYuaW5uZXJIVE1MICs9ICcgfCAnXHJcbiAgICBzdGF0dXNfZGl2LmFwcGVuZENoaWxkKHVwdGltZSlcclxuICAgIHN0YXR1c19kaXYuaW5uZXJIVE1MICs9ICcgfCAnXHJcbn1cclxuXHJcbi8qXHJcbmsub2JqX2xvZyA9IGZ1bmN0aW9uKG9iaiwgb2JqX25hbWUsIG1heF9sZXZlbCl7XHJcbiAgICB2YXIgbGV2ZWxzID0gZnVuY3Rpb24ob2JqLCBsZXZlbF9pbmRlbnQsIHN0cil7XHJcbiAgICAgICAgZm9yKHZhciBuYW1lIGluIG9iaikge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IG9ialtuYW1lXVxyXG4gICAgICAgICAgICBpZiggbGV2ZWxfaW5kZW50IDw9IG1heF9sZXZlbCAmJiB0eXBlb2YoaXRlbSkgPT0gJ29iamVjdCcgKSB7XHJcbiAgICAgICAgICAgICAgICBzdHIgKz0gXCJcXG5cIiArIGsuc3RyX3JlcGVhdChcIiBcIiwgbGV2ZWxfaW5kZW50KjIpICsgbmFtZVxyXG4gICAgICAgICAgICAgICAgc3RyID0gbGV2ZWxzKGl0ZW0sIGxldmVsX2luZGVudCsxLCBzdHIgKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYodHlwZW9mIGl0ZW0gIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIHN0ciArPSBcIlxcblwiICsgay5zdHJfcmVwZWF0KFwiIFwiLCBsZXZlbF9pbmRlbnQqMikgKyBuYW1lICsgXCI6IFwiICsgaXRlbVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc3RyICs9IFwiXFxuXCIgKyBrLnN0cl9yZXBlYXQoXCIgXCIsIGxldmVsX2luZGVudCoyKSArIG5hbWUgKyBcIjogPGZ1bmN0aW9uPlwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0clxyXG4gICAgfVxyXG4gICAgdmFyIG1heF9sZXZlbCA9IG1heF9sZXZlbCB8fCAxMDBcclxuICAgIGNvbnNvbGUubG9nKG9ial9uYW1lKVxyXG4gICAgdmFyIHN0ciA9ICctJyArIG9ial9uYW1lICsgJy0nXHJcbiAgICBtYXhfbGV2ZWwrK1xyXG4gICAgbGV2ZWxfaW5kZW50ID0gMlxyXG4gICAgc3RyID0gbGV2ZWxzKG9iaiwgbGV2ZWxfaW5kZW50LCBzdHIpXHJcbiAgICBjb25zb2xlLmxvZyhzdHIpXHJcbn1cclxuXHJcblxyXG5rLm9ial90cmVlID0gZnVuY3Rpb24ob2JqLCB0aXRsZSl7XHJcbiAgICAvLyB0YWtlcyBhIGphdmFzY3JpcHQsIGFuZCByZXR1cmVucyBhIGpxdWVyeSBESVZcclxuICAgIHZhciBvYmpfZGl2ID0gJCgnPHByZT4nKSAvLy5hZGRDbGFzcygnYm94JylcclxuICAgIHZhciBsZXZlbHMgPSBmdW5jdGlvbihvYmosIGxldmVsX2luZGVudCl7KGxpbmUsIGNpcmNsZSwgdGV4dCApXHJcbiAgICAgICAgdmFyIGxpc3QgPSBbXVxyXG4gICAgICAgIHZhciBvYmpfbGVuZ3RoID0gMFxyXG4gICAgICAgIGZvciggdmFyIGtleSBpbiBvYmopIHtvYmpfbGVuZ3RoKyt9XHJcbiAgICAgICAgdmFyIGNvdW50ID0gMFxyXG4gICAgICAgIGZvcih2YXIga2V5IGluIG9iaikge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IG9ialtrZXldXHJcblxyXG4vLyAgICAgICAgICAgIHZhciBpbmRlbnRfc3RyaW5nID0gJyZuYnNwOyZuYnNwOyZuYnNwOyYjOTQ3NCcucmVwZWF0KGxldmVsKSArICcmbmJzcDsmbmJzcDsmbmJzcDsnXHJcbi8vICAgICAgICAgICAgaWYobGV2ZWxfaW5kZW50ID09PSAnJyApe1xyXG4vLyAgICAgICAgICAgICAgICBuZXh0X2xldmVsX2luZGVudCA9IGxldmVsX2luZGVudCArICcmbmJzcDsmbmJzcDsnXHJcbi8vICAgICAgICAgICAgICAgIHRoaXNfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyZuYnNwOydcclxuLy8gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgaWYoY291bnQgPT0gb2JqX2xlbmd0aC0xICkgeyAgIC8vIElmIGxhc3QgaXRlbSwgZmluc2ggdHJlZSBzZWN0aW9uXHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dF9sZXZlbF9pbmRlbnQgPSBsZXZlbF9pbmRlbnQgKyAnJm5ic3A7Jm5ic3A7J1xyXG4gICAgICAgICAgICAgICAgdmFyIHRoaXNfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyYjOTQ5MjsmIzk0NzI7J1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dF9sZXZlbF9pbmRlbnQgPSBsZXZlbF9pbmRlbnQgKyAnJm5ic3A7JiM5NDc0OydcclxuICAgICAgICAgICAgICAgIHZhciB0aGlzX2xldmVsX2luZGVudCA9IGxldmVsX2luZGVudCArICcmbmJzcDsmIzk1MDA7JiM5NDcyOydcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIGlmKCB0eXBlb2YoaXRlbSkgPT0gJ29iamVjdCcgKXtcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaCggdGhpc19sZXZlbF9pbmRlbnQgKyBrZXkpXHJcbiAgICAgICAgICAgICAgICBsaXN0ID0gbGlzdC5jb25jYXQoIGxldmVscyhpdGVtLCBuZXh0X2xldmVsX2luZGVudCkgKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IGl0ZW0udG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLFwiIFwiKS5yZXBsYWNlKC9cXHMrL2csXCIgXCIpIC8vaHR0cDovL3d3dy50ZXh0Zml4ZXIuY29tL3R1dG9yaWFscy9qYXZhc2NyaXB0LWxpbmUtYnJlYWtzLnBocFxyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKHRoaXNfbGV2ZWxfaW5kZW50ICsga2V5K1wiOiBcIisgaXRlbSlcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbi8vICAgICAgICAgICAgY29uc29sZS5sb2coa2V5LGxldmVsKVxyXG4gICAgICAgICAgICBjb3VudCsrXHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdFxyXG4gICAgfVxyXG5cclxuICAgIHZhciBsaXN0ID0gW3RpdGxlXS5jb25jYXQobGV2ZWxzKG9iaiwnJykpXHJcbiAgICBsaXN0LmZvckVhY2goIGZ1bmN0aW9uKGxpbmUsa2V5KXtcclxuICAgICAgICBvYmpfZGl2LmFwcGVuZChsaW5lICsgJzwvYnI+JylcclxuICAgIH0pXHJcbiAgICByZXR1cm4gb2JqX2RpdlxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG5rLm9ial9kaXNwbGF5ID0gZnVuY3Rpb24ob2JqKXtcclxuICAgIGZ1bmN0aW9uIGxldmVscyhvYmosbGV2ZWwpe1xyXG4gICAgLy8gICAgdmFyIHN1Ym9ial9kaXYgPSAkKCc8ZGl2PicpXHJcbiAgICAgICAgdmFyIHN1Ym9ial91bCA9ICQoJzx1bD4nKS5hZGRDbGFzcygndHJlZScpXHJcblxyXG4gICAgICAgIGZvcih2YXIga2V5IGluIG9iaikge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IG9ialtrZXldXHJcbiAgICAvLyAgICAgICAgY29uc29sZS5sb2coa2V5LCB0eXBlb2YoaXRlbSkpXHJcbiAgICAgICAgICAgIGlmKCB0eXBlb2YoaXRlbSkgPT0gJ29iamVjdCcgKXtcclxuICAgIC8vICAgICAgICAgICAgKCc8bGk+JykudGV4dChcIiZuYnNwO1wiLnJlcGVhdChsZXZlbCkgKyBrZXkpKVxyXG4gICAgICAgICAgICAgICAgKCc8bGk+JykudGV4dChrZXkpKVxyXG4gICAgICAgICAgICAgICAgc3Vib2JqX3VsLmFwcGVuZChsZXZlbHMoaXRlbSxsZXZlbCsxKSlcclxuICAgIC8vICAgICAgICAgICAgY29uc29sZS5sb2coXCImbmJzcDtcIi5yZXBlYXQobGV2ZWwpICsga2V5KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICBzdWJvYmpfZGl2LmFwcGVuZCgnPHNwYW4+JykudGV4dChcIiZuYnNwO1wiLnJlcGVhdChsZXZlbCkgKyBrZXkrXCI6IFwiKyBpdGVtKVxyXG4gICAgLy8gICAgICAgICAgICAoJzxsaT4nKS50ZXh0KFwiJm5ic3A7XCIucmVwZWF0KGxldmVsKSArIGtleSArXCI6IFwiKyBpdGVtKSlcclxuICAgICAgICAgICAgICAgICgnPGxpPicpLnRleHQoa2V5ICtcIjogXCIrIGl0ZW0pKVxyXG4gICAgLy8gICAgICAgICAgICBjb25zb2xlLmxvZyhcIiZuYnNwO1wiLnJlcGVhdChsZXZlbCkgKyBrZXkrXCI6IFwiKyBpdGVtKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdWJvYmpfdWxcclxuICAgIH1cclxuICAgIC8vIHRha2VzIGEgamF2YXNjcmlwdCwgYW5kIHJldHVyZW5zIGEganF1ZXJ5IERJVlxyXG4gICAgdmFyIG9ial9kaXYgPSAkKCc8ZGl2PicpLy8uYWRkQ2xhc3MoJ2JveCcpXHJcblxyXG4gICAgb2JqX2Rpdi5hcHBlbmQobGV2ZWxzKG9iaiwwKSlcclxuICAgIHJldHVybiBvYmpfZGl2XHJcbn1cclxuXHJcbmsuc2hvd19vYmogPSBmdW5jdGlvbihjb250YWluZXJfaWQsIG9iaiwgbmFtZSl7XHJcbiAgICB2YXIgaWQgPSAnIycgKyBuYW1lXHJcbiAgICBpZiggISAkKGNvbnRhaW5lcl9pZCkuY2hpbGRyZW4oaWQpLmxlbmd0aCApIHtcclxuICAgICAgICAoJzxkaXY+JykuYXR0cignaWQnLCBuYW1lKSlcclxuICAgIH1cclxuICAgIHZhciBib3ggPSAkKGNvbnRhaW5lcl9pZCkuY2hpbGRyZW4oaWQpXHJcbiAgICBib3guZW1wdHkoKVxyXG5cclxuICAgIHZhciBvYmpfZGl2ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnYm94JylcclxuICAgIG9ial9kaXYuYXBwZW5kKGsub2JqX3RyZWUob2JqLCBuYW1lKSlcclxuICAgIGJveC5hcHBlbmQob2JqX2RpdilcclxuXHJcbn1cclxuXHJcbiovXHJcbmsubG9nX29iamVjdF90cmVlID0gZnVuY3Rpb24oY29tcG9uZW50cyl7XHJcbiAgICBmb3IoIHZhciBtYWtlIGluIGNvbXBvbmVudHMubW9kdWxlcyApe1xyXG4gICAgICAgIGlmKCBjb21wb25lbnRzLm1vZHVsZXMuaGFzT3duUHJvcGVydHkobWFrZSkpe1xyXG4gICAgICAgICAgICBmb3IoIHZhciBtb2RlbCBpbiBjb21wb25lbnRzLm1vZHVsZXNbbWFrZV0gKXtcclxuICAgICAgICAgICAgICAgIGlmKCBjb21wb25lbnRzLm1vZHVsZXNbbWFrZV0uaGFzT3duUHJvcGVydHkobW9kZWwpKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IGNvbXBvbmVudHMubW9kdWxlc1ttYWtlXVttb2RlbF1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgYSA9IFttYWtlLG1vZGVsXVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciggdmFyIHNwZWMgaW4gbyApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggby5oYXNPd25Qcm9wZXJ0eShzcGVjKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhLnB1c2gob1tzcGVjXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYS5qb2luKCcsJykpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBGU0VDIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuXHJcblxyXG5rLmNyMTAwMF9qc29uID0gZnVuY3Rpb24oanNvbil7XHJcbi8vICAgIHZhciBmaWVsZHMgPSBbXVxyXG4vLyAgICAkLmVhY2goanNvbi5oZWFkLmZpZWxkcywgZnVuY3Rpb24oa2V5LCBmaWVsZCkge1xyXG4vLyAgICAgICAgZmllbGRzLnB1c2goZmllbGQubmFtZSlcclxuLy8gICAgfSlcclxuLy8gICAgdmFyIGRhdGEgPSBfLnppcChmaWVsZHMsIGpzb24uZGF0YVswXS52YWxzKVxyXG4vL1xyXG4gICAgdmFyIHRpbWVzdGFtcCA9IGpzb24uZGF0YVswXS50aW1lXHJcbiAgICB2YXIgZGF0YSA9IHt9XHJcbiAgICBkYXRhLlRpbWVzdGFtcCA9IGpzb24uZGF0YVswXS50aW1lXHJcbiAgICBkYXRhLlJlY29yZE51bSA9IGpzb24uZGF0YVswXS5ub1xyXG4gICAgZm9yKHZhciBpID0gMCwgbCA9IGpzb24uaGVhZC5maWVsZHMubGVuZ3RoOyBpIDwgbDsgaSsrICl7XHJcbiAgICAgICAgZGF0YVtqc29uLmhlYWQuZmllbGRzW2ldLm5hbWVdID0ganNvbi5kYXRhWzBdLnZhbHNbaV1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGF0YVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBEMyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuXHJcbmsuZDMgPSB7fVxyXG5cclxuay5kMy5saXZlX3NwYXJrbGluZSA9IGZ1bmN0aW9uKGlkLCBoaXN0b3J5KSB7XHJcbiAgICB2YXIgZGF0YSA9IGhpc3RvcnkuYXJyYXlcclxuICAgIHZhciBsZW5ndGggPSBoaXN0b3J5LmFycmF5Lmxlbmd0aFxyXG4gICAgdmFyIG4gPSBoaXN0b3J5Lm5cclxuICAgIC8vay5kMy5saXZlX3NwYXJrbGluZSA9IGZ1bmN0aW9uKGlkLCB3aWR0aCwgaGVpZ2h0LCBpbnRlcnBvbGF0aW9uLCBhbmltYXRlLCB1cGRhdGVEZWxheSwgdHJhbnNpdGlvbkRlbGF5KSB7XHJcbiAgICAvLyBiYXNlZCBvbiBjb2RlIHBvc3RlZCBieSBCZW4gQ2hyaXN0ZW5zZW4gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vYmVuamNocmlzdGVuc2VuLzExNDgzNzRcclxuXHJcbiAgICB2YXIgd2lkdGggPSA0MDAsXHJcbiAgICAgICAgaGVpZ2h0ID0gNTAsXHJcbiAgICAgICAgaW50ZXJwb2xhdGlvbiA9ICdiYXNpcycsXHJcbiAgICAgICAgYW5pbWF0ZSA9IHRydWUsXHJcbiAgICAgICAgdXBkYXRlRGVsYXkgPSAxMDAwLFxyXG4gICAgICAgIHRyYW5zaXRpb25EZWxheSA9IDEwMDBcclxuXHJcbiAgICAvLyBYIHNjYWxlIHdpbGwgZml0IHZhbHVlcyBmcm9tIDAtMTAgd2l0aGluIHBpeGVscyAwLTEwMFxyXG4gICAgLy8gc3RhcnRpbmcgcG9pbnQgaXMgLTUgc28gdGhlIGZpcnN0IHZhbHVlIGRvZXNuJ3Qgc2hvdyBhbmQgc2xpZGVzIG9mZiB0aGUgZWRnZSBhcyBwYXJ0IG9mIHRoZSB0cmFuc2l0aW9uXHJcbiAgICB2YXIgeCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgNTldKS5yYW5nZShbMCwgd2lkdGhdKTtcclxuICAgIC8vIFkgc2NhbGUgd2lsbCBmaXQgdmFsdWVzIGZyb20gMC0xMCB3aXRoaW4gcGl4ZWxzIDAtMTAwXHJcbiAgICB2YXIgeSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMjAsIDQwXSkucmFuZ2UoW2hlaWdodCwgMF0pO1xyXG5cclxuICAgIC8vIGNyZWF0ZSBhIGxpbmUgb2JqZWN0IHRoYXQgcmVwcmVzZW50cyB0aGUgU1ZOIGxpbmUgd2UncmUgY3JlYXRpbmdcclxuICAgIHZhciBsaW5lID0gZDMuc3ZnLmxpbmUoKVxyXG4gICAgICAgIC8vIGFzc2lnbiB0aGUgWCBmdW5jdGlvbiB0byBwbG90IG91ciBsaW5lIGFzIHdlIHdpc2hcclxuICAgICAgICAueChmdW5jdGlvbihkLGkpIHtcclxuICAgICAgICAgICAgLy8gdmVyYm9zZSBsb2dnaW5nIHRvIHNob3cgd2hhdCdzIGFjdHVhbGx5IGJlaW5nIGRvbmVcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnUGxvdHRpbmcgWCB2YWx1ZSBmb3IgZGF0YSBwb2ludDogJyArIGQgKyAnIHVzaW5nIGluZGV4OiAnICsgaSArICcgdG8gYmUgYXQ6ICcgKyB4KGkpICsgJyB1c2luZyBvdXIgeFNjYWxlLicpO1xyXG4gICAgICAgICAgICAvLyByZXR1cm4gdGhlIFggY29vcmRpbmF0ZSB3aGVyZSB3ZSB3YW50IHRvIHBsb3QgdGhpcyBkYXRhcG9pbnRcclxuICAgICAgICAgICAgcmV0dXJuIHgoaSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAueShmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgIC8vIHZlcmJvc2UgbG9nZ2luZyB0byBzaG93IHdoYXQncyBhY3R1YWxseSBiZWluZyBkb25lXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ1Bsb3R0aW5nIFkgdmFsdWUgZm9yIGRhdGEgcG9pbnQ6ICcgKyBkICsgJyB0byBiZSBhdDogJyArIHkoZCkgKyBcIiB1c2luZyBvdXIgeVNjYWxlLlwiKTtcclxuICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBZIGNvb3JkaW5hdGUgd2hlcmUgd2Ugd2FudCB0byBwbG90IHRoaXMgZGF0YXBvaW50XHJcbiAgICAgICAgICAgIHJldHVybiB5KGQpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmludGVycG9sYXRlKGludGVycG9sYXRpb24pXHJcblxyXG4gICAgLy8gSWYgc3ZnIGRvZXMgbm90IGV4aXN0LCBjcmVhdGUgaXRcclxuICAgIGlmKCAhIGQzLnNlbGVjdCgnIycraWQpLnNlbGVjdCgnc3ZnJylbMF1bMF0gKXtcclxuICAgICAgICAvLyBjcmVhdGUgYW4gU1ZHIGVsZW1lbnQgaW5zaWRlIHRoZSAjZ3JhcGggZGl2IHRoYXQgZmlsbHMgMTAwJSBvZiB0aGUgZGl2XHJcbiAgICAgICAgdmFyIGdyYXBoID0gZDMuc2VsZWN0KCcjJytpZCkuYXBwZW5kKFwic3ZnOnN2Z1wiKS5hdHRyKFwid2lkdGhcIiwgd2lkdGgpLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLy8gZGlzcGxheSB0aGUgbGluZSBieSBhcHBlbmRpbmcgYW4gc3ZnOnBhdGggZWxlbWVudCB3aXRoIHRoZSBkYXRhIGxpbmUgd2UgY3JlYXRlZCBhYm92ZVxyXG4vLyAgICAgICAgZ3JhcGguYXBwZW5kKFwic3ZnOnBhdGhcIikuYXR0cihcImRcIiwgbGluZShkYXRhKSk7XHJcbiAgICAgICAgLy8gb3IgaXQgY2FuIGJlIGRvbmUgbGlrZSB0aGlzXHJcbiAgICAgICAgZ3JhcGguc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKFtkYXRhXSkuZW50ZXIoKS5hcHBlbmQoXCJzdmc6cGF0aFwiKS5hdHRyKFwiZFwiLCBsaW5lKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZ3JhcGggPSBkMy5zZWxlY3QoJyMnK2lkKycgc3ZnJylcclxuICAgIGNvbnNvbGUubG9nKCBsZW5ndGgpXHJcbiAgICAvLyB1cGRhdGUgd2l0aCBhbmltYXRpb25cclxuICAgIGdyYXBoLnNlbGVjdEFsbChcInBhdGhcIilcclxuICAgICAgICAuZGF0YShbZGF0YV0pIC8vIHNldCB0aGUgbmV3IGRhdGFcclxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIHgobi1sZW5ndGggKzEpICsgXCIpXCIpIC8vIHNldCB0aGUgdHJhbnNmb3JtIHRvIHRoZSByaWdodCBieSB4KDEpIHBpeGVscyAoNiBmb3IgdGhlIHNjYWxlIHdlJ3ZlIHNldCkgdG8gaGlkZSB0aGUgbmV3IHZhbHVlXHJcbiAgICAgICAgLmF0dHIoXCJkXCIsIGxpbmUpIC8vIGFwcGx5IHRoZSBuZXcgZGF0YSB2YWx1ZXMgLi4uIGJ1dCB0aGUgbmV3IHZhbHVlIGlzIGhpZGRlbiBhdCB0aGlzIHBvaW50IG9mZiB0aGUgcmlnaHQgb2YgdGhlIGNhbnZhc1xyXG4gICAgICAgIC50cmFuc2l0aW9uKCkgLy8gc3RhcnQgYSB0cmFuc2l0aW9uIHRvIGJyaW5nIHRoZSBuZXcgdmFsdWUgaW50byB2aWV3XHJcbiAgICAgICAgLmVhc2UoXCJsaW5lYXJcIilcclxuICAgICAgICAuZHVyYXRpb24odHJhbnNpdGlvbkRlbGF5KSAvLyBmb3IgdGhpcyBkZW1vIHdlIHdhbnQgYSBjb250aW51YWwgc2xpZGUgc28gc2V0IHRoaXMgdG8gdGhlIHNhbWUgYXMgdGhlIHNldEludGVydmFsIGFtb3VudCBiZWxvd1xyXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgeChuLWxlbmd0aCkgKyBcIilcIik7IC8vIGFuaW1hdGUgYSBzbGlkZSB0byB0aGUgbGVmdCBiYWNrIHRvIHgoMCkgcGl4ZWxzIHRvIHJldmVhbCB0aGUgbmV3IHZhbHVlXHJcblxyXG4gICAgICAgIC8qIHRoYW5rcyB0byAnYmFycnltJyBmb3IgZXhhbXBsZXMgb2YgdHJhbnNmb3JtOiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS8xMTM3MTMxICovXHJcbi8vICAgICBncmFwaC5hcHBlbmQoXCJyZWN0XCIpXHJcbi8vICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4vLyAgICAgICAgICAuYXR0cihcInlcIiwgMClcclxuLy8gICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KVxyXG4vLyAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxyXG4vLyAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgJyNmMDAnKVxyXG4vLyAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwibm9uZVwiKVxyXG4vLyAgICAgICAgICAuc3R5bGUoXCJzdHJva2Utd2lkdGhcIiwgJzFweCcpXHJcblxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEV2ZW50cyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmsuZSA9IHt9XHJcblxyXG5rLnVwdGltZSA9IGZ1bmN0aW9uKGJvb3RfdGltZSl7XHJcbiAgICB2YXIgdXB0aW1lX3NlY29uZHNfdG90YWwgPSBtb21lbnQoKS5kaWZmKGJvb3RfdGltZSwgJ3NlY29uZHMnKVxyXG4gICAgdmFyIHVwdGltZV9ob3VycyA9IE1hdGguZmxvb3IoICB1cHRpbWVfc2Vjb25kc190b3RhbCAvKDYwKjYwKSApXHJcbiAgICB2YXIgbWludXRlc19sZWZ0ID0gdXB0aW1lX3NlY29uZHNfdG90YWwgJSg2MCo2MClcclxuICAgIHZhciB1cHRpbWVfbWludXRlcyA9IGsucGFkX3plcm8oIE1hdGguZmxvb3IoICBtaW51dGVzX2xlZnQgLzYwICksIDIgKVxyXG4gICAgdmFyIHVwdGltZV9zZWNvbmRzID0gay5wYWRfemVybyggKG1pbnV0ZXNfbGVmdCAlIDYwKSwgMiApXHJcbiAgICByZXR1cm4gdXB0aW1lX2hvdXJzICtcIjpcIisgdXB0aW1lX21pbnV0ZXMgK1wiOlwiKyB1cHRpbWVfc2Vjb25kc1xyXG59XHJcblxyXG5rLmUuYWRkVGltZVNpbmNlID0gZnVuY3Rpb24oZXZlbnRfbGlzdCl7XHJcbiAgICBjb25zb2xlLmxvZyhtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQnKSlcclxuICAgIGNvbnNvbGUubG9nKG1vbWVudCgpLmZyb21Ob3coKSlcclxuICAgIGV2ZW50X2xpc3QuZm9yRWFjaChmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgdmFyIGRhdGVfYXJyYXkgPSBldmVudC5kYXRlLnNwbGl0KCctJykubWFwKE51bWJlcilcclxuICAgICAgICB2YXIgeWVhciA9IGRhdGVfYXJyYXlbMF1cclxuICAgICAgICB2YXIgbW9udGggPSBkYXRlX2FycmF5WzFdXHJcbiAgICAgICAgdmFyIGRheSA9IGRhdGVfYXJyYXlbMl1cclxuICAgICAgICB2YXIgdGhpc195ZWFyID0gbW9tZW50KCkueWVhcigpXHJcbiAgICAgICAgaWYobW9tZW50KCkuZGlmZihtb21lbnQoW3RoaXNfeWVhciwgbW9udGgtMSwgZGF5XSksICdkYXlzJykgPiAwKSB7dGhpc195ZWFyKyt9XHJcbiAgICAgICAgdmFyIGV2ZW50X21vbWVudCA9IG1vbWVudChldmVudC5kYXRlLCAnWVlZWS1NTS1ERCcpXHJcbiAgICAgICAgdmFyIGRheXNfYWdvID0gbW9tZW50KCkuZGlmZihldmVudF9tb21lbnQsICdkYXknKVxyXG4gICAgICAgIGV2ZW50LnRpbWVfc2luY2UgPSBldmVudF9tb21lbnQuZnJvbU5vdygpXHJcbiAgICAgICAgZXZlbnQueWVhcnNfYWdvID0gbW9tZW50KCkuZGlmZihldmVudF9tb21lbnQsICd5ZWFycycpXHJcbiAgICAgICAgZXZlbnQuZGF5c190aWxsX25leHQgPSAtbW9tZW50KCkuZGlmZihtb21lbnQoW3RoaXNfeWVhciwgbW9udGgtMSwgZGF5XSksICdkYXlzJylcclxuICAgIH0pXHJcbiAgICBldmVudF9saXN0LnNvcnQoZnVuY3Rpb24oYSxiKXtcclxuICAgICAgICByZXR1cm4gYS5kYXlzX3RpbGxfbmV4dCAtIGIuZGF5c190aWxsX25leHRcclxuICAgIH0pXHJcbiAgICByZXR1cm4gZXZlbnRfbGlzdFxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRGlzcGxheXMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuay5kID0ge31cclxuXHJcbi8qXHJcbmsuZCA9IHtcclxuICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICB2YWx1ZTogMCxcclxuXHJcbn1cclxuXHJcbmsuZC5wcm90b3R5cGUuc2V0UGVyID0gZnVuY3Rpb24ocGVyY2VudCl7XHJcbiAgICB0aGlzLmJhci5jc3MoJ3dpZHRoJywgcGVyY2VudCsnJScpXHJcbn1cclxuKi9cclxuXHJcblxyXG4vKlxyXG5rLmQuYmFyID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBiYXIgPSB7fVxyXG5cclxuICAgIGJhci53aWR0aCA9IDEwMFxyXG4gICAgYmFyLndpZHRoX3VuaXQgPSAnJSdcclxuICAgIGJhci5oZWlnaHQgPSAnOHB4J1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGJhci53aWR0aCsnJScpXHJcbiAgICBiYXIuZGl2ID0gJCgnPGRpdj4nKS5jc3MoJ3dpZHRoJywgJzAlJylcclxuICAgIGJhci5lbGVtZW50ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygncHJvZ3Jlc3NiYXInKS5jc3MoJ3dpZHRoJywgMTAwKVxyXG4gICAgYmFyLmVsZW1lbnQuYXBwZW5kKGJhci5kaXYpXHJcblxyXG4gICAgYmFyLnNldFBlcmNlbnQgPSBmdW5jdGlvbihwZXJjZW50KXtcclxuICAgICAgICB0aGlzLndpZHRoID0gcGVyY2VudFxyXG4gICAgICAgIHRoaXMud2lkdGhfdW5pdCA9ICclJ1xyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuICAgIGJhci51cGRhdGUgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMuZGl2LmNzcygnd2lkdGgnLCB0aGlzLndpZHRoK3RoaXMud2lkdGhfdW5pdClcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY3NzKCdoZWlnaHQnLCB0b1N0cmluZyh0aGlzLmhlaWdodCkrJ3B4JylcclxuICAgIH1cclxuICAgIHJldHVybiBiYXJcclxufVxyXG4qL1xyXG5cclxuXHJcbi8vIEJyb3dzZXJpZnlcclxubW9kdWxlLmV4cG9ydHMgPSBrO1xyXG4iLCIndXNlIHN0cmljdCc7XG52YXIgbG9nID0gY29uc29sZS5sb2cuYmluZChjb25zb2xlKTtcblxudmFyIHZhbHVlID0gcmVxdWlyZSgnLi9rX0RPTV9leHRyYS5qcycpLnZhbHVlO1xudmFyIHNlbGVjdG9yID0gcmVxdWlyZSgnLi9rX0RPTV9leHRyYS5qcycpLnNlbGVjdG9yO1xuLy9sb2coICd2YWx1ZScsIHZhbHVlKCkgKTtcbi8vbG9nKCAnc2VsZWN0b3InLCBzZWxlY3RvcigpICk7IHZhciBrID0gcmVxdWlyZSgnLi9rJyk7IC8vdmFyIHNlbGVjdG9yID0gcmVxdWlyZSgnLi9rX0RPTV9leHRyYS5qcycpLnNlbGVjdG9yOyBcblxuXG52YXIgd3JhcHBlcl9wcm90b3R5cGUgPSByZXF1aXJlKCcuL3dyYXBwZXJfcHJvdG90eXBlJyk7XG5cbi8qXG52YXIgd3JhcHBlcl9wcm90b3R5cGUgPSB7XG5cbiAgICBodG1sOiBmdW5jdGlvbihodG1sKXtcbiAgICAgICB0aGlzLmVsZW0uaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGFwcGVuZDogZnVuY3Rpb24oc3ViX2VsZW1lbnQpe1xuICAgICAgICB0aGlzLmVsZW0uYXBwZW5kQ2hpbGQoc3ViX2VsZW1lbnQuZWxlbSk7IFxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGFwcGVuZFRvOiBmdW5jdGlvbihwYXJlbnRfZWxlbWVudCl7XG4gICAgICAgIHBhcmVudF9lbGVtZW50LmFwcGVuZCh0aGlzKTsgXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgYXR0cjogZnVuY3Rpb24obmFtZSwgdmFsdWUgKXtcbiAgICAgICAgdmFyIGF0dHJpYnV0ZU5hbWU7XG4gICAgICAgIGlmKCBuYW1lID09PSAnY2xhc3MnKXtcbiAgICAgICAgICAgIGF0dHJpYnV0ZU5hbWUgPSAnY2xhc3NOYW1lJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZU5hbWUgPSBuYW1lOyBcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1bYXR0cmlidXRlTmFtZV0gPSB2YWx1ZTsgXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cblxuXG59O1xuKi9cblxudmFyIFdyYXAgPSBmdW5jdGlvbihlbGVtZW50KXtcbiAgICB2YXIgVyA9IE9iamVjdC5jcmVhdGUod3JhcHBlcl9wcm90b3R5cGUpO1xuXG5cbiAgICBXLmVsZW0gPSBlbGVtZW50O1xuICAgIGlmKCBXLmVsZW0udGFnTmFtZSA9PT0gXCJTRUxFQ1RcIiApIHtcbiAgICAgICAgVy5zZXRPcHRpb25zID0gZnVuY3Rpb24oIG9wdGlvbl9hcnJheSApIHtcbiAgICAgICAgICAgIFcuZWxlbS5vcHRpb25zLmxlbmd0aCA9IDA7IFxuICAgICAgICAgICAgLy9sb2coXCJvcHRpb25fYXJyYXlcIiwgb3B0aW9uX2FycmF5KTtcbiAgICAgICAgICAgIG9wdGlvbl9hcnJheS5mb3JFYWNoKCBmdW5jdGlvbihvcHRpb25fc3RyLGkpe1xuICAgICAgICAgICAgICAgIHZhciBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgICAgICAgICBvcHQudGV4dCA9IG9wdGlvbl9zdHI7XG4gICAgICAgICAgICAgICAgb3B0LnZhbHVlID0gb3B0aW9uX3N0cjtcbiAgICAgICAgICAgICAgICBXLmVsZW0uYWRkKG9wdCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gVztcblxufTtcblxudmFyICQgPSBmdW5jdGlvbihpbnB1dCl7XG4gICAgdmFyIGVsZW1lbnQ7XG5cbiAgICBpZiggdHlwZW9mIGlucHV0ID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgLy9sb2coJ2lucHV0IG5lZWRlZCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmKCAoaW5wdXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgfHwgKGlucHV0IGluc3RhbmNlb2YgU1ZHRWxlbWVudCkgKXtcbiAgICAgICAgcmV0dXJuIFdyYXAoaW5wdXQpO1xuICAgIH1cbiAgICBpZiggaW5wdXQuc3Vic3RyKDAsMSkgPT09ICcjJyApIHtcbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlucHV0LnN1YnN0cigxKSk7XG4gICAgICAgIHJldHVybiBXcmFwKGVsZW1lbnQpO1xuICAgIH0gZWxzZSBpZiggaW5wdXQuc3Vic3RyKDAsMSkgPT09ICcuJyApIHtcbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUNsYXNzTmFtZShpbnB1dC5zdWJzdHIoMSlbMF0pO1xuICAgICAgICByZXR1cm4gV3JhcChlbGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiggaW5wdXQgPT09ICd2YWx1ZScgKSB7XG4gICAgICAgICAgICBpZiggdmFsdWUgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gdmFsdWUoKTsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IHZhbHVlIG5vdCBkZWZpbmVkXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmKCBpbnB1dCA9PT0gJ3NlbGVjdG9yJyApIHtcbiAgICAgICAgICAgIGlmKCBzZWxlY3RvciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBzZWxlY3RvcigpOyBcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogc2VsZWN0b3Igbm90IGRlZmluZWRcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuIFdyYXAoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG5cblxufTtcblxuLy8gQnJvd3NlcmlmeVxubW9kdWxlLmV4cG9ydHMgPSAkO1xuLy9tb2R1bGUuZXhwb3J0cy53cmFwcGVyX3Byb3RvdHlwZSA9IHdyYXBwZXJfcHJvdG90eXBlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgayA9IHJlcXVpcmUoJy4vay5qcycpO1xudmFyIGtvbnRhaW5lciA9IHJlcXVpcmUoJy4va29udGFpbmVyJyk7XG5cbnZhciBrX0RPTSA9IHJlcXVpcmUoJy4va19ET00uanMnKTtcbnZhciB3cmFwcGVyX3Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vd3JhcHBlcl9wcm90b3R5cGUnKTtcblxuXG52YXIgc2VsZWN0b3JfcHJvdG90eXBlID0ge1xuICAgIGNoYW5nZTogZnVuY3Rpb24obmV3X3ZhbHVlKXtcbiAgICAgICAgdGhpcy5zZXRfdmFsdWUoKTtcblxuICAgICAgICBpZiggdGhpcy5nX3VwZGF0ZSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLmdfdXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldF92YWx1ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIHRoaXMuZWxlbS5vcHRpb25zW3RoaXMuZWxlbS5zZWxlY3RlZEluZGV4XSAmJiB0aGlzLmVsZW0ub3B0aW9uc1t0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleF0udmFsdWUgKXtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3NlbGVjdGVkX3ZhbHVlJywgdGhpcy5lbGVtLm9wdGlvbnNbdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXhdLnZhbHVlKTtcbiAgICAgICAgICAgIHZhciBuZXdfdmFsdWUgPSB0aGlzLmVsZW0ub3B0aW9uc1t0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4gICAgICAgICAgICBpZiggdGhpcy5vcHRpb25zS29udGFpbmVyLnJlYWR5ICkge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2tvbnRhaW5lciByZWFkeSwgc2V0dGluZyB0bzogJywgbmV3X3ZhbHVlKVxuICAgICAgICAgICAgICAgIC8vaWYoICEgaXNOYU4ocGFyc2VGbG9hdChuZXdfdmFsdWUpKSkgbmV3X3ZhbHVlID0gcGFyc2VGbG9hdChuZXdfdmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMua29udGFpbmVyLnNldChuZXdfdmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBuZXdfdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpe1xuICAgICAgICAvL2NvbnNvbGUubG9nKCd1cGRhdGluZzogJywgdGhpcylcbiAgICAgICAgLy90aGlzLnNldF92YWx1ZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZV9vcHRpb25zKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgdXBkYXRlX29wdGlvbnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBvbGRfdmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICBpZiggdGhpcy5rb250YWluZXIucmVhZHkgKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5rb250YWluZXIuZ2V0KCk7XG4gICAgICAgICAgICBpZiggdHlwZW9mIHRoaXMudmFsdWUgPT0gXCJvYmplY3RcIikgdGhpcy52YWx1ZSA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCB0aGlzLm9wdGlvbnNLb250YWluZXIucmVhZHkgJiYgdGhpcy5rb250YWluZXIucmVhZHkgKSB7XG4gICAgICAgICAgICB2YXIgb2xkX29wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnNLb250YWluZXIuZ2V0KCk7XG4gICAgICAgICAgICBpZiggdGhpcy5vcHRpb25zIGluc3RhbmNlb2YgQXJyYXkgKXtcbiAgICAgICAgICAgICAgICAvL3RoaXMub3B0aW9ucy51bnNoaWZ0KCcnKTtcbiAgICAgICAgICAgICAgICBpZiggdGhpcy5vcHRpb25zICE9PSBvbGRfb3B0aW9uc3x8IHRoaXMudmFsdWUgIT09IG9sZF92YWx1ZSApe1xuICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy5vcHRpb25zICE9PSB1bmRlZmluZWQgJiYgdGhpcy5vcHRpb25zIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy5lbGVtLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtLmlubmVySFRNTCA9ICc8b3B0aW9uIHNlbGVjdGVkIGRpc2FibGVkIGhpZGRlbj48L29wdGlvbj4nXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSxpZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHRoaXMudmFsdWUgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHZhbHVlLnRvU3RyaW5nKCkgPT09IHRoaXMudmFsdWUudG9TdHJpbmcoKSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2ZvdW5kIGl0OicsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uc2VsZWN0ZWQgPSBcInNlbGVjdGVkXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdkb2VzIG5vdCBtYXRjaDogJywgdmFsdWUsIHRoaXMudmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VsZWN0b3Jfb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnbm8gY3VycmVudCB2YWx1ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbS5hcHBlbmRDaGlsZChvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdG9yX29iaiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rvcl9vYmouY2hhbmdlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2lmKCAhICh0aGlzLm9wdGlvbnMuaW5kZXhPZih0aGlzLmtvbnRhaW5lci5nZXQoKSkrMSkgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgIHRoaXMuc2V0X3ZhbHVlKHRoaXMub3B0aW9uc1swXS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXRVcGRhdGU6IGZ1bmN0aW9uKHVwZGF0ZV9mdW5jdGlvbil7XG4gICAgICAgIHRoaXMuZ191cGRhdGUgPSB1cGRhdGVfZnVuY3Rpb247XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0UmVmOiBmdW5jdGlvbihyZWZTdHJpbmcpe1xuICAgICAgICB0aGlzLnJlZlN0cmluZyA9IHJlZlN0cmluZztcbiAgICAgICAgaWYoIHRoaXMua29udGFpbmVyID09PSB1bmRlZmluZWQgJiYgdGhpcy5yZWZPYmplY3QgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMua29udGFpbmVyICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lci5yZWYodGhpcy5yZWZTdHJpbmcpO1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIub2JqKHRoaXMucmVmT2JqZWN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0UmVmT2JqOiBmdW5jdGlvbihyZWZPYmplY3Qpe1xuICAgICAgICB0aGlzLnJlZk9iamVjdCA9IHJlZk9iamVjdDtcbiAgICAgICAgaWYoIHRoaXMua29udGFpbmVyID09PSB1bmRlZmluZWQgJiYgdGhpcy5yZWZTdHJpbmcgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMua29udGFpbmVyICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lci5yZWYodGhpcy5yZWZTdHJpbmcpO1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIub2JqKHRoaXMucmVmT2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiggdGhpcy5vcHRpb25zS29udGFpbmVyID09PSB1bmRlZmluZWQgJiYgdGhpcy5yZWZPcHRpb25zU3RyaW5nICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc0tvbnRhaW5lciA9IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiggdGhpcy5vcHRpb25zS29udGFpbmVyICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNLb250YWluZXIucmVmKHRoaXMucmVmT3B0aW9uc1N0cmluZyk7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNLb250YWluZXIub2JqKHRoaXMucmVmT2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldE9wdGlvbnNSZWY6IGZ1bmN0aW9uKHJlZlN0cmluZyl7XG4gICAgICAgIHRoaXMucmVmT3B0aW9uc1N0cmluZyA9IHJlZlN0cmluZztcbiAgICAgICAgaWYoIHRoaXMub3B0aW9uc0tvbnRhaW5lciA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmVmT2JqZWN0ICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc0tvbnRhaW5lciA9IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiggdGhpcy5vcHRpb25zS29udGFpbmVyICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNLb250YWluZXIucmVmKHRoaXMucmVmT3B0aW9uc1N0cmluZyk7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNLb250YWluZXIub2JqKHRoaXMucmVmT2JqZWN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG59O1xuZm9yKCB2YXIgaWQgaW4gd3JhcHBlcl9wcm90b3R5cGUgKSB7XG4gICAgaWYoIHdyYXBwZXJfcHJvdG90eXBlLmhhc093blByb3BlcnR5KGlkKSApIHtcbiAgICAgICAgc2VsZWN0b3JfcHJvdG90eXBlW2lkXSA9IHdyYXBwZXJfcHJvdG90eXBlW2lkXTtcbiAgICB9XG59XG5cbnZhciBzZWxlY3RvciA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHMgPSBPYmplY3QuY3JlYXRlKHNlbGVjdG9yX3Byb3RvdHlwZSk7XG4gICAgcy50eXBlID0gJ3NlbGVjdG9yJztcbiAgICBzLmVsZW09IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgIHMuZWxlbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlbGVjdG9yX21lbnUnKTtcblxuICAgIHJldHVybiBzO1xufTtcblxuXG5cblxuXG52YXIgdmFsdWVfcHJvdG90eXBlID0ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZygncnVubmluZyB2YWx1ZSB1cGRhdGUnLCB0aGlzKVxuICAgICAgICAvKlxuICAgICAgICBpZiggdGhpcy5nX3VwZGF0ZSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLmdfdXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgKi9cbiAgICAgICB2YXIgZGVjaW1hbHMgPSB0aGlzLmRlY2ltYWxzIHx8IDM7XG4gICAgICAgIGlmKCB0eXBlb2YgdGhpcy5rb250YWluZXIgIT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5rb250YWluZXIuZ2V0KCk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCd1cGRhdGluZyB2YWx1ZScsIHRoaXMudmFsdWUpXG4gICAgICAgIH1cbiAgICAgICAgaWYoIGlzTmFOKE51bWJlcih0aGlzLnZhbHVlKSkgKXtcbiAgICAgICAgICAgIHRoaXMuZWxlbS5pbm5lckhUTUwgPSB0aGlzLnZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtLmlubmVySFRNTCA9IE51bWJlcih0aGlzLnZhbHVlKS50b0ZpeGVkKGRlY2ltYWxzKTtcbiAgICAgICAgICAgIGlmKCB0aGlzLm1pbiAhPT0gdW5kZWZpbmVkICYmIHRoaXMudmFsdWUgPD0gdGhpcy5taW4gKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyKCdjbGFzcycsICd2YWx1ZU91dE9mUmFuZ2UnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiggdGhpcy5tYXggIT09IHVuZGVmaW5lZCAmJiB0aGlzLnZhbHVlID49IHRoaXMubWF4ICkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0cignY2xhc3MnLCAndmFsdWVPdXRPZlJhbmdlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0cignY2xhc3MnLCAnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKG5ld192YWx1ZSkge1xuICAgICAgICBpZiggdHlwZW9mIG5ld192YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgKXtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBuZXdfdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbi8vICAgIHNldFVwZGF0ZTogZnVuY3Rpb24odXBkYXRlX2Z1bmN0aW9uKXtcbi8vICAgICAgICB0aGlzLmdfdXBkYXRlID0gdXBkYXRlX2Z1bmN0aW9uO1xuLy8gICAgfSxcbiAgICBzZXRSZWY6IGZ1bmN0aW9uKHJlZlN0cmluZyl7XG4gICAgICAgIHRoaXMucmVmU3RyaW5nID0gcmVmU3RyaW5nO1xuICAgICAgICBpZiggdGhpcy5rb250YWluZXIgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlZk9iamVjdCAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lciA9IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiggdGhpcy5rb250YWluZXIgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLnJlZih0aGlzLnJlZlN0cmluZyk7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lci5vYmoodGhpcy5yZWZPYmplY3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXRSZWZPYmo6IGZ1bmN0aW9uKHJlZk9iamVjdCl7XG4gICAgICAgIHRoaXMucmVmT2JqZWN0ID0gcmVmT2JqZWN0O1xuICAgICAgICBpZiggdGhpcy5rb250YWluZXIgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlZlN0cmluZyAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lciA9IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiggdGhpcy5rb250YWluZXIgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLnJlZih0aGlzLnJlZlN0cmluZyk7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lci5vYmoodGhpcy5yZWZPYmplY3QpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0TWF4OiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgIHRoaXMubWF4ID0gdmFsdWU7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0TWluOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgIHRoaXMubWluID0gdmFsdWU7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0RGVjaW1hbHM6IGZ1bmN0aW9uKG4pe1xuICAgICAgICB0aGlzLmRlY2ltYWxzID0gbjtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbn07XG5mb3IoIHZhciBpZCBpbiB3cmFwcGVyX3Byb3RvdHlwZSApIHtcbiAgICBpZiggd3JhcHBlcl9wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoaWQpICkge1xuICAgICAgICB2YWx1ZV9wcm90b3R5cGVbaWRdID0gd3JhcHBlcl9wcm90b3R5cGVbaWRdO1xuICAgIH1cbn1cblxuXG5cbmZ1bmN0aW9uIHZhbHVlKCkge1xuICAgIHZhciB2ID0gT2JqZWN0LmNyZWF0ZSh2YWx1ZV9wcm90b3R5cGUpO1xuICAgIHYudHlwZSA9ICd2YWx1ZSc7XG4gICAgdi5lbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXG4gICAgdi52YWx1ZSA9ICctJztcbiAgICB2LmlubmVySFRNTCA9IHYudmFsdWU7XG4gICAgdi5yZWZlcmVuY2UgPSBmYWxzZTtcblxuXG4gICAgdi51cGRhdGUoKTtcblxuICAgIHJldHVybiB2O1xufVxuXG5cblxuLy8gQnJvd3NlcmlmeVxubW9kdWxlLmV4cG9ydHMuc2VsZWN0b3IgPSBzZWxlY3Rvcjtcbm1vZHVsZS5leHBvcnRzLnZhbHVlID0gdmFsdWU7XG4vL21vZHVsZS5leHBvcnRzLiQgPSAkO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIga29udGFpbmVyID0ge1xuICAgIHJlZjogZnVuY3Rpb24ocmVmU3RyaW5nKXtcbiAgICAgICAgaWYoIHR5cGVvZiByZWZTdHJpbmcgPT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWZTdHJpbmc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlZlN0cmluZyA9IHJlZlN0cmluZztcbiAgICAgICAgICAgIHRoaXMucmVmQXJyYXkgPSByZWZTdHJpbmcuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIGlmKCB0eXBlb2YgdGhpcy5vYmplY3QgIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgb2JqOiBmdW5jdGlvbihvYmope1xuICAgICAgICBpZiggdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9iamVjdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0ID0gb2JqO1xuICAgICAgICAgICAgaWYoIHR5cGVvZiB0aGlzLnJlZlN0cmluZyAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKGlucHV0KXtcbiAgICAgICAgaWYoIHR5cGVvZiB0aGlzLm9iamVjdCA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHRoaXMucmVmU3RyaW5nID09PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLm9iamVjdDtcbiAgICAgICAgdmFyIGxhc3RfbGV2ZWwgPSB0aGlzLnJlZkFycmF5W3RoaXMucmVmQXJyYXkubGVuZ3RoLTFdO1xuXG4gICAgICAgIHRoaXMucmVmQXJyYXkuZm9yRWFjaChmdW5jdGlvbihsZXZlbF9uYW1lLGkpe1xuICAgICAgICAgICAgaWYoIHR5cGVvZiBwYXJlbnRbbGV2ZWxfbmFtZV0gPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgIHBhcmVudFtsZXZlbF9uYW1lXSA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoIGxldmVsX25hbWUgIT09IGxhc3RfbGV2ZWwgKXtcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnRbbGV2ZWxfbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBwYXJlbnRbbGFzdF9sZXZlbF0gPSBpbnB1dDtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnc2V0dGluZzonLCBpbnB1dCwgdGhpcy5nZXQoKSwgdGhpcy5yZWZTdHJpbmcgKTtcbiAgICAgICAgcmV0dXJuIHBhcmVudFtsYXN0X2xldmVsXTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGxldmVsID0gdGhpcy5vYmplY3Q7XG4gICAgICAgIHRoaXMucmVmQXJyYXkuZm9yRWFjaChmdW5jdGlvbihsZXZlbF9uYW1lLGkpe1xuICAgICAgICAgICAgaWYoIHR5cGVvZiBsZXZlbFtsZXZlbF9uYW1lXSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV2ZWwgPSBsZXZlbFtsZXZlbF9uYW1lXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBsZXZlbDtcbiAgICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrb250YWluZXI7XG4iLCJ2YXIgd3JhcHBlcl9wcm90b3R5cGUgPSB7XG5cbiAgICBodG1sOiBmdW5jdGlvbihodG1sKXtcbiAgICAgICB0aGlzLmVsZW0uaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGhyZWY6IGZ1bmN0aW9uKGxpbmspe1xuICAgICAgIHRoaXMuZWxlbS5ocmVmID0gbGluaztcbiAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGFwcGVuZDogZnVuY3Rpb24oc3ViX2VsZW1lbnQpe1xuICAgICAgICB0aGlzLmdldCgwKS5hcHBlbmRDaGlsZChzdWJfZWxlbWVudC5lbGVtKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBhcHBlbmRUbzogZnVuY3Rpb24ocGFyZW50X2VsZW1lbnQpe1xuICAgICAgICAvL3BhcmVudF9lbGVtZW50LmFwcGVuZCh0aGlzKTtcbiAgICAgICAgcGFyZW50X2VsZW1lbnQuZ2V0KDApLmFwcGVuZENoaWxkKHRoaXMuZWxlbSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgYXR0cjogZnVuY3Rpb24obmFtZSwgdmFsdWUpe1xuICAgICAgICB2YXIgYXR0cmlidXRlTmFtZTtcbiAgICAgICAgaWYoIG5hbWUgPT09ICdjbGFzcycpe1xuICAgICAgICAgICAgYXR0cmlidXRlTmFtZSA9ICdjbGFzc05hbWUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0cmlidXRlTmFtZSA9IG5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtW2F0dHJpYnV0ZU5hbWVdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY2xpY2s6IGZ1bmN0aW9uKGNsaWNrRnVuY3Rpb24pe1xuICAgICAgICBjb25zb2xlLmxvZygnc2V0dGluZyBjbGljayB0byAnLCB0eXBlb2YgY2xpY2tGdW5jdGlvbiwgY2xpY2tGdW5jdGlvbilcbiAgICAgICAgdGhpcy5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpeyBjbGlja0Z1bmN0aW9uKCk7IH0sIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzaG93OiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLmVsZW0uc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUnO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGhpZGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHN0eWxlOiBmdW5jdGlvbihmaWVsZCwgdmFsdWUpe1xuICAgICAgICB0aGlzLmVsZW0uc3R5bGVbZmllbGRdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY3NzOiBmdW5jdGlvbihmaWVsZCwgdmFsdWUpe1xuICAgICAgICB0aGlzLmVsZW0uc3R5bGVbZmllbGRdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgLypcbiAgICAvKlxuICAgIHB1c2hUbzogZnVuY3Rpb24oYXJyYXkpe1xuICAgICAgICBhcnJheS5wdXNoKHRoaXMpO1xuICAgIH1cbiAgICAqL1xuICAgIGdldDogZnVuY3Rpb24oaSl7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1cbn1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB3cmFwcGVyX3Byb3RvdHlwZTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vdmFyIHZlcnNpb25fc3RyaW5nID0gJ0Rldic7XG4vL3ZhciB2ZXJzaW9uX3N0cmluZyA9ICdBbHBoYTIwMTQwMS0tJztcbnZhciB2ZXJzaW9uX3N0cmluZyA9ICdQcmV2aWV3Jyttb21lbnQoKS5mb3JtYXQoJ1lZWVlNTUREJyk7XG5cbi8vIE1vdmVkIHRvIGluZGV4Lmh0bWxcbi8vIFRPRE86IGxvb2sgaW50byB3YXlzIHRvIGZ1cnRoZXIgcmVkdWNlIHNpemUuIEl0IHNlZW1zIHdheSB0byBiaWcuXG4vL3ZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuLy92YXIgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XG4vL3ZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbnZhciBrID0gcmVxdWlyZSgnLi9saWIvay9rLmpzJyk7XG4vL3ZhciBrX2RhdGEgPSByZXF1aXJlKCcuL2xpYi9rL2tfZGF0YScpO1xuXG52YXIgc2V0dGluZ3MgPSByZXF1aXJlKCcuL2FwcC9zZXR0aW5ncycpO1xud2luZG93LmcgPSBzZXR0aW5ncztcbnNldHRpbmdzLnN0YXRlLnZlcnNpb25fc3RyaW5nID0gdmVyc2lvbl9zdHJpbmc7XG5jb25zb2xlLmxvZygnc2V0dGluZ3MnLCBzZXR0aW5ncyk7XG5cbnZhciBta19ibG9ja3MgPSByZXF1aXJlKCcuL2FwcC9ta19ibG9ja3MnKTtcblxudmFyIG1rX3BhZ2UgPSB7fTtcbm1rX3BhZ2VbMV0gPSByZXF1aXJlKCcuL2FwcC9ta19wYWdlXzEnKTtcbm1rX3BhZ2VbMl0gPSByZXF1aXJlKCcuL2FwcC9ta19wYWdlXzInKTtcbm1rX3BhZ2VbM10gPSByZXF1aXJlKCcuL2FwcC9ta19wYWdlXzMnKTtcbm1rX3BhZ2VbNF0gPSByZXF1aXJlKCcuL2FwcC9ta19wYWdlXzQnKTtcblxudmFyIG1rX3ByZXZpZXcgPSB7fTtcbm1rX3ByZXZpZXdbMV0gPSByZXF1aXJlKCcuL2FwcC9ta19wYWdlX3ByZXZpZXdfMScpO1xubWtfcHJldmlld1syXSA9IHJlcXVpcmUoJy4vYXBwL21rX3BhZ2VfcHJldmlld18yJyk7XG5cbnZhciBta19zdmc9IHJlcXVpcmUoJy4vYXBwL21rX3N2ZycpO1xuLy92YXIgbWtfcGRmID0gcmVxdWlyZSgnLi9hcHAvbWtfcGRmLmpzJyk7XG52YXIgc2V0dGluZ3NfdXBkYXRlID0gcmVxdWlyZSgnLi9hcHAvc2V0dGluZ3NfdXBkYXRlJyk7XG5cblxuXG52YXIgZiA9IHJlcXVpcmUoJy4vYXBwL2Z1bmN0aW9ucycpO1xuZi5zZXR0aW5ncyA9IHNldHRpbmdzO1xuc2V0dGluZ3MuZiA9IGY7XG5cbi8vdmFyIGRhdGFiYXNlX2pzb25fVVJMID0gJ2h0dHA6Ly8xMC4xNzMuNjQuMjA0OjgwMDAvdGVtcG9yYXJ5Lyc7XG52YXIgZGF0YWJhc2VfanNvbl9VUkwgPSAnZGF0YS9mc2VjX2NvcHkuanNvbic7XG5cbnZhciBjb21wb25lbnRzID0gc2V0dGluZ3MuY29tcG9uZW50cztcbnZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5cblxudmFyIHF1ZXJ5ID0gZi5xdWVyeV9zdHJpbmcoKTtcbi8vY29uc29sZS5sb2cocXVlcnkpO1xuaWYoIHF1ZXJ5Wydtb2RlJ10gPT09IFwiZGV2XCIgKSB7XG4gICAgZy5zdGF0ZS5tb2RlID0gJ2Rldic7XG59IGVsc2Uge1xuICAgIGcuc3RhdGUubW9kZSA9ICdyZWxlYXNlJztcbn1cblxuXG5cbiQuZ2V0SlNPTiggZGF0YWJhc2VfanNvbl9VUkwpXG4gICAgLmRvbmUoZnVuY3Rpb24oanNvbil7XG4gICAgICAgIHNldHRpbmdzLmRhdGFiYXNlID0ganNvbjtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnZGF0YWJhc2UgbG9hZGVkJywgc2V0dGluZ3MuZGF0YWJhc2UpO1xuICAgICAgICBmLmxvYWRfZGF0YWJhc2UoanNvbik7XG4gICAgICAgIHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCA9IHRydWU7XG4gICAgICAgIHVwZGF0ZSgpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCAnc2V0dGluZ3MuZWxlbWVudHMnLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncy5lbGVtZW50cywgbnVsbCwgNCkpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCAnc3lzdGVtJywgSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3Muc3lzdGVtLCBudWxsLCA0KSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coICdpbnB1dHMnLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncy5pbnB1dHMsIG51bGwsIDQpKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggJ2RyYXdpbmcnLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncy5kcmF3aW5nLCBudWxsLCA0KSk7XG4gICAgfSk7XG5cblxudmFyIGFjdGl2ZV9zZWN0aW9uID0gZy53ZWJwYWdlLnNlY3Rpb25zWzBdO1xuXG52YXIgdXBkYXRlID0gc2V0dGluZ3MudXBkYXRlID0gZnVuY3Rpb24oKXtcbiAgICBjb25zb2xlLmxvZygnLy0tLSBiZWdpbiB1cGRhdGUnKTtcbiAgICBmLmNsZWFyX2RyYXdpbmcoKTtcblxuXG4gICAgc2V0dGluZ3Muc2VsZWN0X3JlZ2lzdHJ5LmZvckVhY2goZnVuY3Rpb24oc2VsZWN0b3Ipe1xuICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGVjdG9yLnZhbHVlKCkpO1xuICAgICAgICBpZihzZWxlY3Rvci52YWx1ZSgpKSBzZWxlY3Rvci5zeXN0ZW1fcmVmLnNldChzZWxlY3Rvci52YWx1ZSgpKTtcbiAgICAgICAgLy9pZihzZWxlY3Rvci52YWx1ZSgpKSBzZWxlY3Rvci5pbnB1dF9yZWYuc2V0KHNlbGVjdG9yLnZhbHVlKCkpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGVjdG9yLnNldF9yZWYucmVmU3RyaW5nLCBzZWxlY3Rvci52YWx1ZSgpLCBzZWxlY3Rvci5zZXRfcmVmLmdldCgpKTtcblxuICAgIH0pO1xuXG5cbiAgICAvL2NvcHkgaW5wdXRzIGZyb20gc2V0dGluZ3MuaW5wdXQgdG8gc2V0dGluZ3Muc3lzdGVtLlxuXG5cbiAgICBzZXR0aW5nc191cGRhdGUoc2V0dGluZ3MpO1xuXG4gICAgc2V0dGluZ3Muc2VsZWN0X3JlZ2lzdHJ5LmZvckVhY2goZnVuY3Rpb24oc2VsZWN0b3Ipe1xuICAgICAgICBpZiggc2VsZWN0b3IudHlwZSA9PT0gJ3NlbGVjdCcgKXtcbiAgICAgICAgICAgIGYuc2VsZWN0b3JfYWRkX29wdGlvbnMoc2VsZWN0b3IpO1xuICAgICAgICB9IGVsc2UgaWYoIHNlbGVjdG9yLnR5cGUgPT09ICdpbnB1dCcgKSB7XG4gICAgICAgICAgICBzZWxlY3Rvci5lbGVtLnZhbHVlID0gc2VsZWN0b3Iuc3lzdGVtX3JlZi5nZXQoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2V0dGluZ3MudmFsdWVfcmVnaXN0cnkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZV9pdGVtKXtcbiAgICAgICAgdmFsdWVfaXRlbS5lbGVtLmlubmVySFRNTCA9IHZhbHVlX2l0ZW0udmFsdWVfcmVmLmdldCgpO1xuICAgIH0pO1xuXG4gICAgLy8gRGV0ZXJtaW5lIGFjdGl2ZSBzZWN0aW9uIGJhc2VkIG9uIHNlY3Rpb24gaW5wdXRzIGVudGVyZWQgYnkgdXNlclxuICAgIHZhciBzZWN0aW9ucyA9IGcud2VicGFnZS5zZWN0aW9ucztcbiAgICBzZWN0aW9ucy5ldmVyeShmdW5jdGlvbihzZWN0aW9uX25hbWUsaWQpeyAvL1RPRE86IGZpbmQgcHJlIElFOSB3YXkgdG8gZG8gdGhpcz9cbiAgICAgICAgaWYoICEgZy5mLnNlY3Rpb25fZGVmaW5lZChzZWN0aW9uX25hbWUpICl7XG4gICAgICAgICAgICBhY3RpdmVfc2VjdGlvbiA9IHNlY3Rpb25fbmFtZTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKCBpZCA9PT0gc2VjdGlvbnMubGVuZ3RoLTEgKXsgLy9JZiBsYXN0IHNlY3Rpb24gaXMgZGVmaW5lZCwgdGhlcmUgaXMgbm8gYWN0aXZlIHNlY3Rpb25cbiAgICAgICAgICAgICAgICBhY3RpdmVfc2VjdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBDbG9zZSBzZWN0aW9uIGlmIHRoZXkgYXJlIG5vdCBhY3RpdmUgc2VjdGlvbnMsIHVubGVzcyB0aGV5IGhhdmUgYmVlbiBvcGVuZWQgYnkgdGhlIHVzZXIsIG9wZW4gdGhlIGFjdGl2ZSBzZWN0aW9uXG4gICAgc2VjdGlvbnMuZm9yRWFjaChmdW5jdGlvbihzZWN0aW9uX25hbWUsaWQpeyAvL1RPRE86IGZpbmQgcHJlIElFOSB3YXkgdG8gZG8gdGhpcz9cbiAgICAgICAgaWYoIHNlY3Rpb25fbmFtZSA9PT0gYWN0aXZlX3NlY3Rpb24gKXtcbiAgICAgICAgICAgICQoJy5pbnB1dF9zZWN0aW9uIycrc2VjdGlvbl9uYW1lKS5jaGlsZHJlbignLmRyYXdlcicpLmNoaWxkcmVuKCcuZHJhd2VyX2NvbnRlbnQnKS5zbGlkZURvd24oJ2Zhc3QnKTtcbiAgICAgICAgfSBlbHNlIGlmKCAhIGcud2VicGFnZS5zZWxlY3Rpb25zX21hbnVhbF90b2dnbGVkW3NlY3Rpb25fbmFtZV0gKXtcbiAgICAgICAgICAgICQoJy5pbnB1dF9zZWN0aW9uIycrc2VjdGlvbl9uYW1lKS5jaGlsZHJlbignLmRyYXdlcicpLmNoaWxkcmVuKCcuZHJhd2VyX2NvbnRlbnQnKS5zbGlkZVVwKCdmYXN0Jyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgLy8gTWFrZSBibG9ja3NcbiAgICBta19ibG9ja3MoKTtcblxuICAgIC8vIE1ha2UgcHJldmlld1xuICAgIHNldHRpbmdzLmRyYXdpbmcucHJldmlld19wYXJ0cyA9IHt9O1xuICAgIHNldHRpbmdzLmRyYXdpbmcucHJldmlld19zdmdzID0ge307XG4gICAgJCgnI2RyYXdpbmdfcHJldmlldycpLmVtcHR5KCkuaHRtbCgnJyk7XG4gICAgZm9yKCB2YXIgcCBpbiBta19wcmV2aWV3ICl7XG4gICAgICAgIHNldHRpbmdzLmRyYXdpbmcucHJldmlld19wYXJ0c1twXSA9IG1rX3ByZXZpZXdbcF0oc2V0dGluZ3MpO1xuICAgICAgICBzZXR0aW5ncy5kcmF3aW5nLnByZXZpZXdfc3Znc1twXSA9IG1rX3N2ZyhzZXR0aW5ncy5kcmF3aW5nLnByZXZpZXdfcGFydHNbcF0sIHNldHRpbmdzKTtcbiAgICAgICAgdmFyIHNlY3Rpb24gPSBbJycsJ0VsZWN0cmljYWwnLCdTdHJ1Y3R1cmFsJ11bcF07XG4gICAgICAgICQoJyNkcmF3aW5nX3ByZXZpZXcnKVxuICAgICAgICAgICAgLy8uYXBwZW5kKCQoJzxwPlBhZ2UgJytwKyc8L3A+JykpXG4gICAgICAgICAgICAuYXBwZW5kKCQoJzxwPicrc2VjdGlvbisnPC9wPicpKVxuICAgICAgICAgICAgLmFwcGVuZCgkKHNldHRpbmdzLmRyYXdpbmcucHJldmlld19zdmdzW3BdKSlcbiAgICAgICAgICAgIC5hcHBlbmQoJCgnPC9icj4nKSlcbiAgICAgICAgICAgIC5hcHBlbmQoJCgnPC9icj4nKSk7XG5cbiAgICB9XG5cblxuXG4gICAgLy8gTWFrZSBkcmF3aW5nXG4gICAgc2V0dGluZ3MuZHJhd2luZy5wYXJ0cyA9IHt9O1xuICAgIHNldHRpbmdzLmRyYXdpbmcuc3ZncyA9IHt9O1xuICAgICQoJyNkcmF3aW5nJykuZW1wdHkoKS5odG1sKCdFbGVjdHJpY2FsJyk7XG4gICAgZm9yKCBwIGluIG1rX3BhZ2UgKXtcbiAgICAgICAgc2V0dGluZ3MuZHJhd2luZy5wYXJ0c1twXSA9IG1rX3BhZ2VbcF0oc2V0dGluZ3MpO1xuICAgICAgICBzZXR0aW5ncy5kcmF3aW5nLnN2Z3NbcF0gPSBta19zdmcoc2V0dGluZ3MuZHJhd2luZy5wYXJ0c1twXSwgc2V0dGluZ3MpO1xuICAgICAgICAkKCcjZHJhd2luZycpXG4gICAgICAgICAgICAvLy5hcHBlbmQoJCgnPHA+UGFnZSAnK3ArJzwvcD4nKSlcbiAgICAgICAgICAgIC5hcHBlbmQoJChzZXR0aW5ncy5kcmF3aW5nLnN2Z3NbcF0pKVxuICAgICAgICAgICAgLmFwcGVuZCgkKCc8L2JyPicpKVxuICAgICAgICAgICAgLmFwcGVuZCgkKCc8L2JyPicpKTtcblxuICAgIH1cblxuXG5cblxuXG4gICAgLy8qL1xuICAgIC8vdmFyIHBkZl9kb3dubG9hZCA9IG1rX3BkZihzZXR0aW5ncywgc2V0RG93bmxvYWRMaW5rKTtcbiAgICAvL21rX3BkZihzZXR0aW5ncywgc2V0RG93bmxvYWRMaW5rKTtcbiAgICAvL3BkZl9kb3dubG9hZC5odG1sKCdEb3dubG9hZCBQREYnKTtcbiAgICAvL2NvbnNvbGUubG9nKHBkZl9kb3dubG9hZCk7XG4gICAgLy9pZiggc2V0dGluZ3MuUERGICYmIHNldHRpbmdzLlBERi51cmwgKXtcbiAgICAvLyAgICB2YXIgbGluayA9ICQoJ2EnKS5hdHRyKCdocmVmJywgc2V0dGluZ3MuUERGLnVybCApLmh0bWwoJ2Rvd25sb2FkLi4nKTtcbiAgICAvLyAgICAkKCcjZG93bmxvYWQnKS5hcHBlbmQobGluayk7XG4gICAgLy99XG5cblxuICAgIC8vay5zaG93X2hpZGVfcGFyYW1zKHBhZ2Vfc2VjdGlvbnNfcGFyYW1zLCBzZXR0aW5ncyk7XG4vLyAgICBzaG93X2hpZGVfc2VsZWN0aW9ucyhwYWdlX3NlY3Rpb25zX2NvbmZpZywgc2V0dGluZ3Muc3RhdGUuYWN0aXZlX3NlY3Rpb24pO1xuXG4gICAgLy9jb25zb2xlLmxvZyggZi5vYmplY3RfZGVmaW5lZChzZXR0aW5ncy5zdGF0ZSkgKTtcblxuICAgIC8vY29uc29sZS5sb2coICdzeXN0ZW0nLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncy5zeXN0ZW0sIG51bGwsIDQpKTtcbiAgICAvL2NvbnNvbGUubG9nKCAnaW5wdXRzJywgSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MuaW5wdXRzLCBudWxsLCA0KSk7XG4gICAgLy9jb25zb2xlLmxvZyggJ2RyYXdpbmcnLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncy5kcmF3aW5nLCBudWxsLCA0KSk7XG5cbiAgICBjb25zb2xlLmxvZygnXFxcXC0tLSBlbmQgdXBkYXRlJyk7XG59O1xuZi51cGRhdGUgPSB1cGRhdGU7XG5cblxuXG5cblxuXG5cblxuXG4vLyBEZXYgc2V0dGluZ3Ncbi8qXG5pZiggdmVyc2lvbl9zdHJpbmcgPT09ICdEZXYnICYmIHRydWUgKXtcbiAgICBmb3IoIHZhciBzZWN0aW9uIGluIHNldHRpbmdzLnN0YXRlLnNlY3Rpb25zICl7XG4gICAgICAgIHNldHRpbmdzLnN0YXRlLnNlY3Rpb25zW3NlY3Rpb25dLnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgc2V0dGluZ3Muc3RhdGUuc2VjdGlvbnNbc2VjdGlvbl0uc2V0ID0gdHJ1ZTtcbiAgICB9XG59IGVsc2Uge1xuICAgIHNldHRpbmdzLnN0YXRlLnNlY3Rpb25zLm1vZHVsZXMucmVhZHkgPSB0cnVlO1xufVxuLy8qL1xuLy8vLy8vLy9cblxuXG5cblxuZnVuY3Rpb24gcGFnZV9zZXR1cChzZXR0aW5ncyl7XG4gICAgdmFyIHN5c3RlbV9mcmFtZV9pZCA9ICdzeXN0ZW1fZnJhbWUnO1xuICAgIHZhciB0aXRsZSA9ICdQViBkcmF3aW5nIHRlc3QnO1xuXG4gICAgay5zZXR1cF9ib2R5KHRpdGxlKTtcblxuICAgIHZhciBwYWdlID0gJCgnPGRpdj4nKS5hdHRyKCdjbGFzcycsICdwYWdlJykuYXBwZW5kVG8oJChkb2N1bWVudC5ib2R5KSk7XG4gICAgLy9wYWdlLnN0eWxlKCd3aWR0aCcsIChzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy53KzIwKS50b1N0cmluZygpICsgJ3B4JyApXG5cbiAgICB2YXIgc3lzdGVtX2ZyYW1lID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsIHN5c3RlbV9mcmFtZV9pZCkuYXBwZW5kVG8ocGFnZSk7XG5cblxuICAgIHZhciBoZWFkZXJfY29udGFpbmVyID0gJCgnPGRpdj4nKS5hcHBlbmRUbyhzeXN0ZW1fZnJhbWUpO1xuICAgICQoJzxzcGFuPicpLmh0bWwoJ1BsZWFzZSBzZWxlY3QgeW91ciBzeXN0ZW0gc3BlYyBiZWxvdycpLmF0dHIoJ2NsYXNzJywgJ2NhdGVnb3J5X3RpdGxlJykuYXBwZW5kVG8oaGVhZGVyX2NvbnRhaW5lcik7XG4gICAgJCgnPHNwYW4+JykuaHRtbCgnIHwgJykuYXBwZW5kVG8oaGVhZGVyX2NvbnRhaW5lcik7XG4gICAgLy8kKCc8aW5wdXQ+JykuYXR0cigndHlwZScsICdidXR0b24nKS5hdHRyKCd2YWx1ZScsICdjbGVhciBzZWxlY3Rpb25zJykuY2xpY2sod2luZG93LmxvY2F0aW9uLnJlbG9hZCksXG4gICAgJCgnPGE+JykuYXR0cignaHJlZicsICdqYXZhc2NyaXB0OndpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKScpLmh0bWwoJ2NsZWFyIHNlbGVjdGlvbnMnKS5hcHBlbmRUbyhoZWFkZXJfY29udGFpbmVyKTtcblxuXG4gICAgLy8gU3lzdGVtIHNldHVwXG4gICAgJCgnPGRpdj4nKS5odG1sKCdTeXN0ZW0gU2V0dXAnKS5hdHRyKCdjbGFzcycsICdzZWN0aW9uX3RpdGxlJykuYXBwZW5kVG8oc3lzdGVtX2ZyYW1lKTtcbiAgICB2YXIgY29uZmlnX2ZyYW1lID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdjb25maWdfZnJhbWUnKS5hcHBlbmRUbyhzeXN0ZW1fZnJhbWUpO1xuXG4gICAgLy9jb25zb2xlLmxvZyhzZWN0aW9uX3NlbGVjdG9yKTtcblxuXG5cbiAgICB2YXIgbG9jYXRpb25fZGl2ID0gJCgnPGRpdj4nKTtcblxuICAgIHZhciBsaXN0X2VsZW1lbnQgPSAkKCc8dWw+JykuYXBwZW5kVG8obG9jYXRpb25fZGl2KTtcbiAgICAkKCc8bGk+JykuYXBwZW5kVG8obGlzdF9lbGVtZW50KS5hcHBlbmQoXG4gICAgICAgICQoJzxhPicpXG4gICAgICAgICAgICAudGV4dCgnV2luZCBab25lICcpXG4gICAgICAgICAgICAuYXR0cignaHJlZicsICdodHRwOi8vd2luZHNwZWVkLmF0Y291bmNpbC5vcmcvJylcbiAgICAgICAgICAgIC5hdHRyKCd0YXJnZXQnLCAnX2JsYW5rJylcbiAgICApO1xuICAgICQoJzxsaT4nKS5hcHBlbmRUbyhsaXN0X2VsZW1lbnQpLmFwcGVuZChcbiAgICAgICAgJCgnPGE+JylcbiAgICAgICAgICAgIC50ZXh0KCdDbGltYXRlIENvbmRpdGlvbnMnKVxuICAgICAgICAgICAgLmF0dHIoJ2hyZWYnLCAnaHR0cDovL3d3dy5zb2xhcmFiY3Mub3JnL2Fib3V0L3B1YmxpY2F0aW9ucy9yZXBvcnRzL2V4cGVkaXRlZC1wZXJtaXQvbWFwL2luZGV4Lmh0bWwnKVxuICAgICAgICAgICAgLmF0dHIoJ3RhcmdldCcsICdfYmxhbmsnKVxuICAgICk7XG5cbi8qXG4gICAgJCgnPGlmcmFtZSBzcmM9XCJodHRwczovL3d3dy5nb29nbGUuY29tL21hcHMvZW1iZWQ/cGI9ITFtMTAhMW04ITFtMyExZDM2MDM0NTkuODU0MDg5MDQ2ITJkLTgxLjM3MDI4MDgxODM0NzE1ITNkMjguMTE1OTE2MDExNDI4MjA4ITNtMiExaTEwMjQhMmk3NjghNGYxMy4xITVlMCEzbTIhMXNlbiEyc3VzITR2MTQyMTk1NDQ2MDM4NVwiIHdpZHRoPVwiNDg1XCIgaGVpZ2h0PVwiMzAwXCIgZnJhbWVib3JkZXI9XCIwXCIgc3R5bGU9XCJib3JkZXI6MFwiPjwvaWZyYW1lPicpXG4gICAgICAgIC5hcHBlbmRUbyhsb2NhdGlvbl9kaXYpO1xuICAgICQoJzxpZnJhbWUgc3JjPVwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9tYXBzL2VtYmVkP3BiPSExbTE0ITFtMTIhMW0zITFkNTQ2LjY4MDkwNDM4MTA5OTQhMmQtODAuNzU2NDk0NjU4NTE5NTMhM2QyOC4zODczMDI4NzE0MDY0NDQhMm0zITFmMCEyZjAhM2YwITNtMiExaTEwMjQhMmk3NjghNGYxMy4xITVlMSEzbTIhMXNlbiEyc3VzITR2MTQyMjAzODgwMTI4N1wiIHdpZHRoPVwiNDg1XCIgaGVpZ2h0PVwiMzAwXCIgZnJhbWVib3JkZXI9XCIwXCIgc3R5bGU9XCJib3JkZXI6MFwiPjwvaWZyYW1lPicpXG4gICAgICAgIC5hcHBlbmRUbyhsb2NhdGlvbl9kaXYpO1xuLy8qL1xuXG4gICAgJCgnPGlmcmFtZSBzcmM9XCJodHRwczovL3d3dy5nb29nbGUuY29tL21hcHMvZW1iZWQ/cGI9ITFtMTghMW0xMiExbTMhMWQzNjAzMzQ4LjY5NzkyNDA2OCEyZC04MS40ODY2MDY4ODkyNjA2OCEzZDI4LjExOTIyMzY3OTUwMjU5MyEybTMhMWYwITJmMCEzZjAhM20yITFpMTAyNCEyaTc2OCE0ZjEzLjEhM20zITFtMiExczB4ODhlMGFhNDUyYjk5YWY1MyUzQTB4NWU1MjQ5MTNlNDRhOGE2NSEyczE5NzArTWljaGlnYW4rQXZlJTJDK0NvY29hJTJDK0ZMKzMyOTIyITVlMCEzbTIhMXNlbiEyc3VzITR2MTQyMjA1MDkxMjQ4OVwiIHdpZHRoPVwiNDg1XCIgaGVpZ2h0PVwiMzAwXCIgZnJhbWVib3JkZXI9XCIwXCIgc3R5bGU9XCJib3JkZXI6MFwiPjwvaWZyYW1lPicpXG4gICAgICAgIC5hcHBlbmRUbyhsb2NhdGlvbl9kaXYpO1xuXG4gICAgJCgnPGlmcmFtZSBzcmM9XCJodHRwczovL3d3dy5nb29nbGUuY29tL21hcHMvZW1iZWQ/cGI9ITFtMTQhMW0xMiExbTMhMWQzMjMuMTEwMDk3NzM4MTQxNyEyZC04MC43NTMzMjQzMzgyMDM0NCEzZDI4LjM4ODg3NTQ2NTY5NTQwNiEybTMhMWYwITJmMCEzZjAhM20yITFpMTAyNCEyaTc2OCE0ZjEzLjEhNWUxITNtMiExc2VuITJzdXMhNHYxNDIyMDUxMDMwMzE5XCIgd2lkdGg9XCI0ODVcIiBoZWlnaHQ9XCIzMDBcIiBmcmFtZWJvcmRlcj1cIjBcIiBzdHlsZT1cImJvcmRlcjowXCI+PC9pZnJhbWU+JylcbiAgICAgICAgLmFwcGVuZFRvKGxvY2F0aW9uX2Rpdik7XG5cblxuXG5cbiAgICB2YXIgbG9jYXRpb25fZHJhd2VyID0gZi5ta19kcmF3ZXIoJ0xvY2F0aW9uJywgbG9jYXRpb25fZGl2KTtcbiAgICBsb2NhdGlvbl9kcmF3ZXIuYXBwZW5kVG8oY29uZmlnX2ZyYW1lKTtcblxuXG4gICAgZi5hZGRfc2VsZWN0b3JzKHNldHRpbmdzLCBjb25maWdfZnJhbWUpO1xuXG4gICAgLy8gUGFyYW1ldGVycyBhbmQgc3BlY2lmaWNhdGlvbnNcbiAgICAvKlxuICAgICQoJzxkaXY+JykuaHRtbCgnU3lzdGVtIFBhcmFtZXRlcnMnKS5hdHRyKCdjbGFzcycsICdzZWN0aW9uX3RpdGxlJykuYXBwZW5kVG8oc3lzdGVtX2ZyYW1lKTtcbiAgICB2YXIgcGFyYW1zX2NvbnRhaW5lciA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAnc2VjdGlvbicpO1xuICAgIHBhcmFtc19jb250YWluZXIuYXBwZW5kVG8oc3lzdGVtX2ZyYW1lKTtcbiAgICBmLmFkZF9wYXJhbXMoIHNldHRpbmdzLCBwYXJhbXNfY29udGFpbmVyICk7XG4gICAgLy8qL1xuXG4gICAgLy9UT0RPOiBhZGQgc3ZnIGRpc3BsYXkgb2YgbW9kdWxlc1xuICAgIC8vIGh0dHA6Ly9xdW90ZS5zbmFwbnJhY2suY29tL3VpL28xMDAucGhwI3N0ZXAtMlxuXG4gICAgLy8gZHJhd2luZ1xuICAgIC8vdmFyIGRyYXdpbmcgPSAkKCdkaXYnKS5hdHRyKCdpZCcsICdkcmF3aW5nX2ZyYW1lJykuYXR0cignY2xhc3MnLCAnc2VjdGlvbicpLmFwcGVuZFRvKHBhZ2UpO1xuXG5cbiAgICB2YXIgZHJhd2luZ19wcmV2aWV3ID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkcmF3aW5nX2ZyYW1lX3ByZXZpZXcnKS5hcHBlbmRUbyhwYWdlKTtcbiAgICAkKCc8ZGl2PicpLmh0bWwoJ1ByZXZpZXcnKS5hdHRyKCdjbGFzcycsICdzZWN0aW9uX3RpdGxlJykuYXBwZW5kVG8oZHJhd2luZ19wcmV2aWV3KTtcbiAgICAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2RyYXdpbmdfcHJldmlldycpLmF0dHIoJ2NsYXNzJywgJ2RyYXdpbmcnKS5jc3MoJ2NsZWFyJywgJ2JvdGgnKS5hcHBlbmRUbyhkcmF3aW5nX3ByZXZpZXcpO1xuXG5cblxuXG5cbiAgICB2YXIgZHJhd2luZ19zZWN0aW9uID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkcmF3aW5nX2ZyYW1lJykuYXBwZW5kVG8ocGFnZSk7XG4gICAgLy9kcmF3aW5nLmNzcygnd2lkdGgnLCAoc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcudysyMCkudG9TdHJpbmcoKSArICdweCcgKTtcbiAgICAkKCc8ZGl2PicpLmh0bWwoJ0RyYXdpbmcnKS5hdHRyKCdjbGFzcycsICdzZWN0aW9uX3RpdGxlJykuYXBwZW5kVG8oZHJhd2luZ19zZWN0aW9uKTtcblxuXG4gICAgLy8kKCc8Zm9ybSBtZXRob2Q9XCJnZXRcIiBhY3Rpb249XCJkYXRhL3NhbXBsZS5wZGZcIj48YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5Eb3dubG9hZDwvYnV0dG9uPjwvZm9ybT4nKS5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pO1xuICAgIC8vJCgnPHNwYW4+JykuYXR0cignaWQnLCAnZG93bmxvYWQnKS5hdHRyKCdjbGFzcycsICdmbG9hdF9yaWdodCcpLmFwcGVuZFRvKGRyYXdpbmdfc2VjdGlvbik7XG4gICAgJCgnPGE+JylcbiAgICAgICAgLnRleHQoJ0Rvd25sb2FkIERyYXdpbmcgKHNhbXBsZSknKVxuICAgICAgICAuYXR0cignaHJlZicsICdkYXRhL3NhbXBsZS5wZGYnKVxuICAgICAgICAuYXR0cignaWQnLCAnZG93bmxvYWQnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnZmxvYXRfcmlnaHQnKVxuICAgICAgICAuYXR0cigndGFyZ2V0JywgJ19ibGFuaycpXG4gICAgICAgIC5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pO1xuXG4gICAgdmFyIHN2Z19jb250YWluZXJfb2JqZWN0ID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkcmF3aW5nJykuYXR0cignY2xhc3MnLCAnZHJhd2luZycpLmNzcygnY2xlYXInLCAnYm90aCcpLmFwcGVuZFRvKGRyYXdpbmdfc2VjdGlvbik7XG4gICAgLy9zdmdfY29udGFpbmVyX29iamVjdC5zdHlsZSgnd2lkdGgnLCBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy53KydweCcgKVxuICAgIC8vdmFyIHN2Z19jb250YWluZXIgPSBzdmdfY29udGFpbmVyX29iamVjdC5lbGVtO1xuICAgICQoJzxicj4nKS5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pO1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICQoJzxkaXY+JykuaHRtbCgnICcpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25fdGl0bGUnKS5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pO1xuXG59XG5cbnBhZ2Vfc2V0dXAoc2V0dGluZ3MpO1xuXG52YXIgYm9vdF90aW1lID0gbW9tZW50KCk7XG52YXIgc3RhdHVzX2lkID0gJ3N0YXR1cyc7XG5zZXRJbnRlcnZhbChmdW5jdGlvbigpeyBrLnVwZGF0ZV9zdGF0dXNfcGFnZShzdGF0dXNfaWQsIGJvb3RfdGltZSwgdmVyc2lvbl9zdHJpbmcpO30sMTAwMCk7XG5cbnVwZGF0ZSgpO1xuXG4vL2NvbnNvbGUubG9nKCd3aW5kb3cnLCB3aW5kb3cpO1xuIl19
