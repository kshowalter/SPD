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

    var arrow_w = 10;
    var letter_h = 20;
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











    console.log(f.section_defined('roof'));

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

            x = detail_x + detail_w + 50;
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

layer_attr.north_arrow = Object.assign(Object.create(layer_attr.preview),{
    stroke: '#000000',
    'stroke-width': 2,
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
module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports={

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
    $('<iframe src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d3603459.854089046!2d-81.37028081834715!3d28.115916011428208!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1421954460385" width="485" height="300" frameborder="0" style="border:0"></iframe>')
        .appendTo(location_div);
    $('<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d546.6809043810994!2d-80.75649465851953!3d28.387302871406444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sus!4v1422038801287" width="485" height="300" frameborder="0" style="border:0"></iframe>')
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9mdW5jdGlvbnMuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvbWtfYmxvY2tzLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvYXBwL21rX2JvcmRlci5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19kcmF3aW5nLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvYXBwL21rX3BhZ2VfMS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19wYWdlXzIuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvbWtfcGFnZV8zLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvYXBwL21rX3BhZ2VfNC5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19wYWdlX3ByZXZpZXdfMS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19wYWdlX3ByZXZpZXdfMi5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9ta19zdmcuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvc2V0dGluZ3MuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvc2V0dGluZ3NfZHJhd2luZy5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9zZXR0aW5nc19mb250cy5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2FwcC9zZXR0aW5nc19sYXllcnMuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9hcHAvc2V0dGluZ3NfdXBkYXRlLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvZGF0YS90YWJsZXMuanNvbiIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2xpYi9rL2suanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9saWIvay9rX0RPTS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2xpYi9rL2tfRE9NX2V4dHJhLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvbGliL2sva29udGFpbmVyLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvbGliL2svd3JhcHBlcl9wcm90b3R5cGUuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNXFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyb0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDblBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDclNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0Jztcbi8vdmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbnZhciBrJCA9IHJlcXVpcmUoJy4uL2xpYi9rL2tfRE9NJyk7XG52YXIgayA9IHJlcXVpcmUoJy4uL2xpYi9rL2snKTtcbnZhciBrb250YWluZXIgPSByZXF1aXJlKCcuLi9saWIvay9rb250YWluZXInKTtcblxudmFyIGYgPSB7fTtcblxuZi5vYmpfbmFtZXMgPSBmdW5jdGlvbiggb2JqZWN0ICkge1xuICAgIGlmKCBvYmplY3QgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgdmFyIGEgPSBbXTtcbiAgICAgICAgZm9yKCB2YXIgaWQgaW4gb2JqZWN0ICkge1xuICAgICAgICAgICAgaWYoIG9iamVjdC5oYXNPd25Qcm9wZXJ0eShpZCkgKSAge1xuICAgICAgICAgICAgICAgIGEucHVzaChpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxufTtcblxuZi5vYmplY3RfZGVmaW5lZCA9IGZ1bmN0aW9uKG9iamVjdCl7XG4gICAgLy9jb25zb2xlLmxvZyhvYmplY3QpO1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QgKXtcbiAgICAgICAgaWYoIG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpICl7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGtleSk7XG4gICAgICAgICAgICBpZiggb2JqZWN0W2tleV0gPT09IG51bGwgfHwgb2JqZWN0W2tleV0gPT09IHVuZGVmaW5lZCApIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbmYuc2VjdGlvbl9kZWZpbmVkID0gZnVuY3Rpb24oc2VjdGlvbl9uYW1lKXtcbiAgICAvL2NvbnNvbGUubG9nKFwiLVwiK3NlY3Rpb25fbmFtZSk7XG4gICAgLy92YXIgaW5wdXRfc2VjdGlvbiA9IGcuaW5wdXRzW3NlY3Rpb25fbmFtZV07XG4gICAgdmFyIG91dHB1dF9zZWN0aW9uID0gZy5zeXN0ZW1bc2VjdGlvbl9uYW1lXTtcbiAgICBmb3IoIHZhciBrZXkgaW4gb3V0cHV0X3NlY3Rpb24gKXtcbiAgICAgICAgaWYoIG91dHB1dF9zZWN0aW9uLmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coa2V5KTtcblxuICAgICAgICAgICAgaWYoIG91dHB1dF9zZWN0aW9uW2tleV0gPT09IHVuZGVmaW5lZCB8fCBvdXRwdXRfc2VjdGlvbltrZXldID09PSBudWxsICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbmYubnVsbFRvT2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0ICl7XG4gICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgaWYoIG9iamVjdFtrZXldID09PSBudWxsICl7XG4gICAgICAgICAgICAgICAgb2JqZWN0W2tleV0gPSB7fTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiggdHlwZW9mIG9iamVjdFtrZXldID09PSAnb2JqZWN0JyApIHtcbiAgICAgICAgICAgICAgICBvYmplY3Rba2V5XSA9IGYubnVsbFRvT2JqZWN0KG9iamVjdFtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xufTtcblxuZi5ibGFua19jb3B5ID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICB2YXIgbmV3T2JqZWN0ID0ge307XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdCApe1xuICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIGlmKCBvYmplY3Rba2V5XS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICkge1xuICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldID0ge307XG4gICAgICAgICAgICAgICAgZm9yKCB2YXIga2V5MiBpbiBvYmplY3Rba2V5XSApe1xuICAgICAgICAgICAgICAgICAgICBpZiggb2JqZWN0W2tleV0uaGFzT3duUHJvcGVydHkoa2V5MikgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldW2tleTJdID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3T2JqZWN0W2tleV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdPYmplY3Q7XG59O1xuXG5mLmJsYW5rX2NsZWFuX2NvcHkgPSBmdW5jdGlvbihvYmplY3Qpe1xuICAgIHZhciBuZXdPYmplY3QgPSB7fTtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0ICl7XG4gICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgaWYoIG9iamVjdFtrZXldLmNvbnN0cnVjdG9yID09PSBPYmplY3QgKSB7XG4gICAgICAgICAgICAgICAgbmV3T2JqZWN0W2tleV0gPSB7fTtcbiAgICAgICAgICAgICAgICBmb3IoIHZhciBrZXkyIGluIG9iamVjdFtrZXldICl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCBvYmplY3Rba2V5XS5oYXNPd25Qcm9wZXJ0eShrZXkyKSApe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNsZWFuX2tleSA9IGYuY2xlYW5fbmFtZShrZXkyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldW2NsZWFuX2tleV0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdPYmplY3Rba2V5XSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld09iamVjdDtcbn07XG5cbmYubWVyZ2Vfb2JqZWN0cyA9IGZ1bmN0aW9uIG1lcmdlX29iamVjdHMob2JqZWN0MSwgb2JqZWN0Mil7XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdDEgKXtcbiAgICAgICAgaWYoIG9iamVjdDEuaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgLy9pZigga2V5ID09PSAnbWFrZScgKSBjb25zb2xlLmxvZyhrZXksIG9iamVjdDEsIHR5cGVvZiBvYmplY3QxW2tleV0sIHR5cGVvZiBvYmplY3QyW2tleV0pO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhrZXksIG9iamVjdDEsIHR5cGVvZiBvYmplY3QxW2tleV0sIHR5cGVvZiBvYmplY3QyW2tleV0pO1xuICAgICAgICAgICAgaWYoIG9iamVjdDFba2V5XSAmJiBvYmplY3QxW2tleV0uY29uc3RydWN0b3IgPT09IE9iamVjdCApIHtcbiAgICAgICAgICAgICAgICBpZiggb2JqZWN0MltrZXldID09PSB1bmRlZmluZWQgKSBvYmplY3QyW2tleV0gPSB7fTtcbiAgICAgICAgICAgICAgICBtZXJnZV9vYmplY3RzKCBvYmplY3QxW2tleV0sIG9iamVjdDJba2V5XSApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiggb2JqZWN0MltrZXldID09PSB1bmRlZmluZWQgKSBvYmplY3QyW2tleV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuZi5hcnJheV90b19vYmplY3QgPSBmdW5jdGlvbihhcnIpIHtcbiAgICB2YXIgciA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKVxuICAgICAgICByW2ldID0gYXJyW2ldO1xuICAgIHJldHVybiByO1xufTtcblxuZi5uYW5fY2hlY2sgPSBmdW5jdGlvbiBuYW5fY2hlY2sob2JqZWN0LCBwYXRoKXtcbiAgICBpZiggcGF0aCA9PT0gdW5kZWZpbmVkICkgcGF0aCA9IFwiXCI7XG4gICAgcGF0aCA9IHBhdGgrXCIuXCI7XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdCApe1xuICAgICAgICAvL2NvbnNvbGUubG9nKCBcIk5hTmNoZWNrOiBcIitwYXRoK2tleSApO1xuXG4gICAgICAgIGlmKCBvYmplY3Rba2V5XSAmJiBvYmplY3Rba2V5XS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkgKSBvYmplY3Rba2V5XSA9IGYuYXJyYXlfdG9fb2JqZWN0KG9iamVjdFtrZXldKTtcblxuXG4gICAgICAgIGlmKCAgb2JqZWN0W2tleV0gJiYgKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSB8fCBvYmplY3Rba2V5XSAhPT0gbnVsbCApKXtcbiAgICAgICAgICAgIGlmKCBvYmplY3Rba2V5XS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICl7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggXCIgIE9iamVjdDogXCIrcGF0aCtrZXkgKTtcbiAgICAgICAgICAgICAgICBuYW5fY2hlY2soIG9iamVjdFtrZXldLCBwYXRoK2tleSApO1xuICAgICAgICAgICAgfSBlbHNlIGlmKCBvYmplY3Rba2V5XSA9PT0gTmFOIHx8IG9iamVjdFtrZXldID09PSBudWxsICl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIFwiTmFOOiBcIitwYXRoK2tleSApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCBcIkRlZmluZWQ6IFwiK3BhdGgra2V5LCBvYmplY3Rba2V5XSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxufTtcblxuZi5zdHJfdG9fbnVtID0gZnVuY3Rpb24gc3RyX3RvX251bShpbnB1dCl7XG4gICAgdmFyIG91dHB1dDtcbiAgICBpZighaXNOYU4oaW5wdXQpKSBvdXRwdXQgPSBOdW1iZXIoaW5wdXQpO1xuICAgIGVsc2Ugb3V0cHV0ID0gaW5wdXQ7XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cblxuZi5wcmV0dHlfd29yZCA9IGZ1bmN0aW9uKG5hbWUpe1xuICAgIHJldHVybiBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKTtcbn07XG5cbmYucHJldHR5X25hbWUgPSBmdW5jdGlvbihuYW1lKXtcbiAgICB2YXIgbCA9IG5hbWUuc3BsaXQoJ18nKTtcbiAgICBsLmZvckVhY2goZnVuY3Rpb24obmFtZV9zZXFtZW50LGkpe1xuICAgICAgICBsW2ldID0gZi5wcmV0dHlfd29yZChuYW1lX3NlcW1lbnQpO1xuICAgIH0pO1xuICAgIHZhciBwcmV0dHkgPSBsLmpvaW4oJyAnKTtcblxuICAgIHJldHVybiBwcmV0dHk7XG59O1xuXG5mLnByZXR0eV9uYW1lcyA9IGZ1bmN0aW9uKG9iamVjdCl7XG4gICAgdmFyIG5ld19vYmplY3QgPSB7fTtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0ICl7XG4gICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgdmFyIG5ld19rZXkgPSBmLnByZXR0eV9uYW1lKGtleSk7XG4gICAgICAgICAgICBuZXdfb2JqZWN0W25ld19rZXldID0gb2JqZWN0W2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld19vYmplY3Q7XG59O1xuXG5mLmNsZWFuX25hbWUgPSBmdW5jdGlvbihuYW1lKXtcbiAgICByZXR1cm4gbmFtZS5zcGxpdCgnICcpWzBdO1xufTtcblxuLypcbmYua2VsZW1fc2V0dXAgPSBmdW5jdGlvbihrZWxlbSwgc2V0dGluZ3Mpe1xuICAgIGlmKCAhc2V0dGluZ3MpIGNvbnNvbGUubG9nKHNldHRpbmdzKTtcbiAgICBpZigga2VsZW0udHlwZSA9PT0gJ3NlbGVjdG9yJyApe1xuICAgICAgICBrZWxlbS5zZXRSZWZPYmooc2V0dGluZ3MpO1xuICAgICAgICBrZWxlbS5zZXRVcGRhdGUoc2V0dGluZ3MudXBkYXRlKTtcbiAgICAgICAgc2V0dGluZ3Muc2VsZWN0X3JlZ2lzdHJ5LnB1c2goa2VsZW0pO1xuICAgICAgICBrZWxlbS51cGRhdGUoKTtcbiAgICB9IGVsc2UgaWYoIGtlbGVtLnR5cGUgPT09ICd2YWx1ZScgKXtcbiAgICAgICAga2VsZW0uc2V0UmVmT2JqKHNldHRpbmdzKTtcbiAgICAgICAgLy9rZWxlbS5zZXRVcGRhdGUoc2V0dGluZ3NfdXBkYXRlKTtcbiAgICAgICAgc2V0dGluZ3MudmFsdWVfcmVnaXN0cnkucHVzaChrZWxlbSk7XG4gICAgfVxuICAgIHJldHVybiBrZWxlbTtcbn07XG4qL1xuLy9mLnNjb3BlX3ByZXNlcnZlciA9IGZ1bmN0aW9uKHYpe1xuLy8gICAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4vLyAgICAgICAgcmV0dXJuIHY7XG4vLyAgICB9O1xuLy99O1xuXG5mLm1rX2RyYXdlciA9IGZ1bmN0aW9uKHRpdGxlLCBjb250ZW50KXtcbiAgICB2YXIgZHJhd2VyX2NvbnRhaW5lciA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAnaW5wdXRfc2VjdGlvbicpLmF0dHIoJ2lkJywgdGl0bGUgKTtcbiAgICAvL2RyYXdlcl9jb250YWluZXIuZ2V0KDApLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5X3R5cGU7XG4gICAgdmFyIHN5c3RlbV9kaXYgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3RpdGxlX2JhcicpXG4gICAgICAgIC5hdHRyKCdpZCcsICdzZWN0aW9uXycrdGl0bGUpXG4gICAgICAgIC5hdHRyKCdzZWN0aW9uX25vbScsIHRpdGxlKVxuICAgICAgICAuYXBwZW5kVG8oZHJhd2VyX2NvbnRhaW5lcilcbiAgICAgICAgLyoganNoaW50IC1XMDgzICovXG4gICAgICAgIC5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIG5hbWUgPSAkKHRoaXMpLmF0dHIoJ3NlY3Rpb25fbm9tJyk7XG4gICAgICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0aW9uc19tYW51YWxfdG9nZ2xlZFtuYW1lXSA9IHRydWU7XG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlVG9nZ2xlKCdmYXN0Jyk7XG4gICAgICAgIH0pO1xuICAgIHZhciBzeXN0ZW1fdGl0bGUgPSAkKCc8YT4nKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAndGl0bGVfYmFyX3RleHQnKVxuICAgICAgICAuYXR0cignaHJlZicsICcjJylcbiAgICAgICAgLnRleHQoZi5wcmV0dHlfbmFtZSh0aXRsZSkpXG4gICAgICAgIC5hcHBlbmRUbyhzeXN0ZW1fZGl2KTtcblxuICAgIHZhciBkcmF3ZXIgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ2RyYXdlcicpLmFwcGVuZFRvKGRyYXdlcl9jb250YWluZXIpO1xuICAgIGNvbnRlbnQuYXR0cignY2xhc3MnLCAnZHJhd2VyX2NvbnRlbnQnKS5hcHBlbmRUbyhkcmF3ZXIpO1xuXG5cbiAgICByZXR1cm4gZHJhd2VyX2NvbnRhaW5lcjtcblxuXG59O1xuXG5cbmYuYWRkX3NlbGVjdG9ycyA9IGZ1bmN0aW9uKHNldHRpbmdzLCBwYXJlbnRfY29udGFpbmVyKXtcbiAgICBmb3IoIHZhciBzZWN0aW9uX25hbWUgaW4gc2V0dGluZ3MuaW5wdXRzICl7XG5cbiAgICAgICAgLy8kKHRoaXMpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgIHZhciBkcmF3ZXJfY29udGVudCA9ICQoJzxkaXY+Jyk7XG4gICAgICAgIGZvciggdmFyIGlucHV0X25hbWUgaW4gc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV0gKXtcbiAgICAgICAgICAgIHZhciB1bml0cztcbiAgICAgICAgICAgIGlmKCAoc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0gIT09IHVuZGVmaW5lZCkgJiYgKHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdLnVuaXRzICE9PSB1bmRlZmluZWQpICkge1xuICAgICAgICAgICAgICAgIHVuaXRzID0gXCIoXCIgKyBzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXS51bml0cyArIFwiKVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1bml0cyA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbm90ZTtcbiAgICAgICAgICAgIGlmKCAoc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0gIT09IHVuZGVmaW5lZCkgJiYgKHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdLm5vdGUgIT09IHVuZGVmaW5lZCkgKSB7XG4gICAgICAgICAgICAgICAgbm90ZSA9IHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdLm5vdGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5vdGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuXG5cblxuICAgICAgICAgICAgdmFyIHNlbGVjdG9yX3NldCA9ICQoJzxzcGFuPicpLmF0dHIoJ2NsYXNzJywgJ3NlbGVjdG9yX3NldCcpLmFwcGVuZFRvKGRyYXdlcl9jb250ZW50KTtcbiAgICAgICAgICAgIHZhciBpbnB1dF90ZXh0ID0gJCgnPHNwYW4+JykuaHRtbChmLnByZXR0eV9uYW1lKGlucHV0X25hbWUpICsgJzogJyArIHVuaXRzICkuYXBwZW5kVG8oc2VsZWN0b3Jfc2V0KTtcbiAgICAgICAgICAgIGlmKCBub3RlICkgaW5wdXRfdGV4dC5hdHRyKCd0aXRsZScsIG5vdGUpO1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIHZhciBzZWxlY3RvciA9IGskKCdzZWxlY3RvcicpXG4gICAgICAgICAgICAgICAgLnNldE9wdGlvbnNSZWYoICdpbnB1dHMuJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUgKVxuICAgICAgICAgICAgICAgIC5zZXRSZWYoICdzeXN0ZW0uJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUgKVxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhzZWxlY3Rvcl9zZXQpO1xuICAgICAgICAgICAgZi5rZWxlbV9zZXR1cChzZWxlY3Rvciwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgLy8qL1xuICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICAgIHN5c3RlbV9yZWY6IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKS5vYmooc2V0dGluZ3MpLnJlZignc3lzdGVtLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lKSxcbiAgICAgICAgICAgICAgICAvL2lucHV0X3JlZjogT2JqZWN0LmNyZWF0ZShrb250YWluZXIpLm9iaihzZXR0aW5ncykucmVmKCdpbnB1dHMuJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUgKyAnLnZhbHVlJyksXG4gICAgICAgICAgICAgICAgbGlzdF9yZWY6IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKS5vYmooc2V0dGluZ3MpLnJlZignaW5wdXRzLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lICsgJy5vcHRpb25zJyksXG4gICAgICAgICAgICAgICAgaW50ZXJhY3RlZDogZmFsc2UsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYoIChzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSAhPT0gdW5kZWZpbmVkKSAmJiAoc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0udHlwZSAhPT0gdW5kZWZpbmVkKSApIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci50eXBlID0gc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0udHlwZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IudHlwZSA9ICdzZWxlY3QnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoIHNlbGVjdG9yLnR5cGUgPT09ICdzZWxlY3QnICl7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IuZWxlbSA9ICQoJzxzZWxlY3Q+JylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3NlbGVjdG9yJylcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKHNlbGVjdG9yX3NldClcbiAgICAgICAgICAgICAgICAgICAgLmdldCgpWzBdO1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLnZhbHVlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggdGhpcy5zZXRfcmVmLnJlZlN0cmluZywgdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXggKTtcbiAgICAgICAgICAgICAgICAgICAgLy9pZiggdGhpcy5pbnRlcmFjdGVkIClcbiAgICAgICAgICAgICAgICAgICAgaWYoIHRoaXMuZWxlbS5zZWxlY3RlZEluZGV4ID49IDApIHJldHVybiB0aGlzLmVsZW0ub3B0aW9uc1t0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZi5zZWxlY3Rvcl9hZGRfb3B0aW9ucyhzZWxlY3Rvcik7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiggc2VsZWN0b3IudHlwZSA9PT0gJ2lucHV0JyApe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLmVsZW0gPSAkKCc8aW5wdXQ+JylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ251bWJlcl9pbnB1dCcpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCd0eXBlJywgJ3RleHQnKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oc2VsZWN0b3Jfc2V0KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KClbMF07XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IudmFsdWUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCB0aGlzLnNldF9yZWYucmVmU3RyaW5nLCB0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleCApO1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCB0aGlzLmVsZW0sIHRoaXMuZWxlbS52YWx1ZSApO1xuICAgICAgICAgICAgICAgICAgICAvL2lmKCB0aGlzLmludGVyYWN0ZWQgKVxuICAgICAgICAgICAgICAgICAgICAvL2lmKCB0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleCA+PSAwKSByZXR1cm4gdGhpcy5lbGVtLm9wdGlvbnNbdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAvL2Vsc2UgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtLnZhbHVlO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IuZWxlbS52YWx1ZSA9IHNlbGVjdG9yLnN5c3RlbV9yZWYuZ2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKHNlbGVjdG9yLmVsZW0pLmNoYW5nZShmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuZi51cGRhdGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc2V0dGluZ3Muc2VsZWN0X3JlZ2lzdHJ5LnB1c2goc2VsZWN0b3IpO1xuICAgICAgICAgICAgLy8kKCc8L2JyPicpLmFwcGVuZFRvKGRyYXdlcl9jb250ZW50KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlbGVjdGlvbl9jb250YWluZXIgPSBmLm1rX2RyYXdlcihzZWN0aW9uX25hbWUsIGRyYXdlcl9jb250ZW50KTtcblxuICAgICAgICBzZWxlY3Rpb25fY29udGFpbmVyLmFwcGVuZFRvKHBhcmVudF9jb250YWluZXIpO1xuXG4gICAgICAgICQoc2VsZWN0aW9uX2NvbnRhaW5lcikuY2hpbGRyZW4oJy5kcmF3ZXInKS5jaGlsZHJlbignLmRyYXdlcl9jb250ZW50Jykuc2xpZGVVcCgnZmFzdCcpO1xuICAgIH1cbn07XG5cbmYuc2VsZWN0b3JfYWRkX29wdGlvbnMgPSBmdW5jdGlvbihzZWxlY3Rvcil7XG4gICAgdmFyIGxpc3QgPSBzZWxlY3Rvci5saXN0X3JlZi5nZXQoKTtcbiAgICBpZiggbGlzdCAmJiBsaXN0LmNvbnN0cnVjdG9yID09PSBPYmplY3QgKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ1wibGlzdFwiJywgbGlzdCk7XG4gICAgICAgIGxpc3QgPSBmLm9ial9uYW1lcyhsaXN0KTtcbiAgICB9XG4gICAgc2VsZWN0b3IuZWxlbS5pbm5lckhUTUwgPSBcIlwiO1xuICAgIGlmKCBsaXN0IGluc3RhbmNlb2YgQXJyYXkgKXtcbiAgICAgICAgdmFyIGN1cnJlbnRfdmFsdWUgPSBzZWxlY3Rvci5zeXN0ZW1fcmVmLmdldCgpO1xuICAgICAgICAkKCc8b3B0aW9uPicpLmF0dHIoJ3NlbGVjdGVkJyx0cnVlKS5hdHRyKCdkaXNhYmxlZCcsdHJ1ZSkuYXR0cignaGlkZGVuJyx0cnVlKS5hcHBlbmRUbyhzZWxlY3Rvci5lbGVtKTtcblxuICAgICAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24ob3B0X25hbWUpe1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhvcHRfbmFtZSk7XG4gICAgICAgICAgICB2YXIgbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICAgICAgby52YWx1ZSA9IG9wdF9uYW1lO1xuICAgICAgICAgICAgaWYoIGN1cnJlbnRfdmFsdWUgKXtcbiAgICAgICAgICAgICAgICBpZiggb3B0X25hbWUudG9TdHJpbmcoKSA9PT0gY3VycmVudF92YWx1ZS50b1N0cmluZygpICkge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdmb3VuZCBpdDonLCBvcHRfbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIG8uc2VsZWN0ZWQgPSBcInNlbGVjdGVkXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZG9lcyBub3QgbWF0Y2g6ICcsIG9wdF9uYW1lLCBcIixcIiwgIGN1cnJlbnRfdmFsdWUsIFwiLlwiICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vby5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlbGVjdG9yX29wdGlvbicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdubyBjdXJyZW50IHZhbHVlJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG8uaW5uZXJIVE1MID0gb3B0X25hbWU7XG4gICAgICAgICAgICBzZWxlY3Rvci5lbGVtLmFwcGVuZENoaWxkKG8pO1xuICAgICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2xpc3Qgbm90IGEgbGlzdCcsIGxpc3QsIHNlbGVjdCk7XG4gICAgfVxufTtcblxuZi5hZGRfb3B0aW9ucyA9IGZ1bmN0aW9uKHNlbGVjdCwgYXJyYXkpe1xuICAgIGFycmF5LmZvckVhY2goIGZ1bmN0aW9uKG9wdGlvbil7XG4gICAgICAgICQoJzxvcHRpb24+JykuYXR0ciggJ3ZhbHVlJywgb3B0aW9uICkudGV4dChvcHRpb24pLmFwcGVuZFRvKHNlbGVjdCk7XG4gICAgfSk7XG59O1xuXG5mLmFkZF9wYXJhbXMgPSBmdW5jdGlvbihzZXR0aW5ncywgcGFyZW50X2NvbnRhaW5lcil7XG4gICAgZm9yKCB2YXIgc2VjdGlvbl9uYW1lIGluIHNldHRpbmdzLnN5c3RlbSApe1xuICAgICAgICBpZiggdHJ1ZSB8fCBmLm9iamVjdF9kZWZpbmVkKHNldHRpbmdzLnN5c3RlbVtzZWN0aW9uX25hbWVdKSApe1xuICAgICAgICAgICAgdmFyIHNlbGVjdGlvbl9jb250YWluZXIgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3BhcmFtX3NlY3Rpb24nKS5hdHRyKCdpZCcsIHNlY3Rpb25fbmFtZSApLmFwcGVuZFRvKHBhcmVudF9jb250YWluZXIpO1xuICAgICAgICAgICAgLy9zZWxlY3Rpb25fY29udGFpbmVyLmdldCgwKS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheV90eXBlO1xuICAgICAgICAgICAgdmFyIHN5c3RlbV9kaXYgPSAkKCc8ZGl2PicpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpdGxlX2xpbmUnKVxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhzZWxlY3Rpb25fY29udGFpbmVyKVxuICAgICAgICAgICAgICAgIC8qIGpzaGludCAtVzA4MyAqL1xuICAgICAgICAgICAgICAgIC5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlVG9nZ2xlKCdmYXN0Jyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgc3lzdGVtX3RpdGxlID0gJCgnPGE+JylcbiAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAndGl0bGVfbGluZV90ZXh0JylcbiAgICAgICAgICAgICAgICAuYXR0cignaHJlZicsICcjJylcbiAgICAgICAgICAgICAgICAudGV4dChmLnByZXR0eV9uYW1lKHNlY3Rpb25fbmFtZSkpXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKHN5c3RlbV9kaXYpO1xuICAgICAgICAgICAgJCh0aGlzKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgdmFyIGRyYXdlciA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAnJykuYXBwZW5kVG8oc2VsZWN0aW9uX2NvbnRhaW5lcik7XG4gICAgICAgICAgICB2YXIgZHJhd2VyX2NvbnRlbnQgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3BhcmFtX3NlY3Rpb25fY29udGVudCcpLmFwcGVuZFRvKGRyYXdlcik7XG4gICAgICAgICAgICBmb3IoIHZhciBpbnB1dF9uYW1lIGluIHNldHRpbmdzLnN5c3RlbVtzZWN0aW9uX25hbWVdICl7XG4gICAgICAgICAgICAgICAgJCgnPHNwYW4+JykuaHRtbChmLnByZXR0eV9uYW1lKGlucHV0X25hbWUpICsgJzogJykuYXBwZW5kVG8oZHJhd2VyX2NvbnRlbnQpO1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gayQoJ3ZhbHVlJylcbiAgICAgICAgICAgICAgICAgICAgLy8uc2V0T3B0aW9uc1JlZiggJ2lucHV0cy4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSApXG4gICAgICAgICAgICAgICAgICAgIC5zZXRSZWYoICdzeXN0ZW0uJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUgKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oZHJhd2VyX2NvbnRlbnQpO1xuICAgICAgICAgICAgICAgIGYua2VsZW1fc2V0dXAoc2VsZWN0b3IsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAvLyovXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlX2tvbnRhaW5lciA9IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKVxuICAgICAgICAgICAgICAgICAgICAub2JqKHNldHRpbmdzKVxuICAgICAgICAgICAgICAgICAgICAucmVmKCdzeXN0ZW0uJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUpO1xuICAgICAgICAgICAgICAgIHZhciAkZWxlbSA9ICQoJzxzcGFuPicpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICcnKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oZHJhd2VyX2NvbnRlbnQpXG4gICAgICAgICAgICAgICAgICAgIC50ZXh0KHZhbHVlX2tvbnRhaW5lci5nZXQoKSk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0ge1xuICAgICAgICAgICAgICAgICAgICBlbGVtOiAkZWxlbS5nZXQoKVswXSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVfcmVmOiB2YWx1ZV9rb250YWluZXJcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHNldHRpbmdzLnZhbHVlX3JlZ2lzdHJ5LnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgICQoJzwvYnI+JykuYXBwZW5kVG8oZHJhd2VyX2NvbnRlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuZi51cGRhdGVfdmFsdWVzID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIHNldHRpbmdzLnZhbHVlX3JlZ2lzdHJ5LmZvckVhY2goZnVuY3Rpb24odmFsdWVfaXRlbSl7XG4gICAgICAgIC8vY29uc29sZS5sb2coIHZhbHVlX2l0ZW0gKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggdmFsdWVfaXRlbS5lbGVtLm9wdGlvbnMgKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggdmFsdWVfaXRlbS5lbGVtLnNlbGVjdGVkSW5kZXggKTtcbiAgICAgICAgaWYodmFsdWVfaXRlbS5lbGVtLnNlbGVjdGVkSW5kZXgpe1xuICAgICAgICAgICAgdmFsdWVfaXRlbS52YWx1ZSA9IHZhbHVlX2l0ZW0uZWxlbS5vcHRpb25zW3ZhbHVlX2l0ZW0uZWxlbS5zZWxlY3RlZEluZGV4XS52YWx1ZTtcbiAgICAgICAgICAgIHZhbHVlX2l0ZW0ua29udGFpbmVyLnNldCh2YWx1ZV9pdGVtLnZhbHVlKTtcblxuICAgICAgICB9XG4gICAgfSk7XG59O1xuXG5mLnNob3dfaGlkZV9wYXJhbXMgPSBmdW5jdGlvbihwYWdlX3NlY3Rpb25zLCBzZXR0aW5ncyl7XG4gICAgZm9yKCB2YXIgbGlzdF9uYW1lIGluIHBhZ2Vfc2VjdGlvbnMgKXtcbiAgICAgICAgdmFyIGlkID0gJyMnK2xpc3RfbmFtZTtcbiAgICAgICAgdmFyIHNlY3Rpb25fbmFtZSA9IGxpc3RfbmFtZS5zcGxpdCgnXycpWzBdO1xuICAgICAgICB2YXIgc2VjdGlvbiA9IGskKGlkKTtcbiAgICAgICAgaWYoIHNldHRpbmdzLnN0YXR1cy5zZWN0aW9uc1tzZWN0aW9uX25hbWVdLnNldCApIHNlY3Rpb24uc2hvdygpO1xuICAgICAgICBlbHNlIHNlY3Rpb24uaGlkZSgpO1xuICAgIH1cbn07XG5cbmYuc2hvd19oaWRlX3NlbGVjdGlvbnMgPSBmdW5jdGlvbihzZXR0aW5ncywgYWN0aXZlX3NlY3Rpb25fbmFtZSl7XG4gICAgJCgnI3NlY3Rpb25TZWxlY3RvcicpLnZhbChhY3RpdmVfc2VjdGlvbl9uYW1lKTtcbiAgICBmb3IoIHZhciBsaXN0X25hbWUgaW4gc2V0dGluZ3MuaW5wdXQgKXtcbiAgICAgICAgdmFyIGlkID0gJyMnK2xpc3RfbmFtZTtcbiAgICAgICAgdmFyIHNlY3Rpb25fbmFtZSA9IGxpc3RfbmFtZS5zcGxpdCgnXycpWzBdO1xuICAgICAgICB2YXIgc2VjdGlvbiA9IGskKGlkKTtcbiAgICAgICAgaWYoIHNlY3Rpb25fbmFtZSA9PT0gYWN0aXZlX3NlY3Rpb25fbmFtZSApIHNlY3Rpb24uc2hvdygpO1xuICAgICAgICBlbHNlIHNlY3Rpb24uaGlkZSgpO1xuICAgIH1cbn07XG5cbi8vZi5zZXREb3dubG9hZExpbmsoc2V0dGluZ3Mpe1xuLy9cbi8vICAgIGlmKCBzZXR0aW5ncy5QREYgJiYgc2V0dGluZ3MuUERGLnVybCApe1xuLy8gICAgICAgIHZhciBsaW5rID0gJCgnYScpLmF0dHIoJ2hyZWYnLCBzZXR0aW5ncy5QREYudXJsICkuYXR0cignZG93bmxvYWQnLCAnUFZfZHJhd2luZy5wZGYnKS5odG1sKCdEb3dubG9hZCBEcmF3aW5nJyk7XG4vLyAgICAgICAgJCgnI2Rvd25sb2FkJykuaHRtbCgnJykuYXBwZW5kKGxpbmspO1xuLy8gICAgfVxuLy99XG5cbmYubG9hZFRhYmxlcyA9IGZ1bmN0aW9uKHN0cmluZyl7XG4gICAgdmFyIHRhYmxlcyA9IHt9O1xuICAgIHZhciBsID0gc3RyaW5nLnNwbGl0KCdcXG4nKTtcbiAgICB2YXIgdGl0bGU7XG4gICAgdmFyIGZpZWxkcztcbiAgICB2YXIgbmVlZF90aXRsZSA9IHRydWU7XG4gICAgdmFyIG5lZWRfZmllbGRzID0gdHJ1ZTtcbiAgICBsLmZvckVhY2goIGZ1bmN0aW9uKHN0cmluZywgaSl7XG4gICAgICAgIHZhciBsaW5lID0gc3RyaW5nLnRyaW0oKTtcbiAgICAgICAgaWYoIGxpbmUubGVuZ3RoID09PSAwICl7XG4gICAgICAgICAgICBuZWVkX3RpdGxlID0gdHJ1ZTtcbiAgICAgICAgICAgIG5lZWRfZmllbGRzID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmKCBuZWVkX3RpdGxlICkge1xuICAgICAgICAgICAgdGl0bGUgPSBsaW5lO1xuICAgICAgICAgICAgdGFibGVzW3RpdGxlXSA9IFtdO1xuICAgICAgICAgICAgbmVlZF90aXRsZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYoIG5lZWRfZmllbGRzICkge1xuICAgICAgICAgICAgZmllbGRzID0gbGluZS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgdGFibGVzW3RpdGxlK1wiX2ZpZWxkc1wiXSA9IGZpZWxkcztcbiAgICAgICAgICAgIG5lZWRfZmllbGRzID0gZmFsc2U7XG4gICAgICAgIC8vfSBlbHNlIHtcbiAgICAgICAgLy8gICAgdmFyIGVudHJ5ID0ge307XG4gICAgICAgIC8vICAgIHZhciBsaW5lX2FycmF5ID0gbGluZS5zcGxpdCgnLCcpO1xuICAgICAgICAvLyAgICBmaWVsZHMuZm9yRWFjaCggZnVuY3Rpb24oZmllbGQsIGlkKXtcbiAgICAgICAgLy8gICAgICAgIGVudHJ5W2ZpZWxkLnRyaW0oKV0gPSBsaW5lX2FycmF5W2lkXS50cmltKCk7XG4gICAgICAgIC8vICAgIH0pO1xuICAgICAgICAvLyAgICB0YWJsZXNbdGl0bGVdLnB1c2goIGVudHJ5ICk7XG4gICAgICAgIC8vfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGxpbmVfYXJyYXkgPSBsaW5lLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICB0YWJsZXNbdGl0bGVdW2xpbmVfYXJyYXlbMF0udHJpbSgpXSA9IGxpbmVfYXJyYXlbMV0udHJpbSgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGFibGVzO1xufTtcblxuZi5sb2FkQ29tcG9uZW50cyA9IGZ1bmN0aW9uKHN0cmluZyl7XG4gICAgdmFyIGRiID0gay5wYXJzZUNTVihzdHJpbmcpO1xuICAgIHZhciBvYmplY3QgPSB7fTtcbiAgICBmb3IoIHZhciBpIGluIGRiICl7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSBkYltpXTtcbiAgICAgICAgaWYoIG9iamVjdFtjb21wb25lbnQuTWFrZV0gPT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgb2JqZWN0W2NvbXBvbmVudC5NYWtlXSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmKCBvYmplY3RbY29tcG9uZW50Lk1ha2VdW2NvbXBvbmVudC5Nb2RlbF0gPT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgb2JqZWN0W2NvbXBvbmVudC5NYWtlXVtjb21wb25lbnQuTW9kZWxdID0ge307XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmllbGRzID0gay5vYmpJZEFycmF5KGNvbXBvbmVudCk7XG4gICAgICAgIGZpZWxkcy5mb3JFYWNoKCBmdW5jdGlvbiggZmllbGQgKXtcbiAgICAgICAgICAgIHZhciBwYXJhbSA9IGNvbXBvbmVudFtmaWVsZF07XG4gICAgICAgICAgICBpZiggISggZmllbGQgaW4gWydNYWtlJywgJ01vZGVsJ10gKSAmJiAhKCBpc05hTihwYXJzZUZsb2F0KHBhcmFtKSkgKSApe1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudFtmaWVsZF0gPSBwYXJzZUZsb2F0KHBhcmFtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgb2JqZWN0W2NvbXBvbmVudC5NYWtlXVtjb21wb25lbnQuTW9kZWxdID0gY29tcG9uZW50O1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xufTtcblxuXG5cblxuZi5sb2FkX2RhdGFiYXNlID0gZnVuY3Rpb24oRlNFQ19kYXRhYmFzZV9KU09OKXtcbiAgICBGU0VDX2RhdGFiYXNlX0pTT04gPSBmLmxvd2VyY2FzZV9wcm9wZXJ0aWVzKEZTRUNfZGF0YWJhc2VfSlNPTik7XG4gICAgdmFyIHNldHRpbmdzID0gZi5zZXR0aW5ncztcbiAgICBzZXR0aW5ncy5jb21wb25lbnRzLmludmVydGVycyA9IHt9O1xuICAgIEZTRUNfZGF0YWJhc2VfSlNPTi5pbnZlcnRlcnMuZm9yRWFjaChmdW5jdGlvbihjb21wb25lbnQpe1xuICAgICAgICBpZiggc2V0dGluZ3MuY29tcG9uZW50cy5pbnZlcnRlcnNbY29tcG9uZW50Lm1ha2VdID09PSB1bmRlZmluZWQgKSBzZXR0aW5ncy5jb21wb25lbnRzLmludmVydGVyc1tjb21wb25lbnQubWFrZV0gPSB7fTtcbiAgICAgICAgLy9zZXR0aW5ncy5jb21wb25lbnRzLmludmVydGVyc1tjb21wb25lbnQubWFrZV1bY29tcG9uZW50Lm1ha2VdID0gZi5wcmV0dHlfbmFtZXMoY29tcG9uZW50KTtcbiAgICAgICAgc2V0dGluZ3MuY29tcG9uZW50cy5pbnZlcnRlcnNbY29tcG9uZW50Lm1ha2VdW2NvbXBvbmVudC5tb2RlbF0gPSBjb21wb25lbnQ7XG4gICAgfSk7XG4gICAgc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzID0ge307XG4gICAgRlNFQ19kYXRhYmFzZV9KU09OLm1vZHVsZXMuZm9yRWFjaChmdW5jdGlvbihjb21wb25lbnQpe1xuICAgICAgICBpZiggc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzW2NvbXBvbmVudC5tYWtlXSA9PT0gdW5kZWZpbmVkICkgc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzW2NvbXBvbmVudC5tYWtlXSA9IHt9O1xuICAgICAgICAvL3NldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tjb21wb25lbnQubWFrZV1bY29tcG9uZW50Lm1ha2VdID0gZi5wcmV0dHlfbmFtZXMoY29tcG9uZW50KTtcbiAgICAgICAgc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzW2NvbXBvbmVudC5tYWtlXVtjb21wb25lbnQubW9kZWxdID0gY29tcG9uZW50O1xuICAgIH0pO1xuXG4gICAgZi51cGRhdGUoKTtcbn07XG5cblxuZi5nZXRfcmVmID0gZnVuY3Rpb24oc3RyaW5nLCBvYmplY3Qpe1xuICAgIHZhciByZWZfYXJyYXkgPSBzdHJpbmcuc3BsaXQoJy4nKTtcbiAgICB2YXIgbGV2ZWwgPSBvYmplY3Q7XG4gICAgcmVmX2FycmF5LmZvckVhY2goZnVuY3Rpb24obGV2ZWxfbmFtZSxpKXtcbiAgICAgICAgaWYoIHR5cGVvZiBsZXZlbFtsZXZlbF9uYW1lXSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbGV2ZWwgPSBsZXZlbFtsZXZlbF9uYW1lXTtcbiAgICB9KTtcbiAgICByZXR1cm4gbGV2ZWw7XG59O1xuZi5zZXRfcmVmID0gZnVuY3Rpb24oIG9iamVjdCwgcmVmX3N0cmluZywgdmFsdWUgKXtcbiAgICB2YXIgcmVmX2FycmF5ID0gcmVmX3N0cmluZy5zcGxpdCgnLicpO1xuICAgIHZhciBsZXZlbCA9IG9iamVjdDtcbiAgICByZWZfYXJyYXkuZm9yRWFjaChmdW5jdGlvbihsZXZlbF9uYW1lLGkpe1xuICAgICAgICBpZiggdHlwZW9mIGxldmVsW2xldmVsX25hbWVdID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXZlbCA9IGxldmVsW2xldmVsX25hbWVdO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGxldmVsO1xufTtcblxuXG5cblxuZi5sb2dfaWZfZGF0YWJhc2VfbG9hZGVkID0gZnVuY3Rpb24oZSl7XG4gICAgaWYoZi5zZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIHtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgfVxufTtcblxuXG5cbmYubG93ZXJjYXNlX3Byb3BlcnRpZXMgPSBmdW5jdGlvbiBsb3dlcmNhc2VfcHJvcGVydGllcyhvYmopIHtcbiAgICB2YXIgbmV3X29iamVjdCA9IG5ldyBvYmouY29uc3RydWN0b3IoKTtcbiAgICBmb3IoIHZhciBvbGRfbmFtZSBpbiBvYmogKXtcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShvbGRfbmFtZSkpIHtcbiAgICAgICAgICAgIHZhciBuZXdfbmFtZSA9IG9sZF9uYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiggb2JqW29sZF9uYW1lXS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0IHx8IG9ialtvbGRfbmFtZV0uY29uc3RydWN0b3IgPT09IEFycmF5ICl7XG4gICAgICAgICAgICAgICAgbmV3X29iamVjdFtuZXdfbmFtZV0gPSBsb3dlcmNhc2VfcHJvcGVydGllcyhvYmpbb2xkX25hbWVdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3X29iamVjdFtuZXdfbmFtZV0gPSBvYmpbb2xkX25hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG4gICAgcmV0dXJuIG5ld19vYmplY3Q7XG59O1xuXG5cbmYudG9nZ2xlX21vZHVsZSA9IGZ1bmN0aW9uKGVsZW1lbnQpe1xuICAgIC8vY29uc29sZS5sb2coJ3N3aXRjaCcsIGVsZW1lbnQsIGVsZW1lbnQuY2xhc3NMaXMgKTtcblxuICAgIC8vZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIG51bGwpO1xuXG4gICAgdmFyIGVsZW0gPSAkKGVsZW1lbnQpO1xuICAgIC8vY29uc29sZS5sb2coJ3N3aXRjaCcsIGVsZW1bMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdwcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlJykgKTtcblxuICAgIHZhciByID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ21vZHVsZV9JRCcpLnNwbGl0KCcsJylbMF07XG4gICAgdmFyIGMgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnbW9kdWxlX0lEJykuc3BsaXQoJywnKVsxXTtcblxuICAgIGlmKCBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSApe1xuICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSA9IGZhbHNlO1xuICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbC0tO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzW3JdW2NdID0gdHJ1ZTtcbiAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNfdG90YWwrKztcbiAgICB9XG5cbiAgICAvKlxuICAgIHZhciBsYXllcjtcbiAgICBpZiggZWxlbVswXS5jbGFzc0xpc3QuY29udGFpbnMoJ3N2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkJykgKXtcbiAgICAgICAgLy9nLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSA9IHRydWU7XG4gICAgICAgIC8vbGF5ZXIgPSBnLmRyYXdpbmdfc2V0dGluZ3MubGF5ZXJfYXR0ci5wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlO1xuICAgICAgICAvL2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlcyA9IGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzICsxIHx8IDE7XG4gICAgICAgIC8vbGF5ZXIgPSBnLmRyYXdpbmdfc2V0dGluZ3MubGF5ZXJfYXR0ci5wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkO1xuICAgICAgICAvL2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZFwiKTtcbiAgICB9XG4gICAgLy8qL1xuICAgIC8vY29uc29sZS5sb2coIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzKTtcbiAgICAvL2ZvciggdmFyIGF0dHJfbmFtZSBpbiBsYXllciApe1xuICAgIC8vICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJfbmFtZSwgbGF5ZXJbYXR0cl9uYW1lXSk7XG5cbiAgICAvL31cblxuICAgIGcuZi51cGRhdGUoKTtcblxuICAgIC8qXG4gICAgaWYoIGVsZW0uaGFzQ2xhc3MoXCJzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZVwiKSApe1xuICAgICAgICBlbGVtLnJlbW92ZUNsYXNzKFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVcIik7XG4gICAgICAgIGVsZW0uYWRkQ2xhc3MoXCJzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZFwiKTtcbiAgICB9IGVsc2UgaWYoIGVsZW0uaGFzQ2xhc3MoXCJzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZFwiKSApe1xuICAgICAgICBlbGVtLnJlbW92ZUNsYXNzKFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWRcIik7XG4gICAgICAgIGVsZW0uYWRkQ2xhc3MoXCJzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtLmFkZENsYXNzKFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVcIik7XG4gICAgfVxuICAgICovXG59O1xuXG5cbmYuY2xlYXJfb2JqZWN0ID0gZnVuY3Rpb24ob2JqKXtcbiAgICBmb3IoIHZhciBpZCBpbiBvYmogKXtcbiAgICAgICAgaWYoIG9iai5oYXNPd25Qcm9wZXJ0eShpZCkpe1xuICAgICAgICAgICAgZGVsZXRlIG9ialtpZF07XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vLyBjbGVhciBkcmF3aW5nXG5mLmNsZWFyX2RyYXdpbmcgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IoIHZhciBpZCBpbiBnLmRyYXdpbmcgKXtcbiAgICAgICAgaWYoIGcuZHJhd2luZy5oYXNPd25Qcm9wZXJ0eShpZCkpe1xuICAgICAgICAgICAgZi5jbGVhcl9vYmplY3QoZy5kcmF3aW5nW2lkXSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cblxuZi5xdWVyeV9zdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIEJhc2VkIG9uXG4gIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzk3OTk5NVxuICB2YXIgcXVlcnlfc3RyaW5nID0ge307XG4gIHZhciBxdWVyeSA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyaW5nKDEpO1xuICB2YXIgdmFycyA9IHF1ZXJ5LnNwbGl0KFwiJlwiKTtcbiAgdmFyIGk7XG4gIGZvciAoIGk9MDsgaTx2YXJzLmxlbmd0aDsgaSsrICkge1xuICAgIHZhciBwYWlyID0gdmFyc1tpXS5zcGxpdChcIj1cIik7XG4gICAgICAgIC8vIElmIGZpcnN0IGVudHJ5IHdpdGggdGhpcyBuYW1lXG4gICAgaWYgKHR5cGVvZiBxdWVyeV9zdHJpbmdbcGFpclswXV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcXVlcnlfc3RyaW5nW3BhaXJbMF1dID0gcGFpclsxXTtcbiAgICAgICAgLy8gSWYgc2Vjb25kIGVudHJ5IHdpdGggdGhpcyBuYW1lXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcXVlcnlfc3RyaW5nW3BhaXJbMF1dID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHZhciBhcnIgPSBbIHF1ZXJ5X3N0cmluZ1twYWlyWzBdXSwgcGFpclsxXSBdO1xuICAgICAgICBxdWVyeV9zdHJpbmdbcGFpclswXV0gPSBhcnI7XG4gICAgICAgIC8vIElmIHRoaXJkIG9yIGxhdGVyIGVudHJ5IHdpdGggdGhpcyBuYW1lXG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVlcnlfc3RyaW5nW3BhaXJbMF1dLnB1c2gocGFpclsxXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBxdWVyeV9zdHJpbmc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGY7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xuXG4vL3ZhciBkcmF3aW5nX3BhcnRzID0gW107XG4vL2QubGlua19kcmF3aW5nX3BhcnRzKGRyYXdpbmdfcGFydHMpO1xuXG52YXIgcGFnZSA9IGZ1bmN0aW9uKCl7XG4gICAgY29uc29sZS5sb2coXCIqKiBNYWtpbmcgcGFnZSAyXCIpO1xuICAgIGQgPSBta19kcmF3aW5nKCk7XG5cbiAgICB2YXIgZiA9IGcuZjtcblxuICAgIC8vdmFyIGNvbXBvbmVudHMgPSBnLmNvbXBvbmVudHM7XG4gICAgLy92YXIgc3lzdGVtID0gZy5zeXN0ZW07XG4gICAgdmFyIHN5c3RlbSA9IGcuc3lzdGVtO1xuXG4gICAgdmFyIHNpemUgPSBnLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgbG9jID0gZy5kcmF3aW5nX3NldHRpbmdzLmxvYztcblxuXG5cblxuICAgIHZhciB4LCB5LCBoLCB3O1xuICAgIHZhciBvZmZzZXQ7XG5cbi8vIERlZmluZSBkLmJsb2Nrc1xuXG4vLyBtb2R1bGUgZC5ibG9ja1xuICAgIHcgPSBzaXplLm1vZHVsZS5mcmFtZS53O1xuICAgIGggPSBzaXplLm1vZHVsZS5mcmFtZS5oO1xuXG4gICAgZC5ibG9ja19zdGFydCgnbW9kdWxlJyk7XG5cbiAgICAvLyBmcmFtZVxuICAgIGQubGF5ZXIoJ21vZHVsZScpO1xuICAgIHggPSAwO1xuICAgIHkgPSAwK3NpemUubW9kdWxlLmxlYWQ7XG4gICAgZC5yZWN0KCBbeCx5K2gvMl0sIFt3LGhdICk7XG4gICAgLy8gZnJhbWUgdHJpYW5nbGU/XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gtdy8yLHldLFxuICAgICAgICBbeCx5K3cvMl0sXG4gICAgXSk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gseSt3LzJdLFxuICAgICAgICBbeCt3LzIseV0sXG4gICAgXSk7XG4gICAgLy8gbGVhZHNcbiAgICBkLmxheWVyKCdEQ19wb3MnKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCwgeV0sXG4gICAgICAgIFt4LCB5LXNpemUubW9kdWxlLmxlYWRdXG4gICAgXSk7XG4gICAgZC5sYXllcignRENfbmVnJyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gsIHkraF0sXG4gICAgICAgIFt4LCB5K2grKHNpemUubW9kdWxlLmxlYWQpXVxuICAgIF0pO1xuICAgIC8vIHBvcyBzaWduXG4gICAgZC5sYXllcigndGV4dCcpO1xuICAgIGQudGV4dChcbiAgICAgICAgW3grc2l6ZS5tb2R1bGUubGVhZC8yLCB5LXNpemUubW9kdWxlLmxlYWQvMl0sXG4gICAgICAgICcrJyxcbiAgICAgICAgJ3NpZ25zJ1xuICAgICk7XG4gICAgLy8gbmVnIHNpZ25cbiAgICBkLnRleHQoXG4gICAgICAgIFt4K3NpemUubW9kdWxlLmxlYWQvMiwgeStoK3NpemUubW9kdWxlLmxlYWQvMl0sXG4gICAgICAgICctJyxcbiAgICAgICAgJ3NpZ25zJ1xuICAgICk7XG4gICAgLy8gZ3JvdW5kXG4gICAgZC5sYXllcignRENfZ3JvdW5kJyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gtdy8yLCB5K2gvMl0sXG4gICAgICAgIFt4LXcvMi13LzQsIHkraC8yXSxcbiAgICBdKTtcblxuICAgIGQubGF5ZXIoKTtcbiAgICBkLmJsb2NrX2VuZCgpO1xuXG4vLyNzdHJpbmdcbiAgICBkLmJsb2NrX3N0YXJ0KCdzdHJpbmcnKTtcblxuICAgIHggPSAwO1xuICAgIHkgPSAwO1xuXG5cblxuXG5cbiAgICB2YXIgbWF4X2Rpc3BsYXllZF9tb2R1bGVzID0gOTtcbiAgICB2YXIgYnJlYWtfc3RyaW5nID0gZmFsc2U7XG5cbiAgICBpZiggc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZyA+IG1heF9kaXNwbGF5ZWRfbW9kdWxlcyApe1xuICAgICAgICBkaXNwbGF5ZWRfbW9kdWxlcyA9IG1heF9kaXNwbGF5ZWRfbW9kdWxlcyAtIDE7XG4gICAgICAgIGJyZWFrX3N0cmluZyA9IHRydWU7XG4gICAgICAgIHNpemUuc3RyaW5nLmggPSAoc2l6ZS5tb2R1bGUuaCAqIChkaXNwbGF5ZWRfbW9kdWxlcysxKSApICsgc2l6ZS5zdHJpbmcuZ2FwX21pc3Npbmc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZGlzcGxheWVkX21vZHVsZXMgPSBzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nO1xuICAgICAgICBzaXplLnN0cmluZy5oID0gKHNpemUubW9kdWxlLmggKiBkaXNwbGF5ZWRfbW9kdWxlcyk7XG4gICAgfVxuICAgIGxvYy5hcnJheS5sb3dlciA9IGxvYy5hcnJheS51cHBlciArIHNpemUuc3RyaW5nLmg7XG5cbiAgICBzaXplLnN0cmluZy5oX21heCA9IChzaXplLm1vZHVsZS5oICogbWF4X2Rpc3BsYXllZF9tb2R1bGVzKSArIHNpemUuc3RyaW5nLmdhcF9taXNzaW5nO1xuICAgIGxvYy5hcnJheS5sb3dlcl9saW1pdCA9IGxvYy5hcnJheS51cHBlciArIHNpemUuc3RyaW5nLmhfbWF4O1xuXG5cblxuICAgIGZvciggdmFyIHI9MDsgcjxkaXNwbGF5ZWRfbW9kdWxlczsgcisrKXtcbiAgICAgICAgZC5ibG9jaygnbW9kdWxlJywgW3gseV0pO1xuICAgICAgICB5ICs9IHNpemUubW9kdWxlLmg7XG5cbiAgICB9XG4gICAgaWYoIGJyZWFrX3N0cmluZyApIHtcbiAgICAgICAgZC5saW5lKFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIFt4LHldLFxuICAgICAgICAgICAgICAgIFt4LHkrc2l6ZS5zdHJpbmcuZ2FwX21pc3NpbmddLFxuICAgICAgICAgICAgLy9beC1zaXplLm1vZHVsZS5mcmFtZS53KjMvNCwgeStzaXplLnN0cmluZy5oICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAnRENfaW50ZXJtb2R1bGUnXG4gICAgICAgICk7XG5cbiAgICAgICAgeSArPSBzaXplLnN0cmluZy5nYXBfbWlzc2luZztcbiAgICAgICAgZC5ibG9jaygnbW9kdWxlJywgW3gseV0pO1xuICAgIH1cblxuICAgIHggPSAwO1xuICAgIHkgPSAwO1xuXG4gICAgLy9UT0RPOiBhZGQgbG9vcCB0byBqdW1wIG92ZXIgbmVnYXRpdmUgcmV0dXJuIHdpcmVzXG4gICAgZC5sYXllcignRENfZ3JvdW5kJyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gtc2l6ZS5tb2R1bGUuZnJhbWUudyozLzQsIHkrc2l6ZS5tb2R1bGUuaC8yXSxcbiAgICAgICAgW3gtc2l6ZS5tb2R1bGUuZnJhbWUudyozLzQsIHkrc2l6ZS5zdHJpbmcuaF9tYXggKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZF0sXG4gICAgICAgIC8vW3gtc2l6ZS5tb2R1bGUuZnJhbWUudyozLzQsIHkrc2l6ZS5zdHJpbmcuaCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgXSk7XG4gICAgZC5sYXllcigpO1xuXG5cbiAgICBkLmJsb2NrX2VuZCgpO1xuXG5cbi8vIHRlcm1pbmFsXG4gICAgZC5ibG9ja19zdGFydCgndGVybWluYWwnKTtcbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcblxuICAgIGQubGF5ZXIoJ3Rlcm1pbmFsJyk7XG4gICAgZC5jaXJjKFxuICAgICAgICBbeCx5XSxcbiAgICAgICAgc2l6ZS50ZXJtaW5hbF9kaWFtXG4gICAgKTtcbiAgICBkLmxheWVyKCk7XG4gICAgZC5ibG9ja19lbmQoKTtcblxuLy8gZnVzZVxuXG4gICAgZC5ibG9ja19zdGFydCgnZnVzZScpO1xuICAgIHggPSAwO1xuICAgIHkgPSAwO1xuICAgIHcgPSAxMDtcbiAgICBoID0gNTtcblxuICAgIGQubGF5ZXIoJ3Rlcm1pbmFsJyk7XG4gICAgZC5yZWN0KFxuICAgICAgICBbeCx5XSxcbiAgICAgICAgW3csaF1cbiAgICApO1xuICAgIGQubGluZSggW1xuICAgICAgICBbdy8yLHldLFxuICAgICAgICBbdy8yK3NpemUuZnVzZS53LCB5XVxuICAgIF0pO1xuICAgIGQuYmxvY2soJ3Rlcm1pbmFsJywgW3NpemUuZnVzZS53LCB5XSApO1xuXG4gICAgZC5saW5lKCBbXG4gICAgICAgIFstdy8yLHldLFxuICAgICAgICBbLXcvMi1zaXplLmZ1c2UudywgeV1cbiAgICBdKTtcbiAgICBkLmJsb2NrKCd0ZXJtaW5hbCcsIFstc2l6ZS5mdXNlLncsIHldICk7XG5cbiAgICBkLmxheWVyKCk7XG4gICAgZC5ibG9ja19lbmQoKTtcblxuLy8gZ3JvdW5kIHN5bWJvbFxuICAgIGQuYmxvY2tfc3RhcnQoJ2dyb3VuZCcpO1xuICAgIHggPSAwO1xuICAgIHkgPSAwO1xuXG4gICAgZC5sYXllcignQUNfZ3JvdW5kJyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gseV0sXG4gICAgICAgIFt4LHkrNDBdLFxuICAgIF0pO1xuICAgIHkgKz0gMjU7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gtNy41LHldLFxuICAgICAgICBbeCs3LjUseV0sXG4gICAgXSk7XG4gICAgeSArPSA1O1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LTUseV0sXG4gICAgICAgIFt4KzUseV0sXG4gICAgXSk7XG4gICAgeSArPSA1O1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LTIuNSx5XSxcbiAgICAgICAgW3grMi41LHldLFxuICAgIF0pO1xuICAgIGQubGF5ZXIoKTtcblxuICAgIGQuYmxvY2tfZW5kKCk7XG5cblxuXG4vLyBOb3J0aCBhcnJvd1xuICAgIHggPSAwO1xuICAgIHkgPSAwO1xuXG4gICAgdmFyIGFycm93X3cgPSAxMDtcbiAgICB2YXIgbGV0dGVyX2ggPSAyMDtcbiAgICB2YXIgYXJyb3dfaCA9IDUwO1xuXG4gICAgZC5ibG9ja19zdGFydCgnbm9ydGggYXJyb3dfdXAnKTtcbiAgICBkLmxheWVyKCdub3J0aF9sZXR0ZXInKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCwgeStsZXR0ZXJfaF0sXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3grYXJyb3dfdywgeStsZXR0ZXJfaF0sXG4gICAgICAgIFt4K2Fycm93X3csIHldLFxuICAgIF0pO1xuICAgIGQubGF5ZXIoJ25vcnRoX2Fycm93Jyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gsIHkrYXJyb3dfaF0sXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3grYXJyb3dfdy8yLCB5K2xldHRlcl9oLzJdLFxuICAgIF0pO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3gtYXJyb3dfdy8yLCB5K2xldHRlcl9oLzJdLFxuICAgIF0pO1xuICAgIGQubGF5ZXIoKTtcbiAgICBkLmJsb2NrX2VuZCgnbm9ydGggYXJyb3cnKTtcblxuICAgIGQuYmxvY2tfc3RhcnQoJ25vcnRoIGFycm93X2xlZnQnKTtcbiAgICBkLmxheWVyKCdub3J0aF9sZXR0ZXInKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCtsZXR0ZXJfaCwgeV0sXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3grbGV0dGVyX2gsIHktYXJyb3dfd10sXG4gICAgICAgIFt4LCAgICAgICAgICB5LWFycm93X3ddLFxuICAgIF0pO1xuICAgIGQubGF5ZXIoJ25vcnRoX2Fycm93Jyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3grYXJyb3dfaCwgeV0sXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3grbGV0dGVyX2gvMiwgeS1hcnJvd193LzJdLFxuICAgIF0pO1xuICAgIGQubGF5ZXIoKTtcbiAgICBkLmJsb2NrX2VuZCgnbm9ydGggYXJyb3cnKTtcblxuLy8qL1xuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xuXG4vL3ZhciBkcmF3aW5nX3BhcnRzID0gW107XG4vL2QubGlua19kcmF3aW5nX3BhcnRzKGRyYXdpbmdfcGFydHMpO1xuXG52YXIgYWRkX2JvcmRlciA9IGZ1bmN0aW9uKHNldHRpbmdzLCBzaGVldF9zZWN0aW9uLCBzaGVldF9udW0pe1xuICAgIGQgPSBta19kcmF3aW5nKCk7XG4gICAgdmFyIGYgPSBzZXR0aW5ncy5mO1xuXG4gICAgLy92YXIgY29tcG9uZW50cyA9IHNldHRpbmdzLmNvbXBvbmVudHM7XG4gICAgLy92YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG5cblxuXG5cbiAgICB2YXIgeCwgeSwgaCwgdztcbiAgICB2YXIgb2Zmc2V0O1xuXG4vLyBEZWZpbmUgZC5ibG9ja3Ncbi8vIG1vZHVsZSBkLmJsb2NrXG4gICAgdyA9IHNpemUubW9kdWxlLmZyYW1lLnc7XG4gICAgaCA9IHNpemUubW9kdWxlLmZyYW1lLmg7XG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gRnJhbWVcbiAgICBkLnNlY3Rpb24oJ0ZyYW1lJyk7XG5cbiAgICB3ID0gc2l6ZS5kcmF3aW5nLnc7XG4gICAgaCA9IHNpemUuZHJhd2luZy5oO1xuICAgIHZhciBwYWRkaW5nID0gc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmc7XG5cbiAgICBkLmxheWVyKCdmcmFtZScpO1xuXG4gICAgLy9ib3JkZXJcbiAgICBkLnJlY3QoIFt3LzIgLCBoLzJdLCBbdyAtIHBhZGRpbmcqMiwgaCAtIHBhZGRpbmcqMiBdICk7XG5cbiAgICB4ID0gdyAtIHBhZGRpbmcgKiAzO1xuICAgIHkgPSBwYWRkaW5nICogMztcblxuICAgIHcgPSBzaXplLmRyYXdpbmcudGl0bGVib3g7XG4gICAgaCA9IHNpemUuZHJhd2luZy50aXRsZWJveDtcblxuICAgIC8vIGJveCB0b3AtcmlnaHRcbiAgICBkLnJlY3QoIFt4LXcvMiwgeStoLzJdLCBbdyxoXSApO1xuXG4gICAgeSArPSBoICsgcGFkZGluZztcblxuICAgIHcgPSBzaXplLmRyYXdpbmcudGl0bGVib3g7XG4gICAgaCA9IHNpemUuZHJhd2luZy5oIC0gcGFkZGluZyo4IC0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94KjIuNTtcblxuICAgIC8vdGl0bGUgYm94XG4gICAgZC5yZWN0KCBbeC13LzIsIHkraC8yXSwgW3csaF0gKTtcblxuICAgIHZhciB0aXRsZSA9IHt9O1xuICAgIHRpdGxlLnRvcCA9IHk7XG4gICAgdGl0bGUuYm90dG9tID0geStoO1xuICAgIHRpdGxlLnJpZ2h0ID0geDtcbiAgICB0aXRsZS5sZWZ0ID0geC13IDtcblxuXG4gICAgLy8gYm94IGJvdHRvbS1yaWdodFxuICAgIGggPSBzaXplLmRyYXdpbmcudGl0bGVib3ggKiAxLjU7XG4gICAgeSA9IHRpdGxlLmJvdHRvbSArIHBhZGRpbmc7XG4gICAgeCA9IHgtdy8yO1xuICAgIHkgPSB5K2gvMjtcbiAgICBkLnJlY3QoIFt4LCB5XSwgW3csaF0gKTtcblxuICAgIHkgLT0gMjAqMi8zO1xuICAgIGQudGV4dChbeCx5XSxcbiAgICAgICAgWyBzaGVldF9zZWN0aW9uLCBzaGVldF9udW0gXSxcbiAgICAgICAgJ3BhZ2UnLFxuICAgICAgICAndGV4dCdcbiAgICAgICAgKTtcblxuXG4gICAgdmFyIHBhZ2UgPSB7fTtcbiAgICBwYWdlLnJpZ2h0ID0gdGl0bGUucmlnaHQ7XG4gICAgcGFnZS5sZWZ0ID0gdGl0bGUubGVmdDtcbiAgICBwYWdlLnRvcCA9IHRpdGxlLmJvdHRvbSArIHBhZGRpbmc7XG4gICAgcGFnZS5ib3R0b20gPSBwYWdlLnRvcCArIHNpemUuZHJhd2luZy50aXRsZWJveCoxLjU7XG4gICAgLy8gZC50ZXh0XG5cbiAgICB4ID0gdGl0bGUubGVmdCArIHBhZGRpbmc7XG4gICAgeSA9IHRpdGxlLmJvdHRvbSAtIHBhZGRpbmc7XG5cbiAgICB4ICs9IDEwO1xuICAgIGlmKCBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSAmJiBzeXN0ZW0uaW52ZXJ0ZXIubW9kZWwgKXtcbiAgICAgICAgZC50ZXh0KFt4LHldLFxuICAgICAgICAgICAgIFsgc3lzdGVtLmludmVydGVyLm1ha2UgKyBcIiBcIiArIHN5c3RlbS5pbnZlcnRlci5tb2RlbCArIFwiIEludmVydGVyIFN5c3RlbVwiIF0sXG4gICAgICAgICAgICAndGl0bGUxJywgJ3RleHQnKS5yb3RhdGUoLTkwKTtcblxuICAgIH1cblxuICAgIHggKz0gMTQ7XG4gICAgaWYoIHN5c3RlbS5tb2R1bGUubW9kZWwgJiYgc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzICYmIHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgICl7XG4gICAgICAgIGQudGV4dChbeCx5XSwgW1xuICAgICAgICAgICAgc3lzdGVtLm1vZHVsZS5tYWtlICsgXCIgXCIgKyBzeXN0ZW0ubW9kdWxlLm1vZGVsICtcbiAgICAgICAgICAgICAgICBcIiAoXCIgKyBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgICsgXCIgc3RyaW5ncyBvZiBcIiArIHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgKyBcIiBtb2R1bGVzIClcIlxuICAgICAgICBdLCAndGl0bGUyJywgJ3RleHQnKS5yb3RhdGUoLTkwKTtcbiAgICB9XG5cbiAgICB4ID0gcGFnZS5sZWZ0ICsgcGFkZGluZztcbiAgICB5ID0gcGFnZS50b3AgKyBwYWRkaW5nO1xuICAgIHkgKz0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94ICogMS41ICogMy80O1xuXG5cblxuXG5cblxuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZF9ib3JkZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBrID0gcmVxdWlyZSgnLi4vbGliL2svay5qcycpO1xudmFyIGYgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy5qcycpO1xuXG4vL3ZhciBzZXR0aW5ncyA9IHJlcXVpcmUoJy4vc2V0dGluZ3MuanMnKTtcbi8vdmFyIGxfYXR0ciA9IHNldHRpbmdzLmRyYXdpbmcubF9hdHRyO1xuLy92YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbi8vIHNldHVwIGRyYXdpbmcgY29udGFpbmVyc1xuXG52YXIgc2V0dGluZ3MgPSByZXF1aXJlKCcuL3NldHRpbmdzJyk7XG52YXIgbGF5ZXJfYXR0ciA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubGF5ZXJfYXR0cjtcbnZhciBmb250cyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MuZm9udHM7XG5cblxuXG5cblxudmFyIGRyYXdpbmcgPSB7fTtcblxuXG5cblxuXG5cblxuXG5cbi8vIEJMT0NLU1xuXG52YXIgQmxrID0ge1xuICAgIHR5cGU6ICdibG9jaycsXG59O1xuQmxrLm1vdmUgPSBmdW5jdGlvbih4LCB5KXtcbiAgICBmb3IoIHZhciBpIGluIHRoaXMuZHJhd2luZ19wYXJ0cyApe1xuICAgICAgICB0aGlzLmRyYXdpbmdfcGFydHNbaV0ubW92ZSh4LHkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5CbGsuYWRkID0gZnVuY3Rpb24oKXtcbiAgICBpZiggdHlwZW9mIHRoaXMuZHJhd2luZ19wYXJ0cyA9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgIHRoaXMuZHJhd2luZ19wYXJ0cyA9IFtdO1xuICAgIH1cbiAgICBmb3IoIHZhciBpIGluIGFyZ3VtZW50cyl7XG4gICAgICAgIHRoaXMuZHJhd2luZ19wYXJ0cy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbkJsay5yb3RhdGUgPSBmdW5jdGlvbihkZWcpe1xuICAgIHRoaXMucm90YXRlID0gZGVnO1xufTtcblxuXG52YXIgYmxvY2tfYWN0aXZlID0gZmFsc2U7XG4vLyBDcmVhdGUgZGVmYXVsdCBsYXllcixibG9jayBjb250YWluZXIgYW5kIGZ1bmN0aW9uc1xuXG4vLyBMYXllcnNcblxudmFyIGxheWVyX2FjdGl2ZSA9IGZhbHNlO1xuXG5kcmF3aW5nLmxheWVyID0gZnVuY3Rpb24obmFtZSl7IC8vIHNldCBjdXJyZW50IGxheWVyXG4gICAgaWYoIHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJyApeyAvLyBpZiBubyBsYXllciBuYW1lIGdpdmVuLCByZXNldCB0byBkZWZhdWx0XG4gICAgICAgIGxheWVyX2FjdGl2ZSA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoICEgKG5hbWUgaW4gbGF5ZXJfYXR0cikgKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignRXJyb3I6IHVua25vd24gbGF5ZXIgXCInK25hbWUrJ1wiLCB1c2luZyBiYXNlJyk7XG4gICAgICAgIGxheWVyX2FjdGl2ZSA9ICdiYXNlJyA7XG4gICAgfSBlbHNlIHsgLy8gZmluYWx5IGFjdGl2YXRlIHJlcXVlc3RlZCBsYXllclxuICAgICAgICBsYXllcl9hY3RpdmUgPSBuYW1lO1xuICAgIH1cbiAgICAvLyovXG59O1xuXG52YXIgc2VjdGlvbl9hY3RpdmUgPSBmYWxzZTtcblxuZHJhd2luZy5zZWN0aW9uID0gZnVuY3Rpb24obmFtZSl7IC8vIHNldCBjdXJyZW50IHNlY3Rpb25cbiAgICBpZiggdHlwZW9mIG5hbWUgPT09ICd1bmRlZmluZWQnICl7IC8vIGlmIG5vIHNlY3Rpb24gbmFtZSBnaXZlbiwgcmVzZXQgdG8gZGVmYXVsdFxuICAgICAgICBzZWN0aW9uX2FjdGl2ZSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7IC8vIGZpbmFseSBhY3RpdmF0ZSByZXF1ZXN0ZWQgc2VjdGlvblxuICAgICAgICBzZWN0aW9uX2FjdGl2ZSA9IG5hbWU7XG4gICAgfVxuICAgIC8vKi9cbn07XG5cblxuZHJhd2luZy5ibG9ja19zdGFydCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiggdHlwZW9mIG5hbWUgPT09ICd1bmRlZmluZWQnICl7IC8vIGlmIG5hbWUgYXJndW1lbnQgaXMgc3VibWl0dGVkXG4gICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogbmFtZSByZXF1aXJlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBibGs7XG4gICAgICAgIGJsb2NrX2FjdGl2ZSA9IG5hbWU7XG4gICAgICAgIGlmKCBnLmRyYXdpbmcuYmxvY2tzW2Jsb2NrX2FjdGl2ZV0gIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiBibG9jayBhbHJlYWR5IGV4aXN0cycpO1xuICAgICAgICB9XG4gICAgICAgIGJsayA9IE9iamVjdC5jcmVhdGUoQmxrKTtcbiAgICAgICAgZy5kcmF3aW5nLmJsb2Nrc1tibG9ja19hY3RpdmVdID0gYmxrO1xuICAgICAgICByZXR1cm4gYmxrO1xuICAgIH1cbn07XG5cbiAgICAvKlxuICAgIHggPSBsb2Mud2lyZV90YWJsZS54IC0gdy8yO1xuICAgIHkgPSBsb2Mud2lyZV90YWJsZS55IC0gaC8yO1xuICAgIGlmKCB0eXBlb2YgbGF5ZXJfbmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApIHtcbiAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gbGF5ZXJzW2xheWVyX25hbWVdXG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYoICEgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApeyBjb25zb2xlLmxvZyhcImVycm9yLCBsYXllciBkb2VzIG5vdCBleGlzdCwgdXNpbmcgY3VycmVudFwiKTt9XG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9ICBsYXllcl9hY3RpdmVcbiAgICB9XG4gICAgKi9cbmRyYXdpbmcuYmxvY2tfZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJsayA9IGcuZHJhd2luZy5ibG9ja3NbYmxvY2tfYWN0aXZlXTtcbiAgICBibG9ja19hY3RpdmUgPSBmYWxzZTtcbiAgICByZXR1cm4gYmxrO1xufTtcblxuXG5cblxuXG5cbi8vLy8vL1xuLy8gYnVpbGQgcHJvdG90eXBlIGVsZW1lbnRcblxuICAgIC8qXG4gICAgaWYoIHR5cGVvZiBsYXllcl9uYW1lICE9PSAndW5kZWZpbmVkJyAmJiAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICkge1xuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSBsYXllcnNbbGF5ZXJfbmFtZV1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiggISAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICl7IGNvbnNvbGUubG9nKFwiZXJyb3IsIGxheWVyIGRvZXMgbm90IGV4aXN0LCB1c2luZyBjdXJyZW50XCIpO31cbiAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gIGxheWVyX2FjdGl2ZVxuICAgIH1cbiAgICAqL1xuXG5cbnZhciBTdmdFbGVtID0ge1xuICAgIG9iamVjdDogJ1N2Z0VsZW0nXG59O1xuU3ZnRWxlbS5tb3ZlID0gZnVuY3Rpb24oeCwgeSl7XG4gICAgaWYoIHR5cGVvZiB0aGlzLnBvaW50cyAhPSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLnBvaW50cyApIHtcbiAgICAgICAgICAgIHRoaXMucG9pbnRzW2ldWzBdICs9IHg7XG4gICAgICAgICAgICB0aGlzLnBvaW50c1tpXVsxXSArPSB5O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcblN2Z0VsZW0ucm90YXRlID0gZnVuY3Rpb24oZGVnKXtcbiAgICB0aGlzLnJvdGF0ZWQgPSBkZWc7XG59O1xuXG4vLy8vLy8vXG4vLyBmdW5jdGlvbnMgZm9yIGFkZGluZyBkcmF3aW5nX3BhcnRzXG5cbmRyYXdpbmcuYWRkID0gZnVuY3Rpb24odHlwZSwgcG9pbnRzLCBsYXllcl9uYW1lLCBhdHRycykge1xuICAgIGlmKCBwb2ludHNbMF0gPT09IHVuZGVmaW5lZCApIGNvbnNvbGUud2FybihcInBvaW50cyBub3QgZGVmZmluZWRcIiwgdHlwZSwgcG9pbnRzLCBsYXllcl9uYW1lICk7XG5cbiAgICBpZiggdHlwZW9mIGxheWVyX25hbWUgPT09ICd1bmRlZmluZWQnICkgeyBsYXllcl9uYW1lID0gbGF5ZXJfYWN0aXZlOyB9XG4gICAgaWYoICEgKGxheWVyX25hbWUgaW4gbGF5ZXJfYXR0cikgKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignRXJyb3I6IExheWVyIFwiJysgbGF5ZXJfbmFtZSArJ1wiIG5hbWUgbm90IGZvdW5kLCB1c2luZyBiYXNlJyk7XG4gICAgICAgIGxheWVyX25hbWUgPSAnYmFzZSc7XG4gICAgfVxuXG4gICAgaWYoIHR5cGVvZiBwb2ludHMgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFyIHBvaW50c19hID0gcG9pbnRzLnNwbGl0KCcgJyk7XG4gICAgICAgIGZvciggdmFyIGkgaW4gcG9pbnRzX2EgKSB7XG4gICAgICAgICAgICBwb2ludHNfYVtpXSA9IHBvaW50c19hW2ldLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICBmb3IoIHZhciBjIGluIHBvaW50c19hW2ldICkge1xuICAgICAgICAgICAgICAgIHBvaW50c19hW2ldW2NdID0gTnVtYmVyKHBvaW50c19hW2ldW2NdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBlbGVtID0gT2JqZWN0LmNyZWF0ZShTdmdFbGVtKTtcbiAgICBlbGVtLnR5cGUgPSB0eXBlO1xuICAgIGVsZW0ubGF5ZXJfbmFtZSA9IGxheWVyX25hbWU7XG4gICAgZWxlbS5zZWN0aW9uX25hbWUgPSBzZWN0aW9uX2FjdGl2ZTtcbiAgICBpZiggYXR0cnMgIT09IHVuZGVmaW5lZCApIGVsZW0uYXR0cnMgPSBhdHRycztcbiAgICBpZiggdHlwZSA9PT0gJ2xpbmUnICkge1xuICAgICAgICBlbGVtLnBvaW50cyA9IHBvaW50cztcbiAgICB9IGVsc2UgaWYoIHR5cGUgPT09ICdwb2x5JyApIHtcbiAgICAgICAgZWxlbS5wb2ludHMgPSBwb2ludHM7XG4gICAgfSBlbHNlIGlmKCB0eXBlb2YgcG9pbnRzWzBdLnggPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGVsZW0ueCA9IHBvaW50c1swXVswXTtcbiAgICAgICAgZWxlbS55ID0gcG9pbnRzWzBdWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW0ueCA9IHBvaW50c1swXS54O1xuICAgICAgICBlbGVtLnkgPSBwb2ludHNbMF0ueTtcbiAgICB9XG5cbiAgICBpZihibG9ja19hY3RpdmUpIHtcbiAgICAgICAgZWxlbS5ibG9ja19uYW1lID0gYmxvY2tfYWN0aXZlO1xuICAgICAgICBnLmRyYXdpbmcuYmxvY2tzW2Jsb2NrX2FjdGl2ZV0uYWRkKGVsZW0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZHJhd2luZ19wYXJ0cy5wdXNoKGVsZW0pO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtO1xufTtcblxuZHJhd2luZy5saW5lID0gZnVuY3Rpb24ocG9pbnRzLCBsYXllciwgYXR0cnMpeyAvLyAocG9pbnRzLCBbbGF5ZXJdKVxuICAgIC8vcmV0dXJuIGFkZCgnbGluZScsIHBvaW50cywgbGF5ZXIpXG4gICAgdmFyIGxpbmUgPSAgdGhpcy5hZGQoJ2xpbmUnLCBwb2ludHMsIGxheWVyLCBhdHRycyk7XG4gICAgcmV0dXJuIGxpbmU7XG59O1xuXG5kcmF3aW5nLnBvbHkgPSBmdW5jdGlvbihwb2ludHMsIGxheWVyLCBhdHRycyl7IC8vIChwb2ludHMsIFtsYXllcl0pXG4gICAgLy9yZXR1cm4gYWRkKCdwb2x5JywgcG9pbnRzLCBsYXllcilcbiAgICB2YXIgcG9seSA9ICB0aGlzLmFkZCgncG9seScsIHBvaW50cywgbGF5ZXIsIGF0dHJzKTtcbiAgICByZXR1cm4gcG9seTtcbn07XG5cbmRyYXdpbmcucmVjdCA9IGZ1bmN0aW9uKGxvYywgc2l6ZSwgbGF5ZXIsIGF0dHJzKXtcbiAgICB2YXIgcmVjID0gdGhpcy5hZGQoJ3JlY3QnLCBbbG9jXSwgbGF5ZXIsIGF0dHJzKTtcbiAgICByZWMudyA9IHNpemVbMF07XG4gICAgLypcbiAgICBpZiggdHlwZW9mIGxheWVyX25hbWUgIT09ICd1bmRlZmluZWQnICYmIChsYXllcl9uYW1lIGluIGxheWVycykgKSB7XG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9IGxheWVyc1tsYXllcl9uYW1lXVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCAhIChsYXllcl9uYW1lIGluIGxheWVycykgKXsgY29uc29sZS5sb2coXCJlcnJvciwgbGF5ZXIgZG9lcyBub3QgZXhpc3QsIHVzaW5nIGN1cnJlbnRcIik7fVxuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSAgbGF5ZXJfYWN0aXZlXG4gICAgfVxuICAgICovXG4gICAgcmVjLmggPSBzaXplWzFdO1xuICAgIHJldHVybiByZWM7XG59O1xuXG5kcmF3aW5nLmNpcmMgPSBmdW5jdGlvbihsb2MsIGRpYW1ldGVyLCBsYXllciwgYXR0cnMpe1xuICAgIHZhciBjaXIgPSB0aGlzLmFkZCgnY2lyYycsIFtsb2NdLCBsYXllciwgYXR0cnMpO1xuICAgIGNpci5kID0gZGlhbWV0ZXI7XG4gICAgcmV0dXJuIGNpcjtcbn07XG5cbmRyYXdpbmcudGV4dCA9IGZ1bmN0aW9uKGxvYywgc3RyaW5ncywgZm9udCwgbGF5ZXIsIGF0dHJzKXtcbiAgICB2YXIgdHh0ID0gdGhpcy5hZGQoJ3RleHQnLCBbbG9jXSwgbGF5ZXIsIGF0dHJzKTtcbiAgICBpZiggdHlwZW9mIHN0cmluZ3MgPT0gJ3N0cmluZycpe1xuICAgICAgICBzdHJpbmdzID0gW3N0cmluZ3NdO1xuICAgIH1cbiAgICB0eHQuc3RyaW5ncyA9IHN0cmluZ3M7XG4gICAgdHh0LmZvbnQgPSBmb250O1xuICAgIHJldHVybiB0eHQ7XG59O1xuXG5kcmF3aW5nLmJsb2NrID0gZnVuY3Rpb24obmFtZSkgey8vIHNldCBjdXJyZW50IGJsb2NrXG4gICAgdmFyIHgseTtcbiAgICBpZiggYXJndW1lbnRzLmxlbmd0aCA9PT0gMiApeyAvLyBpZiBjb29yIGlzIHBhc3NlZFxuICAgICAgICBpZiggdHlwZW9mIGFyZ3VtZW50c1sxXS54ICE9PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgeCA9IGFyZ3VtZW50c1sxXS54O1xuICAgICAgICAgICAgeSA9IGFyZ3VtZW50c1sxXS55O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeCA9IGFyZ3VtZW50c1sxXVswXTtcbiAgICAgICAgICAgIHkgPSBhcmd1bWVudHNbMV1bMV07XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYoIGFyZ3VtZW50cy5sZW5ndGggPT09IDMgKXsgLy8gaWYgeCx5IGlzIHBhc3NlZFxuICAgICAgICB4ID0gYXJndW1lbnRzWzFdO1xuICAgICAgICB5ID0gYXJndW1lbnRzWzJdO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHdoYXQgaWYgYmxvY2sgZG9lcyBub3QgZXhpc3Q/IHByaW50IGxpc3Qgb2YgYmxvY2tzP1xuICAgIHZhciBibGsgPSBPYmplY3QuY3JlYXRlKGcuZHJhd2luZy5ibG9ja3NbbmFtZV0pO1xuICAgIGJsay54ID0geDtcbiAgICBibGsueSA9IHk7XG5cbiAgICBpZihibG9ja19hY3RpdmUpe1xuICAgICAgICBnLmRyYXdpbmcuYmxvY2tzW2Jsb2NrX2FjdGl2ZV0uYWRkKGJsayk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kcmF3aW5nX3BhcnRzLnB1c2goYmxrKTtcbiAgICB9XG4gICAgcmV0dXJuIGJsaztcbn07XG5cblxuXG5cblxuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vXG4vLyBUYWJsZXNcblxudmFyIENlbGwgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24odGFibGUsIFIsIEMpe1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMudGFibGUgPSB0YWJsZTtcbiAgICAgICAgdGhpcy5SID0gUjtcbiAgICAgICAgdGhpcy5DID0gQztcbiAgICAgICAgLypcbiAgICAgICAgdGhpcy5ib3JkZXJzID0ge307XG4gICAgICAgIHRoaXMuYm9yZGVyX29wdGlvbnMuZm9yRWFjaChmdW5jdGlvbihzaWRlKXtcbiAgICAgICAgICAgIHNlbGYuYm9yZGVyc1tzaWRlXSA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8qL1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIC8qXG4gICAgYm9yZGVyX29wdGlvbnM6IFsnVCcsICdCJywgJ0wnLCAnUiddLFxuICAgIC8vKi9cbiAgICB0ZXh0OiBmdW5jdGlvbih0ZXh0KXtcbiAgICAgICAgdGhpcy5jZWxsX3RleHQgPSB0ZXh0O1xuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH0sXG4gICAgZm9udDogZnVuY3Rpb24oZm9udF9uYW1lKXtcbiAgICAgICAgdGhpcy5jZWxsX2ZvbnRfbmFtZSA9IGZvbnRfbmFtZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGJvcmRlcjogZnVuY3Rpb24oYm9yZGVyX3N0cmluZywgc3RhdGUpe1xuICAgICAgICB0aGlzLnRhYmxlLmJvcmRlciggdGhpcy5SLCB0aGlzLkMsIGJvcmRlcl9zdHJpbmcsIHN0YXRlICk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn07XG5cbnZhciBUYWJsZSA9IHtcbiAgICBpbml0OiBmdW5jdGlvbiggZHJhd2luZywgbnVtX3Jvd3MsIG51bV9jb2xzICl7XG4gICAgICAgIHRoaXMuZHJhd2luZyA9IGRyYXdpbmc7XG4gICAgICAgIHRoaXMubnVtX3Jvd3MgPSBudW1fcm93cztcbiAgICAgICAgdGhpcy5udW1fY29scyA9IG51bV9jb2xzO1xuICAgICAgICB2YXIgcixjO1xuXG4gICAgICAgIC8vIHNldHVwIGJvcmRlciBjb250YWluZXJzXG4gICAgICAgIHRoaXMuYm9yZGVyc19yb3dzID0gW107XG4gICAgICAgIGZvciggcj0wOyByPD1udW1fcm93czsgcisrKXtcbiAgICAgICAgICAgIHRoaXMuYm9yZGVyc19yb3dzW3JdID0gW107XG4gICAgICAgICAgICBmb3IoIGM9MTsgYzw9bnVtX2NvbHM7IGMrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5ib3JkZXJzX3Jvd3Nbcl1bY10gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJvcmRlcnNfY29scyA9IFtdO1xuICAgICAgICBmb3IoIGM9MDsgYzw9bnVtX2NvbHM7IGMrKyl7XG4gICAgICAgICAgICB0aGlzLmJvcmRlcnNfY29sc1tjXSA9IFtdO1xuICAgICAgICAgICAgZm9yKCByPTE7IHI8PW51bV9yb3dzOyByKyspe1xuICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyc19jb2xzW2NdW3JdID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzZXQgY29sdW1uIGFuZCByb3cgc2l6ZSBjb250YWluZXJzXG4gICAgICAgIHRoaXMucm93X3NpemVzID0gW107XG4gICAgICAgIGZvciggcj0xOyByPD1udW1fcm93czsgcisrKXtcbiAgICAgICAgICAgIHRoaXMucm93X3NpemVzW3JdID0gMTU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb2xfc2l6ZXMgPSBbXTtcbiAgICAgICAgZm9yKCBjPTE7IGM8PW51bV9jb2xzOyBjKyspe1xuICAgICAgICAgICAgdGhpcy5jb2xfc2l6ZXNbY10gPSA2MDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNldHVwIGNlbGwgY29udGFpbmVyXG4gICAgICAgIHRoaXMuY2VsbHMgPSBbXTtcbiAgICAgICAgZm9yKCByPTE7IHI8PW51bV9yb3dzOyByKyspe1xuICAgICAgICAgICAgdGhpcy5jZWxsc1tyXSA9IFtdO1xuICAgICAgICAgICAgZm9yKCBjPTE7IGM8PW51bV9jb2xzOyBjKyspe1xuICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbcl1bY10gPSBPYmplY3QuY3JlYXRlKENlbGwpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbcl1bY10uaW5pdCggdGhpcywgciwgYyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICAvLyovXG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBsb2M6IGZ1bmN0aW9uKCB4LCB5KXtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjZWxsOiBmdW5jdGlvbiggUiwgQyApe1xuICAgICAgICByZXR1cm4gdGhpcy5jZWxsc1tSXVtDXTtcbiAgICB9LFxuICAgIGFsbF9jZWxsczogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGNlbGxfYXJyYXkgPSBbXTtcbiAgICAgICAgdGhpcy5jZWxscy5mb3JFYWNoKGZ1bmN0aW9uKHJvdyl7XG4gICAgICAgICAgICByb3cuZm9yRWFjaChmdW5jdGlvbihjZWxsKXtcbiAgICAgICAgICAgICAgICBjZWxsX2FycmF5LnB1c2goY2VsbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjZWxsX2FycmF5O1xuICAgIH0sXG4gICAgY29sX3NpemU6IGZ1bmN0aW9uKGNvbCwgc2l6ZSl7XG4gICAgICAgIGlmKCB0eXBlb2YgY29sID09PSAnc3RyaW5nJyApe1xuICAgICAgICAgICAgaWYoIGNvbCA9PT0gJ2FsbCcpe1xuICAgICAgICAgICAgICAgIF8ucmFuZ2UodGhpcy5udW1fY29scykuZm9yRWFjaChmdW5jdGlvbihjKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xfc2l6ZXNbYysxXSA9IHNpemU7XG4gICAgICAgICAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2l6ZSA9IE51bWJlcihzaXplKTtcbiAgICAgICAgICAgICAgICBpZiggaXNOYU4oc2l6ZSkgKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiBjb2x1bW4gd3JvbmcnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbF9zaXplc1tjb2xdID0gc2l6ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7IC8vIGlzIG51bWJlclxuICAgICAgICAgICAgdGhpcy5jb2xfc2l6ZXNbY29sXSA9IHNpemU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICAvLyovXG4gICAgcm93X3NpemU6IGZ1bmN0aW9uKHJvdywgc2l6ZSl7XG4gICAgICAgIGlmKCB0eXBlb2Ygcm93ID09PSAnc3RyaW5nJyApe1xuICAgICAgICAgICAgaWYoIHJvdyA9PT0gJ2FsbCcpe1xuICAgICAgICAgICAgICAgIF8ucmFuZ2UodGhpcy5udW1fcm93cykuZm9yRWFjaChmdW5jdGlvbihyKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3dfc2l6ZXNbcisxXSA9IHNpemU7XG4gICAgICAgICAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2l6ZSA9IE51bWJlcihzaXplKTtcbiAgICAgICAgICAgICAgICBpZiggaXNOYU4oc2l6ZSkgKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiBjb2x1bW4gd3JvbmcnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJvd19zaXplc1tyb3ddID0gc2l6ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7IC8vIGlzIG51bWJlclxuICAgICAgICAgICAgdGhpcy5yb3dfc2l6ZXNbcm93XSA9IHNpemU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICAvLyovXG5cbiAgICAvKlxuICAgIGFkZF9jZWxsOiBmdW5jdGlvbigpe1xuXG4gICAgfSxcbiAgICBhZGRfcm93czogZnVuY3Rpb24obil7XG4gICAgICAgIHRoaXMubnVtX2NvbG1ucyArPSBuO1xuICAgICAgICB0aGlzLm51bV9yb3dzICs9IG47XG4gICAgICAgIF8ucmFuZ2UobikuZm9yRWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5yb3dzLnB1c2goW10pO1xuICAgICAgICB9KTtcbiAgICAgICAgXy5yYW5nZShuKS5mb3JFYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLnRleHRfcm93cy5wdXNoKFtdKTtcbiAgICAgICAgfSk7XG5cbiAgICB9LFxuICAgIHRleHQ6IGZ1bmN0aW9uKCBSLCBDLCB0ZXh0KXtcbiAgICAgICAgdGhpcy50ZXh0X3Jvd3NbUl1bQ10gPSB0ZXh0O1xuICAgIH0sXG4gICAgLy8qL1xuICAgIGJvcmRlcjogZnVuY3Rpb24oIFIsIEMsIGJvcmRlcl9zdHJpbmcsIHN0YXRlKXtcbiAgICAgICAgaWYoIHN0YXRlID09PSB1bmRlZmluZWQgKSBzdGF0ZSA9IHRydWU7XG5cbiAgICAgICAgYm9yZGVyX3N0cmluZyA9IGJvcmRlcl9zdHJpbmcudG9VcHBlckNhc2UoKS50cmltKCk7XG4gICAgICAgIHZhciBib3JkZXJzO1xuICAgICAgICBpZiggYm9yZGVyX3N0cmluZyA9PT0gJ0FMTCcgKXtcbiAgICAgICAgICAgIGJvcmRlcnMgPSBbJ1QnLCAnQicsICdMJywgJ1InXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJvcmRlcnMgPSBib3JkZXJfc3RyaW5nLnNwbGl0KC9bXFxzLF0rLyk7XG4gICAgICAgIH1cbiAgICAgICAgYm9yZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHNpZGUpe1xuICAgICAgICAgICAgc3dpdGNoKHNpZGUpe1xuICAgICAgICAgICAgICAgIGNhc2UgJ1QnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfcm93c1tSLTFdW0NdID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0InOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfcm93c1tSXVtDXSA9IHN0YXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdMJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3JkZXJzX2NvbHNbQy0xXVtSXSA9IHN0YXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdSJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3JkZXJzX2NvbHNbQ11bUl0gPSBzdGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNvcm5lcjogZnVuY3Rpb24oUixDKXtcbiAgICAgICAgdmFyIHggPSB0aGlzLng7XG4gICAgICAgIHZhciB5ID0gdGhpcy55O1xuICAgICAgICB2YXIgcixjO1xuICAgICAgICBmb3IoIHI9MTsgcjw9UjsgcisrICl7XG4gICAgICAgICAgICB5ICs9IHRoaXMucm93X3NpemVzW3JdO1xuICAgICAgICB9XG4gICAgICAgIGZvciggYz0xOyBjPD1DOyBjKysgKXtcbiAgICAgICAgICAgIHggKz0gdGhpcy5jb2xfc2l6ZXNbY107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFt4LHldO1xuICAgIH0sXG4gICAgY2VudGVyOiBmdW5jdGlvbihSLEMpe1xuICAgICAgICB2YXIgeCA9IHRoaXMueDtcbiAgICAgICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgICAgIHZhciByLGM7XG4gICAgICAgIGZvciggcj0xOyByPD1SOyByKysgKXtcbiAgICAgICAgICAgIHkgKz0gdGhpcy5yb3dfc2l6ZXNbcl07XG4gICAgICAgIH1cbiAgICAgICAgZm9yKCBjPTE7IGM8PUM7IGMrKyApe1xuICAgICAgICAgICAgeCArPSB0aGlzLmNvbF9zaXplc1tjXTtcbiAgICAgICAgfVxuICAgICAgICB5IC09IHRoaXMucm93X3NpemVzW1JdLzI7XG4gICAgICAgIHggLT0gdGhpcy5jb2xfc2l6ZXNbQ10vMjtcbiAgICAgICAgcmV0dXJuIFt4LHldO1xuICAgIH0sXG4gICAgbGVmdDogZnVuY3Rpb24oUixDKXtcbiAgICAgICAgdmFyIGNvb3IgPSB0aGlzLmNlbnRlcihSLEMpO1xuICAgICAgICBjb29yWzBdID0gY29vclswXSAtIHRoaXMuY29sX3NpemVzW0NdLzIgKyB0aGlzLnJvd19zaXplc1tSXS8yO1xuICAgICAgICByZXR1cm4gY29vcjtcbiAgICB9LFxuICAgIHJpZ2h0OiBmdW5jdGlvbihSLEMpe1xuICAgICAgICB2YXIgY29vciA9IHRoaXMuY2VudGVyKFIsQyk7XG4gICAgICAgIGNvb3JbMF0gPSBjb29yWzBdICsgdGhpcy5jb2xfc2l6ZXNbQ10vMiAtIHRoaXMucm93X3NpemVzW1JdLzI7XG4gICAgICAgIHJldHVybiBjb29yO1xuICAgIH0sXG4gICAgbWs6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHIsYztcbiAgICAgICAgZm9yKCByPTA7IHI8PXRoaXMubnVtX3Jvd3M7IHIrKyApe1xuICAgICAgICAgICAgZm9yKCBjPTE7IGM8PXRoaXMubnVtX2NvbHM7IGMrKyApe1xuICAgICAgICAgICAgICAgIGlmKCB0aGlzLmJvcmRlcnNfcm93c1tyXVtjXSA9PT0gdHJ1ZSApe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdpbmcubGluZShbXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcm5lcihyLGMtMSksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcm5lcihyLGMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSwgJ2JvcmRlcicpO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciggYz0wOyBjPD10aGlzLm51bV9jb2xzOyBjKysgKXtcbiAgICAgICAgICAgIGZvciggcj0xOyByPD10aGlzLm51bV9yb3dzOyByKysgKXtcbiAgICAgICAgICAgICAgICBpZiggdGhpcy5ib3JkZXJzX2NvbHNbY11bcl0gPT09IHRydWUgKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3aW5nLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JuZXIoci0xLGMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JuZXIocixjKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sICdib3JkZXInKTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IoIHI9MTsgcjw9dGhpcy5udW1fcm93czsgcisrICl7XG4gICAgICAgICAgICBmb3IoIGM9MTsgYzw9dGhpcy5udW1fY29sczsgYysrICl7XG4gICAgICAgICAgICAgICAgaWYoIHR5cGVvZiB0aGlzLmNlbGwocixjKS5jZWxsX3RleHQgPT09ICdzdHJpbmcnICl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjZWxsID0gdGhpcy5jZWxsKHIsYyk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmb250X25hbWUgPSBjZWxsLmNlbGxfZm9udF9uYW1lIHx8ICd0YWJsZSc7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb29yO1xuICAgICAgICAgICAgICAgICAgICBpZiggZy5kcmF3aW5nX3NldHRpbmdzLmZvbnRzW2ZvbnRfbmFtZV1bJ3RleHQtYW5jaG9yJ10gPT09ICdjZW50ZXInKSBjb29yID0gdGhpcy5jZW50ZXIocixjKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiggZy5kcmF3aW5nX3NldHRpbmdzLmZvbnRzW2ZvbnRfbmFtZV1bJ3RleHQtYW5jaG9yJ10gPT09ICdyaWdodCcpIGNvb3IgPSB0aGlzLnJpZ2h0KHIsYyk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoIGcuZHJhd2luZ19zZXR0aW5ncy5mb250c1tmb250X25hbWVdWyd0ZXh0LWFuY2hvciddID09PSAnbGVmdCcpIGNvb3IgPSB0aGlzLmxlZnQocixjKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBjb29yID0gdGhpcy5jZW50ZXIocixjKTtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdpbmcudGV4dChcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNlbGwocixjKS5jZWxsX3RleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250X25hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAndGV4dCdcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxufTtcblxuZHJhd2luZy50YWJsZSA9IGZ1bmN0aW9uKCBudW1fcm93cywgbnVtX2NvbHMgKXtcbiAgICB2YXIgbmV3X3RhYmxlID0gT2JqZWN0LmNyZWF0ZShUYWJsZSk7XG4gICAgbmV3X3RhYmxlLmluaXQoIHRoaXMsIG51bV9yb3dzLCBudW1fY29scyApO1xuXG4gICAgcmV0dXJuIG5ld190YWJsZTtcblxufTtcblxuXG5kcmF3aW5nLmFwcGVuZCA9ICBmdW5jdGlvbihkcmF3aW5nX3BhcnRzKXtcbiAgICB0aGlzLmRyYXdpbmdfcGFydHMgPSB0aGlzLmRyYXdpbmdfcGFydHMuY29uY2F0KGRyYXdpbmdfcGFydHMpO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuXG5cbnZhciBta19kcmF3aW5nID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgcGFnZSA9IE9iamVjdC5jcmVhdGUoZHJhd2luZyk7XG4gICAgLy9jb25zb2xlLmxvZyhwYWdlKTtcbiAgICBwYWdlLmRyYXdpbmdfcGFydHMgPSBbXTtcbiAgICByZXR1cm4gcGFnZTtcbn07XG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IG1rX2RyYXdpbmc7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xudmFyIG1rX2JvcmRlciA9IHJlcXVpcmUoJy4vbWtfYm9yZGVyJyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHBhZ2UgMVwiKTtcblxuICAgIHZhciBkID0gbWtfZHJhd2luZygpO1xuXG4gICAgdmFyIHNoZWV0X3NlY3Rpb24gPSAnQSc7XG4gICAgdmFyIHNoZWV0X251bSA9ICcwMCc7XG4gICAgZC5hcHBlbmQobWtfYm9yZGVyKHNldHRpbmdzLCBzaGVldF9zZWN0aW9uLCBzaGVldF9udW0gKSk7XG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG5cbiAgICB2YXIgeCwgeSwgaCwgdztcblxuICAgIGQudGV4dChcbiAgICAgICAgW3NpemUuZHJhd2luZy53KjEvMiwgc2l6ZS5kcmF3aW5nLmgqMS8zXSxcbiAgICAgICAgW1xuICAgICAgICAgICAgJ0ZTRUMgUGxhbnMgTWFjaGluZScsXG4gICAgICAgICAgICAnREVNTydcbiAgICAgICAgXSxcbiAgICAgICAgJ3Byb2plY3QgdGl0bGUnXG4gICAgKTtcblxuICAgIHZhciBuX3Jvd3MgPSA0O1xuICAgIHZhciBuX2NvbHMgPSAyO1xuICAgIHcgPSA0MDArODA7XG4gICAgaCA9IG5fcm93cyoyMDtcbiAgICB4ID0gc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmcqNjtcbiAgICB5ID0gc2l6ZS5kcmF3aW5nLmggLSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyo2IC0gNCoyMDtcblxuICAgIGQudGV4dCggW3grdy8yLCB5LTIwXSwgJ0NvbnRlbnRzJywndGFibGVfbGFyZ2UnICk7XG5cbiAgICB2YXIgdCA9IGQudGFibGUobl9yb3dzLG5fY29scykubG9jKHgseSk7XG4gICAgdC5yb3dfc2l6ZSgnYWxsJywgMjApLmNvbF9zaXplKDIsIDQwMCkuY29sX3NpemUoMSwgODApO1xuICAgIHQuY2VsbCgxLDEpLnRleHQoJ1BWLTAxJyk7XG4gICAgdC5jZWxsKDEsMikudGV4dCgnUFYgc3lzdGVtIHdpcmluZyBkaWFncmFtJyk7XG4gICAgdC5jZWxsKDIsMSkudGV4dCgnUFYtMDInKTtcbiAgICB0LmNlbGwoMiwyKS50ZXh0KCdQViBzeXN0ZW0gc3BlY2lmaWNhdGlvbnMnKTtcbiAgICB0LmNlbGwoMywxKS50ZXh0KCdTLTAxJyk7XG4gICAgdC5jZWxsKDMsMikudGV4dCgnUm9vZiBkZXRhaWxzJyk7XG5cbiAgICB0LmFsbF9jZWxscygpLmZvckVhY2goZnVuY3Rpb24oY2VsbCl7XG4gICAgICAgIGNlbGwuZm9udCgndGFibGVfbGFyZ2VfbGVmdCcpLmJvcmRlcignYWxsJyk7XG4gICAgfSk7XG5cbiAgICB0Lm1rKCk7XG5cbiAgICAvKlxuICAgIGNvbnNvbGUubG9nKHRhYmxlX3BhcnRzKTtcbiAgICBkLmFwcGVuZCh0YWJsZV9wYXJ0cyk7XG4gICAgZC50ZXh0KFtzaXplLmRyYXdpbmcudy8zLHNpemUuZHJhd2luZy5oLzNdLCAnWCcsICd0YWJsZScpO1xuICAgIGQucmVjdChbc2l6ZS5kcmF3aW5nLncvMy01LHNpemUuZHJhd2luZy5oLzMtNV0sWzEwLDEwXSwnYm94Jyk7XG5cbiAgICB0LmNlbGwoMiwyKS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgMiwyJyk7XG4gICAgdC5jZWxsKDMsMykuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDMsMycpO1xuICAgIHQuY2VsbCg0LDQpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCA0LDQnKTtcbiAgICB0LmNlbGwoNSw1KS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgNSw1Jyk7XG5cblxuXG4gICAgdC5jZWxsKDQsNikuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDQsNicpO1xuICAgIHQuY2VsbCg0LDcpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCA0LDcnKTtcbiAgICB0LmNlbGwoNSw2KS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgNSw2Jyk7XG4gICAgdC5jZWxsKDUsNykuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDUsNycpO1xuXG5cbiAgICAvLyovXG5cbiAgICByZXR1cm4gZC5kcmF3aW5nX3BhcnRzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcGFnZTtcbiIsInZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG52YXIgbWtfYm9yZGVyID0gcmVxdWlyZSgnLi9ta19ib3JkZXInKTtcblxuLy92YXIgZHJhd2luZ19wYXJ0cyA9IFtdO1xuLy9kLmxpbmtfZHJhd2luZ19wYXJ0cyhkcmF3aW5nX3BhcnRzKTtcblxudmFyIHBhZ2UgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgY29uc29sZS5sb2coXCIqKiBNYWtpbmcgcGFnZSAyXCIpO1xuICAgIGQgPSBta19kcmF3aW5nKCk7XG4gICAgdmFyIHNoZWV0X3NlY3Rpb24gPSAnUFYnO1xuICAgIHZhciBzaGVldF9udW0gPSAnMDEnO1xuICAgIGQuYXBwZW5kKG1rX2JvcmRlcihzZXR0aW5ncywgc2hlZXRfc2VjdGlvbiwgc2hlZXRfbnVtICkpO1xuXG4gICAgdmFyIGYgPSBzZXR0aW5ncy5mO1xuXG4gICAgLy92YXIgY29tcG9uZW50cyA9IHNldHRpbmdzLmNvbXBvbmVudHM7XG4gICAgLy92YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG5cblxuXG5cbiAgICB2YXIgeCwgeSwgaCwgdztcbiAgICB2YXIgb2Zmc2V0O1xuXG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8jYXJyYXlcbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ21vZHVsZScpICYmIGYuc2VjdGlvbl9kZWZpbmVkKCdhcnJheScpICl7XG4gICAgICAgIGQuc2VjdGlvbignYXJyYXknKTtcblxuXG4gICAgICAgIHggPSBsb2MuYXJyYXkucmlnaHQgLSBzaXplLnN0cmluZy53O1xuICAgICAgICB5ID0gbG9jLmFycmF5LnVwcGVyO1xuICAgICAgICAvL3kgLT0gc2l6ZS5zdHJpbmcuaC8yO1xuXG5cbiAgICAgICAgLy9mb3IoIHZhciBpPTA7IGk8c3lzdGVtLkRDLnN0cmluZ19udW07IGkrKyApIHtcbiAgICAgICAgZm9yKCB2YXIgaSBpbiBfLnJhbmdlKHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncykpIHtcbiAgICAgICAgICAgIC8vdmFyIG9mZnNldCA9IGkgKiBzaXplLndpcmVfb2Zmc2V0LmJhc2VcbiAgICAgICAgICAgIHZhciBvZmZzZXRfd2lyZSA9IHNpemUud2lyZV9vZmZzZXQubWluICsgKCBzaXplLndpcmVfb2Zmc2V0LmJhc2UgKiBpICk7XG5cbiAgICAgICAgICAgIGQuYmxvY2soJ3N0cmluZycsIFt4LHldKTtcbiAgICAgICAgICAgIC8vIHBvc2l0aXZlIGhvbWUgcnVuXG4gICAgICAgICAgICBkLmxheWVyKCdEQ19wb3MnKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4ICwgbG9jLmFycmF5LnVwcGVyIF0sXG4gICAgICAgICAgICAgICAgWyB4ICwgbG9jLmFycmF5LnVwcGVyLW9mZnNldF93aXJlIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrb2Zmc2V0X3dpcmUgLCBsb2MuYXJyYXkudXBwZXItb2Zmc2V0X3dpcmUgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtvZmZzZXRfd2lyZSAsIGxvYy5qYl9ib3gueS1vZmZzZXRfd2lyZV0sXG4gICAgICAgICAgICAgICAgWyBsb2MuamJfYm94LnggLCBsb2MuamJfYm94Lnktb2Zmc2V0X3dpcmVdLFxuICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIC8vIG5lZ2F0aXZlIGhvbWUgcnVuXG4gICAgICAgICAgICBkLmxheWVyKCdEQ19uZWcnKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4ICwgbG9jLmFycmF5Lmxvd2VyIF0sXG4gICAgICAgICAgICAgICAgWyB4ICwgbG9jLmFycmF5Lmxvd2VyX2xpbWl0K29mZnNldF93aXJlIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrb2Zmc2V0X3dpcmUgLCBsb2MuYXJyYXkubG93ZXJfbGltaXQrb2Zmc2V0X3dpcmUgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtvZmZzZXRfd2lyZSAsIGxvYy5qYl9ib3gueStvZmZzZXRfd2lyZV0sXG4gICAgICAgICAgICAgICAgWyBsb2MuamJfYm94LnggLCBsb2MuamJfYm94Lnkrb2Zmc2V0X3dpcmVdLFxuICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIHggLT0gc2l6ZS5zdHJpbmcudztcbiAgICAgICAgfVxuXG4gICAgLy8gICAgZC5yZWN0KFxuICAgIC8vICAgICAgICBbIChsb2MuYXJyYXkucmlnaHQrbG9jLmFycmF5LmxlZnQpLzIsIChsb2MuYXJyYXkubG93ZXIrbG9jLmFycmF5LnVwcGVyKS8yIF0sXG4gICAgLy8gICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0LWxvYy5hcnJheS5sZWZ0LCBsb2MuYXJyYXkubG93ZXItbG9jLmFycmF5LnVwcGVyIF0sXG4gICAgLy8gICAgICAgICdEQ19wb3MnKTtcbiAgICAvL1xuXG4gICAgICAgIGQubGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgLy9bIGxvYy5hcnJheS5sZWZ0ICwgbG9jLmFycmF5Lmxvd2VyICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgICAgIFsgbG9jLmFycmF5LmxlZnQsIGxvYy5hcnJheS5sb3dlcl9saW1pdCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCAsIGxvYy5hcnJheS5sb3dlcl9saW1pdCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCAsIGxvYy5qYl9ib3gueSArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAgICAgICAgIFsgbG9jLmpiX2JveC54ICwgbG9jLmpiX2JveC55K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAgICAgXSk7XG5cbiAgICAgICAgZC5sYXllcigpO1xuXG5cbiAgICB9Ly8gZWxzZSB7IGNvbnNvbGUubG9nKFwiRHJhd2luZzogYXJyYXkgbm90IHJlYWR5XCIpfVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBjb21iaW5lciBib3hcblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnREMnKSApe1xuXG4gICAgICAgIGQuc2VjdGlvbihcImNvbWJpbmVyXCIpO1xuXG4gICAgICAgIHggPSBsb2MuamJfYm94Lng7XG4gICAgICAgIHkgPSBsb2MuamJfYm94Lnk7XG5cbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW3gseV0sXG4gICAgICAgICAgICBbc2l6ZS5qYl9ib3gudyxzaXplLmpiX2JveC5oXSxcbiAgICAgICAgICAgICdib3gnXG4gICAgICAgICk7XG5cblxuICAgICAgICBmb3IoIGkgaW4gXy5yYW5nZShzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MpKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0Lm1pbiArICggc2l6ZS53aXJlX29mZnNldC5iYXNlICogaSApO1xuXG4gICAgICAgICAgICBkLmxheWVyKCdEQ19wb3MnKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4ICwgeS1vZmZzZXRdLFxuICAgICAgICAgICAgICAgIFsgeCAsIHktb2Zmc2V0XSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICAgICAgeTogeS1vZmZzZXQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4ICwgeS1vZmZzZXRdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueC1vZmZzZXQgLCB5LW9mZnNldF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54LW9mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW1dLFxuICAgICAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueC1vZmZzZXQgLCBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgICAgIHg6IGxvYy5kaXNjYm94Lngtb2Zmc2V0LFxuICAgICAgICAgICAgICAgIHk6IGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkLmxheWVyKCdEQ19uZWcnKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4LCB5K29mZnNldF0sXG4gICAgICAgICAgICAgICAgWyB4LXNpemUuZnVzZS53LzIgLCB5K29mZnNldF0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIGQuYmxvY2soICdmdXNlJywge1xuICAgICAgICAgICAgICAgIHg6IHggLFxuICAgICAgICAgICAgICAgIHk6IHkrb2Zmc2V0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCtzaXplLmZ1c2Uudy8yICwgeStvZmZzZXRdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueCtvZmZzZXQgLCB5K29mZnNldF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW1dLFxuICAgICAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueCtvZmZzZXQgLCBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgICAgIHg6IGxvYy5kaXNjYm94Lngrb2Zmc2V0LFxuICAgICAgICAgICAgICAgIHk6IGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZC5sYXllcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9kLmxheWVyKCdEQ19ncm91bmQnKTtcbiAgICAgICAgLy9kLmxpbmUoW1xuICAgICAgICAvLyAgICBbIGxvYy5hcnJheS5sZWZ0ICwgbG9jLmFycmF5Lmxvd2VyICsgc2l6ZS5tb2R1bGUudyArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgICAgIC8vICAgIFsgbG9jLmFycmF5LnJpZ2h0K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kICwgbG9jLmFycmF5Lmxvd2VyICsgc2l6ZS5tb2R1bGUudyArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgICAgIC8vICAgIFsgbG9jLmFycmF5LnJpZ2h0K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kICwgbG9jLmFycmF5LnkgKyBzaXplLm1vZHVsZS53ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmRdLFxuICAgICAgICAvLyAgICBbIGxvYy5hcnJheS54ICwgbG9jLmFycmF5Lnkrc2l6ZS5tb2R1bGUudytzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZF0sXG4gICAgICAgIC8vXSk7XG5cbiAgICAgICAgLy9kLmxheWVyKCk7XG5cbiAgICAgICAgLy8gR3JvdW5kXG4gICAgICAgIC8vb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5nYXAgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZDtcbiAgICAgICAgb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5ncm91bmQ7XG5cbiAgICAgICAgZC5sYXllcignRENfZ3JvdW5kJyk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbIHggLCB5K29mZnNldF0sXG4gICAgICAgICAgICBbIHggLCB5K29mZnNldF0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICB4OiB4LFxuICAgICAgICAgICAgeTogeStvZmZzZXQsXG4gICAgICAgIH0pO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgWyB4ICwgeStvZmZzZXRdLFxuICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueCtvZmZzZXQgLCBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtXSxcbiAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueCtvZmZzZXQgLCBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgIHg6IGxvYy5kaXNjYm94Lngrb2Zmc2V0LFxuICAgICAgICAgICAgeTogbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbVxuICAgICAgICB9KTtcbiAgICAgICAgZC5sYXllcigpO1xuXG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgIC8vIERDIGRpc2NvbmVjdFxuICAgICAgICBkLnNlY3Rpb24oXCJEQyBkaWNvbmVjdFwiKTtcblxuXG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFtsb2MuZGlzY2JveC54LCBsb2MuZGlzY2JveC55XSxcbiAgICAgICAgICAgIFtzaXplLmRpc2Nib3gudyxzaXplLmRpc2Nib3guaF0sXG4gICAgICAgICAgICAnYm94J1xuICAgICAgICApO1xuXG4gICAgICAgIC8vIERDIGRpc2NvbmVjdCBjb21iaW5lciBkLmxpbmVzXG5cbiAgICAgICAgeCA9IGxvYy5kaXNjYm94Lng7XG4gICAgICAgIHkgPSBsb2MuZGlzY2JveC55ICsgc2l6ZS5kaXNjYm94LmgvMjtcblxuICAgICAgICBpZiggc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzID4gMSl7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0X21pbiA9IHNpemUud2lyZV9vZmZzZXQubWluO1xuICAgICAgICAgICAgdmFyIG9mZnNldF9tYXggPSBzaXplLndpcmVfb2Zmc2V0Lm1pbiArICggKHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyAtMSkgKiBzaXplLndpcmVfb2Zmc2V0LmJhc2UgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4LW9mZnNldF9taW4sIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgICAgICBbIHgtb2Zmc2V0X21heCwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgXSwgJ0RDX3BvcycpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHgrb2Zmc2V0X21pbiwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgICAgIFsgeCtvZmZzZXRfbWF4LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBdLCAnRENfbmVnJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbnZlcnRlciBjb25lY3Rpb25cbiAgICAgICAgLy9kLmxpbmUoW1xuICAgICAgICAvLyAgICBbIHgtb2Zmc2V0X21pbiwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAvLyAgICBbIHgtb2Zmc2V0X21pbiwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAvL10sJ0RDX3BvcycpO1xuXG4gICAgICAgIC8vb2Zmc2V0ID0gb2Zmc2V0X21heCAtIG9mZnNldF9taW47XG4gICAgICAgIG9mZnNldCA9IHNpemUud2lyZV9vZmZzZXQubWluO1xuXG4gICAgICAgIC8vIG5lZ1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgWyB4K29mZnNldCwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgWyB4K29mZnNldCwgbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtIF0sXG4gICAgICAgIF0sJ0RDX25lZycpO1xuICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICB4OiB4K29mZnNldCxcbiAgICAgICAgICAgIHk6IGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcG9zXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbIHgtb2Zmc2V0LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBbIHgtb2Zmc2V0LCBsb2MuaW52ZXJ0ZXIueStzaXplLmludmVydGVyLmgvMi1zaXplLnRlcm1pbmFsX2RpYW0gXSxcbiAgICAgICAgXSwnRENfcG9zJyk7XG4gICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgIHg6IHgtb2Zmc2V0LFxuICAgICAgICAgICAgeTogbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBncm91bmRcbiAgICAgICAgLy9vZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0LmdhcCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kO1xuICAgICAgICBvZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZDtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFsgeCtvZmZzZXQsIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIFsgeCtvZmZzZXQsIGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSBdLFxuICAgICAgICBdLCdEQ19ncm91bmQnKTtcbiAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgeDogeCtvZmZzZXQsXG4gICAgICAgICAgICB5OiBsb2MuaW52ZXJ0ZXIueStzaXplLmludmVydGVyLmgvMi1zaXplLnRlcm1pbmFsX2RpYW0sXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyNpbnZlcnRlclxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnaW52ZXJ0ZXInKSApe1xuXG4gICAgICAgIGQuc2VjdGlvbihcImludmVydGVyXCIpO1xuXG5cbiAgICAgICAgeCA9IGxvYy5pbnZlcnRlci54O1xuICAgICAgICB5ID0gbG9jLmludmVydGVyLnk7XG5cblxuICAgICAgICAvL2ZyYW1lXG4gICAgICAgIGQubGF5ZXIoJ2JveCcpO1xuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbeCx5XSxcbiAgICAgICAgICAgIFtzaXplLmludmVydGVyLncsIHNpemUuaW52ZXJ0ZXIuaF1cbiAgICAgICAgKTtcbiAgICAgICAgLy8gTGFiZWwgYXQgdG9wIChJbnZlcnRlciwgbWFrZSwgbW9kZWwsIC4uLilcbiAgICAgICAgZC5sYXllcigndGV4dCcpO1xuICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICBbbG9jLmludmVydGVyLngsIGxvYy5pbnZlcnRlci50b3AgKyBzaXplLmludmVydGVyLnRleHRfZ2FwIF0sXG4gICAgICAgICAgICBbICdJbnZlcnRlcicsIHNldHRpbmdzLnN5c3RlbS5pbnZlcnRlci5tYWtlICsgXCIgXCIgKyBzZXR0aW5ncy5zeXN0ZW0uaW52ZXJ0ZXIubW9kZWwgXSxcbiAgICAgICAgICAgICdsYWJlbCdcbiAgICAgICAgKTtcbiAgICAgICAgZC5sYXllcigpO1xuXG4gICAgLy8jaW52ZXJ0ZXIgc3ltYm9sXG4gICAgICAgIGQuc2VjdGlvbihcImludmVydGVyIHN5bWJvbFwiKTtcblxuICAgICAgICB4ID0gbG9jLmludmVydGVyLng7XG4gICAgICAgIHkgPSBsb2MuaW52ZXJ0ZXIueTtcblxuICAgICAgICB3ID0gc2l6ZS5pbnZlcnRlci5zeW1ib2xfdztcbiAgICAgICAgaCA9IHNpemUuaW52ZXJ0ZXIuc3ltYm9sX2g7XG5cbiAgICAgICAgdmFyIHNwYWNlID0gdyoxLzEyO1xuXG4gICAgICAgIC8vIEludmVydGVyIHN5bWJvbFxuICAgICAgICBkLmxheWVyKCdib3gnKTtcblxuICAgICAgICAvLyBib3hcbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW3gseV0sXG4gICAgICAgICAgICBbdywgaF1cbiAgICAgICAgKTtcbiAgICAgICAgLy8gZGlhZ2FuYWxcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4LXcvMiwgeStoLzJdLFxuICAgICAgICAgICAgW3grdy8yLCB5LWgvMl0sXG5cbiAgICAgICAgXSk7XG4gICAgICAgIC8vIERDXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlLFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZV0sXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlKjYsXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlXSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlLFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqMixcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSozLFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNCxcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSo1LFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNixcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIF0pO1xuXG4gICAgICAgIC8vIEFDXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlLFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSoyLFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqMyxcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqNCxcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjUsXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjYsXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxheWVyKCk7XG5cblxuXG5cblxuICAgIH1cblxuXG5cblxuXG4vLyNBQ19kaXNjY29uZWN0XG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdBQycpICl7XG4gICAgICAgIGQuc2VjdGlvbihcIkFDX2Rpc2Njb25lY3RcIik7XG5cbiAgICAgICAgeCA9IGxvYy5BQ19kaXNjLng7XG4gICAgICAgIHkgPSBsb2MuQUNfZGlzYy55O1xuICAgICAgICBwYWRkaW5nID0gc2l6ZS50ZXJtaW5hbF9kaWFtO1xuXG4gICAgICAgIGQubGF5ZXIoJ2JveCcpO1xuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbeCwgeV0sXG4gICAgICAgICAgICBbc2l6ZS5BQ19kaXNjLncsIHNpemUuQUNfZGlzYy5oXVxuICAgICAgICApO1xuICAgICAgICBkLmxheWVyKCk7XG5cblxuICAgIC8vZC5jaXJjKFt4LHldLDUpO1xuXG5cblxuICAgIC8vI0FDIGxvYWQgY2VudGVyXG4gICAgICAgIGQuc2VjdGlvbihcIkFDIGxvYWQgY2VudGVyXCIpO1xuXG4gICAgICAgIHZhciBicmVha2VyX3NwYWNpbmcgPSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMuc3BhY2luZztcblxuICAgICAgICB4ID0gbG9jLkFDX2xvYWRjZW50ZXIueDtcbiAgICAgICAgeSA9IGxvYy5BQ19sb2FkY2VudGVyLnk7XG4gICAgICAgIHcgPSBzaXplLkFDX2xvYWRjZW50ZXIudztcbiAgICAgICAgaCA9IHNpemUuQUNfbG9hZGNlbnRlci5oO1xuXG4gICAgICAgIGQucmVjdChbeCx5XSxcbiAgICAgICAgICAgIFt3LGhdLFxuICAgICAgICAgICAgJ2JveCdcbiAgICAgICAgKTtcblxuICAgICAgICBkLnRleHQoW3gseS1oKjAuNF0sXG4gICAgICAgICAgICBbc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXMsICdMb2FkIENlbnRlciddLFxuICAgICAgICAgICAgJ2xhYmVsJyxcbiAgICAgICAgICAgICd0ZXh0J1xuICAgICAgICApO1xuICAgICAgICB3ID0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIudztcbiAgICAgICAgaCA9IHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyLmg7XG5cbiAgICAgICAgcGFkZGluZyA9IGxvYy5BQ19sb2FkY2VudGVyLnggLSBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy5sZWZ0IC0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIudztcblxuICAgICAgICB5ID0gbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMudG9wO1xuICAgICAgICB5ICs9IHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5zcGFjaW5nLzI7XG4gICAgICAgIGZvciggdmFyIGk9MDsgaTxzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMubnVtOyBpKyspe1xuICAgICAgICAgICAgZC5yZWN0KFt4LXBhZGRpbmctdy8yLHldLFt3LGhdLCdib3gnKTtcbiAgICAgICAgICAgIGQucmVjdChbeCtwYWRkaW5nK3cvMix5XSxbdyxoXSwnYm94Jyk7XG4gICAgICAgICAgICB5ICs9IGJyZWFrZXJfc3BhY2luZztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzLCBsO1xuXG4gICAgICAgIGwgPSBsb2MuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyO1xuICAgICAgICBzID0gc2l6ZS5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXI7XG4gICAgICAgIGQucmVjdChbbC54LGwueV0sIFtzLncscy5oXSwgJ0FDX25ldXRyYWwnICk7XG5cbiAgICAgICAgbCA9IGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhcjtcbiAgICAgICAgcyA9IHNpemUuQUNfbG9hZGNlbnRlci5ncm91bmRiYXI7XG4gICAgICAgIGQucmVjdChbbC54LGwueV0sIFtzLncscy5oXSwgJ0FDX2dyb3VuZCcgKTtcblxuICAgICAgICBkLmJsb2NrKCdncm91bmQnLCBbbC54LGwueStzLmgvMl0pO1xuXG5cblxuICAgIC8vIEFDIGQubGluZXNcbiAgICAgICAgZC5zZWN0aW9uKFwiQUMgZC5saW5lc1wiKTtcblxuICAgICAgICB4ID0gbG9jLmludmVydGVyLmJvdHRvbV9yaWdodC54O1xuICAgICAgICB5ID0gbG9jLmludmVydGVyLmJvdHRvbV9yaWdodC55O1xuICAgICAgICB4IC09IHNpemUudGVybWluYWxfZGlhbSAqIChzeXN0ZW0uQUMubnVtX2NvbmR1Y3RvcnMrMSk7XG4gICAgICAgIHkgLT0gc2l6ZS50ZXJtaW5hbF9kaWFtO1xuXG4gICAgICAgIHZhciBjb25kdWl0X3kgPSBsb2MuQUNfY29uZHVpdC55O1xuICAgICAgICBwYWRkaW5nID0gc2l6ZS50ZXJtaW5hbF9kaWFtO1xuICAgICAgICAvL3ZhciBBQ19kLmxheWVyX25hbWVzID0gWydBQ19ncm91bmQnLCAnQUNfbmV1dHJhbCcsICdBQ19MMScsICdBQ19MMicsICdBQ19MMiddO1xuXG4gICAgICAgIGZvciggdmFyIGk9MDsgaSA8IHN5c3RlbS5BQy5udW1fY29uZHVjdG9yczsgaSsrICl7XG4gICAgICAgICAgICBkLmJsb2NrKCd0ZXJtaW5hbCcsIFt4LHldICk7XG4gICAgICAgICAgICBkLmxheWVyKCdBQ18nK3N5c3RlbS5BQy5jb25kdWN0b3JzW2ldKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgW3gsIHldLFxuICAgICAgICAgICAgICAgIFt4LCBsb2MuQUNfZGlzYy5ib3R0b20gLSBwYWRkaW5nKjIgLSBwYWRkaW5nKmkgIF0sXG4gICAgICAgICAgICAgICAgW2xvYy5BQ19kaXNjLmxlZnQsIGxvYy5BQ19kaXNjLmJvdHRvbSAtIHBhZGRpbmcqMiAtIHBhZGRpbmcqaSBdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB4ICs9IHNpemUudGVybWluYWxfZGlhbTtcbiAgICAgICAgfVxuICAgICAgICBkLmxheWVyKCk7XG5cbiAgICAgICAgeCA9IGxvYy5BQ19kaXNjLng7XG4gICAgICAgIHkgPSBsb2MuQUNfZGlzYy55ICsgc2l6ZS5BQ19kaXNjLmgvMjtcbiAgICAgICAgeSAtPSBwYWRkaW5nKjI7XG5cbiAgICAgICAgaWYoIHN5c3RlbS5BQy5jb25kdWN0b3JzLmluZGV4T2YoJ2dyb3VuZCcpKzEgKSB7XG4gICAgICAgICAgICBkLmxheWVyKCdBQ19ncm91bmQnKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4LXNpemUuQUNfZGlzYy53LzIsIHkgXSxcbiAgICAgICAgICAgICAgICBbIHgrc2l6ZS5BQ19kaXNjLncvMitwYWRkaW5nKjIsIHkgXSxcbiAgICAgICAgICAgICAgICBbIHgrc2l6ZS5BQ19kaXNjLncvMitwYWRkaW5nKjIsIGNvbmR1aXRfeSArIGJyZWFrZXJfc3BhY2luZyoyIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5sZWZ0K3BhZGRpbmcqMiwgY29uZHVpdF95ICsgYnJlYWtlcl9zcGFjaW5nKjIgXSxcbiAgICAgICAgICAgICAgICAvL1sgbG9jLkFDX2xvYWRjZW50ZXIubGVmdCtwYWRkaW5nKjIsIHkgXSxcbiAgICAgICAgICAgICAgICAvL1sgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLngtcGFkZGluZywgeSBdLFxuICAgICAgICAgICAgICAgIC8vWyBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueC1wYWRkaW5nLCBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueStzaXplLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLmgvMiBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIubGVmdCtwYWRkaW5nKjIsIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci55IF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueC1zaXplLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLncvMiwgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLnkgXSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIHN5c3RlbS5BQy5jb25kdWN0b3JzLmluZGV4T2YoJ25ldXRyYWwnKSsxICkge1xuICAgICAgICAgICAgeSAtPSBwYWRkaW5nO1xuICAgICAgICAgICAgZC5sYXllcignQUNfbmV1dHJhbCcpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHgtc2l6ZS5BQ19kaXNjLncvMiwgeSBdLFxuICAgICAgICAgICAgICAgIFsgeCtwYWRkaW5nKjMqMiwgeSBdLFxuICAgICAgICAgICAgICAgIFsgeCtwYWRkaW5nKjMqMiwgY29uZHVpdF95ICsgYnJlYWtlcl9zcGFjaW5nKjEgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIueCwgY29uZHVpdF95ICsgYnJlYWtlcl9zcGFjaW5nKjEgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIueCxcbiAgICAgICAgICAgICAgICAgICAgbG9jLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhci55LXNpemUuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyLmgvMiBdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH1cblxuXG5cbiAgICAgICAgZm9yKCB2YXIgaT0xOyBpIDw9IDM7IGkrKyApIHtcbiAgICAgICAgICAgIGlmKCBzeXN0ZW0uQUMuY29uZHVjdG9ycy5pbmRleE9mKCdMJytpKSsxICkge1xuICAgICAgICAgICAgICAgIHkgLT0gcGFkZGluZztcbiAgICAgICAgICAgICAgICBkLmxheWVyKCdBQ19MJytpKTtcbiAgICAgICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbIHgtc2l6ZS5BQ19kaXNjLncvMiwgeSBdLFxuICAgICAgICAgICAgICAgICAgICBbIHgrcGFkZGluZyozKigyLWkpLCB5IF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeCtwYWRkaW5nKjMqKDItaSksIGxvYy5BQ19kaXNjLnN3aXRjaF9ib3R0b20gXSxcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICBkLmJsb2NrKCd0ZXJtaW5hbCcsIFsgeC1wYWRkaW5nKihpLTIpKjMsIGxvYy5BQ19kaXNjLnN3aXRjaF9ib3R0b20gXSApO1xuICAgICAgICAgICAgICAgIGQuYmxvY2soJ3Rlcm1pbmFsJywgWyB4LXBhZGRpbmcqKGktMikqMywgbG9jLkFDX2Rpc2Muc3dpdGNoX3RvcCBdICk7XG4gICAgICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgWyB4LXBhZGRpbmcqKGktMikqMywgbG9jLkFDX2Rpc2Muc3dpdGNoX3RvcCBdLFxuICAgICAgICAgICAgICAgICAgICBbIHgtcGFkZGluZyooaS0yKSozLCBjb25kdWl0X3ktYnJlYWtlcl9zcGFjaW5nKihpLTEpIF0sXG4gICAgICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMubGVmdCwgY29uZHVpdF95LWJyZWFrZXJfc3BhY2luZyooaS0xKSBdLFxuICAgICAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuXG5cblxuLy8gV2lyZSB0YWJsZVxuICAgIGQuc2VjdGlvbihcIldpcmUgdGFibGVcIik7XG5cbi8vLypcblxuICAgIHggPSBsb2Mud2lyZV90YWJsZS54O1xuICAgIHkgPSBsb2Mud2lyZV90YWJsZS55O1xuXG4gICAgaWYoIHN5c3RlbS5BQy5udW1fY29uZHVjdG9ycyApIHtcbiAgICAgICAgdmFyIG5fcm93cyA9IDIgKyBzeXN0ZW0uQUMubnVtX2NvbmR1Y3RvcnM7XG4gICAgICAgIHZhciBuX2NvbHMgPSA2O1xuICAgICAgICB2YXIgcm93X2hlaWdodCA9IDE1O1xuICAgICAgICB2YXIgY29sdW1uX3dpZHRoID0ge1xuICAgICAgICAgICAgbnVtYmVyOiAyNSxcbiAgICAgICAgICAgIGNvbmR1Y3RvcjogNTAsXG4gICAgICAgICAgICB3aXJlX2dhdWdlOiAyNSxcbiAgICAgICAgICAgIHdpcmVfdHlwZTogNzUsXG4gICAgICAgICAgICBjb25kdWl0X3NpemU6IDM1LFxuICAgICAgICAgICAgY29uZHVpdF90eXBlOiA3NSxcbiAgICAgICAgfTtcblxuICAgICAgICBoID0gbl9yb3dzKnJvd19oZWlnaHQ7XG5cbiAgICAgICAgdmFyIHQgPSBkLnRhYmxlKG5fcm93cyxuX2NvbHMpLmxvYyh4LHkpO1xuICAgICAgICB0LnJvd19zaXplKCdhbGwnLCByb3dfaGVpZ2h0KVxuICAgICAgICAgICAgLmNvbF9zaXplKDEsIGNvbHVtbl93aWR0aC5udW1iZXIpXG4gICAgICAgICAgICAuY29sX3NpemUoMiwgY29sdW1uX3dpZHRoLmNvbmR1Y3RvcilcbiAgICAgICAgICAgIC5jb2xfc2l6ZSgzLCBjb2x1bW5fd2lkdGgud2lyZV9nYXVnZSlcbiAgICAgICAgICAgIC5jb2xfc2l6ZSg0LCBjb2x1bW5fd2lkdGgud2lyZV90eXBlKVxuICAgICAgICAgICAgLmNvbF9zaXplKDUsIGNvbHVtbl93aWR0aC5jb25kdWl0X3NpemUpXG4gICAgICAgICAgICAuY29sX3NpemUoNiwgY29sdW1uX3dpZHRoLmNvbmR1aXRfdHlwZSk7XG5cbiAgICAgICAgdC5hbGxfY2VsbHMoKS5mb3JFYWNoKGZ1bmN0aW9uKGNlbGwpe1xuICAgICAgICAgICAgY2VsbC5mb250KCd0YWJsZScpLmJvcmRlcignYWxsJyk7XG4gICAgICAgIH0pO1xuICAgICAgICB0LmNlbGwoMSwxKS5ib3JkZXIoJ0InLCBmYWxzZSk7XG4gICAgICAgIHQuY2VsbCgxLDMpLmJvcmRlcignUicsIGZhbHNlKTtcbiAgICAgICAgdC5jZWxsKDEsNSkuYm9yZGVyKCdSJywgZmFsc2UpO1xuXG4gICAgICAgIHQuY2VsbCgxLDMpLmZvbnQoJ3RhYmxlX2xlZnQnKS50ZXh0KCdXaXJlJyk7XG4gICAgICAgIHQuY2VsbCgxLDUpLmZvbnQoJ3RhYmxlX2xlZnQnKS50ZXh0KCdDb25kdWl0Jyk7XG5cbiAgICAgICAgdC5jZWxsKDIsMykuZm9udCgndGFibGUnKS50ZXh0KCdDb25kdWN0b3JzJyk7XG4gICAgICAgIHQuY2VsbCgyLDMpLmZvbnQoJ3RhYmxlJykudGV4dCgnQVdHJyk7XG4gICAgICAgIHQuY2VsbCgyLDQpLmZvbnQoJ3RhYmxlJykudGV4dCgnVHlwZScpO1xuICAgICAgICB0LmNlbGwoMiw1KS5mb250KCd0YWJsZScpLnRleHQoJ1NpemUnKTtcbiAgICAgICAgdC5jZWxsKDIsNikuZm9udCgndGFibGUnKS50ZXh0KCdUeXBlJyk7XG5cbiAgICAgICAgZm9yKCBpPTE7IGk8PXN5c3RlbS5BQy5udW1fY29uZHVjdG9yczsgaSsrKXtcbiAgICAgICAgICAgIHQuY2VsbCgyK2ksMSkuZm9udCgndGFibGUnKS50ZXh0KGkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB0LmNlbGwoMitpLDIpLmZvbnQoJ3RhYmxlX2xlZnQnKS50ZXh0KCBmLnByZXR0eV93b3JkKHNldHRpbmdzLnN5c3RlbS5BQy5jb25kdWN0b3JzW2ktMV0pICk7XG5cbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy9kLnRleHQoIFt4K3cvMiwgeS1yb3dfaGVpZ2h0XSwgZi5wcmV0dHlfbmFtZShzZWN0aW9uX25hbWUpLCd0YWJsZScgKTtcblxuXG4gICAgICAgIHQubWsoKTtcblxuICAgIH1cblxuLy8qL1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuLy8gdm9sdGFnZSBkcm9wXG4gICAgZC5zZWN0aW9uKFwidm9sdGFnZSBkcm9wXCIpO1xuXG5cbiAgICB4ID0gbG9jLnZvbHRfZHJvcF90YWJsZS54O1xuICAgIHkgPSBsb2Mudm9sdF9kcm9wX3RhYmxlLnk7XG4gICAgdyA9IHNpemUudm9sdF9kcm9wX3RhYmxlLnc7XG4gICAgaCA9IHNpemUudm9sdF9kcm9wX3RhYmxlLmg7XG5cbiAgICBkLmxheWVyKCd0YWJsZScpO1xuICAgIGQucmVjdCggW3gseV0sIFt3LGhdICk7XG5cbiAgICB5IC09IGgvMjtcbiAgICB5ICs9IDEwO1xuXG4gICAgZC50ZXh0KCBbeCx5XSwgJ1ZvbHRhZ2UgRHJvcCcsICd0YWJsZScsICd0ZXh0Jyk7XG5cblxuLy8gZ2VuZXJhbCBub3Rlc1xuICAgIGQuc2VjdGlvbihcImdlbmVyYWwgbm90ZXNcIik7XG5cbiAgICB4ID0gbG9jLmdlbmVyYWxfbm90ZXMueDtcbiAgICB5ID0gbG9jLmdlbmVyYWxfbm90ZXMueTtcbiAgICB3ID0gc2l6ZS5nZW5lcmFsX25vdGVzLnc7XG4gICAgaCA9IHNpemUuZ2VuZXJhbF9ub3Rlcy5oO1xuXG4gICAgZC5sYXllcigndGFibGUnKTtcbiAgICBkLnJlY3QoIFt4LHldLCBbdyxoXSApO1xuXG4gICAgeSAtPSBoLzI7XG4gICAgeSArPSAxMDtcblxuICAgIGQudGV4dCggW3gseV0sICdHZW5lcmFsIE5vdGVzJywgJ3RhYmxlJywgJ3RleHQnKTtcblxuXG4gICAgZC5zZWN0aW9uKCk7XG5cbiAgICByZXR1cm4gZC5kcmF3aW5nX3BhcnRzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcGFnZTtcbiIsInZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG52YXIgbWtfYm9yZGVyID0gcmVxdWlyZSgnLi9ta19ib3JkZXInKTtcblxudmFyIHBhZ2UgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgY29uc29sZS5sb2coXCIqKiBNYWtpbmcgcGFnZSAzXCIpO1xuICAgIHZhciBmID0gc2V0dGluZ3MuZjtcblxuICAgIGQgPSBta19kcmF3aW5nKCk7XG5cbiAgICB2YXIgc2hlZXRfc2VjdGlvbiA9ICdQVic7XG4gICAgdmFyIHNoZWV0X251bSA9ICcwMic7XG4gICAgZC5hcHBlbmQobWtfYm9yZGVyKHNldHRpbmdzLCBzaGVldF9zZWN0aW9uLCBzaGVldF9udW0gKSk7XG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG5cblxuICAgIGQudGV4dChcbiAgICAgICAgW3NpemUuZHJhd2luZy53LzIsIHNpemUuZHJhd2luZy5oLzJdLFxuICAgICAgICAnQ2FsY3VsYXRpb24gU2hlZXQnLFxuICAgICAgICAndGl0bGUyJ1xuICAgICk7XG5cblxuICAgIHggPSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyo2O1xuICAgIHkgPSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyo2ICsyMDtcblxuICAgIGQubGF5ZXIoJ3RhYmxlJyk7XG5cblxuICAgIGZvciggdmFyIHNlY3Rpb25fbmFtZSBpbiBzZXR0aW5ncy5zeXN0ZW0gKXtcbiAgICAgICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKHNlY3Rpb25fbmFtZSkgKXtcbiAgICAgICAgICAgIHZhciBzZWN0aW9uID0gc2V0dGluZ3Muc3lzdGVtW3NlY3Rpb25fbmFtZV07XG5cbiAgICAgICAgICAgIHZhciBuID0gT2JqZWN0LmtleXMoc2VjdGlvbikubGVuZ3RoO1xuXG4gICAgICAgICAgICB2YXIgbl9yb3dzID0gbiswO1xuICAgICAgICAgICAgdmFyIG5fY29scyA9IDI7XG5cbiAgICAgICAgICAgIHZhciByb3dfaGVpZ2h0ID0gMTU7XG4gICAgICAgICAgICBoID0gbl9yb3dzKnJvd19oZWlnaHQ7XG5cblxuICAgICAgICAgICAgdmFyIHQgPSBkLnRhYmxlKG5fcm93cyxuX2NvbHMpLmxvYyh4LHkpO1xuICAgICAgICAgICAgdC5yb3dfc2l6ZSgnYWxsJywgcm93X2hlaWdodCkuY29sX3NpemUoMSwgMTAwKS5jb2xfc2l6ZSgyLCAxMjUpO1xuICAgICAgICAgICAgdyA9IDEwMCs4MDtcblxuICAgICAgICAgICAgdmFyIHIgPSAxO1xuICAgICAgICAgICAgdmFyIHZhbHVlO1xuICAgICAgICAgICAgZm9yKCB2YXIgdmFsdWVfbmFtZSBpbiBzZWN0aW9uICl7XG4gICAgICAgICAgICAgICAgdC5jZWxsKHIsMSkudGV4dCggZi5wcmV0dHlfbmFtZSh2YWx1ZV9uYW1lKSApO1xuICAgICAgICAgICAgICAgIGlmKCAhIHNlY3Rpb25bdmFsdWVfbmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSAnLSc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKCBzZWN0aW9uW3ZhbHVlX25hbWVdLmNvbnN0cnVjdG9yID09PSBBcnJheSApe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHNlY3Rpb25bdmFsdWVfbmFtZV0udG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoIHNlY3Rpb25bdmFsdWVfbmFtZV0uY29uc3RydWN0b3IgPT09IE9iamVjdCApe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9ICcoICknO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiggaXNOYU4oc2VjdGlvblt2YWx1ZV9uYW1lXSkgKXtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBzZWN0aW9uW3ZhbHVlX25hbWVdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdChzZWN0aW9uW3ZhbHVlX25hbWVdKS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0LmNlbGwociwyKS50ZXh0KCB2YWx1ZSApO1xuICAgICAgICAgICAgICAgIHIrKztcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkLnRleHQoIFt4K3cvMiwgeS1yb3dfaGVpZ2h0XSwgZi5wcmV0dHlfbmFtZShzZWN0aW9uX25hbWUpLCd0YWJsZScgKTtcblxuXG5cblxuICAgICAgICAgICAgdC5hbGxfY2VsbHMoKS5mb3JFYWNoKGZ1bmN0aW9uKGNlbGwpe1xuICAgICAgICAgICAgICAgIGNlbGwuZm9udCgndGFibGUnKS5ib3JkZXIoJ2FsbCcpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHQubWsoKTtcblxuICAgICAgICAgICAgLy8qL1xuICAgICAgICAgICAgeSArPSBoICsgMzA7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnbm90IGRlZmluZWQ6ICcsIHNlY3Rpb25fbmFtZSwgc2VjdGlvbik7XG4gICAgICAgIH1cblxuXG5cblxuICAgIH1cblxuICAgIGQubGF5ZXIoKTtcblxuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xudmFyIG1rX2JvcmRlciA9IHJlcXVpcmUoJy4vbWtfYm9yZGVyJyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHBhZ2UgM1wiKTtcbiAgICB2YXIgZiA9IHNldHRpbmdzLmY7XG5cbiAgICBkID0gbWtfZHJhd2luZygpO1xuXG4gICAgdmFyIHNoZWV0X3NlY3Rpb24gPSAnUyc7XG4gICAgdmFyIHNoZWV0X251bSA9ICcwMSc7XG4gICAgZC5hcHBlbmQobWtfYm9yZGVyKHNldHRpbmdzLCBzaGVldF9zZWN0aW9uLCBzaGVldF9udW0gKSk7XG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG4gICAgdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgY29uc29sZS5sb2coZi5zZWN0aW9uX2RlZmluZWQoJ3Jvb2YnKSk7XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ3Jvb2YnKSApe1xuXG5cblxuICAgICAgICB2YXIgeCwgeSwgaCwgdywgc2VjdGlvbl94LCBzZWN0aW9uX3ksIGxlbmd0aF9wLCBzY2FsZTtcblxuICAgICAgICB2YXIgc2xvcGUgPSBzeXN0ZW0ucm9vZi5zbG9wZS5zcGxpdCgnOicpWzBdO1xuICAgICAgICB2YXIgYW5nbGVfcmFkID0gTWF0aC5hdGFuKCBOdW1iZXIoc2xvcGUpIC8xMiApO1xuICAgICAgICAvL2FuZ2xlX3JhZCA9IGFuZ2xlICogKE1hdGguUEkvMTgwKTtcblxuXG4gICAgICAgIGxlbmd0aF9wID0gc3lzdGVtLnJvb2YubGVuZ3RoICogTWF0aC5jb3MoYW5nbGVfcmFkKTtcbiAgICAgICAgc3lzdGVtLnJvb2YuaGVpZ2h0ID0gc3lzdGVtLnJvb2YubGVuZ3RoICogTWF0aC5zaW4oYW5nbGVfcmFkKTtcblxuICAgICAgICB2YXIgcm9vZl9yYXRpbyA9IHN5c3RlbS5yb29mLmxlbmd0aCAvIHN5c3RlbS5yb29mLndpZHRoO1xuICAgICAgICB2YXIgcm9vZl9wbGFuX3JhdGlvID0gbGVuZ3RoX3AgLyBzeXN0ZW0ucm9vZi53aWR0aDtcblxuXG4gICAgICAgIGlmKCBzeXN0ZW0ucm9vZi50eXBlID09PSBcIkdhYmxlXCIpe1xuXG5cbiAgICAgICAgICAgIC8vLy8vLy9cbiAgICAgICAgICAgIC8vIFJvb2QgcGxhbiB2aWV3XG4gICAgICAgICAgICB2YXIgcGxhbl94ID0gNjA7XG4gICAgICAgICAgICB2YXIgcGxhbl95ID0gNjA7XG5cbiAgICAgICAgICAgIHZhciBwbGFuX3csIHBsYW5faDtcbiAgICAgICAgICAgIGlmKCBsZW5ndGhfcCoyID4gc3lzdGVtLnJvb2Yud2lkdGggKXtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDIwMC8obGVuZ3RoX3AqMik7XG4gICAgICAgICAgICAgICAgcGxhbl93ID0gKGxlbmd0aF9wKjIpICogc2NhbGU7XG4gICAgICAgICAgICAgICAgcGxhbl9oID0gcGxhbl93IC8gKGxlbmd0aF9wKjIgLyBzeXN0ZW0ucm9vZi53aWR0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNjYWxlID0gMzAwLyhzeXN0ZW0ucm9vZi53aWR0aCk7XG4gICAgICAgICAgICAgICAgcGxhbl9oID0gc3lzdGVtLnJvb2Yud2lkdGggKiBzY2FsZTtcbiAgICAgICAgICAgICAgICBwbGFuX3cgPSBwbGFuX2ggKiAobGVuZ3RoX3AqMiAvIHN5c3RlbS5yb29mLndpZHRoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feStwbGFuX2gvMl0sXG4gICAgICAgICAgICAgICAgW3BsYW5fdywgcGxhbl9oXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkLnBvbHkoW1xuICAgICAgICAgICAgICAgICAgICBbcGxhbl94ICAgICAgICwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95K3BsYW5faF0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3gsICAgICAgICBwbGFuX3krcGxhbl9oXSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCAgICAgICAsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3Vuc2VsZWN0ZWRcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQucG9seShbXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIgICAgICAgLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yK3BsYW5fdy8yLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yK3BsYW5fdy8yLCBwbGFuX3krcGxhbl9oXSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgICAgICAgIHBsYW5feStwbGFuX2hdLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yICAgICAgICwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX3BvbHlfc2VsZWN0ZWRcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95K3BsYW5faF1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtwbGFuX3gtMjAsIHBsYW5feStwbGFuX2gvMl0sXG4gICAgICAgICAgICAgICAgc3lzdGVtLnJvb2YubGVuZ3RoLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3crMjAsIHBsYW5feStwbGFuX2gvMl0sXG4gICAgICAgICAgICAgICAgc3lzdGVtLnJvb2Yud2lkdGgudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcblxuXG4gICAgICAgICAgICB4ID0gcGxhbl94ICsgMTIwO1xuICAgICAgICAgICAgeSA9IHBsYW5feSAtIDIwO1xuXG4gICAgICAgICAgICBkLmJsb2NrKCdub3J0aCBhcnJvd19sZWZ0JywgW3gseV0pO1xuXG5cbiAgICAgICAgICAgIC8vLy8vLy8vXG4gICAgICAgICAgICAvLyByb29mIGNyb3NzZWN0aW9uXG5cbiAgICAgICAgICAgIHZhciBjc194ID0gcGxhbl94O1xuICAgICAgICAgICAgdmFyIGNzX3kgPSBwbGFuX3kgKyBwbGFuX2ggKyA1MDtcbiAgICAgICAgICAgIHZhciBjc19oID0gc3lzdGVtLnJvb2YuaGVpZ2h0ICogc2NhbGU7XG4gICAgICAgICAgICB2YXIgY3NfdyA9IHBsYW5fdy8yO1xuXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3ldLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3krY3NfaF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3csICAgY3NfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3cqMiwgY3NfeStjc19oXSxcbiAgICAgICAgICAgICAgICAgICAgW2NzX3gsICAgICAgICBjc195K2NzX2hdLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3ldLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbY3NfeCtjc193LTE1LCBjc195K2NzX2gqMi8zXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi5oZWlnaHQgKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbY3NfeCtjc193KjEuNSsyMCwgY3NfeStjc19oLzNdLFxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHN5c3RlbS5yb29mLmxlbmd0aCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG5cblxuICAgICAgICAgICAgLy8vLy8vXG4gICAgICAgICAgICAvLyByb29mIGRldGFpbFxuXG4gICAgICAgICAgICB2YXIgZGV0YWlsX3ggPSAzMCs0MDA7XG4gICAgICAgICAgICB2YXIgZGV0YWlsX3kgPSAzMDtcblxuICAgICAgICAgICAgaWYoIE51bWJlcihzeXN0ZW0ucm9vZi53aWR0aCkgPj0gTnVtYmVyKHN5c3RlbS5yb29mLmxlbmd0aCkgKXtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDM1MC8oc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDM1MC8oc3lzdGVtLnJvb2YubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkZXRhaWxfdyA9IHN5c3RlbS5yb29mLndpZHRoICogc2NhbGU7XG4gICAgICAgICAgICB2YXIgZGV0YWlsX2ggPSBzeXN0ZW0ucm9vZi5sZW5ndGggKiBzY2FsZTtcblxuICAgICAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy8yLCBkZXRhaWxfeStkZXRhaWxfaC8yXSxcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3csIGRldGFpbF9oXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3NlbGVjdGVkX2ZyYW1lZFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB2YXIgYSA9IDM7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0X2EgPSBhICogc2NhbGU7XG5cbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCwgICBkZXRhaWxfeStvZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdywgICBkZXRhaWxfeStvZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCwgICAgICAgICAgZGV0YWlsX3krZGV0YWlsX2gtb2Zmc2V0X2FdLFxuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3csIGRldGFpbF95K2RldGFpbF9oLW9mZnNldF9hXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K29mZnNldF9hLCBkZXRhaWxfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtvZmZzZXRfYSwgZGV0YWlsX3krZGV0YWlsX2hdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3ctb2Zmc2V0X2EsIGRldGFpbF95XSxcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LW9mZnNldF9hLCBkZXRhaWxfeStkZXRhaWxfaF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeC00MCwgZGV0YWlsX3krZGV0YWlsX2gvMl0sXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggc3lzdGVtLnJvb2YubGVuZ3RoICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LzIsIGRldGFpbF95K2RldGFpbF9oKzQwXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi53aWR0aCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94KyAob2Zmc2V0X2EpLzIsIGRldGFpbF95K2RldGFpbF9oKzE1XSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LShvZmZzZXRfYSkvMiwgZGV0YWlsX3krZGV0YWlsX2grMTVdLFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3gtMTUsIGRldGFpbF95K2RldGFpbF9oLShvZmZzZXRfYSkvMl0sXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeC0xNSwgZGV0YWlsX3krKG9mZnNldF9hKS8yXSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHggPSBkZXRhaWxfeCArIGRldGFpbF93ICsgNTA7XG4gICAgICAgICAgICB5ID0gZGV0YWlsX3kgKyAxMjA7XG5cbiAgICAgICAgICAgIGQuYmxvY2soJ25vcnRoIGFycm93X3VwJywgW3gseV0pO1xuXG5cblxuICAgICAgICAgICAgLy8vLy8vXG4gICAgICAgICAgICAvLyBNb2R1bGUgb3B0aW9uc1xuICAgICAgICAgICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdtb2R1bGUnKSAmJiBmLnNlY3Rpb25fZGVmaW5lZCgnYXJyYXknKSl7XG4gICAgICAgICAgICAgICAgdmFyIHIsYztcblxuICAgICAgICAgICAgICAgIHZhciByb29mX2xlbmd0aF9hdmFpbCA9IHN5c3RlbS5yb29mLmxlbmd0aCAtIChhKjIpO1xuICAgICAgICAgICAgICAgIHZhciByb29mX3dpZHRoX2F2YWlsID0gc3lzdGVtLnJvb2Yud2lkdGggLSAoYSoyKTtcblxuICAgICAgICAgICAgICAgIHZhciByb3dfc3BhY2luZztcbiAgICAgICAgICAgICAgICBpZiggc3lzdGVtLm1vZHVsZS5vcmllbnRhdGlvbiA9PT0gJ1BvcnRyYWl0JyApe1xuICAgICAgICAgICAgICAgICAgICByb3dfc3BhY2luZyA9IE51bWJlcihzeXN0ZW0ubW9kdWxlLmxlbmd0aCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBjb2xfc3BhY2luZyA9IE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV93ID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSAgKS8xMjtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlX2ggPSAoTnVtYmVyKHN5c3RlbS5tb2R1bGUubGVuZ3RoKSApLzEyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd19zcGFjaW5nID0gTnVtYmVyKHN5c3RlbS5tb2R1bGUud2lkdGgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgY29sX3NwYWNpbmcgPSBOdW1iZXIoc3lzdGVtLm1vZHVsZS5sZW5ndGgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlX3cgPSAoTnVtYmVyKHN5c3RlbS5tb2R1bGUubGVuZ3RoKSkvMTI7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV9oID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSApLzEyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJvd19zcGFjaW5nID0gcm93X3NwYWNpbmcvMTI7IC8vbW9kdWxlIGRpbWVudGlvbnMgYXJlIGluIGluY2hlc1xuICAgICAgICAgICAgICAgIGNvbF9zcGFjaW5nID0gY29sX3NwYWNpbmcvMTI7IC8vbW9kdWxlIGRpbWVudGlvbnMgYXJlIGluIGluY2hlc1xuXG4gICAgICAgICAgICAgICAgdmFyIG51bV9yb3dzID0gTWF0aC5mbG9vcihyb29mX2xlbmd0aF9hdmFpbC9yb3dfc3BhY2luZyk7XG4gICAgICAgICAgICAgICAgdmFyIG51bV9jb2xzID0gTWF0aC5mbG9vcihyb29mX3dpZHRoX2F2YWlsL2NvbF9zcGFjaW5nKTtcblxuICAgICAgICAgICAgICAgIC8vc2VsZWN0ZWQgbW9kdWxlc1xuXG4gICAgICAgICAgICAgICAgaWYoIG51bV9jb2xzICE9PSBnLnRlbXAubnVtX2NvbHMgfHwgbnVtX3Jvd3MgIT09IGcudGVtcC5udW1fcm93cyApe1xuICAgICAgICAgICAgICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlcyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yKCByPTE7IHI8PW51bV9yb3dzOyByKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciggYz0xOyBjPD1udW1fY29sczsgYysrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICBnLnRlbXAubnVtX2NvbHMgPSBudW1fY29scztcbiAgICAgICAgICAgICAgICAgICAgZy50ZW1wLm51bV9yb3dzID0gbnVtX3Jvd3M7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB4ID0gZGV0YWlsX3ggKyBvZmZzZXRfYTsgLy9jb3JuZXIgb2YgdXNhYmxlIHNwYWNlXG4gICAgICAgICAgICAgICAgeSA9IGRldGFpbF95ICsgb2Zmc2V0X2E7XG4gICAgICAgICAgICAgICAgeCArPSAoIHJvb2Zfd2lkdGhfYXZhaWwgLSAoY29sX3NwYWNpbmcqbnVtX2NvbHMpKS8yICpzY2FsZTsgLy8gY2VudGVyIGFycmF5IG9uIHJvb2ZcbiAgICAgICAgICAgICAgICB5ICs9ICggcm9vZl9sZW5ndGhfYXZhaWwgLSAocm93X3NwYWNpbmcqbnVtX3Jvd3MpKS8yICpzY2FsZTtcbiAgICAgICAgICAgICAgICBtb2R1bGVfdyA9IG1vZHVsZV93ICogc2NhbGU7XG4gICAgICAgICAgICAgICAgbW9kdWxlX2ggPSBtb2R1bGVfaCAqIHNjYWxlO1xuXG5cblxuICAgICAgICAgICAgICAgIGZvciggcj0xOyByPD1udW1fcm93czsgcisrKXtcblxuICAgICAgICAgICAgICAgICAgICBmb3IoIGM9MTsgYzw9bnVtX2NvbHM7IGMrKyl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXllcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSApIGxheWVyID0gJ3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBsYXllciA9ICdwcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZV94ID0gKGMtMSkgKiBjb2xfc3BhY2luZyAqIHNjYWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlX3kgPSAoci0xKSAqIHJvd19zcGFjaW5nICogc2NhbGU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGQucmVjdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbeCttb2R1bGVfeCttb2R1bGVfdy8yLCB5K21vZHVsZV95K21vZHVsZV9oLzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFttb2R1bGVfdywgbW9kdWxlX2hdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljazogXCJnLmYudG9nZ2xlX21vZHVsZSh0aGlzKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVfSUQ6ICAocikgKyAnLCcgKyAoYylcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LzIsIGRldGFpbF95K2RldGFpbF9oKzEwMF0sXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiU2VsZWN0ZWQgbW9kdWxlczogXCIgKyBwYXJzZUZsb2F0KCBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDYWxjdWxhdGVkIG1vZHVsZXM6IFwiICsgcGFyc2VGbG9hdCggZy5zeXN0ZW0uYXJyYXkubnVtYmVyX29mX21vZHVsZXMgKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB9XG5cblxuXG5cbiAgICAgICAgfVxuICAgIH1cblxuXG5cblxuXG5cbiAgICByZXR1cm4gZC5kcmF3aW5nX3BhcnRzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcGFnZTtcbiIsInZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG52YXIgbWtfYm9yZGVyID0gcmVxdWlyZSgnLi9ta19ib3JkZXInKTtcbnZhciBmID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMnKTtcblxudmFyIHBhZ2UgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgY29uc29sZS5sb2coXCIqKiBNYWtpbmcgcHJldmlldyAxXCIpO1xuXG4gICAgdmFyIGQgPSBta19kcmF3aW5nKCk7XG5cblxuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5cbiAgICB2YXIgeCwgeSwgaCwgdywgc2VjdGlvbl94LCBzZWN0aW9uX3k7XG5cbiAgICB3ID0gc2l6ZS5wcmV2aWV3Lm1vZHVsZS53O1xuICAgIGggPSBzaXplLnByZXZpZXcubW9kdWxlLmg7XG4gICAgbG9jLnByZXZpZXcuYXJyYXkuYm90dG9tID0gbG9jLnByZXZpZXcuYXJyYXkudG9wICsgaCoxLjI1KnN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgKyBoKjMvNDtcbiAgICAvL2xvYy5wcmV2aWV3LmFycmF5LnJpZ2h0ID0gbG9jLnByZXZpZXcuYXJyYXkubGVmdCArIHcqMS4yNSpzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgKyB3KjI7XG4gICAgbG9jLnByZXZpZXcuYXJyYXkucmlnaHQgPSBsb2MucHJldmlldy5hcnJheS5sZWZ0ICsgdyoxLjI1KjggKyB3KjI7XG5cbiAgICBsb2MucHJldmlldy5pbnZlcnRlci5jZW50ZXIgPSA1MDAgO1xuICAgIHcgPSBzaXplLnByZXZpZXcuaW52ZXJ0ZXIudztcbiAgICBsb2MucHJldmlldy5pbnZlcnRlci5sZWZ0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIuY2VudGVyIC0gdy8yO1xuICAgIGxvYy5wcmV2aWV3LmludmVydGVyLnJpZ2h0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIuY2VudGVyICsgdy8yO1xuXG4gICAgbG9jLnByZXZpZXcuREMubGVmdCA9IGxvYy5wcmV2aWV3LmFycmF5LnJpZ2h0O1xuICAgIGxvYy5wcmV2aWV3LkRDLnJpZ2h0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIubGVmdDtcbiAgICBsb2MucHJldmlldy5EQy5jZW50ZXIgPSAoIGxvYy5wcmV2aWV3LkRDLnJpZ2h0ICsgbG9jLnByZXZpZXcuREMubGVmdCApLzI7XG5cbiAgICBsb2MucHJldmlldy5BQy5sZWZ0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIucmlnaHQ7XG4gICAgbG9jLnByZXZpZXcuQUMucmlnaHQgPSBsb2MucHJldmlldy5BQy5sZWZ0ICsgMzAwO1xuICAgIGxvYy5wcmV2aWV3LkFDLmNlbnRlciA9ICggbG9jLnByZXZpZXcuQUMucmlnaHQgKyBsb2MucHJldmlldy5BQy5sZWZ0ICkvMjtcblxuXG4vLyBUT0RPIGZpeDogc2VjdGlvbnMgbXVzdCBiZSBkZWZpbmVkIGluIG9yZGVyLCBvciB0aGVyZSBhcmUgYXJlYXNcblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnYXJyYXknKSAmJiBmLnNlY3Rpb25fZGVmaW5lZCgnbW9kdWxlJykgKXtcbiAgICAgICAgZC5sYXllcigncHJldmlld19hcnJheScpO1xuXG4gICAgICAgIHcgPSBzaXplLnByZXZpZXcubW9kdWxlLnc7XG4gICAgICAgIGggPSBzaXplLnByZXZpZXcubW9kdWxlLmg7XG4gICAgICAgIHZhciBvZmZzZXQgPSA0MDtcblxuICAgICAgICBmb3IoIHZhciBzPTA7IHM8c3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzOyBzKysgKXtcbiAgICAgICAgICAgIHggPSBsb2MucHJldmlldy5hcnJheS5sZWZ0ICsgdyoxLjI1KnM7XG4gICAgICAgICAgICAvLyBzdHJpbmcgd2lyaW5nXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbIHggLCBsb2MucHJldmlldy5hcnJheS50b3AgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB4ICwgbG9jLnByZXZpZXcuYXJyYXkuYm90dG9tIF0sXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIC8vIG1vZHVsZXNcbiAgICAgICAgICAgIGZvciggdmFyIG09MDsgbTxzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nOyBtKysgKXtcbiAgICAgICAgICAgICAgICB5ID0gbG9jLnByZXZpZXcuYXJyYXkudG9wICsgaCArIGgqMS4yNSptO1xuICAgICAgICAgICAgICAgIC8vIG1vZHVsZXNcbiAgICAgICAgICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICAgICAgICAgIFsgeCAsIHkgXSxcbiAgICAgICAgICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAgICAgICAgICdwcmV2aWV3X21vZHVsZSdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdG9wIGFycmF5IGNvbmR1aXRcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LmFycmF5LmxlZnQgLCBsb2MucHJldmlldy5hcnJheS50b3AgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LmFycmF5LnJpZ2h0IC0gdywgbG9jLnByZXZpZXcuYXJyYXkudG9wIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5hcnJheS5yaWdodCAsIGxvYy5wcmV2aWV3LmFycmF5LnRvcCBdLFxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgICAgICAvLyBib3R0b20gYXJyYXkgY29uZHVpdFxuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuYXJyYXkubGVmdCAsIGxvYy5wcmV2aWV3LmFycmF5LmJvdHRvbSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuYXJyYXkucmlnaHQgLSB3ICwgbG9jLnByZXZpZXcuYXJyYXkuYm90dG9tIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5hcnJheS5yaWdodCAtIHcgLCBsb2MucHJldmlldy5hcnJheS50b3AgXSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgKTtcblxuICAgICAgICB5ID0gbG9jLnByZXZpZXcuYXJyYXkudG9wO1xuICAgICAgICBoID0gc2l6ZS5wcmV2aWV3Lm1vZHVsZS5oO1xuXG4gICAgICAgIGQudGV4dChcbiAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuREMuY2VudGVyLCB5K2gvMitvZmZzZXQgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnQXJyYXkgREMnLFxuICAgICAgICAgICAgICAgICdTdHJpbmdzOiAnICsgcGFyc2VGbG9hdChzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MpLnRvRml4ZWQoKSxcbiAgICAgICAgICAgICAgICAnTW9kdWxlczogJyArIHBhcnNlRmxvYXQoc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZykudG9GaXhlZCgpLFxuICAgICAgICAgICAgICAgICdQbXA6ICcgKyBwYXJzZUZsb2F0KHN5c3RlbS5hcnJheS5wbXApLnRvRml4ZWQoKSxcbiAgICAgICAgICAgICAgICAnSW1wOiAnICsgcGFyc2VGbG9hdChzeXN0ZW0uYXJyYXkuaW1wKS50b0ZpeGVkKCksXG4gICAgICAgICAgICAgICAgJ1ZtcDogJyArIHBhcnNlRmxvYXQoc3lzdGVtLmFycmF5LnZtcCkudG9GaXhlZCgpLFxuICAgICAgICAgICAgICAgICdJc2M6ICcgKyBwYXJzZUZsb2F0KHN5c3RlbS5hcnJheS5pc2MpLnRvRml4ZWQoKSxcbiAgICAgICAgICAgICAgICAnVm9jOiAnICsgcGFyc2VGbG9hdChzeXN0ZW0uYXJyYXkudm9jKS50b0ZpeGVkKCksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ3ByZXZpZXcgdGV4dCdcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ0RDJykgKXtcbiAgICAgICAgZC5sYXllcigncHJldmlld19EQycpO1xuXG4gICAgICAgIC8veSA9IHk7XG4gICAgICAgIHkgPSBsb2MucHJldmlldy5hcnJheS50b3A7XG4gICAgICAgIHcgPSBzaXplLnByZXZpZXcubW9kdWxlLnc7XG4gICAgICAgIGggPSBzaXplLnByZXZpZXcubW9kdWxlLmg7XG5cbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LkRDLmxlZnQgLCB5IF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5EQy5yaWdodCwgeSBdLFxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbbG9jLnByZXZpZXcuREMuY2VudGVyLHldLFxuICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAncHJldmlld19EQ19ib3gnXG4gICAgICAgICk7XG5cbiAgICB9XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ2ludmVydGVyJykgKXtcblxuICAgICAgICBkLmxheWVyKCdwcmV2aWV3X2ludmVydGVyJyk7XG5cbiAgICAgICAgeSA9IHk7XG4gICAgICAgIHcgPSBzaXplLnByZXZpZXcuaW52ZXJ0ZXIudztcbiAgICAgICAgaCA9IHNpemUucHJldmlldy5pbnZlcnRlci5oO1xuXG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFtsb2MucHJldmlldy5pbnZlcnRlci5jZW50ZXIseV0sXG4gICAgICAgICAgICBbdyxoXSxcbiAgICAgICAgICAgICdwcmV2aWV3X2ludmVydGVyX2JveCdcbiAgICAgICAgKTtcbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgW2xvYy5wcmV2aWV3LmludmVydGVyLmNlbnRlcix5K2gvMitvZmZzZXRdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdJbnZlcnRlcicsXG4gICAgICAgICAgICAgICAgc3lzdGVtLmludmVydGVyLm1ha2UsXG4gICAgICAgICAgICAgICAgc3lzdGVtLmludmVydGVyLm1vZGVsLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwcmV2aWV3IHRleHQnXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdBQycpICl7XG5cbiAgICAgICAgZC5sYXllcigncHJldmlld19BQycpO1xuXG5cbiAgICAgICAgeSA9IHk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5BQy5sZWZ0LCB5IF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5BQy5yaWdodCwgeSBdLFxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgICAgICB3ID0gc2l6ZS5wcmV2aWV3LkFDLnc7XG4gICAgICAgIGggPSBzaXplLnByZXZpZXcuQUMuaDtcbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW2xvYy5wcmV2aWV3LkFDLmNlbnRlcix5XSxcbiAgICAgICAgICAgIFt3LGhdLFxuICAgICAgICAgICAgJ3ByZXZpZXdfQUNfYm94J1xuICAgICAgICApO1xuICAgICAgICB3ID0gc2l6ZS5wcmV2aWV3LmxvYWRjZW50ZXIudztcbiAgICAgICAgaCA9IHNpemUucHJldmlldy5sb2FkY2VudGVyLmg7XG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuQUMucmlnaHQtdy8yLCB5K2gvNCBdLFxuICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAncHJldmlld19BQ19ib3gnXG4gICAgICAgICk7XG5cbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgW2xvYy5wcmV2aWV3LkFDLmNlbnRlcix5K2gvMitvZmZzZXRdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdBQycsXG5cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAncHJldmlldyB0ZXh0J1xuICAgICAgICApO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xudmFyIG1rX2JvcmRlciA9IHJlcXVpcmUoJy4vbWtfYm9yZGVyJyk7XG52YXIgZiA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zJyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHByZXZpZXcgMlwiKTtcblxuICAgIHZhciBkID0gbWtfZHJhd2luZygpO1xuXG4gICAgY29uc29sZS5sb2coZi5zZWN0aW9uX2RlZmluZWQoJ3Jvb2YnKSk7XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ3Jvb2YnKSApe1xuXG4gICAgICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgICAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG4gICAgICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5cbiAgICAgICAgdmFyIHgsIHksIGgsIHcsIHNlY3Rpb25feCwgc2VjdGlvbl95LCBsZW5ndGhfcCwgc2NhbGU7XG5cbiAgICAgICAgdmFyIHNsb3BlID0gc3lzdGVtLnJvb2Yuc2xvcGUuc3BsaXQoJzonKVswXTtcbiAgICAgICAgdmFyIGFuZ2xlX3JhZCA9IE1hdGguYXRhbiggTnVtYmVyKHNsb3BlKSAvMTIgKTtcbiAgICAgICAgLy9hbmdsZV9yYWQgPSBhbmdsZSAqIChNYXRoLlBJLzE4MCk7XG5cblxuICAgICAgICBsZW5ndGhfcCA9IHN5c3RlbS5yb29mLmxlbmd0aCAqIE1hdGguY29zKGFuZ2xlX3JhZCk7XG4gICAgICAgIHN5c3RlbS5yb29mLmhlaWdodCA9IHN5c3RlbS5yb29mLmxlbmd0aCAqIE1hdGguc2luKGFuZ2xlX3JhZCk7XG5cbiAgICAgICAgdmFyIHJvb2ZfcmF0aW8gPSBzeXN0ZW0ucm9vZi5sZW5ndGggLyBzeXN0ZW0ucm9vZi53aWR0aDtcbiAgICAgICAgdmFyIHJvb2ZfcGxhbl9yYXRpbyA9IGxlbmd0aF9wIC8gc3lzdGVtLnJvb2Yud2lkdGg7XG5cblxuICAgICAgICBpZiggc3lzdGVtLnJvb2YudHlwZSA9PT0gXCJHYWJsZVwiKXtcblxuXG4gICAgICAgICAgICAvLy8vLy8vXG4gICAgICAgICAgICAvLyBSb29kIHBsYW4gdmlld1xuICAgICAgICAgICAgdmFyIHBsYW5feCA9IDMwO1xuICAgICAgICAgICAgdmFyIHBsYW5feSA9IDMwO1xuXG4gICAgICAgICAgICB2YXIgcGxhbl93LCBwbGFuX2g7XG4gICAgICAgICAgICBpZiggbGVuZ3RoX3AqMiA+IHN5c3RlbS5yb29mLndpZHRoICl7XG4gICAgICAgICAgICAgICAgc2NhbGUgPSAyNTAvKGxlbmd0aF9wKjIpO1xuICAgICAgICAgICAgICAgIHBsYW5fdyA9IChsZW5ndGhfcCoyKSAqIHNjYWxlO1xuICAgICAgICAgICAgICAgIHBsYW5faCA9IHBsYW5fdyAvIChsZW5ndGhfcCoyIC8gc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDQwMC8oc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgICAgIHBsYW5faCA9IHN5c3RlbS5yb29mLndpZHRoICogc2NhbGU7XG4gICAgICAgICAgICAgICAgcGxhbl93ID0gcGxhbl9oICogKGxlbmd0aF9wKjIgLyBzeXN0ZW0ucm9vZi53aWR0aCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGQucmVjdChcbiAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3krcGxhbl9oLzJdLFxuICAgICAgICAgICAgICAgIFtwbGFuX3csIHBsYW5faF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZC5wb2x5KFtcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCAgICAgICAsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feStwbGFuX2hdLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94LCAgICAgICAgcGxhbl95K3BsYW5faF0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3ggICAgICAgLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfcG9seV91bnNlbGVjdGVkXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnBvbHkoW1xuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yICAgICAgICwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMitwbGFuX3cvMiwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMitwbGFuX3cvMiwgcGxhbl95K3BsYW5faF0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsICAgICAgICBwbGFuX3krcGxhbl9oXSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiAgICAgICAsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3NlbGVjdGVkXCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feStwbGFuX2hdXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbcGxhbl94LTIwLCBwbGFuX3krcGxhbl9oLzJdLFxuICAgICAgICAgICAgICAgIHN5c3RlbS5yb29mLmxlbmd0aC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93KzIwLCBwbGFuX3krcGxhbl9oLzJdLFxuICAgICAgICAgICAgICAgIHN5c3RlbS5yb29mLndpZHRoLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG5cblxuXG5cbiAgICAgICAgICAgIC8vLy8vLy8vXG4gICAgICAgICAgICAvLyByb29mIGNyb3NzZWN0aW9uXG5cbiAgICAgICAgICAgIHZhciBjc194ID0gMzA7XG4gICAgICAgICAgICB2YXIgY3NfeSA9IDMwK3BsYW5faCs1MDtcbiAgICAgICAgICAgIHZhciBjc19oID0gc3lzdGVtLnJvb2YuaGVpZ2h0ICogc2NhbGU7XG4gICAgICAgICAgICB2YXIgY3NfdyA9IHBsYW5fdy8yO1xuXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3ldLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3krY3NfaF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3csICAgY3NfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3cqMiwgY3NfeStjc19oXSxcbiAgICAgICAgICAgICAgICAgICAgW2NzX3gsICAgICAgICBjc195K2NzX2hdLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3ldLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbY3NfeCtjc193LTE1LCBjc195K2NzX2gqMi8zXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi5oZWlnaHQgKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbY3NfeCtjc193KjEuNSsyMCwgY3NfeStjc19oLzNdLFxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHN5c3RlbS5yb29mLmxlbmd0aCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG5cblxuICAgICAgICAgICAgLy8vLy8vXG4gICAgICAgICAgICAvLyByb29mIGRldGFpbFxuXG4gICAgICAgICAgICB2YXIgZGV0YWlsX3ggPSAzMCs0NTA7XG4gICAgICAgICAgICB2YXIgZGV0YWlsX3kgPSAzMDtcblxuICAgICAgICAgICAgaWYoIE51bWJlcihzeXN0ZW0ucm9vZi53aWR0aCkgPj0gTnVtYmVyKHN5c3RlbS5yb29mLmxlbmd0aCkgKXtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDQ1MC8oc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDQ1MC8oc3lzdGVtLnJvb2YubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkZXRhaWxfdyA9IHN5c3RlbS5yb29mLndpZHRoICogc2NhbGU7XG4gICAgICAgICAgICB2YXIgZGV0YWlsX2ggPSBzeXN0ZW0ucm9vZi5sZW5ndGggKiBzY2FsZTtcblxuICAgICAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy8yLCBkZXRhaWxfeStkZXRhaWxfaC8yXSxcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3csIGRldGFpbF9oXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3NlbGVjdGVkX2ZyYW1lZFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB2YXIgYSA9IDM7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0X2EgPSBhICogc2NhbGU7XG5cbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCwgICBkZXRhaWxfeStvZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdywgICBkZXRhaWxfeStvZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCwgICAgICAgICAgZGV0YWlsX3krZGV0YWlsX2gtb2Zmc2V0X2FdLFxuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3csIGRldGFpbF95K2RldGFpbF9oLW9mZnNldF9hXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K29mZnNldF9hLCBkZXRhaWxfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtvZmZzZXRfYSwgZGV0YWlsX3krZGV0YWlsX2hdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3ctb2Zmc2V0X2EsIGRldGFpbF95XSxcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LW9mZnNldF9hLCBkZXRhaWxfeStkZXRhaWxfaF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeC00MCwgZGV0YWlsX3krZGV0YWlsX2gvMl0sXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggc3lzdGVtLnJvb2YubGVuZ3RoICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LzIsIGRldGFpbF95K2RldGFpbF9oKzQwXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi53aWR0aCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94KyAob2Zmc2V0X2EpLzIsIGRldGFpbF95K2RldGFpbF9oKzE1XSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LShvZmZzZXRfYSkvMiwgZGV0YWlsX3krZGV0YWlsX2grMTVdLFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3gtMTUsIGRldGFpbF95K2RldGFpbF9oLShvZmZzZXRfYSkvMl0sXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeC0xNSwgZGV0YWlsX3krKG9mZnNldF9hKS8yXSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG5cblxuXG5cblxuICAgICAgICAgICAgLy8vLy8vXG4gICAgICAgICAgICAvLyBNb2R1bGUgb3B0aW9uc1xuICAgICAgICAgICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdtb2R1bGUnKSAmJiBmLnNlY3Rpb25fZGVmaW5lZCgnYXJyYXknKSl7XG4gICAgICAgICAgICAgICAgdmFyIHIsYztcblxuICAgICAgICAgICAgICAgIHZhciByb29mX2xlbmd0aF9hdmFpbCA9IHN5c3RlbS5yb29mLmxlbmd0aCAtIChhKjIpO1xuICAgICAgICAgICAgICAgIHZhciByb29mX3dpZHRoX2F2YWlsID0gc3lzdGVtLnJvb2Yud2lkdGggLSAoYSoyKTtcblxuICAgICAgICAgICAgICAgIHZhciByb3dfc3BhY2luZztcbiAgICAgICAgICAgICAgICBpZiggc3lzdGVtLm1vZHVsZS5vcmllbnRhdGlvbiA9PT0gJ1BvcnRyYWl0JyApe1xuICAgICAgICAgICAgICAgICAgICByb3dfc3BhY2luZyA9IE51bWJlcihzeXN0ZW0ubW9kdWxlLmxlbmd0aCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBjb2xfc3BhY2luZyA9IE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV93ID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSAgKS8xMjtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlX2ggPSAoTnVtYmVyKHN5c3RlbS5tb2R1bGUubGVuZ3RoKSApLzEyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd19zcGFjaW5nID0gTnVtYmVyKHN5c3RlbS5tb2R1bGUud2lkdGgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgY29sX3NwYWNpbmcgPSBOdW1iZXIoc3lzdGVtLm1vZHVsZS5sZW5ndGgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlX3cgPSAoTnVtYmVyKHN5c3RlbS5tb2R1bGUubGVuZ3RoKSkvMTI7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV9oID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSApLzEyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJvd19zcGFjaW5nID0gcm93X3NwYWNpbmcvMTI7IC8vbW9kdWxlIGRpbWVudGlvbnMgYXJlIGluIGluY2hlc1xuICAgICAgICAgICAgICAgIGNvbF9zcGFjaW5nID0gY29sX3NwYWNpbmcvMTI7IC8vbW9kdWxlIGRpbWVudGlvbnMgYXJlIGluIGluY2hlc1xuXG4gICAgICAgICAgICAgICAgdmFyIG51bV9yb3dzID0gTWF0aC5mbG9vcihyb29mX2xlbmd0aF9hdmFpbC9yb3dfc3BhY2luZyk7XG4gICAgICAgICAgICAgICAgdmFyIG51bV9jb2xzID0gTWF0aC5mbG9vcihyb29mX3dpZHRoX2F2YWlsL2NvbF9zcGFjaW5nKTtcblxuICAgICAgICAgICAgICAgIC8vc2VsZWN0ZWQgbW9kdWxlc1xuXG4gICAgICAgICAgICAgICAgaWYoIG51bV9jb2xzICE9PSBnLnRlbXAubnVtX2NvbHMgfHwgbnVtX3Jvd3MgIT09IGcudGVtcC5udW1fcm93cyApe1xuICAgICAgICAgICAgICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlcyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yKCByPTE7IHI8PW51bV9yb3dzOyByKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciggYz0xOyBjPD1udW1fY29sczsgYysrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICBnLnRlbXAubnVtX2NvbHMgPSBudW1fY29scztcbiAgICAgICAgICAgICAgICAgICAgZy50ZW1wLm51bV9yb3dzID0gbnVtX3Jvd3M7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB4ID0gZGV0YWlsX3ggKyBvZmZzZXRfYTsgLy9jb3JuZXIgb2YgdXNhYmxlIHNwYWNlXG4gICAgICAgICAgICAgICAgeSA9IGRldGFpbF95ICsgb2Zmc2V0X2E7XG4gICAgICAgICAgICAgICAgeCArPSAoIHJvb2Zfd2lkdGhfYXZhaWwgLSAoY29sX3NwYWNpbmcqbnVtX2NvbHMpKS8yICpzY2FsZTsgLy8gY2VudGVyIGFycmF5IG9uIHJvb2ZcbiAgICAgICAgICAgICAgICB5ICs9ICggcm9vZl9sZW5ndGhfYXZhaWwgLSAocm93X3NwYWNpbmcqbnVtX3Jvd3MpKS8yICpzY2FsZTtcbiAgICAgICAgICAgICAgICBtb2R1bGVfdyA9IG1vZHVsZV93ICogc2NhbGU7XG4gICAgICAgICAgICAgICAgbW9kdWxlX2ggPSBtb2R1bGVfaCAqIHNjYWxlO1xuXG5cblxuICAgICAgICAgICAgICAgIGZvciggcj0xOyByPD1udW1fcm93czsgcisrKXtcblxuICAgICAgICAgICAgICAgICAgICBmb3IoIGM9MTsgYzw9bnVtX2NvbHM7IGMrKyl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXllcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSApIGxheWVyID0gJ3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBsYXllciA9ICdwcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZV94ID0gKGMtMSkgKiBjb2xfc3BhY2luZyAqIHNjYWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlX3kgPSAoci0xKSAqIHJvd19zcGFjaW5nICogc2NhbGU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGQucmVjdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbeCttb2R1bGVfeCttb2R1bGVfdy8yLCB5K21vZHVsZV95K21vZHVsZV9oLzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFttb2R1bGVfdywgbW9kdWxlX2hdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljazogXCJnLmYudG9nZ2xlX21vZHVsZSh0aGlzKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVfSUQ6ICAocikgKyAnLCcgKyAoYylcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LzIsIGRldGFpbF95K2RldGFpbF9oKzEwMF0sXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiU2VsZWN0ZWQgbW9kdWxlczogXCIgKyBwYXJzZUZsb2F0KCBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDYWxjdWxhdGVkIG1vZHVsZXM6IFwiICsgcGFyc2VGbG9hdCggZy5zeXN0ZW0uYXJyYXkubnVtYmVyX29mX21vZHVsZXMgKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHggPSBkZXRhaWxfeCArIDQ3NTtcbiAgICAgICAgICAgIHkgPSBkZXRhaWxfeSArIDEyMDtcblxuICAgICAgICAgICAgZC5ibG9jaygnbm9ydGggYXJyb3dfdXAnLCBbeCx5XSk7XG5cbiAgICAgICAgICAgIHggPSAxMjA7XG4gICAgICAgICAgICB5ID0gMTU7XG5cbiAgICAgICAgICAgIGQuYmxvY2soJ25vcnRoIGFycm93X2xlZnQnLCBbeCx5XSk7XG4vLyovXG4gICAgICAgIH1cblxuXG4gICAgICAgIC8qXG5cblxuXG5cbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4LCAgICB5XSxcbiAgICAgICAgICAgIFt4K2R4LCB5LWR5XSxcbiAgICAgICAgICAgIFt4K2R4LCB5XSxcbiAgICAgICAgICAgIFt4LCAgICB5XSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgKTtcblxuICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICBbeCtkeC8yLTEwLCB5LWR5LzItMjBdLFxuICAgICAgICAgICAgc3lzdGVtLnJvb2YuaGVpZ2h0LnRvU3RyaW5nKCksXG4gICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICApO1xuICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICBbeCtkeC8yKzUsIHktMTVdLFxuICAgICAgICAgICAgYW5nbGUudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICk7XG5cblxuICAgICAgICB4ID0geCtkeCsxMDA7XG4gICAgICAgIHkgPSB5O1xuXG5cbiAgICAgICAgLy8qL1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCIndXNlIHN0cmljdCc7XG4vL3ZhciBzZXR0aW5ncyA9IHJlcXVpcmUoJy4vc2V0dGluZ3MuanMnKTtcbi8vdmFyIHNuYXBzdmcgPSByZXF1aXJlKCdzbmFwc3ZnJyk7XG4vL2xvZyhzZXR0aW5ncyk7XG5cblxuXG52YXIgZGlzcGxheV9zdmcgPSBmdW5jdGlvbihkcmF3aW5nX3BhcnRzLCBzZXR0aW5ncyl7XG4gICAgLy9jb25zb2xlLmxvZygnZGlzcGxheWluZyBzdmcnKTtcbiAgICB2YXIgbGF5ZXJfYXR0ciA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubGF5ZXJfYXR0cjtcbiAgICB2YXIgZm9udHMgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmZvbnRzO1xuICAgIC8vY29uc29sZS5sb2coJ2RyYXdpbmdfcGFydHM6ICcsIGRyYXdpbmdfcGFydHMpO1xuICAgIC8vY29udGFpbmVyLmVtcHR5KClcblxuICAgIC8vdmFyIHN2Z19lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ1N2Z2pzU3ZnMTAwMCcpXG4gICAgdmFyIHN2Z19lbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3N2ZycpO1xuICAgIHN2Z19lbGVtLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCdzdmdfZHJhd2luZycpO1xuICAgIC8vc3ZnX2VsZW0uc2V0QXR0cmlidXRlKCd3aWR0aCcsIHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS5kcmF3aW5nLncpO1xuICAgIC8vc3ZnX2VsZW0uc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy5oKTtcbiAgICB2YXIgdmlld19ib3ggPSAnMCAwICcgK1xuICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy53ICsgJyAnICtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcuaCArICcgJztcbiAgICBzdmdfZWxlbS5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCB2aWV3X2JveCk7XG4gICAgLy92YXIgc3ZnID0gc25hcHN2ZyhzdmdfZWxlbSkuc2l6ZShzaXplLmRyYXdpbmcudywgc2l6ZS5kcmF3aW5nLmgpO1xuICAgIC8vdmFyIHN2ZyA9IHNuYXBzdmcoJyNzdmdfZHJhd2luZycpO1xuXG4gICAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgZHJhd2luZyBjb250ZW50cywgY2FsbCB0aGUgZnVuY3Rpb24gYmVsb3cuXG4gICAgZHJhd2luZ19wYXJ0cy5mb3JFYWNoKCBmdW5jdGlvbihlbGVtLGlkKSB7XG4gICAgICAgIHNob3dfZWxlbV9hcnJheShlbGVtKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHNob3dfZWxlbV9hcnJheShlbGVtLCBvZmZzZXQpe1xuICAgICAgICBvZmZzZXQgPSBvZmZzZXQgfHwge3g6MCx5OjB9O1xuICAgICAgICB2YXIgeCx5LGF0dHJfbmFtZTtcbiAgICAgICAgaWYoIHR5cGVvZiBlbGVtLnggIT09ICd1bmRlZmluZWQnICkgeyB4ID0gZWxlbS54ICsgb2Zmc2V0Lng7IH1cbiAgICAgICAgaWYoIHR5cGVvZiBlbGVtLnkgIT09ICd1bmRlZmluZWQnICkgeyB5ID0gZWxlbS55ICsgb2Zmc2V0Lnk7IH1cblxuICAgICAgICB2YXIgYXR0cnMgPSBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV07XG4gICAgICAgIGlmKCBlbGVtLmF0dHJzICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gZWxlbS5hdHRycyApe1xuICAgICAgICAgICAgICAgIGF0dHJzW2F0dHJfbmFtZV0gPSBlbGVtLmF0dHJzW2F0dHJfbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiggZWxlbS50eXBlID09PSAncmVjdCcpIHtcbiAgICAgICAgICAgIC8vc3ZnLnJlY3QoIGVsZW0udywgZWxlbS5oICkubW92ZSggeC1lbGVtLncvMiwgeS1lbGVtLmgvMiApLmF0dHIoIGxheWVyX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZWxlbTonLCBlbGVtICk7XG4gICAgICAgICAgICAvL2lmKCBpc05hTihlbGVtLncpICkge1xuICAgICAgICAgICAgLy8gICAgY29uc29sZS5sb2coJ2Vycm9yOiBlbGVtIG5vdCBmdWxseSBkZWZpbmVkJywgZWxlbSlcbiAgICAgICAgICAgIC8vICAgIGVsZW0udyA9IDEwO1xuICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAvL2lmKCBpc05hTihlbGVtLmgpICkge1xuICAgICAgICAgICAgLy8gICAgY29uc29sZS5sb2coJ2Vycm9yOiBlbGVtIG5vdCBmdWxseSBkZWZpbmVkJywgZWxlbSlcbiAgICAgICAgICAgIC8vICAgIGVsZW0uaCA9IDEwO1xuICAgICAgICAgICAgLy99XG4gICAgICAgICAgICB2YXIgciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdyZWN0Jyk7XG4gICAgICAgICAgICByLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBlbGVtLncpO1xuICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGVsZW0uaCk7XG4gICAgICAgICAgICByLnNldEF0dHJpYnV0ZSgneCcsIHgtZWxlbS53LzIpO1xuICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoJ3knLCB5LWVsZW0uaC8yKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZWxlbS5sYXllcl9uYW1lKTtcbiAgICAgICAgICAgIGZvciggYXR0cl9uYW1lIGluIGF0dHJzICl7XG4gICAgICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoYXR0cl9uYW1lLCBhdHRyc1thdHRyX25hbWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN2Z19lbGVtLmFwcGVuZENoaWxkKHIpO1xuICAgICAgICB9IGVsc2UgaWYoIGVsZW0udHlwZSA9PT0gJ2xpbmUnKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnRzMiA9IFtdO1xuICAgICAgICAgICAgZWxlbS5wb2ludHMuZm9yRWFjaCggZnVuY3Rpb24ocG9pbnQpe1xuICAgICAgICAgICAgICAgIGlmKCAhIGlzTmFOKHBvaW50WzBdKSAmJiAhIGlzTmFOKHBvaW50WzFdKSApe1xuICAgICAgICAgICAgICAgICAgICBwb2ludHMyLnB1c2goWyBwb2ludFswXStvZmZzZXQueCwgcG9pbnRbMV0rb2Zmc2V0LnkgXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yOiBlbGVtIG5vdCBmdWxseSBkZWZpbmVkJywgZWxlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL3N2Zy5wb2x5bGluZSggcG9pbnRzMiApLmF0dHIoIGxheWVyX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApO1xuXG4gICAgICAgICAgICB2YXIgbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdwb2x5bGluZScpO1xuICAgICAgICAgICAgbC5zZXRBdHRyaWJ1dGUoICdwb2ludHMnLCBwb2ludHMyLmpvaW4oJyAnKSApO1xuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gYXR0cnMgKXtcbiAgICAgICAgICAgICAgICBsLnNldEF0dHJpYnV0ZShhdHRyX25hbWUsIGF0dHJzW2F0dHJfbmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3ZnX2VsZW0uYXBwZW5kQ2hpbGQobCk7XG4gICAgICAgIH0gZWxzZSBpZiggZWxlbS50eXBlID09PSAncG9seScpIHtcbiAgICAgICAgICAgIHZhciBwb2ludHMyID0gW107XG4gICAgICAgICAgICBlbGVtLnBvaW50cy5mb3JFYWNoKCBmdW5jdGlvbihwb2ludCl7XG4gICAgICAgICAgICAgICAgaWYoICEgaXNOYU4ocG9pbnRbMF0pICYmICEgaXNOYU4ocG9pbnRbMV0pICl7XG4gICAgICAgICAgICAgICAgICAgIHBvaW50czIucHVzaChbIHBvaW50WzBdK29mZnNldC54LCBwb2ludFsxXStvZmZzZXQueSBdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3I6IGVsZW0gbm90IGZ1bGx5IGRlZmluZWQnLCBlbGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vc3ZnLnBvbHlsaW5lKCBwb2ludHMyICkuYXR0ciggbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdICk7XG5cbiAgICAgICAgICAgIHZhciBsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3BvbHlsaW5lJyk7XG4gICAgICAgICAgICBsLnNldEF0dHJpYnV0ZSggJ3BvaW50cycsIHBvaW50czIuam9pbignICcpICk7XG4gICAgICAgICAgICBmb3IoIGF0dHJfbmFtZSBpbiBhdHRycyApe1xuICAgICAgICAgICAgICAgIGwuc2V0QXR0cmlidXRlKGF0dHJfbmFtZSwgYXR0cnNbYXR0cl9uYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdmdfZWxlbS5hcHBlbmRDaGlsZChsKTtcbiAgICAgICAgfSBlbHNlIGlmKCBlbGVtLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICAgICAgLy92YXIgdCA9IHN2Zy50ZXh0KCBlbGVtLnN0cmluZ3MgKS5tb3ZlKCBlbGVtLnBvaW50c1swXVswXSwgZWxlbS5wb2ludHNbMF1bMV0gKS5hdHRyKCBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV0gKVxuICAgICAgICAgICAgdmFyIGZvbnQ7XG4gICAgICAgICAgICBpZiggZWxlbS5mb250ICl7XG4gICAgICAgICAgICAgICAgZm9udCA9IGZvbnRzW2VsZW0uZm9udF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvbnQgPSBmb250c1thdHRycy5mb250XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3RleHQnKTtcbiAgICAgICAgICAgIGlmKGVsZW0ucm90YXRlZCl7XG4gICAgICAgICAgICAgICAgLy90LnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywgXCJyb3RhdGUoXCIgKyBlbGVtLnJvdGF0ZWQgKyBcIiBcIiArIHggKyBcIiBcIiArIHkgKyBcIilcIiApO1xuICAgICAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCBcInJvdGF0ZShcIiArIGVsZW0ucm90YXRlZCArIFwiIFwiICsgeCArIFwiIFwiICsgeSArIFwiKVwiICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vaWYoIGZvbnRbJ3RleHQtYW5jaG9yJ10gPT09ICdtaWRkbGUnICkgeSArPSBmb250Wydmb250LXNpemUnXSoxLzM7XG4gICAgICAgICAgICAgICAgeSArPSBmb250Wydmb250LXNpemUnXSoxLzM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZHkgPSBmb250Wydmb250LXNpemUnXSoxLjU7XG4gICAgICAgICAgICB0LnNldEF0dHJpYnV0ZSgneCcsIHgpO1xuICAgICAgICAgICAgLy90LnNldEF0dHJpYnV0ZSgneScsIHkgKyBmb250Wydmb250LXNpemUnXS8yICk7XG4gICAgICAgICAgICB0LnNldEF0dHJpYnV0ZSgneScsIHktZHkgKTtcblxuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gYXR0cnMgKXtcbiAgICAgICAgICAgICAgICBpZiggYXR0cl9uYW1lID09PSAnc3Ryb2tlJyApIHtcbiAgICAgICAgICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoICdmaWxsJywgYXR0cnNbYXR0cl9uYW1lXSApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiggYXR0cl9uYW1lID09PSAnZmlsbCcgKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vdC5zZXRBdHRyaWJ1dGUoICdzdHJva2UnLCAnbm9uZScgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0LnNldEF0dHJpYnV0ZSggYXR0cl9uYW1lLCBhdHRyc1thdHRyX25hbWVdICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IoIGF0dHJfbmFtZSBpbiBmb250ICl7XG4gICAgICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoIGF0dHJfbmFtZSwgZm9udFthdHRyX25hbWVdICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IoIGF0dHJfbmFtZSBpbiBlbGVtLnN0cmluZ3MgKXtcbiAgICAgICAgICAgICAgICB2YXIgdHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAndHNwYW4nKTtcbiAgICAgICAgICAgICAgICB0c3Bhbi5zZXRBdHRyaWJ1dGUoJ2R5JywgZHkgKTtcbiAgICAgICAgICAgICAgICB0c3Bhbi5zZXRBdHRyaWJ1dGUoJ3gnLCB4KTtcbiAgICAgICAgICAgICAgICB0c3Bhbi5pbm5lckhUTUwgPSBlbGVtLnN0cmluZ3NbYXR0cl9uYW1lXTtcbiAgICAgICAgICAgICAgICB0LmFwcGVuZENoaWxkKHRzcGFuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN2Z19lbGVtLmFwcGVuZENoaWxkKHQpO1xuICAgICAgICB9IGVsc2UgaWYoIGVsZW0udHlwZSA9PT0gJ2NpcmMnKSB7XG4gICAgICAgICAgICB2YXIgYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdlbGxpcHNlJyk7XG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZSgncngnLCBlbGVtLmQvMik7XG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZSgncnknLCBlbGVtLmQvMik7XG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZSgnY3gnLCB4KTtcbiAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKCdjeScsIHkpO1xuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gYXR0cnMgKXtcbiAgICAgICAgICAgICAgICBjLnNldEF0dHJpYnV0ZShhdHRyX25hbWUsIGF0dHJzW2F0dHJfbmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3ZnX2VsZW0uYXBwZW5kQ2hpbGQoYyk7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgYy5hdHRyaWJ1dGVzKCBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV0gKVxuICAgICAgICAgICAgYy5hdHRyaWJ1dGVzKHtcbiAgICAgICAgICAgICAgICByeDogNSxcbiAgICAgICAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgIHJ5OiA1LFxuICAgICAgICAgICAgICAgIGN4OiBlbGVtLnBvaW50c1swXVswXS1lbGVtLmQvMixcbiAgICAgICAgICAgICAgICBjeTogZWxlbS5wb2ludHNbMF1bMV0tZWxlbS5kLzJcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB2YXIgYzIgPSBzdmcuZWxsaXBzZSggZWxlbS5yLCBlbGVtLnIgKVxuICAgICAgICAgICAgYzIubW92ZSggZWxlbS5wb2ludHNbMF1bMF0tZWxlbS5kLzIsIGVsZW0ucG9pbnRzWzBdWzFdLWVsZW0uZC8yIClcbiAgICAgICAgICAgIGMyLmF0dHIoe3J4OjUsIHJ5OjV9KVxuICAgICAgICAgICAgYzIuYXR0ciggbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdIClcbiAgICAgICAgICAgICovXG4gICAgICAgIH0gZWxzZSBpZihlbGVtLnR5cGUgPT09ICdibG9jaycpIHtcbiAgICAgICAgICAgIC8vIGlmIGl0IGlzIGEgYmxvY2ssIHJ1biB0aGlzIGZ1bmN0aW9uIHRocm91Z2ggZWFjaCBlbGVtZW50LlxuICAgICAgICAgICAgZWxlbS5kcmF3aW5nX3BhcnRzLmZvckVhY2goIGZ1bmN0aW9uKGJsb2NrX2VsZW0saWQpe1xuICAgICAgICAgICAgICAgIHNob3dfZWxlbV9hcnJheShibG9ja19lbGVtLCB7eDp4LCB5Onl9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdmdfZWxlbTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBkaXNwbGF5X3N2ZztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIGYgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucycpO1xudmFyIGsgPSByZXF1aXJlKCcuLi9saWIvay9rLmpzJyk7XG5cbnZhciBpO1xuLy92YXIgc2V0dGluZ3NDYWxjdWxhdGVkID0gcmVxdWlyZSgnLi9zZXR0aW5nc0NhbGN1bGF0ZWQuanMnKTtcblxuLy8gTG9hZCAndXNlcicgZGVmaW5lZCBzZXR0aW5nc1xuLy92YXIgbWtfc2V0dGluZ3MgPSByZXF1aXJlKCcuLi9kYXRhL3NldHRpbmdzLmpzb24uanMnKTtcbi8vZi5ta19zZXR0aW5ncyA9IG1rX3NldHRpbmdzO1xuXG52YXIgc2V0dGluZ3MgPSB7fTtcblxuc2V0dGluZ3MudGVtcCA9IHt9O1xuXG5zZXR0aW5ncy5jb25maWdfb3B0aW9ucyA9IHt9O1xuc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuTkVDX3RhYmxlcyA9IHJlcXVpcmUoJy4uL2RhdGEvdGFibGVzLmpzb24nKTtcbi8vY29uc29sZS5sb2coc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuTkVDX3RhYmxlcyk7XG5cbnNldHRpbmdzLnN0YXRlID0ge307XG5zZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQgPSBmYWxzZTtcblxuc2V0dGluZ3MuaW4gPSB7fTtcblxuc2V0dGluZ3MuaW4ub3B0ID0ge307XG5zZXR0aW5ncy5pbi5vcHQuQUMgPSB7fTtcbnNldHRpbmdzLmluLm9wdC5BQy50eXBlcyA9IHt9O1xuc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzW1wiMTIwVlwiXSA9IFtcImdyb3VuZFwiLFwibmV1dHJhbFwiLFwiTDFcIl07XG5zZXR0aW5ncy5pbi5vcHQuQUMudHlwZXNbXCIyNDBWXCJdID0gW1wiZ3JvdW5kXCIsXCJuZXV0cmFsXCIsXCJMMVwiLFwiTDJcIl07XG5zZXR0aW5ncy5pbi5vcHQuQUMudHlwZXNbXCIyMDhWXCJdID0gW1wiZ3JvdW5kXCIsXCJuZXV0cmFsXCIsXCJMMVwiLFwiTDJcIl07XG5zZXR0aW5ncy5pbi5vcHQuQUMudHlwZXNbXCIyNzdWXCJdID0gW1wiZ3JvdW5kXCIsXCJuZXV0cmFsXCIsXCJMMVwiXTtcbnNldHRpbmdzLmluLm9wdC5BQy50eXBlc1tcIjQ4MFYgV3llXCJdID0gW1wiZ3JvdW5kXCIsXCJuZXV0cmFsXCIsXCJMMVwiLFwiTDJcIixcIkwzXCJdO1xuc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzW1wiNDgwViBEZWx0YVwiXSA9IFtcImdyb3VuZFwiLFwiTDFcIixcIkwyXCIsXCJMM1wiXTtcblxuc2V0dGluZ3MuaW5wdXRzID0ge307XG5zZXR0aW5ncy5pbnB1dHMucm9vZiA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLnJvb2Yud2lkdGggPSB7fTtcbnNldHRpbmdzLmlucHV0cy5yb29mLndpZHRoLm9wdGlvbnMgPSBbXTtcbi8vZm9yKCBpPTE1OyBpPD03MDsgaSs9NSApIHNldHRpbmdzLmlucHV0cy5yb29mLndpZHRoLm9wdGlvbnMucHVzaChpKTtcbnNldHRpbmdzLmlucHV0cy5yb29mLndpZHRoLnVuaXRzID0gJ2Z0Lic7XG5zZXR0aW5ncy5pbnB1dHMucm9vZi53aWR0aC5ub3RlID0gJ1RoaXMgdGhlIGZ1bGwgc2l6ZSBvZiB0aGUgcm9vZiwgcGVycGVuZGljdHVsYXIgdG8gdGhlIHNsb3BlLic7XG5zZXR0aW5ncy5pbnB1dHMucm9vZi53aWR0aC50eXBlID0gJ2lucHV0JztcbnNldHRpbmdzLmlucHV0cy5yb29mLmxlbmd0aCA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLnJvb2YubGVuZ3RoLm9wdGlvbnMgPSBbXTtcbi8vZm9yKCBpPTEwOyBpPD02MDsgaSs9NSApIHNldHRpbmdzLmlucHV0cy5yb29mLmxlbmd0aC5vcHRpb25zLnB1c2goaSk7XG5zZXR0aW5ncy5pbnB1dHMucm9vZi5sZW5ndGgudW5pdHMgPSAnZnQuJztcbnNldHRpbmdzLmlucHV0cy5yb29mLmxlbmd0aC5ub3RlID0gJ1RoaXMgdGhlIGZ1bGwgbGVuZ3RoIG9mIHRoZSByb29mLCBtZWFzdXJlZCBmcm9tIGxvdyB0byBoaWdoLic7XG5zZXR0aW5ncy5pbnB1dHMucm9vZi5sZW5ndGgudHlwZSA9ICdpbnB1dCc7XG5zZXR0aW5ncy5pbnB1dHMucm9vZi5zbG9wZSA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLnJvb2Yuc2xvcGUub3B0aW9ucyA9IFsnMToxMicsJzI6MTInLCczOjEyJywnNDoxMicsJzU6MTInLCc2OjEyJywnNzoxMicsJzg6MTInLCc5OjEyJywnMTA6MTInLCcxMToxMicsJzEyOjEyJ107XG5zZXR0aW5ncy5pbnB1dHMucm9vZi50eXBlID0ge307XG5zZXR0aW5ncy5pbnB1dHMucm9vZi50eXBlLm9wdGlvbnMgPSBbJ0dhYmxlJywnU2hlZCcsJ0hpcHBlZCddO1xuc2V0dGluZ3MuaW5wdXRzLm1vZHVsZSA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5tYWtlID0ge307XG4vL3NldHRpbmdzLmlucHV0cy5tb2R1bGUubWFrZS5vcHRpb25zID0gbnVsbDtcbnNldHRpbmdzLmlucHV0cy5tb2R1bGUubW9kZWwgPSB7fTtcbi8vc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5tb2RlbC5vcHRpb25zID0gbnVsbDtcbnNldHRpbmdzLmlucHV0cy5tb2R1bGUub3JpZW50YXRpb24gPSB7fTtcbnNldHRpbmdzLmlucHV0cy5tb2R1bGUub3JpZW50YXRpb24ub3B0aW9ucyA9IFsnUG9ydHJhaXQnLCdMYW5kc2NhcGUnXTtcbnNldHRpbmdzLmlucHV0cy5tb2R1bGUud2lkdGggPSB7fTtcbnNldHRpbmdzLmlucHV0cy5tb2R1bGUud2lkdGgub3B0aW9ucyA9IFsyMCwyNSwzMCwzNSw0MF07XG5zZXR0aW5ncy5pbnB1dHMubW9kdWxlLndpZHRoLnVuaXRzID0gJ2luLic7XG5zZXR0aW5ncy5pbnB1dHMubW9kdWxlLndpZHRoLm5vdGUgPSAnVGhpcyB0aGUgZnVsbCBmcmFtZSBzaXplIChvdXRlcikuJztcbnNldHRpbmdzLmlucHV0cy5tb2R1bGUud2lkdGgudHlwZSA9ICdpbnB1dCc7XG5zZXR0aW5ncy5pbnB1dHMubW9kdWxlLmxlbmd0aCA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5sZW5ndGgub3B0aW9ucyA9IFszMCwzNSw0MCw0NSw1MF07XG5zZXR0aW5ncy5pbnB1dHMubW9kdWxlLmxlbmd0aC51bml0cyA9ICdpbi4nO1xuc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5sZW5ndGgubm90ZSA9ICdUaGlzIHRoZSBmdWxsIGZyYW1lIHNpemUgKG91dGVyKS4nO1xuc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5sZW5ndGgudHlwZSA9ICdpbnB1dCc7XG5zZXR0aW5ncy5pbnB1dHMuYXJyYXkgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcub3B0aW9ucyA9IFsxLDIsMyw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxNywxOCwxOSwyMF07XG5zZXR0aW5ncy5pbnB1dHMuYXJyYXkubnVtX3N0cmluZ3MgPSB7fTtcbnNldHRpbmdzLmlucHV0cy5hcnJheS5udW1fc3RyaW5ncy5vcHRpb25zID0gWzEsMiwzLDQsNSw2XTtcbnNldHRpbmdzLmlucHV0cy5EQyA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLkRDLmhvbWVfcnVuX2xlbmd0aCA9IHt9O1xuLy9zZXR0aW5ncy5pbnB1dHMuREMuaG9tZV9ydW5fbGVuZ3RoLm9wdGlvbnMgPSBbMjUsNTAsNzUsMTAwLDEyNSwxNTBdO1xuc2V0dGluZ3MuaW5wdXRzLkRDLmhvbWVfcnVuX2xlbmd0aC50eXBlID0gJ2lucHV0JztcbnNldHRpbmdzLmlucHV0cy5pbnZlcnRlciA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLmludmVydGVyLm1ha2UgPSB7fTtcbi8vc2V0dGluZ3MuaW5wdXRzLmludmVydGVyLm1ha2Uub3B0aW9ucyA9IG51bGw7XG5zZXR0aW5ncy5pbnB1dHMuaW52ZXJ0ZXIubW9kZWwgPSB7fTtcbi8vc2V0dGluZ3MuaW5wdXRzLmludmVydGVyLm1vZGVsLm9wdGlvbnMgPSBudWxsO1xuc2V0dGluZ3MuaW5wdXRzLkFDID0ge307XG5zZXR0aW5ncy5pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlcyA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbJzI0MFYnXSA9IHt9O1xuc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbJzI0MFYnXSA9IFsnMjQwVicsJzEyMFYnXTtcbnNldHRpbmdzLmlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzWycyMDgvMTIwViddID0ge307XG5zZXR0aW5ncy5pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlc1snMjA4LzEyMFYnXSA9IFsnMjA4VicsJzEyMFYnXTtcbnNldHRpbmdzLmlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzWyc0ODAvMjc3ViddID0ge307XG5zZXR0aW5ncy5pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlc1snNDgwLzI3N1YnXSA9IFsnNDgwViBXeWUnLCc0ODBWIERlbHRhJywnMjc3ViddO1xuc2V0dGluZ3MuaW5wdXRzLkFDLnR5cGUgPSB7fTtcbi8vc2V0dGluZ3MuaW5wdXRzLkFDLnR5cGUub3B0aW9ucyA9IG51bGw7XG5zZXR0aW5ncy5pbnB1dHMuQUMuZGlzdGFuY2VfdG9fbG9hZGNlbnRlciA9IHt9O1xuLy9zZXR0aW5ncy5pbnB1dHMuQUMuZGlzdGFuY2VfdG9fbG9hZGNlbnRlci5vcHRpb25zID0gWzMsNSwxMCwxNSwyMCwzMF07XG5zZXR0aW5ncy5pbnB1dHMuQUMuZGlzdGFuY2VfdG9fbG9hZGNlbnRlci50eXBlID0gJ2lucHV0JztcblxuXG5cbi8vc2V0dGluZ3MuaW5wdXRzID0gc2V0dGluZ3MuaW5wdXRzOyAvLyBjb3B5IGlucHV0IHJlZmVyZW5jZSB3aXRoIG9wdGlvbnMgdG8gaW5wdXRzXG4vL3NldHRpbmdzLmlucHV0cyA9IGYuYmxhbmtfY29weShzZXR0aW5ncy5pbnB1dHMpOyAvLyBtYWtlIGlucHV0IHNlY3Rpb24gYmxhbmtcbi8vc2V0dGluZ3Muc3lzdGVtX2Zvcm11bGFzID0gc2V0dGluZ3Muc3lzdGVtOyAvLyBjb3B5IHN5c3RlbSByZWZlcmVuY2UgdG8gc3lzdGVtX2Zvcm11bGFzXG5zZXR0aW5ncy5zeXN0ZW0gPSBmLmJsYW5rX2NvcHkoc2V0dGluZ3MuaW5wdXRzKTsgLy8gbWFrZSBzeXN0ZW0gc2VjdGlvbiBibGFua1xuLy9mLm1lcmdlX29iamVjdHMoIHNldHRpbmdzLmlucHV0cywgc2V0dGluZ3Muc3lzdGVtICk7XG5cblxuLy8gbG9hZCBsYXllcnNcblxuc2V0dGluZ3MuZHJhd2luZyA9IHt9O1xuXG5zZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzID0ge307XG5zZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxheWVyX2F0dHIgPSByZXF1aXJlKCcuL3NldHRpbmdzX2xheWVycycpO1xuc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5mb250cyA9IHJlcXVpcmUoJy4vc2V0dGluZ3NfZm9udHMnKTtcblxuc2V0dGluZ3MuZHJhd2luZy5ibG9ja3MgPSB7fTtcblxuLy8gTG9hZCBkcmF3aW5nIHNwZWNpZmljIHNldHRpbmdzXG4vLyBUT0RPIEZpeCBzZXR0aW5nc19kcmF3aW5nIHdpdGggbmV3IHZhcmlhYmxlIGxvY2F0aW9uc1xudmFyIHNldHRpbmdzX2RyYXdpbmcgPSByZXF1aXJlKCcuL3NldHRpbmdzX2RyYXdpbmcnKTtcbnNldHRpbmdzID0gc2V0dGluZ3NfZHJhd2luZyhzZXR0aW5ncyk7XG5cbi8vc2V0dGluZ3Muc3RhdGVfYXBwLnZlcnNpb25fc3RyaW5nID0gdmVyc2lvbl9zdHJpbmc7XG5cbi8vc2V0dGluZ3MgPSBmLm51bGxUb09iamVjdChzZXR0aW5ncyk7XG5cbnNldHRpbmdzLnNlbGVjdF9yZWdpc3RyeSA9IFtdO1xuc2V0dGluZ3MudmFsdWVfcmVnaXN0cnkgPSBbXTtcblxuXG4vL3ZhciBjb25maWdfb3B0aW9ucyA9IHNldHRpbmdzLmNvbmZpZ19vcHRpb25zID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnMgfHwge307XG5cbnNldHRpbmdzLndlYnBhZ2UgPSB7fTtcbnNldHRpbmdzLndlYnBhZ2Uuc2VsZWN0aW9uc19tYW51YWxfdG9nZ2xlZCA9IHt9O1xuc2V0dGluZ3Mud2VicGFnZS5zZWN0aW9ucyA9IE9iamVjdC5rZXlzKHNldHRpbmdzLmlucHV0cyk7XG5cblxuc2V0dGluZ3Mud2VicGFnZS5zZWN0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbihzZWN0aW9uX25hbWUpe1xuICAgIHNldHRpbmdzLndlYnBhZ2Uuc2VsZWN0aW9uc19tYW51YWxfdG9nZ2xlZFtzZWN0aW9uX25hbWVdID0gZmFsc2U7XG59KTtcblxuc2V0dGluZ3Mud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzX3RvdGFsID0gMDtcbnNldHRpbmdzLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlcyA9IHt9O1xuXG5cblxuXG5zZXR0aW5ncy5jb21wb25lbnRzID0ge307XG5cblxuLypcbmZvciggdmFyIHNlY3Rpb25fbmFtZSBpbiBzZXR0aW5ncy5pbnB1dHMgKXtcbiAgICBmb3IoIHZhciBpbnB1dF9uYW1lIGluIHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdKXtcbiAgICAgICAgaWYoIHR5cGVvZiBzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSA9PT0gJ3N0cmluZycgKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdKVxuICAgICAgICAgICAgXCJvYmpfbmFtZXMoc2V0dHRpbmdzXCIgKyBzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSArIFwiKVwiO1xuICAgICAgICAgICAgLy8gZXZhbCBpcyBvbmx5IGJlaW5nIHVzZWQgb24gc3RyaW5ncyBkZWZpbmVkIGluIHRoZSBzZXR0aW5ncy5qc29uIGZpbGUgdGhhdCBpcyBidWlsdCBpbnRvIHRoZSBhcHBsaWNhdGlvblxuICAgICAgICAgICAgc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0gPSBldmFsKHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8vKi9cblxuXG4vKlxuc2V0dGluZ3Muc3RhdGUuc2VjdGlvbnMgPSB7XG4gICAgbW9kdWxlczoge30sXG4gICAgYXJyYXk6IHt9LFxuICAgIERDOiB7fSxcbiAgICBpbnZlcnRlcjoge30sXG4gICAgQUM6IHt9LFxufTtcbmNvbmZpZ19vcHRpb25zLnNlY3Rpb25fb3B0aW9ucyA9IG9ial9uYW1lcyhzZXR0aW5ncy5zdGF0ZS5zZWN0aW9ucyk7XG5zZXR0aW5ncy5zdGF0ZS5hY3RpdmVfc2VjdGlvbiA9ICdtb2R1bGVzJztcblxuY29uZmlnX29wdGlvbnMuQUNfbG9hZGNlbnRlcl90eXBlX29wdGlvbnMgPSBvYmpfbmFtZXMoIGNvbmZpZ19vcHRpb25zLkFDX2xvYWRjZW50ZXJfdHlwZXMgKTtcbmNvbmZpZ19vcHRpb25zLkFDX3R5cGVfb3B0aW9ucyA9IG9ial9uYW1lcyggY29uZmlnX29wdGlvbnMuQUNfdHlwZXMgKTtcblxuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzID0ge307XG5cbmNvbmZpZ19vcHRpb25zLnBhZ2Vfb3B0aW9ucyA9IFsnUGFnZSAxIG9mIDEnXTtcbnNldHRpbmdzLnN0YXRlLmFjdGl2ZV9wYWdlID0gY29uZmlnX29wdGlvbnMucGFnZV9vcHRpb25zWzBdO1xuXG5zeXN0ZW0uaW52ZXJ0ZXIgPSB7fTtcblxuXG5jb25maWdfb3B0aW9ucy5EQ19ob21lcnVuX2xlbmd0aHMgPSBjb25maWdfb3B0aW9ucy5EQ19ob21lcnVuX2xlbmd0aHMgfHwgWzI1LDUwLDc1LDEwMF07XG5jb25maWdfb3B0aW9ucy5EQ19ob21lcnVuX0FXR19vcHRpb25zID1cbiAgICBjb25maWdfb3B0aW9ucy5EQ19ob21lcnVuX0FXR19vcHRpb25zIHx8XG4gICAgb2JqX25hbWVzKCBjb25maWdfb3B0aW9ucy5ORUNfdGFibGVzW1wiQ2ggOSBUYWJsZSA4IENvbmR1Y3RvciBQcm9wZXJ0aWVzXCJdICk7XG4vLyovXG5cblxubW9kdWxlLmV4cG9ydHMgPSBzZXR0aW5ncztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBzZXR0aW5nc19kcmF3aW5nKHNldHRpbmdzKXtcblxuICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG4gICAgdmFyIHN0YXR1cyA9IHNldHRpbmdzLnN0YXR1cztcblxuICAgIC8vIERyYXdpbmcgc3BlY2lmaWNcbiAgICAvL3NldHRpbmdzLmRyYXdpbmcgPSBzZXR0aW5ncy5kcmF3aW5nIHx8IHt9O1xuXG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZSA9IHt9O1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxvYyA9IHt9O1xuXG5cbiAgICAvLyBzaXplc1xuICAgIHNpemUuZHJhd2luZyA9IHtcbiAgICAgICAgdzogMTAwMCxcbiAgICAgICAgaDogNzgwLFxuICAgICAgICBmcmFtZV9wYWRkaW5nOiA1LFxuICAgICAgICB0aXRsZWJveDogNTAsXG4gICAgfTtcblxuICAgIHNpemUubW9kdWxlID0ge307XG4gICAgc2l6ZS5tb2R1bGUuZnJhbWUgPSB7XG4gICAgICAgIHc6IDEwLFxuICAgICAgICBoOiAzMCxcbiAgICB9O1xuICAgIHNpemUubW9kdWxlLmxlYWQgPSBzaXplLm1vZHVsZS5mcmFtZS53KjIvMztcbiAgICBzaXplLm1vZHVsZS5oID0gc2l6ZS5tb2R1bGUuZnJhbWUuaCArIHNpemUubW9kdWxlLmxlYWQqMjtcbiAgICBzaXplLm1vZHVsZS53ID0gc2l6ZS5tb2R1bGUuZnJhbWUudztcblxuICAgIHNpemUud2lyZV9vZmZzZXQgPSB7XG4gICAgICAgIGJhc2U6IDcsXG4gICAgICAgIGdhcDogc2l6ZS5tb2R1bGUudyxcbiAgICB9O1xuICAgIHNpemUud2lyZV9vZmZzZXQubWluID0gc2l6ZS53aXJlX29mZnNldC5iYXNlICogMTtcblxuICAgIHNpemUuc3RyaW5nID0ge307XG4gICAgc2l6ZS5zdHJpbmcuZ2FwID0gc2l6ZS5tb2R1bGUuZnJhbWUudy80MjtcbiAgICBzaXplLnN0cmluZy5nYXBfbWlzc2luZyA9IHNpemUubW9kdWxlLmg7XG4gICAgc2l6ZS5zdHJpbmcudyA9IHNpemUubW9kdWxlLmZyYW1lLncgKiAyLjU7XG5cbiAgICBzaXplLnRlcm1pbmFsX2RpYW0gPSA1O1xuICAgIHNpemUuZnVzZSA9IHt9O1xuICAgIHNpemUuZnVzZS53ID0gMTU7XG4gICAgc2l6ZS5mdXNlLmggPSA0O1xuXG5cbiAgICAvLyBJbnZlcnRlclxuICAgIHNpemUuaW52ZXJ0ZXIgPSB7IHc6IDI1MCwgaDogMTUwIH07XG4gICAgc2l6ZS5pbnZlcnRlci50ZXh0X2dhcCA9IDE1O1xuICAgIHNpemUuaW52ZXJ0ZXIuc3ltYm9sX3cgPSA1MDtcbiAgICBzaXplLmludmVydGVyLnN5bWJvbF9oID0gMjU7XG5cbiAgICBsb2MuaW52ZXJ0ZXIgPSB7XG4gICAgICAgIHg6IHNpemUuZHJhd2luZy53LzIsXG4gICAgICAgIHk6IHNpemUuZHJhd2luZy5oLzMsXG4gICAgfTtcbiAgICBsb2MuaW52ZXJ0ZXIuYm90dG9tID0gbG9jLmludmVydGVyLnkgKyBzaXplLmludmVydGVyLmgvMjtcbiAgICBsb2MuaW52ZXJ0ZXIudG9wID0gbG9jLmludmVydGVyLnkgLSBzaXplLmludmVydGVyLmgvMjtcbiAgICBsb2MuaW52ZXJ0ZXIuYm90dG9tX3JpZ2h0ID0ge1xuICAgICAgICB4OiBsb2MuaW52ZXJ0ZXIueCArIHNpemUuaW52ZXJ0ZXIudy8yLFxuICAgICAgICB5OiBsb2MuaW52ZXJ0ZXIueSArIHNpemUuaW52ZXJ0ZXIuaC8yLFxuICAgIH07XG5cbiAgICAvLyBhcnJheVxuICAgIGxvYy5hcnJheSA9IHtcbiAgICAgICAgeDogbG9jLmludmVydGVyLnggLSAyMDAsXG4gICAgICAgIHVwcGVyOiBsb2MuaW52ZXJ0ZXIueSAtIDIwLFxuICAgIH07XG4gICAgLy9sb2MuYXJyYXkudXBwZXIgPSBsb2MuYXJyYXkueSAtIHNpemUuc3RyaW5nLmgvMjtcbiAgICBsb2MuYXJyYXkucmlnaHQgPSBsb2MuYXJyYXkueCAtIHNpemUubW9kdWxlLmZyYW1lLmgqMztcblxuXG5cblxuICAgIGxvYy5EQyA9IGxvYy5hcnJheTtcblxuICAgIC8vIERDIGpiXG4gICAgc2l6ZS5qYl9ib3ggPSB7XG4gICAgICAgIGg6IDE1MCxcbiAgICAgICAgdzogODAsXG4gICAgfTtcbiAgICBsb2MuamJfYm94ID0ge1xuICAgICAgICB4OiAzNTAsXG4gICAgICAgIHk6IDU1MCxcbiAgICB9O1xuXG4gICAgLy8gREMgZGljb25lY3RcbiAgICBzaXplLmRpc2Nib3ggPSB7XG4gICAgICAgIHc6IDE0MCxcbiAgICAgICAgaDogNTAsXG4gICAgfTtcbiAgICBsb2MuZGlzY2JveCA9IHtcbiAgICAgICAgeDogbG9jLmludmVydGVyLnggLSBzaXplLmludmVydGVyLncvMiArIHNpemUuZGlzY2JveC53LzIsXG4gICAgICAgIHk6IGxvYy5pbnZlcnRlci55ICsgc2l6ZS5pbnZlcnRlci5oLzIgKyBzaXplLmRpc2Nib3guaC8yICsgMTAsXG4gICAgfTtcblxuICAgIC8vIEFDIGRpY29uZWN0XG4gICAgc2l6ZS5BQ19kaXNjID0geyB3OiA4MCwgaDogMTI1IH07XG5cbiAgICBsb2MuQUNfZGlzYyA9IHtcbiAgICAgICAgeDogbG9jLmludmVydGVyLngrMjAwLFxuICAgICAgICB5OiBsb2MuaW52ZXJ0ZXIueSsyNTBcbiAgICB9O1xuICAgIGxvYy5BQ19kaXNjLmJvdHRvbSA9IGxvYy5BQ19kaXNjLnkgKyBzaXplLkFDX2Rpc2MuaC8yO1xuICAgIGxvYy5BQ19kaXNjLnRvcCA9IGxvYy5BQ19kaXNjLnkgLSBzaXplLkFDX2Rpc2MuaC8yO1xuICAgIGxvYy5BQ19kaXNjLmxlZnQgPSBsb2MuQUNfZGlzYy54IC0gc2l6ZS5BQ19kaXNjLncvMjtcbiAgICBsb2MuQUNfZGlzYy5zd2l0Y2hfdG9wID0gbG9jLkFDX2Rpc2MudG9wICsgMTU7XG4gICAgbG9jLkFDX2Rpc2Muc3dpdGNoX2JvdHRvbSA9IGxvYy5BQ19kaXNjLnN3aXRjaF90b3AgKyAzMDtcblxuXG4gICAgLy8gQUMgcGFuZWxcblxuICAgIGxvYy5BQ19sb2FkY2VudGVyID0ge1xuICAgICAgICB4OiBsb2MuaW52ZXJ0ZXIueCszNTAsXG4gICAgICAgIHk6IGxvYy5pbnZlcnRlci55KzEwMFxuICAgIH07XG4gICAgc2l6ZS5BQ19sb2FkY2VudGVyID0geyB3OiAxMjUsIGg6IDMwMCB9O1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLmxlZnQgPSBsb2MuQUNfbG9hZGNlbnRlci54IC0gc2l6ZS5BQ19sb2FkY2VudGVyLncvMjtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci50b3AgPSBsb2MuQUNfbG9hZGNlbnRlci55IC0gc2l6ZS5BQ19sb2FkY2VudGVyLmgvMjtcblxuXG4gICAgc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIgPSB7IHc6IDIwLCBoOiBzaXplLnRlcm1pbmFsX2RpYW0sIH07XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMgPSB7XG4gICAgICAgIGxlZnQ6IGxvYy5BQ19sb2FkY2VudGVyLnggLSAoIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyLncgKiAxLjEgKSxcbiAgICB9O1xuICAgIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VycyA9IHtcbiAgICAgICAgbnVtOiAyMCxcbiAgICAgICAgc3BhY2luZzogc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIuaCArIDEsXG4gICAgfTtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy50b3AgPSBsb2MuQUNfbG9hZGNlbnRlci50b3AgKyBzaXplLkFDX2xvYWRjZW50ZXIuaC81O1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLmJvdHRvbSA9IGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnRvcCArIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5zcGFjaW5nKnNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5udW07XG5cblxuICAgIHNpemUuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyID0geyB3OjUsIGg6NDAgfTtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyID0ge1xuICAgICAgICB4OiBsb2MuQUNfbG9hZGNlbnRlci5sZWZ0ICsgMjAsXG4gICAgICAgIHk6IGxvYy5BQ19sb2FkY2VudGVyLnkgKyBzaXplLkFDX2xvYWRjZW50ZXIuaCowLjNcbiAgICB9O1xuXG4gICAgc2l6ZS5BQ19sb2FkY2VudGVyLmdyb3VuZGJhciA9IHsgdzo0MCwgaDo1IH07XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyID0ge1xuICAgICAgICB4OiBsb2MuQUNfbG9hZGNlbnRlci54ICsgMTAsXG4gICAgICAgIHk6IGxvYy5BQ19sb2FkY2VudGVyLnkgKyBzaXplLkFDX2xvYWRjZW50ZXIuaCowLjQ1XG4gICAgfTtcblxuICAgIGxvYy5BQ19jb25kdWl0ID0ge1xuICAgICAgICB5OiBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy5ib3R0b20gLSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMuc3BhY2luZy8yLFxuICAgIH07XG5cblxuICAgIC8vIHdpcmUgdGFibGVcbiAgICBsb2Mud2lyZV90YWJsZSA9IHtcbiAgICAgICAgeDogc2l6ZS5kcmF3aW5nLncgLSBzaXplLmRyYXdpbmcudGl0bGVib3ggLSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyozIC0gMzI1LFxuICAgICAgICB5OiBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyozLFxuICAgIH07XG5cbiAgICAvLyB2b2x0YWdlIGRyb3AgdGFibGVcbiAgICBzaXplLnZvbHRfZHJvcF90YWJsZSA9IHt9O1xuICAgIHNpemUudm9sdF9kcm9wX3RhYmxlLncgPSAxNTA7XG4gICAgc2l6ZS52b2x0X2Ryb3BfdGFibGUuaCA9IDEwMDtcbiAgICBsb2Mudm9sdF9kcm9wX3RhYmxlID0ge307XG4gICAgbG9jLnZvbHRfZHJvcF90YWJsZS54ID0gc2l6ZS5kcmF3aW5nLncgLSBzaXplLnZvbHRfZHJvcF90YWJsZS53LzIgLSA5MDtcbiAgICBsb2Mudm9sdF9kcm9wX3RhYmxlLnkgPSBzaXplLmRyYXdpbmcuaCAtIHNpemUudm9sdF9kcm9wX3RhYmxlLmgvMiAtIDMwO1xuXG5cbiAgICAvLyB2b2x0YWdlIGRyb3AgdGFibGVcbiAgICBzaXplLmdlbmVyYWxfbm90ZXMgPSB7fTtcbiAgICBzaXplLmdlbmVyYWxfbm90ZXMudyA9IDE1MDtcbiAgICBzaXplLmdlbmVyYWxfbm90ZXMuaCA9IDEwMDtcbiAgICBsb2MuZ2VuZXJhbF9ub3RlcyA9IHt9O1xuICAgIGxvYy5nZW5lcmFsX25vdGVzLnggPSBzaXplLmdlbmVyYWxfbm90ZXMudy8yICsgMzA7XG4gICAgbG9jLmdlbmVyYWxfbm90ZXMueSA9IHNpemUuZ2VuZXJhbF9ub3Rlcy5oLzIgKyAzMDtcblxuXG5cblxuICAgIHNldHRpbmdzLnBhZ2VzID0ge307XG4gICAgc2V0dGluZ3MucGFnZXMubGV0dGVyID0ge1xuICAgICAgICB1bml0czogJ2luY2hlcycsXG4gICAgICAgIHc6IDExLjAsXG4gICAgICAgIGg6IDguNSxcbiAgICB9O1xuICAgIHNldHRpbmdzLnBhZ2UgPSBzZXR0aW5ncy5wYWdlcy5sZXR0ZXI7XG5cbiAgICBzZXR0aW5ncy5wYWdlcy5QREYgPSB7XG4gICAgICAgIHc6IHNldHRpbmdzLnBhZ2UudyAqIDcyLFxuICAgICAgICBoOiBzZXR0aW5ncy5wYWdlLmggKiA3MixcbiAgICB9O1xuXG4gICAgc2V0dGluZ3MucGFnZXMuUERGLnNjYWxlID0ge1xuICAgICAgICB4OiBzZXR0aW5ncy5wYWdlcy5QREYudyAvIHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS5kcmF3aW5nLncsXG4gICAgICAgIHk6IHNldHRpbmdzLnBhZ2VzLlBERi5oIC8gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcuaCxcbiAgICB9O1xuXG4gICAgaWYoIHNldHRpbmdzLnBhZ2VzLlBERi5zY2FsZS54IDwgc2V0dGluZ3MucGFnZXMuUERGLnNjYWxlLnkgKSB7XG4gICAgICAgIHNldHRpbmdzLnBhZ2Uuc2NhbGUgPSBzZXR0aW5ncy5wYWdlcy5QREYuc2NhbGUueDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzZXR0aW5ncy5wYWdlLnNjYWxlID0gc2V0dGluZ3MucGFnZXMuUERGLnNjYWxlLnk7XG4gICAgfVxuXG5cbiAgICBsb2MucHJldmlldyA9IGxvYy5wcmV2aWV3IHx8IHt9O1xuICAgIGxvYy5wcmV2aWV3LmFycmF5ID0gbG9jLnByZXZpZXcuYXJyYXkgPSB7fTtcbiAgICBsb2MucHJldmlldy5hcnJheS50b3AgPSAxMDA7XG4gICAgbG9jLnByZXZpZXcuYXJyYXkubGVmdCA9IDUwO1xuXG4gICAgbG9jLnByZXZpZXcuREMgPSBsb2MucHJldmlldy5EQyA9IHt9O1xuICAgIGxvYy5wcmV2aWV3LmludmVydGVyID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIgPSB7fTtcbiAgICBsb2MucHJldmlldy5BQyA9IGxvYy5wcmV2aWV3LkFDID0ge307XG5cbiAgICBzaXplLnByZXZpZXcgPSBzaXplLnByZXZpZXcgfHwge307XG4gICAgc2l6ZS5wcmV2aWV3Lm1vZHVsZSA9IHtcbiAgICAgICAgdzogMTUsXG4gICAgICAgIGg6IDI1LFxuICAgIH07XG4gICAgc2l6ZS5wcmV2aWV3LkRDID0ge1xuICAgICAgICB3OiAzMCxcbiAgICAgICAgaDogNTAsXG4gICAgfTtcbiAgICBzaXplLnByZXZpZXcuaW52ZXJ0ZXIgPSB7XG4gICAgICAgIHc6IDE1MCxcbiAgICAgICAgaDogNzUsXG4gICAgfTtcbiAgICBzaXplLnByZXZpZXcuQUMgPSB7XG4gICAgICAgIHc6IDMwLFxuICAgICAgICBoOiA1MCxcbiAgICB9O1xuICAgIHNpemUucHJldmlldy5sb2FkY2VudGVyID0ge1xuICAgICAgICB3OiA1MCxcbiAgICAgICAgaDogMTAwLFxuICAgIH07XG5cblxuXG4gIHJldHVybiBzZXR0aW5ncztcblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gc2V0dGluZ3NfZHJhd2luZztcbiIsIi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ25cbmlmICghT2JqZWN0LmFzc2lnbikge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0LCBcImFzc2lnblwiLCB7XG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiBmdW5jdGlvbih0YXJnZXQsIGZpcnN0U291cmNlKSB7XG4gICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY29udmVydCBmaXJzdCBhcmd1bWVudCB0byBvYmplY3RcIik7XG4gICAgICB2YXIgdG8gPSBPYmplY3QodGFyZ2V0KTtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBuZXh0U291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBpZiAobmV4dFNvdXJjZSA9PT0gdW5kZWZpbmVkIHx8IG5leHRTb3VyY2UgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgICAgICB2YXIga2V5c0FycmF5ID0gT2JqZWN0LmtleXMoT2JqZWN0KG5leHRTb3VyY2UpKTtcbiAgICAgICAgZm9yICh2YXIgbmV4dEluZGV4ID0gMCwgbGVuID0ga2V5c0FycmF5Lmxlbmd0aDsgbmV4dEluZGV4IDwgbGVuOyBuZXh0SW5kZXgrKykge1xuICAgICAgICAgIHZhciBuZXh0S2V5ID0ga2V5c0FycmF5W25leHRJbmRleF07XG4gICAgICAgICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG5leHRTb3VyY2UsIG5leHRLZXkpO1xuICAgICAgICAgIGlmIChkZXNjICE9PSB1bmRlZmluZWQgJiYgZGVzYy5lbnVtZXJhYmxlKSB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0bztcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vL1xuLy8gZm9udHNcblxudmFyIGZvbnRzID0ge307XG5cbmZvbnRzWydzaWducyddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgNSxcbiAgICAndGV4dC1hbmNob3InOiAgICdtaWRkbGUnLFxufTtcbmZvbnRzWydsYWJlbCddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTIsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5mb250c1sndGl0bGUxJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAxNCxcbiAgICAndGV4dC1hbmNob3InOiAgICdsZWZ0Jyxcbn07XG5mb250c1sndGl0bGUyJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAxMixcbiAgICAndGV4dC1hbmNob3InOiAgICdsZWZ0Jyxcbn07XG5mb250c1sncGFnZSddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMjAsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5mb250c1sndGFibGUnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnc2VyaWYnLFxuICAgICdmb250LXNpemUnOiAgICAgOCxcbiAgICAndGV4dC1hbmNob3InOiAgICdtaWRkbGUnLFxufTtcbmZvbnRzWyd0YWJsZV9sZWZ0J10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ3NlcmlmJyxcbiAgICAnZm9udC1zaXplJzogICAgIDgsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbGVmdCcsXG59O1xuZm9udHNbJ3RhYmxlX2xhcmdlX2xlZnQnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDE0LFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ2xlZnQnLFxufTtcbmZvbnRzWyd0YWJsZV9sYXJnZSddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTQsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5mb250c1sncHJvamVjdCB0aXRsZSddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTYsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5mb250c1sncHJldmlldyB0ZXh0J10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZScgIDogMjAsXG4gICAgJ3RleHQtYW5jaG9yJzogJ21pZGRsZScsXG59O1xuZm9udHNbJ2RpbWVudGlvbiddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnICA6IDIwLFxuICAgICd0ZXh0LWFuY2hvcic6ICdtaWRkbGUnLFxufTtcblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvbnRzO1xuIiwiLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnblxuaWYgKCFPYmplY3QuYXNzaWduKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPYmplY3QsIFwiYXNzaWduXCIsIHtcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgdmFsdWU6IGZ1bmN0aW9uKHRhcmdldCwgZmlyc3RTb3VyY2UpIHtcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PT0gbnVsbClcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjb252ZXJ0IGZpcnN0IGFyZ3VtZW50IHRvIG9iamVjdFwiKTtcbiAgICAgIHZhciB0byA9IE9iamVjdCh0YXJnZXQpO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5leHRTb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGlmIChuZXh0U291cmNlID09PSB1bmRlZmluZWQgfHwgbmV4dFNvdXJjZSA9PT0gbnVsbCkgY29udGludWU7XG4gICAgICAgIHZhciBrZXlzQXJyYXkgPSBPYmplY3Qua2V5cyhPYmplY3QobmV4dFNvdXJjZSkpO1xuICAgICAgICBmb3IgKHZhciBuZXh0SW5kZXggPSAwLCBsZW4gPSBrZXlzQXJyYXkubGVuZ3RoOyBuZXh0SW5kZXggPCBsZW47IG5leHRJbmRleCsrKSB7XG4gICAgICAgICAgdmFyIG5leHRLZXkgPSBrZXlzQXJyYXlbbmV4dEluZGV4XTtcbiAgICAgICAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobmV4dFNvdXJjZSwgbmV4dEtleSk7XG4gICAgICAgICAgaWYgKGRlc2MgIT09IHVuZGVmaW5lZCAmJiBkZXNjLmVudW1lcmFibGUpIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRvO1xuICAgIH1cbiAgfSk7XG59XG5cblxudmFyIGxheWVyX2F0dHIgPSB7fTtcblxubGF5ZXJfYXR0ci5iYXNlID0ge1xuICAgICdmaWxsJzogJ25vbmUnLFxuICAgICdzdHJva2UnOicjMDAwMDAwJyxcbiAgICAnc3Ryb2tlLXdpZHRoJzonMXB4JyxcbiAgICAnc3Ryb2tlLWxpbmVjYXAnOididXR0JyxcbiAgICAnc3Ryb2tlLWxpbmVqb2luJzonbWl0ZXInLFxuICAgICdzdHJva2Utb3BhY2l0eSc6MSxcblxufTtcbmxheWVyX2F0dHIuYmxvY2sgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLmZyYW1lID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5mcmFtZS5zdHJva2UgPSAnIzAwMDA0Mic7XG5sYXllcl9hdHRyLnRhYmxlID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci50YWJsZS5zdHJva2UgPSAnIzAwMDAwMCc7XG5cbmxheWVyX2F0dHIuRENfaW50ZXJtb2R1bGUgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKSx7XG4gICAgc3Ryb2tlOiAnI2JlYmViZScsXG4gICAgXCJzdHJva2UtZGFzaGFycmF5XCI6IFwiMSwgMVwiLFxuXG5cbn0pO1xuXG5sYXllcl9hdHRyLkRDX3BvcyA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuRENfcG9zLnN0cm9rZSA9ICcjZmYwMDAwJztcbmxheWVyX2F0dHIuRENfbmVnID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5EQ19uZWcuc3Ryb2tlID0gJyMwMDAwMDAnO1xubGF5ZXJfYXR0ci5EQ19ncm91bmQgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkRDX2dyb3VuZC5zdHJva2UgPSAnIzAwNjYwMCc7XG5sYXllcl9hdHRyLm1vZHVsZSA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuYm94ID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xuXG5cblxubGF5ZXJfYXR0ci50ZXh0ID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci50ZXh0LnN0cm9rZSA9ICcjMDAwMGZmJztcbmxheWVyX2F0dHIudGVybWluYWwgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLmJvcmRlciA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcblxubGF5ZXJfYXR0ci5BQ19ncm91bmQgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkFDX2dyb3VuZC5zdHJva2UgPSAnIzAwOTkwMCc7XG5sYXllcl9hdHRyLkFDX25ldXRyYWwgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkFDX25ldXRyYWwuc3Ryb2tlID0gJyM5OTk3OTcnO1xubGF5ZXJfYXR0ci5BQ19MMSA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuQUNfTDEuc3Ryb2tlID0gJyMwMDAwMDAnO1xubGF5ZXJfYXR0ci5BQ19MMiA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuQUNfTDIuc3Ryb2tlID0gJyNGRjAwMDAnO1xubGF5ZXJfYXR0ci5BQ19MMyA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuQUNfTDMuc3Ryb2tlID0gJyMwMDAwRkYnO1xuXG5cbmxheWVyX2F0dHIucHJldmlldyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpLHtcbiAgICAnc3Ryb2tlLXdpZHRoJzogJzInLFxufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19tb2R1bGUgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyNmZmIzMDAnLFxuICAgIHN0cm9rZTogJ25vbmUnLFxufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19hcnJheSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6ICcjZmY1ZDAwJyxcbn0pO1xuXG5sYXllcl9hdHRyLnByZXZpZXdfREMgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgc3Ryb2tlOiAnI2IwOTJjNCcsXG59KTtcbmxheWVyX2F0dHIucHJldmlld19EQ19ib3ggPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyNiMDkyYzQnLFxuICAgIHN0cm9rZTogJ25vbmUnLFxufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19pbnZlcnRlciA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6JyM4NmM5NzQnLFxufSk7XG5sYXllcl9hdHRyLnByZXZpZXdfaW52ZXJ0ZXJfYm94ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjODZjOTc0JyxcbiAgICBzdHJva2U6ICdub25lJyxcbn0pO1xuXG5sYXllcl9hdHRyLnByZXZpZXdfQUMgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgc3Ryb2tlOiAnIzgxODhhMScsXG59KTtcblxubGF5ZXJfYXR0ci5wcmV2aWV3X0FDX2JveCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnIzgxODhhMScsXG4gICAgc3Ryb2tlOiAnbm9uZScsXG59KTtcblxubGF5ZXJfYXR0ci5wcmV2aWV3X3N0cnVjdHVyYWwgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgc3Ryb2tlOiAnIzAwMDAwMCcsXG59KTtcbmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX2RvdCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6ICcjMDAwMDAwJyxcbiAgICBcInN0cm9rZS1kYXNoYXJyYXlcIjogXCI1LCA1XCJcbn0pO1xubGF5ZXJfYXR0ci5wcmV2aWV3X3N0cnVjdHVyYWxfcG9seV91bnNlbGVjdGVkID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjZTFlMWUxJyxcbiAgICBzdHJva2U6ICdub25lJ1xufSk7XG5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3NlbGVjdGVkID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjZmZlN2NiJyxcbiAgICBzdHJva2U6ICdub25lJ1xufSk7XG5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3NlbGVjdGVkX2ZyYW1lZCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnI2ZmZTdjYicsXG4gICAgc3Ryb2tlOiAnIzAwMDAwMCdcbn0pO1xuXG5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGUgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyNmZmZmZmYnLFxuICAgIHN0cm9rZTogJ25vbmUnXG59KTtcbmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnIzgzOTdlOCcsXG4gICAgc3Ryb2tlOiAnI2RmZmFmZidcbn0pO1xuXG5sYXllcl9hdHRyLm5vcnRoX2Fycm93ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIHN0cm9rZTogJyMwMDAwMDAnLFxuICAgICdzdHJva2Utd2lkdGgnOiAyLFxuICAgICdzdHJva2UtbGluZWNhcCc6IFwicm91bmRcIixcbiAgICAnc3Ryb2tlLWxpbmVqb2luJzogXCJyb3VuZFwiLFxufSk7XG5sYXllcl9hdHRyLm5vcnRoX2xldHRlciA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6ICcjOTQ5NDk0JyxcbiAgICAnc3Ryb2tlLXdpZHRoJzogNSxcbiAgICAnc3Ryb2tlLWxpbmVjYXAnOiBcInJvdW5kXCIsXG4gICAgJ3N0cm9rZS1saW5lam9pbic6IFwicm91bmRcIixcbn0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gbGF5ZXJfYXR0cjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGsgPSByZXF1aXJlKCcuLi9saWIvay9rLmpzJyk7XG52YXIgZiA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zJyk7XG4vL3ZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG4vL3ZhciBkaXNwbGF5X3N2ZyA9IHJlcXVpcmUoJy4vZGlzcGxheV9zdmcnKTtcblxudmFyIG9iamVjdF9kZWZpbmVkID0gZi5vYmplY3RfZGVmaW5lZDtcblxudmFyIHNldHRpbmdzX3VwZGF0ZSA9IGZ1bmN0aW9uKHNldHRpbmdzKSB7XG5cbiAgICAvL2NvbnNvbGUubG9nKCctLS1zZXR0aW5ncy0tLScsIHNldHRpbmdzKTtcbiAgICB2YXIgY29uZmlnX29wdGlvbnMgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucztcbiAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxvYztcbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgc3RhdGUgPSBzZXR0aW5ncy5zdGF0ZTtcblxuICAgIHZhciBpbnB1dHMgPSBzZXR0aW5ncy5pbnB1dHM7XG5cblxuXG5cblxuICAgIGlmKCBzdGF0ZS5kYXRhYmFzZV9sb2FkZWQgKXtcbiAgICAgICAgaW5wdXRzLkRDID0gc2V0dGluZ3MuaW5wdXRzLkRDIHx8IHt9O1xuICAgICAgICBpbnB1dHMuREMud2lyZV9zaXplID0gc2V0dGluZ3MuaW5wdXRzLkRDLndpcmVfc2l6ZSB8fCB7fTtcbiAgICAgICAgaW5wdXRzLkRDLndpcmVfc2l6ZS5vcHRpb25zID0gaW5wdXRzLkRDLndpcmVfc2l6ZS5vcHRpb25zIHx8IGsub2JqX25hbWVzKHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLk5FQ190YWJsZXNbJ0NoIDkgVGFibGUgOCBDb25kdWN0b3IgUHJvcGVydGllcyddKTtcblxuXG4gICAgfVxuXG4gICAgLy92YXIgc2hvd19kZWZhdWx0cyA9IGZhbHNlO1xuICAgIC8vLypcbiAgICBpZiggc3RhdGUubW9kZSA9PT0gJ2Rldicpe1xuICAgICAgICAvL3Nob3dfZGVmYXVsdHMgPSB0cnVlO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdEZXYgbW9kZSAtIGRlZmF1bHRzIG9uJyk7XG5cbiAgICAgICAgc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzID0gc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzIHx8IDQ7XG4gICAgICAgIHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgPSBzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nIHx8IDY7XG4gICAgICAgIHN5c3RlbS5EQy5ob21lX3J1bl9sZW5ndGggPSBzeXN0ZW0uREMuaG9tZV9ydW5fbGVuZ3RoIHx8IDUwO1xuXG4gICAgICAgIHN5c3RlbS5yb29mLndpZHRoICA9IHN5c3RlbS5yb29mLndpZHRoIHx8IDI1O1xuICAgICAgICBzeXN0ZW0ucm9vZi5sZW5ndGggPSBzeXN0ZW0ucm9vZi5sZW5ndGggfHwgMTU7XG4gICAgICAgIHN5c3RlbS5yb29mLnNsb3BlICA9IHN5c3RlbS5yb29mLnNsb3BlIHx8IFwiNjoxMlwiO1xuICAgICAgICBzeXN0ZW0ucm9vZi50eXBlID0gc3lzdGVtLnJvb2YudHlwZSB8fCBcIkdhYmxlXCI7XG5cbiAgICAgICAgc3lzdGVtLm1vZHVsZS5vcmllbnRhdGlvbiA9IHN5c3RlbS5tb2R1bGUub3JpZW50YXRpb24gfHwgXCJQb3J0cmFpdFwiO1xuICAgICAgICBzeXN0ZW0ubW9kdWxlLndpZHRoID0gc3lzdGVtLm1vZHVsZS53aWR0aCB8fCAzMDtcbiAgICAgICAgc3lzdGVtLm1vZHVsZS5sZW5ndGggPSBzeXN0ZW0ubW9kdWxlLmxlbmd0aCB8fCA1MDtcblxuXG4gICAgICAgIGlmKCBzdGF0ZS5kYXRhYmFzZV9sb2FkZWQgKXtcbiAgICAgICAgICAgIHN5c3RlbS5pbnZlcnRlci5tYWtlID0gc3lzdGVtLmludmVydGVyLm1ha2UgfHxcbiAgICAgICAgICAgICAgICAnU01BJztcbiAgICAgICAgICAgIHN5c3RlbS5pbnZlcnRlci5tb2RlbCA9IHN5c3RlbS5pbnZlcnRlci5tb2RlbCB8fFxuICAgICAgICAgICAgICAgICdTSTMwMDAnO1xuXG4gICAgICAgICAgICBzeXN0ZW0ubW9kdWxlLm1ha2UgPSBzeXN0ZW0ubW9kdWxlLm1ha2UgfHxcbiAgICAgICAgICAgICAgICBmLm9ial9uYW1lcyggc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzIClbMF07XG4gICAgICAgICAgICAvL2lmKCBzeXN0ZW0ubW9kdWxlLm1ha2UpIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZU1vZGVsQXJyYXkgPSBrLm9iaklkQXJyYXkoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlc1tzeXN0ZW0ubW9kdWxlLm1ha2VdKTtcbiAgICAgICAgICAgIHN5c3RlbS5tb2R1bGUubW9kZWwgPSBzeXN0ZW0ubW9kdWxlLm1vZGVsIHx8XG4gICAgICAgICAgICAgICAgZi5vYmpfbmFtZXMoIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tzeXN0ZW0ubW9kdWxlLm1ha2VdIClbMF07XG5cblxuICAgICAgICAgICAgc3lzdGVtLm1vZHVsZS5tb2RlbCA9IHN5c3RlbS5tb2R1bGUubW9kZWwgfHxcbiAgICAgICAgICAgICAgICBmLm9ial9uYW1lcyggc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzW3N5c3RlbS5tb2R1bGUubWFrZV0gKVswXTtcblxuICAgICAgICAgICAgc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXMgPSBzeXN0ZW0uQUMubG9hZGNlbnRlcl90eXBlcyB8fFxuICAgICAgICAgICAgLy8gICAgZi5vYmpfbmFtZXMoaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXMpWzBdO1xuICAgICAgICAgICAgICAgICc0ODAvMjc3Vic7XG5cblxuICAgICAgICAgICAgc3lzdGVtLkFDLnR5cGUgPSBzeXN0ZW0uQUMudHlwZSB8fCAnNDgwViBXeWUnO1xuICAgICAgICAgICAgLy9zeXN0ZW0uQUMudHlwZSA9IHN5c3RlbS5BQy50eXBlIHx8XG4gICAgICAgICAgICAvLyAgICBzeXN0ZW0uQUMubG9hZGNlbnRlcl90eXBlc1tzeXN0ZW0uQUMubG9hZGNlbnRlcl90eXBlc11bMF07XG5cbiAgICAgICAgICAgIHN5c3RlbS5BQy5kaXN0YW5jZV90b19sb2FkY2VudGVyID0gc3lzdGVtLkFDLmRpc3RhbmNlX3RvX2xvYWRjZW50ZXIgfHxcbiAgICAgICAgICAgICAgICA1MDtcblxuXG4gICAgICAgICAgICBzeXN0ZW0uREMud2lyZV9zaXplID0gaW5wdXRzLkRDLndpcmVfc2l6ZS5vcHRpb25zWzNdO1xuICAgICAgICAgICAgLypcblxuICAgICAgICAgICAgc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJNYWtlQXJyYXkgPSBrLm9iaklkQXJyYXkoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzKTtcbiAgICAgICAgICAgIHN5c3RlbS5pbnZlcnRlci5tYWtlID0gc3lzdGVtLmludmVydGVyLm1ha2UgfHwgT2JqZWN0LmtleXMoIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVycyApWzBdO1xuICAgICAgICAgICAgc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJNb2RlbEFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyc1tzeXN0ZW0uaW52ZXJ0ZXIubWFrZV0pO1xuXG4gICAgICAgICAgICBzeXN0ZW0uQUNfbG9hZGNlbnRlcl90eXBlID0gc3lzdGVtLkFDX2xvYWRjZW50ZXJfdHlwZSB8fCBjb25maWdfb3B0aW9ucy5BQ19sb2FkY2VudGVyX3R5cGVfb3B0aW9uc1swXTtcbiAgICAgICAgICAgIC8vKi9cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyovXG5cblxuICAgIC8vY29uc29sZS5sb2coXCJzZXR0aW5nc191cGRhdGVcIik7XG4gICAgLy9jb25zb2xlLmxvZyhzeXN0ZW0ubW9kdWxlLm1ha2UpO1xuXG4gICAgaW5wdXRzLm1vZHVsZS5tYWtlLm9wdGlvbnMgPSBrLm9ial9uYW1lcyhzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXMpO1xuICAgIGlmKCBzeXN0ZW0ubW9kdWxlLm1ha2UgKSB7XG4gICAgICAgIGlucHV0cy5tb2R1bGUubW9kZWwub3B0aW9ucyAgPSBrLm9ial9uYW1lcyggc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzW3N5c3RlbS5tb2R1bGUubWFrZV0gKTtcbiAgICB9XG5cbiAgICBpZiggc3lzdGVtLm1vZHVsZS5tb2RlbCApIHtcbiAgICAgICAgdmFyIHNwZWNzID0gc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzW3N5c3RlbS5tb2R1bGUubWFrZV1bc3lzdGVtLm1vZHVsZS5tb2RlbF07XG4gICAgICAgIGZvciggdmFyIHNwZWNfbmFtZSBpbiBzcGVjcyApe1xuICAgICAgICAgICAgaWYoIHNwZWNfbmFtZSAhPT0gJ21vZHVsZV9pZCcgKXtcbiAgICAgICAgICAgICAgICBzeXN0ZW0ubW9kdWxlW3NwZWNfbmFtZV0gPSBzcGVjc1tzcGVjX25hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vc3lzdGVtLm1vZHVsZS5zcGVjcyA9IHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tzeXN0ZW0ubW9kdWxlLm1ha2VdW3N5c3RlbS5tb2R1bGUubW9kZWxdO1xuICAgIH1cblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnYXJyYXknKSAmJiBmLnNlY3Rpb25fZGVmaW5lZCgnbW9kdWxlJykgKXtcbiAgICAgICAgc3lzdGVtLmFycmF5ID0gc3lzdGVtLmFycmF5IHx8IHt9O1xuICAgICAgICBzeXN0ZW0uYXJyYXkuaXNjID0gc3lzdGVtLm1vZHVsZS5pc2MgKiBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3M7XG4gICAgICAgIHN5c3RlbS5hcnJheS52b2MgPSBzeXN0ZW0ubW9kdWxlLnZvYyAqIHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmc7XG4gICAgICAgIHN5c3RlbS5hcnJheS5pbXAgPSBzeXN0ZW0ubW9kdWxlLmltcCAqIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncztcbiAgICAgICAgc3lzdGVtLmFycmF5LnZtcCA9IHN5c3RlbS5tb2R1bGUudm1wICogc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZztcbiAgICAgICAgc3lzdGVtLmFycmF5LnBtcCA9IHN5c3RlbS5hcnJheS52bXAgICogc3lzdGVtLmFycmF5LmltcDtcblxuICAgICAgICBzeXN0ZW0uYXJyYXkubnVtYmVyX29mX21vZHVsZXMgPSBzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nICogc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzO1xuXG5cbiAgICB9XG5cblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnREMnKSApe1xuXG4gICAgICAgIHN5c3RlbS5EQy53aXJlX3NpemUgPSBcIi1VbmRlZmluZWQtXCI7XG5cbiAgICB9XG5cbiAgICBpbnB1dHMuaW52ZXJ0ZXIubWFrZS5vcHRpb25zID0gay5vYmpfbmFtZXMoc2V0dGluZ3MuY29tcG9uZW50cy5pbnZlcnRlcnMpO1xuICAgIGlmKCBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSApIHtcbiAgICAgICAgaW5wdXRzLmludmVydGVyLm1vZGVsLm9wdGlvbnMgPSBrLm9ial9uYW1lcyggc2V0dGluZ3MuY29tcG9uZW50cy5pbnZlcnRlcnNbc3lzdGVtLmludmVydGVyLm1ha2VdICk7XG4gICAgfVxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnaW52ZXJ0ZXInKSApe1xuXG4gICAgfVxuXG4gICAgLy9pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlID0gc2V0dGluZ3MuZi5vYmpfbmFtZXMoaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXMpO1xuICAgIGlmKCBzeXN0ZW0uQUMubG9hZGNlbnRlcl90eXBlcyApIHtcbiAgICAgICAgdmFyIGxvYWRjZW50ZXJfdHlwZSA9IHN5c3RlbS5BQy5sb2FkY2VudGVyX3R5cGVzO1xuICAgICAgICB2YXIgQUNfb3B0aW9ucyA9IGlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzW2xvYWRjZW50ZXJfdHlwZV07XG4gICAgICAgIGlucHV0cy5BQy50eXBlLm9wdGlvbnMgPSBBQ19vcHRpb25zO1xuICAgICAgICAvL2luLm9wdC5BQy50eXBlc1tsb2FkY2VudGVyX3R5cGVdO1xuXG4gICAgICAgIC8vaW5wdXRzLkFDWyd0eXBlJ10gPSBrLm9ial9uYW1lcyggc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGUgKTtcbiAgICB9XG4gICAgaWYoIHN5c3RlbS5BQy50eXBlICkge1xuICAgICAgICBzeXN0ZW0uQUMuY29uZHVjdG9ycyA9IHNldHRpbmdzLmluLm9wdC5BQy50eXBlc1tzeXN0ZW0uQUMudHlwZV07XG4gICAgICAgIHN5c3RlbS5BQy5udW1fY29uZHVjdG9ycyA9IHN5c3RlbS5BQy5jb25kdWN0b3JzLmxlbmd0aDtcblxuICAgIH1cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ0FDJykgKXtcblxuICAgICAgICBzeXN0ZW0uQUMud2lyZV9zaXplID0gXCItVW5kZWZpbmVkLVwiO1xuICAgIH1cblxuICAgIHNpemUud2lyZV9vZmZzZXQubWF4ID0gc2l6ZS53aXJlX29mZnNldC5taW4gKyBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgKiBzaXplLndpcmVfb2Zmc2V0LmJhc2U7XG4gICAgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgPSBzaXplLndpcmVfb2Zmc2V0Lm1heCArIHNpemUud2lyZV9vZmZzZXQuYmFzZSoxO1xuICAgIGxvYy5hcnJheS5sZWZ0ID0gbG9jLmFycmF5LnJpZ2h0IC0gKCBzaXplLnN0cmluZy53ICogc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzICkgLSAoIHNpemUubW9kdWxlLmZyYW1lLncqMy80ICkgO1xuXG5cblxuXG5cblxuXG5cblxuICAgIC8qXG4gICAgLy9zZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUud2lyZV90YWJsZS5oID0gKHN5c3RlbS5BQy5udW1fY29uZHVjdG9ycyszKSAqIHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS53aXJlX3RhYmxlLnJvd19oO1xuICAgIGZvciggdmFyIHNlY3Rpb25fbmFtZSBpbiBpbnB1dHMgKXtcbiAgICAgICAgZm9yKCB2YXIgaW5wdXRfbmFtZSBpbiBzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXSApe1xuICAgICAgICAgICAgaWYoIHR5cGVvZiBzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSA9PT0gJ3N0cmluZycgKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0gKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggay5vYmpfbmFtZXMoXG4gICAgICAgICAgICAgICAgICAgIGYuZ2V0X3JlZihzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSwgc2V0dGluZ3MpXG4gICAgICAgICAgICAgICAgKSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgdG9fZXZhbCA9IFwiay5vYmpfbmFtZXMoc2V0dHRpbmdzLlwiICsgc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0gKyBcIilcIjtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0b19ldmFsKTtcbiAgICAgICAgICAgICAgICAvLyBldmFsIGlzIG9ubHkgYmVpbmcgdXNlZCBvbiBzdHJpbmdzIGRlZmluZWQgaW4gdGhlIHNldHRpbmdzLmpzb24gZmlsZSB0aGF0IGlzIGJ1aWx0IGludG8gdGhlIGFwcGxpY2F0aW9uXG4gICAgICAgICAgICAgICAgLyoganNoaW50IGV2aWw6dHJ1ZSAvLyovXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogTG9vayBmb3IgYWx0ZXJuYXRpdmUgc29sdXRpb25zIHRoYXQgaXMgbW9yZSB1bml2ZXJzYWwuXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3BlcmZlY3Rpb25raWxscy5jb20vZ2xvYmFsLWV2YWwtd2hhdC1hcmUtdGhlLW9wdGlvbnMvI2luZGlyZWN0X2V2YWxfY2FsbF9leGFtcGxlc1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgdmFyIGUgPSBldmFsOyAvLyBUaGlzIGFsbG93cyBldmFsIHRvIGJlIGNhbGxlZCBpbmRpcmVjdGx5LCB0cmlnZ2VyaW5nIGEgZ2xvYmFsIGNhbGwgaW4gbW9kZXJuIGJyb3dzZXJzLlxuICAgICAgICAgICAgICAgIHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdID0gZSh0b19ldmFsKTtcbiAgICAgICAgICAgICAgICAvKiBqc2hpbnQgZXZpbDpmYWxzZSAvLyovXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vKi9cblxufTtcblxuLypcblxuICAgIGlmKCBzdGF0ZS5kYXRhX2xvYWRlZCApIHtcblxuICAgICAgICAvL3N5c3RlbS5EQy5udW1fc3RyaW5ncyA9IHNldHRpbmdzLnN5c3RlbS5udW1fc3RyaW5ncztcbiAgICAgICAgLy9zeXN0ZW0uREMubnVtX21vZHVsZSA9IHNldHRpbmdzLnN5c3RlbS5udW1fbW9kdWxlO1xuICAgICAgICAvL2lmKCBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVzICE9PSB1bmRlZmluZWQgKXtcblxuICAgICAgICB2YXIgb2xkX2FjdGl2ZV9zZWN0aW9uID0gc3RhdGUuYWN0aXZlX3NlY3Rpb247XG5cbiAgICAgICAgLy8gTW9kdWxlc1xuICAgICAgICBpZiggdHJ1ZSApe1xuICAgICAgICAgICAgZi5vYmplY3RfZGVmaW5lZChzeXN0ZW0uREMubW9kdWxlKTtcblxuICAgICAgICAgICAgc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlTWFrZUFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZXMpO1xuICAgICAgICAgICAgaWYoIHN5c3RlbS5EQy5tb2R1bGUubWFrZSApIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZU1vZGVsQXJyYXkgPSBrLm9iaklkQXJyYXkoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlc1tzeXN0ZW0uREMubW9kdWxlLm1ha2VdKTtcbiAgICAgICAgICAgIGlmKCBzeXN0ZW0uREMubW9kdWxlLm1vZGVsICkgc3lzdGVtLkRDLm1vZHVsZS5zcGVjcyA9IHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZXNbc3lzdGVtLkRDLm1vZHVsZS5tYWtlXVtzeXN0ZW0uREMubW9kdWxlLm1vZGVsXTtcblxuICAgICAgICAgICAgc3RhdGUuYWN0aXZlX3NlY3Rpb24gPSAnYXJyYXknO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXJyYXlcbiAgICAgICAgaWYoIG9iamVjdF9kZWZpbmVkKGlucHV0Lm1vZHVsZSkgKSB7XG4gICAgICAgICAgICAvL3N5c3RlbS5tb2R1bGUgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVzW3NldHRpbmdzLmYubW9kdWxlXTtcbiAgICAgICAgICAgIGlmKCBzeXN0ZW0uREMubW9kdWxlLnNwZWNzICl7XG4gICAgICAgICAgICAgICAgc3lzdGVtLkRDLmFycmF5ID0ge307XG4gICAgICAgICAgICAgICAgc3lzdGVtLkRDLmFycmF5LklzYyA9IHN5c3RlbS5EQy5tb2R1bGUuc3BlY3MuSXNjICogc3lzdGVtLkRDLm51bV9zdHJpbmdzO1xuICAgICAgICAgICAgICAgIHN5c3RlbS5EQy5hcnJheS5Wb2MgPSBzeXN0ZW0uREMubW9kdWxlLnNwZWNzLlZvYyAqIHN5c3RlbS5EQy5zdHJpbmdfbW9kdWxlcztcbiAgICAgICAgICAgICAgICBzeXN0ZW0uREMuYXJyYXkuSW1wID0gc3lzdGVtLkRDLm1vZHVsZS5zcGVjcy5JbXAgKiBzeXN0ZW0uREMubnVtX3N0cmluZ3M7XG4gICAgICAgICAgICAgICAgc3lzdGVtLkRDLmFycmF5LlZtcCA9IHN5c3RlbS5EQy5tb2R1bGUuc3BlY3MuVm1wICogc3lzdGVtLkRDLnN0cmluZ19tb2R1bGVzO1xuICAgICAgICAgICAgICAgIHN5c3RlbS5EQy5hcnJheS5QbXAgPSBzeXN0ZW0uREMuYXJyYXkuVm1wICogc3lzdGVtLkRDLmFycmF5LkltcDtcblxuICAgICAgICAgICAgICAgIHN0YXRlLmFjdGl2ZV9zZWN0aW9uID0gJ0RDJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRENcbiAgICAgICAgICAgIGlmKCBvYmplY3RfZGVmaW5lZChpbnB1dHMuREMpICkge1xuXG4gICAgICAgICAgICAgICAgc3lzdGVtLkRDLmhvbWVydW4ucmVzaXN0YW5jZSA9IGNvbmZpZ19vcHRpb25zLk5FQ190YWJsZXNbJ0NoIDkgVGFibGUgOCBDb25kdWN0b3IgUHJvcGVydGllcyddW3N5c3RlbS5EQy5ob21lcnVuLkFXR107XG4gICAgICAgICAgICAgICAgc3RhdGUuc2VjdGlvbnMuaW52ZXJ0ZXIucmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHN0YXRlLmFjdGl2ZV9zZWN0aW9uID0gJ2ludmVydGVyJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSW52ZXJ0ZXJcbiAgICAgICAgICAgIGlmKCBvYmplY3RfZGVmaW5lZChpbnB1dHMuREMpICkge1xuXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJNYWtlQXJyYXkgPSBrLm9iaklkQXJyYXkoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzKTtcbiAgICAgICAgICAgICAgICBpZiggc3lzdGVtLmludmVydGVyLm1ha2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyTW9kZWxBcnJheSA9IGsub2JqSWRBcnJheShzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnNbc3lzdGVtLmludmVydGVyLm1ha2VdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoIHN5c3RlbS5pbnZlcnRlci5tb2RlbCApIHN5c3RlbS5pbnZlcnRlci5zcGVjcyA9IHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyc1tzeXN0ZW0uaW52ZXJ0ZXIubWFrZV1bc3lzdGVtLmludmVydGVyLm1vZGVsXTtcblxuICAgICAgICAgICAgICAgIHN0YXRlLmFjdGl2ZV9zZWN0aW9uID0gJ0FDJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQUNcbiAgICAgICAgICAgIGlmKCBvYmplY3RfZGVmaW5lZChpbnB1dHMuaW52ZXJ0ZXIpICkge1xuICAgICAgICAgICAgICAgIGlmKCBzeXN0ZW0uQUNfbG9hZGNlbnRlcl90eXBlICkge1xuXG4gICAgICAgICAgICAgICAgICAgIHN5c3RlbS5BQ190eXBlc19hdmFpbGlibGUgPSBjb25maWdfb3B0aW9ucy5BQ19sb2FkY2VudGVyX3R5cGVzW3N5c3RlbS5BQ19sb2FkY2VudGVyX3R5cGVdO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ19vcHRpb25zLkFDX3R5cGVfb3B0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiggZWxlbSwgaWQgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCAhIChlbGVtIGluIHN5c3RlbS5BQ190eXBlc19hdmFpbGlibGUpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ19vcHRpb25zLkFDX3R5cGVfb3B0aW9ucy5zcGxpY2UoaWQsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vc3lzdGVtLkFDLnR5cGUgPSBzZXR0aW5ncy5zeXN0ZW0uQUNfdHlwZTtcbiAgICAgICAgICAgICAgICAgICAgc3lzdGVtLkFDX2NvbmR1Y3RvcnMgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5BQ190eXBlc1tzeXN0ZW0uQUNfdHlwZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGlmKCBvYmplY3RfZGVmaW5lZChpbnB1dHMuQUMpICkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFjdGl2ZV9zZWN0aW9uID0gb2xkX2FjdGl2ZV9zZWN0aW9uO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzaXplLndpcmVfb2Zmc2V0Lm1heCA9IHNpemUud2lyZV9vZmZzZXQubWluICsgc3lzdGVtLkRDLm51bV9zdHJpbmdzICogc2l6ZS53aXJlX29mZnNldC5iYXNlO1xuICAgICAgICAgICAgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgPSBzaXplLndpcmVfb2Zmc2V0Lm1heCArIHNpemUud2lyZV9vZmZzZXQuYmFzZSoxO1xuXG4gICAgICAgICAgICBsb2MuYXJyYXkubGVmdCA9IGxvYy5hcnJheS5yaWdodCAtICggc2l6ZS5zdHJpbmcudyAqIHN5c3RlbS5EQy5udW1fc3RyaW5ncyApIC0gKCBzaXplLm1vZHVsZS5mcmFtZS53KjMvNCApIDtcblxuICAgICAgICAgICAgLy9yZXR1cm4gc2V0dGluZ3M7XG5cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8vKi9cblxubW9kdWxlLmV4cG9ydHMgPSBzZXR0aW5nc191cGRhdGU7XG4iLCJtb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz17XG5cbiAgICBcIk5FQyAyNTAuMTIyX2hlYWRlclwiOiBbXCJBbXBcIixcIkFXR1wiXSxcbiAgICBcIk5FQyAyNTAuMTIyXCI6IHtcbiAgICAgICAgXCIxNVwiOlwiMTRcIixcbiAgICAgICAgXCIyMFwiOlwiMTJcIixcbiAgICAgICAgXCIzMFwiOlwiMTBcIixcbiAgICAgICAgXCI0MFwiOlwiMTBcIixcbiAgICAgICAgXCI2MFwiOlwiMTBcIixcbiAgICAgICAgXCIxMDBcIjpcIjhcIixcbiAgICAgICAgXCIyMDBcIjpcIjZcIixcbiAgICAgICAgXCIzMDBcIjpcIjRcIixcbiAgICAgICAgXCI0MDBcIjpcIjNcIixcbiAgICAgICAgXCI1MDBcIjpcIjJcIixcbiAgICAgICAgXCI2MDBcIjpcIjFcIixcbiAgICAgICAgXCI4MDBcIjpcIjEvMFwiLFxuICAgICAgICBcIjEwMDBcIjpcIjIvMFwiLFxuICAgICAgICBcIjEyMDBcIjpcIjMvMFwiLFxuICAgICAgICBcIjE2MDBcIjpcIjQvMFwiLFxuICAgICAgICBcIjIwMDBcIjpcIjI1MFwiLFxuICAgICAgICBcIjI1MDBcIjpcIjM1MFwiLFxuICAgICAgICBcIjMwMDBcIjpcIjQwMFwiLFxuICAgICAgICBcIjQwMDBcIjpcIjUwMFwiLFxuICAgICAgICBcIjUwMDBcIjpcIjcwMFwiLFxuICAgICAgICBcIjYwMDBcIjpcIjgwMFwiLFxuICAgIH0sXG5cbiAgICBcIk5FQyBUNjkwLjdfaGVhZGVyXCI6IFtcIkFtYmllbnQgVGVtcGVyYXR1cmUgKEMpXCIsIFwiQ29ycmVjdGlvbiBGYWN0b3JcIl0sXG4gICAgXCJORUMgVDY5MC43XCI6IHtcbiAgICAgICAgXCIyNSB0byAyMFwiOlwiMS4wMlwiLFxuICAgICAgICBcIjE5IHRvIDE1XCI6XCIxLjA0XCIsXG4gICAgICAgIFwiMTUgdG8gMTBcIjpcIjEuMDZcIixcbiAgICAgICAgXCI5IHRvIDVcIjpcIjEuMDhcIixcbiAgICAgICAgXCI0IHRvIDBcIjpcIjEuMTBcIixcbiAgICAgICAgXCItMSB0byAtNVwiOlwiMS4xMlwiLFxuICAgICAgICBcIi02IHRvIC0xMFwiOlwiMS4xNFwiLFxuICAgICAgICBcIi0xMSB0byAtMTVcIjpcIjEuMTZcIixcbiAgICAgICAgXCItMTYgdG8gLTIwXCI6XCIxLjE4XCIsXG4gICAgICAgIFwiLTIxIHRvIC0yNVwiOlwiMS4yMFwiLFxuICAgICAgICBcIi0yNiB0byAtMzBcIjpcIjEuMjFcIixcbiAgICAgICAgXCItMzEgdG8gLTM1XCI6XCIxLjIzXCIsXG4gICAgICAgIFwiLTM2IHRvIC00MFwiOlwiMS4yNVwiLFxuICAgIH0sXG5cbiAgICBcIkNoIDkgVGFibGUgOCBDb25kdWN0b3IgUHJvcGVydGllc19oZWFkZXJcIjogW1wiU2l6ZVwiLFwib2htL2tmdFwiXSxcbiAgICBcIkNoIDkgVGFibGUgOCBDb25kdWN0b3IgUHJvcGVydGllc1wiOiB7XG4gICAgICAgIFwiIzAxXCI6XCIgMC4xNTRcIixcbiAgICAgICAgXCIjMDEvMFwiOlwiMC4xMjJcIixcbiAgICAgICAgXCIjMDJcIjpcIjAuMTk0XCIsXG4gICAgICAgIFwiIzAyLzBcIjpcIjAuMDk2N1wiLFxuICAgICAgICBcIiMwM1wiOlwiMC4yNDVcIixcbiAgICAgICAgXCIjMDMvMFwiOlwiMC4wNzY2XCIsXG4gICAgICAgIFwiIzA0XCI6XCIwLjMwOFwiLFxuICAgICAgICBcIiMwNC8wXCI6XCIwLjA2MDhcIixcbiAgICAgICAgXCIjMDZcIjpcIjAuNDkxXCIsXG4gICAgICAgIFwiIzA4XCI6XCIwLjc3OFwiLFxuICAgICAgICBcIiMxMFwiOlwiMS4yNFwiLFxuICAgICAgICBcIiMxMlwiOlwiMS45OFwiLFxuICAgICAgICBcIiMxNFwiOlwiMy4xNFwiLFxuICAgIH1cbn1cbiIsIi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBUaGlzIGlzIHRoZSBrIGphdmFzY3JpcHQgbGlicmFyeVxyXG4vLyBhIGNvbGxlY3Rpb24gb2YgZnVuY3Rpb25zIHVzZWQgYnkga3Nob3dhbHRlclxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbi8vdmFyIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG4vL3ZhciAkID0gcmVxdWlyZSgnLi9rX0RPTS5qcycpO1xyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBNaXNjLiB2YXJpYWJsZXMgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4vLyBsb2cgc2hvcnRjdXRcclxudmFyIGxvZ09iaiA9IGZ1bmN0aW9uKG9iail7XHJcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShvYmopKVxyXG59XHJcbnZhciBsb2dPYmpGdWxsID0gZnVuY3Rpb24ob2JqKXtcclxuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KG9iaiwgbnVsbCwgNCkpXHJcbn1cclxuXHJcbi8vIH4gcGFnZSBsb2FkIHRpbWVcclxudmFyIGJvb3RfdGltZSA9IG1vbWVudCgpXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gU3RhcnQgb2YgbGliYXJ5IG9iamVjdCAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxudmFyIGsgPSB7fVxyXG5cclxuXHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEphdmFzcmlwdCBmdW5jdGlvbnMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG5cclxuay5vYmpfZXh0ZW5kID0gZnVuY3Rpb24ob2JqLCBwcm9wcykge1xyXG4gICAgZm9yKHZhciBwcm9wIGluIHByb3BzKSB7XHJcbiAgICAgICAgaWYocHJvcHMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgICAgICAgb2JqW3Byb3BdID0gcHJvcHNbcHJvcF1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmsub2JqX3JlbmFtZSA9IGZ1bmN0aW9uKG9iaiwgb2xkX25hbWUsIG5ld19uYW1lKXtcclxuICAgIC8vIENoZWNrIGZvciB0aGUgb2xkIHByb3BlcnR5IG5hbWUgdG8gYXZvaWQgYSBSZWZlcmVuY2VFcnJvciBpbiBzdHJpY3QgbW9kZS5cclxuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkob2xkX25hbWUpKSB7XHJcbiAgICAgICAgb2JqW25ld19uYW1lXSA9IG9ialtvbGRfbmFtZV1cclxuICAgICAgICBkZWxldGUgb2JqW29sZF9uYW1lXVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG9ialxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIE1pc2MgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG4vLyBodHRwOi8vY3NzLXRyaWNrcy5jb20vc25pcHBldHMvamF2YXNjcmlwdC9nZXQtdXJsLXZhcmlhYmxlcy9cclxuay5nZXRRdWVyeVZhcmlhYmxlID0gZnVuY3Rpb24odmFyaWFibGUpIHtcclxuICAgICAgIHZhciBxdWVyeSA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyaW5nKDEpXHJcbiAgICAgICB2YXIgdmFycyA9IHF1ZXJ5LnNwbGl0KFwiJlwiKVxyXG4gICAgICAgZm9yICh2YXIgaT0wO2k8dmFycy5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgICAgICAgIHZhciBwYWlyID0gdmFyc1tpXS5zcGxpdChcIj1cIilcclxuICAgICAgICAgICAgICAgaWYocGFpclswXSA9PSB2YXJpYWJsZSl7XHJcbiAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFpclsxXVxyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgICAgICByZXR1cm4oZmFsc2UpXHJcbn1cclxuXHJcbmsuc3RyX3JlcGVhdCA9IGZ1bmN0aW9uKHN0cmluZywgY291bnQpIHtcclxuICAgIGlmIChjb3VudCA8IDEpIHJldHVybiAnJ1xyXG4gICAgdmFyIHJlc3VsdCA9ICcnXHJcbiAgICB2YXIgcGF0dGVybiA9IHN0cmluZy52YWx1ZU9mKClcclxuICAgIHdoaWxlIChjb3VudCA+IDApIHtcclxuICAgICAgICBpZiAoY291bnQgJiAxKSByZXN1bHQgKz0gcGF0dGVyblxyXG4gICAgICAgIGNvdW50ID4+PSAxXHJcbiAgICAgICAgcGF0dGVybiArPSBwYXR0ZXJuXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0XHJcbn1cclxuXHJcbmsub2JqX25hbWVzID0gZnVuY3Rpb24oIG9iamVjdCApIHtcclxuICAgIGlmKCBvYmplY3QgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICB2YXIgYSA9IFtdO1xyXG4gICAgICAgIGZvciggdmFyIGlkIGluIG9iamVjdCApIHtcclxuICAgICAgICAgICAgaWYoIG9iamVjdC5oYXNPd25Qcm9wZXJ0eShpZCkgKSAge1xyXG4gICAgICAgICAgICAgICAgYS5wdXNoKGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYTtcclxuICAgIH1cclxufVxyXG5cclxuay5vYmpJZEFycmF5ID0gZnVuY3Rpb24oIG9iamVjdCApIHtcclxuICAgIGlmKCBvYmplY3QgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICB2YXIgYSA9IFtdO1xyXG4gICAgICAgIGZvciggdmFyIGlkIGluIG9iamVjdCApIHtcclxuICAgICAgICAgICAgaWYoIG9iamVjdC5oYXNPd25Qcm9wZXJ0eShpZCkgKSAge1xyXG4gICAgICAgICAgICAgICAgYS5wdXNoKGlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBNYXRoLCBudW1iZXJzIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuLypcclxuICogIG5vcm1SYW5kOiByZXR1cm5zIG5vcm1hbGx5IGRpc3RyaWJ1dGVkIHJhbmRvbSBudW1iZXJzXHJcbiAqICBodHRwOi8vbWVtb3J5LnBzeWNoLm11bi5jYS90ZWNoL3NuaXBwZXRzL3JhbmRvbV9ub3JtYWwvXHJcbiAqL1xyXG5rLm5vcm1SYW5kID0gZnVuY3Rpb24obXUsIHNpZ21hKSB7XHJcbiAgICB2YXIgeDEsIHgyLCByYWQ7XHJcblxyXG4gICAgZG8ge1xyXG4gICAgICAgIHgxID0gMiAqIE1hdGgucmFuZG9tKCkgLSAxO1xyXG4gICAgICAgIHgyID0gMiAqIE1hdGgucmFuZG9tKCkgLSAxO1xyXG4gICAgICAgIHJhZCA9IHgxICogeDEgKyB4MiAqIHgyO1xyXG4gICAgfSB3aGlsZShyYWQgPj0gMSB8fCByYWQgPT09IDApO1xyXG5cclxuICAgIHZhciBjID0gTWF0aC5zcXJ0KC0yICogTWF0aC5sb2cocmFkKSAvIHJhZCk7XHJcbiAgICB2YXIgbiA9IHgxICogYztcclxuICAgIHJldHVybiAobiAqIG11KSArIHNpZ21hO1xyXG59XHJcblxyXG5rLnBhZF96ZXJvID0gZnVuY3Rpb24obnVtLCBzaXplKXtcclxuICAgIHZhciBzID0gJzAwMDAwMDAwMCcgKyBudW1cclxuICAgIHJldHVybiBzLnN1YnN0cihzLmxlbmd0aC1zaXplKVxyXG59XHJcblxyXG5cclxuay51cHRpbWUgPSBmdW5jdGlvbihib290X3RpbWUpe1xyXG4gICAgdmFyIHVwdGltZV9zZWNvbmRzX3RvdGFsID0gbW9tZW50KCkuZGlmZihib290X3RpbWUsICdzZWNvbmRzJylcclxuICAgIHZhciB1cHRpbWVfaG91cnMgPSBNYXRoLmZsb29yKCAgdXB0aW1lX3NlY29uZHNfdG90YWwgLyg2MCo2MCkgKVxyXG4gICAgdmFyIG1pbnV0ZXNfbGVmdCA9IHVwdGltZV9zZWNvbmRzX3RvdGFsICUoNjAqNjApXHJcbiAgICB2YXIgdXB0aW1lX21pbnV0ZXMgPSBrLnBhZF96ZXJvKCBNYXRoLmZsb29yKCAgbWludXRlc19sZWZ0IC82MCApLCAyIClcclxuICAgIHZhciB1cHRpbWVfc2Vjb25kcyA9IGsucGFkX3plcm8oIChtaW51dGVzX2xlZnQgJSA2MCksIDIgKVxyXG4gICAgcmV0dXJuIHVwdGltZV9ob3VycyArXCI6XCIrIHVwdGltZV9taW51dGVzICtcIjpcIisgdXB0aW1lX3NlY29uZHNcclxufVxyXG5cclxuXHJcblxyXG5rLmxhc3Rfbl92YWx1ZXMgPSBmdW5jdGlvbihuKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbjogbixcclxuICAgICAgICBhcnJheTogW10sXHJcbiAgICAgICAgYWRkOiBmdW5jdGlvbihuZXdfdmFsdWUpe1xyXG4gICAgICAgICAgICB0aGlzLmFycmF5LnB1c2gobmV3X3ZhbHVlKVxyXG4gICAgICAgICAgICBpZiggdGhpcy5hcnJheS5sZW5ndGggPiBuICkgdGhpcy5hcnJheS5zaGlmdCgpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFycmF5XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5rLmFycmF5TWF4ID0gZnVuY3Rpb24obnVtQXJyYXkpIHtcclxuICAgIHJldHVybiBNYXRoLm1heC5hcHBseShudWxsLCBudW1BcnJheSk7XHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEFKQVggLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmsuQUpBWCA9IGZ1bmN0aW9uKHVybCwgY2FsbGJhY2ssIG9iamVjdCkge1xyXG4gICAgdmFyIHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICB4bWxodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh4bWxodHRwLnJlYWR5U3RhdGUgPT0gWE1MSHR0cFJlcXVlc3QuRE9ORSApIHtcclxuICAgICAgICAgICAgaWYoeG1saHR0cC5zdGF0dXMgPT0gMjAwKXtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHhtbGh0dHAucmVzcG9uc2VUZXh0LCBvYmplY3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYoeG1saHR0cC5zdGF0dXMgPT0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVGhlcmUgd2FzIGFuIGVycm9yIDQwMCcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc29tZXRoaW5nIGVsc2Ugb3RoZXIgdGhhbiAyMDAgd2FzIHJldHVybmVkJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB4bWxodHRwLm9wZW4oXCJHRVRcIiwgdXJsLCB0cnVlKTtcclxuICAgIHhtbGh0dHAuc2VuZCgpO1xyXG59XHJcblxyXG5rLnBhcnNlQ1NWID0gZnVuY3Rpb24oZmlsZV9jb250ZW50KSB7XHJcbiAgICB2YXIgciA9IFtdXHJcbiAgICB2YXIgbGluZXMgPSBmaWxlX2NvbnRlbnQuc3BsaXQoJ1xcbicpO1xyXG4gICAgdmFyIGhlYWRlciA9IGxpbmVzLnNoaWZ0KCkuc3BsaXQoJywnKTtcclxuICAgIGhlYWRlci5mb3JFYWNoKGZ1bmN0aW9uKGVsZW0sIGlkKXtcclxuICAgICAgICBoZWFkZXJbaWRdID0gZWxlbS50cmltKCk7XHJcbiAgICB9KTtcclxuICAgIGZvcih2YXIgbCA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgbCA8IGxlbjsgbCsrKXtcclxuICAgICAgICB2YXIgbGluZSA9IGxpbmVzW2xdO1xyXG4gICAgICAgIGlmKGxpbmUubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgIHZhciBsaW5lX29iaiA9IHt9O1xyXG4gICAgICAgICAgICBsaW5lLnNwbGl0KCcsJykuZm9yRWFjaChmdW5jdGlvbihpdGVtLGkpe1xyXG4gICAgICAgICAgICAgICAgbGluZV9vYmpbaGVhZGVyW2ldXSA9IGl0ZW0udHJpbSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgci5wdXNoKGxpbmVfb2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4ocik7XHJcbn07XHJcblxyXG5rLmdldENTViA9IGZ1bmN0aW9uKFVSTCwgY2FsbGJhY2spIHtcclxuICAgIGsuQUpBWChVUkwsIGsucGFyc2VDU1YoKSApXHJcbn1cclxuXHJcbi8qXHJcbiQuYWpheFNldHVwICh7XHJcbiAgICBjYWNoZTogZmFsc2VcclxufSlcclxuXHJcblxyXG5cclxuay5nZXRfSlNPTiA9IGZ1bmN0aW9uKFVSTCwgY2FsbGJhY2ssIHN0cmluZykge1xyXG4vLyAgICB2YXIgZmlsZW5hbWUgPSBVUkwuc3BsaXQoJy8nKS5wb3AoKVxyXG4vLyAgICBjb25zb2xlLmxvZyhVUkwpXHJcbiAgICAkLmdldEpTT04oIFVSTCwgZnVuY3Rpb24oIGpzb24gKSB7XHJcbiAgICAgICAgY2FsbGJhY2soanNvbiwgVVJMLCBzdHJpbmcpXHJcbiAgICB9KS5mYWlsKGZ1bmN0aW9uKGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCBcImVycm9yXCIsIHRleHRTdGF0dXMsIGVycm9yICApXHJcbiAgICB9KVxyXG59XHJcblxyXG5cclxuay5sb2FkX2ZpbGVzID0gZnVuY3Rpb24oZmlsZV9saXN0LCBjYWxsYmFjayl7XHJcbiAgICB2YXIgZCA9IHt9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9hZF9maWxlKFVSTCl7XHJcbiAgICAgICAgdmFyIGZpbGVuYW1lID0gVVJMLnNwbGl0KCcvJykucG9wKClcclxuLy8gICAgICAgIHZhciBuYW1lID0gZmlsZW5hbWUuc3BsaXQoJy4nKVswXVxyXG4gICAgICAgICQuZ2V0SlNPTiggVVJMLCBmdW5jdGlvbigganNvbiApIHsgLy8gLCB0ZXh0U3RhdHVzLCBqcVhIUikge1xyXG4gICAgICAgICAgICBhZGRfSlNPTihmaWxlbmFtZSwganNvbilcclxuICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uKGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggXCJlcnJvclwiLCB0ZXh0U3RhdHVzLCBlcnJvciAgKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYWRkX0pTT04obmFtZSwganNvbil7XHJcbiAgICAgICAgZFtuYW1lXSA9IGpzb25cclxuICAgICAgICBpZihPYmplY3Qua2V5cyhkKS5sZW5ndGggPT0gZF9maWxlcy5sZW5ndGgpe1xyXG4gICAgICAgICAgICBjYWxsYmFjayhkKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IoIHZhciBrZXkgaW4gZmlsZV9saXN0KXtcclxuICAgICAgICB2YXIgVVJMID0gZmlsZV9saXN0W2tleV1cclxuICAgICAgICBsb2FkX2ZpbGUoVVJMKVxyXG4gICAgfVxyXG5cclxuLy8gICAgY2FsbGJhY2soZClcclxufVxyXG5cclxuay5nZXRGaWxlID0gZnVuY3Rpb24oVVJMLCBjYWxsYmFjayl7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogVVJMLFxyXG4gICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKCB4aHIgKSB7XHJcbiAgICAgICAgICAgIHhoci5vdmVycmlkZU1pbWVUeXBlKCBcInRleHQvcGxhaW47IGNoYXJzZXQ9eC11c2VyLWRlZmluZWRcIiApO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICAuZG9uZShmdW5jdGlvbiggZGF0YSApIHtcclxuICAgICAgICBjYWxsYmFjayhkYXRhKVxyXG4gICAgfSlcclxuICAgIC5mYWlsKGZ1bmN0aW9uKGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggXCJlcnJvclwiLCB0ZXh0U3RhdHVzLCBlcnJvciAgKVxyXG4gICAgfSlcclxuXHJcblxyXG59XHJcbiovXHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEhUTUwgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG5cclxuXHJcbmsuc2V0dXBfYm9keSA9IGZ1bmN0aW9uKHRpdGxlLCBzZWN0aW9ucyl7XHJcbiAgICBkb2N1bWVudC50aXRsZSA9IHRpdGxlXHJcbiAgICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHlcclxuICAgIHZhciBzdGF0dXNfYmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxuICAgIHN0YXR1c19iYXIuaWQgPSAnc3RhdHVzJ1xyXG4gICAgc3RhdHVzX2Jhci5pbm5lckhUTUwgPSAnbG9hZGluZyBzdGF0dXMuLi4nXHJcbiAgICAvKlxyXG4gICAgdmFyIHRpdGxlX2hlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJylcclxuICAgIHRpdGxlX2hlYWRlci5pbm5lckhUTUwgPSB0aXRsZVxyXG4gICAgYm9keS5pbnNlcnRCZWZvcmUodGl0bGVfaGVhZGVyLCBib2R5LmZpcnN0Q2hpbGQpXHJcbiAgICAqL1xyXG4gICAgYm9keS5pbnNlcnRCZWZvcmUoc3RhdHVzX2JhciwgYm9keS5maXJzdENoaWxkKVxyXG4gICAgLypcclxuICAgIHZhciB0YWJzX2RpdiA9IGsubWFrZV90YWJzKHNlY3Rpb25zKVxyXG4gICAgJCgnYm9keScpLmFwcGVuZCh0YWJzX2RpdilcclxuICAgICQoICcudGFicycgKS50YWJzKHtcclxuICAgICAgICBhY3RpdmF0ZTogZnVuY3Rpb24oIGV2ZW50LCB1aSApIHtcclxuICAgICAgICAgICAgdmFyIGZ1bGxfdGl0bGUgPSB0aXRsZSArIFwiIC8gXCIgKyB1aS5uZXdUYWJbMF0udGV4dENvbnRlbnRcclxuICAgICAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBmdWxsX3RpdGxlXHJcbiAgICAgICAgICAgICQoJyN0aXRsZScpLnRleHQoZnVsbF90aXRsZSlcclxuICAgICAgICAgICAgLy9kdW1wKG1vbWVudCgpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpKVxyXG4gICAgICAgICAgICAkLnNwYXJrbGluZV9kaXNwbGF5X3Zpc2libGUoKVxyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICB2YXIgc2VjdGlvbiA9IGsuZ2V0UXVlcnlWYXJpYWJsZSgnc2VjJylcclxuICAgIGlmKHNlY3Rpb24gaW4gc2VjdGlvbnMpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSAkKCcudGFicyBhW2hyZWY9XCIjJytzZWN0aW9uKydcIl0nKS5wYXJlbnQoKS5pbmRleCgpXHJcbiAgICAgICAgJChcIi50YWJzXCIpLnRhYnMoXCJvcHRpb25cIiwgXCJhY3RpdmVcIiwgaW5kZXgpXHJcbiAgICB9XHJcbiAgICAqL1xyXG5cclxufVxyXG4vKlxyXG5rLm1ha2VfdGFicyA9IGZ1bmN0aW9uKHNlY3Rpb25fb2JqKXtcclxuICAgIHZhciB0YWJzX2RpdiA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ3RhYnMnKVxyXG4gICAgdmFyIGhlYWRfZGl2ID0gJCgnPHVsPicpLmFwcGVuZFRvKHRhYnNfZGl2KVxyXG5cclxuICAgIGZvciAodmFyIGlkIGluIHNlY3Rpb25fb2JqKXtcclxuICAgICAgICB2YXIgdGl0bGUgPSBzZWN0aW9uX29ialtpZF1cclxuICAgICAgICAvLygnPGxpPjxhIGhyZWY9XCIjJytpZCsnXCI+Jyt0aXRsZSsnPC9hPjwvbGk+JykpXHJcbiAgICAgICAgLy8oJzxkaXYgaWQ9XCInK2lkKydcIj48L2Rpdj4nKSlcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGFic19kaXZcclxufVxyXG5cclxuKi9cclxuay51cGRhdGVfc3RhdHVzX3BhZ2UgPSBmdW5jdGlvbihzdGF0dXNfaWQsIGJvb3RfdGltZSwgc3RyaW5nKSB7XHJcbiAgICB2YXIgc3RhdHVzX2RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHN0YXR1c19pZClcclxuICAgIHN0YXR1c19kaXYuaW5uZXJIVE1MID0gc3RyaW5nXHJcbiAgICBzdGF0dXNfZGl2LmlubmVySFRNTCArPSAnIHwgJ1xyXG5cclxuICAgIHZhciBjbG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgY2xvY2suaW5uZXJIVE1MID0gbW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJylcclxuXHJcbiAgICB2YXIgdXB0aW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgICB1cHRpbWUuaW5uZXJIVE1MID0gJ1VwdGltZTogJyArIGsudXB0aW1lKGJvb3RfdGltZSlcclxuXHJcbiAgICBzdGF0dXNfZGl2LmFwcGVuZENoaWxkKGNsb2NrKVxyXG4gICAgc3RhdHVzX2Rpdi5pbm5lckhUTUwgKz0gJyB8ICdcclxuICAgIHN0YXR1c19kaXYuYXBwZW5kQ2hpbGQodXB0aW1lKVxyXG4gICAgc3RhdHVzX2Rpdi5pbm5lckhUTUwgKz0gJyB8ICdcclxufVxyXG5cclxuLypcclxuay5vYmpfbG9nID0gZnVuY3Rpb24ob2JqLCBvYmpfbmFtZSwgbWF4X2xldmVsKXtcclxuICAgIHZhciBsZXZlbHMgPSBmdW5jdGlvbihvYmosIGxldmVsX2luZGVudCwgc3RyKXtcclxuICAgICAgICBmb3IodmFyIG5hbWUgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gb2JqW25hbWVdXHJcbiAgICAgICAgICAgIGlmKCBsZXZlbF9pbmRlbnQgPD0gbWF4X2xldmVsICYmIHR5cGVvZihpdGVtKSA9PSAnb2JqZWN0JyApIHtcclxuICAgICAgICAgICAgICAgIHN0ciArPSBcIlxcblwiICsgay5zdHJfcmVwZWF0KFwiIFwiLCBsZXZlbF9pbmRlbnQqMikgKyBuYW1lXHJcbiAgICAgICAgICAgICAgICBzdHIgPSBsZXZlbHMoaXRlbSwgbGV2ZWxfaW5kZW50KzEsIHN0ciApXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZih0eXBlb2YgaXRlbSAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgc3RyICs9IFwiXFxuXCIgKyBrLnN0cl9yZXBlYXQoXCIgXCIsIGxldmVsX2luZGVudCoyKSArIG5hbWUgKyBcIjogXCIgKyBpdGVtXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzdHIgKz0gXCJcXG5cIiArIGsuc3RyX3JlcGVhdChcIiBcIiwgbGV2ZWxfaW5kZW50KjIpICsgbmFtZSArIFwiOiA8ZnVuY3Rpb24+XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3RyXHJcbiAgICB9XHJcbiAgICB2YXIgbWF4X2xldmVsID0gbWF4X2xldmVsIHx8IDEwMFxyXG4gICAgY29uc29sZS5sb2cob2JqX25hbWUpXHJcbiAgICB2YXIgc3RyID0gJy0nICsgb2JqX25hbWUgKyAnLSdcclxuICAgIG1heF9sZXZlbCsrXHJcbiAgICBsZXZlbF9pbmRlbnQgPSAyXHJcbiAgICBzdHIgPSBsZXZlbHMob2JqLCBsZXZlbF9pbmRlbnQsIHN0cilcclxuICAgIGNvbnNvbGUubG9nKHN0cilcclxufVxyXG5cclxuXHJcbmsub2JqX3RyZWUgPSBmdW5jdGlvbihvYmosIHRpdGxlKXtcclxuICAgIC8vIHRha2VzIGEgamF2YXNjcmlwdCwgYW5kIHJldHVyZW5zIGEganF1ZXJ5IERJVlxyXG4gICAgdmFyIG9ial9kaXYgPSAkKCc8cHJlPicpIC8vLmFkZENsYXNzKCdib3gnKVxyXG4gICAgdmFyIGxldmVscyA9IGZ1bmN0aW9uKG9iaiwgbGV2ZWxfaW5kZW50KXsobGluZSwgY2lyY2xlLCB0ZXh0IClcclxuICAgICAgICB2YXIgbGlzdCA9IFtdXHJcbiAgICAgICAgdmFyIG9ial9sZW5ndGggPSAwXHJcbiAgICAgICAgZm9yKCB2YXIga2V5IGluIG9iaikge29ial9sZW5ndGgrK31cclxuICAgICAgICB2YXIgY291bnQgPSAwXHJcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gb2JqW2tleV1cclxuXHJcbi8vICAgICAgICAgICAgdmFyIGluZGVudF9zdHJpbmcgPSAnJm5ic3A7Jm5ic3A7Jm5ic3A7JiM5NDc0Jy5yZXBlYXQobGV2ZWwpICsgJyZuYnNwOyZuYnNwOyZuYnNwOydcclxuLy8gICAgICAgICAgICBpZihsZXZlbF9pbmRlbnQgPT09ICcnICl7XHJcbi8vICAgICAgICAgICAgICAgIG5leHRfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyZuYnNwOydcclxuLy8gICAgICAgICAgICAgICAgdGhpc19sZXZlbF9pbmRlbnQgPSBsZXZlbF9pbmRlbnQgKyAnJm5ic3A7Jm5ic3A7J1xyXG4vLyAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBpZihjb3VudCA9PSBvYmpfbGVuZ3RoLTEgKSB7ICAgLy8gSWYgbGFzdCBpdGVtLCBmaW5zaCB0cmVlIHNlY3Rpb25cclxuICAgICAgICAgICAgICAgIHZhciBuZXh0X2xldmVsX2luZGVudCA9IGxldmVsX2luZGVudCArICcmbmJzcDsmbmJzcDsnXHJcbiAgICAgICAgICAgICAgICB2YXIgdGhpc19sZXZlbF9pbmRlbnQgPSBsZXZlbF9pbmRlbnQgKyAnJm5ic3A7JiM5NDkyOyYjOTQ3MjsnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIHZhciBuZXh0X2xldmVsX2luZGVudCA9IGxldmVsX2luZGVudCArICcmbmJzcDsmIzk0NzQ7J1xyXG4gICAgICAgICAgICAgICAgdmFyIHRoaXNfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyYjOTUwMDsmIzk0NzI7J1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgaWYoIHR5cGVvZihpdGVtKSA9PSAnb2JqZWN0JyApe1xyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKCB0aGlzX2xldmVsX2luZGVudCArIGtleSlcclxuICAgICAgICAgICAgICAgIGxpc3QgPSBsaXN0LmNvbmNhdCggbGV2ZWxzKGl0ZW0sIG5leHRfbGV2ZWxfaW5kZW50KSApXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtID0gaXRlbS50b1N0cmluZygpLnJlcGxhY2UoLyhcXHJcXG58XFxufFxccikvZ20sXCIgXCIpLnJlcGxhY2UoL1xccysvZyxcIiBcIikgLy9odHRwOi8vd3d3LnRleHRmaXhlci5jb20vdHV0b3JpYWxzL2phdmFzY3JpcHQtbGluZS1icmVha3MucGhwXHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2godGhpc19sZXZlbF9pbmRlbnQgKyBrZXkrXCI6IFwiKyBpdGVtKVxyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuLy8gICAgICAgICAgICBjb25zb2xlLmxvZyhrZXksbGV2ZWwpXHJcbiAgICAgICAgICAgIGNvdW50KytcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsaXN0XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxpc3QgPSBbdGl0bGVdLmNvbmNhdChsZXZlbHMob2JqLCcnKSlcclxuICAgIGxpc3QuZm9yRWFjaCggZnVuY3Rpb24obGluZSxrZXkpe1xyXG4gICAgICAgIG9ial9kaXYuYXBwZW5kKGxpbmUgKyAnPC9icj4nKVxyXG4gICAgfSlcclxuICAgIHJldHVybiBvYmpfZGl2XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qXHJcbmsub2JqX2Rpc3BsYXkgPSBmdW5jdGlvbihvYmope1xyXG4gICAgZnVuY3Rpb24gbGV2ZWxzKG9iaixsZXZlbCl7XHJcbiAgICAvLyAgICB2YXIgc3Vib2JqX2RpdiA9ICQoJzxkaXY+JylcclxuICAgICAgICB2YXIgc3Vib2JqX3VsID0gJCgnPHVsPicpLmFkZENsYXNzKCd0cmVlJylcclxuXHJcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gb2JqW2tleV1cclxuICAgIC8vICAgICAgICBjb25zb2xlLmxvZyhrZXksIHR5cGVvZihpdGVtKSlcclxuICAgICAgICAgICAgaWYoIHR5cGVvZihpdGVtKSA9PSAnb2JqZWN0JyApe1xyXG4gICAgLy8gICAgICAgICAgICAoJzxsaT4nKS50ZXh0KFwiJm5ic3A7XCIucmVwZWF0KGxldmVsKSArIGtleSkpXHJcbiAgICAgICAgICAgICAgICAoJzxsaT4nKS50ZXh0KGtleSkpXHJcbiAgICAgICAgICAgICAgICBzdWJvYmpfdWwuYXBwZW5kKGxldmVscyhpdGVtLGxldmVsKzEpKVxyXG4gICAgLy8gICAgICAgICAgICBjb25zb2xlLmxvZyhcIiZuYnNwO1wiLnJlcGVhdChsZXZlbCkgKyBrZXkpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgIHN1Ym9ial9kaXYuYXBwZW5kKCc8c3Bhbj4nKS50ZXh0KFwiJm5ic3A7XCIucmVwZWF0KGxldmVsKSArIGtleStcIjogXCIrIGl0ZW0pXHJcbiAgICAvLyAgICAgICAgICAgICgnPGxpPicpLnRleHQoXCImbmJzcDtcIi5yZXBlYXQobGV2ZWwpICsga2V5ICtcIjogXCIrIGl0ZW0pKVxyXG4gICAgICAgICAgICAgICAgKCc8bGk+JykudGV4dChrZXkgK1wiOiBcIisgaXRlbSkpXHJcbiAgICAvLyAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiJm5ic3A7XCIucmVwZWF0KGxldmVsKSArIGtleStcIjogXCIrIGl0ZW0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN1Ym9ial91bFxyXG4gICAgfVxyXG4gICAgLy8gdGFrZXMgYSBqYXZhc2NyaXB0LCBhbmQgcmV0dXJlbnMgYSBqcXVlcnkgRElWXHJcbiAgICB2YXIgb2JqX2RpdiA9ICQoJzxkaXY+JykvLy5hZGRDbGFzcygnYm94JylcclxuXHJcbiAgICBvYmpfZGl2LmFwcGVuZChsZXZlbHMob2JqLDApKVxyXG4gICAgcmV0dXJuIG9ial9kaXZcclxufVxyXG5cclxuay5zaG93X29iaiA9IGZ1bmN0aW9uKGNvbnRhaW5lcl9pZCwgb2JqLCBuYW1lKXtcclxuICAgIHZhciBpZCA9ICcjJyArIG5hbWVcclxuICAgIGlmKCAhICQoY29udGFpbmVyX2lkKS5jaGlsZHJlbihpZCkubGVuZ3RoICkge1xyXG4gICAgICAgICgnPGRpdj4nKS5hdHRyKCdpZCcsIG5hbWUpKVxyXG4gICAgfVxyXG4gICAgdmFyIGJveCA9ICQoY29udGFpbmVyX2lkKS5jaGlsZHJlbihpZClcclxuICAgIGJveC5lbXB0eSgpXHJcblxyXG4gICAgdmFyIG9ial9kaXYgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdib3gnKVxyXG4gICAgb2JqX2Rpdi5hcHBlbmQoay5vYmpfdHJlZShvYmosIG5hbWUpKVxyXG4gICAgYm94LmFwcGVuZChvYmpfZGl2KVxyXG5cclxufVxyXG5cclxuKi9cclxuay5sb2dfb2JqZWN0X3RyZWUgPSBmdW5jdGlvbihjb21wb25lbnRzKXtcclxuICAgIGZvciggdmFyIG1ha2UgaW4gY29tcG9uZW50cy5tb2R1bGVzICl7XHJcbiAgICAgICAgaWYoIGNvbXBvbmVudHMubW9kdWxlcy5oYXNPd25Qcm9wZXJ0eShtYWtlKSl7XHJcbiAgICAgICAgICAgIGZvciggdmFyIG1vZGVsIGluIGNvbXBvbmVudHMubW9kdWxlc1ttYWtlXSApe1xyXG4gICAgICAgICAgICAgICAgaWYoIGNvbXBvbmVudHMubW9kdWxlc1ttYWtlXS5oYXNPd25Qcm9wZXJ0eShtb2RlbCkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvID0gY29tcG9uZW50cy5tb2R1bGVzW21ha2VdW21vZGVsXVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhID0gW21ha2UsbW9kZWxdXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKCB2YXIgc3BlYyBpbiBvICl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBvLmhhc093blByb3BlcnR5KHNwZWMpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGEucHVzaChvW3NwZWNdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhLmpvaW4oJywnKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEZTRUMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG5cclxuXHJcbmsuY3IxMDAwX2pzb24gPSBmdW5jdGlvbihqc29uKXtcclxuLy8gICAgdmFyIGZpZWxkcyA9IFtdXHJcbi8vICAgICQuZWFjaChqc29uLmhlYWQuZmllbGRzLCBmdW5jdGlvbihrZXksIGZpZWxkKSB7XHJcbi8vICAgICAgICBmaWVsZHMucHVzaChmaWVsZC5uYW1lKVxyXG4vLyAgICB9KVxyXG4vLyAgICB2YXIgZGF0YSA9IF8uemlwKGZpZWxkcywganNvbi5kYXRhWzBdLnZhbHMpXHJcbi8vXHJcbiAgICB2YXIgdGltZXN0YW1wID0ganNvbi5kYXRhWzBdLnRpbWVcclxuICAgIHZhciBkYXRhID0ge31cclxuICAgIGRhdGEuVGltZXN0YW1wID0ganNvbi5kYXRhWzBdLnRpbWVcclxuICAgIGRhdGEuUmVjb3JkTnVtID0ganNvbi5kYXRhWzBdLm5vXHJcbiAgICBmb3IodmFyIGkgPSAwLCBsID0ganNvbi5oZWFkLmZpZWxkcy5sZW5ndGg7IGkgPCBsOyBpKysgKXtcclxuICAgICAgICBkYXRhW2pzb24uaGVhZC5maWVsZHNbaV0ubmFtZV0gPSBqc29uLmRhdGFbMF0udmFsc1tpXVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBkYXRhXHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEQzIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG5cclxuay5kMyA9IHt9XHJcblxyXG5rLmQzLmxpdmVfc3BhcmtsaW5lID0gZnVuY3Rpb24oaWQsIGhpc3RvcnkpIHtcclxuICAgIHZhciBkYXRhID0gaGlzdG9yeS5hcnJheVxyXG4gICAgdmFyIGxlbmd0aCA9IGhpc3RvcnkuYXJyYXkubGVuZ3RoXHJcbiAgICB2YXIgbiA9IGhpc3RvcnkublxyXG4gICAgLy9rLmQzLmxpdmVfc3BhcmtsaW5lID0gZnVuY3Rpb24oaWQsIHdpZHRoLCBoZWlnaHQsIGludGVycG9sYXRpb24sIGFuaW1hdGUsIHVwZGF0ZURlbGF5LCB0cmFuc2l0aW9uRGVsYXkpIHtcclxuICAgIC8vIGJhc2VkIG9uIGNvZGUgcG9zdGVkIGJ5IEJlbiBDaHJpc3RlbnNlbiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9iZW5qY2hyaXN0ZW5zZW4vMTE0ODM3NFxyXG5cclxuICAgIHZhciB3aWR0aCA9IDQwMCxcclxuICAgICAgICBoZWlnaHQgPSA1MCxcclxuICAgICAgICBpbnRlcnBvbGF0aW9uID0gJ2Jhc2lzJyxcclxuICAgICAgICBhbmltYXRlID0gdHJ1ZSxcclxuICAgICAgICB1cGRhdGVEZWxheSA9IDEwMDAsXHJcbiAgICAgICAgdHJhbnNpdGlvbkRlbGF5ID0gMTAwMFxyXG5cclxuICAgIC8vIFggc2NhbGUgd2lsbCBmaXQgdmFsdWVzIGZyb20gMC0xMCB3aXRoaW4gcGl4ZWxzIDAtMTAwXHJcbiAgICAvLyBzdGFydGluZyBwb2ludCBpcyAtNSBzbyB0aGUgZmlyc3QgdmFsdWUgZG9lc24ndCBzaG93IGFuZCBzbGlkZXMgb2ZmIHRoZSBlZGdlIGFzIHBhcnQgb2YgdGhlIHRyYW5zaXRpb25cclxuICAgIHZhciB4ID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFswLCA1OV0pLnJhbmdlKFswLCB3aWR0aF0pO1xyXG4gICAgLy8gWSBzY2FsZSB3aWxsIGZpdCB2YWx1ZXMgZnJvbSAwLTEwIHdpdGhpbiBwaXhlbHMgMC0xMDBcclxuICAgIHZhciB5ID0gZDMuc2NhbGUubGluZWFyKCkuZG9tYWluKFsyMCwgNDBdKS5yYW5nZShbaGVpZ2h0LCAwXSk7XHJcblxyXG4gICAgLy8gY3JlYXRlIGEgbGluZSBvYmplY3QgdGhhdCByZXByZXNlbnRzIHRoZSBTVk4gbGluZSB3ZSdyZSBjcmVhdGluZ1xyXG4gICAgdmFyIGxpbmUgPSBkMy5zdmcubGluZSgpXHJcbiAgICAgICAgLy8gYXNzaWduIHRoZSBYIGZ1bmN0aW9uIHRvIHBsb3Qgb3VyIGxpbmUgYXMgd2Ugd2lzaFxyXG4gICAgICAgIC54KGZ1bmN0aW9uKGQsaSkge1xyXG4gICAgICAgICAgICAvLyB2ZXJib3NlIGxvZ2dpbmcgdG8gc2hvdyB3aGF0J3MgYWN0dWFsbHkgYmVpbmcgZG9uZVxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdQbG90dGluZyBYIHZhbHVlIGZvciBkYXRhIHBvaW50OiAnICsgZCArICcgdXNpbmcgaW5kZXg6ICcgKyBpICsgJyB0byBiZSBhdDogJyArIHgoaSkgKyAnIHVzaW5nIG91ciB4U2NhbGUuJyk7XHJcbiAgICAgICAgICAgIC8vIHJldHVybiB0aGUgWCBjb29yZGluYXRlIHdoZXJlIHdlIHdhbnQgdG8gcGxvdCB0aGlzIGRhdGFwb2ludFxyXG4gICAgICAgICAgICByZXR1cm4geChpKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC55KGZ1bmN0aW9uKGQpIHtcclxuICAgICAgICAgICAgLy8gdmVyYm9zZSBsb2dnaW5nIHRvIHNob3cgd2hhdCdzIGFjdHVhbGx5IGJlaW5nIGRvbmVcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnUGxvdHRpbmcgWSB2YWx1ZSBmb3IgZGF0YSBwb2ludDogJyArIGQgKyAnIHRvIGJlIGF0OiAnICsgeShkKSArIFwiIHVzaW5nIG91ciB5U2NhbGUuXCIpO1xyXG4gICAgICAgICAgICAvLyByZXR1cm4gdGhlIFkgY29vcmRpbmF0ZSB3aGVyZSB3ZSB3YW50IHRvIHBsb3QgdGhpcyBkYXRhcG9pbnRcclxuICAgICAgICAgICAgcmV0dXJuIHkoZCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuaW50ZXJwb2xhdGUoaW50ZXJwb2xhdGlvbilcclxuXHJcbiAgICAvLyBJZiBzdmcgZG9lcyBub3QgZXhpc3QsIGNyZWF0ZSBpdFxyXG4gICAgaWYoICEgZDMuc2VsZWN0KCcjJytpZCkuc2VsZWN0KCdzdmcnKVswXVswXSApe1xyXG4gICAgICAgIC8vIGNyZWF0ZSBhbiBTVkcgZWxlbWVudCBpbnNpZGUgdGhlICNncmFwaCBkaXYgdGhhdCBmaWxscyAxMDAlIG9mIHRoZSBkaXZcclxuICAgICAgICB2YXIgZ3JhcGggPSBkMy5zZWxlY3QoJyMnK2lkKS5hcHBlbmQoXCJzdmc6c3ZnXCIpLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCkuYXR0cihcImhlaWdodFwiLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICAvLyBkaXNwbGF5IHRoZSBsaW5lIGJ5IGFwcGVuZGluZyBhbiBzdmc6cGF0aCBlbGVtZW50IHdpdGggdGhlIGRhdGEgbGluZSB3ZSBjcmVhdGVkIGFib3ZlXHJcbi8vICAgICAgICBncmFwaC5hcHBlbmQoXCJzdmc6cGF0aFwiKS5hdHRyKFwiZFwiLCBsaW5lKGRhdGEpKTtcclxuICAgICAgICAvLyBvciBpdCBjYW4gYmUgZG9uZSBsaWtlIHRoaXNcclxuICAgICAgICBncmFwaC5zZWxlY3RBbGwoXCJwYXRoXCIpLmRhdGEoW2RhdGFdKS5lbnRlcigpLmFwcGVuZChcInN2ZzpwYXRoXCIpLmF0dHIoXCJkXCIsIGxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBncmFwaCA9IGQzLnNlbGVjdCgnIycraWQrJyBzdmcnKVxyXG4gICAgY29uc29sZS5sb2coIGxlbmd0aClcclxuICAgIC8vIHVwZGF0ZSB3aXRoIGFuaW1hdGlvblxyXG4gICAgZ3JhcGguc2VsZWN0QWxsKFwicGF0aFwiKVxyXG4gICAgICAgIC5kYXRhKFtkYXRhXSkgLy8gc2V0IHRoZSBuZXcgZGF0YVxyXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgeChuLWxlbmd0aCArMSkgKyBcIilcIikgLy8gc2V0IHRoZSB0cmFuc2Zvcm0gdG8gdGhlIHJpZ2h0IGJ5IHgoMSkgcGl4ZWxzICg2IGZvciB0aGUgc2NhbGUgd2UndmUgc2V0KSB0byBoaWRlIHRoZSBuZXcgdmFsdWVcclxuICAgICAgICAuYXR0cihcImRcIiwgbGluZSkgLy8gYXBwbHkgdGhlIG5ldyBkYXRhIHZhbHVlcyAuLi4gYnV0IHRoZSBuZXcgdmFsdWUgaXMgaGlkZGVuIGF0IHRoaXMgcG9pbnQgb2ZmIHRoZSByaWdodCBvZiB0aGUgY2FudmFzXHJcbiAgICAgICAgLnRyYW5zaXRpb24oKSAvLyBzdGFydCBhIHRyYW5zaXRpb24gdG8gYnJpbmcgdGhlIG5ldyB2YWx1ZSBpbnRvIHZpZXdcclxuICAgICAgICAuZWFzZShcImxpbmVhclwiKVxyXG4gICAgICAgIC5kdXJhdGlvbih0cmFuc2l0aW9uRGVsYXkpIC8vIGZvciB0aGlzIGRlbW8gd2Ugd2FudCBhIGNvbnRpbnVhbCBzbGlkZSBzbyBzZXQgdGhpcyB0byB0aGUgc2FtZSBhcyB0aGUgc2V0SW50ZXJ2YWwgYW1vdW50IGJlbG93XHJcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyB4KG4tbGVuZ3RoKSArIFwiKVwiKTsgLy8gYW5pbWF0ZSBhIHNsaWRlIHRvIHRoZSBsZWZ0IGJhY2sgdG8geCgwKSBwaXhlbHMgdG8gcmV2ZWFsIHRoZSBuZXcgdmFsdWVcclxuXHJcbiAgICAgICAgLyogdGhhbmtzIHRvICdiYXJyeW0nIGZvciBleGFtcGxlcyBvZiB0cmFuc2Zvcm06IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tLzExMzcxMzEgKi9cclxuLy8gICAgIGdyYXBoLmFwcGVuZChcInJlY3RcIilcclxuLy8gICAgICAgICAgLmF0dHIoXCJ4XCIsIDApXHJcbi8vICAgICAgICAgIC5hdHRyKFwieVwiLCAwKVxyXG4vLyAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQpXHJcbi8vICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXHJcbi8vICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCAnI2YwMCcpXHJcbi8vICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgXCJub25lXCIpXHJcbi8vICAgICAgICAgIC5zdHlsZShcInN0cm9rZS13aWR0aFwiLCAnMXB4JylcclxuXHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRXZlbnRzIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuay5lID0ge31cclxuXHJcbmsudXB0aW1lID0gZnVuY3Rpb24oYm9vdF90aW1lKXtcclxuICAgIHZhciB1cHRpbWVfc2Vjb25kc190b3RhbCA9IG1vbWVudCgpLmRpZmYoYm9vdF90aW1lLCAnc2Vjb25kcycpXHJcbiAgICB2YXIgdXB0aW1lX2hvdXJzID0gTWF0aC5mbG9vciggIHVwdGltZV9zZWNvbmRzX3RvdGFsIC8oNjAqNjApIClcclxuICAgIHZhciBtaW51dGVzX2xlZnQgPSB1cHRpbWVfc2Vjb25kc190b3RhbCAlKDYwKjYwKVxyXG4gICAgdmFyIHVwdGltZV9taW51dGVzID0gay5wYWRfemVybyggTWF0aC5mbG9vciggIG1pbnV0ZXNfbGVmdCAvNjAgKSwgMiApXHJcbiAgICB2YXIgdXB0aW1lX3NlY29uZHMgPSBrLnBhZF96ZXJvKCAobWludXRlc19sZWZ0ICUgNjApLCAyIClcclxuICAgIHJldHVybiB1cHRpbWVfaG91cnMgK1wiOlwiKyB1cHRpbWVfbWludXRlcyArXCI6XCIrIHVwdGltZV9zZWNvbmRzXHJcbn1cclxuXHJcbmsuZS5hZGRUaW1lU2luY2UgPSBmdW5jdGlvbihldmVudF9saXN0KXtcclxuICAgIGNvbnNvbGUubG9nKG1vbWVudCgpLmZvcm1hdCgnWVlZWS1NTS1ERCcpKVxyXG4gICAgY29uc29sZS5sb2cobW9tZW50KCkuZnJvbU5vdygpKVxyXG4gICAgZXZlbnRfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICB2YXIgZGF0ZV9hcnJheSA9IGV2ZW50LmRhdGUuc3BsaXQoJy0nKS5tYXAoTnVtYmVyKVxyXG4gICAgICAgIHZhciB5ZWFyID0gZGF0ZV9hcnJheVswXVxyXG4gICAgICAgIHZhciBtb250aCA9IGRhdGVfYXJyYXlbMV1cclxuICAgICAgICB2YXIgZGF5ID0gZGF0ZV9hcnJheVsyXVxyXG4gICAgICAgIHZhciB0aGlzX3llYXIgPSBtb21lbnQoKS55ZWFyKClcclxuICAgICAgICBpZihtb21lbnQoKS5kaWZmKG1vbWVudChbdGhpc195ZWFyLCBtb250aC0xLCBkYXldKSwgJ2RheXMnKSA+IDApIHt0aGlzX3llYXIrK31cclxuICAgICAgICB2YXIgZXZlbnRfbW9tZW50ID0gbW9tZW50KGV2ZW50LmRhdGUsICdZWVlZLU1NLUREJylcclxuICAgICAgICB2YXIgZGF5c19hZ28gPSBtb21lbnQoKS5kaWZmKGV2ZW50X21vbWVudCwgJ2RheScpXHJcbiAgICAgICAgZXZlbnQudGltZV9zaW5jZSA9IGV2ZW50X21vbWVudC5mcm9tTm93KClcclxuICAgICAgICBldmVudC55ZWFyc19hZ28gPSBtb21lbnQoKS5kaWZmKGV2ZW50X21vbWVudCwgJ3llYXJzJylcclxuICAgICAgICBldmVudC5kYXlzX3RpbGxfbmV4dCA9IC1tb21lbnQoKS5kaWZmKG1vbWVudChbdGhpc195ZWFyLCBtb250aC0xLCBkYXldKSwgJ2RheXMnKVxyXG4gICAgfSlcclxuICAgIGV2ZW50X2xpc3Quc29ydChmdW5jdGlvbihhLGIpe1xyXG4gICAgICAgIHJldHVybiBhLmRheXNfdGlsbF9uZXh0IC0gYi5kYXlzX3RpbGxfbmV4dFxyXG4gICAgfSlcclxuICAgIHJldHVybiBldmVudF9saXN0XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBEaXNwbGF5cyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5rLmQgPSB7fVxyXG5cclxuLypcclxuay5kID0ge1xyXG4gICAgd2lkdGg6ICcxMDAlJyxcclxuICAgIHZhbHVlOiAwLFxyXG5cclxufVxyXG5cclxuay5kLnByb3RvdHlwZS5zZXRQZXIgPSBmdW5jdGlvbihwZXJjZW50KXtcclxuICAgIHRoaXMuYmFyLmNzcygnd2lkdGgnLCBwZXJjZW50KyclJylcclxufVxyXG4qL1xyXG5cclxuXHJcbi8qXHJcbmsuZC5iYXIgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIGJhciA9IHt9XHJcblxyXG4gICAgYmFyLndpZHRoID0gMTAwXHJcbiAgICBiYXIud2lkdGhfdW5pdCA9ICclJ1xyXG4gICAgYmFyLmhlaWdodCA9ICc4cHgnXHJcblxyXG4gICAgY29uc29sZS5sb2coYmFyLndpZHRoKyclJylcclxuICAgIGJhci5kaXYgPSAkKCc8ZGl2PicpLmNzcygnd2lkdGgnLCAnMCUnKVxyXG4gICAgYmFyLmVsZW1lbnQgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdwcm9ncmVzc2JhcicpLmNzcygnd2lkdGgnLCAxMDApXHJcbiAgICBiYXIuZWxlbWVudC5hcHBlbmQoYmFyLmRpdilcclxuXHJcbiAgICBiYXIuc2V0UGVyY2VudCA9IGZ1bmN0aW9uKHBlcmNlbnQpe1xyXG4gICAgICAgIHRoaXMud2lkdGggPSBwZXJjZW50XHJcbiAgICAgICAgdGhpcy53aWR0aF91bml0ID0gJyUnXHJcbiAgICAgICAgdGhpcy51cGRhdGUoKVxyXG4gICAgfVxyXG4gICAgYmFyLnVwZGF0ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdGhpcy5kaXYuY3NzKCd3aWR0aCcsIHRoaXMud2lkdGgrdGhpcy53aWR0aF91bml0KVxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jc3MoJ2hlaWdodCcsIHRvU3RyaW5nKHRoaXMuaGVpZ2h0KSsncHgnKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJhclxyXG59XHJcbiovXHJcblxyXG5cclxuLy8gQnJvd3NlcmlmeVxyXG5tb2R1bGUuZXhwb3J0cyA9IGs7XHJcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBsb2cgPSBjb25zb2xlLmxvZy5iaW5kKGNvbnNvbGUpO1xuXG52YXIgdmFsdWUgPSByZXF1aXJlKCcuL2tfRE9NX2V4dHJhLmpzJykudmFsdWU7XG52YXIgc2VsZWN0b3IgPSByZXF1aXJlKCcuL2tfRE9NX2V4dHJhLmpzJykuc2VsZWN0b3I7XG4vL2xvZyggJ3ZhbHVlJywgdmFsdWUoKSApO1xuLy9sb2coICdzZWxlY3RvcicsIHNlbGVjdG9yKCkgKTsgdmFyIGsgPSByZXF1aXJlKCcuL2snKTsgLy92YXIgc2VsZWN0b3IgPSByZXF1aXJlKCcuL2tfRE9NX2V4dHJhLmpzJykuc2VsZWN0b3I7IFxuXG5cbnZhciB3cmFwcGVyX3Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vd3JhcHBlcl9wcm90b3R5cGUnKTtcblxuLypcbnZhciB3cmFwcGVyX3Byb3RvdHlwZSA9IHtcblxuICAgIGh0bWw6IGZ1bmN0aW9uKGh0bWwpe1xuICAgICAgIHRoaXMuZWxlbS5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgYXBwZW5kOiBmdW5jdGlvbihzdWJfZWxlbWVudCl7XG4gICAgICAgIHRoaXMuZWxlbS5hcHBlbmRDaGlsZChzdWJfZWxlbWVudC5lbGVtKTsgXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgYXBwZW5kVG86IGZ1bmN0aW9uKHBhcmVudF9lbGVtZW50KXtcbiAgICAgICAgcGFyZW50X2VsZW1lbnQuYXBwZW5kKHRoaXMpOyBcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBhdHRyOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSApe1xuICAgICAgICB2YXIgYXR0cmlidXRlTmFtZTtcbiAgICAgICAgaWYoIG5hbWUgPT09ICdjbGFzcycpe1xuICAgICAgICAgICAgYXR0cmlidXRlTmFtZSA9ICdjbGFzc05hbWUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0cmlidXRlTmFtZSA9IG5hbWU7IFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbVthdHRyaWJ1dGVOYW1lXSA9IHZhbHVlOyBcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuXG5cbn07XG4qL1xuXG52YXIgV3JhcCA9IGZ1bmN0aW9uKGVsZW1lbnQpe1xuICAgIHZhciBXID0gT2JqZWN0LmNyZWF0ZSh3cmFwcGVyX3Byb3RvdHlwZSk7XG5cblxuICAgIFcuZWxlbSA9IGVsZW1lbnQ7XG4gICAgaWYoIFcuZWxlbS50YWdOYW1lID09PSBcIlNFTEVDVFwiICkge1xuICAgICAgICBXLnNldE9wdGlvbnMgPSBmdW5jdGlvbiggb3B0aW9uX2FycmF5ICkge1xuICAgICAgICAgICAgVy5lbGVtLm9wdGlvbnMubGVuZ3RoID0gMDsgXG4gICAgICAgICAgICAvL2xvZyhcIm9wdGlvbl9hcnJheVwiLCBvcHRpb25fYXJyYXkpO1xuICAgICAgICAgICAgb3B0aW9uX2FycmF5LmZvckVhY2goIGZ1bmN0aW9uKG9wdGlvbl9zdHIsaSl7XG4gICAgICAgICAgICAgICAgdmFyIG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICAgICAgICAgIG9wdC50ZXh0ID0gb3B0aW9uX3N0cjtcbiAgICAgICAgICAgICAgICBvcHQudmFsdWUgPSBvcHRpb25fc3RyO1xuICAgICAgICAgICAgICAgIFcuZWxlbS5hZGQob3B0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBXO1xuXG59O1xuXG52YXIgJCA9IGZ1bmN0aW9uKGlucHV0KXtcbiAgICB2YXIgZWxlbWVudDtcblxuICAgIGlmKCB0eXBlb2YgaW5wdXQgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAvL2xvZygnaW5wdXQgbmVlZGVkJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYoIChpbnB1dCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB8fCAoaW5wdXQgaW5zdGFuY2VvZiBTVkdFbGVtZW50KSApe1xuICAgICAgICByZXR1cm4gV3JhcChpbnB1dCk7XG4gICAgfVxuICAgIGlmKCBpbnB1dC5zdWJzdHIoMCwxKSA9PT0gJyMnICkge1xuICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaW5wdXQuc3Vic3RyKDEpKTtcbiAgICAgICAgcmV0dXJuIFdyYXAoZWxlbWVudCk7XG4gICAgfSBlbHNlIGlmKCBpbnB1dC5zdWJzdHIoMCwxKSA9PT0gJy4nICkge1xuICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5Q2xhc3NOYW1lKGlucHV0LnN1YnN0cigxKVswXSk7XG4gICAgICAgIHJldHVybiBXcmFwKGVsZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCBpbnB1dCA9PT0gJ3ZhbHVlJyApIHtcbiAgICAgICAgICAgIGlmKCB2YWx1ZSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSB2YWx1ZSgpOyBcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogdmFsdWUgbm90IGRlZmluZWRcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYoIGlucHV0ID09PSAnc2VsZWN0b3InICkge1xuICAgICAgICAgICAgaWYoIHNlbGVjdG9yICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IHNlbGVjdG9yKCk7IFxuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBzZWxlY3RvciBub3QgZGVmaW5lZFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpbnB1dCk7XG4gICAgICAgICAgICByZXR1cm4gV3JhcChlbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcblxuXG59O1xuXG4vLyBCcm93c2VyaWZ5XG5tb2R1bGUuZXhwb3J0cyA9ICQ7XG4vL21vZHVsZS5leHBvcnRzLndyYXBwZXJfcHJvdG90eXBlID0gd3JhcHBlcl9wcm90b3R5cGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBrID0gcmVxdWlyZSgnLi9rLmpzJyk7XG52YXIga29udGFpbmVyID0gcmVxdWlyZSgnLi9rb250YWluZXInKTtcblxudmFyIGtfRE9NID0gcmVxdWlyZSgnLi9rX0RPTS5qcycpO1xudmFyIHdyYXBwZXJfcHJvdG90eXBlID0gcmVxdWlyZSgnLi93cmFwcGVyX3Byb3RvdHlwZScpO1xuXG5cbnZhciBzZWxlY3Rvcl9wcm90b3R5cGUgPSB7XG4gICAgY2hhbmdlOiBmdW5jdGlvbihuZXdfdmFsdWUpe1xuICAgICAgICB0aGlzLnNldF92YWx1ZSgpO1xuXG4gICAgICAgIGlmKCB0aGlzLmdfdXBkYXRlICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMuZ191cGRhdGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0X3ZhbHVlOiBmdW5jdGlvbigpe1xuICAgICAgICBpZiggdGhpcy5lbGVtLm9wdGlvbnNbdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXhdICYmIHRoaXMuZWxlbS5vcHRpb25zW3RoaXMuZWxlbS5zZWxlY3RlZEluZGV4XS52YWx1ZSApe1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnc2VsZWN0ZWRfdmFsdWUnLCB0aGlzLmVsZW0ub3B0aW9uc1t0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleF0udmFsdWUpO1xuICAgICAgICAgICAgdmFyIG5ld192YWx1ZSA9IHRoaXMuZWxlbS5vcHRpb25zW3RoaXMuZWxlbS5zZWxlY3RlZEluZGV4XS52YWx1ZTtcbiAgICAgICAgICAgIGlmKCB0aGlzLm9wdGlvbnNLb250YWluZXIucmVhZHkgKSB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygna29udGFpbmVyIHJlYWR5LCBzZXR0aW5nIHRvOiAnLCBuZXdfdmFsdWUpXG4gICAgICAgICAgICAgICAgLy9pZiggISBpc05hTihwYXJzZUZsb2F0KG5ld192YWx1ZSkpKSBuZXdfdmFsdWUgPSBwYXJzZUZsb2F0KG5ld192YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5rb250YWluZXIuc2V0KG5ld192YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IG5ld192YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ3VwZGF0aW5nOiAnLCB0aGlzKVxuICAgICAgICAvL3RoaXMuc2V0X3ZhbHVlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlX29wdGlvbnMoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICB1cGRhdGVfb3B0aW9uczogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG9sZF92YWx1ZSA9IHRoaXMudmFsdWU7XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lci5yZWFkeSApIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLmtvbnRhaW5lci5nZXQoKTtcbiAgICAgICAgICAgIGlmKCB0eXBlb2YgdGhpcy52YWx1ZSA9PSBcIm9iamVjdFwiKSB0aGlzLnZhbHVlID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIHRoaXMub3B0aW9uc0tvbnRhaW5lci5yZWFkeSAmJiB0aGlzLmtvbnRhaW5lci5yZWFkeSApIHtcbiAgICAgICAgICAgIHZhciBvbGRfb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IHRoaXMub3B0aW9uc0tvbnRhaW5lci5nZXQoKTtcbiAgICAgICAgICAgIGlmKCB0aGlzLm9wdGlvbnMgaW5zdGFuY2VvZiBBcnJheSApe1xuICAgICAgICAgICAgICAgIC8vdGhpcy5vcHRpb25zLnVuc2hpZnQoJycpO1xuICAgICAgICAgICAgICAgIGlmKCB0aGlzLm9wdGlvbnMgIT09IG9sZF9vcHRpb25zfHwgdGhpcy52YWx1ZSAhPT0gb2xkX3ZhbHVlICl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLm9wdGlvbnMgIT09IHVuZGVmaW5lZCAmJiB0aGlzLm9wdGlvbnMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzLmVsZW0uaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW0uaW5uZXJIVE1MID0gJzxvcHRpb24gc2VsZWN0ZWQgZGlzYWJsZWQgaGlkZGVuPjwvb3B0aW9uPidcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLGlkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy52YWx1ZSApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiggdmFsdWUudG9TdHJpbmcoKSA9PT0gdGhpcy52YWx1ZS50b1N0cmluZygpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZm91bmQgaXQ6JywgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgby5zZWxlY3RlZCA9IFwic2VsZWN0ZWRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2RvZXMgbm90IG1hdGNoOiAnLCB2YWx1ZSwgdGhpcy52YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL28uc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZWxlY3Rvcl9vcHRpb24nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdubyBjdXJyZW50IHZhbHVlJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgby5pbm5lckhUTUwgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtLmFwcGVuZENoaWxkKG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0b3Jfb2JqID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yX29iai5jaGFuZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaWYoICEgKHRoaXMub3B0aW9ucy5pbmRleE9mKHRoaXMua29udGFpbmVyLmdldCgpKSsxKSApe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgdGhpcy5zZXRfdmFsdWUodGhpcy5vcHRpb25zWzBdLnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldFVwZGF0ZTogZnVuY3Rpb24odXBkYXRlX2Z1bmN0aW9uKXtcbiAgICAgICAgdGhpcy5nX3VwZGF0ZSA9IHVwZGF0ZV9mdW5jdGlvbjtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXRSZWY6IGZ1bmN0aW9uKHJlZlN0cmluZyl7XG4gICAgICAgIHRoaXMucmVmU3RyaW5nID0gcmVmU3RyaW5nO1xuICAgICAgICBpZiggdGhpcy5rb250YWluZXIgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlZk9iamVjdCAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lciA9IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiggdGhpcy5rb250YWluZXIgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLnJlZih0aGlzLnJlZlN0cmluZyk7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lci5vYmoodGhpcy5yZWZPYmplY3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXRSZWZPYmo6IGZ1bmN0aW9uKHJlZk9iamVjdCl7XG4gICAgICAgIHRoaXMucmVmT2JqZWN0ID0gcmVmT2JqZWN0O1xuICAgICAgICBpZiggdGhpcy5rb250YWluZXIgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlZlN0cmluZyAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lciA9IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiggdGhpcy5rb250YWluZXIgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLnJlZih0aGlzLnJlZlN0cmluZyk7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lci5vYmoodGhpcy5yZWZPYmplY3QpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCB0aGlzLm9wdGlvbnNLb250YWluZXIgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlZk9wdGlvbnNTdHJpbmcgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zS29udGFpbmVyID0gT2JqZWN0LmNyZWF0ZShrb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCB0aGlzLm9wdGlvbnNLb250YWluZXIgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc0tvbnRhaW5lci5yZWYodGhpcy5yZWZPcHRpb25zU3RyaW5nKTtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc0tvbnRhaW5lci5vYmoodGhpcy5yZWZPYmplY3QpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0T3B0aW9uc1JlZjogZnVuY3Rpb24ocmVmU3RyaW5nKXtcbiAgICAgICAgdGhpcy5yZWZPcHRpb25zU3RyaW5nID0gcmVmU3RyaW5nO1xuICAgICAgICBpZiggdGhpcy5vcHRpb25zS29udGFpbmVyID09PSB1bmRlZmluZWQgJiYgdGhpcy5yZWZPYmplY3QgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zS29udGFpbmVyID0gT2JqZWN0LmNyZWF0ZShrb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCB0aGlzLm9wdGlvbnNLb250YWluZXIgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc0tvbnRhaW5lci5yZWYodGhpcy5yZWZPcHRpb25zU3RyaW5nKTtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc0tvbnRhaW5lci5vYmoodGhpcy5yZWZPYmplY3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbn07XG5mb3IoIHZhciBpZCBpbiB3cmFwcGVyX3Byb3RvdHlwZSApIHtcbiAgICBpZiggd3JhcHBlcl9wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoaWQpICkge1xuICAgICAgICBzZWxlY3Rvcl9wcm90b3R5cGVbaWRdID0gd3JhcHBlcl9wcm90b3R5cGVbaWRdO1xuICAgIH1cbn1cblxudmFyIHNlbGVjdG9yID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgcyA9IE9iamVjdC5jcmVhdGUoc2VsZWN0b3JfcHJvdG90eXBlKTtcbiAgICBzLnR5cGUgPSAnc2VsZWN0b3InO1xuICAgIHMuZWxlbT0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gICAgcy5lbGVtLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VsZWN0b3JfbWVudScpO1xuXG4gICAgcmV0dXJuIHM7XG59O1xuXG5cblxuXG5cbnZhciB2YWx1ZV9wcm90b3R5cGUgPSB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbigpe1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdydW5uaW5nIHZhbHVlIHVwZGF0ZScsIHRoaXMpXG4gICAgICAgIC8qXG4gICAgICAgIGlmKCB0aGlzLmdfdXBkYXRlICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMuZ191cGRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICAqL1xuICAgICAgIHZhciBkZWNpbWFscyA9IHRoaXMuZGVjaW1hbHMgfHwgMztcbiAgICAgICAgaWYoIHR5cGVvZiB0aGlzLmtvbnRhaW5lciAhPT0gJ3VuZGVmaW5lZCcgKXtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB0aGlzLmtvbnRhaW5lci5nZXQoKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3VwZGF0aW5nIHZhbHVlJywgdGhpcy52YWx1ZSlcbiAgICAgICAgfVxuICAgICAgICBpZiggaXNOYU4oTnVtYmVyKHRoaXMudmFsdWUpKSApe1xuICAgICAgICAgICAgdGhpcy5lbGVtLmlubmVySFRNTCA9IHRoaXMudmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmVsZW0uaW5uZXJIVE1MID0gTnVtYmVyKHRoaXMudmFsdWUpLnRvRml4ZWQoZGVjaW1hbHMpO1xuICAgICAgICAgICAgaWYoIHRoaXMubWluICE9PSB1bmRlZmluZWQgJiYgdGhpcy52YWx1ZSA8PSB0aGlzLm1pbiApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHIoJ2NsYXNzJywgJ3ZhbHVlT3V0T2ZSYW5nZScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmKCB0aGlzLm1heCAhPT0gdW5kZWZpbmVkICYmIHRoaXMudmFsdWUgPj0gdGhpcy5tYXggKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyKCdjbGFzcycsICd2YWx1ZU91dE9mUmFuZ2UnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyKCdjbGFzcycsICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24obmV3X3ZhbHVlKSB7XG4gICAgICAgIGlmKCB0eXBlb2YgbmV3X3ZhbHVlICE9PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IG5ld192YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuLy8gICAgc2V0VXBkYXRlOiBmdW5jdGlvbih1cGRhdGVfZnVuY3Rpb24pe1xuLy8gICAgICAgIHRoaXMuZ191cGRhdGUgPSB1cGRhdGVfZnVuY3Rpb247XG4vLyAgICB9LFxuICAgIHNldFJlZjogZnVuY3Rpb24ocmVmU3RyaW5nKXtcbiAgICAgICAgdGhpcy5yZWZTdHJpbmcgPSByZWZTdHJpbmc7XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmVmT2JqZWN0ICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyID0gT2JqZWN0LmNyZWF0ZShrb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIucmVmKHRoaXMucmVmU3RyaW5nKTtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldFJlZk9iajogZnVuY3Rpb24ocmVmT2JqZWN0KXtcbiAgICAgICAgdGhpcy5yZWZPYmplY3QgPSByZWZPYmplY3Q7XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmVmU3RyaW5nICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyID0gT2JqZWN0LmNyZWF0ZShrb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIucmVmKHRoaXMucmVmU3RyaW5nKTtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXRNYXg6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgdGhpcy5tYXggPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXRNaW46IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgdGhpcy5taW4gPSB2YWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXREZWNpbWFsczogZnVuY3Rpb24obil7XG4gICAgICAgIHRoaXMuZGVjaW1hbHMgPSBuO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxufTtcbmZvciggdmFyIGlkIGluIHdyYXBwZXJfcHJvdG90eXBlICkge1xuICAgIGlmKCB3cmFwcGVyX3Byb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShpZCkgKSB7XG4gICAgICAgIHZhbHVlX3Byb3RvdHlwZVtpZF0gPSB3cmFwcGVyX3Byb3RvdHlwZVtpZF07XG4gICAgfVxufVxuXG5cblxuZnVuY3Rpb24gdmFsdWUoKSB7XG4gICAgdmFyIHYgPSBPYmplY3QuY3JlYXRlKHZhbHVlX3Byb3RvdHlwZSk7XG4gICAgdi50eXBlID0gJ3ZhbHVlJztcbiAgICB2LmVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cbiAgICB2LnZhbHVlID0gJy0nO1xuICAgIHYuaW5uZXJIVE1MID0gdi52YWx1ZTtcbiAgICB2LnJlZmVyZW5jZSA9IGZhbHNlO1xuXG5cbiAgICB2LnVwZGF0ZSgpO1xuXG4gICAgcmV0dXJuIHY7XG59XG5cblxuXG4vLyBCcm93c2VyaWZ5XG5tb2R1bGUuZXhwb3J0cy5zZWxlY3RvciA9IHNlbGVjdG9yO1xubW9kdWxlLmV4cG9ydHMudmFsdWUgPSB2YWx1ZTtcbi8vbW9kdWxlLmV4cG9ydHMuJCA9ICQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBrb250YWluZXIgPSB7XG4gICAgcmVmOiBmdW5jdGlvbihyZWZTdHJpbmcpe1xuICAgICAgICBpZiggdHlwZW9mIHJlZlN0cmluZyA9PT0gJ3VuZGVmaW5lZCcgKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlZlN0cmluZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVmU3RyaW5nID0gcmVmU3RyaW5nO1xuICAgICAgICAgICAgdGhpcy5yZWZBcnJheSA9IHJlZlN0cmluZy5zcGxpdCgnLicpO1xuICAgICAgICAgICAgaWYoIHR5cGVvZiB0aGlzLm9iamVjdCAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBvYmo6IGZ1bmN0aW9uKG9iail7XG4gICAgICAgIGlmKCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vYmplY3QgPSBvYmo7XG4gICAgICAgICAgICBpZiggdHlwZW9mIHRoaXMucmVmU3RyaW5nICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24oaW5wdXQpe1xuICAgICAgICBpZiggdHlwZW9mIHRoaXMub2JqZWN0ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgdGhpcy5yZWZTdHJpbmcgPT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMub2JqZWN0O1xuICAgICAgICB2YXIgbGFzdF9sZXZlbCA9IHRoaXMucmVmQXJyYXlbdGhpcy5yZWZBcnJheS5sZW5ndGgtMV07XG5cbiAgICAgICAgdGhpcy5yZWZBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldmVsX25hbWUsaSl7XG4gICAgICAgICAgICBpZiggdHlwZW9mIHBhcmVudFtsZXZlbF9uYW1lXSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50W2xldmVsX25hbWVdID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiggbGV2ZWxfbmFtZSAhPT0gbGFzdF9sZXZlbCApe1xuICAgICAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudFtsZXZlbF9uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHBhcmVudFtsYXN0X2xldmVsXSA9IGlucHV0O1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdzZXR0aW5nOicsIGlucHV0LCB0aGlzLmdldCgpLCB0aGlzLnJlZlN0cmluZyApO1xuICAgICAgICByZXR1cm4gcGFyZW50W2xhc3RfbGV2ZWxdO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbGV2ZWwgPSB0aGlzLm9iamVjdDtcbiAgICAgICAgdGhpcy5yZWZBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldmVsX25hbWUsaSl7XG4gICAgICAgICAgICBpZiggdHlwZW9mIGxldmVsW2xldmVsX25hbWVdID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXZlbCA9IGxldmVsW2xldmVsX25hbWVdO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGxldmVsO1xuICAgIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtvbnRhaW5lcjtcbiIsInZhciB3cmFwcGVyX3Byb3RvdHlwZSA9IHtcblxuICAgIGh0bWw6IGZ1bmN0aW9uKGh0bWwpe1xuICAgICAgIHRoaXMuZWxlbS5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaHJlZjogZnVuY3Rpb24obGluayl7XG4gICAgICAgdGhpcy5lbGVtLmhyZWYgPSBsaW5rO1xuICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgYXBwZW5kOiBmdW5jdGlvbihzdWJfZWxlbWVudCl7XG4gICAgICAgIHRoaXMuZ2V0KDApLmFwcGVuZENoaWxkKHN1Yl9lbGVtZW50LmVsZW0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGFwcGVuZFRvOiBmdW5jdGlvbihwYXJlbnRfZWxlbWVudCl7XG4gICAgICAgIC8vcGFyZW50X2VsZW1lbnQuYXBwZW5kKHRoaXMpO1xuICAgICAgICBwYXJlbnRfZWxlbWVudC5nZXQoMCkuYXBwZW5kQ2hpbGQodGhpcy5lbGVtKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBhdHRyOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSl7XG4gICAgICAgIHZhciBhdHRyaWJ1dGVOYW1lO1xuICAgICAgICBpZiggbmFtZSA9PT0gJ2NsYXNzJyl7XG4gICAgICAgICAgICBhdHRyaWJ1dGVOYW1lID0gJ2NsYXNzTmFtZSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVOYW1lID0gbmFtZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1bYXR0cmlidXRlTmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjbGljazogZnVuY3Rpb24oY2xpY2tGdW5jdGlvbil7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZXR0aW5nIGNsaWNrIHRvICcsIHR5cGVvZiBjbGlja0Z1bmN0aW9uLCBjbGlja0Z1bmN0aW9uKVxuICAgICAgICB0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCl7IGNsaWNrRnVuY3Rpb24oKTsgfSwgZmFsc2UpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNob3c6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZSc7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgaGlkZTogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5lbGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc3R5bGU6IGZ1bmN0aW9uKGZpZWxkLCB2YWx1ZSl7XG4gICAgICAgIHRoaXMuZWxlbS5zdHlsZVtmaWVsZF0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBjc3M6IGZ1bmN0aW9uKGZpZWxkLCB2YWx1ZSl7XG4gICAgICAgIHRoaXMuZWxlbS5zdHlsZVtmaWVsZF0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICAvKlxuICAgIC8qXG4gICAgcHVzaFRvOiBmdW5jdGlvbihhcnJheSl7XG4gICAgICAgIGFycmF5LnB1c2godGhpcyk7XG4gICAgfVxuICAgICovXG4gICAgZ2V0OiBmdW5jdGlvbihpKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbVxufVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHdyYXBwZXJfcHJvdG90eXBlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy92YXIgdmVyc2lvbl9zdHJpbmcgPSAnRGV2Jztcbi8vdmFyIHZlcnNpb25fc3RyaW5nID0gJ0FscGhhMjAxNDAxLS0nO1xudmFyIHZlcnNpb25fc3RyaW5nID0gJ1ByZXZpZXcnK21vbWVudCgpLmZvcm1hdCgnWVlZWU1NREQnKTtcblxuLy8gTW92ZWQgdG8gaW5kZXguaHRtbFxuLy8gVE9ETzogbG9vayBpbnRvIHdheXMgdG8gZnVydGhlciByZWR1Y2Ugc2l6ZS4gSXQgc2VlbXMgd2F5IHRvIGJpZy5cbi8vdmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG4vL3ZhciBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcbi8vdmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxudmFyIGsgPSByZXF1aXJlKCcuL2xpYi9rL2suanMnKTtcbi8vdmFyIGtfZGF0YSA9IHJlcXVpcmUoJy4vbGliL2sva19kYXRhJyk7XG5cbnZhciBzZXR0aW5ncyA9IHJlcXVpcmUoJy4vYXBwL3NldHRpbmdzJyk7XG53aW5kb3cuZyA9IHNldHRpbmdzO1xuc2V0dGluZ3Muc3RhdGUudmVyc2lvbl9zdHJpbmcgPSB2ZXJzaW9uX3N0cmluZztcbmNvbnNvbGUubG9nKCdzZXR0aW5ncycsIHNldHRpbmdzKTtcblxudmFyIG1rX2Jsb2NrcyA9IHJlcXVpcmUoJy4vYXBwL21rX2Jsb2NrcycpO1xuXG52YXIgbWtfcGFnZSA9IHt9O1xubWtfcGFnZVsxXSA9IHJlcXVpcmUoJy4vYXBwL21rX3BhZ2VfMScpO1xubWtfcGFnZVsyXSA9IHJlcXVpcmUoJy4vYXBwL21rX3BhZ2VfMicpO1xubWtfcGFnZVszXSA9IHJlcXVpcmUoJy4vYXBwL21rX3BhZ2VfMycpO1xubWtfcGFnZVs0XSA9IHJlcXVpcmUoJy4vYXBwL21rX3BhZ2VfNCcpO1xuXG52YXIgbWtfcHJldmlldyA9IHt9O1xubWtfcHJldmlld1sxXSA9IHJlcXVpcmUoJy4vYXBwL21rX3BhZ2VfcHJldmlld18xJyk7XG5ta19wcmV2aWV3WzJdID0gcmVxdWlyZSgnLi9hcHAvbWtfcGFnZV9wcmV2aWV3XzInKTtcblxudmFyIG1rX3N2Zz0gcmVxdWlyZSgnLi9hcHAvbWtfc3ZnJyk7XG4vL3ZhciBta19wZGYgPSByZXF1aXJlKCcuL2FwcC9ta19wZGYuanMnKTtcbnZhciBzZXR0aW5nc191cGRhdGUgPSByZXF1aXJlKCcuL2FwcC9zZXR0aW5nc191cGRhdGUnKTtcblxuXG5cbnZhciBmID0gcmVxdWlyZSgnLi9hcHAvZnVuY3Rpb25zJyk7XG5mLnNldHRpbmdzID0gc2V0dGluZ3M7XG5zZXR0aW5ncy5mID0gZjtcblxuLy92YXIgZGF0YWJhc2VfanNvbl9VUkwgPSAnaHR0cDovLzEwLjE3My42NC4yMDQ6ODAwMC90ZW1wb3JhcnkvJztcbnZhciBkYXRhYmFzZV9qc29uX1VSTCA9ICdkYXRhL2ZzZWNfY29weS5qc29uJztcblxudmFyIGNvbXBvbmVudHMgPSBzZXR0aW5ncy5jb21wb25lbnRzO1xudmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcblxuXG52YXIgcXVlcnkgPSBmLnF1ZXJ5X3N0cmluZygpO1xuLy9jb25zb2xlLmxvZyhxdWVyeSk7XG5pZiggcXVlcnlbJ21vZGUnXSA9PT0gXCJkZXZcIiApIHtcbiAgICBnLnN0YXRlLm1vZGUgPSAnZGV2Jztcbn0gZWxzZSB7XG4gICAgZy5zdGF0ZS5tb2RlID0gJ3JlbGVhc2UnO1xufVxuXG5cblxuJC5nZXRKU09OKCBkYXRhYmFzZV9qc29uX1VSTClcbiAgICAuZG9uZShmdW5jdGlvbihqc29uKXtcbiAgICAgICAgc2V0dGluZ3MuZGF0YWJhc2UgPSBqc29uO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdkYXRhYmFzZSBsb2FkZWQnLCBzZXR0aW5ncy5kYXRhYmFzZSk7XG4gICAgICAgIGYubG9hZF9kYXRhYmFzZShqc29uKTtcbiAgICAgICAgc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgdXBkYXRlKCk7XG4gICAgICAgIC8vY29uc29sZS5sb2coICdzZXR0aW5ncy5lbGVtZW50cycsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzLmVsZW1lbnRzLCBudWxsLCA0KSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coICdzeXN0ZW0nLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncy5zeXN0ZW0sIG51bGwsIDQpKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggJ2lucHV0cycsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzLmlucHV0cywgbnVsbCwgNCkpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCAnZHJhd2luZycsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzLmRyYXdpbmcsIG51bGwsIDQpKTtcbiAgICB9KTtcblxuXG52YXIgYWN0aXZlX3NlY3Rpb24gPSBnLndlYnBhZ2Uuc2VjdGlvbnNbMF07XG5cbnZhciB1cGRhdGUgPSBzZXR0aW5ncy51cGRhdGUgPSBmdW5jdGlvbigpe1xuICAgIGNvbnNvbGUubG9nKCcvLS0tIGJlZ2luIHVwZGF0ZScpO1xuICAgIGYuY2xlYXJfZHJhd2luZygpO1xuXG5cbiAgICBzZXR0aW5ncy5zZWxlY3RfcmVnaXN0cnkuZm9yRWFjaChmdW5jdGlvbihzZWxlY3Rvcil7XG4gICAgICAgIC8vY29uc29sZS5sb2coc2VsZWN0b3IudmFsdWUoKSk7XG4gICAgICAgIGlmKHNlbGVjdG9yLnZhbHVlKCkpIHNlbGVjdG9yLnN5c3RlbV9yZWYuc2V0KHNlbGVjdG9yLnZhbHVlKCkpO1xuICAgICAgICAvL2lmKHNlbGVjdG9yLnZhbHVlKCkpIHNlbGVjdG9yLmlucHV0X3JlZi5zZXQoc2VsZWN0b3IudmFsdWUoKSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coc2VsZWN0b3Iuc2V0X3JlZi5yZWZTdHJpbmcsIHNlbGVjdG9yLnZhbHVlKCksIHNlbGVjdG9yLnNldF9yZWYuZ2V0KCkpO1xuXG4gICAgfSk7XG5cblxuICAgIC8vY29weSBpbnB1dHMgZnJvbSBzZXR0aW5ncy5pbnB1dCB0byBzZXR0aW5ncy5zeXN0ZW0uXG5cblxuICAgIHNldHRpbmdzX3VwZGF0ZShzZXR0aW5ncyk7XG5cbiAgICBzZXR0aW5ncy5zZWxlY3RfcmVnaXN0cnkuZm9yRWFjaChmdW5jdGlvbihzZWxlY3Rvcil7XG4gICAgICAgIGlmKCBzZWxlY3Rvci50eXBlID09PSAnc2VsZWN0JyApe1xuICAgICAgICAgICAgZi5zZWxlY3Rvcl9hZGRfb3B0aW9ucyhzZWxlY3Rvcik7XG4gICAgICAgIH0gZWxzZSBpZiggc2VsZWN0b3IudHlwZSA9PT0gJ2lucHV0JyApIHtcbiAgICAgICAgICAgIHNlbGVjdG9yLmVsZW0udmFsdWUgPSBzZWxlY3Rvci5zeXN0ZW1fcmVmLmdldCgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBzZXR0aW5ncy52YWx1ZV9yZWdpc3RyeS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlX2l0ZW0pe1xuICAgICAgICB2YWx1ZV9pdGVtLmVsZW0uaW5uZXJIVE1MID0gdmFsdWVfaXRlbS52YWx1ZV9yZWYuZ2V0KCk7XG4gICAgfSk7XG5cbiAgICAvLyBEZXRlcm1pbmUgYWN0aXZlIHNlY3Rpb24gYmFzZWQgb24gc2VjdGlvbiBpbnB1dHMgZW50ZXJlZCBieSB1c2VyXG4gICAgdmFyIHNlY3Rpb25zID0gZy53ZWJwYWdlLnNlY3Rpb25zO1xuICAgIHNlY3Rpb25zLmV2ZXJ5KGZ1bmN0aW9uKHNlY3Rpb25fbmFtZSxpZCl7IC8vVE9ETzogZmluZCBwcmUgSUU5IHdheSB0byBkbyB0aGlzP1xuICAgICAgICBpZiggISBnLmYuc2VjdGlvbl9kZWZpbmVkKHNlY3Rpb25fbmFtZSkgKXtcbiAgICAgICAgICAgIGFjdGl2ZV9zZWN0aW9uID0gc2VjdGlvbl9uYW1lO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYoIGlkID09PSBzZWN0aW9ucy5sZW5ndGgtMSApeyAvL0lmIGxhc3Qgc2VjdGlvbiBpcyBkZWZpbmVkLCB0aGVyZSBpcyBubyBhY3RpdmUgc2VjdGlvblxuICAgICAgICAgICAgICAgIGFjdGl2ZV9zZWN0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vIENsb3NlIHNlY3Rpb24gaWYgdGhleSBhcmUgbm90IGFjdGl2ZSBzZWN0aW9ucywgdW5sZXNzIHRoZXkgaGF2ZSBiZWVuIG9wZW5lZCBieSB0aGUgdXNlciwgb3BlbiB0aGUgYWN0aXZlIHNlY3Rpb25cbiAgICBzZWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHNlY3Rpb25fbmFtZSxpZCl7IC8vVE9ETzogZmluZCBwcmUgSUU5IHdheSB0byBkbyB0aGlzP1xuICAgICAgICBpZiggc2VjdGlvbl9uYW1lID09PSBhY3RpdmVfc2VjdGlvbiApe1xuICAgICAgICAgICAgJCgnLmlucHV0X3NlY3Rpb24jJytzZWN0aW9uX25hbWUpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlRG93bignZmFzdCcpO1xuICAgICAgICB9IGVsc2UgaWYoICEgZy53ZWJwYWdlLnNlbGVjdGlvbnNfbWFudWFsX3RvZ2dsZWRbc2VjdGlvbl9uYW1lXSApe1xuICAgICAgICAgICAgJCgnLmlucHV0X3NlY3Rpb24jJytzZWN0aW9uX25hbWUpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlVXAoJ2Zhc3QnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICAvLyBNYWtlIGJsb2Nrc1xuICAgIG1rX2Jsb2NrcygpO1xuXG4gICAgLy8gTWFrZSBwcmV2aWV3XG4gICAgc2V0dGluZ3MuZHJhd2luZy5wcmV2aWV3X3BhcnRzID0ge307XG4gICAgc2V0dGluZ3MuZHJhd2luZy5wcmV2aWV3X3N2Z3MgPSB7fTtcbiAgICAkKCcjZHJhd2luZ19wcmV2aWV3JykuZW1wdHkoKS5odG1sKCcnKTtcbiAgICBmb3IoIHZhciBwIGluIG1rX3ByZXZpZXcgKXtcbiAgICAgICAgc2V0dGluZ3MuZHJhd2luZy5wcmV2aWV3X3BhcnRzW3BdID0gbWtfcHJldmlld1twXShzZXR0aW5ncyk7XG4gICAgICAgIHNldHRpbmdzLmRyYXdpbmcucHJldmlld19zdmdzW3BdID0gbWtfc3ZnKHNldHRpbmdzLmRyYXdpbmcucHJldmlld19wYXJ0c1twXSwgc2V0dGluZ3MpO1xuICAgICAgICB2YXIgc2VjdGlvbiA9IFsnJywnRWxlY3RyaWNhbCcsJ1N0cnVjdHVyYWwnXVtwXTtcbiAgICAgICAgJCgnI2RyYXdpbmdfcHJldmlldycpXG4gICAgICAgICAgICAvLy5hcHBlbmQoJCgnPHA+UGFnZSAnK3ArJzwvcD4nKSlcbiAgICAgICAgICAgIC5hcHBlbmQoJCgnPHA+JytzZWN0aW9uKyc8L3A+JykpXG4gICAgICAgICAgICAuYXBwZW5kKCQoc2V0dGluZ3MuZHJhd2luZy5wcmV2aWV3X3N2Z3NbcF0pKVxuICAgICAgICAgICAgLmFwcGVuZCgkKCc8L2JyPicpKVxuICAgICAgICAgICAgLmFwcGVuZCgkKCc8L2JyPicpKTtcblxuICAgIH1cblxuXG5cbiAgICAvLyBNYWtlIGRyYXdpbmdcbiAgICBzZXR0aW5ncy5kcmF3aW5nLnBhcnRzID0ge307XG4gICAgc2V0dGluZ3MuZHJhd2luZy5zdmdzID0ge307XG4gICAgJCgnI2RyYXdpbmcnKS5lbXB0eSgpLmh0bWwoJ0VsZWN0cmljYWwnKTtcbiAgICBmb3IoIHAgaW4gbWtfcGFnZSApe1xuICAgICAgICBzZXR0aW5ncy5kcmF3aW5nLnBhcnRzW3BdID0gbWtfcGFnZVtwXShzZXR0aW5ncyk7XG4gICAgICAgIHNldHRpbmdzLmRyYXdpbmcuc3Znc1twXSA9IG1rX3N2ZyhzZXR0aW5ncy5kcmF3aW5nLnBhcnRzW3BdLCBzZXR0aW5ncyk7XG4gICAgICAgICQoJyNkcmF3aW5nJylcbiAgICAgICAgICAgIC8vLmFwcGVuZCgkKCc8cD5QYWdlICcrcCsnPC9wPicpKVxuICAgICAgICAgICAgLmFwcGVuZCgkKHNldHRpbmdzLmRyYXdpbmcuc3Znc1twXSkpXG4gICAgICAgICAgICAuYXBwZW5kKCQoJzwvYnI+JykpXG4gICAgICAgICAgICAuYXBwZW5kKCQoJzwvYnI+JykpO1xuXG4gICAgfVxuXG5cblxuXG5cbiAgICAvLyovXG4gICAgLy92YXIgcGRmX2Rvd25sb2FkID0gbWtfcGRmKHNldHRpbmdzLCBzZXREb3dubG9hZExpbmspO1xuICAgIC8vbWtfcGRmKHNldHRpbmdzLCBzZXREb3dubG9hZExpbmspO1xuICAgIC8vcGRmX2Rvd25sb2FkLmh0bWwoJ0Rvd25sb2FkIFBERicpO1xuICAgIC8vY29uc29sZS5sb2cocGRmX2Rvd25sb2FkKTtcbiAgICAvL2lmKCBzZXR0aW5ncy5QREYgJiYgc2V0dGluZ3MuUERGLnVybCApe1xuICAgIC8vICAgIHZhciBsaW5rID0gJCgnYScpLmF0dHIoJ2hyZWYnLCBzZXR0aW5ncy5QREYudXJsICkuaHRtbCgnZG93bmxvYWQuLicpO1xuICAgIC8vICAgICQoJyNkb3dubG9hZCcpLmFwcGVuZChsaW5rKTtcbiAgICAvL31cblxuXG4gICAgLy9rLnNob3dfaGlkZV9wYXJhbXMocGFnZV9zZWN0aW9uc19wYXJhbXMsIHNldHRpbmdzKTtcbi8vICAgIHNob3dfaGlkZV9zZWxlY3Rpb25zKHBhZ2Vfc2VjdGlvbnNfY29uZmlnLCBzZXR0aW5ncy5zdGF0ZS5hY3RpdmVfc2VjdGlvbik7XG5cbiAgICAvL2NvbnNvbGUubG9nKCBmLm9iamVjdF9kZWZpbmVkKHNldHRpbmdzLnN0YXRlKSApO1xuXG4gICAgLy9jb25zb2xlLmxvZyggJ3N5c3RlbScsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzLnN5c3RlbSwgbnVsbCwgNCkpO1xuICAgIC8vY29uc29sZS5sb2coICdpbnB1dHMnLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncy5pbnB1dHMsIG51bGwsIDQpKTtcbiAgICAvL2NvbnNvbGUubG9nKCAnZHJhd2luZycsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzLmRyYXdpbmcsIG51bGwsIDQpKTtcblxuICAgIGNvbnNvbGUubG9nKCdcXFxcLS0tIGVuZCB1cGRhdGUnKTtcbn07XG5mLnVwZGF0ZSA9IHVwZGF0ZTtcblxuXG5cblxuXG5cblxuXG5cbi8vIERldiBzZXR0aW5nc1xuLypcbmlmKCB2ZXJzaW9uX3N0cmluZyA9PT0gJ0RldicgJiYgdHJ1ZSApe1xuICAgIGZvciggdmFyIHNlY3Rpb24gaW4gc2V0dGluZ3Muc3RhdGUuc2VjdGlvbnMgKXtcbiAgICAgICAgc2V0dGluZ3Muc3RhdGUuc2VjdGlvbnNbc2VjdGlvbl0ucmVhZHkgPSB0cnVlO1xuICAgICAgICBzZXR0aW5ncy5zdGF0ZS5zZWN0aW9uc1tzZWN0aW9uXS5zZXQgPSB0cnVlO1xuICAgIH1cbn0gZWxzZSB7XG4gICAgc2V0dGluZ3Muc3RhdGUuc2VjdGlvbnMubW9kdWxlcy5yZWFkeSA9IHRydWU7XG59XG4vLyovXG4vLy8vLy8vL1xuXG5cblxuXG5mdW5jdGlvbiBwYWdlX3NldHVwKHNldHRpbmdzKXtcbiAgICB2YXIgc3lzdGVtX2ZyYW1lX2lkID0gJ3N5c3RlbV9mcmFtZSc7XG4gICAgdmFyIHRpdGxlID0gJ1BWIGRyYXdpbmcgdGVzdCc7XG5cbiAgICBrLnNldHVwX2JvZHkodGl0bGUpO1xuXG4gICAgdmFyIHBhZ2UgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3BhZ2UnKS5hcHBlbmRUbygkKGRvY3VtZW50LmJvZHkpKTtcbiAgICAvL3BhZ2Uuc3R5bGUoJ3dpZHRoJywgKHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS5kcmF3aW5nLncrMjApLnRvU3RyaW5nKCkgKyAncHgnIClcblxuICAgIHZhciBzeXN0ZW1fZnJhbWUgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgc3lzdGVtX2ZyYW1lX2lkKS5hcHBlbmRUbyhwYWdlKTtcblxuXG4gICAgdmFyIGhlYWRlcl9jb250YWluZXIgPSAkKCc8ZGl2PicpLmFwcGVuZFRvKHN5c3RlbV9mcmFtZSk7XG4gICAgJCgnPHNwYW4+JykuaHRtbCgnUGxlYXNlIHNlbGVjdCB5b3VyIHN5c3RlbSBzcGVjIGJlbG93JykuYXR0cignY2xhc3MnLCAnY2F0ZWdvcnlfdGl0bGUnKS5hcHBlbmRUbyhoZWFkZXJfY29udGFpbmVyKTtcbiAgICAkKCc8c3Bhbj4nKS5odG1sKCcgfCAnKS5hcHBlbmRUbyhoZWFkZXJfY29udGFpbmVyKTtcbiAgICAvLyQoJzxpbnB1dD4nKS5hdHRyKCd0eXBlJywgJ2J1dHRvbicpLmF0dHIoJ3ZhbHVlJywgJ2NsZWFyIHNlbGVjdGlvbnMnKS5jbGljayh3aW5kb3cubG9jYXRpb24ucmVsb2FkKSxcbiAgICAkKCc8YT4nKS5hdHRyKCdocmVmJywgJ2phdmFzY3JpcHQ6d2luZG93LmxvY2F0aW9uLnJlbG9hZCgpJykuaHRtbCgnY2xlYXIgc2VsZWN0aW9ucycpLmFwcGVuZFRvKGhlYWRlcl9jb250YWluZXIpO1xuXG5cbiAgICAvLyBTeXN0ZW0gc2V0dXBcbiAgICAkKCc8ZGl2PicpLmh0bWwoJ1N5c3RlbSBTZXR1cCcpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25fdGl0bGUnKS5hcHBlbmRUbyhzeXN0ZW1fZnJhbWUpO1xuICAgIHZhciBjb25maWdfZnJhbWUgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2NvbmZpZ19mcmFtZScpLmFwcGVuZFRvKHN5c3RlbV9mcmFtZSk7XG5cbiAgICAvL2NvbnNvbGUubG9nKHNlY3Rpb25fc2VsZWN0b3IpO1xuXG5cblxuICAgIHZhciBsb2NhdGlvbl9kaXYgPSAkKCc8ZGl2PicpO1xuXG4gICAgdmFyIGxpc3RfZWxlbWVudCA9ICQoJzx1bD4nKS5hcHBlbmRUbyhsb2NhdGlvbl9kaXYpO1xuICAgICQoJzxsaT4nKS5hcHBlbmRUbyhsaXN0X2VsZW1lbnQpLmFwcGVuZChcbiAgICAgICAgJCgnPGE+JylcbiAgICAgICAgICAgIC50ZXh0KCdXaW5kIFpvbmUgJylcbiAgICAgICAgICAgIC5hdHRyKCdocmVmJywgJ2h0dHA6Ly93aW5kc3BlZWQuYXRjb3VuY2lsLm9yZy8nKVxuICAgICAgICAgICAgLmF0dHIoJ3RhcmdldCcsICdfYmxhbmsnKVxuICAgICk7XG4gICAgJCgnPGxpPicpLmFwcGVuZFRvKGxpc3RfZWxlbWVudCkuYXBwZW5kKFxuICAgICAgICAkKCc8YT4nKVxuICAgICAgICAgICAgLnRleHQoJ0NsaW1hdGUgQ29uZGl0aW9ucycpXG4gICAgICAgICAgICAuYXR0cignaHJlZicsICdodHRwOi8vd3d3LnNvbGFyYWJjcy5vcmcvYWJvdXQvcHVibGljYXRpb25zL3JlcG9ydHMvZXhwZWRpdGVkLXBlcm1pdC9tYXAvaW5kZXguaHRtbCcpXG4gICAgICAgICAgICAuYXR0cigndGFyZ2V0JywgJ19ibGFuaycpXG4gICAgKTtcbiAgICAkKCc8aWZyYW1lIHNyYz1cImh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9lbWJlZD9wYj0hMW0xMCExbTghMW0zITFkMzYwMzQ1OS44NTQwODkwNDYhMmQtODEuMzcwMjgwODE4MzQ3MTUhM2QyOC4xMTU5MTYwMTE0MjgyMDghM20yITFpMTAyNCEyaTc2OCE0ZjEzLjEhNWUwITNtMiExc2VuITJzdXMhNHYxNDIxOTU0NDYwMzg1XCIgd2lkdGg9XCI0ODVcIiBoZWlnaHQ9XCIzMDBcIiBmcmFtZWJvcmRlcj1cIjBcIiBzdHlsZT1cImJvcmRlcjowXCI+PC9pZnJhbWU+JylcbiAgICAgICAgLmFwcGVuZFRvKGxvY2F0aW9uX2Rpdik7XG4gICAgJCgnPGlmcmFtZSBzcmM9XCJodHRwczovL3d3dy5nb29nbGUuY29tL21hcHMvZW1iZWQ/cGI9ITFtMTQhMW0xMiExbTMhMWQ1NDYuNjgwOTA0MzgxMDk5NCEyZC04MC43NTY0OTQ2NTg1MTk1MyEzZDI4LjM4NzMwMjg3MTQwNjQ0NCEybTMhMWYwITJmMCEzZjAhM20yITFpMTAyNCEyaTc2OCE0ZjEzLjEhNWUxITNtMiExc2VuITJzdXMhNHYxNDIyMDM4ODAxMjg3XCIgd2lkdGg9XCI0ODVcIiBoZWlnaHQ9XCIzMDBcIiBmcmFtZWJvcmRlcj1cIjBcIiBzdHlsZT1cImJvcmRlcjowXCI+PC9pZnJhbWU+JylcbiAgICAgICAgLmFwcGVuZFRvKGxvY2F0aW9uX2Rpdik7XG5cblxuXG5cblxuICAgIHZhciBsb2NhdGlvbl9kcmF3ZXIgPSBmLm1rX2RyYXdlcignTG9jYXRpb24nLCBsb2NhdGlvbl9kaXYpO1xuICAgIGxvY2F0aW9uX2RyYXdlci5hcHBlbmRUbyhjb25maWdfZnJhbWUpO1xuXG5cbiAgICBmLmFkZF9zZWxlY3RvcnMoc2V0dGluZ3MsIGNvbmZpZ19mcmFtZSk7XG5cbiAgICAvLyBQYXJhbWV0ZXJzIGFuZCBzcGVjaWZpY2F0aW9uc1xuICAgIC8qXG4gICAgJCgnPGRpdj4nKS5odG1sKCdTeXN0ZW0gUGFyYW1ldGVycycpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25fdGl0bGUnKS5hcHBlbmRUbyhzeXN0ZW1fZnJhbWUpO1xuICAgIHZhciBwYXJhbXNfY29udGFpbmVyID0gJCgnPGRpdj4nKS5hdHRyKCdjbGFzcycsICdzZWN0aW9uJyk7XG4gICAgcGFyYW1zX2NvbnRhaW5lci5hcHBlbmRUbyhzeXN0ZW1fZnJhbWUpO1xuICAgIGYuYWRkX3BhcmFtcyggc2V0dGluZ3MsIHBhcmFtc19jb250YWluZXIgKTtcbiAgICAvLyovXG5cbiAgICAvL1RPRE86IGFkZCBzdmcgZGlzcGxheSBvZiBtb2R1bGVzXG4gICAgLy8gaHR0cDovL3F1b3RlLnNuYXBucmFjay5jb20vdWkvbzEwMC5waHAjc3RlcC0yXG5cbiAgICAvLyBkcmF3aW5nXG4gICAgLy92YXIgZHJhd2luZyA9ICQoJ2RpdicpLmF0dHIoJ2lkJywgJ2RyYXdpbmdfZnJhbWUnKS5hdHRyKCdjbGFzcycsICdzZWN0aW9uJykuYXBwZW5kVG8ocGFnZSk7XG5cblxuICAgIHZhciBkcmF3aW5nX3ByZXZpZXcgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2RyYXdpbmdfZnJhbWVfcHJldmlldycpLmFwcGVuZFRvKHBhZ2UpO1xuICAgICQoJzxkaXY+JykuaHRtbCgnUHJldmlldycpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25fdGl0bGUnKS5hcHBlbmRUbyhkcmF3aW5nX3ByZXZpZXcpO1xuICAgICQoJzxkaXY+JykuYXR0cignaWQnLCAnZHJhd2luZ19wcmV2aWV3JykuYXR0cignY2xhc3MnLCAnZHJhd2luZycpLmNzcygnY2xlYXInLCAnYm90aCcpLmFwcGVuZFRvKGRyYXdpbmdfcHJldmlldyk7XG5cblxuXG5cblxuICAgIHZhciBkcmF3aW5nX3NlY3Rpb24gPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2RyYXdpbmdfZnJhbWUnKS5hcHBlbmRUbyhwYWdlKTtcbiAgICAvL2RyYXdpbmcuY3NzKCd3aWR0aCcsIChzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy53KzIwKS50b1N0cmluZygpICsgJ3B4JyApO1xuICAgICQoJzxkaXY+JykuaHRtbCgnRHJhd2luZycpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25fdGl0bGUnKS5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pO1xuXG5cbiAgICAvLyQoJzxmb3JtIG1ldGhvZD1cImdldFwiIGFjdGlvbj1cImRhdGEvc2FtcGxlLnBkZlwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiPkRvd25sb2FkPC9idXR0b24+PC9mb3JtPicpLmFwcGVuZFRvKGRyYXdpbmdfc2VjdGlvbik7XG4gICAgLy8kKCc8c3Bhbj4nKS5hdHRyKCdpZCcsICdkb3dubG9hZCcpLmF0dHIoJ2NsYXNzJywgJ2Zsb2F0X3JpZ2h0JykuYXBwZW5kVG8oZHJhd2luZ19zZWN0aW9uKTtcbiAgICAkKCc8YT4nKVxuICAgICAgICAudGV4dCgnRG93bmxvYWQgRHJhd2luZyAoc2FtcGxlKScpXG4gICAgICAgIC5hdHRyKCdocmVmJywgJ2RhdGEvc2FtcGxlLnBkZicpXG4gICAgICAgIC5hdHRyKCdpZCcsICdkb3dubG9hZCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdmbG9hdF9yaWdodCcpXG4gICAgICAgIC5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pO1xuXG4gICAgdmFyIHN2Z19jb250YWluZXJfb2JqZWN0ID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdkcmF3aW5nJykuYXR0cignY2xhc3MnLCAnZHJhd2luZycpLmNzcygnY2xlYXInLCAnYm90aCcpLmFwcGVuZFRvKGRyYXdpbmdfc2VjdGlvbik7XG4gICAgLy9zdmdfY29udGFpbmVyX29iamVjdC5zdHlsZSgnd2lkdGgnLCBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy53KydweCcgKVxuICAgIC8vdmFyIHN2Z19jb250YWluZXIgPSBzdmdfY29udGFpbmVyX29iamVjdC5lbGVtO1xuICAgICQoJzxicj4nKS5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pO1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICQoJzxkaXY+JykuaHRtbCgnICcpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25fdGl0bGUnKS5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pO1xuXG59XG5cbnBhZ2Vfc2V0dXAoc2V0dGluZ3MpO1xuXG52YXIgYm9vdF90aW1lID0gbW9tZW50KCk7XG52YXIgc3RhdHVzX2lkID0gJ3N0YXR1cyc7XG5zZXRJbnRlcnZhbChmdW5jdGlvbigpeyBrLnVwZGF0ZV9zdGF0dXNfcGFnZShzdGF0dXNfaWQsIGJvb3RfdGltZSwgdmVyc2lvbl9zdHJpbmcpO30sMTAwMCk7XG5cbnVwZGF0ZSgpO1xuXG4vL2NvbnNvbGUubG9nKCd3aW5kb3cnLCB3aW5kb3cpO1xuIl19
