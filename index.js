(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/functions.js":[function(require,module,exports){
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
    return f.object_defined(f.settings.inputs[section_name] );
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
        //kelem.setUpdate(update_system);
        settings.value_registry.push(kelem);
    }
    return kelem;
};
*/

f.add_selectors = function(settings, parent_container){
    for( var section_name in settings.input_options ){
        var selection_container = $('<div>').attr('class', 'input_section').attr('id', section_name ).appendTo(parent_container);
        //selection_container.get(0).style.display = display_type;
        var system_div = $('<div>').attr('class', 'title_bar')
            .appendTo(selection_container)
            /* jshint -W083 */
            .click(function(){
                $(this).parent().children('.drawer').children('.drawer_content').slideToggle('fast');
            });
        var system_title = $('<a>')
            .attr('class', 'title_bar_text')
            .attr('href', '#')
            .text(f.pretty_name(section_name))
            .appendTo(system_div);
        $(this).trigger('click');
        var drawer = $('<div>').attr('class', 'drawer').appendTo(selection_container);
        var drawer_content = $('<div>').attr('class', 'drawer_content').appendTo(drawer);
        for( var input_name in settings.input_options[section_name] ){
            var selector_set = $('<span>').attr('class', 'selector_set').appendTo(drawer_content);
            $('<span>').html(f.pretty_name(input_name) + ': ').appendTo(selector_set);
            /*
            var selector = k$('selector')
                .setOptionsRef( 'input_options.' + section_name + '.' + input_name )
                .setRef( 'system.' + section_name + '.' + input_name )
                .appendTo(selector_set);
            f.kelem_setup(selector, settings);
            //*/
            var $elem = $('<select>')
                .attr('class', 'selector')
                .appendTo(selector_set);
            var selector = {
                elem: $elem.get()[0],
                system_ref: Object.create(kontainer).obj(settings).ref('system.' + section_name + '.' + input_name),
                input_ref: Object.create(kontainer).obj(settings).ref('inputs.' + section_name + '.' + input_name),
                list_ref: Object.create(kontainer).obj(settings).ref('input_options.' + section_name + '.' + input_name),
                interacted: false,
                value: function(){
                    //console.log( this.set_ref.refString, this.elem.selectedIndex );
                    //console.log( this.elem.options[this.elem.selectedIndex] );
                    //if( this.interacted )
                    if( this.elem.selectedIndex >= 0) return this.elem.options[this.elem.selectedIndex].value;
                    else return false;
                }
            };
            $elem.change(function(event){
                settings.f.update();
            });
            f.selector_add_options(selector);
            settings.select_registry.push(selector);
            //$('</br>').appendTo(drawer_content);

        }
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
                    //.setOptionsRef( 'input_options.' + section_name + '.' + input_name )
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


module.exports = f;

},{"../lib/k/k":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/k.js","../lib/k/k_DOM":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/k_DOM.js","../lib/k/kontainer":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/kontainer.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_border.js":[function(require,module,exports){
var mk_drawing = require('./mk_drawing');

//var drawing_parts = [];
//d.link_drawing_parts(drawing_parts);

var add_border = function(settings, sheet_section, sheet_num){
    console.log("** Making page 2");
    d = mk_drawing();
    console.log(d);

    var f = settings.f;

    //var components = settings.components;
    //var system = settings.system;
    var system = settings.system;

    var size = settings.drawing.size;
    var loc = settings.drawing.loc;




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
    if( system.module.model && system.array.num_strings && system.array.num_modules  ){
        d.text([x,y], [
            system.module.make + " " + system.module.model +
                " (" + system.array.num_strings  + " strings of " + system.array.num_modules + " modules )"
        ], 'title2', 'text').rotate(-90);
    }

    x = page.left + padding;
    y = page.top + padding;
    y += size.drawing.titlebox * 1.5 * 3/4;







    return d.drawing_parts;
};



module.exports = add_border;

},{"./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_drawing.js":[function(require,module,exports){
'use strict';

var k = require('../lib/k/k.js');
var f = require('./functions.js');
var settings = require('./settings');

//var settings = require('./settings.js');
//var l_attr = settings.drawing.l_attr;
var _ = require('underscore');
// setup drawing containers

var settings = require('./settings');
var layer_attr = settings.drawing.layer_attr;





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

var blocks = {};
var block_active = false;
// Create default layer,block container and functions

// Layers

var layer_active = false;

drawing.layer = function(name){ // set current layer
    if( typeof name === 'undefined' ){ // if no layer name given, reset to default
        layer_active = false;
    } else if ( ! (name in layer_attr) ) {
        console.warn('Error: unknown layer, using base');
        layer_active = 'base' ;
    } else { // finaly activate requested layer
        layer_active = name;
    }
    //*/
};

var section_active = false;

drawing. section = function(name){ // set current section
    if( typeof name === 'undefined' ){ // if no section name given, reset to default
        section_active = false;
    } else { // finaly activate requested section
        section_active = name;
    }
    //*/
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
drawing.block_start = function(name) {
    if( typeof name === 'undefined' ){ // if name argument is submitted
        console.log('Error: name required');
    } else {
        var blk;
        // TODO: What if the same name is submitted twice? throw error or fix?
        block_active = name;
        if( typeof blocks[block_active] !== 'object'){
            blk = Object.create(Blk);
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
        if( ! (layer_name in layers) ){ console.log("error, layer does not exist, using current");}
        var layer_selected =  layer_active
    }
    */
drawing.block_end = function() {
    var blk = blocks[block_active];
    block_active = false;
    return blk;
};



// clear drawing
drawing.clear_drawing = function() {
    for( var id in blocks ){
        if( blocks.hasOwnProperty(id)){
            delete blocks[id];
        }
    }
    this.drawing_parts.length = 0;
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

drawing.add = function(type, points, layer_name) {

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
    if( type === 'line' ) {
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
        blocks[block_active].add(elem);
    } else {
        this.drawing_parts.push(elem);
    }

    return elem;
};

drawing.line = function(points, layer){ // (points, [layer])
    //return add('line', points, layer)
    var line =  this.add('line', points, layer);
    return line;
};

drawing.rect = function(loc, size, layer){
    var rec = this.add('rect', [loc], layer);
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

drawing.circ = function(loc, diameter, layer){
    var cir = this.add('circ', [loc], layer);
    cir.d = diameter;
    return cir;
};

drawing.text = function(loc, strings, font, layer){
    var txt = this.add('text', [loc], layer);
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
    var blk = Object.create(blocks[name]);
    blk.x = x;
    blk.y = y;

    if(block_active){
        blocks[block_active].add(blk);
    } else {
        this.drawing_parts.push(blk);
    }
    return blk;
};


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
    border: function(border_string){
        this.table.border( this.R, this.C, border_string );
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
        this.size_rows = [];
        for( r=1; r<=num_rows; r++){
            this.size_rows[r] = 15;
        }
        this.size_cols = [];
        for( c=1; c<=num_cols; c++){
            this.size_cols[c] = 60;
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
    /*
    size_col: function(col, s){
        if( typeof col === 'string' ){
            if( col === 'all'){
                _.range(this.num_cols).forEach(function(c){
                    this.size_cols[c+1] = s;
                },this);
            } else {
                s = Number(s);
                if( isNaN(s) ){
                    console.log('Error: column wrong');
                } else {
                    this.size_cols[col] = s;
                }
            }
        } else { // is number
            this.size_rows[col] = s;
        }
        return this;
    },
    size_row: function(row, s){
        if( typeof row === 'string' ){
            if( row === 'all'){
                _.range(this.num_rows).forEach(function(r){
                    this.size_rows[r+1] = s;
                },this);
            } else {
                s = Number(s);
                if( isNaN(s) ){
                    console.log('Error: column wrong');
                } else {
                    this.size_rows[row] = s;
                }
            }
        } else { // is number
            this.size_rows[row] = s;
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
    border: function( R, C, border_string){
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
                    this.borders_rows[R-1][C] = true;
                    break;
                case 'B':
                    this.borders_rows[R][C] = true;
                    break;
                case 'L':
                    this.borders_cols[C-1][R] = true;
                    break;
                case 'R':
                    this.borders_cols[C][R] = true;
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
            y += this.size_rows[r];
        }
        for( c=1; c<=C; c++ ){
            x += this.size_cols[c];
        }
        return [x,y];
    },
    center: function(R,C){
        var x = this.x;
        var y = this.y;
        var r,c;
        for( r=1; r<=R; r++ ){
            y += this.size_rows[r];
        }
        for( c=1; c<=C; c++ ){
            x += this.size_cols[c];
        }
        y -= this.size_rows[R]/2;
        x -= this.size_cols[C]/2;
        return [x,y];
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

                    this.drawing.text(
                        this.center(r,c),
                        this.cell(r,c).cell_text,
                        'table',
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

},{"../lib/k/k.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/k.js","./functions.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/functions.js","./settings":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/settings.js","underscore":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/node_modules/underscore/underscore.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_page_1.js":[function(require,module,exports){
var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');

var page = function(settings){
    console.log("** Making page 1");

    var d = mk_drawing();

    var sheet_section = 'A';
    var sheet_num = '01';
    d.append(mk_border(settings, sheet_section, sheet_num ));

    var size = settings.drawing.size;
    var loc = settings.drawing.loc;

    d.text(
        [size.drawing.w/2, size.drawing.h/2],
        'Title Sheet',
        'title2'
    );

    /*
    d.text([size.drawing.w/3,size.drawing.h/3], 'X', 'table');
    d.rect([size.drawing.w/3-5,size.drawing.h/3-5],[10,10],'box');

    var t = d.table(5,7).loc(size.drawing.w/3, size.drawing.h/3);
    console.log(t);
    t.cell(1,1).border('all').text('cell 1,1');
    t.cell(2,2).border('all').text('cell 2,2');
    t.cell(3,3).border('all').text('cell 3,3');
    t.cell(4,4).border('all').text('cell 4,4');
    t.cell(5,5).border('all').text('cell 5,5');



    t.cell(4,6).border('all').text('cell 4,6');
    t.cell(4,7).border('all').text('cell 4,7');
    t.cell(5,6).border('all').text('cell 5,6');
    t.cell(5,7).border('all').text('cell 5,7');


    var parts = t.mk();
    console.log(parts);
    //*/

    return d.drawing_parts;
};



module.exports = page;

},{"./mk_border":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_border.js","./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_page_2.js":[function(require,module,exports){
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

    var size = settings.drawing.size;
    var loc = settings.drawing.loc;




    var x, y, h, w;
    var offset;

// Define d.blocks
// module d.block
    w = size.module.frame.w;
    h = size.module.frame.h;

    d.block_start('module');

    // frame
    d.layer('module');
    d.rect( [0,h/2], [w,h] );
    // frame triangle?
    d.line([
        [-w/2,0],
        [0,w/2],
    ]);
    d.line([
        [0,w/2],
        [w/2,0],
    ]);
    // leads
    d.layer('DC_pos');
    d.line([
        [0, 0],
        [0, -size.module.lead]
    ]);
    d.layer('DC_neg');
    d.line([
        [0, h],
        [0, h+(size.module.lead)]
    ]);
    // pos sign
    d.layer('text');
    d.text(
        [size.module.lead/2, -size.module.lead/2],
        '+',
        'signs'
    );
    // neg sign
    d.text(
        [size.module.lead/2, h+size.module.lead/2],
        '-',
        'signs'
    );
    // ground
    d.layer('DC_ground');
    d.line([
        [-w/2, h/2],
        [-w/2-w/4, h/2],
    ]);

    d.layer();
    d.block_end();

//#string
    d.block_start('string');

    x = 0;
    y = 0;

    y += size.module.lead;

    //TODO: add loop to jump over negative return wires
    d.layer('DC_ground');
    d.line([
        [x-size.module.frame.w*3/4, y+size.module.frame.h/2],
        [x-size.module.frame.w*3/4, y+size.string.h + size.wire_offset.ground - size.module.lead],
        //[x-size.module.frame.w*3/4, y+size.string.h + size.wire_offset.ground ],
    ]);
    d.layer();

    d.block('module', [x,y]);
    y += size.module.h + size.string.gap_missing;
    d.block('module', [x,y]);
    y += size.module.h + size.string.gap;
    d.block('module', [x,y]);
    y += size.module.h + size.string.gap;
    d.block('module', [x,y]);

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
                " (" + system.array.num_strings  + " strings of " + system.array.num_modules + " modules )"
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

        console.log("Drawing: adding array");

        x = loc.array.right - size.string.w;
        y = loc.array.y;
        y -= size.string.h/2;


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
                [ loc.array.right+offset_wire , loc.array.y-offset_wire],
                [ loc.array.x , loc.array.y-offset_wire],
            ]);

            // negative home run
            d.layer('DC_neg');
            d.line([
                [ x , loc.array.lower ],
                [ x , loc.array.lower+offset_wire ],
                [ loc.array.right+offset_wire , loc.array.lower+offset_wire ],
                [ loc.array.right+offset_wire , loc.array.y+offset_wire],
                [ loc.array.x , loc.array.y+offset_wire],
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
            [ loc.array.left, loc.array.lower + size.wire_offset.ground ],
            [ loc.array.right+size.wire_offset.ground , loc.array.lower + size.wire_offset.ground ],
            [ loc.array.right+size.wire_offset.ground , loc.array.y + size.wire_offset.ground],
            [ loc.array.x , loc.array.y+size.wire_offset.ground],
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

        x = loc.array.x;
        y = loc.array.y;

        for( var i in _.range(system.array.num_strings)) {
            offset = size.wire_offset.min + ( size.wire_offset.base * i );

            d.layer('DC_pos');
            d.line([
                [ x , y-offset],
                [ x+(size.jb_box.w)/2 , y-offset],
            ]);
            d.block( 'terminal', {
                x: x+(size.jb_box.w)/2,
                y: y-offset,
            });
            d.line([
                [ x+(size.jb_box.w)/2 , y-offset],
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
                [ x+size.jb_box.w/2-size.fuse.w/2 , y+offset],
            ]);
            d.block( 'fuse', {
                x: x+size.jb_box.w/2 ,
                y: y+offset,
            });
            d.line([
                [ x+size.jb_box.w/2+size.fuse.w/2 , y+offset],
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
            [ x+(size.jb_box.w)/2 , y+offset],
        ]);
        d.block( 'terminal', {
            x: x+(size.jb_box.w)/2,
            y: y+offset,
        });
        d.line([
            [ x+(size.jb_box.w)/2 , y+offset],
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
    };

    d.layer('table');
    d.rect( [x,y], [w,h] );

    d.line([
        [x-w/2+25 , y-h/2+(1*row_h)],
        [x+w/2 , y-h/2+(1*row_h)],
    ]);

    for( var r=2; r<system.AC.num_conductors+3; r++ ) {

        d.line([
            [x-w/2 , y-h/2+(r*row_h)],
            [x+w/2 , y-h/2+(r*row_h)],
        ]);
    }
    x = loc.wire_table.x - w/2;
    y = loc.wire_table.y - h/2;
    x += column_width.number;

    var c_w = column_width.wire_gauge;
    d.line([ [x,top], [x,bottom-row_h] ]);
    d.text( [x+c_w,y+row_h*0.75], 'Wire', 'table', 'text');
    d.text( [x+c_w/2,y+row_h*1.75], 'AWG', 'table', 'text');
    x += c_w;

    c_w = column_width.wire_type;
    d.line([ [x,top+row_h], [x,bottom-row_h] ]);
    d.text( [x+c_w/2,y+row_h*1.75], 'Type', 'table', 'text');
    x += c_w;

    c_w = column_width.conduit_gauge;
    d.line([ [x,top], [x,bottom-row_h] ]);
    d.text( [x+c_w,y+row_h*0.75], 'Conduit', 'table', 'text');
    d.text( [x+c_w/2,y+row_h*1.75], 'Size', 'table', 'text');
    x += c_w;

    d.line([ [x,top+row_h], [x,bottom-row_h] ]);
    d.text( [x+c_w/2,y+row_h*1.75], 'Type', 'table', 'text');

    x = loc.wire_table.x - w/2;
    y = loc.wire_table.y - h/2;

    x += column_width.number/2;
    y += row_h*2 + row_h*0.75;

    for( var r=1; r<=system.wire_config_num; r++ ) {
        d.text( [x,y], String(r), 'table', 'text');



        y += row_h;
    }



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

},{"./mk_border":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_border.js","./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_page_3.js":[function(require,module,exports){
var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');

var page = function(settings){
    console.log("** Making page 3");

    d = mk_drawing();

    var sheet_section = 'PV';
    var sheet_num = '02';
    d.append(mk_border(settings, sheet_section, sheet_num ));

    var size = settings.drawing.size;
    var loc = settings.drawing.loc;


    d.text(
        [size.drawing.w/2, size.drawing.h/2],
        'Calculation Sheet',
        'title2'
    );

    return d.drawing_parts;
};



module.exports = page;

},{"./mk_border":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_border.js","./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_svg.js":[function(require,module,exports){
'use strict';
//var settings = require('./settings.js');
//var snapsvg = require('snapsvg');
//log(settings);



var display_svg = function(drawing_parts, settings){
    //console.log('displaying svg');
    var layer_attr = settings.drawing.layer_attr;
    var fonts = settings.drawing.fonts;
    //console.log('drawing_parts: ', drawing_parts);
    //container.empty()

    //var svg_elem = document.getElementById('SvgjsSvg1000')
    var svg_elem = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svg_elem.setAttribute('id','svg_drawing');
    svg_elem.setAttribute('width', settings.drawing.size.drawing.w);
    svg_elem.setAttribute('height', settings.drawing.size.drawing.h);
    //var svg = snapsvg(svg_elem).size(size.drawing.w, size.drawing.h);
    //var svg = snapsvg('#svg_drawing');

    // Loop through all the drawing contents, call the function below.
    drawing_parts.forEach( function(elem,id) {
        show_elem_array(elem);
    });

    function show_elem_array(elem, offset){
        offset = offset || {x:0,y:0};
        var x,y,attr;
        if( typeof elem.x !== 'undefined' ) { x = elem.x + offset.x; }
        if( typeof elem.y !== 'undefined' ) { y = elem.y + offset.y; }

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
            attr = layer_attr[elem.layer_name];
            for( var i2 in attr ){
                r.setAttribute(i2, attr[i2]);
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
            attr = layer_attr[elem.layer_name];
            for( var i2 in attr ){
                l.setAttribute(i2, attr[i2]);
            }
            svg_elem.appendChild(l);
        } else if( elem.type === 'text') {
            //var t = svg.text( elem.strings ).move( elem.points[0][0], elem.points[0][1] ).attr( layer_attr[elem.layer_name] )
            var font = fonts[elem.font];
            if( font['text-anchor'] === 'middle' ) y += font['font-size']*1/3;
            var t = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            t.setAttribute('x', x);
            //t.setAttribute('y', y + font['font-size']/2 );
            t.setAttribute('y', y );
            if(elem.rotated){
                //t.setAttribute('transform', "rotate(" + elem.rotated + " " + x + " " + y + ")" );
                t.setAttribute('transform', "rotate(" + elem.rotated + " " + x + " " + y + ")" );
            }
            for( var i2 in layer_attr[elem.layer_name] ){
                t.setAttribute( i2, layer_attr[elem.layer_name][i2] );
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
            attr = layer_attr[elem.layer_name];
            for( var i2 in attr ){
                c.setAttribute(i2, attr[i2]);
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

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/settings.js":[function(require,module,exports){
"use strict";
var f = require('./functions');
var k = require('../lib/k/k.js');

//var settingsCalculated = require('./settingsCalculated.js');

// Load 'user' defined settings
var mk_settings = require('../data/settings.json.js');
f.mk_settings = mk_settings;

var settings = {};

settings.config_options = {};
settings.config_options.NEC_tables = require('../data/tables.json');
//console.log(settings.config_options.NEC_tables);

settings.state = settings.state || {};
settings.state.database_loaded = false;

settings = mk_settings.i_options(settings);
settings = mk_settings.inputs(settings);
settings = mk_settings.system(settings);

settings.input_options = settings.inputs; // copy input reference with options to input_options
settings.inputs = f.blank_copy(settings.input_options); // make input section blank
settings.system_formulas = settings.system; // copy system reference to system_formulas
settings.system = f.blank_copy(settings.system_formulas); // make system section blank
f.merge_objects( settings.inputs, settings.system );

settings.input_options.DC = settings.input_options.DC || {};
settings.input_options.DC.AWG = k.obj_names(settings.config_options.NEC_tables['Ch 9 Table 8 Conductor Properties']);
// load layers

settings.drawing = settings.drawing || {};
settings.drawing.layer_attr = require('./settings_layers');

// Load drawing specific settings
// TODO Fix settings_drawing with new variable locations
var settings_drawing = require('./settings_drawing');
settings = settings_drawing(settings);

//settings.state_app.version_string = version_string;

//settings = f.nullToObject(settings);

settings.select_registry = [];
settings.value_registry = [];

var system = settings.system;

//var config_options = settings.config_options = settings.config_options || {};




settings.components = {};


/*
for( var section_name in settings.input_options ){
    for( var input_name in settings.input_options[section_name]){
        if( typeof settings.input_options[section_name][input_name] === 'string' ){
            console.log(settings.input_options[section_name][input_name])
            "obj_names(setttings" + settings.input_options[section_name][input_name] + ")";
            // eval is only being used on strings defined in the settings.json file that is built into the application
            settings.input_options[section_name][input_name] = eval(settings.input_options[section_name][input_name]);
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

},{"../data/settings.json.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/data/settings.json.js","../data/tables.json":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/data/tables.json","../lib/k/k.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/k.js","./functions":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/functions.js","./settings_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/settings_drawing.js","./settings_layers":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/settings_layers.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/settings_drawing.js":[function(require,module,exports){
"use strict";

function settings_drawing(settings){

    var system = settings.system;
    var status = settings.status;

    // Drawing specific
    settings.drawing = settings.drawing || {};

    ///////////////
    // fonts

    var fonts = settings.drawing.fonts = {};

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
        'font-family': 'monospace',
        'font-size':     6,
        'text-anchor':   'middle',
    };


    var size = settings.drawing.size = {};
    var loc = settings.drawing.loc = {};


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
    size.string.gap_missing = size.string.gap + size.module.frame.w;
    size.string.h = (size.module.h * 4) + (size.string.gap * 2) + size.string.gap_missing;
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
        y:600
    };
    loc.array.upper = loc.array.y - size.string.h/2;
    loc.array.lower = loc.array.upper + size.string.h;
    loc.array.right = loc.array.x - size.module.frame.h*3;

    loc.DC = loc.array;

    // DC jb
    size.jb_box = {
        h: 150,
        w: 80,
    };
    loc.jb_box = {
        x: loc.array.x + size.jb_box.w/2,
        y: loc.array.y + size.jb_box.h/10,
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
    size.wire_table = {};
    size.wire_table.w = 200;
    size.wire_table.row_h = 10;
    size.wire_table.h = (5+3) * size.wire_table.row_h; // 5 max wires, updated in update_system.js
    loc.wire_table = {
        x: size.drawing.w - size.drawing.titlebox - size.drawing.frame_padding*3 - size.wire_table.w/2 - 25,
        y: size.drawing.frame_padding*3 + size.wire_table.h/2,
    };
    loc.wire_table.top = loc.wire_table.y - size.wire_table.h/2;
    loc.wire_table.bottom = loc.wire_table.y + size.wire_table.h/2;


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
        x: settings.pages.PDF.w / settings.drawing.size.drawing.w,
        y: settings.pages.PDF.h / settings.drawing.size.drawing.h,
    };

    if( settings.pages.PDF.scale.x < settings.pages.PDF.scale.y ) {
        settings.page.scale = settings.pages.PDF.scale.x;
    } else {
        settings.page.scale = settings.pages.PDF.scale.y;
    }

  return settings;

}


module.exports = settings_drawing;

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/settings_layers.js":[function(require,module,exports){
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
layer_attr.table.stroke = '#000042';

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


module.exports = layer_attr;

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/update_system.js":[function(require,module,exports){
'use strict';

var k = require('../lib/k/k.js');
var f = require('./functions');
//var mk_drawing = require('./mk_drawing');
//var display_svg = require('./display_svg');

var object_defined = f.object_defined;

var update_system = function(settings) {

    //console.log('---settings---', settings);
    var config_options = settings.config_options;
    var system = settings.system;
    var loc = settings.drawing.loc;
    var size = settings.drawing.size;
    var state = settings.state;

    var calculated = settings.calculated;
    var calculated_formulas = settings.calculated_formulas;
    var inputs = settings.inputs;
    var input_options = settings.input_options;

    var sections = k.objIdArray(settings.inputs);
    //console.log(sections);
    sections.forEach(function(sectionName,id){
        //console.log( sectionName, f.object_defined(settings.inputs[sectionName]) );
    });

    f.mk_settings.system(settings);

    for( var section in settings.system_formulas ){


    }

    //var show_defaults = false;
    ///*
    if( true && state.version_string === 'Dev'){
        //show_defaults = true;
        console.log('Dev mode - defaults on');

        system.array.num_strings = system.array.num_strings || 4;
        system.array.num_modules = system.array.num_modules || 6;
        system.DC.home_run_length = system.DC.home_run_length || 50;

        settings.system.DC.AWG = settings.system.DC.AWG || settings.input_options.DC.AWG[10];

        if( state.database_loaded ){
            inputs.inverter.make = system.inverter.make = system.inverter.make ||
                'SMA';
            inputs.inverter.model = system.inverter.model = system.inverter.model ||
                'SI3000';

            inputs.module.make = system.module.make = system.module.make ||
                f.obj_names( settings.components.modules )[0];
            //if( system.module.make) settings.config_options.moduleModelArray = k.objIdArray(settings.config_options.modules[system.module.make]);
            inputs.module.model = system.module.model = system.module.model ||
                f.obj_names( settings.components.modules[system.module.make] )[0];


            inputs.module.model = system.module.model = system.module.model ||
                f.obj_names( settings.components.modules[system.module.make] )[0];

            inputs.AC.loadcenter_types = system.AC.loadcenter_types = system.AC.loadcenter_types ||
            //    f.obj_names(input_options.AC.loadcenter_types)[0];
                '480/277V';


            inputs.AC.type = system.AC.type = system.AC.type || '480V Wye';
            //inputs.AC.type = system.AC.type = system.AC.type ||
            //    input_options.AC.loadcenter_types[system.AC.loadcenter_types][0];

            inputs.AC.distance_to_loadcenter = system.AC.distance_to_loadcenter = system.AC.distance_to_loadcenter ||
                input_options.AC.distance_to_loadcenter[3];


            /*
            config_options.DC_homerun_AWG_options = k.objIdArray( config_options.NEC_tables['Ch 9 Table 8 Conductor Properties'] );
            system.array.homerun.AWG = system.array.homerun.AWG ||
                          config_options.DC_homerun_AWG_options[config_options.DC_homerun_AWG_options.length-1];

            settings.config_options.inverterMakeArray = k.objIdArray(settings.config_options.inverters);
            system.inverter.make = system.inverter.make || Object.keys( settings.config_options.inverters )[0];
            settings.config_options.inverterModelArray = k.objIdArray(settings.config_options.inverters[system.inverter.make]);

            system.AC_loadcenter_type = system.AC_loadcenter_type || config_options.AC_loadcenter_type_options[0];
            //*/
        }
    }
    //*/

    //console.log("update_system");
    //console.log(system.module.make);

    input_options.module.make = k.obj_names(settings.components.modules);
    if( system.module.make ) {
        input_options.module.model  = k.obj_names( settings.components.modules[system.module.make] );
    }

    if( system.module.model ) {
        system.module.specs = settings.components.modules[system.module.make][system.module.model];
    }

    input_options.inverter.make = k.obj_names(settings.components.inverters);
    if( system.inverter.make ) {
        input_options.inverter.model = k.obj_names( settings.components.inverters[system.inverter.make] );
    }

    //input_options.AC.loadcenter_type = settings.f.obj_names(input_options.AC.loadcenter_types);
    if( system.AC.loadcenter_types ) {
        var loadcenter_type = system.AC.loadcenter_types;
        var AC_options = input_options.AC.loadcenter_types[loadcenter_type];
        input_options.AC.type = AC_options;
        //i_options.AC.types[loadcenter_type];

        //input_options.AC['type'] = k.obj_names( settings.i_options.AC.type );
    }

    if( system.AC.type ) {
        system.AC.conductors = settings.i_options.AC.types[system.AC.type];
        system.AC.num_conductors = system.AC.conductors.length;

    }

    size.wire_offset.max = size.wire_offset.min + system.array.num_strings * size.wire_offset.base;
    size.wire_offset.ground = size.wire_offset.max + size.wire_offset.base*1;
    loc.array.left = loc.array.right - ( size.string.w * system.array.num_strings ) - ( size.module.frame.w*3/4 ) ;


    settings.drawing.size.wire_table.h = (system.AC.num_conductors+3) * settings.drawing.size.wire_table.row_h;

    /*
    for( var section_name in input_options ){
        for( var input_name in settings.input_options[section_name] ){
            if( typeof settings.input_options[section_name][input_name] === 'string' ){
                console.log( settings.input_options[section_name][input_name] );
                console.log( k.obj_names(
                    f.get_ref(settings.input_options[section_name][input_name], settings)
                ));

                var to_eval = "k.obj_names(setttings." + settings.input_options[section_name][input_name] + ")";
                console.log(to_eval);
                // eval is only being used on strings defined in the settings.json file that is built into the application
                /* jshint evil:true //*/
                // TODO: Look for alternative solutions that is more universal.
                // http://perfectionkills.com/global-eval-what-are-the-options/#indirect_eval_call_examples
                /*
                var e = eval; // This allows eval to be called indirectly, triggering a global call in modern browsers.
                settings.input_options[section_name][input_name] = e(to_eval);
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

module.exports = update_system;

},{"../lib/k/k.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/k.js","./functions":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/functions.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/data/settings.json.js":[function(require,module,exports){
e = {};
e.i_options = function(settings){
    settings.i_options = settings.i_options || {};
    try { settings.i_options.AC = settings.i_options.AC || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.i_options.AC.types = settings.i_options.AC.types || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.i_options.AC.types["120V"] = ["ground","neutral","L1"];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.i_options.AC.types["240V"] = ["ground","neutral","L1","L2"];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.i_options.AC.types["208V"] = ["ground","neutral","L1","L2"];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.i_options.AC.types["277V"] = ["ground","neutral","L1"];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.i_options.AC.types["480V Wye"] = ["ground","neutral","L1","L2","L3"];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.i_options.AC.types["480V Delta"] = ["ground","L1","L2","L3"];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    return settings;
};
e.inputs = function(settings){
    settings.inputs = settings.inputs || {};
    try { settings.inputs.module = settings.inputs.module || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.module.make = settings.inputs.module.make || null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.module.model = settings.inputs.module.model || null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.array = settings.inputs.array || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.array.num_modules = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.array.num_strings = [1,2,3,4,5,6];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.DC = settings.inputs.DC || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.DC.AWG = settings.inputs.DC.AWG || null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.DC.home_run_length = [25,50,75,100,125,150];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.DC.wire_size = settings.input_options.DC.AWG;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.inverter = settings.inputs.inverter || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.inverter.make = settings.inputs.inverter.make || null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.inverter.model = settings.inputs.inverter.model || null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.AC = settings.inputs.AC || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.AC.loadcenter_types = settings.inputs.AC.loadcenter_types || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.AC.loadcenter_types["240V"] = ["240V","120V"];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.AC.loadcenter_types["208/120V"] = ["208V","120V"];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.AC.loadcenter_types["480/277V"] = ["480V Wye","480V Delta","277V"];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.AC.type = settings.inputs.AC.type || null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.AC.distance_to_loadcenter = [3,5,10,15,20,30];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    return settings;
};
e.system = function(settings){
    settings.system = settings.system || {};
    try { settings.system.module = settings.system.module || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.system.module.specs = settings.system.module.specs || null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.system.array = settings.system.array || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.system.array.isc = system.module.isc * inputs.array.num_strings;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.system.array.voc = system.module.voc * inputs.array.num_module;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.system.array.imp = system.module.imp * inputs.array.num_module;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.system.array.vmp = system.module.vmp * inputs.array.num_strings;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.system.array.pmp = system.array.vmp  * system.array.array.imp;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.system.DC = settings.system.DC || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.system.inverter = settings.system.inverter || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.system.AC = settings.system.AC || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.system.AC.AWG = settings.system.AC.AWG || null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.system.AC.num_conductors = settings.system.AC.num_conductors || null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    return settings;
};
module.exports = e;
},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/data/tables.json":[function(require,module,exports){
module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports={

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

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/k.js":[function(require,module,exports){
/////////////////////////////////////////////////////////////////////////////////////////////////////////
// This is the k javascript library
// a collection of functions used by kshowalter
/////////////////////////////////////////////////////////////////////////////////////////////////////////

var moment = require('moment');
var $ = require('./k_DOM.js');


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

},{"./k_DOM.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/k_DOM.js","moment":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/node_modules/moment/moment.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/k_DOM.js":[function(require,module,exports){
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

},{"./k_DOM_extra.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/k_DOM_extra.js","./wrapper_prototype":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/wrapper_prototype.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/k_DOM_extra.js":[function(require,module,exports){
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

},{"./k.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/k.js","./k_DOM.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/k_DOM.js","./kontainer":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/kontainer.js","./wrapper_prototype":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/wrapper_prototype.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/k_data.js":[function(require,module,exports){
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





},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/kontainer.js":[function(require,module,exports){
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

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/wrapper_prototype.js":[function(require,module,exports){
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

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/main.js":[function(require,module,exports){
"use strict";
//var version_string = "Dev";
var version_string = "Alpha20141218";

// Moved to index.html
// TODO: look into ways to further reduce size. It seems way to big.
//var _ = require('underscore');
//var moment = require('moment');
//var $ = require('jquery');

var k = require('./lib/k/k.js');
var k_data = require('./lib/k/k_data');
var k$ = require('./lib/k/k_DOM');

var mk_page = {};
mk_page[1] = require('./app/mk_page_1');
mk_page[2] = require('./app/mk_page_2');
mk_page[3] = require('./app/mk_page_3');

var mk_svg= require('./app/mk_svg');
//var mk_pdf = require('./app/mk_pdf.js');
var update_system = require('./app/update_system');

var settings = require('./app/settings');
settings.state.version_string = version_string;
console.log('settings', settings);


var f = require('./app/functions');

f.settings = settings;
settings.f = f;

//var database_json_URL = "http://10.173.64.204:8000/temporary/";
var database_json_URL = "data/fsec_copy.json";

var components = settings.components;
var system = settings.system;



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



var update = settings.update = function(){
    console.log('/--- begin update');

    for( var section_name in settings.inputs ){
        //console.log( section_name, f.section_defined(section_name) );
    }


    settings.select_registry.forEach(function(selector){
        //console.log(selector.value());
        if(selector.value()) selector.system_ref.set(selector.value());
        if(selector.value()) selector.input_ref.set(selector.value());
        //console.log(selector.set_ref.refString, selector.value(), selector.set_ref.get());

    });


    //copy inputs from settings.input to settings.system.


    update_system(settings);

    settings.select_registry.forEach(function(selector){
        f.selector_add_options(selector);
    });

    settings.value_registry.forEach(function(value_item){
        value_item.elem.innerHTML = value_item.value_ref.get();
    });



    // Make drawing
    settings.drawing.parts = {};
    settings.drawing.svgs = {};
    $("#drawing").html('');

    for( var p in mk_page ){
        settings.drawing.parts[p] = mk_page[p](settings);
        settings.drawing.svgs[p] = mk_svg(settings.drawing.parts[p], settings);
        $("#drawing")
            //.append($("<p>Page "+p+"</p>"))
            .append($(settings.drawing.svgs[p]))
            .append($("</br>"))
            .append($("</br>"));

    }


    //*/
    //var pdf_download = mk_pdf(settings, setDownloadLink);
    //mk_pdf(settings, setDownloadLink);
    //pdf_download.html("Download PDF");
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
    //page.style('width', (settings.drawing.size.drawing.w+20).toString() + "px" )

    var system_frame = $('<div>').attr('id', system_frame_id).appendTo(page);


    var header_container = k$('div').appendTo(system_frame);
    k$('span').html('Please select your system spec below').attr('class', 'category_title').appendTo(header_container);
    k$('span').html(' | ').appendTo(header_container);
    //k$('input').attr('type', 'button').attr('value', 'clear selections').click(window.location.reload),
    k$('a').attr('href', 'javascript:window.location.reload()').html('clear selections').appendTo(header_container);


    // System setup
    $('<div>').html('System Setup').attr('class', 'section_title').appendTo(system_frame);
    var config_frame = $('<div>').attr('id', 'config_frame').appendTo(system_frame);

    //console.log(section_selector);
    f.add_selectors(settings, config_frame);

    // Parameters and specifications
    $('<div>').html('System Parameters').attr('class', 'section_title').appendTo(system_frame);
    var params_container = $('<div>').attr('class', 'section');
    params_container.appendTo(system_frame);
    f.add_params( settings, params_container );

    //TODO: add svg display of modules
    // http://quote.snapnrack.com/ui/o100.php#step-2

    // drawing
    //var drawing = $('div').attr('id', 'drawing_frame').attr('class', 'section').appendTo(page);
    var drawing = $('<div>').attr('id', 'drawing_frame').appendTo(page);
    drawing.css('width', (settings.drawing.size.drawing.w+20).toString() + "px" );
    $('<div>').html('Drawing').attr('class', 'section_title').appendTo(drawing);
    /*
    var page_selector = k$('selector')
        .setOptionsRef( 'config_options.page_options' )
        .setRef('state.active_page')
        .attr('class', 'corner_title')
        .appendTo(drawing);
    //f.kelem_setup(page_selector, settings);
    //*/
    //console.log(page_selector)

    //k$('span').attr('id', 'download').attr('class', 'float_right').appendTo(drawing);

    var svg_container_object = k$('div').attr('id', 'drawing').attr('class', 'drawing').css('clear', 'both').appendTo(drawing);
    //svg_container_object.style('width', settings.drawing.size.drawing.w+"px" )
    var svg_container = svg_container_object.elem;
    $('<br>').appendTo(drawing);

    ///////////////////
    $('<div>').html(' ').attr('class', 'section_title').appendTo(drawing);

}

page_setup(settings);

var boot_time = moment();
var status_id = "status";
setInterval(function(){ k.update_status_page(status_id, boot_time, version_string);},1000);

update();

console.log('settings', settings);

//console.log('window', window);

},{"./app/functions":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/functions.js","./app/mk_page_1":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_page_1.js","./app/mk_page_2":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_page_2.js","./app/mk_page_3":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_page_3.js","./app/mk_svg":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_svg.js","./app/settings":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/settings.js","./app/update_system":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/update_system.js","./lib/k/k.js":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/k.js","./lib/k/k_DOM":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/k_DOM.js","./lib/k/k_data":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/k_data.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/node_modules/moment/moment.js":[function(require,module,exports){
(function (global){
//! moment.js
//! version : 2.8.3
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (undefined) {
    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = '2.8.3',
        // the global-scope this is NOT the global object in Node.js
        globalScope = typeof global !== 'undefined' ? global : this,
        oldGlobalMoment,
        round = Math.round,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for locale config files
        locales = {},

        // extra moment internal properties (plugins register props here)
        momentProperties = [],

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

        // timezone chunker '+10:00' > ['10', '00'] or '-1530' > ['-15', '30']
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
            s: 45,  // seconds to minute
            m: 45,  // minutes to hour
            h: 22,  // hours to day
            d: 26,  // days to month
            M: 11   // months to year
        },

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.localeData().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.localeData().months(this, format);
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
                return this.localeData().weekdaysMin(this, format);
            },
            ddd  : function (format) {
                return this.localeData().weekdaysShort(this, format);
            },
            dddd : function (format) {
                return this.localeData().weekdays(this, format);
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
                return this.localeData().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), false);
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
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ':' + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ   : function () {
                var a = -this.zone(),
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
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

        deprecations = {},

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'];

    // Pick the first defined of two or three arguments. dfl comes from
    // default.
    function dfl(a, b, c) {
        switch (arguments.length) {
            case 2: return a != null ? a : b;
            case 3: return a != null ? a : b != null ? b : c;
            default: throw new Error('Implement me');
        }
    }

    function hasOwnProp(a, b) {
        return hasOwnProperty.call(a, b);
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

    function printMsg(msg) {
        if (moment.suppressDeprecationWarnings === false &&
                typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;
        return extend(function () {
            if (firstTime) {
                printMsg(msg);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            printMsg(msg);
            deprecations[name] = true;
        }
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.localeData().ordinal(func.call(this, a), period);
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

    function Locale() {
    }

    // Moment prototype object
    function Moment(config, skipOverflow) {
        if (skipOverflow !== false) {
            checkOverflow(config);
        }
        copyConfig(this, config);
        this._d = new Date(+config._d);
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

        this._locale = moment.localeData();

        this._bubble();
    }

    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = from._pf;
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
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

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = makeAs(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = moment.duration(val, period);
            addOrSubtractDurationFromMoment(this, dur, direction);
            return this;
        };
    }

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
        return Object.prototype.toString.call(input) === '[object Date]' ||
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
            if (hasOwnProp(inputObject, prop)) {
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
                method = moment._locale[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment._locale, m, format || '');
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

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        if (!locales[name] && hasModule) {
            try {
                oldLocale = moment.locale();
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we want to undo that for lazy loaded locales
                moment.locale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function makeAs(input, model) {
        return model._isUTC ? moment(input).zone(model._offset || 0) :
            moment(input).local();
    }

    /************************************
        Locale
    ************************************/


    extend(Locale.prototype, {

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

        _months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
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

        _weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
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
            LT : 'h:mm A',
            L : 'MM/DD/YYYY',
            LL : 'MMMM D, YYYY',
            LLL : 'MMMM D, YYYY LT',
            LLLL : 'dddd, MMMM D, YYYY LT'
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
            future : 'in %s',
            past : '%s ago',
            s : 'a few seconds',
            m : 'a minute',
            mm : '%d minutes',
            h : 'an hour',
            hh : '%d hours',
            d : 'a day',
            dd : '%d days',
            M : 'a month',
            MM : '%d months',
            y : 'a year',
            yy : '%d years'
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
            return this._ordinal.replace('%d', number);
        },
        _ordinal : '%d',

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

    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
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
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
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
            if (strict) {
                return parseTokenOneDigit;
            }
            /* falls through */
        case 'SS':
            if (strict) {
                return parseTokenTwoDigits;
            }
            /* falls through */
        case 'SSS':
            if (strict) {
                return parseTokenThreeDigits;
            }
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
            return config._locale._meridiemParse;
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
            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), 'i'));
            return a;
        }
    }

    function timezoneMinutesFromString(string) {
        string = string || '';
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
            a = config._locale.monthsParse(input);
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
            config._isPm = config._locale.isPM(input);
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
            a = config._locale.weekdaysParse(input);
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
        var w, weekYear, week, weekday, dow, doy, temp;

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
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

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
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

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
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
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
                    // match[5] should be 'T' or undefined
                    config._f = isoDates[i][0] + (match[6] || ' ');
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
                config._f += 'Z';
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

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function makeDateFromInput(config) {
        var input = config._i, matched;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if ((matched = aspNetJsonRegex.exec(input)) !== null) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            dateFromConfig(config);
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

    function parseWeekday(input, locale) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = locale.weekdaysParse(input);
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
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(posNegDuration, withoutSuffix, locale) {
        var duration = moment.duration(posNegDuration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('M')),
            years = round(duration.as('y')),

            args = seconds < relativeTimeThresholds.s && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < relativeTimeThresholds.m && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < relativeTimeThresholds.h && ['hh', hours] ||
                days === 1 && ['d'] ||
                days < relativeTimeThresholds.d && ['dd', days] ||
                months === 1 && ['M'] ||
                months < relativeTimeThresholds.M && ['MM', months] ||
                years === 1 && ['y'] || ['yy', years];

        args[2] = withoutSuffix;
        args[3] = +posNegDuration > 0;
        args[4] = locale;
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

        adjustedMoment = moment(mom).add(daysToDayOfWeek, 'd');
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

        config._locale = config._locale || moment.localeData(config._l);

        if (input === null || (format === undefined && input === '')) {
            return moment.invalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (moment.isMoment(input)) {
            return new Moment(input, true);
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

    moment = function (input, format, locale, strict) {
        var c;

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = locale;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();

        return makeMoment(c);
    };

    moment.suppressDeprecationWarnings = false;

    moment.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i);
        }
    );

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
    moment.utc = function (input, format, locale, strict) {
        var c;

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = locale;
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
            parseIso,
            diffRes;

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
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
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
        } else if (typeof duration === 'object' &&
                ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(moment(duration.from), moment(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (moment.isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
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
    moment.relativeTimeThreshold = function (threshold, limit) {
        if (relativeTimeThresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return relativeTimeThresholds[threshold];
        }
        relativeTimeThresholds[threshold] = limit;
        return true;
    };

    moment.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        function (key, value) {
            return moment.locale(key, value);
        }
    );

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    moment.locale = function (key, values) {
        var data;
        if (key) {
            if (typeof(values) !== 'undefined') {
                data = moment.defineLocale(key, values);
            }
            else {
                data = moment.localeData(key);
            }

            if (data) {
                moment.duration._locale = moment._locale = data;
            }
        }

        return moment._locale._abbr;
    };

    moment.defineLocale = function (name, values) {
        if (values !== null) {
            values.abbr = name;
            if (!locales[name]) {
                locales[name] = new Locale();
            }
            locales[name].set(values);

            // backwards compat for now: also set the locale
            moment.locale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    };

    moment.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        function (key) {
            return moment.localeData(key);
        }
    );

    // returns locale data
    moment.localeData = function (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return moment._locale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null && hasOwnProp(obj, '_isAMomentObject'));
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
            return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
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

        utc : function (keepLocalTime) {
            return this.zone(0, keepLocalTime);
        },

        local : function (keepLocalTime) {
            if (this._isUTC) {
                this.zone(0, keepLocalTime);
                this._isUTC = false;

                if (keepLocalTime) {
                    this.add(this._dateTzOffset(), 'm');
                }
            }
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.localeData().postformat(output);
        },

        add : createAdder(1, 'add'),

        subtract : createAdder(-1, 'subtract'),

        diff : function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (this.zone() - that.zone()) * 6e4,
                diff, output, daysAdjust;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month') {
                // average number of days in the months in the given dates
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                // difference in months
                output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                // adjust by taking difference in days, average number of days
                // and dst in the given months.
                daysAdjust = (this - moment(this).startOf('month')) -
                    (that - moment(that).startOf('month'));
                // same as above but with zones, to negate all dst
                daysAdjust -= ((this.zone() - moment(this).startOf('month').zone()) -
                        (that.zone() - moment(that).startOf('month').zone())) * 6e4;
                output += daysAdjust / diff;
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
            return moment.duration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
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
            return this.format(this.localeData().calendar(format, this));
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
                input = parseWeekday(input, this.localeData());
                return this.add(input - day, 'd');
            } else {
                return day;
            }
        },

        month : makeAccessor('Month', true),

        startOf : function (units) {
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
            return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
        },

        isAfter: function (input, units) {
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this > +input;
            } else {
                return +this.clone().startOf(units) > +moment(input).startOf(units);
            }
        },

        isBefore: function (input, units) {
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this < +input;
            } else {
                return +this.clone().startOf(units) < +moment(input).startOf(units);
            }
        },

        isSame: function (input, units) {
            units = normalizeUnits(units || 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this === +input;
            } else {
                return +this.clone().startOf(units) === +makeAs(input, this).startOf(units);
            }
        },

        min: deprecate(
                 'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
                 function (other) {
                     other = moment.apply(null, arguments);
                     return other < this ? this : other;
                 }
         ),

        max: deprecate(
                'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
                function (other) {
                    other = moment.apply(null, arguments);
                    return other > this ? this : other;
                }
        ),

        // keepLocalTime = true means only change the timezone, without
        // affecting the local hour. So 5:31:26 +0300 --[zone(2, true)]-->
        // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist int zone
        // +0200, so we adjust the time as needed, to be valid.
        //
        // Keeping the time actually adds/subtracts (one hour)
        // from the actual represented time. That is why we call updateOffset
        // a second time. In case it wants us to change the offset again
        // _changeInProgress == true case, then we have to adjust, because
        // there is no such time in the given timezone.
        zone : function (input, keepLocalTime) {
            var offset = this._offset || 0,
                localAdjust;
            if (input != null) {
                if (typeof input === 'string') {
                    input = timezoneMinutesFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                if (!this._isUTC && keepLocalTime) {
                    localAdjust = this._dateTzOffset();
                }
                this._offset = input;
                this._isUTC = true;
                if (localAdjust != null) {
                    this.subtract(localAdjust, 'm');
                }
                if (offset !== input) {
                    if (!keepLocalTime || this._changeInProgress) {
                        addOrSubtractDurationFromMoment(this,
                                moment.duration(offset - input, 'm'), 1, false);
                    } else if (!this._changeInProgress) {
                        this._changeInProgress = true;
                        moment.updateOffset(this, true);
                        this._changeInProgress = null;
                    }
                }
            } else {
                return this._isUTC ? offset : this._dateTzOffset();
            }
            return this;
        },

        zoneAbbr : function () {
            return this._isUTC ? 'UTC' : '';
        },

        zoneName : function () {
            return this._isUTC ? 'Coordinated Universal Time' : '';
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
            return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
        },

        quarter : function (input) {
            return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
        },

        weekYear : function (input) {
            var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
            return input == null ? year : this.add((input - year), 'y');
        },

        isoWeekYear : function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add((input - year), 'y');
        },

        week : function (input) {
            var week = this.localeData().week(this);
            return input == null ? week : this.add((input - week) * 7, 'd');
        },

        isoWeek : function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add((input - week) * 7, 'd');
        },

        weekday : function (input) {
            var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
            return input == null ? weekday : this.add(input - weekday, 'd');
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
            var weekInfo = this.localeData()._week;
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

        // If passed a locale key, it will set the locale for this
        // instance.  Otherwise, it will return the locale configuration
        // variables for this instance.
        locale : function (key) {
            var newLocaleData;

            if (key === undefined) {
                return this._locale._abbr;
            } else {
                newLocaleData = moment.localeData(key);
                if (newLocaleData != null) {
                    this._locale = newLocaleData;
                }
                return this;
            }
        },

        lang : deprecate(
            'moment().lang() is deprecated. Use moment().localeData() instead.',
            function (key) {
                if (key === undefined) {
                    return this.localeData();
                } else {
                    return this.locale(key);
                }
            }
        ),

        localeData : function () {
            return this._locale;
        },

        _dateTzOffset : function () {
            // On Firefox.24 Date#getTimezoneOffset returns a floating point.
            // https://github.com/moment/moment/pull/1871
            return Math.round(this._d.getTimezoneOffset() / 15) * 15;
        }
    });

    function rawMonthSetter(mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
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
    moment.fn.dates = deprecate('dates accessor is deprecated. Use date instead.', makeAccessor('Date', true));
    moment.fn.year = makeAccessor('FullYear', true);
    moment.fn.years = deprecate('years accessor is deprecated. Use year instead.', makeAccessor('FullYear', true));

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


    function daysToYears (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        return days * 400 / 146097;
    }

    function yearsToDays (years) {
        // years * 365 + absRound(years / 4) -
        //     absRound(years / 100) + absRound(years / 400);
        return years * 146097 / 400;
    }

    extend(moment.duration.fn = Duration.prototype, {

        _bubble : function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years = 0;

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

            // Accurately convert days to years, assume start from year 0.
            years = absRound(daysToYears(days));
            days -= absRound(yearsToDays(years));

            // 30 days to a month
            // TODO (iskren): Use anchor date (like 1st Jan) to compute this.
            months += absRound(days / 30);
            days %= 30;

            // 12 months -> 1 year
            years += absRound(months / 12);
            months %= 12;

            data.days = days;
            data.months = months;
            data.years = years;
        },

        abs : function () {
            this._milliseconds = Math.abs(this._milliseconds);
            this._days = Math.abs(this._days);
            this._months = Math.abs(this._months);

            this._data.milliseconds = Math.abs(this._data.milliseconds);
            this._data.seconds = Math.abs(this._data.seconds);
            this._data.minutes = Math.abs(this._data.minutes);
            this._data.hours = Math.abs(this._data.hours);
            this._data.months = Math.abs(this._data.months);
            this._data.years = Math.abs(this._data.years);

            return this;
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
            var output = relativeTime(this, !withSuffix, this.localeData());

            if (withSuffix) {
                output = this.localeData().pastFuture(+this, output);
            }

            return this.localeData().postformat(output);
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
            var days, months;
            units = normalizeUnits(units);

            if (units === 'month' || units === 'year') {
                days = this._days + this._milliseconds / 864e5;
                months = this._months + daysToYears(days) * 12;
                return units === 'month' ? months : months / 12;
            } else {
                // handle milliseconds separately because of floating point math errors (issue #1867)
                days = this._days + yearsToDays(this._months / 12);
                switch (units) {
                    case 'week': return days / 7 + this._milliseconds / 6048e5;
                    case 'day': return days + this._milliseconds / 864e5;
                    case 'hour': return days * 24 + this._milliseconds / 36e5;
                    case 'minute': return days * 24 * 60 + this._milliseconds / 6e4;
                    case 'second': return days * 24 * 60 * 60 + this._milliseconds / 1000;
                    // Math.floor prevents floating point math errors here
                    case 'millisecond': return Math.floor(days * 24 * 60 * 60 * 1000) + this._milliseconds;
                    default: throw new Error('Unknown unit ' + units);
                }
            }
        },

        lang : moment.fn.lang,
        locale : moment.fn.locale,

        toIsoString : deprecate(
            'toIsoString() is deprecated. Please use toISOString() instead ' +
            '(notice the capitals)',
            function () {
                return this.toISOString();
            }
        ),

        toISOString : function () {
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
        },

        localeData : function () {
            return this._locale;
        }
    });

    moment.duration.fn.toString = moment.duration.fn.toISOString;

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    for (i in unitMillisecondFactors) {
        if (hasOwnProp(unitMillisecondFactors, i)) {
            makeDurationGetter(i.toLowerCase());
        }
    }

    moment.duration.fn.asMilliseconds = function () {
        return this.as('ms');
    };
    moment.duration.fn.asSeconds = function () {
        return this.as('s');
    };
    moment.duration.fn.asMinutes = function () {
        return this.as('m');
    };
    moment.duration.fn.asHours = function () {
        return this.as('h');
    };
    moment.duration.fn.asDays = function () {
        return this.as('d');
    };
    moment.duration.fn.asWeeks = function () {
        return this.as('weeks');
    };
    moment.duration.fn.asMonths = function () {
        return this.as('M');
    };
    moment.duration.fn.asYears = function () {
        return this.as('y');
    };

    /************************************
        Default Locale
    ************************************/


    // Set default locale, other locale will inherit from English.
    moment.locale('en', {
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    /* EMBED_LOCALES */

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
                    'Accessing Moment through the global scope is ' +
                    'deprecated, and will be removed in an upcoming ' +
                    'release.',
                    moment);
        } else {
            globalScope.moment = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    } else if (typeof define === 'function' && define.amd) {
        define('moment', function (require, exports, module) {
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/node_modules/underscore/underscore.js":[function(require,module,exports){
//     Underscore.js 1.7.0
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
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.7.0';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var createCallback = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  _.iteratee = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return createCallback(value, context, argCount);
    if (_.isObject(value)) return _.matches(value);
    return _.property(value);
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    if (obj == null) return obj;
    iteratee = createCallback(iteratee, context);
    var i, length = obj.length;
    if (length === +length) {
      for (i = 0; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    if (obj == null) return [];
    iteratee = _.iteratee(iteratee, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length),
        currentKey;
    for (var index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = createCallback(iteratee, context, 4);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index = 0, currentKey;
    if (arguments.length < 3) {
      if (!length) throw new TypeError(reduceError);
      memo = obj[keys ? keys[index++] : index++];
    }
    for (; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = createCallback(iteratee, context, 4);
    var keys = obj.length !== + obj.length && _.keys(obj),
        index = (keys || obj).length,
        currentKey;
    if (arguments.length < 3) {
      if (!index) throw new TypeError(reduceError);
      memo = obj[keys ? keys[--index] : --index];
    }
    while (index--) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    predicate = _.iteratee(predicate, context);
    _.some(obj, function(value, index, list) {
      if (predicate(value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    predicate = _.iteratee(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(_.iteratee(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    if (obj == null) return true;
    predicate = _.iteratee(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    if (obj == null) return false;
    predicate = _.iteratee(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (obj.length !== +obj.length) obj = _.values(obj);
    return _.indexOf(obj, target) >= 0;
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

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = obj && obj.length === +obj.length ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
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

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = _.iteratee(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
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
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = _.iteratee(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = low + high >>> 1;
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
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
    return obj.length === +obj.length ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = _.iteratee(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    for (var i = 0, length = input.length; i < length; i++) {
      var value = input[i];
      if (!_.isArray(value) && !_.isArguments(value)) {
        if (!strict) output.push(value);
      } else if (shallow) {
        push.apply(output, value);
      } else {
        flatten(value, shallow, strict, output);
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (array == null) return [];
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = _.iteratee(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i];
      if (isSorted) {
        if (!i || seen !== value) result.push(value);
        seen = value;
      } else if (iteratee) {
        var computed = iteratee(value, i, array);
        if (_.indexOf(seen, computed) < 0) {
          seen.push(computed);
          result.push(value);
        }
      } else if (_.indexOf(result, value) < 0) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true, []));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    if (array == null) return [];
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = array.length; i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(slice.call(arguments, 1), true, true, []);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function(array) {
    if (array == null) return [];
    var length = _.max(arguments, 'length').length;
    var results = Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, i);
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

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var idx = array.length;
    if (typeof from == 'number') {
      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
    }
    while (--idx >= 0) if (array[idx] === item) return idx;
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
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var Ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    args = slice.call(arguments, 2);
    bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      Ctor.prototype = func.prototype;
      var self = new Ctor;
      Ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (_.isObject(result)) return result;
      return self;
    };
    return bound;
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
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = hasher ? hasher.apply(this, arguments) : key;
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
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
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
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

      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
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

  // Returns a function that will only be executed before being called N times.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      } else {
        func = null;
      }
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

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
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
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
    if (!_.isObject(obj)) return obj;
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        if (hasOwnProperty.call(source, prop)) {
            obj[prop] = source[prop];
        }
      }
    }
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj, iteratee, context) {
    var result = {}, key;
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      iteratee = createCallback(iteratee, context);
      for (key in obj) {
        var value = obj[key];
        if (iteratee(value, key, obj)) result[key] = value;
      }
    } else {
      var keys = concat.apply([], slice.call(arguments, 1));
      obj = new Object(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        if (key in obj) result[key] = obj[key];
      }
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(concat.apply([], slice.call(arguments, 1)), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    if (!_.isObject(obj)) return obj;
    for (var i = 1, length = arguments.length; i < length; i++) {
      var source = arguments[i];
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
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
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (
      aCtor !== bCtor &&
      // Handle Object.create(x) cases
      'constructor' in a && 'constructor' in b &&
      !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
        _.isFunction(bCtor) && bCtor instanceof bCtor)
    ) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size, result;
    // Recursively compare objects and arrays.
    if (className === '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size === b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      size = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      result = _.keys(b).length === size;
      if (result) {
        while (size--) {
          // Deep compare each member
          key = keys[size];
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
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
    if (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)) return obj.length === 0;
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
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around an IE 11 bug.
  if (typeof /./ !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
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
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    var pairs = _.pairs(attrs), length = pairs.length;
    return function(obj) {
      if (obj == null) return !length;
      obj = new Object(obj);
      for (var i = 0; i < length; i++) {
        var pair = pairs[i], key = pair[0];
        if (pair[1] !== obj[key] || !(key in obj)) return false;
      }
      return true;
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = createCallback(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
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
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? object[property]() : value;
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
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
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

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

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
}.call(this));

},{}]},{},["/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/main.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lX2Rldi9hcHAvZnVuY3Rpb25zLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmVfZGV2L2FwcC9ta19ib3JkZXIuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZV9kZXYvYXBwL21rX2RyYXdpbmcuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZV9kZXYvYXBwL21rX3BhZ2VfMS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lX2Rldi9hcHAvbWtfcGFnZV8yLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmVfZGV2L2FwcC9ta19wYWdlXzMuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZV9kZXYvYXBwL21rX3N2Zy5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lX2Rldi9hcHAvc2V0dGluZ3MuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZV9kZXYvYXBwL3NldHRpbmdzX2RyYXdpbmcuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZV9kZXYvYXBwL3NldHRpbmdzX2xheWVycy5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lX2Rldi9hcHAvdXBkYXRlX3N5c3RlbS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lX2Rldi9kYXRhL3NldHRpbmdzLmpzb24uanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZV9kZXYvZGF0YS90YWJsZXMuanNvbiIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lX2Rldi9saWIvay9rLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmVfZGV2L2xpYi9rL2tfRE9NLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmVfZGV2L2xpYi9rL2tfRE9NX2V4dHJhLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmVfZGV2L2xpYi9rL2tfZGF0YS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lX2Rldi9saWIvay9rb250YWluZXIuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZV9kZXYvbGliL2svd3JhcHBlcl9wcm90b3R5cGUuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZV9kZXYvbWFpbi5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lX2Rldi9ub2RlX21vZHVsZXMvbW9tZW50L21vbWVudC5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lX2Rldi9ub2RlX21vZHVsZXMvdW5kZXJzY29yZS91bmRlcnNjb3JlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbjNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxeUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG4vL3ZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgayQgPSByZXF1aXJlKCcuLi9saWIvay9rX0RPTScpO1xudmFyIGsgPSByZXF1aXJlKCcuLi9saWIvay9rJyk7XG52YXIga29udGFpbmVyID0gcmVxdWlyZSgnLi4vbGliL2sva29udGFpbmVyJyk7XG5cbnZhciBmID0ge307XG5cbmYub2JqX25hbWVzID0gZnVuY3Rpb24oIG9iamVjdCApIHtcbiAgICBpZiggb2JqZWN0ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHZhciBhID0gW107XG4gICAgICAgIGZvciggdmFyIGlkIGluIG9iamVjdCApIHtcbiAgICAgICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoaWQpICkgIHtcbiAgICAgICAgICAgICAgICBhLnB1c2goaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbn07XG5cbmYub2JqZWN0X2RlZmluZWQgPSBmdW5jdGlvbihvYmplY3Qpe1xuICAgIC8vY29uc29sZS5sb2cob2JqZWN0KTtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0ICl7XG4gICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhrZXkpO1xuICAgICAgICAgICAgaWYoIG9iamVjdFtrZXldID09PSBudWxsIHx8IG9iamVjdFtrZXldID09PSB1bmRlZmluZWQgKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5mLnNlY3Rpb25fZGVmaW5lZCA9IGZ1bmN0aW9uKHNlY3Rpb25fbmFtZSl7XG4gICAgLy9jb25zb2xlLmxvZyhcIi1cIitzZWN0aW9uX25hbWUpO1xuICAgIHJldHVybiBmLm9iamVjdF9kZWZpbmVkKGYuc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV0gKTtcbn07XG5cbmYubnVsbFRvT2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0ICl7XG4gICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgaWYoIG9iamVjdFtrZXldID09PSBudWxsICl7XG4gICAgICAgICAgICAgICAgb2JqZWN0W2tleV0gPSB7fTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiggdHlwZW9mIG9iamVjdFtrZXldID09PSAnb2JqZWN0JyApIHtcbiAgICAgICAgICAgICAgICBvYmplY3Rba2V5XSA9IGYubnVsbFRvT2JqZWN0KG9iamVjdFtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xufTtcblxuZi5ibGFua19jb3B5ID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICB2YXIgbmV3T2JqZWN0ID0ge307XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdCApe1xuICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIGlmKCBvYmplY3Rba2V5XS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICkge1xuICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldID0ge307XG4gICAgICAgICAgICAgICAgZm9yKCB2YXIga2V5MiBpbiBvYmplY3Rba2V5XSApe1xuICAgICAgICAgICAgICAgICAgICBpZiggb2JqZWN0W2tleV0uaGFzT3duUHJvcGVydHkoa2V5MikgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldW2tleTJdID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3T2JqZWN0W2tleV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdPYmplY3Q7XG59O1xuXG5mLm1lcmdlX29iamVjdHMgPSBmdW5jdGlvbiBtZXJnZV9vYmplY3RzKG9iamVjdDEsIG9iamVjdDIpe1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QxICl7XG4gICAgICAgIGlmKCBvYmplY3QxLmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIC8vaWYoIGtleSA9PT0gJ21ha2UnICkgY29uc29sZS5sb2coa2V5LCBvYmplY3QxLCB0eXBlb2Ygb2JqZWN0MVtrZXldLCB0eXBlb2Ygb2JqZWN0MltrZXldKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coa2V5LCBvYmplY3QxLCB0eXBlb2Ygb2JqZWN0MVtrZXldLCB0eXBlb2Ygb2JqZWN0MltrZXldKTtcbiAgICAgICAgICAgIGlmKCBvYmplY3QxW2tleV0gJiYgb2JqZWN0MVtrZXldLmNvbnN0cnVjdG9yID09PSBPYmplY3QgKSB7XG4gICAgICAgICAgICAgICAgaWYoIG9iamVjdDJba2V5XSA9PT0gdW5kZWZpbmVkICkgb2JqZWN0MltrZXldID0ge307XG4gICAgICAgICAgICAgICAgbWVyZ2Vfb2JqZWN0cyggb2JqZWN0MVtrZXldLCBvYmplY3QyW2tleV0gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYoIG9iamVjdDJba2V5XSA9PT0gdW5kZWZpbmVkICkgb2JqZWN0MltrZXldID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmYuYXJyYXlfdG9fb2JqZWN0ID0gZnVuY3Rpb24oYXJyKSB7XG4gICAgdmFyIHIgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7ICsraSlcbiAgICAgICAgcltpXSA9IGFycltpXTtcbiAgICByZXR1cm4gcjtcbn07XG5cbmYubmFuX2NoZWNrID0gZnVuY3Rpb24gbmFuX2NoZWNrKG9iamVjdCwgcGF0aCl7XG4gICAgaWYoIHBhdGggPT09IHVuZGVmaW5lZCApIHBhdGggPSBcIlwiO1xuICAgIHBhdGggPSBwYXRoK1wiLlwiO1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QgKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggXCJOYU5jaGVjazogXCIrcGF0aCtrZXkgKTtcblxuICAgICAgICBpZiggb2JqZWN0W2tleV0gJiYgb2JqZWN0W2tleV0uY29uc3RydWN0b3IgPT09IEFycmF5ICkgb2JqZWN0W2tleV0gPSBmLmFycmF5X3RvX29iamVjdChvYmplY3Rba2V5XSk7XG5cblxuICAgICAgICBpZiggIG9iamVjdFtrZXldICYmICggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgfHwgb2JqZWN0W2tleV0gIT09IG51bGwgKSl7XG4gICAgICAgICAgICBpZiggb2JqZWN0W2tleV0uY29uc3RydWN0b3IgPT09IE9iamVjdCApe1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coIFwiICBPYmplY3Q6IFwiK3BhdGgra2V5ICk7XG4gICAgICAgICAgICAgICAgbmFuX2NoZWNrKCBvYmplY3Rba2V5XSwgcGF0aCtrZXkgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiggb2JqZWN0W2tleV0gPT09IE5hTiB8fCBvYmplY3Rba2V5XSA9PT0gbnVsbCApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcIk5hTjogXCIrcGF0aCtrZXkgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggXCJEZWZpbmVkOiBcIitwYXRoK2tleSwgb2JqZWN0W2tleV0pO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cbn07XG5cblxuXG5mLnByZXR0eV93b3JkID0gZnVuY3Rpb24obmFtZSl7XG4gICAgcmV0dXJuIG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnNsaWNlKDEpO1xufTtcblxuZi5wcmV0dHlfbmFtZSA9IGZ1bmN0aW9uKG5hbWUpe1xuICAgIHZhciBsID0gbmFtZS5zcGxpdCgnXycpO1xuICAgIGwuZm9yRWFjaChmdW5jdGlvbihuYW1lX3NlcW1lbnQsaSl7XG4gICAgICAgIGxbaV0gPSBmLnByZXR0eV93b3JkKG5hbWVfc2VxbWVudCk7XG4gICAgfSk7XG4gICAgdmFyIHByZXR0eSA9IGwuam9pbignICcpO1xuXG4gICAgcmV0dXJuIHByZXR0eTtcbn07XG5cbmYucHJldHR5X25hbWVzID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICB2YXIgbmV3X29iamVjdCA9IHt9O1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QgKXtcbiAgICAgICAgaWYoIG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpICl7XG4gICAgICAgICAgICB2YXIgbmV3X2tleSA9IGYucHJldHR5X25hbWUoa2V5KTtcbiAgICAgICAgICAgIG5ld19vYmplY3RbbmV3X2tleV0gPSBvYmplY3Rba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3X29iamVjdDtcbn07XG5cbi8qXG5mLmtlbGVtX3NldHVwID0gZnVuY3Rpb24oa2VsZW0sIHNldHRpbmdzKXtcbiAgICBpZiggIXNldHRpbmdzKSBjb25zb2xlLmxvZyhzZXR0aW5ncyk7XG4gICAgaWYoIGtlbGVtLnR5cGUgPT09ICdzZWxlY3RvcicgKXtcbiAgICAgICAga2VsZW0uc2V0UmVmT2JqKHNldHRpbmdzKTtcbiAgICAgICAga2VsZW0uc2V0VXBkYXRlKHNldHRpbmdzLnVwZGF0ZSk7XG4gICAgICAgIHNldHRpbmdzLnNlbGVjdF9yZWdpc3RyeS5wdXNoKGtlbGVtKTtcbiAgICAgICAga2VsZW0udXBkYXRlKCk7XG4gICAgfSBlbHNlIGlmKCBrZWxlbS50eXBlID09PSAndmFsdWUnICl7XG4gICAgICAgIGtlbGVtLnNldFJlZk9iaihzZXR0aW5ncyk7XG4gICAgICAgIC8va2VsZW0uc2V0VXBkYXRlKHVwZGF0ZV9zeXN0ZW0pO1xuICAgICAgICBzZXR0aW5ncy52YWx1ZV9yZWdpc3RyeS5wdXNoKGtlbGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIGtlbGVtO1xufTtcbiovXG5cbmYuYWRkX3NlbGVjdG9ycyA9IGZ1bmN0aW9uKHNldHRpbmdzLCBwYXJlbnRfY29udGFpbmVyKXtcbiAgICBmb3IoIHZhciBzZWN0aW9uX25hbWUgaW4gc2V0dGluZ3MuaW5wdXRfb3B0aW9ucyApe1xuICAgICAgICB2YXIgc2VsZWN0aW9uX2NvbnRhaW5lciA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAnaW5wdXRfc2VjdGlvbicpLmF0dHIoJ2lkJywgc2VjdGlvbl9uYW1lICkuYXBwZW5kVG8ocGFyZW50X2NvbnRhaW5lcik7XG4gICAgICAgIC8vc2VsZWN0aW9uX2NvbnRhaW5lci5nZXQoMCkuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlfdHlwZTtcbiAgICAgICAgdmFyIHN5c3RlbV9kaXYgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3RpdGxlX2JhcicpXG4gICAgICAgICAgICAuYXBwZW5kVG8oc2VsZWN0aW9uX2NvbnRhaW5lcilcbiAgICAgICAgICAgIC8qIGpzaGludCAtVzA4MyAqL1xuICAgICAgICAgICAgLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5jaGlsZHJlbignLmRyYXdlcicpLmNoaWxkcmVuKCcuZHJhd2VyX2NvbnRlbnQnKS5zbGlkZVRvZ2dsZSgnZmFzdCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIHZhciBzeXN0ZW1fdGl0bGUgPSAkKCc8YT4nKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpdGxlX2Jhcl90ZXh0JylcbiAgICAgICAgICAgIC5hdHRyKCdocmVmJywgJyMnKVxuICAgICAgICAgICAgLnRleHQoZi5wcmV0dHlfbmFtZShzZWN0aW9uX25hbWUpKVxuICAgICAgICAgICAgLmFwcGVuZFRvKHN5c3RlbV9kaXYpO1xuICAgICAgICAkKHRoaXMpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgIHZhciBkcmF3ZXIgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ2RyYXdlcicpLmFwcGVuZFRvKHNlbGVjdGlvbl9jb250YWluZXIpO1xuICAgICAgICB2YXIgZHJhd2VyX2NvbnRlbnQgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ2RyYXdlcl9jb250ZW50JykuYXBwZW5kVG8oZHJhd2VyKTtcbiAgICAgICAgZm9yKCB2YXIgaW5wdXRfbmFtZSBpbiBzZXR0aW5ncy5pbnB1dF9vcHRpb25zW3NlY3Rpb25fbmFtZV0gKXtcbiAgICAgICAgICAgIHZhciBzZWxlY3Rvcl9zZXQgPSAkKCc8c3Bhbj4nKS5hdHRyKCdjbGFzcycsICdzZWxlY3Rvcl9zZXQnKS5hcHBlbmRUbyhkcmF3ZXJfY29udGVudCk7XG4gICAgICAgICAgICAkKCc8c3Bhbj4nKS5odG1sKGYucHJldHR5X25hbWUoaW5wdXRfbmFtZSkgKyAnOiAnKS5hcHBlbmRUbyhzZWxlY3Rvcl9zZXQpO1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIHZhciBzZWxlY3RvciA9IGskKCdzZWxlY3RvcicpXG4gICAgICAgICAgICAgICAgLnNldE9wdGlvbnNSZWYoICdpbnB1dF9vcHRpb25zLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lIClcbiAgICAgICAgICAgICAgICAuc2V0UmVmKCAnc3lzdGVtLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lIClcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8oc2VsZWN0b3Jfc2V0KTtcbiAgICAgICAgICAgIGYua2VsZW1fc2V0dXAoc2VsZWN0b3IsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIC8vKi9cbiAgICAgICAgICAgIHZhciAkZWxlbSA9ICQoJzxzZWxlY3Q+JylcbiAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnc2VsZWN0b3InKVxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhzZWxlY3Rvcl9zZXQpO1xuICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICAgIGVsZW06ICRlbGVtLmdldCgpWzBdLFxuICAgICAgICAgICAgICAgIHN5c3RlbV9yZWY6IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKS5vYmooc2V0dGluZ3MpLnJlZignc3lzdGVtLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lKSxcbiAgICAgICAgICAgICAgICBpbnB1dF9yZWY6IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKS5vYmooc2V0dGluZ3MpLnJlZignaW5wdXRzLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lKSxcbiAgICAgICAgICAgICAgICBsaXN0X3JlZjogT2JqZWN0LmNyZWF0ZShrb250YWluZXIpLm9iaihzZXR0aW5ncykucmVmKCdpbnB1dF9vcHRpb25zLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lKSxcbiAgICAgICAgICAgICAgICBpbnRlcmFjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggdGhpcy5zZXRfcmVmLnJlZlN0cmluZywgdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXggKTtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggdGhpcy5lbGVtLm9wdGlvbnNbdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXhdICk7XG4gICAgICAgICAgICAgICAgICAgIC8vaWYoIHRoaXMuaW50ZXJhY3RlZCApXG4gICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleCA+PSAwKSByZXR1cm4gdGhpcy5lbGVtLm9wdGlvbnNbdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJGVsZW0uY2hhbmdlKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5mLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmLnNlbGVjdG9yX2FkZF9vcHRpb25zKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIHNldHRpbmdzLnNlbGVjdF9yZWdpc3RyeS5wdXNoKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIC8vJCgnPC9icj4nKS5hcHBlbmRUbyhkcmF3ZXJfY29udGVudCk7XG5cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmYuc2VsZWN0b3JfYWRkX29wdGlvbnMgPSBmdW5jdGlvbihzZWxlY3Rvcil7XG4gICAgdmFyIGxpc3QgPSBzZWxlY3Rvci5saXN0X3JlZi5nZXQoKTtcbiAgICBpZiggbGlzdCAmJiBsaXN0LmNvbnN0cnVjdG9yID09PSBPYmplY3QgKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ1wibGlzdFwiJywgbGlzdCk7XG4gICAgICAgIGxpc3QgPSBmLm9ial9uYW1lcyhsaXN0KTtcbiAgICB9XG4gICAgc2VsZWN0b3IuZWxlbS5pbm5lckhUTUwgPSBcIlwiO1xuICAgIGlmKCBsaXN0IGluc3RhbmNlb2YgQXJyYXkgKXtcbiAgICAgICAgdmFyIGN1cnJlbnRfdmFsdWUgPSBzZWxlY3Rvci5zeXN0ZW1fcmVmLmdldCgpO1xuICAgICAgICAkKCc8b3B0aW9uPicpLmF0dHIoJ3NlbGVjdGVkJyx0cnVlKS5hdHRyKCdkaXNhYmxlZCcsdHJ1ZSkuYXR0cignaGlkZGVuJyx0cnVlKS5hcHBlbmRUbyhzZWxlY3Rvci5lbGVtKTtcblxuICAgICAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24ob3B0X25hbWUpe1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhvcHRfbmFtZSk7XG4gICAgICAgICAgICB2YXIgbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICAgICAgby52YWx1ZSA9IG9wdF9uYW1lO1xuICAgICAgICAgICAgaWYoIGN1cnJlbnRfdmFsdWUgKXtcbiAgICAgICAgICAgICAgICBpZiggb3B0X25hbWUudG9TdHJpbmcoKSA9PT0gY3VycmVudF92YWx1ZS50b1N0cmluZygpICkge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdmb3VuZCBpdDonLCBvcHRfbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIG8uc2VsZWN0ZWQgPSBcInNlbGVjdGVkXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZG9lcyBub3QgbWF0Y2g6ICcsIG9wdF9uYW1lLCBcIixcIiwgIGN1cnJlbnRfdmFsdWUsIFwiLlwiICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vby5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlbGVjdG9yX29wdGlvbicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdubyBjdXJyZW50IHZhbHVlJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG8uaW5uZXJIVE1MID0gb3B0X25hbWU7XG4gICAgICAgICAgICBzZWxlY3Rvci5lbGVtLmFwcGVuZENoaWxkKG8pO1xuICAgICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2xpc3Qgbm90IGEgbGlzdCcsIGxpc3QsIHNlbGVjdCk7XG4gICAgfVxufTtcblxuZi5hZGRfb3B0aW9ucyA9IGZ1bmN0aW9uKHNlbGVjdCwgYXJyYXkpe1xuICAgIGFycmF5LmZvckVhY2goIGZ1bmN0aW9uKG9wdGlvbil7XG4gICAgICAgICQoJzxvcHRpb24+JykuYXR0ciggJ3ZhbHVlJywgb3B0aW9uICkudGV4dChvcHRpb24pLmFwcGVuZFRvKHNlbGVjdCk7XG4gICAgfSk7XG59O1xuXG5mLmFkZF9wYXJhbXMgPSBmdW5jdGlvbihzZXR0aW5ncywgcGFyZW50X2NvbnRhaW5lcil7XG4gICAgZm9yKCB2YXIgc2VjdGlvbl9uYW1lIGluIHNldHRpbmdzLnN5c3RlbSApe1xuICAgICAgICBpZiggdHJ1ZSB8fCBmLm9iamVjdF9kZWZpbmVkKHNldHRpbmdzLnN5c3RlbVtzZWN0aW9uX25hbWVdKSApe1xuICAgICAgICAgICAgdmFyIHNlbGVjdGlvbl9jb250YWluZXIgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3BhcmFtX3NlY3Rpb24nKS5hdHRyKCdpZCcsIHNlY3Rpb25fbmFtZSApLmFwcGVuZFRvKHBhcmVudF9jb250YWluZXIpO1xuICAgICAgICAgICAgLy9zZWxlY3Rpb25fY29udGFpbmVyLmdldCgwKS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheV90eXBlO1xuICAgICAgICAgICAgdmFyIHN5c3RlbV9kaXYgPSAkKCc8ZGl2PicpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpdGxlX2xpbmUnKVxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhzZWxlY3Rpb25fY29udGFpbmVyKVxuICAgICAgICAgICAgICAgIC8qIGpzaGludCAtVzA4MyAqL1xuICAgICAgICAgICAgICAgIC5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlVG9nZ2xlKCdmYXN0Jyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgc3lzdGVtX3RpdGxlID0gJCgnPGE+JylcbiAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAndGl0bGVfbGluZV90ZXh0JylcbiAgICAgICAgICAgICAgICAuYXR0cignaHJlZicsICcjJylcbiAgICAgICAgICAgICAgICAudGV4dChmLnByZXR0eV9uYW1lKHNlY3Rpb25fbmFtZSkpXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKHN5c3RlbV9kaXYpO1xuICAgICAgICAgICAgJCh0aGlzKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgdmFyIGRyYXdlciA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAnJykuYXBwZW5kVG8oc2VsZWN0aW9uX2NvbnRhaW5lcik7XG4gICAgICAgICAgICB2YXIgZHJhd2VyX2NvbnRlbnQgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3BhcmFtX3NlY3Rpb25fY29udGVudCcpLmFwcGVuZFRvKGRyYXdlcik7XG4gICAgICAgICAgICBmb3IoIHZhciBpbnB1dF9uYW1lIGluIHNldHRpbmdzLnN5c3RlbVtzZWN0aW9uX25hbWVdICl7XG4gICAgICAgICAgICAgICAgJCgnPHNwYW4+JykuaHRtbChmLnByZXR0eV9uYW1lKGlucHV0X25hbWUpICsgJzogJykuYXBwZW5kVG8oZHJhd2VyX2NvbnRlbnQpO1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gayQoJ3ZhbHVlJylcbiAgICAgICAgICAgICAgICAgICAgLy8uc2V0T3B0aW9uc1JlZiggJ2lucHV0X29wdGlvbnMuJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUgKVxuICAgICAgICAgICAgICAgICAgICAuc2V0UmVmKCAnc3lzdGVtLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lIClcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKGRyYXdlcl9jb250ZW50KTtcbiAgICAgICAgICAgICAgICBmLmtlbGVtX3NldHVwKHNlbGVjdG9yLCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgLy8qL1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZV9rb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcilcbiAgICAgICAgICAgICAgICAgICAgLm9iaihzZXR0aW5ncylcbiAgICAgICAgICAgICAgICAgICAgLnJlZignc3lzdGVtLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lKTtcbiAgICAgICAgICAgICAgICB2YXIgJGVsZW0gPSAkKCc8c3Bhbj4nKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnJylcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKGRyYXdlcl9jb250ZW50KVxuICAgICAgICAgICAgICAgICAgICAudGV4dCh2YWx1ZV9rb250YWluZXIuZ2V0KCkpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbTogJGVsZW0uZ2V0KClbMF0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlX3JlZjogdmFsdWVfa29udGFpbmVyXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy52YWx1ZV9yZWdpc3RyeS5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAkKCc8L2JyPicpLmFwcGVuZFRvKGRyYXdlcl9jb250ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmYudXBkYXRlX3ZhbHVlcyA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICBzZXR0aW5ncy52YWx1ZV9yZWdpc3RyeS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlX2l0ZW0pe1xuICAgICAgICAvL2NvbnNvbGUubG9nKCB2YWx1ZV9pdGVtICk7XG4gICAgICAgIC8vY29uc29sZS5sb2coIHZhbHVlX2l0ZW0uZWxlbS5vcHRpb25zICk7XG4gICAgICAgIC8vY29uc29sZS5sb2coIHZhbHVlX2l0ZW0uZWxlbS5zZWxlY3RlZEluZGV4ICk7XG4gICAgICAgIGlmKHZhbHVlX2l0ZW0uZWxlbS5zZWxlY3RlZEluZGV4KXtcbiAgICAgICAgICAgIHZhbHVlX2l0ZW0udmFsdWUgPSB2YWx1ZV9pdGVtLmVsZW0ub3B0aW9uc1t2YWx1ZV9pdGVtLmVsZW0uc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4gICAgICAgICAgICB2YWx1ZV9pdGVtLmtvbnRhaW5lci5zZXQodmFsdWVfaXRlbS52YWx1ZSk7XG5cbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuZi5zaG93X2hpZGVfcGFyYW1zID0gZnVuY3Rpb24ocGFnZV9zZWN0aW9ucywgc2V0dGluZ3Mpe1xuICAgIGZvciggdmFyIGxpc3RfbmFtZSBpbiBwYWdlX3NlY3Rpb25zICl7XG4gICAgICAgIHZhciBpZCA9ICcjJytsaXN0X25hbWU7XG4gICAgICAgIHZhciBzZWN0aW9uX25hbWUgPSBsaXN0X25hbWUuc3BsaXQoJ18nKVswXTtcbiAgICAgICAgdmFyIHNlY3Rpb24gPSBrJChpZCk7XG4gICAgICAgIGlmKCBzZXR0aW5ncy5zdGF0dXMuc2VjdGlvbnNbc2VjdGlvbl9uYW1lXS5zZXQgKSBzZWN0aW9uLnNob3coKTtcbiAgICAgICAgZWxzZSBzZWN0aW9uLmhpZGUoKTtcbiAgICB9XG59O1xuXG5mLnNob3dfaGlkZV9zZWxlY3Rpb25zID0gZnVuY3Rpb24oc2V0dGluZ3MsIGFjdGl2ZV9zZWN0aW9uX25hbWUpe1xuICAgICQoJyNzZWN0aW9uU2VsZWN0b3InKS52YWwoYWN0aXZlX3NlY3Rpb25fbmFtZSk7XG4gICAgZm9yKCB2YXIgbGlzdF9uYW1lIGluIHNldHRpbmdzLmlucHV0ICl7XG4gICAgICAgIHZhciBpZCA9ICcjJytsaXN0X25hbWU7XG4gICAgICAgIHZhciBzZWN0aW9uX25hbWUgPSBsaXN0X25hbWUuc3BsaXQoJ18nKVswXTtcbiAgICAgICAgdmFyIHNlY3Rpb24gPSBrJChpZCk7XG4gICAgICAgIGlmKCBzZWN0aW9uX25hbWUgPT09IGFjdGl2ZV9zZWN0aW9uX25hbWUgKSBzZWN0aW9uLnNob3coKTtcbiAgICAgICAgZWxzZSBzZWN0aW9uLmhpZGUoKTtcbiAgICB9XG59O1xuXG4vL2Yuc2V0RG93bmxvYWRMaW5rKHNldHRpbmdzKXtcbi8vXG4vLyAgICBpZiggc2V0dGluZ3MuUERGICYmIHNldHRpbmdzLlBERi51cmwgKXtcbi8vICAgICAgICB2YXIgbGluayA9ICQoJ2EnKS5hdHRyKCdocmVmJywgc2V0dGluZ3MuUERGLnVybCApLmF0dHIoJ2Rvd25sb2FkJywgJ1BWX2RyYXdpbmcucGRmJykuaHRtbCgnRG93bmxvYWQgRHJhd2luZycpO1xuLy8gICAgICAgICQoJyNkb3dubG9hZCcpLmh0bWwoJycpLmFwcGVuZChsaW5rKTtcbi8vICAgIH1cbi8vfVxuXG5mLmxvYWRUYWJsZXMgPSBmdW5jdGlvbihzdHJpbmcpe1xuICAgIHZhciB0YWJsZXMgPSB7fTtcbiAgICB2YXIgbCA9IHN0cmluZy5zcGxpdCgnXFxuJyk7XG4gICAgdmFyIHRpdGxlO1xuICAgIHZhciBmaWVsZHM7XG4gICAgdmFyIG5lZWRfdGl0bGUgPSB0cnVlO1xuICAgIHZhciBuZWVkX2ZpZWxkcyA9IHRydWU7XG4gICAgbC5mb3JFYWNoKCBmdW5jdGlvbihzdHJpbmcsIGkpe1xuICAgICAgICB2YXIgbGluZSA9IHN0cmluZy50cmltKCk7XG4gICAgICAgIGlmKCBsaW5lLmxlbmd0aCA9PT0gMCApe1xuICAgICAgICAgICAgbmVlZF90aXRsZSA9IHRydWU7XG4gICAgICAgICAgICBuZWVkX2ZpZWxkcyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiggbmVlZF90aXRsZSApIHtcbiAgICAgICAgICAgIHRpdGxlID0gbGluZTtcbiAgICAgICAgICAgIHRhYmxlc1t0aXRsZV0gPSBbXTtcbiAgICAgICAgICAgIG5lZWRfdGl0bGUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmKCBuZWVkX2ZpZWxkcyApIHtcbiAgICAgICAgICAgIGZpZWxkcyA9IGxpbmUuc3BsaXQoJywnKTtcbiAgICAgICAgICAgIHRhYmxlc1t0aXRsZStcIl9maWVsZHNcIl0gPSBmaWVsZHM7XG4gICAgICAgICAgICBuZWVkX2ZpZWxkcyA9IGZhbHNlO1xuICAgICAgICAvL30gZWxzZSB7XG4gICAgICAgIC8vICAgIHZhciBlbnRyeSA9IHt9O1xuICAgICAgICAvLyAgICB2YXIgbGluZV9hcnJheSA9IGxpbmUuc3BsaXQoJywnKTtcbiAgICAgICAgLy8gICAgZmllbGRzLmZvckVhY2goIGZ1bmN0aW9uKGZpZWxkLCBpZCl7XG4gICAgICAgIC8vICAgICAgICBlbnRyeVtmaWVsZC50cmltKCldID0gbGluZV9hcnJheVtpZF0udHJpbSgpO1xuICAgICAgICAvLyAgICB9KTtcbiAgICAgICAgLy8gICAgdGFibGVzW3RpdGxlXS5wdXNoKCBlbnRyeSApO1xuICAgICAgICAvL31cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBsaW5lX2FycmF5ID0gbGluZS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgdGFibGVzW3RpdGxlXVtsaW5lX2FycmF5WzBdLnRyaW0oKV0gPSBsaW5lX2FycmF5WzFdLnRyaW0oKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRhYmxlcztcbn07XG5cbmYubG9hZENvbXBvbmVudHMgPSBmdW5jdGlvbihzdHJpbmcpe1xuICAgIHZhciBkYiA9IGsucGFyc2VDU1Yoc3RyaW5nKTtcbiAgICB2YXIgb2JqZWN0ID0ge307XG4gICAgZm9yKCB2YXIgaSBpbiBkYiApe1xuICAgICAgICB2YXIgY29tcG9uZW50ID0gZGJbaV07XG4gICAgICAgIGlmKCBvYmplY3RbY29tcG9uZW50Lk1ha2VdID09PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIG9iamVjdFtjb21wb25lbnQuTWFrZV0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiggb2JqZWN0W2NvbXBvbmVudC5NYWtlXVtjb21wb25lbnQuTW9kZWxdID09PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIG9iamVjdFtjb21wb25lbnQuTWFrZV1bY29tcG9uZW50Lk1vZGVsXSA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpZWxkcyA9IGsub2JqSWRBcnJheShjb21wb25lbnQpO1xuICAgICAgICBmaWVsZHMuZm9yRWFjaCggZnVuY3Rpb24oIGZpZWxkICl7XG4gICAgICAgICAgICB2YXIgcGFyYW0gPSBjb21wb25lbnRbZmllbGRdO1xuICAgICAgICAgICAgaWYoICEoIGZpZWxkIGluIFsnTWFrZScsICdNb2RlbCddICkgJiYgISggaXNOYU4ocGFyc2VGbG9hdChwYXJhbSkpICkgKXtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRbZmllbGRdID0gcGFyc2VGbG9hdChwYXJhbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIG9iamVjdFtjb21wb25lbnQuTWFrZV1bY29tcG9uZW50Lk1vZGVsXSA9IGNvbXBvbmVudDtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbn07XG5cblxuXG5cbmYubG9hZF9kYXRhYmFzZSA9IGZ1bmN0aW9uKEZTRUNfZGF0YWJhc2VfSlNPTil7XG4gICAgRlNFQ19kYXRhYmFzZV9KU09OID0gZi5sb3dlcmNhc2VfcHJvcGVydGllcyhGU0VDX2RhdGFiYXNlX0pTT04pO1xuICAgIHZhciBzZXR0aW5ncyA9IGYuc2V0dGluZ3M7XG4gICAgc2V0dGluZ3MuY29tcG9uZW50cy5pbnZlcnRlcnMgPSB7fTtcbiAgICBGU0VDX2RhdGFiYXNlX0pTT04uaW52ZXJ0ZXJzLmZvckVhY2goZnVuY3Rpb24oY29tcG9uZW50KXtcbiAgICAgICAgaWYoIHNldHRpbmdzLmNvbXBvbmVudHMuaW52ZXJ0ZXJzW2NvbXBvbmVudC5tYWtlXSA9PT0gdW5kZWZpbmVkICkgc2V0dGluZ3MuY29tcG9uZW50cy5pbnZlcnRlcnNbY29tcG9uZW50Lm1ha2VdID0ge307XG4gICAgICAgIC8vc2V0dGluZ3MuY29tcG9uZW50cy5pbnZlcnRlcnNbY29tcG9uZW50Lm1ha2VdW2NvbXBvbmVudC5tYWtlXSA9IGYucHJldHR5X25hbWVzKGNvbXBvbmVudCk7XG4gICAgICAgIHNldHRpbmdzLmNvbXBvbmVudHMuaW52ZXJ0ZXJzW2NvbXBvbmVudC5tYWtlXVtjb21wb25lbnQubW9kZWxdID0gY29tcG9uZW50O1xuICAgIH0pO1xuICAgIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlcyA9IHt9O1xuICAgIEZTRUNfZGF0YWJhc2VfSlNPTi5tb2R1bGVzLmZvckVhY2goZnVuY3Rpb24oY29tcG9uZW50KXtcbiAgICAgICAgaWYoIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tjb21wb25lbnQubWFrZV0gPT09IHVuZGVmaW5lZCApIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tjb21wb25lbnQubWFrZV0gPSB7fTtcbiAgICAgICAgLy9zZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbY29tcG9uZW50Lm1ha2VdW2NvbXBvbmVudC5tYWtlXSA9IGYucHJldHR5X25hbWVzKGNvbXBvbmVudCk7XG4gICAgICAgIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tjb21wb25lbnQubWFrZV1bY29tcG9uZW50Lm1vZGVsXSA9IGNvbXBvbmVudDtcbiAgICB9KTtcblxuICAgIGYudXBkYXRlKCk7XG59O1xuXG5cbmYuZ2V0X3JlZiA9IGZ1bmN0aW9uKHN0cmluZywgb2JqZWN0KXtcbiAgICB2YXIgcmVmX2FycmF5ID0gc3RyaW5nLnNwbGl0KCcuJyk7XG4gICAgdmFyIGxldmVsID0gb2JqZWN0O1xuICAgIHJlZl9hcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldmVsX25hbWUsaSl7XG4gICAgICAgIGlmKCB0eXBlb2YgbGV2ZWxbbGV2ZWxfbmFtZV0gPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldmVsID0gbGV2ZWxbbGV2ZWxfbmFtZV07XG4gICAgfSk7XG4gICAgcmV0dXJuIGxldmVsO1xufTtcbmYuc2V0X3JlZiA9IGZ1bmN0aW9uKCBvYmplY3QsIHJlZl9zdHJpbmcsIHZhbHVlICl7XG4gICAgdmFyIHJlZl9hcnJheSA9IHJlZl9zdHJpbmcuc3BsaXQoJy4nKTtcbiAgICB2YXIgbGV2ZWwgPSBvYmplY3Q7XG4gICAgcmVmX2FycmF5LmZvckVhY2goZnVuY3Rpb24obGV2ZWxfbmFtZSxpKXtcbiAgICAgICAgaWYoIHR5cGVvZiBsZXZlbFtsZXZlbF9uYW1lXSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbGV2ZWwgPSBsZXZlbFtsZXZlbF9uYW1lXTtcbiAgICB9KTtcblxuICAgIHJldHVybiBsZXZlbDtcbn07XG5cblxuXG5cbmYubG9nX2lmX2RhdGFiYXNlX2xvYWRlZCA9IGZ1bmN0aW9uKGUpe1xuICAgIGlmKGYuc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIH1cbn07XG5cblxuXG5mLmxvd2VyY2FzZV9wcm9wZXJ0aWVzID0gZnVuY3Rpb24gbG93ZXJjYXNlX3Byb3BlcnRpZXMob2JqKSB7XG4gICAgdmFyIG5ld19vYmplY3QgPSBuZXcgb2JqLmNvbnN0cnVjdG9yKCk7XG4gICAgZm9yKCB2YXIgb2xkX25hbWUgaW4gb2JqICl7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkob2xkX25hbWUpKSB7XG4gICAgICAgICAgICB2YXIgbmV3X25hbWUgPSBvbGRfbmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYoIG9ialtvbGRfbmFtZV0uY29uc3RydWN0b3IgPT09IE9iamVjdCB8fCBvYmpbb2xkX25hbWVdLmNvbnN0cnVjdG9yID09PSBBcnJheSApe1xuICAgICAgICAgICAgICAgIG5ld19vYmplY3RbbmV3X25hbWVdID0gbG93ZXJjYXNlX3Byb3BlcnRpZXMob2JqW29sZF9uYW1lXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld19vYmplY3RbbmV3X25hbWVdID0gb2JqW29sZF9uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuICAgIHJldHVybiBuZXdfb2JqZWN0O1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGY7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xuXG4vL3ZhciBkcmF3aW5nX3BhcnRzID0gW107XG4vL2QubGlua19kcmF3aW5nX3BhcnRzKGRyYXdpbmdfcGFydHMpO1xuXG52YXIgYWRkX2JvcmRlciA9IGZ1bmN0aW9uKHNldHRpbmdzLCBzaGVldF9zZWN0aW9uLCBzaGVldF9udW0pe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHBhZ2UgMlwiKTtcbiAgICBkID0gbWtfZHJhd2luZygpO1xuICAgIGNvbnNvbGUubG9nKGQpO1xuXG4gICAgdmFyIGYgPSBzZXR0aW5ncy5mO1xuXG4gICAgLy92YXIgY29tcG9uZW50cyA9IHNldHRpbmdzLmNvbXBvbmVudHM7XG4gICAgLy92YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmcuc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZy5sb2M7XG5cblxuXG5cbiAgICB2YXIgeCwgeSwgaCwgdztcbiAgICB2YXIgb2Zmc2V0O1xuXG4vLyBEZWZpbmUgZC5ibG9ja3Ncbi8vIG1vZHVsZSBkLmJsb2NrXG4gICAgdyA9IHNpemUubW9kdWxlLmZyYW1lLnc7XG4gICAgaCA9IHNpemUubW9kdWxlLmZyYW1lLmg7XG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gRnJhbWVcbiAgICBkLnNlY3Rpb24oJ0ZyYW1lJyk7XG5cbiAgICB3ID0gc2l6ZS5kcmF3aW5nLnc7XG4gICAgaCA9IHNpemUuZHJhd2luZy5oO1xuICAgIHZhciBwYWRkaW5nID0gc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmc7XG5cbiAgICBkLmxheWVyKCdmcmFtZScpO1xuXG4gICAgLy9ib3JkZXJcbiAgICBkLnJlY3QoIFt3LzIgLCBoLzJdLCBbdyAtIHBhZGRpbmcqMiwgaCAtIHBhZGRpbmcqMiBdICk7XG5cbiAgICB4ID0gdyAtIHBhZGRpbmcgKiAzO1xuICAgIHkgPSBwYWRkaW5nICogMztcblxuICAgIHcgPSBzaXplLmRyYXdpbmcudGl0bGVib3g7XG4gICAgaCA9IHNpemUuZHJhd2luZy50aXRsZWJveDtcblxuICAgIC8vIGJveCB0b3AtcmlnaHRcbiAgICBkLnJlY3QoIFt4LXcvMiwgeStoLzJdLCBbdyxoXSApO1xuXG4gICAgeSArPSBoICsgcGFkZGluZztcblxuICAgIHcgPSBzaXplLmRyYXdpbmcudGl0bGVib3g7XG4gICAgaCA9IHNpemUuZHJhd2luZy5oIC0gcGFkZGluZyo4IC0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94KjIuNTtcblxuICAgIC8vdGl0bGUgYm94XG4gICAgZC5yZWN0KCBbeC13LzIsIHkraC8yXSwgW3csaF0gKTtcblxuICAgIHZhciB0aXRsZSA9IHt9O1xuICAgIHRpdGxlLnRvcCA9IHk7XG4gICAgdGl0bGUuYm90dG9tID0geStoO1xuICAgIHRpdGxlLnJpZ2h0ID0geDtcbiAgICB0aXRsZS5sZWZ0ID0geC13IDtcblxuXG4gICAgLy8gYm94IGJvdHRvbS1yaWdodFxuICAgIGggPSBzaXplLmRyYXdpbmcudGl0bGVib3ggKiAxLjU7XG4gICAgeSA9IHRpdGxlLmJvdHRvbSArIHBhZGRpbmc7XG4gICAgeCA9IHgtdy8yO1xuICAgIHkgPSB5K2gvMjtcbiAgICBkLnJlY3QoIFt4LCB5XSwgW3csaF0gKTtcblxuICAgIHkgLT0gMjAqMi8zO1xuICAgIGQudGV4dChbeCx5XSxcbiAgICAgICAgWyBzaGVldF9zZWN0aW9uLCBzaGVldF9udW0gXSxcbiAgICAgICAgJ3BhZ2UnLFxuICAgICAgICAndGV4dCdcbiAgICAgICAgKTtcblxuXG4gICAgdmFyIHBhZ2UgPSB7fTtcbiAgICBwYWdlLnJpZ2h0ID0gdGl0bGUucmlnaHQ7XG4gICAgcGFnZS5sZWZ0ID0gdGl0bGUubGVmdDtcbiAgICBwYWdlLnRvcCA9IHRpdGxlLmJvdHRvbSArIHBhZGRpbmc7XG4gICAgcGFnZS5ib3R0b20gPSBwYWdlLnRvcCArIHNpemUuZHJhd2luZy50aXRsZWJveCoxLjU7XG4gICAgLy8gZC50ZXh0XG5cbiAgICB4ID0gdGl0bGUubGVmdCArIHBhZGRpbmc7XG4gICAgeSA9IHRpdGxlLmJvdHRvbSAtIHBhZGRpbmc7XG5cbiAgICB4ICs9IDEwO1xuICAgIGlmKCBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSAmJiBzeXN0ZW0uaW52ZXJ0ZXIubW9kZWwgKXtcbiAgICAgICAgZC50ZXh0KFt4LHldLFxuICAgICAgICAgICAgIFsgc3lzdGVtLmludmVydGVyLm1ha2UgKyBcIiBcIiArIHN5c3RlbS5pbnZlcnRlci5tb2RlbCArIFwiIEludmVydGVyIFN5c3RlbVwiIF0sXG4gICAgICAgICAgICAndGl0bGUxJywgJ3RleHQnKS5yb3RhdGUoLTkwKTtcblxuICAgIH1cblxuICAgIHggKz0gMTQ7XG4gICAgaWYoIHN5c3RlbS5tb2R1bGUubW9kZWwgJiYgc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzICYmIHN5c3RlbS5hcnJheS5udW1fbW9kdWxlcyAgKXtcbiAgICAgICAgZC50ZXh0KFt4LHldLCBbXG4gICAgICAgICAgICBzeXN0ZW0ubW9kdWxlLm1ha2UgKyBcIiBcIiArIHN5c3RlbS5tb2R1bGUubW9kZWwgK1xuICAgICAgICAgICAgICAgIFwiIChcIiArIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyAgKyBcIiBzdHJpbmdzIG9mIFwiICsgc3lzdGVtLmFycmF5Lm51bV9tb2R1bGVzICsgXCIgbW9kdWxlcyApXCJcbiAgICAgICAgXSwgJ3RpdGxlMicsICd0ZXh0Jykucm90YXRlKC05MCk7XG4gICAgfVxuXG4gICAgeCA9IHBhZ2UubGVmdCArIHBhZGRpbmc7XG4gICAgeSA9IHBhZ2UudG9wICsgcGFkZGluZztcbiAgICB5ICs9IHNpemUuZHJhd2luZy50aXRsZWJveCAqIDEuNSAqIDMvNDtcblxuXG5cblxuXG5cblxuICAgIHJldHVybiBkLmRyYXdpbmdfcGFydHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhZGRfYm9yZGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgayA9IHJlcXVpcmUoJy4uL2xpYi9rL2suanMnKTtcbnZhciBmID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMuanMnKTtcbnZhciBzZXR0aW5ncyA9IHJlcXVpcmUoJy4vc2V0dGluZ3MnKTtcblxuLy92YXIgc2V0dGluZ3MgPSByZXF1aXJlKCcuL3NldHRpbmdzLmpzJyk7XG4vL3ZhciBsX2F0dHIgPSBzZXR0aW5ncy5kcmF3aW5nLmxfYXR0cjtcbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuLy8gc2V0dXAgZHJhd2luZyBjb250YWluZXJzXG5cbnZhciBzZXR0aW5ncyA9IHJlcXVpcmUoJy4vc2V0dGluZ3MnKTtcbnZhciBsYXllcl9hdHRyID0gc2V0dGluZ3MuZHJhd2luZy5sYXllcl9hdHRyO1xuXG5cblxuXG5cbnZhciBkcmF3aW5nID0ge307XG5cblxuXG5cblxuXG5cblxuLy8gQkxPQ0tTXG5cbnZhciBCbGsgPSB7XG4gICAgdHlwZTogJ2Jsb2NrJyxcbn07XG5CbGsubW92ZSA9IGZ1bmN0aW9uKHgsIHkpe1xuICAgIGZvciggdmFyIGkgaW4gdGhpcy5kcmF3aW5nX3BhcnRzICl7XG4gICAgICAgIHRoaXMuZHJhd2luZ19wYXJ0c1tpXS5tb3ZlKHgseSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbkJsay5hZGQgPSBmdW5jdGlvbigpe1xuICAgIGlmKCB0eXBlb2YgdGhpcy5kcmF3aW5nX3BhcnRzID09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgdGhpcy5kcmF3aW5nX3BhcnRzID0gW107XG4gICAgfVxuICAgIGZvciggdmFyIGkgaW4gYXJndW1lbnRzKXtcbiAgICAgICAgdGhpcy5kcmF3aW5nX3BhcnRzLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuQmxrLnJvdGF0ZSA9IGZ1bmN0aW9uKGRlZyl7XG4gICAgdGhpcy5yb3RhdGUgPSBkZWc7XG59O1xuXG52YXIgYmxvY2tzID0ge307XG52YXIgYmxvY2tfYWN0aXZlID0gZmFsc2U7XG4vLyBDcmVhdGUgZGVmYXVsdCBsYXllcixibG9jayBjb250YWluZXIgYW5kIGZ1bmN0aW9uc1xuXG4vLyBMYXllcnNcblxudmFyIGxheWVyX2FjdGl2ZSA9IGZhbHNlO1xuXG5kcmF3aW5nLmxheWVyID0gZnVuY3Rpb24obmFtZSl7IC8vIHNldCBjdXJyZW50IGxheWVyXG4gICAgaWYoIHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJyApeyAvLyBpZiBubyBsYXllciBuYW1lIGdpdmVuLCByZXNldCB0byBkZWZhdWx0XG4gICAgICAgIGxheWVyX2FjdGl2ZSA9IGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoICEgKG5hbWUgaW4gbGF5ZXJfYXR0cikgKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignRXJyb3I6IHVua25vd24gbGF5ZXIsIHVzaW5nIGJhc2UnKTtcbiAgICAgICAgbGF5ZXJfYWN0aXZlID0gJ2Jhc2UnIDtcbiAgICB9IGVsc2UgeyAvLyBmaW5hbHkgYWN0aXZhdGUgcmVxdWVzdGVkIGxheWVyXG4gICAgICAgIGxheWVyX2FjdGl2ZSA9IG5hbWU7XG4gICAgfVxuICAgIC8vKi9cbn07XG5cbnZhciBzZWN0aW9uX2FjdGl2ZSA9IGZhbHNlO1xuXG5kcmF3aW5nLiBzZWN0aW9uID0gZnVuY3Rpb24obmFtZSl7IC8vIHNldCBjdXJyZW50IHNlY3Rpb25cbiAgICBpZiggdHlwZW9mIG5hbWUgPT09ICd1bmRlZmluZWQnICl7IC8vIGlmIG5vIHNlY3Rpb24gbmFtZSBnaXZlbiwgcmVzZXQgdG8gZGVmYXVsdFxuICAgICAgICBzZWN0aW9uX2FjdGl2ZSA9IGZhbHNlO1xuICAgIH0gZWxzZSB7IC8vIGZpbmFseSBhY3RpdmF0ZSByZXF1ZXN0ZWQgc2VjdGlvblxuICAgICAgICBzZWN0aW9uX2FjdGl2ZSA9IG5hbWU7XG4gICAgfVxuICAgIC8vKi9cbn07XG5cbi8qXG52YXIgYmxvY2sgPSBmdW5jdGlvbihuYW1lKSB7Ly8gc2V0IGN1cnJlbnQgYmxvY2tcbiAgICAvLyBpZiBjdXJyZW50IGJsb2NrIGhhcyBiZWVuIHVzZWQsIHNhdmUgaXQgYmVmb3JlIGNyZWF0aW5nIGEgbmV3IG9uZS5cbiAgICBpZiggYmxvY2tzW2Jsb2NrX2FjdGl2ZV0ubGVuZ3RoID4gMCApIHsgYmxvY2tzLnB1c2goYmxvY2tzW2Jsb2NrX2FjdGl2ZV0pOyB9XG4gICAgaWYoIHR5cGVvZiBuYW1lICE9PSAndW5kZWZpbmVkJyApeyAvLyBpZiBuYW1lIGFyZ3VtZW50IGlzIHN1Ym1pdHRlZCwgY3JlYXRlIG5ldyBibG9ja1xuICAgICAgICB2YXIgYmxrID0gT2JqZWN0LmNyZWF0ZShCbGspO1xuICAgICAgICBibGsubmFtZSA9IG5hbWU7IC8vIGJsb2NrIG5hbWVcbiAgICAgICAgYmxvY2tzW2Jsb2NrX2FjdGl2ZV0gPSBibGs7XG4gICAgfSBlbHNlIHsgLy8gZWxzZSB1c2UgZGVmYXVsdCBibG9ja1xuICAgICAgICBibG9ja3NbYmxvY2tfYWN0aXZlXSA9IGJsb2Nrc1swXTtcbiAgICB9XG59XG5ibG9jaygnZGVmYXVsdCcpOyAvLyBzZXQgY3VycmVudCBibG9jayB0byBkZWZhdWx0XG4qL1xuZHJhd2luZy5ibG9ja19zdGFydCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiggdHlwZW9mIG5hbWUgPT09ICd1bmRlZmluZWQnICl7IC8vIGlmIG5hbWUgYXJndW1lbnQgaXMgc3VibWl0dGVkXG4gICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogbmFtZSByZXF1aXJlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBibGs7XG4gICAgICAgIC8vIFRPRE86IFdoYXQgaWYgdGhlIHNhbWUgbmFtZSBpcyBzdWJtaXR0ZWQgdHdpY2U/IHRocm93IGVycm9yIG9yIGZpeD9cbiAgICAgICAgYmxvY2tfYWN0aXZlID0gbmFtZTtcbiAgICAgICAgaWYoIHR5cGVvZiBibG9ja3NbYmxvY2tfYWN0aXZlXSAhPT0gJ29iamVjdCcpe1xuICAgICAgICAgICAgYmxrID0gT2JqZWN0LmNyZWF0ZShCbGspO1xuICAgICAgICAgICAgLy9ibGsubmFtZSA9IG5hbWU7IC8vIGJsb2NrIG5hbWVcbiAgICAgICAgICAgIGJsb2Nrc1tibG9ja19hY3RpdmVdID0gYmxrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBibGs7XG4gICAgfVxufTtcblxuICAgIC8qXG4gICAgeCA9IGxvYy53aXJlX3RhYmxlLnggLSB3LzI7XG4gICAgeSA9IGxvYy53aXJlX3RhYmxlLnkgLSBoLzI7XG4gICAgaWYoIHR5cGVvZiBsYXllcl9uYW1lICE9PSAndW5kZWZpbmVkJyAmJiAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICkge1xuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSBsYXllcnNbbGF5ZXJfbmFtZV1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiggISAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICl7IGNvbnNvbGUubG9nKFwiZXJyb3IsIGxheWVyIGRvZXMgbm90IGV4aXN0LCB1c2luZyBjdXJyZW50XCIpO31cbiAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gIGxheWVyX2FjdGl2ZVxuICAgIH1cbiAgICAqL1xuZHJhd2luZy5ibG9ja19lbmQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYmxrID0gYmxvY2tzW2Jsb2NrX2FjdGl2ZV07XG4gICAgYmxvY2tfYWN0aXZlID0gZmFsc2U7XG4gICAgcmV0dXJuIGJsaztcbn07XG5cblxuXG4vLyBjbGVhciBkcmF3aW5nXG5kcmF3aW5nLmNsZWFyX2RyYXdpbmcgPSBmdW5jdGlvbigpIHtcbiAgICBmb3IoIHZhciBpZCBpbiBibG9ja3MgKXtcbiAgICAgICAgaWYoIGJsb2Nrcy5oYXNPd25Qcm9wZXJ0eShpZCkpe1xuICAgICAgICAgICAgZGVsZXRlIGJsb2Nrc1tpZF07XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5kcmF3aW5nX3BhcnRzLmxlbmd0aCA9IDA7XG59O1xuXG5cbi8vLy8vL1xuLy8gYnVpbGQgcHJvdG90eXBlIGVsZW1lbnRcblxuICAgIC8qXG4gICAgaWYoIHR5cGVvZiBsYXllcl9uYW1lICE9PSAndW5kZWZpbmVkJyAmJiAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICkge1xuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSBsYXllcnNbbGF5ZXJfbmFtZV1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiggISAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICl7IGNvbnNvbGUubG9nKFwiZXJyb3IsIGxheWVyIGRvZXMgbm90IGV4aXN0LCB1c2luZyBjdXJyZW50XCIpO31cbiAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gIGxheWVyX2FjdGl2ZVxuICAgIH1cbiAgICAqL1xuXG5cbnZhciBTdmdFbGVtID0ge1xuICAgIG9iamVjdDogJ1N2Z0VsZW0nXG59O1xuU3ZnRWxlbS5tb3ZlID0gZnVuY3Rpb24oeCwgeSl7XG4gICAgaWYoIHR5cGVvZiB0aGlzLnBvaW50cyAhPSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLnBvaW50cyApIHtcbiAgICAgICAgICAgIHRoaXMucG9pbnRzW2ldWzBdICs9IHg7XG4gICAgICAgICAgICB0aGlzLnBvaW50c1tpXVsxXSArPSB5O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcblN2Z0VsZW0ucm90YXRlID0gZnVuY3Rpb24oZGVnKXtcbiAgICB0aGlzLnJvdGF0ZWQgPSBkZWc7XG59O1xuXG4vLy8vLy8vXG4vLyBmdW5jdGlvbnMgZm9yIGFkZGluZyBkcmF3aW5nX3BhcnRzXG5cbmRyYXdpbmcuYWRkID0gZnVuY3Rpb24odHlwZSwgcG9pbnRzLCBsYXllcl9uYW1lKSB7XG5cbiAgICBpZiggdHlwZW9mIGxheWVyX25hbWUgPT09ICd1bmRlZmluZWQnICkgeyBsYXllcl9uYW1lID0gbGF5ZXJfYWN0aXZlOyB9XG4gICAgaWYoICEgKGxheWVyX25hbWUgaW4gbGF5ZXJfYXR0cikgKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignRXJyb3I6IExheWVyIFwiJysgbGF5ZXJfbmFtZSArJ1wiIG5hbWUgbm90IGZvdW5kLCB1c2luZyBiYXNlJyk7XG4gICAgICAgIGxheWVyX25hbWUgPSAnYmFzZSc7XG4gICAgfVxuXG4gICAgaWYoIHR5cGVvZiBwb2ludHMgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFyIHBvaW50c19hID0gcG9pbnRzLnNwbGl0KCcgJyk7XG4gICAgICAgIGZvciggdmFyIGkgaW4gcG9pbnRzX2EgKSB7XG4gICAgICAgICAgICBwb2ludHNfYVtpXSA9IHBvaW50c19hW2ldLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICBmb3IoIHZhciBjIGluIHBvaW50c19hW2ldICkge1xuICAgICAgICAgICAgICAgIHBvaW50c19hW2ldW2NdID0gTnVtYmVyKHBvaW50c19hW2ldW2NdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBlbGVtID0gT2JqZWN0LmNyZWF0ZShTdmdFbGVtKTtcbiAgICBlbGVtLnR5cGUgPSB0eXBlO1xuICAgIGVsZW0ubGF5ZXJfbmFtZSA9IGxheWVyX25hbWU7XG4gICAgZWxlbS5zZWN0aW9uX25hbWUgPSBzZWN0aW9uX2FjdGl2ZTtcbiAgICBpZiggdHlwZSA9PT0gJ2xpbmUnICkge1xuICAgICAgICBlbGVtLnBvaW50cyA9IHBvaW50cztcbiAgICB9IGVsc2UgaWYoIHR5cGVvZiBwb2ludHNbMF0ueCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZWxlbS54ID0gcG9pbnRzWzBdWzBdO1xuICAgICAgICBlbGVtLnkgPSBwb2ludHNbMF1bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbS54ID0gcG9pbnRzWzBdLng7XG4gICAgICAgIGVsZW0ueSA9IHBvaW50c1swXS55O1xuICAgIH1cblxuICAgIGlmKGJsb2NrX2FjdGl2ZSkge1xuICAgICAgICBlbGVtLmJsb2NrX25hbWUgPSBibG9ja19hY3RpdmU7XG4gICAgICAgIGJsb2Nrc1tibG9ja19hY3RpdmVdLmFkZChlbGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRyYXdpbmdfcGFydHMucHVzaChlbGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbTtcbn07XG5cbmRyYXdpbmcubGluZSA9IGZ1bmN0aW9uKHBvaW50cywgbGF5ZXIpeyAvLyAocG9pbnRzLCBbbGF5ZXJdKVxuICAgIC8vcmV0dXJuIGFkZCgnbGluZScsIHBvaW50cywgbGF5ZXIpXG4gICAgdmFyIGxpbmUgPSAgdGhpcy5hZGQoJ2xpbmUnLCBwb2ludHMsIGxheWVyKTtcbiAgICByZXR1cm4gbGluZTtcbn07XG5cbmRyYXdpbmcucmVjdCA9IGZ1bmN0aW9uKGxvYywgc2l6ZSwgbGF5ZXIpe1xuICAgIHZhciByZWMgPSB0aGlzLmFkZCgncmVjdCcsIFtsb2NdLCBsYXllcik7XG4gICAgcmVjLncgPSBzaXplWzBdO1xuICAgIC8qXG4gICAgaWYoIHR5cGVvZiBsYXllcl9uYW1lICE9PSAndW5kZWZpbmVkJyAmJiAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICkge1xuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSBsYXllcnNbbGF5ZXJfbmFtZV1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiggISAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICl7IGNvbnNvbGUubG9nKFwiZXJyb3IsIGxheWVyIGRvZXMgbm90IGV4aXN0LCB1c2luZyBjdXJyZW50XCIpO31cbiAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gIGxheWVyX2FjdGl2ZVxuICAgIH1cbiAgICAqL1xuICAgIHJlYy5oID0gc2l6ZVsxXTtcbiAgICByZXR1cm4gcmVjO1xufTtcblxuZHJhd2luZy5jaXJjID0gZnVuY3Rpb24obG9jLCBkaWFtZXRlciwgbGF5ZXIpe1xuICAgIHZhciBjaXIgPSB0aGlzLmFkZCgnY2lyYycsIFtsb2NdLCBsYXllcik7XG4gICAgY2lyLmQgPSBkaWFtZXRlcjtcbiAgICByZXR1cm4gY2lyO1xufTtcblxuZHJhd2luZy50ZXh0ID0gZnVuY3Rpb24obG9jLCBzdHJpbmdzLCBmb250LCBsYXllcil7XG4gICAgdmFyIHR4dCA9IHRoaXMuYWRkKCd0ZXh0JywgW2xvY10sIGxheWVyKTtcbiAgICBpZiggdHlwZW9mIHN0cmluZ3MgPT0gJ3N0cmluZycpe1xuICAgICAgICBzdHJpbmdzID0gW3N0cmluZ3NdO1xuICAgIH1cbiAgICB0eHQuc3RyaW5ncyA9IHN0cmluZ3M7XG4gICAgdHh0LmZvbnQgPSBmb250O1xuICAgIHJldHVybiB0eHQ7XG59O1xuXG5kcmF3aW5nLmJsb2NrID0gZnVuY3Rpb24obmFtZSkgey8vIHNldCBjdXJyZW50IGJsb2NrXG4gICAgdmFyIHgseTtcbiAgICBpZiggYXJndW1lbnRzLmxlbmd0aCA9PT0gMiApeyAvLyBpZiBjb29yIGlzIHBhc3NlZFxuICAgICAgICBpZiggdHlwZW9mIGFyZ3VtZW50c1sxXS54ICE9PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgeCA9IGFyZ3VtZW50c1sxXS54O1xuICAgICAgICAgICAgeSA9IGFyZ3VtZW50c1sxXS55O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeCA9IGFyZ3VtZW50c1sxXVswXTtcbiAgICAgICAgICAgIHkgPSBhcmd1bWVudHNbMV1bMV07XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYoIGFyZ3VtZW50cy5sZW5ndGggPT09IDMgKXsgLy8gaWYgeCx5IGlzIHBhc3NlZFxuICAgICAgICB4ID0gYXJndW1lbnRzWzFdO1xuICAgICAgICB5ID0gYXJndW1lbnRzWzJdO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHdoYXQgaWYgYmxvY2sgZG9lcyBub3QgZXhpc3Q/IHByaW50IGxpc3Qgb2YgYmxvY2tzP1xuICAgIHZhciBibGsgPSBPYmplY3QuY3JlYXRlKGJsb2Nrc1tuYW1lXSk7XG4gICAgYmxrLnggPSB4O1xuICAgIGJsay55ID0geTtcblxuICAgIGlmKGJsb2NrX2FjdGl2ZSl7XG4gICAgICAgIGJsb2Nrc1tibG9ja19hY3RpdmVdLmFkZChibGspO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZHJhd2luZ19wYXJ0cy5wdXNoKGJsayk7XG4gICAgfVxuICAgIHJldHVybiBibGs7XG59O1xuXG5cbnZhciBDZWxsID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKHRhYmxlLCBSLCBDKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLnRhYmxlID0gdGFibGU7XG4gICAgICAgIHRoaXMuUiA9IFI7XG4gICAgICAgIHRoaXMuQyA9IEM7XG4gICAgICAgIC8qXG4gICAgICAgIHRoaXMuYm9yZGVycyA9IHt9O1xuICAgICAgICB0aGlzLmJvcmRlcl9vcHRpb25zLmZvckVhY2goZnVuY3Rpb24oc2lkZSl7XG4gICAgICAgICAgICBzZWxmLmJvcmRlcnNbc2lkZV0gPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vKi9cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICAvKlxuICAgIGJvcmRlcl9vcHRpb25zOiBbJ1QnLCAnQicsICdMJywgJ1InXSxcbiAgICAvLyovXG4gICAgdGV4dDogZnVuY3Rpb24odGV4dCl7XG4gICAgICAgIHRoaXMuY2VsbF90ZXh0ID0gdGV4dDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9LFxuICAgIGJvcmRlcjogZnVuY3Rpb24oYm9yZGVyX3N0cmluZyl7XG4gICAgICAgIHRoaXMudGFibGUuYm9yZGVyKCB0aGlzLlIsIHRoaXMuQywgYm9yZGVyX3N0cmluZyApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59O1xuXG52YXIgVGFibGUgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oIGRyYXdpbmcsIG51bV9yb3dzLCBudW1fY29scyApe1xuICAgICAgICB0aGlzLmRyYXdpbmcgPSBkcmF3aW5nO1xuICAgICAgICB0aGlzLm51bV9yb3dzID0gbnVtX3Jvd3M7XG4gICAgICAgIHRoaXMubnVtX2NvbHMgPSBudW1fY29scztcbiAgICAgICAgdmFyIHIsYztcblxuICAgICAgICAvLyBzZXR1cCBib3JkZXIgY29udGFpbmVyc1xuICAgICAgICB0aGlzLmJvcmRlcnNfcm93cyA9IFtdO1xuICAgICAgICBmb3IoIHI9MDsgcjw9bnVtX3Jvd3M7IHIrKyl7XG4gICAgICAgICAgICB0aGlzLmJvcmRlcnNfcm93c1tyXSA9IFtdO1xuICAgICAgICAgICAgZm9yKCBjPTE7IGM8PW51bV9jb2xzOyBjKyspe1xuICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyc19yb3dzW3JdW2NdID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ib3JkZXJzX2NvbHMgPSBbXTtcbiAgICAgICAgZm9yKCBjPTA7IGM8PW51bV9jb2xzOyBjKyspe1xuICAgICAgICAgICAgdGhpcy5ib3JkZXJzX2NvbHNbY10gPSBbXTtcbiAgICAgICAgICAgIGZvciggcj0xOyByPD1udW1fcm93czsgcisrKXtcbiAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfY29sc1tjXVtyXSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2V0IGNvbHVtbiBhbmQgcm93IHNpemUgY29udGFpbmVyc1xuICAgICAgICB0aGlzLnNpemVfcm93cyA9IFtdO1xuICAgICAgICBmb3IoIHI9MTsgcjw9bnVtX3Jvd3M7IHIrKyl7XG4gICAgICAgICAgICB0aGlzLnNpemVfcm93c1tyXSA9IDE1O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2l6ZV9jb2xzID0gW107XG4gICAgICAgIGZvciggYz0xOyBjPD1udW1fY29sczsgYysrKXtcbiAgICAgICAgICAgIHRoaXMuc2l6ZV9jb2xzW2NdID0gNjA7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzZXR1cCBjZWxsIGNvbnRhaW5lclxuICAgICAgICB0aGlzLmNlbGxzID0gW107XG4gICAgICAgIGZvciggcj0xOyByPD1udW1fcm93czsgcisrKXtcbiAgICAgICAgICAgIHRoaXMuY2VsbHNbcl0gPSBbXTtcbiAgICAgICAgICAgIGZvciggYz0xOyBjPD1udW1fY29sczsgYysrKXtcbiAgICAgICAgICAgICAgICB0aGlzLmNlbGxzW3JdW2NdID0gT2JqZWN0LmNyZWF0ZShDZWxsKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNlbGxzW3JdW2NdLmluaXQoIHRoaXMsIHIsIGMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgLy8qL1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgbG9jOiBmdW5jdGlvbiggeCwgeSl7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY2VsbDogZnVuY3Rpb24oIFIsIEMgKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2VsbHNbUl1bQ107XG4gICAgfSxcbiAgICAvKlxuICAgIHNpemVfY29sOiBmdW5jdGlvbihjb2wsIHMpe1xuICAgICAgICBpZiggdHlwZW9mIGNvbCA9PT0gJ3N0cmluZycgKXtcbiAgICAgICAgICAgIGlmKCBjb2wgPT09ICdhbGwnKXtcbiAgICAgICAgICAgICAgICBfLnJhbmdlKHRoaXMubnVtX2NvbHMpLmZvckVhY2goZnVuY3Rpb24oYyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2l6ZV9jb2xzW2MrMV0gPSBzO1xuICAgICAgICAgICAgICAgIH0sdGhpcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHMgPSBOdW1iZXIocyk7XG4gICAgICAgICAgICAgICAgaWYoIGlzTmFOKHMpICl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogY29sdW1uIHdyb25nJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaXplX2NvbHNbY29sXSA9IHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgeyAvLyBpcyBudW1iZXJcbiAgICAgICAgICAgIHRoaXMuc2l6ZV9yb3dzW2NvbF0gPSBzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2l6ZV9yb3c6IGZ1bmN0aW9uKHJvdywgcyl7XG4gICAgICAgIGlmKCB0eXBlb2Ygcm93ID09PSAnc3RyaW5nJyApe1xuICAgICAgICAgICAgaWYoIHJvdyA9PT0gJ2FsbCcpe1xuICAgICAgICAgICAgICAgIF8ucmFuZ2UodGhpcy5udW1fcm93cykuZm9yRWFjaChmdW5jdGlvbihyKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaXplX3Jvd3NbcisxXSA9IHM7XG4gICAgICAgICAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcyA9IE51bWJlcihzKTtcbiAgICAgICAgICAgICAgICBpZiggaXNOYU4ocykgKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiBjb2x1bW4gd3JvbmcnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNpemVfcm93c1tyb3ddID0gcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7IC8vIGlzIG51bWJlclxuICAgICAgICAgICAgdGhpcy5zaXplX3Jvd3Nbcm93XSA9IHM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICAvLyovXG4gICAgLypcbiAgICBhZGRfY2VsbDogZnVuY3Rpb24oKXtcblxuICAgIH0sXG4gICAgYWRkX3Jvd3M6IGZ1bmN0aW9uKG4pe1xuICAgICAgICB0aGlzLm51bV9jb2xtbnMgKz0gbjtcbiAgICAgICAgdGhpcy5udW1fcm93cyArPSBuO1xuICAgICAgICBfLnJhbmdlKG4pLmZvckVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoaXMucm93cy5wdXNoKFtdKTtcbiAgICAgICAgfSk7XG4gICAgICAgIF8ucmFuZ2UobikuZm9yRWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy50ZXh0X3Jvd3MucHVzaChbXSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSxcbiAgICB0ZXh0OiBmdW5jdGlvbiggUiwgQywgdGV4dCl7XG4gICAgICAgIHRoaXMudGV4dF9yb3dzW1JdW0NdID0gdGV4dDtcbiAgICB9LFxuICAgIC8vKi9cbiAgICBib3JkZXI6IGZ1bmN0aW9uKCBSLCBDLCBib3JkZXJfc3RyaW5nKXtcbiAgICAgICAgYm9yZGVyX3N0cmluZyA9IGJvcmRlcl9zdHJpbmcudG9VcHBlckNhc2UoKS50cmltKCk7XG4gICAgICAgIHZhciBib3JkZXJzO1xuICAgICAgICBpZiggYm9yZGVyX3N0cmluZyA9PT0gJ0FMTCcgKXtcbiAgICAgICAgICAgIGJvcmRlcnMgPSBbJ1QnLCAnQicsICdMJywgJ1InXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJvcmRlcnMgPSBib3JkZXJfc3RyaW5nLnNwbGl0KC9bXFxzLF0rLyk7XG4gICAgICAgIH1cbiAgICAgICAgYm9yZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHNpZGUpe1xuICAgICAgICAgICAgc3dpdGNoKHNpZGUpe1xuICAgICAgICAgICAgICAgIGNhc2UgJ1QnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfcm93c1tSLTFdW0NdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyc19yb3dzW1JdW0NdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnTCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyc19jb2xzW0MtMV1bUl0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdSJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3JkZXJzX2NvbHNbQ11bUl0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY29ybmVyOiBmdW5jdGlvbihSLEMpe1xuICAgICAgICB2YXIgeCA9IHRoaXMueDtcbiAgICAgICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgICAgIHZhciByLGM7XG4gICAgICAgIGZvciggcj0xOyByPD1SOyByKysgKXtcbiAgICAgICAgICAgIHkgKz0gdGhpcy5zaXplX3Jvd3Nbcl07XG4gICAgICAgIH1cbiAgICAgICAgZm9yKCBjPTE7IGM8PUM7IGMrKyApe1xuICAgICAgICAgICAgeCArPSB0aGlzLnNpemVfY29sc1tjXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3gseV07XG4gICAgfSxcbiAgICBjZW50ZXI6IGZ1bmN0aW9uKFIsQyl7XG4gICAgICAgIHZhciB4ID0gdGhpcy54O1xuICAgICAgICB2YXIgeSA9IHRoaXMueTtcbiAgICAgICAgdmFyIHIsYztcbiAgICAgICAgZm9yKCByPTE7IHI8PVI7IHIrKyApe1xuICAgICAgICAgICAgeSArPSB0aGlzLnNpemVfcm93c1tyXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IoIGM9MTsgYzw9QzsgYysrICl7XG4gICAgICAgICAgICB4ICs9IHRoaXMuc2l6ZV9jb2xzW2NdO1xuICAgICAgICB9XG4gICAgICAgIHkgLT0gdGhpcy5zaXplX3Jvd3NbUl0vMjtcbiAgICAgICAgeCAtPSB0aGlzLnNpemVfY29sc1tDXS8yO1xuICAgICAgICByZXR1cm4gW3gseV07XG4gICAgfSxcbiAgICBtazogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgcixjO1xuICAgICAgICBmb3IoIHI9MDsgcjw9dGhpcy5udW1fcm93czsgcisrICl7XG4gICAgICAgICAgICBmb3IoIGM9MTsgYzw9dGhpcy5udW1fY29sczsgYysrICl7XG4gICAgICAgICAgICAgICAgaWYoIHRoaXMuYm9yZGVyc19yb3dzW3JdW2NdID09PSB0cnVlICl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd2luZy5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ybmVyKHIsYy0xKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ybmVyKHIsYyksXG4gICAgICAgICAgICAgICAgICAgICAgICBdLCAnYm9yZGVyJyk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yKCBjPTA7IGM8PXRoaXMubnVtX2NvbHM7IGMrKyApe1xuICAgICAgICAgICAgZm9yKCByPTE7IHI8PXRoaXMubnVtX3Jvd3M7IHIrKyApe1xuICAgICAgICAgICAgICAgIGlmKCB0aGlzLmJvcmRlcnNfY29sc1tjXVtyXSA9PT0gdHJ1ZSApe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdpbmcubGluZShbXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcm5lcihyLTEsYyksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcm5lcihyLGMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSwgJ2JvcmRlcicpO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciggcj0xOyByPD10aGlzLm51bV9yb3dzOyByKysgKXtcbiAgICAgICAgICAgIGZvciggYz0xOyBjPD10aGlzLm51bV9jb2xzOyBjKysgKXtcbiAgICAgICAgICAgICAgICBpZiggdHlwZW9mIHRoaXMuY2VsbChyLGMpLmNlbGxfdGV4dCA9PT0gJ3N0cmluZycgKXtcblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdpbmcudGV4dChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2VudGVyKHIsYyksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNlbGwocixjKS5jZWxsX3RleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAndGFibGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQnXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9XG5cbn07XG5cbmRyYXdpbmcudGFibGUgPSBmdW5jdGlvbiggbnVtX3Jvd3MsIG51bV9jb2xzICl7XG4gICAgdmFyIG5ld190YWJsZSA9IE9iamVjdC5jcmVhdGUoVGFibGUpO1xuICAgIG5ld190YWJsZS5pbml0KCB0aGlzLCBudW1fcm93cywgbnVtX2NvbHMgKTtcblxuICAgIHJldHVybiBuZXdfdGFibGU7XG5cbn07XG5cblxuZHJhd2luZy5hcHBlbmQgPSAgZnVuY3Rpb24oZHJhd2luZ19wYXJ0cyl7XG4gICAgdGhpcy5kcmF3aW5nX3BhcnRzID0gdGhpcy5kcmF3aW5nX3BhcnRzLmNvbmNhdChkcmF3aW5nX3BhcnRzKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cblxuXG52YXIgbWtfZHJhd2luZyA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHBhZ2UgPSBPYmplY3QuY3JlYXRlKGRyYXdpbmcpO1xuICAgIC8vY29uc29sZS5sb2cocGFnZSk7XG4gICAgcGFnZS5kcmF3aW5nX3BhcnRzID0gW107XG4gICAgcmV0dXJuIHBhZ2U7XG59O1xuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBta19kcmF3aW5nO1xuIiwidmFyIG1rX2RyYXdpbmcgPSByZXF1aXJlKCcuL21rX2RyYXdpbmcnKTtcbnZhciBta19ib3JkZXIgPSByZXF1aXJlKCcuL21rX2JvcmRlcicpO1xuXG52YXIgcGFnZSA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICBjb25zb2xlLmxvZyhcIioqIE1ha2luZyBwYWdlIDFcIik7XG5cbiAgICB2YXIgZCA9IG1rX2RyYXdpbmcoKTtcblxuICAgIHZhciBzaGVldF9zZWN0aW9uID0gJ0EnO1xuICAgIHZhciBzaGVldF9udW0gPSAnMDEnO1xuICAgIGQuYXBwZW5kKG1rX2JvcmRlcihzZXR0aW5ncywgc2hlZXRfc2VjdGlvbiwgc2hlZXRfbnVtICkpO1xuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nLnNpemU7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmcubG9jO1xuXG4gICAgZC50ZXh0KFxuICAgICAgICBbc2l6ZS5kcmF3aW5nLncvMiwgc2l6ZS5kcmF3aW5nLmgvMl0sXG4gICAgICAgICdUaXRsZSBTaGVldCcsXG4gICAgICAgICd0aXRsZTInXG4gICAgKTtcblxuICAgIC8qXG4gICAgZC50ZXh0KFtzaXplLmRyYXdpbmcudy8zLHNpemUuZHJhd2luZy5oLzNdLCAnWCcsICd0YWJsZScpO1xuICAgIGQucmVjdChbc2l6ZS5kcmF3aW5nLncvMy01LHNpemUuZHJhd2luZy5oLzMtNV0sWzEwLDEwXSwnYm94Jyk7XG5cbiAgICB2YXIgdCA9IGQudGFibGUoNSw3KS5sb2Moc2l6ZS5kcmF3aW5nLncvMywgc2l6ZS5kcmF3aW5nLmgvMyk7XG4gICAgY29uc29sZS5sb2codCk7XG4gICAgdC5jZWxsKDEsMSkuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDEsMScpO1xuICAgIHQuY2VsbCgyLDIpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCAyLDInKTtcbiAgICB0LmNlbGwoMywzKS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgMywzJyk7XG4gICAgdC5jZWxsKDQsNCkuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDQsNCcpO1xuICAgIHQuY2VsbCg1LDUpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCA1LDUnKTtcblxuXG5cbiAgICB0LmNlbGwoNCw2KS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgNCw2Jyk7XG4gICAgdC5jZWxsKDQsNykuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDQsNycpO1xuICAgIHQuY2VsbCg1LDYpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCA1LDYnKTtcbiAgICB0LmNlbGwoNSw3KS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgNSw3Jyk7XG5cblxuICAgIHZhciBwYXJ0cyA9IHQubWsoKTtcbiAgICBjb25zb2xlLmxvZyhwYXJ0cyk7XG4gICAgLy8qL1xuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xudmFyIG1rX2JvcmRlciA9IHJlcXVpcmUoJy4vbWtfYm9yZGVyJyk7XG5cbi8vdmFyIGRyYXdpbmdfcGFydHMgPSBbXTtcbi8vZC5saW5rX2RyYXdpbmdfcGFydHMoZHJhd2luZ19wYXJ0cyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHBhZ2UgMlwiKTtcbiAgICBkID0gbWtfZHJhd2luZygpO1xuICAgIHZhciBzaGVldF9zZWN0aW9uID0gJ1BWJztcbiAgICB2YXIgc2hlZXRfbnVtID0gJzAxJztcbiAgICBkLmFwcGVuZChta19ib3JkZXIoc2V0dGluZ3MsIHNoZWV0X3NlY3Rpb24sIHNoZWV0X251bSApKTtcblxuICAgIHZhciBmID0gc2V0dGluZ3MuZjtcblxuICAgIC8vdmFyIGNvbXBvbmVudHMgPSBzZXR0aW5ncy5jb21wb25lbnRzO1xuICAgIC8vdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcbiAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nLnNpemU7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmcubG9jO1xuXG5cblxuXG4gICAgdmFyIHgsIHksIGgsIHc7XG4gICAgdmFyIG9mZnNldDtcblxuLy8gRGVmaW5lIGQuYmxvY2tzXG4vLyBtb2R1bGUgZC5ibG9ja1xuICAgIHcgPSBzaXplLm1vZHVsZS5mcmFtZS53O1xuICAgIGggPSBzaXplLm1vZHVsZS5mcmFtZS5oO1xuXG4gICAgZC5ibG9ja19zdGFydCgnbW9kdWxlJyk7XG5cbiAgICAvLyBmcmFtZVxuICAgIGQubGF5ZXIoJ21vZHVsZScpO1xuICAgIGQucmVjdCggWzAsaC8yXSwgW3csaF0gKTtcbiAgICAvLyBmcmFtZSB0cmlhbmdsZT9cbiAgICBkLmxpbmUoW1xuICAgICAgICBbLXcvMiwwXSxcbiAgICAgICAgWzAsdy8yXSxcbiAgICBdKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbMCx3LzJdLFxuICAgICAgICBbdy8yLDBdLFxuICAgIF0pO1xuICAgIC8vIGxlYWRzXG4gICAgZC5sYXllcignRENfcG9zJyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgWzAsIDBdLFxuICAgICAgICBbMCwgLXNpemUubW9kdWxlLmxlYWRdXG4gICAgXSk7XG4gICAgZC5sYXllcignRENfbmVnJyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgWzAsIGhdLFxuICAgICAgICBbMCwgaCsoc2l6ZS5tb2R1bGUubGVhZCldXG4gICAgXSk7XG4gICAgLy8gcG9zIHNpZ25cbiAgICBkLmxheWVyKCd0ZXh0Jyk7XG4gICAgZC50ZXh0KFxuICAgICAgICBbc2l6ZS5tb2R1bGUubGVhZC8yLCAtc2l6ZS5tb2R1bGUubGVhZC8yXSxcbiAgICAgICAgJysnLFxuICAgICAgICAnc2lnbnMnXG4gICAgKTtcbiAgICAvLyBuZWcgc2lnblxuICAgIGQudGV4dChcbiAgICAgICAgW3NpemUubW9kdWxlLmxlYWQvMiwgaCtzaXplLm1vZHVsZS5sZWFkLzJdLFxuICAgICAgICAnLScsXG4gICAgICAgICdzaWducydcbiAgICApO1xuICAgIC8vIGdyb3VuZFxuICAgIGQubGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgIGQubGluZShbXG4gICAgICAgIFstdy8yLCBoLzJdLFxuICAgICAgICBbLXcvMi13LzQsIGgvMl0sXG4gICAgXSk7XG5cbiAgICBkLmxheWVyKCk7XG4gICAgZC5ibG9ja19lbmQoKTtcblxuLy8jc3RyaW5nXG4gICAgZC5ibG9ja19zdGFydCgnc3RyaW5nJyk7XG5cbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcblxuICAgIHkgKz0gc2l6ZS5tb2R1bGUubGVhZDtcblxuICAgIC8vVE9ETzogYWRkIGxvb3AgdG8ganVtcCBvdmVyIG5lZ2F0aXZlIHJldHVybiB3aXJlc1xuICAgIGQubGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LXNpemUubW9kdWxlLmZyYW1lLncqMy80LCB5K3NpemUubW9kdWxlLmZyYW1lLmgvMl0sXG4gICAgICAgIFt4LXNpemUubW9kdWxlLmZyYW1lLncqMy80LCB5K3NpemUuc3RyaW5nLmggKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCAtIHNpemUubW9kdWxlLmxlYWRdLFxuICAgICAgICAvL1t4LXNpemUubW9kdWxlLmZyYW1lLncqMy80LCB5K3NpemUuc3RyaW5nLmggKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgIF0pO1xuICAgIGQubGF5ZXIoKTtcblxuICAgIGQuYmxvY2soJ21vZHVsZScsIFt4LHldKTtcbiAgICB5ICs9IHNpemUubW9kdWxlLmggKyBzaXplLnN0cmluZy5nYXBfbWlzc2luZztcbiAgICBkLmJsb2NrKCdtb2R1bGUnLCBbeCx5XSk7XG4gICAgeSArPSBzaXplLm1vZHVsZS5oICsgc2l6ZS5zdHJpbmcuZ2FwO1xuICAgIGQuYmxvY2soJ21vZHVsZScsIFt4LHldKTtcbiAgICB5ICs9IHNpemUubW9kdWxlLmggKyBzaXplLnN0cmluZy5nYXA7XG4gICAgZC5ibG9jaygnbW9kdWxlJywgW3gseV0pO1xuXG4gICAgZC5ibG9ja19lbmQoKTtcblxuXG4vLyB0ZXJtaW5hbFxuICAgIGQuYmxvY2tfc3RhcnQoJ3Rlcm1pbmFsJyk7XG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG5cbiAgICBkLmxheWVyKCd0ZXJtaW5hbCcpO1xuICAgIGQuY2lyYyhcbiAgICAgICAgW3gseV0sXG4gICAgICAgIHNpemUudGVybWluYWxfZGlhbVxuICAgICk7XG4gICAgZC5sYXllcigpO1xuICAgIGQuYmxvY2tfZW5kKCk7XG5cbi8vIGZ1c2VcblxuICAgIGQuYmxvY2tfc3RhcnQoJ2Z1c2UnKTtcbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcbiAgICB3ID0gMTA7XG4gICAgaCA9IDU7XG5cbiAgICBkLmxheWVyKCd0ZXJtaW5hbCcpO1xuICAgIGQucmVjdChcbiAgICAgICAgW3gseV0sXG4gICAgICAgIFt3LGhdXG4gICAgKTtcbiAgICBkLmxpbmUoIFtcbiAgICAgICAgW3cvMix5XSxcbiAgICAgICAgW3cvMitzaXplLmZ1c2UudywgeV1cbiAgICBdKTtcbiAgICBkLmJsb2NrKCd0ZXJtaW5hbCcsIFtzaXplLmZ1c2UudywgeV0gKTtcblxuICAgIGQubGluZSggW1xuICAgICAgICBbLXcvMix5XSxcbiAgICAgICAgWy13LzItc2l6ZS5mdXNlLncsIHldXG4gICAgXSk7XG4gICAgZC5ibG9jaygndGVybWluYWwnLCBbLXNpemUuZnVzZS53LCB5XSApO1xuXG4gICAgZC5sYXllcigpO1xuICAgIGQuYmxvY2tfZW5kKCk7XG5cbi8vIGdyb3VuZCBzeW1ib2xcbiAgICBkLmJsb2NrX3N0YXJ0KCdncm91bmQnKTtcbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcblxuICAgIGQubGF5ZXIoJ0FDX2dyb3VuZCcpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LHldLFxuICAgICAgICBbeCx5KzQwXSxcbiAgICBdKTtcbiAgICB5ICs9IDI1O1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LTcuNSx5XSxcbiAgICAgICAgW3grNy41LHldLFxuICAgIF0pO1xuICAgIHkgKz0gNTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC01LHldLFxuICAgICAgICBbeCs1LHldLFxuICAgIF0pO1xuICAgIHkgKz0gNTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC0yLjUseV0sXG4gICAgICAgIFt4KzIuNSx5XSxcbiAgICBdKTtcbiAgICBkLmxheWVyKCk7XG5cbiAgICBkLmJsb2NrX2VuZCgpO1xuXG5cblxuXG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gRnJhbWVcbi8qXG4gICAgZC5zZWN0aW9uKCdGcmFtZScpO1xuXG4gICAgdyA9IHNpemUuZHJhd2luZy53O1xuICAgIGggPSBzaXplLmRyYXdpbmcuaDtcbiAgICB2YXIgcGFkZGluZyA9IHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nO1xuXG4gICAgZC5sYXllcignZnJhbWUnKTtcblxuICAgIC8vYm9yZGVyXG4gICAgZC5yZWN0KCBbdy8yICwgaC8yXSwgW3cgLSBwYWRkaW5nKjIsIGggLSBwYWRkaW5nKjIgXSApO1xuXG4gICAgeCA9IHcgLSBwYWRkaW5nICogMztcbiAgICB5ID0gcGFkZGluZyAqIDM7XG5cbiAgICB3ID0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94O1xuICAgIGggPSBzaXplLmRyYXdpbmcudGl0bGVib3g7XG5cbiAgICAvLyBib3ggdG9wLXJpZ2h0XG4gICAgZC5yZWN0KCBbeC13LzIsIHkraC8yXSwgW3csaF0gKTtcblxuICAgIHkgKz0gaCArIHBhZGRpbmc7XG5cbiAgICB3ID0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94O1xuICAgIGggPSBzaXplLmRyYXdpbmcuaCAtIHBhZGRpbmcqOCAtIHNpemUuZHJhd2luZy50aXRsZWJveCoyLjU7XG5cbiAgICAvL3RpdGxlIGJveFxuICAgIGQucmVjdCggW3gtdy8yLCB5K2gvMl0sIFt3LGhdICk7XG5cbiAgICB2YXIgdGl0bGUgPSB7fTtcbiAgICB0aXRsZS50b3AgPSB5O1xuICAgIHRpdGxlLmJvdHRvbSA9IHkraDtcbiAgICB0aXRsZS5yaWdodCA9IHg7XG4gICAgdGl0bGUubGVmdCA9IHgtdyA7XG5cblxuICAgIC8vIGJveCBib3R0b20tcmlnaHRcbiAgICBoID0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94ICogMS41O1xuICAgIHkgPSB0aXRsZS5ib3R0b20gKyBwYWRkaW5nO1xuICAgIGQucmVjdCggW3gtdy8yLCB5K2gvMl0sIFt3LGhdICk7XG5cbiAgICB2YXIgcGFnZSA9IHt9O1xuICAgIHBhZ2UucmlnaHQgPSB0aXRsZS5yaWdodDtcbiAgICBwYWdlLmxlZnQgPSB0aXRsZS5sZWZ0O1xuICAgIHBhZ2UudG9wID0gdGl0bGUuYm90dG9tICsgcGFkZGluZztcbiAgICBwYWdlLmJvdHRvbSA9IHBhZ2UudG9wICsgc2l6ZS5kcmF3aW5nLnRpdGxlYm94KjEuNTtcbiAgICAvLyBkLnRleHRcblxuICAgIHggPSB0aXRsZS5sZWZ0ICsgcGFkZGluZztcbiAgICB5ID0gdGl0bGUuYm90dG9tIC0gcGFkZGluZztcblxuICAgIHggKz0gMTA7XG4gICAgZC50ZXh0KFt4LHldLFxuICAgICAgICAgWyBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSArIFwiIFwiICsgc3lzdGVtLmludmVydGVyLm1vZGVsICsgXCIgSW52ZXJ0ZXIgU3lzdGVtXCIgXSxcbiAgICAgICAgJ3RpdGxlMScsICd0ZXh0Jykucm90YXRlKC05MCk7XG5cbiAgICB4ICs9IDE0O1xuICAgIGlmKCBzeXN0ZW0ubW9kdWxlLnNwZWNzICE9PSB1bmRlZmluZWQgJiYgc3lzdGVtLm1vZHVsZS5zcGVjcyAhPT0gbnVsbCAgKXtcbiAgICAgICAgZC50ZXh0KFt4LHldLCBbXG4gICAgICAgICAgICBzeXN0ZW0ubW9kdWxlLm1ha2UgKyBcIiBcIiArIHN5c3RlbS5tb2R1bGUubW9kZWwgK1xuICAgICAgICAgICAgICAgIFwiIChcIiArIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyAgKyBcIiBzdHJpbmdzIG9mIFwiICsgc3lzdGVtLmFycmF5Lm51bV9tb2R1bGVzICsgXCIgbW9kdWxlcyApXCJcbiAgICAgICAgXSwgJ3RpdGxlMicsICd0ZXh0Jykucm90YXRlKC05MCk7XG4gICAgfVxuXG4gICAgeCA9IHBhZ2UubGVmdCArIHBhZGRpbmc7XG4gICAgeSA9IHBhZ2UudG9wICsgcGFkZGluZztcbiAgICB5ICs9IHNpemUuZHJhd2luZy50aXRsZWJveCAqIDEuNSAqIDMvNDtcblxuXG4gICAgZC50ZXh0KFt4LHldLFxuICAgICAgICBbJ1BWMSddLFxuICAgICAgICAncGFnZScsICd0ZXh0Jyk7XG5cblxuLy8qL1xuXG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8jYXJyYXlcbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ21vZHVsZScpICYmIGYuc2VjdGlvbl9kZWZpbmVkKCdhcnJheScpICl7XG4gICAgICAgIGQuc2VjdGlvbignYXJyYXknKTtcblxuICAgICAgICBjb25zb2xlLmxvZyhcIkRyYXdpbmc6IGFkZGluZyBhcnJheVwiKTtcblxuICAgICAgICB4ID0gbG9jLmFycmF5LnJpZ2h0IC0gc2l6ZS5zdHJpbmcudztcbiAgICAgICAgeSA9IGxvYy5hcnJheS55O1xuICAgICAgICB5IC09IHNpemUuc3RyaW5nLmgvMjtcblxuXG4gICAgICAgIC8vZm9yKCB2YXIgaT0wOyBpPHN5c3RlbS5EQy5zdHJpbmdfbnVtOyBpKysgKSB7XG4gICAgICAgIGZvciggdmFyIGkgaW4gXy5yYW5nZShzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MpKSB7XG4gICAgICAgICAgICAvL3ZhciBvZmZzZXQgPSBpICogc2l6ZS53aXJlX29mZnNldC5iYXNlXG4gICAgICAgICAgICB2YXIgb2Zmc2V0X3dpcmUgPSBzaXplLndpcmVfb2Zmc2V0Lm1pbiArICggc2l6ZS53aXJlX29mZnNldC5iYXNlICogaSApO1xuXG4gICAgICAgICAgICBkLmJsb2NrKCdzdHJpbmcnLCBbeCx5XSk7XG4gICAgICAgICAgICAvLyBwb3NpdGl2ZSBob21lIHJ1blxuICAgICAgICAgICAgZC5sYXllcignRENfcG9zJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCAsIGxvYy5hcnJheS51cHBlciBdLFxuICAgICAgICAgICAgICAgIFsgeCAsIGxvYy5hcnJheS51cHBlci1vZmZzZXRfd2lyZSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K29mZnNldF93aXJlICwgbG9jLmFycmF5LnVwcGVyLW9mZnNldF93aXJlIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrb2Zmc2V0X3dpcmUgLCBsb2MuYXJyYXkueS1vZmZzZXRfd2lyZV0sXG4gICAgICAgICAgICAgICAgWyBsb2MuYXJyYXkueCAsIGxvYy5hcnJheS55LW9mZnNldF93aXJlXSxcbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICAvLyBuZWdhdGl2ZSBob21lIHJ1blxuICAgICAgICAgICAgZC5sYXllcignRENfbmVnJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCAsIGxvYy5hcnJheS5sb3dlciBdLFxuICAgICAgICAgICAgICAgIFsgeCAsIGxvYy5hcnJheS5sb3dlcitvZmZzZXRfd2lyZSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K29mZnNldF93aXJlICwgbG9jLmFycmF5Lmxvd2VyK29mZnNldF93aXJlIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrb2Zmc2V0X3dpcmUgLCBsb2MuYXJyYXkueStvZmZzZXRfd2lyZV0sXG4gICAgICAgICAgICAgICAgWyBsb2MuYXJyYXkueCAsIGxvYy5hcnJheS55K29mZnNldF93aXJlXSxcbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICB4IC09IHNpemUuc3RyaW5nLnc7XG4gICAgICAgIH1cblxuICAgIC8vICAgIGQucmVjdChcbiAgICAvLyAgICAgICAgWyAobG9jLmFycmF5LnJpZ2h0K2xvYy5hcnJheS5sZWZ0KS8yLCAobG9jLmFycmF5Lmxvd2VyK2xvYy5hcnJheS51cHBlcikvMiBdLFxuICAgIC8vICAgICAgICBbIGxvYy5hcnJheS5yaWdodC1sb2MuYXJyYXkubGVmdCwgbG9jLmFycmF5Lmxvd2VyLWxvYy5hcnJheS51cHBlciBdLFxuICAgIC8vICAgICAgICAnRENfcG9zJyk7XG4gICAgLy9cblxuICAgICAgICBkLmxheWVyKCdEQ19ncm91bmQnKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIC8vWyBsb2MuYXJyYXkubGVmdCAsIGxvYy5hcnJheS5sb3dlciArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgICAgICAgICBbIGxvYy5hcnJheS5sZWZ0LCBsb2MuYXJyYXkubG93ZXIgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLCBsb2MuYXJyYXkubG93ZXIgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLCBsb2MuYXJyYXkueSArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAgICAgICAgIFsgbG9jLmFycmF5LnggLCBsb2MuYXJyYXkueStzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZF0sXG4gICAgICAgIF0pO1xuXG4gICAgICAgIGQubGF5ZXIoKTtcblxuXG4gICAgfS8vIGVsc2UgeyBjb25zb2xlLmxvZyhcIkRyYXdpbmc6IGFycmF5IG5vdCByZWFkeVwiKX1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gY29tYmluZXIgYm94XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ0RDJykgKXtcblxuICAgICAgICBkLnNlY3Rpb24oXCJjb21iaW5lclwiKTtcblxuICAgICAgICB4ID0gbG9jLmpiX2JveC54O1xuICAgICAgICB5ID0gbG9jLmpiX2JveC55O1xuXG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFt4LHldLFxuICAgICAgICAgICAgW3NpemUuamJfYm94Lncsc2l6ZS5qYl9ib3guaF0sXG4gICAgICAgICAgICAnYm94J1xuICAgICAgICApO1xuXG4gICAgICAgIHggPSBsb2MuYXJyYXkueDtcbiAgICAgICAgeSA9IGxvYy5hcnJheS55O1xuXG4gICAgICAgIGZvciggdmFyIGkgaW4gXy5yYW5nZShzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MpKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0Lm1pbiArICggc2l6ZS53aXJlX29mZnNldC5iYXNlICogaSApO1xuXG4gICAgICAgICAgICBkLmxheWVyKCdEQ19wb3MnKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4ICwgeS1vZmZzZXRdLFxuICAgICAgICAgICAgICAgIFsgeCsoc2l6ZS5qYl9ib3gudykvMiAsIHktb2Zmc2V0XSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgICAgIHg6IHgrKHNpemUuamJfYm94LncpLzIsXG4gICAgICAgICAgICAgICAgeTogeS1vZmZzZXQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4KyhzaXplLmpiX2JveC53KS8yICwgeS1vZmZzZXRdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueC1vZmZzZXQgLCB5LW9mZnNldF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54LW9mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW1dLFxuICAgICAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueC1vZmZzZXQgLCBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgICAgIHg6IGxvYy5kaXNjYm94Lngtb2Zmc2V0LFxuICAgICAgICAgICAgICAgIHk6IGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkLmxheWVyKCdEQ19uZWcnKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4LCB5K29mZnNldF0sXG4gICAgICAgICAgICAgICAgWyB4K3NpemUuamJfYm94LncvMi1zaXplLmZ1c2Uudy8yICwgeStvZmZzZXRdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBkLmJsb2NrKCAnZnVzZScsIHtcbiAgICAgICAgICAgICAgICB4OiB4K3NpemUuamJfYm94LncvMiAsXG4gICAgICAgICAgICAgICAgeTogeStvZmZzZXQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4K3NpemUuamJfYm94LncvMitzaXplLmZ1c2Uudy8yICwgeStvZmZzZXRdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueCtvZmZzZXQgLCB5K29mZnNldF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW1dLFxuICAgICAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueCtvZmZzZXQgLCBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgICAgIHg6IGxvYy5kaXNjYm94Lngrb2Zmc2V0LFxuICAgICAgICAgICAgICAgIHk6IGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZC5sYXllcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9kLmxheWVyKCdEQ19ncm91bmQnKTtcbiAgICAgICAgLy9kLmxpbmUoW1xuICAgICAgICAvLyAgICBbIGxvYy5hcnJheS5sZWZ0ICwgbG9jLmFycmF5Lmxvd2VyICsgc2l6ZS5tb2R1bGUudyArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgICAgIC8vICAgIFsgbG9jLmFycmF5LnJpZ2h0K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kICwgbG9jLmFycmF5Lmxvd2VyICsgc2l6ZS5tb2R1bGUudyArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgICAgIC8vICAgIFsgbG9jLmFycmF5LnJpZ2h0K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kICwgbG9jLmFycmF5LnkgKyBzaXplLm1vZHVsZS53ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmRdLFxuICAgICAgICAvLyAgICBbIGxvYy5hcnJheS54ICwgbG9jLmFycmF5Lnkrc2l6ZS5tb2R1bGUudytzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZF0sXG4gICAgICAgIC8vXSk7XG5cbiAgICAgICAgLy9kLmxheWVyKCk7XG5cbiAgICAgICAgLy8gR3JvdW5kXG4gICAgICAgIC8vb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5nYXAgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZDtcbiAgICAgICAgb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5ncm91bmQ7XG5cbiAgICAgICAgZC5sYXllcignRENfZ3JvdW5kJyk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbIHggLCB5K29mZnNldF0sXG4gICAgICAgICAgICBbIHgrKHNpemUuamJfYm94LncpLzIgLCB5K29mZnNldF0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICB4OiB4KyhzaXplLmpiX2JveC53KS8yLFxuICAgICAgICAgICAgeTogeStvZmZzZXQsXG4gICAgICAgIH0pO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgWyB4KyhzaXplLmpiX2JveC53KS8yICwgeStvZmZzZXRdLFxuICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueCtvZmZzZXQgLCBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtXSxcbiAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueCtvZmZzZXQgLCBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgIHg6IGxvYy5kaXNjYm94Lngrb2Zmc2V0LFxuICAgICAgICAgICAgeTogbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbVxuICAgICAgICB9KTtcbiAgICAgICAgZC5sYXllcigpO1xuXG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgIC8vIERDIGRpc2NvbmVjdFxuICAgICAgICBkLnNlY3Rpb24oXCJEQyBkaWNvbmVjdFwiKTtcblxuXG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFtsb2MuZGlzY2JveC54LCBsb2MuZGlzY2JveC55XSxcbiAgICAgICAgICAgIFtzaXplLmRpc2Nib3gudyxzaXplLmRpc2Nib3guaF0sXG4gICAgICAgICAgICAnYm94J1xuICAgICAgICApO1xuXG4gICAgICAgIC8vIERDIGRpc2NvbmVjdCBjb21iaW5lciBkLmxpbmVzXG5cbiAgICAgICAgeCA9IGxvYy5kaXNjYm94Lng7XG4gICAgICAgIHkgPSBsb2MuZGlzY2JveC55ICsgc2l6ZS5kaXNjYm94LmgvMjtcblxuICAgICAgICBpZiggc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzID4gMSl7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0X21pbiA9IHNpemUud2lyZV9vZmZzZXQubWluO1xuICAgICAgICAgICAgdmFyIG9mZnNldF9tYXggPSBzaXplLndpcmVfb2Zmc2V0Lm1pbiArICggKHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyAtMSkgKiBzaXplLndpcmVfb2Zmc2V0LmJhc2UgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4LW9mZnNldF9taW4sIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgICAgICBbIHgtb2Zmc2V0X21heCwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgXSwgJ0RDX3BvcycpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHgrb2Zmc2V0X21pbiwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgICAgIFsgeCtvZmZzZXRfbWF4LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBdLCAnRENfbmVnJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbnZlcnRlciBjb25lY3Rpb25cbiAgICAgICAgLy9kLmxpbmUoW1xuICAgICAgICAvLyAgICBbIHgtb2Zmc2V0X21pbiwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAvLyAgICBbIHgtb2Zmc2V0X21pbiwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAvL10sJ0RDX3BvcycpO1xuXG4gICAgICAgIC8vb2Zmc2V0ID0gb2Zmc2V0X21heCAtIG9mZnNldF9taW47XG4gICAgICAgIG9mZnNldCA9IHNpemUud2lyZV9vZmZzZXQubWluO1xuXG4gICAgICAgIC8vIG5lZ1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgWyB4K29mZnNldCwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgWyB4K29mZnNldCwgbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtIF0sXG4gICAgICAgIF0sJ0RDX25lZycpO1xuICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICB4OiB4K29mZnNldCxcbiAgICAgICAgICAgIHk6IGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gcG9zXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbIHgtb2Zmc2V0LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBbIHgtb2Zmc2V0LCBsb2MuaW52ZXJ0ZXIueStzaXplLmludmVydGVyLmgvMi1zaXplLnRlcm1pbmFsX2RpYW0gXSxcbiAgICAgICAgXSwnRENfcG9zJyk7XG4gICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgIHg6IHgtb2Zmc2V0LFxuICAgICAgICAgICAgeTogbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBncm91bmRcbiAgICAgICAgLy9vZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0LmdhcCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kO1xuICAgICAgICBvZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZDtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFsgeCtvZmZzZXQsIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIFsgeCtvZmZzZXQsIGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSBdLFxuICAgICAgICBdLCdEQ19ncm91bmQnKTtcbiAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgeDogeCtvZmZzZXQsXG4gICAgICAgICAgICB5OiBsb2MuaW52ZXJ0ZXIueStzaXplLmludmVydGVyLmgvMi1zaXplLnRlcm1pbmFsX2RpYW0sXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyNpbnZlcnRlclxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnaW52ZXJ0ZXInKSApe1xuXG4gICAgICAgIGQuc2VjdGlvbihcImludmVydGVyXCIpO1xuXG5cbiAgICAgICAgeCA9IGxvYy5pbnZlcnRlci54O1xuICAgICAgICB5ID0gbG9jLmludmVydGVyLnk7XG5cblxuICAgICAgICAvL2ZyYW1lXG4gICAgICAgIGQubGF5ZXIoJ2JveCcpO1xuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbeCx5XSxcbiAgICAgICAgICAgIFtzaXplLmludmVydGVyLncsIHNpemUuaW52ZXJ0ZXIuaF1cbiAgICAgICAgKTtcbiAgICAgICAgLy8gTGFiZWwgYXQgdG9wIChJbnZlcnRlciwgbWFrZSwgbW9kZWwsIC4uLilcbiAgICAgICAgZC5sYXllcigndGV4dCcpO1xuICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICBbbG9jLmludmVydGVyLngsIGxvYy5pbnZlcnRlci50b3AgKyBzaXplLmludmVydGVyLnRleHRfZ2FwIF0sXG4gICAgICAgICAgICBbICdJbnZlcnRlcicsIHNldHRpbmdzLnN5c3RlbS5pbnZlcnRlci5tYWtlICsgXCIgXCIgKyBzZXR0aW5ncy5zeXN0ZW0uaW52ZXJ0ZXIubW9kZWwgXSxcbiAgICAgICAgICAgICdsYWJlbCdcbiAgICAgICAgKTtcbiAgICAgICAgZC5sYXllcigpO1xuXG4gICAgLy8jaW52ZXJ0ZXIgc3ltYm9sXG4gICAgICAgIGQuc2VjdGlvbihcImludmVydGVyIHN5bWJvbFwiKTtcblxuICAgICAgICB4ID0gbG9jLmludmVydGVyLng7XG4gICAgICAgIHkgPSBsb2MuaW52ZXJ0ZXIueTtcblxuICAgICAgICB3ID0gc2l6ZS5pbnZlcnRlci5zeW1ib2xfdztcbiAgICAgICAgaCA9IHNpemUuaW52ZXJ0ZXIuc3ltYm9sX2g7XG5cbiAgICAgICAgdmFyIHNwYWNlID0gdyoxLzEyO1xuXG4gICAgICAgIC8vIEludmVydGVyIHN5bWJvbFxuICAgICAgICBkLmxheWVyKCdib3gnKTtcblxuICAgICAgICAvLyBib3hcbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW3gseV0sXG4gICAgICAgICAgICBbdywgaF1cbiAgICAgICAgKTtcbiAgICAgICAgLy8gZGlhZ2FuYWxcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4LXcvMiwgeStoLzJdLFxuICAgICAgICAgICAgW3grdy8yLCB5LWgvMl0sXG5cbiAgICAgICAgXSk7XG4gICAgICAgIC8vIERDXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlLFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZV0sXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlKjYsXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlXSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlLFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqMixcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSozLFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNCxcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSo1LFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNixcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIF0pO1xuXG4gICAgICAgIC8vIEFDXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlLFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSoyLFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqMyxcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqNCxcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjUsXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjYsXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxheWVyKCk7XG5cblxuXG5cblxuICAgIH1cblxuXG5cblxuXG4vLyNBQ19kaXNjY29uZWN0XG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdBQycpICl7XG4gICAgICAgIGQuc2VjdGlvbihcIkFDX2Rpc2Njb25lY3RcIik7XG5cbiAgICAgICAgeCA9IGxvYy5BQ19kaXNjLng7XG4gICAgICAgIHkgPSBsb2MuQUNfZGlzYy55O1xuICAgICAgICBwYWRkaW5nID0gc2l6ZS50ZXJtaW5hbF9kaWFtO1xuXG4gICAgICAgIGQubGF5ZXIoJ2JveCcpO1xuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbeCwgeV0sXG4gICAgICAgICAgICBbc2l6ZS5BQ19kaXNjLncsIHNpemUuQUNfZGlzYy5oXVxuICAgICAgICApO1xuICAgICAgICBkLmxheWVyKCk7XG5cblxuICAgIC8vZC5jaXJjKFt4LHldLDUpO1xuXG5cblxuICAgIC8vI0FDIGxvYWQgY2VudGVyXG4gICAgICAgIGQuc2VjdGlvbihcIkFDIGxvYWQgY2VudGVyXCIpO1xuXG4gICAgICAgIHZhciBicmVha2VyX3NwYWNpbmcgPSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMuc3BhY2luZztcblxuICAgICAgICB4ID0gbG9jLkFDX2xvYWRjZW50ZXIueDtcbiAgICAgICAgeSA9IGxvYy5BQ19sb2FkY2VudGVyLnk7XG4gICAgICAgIHcgPSBzaXplLkFDX2xvYWRjZW50ZXIudztcbiAgICAgICAgaCA9IHNpemUuQUNfbG9hZGNlbnRlci5oO1xuXG4gICAgICAgIGQucmVjdChbeCx5XSxcbiAgICAgICAgICAgIFt3LGhdLFxuICAgICAgICAgICAgJ2JveCdcbiAgICAgICAgKTtcblxuICAgICAgICBkLnRleHQoW3gseS1oKjAuNF0sXG4gICAgICAgICAgICBbc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXMsICdMb2FkIENlbnRlciddLFxuICAgICAgICAgICAgJ2xhYmVsJyxcbiAgICAgICAgICAgICd0ZXh0J1xuICAgICAgICApO1xuICAgICAgICB3ID0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIudztcbiAgICAgICAgaCA9IHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyLmg7XG5cbiAgICAgICAgcGFkZGluZyA9IGxvYy5BQ19sb2FkY2VudGVyLnggLSBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy5sZWZ0IC0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIudztcblxuICAgICAgICB5ID0gbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMudG9wO1xuICAgICAgICB5ICs9IHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5zcGFjaW5nLzI7XG4gICAgICAgIGZvciggdmFyIGk9MDsgaTxzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMubnVtOyBpKyspe1xuICAgICAgICAgICAgZC5yZWN0KFt4LXBhZGRpbmctdy8yLHldLFt3LGhdLCdib3gnKTtcbiAgICAgICAgICAgIGQucmVjdChbeCtwYWRkaW5nK3cvMix5XSxbdyxoXSwnYm94Jyk7XG4gICAgICAgICAgICB5ICs9IGJyZWFrZXJfc3BhY2luZztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzLCBsO1xuXG4gICAgICAgIGwgPSBsb2MuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyO1xuICAgICAgICBzID0gc2l6ZS5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXI7XG4gICAgICAgIGQucmVjdChbbC54LGwueV0sIFtzLncscy5oXSwgJ0FDX25ldXRyYWwnICk7XG5cbiAgICAgICAgbCA9IGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhcjtcbiAgICAgICAgcyA9IHNpemUuQUNfbG9hZGNlbnRlci5ncm91bmRiYXI7XG4gICAgICAgIGQucmVjdChbbC54LGwueV0sIFtzLncscy5oXSwgJ0FDX2dyb3VuZCcgKTtcblxuICAgICAgICBkLmJsb2NrKCdncm91bmQnLCBbbC54LGwueStzLmgvMl0pO1xuXG5cblxuICAgIC8vIEFDIGQubGluZXNcbiAgICAgICAgZC5zZWN0aW9uKFwiQUMgZC5saW5lc1wiKTtcblxuICAgICAgICB4ID0gbG9jLmludmVydGVyLmJvdHRvbV9yaWdodC54O1xuICAgICAgICB5ID0gbG9jLmludmVydGVyLmJvdHRvbV9yaWdodC55O1xuICAgICAgICB4IC09IHNpemUudGVybWluYWxfZGlhbSAqIChzeXN0ZW0uQUMubnVtX2NvbmR1Y3RvcnMrMSk7XG4gICAgICAgIHkgLT0gc2l6ZS50ZXJtaW5hbF9kaWFtO1xuXG4gICAgICAgIHZhciBjb25kdWl0X3kgPSBsb2MuQUNfY29uZHVpdC55O1xuICAgICAgICBwYWRkaW5nID0gc2l6ZS50ZXJtaW5hbF9kaWFtO1xuICAgICAgICAvL3ZhciBBQ19kLmxheWVyX25hbWVzID0gWydBQ19ncm91bmQnLCAnQUNfbmV1dHJhbCcsICdBQ19MMScsICdBQ19MMicsICdBQ19MMiddO1xuXG4gICAgICAgIGZvciggdmFyIGk9MDsgaSA8IHN5c3RlbS5BQy5udW1fY29uZHVjdG9yczsgaSsrICl7XG4gICAgICAgICAgICBkLmJsb2NrKCd0ZXJtaW5hbCcsIFt4LHldICk7XG4gICAgICAgICAgICBkLmxheWVyKCdBQ18nK3N5c3RlbS5BQy5jb25kdWN0b3JzW2ldKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgW3gsIHldLFxuICAgICAgICAgICAgICAgIFt4LCBsb2MuQUNfZGlzYy5ib3R0b20gLSBwYWRkaW5nKjIgLSBwYWRkaW5nKmkgIF0sXG4gICAgICAgICAgICAgICAgW2xvYy5BQ19kaXNjLmxlZnQsIGxvYy5BQ19kaXNjLmJvdHRvbSAtIHBhZGRpbmcqMiAtIHBhZGRpbmcqaSBdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICB4ICs9IHNpemUudGVybWluYWxfZGlhbTtcbiAgICAgICAgfVxuICAgICAgICBkLmxheWVyKCk7XG5cbiAgICAgICAgeCA9IGxvYy5BQ19kaXNjLng7XG4gICAgICAgIHkgPSBsb2MuQUNfZGlzYy55ICsgc2l6ZS5BQ19kaXNjLmgvMjtcbiAgICAgICAgeSAtPSBwYWRkaW5nKjI7XG5cbiAgICAgICAgaWYoIHN5c3RlbS5BQy5jb25kdWN0b3JzLmluZGV4T2YoJ2dyb3VuZCcpKzEgKSB7XG4gICAgICAgICAgICBkLmxheWVyKCdBQ19ncm91bmQnKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4LXNpemUuQUNfZGlzYy53LzIsIHkgXSxcbiAgICAgICAgICAgICAgICBbIHgrc2l6ZS5BQ19kaXNjLncvMitwYWRkaW5nKjIsIHkgXSxcbiAgICAgICAgICAgICAgICBbIHgrc2l6ZS5BQ19kaXNjLncvMitwYWRkaW5nKjIsIGNvbmR1aXRfeSArIGJyZWFrZXJfc3BhY2luZyoyIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5sZWZ0K3BhZGRpbmcqMiwgY29uZHVpdF95ICsgYnJlYWtlcl9zcGFjaW5nKjIgXSxcbiAgICAgICAgICAgICAgICAvL1sgbG9jLkFDX2xvYWRjZW50ZXIubGVmdCtwYWRkaW5nKjIsIHkgXSxcbiAgICAgICAgICAgICAgICAvL1sgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLngtcGFkZGluZywgeSBdLFxuICAgICAgICAgICAgICAgIC8vWyBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueC1wYWRkaW5nLCBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueStzaXplLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLmgvMiBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIubGVmdCtwYWRkaW5nKjIsIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci55IF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueC1zaXplLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLncvMiwgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLnkgXSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIHN5c3RlbS5BQy5jb25kdWN0b3JzLmluZGV4T2YoJ25ldXRyYWwnKSsxICkge1xuICAgICAgICAgICAgeSAtPSBwYWRkaW5nO1xuICAgICAgICAgICAgZC5sYXllcignQUNfbmV1dHJhbCcpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHgtc2l6ZS5BQ19kaXNjLncvMiwgeSBdLFxuICAgICAgICAgICAgICAgIFsgeCtwYWRkaW5nKjMqMiwgeSBdLFxuICAgICAgICAgICAgICAgIFsgeCtwYWRkaW5nKjMqMiwgY29uZHVpdF95ICsgYnJlYWtlcl9zcGFjaW5nKjEgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIueCwgY29uZHVpdF95ICsgYnJlYWtlcl9zcGFjaW5nKjEgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIueCxcbiAgICAgICAgICAgICAgICAgICAgbG9jLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhci55LXNpemUuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyLmgvMiBdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH1cblxuXG5cbiAgICAgICAgZm9yKCB2YXIgaT0xOyBpIDw9IDM7IGkrKyApIHtcbiAgICAgICAgICAgIGlmKCBzeXN0ZW0uQUMuY29uZHVjdG9ycy5pbmRleE9mKCdMJytpKSsxICkge1xuICAgICAgICAgICAgICAgIHkgLT0gcGFkZGluZztcbiAgICAgICAgICAgICAgICBkLmxheWVyKCdBQ19MJytpKTtcbiAgICAgICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbIHgtc2l6ZS5BQ19kaXNjLncvMiwgeSBdLFxuICAgICAgICAgICAgICAgICAgICBbIHgrcGFkZGluZyozKigyLWkpLCB5IF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeCtwYWRkaW5nKjMqKDItaSksIGxvYy5BQ19kaXNjLnN3aXRjaF9ib3R0b20gXSxcbiAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICBkLmJsb2NrKCd0ZXJtaW5hbCcsIFsgeC1wYWRkaW5nKihpLTIpKjMsIGxvYy5BQ19kaXNjLnN3aXRjaF9ib3R0b20gXSApO1xuICAgICAgICAgICAgICAgIGQuYmxvY2soJ3Rlcm1pbmFsJywgWyB4LXBhZGRpbmcqKGktMikqMywgbG9jLkFDX2Rpc2Muc3dpdGNoX3RvcCBdICk7XG4gICAgICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgWyB4LXBhZGRpbmcqKGktMikqMywgbG9jLkFDX2Rpc2Muc3dpdGNoX3RvcCBdLFxuICAgICAgICAgICAgICAgICAgICBbIHgtcGFkZGluZyooaS0yKSozLCBjb25kdWl0X3ktYnJlYWtlcl9zcGFjaW5nKihpLTEpIF0sXG4gICAgICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMubGVmdCwgY29uZHVpdF95LWJyZWFrZXJfc3BhY2luZyooaS0xKSBdLFxuICAgICAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG5cblxuICAgIH1cblxuXG5cblxuLy8gV2lyZSB0YWJsZVxuICAgIGQuc2VjdGlvbihcIldpcmUgdGFibGVcIik7XG5cbiAgICB4ID0gbG9jLndpcmVfdGFibGUueDtcbiAgICB5ID0gbG9jLndpcmVfdGFibGUueTtcbiAgICB3ID0gc2l6ZS53aXJlX3RhYmxlLnc7XG4gICAgaCA9IHNpemUud2lyZV90YWJsZS5oO1xuICAgIHZhciByb3dfaCA9IHNpemUud2lyZV90YWJsZS5yb3dfaDtcbiAgICB2YXIgdG9wID0gbG9jLndpcmVfdGFibGUudG9wO1xuICAgIHZhciBib3R0b20gPSBsb2Mud2lyZV90YWJsZS5ib3R0b207XG4gICAgdmFyIGNvbHVtbl93aWR0aCA9IHtcbiAgICAgICAgbnVtYmVyOiAyNSxcbiAgICAgICAgd2lyZV9nYXVnZTogMjUsXG4gICAgICAgIHdpcmVfdHlwZTogNTAsXG4gICAgICAgIGNvbmR1aXRfZ2F1Z2U6IDI1LFxuICAgICAgICBjb25kdWl0X3R5cGU6IDUwLFxuICAgIH07XG5cbiAgICBkLmxheWVyKCd0YWJsZScpO1xuICAgIGQucmVjdCggW3gseV0sIFt3LGhdICk7XG5cbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC13LzIrMjUgLCB5LWgvMisoMSpyb3dfaCldLFxuICAgICAgICBbeCt3LzIgLCB5LWgvMisoMSpyb3dfaCldLFxuICAgIF0pO1xuXG4gICAgZm9yKCB2YXIgcj0yOyByPHN5c3RlbS5BQy5udW1fY29uZHVjdG9ycyszOyByKysgKSB7XG5cbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4LXcvMiAsIHktaC8yKyhyKnJvd19oKV0sXG4gICAgICAgICAgICBbeCt3LzIgLCB5LWgvMisocipyb3dfaCldLFxuICAgICAgICBdKTtcbiAgICB9XG4gICAgeCA9IGxvYy53aXJlX3RhYmxlLnggLSB3LzI7XG4gICAgeSA9IGxvYy53aXJlX3RhYmxlLnkgLSBoLzI7XG4gICAgeCArPSBjb2x1bW5fd2lkdGgubnVtYmVyO1xuXG4gICAgdmFyIGNfdyA9IGNvbHVtbl93aWR0aC53aXJlX2dhdWdlO1xuICAgIGQubGluZShbIFt4LHRvcF0sIFt4LGJvdHRvbS1yb3dfaF0gXSk7XG4gICAgZC50ZXh0KCBbeCtjX3cseStyb3dfaCowLjc1XSwgJ1dpcmUnLCAndGFibGUnLCAndGV4dCcpO1xuICAgIGQudGV4dCggW3grY193LzIseStyb3dfaCoxLjc1XSwgJ0FXRycsICd0YWJsZScsICd0ZXh0Jyk7XG4gICAgeCArPSBjX3c7XG5cbiAgICBjX3cgPSBjb2x1bW5fd2lkdGgud2lyZV90eXBlO1xuICAgIGQubGluZShbIFt4LHRvcCtyb3dfaF0sIFt4LGJvdHRvbS1yb3dfaF0gXSk7XG4gICAgZC50ZXh0KCBbeCtjX3cvMix5K3Jvd19oKjEuNzVdLCAnVHlwZScsICd0YWJsZScsICd0ZXh0Jyk7XG4gICAgeCArPSBjX3c7XG5cbiAgICBjX3cgPSBjb2x1bW5fd2lkdGguY29uZHVpdF9nYXVnZTtcbiAgICBkLmxpbmUoWyBbeCx0b3BdLCBbeCxib3R0b20tcm93X2hdIF0pO1xuICAgIGQudGV4dCggW3grY193LHkrcm93X2gqMC43NV0sICdDb25kdWl0JywgJ3RhYmxlJywgJ3RleHQnKTtcbiAgICBkLnRleHQoIFt4K2Nfdy8yLHkrcm93X2gqMS43NV0sICdTaXplJywgJ3RhYmxlJywgJ3RleHQnKTtcbiAgICB4ICs9IGNfdztcblxuICAgIGQubGluZShbIFt4LHRvcCtyb3dfaF0sIFt4LGJvdHRvbS1yb3dfaF0gXSk7XG4gICAgZC50ZXh0KCBbeCtjX3cvMix5K3Jvd19oKjEuNzVdLCAnVHlwZScsICd0YWJsZScsICd0ZXh0Jyk7XG5cbiAgICB4ID0gbG9jLndpcmVfdGFibGUueCAtIHcvMjtcbiAgICB5ID0gbG9jLndpcmVfdGFibGUueSAtIGgvMjtcblxuICAgIHggKz0gY29sdW1uX3dpZHRoLm51bWJlci8yO1xuICAgIHkgKz0gcm93X2gqMiArIHJvd19oKjAuNzU7XG5cbiAgICBmb3IoIHZhciByPTE7IHI8PXN5c3RlbS53aXJlX2NvbmZpZ19udW07IHIrKyApIHtcbiAgICAgICAgZC50ZXh0KCBbeCx5XSwgU3RyaW5nKHIpLCAndGFibGUnLCAndGV4dCcpO1xuXG5cblxuICAgICAgICB5ICs9IHJvd19oO1xuICAgIH1cblxuXG5cbi8vIHZvbHRhZ2UgZHJvcFxuICAgIGQuc2VjdGlvbihcInZvbHRhZ2UgZHJvcFwiKTtcblxuXG4gICAgeCA9IGxvYy52b2x0X2Ryb3BfdGFibGUueDtcbiAgICB5ID0gbG9jLnZvbHRfZHJvcF90YWJsZS55O1xuICAgIHcgPSBzaXplLnZvbHRfZHJvcF90YWJsZS53O1xuICAgIGggPSBzaXplLnZvbHRfZHJvcF90YWJsZS5oO1xuXG4gICAgZC5sYXllcigndGFibGUnKTtcbiAgICBkLnJlY3QoIFt4LHldLCBbdyxoXSApO1xuXG4gICAgeSAtPSBoLzI7XG4gICAgeSArPSAxMDtcblxuICAgIGQudGV4dCggW3gseV0sICdWb2x0YWdlIERyb3AnLCAndGFibGUnLCAndGV4dCcpO1xuXG5cbi8vIGdlbmVyYWwgbm90ZXNcbiAgICBkLnNlY3Rpb24oXCJnZW5lcmFsIG5vdGVzXCIpO1xuXG4gICAgeCA9IGxvYy5nZW5lcmFsX25vdGVzLng7XG4gICAgeSA9IGxvYy5nZW5lcmFsX25vdGVzLnk7XG4gICAgdyA9IHNpemUuZ2VuZXJhbF9ub3Rlcy53O1xuICAgIGggPSBzaXplLmdlbmVyYWxfbm90ZXMuaDtcblxuICAgIGQubGF5ZXIoJ3RhYmxlJyk7XG4gICAgZC5yZWN0KCBbeCx5XSwgW3csaF0gKTtcblxuICAgIHkgLT0gaC8yO1xuICAgIHkgKz0gMTA7XG5cbiAgICBkLnRleHQoIFt4LHldLCAnR2VuZXJhbCBOb3RlcycsICd0YWJsZScsICd0ZXh0Jyk7XG5cblxuICAgIGQuc2VjdGlvbigpO1xuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xudmFyIG1rX2JvcmRlciA9IHJlcXVpcmUoJy4vbWtfYm9yZGVyJyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHBhZ2UgM1wiKTtcblxuICAgIGQgPSBta19kcmF3aW5nKCk7XG5cbiAgICB2YXIgc2hlZXRfc2VjdGlvbiA9ICdQVic7XG4gICAgdmFyIHNoZWV0X251bSA9ICcwMic7XG4gICAgZC5hcHBlbmQobWtfYm9yZGVyKHNldHRpbmdzLCBzaGVldF9zZWN0aW9uLCBzaGVldF9udW0gKSk7XG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmcuc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZy5sb2M7XG5cblxuICAgIGQudGV4dChcbiAgICAgICAgW3NpemUuZHJhd2luZy53LzIsIHNpemUuZHJhd2luZy5oLzJdLFxuICAgICAgICAnQ2FsY3VsYXRpb24gU2hlZXQnLFxuICAgICAgICAndGl0bGUyJ1xuICAgICk7XG5cbiAgICByZXR1cm4gZC5kcmF3aW5nX3BhcnRzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcGFnZTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vdmFyIHNldHRpbmdzID0gcmVxdWlyZSgnLi9zZXR0aW5ncy5qcycpO1xuLy92YXIgc25hcHN2ZyA9IHJlcXVpcmUoJ3NuYXBzdmcnKTtcbi8vbG9nKHNldHRpbmdzKTtcblxuXG5cbnZhciBkaXNwbGF5X3N2ZyA9IGZ1bmN0aW9uKGRyYXdpbmdfcGFydHMsIHNldHRpbmdzKXtcbiAgICAvL2NvbnNvbGUubG9nKCdkaXNwbGF5aW5nIHN2ZycpO1xuICAgIHZhciBsYXllcl9hdHRyID0gc2V0dGluZ3MuZHJhd2luZy5sYXllcl9hdHRyO1xuICAgIHZhciBmb250cyA9IHNldHRpbmdzLmRyYXdpbmcuZm9udHM7XG4gICAgLy9jb25zb2xlLmxvZygnZHJhd2luZ19wYXJ0czogJywgZHJhd2luZ19wYXJ0cyk7XG4gICAgLy9jb250YWluZXIuZW1wdHkoKVxuXG4gICAgLy92YXIgc3ZnX2VsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnU3ZnanNTdmcxMDAwJylcbiAgICB2YXIgc3ZnX2VsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAnc3ZnJyk7XG4gICAgc3ZnX2VsZW0uc2V0QXR0cmlidXRlKCdpZCcsJ3N2Z19kcmF3aW5nJyk7XG4gICAgc3ZnX2VsZW0uc2V0QXR0cmlidXRlKCd3aWR0aCcsIHNldHRpbmdzLmRyYXdpbmcuc2l6ZS5kcmF3aW5nLncpO1xuICAgIHN2Z19lbGVtLnNldEF0dHJpYnV0ZSgnaGVpZ2h0Jywgc2V0dGluZ3MuZHJhd2luZy5zaXplLmRyYXdpbmcuaCk7XG4gICAgLy92YXIgc3ZnID0gc25hcHN2ZyhzdmdfZWxlbSkuc2l6ZShzaXplLmRyYXdpbmcudywgc2l6ZS5kcmF3aW5nLmgpO1xuICAgIC8vdmFyIHN2ZyA9IHNuYXBzdmcoJyNzdmdfZHJhd2luZycpO1xuXG4gICAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgZHJhd2luZyBjb250ZW50cywgY2FsbCB0aGUgZnVuY3Rpb24gYmVsb3cuXG4gICAgZHJhd2luZ19wYXJ0cy5mb3JFYWNoKCBmdW5jdGlvbihlbGVtLGlkKSB7XG4gICAgICAgIHNob3dfZWxlbV9hcnJheShlbGVtKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHNob3dfZWxlbV9hcnJheShlbGVtLCBvZmZzZXQpe1xuICAgICAgICBvZmZzZXQgPSBvZmZzZXQgfHwge3g6MCx5OjB9O1xuICAgICAgICB2YXIgeCx5LGF0dHI7XG4gICAgICAgIGlmKCB0eXBlb2YgZWxlbS54ICE9PSAndW5kZWZpbmVkJyApIHsgeCA9IGVsZW0ueCArIG9mZnNldC54OyB9XG4gICAgICAgIGlmKCB0eXBlb2YgZWxlbS55ICE9PSAndW5kZWZpbmVkJyApIHsgeSA9IGVsZW0ueSArIG9mZnNldC55OyB9XG5cbiAgICAgICAgaWYoIGVsZW0udHlwZSA9PT0gJ3JlY3QnKSB7XG4gICAgICAgICAgICAvL3N2Zy5yZWN0KCBlbGVtLncsIGVsZW0uaCApLm1vdmUoIHgtZWxlbS53LzIsIHktZWxlbS5oLzIgKS5hdHRyKCBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV0gKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2VsZW06JywgZWxlbSApO1xuICAgICAgICAgICAgLy9pZiggaXNOYU4oZWxlbS53KSApIHtcbiAgICAgICAgICAgIC8vICAgIGNvbnNvbGUubG9nKCdlcnJvcjogZWxlbSBub3QgZnVsbHkgZGVmaW5lZCcsIGVsZW0pXG4gICAgICAgICAgICAvLyAgICBlbGVtLncgPSAxMDtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgLy9pZiggaXNOYU4oZWxlbS5oKSApIHtcbiAgICAgICAgICAgIC8vICAgIGNvbnNvbGUubG9nKCdlcnJvcjogZWxlbSBub3QgZnVsbHkgZGVmaW5lZCcsIGVsZW0pXG4gICAgICAgICAgICAvLyAgICBlbGVtLmggPSAxMDtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgdmFyIHIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAncmVjdCcpO1xuICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgZWxlbS53KTtcbiAgICAgICAgICAgIHIuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBlbGVtLmgpO1xuICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoJ3gnLCB4LWVsZW0udy8yKTtcbiAgICAgICAgICAgIHIuc2V0QXR0cmlidXRlKCd5JywgeS1lbGVtLmgvMik7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGVsZW0ubGF5ZXJfbmFtZSk7XG4gICAgICAgICAgICBhdHRyID0gbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdO1xuICAgICAgICAgICAgZm9yKCB2YXIgaTIgaW4gYXR0ciApe1xuICAgICAgICAgICAgICAgIHIuc2V0QXR0cmlidXRlKGkyLCBhdHRyW2kyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdmdfZWxlbS5hcHBlbmRDaGlsZChyKTtcbiAgICAgICAgfSBlbHNlIGlmKCBlbGVtLnR5cGUgPT09ICdsaW5lJykge1xuICAgICAgICAgICAgdmFyIHBvaW50czIgPSBbXTtcbiAgICAgICAgICAgIGVsZW0ucG9pbnRzLmZvckVhY2goIGZ1bmN0aW9uKHBvaW50KXtcbiAgICAgICAgICAgICAgICBpZiggISBpc05hTihwb2ludFswXSkgJiYgISBpc05hTihwb2ludFsxXSkgKXtcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzMi5wdXNoKFsgcG9pbnRbMF0rb2Zmc2V0LngsIHBvaW50WzFdK29mZnNldC55IF0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjogZWxlbSBub3QgZnVsbHkgZGVmaW5lZCcsIGVsZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9zdmcucG9seWxpbmUoIHBvaW50czIgKS5hdHRyKCBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV0gKTtcblxuICAgICAgICAgICAgdmFyIGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAncG9seWxpbmUnKTtcbiAgICAgICAgICAgIGwuc2V0QXR0cmlidXRlKCAncG9pbnRzJywgcG9pbnRzMi5qb2luKCcgJykgKTtcbiAgICAgICAgICAgIGF0dHIgPSBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV07XG4gICAgICAgICAgICBmb3IoIHZhciBpMiBpbiBhdHRyICl7XG4gICAgICAgICAgICAgICAgbC5zZXRBdHRyaWJ1dGUoaTIsIGF0dHJbaTJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN2Z19lbGVtLmFwcGVuZENoaWxkKGwpO1xuICAgICAgICB9IGVsc2UgaWYoIGVsZW0udHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAvL3ZhciB0ID0gc3ZnLnRleHQoIGVsZW0uc3RyaW5ncyApLm1vdmUoIGVsZW0ucG9pbnRzWzBdWzBdLCBlbGVtLnBvaW50c1swXVsxXSApLmF0dHIoIGxheWVyX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApXG4gICAgICAgICAgICB2YXIgZm9udCA9IGZvbnRzW2VsZW0uZm9udF07XG4gICAgICAgICAgICBpZiggZm9udFsndGV4dC1hbmNob3InXSA9PT0gJ21pZGRsZScgKSB5ICs9IGZvbnRbJ2ZvbnQtc2l6ZSddKjEvMztcbiAgICAgICAgICAgIHZhciB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3RleHQnKTtcbiAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCd4JywgeCk7XG4gICAgICAgICAgICAvL3Quc2V0QXR0cmlidXRlKCd5JywgeSArIGZvbnRbJ2ZvbnQtc2l6ZSddLzIgKTtcbiAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCd5JywgeSApO1xuICAgICAgICAgICAgaWYoZWxlbS5yb3RhdGVkKXtcbiAgICAgICAgICAgICAgICAvL3Quc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCBcInJvdGF0ZShcIiArIGVsZW0ucm90YXRlZCArIFwiIFwiICsgeCArIFwiIFwiICsgeSArIFwiKVwiICk7XG4gICAgICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsIFwicm90YXRlKFwiICsgZWxlbS5yb3RhdGVkICsgXCIgXCIgKyB4ICsgXCIgXCIgKyB5ICsgXCIpXCIgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciggdmFyIGkyIGluIGxheWVyX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApe1xuICAgICAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCBpMiwgbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdW2kyXSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yKCB2YXIgaTIgaW4gZm9udCApe1xuICAgICAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCBpMiwgZm9udFtpMl0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciggdmFyIGkyIGluIGVsZW0uc3RyaW5ncyApe1xuICAgICAgICAgICAgICAgIHZhciB0c3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICd0c3BhbicpO1xuICAgICAgICAgICAgICAgIHRzcGFuLnNldEF0dHJpYnV0ZSgnZHknLCBmb250Wydmb250LXNpemUnXSoxLjUqaTIgKTtcbiAgICAgICAgICAgICAgICB0c3Bhbi5zZXRBdHRyaWJ1dGUoJ3gnLCB4KTtcbiAgICAgICAgICAgICAgICB0c3Bhbi5pbm5lckhUTUwgPSBlbGVtLnN0cmluZ3NbaTJdO1xuICAgICAgICAgICAgICAgIHQuYXBwZW5kQ2hpbGQodHNwYW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3ZnX2VsZW0uYXBwZW5kQ2hpbGQodCk7XG4gICAgICAgIH0gZWxzZSBpZiggZWxlbS50eXBlID09PSAnY2lyYycpIHtcbiAgICAgICAgICAgIHZhciBjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ2VsbGlwc2UnKTtcbiAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKCdyeCcsIGVsZW0uZC8yKTtcbiAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKCdyeScsIGVsZW0uZC8yKTtcbiAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKCdjeCcsIHgpO1xuICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoJ2N5JywgeSk7XG4gICAgICAgICAgICBhdHRyID0gbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdO1xuICAgICAgICAgICAgZm9yKCB2YXIgaTIgaW4gYXR0ciApe1xuICAgICAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKGkyLCBhdHRyW2kyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdmdfZWxlbS5hcHBlbmRDaGlsZChjKTtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBjLmF0dHJpYnV0ZXMoIGxheWVyX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApXG4gICAgICAgICAgICBjLmF0dHJpYnV0ZXMoe1xuICAgICAgICAgICAgICAgIHJ4OiA1LFxuICAgICAgICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgcnk6IDUsXG4gICAgICAgICAgICAgICAgY3g6IGVsZW0ucG9pbnRzWzBdWzBdLWVsZW0uZC8yLFxuICAgICAgICAgICAgICAgIGN5OiBlbGVtLnBvaW50c1swXVsxXS1lbGVtLmQvMlxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHZhciBjMiA9IHN2Zy5lbGxpcHNlKCBlbGVtLnIsIGVsZW0uciApXG4gICAgICAgICAgICBjMi5tb3ZlKCBlbGVtLnBvaW50c1swXVswXS1lbGVtLmQvMiwgZWxlbS5wb2ludHNbMF1bMV0tZWxlbS5kLzIgKVxuICAgICAgICAgICAgYzIuYXR0cih7cng6NSwgcnk6NX0pXG4gICAgICAgICAgICBjMi5hdHRyKCBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV0gKVxuICAgICAgICAgICAgKi9cbiAgICAgICAgfSBlbHNlIGlmKGVsZW0udHlwZSA9PT0gJ2Jsb2NrJykge1xuICAgICAgICAgICAgLy8gaWYgaXQgaXMgYSBibG9jaywgcnVuIHRoaXMgZnVuY3Rpb24gdGhyb3VnaCBlYWNoIGVsZW1lbnQuXG4gICAgICAgICAgICBlbGVtLmRyYXdpbmdfcGFydHMuZm9yRWFjaCggZnVuY3Rpb24oYmxvY2tfZWxlbSxpZCl7XG4gICAgICAgICAgICAgICAgc2hvd19lbGVtX2FycmF5KGJsb2NrX2VsZW0sIHt4OngsIHk6eX0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN2Z19lbGVtO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRpc3BsYXlfc3ZnO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgZiA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zJyk7XG52YXIgayA9IHJlcXVpcmUoJy4uL2xpYi9rL2suanMnKTtcblxuLy92YXIgc2V0dGluZ3NDYWxjdWxhdGVkID0gcmVxdWlyZSgnLi9zZXR0aW5nc0NhbGN1bGF0ZWQuanMnKTtcblxuLy8gTG9hZCAndXNlcicgZGVmaW5lZCBzZXR0aW5nc1xudmFyIG1rX3NldHRpbmdzID0gcmVxdWlyZSgnLi4vZGF0YS9zZXR0aW5ncy5qc29uLmpzJyk7XG5mLm1rX3NldHRpbmdzID0gbWtfc2V0dGluZ3M7XG5cbnZhciBzZXR0aW5ncyA9IHt9O1xuXG5zZXR0aW5ncy5jb25maWdfb3B0aW9ucyA9IHt9O1xuc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuTkVDX3RhYmxlcyA9IHJlcXVpcmUoJy4uL2RhdGEvdGFibGVzLmpzb24nKTtcbi8vY29uc29sZS5sb2coc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuTkVDX3RhYmxlcyk7XG5cbnNldHRpbmdzLnN0YXRlID0gc2V0dGluZ3Muc3RhdGUgfHwge307XG5zZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQgPSBmYWxzZTtcblxuc2V0dGluZ3MgPSBta19zZXR0aW5ncy5pX29wdGlvbnMoc2V0dGluZ3MpO1xuc2V0dGluZ3MgPSBta19zZXR0aW5ncy5pbnB1dHMoc2V0dGluZ3MpO1xuc2V0dGluZ3MgPSBta19zZXR0aW5ncy5zeXN0ZW0oc2V0dGluZ3MpO1xuXG5zZXR0aW5ncy5pbnB1dF9vcHRpb25zID0gc2V0dGluZ3MuaW5wdXRzOyAvLyBjb3B5IGlucHV0IHJlZmVyZW5jZSB3aXRoIG9wdGlvbnMgdG8gaW5wdXRfb3B0aW9uc1xuc2V0dGluZ3MuaW5wdXRzID0gZi5ibGFua19jb3B5KHNldHRpbmdzLmlucHV0X29wdGlvbnMpOyAvLyBtYWtlIGlucHV0IHNlY3Rpb24gYmxhbmtcbnNldHRpbmdzLnN5c3RlbV9mb3JtdWxhcyA9IHNldHRpbmdzLnN5c3RlbTsgLy8gY29weSBzeXN0ZW0gcmVmZXJlbmNlIHRvIHN5c3RlbV9mb3JtdWxhc1xuc2V0dGluZ3Muc3lzdGVtID0gZi5ibGFua19jb3B5KHNldHRpbmdzLnN5c3RlbV9mb3JtdWxhcyk7IC8vIG1ha2Ugc3lzdGVtIHNlY3Rpb24gYmxhbmtcbmYubWVyZ2Vfb2JqZWN0cyggc2V0dGluZ3MuaW5wdXRzLCBzZXR0aW5ncy5zeXN0ZW0gKTtcblxuc2V0dGluZ3MuaW5wdXRfb3B0aW9ucy5EQyA9IHNldHRpbmdzLmlucHV0X29wdGlvbnMuREMgfHwge307XG5zZXR0aW5ncy5pbnB1dF9vcHRpb25zLkRDLkFXRyA9IGsub2JqX25hbWVzKHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLk5FQ190YWJsZXNbJ0NoIDkgVGFibGUgOCBDb25kdWN0b3IgUHJvcGVydGllcyddKTtcbi8vIGxvYWQgbGF5ZXJzXG5cbnNldHRpbmdzLmRyYXdpbmcgPSBzZXR0aW5ncy5kcmF3aW5nIHx8IHt9O1xuc2V0dGluZ3MuZHJhd2luZy5sYXllcl9hdHRyID0gcmVxdWlyZSgnLi9zZXR0aW5nc19sYXllcnMnKTtcblxuLy8gTG9hZCBkcmF3aW5nIHNwZWNpZmljIHNldHRpbmdzXG4vLyBUT0RPIEZpeCBzZXR0aW5nc19kcmF3aW5nIHdpdGggbmV3IHZhcmlhYmxlIGxvY2F0aW9uc1xudmFyIHNldHRpbmdzX2RyYXdpbmcgPSByZXF1aXJlKCcuL3NldHRpbmdzX2RyYXdpbmcnKTtcbnNldHRpbmdzID0gc2V0dGluZ3NfZHJhd2luZyhzZXR0aW5ncyk7XG5cbi8vc2V0dGluZ3Muc3RhdGVfYXBwLnZlcnNpb25fc3RyaW5nID0gdmVyc2lvbl9zdHJpbmc7XG5cbi8vc2V0dGluZ3MgPSBmLm51bGxUb09iamVjdChzZXR0aW5ncyk7XG5cbnNldHRpbmdzLnNlbGVjdF9yZWdpc3RyeSA9IFtdO1xuc2V0dGluZ3MudmFsdWVfcmVnaXN0cnkgPSBbXTtcblxudmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcblxuLy92YXIgY29uZmlnX29wdGlvbnMgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucyA9IHNldHRpbmdzLmNvbmZpZ19vcHRpb25zIHx8IHt9O1xuXG5cblxuXG5zZXR0aW5ncy5jb21wb25lbnRzID0ge307XG5cblxuLypcbmZvciggdmFyIHNlY3Rpb25fbmFtZSBpbiBzZXR0aW5ncy5pbnB1dF9vcHRpb25zICl7XG4gICAgZm9yKCB2YXIgaW5wdXRfbmFtZSBpbiBzZXR0aW5ncy5pbnB1dF9vcHRpb25zW3NlY3Rpb25fbmFtZV0pe1xuICAgICAgICBpZiggdHlwZW9mIHNldHRpbmdzLmlucHV0X29wdGlvbnNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSA9PT0gJ3N0cmluZycgKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNldHRpbmdzLmlucHV0X29wdGlvbnNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSlcbiAgICAgICAgICAgIFwib2JqX25hbWVzKHNldHR0aW5nc1wiICsgc2V0dGluZ3MuaW5wdXRfb3B0aW9uc1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdICsgXCIpXCI7XG4gICAgICAgICAgICAvLyBldmFsIGlzIG9ubHkgYmVpbmcgdXNlZCBvbiBzdHJpbmdzIGRlZmluZWQgaW4gdGhlIHNldHRpbmdzLmpzb24gZmlsZSB0aGF0IGlzIGJ1aWx0IGludG8gdGhlIGFwcGxpY2F0aW9uXG4gICAgICAgICAgICBzZXR0aW5ncy5pbnB1dF9vcHRpb25zW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0gPSBldmFsKHNldHRpbmdzLmlucHV0X29wdGlvbnNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyovXG5cblxuLypcbnNldHRpbmdzLnN0YXRlLnNlY3Rpb25zID0ge1xuICAgIG1vZHVsZXM6IHt9LFxuICAgIGFycmF5OiB7fSxcbiAgICBEQzoge30sXG4gICAgaW52ZXJ0ZXI6IHt9LFxuICAgIEFDOiB7fSxcbn07XG5jb25maWdfb3B0aW9ucy5zZWN0aW9uX29wdGlvbnMgPSBvYmpfbmFtZXMoc2V0dGluZ3Muc3RhdGUuc2VjdGlvbnMpO1xuc2V0dGluZ3Muc3RhdGUuYWN0aXZlX3NlY3Rpb24gPSAnbW9kdWxlcyc7XG5cbmNvbmZpZ19vcHRpb25zLkFDX2xvYWRjZW50ZXJfdHlwZV9vcHRpb25zID0gb2JqX25hbWVzKCBjb25maWdfb3B0aW9ucy5BQ19sb2FkY2VudGVyX3R5cGVzICk7XG5jb25maWdfb3B0aW9ucy5BQ190eXBlX29wdGlvbnMgPSBvYmpfbmFtZXMoIGNvbmZpZ19vcHRpb25zLkFDX3R5cGVzICk7XG5cbmNvbmZpZ19vcHRpb25zLmludmVydGVycyA9IHt9O1xuXG5jb25maWdfb3B0aW9ucy5wYWdlX29wdGlvbnMgPSBbJ1BhZ2UgMSBvZiAxJ107XG5zZXR0aW5ncy5zdGF0ZS5hY3RpdmVfcGFnZSA9IGNvbmZpZ19vcHRpb25zLnBhZ2Vfb3B0aW9uc1swXTtcblxuc3lzdGVtLmludmVydGVyID0ge307XG5cblxuY29uZmlnX29wdGlvbnMuRENfaG9tZXJ1bl9sZW5ndGhzID0gY29uZmlnX29wdGlvbnMuRENfaG9tZXJ1bl9sZW5ndGhzIHx8IFsyNSw1MCw3NSwxMDBdO1xuY29uZmlnX29wdGlvbnMuRENfaG9tZXJ1bl9BV0dfb3B0aW9ucyA9XG4gICAgY29uZmlnX29wdGlvbnMuRENfaG9tZXJ1bl9BV0dfb3B0aW9ucyB8fFxuICAgIG9ial9uYW1lcyggY29uZmlnX29wdGlvbnMuTkVDX3RhYmxlc1tcIkNoIDkgVGFibGUgOCBDb25kdWN0b3IgUHJvcGVydGllc1wiXSApO1xuLy8qL1xuXG5cbm1vZHVsZS5leHBvcnRzID0gc2V0dGluZ3M7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gc2V0dGluZ3NfZHJhd2luZyhzZXR0aW5ncyl7XG5cbiAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuICAgIHZhciBzdGF0dXMgPSBzZXR0aW5ncy5zdGF0dXM7XG5cbiAgICAvLyBEcmF3aW5nIHNwZWNpZmljXG4gICAgc2V0dGluZ3MuZHJhd2luZyA9IHNldHRpbmdzLmRyYXdpbmcgfHwge307XG5cbiAgICAvLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBmb250c1xuXG4gICAgdmFyIGZvbnRzID0gc2V0dGluZ3MuZHJhd2luZy5mb250cyA9IHt9O1xuXG4gICAgZm9udHNbJ3NpZ25zJ10gPSB7XG4gICAgICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICAgICAnZm9udC1zaXplJzogICAgIDUsXG4gICAgICAgICd0ZXh0LWFuY2hvcic6ICAgJ21pZGRsZScsXG4gICAgfTtcbiAgICBmb250c1snbGFiZWwnXSA9IHtcbiAgICAgICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgICAgICdmb250LXNpemUnOiAgICAgMTIsXG4gICAgICAgICd0ZXh0LWFuY2hvcic6ICAgJ21pZGRsZScsXG4gICAgfTtcbiAgICBmb250c1sndGl0bGUxJ10gPSB7XG4gICAgICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICAgICAnZm9udC1zaXplJzogICAgIDE0LFxuICAgICAgICAndGV4dC1hbmNob3InOiAgICdsZWZ0JyxcbiAgICB9O1xuICAgIGZvbnRzWyd0aXRsZTInXSA9IHtcbiAgICAgICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgICAgICdmb250LXNpemUnOiAgICAgMTIsXG4gICAgICAgICd0ZXh0LWFuY2hvcic6ICAgJ2xlZnQnLFxuICAgIH07XG4gICAgZm9udHNbJ3BhZ2UnXSA9IHtcbiAgICAgICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgICAgICdmb250LXNpemUnOiAgICAgMjAsXG4gICAgICAgICd0ZXh0LWFuY2hvcic6ICAgJ21pZGRsZScsXG4gICAgfTtcbiAgICBmb250c1sndGFibGUnXSA9IHtcbiAgICAgICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgICAgICdmb250LXNpemUnOiAgICAgNixcbiAgICAgICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbiAgICB9O1xuXG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmcuc2l6ZSA9IHt9O1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nLmxvYyA9IHt9O1xuXG5cbiAgICAvLyBzaXplc1xuICAgIHNpemUuZHJhd2luZyA9IHtcbiAgICAgICAgdzogMTAwMCxcbiAgICAgICAgaDogNzgwLFxuICAgICAgICBmcmFtZV9wYWRkaW5nOiA1LFxuICAgICAgICB0aXRsZWJveDogNTAsXG4gICAgfTtcblxuICAgIHNpemUubW9kdWxlID0ge307XG4gICAgc2l6ZS5tb2R1bGUuZnJhbWUgPSB7XG4gICAgICAgIHc6IDEwLFxuICAgICAgICBoOiAzMCxcbiAgICB9O1xuICAgIHNpemUubW9kdWxlLmxlYWQgPSBzaXplLm1vZHVsZS5mcmFtZS53KjIvMztcbiAgICBzaXplLm1vZHVsZS5oID0gc2l6ZS5tb2R1bGUuZnJhbWUuaCArIHNpemUubW9kdWxlLmxlYWQqMjtcbiAgICBzaXplLm1vZHVsZS53ID0gc2l6ZS5tb2R1bGUuZnJhbWUudztcblxuICAgIHNpemUud2lyZV9vZmZzZXQgPSB7XG4gICAgICAgIGJhc2U6IDcsXG4gICAgICAgIGdhcDogc2l6ZS5tb2R1bGUudyxcbiAgICB9O1xuICAgIHNpemUud2lyZV9vZmZzZXQubWluID0gc2l6ZS53aXJlX29mZnNldC5iYXNlICogMTtcblxuICAgIHNpemUuc3RyaW5nID0ge307XG4gICAgc2l6ZS5zdHJpbmcuZ2FwID0gc2l6ZS5tb2R1bGUuZnJhbWUudy80MjtcbiAgICBzaXplLnN0cmluZy5nYXBfbWlzc2luZyA9IHNpemUuc3RyaW5nLmdhcCArIHNpemUubW9kdWxlLmZyYW1lLnc7XG4gICAgc2l6ZS5zdHJpbmcuaCA9IChzaXplLm1vZHVsZS5oICogNCkgKyAoc2l6ZS5zdHJpbmcuZ2FwICogMikgKyBzaXplLnN0cmluZy5nYXBfbWlzc2luZztcbiAgICBzaXplLnN0cmluZy53ID0gc2l6ZS5tb2R1bGUuZnJhbWUudyAqIDIuNTtcblxuICAgIHNpemUudGVybWluYWxfZGlhbSA9IDU7XG4gICAgc2l6ZS5mdXNlID0ge307XG4gICAgc2l6ZS5mdXNlLncgPSAxNTtcbiAgICBzaXplLmZ1c2UuaCA9IDQ7XG5cblxuICAgIC8vIEludmVydGVyXG4gICAgc2l6ZS5pbnZlcnRlciA9IHsgdzogMjUwLCBoOiAxNTAgfTtcbiAgICBzaXplLmludmVydGVyLnRleHRfZ2FwID0gMTU7XG4gICAgc2l6ZS5pbnZlcnRlci5zeW1ib2xfdyA9IDUwO1xuICAgIHNpemUuaW52ZXJ0ZXIuc3ltYm9sX2ggPSAyNTtcblxuICAgIGxvYy5pbnZlcnRlciA9IHtcbiAgICAgICAgeDogc2l6ZS5kcmF3aW5nLncvMixcbiAgICAgICAgeTogc2l6ZS5kcmF3aW5nLmgvMyxcbiAgICB9O1xuICAgIGxvYy5pbnZlcnRlci5ib3R0b20gPSBsb2MuaW52ZXJ0ZXIueSArIHNpemUuaW52ZXJ0ZXIuaC8yO1xuICAgIGxvYy5pbnZlcnRlci50b3AgPSBsb2MuaW52ZXJ0ZXIueSAtIHNpemUuaW52ZXJ0ZXIuaC8yO1xuICAgIGxvYy5pbnZlcnRlci5ib3R0b21fcmlnaHQgPSB7XG4gICAgICAgIHg6IGxvYy5pbnZlcnRlci54ICsgc2l6ZS5pbnZlcnRlci53LzIsXG4gICAgICAgIHk6IGxvYy5pbnZlcnRlci55ICsgc2l6ZS5pbnZlcnRlci5oLzIsXG4gICAgfTtcblxuICAgIC8vIGFycmF5XG4gICAgbG9jLmFycmF5ID0ge1xuICAgICAgICB4OiBsb2MuaW52ZXJ0ZXIueCAtIDIwMCxcbiAgICAgICAgeTo2MDBcbiAgICB9O1xuICAgIGxvYy5hcnJheS51cHBlciA9IGxvYy5hcnJheS55IC0gc2l6ZS5zdHJpbmcuaC8yO1xuICAgIGxvYy5hcnJheS5sb3dlciA9IGxvYy5hcnJheS51cHBlciArIHNpemUuc3RyaW5nLmg7XG4gICAgbG9jLmFycmF5LnJpZ2h0ID0gbG9jLmFycmF5LnggLSBzaXplLm1vZHVsZS5mcmFtZS5oKjM7XG5cbiAgICBsb2MuREMgPSBsb2MuYXJyYXk7XG5cbiAgICAvLyBEQyBqYlxuICAgIHNpemUuamJfYm94ID0ge1xuICAgICAgICBoOiAxNTAsXG4gICAgICAgIHc6IDgwLFxuICAgIH07XG4gICAgbG9jLmpiX2JveCA9IHtcbiAgICAgICAgeDogbG9jLmFycmF5LnggKyBzaXplLmpiX2JveC53LzIsXG4gICAgICAgIHk6IGxvYy5hcnJheS55ICsgc2l6ZS5qYl9ib3guaC8xMCxcbiAgICB9O1xuXG4gICAgLy8gREMgZGljb25lY3RcbiAgICBzaXplLmRpc2Nib3ggPSB7XG4gICAgICAgIHc6IDE0MCxcbiAgICAgICAgaDogNTAsXG4gICAgfTtcbiAgICBsb2MuZGlzY2JveCA9IHtcbiAgICAgICAgeDogbG9jLmludmVydGVyLnggLSBzaXplLmludmVydGVyLncvMiArIHNpemUuZGlzY2JveC53LzIsXG4gICAgICAgIHk6IGxvYy5pbnZlcnRlci55ICsgc2l6ZS5pbnZlcnRlci5oLzIgKyBzaXplLmRpc2Nib3guaC8yICsgMTAsXG4gICAgfTtcblxuICAgIC8vIEFDIGRpY29uZWN0XG4gICAgc2l6ZS5BQ19kaXNjID0geyB3OiA4MCwgaDogMTI1IH07XG5cbiAgICBsb2MuQUNfZGlzYyA9IHtcbiAgICAgICAgeDogbG9jLmludmVydGVyLngrMjAwLFxuICAgICAgICB5OiBsb2MuaW52ZXJ0ZXIueSsyNTBcbiAgICB9O1xuICAgIGxvYy5BQ19kaXNjLmJvdHRvbSA9IGxvYy5BQ19kaXNjLnkgKyBzaXplLkFDX2Rpc2MuaC8yO1xuICAgIGxvYy5BQ19kaXNjLnRvcCA9IGxvYy5BQ19kaXNjLnkgLSBzaXplLkFDX2Rpc2MuaC8yO1xuICAgIGxvYy5BQ19kaXNjLmxlZnQgPSBsb2MuQUNfZGlzYy54IC0gc2l6ZS5BQ19kaXNjLncvMjtcbiAgICBsb2MuQUNfZGlzYy5zd2l0Y2hfdG9wID0gbG9jLkFDX2Rpc2MudG9wICsgMTU7XG4gICAgbG9jLkFDX2Rpc2Muc3dpdGNoX2JvdHRvbSA9IGxvYy5BQ19kaXNjLnN3aXRjaF90b3AgKyAzMDtcblxuXG4gICAgLy8gQUMgcGFuZWxcblxuICAgIGxvYy5BQ19sb2FkY2VudGVyID0ge1xuICAgICAgICB4OiBsb2MuaW52ZXJ0ZXIueCszNTAsXG4gICAgICAgIHk6IGxvYy5pbnZlcnRlci55KzEwMFxuICAgIH07XG4gICAgc2l6ZS5BQ19sb2FkY2VudGVyID0geyB3OiAxMjUsIGg6IDMwMCB9O1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLmxlZnQgPSBsb2MuQUNfbG9hZGNlbnRlci54IC0gc2l6ZS5BQ19sb2FkY2VudGVyLncvMjtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci50b3AgPSBsb2MuQUNfbG9hZGNlbnRlci55IC0gc2l6ZS5BQ19sb2FkY2VudGVyLmgvMjtcblxuXG4gICAgc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIgPSB7IHc6IDIwLCBoOiBzaXplLnRlcm1pbmFsX2RpYW0sIH07XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMgPSB7XG4gICAgICAgIGxlZnQ6IGxvYy5BQ19sb2FkY2VudGVyLnggLSAoIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyLncgKiAxLjEgKSxcbiAgICB9O1xuICAgIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VycyA9IHtcbiAgICAgICAgbnVtOiAyMCxcbiAgICAgICAgc3BhY2luZzogc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIuaCArIDEsXG4gICAgfTtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy50b3AgPSBsb2MuQUNfbG9hZGNlbnRlci50b3AgKyBzaXplLkFDX2xvYWRjZW50ZXIuaC81O1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLmJvdHRvbSA9IGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnRvcCArIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5zcGFjaW5nKnNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5udW07XG5cblxuICAgIHNpemUuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyID0geyB3OjUsIGg6NDAgfTtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyID0ge1xuICAgICAgICB4OiBsb2MuQUNfbG9hZGNlbnRlci5sZWZ0ICsgMjAsXG4gICAgICAgIHk6IGxvYy5BQ19sb2FkY2VudGVyLnkgKyBzaXplLkFDX2xvYWRjZW50ZXIuaCowLjNcbiAgICB9O1xuXG4gICAgc2l6ZS5BQ19sb2FkY2VudGVyLmdyb3VuZGJhciA9IHsgdzo0MCwgaDo1IH07XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyID0ge1xuICAgICAgICB4OiBsb2MuQUNfbG9hZGNlbnRlci54ICsgMTAsXG4gICAgICAgIHk6IGxvYy5BQ19sb2FkY2VudGVyLnkgKyBzaXplLkFDX2xvYWRjZW50ZXIuaCowLjQ1XG4gICAgfTtcblxuICAgIGxvYy5BQ19jb25kdWl0ID0ge1xuICAgICAgICB5OiBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy5ib3R0b20gLSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMuc3BhY2luZy8yLFxuICAgIH07XG5cblxuICAgIC8vIHdpcmUgdGFibGVcbiAgICBzaXplLndpcmVfdGFibGUgPSB7fTtcbiAgICBzaXplLndpcmVfdGFibGUudyA9IDIwMDtcbiAgICBzaXplLndpcmVfdGFibGUucm93X2ggPSAxMDtcbiAgICBzaXplLndpcmVfdGFibGUuaCA9ICg1KzMpICogc2l6ZS53aXJlX3RhYmxlLnJvd19oOyAvLyA1IG1heCB3aXJlcywgdXBkYXRlZCBpbiB1cGRhdGVfc3lzdGVtLmpzXG4gICAgbG9jLndpcmVfdGFibGUgPSB7XG4gICAgICAgIHg6IHNpemUuZHJhd2luZy53IC0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94IC0gc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmcqMyAtIHNpemUud2lyZV90YWJsZS53LzIgLSAyNSxcbiAgICAgICAgeTogc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmcqMyArIHNpemUud2lyZV90YWJsZS5oLzIsXG4gICAgfTtcbiAgICBsb2Mud2lyZV90YWJsZS50b3AgPSBsb2Mud2lyZV90YWJsZS55IC0gc2l6ZS53aXJlX3RhYmxlLmgvMjtcbiAgICBsb2Mud2lyZV90YWJsZS5ib3R0b20gPSBsb2Mud2lyZV90YWJsZS55ICsgc2l6ZS53aXJlX3RhYmxlLmgvMjtcblxuXG4gICAgLy8gdm9sdGFnZSBkcm9wIHRhYmxlXG4gICAgc2l6ZS52b2x0X2Ryb3BfdGFibGUgPSB7fTtcbiAgICBzaXplLnZvbHRfZHJvcF90YWJsZS53ID0gMTUwO1xuICAgIHNpemUudm9sdF9kcm9wX3RhYmxlLmggPSAxMDA7XG4gICAgbG9jLnZvbHRfZHJvcF90YWJsZSA9IHt9O1xuICAgIGxvYy52b2x0X2Ryb3BfdGFibGUueCA9IHNpemUuZHJhd2luZy53IC0gc2l6ZS52b2x0X2Ryb3BfdGFibGUudy8yIC0gOTA7XG4gICAgbG9jLnZvbHRfZHJvcF90YWJsZS55ID0gc2l6ZS5kcmF3aW5nLmggLSBzaXplLnZvbHRfZHJvcF90YWJsZS5oLzIgLSAzMDtcblxuXG4gICAgLy8gdm9sdGFnZSBkcm9wIHRhYmxlXG4gICAgc2l6ZS5nZW5lcmFsX25vdGVzID0ge307XG4gICAgc2l6ZS5nZW5lcmFsX25vdGVzLncgPSAxNTA7XG4gICAgc2l6ZS5nZW5lcmFsX25vdGVzLmggPSAxMDA7XG4gICAgbG9jLmdlbmVyYWxfbm90ZXMgPSB7fTtcbiAgICBsb2MuZ2VuZXJhbF9ub3Rlcy54ID0gc2l6ZS5nZW5lcmFsX25vdGVzLncvMiArIDMwO1xuICAgIGxvYy5nZW5lcmFsX25vdGVzLnkgPSBzaXplLmdlbmVyYWxfbm90ZXMuaC8yICsgMzA7XG5cblxuXG5cbiAgICBzZXR0aW5ncy5wYWdlcyA9IHt9O1xuICAgIHNldHRpbmdzLnBhZ2VzLmxldHRlciA9IHtcbiAgICAgICAgdW5pdHM6ICdpbmNoZXMnLFxuICAgICAgICB3OiAxMS4wLFxuICAgICAgICBoOiA4LjUsXG4gICAgfTtcbiAgICBzZXR0aW5ncy5wYWdlID0gc2V0dGluZ3MucGFnZXMubGV0dGVyO1xuXG4gICAgc2V0dGluZ3MucGFnZXMuUERGID0ge1xuICAgICAgICB3OiBzZXR0aW5ncy5wYWdlLncgKiA3MixcbiAgICAgICAgaDogc2V0dGluZ3MucGFnZS5oICogNzIsXG4gICAgfTtcblxuICAgIHNldHRpbmdzLnBhZ2VzLlBERi5zY2FsZSA9IHtcbiAgICAgICAgeDogc2V0dGluZ3MucGFnZXMuUERGLncgLyBzZXR0aW5ncy5kcmF3aW5nLnNpemUuZHJhd2luZy53LFxuICAgICAgICB5OiBzZXR0aW5ncy5wYWdlcy5QREYuaCAvIHNldHRpbmdzLmRyYXdpbmcuc2l6ZS5kcmF3aW5nLmgsXG4gICAgfTtcblxuICAgIGlmKCBzZXR0aW5ncy5wYWdlcy5QREYuc2NhbGUueCA8IHNldHRpbmdzLnBhZ2VzLlBERi5zY2FsZS55ICkge1xuICAgICAgICBzZXR0aW5ncy5wYWdlLnNjYWxlID0gc2V0dGluZ3MucGFnZXMuUERGLnNjYWxlLng7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2V0dGluZ3MucGFnZS5zY2FsZSA9IHNldHRpbmdzLnBhZ2VzLlBERi5zY2FsZS55O1xuICAgIH1cblxuICByZXR1cm4gc2V0dGluZ3M7XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldHRpbmdzX2RyYXdpbmc7XG4iLCJ2YXIgbGF5ZXJfYXR0ciA9IHt9O1xuXG5sYXllcl9hdHRyLmJhc2UgPSB7XG4gICAgJ2ZpbGwnOiAnbm9uZScsXG4gICAgJ3N0cm9rZSc6JyMwMDAwMDAnLFxuICAgICdzdHJva2Utd2lkdGgnOicxcHgnLFxuICAgICdzdHJva2UtbGluZWNhcCc6J2J1dHQnLFxuICAgICdzdHJva2UtbGluZWpvaW4nOidtaXRlcicsXG4gICAgJ3N0cm9rZS1vcGFjaXR5JzoxLFxuXG59O1xubGF5ZXJfYXR0ci5ibG9jayA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuZnJhbWUgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLmZyYW1lLnN0cm9rZSA9ICcjMDAwMDQyJztcbmxheWVyX2F0dHIudGFibGUgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLnRhYmxlLnN0cm9rZSA9ICcjMDAwMDQyJztcblxubGF5ZXJfYXR0ci5EQ19wb3MgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkRDX3Bvcy5zdHJva2UgPSAnI2ZmMDAwMCc7XG5sYXllcl9hdHRyLkRDX25lZyA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuRENfbmVnLnN0cm9rZSA9ICcjMDAwMDAwJztcbmxheWVyX2F0dHIuRENfZ3JvdW5kID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5EQ19ncm91bmQuc3Ryb2tlID0gJyMwMDY2MDAnO1xubGF5ZXJfYXR0ci5tb2R1bGUgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLmJveCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIudGV4dCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIudGV4dC5zdHJva2UgPSAnIzAwMDBmZic7XG5sYXllcl9hdHRyLnRlcm1pbmFsID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5ib3JkZXIgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5cbmxheWVyX2F0dHIuQUNfZ3JvdW5kID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5BQ19ncm91bmQuc3Ryb2tlID0gJyMwMDk5MDAnO1xubGF5ZXJfYXR0ci5BQ19uZXV0cmFsID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5BQ19uZXV0cmFsLnN0cm9rZSA9ICcjOTk5Nzk3JztcbmxheWVyX2F0dHIuQUNfTDEgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkFDX0wxLnN0cm9rZSA9ICcjMDAwMDAwJztcbmxheWVyX2F0dHIuQUNfTDIgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkFDX0wyLnN0cm9rZSA9ICcjRkYwMDAwJztcbmxheWVyX2F0dHIuQUNfTDMgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkFDX0wzLnN0cm9rZSA9ICcjMDAwMEZGJztcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGxheWVyX2F0dHI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBrID0gcmVxdWlyZSgnLi4vbGliL2svay5qcycpO1xudmFyIGYgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucycpO1xuLy92YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xuLy92YXIgZGlzcGxheV9zdmcgPSByZXF1aXJlKCcuL2Rpc3BsYXlfc3ZnJyk7XG5cbnZhciBvYmplY3RfZGVmaW5lZCA9IGYub2JqZWN0X2RlZmluZWQ7XG5cbnZhciB1cGRhdGVfc3lzdGVtID0gZnVuY3Rpb24oc2V0dGluZ3MpIHtcblxuICAgIC8vY29uc29sZS5sb2coJy0tLXNldHRpbmdzLS0tJywgc2V0dGluZ3MpO1xuICAgIHZhciBjb25maWdfb3B0aW9ucyA9IHNldHRpbmdzLmNvbmZpZ19vcHRpb25zO1xuICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmcubG9jO1xuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZy5zaXplO1xuICAgIHZhciBzdGF0ZSA9IHNldHRpbmdzLnN0YXRlO1xuXG4gICAgdmFyIGNhbGN1bGF0ZWQgPSBzZXR0aW5ncy5jYWxjdWxhdGVkO1xuICAgIHZhciBjYWxjdWxhdGVkX2Zvcm11bGFzID0gc2V0dGluZ3MuY2FsY3VsYXRlZF9mb3JtdWxhcztcbiAgICB2YXIgaW5wdXRzID0gc2V0dGluZ3MuaW5wdXRzO1xuICAgIHZhciBpbnB1dF9vcHRpb25zID0gc2V0dGluZ3MuaW5wdXRfb3B0aW9ucztcblxuICAgIHZhciBzZWN0aW9ucyA9IGsub2JqSWRBcnJheShzZXR0aW5ncy5pbnB1dHMpO1xuICAgIC8vY29uc29sZS5sb2coc2VjdGlvbnMpO1xuICAgIHNlY3Rpb25zLmZvckVhY2goZnVuY3Rpb24oc2VjdGlvbk5hbWUsaWQpe1xuICAgICAgICAvL2NvbnNvbGUubG9nKCBzZWN0aW9uTmFtZSwgZi5vYmplY3RfZGVmaW5lZChzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbk5hbWVdKSApO1xuICAgIH0pO1xuXG4gICAgZi5ta19zZXR0aW5ncy5zeXN0ZW0oc2V0dGluZ3MpO1xuXG4gICAgZm9yKCB2YXIgc2VjdGlvbiBpbiBzZXR0aW5ncy5zeXN0ZW1fZm9ybXVsYXMgKXtcblxuXG4gICAgfVxuXG4gICAgLy92YXIgc2hvd19kZWZhdWx0cyA9IGZhbHNlO1xuICAgIC8vLypcbiAgICBpZiggdHJ1ZSAmJiBzdGF0ZS52ZXJzaW9uX3N0cmluZyA9PT0gJ0Rldicpe1xuICAgICAgICAvL3Nob3dfZGVmYXVsdHMgPSB0cnVlO1xuICAgICAgICBjb25zb2xlLmxvZygnRGV2IG1vZGUgLSBkZWZhdWx0cyBvbicpO1xuXG4gICAgICAgIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyA9IHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyB8fCA0O1xuICAgICAgICBzeXN0ZW0uYXJyYXkubnVtX21vZHVsZXMgPSBzeXN0ZW0uYXJyYXkubnVtX21vZHVsZXMgfHwgNjtcbiAgICAgICAgc3lzdGVtLkRDLmhvbWVfcnVuX2xlbmd0aCA9IHN5c3RlbS5EQy5ob21lX3J1bl9sZW5ndGggfHwgNTA7XG5cbiAgICAgICAgc2V0dGluZ3Muc3lzdGVtLkRDLkFXRyA9IHNldHRpbmdzLnN5c3RlbS5EQy5BV0cgfHwgc2V0dGluZ3MuaW5wdXRfb3B0aW9ucy5EQy5BV0dbMTBdO1xuXG4gICAgICAgIGlmKCBzdGF0ZS5kYXRhYmFzZV9sb2FkZWQgKXtcbiAgICAgICAgICAgIGlucHV0cy5pbnZlcnRlci5tYWtlID0gc3lzdGVtLmludmVydGVyLm1ha2UgPSBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSB8fFxuICAgICAgICAgICAgICAgICdTTUEnO1xuICAgICAgICAgICAgaW5wdXRzLmludmVydGVyLm1vZGVsID0gc3lzdGVtLmludmVydGVyLm1vZGVsID0gc3lzdGVtLmludmVydGVyLm1vZGVsIHx8XG4gICAgICAgICAgICAgICAgJ1NJMzAwMCc7XG5cbiAgICAgICAgICAgIGlucHV0cy5tb2R1bGUubWFrZSA9IHN5c3RlbS5tb2R1bGUubWFrZSA9IHN5c3RlbS5tb2R1bGUubWFrZSB8fFxuICAgICAgICAgICAgICAgIGYub2JqX25hbWVzKCBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXMgKVswXTtcbiAgICAgICAgICAgIC8vaWYoIHN5c3RlbS5tb2R1bGUubWFrZSkgc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlTW9kZWxBcnJheSA9IGsub2JqSWRBcnJheShzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVzW3N5c3RlbS5tb2R1bGUubWFrZV0pO1xuICAgICAgICAgICAgaW5wdXRzLm1vZHVsZS5tb2RlbCA9IHN5c3RlbS5tb2R1bGUubW9kZWwgPSBzeXN0ZW0ubW9kdWxlLm1vZGVsIHx8XG4gICAgICAgICAgICAgICAgZi5vYmpfbmFtZXMoIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tzeXN0ZW0ubW9kdWxlLm1ha2VdIClbMF07XG5cblxuICAgICAgICAgICAgaW5wdXRzLm1vZHVsZS5tb2RlbCA9IHN5c3RlbS5tb2R1bGUubW9kZWwgPSBzeXN0ZW0ubW9kdWxlLm1vZGVsIHx8XG4gICAgICAgICAgICAgICAgZi5vYmpfbmFtZXMoIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tzeXN0ZW0ubW9kdWxlLm1ha2VdIClbMF07XG5cbiAgICAgICAgICAgIGlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzID0gc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXMgPSBzeXN0ZW0uQUMubG9hZGNlbnRlcl90eXBlcyB8fFxuICAgICAgICAgICAgLy8gICAgZi5vYmpfbmFtZXMoaW5wdXRfb3B0aW9ucy5BQy5sb2FkY2VudGVyX3R5cGVzKVswXTtcbiAgICAgICAgICAgICAgICAnNDgwLzI3N1YnO1xuXG5cbiAgICAgICAgICAgIGlucHV0cy5BQy50eXBlID0gc3lzdGVtLkFDLnR5cGUgPSBzeXN0ZW0uQUMudHlwZSB8fCAnNDgwViBXeWUnO1xuICAgICAgICAgICAgLy9pbnB1dHMuQUMudHlwZSA9IHN5c3RlbS5BQy50eXBlID0gc3lzdGVtLkFDLnR5cGUgfHxcbiAgICAgICAgICAgIC8vICAgIGlucHV0X29wdGlvbnMuQUMubG9hZGNlbnRlcl90eXBlc1tzeXN0ZW0uQUMubG9hZGNlbnRlcl90eXBlc11bMF07XG5cbiAgICAgICAgICAgIGlucHV0cy5BQy5kaXN0YW5jZV90b19sb2FkY2VudGVyID0gc3lzdGVtLkFDLmRpc3RhbmNlX3RvX2xvYWRjZW50ZXIgPSBzeXN0ZW0uQUMuZGlzdGFuY2VfdG9fbG9hZGNlbnRlciB8fFxuICAgICAgICAgICAgICAgIGlucHV0X29wdGlvbnMuQUMuZGlzdGFuY2VfdG9fbG9hZGNlbnRlclszXTtcblxuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgY29uZmlnX29wdGlvbnMuRENfaG9tZXJ1bl9BV0dfb3B0aW9ucyA9IGsub2JqSWRBcnJheSggY29uZmlnX29wdGlvbnMuTkVDX3RhYmxlc1snQ2ggOSBUYWJsZSA4IENvbmR1Y3RvciBQcm9wZXJ0aWVzJ10gKTtcbiAgICAgICAgICAgIHN5c3RlbS5hcnJheS5ob21lcnVuLkFXRyA9IHN5c3RlbS5hcnJheS5ob21lcnVuLkFXRyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWdfb3B0aW9ucy5EQ19ob21lcnVuX0FXR19vcHRpb25zW2NvbmZpZ19vcHRpb25zLkRDX2hvbWVydW5fQVdHX29wdGlvbnMubGVuZ3RoLTFdO1xuXG4gICAgICAgICAgICBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlck1ha2VBcnJheSA9IGsub2JqSWRBcnJheShzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnMpO1xuICAgICAgICAgICAgc3lzdGVtLmludmVydGVyLm1ha2UgPSBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSB8fCBPYmplY3Qua2V5cyggc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzIClbMF07XG4gICAgICAgICAgICBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlck1vZGVsQXJyYXkgPSBrLm9iaklkQXJyYXkoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzW3N5c3RlbS5pbnZlcnRlci5tYWtlXSk7XG5cbiAgICAgICAgICAgIHN5c3RlbS5BQ19sb2FkY2VudGVyX3R5cGUgPSBzeXN0ZW0uQUNfbG9hZGNlbnRlcl90eXBlIHx8IGNvbmZpZ19vcHRpb25zLkFDX2xvYWRjZW50ZXJfdHlwZV9vcHRpb25zWzBdO1xuICAgICAgICAgICAgLy8qL1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vKi9cblxuICAgIC8vY29uc29sZS5sb2coXCJ1cGRhdGVfc3lzdGVtXCIpO1xuICAgIC8vY29uc29sZS5sb2coc3lzdGVtLm1vZHVsZS5tYWtlKTtcblxuICAgIGlucHV0X29wdGlvbnMubW9kdWxlLm1ha2UgPSBrLm9ial9uYW1lcyhzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXMpO1xuICAgIGlmKCBzeXN0ZW0ubW9kdWxlLm1ha2UgKSB7XG4gICAgICAgIGlucHV0X29wdGlvbnMubW9kdWxlLm1vZGVsICA9IGsub2JqX25hbWVzKCBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbc3lzdGVtLm1vZHVsZS5tYWtlXSApO1xuICAgIH1cblxuICAgIGlmKCBzeXN0ZW0ubW9kdWxlLm1vZGVsICkge1xuICAgICAgICBzeXN0ZW0ubW9kdWxlLnNwZWNzID0gc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzW3N5c3RlbS5tb2R1bGUubWFrZV1bc3lzdGVtLm1vZHVsZS5tb2RlbF07XG4gICAgfVxuXG4gICAgaW5wdXRfb3B0aW9ucy5pbnZlcnRlci5tYWtlID0gay5vYmpfbmFtZXMoc2V0dGluZ3MuY29tcG9uZW50cy5pbnZlcnRlcnMpO1xuICAgIGlmKCBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSApIHtcbiAgICAgICAgaW5wdXRfb3B0aW9ucy5pbnZlcnRlci5tb2RlbCA9IGsub2JqX25hbWVzKCBzZXR0aW5ncy5jb21wb25lbnRzLmludmVydGVyc1tzeXN0ZW0uaW52ZXJ0ZXIubWFrZV0gKTtcbiAgICB9XG5cbiAgICAvL2lucHV0X29wdGlvbnMuQUMubG9hZGNlbnRlcl90eXBlID0gc2V0dGluZ3MuZi5vYmpfbmFtZXMoaW5wdXRfb3B0aW9ucy5BQy5sb2FkY2VudGVyX3R5cGVzKTtcbiAgICBpZiggc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXMgKSB7XG4gICAgICAgIHZhciBsb2FkY2VudGVyX3R5cGUgPSBzeXN0ZW0uQUMubG9hZGNlbnRlcl90eXBlcztcbiAgICAgICAgdmFyIEFDX29wdGlvbnMgPSBpbnB1dF9vcHRpb25zLkFDLmxvYWRjZW50ZXJfdHlwZXNbbG9hZGNlbnRlcl90eXBlXTtcbiAgICAgICAgaW5wdXRfb3B0aW9ucy5BQy50eXBlID0gQUNfb3B0aW9ucztcbiAgICAgICAgLy9pX29wdGlvbnMuQUMudHlwZXNbbG9hZGNlbnRlcl90eXBlXTtcblxuICAgICAgICAvL2lucHV0X29wdGlvbnMuQUNbJ3R5cGUnXSA9IGsub2JqX25hbWVzKCBzZXR0aW5ncy5pX29wdGlvbnMuQUMudHlwZSApO1xuICAgIH1cblxuICAgIGlmKCBzeXN0ZW0uQUMudHlwZSApIHtcbiAgICAgICAgc3lzdGVtLkFDLmNvbmR1Y3RvcnMgPSBzZXR0aW5ncy5pX29wdGlvbnMuQUMudHlwZXNbc3lzdGVtLkFDLnR5cGVdO1xuICAgICAgICBzeXN0ZW0uQUMubnVtX2NvbmR1Y3RvcnMgPSBzeXN0ZW0uQUMuY29uZHVjdG9ycy5sZW5ndGg7XG5cbiAgICB9XG5cbiAgICBzaXplLndpcmVfb2Zmc2V0Lm1heCA9IHNpemUud2lyZV9vZmZzZXQubWluICsgc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzICogc2l6ZS53aXJlX29mZnNldC5iYXNlO1xuICAgIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kID0gc2l6ZS53aXJlX29mZnNldC5tYXggKyBzaXplLndpcmVfb2Zmc2V0LmJhc2UqMTtcbiAgICBsb2MuYXJyYXkubGVmdCA9IGxvYy5hcnJheS5yaWdodCAtICggc2l6ZS5zdHJpbmcudyAqIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyApIC0gKCBzaXplLm1vZHVsZS5mcmFtZS53KjMvNCApIDtcblxuXG4gICAgc2V0dGluZ3MuZHJhd2luZy5zaXplLndpcmVfdGFibGUuaCA9IChzeXN0ZW0uQUMubnVtX2NvbmR1Y3RvcnMrMykgKiBzZXR0aW5ncy5kcmF3aW5nLnNpemUud2lyZV90YWJsZS5yb3dfaDtcblxuICAgIC8qXG4gICAgZm9yKCB2YXIgc2VjdGlvbl9uYW1lIGluIGlucHV0X29wdGlvbnMgKXtcbiAgICAgICAgZm9yKCB2YXIgaW5wdXRfbmFtZSBpbiBzZXR0aW5ncy5pbnB1dF9vcHRpb25zW3NlY3Rpb25fbmFtZV0gKXtcbiAgICAgICAgICAgIGlmKCB0eXBlb2Ygc2V0dGluZ3MuaW5wdXRfb3B0aW9uc1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdID09PSAnc3RyaW5nJyApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBzZXR0aW5ncy5pbnB1dF9vcHRpb25zW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0gKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggay5vYmpfbmFtZXMoXG4gICAgICAgICAgICAgICAgICAgIGYuZ2V0X3JlZihzZXR0aW5ncy5pbnB1dF9vcHRpb25zW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0sIHNldHRpbmdzKVxuICAgICAgICAgICAgICAgICkpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHRvX2V2YWwgPSBcImsub2JqX25hbWVzKHNldHR0aW5ncy5cIiArIHNldHRpbmdzLmlucHV0X29wdGlvbnNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSArIFwiKVwiO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRvX2V2YWwpO1xuICAgICAgICAgICAgICAgIC8vIGV2YWwgaXMgb25seSBiZWluZyB1c2VkIG9uIHN0cmluZ3MgZGVmaW5lZCBpbiB0aGUgc2V0dGluZ3MuanNvbiBmaWxlIHRoYXQgaXMgYnVpbHQgaW50byB0aGUgYXBwbGljYXRpb25cbiAgICAgICAgICAgICAgICAvKiBqc2hpbnQgZXZpbDp0cnVlIC8vKi9cbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBMb29rIGZvciBhbHRlcm5hdGl2ZSBzb2x1dGlvbnMgdGhhdCBpcyBtb3JlIHVuaXZlcnNhbC5cbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vcGVyZmVjdGlvbmtpbGxzLmNvbS9nbG9iYWwtZXZhbC13aGF0LWFyZS10aGUtb3B0aW9ucy8jaW5kaXJlY3RfZXZhbF9jYWxsX2V4YW1wbGVzXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICB2YXIgZSA9IGV2YWw7IC8vIFRoaXMgYWxsb3dzIGV2YWwgdG8gYmUgY2FsbGVkIGluZGlyZWN0bHksIHRyaWdnZXJpbmcgYSBnbG9iYWwgY2FsbCBpbiBtb2Rlcm4gYnJvd3NlcnMuXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuaW5wdXRfb3B0aW9uc1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdID0gZSh0b19ldmFsKTtcbiAgICAgICAgICAgICAgICAvKiBqc2hpbnQgZXZpbDpmYWxzZSAvLyovXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vKi9cblxufTtcblxuLypcblxuICAgIGlmKCBzdGF0ZS5kYXRhX2xvYWRlZCApIHtcblxuICAgICAgICAvL3N5c3RlbS5EQy5udW1fc3RyaW5ncyA9IHNldHRpbmdzLnN5c3RlbS5udW1fc3RyaW5ncztcbiAgICAgICAgLy9zeXN0ZW0uREMubnVtX21vZHVsZSA9IHNldHRpbmdzLnN5c3RlbS5udW1fbW9kdWxlO1xuICAgICAgICAvL2lmKCBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVzICE9PSB1bmRlZmluZWQgKXtcblxuICAgICAgICB2YXIgb2xkX2FjdGl2ZV9zZWN0aW9uID0gc3RhdGUuYWN0aXZlX3NlY3Rpb247XG5cbiAgICAgICAgLy8gTW9kdWxlc1xuICAgICAgICBpZiggdHJ1ZSApe1xuICAgICAgICAgICAgZi5vYmplY3RfZGVmaW5lZChzeXN0ZW0uREMubW9kdWxlKTtcblxuICAgICAgICAgICAgc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlTWFrZUFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZXMpO1xuICAgICAgICAgICAgaWYoIHN5c3RlbS5EQy5tb2R1bGUubWFrZSApIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZU1vZGVsQXJyYXkgPSBrLm9iaklkQXJyYXkoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlc1tzeXN0ZW0uREMubW9kdWxlLm1ha2VdKTtcbiAgICAgICAgICAgIGlmKCBzeXN0ZW0uREMubW9kdWxlLm1vZGVsICkgc3lzdGVtLkRDLm1vZHVsZS5zcGVjcyA9IHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZXNbc3lzdGVtLkRDLm1vZHVsZS5tYWtlXVtzeXN0ZW0uREMubW9kdWxlLm1vZGVsXTtcblxuICAgICAgICAgICAgc3RhdGUuYWN0aXZlX3NlY3Rpb24gPSAnYXJyYXknO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXJyYXlcbiAgICAgICAgaWYoIG9iamVjdF9kZWZpbmVkKGlucHV0Lm1vZHVsZSkgKSB7XG4gICAgICAgICAgICAvL3N5c3RlbS5tb2R1bGUgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVzW3NldHRpbmdzLmYubW9kdWxlXTtcbiAgICAgICAgICAgIGlmKCBzeXN0ZW0uREMubW9kdWxlLnNwZWNzICl7XG4gICAgICAgICAgICAgICAgc3lzdGVtLkRDLmFycmF5ID0ge307XG4gICAgICAgICAgICAgICAgc3lzdGVtLkRDLmFycmF5LklzYyA9IHN5c3RlbS5EQy5tb2R1bGUuc3BlY3MuSXNjICogc3lzdGVtLkRDLm51bV9zdHJpbmdzO1xuICAgICAgICAgICAgICAgIHN5c3RlbS5EQy5hcnJheS5Wb2MgPSBzeXN0ZW0uREMubW9kdWxlLnNwZWNzLlZvYyAqIHN5c3RlbS5EQy5zdHJpbmdfbW9kdWxlcztcbiAgICAgICAgICAgICAgICBzeXN0ZW0uREMuYXJyYXkuSW1wID0gc3lzdGVtLkRDLm1vZHVsZS5zcGVjcy5JbXAgKiBzeXN0ZW0uREMubnVtX3N0cmluZ3M7XG4gICAgICAgICAgICAgICAgc3lzdGVtLkRDLmFycmF5LlZtcCA9IHN5c3RlbS5EQy5tb2R1bGUuc3BlY3MuVm1wICogc3lzdGVtLkRDLnN0cmluZ19tb2R1bGVzO1xuICAgICAgICAgICAgICAgIHN5c3RlbS5EQy5hcnJheS5QbXAgPSBzeXN0ZW0uREMuYXJyYXkuVm1wICogc3lzdGVtLkRDLmFycmF5LkltcDtcblxuICAgICAgICAgICAgICAgIHN0YXRlLmFjdGl2ZV9zZWN0aW9uID0gJ0RDJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRENcbiAgICAgICAgICAgIGlmKCBvYmplY3RfZGVmaW5lZChpbnB1dHMuREMpICkge1xuXG4gICAgICAgICAgICAgICAgc3lzdGVtLkRDLmhvbWVydW4ucmVzaXN0YW5jZSA9IGNvbmZpZ19vcHRpb25zLk5FQ190YWJsZXNbJ0NoIDkgVGFibGUgOCBDb25kdWN0b3IgUHJvcGVydGllcyddW3N5c3RlbS5EQy5ob21lcnVuLkFXR107XG4gICAgICAgICAgICAgICAgc3RhdGUuc2VjdGlvbnMuaW52ZXJ0ZXIucmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHN0YXRlLmFjdGl2ZV9zZWN0aW9uID0gJ2ludmVydGVyJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSW52ZXJ0ZXJcbiAgICAgICAgICAgIGlmKCBvYmplY3RfZGVmaW5lZChpbnB1dHMuREMpICkge1xuXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJNYWtlQXJyYXkgPSBrLm9iaklkQXJyYXkoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzKTtcbiAgICAgICAgICAgICAgICBpZiggc3lzdGVtLmludmVydGVyLm1ha2UgKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyTW9kZWxBcnJheSA9IGsub2JqSWRBcnJheShzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnNbc3lzdGVtLmludmVydGVyLm1ha2VdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoIHN5c3RlbS5pbnZlcnRlci5tb2RlbCApIHN5c3RlbS5pbnZlcnRlci5zcGVjcyA9IHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyc1tzeXN0ZW0uaW52ZXJ0ZXIubWFrZV1bc3lzdGVtLmludmVydGVyLm1vZGVsXTtcblxuICAgICAgICAgICAgICAgIHN0YXRlLmFjdGl2ZV9zZWN0aW9uID0gJ0FDJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQUNcbiAgICAgICAgICAgIGlmKCBvYmplY3RfZGVmaW5lZChpbnB1dHMuaW52ZXJ0ZXIpICkge1xuICAgICAgICAgICAgICAgIGlmKCBzeXN0ZW0uQUNfbG9hZGNlbnRlcl90eXBlICkge1xuXG4gICAgICAgICAgICAgICAgICAgIHN5c3RlbS5BQ190eXBlc19hdmFpbGlibGUgPSBjb25maWdfb3B0aW9ucy5BQ19sb2FkY2VudGVyX3R5cGVzW3N5c3RlbS5BQ19sb2FkY2VudGVyX3R5cGVdO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ19vcHRpb25zLkFDX3R5cGVfb3B0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbiggZWxlbSwgaWQgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCAhIChlbGVtIGluIHN5c3RlbS5BQ190eXBlc19hdmFpbGlibGUpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ19vcHRpb25zLkFDX3R5cGVfb3B0aW9ucy5zcGxpY2UoaWQsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vc3lzdGVtLkFDLnR5cGUgPSBzZXR0aW5ncy5zeXN0ZW0uQUNfdHlwZTtcbiAgICAgICAgICAgICAgICAgICAgc3lzdGVtLkFDX2NvbmR1Y3RvcnMgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5BQ190eXBlc1tzeXN0ZW0uQUNfdHlwZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGlmKCBvYmplY3RfZGVmaW5lZChpbnB1dHMuQUMpICkge1xuICAgICAgICAgICAgICAgIHN0YXRlLmFjdGl2ZV9zZWN0aW9uID0gb2xkX2FjdGl2ZV9zZWN0aW9uO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzaXplLndpcmVfb2Zmc2V0Lm1heCA9IHNpemUud2lyZV9vZmZzZXQubWluICsgc3lzdGVtLkRDLm51bV9zdHJpbmdzICogc2l6ZS53aXJlX29mZnNldC5iYXNlO1xuICAgICAgICAgICAgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgPSBzaXplLndpcmVfb2Zmc2V0Lm1heCArIHNpemUud2lyZV9vZmZzZXQuYmFzZSoxO1xuXG4gICAgICAgICAgICBsb2MuYXJyYXkubGVmdCA9IGxvYy5hcnJheS5yaWdodCAtICggc2l6ZS5zdHJpbmcudyAqIHN5c3RlbS5EQy5udW1fc3RyaW5ncyApIC0gKCBzaXplLm1vZHVsZS5mcmFtZS53KjMvNCApIDtcblxuICAgICAgICAgICAgLy9yZXR1cm4gc2V0dGluZ3M7XG5cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8vKi9cblxubW9kdWxlLmV4cG9ydHMgPSB1cGRhdGVfc3lzdGVtO1xuIiwiZSA9IHt9O1xuZS5pX29wdGlvbnMgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgc2V0dGluZ3MuaV9vcHRpb25zID0gc2V0dGluZ3MuaV9vcHRpb25zIHx8IHt9O1xuICAgIHRyeSB7IHNldHRpbmdzLmlfb3B0aW9ucy5BQyA9IHNldHRpbmdzLmlfb3B0aW9ucy5BQyB8fCB7fTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaV9vcHRpb25zLkFDLnR5cGVzID0gc2V0dGluZ3MuaV9vcHRpb25zLkFDLnR5cGVzIHx8IHt9O31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5pX29wdGlvbnMuQUMudHlwZXNbXCIxMjBWXCJdID0gW1wiZ3JvdW5kXCIsXCJuZXV0cmFsXCIsXCJMMVwiXTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaV9vcHRpb25zLkFDLnR5cGVzW1wiMjQwVlwiXSA9IFtcImdyb3VuZFwiLFwibmV1dHJhbFwiLFwiTDFcIixcIkwyXCJdO31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5pX29wdGlvbnMuQUMudHlwZXNbXCIyMDhWXCJdID0gW1wiZ3JvdW5kXCIsXCJuZXV0cmFsXCIsXCJMMVwiLFwiTDJcIl07fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLmlfb3B0aW9ucy5BQy50eXBlc1tcIjI3N1ZcIl0gPSBbXCJncm91bmRcIixcIm5ldXRyYWxcIixcIkwxXCJdO31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5pX29wdGlvbnMuQUMudHlwZXNbXCI0ODBWIFd5ZVwiXSA9IFtcImdyb3VuZFwiLFwibmV1dHJhbFwiLFwiTDFcIixcIkwyXCIsXCJMM1wiXTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaV9vcHRpb25zLkFDLnR5cGVzW1wiNDgwViBEZWx0YVwiXSA9IFtcImdyb3VuZFwiLFwiTDFcIixcIkwyXCIsXCJMM1wiXTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgcmV0dXJuIHNldHRpbmdzO1xufTtcbmUuaW5wdXRzID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIHNldHRpbmdzLmlucHV0cyA9IHNldHRpbmdzLmlucHV0cyB8fCB7fTtcbiAgICB0cnkgeyBzZXR0aW5ncy5pbnB1dHMubW9kdWxlID0gc2V0dGluZ3MuaW5wdXRzLm1vZHVsZSB8fCB7fTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5tYWtlID0gc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5tYWtlIHx8IG51bGw7fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLmlucHV0cy5tb2R1bGUubW9kZWwgPSBzZXR0aW5ncy5pbnB1dHMubW9kdWxlLm1vZGVsIHx8IG51bGw7fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLmlucHV0cy5hcnJheSA9IHNldHRpbmdzLmlucHV0cy5hcnJheSB8fCB7fTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaW5wdXRzLmFycmF5Lm51bV9tb2R1bGVzID0gWzEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDE4LDE5LDIwXTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaW5wdXRzLmFycmF5Lm51bV9zdHJpbmdzID0gWzEsMiwzLDQsNSw2XTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaW5wdXRzLkRDID0gc2V0dGluZ3MuaW5wdXRzLkRDIHx8IHt9O31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5pbnB1dHMuREMuQVdHID0gc2V0dGluZ3MuaW5wdXRzLkRDLkFXRyB8fCBudWxsO31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5pbnB1dHMuREMuaG9tZV9ydW5fbGVuZ3RoID0gWzI1LDUwLDc1LDEwMCwxMjUsMTUwXTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaW5wdXRzLkRDLndpcmVfc2l6ZSA9IHNldHRpbmdzLmlucHV0X29wdGlvbnMuREMuQVdHO31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5pbnB1dHMuaW52ZXJ0ZXIgPSBzZXR0aW5ncy5pbnB1dHMuaW52ZXJ0ZXIgfHwge307fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLmlucHV0cy5pbnZlcnRlci5tYWtlID0gc2V0dGluZ3MuaW5wdXRzLmludmVydGVyLm1ha2UgfHwgbnVsbDt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaW5wdXRzLmludmVydGVyLm1vZGVsID0gc2V0dGluZ3MuaW5wdXRzLmludmVydGVyLm1vZGVsIHx8IG51bGw7fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLmlucHV0cy5BQyA9IHNldHRpbmdzLmlucHV0cy5BQyB8fCB7fTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXMgPSBzZXR0aW5ncy5pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlcyB8fCB7fTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbXCIyNDBWXCJdID0gW1wiMjQwVlwiLFwiMTIwVlwiXTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbXCIyMDgvMTIwVlwiXSA9IFtcIjIwOFZcIixcIjEyMFZcIl07fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLmlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzW1wiNDgwLzI3N1ZcIl0gPSBbXCI0ODBWIFd5ZVwiLFwiNDgwViBEZWx0YVwiLFwiMjc3VlwiXTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaW5wdXRzLkFDLnR5cGUgPSBzZXR0aW5ncy5pbnB1dHMuQUMudHlwZSB8fCBudWxsO31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5pbnB1dHMuQUMuZGlzdGFuY2VfdG9fbG9hZGNlbnRlciA9IFszLDUsMTAsMTUsMjAsMzBdO31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICByZXR1cm4gc2V0dGluZ3M7XG59O1xuZS5zeXN0ZW0gPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgc2V0dGluZ3Muc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtIHx8IHt9O1xuICAgIHRyeSB7IHNldHRpbmdzLnN5c3RlbS5tb2R1bGUgPSBzZXR0aW5ncy5zeXN0ZW0ubW9kdWxlIHx8IHt9O31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5zeXN0ZW0ubW9kdWxlLnNwZWNzID0gc2V0dGluZ3Muc3lzdGVtLm1vZHVsZS5zcGVjcyB8fCBudWxsO31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5zeXN0ZW0uYXJyYXkgPSBzZXR0aW5ncy5zeXN0ZW0uYXJyYXkgfHwge307fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLnN5c3RlbS5hcnJheS5pc2MgPSBzeXN0ZW0ubW9kdWxlLmlzYyAqIGlucHV0cy5hcnJheS5udW1fc3RyaW5nczt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3Muc3lzdGVtLmFycmF5LnZvYyA9IHN5c3RlbS5tb2R1bGUudm9jICogaW5wdXRzLmFycmF5Lm51bV9tb2R1bGU7fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLnN5c3RlbS5hcnJheS5pbXAgPSBzeXN0ZW0ubW9kdWxlLmltcCAqIGlucHV0cy5hcnJheS5udW1fbW9kdWxlO31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5zeXN0ZW0uYXJyYXkudm1wID0gc3lzdGVtLm1vZHVsZS52bXAgKiBpbnB1dHMuYXJyYXkubnVtX3N0cmluZ3M7fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLnN5c3RlbS5hcnJheS5wbXAgPSBzeXN0ZW0uYXJyYXkudm1wICAqIHN5c3RlbS5hcnJheS5hcnJheS5pbXA7fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLnN5c3RlbS5EQyA9IHNldHRpbmdzLnN5c3RlbS5EQyB8fCB7fTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3Muc3lzdGVtLmludmVydGVyID0gc2V0dGluZ3Muc3lzdGVtLmludmVydGVyIHx8IHt9O31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5zeXN0ZW0uQUMgPSBzZXR0aW5ncy5zeXN0ZW0uQUMgfHwge307fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLnN5c3RlbS5BQy5BV0cgPSBzZXR0aW5ncy5zeXN0ZW0uQUMuQVdHIHx8IG51bGw7fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLnN5c3RlbS5BQy5udW1fY29uZHVjdG9ycyA9IHNldHRpbmdzLnN5c3RlbS5BQy5udW1fY29uZHVjdG9ycyB8fCBudWxsO31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICByZXR1cm4gc2V0dGluZ3M7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBlOyIsIm1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPW1vZHVsZS5leHBvcnRzPXtcblxuICAgIFwiTkVDIDI1MC4xMjJfaGVhZGVyXCI6IFtcIkFtcFwiLFwiQVdHXCJdLFxuICAgIFwiTkVDIDI1MC4xMjJcIjoge1xuICAgICAgICBcIjE1XCI6XCIxNFwiLFxuICAgICAgICBcIjIwXCI6XCIxMlwiLFxuICAgICAgICBcIjMwXCI6XCIxMFwiLFxuICAgICAgICBcIjQwXCI6XCIxMFwiLFxuICAgICAgICBcIjYwXCI6XCIxMFwiLFxuICAgICAgICBcIjEwMFwiOlwiOFwiLFxuICAgICAgICBcIjIwMFwiOlwiNlwiLFxuICAgICAgICBcIjMwMFwiOlwiNFwiLFxuICAgICAgICBcIjQwMFwiOlwiM1wiLFxuICAgICAgICBcIjUwMFwiOlwiMlwiLFxuICAgICAgICBcIjYwMFwiOlwiMVwiLFxuICAgICAgICBcIjgwMFwiOlwiMS8wXCIsXG4gICAgICAgIFwiMTAwMFwiOlwiMi8wXCIsXG4gICAgICAgIFwiMTIwMFwiOlwiMy8wXCIsXG4gICAgICAgIFwiMTYwMFwiOlwiNC8wXCIsXG4gICAgICAgIFwiMjAwMFwiOlwiMjUwXCIsXG4gICAgICAgIFwiMjUwMFwiOlwiMzUwXCIsXG4gICAgICAgIFwiMzAwMFwiOlwiNDAwXCIsXG4gICAgICAgIFwiNDAwMFwiOlwiNTAwXCIsXG4gICAgICAgIFwiNTAwMFwiOlwiNzAwXCIsXG4gICAgICAgIFwiNjAwMFwiOlwiODAwXCIsXG4gICAgfSxcblxuICAgIFwiTkVDIFQ2OTAuN19oZWFkZXJcIjogW1wiQW1iaWVudCBUZW1wZXJhdHVyZSAoQylcIiwgXCJDb3JyZWN0aW9uIEZhY3RvclwiXSxcbiAgICBcIk5FQyBUNjkwLjdcIjoge1xuICAgICAgICBcIjI1IHRvIDIwXCI6XCIxLjAyXCIsXG4gICAgICAgIFwiMTkgdG8gMTVcIjpcIjEuMDRcIixcbiAgICAgICAgXCIxNSB0byAxMFwiOlwiMS4wNlwiLFxuICAgICAgICBcIjkgdG8gNVwiOlwiMS4wOFwiLFxuICAgICAgICBcIjQgdG8gMFwiOlwiMS4xMFwiLFxuICAgICAgICBcIi0xIHRvIC01XCI6XCIxLjEyXCIsXG4gICAgICAgIFwiLTYgdG8gLTEwXCI6XCIxLjE0XCIsXG4gICAgICAgIFwiLTExIHRvIC0xNVwiOlwiMS4xNlwiLFxuICAgICAgICBcIi0xNiB0byAtMjBcIjpcIjEuMThcIixcbiAgICAgICAgXCItMjEgdG8gLTI1XCI6XCIxLjIwXCIsXG4gICAgICAgIFwiLTI2IHRvIC0zMFwiOlwiMS4yMVwiLFxuICAgICAgICBcIi0zMSB0byAtMzVcIjpcIjEuMjNcIixcbiAgICAgICAgXCItMzYgdG8gLTQwXCI6XCIxLjI1XCIsXG4gICAgfSxcblxuICAgIFwiQ2ggOSBUYWJsZSA4IENvbmR1Y3RvciBQcm9wZXJ0aWVzX2hlYWRlclwiOiBbXCJTaXplXCIsXCJvaG0va2Z0XCJdLFxuICAgIFwiQ2ggOSBUYWJsZSA4IENvbmR1Y3RvciBQcm9wZXJ0aWVzXCI6IHtcbiAgICAgICAgXCIjMDFcIjpcIiAwLjE1NFwiLFxuICAgICAgICBcIiMwMS8wXCI6XCIwLjEyMlwiLFxuICAgICAgICBcIiMwMlwiOlwiMC4xOTRcIixcbiAgICAgICAgXCIjMDIvMFwiOlwiMC4wOTY3XCIsXG4gICAgICAgIFwiIzAzXCI6XCIwLjI0NVwiLFxuICAgICAgICBcIiMwMy8wXCI6XCIwLjA3NjZcIixcbiAgICAgICAgXCIjMDRcIjpcIjAuMzA4XCIsXG4gICAgICAgIFwiIzA0LzBcIjpcIjAuMDYwOFwiLFxuICAgICAgICBcIiMwNlwiOlwiMC40OTFcIixcbiAgICAgICAgXCIjMDhcIjpcIjAuNzc4XCIsXG4gICAgICAgIFwiIzEwXCI6XCIxLjI0XCIsXG4gICAgICAgIFwiIzEyXCI6XCIxLjk4XCIsXG4gICAgICAgIFwiIzE0XCI6XCIzLjE0XCIsXG4gICAgfVxufVxuIiwiLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIFRoaXMgaXMgdGhlIGsgamF2YXNjcmlwdCBsaWJyYXJ5XHJcbi8vIGEgY29sbGVjdGlvbiBvZiBmdW5jdGlvbnMgdXNlZCBieSBrc2hvd2FsdGVyXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxudmFyIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG52YXIgJCA9IHJlcXVpcmUoJy4va19ET00uanMnKTtcclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gTWlzYy4gdmFyaWFibGVzICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLy8gbG9nIHNob3J0Y3V0XHJcbnZhciBsb2dPYmogPSBmdW5jdGlvbihvYmope1xyXG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkob2JqKSlcclxufVxyXG52YXIgbG9nT2JqRnVsbCA9IGZ1bmN0aW9uKG9iail7XHJcbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDQpKVxyXG59XHJcblxyXG4vLyB+IHBhZ2UgbG9hZCB0aW1lXHJcbnZhciBib290X3RpbWUgPSBtb21lbnQoKVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIFN0YXJ0IG9mIGxpYmFyeSBvYmplY3QgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbnZhciBrID0ge31cclxuXHJcblxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBKYXZhc3JpcHQgZnVuY3Rpb25zIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuXHJcbmsub2JqX2V4dGVuZCA9IGZ1bmN0aW9uKG9iaiwgcHJvcHMpIHtcclxuICAgIGZvcih2YXIgcHJvcCBpbiBwcm9wcykge1xyXG4gICAgICAgIGlmKHByb3BzLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgICAgIG9ialtwcm9wXSA9IHByb3BzW3Byb3BdXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5rLm9ial9yZW5hbWUgPSBmdW5jdGlvbihvYmosIG9sZF9uYW1lLCBuZXdfbmFtZSl7XHJcbiAgICAvLyBDaGVjayBmb3IgdGhlIG9sZCBwcm9wZXJ0eSBuYW1lIHRvIGF2b2lkIGEgUmVmZXJlbmNlRXJyb3IgaW4gc3RyaWN0IG1vZGUuXHJcbiAgICBpZiAob2JqLmhhc093blByb3BlcnR5KG9sZF9uYW1lKSkge1xyXG4gICAgICAgIG9ialtuZXdfbmFtZV0gPSBvYmpbb2xkX25hbWVdXHJcbiAgICAgICAgZGVsZXRlIG9ialtvbGRfbmFtZV1cclxuICAgIH1cclxuICAgIHJldHVybiBvYmpcclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBNaXNjIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuLy8gaHR0cDovL2Nzcy10cmlja3MuY29tL3NuaXBwZXRzL2phdmFzY3JpcHQvZ2V0LXVybC12YXJpYWJsZXMvXHJcbmsuZ2V0UXVlcnlWYXJpYWJsZSA9IGZ1bmN0aW9uKHZhcmlhYmxlKSB7XHJcbiAgICAgICB2YXIgcXVlcnkgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKVxyXG4gICAgICAgdmFyIHZhcnMgPSBxdWVyeS5zcGxpdChcIiZcIilcclxuICAgICAgIGZvciAodmFyIGk9MDtpPHZhcnMubGVuZ3RoO2krKykge1xyXG4gICAgICAgICAgICAgICB2YXIgcGFpciA9IHZhcnNbaV0uc3BsaXQoXCI9XCIpXHJcbiAgICAgICAgICAgICAgIGlmKHBhaXJbMF0gPT0gdmFyaWFibGUpe1xyXG4gICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhaXJbMV1cclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgcmV0dXJuKGZhbHNlKVxyXG59XHJcblxyXG5rLnN0cl9yZXBlYXQgPSBmdW5jdGlvbihzdHJpbmcsIGNvdW50KSB7XHJcbiAgICBpZiAoY291bnQgPCAxKSByZXR1cm4gJydcclxuICAgIHZhciByZXN1bHQgPSAnJ1xyXG4gICAgdmFyIHBhdHRlcm4gPSBzdHJpbmcudmFsdWVPZigpXHJcbiAgICB3aGlsZSAoY291bnQgPiAwKSB7XHJcbiAgICAgICAgaWYgKGNvdW50ICYgMSkgcmVzdWx0ICs9IHBhdHRlcm5cclxuICAgICAgICBjb3VudCA+Pj0gMVxyXG4gICAgICAgIHBhdHRlcm4gKz0gcGF0dGVyblxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdFxyXG59XHJcblxyXG5rLm9ial9uYW1lcyA9IGZ1bmN0aW9uKCBvYmplY3QgKSB7XHJcbiAgICBpZiggb2JqZWN0ICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgdmFyIGEgPSBbXTtcclxuICAgICAgICBmb3IoIHZhciBpZCBpbiBvYmplY3QgKSB7XHJcbiAgICAgICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoaWQpICkgIHtcclxuICAgICAgICAgICAgICAgIGEucHVzaChpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmsub2JqSWRBcnJheSA9IGZ1bmN0aW9uKCBvYmplY3QgKSB7XHJcbiAgICBpZiggb2JqZWN0ICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgdmFyIGEgPSBbXTtcclxuICAgICAgICBmb3IoIHZhciBpZCBpbiBvYmplY3QgKSB7XHJcbiAgICAgICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoaWQpICkgIHtcclxuICAgICAgICAgICAgICAgIGEucHVzaChpZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGE7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gTWF0aCwgbnVtYmVycyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcbi8qXHJcbiAqICBub3JtUmFuZDogcmV0dXJucyBub3JtYWxseSBkaXN0cmlidXRlZCByYW5kb20gbnVtYmVyc1xyXG4gKiAgaHR0cDovL21lbW9yeS5wc3ljaC5tdW4uY2EvdGVjaC9zbmlwcGV0cy9yYW5kb21fbm9ybWFsL1xyXG4gKi9cclxuay5ub3JtUmFuZCA9IGZ1bmN0aW9uKG11LCBzaWdtYSkge1xyXG4gICAgdmFyIHgxLCB4MiwgcmFkO1xyXG5cclxuICAgIGRvIHtcclxuICAgICAgICB4MSA9IDIgKiBNYXRoLnJhbmRvbSgpIC0gMTtcclxuICAgICAgICB4MiA9IDIgKiBNYXRoLnJhbmRvbSgpIC0gMTtcclxuICAgICAgICByYWQgPSB4MSAqIHgxICsgeDIgKiB4MjtcclxuICAgIH0gd2hpbGUocmFkID49IDEgfHwgcmFkID09PSAwKTtcclxuXHJcbiAgICB2YXIgYyA9IE1hdGguc3FydCgtMiAqIE1hdGgubG9nKHJhZCkgLyByYWQpO1xyXG4gICAgdmFyIG4gPSB4MSAqIGM7XHJcbiAgICByZXR1cm4gKG4gKiBtdSkgKyBzaWdtYTtcclxufVxyXG5cclxuay5wYWRfemVybyA9IGZ1bmN0aW9uKG51bSwgc2l6ZSl7XHJcbiAgICB2YXIgcyA9ICcwMDAwMDAwMDAnICsgbnVtXHJcbiAgICByZXR1cm4gcy5zdWJzdHIocy5sZW5ndGgtc2l6ZSlcclxufVxyXG5cclxuXHJcbmsudXB0aW1lID0gZnVuY3Rpb24oYm9vdF90aW1lKXtcclxuICAgIHZhciB1cHRpbWVfc2Vjb25kc190b3RhbCA9IG1vbWVudCgpLmRpZmYoYm9vdF90aW1lLCAnc2Vjb25kcycpXHJcbiAgICB2YXIgdXB0aW1lX2hvdXJzID0gTWF0aC5mbG9vciggIHVwdGltZV9zZWNvbmRzX3RvdGFsIC8oNjAqNjApIClcclxuICAgIHZhciBtaW51dGVzX2xlZnQgPSB1cHRpbWVfc2Vjb25kc190b3RhbCAlKDYwKjYwKVxyXG4gICAgdmFyIHVwdGltZV9taW51dGVzID0gay5wYWRfemVybyggTWF0aC5mbG9vciggIG1pbnV0ZXNfbGVmdCAvNjAgKSwgMiApXHJcbiAgICB2YXIgdXB0aW1lX3NlY29uZHMgPSBrLnBhZF96ZXJvKCAobWludXRlc19sZWZ0ICUgNjApLCAyIClcclxuICAgIHJldHVybiB1cHRpbWVfaG91cnMgK1wiOlwiKyB1cHRpbWVfbWludXRlcyArXCI6XCIrIHVwdGltZV9zZWNvbmRzXHJcbn1cclxuXHJcblxyXG5cclxuay5sYXN0X25fdmFsdWVzID0gZnVuY3Rpb24obil7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG46IG4sXHJcbiAgICAgICAgYXJyYXk6IFtdLFxyXG4gICAgICAgIGFkZDogZnVuY3Rpb24obmV3X3ZhbHVlKXtcclxuICAgICAgICAgICAgdGhpcy5hcnJheS5wdXNoKG5ld192YWx1ZSlcclxuICAgICAgICAgICAgaWYoIHRoaXMuYXJyYXkubGVuZ3RoID4gbiApIHRoaXMuYXJyYXkuc2hpZnQoKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hcnJheVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuay5hcnJheU1heCA9IGZ1bmN0aW9uKG51bUFycmF5KSB7XHJcbiAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkobnVsbCwgbnVtQXJyYXkpO1xyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBBSkFYIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5rLkFKQVggPSBmdW5jdGlvbih1cmwsIGNhbGxiYWNrLCBvYmplY3QpIHtcclxuICAgIHZhciB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgeG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoeG1saHR0cC5yZWFkeVN0YXRlID09IFhNTEh0dHBSZXF1ZXN0LkRPTkUgKSB7XHJcbiAgICAgICAgICAgIGlmKHhtbGh0dHAuc3RhdHVzID09IDIwMCl7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayh4bWxodHRwLnJlc3BvbnNlVGV4dCwgb2JqZWN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmKHhtbGh0dHAuc3RhdHVzID09IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1RoZXJlIHdhcyBhbiBlcnJvciA0MDAnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NvbWV0aGluZyBlbHNlIG90aGVyIHRoYW4gMjAwIHdhcyByZXR1cm5lZCcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgeG1saHR0cC5vcGVuKFwiR0VUXCIsIHVybCwgdHJ1ZSk7XHJcbiAgICB4bWxodHRwLnNlbmQoKTtcclxufVxyXG5cclxuay5wYXJzZUNTViA9IGZ1bmN0aW9uKGZpbGVfY29udGVudCkge1xyXG4gICAgdmFyIHIgPSBbXVxyXG4gICAgdmFyIGxpbmVzID0gZmlsZV9jb250ZW50LnNwbGl0KCdcXG4nKTtcclxuICAgIHZhciBoZWFkZXIgPSBsaW5lcy5zaGlmdCgpLnNwbGl0KCcsJyk7XHJcbiAgICBoZWFkZXIuZm9yRWFjaChmdW5jdGlvbihlbGVtLCBpZCl7XHJcbiAgICAgICAgaGVhZGVyW2lkXSA9IGVsZW0udHJpbSgpO1xyXG4gICAgfSk7XHJcbiAgICBmb3IodmFyIGwgPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGwgPCBsZW47IGwrKyl7XHJcbiAgICAgICAgdmFyIGxpbmUgPSBsaW5lc1tsXTtcclxuICAgICAgICBpZihsaW5lLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICB2YXIgbGluZV9vYmogPSB7fTtcclxuICAgICAgICAgICAgbGluZS5zcGxpdCgnLCcpLmZvckVhY2goZnVuY3Rpb24oaXRlbSxpKXtcclxuICAgICAgICAgICAgICAgIGxpbmVfb2JqW2hlYWRlcltpXV0gPSBpdGVtLnRyaW0oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHIucHVzaChsaW5lX29iaik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuKHIpO1xyXG59O1xyXG5cclxuay5nZXRDU1YgPSBmdW5jdGlvbihVUkwsIGNhbGxiYWNrKSB7XHJcbiAgICBrLkFKQVgoVVJMLCBrLnBhcnNlQ1NWKCkgKVxyXG59XHJcblxyXG4vKlxyXG4kLmFqYXhTZXR1cCAoe1xyXG4gICAgY2FjaGU6IGZhbHNlXHJcbn0pXHJcblxyXG5cclxuXHJcbmsuZ2V0X0pTT04gPSBmdW5jdGlvbihVUkwsIGNhbGxiYWNrLCBzdHJpbmcpIHtcclxuLy8gICAgdmFyIGZpbGVuYW1lID0gVVJMLnNwbGl0KCcvJykucG9wKClcclxuLy8gICAgY29uc29sZS5sb2coVVJMKVxyXG4gICAgJC5nZXRKU09OKCBVUkwsIGZ1bmN0aW9uKCBqc29uICkge1xyXG4gICAgICAgIGNhbGxiYWNrKGpzb24sIFVSTCwgc3RyaW5nKVxyXG4gICAgfSkuZmFpbChmdW5jdGlvbihqcXhociwgdGV4dFN0YXR1cywgZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyggXCJlcnJvclwiLCB0ZXh0U3RhdHVzLCBlcnJvciAgKVxyXG4gICAgfSlcclxufVxyXG5cclxuXHJcbmsubG9hZF9maWxlcyA9IGZ1bmN0aW9uKGZpbGVfbGlzdCwgY2FsbGJhY2spe1xyXG4gICAgdmFyIGQgPSB7fVxyXG5cclxuICAgIGZ1bmN0aW9uIGxvYWRfZmlsZShVUkwpe1xyXG4gICAgICAgIHZhciBmaWxlbmFtZSA9IFVSTC5zcGxpdCgnLycpLnBvcCgpXHJcbi8vICAgICAgICB2YXIgbmFtZSA9IGZpbGVuYW1lLnNwbGl0KCcuJylbMF1cclxuICAgICAgICAkLmdldEpTT04oIFVSTCwgZnVuY3Rpb24oIGpzb24gKSB7IC8vICwgdGV4dFN0YXR1cywganFYSFIpIHtcclxuICAgICAgICAgICAgYWRkX0pTT04oZmlsZW5hbWUsIGpzb24pXHJcbiAgICAgICAgfSkuZmFpbChmdW5jdGlvbihqcXhociwgdGV4dFN0YXR1cywgZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coIFwiZXJyb3JcIiwgdGV4dFN0YXR1cywgZXJyb3IgIClcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGFkZF9KU09OKG5hbWUsIGpzb24pe1xyXG4gICAgICAgIGRbbmFtZV0gPSBqc29uXHJcbiAgICAgICAgaWYoT2JqZWN0LmtleXMoZCkubGVuZ3RoID09IGRfZmlsZXMubGVuZ3RoKXtcclxuICAgICAgICAgICAgY2FsbGJhY2soZClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yKCB2YXIga2V5IGluIGZpbGVfbGlzdCl7XHJcbiAgICAgICAgdmFyIFVSTCA9IGZpbGVfbGlzdFtrZXldXHJcbiAgICAgICAgbG9hZF9maWxlKFVSTClcclxuICAgIH1cclxuXHJcbi8vICAgIGNhbGxiYWNrKGQpXHJcbn1cclxuXHJcbmsuZ2V0RmlsZSA9IGZ1bmN0aW9uKFVSTCwgY2FsbGJhY2spe1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IFVSTCxcclxuICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbiggeGhyICkge1xyXG4gICAgICAgICAgICB4aHIub3ZlcnJpZGVNaW1lVHlwZSggXCJ0ZXh0L3BsYWluOyBjaGFyc2V0PXgtdXNlci1kZWZpbmVkXCIgKTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgLmRvbmUoZnVuY3Rpb24oIGRhdGEgKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZGF0YSlcclxuICAgIH0pXHJcbiAgICAuZmFpbChmdW5jdGlvbihqcXhociwgdGV4dFN0YXR1cywgZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coIFwiZXJyb3JcIiwgdGV4dFN0YXR1cywgZXJyb3IgIClcclxuICAgIH0pXHJcblxyXG5cclxufVxyXG4qL1xyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBIVE1MIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuXHJcblxyXG5rLnNldHVwX2JvZHkgPSBmdW5jdGlvbih0aXRsZSwgc2VjdGlvbnMpe1xyXG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZVxyXG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5XHJcbiAgICB2YXIgc3RhdHVzX2JhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXHJcbiAgICBzdGF0dXNfYmFyLmlkID0gJ3N0YXR1cydcclxuICAgIHN0YXR1c19iYXIuaW5uZXJIVE1MID0gJ2xvYWRpbmcgc3RhdHVzLi4uJ1xyXG4gICAgLypcclxuICAgIHZhciB0aXRsZV9oZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpXHJcbiAgICB0aXRsZV9oZWFkZXIuaW5uZXJIVE1MID0gdGl0bGVcclxuICAgIGJvZHkuaW5zZXJ0QmVmb3JlKHRpdGxlX2hlYWRlciwgYm9keS5maXJzdENoaWxkKVxyXG4gICAgKi9cclxuICAgIGJvZHkuaW5zZXJ0QmVmb3JlKHN0YXR1c19iYXIsIGJvZHkuZmlyc3RDaGlsZClcclxuICAgIC8qXHJcbiAgICB2YXIgdGFic19kaXYgPSBrLm1ha2VfdGFicyhzZWN0aW9ucylcclxuICAgICQoJ2JvZHknKS5hcHBlbmQodGFic19kaXYpXHJcbiAgICAkKCAnLnRhYnMnICkudGFicyh7XHJcbiAgICAgICAgYWN0aXZhdGU6IGZ1bmN0aW9uKCBldmVudCwgdWkgKSB7XHJcbiAgICAgICAgICAgIHZhciBmdWxsX3RpdGxlID0gdGl0bGUgKyBcIiAvIFwiICsgdWkubmV3VGFiWzBdLnRleHRDb250ZW50XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnRpdGxlID0gZnVsbF90aXRsZVxyXG4gICAgICAgICAgICAkKCcjdGl0bGUnKS50ZXh0KGZ1bGxfdGl0bGUpXHJcbiAgICAgICAgICAgIC8vZHVtcChtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKSlcclxuICAgICAgICAgICAgJC5zcGFya2xpbmVfZGlzcGxheV92aXNpYmxlKClcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgdmFyIHNlY3Rpb24gPSBrLmdldFF1ZXJ5VmFyaWFibGUoJ3NlYycpXHJcbiAgICBpZihzZWN0aW9uIGluIHNlY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIGluZGV4ID0gJCgnLnRhYnMgYVtocmVmPVwiIycrc2VjdGlvbisnXCJdJykucGFyZW50KCkuaW5kZXgoKVxyXG4gICAgICAgICQoXCIudGFic1wiKS50YWJzKFwib3B0aW9uXCIsIFwiYWN0aXZlXCIsIGluZGV4KVxyXG4gICAgfVxyXG4gICAgKi9cclxuXHJcbn1cclxuLypcclxuay5tYWtlX3RhYnMgPSBmdW5jdGlvbihzZWN0aW9uX29iail7XHJcbiAgICB2YXIgdGFic19kaXYgPSAkKCc8ZGl2PicpLmFkZENsYXNzKCd0YWJzJylcclxuICAgIHZhciBoZWFkX2RpdiA9ICQoJzx1bD4nKS5hcHBlbmRUbyh0YWJzX2RpdilcclxuXHJcbiAgICBmb3IgKHZhciBpZCBpbiBzZWN0aW9uX29iail7XHJcbiAgICAgICAgdmFyIHRpdGxlID0gc2VjdGlvbl9vYmpbaWRdXHJcbiAgICAgICAgLy8oJzxsaT48YSBocmVmPVwiIycraWQrJ1wiPicrdGl0bGUrJzwvYT48L2xpPicpKVxyXG4gICAgICAgIC8vKCc8ZGl2IGlkPVwiJytpZCsnXCI+PC9kaXY+JykpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRhYnNfZGl2XHJcbn1cclxuXHJcbiovXHJcbmsudXBkYXRlX3N0YXR1c19wYWdlID0gZnVuY3Rpb24oc3RhdHVzX2lkLCBib290X3RpbWUsIHN0cmluZykge1xyXG4gICAgdmFyIHN0YXR1c19kaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzdGF0dXNfaWQpXHJcbiAgICBzdGF0dXNfZGl2LmlubmVySFRNTCA9IHN0cmluZ1xyXG4gICAgc3RhdHVzX2Rpdi5pbm5lckhUTUwgKz0gJyB8ICdcclxuXHJcbiAgICB2YXIgY2xvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgIGNsb2NrLmlubmVySFRNTCA9IG1vbWVudCgpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpXHJcblxyXG4gICAgdmFyIHVwdGltZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxyXG4gICAgdXB0aW1lLmlubmVySFRNTCA9ICdVcHRpbWU6ICcgKyBrLnVwdGltZShib290X3RpbWUpXHJcblxyXG4gICAgc3RhdHVzX2Rpdi5hcHBlbmRDaGlsZChjbG9jaylcclxuICAgIHN0YXR1c19kaXYuaW5uZXJIVE1MICs9ICcgfCAnXHJcbiAgICBzdGF0dXNfZGl2LmFwcGVuZENoaWxkKHVwdGltZSlcclxuICAgIHN0YXR1c19kaXYuaW5uZXJIVE1MICs9ICcgfCAnXHJcbn1cclxuXHJcbi8qXHJcbmsub2JqX2xvZyA9IGZ1bmN0aW9uKG9iaiwgb2JqX25hbWUsIG1heF9sZXZlbCl7XHJcbiAgICB2YXIgbGV2ZWxzID0gZnVuY3Rpb24ob2JqLCBsZXZlbF9pbmRlbnQsIHN0cil7XHJcbiAgICAgICAgZm9yKHZhciBuYW1lIGluIG9iaikge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IG9ialtuYW1lXVxyXG4gICAgICAgICAgICBpZiggbGV2ZWxfaW5kZW50IDw9IG1heF9sZXZlbCAmJiB0eXBlb2YoaXRlbSkgPT0gJ29iamVjdCcgKSB7XHJcbiAgICAgICAgICAgICAgICBzdHIgKz0gXCJcXG5cIiArIGsuc3RyX3JlcGVhdChcIiBcIiwgbGV2ZWxfaW5kZW50KjIpICsgbmFtZVxyXG4gICAgICAgICAgICAgICAgc3RyID0gbGV2ZWxzKGl0ZW0sIGxldmVsX2luZGVudCsxLCBzdHIgKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYodHlwZW9mIGl0ZW0gIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIHN0ciArPSBcIlxcblwiICsgay5zdHJfcmVwZWF0KFwiIFwiLCBsZXZlbF9pbmRlbnQqMikgKyBuYW1lICsgXCI6IFwiICsgaXRlbVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc3RyICs9IFwiXFxuXCIgKyBrLnN0cl9yZXBlYXQoXCIgXCIsIGxldmVsX2luZGVudCoyKSArIG5hbWUgKyBcIjogPGZ1bmN0aW9uPlwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHN0clxyXG4gICAgfVxyXG4gICAgdmFyIG1heF9sZXZlbCA9IG1heF9sZXZlbCB8fCAxMDBcclxuICAgIGNvbnNvbGUubG9nKG9ial9uYW1lKVxyXG4gICAgdmFyIHN0ciA9ICctJyArIG9ial9uYW1lICsgJy0nXHJcbiAgICBtYXhfbGV2ZWwrK1xyXG4gICAgbGV2ZWxfaW5kZW50ID0gMlxyXG4gICAgc3RyID0gbGV2ZWxzKG9iaiwgbGV2ZWxfaW5kZW50LCBzdHIpXHJcbiAgICBjb25zb2xlLmxvZyhzdHIpXHJcbn1cclxuXHJcblxyXG5rLm9ial90cmVlID0gZnVuY3Rpb24ob2JqLCB0aXRsZSl7XHJcbiAgICAvLyB0YWtlcyBhIGphdmFzY3JpcHQsIGFuZCByZXR1cmVucyBhIGpxdWVyeSBESVZcclxuICAgIHZhciBvYmpfZGl2ID0gJCgnPHByZT4nKSAvLy5hZGRDbGFzcygnYm94JylcclxuICAgIHZhciBsZXZlbHMgPSBmdW5jdGlvbihvYmosIGxldmVsX2luZGVudCl7KGxpbmUsIGNpcmNsZSwgdGV4dCApXHJcbiAgICAgICAgdmFyIGxpc3QgPSBbXVxyXG4gICAgICAgIHZhciBvYmpfbGVuZ3RoID0gMFxyXG4gICAgICAgIGZvciggdmFyIGtleSBpbiBvYmopIHtvYmpfbGVuZ3RoKyt9XHJcbiAgICAgICAgdmFyIGNvdW50ID0gMFxyXG4gICAgICAgIGZvcih2YXIga2V5IGluIG9iaikge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IG9ialtrZXldXHJcblxyXG4vLyAgICAgICAgICAgIHZhciBpbmRlbnRfc3RyaW5nID0gJyZuYnNwOyZuYnNwOyZuYnNwOyYjOTQ3NCcucmVwZWF0KGxldmVsKSArICcmbmJzcDsmbmJzcDsmbmJzcDsnXHJcbi8vICAgICAgICAgICAgaWYobGV2ZWxfaW5kZW50ID09PSAnJyApe1xyXG4vLyAgICAgICAgICAgICAgICBuZXh0X2xldmVsX2luZGVudCA9IGxldmVsX2luZGVudCArICcmbmJzcDsmbmJzcDsnXHJcbi8vICAgICAgICAgICAgICAgIHRoaXNfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyZuYnNwOydcclxuLy8gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgaWYoY291bnQgPT0gb2JqX2xlbmd0aC0xICkgeyAgIC8vIElmIGxhc3QgaXRlbSwgZmluc2ggdHJlZSBzZWN0aW9uXHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dF9sZXZlbF9pbmRlbnQgPSBsZXZlbF9pbmRlbnQgKyAnJm5ic3A7Jm5ic3A7J1xyXG4gICAgICAgICAgICAgICAgdmFyIHRoaXNfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyYjOTQ5MjsmIzk0NzI7J1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV4dF9sZXZlbF9pbmRlbnQgPSBsZXZlbF9pbmRlbnQgKyAnJm5ic3A7JiM5NDc0OydcclxuICAgICAgICAgICAgICAgIHZhciB0aGlzX2xldmVsX2luZGVudCA9IGxldmVsX2luZGVudCArICcmbmJzcDsmIzk1MDA7JiM5NDcyOydcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIGlmKCB0eXBlb2YoaXRlbSkgPT0gJ29iamVjdCcgKXtcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaCggdGhpc19sZXZlbF9pbmRlbnQgKyBrZXkpXHJcbiAgICAgICAgICAgICAgICBsaXN0ID0gbGlzdC5jb25jYXQoIGxldmVscyhpdGVtLCBuZXh0X2xldmVsX2luZGVudCkgKVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IGl0ZW0udG9TdHJpbmcoKS5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLFwiIFwiKS5yZXBsYWNlKC9cXHMrL2csXCIgXCIpIC8vaHR0cDovL3d3dy50ZXh0Zml4ZXIuY29tL3R1dG9yaWFscy9qYXZhc2NyaXB0LWxpbmUtYnJlYWtzLnBocFxyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKHRoaXNfbGV2ZWxfaW5kZW50ICsga2V5K1wiOiBcIisgaXRlbSlcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbi8vICAgICAgICAgICAgY29uc29sZS5sb2coa2V5LGxldmVsKVxyXG4gICAgICAgICAgICBjb3VudCsrXHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGlzdFxyXG4gICAgfVxyXG5cclxuICAgIHZhciBsaXN0ID0gW3RpdGxlXS5jb25jYXQobGV2ZWxzKG9iaiwnJykpXHJcbiAgICBsaXN0LmZvckVhY2goIGZ1bmN0aW9uKGxpbmUsa2V5KXtcclxuICAgICAgICBvYmpfZGl2LmFwcGVuZChsaW5lICsgJzwvYnI+JylcclxuICAgIH0pXHJcbiAgICByZXR1cm4gb2JqX2RpdlxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKlxyXG5rLm9ial9kaXNwbGF5ID0gZnVuY3Rpb24ob2JqKXtcclxuICAgIGZ1bmN0aW9uIGxldmVscyhvYmosbGV2ZWwpe1xyXG4gICAgLy8gICAgdmFyIHN1Ym9ial9kaXYgPSAkKCc8ZGl2PicpXHJcbiAgICAgICAgdmFyIHN1Ym9ial91bCA9ICQoJzx1bD4nKS5hZGRDbGFzcygndHJlZScpXHJcblxyXG4gICAgICAgIGZvcih2YXIga2V5IGluIG9iaikge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IG9ialtrZXldXHJcbiAgICAvLyAgICAgICAgY29uc29sZS5sb2coa2V5LCB0eXBlb2YoaXRlbSkpXHJcbiAgICAgICAgICAgIGlmKCB0eXBlb2YoaXRlbSkgPT0gJ29iamVjdCcgKXtcclxuICAgIC8vICAgICAgICAgICAgKCc8bGk+JykudGV4dChcIiZuYnNwO1wiLnJlcGVhdChsZXZlbCkgKyBrZXkpKVxyXG4gICAgICAgICAgICAgICAgKCc8bGk+JykudGV4dChrZXkpKVxyXG4gICAgICAgICAgICAgICAgc3Vib2JqX3VsLmFwcGVuZChsZXZlbHMoaXRlbSxsZXZlbCsxKSlcclxuICAgIC8vICAgICAgICAgICAgY29uc29sZS5sb2coXCImbmJzcDtcIi5yZXBlYXQobGV2ZWwpICsga2V5KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICBzdWJvYmpfZGl2LmFwcGVuZCgnPHNwYW4+JykudGV4dChcIiZuYnNwO1wiLnJlcGVhdChsZXZlbCkgKyBrZXkrXCI6IFwiKyBpdGVtKVxyXG4gICAgLy8gICAgICAgICAgICAoJzxsaT4nKS50ZXh0KFwiJm5ic3A7XCIucmVwZWF0KGxldmVsKSArIGtleSArXCI6IFwiKyBpdGVtKSlcclxuICAgICAgICAgICAgICAgICgnPGxpPicpLnRleHQoa2V5ICtcIjogXCIrIGl0ZW0pKVxyXG4gICAgLy8gICAgICAgICAgICBjb25zb2xlLmxvZyhcIiZuYnNwO1wiLnJlcGVhdChsZXZlbCkgKyBrZXkrXCI6IFwiKyBpdGVtKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdWJvYmpfdWxcclxuICAgIH1cclxuICAgIC8vIHRha2VzIGEgamF2YXNjcmlwdCwgYW5kIHJldHVyZW5zIGEganF1ZXJ5IERJVlxyXG4gICAgdmFyIG9ial9kaXYgPSAkKCc8ZGl2PicpLy8uYWRkQ2xhc3MoJ2JveCcpXHJcblxyXG4gICAgb2JqX2Rpdi5hcHBlbmQobGV2ZWxzKG9iaiwwKSlcclxuICAgIHJldHVybiBvYmpfZGl2XHJcbn1cclxuXHJcbmsuc2hvd19vYmogPSBmdW5jdGlvbihjb250YWluZXJfaWQsIG9iaiwgbmFtZSl7XHJcbiAgICB2YXIgaWQgPSAnIycgKyBuYW1lXHJcbiAgICBpZiggISAkKGNvbnRhaW5lcl9pZCkuY2hpbGRyZW4oaWQpLmxlbmd0aCApIHtcclxuICAgICAgICAoJzxkaXY+JykuYXR0cignaWQnLCBuYW1lKSlcclxuICAgIH1cclxuICAgIHZhciBib3ggPSAkKGNvbnRhaW5lcl9pZCkuY2hpbGRyZW4oaWQpXHJcbiAgICBib3guZW1wdHkoKVxyXG5cclxuICAgIHZhciBvYmpfZGl2ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnYm94JylcclxuICAgIG9ial9kaXYuYXBwZW5kKGsub2JqX3RyZWUob2JqLCBuYW1lKSlcclxuICAgIGJveC5hcHBlbmQob2JqX2RpdilcclxuXHJcbn1cclxuXHJcbiovXHJcbmsubG9nX29iamVjdF90cmVlID0gZnVuY3Rpb24oY29tcG9uZW50cyl7XHJcbiAgICBmb3IoIHZhciBtYWtlIGluIGNvbXBvbmVudHMubW9kdWxlcyApe1xyXG4gICAgICAgIGlmKCBjb21wb25lbnRzLm1vZHVsZXMuaGFzT3duUHJvcGVydHkobWFrZSkpe1xyXG4gICAgICAgICAgICBmb3IoIHZhciBtb2RlbCBpbiBjb21wb25lbnRzLm1vZHVsZXNbbWFrZV0gKXtcclxuICAgICAgICAgICAgICAgIGlmKCBjb21wb25lbnRzLm1vZHVsZXNbbWFrZV0uaGFzT3duUHJvcGVydHkobW9kZWwpKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IGNvbXBvbmVudHMubW9kdWxlc1ttYWtlXVttb2RlbF1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgYSA9IFttYWtlLG1vZGVsXVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciggdmFyIHNwZWMgaW4gbyApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggby5oYXNPd25Qcm9wZXJ0eShzcGVjKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhLnB1c2gob1tzcGVjXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYS5qb2luKCcsJykpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBGU0VDIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuXHJcblxyXG5rLmNyMTAwMF9qc29uID0gZnVuY3Rpb24oanNvbil7XHJcbi8vICAgIHZhciBmaWVsZHMgPSBbXVxyXG4vLyAgICAkLmVhY2goanNvbi5oZWFkLmZpZWxkcywgZnVuY3Rpb24oa2V5LCBmaWVsZCkge1xyXG4vLyAgICAgICAgZmllbGRzLnB1c2goZmllbGQubmFtZSlcclxuLy8gICAgfSlcclxuLy8gICAgdmFyIGRhdGEgPSBfLnppcChmaWVsZHMsIGpzb24uZGF0YVswXS52YWxzKVxyXG4vL1xyXG4gICAgdmFyIHRpbWVzdGFtcCA9IGpzb24uZGF0YVswXS50aW1lXHJcbiAgICB2YXIgZGF0YSA9IHt9XHJcbiAgICBkYXRhLlRpbWVzdGFtcCA9IGpzb24uZGF0YVswXS50aW1lXHJcbiAgICBkYXRhLlJlY29yZE51bSA9IGpzb24uZGF0YVswXS5ub1xyXG4gICAgZm9yKHZhciBpID0gMCwgbCA9IGpzb24uaGVhZC5maWVsZHMubGVuZ3RoOyBpIDwgbDsgaSsrICl7XHJcbiAgICAgICAgZGF0YVtqc29uLmhlYWQuZmllbGRzW2ldLm5hbWVdID0ganNvbi5kYXRhWzBdLnZhbHNbaV1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGF0YVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBEMyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuXHJcbmsuZDMgPSB7fVxyXG5cclxuay5kMy5saXZlX3NwYXJrbGluZSA9IGZ1bmN0aW9uKGlkLCBoaXN0b3J5KSB7XHJcbiAgICB2YXIgZGF0YSA9IGhpc3RvcnkuYXJyYXlcclxuICAgIHZhciBsZW5ndGggPSBoaXN0b3J5LmFycmF5Lmxlbmd0aFxyXG4gICAgdmFyIG4gPSBoaXN0b3J5Lm5cclxuICAgIC8vay5kMy5saXZlX3NwYXJrbGluZSA9IGZ1bmN0aW9uKGlkLCB3aWR0aCwgaGVpZ2h0LCBpbnRlcnBvbGF0aW9uLCBhbmltYXRlLCB1cGRhdGVEZWxheSwgdHJhbnNpdGlvbkRlbGF5KSB7XHJcbiAgICAvLyBiYXNlZCBvbiBjb2RlIHBvc3RlZCBieSBCZW4gQ2hyaXN0ZW5zZW4gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vYmVuamNocmlzdGVuc2VuLzExNDgzNzRcclxuXHJcbiAgICB2YXIgd2lkdGggPSA0MDAsXHJcbiAgICAgICAgaGVpZ2h0ID0gNTAsXHJcbiAgICAgICAgaW50ZXJwb2xhdGlvbiA9ICdiYXNpcycsXHJcbiAgICAgICAgYW5pbWF0ZSA9IHRydWUsXHJcbiAgICAgICAgdXBkYXRlRGVsYXkgPSAxMDAwLFxyXG4gICAgICAgIHRyYW5zaXRpb25EZWxheSA9IDEwMDBcclxuXHJcbiAgICAvLyBYIHNjYWxlIHdpbGwgZml0IHZhbHVlcyBmcm9tIDAtMTAgd2l0aGluIHBpeGVscyAwLTEwMFxyXG4gICAgLy8gc3RhcnRpbmcgcG9pbnQgaXMgLTUgc28gdGhlIGZpcnN0IHZhbHVlIGRvZXNuJ3Qgc2hvdyBhbmQgc2xpZGVzIG9mZiB0aGUgZWRnZSBhcyBwYXJ0IG9mIHRoZSB0cmFuc2l0aW9uXHJcbiAgICB2YXIgeCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgNTldKS5yYW5nZShbMCwgd2lkdGhdKTtcclxuICAgIC8vIFkgc2NhbGUgd2lsbCBmaXQgdmFsdWVzIGZyb20gMC0xMCB3aXRoaW4gcGl4ZWxzIDAtMTAwXHJcbiAgICB2YXIgeSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMjAsIDQwXSkucmFuZ2UoW2hlaWdodCwgMF0pO1xyXG5cclxuICAgIC8vIGNyZWF0ZSBhIGxpbmUgb2JqZWN0IHRoYXQgcmVwcmVzZW50cyB0aGUgU1ZOIGxpbmUgd2UncmUgY3JlYXRpbmdcclxuICAgIHZhciBsaW5lID0gZDMuc3ZnLmxpbmUoKVxyXG4gICAgICAgIC8vIGFzc2lnbiB0aGUgWCBmdW5jdGlvbiB0byBwbG90IG91ciBsaW5lIGFzIHdlIHdpc2hcclxuICAgICAgICAueChmdW5jdGlvbihkLGkpIHtcclxuICAgICAgICAgICAgLy8gdmVyYm9zZSBsb2dnaW5nIHRvIHNob3cgd2hhdCdzIGFjdHVhbGx5IGJlaW5nIGRvbmVcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnUGxvdHRpbmcgWCB2YWx1ZSBmb3IgZGF0YSBwb2ludDogJyArIGQgKyAnIHVzaW5nIGluZGV4OiAnICsgaSArICcgdG8gYmUgYXQ6ICcgKyB4KGkpICsgJyB1c2luZyBvdXIgeFNjYWxlLicpO1xyXG4gICAgICAgICAgICAvLyByZXR1cm4gdGhlIFggY29vcmRpbmF0ZSB3aGVyZSB3ZSB3YW50IHRvIHBsb3QgdGhpcyBkYXRhcG9pbnRcclxuICAgICAgICAgICAgcmV0dXJuIHgoaSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAueShmdW5jdGlvbihkKSB7XHJcbiAgICAgICAgICAgIC8vIHZlcmJvc2UgbG9nZ2luZyB0byBzaG93IHdoYXQncyBhY3R1YWxseSBiZWluZyBkb25lXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ1Bsb3R0aW5nIFkgdmFsdWUgZm9yIGRhdGEgcG9pbnQ6ICcgKyBkICsgJyB0byBiZSBhdDogJyArIHkoZCkgKyBcIiB1c2luZyBvdXIgeVNjYWxlLlwiKTtcclxuICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBZIGNvb3JkaW5hdGUgd2hlcmUgd2Ugd2FudCB0byBwbG90IHRoaXMgZGF0YXBvaW50XHJcbiAgICAgICAgICAgIHJldHVybiB5KGQpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmludGVycG9sYXRlKGludGVycG9sYXRpb24pXHJcblxyXG4gICAgLy8gSWYgc3ZnIGRvZXMgbm90IGV4aXN0LCBjcmVhdGUgaXRcclxuICAgIGlmKCAhIGQzLnNlbGVjdCgnIycraWQpLnNlbGVjdCgnc3ZnJylbMF1bMF0gKXtcclxuICAgICAgICAvLyBjcmVhdGUgYW4gU1ZHIGVsZW1lbnQgaW5zaWRlIHRoZSAjZ3JhcGggZGl2IHRoYXQgZmlsbHMgMTAwJSBvZiB0aGUgZGl2XHJcbiAgICAgICAgdmFyIGdyYXBoID0gZDMuc2VsZWN0KCcjJytpZCkuYXBwZW5kKFwic3ZnOnN2Z1wiKS5hdHRyKFwid2lkdGhcIiwgd2lkdGgpLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLy8gZGlzcGxheSB0aGUgbGluZSBieSBhcHBlbmRpbmcgYW4gc3ZnOnBhdGggZWxlbWVudCB3aXRoIHRoZSBkYXRhIGxpbmUgd2UgY3JlYXRlZCBhYm92ZVxyXG4vLyAgICAgICAgZ3JhcGguYXBwZW5kKFwic3ZnOnBhdGhcIikuYXR0cihcImRcIiwgbGluZShkYXRhKSk7XHJcbiAgICAgICAgLy8gb3IgaXQgY2FuIGJlIGRvbmUgbGlrZSB0aGlzXHJcbiAgICAgICAgZ3JhcGguc2VsZWN0QWxsKFwicGF0aFwiKS5kYXRhKFtkYXRhXSkuZW50ZXIoKS5hcHBlbmQoXCJzdmc6cGF0aFwiKS5hdHRyKFwiZFwiLCBsaW5lKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZ3JhcGggPSBkMy5zZWxlY3QoJyMnK2lkKycgc3ZnJylcclxuICAgIGNvbnNvbGUubG9nKCBsZW5ndGgpXHJcbiAgICAvLyB1cGRhdGUgd2l0aCBhbmltYXRpb25cclxuICAgIGdyYXBoLnNlbGVjdEFsbChcInBhdGhcIilcclxuICAgICAgICAuZGF0YShbZGF0YV0pIC8vIHNldCB0aGUgbmV3IGRhdGFcclxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIHgobi1sZW5ndGggKzEpICsgXCIpXCIpIC8vIHNldCB0aGUgdHJhbnNmb3JtIHRvIHRoZSByaWdodCBieSB4KDEpIHBpeGVscyAoNiBmb3IgdGhlIHNjYWxlIHdlJ3ZlIHNldCkgdG8gaGlkZSB0aGUgbmV3IHZhbHVlXHJcbiAgICAgICAgLmF0dHIoXCJkXCIsIGxpbmUpIC8vIGFwcGx5IHRoZSBuZXcgZGF0YSB2YWx1ZXMgLi4uIGJ1dCB0aGUgbmV3IHZhbHVlIGlzIGhpZGRlbiBhdCB0aGlzIHBvaW50IG9mZiB0aGUgcmlnaHQgb2YgdGhlIGNhbnZhc1xyXG4gICAgICAgIC50cmFuc2l0aW9uKCkgLy8gc3RhcnQgYSB0cmFuc2l0aW9uIHRvIGJyaW5nIHRoZSBuZXcgdmFsdWUgaW50byB2aWV3XHJcbiAgICAgICAgLmVhc2UoXCJsaW5lYXJcIilcclxuICAgICAgICAuZHVyYXRpb24odHJhbnNpdGlvbkRlbGF5KSAvLyBmb3IgdGhpcyBkZW1vIHdlIHdhbnQgYSBjb250aW51YWwgc2xpZGUgc28gc2V0IHRoaXMgdG8gdGhlIHNhbWUgYXMgdGhlIHNldEludGVydmFsIGFtb3VudCBiZWxvd1xyXG4gICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgeChuLWxlbmd0aCkgKyBcIilcIik7IC8vIGFuaW1hdGUgYSBzbGlkZSB0byB0aGUgbGVmdCBiYWNrIHRvIHgoMCkgcGl4ZWxzIHRvIHJldmVhbCB0aGUgbmV3IHZhbHVlXHJcblxyXG4gICAgICAgIC8qIHRoYW5rcyB0byAnYmFycnltJyBmb3IgZXhhbXBsZXMgb2YgdHJhbnNmb3JtOiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS8xMTM3MTMxICovXHJcbi8vICAgICBncmFwaC5hcHBlbmQoXCJyZWN0XCIpXHJcbi8vICAgICAgICAgIC5hdHRyKFwieFwiLCAwKVxyXG4vLyAgICAgICAgICAuYXR0cihcInlcIiwgMClcclxuLy8gICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KVxyXG4vLyAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxyXG4vLyAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgJyNmMDAnKVxyXG4vLyAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIFwibm9uZVwiKVxyXG4vLyAgICAgICAgICAuc3R5bGUoXCJzdHJva2Utd2lkdGhcIiwgJzFweCcpXHJcblxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEV2ZW50cyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmsuZSA9IHt9XHJcblxyXG5rLnVwdGltZSA9IGZ1bmN0aW9uKGJvb3RfdGltZSl7XHJcbiAgICB2YXIgdXB0aW1lX3NlY29uZHNfdG90YWwgPSBtb21lbnQoKS5kaWZmKGJvb3RfdGltZSwgJ3NlY29uZHMnKVxyXG4gICAgdmFyIHVwdGltZV9ob3VycyA9IE1hdGguZmxvb3IoICB1cHRpbWVfc2Vjb25kc190b3RhbCAvKDYwKjYwKSApXHJcbiAgICB2YXIgbWludXRlc19sZWZ0ID0gdXB0aW1lX3NlY29uZHNfdG90YWwgJSg2MCo2MClcclxuICAgIHZhciB1cHRpbWVfbWludXRlcyA9IGsucGFkX3plcm8oIE1hdGguZmxvb3IoICBtaW51dGVzX2xlZnQgLzYwICksIDIgKVxyXG4gICAgdmFyIHVwdGltZV9zZWNvbmRzID0gay5wYWRfemVybyggKG1pbnV0ZXNfbGVmdCAlIDYwKSwgMiApXHJcbiAgICByZXR1cm4gdXB0aW1lX2hvdXJzICtcIjpcIisgdXB0aW1lX21pbnV0ZXMgK1wiOlwiKyB1cHRpbWVfc2Vjb25kc1xyXG59XHJcblxyXG5rLmUuYWRkVGltZVNpbmNlID0gZnVuY3Rpb24oZXZlbnRfbGlzdCl7XHJcbiAgICBjb25zb2xlLmxvZyhtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQnKSlcclxuICAgIGNvbnNvbGUubG9nKG1vbWVudCgpLmZyb21Ob3coKSlcclxuICAgIGV2ZW50X2xpc3QuZm9yRWFjaChmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgdmFyIGRhdGVfYXJyYXkgPSBldmVudC5kYXRlLnNwbGl0KCctJykubWFwKE51bWJlcilcclxuICAgICAgICB2YXIgeWVhciA9IGRhdGVfYXJyYXlbMF1cclxuICAgICAgICB2YXIgbW9udGggPSBkYXRlX2FycmF5WzFdXHJcbiAgICAgICAgdmFyIGRheSA9IGRhdGVfYXJyYXlbMl1cclxuICAgICAgICB2YXIgdGhpc195ZWFyID0gbW9tZW50KCkueWVhcigpXHJcbiAgICAgICAgaWYobW9tZW50KCkuZGlmZihtb21lbnQoW3RoaXNfeWVhciwgbW9udGgtMSwgZGF5XSksICdkYXlzJykgPiAwKSB7dGhpc195ZWFyKyt9XHJcbiAgICAgICAgdmFyIGV2ZW50X21vbWVudCA9IG1vbWVudChldmVudC5kYXRlLCAnWVlZWS1NTS1ERCcpXHJcbiAgICAgICAgdmFyIGRheXNfYWdvID0gbW9tZW50KCkuZGlmZihldmVudF9tb21lbnQsICdkYXknKVxyXG4gICAgICAgIGV2ZW50LnRpbWVfc2luY2UgPSBldmVudF9tb21lbnQuZnJvbU5vdygpXHJcbiAgICAgICAgZXZlbnQueWVhcnNfYWdvID0gbW9tZW50KCkuZGlmZihldmVudF9tb21lbnQsICd5ZWFycycpXHJcbiAgICAgICAgZXZlbnQuZGF5c190aWxsX25leHQgPSAtbW9tZW50KCkuZGlmZihtb21lbnQoW3RoaXNfeWVhciwgbW9udGgtMSwgZGF5XSksICdkYXlzJylcclxuICAgIH0pXHJcbiAgICBldmVudF9saXN0LnNvcnQoZnVuY3Rpb24oYSxiKXtcclxuICAgICAgICByZXR1cm4gYS5kYXlzX3RpbGxfbmV4dCAtIGIuZGF5c190aWxsX25leHRcclxuICAgIH0pXHJcbiAgICByZXR1cm4gZXZlbnRfbGlzdFxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRGlzcGxheXMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuay5kID0ge31cclxuXHJcbi8qXHJcbmsuZCA9IHtcclxuICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICB2YWx1ZTogMCxcclxuXHJcbn1cclxuXHJcbmsuZC5wcm90b3R5cGUuc2V0UGVyID0gZnVuY3Rpb24ocGVyY2VudCl7XHJcbiAgICB0aGlzLmJhci5jc3MoJ3dpZHRoJywgcGVyY2VudCsnJScpXHJcbn1cclxuKi9cclxuXHJcblxyXG4vKlxyXG5rLmQuYmFyID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBiYXIgPSB7fVxyXG5cclxuICAgIGJhci53aWR0aCA9IDEwMFxyXG4gICAgYmFyLndpZHRoX3VuaXQgPSAnJSdcclxuICAgIGJhci5oZWlnaHQgPSAnOHB4J1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGJhci53aWR0aCsnJScpXHJcbiAgICBiYXIuZGl2ID0gJCgnPGRpdj4nKS5jc3MoJ3dpZHRoJywgJzAlJylcclxuICAgIGJhci5lbGVtZW50ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygncHJvZ3Jlc3NiYXInKS5jc3MoJ3dpZHRoJywgMTAwKVxyXG4gICAgYmFyLmVsZW1lbnQuYXBwZW5kKGJhci5kaXYpXHJcblxyXG4gICAgYmFyLnNldFBlcmNlbnQgPSBmdW5jdGlvbihwZXJjZW50KXtcclxuICAgICAgICB0aGlzLndpZHRoID0gcGVyY2VudFxyXG4gICAgICAgIHRoaXMud2lkdGhfdW5pdCA9ICclJ1xyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgIH1cclxuICAgIGJhci51cGRhdGUgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIHRoaXMuZGl2LmNzcygnd2lkdGgnLCB0aGlzLndpZHRoK3RoaXMud2lkdGhfdW5pdClcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY3NzKCdoZWlnaHQnLCB0b1N0cmluZyh0aGlzLmhlaWdodCkrJ3B4JylcclxuICAgIH1cclxuICAgIHJldHVybiBiYXJcclxufVxyXG4qL1xyXG5cclxuXHJcbi8vIEJyb3dzZXJpZnlcclxubW9kdWxlLmV4cG9ydHMgPSBrO1xyXG4iLCIndXNlIHN0cmljdCc7XG52YXIgbG9nID0gY29uc29sZS5sb2cuYmluZChjb25zb2xlKTtcblxudmFyIHZhbHVlID0gcmVxdWlyZSgnLi9rX0RPTV9leHRyYS5qcycpLnZhbHVlO1xudmFyIHNlbGVjdG9yID0gcmVxdWlyZSgnLi9rX0RPTV9leHRyYS5qcycpLnNlbGVjdG9yO1xuLy9sb2coICd2YWx1ZScsIHZhbHVlKCkgKTtcbi8vbG9nKCAnc2VsZWN0b3InLCBzZWxlY3RvcigpICk7IHZhciBrID0gcmVxdWlyZSgnLi9rJyk7IC8vdmFyIHNlbGVjdG9yID0gcmVxdWlyZSgnLi9rX0RPTV9leHRyYS5qcycpLnNlbGVjdG9yOyBcblxuXG52YXIgd3JhcHBlcl9wcm90b3R5cGUgPSByZXF1aXJlKCcuL3dyYXBwZXJfcHJvdG90eXBlJyk7XG5cbi8qXG52YXIgd3JhcHBlcl9wcm90b3R5cGUgPSB7XG5cbiAgICBodG1sOiBmdW5jdGlvbihodG1sKXtcbiAgICAgICB0aGlzLmVsZW0uaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGFwcGVuZDogZnVuY3Rpb24oc3ViX2VsZW1lbnQpe1xuICAgICAgICB0aGlzLmVsZW0uYXBwZW5kQ2hpbGQoc3ViX2VsZW1lbnQuZWxlbSk7IFxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGFwcGVuZFRvOiBmdW5jdGlvbihwYXJlbnRfZWxlbWVudCl7XG4gICAgICAgIHBhcmVudF9lbGVtZW50LmFwcGVuZCh0aGlzKTsgXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgYXR0cjogZnVuY3Rpb24obmFtZSwgdmFsdWUgKXtcbiAgICAgICAgdmFyIGF0dHJpYnV0ZU5hbWU7XG4gICAgICAgIGlmKCBuYW1lID09PSAnY2xhc3MnKXtcbiAgICAgICAgICAgIGF0dHJpYnV0ZU5hbWUgPSAnY2xhc3NOYW1lJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZU5hbWUgPSBuYW1lOyBcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1bYXR0cmlidXRlTmFtZV0gPSB2YWx1ZTsgXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cblxuXG59O1xuKi9cblxudmFyIFdyYXAgPSBmdW5jdGlvbihlbGVtZW50KXtcbiAgICB2YXIgVyA9IE9iamVjdC5jcmVhdGUod3JhcHBlcl9wcm90b3R5cGUpO1xuXG5cbiAgICBXLmVsZW0gPSBlbGVtZW50O1xuICAgIGlmKCBXLmVsZW0udGFnTmFtZSA9PT0gXCJTRUxFQ1RcIiApIHtcbiAgICAgICAgVy5zZXRPcHRpb25zID0gZnVuY3Rpb24oIG9wdGlvbl9hcnJheSApIHtcbiAgICAgICAgICAgIFcuZWxlbS5vcHRpb25zLmxlbmd0aCA9IDA7IFxuICAgICAgICAgICAgLy9sb2coXCJvcHRpb25fYXJyYXlcIiwgb3B0aW9uX2FycmF5KTtcbiAgICAgICAgICAgIG9wdGlvbl9hcnJheS5mb3JFYWNoKCBmdW5jdGlvbihvcHRpb25fc3RyLGkpe1xuICAgICAgICAgICAgICAgIHZhciBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgICAgICAgICBvcHQudGV4dCA9IG9wdGlvbl9zdHI7XG4gICAgICAgICAgICAgICAgb3B0LnZhbHVlID0gb3B0aW9uX3N0cjtcbiAgICAgICAgICAgICAgICBXLmVsZW0uYWRkKG9wdCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gVztcblxufTtcblxudmFyICQgPSBmdW5jdGlvbihpbnB1dCl7XG4gICAgdmFyIGVsZW1lbnQ7XG5cbiAgICBpZiggdHlwZW9mIGlucHV0ID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgLy9sb2coJ2lucHV0IG5lZWRlZCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmKCAoaW5wdXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgfHwgKGlucHV0IGluc3RhbmNlb2YgU1ZHRWxlbWVudCkgKXtcbiAgICAgICAgcmV0dXJuIFdyYXAoaW5wdXQpO1xuICAgIH1cbiAgICBpZiggaW5wdXQuc3Vic3RyKDAsMSkgPT09ICcjJyApIHtcbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlucHV0LnN1YnN0cigxKSk7XG4gICAgICAgIHJldHVybiBXcmFwKGVsZW1lbnQpO1xuICAgIH0gZWxzZSBpZiggaW5wdXQuc3Vic3RyKDAsMSkgPT09ICcuJyApIHtcbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUNsYXNzTmFtZShpbnB1dC5zdWJzdHIoMSlbMF0pO1xuICAgICAgICByZXR1cm4gV3JhcChlbGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiggaW5wdXQgPT09ICd2YWx1ZScgKSB7XG4gICAgICAgICAgICBpZiggdmFsdWUgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gdmFsdWUoKTsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IHZhbHVlIG5vdCBkZWZpbmVkXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmKCBpbnB1dCA9PT0gJ3NlbGVjdG9yJyApIHtcbiAgICAgICAgICAgIGlmKCBzZWxlY3RvciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBzZWxlY3RvcigpOyBcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogc2VsZWN0b3Igbm90IGRlZmluZWRcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaW5wdXQpO1xuICAgICAgICAgICAgcmV0dXJuIFdyYXAoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG5cblxufTtcblxuLy8gQnJvd3NlcmlmeVxubW9kdWxlLmV4cG9ydHMgPSAkO1xuLy9tb2R1bGUuZXhwb3J0cy53cmFwcGVyX3Byb3RvdHlwZSA9IHdyYXBwZXJfcHJvdG90eXBlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgayA9IHJlcXVpcmUoJy4vay5qcycpO1xudmFyIGtvbnRhaW5lciA9IHJlcXVpcmUoJy4va29udGFpbmVyJyk7XG5cbnZhciBrX0RPTSA9IHJlcXVpcmUoJy4va19ET00uanMnKTtcbnZhciB3cmFwcGVyX3Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vd3JhcHBlcl9wcm90b3R5cGUnKTtcblxuXG52YXIgc2VsZWN0b3JfcHJvdG90eXBlID0ge1xuICAgIGNoYW5nZTogZnVuY3Rpb24obmV3X3ZhbHVlKXtcbiAgICAgICAgdGhpcy5zZXRfdmFsdWUoKTtcblxuICAgICAgICBpZiggdGhpcy5nX3VwZGF0ZSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLmdfdXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNldF92YWx1ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIHRoaXMuZWxlbS5vcHRpb25zW3RoaXMuZWxlbS5zZWxlY3RlZEluZGV4XSAmJiB0aGlzLmVsZW0ub3B0aW9uc1t0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleF0udmFsdWUgKXtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ3NlbGVjdGVkX3ZhbHVlJywgdGhpcy5lbGVtLm9wdGlvbnNbdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXhdLnZhbHVlKTtcbiAgICAgICAgICAgIHZhciBuZXdfdmFsdWUgPSB0aGlzLmVsZW0ub3B0aW9uc1t0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4gICAgICAgICAgICBpZiggdGhpcy5vcHRpb25zS29udGFpbmVyLnJlYWR5ICkge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2tvbnRhaW5lciByZWFkeSwgc2V0dGluZyB0bzogJywgbmV3X3ZhbHVlKVxuICAgICAgICAgICAgICAgIC8vaWYoICEgaXNOYU4ocGFyc2VGbG9hdChuZXdfdmFsdWUpKSkgbmV3X3ZhbHVlID0gcGFyc2VGbG9hdChuZXdfdmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMua29udGFpbmVyLnNldChuZXdfdmFsdWUpO1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBuZXdfdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpe1xuICAgICAgICAvL2NvbnNvbGUubG9nKCd1cGRhdGluZzogJywgdGhpcylcbiAgICAgICAgLy90aGlzLnNldF92YWx1ZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZV9vcHRpb25zKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgdXBkYXRlX29wdGlvbnM6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBvbGRfdmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgICBpZiggdGhpcy5rb250YWluZXIucmVhZHkgKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5rb250YWluZXIuZ2V0KCk7XG4gICAgICAgICAgICBpZiggdHlwZW9mIHRoaXMudmFsdWUgPT0gXCJvYmplY3RcIikgdGhpcy52YWx1ZSA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCB0aGlzLm9wdGlvbnNLb250YWluZXIucmVhZHkgJiYgdGhpcy5rb250YWluZXIucmVhZHkgKSB7XG4gICAgICAgICAgICB2YXIgb2xkX29wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnNLb250YWluZXIuZ2V0KCk7XG4gICAgICAgICAgICBpZiggdGhpcy5vcHRpb25zIGluc3RhbmNlb2YgQXJyYXkgKXtcbiAgICAgICAgICAgICAgICAvL3RoaXMub3B0aW9ucy51bnNoaWZ0KCcnKTtcbiAgICAgICAgICAgICAgICBpZiggdGhpcy5vcHRpb25zICE9PSBvbGRfb3B0aW9uc3x8IHRoaXMudmFsdWUgIT09IG9sZF92YWx1ZSApe1xuICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy5vcHRpb25zICE9PSB1bmRlZmluZWQgJiYgdGhpcy5vcHRpb25zIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy5lbGVtLmlubmVySFRNTCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtLmlubmVySFRNTCA9ICc8b3B0aW9uIHNlbGVjdGVkIGRpc2FibGVkIGhpZGRlbj48L29wdGlvbj4nXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSxpZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHRoaXMudmFsdWUgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHZhbHVlLnRvU3RyaW5nKCkgPT09IHRoaXMudmFsdWUudG9TdHJpbmcoKSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2ZvdW5kIGl0OicsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uc2VsZWN0ZWQgPSBcInNlbGVjdGVkXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdkb2VzIG5vdCBtYXRjaDogJywgdmFsdWUsIHRoaXMudmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VsZWN0b3Jfb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnbm8gY3VycmVudCB2YWx1ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbS5hcHBlbmRDaGlsZChvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGVjdG9yX29iaiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rvcl9vYmouY2hhbmdlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2lmKCAhICh0aGlzLm9wdGlvbnMuaW5kZXhPZih0aGlzLmtvbnRhaW5lci5nZXQoKSkrMSkgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgIHRoaXMuc2V0X3ZhbHVlKHRoaXMub3B0aW9uc1swXS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL31cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXRVcGRhdGU6IGZ1bmN0aW9uKHVwZGF0ZV9mdW5jdGlvbil7XG4gICAgICAgIHRoaXMuZ191cGRhdGUgPSB1cGRhdGVfZnVuY3Rpb247XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0UmVmOiBmdW5jdGlvbihyZWZTdHJpbmcpe1xuICAgICAgICB0aGlzLnJlZlN0cmluZyA9IHJlZlN0cmluZztcbiAgICAgICAgaWYoIHRoaXMua29udGFpbmVyID09PSB1bmRlZmluZWQgJiYgdGhpcy5yZWZPYmplY3QgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMua29udGFpbmVyICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lci5yZWYodGhpcy5yZWZTdHJpbmcpO1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIub2JqKHRoaXMucmVmT2JqZWN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0UmVmT2JqOiBmdW5jdGlvbihyZWZPYmplY3Qpe1xuICAgICAgICB0aGlzLnJlZk9iamVjdCA9IHJlZk9iamVjdDtcbiAgICAgICAgaWYoIHRoaXMua29udGFpbmVyID09PSB1bmRlZmluZWQgJiYgdGhpcy5yZWZTdHJpbmcgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMua29udGFpbmVyICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lci5yZWYodGhpcy5yZWZTdHJpbmcpO1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIub2JqKHRoaXMucmVmT2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiggdGhpcy5vcHRpb25zS29udGFpbmVyID09PSB1bmRlZmluZWQgJiYgdGhpcy5yZWZPcHRpb25zU3RyaW5nICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc0tvbnRhaW5lciA9IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiggdGhpcy5vcHRpb25zS29udGFpbmVyICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNLb250YWluZXIucmVmKHRoaXMucmVmT3B0aW9uc1N0cmluZyk7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNLb250YWluZXIub2JqKHRoaXMucmVmT2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldE9wdGlvbnNSZWY6IGZ1bmN0aW9uKHJlZlN0cmluZyl7XG4gICAgICAgIHRoaXMucmVmT3B0aW9uc1N0cmluZyA9IHJlZlN0cmluZztcbiAgICAgICAgaWYoIHRoaXMub3B0aW9uc0tvbnRhaW5lciA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmVmT2JqZWN0ICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc0tvbnRhaW5lciA9IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiggdGhpcy5vcHRpb25zS29udGFpbmVyICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNLb250YWluZXIucmVmKHRoaXMucmVmT3B0aW9uc1N0cmluZyk7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNLb250YWluZXIub2JqKHRoaXMucmVmT2JqZWN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG59O1xuZm9yKCB2YXIgaWQgaW4gd3JhcHBlcl9wcm90b3R5cGUgKSB7XG4gICAgaWYoIHdyYXBwZXJfcHJvdG90eXBlLmhhc093blByb3BlcnR5KGlkKSApIHtcbiAgICAgICAgc2VsZWN0b3JfcHJvdG90eXBlW2lkXSA9IHdyYXBwZXJfcHJvdG90eXBlW2lkXTtcbiAgICB9XG59XG5cbnZhciBzZWxlY3RvciA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIHMgPSBPYmplY3QuY3JlYXRlKHNlbGVjdG9yX3Byb3RvdHlwZSk7XG4gICAgcy50eXBlID0gJ3NlbGVjdG9yJztcbiAgICBzLmVsZW09IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgIHMuZWxlbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlbGVjdG9yX21lbnUnKTtcblxuICAgIHJldHVybiBzO1xufTtcblxuXG5cblxuXG52YXIgdmFsdWVfcHJvdG90eXBlID0ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZygncnVubmluZyB2YWx1ZSB1cGRhdGUnLCB0aGlzKVxuICAgICAgICAvKlxuICAgICAgICBpZiggdGhpcy5nX3VwZGF0ZSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLmdfdXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgKi9cbiAgICAgICB2YXIgZGVjaW1hbHMgPSB0aGlzLmRlY2ltYWxzIHx8IDM7XG4gICAgICAgIGlmKCB0eXBlb2YgdGhpcy5rb250YWluZXIgIT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5rb250YWluZXIuZ2V0KCk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCd1cGRhdGluZyB2YWx1ZScsIHRoaXMudmFsdWUpXG4gICAgICAgIH1cbiAgICAgICAgaWYoIGlzTmFOKE51bWJlcih0aGlzLnZhbHVlKSkgKXtcbiAgICAgICAgICAgIHRoaXMuZWxlbS5pbm5lckhUTUwgPSB0aGlzLnZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5lbGVtLmlubmVySFRNTCA9IE51bWJlcih0aGlzLnZhbHVlKS50b0ZpeGVkKGRlY2ltYWxzKTtcbiAgICAgICAgICAgIGlmKCB0aGlzLm1pbiAhPT0gdW5kZWZpbmVkICYmIHRoaXMudmFsdWUgPD0gdGhpcy5taW4gKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRyKCdjbGFzcycsICd2YWx1ZU91dE9mUmFuZ2UnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiggdGhpcy5tYXggIT09IHVuZGVmaW5lZCAmJiB0aGlzLnZhbHVlID49IHRoaXMubWF4ICkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0cignY2xhc3MnLCAndmFsdWVPdXRPZlJhbmdlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0cignY2xhc3MnLCAnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKG5ld192YWx1ZSkge1xuICAgICAgICBpZiggdHlwZW9mIG5ld192YWx1ZSAhPT0gJ3VuZGVmaW5lZCcgKXtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBuZXdfdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbi8vICAgIHNldFVwZGF0ZTogZnVuY3Rpb24odXBkYXRlX2Z1bmN0aW9uKXtcbi8vICAgICAgICB0aGlzLmdfdXBkYXRlID0gdXBkYXRlX2Z1bmN0aW9uO1xuLy8gICAgfSxcbiAgICBzZXRSZWY6IGZ1bmN0aW9uKHJlZlN0cmluZyl7XG4gICAgICAgIHRoaXMucmVmU3RyaW5nID0gcmVmU3RyaW5nO1xuICAgICAgICBpZiggdGhpcy5rb250YWluZXIgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlZk9iamVjdCAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lciA9IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiggdGhpcy5rb250YWluZXIgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLnJlZih0aGlzLnJlZlN0cmluZyk7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lci5vYmoodGhpcy5yZWZPYmplY3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXRSZWZPYmo6IGZ1bmN0aW9uKHJlZk9iamVjdCl7XG4gICAgICAgIHRoaXMucmVmT2JqZWN0ID0gcmVmT2JqZWN0O1xuICAgICAgICBpZiggdGhpcy5rb250YWluZXIgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlZlN0cmluZyAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lciA9IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiggdGhpcy5rb250YWluZXIgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLnJlZih0aGlzLnJlZlN0cmluZyk7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lci5vYmoodGhpcy5yZWZPYmplY3QpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0TWF4OiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgIHRoaXMubWF4ID0gdmFsdWU7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0TWluOiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgIHRoaXMubWluID0gdmFsdWU7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0RGVjaW1hbHM6IGZ1bmN0aW9uKG4pe1xuICAgICAgICB0aGlzLmRlY2ltYWxzID0gbjtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbn07XG5mb3IoIHZhciBpZCBpbiB3cmFwcGVyX3Byb3RvdHlwZSApIHtcbiAgICBpZiggd3JhcHBlcl9wcm90b3R5cGUuaGFzT3duUHJvcGVydHkoaWQpICkge1xuICAgICAgICB2YWx1ZV9wcm90b3R5cGVbaWRdID0gd3JhcHBlcl9wcm90b3R5cGVbaWRdO1xuICAgIH1cbn1cblxuXG5cbmZ1bmN0aW9uIHZhbHVlKCkge1xuICAgIHZhciB2ID0gT2JqZWN0LmNyZWF0ZSh2YWx1ZV9wcm90b3R5cGUpO1xuICAgIHYudHlwZSA9ICd2YWx1ZSc7XG4gICAgdi5lbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXG4gICAgdi52YWx1ZSA9ICctJztcbiAgICB2LmlubmVySFRNTCA9IHYudmFsdWU7XG4gICAgdi5yZWZlcmVuY2UgPSBmYWxzZTtcblxuXG4gICAgdi51cGRhdGUoKTtcblxuICAgIHJldHVybiB2O1xufVxuXG5cblxuLy8gQnJvd3NlcmlmeVxubW9kdWxlLmV4cG9ydHMuc2VsZWN0b3IgPSBzZWxlY3Rvcjtcbm1vZHVsZS5leHBvcnRzLnZhbHVlID0gdmFsdWU7XG4vL21vZHVsZS5leHBvcnRzLiQgPSAkO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIga2RiX3Byb3RvdHlwZSA9IHtcbiAgICBzZXRfZmllbGRzOiBmdW5jdGlvbihmaWVsZF9hcnJheSkge1xuICAgICAgICB2YXIgbGlzdDtcbiAgICAgICAgaWYoIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdzdHJpbmcnICkgeyAgLy8gZWFjaCBhcmd1bWVudCBpcyBhIGZpZWxkXG4gICAgICAgICAgICBsaXN0ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTsgLy9jb252ZXJ0IGFyZ3VtZW50cyB0byBhbiBhcnJheVxuICAgICAgICB9IGVsc2UgeyAvLyBhc3N1bWVkIGxpc3Qgb2YgZmllbGRzXG4gICAgICAgICAgICBsaXN0ID0gYXJndW1lbnRbMF07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZpZWxkcyA9IFtdXG4gICAgICAgIGxpc3QuZm9yRWFjaCggZnVuY3Rpb24oZmllbGQpIHtcbiAgICAgICAgICAgIHRoaXMuZmllbGRzLnB1c2goZmllbGQpIDtcbiAgICAgICAgfSx0aGlzKSBcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgYWRkOiBmdW5jdGlvbihlbnRyeSkge1xuICAgICAgICB2YXIgbGlzdDtcbiAgICAgICAgdmFyIG9iaiA9IHt9O1xuXG4gICAgICAgIGlmKCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZW50cnkpID09PSAnW29iamVjdCBBcnJheV0nICkgeyAvLyBpZiBsaXN0IGlzIHN1Ym1pdHRlZFxuICAgICAgICAgICAgbGlzdCA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgfSBlbHNlIGlmKCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZW50cnkpID09PSAnW29iamVjdCBPYmplY3RdJyApIHsgLy8gaWYgb2JqZWN0IGlzIHN1Ym1pdHRlZFxuICAgICAgICAgICAgb2JqID0gYXJndW1lbnRzWzBdO1xuICAgICAgICB9IGVsc2UgeyAgLy8gZWFjaCBhcmd1bWVudCBpcyBhIGZpZWxkOiBzdHJpbmcsIG51bWJlciwgZXRjLlxuICAgICAgICAgICAgbGlzdCA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7IC8vY29udmVydCBhcmd1bWVudHMgdG8gYW4gYXJyYXlcbiAgICAgICAgfVxuICAgICAgICBpZiggbGlzdCAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgbGlzdC5mb3JFYWNoKCBmdW5jdGlvbiggdmFsdWUsIGkgKSB7XG4gICAgICAgICAgICAgICAgb2JqW3RoaXMuZmllbGRzW2ldXSA9IHZhbHVlO1xuICAgICAgICAgICAgfSx0aGlzKSBcbiAgICAgICAgfVxuXG5cbiAgICAgICAgdGhpcy5yb3dzLnB1c2gob2JqKTtcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIENTVjogZnVuY3Rpb24oc3RyaW5nKXtcbiAgICBcbiAgICBcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24oZmllbGQsIHZhbHVlKXtcbiAgICAgICAgLy92YXIgaCA9IHRoaXMuZmllbGRzLmluZGV4T2YoY29sdW1uKTtcbiAgICAgICAgLy9sb2coaCwgdGhpcy5maWVsZHNbaF0pXG4gICAgICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICAgICAgdGhpcy5yb3dzLmZvckVhY2goIGZ1bmN0aW9uKHJvdyxpZCl7XG4gICAgICAgICAgICBpZiggcm93W2ZpZWxkXSA9PT0gdmFsdWUgKXtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChyb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LHRoaXMpICAgIFxuICAgICAgICBsb2cob3V0cHV0KVxuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH0sXG4gICAgY29sdW1uOiBmdW5jdGlvbihmaWVsZCl7XG4gICAgICAgIHZhciBjb2x1bW4gPSBbXTtcbiAgICAgICAgdGhpcy5yb3dzLmZvckVhY2goIGZ1bmN0aW9uKHJvdyl7XG4gICAgICAgICAgICBjb2x1bW4ucHVzaCggcm93W2ZpZWxkXSApO1xuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gY29sdW1uO1xuICAgIH0sXG59XG5cblxuZnVuY3Rpb24gS0RCKCkge1xuICAgIHZhciBkID0gT2JqZWN0LmNyZWF0ZShrZGJfcHJvdG90eXBlKTtcbiAgICBcbiAgICBkLnJvd3MgPSBbXTtcblxuXG5cbiAgICByZXR1cm4gZDtcbn1cblxuXG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIga29udGFpbmVyID0ge1xuICAgIHJlZjogZnVuY3Rpb24ocmVmU3RyaW5nKXtcbiAgICAgICAgaWYoIHR5cGVvZiByZWZTdHJpbmcgPT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWZTdHJpbmc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlZlN0cmluZyA9IHJlZlN0cmluZztcbiAgICAgICAgICAgIHRoaXMucmVmQXJyYXkgPSByZWZTdHJpbmcuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIGlmKCB0eXBlb2YgdGhpcy5vYmplY3QgIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgb2JqOiBmdW5jdGlvbihvYmope1xuICAgICAgICBpZiggdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9iamVjdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0ID0gb2JqO1xuICAgICAgICAgICAgaWYoIHR5cGVvZiB0aGlzLnJlZlN0cmluZyAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKGlucHV0KXtcbiAgICAgICAgaWYoIHR5cGVvZiB0aGlzLm9iamVjdCA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHRoaXMucmVmU3RyaW5nID09PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLm9iamVjdDtcbiAgICAgICAgdmFyIGxhc3RfbGV2ZWwgPSB0aGlzLnJlZkFycmF5W3RoaXMucmVmQXJyYXkubGVuZ3RoLTFdO1xuXG4gICAgICAgIHRoaXMucmVmQXJyYXkuZm9yRWFjaChmdW5jdGlvbihsZXZlbF9uYW1lLGkpe1xuICAgICAgICAgICAgaWYoIHR5cGVvZiBwYXJlbnRbbGV2ZWxfbmFtZV0gPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgIHBhcmVudFtsZXZlbF9uYW1lXSA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoIGxldmVsX25hbWUgIT09IGxhc3RfbGV2ZWwgKXtcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnRbbGV2ZWxfbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBwYXJlbnRbbGFzdF9sZXZlbF0gPSBpbnB1dDtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnc2V0dGluZzonLCBpbnB1dCwgdGhpcy5nZXQoKSwgdGhpcy5yZWZTdHJpbmcgKTtcbiAgICAgICAgcmV0dXJuIHBhcmVudFtsYXN0X2xldmVsXTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGxldmVsID0gdGhpcy5vYmplY3Q7XG4gICAgICAgIHRoaXMucmVmQXJyYXkuZm9yRWFjaChmdW5jdGlvbihsZXZlbF9uYW1lLGkpe1xuICAgICAgICAgICAgaWYoIHR5cGVvZiBsZXZlbFtsZXZlbF9uYW1lXSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV2ZWwgPSBsZXZlbFtsZXZlbF9uYW1lXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBsZXZlbDtcbiAgICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrb250YWluZXI7XG4iLCJ2YXIgd3JhcHBlcl9wcm90b3R5cGUgPSB7XG5cbiAgICBodG1sOiBmdW5jdGlvbihodG1sKXtcbiAgICAgICB0aGlzLmVsZW0uaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGhyZWY6IGZ1bmN0aW9uKGxpbmspe1xuICAgICAgIHRoaXMuZWxlbS5ocmVmID0gbGluaztcbiAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGFwcGVuZDogZnVuY3Rpb24oc3ViX2VsZW1lbnQpe1xuICAgICAgICB0aGlzLmdldCgwKS5hcHBlbmRDaGlsZChzdWJfZWxlbWVudC5lbGVtKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBhcHBlbmRUbzogZnVuY3Rpb24ocGFyZW50X2VsZW1lbnQpe1xuICAgICAgICAvL3BhcmVudF9lbGVtZW50LmFwcGVuZCh0aGlzKTtcbiAgICAgICAgcGFyZW50X2VsZW1lbnQuZ2V0KDApLmFwcGVuZENoaWxkKHRoaXMuZWxlbSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgYXR0cjogZnVuY3Rpb24obmFtZSwgdmFsdWUpe1xuICAgICAgICB2YXIgYXR0cmlidXRlTmFtZTtcbiAgICAgICAgaWYoIG5hbWUgPT09ICdjbGFzcycpe1xuICAgICAgICAgICAgYXR0cmlidXRlTmFtZSA9ICdjbGFzc05hbWUnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0cmlidXRlTmFtZSA9IG5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtW2F0dHJpYnV0ZU5hbWVdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY2xpY2s6IGZ1bmN0aW9uKGNsaWNrRnVuY3Rpb24pe1xuICAgICAgICBjb25zb2xlLmxvZygnc2V0dGluZyBjbGljayB0byAnLCB0eXBlb2YgY2xpY2tGdW5jdGlvbiwgY2xpY2tGdW5jdGlvbilcbiAgICAgICAgdGhpcy5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpeyBjbGlja0Z1bmN0aW9uKCk7IH0sIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzaG93OiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLmVsZW0uc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUnO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGhpZGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHN0eWxlOiBmdW5jdGlvbihmaWVsZCwgdmFsdWUpe1xuICAgICAgICB0aGlzLmVsZW0uc3R5bGVbZmllbGRdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgY3NzOiBmdW5jdGlvbihmaWVsZCwgdmFsdWUpe1xuICAgICAgICB0aGlzLmVsZW0uc3R5bGVbZmllbGRdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgLypcbiAgICAvKlxuICAgIHB1c2hUbzogZnVuY3Rpb24oYXJyYXkpe1xuICAgICAgICBhcnJheS5wdXNoKHRoaXMpO1xuICAgIH1cbiAgICAqL1xuICAgIGdldDogZnVuY3Rpb24oaSl7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1cbn1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB3cmFwcGVyX3Byb3RvdHlwZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLy92YXIgdmVyc2lvbl9zdHJpbmcgPSBcIkRldlwiO1xudmFyIHZlcnNpb25fc3RyaW5nID0gXCJBbHBoYTIwMTQxMjE4XCI7XG5cbi8vIE1vdmVkIHRvIGluZGV4Lmh0bWxcbi8vIFRPRE86IGxvb2sgaW50byB3YXlzIHRvIGZ1cnRoZXIgcmVkdWNlIHNpemUuIEl0IHNlZW1zIHdheSB0byBiaWcuXG4vL3ZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuLy92YXIgbW9tZW50ID0gcmVxdWlyZSgnbW9tZW50Jyk7XG4vL3ZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbnZhciBrID0gcmVxdWlyZSgnLi9saWIvay9rLmpzJyk7XG52YXIga19kYXRhID0gcmVxdWlyZSgnLi9saWIvay9rX2RhdGEnKTtcbnZhciBrJCA9IHJlcXVpcmUoJy4vbGliL2sva19ET00nKTtcblxudmFyIG1rX3BhZ2UgPSB7fTtcbm1rX3BhZ2VbMV0gPSByZXF1aXJlKCcuL2FwcC9ta19wYWdlXzEnKTtcbm1rX3BhZ2VbMl0gPSByZXF1aXJlKCcuL2FwcC9ta19wYWdlXzInKTtcbm1rX3BhZ2VbM10gPSByZXF1aXJlKCcuL2FwcC9ta19wYWdlXzMnKTtcblxudmFyIG1rX3N2Zz0gcmVxdWlyZSgnLi9hcHAvbWtfc3ZnJyk7XG4vL3ZhciBta19wZGYgPSByZXF1aXJlKCcuL2FwcC9ta19wZGYuanMnKTtcbnZhciB1cGRhdGVfc3lzdGVtID0gcmVxdWlyZSgnLi9hcHAvdXBkYXRlX3N5c3RlbScpO1xuXG52YXIgc2V0dGluZ3MgPSByZXF1aXJlKCcuL2FwcC9zZXR0aW5ncycpO1xuc2V0dGluZ3Muc3RhdGUudmVyc2lvbl9zdHJpbmcgPSB2ZXJzaW9uX3N0cmluZztcbmNvbnNvbGUubG9nKCdzZXR0aW5ncycsIHNldHRpbmdzKTtcblxuXG52YXIgZiA9IHJlcXVpcmUoJy4vYXBwL2Z1bmN0aW9ucycpO1xuXG5mLnNldHRpbmdzID0gc2V0dGluZ3M7XG5zZXR0aW5ncy5mID0gZjtcblxuLy92YXIgZGF0YWJhc2VfanNvbl9VUkwgPSBcImh0dHA6Ly8xMC4xNzMuNjQuMjA0OjgwMDAvdGVtcG9yYXJ5L1wiO1xudmFyIGRhdGFiYXNlX2pzb25fVVJMID0gXCJkYXRhL2ZzZWNfY29weS5qc29uXCI7XG5cbnZhciBjb21wb25lbnRzID0gc2V0dGluZ3MuY29tcG9uZW50cztcbnZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5cblxuXG4kLmdldEpTT04oIGRhdGFiYXNlX2pzb25fVVJMKVxuICAgIC5kb25lKGZ1bmN0aW9uKGpzb24pe1xuICAgICAgICBzZXR0aW5ncy5kYXRhYmFzZSA9IGpzb247XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2RhdGFiYXNlIGxvYWRlZCcsIHNldHRpbmdzLmRhdGFiYXNlKTtcbiAgICAgICAgZi5sb2FkX2RhdGFiYXNlKGpzb24pO1xuICAgICAgICBzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQgPSB0cnVlO1xuICAgICAgICB1cGRhdGUoKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggJ3NldHRpbmdzLmVsZW1lbnRzJywgSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MuZWxlbWVudHMsIG51bGwsIDQpKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggJ3N5c3RlbScsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzLnN5c3RlbSwgbnVsbCwgNCkpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCAnaW5wdXRzJywgSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MuaW5wdXRzLCBudWxsLCA0KSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coICdkcmF3aW5nJywgSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MuZHJhd2luZywgbnVsbCwgNCkpO1xuICAgIH0pO1xuXG5cblxudmFyIHVwZGF0ZSA9IHNldHRpbmdzLnVwZGF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgY29uc29sZS5sb2coJy8tLS0gYmVnaW4gdXBkYXRlJyk7XG5cbiAgICBmb3IoIHZhciBzZWN0aW9uX25hbWUgaW4gc2V0dGluZ3MuaW5wdXRzICl7XG4gICAgICAgIC8vY29uc29sZS5sb2coIHNlY3Rpb25fbmFtZSwgZi5zZWN0aW9uX2RlZmluZWQoc2VjdGlvbl9uYW1lKSApO1xuICAgIH1cblxuXG4gICAgc2V0dGluZ3Muc2VsZWN0X3JlZ2lzdHJ5LmZvckVhY2goZnVuY3Rpb24oc2VsZWN0b3Ipe1xuICAgICAgICAvL2NvbnNvbGUubG9nKHNlbGVjdG9yLnZhbHVlKCkpO1xuICAgICAgICBpZihzZWxlY3Rvci52YWx1ZSgpKSBzZWxlY3Rvci5zeXN0ZW1fcmVmLnNldChzZWxlY3Rvci52YWx1ZSgpKTtcbiAgICAgICAgaWYoc2VsZWN0b3IudmFsdWUoKSkgc2VsZWN0b3IuaW5wdXRfcmVmLnNldChzZWxlY3Rvci52YWx1ZSgpKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxlY3Rvci5zZXRfcmVmLnJlZlN0cmluZywgc2VsZWN0b3IudmFsdWUoKSwgc2VsZWN0b3Iuc2V0X3JlZi5nZXQoKSk7XG5cbiAgICB9KTtcblxuXG4gICAgLy9jb3B5IGlucHV0cyBmcm9tIHNldHRpbmdzLmlucHV0IHRvIHNldHRpbmdzLnN5c3RlbS5cblxuXG4gICAgdXBkYXRlX3N5c3RlbShzZXR0aW5ncyk7XG5cbiAgICBzZXR0aW5ncy5zZWxlY3RfcmVnaXN0cnkuZm9yRWFjaChmdW5jdGlvbihzZWxlY3Rvcil7XG4gICAgICAgIGYuc2VsZWN0b3JfYWRkX29wdGlvbnMoc2VsZWN0b3IpO1xuICAgIH0pO1xuXG4gICAgc2V0dGluZ3MudmFsdWVfcmVnaXN0cnkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZV9pdGVtKXtcbiAgICAgICAgdmFsdWVfaXRlbS5lbGVtLmlubmVySFRNTCA9IHZhbHVlX2l0ZW0udmFsdWVfcmVmLmdldCgpO1xuICAgIH0pO1xuXG5cblxuICAgIC8vIE1ha2UgZHJhd2luZ1xuICAgIHNldHRpbmdzLmRyYXdpbmcucGFydHMgPSB7fTtcbiAgICBzZXR0aW5ncy5kcmF3aW5nLnN2Z3MgPSB7fTtcbiAgICAkKFwiI2RyYXdpbmdcIikuaHRtbCgnJyk7XG5cbiAgICBmb3IoIHZhciBwIGluIG1rX3BhZ2UgKXtcbiAgICAgICAgc2V0dGluZ3MuZHJhd2luZy5wYXJ0c1twXSA9IG1rX3BhZ2VbcF0oc2V0dGluZ3MpO1xuICAgICAgICBzZXR0aW5ncy5kcmF3aW5nLnN2Z3NbcF0gPSBta19zdmcoc2V0dGluZ3MuZHJhd2luZy5wYXJ0c1twXSwgc2V0dGluZ3MpO1xuICAgICAgICAkKFwiI2RyYXdpbmdcIilcbiAgICAgICAgICAgIC8vLmFwcGVuZCgkKFwiPHA+UGFnZSBcIitwK1wiPC9wPlwiKSlcbiAgICAgICAgICAgIC5hcHBlbmQoJChzZXR0aW5ncy5kcmF3aW5nLnN2Z3NbcF0pKVxuICAgICAgICAgICAgLmFwcGVuZCgkKFwiPC9icj5cIikpXG4gICAgICAgICAgICAuYXBwZW5kKCQoXCI8L2JyPlwiKSk7XG5cbiAgICB9XG5cblxuICAgIC8vKi9cbiAgICAvL3ZhciBwZGZfZG93bmxvYWQgPSBta19wZGYoc2V0dGluZ3MsIHNldERvd25sb2FkTGluayk7XG4gICAgLy9ta19wZGYoc2V0dGluZ3MsIHNldERvd25sb2FkTGluayk7XG4gICAgLy9wZGZfZG93bmxvYWQuaHRtbChcIkRvd25sb2FkIFBERlwiKTtcbiAgICAvL2NvbnNvbGUubG9nKHBkZl9kb3dubG9hZCk7XG4gICAgLy9pZiggc2V0dGluZ3MuUERGICYmIHNldHRpbmdzLlBERi51cmwgKXtcbiAgICAvLyAgICB2YXIgbGluayA9ICQoJ2EnKS5hdHRyKCdocmVmJywgc2V0dGluZ3MuUERGLnVybCApLmh0bWwoJ2Rvd25sb2FkLi4nKTtcbiAgICAvLyAgICAkKCcjZG93bmxvYWQnKS5hcHBlbmQobGluayk7XG4gICAgLy99XG5cblxuICAgIC8vay5zaG93X2hpZGVfcGFyYW1zKHBhZ2Vfc2VjdGlvbnNfcGFyYW1zLCBzZXR0aW5ncyk7XG4vLyAgICBzaG93X2hpZGVfc2VsZWN0aW9ucyhwYWdlX3NlY3Rpb25zX2NvbmZpZywgc2V0dGluZ3Muc3RhdGUuYWN0aXZlX3NlY3Rpb24pO1xuXG4gICAgLy9jb25zb2xlLmxvZyggZi5vYmplY3RfZGVmaW5lZChzZXR0aW5ncy5zdGF0ZSkgKTtcblxuICAgIC8vY29uc29sZS5sb2coICdzeXN0ZW0nLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncy5zeXN0ZW0sIG51bGwsIDQpKTtcbiAgICAvL2NvbnNvbGUubG9nKCAnaW5wdXRzJywgSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MuaW5wdXRzLCBudWxsLCA0KSk7XG4gICAgLy9jb25zb2xlLmxvZyggJ2RyYXdpbmcnLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncy5kcmF3aW5nLCBudWxsLCA0KSk7XG5cbiAgICBjb25zb2xlLmxvZygnXFxcXC0tLSBlbmQgdXBkYXRlJyk7XG59O1xuZi51cGRhdGUgPSB1cGRhdGU7XG5cblxuXG5cblxuXG5cblxuXG4vLyBEZXYgc2V0dGluZ3Ncbi8qXG5pZiggdmVyc2lvbl9zdHJpbmcgPT09ICdEZXYnICYmIHRydWUgKXtcbiAgICBmb3IoIHZhciBzZWN0aW9uIGluIHNldHRpbmdzLnN0YXRlLnNlY3Rpb25zICl7XG4gICAgICAgIHNldHRpbmdzLnN0YXRlLnNlY3Rpb25zW3NlY3Rpb25dLnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgc2V0dGluZ3Muc3RhdGUuc2VjdGlvbnNbc2VjdGlvbl0uc2V0ID0gdHJ1ZTtcbiAgICB9XG59IGVsc2Uge1xuICAgIHNldHRpbmdzLnN0YXRlLnNlY3Rpb25zLm1vZHVsZXMucmVhZHkgPSB0cnVlO1xufVxuLy8qL1xuLy8vLy8vLy9cblxuXG5cblxuZnVuY3Rpb24gcGFnZV9zZXR1cChzZXR0aW5ncyl7XG4gICAgdmFyIHN5c3RlbV9mcmFtZV9pZCA9ICdzeXN0ZW1fZnJhbWUnO1xuICAgIHZhciB0aXRsZSA9ICdQViBkcmF3aW5nIHRlc3QnO1xuXG4gICAgay5zZXR1cF9ib2R5KHRpdGxlKTtcblxuICAgIHZhciBwYWdlID0gJCgnPGRpdj4nKS5hdHRyKCdjbGFzcycsICdwYWdlJykuYXBwZW5kVG8oJChkb2N1bWVudC5ib2R5KSk7XG4gICAgLy9wYWdlLnN0eWxlKCd3aWR0aCcsIChzZXR0aW5ncy5kcmF3aW5nLnNpemUuZHJhd2luZy53KzIwKS50b1N0cmluZygpICsgXCJweFwiIClcblxuICAgIHZhciBzeXN0ZW1fZnJhbWUgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgc3lzdGVtX2ZyYW1lX2lkKS5hcHBlbmRUbyhwYWdlKTtcblxuXG4gICAgdmFyIGhlYWRlcl9jb250YWluZXIgPSBrJCgnZGl2JykuYXBwZW5kVG8oc3lzdGVtX2ZyYW1lKTtcbiAgICBrJCgnc3BhbicpLmh0bWwoJ1BsZWFzZSBzZWxlY3QgeW91ciBzeXN0ZW0gc3BlYyBiZWxvdycpLmF0dHIoJ2NsYXNzJywgJ2NhdGVnb3J5X3RpdGxlJykuYXBwZW5kVG8oaGVhZGVyX2NvbnRhaW5lcik7XG4gICAgayQoJ3NwYW4nKS5odG1sKCcgfCAnKS5hcHBlbmRUbyhoZWFkZXJfY29udGFpbmVyKTtcbiAgICAvL2skKCdpbnB1dCcpLmF0dHIoJ3R5cGUnLCAnYnV0dG9uJykuYXR0cigndmFsdWUnLCAnY2xlYXIgc2VsZWN0aW9ucycpLmNsaWNrKHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQpLFxuICAgIGskKCdhJykuYXR0cignaHJlZicsICdqYXZhc2NyaXB0OndpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKScpLmh0bWwoJ2NsZWFyIHNlbGVjdGlvbnMnKS5hcHBlbmRUbyhoZWFkZXJfY29udGFpbmVyKTtcblxuXG4gICAgLy8gU3lzdGVtIHNldHVwXG4gICAgJCgnPGRpdj4nKS5odG1sKCdTeXN0ZW0gU2V0dXAnKS5hdHRyKCdjbGFzcycsICdzZWN0aW9uX3RpdGxlJykuYXBwZW5kVG8oc3lzdGVtX2ZyYW1lKTtcbiAgICB2YXIgY29uZmlnX2ZyYW1lID0gJCgnPGRpdj4nKS5hdHRyKCdpZCcsICdjb25maWdfZnJhbWUnKS5hcHBlbmRUbyhzeXN0ZW1fZnJhbWUpO1xuXG4gICAgLy9jb25zb2xlLmxvZyhzZWN0aW9uX3NlbGVjdG9yKTtcbiAgICBmLmFkZF9zZWxlY3RvcnMoc2V0dGluZ3MsIGNvbmZpZ19mcmFtZSk7XG5cbiAgICAvLyBQYXJhbWV0ZXJzIGFuZCBzcGVjaWZpY2F0aW9uc1xuICAgICQoJzxkaXY+JykuaHRtbCgnU3lzdGVtIFBhcmFtZXRlcnMnKS5hdHRyKCdjbGFzcycsICdzZWN0aW9uX3RpdGxlJykuYXBwZW5kVG8oc3lzdGVtX2ZyYW1lKTtcbiAgICB2YXIgcGFyYW1zX2NvbnRhaW5lciA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAnc2VjdGlvbicpO1xuICAgIHBhcmFtc19jb250YWluZXIuYXBwZW5kVG8oc3lzdGVtX2ZyYW1lKTtcbiAgICBmLmFkZF9wYXJhbXMoIHNldHRpbmdzLCBwYXJhbXNfY29udGFpbmVyICk7XG5cbiAgICAvL1RPRE86IGFkZCBzdmcgZGlzcGxheSBvZiBtb2R1bGVzXG4gICAgLy8gaHR0cDovL3F1b3RlLnNuYXBucmFjay5jb20vdWkvbzEwMC5waHAjc3RlcC0yXG5cbiAgICAvLyBkcmF3aW5nXG4gICAgLy92YXIgZHJhd2luZyA9ICQoJ2RpdicpLmF0dHIoJ2lkJywgJ2RyYXdpbmdfZnJhbWUnKS5hdHRyKCdjbGFzcycsICdzZWN0aW9uJykuYXBwZW5kVG8ocGFnZSk7XG4gICAgdmFyIGRyYXdpbmcgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2RyYXdpbmdfZnJhbWUnKS5hcHBlbmRUbyhwYWdlKTtcbiAgICBkcmF3aW5nLmNzcygnd2lkdGgnLCAoc2V0dGluZ3MuZHJhd2luZy5zaXplLmRyYXdpbmcudysyMCkudG9TdHJpbmcoKSArIFwicHhcIiApO1xuICAgICQoJzxkaXY+JykuaHRtbCgnRHJhd2luZycpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25fdGl0bGUnKS5hcHBlbmRUbyhkcmF3aW5nKTtcbiAgICAvKlxuICAgIHZhciBwYWdlX3NlbGVjdG9yID0gayQoJ3NlbGVjdG9yJylcbiAgICAgICAgLnNldE9wdGlvbnNSZWYoICdjb25maWdfb3B0aW9ucy5wYWdlX29wdGlvbnMnIClcbiAgICAgICAgLnNldFJlZignc3RhdGUuYWN0aXZlX3BhZ2UnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnY29ybmVyX3RpdGxlJylcbiAgICAgICAgLmFwcGVuZFRvKGRyYXdpbmcpO1xuICAgIC8vZi5rZWxlbV9zZXR1cChwYWdlX3NlbGVjdG9yLCBzZXR0aW5ncyk7XG4gICAgLy8qL1xuICAgIC8vY29uc29sZS5sb2cocGFnZV9zZWxlY3RvcilcblxuICAgIC8vayQoJ3NwYW4nKS5hdHRyKCdpZCcsICdkb3dubG9hZCcpLmF0dHIoJ2NsYXNzJywgJ2Zsb2F0X3JpZ2h0JykuYXBwZW5kVG8oZHJhd2luZyk7XG5cbiAgICB2YXIgc3ZnX2NvbnRhaW5lcl9vYmplY3QgPSBrJCgnZGl2JykuYXR0cignaWQnLCAnZHJhd2luZycpLmF0dHIoJ2NsYXNzJywgJ2RyYXdpbmcnKS5jc3MoJ2NsZWFyJywgJ2JvdGgnKS5hcHBlbmRUbyhkcmF3aW5nKTtcbiAgICAvL3N2Z19jb250YWluZXJfb2JqZWN0LnN0eWxlKCd3aWR0aCcsIHNldHRpbmdzLmRyYXdpbmcuc2l6ZS5kcmF3aW5nLncrXCJweFwiIClcbiAgICB2YXIgc3ZnX2NvbnRhaW5lciA9IHN2Z19jb250YWluZXJfb2JqZWN0LmVsZW07XG4gICAgJCgnPGJyPicpLmFwcGVuZFRvKGRyYXdpbmcpO1xuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICQoJzxkaXY+JykuaHRtbCgnICcpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25fdGl0bGUnKS5hcHBlbmRUbyhkcmF3aW5nKTtcblxufVxuXG5wYWdlX3NldHVwKHNldHRpbmdzKTtcblxudmFyIGJvb3RfdGltZSA9IG1vbWVudCgpO1xudmFyIHN0YXR1c19pZCA9IFwic3RhdHVzXCI7XG5zZXRJbnRlcnZhbChmdW5jdGlvbigpeyBrLnVwZGF0ZV9zdGF0dXNfcGFnZShzdGF0dXNfaWQsIGJvb3RfdGltZSwgdmVyc2lvbl9zdHJpbmcpO30sMTAwMCk7XG5cbnVwZGF0ZSgpO1xuXG5jb25zb2xlLmxvZygnc2V0dGluZ3MnLCBzZXR0aW5ncyk7XG5cbi8vY29uc29sZS5sb2coJ3dpbmRvdycsIHdpbmRvdyk7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vLyEgbW9tZW50LmpzXG4vLyEgdmVyc2lvbiA6IDIuOC4zXG4vLyEgYXV0aG9ycyA6IFRpbSBXb29kLCBJc2tyZW4gQ2hlcm5ldiwgTW9tZW50LmpzIGNvbnRyaWJ1dG9yc1xuLy8hIGxpY2Vuc2UgOiBNSVRcbi8vISBtb21lbnRqcy5jb21cblxuKGZ1bmN0aW9uICh1bmRlZmluZWQpIHtcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIENvbnN0YW50c1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIHZhciBtb21lbnQsXG4gICAgICAgIFZFUlNJT04gPSAnMi44LjMnLFxuICAgICAgICAvLyB0aGUgZ2xvYmFsLXNjb3BlIHRoaXMgaXMgTk9UIHRoZSBnbG9iYWwgb2JqZWN0IGluIE5vZGUuanNcbiAgICAgICAgZ2xvYmFsU2NvcGUgPSB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbCA6IHRoaXMsXG4gICAgICAgIG9sZEdsb2JhbE1vbWVudCxcbiAgICAgICAgcm91bmQgPSBNYXRoLnJvdW5kLFxuICAgICAgICBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksXG4gICAgICAgIGksXG5cbiAgICAgICAgWUVBUiA9IDAsXG4gICAgICAgIE1PTlRIID0gMSxcbiAgICAgICAgREFURSA9IDIsXG4gICAgICAgIEhPVVIgPSAzLFxuICAgICAgICBNSU5VVEUgPSA0LFxuICAgICAgICBTRUNPTkQgPSA1LFxuICAgICAgICBNSUxMSVNFQ09ORCA9IDYsXG5cbiAgICAgICAgLy8gaW50ZXJuYWwgc3RvcmFnZSBmb3IgbG9jYWxlIGNvbmZpZyBmaWxlc1xuICAgICAgICBsb2NhbGVzID0ge30sXG5cbiAgICAgICAgLy8gZXh0cmEgbW9tZW50IGludGVybmFsIHByb3BlcnRpZXMgKHBsdWdpbnMgcmVnaXN0ZXIgcHJvcHMgaGVyZSlcbiAgICAgICAgbW9tZW50UHJvcGVydGllcyA9IFtdLFxuXG4gICAgICAgIC8vIGNoZWNrIGZvciBub2RlSlNcbiAgICAgICAgaGFzTW9kdWxlID0gKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSxcblxuICAgICAgICAvLyBBU1AuTkVUIGpzb24gZGF0ZSBmb3JtYXQgcmVnZXhcbiAgICAgICAgYXNwTmV0SnNvblJlZ2V4ID0gL15cXC8/RGF0ZVxcKChcXC0/XFxkKykvaSxcbiAgICAgICAgYXNwTmV0VGltZVNwYW5Kc29uUmVnZXggPSAvKFxcLSk/KD86KFxcZCopXFwuKT8oXFxkKylcXDooXFxkKykoPzpcXDooXFxkKylcXC4/KFxcZHszfSk/KT8vLFxuXG4gICAgICAgIC8vIGZyb20gaHR0cDovL2RvY3MuY2xvc3VyZS1saWJyYXJ5Lmdvb2dsZWNvZGUuY29tL2dpdC9jbG9zdXJlX2dvb2dfZGF0ZV9kYXRlLmpzLnNvdXJjZS5odG1sXG4gICAgICAgIC8vIHNvbWV3aGF0IG1vcmUgaW4gbGluZSB3aXRoIDQuNC4zLjIgMjAwNCBzcGVjLCBidXQgYWxsb3dzIGRlY2ltYWwgYW55d2hlcmVcbiAgICAgICAgaXNvRHVyYXRpb25SZWdleCA9IC9eKC0pP1AoPzooPzooWzAtOSwuXSopWSk/KD86KFswLTksLl0qKU0pPyg/OihbMC05LC5dKilEKT8oPzpUKD86KFswLTksLl0qKUgpPyg/OihbMC05LC5dKilNKT8oPzooWzAtOSwuXSopUyk/KT98KFswLTksLl0qKVcpJC8sXG5cbiAgICAgICAgLy8gZm9ybWF0IHRva2Vuc1xuICAgICAgICBmb3JtYXR0aW5nVG9rZW5zID0gLyhcXFtbXlxcW10qXFxdKXwoXFxcXCk/KE1vfE1NP00/TT98RG98REREb3xERD9EP0Q/fGRkZD9kP3xkbz98d1tvfHddP3xXW298V10/fFF8WVlZWVlZfFlZWVlZfFlZWVl8WVl8Z2coZ2dnPyk/fEdHKEdHRz8pP3xlfEV8YXxBfGhoP3xISD98bW0/fHNzP3xTezEsNH18WHx6ej98Wlo/fC4pL2csXG4gICAgICAgIGxvY2FsRm9ybWF0dGluZ1Rva2VucyA9IC8oXFxbW15cXFtdKlxcXSl8KFxcXFwpPyhMVHxMTD9MP0w/fGx7MSw0fSkvZyxcblxuICAgICAgICAvLyBwYXJzaW5nIHRva2VuIHJlZ2V4ZXNcbiAgICAgICAgcGFyc2VUb2tlbk9uZU9yVHdvRGlnaXRzID0gL1xcZFxcZD8vLCAvLyAwIC0gOTlcbiAgICAgICAgcGFyc2VUb2tlbk9uZVRvVGhyZWVEaWdpdHMgPSAvXFxkezEsM30vLCAvLyAwIC0gOTk5XG4gICAgICAgIHBhcnNlVG9rZW5PbmVUb0ZvdXJEaWdpdHMgPSAvXFxkezEsNH0vLCAvLyAwIC0gOTk5OVxuICAgICAgICBwYXJzZVRva2VuT25lVG9TaXhEaWdpdHMgPSAvWytcXC1dP1xcZHsxLDZ9LywgLy8gLTk5OSw5OTkgLSA5OTksOTk5XG4gICAgICAgIHBhcnNlVG9rZW5EaWdpdHMgPSAvXFxkKy8sIC8vIG5vbnplcm8gbnVtYmVyIG9mIGRpZ2l0c1xuICAgICAgICBwYXJzZVRva2VuV29yZCA9IC9bMC05XSpbJ2EtelxcdTAwQTAtXFx1MDVGRlxcdTA3MDAtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZFRl0rfFtcXHUwNjAwLVxcdTA2RkZcXC9dKyhcXHMqP1tcXHUwNjAwLVxcdTA2RkZdKyl7MSwyfS9pLCAvLyBhbnkgd29yZCAob3IgdHdvKSBjaGFyYWN0ZXJzIG9yIG51bWJlcnMgaW5jbHVkaW5nIHR3by90aHJlZSB3b3JkIG1vbnRoIGluIGFyYWJpYy5cbiAgICAgICAgcGFyc2VUb2tlblRpbWV6b25lID0gL1p8W1xcK1xcLV1cXGRcXGQ6P1xcZFxcZC9naSwgLy8gKzAwOjAwIC0wMDowMCArMDAwMCAtMDAwMCBvciBaXG4gICAgICAgIHBhcnNlVG9rZW5UID0gL1QvaSwgLy8gVCAoSVNPIHNlcGFyYXRvcilcbiAgICAgICAgcGFyc2VUb2tlblRpbWVzdGFtcE1zID0gL1tcXCtcXC1dP1xcZCsoXFwuXFxkezEsM30pPy8sIC8vIDEyMzQ1Njc4OSAxMjM0NTY3ODkuMTIzXG4gICAgICAgIHBhcnNlVG9rZW5PcmRpbmFsID0gL1xcZHsxLDJ9LyxcblxuICAgICAgICAvL3N0cmljdCBwYXJzaW5nIHJlZ2V4ZXNcbiAgICAgICAgcGFyc2VUb2tlbk9uZURpZ2l0ID0gL1xcZC8sIC8vIDAgLSA5XG4gICAgICAgIHBhcnNlVG9rZW5Ud29EaWdpdHMgPSAvXFxkXFxkLywgLy8gMDAgLSA5OVxuICAgICAgICBwYXJzZVRva2VuVGhyZWVEaWdpdHMgPSAvXFxkezN9LywgLy8gMDAwIC0gOTk5XG4gICAgICAgIHBhcnNlVG9rZW5Gb3VyRGlnaXRzID0gL1xcZHs0fS8sIC8vIDAwMDAgLSA5OTk5XG4gICAgICAgIHBhcnNlVG9rZW5TaXhEaWdpdHMgPSAvWystXT9cXGR7Nn0vLCAvLyAtOTk5LDk5OSAtIDk5OSw5OTlcbiAgICAgICAgcGFyc2VUb2tlblNpZ25lZE51bWJlciA9IC9bKy1dP1xcZCsvLCAvLyAtaW5mIC0gaW5mXG5cbiAgICAgICAgLy8gaXNvIDg2MDEgcmVnZXhcbiAgICAgICAgLy8gMDAwMC0wMC0wMCAwMDAwLVcwMCBvciAwMDAwLVcwMC0wICsgVCArIDAwIG9yIDAwOjAwIG9yIDAwOjAwOjAwIG9yIDAwOjAwOjAwLjAwMCArICswMDowMCBvciArMDAwMCBvciArMDApXG4gICAgICAgIGlzb1JlZ2V4ID0gL15cXHMqKD86WystXVxcZHs2fXxcXGR7NH0pLSg/OihcXGRcXGQtXFxkXFxkKXwoV1xcZFxcZCQpfChXXFxkXFxkLVxcZCl8KFxcZFxcZFxcZCkpKChUfCApKFxcZFxcZCg6XFxkXFxkKDpcXGRcXGQoXFwuXFxkKyk/KT8pPyk/KFtcXCtcXC1dXFxkXFxkKD86Oj9cXGRcXGQpP3xcXHMqWik/KT8kLyxcblxuICAgICAgICBpc29Gb3JtYXQgPSAnWVlZWS1NTS1ERFRISDptbTpzc1onLFxuXG4gICAgICAgIGlzb0RhdGVzID0gW1xuICAgICAgICAgICAgWydZWVlZWVktTU0tREQnLCAvWystXVxcZHs2fS1cXGR7Mn0tXFxkezJ9L10sXG4gICAgICAgICAgICBbJ1lZWVktTU0tREQnLCAvXFxkezR9LVxcZHsyfS1cXGR7Mn0vXSxcbiAgICAgICAgICAgIFsnR0dHRy1bV11XVy1FJywgL1xcZHs0fS1XXFxkezJ9LVxcZC9dLFxuICAgICAgICAgICAgWydHR0dHLVtXXVdXJywgL1xcZHs0fS1XXFxkezJ9L10sXG4gICAgICAgICAgICBbJ1lZWVktREREJywgL1xcZHs0fS1cXGR7M30vXVxuICAgICAgICBdLFxuXG4gICAgICAgIC8vIGlzbyB0aW1lIGZvcm1hdHMgYW5kIHJlZ2V4ZXNcbiAgICAgICAgaXNvVGltZXMgPSBbXG4gICAgICAgICAgICBbJ0hIOm1tOnNzLlNTU1MnLCAvKFR8IClcXGRcXGQ6XFxkXFxkOlxcZFxcZFxcLlxcZCsvXSxcbiAgICAgICAgICAgIFsnSEg6bW06c3MnLCAvKFR8IClcXGRcXGQ6XFxkXFxkOlxcZFxcZC9dLFxuICAgICAgICAgICAgWydISDptbScsIC8oVHwgKVxcZFxcZDpcXGRcXGQvXSxcbiAgICAgICAgICAgIFsnSEgnLCAvKFR8IClcXGRcXGQvXVxuICAgICAgICBdLFxuXG4gICAgICAgIC8vIHRpbWV6b25lIGNodW5rZXIgJysxMDowMCcgPiBbJzEwJywgJzAwJ10gb3IgJy0xNTMwJyA+IFsnLTE1JywgJzMwJ11cbiAgICAgICAgcGFyc2VUaW1lem9uZUNodW5rZXIgPSAvKFtcXCtcXC1dfFxcZFxcZCkvZ2ksXG5cbiAgICAgICAgLy8gZ2V0dGVyIGFuZCBzZXR0ZXIgbmFtZXNcbiAgICAgICAgcHJveHlHZXR0ZXJzQW5kU2V0dGVycyA9ICdEYXRlfEhvdXJzfE1pbnV0ZXN8U2Vjb25kc3xNaWxsaXNlY29uZHMnLnNwbGl0KCd8JyksXG4gICAgICAgIHVuaXRNaWxsaXNlY29uZEZhY3RvcnMgPSB7XG4gICAgICAgICAgICAnTWlsbGlzZWNvbmRzJyA6IDEsXG4gICAgICAgICAgICAnU2Vjb25kcycgOiAxZTMsXG4gICAgICAgICAgICAnTWludXRlcycgOiA2ZTQsXG4gICAgICAgICAgICAnSG91cnMnIDogMzZlNSxcbiAgICAgICAgICAgICdEYXlzJyA6IDg2NGU1LFxuICAgICAgICAgICAgJ01vbnRocycgOiAyNTkyZTYsXG4gICAgICAgICAgICAnWWVhcnMnIDogMzE1MzZlNlxuICAgICAgICB9LFxuXG4gICAgICAgIHVuaXRBbGlhc2VzID0ge1xuICAgICAgICAgICAgbXMgOiAnbWlsbGlzZWNvbmQnLFxuICAgICAgICAgICAgcyA6ICdzZWNvbmQnLFxuICAgICAgICAgICAgbSA6ICdtaW51dGUnLFxuICAgICAgICAgICAgaCA6ICdob3VyJyxcbiAgICAgICAgICAgIGQgOiAnZGF5JyxcbiAgICAgICAgICAgIEQgOiAnZGF0ZScsXG4gICAgICAgICAgICB3IDogJ3dlZWsnLFxuICAgICAgICAgICAgVyA6ICdpc29XZWVrJyxcbiAgICAgICAgICAgIE0gOiAnbW9udGgnLFxuICAgICAgICAgICAgUSA6ICdxdWFydGVyJyxcbiAgICAgICAgICAgIHkgOiAneWVhcicsXG4gICAgICAgICAgICBEREQgOiAnZGF5T2ZZZWFyJyxcbiAgICAgICAgICAgIGUgOiAnd2Vla2RheScsXG4gICAgICAgICAgICBFIDogJ2lzb1dlZWtkYXknLFxuICAgICAgICAgICAgZ2c6ICd3ZWVrWWVhcicsXG4gICAgICAgICAgICBHRzogJ2lzb1dlZWtZZWFyJ1xuICAgICAgICB9LFxuXG4gICAgICAgIGNhbWVsRnVuY3Rpb25zID0ge1xuICAgICAgICAgICAgZGF5b2Z5ZWFyIDogJ2RheU9mWWVhcicsXG4gICAgICAgICAgICBpc293ZWVrZGF5IDogJ2lzb1dlZWtkYXknLFxuICAgICAgICAgICAgaXNvd2VlayA6ICdpc29XZWVrJyxcbiAgICAgICAgICAgIHdlZWt5ZWFyIDogJ3dlZWtZZWFyJyxcbiAgICAgICAgICAgIGlzb3dlZWt5ZWFyIDogJ2lzb1dlZWtZZWFyJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGZvcm1hdCBmdW5jdGlvbiBzdHJpbmdzXG4gICAgICAgIGZvcm1hdEZ1bmN0aW9ucyA9IHt9LFxuXG4gICAgICAgIC8vIGRlZmF1bHQgcmVsYXRpdmUgdGltZSB0aHJlc2hvbGRzXG4gICAgICAgIHJlbGF0aXZlVGltZVRocmVzaG9sZHMgPSB7XG4gICAgICAgICAgICBzOiA0NSwgIC8vIHNlY29uZHMgdG8gbWludXRlXG4gICAgICAgICAgICBtOiA0NSwgIC8vIG1pbnV0ZXMgdG8gaG91clxuICAgICAgICAgICAgaDogMjIsICAvLyBob3VycyB0byBkYXlcbiAgICAgICAgICAgIGQ6IDI2LCAgLy8gZGF5cyB0byBtb250aFxuICAgICAgICAgICAgTTogMTEgICAvLyBtb250aHMgdG8geWVhclxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHRva2VucyB0byBvcmRpbmFsaXplIGFuZCBwYWRcbiAgICAgICAgb3JkaW5hbGl6ZVRva2VucyA9ICdEREQgdyBXIE0gRCBkJy5zcGxpdCgnICcpLFxuICAgICAgICBwYWRkZWRUb2tlbnMgPSAnTSBEIEggaCBtIHMgdyBXJy5zcGxpdCgnICcpLFxuXG4gICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zID0ge1xuICAgICAgICAgICAgTSAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tb250aCgpICsgMTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBNTU0gIDogZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tb250aHNTaG9ydCh0aGlzLCBmb3JtYXQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE1NTU0gOiBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1vbnRocyh0aGlzLCBmb3JtYXQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEQgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0ZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIERERCAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF5T2ZZZWFyKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZCAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZCAgIDogZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5c01pbih0aGlzLCBmb3JtYXQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRkZCAgOiBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzU2hvcnQodGhpcywgZm9ybWF0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZGRkIDogZnVuY3Rpb24gKGZvcm1hdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS53ZWVrZGF5cyh0aGlzLCBmb3JtYXQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHcgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMud2VlaygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFcgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNvV2VlaygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFlZICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLnllYXIoKSAlIDEwMCwgMik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgWVlZWSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMueWVhcigpLCA0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBZWVlZWSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMueWVhcigpLCA1KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBZWVlZWVkgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHkgPSB0aGlzLnllYXIoKSwgc2lnbiA9IHkgPj0gMCA/ICcrJyA6ICctJztcbiAgICAgICAgICAgICAgICByZXR1cm4gc2lnbiArIGxlZnRaZXJvRmlsbChNYXRoLmFicyh5KSwgNik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2cgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMud2Vla1llYXIoKSAlIDEwMCwgMik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2dnZyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMud2Vla1llYXIoKSwgNCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2dnZ2cgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLndlZWtZZWFyKCksIDUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEdHICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLmlzb1dlZWtZZWFyKCkgJSAxMDAsIDIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEdHR0cgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLmlzb1dlZWtZZWFyKCksIDQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEdHR0dHIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy5pc29XZWVrWWVhcigpLCA1KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLndlZWtkYXkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBFIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmlzb1dlZWtkYXkoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tZXJpZGllbSh0aGlzLmhvdXJzKCksIHRoaXMubWludXRlcygpLCB0cnVlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBBICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5tZXJpZGllbSh0aGlzLmhvdXJzKCksIHRoaXMubWludXRlcygpLCBmYWxzZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgSCAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ob3VycygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGggICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaG91cnMoKSAlIDEyIHx8IDEyO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG0gICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWludXRlcygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHMgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2Vjb25kcygpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFMgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRvSW50KHRoaXMubWlsbGlzZWNvbmRzKCkgLyAxMDApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFNTICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0b0ludCh0aGlzLm1pbGxpc2Vjb25kcygpIC8gMTApLCAyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTU1MgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy5taWxsaXNlY29uZHMoKSwgMyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU1NTUyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMubWlsbGlzZWNvbmRzKCksIDMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFogICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGEgPSAtdGhpcy56b25lKCksXG4gICAgICAgICAgICAgICAgICAgIGIgPSAnKyc7XG4gICAgICAgICAgICAgICAgaWYgKGEgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGEgPSAtYTtcbiAgICAgICAgICAgICAgICAgICAgYiA9ICctJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGIgKyBsZWZ0WmVyb0ZpbGwodG9JbnQoYSAvIDYwKSwgMikgKyAnOicgKyBsZWZ0WmVyb0ZpbGwodG9JbnQoYSkgJSA2MCwgMik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgWlogICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYSA9IC10aGlzLnpvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgYiA9ICcrJztcbiAgICAgICAgICAgICAgICBpZiAoYSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYSA9IC1hO1xuICAgICAgICAgICAgICAgICAgICBiID0gJy0nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYiArIGxlZnRaZXJvRmlsbCh0b0ludChhIC8gNjApLCAyKSArIGxlZnRaZXJvRmlsbCh0b0ludChhKSAlIDYwLCAyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB6IDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnpvbmVBYmJyKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgenogOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuem9uZU5hbWUoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBYICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnVuaXgoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBRIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnF1YXJ0ZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBkZXByZWNhdGlvbnMgPSB7fSxcblxuICAgICAgICBsaXN0cyA9IFsnbW9udGhzJywgJ21vbnRoc1Nob3J0JywgJ3dlZWtkYXlzJywgJ3dlZWtkYXlzU2hvcnQnLCAnd2Vla2RheXNNaW4nXTtcblxuICAgIC8vIFBpY2sgdGhlIGZpcnN0IGRlZmluZWQgb2YgdHdvIG9yIHRocmVlIGFyZ3VtZW50cy4gZGZsIGNvbWVzIGZyb21cbiAgICAvLyBkZWZhdWx0LlxuICAgIGZ1bmN0aW9uIGRmbChhLCBiLCBjKSB7XG4gICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gYSAhPSBudWxsID8gYSA6IGI7XG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiBhICE9IG51bGwgPyBhIDogYiAhPSBudWxsID8gYiA6IGM7XG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBuZXcgRXJyb3IoJ0ltcGxlbWVudCBtZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGFzT3duUHJvcChhLCBiKSB7XG4gICAgICAgIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGEsIGIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlZmF1bHRQYXJzaW5nRmxhZ3MoKSB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gZGVlcCBjbG9uZSB0aGlzIG9iamVjdCwgYW5kIGVzNSBzdGFuZGFyZCBpcyBub3QgdmVyeVxuICAgICAgICAvLyBoZWxwZnVsLlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZW1wdHkgOiBmYWxzZSxcbiAgICAgICAgICAgIHVudXNlZFRva2VucyA6IFtdLFxuICAgICAgICAgICAgdW51c2VkSW5wdXQgOiBbXSxcbiAgICAgICAgICAgIG92ZXJmbG93IDogLTIsXG4gICAgICAgICAgICBjaGFyc0xlZnRPdmVyIDogMCxcbiAgICAgICAgICAgIG51bGxJbnB1dCA6IGZhbHNlLFxuICAgICAgICAgICAgaW52YWxpZE1vbnRoIDogbnVsbCxcbiAgICAgICAgICAgIGludmFsaWRGb3JtYXQgOiBmYWxzZSxcbiAgICAgICAgICAgIHVzZXJJbnZhbGlkYXRlZCA6IGZhbHNlLFxuICAgICAgICAgICAgaXNvOiBmYWxzZVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByaW50TXNnKG1zZykge1xuICAgICAgICBpZiAobW9tZW50LnN1cHByZXNzRGVwcmVjYXRpb25XYXJuaW5ncyA9PT0gZmFsc2UgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZS53YXJuKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0RlcHJlY2F0aW9uIHdhcm5pbmc6ICcgKyBtc2cpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVwcmVjYXRlKG1zZywgZm4pIHtcbiAgICAgICAgdmFyIGZpcnN0VGltZSA9IHRydWU7XG4gICAgICAgIHJldHVybiBleHRlbmQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGZpcnN0VGltZSkge1xuICAgICAgICAgICAgICAgIHByaW50TXNnKG1zZyk7XG4gICAgICAgICAgICAgICAgZmlyc3RUaW1lID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSwgZm4pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlcHJlY2F0ZVNpbXBsZShuYW1lLCBtc2cpIHtcbiAgICAgICAgaWYgKCFkZXByZWNhdGlvbnNbbmFtZV0pIHtcbiAgICAgICAgICAgIHByaW50TXNnKG1zZyk7XG4gICAgICAgICAgICBkZXByZWNhdGlvbnNbbmFtZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFkVG9rZW4oZnVuYywgY291bnQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKGZ1bmMuY2FsbCh0aGlzLCBhKSwgY291bnQpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBvcmRpbmFsaXplVG9rZW4oZnVuYywgcGVyaW9kKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm9yZGluYWwoZnVuYy5jYWxsKHRoaXMsIGEpLCBwZXJpb2QpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHdoaWxlIChvcmRpbmFsaXplVG9rZW5zLmxlbmd0aCkge1xuICAgICAgICBpID0gb3JkaW5hbGl6ZVRva2Vucy5wb3AoKTtcbiAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnNbaSArICdvJ10gPSBvcmRpbmFsaXplVG9rZW4oZm9ybWF0VG9rZW5GdW5jdGlvbnNbaV0sIGkpO1xuICAgIH1cbiAgICB3aGlsZSAocGFkZGVkVG9rZW5zLmxlbmd0aCkge1xuICAgICAgICBpID0gcGFkZGVkVG9rZW5zLnBvcCgpO1xuICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1tpICsgaV0gPSBwYWRUb2tlbihmb3JtYXRUb2tlbkZ1bmN0aW9uc1tpXSwgMik7XG4gICAgfVxuICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zLkREREQgPSBwYWRUb2tlbihmb3JtYXRUb2tlbkZ1bmN0aW9ucy5EREQsIDMpO1xuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIENvbnN0cnVjdG9yc1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIGZ1bmN0aW9uIExvY2FsZSgpIHtcbiAgICB9XG5cbiAgICAvLyBNb21lbnQgcHJvdG90eXBlIG9iamVjdFxuICAgIGZ1bmN0aW9uIE1vbWVudChjb25maWcsIHNraXBPdmVyZmxvdykge1xuICAgICAgICBpZiAoc2tpcE92ZXJmbG93ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgY2hlY2tPdmVyZmxvdyhjb25maWcpO1xuICAgICAgICB9XG4gICAgICAgIGNvcHlDb25maWcodGhpcywgY29uZmlnKTtcbiAgICAgICAgdGhpcy5fZCA9IG5ldyBEYXRlKCtjb25maWcuX2QpO1xuICAgIH1cblxuICAgIC8vIER1cmF0aW9uIENvbnN0cnVjdG9yXG4gICAgZnVuY3Rpb24gRHVyYXRpb24oZHVyYXRpb24pIHtcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWRJbnB1dCA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKGR1cmF0aW9uKSxcbiAgICAgICAgICAgIHllYXJzID0gbm9ybWFsaXplZElucHV0LnllYXIgfHwgMCxcbiAgICAgICAgICAgIHF1YXJ0ZXJzID0gbm9ybWFsaXplZElucHV0LnF1YXJ0ZXIgfHwgMCxcbiAgICAgICAgICAgIG1vbnRocyA9IG5vcm1hbGl6ZWRJbnB1dC5tb250aCB8fCAwLFxuICAgICAgICAgICAgd2Vla3MgPSBub3JtYWxpemVkSW5wdXQud2VlayB8fCAwLFxuICAgICAgICAgICAgZGF5cyA9IG5vcm1hbGl6ZWRJbnB1dC5kYXkgfHwgMCxcbiAgICAgICAgICAgIGhvdXJzID0gbm9ybWFsaXplZElucHV0LmhvdXIgfHwgMCxcbiAgICAgICAgICAgIG1pbnV0ZXMgPSBub3JtYWxpemVkSW5wdXQubWludXRlIHx8IDAsXG4gICAgICAgICAgICBzZWNvbmRzID0gbm9ybWFsaXplZElucHV0LnNlY29uZCB8fCAwLFxuICAgICAgICAgICAgbWlsbGlzZWNvbmRzID0gbm9ybWFsaXplZElucHV0Lm1pbGxpc2Vjb25kIHx8IDA7XG5cbiAgICAgICAgLy8gcmVwcmVzZW50YXRpb24gZm9yIGRhdGVBZGRSZW1vdmVcbiAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzID0gK21pbGxpc2Vjb25kcyArXG4gICAgICAgICAgICBzZWNvbmRzICogMWUzICsgLy8gMTAwMFxuICAgICAgICAgICAgbWludXRlcyAqIDZlNCArIC8vIDEwMDAgKiA2MFxuICAgICAgICAgICAgaG91cnMgKiAzNmU1OyAvLyAxMDAwICogNjAgKiA2MFxuICAgICAgICAvLyBCZWNhdXNlIG9mIGRhdGVBZGRSZW1vdmUgdHJlYXRzIDI0IGhvdXJzIGFzIGRpZmZlcmVudCBmcm9tIGFcbiAgICAgICAgLy8gZGF5IHdoZW4gd29ya2luZyBhcm91bmQgRFNULCB3ZSBuZWVkIHRvIHN0b3JlIHRoZW0gc2VwYXJhdGVseVxuICAgICAgICB0aGlzLl9kYXlzID0gK2RheXMgK1xuICAgICAgICAgICAgd2Vla3MgKiA3O1xuICAgICAgICAvLyBJdCBpcyBpbXBvc3NpYmxlIHRyYW5zbGF0ZSBtb250aHMgaW50byBkYXlzIHdpdGhvdXQga25vd2luZ1xuICAgICAgICAvLyB3aGljaCBtb250aHMgeW91IGFyZSBhcmUgdGFsa2luZyBhYm91dCwgc28gd2UgaGF2ZSB0byBzdG9yZVxuICAgICAgICAvLyBpdCBzZXBhcmF0ZWx5LlxuICAgICAgICB0aGlzLl9tb250aHMgPSArbW9udGhzICtcbiAgICAgICAgICAgIHF1YXJ0ZXJzICogMyArXG4gICAgICAgICAgICB5ZWFycyAqIDEyO1xuXG4gICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcblxuICAgICAgICB0aGlzLl9sb2NhbGUgPSBtb21lbnQubG9jYWxlRGF0YSgpO1xuXG4gICAgICAgIHRoaXMuX2J1YmJsZSgpO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgSGVscGVyc1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgZnVuY3Rpb24gZXh0ZW5kKGEsIGIpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiBiKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duUHJvcChiLCBpKSkge1xuICAgICAgICAgICAgICAgIGFbaV0gPSBiW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3RvU3RyaW5nJykpIHtcbiAgICAgICAgICAgIGEudG9TdHJpbmcgPSBiLnRvU3RyaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc093blByb3AoYiwgJ3ZhbHVlT2YnKSkge1xuICAgICAgICAgICAgYS52YWx1ZU9mID0gYi52YWx1ZU9mO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29weUNvbmZpZyh0bywgZnJvbSkge1xuICAgICAgICB2YXIgaSwgcHJvcCwgdmFsO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5faXNBTW9tZW50T2JqZWN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2lzQU1vbWVudE9iamVjdCA9IGZyb20uX2lzQU1vbWVudE9iamVjdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2kgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5faSA9IGZyb20uX2k7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9mICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2YgPSBmcm9tLl9mO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9sID0gZnJvbS5fbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX3N0cmljdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9zdHJpY3QgPSBmcm9tLl9zdHJpY3Q7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl90em0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fdHptID0gZnJvbS5fdHptO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5faXNVVEMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5faXNVVEMgPSBmcm9tLl9pc1VUQztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX29mZnNldCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9vZmZzZXQgPSBmcm9tLl9vZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9wZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9wZiA9IGZyb20uX3BmO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fbG9jYWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2xvY2FsZSA9IGZyb20uX2xvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb21lbnRQcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAoaSBpbiBtb21lbnRQcm9wZXJ0aWVzKSB7XG4gICAgICAgICAgICAgICAgcHJvcCA9IG1vbWVudFByb3BlcnRpZXNbaV07XG4gICAgICAgICAgICAgICAgdmFsID0gZnJvbVtwcm9wXTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9bcHJvcF0gPSB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRvO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFic1JvdW5kKG51bWJlcikge1xuICAgICAgICBpZiAobnVtYmVyIDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbChudW1iZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IobnVtYmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGxlZnQgemVybyBmaWxsIGEgbnVtYmVyXG4gICAgLy8gc2VlIGh0dHA6Ly9qc3BlcmYuY29tL2xlZnQtemVyby1maWxsaW5nIGZvciBwZXJmb3JtYW5jZSBjb21wYXJpc29uXG4gICAgZnVuY3Rpb24gbGVmdFplcm9GaWxsKG51bWJlciwgdGFyZ2V0TGVuZ3RoLCBmb3JjZVNpZ24pIHtcbiAgICAgICAgdmFyIG91dHB1dCA9ICcnICsgTWF0aC5hYnMobnVtYmVyKSxcbiAgICAgICAgICAgIHNpZ24gPSBudW1iZXIgPj0gMDtcblxuICAgICAgICB3aGlsZSAob3V0cHV0Lmxlbmd0aCA8IHRhcmdldExlbmd0aCkge1xuICAgICAgICAgICAgb3V0cHV0ID0gJzAnICsgb3V0cHV0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoc2lnbiA/IChmb3JjZVNpZ24gPyAnKycgOiAnJykgOiAnLScpICsgb3V0cHV0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpIHtcbiAgICAgICAgdmFyIHJlcyA9IHttaWxsaXNlY29uZHM6IDAsIG1vbnRoczogMH07XG5cbiAgICAgICAgcmVzLm1vbnRocyA9IG90aGVyLm1vbnRoKCkgLSBiYXNlLm1vbnRoKCkgK1xuICAgICAgICAgICAgKG90aGVyLnllYXIoKSAtIGJhc2UueWVhcigpKSAqIDEyO1xuICAgICAgICBpZiAoYmFzZS5jbG9uZSgpLmFkZChyZXMubW9udGhzLCAnTScpLmlzQWZ0ZXIob3RoZXIpKSB7XG4gICAgICAgICAgICAtLXJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXMubWlsbGlzZWNvbmRzID0gK290aGVyIC0gKyhiYXNlLmNsb25lKCkuYWRkKHJlcy5tb250aHMsICdNJykpO1xuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpIHtcbiAgICAgICAgdmFyIHJlcztcbiAgICAgICAgb3RoZXIgPSBtYWtlQXMob3RoZXIsIGJhc2UpO1xuICAgICAgICBpZiAoYmFzZS5pc0JlZm9yZShvdGhlcikpIHtcbiAgICAgICAgICAgIHJlcyA9IHBvc2l0aXZlTW9tZW50c0RpZmZlcmVuY2UoYmFzZSwgb3RoZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzID0gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShvdGhlciwgYmFzZSk7XG4gICAgICAgICAgICByZXMubWlsbGlzZWNvbmRzID0gLXJlcy5taWxsaXNlY29uZHM7XG4gICAgICAgICAgICByZXMubW9udGhzID0gLXJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHJlbW92ZSAnbmFtZScgYXJnIGFmdGVyIGRlcHJlY2F0aW9uIGlzIHJlbW92ZWRcbiAgICBmdW5jdGlvbiBjcmVhdGVBZGRlcihkaXJlY3Rpb24sIG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWwsIHBlcmlvZCkge1xuICAgICAgICAgICAgdmFyIGR1ciwgdG1wO1xuICAgICAgICAgICAgLy9pbnZlcnQgdGhlIGFyZ3VtZW50cywgYnV0IGNvbXBsYWluIGFib3V0IGl0XG4gICAgICAgICAgICBpZiAocGVyaW9kICE9PSBudWxsICYmICFpc05hTigrcGVyaW9kKSkge1xuICAgICAgICAgICAgICAgIGRlcHJlY2F0ZVNpbXBsZShuYW1lLCAnbW9tZW50KCkuJyArIG5hbWUgICsgJyhwZXJpb2QsIG51bWJlcikgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSBtb21lbnQoKS4nICsgbmFtZSArICcobnVtYmVyLCBwZXJpb2QpLicpO1xuICAgICAgICAgICAgICAgIHRtcCA9IHZhbDsgdmFsID0gcGVyaW9kOyBwZXJpb2QgPSB0bXA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbCA9IHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnID8gK3ZhbCA6IHZhbDtcbiAgICAgICAgICAgIGR1ciA9IG1vbWVudC5kdXJhdGlvbih2YWwsIHBlcmlvZCk7XG4gICAgICAgICAgICBhZGRPclN1YnRyYWN0RHVyYXRpb25Gcm9tTW9tZW50KHRoaXMsIGR1ciwgZGlyZWN0aW9uKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZE9yU3VidHJhY3REdXJhdGlvbkZyb21Nb21lbnQobW9tLCBkdXJhdGlvbiwgaXNBZGRpbmcsIHVwZGF0ZU9mZnNldCkge1xuICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gZHVyYXRpb24uX21pbGxpc2Vjb25kcyxcbiAgICAgICAgICAgIGRheXMgPSBkdXJhdGlvbi5fZGF5cyxcbiAgICAgICAgICAgIG1vbnRocyA9IGR1cmF0aW9uLl9tb250aHM7XG4gICAgICAgIHVwZGF0ZU9mZnNldCA9IHVwZGF0ZU9mZnNldCA9PSBudWxsID8gdHJ1ZSA6IHVwZGF0ZU9mZnNldDtcblxuICAgICAgICBpZiAobWlsbGlzZWNvbmRzKSB7XG4gICAgICAgICAgICBtb20uX2Quc2V0VGltZSgrbW9tLl9kICsgbWlsbGlzZWNvbmRzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXlzKSB7XG4gICAgICAgICAgICByYXdTZXR0ZXIobW9tLCAnRGF0ZScsIHJhd0dldHRlcihtb20sICdEYXRlJykgKyBkYXlzICogaXNBZGRpbmcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtb250aHMpIHtcbiAgICAgICAgICAgIHJhd01vbnRoU2V0dGVyKG1vbSwgcmF3R2V0dGVyKG1vbSwgJ01vbnRoJykgKyBtb250aHMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHVwZGF0ZU9mZnNldCkge1xuICAgICAgICAgICAgbW9tZW50LnVwZGF0ZU9mZnNldChtb20sIGRheXMgfHwgbW9udGhzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIGlzIGFuIGFycmF5XG4gICAgZnVuY3Rpb24gaXNBcnJheShpbnB1dCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0RhdGUoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpbnB1dCkgPT09ICdbb2JqZWN0IERhdGVdJyB8fFxuICAgICAgICAgICAgaW5wdXQgaW5zdGFuY2VvZiBEYXRlO1xuICAgIH1cblxuICAgIC8vIGNvbXBhcmUgdHdvIGFycmF5cywgcmV0dXJuIHRoZSBudW1iZXIgb2YgZGlmZmVyZW5jZXNcbiAgICBmdW5jdGlvbiBjb21wYXJlQXJyYXlzKGFycmF5MSwgYXJyYXkyLCBkb250Q29udmVydCkge1xuICAgICAgICB2YXIgbGVuID0gTWF0aC5taW4oYXJyYXkxLmxlbmd0aCwgYXJyYXkyLmxlbmd0aCksXG4gICAgICAgICAgICBsZW5ndGhEaWZmID0gTWF0aC5hYnMoYXJyYXkxLmxlbmd0aCAtIGFycmF5Mi5sZW5ndGgpLFxuICAgICAgICAgICAgZGlmZnMgPSAwLFxuICAgICAgICAgICAgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoKGRvbnRDb252ZXJ0ICYmIGFycmF5MVtpXSAhPT0gYXJyYXkyW2ldKSB8fFxuICAgICAgICAgICAgICAgICghZG9udENvbnZlcnQgJiYgdG9JbnQoYXJyYXkxW2ldKSAhPT0gdG9JbnQoYXJyYXkyW2ldKSkpIHtcbiAgICAgICAgICAgICAgICBkaWZmcysrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkaWZmcyArIGxlbmd0aERpZmY7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplVW5pdHModW5pdHMpIHtcbiAgICAgICAgaWYgKHVuaXRzKSB7XG4gICAgICAgICAgICB2YXIgbG93ZXJlZCA9IHVuaXRzLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvKC4pcyQvLCAnJDEnKTtcbiAgICAgICAgICAgIHVuaXRzID0gdW5pdEFsaWFzZXNbdW5pdHNdIHx8IGNhbWVsRnVuY3Rpb25zW2xvd2VyZWRdIHx8IGxvd2VyZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuaXRzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZU9iamVjdFVuaXRzKGlucHV0T2JqZWN0KSB7XG4gICAgICAgIHZhciBub3JtYWxpemVkSW5wdXQgPSB7fSxcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wLFxuICAgICAgICAgICAgcHJvcDtcblxuICAgICAgICBmb3IgKHByb3AgaW4gaW5wdXRPYmplY3QpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wKGlucHV0T2JqZWN0LCBwcm9wKSkge1xuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wID0gbm9ybWFsaXplVW5pdHMocHJvcCk7XG4gICAgICAgICAgICAgICAgaWYgKG5vcm1hbGl6ZWRQcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dFtub3JtYWxpemVkUHJvcF0gPSBpbnB1dE9iamVjdFtwcm9wXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbm9ybWFsaXplZElucHV0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VMaXN0KGZpZWxkKSB7XG4gICAgICAgIHZhciBjb3VudCwgc2V0dGVyO1xuXG4gICAgICAgIGlmIChmaWVsZC5pbmRleE9mKCd3ZWVrJykgPT09IDApIHtcbiAgICAgICAgICAgIGNvdW50ID0gNztcbiAgICAgICAgICAgIHNldHRlciA9ICdkYXknO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGZpZWxkLmluZGV4T2YoJ21vbnRoJykgPT09IDApIHtcbiAgICAgICAgICAgIGNvdW50ID0gMTI7XG4gICAgICAgICAgICBzZXR0ZXIgPSAnbW9udGgnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbW9tZW50W2ZpZWxkXSA9IGZ1bmN0aW9uIChmb3JtYXQsIGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgaSwgZ2V0dGVyLFxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IG1vbWVudC5fbG9jYWxlW2ZpZWxkXSxcbiAgICAgICAgICAgICAgICByZXN1bHRzID0gW107XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgZm9ybWF0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gZm9ybWF0O1xuICAgICAgICAgICAgICAgIGZvcm1hdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZ2V0dGVyID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICB2YXIgbSA9IG1vbWVudCgpLnV0YygpLnNldChzZXR0ZXIsIGkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBtZXRob2QuY2FsbChtb21lbnQuX2xvY2FsZSwgbSwgZm9ybWF0IHx8ICcnKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChpbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldHRlcihpbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goZ2V0dGVyKGkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9JbnQoYXJndW1lbnRGb3JDb2VyY2lvbikge1xuICAgICAgICB2YXIgY29lcmNlZE51bWJlciA9ICthcmd1bWVudEZvckNvZXJjaW9uLFxuICAgICAgICAgICAgdmFsdWUgPSAwO1xuXG4gICAgICAgIGlmIChjb2VyY2VkTnVtYmVyICE9PSAwICYmIGlzRmluaXRlKGNvZXJjZWROdW1iZXIpKSB7XG4gICAgICAgICAgICBpZiAoY29lcmNlZE51bWJlciA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBNYXRoLmZsb29yKGNvZXJjZWROdW1iZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IE1hdGguY2VpbChjb2VyY2VkTnVtYmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlzSW5Nb250aCh5ZWFyLCBtb250aCkge1xuICAgICAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoeWVhciwgbW9udGggKyAxLCAwKSkuZ2V0VVRDRGF0ZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHdlZWtzSW5ZZWFyKHllYXIsIGRvdywgZG95KSB7XG4gICAgICAgIHJldHVybiB3ZWVrT2ZZZWFyKG1vbWVudChbeWVhciwgMTEsIDMxICsgZG93IC0gZG95XSksIGRvdywgZG95KS53ZWVrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheXNJblllYXIoeWVhcikge1xuICAgICAgICByZXR1cm4gaXNMZWFwWWVhcih5ZWFyKSA/IDM2NiA6IDM2NTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0xlYXBZZWFyKHllYXIpIHtcbiAgICAgICAgcmV0dXJuICh5ZWFyICUgNCA9PT0gMCAmJiB5ZWFyICUgMTAwICE9PSAwKSB8fCB5ZWFyICUgNDAwID09PSAwO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrT3ZlcmZsb3cobSkge1xuICAgICAgICB2YXIgb3ZlcmZsb3c7XG4gICAgICAgIGlmIChtLl9hICYmIG0uX3BmLm92ZXJmbG93ID09PSAtMikge1xuICAgICAgICAgICAgb3ZlcmZsb3cgPVxuICAgICAgICAgICAgICAgIG0uX2FbTU9OVEhdIDwgMCB8fCBtLl9hW01PTlRIXSA+IDExID8gTU9OVEggOlxuICAgICAgICAgICAgICAgIG0uX2FbREFURV0gPCAxIHx8IG0uX2FbREFURV0gPiBkYXlzSW5Nb250aChtLl9hW1lFQVJdLCBtLl9hW01PTlRIXSkgPyBEQVRFIDpcbiAgICAgICAgICAgICAgICBtLl9hW0hPVVJdIDwgMCB8fCBtLl9hW0hPVVJdID4gMjMgPyBIT1VSIDpcbiAgICAgICAgICAgICAgICBtLl9hW01JTlVURV0gPCAwIHx8IG0uX2FbTUlOVVRFXSA+IDU5ID8gTUlOVVRFIDpcbiAgICAgICAgICAgICAgICBtLl9hW1NFQ09ORF0gPCAwIHx8IG0uX2FbU0VDT05EXSA+IDU5ID8gU0VDT05EIDpcbiAgICAgICAgICAgICAgICBtLl9hW01JTExJU0VDT05EXSA8IDAgfHwgbS5fYVtNSUxMSVNFQ09ORF0gPiA5OTkgPyBNSUxMSVNFQ09ORCA6XG4gICAgICAgICAgICAgICAgLTE7XG5cbiAgICAgICAgICAgIGlmIChtLl9wZi5fb3ZlcmZsb3dEYXlPZlllYXIgJiYgKG92ZXJmbG93IDwgWUVBUiB8fCBvdmVyZmxvdyA+IERBVEUpKSB7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSBEQVRFO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtLl9wZi5vdmVyZmxvdyA9IG92ZXJmbG93O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNWYWxpZChtKSB7XG4gICAgICAgIGlmIChtLl9pc1ZhbGlkID09IG51bGwpIHtcbiAgICAgICAgICAgIG0uX2lzVmFsaWQgPSAhaXNOYU4obS5fZC5nZXRUaW1lKCkpICYmXG4gICAgICAgICAgICAgICAgbS5fcGYub3ZlcmZsb3cgPCAwICYmXG4gICAgICAgICAgICAgICAgIW0uX3BmLmVtcHR5ICYmXG4gICAgICAgICAgICAgICAgIW0uX3BmLmludmFsaWRNb250aCAmJlxuICAgICAgICAgICAgICAgICFtLl9wZi5udWxsSW5wdXQgJiZcbiAgICAgICAgICAgICAgICAhbS5fcGYuaW52YWxpZEZvcm1hdCAmJlxuICAgICAgICAgICAgICAgICFtLl9wZi51c2VySW52YWxpZGF0ZWQ7XG5cbiAgICAgICAgICAgIGlmIChtLl9zdHJpY3QpIHtcbiAgICAgICAgICAgICAgICBtLl9pc1ZhbGlkID0gbS5faXNWYWxpZCAmJlxuICAgICAgICAgICAgICAgICAgICBtLl9wZi5jaGFyc0xlZnRPdmVyID09PSAwICYmXG4gICAgICAgICAgICAgICAgICAgIG0uX3BmLnVudXNlZFRva2Vucy5sZW5ndGggPT09IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG0uX2lzVmFsaWQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplTG9jYWxlKGtleSkge1xuICAgICAgICByZXR1cm4ga2V5ID8ga2V5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnXycsICctJykgOiBrZXk7XG4gICAgfVxuXG4gICAgLy8gcGljayB0aGUgbG9jYWxlIGZyb20gdGhlIGFycmF5XG4gICAgLy8gdHJ5IFsnZW4tYXUnLCAnZW4tZ2InXSBhcyAnZW4tYXUnLCAnZW4tZ2InLCAnZW4nLCBhcyBpbiBtb3ZlIHRocm91Z2ggdGhlIGxpc3QgdHJ5aW5nIGVhY2hcbiAgICAvLyBzdWJzdHJpbmcgZnJvbSBtb3N0IHNwZWNpZmljIHRvIGxlYXN0LCBidXQgbW92ZSB0byB0aGUgbmV4dCBhcnJheSBpdGVtIGlmIGl0J3MgYSBtb3JlIHNwZWNpZmljIHZhcmlhbnQgdGhhbiB0aGUgY3VycmVudCByb290XG4gICAgZnVuY3Rpb24gY2hvb3NlTG9jYWxlKG5hbWVzKSB7XG4gICAgICAgIHZhciBpID0gMCwgaiwgbmV4dCwgbG9jYWxlLCBzcGxpdDtcblxuICAgICAgICB3aGlsZSAoaSA8IG5hbWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgc3BsaXQgPSBub3JtYWxpemVMb2NhbGUobmFtZXNbaV0pLnNwbGl0KCctJyk7XG4gICAgICAgICAgICBqID0gc3BsaXQubGVuZ3RoO1xuICAgICAgICAgICAgbmV4dCA9IG5vcm1hbGl6ZUxvY2FsZShuYW1lc1tpICsgMV0pO1xuICAgICAgICAgICAgbmV4dCA9IG5leHQgPyBuZXh0LnNwbGl0KCctJykgOiBudWxsO1xuICAgICAgICAgICAgd2hpbGUgKGogPiAwKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxlID0gbG9hZExvY2FsZShzcGxpdC5zbGljZSgwLCBqKS5qb2luKCctJykpO1xuICAgICAgICAgICAgICAgIGlmIChsb2NhbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5leHQgJiYgbmV4dC5sZW5ndGggPj0gaiAmJiBjb21wYXJlQXJyYXlzKHNwbGl0LCBuZXh0LCB0cnVlKSA+PSBqIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvL3RoZSBuZXh0IGFycmF5IGl0ZW0gaXMgYmV0dGVyIHRoYW4gYSBzaGFsbG93ZXIgc3Vic3RyaW5nIG9mIHRoaXMgb25lXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBqLS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZExvY2FsZShuYW1lKSB7XG4gICAgICAgIHZhciBvbGRMb2NhbGUgPSBudWxsO1xuICAgICAgICBpZiAoIWxvY2FsZXNbbmFtZV0gJiYgaGFzTW9kdWxlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG9sZExvY2FsZSA9IG1vbWVudC5sb2NhbGUoKTtcbiAgICAgICAgICAgICAgICByZXF1aXJlKCcuL2xvY2FsZS8nICsgbmFtZSk7XG4gICAgICAgICAgICAgICAgLy8gYmVjYXVzZSBkZWZpbmVMb2NhbGUgY3VycmVudGx5IGFsc28gc2V0cyB0aGUgZ2xvYmFsIGxvY2FsZSwgd2Ugd2FudCB0byB1bmRvIHRoYXQgZm9yIGxhenkgbG9hZGVkIGxvY2FsZXNcbiAgICAgICAgICAgICAgICBtb21lbnQubG9jYWxlKG9sZExvY2FsZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7IH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9jYWxlc1tuYW1lXTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBtb21lbnQgZnJvbSBpbnB1dCwgdGhhdCBpcyBsb2NhbC91dGMvem9uZSBlcXVpdmFsZW50IHRvIG1vZGVsLlxuICAgIGZ1bmN0aW9uIG1ha2VBcyhpbnB1dCwgbW9kZWwpIHtcbiAgICAgICAgcmV0dXJuIG1vZGVsLl9pc1VUQyA/IG1vbWVudChpbnB1dCkuem9uZShtb2RlbC5fb2Zmc2V0IHx8IDApIDpcbiAgICAgICAgICAgIG1vbWVudChpbnB1dCkubG9jYWwoKTtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIExvY2FsZVxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgZXh0ZW5kKExvY2FsZS5wcm90b3R5cGUsIHtcblxuICAgICAgICBzZXQgOiBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgICAgICB2YXIgcHJvcCwgaTtcbiAgICAgICAgICAgIGZvciAoaSBpbiBjb25maWcpIHtcbiAgICAgICAgICAgICAgICBwcm9wID0gY29uZmlnW2ldO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzW2ldID0gcHJvcDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzWydfJyArIGldID0gcHJvcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX21vbnRocyA6ICdKYW51YXJ5X0ZlYnJ1YXJ5X01hcmNoX0FwcmlsX01heV9KdW5lX0p1bHlfQXVndXN0X1NlcHRlbWJlcl9PY3RvYmVyX05vdmVtYmVyX0RlY2VtYmVyJy5zcGxpdCgnXycpLFxuICAgICAgICBtb250aHMgOiBmdW5jdGlvbiAobSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1ttLm1vbnRoKCldO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9tb250aHNTaG9ydCA6ICdKYW5fRmViX01hcl9BcHJfTWF5X0p1bl9KdWxfQXVnX1NlcF9PY3RfTm92X0RlYycuc3BsaXQoJ18nKSxcbiAgICAgICAgbW9udGhzU2hvcnQgOiBmdW5jdGlvbiAobSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21vbnRoc1Nob3J0W20ubW9udGgoKV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgbW9udGhzUGFyc2UgOiBmdW5jdGlvbiAobW9udGhOYW1lKSB7XG4gICAgICAgICAgICB2YXIgaSwgbW9tLCByZWdleDtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLl9tb250aHNQYXJzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX21vbnRoc1BhcnNlID0gW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgcmVnZXggaWYgd2UgZG9uJ3QgaGF2ZSBpdCBhbHJlYWR5XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9tb250aHNQYXJzZVtpXSkge1xuICAgICAgICAgICAgICAgICAgICBtb20gPSBtb21lbnQudXRjKFsyMDAwLCBpXSk7XG4gICAgICAgICAgICAgICAgICAgIHJlZ2V4ID0gJ14nICsgdGhpcy5tb250aHMobW9tLCAnJykgKyAnfF4nICsgdGhpcy5tb250aHNTaG9ydChtb20sICcnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbW9udGhzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKHJlZ2V4LnJlcGxhY2UoJy4nLCAnJyksICdpJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHRlc3QgdGhlIHJlZ2V4XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21vbnRoc1BhcnNlW2ldLnRlc3QobW9udGhOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3dlZWtkYXlzIDogJ1N1bmRheV9Nb25kYXlfVHVlc2RheV9XZWRuZXNkYXlfVGh1cnNkYXlfRnJpZGF5X1NhdHVyZGF5Jy5zcGxpdCgnXycpLFxuICAgICAgICB3ZWVrZGF5cyA6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNbbS5kYXkoKV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3dlZWtkYXlzU2hvcnQgOiAnU3VuX01vbl9UdWVfV2VkX1RodV9GcmlfU2F0Jy5zcGxpdCgnXycpLFxuICAgICAgICB3ZWVrZGF5c1Nob3J0IDogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1Nob3J0W20uZGF5KCldO1xuICAgICAgICB9LFxuXG4gICAgICAgIF93ZWVrZGF5c01pbiA6ICdTdV9Nb19UdV9XZV9UaF9Gcl9TYScuc3BsaXQoJ18nKSxcbiAgICAgICAgd2Vla2RheXNNaW4gOiBmdW5jdGlvbiAobSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzTWluW20uZGF5KCldO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdlZWtkYXlzUGFyc2UgOiBmdW5jdGlvbiAod2Vla2RheU5hbWUpIHtcbiAgICAgICAgICAgIHZhciBpLCBtb20sIHJlZ2V4O1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWVrZGF5c1BhcnNlID0gW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX3dlZWtkYXlzUGFyc2VbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgbW9tID0gbW9tZW50KFsyMDAwLCAxXSkuZGF5KGkpO1xuICAgICAgICAgICAgICAgICAgICByZWdleCA9ICdeJyArIHRoaXMud2Vla2RheXMobW9tLCAnJykgKyAnfF4nICsgdGhpcy53ZWVrZGF5c1Nob3J0KG1vbSwgJycpICsgJ3xeJyArIHRoaXMud2Vla2RheXNNaW4obW9tLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2VbaV0gPSBuZXcgUmVnRXhwKHJlZ2V4LnJlcGxhY2UoJy4nLCAnJyksICdpJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHRlc3QgdGhlIHJlZ2V4XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3dlZWtkYXlzUGFyc2VbaV0udGVzdCh3ZWVrZGF5TmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIF9sb25nRGF0ZUZvcm1hdCA6IHtcbiAgICAgICAgICAgIExUIDogJ2g6bW0gQScsXG4gICAgICAgICAgICBMIDogJ01NL0REL1lZWVknLFxuICAgICAgICAgICAgTEwgOiAnTU1NTSBELCBZWVlZJyxcbiAgICAgICAgICAgIExMTCA6ICdNTU1NIEQsIFlZWVkgTFQnLFxuICAgICAgICAgICAgTExMTCA6ICdkZGRkLCBNTU1NIEQsIFlZWVkgTFQnXG4gICAgICAgIH0sXG4gICAgICAgIGxvbmdEYXRlRm9ybWF0IDogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV07XG4gICAgICAgICAgICBpZiAoIW91dHB1dCAmJiB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXkudG9VcHBlckNhc2UoKV0pIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXkudG9VcHBlckNhc2UoKV0ucmVwbGFjZSgvTU1NTXxNTXxERHxkZGRkL2csIGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbC5zbGljZSgxKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9sb25nRGF0ZUZvcm1hdFtrZXldID0gb3V0cHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1BNIDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICAvLyBJRTggUXVpcmtzIE1vZGUgJiBJRTcgU3RhbmRhcmRzIE1vZGUgZG8gbm90IGFsbG93IGFjY2Vzc2luZyBzdHJpbmdzIGxpa2UgYXJyYXlzXG4gICAgICAgICAgICAvLyBVc2luZyBjaGFyQXQgc2hvdWxkIGJlIG1vcmUgY29tcGF0aWJsZS5cbiAgICAgICAgICAgIHJldHVybiAoKGlucHV0ICsgJycpLnRvTG93ZXJDYXNlKCkuY2hhckF0KDApID09PSAncCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9tZXJpZGllbVBhcnNlIDogL1thcF1cXC4/bT9cXC4/L2ksXG4gICAgICAgIG1lcmlkaWVtIDogZnVuY3Rpb24gKGhvdXJzLCBtaW51dGVzLCBpc0xvd2VyKSB7XG4gICAgICAgICAgICBpZiAoaG91cnMgPiAxMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpc0xvd2VyID8gJ3BtJyA6ICdQTSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBpc0xvd2VyID8gJ2FtJyA6ICdBTSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2NhbGVuZGFyIDoge1xuICAgICAgICAgICAgc2FtZURheSA6ICdbVG9kYXkgYXRdIExUJyxcbiAgICAgICAgICAgIG5leHREYXkgOiAnW1RvbW9ycm93IGF0XSBMVCcsXG4gICAgICAgICAgICBuZXh0V2VlayA6ICdkZGRkIFthdF0gTFQnLFxuICAgICAgICAgICAgbGFzdERheSA6ICdbWWVzdGVyZGF5IGF0XSBMVCcsXG4gICAgICAgICAgICBsYXN0V2VlayA6ICdbTGFzdF0gZGRkZCBbYXRdIExUJyxcbiAgICAgICAgICAgIHNhbWVFbHNlIDogJ0wnXG4gICAgICAgIH0sXG4gICAgICAgIGNhbGVuZGFyIDogZnVuY3Rpb24gKGtleSwgbW9tKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5fY2FsZW5kYXJba2V5XTtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2Ygb3V0cHV0ID09PSAnZnVuY3Rpb24nID8gb3V0cHV0LmFwcGx5KG1vbSkgOiBvdXRwdXQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3JlbGF0aXZlVGltZSA6IHtcbiAgICAgICAgICAgIGZ1dHVyZSA6ICdpbiAlcycsXG4gICAgICAgICAgICBwYXN0IDogJyVzIGFnbycsXG4gICAgICAgICAgICBzIDogJ2EgZmV3IHNlY29uZHMnLFxuICAgICAgICAgICAgbSA6ICdhIG1pbnV0ZScsXG4gICAgICAgICAgICBtbSA6ICclZCBtaW51dGVzJyxcbiAgICAgICAgICAgIGggOiAnYW4gaG91cicsXG4gICAgICAgICAgICBoaCA6ICclZCBob3VycycsXG4gICAgICAgICAgICBkIDogJ2EgZGF5JyxcbiAgICAgICAgICAgIGRkIDogJyVkIGRheXMnLFxuICAgICAgICAgICAgTSA6ICdhIG1vbnRoJyxcbiAgICAgICAgICAgIE1NIDogJyVkIG1vbnRocycsXG4gICAgICAgICAgICB5IDogJ2EgeWVhcicsXG4gICAgICAgICAgICB5eSA6ICclZCB5ZWFycydcbiAgICAgICAgfSxcblxuICAgICAgICByZWxhdGl2ZVRpbWUgOiBmdW5jdGlvbiAobnVtYmVyLCB3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5fcmVsYXRpdmVUaW1lW3N0cmluZ107XG4gICAgICAgICAgICByZXR1cm4gKHR5cGVvZiBvdXRwdXQgPT09ICdmdW5jdGlvbicpID9cbiAgICAgICAgICAgICAgICBvdXRwdXQobnVtYmVyLCB3aXRob3V0U3VmZml4LCBzdHJpbmcsIGlzRnV0dXJlKSA6XG4gICAgICAgICAgICAgICAgb3V0cHV0LnJlcGxhY2UoLyVkL2ksIG51bWJlcik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFzdEZ1dHVyZSA6IGZ1bmN0aW9uIChkaWZmLCBvdXRwdXQpIHtcbiAgICAgICAgICAgIHZhciBmb3JtYXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbZGlmZiA+IDAgPyAnZnV0dXJlJyA6ICdwYXN0J107XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGZvcm1hdCA9PT0gJ2Z1bmN0aW9uJyA/IGZvcm1hdChvdXRwdXQpIDogZm9ybWF0LnJlcGxhY2UoLyVzL2ksIG91dHB1dCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgb3JkaW5hbCA6IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vcmRpbmFsLnJlcGxhY2UoJyVkJywgbnVtYmVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgX29yZGluYWwgOiAnJWQnLFxuXG4gICAgICAgIHByZXBhcnNlIDogZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICAgICAgfSxcblxuICAgICAgICBwb3N0Zm9ybWF0IDogZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIHN0cmluZztcbiAgICAgICAgfSxcblxuICAgICAgICB3ZWVrIDogZnVuY3Rpb24gKG1vbSkge1xuICAgICAgICAgICAgcmV0dXJuIHdlZWtPZlllYXIobW9tLCB0aGlzLl93ZWVrLmRvdywgdGhpcy5fd2Vlay5kb3kpLndlZWs7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3dlZWsgOiB7XG4gICAgICAgICAgICBkb3cgOiAwLCAvLyBTdW5kYXkgaXMgdGhlIGZpcnN0IGRheSBvZiB0aGUgd2Vlay5cbiAgICAgICAgICAgIGRveSA6IDYgIC8vIFRoZSB3ZWVrIHRoYXQgY29udGFpbnMgSmFuIDFzdCBpcyB0aGUgZmlyc3Qgd2VlayBvZiB0aGUgeWVhci5cbiAgICAgICAgfSxcblxuICAgICAgICBfaW52YWxpZERhdGU6ICdJbnZhbGlkIGRhdGUnLFxuICAgICAgICBpbnZhbGlkRGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ludmFsaWREYXRlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEZvcm1hdHRpbmdcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIGZ1bmN0aW9uIHJlbW92ZUZvcm1hdHRpbmdUb2tlbnMoaW5wdXQpIHtcbiAgICAgICAgaWYgKGlucHV0Lm1hdGNoKC9cXFtbXFxzXFxTXS8pKSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvXlxcW3xcXF0kL2csICcnKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5wdXQucmVwbGFjZSgvXFxcXC9nLCAnJyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUZvcm1hdEZ1bmN0aW9uKGZvcm1hdCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBmb3JtYXQubWF0Y2goZm9ybWF0dGluZ1Rva2VucyksIGksIGxlbmd0aDtcblxuICAgICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZvcm1hdFRva2VuRnVuY3Rpb25zW2FycmF5W2ldXSkge1xuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gZm9ybWF0VG9rZW5GdW5jdGlvbnNbYXJyYXlbaV1dO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IHJlbW92ZUZvcm1hdHRpbmdUb2tlbnMoYXJyYXlbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChtb20pIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSAnJztcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSBhcnJheVtpXSBpbnN0YW5jZW9mIEZ1bmN0aW9uID8gYXJyYXlbaV0uY2FsbChtb20sIGZvcm1hdCkgOiBhcnJheVtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gZm9ybWF0IGRhdGUgdXNpbmcgbmF0aXZlIGRhdGUgb2JqZWN0XG4gICAgZnVuY3Rpb24gZm9ybWF0TW9tZW50KG0sIGZvcm1hdCkge1xuICAgICAgICBpZiAoIW0uaXNWYWxpZCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gbS5sb2NhbGVEYXRhKCkuaW52YWxpZERhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcm1hdCA9IGV4cGFuZEZvcm1hdChmb3JtYXQsIG0ubG9jYWxlRGF0YSgpKTtcblxuICAgICAgICBpZiAoIWZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdKSB7XG4gICAgICAgICAgICBmb3JtYXRGdW5jdGlvbnNbZm9ybWF0XSA9IG1ha2VGb3JtYXRGdW5jdGlvbihmb3JtYXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdKG0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4cGFuZEZvcm1hdChmb3JtYXQsIGxvY2FsZSkge1xuICAgICAgICB2YXIgaSA9IDU7XG5cbiAgICAgICAgZnVuY3Rpb24gcmVwbGFjZUxvbmdEYXRlRm9ybWF0VG9rZW5zKGlucHV0KSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxlLmxvbmdEYXRlRm9ybWF0KGlucHV0KSB8fCBpbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvY2FsRm9ybWF0dGluZ1Rva2Vucy5sYXN0SW5kZXggPSAwO1xuICAgICAgICB3aGlsZSAoaSA+PSAwICYmIGxvY2FsRm9ybWF0dGluZ1Rva2Vucy50ZXN0KGZvcm1hdCkpIHtcbiAgICAgICAgICAgIGZvcm1hdCA9IGZvcm1hdC5yZXBsYWNlKGxvY2FsRm9ybWF0dGluZ1Rva2VucywgcmVwbGFjZUxvbmdEYXRlRm9ybWF0VG9rZW5zKTtcbiAgICAgICAgICAgIGxvY2FsRm9ybWF0dGluZ1Rva2Vucy5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgaSAtPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZvcm1hdDtcbiAgICB9XG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgUGFyc2luZ1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgLy8gZ2V0IHRoZSByZWdleCB0byBmaW5kIHRoZSBuZXh0IHRva2VuXG4gICAgZnVuY3Rpb24gZ2V0UGFyc2VSZWdleEZvclRva2VuKHRva2VuLCBjb25maWcpIHtcbiAgICAgICAgdmFyIGEsIHN0cmljdCA9IGNvbmZpZy5fc3RyaWN0O1xuICAgICAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAgIGNhc2UgJ1EnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5PbmVEaWdpdDtcbiAgICAgICAgY2FzZSAnRERERCc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlblRocmVlRGlnaXRzO1xuICAgICAgICBjYXNlICdZWVlZJzpcbiAgICAgICAgY2FzZSAnR0dHRyc6XG4gICAgICAgIGNhc2UgJ2dnZ2cnOlxuICAgICAgICAgICAgcmV0dXJuIHN0cmljdCA/IHBhcnNlVG9rZW5Gb3VyRGlnaXRzIDogcGFyc2VUb2tlbk9uZVRvRm91ckRpZ2l0cztcbiAgICAgICAgY2FzZSAnWSc6XG4gICAgICAgIGNhc2UgJ0cnOlxuICAgICAgICBjYXNlICdnJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuU2lnbmVkTnVtYmVyO1xuICAgICAgICBjYXNlICdZWVlZWVknOlxuICAgICAgICBjYXNlICdZWVlZWSc6XG4gICAgICAgIGNhc2UgJ0dHR0dHJzpcbiAgICAgICAgY2FzZSAnZ2dnZ2cnOlxuICAgICAgICAgICAgcmV0dXJuIHN0cmljdCA/IHBhcnNlVG9rZW5TaXhEaWdpdHMgOiBwYXJzZVRva2VuT25lVG9TaXhEaWdpdHM7XG4gICAgICAgIGNhc2UgJ1MnOlxuICAgICAgICAgICAgaWYgKHN0cmljdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuT25lRGlnaXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ1NTJzpcbiAgICAgICAgICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlblR3b0RpZ2l0cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnU1NTJzpcbiAgICAgICAgICAgIGlmIChzdHJpY3QpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlblRocmVlRGlnaXRzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdEREQnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5PbmVUb1RocmVlRGlnaXRzO1xuICAgICAgICBjYXNlICdNTU0nOlxuICAgICAgICBjYXNlICdNTU1NJzpcbiAgICAgICAgY2FzZSAnZGQnOlxuICAgICAgICBjYXNlICdkZGQnOlxuICAgICAgICBjYXNlICdkZGRkJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuV29yZDtcbiAgICAgICAgY2FzZSAnYSc6XG4gICAgICAgIGNhc2UgJ0EnOlxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZy5fbG9jYWxlLl9tZXJpZGllbVBhcnNlO1xuICAgICAgICBjYXNlICdYJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuVGltZXN0YW1wTXM7XG4gICAgICAgIGNhc2UgJ1onOlxuICAgICAgICBjYXNlICdaWic6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlblRpbWV6b25lO1xuICAgICAgICBjYXNlICdUJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuVDtcbiAgICAgICAgY2FzZSAnU1NTUyc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlbkRpZ2l0cztcbiAgICAgICAgY2FzZSAnTU0nOlxuICAgICAgICBjYXNlICdERCc6XG4gICAgICAgIGNhc2UgJ1lZJzpcbiAgICAgICAgY2FzZSAnR0cnOlxuICAgICAgICBjYXNlICdnZyc6XG4gICAgICAgIGNhc2UgJ0hIJzpcbiAgICAgICAgY2FzZSAnaGgnOlxuICAgICAgICBjYXNlICdtbSc6XG4gICAgICAgIGNhc2UgJ3NzJzpcbiAgICAgICAgY2FzZSAnd3cnOlxuICAgICAgICBjYXNlICdXVyc6XG4gICAgICAgICAgICByZXR1cm4gc3RyaWN0ID8gcGFyc2VUb2tlblR3b0RpZ2l0cyA6IHBhcnNlVG9rZW5PbmVPclR3b0RpZ2l0cztcbiAgICAgICAgY2FzZSAnTSc6XG4gICAgICAgIGNhc2UgJ0QnOlxuICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgY2FzZSAnSCc6XG4gICAgICAgIGNhc2UgJ2gnOlxuICAgICAgICBjYXNlICdtJzpcbiAgICAgICAgY2FzZSAncyc6XG4gICAgICAgIGNhc2UgJ3cnOlxuICAgICAgICBjYXNlICdXJzpcbiAgICAgICAgY2FzZSAnZSc6XG4gICAgICAgIGNhc2UgJ0UnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5PbmVPclR3b0RpZ2l0cztcbiAgICAgICAgY2FzZSAnRG8nOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5PcmRpbmFsO1xuICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICAgIGEgPSBuZXcgUmVnRXhwKHJlZ2V4cEVzY2FwZSh1bmVzY2FwZUZvcm1hdCh0b2tlbi5yZXBsYWNlKCdcXFxcJywgJycpKSwgJ2knKSk7XG4gICAgICAgICAgICByZXR1cm4gYTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRpbWV6b25lTWludXRlc0Zyb21TdHJpbmcoc3RyaW5nKSB7XG4gICAgICAgIHN0cmluZyA9IHN0cmluZyB8fCAnJztcbiAgICAgICAgdmFyIHBvc3NpYmxlVHpNYXRjaGVzID0gKHN0cmluZy5tYXRjaChwYXJzZVRva2VuVGltZXpvbmUpIHx8IFtdKSxcbiAgICAgICAgICAgIHR6Q2h1bmsgPSBwb3NzaWJsZVR6TWF0Y2hlc1twb3NzaWJsZVR6TWF0Y2hlcy5sZW5ndGggLSAxXSB8fCBbXSxcbiAgICAgICAgICAgIHBhcnRzID0gKHR6Q2h1bmsgKyAnJykubWF0Y2gocGFyc2VUaW1lem9uZUNodW5rZXIpIHx8IFsnLScsIDAsIDBdLFxuICAgICAgICAgICAgbWludXRlcyA9ICsocGFydHNbMV0gKiA2MCkgKyB0b0ludChwYXJ0c1syXSk7XG5cbiAgICAgICAgcmV0dXJuIHBhcnRzWzBdID09PSAnKycgPyAtbWludXRlcyA6IG1pbnV0ZXM7XG4gICAgfVxuXG4gICAgLy8gZnVuY3Rpb24gdG8gY29udmVydCBzdHJpbmcgaW5wdXQgdG8gZGF0ZVxuICAgIGZ1bmN0aW9uIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBpbnB1dCwgY29uZmlnKSB7XG4gICAgICAgIHZhciBhLCBkYXRlUGFydEFycmF5ID0gY29uZmlnLl9hO1xuXG4gICAgICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgICAgLy8gUVVBUlRFUlxuICAgICAgICBjYXNlICdRJzpcbiAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtNT05USF0gPSAodG9JbnQoaW5wdXQpIC0gMSkgKiAzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIE1PTlRIXG4gICAgICAgIGNhc2UgJ00nIDogLy8gZmFsbCB0aHJvdWdoIHRvIE1NXG4gICAgICAgIGNhc2UgJ01NJyA6XG4gICAgICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbTU9OVEhdID0gdG9JbnQoaW5wdXQpIC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdNTU0nIDogLy8gZmFsbCB0aHJvdWdoIHRvIE1NTU1cbiAgICAgICAgY2FzZSAnTU1NTScgOlxuICAgICAgICAgICAgYSA9IGNvbmZpZy5fbG9jYWxlLm1vbnRoc1BhcnNlKGlucHV0KTtcbiAgICAgICAgICAgIC8vIGlmIHdlIGRpZG4ndCBmaW5kIGEgbW9udGggbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkLlxuICAgICAgICAgICAgaWYgKGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbTU9OVEhdID0gYTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9wZi5pbnZhbGlkTW9udGggPSBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBEQVkgT0YgTU9OVEhcbiAgICAgICAgY2FzZSAnRCcgOiAvLyBmYWxsIHRocm91Z2ggdG8gRERcbiAgICAgICAgY2FzZSAnREQnIDpcbiAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtEQVRFXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdEbycgOlxuICAgICAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkYXRlUGFydEFycmF5W0RBVEVdID0gdG9JbnQocGFyc2VJbnQoaW5wdXQsIDEwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gREFZIE9GIFlFQVJcbiAgICAgICAgY2FzZSAnREREJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBEREREXG4gICAgICAgIGNhc2UgJ0REREQnIDpcbiAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9kYXlPZlllYXIgPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBZRUFSXG4gICAgICAgIGNhc2UgJ1lZJyA6XG4gICAgICAgICAgICBkYXRlUGFydEFycmF5W1lFQVJdID0gbW9tZW50LnBhcnNlVHdvRGlnaXRZZWFyKGlucHV0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdZWVlZJyA6XG4gICAgICAgIGNhc2UgJ1lZWVlZJyA6XG4gICAgICAgIGNhc2UgJ1lZWVlZWScgOlxuICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtZRUFSXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBBTSAvIFBNXG4gICAgICAgIGNhc2UgJ2EnIDogLy8gZmFsbCB0aHJvdWdoIHRvIEFcbiAgICAgICAgY2FzZSAnQScgOlxuICAgICAgICAgICAgY29uZmlnLl9pc1BtID0gY29uZmlnLl9sb2NhbGUuaXNQTShpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gMjQgSE9VUlxuICAgICAgICBjYXNlICdIJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBoaFxuICAgICAgICBjYXNlICdISCcgOiAvLyBmYWxsIHRocm91Z2ggdG8gaGhcbiAgICAgICAgY2FzZSAnaCcgOiAvLyBmYWxsIHRocm91Z2ggdG8gaGhcbiAgICAgICAgY2FzZSAnaGgnIDpcbiAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbSE9VUl0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gTUlOVVRFXG4gICAgICAgIGNhc2UgJ20nIDogLy8gZmFsbCB0aHJvdWdoIHRvIG1tXG4gICAgICAgIGNhc2UgJ21tJyA6XG4gICAgICAgICAgICBkYXRlUGFydEFycmF5W01JTlVURV0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gU0VDT05EXG4gICAgICAgIGNhc2UgJ3MnIDogLy8gZmFsbCB0aHJvdWdoIHRvIHNzXG4gICAgICAgIGNhc2UgJ3NzJyA6XG4gICAgICAgICAgICBkYXRlUGFydEFycmF5W1NFQ09ORF0gPSB0b0ludChpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gTUlMTElTRUNPTkRcbiAgICAgICAgY2FzZSAnUycgOlxuICAgICAgICBjYXNlICdTUycgOlxuICAgICAgICBjYXNlICdTU1MnIDpcbiAgICAgICAgY2FzZSAnU1NTUycgOlxuICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtNSUxMSVNFQ09ORF0gPSB0b0ludCgoJzAuJyArIGlucHV0KSAqIDEwMDApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFVOSVggVElNRVNUQU1QIFdJVEggTVNcbiAgICAgICAgY2FzZSAnWCc6XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShwYXJzZUZsb2F0KGlucHV0KSAqIDEwMDApO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFRJTUVaT05FXG4gICAgICAgIGNhc2UgJ1onIDogLy8gZmFsbCB0aHJvdWdoIHRvIFpaXG4gICAgICAgIGNhc2UgJ1paJyA6XG4gICAgICAgICAgICBjb25maWcuX3VzZVVUQyA9IHRydWU7XG4gICAgICAgICAgICBjb25maWcuX3R6bSA9IHRpbWV6b25lTWludXRlc0Zyb21TdHJpbmcoaW5wdXQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFdFRUtEQVkgLSBodW1hblxuICAgICAgICBjYXNlICdkZCc6XG4gICAgICAgIGNhc2UgJ2RkZCc6XG4gICAgICAgIGNhc2UgJ2RkZGQnOlxuICAgICAgICAgICAgYSA9IGNvbmZpZy5fbG9jYWxlLndlZWtkYXlzUGFyc2UoaW5wdXQpO1xuICAgICAgICAgICAgLy8gaWYgd2UgZGlkbid0IGdldCBhIHdlZWtkYXkgbmFtZSwgbWFyayB0aGUgZGF0ZSBhcyBpbnZhbGlkXG4gICAgICAgICAgICBpZiAoYSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl93ID0gY29uZmlnLl93IHx8IHt9O1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fd1snZCddID0gYTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uZmlnLl9wZi5pbnZhbGlkV2Vla2RheSA9IGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFdFRUssIFdFRUsgREFZIC0gbnVtZXJpY1xuICAgICAgICBjYXNlICd3JzpcbiAgICAgICAgY2FzZSAnd3cnOlxuICAgICAgICBjYXNlICdXJzpcbiAgICAgICAgY2FzZSAnV1cnOlxuICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgY2FzZSAnZSc6XG4gICAgICAgIGNhc2UgJ0UnOlxuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbi5zdWJzdHIoMCwgMSk7XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ2dnZ2cnOlxuICAgICAgICBjYXNlICdHR0dHJzpcbiAgICAgICAgY2FzZSAnR0dHR0cnOlxuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbi5zdWJzdHIoMCwgMik7XG4gICAgICAgICAgICBpZiAoaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX3cgPSBjb25maWcuX3cgfHwge307XG4gICAgICAgICAgICAgICAgY29uZmlnLl93W3Rva2VuXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdnZyc6XG4gICAgICAgIGNhc2UgJ0dHJzpcbiAgICAgICAgICAgIGNvbmZpZy5fdyA9IGNvbmZpZy5fdyB8fCB7fTtcbiAgICAgICAgICAgIGNvbmZpZy5fd1t0b2tlbl0gPSBtb21lbnQucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGF5T2ZZZWFyRnJvbVdlZWtJbmZvKGNvbmZpZykge1xuICAgICAgICB2YXIgdywgd2Vla1llYXIsIHdlZWssIHdlZWtkYXksIGRvdywgZG95LCB0ZW1wO1xuXG4gICAgICAgIHcgPSBjb25maWcuX3c7XG4gICAgICAgIGlmICh3LkdHICE9IG51bGwgfHwgdy5XICE9IG51bGwgfHwgdy5FICE9IG51bGwpIHtcbiAgICAgICAgICAgIGRvdyA9IDE7XG4gICAgICAgICAgICBkb3kgPSA0O1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBXZSBuZWVkIHRvIHRha2UgdGhlIGN1cnJlbnQgaXNvV2Vla1llYXIsIGJ1dCB0aGF0IGRlcGVuZHMgb25cbiAgICAgICAgICAgIC8vIGhvdyB3ZSBpbnRlcnByZXQgbm93IChsb2NhbCwgdXRjLCBmaXhlZCBvZmZzZXQpLiBTbyBjcmVhdGVcbiAgICAgICAgICAgIC8vIGEgbm93IHZlcnNpb24gb2YgY3VycmVudCBjb25maWcgKHRha2UgbG9jYWwvdXRjL29mZnNldCBmbGFncywgYW5kXG4gICAgICAgICAgICAvLyBjcmVhdGUgbm93KS5cbiAgICAgICAgICAgIHdlZWtZZWFyID0gZGZsKHcuR0csIGNvbmZpZy5fYVtZRUFSXSwgd2Vla09mWWVhcihtb21lbnQoKSwgMSwgNCkueWVhcik7XG4gICAgICAgICAgICB3ZWVrID0gZGZsKHcuVywgMSk7XG4gICAgICAgICAgICB3ZWVrZGF5ID0gZGZsKHcuRSwgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb3cgPSBjb25maWcuX2xvY2FsZS5fd2Vlay5kb3c7XG4gICAgICAgICAgICBkb3kgPSBjb25maWcuX2xvY2FsZS5fd2Vlay5kb3k7XG5cbiAgICAgICAgICAgIHdlZWtZZWFyID0gZGZsKHcuZ2csIGNvbmZpZy5fYVtZRUFSXSwgd2Vla09mWWVhcihtb21lbnQoKSwgZG93LCBkb3kpLnllYXIpO1xuICAgICAgICAgICAgd2VlayA9IGRmbCh3LncsIDEpO1xuXG4gICAgICAgICAgICBpZiAody5kICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyB3ZWVrZGF5IC0tIGxvdyBkYXkgbnVtYmVycyBhcmUgY29uc2lkZXJlZCBuZXh0IHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gdy5kO1xuICAgICAgICAgICAgICAgIGlmICh3ZWVrZGF5IDwgZG93KSB7XG4gICAgICAgICAgICAgICAgICAgICsrd2VlaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHcuZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gbG9jYWwgd2Vla2RheSAtLSBjb3VudGluZyBzdGFydHMgZnJvbSBiZWdpbmluZyBvZiB3ZWVrXG4gICAgICAgICAgICAgICAgd2Vla2RheSA9IHcuZSArIGRvdztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZGVmYXVsdCB0byBiZWdpbmluZyBvZiB3ZWVrXG4gICAgICAgICAgICAgICAgd2Vla2RheSA9IGRvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZW1wID0gZGF5T2ZZZWFyRnJvbVdlZWtzKHdlZWtZZWFyLCB3ZWVrLCB3ZWVrZGF5LCBkb3ksIGRvdyk7XG5cbiAgICAgICAgY29uZmlnLl9hW1lFQVJdID0gdGVtcC55ZWFyO1xuICAgICAgICBjb25maWcuX2RheU9mWWVhciA9IHRlbXAuZGF5T2ZZZWFyO1xuICAgIH1cblxuICAgIC8vIGNvbnZlcnQgYW4gYXJyYXkgdG8gYSBkYXRlLlxuICAgIC8vIHRoZSBhcnJheSBzaG91bGQgbWlycm9yIHRoZSBwYXJhbWV0ZXJzIGJlbG93XG4gICAgLy8gbm90ZTogYWxsIHZhbHVlcyBwYXN0IHRoZSB5ZWFyIGFyZSBvcHRpb25hbCBhbmQgd2lsbCBkZWZhdWx0IHRvIHRoZSBsb3dlc3QgcG9zc2libGUgdmFsdWUuXG4gICAgLy8gW3llYXIsIG1vbnRoLCBkYXkgLCBob3VyLCBtaW51dGUsIHNlY29uZCwgbWlsbGlzZWNvbmRdXG4gICAgZnVuY3Rpb24gZGF0ZUZyb21Db25maWcoY29uZmlnKSB7XG4gICAgICAgIHZhciBpLCBkYXRlLCBpbnB1dCA9IFtdLCBjdXJyZW50RGF0ZSwgeWVhclRvVXNlO1xuXG4gICAgICAgIGlmIChjb25maWcuX2QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnREYXRlID0gY3VycmVudERhdGVBcnJheShjb25maWcpO1xuXG4gICAgICAgIC8vY29tcHV0ZSBkYXkgb2YgdGhlIHllYXIgZnJvbSB3ZWVrcyBhbmQgd2Vla2RheXNcbiAgICAgICAgaWYgKGNvbmZpZy5fdyAmJiBjb25maWcuX2FbREFURV0gPT0gbnVsbCAmJiBjb25maWcuX2FbTU9OVEhdID09IG51bGwpIHtcbiAgICAgICAgICAgIGRheU9mWWVhckZyb21XZWVrSW5mbyhjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9pZiB0aGUgZGF5IG9mIHRoZSB5ZWFyIGlzIHNldCwgZmlndXJlIG91dCB3aGF0IGl0IGlzXG4gICAgICAgIGlmIChjb25maWcuX2RheU9mWWVhcikge1xuICAgICAgICAgICAgeWVhclRvVXNlID0gZGZsKGNvbmZpZy5fYVtZRUFSXSwgY3VycmVudERhdGVbWUVBUl0pO1xuXG4gICAgICAgICAgICBpZiAoY29uZmlnLl9kYXlPZlllYXIgPiBkYXlzSW5ZZWFyKHllYXJUb1VzZSkpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX3BmLl9vdmVyZmxvd0RheU9mWWVhciA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRhdGUgPSBtYWtlVVRDRGF0ZSh5ZWFyVG9Vc2UsIDAsIGNvbmZpZy5fZGF5T2ZZZWFyKTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtNT05USF0gPSBkYXRlLmdldFVUQ01vbnRoKCk7XG4gICAgICAgICAgICBjb25maWcuX2FbREFURV0gPSBkYXRlLmdldFVUQ0RhdGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERlZmF1bHQgdG8gY3VycmVudCBkYXRlLlxuICAgICAgICAvLyAqIGlmIG5vIHllYXIsIG1vbnRoLCBkYXkgb2YgbW9udGggYXJlIGdpdmVuLCBkZWZhdWx0IHRvIHRvZGF5XG4gICAgICAgIC8vICogaWYgZGF5IG9mIG1vbnRoIGlzIGdpdmVuLCBkZWZhdWx0IG1vbnRoIGFuZCB5ZWFyXG4gICAgICAgIC8vICogaWYgbW9udGggaXMgZ2l2ZW4sIGRlZmF1bHQgb25seSB5ZWFyXG4gICAgICAgIC8vICogaWYgeWVhciBpcyBnaXZlbiwgZG9uJ3QgZGVmYXVsdCBhbnl0aGluZ1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMyAmJiBjb25maWcuX2FbaV0gPT0gbnVsbDsgKytpKSB7XG4gICAgICAgICAgICBjb25maWcuX2FbaV0gPSBpbnB1dFtpXSA9IGN1cnJlbnREYXRlW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gWmVybyBvdXQgd2hhdGV2ZXIgd2FzIG5vdCBkZWZhdWx0ZWQsIGluY2x1ZGluZyB0aW1lXG4gICAgICAgIGZvciAoOyBpIDwgNzsgaSsrKSB7XG4gICAgICAgICAgICBjb25maWcuX2FbaV0gPSBpbnB1dFtpXSA9IChjb25maWcuX2FbaV0gPT0gbnVsbCkgPyAoaSA9PT0gMiA/IDEgOiAwKSA6IGNvbmZpZy5fYVtpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZy5fZCA9IChjb25maWcuX3VzZVVUQyA/IG1ha2VVVENEYXRlIDogbWFrZURhdGUpLmFwcGx5KG51bGwsIGlucHV0KTtcbiAgICAgICAgLy8gQXBwbHkgdGltZXpvbmUgb2Zmc2V0IGZyb20gaW5wdXQuIFRoZSBhY3R1YWwgem9uZSBjYW4gYmUgY2hhbmdlZFxuICAgICAgICAvLyB3aXRoIHBhcnNlWm9uZS5cbiAgICAgICAgaWYgKGNvbmZpZy5fdHptICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZC5zZXRVVENNaW51dGVzKGNvbmZpZy5fZC5nZXRVVENNaW51dGVzKCkgKyBjb25maWcuX3R6bSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXRlRnJvbU9iamVjdChjb25maWcpIHtcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWRJbnB1dDtcblxuICAgICAgICBpZiAoY29uZmlnLl9kKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBub3JtYWxpemVkSW5wdXQgPSBub3JtYWxpemVPYmplY3RVbml0cyhjb25maWcuX2kpO1xuICAgICAgICBjb25maWcuX2EgPSBbXG4gICAgICAgICAgICBub3JtYWxpemVkSW5wdXQueWVhcixcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dC5tb250aCxcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dC5kYXksXG4gICAgICAgICAgICBub3JtYWxpemVkSW5wdXQuaG91cixcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dC5taW51dGUsXG4gICAgICAgICAgICBub3JtYWxpemVkSW5wdXQuc2Vjb25kLFxuICAgICAgICAgICAgbm9ybWFsaXplZElucHV0Lm1pbGxpc2Vjb25kXG4gICAgICAgIF07XG5cbiAgICAgICAgZGF0ZUZyb21Db25maWcoY29uZmlnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjdXJyZW50RGF0ZUFycmF5KGNvbmZpZykge1xuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgaWYgKGNvbmZpZy5fdXNlVVRDKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIG5vdy5nZXRVVENGdWxsWWVhcigpLFxuICAgICAgICAgICAgICAgIG5vdy5nZXRVVENNb250aCgpLFxuICAgICAgICAgICAgICAgIG5vdy5nZXRVVENEYXRlKClcbiAgICAgICAgICAgIF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW25vdy5nZXRGdWxsWWVhcigpLCBub3cuZ2V0TW9udGgoKSwgbm93LmdldERhdGUoKV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkYXRlIGZyb20gc3RyaW5nIGFuZCBmb3JtYXQgc3RyaW5nXG4gICAgZnVuY3Rpb24gbWFrZURhdGVGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZykge1xuICAgICAgICBpZiAoY29uZmlnLl9mID09PSBtb21lbnQuSVNPXzg2MDEpIHtcbiAgICAgICAgICAgIHBhcnNlSVNPKGNvbmZpZyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25maWcuX2EgPSBbXTtcbiAgICAgICAgY29uZmlnLl9wZi5lbXB0eSA9IHRydWU7XG5cbiAgICAgICAgLy8gVGhpcyBhcnJheSBpcyB1c2VkIHRvIG1ha2UgYSBEYXRlLCBlaXRoZXIgd2l0aCBgbmV3IERhdGVgIG9yIGBEYXRlLlVUQ2BcbiAgICAgICAgdmFyIHN0cmluZyA9ICcnICsgY29uZmlnLl9pLFxuICAgICAgICAgICAgaSwgcGFyc2VkSW5wdXQsIHRva2VucywgdG9rZW4sIHNraXBwZWQsXG4gICAgICAgICAgICBzdHJpbmdMZW5ndGggPSBzdHJpbmcubGVuZ3RoLFxuICAgICAgICAgICAgdG90YWxQYXJzZWRJbnB1dExlbmd0aCA9IDA7XG5cbiAgICAgICAgdG9rZW5zID0gZXhwYW5kRm9ybWF0KGNvbmZpZy5fZiwgY29uZmlnLl9sb2NhbGUpLm1hdGNoKGZvcm1hdHRpbmdUb2tlbnMpIHx8IFtdO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgcGFyc2VkSW5wdXQgPSAoc3RyaW5nLm1hdGNoKGdldFBhcnNlUmVnZXhGb3JUb2tlbih0b2tlbiwgY29uZmlnKSkgfHwgW10pWzBdO1xuICAgICAgICAgICAgaWYgKHBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgc2tpcHBlZCA9IHN0cmluZy5zdWJzdHIoMCwgc3RyaW5nLmluZGV4T2YocGFyc2VkSW5wdXQpKTtcbiAgICAgICAgICAgICAgICBpZiAoc2tpcHBlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5fcGYudW51c2VkSW5wdXQucHVzaChza2lwcGVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3RyaW5nID0gc3RyaW5nLnNsaWNlKHN0cmluZy5pbmRleE9mKHBhcnNlZElucHV0KSArIHBhcnNlZElucHV0Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdG90YWxQYXJzZWRJbnB1dExlbmd0aCArPSBwYXJzZWRJbnB1dC5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBkb24ndCBwYXJzZSBpZiBpdCdzIG5vdCBhIGtub3duIHRva2VuXG4gICAgICAgICAgICBpZiAoZm9ybWF0VG9rZW5GdW5jdGlvbnNbdG9rZW5dKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlZElucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5fcGYuZW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZy5fcGYudW51c2VkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhZGRUaW1lVG9BcnJheUZyb21Ub2tlbih0b2tlbiwgcGFyc2VkSW5wdXQsIGNvbmZpZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjb25maWcuX3N0cmljdCAmJiAhcGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX3BmLnVudXNlZFRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFkZCByZW1haW5pbmcgdW5wYXJzZWQgaW5wdXQgbGVuZ3RoIHRvIHRoZSBzdHJpbmdcbiAgICAgICAgY29uZmlnLl9wZi5jaGFyc0xlZnRPdmVyID0gc3RyaW5nTGVuZ3RoIC0gdG90YWxQYXJzZWRJbnB1dExlbmd0aDtcbiAgICAgICAgaWYgKHN0cmluZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25maWcuX3BmLnVudXNlZElucHV0LnB1c2goc3RyaW5nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGhhbmRsZSBhbSBwbVxuICAgICAgICBpZiAoY29uZmlnLl9pc1BtICYmIGNvbmZpZy5fYVtIT1VSXSA8IDEyKSB7XG4gICAgICAgICAgICBjb25maWcuX2FbSE9VUl0gKz0gMTI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgaXMgMTIgYW0sIGNoYW5nZSBob3VycyB0byAwXG4gICAgICAgIGlmIChjb25maWcuX2lzUG0gPT09IGZhbHNlICYmIGNvbmZpZy5fYVtIT1VSXSA9PT0gMTIpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBkYXRlRnJvbUNvbmZpZyhjb25maWcpO1xuICAgICAgICBjaGVja092ZXJmbG93KGNvbmZpZyk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5lc2NhcGVGb3JtYXQocykge1xuICAgICAgICByZXR1cm4gcy5yZXBsYWNlKC9cXFxcKFxcWyl8XFxcXChcXF0pfFxcWyhbXlxcXVxcW10qKVxcXXxcXFxcKC4pL2csIGZ1bmN0aW9uIChtYXRjaGVkLCBwMSwgcDIsIHAzLCBwNCkge1xuICAgICAgICAgICAgcmV0dXJuIHAxIHx8IHAyIHx8IHAzIHx8IHA0O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBDb2RlIGZyb20gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNTYxNDkzL2lzLXRoZXJlLWEtcmVnZXhwLWVzY2FwZS1mdW5jdGlvbi1pbi1qYXZhc2NyaXB0XG4gICAgZnVuY3Rpb24gcmVnZXhwRXNjYXBlKHMpIHtcbiAgICAgICAgcmV0dXJuIHMucmVwbGFjZSgvWy1cXC9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCAnXFxcXCQmJyk7XG4gICAgfVxuXG4gICAgLy8gZGF0ZSBmcm9tIHN0cmluZyBhbmQgYXJyYXkgb2YgZm9ybWF0IHN0cmluZ3NcbiAgICBmdW5jdGlvbiBtYWtlRGF0ZUZyb21TdHJpbmdBbmRBcnJheShjb25maWcpIHtcbiAgICAgICAgdmFyIHRlbXBDb25maWcsXG4gICAgICAgICAgICBiZXN0TW9tZW50LFxuXG4gICAgICAgICAgICBzY29yZVRvQmVhdCxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBjdXJyZW50U2NvcmU7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fZi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGNvbmZpZy5fcGYuaW52YWxpZEZvcm1hdCA9IHRydWU7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShOYU4pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNvbmZpZy5fZi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY3VycmVudFNjb3JlID0gMDtcbiAgICAgICAgICAgIHRlbXBDb25maWcgPSBjb3B5Q29uZmlnKHt9LCBjb25maWcpO1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5fdXNlVVRDICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0ZW1wQ29uZmlnLl91c2VVVEMgPSBjb25maWcuX3VzZVVUQztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlbXBDb25maWcuX3BmID0gZGVmYXVsdFBhcnNpbmdGbGFncygpO1xuICAgICAgICAgICAgdGVtcENvbmZpZy5fZiA9IGNvbmZpZy5fZltpXTtcbiAgICAgICAgICAgIG1ha2VEYXRlRnJvbVN0cmluZ0FuZEZvcm1hdCh0ZW1wQ29uZmlnKTtcblxuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKHRlbXBDb25maWcpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGFueSBpbnB1dCB0aGF0IHdhcyBub3QgcGFyc2VkIGFkZCBhIHBlbmFsdHkgZm9yIHRoYXQgZm9ybWF0XG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgKz0gdGVtcENvbmZpZy5fcGYuY2hhcnNMZWZ0T3ZlcjtcblxuICAgICAgICAgICAgLy9vciB0b2tlbnNcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSArPSB0ZW1wQ29uZmlnLl9wZi51bnVzZWRUb2tlbnMubGVuZ3RoICogMTA7XG5cbiAgICAgICAgICAgIHRlbXBDb25maWcuX3BmLnNjb3JlID0gY3VycmVudFNjb3JlO1xuXG4gICAgICAgICAgICBpZiAoc2NvcmVUb0JlYXQgPT0gbnVsbCB8fCBjdXJyZW50U2NvcmUgPCBzY29yZVRvQmVhdCkge1xuICAgICAgICAgICAgICAgIHNjb3JlVG9CZWF0ID0gY3VycmVudFNjb3JlO1xuICAgICAgICAgICAgICAgIGJlc3RNb21lbnQgPSB0ZW1wQ29uZmlnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZXh0ZW5kKGNvbmZpZywgYmVzdE1vbWVudCB8fCB0ZW1wQ29uZmlnKTtcbiAgICB9XG5cbiAgICAvLyBkYXRlIGZyb20gaXNvIGZvcm1hdFxuICAgIGZ1bmN0aW9uIHBhcnNlSVNPKGNvbmZpZykge1xuICAgICAgICB2YXIgaSwgbCxcbiAgICAgICAgICAgIHN0cmluZyA9IGNvbmZpZy5faSxcbiAgICAgICAgICAgIG1hdGNoID0gaXNvUmVnZXguZXhlYyhzdHJpbmcpO1xuXG4gICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgY29uZmlnLl9wZi5pc28gPSB0cnVlO1xuICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IGlzb0RhdGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpc29EYXRlc1tpXVsxXS5leGVjKHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbWF0Y2hbNV0gc2hvdWxkIGJlICdUJyBvciB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9mID0gaXNvRGF0ZXNbaV1bMF0gKyAobWF0Y2hbNl0gfHwgJyAnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChpID0gMCwgbCA9IGlzb1RpbWVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpc29UaW1lc1tpXVsxXS5leGVjKHN0cmluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9mICs9IGlzb1RpbWVzW2ldWzBdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3RyaW5nLm1hdGNoKHBhcnNlVG9rZW5UaW1lem9uZSkpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX2YgKz0gJ1onO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWFrZURhdGVGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25maWcuX2lzVmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSBpc28gZm9ybWF0IG9yIGZhbGxiYWNrXG4gICAgZnVuY3Rpb24gbWFrZURhdGVGcm9tU3RyaW5nKGNvbmZpZykge1xuICAgICAgICBwYXJzZUlTTyhjb25maWcpO1xuICAgICAgICBpZiAoY29uZmlnLl9pc1ZhbGlkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgZGVsZXRlIGNvbmZpZy5faXNWYWxpZDtcbiAgICAgICAgICAgIG1vbWVudC5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayhjb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFwKGFyciwgZm4pIHtcbiAgICAgICAgdmFyIHJlcyA9IFtdLCBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICByZXMucHVzaChmbihhcnJbaV0sIGkpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VEYXRlRnJvbUlucHV0KGNvbmZpZykge1xuICAgICAgICB2YXIgaW5wdXQgPSBjb25maWcuX2ksIG1hdGNoZWQ7XG4gICAgICAgIGlmIChpbnB1dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzRGF0ZShpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCtpbnB1dCk7XG4gICAgICAgIH0gZWxzZSBpZiAoKG1hdGNoZWQgPSBhc3BOZXRKc29uUmVnZXguZXhlYyhpbnB1dCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZSgrbWF0Y2hlZFsxXSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgbWFrZURhdGVGcm9tU3RyaW5nKGNvbmZpZyk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShpbnB1dCkpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYSA9IG1hcChpbnB1dC5zbGljZSgwKSwgZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZUludChvYmosIDEwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGF0ZUZyb21Db25maWcoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YoaW5wdXQpID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgZGF0ZUZyb21PYmplY3QoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YoaW5wdXQpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgLy8gZnJvbSBtaWxsaXNlY29uZHNcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKGlucHV0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1vbWVudC5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayhjb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZURhdGUoeSwgbSwgZCwgaCwgTSwgcywgbXMpIHtcbiAgICAgICAgLy9jYW4ndCBqdXN0IGFwcGx5KCkgdG8gY3JlYXRlIGEgZGF0ZTpcbiAgICAgICAgLy9odHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE4MTM0OC9pbnN0YW50aWF0aW5nLWEtamF2YXNjcmlwdC1vYmplY3QtYnktY2FsbGluZy1wcm90b3R5cGUtY29uc3RydWN0b3ItYXBwbHlcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh5LCBtLCBkLCBoLCBNLCBzLCBtcyk7XG5cbiAgICAgICAgLy90aGUgZGF0ZSBjb25zdHJ1Y3RvciBkb2Vzbid0IGFjY2VwdCB5ZWFycyA8IDE5NzBcbiAgICAgICAgaWYgKHkgPCAxOTcwKSB7XG4gICAgICAgICAgICBkYXRlLnNldEZ1bGxZZWFyKHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VVVENEYXRlKHkpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQy5hcHBseShudWxsLCBhcmd1bWVudHMpKTtcbiAgICAgICAgaWYgKHkgPCAxOTcwKSB7XG4gICAgICAgICAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlV2Vla2RheShpbnB1dCwgbG9jYWxlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAoIWlzTmFOKGlucHV0KSkge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gcGFyc2VJbnQoaW5wdXQsIDEwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gbG9jYWxlLndlZWtkYXlzUGFyc2UoaW5wdXQpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaW5wdXQgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBSZWxhdGl2ZSBUaW1lXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICAvLyBoZWxwZXIgZnVuY3Rpb24gZm9yIG1vbWVudC5mbi5mcm9tLCBtb21lbnQuZm4uZnJvbU5vdywgYW5kIG1vbWVudC5kdXJhdGlvbi5mbi5odW1hbml6ZVxuICAgIGZ1bmN0aW9uIHN1YnN0aXR1dGVUaW1lQWdvKHN0cmluZywgbnVtYmVyLCB3aXRob3V0U3VmZml4LCBpc0Z1dHVyZSwgbG9jYWxlKSB7XG4gICAgICAgIHJldHVybiBsb2NhbGUucmVsYXRpdmVUaW1lKG51bWJlciB8fCAxLCAhIXdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbGF0aXZlVGltZShwb3NOZWdEdXJhdGlvbiwgd2l0aG91dFN1ZmZpeCwgbG9jYWxlKSB7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IG1vbWVudC5kdXJhdGlvbihwb3NOZWdEdXJhdGlvbikuYWJzKCksXG4gICAgICAgICAgICBzZWNvbmRzID0gcm91bmQoZHVyYXRpb24uYXMoJ3MnKSksXG4gICAgICAgICAgICBtaW51dGVzID0gcm91bmQoZHVyYXRpb24uYXMoJ20nKSksXG4gICAgICAgICAgICBob3VycyA9IHJvdW5kKGR1cmF0aW9uLmFzKCdoJykpLFxuICAgICAgICAgICAgZGF5cyA9IHJvdW5kKGR1cmF0aW9uLmFzKCdkJykpLFxuICAgICAgICAgICAgbW9udGhzID0gcm91bmQoZHVyYXRpb24uYXMoJ00nKSksXG4gICAgICAgICAgICB5ZWFycyA9IHJvdW5kKGR1cmF0aW9uLmFzKCd5JykpLFxuXG4gICAgICAgICAgICBhcmdzID0gc2Vjb25kcyA8IHJlbGF0aXZlVGltZVRocmVzaG9sZHMucyAmJiBbJ3MnLCBzZWNvbmRzXSB8fFxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPT09IDEgJiYgWydtJ10gfHxcbiAgICAgICAgICAgICAgICBtaW51dGVzIDwgcmVsYXRpdmVUaW1lVGhyZXNob2xkcy5tICYmIFsnbW0nLCBtaW51dGVzXSB8fFxuICAgICAgICAgICAgICAgIGhvdXJzID09PSAxICYmIFsnaCddIHx8XG4gICAgICAgICAgICAgICAgaG91cnMgPCByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzLmggJiYgWydoaCcsIGhvdXJzXSB8fFxuICAgICAgICAgICAgICAgIGRheXMgPT09IDEgJiYgWydkJ10gfHxcbiAgICAgICAgICAgICAgICBkYXlzIDwgcmVsYXRpdmVUaW1lVGhyZXNob2xkcy5kICYmIFsnZGQnLCBkYXlzXSB8fFxuICAgICAgICAgICAgICAgIG1vbnRocyA9PT0gMSAmJiBbJ00nXSB8fFxuICAgICAgICAgICAgICAgIG1vbnRocyA8IHJlbGF0aXZlVGltZVRocmVzaG9sZHMuTSAmJiBbJ01NJywgbW9udGhzXSB8fFxuICAgICAgICAgICAgICAgIHllYXJzID09PSAxICYmIFsneSddIHx8IFsneXknLCB5ZWFyc107XG5cbiAgICAgICAgYXJnc1syXSA9IHdpdGhvdXRTdWZmaXg7XG4gICAgICAgIGFyZ3NbM10gPSArcG9zTmVnRHVyYXRpb24gPiAwO1xuICAgICAgICBhcmdzWzRdID0gbG9jYWxlO1xuICAgICAgICByZXR1cm4gc3Vic3RpdHV0ZVRpbWVBZ28uYXBwbHkoe30sIGFyZ3MpO1xuICAgIH1cblxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBXZWVrIG9mIFllYXJcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIC8vIGZpcnN0RGF5T2ZXZWVrICAgICAgIDAgPSBzdW4sIDYgPSBzYXRcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICB0aGUgZGF5IG9mIHRoZSB3ZWVrIHRoYXQgc3RhcnRzIHRoZSB3ZWVrXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgKHVzdWFsbHkgc3VuZGF5IG9yIG1vbmRheSlcbiAgICAvLyBmaXJzdERheU9mV2Vla09mWWVhciAwID0gc3VuLCA2ID0gc2F0XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgdGhlIGZpcnN0IHdlZWsgaXMgdGhlIHdlZWsgdGhhdCBjb250YWlucyB0aGUgZmlyc3RcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICBvZiB0aGlzIGRheSBvZiB0aGUgd2Vla1xuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIChlZy4gSVNPIHdlZWtzIHVzZSB0aHVyc2RheSAoNCkpXG4gICAgZnVuY3Rpb24gd2Vla09mWWVhcihtb20sIGZpcnN0RGF5T2ZXZWVrLCBmaXJzdERheU9mV2Vla09mWWVhcikge1xuICAgICAgICB2YXIgZW5kID0gZmlyc3REYXlPZldlZWtPZlllYXIgLSBmaXJzdERheU9mV2VlayxcbiAgICAgICAgICAgIGRheXNUb0RheU9mV2VlayA9IGZpcnN0RGF5T2ZXZWVrT2ZZZWFyIC0gbW9tLmRheSgpLFxuICAgICAgICAgICAgYWRqdXN0ZWRNb21lbnQ7XG5cblxuICAgICAgICBpZiAoZGF5c1RvRGF5T2ZXZWVrID4gZW5kKSB7XG4gICAgICAgICAgICBkYXlzVG9EYXlPZldlZWsgLT0gNztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXlzVG9EYXlPZldlZWsgPCBlbmQgLSA3KSB7XG4gICAgICAgICAgICBkYXlzVG9EYXlPZldlZWsgKz0gNztcbiAgICAgICAgfVxuXG4gICAgICAgIGFkanVzdGVkTW9tZW50ID0gbW9tZW50KG1vbSkuYWRkKGRheXNUb0RheU9mV2VlaywgJ2QnKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHdlZWs6IE1hdGguY2VpbChhZGp1c3RlZE1vbWVudC5kYXlPZlllYXIoKSAvIDcpLFxuICAgICAgICAgICAgeWVhcjogYWRqdXN0ZWRNb21lbnQueWVhcigpXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy9odHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0lTT193ZWVrX2RhdGUjQ2FsY3VsYXRpbmdfYV9kYXRlX2dpdmVuX3RoZV95ZWFyLjJDX3dlZWtfbnVtYmVyX2FuZF93ZWVrZGF5XG4gICAgZnVuY3Rpb24gZGF5T2ZZZWFyRnJvbVdlZWtzKHllYXIsIHdlZWssIHdlZWtkYXksIGZpcnN0RGF5T2ZXZWVrT2ZZZWFyLCBmaXJzdERheU9mV2Vlaykge1xuICAgICAgICB2YXIgZCA9IG1ha2VVVENEYXRlKHllYXIsIDAsIDEpLmdldFVUQ0RheSgpLCBkYXlzVG9BZGQsIGRheU9mWWVhcjtcblxuICAgICAgICBkID0gZCA9PT0gMCA/IDcgOiBkO1xuICAgICAgICB3ZWVrZGF5ID0gd2Vla2RheSAhPSBudWxsID8gd2Vla2RheSA6IGZpcnN0RGF5T2ZXZWVrO1xuICAgICAgICBkYXlzVG9BZGQgPSBmaXJzdERheU9mV2VlayAtIGQgKyAoZCA+IGZpcnN0RGF5T2ZXZWVrT2ZZZWFyID8gNyA6IDApIC0gKGQgPCBmaXJzdERheU9mV2VlayA/IDcgOiAwKTtcbiAgICAgICAgZGF5T2ZZZWFyID0gNyAqICh3ZWVrIC0gMSkgKyAod2Vla2RheSAtIGZpcnN0RGF5T2ZXZWVrKSArIGRheXNUb0FkZCArIDE7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHllYXI6IGRheU9mWWVhciA+IDAgPyB5ZWFyIDogeWVhciAtIDEsXG4gICAgICAgICAgICBkYXlPZlllYXI6IGRheU9mWWVhciA+IDAgPyAgZGF5T2ZZZWFyIDogZGF5c0luWWVhcih5ZWFyIC0gMSkgKyBkYXlPZlllYXJcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIFRvcCBMZXZlbCBGdW5jdGlvbnNcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICBmdW5jdGlvbiBtYWtlTW9tZW50KGNvbmZpZykge1xuICAgICAgICB2YXIgaW5wdXQgPSBjb25maWcuX2ksXG4gICAgICAgICAgICBmb3JtYXQgPSBjb25maWcuX2Y7XG5cbiAgICAgICAgY29uZmlnLl9sb2NhbGUgPSBjb25maWcuX2xvY2FsZSB8fCBtb21lbnQubG9jYWxlRGF0YShjb25maWcuX2wpO1xuXG4gICAgICAgIGlmIChpbnB1dCA9PT0gbnVsbCB8fCAoZm9ybWF0ID09PSB1bmRlZmluZWQgJiYgaW5wdXQgPT09ICcnKSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudC5pbnZhbGlkKHtudWxsSW5wdXQ6IHRydWV9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjb25maWcuX2kgPSBpbnB1dCA9IGNvbmZpZy5fbG9jYWxlLnByZXBhcnNlKGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtb21lbnQuaXNNb21lbnQoaW5wdXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1vbWVudChpbnB1dCwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZm9ybWF0KSB7XG4gICAgICAgICAgICBpZiAoaXNBcnJheShmb3JtYXQpKSB7XG4gICAgICAgICAgICAgICAgbWFrZURhdGVGcm9tU3RyaW5nQW5kQXJyYXkoY29uZmlnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWFrZURhdGVGcm9tU3RyaW5nQW5kRm9ybWF0KGNvbmZpZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtYWtlRGF0ZUZyb21JbnB1dChjb25maWcpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBNb21lbnQoY29uZmlnKTtcbiAgICB9XG5cbiAgICBtb21lbnQgPSBmdW5jdGlvbiAoaW5wdXQsIGZvcm1hdCwgbG9jYWxlLCBzdHJpY3QpIHtcbiAgICAgICAgdmFyIGM7XG5cbiAgICAgICAgaWYgKHR5cGVvZihsb2NhbGUpID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIHN0cmljdCA9IGxvY2FsZTtcbiAgICAgICAgICAgIGxvY2FsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICAvLyBvYmplY3QgY29uc3RydWN0aW9uIG11c3QgYmUgZG9uZSB0aGlzIHdheS5cbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE0MjNcbiAgICAgICAgYyA9IHt9O1xuICAgICAgICBjLl9pc0FNb21lbnRPYmplY3QgPSB0cnVlO1xuICAgICAgICBjLl9pID0gaW5wdXQ7XG4gICAgICAgIGMuX2YgPSBmb3JtYXQ7XG4gICAgICAgIGMuX2wgPSBsb2NhbGU7XG4gICAgICAgIGMuX3N0cmljdCA9IHN0cmljdDtcbiAgICAgICAgYy5faXNVVEMgPSBmYWxzZTtcbiAgICAgICAgYy5fcGYgPSBkZWZhdWx0UGFyc2luZ0ZsYWdzKCk7XG5cbiAgICAgICAgcmV0dXJuIG1ha2VNb21lbnQoYyk7XG4gICAgfTtcblxuICAgIG1vbWVudC5zdXBwcmVzc0RlcHJlY2F0aW9uV2FybmluZ3MgPSBmYWxzZTtcblxuICAgIG1vbWVudC5jcmVhdGVGcm9tSW5wdXRGYWxsYmFjayA9IGRlcHJlY2F0ZShcbiAgICAgICAgJ21vbWVudCBjb25zdHJ1Y3Rpb24gZmFsbHMgYmFjayB0byBqcyBEYXRlLiBUaGlzIGlzICcgK1xuICAgICAgICAnZGlzY291cmFnZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB1cGNvbWluZyBtYWpvciAnICtcbiAgICAgICAgJ3JlbGVhc2UuIFBsZWFzZSByZWZlciB0byAnICtcbiAgICAgICAgJ2h0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNDA3IGZvciBtb3JlIGluZm8uJyxcbiAgICAgICAgZnVuY3Rpb24gKGNvbmZpZykge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoY29uZmlnLl9pKTtcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICAvLyBQaWNrIGEgbW9tZW50IG0gZnJvbSBtb21lbnRzIHNvIHRoYXQgbVtmbl0ob3RoZXIpIGlzIHRydWUgZm9yIGFsbFxuICAgIC8vIG90aGVyLiBUaGlzIHJlbGllcyBvbiB0aGUgZnVuY3Rpb24gZm4gdG8gYmUgdHJhbnNpdGl2ZS5cbiAgICAvL1xuICAgIC8vIG1vbWVudHMgc2hvdWxkIGVpdGhlciBiZSBhbiBhcnJheSBvZiBtb21lbnQgb2JqZWN0cyBvciBhbiBhcnJheSwgd2hvc2VcbiAgICAvLyBmaXJzdCBlbGVtZW50IGlzIGFuIGFycmF5IG9mIG1vbWVudCBvYmplY3RzLlxuICAgIGZ1bmN0aW9uIHBpY2tCeShmbiwgbW9tZW50cykge1xuICAgICAgICB2YXIgcmVzLCBpO1xuICAgICAgICBpZiAobW9tZW50cy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShtb21lbnRzWzBdKSkge1xuICAgICAgICAgICAgbW9tZW50cyA9IG1vbWVudHNbMF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFtb21lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudCgpO1xuICAgICAgICB9XG4gICAgICAgIHJlcyA9IG1vbWVudHNbMF07XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBtb21lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAobW9tZW50c1tpXVtmbl0ocmVzKSkge1xuICAgICAgICAgICAgICAgIHJlcyA9IG1vbWVudHNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBtb21lbnQubWluID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0JlZm9yZScsIGFyZ3MpO1xuICAgIH07XG5cbiAgICBtb21lbnQubWF4ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcblxuICAgICAgICByZXR1cm4gcGlja0J5KCdpc0FmdGVyJywgYXJncyk7XG4gICAgfTtcblxuICAgIC8vIGNyZWF0aW5nIHdpdGggdXRjXG4gICAgbW9tZW50LnV0YyA9IGZ1bmN0aW9uIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCkge1xuICAgICAgICB2YXIgYztcblxuICAgICAgICBpZiAodHlwZW9mKGxvY2FsZSkgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgc3RyaWN0ID0gbG9jYWxlO1xuICAgICAgICAgICAgbG9jYWxlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9iamVjdCBjb25zdHJ1Y3Rpb24gbXVzdCBiZSBkb25lIHRoaXMgd2F5LlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTQyM1xuICAgICAgICBjID0ge307XG4gICAgICAgIGMuX2lzQU1vbWVudE9iamVjdCA9IHRydWU7XG4gICAgICAgIGMuX3VzZVVUQyA9IHRydWU7XG4gICAgICAgIGMuX2lzVVRDID0gdHJ1ZTtcbiAgICAgICAgYy5fbCA9IGxvY2FsZTtcbiAgICAgICAgYy5faSA9IGlucHV0O1xuICAgICAgICBjLl9mID0gZm9ybWF0O1xuICAgICAgICBjLl9zdHJpY3QgPSBzdHJpY3Q7XG4gICAgICAgIGMuX3BmID0gZGVmYXVsdFBhcnNpbmdGbGFncygpO1xuXG4gICAgICAgIHJldHVybiBtYWtlTW9tZW50KGMpLnV0YygpO1xuICAgIH07XG5cbiAgICAvLyBjcmVhdGluZyB3aXRoIHVuaXggdGltZXN0YW1wIChpbiBzZWNvbmRzKVxuICAgIG1vbWVudC51bml4ID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBtb21lbnQoaW5wdXQgKiAxMDAwKTtcbiAgICB9O1xuXG4gICAgLy8gZHVyYXRpb25cbiAgICBtb21lbnQuZHVyYXRpb24gPSBmdW5jdGlvbiAoaW5wdXQsIGtleSkge1xuICAgICAgICB2YXIgZHVyYXRpb24gPSBpbnB1dCxcbiAgICAgICAgICAgIC8vIG1hdGNoaW5nIGFnYWluc3QgcmVnZXhwIGlzIGV4cGVuc2l2ZSwgZG8gaXQgb24gZGVtYW5kXG4gICAgICAgICAgICBtYXRjaCA9IG51bGwsXG4gICAgICAgICAgICBzaWduLFxuICAgICAgICAgICAgcmV0LFxuICAgICAgICAgICAgcGFyc2VJc28sXG4gICAgICAgICAgICBkaWZmUmVzO1xuXG4gICAgICAgIGlmIChtb21lbnQuaXNEdXJhdGlvbihpbnB1dCkpIHtcbiAgICAgICAgICAgIGR1cmF0aW9uID0ge1xuICAgICAgICAgICAgICAgIG1zOiBpbnB1dC5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgICAgIGQ6IGlucHV0Ll9kYXlzLFxuICAgICAgICAgICAgICAgIE06IGlucHV0Ll9tb250aHNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGlucHV0ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbltrZXldID0gaW5wdXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uLm1pbGxpc2Vjb25kcyA9IGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCEhKG1hdGNoID0gYXNwTmV0VGltZVNwYW5Kc29uUmVnZXguZXhlYyhpbnB1dCkpKSB7XG4gICAgICAgICAgICBzaWduID0gKG1hdGNoWzFdID09PSAnLScpID8gLTEgOiAxO1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgeTogMCxcbiAgICAgICAgICAgICAgICBkOiB0b0ludChtYXRjaFtEQVRFXSkgKiBzaWduLFxuICAgICAgICAgICAgICAgIGg6IHRvSW50KG1hdGNoW0hPVVJdKSAqIHNpZ24sXG4gICAgICAgICAgICAgICAgbTogdG9JbnQobWF0Y2hbTUlOVVRFXSkgKiBzaWduLFxuICAgICAgICAgICAgICAgIHM6IHRvSW50KG1hdGNoW1NFQ09ORF0pICogc2lnbixcbiAgICAgICAgICAgICAgICBtczogdG9JbnQobWF0Y2hbTUlMTElTRUNPTkRdKSAqIHNpZ25cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoISEobWF0Y2ggPSBpc29EdXJhdGlvblJlZ2V4LmV4ZWMoaW5wdXQpKSkge1xuICAgICAgICAgICAgc2lnbiA9IChtYXRjaFsxXSA9PT0gJy0nKSA/IC0xIDogMTtcbiAgICAgICAgICAgIHBhcnNlSXNvID0gZnVuY3Rpb24gKGlucCkge1xuICAgICAgICAgICAgICAgIC8vIFdlJ2Qgbm9ybWFsbHkgdXNlIH5+aW5wIGZvciB0aGlzLCBidXQgdW5mb3J0dW5hdGVseSBpdCBhbHNvXG4gICAgICAgICAgICAgICAgLy8gY29udmVydHMgZmxvYXRzIHRvIGludHMuXG4gICAgICAgICAgICAgICAgLy8gaW5wIG1heSBiZSB1bmRlZmluZWQsIHNvIGNhcmVmdWwgY2FsbGluZyByZXBsYWNlIG9uIGl0LlxuICAgICAgICAgICAgICAgIHZhciByZXMgPSBpbnAgJiYgcGFyc2VGbG9hdChpbnAucmVwbGFjZSgnLCcsICcuJykpO1xuICAgICAgICAgICAgICAgIC8vIGFwcGx5IHNpZ24gd2hpbGUgd2UncmUgYXQgaXRcbiAgICAgICAgICAgICAgICByZXR1cm4gKGlzTmFOKHJlcykgPyAwIDogcmVzKSAqIHNpZ247XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgeTogcGFyc2VJc28obWF0Y2hbMl0pLFxuICAgICAgICAgICAgICAgIE06IHBhcnNlSXNvKG1hdGNoWzNdKSxcbiAgICAgICAgICAgICAgICBkOiBwYXJzZUlzbyhtYXRjaFs0XSksXG4gICAgICAgICAgICAgICAgaDogcGFyc2VJc28obWF0Y2hbNV0pLFxuICAgICAgICAgICAgICAgIG06IHBhcnNlSXNvKG1hdGNoWzZdKSxcbiAgICAgICAgICAgICAgICBzOiBwYXJzZUlzbyhtYXRjaFs3XSksXG4gICAgICAgICAgICAgICAgdzogcGFyc2VJc28obWF0Y2hbOF0pXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkdXJhdGlvbiA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgICAgICAoJ2Zyb20nIGluIGR1cmF0aW9uIHx8ICd0bycgaW4gZHVyYXRpb24pKSB7XG4gICAgICAgICAgICBkaWZmUmVzID0gbW9tZW50c0RpZmZlcmVuY2UobW9tZW50KGR1cmF0aW9uLmZyb20pLCBtb21lbnQoZHVyYXRpb24udG8pKTtcblxuICAgICAgICAgICAgZHVyYXRpb24gPSB7fTtcbiAgICAgICAgICAgIGR1cmF0aW9uLm1zID0gZGlmZlJlcy5taWxsaXNlY29uZHM7XG4gICAgICAgICAgICBkdXJhdGlvbi5NID0gZGlmZlJlcy5tb250aHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXQgPSBuZXcgRHVyYXRpb24oZHVyYXRpb24pO1xuXG4gICAgICAgIGlmIChtb21lbnQuaXNEdXJhdGlvbihpbnB1dCkgJiYgaGFzT3duUHJvcChpbnB1dCwgJ19sb2NhbGUnKSkge1xuICAgICAgICAgICAgcmV0Ll9sb2NhbGUgPSBpbnB1dC5fbG9jYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9O1xuXG4gICAgLy8gdmVyc2lvbiBudW1iZXJcbiAgICBtb21lbnQudmVyc2lvbiA9IFZFUlNJT047XG5cbiAgICAvLyBkZWZhdWx0IGZvcm1hdFxuICAgIG1vbWVudC5kZWZhdWx0Rm9ybWF0ID0gaXNvRm9ybWF0O1xuXG4gICAgLy8gY29uc3RhbnQgdGhhdCByZWZlcnMgdG8gdGhlIElTTyBzdGFuZGFyZFxuICAgIG1vbWVudC5JU09fODYwMSA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgLy8gUGx1Z2lucyB0aGF0IGFkZCBwcm9wZXJ0aWVzIHNob3VsZCBhbHNvIGFkZCB0aGUga2V5IGhlcmUgKG51bGwgdmFsdWUpLFxuICAgIC8vIHNvIHdlIGNhbiBwcm9wZXJseSBjbG9uZSBvdXJzZWx2ZXMuXG4gICAgbW9tZW50Lm1vbWVudFByb3BlcnRpZXMgPSBtb21lbnRQcm9wZXJ0aWVzO1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aGVuZXZlciBhIG1vbWVudCBpcyBtdXRhdGVkLlxuICAgIC8vIEl0IGlzIGludGVuZGVkIHRvIGtlZXAgdGhlIG9mZnNldCBpbiBzeW5jIHdpdGggdGhlIHRpbWV6b25lLlxuICAgIG1vbWVudC51cGRhdGVPZmZzZXQgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIC8vIFRoaXMgZnVuY3Rpb24gYWxsb3dzIHlvdSB0byBzZXQgYSB0aHJlc2hvbGQgZm9yIHJlbGF0aXZlIHRpbWUgc3RyaW5nc1xuICAgIG1vbWVudC5yZWxhdGl2ZVRpbWVUaHJlc2hvbGQgPSBmdW5jdGlvbiAodGhyZXNob2xkLCBsaW1pdCkge1xuICAgICAgICBpZiAocmVsYXRpdmVUaW1lVGhyZXNob2xkc1t0aHJlc2hvbGRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGltaXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlbGF0aXZlVGltZVRocmVzaG9sZHNbdGhyZXNob2xkXTtcbiAgICAgICAgfVxuICAgICAgICByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzW3RocmVzaG9sZF0gPSBsaW1pdDtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIG1vbWVudC5sYW5nID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50LmxhbmcgaXMgZGVwcmVjYXRlZC4gVXNlIG1vbWVudC5sb2NhbGUgaW5zdGVhZC4nLFxuICAgICAgICBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudC5sb2NhbGUoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiB3aWxsIGxvYWQgbG9jYWxlIGFuZCB0aGVuIHNldCB0aGUgZ2xvYmFsIGxvY2FsZS4gIElmXG4gICAgLy8gbm8gYXJndW1lbnRzIGFyZSBwYXNzZWQgaW4sIGl0IHdpbGwgc2ltcGx5IHJldHVybiB0aGUgY3VycmVudCBnbG9iYWxcbiAgICAvLyBsb2NhbGUga2V5LlxuICAgIG1vbWVudC5sb2NhbGUgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZXMpIHtcbiAgICAgICAgdmFyIGRhdGE7XG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YodmFsdWVzKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gbW9tZW50LmRlZmluZUxvY2FsZShrZXksIHZhbHVlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gbW9tZW50LmxvY2FsZURhdGEoa2V5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBtb21lbnQuZHVyYXRpb24uX2xvY2FsZSA9IG1vbWVudC5fbG9jYWxlID0gZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtb21lbnQuX2xvY2FsZS5fYWJicjtcbiAgICB9O1xuXG4gICAgbW9tZW50LmRlZmluZUxvY2FsZSA9IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZXMpIHtcbiAgICAgICAgaWYgKHZhbHVlcyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFsdWVzLmFiYnIgPSBuYW1lO1xuICAgICAgICAgICAgaWYgKCFsb2NhbGVzW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxlc1tuYW1lXSA9IG5ldyBMb2NhbGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvY2FsZXNbbmFtZV0uc2V0KHZhbHVlcyk7XG5cbiAgICAgICAgICAgIC8vIGJhY2t3YXJkcyBjb21wYXQgZm9yIG5vdzogYWxzbyBzZXQgdGhlIGxvY2FsZVxuICAgICAgICAgICAgbW9tZW50LmxvY2FsZShuYW1lKTtcblxuICAgICAgICAgICAgcmV0dXJuIGxvY2FsZXNbbmFtZV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB1c2VmdWwgZm9yIHRlc3RpbmdcbiAgICAgICAgICAgIGRlbGV0ZSBsb2NhbGVzW25hbWVdO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbW9tZW50LmxhbmdEYXRhID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50LmxhbmdEYXRhIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb21lbnQubG9jYWxlRGF0YSBpbnN0ZWFkLicsXG4gICAgICAgIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBtb21lbnQubG9jYWxlRGF0YShrZXkpO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIC8vIHJldHVybnMgbG9jYWxlIGRhdGFcbiAgICBtb21lbnQubG9jYWxlRGF0YSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIGxvY2FsZTtcblxuICAgICAgICBpZiAoa2V5ICYmIGtleS5fbG9jYWxlICYmIGtleS5fbG9jYWxlLl9hYmJyKSB7XG4gICAgICAgICAgICBrZXkgPSBrZXkuX2xvY2FsZS5fYWJicjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgha2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50Ll9sb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzQXJyYXkoa2V5KSkge1xuICAgICAgICAgICAgLy9zaG9ydC1jaXJjdWl0IGV2ZXJ5dGhpbmcgZWxzZVxuICAgICAgICAgICAgbG9jYWxlID0gbG9hZExvY2FsZShrZXkpO1xuICAgICAgICAgICAgaWYgKGxvY2FsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrZXkgPSBba2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjaG9vc2VMb2NhbGUoa2V5KTtcbiAgICB9O1xuXG4gICAgLy8gY29tcGFyZSBtb21lbnQgb2JqZWN0XG4gICAgbW9tZW50LmlzTW9tZW50ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgTW9tZW50IHx8XG4gICAgICAgICAgICAob2JqICE9IG51bGwgJiYgaGFzT3duUHJvcChvYmosICdfaXNBTW9tZW50T2JqZWN0JykpO1xuICAgIH07XG5cbiAgICAvLyBmb3IgdHlwZWNoZWNraW5nIER1cmF0aW9uIG9iamVjdHNcbiAgICBtb21lbnQuaXNEdXJhdGlvbiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIER1cmF0aW9uO1xuICAgIH07XG5cbiAgICBmb3IgKGkgPSBsaXN0cy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICBtYWtlTGlzdChsaXN0c1tpXSk7XG4gICAgfVxuXG4gICAgbW9tZW50Lm5vcm1hbGl6ZVVuaXRzID0gZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgICAgIHJldHVybiBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgfTtcblxuICAgIG1vbWVudC5pbnZhbGlkID0gZnVuY3Rpb24gKGZsYWdzKSB7XG4gICAgICAgIHZhciBtID0gbW9tZW50LnV0YyhOYU4pO1xuICAgICAgICBpZiAoZmxhZ3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgZXh0ZW5kKG0uX3BmLCBmbGFncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtLl9wZi51c2VySW52YWxpZGF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG07XG4gICAgfTtcblxuICAgIG1vbWVudC5wYXJzZVpvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBtb21lbnQuYXBwbHkobnVsbCwgYXJndW1lbnRzKS5wYXJzZVpvbmUoKTtcbiAgICB9O1xuXG4gICAgbW9tZW50LnBhcnNlVHdvRGlnaXRZZWFyID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0b0ludChpbnB1dCkgKyAodG9JbnQoaW5wdXQpID4gNjggPyAxOTAwIDogMjAwMCk7XG4gICAgfTtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgTW9tZW50IFByb3RvdHlwZVxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgZXh0ZW5kKG1vbWVudC5mbiA9IE1vbWVudC5wcm90b3R5cGUsIHtcblxuICAgICAgICBjbG9uZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBtb21lbnQodGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdmFsdWVPZiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiArdGhpcy5fZCArICgodGhpcy5fb2Zmc2V0IHx8IDApICogNjAwMDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIHVuaXggOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigrdGhpcyAvIDEwMDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvU3RyaW5nIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKS5sb2NhbGUoJ2VuJykuZm9ybWF0KCdkZGQgTU1NIEREIFlZWVkgSEg6bW06c3MgW0dNVF1aWicpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvRGF0ZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXQgPyBuZXcgRGF0ZSgrdGhpcykgOiB0aGlzLl9kO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvSVNPU3RyaW5nIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG0gPSBtb21lbnQodGhpcykudXRjKCk7XG4gICAgICAgICAgICBpZiAoMCA8IG0ueWVhcigpICYmIG0ueWVhcigpIDw9IDk5OTkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0TW9tZW50KG0sICdZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRNb21lbnQobSwgJ1lZWVlZWS1NTS1ERFtUXUhIOm1tOnNzLlNTU1taXScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHRvQXJyYXkgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbSA9IHRoaXM7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIG0ueWVhcigpLFxuICAgICAgICAgICAgICAgIG0ubW9udGgoKSxcbiAgICAgICAgICAgICAgICBtLmRhdGUoKSxcbiAgICAgICAgICAgICAgICBtLmhvdXJzKCksXG4gICAgICAgICAgICAgICAgbS5taW51dGVzKCksXG4gICAgICAgICAgICAgICAgbS5zZWNvbmRzKCksXG4gICAgICAgICAgICAgICAgbS5taWxsaXNlY29uZHMoKVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc1ZhbGlkIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQodGhpcyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNEU1RTaGlmdGVkIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2EpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkKCkgJiYgY29tcGFyZUFycmF5cyh0aGlzLl9hLCAodGhpcy5faXNVVEMgPyBtb21lbnQudXRjKHRoaXMuX2EpIDogbW9tZW50KHRoaXMuX2EpKS50b0FycmF5KCkpID4gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNpbmdGbGFncyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBleHRlbmQoe30sIHRoaXMuX3BmKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbnZhbGlkQXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wZi5vdmVyZmxvdztcbiAgICAgICAgfSxcblxuICAgICAgICB1dGMgOiBmdW5jdGlvbiAoa2VlcExvY2FsVGltZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuem9uZSgwLCBrZWVwTG9jYWxUaW1lKTtcbiAgICAgICAgfSxcblxuICAgICAgICBsb2NhbCA6IGZ1bmN0aW9uIChrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5faXNVVEMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnpvbmUoMCwga2VlcExvY2FsVGltZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5faXNVVEMgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIGlmIChrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkKHRoaXMuX2RhdGVUek9mZnNldCgpLCAnbScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZvcm1hdCA6IGZ1bmN0aW9uIChpbnB1dFN0cmluZykge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IGZvcm1hdE1vbWVudCh0aGlzLCBpbnB1dFN0cmluZyB8fCBtb21lbnQuZGVmYXVsdEZvcm1hdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkucG9zdGZvcm1hdChvdXRwdXQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZCA6IGNyZWF0ZUFkZGVyKDEsICdhZGQnKSxcblxuICAgICAgICBzdWJ0cmFjdCA6IGNyZWF0ZUFkZGVyKC0xLCAnc3VidHJhY3QnKSxcblxuICAgICAgICBkaWZmIDogZnVuY3Rpb24gKGlucHV0LCB1bml0cywgYXNGbG9hdCkge1xuICAgICAgICAgICAgdmFyIHRoYXQgPSBtYWtlQXMoaW5wdXQsIHRoaXMpLFxuICAgICAgICAgICAgICAgIHpvbmVEaWZmID0gKHRoaXMuem9uZSgpIC0gdGhhdC56b25lKCkpICogNmU0LFxuICAgICAgICAgICAgICAgIGRpZmYsIG91dHB1dCwgZGF5c0FkanVzdDtcblxuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG5cbiAgICAgICAgICAgIGlmICh1bml0cyA9PT0gJ3llYXInIHx8IHVuaXRzID09PSAnbW9udGgnKSB7XG4gICAgICAgICAgICAgICAgLy8gYXZlcmFnZSBudW1iZXIgb2YgZGF5cyBpbiB0aGUgbW9udGhzIGluIHRoZSBnaXZlbiBkYXRlc1xuICAgICAgICAgICAgICAgIGRpZmYgPSAodGhpcy5kYXlzSW5Nb250aCgpICsgdGhhdC5kYXlzSW5Nb250aCgpKSAqIDQzMmU1OyAvLyAyNCAqIDYwICogNjAgKiAxMDAwIC8gMlxuICAgICAgICAgICAgICAgIC8vIGRpZmZlcmVuY2UgaW4gbW9udGhzXG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gKCh0aGlzLnllYXIoKSAtIHRoYXQueWVhcigpKSAqIDEyKSArICh0aGlzLm1vbnRoKCkgLSB0aGF0Lm1vbnRoKCkpO1xuICAgICAgICAgICAgICAgIC8vIGFkanVzdCBieSB0YWtpbmcgZGlmZmVyZW5jZSBpbiBkYXlzLCBhdmVyYWdlIG51bWJlciBvZiBkYXlzXG4gICAgICAgICAgICAgICAgLy8gYW5kIGRzdCBpbiB0aGUgZ2l2ZW4gbW9udGhzLlxuICAgICAgICAgICAgICAgIGRheXNBZGp1c3QgPSAodGhpcyAtIG1vbWVudCh0aGlzKS5zdGFydE9mKCdtb250aCcpKSAtXG4gICAgICAgICAgICAgICAgICAgICh0aGF0IC0gbW9tZW50KHRoYXQpLnN0YXJ0T2YoJ21vbnRoJykpO1xuICAgICAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdpdGggem9uZXMsIHRvIG5lZ2F0ZSBhbGwgZHN0XG4gICAgICAgICAgICAgICAgZGF5c0FkanVzdCAtPSAoKHRoaXMuem9uZSgpIC0gbW9tZW50KHRoaXMpLnN0YXJ0T2YoJ21vbnRoJykuem9uZSgpKSAtXG4gICAgICAgICAgICAgICAgICAgICAgICAodGhhdC56b25lKCkgLSBtb21lbnQodGhhdCkuc3RhcnRPZignbW9udGgnKS56b25lKCkpKSAqIDZlNDtcbiAgICAgICAgICAgICAgICBvdXRwdXQgKz0gZGF5c0FkanVzdCAvIGRpZmY7XG4gICAgICAgICAgICAgICAgaWYgKHVuaXRzID09PSAneWVhcicpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0ID0gb3V0cHV0IC8gMTI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkaWZmID0gKHRoaXMgLSB0aGF0KTtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSB1bml0cyA9PT0gJ3NlY29uZCcgPyBkaWZmIC8gMWUzIDogLy8gMTAwMFxuICAgICAgICAgICAgICAgICAgICB1bml0cyA9PT0gJ21pbnV0ZScgPyBkaWZmIC8gNmU0IDogLy8gMTAwMCAqIDYwXG4gICAgICAgICAgICAgICAgICAgIHVuaXRzID09PSAnaG91cicgPyBkaWZmIC8gMzZlNSA6IC8vIDEwMDAgKiA2MCAqIDYwXG4gICAgICAgICAgICAgICAgICAgIHVuaXRzID09PSAnZGF5JyA/IChkaWZmIC0gem9uZURpZmYpIC8gODY0ZTUgOiAvLyAxMDAwICogNjAgKiA2MCAqIDI0LCBuZWdhdGUgZHN0XG4gICAgICAgICAgICAgICAgICAgIHVuaXRzID09PSAnd2VlaycgPyAoZGlmZiAtIHpvbmVEaWZmKSAvIDYwNDhlNSA6IC8vIDEwMDAgKiA2MCAqIDYwICogMjQgKiA3LCBuZWdhdGUgZHN0XG4gICAgICAgICAgICAgICAgICAgIGRpZmY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXNGbG9hdCA/IG91dHB1dCA6IGFic1JvdW5kKG91dHB1dCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZnJvbSA6IGZ1bmN0aW9uICh0aW1lLCB3aXRob3V0U3VmZml4KSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50LmR1cmF0aW9uKHt0bzogdGhpcywgZnJvbTogdGltZX0pLmxvY2FsZSh0aGlzLmxvY2FsZSgpKS5odW1hbml6ZSghd2l0aG91dFN1ZmZpeCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZnJvbU5vdyA6IGZ1bmN0aW9uICh3aXRob3V0U3VmZml4KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mcm9tKG1vbWVudCgpLCB3aXRob3V0U3VmZml4KTtcbiAgICAgICAgfSxcblxuICAgICAgICBjYWxlbmRhciA6IGZ1bmN0aW9uICh0aW1lKSB7XG4gICAgICAgICAgICAvLyBXZSB3YW50IHRvIGNvbXBhcmUgdGhlIHN0YXJ0IG9mIHRvZGF5LCB2cyB0aGlzLlxuICAgICAgICAgICAgLy8gR2V0dGluZyBzdGFydC1vZi10b2RheSBkZXBlbmRzIG9uIHdoZXRoZXIgd2UncmUgem9uZSdkIG9yIG5vdC5cbiAgICAgICAgICAgIHZhciBub3cgPSB0aW1lIHx8IG1vbWVudCgpLFxuICAgICAgICAgICAgICAgIHNvZCA9IG1ha2VBcyhub3csIHRoaXMpLnN0YXJ0T2YoJ2RheScpLFxuICAgICAgICAgICAgICAgIGRpZmYgPSB0aGlzLmRpZmYoc29kLCAnZGF5cycsIHRydWUpLFxuICAgICAgICAgICAgICAgIGZvcm1hdCA9IGRpZmYgPCAtNiA/ICdzYW1lRWxzZScgOlxuICAgICAgICAgICAgICAgICAgICBkaWZmIDwgLTEgPyAnbGFzdFdlZWsnIDpcbiAgICAgICAgICAgICAgICAgICAgZGlmZiA8IDAgPyAnbGFzdERheScgOlxuICAgICAgICAgICAgICAgICAgICBkaWZmIDwgMSA/ICdzYW1lRGF5JyA6XG4gICAgICAgICAgICAgICAgICAgIGRpZmYgPCAyID8gJ25leHREYXknIDpcbiAgICAgICAgICAgICAgICAgICAgZGlmZiA8IDcgPyAnbmV4dFdlZWsnIDogJ3NhbWVFbHNlJztcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZvcm1hdCh0aGlzLmxvY2FsZURhdGEoKS5jYWxlbmRhcihmb3JtYXQsIHRoaXMpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0xlYXBZZWFyIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzTGVhcFllYXIodGhpcy55ZWFyKCkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzRFNUIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnpvbmUoKSA8IHRoaXMuY2xvbmUoKS5tb250aCgwKS56b25lKCkgfHxcbiAgICAgICAgICAgICAgICB0aGlzLnpvbmUoKSA8IHRoaXMuY2xvbmUoKS5tb250aCg1KS56b25lKCkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRheSA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICAgICAgdmFyIGRheSA9IHRoaXMuX2lzVVRDID8gdGhpcy5fZC5nZXRVVENEYXkoKSA6IHRoaXMuX2QuZ2V0RGF5KCk7XG4gICAgICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gcGFyc2VXZWVrZGF5KGlucHV0LCB0aGlzLmxvY2FsZURhdGEoKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWRkKGlucHV0IC0gZGF5LCAnZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG1vbnRoIDogbWFrZUFjY2Vzc29yKCdNb250aCcsIHRydWUpLFxuXG4gICAgICAgIHN0YXJ0T2YgOiBmdW5jdGlvbiAodW5pdHMpIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgLy8gdGhlIGZvbGxvd2luZyBzd2l0Y2ggaW50ZW50aW9uYWxseSBvbWl0cyBicmVhayBrZXl3b3Jkc1xuICAgICAgICAgICAgLy8gdG8gdXRpbGl6ZSBmYWxsaW5nIHRocm91Z2ggdGhlIGNhc2VzLlxuICAgICAgICAgICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICAgICAgY2FzZSAneWVhcic6XG4gICAgICAgICAgICAgICAgdGhpcy5tb250aCgwKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICdxdWFydGVyJzpcbiAgICAgICAgICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGUoMSk7XG4gICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgY2FzZSAnd2Vlayc6XG4gICAgICAgICAgICBjYXNlICdpc29XZWVrJzpcbiAgICAgICAgICAgIGNhc2UgJ2RheSc6XG4gICAgICAgICAgICAgICAgdGhpcy5ob3VycygwKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICdob3VyJzpcbiAgICAgICAgICAgICAgICB0aGlzLm1pbnV0ZXMoMCk7XG4gICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgY2FzZSAnbWludXRlJzpcbiAgICAgICAgICAgICAgICB0aGlzLnNlY29uZHMoMCk7XG4gICAgICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgY2FzZSAnc2Vjb25kJzpcbiAgICAgICAgICAgICAgICB0aGlzLm1pbGxpc2Vjb25kcygwKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHdlZWtzIGFyZSBhIHNwZWNpYWwgY2FzZVxuICAgICAgICAgICAgaWYgKHVuaXRzID09PSAnd2VlaycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLndlZWtkYXkoMCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHVuaXRzID09PSAnaXNvV2VlaycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzb1dlZWtkYXkoMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHF1YXJ0ZXJzIGFyZSBhbHNvIHNwZWNpYWxcbiAgICAgICAgICAgIGlmICh1bml0cyA9PT0gJ3F1YXJ0ZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb250aChNYXRoLmZsb29yKHRoaXMubW9udGgoKSAvIDMpICogMyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGVuZE9mOiBmdW5jdGlvbiAodW5pdHMpIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnRPZih1bml0cykuYWRkKDEsICh1bml0cyA9PT0gJ2lzb1dlZWsnID8gJ3dlZWsnIDogdW5pdHMpKS5zdWJ0cmFjdCgxLCAnbXMnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0FmdGVyOiBmdW5jdGlvbiAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHR5cGVvZiB1bml0cyAhPT0gJ3VuZGVmaW5lZCcgPyB1bml0cyA6ICdtaWxsaXNlY29uZCcpO1xuICAgICAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBtb21lbnQuaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBtb21lbnQoaW5wdXQpO1xuICAgICAgICAgICAgICAgIHJldHVybiArdGhpcyA+ICtpbnB1dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICt0aGlzLmNsb25lKCkuc3RhcnRPZih1bml0cykgPiArbW9tZW50KGlucHV0KS5zdGFydE9mKHVuaXRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBpc0JlZm9yZTogZnVuY3Rpb24gKGlucHV0LCB1bml0cykge1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh0eXBlb2YgdW5pdHMgIT09ICd1bmRlZmluZWQnID8gdW5pdHMgOiAnbWlsbGlzZWNvbmQnKTtcbiAgICAgICAgICAgIGlmICh1bml0cyA9PT0gJ21pbGxpc2Vjb25kJykge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gbW9tZW50LmlzTW9tZW50KGlucHV0KSA/IGlucHV0IDogbW9tZW50KGlucHV0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gK3RoaXMgPCAraW5wdXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiArdGhpcy5jbG9uZSgpLnN0YXJ0T2YodW5pdHMpIDwgK21vbWVudChpbnB1dCkuc3RhcnRPZih1bml0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNTYW1lOiBmdW5jdGlvbiAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzIHx8ICdtaWxsaXNlY29uZCcpO1xuICAgICAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBtb21lbnQuaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBtb21lbnQoaW5wdXQpO1xuICAgICAgICAgICAgICAgIHJldHVybiArdGhpcyA9PT0gK2lucHV0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gK3RoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKSA9PT0gK21ha2VBcyhpbnB1dCwgdGhpcykuc3RhcnRPZih1bml0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbWluOiBkZXByZWNhdGUoXG4gICAgICAgICAgICAgICAgICdtb21lbnQoKS5taW4gaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudC5taW4gaW5zdGVhZC4gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE1NDgnLFxuICAgICAgICAgICAgICAgICBmdW5jdGlvbiAob3RoZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgIG90aGVyID0gbW9tZW50LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3RoZXIgPCB0aGlzID8gdGhpcyA6IG90aGVyO1xuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICApLFxuXG4gICAgICAgIG1heDogZGVwcmVjYXRlKFxuICAgICAgICAgICAgICAgICdtb21lbnQoKS5tYXggaXMgZGVwcmVjYXRlZCwgdXNlIG1vbWVudC5tYXggaW5zdGVhZC4gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE1NDgnLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChvdGhlcikge1xuICAgICAgICAgICAgICAgICAgICBvdGhlciA9IG1vbWVudC5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3RoZXIgPiB0aGlzID8gdGhpcyA6IG90aGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgKSxcblxuICAgICAgICAvLyBrZWVwTG9jYWxUaW1lID0gdHJ1ZSBtZWFucyBvbmx5IGNoYW5nZSB0aGUgdGltZXpvbmUsIHdpdGhvdXRcbiAgICAgICAgLy8gYWZmZWN0aW5nIHRoZSBsb2NhbCBob3VyLiBTbyA1OjMxOjI2ICswMzAwIC0tW3pvbmUoMiwgdHJ1ZSldLS0+XG4gICAgICAgIC8vIDU6MzE6MjYgKzAyMDAgSXQgaXMgcG9zc2libGUgdGhhdCA1OjMxOjI2IGRvZXNuJ3QgZXhpc3QgaW50IHpvbmVcbiAgICAgICAgLy8gKzAyMDAsIHNvIHdlIGFkanVzdCB0aGUgdGltZSBhcyBuZWVkZWQsIHRvIGJlIHZhbGlkLlxuICAgICAgICAvL1xuICAgICAgICAvLyBLZWVwaW5nIHRoZSB0aW1lIGFjdHVhbGx5IGFkZHMvc3VidHJhY3RzIChvbmUgaG91cilcbiAgICAgICAgLy8gZnJvbSB0aGUgYWN0dWFsIHJlcHJlc2VudGVkIHRpbWUuIFRoYXQgaXMgd2h5IHdlIGNhbGwgdXBkYXRlT2Zmc2V0XG4gICAgICAgIC8vIGEgc2Vjb25kIHRpbWUuIEluIGNhc2UgaXQgd2FudHMgdXMgdG8gY2hhbmdlIHRoZSBvZmZzZXQgYWdhaW5cbiAgICAgICAgLy8gX2NoYW5nZUluUHJvZ3Jlc3MgPT0gdHJ1ZSBjYXNlLCB0aGVuIHdlIGhhdmUgdG8gYWRqdXN0LCBiZWNhdXNlXG4gICAgICAgIC8vIHRoZXJlIGlzIG5vIHN1Y2ggdGltZSBpbiB0aGUgZ2l2ZW4gdGltZXpvbmUuXG4gICAgICAgIHpvbmUgOiBmdW5jdGlvbiAoaW5wdXQsIGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLl9vZmZzZXQgfHwgMCxcbiAgICAgICAgICAgICAgICBsb2NhbEFkanVzdDtcbiAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSB0aW1lem9uZU1pbnV0ZXNGcm9tU3RyaW5nKGlucHV0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKGlucHV0KSA8IDE2KSB7XG4gICAgICAgICAgICAgICAgICAgIGlucHV0ID0gaW5wdXQgKiA2MDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9pc1VUQyAmJiBrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsQWRqdXN0ID0gdGhpcy5fZGF0ZVR6T2Zmc2V0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX29mZnNldCA9IGlucHV0O1xuICAgICAgICAgICAgICAgIHRoaXMuX2lzVVRDID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAobG9jYWxBZGp1c3QgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1YnRyYWN0KGxvY2FsQWRqdXN0LCAnbScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob2Zmc2V0ICE9PSBpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWtlZXBMb2NhbFRpbWUgfHwgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkT3JTdWJ0cmFjdER1cmF0aW9uRnJvbU1vbWVudCh0aGlzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb21lbnQuZHVyYXRpb24ob2Zmc2V0IC0gaW5wdXQsICdtJyksIDEsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb21lbnQudXBkYXRlT2Zmc2V0KHRoaXMsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlSW5Qcm9ncmVzcyA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/IG9mZnNldCA6IHRoaXMuX2RhdGVUek9mZnNldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgem9uZUFiYnIgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyAnVVRDJyA6ICcnO1xuICAgICAgICB9LFxuXG4gICAgICAgIHpvbmVOYW1lIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gJ0Nvb3JkaW5hdGVkIFVuaXZlcnNhbCBUaW1lJyA6ICcnO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlWm9uZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl90em0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnpvbmUodGhpcy5fdHptKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuX2kgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy56b25lKHRoaXMuX2kpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaGFzQWxpZ25lZEhvdXJPZmZzZXQgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IG1vbWVudChpbnB1dCkuem9uZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuem9uZSgpIC0gaW5wdXQpICUgNjAgPT09IDA7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGF5c0luTW9udGggOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF5c0luTW9udGgodGhpcy55ZWFyKCksIHRoaXMubW9udGgoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGF5T2ZZZWFyIDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgZGF5T2ZZZWFyID0gcm91bmQoKG1vbWVudCh0aGlzKS5zdGFydE9mKCdkYXknKSAtIG1vbWVudCh0aGlzKS5zdGFydE9mKCd5ZWFyJykpIC8gODY0ZTUpICsgMTtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gZGF5T2ZZZWFyIDogdGhpcy5hZGQoKGlucHV0IC0gZGF5T2ZZZWFyKSwgJ2QnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBxdWFydGVyIDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IE1hdGguY2VpbCgodGhpcy5tb250aCgpICsgMSkgLyAzKSA6IHRoaXMubW9udGgoKGlucHV0IC0gMSkgKiAzICsgdGhpcy5tb250aCgpICUgMyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2Vla1llYXIgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB5ZWFyID0gd2Vla09mWWVhcih0aGlzLCB0aGlzLmxvY2FsZURhdGEoKS5fd2Vlay5kb3csIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRveSkueWVhcjtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8geWVhciA6IHRoaXMuYWRkKChpbnB1dCAtIHllYXIpLCAneScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzb1dlZWtZZWFyIDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgeWVhciA9IHdlZWtPZlllYXIodGhpcywgMSwgNCkueWVhcjtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8geWVhciA6IHRoaXMuYWRkKChpbnB1dCAtIHllYXIpLCAneScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdlZWsgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB3ZWVrID0gdGhpcy5sb2NhbGVEYXRhKCkud2Vlayh0aGlzKTtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2VlayA6IHRoaXMuYWRkKChpbnB1dCAtIHdlZWspICogNywgJ2QnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc29XZWVrIDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgd2VlayA9IHdlZWtPZlllYXIodGhpcywgMSwgNCkud2VlaztcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gd2VlayA6IHRoaXMuYWRkKChpbnB1dCAtIHdlZWspICogNywgJ2QnKTtcbiAgICAgICAgfSxcblxuICAgICAgICB3ZWVrZGF5IDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgd2Vla2RheSA9ICh0aGlzLmRheSgpICsgNyAtIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRvdykgJSA3O1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrZGF5IDogdGhpcy5hZGQoaW5wdXQgLSB3ZWVrZGF5LCAnZCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzb1dlZWtkYXkgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIC8vIGJlaGF2ZXMgdGhlIHNhbWUgYXMgbW9tZW50I2RheSBleGNlcHRcbiAgICAgICAgICAgIC8vIGFzIGEgZ2V0dGVyLCByZXR1cm5zIDcgaW5zdGVhZCBvZiAwICgxLTcgcmFuZ2UgaW5zdGVhZCBvZiAwLTYpXG4gICAgICAgICAgICAvLyBhcyBhIHNldHRlciwgc3VuZGF5IHNob3VsZCBiZWxvbmcgdG8gdGhlIHByZXZpb3VzIHdlZWsuXG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHRoaXMuZGF5KCkgfHwgNyA6IHRoaXMuZGF5KHRoaXMuZGF5KCkgJSA3ID8gaW5wdXQgOiBpbnB1dCAtIDcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzb1dlZWtzSW5ZZWFyIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMueWVhcigpLCAxLCA0KTtcbiAgICAgICAgfSxcblxuICAgICAgICB3ZWVrc0luWWVhciA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB3ZWVrSW5mbyA9IHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrO1xuICAgICAgICAgICAgcmV0dXJuIHdlZWtzSW5ZZWFyKHRoaXMueWVhcigpLCB3ZWVrSW5mby5kb3csIHdlZWtJbmZvLmRveSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0IDogZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW3VuaXRzXSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNldCA6IGZ1bmN0aW9uICh1bml0cywgdmFsdWUpIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzW3VuaXRzXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRoaXNbdW5pdHNdKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIElmIHBhc3NlZCBhIGxvY2FsZSBrZXksIGl0IHdpbGwgc2V0IHRoZSBsb2NhbGUgZm9yIHRoaXNcbiAgICAgICAgLy8gaW5zdGFuY2UuICBPdGhlcndpc2UsIGl0IHdpbGwgcmV0dXJuIHRoZSBsb2NhbGUgY29uZmlndXJhdGlvblxuICAgICAgICAvLyB2YXJpYWJsZXMgZm9yIHRoaXMgaW5zdGFuY2UuXG4gICAgICAgIGxvY2FsZSA6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHZhciBuZXdMb2NhbGVEYXRhO1xuXG4gICAgICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlLl9hYmJyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdMb2NhbGVEYXRhID0gbW9tZW50LmxvY2FsZURhdGEoa2V5KTtcbiAgICAgICAgICAgICAgICBpZiAobmV3TG9jYWxlRGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xvY2FsZSA9IG5ld0xvY2FsZURhdGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGxhbmcgOiBkZXByZWNhdGUoXG4gICAgICAgICAgICAnbW9tZW50KCkubGFuZygpIGlzIGRlcHJlY2F0ZWQuIFVzZSBtb21lbnQoKS5sb2NhbGVEYXRhKCkgaW5zdGVhZC4nLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlKGtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApLFxuXG4gICAgICAgIGxvY2FsZURhdGEgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xuICAgICAgICB9LFxuXG4gICAgICAgIF9kYXRlVHpPZmZzZXQgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBPbiBGaXJlZm94LjI0IERhdGUjZ2V0VGltZXpvbmVPZmZzZXQgcmV0dXJucyBhIGZsb2F0aW5nIHBvaW50LlxuICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvcHVsbC8xODcxXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh0aGlzLl9kLmdldFRpbWV6b25lT2Zmc2V0KCkgLyAxNSkgKiAxNTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gcmF3TW9udGhTZXR0ZXIobW9tLCB2YWx1ZSkge1xuICAgICAgICB2YXIgZGF5T2ZNb250aDtcblxuICAgICAgICAvLyBUT0RPOiBNb3ZlIHRoaXMgb3V0IG9mIGhlcmUhXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG1vbS5sb2NhbGVEYXRhKCkubW9udGhzUGFyc2UodmFsdWUpO1xuICAgICAgICAgICAgLy8gVE9ETzogQW5vdGhlciBzaWxlbnQgZmFpbHVyZT9cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGRheU9mTW9udGggPSBNYXRoLm1pbihtb20uZGF0ZSgpLFxuICAgICAgICAgICAgICAgIGRheXNJbk1vbnRoKG1vbS55ZWFyKCksIHZhbHVlKSk7XG4gICAgICAgIG1vbS5fZFsnc2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyAnTW9udGgnXSh2YWx1ZSwgZGF5T2ZNb250aCk7XG4gICAgICAgIHJldHVybiBtb207XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmF3R2V0dGVyKG1vbSwgdW5pdCkge1xuICAgICAgICByZXR1cm4gbW9tLl9kWydnZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArIHVuaXRdKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmF3U2V0dGVyKG1vbSwgdW5pdCwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHVuaXQgPT09ICdNb250aCcpIHtcbiAgICAgICAgICAgIHJldHVybiByYXdNb250aFNldHRlcihtb20sIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBtb20uX2RbJ3NldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgdW5pdF0odmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUFjY2Vzc29yKHVuaXQsIGtlZXBUaW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmF3U2V0dGVyKHRoaXMsIHVuaXQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBtb21lbnQudXBkYXRlT2Zmc2V0KHRoaXMsIGtlZXBUaW1lKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJhd0dldHRlcih0aGlzLCB1bml0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBtb21lbnQuZm4ubWlsbGlzZWNvbmQgPSBtb21lbnQuZm4ubWlsbGlzZWNvbmRzID0gbWFrZUFjY2Vzc29yKCdNaWxsaXNlY29uZHMnLCBmYWxzZSk7XG4gICAgbW9tZW50LmZuLnNlY29uZCA9IG1vbWVudC5mbi5zZWNvbmRzID0gbWFrZUFjY2Vzc29yKCdTZWNvbmRzJywgZmFsc2UpO1xuICAgIG1vbWVudC5mbi5taW51dGUgPSBtb21lbnQuZm4ubWludXRlcyA9IG1ha2VBY2Nlc3NvcignTWludXRlcycsIGZhbHNlKTtcbiAgICAvLyBTZXR0aW5nIHRoZSBob3VyIHNob3VsZCBrZWVwIHRoZSB0aW1lLCBiZWNhdXNlIHRoZSB1c2VyIGV4cGxpY2l0bHlcbiAgICAvLyBzcGVjaWZpZWQgd2hpY2ggaG91ciBoZSB3YW50cy4gU28gdHJ5aW5nIHRvIG1haW50YWluIHRoZSBzYW1lIGhvdXIgKGluXG4gICAgLy8gYSBuZXcgdGltZXpvbmUpIG1ha2VzIHNlbnNlLiBBZGRpbmcvc3VidHJhY3RpbmcgaG91cnMgZG9lcyBub3QgZm9sbG93XG4gICAgLy8gdGhpcyBydWxlLlxuICAgIG1vbWVudC5mbi5ob3VyID0gbW9tZW50LmZuLmhvdXJzID0gbWFrZUFjY2Vzc29yKCdIb3VycycsIHRydWUpO1xuICAgIC8vIG1vbWVudC5mbi5tb250aCBpcyBkZWZpbmVkIHNlcGFyYXRlbHlcbiAgICBtb21lbnQuZm4uZGF0ZSA9IG1ha2VBY2Nlc3NvcignRGF0ZScsIHRydWUpO1xuICAgIG1vbWVudC5mbi5kYXRlcyA9IGRlcHJlY2F0ZSgnZGF0ZXMgYWNjZXNzb3IgaXMgZGVwcmVjYXRlZC4gVXNlIGRhdGUgaW5zdGVhZC4nLCBtYWtlQWNjZXNzb3IoJ0RhdGUnLCB0cnVlKSk7XG4gICAgbW9tZW50LmZuLnllYXIgPSBtYWtlQWNjZXNzb3IoJ0Z1bGxZZWFyJywgdHJ1ZSk7XG4gICAgbW9tZW50LmZuLnllYXJzID0gZGVwcmVjYXRlKCd5ZWFycyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgeWVhciBpbnN0ZWFkLicsIG1ha2VBY2Nlc3NvcignRnVsbFllYXInLCB0cnVlKSk7XG5cbiAgICAvLyBhZGQgcGx1cmFsIG1ldGhvZHNcbiAgICBtb21lbnQuZm4uZGF5cyA9IG1vbWVudC5mbi5kYXk7XG4gICAgbW9tZW50LmZuLm1vbnRocyA9IG1vbWVudC5mbi5tb250aDtcbiAgICBtb21lbnQuZm4ud2Vla3MgPSBtb21lbnQuZm4ud2VlaztcbiAgICBtb21lbnQuZm4uaXNvV2Vla3MgPSBtb21lbnQuZm4uaXNvV2VlaztcbiAgICBtb21lbnQuZm4ucXVhcnRlcnMgPSBtb21lbnQuZm4ucXVhcnRlcjtcblxuICAgIC8vIGFkZCBhbGlhc2VkIGZvcm1hdCBtZXRob2RzXG4gICAgbW9tZW50LmZuLnRvSlNPTiA9IG1vbWVudC5mbi50b0lTT1N0cmluZztcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgRHVyYXRpb24gUHJvdG90eXBlXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICBmdW5jdGlvbiBkYXlzVG9ZZWFycyAoZGF5cykge1xuICAgICAgICAvLyA0MDAgeWVhcnMgaGF2ZSAxNDYwOTcgZGF5cyAodGFraW5nIGludG8gYWNjb3VudCBsZWFwIHllYXIgcnVsZXMpXG4gICAgICAgIHJldHVybiBkYXlzICogNDAwIC8gMTQ2MDk3O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHllYXJzVG9EYXlzICh5ZWFycykge1xuICAgICAgICAvLyB5ZWFycyAqIDM2NSArIGFic1JvdW5kKHllYXJzIC8gNCkgLVxuICAgICAgICAvLyAgICAgYWJzUm91bmQoeWVhcnMgLyAxMDApICsgYWJzUm91bmQoeWVhcnMgLyA0MDApO1xuICAgICAgICByZXR1cm4geWVhcnMgKiAxNDYwOTcgLyA0MDA7XG4gICAgfVxuXG4gICAgZXh0ZW5kKG1vbWVudC5kdXJhdGlvbi5mbiA9IER1cmF0aW9uLnByb3RvdHlwZSwge1xuXG4gICAgICAgIF9idWJibGUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbWlsbGlzZWNvbmRzID0gdGhpcy5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgICAgIGRheXMgPSB0aGlzLl9kYXlzLFxuICAgICAgICAgICAgICAgIG1vbnRocyA9IHRoaXMuX21vbnRocyxcbiAgICAgICAgICAgICAgICBkYXRhID0gdGhpcy5fZGF0YSxcbiAgICAgICAgICAgICAgICBzZWNvbmRzLCBtaW51dGVzLCBob3VycywgeWVhcnMgPSAwO1xuXG4gICAgICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGNvZGUgYnViYmxlcyB1cCB2YWx1ZXMsIHNlZSB0aGUgdGVzdHMgZm9yXG4gICAgICAgICAgICAvLyBleGFtcGxlcyBvZiB3aGF0IHRoYXQgbWVhbnMuXG4gICAgICAgICAgICBkYXRhLm1pbGxpc2Vjb25kcyA9IG1pbGxpc2Vjb25kcyAlIDEwMDA7XG5cbiAgICAgICAgICAgIHNlY29uZHMgPSBhYnNSb3VuZChtaWxsaXNlY29uZHMgLyAxMDAwKTtcbiAgICAgICAgICAgIGRhdGEuc2Vjb25kcyA9IHNlY29uZHMgJSA2MDtcblxuICAgICAgICAgICAgbWludXRlcyA9IGFic1JvdW5kKHNlY29uZHMgLyA2MCk7XG4gICAgICAgICAgICBkYXRhLm1pbnV0ZXMgPSBtaW51dGVzICUgNjA7XG5cbiAgICAgICAgICAgIGhvdXJzID0gYWJzUm91bmQobWludXRlcyAvIDYwKTtcbiAgICAgICAgICAgIGRhdGEuaG91cnMgPSBob3VycyAlIDI0O1xuXG4gICAgICAgICAgICBkYXlzICs9IGFic1JvdW5kKGhvdXJzIC8gMjQpO1xuXG4gICAgICAgICAgICAvLyBBY2N1cmF0ZWx5IGNvbnZlcnQgZGF5cyB0byB5ZWFycywgYXNzdW1lIHN0YXJ0IGZyb20geWVhciAwLlxuICAgICAgICAgICAgeWVhcnMgPSBhYnNSb3VuZChkYXlzVG9ZZWFycyhkYXlzKSk7XG4gICAgICAgICAgICBkYXlzIC09IGFic1JvdW5kKHllYXJzVG9EYXlzKHllYXJzKSk7XG5cbiAgICAgICAgICAgIC8vIDMwIGRheXMgdG8gYSBtb250aFxuICAgICAgICAgICAgLy8gVE9ETyAoaXNrcmVuKTogVXNlIGFuY2hvciBkYXRlIChsaWtlIDFzdCBKYW4pIHRvIGNvbXB1dGUgdGhpcy5cbiAgICAgICAgICAgIG1vbnRocyArPSBhYnNSb3VuZChkYXlzIC8gMzApO1xuICAgICAgICAgICAgZGF5cyAlPSAzMDtcblxuICAgICAgICAgICAgLy8gMTIgbW9udGhzIC0+IDEgeWVhclxuICAgICAgICAgICAgeWVhcnMgKz0gYWJzUm91bmQobW9udGhzIC8gMTIpO1xuICAgICAgICAgICAgbW9udGhzICU9IDEyO1xuXG4gICAgICAgICAgICBkYXRhLmRheXMgPSBkYXlzO1xuICAgICAgICAgICAgZGF0YS5tb250aHMgPSBtb250aHM7XG4gICAgICAgICAgICBkYXRhLnllYXJzID0geWVhcnM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWJzIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzID0gTWF0aC5hYnModGhpcy5fbWlsbGlzZWNvbmRzKTtcbiAgICAgICAgICAgIHRoaXMuX2RheXMgPSBNYXRoLmFicyh0aGlzLl9kYXlzKTtcbiAgICAgICAgICAgIHRoaXMuX21vbnRocyA9IE1hdGguYWJzKHRoaXMuX21vbnRocyk7XG5cbiAgICAgICAgICAgIHRoaXMuX2RhdGEubWlsbGlzZWNvbmRzID0gTWF0aC5hYnModGhpcy5fZGF0YS5taWxsaXNlY29uZHMpO1xuICAgICAgICAgICAgdGhpcy5fZGF0YS5zZWNvbmRzID0gTWF0aC5hYnModGhpcy5fZGF0YS5zZWNvbmRzKTtcbiAgICAgICAgICAgIHRoaXMuX2RhdGEubWludXRlcyA9IE1hdGguYWJzKHRoaXMuX2RhdGEubWludXRlcyk7XG4gICAgICAgICAgICB0aGlzLl9kYXRhLmhvdXJzID0gTWF0aC5hYnModGhpcy5fZGF0YS5ob3Vycyk7XG4gICAgICAgICAgICB0aGlzLl9kYXRhLm1vbnRocyA9IE1hdGguYWJzKHRoaXMuX2RhdGEubW9udGhzKTtcbiAgICAgICAgICAgIHRoaXMuX2RhdGEueWVhcnMgPSBNYXRoLmFicyh0aGlzLl9kYXRhLnllYXJzKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2Vla3MgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gYWJzUm91bmQodGhpcy5kYXlzKCkgLyA3KTtcbiAgICAgICAgfSxcblxuICAgICAgICB2YWx1ZU9mIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21pbGxpc2Vjb25kcyArXG4gICAgICAgICAgICAgIHRoaXMuX2RheXMgKiA4NjRlNSArXG4gICAgICAgICAgICAgICh0aGlzLl9tb250aHMgJSAxMikgKiAyNTkyZTYgK1xuICAgICAgICAgICAgICB0b0ludCh0aGlzLl9tb250aHMgLyAxMikgKiAzMTUzNmU2O1xuICAgICAgICB9LFxuXG4gICAgICAgIGh1bWFuaXplIDogZnVuY3Rpb24gKHdpdGhTdWZmaXgpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSByZWxhdGl2ZVRpbWUodGhpcywgIXdpdGhTdWZmaXgsIHRoaXMubG9jYWxlRGF0YSgpKTtcblxuICAgICAgICAgICAgaWYgKHdpdGhTdWZmaXgpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSB0aGlzLmxvY2FsZURhdGEoKS5wYXN0RnV0dXJlKCt0aGlzLCBvdXRwdXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkucG9zdGZvcm1hdChvdXRwdXQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZCA6IGZ1bmN0aW9uIChpbnB1dCwgdmFsKSB7XG4gICAgICAgICAgICAvLyBzdXBwb3J0cyBvbmx5IDIuMC1zdHlsZSBhZGQoMSwgJ3MnKSBvciBhZGQobW9tZW50KVxuICAgICAgICAgICAgdmFyIGR1ciA9IG1vbWVudC5kdXJhdGlvbihpbnB1dCwgdmFsKTtcblxuICAgICAgICAgICAgdGhpcy5fbWlsbGlzZWNvbmRzICs9IGR1ci5fbWlsbGlzZWNvbmRzO1xuICAgICAgICAgICAgdGhpcy5fZGF5cyArPSBkdXIuX2RheXM7XG4gICAgICAgICAgICB0aGlzLl9tb250aHMgKz0gZHVyLl9tb250aHM7XG5cbiAgICAgICAgICAgIHRoaXMuX2J1YmJsZSgpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBzdWJ0cmFjdCA6IGZ1bmN0aW9uIChpbnB1dCwgdmFsKSB7XG4gICAgICAgICAgICB2YXIgZHVyID0gbW9tZW50LmR1cmF0aW9uKGlucHV0LCB2YWwpO1xuXG4gICAgICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgLT0gZHVyLl9taWxsaXNlY29uZHM7XG4gICAgICAgICAgICB0aGlzLl9kYXlzIC09IGR1ci5fZGF5cztcbiAgICAgICAgICAgIHRoaXMuX21vbnRocyAtPSBkdXIuX21vbnRocztcblxuICAgICAgICAgICAgdGhpcy5fYnViYmxlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldCA6IGZ1bmN0aW9uICh1bml0cykge1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1t1bml0cy50b0xvd2VyQ2FzZSgpICsgJ3MnXSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFzIDogZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgICAgICAgICB2YXIgZGF5cywgbW9udGhzO1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG5cbiAgICAgICAgICAgIGlmICh1bml0cyA9PT0gJ21vbnRoJyB8fCB1bml0cyA9PT0gJ3llYXInKSB7XG4gICAgICAgICAgICAgICAgZGF5cyA9IHRoaXMuX2RheXMgKyB0aGlzLl9taWxsaXNlY29uZHMgLyA4NjRlNTtcbiAgICAgICAgICAgICAgICBtb250aHMgPSB0aGlzLl9tb250aHMgKyBkYXlzVG9ZZWFycyhkYXlzKSAqIDEyO1xuICAgICAgICAgICAgICAgIHJldHVybiB1bml0cyA9PT0gJ21vbnRoJyA/IG1vbnRocyA6IG1vbnRocyAvIDEyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBoYW5kbGUgbWlsbGlzZWNvbmRzIHNlcGFyYXRlbHkgYmVjYXVzZSBvZiBmbG9hdGluZyBwb2ludCBtYXRoIGVycm9ycyAoaXNzdWUgIzE4NjcpXG4gICAgICAgICAgICAgICAgZGF5cyA9IHRoaXMuX2RheXMgKyB5ZWFyc1RvRGF5cyh0aGlzLl9tb250aHMgLyAxMik7XG4gICAgICAgICAgICAgICAgc3dpdGNoICh1bml0cykge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICd3ZWVrJzogcmV0dXJuIGRheXMgLyA3ICsgdGhpcy5fbWlsbGlzZWNvbmRzIC8gNjA0OGU1O1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdkYXknOiByZXR1cm4gZGF5cyArIHRoaXMuX21pbGxpc2Vjb25kcyAvIDg2NGU1O1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdob3VyJzogcmV0dXJuIGRheXMgKiAyNCArIHRoaXMuX21pbGxpc2Vjb25kcyAvIDM2ZTU7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ21pbnV0ZSc6IHJldHVybiBkYXlzICogMjQgKiA2MCArIHRoaXMuX21pbGxpc2Vjb25kcyAvIDZlNDtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnc2Vjb25kJzogcmV0dXJuIGRheXMgKiAyNCAqIDYwICogNjAgKyB0aGlzLl9taWxsaXNlY29uZHMgLyAxMDAwO1xuICAgICAgICAgICAgICAgICAgICAvLyBNYXRoLmZsb29yIHByZXZlbnRzIGZsb2F0aW5nIHBvaW50IG1hdGggZXJyb3JzIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbWlsbGlzZWNvbmQnOiByZXR1cm4gTWF0aC5mbG9vcihkYXlzICogMjQgKiA2MCAqIDYwICogMTAwMCkgKyB0aGlzLl9taWxsaXNlY29uZHM7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcignVW5rbm93biB1bml0ICcgKyB1bml0cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGxhbmcgOiBtb21lbnQuZm4ubGFuZyxcbiAgICAgICAgbG9jYWxlIDogbW9tZW50LmZuLmxvY2FsZSxcblxuICAgICAgICB0b0lzb1N0cmluZyA6IGRlcHJlY2F0ZShcbiAgICAgICAgICAgICd0b0lzb1N0cmluZygpIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgdG9JU09TdHJpbmcoKSBpbnN0ZWFkICcgK1xuICAgICAgICAgICAgJyhub3RpY2UgdGhlIGNhcGl0YWxzKScsXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9JU09TdHJpbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKSxcblxuICAgICAgICB0b0lTT1N0cmluZyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIGluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9kb3JkaWxsZS9tb21lbnQtaXNvZHVyYXRpb24vYmxvYi9tYXN0ZXIvbW9tZW50Lmlzb2R1cmF0aW9uLmpzXG4gICAgICAgICAgICB2YXIgeWVhcnMgPSBNYXRoLmFicyh0aGlzLnllYXJzKCkpLFxuICAgICAgICAgICAgICAgIG1vbnRocyA9IE1hdGguYWJzKHRoaXMubW9udGhzKCkpLFxuICAgICAgICAgICAgICAgIGRheXMgPSBNYXRoLmFicyh0aGlzLmRheXMoKSksXG4gICAgICAgICAgICAgICAgaG91cnMgPSBNYXRoLmFicyh0aGlzLmhvdXJzKCkpLFxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSBNYXRoLmFicyh0aGlzLm1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgICAgc2Vjb25kcyA9IE1hdGguYWJzKHRoaXMuc2Vjb25kcygpICsgdGhpcy5taWxsaXNlY29uZHMoKSAvIDEwMDApO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuYXNTZWNvbmRzKCkpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIHRoZSBzYW1lIGFzIEMjJ3MgKE5vZGEpIGFuZCBweXRob24gKGlzb2RhdGUpLi4uXG4gICAgICAgICAgICAgICAgLy8gYnV0IG5vdCBvdGhlciBKUyAoZ29vZy5kYXRlKVxuICAgICAgICAgICAgICAgIHJldHVybiAnUDBEJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuICh0aGlzLmFzU2Vjb25kcygpIDwgMCA/ICctJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgJ1AnICtcbiAgICAgICAgICAgICAgICAoeWVhcnMgPyB5ZWFycyArICdZJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgKG1vbnRocyA/IG1vbnRocyArICdNJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgKGRheXMgPyBkYXlzICsgJ0QnIDogJycpICtcbiAgICAgICAgICAgICAgICAoKGhvdXJzIHx8IG1pbnV0ZXMgfHwgc2Vjb25kcykgPyAnVCcgOiAnJykgK1xuICAgICAgICAgICAgICAgIChob3VycyA/IGhvdXJzICsgJ0gnIDogJycpICtcbiAgICAgICAgICAgICAgICAobWludXRlcyA/IG1pbnV0ZXMgKyAnTScgOiAnJykgK1xuICAgICAgICAgICAgICAgIChzZWNvbmRzID8gc2Vjb25kcyArICdTJyA6ICcnKTtcbiAgICAgICAgfSxcblxuICAgICAgICBsb2NhbGVEYXRhIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgbW9tZW50LmR1cmF0aW9uLmZuLnRvU3RyaW5nID0gbW9tZW50LmR1cmF0aW9uLmZuLnRvSVNPU3RyaW5nO1xuXG4gICAgZnVuY3Rpb24gbWFrZUR1cmF0aW9uR2V0dGVyKG5hbWUpIHtcbiAgICAgICAgbW9tZW50LmR1cmF0aW9uLmZuW25hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFbbmFtZV07XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZm9yIChpIGluIHVuaXRNaWxsaXNlY29uZEZhY3RvcnMpIHtcbiAgICAgICAgaWYgKGhhc093blByb3AodW5pdE1pbGxpc2Vjb25kRmFjdG9ycywgaSkpIHtcbiAgICAgICAgICAgIG1ha2VEdXJhdGlvbkdldHRlcihpLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW9tZW50LmR1cmF0aW9uLmZuLmFzTWlsbGlzZWNvbmRzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hcygnbXMnKTtcbiAgICB9O1xuICAgIG1vbWVudC5kdXJhdGlvbi5mbi5hc1NlY29uZHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzKCdzJyk7XG4gICAgfTtcbiAgICBtb21lbnQuZHVyYXRpb24uZm4uYXNNaW51dGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hcygnbScpO1xuICAgIH07XG4gICAgbW9tZW50LmR1cmF0aW9uLmZuLmFzSG91cnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzKCdoJyk7XG4gICAgfTtcbiAgICBtb21lbnQuZHVyYXRpb24uZm4uYXNEYXlzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hcygnZCcpO1xuICAgIH07XG4gICAgbW9tZW50LmR1cmF0aW9uLmZuLmFzV2Vla3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzKCd3ZWVrcycpO1xuICAgIH07XG4gICAgbW9tZW50LmR1cmF0aW9uLmZuLmFzTW9udGhzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hcygnTScpO1xuICAgIH07XG4gICAgbW9tZW50LmR1cmF0aW9uLmZuLmFzWWVhcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzKCd5Jyk7XG4gICAgfTtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgRGVmYXVsdCBMb2NhbGVcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIC8vIFNldCBkZWZhdWx0IGxvY2FsZSwgb3RoZXIgbG9jYWxlIHdpbGwgaW5oZXJpdCBmcm9tIEVuZ2xpc2guXG4gICAgbW9tZW50LmxvY2FsZSgnZW4nLCB7XG4gICAgICAgIG9yZGluYWwgOiBmdW5jdGlvbiAobnVtYmVyKSB7XG4gICAgICAgICAgICB2YXIgYiA9IG51bWJlciAlIDEwLFxuICAgICAgICAgICAgICAgIG91dHB1dCA9ICh0b0ludChudW1iZXIgJSAxMDAgLyAxMCkgPT09IDEpID8gJ3RoJyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDEpID8gJ3N0JyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDIpID8gJ25kJyA6XG4gICAgICAgICAgICAgICAgKGIgPT09IDMpID8gJ3JkJyA6ICd0aCc7XG4gICAgICAgICAgICByZXR1cm4gbnVtYmVyICsgb3V0cHV0O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKiBFTUJFRF9MT0NBTEVTICovXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIEV4cG9zaW5nIE1vbWVudFxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIGZ1bmN0aW9uIG1ha2VHbG9iYWwoc2hvdWxkRGVwcmVjYXRlKSB7XG4gICAgICAgIC8qZ2xvYmFsIGVuZGVyOmZhbHNlICovXG4gICAgICAgIGlmICh0eXBlb2YgZW5kZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgb2xkR2xvYmFsTW9tZW50ID0gZ2xvYmFsU2NvcGUubW9tZW50O1xuICAgICAgICBpZiAoc2hvdWxkRGVwcmVjYXRlKSB7XG4gICAgICAgICAgICBnbG9iYWxTY29wZS5tb21lbnQgPSBkZXByZWNhdGUoXG4gICAgICAgICAgICAgICAgICAgICdBY2Nlc3NpbmcgTW9tZW50IHRocm91Z2ggdGhlIGdsb2JhbCBzY29wZSBpcyAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2RlcHJlY2F0ZWQsIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gYW4gdXBjb21pbmcgJyArXG4gICAgICAgICAgICAgICAgICAgICdyZWxlYXNlLicsXG4gICAgICAgICAgICAgICAgICAgIG1vbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnbG9iYWxTY29wZS5tb21lbnQgPSBtb21lbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDb21tb25KUyBtb2R1bGUgaXMgZGVmaW5lZFxuICAgIGlmIChoYXNNb2R1bGUpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBtb21lbnQ7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKCdtb21lbnQnLCBmdW5jdGlvbiAocmVxdWlyZSwgZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgICAgICAgICBpZiAobW9kdWxlLmNvbmZpZyAmJiBtb2R1bGUuY29uZmlnKCkgJiYgbW9kdWxlLmNvbmZpZygpLm5vR2xvYmFsID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgLy8gcmVsZWFzZSB0aGUgZ2xvYmFsIHZhcmlhYmxlXG4gICAgICAgICAgICAgICAgZ2xvYmFsU2NvcGUubW9tZW50ID0gb2xkR2xvYmFsTW9tZW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbW9tZW50O1xuICAgICAgICB9KTtcbiAgICAgICAgbWFrZUdsb2JhbCh0cnVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBtYWtlR2xvYmFsKCk7XG4gICAgfVxufSkuY2FsbCh0aGlzKTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiLy8gICAgIFVuZGVyc2NvcmUuanMgMS43LjBcbi8vICAgICBodHRwOi8vdW5kZXJzY29yZWpzLm9yZ1xuLy8gICAgIChjKSAyMDA5LTIwMTQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbi8vICAgICBVbmRlcnNjb3JlIG1heSBiZSBmcmVlbHkgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuXG4oZnVuY3Rpb24oKSB7XG5cbiAgLy8gQmFzZWxpbmUgc2V0dXBcbiAgLy8gLS0tLS0tLS0tLS0tLS1cblxuICAvLyBFc3RhYmxpc2ggdGhlIHJvb3Qgb2JqZWN0LCBgd2luZG93YCBpbiB0aGUgYnJvd3Nlciwgb3IgYGV4cG9ydHNgIG9uIHRoZSBzZXJ2ZXIuXG4gIHZhciByb290ID0gdGhpcztcblxuICAvLyBTYXZlIHRoZSBwcmV2aW91cyB2YWx1ZSBvZiB0aGUgYF9gIHZhcmlhYmxlLlxuICB2YXIgcHJldmlvdXNVbmRlcnNjb3JlID0gcm9vdC5fO1xuXG4gIC8vIFNhdmUgYnl0ZXMgaW4gdGhlIG1pbmlmaWVkIChidXQgbm90IGd6aXBwZWQpIHZlcnNpb246XG4gIHZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlLCBPYmpQcm90byA9IE9iamVjdC5wcm90b3R5cGUsIEZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuICAvLyBDcmVhdGUgcXVpY2sgcmVmZXJlbmNlIHZhcmlhYmxlcyBmb3Igc3BlZWQgYWNjZXNzIHRvIGNvcmUgcHJvdG90eXBlcy5cbiAgdmFyXG4gICAgcHVzaCAgICAgICAgICAgICA9IEFycmF5UHJvdG8ucHVzaCxcbiAgICBzbGljZSAgICAgICAgICAgID0gQXJyYXlQcm90by5zbGljZSxcbiAgICBjb25jYXQgICAgICAgICAgID0gQXJyYXlQcm90by5jb25jYXQsXG4gICAgdG9TdHJpbmcgICAgICAgICA9IE9ialByb3RvLnRvU3RyaW5nLFxuICAgIGhhc093blByb3BlcnR5ICAgPSBPYmpQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuICAvLyBBbGwgKipFQ01BU2NyaXB0IDUqKiBuYXRpdmUgZnVuY3Rpb24gaW1wbGVtZW50YXRpb25zIHRoYXQgd2UgaG9wZSB0byB1c2VcbiAgLy8gYXJlIGRlY2xhcmVkIGhlcmUuXG4gIHZhclxuICAgIG5hdGl2ZUlzQXJyYXkgICAgICA9IEFycmF5LmlzQXJyYXksXG4gICAgbmF0aXZlS2V5cyAgICAgICAgID0gT2JqZWN0LmtleXMsXG4gICAgbmF0aXZlQmluZCAgICAgICAgID0gRnVuY1Byb3RvLmJpbmQ7XG5cbiAgLy8gQ3JlYXRlIGEgc2FmZSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciB1c2UgYmVsb3cuXG4gIHZhciBfID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIF8pIHJldHVybiBvYmo7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIF8pKSByZXR1cm4gbmV3IF8ob2JqKTtcbiAgICB0aGlzLl93cmFwcGVkID0gb2JqO1xuICB9O1xuXG4gIC8vIEV4cG9ydCB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yICoqTm9kZS5qcyoqLCB3aXRoXG4gIC8vIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5IGZvciB0aGUgb2xkIGByZXF1aXJlKClgIEFQSS4gSWYgd2UncmUgaW5cbiAgLy8gdGhlIGJyb3dzZXIsIGFkZCBgX2AgYXMgYSBnbG9iYWwgb2JqZWN0LlxuICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgICBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBfO1xuICAgIH1cbiAgICBleHBvcnRzLl8gPSBfO1xuICB9IGVsc2Uge1xuICAgIHJvb3QuXyA9IF87XG4gIH1cblxuICAvLyBDdXJyZW50IHZlcnNpb24uXG4gIF8uVkVSU0lPTiA9ICcxLjcuMCc7XG5cbiAgLy8gSW50ZXJuYWwgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVmZmljaWVudCAoZm9yIGN1cnJlbnQgZW5naW5lcykgdmVyc2lvblxuICAvLyBvZiB0aGUgcGFzc2VkLWluIGNhbGxiYWNrLCB0byBiZSByZXBlYXRlZGx5IGFwcGxpZWQgaW4gb3RoZXIgVW5kZXJzY29yZVxuICAvLyBmdW5jdGlvbnMuXG4gIHZhciBjcmVhdGVDYWxsYmFjayA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQsIGFyZ0NvdW50KSB7XG4gICAgaWYgKGNvbnRleHQgPT09IHZvaWQgMCkgcmV0dXJuIGZ1bmM7XG4gICAgc3dpdGNoIChhcmdDb3VudCA9PSBudWxsID8gMyA6IGFyZ0NvdW50KSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgb3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSwgb3RoZXIpO1xuICAgICAgfTtcbiAgICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9O1xuICAgICAgY2FzZSA0OiByZXR1cm4gZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEEgbW9zdGx5LWludGVybmFsIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGNhbGxiYWNrcyB0aGF0IGNhbiBiZSBhcHBsaWVkXG4gIC8vIHRvIGVhY2ggZWxlbWVudCBpbiBhIGNvbGxlY3Rpb24sIHJldHVybmluZyB0aGUgZGVzaXJlZCByZXN1bHQg4oCUIGVpdGhlclxuICAvLyBpZGVudGl0eSwgYW4gYXJiaXRyYXJ5IGNhbGxiYWNrLCBhIHByb3BlcnR5IG1hdGNoZXIsIG9yIGEgcHJvcGVydHkgYWNjZXNzb3IuXG4gIF8uaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgYXJnQ291bnQpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIF8uaWRlbnRpdHk7XG4gICAgaWYgKF8uaXNGdW5jdGlvbih2YWx1ZSkpIHJldHVybiBjcmVhdGVDYWxsYmFjayh2YWx1ZSwgY29udGV4dCwgYXJnQ291bnQpO1xuICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSkgcmV0dXJuIF8ubWF0Y2hlcyh2YWx1ZSk7XG4gICAgcmV0dXJuIF8ucHJvcGVydHkodmFsdWUpO1xuICB9O1xuXG4gIC8vIENvbGxlY3Rpb24gRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gVGhlIGNvcm5lcnN0b25lLCBhbiBgZWFjaGAgaW1wbGVtZW50YXRpb24sIGFrYSBgZm9yRWFjaGAuXG4gIC8vIEhhbmRsZXMgcmF3IG9iamVjdHMgaW4gYWRkaXRpb24gdG8gYXJyYXktbGlrZXMuIFRyZWF0cyBhbGxcbiAgLy8gc3BhcnNlIGFycmF5LWxpa2VzIGFzIGlmIHRoZXkgd2VyZSBkZW5zZS5cbiAgXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIG9iajtcbiAgICBpdGVyYXRlZSA9IGNyZWF0ZUNhbGxiYWNrKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIgaSwgbGVuZ3RoID0gb2JqLmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoID09PSArbGVuZ3RoKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlcmF0ZWUob2JqW2ldLCBpLCBvYmopO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVyYXRlZShvYmpba2V5c1tpXV0sIGtleXNbaV0sIG9iaik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRlZSB0byBlYWNoIGVsZW1lbnQuXG4gIF8ubWFwID0gXy5jb2xsZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIFtdO1xuICAgIGl0ZXJhdGVlID0gXy5pdGVyYXRlZShpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSBvYmoubGVuZ3RoICE9PSArb2JqLmxlbmd0aCAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICAgIHJlc3VsdHMgPSBBcnJheShsZW5ndGgpLFxuICAgICAgICBjdXJyZW50S2V5O1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIHJlc3VsdHNbaW5kZXhdID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICB2YXIgcmVkdWNlRXJyb3IgPSAnUmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZSc7XG5cbiAgLy8gKipSZWR1Y2UqKiBidWlsZHMgdXAgYSBzaW5nbGUgcmVzdWx0IGZyb20gYSBsaXN0IG9mIHZhbHVlcywgYWthIGBpbmplY3RgLFxuICAvLyBvciBgZm9sZGxgLlxuICBfLnJlZHVjZSA9IF8uZm9sZGwgPSBfLmluamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGNvbnRleHQpIHtcbiAgICBpZiAob2JqID09IG51bGwpIG9iaiA9IFtdO1xuICAgIGl0ZXJhdGVlID0gY3JlYXRlQ2FsbGJhY2soaXRlcmF0ZWUsIGNvbnRleHQsIDQpO1xuICAgIHZhciBrZXlzID0gb2JqLmxlbmd0aCAhPT0gK29iai5sZW5ndGggJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IDAsIGN1cnJlbnRLZXk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgICBpZiAoIWxlbmd0aCkgdGhyb3cgbmV3IFR5cGVFcnJvcihyZWR1Y2VFcnJvcik7XG4gICAgICBtZW1vID0gb2JqW2tleXMgPyBrZXlzW2luZGV4KytdIDogaW5kZXgrK107XG4gICAgfVxuICAgIGZvciAoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgbWVtbyA9IGl0ZXJhdGVlKG1lbW8sIG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG5cbiAgLy8gVGhlIHJpZ2h0LWFzc29jaWF0aXZlIHZlcnNpb24gb2YgcmVkdWNlLCBhbHNvIGtub3duIGFzIGBmb2xkcmAuXG4gIF8ucmVkdWNlUmlnaHQgPSBfLmZvbGRyID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgbWVtbywgY29udGV4dCkge1xuICAgIGlmIChvYmogPT0gbnVsbCkgb2JqID0gW107XG4gICAgaXRlcmF0ZWUgPSBjcmVhdGVDYWxsYmFjayhpdGVyYXRlZSwgY29udGV4dCwgNCk7XG4gICAgdmFyIGtleXMgPSBvYmoubGVuZ3RoICE9PSArIG9iai5sZW5ndGggJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGluZGV4ID0gKGtleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICAgIGN1cnJlbnRLZXk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgICBpZiAoIWluZGV4KSB0aHJvdyBuZXcgVHlwZUVycm9yKHJlZHVjZUVycm9yKTtcbiAgICAgIG1lbW8gPSBvYmpba2V5cyA/IGtleXNbLS1pbmRleF0gOiAtLWluZGV4XTtcbiAgICB9XG4gICAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICAgIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIG1lbW8gPSBpdGVyYXRlZShtZW1vLCBvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgfVxuICAgIHJldHVybiBtZW1vO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgZmlyc3QgdmFsdWUgd2hpY2ggcGFzc2VzIGEgdHJ1dGggdGVzdC4gQWxpYXNlZCBhcyBgZGV0ZWN0YC5cbiAgXy5maW5kID0gXy5kZXRlY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQ7XG4gICAgcHJlZGljYXRlID0gXy5pdGVyYXRlZShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIF8uc29tZShvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGxpc3QpKSB7XG4gICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIHRoYXQgcGFzcyBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYHNlbGVjdGAuXG4gIF8uZmlsdGVyID0gXy5zZWxlY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0cztcbiAgICBwcmVkaWNhdGUgPSBfLml0ZXJhdGVlKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgbGlzdCkpIHJlc3VsdHMucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgZm9yIHdoaWNoIGEgdHJ1dGggdGVzdCBmYWlscy5cbiAgXy5yZWplY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIF8ubmVnYXRlKF8uaXRlcmF0ZWUocHJlZGljYXRlKSksIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIERldGVybWluZSB3aGV0aGVyIGFsbCBvZiB0aGUgZWxlbWVudHMgbWF0Y2ggYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBhbGxgLlxuICBfLmV2ZXJ5ID0gXy5hbGwgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgcHJlZGljYXRlID0gXy5pdGVyYXRlZShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gb2JqLmxlbmd0aCAhPT0gK29iai5sZW5ndGggJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoLFxuICAgICAgICBpbmRleCwgY3VycmVudEtleTtcbiAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIGlmICghcHJlZGljYXRlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgYXQgbGVhc3Qgb25lIGVsZW1lbnQgaW4gdGhlIG9iamVjdCBtYXRjaGVzIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgYW55YC5cbiAgXy5zb21lID0gXy5hbnkgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgIHByZWRpY2F0ZSA9IF8uaXRlcmF0ZWUocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9IG9iai5sZW5ndGggIT09ICtvYmoubGVuZ3RoICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgaW5kZXgsIGN1cnJlbnRLZXk7XG4gICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICBpZiAocHJlZGljYXRlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKSkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgdGhlIGFycmF5IG9yIG9iamVjdCBjb250YWlucyBhIGdpdmVuIHZhbHVlICh1c2luZyBgPT09YCkuXG4gIC8vIEFsaWFzZWQgYXMgYGluY2x1ZGVgLlxuICBfLmNvbnRhaW5zID0gXy5pbmNsdWRlID0gZnVuY3Rpb24ob2JqLCB0YXJnZXQpIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICBpZiAob2JqLmxlbmd0aCAhPT0gK29iai5sZW5ndGgpIG9iaiA9IF8udmFsdWVzKG9iaik7XG4gICAgcmV0dXJuIF8uaW5kZXhPZihvYmosIHRhcmdldCkgPj0gMDtcbiAgfTtcblxuICAvLyBJbnZva2UgYSBtZXRob2QgKHdpdGggYXJndW1lbnRzKSBvbiBldmVyeSBpdGVtIGluIGEgY29sbGVjdGlvbi5cbiAgXy5pbnZva2UgPSBmdW5jdGlvbihvYmosIG1ldGhvZCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpc0Z1bmMgPSBfLmlzRnVuY3Rpb24obWV0aG9kKTtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIChpc0Z1bmMgPyBtZXRob2QgOiB2YWx1ZVttZXRob2RdKS5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgbWFwYDogZmV0Y2hpbmcgYSBwcm9wZXJ0eS5cbiAgXy5wbHVjayA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIF8ubWFwKG9iaiwgXy5wcm9wZXJ0eShrZXkpKTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaWx0ZXJgOiBzZWxlY3Rpbmcgb25seSBvYmplY3RzXG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ud2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgXy5tYXRjaGVzKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmluZGA6IGdldHRpbmcgdGhlIGZpcnN0IG9iamVjdFxuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmZpbmRXaGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy5maW5kKG9iaiwgXy5tYXRjaGVzKGF0dHJzKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1heCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0gLUluZmluaXR5LCBsYXN0Q29tcHV0ZWQgPSAtSW5maW5pdHksXG4gICAgICAgIHZhbHVlLCBjb21wdXRlZDtcbiAgICBpZiAoaXRlcmF0ZWUgPT0gbnVsbCAmJiBvYmogIT0gbnVsbCkge1xuICAgICAgb2JqID0gb2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGggPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YWx1ZSA9IG9ialtpXTtcbiAgICAgICAgaWYgKHZhbHVlID4gcmVzdWx0KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXRlcmF0ZWUgPSBfLml0ZXJhdGVlKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICAgIGlmIChjb21wdXRlZCA+IGxhc3RDb21wdXRlZCB8fCBjb21wdXRlZCA9PT0gLUluZmluaXR5ICYmIHJlc3VsdCA9PT0gLUluZmluaXR5KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgbGFzdENvbXB1dGVkID0gY29tcHV0ZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWluaW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5taW4gPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IEluZmluaXR5LCBsYXN0Q29tcHV0ZWQgPSBJbmZpbml0eSxcbiAgICAgICAgdmFsdWUsIGNvbXB1dGVkO1xuICAgIGlmIChpdGVyYXRlZSA9PSBudWxsICYmIG9iaiAhPSBudWxsKSB7XG4gICAgICBvYmogPSBvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW2ldO1xuICAgICAgICBpZiAodmFsdWUgPCByZXN1bHQpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRlZSA9IF8uaXRlcmF0ZWUoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgICAgaWYgKGNvbXB1dGVkIDwgbGFzdENvbXB1dGVkIHx8IGNvbXB1dGVkID09PSBJbmZpbml0eSAmJiByZXN1bHQgPT09IEluZmluaXR5KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgbGFzdENvbXB1dGVkID0gY29tcHV0ZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFNodWZmbGUgYSBjb2xsZWN0aW9uLCB1c2luZyB0aGUgbW9kZXJuIHZlcnNpb24gb2YgdGhlXG4gIC8vIFtGaXNoZXItWWF0ZXMgc2h1ZmZsZV0oaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9GaXNoZXLigJNZYXRlc19zaHVmZmxlKS5cbiAgXy5zaHVmZmxlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHNldCA9IG9iaiAmJiBvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IHNldC5sZW5ndGg7XG4gICAgdmFyIHNodWZmbGVkID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDAsIHJhbmQ7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICByYW5kID0gXy5yYW5kb20oMCwgaW5kZXgpO1xuICAgICAgaWYgKHJhbmQgIT09IGluZGV4KSBzaHVmZmxlZFtpbmRleF0gPSBzaHVmZmxlZFtyYW5kXTtcbiAgICAgIHNodWZmbGVkW3JhbmRdID0gc2V0W2luZGV4XTtcbiAgICB9XG4gICAgcmV0dXJuIHNodWZmbGVkO1xuICB9O1xuXG4gIC8vIFNhbXBsZSAqKm4qKiByYW5kb20gdmFsdWVzIGZyb20gYSBjb2xsZWN0aW9uLlxuICAvLyBJZiAqKm4qKiBpcyBub3Qgc3BlY2lmaWVkLCByZXR1cm5zIGEgc2luZ2xlIHJhbmRvbSBlbGVtZW50LlxuICAvLyBUaGUgaW50ZXJuYWwgYGd1YXJkYCBhcmd1bWVudCBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBtYXBgLlxuICBfLnNhbXBsZSA9IGZ1bmN0aW9uKG9iaiwgbiwgZ3VhcmQpIHtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSB7XG4gICAgICBpZiAob2JqLmxlbmd0aCAhPT0gK29iai5sZW5ndGgpIG9iaiA9IF8udmFsdWVzKG9iaik7XG4gICAgICByZXR1cm4gb2JqW18ucmFuZG9tKG9iai5sZW5ndGggLSAxKV07XG4gICAgfVxuICAgIHJldHVybiBfLnNodWZmbGUob2JqKS5zbGljZSgwLCBNYXRoLm1heCgwLCBuKSk7XG4gIH07XG5cbiAgLy8gU29ydCB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uIHByb2R1Y2VkIGJ5IGFuIGl0ZXJhdGVlLlxuICBfLnNvcnRCeSA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IF8uaXRlcmF0ZWUoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHJldHVybiBfLnBsdWNrKF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgY3JpdGVyaWE6IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdClcbiAgICAgIH07XG4gICAgfSkuc29ydChmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICAgICAgdmFyIGEgPSBsZWZ0LmNyaXRlcmlhO1xuICAgICAgdmFyIGIgPSByaWdodC5jcml0ZXJpYTtcbiAgICAgIGlmIChhICE9PSBiKSB7XG4gICAgICAgIGlmIChhID4gYiB8fCBhID09PSB2b2lkIDApIHJldHVybiAxO1xuICAgICAgICBpZiAoYSA8IGIgfHwgYiA9PT0gdm9pZCAwKSByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGVmdC5pbmRleCAtIHJpZ2h0LmluZGV4O1xuICAgIH0pLCAndmFsdWUnKTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB1c2VkIGZvciBhZ2dyZWdhdGUgXCJncm91cCBieVwiIG9wZXJhdGlvbnMuXG4gIHZhciBncm91cCA9IGZ1bmN0aW9uKGJlaGF2aW9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIGl0ZXJhdGVlID0gXy5pdGVyYXRlZShpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgdmFyIGtleSA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgb2JqKTtcbiAgICAgICAgYmVoYXZpb3IocmVzdWx0LCB2YWx1ZSwga2V5KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEdyb3VwcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLiBQYXNzIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGVcbiAgLy8gdG8gZ3JvdXAgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjcml0ZXJpb24uXG4gIF8uZ3JvdXBCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIGlmIChfLmhhcyhyZXN1bHQsIGtleSkpIHJlc3VsdFtrZXldLnB1c2godmFsdWUpOyBlbHNlIHJlc3VsdFtrZXldID0gW3ZhbHVlXTtcbiAgfSk7XG5cbiAgLy8gSW5kZXhlcyB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uLCBzaW1pbGFyIHRvIGBncm91cEJ5YCwgYnV0IGZvclxuICAvLyB3aGVuIHlvdSBrbm93IHRoYXQgeW91ciBpbmRleCB2YWx1ZXMgd2lsbCBiZSB1bmlxdWUuXG4gIF8uaW5kZXhCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gIH0pO1xuXG4gIC8vIENvdW50cyBpbnN0YW5jZXMgb2YgYW4gb2JqZWN0IHRoYXQgZ3JvdXAgYnkgYSBjZXJ0YWluIGNyaXRlcmlvbi4gUGFzc1xuICAvLyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlIHRvIGNvdW50IGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGVcbiAgLy8gY3JpdGVyaW9uLlxuICBfLmNvdW50QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICBpZiAoXy5oYXMocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XSsrOyBlbHNlIHJlc3VsdFtrZXldID0gMTtcbiAgfSk7XG5cbiAgLy8gVXNlIGEgY29tcGFyYXRvciBmdW5jdGlvbiB0byBmaWd1cmUgb3V0IHRoZSBzbWFsbGVzdCBpbmRleCBhdCB3aGljaFxuICAvLyBhbiBvYmplY3Qgc2hvdWxkIGJlIGluc2VydGVkIHNvIGFzIHRvIG1haW50YWluIG9yZGVyLiBVc2VzIGJpbmFyeSBzZWFyY2guXG4gIF8uc29ydGVkSW5kZXggPSBmdW5jdGlvbihhcnJheSwgb2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gXy5pdGVyYXRlZShpdGVyYXRlZSwgY29udGV4dCwgMSk7XG4gICAgdmFyIHZhbHVlID0gaXRlcmF0ZWUob2JqKTtcbiAgICB2YXIgbG93ID0gMCwgaGlnaCA9IGFycmF5Lmxlbmd0aDtcbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgdmFyIG1pZCA9IGxvdyArIGhpZ2ggPj4+IDE7XG4gICAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbbWlkXSkgPCB2YWx1ZSkgbG93ID0gbWlkICsgMTsgZWxzZSBoaWdoID0gbWlkO1xuICAgIH1cbiAgICByZXR1cm4gbG93O1xuICB9O1xuXG4gIC8vIFNhZmVseSBjcmVhdGUgYSByZWFsLCBsaXZlIGFycmF5IGZyb20gYW55dGhpbmcgaXRlcmFibGUuXG4gIF8udG9BcnJheSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghb2JqKSByZXR1cm4gW107XG4gICAgaWYgKF8uaXNBcnJheShvYmopKSByZXR1cm4gc2xpY2UuY2FsbChvYmopO1xuICAgIGlmIChvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCkgcmV0dXJuIF8ubWFwKG9iaiwgXy5pZGVudGl0eSk7XG4gICAgcmV0dXJuIF8udmFsdWVzKG9iaik7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gYW4gb2JqZWN0LlxuICBfLnNpemUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiAwO1xuICAgIHJldHVybiBvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCA/IG9iai5sZW5ndGggOiBfLmtleXMob2JqKS5sZW5ndGg7XG4gIH07XG5cbiAgLy8gU3BsaXQgYSBjb2xsZWN0aW9uIGludG8gdHdvIGFycmF5czogb25lIHdob3NlIGVsZW1lbnRzIGFsbCBzYXRpc2Z5IHRoZSBnaXZlblxuICAvLyBwcmVkaWNhdGUsIGFuZCBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIGRvIG5vdCBzYXRpc2Z5IHRoZSBwcmVkaWNhdGUuXG4gIF8ucGFydGl0aW9uID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBfLml0ZXJhdGVlKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIHBhc3MgPSBbXSwgZmFpbCA9IFtdO1xuICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iaikge1xuICAgICAgKHByZWRpY2F0ZSh2YWx1ZSwga2V5LCBvYmopID8gcGFzcyA6IGZhaWwpLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiBbcGFzcywgZmFpbF07XG4gIH07XG5cbiAgLy8gQXJyYXkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgZmlyc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBBbGlhc2VkIGFzIGBoZWFkYCBhbmQgYHRha2VgLiBUaGUgKipndWFyZCoqIGNoZWNrXG4gIC8vIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5maXJzdCA9IF8uaGVhZCA9IF8udGFrZSA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHJldHVybiBhcnJheVswXTtcbiAgICBpZiAobiA8IDApIHJldHVybiBbXTtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgbik7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgbGFzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEVzcGVjaWFsbHkgdXNlZnVsIG9uXG4gIC8vIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIGFsbCB0aGUgdmFsdWVzIGluXG4gIC8vIHRoZSBhcnJheSwgZXhjbHVkaW5nIHRoZSBsYXN0IE4uIFRoZSAqKmd1YXJkKiogY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aFxuICAvLyBgXy5tYXBgLlxuICBfLmluaXRpYWwgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgTWF0aC5tYXgoMCwgYXJyYXkubGVuZ3RoIC0gKG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKSkpO1xuICB9O1xuXG4gIC8vIEdldCB0aGUgbGFzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBsYXN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS4gVGhlICoqZ3VhcmQqKiBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBfLm1hcGAuXG4gIF8ubGFzdCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgTWF0aC5tYXgoYXJyYXkubGVuZ3RoIC0gbiwgMCkpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGZpcnN0IGVudHJ5IG9mIHRoZSBhcnJheS4gQWxpYXNlZCBhcyBgdGFpbGAgYW5kIGBkcm9wYC5cbiAgLy8gRXNwZWNpYWxseSB1c2VmdWwgb24gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgYW4gKipuKiogd2lsbCByZXR1cm5cbiAgLy8gdGhlIHJlc3QgTiB2YWx1ZXMgaW4gdGhlIGFycmF5LiBUaGUgKipndWFyZCoqXG4gIC8vIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5yZXN0ID0gXy50YWlsID0gXy5kcm9wID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKTtcbiAgfTtcblxuICAvLyBUcmltIG91dCBhbGwgZmFsc3kgdmFsdWVzIGZyb20gYW4gYXJyYXkuXG4gIF8uY29tcGFjdCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBfLmlkZW50aXR5KTtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiBhIHJlY3Vyc2l2ZSBgZmxhdHRlbmAgZnVuY3Rpb24uXG4gIHZhciBmbGF0dGVuID0gZnVuY3Rpb24oaW5wdXQsIHNoYWxsb3csIHN0cmljdCwgb3V0cHV0KSB7XG4gICAgaWYgKHNoYWxsb3cgJiYgXy5ldmVyeShpbnB1dCwgXy5pc0FycmF5KSkge1xuICAgICAgcmV0dXJuIGNvbmNhdC5hcHBseShvdXRwdXQsIGlucHV0KTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGlucHV0Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBpbnB1dFtpXTtcbiAgICAgIGlmICghXy5pc0FycmF5KHZhbHVlKSAmJiAhXy5pc0FyZ3VtZW50cyh2YWx1ZSkpIHtcbiAgICAgICAgaWYgKCFzdHJpY3QpIG91dHB1dC5wdXNoKHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAoc2hhbGxvdykge1xuICAgICAgICBwdXNoLmFwcGx5KG91dHB1dCwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmxhdHRlbih2YWx1ZSwgc2hhbGxvdywgc3RyaWN0LCBvdXRwdXQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIC8vIEZsYXR0ZW4gb3V0IGFuIGFycmF5LCBlaXRoZXIgcmVjdXJzaXZlbHkgKGJ5IGRlZmF1bHQpLCBvciBqdXN0IG9uZSBsZXZlbC5cbiAgXy5mbGF0dGVuID0gZnVuY3Rpb24oYXJyYXksIHNoYWxsb3cpIHtcbiAgICByZXR1cm4gZmxhdHRlbihhcnJheSwgc2hhbGxvdywgZmFsc2UsIFtdKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSB2ZXJzaW9uIG9mIHRoZSBhcnJheSB0aGF0IGRvZXMgbm90IGNvbnRhaW4gdGhlIHNwZWNpZmllZCB2YWx1ZShzKS5cbiAgXy53aXRob3V0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5kaWZmZXJlbmNlKGFycmF5LCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYSBkdXBsaWNhdGUtZnJlZSB2ZXJzaW9uIG9mIHRoZSBhcnJheS4gSWYgdGhlIGFycmF5IGhhcyBhbHJlYWR5XG4gIC8vIGJlZW4gc29ydGVkLCB5b3UgaGF2ZSB0aGUgb3B0aW9uIG9mIHVzaW5nIGEgZmFzdGVyIGFsZ29yaXRobS5cbiAgLy8gQWxpYXNlZCBhcyBgdW5pcXVlYC5cbiAgXy51bmlxID0gXy51bmlxdWUgPSBmdW5jdGlvbihhcnJheSwgaXNTb3J0ZWQsIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiBbXTtcbiAgICBpZiAoIV8uaXNCb29sZWFuKGlzU29ydGVkKSkge1xuICAgICAgY29udGV4dCA9IGl0ZXJhdGVlO1xuICAgICAgaXRlcmF0ZWUgPSBpc1NvcnRlZDtcbiAgICAgIGlzU29ydGVkID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChpdGVyYXRlZSAhPSBudWxsKSBpdGVyYXRlZSA9IF8uaXRlcmF0ZWUoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgc2VlbiA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaV07XG4gICAgICBpZiAoaXNTb3J0ZWQpIHtcbiAgICAgICAgaWYgKCFpIHx8IHNlZW4gIT09IHZhbHVlKSByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIHNlZW4gPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSBpZiAoaXRlcmF0ZWUpIHtcbiAgICAgICAgdmFyIGNvbXB1dGVkID0gaXRlcmF0ZWUodmFsdWUsIGksIGFycmF5KTtcbiAgICAgICAgaWYgKF8uaW5kZXhPZihzZWVuLCBjb21wdXRlZCkgPCAwKSB7XG4gICAgICAgICAgc2Vlbi5wdXNoKGNvbXB1dGVkKTtcbiAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoXy5pbmRleE9mKHJlc3VsdCwgdmFsdWUpIDwgMCkge1xuICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSB1bmlvbjogZWFjaCBkaXN0aW5jdCBlbGVtZW50IGZyb20gYWxsIG9mXG4gIC8vIHRoZSBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLnVuaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW5pcShmbGF0dGVuKGFyZ3VtZW50cywgdHJ1ZSwgdHJ1ZSwgW10pKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgZXZlcnkgaXRlbSBzaGFyZWQgYmV0d2VlbiBhbGwgdGhlXG4gIC8vIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8uaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIFtdO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgYXJnc0xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IGFycmF5W2ldO1xuICAgICAgaWYgKF8uY29udGFpbnMocmVzdWx0LCBpdGVtKSkgY29udGludWU7XG4gICAgICBmb3IgKHZhciBqID0gMTsgaiA8IGFyZ3NMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAoIV8uY29udGFpbnMoYXJndW1lbnRzW2pdLCBpdGVtKSkgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoaiA9PT0gYXJnc0xlbmd0aCkgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gVGFrZSB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIG9uZSBhcnJheSBhbmQgYSBudW1iZXIgb2Ygb3RoZXIgYXJyYXlzLlxuICAvLyBPbmx5IHRoZSBlbGVtZW50cyBwcmVzZW50IGluIGp1c3QgdGhlIGZpcnN0IGFycmF5IHdpbGwgcmVtYWluLlxuICBfLmRpZmZlcmVuY2UgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN0ID0gZmxhdHRlbihzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIHRydWUsIHRydWUsIFtdKTtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIHJldHVybiAhXy5jb250YWlucyhyZXN0LCB2YWx1ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gWmlwIHRvZ2V0aGVyIG11bHRpcGxlIGxpc3RzIGludG8gYSBzaW5nbGUgYXJyYXkgLS0gZWxlbWVudHMgdGhhdCBzaGFyZVxuICAvLyBhbiBpbmRleCBnbyB0b2dldGhlci5cbiAgXy56aXAgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gW107XG4gICAgdmFyIGxlbmd0aCA9IF8ubWF4KGFyZ3VtZW50cywgJ2xlbmd0aCcpLmxlbmd0aDtcbiAgICB2YXIgcmVzdWx0cyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0c1tpXSA9IF8ucGx1Y2soYXJndW1lbnRzLCBpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ29udmVydHMgbGlzdHMgaW50byBvYmplY3RzLiBQYXNzIGVpdGhlciBhIHNpbmdsZSBhcnJheSBvZiBgW2tleSwgdmFsdWVdYFxuICAvLyBwYWlycywgb3IgdHdvIHBhcmFsbGVsIGFycmF5cyBvZiB0aGUgc2FtZSBsZW5ndGggLS0gb25lIG9mIGtleXMsIGFuZCBvbmUgb2ZcbiAgLy8gdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICBfLm9iamVjdCA9IGZ1bmN0aW9uKGxpc3QsIHZhbHVlcykge1xuICAgIGlmIChsaXN0ID09IG51bGwpIHJldHVybiB7fTtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1dID0gdmFsdWVzW2ldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2xpc3RbaV1bMF1dID0gbGlzdFtpXVsxXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGFuIGl0ZW0gaW4gYW4gYXJyYXksXG4gIC8vIG9yIC0xIGlmIHRoZSBpdGVtIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgYXJyYXkuXG4gIC8vIElmIHRoZSBhcnJheSBpcyBsYXJnZSBhbmQgYWxyZWFkeSBpbiBzb3J0IG9yZGVyLCBwYXNzIGB0cnVlYFxuICAvLyBmb3IgKippc1NvcnRlZCoqIHRvIHVzZSBiaW5hcnkgc2VhcmNoLlxuICBfLmluZGV4T2YgPSBmdW5jdGlvbihhcnJheSwgaXRlbSwgaXNTb3J0ZWQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIC0xO1xuICAgIHZhciBpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICAgIGlmIChpc1NvcnRlZCkge1xuICAgICAgaWYgKHR5cGVvZiBpc1NvcnRlZCA9PSAnbnVtYmVyJykge1xuICAgICAgICBpID0gaXNTb3J0ZWQgPCAwID8gTWF0aC5tYXgoMCwgbGVuZ3RoICsgaXNTb3J0ZWQpIDogaXNTb3J0ZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpID0gXy5zb3J0ZWRJbmRleChhcnJheSwgaXRlbSk7XG4gICAgICAgIHJldHVybiBhcnJheVtpXSA9PT0gaXRlbSA/IGkgOiAtMTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgXy5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBmcm9tKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiAtMTtcbiAgICB2YXIgaWR4ID0gYXJyYXkubGVuZ3RoO1xuICAgIGlmICh0eXBlb2YgZnJvbSA9PSAnbnVtYmVyJykge1xuICAgICAgaWR4ID0gZnJvbSA8IDAgPyBpZHggKyBmcm9tICsgMSA6IE1hdGgubWluKGlkeCwgZnJvbSArIDEpO1xuICAgIH1cbiAgICB3aGlsZSAoLS1pZHggPj0gMCkgaWYgKGFycmF5W2lkeF0gPT09IGl0ZW0pIHJldHVybiBpZHg7XG4gICAgcmV0dXJuIC0xO1xuICB9O1xuXG4gIC8vIEdlbmVyYXRlIGFuIGludGVnZXIgQXJyYXkgY29udGFpbmluZyBhbiBhcml0aG1ldGljIHByb2dyZXNzaW9uLiBBIHBvcnQgb2ZcbiAgLy8gdGhlIG5hdGl2ZSBQeXRob24gYHJhbmdlKClgIGZ1bmN0aW9uLiBTZWVcbiAgLy8gW3RoZSBQeXRob24gZG9jdW1lbnRhdGlvbl0oaHR0cDovL2RvY3MucHl0aG9uLm9yZy9saWJyYXJ5L2Z1bmN0aW9ucy5odG1sI3JhbmdlKS5cbiAgXy5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPD0gMSkge1xuICAgICAgc3RvcCA9IHN0YXJ0IHx8IDA7XG4gICAgICBzdGFydCA9IDA7XG4gICAgfVxuICAgIHN0ZXAgPSBzdGVwIHx8IDE7XG5cbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5tYXgoTWF0aC5jZWlsKChzdG9wIC0gc3RhcnQpIC8gc3RlcCksIDApO1xuICAgIHZhciByYW5nZSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBsZW5ndGg7IGlkeCsrLCBzdGFydCArPSBzdGVwKSB7XG4gICAgICByYW5nZVtpZHhdID0gc3RhcnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJhbmdlO1xuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIChhaGVtKSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUmV1c2FibGUgY29uc3RydWN0b3IgZnVuY3Rpb24gZm9yIHByb3RvdHlwZSBzZXR0aW5nLlxuICB2YXIgQ3RvciA9IGZ1bmN0aW9uKCl7fTtcblxuICAvLyBDcmVhdGUgYSBmdW5jdGlvbiBib3VuZCB0byBhIGdpdmVuIG9iamVjdCAoYXNzaWduaW5nIGB0aGlzYCwgYW5kIGFyZ3VtZW50cyxcbiAgLy8gb3B0aW9uYWxseSkuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBGdW5jdGlvbi5iaW5kYCBpZlxuICAvLyBhdmFpbGFibGUuXG4gIF8uYmluZCA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQpIHtcbiAgICB2YXIgYXJncywgYm91bmQ7XG4gICAgaWYgKG5hdGl2ZUJpbmQgJiYgZnVuYy5iaW5kID09PSBuYXRpdmVCaW5kKSByZXR1cm4gbmF0aXZlQmluZC5hcHBseShmdW5jLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGlmICghXy5pc0Z1bmN0aW9uKGZ1bmMpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdCaW5kIG11c3QgYmUgY2FsbGVkIG9uIGEgZnVuY3Rpb24nKTtcbiAgICBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgYm91bmQpKSByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgIEN0b3IucHJvdG90eXBlID0gZnVuYy5wcm90b3R5cGU7XG4gICAgICB2YXIgc2VsZiA9IG5ldyBDdG9yO1xuICAgICAgQ3Rvci5wcm90b3R5cGUgPSBudWxsO1xuICAgICAgdmFyIHJlc3VsdCA9IGZ1bmMuYXBwbHkoc2VsZiwgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICBpZiAoXy5pc09iamVjdChyZXN1bHQpKSByZXR1cm4gcmVzdWx0O1xuICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfTtcbiAgICByZXR1cm4gYm91bmQ7XG4gIH07XG5cbiAgLy8gUGFydGlhbGx5IGFwcGx5IGEgZnVuY3Rpb24gYnkgY3JlYXRpbmcgYSB2ZXJzaW9uIHRoYXQgaGFzIGhhZCBzb21lIG9mIGl0c1xuICAvLyBhcmd1bWVudHMgcHJlLWZpbGxlZCwgd2l0aG91dCBjaGFuZ2luZyBpdHMgZHluYW1pYyBgdGhpc2AgY29udGV4dC4gXyBhY3RzXG4gIC8vIGFzIGEgcGxhY2Vob2xkZXIsIGFsbG93aW5nIGFueSBjb21iaW5hdGlvbiBvZiBhcmd1bWVudHMgdG8gYmUgcHJlLWZpbGxlZC5cbiAgXy5wYXJ0aWFsID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHZhciBib3VuZEFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBvc2l0aW9uID0gMDtcbiAgICAgIHZhciBhcmdzID0gYm91bmRBcmdzLnNsaWNlKCk7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gYXJncy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYXJnc1tpXSA9PT0gXykgYXJnc1tpXSA9IGFyZ3VtZW50c1twb3NpdGlvbisrXTtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChwb3NpdGlvbiA8IGFyZ3VtZW50cy5sZW5ndGgpIGFyZ3MucHVzaChhcmd1bWVudHNbcG9zaXRpb24rK10pO1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBCaW5kIGEgbnVtYmVyIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFJlbWFpbmluZyBhcmd1bWVudHNcbiAgLy8gYXJlIHRoZSBtZXRob2QgbmFtZXMgdG8gYmUgYm91bmQuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdCBhbGwgY2FsbGJhY2tzXG4gIC8vIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgXy5iaW5kQWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGksIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsIGtleTtcbiAgICBpZiAobGVuZ3RoIDw9IDEpIHRocm93IG5ldyBFcnJvcignYmluZEFsbCBtdXN0IGJlIHBhc3NlZCBmdW5jdGlvbiBuYW1lcycpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0gYXJndW1lbnRzW2ldO1xuICAgICAgb2JqW2tleV0gPSBfLmJpbmQob2JqW2tleV0sIG9iaik7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gTWVtb2l6ZSBhbiBleHBlbnNpdmUgZnVuY3Rpb24gYnkgc3RvcmluZyBpdHMgcmVzdWx0cy5cbiAgXy5tZW1vaXplID0gZnVuY3Rpb24oZnVuYywgaGFzaGVyKSB7XG4gICAgdmFyIG1lbW9pemUgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBjYWNoZSA9IG1lbW9pemUuY2FjaGU7XG4gICAgICB2YXIgYWRkcmVzcyA9IGhhc2hlciA/IGhhc2hlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDoga2V5O1xuICAgICAgaWYgKCFfLmhhcyhjYWNoZSwgYWRkcmVzcykpIGNhY2hlW2FkZHJlc3NdID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIGNhY2hlW2FkZHJlc3NdO1xuICAgIH07XG4gICAgbWVtb2l6ZS5jYWNoZSA9IHt9O1xuICAgIHJldHVybiBtZW1vaXplO1xuICB9O1xuXG4gIC8vIERlbGF5cyBhIGZ1bmN0aW9uIGZvciB0aGUgZ2l2ZW4gbnVtYmVyIG9mIG1pbGxpc2Vjb25kcywgYW5kIHRoZW4gY2FsbHNcbiAgLy8gaXQgd2l0aCB0aGUgYXJndW1lbnRzIHN1cHBsaWVkLlxuICBfLmRlbGF5ID0gZnVuY3Rpb24oZnVuYywgd2FpdCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShudWxsLCBhcmdzKTtcbiAgICB9LCB3YWl0KTtcbiAgfTtcblxuICAvLyBEZWZlcnMgYSBmdW5jdGlvbiwgc2NoZWR1bGluZyBpdCB0byBydW4gYWZ0ZXIgdGhlIGN1cnJlbnQgY2FsbCBzdGFjayBoYXNcbiAgLy8gY2xlYXJlZC5cbiAgXy5kZWZlciA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICByZXR1cm4gXy5kZWxheS5hcHBseShfLCBbZnVuYywgMV0uY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSkpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgd2hlbiBpbnZva2VkLCB3aWxsIG9ubHkgYmUgdHJpZ2dlcmVkIGF0IG1vc3Qgb25jZVxuICAvLyBkdXJpbmcgYSBnaXZlbiB3aW5kb3cgb2YgdGltZS4gTm9ybWFsbHksIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbCBydW5cbiAgLy8gYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuICAvLyBidXQgaWYgeW91J2QgbGlrZSB0byBkaXNhYmxlIHRoZSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSwgcGFzc1xuICAvLyBge2xlYWRpbmc6IGZhbHNlfWAuIFRvIGRpc2FibGUgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlLCBkaXR0by5cbiAgXy50aHJvdHRsZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICB2YXIgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICAgIHZhciB0aW1lb3V0ID0gbnVsbDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IF8ubm93KCk7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub3cgPSBfLm5vdygpO1xuICAgICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKSBwcmV2aW91cyA9IG5vdztcbiAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICAvLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gIC8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuICAvLyBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuICBfLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQsIGFyZ3MsIGNvbnRleHQsIHRpbWVzdGFtcCwgcmVzdWx0O1xuXG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbGFzdCA9IF8ubm93KCkgLSB0aW1lc3RhbXA7XG5cbiAgICAgIGlmIChsYXN0IDwgd2FpdCAmJiBsYXN0ID4gMCkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB0aW1lc3RhbXAgPSBfLm5vdygpO1xuICAgICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICBpZiAoIXRpbWVvdXQpIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgIGlmIChjYWxsTm93KSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGZ1bmN0aW9uIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byB0aGUgc2Vjb25kLFxuICAvLyBhbGxvd2luZyB5b3UgdG8gYWRqdXN0IGFyZ3VtZW50cywgcnVuIGNvZGUgYmVmb3JlIGFuZCBhZnRlciwgYW5kXG4gIC8vIGNvbmRpdGlvbmFsbHkgZXhlY3V0ZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG4gIF8ud3JhcCA9IGZ1bmN0aW9uKGZ1bmMsIHdyYXBwZXIpIHtcbiAgICByZXR1cm4gXy5wYXJ0aWFsKHdyYXBwZXIsIGZ1bmMpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBuZWdhdGVkIHZlcnNpb24gb2YgdGhlIHBhc3NlZC1pbiBwcmVkaWNhdGUuXG4gIF8ubmVnYXRlID0gZnVuY3Rpb24ocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICFwcmVkaWNhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBhIGxpc3Qgb2YgZnVuY3Rpb25zLCBlYWNoXG4gIC8vIGNvbnN1bWluZyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGZvbGxvd3MuXG4gIF8uY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBzdGFydCA9IGFyZ3MubGVuZ3RoIC0gMTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaSA9IHN0YXJ0O1xuICAgICAgdmFyIHJlc3VsdCA9IGFyZ3Nbc3RhcnRdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB3aGlsZSAoaS0tKSByZXN1bHQgPSBhcmdzW2ldLmNhbGwodGhpcywgcmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgYWZ0ZXIgYmVpbmcgY2FsbGVkIE4gdGltZXMuXG4gIF8uYWZ0ZXIgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzIDwgMSkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIGJlZm9yZSBiZWluZyBjYWxsZWQgTiB0aW1lcy5cbiAgXy5iZWZvcmUgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIHZhciBtZW1vO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzID4gMCkge1xuICAgICAgICBtZW1vID0gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnVuYyA9IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYXQgbW9zdCBvbmUgdGltZSwgbm8gbWF0dGVyIGhvd1xuICAvLyBvZnRlbiB5b3UgY2FsbCBpdC4gVXNlZnVsIGZvciBsYXp5IGluaXRpYWxpemF0aW9uLlxuICBfLm9uY2UgPSBfLnBhcnRpYWwoXy5iZWZvcmUsIDIpO1xuXG4gIC8vIE9iamVjdCBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJldHJpZXZlIHRoZSBuYW1lcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgT2JqZWN0LmtleXNgXG4gIF8ua2V5cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gW107XG4gICAgaWYgKG5hdGl2ZUtleXMpIHJldHVybiBuYXRpdmVLZXlzKG9iaik7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSB0aGUgdmFsdWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIF8udmFsdWVzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHZhbHVlcyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFsdWVzW2ldID0gb2JqW2tleXNbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9O1xuXG4gIC8vIENvbnZlcnQgYW4gb2JqZWN0IGludG8gYSBsaXN0IG9mIGBba2V5LCB2YWx1ZV1gIHBhaXJzLlxuICBfLnBhaXJzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHBhaXJzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBwYWlyc1tpXSA9IFtrZXlzW2ldLCBvYmpba2V5c1tpXV1dO1xuICAgIH1cbiAgICByZXR1cm4gcGFpcnM7XG4gIH07XG5cbiAgLy8gSW52ZXJ0IHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgYW4gb2JqZWN0LiBUaGUgdmFsdWVzIG11c3QgYmUgc2VyaWFsaXphYmxlLlxuICBfLmludmVydCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRbb2JqW2tleXNbaV1dXSA9IGtleXNbaV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgc29ydGVkIGxpc3Qgb2YgdGhlIGZ1bmN0aW9uIG5hbWVzIGF2YWlsYWJsZSBvbiB0aGUgb2JqZWN0LlxuICAvLyBBbGlhc2VkIGFzIGBtZXRob2RzYFxuICBfLmZ1bmN0aW9ucyA9IF8ubWV0aG9kcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBuYW1lcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24ob2JqW2tleV0pKSBuYW1lcy5wdXNoKGtleSk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lcy5zb3J0KCk7XG4gIH07XG5cbiAgLy8gRXh0ZW5kIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBwcm9wZXJ0aWVzIGluIHBhc3NlZC1pbiBvYmplY3QocykuXG4gIF8uZXh0ZW5kID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gICAgdmFyIHNvdXJjZSwgcHJvcDtcbiAgICBmb3IgKHZhciBpID0gMSwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBzb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgICBmb3IgKHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwgcHJvcCkpIHtcbiAgICAgICAgICAgIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCBvbmx5IGNvbnRhaW5pbmcgdGhlIHdoaXRlbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ucGljayA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0ge30sIGtleTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHQ7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihpdGVyYXRlZSkpIHtcbiAgICAgIGl0ZXJhdGVlID0gY3JlYXRlQ2FsbGJhY2soaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgICBpZiAoaXRlcmF0ZWUodmFsdWUsIGtleSwgb2JqKSkgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBjb25jYXQuYXBwbHkoW10sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgICBvYmogPSBuZXcgT2JqZWN0KG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgICBpZiAoa2V5IGluIG9iaikgcmVzdWx0W2tleV0gPSBvYmpba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IHdpdGhvdXQgdGhlIGJsYWNrbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ub21pdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGl0ZXJhdGVlKSkge1xuICAgICAgaXRlcmF0ZWUgPSBfLm5lZ2F0ZShpdGVyYXRlZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBrZXlzID0gXy5tYXAoY29uY2F0LmFwcGx5KFtdLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpLCBTdHJpbmcpO1xuICAgICAgaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHJldHVybiAhXy5jb250YWlucyhrZXlzLCBrZXkpO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIF8ucGljayhvYmosIGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBGaWxsIGluIGEgZ2l2ZW4gb2JqZWN0IHdpdGggZGVmYXVsdCBwcm9wZXJ0aWVzLlxuICBfLmRlZmF1bHRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gICAgZm9yICh2YXIgaSA9IDEsIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChvYmpbcHJvcF0gPT09IHZvaWQgMCkgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBhIChzaGFsbG93LWNsb25lZCkgZHVwbGljYXRlIG9mIGFuIG9iamVjdC5cbiAgXy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gb2JqO1xuICAgIHJldHVybiBfLmlzQXJyYXkob2JqKSA/IG9iai5zbGljZSgpIDogXy5leHRlbmQoe30sIG9iaik7XG4gIH07XG5cbiAgLy8gSW52b2tlcyBpbnRlcmNlcHRvciB3aXRoIHRoZSBvYmosIGFuZCB0aGVuIHJldHVybnMgb2JqLlxuICAvLyBUaGUgcHJpbWFyeSBwdXJwb3NlIG9mIHRoaXMgbWV0aG9kIGlzIHRvIFwidGFwIGludG9cIiBhIG1ldGhvZCBjaGFpbiwgaW5cbiAgLy8gb3JkZXIgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIGludGVybWVkaWF0ZSByZXN1bHRzIHdpdGhpbiB0aGUgY2hhaW4uXG4gIF8udGFwID0gZnVuY3Rpb24ob2JqLCBpbnRlcmNlcHRvcikge1xuICAgIGludGVyY2VwdG9yKG9iaik7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCByZWN1cnNpdmUgY29tcGFyaXNvbiBmdW5jdGlvbiBmb3IgYGlzRXF1YWxgLlxuICB2YXIgZXEgPSBmdW5jdGlvbihhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAgIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cbiAgICAvLyBTZWUgdGhlIFtIYXJtb255IGBlZ2FsYCBwcm9wb3NhbF0oaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsKS5cbiAgICBpZiAoYSA9PT0gYikgcmV0dXJuIGEgIT09IDAgfHwgMSAvIGEgPT09IDEgLyBiO1xuICAgIC8vIEEgc3RyaWN0IGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYG51bGwgPT0gdW5kZWZpbmVkYC5cbiAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkgcmV0dXJuIGEgPT09IGI7XG4gICAgLy8gVW53cmFwIGFueSB3cmFwcGVkIG9iamVjdHMuXG4gICAgaWYgKGEgaW5zdGFuY2VvZiBfKSBhID0gYS5fd3JhcHBlZDtcbiAgICBpZiAoYiBpbnN0YW5jZW9mIF8pIGIgPSBiLl93cmFwcGVkO1xuICAgIC8vIENvbXBhcmUgYFtbQ2xhc3NdXWAgbmFtZXMuXG4gICAgdmFyIGNsYXNzTmFtZSA9IHRvU3RyaW5nLmNhbGwoYSk7XG4gICAgaWYgKGNsYXNzTmFtZSAhPT0gdG9TdHJpbmcuY2FsbChiKSkgcmV0dXJuIGZhbHNlO1xuICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAvLyBTdHJpbmdzLCBudW1iZXJzLCByZWd1bGFyIGV4cHJlc3Npb25zLCBkYXRlcywgYW5kIGJvb2xlYW5zIGFyZSBjb21wYXJlZCBieSB2YWx1ZS5cbiAgICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgICAvLyBSZWdFeHBzIGFyZSBjb2VyY2VkIHRvIHN0cmluZ3MgZm9yIGNvbXBhcmlzb24gKE5vdGU6ICcnICsgL2EvaSA9PT0gJy9hL2knKVxuICAgICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzpcbiAgICAgICAgLy8gUHJpbWl0aXZlcyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBvYmplY3Qgd3JhcHBlcnMgYXJlIGVxdWl2YWxlbnQ7IHRodXMsIGBcIjVcImAgaXNcbiAgICAgICAgLy8gZXF1aXZhbGVudCB0byBgbmV3IFN0cmluZyhcIjVcIilgLlxuICAgICAgICByZXR1cm4gJycgKyBhID09PSAnJyArIGI7XG4gICAgICBjYXNlICdbb2JqZWN0IE51bWJlcl0nOlxuICAgICAgICAvLyBgTmFOYHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBub24tcmVmbGV4aXZlLlxuICAgICAgICAvLyBPYmplY3QoTmFOKSBpcyBlcXVpdmFsZW50IHRvIE5hTlxuICAgICAgICBpZiAoK2EgIT09ICthKSByZXR1cm4gK2IgIT09ICtiO1xuICAgICAgICAvLyBBbiBgZWdhbGAgY29tcGFyaXNvbiBpcyBwZXJmb3JtZWQgZm9yIG90aGVyIG51bWVyaWMgdmFsdWVzLlxuICAgICAgICByZXR1cm4gK2EgPT09IDAgPyAxIC8gK2EgPT09IDEgLyBiIDogK2EgPT09ICtiO1xuICAgICAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgICBjYXNlICdbb2JqZWN0IEJvb2xlYW5dJzpcbiAgICAgICAgLy8gQ29lcmNlIGRhdGVzIGFuZCBib29sZWFucyB0byBudW1lcmljIHByaW1pdGl2ZSB2YWx1ZXMuIERhdGVzIGFyZSBjb21wYXJlZCBieSB0aGVpclxuICAgICAgICAvLyBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnMuIE5vdGUgdGhhdCBpbnZhbGlkIGRhdGVzIHdpdGggbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zXG4gICAgICAgIC8vIG9mIGBOYU5gIGFyZSBub3QgZXF1aXZhbGVudC5cbiAgICAgICAgcmV0dXJuICthID09PSArYjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBhICE9ICdvYmplY3QnIHx8IHR5cGVvZiBiICE9ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gQXNzdW1lIGVxdWFsaXR5IGZvciBjeWNsaWMgc3RydWN0dXJlcy4gVGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpY1xuICAgIC8vIHN0cnVjdHVyZXMgaXMgYWRhcHRlZCBmcm9tIEVTIDUuMSBzZWN0aW9uIDE1LjEyLjMsIGFic3RyYWN0IG9wZXJhdGlvbiBgSk9gLlxuICAgIHZhciBsZW5ndGggPSBhU3RhY2subGVuZ3RoO1xuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgLy8gTGluZWFyIHNlYXJjaC4gUGVyZm9ybWFuY2UgaXMgaW52ZXJzZWx5IHByb3BvcnRpb25hbCB0byB0aGUgbnVtYmVyIG9mXG4gICAgICAvLyB1bmlxdWUgbmVzdGVkIHN0cnVjdHVyZXMuXG4gICAgICBpZiAoYVN0YWNrW2xlbmd0aF0gPT09IGEpIHJldHVybiBiU3RhY2tbbGVuZ3RoXSA9PT0gYjtcbiAgICB9XG4gICAgLy8gT2JqZWN0cyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVpdmFsZW50LCBidXQgYE9iamVjdGBzXG4gICAgLy8gZnJvbSBkaWZmZXJlbnQgZnJhbWVzIGFyZS5cbiAgICB2YXIgYUN0b3IgPSBhLmNvbnN0cnVjdG9yLCBiQ3RvciA9IGIuY29uc3RydWN0b3I7XG4gICAgaWYgKFxuICAgICAgYUN0b3IgIT09IGJDdG9yICYmXG4gICAgICAvLyBIYW5kbGUgT2JqZWN0LmNyZWF0ZSh4KSBjYXNlc1xuICAgICAgJ2NvbnN0cnVjdG9yJyBpbiBhICYmICdjb25zdHJ1Y3RvcicgaW4gYiAmJlxuICAgICAgIShfLmlzRnVuY3Rpb24oYUN0b3IpICYmIGFDdG9yIGluc3RhbmNlb2YgYUN0b3IgJiZcbiAgICAgICAgXy5pc0Z1bmN0aW9uKGJDdG9yKSAmJiBiQ3RvciBpbnN0YW5jZW9mIGJDdG9yKVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBBZGQgdGhlIGZpcnN0IG9iamVjdCB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnB1c2goYSk7XG4gICAgYlN0YWNrLnB1c2goYik7XG4gICAgdmFyIHNpemUsIHJlc3VsdDtcbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgYW5kIGFycmF5cy5cbiAgICBpZiAoY2xhc3NOYW1lID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAvLyBDb21wYXJlIGFycmF5IGxlbmd0aHMgdG8gZGV0ZXJtaW5lIGlmIGEgZGVlcCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeS5cbiAgICAgIHNpemUgPSBhLmxlbmd0aDtcbiAgICAgIHJlc3VsdCA9IHNpemUgPT09IGIubGVuZ3RoO1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAvLyBEZWVwIGNvbXBhcmUgdGhlIGNvbnRlbnRzLCBpZ25vcmluZyBub24tbnVtZXJpYyBwcm9wZXJ0aWVzLlxuICAgICAgICB3aGlsZSAoc2l6ZS0tKSB7XG4gICAgICAgICAgaWYgKCEocmVzdWx0ID0gZXEoYVtzaXplXSwgYltzaXplXSwgYVN0YWNrLCBiU3RhY2spKSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGVlcCBjb21wYXJlIG9iamVjdHMuXG4gICAgICB2YXIga2V5cyA9IF8ua2V5cyhhKSwga2V5O1xuICAgICAgc2l6ZSA9IGtleXMubGVuZ3RoO1xuICAgICAgLy8gRW5zdXJlIHRoYXQgYm90aCBvYmplY3RzIGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIHByb3BlcnRpZXMgYmVmb3JlIGNvbXBhcmluZyBkZWVwIGVxdWFsaXR5LlxuICAgICAgcmVzdWx0ID0gXy5rZXlzKGIpLmxlbmd0aCA9PT0gc2l6ZTtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgd2hpbGUgKHNpemUtLSkge1xuICAgICAgICAgIC8vIERlZXAgY29tcGFyZSBlYWNoIG1lbWJlclxuICAgICAgICAgIGtleSA9IGtleXNbc2l6ZV07XG4gICAgICAgICAgaWYgKCEocmVzdWx0ID0gXy5oYXMoYiwga2V5KSAmJiBlcShhW2tleV0sIGJba2V5XSwgYVN0YWNrLCBiU3RhY2spKSkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gUmVtb3ZlIHRoZSBmaXJzdCBvYmplY3QgZnJvbSB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgYVN0YWNrLnBvcCgpO1xuICAgIGJTdGFjay5wb3AoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFBlcmZvcm0gYSBkZWVwIGNvbXBhcmlzb24gdG8gY2hlY2sgaWYgdHdvIG9iamVjdHMgYXJlIGVxdWFsLlxuICBfLmlzRXF1YWwgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGVxKGEsIGIsIFtdLCBbXSk7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiBhcnJheSwgc3RyaW5nLCBvciBvYmplY3QgZW1wdHk/XG4gIC8vIEFuIFwiZW1wdHlcIiBvYmplY3QgaGFzIG5vIGVudW1lcmFibGUgb3duLXByb3BlcnRpZXMuXG4gIF8uaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgaWYgKF8uaXNBcnJheShvYmopIHx8IF8uaXNTdHJpbmcob2JqKSB8fCBfLmlzQXJndW1lbnRzKG9iaikpIHJldHVybiBvYmoubGVuZ3RoID09PSAwO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgRE9NIGVsZW1lbnQ/XG4gIF8uaXNFbGVtZW50ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYW4gYXJyYXk/XG4gIC8vIERlbGVnYXRlcyB0byBFQ01BNSdzIG5hdGl2ZSBBcnJheS5pc0FycmF5XG4gIF8uaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIGFuIG9iamVjdD9cbiAgXy5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciB0eXBlID0gdHlwZW9mIG9iajtcbiAgICByZXR1cm4gdHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlID09PSAnb2JqZWN0JyAmJiAhIW9iajtcbiAgfTtcblxuICAvLyBBZGQgc29tZSBpc1R5cGUgbWV0aG9kczogaXNBcmd1bWVudHMsIGlzRnVuY3Rpb24sIGlzU3RyaW5nLCBpc051bWJlciwgaXNEYXRlLCBpc1JlZ0V4cC5cbiAgXy5lYWNoKFsnQXJndW1lbnRzJywgJ0Z1bmN0aW9uJywgJ1N0cmluZycsICdOdW1iZXInLCAnRGF0ZScsICdSZWdFeHAnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIF9bJ2lzJyArIG5hbWVdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCAnICsgbmFtZSArICddJztcbiAgICB9O1xuICB9KTtcblxuICAvLyBEZWZpbmUgYSBmYWxsYmFjayB2ZXJzaW9uIG9mIHRoZSBtZXRob2QgaW4gYnJvd3NlcnMgKGFoZW0sIElFKSwgd2hlcmVcbiAgLy8gdGhlcmUgaXNuJ3QgYW55IGluc3BlY3RhYmxlIFwiQXJndW1lbnRzXCIgdHlwZS5cbiAgaWYgKCFfLmlzQXJndW1lbnRzKGFyZ3VtZW50cykpIHtcbiAgICBfLmlzQXJndW1lbnRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gXy5oYXMob2JqLCAnY2FsbGVlJyk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIE9wdGltaXplIGBpc0Z1bmN0aW9uYCBpZiBhcHByb3ByaWF0ZS4gV29yayBhcm91bmQgYW4gSUUgMTEgYnVnLlxuICBpZiAodHlwZW9mIC8uLyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIF8uaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIHR5cGVvZiBvYmogPT0gJ2Z1bmN0aW9uJyB8fCBmYWxzZTtcbiAgICB9O1xuICB9XG5cbiAgLy8gSXMgYSBnaXZlbiBvYmplY3QgYSBmaW5pdGUgbnVtYmVyP1xuICBfLmlzRmluaXRlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIGlzRmluaXRlKG9iaikgJiYgIWlzTmFOKHBhcnNlRmxvYXQob2JqKSk7XG4gIH07XG5cbiAgLy8gSXMgdGhlIGdpdmVuIHZhbHVlIGBOYU5gPyAoTmFOIGlzIHRoZSBvbmx5IG51bWJlciB3aGljaCBkb2VzIG5vdCBlcXVhbCBpdHNlbGYpLlxuICBfLmlzTmFOID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8uaXNOdW1iZXIob2JqKSAmJiBvYmogIT09ICtvYmo7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhIGJvb2xlYW4/XG4gIF8uaXNCb29sZWFuID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdHJ1ZSB8fCBvYmogPT09IGZhbHNlIHx8IHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQm9vbGVhbl0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgZXF1YWwgdG8gbnVsbD9cbiAgXy5pc051bGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBudWxsO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgdW5kZWZpbmVkP1xuICBfLmlzVW5kZWZpbmVkID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdm9pZCAwO1xuICB9O1xuXG4gIC8vIFNob3J0Y3V0IGZ1bmN0aW9uIGZvciBjaGVja2luZyBpZiBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gcHJvcGVydHkgZGlyZWN0bHlcbiAgLy8gb24gaXRzZWxmIChpbiBvdGhlciB3b3Jkcywgbm90IG9uIGEgcHJvdG90eXBlKS5cbiAgXy5oYXMgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBvYmogIT0gbnVsbCAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbiAgfTtcblxuICAvLyBVdGlsaXR5IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJ1biBVbmRlcnNjb3JlLmpzIGluICpub0NvbmZsaWN0KiBtb2RlLCByZXR1cm5pbmcgdGhlIGBfYCB2YXJpYWJsZSB0byBpdHNcbiAgLy8gcHJldmlvdXMgb3duZXIuIFJldHVybnMgYSByZWZlcmVuY2UgdG8gdGhlIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICByb290Ll8gPSBwcmV2aW91c1VuZGVyc2NvcmU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gS2VlcCB0aGUgaWRlbnRpdHkgZnVuY3Rpb24gYXJvdW5kIGZvciBkZWZhdWx0IGl0ZXJhdGVlcy5cbiAgXy5pZGVudGl0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIF8uY29uc3RhbnQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICB9O1xuXG4gIF8ubm9vcCA9IGZ1bmN0aW9uKCl7fTtcblxuICBfLnByb3BlcnR5ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIHByZWRpY2F0ZSBmb3IgY2hlY2tpbmcgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLm1hdGNoZXMgPSBmdW5jdGlvbihhdHRycykge1xuICAgIHZhciBwYWlycyA9IF8ucGFpcnMoYXR0cnMpLCBsZW5ndGggPSBwYWlycy5sZW5ndGg7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gIWxlbmd0aDtcbiAgICAgIG9iaiA9IG5ldyBPYmplY3Qob2JqKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBhaXIgPSBwYWlyc1tpXSwga2V5ID0gcGFpclswXTtcbiAgICAgICAgaWYgKHBhaXJbMV0gIT09IG9ialtrZXldIHx8ICEoa2V5IGluIG9iaikpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUnVuIGEgZnVuY3Rpb24gKipuKiogdGltZXMuXG4gIF8udGltZXMgPSBmdW5jdGlvbihuLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciBhY2N1bSA9IEFycmF5KE1hdGgubWF4KDAsIG4pKTtcbiAgICBpdGVyYXRlZSA9IGNyZWF0ZUNhbGxiYWNrKGl0ZXJhdGVlLCBjb250ZXh0LCAxKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykgYWNjdW1baV0gPSBpdGVyYXRlZShpKTtcbiAgICByZXR1cm4gYWNjdW07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gYW5kIG1heCAoaW5jbHVzaXZlKS5cbiAgXy5yYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIGlmIChtYXggPT0gbnVsbCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG4gIH07XG5cbiAgLy8gQSAocG9zc2libHkgZmFzdGVyKSB3YXkgdG8gZ2V0IHRoZSBjdXJyZW50IHRpbWVzdGFtcCBhcyBhbiBpbnRlZ2VyLlxuICBfLm5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfTtcblxuICAgLy8gTGlzdCBvZiBIVE1MIGVudGl0aWVzIGZvciBlc2NhcGluZy5cbiAgdmFyIGVzY2FwZU1hcCA9IHtcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0OycsXG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmI3gyNzsnLFxuICAgICdgJzogJyYjeDYwOydcbiAgfTtcbiAgdmFyIHVuZXNjYXBlTWFwID0gXy5pbnZlcnQoZXNjYXBlTWFwKTtcblxuICAvLyBGdW5jdGlvbnMgZm9yIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nIHN0cmluZ3MgdG8vZnJvbSBIVE1MIGludGVycG9sYXRpb24uXG4gIHZhciBjcmVhdGVFc2NhcGVyID0gZnVuY3Rpb24obWFwKSB7XG4gICAgdmFyIGVzY2FwZXIgPSBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgcmV0dXJuIG1hcFttYXRjaF07XG4gICAgfTtcbiAgICAvLyBSZWdleGVzIGZvciBpZGVudGlmeWluZyBhIGtleSB0aGF0IG5lZWRzIHRvIGJlIGVzY2FwZWRcbiAgICB2YXIgc291cmNlID0gJyg/OicgKyBfLmtleXMobWFwKS5qb2luKCd8JykgKyAnKSc7XG4gICAgdmFyIHRlc3RSZWdleHAgPSBSZWdFeHAoc291cmNlKTtcbiAgICB2YXIgcmVwbGFjZVJlZ2V4cCA9IFJlZ0V4cChzb3VyY2UsICdnJyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgc3RyaW5nID0gc3RyaW5nID09IG51bGwgPyAnJyA6ICcnICsgc3RyaW5nO1xuICAgICAgcmV0dXJuIHRlc3RSZWdleHAudGVzdChzdHJpbmcpID8gc3RyaW5nLnJlcGxhY2UocmVwbGFjZVJlZ2V4cCwgZXNjYXBlcikgOiBzdHJpbmc7XG4gICAgfTtcbiAgfTtcbiAgXy5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKGVzY2FwZU1hcCk7XG4gIF8udW5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKHVuZXNjYXBlTWFwKTtcblxuICAvLyBJZiB0aGUgdmFsdWUgb2YgdGhlIG5hbWVkIGBwcm9wZXJ0eWAgaXMgYSBmdW5jdGlvbiB0aGVuIGludm9rZSBpdCB3aXRoIHRoZVxuICAvLyBgb2JqZWN0YCBhcyBjb250ZXh0OyBvdGhlcndpc2UsIHJldHVybiBpdC5cbiAgXy5yZXN1bHQgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdFtwcm9wZXJ0eV07XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyBvYmplY3RbcHJvcGVydHldKCkgOiB2YWx1ZTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBpbnRlZ2VyIGlkICh1bmlxdWUgd2l0aGluIHRoZSBlbnRpcmUgY2xpZW50IHNlc3Npb24pLlxuICAvLyBVc2VmdWwgZm9yIHRlbXBvcmFyeSBET00gaWRzLlxuICB2YXIgaWRDb3VudGVyID0gMDtcbiAgXy51bmlxdWVJZCA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgIHZhciBpZCA9ICsraWRDb3VudGVyICsgJyc7XG4gICAgcmV0dXJuIHByZWZpeCA/IHByZWZpeCArIGlkIDogaWQ7XG4gIH07XG5cbiAgLy8gQnkgZGVmYXVsdCwgVW5kZXJzY29yZSB1c2VzIEVSQi1zdHlsZSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzLCBjaGFuZ2UgdGhlXG4gIC8vIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmUgZGVsaW1pdGVycy5cbiAgXy50ZW1wbGF0ZVNldHRpbmdzID0ge1xuICAgIGV2YWx1YXRlICAgIDogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgICBpbnRlcnBvbGF0ZSA6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZSAgICAgIDogLzwlLShbXFxzXFxTXSs/KSU+L2dcbiAgfTtcblxuICAvLyBXaGVuIGN1c3RvbWl6aW5nIGB0ZW1wbGF0ZVNldHRpbmdzYCwgaWYgeW91IGRvbid0IHdhbnQgdG8gZGVmaW5lIGFuXG4gIC8vIGludGVycG9sYXRpb24sIGV2YWx1YXRpb24gb3IgZXNjYXBpbmcgcmVnZXgsIHdlIG5lZWQgb25lIHRoYXQgaXNcbiAgLy8gZ3VhcmFudGVlZCBub3QgdG8gbWF0Y2guXG4gIHZhciBub01hdGNoID0gLyguKV4vO1xuXG4gIC8vIENlcnRhaW4gY2hhcmFjdGVycyBuZWVkIHRvIGJlIGVzY2FwZWQgc28gdGhhdCB0aGV5IGNhbiBiZSBwdXQgaW50byBhXG4gIC8vIHN0cmluZyBsaXRlcmFsLlxuICB2YXIgZXNjYXBlcyA9IHtcbiAgICBcIidcIjogICAgICBcIidcIixcbiAgICAnXFxcXCc6ICAgICAnXFxcXCcsXG4gICAgJ1xccic6ICAgICAncicsXG4gICAgJ1xcbic6ICAgICAnbicsXG4gICAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ3UyMDI5J1xuICB9O1xuXG4gIHZhciBlc2NhcGVyID0gL1xcXFx8J3xcXHJ8XFxufFxcdTIwMjh8XFx1MjAyOS9nO1xuXG4gIHZhciBlc2NhcGVDaGFyID0gZnVuY3Rpb24obWF0Y2gpIHtcbiAgICByZXR1cm4gJ1xcXFwnICsgZXNjYXBlc1ttYXRjaF07XG4gIH07XG5cbiAgLy8gSmF2YVNjcmlwdCBtaWNyby10ZW1wbGF0aW5nLCBzaW1pbGFyIHRvIEpvaG4gUmVzaWcncyBpbXBsZW1lbnRhdGlvbi5cbiAgLy8gVW5kZXJzY29yZSB0ZW1wbGF0aW5nIGhhbmRsZXMgYXJiaXRyYXJ5IGRlbGltaXRlcnMsIHByZXNlcnZlcyB3aGl0ZXNwYWNlLFxuICAvLyBhbmQgY29ycmVjdGx5IGVzY2FwZXMgcXVvdGVzIHdpdGhpbiBpbnRlcnBvbGF0ZWQgY29kZS5cbiAgLy8gTkI6IGBvbGRTZXR0aW5nc2Agb25seSBleGlzdHMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuICBfLnRlbXBsYXRlID0gZnVuY3Rpb24odGV4dCwgc2V0dGluZ3MsIG9sZFNldHRpbmdzKSB7XG4gICAgaWYgKCFzZXR0aW5ncyAmJiBvbGRTZXR0aW5ncykgc2V0dGluZ3MgPSBvbGRTZXR0aW5ncztcbiAgICBzZXR0aW5ncyA9IF8uZGVmYXVsdHMoe30sIHNldHRpbmdzLCBfLnRlbXBsYXRlU2V0dGluZ3MpO1xuXG4gICAgLy8gQ29tYmluZSBkZWxpbWl0ZXJzIGludG8gb25lIHJlZ3VsYXIgZXhwcmVzc2lvbiB2aWEgYWx0ZXJuYXRpb24uXG4gICAgdmFyIG1hdGNoZXIgPSBSZWdFeHAoW1xuICAgICAgKHNldHRpbmdzLmVzY2FwZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuaW50ZXJwb2xhdGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmV2YWx1YXRlIHx8IG5vTWF0Y2gpLnNvdXJjZVxuICAgIF0uam9pbignfCcpICsgJ3wkJywgJ2cnKTtcblxuICAgIC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlIHNvdXJjZSwgZXNjYXBpbmcgc3RyaW5nIGxpdGVyYWxzIGFwcHJvcHJpYXRlbHkuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc291cmNlID0gXCJfX3ArPSdcIjtcbiAgICB0ZXh0LnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24obWF0Y2gsIGVzY2FwZSwgaW50ZXJwb2xhdGUsIGV2YWx1YXRlLCBvZmZzZXQpIHtcbiAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpLnJlcGxhY2UoZXNjYXBlciwgZXNjYXBlQ2hhcik7XG4gICAgICBpbmRleCA9IG9mZnNldCArIG1hdGNoLmxlbmd0aDtcblxuICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGVzY2FwZSArIFwiKSk9PW51bGw/Jyc6Xy5lc2NhcGUoX190KSkrXFxuJ1wiO1xuICAgICAgfSBlbHNlIGlmIChpbnRlcnBvbGF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGludGVycG9sYXRlICsgXCIpKT09bnVsbD8nJzpfX3QpK1xcbidcIjtcbiAgICAgIH0gZWxzZSBpZiAoZXZhbHVhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJztcXG5cIiArIGV2YWx1YXRlICsgXCJcXG5fX3ArPSdcIjtcbiAgICAgIH1cblxuICAgICAgLy8gQWRvYmUgVk1zIG5lZWQgdGhlIG1hdGNoIHJldHVybmVkIHRvIHByb2R1Y2UgdGhlIGNvcnJlY3Qgb2ZmZXN0LlxuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuICAgIHNvdXJjZSArPSBcIic7XFxuXCI7XG5cbiAgICAvLyBJZiBhIHZhcmlhYmxlIGlzIG5vdCBzcGVjaWZpZWQsIHBsYWNlIGRhdGEgdmFsdWVzIGluIGxvY2FsIHNjb3BlLlxuICAgIGlmICghc2V0dGluZ3MudmFyaWFibGUpIHNvdXJjZSA9ICd3aXRoKG9ianx8e30pe1xcbicgKyBzb3VyY2UgKyAnfVxcbic7XG5cbiAgICBzb3VyY2UgPSBcInZhciBfX3QsX19wPScnLF9faj1BcnJheS5wcm90b3R5cGUuam9pbixcIiArXG4gICAgICBcInByaW50PWZ1bmN0aW9uKCl7X19wKz1fX2ouY2FsbChhcmd1bWVudHMsJycpO307XFxuXCIgK1xuICAgICAgc291cmNlICsgJ3JldHVybiBfX3A7XFxuJztcblxuICAgIHRyeSB7XG4gICAgICB2YXIgcmVuZGVyID0gbmV3IEZ1bmN0aW9uKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonLCAnXycsIHNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZS5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIHZhciB0ZW1wbGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiByZW5kZXIuY2FsbCh0aGlzLCBkYXRhLCBfKTtcbiAgICB9O1xuXG4gICAgLy8gUHJvdmlkZSB0aGUgY29tcGlsZWQgc291cmNlIGFzIGEgY29udmVuaWVuY2UgZm9yIHByZWNvbXBpbGF0aW9uLlxuICAgIHZhciBhcmd1bWVudCA9IHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonO1xuICAgIHRlbXBsYXRlLnNvdXJjZSA9ICdmdW5jdGlvbignICsgYXJndW1lbnQgKyAnKXtcXG4nICsgc291cmNlICsgJ30nO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9O1xuXG4gIC8vIEFkZCBhIFwiY2hhaW5cIiBmdW5jdGlvbi4gU3RhcnQgY2hhaW5pbmcgYSB3cmFwcGVkIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLmNoYWluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGluc3RhbmNlID0gXyhvYmopO1xuICAgIGluc3RhbmNlLl9jaGFpbiA9IHRydWU7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9O1xuXG4gIC8vIE9PUFxuICAvLyAtLS0tLS0tLS0tLS0tLS1cbiAgLy8gSWYgVW5kZXJzY29yZSBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgaXQgcmV0dXJucyBhIHdyYXBwZWQgb2JqZWN0IHRoYXRcbiAgLy8gY2FuIGJlIHVzZWQgT08tc3R5bGUuIFRoaXMgd3JhcHBlciBob2xkcyBhbHRlcmVkIHZlcnNpb25zIG9mIGFsbCB0aGVcbiAgLy8gdW5kZXJzY29yZSBmdW5jdGlvbnMuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udGludWUgY2hhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gIHZhciByZXN1bHQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdGhpcy5fY2hhaW4gPyBfKG9iaikuY2hhaW4oKSA6IG9iajtcbiAgfTtcblxuICAvLyBBZGQgeW91ciBvd24gY3VzdG9tIGZ1bmN0aW9ucyB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICBfLmVhY2goXy5mdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBBZGQgYWxsIG9mIHRoZSBVbmRlcnNjb3JlIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlciBvYmplY3QuXG4gIF8ubWl4aW4oXyk7XG5cbiAgLy8gQWRkIGFsbCBtdXRhdG9yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgXy5lYWNoKFsncG9wJywgJ3B1c2gnLCAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iaiA9IHRoaXMuX3dyYXBwZWQ7XG4gICAgICBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKChuYW1lID09PSAnc2hpZnQnIHx8IG5hbWUgPT09ICdzcGxpY2UnKSAmJiBvYmoubGVuZ3RoID09PSAwKSBkZWxldGUgb2JqWzBdO1xuICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIG9iaik7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gQWRkIGFsbCBhY2Nlc3NvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIF8uZWFjaChbJ2NvbmNhdCcsICdqb2luJywgJ3NsaWNlJ10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIG1ldGhvZC5hcHBseSh0aGlzLl93cmFwcGVkLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBFeHRyYWN0cyB0aGUgcmVzdWx0IGZyb20gYSB3cmFwcGVkIGFuZCBjaGFpbmVkIG9iamVjdC5cbiAgXy5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fd3JhcHBlZDtcbiAgfTtcblxuICAvLyBBTUQgcmVnaXN0cmF0aW9uIGhhcHBlbnMgYXQgdGhlIGVuZCBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIEFNRCBsb2FkZXJzXG4gIC8vIHRoYXQgbWF5IG5vdCBlbmZvcmNlIG5leHQtdHVybiBzZW1hbnRpY3Mgb24gbW9kdWxlcy4gRXZlbiB0aG91Z2ggZ2VuZXJhbFxuICAvLyBwcmFjdGljZSBmb3IgQU1EIHJlZ2lzdHJhdGlvbiBpcyB0byBiZSBhbm9ueW1vdXMsIHVuZGVyc2NvcmUgcmVnaXN0ZXJzXG4gIC8vIGFzIGEgbmFtZWQgbW9kdWxlIGJlY2F1c2UsIGxpa2UgalF1ZXJ5LCBpdCBpcyBhIGJhc2UgbGlicmFyeSB0aGF0IGlzXG4gIC8vIHBvcHVsYXIgZW5vdWdoIHRvIGJlIGJ1bmRsZWQgaW4gYSB0aGlyZCBwYXJ0eSBsaWIsIGJ1dCBub3QgYmUgcGFydCBvZlxuICAvLyBhbiBBTUQgbG9hZCByZXF1ZXN0LiBUaG9zZSBjYXNlcyBjb3VsZCBnZW5lcmF0ZSBhbiBlcnJvciB3aGVuIGFuXG4gIC8vIGFub255bW91cyBkZWZpbmUoKSBpcyBjYWxsZWQgb3V0c2lkZSBvZiBhIGxvYWRlciByZXF1ZXN0LlxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCd1bmRlcnNjb3JlJywgW10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF87XG4gICAgfSk7XG4gIH1cbn0uY2FsbCh0aGlzKSk7XG4iXX0=
