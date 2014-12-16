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

},{"../lib/k/k":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/k.js","../lib/k/k_DOM":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/k_DOM.js","../lib/k/kontainer":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/lib/k/kontainer.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_drawing.js":[function(require,module,exports){
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
        console.log('Error: unknown layer, using base');
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
        console.log('Error: Layer "'+ layer_name +'" name not found, using base');
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
    init: function(){
        this.borders = {};
        this.border_options.forEach(function(side){
            this.borders[side] = false;
        });


    },
    border_options: ['T', 'B', 'L', 'R'],

    text: function(text){
        this.cell_text = text;
    },
    borders: function(border_string){
        border_string = border_string.toUpperCase().trim();
        var borders;
        if( border_string === 'ALL' ){
            borders = this.border_options;
        } else {
            borders = border_string.split(/[\s,]+/);
        }
        borders.forEach(function(side){
            this.borders[side] = true;

        });
    }
};

var Table = {
    init: function( num_rows, num_cols ){
        var self = this;
        this.num_rows = num_rows;
        this.num_columns = num_cols;
        this.borders_rows = [];
        this.borders_cols = [];
        this.cell = [];
        _.range(num_cols+1).forEach(function(c){
            self.borders_cols.push([]);
        });
        _.range(num_rows+1).forEach(function(i){
            var r = i+1;
            if( i <  num_rows) self.cell[r] = [];
            self.borders_rows.push([]);
            _.range(num_cols+1).forEach(function(j){
                var c = j+1;
                if( i <  num_rows) self.cell[r][c] = Object.create(Cell);
                self.borders_rows[r-1][c] = false;
                self.borders_cols[c-1][r] = false;
            });
        });
        this.borders_rows[num_rows][num_cols] = false;
        this.borders_cols[num_cols][num_rows] = false;

    },
    text: function( R, C ){
        
    },
    cell_size: function(xy){
        this.cell_size = this.cell_size || {};
        this.cell_size.x = xy[0];
        this.cell_size.y = xy[1];
    },
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
    border: function( R, C, text){
        this.text_rows[R][C] = text;
    },


};

drawing.table = function( num_rows, num_cols ){
    var new_table = Object.create(Table);
    new_table.init( num_rows, num_cols );

    return new_table;

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

var page = function(settings){
    console.log("** Making page 1");

    d = mk_drawing();

    var size = settings.drawing.size;
    var loc = settings.drawing.loc;

    d.text(
        [size.drawing.w/2, size.drawing.h/2],
        'Page 1',
        'title2'
    );

    var t = d.table(3,5);
    //t.cell(1,1).text('cell 1,1');

    console.log(t);

    return d.drawing_parts;
};



module.exports = page;

},{"./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_page_2.js":[function(require,module,exports){
var mk_drawing = require('./mk_drawing');

//var drawing_parts = [];
//d.link_drawing_parts(drawing_parts);

var page = function(settings){
    console.log("** Making page 2");
    d = mk_drawing();

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

},{"./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_page_3.js":[function(require,module,exports){
var mk_drawing = require('./mk_drawing');

var page = function(settings){
    console.log("** Making page 3");

    d = mk_drawing();

    var size = settings.drawing.size;
    var loc = settings.drawing.loc;


    d.text(
        [size.drawing.w/2, size.drawing.h/2],
        'Page 2',
        'title2'
    );

    return d.drawing_parts;
};



module.exports = page;

},{"./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine_dev/app/mk_svg.js":[function(require,module,exports){
'use strict';
//var settings = require('./settings.js');
//var snapsvg = require('snapsvg');
//log(settings);



var display_svg = function(drawing_parts, settings){
    console.log('displaying svg');
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
        'text-anchor':   'left',
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
module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports={

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
var version_string = "Dev";
//var version_string = "Alpha20141210";

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
        console.log(p);
        settings.drawing.parts[p] = mk_page[p](settings);
        settings.drawing.svgs[p] = mk_svg(settings.drawing.parts[p], settings);
        $("#drawing")
            .append($("<p>Page "+p+"</p>"))
            .append($(settings.drawing.svgs[p]));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lX2Rldi9hcHAvZnVuY3Rpb25zLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmVfZGV2L2FwcC9ta19kcmF3aW5nLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmVfZGV2L2FwcC9ta19wYWdlXzEuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZV9kZXYvYXBwL21rX3BhZ2VfMi5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lX2Rldi9hcHAvbWtfcGFnZV8zLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmVfZGV2L2FwcC9ta19zdmcuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZV9kZXYvYXBwL3NldHRpbmdzLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmVfZGV2L2FwcC9zZXR0aW5nc19kcmF3aW5nLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmVfZGV2L2FwcC9zZXR0aW5nc19sYXllcnMuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZV9kZXYvYXBwL3VwZGF0ZV9zeXN0ZW0uanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZV9kZXYvZGF0YS9zZXR0aW5ncy5qc29uLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmVfZGV2L2RhdGEvdGFibGVzLmpzb24iLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZV9kZXYvbGliL2svay5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lX2Rldi9saWIvay9rX0RPTS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lX2Rldi9saWIvay9rX0RPTV9leHRyYS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lX2Rldi9saWIvay9rX2RhdGEuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZV9kZXYvbGliL2sva29udGFpbmVyLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmVfZGV2L2xpYi9rL3dyYXBwZXJfcHJvdG90eXBlLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmVfZGV2L21haW4uanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZV9kZXYvbm9kZV9tb2R1bGVzL21vbWVudC9tb21lbnQuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZV9kZXYvbm9kZV9tb2R1bGVzL3VuZGVyc2NvcmUvdW5kZXJzY29yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDamVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9ZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzkyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxeUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG4vL3ZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgayQgPSByZXF1aXJlKCcuLi9saWIvay9rX0RPTScpO1xudmFyIGsgPSByZXF1aXJlKCcuLi9saWIvay9rJyk7XG52YXIga29udGFpbmVyID0gcmVxdWlyZSgnLi4vbGliL2sva29udGFpbmVyJyk7XG5cbnZhciBmID0ge307XG5cbmYub2JqX25hbWVzID0gZnVuY3Rpb24oIG9iamVjdCApIHtcbiAgICBpZiggb2JqZWN0ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHZhciBhID0gW107XG4gICAgICAgIGZvciggdmFyIGlkIGluIG9iamVjdCApIHtcbiAgICAgICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoaWQpICkgIHtcbiAgICAgICAgICAgICAgICBhLnB1c2goaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbn07XG5cbmYub2JqZWN0X2RlZmluZWQgPSBmdW5jdGlvbihvYmplY3Qpe1xuICAgIC8vY29uc29sZS5sb2cob2JqZWN0KTtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0ICl7XG4gICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhrZXkpO1xuICAgICAgICAgICAgaWYoIG9iamVjdFtrZXldID09PSBudWxsIHx8IG9iamVjdFtrZXldID09PSB1bmRlZmluZWQgKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5mLnNlY3Rpb25fZGVmaW5lZCA9IGZ1bmN0aW9uKHNlY3Rpb25fbmFtZSl7XG4gICAgLy9jb25zb2xlLmxvZyhcIi1cIitzZWN0aW9uX25hbWUpO1xuICAgIHJldHVybiBmLm9iamVjdF9kZWZpbmVkKGYuc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV0gKTtcbn07XG5cbmYubnVsbFRvT2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0ICl7XG4gICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgaWYoIG9iamVjdFtrZXldID09PSBudWxsICl7XG4gICAgICAgICAgICAgICAgb2JqZWN0W2tleV0gPSB7fTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiggdHlwZW9mIG9iamVjdFtrZXldID09PSAnb2JqZWN0JyApIHtcbiAgICAgICAgICAgICAgICBvYmplY3Rba2V5XSA9IGYubnVsbFRvT2JqZWN0KG9iamVjdFtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xufTtcblxuZi5ibGFua19jb3B5ID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICB2YXIgbmV3T2JqZWN0ID0ge307XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdCApe1xuICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIGlmKCBvYmplY3Rba2V5XS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICkge1xuICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldID0ge307XG4gICAgICAgICAgICAgICAgZm9yKCB2YXIga2V5MiBpbiBvYmplY3Rba2V5XSApe1xuICAgICAgICAgICAgICAgICAgICBpZiggb2JqZWN0W2tleV0uaGFzT3duUHJvcGVydHkoa2V5MikgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldW2tleTJdID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3T2JqZWN0W2tleV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdPYmplY3Q7XG59O1xuXG5mLm1lcmdlX29iamVjdHMgPSBmdW5jdGlvbiBtZXJnZV9vYmplY3RzKG9iamVjdDEsIG9iamVjdDIpe1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QxICl7XG4gICAgICAgIGlmKCBvYmplY3QxLmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIC8vaWYoIGtleSA9PT0gJ21ha2UnICkgY29uc29sZS5sb2coa2V5LCBvYmplY3QxLCB0eXBlb2Ygb2JqZWN0MVtrZXldLCB0eXBlb2Ygb2JqZWN0MltrZXldKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coa2V5LCBvYmplY3QxLCB0eXBlb2Ygb2JqZWN0MVtrZXldLCB0eXBlb2Ygb2JqZWN0MltrZXldKTtcbiAgICAgICAgICAgIGlmKCBvYmplY3QxW2tleV0gJiYgb2JqZWN0MVtrZXldLmNvbnN0cnVjdG9yID09PSBPYmplY3QgKSB7XG4gICAgICAgICAgICAgICAgaWYoIG9iamVjdDJba2V5XSA9PT0gdW5kZWZpbmVkICkgb2JqZWN0MltrZXldID0ge307XG4gICAgICAgICAgICAgICAgbWVyZ2Vfb2JqZWN0cyggb2JqZWN0MVtrZXldLCBvYmplY3QyW2tleV0gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYoIG9iamVjdDJba2V5XSA9PT0gdW5kZWZpbmVkICkgb2JqZWN0MltrZXldID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmYuYXJyYXlfdG9fb2JqZWN0ID0gZnVuY3Rpb24oYXJyKSB7XG4gICAgdmFyIHIgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7ICsraSlcbiAgICAgICAgcltpXSA9IGFycltpXTtcbiAgICByZXR1cm4gcjtcbn07XG5cbmYubmFuX2NoZWNrID0gZnVuY3Rpb24gbmFuX2NoZWNrKG9iamVjdCwgcGF0aCl7XG4gICAgaWYoIHBhdGggPT09IHVuZGVmaW5lZCApIHBhdGggPSBcIlwiO1xuICAgIHBhdGggPSBwYXRoK1wiLlwiO1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QgKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggXCJOYU5jaGVjazogXCIrcGF0aCtrZXkgKTtcblxuICAgICAgICBpZiggb2JqZWN0W2tleV0gJiYgb2JqZWN0W2tleV0uY29uc3RydWN0b3IgPT09IEFycmF5ICkgb2JqZWN0W2tleV0gPSBmLmFycmF5X3RvX29iamVjdChvYmplY3Rba2V5XSk7XG5cblxuICAgICAgICBpZiggIG9iamVjdFtrZXldICYmICggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgfHwgb2JqZWN0W2tleV0gIT09IG51bGwgKSl7XG4gICAgICAgICAgICBpZiggb2JqZWN0W2tleV0uY29uc3RydWN0b3IgPT09IE9iamVjdCApe1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coIFwiICBPYmplY3Q6IFwiK3BhdGgra2V5ICk7XG4gICAgICAgICAgICAgICAgbmFuX2NoZWNrKCBvYmplY3Rba2V5XSwgcGF0aCtrZXkgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiggb2JqZWN0W2tleV0gPT09IE5hTiB8fCBvYmplY3Rba2V5XSA9PT0gbnVsbCApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcIk5hTjogXCIrcGF0aCtrZXkgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggXCJEZWZpbmVkOiBcIitwYXRoK2tleSwgb2JqZWN0W2tleV0pO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cbn07XG5cblxuXG5mLnByZXR0eV93b3JkID0gZnVuY3Rpb24obmFtZSl7XG4gICAgcmV0dXJuIG5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBuYW1lLnNsaWNlKDEpO1xufTtcblxuZi5wcmV0dHlfbmFtZSA9IGZ1bmN0aW9uKG5hbWUpe1xuICAgIHZhciBsID0gbmFtZS5zcGxpdCgnXycpO1xuICAgIGwuZm9yRWFjaChmdW5jdGlvbihuYW1lX3NlcW1lbnQsaSl7XG4gICAgICAgIGxbaV0gPSBmLnByZXR0eV93b3JkKG5hbWVfc2VxbWVudCk7XG4gICAgfSk7XG4gICAgdmFyIHByZXR0eSA9IGwuam9pbignICcpO1xuXG4gICAgcmV0dXJuIHByZXR0eTtcbn07XG5cbmYucHJldHR5X25hbWVzID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICB2YXIgbmV3X29iamVjdCA9IHt9O1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QgKXtcbiAgICAgICAgaWYoIG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpICl7XG4gICAgICAgICAgICB2YXIgbmV3X2tleSA9IGYucHJldHR5X25hbWUoa2V5KTtcbiAgICAgICAgICAgIG5ld19vYmplY3RbbmV3X2tleV0gPSBvYmplY3Rba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3X29iamVjdDtcbn07XG5cbi8qXG5mLmtlbGVtX3NldHVwID0gZnVuY3Rpb24oa2VsZW0sIHNldHRpbmdzKXtcbiAgICBpZiggIXNldHRpbmdzKSBjb25zb2xlLmxvZyhzZXR0aW5ncyk7XG4gICAgaWYoIGtlbGVtLnR5cGUgPT09ICdzZWxlY3RvcicgKXtcbiAgICAgICAga2VsZW0uc2V0UmVmT2JqKHNldHRpbmdzKTtcbiAgICAgICAga2VsZW0uc2V0VXBkYXRlKHNldHRpbmdzLnVwZGF0ZSk7XG4gICAgICAgIHNldHRpbmdzLnNlbGVjdF9yZWdpc3RyeS5wdXNoKGtlbGVtKTtcbiAgICAgICAga2VsZW0udXBkYXRlKCk7XG4gICAgfSBlbHNlIGlmKCBrZWxlbS50eXBlID09PSAndmFsdWUnICl7XG4gICAgICAgIGtlbGVtLnNldFJlZk9iaihzZXR0aW5ncyk7XG4gICAgICAgIC8va2VsZW0uc2V0VXBkYXRlKHVwZGF0ZV9zeXN0ZW0pO1xuICAgICAgICBzZXR0aW5ncy52YWx1ZV9yZWdpc3RyeS5wdXNoKGtlbGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIGtlbGVtO1xufTtcbiovXG5cbmYuYWRkX3NlbGVjdG9ycyA9IGZ1bmN0aW9uKHNldHRpbmdzLCBwYXJlbnRfY29udGFpbmVyKXtcbiAgICBmb3IoIHZhciBzZWN0aW9uX25hbWUgaW4gc2V0dGluZ3MuaW5wdXRfb3B0aW9ucyApe1xuICAgICAgICB2YXIgc2VsZWN0aW9uX2NvbnRhaW5lciA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAnaW5wdXRfc2VjdGlvbicpLmF0dHIoJ2lkJywgc2VjdGlvbl9uYW1lICkuYXBwZW5kVG8ocGFyZW50X2NvbnRhaW5lcik7XG4gICAgICAgIC8vc2VsZWN0aW9uX2NvbnRhaW5lci5nZXQoMCkuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlfdHlwZTtcbiAgICAgICAgdmFyIHN5c3RlbV9kaXYgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3RpdGxlX2JhcicpXG4gICAgICAgICAgICAuYXBwZW5kVG8oc2VsZWN0aW9uX2NvbnRhaW5lcilcbiAgICAgICAgICAgIC8qIGpzaGludCAtVzA4MyAqL1xuICAgICAgICAgICAgLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5jaGlsZHJlbignLmRyYXdlcicpLmNoaWxkcmVuKCcuZHJhd2VyX2NvbnRlbnQnKS5zbGlkZVRvZ2dsZSgnZmFzdCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIHZhciBzeXN0ZW1fdGl0bGUgPSAkKCc8YT4nKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpdGxlX2Jhcl90ZXh0JylcbiAgICAgICAgICAgIC5hdHRyKCdocmVmJywgJyMnKVxuICAgICAgICAgICAgLnRleHQoZi5wcmV0dHlfbmFtZShzZWN0aW9uX25hbWUpKVxuICAgICAgICAgICAgLmFwcGVuZFRvKHN5c3RlbV9kaXYpO1xuICAgICAgICAkKHRoaXMpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgIHZhciBkcmF3ZXIgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ2RyYXdlcicpLmFwcGVuZFRvKHNlbGVjdGlvbl9jb250YWluZXIpO1xuICAgICAgICB2YXIgZHJhd2VyX2NvbnRlbnQgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ2RyYXdlcl9jb250ZW50JykuYXBwZW5kVG8oZHJhd2VyKTtcbiAgICAgICAgZm9yKCB2YXIgaW5wdXRfbmFtZSBpbiBzZXR0aW5ncy5pbnB1dF9vcHRpb25zW3NlY3Rpb25fbmFtZV0gKXtcbiAgICAgICAgICAgIHZhciBzZWxlY3Rvcl9zZXQgPSAkKCc8c3Bhbj4nKS5hdHRyKCdjbGFzcycsICdzZWxlY3Rvcl9zZXQnKS5hcHBlbmRUbyhkcmF3ZXJfY29udGVudCk7XG4gICAgICAgICAgICAkKCc8c3Bhbj4nKS5odG1sKGYucHJldHR5X25hbWUoaW5wdXRfbmFtZSkgKyAnOiAnKS5hcHBlbmRUbyhzZWxlY3Rvcl9zZXQpO1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIHZhciBzZWxlY3RvciA9IGskKCdzZWxlY3RvcicpXG4gICAgICAgICAgICAgICAgLnNldE9wdGlvbnNSZWYoICdpbnB1dF9vcHRpb25zLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lIClcbiAgICAgICAgICAgICAgICAuc2V0UmVmKCAnc3lzdGVtLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lIClcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8oc2VsZWN0b3Jfc2V0KTtcbiAgICAgICAgICAgIGYua2VsZW1fc2V0dXAoc2VsZWN0b3IsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIC8vKi9cbiAgICAgICAgICAgIHZhciAkZWxlbSA9ICQoJzxzZWxlY3Q+JylcbiAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnc2VsZWN0b3InKVxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhzZWxlY3Rvcl9zZXQpO1xuICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgICAgIGVsZW06ICRlbGVtLmdldCgpWzBdLFxuICAgICAgICAgICAgICAgIHN5c3RlbV9yZWY6IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKS5vYmooc2V0dGluZ3MpLnJlZignc3lzdGVtLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lKSxcbiAgICAgICAgICAgICAgICBpbnB1dF9yZWY6IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKS5vYmooc2V0dGluZ3MpLnJlZignaW5wdXRzLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lKSxcbiAgICAgICAgICAgICAgICBsaXN0X3JlZjogT2JqZWN0LmNyZWF0ZShrb250YWluZXIpLm9iaihzZXR0aW5ncykucmVmKCdpbnB1dF9vcHRpb25zLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lKSxcbiAgICAgICAgICAgICAgICBpbnRlcmFjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggdGhpcy5zZXRfcmVmLnJlZlN0cmluZywgdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXggKTtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggdGhpcy5lbGVtLm9wdGlvbnNbdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXhdICk7XG4gICAgICAgICAgICAgICAgICAgIC8vaWYoIHRoaXMuaW50ZXJhY3RlZCApXG4gICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleCA+PSAwKSByZXR1cm4gdGhpcy5lbGVtLm9wdGlvbnNbdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJGVsZW0uY2hhbmdlKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5mLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmLnNlbGVjdG9yX2FkZF9vcHRpb25zKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIHNldHRpbmdzLnNlbGVjdF9yZWdpc3RyeS5wdXNoKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIC8vJCgnPC9icj4nKS5hcHBlbmRUbyhkcmF3ZXJfY29udGVudCk7XG5cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmYuc2VsZWN0b3JfYWRkX29wdGlvbnMgPSBmdW5jdGlvbihzZWxlY3Rvcil7XG4gICAgdmFyIGxpc3QgPSBzZWxlY3Rvci5saXN0X3JlZi5nZXQoKTtcbiAgICBpZiggbGlzdCAmJiBsaXN0LmNvbnN0cnVjdG9yID09PSBPYmplY3QgKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ1wibGlzdFwiJywgbGlzdCk7XG4gICAgICAgIGxpc3QgPSBmLm9ial9uYW1lcyhsaXN0KTtcbiAgICB9XG4gICAgc2VsZWN0b3IuZWxlbS5pbm5lckhUTUwgPSBcIlwiO1xuICAgIGlmKCBsaXN0IGluc3RhbmNlb2YgQXJyYXkgKXtcbiAgICAgICAgdmFyIGN1cnJlbnRfdmFsdWUgPSBzZWxlY3Rvci5zeXN0ZW1fcmVmLmdldCgpO1xuICAgICAgICAkKCc8b3B0aW9uPicpLmF0dHIoJ3NlbGVjdGVkJyx0cnVlKS5hdHRyKCdkaXNhYmxlZCcsdHJ1ZSkuYXR0cignaGlkZGVuJyx0cnVlKS5hcHBlbmRUbyhzZWxlY3Rvci5lbGVtKTtcblxuICAgICAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24ob3B0X25hbWUpe1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhvcHRfbmFtZSk7XG4gICAgICAgICAgICB2YXIgbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICAgICAgby52YWx1ZSA9IG9wdF9uYW1lO1xuICAgICAgICAgICAgaWYoIGN1cnJlbnRfdmFsdWUgKXtcbiAgICAgICAgICAgICAgICBpZiggb3B0X25hbWUudG9TdHJpbmcoKSA9PT0gY3VycmVudF92YWx1ZS50b1N0cmluZygpICkge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdmb3VuZCBpdDonLCBvcHRfbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIG8uc2VsZWN0ZWQgPSBcInNlbGVjdGVkXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZG9lcyBub3QgbWF0Y2g6ICcsIG9wdF9uYW1lLCBcIixcIiwgIGN1cnJlbnRfdmFsdWUsIFwiLlwiICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vby5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlbGVjdG9yX29wdGlvbicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdubyBjdXJyZW50IHZhbHVlJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG8uaW5uZXJIVE1MID0gb3B0X25hbWU7XG4gICAgICAgICAgICBzZWxlY3Rvci5lbGVtLmFwcGVuZENoaWxkKG8pO1xuICAgICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2xpc3Qgbm90IGEgbGlzdCcsIGxpc3QsIHNlbGVjdCk7XG4gICAgfVxufTtcblxuZi5hZGRfb3B0aW9ucyA9IGZ1bmN0aW9uKHNlbGVjdCwgYXJyYXkpe1xuICAgIGFycmF5LmZvckVhY2goIGZ1bmN0aW9uKG9wdGlvbil7XG4gICAgICAgICQoJzxvcHRpb24+JykuYXR0ciggJ3ZhbHVlJywgb3B0aW9uICkudGV4dChvcHRpb24pLmFwcGVuZFRvKHNlbGVjdCk7XG4gICAgfSk7XG59O1xuXG5mLmFkZF9wYXJhbXMgPSBmdW5jdGlvbihzZXR0aW5ncywgcGFyZW50X2NvbnRhaW5lcil7XG4gICAgZm9yKCB2YXIgc2VjdGlvbl9uYW1lIGluIHNldHRpbmdzLnN5c3RlbSApe1xuICAgICAgICBpZiggdHJ1ZSB8fCBmLm9iamVjdF9kZWZpbmVkKHNldHRpbmdzLnN5c3RlbVtzZWN0aW9uX25hbWVdKSApe1xuICAgICAgICAgICAgdmFyIHNlbGVjdGlvbl9jb250YWluZXIgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3BhcmFtX3NlY3Rpb24nKS5hdHRyKCdpZCcsIHNlY3Rpb25fbmFtZSApLmFwcGVuZFRvKHBhcmVudF9jb250YWluZXIpO1xuICAgICAgICAgICAgLy9zZWxlY3Rpb25fY29udGFpbmVyLmdldCgwKS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheV90eXBlO1xuICAgICAgICAgICAgdmFyIHN5c3RlbV9kaXYgPSAkKCc8ZGl2PicpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpdGxlX2xpbmUnKVxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhzZWxlY3Rpb25fY29udGFpbmVyKVxuICAgICAgICAgICAgICAgIC8qIGpzaGludCAtVzA4MyAqL1xuICAgICAgICAgICAgICAgIC5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlVG9nZ2xlKCdmYXN0Jyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgc3lzdGVtX3RpdGxlID0gJCgnPGE+JylcbiAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAndGl0bGVfbGluZV90ZXh0JylcbiAgICAgICAgICAgICAgICAuYXR0cignaHJlZicsICcjJylcbiAgICAgICAgICAgICAgICAudGV4dChmLnByZXR0eV9uYW1lKHNlY3Rpb25fbmFtZSkpXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKHN5c3RlbV9kaXYpO1xuICAgICAgICAgICAgJCh0aGlzKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgdmFyIGRyYXdlciA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAnJykuYXBwZW5kVG8oc2VsZWN0aW9uX2NvbnRhaW5lcik7XG4gICAgICAgICAgICB2YXIgZHJhd2VyX2NvbnRlbnQgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3BhcmFtX3NlY3Rpb25fY29udGVudCcpLmFwcGVuZFRvKGRyYXdlcik7XG4gICAgICAgICAgICBmb3IoIHZhciBpbnB1dF9uYW1lIGluIHNldHRpbmdzLnN5c3RlbVtzZWN0aW9uX25hbWVdICl7XG4gICAgICAgICAgICAgICAgJCgnPHNwYW4+JykuaHRtbChmLnByZXR0eV9uYW1lKGlucHV0X25hbWUpICsgJzogJykuYXBwZW5kVG8oZHJhd2VyX2NvbnRlbnQpO1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gayQoJ3ZhbHVlJylcbiAgICAgICAgICAgICAgICAgICAgLy8uc2V0T3B0aW9uc1JlZiggJ2lucHV0X29wdGlvbnMuJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUgKVxuICAgICAgICAgICAgICAgICAgICAuc2V0UmVmKCAnc3lzdGVtLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lIClcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKGRyYXdlcl9jb250ZW50KTtcbiAgICAgICAgICAgICAgICBmLmtlbGVtX3NldHVwKHNlbGVjdG9yLCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAgICAgLy8qL1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZV9rb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcilcbiAgICAgICAgICAgICAgICAgICAgLm9iaihzZXR0aW5ncylcbiAgICAgICAgICAgICAgICAgICAgLnJlZignc3lzdGVtLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lKTtcbiAgICAgICAgICAgICAgICB2YXIgJGVsZW0gPSAkKCc8c3Bhbj4nKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnJylcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKGRyYXdlcl9jb250ZW50KVxuICAgICAgICAgICAgICAgICAgICAudGV4dCh2YWx1ZV9rb250YWluZXIuZ2V0KCkpO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbTogJGVsZW0uZ2V0KClbMF0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlX3JlZjogdmFsdWVfa29udGFpbmVyXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy52YWx1ZV9yZWdpc3RyeS5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAkKCc8L2JyPicpLmFwcGVuZFRvKGRyYXdlcl9jb250ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmYudXBkYXRlX3ZhbHVlcyA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICBzZXR0aW5ncy52YWx1ZV9yZWdpc3RyeS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlX2l0ZW0pe1xuICAgICAgICAvL2NvbnNvbGUubG9nKCB2YWx1ZV9pdGVtICk7XG4gICAgICAgIC8vY29uc29sZS5sb2coIHZhbHVlX2l0ZW0uZWxlbS5vcHRpb25zICk7XG4gICAgICAgIC8vY29uc29sZS5sb2coIHZhbHVlX2l0ZW0uZWxlbS5zZWxlY3RlZEluZGV4ICk7XG4gICAgICAgIGlmKHZhbHVlX2l0ZW0uZWxlbS5zZWxlY3RlZEluZGV4KXtcbiAgICAgICAgICAgIHZhbHVlX2l0ZW0udmFsdWUgPSB2YWx1ZV9pdGVtLmVsZW0ub3B0aW9uc1t2YWx1ZV9pdGVtLmVsZW0uc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4gICAgICAgICAgICB2YWx1ZV9pdGVtLmtvbnRhaW5lci5zZXQodmFsdWVfaXRlbS52YWx1ZSk7XG5cbiAgICAgICAgfVxuICAgIH0pO1xufTtcblxuZi5zaG93X2hpZGVfcGFyYW1zID0gZnVuY3Rpb24ocGFnZV9zZWN0aW9ucywgc2V0dGluZ3Mpe1xuICAgIGZvciggdmFyIGxpc3RfbmFtZSBpbiBwYWdlX3NlY3Rpb25zICl7XG4gICAgICAgIHZhciBpZCA9ICcjJytsaXN0X25hbWU7XG4gICAgICAgIHZhciBzZWN0aW9uX25hbWUgPSBsaXN0X25hbWUuc3BsaXQoJ18nKVswXTtcbiAgICAgICAgdmFyIHNlY3Rpb24gPSBrJChpZCk7XG4gICAgICAgIGlmKCBzZXR0aW5ncy5zdGF0dXMuc2VjdGlvbnNbc2VjdGlvbl9uYW1lXS5zZXQgKSBzZWN0aW9uLnNob3coKTtcbiAgICAgICAgZWxzZSBzZWN0aW9uLmhpZGUoKTtcbiAgICB9XG59O1xuXG5mLnNob3dfaGlkZV9zZWxlY3Rpb25zID0gZnVuY3Rpb24oc2V0dGluZ3MsIGFjdGl2ZV9zZWN0aW9uX25hbWUpe1xuICAgICQoJyNzZWN0aW9uU2VsZWN0b3InKS52YWwoYWN0aXZlX3NlY3Rpb25fbmFtZSk7XG4gICAgZm9yKCB2YXIgbGlzdF9uYW1lIGluIHNldHRpbmdzLmlucHV0ICl7XG4gICAgICAgIHZhciBpZCA9ICcjJytsaXN0X25hbWU7XG4gICAgICAgIHZhciBzZWN0aW9uX25hbWUgPSBsaXN0X25hbWUuc3BsaXQoJ18nKVswXTtcbiAgICAgICAgdmFyIHNlY3Rpb24gPSBrJChpZCk7XG4gICAgICAgIGlmKCBzZWN0aW9uX25hbWUgPT09IGFjdGl2ZV9zZWN0aW9uX25hbWUgKSBzZWN0aW9uLnNob3coKTtcbiAgICAgICAgZWxzZSBzZWN0aW9uLmhpZGUoKTtcbiAgICB9XG59O1xuXG4vL2Yuc2V0RG93bmxvYWRMaW5rKHNldHRpbmdzKXtcbi8vXG4vLyAgICBpZiggc2V0dGluZ3MuUERGICYmIHNldHRpbmdzLlBERi51cmwgKXtcbi8vICAgICAgICB2YXIgbGluayA9ICQoJ2EnKS5hdHRyKCdocmVmJywgc2V0dGluZ3MuUERGLnVybCApLmF0dHIoJ2Rvd25sb2FkJywgJ1BWX2RyYXdpbmcucGRmJykuaHRtbCgnRG93bmxvYWQgRHJhd2luZycpO1xuLy8gICAgICAgICQoJyNkb3dubG9hZCcpLmh0bWwoJycpLmFwcGVuZChsaW5rKTtcbi8vICAgIH1cbi8vfVxuXG5mLmxvYWRUYWJsZXMgPSBmdW5jdGlvbihzdHJpbmcpe1xuICAgIHZhciB0YWJsZXMgPSB7fTtcbiAgICB2YXIgbCA9IHN0cmluZy5zcGxpdCgnXFxuJyk7XG4gICAgdmFyIHRpdGxlO1xuICAgIHZhciBmaWVsZHM7XG4gICAgdmFyIG5lZWRfdGl0bGUgPSB0cnVlO1xuICAgIHZhciBuZWVkX2ZpZWxkcyA9IHRydWU7XG4gICAgbC5mb3JFYWNoKCBmdW5jdGlvbihzdHJpbmcsIGkpe1xuICAgICAgICB2YXIgbGluZSA9IHN0cmluZy50cmltKCk7XG4gICAgICAgIGlmKCBsaW5lLmxlbmd0aCA9PT0gMCApe1xuICAgICAgICAgICAgbmVlZF90aXRsZSA9IHRydWU7XG4gICAgICAgICAgICBuZWVkX2ZpZWxkcyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiggbmVlZF90aXRsZSApIHtcbiAgICAgICAgICAgIHRpdGxlID0gbGluZTtcbiAgICAgICAgICAgIHRhYmxlc1t0aXRsZV0gPSBbXTtcbiAgICAgICAgICAgIG5lZWRfdGl0bGUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmKCBuZWVkX2ZpZWxkcyApIHtcbiAgICAgICAgICAgIGZpZWxkcyA9IGxpbmUuc3BsaXQoJywnKTtcbiAgICAgICAgICAgIHRhYmxlc1t0aXRsZStcIl9maWVsZHNcIl0gPSBmaWVsZHM7XG4gICAgICAgICAgICBuZWVkX2ZpZWxkcyA9IGZhbHNlO1xuICAgICAgICAvL30gZWxzZSB7XG4gICAgICAgIC8vICAgIHZhciBlbnRyeSA9IHt9O1xuICAgICAgICAvLyAgICB2YXIgbGluZV9hcnJheSA9IGxpbmUuc3BsaXQoJywnKTtcbiAgICAgICAgLy8gICAgZmllbGRzLmZvckVhY2goIGZ1bmN0aW9uKGZpZWxkLCBpZCl7XG4gICAgICAgIC8vICAgICAgICBlbnRyeVtmaWVsZC50cmltKCldID0gbGluZV9hcnJheVtpZF0udHJpbSgpO1xuICAgICAgICAvLyAgICB9KTtcbiAgICAgICAgLy8gICAgdGFibGVzW3RpdGxlXS5wdXNoKCBlbnRyeSApO1xuICAgICAgICAvL31cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBsaW5lX2FycmF5ID0gbGluZS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgdGFibGVzW3RpdGxlXVtsaW5lX2FycmF5WzBdLnRyaW0oKV0gPSBsaW5lX2FycmF5WzFdLnRyaW0oKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRhYmxlcztcbn07XG5cbmYubG9hZENvbXBvbmVudHMgPSBmdW5jdGlvbihzdHJpbmcpe1xuICAgIHZhciBkYiA9IGsucGFyc2VDU1Yoc3RyaW5nKTtcbiAgICB2YXIgb2JqZWN0ID0ge307XG4gICAgZm9yKCB2YXIgaSBpbiBkYiApe1xuICAgICAgICB2YXIgY29tcG9uZW50ID0gZGJbaV07XG4gICAgICAgIGlmKCBvYmplY3RbY29tcG9uZW50Lk1ha2VdID09PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIG9iamVjdFtjb21wb25lbnQuTWFrZV0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiggb2JqZWN0W2NvbXBvbmVudC5NYWtlXVtjb21wb25lbnQuTW9kZWxdID09PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIG9iamVjdFtjb21wb25lbnQuTWFrZV1bY29tcG9uZW50Lk1vZGVsXSA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpZWxkcyA9IGsub2JqSWRBcnJheShjb21wb25lbnQpO1xuICAgICAgICBmaWVsZHMuZm9yRWFjaCggZnVuY3Rpb24oIGZpZWxkICl7XG4gICAgICAgICAgICB2YXIgcGFyYW0gPSBjb21wb25lbnRbZmllbGRdO1xuICAgICAgICAgICAgaWYoICEoIGZpZWxkIGluIFsnTWFrZScsICdNb2RlbCddICkgJiYgISggaXNOYU4ocGFyc2VGbG9hdChwYXJhbSkpICkgKXtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRbZmllbGRdID0gcGFyc2VGbG9hdChwYXJhbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIG9iamVjdFtjb21wb25lbnQuTWFrZV1bY29tcG9uZW50Lk1vZGVsXSA9IGNvbXBvbmVudDtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbn07XG5cblxuXG5cbmYubG9hZF9kYXRhYmFzZSA9IGZ1bmN0aW9uKEZTRUNfZGF0YWJhc2VfSlNPTil7XG4gICAgRlNFQ19kYXRhYmFzZV9KU09OID0gZi5sb3dlcmNhc2VfcHJvcGVydGllcyhGU0VDX2RhdGFiYXNlX0pTT04pO1xuICAgIHZhciBzZXR0aW5ncyA9IGYuc2V0dGluZ3M7XG4gICAgc2V0dGluZ3MuY29tcG9uZW50cy5pbnZlcnRlcnMgPSB7fTtcbiAgICBGU0VDX2RhdGFiYXNlX0pTT04uaW52ZXJ0ZXJzLmZvckVhY2goZnVuY3Rpb24oY29tcG9uZW50KXtcbiAgICAgICAgaWYoIHNldHRpbmdzLmNvbXBvbmVudHMuaW52ZXJ0ZXJzW2NvbXBvbmVudC5tYWtlXSA9PT0gdW5kZWZpbmVkICkgc2V0dGluZ3MuY29tcG9uZW50cy5pbnZlcnRlcnNbY29tcG9uZW50Lm1ha2VdID0ge307XG4gICAgICAgIC8vc2V0dGluZ3MuY29tcG9uZW50cy5pbnZlcnRlcnNbY29tcG9uZW50Lm1ha2VdW2NvbXBvbmVudC5tYWtlXSA9IGYucHJldHR5X25hbWVzKGNvbXBvbmVudCk7XG4gICAgICAgIHNldHRpbmdzLmNvbXBvbmVudHMuaW52ZXJ0ZXJzW2NvbXBvbmVudC5tYWtlXVtjb21wb25lbnQubW9kZWxdID0gY29tcG9uZW50O1xuICAgIH0pO1xuICAgIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlcyA9IHt9O1xuICAgIEZTRUNfZGF0YWJhc2VfSlNPTi5tb2R1bGVzLmZvckVhY2goZnVuY3Rpb24oY29tcG9uZW50KXtcbiAgICAgICAgaWYoIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tjb21wb25lbnQubWFrZV0gPT09IHVuZGVmaW5lZCApIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tjb21wb25lbnQubWFrZV0gPSB7fTtcbiAgICAgICAgLy9zZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbY29tcG9uZW50Lm1ha2VdW2NvbXBvbmVudC5tYWtlXSA9IGYucHJldHR5X25hbWVzKGNvbXBvbmVudCk7XG4gICAgICAgIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tjb21wb25lbnQubWFrZV1bY29tcG9uZW50Lm1vZGVsXSA9IGNvbXBvbmVudDtcbiAgICB9KTtcblxuICAgIGYudXBkYXRlKCk7XG59O1xuXG5cbmYuZ2V0X3JlZiA9IGZ1bmN0aW9uKHN0cmluZywgb2JqZWN0KXtcbiAgICB2YXIgcmVmX2FycmF5ID0gc3RyaW5nLnNwbGl0KCcuJyk7XG4gICAgdmFyIGxldmVsID0gb2JqZWN0O1xuICAgIHJlZl9hcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldmVsX25hbWUsaSl7XG4gICAgICAgIGlmKCB0eXBlb2YgbGV2ZWxbbGV2ZWxfbmFtZV0gPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldmVsID0gbGV2ZWxbbGV2ZWxfbmFtZV07XG4gICAgfSk7XG4gICAgcmV0dXJuIGxldmVsO1xufTtcbmYuc2V0X3JlZiA9IGZ1bmN0aW9uKCBvYmplY3QsIHJlZl9zdHJpbmcsIHZhbHVlICl7XG4gICAgdmFyIHJlZl9hcnJheSA9IHJlZl9zdHJpbmcuc3BsaXQoJy4nKTtcbiAgICB2YXIgbGV2ZWwgPSBvYmplY3Q7XG4gICAgcmVmX2FycmF5LmZvckVhY2goZnVuY3Rpb24obGV2ZWxfbmFtZSxpKXtcbiAgICAgICAgaWYoIHR5cGVvZiBsZXZlbFtsZXZlbF9uYW1lXSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbGV2ZWwgPSBsZXZlbFtsZXZlbF9uYW1lXTtcbiAgICB9KTtcblxuICAgIHJldHVybiBsZXZlbDtcbn07XG5cblxuXG5cbmYubG9nX2lmX2RhdGFiYXNlX2xvYWRlZCA9IGZ1bmN0aW9uKGUpe1xuICAgIGlmKGYuc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIH1cbn07XG5cblxuXG5mLmxvd2VyY2FzZV9wcm9wZXJ0aWVzID0gZnVuY3Rpb24gbG93ZXJjYXNlX3Byb3BlcnRpZXMob2JqKSB7XG4gICAgdmFyIG5ld19vYmplY3QgPSBuZXcgb2JqLmNvbnN0cnVjdG9yKCk7XG4gICAgZm9yKCB2YXIgb2xkX25hbWUgaW4gb2JqICl7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkob2xkX25hbWUpKSB7XG4gICAgICAgICAgICB2YXIgbmV3X25hbWUgPSBvbGRfbmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYoIG9ialtvbGRfbmFtZV0uY29uc3RydWN0b3IgPT09IE9iamVjdCB8fCBvYmpbb2xkX25hbWVdLmNvbnN0cnVjdG9yID09PSBBcnJheSApe1xuICAgICAgICAgICAgICAgIG5ld19vYmplY3RbbmV3X25hbWVdID0gbG93ZXJjYXNlX3Byb3BlcnRpZXMob2JqW29sZF9uYW1lXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld19vYmplY3RbbmV3X25hbWVdID0gb2JqW29sZF9uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuICAgIHJldHVybiBuZXdfb2JqZWN0O1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGY7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBrID0gcmVxdWlyZSgnLi4vbGliL2svay5qcycpO1xudmFyIGYgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucy5qcycpO1xudmFyIHNldHRpbmdzID0gcmVxdWlyZSgnLi9zZXR0aW5ncycpO1xuXG4vL3ZhciBzZXR0aW5ncyA9IHJlcXVpcmUoJy4vc2V0dGluZ3MuanMnKTtcbi8vdmFyIGxfYXR0ciA9IHNldHRpbmdzLmRyYXdpbmcubF9hdHRyO1xudmFyIF8gPSByZXF1aXJlKCd1bmRlcnNjb3JlJyk7XG4vLyBzZXR1cCBkcmF3aW5nIGNvbnRhaW5lcnNcblxudmFyIHNldHRpbmdzID0gcmVxdWlyZSgnLi9zZXR0aW5ncycpO1xudmFyIGxheWVyX2F0dHIgPSBzZXR0aW5ncy5kcmF3aW5nLmxheWVyX2F0dHI7XG5cblxuXG5cblxudmFyIGRyYXdpbmcgPSB7fTtcblxuXG5cblxuXG5cblxuXG4vLyBCTE9DS1NcblxudmFyIEJsayA9IHtcbiAgICB0eXBlOiAnYmxvY2snLFxufTtcbkJsay5tb3ZlID0gZnVuY3Rpb24oeCwgeSl7XG4gICAgZm9yKCB2YXIgaSBpbiB0aGlzLmRyYXdpbmdfcGFydHMgKXtcbiAgICAgICAgdGhpcy5kcmF3aW5nX3BhcnRzW2ldLm1vdmUoeCx5KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuQmxrLmFkZCA9IGZ1bmN0aW9uKCl7XG4gICAgaWYoIHR5cGVvZiB0aGlzLmRyYXdpbmdfcGFydHMgPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICB0aGlzLmRyYXdpbmdfcGFydHMgPSBbXTtcbiAgICB9XG4gICAgZm9yKCB2YXIgaSBpbiBhcmd1bWVudHMpe1xuICAgICAgICB0aGlzLmRyYXdpbmdfcGFydHMucHVzaChhcmd1bWVudHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5CbGsucm90YXRlID0gZnVuY3Rpb24oZGVnKXtcbiAgICB0aGlzLnJvdGF0ZSA9IGRlZztcbn07XG5cbnZhciBibG9ja3MgPSB7fTtcbnZhciBibG9ja19hY3RpdmUgPSBmYWxzZTtcbi8vIENyZWF0ZSBkZWZhdWx0IGxheWVyLGJsb2NrIGNvbnRhaW5lciBhbmQgZnVuY3Rpb25zXG5cbi8vIExheWVyc1xuXG52YXIgbGF5ZXJfYWN0aXZlID0gZmFsc2U7XG5cbmRyYXdpbmcubGF5ZXIgPSBmdW5jdGlvbihuYW1lKXsgLy8gc2V0IGN1cnJlbnQgbGF5ZXJcbiAgICBpZiggdHlwZW9mIG5hbWUgPT09ICd1bmRlZmluZWQnICl7IC8vIGlmIG5vIGxheWVyIG5hbWUgZ2l2ZW4sIHJlc2V0IHRvIGRlZmF1bHRcbiAgICAgICAgbGF5ZXJfYWN0aXZlID0gZmFsc2U7XG4gICAgfSBlbHNlIGlmICggISAobmFtZSBpbiBsYXllcl9hdHRyKSApIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiB1bmtub3duIGxheWVyLCB1c2luZyBiYXNlJyk7XG4gICAgICAgIGxheWVyX2FjdGl2ZSA9ICdiYXNlJyA7XG4gICAgfSBlbHNlIHsgLy8gZmluYWx5IGFjdGl2YXRlIHJlcXVlc3RlZCBsYXllclxuICAgICAgICBsYXllcl9hY3RpdmUgPSBuYW1lO1xuICAgIH1cbiAgICAvLyovXG59O1xuXG52YXIgc2VjdGlvbl9hY3RpdmUgPSBmYWxzZTtcblxuZHJhd2luZy4gc2VjdGlvbiA9IGZ1bmN0aW9uKG5hbWUpeyAvLyBzZXQgY3VycmVudCBzZWN0aW9uXG4gICAgaWYoIHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJyApeyAvLyBpZiBubyBzZWN0aW9uIG5hbWUgZ2l2ZW4sIHJlc2V0IHRvIGRlZmF1bHRcbiAgICAgICAgc2VjdGlvbl9hY3RpdmUgPSBmYWxzZTtcbiAgICB9IGVsc2UgeyAvLyBmaW5hbHkgYWN0aXZhdGUgcmVxdWVzdGVkIHNlY3Rpb25cbiAgICAgICAgc2VjdGlvbl9hY3RpdmUgPSBuYW1lO1xuICAgIH1cbiAgICAvLyovXG59O1xuXG4vKlxudmFyIGJsb2NrID0gZnVuY3Rpb24obmFtZSkgey8vIHNldCBjdXJyZW50IGJsb2NrXG4gICAgLy8gaWYgY3VycmVudCBibG9jayBoYXMgYmVlbiB1c2VkLCBzYXZlIGl0IGJlZm9yZSBjcmVhdGluZyBhIG5ldyBvbmUuXG4gICAgaWYoIGJsb2Nrc1tibG9ja19hY3RpdmVdLmxlbmd0aCA+IDAgKSB7IGJsb2Nrcy5wdXNoKGJsb2Nrc1tibG9ja19hY3RpdmVdKTsgfVxuICAgIGlmKCB0eXBlb2YgbmFtZSAhPT0gJ3VuZGVmaW5lZCcgKXsgLy8gaWYgbmFtZSBhcmd1bWVudCBpcyBzdWJtaXR0ZWQsIGNyZWF0ZSBuZXcgYmxvY2tcbiAgICAgICAgdmFyIGJsayA9IE9iamVjdC5jcmVhdGUoQmxrKTtcbiAgICAgICAgYmxrLm5hbWUgPSBuYW1lOyAvLyBibG9jayBuYW1lXG4gICAgICAgIGJsb2Nrc1tibG9ja19hY3RpdmVdID0gYmxrO1xuICAgIH0gZWxzZSB7IC8vIGVsc2UgdXNlIGRlZmF1bHQgYmxvY2tcbiAgICAgICAgYmxvY2tzW2Jsb2NrX2FjdGl2ZV0gPSBibG9ja3NbMF07XG4gICAgfVxufVxuYmxvY2soJ2RlZmF1bHQnKTsgLy8gc2V0IGN1cnJlbnQgYmxvY2sgdG8gZGVmYXVsdFxuKi9cbmRyYXdpbmcuYmxvY2tfc3RhcnQgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgaWYoIHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJyApeyAvLyBpZiBuYW1lIGFyZ3VtZW50IGlzIHN1Ym1pdHRlZFxuICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6IG5hbWUgcmVxdWlyZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgYmxrO1xuICAgICAgICAvLyBUT0RPOiBXaGF0IGlmIHRoZSBzYW1lIG5hbWUgaXMgc3VibWl0dGVkIHR3aWNlPyB0aHJvdyBlcnJvciBvciBmaXg/XG4gICAgICAgIGJsb2NrX2FjdGl2ZSA9IG5hbWU7XG4gICAgICAgIGlmKCB0eXBlb2YgYmxvY2tzW2Jsb2NrX2FjdGl2ZV0gIT09ICdvYmplY3QnKXtcbiAgICAgICAgICAgIGJsayA9IE9iamVjdC5jcmVhdGUoQmxrKTtcbiAgICAgICAgICAgIC8vYmxrLm5hbWUgPSBuYW1lOyAvLyBibG9jayBuYW1lXG4gICAgICAgICAgICBibG9ja3NbYmxvY2tfYWN0aXZlXSA9IGJsaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmxrO1xuICAgIH1cbn07XG5cbiAgICAvKlxuICAgIHggPSBsb2Mud2lyZV90YWJsZS54IC0gdy8yO1xuICAgIHkgPSBsb2Mud2lyZV90YWJsZS55IC0gaC8yO1xuICAgIGlmKCB0eXBlb2YgbGF5ZXJfbmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApIHtcbiAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gbGF5ZXJzW2xheWVyX25hbWVdXG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYoICEgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApeyBjb25zb2xlLmxvZyhcImVycm9yLCBsYXllciBkb2VzIG5vdCBleGlzdCwgdXNpbmcgY3VycmVudFwiKTt9XG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9ICBsYXllcl9hY3RpdmVcbiAgICB9XG4gICAgKi9cbmRyYXdpbmcuYmxvY2tfZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJsayA9IGJsb2Nrc1tibG9ja19hY3RpdmVdO1xuICAgIGJsb2NrX2FjdGl2ZSA9IGZhbHNlO1xuICAgIHJldHVybiBibGs7XG59O1xuXG5cblxuLy8gY2xlYXIgZHJhd2luZ1xuZHJhd2luZy5jbGVhcl9kcmF3aW5nID0gZnVuY3Rpb24oKSB7XG4gICAgZm9yKCB2YXIgaWQgaW4gYmxvY2tzICl7XG4gICAgICAgIGlmKCBibG9ja3MuaGFzT3duUHJvcGVydHkoaWQpKXtcbiAgICAgICAgICAgIGRlbGV0ZSBibG9ja3NbaWRdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRoaXMuZHJhd2luZ19wYXJ0cy5sZW5ndGggPSAwO1xufTtcblxuXG4vLy8vLy9cbi8vIGJ1aWxkIHByb3RvdHlwZSBlbGVtZW50XG5cbiAgICAvKlxuICAgIGlmKCB0eXBlb2YgbGF5ZXJfbmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApIHtcbiAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gbGF5ZXJzW2xheWVyX25hbWVdXG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYoICEgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApeyBjb25zb2xlLmxvZyhcImVycm9yLCBsYXllciBkb2VzIG5vdCBleGlzdCwgdXNpbmcgY3VycmVudFwiKTt9XG4gICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9ICBsYXllcl9hY3RpdmVcbiAgICB9XG4gICAgKi9cblxuXG52YXIgU3ZnRWxlbSA9IHtcbiAgICBvYmplY3Q6ICdTdmdFbGVtJ1xufTtcblN2Z0VsZW0ubW92ZSA9IGZ1bmN0aW9uKHgsIHkpe1xuICAgIGlmKCB0eXBlb2YgdGhpcy5wb2ludHMgIT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgIGZvciggdmFyIGkgaW4gdGhpcy5wb2ludHMgKSB7XG4gICAgICAgICAgICB0aGlzLnBvaW50c1tpXVswXSArPSB4O1xuICAgICAgICAgICAgdGhpcy5wb2ludHNbaV1bMV0gKz0geTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5TdmdFbGVtLnJvdGF0ZSA9IGZ1bmN0aW9uKGRlZyl7XG4gICAgdGhpcy5yb3RhdGVkID0gZGVnO1xufTtcblxuLy8vLy8vL1xuLy8gZnVuY3Rpb25zIGZvciBhZGRpbmcgZHJhd2luZ19wYXJ0c1xuXG5kcmF3aW5nLmFkZCA9IGZ1bmN0aW9uKHR5cGUsIHBvaW50cywgbGF5ZXJfbmFtZSkge1xuXG4gICAgaWYoIHR5cGVvZiBsYXllcl9uYW1lID09PSAndW5kZWZpbmVkJyApIHsgbGF5ZXJfbmFtZSA9IGxheWVyX2FjdGl2ZTsgfVxuICAgIGlmKCAhIChsYXllcl9uYW1lIGluIGxheWVyX2F0dHIpICkge1xuICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6IExheWVyIFwiJysgbGF5ZXJfbmFtZSArJ1wiIG5hbWUgbm90IGZvdW5kLCB1c2luZyBiYXNlJyk7XG4gICAgICAgIGxheWVyX25hbWUgPSAnYmFzZSc7XG4gICAgfVxuXG4gICAgaWYoIHR5cGVvZiBwb2ludHMgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmFyIHBvaW50c19hID0gcG9pbnRzLnNwbGl0KCcgJyk7XG4gICAgICAgIGZvciggdmFyIGkgaW4gcG9pbnRzX2EgKSB7XG4gICAgICAgICAgICBwb2ludHNfYVtpXSA9IHBvaW50c19hW2ldLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICBmb3IoIHZhciBjIGluIHBvaW50c19hW2ldICkge1xuICAgICAgICAgICAgICAgIHBvaW50c19hW2ldW2NdID0gTnVtYmVyKHBvaW50c19hW2ldW2NdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBlbGVtID0gT2JqZWN0LmNyZWF0ZShTdmdFbGVtKTtcbiAgICBlbGVtLnR5cGUgPSB0eXBlO1xuICAgIGVsZW0ubGF5ZXJfbmFtZSA9IGxheWVyX25hbWU7XG4gICAgZWxlbS5zZWN0aW9uX25hbWUgPSBzZWN0aW9uX2FjdGl2ZTtcbiAgICBpZiggdHlwZSA9PT0gJ2xpbmUnICkge1xuICAgICAgICBlbGVtLnBvaW50cyA9IHBvaW50cztcbiAgICB9IGVsc2UgaWYoIHR5cGVvZiBwb2ludHNbMF0ueCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZWxlbS54ID0gcG9pbnRzWzBdWzBdO1xuICAgICAgICBlbGVtLnkgPSBwb2ludHNbMF1bMV07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbS54ID0gcG9pbnRzWzBdLng7XG4gICAgICAgIGVsZW0ueSA9IHBvaW50c1swXS55O1xuICAgIH1cblxuICAgIGlmKGJsb2NrX2FjdGl2ZSkge1xuICAgICAgICBlbGVtLmJsb2NrX25hbWUgPSBibG9ja19hY3RpdmU7XG4gICAgICAgIGJsb2Nrc1tibG9ja19hY3RpdmVdLmFkZChlbGVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRyYXdpbmdfcGFydHMucHVzaChlbGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbTtcbn07XG5cbmRyYXdpbmcubGluZSA9IGZ1bmN0aW9uKHBvaW50cywgbGF5ZXIpeyAvLyAocG9pbnRzLCBbbGF5ZXJdKVxuICAgIC8vcmV0dXJuIGFkZCgnbGluZScsIHBvaW50cywgbGF5ZXIpXG4gICAgdmFyIGxpbmUgPSAgdGhpcy5hZGQoJ2xpbmUnLCBwb2ludHMsIGxheWVyKTtcbiAgICByZXR1cm4gbGluZTtcbn07XG5cbmRyYXdpbmcucmVjdCA9IGZ1bmN0aW9uKGxvYywgc2l6ZSwgbGF5ZXIpe1xuICAgIHZhciByZWMgPSB0aGlzLmFkZCgncmVjdCcsIFtsb2NdLCBsYXllcik7XG4gICAgcmVjLncgPSBzaXplWzBdO1xuICAgIC8qXG4gICAgaWYoIHR5cGVvZiBsYXllcl9uYW1lICE9PSAndW5kZWZpbmVkJyAmJiAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICkge1xuICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSBsYXllcnNbbGF5ZXJfbmFtZV1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiggISAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICl7IGNvbnNvbGUubG9nKFwiZXJyb3IsIGxheWVyIGRvZXMgbm90IGV4aXN0LCB1c2luZyBjdXJyZW50XCIpO31cbiAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gIGxheWVyX2FjdGl2ZVxuICAgIH1cbiAgICAqL1xuICAgIHJlYy5oID0gc2l6ZVsxXTtcbiAgICByZXR1cm4gcmVjO1xufTtcblxuZHJhd2luZy5jaXJjID0gZnVuY3Rpb24obG9jLCBkaWFtZXRlciwgbGF5ZXIpe1xuICAgIHZhciBjaXIgPSB0aGlzLmFkZCgnY2lyYycsIFtsb2NdLCBsYXllcik7XG4gICAgY2lyLmQgPSBkaWFtZXRlcjtcbiAgICByZXR1cm4gY2lyO1xufTtcblxuZHJhd2luZy50ZXh0ID0gZnVuY3Rpb24obG9jLCBzdHJpbmdzLCBmb250LCBsYXllcil7XG4gICAgdmFyIHR4dCA9IHRoaXMuYWRkKCd0ZXh0JywgW2xvY10sIGxheWVyKTtcbiAgICBpZiggdHlwZW9mIHN0cmluZ3MgPT0gJ3N0cmluZycpe1xuICAgICAgICBzdHJpbmdzID0gW3N0cmluZ3NdO1xuICAgIH1cbiAgICB0eHQuc3RyaW5ncyA9IHN0cmluZ3M7XG4gICAgdHh0LmZvbnQgPSBmb250O1xuICAgIHJldHVybiB0eHQ7XG59O1xuXG5kcmF3aW5nLmJsb2NrID0gZnVuY3Rpb24obmFtZSkgey8vIHNldCBjdXJyZW50IGJsb2NrXG4gICAgdmFyIHgseTtcbiAgICBpZiggYXJndW1lbnRzLmxlbmd0aCA9PT0gMiApeyAvLyBpZiBjb29yIGlzIHBhc3NlZFxuICAgICAgICBpZiggdHlwZW9mIGFyZ3VtZW50c1sxXS54ICE9PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgeCA9IGFyZ3VtZW50c1sxXS54O1xuICAgICAgICAgICAgeSA9IGFyZ3VtZW50c1sxXS55O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgeCA9IGFyZ3VtZW50c1sxXVswXTtcbiAgICAgICAgICAgIHkgPSBhcmd1bWVudHNbMV1bMV07XG4gICAgICAgIH1cbiAgICB9IGVsc2UgaWYoIGFyZ3VtZW50cy5sZW5ndGggPT09IDMgKXsgLy8gaWYgeCx5IGlzIHBhc3NlZFxuICAgICAgICB4ID0gYXJndW1lbnRzWzFdO1xuICAgICAgICB5ID0gYXJndW1lbnRzWzJdO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHdoYXQgaWYgYmxvY2sgZG9lcyBub3QgZXhpc3Q/IHByaW50IGxpc3Qgb2YgYmxvY2tzP1xuICAgIHZhciBibGsgPSBPYmplY3QuY3JlYXRlKGJsb2Nrc1tuYW1lXSk7XG4gICAgYmxrLnggPSB4O1xuICAgIGJsay55ID0geTtcblxuICAgIGlmKGJsb2NrX2FjdGl2ZSl7XG4gICAgICAgIGJsb2Nrc1tibG9ja19hY3RpdmVdLmFkZChibGspO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZHJhd2luZ19wYXJ0cy5wdXNoKGJsayk7XG4gICAgfVxuICAgIHJldHVybiBibGs7XG59O1xuXG5cbnZhciBDZWxsID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuYm9yZGVycyA9IHt9O1xuICAgICAgICB0aGlzLmJvcmRlcl9vcHRpb25zLmZvckVhY2goZnVuY3Rpb24oc2lkZSl7XG4gICAgICAgICAgICB0aGlzLmJvcmRlcnNbc2lkZV0gPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cblxuICAgIH0sXG4gICAgYm9yZGVyX29wdGlvbnM6IFsnVCcsICdCJywgJ0wnLCAnUiddLFxuXG4gICAgdGV4dDogZnVuY3Rpb24odGV4dCl7XG4gICAgICAgIHRoaXMuY2VsbF90ZXh0ID0gdGV4dDtcbiAgICB9LFxuICAgIGJvcmRlcnM6IGZ1bmN0aW9uKGJvcmRlcl9zdHJpbmcpe1xuICAgICAgICBib3JkZXJfc3RyaW5nID0gYm9yZGVyX3N0cmluZy50b1VwcGVyQ2FzZSgpLnRyaW0oKTtcbiAgICAgICAgdmFyIGJvcmRlcnM7XG4gICAgICAgIGlmKCBib3JkZXJfc3RyaW5nID09PSAnQUxMJyApe1xuICAgICAgICAgICAgYm9yZGVycyA9IHRoaXMuYm9yZGVyX29wdGlvbnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBib3JkZXJzID0gYm9yZGVyX3N0cmluZy5zcGxpdCgvW1xccyxdKy8pO1xuICAgICAgICB9XG4gICAgICAgIGJvcmRlcnMuZm9yRWFjaChmdW5jdGlvbihzaWRlKXtcbiAgICAgICAgICAgIHRoaXMuYm9yZGVyc1tzaWRlXSA9IHRydWU7XG5cbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxudmFyIFRhYmxlID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKCBudW1fcm93cywgbnVtX2NvbHMgKXtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLm51bV9yb3dzID0gbnVtX3Jvd3M7XG4gICAgICAgIHRoaXMubnVtX2NvbHVtbnMgPSBudW1fY29scztcbiAgICAgICAgdGhpcy5ib3JkZXJzX3Jvd3MgPSBbXTtcbiAgICAgICAgdGhpcy5ib3JkZXJzX2NvbHMgPSBbXTtcbiAgICAgICAgdGhpcy5jZWxsID0gW107XG4gICAgICAgIF8ucmFuZ2UobnVtX2NvbHMrMSkuZm9yRWFjaChmdW5jdGlvbihjKXtcbiAgICAgICAgICAgIHNlbGYuYm9yZGVyc19jb2xzLnB1c2goW10pO1xuICAgICAgICB9KTtcbiAgICAgICAgXy5yYW5nZShudW1fcm93cysxKS5mb3JFYWNoKGZ1bmN0aW9uKGkpe1xuICAgICAgICAgICAgdmFyIHIgPSBpKzE7XG4gICAgICAgICAgICBpZiggaSA8ICBudW1fcm93cykgc2VsZi5jZWxsW3JdID0gW107XG4gICAgICAgICAgICBzZWxmLmJvcmRlcnNfcm93cy5wdXNoKFtdKTtcbiAgICAgICAgICAgIF8ucmFuZ2UobnVtX2NvbHMrMSkuZm9yRWFjaChmdW5jdGlvbihqKXtcbiAgICAgICAgICAgICAgICB2YXIgYyA9IGorMTtcbiAgICAgICAgICAgICAgICBpZiggaSA8ICBudW1fcm93cykgc2VsZi5jZWxsW3JdW2NdID0gT2JqZWN0LmNyZWF0ZShDZWxsKTtcbiAgICAgICAgICAgICAgICBzZWxmLmJvcmRlcnNfcm93c1tyLTFdW2NdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc2VsZi5ib3JkZXJzX2NvbHNbYy0xXVtyXSA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmJvcmRlcnNfcm93c1tudW1fcm93c11bbnVtX2NvbHNdID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYm9yZGVyc19jb2xzW251bV9jb2xzXVtudW1fcm93c10gPSBmYWxzZTtcblxuICAgIH0sXG4gICAgdGV4dDogZnVuY3Rpb24oIFIsIEMgKXtcbiAgICAgICAgXG4gICAgfSxcbiAgICBjZWxsX3NpemU6IGZ1bmN0aW9uKHh5KXtcbiAgICAgICAgdGhpcy5jZWxsX3NpemUgPSB0aGlzLmNlbGxfc2l6ZSB8fCB7fTtcbiAgICAgICAgdGhpcy5jZWxsX3NpemUueCA9IHh5WzBdO1xuICAgICAgICB0aGlzLmNlbGxfc2l6ZS55ID0geHlbMV07XG4gICAgfSxcbiAgICAvKlxuICAgIGFkZF9jZWxsOiBmdW5jdGlvbigpe1xuXG4gICAgfSxcbiAgICBhZGRfcm93czogZnVuY3Rpb24obil7XG4gICAgICAgIHRoaXMubnVtX2NvbG1ucyArPSBuO1xuICAgICAgICB0aGlzLm51bV9yb3dzICs9IG47XG4gICAgICAgIF8ucmFuZ2UobikuZm9yRWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhpcy5yb3dzLnB1c2goW10pO1xuICAgICAgICB9KTtcbiAgICAgICAgXy5yYW5nZShuKS5mb3JFYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGlzLnRleHRfcm93cy5wdXNoKFtdKTtcbiAgICAgICAgfSk7XG5cbiAgICB9LFxuICAgIHRleHQ6IGZ1bmN0aW9uKCBSLCBDLCB0ZXh0KXtcbiAgICAgICAgdGhpcy50ZXh0X3Jvd3NbUl1bQ10gPSB0ZXh0O1xuICAgIH0sXG4gICAgLy8qL1xuICAgIGJvcmRlcjogZnVuY3Rpb24oIFIsIEMsIHRleHQpe1xuICAgICAgICB0aGlzLnRleHRfcm93c1tSXVtDXSA9IHRleHQ7XG4gICAgfSxcblxuXG59O1xuXG5kcmF3aW5nLnRhYmxlID0gZnVuY3Rpb24oIG51bV9yb3dzLCBudW1fY29scyApe1xuICAgIHZhciBuZXdfdGFibGUgPSBPYmplY3QuY3JlYXRlKFRhYmxlKTtcbiAgICBuZXdfdGFibGUuaW5pdCggbnVtX3Jvd3MsIG51bV9jb2xzICk7XG5cbiAgICByZXR1cm4gbmV3X3RhYmxlO1xuXG59O1xuXG5cblxuXG5cblxudmFyIG1rX2RyYXdpbmcgPSBmdW5jdGlvbigpe1xuICAgIHZhciBwYWdlID0gT2JqZWN0LmNyZWF0ZShkcmF3aW5nKTtcbiAgICAvL2NvbnNvbGUubG9nKHBhZ2UpO1xuICAgIHBhZ2UuZHJhd2luZ19wYXJ0cyA9IFtdO1xuICAgIHJldHVybiBwYWdlO1xufTtcblxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gbWtfZHJhd2luZztcbiIsInZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHBhZ2UgMVwiKTtcblxuICAgIGQgPSBta19kcmF3aW5nKCk7XG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmcuc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZy5sb2M7XG5cbiAgICBkLnRleHQoXG4gICAgICAgIFtzaXplLmRyYXdpbmcudy8yLCBzaXplLmRyYXdpbmcuaC8yXSxcbiAgICAgICAgJ1BhZ2UgMScsXG4gICAgICAgICd0aXRsZTInXG4gICAgKTtcblxuICAgIHZhciB0ID0gZC50YWJsZSgzLDUpO1xuICAgIC8vdC5jZWxsKDEsMSkudGV4dCgnY2VsbCAxLDEnKTtcblxuICAgIGNvbnNvbGUubG9nKHQpO1xuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xuXG4vL3ZhciBkcmF3aW5nX3BhcnRzID0gW107XG4vL2QubGlua19kcmF3aW5nX3BhcnRzKGRyYXdpbmdfcGFydHMpO1xuXG52YXIgcGFnZSA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICBjb25zb2xlLmxvZyhcIioqIE1ha2luZyBwYWdlIDJcIik7XG4gICAgZCA9IG1rX2RyYXdpbmcoKTtcblxuICAgIHZhciBmID0gc2V0dGluZ3MuZjtcblxuICAgIC8vdmFyIGNvbXBvbmVudHMgPSBzZXR0aW5ncy5jb21wb25lbnRzO1xuICAgIC8vdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcbiAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nLnNpemU7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmcubG9jO1xuXG5cblxuXG4gICAgdmFyIHgsIHksIGgsIHc7XG4gICAgdmFyIG9mZnNldDtcblxuLy8gRGVmaW5lIGQuYmxvY2tzXG4vLyBtb2R1bGUgZC5ibG9ja1xuICAgIHcgPSBzaXplLm1vZHVsZS5mcmFtZS53O1xuICAgIGggPSBzaXplLm1vZHVsZS5mcmFtZS5oO1xuXG4gICAgZC5ibG9ja19zdGFydCgnbW9kdWxlJyk7XG5cbiAgICAvLyBmcmFtZVxuICAgIGQubGF5ZXIoJ21vZHVsZScpO1xuICAgIGQucmVjdCggWzAsaC8yXSwgW3csaF0gKTtcbiAgICAvLyBmcmFtZSB0cmlhbmdsZT9cbiAgICBkLmxpbmUoW1xuICAgICAgICBbLXcvMiwwXSxcbiAgICAgICAgWzAsdy8yXSxcbiAgICBdKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbMCx3LzJdLFxuICAgICAgICBbdy8yLDBdLFxuICAgIF0pO1xuICAgIC8vIGxlYWRzXG4gICAgZC5sYXllcignRENfcG9zJyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgWzAsIDBdLFxuICAgICAgICBbMCwgLXNpemUubW9kdWxlLmxlYWRdXG4gICAgXSk7XG4gICAgZC5sYXllcignRENfbmVnJyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgWzAsIGhdLFxuICAgICAgICBbMCwgaCsoc2l6ZS5tb2R1bGUubGVhZCldXG4gICAgXSk7XG4gICAgLy8gcG9zIHNpZ25cbiAgICBkLmxheWVyKCd0ZXh0Jyk7XG4gICAgZC50ZXh0KFxuICAgICAgICBbc2l6ZS5tb2R1bGUubGVhZC8yLCAtc2l6ZS5tb2R1bGUubGVhZC8yXSxcbiAgICAgICAgJysnLFxuICAgICAgICAnc2lnbnMnXG4gICAgKTtcbiAgICAvLyBuZWcgc2lnblxuICAgIGQudGV4dChcbiAgICAgICAgW3NpemUubW9kdWxlLmxlYWQvMiwgaCtzaXplLm1vZHVsZS5sZWFkLzJdLFxuICAgICAgICAnLScsXG4gICAgICAgICdzaWducydcbiAgICApO1xuICAgIC8vIGdyb3VuZFxuICAgIGQubGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgIGQubGluZShbXG4gICAgICAgIFstdy8yLCBoLzJdLFxuICAgICAgICBbLXcvMi13LzQsIGgvMl0sXG4gICAgXSk7XG5cbiAgICBkLmxheWVyKCk7XG4gICAgZC5ibG9ja19lbmQoKTtcblxuLy8jc3RyaW5nXG4gICAgZC5ibG9ja19zdGFydCgnc3RyaW5nJyk7XG5cbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcblxuICAgIHkgKz0gc2l6ZS5tb2R1bGUubGVhZDtcblxuICAgIC8vVE9ETzogYWRkIGxvb3AgdG8ganVtcCBvdmVyIG5lZ2F0aXZlIHJldHVybiB3aXJlc1xuICAgIGQubGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LXNpemUubW9kdWxlLmZyYW1lLncqMy80LCB5K3NpemUubW9kdWxlLmZyYW1lLmgvMl0sXG4gICAgICAgIFt4LXNpemUubW9kdWxlLmZyYW1lLncqMy80LCB5K3NpemUuc3RyaW5nLmggKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCAtIHNpemUubW9kdWxlLmxlYWRdLFxuICAgICAgICAvL1t4LXNpemUubW9kdWxlLmZyYW1lLncqMy80LCB5K3NpemUuc3RyaW5nLmggKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgIF0pO1xuICAgIGQubGF5ZXIoKTtcblxuICAgIGQuYmxvY2soJ21vZHVsZScsIFt4LHldKTtcbiAgICB5ICs9IHNpemUubW9kdWxlLmggKyBzaXplLnN0cmluZy5nYXBfbWlzc2luZztcbiAgICBkLmJsb2NrKCdtb2R1bGUnLCBbeCx5XSk7XG4gICAgeSArPSBzaXplLm1vZHVsZS5oICsgc2l6ZS5zdHJpbmcuZ2FwO1xuICAgIGQuYmxvY2soJ21vZHVsZScsIFt4LHldKTtcbiAgICB5ICs9IHNpemUubW9kdWxlLmggKyBzaXplLnN0cmluZy5nYXA7XG4gICAgZC5ibG9jaygnbW9kdWxlJywgW3gseV0pO1xuXG4gICAgZC5ibG9ja19lbmQoKTtcblxuXG4vLyB0ZXJtaW5hbFxuICAgIGQuYmxvY2tfc3RhcnQoJ3Rlcm1pbmFsJyk7XG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG5cbiAgICBkLmxheWVyKCd0ZXJtaW5hbCcpO1xuICAgIGQuY2lyYyhcbiAgICAgICAgW3gseV0sXG4gICAgICAgIHNpemUudGVybWluYWxfZGlhbVxuICAgICk7XG4gICAgZC5sYXllcigpO1xuICAgIGQuYmxvY2tfZW5kKCk7XG5cbi8vIGZ1c2VcblxuICAgIGQuYmxvY2tfc3RhcnQoJ2Z1c2UnKTtcbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcbiAgICB3ID0gMTA7XG4gICAgaCA9IDU7XG5cbiAgICBkLmxheWVyKCd0ZXJtaW5hbCcpO1xuICAgIGQucmVjdChcbiAgICAgICAgW3gseV0sXG4gICAgICAgIFt3LGhdXG4gICAgKTtcbiAgICBkLmxpbmUoIFtcbiAgICAgICAgW3cvMix5XSxcbiAgICAgICAgW3cvMitzaXplLmZ1c2UudywgeV1cbiAgICBdKTtcbiAgICBkLmJsb2NrKCd0ZXJtaW5hbCcsIFtzaXplLmZ1c2UudywgeV0gKTtcblxuICAgIGQubGluZSggW1xuICAgICAgICBbLXcvMix5XSxcbiAgICAgICAgWy13LzItc2l6ZS5mdXNlLncsIHldXG4gICAgXSk7XG4gICAgZC5ibG9jaygndGVybWluYWwnLCBbLXNpemUuZnVzZS53LCB5XSApO1xuXG4gICAgZC5sYXllcigpO1xuICAgIGQuYmxvY2tfZW5kKCk7XG5cbi8vIGdyb3VuZCBzeW1ib2xcbiAgICBkLmJsb2NrX3N0YXJ0KCdncm91bmQnKTtcbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcblxuICAgIGQubGF5ZXIoJ0FDX2dyb3VuZCcpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LHldLFxuICAgICAgICBbeCx5KzQwXSxcbiAgICBdKTtcbiAgICB5ICs9IDI1O1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LTcuNSx5XSxcbiAgICAgICAgW3grNy41LHldLFxuICAgIF0pO1xuICAgIHkgKz0gNTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC01LHldLFxuICAgICAgICBbeCs1LHldLFxuICAgIF0pO1xuICAgIHkgKz0gNTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC0yLjUseV0sXG4gICAgICAgIFt4KzIuNSx5XSxcbiAgICBdKTtcbiAgICBkLmxheWVyKCk7XG5cbiAgICBkLmJsb2NrX2VuZCgpO1xuXG5cblxuXG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gRnJhbWVcbiAgICBkLnNlY3Rpb24oJ0ZyYW1lJyk7XG5cbiAgICB3ID0gc2l6ZS5kcmF3aW5nLnc7XG4gICAgaCA9IHNpemUuZHJhd2luZy5oO1xuICAgIHZhciBwYWRkaW5nID0gc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmc7XG5cbiAgICBkLmxheWVyKCdmcmFtZScpO1xuXG4gICAgLy9ib3JkZXJcbiAgICBkLnJlY3QoIFt3LzIgLCBoLzJdLCBbdyAtIHBhZGRpbmcqMiwgaCAtIHBhZGRpbmcqMiBdICk7XG5cbiAgICB4ID0gdyAtIHBhZGRpbmcgKiAzO1xuICAgIHkgPSBwYWRkaW5nICogMztcblxuICAgIHcgPSBzaXplLmRyYXdpbmcudGl0bGVib3g7XG4gICAgaCA9IHNpemUuZHJhd2luZy50aXRsZWJveDtcblxuICAgIC8vIGJveCB0b3AtcmlnaHRcbiAgICBkLnJlY3QoIFt4LXcvMiwgeStoLzJdLCBbdyxoXSApO1xuXG4gICAgeSArPSBoICsgcGFkZGluZztcblxuICAgIHcgPSBzaXplLmRyYXdpbmcudGl0bGVib3g7XG4gICAgaCA9IHNpemUuZHJhd2luZy5oIC0gcGFkZGluZyo4IC0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94KjIuNTtcblxuICAgIC8vdGl0bGUgYm94XG4gICAgZC5yZWN0KCBbeC13LzIsIHkraC8yXSwgW3csaF0gKTtcblxuICAgIHZhciB0aXRsZSA9IHt9O1xuICAgIHRpdGxlLnRvcCA9IHk7XG4gICAgdGl0bGUuYm90dG9tID0geStoO1xuICAgIHRpdGxlLnJpZ2h0ID0geDtcbiAgICB0aXRsZS5sZWZ0ID0geC13IDtcblxuXG4gICAgLy8gYm94IGJvdHRvbS1yaWdodFxuICAgIGggPSBzaXplLmRyYXdpbmcudGl0bGVib3ggKiAxLjU7XG4gICAgeSA9IHRpdGxlLmJvdHRvbSArIHBhZGRpbmc7XG4gICAgZC5yZWN0KCBbeC13LzIsIHkraC8yXSwgW3csaF0gKTtcblxuICAgIHZhciBwYWdlID0ge307XG4gICAgcGFnZS5yaWdodCA9IHRpdGxlLnJpZ2h0O1xuICAgIHBhZ2UubGVmdCA9IHRpdGxlLmxlZnQ7XG4gICAgcGFnZS50b3AgPSB0aXRsZS5ib3R0b20gKyBwYWRkaW5nO1xuICAgIHBhZ2UuYm90dG9tID0gcGFnZS50b3AgKyBzaXplLmRyYXdpbmcudGl0bGVib3gqMS41O1xuICAgIC8vIGQudGV4dFxuXG4gICAgeCA9IHRpdGxlLmxlZnQgKyBwYWRkaW5nO1xuICAgIHkgPSB0aXRsZS5ib3R0b20gLSBwYWRkaW5nO1xuXG4gICAgeCArPSAxMDtcbiAgICBkLnRleHQoW3gseV0sXG4gICAgICAgICBbIHN5c3RlbS5pbnZlcnRlci5tYWtlICsgXCIgXCIgKyBzeXN0ZW0uaW52ZXJ0ZXIubW9kZWwgKyBcIiBJbnZlcnRlciBTeXN0ZW1cIiBdLFxuICAgICAgICAndGl0bGUxJywgJ3RleHQnKS5yb3RhdGUoLTkwKTtcblxuICAgIHggKz0gMTQ7XG4gICAgaWYoIHN5c3RlbS5tb2R1bGUuc3BlY3MgIT09IHVuZGVmaW5lZCAmJiBzeXN0ZW0ubW9kdWxlLnNwZWNzICE9PSBudWxsICApe1xuICAgICAgICBkLnRleHQoW3gseV0sIFtcbiAgICAgICAgICAgIHN5c3RlbS5tb2R1bGUubWFrZSArIFwiIFwiICsgc3lzdGVtLm1vZHVsZS5tb2RlbCArXG4gICAgICAgICAgICAgICAgXCIgKFwiICsgc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzICArIFwiIHN0cmluZ3Mgb2YgXCIgKyBzeXN0ZW0uYXJyYXkubnVtX21vZHVsZXMgKyBcIiBtb2R1bGVzIClcIlxuICAgICAgICBdLCAndGl0bGUyJywgJ3RleHQnKS5yb3RhdGUoLTkwKTtcbiAgICB9XG5cbiAgICB4ID0gcGFnZS5sZWZ0ICsgcGFkZGluZztcbiAgICB5ID0gcGFnZS50b3AgKyBwYWRkaW5nO1xuICAgIHkgKz0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94ICogMS41ICogMy80O1xuXG5cbiAgICBkLnRleHQoW3gseV0sXG4gICAgICAgIFsnUFYxJ10sXG4gICAgICAgICdwYWdlJywgJ3RleHQnKTtcblxuXG5cblxuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vI2FycmF5XG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdtb2R1bGUnKSAmJiBmLnNlY3Rpb25fZGVmaW5lZCgnYXJyYXknKSApe1xuICAgICAgICBkLnNlY3Rpb24oJ2FycmF5Jyk7XG5cbiAgICAgICAgY29uc29sZS5sb2coXCJEcmF3aW5nOiBhZGRpbmcgYXJyYXlcIik7XG5cbiAgICAgICAgeCA9IGxvYy5hcnJheS5yaWdodCAtIHNpemUuc3RyaW5nLnc7XG4gICAgICAgIHkgPSBsb2MuYXJyYXkueTtcbiAgICAgICAgeSAtPSBzaXplLnN0cmluZy5oLzI7XG5cblxuICAgICAgICAvL2ZvciggdmFyIGk9MDsgaTxzeXN0ZW0uREMuc3RyaW5nX251bTsgaSsrICkge1xuICAgICAgICBmb3IoIHZhciBpIGluIF8ucmFuZ2Uoc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzKSkge1xuICAgICAgICAgICAgLy92YXIgb2Zmc2V0ID0gaSAqIHNpemUud2lyZV9vZmZzZXQuYmFzZVxuICAgICAgICAgICAgdmFyIG9mZnNldF93aXJlID0gc2l6ZS53aXJlX29mZnNldC5taW4gKyAoIHNpemUud2lyZV9vZmZzZXQuYmFzZSAqIGkgKTtcblxuICAgICAgICAgICAgZC5ibG9jaygnc3RyaW5nJywgW3gseV0pO1xuICAgICAgICAgICAgLy8gcG9zaXRpdmUgaG9tZSBydW5cbiAgICAgICAgICAgIGQubGF5ZXIoJ0RDX3BvcycpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHggLCBsb2MuYXJyYXkudXBwZXIgXSxcbiAgICAgICAgICAgICAgICBbIHggLCBsb2MuYXJyYXkudXBwZXItb2Zmc2V0X3dpcmUgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtvZmZzZXRfd2lyZSAsIGxvYy5hcnJheS51cHBlci1vZmZzZXRfd2lyZSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K29mZnNldF93aXJlICwgbG9jLmFycmF5Lnktb2Zmc2V0X3dpcmVdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmFycmF5LnggLCBsb2MuYXJyYXkueS1vZmZzZXRfd2lyZV0sXG4gICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgLy8gbmVnYXRpdmUgaG9tZSBydW5cbiAgICAgICAgICAgIGQubGF5ZXIoJ0RDX25lZycpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHggLCBsb2MuYXJyYXkubG93ZXIgXSxcbiAgICAgICAgICAgICAgICBbIHggLCBsb2MuYXJyYXkubG93ZXIrb2Zmc2V0X3dpcmUgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtvZmZzZXRfd2lyZSAsIGxvYy5hcnJheS5sb3dlcitvZmZzZXRfd2lyZSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K29mZnNldF93aXJlICwgbG9jLmFycmF5Lnkrb2Zmc2V0X3dpcmVdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmFycmF5LnggLCBsb2MuYXJyYXkueStvZmZzZXRfd2lyZV0sXG4gICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgeCAtPSBzaXplLnN0cmluZy53O1xuICAgICAgICB9XG5cbiAgICAvLyAgICBkLnJlY3QoXG4gICAgLy8gICAgICAgIFsgKGxvYy5hcnJheS5yaWdodCtsb2MuYXJyYXkubGVmdCkvMiwgKGxvYy5hcnJheS5sb3dlcitsb2MuYXJyYXkudXBwZXIpLzIgXSxcbiAgICAvLyAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQtbG9jLmFycmF5LmxlZnQsIGxvYy5hcnJheS5sb3dlci1sb2MuYXJyYXkudXBwZXIgXSxcbiAgICAvLyAgICAgICAgJ0RDX3BvcycpO1xuICAgIC8vXG5cbiAgICAgICAgZC5sYXllcignRENfZ3JvdW5kJyk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAvL1sgbG9jLmFycmF5LmxlZnQgLCBsb2MuYXJyYXkubG93ZXIgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICAgICAgWyBsb2MuYXJyYXkubGVmdCwgbG9jLmFycmF5Lmxvd2VyICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kICwgbG9jLmFycmF5Lmxvd2VyICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kICwgbG9jLmFycmF5LnkgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZF0sXG4gICAgICAgICAgICBbIGxvYy5hcnJheS54ICwgbG9jLmFycmF5Lnkrc2l6ZS53aXJlX29mZnNldC5ncm91bmRdLFxuICAgICAgICBdKTtcblxuICAgICAgICBkLmxheWVyKCk7XG5cblxuICAgIH0vLyBlbHNlIHsgY29uc29sZS5sb2coXCJEcmF3aW5nOiBhcnJheSBub3QgcmVhZHlcIil9XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIGNvbWJpbmVyIGJveFxuXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKCdEQycpICl7XG5cbiAgICAgICAgZC5zZWN0aW9uKFwiY29tYmluZXJcIik7XG5cbiAgICAgICAgeCA9IGxvYy5qYl9ib3gueDtcbiAgICAgICAgeSA9IGxvYy5qYl9ib3gueTtcblxuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbeCx5XSxcbiAgICAgICAgICAgIFtzaXplLmpiX2JveC53LHNpemUuamJfYm94LmhdLFxuICAgICAgICAgICAgJ2JveCdcbiAgICAgICAgKTtcblxuICAgICAgICB4ID0gbG9jLmFycmF5Lng7XG4gICAgICAgIHkgPSBsb2MuYXJyYXkueTtcblxuICAgICAgICBmb3IoIHZhciBpIGluIF8ucmFuZ2Uoc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzKSkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5taW4gKyAoIHNpemUud2lyZV9vZmZzZXQuYmFzZSAqIGkgKTtcblxuICAgICAgICAgICAgZC5sYXllcignRENfcG9zJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCAsIHktb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIHgrKHNpemUuamJfYm94LncpLzIgLCB5LW9mZnNldF0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgICAgICB4OiB4KyhzaXplLmpiX2JveC53KS8yLFxuICAgICAgICAgICAgICAgIHk6IHktb2Zmc2V0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCsoc2l6ZS5qYl9ib3gudykvMiAsIHktb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngtb2Zmc2V0ICwgeS1vZmZzZXRdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueC1vZmZzZXQgLCBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngtb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgICAgICB4OiBsb2MuZGlzY2JveC54LW9mZnNldCxcbiAgICAgICAgICAgICAgICB5OiBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZC5sYXllcignRENfbmVnJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCwgeStvZmZzZXRdLFxuICAgICAgICAgICAgICAgIFsgeCtzaXplLmpiX2JveC53LzItc2l6ZS5mdXNlLncvMiAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgZC5ibG9jayggJ2Z1c2UnLCB7XG4gICAgICAgICAgICAgICAgeDogeCtzaXplLmpiX2JveC53LzIgLFxuICAgICAgICAgICAgICAgIHk6IHkrb2Zmc2V0LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCtzaXplLmpiX2JveC53LzIrc2l6ZS5mdXNlLncvMiAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgeStvZmZzZXRdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueCtvZmZzZXQgLCBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgICAgICB4OiBsb2MuZGlzY2JveC54K29mZnNldCxcbiAgICAgICAgICAgICAgICB5OiBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGQubGF5ZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vZC5sYXllcignRENfZ3JvdW5kJyk7XG4gICAgICAgIC8vZC5saW5lKFtcbiAgICAgICAgLy8gICAgWyBsb2MuYXJyYXkubGVmdCAsIGxvYy5hcnJheS5sb3dlciArIHNpemUubW9kdWxlLncgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICAvLyAgICBbIGxvYy5hcnJheS5yaWdodCtzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCAsIGxvYy5hcnJheS5sb3dlciArIHNpemUubW9kdWxlLncgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICAvLyAgICBbIGxvYy5hcnJheS5yaWdodCtzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCAsIGxvYy5hcnJheS55ICsgc2l6ZS5tb2R1bGUudyArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAgICAgLy8gICAgWyBsb2MuYXJyYXkueCAsIGxvYy5hcnJheS55K3NpemUubW9kdWxlLncrc2l6ZS53aXJlX29mZnNldC5ncm91bmRdLFxuICAgICAgICAvL10pO1xuXG4gICAgICAgIC8vZC5sYXllcigpO1xuXG4gICAgICAgIC8vIEdyb3VuZFxuICAgICAgICAvL29mZnNldCA9IHNpemUud2lyZV9vZmZzZXQuZ2FwICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQ7XG4gICAgICAgIG9mZnNldCA9IHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kO1xuXG4gICAgICAgIGQubGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgWyB4ICwgeStvZmZzZXRdLFxuICAgICAgICAgICAgWyB4KyhzaXplLmpiX2JveC53KS8yICwgeStvZmZzZXRdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgeDogeCsoc2l6ZS5qYl9ib3gudykvMixcbiAgICAgICAgICAgIHk6IHkrb2Zmc2V0LFxuICAgICAgICB9KTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFsgeCsoc2l6ZS5qYl9ib3gudykvMiAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgIFsgbG9jLmRpc2Nib3gueCtvZmZzZXQgLCB5K29mZnNldF0sXG4gICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbV0sXG4gICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICB4OiBsb2MuZGlzY2JveC54K29mZnNldCxcbiAgICAgICAgICAgIHk6IGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW1cbiAgICAgICAgfSk7XG4gICAgICAgIGQubGF5ZXIoKTtcblxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgICAgICAvLyBEQyBkaXNjb25lY3RcbiAgICAgICAgZC5zZWN0aW9uKFwiREMgZGljb25lY3RcIik7XG5cblxuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbbG9jLmRpc2Nib3gueCwgbG9jLmRpc2Nib3gueV0sXG4gICAgICAgICAgICBbc2l6ZS5kaXNjYm94Lncsc2l6ZS5kaXNjYm94LmhdLFxuICAgICAgICAgICAgJ2JveCdcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBEQyBkaXNjb25lY3QgY29tYmluZXIgZC5saW5lc1xuXG4gICAgICAgIHggPSBsb2MuZGlzY2JveC54O1xuICAgICAgICB5ID0gbG9jLmRpc2Nib3gueSArIHNpemUuZGlzY2JveC5oLzI7XG5cbiAgICAgICAgaWYoIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyA+IDEpe1xuICAgICAgICAgICAgdmFyIG9mZnNldF9taW4gPSBzaXplLndpcmVfb2Zmc2V0Lm1pbjtcbiAgICAgICAgICAgIHZhciBvZmZzZXRfbWF4ID0gc2l6ZS53aXJlX29mZnNldC5taW4gKyAoIChzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgLTEpICogc2l6ZS53aXJlX29mZnNldC5iYXNlICk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeC1vZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICAgICAgWyB4LW9mZnNldF9tYXgsIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIF0sICdEQ19wb3MnKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4K29mZnNldF9taW4sIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgICAgICBbIHgrb2Zmc2V0X21heCwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgXSwgJ0RDX25lZycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW52ZXJ0ZXIgY29uZWN0aW9uXG4gICAgICAgIC8vZC5saW5lKFtcbiAgICAgICAgLy8gICAgWyB4LW9mZnNldF9taW4sIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgLy8gICAgWyB4LW9mZnNldF9taW4sIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgLy9dLCdEQ19wb3MnKTtcblxuICAgICAgICAvL29mZnNldCA9IG9mZnNldF9tYXggLSBvZmZzZXRfbWluO1xuICAgICAgICBvZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0Lm1pbjtcblxuICAgICAgICAvLyBuZWdcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFsgeCtvZmZzZXQsIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIFsgeCtvZmZzZXQsIGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSBdLFxuICAgICAgICBdLCdEQ19uZWcnKTtcbiAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgeDogeCtvZmZzZXQsXG4gICAgICAgICAgICB5OiBsb2MuaW52ZXJ0ZXIueStzaXplLmludmVydGVyLmgvMi1zaXplLnRlcm1pbmFsX2RpYW0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHBvc1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgWyB4LW9mZnNldCwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgWyB4LW9mZnNldCwgbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtIF0sXG4gICAgICAgIF0sJ0RDX3BvcycpO1xuICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICB4OiB4LW9mZnNldCxcbiAgICAgICAgICAgIHk6IGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZ3JvdW5kXG4gICAgICAgIC8vb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5nYXAgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZDtcbiAgICAgICAgb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5ncm91bmQ7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbIHgrb2Zmc2V0LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBbIHgrb2Zmc2V0LCBsb2MuaW52ZXJ0ZXIueStzaXplLmludmVydGVyLmgvMi1zaXplLnRlcm1pbmFsX2RpYW0gXSxcbiAgICAgICAgXSwnRENfZ3JvdW5kJyk7XG4gICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgIHg6IHgrb2Zmc2V0LFxuICAgICAgICAgICAgeTogbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtLFxuICAgICAgICB9KTtcblxuICAgIH1cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8jaW52ZXJ0ZXJcbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoJ2ludmVydGVyJykgKXtcblxuICAgICAgICBkLnNlY3Rpb24oXCJpbnZlcnRlclwiKTtcblxuXG4gICAgICAgIHggPSBsb2MuaW52ZXJ0ZXIueDtcbiAgICAgICAgeSA9IGxvYy5pbnZlcnRlci55O1xuXG5cbiAgICAgICAgLy9mcmFtZVxuICAgICAgICBkLmxheWVyKCdib3gnKTtcbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW3gseV0sXG4gICAgICAgICAgICBbc2l6ZS5pbnZlcnRlci53LCBzaXplLmludmVydGVyLmhdXG4gICAgICAgICk7XG4gICAgICAgIC8vIExhYmVsIGF0IHRvcCAoSW52ZXJ0ZXIsIG1ha2UsIG1vZGVsLCAuLi4pXG4gICAgICAgIGQubGF5ZXIoJ3RleHQnKTtcbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgW2xvYy5pbnZlcnRlci54LCBsb2MuaW52ZXJ0ZXIudG9wICsgc2l6ZS5pbnZlcnRlci50ZXh0X2dhcCBdLFxuICAgICAgICAgICAgWyAnSW52ZXJ0ZXInLCBzZXR0aW5ncy5zeXN0ZW0uaW52ZXJ0ZXIubWFrZSArIFwiIFwiICsgc2V0dGluZ3Muc3lzdGVtLmludmVydGVyLm1vZGVsIF0sXG4gICAgICAgICAgICAnbGFiZWwnXG4gICAgICAgICk7XG4gICAgICAgIGQubGF5ZXIoKTtcblxuICAgIC8vI2ludmVydGVyIHN5bWJvbFxuICAgICAgICBkLnNlY3Rpb24oXCJpbnZlcnRlciBzeW1ib2xcIik7XG5cbiAgICAgICAgeCA9IGxvYy5pbnZlcnRlci54O1xuICAgICAgICB5ID0gbG9jLmludmVydGVyLnk7XG5cbiAgICAgICAgdyA9IHNpemUuaW52ZXJ0ZXIuc3ltYm9sX3c7XG4gICAgICAgIGggPSBzaXplLmludmVydGVyLnN5bWJvbF9oO1xuXG4gICAgICAgIHZhciBzcGFjZSA9IHcqMS8xMjtcblxuICAgICAgICAvLyBJbnZlcnRlciBzeW1ib2xcbiAgICAgICAgZC5sYXllcignYm94Jyk7XG5cbiAgICAgICAgLy8gYm94XG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFt4LHldLFxuICAgICAgICAgICAgW3csIGhdXG4gICAgICAgICk7XG4gICAgICAgIC8vIGRpYWdhbmFsXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeC13LzIsIHkraC8yXSxcbiAgICAgICAgICAgIFt4K3cvMiwgeS1oLzJdLFxuXG4gICAgICAgIF0pO1xuICAgICAgICAvLyBEQ1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSxcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2VdLFxuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSo2LFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZV0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSxcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlKjIsXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlKjJdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqMyxcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlKjQsXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlKjJdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNSxcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlKjYsXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlKjJdLFxuICAgICAgICBdKTtcblxuICAgICAgICAvLyBBQ1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSxcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqMixcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjMsXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjQsXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSo1LFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSo2LFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5sYXllcigpO1xuXG5cblxuXG5cbiAgICB9XG5cblxuXG5cblxuLy8jQUNfZGlzY2NvbmVjdFxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZCgnQUMnKSApe1xuICAgICAgICBkLnNlY3Rpb24oXCJBQ19kaXNjY29uZWN0XCIpO1xuXG4gICAgICAgIHggPSBsb2MuQUNfZGlzYy54O1xuICAgICAgICB5ID0gbG9jLkFDX2Rpc2MueTtcbiAgICAgICAgcGFkZGluZyA9IHNpemUudGVybWluYWxfZGlhbTtcblxuICAgICAgICBkLmxheWVyKCdib3gnKTtcbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW3gsIHldLFxuICAgICAgICAgICAgW3NpemUuQUNfZGlzYy53LCBzaXplLkFDX2Rpc2MuaF1cbiAgICAgICAgKTtcbiAgICAgICAgZC5sYXllcigpO1xuXG5cbiAgICAvL2QuY2lyYyhbeCx5XSw1KTtcblxuXG5cbiAgICAvLyNBQyBsb2FkIGNlbnRlclxuICAgICAgICBkLnNlY3Rpb24oXCJBQyBsb2FkIGNlbnRlclwiKTtcblxuICAgICAgICB2YXIgYnJlYWtlcl9zcGFjaW5nID0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnNwYWNpbmc7XG5cbiAgICAgICAgeCA9IGxvYy5BQ19sb2FkY2VudGVyLng7XG4gICAgICAgIHkgPSBsb2MuQUNfbG9hZGNlbnRlci55O1xuICAgICAgICB3ID0gc2l6ZS5BQ19sb2FkY2VudGVyLnc7XG4gICAgICAgIGggPSBzaXplLkFDX2xvYWRjZW50ZXIuaDtcblxuICAgICAgICBkLnJlY3QoW3gseV0sXG4gICAgICAgICAgICBbdyxoXSxcbiAgICAgICAgICAgICdib3gnXG4gICAgICAgICk7XG5cbiAgICAgICAgZC50ZXh0KFt4LHktaCowLjRdLFxuICAgICAgICAgICAgW3N5c3RlbS5BQy5sb2FkY2VudGVyX3R5cGVzLCAnTG9hZCBDZW50ZXInXSxcbiAgICAgICAgICAgICdsYWJlbCcsXG4gICAgICAgICAgICAndGV4dCdcbiAgICAgICAgKTtcbiAgICAgICAgdyA9IHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyLnc7XG4gICAgICAgIGggPSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci5oO1xuXG4gICAgICAgIHBhZGRpbmcgPSBsb2MuQUNfbG9hZGNlbnRlci54IC0gbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMubGVmdCAtIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyLnc7XG5cbiAgICAgICAgeSA9IGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnRvcDtcbiAgICAgICAgeSArPSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMuc3BhY2luZy8yO1xuICAgICAgICBmb3IoIHZhciBpPTA7IGk8c2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLm51bTsgaSsrKXtcbiAgICAgICAgICAgIGQucmVjdChbeC1wYWRkaW5nLXcvMix5XSxbdyxoXSwnYm94Jyk7XG4gICAgICAgICAgICBkLnJlY3QoW3grcGFkZGluZyt3LzIseV0sW3csaF0sJ2JveCcpO1xuICAgICAgICAgICAgeSArPSBicmVha2VyX3NwYWNpbmc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcywgbDtcblxuICAgICAgICBsID0gbG9jLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhcjtcbiAgICAgICAgcyA9IHNpemUuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyO1xuICAgICAgICBkLnJlY3QoW2wueCxsLnldLCBbcy53LHMuaF0sICdBQ19uZXV0cmFsJyApO1xuXG4gICAgICAgIGwgPSBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXI7XG4gICAgICAgIHMgPSBzaXplLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyO1xuICAgICAgICBkLnJlY3QoW2wueCxsLnldLCBbcy53LHMuaF0sICdBQ19ncm91bmQnICk7XG5cbiAgICAgICAgZC5ibG9jaygnZ3JvdW5kJywgW2wueCxsLnkrcy5oLzJdKTtcblxuXG5cbiAgICAvLyBBQyBkLmxpbmVzXG4gICAgICAgIGQuc2VjdGlvbihcIkFDIGQubGluZXNcIik7XG5cbiAgICAgICAgeCA9IGxvYy5pbnZlcnRlci5ib3R0b21fcmlnaHQueDtcbiAgICAgICAgeSA9IGxvYy5pbnZlcnRlci5ib3R0b21fcmlnaHQueTtcbiAgICAgICAgeCAtPSBzaXplLnRlcm1pbmFsX2RpYW0gKiAoc3lzdGVtLkFDLm51bV9jb25kdWN0b3JzKzEpO1xuICAgICAgICB5IC09IHNpemUudGVybWluYWxfZGlhbTtcblxuICAgICAgICB2YXIgY29uZHVpdF95ID0gbG9jLkFDX2NvbmR1aXQueTtcbiAgICAgICAgcGFkZGluZyA9IHNpemUudGVybWluYWxfZGlhbTtcbiAgICAgICAgLy92YXIgQUNfZC5sYXllcl9uYW1lcyA9IFsnQUNfZ3JvdW5kJywgJ0FDX25ldXRyYWwnLCAnQUNfTDEnLCAnQUNfTDInLCAnQUNfTDInXTtcblxuICAgICAgICBmb3IoIHZhciBpPTA7IGkgPCBzeXN0ZW0uQUMubnVtX2NvbmR1Y3RvcnM7IGkrKyApe1xuICAgICAgICAgICAgZC5ibG9jaygndGVybWluYWwnLCBbeCx5XSApO1xuICAgICAgICAgICAgZC5sYXllcignQUNfJytzeXN0ZW0uQUMuY29uZHVjdG9yc1tpXSk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFt4LCB5XSxcbiAgICAgICAgICAgICAgICBbeCwgbG9jLkFDX2Rpc2MuYm90dG9tIC0gcGFkZGluZyoyIC0gcGFkZGluZyppICBdLFxuICAgICAgICAgICAgICAgIFtsb2MuQUNfZGlzYy5sZWZ0LCBsb2MuQUNfZGlzYy5ib3R0b20gLSBwYWRkaW5nKjIgLSBwYWRkaW5nKmkgXSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgeCArPSBzaXplLnRlcm1pbmFsX2RpYW07XG4gICAgICAgIH1cbiAgICAgICAgZC5sYXllcigpO1xuXG4gICAgICAgIHggPSBsb2MuQUNfZGlzYy54O1xuICAgICAgICB5ID0gbG9jLkFDX2Rpc2MueSArIHNpemUuQUNfZGlzYy5oLzI7XG4gICAgICAgIHkgLT0gcGFkZGluZyoyO1xuXG4gICAgICAgIGlmKCBzeXN0ZW0uQUMuY29uZHVjdG9ycy5pbmRleE9mKCdncm91bmQnKSsxICkge1xuICAgICAgICAgICAgZC5sYXllcignQUNfZ3JvdW5kJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeC1zaXplLkFDX2Rpc2Mudy8yLCB5IF0sXG4gICAgICAgICAgICAgICAgWyB4K3NpemUuQUNfZGlzYy53LzIrcGFkZGluZyoyLCB5IF0sXG4gICAgICAgICAgICAgICAgWyB4K3NpemUuQUNfZGlzYy53LzIrcGFkZGluZyoyLCBjb25kdWl0X3kgKyBicmVha2VyX3NwYWNpbmcqMiBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIubGVmdCtwYWRkaW5nKjIsIGNvbmR1aXRfeSArIGJyZWFrZXJfc3BhY2luZyoyIF0sXG4gICAgICAgICAgICAgICAgLy9bIGxvYy5BQ19sb2FkY2VudGVyLmxlZnQrcGFkZGluZyoyLCB5IF0sXG4gICAgICAgICAgICAgICAgLy9bIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci54LXBhZGRpbmcsIHkgXSxcbiAgICAgICAgICAgICAgICAvL1sgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLngtcGFkZGluZywgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLnkrc2l6ZS5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci5oLzIgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLmxlZnQrcGFkZGluZyoyLCBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLngtc2l6ZS5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci53LzIsIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci55IF0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCBzeXN0ZW0uQUMuY29uZHVjdG9ycy5pbmRleE9mKCduZXV0cmFsJykrMSApIHtcbiAgICAgICAgICAgIHkgLT0gcGFkZGluZztcbiAgICAgICAgICAgIGQubGF5ZXIoJ0FDX25ldXRyYWwnKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4LXNpemUuQUNfZGlzYy53LzIsIHkgXSxcbiAgICAgICAgICAgICAgICBbIHgrcGFkZGluZyozKjIsIHkgXSxcbiAgICAgICAgICAgICAgICBbIHgrcGFkZGluZyozKjIsIGNvbmR1aXRfeSArIGJyZWFrZXJfc3BhY2luZyoxIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyLngsIGNvbmR1aXRfeSArIGJyZWFrZXJfc3BhY2luZyoxIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyLngsXG4gICAgICAgICAgICAgICAgICAgIGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIueS1zaXplLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhci5oLzIgXSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9XG5cblxuXG4gICAgICAgIGZvciggdmFyIGk9MTsgaSA8PSAzOyBpKysgKSB7XG4gICAgICAgICAgICBpZiggc3lzdGVtLkFDLmNvbmR1Y3RvcnMuaW5kZXhPZignTCcraSkrMSApIHtcbiAgICAgICAgICAgICAgICB5IC09IHBhZGRpbmc7XG4gICAgICAgICAgICAgICAgZC5sYXllcignQUNfTCcraSk7XG4gICAgICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgWyB4LXNpemUuQUNfZGlzYy53LzIsIHkgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB4K3BhZGRpbmcqMyooMi1pKSwgeSBdLFxuICAgICAgICAgICAgICAgICAgICBbIHgrcGFkZGluZyozKigyLWkpLCBsb2MuQUNfZGlzYy5zd2l0Y2hfYm90dG9tIF0sXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgZC5ibG9jaygndGVybWluYWwnLCBbIHgtcGFkZGluZyooaS0yKSozLCBsb2MuQUNfZGlzYy5zd2l0Y2hfYm90dG9tIF0gKTtcbiAgICAgICAgICAgICAgICBkLmJsb2NrKCd0ZXJtaW5hbCcsIFsgeC1wYWRkaW5nKihpLTIpKjMsIGxvYy5BQ19kaXNjLnN3aXRjaF90b3AgXSApO1xuICAgICAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFsgeC1wYWRkaW5nKihpLTIpKjMsIGxvYy5BQ19kaXNjLnN3aXRjaF90b3AgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB4LXBhZGRpbmcqKGktMikqMywgY29uZHVpdF95LWJyZWFrZXJfc3BhY2luZyooaS0xKSBdLFxuICAgICAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLmxlZnQsIGNvbmR1aXRfeS1icmVha2VyX3NwYWNpbmcqKGktMSkgXSxcbiAgICAgICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuXG5cbiAgICB9XG5cblxuXG5cbi8vIFdpcmUgdGFibGVcbiAgICBkLnNlY3Rpb24oXCJXaXJlIHRhYmxlXCIpO1xuXG4gICAgeCA9IGxvYy53aXJlX3RhYmxlLng7XG4gICAgeSA9IGxvYy53aXJlX3RhYmxlLnk7XG4gICAgdyA9IHNpemUud2lyZV90YWJsZS53O1xuICAgIGggPSBzaXplLndpcmVfdGFibGUuaDtcbiAgICB2YXIgcm93X2ggPSBzaXplLndpcmVfdGFibGUucm93X2g7XG4gICAgdmFyIHRvcCA9IGxvYy53aXJlX3RhYmxlLnRvcDtcbiAgICB2YXIgYm90dG9tID0gbG9jLndpcmVfdGFibGUuYm90dG9tO1xuICAgIHZhciBjb2x1bW5fd2lkdGggPSB7XG4gICAgICAgIG51bWJlcjogMjUsXG4gICAgICAgIHdpcmVfZ2F1Z2U6IDI1LFxuICAgICAgICB3aXJlX3R5cGU6IDUwLFxuICAgICAgICBjb25kdWl0X2dhdWdlOiAyNSxcbiAgICAgICAgY29uZHVpdF90eXBlOiA1MCxcbiAgICB9O1xuXG4gICAgZC5sYXllcigndGFibGUnKTtcbiAgICBkLnJlY3QoIFt4LHldLCBbdyxoXSApO1xuXG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gtdy8yKzI1ICwgeS1oLzIrKDEqcm93X2gpXSxcbiAgICAgICAgW3grdy8yICwgeS1oLzIrKDEqcm93X2gpXSxcbiAgICBdKTtcblxuICAgIGZvciggdmFyIHI9MjsgcjxzeXN0ZW0uQUMubnVtX2NvbmR1Y3RvcnMrMzsgcisrICkge1xuXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeC13LzIgLCB5LWgvMisocipyb3dfaCldLFxuICAgICAgICAgICAgW3grdy8yICwgeS1oLzIrKHIqcm93X2gpXSxcbiAgICAgICAgXSk7XG4gICAgfVxuICAgIHggPSBsb2Mud2lyZV90YWJsZS54IC0gdy8yO1xuICAgIHkgPSBsb2Mud2lyZV90YWJsZS55IC0gaC8yO1xuICAgIHggKz0gY29sdW1uX3dpZHRoLm51bWJlcjtcblxuICAgIHZhciBjX3cgPSBjb2x1bW5fd2lkdGgud2lyZV9nYXVnZTtcbiAgICBkLmxpbmUoWyBbeCx0b3BdLCBbeCxib3R0b20tcm93X2hdIF0pO1xuICAgIGQudGV4dCggW3grY193LHkrcm93X2gqMC43NV0sICdXaXJlJywgJ3RhYmxlJywgJ3RleHQnKTtcbiAgICBkLnRleHQoIFt4K2Nfdy8yLHkrcm93X2gqMS43NV0sICdBV0cnLCAndGFibGUnLCAndGV4dCcpO1xuICAgIHggKz0gY193O1xuXG4gICAgY193ID0gY29sdW1uX3dpZHRoLndpcmVfdHlwZTtcbiAgICBkLmxpbmUoWyBbeCx0b3Arcm93X2hdLCBbeCxib3R0b20tcm93X2hdIF0pO1xuICAgIGQudGV4dCggW3grY193LzIseStyb3dfaCoxLjc1XSwgJ1R5cGUnLCAndGFibGUnLCAndGV4dCcpO1xuICAgIHggKz0gY193O1xuXG4gICAgY193ID0gY29sdW1uX3dpZHRoLmNvbmR1aXRfZ2F1Z2U7XG4gICAgZC5saW5lKFsgW3gsdG9wXSwgW3gsYm90dG9tLXJvd19oXSBdKTtcbiAgICBkLnRleHQoIFt4K2Nfdyx5K3Jvd19oKjAuNzVdLCAnQ29uZHVpdCcsICd0YWJsZScsICd0ZXh0Jyk7XG4gICAgZC50ZXh0KCBbeCtjX3cvMix5K3Jvd19oKjEuNzVdLCAnU2l6ZScsICd0YWJsZScsICd0ZXh0Jyk7XG4gICAgeCArPSBjX3c7XG5cbiAgICBkLmxpbmUoWyBbeCx0b3Arcm93X2hdLCBbeCxib3R0b20tcm93X2hdIF0pO1xuICAgIGQudGV4dCggW3grY193LzIseStyb3dfaCoxLjc1XSwgJ1R5cGUnLCAndGFibGUnLCAndGV4dCcpO1xuXG4gICAgeCA9IGxvYy53aXJlX3RhYmxlLnggLSB3LzI7XG4gICAgeSA9IGxvYy53aXJlX3RhYmxlLnkgLSBoLzI7XG5cbiAgICB4ICs9IGNvbHVtbl93aWR0aC5udW1iZXIvMjtcbiAgICB5ICs9IHJvd19oKjIgKyByb3dfaCowLjc1O1xuXG4gICAgZm9yKCB2YXIgcj0xOyByPD1zeXN0ZW0ud2lyZV9jb25maWdfbnVtOyByKysgKSB7XG4gICAgICAgIGQudGV4dCggW3gseV0sIFN0cmluZyhyKSwgJ3RhYmxlJywgJ3RleHQnKTtcblxuXG5cbiAgICAgICAgeSArPSByb3dfaDtcbiAgICB9XG5cblxuXG4vLyB2b2x0YWdlIGRyb3BcbiAgICBkLnNlY3Rpb24oXCJ2b2x0YWdlIGRyb3BcIik7XG5cblxuICAgIHggPSBsb2Mudm9sdF9kcm9wX3RhYmxlLng7XG4gICAgeSA9IGxvYy52b2x0X2Ryb3BfdGFibGUueTtcbiAgICB3ID0gc2l6ZS52b2x0X2Ryb3BfdGFibGUudztcbiAgICBoID0gc2l6ZS52b2x0X2Ryb3BfdGFibGUuaDtcblxuICAgIGQubGF5ZXIoJ3RhYmxlJyk7XG4gICAgZC5yZWN0KCBbeCx5XSwgW3csaF0gKTtcblxuICAgIHkgLT0gaC8yO1xuICAgIHkgKz0gMTA7XG5cbiAgICBkLnRleHQoIFt4LHldLCAnVm9sdGFnZSBEcm9wJywgJ3RhYmxlJywgJ3RleHQnKTtcblxuXG4vLyBnZW5lcmFsIG5vdGVzXG4gICAgZC5zZWN0aW9uKFwiZ2VuZXJhbCBub3Rlc1wiKTtcblxuICAgIHggPSBsb2MuZ2VuZXJhbF9ub3Rlcy54O1xuICAgIHkgPSBsb2MuZ2VuZXJhbF9ub3Rlcy55O1xuICAgIHcgPSBzaXplLmdlbmVyYWxfbm90ZXMudztcbiAgICBoID0gc2l6ZS5nZW5lcmFsX25vdGVzLmg7XG5cbiAgICBkLmxheWVyKCd0YWJsZScpO1xuICAgIGQucmVjdCggW3gseV0sIFt3LGhdICk7XG5cbiAgICB5IC09IGgvMjtcbiAgICB5ICs9IDEwO1xuXG4gICAgZC50ZXh0KCBbeCx5XSwgJ0dlbmVyYWwgTm90ZXMnLCAndGFibGUnLCAndGV4dCcpO1xuXG5cbiAgICBkLnNlY3Rpb24oKTtcblxuICAgIHJldHVybiBkLmRyYXdpbmdfcGFydHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuIiwidmFyIG1rX2RyYXdpbmcgPSByZXF1aXJlKCcuL21rX2RyYXdpbmcnKTtcblxudmFyIHBhZ2UgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgY29uc29sZS5sb2coXCIqKiBNYWtpbmcgcGFnZSAzXCIpO1xuXG4gICAgZCA9IG1rX2RyYXdpbmcoKTtcblxuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZy5zaXplO1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nLmxvYztcblxuXG4gICAgZC50ZXh0KFxuICAgICAgICBbc2l6ZS5kcmF3aW5nLncvMiwgc2l6ZS5kcmF3aW5nLmgvMl0sXG4gICAgICAgICdQYWdlIDInLFxuICAgICAgICAndGl0bGUyJ1xuICAgICk7XG5cbiAgICByZXR1cm4gZC5kcmF3aW5nX3BhcnRzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcGFnZTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vdmFyIHNldHRpbmdzID0gcmVxdWlyZSgnLi9zZXR0aW5ncy5qcycpO1xuLy92YXIgc25hcHN2ZyA9IHJlcXVpcmUoJ3NuYXBzdmcnKTtcbi8vbG9nKHNldHRpbmdzKTtcblxuXG5cbnZhciBkaXNwbGF5X3N2ZyA9IGZ1bmN0aW9uKGRyYXdpbmdfcGFydHMsIHNldHRpbmdzKXtcbiAgICBjb25zb2xlLmxvZygnZGlzcGxheWluZyBzdmcnKTtcbiAgICB2YXIgbGF5ZXJfYXR0ciA9IHNldHRpbmdzLmRyYXdpbmcubGF5ZXJfYXR0cjtcbiAgICB2YXIgZm9udHMgPSBzZXR0aW5ncy5kcmF3aW5nLmZvbnRzO1xuICAgIC8vY29uc29sZS5sb2coJ2RyYXdpbmdfcGFydHM6ICcsIGRyYXdpbmdfcGFydHMpO1xuICAgIC8vY29udGFpbmVyLmVtcHR5KClcblxuICAgIC8vdmFyIHN2Z19lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ1N2Z2pzU3ZnMTAwMCcpXG4gICAgdmFyIHN2Z19lbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3N2ZycpO1xuICAgIHN2Z19lbGVtLnNldEF0dHJpYnV0ZSgnaWQnLCdzdmdfZHJhd2luZycpO1xuICAgIHN2Z19lbGVtLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBzZXR0aW5ncy5kcmF3aW5nLnNpemUuZHJhd2luZy53KTtcbiAgICBzdmdfZWxlbS5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHNldHRpbmdzLmRyYXdpbmcuc2l6ZS5kcmF3aW5nLmgpO1xuICAgIC8vdmFyIHN2ZyA9IHNuYXBzdmcoc3ZnX2VsZW0pLnNpemUoc2l6ZS5kcmF3aW5nLncsIHNpemUuZHJhd2luZy5oKTtcbiAgICAvL3ZhciBzdmcgPSBzbmFwc3ZnKCcjc3ZnX2RyYXdpbmcnKTtcblxuICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgdGhlIGRyYXdpbmcgY29udGVudHMsIGNhbGwgdGhlIGZ1bmN0aW9uIGJlbG93LlxuICAgIGRyYXdpbmdfcGFydHMuZm9yRWFjaCggZnVuY3Rpb24oZWxlbSxpZCkge1xuICAgICAgICBzaG93X2VsZW1fYXJyYXkoZWxlbSk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzaG93X2VsZW1fYXJyYXkoZWxlbSwgb2Zmc2V0KXtcbiAgICAgICAgb2Zmc2V0ID0gb2Zmc2V0IHx8IHt4OjAseTowfTtcbiAgICAgICAgdmFyIHgseSxhdHRyO1xuICAgICAgICBpZiggdHlwZW9mIGVsZW0ueCAhPT0gJ3VuZGVmaW5lZCcgKSB7IHggPSBlbGVtLnggKyBvZmZzZXQueDsgfVxuICAgICAgICBpZiggdHlwZW9mIGVsZW0ueSAhPT0gJ3VuZGVmaW5lZCcgKSB7IHkgPSBlbGVtLnkgKyBvZmZzZXQueTsgfVxuXG4gICAgICAgIGlmKCBlbGVtLnR5cGUgPT09ICdyZWN0Jykge1xuICAgICAgICAgICAgLy9zdmcucmVjdCggZWxlbS53LCBlbGVtLmggKS5tb3ZlKCB4LWVsZW0udy8yLCB5LWVsZW0uaC8yICkuYXR0ciggbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdICk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdlbGVtOicsIGVsZW0gKTtcbiAgICAgICAgICAgIC8vaWYoIGlzTmFOKGVsZW0udykgKSB7XG4gICAgICAgICAgICAvLyAgICBjb25zb2xlLmxvZygnZXJyb3I6IGVsZW0gbm90IGZ1bGx5IGRlZmluZWQnLCBlbGVtKVxuICAgICAgICAgICAgLy8gICAgZWxlbS53ID0gMTA7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIC8vaWYoIGlzTmFOKGVsZW0uaCkgKSB7XG4gICAgICAgICAgICAvLyAgICBjb25zb2xlLmxvZygnZXJyb3I6IGVsZW0gbm90IGZ1bGx5IGRlZmluZWQnLCBlbGVtKVxuICAgICAgICAgICAgLy8gICAgZWxlbS5oID0gMTA7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgICAgIHZhciByID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3JlY3QnKTtcbiAgICAgICAgICAgIHIuc2V0QXR0cmlidXRlKCd3aWR0aCcsIGVsZW0udyk7XG4gICAgICAgICAgICByLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgZWxlbS5oKTtcbiAgICAgICAgICAgIHIuc2V0QXR0cmlidXRlKCd4JywgeC1lbGVtLncvMik7XG4gICAgICAgICAgICByLnNldEF0dHJpYnV0ZSgneScsIHktZWxlbS5oLzIpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhlbGVtLmxheWVyX25hbWUpO1xuICAgICAgICAgICAgYXR0ciA9IGxheWVyX2F0dHJbZWxlbS5sYXllcl9uYW1lXTtcbiAgICAgICAgICAgIGZvciggdmFyIGkyIGluIGF0dHIgKXtcbiAgICAgICAgICAgICAgICByLnNldEF0dHJpYnV0ZShpMiwgYXR0cltpMl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3ZnX2VsZW0uYXBwZW5kQ2hpbGQocik7XG4gICAgICAgIH0gZWxzZSBpZiggZWxlbS50eXBlID09PSAnbGluZScpIHtcbiAgICAgICAgICAgIHZhciBwb2ludHMyID0gW107XG4gICAgICAgICAgICBlbGVtLnBvaW50cy5mb3JFYWNoKCBmdW5jdGlvbihwb2ludCl7XG4gICAgICAgICAgICAgICAgaWYoICEgaXNOYU4ocG9pbnRbMF0pICYmICEgaXNOYU4ocG9pbnRbMV0pICl7XG4gICAgICAgICAgICAgICAgICAgIHBvaW50czIucHVzaChbIHBvaW50WzBdK29mZnNldC54LCBwb2ludFsxXStvZmZzZXQueSBdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3I6IGVsZW0gbm90IGZ1bGx5IGRlZmluZWQnLCBlbGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vc3ZnLnBvbHlsaW5lKCBwb2ludHMyICkuYXR0ciggbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdICk7XG5cbiAgICAgICAgICAgIHZhciBsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3BvbHlsaW5lJyk7XG4gICAgICAgICAgICBsLnNldEF0dHJpYnV0ZSggJ3BvaW50cycsIHBvaW50czIuam9pbignICcpICk7XG4gICAgICAgICAgICBhdHRyID0gbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdO1xuICAgICAgICAgICAgZm9yKCB2YXIgaTIgaW4gYXR0ciApe1xuICAgICAgICAgICAgICAgIGwuc2V0QXR0cmlidXRlKGkyLCBhdHRyW2kyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdmdfZWxlbS5hcHBlbmRDaGlsZChsKTtcbiAgICAgICAgfSBlbHNlIGlmKCBlbGVtLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICAgICAgLy92YXIgdCA9IHN2Zy50ZXh0KCBlbGVtLnN0cmluZ3MgKS5tb3ZlKCBlbGVtLnBvaW50c1swXVswXSwgZWxlbS5wb2ludHNbMF1bMV0gKS5hdHRyKCBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV0gKVxuICAgICAgICAgICAgdmFyIGZvbnQgPSBmb250c1tlbGVtLmZvbnRdO1xuICAgICAgICAgICAgdmFyIHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAndGV4dCcpO1xuICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoJ3gnLCB4KTtcbiAgICAgICAgICAgIC8vdC5zZXRBdHRyaWJ1dGUoJ3knLCB5ICsgZm9udFsnZm9udC1zaXplJ10vMiApO1xuICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoJ3knLCB5ICk7XG4gICAgICAgICAgICBpZihlbGVtLnJvdGF0ZWQpe1xuICAgICAgICAgICAgICAgIC8vdC5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsIFwicm90YXRlKFwiICsgZWxlbS5yb3RhdGVkICsgXCIgXCIgKyB4ICsgXCIgXCIgKyB5ICsgXCIpXCIgKTtcbiAgICAgICAgICAgICAgICB0LnNldEF0dHJpYnV0ZSgndHJhbnNmb3JtJywgXCJyb3RhdGUoXCIgKyBlbGVtLnJvdGF0ZWQgKyBcIiBcIiArIHggKyBcIiBcIiArIHkgKyBcIilcIiApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yKCB2YXIgaTIgaW4gbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdICl7XG4gICAgICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoIGkyLCBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV1baTJdICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IoIHZhciBpMiBpbiBmb250ICl7XG4gICAgICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoIGkyLCBmb250W2kyXSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yKCB2YXIgaTIgaW4gZWxlbS5zdHJpbmdzICl7XG4gICAgICAgICAgICAgICAgdmFyIHRzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3RzcGFuJyk7XG4gICAgICAgICAgICAgICAgdHNwYW4uc2V0QXR0cmlidXRlKCdkeScsIGZvbnRbJ2ZvbnQtc2l6ZSddKjEuNSppMiApO1xuICAgICAgICAgICAgICAgIHRzcGFuLnNldEF0dHJpYnV0ZSgneCcsIHgpO1xuICAgICAgICAgICAgICAgIHRzcGFuLmlubmVySFRNTCA9IGVsZW0uc3RyaW5nc1tpMl07XG4gICAgICAgICAgICAgICAgdC5hcHBlbmRDaGlsZCh0c3Bhbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdmdfZWxlbS5hcHBlbmRDaGlsZCh0KTtcbiAgICAgICAgfSBlbHNlIGlmKCBlbGVtLnR5cGUgPT09ICdjaXJjJykge1xuICAgICAgICAgICAgdmFyIGMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAnZWxsaXBzZScpO1xuICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoJ3J4JywgZWxlbS5kLzIpO1xuICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoJ3J5JywgZWxlbS5kLzIpO1xuICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoJ2N4JywgeCk7XG4gICAgICAgICAgICBjLnNldEF0dHJpYnV0ZSgnY3knLCB5KTtcbiAgICAgICAgICAgIGF0dHIgPSBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV07XG4gICAgICAgICAgICBmb3IoIHZhciBpMiBpbiBhdHRyICl7XG4gICAgICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoaTIsIGF0dHJbaTJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN2Z19lbGVtLmFwcGVuZENoaWxkKGMpO1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGMuYXR0cmlidXRlcyggbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdIClcbiAgICAgICAgICAgIGMuYXR0cmlidXRlcyh7XG4gICAgICAgICAgICAgICAgcng6IDUsXG4gICAgICAgICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgICAgICByeTogNSxcbiAgICAgICAgICAgICAgICBjeDogZWxlbS5wb2ludHNbMF1bMF0tZWxlbS5kLzIsXG4gICAgICAgICAgICAgICAgY3k6IGVsZW0ucG9pbnRzWzBdWzFdLWVsZW0uZC8yXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgdmFyIGMyID0gc3ZnLmVsbGlwc2UoIGVsZW0uciwgZWxlbS5yIClcbiAgICAgICAgICAgIGMyLm1vdmUoIGVsZW0ucG9pbnRzWzBdWzBdLWVsZW0uZC8yLCBlbGVtLnBvaW50c1swXVsxXS1lbGVtLmQvMiApXG4gICAgICAgICAgICBjMi5hdHRyKHtyeDo1LCByeTo1fSlcbiAgICAgICAgICAgIGMyLmF0dHIoIGxheWVyX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApXG4gICAgICAgICAgICAqL1xuICAgICAgICB9IGVsc2UgaWYoZWxlbS50eXBlID09PSAnYmxvY2snKSB7XG4gICAgICAgICAgICAvLyBpZiBpdCBpcyBhIGJsb2NrLCBydW4gdGhpcyBmdW5jdGlvbiB0aHJvdWdoIGVhY2ggZWxlbWVudC5cbiAgICAgICAgICAgIGVsZW0uZHJhd2luZ19wYXJ0cy5mb3JFYWNoKCBmdW5jdGlvbihibG9ja19lbGVtLGlkKXtcbiAgICAgICAgICAgICAgICBzaG93X2VsZW1fYXJyYXkoYmxvY2tfZWxlbSwge3g6eCwgeTp5fSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3ZnX2VsZW07XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZGlzcGxheV9zdmc7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBmID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMnKTtcbnZhciBrID0gcmVxdWlyZSgnLi4vbGliL2svay5qcycpO1xuXG4vL3ZhciBzZXR0aW5nc0NhbGN1bGF0ZWQgPSByZXF1aXJlKCcuL3NldHRpbmdzQ2FsY3VsYXRlZC5qcycpO1xuXG4vLyBMb2FkICd1c2VyJyBkZWZpbmVkIHNldHRpbmdzXG52YXIgbWtfc2V0dGluZ3MgPSByZXF1aXJlKCcuLi9kYXRhL3NldHRpbmdzLmpzb24uanMnKTtcbmYubWtfc2V0dGluZ3MgPSBta19zZXR0aW5ncztcblxudmFyIHNldHRpbmdzID0ge307XG5cbnNldHRpbmdzLmNvbmZpZ19vcHRpb25zID0ge307XG5zZXR0aW5ncy5jb25maWdfb3B0aW9ucy5ORUNfdGFibGVzID0gcmVxdWlyZSgnLi4vZGF0YS90YWJsZXMuanNvbicpO1xuLy9jb25zb2xlLmxvZyhzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5ORUNfdGFibGVzKTtcblxuc2V0dGluZ3Muc3RhdGUgPSBzZXR0aW5ncy5zdGF0ZSB8fCB7fTtcbnNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCA9IGZhbHNlO1xuXG5zZXR0aW5ncyA9IG1rX3NldHRpbmdzLmlfb3B0aW9ucyhzZXR0aW5ncyk7XG5zZXR0aW5ncyA9IG1rX3NldHRpbmdzLmlucHV0cyhzZXR0aW5ncyk7XG5zZXR0aW5ncyA9IG1rX3NldHRpbmdzLnN5c3RlbShzZXR0aW5ncyk7XG5cbnNldHRpbmdzLmlucHV0X29wdGlvbnMgPSBzZXR0aW5ncy5pbnB1dHM7IC8vIGNvcHkgaW5wdXQgcmVmZXJlbmNlIHdpdGggb3B0aW9ucyB0byBpbnB1dF9vcHRpb25zXG5zZXR0aW5ncy5pbnB1dHMgPSBmLmJsYW5rX2NvcHkoc2V0dGluZ3MuaW5wdXRfb3B0aW9ucyk7IC8vIG1ha2UgaW5wdXQgc2VjdGlvbiBibGFua1xuc2V0dGluZ3Muc3lzdGVtX2Zvcm11bGFzID0gc2V0dGluZ3Muc3lzdGVtOyAvLyBjb3B5IHN5c3RlbSByZWZlcmVuY2UgdG8gc3lzdGVtX2Zvcm11bGFzXG5zZXR0aW5ncy5zeXN0ZW0gPSBmLmJsYW5rX2NvcHkoc2V0dGluZ3Muc3lzdGVtX2Zvcm11bGFzKTsgLy8gbWFrZSBzeXN0ZW0gc2VjdGlvbiBibGFua1xuZi5tZXJnZV9vYmplY3RzKCBzZXR0aW5ncy5pbnB1dHMsIHNldHRpbmdzLnN5c3RlbSApO1xuXG5zZXR0aW5ncy5pbnB1dF9vcHRpb25zLkRDID0gc2V0dGluZ3MuaW5wdXRfb3B0aW9ucy5EQyB8fCB7fTtcbnNldHRpbmdzLmlucHV0X29wdGlvbnMuREMuQVdHID0gay5vYmpfbmFtZXMoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuTkVDX3RhYmxlc1snQ2ggOSBUYWJsZSA4IENvbmR1Y3RvciBQcm9wZXJ0aWVzJ10pO1xuLy8gbG9hZCBsYXllcnNcblxuc2V0dGluZ3MuZHJhd2luZyA9IHNldHRpbmdzLmRyYXdpbmcgfHwge307XG5zZXR0aW5ncy5kcmF3aW5nLmxheWVyX2F0dHIgPSByZXF1aXJlKCcuL3NldHRpbmdzX2xheWVycycpO1xuXG4vLyBMb2FkIGRyYXdpbmcgc3BlY2lmaWMgc2V0dGluZ3Ncbi8vIFRPRE8gRml4IHNldHRpbmdzX2RyYXdpbmcgd2l0aCBuZXcgdmFyaWFibGUgbG9jYXRpb25zXG52YXIgc2V0dGluZ3NfZHJhd2luZyA9IHJlcXVpcmUoJy4vc2V0dGluZ3NfZHJhd2luZycpO1xuc2V0dGluZ3MgPSBzZXR0aW5nc19kcmF3aW5nKHNldHRpbmdzKTtcblxuLy9zZXR0aW5ncy5zdGF0ZV9hcHAudmVyc2lvbl9zdHJpbmcgPSB2ZXJzaW9uX3N0cmluZztcblxuLy9zZXR0aW5ncyA9IGYubnVsbFRvT2JqZWN0KHNldHRpbmdzKTtcblxuc2V0dGluZ3Muc2VsZWN0X3JlZ2lzdHJ5ID0gW107XG5zZXR0aW5ncy52YWx1ZV9yZWdpc3RyeSA9IFtdO1xuXG52YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuXG4vL3ZhciBjb25maWdfb3B0aW9ucyA9IHNldHRpbmdzLmNvbmZpZ19vcHRpb25zID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnMgfHwge307XG5cblxuXG5cbnNldHRpbmdzLmNvbXBvbmVudHMgPSB7fTtcblxuXG4vKlxuZm9yKCB2YXIgc2VjdGlvbl9uYW1lIGluIHNldHRpbmdzLmlucHV0X29wdGlvbnMgKXtcbiAgICBmb3IoIHZhciBpbnB1dF9uYW1lIGluIHNldHRpbmdzLmlucHV0X29wdGlvbnNbc2VjdGlvbl9uYW1lXSl7XG4gICAgICAgIGlmKCB0eXBlb2Ygc2V0dGluZ3MuaW5wdXRfb3B0aW9uc1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdID09PSAnc3RyaW5nJyApe1xuICAgICAgICAgICAgY29uc29sZS5sb2coc2V0dGluZ3MuaW5wdXRfb3B0aW9uc1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdKVxuICAgICAgICAgICAgXCJvYmpfbmFtZXMoc2V0dHRpbmdzXCIgKyBzZXR0aW5ncy5pbnB1dF9vcHRpb25zW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0gKyBcIilcIjtcbiAgICAgICAgICAgIC8vIGV2YWwgaXMgb25seSBiZWluZyB1c2VkIG9uIHN0cmluZ3MgZGVmaW5lZCBpbiB0aGUgc2V0dGluZ3MuanNvbiBmaWxlIHRoYXQgaXMgYnVpbHQgaW50byB0aGUgYXBwbGljYXRpb25cbiAgICAgICAgICAgIHNldHRpbmdzLmlucHV0X29wdGlvbnNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSA9IGV2YWwoc2V0dGluZ3MuaW5wdXRfb3B0aW9uc1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8vKi9cblxuXG4vKlxuc2V0dGluZ3Muc3RhdGUuc2VjdGlvbnMgPSB7XG4gICAgbW9kdWxlczoge30sXG4gICAgYXJyYXk6IHt9LFxuICAgIERDOiB7fSxcbiAgICBpbnZlcnRlcjoge30sXG4gICAgQUM6IHt9LFxufTtcbmNvbmZpZ19vcHRpb25zLnNlY3Rpb25fb3B0aW9ucyA9IG9ial9uYW1lcyhzZXR0aW5ncy5zdGF0ZS5zZWN0aW9ucyk7XG5zZXR0aW5ncy5zdGF0ZS5hY3RpdmVfc2VjdGlvbiA9ICdtb2R1bGVzJztcblxuY29uZmlnX29wdGlvbnMuQUNfbG9hZGNlbnRlcl90eXBlX29wdGlvbnMgPSBvYmpfbmFtZXMoIGNvbmZpZ19vcHRpb25zLkFDX2xvYWRjZW50ZXJfdHlwZXMgKTtcbmNvbmZpZ19vcHRpb25zLkFDX3R5cGVfb3B0aW9ucyA9IG9ial9uYW1lcyggY29uZmlnX29wdGlvbnMuQUNfdHlwZXMgKTtcblxuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzID0ge307XG5cbmNvbmZpZ19vcHRpb25zLnBhZ2Vfb3B0aW9ucyA9IFsnUGFnZSAxIG9mIDEnXTtcbnNldHRpbmdzLnN0YXRlLmFjdGl2ZV9wYWdlID0gY29uZmlnX29wdGlvbnMucGFnZV9vcHRpb25zWzBdO1xuXG5zeXN0ZW0uaW52ZXJ0ZXIgPSB7fTtcblxuXG5jb25maWdfb3B0aW9ucy5EQ19ob21lcnVuX2xlbmd0aHMgPSBjb25maWdfb3B0aW9ucy5EQ19ob21lcnVuX2xlbmd0aHMgfHwgWzI1LDUwLDc1LDEwMF07XG5jb25maWdfb3B0aW9ucy5EQ19ob21lcnVuX0FXR19vcHRpb25zID1cbiAgICBjb25maWdfb3B0aW9ucy5EQ19ob21lcnVuX0FXR19vcHRpb25zIHx8XG4gICAgb2JqX25hbWVzKCBjb25maWdfb3B0aW9ucy5ORUNfdGFibGVzW1wiQ2ggOSBUYWJsZSA4IENvbmR1Y3RvciBQcm9wZXJ0aWVzXCJdICk7XG4vLyovXG5cblxubW9kdWxlLmV4cG9ydHMgPSBzZXR0aW5ncztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBzZXR0aW5nc19kcmF3aW5nKHNldHRpbmdzKXtcblxuICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG4gICAgdmFyIHN0YXR1cyA9IHNldHRpbmdzLnN0YXR1cztcblxuICAgIC8vIERyYXdpbmcgc3BlY2lmaWNcbiAgICBzZXR0aW5ncy5kcmF3aW5nID0gc2V0dGluZ3MuZHJhd2luZyB8fCB7fTtcblxuICAgIC8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIGZvbnRzXG5cbiAgICB2YXIgZm9udHMgPSBzZXR0aW5ncy5kcmF3aW5nLmZvbnRzID0ge307XG5cbiAgICBmb250c1snc2lnbnMnXSA9IHtcbiAgICAgICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgICAgICdmb250LXNpemUnOiAgICAgNSxcbiAgICAgICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbiAgICB9O1xuICAgIGZvbnRzWydsYWJlbCddID0ge1xuICAgICAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAgICAgJ2ZvbnQtc2l6ZSc6ICAgICAxMixcbiAgICAgICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbiAgICB9O1xuICAgIGZvbnRzWyd0aXRsZTEnXSA9IHtcbiAgICAgICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgICAgICdmb250LXNpemUnOiAgICAgMTQsXG4gICAgICAgICd0ZXh0LWFuY2hvcic6ICAgJ2xlZnQnLFxuICAgIH07XG4gICAgZm9udHNbJ3RpdGxlMiddID0ge1xuICAgICAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAgICAgJ2ZvbnQtc2l6ZSc6ICAgICAxMixcbiAgICAgICAgJ3RleHQtYW5jaG9yJzogICAnbGVmdCcsXG4gICAgfTtcbiAgICBmb250c1sncGFnZSddID0ge1xuICAgICAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAgICAgJ2ZvbnQtc2l6ZSc6ICAgICAyMCxcbiAgICAgICAgJ3RleHQtYW5jaG9yJzogICAnbGVmdCcsXG4gICAgfTtcbiAgICBmb250c1sndGFibGUnXSA9IHtcbiAgICAgICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgICAgICdmb250LXNpemUnOiAgICAgNixcbiAgICAgICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbiAgICB9O1xuXG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmcuc2l6ZSA9IHt9O1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nLmxvYyA9IHt9O1xuXG5cbiAgICAvLyBzaXplc1xuICAgIHNpemUuZHJhd2luZyA9IHtcbiAgICAgICAgdzogMTAwMCxcbiAgICAgICAgaDogNzgwLFxuICAgICAgICBmcmFtZV9wYWRkaW5nOiA1LFxuICAgICAgICB0aXRsZWJveDogNTAsXG4gICAgfTtcblxuICAgIHNpemUubW9kdWxlID0ge307XG4gICAgc2l6ZS5tb2R1bGUuZnJhbWUgPSB7XG4gICAgICAgIHc6IDEwLFxuICAgICAgICBoOiAzMCxcbiAgICB9O1xuICAgIHNpemUubW9kdWxlLmxlYWQgPSBzaXplLm1vZHVsZS5mcmFtZS53KjIvMztcbiAgICBzaXplLm1vZHVsZS5oID0gc2l6ZS5tb2R1bGUuZnJhbWUuaCArIHNpemUubW9kdWxlLmxlYWQqMjtcbiAgICBzaXplLm1vZHVsZS53ID0gc2l6ZS5tb2R1bGUuZnJhbWUudztcblxuICAgIHNpemUud2lyZV9vZmZzZXQgPSB7XG4gICAgICAgIGJhc2U6IDcsXG4gICAgICAgIGdhcDogc2l6ZS5tb2R1bGUudyxcbiAgICB9O1xuICAgIHNpemUud2lyZV9vZmZzZXQubWluID0gc2l6ZS53aXJlX29mZnNldC5iYXNlICogMTtcblxuICAgIHNpemUuc3RyaW5nID0ge307XG4gICAgc2l6ZS5zdHJpbmcuZ2FwID0gc2l6ZS5tb2R1bGUuZnJhbWUudy80MjtcbiAgICBzaXplLnN0cmluZy5nYXBfbWlzc2luZyA9IHNpemUuc3RyaW5nLmdhcCArIHNpemUubW9kdWxlLmZyYW1lLnc7XG4gICAgc2l6ZS5zdHJpbmcuaCA9IChzaXplLm1vZHVsZS5oICogNCkgKyAoc2l6ZS5zdHJpbmcuZ2FwICogMikgKyBzaXplLnN0cmluZy5nYXBfbWlzc2luZztcbiAgICBzaXplLnN0cmluZy53ID0gc2l6ZS5tb2R1bGUuZnJhbWUudyAqIDIuNTtcblxuICAgIHNpemUudGVybWluYWxfZGlhbSA9IDU7XG4gICAgc2l6ZS5mdXNlID0ge307XG4gICAgc2l6ZS5mdXNlLncgPSAxNTtcbiAgICBzaXplLmZ1c2UuaCA9IDQ7XG5cblxuICAgIC8vIEludmVydGVyXG4gICAgc2l6ZS5pbnZlcnRlciA9IHsgdzogMjUwLCBoOiAxNTAgfTtcbiAgICBzaXplLmludmVydGVyLnRleHRfZ2FwID0gMTU7XG4gICAgc2l6ZS5pbnZlcnRlci5zeW1ib2xfdyA9IDUwO1xuICAgIHNpemUuaW52ZXJ0ZXIuc3ltYm9sX2ggPSAyNTtcblxuICAgIGxvYy5pbnZlcnRlciA9IHtcbiAgICAgICAgeDogc2l6ZS5kcmF3aW5nLncvMixcbiAgICAgICAgeTogc2l6ZS5kcmF3aW5nLmgvMyxcbiAgICB9O1xuICAgIGxvYy5pbnZlcnRlci5ib3R0b20gPSBsb2MuaW52ZXJ0ZXIueSArIHNpemUuaW52ZXJ0ZXIuaC8yO1xuICAgIGxvYy5pbnZlcnRlci50b3AgPSBsb2MuaW52ZXJ0ZXIueSAtIHNpemUuaW52ZXJ0ZXIuaC8yO1xuICAgIGxvYy5pbnZlcnRlci5ib3R0b21fcmlnaHQgPSB7XG4gICAgICAgIHg6IGxvYy5pbnZlcnRlci54ICsgc2l6ZS5pbnZlcnRlci53LzIsXG4gICAgICAgIHk6IGxvYy5pbnZlcnRlci55ICsgc2l6ZS5pbnZlcnRlci5oLzIsXG4gICAgfTtcblxuICAgIC8vIGFycmF5XG4gICAgbG9jLmFycmF5ID0ge1xuICAgICAgICB4OiBsb2MuaW52ZXJ0ZXIueCAtIDIwMCxcbiAgICAgICAgeTo2MDBcbiAgICB9O1xuICAgIGxvYy5hcnJheS51cHBlciA9IGxvYy5hcnJheS55IC0gc2l6ZS5zdHJpbmcuaC8yO1xuICAgIGxvYy5hcnJheS5sb3dlciA9IGxvYy5hcnJheS51cHBlciArIHNpemUuc3RyaW5nLmg7XG4gICAgbG9jLmFycmF5LnJpZ2h0ID0gbG9jLmFycmF5LnggLSBzaXplLm1vZHVsZS5mcmFtZS5oKjM7XG5cbiAgICBsb2MuREMgPSBsb2MuYXJyYXk7XG5cbiAgICAvLyBEQyBqYlxuICAgIHNpemUuamJfYm94ID0ge1xuICAgICAgICBoOiAxNTAsXG4gICAgICAgIHc6IDgwLFxuICAgIH07XG4gICAgbG9jLmpiX2JveCA9IHtcbiAgICAgICAgeDogbG9jLmFycmF5LnggKyBzaXplLmpiX2JveC53LzIsXG4gICAgICAgIHk6IGxvYy5hcnJheS55ICsgc2l6ZS5qYl9ib3guaC8xMCxcbiAgICB9O1xuXG4gICAgLy8gREMgZGljb25lY3RcbiAgICBzaXplLmRpc2Nib3ggPSB7XG4gICAgICAgIHc6IDE0MCxcbiAgICAgICAgaDogNTAsXG4gICAgfTtcbiAgICBsb2MuZGlzY2JveCA9IHtcbiAgICAgICAgeDogbG9jLmludmVydGVyLnggLSBzaXplLmludmVydGVyLncvMiArIHNpemUuZGlzY2JveC53LzIsXG4gICAgICAgIHk6IGxvYy5pbnZlcnRlci55ICsgc2l6ZS5pbnZlcnRlci5oLzIgKyBzaXplLmRpc2Nib3guaC8yICsgMTAsXG4gICAgfTtcblxuICAgIC8vIEFDIGRpY29uZWN0XG4gICAgc2l6ZS5BQ19kaXNjID0geyB3OiA4MCwgaDogMTI1IH07XG5cbiAgICBsb2MuQUNfZGlzYyA9IHtcbiAgICAgICAgeDogbG9jLmludmVydGVyLngrMjAwLFxuICAgICAgICB5OiBsb2MuaW52ZXJ0ZXIueSsyNTBcbiAgICB9O1xuICAgIGxvYy5BQ19kaXNjLmJvdHRvbSA9IGxvYy5BQ19kaXNjLnkgKyBzaXplLkFDX2Rpc2MuaC8yO1xuICAgIGxvYy5BQ19kaXNjLnRvcCA9IGxvYy5BQ19kaXNjLnkgLSBzaXplLkFDX2Rpc2MuaC8yO1xuICAgIGxvYy5BQ19kaXNjLmxlZnQgPSBsb2MuQUNfZGlzYy54IC0gc2l6ZS5BQ19kaXNjLncvMjtcbiAgICBsb2MuQUNfZGlzYy5zd2l0Y2hfdG9wID0gbG9jLkFDX2Rpc2MudG9wICsgMTU7XG4gICAgbG9jLkFDX2Rpc2Muc3dpdGNoX2JvdHRvbSA9IGxvYy5BQ19kaXNjLnN3aXRjaF90b3AgKyAzMDtcblxuXG4gICAgLy8gQUMgcGFuZWxcblxuICAgIGxvYy5BQ19sb2FkY2VudGVyID0ge1xuICAgICAgICB4OiBsb2MuaW52ZXJ0ZXIueCszNTAsXG4gICAgICAgIHk6IGxvYy5pbnZlcnRlci55KzEwMFxuICAgIH07XG4gICAgc2l6ZS5BQ19sb2FkY2VudGVyID0geyB3OiAxMjUsIGg6IDMwMCB9O1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLmxlZnQgPSBsb2MuQUNfbG9hZGNlbnRlci54IC0gc2l6ZS5BQ19sb2FkY2VudGVyLncvMjtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci50b3AgPSBsb2MuQUNfbG9hZGNlbnRlci55IC0gc2l6ZS5BQ19sb2FkY2VudGVyLmgvMjtcblxuXG4gICAgc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIgPSB7IHc6IDIwLCBoOiBzaXplLnRlcm1pbmFsX2RpYW0sIH07XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMgPSB7XG4gICAgICAgIGxlZnQ6IGxvYy5BQ19sb2FkY2VudGVyLnggLSAoIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyLncgKiAxLjEgKSxcbiAgICB9O1xuICAgIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VycyA9IHtcbiAgICAgICAgbnVtOiAyMCxcbiAgICAgICAgc3BhY2luZzogc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIuaCArIDEsXG4gICAgfTtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy50b3AgPSBsb2MuQUNfbG9hZGNlbnRlci50b3AgKyBzaXplLkFDX2xvYWRjZW50ZXIuaC81O1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLmJvdHRvbSA9IGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnRvcCArIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5zcGFjaW5nKnNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5udW07XG5cblxuICAgIHNpemUuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyID0geyB3OjUsIGg6NDAgfTtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyID0ge1xuICAgICAgICB4OiBsb2MuQUNfbG9hZGNlbnRlci5sZWZ0ICsgMjAsXG4gICAgICAgIHk6IGxvYy5BQ19sb2FkY2VudGVyLnkgKyBzaXplLkFDX2xvYWRjZW50ZXIuaCowLjNcbiAgICB9O1xuXG4gICAgc2l6ZS5BQ19sb2FkY2VudGVyLmdyb3VuZGJhciA9IHsgdzo0MCwgaDo1IH07XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyID0ge1xuICAgICAgICB4OiBsb2MuQUNfbG9hZGNlbnRlci54ICsgMTAsXG4gICAgICAgIHk6IGxvYy5BQ19sb2FkY2VudGVyLnkgKyBzaXplLkFDX2xvYWRjZW50ZXIuaCowLjQ1XG4gICAgfTtcblxuICAgIGxvYy5BQ19jb25kdWl0ID0ge1xuICAgICAgICB5OiBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy5ib3R0b20gLSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMuc3BhY2luZy8yLFxuICAgIH07XG5cblxuICAgIC8vIHdpcmUgdGFibGVcbiAgICBzaXplLndpcmVfdGFibGUgPSB7fTtcbiAgICBzaXplLndpcmVfdGFibGUudyA9IDIwMDtcbiAgICBzaXplLndpcmVfdGFibGUucm93X2ggPSAxMDtcbiAgICBzaXplLndpcmVfdGFibGUuaCA9ICg1KzMpICogc2l6ZS53aXJlX3RhYmxlLnJvd19oOyAvLyA1IG1heCB3aXJlcywgdXBkYXRlZCBpbiB1cGRhdGVfc3lzdGVtLmpzXG4gICAgbG9jLndpcmVfdGFibGUgPSB7XG4gICAgICAgIHg6IHNpemUuZHJhd2luZy53IC0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94IC0gc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmcqMyAtIHNpemUud2lyZV90YWJsZS53LzIgLSAyNSxcbiAgICAgICAgeTogc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmcqMyArIHNpemUud2lyZV90YWJsZS5oLzIsXG4gICAgfTtcbiAgICBsb2Mud2lyZV90YWJsZS50b3AgPSBsb2Mud2lyZV90YWJsZS55IC0gc2l6ZS53aXJlX3RhYmxlLmgvMjtcbiAgICBsb2Mud2lyZV90YWJsZS5ib3R0b20gPSBsb2Mud2lyZV90YWJsZS55ICsgc2l6ZS53aXJlX3RhYmxlLmgvMjtcblxuXG4gICAgLy8gdm9sdGFnZSBkcm9wIHRhYmxlXG4gICAgc2l6ZS52b2x0X2Ryb3BfdGFibGUgPSB7fTtcbiAgICBzaXplLnZvbHRfZHJvcF90YWJsZS53ID0gMTUwO1xuICAgIHNpemUudm9sdF9kcm9wX3RhYmxlLmggPSAxMDA7XG4gICAgbG9jLnZvbHRfZHJvcF90YWJsZSA9IHt9O1xuICAgIGxvYy52b2x0X2Ryb3BfdGFibGUueCA9IHNpemUuZHJhd2luZy53IC0gc2l6ZS52b2x0X2Ryb3BfdGFibGUudy8yIC0gOTA7XG4gICAgbG9jLnZvbHRfZHJvcF90YWJsZS55ID0gc2l6ZS5kcmF3aW5nLmggLSBzaXplLnZvbHRfZHJvcF90YWJsZS5oLzIgLSAzMDtcblxuXG4gICAgLy8gdm9sdGFnZSBkcm9wIHRhYmxlXG4gICAgc2l6ZS5nZW5lcmFsX25vdGVzID0ge307XG4gICAgc2l6ZS5nZW5lcmFsX25vdGVzLncgPSAxNTA7XG4gICAgc2l6ZS5nZW5lcmFsX25vdGVzLmggPSAxMDA7XG4gICAgbG9jLmdlbmVyYWxfbm90ZXMgPSB7fTtcbiAgICBsb2MuZ2VuZXJhbF9ub3Rlcy54ID0gc2l6ZS5nZW5lcmFsX25vdGVzLncvMiArIDMwO1xuICAgIGxvYy5nZW5lcmFsX25vdGVzLnkgPSBzaXplLmdlbmVyYWxfbm90ZXMuaC8yICsgMzA7XG5cblxuXG5cbiAgICBzZXR0aW5ncy5wYWdlcyA9IHt9O1xuICAgIHNldHRpbmdzLnBhZ2VzLmxldHRlciA9IHtcbiAgICAgICAgdW5pdHM6ICdpbmNoZXMnLFxuICAgICAgICB3OiAxMS4wLFxuICAgICAgICBoOiA4LjUsXG4gICAgfTtcbiAgICBzZXR0aW5ncy5wYWdlID0gc2V0dGluZ3MucGFnZXMubGV0dGVyO1xuXG4gICAgc2V0dGluZ3MucGFnZXMuUERGID0ge1xuICAgICAgICB3OiBzZXR0aW5ncy5wYWdlLncgKiA3MixcbiAgICAgICAgaDogc2V0dGluZ3MucGFnZS5oICogNzIsXG4gICAgfTtcblxuICAgIHNldHRpbmdzLnBhZ2VzLlBERi5zY2FsZSA9IHtcbiAgICAgICAgeDogc2V0dGluZ3MucGFnZXMuUERGLncgLyBzZXR0aW5ncy5kcmF3aW5nLnNpemUuZHJhd2luZy53LFxuICAgICAgICB5OiBzZXR0aW5ncy5wYWdlcy5QREYuaCAvIHNldHRpbmdzLmRyYXdpbmcuc2l6ZS5kcmF3aW5nLmgsXG4gICAgfTtcblxuICAgIGlmKCBzZXR0aW5ncy5wYWdlcy5QREYuc2NhbGUueCA8IHNldHRpbmdzLnBhZ2VzLlBERi5zY2FsZS55ICkge1xuICAgICAgICBzZXR0aW5ncy5wYWdlLnNjYWxlID0gc2V0dGluZ3MucGFnZXMuUERGLnNjYWxlLng7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2V0dGluZ3MucGFnZS5zY2FsZSA9IHNldHRpbmdzLnBhZ2VzLlBERi5zY2FsZS55O1xuICAgIH1cblxuICByZXR1cm4gc2V0dGluZ3M7XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldHRpbmdzX2RyYXdpbmc7XG4iLCJ2YXIgbGF5ZXJfYXR0ciA9IHt9O1xuXG5sYXllcl9hdHRyLmJhc2UgPSB7XG4gICAgJ2ZpbGwnOiAnbm9uZScsXG4gICAgJ3N0cm9rZSc6JyMwMDAwMDAnLFxuICAgICdzdHJva2Utd2lkdGgnOicxcHgnLFxuICAgICdzdHJva2UtbGluZWNhcCc6J2J1dHQnLFxuICAgICdzdHJva2UtbGluZWpvaW4nOidtaXRlcicsXG4gICAgJ3N0cm9rZS1vcGFjaXR5JzoxLFxuXG59O1xubGF5ZXJfYXR0ci5ibG9jayA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuZnJhbWUgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLmZyYW1lLnN0cm9rZSA9ICcjMDAwMDQyJztcbmxheWVyX2F0dHIudGFibGUgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLnRhYmxlLnN0cm9rZSA9ICcjMDAwMDQyJztcblxubGF5ZXJfYXR0ci5EQ19wb3MgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkRDX3Bvcy5zdHJva2UgPSAnI2ZmMDAwMCc7XG5sYXllcl9hdHRyLkRDX25lZyA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuRENfbmVnLnN0cm9rZSA9ICcjMDAwMDAwJztcbmxheWVyX2F0dHIuRENfZ3JvdW5kID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5EQ19ncm91bmQuc3Ryb2tlID0gJyMwMDY2MDAnO1xubGF5ZXJfYXR0ci5tb2R1bGUgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLmJveCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIudGV4dCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIudGV4dC5zdHJva2UgPSAnIzAwMDBmZic7XG5sYXllcl9hdHRyLnRlcm1pbmFsID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xuXG5sYXllcl9hdHRyLkFDX2dyb3VuZCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuQUNfZ3JvdW5kLnN0cm9rZSA9ICcjMDA5OTAwJztcbmxheWVyX2F0dHIuQUNfbmV1dHJhbCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuQUNfbmV1dHJhbC5zdHJva2UgPSAnIzk5OTc5Nyc7XG5sYXllcl9hdHRyLkFDX0wxID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5BQ19MMS5zdHJva2UgPSAnIzAwMDAwMCc7XG5sYXllcl9hdHRyLkFDX0wyID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5BQ19MMi5zdHJva2UgPSAnI0ZGMDAwMCc7XG5sYXllcl9hdHRyLkFDX0wzID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5BQ19MMy5zdHJva2UgPSAnIzAwMDBGRic7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBsYXllcl9hdHRyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgayA9IHJlcXVpcmUoJy4uL2xpYi9rL2suanMnKTtcbnZhciBmID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMnKTtcbi8vdmFyIG1rX2RyYXdpbmcgPSByZXF1aXJlKCcuL21rX2RyYXdpbmcnKTtcbi8vdmFyIGRpc3BsYXlfc3ZnID0gcmVxdWlyZSgnLi9kaXNwbGF5X3N2ZycpO1xuXG52YXIgb2JqZWN0X2RlZmluZWQgPSBmLm9iamVjdF9kZWZpbmVkO1xuXG52YXIgdXBkYXRlX3N5c3RlbSA9IGZ1bmN0aW9uKHNldHRpbmdzKSB7XG5cbiAgICAvL2NvbnNvbGUubG9nKCctLS1zZXR0aW5ncy0tLScsIHNldHRpbmdzKTtcbiAgICB2YXIgY29uZmlnX29wdGlvbnMgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucztcbiAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nLmxvYztcbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmcuc2l6ZTtcbiAgICB2YXIgc3RhdGUgPSBzZXR0aW5ncy5zdGF0ZTtcblxuICAgIHZhciBjYWxjdWxhdGVkID0gc2V0dGluZ3MuY2FsY3VsYXRlZDtcbiAgICB2YXIgY2FsY3VsYXRlZF9mb3JtdWxhcyA9IHNldHRpbmdzLmNhbGN1bGF0ZWRfZm9ybXVsYXM7XG4gICAgdmFyIGlucHV0cyA9IHNldHRpbmdzLmlucHV0cztcbiAgICB2YXIgaW5wdXRfb3B0aW9ucyA9IHNldHRpbmdzLmlucHV0X29wdGlvbnM7XG5cbiAgICB2YXIgc2VjdGlvbnMgPSBrLm9iaklkQXJyYXkoc2V0dGluZ3MuaW5wdXRzKTtcbiAgICAvL2NvbnNvbGUubG9nKHNlY3Rpb25zKTtcbiAgICBzZWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHNlY3Rpb25OYW1lLGlkKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggc2VjdGlvbk5hbWUsIGYub2JqZWN0X2RlZmluZWQoc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25OYW1lXSkgKTtcbiAgICB9KTtcblxuICAgIGYubWtfc2V0dGluZ3Muc3lzdGVtKHNldHRpbmdzKTtcblxuICAgIGZvciggdmFyIHNlY3Rpb24gaW4gc2V0dGluZ3Muc3lzdGVtX2Zvcm11bGFzICl7XG5cblxuICAgIH1cblxuICAgIC8vdmFyIHNob3dfZGVmYXVsdHMgPSBmYWxzZTtcbiAgICAvLy8qXG4gICAgaWYoIHRydWUgJiYgc3RhdGUudmVyc2lvbl9zdHJpbmcgPT09ICdEZXYnKXtcbiAgICAgICAgLy9zaG93X2RlZmF1bHRzID0gdHJ1ZTtcbiAgICAgICAgY29uc29sZS5sb2coJ0RldiBtb2RlIC0gZGVmYXVsdHMgb24nKTtcblxuICAgICAgICBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgPSBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgfHwgNDtcbiAgICAgICAgc3lzdGVtLmFycmF5Lm51bV9tb2R1bGVzID0gc3lzdGVtLmFycmF5Lm51bV9tb2R1bGVzIHx8IDY7XG4gICAgICAgIHN5c3RlbS5EQy5ob21lX3J1bl9sZW5ndGggPSBzeXN0ZW0uREMuaG9tZV9ydW5fbGVuZ3RoIHx8IDUwO1xuXG4gICAgICAgIHNldHRpbmdzLnN5c3RlbS5EQy5BV0cgPSBzZXR0aW5ncy5zeXN0ZW0uREMuQVdHIHx8IHNldHRpbmdzLmlucHV0X29wdGlvbnMuREMuQVdHWzEwXTtcblxuICAgICAgICBpZiggc3RhdGUuZGF0YWJhc2VfbG9hZGVkICl7XG4gICAgICAgICAgICBpbnB1dHMuaW52ZXJ0ZXIubWFrZSA9IHN5c3RlbS5pbnZlcnRlci5tYWtlID0gc3lzdGVtLmludmVydGVyLm1ha2UgfHxcbiAgICAgICAgICAgICAgICAnU01BJztcbiAgICAgICAgICAgIGlucHV0cy5pbnZlcnRlci5tb2RlbCA9IHN5c3RlbS5pbnZlcnRlci5tb2RlbCA9IHN5c3RlbS5pbnZlcnRlci5tb2RlbCB8fFxuICAgICAgICAgICAgICAgICdTSTMwMDAnO1xuXG4gICAgICAgICAgICBpbnB1dHMubW9kdWxlLm1ha2UgPSBzeXN0ZW0ubW9kdWxlLm1ha2UgPSBzeXN0ZW0ubW9kdWxlLm1ha2UgfHxcbiAgICAgICAgICAgICAgICBmLm9ial9uYW1lcyggc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzIClbMF07XG4gICAgICAgICAgICAvL2lmKCBzeXN0ZW0ubW9kdWxlLm1ha2UpIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZU1vZGVsQXJyYXkgPSBrLm9iaklkQXJyYXkoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlc1tzeXN0ZW0ubW9kdWxlLm1ha2VdKTtcbiAgICAgICAgICAgIGlucHV0cy5tb2R1bGUubW9kZWwgPSBzeXN0ZW0ubW9kdWxlLm1vZGVsID0gc3lzdGVtLm1vZHVsZS5tb2RlbCB8fFxuICAgICAgICAgICAgICAgIGYub2JqX25hbWVzKCBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbc3lzdGVtLm1vZHVsZS5tYWtlXSApWzBdO1xuXG5cbiAgICAgICAgICAgIGlucHV0cy5tb2R1bGUubW9kZWwgPSBzeXN0ZW0ubW9kdWxlLm1vZGVsID0gc3lzdGVtLm1vZHVsZS5tb2RlbCB8fFxuICAgICAgICAgICAgICAgIGYub2JqX25hbWVzKCBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbc3lzdGVtLm1vZHVsZS5tYWtlXSApWzBdO1xuXG4gICAgICAgICAgICBpbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlcyA9IHN5c3RlbS5BQy5sb2FkY2VudGVyX3R5cGVzID0gc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXMgfHxcbiAgICAgICAgICAgIC8vICAgIGYub2JqX25hbWVzKGlucHV0X29wdGlvbnMuQUMubG9hZGNlbnRlcl90eXBlcylbMF07XG4gICAgICAgICAgICAgICAgJzQ4MC8yNzdWJztcblxuXG4gICAgICAgICAgICBpbnB1dHMuQUMudHlwZSA9IHN5c3RlbS5BQy50eXBlID0gc3lzdGVtLkFDLnR5cGUgfHwgJzQ4MFYgV3llJztcbiAgICAgICAgICAgIC8vaW5wdXRzLkFDLnR5cGUgPSBzeXN0ZW0uQUMudHlwZSA9IHN5c3RlbS5BQy50eXBlIHx8XG4gICAgICAgICAgICAvLyAgICBpbnB1dF9vcHRpb25zLkFDLmxvYWRjZW50ZXJfdHlwZXNbc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXNdWzBdO1xuXG4gICAgICAgICAgICBpbnB1dHMuQUMuZGlzdGFuY2VfdG9fbG9hZGNlbnRlciA9IHN5c3RlbS5BQy5kaXN0YW5jZV90b19sb2FkY2VudGVyID0gc3lzdGVtLkFDLmRpc3RhbmNlX3RvX2xvYWRjZW50ZXIgfHxcbiAgICAgICAgICAgICAgICBpbnB1dF9vcHRpb25zLkFDLmRpc3RhbmNlX3RvX2xvYWRjZW50ZXJbM107XG5cblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGNvbmZpZ19vcHRpb25zLkRDX2hvbWVydW5fQVdHX29wdGlvbnMgPSBrLm9iaklkQXJyYXkoIGNvbmZpZ19vcHRpb25zLk5FQ190YWJsZXNbJ0NoIDkgVGFibGUgOCBDb25kdWN0b3IgUHJvcGVydGllcyddICk7XG4gICAgICAgICAgICBzeXN0ZW0uYXJyYXkuaG9tZXJ1bi5BV0cgPSBzeXN0ZW0uYXJyYXkuaG9tZXJ1bi5BV0cgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnX29wdGlvbnMuRENfaG9tZXJ1bl9BV0dfb3B0aW9uc1tjb25maWdfb3B0aW9ucy5EQ19ob21lcnVuX0FXR19vcHRpb25zLmxlbmd0aC0xXTtcblxuICAgICAgICAgICAgc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJNYWtlQXJyYXkgPSBrLm9iaklkQXJyYXkoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzKTtcbiAgICAgICAgICAgIHN5c3RlbS5pbnZlcnRlci5tYWtlID0gc3lzdGVtLmludmVydGVyLm1ha2UgfHwgT2JqZWN0LmtleXMoIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVycyApWzBdO1xuICAgICAgICAgICAgc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJNb2RlbEFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyc1tzeXN0ZW0uaW52ZXJ0ZXIubWFrZV0pO1xuXG4gICAgICAgICAgICBzeXN0ZW0uQUNfbG9hZGNlbnRlcl90eXBlID0gc3lzdGVtLkFDX2xvYWRjZW50ZXJfdHlwZSB8fCBjb25maWdfb3B0aW9ucy5BQ19sb2FkY2VudGVyX3R5cGVfb3B0aW9uc1swXTtcbiAgICAgICAgICAgIC8vKi9cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyovXG5cbiAgICAvL2NvbnNvbGUubG9nKFwidXBkYXRlX3N5c3RlbVwiKTtcbiAgICAvL2NvbnNvbGUubG9nKHN5c3RlbS5tb2R1bGUubWFrZSk7XG5cbiAgICBpbnB1dF9vcHRpb25zLm1vZHVsZS5tYWtlID0gay5vYmpfbmFtZXMoc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzKTtcbiAgICBpZiggc3lzdGVtLm1vZHVsZS5tYWtlICkge1xuICAgICAgICBpbnB1dF9vcHRpb25zLm1vZHVsZS5tb2RlbCAgPSBrLm9ial9uYW1lcyggc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzW3N5c3RlbS5tb2R1bGUubWFrZV0gKTtcbiAgICB9XG5cbiAgICBpZiggc3lzdGVtLm1vZHVsZS5tb2RlbCApIHtcbiAgICAgICAgc3lzdGVtLm1vZHVsZS5zcGVjcyA9IHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tzeXN0ZW0ubW9kdWxlLm1ha2VdW3N5c3RlbS5tb2R1bGUubW9kZWxdO1xuICAgIH1cblxuICAgIGlucHV0X29wdGlvbnMuaW52ZXJ0ZXIubWFrZSA9IGsub2JqX25hbWVzKHNldHRpbmdzLmNvbXBvbmVudHMuaW52ZXJ0ZXJzKTtcbiAgICBpZiggc3lzdGVtLmludmVydGVyLm1ha2UgKSB7XG4gICAgICAgIGlucHV0X29wdGlvbnMuaW52ZXJ0ZXIubW9kZWwgPSBrLm9ial9uYW1lcyggc2V0dGluZ3MuY29tcG9uZW50cy5pbnZlcnRlcnNbc3lzdGVtLmludmVydGVyLm1ha2VdICk7XG4gICAgfVxuXG4gICAgLy9pbnB1dF9vcHRpb25zLkFDLmxvYWRjZW50ZXJfdHlwZSA9IHNldHRpbmdzLmYub2JqX25hbWVzKGlucHV0X29wdGlvbnMuQUMubG9hZGNlbnRlcl90eXBlcyk7XG4gICAgaWYoIHN5c3RlbS5BQy5sb2FkY2VudGVyX3R5cGVzICkge1xuICAgICAgICB2YXIgbG9hZGNlbnRlcl90eXBlID0gc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXM7XG4gICAgICAgIHZhciBBQ19vcHRpb25zID0gaW5wdXRfb3B0aW9ucy5BQy5sb2FkY2VudGVyX3R5cGVzW2xvYWRjZW50ZXJfdHlwZV07XG4gICAgICAgIGlucHV0X29wdGlvbnMuQUMudHlwZSA9IEFDX29wdGlvbnM7XG4gICAgICAgIC8vaV9vcHRpb25zLkFDLnR5cGVzW2xvYWRjZW50ZXJfdHlwZV07XG5cbiAgICAgICAgLy9pbnB1dF9vcHRpb25zLkFDWyd0eXBlJ10gPSBrLm9ial9uYW1lcyggc2V0dGluZ3MuaV9vcHRpb25zLkFDLnR5cGUgKTtcbiAgICB9XG5cbiAgICBpZiggc3lzdGVtLkFDLnR5cGUgKSB7XG4gICAgICAgIHN5c3RlbS5BQy5jb25kdWN0b3JzID0gc2V0dGluZ3MuaV9vcHRpb25zLkFDLnR5cGVzW3N5c3RlbS5BQy50eXBlXTtcbiAgICAgICAgc3lzdGVtLkFDLm51bV9jb25kdWN0b3JzID0gc3lzdGVtLkFDLmNvbmR1Y3RvcnMubGVuZ3RoO1xuXG4gICAgfVxuXG4gICAgc2l6ZS53aXJlX29mZnNldC5tYXggPSBzaXplLndpcmVfb2Zmc2V0Lm1pbiArIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncyAqIHNpemUud2lyZV9vZmZzZXQuYmFzZTtcbiAgICBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCA9IHNpemUud2lyZV9vZmZzZXQubWF4ICsgc2l6ZS53aXJlX29mZnNldC5iYXNlKjE7XG4gICAgbG9jLmFycmF5LmxlZnQgPSBsb2MuYXJyYXkucmlnaHQgLSAoIHNpemUuc3RyaW5nLncgKiBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgKSAtICggc2l6ZS5tb2R1bGUuZnJhbWUudyozLzQgKSA7XG5cblxuICAgIHNldHRpbmdzLmRyYXdpbmcuc2l6ZS53aXJlX3RhYmxlLmggPSAoc3lzdGVtLkFDLm51bV9jb25kdWN0b3JzKzMpICogc2V0dGluZ3MuZHJhd2luZy5zaXplLndpcmVfdGFibGUucm93X2g7XG5cbiAgICAvKlxuICAgIGZvciggdmFyIHNlY3Rpb25fbmFtZSBpbiBpbnB1dF9vcHRpb25zICl7XG4gICAgICAgIGZvciggdmFyIGlucHV0X25hbWUgaW4gc2V0dGluZ3MuaW5wdXRfb3B0aW9uc1tzZWN0aW9uX25hbWVdICl7XG4gICAgICAgICAgICBpZiggdHlwZW9mIHNldHRpbmdzLmlucHV0X29wdGlvbnNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSA9PT0gJ3N0cmluZycgKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggc2V0dGluZ3MuaW5wdXRfb3B0aW9uc1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdICk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIGsub2JqX25hbWVzKFxuICAgICAgICAgICAgICAgICAgICBmLmdldF9yZWYoc2V0dGluZ3MuaW5wdXRfb3B0aW9uc1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdLCBzZXR0aW5ncylcbiAgICAgICAgICAgICAgICApKTtcblxuICAgICAgICAgICAgICAgIHZhciB0b19ldmFsID0gXCJrLm9ial9uYW1lcyhzZXR0dGluZ3MuXCIgKyBzZXR0aW5ncy5pbnB1dF9vcHRpb25zW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0gKyBcIilcIjtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0b19ldmFsKTtcbiAgICAgICAgICAgICAgICAvLyBldmFsIGlzIG9ubHkgYmVpbmcgdXNlZCBvbiBzdHJpbmdzIGRlZmluZWQgaW4gdGhlIHNldHRpbmdzLmpzb24gZmlsZSB0aGF0IGlzIGJ1aWx0IGludG8gdGhlIGFwcGxpY2F0aW9uXG4gICAgICAgICAgICAgICAgLyoganNoaW50IGV2aWw6dHJ1ZSAvLyovXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogTG9vayBmb3IgYWx0ZXJuYXRpdmUgc29sdXRpb25zIHRoYXQgaXMgbW9yZSB1bml2ZXJzYWwuXG4gICAgICAgICAgICAgICAgLy8gaHR0cDovL3BlcmZlY3Rpb25raWxscy5jb20vZ2xvYmFsLWV2YWwtd2hhdC1hcmUtdGhlLW9wdGlvbnMvI2luZGlyZWN0X2V2YWxfY2FsbF9leGFtcGxlc1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgdmFyIGUgPSBldmFsOyAvLyBUaGlzIGFsbG93cyBldmFsIHRvIGJlIGNhbGxlZCBpbmRpcmVjdGx5LCB0cmlnZ2VyaW5nIGEgZ2xvYmFsIGNhbGwgaW4gbW9kZXJuIGJyb3dzZXJzLlxuICAgICAgICAgICAgICAgIHNldHRpbmdzLmlucHV0X29wdGlvbnNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSA9IGUodG9fZXZhbCk7XG4gICAgICAgICAgICAgICAgLyoganNoaW50IGV2aWw6ZmFsc2UgLy8qL1xuICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyovXG5cbn07XG5cbi8qXG5cbiAgICBpZiggc3RhdGUuZGF0YV9sb2FkZWQgKSB7XG5cbiAgICAgICAgLy9zeXN0ZW0uREMubnVtX3N0cmluZ3MgPSBzZXR0aW5ncy5zeXN0ZW0ubnVtX3N0cmluZ3M7XG4gICAgICAgIC8vc3lzdGVtLkRDLm51bV9tb2R1bGUgPSBzZXR0aW5ncy5zeXN0ZW0ubnVtX21vZHVsZTtcbiAgICAgICAgLy9pZiggc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlcyAhPT0gdW5kZWZpbmVkICl7XG5cbiAgICAgICAgdmFyIG9sZF9hY3RpdmVfc2VjdGlvbiA9IHN0YXRlLmFjdGl2ZV9zZWN0aW9uO1xuXG4gICAgICAgIC8vIE1vZHVsZXNcbiAgICAgICAgaWYoIHRydWUgKXtcbiAgICAgICAgICAgIGYub2JqZWN0X2RlZmluZWQoc3lzdGVtLkRDLm1vZHVsZSk7XG5cbiAgICAgICAgICAgIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZU1ha2VBcnJheSA9IGsub2JqSWRBcnJheShzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVzKTtcbiAgICAgICAgICAgIGlmKCBzeXN0ZW0uREMubW9kdWxlLm1ha2UgKSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVNb2RlbEFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLm1vZHVsZXNbc3lzdGVtLkRDLm1vZHVsZS5tYWtlXSk7XG4gICAgICAgICAgICBpZiggc3lzdGVtLkRDLm1vZHVsZS5tb2RlbCApIHN5c3RlbS5EQy5tb2R1bGUuc3BlY3MgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5tb2R1bGVzW3N5c3RlbS5EQy5tb2R1bGUubWFrZV1bc3lzdGVtLkRDLm1vZHVsZS5tb2RlbF07XG5cbiAgICAgICAgICAgIHN0YXRlLmFjdGl2ZV9zZWN0aW9uID0gJ2FycmF5JztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFycmF5XG4gICAgICAgIGlmKCBvYmplY3RfZGVmaW5lZChpbnB1dC5tb2R1bGUpICkge1xuICAgICAgICAgICAgLy9zeXN0ZW0ubW9kdWxlID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnMubW9kdWxlc1tzZXR0aW5ncy5mLm1vZHVsZV07XG4gICAgICAgICAgICBpZiggc3lzdGVtLkRDLm1vZHVsZS5zcGVjcyApe1xuICAgICAgICAgICAgICAgIHN5c3RlbS5EQy5hcnJheSA9IHt9O1xuICAgICAgICAgICAgICAgIHN5c3RlbS5EQy5hcnJheS5Jc2MgPSBzeXN0ZW0uREMubW9kdWxlLnNwZWNzLklzYyAqIHN5c3RlbS5EQy5udW1fc3RyaW5ncztcbiAgICAgICAgICAgICAgICBzeXN0ZW0uREMuYXJyYXkuVm9jID0gc3lzdGVtLkRDLm1vZHVsZS5zcGVjcy5Wb2MgKiBzeXN0ZW0uREMuc3RyaW5nX21vZHVsZXM7XG4gICAgICAgICAgICAgICAgc3lzdGVtLkRDLmFycmF5LkltcCA9IHN5c3RlbS5EQy5tb2R1bGUuc3BlY3MuSW1wICogc3lzdGVtLkRDLm51bV9zdHJpbmdzO1xuICAgICAgICAgICAgICAgIHN5c3RlbS5EQy5hcnJheS5WbXAgPSBzeXN0ZW0uREMubW9kdWxlLnNwZWNzLlZtcCAqIHN5c3RlbS5EQy5zdHJpbmdfbW9kdWxlcztcbiAgICAgICAgICAgICAgICBzeXN0ZW0uREMuYXJyYXkuUG1wID0gc3lzdGVtLkRDLmFycmF5LlZtcCAqIHN5c3RlbS5EQy5hcnJheS5JbXA7XG5cbiAgICAgICAgICAgICAgICBzdGF0ZS5hY3RpdmVfc2VjdGlvbiA9ICdEQyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIERDXG4gICAgICAgICAgICBpZiggb2JqZWN0X2RlZmluZWQoaW5wdXRzLkRDKSApIHtcblxuICAgICAgICAgICAgICAgIHN5c3RlbS5EQy5ob21lcnVuLnJlc2lzdGFuY2UgPSBjb25maWdfb3B0aW9ucy5ORUNfdGFibGVzWydDaCA5IFRhYmxlIDggQ29uZHVjdG9yIFByb3BlcnRpZXMnXVtzeXN0ZW0uREMuaG9tZXJ1bi5BV0ddO1xuICAgICAgICAgICAgICAgIHN0YXRlLnNlY3Rpb25zLmludmVydGVyLnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hY3RpdmVfc2VjdGlvbiA9ICdpbnZlcnRlcic7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEludmVydGVyXG4gICAgICAgICAgICBpZiggb2JqZWN0X2RlZmluZWQoaW5wdXRzLkRDKSApIHtcblxuICAgICAgICAgICAgICAgIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyTWFrZUFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVycyk7XG4gICAgICAgICAgICAgICAgaWYoIHN5c3RlbS5pbnZlcnRlci5tYWtlICkge1xuICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlck1vZGVsQXJyYXkgPSBrLm9iaklkQXJyYXkoc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzW3N5c3RlbS5pbnZlcnRlci5tYWtlXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKCBzeXN0ZW0uaW52ZXJ0ZXIubW9kZWwgKSBzeXN0ZW0uaW52ZXJ0ZXIuc3BlY3MgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnNbc3lzdGVtLmludmVydGVyLm1ha2VdW3N5c3RlbS5pbnZlcnRlci5tb2RlbF07XG5cbiAgICAgICAgICAgICAgICBzdGF0ZS5hY3RpdmVfc2VjdGlvbiA9ICdBQyc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEFDXG4gICAgICAgICAgICBpZiggb2JqZWN0X2RlZmluZWQoaW5wdXRzLmludmVydGVyKSApIHtcbiAgICAgICAgICAgICAgICBpZiggc3lzdGVtLkFDX2xvYWRjZW50ZXJfdHlwZSApIHtcblxuICAgICAgICAgICAgICAgICAgICBzeXN0ZW0uQUNfdHlwZXNfYXZhaWxpYmxlID0gY29uZmlnX29wdGlvbnMuQUNfbG9hZGNlbnRlcl90eXBlc1tzeXN0ZW0uQUNfbG9hZGNlbnRlcl90eXBlXTtcblxuICAgICAgICAgICAgICAgICAgICBjb25maWdfb3B0aW9ucy5BQ190eXBlX29wdGlvbnMuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW0sIGlkICl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggISAoZWxlbSBpbiBzeXN0ZW0uQUNfdHlwZXNfYXZhaWxpYmxlKSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWdfb3B0aW9ucy5BQ190eXBlX29wdGlvbnMuc3BsaWNlKGlkLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvL3N5c3RlbS5BQy50eXBlID0gc2V0dGluZ3Muc3lzdGVtLkFDX3R5cGU7XG4gICAgICAgICAgICAgICAgICAgIHN5c3RlbS5BQ19jb25kdWN0b3JzID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuQUNfdHlwZXNbc3lzdGVtLkFDX3R5cGVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZiggb2JqZWN0X2RlZmluZWQoaW5wdXRzLkFDKSApIHtcbiAgICAgICAgICAgICAgICBzdGF0ZS5hY3RpdmVfc2VjdGlvbiA9IG9sZF9hY3RpdmVfc2VjdGlvbjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2l6ZS53aXJlX29mZnNldC5tYXggPSBzaXplLndpcmVfb2Zmc2V0Lm1pbiArIHN5c3RlbS5EQy5udW1fc3RyaW5ncyAqIHNpemUud2lyZV9vZmZzZXQuYmFzZTtcbiAgICAgICAgICAgIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kID0gc2l6ZS53aXJlX29mZnNldC5tYXggKyBzaXplLndpcmVfb2Zmc2V0LmJhc2UqMTtcblxuICAgICAgICAgICAgbG9jLmFycmF5LmxlZnQgPSBsb2MuYXJyYXkucmlnaHQgLSAoIHNpemUuc3RyaW5nLncgKiBzeXN0ZW0uREMubnVtX3N0cmluZ3MgKSAtICggc2l6ZS5tb2R1bGUuZnJhbWUudyozLzQgKSA7XG5cbiAgICAgICAgICAgIC8vcmV0dXJuIHNldHRpbmdzO1xuXG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vLyovXG5cbm1vZHVsZS5leHBvcnRzID0gdXBkYXRlX3N5c3RlbTtcbiIsImUgPSB7fTtcbmUuaV9vcHRpb25zID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIHNldHRpbmdzLmlfb3B0aW9ucyA9IHNldHRpbmdzLmlfb3B0aW9ucyB8fCB7fTtcbiAgICB0cnkgeyBzZXR0aW5ncy5pX29wdGlvbnMuQUMgPSBzZXR0aW5ncy5pX29wdGlvbnMuQUMgfHwge307fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLmlfb3B0aW9ucy5BQy50eXBlcyA9IHNldHRpbmdzLmlfb3B0aW9ucy5BQy50eXBlcyB8fCB7fTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaV9vcHRpb25zLkFDLnR5cGVzW1wiMTIwVlwiXSA9IFtcImdyb3VuZFwiLFwibmV1dHJhbFwiLFwiTDFcIl07fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLmlfb3B0aW9ucy5BQy50eXBlc1tcIjI0MFZcIl0gPSBbXCJncm91bmRcIixcIm5ldXRyYWxcIixcIkwxXCIsXCJMMlwiXTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaV9vcHRpb25zLkFDLnR5cGVzW1wiMjA4VlwiXSA9IFtcImdyb3VuZFwiLFwibmV1dHJhbFwiLFwiTDFcIixcIkwyXCJdO31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5pX29wdGlvbnMuQUMudHlwZXNbXCIyNzdWXCJdID0gW1wiZ3JvdW5kXCIsXCJuZXV0cmFsXCIsXCJMMVwiXTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaV9vcHRpb25zLkFDLnR5cGVzW1wiNDgwViBXeWVcIl0gPSBbXCJncm91bmRcIixcIm5ldXRyYWxcIixcIkwxXCIsXCJMMlwiLFwiTDNcIl07fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLmlfb3B0aW9ucy5BQy50eXBlc1tcIjQ4MFYgRGVsdGFcIl0gPSBbXCJncm91bmRcIixcIkwxXCIsXCJMMlwiLFwiTDNcIl07fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHJldHVybiBzZXR0aW5ncztcbn07XG5lLmlucHV0cyA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICBzZXR0aW5ncy5pbnB1dHMgPSBzZXR0aW5ncy5pbnB1dHMgfHwge307XG4gICAgdHJ5IHsgc2V0dGluZ3MuaW5wdXRzLm1vZHVsZSA9IHNldHRpbmdzLmlucHV0cy5tb2R1bGUgfHwge307fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLmlucHV0cy5tb2R1bGUubWFrZSA9IHNldHRpbmdzLmlucHV0cy5tb2R1bGUubWFrZSB8fCBudWxsO31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5pbnB1dHMubW9kdWxlLm1vZGVsID0gc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5tb2RlbCB8fCBudWxsO31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5pbnB1dHMuYXJyYXkgPSBzZXR0aW5ncy5pbnB1dHMuYXJyYXkgfHwge307fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLmlucHV0cy5hcnJheS5udW1fbW9kdWxlcyA9IFsxLDIsMyw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNiwxNywxOCwxOSwyMF07fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLmlucHV0cy5hcnJheS5udW1fc3RyaW5ncyA9IFsxLDIsMyw0LDUsNl07fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLmlucHV0cy5EQyA9IHNldHRpbmdzLmlucHV0cy5EQyB8fCB7fTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaW5wdXRzLkRDLkFXRyA9IHNldHRpbmdzLmlucHV0cy5EQy5BV0cgfHwgbnVsbDt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaW5wdXRzLkRDLmhvbWVfcnVuX2xlbmd0aCA9IFsyNSw1MCw3NSwxMDAsMTI1LDE1MF07fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLmlucHV0cy5EQy53aXJlX3NpemUgPSBzZXR0aW5ncy5pbnB1dF9vcHRpb25zLkRDLkFXRzt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaW5wdXRzLmludmVydGVyID0gc2V0dGluZ3MuaW5wdXRzLmludmVydGVyIHx8IHt9O31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5pbnB1dHMuaW52ZXJ0ZXIubWFrZSA9IHNldHRpbmdzLmlucHV0cy5pbnZlcnRlci5tYWtlIHx8IG51bGw7fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLmlucHV0cy5pbnZlcnRlci5tb2RlbCA9IHNldHRpbmdzLmlucHV0cy5pbnZlcnRlci5tb2RlbCB8fCBudWxsO31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5pbnB1dHMuQUMgPSBzZXR0aW5ncy5pbnB1dHMuQUMgfHwge307fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLmlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzID0gc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXMgfHwge307fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLmlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzW1wiMjQwVlwiXSA9IFtcIjI0MFZcIixcIjEyMFZcIl07fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLmlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzW1wiMjA4LzEyMFZcIl0gPSBbXCIyMDhWXCIsXCIxMjBWXCJdO31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlc1tcIjQ4MC8yNzdWXCJdID0gW1wiNDgwViBXeWVcIixcIjQ4MFYgRGVsdGFcIixcIjI3N1ZcIl07fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLmlucHV0cy5BQy50eXBlID0gc2V0dGluZ3MuaW5wdXRzLkFDLnR5cGUgfHwgbnVsbDt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3MuaW5wdXRzLkFDLmRpc3RhbmNlX3RvX2xvYWRjZW50ZXIgPSBbMyw1LDEwLDE1LDIwLDMwXTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgcmV0dXJuIHNldHRpbmdzO1xufTtcbmUuc3lzdGVtID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIHNldHRpbmdzLnN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbSB8fCB7fTtcbiAgICB0cnkgeyBzZXR0aW5ncy5zeXN0ZW0ubW9kdWxlID0gc2V0dGluZ3Muc3lzdGVtLm1vZHVsZSB8fCB7fTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3Muc3lzdGVtLm1vZHVsZS5zcGVjcyA9IHNldHRpbmdzLnN5c3RlbS5tb2R1bGUuc3BlY3MgfHwgbnVsbDt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3Muc3lzdGVtLmFycmF5ID0gc2V0dGluZ3Muc3lzdGVtLmFycmF5IHx8IHt9O31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5zeXN0ZW0uYXJyYXkuaXNjID0gc3lzdGVtLm1vZHVsZS5pc2MgKiBpbnB1dHMuYXJyYXkubnVtX3N0cmluZ3M7fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLnN5c3RlbS5hcnJheS52b2MgPSBzeXN0ZW0ubW9kdWxlLnZvYyAqIGlucHV0cy5hcnJheS5udW1fbW9kdWxlO31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5zeXN0ZW0uYXJyYXkuaW1wID0gc3lzdGVtLm1vZHVsZS5pbXAgKiBpbnB1dHMuYXJyYXkubnVtX21vZHVsZTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3Muc3lzdGVtLmFycmF5LnZtcCA9IHN5c3RlbS5tb2R1bGUudm1wICogaW5wdXRzLmFycmF5Lm51bV9zdHJpbmdzO31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5zeXN0ZW0uYXJyYXkucG1wID0gc3lzdGVtLmFycmF5LnZtcCAgKiBzeXN0ZW0uYXJyYXkuYXJyYXkuaW1wO31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5zeXN0ZW0uREMgPSBzZXR0aW5ncy5zeXN0ZW0uREMgfHwge307fVxuICAgIGNhdGNoKGUpIHsgaWYoc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSBjb25zb2xlLmxvZyhlKTsgfVxuICAgIHRyeSB7IHNldHRpbmdzLnN5c3RlbS5pbnZlcnRlciA9IHNldHRpbmdzLnN5c3RlbS5pbnZlcnRlciB8fCB7fTt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgdHJ5IHsgc2V0dGluZ3Muc3lzdGVtLkFDID0gc2V0dGluZ3Muc3lzdGVtLkFDIHx8IHt9O31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5zeXN0ZW0uQUMuQVdHID0gc2V0dGluZ3Muc3lzdGVtLkFDLkFXRyB8fCBudWxsO31cbiAgICBjYXRjaChlKSB7IGlmKHNldHRpbmdzLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkgY29uc29sZS5sb2coZSk7IH1cbiAgICB0cnkgeyBzZXR0aW5ncy5zeXN0ZW0uQUMubnVtX2NvbmR1Y3RvcnMgPSBzZXR0aW5ncy5zeXN0ZW0uQUMubnVtX2NvbmR1Y3RvcnMgfHwgbnVsbDt9XG4gICAgY2F0Y2goZSkgeyBpZihzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQpIGNvbnNvbGUubG9nKGUpOyB9XG4gICAgcmV0dXJuIHNldHRpbmdzO1xufTtcbm1vZHVsZS5leHBvcnRzID0gZTsiLCJtb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz1tb2R1bGUuZXhwb3J0cz17XG5cbiAgICBcIk5FQyAyNTAuMTIyX2hlYWRlclwiOiBbXCJBbXBcIixcIkFXR1wiXSxcbiAgICBcIk5FQyAyNTAuMTIyXCI6IHtcbiAgICAgICAgXCIxNVwiOlwiMTRcIixcbiAgICAgICAgXCIyMFwiOlwiMTJcIixcbiAgICAgICAgXCIzMFwiOlwiMTBcIixcbiAgICAgICAgXCI0MFwiOlwiMTBcIixcbiAgICAgICAgXCI2MFwiOlwiMTBcIixcbiAgICAgICAgXCIxMDBcIjpcIjhcIixcbiAgICAgICAgXCIyMDBcIjpcIjZcIixcbiAgICAgICAgXCIzMDBcIjpcIjRcIixcbiAgICAgICAgXCI0MDBcIjpcIjNcIixcbiAgICAgICAgXCI1MDBcIjpcIjJcIixcbiAgICAgICAgXCI2MDBcIjpcIjFcIixcbiAgICAgICAgXCI4MDBcIjpcIjEvMFwiLFxuICAgICAgICBcIjEwMDBcIjpcIjIvMFwiLFxuICAgICAgICBcIjEyMDBcIjpcIjMvMFwiLFxuICAgICAgICBcIjE2MDBcIjpcIjQvMFwiLFxuICAgICAgICBcIjIwMDBcIjpcIjI1MFwiLFxuICAgICAgICBcIjI1MDBcIjpcIjM1MFwiLFxuICAgICAgICBcIjMwMDBcIjpcIjQwMFwiLFxuICAgICAgICBcIjQwMDBcIjpcIjUwMFwiLFxuICAgICAgICBcIjUwMDBcIjpcIjcwMFwiLFxuICAgICAgICBcIjYwMDBcIjpcIjgwMFwiLFxuICAgIH0sXG5cbiAgICBcIk5FQyBUNjkwLjdfaGVhZGVyXCI6IFtcIkFtYmllbnQgVGVtcGVyYXR1cmUgKEMpXCIsIFwiQ29ycmVjdGlvbiBGYWN0b3JcIl0sXG4gICAgXCJORUMgVDY5MC43XCI6IHtcbiAgICAgICAgXCIyNSB0byAyMFwiOlwiMS4wMlwiLFxuICAgICAgICBcIjE5IHRvIDE1XCI6XCIxLjA0XCIsXG4gICAgICAgIFwiMTUgdG8gMTBcIjpcIjEuMDZcIixcbiAgICAgICAgXCI5IHRvIDVcIjpcIjEuMDhcIixcbiAgICAgICAgXCI0IHRvIDBcIjpcIjEuMTBcIixcbiAgICAgICAgXCItMSB0byAtNVwiOlwiMS4xMlwiLFxuICAgICAgICBcIi02IHRvIC0xMFwiOlwiMS4xNFwiLFxuICAgICAgICBcIi0xMSB0byAtMTVcIjpcIjEuMTZcIixcbiAgICAgICAgXCItMTYgdG8gLTIwXCI6XCIxLjE4XCIsXG4gICAgICAgIFwiLTIxIHRvIC0yNVwiOlwiMS4yMFwiLFxuICAgICAgICBcIi0yNiB0byAtMzBcIjpcIjEuMjFcIixcbiAgICAgICAgXCItMzEgdG8gLTM1XCI6XCIxLjIzXCIsXG4gICAgICAgIFwiLTM2IHRvIC00MFwiOlwiMS4yNVwiLFxuICAgIH0sXG5cbiAgICBcIkNoIDkgVGFibGUgOCBDb25kdWN0b3IgUHJvcGVydGllc19oZWFkZXJcIjogW1wiU2l6ZVwiLFwib2htL2tmdFwiXSxcbiAgICBcIkNoIDkgVGFibGUgOCBDb25kdWN0b3IgUHJvcGVydGllc1wiOiB7XG4gICAgICAgIFwiIzAxXCI6XCIgMC4xNTRcIixcbiAgICAgICAgXCIjMDEvMFwiOlwiMC4xMjJcIixcbiAgICAgICAgXCIjMDJcIjpcIjAuMTk0XCIsXG4gICAgICAgIFwiIzAyLzBcIjpcIjAuMDk2N1wiLFxuICAgICAgICBcIiMwM1wiOlwiMC4yNDVcIixcbiAgICAgICAgXCIjMDMvMFwiOlwiMC4wNzY2XCIsXG4gICAgICAgIFwiIzA0XCI6XCIwLjMwOFwiLFxuICAgICAgICBcIiMwNC8wXCI6XCIwLjA2MDhcIixcbiAgICAgICAgXCIjMDZcIjpcIjAuNDkxXCIsXG4gICAgICAgIFwiIzA4XCI6XCIwLjc3OFwiLFxuICAgICAgICBcIiMxMFwiOlwiMS4yNFwiLFxuICAgICAgICBcIiMxMlwiOlwiMS45OFwiLFxuICAgICAgICBcIiMxNFwiOlwiMy4xNFwiLFxuICAgIH1cbn1cbiIsIi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBUaGlzIGlzIHRoZSBrIGphdmFzY3JpcHQgbGlicmFyeVxyXG4vLyBhIGNvbGxlY3Rpb24gb2YgZnVuY3Rpb25zIHVzZWQgYnkga3Nob3dhbHRlclxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbnZhciBtb21lbnQgPSByZXF1aXJlKCdtb21lbnQnKTtcclxudmFyICQgPSByZXF1aXJlKCcuL2tfRE9NLmpzJyk7XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIE1pc2MuIHZhcmlhYmxlcyAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbi8vIGxvZyBzaG9ydGN1dFxyXG52YXIgbG9nT2JqID0gZnVuY3Rpb24ob2JqKXtcclxuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KG9iaikpXHJcbn1cclxudmFyIGxvZ09iakZ1bGwgPSBmdW5jdGlvbihvYmope1xyXG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkob2JqLCBudWxsLCA0KSlcclxufVxyXG5cclxuLy8gfiBwYWdlIGxvYWQgdGltZVxyXG52YXIgYm9vdF90aW1lID0gbW9tZW50KClcclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBTdGFydCBvZiBsaWJhcnkgb2JqZWN0ICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG52YXIgayA9IHt9XHJcblxyXG5cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gSmF2YXNyaXB0IGZ1bmN0aW9ucyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcblxyXG5rLm9ial9leHRlbmQgPSBmdW5jdGlvbihvYmosIHByb3BzKSB7XHJcbiAgICBmb3IodmFyIHByb3AgaW4gcHJvcHMpIHtcclxuICAgICAgICBpZihwcm9wcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgICAgICBvYmpbcHJvcF0gPSBwcm9wc1twcm9wXVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuay5vYmpfcmVuYW1lID0gZnVuY3Rpb24ob2JqLCBvbGRfbmFtZSwgbmV3X25hbWUpe1xyXG4gICAgLy8gQ2hlY2sgZm9yIHRoZSBvbGQgcHJvcGVydHkgbmFtZSB0byBhdm9pZCBhIFJlZmVyZW5jZUVycm9yIGluIHN0cmljdCBtb2RlLlxyXG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShvbGRfbmFtZSkpIHtcclxuICAgICAgICBvYmpbbmV3X25hbWVdID0gb2JqW29sZF9uYW1lXVxyXG4gICAgICAgIGRlbGV0ZSBvYmpbb2xkX25hbWVdXHJcbiAgICB9XHJcbiAgICByZXR1cm4gb2JqXHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gTWlzYyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcbi8vIGh0dHA6Ly9jc3MtdHJpY2tzLmNvbS9zbmlwcGV0cy9qYXZhc2NyaXB0L2dldC11cmwtdmFyaWFibGVzL1xyXG5rLmdldFF1ZXJ5VmFyaWFibGUgPSBmdW5jdGlvbih2YXJpYWJsZSkge1xyXG4gICAgICAgdmFyIHF1ZXJ5ID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSlcclxuICAgICAgIHZhciB2YXJzID0gcXVlcnkuc3BsaXQoXCImXCIpXHJcbiAgICAgICBmb3IgKHZhciBpPTA7aTx2YXJzLmxlbmd0aDtpKyspIHtcclxuICAgICAgICAgICAgICAgdmFyIHBhaXIgPSB2YXJzW2ldLnNwbGl0KFwiPVwiKVxyXG4gICAgICAgICAgICAgICBpZihwYWlyWzBdID09IHZhcmlhYmxlKXtcclxuICAgICAgICAgICAgICAgICAgIHJldHVybiBwYWlyWzFdXHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIHJldHVybihmYWxzZSlcclxufVxyXG5cclxuay5zdHJfcmVwZWF0ID0gZnVuY3Rpb24oc3RyaW5nLCBjb3VudCkge1xyXG4gICAgaWYgKGNvdW50IDwgMSkgcmV0dXJuICcnXHJcbiAgICB2YXIgcmVzdWx0ID0gJydcclxuICAgIHZhciBwYXR0ZXJuID0gc3RyaW5nLnZhbHVlT2YoKVxyXG4gICAgd2hpbGUgKGNvdW50ID4gMCkge1xyXG4gICAgICAgIGlmIChjb3VudCAmIDEpIHJlc3VsdCArPSBwYXR0ZXJuXHJcbiAgICAgICAgY291bnQgPj49IDFcclxuICAgICAgICBwYXR0ZXJuICs9IHBhdHRlcm5cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHRcclxufVxyXG5cclxuay5vYmpfbmFtZXMgPSBmdW5jdGlvbiggb2JqZWN0ICkge1xyXG4gICAgaWYoIG9iamVjdCAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgIHZhciBhID0gW107XHJcbiAgICAgICAgZm9yKCB2YXIgaWQgaW4gb2JqZWN0ICkge1xyXG4gICAgICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGlkKSApICB7XHJcbiAgICAgICAgICAgICAgICBhLnB1c2goaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhO1xyXG4gICAgfVxyXG59XHJcblxyXG5rLm9iaklkQXJyYXkgPSBmdW5jdGlvbiggb2JqZWN0ICkge1xyXG4gICAgaWYoIG9iamVjdCAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgIHZhciBhID0gW107XHJcbiAgICAgICAgZm9yKCB2YXIgaWQgaW4gb2JqZWN0ICkge1xyXG4gICAgICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGlkKSApICB7XHJcbiAgICAgICAgICAgICAgICBhLnB1c2goaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIE1hdGgsIG51bWJlcnMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG4vKlxyXG4gKiAgbm9ybVJhbmQ6IHJldHVybnMgbm9ybWFsbHkgZGlzdHJpYnV0ZWQgcmFuZG9tIG51bWJlcnNcclxuICogIGh0dHA6Ly9tZW1vcnkucHN5Y2gubXVuLmNhL3RlY2gvc25pcHBldHMvcmFuZG9tX25vcm1hbC9cclxuICovXHJcbmsubm9ybVJhbmQgPSBmdW5jdGlvbihtdSwgc2lnbWEpIHtcclxuICAgIHZhciB4MSwgeDIsIHJhZDtcclxuXHJcbiAgICBkbyB7XHJcbiAgICAgICAgeDEgPSAyICogTWF0aC5yYW5kb20oKSAtIDE7XHJcbiAgICAgICAgeDIgPSAyICogTWF0aC5yYW5kb20oKSAtIDE7XHJcbiAgICAgICAgcmFkID0geDEgKiB4MSArIHgyICogeDI7XHJcbiAgICB9IHdoaWxlKHJhZCA+PSAxIHx8IHJhZCA9PT0gMCk7XHJcblxyXG4gICAgdmFyIGMgPSBNYXRoLnNxcnQoLTIgKiBNYXRoLmxvZyhyYWQpIC8gcmFkKTtcclxuICAgIHZhciBuID0geDEgKiBjO1xyXG4gICAgcmV0dXJuIChuICogbXUpICsgc2lnbWE7XHJcbn1cclxuXHJcbmsucGFkX3plcm8gPSBmdW5jdGlvbihudW0sIHNpemUpe1xyXG4gICAgdmFyIHMgPSAnMDAwMDAwMDAwJyArIG51bVxyXG4gICAgcmV0dXJuIHMuc3Vic3RyKHMubGVuZ3RoLXNpemUpXHJcbn1cclxuXHJcblxyXG5rLnVwdGltZSA9IGZ1bmN0aW9uKGJvb3RfdGltZSl7XHJcbiAgICB2YXIgdXB0aW1lX3NlY29uZHNfdG90YWwgPSBtb21lbnQoKS5kaWZmKGJvb3RfdGltZSwgJ3NlY29uZHMnKVxyXG4gICAgdmFyIHVwdGltZV9ob3VycyA9IE1hdGguZmxvb3IoICB1cHRpbWVfc2Vjb25kc190b3RhbCAvKDYwKjYwKSApXHJcbiAgICB2YXIgbWludXRlc19sZWZ0ID0gdXB0aW1lX3NlY29uZHNfdG90YWwgJSg2MCo2MClcclxuICAgIHZhciB1cHRpbWVfbWludXRlcyA9IGsucGFkX3plcm8oIE1hdGguZmxvb3IoICBtaW51dGVzX2xlZnQgLzYwICksIDIgKVxyXG4gICAgdmFyIHVwdGltZV9zZWNvbmRzID0gay5wYWRfemVybyggKG1pbnV0ZXNfbGVmdCAlIDYwKSwgMiApXHJcbiAgICByZXR1cm4gdXB0aW1lX2hvdXJzICtcIjpcIisgdXB0aW1lX21pbnV0ZXMgK1wiOlwiKyB1cHRpbWVfc2Vjb25kc1xyXG59XHJcblxyXG5cclxuXHJcbmsubGFzdF9uX3ZhbHVlcyA9IGZ1bmN0aW9uKG4pe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuOiBuLFxyXG4gICAgICAgIGFycmF5OiBbXSxcclxuICAgICAgICBhZGQ6IGZ1bmN0aW9uKG5ld192YWx1ZSl7XHJcbiAgICAgICAgICAgIHRoaXMuYXJyYXkucHVzaChuZXdfdmFsdWUpXHJcbiAgICAgICAgICAgIGlmKCB0aGlzLmFycmF5Lmxlbmd0aCA+IG4gKSB0aGlzLmFycmF5LnNoaWZ0KClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmsuYXJyYXlNYXggPSBmdW5jdGlvbihudW1BcnJheSkge1xyXG4gICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KG51bGwsIG51bUFycmF5KTtcclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gQUpBWCAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuay5BSkFYID0gZnVuY3Rpb24odXJsLCBjYWxsYmFjaywgb2JqZWN0KSB7XHJcbiAgICB2YXIgeG1saHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgIHhtbGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHhtbGh0dHAucmVhZHlTdGF0ZSA9PSBYTUxIdHRwUmVxdWVzdC5ET05FICkge1xyXG4gICAgICAgICAgICBpZih4bWxodHRwLnN0YXR1cyA9PSAyMDApe1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soeG1saHR0cC5yZXNwb25zZVRleHQsIG9iamVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZih4bWxodHRwLnN0YXR1cyA9PSA0MDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdUaGVyZSB3YXMgYW4gZXJyb3IgNDAwJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzb21ldGhpbmcgZWxzZSBvdGhlciB0aGFuIDIwMCB3YXMgcmV0dXJuZWQnKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHhtbGh0dHAub3BlbihcIkdFVFwiLCB1cmwsIHRydWUpO1xyXG4gICAgeG1saHR0cC5zZW5kKCk7XHJcbn1cclxuXHJcbmsucGFyc2VDU1YgPSBmdW5jdGlvbihmaWxlX2NvbnRlbnQpIHtcclxuICAgIHZhciByID0gW11cclxuICAgIHZhciBsaW5lcyA9IGZpbGVfY29udGVudC5zcGxpdCgnXFxuJyk7XHJcbiAgICB2YXIgaGVhZGVyID0gbGluZXMuc2hpZnQoKS5zcGxpdCgnLCcpO1xyXG4gICAgaGVhZGVyLmZvckVhY2goZnVuY3Rpb24oZWxlbSwgaWQpe1xyXG4gICAgICAgIGhlYWRlcltpZF0gPSBlbGVtLnRyaW0oKTtcclxuICAgIH0pO1xyXG4gICAgZm9yKHZhciBsID0gMCwgbGVuID0gbGluZXMubGVuZ3RoOyBsIDwgbGVuOyBsKyspe1xyXG4gICAgICAgIHZhciBsaW5lID0gbGluZXNbbF07XHJcbiAgICAgICAgaWYobGluZS5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgdmFyIGxpbmVfb2JqID0ge307XHJcbiAgICAgICAgICAgIGxpbmUuc3BsaXQoJywnKS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0saSl7XHJcbiAgICAgICAgICAgICAgICBsaW5lX29ialtoZWFkZXJbaV1dID0gaXRlbS50cmltKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByLnB1c2gobGluZV9vYmopO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybihyKTtcclxufTtcclxuXHJcbmsuZ2V0Q1NWID0gZnVuY3Rpb24oVVJMLCBjYWxsYmFjaykge1xyXG4gICAgay5BSkFYKFVSTCwgay5wYXJzZUNTVigpIClcclxufVxyXG5cclxuLypcclxuJC5hamF4U2V0dXAgKHtcclxuICAgIGNhY2hlOiBmYWxzZVxyXG59KVxyXG5cclxuXHJcblxyXG5rLmdldF9KU09OID0gZnVuY3Rpb24oVVJMLCBjYWxsYmFjaywgc3RyaW5nKSB7XHJcbi8vICAgIHZhciBmaWxlbmFtZSA9IFVSTC5zcGxpdCgnLycpLnBvcCgpXHJcbi8vICAgIGNvbnNvbGUubG9nKFVSTClcclxuICAgICQuZ2V0SlNPTiggVVJMLCBmdW5jdGlvbigganNvbiApIHtcclxuICAgICAgICBjYWxsYmFjayhqc29uLCBVUkwsIHN0cmluZylcclxuICAgIH0pLmZhaWwoZnVuY3Rpb24oanF4aHIsIHRleHRTdGF0dXMsIGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coIFwiZXJyb3JcIiwgdGV4dFN0YXR1cywgZXJyb3IgIClcclxuICAgIH0pXHJcbn1cclxuXHJcblxyXG5rLmxvYWRfZmlsZXMgPSBmdW5jdGlvbihmaWxlX2xpc3QsIGNhbGxiYWNrKXtcclxuICAgIHZhciBkID0ge31cclxuXHJcbiAgICBmdW5jdGlvbiBsb2FkX2ZpbGUoVVJMKXtcclxuICAgICAgICB2YXIgZmlsZW5hbWUgPSBVUkwuc3BsaXQoJy8nKS5wb3AoKVxyXG4vLyAgICAgICAgdmFyIG5hbWUgPSBmaWxlbmFtZS5zcGxpdCgnLicpWzBdXHJcbiAgICAgICAgJC5nZXRKU09OKCBVUkwsIGZ1bmN0aW9uKCBqc29uICkgeyAvLyAsIHRleHRTdGF0dXMsIGpxWEhSKSB7XHJcbiAgICAgICAgICAgIGFkZF9KU09OKGZpbGVuYW1lLCBqc29uKVxyXG4gICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oanF4aHIsIHRleHRTdGF0dXMsIGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcImVycm9yXCIsIHRleHRTdGF0dXMsIGVycm9yICApXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhZGRfSlNPTihuYW1lLCBqc29uKXtcclxuICAgICAgICBkW25hbWVdID0ganNvblxyXG4gICAgICAgIGlmKE9iamVjdC5rZXlzKGQpLmxlbmd0aCA9PSBkX2ZpbGVzLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGQpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciggdmFyIGtleSBpbiBmaWxlX2xpc3Qpe1xyXG4gICAgICAgIHZhciBVUkwgPSBmaWxlX2xpc3Rba2V5XVxyXG4gICAgICAgIGxvYWRfZmlsZShVUkwpXHJcbiAgICB9XHJcblxyXG4vLyAgICBjYWxsYmFjayhkKVxyXG59XHJcblxyXG5rLmdldEZpbGUgPSBmdW5jdGlvbihVUkwsIGNhbGxiYWNrKXtcclxuICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiBVUkwsXHJcbiAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24oIHhociApIHtcclxuICAgICAgICAgICAgeGhyLm92ZXJyaWRlTWltZVR5cGUoIFwidGV4dC9wbGFpbjsgY2hhcnNldD14LXVzZXItZGVmaW5lZFwiICk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIC5kb25lKGZ1bmN0aW9uKCBkYXRhICkge1xyXG4gICAgICAgIGNhbGxiYWNrKGRhdGEpXHJcbiAgICB9KVxyXG4gICAgLmZhaWwoZnVuY3Rpb24oanF4aHIsIHRleHRTdGF0dXMsIGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcImVycm9yXCIsIHRleHRTdGF0dXMsIGVycm9yICApXHJcbiAgICB9KVxyXG5cclxuXHJcbn1cclxuKi9cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gSFRNTCAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcblxyXG5cclxuay5zZXR1cF9ib2R5ID0gZnVuY3Rpb24odGl0bGUsIHNlY3Rpb25zKXtcclxuICAgIGRvY3VtZW50LnRpdGxlID0gdGl0bGVcclxuICAgIHZhciBib2R5ID0gZG9jdW1lbnQuYm9keVxyXG4gICAgdmFyIHN0YXR1c19iYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxyXG4gICAgc3RhdHVzX2Jhci5pZCA9ICdzdGF0dXMnXHJcbiAgICBzdGF0dXNfYmFyLmlubmVySFRNTCA9ICdsb2FkaW5nIHN0YXR1cy4uLidcclxuICAgIC8qXHJcbiAgICB2YXIgdGl0bGVfaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKVxyXG4gICAgdGl0bGVfaGVhZGVyLmlubmVySFRNTCA9IHRpdGxlXHJcbiAgICBib2R5Lmluc2VydEJlZm9yZSh0aXRsZV9oZWFkZXIsIGJvZHkuZmlyc3RDaGlsZClcclxuICAgICovXHJcbiAgICBib2R5Lmluc2VydEJlZm9yZShzdGF0dXNfYmFyLCBib2R5LmZpcnN0Q2hpbGQpXHJcbiAgICAvKlxyXG4gICAgdmFyIHRhYnNfZGl2ID0gay5tYWtlX3RhYnMoc2VjdGlvbnMpXHJcbiAgICAkKCdib2R5JykuYXBwZW5kKHRhYnNfZGl2KVxyXG4gICAgJCggJy50YWJzJyApLnRhYnMoe1xyXG4gICAgICAgIGFjdGl2YXRlOiBmdW5jdGlvbiggZXZlbnQsIHVpICkge1xyXG4gICAgICAgICAgICB2YXIgZnVsbF90aXRsZSA9IHRpdGxlICsgXCIgLyBcIiArIHVpLm5ld1RhYlswXS50ZXh0Q29udGVudFxyXG4gICAgICAgICAgICBkb2N1bWVudC50aXRsZSA9IGZ1bGxfdGl0bGVcclxuICAgICAgICAgICAgJCgnI3RpdGxlJykudGV4dChmdWxsX3RpdGxlKVxyXG4gICAgICAgICAgICAvL2R1bXAobW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREIEhIOm1tOnNzJykpXHJcbiAgICAgICAgICAgICQuc3BhcmtsaW5lX2Rpc3BsYXlfdmlzaWJsZSgpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgIHZhciBzZWN0aW9uID0gay5nZXRRdWVyeVZhcmlhYmxlKCdzZWMnKVxyXG4gICAgaWYoc2VjdGlvbiBpbiBzZWN0aW9ucykge1xyXG4gICAgICAgIHZhciBpbmRleCA9ICQoJy50YWJzIGFbaHJlZj1cIiMnK3NlY3Rpb24rJ1wiXScpLnBhcmVudCgpLmluZGV4KClcclxuICAgICAgICAkKFwiLnRhYnNcIikudGFicyhcIm9wdGlvblwiLCBcImFjdGl2ZVwiLCBpbmRleClcclxuICAgIH1cclxuICAgICovXHJcblxyXG59XHJcbi8qXHJcbmsubWFrZV90YWJzID0gZnVuY3Rpb24oc2VjdGlvbl9vYmope1xyXG4gICAgdmFyIHRhYnNfZGl2ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygndGFicycpXHJcbiAgICB2YXIgaGVhZF9kaXYgPSAkKCc8dWw+JykuYXBwZW5kVG8odGFic19kaXYpXHJcblxyXG4gICAgZm9yICh2YXIgaWQgaW4gc2VjdGlvbl9vYmope1xyXG4gICAgICAgIHZhciB0aXRsZSA9IHNlY3Rpb25fb2JqW2lkXVxyXG4gICAgICAgIC8vKCc8bGk+PGEgaHJlZj1cIiMnK2lkKydcIj4nK3RpdGxlKyc8L2E+PC9saT4nKSlcclxuICAgICAgICAvLygnPGRpdiBpZD1cIicraWQrJ1wiPjwvZGl2PicpKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0YWJzX2RpdlxyXG59XHJcblxyXG4qL1xyXG5rLnVwZGF0ZV9zdGF0dXNfcGFnZSA9IGZ1bmN0aW9uKHN0YXR1c19pZCwgYm9vdF90aW1lLCBzdHJpbmcpIHtcclxuICAgIHZhciBzdGF0dXNfZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3RhdHVzX2lkKVxyXG4gICAgc3RhdHVzX2Rpdi5pbm5lckhUTUwgPSBzdHJpbmdcclxuICAgIHN0YXR1c19kaXYuaW5uZXJIVE1MICs9ICcgfCAnXHJcblxyXG4gICAgdmFyIGNsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgICBjbG9jay5pbm5lckhUTUwgPSBtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKVxyXG5cclxuICAgIHZhciB1cHRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgIHVwdGltZS5pbm5lckhUTUwgPSAnVXB0aW1lOiAnICsgay51cHRpbWUoYm9vdF90aW1lKVxyXG5cclxuICAgIHN0YXR1c19kaXYuYXBwZW5kQ2hpbGQoY2xvY2spXHJcbiAgICBzdGF0dXNfZGl2LmlubmVySFRNTCArPSAnIHwgJ1xyXG4gICAgc3RhdHVzX2Rpdi5hcHBlbmRDaGlsZCh1cHRpbWUpXHJcbiAgICBzdGF0dXNfZGl2LmlubmVySFRNTCArPSAnIHwgJ1xyXG59XHJcblxyXG4vKlxyXG5rLm9ial9sb2cgPSBmdW5jdGlvbihvYmosIG9ial9uYW1lLCBtYXhfbGV2ZWwpe1xyXG4gICAgdmFyIGxldmVscyA9IGZ1bmN0aW9uKG9iaiwgbGV2ZWxfaW5kZW50LCBzdHIpe1xyXG4gICAgICAgIGZvcih2YXIgbmFtZSBpbiBvYmopIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBvYmpbbmFtZV1cclxuICAgICAgICAgICAgaWYoIGxldmVsX2luZGVudCA8PSBtYXhfbGV2ZWwgJiYgdHlwZW9mKGl0ZW0pID09ICdvYmplY3QnICkge1xyXG4gICAgICAgICAgICAgICAgc3RyICs9IFwiXFxuXCIgKyBrLnN0cl9yZXBlYXQoXCIgXCIsIGxldmVsX2luZGVudCoyKSArIG5hbWVcclxuICAgICAgICAgICAgICAgIHN0ciA9IGxldmVscyhpdGVtLCBsZXZlbF9pbmRlbnQrMSwgc3RyIClcclxuICAgICAgICAgICAgfSBlbHNlIGlmKHR5cGVvZiBpdGVtICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICBzdHIgKz0gXCJcXG5cIiArIGsuc3RyX3JlcGVhdChcIiBcIiwgbGV2ZWxfaW5kZW50KjIpICsgbmFtZSArIFwiOiBcIiArIGl0ZW1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHN0ciArPSBcIlxcblwiICsgay5zdHJfcmVwZWF0KFwiIFwiLCBsZXZlbF9pbmRlbnQqMikgKyBuYW1lICsgXCI6IDxmdW5jdGlvbj5cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdHJcclxuICAgIH1cclxuICAgIHZhciBtYXhfbGV2ZWwgPSBtYXhfbGV2ZWwgfHwgMTAwXHJcbiAgICBjb25zb2xlLmxvZyhvYmpfbmFtZSlcclxuICAgIHZhciBzdHIgPSAnLScgKyBvYmpfbmFtZSArICctJ1xyXG4gICAgbWF4X2xldmVsKytcclxuICAgIGxldmVsX2luZGVudCA9IDJcclxuICAgIHN0ciA9IGxldmVscyhvYmosIGxldmVsX2luZGVudCwgc3RyKVxyXG4gICAgY29uc29sZS5sb2coc3RyKVxyXG59XHJcblxyXG5cclxuay5vYmpfdHJlZSA9IGZ1bmN0aW9uKG9iaiwgdGl0bGUpe1xyXG4gICAgLy8gdGFrZXMgYSBqYXZhc2NyaXB0LCBhbmQgcmV0dXJlbnMgYSBqcXVlcnkgRElWXHJcbiAgICB2YXIgb2JqX2RpdiA9ICQoJzxwcmU+JykgLy8uYWRkQ2xhc3MoJ2JveCcpXHJcbiAgICB2YXIgbGV2ZWxzID0gZnVuY3Rpb24ob2JqLCBsZXZlbF9pbmRlbnQpeyhsaW5lLCBjaXJjbGUsIHRleHQgKVxyXG4gICAgICAgIHZhciBsaXN0ID0gW11cclxuICAgICAgICB2YXIgb2JqX2xlbmd0aCA9IDBcclxuICAgICAgICBmb3IoIHZhciBrZXkgaW4gb2JqKSB7b2JqX2xlbmd0aCsrfVxyXG4gICAgICAgIHZhciBjb3VudCA9IDBcclxuICAgICAgICBmb3IodmFyIGtleSBpbiBvYmopIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBvYmpba2V5XVxyXG5cclxuLy8gICAgICAgICAgICB2YXIgaW5kZW50X3N0cmluZyA9ICcmbmJzcDsmbmJzcDsmbmJzcDsmIzk0NzQnLnJlcGVhdChsZXZlbCkgKyAnJm5ic3A7Jm5ic3A7Jm5ic3A7J1xyXG4vLyAgICAgICAgICAgIGlmKGxldmVsX2luZGVudCA9PT0gJycgKXtcclxuLy8gICAgICAgICAgICAgICAgbmV4dF9sZXZlbF9pbmRlbnQgPSBsZXZlbF9pbmRlbnQgKyAnJm5ic3A7Jm5ic3A7J1xyXG4vLyAgICAgICAgICAgICAgICB0aGlzX2xldmVsX2luZGVudCA9IGxldmVsX2luZGVudCArICcmbmJzcDsmbmJzcDsnXHJcbi8vICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIGlmKGNvdW50ID09IG9ial9sZW5ndGgtMSApIHsgICAvLyBJZiBsYXN0IGl0ZW0sIGZpbnNoIHRyZWUgc2VjdGlvblxyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyZuYnNwOydcclxuICAgICAgICAgICAgICAgIHZhciB0aGlzX2xldmVsX2luZGVudCA9IGxldmVsX2luZGVudCArICcmbmJzcDsmIzk0OTI7JiM5NDcyOydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgdmFyIG5leHRfbGV2ZWxfaW5kZW50ID0gbGV2ZWxfaW5kZW50ICsgJyZuYnNwOyYjOTQ3NDsnXHJcbiAgICAgICAgICAgICAgICB2YXIgdGhpc19sZXZlbF9pbmRlbnQgPSBsZXZlbF9pbmRlbnQgKyAnJm5ic3A7JiM5NTAwOyYjOTQ3MjsnXHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICBpZiggdHlwZW9mKGl0ZW0pID09ICdvYmplY3QnICl7XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2goIHRoaXNfbGV2ZWxfaW5kZW50ICsga2V5KVxyXG4gICAgICAgICAgICAgICAgbGlzdCA9IGxpc3QuY29uY2F0KCBsZXZlbHMoaXRlbSwgbmV4dF9sZXZlbF9pbmRlbnQpIClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSBpdGVtLnRvU3RyaW5nKCkucmVwbGFjZSgvKFxcclxcbnxcXG58XFxyKS9nbSxcIiBcIikucmVwbGFjZSgvXFxzKy9nLFwiIFwiKSAvL2h0dHA6Ly93d3cudGV4dGZpeGVyLmNvbS90dXRvcmlhbHMvamF2YXNjcmlwdC1saW5lLWJyZWFrcy5waHBcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzX2xldmVsX2luZGVudCArIGtleStcIjogXCIrIGl0ZW0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4vLyAgICAgICAgICAgIGNvbnNvbGUubG9nKGtleSxsZXZlbClcclxuICAgICAgICAgICAgY291bnQrK1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3RcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGlzdCA9IFt0aXRsZV0uY29uY2F0KGxldmVscyhvYmosJycpKVxyXG4gICAgbGlzdC5mb3JFYWNoKCBmdW5jdGlvbihsaW5lLGtleSl7XHJcbiAgICAgICAgb2JqX2Rpdi5hcHBlbmQobGluZSArICc8L2JyPicpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIG9ial9kaXZcclxufVxyXG5cclxuXHJcblxyXG5cclxuLypcclxuay5vYmpfZGlzcGxheSA9IGZ1bmN0aW9uKG9iail7XHJcbiAgICBmdW5jdGlvbiBsZXZlbHMob2JqLGxldmVsKXtcclxuICAgIC8vICAgIHZhciBzdWJvYmpfZGl2ID0gJCgnPGRpdj4nKVxyXG4gICAgICAgIHZhciBzdWJvYmpfdWwgPSAkKCc8dWw+JykuYWRkQ2xhc3MoJ3RyZWUnKVxyXG5cclxuICAgICAgICBmb3IodmFyIGtleSBpbiBvYmopIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBvYmpba2V5XVxyXG4gICAgLy8gICAgICAgIGNvbnNvbGUubG9nKGtleSwgdHlwZW9mKGl0ZW0pKVxyXG4gICAgICAgICAgICBpZiggdHlwZW9mKGl0ZW0pID09ICdvYmplY3QnICl7XHJcbiAgICAvLyAgICAgICAgICAgICgnPGxpPicpLnRleHQoXCImbmJzcDtcIi5yZXBlYXQobGV2ZWwpICsga2V5KSlcclxuICAgICAgICAgICAgICAgICgnPGxpPicpLnRleHQoa2V5KSlcclxuICAgICAgICAgICAgICAgIHN1Ym9ial91bC5hcHBlbmQobGV2ZWxzKGl0ZW0sbGV2ZWwrMSkpXHJcbiAgICAvLyAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiJm5ic3A7XCIucmVwZWF0KGxldmVsKSArIGtleSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgICAgc3Vib2JqX2Rpdi5hcHBlbmQoJzxzcGFuPicpLnRleHQoXCImbmJzcDtcIi5yZXBlYXQobGV2ZWwpICsga2V5K1wiOiBcIisgaXRlbSlcclxuICAgIC8vICAgICAgICAgICAgKCc8bGk+JykudGV4dChcIiZuYnNwO1wiLnJlcGVhdChsZXZlbCkgKyBrZXkgK1wiOiBcIisgaXRlbSkpXHJcbiAgICAgICAgICAgICAgICAoJzxsaT4nKS50ZXh0KGtleSArXCI6IFwiKyBpdGVtKSlcclxuICAgIC8vICAgICAgICAgICAgY29uc29sZS5sb2coXCImbmJzcDtcIi5yZXBlYXQobGV2ZWwpICsga2V5K1wiOiBcIisgaXRlbSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3Vib2JqX3VsXHJcbiAgICB9XHJcbiAgICAvLyB0YWtlcyBhIGphdmFzY3JpcHQsIGFuZCByZXR1cmVucyBhIGpxdWVyeSBESVZcclxuICAgIHZhciBvYmpfZGl2ID0gJCgnPGRpdj4nKS8vLmFkZENsYXNzKCdib3gnKVxyXG5cclxuICAgIG9ial9kaXYuYXBwZW5kKGxldmVscyhvYmosMCkpXHJcbiAgICByZXR1cm4gb2JqX2RpdlxyXG59XHJcblxyXG5rLnNob3dfb2JqID0gZnVuY3Rpb24oY29udGFpbmVyX2lkLCBvYmosIG5hbWUpe1xyXG4gICAgdmFyIGlkID0gJyMnICsgbmFtZVxyXG4gICAgaWYoICEgJChjb250YWluZXJfaWQpLmNoaWxkcmVuKGlkKS5sZW5ndGggKSB7XHJcbiAgICAgICAgKCc8ZGl2PicpLmF0dHIoJ2lkJywgbmFtZSkpXHJcbiAgICB9XHJcbiAgICB2YXIgYm94ID0gJChjb250YWluZXJfaWQpLmNoaWxkcmVuKGlkKVxyXG4gICAgYm94LmVtcHR5KClcclxuXHJcbiAgICB2YXIgb2JqX2RpdiA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ2JveCcpXHJcbiAgICBvYmpfZGl2LmFwcGVuZChrLm9ial90cmVlKG9iaiwgbmFtZSkpXHJcbiAgICBib3guYXBwZW5kKG9ial9kaXYpXHJcblxyXG59XHJcblxyXG4qL1xyXG5rLmxvZ19vYmplY3RfdHJlZSA9IGZ1bmN0aW9uKGNvbXBvbmVudHMpe1xyXG4gICAgZm9yKCB2YXIgbWFrZSBpbiBjb21wb25lbnRzLm1vZHVsZXMgKXtcclxuICAgICAgICBpZiggY29tcG9uZW50cy5tb2R1bGVzLmhhc093blByb3BlcnR5KG1ha2UpKXtcclxuICAgICAgICAgICAgZm9yKCB2YXIgbW9kZWwgaW4gY29tcG9uZW50cy5tb2R1bGVzW21ha2VdICl7XHJcbiAgICAgICAgICAgICAgICBpZiggY29tcG9uZW50cy5tb2R1bGVzW21ha2VdLmhhc093blByb3BlcnR5KG1vZGVsKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSBjb21wb25lbnRzLm1vZHVsZXNbbWFrZV1bbW9kZWxdXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGEgPSBbbWFrZSxtb2RlbF1cclxuICAgICAgICAgICAgICAgICAgICBmb3IoIHZhciBzcGVjIGluIG8gKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIG8uaGFzT3duUHJvcGVydHkoc3BlYykpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYS5wdXNoKG9bc3BlY10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGEuam9pbignLCcpKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRlNFQyAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcblxyXG5cclxuay5jcjEwMDBfanNvbiA9IGZ1bmN0aW9uKGpzb24pe1xyXG4vLyAgICB2YXIgZmllbGRzID0gW11cclxuLy8gICAgJC5lYWNoKGpzb24uaGVhZC5maWVsZHMsIGZ1bmN0aW9uKGtleSwgZmllbGQpIHtcclxuLy8gICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkLm5hbWUpXHJcbi8vICAgIH0pXHJcbi8vICAgIHZhciBkYXRhID0gXy56aXAoZmllbGRzLCBqc29uLmRhdGFbMF0udmFscylcclxuLy9cclxuICAgIHZhciB0aW1lc3RhbXAgPSBqc29uLmRhdGFbMF0udGltZVxyXG4gICAgdmFyIGRhdGEgPSB7fVxyXG4gICAgZGF0YS5UaW1lc3RhbXAgPSBqc29uLmRhdGFbMF0udGltZVxyXG4gICAgZGF0YS5SZWNvcmROdW0gPSBqc29uLmRhdGFbMF0ubm9cclxuICAgIGZvcih2YXIgaSA9IDAsIGwgPSBqc29uLmhlYWQuZmllbGRzLmxlbmd0aDsgaSA8IGw7IGkrKyApe1xyXG4gICAgICAgIGRhdGFbanNvbi5oZWFkLmZpZWxkc1tpXS5uYW1lXSA9IGpzb24uZGF0YVswXS52YWxzW2ldXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRhdGFcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gRDMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcblxyXG5rLmQzID0ge31cclxuXHJcbmsuZDMubGl2ZV9zcGFya2xpbmUgPSBmdW5jdGlvbihpZCwgaGlzdG9yeSkge1xyXG4gICAgdmFyIGRhdGEgPSBoaXN0b3J5LmFycmF5XHJcbiAgICB2YXIgbGVuZ3RoID0gaGlzdG9yeS5hcnJheS5sZW5ndGhcclxuICAgIHZhciBuID0gaGlzdG9yeS5uXHJcbiAgICAvL2suZDMubGl2ZV9zcGFya2xpbmUgPSBmdW5jdGlvbihpZCwgd2lkdGgsIGhlaWdodCwgaW50ZXJwb2xhdGlvbiwgYW5pbWF0ZSwgdXBkYXRlRGVsYXksIHRyYW5zaXRpb25EZWxheSkge1xyXG4gICAgLy8gYmFzZWQgb24gY29kZSBwb3N0ZWQgYnkgQmVuIENocmlzdGVuc2VuIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2JlbmpjaHJpc3RlbnNlbi8xMTQ4Mzc0XHJcblxyXG4gICAgdmFyIHdpZHRoID0gNDAwLFxyXG4gICAgICAgIGhlaWdodCA9IDUwLFxyXG4gICAgICAgIGludGVycG9sYXRpb24gPSAnYmFzaXMnLFxyXG4gICAgICAgIGFuaW1hdGUgPSB0cnVlLFxyXG4gICAgICAgIHVwZGF0ZURlbGF5ID0gMTAwMCxcclxuICAgICAgICB0cmFuc2l0aW9uRGVsYXkgPSAxMDAwXHJcblxyXG4gICAgLy8gWCBzY2FsZSB3aWxsIGZpdCB2YWx1ZXMgZnJvbSAwLTEwIHdpdGhpbiBwaXhlbHMgMC0xMDBcclxuICAgIC8vIHN0YXJ0aW5nIHBvaW50IGlzIC01IHNvIHRoZSBmaXJzdCB2YWx1ZSBkb2Vzbid0IHNob3cgYW5kIHNsaWRlcyBvZmYgdGhlIGVkZ2UgYXMgcGFydCBvZiB0aGUgdHJhbnNpdGlvblxyXG4gICAgdmFyIHggPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzAsIDU5XSkucmFuZ2UoWzAsIHdpZHRoXSk7XHJcbiAgICAvLyBZIHNjYWxlIHdpbGwgZml0IHZhbHVlcyBmcm9tIDAtMTAgd2l0aGluIHBpeGVscyAwLTEwMFxyXG4gICAgdmFyIHkgPSBkMy5zY2FsZS5saW5lYXIoKS5kb21haW4oWzIwLCA0MF0pLnJhbmdlKFtoZWlnaHQsIDBdKTtcclxuXHJcbiAgICAvLyBjcmVhdGUgYSBsaW5lIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgdGhlIFNWTiBsaW5lIHdlJ3JlIGNyZWF0aW5nXHJcbiAgICB2YXIgbGluZSA9IGQzLnN2Zy5saW5lKClcclxuICAgICAgICAvLyBhc3NpZ24gdGhlIFggZnVuY3Rpb24gdG8gcGxvdCBvdXIgbGluZSBhcyB3ZSB3aXNoXHJcbiAgICAgICAgLngoZnVuY3Rpb24oZCxpKSB7XHJcbiAgICAgICAgICAgIC8vIHZlcmJvc2UgbG9nZ2luZyB0byBzaG93IHdoYXQncyBhY3R1YWxseSBiZWluZyBkb25lXHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ1Bsb3R0aW5nIFggdmFsdWUgZm9yIGRhdGEgcG9pbnQ6ICcgKyBkICsgJyB1c2luZyBpbmRleDogJyArIGkgKyAnIHRvIGJlIGF0OiAnICsgeChpKSArICcgdXNpbmcgb3VyIHhTY2FsZS4nKTtcclxuICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBYIGNvb3JkaW5hdGUgd2hlcmUgd2Ugd2FudCB0byBwbG90IHRoaXMgZGF0YXBvaW50XHJcbiAgICAgICAgICAgIHJldHVybiB4KGkpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnkoZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAvLyB2ZXJib3NlIGxvZ2dpbmcgdG8gc2hvdyB3aGF0J3MgYWN0dWFsbHkgYmVpbmcgZG9uZVxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdQbG90dGluZyBZIHZhbHVlIGZvciBkYXRhIHBvaW50OiAnICsgZCArICcgdG8gYmUgYXQ6ICcgKyB5KGQpICsgXCIgdXNpbmcgb3VyIHlTY2FsZS5cIik7XHJcbiAgICAgICAgICAgIC8vIHJldHVybiB0aGUgWSBjb29yZGluYXRlIHdoZXJlIHdlIHdhbnQgdG8gcGxvdCB0aGlzIGRhdGFwb2ludFxyXG4gICAgICAgICAgICByZXR1cm4geShkKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5pbnRlcnBvbGF0ZShpbnRlcnBvbGF0aW9uKVxyXG5cclxuICAgIC8vIElmIHN2ZyBkb2VzIG5vdCBleGlzdCwgY3JlYXRlIGl0XHJcbiAgICBpZiggISBkMy5zZWxlY3QoJyMnK2lkKS5zZWxlY3QoJ3N2ZycpWzBdWzBdICl7XHJcbiAgICAgICAgLy8gY3JlYXRlIGFuIFNWRyBlbGVtZW50IGluc2lkZSB0aGUgI2dyYXBoIGRpdiB0aGF0IGZpbGxzIDEwMCUgb2YgdGhlIGRpdlxyXG4gICAgICAgIHZhciBncmFwaCA9IGQzLnNlbGVjdCgnIycraWQpLmFwcGVuZChcInN2ZzpzdmdcIikuYXR0cihcIndpZHRoXCIsIHdpZHRoKS5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIC8vIGRpc3BsYXkgdGhlIGxpbmUgYnkgYXBwZW5kaW5nIGFuIHN2ZzpwYXRoIGVsZW1lbnQgd2l0aCB0aGUgZGF0YSBsaW5lIHdlIGNyZWF0ZWQgYWJvdmVcclxuLy8gICAgICAgIGdyYXBoLmFwcGVuZChcInN2ZzpwYXRoXCIpLmF0dHIoXCJkXCIsIGxpbmUoZGF0YSkpO1xyXG4gICAgICAgIC8vIG9yIGl0IGNhbiBiZSBkb25lIGxpa2UgdGhpc1xyXG4gICAgICAgIGdyYXBoLnNlbGVjdEFsbChcInBhdGhcIikuZGF0YShbZGF0YV0pLmVudGVyKCkuYXBwZW5kKFwic3ZnOnBhdGhcIikuYXR0cihcImRcIiwgbGluZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGdyYXBoID0gZDMuc2VsZWN0KCcjJytpZCsnIHN2ZycpXHJcbiAgICBjb25zb2xlLmxvZyggbGVuZ3RoKVxyXG4gICAgLy8gdXBkYXRlIHdpdGggYW5pbWF0aW9uXHJcbiAgICBncmFwaC5zZWxlY3RBbGwoXCJwYXRoXCIpXHJcbiAgICAgICAgLmRhdGEoW2RhdGFdKSAvLyBzZXQgdGhlIG5ldyBkYXRhXHJcbiAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyB4KG4tbGVuZ3RoICsxKSArIFwiKVwiKSAvLyBzZXQgdGhlIHRyYW5zZm9ybSB0byB0aGUgcmlnaHQgYnkgeCgxKSBwaXhlbHMgKDYgZm9yIHRoZSBzY2FsZSB3ZSd2ZSBzZXQpIHRvIGhpZGUgdGhlIG5ldyB2YWx1ZVxyXG4gICAgICAgIC5hdHRyKFwiZFwiLCBsaW5lKSAvLyBhcHBseSB0aGUgbmV3IGRhdGEgdmFsdWVzIC4uLiBidXQgdGhlIG5ldyB2YWx1ZSBpcyBoaWRkZW4gYXQgdGhpcyBwb2ludCBvZmYgdGhlIHJpZ2h0IG9mIHRoZSBjYW52YXNcclxuICAgICAgICAudHJhbnNpdGlvbigpIC8vIHN0YXJ0IGEgdHJhbnNpdGlvbiB0byBicmluZyB0aGUgbmV3IHZhbHVlIGludG8gdmlld1xyXG4gICAgICAgIC5lYXNlKFwibGluZWFyXCIpXHJcbiAgICAgICAgLmR1cmF0aW9uKHRyYW5zaXRpb25EZWxheSkgLy8gZm9yIHRoaXMgZGVtbyB3ZSB3YW50IGEgY29udGludWFsIHNsaWRlIHNvIHNldCB0aGlzIHRvIHRoZSBzYW1lIGFzIHRoZSBzZXRJbnRlcnZhbCBhbW91bnQgYmVsb3dcclxuICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIHgobi1sZW5ndGgpICsgXCIpXCIpOyAvLyBhbmltYXRlIGEgc2xpZGUgdG8gdGhlIGxlZnQgYmFjayB0byB4KDApIHBpeGVscyB0byByZXZlYWwgdGhlIG5ldyB2YWx1ZVxyXG5cclxuICAgICAgICAvKiB0aGFua3MgdG8gJ2JhcnJ5bScgZm9yIGV4YW1wbGVzIG9mIHRyYW5zZm9ybTogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vMTEzNzEzMSAqL1xyXG4vLyAgICAgZ3JhcGguYXBwZW5kKFwicmVjdFwiKVxyXG4vLyAgICAgICAgICAuYXR0cihcInhcIiwgMClcclxuLy8gICAgICAgICAgLmF0dHIoXCJ5XCIsIDApXHJcbi8vICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodClcclxuLy8gICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcclxuLy8gICAgICAgICAgLnN0eWxlKFwic3Ryb2tlXCIsICcjZjAwJylcclxuLy8gICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBcIm5vbmVcIilcclxuLy8gICAgICAgICAgLnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsICcxcHgnKVxyXG5cclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBFdmVudHMgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5rLmUgPSB7fVxyXG5cclxuay51cHRpbWUgPSBmdW5jdGlvbihib290X3RpbWUpe1xyXG4gICAgdmFyIHVwdGltZV9zZWNvbmRzX3RvdGFsID0gbW9tZW50KCkuZGlmZihib290X3RpbWUsICdzZWNvbmRzJylcclxuICAgIHZhciB1cHRpbWVfaG91cnMgPSBNYXRoLmZsb29yKCAgdXB0aW1lX3NlY29uZHNfdG90YWwgLyg2MCo2MCkgKVxyXG4gICAgdmFyIG1pbnV0ZXNfbGVmdCA9IHVwdGltZV9zZWNvbmRzX3RvdGFsICUoNjAqNjApXHJcbiAgICB2YXIgdXB0aW1lX21pbnV0ZXMgPSBrLnBhZF96ZXJvKCBNYXRoLmZsb29yKCAgbWludXRlc19sZWZ0IC82MCApLCAyIClcclxuICAgIHZhciB1cHRpbWVfc2Vjb25kcyA9IGsucGFkX3plcm8oIChtaW51dGVzX2xlZnQgJSA2MCksIDIgKVxyXG4gICAgcmV0dXJuIHVwdGltZV9ob3VycyArXCI6XCIrIHVwdGltZV9taW51dGVzICtcIjpcIisgdXB0aW1lX3NlY29uZHNcclxufVxyXG5cclxuay5lLmFkZFRpbWVTaW5jZSA9IGZ1bmN0aW9uKGV2ZW50X2xpc3Qpe1xyXG4gICAgY29uc29sZS5sb2cobW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREJykpXHJcbiAgICBjb25zb2xlLmxvZyhtb21lbnQoKS5mcm9tTm93KCkpXHJcbiAgICBldmVudF9saXN0LmZvckVhY2goZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgIHZhciBkYXRlX2FycmF5ID0gZXZlbnQuZGF0ZS5zcGxpdCgnLScpLm1hcChOdW1iZXIpXHJcbiAgICAgICAgdmFyIHllYXIgPSBkYXRlX2FycmF5WzBdXHJcbiAgICAgICAgdmFyIG1vbnRoID0gZGF0ZV9hcnJheVsxXVxyXG4gICAgICAgIHZhciBkYXkgPSBkYXRlX2FycmF5WzJdXHJcbiAgICAgICAgdmFyIHRoaXNfeWVhciA9IG1vbWVudCgpLnllYXIoKVxyXG4gICAgICAgIGlmKG1vbWVudCgpLmRpZmYobW9tZW50KFt0aGlzX3llYXIsIG1vbnRoLTEsIGRheV0pLCAnZGF5cycpID4gMCkge3RoaXNfeWVhcisrfVxyXG4gICAgICAgIHZhciBldmVudF9tb21lbnQgPSBtb21lbnQoZXZlbnQuZGF0ZSwgJ1lZWVktTU0tREQnKVxyXG4gICAgICAgIHZhciBkYXlzX2FnbyA9IG1vbWVudCgpLmRpZmYoZXZlbnRfbW9tZW50LCAnZGF5JylcclxuICAgICAgICBldmVudC50aW1lX3NpbmNlID0gZXZlbnRfbW9tZW50LmZyb21Ob3coKVxyXG4gICAgICAgIGV2ZW50LnllYXJzX2FnbyA9IG1vbWVudCgpLmRpZmYoZXZlbnRfbW9tZW50LCAneWVhcnMnKVxyXG4gICAgICAgIGV2ZW50LmRheXNfdGlsbF9uZXh0ID0gLW1vbWVudCgpLmRpZmYobW9tZW50KFt0aGlzX3llYXIsIG1vbnRoLTEsIGRheV0pLCAnZGF5cycpXHJcbiAgICB9KVxyXG4gICAgZXZlbnRfbGlzdC5zb3J0KGZ1bmN0aW9uKGEsYil7XHJcbiAgICAgICAgcmV0dXJuIGEuZGF5c190aWxsX25leHQgLSBiLmRheXNfdGlsbF9uZXh0XHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIGV2ZW50X2xpc3RcclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIERpc3BsYXlzIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmsuZCA9IHt9XHJcblxyXG4vKlxyXG5rLmQgPSB7XHJcbiAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgdmFsdWU6IDAsXHJcblxyXG59XHJcblxyXG5rLmQucHJvdG90eXBlLnNldFBlciA9IGZ1bmN0aW9uKHBlcmNlbnQpe1xyXG4gICAgdGhpcy5iYXIuY3NzKCd3aWR0aCcsIHBlcmNlbnQrJyUnKVxyXG59XHJcbiovXHJcblxyXG5cclxuLypcclxuay5kLmJhciA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgYmFyID0ge31cclxuXHJcbiAgICBiYXIud2lkdGggPSAxMDBcclxuICAgIGJhci53aWR0aF91bml0ID0gJyUnXHJcbiAgICBiYXIuaGVpZ2h0ID0gJzhweCdcclxuXHJcbiAgICBjb25zb2xlLmxvZyhiYXIud2lkdGgrJyUnKVxyXG4gICAgYmFyLmRpdiA9ICQoJzxkaXY+JykuY3NzKCd3aWR0aCcsICcwJScpXHJcbiAgICBiYXIuZWxlbWVudCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ3Byb2dyZXNzYmFyJykuY3NzKCd3aWR0aCcsIDEwMClcclxuICAgIGJhci5lbGVtZW50LmFwcGVuZChiYXIuZGl2KVxyXG5cclxuICAgIGJhci5zZXRQZXJjZW50ID0gZnVuY3Rpb24ocGVyY2VudCl7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHBlcmNlbnRcclxuICAgICAgICB0aGlzLndpZHRoX3VuaXQgPSAnJSdcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpXHJcbiAgICB9XHJcbiAgICBiYXIudXBkYXRlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICB0aGlzLmRpdi5jc3MoJ3dpZHRoJywgdGhpcy53aWR0aCt0aGlzLndpZHRoX3VuaXQpXHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNzcygnaGVpZ2h0JywgdG9TdHJpbmcodGhpcy5oZWlnaHQpKydweCcpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gYmFyXHJcbn1cclxuKi9cclxuXHJcblxyXG4vLyBCcm93c2VyaWZ5XHJcbm1vZHVsZS5leHBvcnRzID0gaztcclxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGxvZyA9IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XG5cbnZhciB2YWx1ZSA9IHJlcXVpcmUoJy4va19ET01fZXh0cmEuanMnKS52YWx1ZTtcbnZhciBzZWxlY3RvciA9IHJlcXVpcmUoJy4va19ET01fZXh0cmEuanMnKS5zZWxlY3Rvcjtcbi8vbG9nKCAndmFsdWUnLCB2YWx1ZSgpICk7XG4vL2xvZyggJ3NlbGVjdG9yJywgc2VsZWN0b3IoKSApOyB2YXIgayA9IHJlcXVpcmUoJy4vaycpOyAvL3ZhciBzZWxlY3RvciA9IHJlcXVpcmUoJy4va19ET01fZXh0cmEuanMnKS5zZWxlY3RvcjsgXG5cblxudmFyIHdyYXBwZXJfcHJvdG90eXBlID0gcmVxdWlyZSgnLi93cmFwcGVyX3Byb3RvdHlwZScpO1xuXG4vKlxudmFyIHdyYXBwZXJfcHJvdG90eXBlID0ge1xuXG4gICAgaHRtbDogZnVuY3Rpb24oaHRtbCl7XG4gICAgICAgdGhpcy5lbGVtLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBhcHBlbmQ6IGZ1bmN0aW9uKHN1Yl9lbGVtZW50KXtcbiAgICAgICAgdGhpcy5lbGVtLmFwcGVuZENoaWxkKHN1Yl9lbGVtZW50LmVsZW0pOyBcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBhcHBlbmRUbzogZnVuY3Rpb24ocGFyZW50X2VsZW1lbnQpe1xuICAgICAgICBwYXJlbnRfZWxlbWVudC5hcHBlbmQodGhpcyk7IFxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGF0dHI6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlICl7XG4gICAgICAgIHZhciBhdHRyaWJ1dGVOYW1lO1xuICAgICAgICBpZiggbmFtZSA9PT0gJ2NsYXNzJyl7XG4gICAgICAgICAgICBhdHRyaWJ1dGVOYW1lID0gJ2NsYXNzTmFtZSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVOYW1lID0gbmFtZTsgXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtW2F0dHJpYnV0ZU5hbWVdID0gdmFsdWU7IFxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG5cblxufTtcbiovXG5cbnZhciBXcmFwID0gZnVuY3Rpb24oZWxlbWVudCl7XG4gICAgdmFyIFcgPSBPYmplY3QuY3JlYXRlKHdyYXBwZXJfcHJvdG90eXBlKTtcblxuXG4gICAgVy5lbGVtID0gZWxlbWVudDtcbiAgICBpZiggVy5lbGVtLnRhZ05hbWUgPT09IFwiU0VMRUNUXCIgKSB7XG4gICAgICAgIFcuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uKCBvcHRpb25fYXJyYXkgKSB7XG4gICAgICAgICAgICBXLmVsZW0ub3B0aW9ucy5sZW5ndGggPSAwOyBcbiAgICAgICAgICAgIC8vbG9nKFwib3B0aW9uX2FycmF5XCIsIG9wdGlvbl9hcnJheSk7XG4gICAgICAgICAgICBvcHRpb25fYXJyYXkuZm9yRWFjaCggZnVuY3Rpb24ob3B0aW9uX3N0cixpKXtcbiAgICAgICAgICAgICAgICB2YXIgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgb3B0LnRleHQgPSBvcHRpb25fc3RyO1xuICAgICAgICAgICAgICAgIG9wdC52YWx1ZSA9IG9wdGlvbl9zdHI7XG4gICAgICAgICAgICAgICAgVy5lbGVtLmFkZChvcHQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIFc7XG5cbn07XG5cbnZhciAkID0gZnVuY3Rpb24oaW5wdXQpe1xuICAgIHZhciBlbGVtZW50O1xuXG4gICAgaWYoIHR5cGVvZiBpbnB1dCA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgIC8vbG9nKCdpbnB1dCBuZWVkZWQnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiggKGlucHV0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHx8IChpbnB1dCBpbnN0YW5jZW9mIFNWR0VsZW1lbnQpICl7XG4gICAgICAgIHJldHVybiBXcmFwKGlucHV0KTtcbiAgICB9XG4gICAgaWYoIGlucHV0LnN1YnN0cigwLDEpID09PSAnIycgKSB7XG4gICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbnB1dC5zdWJzdHIoMSkpO1xuICAgICAgICByZXR1cm4gV3JhcChlbGVtZW50KTtcbiAgICB9IGVsc2UgaWYoIGlucHV0LnN1YnN0cigwLDEpID09PSAnLicgKSB7XG4gICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlDbGFzc05hbWUoaW5wdXQuc3Vic3RyKDEpWzBdKTtcbiAgICAgICAgcmV0dXJuIFdyYXAoZWxlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYoIGlucHV0ID09PSAndmFsdWUnICkge1xuICAgICAgICAgICAgaWYoIHZhbHVlICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IHZhbHVlKCk7IFxuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiB2YWx1ZSBub3QgZGVmaW5lZFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiggaW5wdXQgPT09ICdzZWxlY3RvcicgKSB7XG4gICAgICAgICAgICBpZiggc2VsZWN0b3IgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gc2VsZWN0b3IoKTsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IHNlbGVjdG9yIG5vdCBkZWZpbmVkXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGlucHV0KTtcbiAgICAgICAgICAgIHJldHVybiBXcmFwKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuXG5cbn07XG5cbi8vIEJyb3dzZXJpZnlcbm1vZHVsZS5leHBvcnRzID0gJDtcbi8vbW9kdWxlLmV4cG9ydHMud3JhcHBlcl9wcm90b3R5cGUgPSB3cmFwcGVyX3Byb3RvdHlwZTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGsgPSByZXF1aXJlKCcuL2suanMnKTtcbnZhciBrb250YWluZXIgPSByZXF1aXJlKCcuL2tvbnRhaW5lcicpO1xuXG52YXIga19ET00gPSByZXF1aXJlKCcuL2tfRE9NLmpzJyk7XG52YXIgd3JhcHBlcl9wcm90b3R5cGUgPSByZXF1aXJlKCcuL3dyYXBwZXJfcHJvdG90eXBlJyk7XG5cblxudmFyIHNlbGVjdG9yX3Byb3RvdHlwZSA9IHtcbiAgICBjaGFuZ2U6IGZ1bmN0aW9uKG5ld192YWx1ZSl7XG4gICAgICAgIHRoaXMuc2V0X3ZhbHVlKCk7XG5cbiAgICAgICAgaWYoIHRoaXMuZ191cGRhdGUgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgdGhpcy5nX3VwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzZXRfdmFsdWU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCB0aGlzLmVsZW0ub3B0aW9uc1t0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleF0gJiYgdGhpcy5lbGVtLm9wdGlvbnNbdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXhdLnZhbHVlICl7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzZWxlY3RlZF92YWx1ZScsIHRoaXMuZWxlbS5vcHRpb25zW3RoaXMuZWxlbS5zZWxlY3RlZEluZGV4XS52YWx1ZSk7XG4gICAgICAgICAgICB2YXIgbmV3X3ZhbHVlID0gdGhpcy5lbGVtLm9wdGlvbnNbdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuICAgICAgICAgICAgaWYoIHRoaXMub3B0aW9uc0tvbnRhaW5lci5yZWFkeSApIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdrb250YWluZXIgcmVhZHksIHNldHRpbmcgdG86ICcsIG5ld192YWx1ZSlcbiAgICAgICAgICAgICAgICAvL2lmKCAhIGlzTmFOKHBhcnNlRmxvYXQobmV3X3ZhbHVlKSkpIG5ld192YWx1ZSA9IHBhcnNlRmxvYXQobmV3X3ZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmtvbnRhaW5lci5zZXQobmV3X3ZhbHVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gbmV3X3ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZygndXBkYXRpbmc6ICcsIHRoaXMpXG4gICAgICAgIC8vdGhpcy5zZXRfdmFsdWUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVfb3B0aW9ucygpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHVwZGF0ZV9vcHRpb25zOiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgb2xkX3ZhbHVlID0gdGhpcy52YWx1ZTtcbiAgICAgICAgaWYoIHRoaXMua29udGFpbmVyLnJlYWR5ICkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMua29udGFpbmVyLmdldCgpO1xuICAgICAgICAgICAgaWYoIHR5cGVvZiB0aGlzLnZhbHVlID09IFwib2JqZWN0XCIpIHRoaXMudmFsdWUgPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggdGhpcy5vcHRpb25zS29udGFpbmVyLnJlYWR5ICYmIHRoaXMua29udGFpbmVyLnJlYWR5ICkge1xuICAgICAgICAgICAgdmFyIG9sZF9vcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gdGhpcy5vcHRpb25zS29udGFpbmVyLmdldCgpO1xuICAgICAgICAgICAgaWYoIHRoaXMub3B0aW9ucyBpbnN0YW5jZW9mIEFycmF5ICl7XG4gICAgICAgICAgICAgICAgLy90aGlzLm9wdGlvbnMudW5zaGlmdCgnJyk7XG4gICAgICAgICAgICAgICAgaWYoIHRoaXMub3B0aW9ucyAhPT0gb2xkX29wdGlvbnN8fCB0aGlzLnZhbHVlICE9PSBvbGRfdmFsdWUgKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIHRoaXMub3B0aW9ucyAhPT0gdW5kZWZpbmVkICYmIHRoaXMub3B0aW9ucyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3RoaXMuZWxlbS5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbS5pbm5lckhUTUwgPSAnPG9wdGlvbiBzZWxlY3RlZCBkaXNhYmxlZCBoaWRkZW4+PC9vcHRpb24+J1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmZvckVhY2goZnVuY3Rpb24odmFsdWUsaWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgby52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLnZhbHVlICl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCB2YWx1ZS50b1N0cmluZygpID09PSB0aGlzLnZhbHVlLnRvU3RyaW5nKCkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdmb3VuZCBpdDonLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLnNlbGVjdGVkID0gXCJzZWxlY3RlZFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZG9lcyBub3QgbWF0Y2g6ICcsIHZhbHVlLCB0aGlzLnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vby5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlbGVjdG9yX29wdGlvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ25vIGN1cnJlbnQgdmFsdWUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLmlubmVySFRNTCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW0uYXBwZW5kQ2hpbGQobyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rvcl9vYmogPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3Jfb2JqLmNoYW5nZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9pZiggISAodGhpcy5vcHRpb25zLmluZGV4T2YodGhpcy5rb250YWluZXIuZ2V0KCkpKzEpICl7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgICB0aGlzLnNldF92YWx1ZSh0aGlzLm9wdGlvbnNbMF0udmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0VXBkYXRlOiBmdW5jdGlvbih1cGRhdGVfZnVuY3Rpb24pe1xuICAgICAgICB0aGlzLmdfdXBkYXRlID0gdXBkYXRlX2Z1bmN0aW9uO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldFJlZjogZnVuY3Rpb24ocmVmU3RyaW5nKXtcbiAgICAgICAgdGhpcy5yZWZTdHJpbmcgPSByZWZTdHJpbmc7XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmVmT2JqZWN0ICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyID0gT2JqZWN0LmNyZWF0ZShrb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIucmVmKHRoaXMucmVmU3RyaW5nKTtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldFJlZk9iajogZnVuY3Rpb24ocmVmT2JqZWN0KXtcbiAgICAgICAgdGhpcy5yZWZPYmplY3QgPSByZWZPYmplY3Q7XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmVmU3RyaW5nICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyID0gT2JqZWN0LmNyZWF0ZShrb250YWluZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmKCB0aGlzLmtvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIucmVmKHRoaXMucmVmU3RyaW5nKTtcbiAgICAgICAgICAgIHRoaXMua29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMub3B0aW9uc0tvbnRhaW5lciA9PT0gdW5kZWZpbmVkICYmIHRoaXMucmVmT3B0aW9uc1N0cmluZyAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNLb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMub3B0aW9uc0tvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zS29udGFpbmVyLnJlZih0aGlzLnJlZk9wdGlvbnNTdHJpbmcpO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zS29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXRPcHRpb25zUmVmOiBmdW5jdGlvbihyZWZTdHJpbmcpe1xuICAgICAgICB0aGlzLnJlZk9wdGlvbnNTdHJpbmcgPSByZWZTdHJpbmc7XG4gICAgICAgIGlmKCB0aGlzLm9wdGlvbnNLb250YWluZXIgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnJlZk9iamVjdCAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNLb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMub3B0aW9uc0tvbnRhaW5lciAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zS29udGFpbmVyLnJlZih0aGlzLnJlZk9wdGlvbnNTdHJpbmcpO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zS29udGFpbmVyLm9iaih0aGlzLnJlZk9iamVjdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxufTtcbmZvciggdmFyIGlkIGluIHdyYXBwZXJfcHJvdG90eXBlICkge1xuICAgIGlmKCB3cmFwcGVyX3Byb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShpZCkgKSB7XG4gICAgICAgIHNlbGVjdG9yX3Byb3RvdHlwZVtpZF0gPSB3cmFwcGVyX3Byb3RvdHlwZVtpZF07XG4gICAgfVxufVxuXG52YXIgc2VsZWN0b3IgPSBmdW5jdGlvbigpe1xuICAgIHZhciBzID0gT2JqZWN0LmNyZWF0ZShzZWxlY3Rvcl9wcm90b3R5cGUpO1xuICAgIHMudHlwZSA9ICdzZWxlY3Rvcic7XG4gICAgcy5lbGVtPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICBzLmVsZW0uc2V0QXR0cmlidXRlKCdjbGFzcycsICdzZWxlY3Rvcl9tZW51Jyk7XG5cbiAgICByZXR1cm4gcztcbn07XG5cblxuXG5cblxudmFyIHZhbHVlX3Byb3RvdHlwZSA9IHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ3J1bm5pbmcgdmFsdWUgdXBkYXRlJywgdGhpcylcbiAgICAgICAgLypcbiAgICAgICAgaWYoIHRoaXMuZ191cGRhdGUgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgdGhpcy5nX3VwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgICovXG4gICAgICAgdmFyIGRlY2ltYWxzID0gdGhpcy5kZWNpbWFscyB8fCAzO1xuICAgICAgICBpZiggdHlwZW9mIHRoaXMua29udGFpbmVyICE9PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMua29udGFpbmVyLmdldCgpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygndXBkYXRpbmcgdmFsdWUnLCB0aGlzLnZhbHVlKVxuICAgICAgICB9XG4gICAgICAgIGlmKCBpc05hTihOdW1iZXIodGhpcy52YWx1ZSkpICl7XG4gICAgICAgICAgICB0aGlzLmVsZW0uaW5uZXJIVE1MID0gdGhpcy52YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbS5pbm5lckhUTUwgPSBOdW1iZXIodGhpcy52YWx1ZSkudG9GaXhlZChkZWNpbWFscyk7XG4gICAgICAgICAgICBpZiggdGhpcy5taW4gIT09IHVuZGVmaW5lZCAmJiB0aGlzLnZhbHVlIDw9IHRoaXMubWluICkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXR0cignY2xhc3MnLCAndmFsdWVPdXRPZlJhbmdlJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYoIHRoaXMubWF4ICE9PSB1bmRlZmluZWQgJiYgdGhpcy52YWx1ZSA+PSB0aGlzLm1heCApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHIoJ2NsYXNzJywgJ3ZhbHVlT3V0T2ZSYW5nZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF0dHIoJ2NsYXNzJywgJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbihuZXdfdmFsdWUpIHtcbiAgICAgICAgaWYoIHR5cGVvZiBuZXdfdmFsdWUgIT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gbmV3X3ZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4vLyAgICBzZXRVcGRhdGU6IGZ1bmN0aW9uKHVwZGF0ZV9mdW5jdGlvbil7XG4vLyAgICAgICAgdGhpcy5nX3VwZGF0ZSA9IHVwZGF0ZV9mdW5jdGlvbjtcbi8vICAgIH0sXG4gICAgc2V0UmVmOiBmdW5jdGlvbihyZWZTdHJpbmcpe1xuICAgICAgICB0aGlzLnJlZlN0cmluZyA9IHJlZlN0cmluZztcbiAgICAgICAgaWYoIHRoaXMua29udGFpbmVyID09PSB1bmRlZmluZWQgJiYgdGhpcy5yZWZPYmplY3QgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMua29udGFpbmVyICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lci5yZWYodGhpcy5yZWZTdHJpbmcpO1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIub2JqKHRoaXMucmVmT2JqZWN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0UmVmT2JqOiBmdW5jdGlvbihyZWZPYmplY3Qpe1xuICAgICAgICB0aGlzLnJlZk9iamVjdCA9IHJlZk9iamVjdDtcbiAgICAgICAgaWYoIHRoaXMua29udGFpbmVyID09PSB1bmRlZmluZWQgJiYgdGhpcy5yZWZTdHJpbmcgIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYoIHRoaXMua29udGFpbmVyICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICB0aGlzLmtvbnRhaW5lci5yZWYodGhpcy5yZWZTdHJpbmcpO1xuICAgICAgICAgICAgdGhpcy5rb250YWluZXIub2JqKHRoaXMucmVmT2JqZWN0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldE1heDogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICB0aGlzLm1heCA9IHZhbHVlO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldE1pbjogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICB0aGlzLm1pbiA9IHZhbHVlO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldERlY2ltYWxzOiBmdW5jdGlvbihuKXtcbiAgICAgICAgdGhpcy5kZWNpbWFscyA9IG47XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG59O1xuZm9yKCB2YXIgaWQgaW4gd3JhcHBlcl9wcm90b3R5cGUgKSB7XG4gICAgaWYoIHdyYXBwZXJfcHJvdG90eXBlLmhhc093blByb3BlcnR5KGlkKSApIHtcbiAgICAgICAgdmFsdWVfcHJvdG90eXBlW2lkXSA9IHdyYXBwZXJfcHJvdG90eXBlW2lkXTtcbiAgICB9XG59XG5cblxuXG5mdW5jdGlvbiB2YWx1ZSgpIHtcbiAgICB2YXIgdiA9IE9iamVjdC5jcmVhdGUodmFsdWVfcHJvdG90eXBlKTtcbiAgICB2LnR5cGUgPSAndmFsdWUnO1xuICAgIHYuZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblxuICAgIHYudmFsdWUgPSAnLSc7XG4gICAgdi5pbm5lckhUTUwgPSB2LnZhbHVlO1xuICAgIHYucmVmZXJlbmNlID0gZmFsc2U7XG5cblxuICAgIHYudXBkYXRlKCk7XG5cbiAgICByZXR1cm4gdjtcbn1cblxuXG5cbi8vIEJyb3dzZXJpZnlcbm1vZHVsZS5leHBvcnRzLnNlbGVjdG9yID0gc2VsZWN0b3I7XG5tb2R1bGUuZXhwb3J0cy52YWx1ZSA9IHZhbHVlO1xuLy9tb2R1bGUuZXhwb3J0cy4kID0gJDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGtkYl9wcm90b3R5cGUgPSB7XG4gICAgc2V0X2ZpZWxkczogZnVuY3Rpb24oZmllbGRfYXJyYXkpIHtcbiAgICAgICAgdmFyIGxpc3Q7XG4gICAgICAgIGlmKCB0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnc3RyaW5nJyApIHsgIC8vIGVhY2ggYXJndW1lbnQgaXMgYSBmaWVsZFxuICAgICAgICAgICAgbGlzdCA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7IC8vY29udmVydCBhcmd1bWVudHMgdG8gYW4gYXJyYXlcbiAgICAgICAgfSBlbHNlIHsgLy8gYXNzdW1lZCBsaXN0IG9mIGZpZWxkc1xuICAgICAgICAgICAgbGlzdCA9IGFyZ3VtZW50WzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5maWVsZHMgPSBbXVxuICAgICAgICBsaXN0LmZvckVhY2goIGZ1bmN0aW9uKGZpZWxkKSB7XG4gICAgICAgICAgICB0aGlzLmZpZWxkcy5wdXNoKGZpZWxkKSA7XG4gICAgICAgIH0sdGhpcykgXG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIGFkZDogZnVuY3Rpb24oZW50cnkpIHtcbiAgICAgICAgdmFyIGxpc3Q7XG4gICAgICAgIHZhciBvYmogPSB7fTtcblxuICAgICAgICBpZiggT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGVudHJ5KSA9PT0gJ1tvYmplY3QgQXJyYXldJyApIHsgLy8gaWYgbGlzdCBpcyBzdWJtaXR0ZWRcbiAgICAgICAgICAgIGxpc3QgPSBhcmd1bWVudHNbMF07XG4gICAgICAgIH0gZWxzZSBpZiggT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGVudHJ5KSA9PT0gJ1tvYmplY3QgT2JqZWN0XScgKSB7IC8vIGlmIG9iamVjdCBpcyBzdWJtaXR0ZWRcbiAgICAgICAgICAgIG9iaiA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgfSBlbHNlIHsgIC8vIGVhY2ggYXJndW1lbnQgaXMgYSBmaWVsZDogc3RyaW5nLCBudW1iZXIsIGV0Yy5cbiAgICAgICAgICAgIGxpc3QgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpOyAvL2NvbnZlcnQgYXJndW1lbnRzIHRvIGFuIGFycmF5XG4gICAgICAgIH1cbiAgICAgICAgaWYoIGxpc3QgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgIGxpc3QuZm9yRWFjaCggZnVuY3Rpb24oIHZhbHVlLCBpICkge1xuICAgICAgICAgICAgICAgIG9ialt0aGlzLmZpZWxkc1tpXV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH0sdGhpcykgXG4gICAgICAgIH1cblxuXG4gICAgICAgIHRoaXMucm93cy5wdXNoKG9iaik7XG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBDU1Y6IGZ1bmN0aW9uKHN0cmluZyl7XG4gICAgXG4gICAgXG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGZpZWxkLCB2YWx1ZSl7XG4gICAgICAgIC8vdmFyIGggPSB0aGlzLmZpZWxkcy5pbmRleE9mKGNvbHVtbik7XG4gICAgICAgIC8vbG9nKGgsIHRoaXMuZmllbGRzW2hdKVxuICAgICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICAgIHRoaXMucm93cy5mb3JFYWNoKCBmdW5jdGlvbihyb3csaWQpe1xuICAgICAgICAgICAgaWYoIHJvd1tmaWVsZF0gPT09IHZhbHVlICl7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2gocm93KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSx0aGlzKSAgICBcbiAgICAgICAgbG9nKG91dHB1dClcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9LFxuICAgIGNvbHVtbjogZnVuY3Rpb24oZmllbGQpe1xuICAgICAgICB2YXIgY29sdW1uID0gW107XG4gICAgICAgIHRoaXMucm93cy5mb3JFYWNoKCBmdW5jdGlvbihyb3cpe1xuICAgICAgICAgICAgY29sdW1uLnB1c2goIHJvd1tmaWVsZF0gKTtcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICB9LFxufVxuXG5cbmZ1bmN0aW9uIEtEQigpIHtcbiAgICB2YXIgZCA9IE9iamVjdC5jcmVhdGUoa2RiX3Byb3RvdHlwZSk7XG4gICAgXG4gICAgZC5yb3dzID0gW107XG5cblxuXG4gICAgcmV0dXJuIGQ7XG59XG5cblxuXG5cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGtvbnRhaW5lciA9IHtcbiAgICByZWY6IGZ1bmN0aW9uKHJlZlN0cmluZyl7XG4gICAgICAgIGlmKCB0eXBlb2YgcmVmU3RyaW5nID09PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVmU3RyaW5nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZWZTdHJpbmcgPSByZWZTdHJpbmc7XG4gICAgICAgICAgICB0aGlzLnJlZkFycmF5ID0gcmVmU3RyaW5nLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICBpZiggdHlwZW9mIHRoaXMub2JqZWN0ICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIG9iajogZnVuY3Rpb24ob2JqKXtcbiAgICAgICAgaWYoIHR5cGVvZiBvYmogPT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vYmplY3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9iamVjdCA9IG9iajtcbiAgICAgICAgICAgIGlmKCB0eXBlb2YgdGhpcy5yZWZTdHJpbmcgIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbihpbnB1dCl7XG4gICAgICAgIGlmKCB0eXBlb2YgdGhpcy5vYmplY3QgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiB0aGlzLnJlZlN0cmluZyA9PT0gJ3VuZGVmaW5lZCcgKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5vYmplY3Q7XG4gICAgICAgIHZhciBsYXN0X2xldmVsID0gdGhpcy5yZWZBcnJheVt0aGlzLnJlZkFycmF5Lmxlbmd0aC0xXTtcblxuICAgICAgICB0aGlzLnJlZkFycmF5LmZvckVhY2goZnVuY3Rpb24obGV2ZWxfbmFtZSxpKXtcbiAgICAgICAgICAgIGlmKCB0eXBlb2YgcGFyZW50W2xldmVsX25hbWVdID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRbbGV2ZWxfbmFtZV0gPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCBsZXZlbF9uYW1lICE9PSBsYXN0X2xldmVsICl7XG4gICAgICAgICAgICAgICAgcGFyZW50ID0gcGFyZW50W2xldmVsX25hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcGFyZW50W2xhc3RfbGV2ZWxdID0gaW5wdXQ7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ3NldHRpbmc6JywgaW5wdXQsIHRoaXMuZ2V0KCksIHRoaXMucmVmU3RyaW5nICk7XG4gICAgICAgIHJldHVybiBwYXJlbnRbbGFzdF9sZXZlbF07XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBsZXZlbCA9IHRoaXMub2JqZWN0O1xuICAgICAgICB0aGlzLnJlZkFycmF5LmZvckVhY2goZnVuY3Rpb24obGV2ZWxfbmFtZSxpKXtcbiAgICAgICAgICAgIGlmKCB0eXBlb2YgbGV2ZWxbbGV2ZWxfbmFtZV0gPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldmVsID0gbGV2ZWxbbGV2ZWxfbmFtZV07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbGV2ZWw7XG4gICAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga29udGFpbmVyO1xuIiwidmFyIHdyYXBwZXJfcHJvdG90eXBlID0ge1xuXG4gICAgaHRtbDogZnVuY3Rpb24oaHRtbCl7XG4gICAgICAgdGhpcy5lbGVtLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBocmVmOiBmdW5jdGlvbihsaW5rKXtcbiAgICAgICB0aGlzLmVsZW0uaHJlZiA9IGxpbms7XG4gICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBhcHBlbmQ6IGZ1bmN0aW9uKHN1Yl9lbGVtZW50KXtcbiAgICAgICAgdGhpcy5nZXQoMCkuYXBwZW5kQ2hpbGQoc3ViX2VsZW1lbnQuZWxlbSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgYXBwZW5kVG86IGZ1bmN0aW9uKHBhcmVudF9lbGVtZW50KXtcbiAgICAgICAgLy9wYXJlbnRfZWxlbWVudC5hcHBlbmQodGhpcyk7XG4gICAgICAgIHBhcmVudF9lbGVtZW50LmdldCgwKS5hcHBlbmRDaGlsZCh0aGlzLmVsZW0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGF0dHI6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKXtcbiAgICAgICAgdmFyIGF0dHJpYnV0ZU5hbWU7XG4gICAgICAgIGlmKCBuYW1lID09PSAnY2xhc3MnKXtcbiAgICAgICAgICAgIGF0dHJpYnV0ZU5hbWUgPSAnY2xhc3NOYW1lJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZU5hbWUgPSBuYW1lO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbVthdHRyaWJ1dGVOYW1lXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNsaWNrOiBmdW5jdGlvbihjbGlja0Z1bmN0aW9uKXtcbiAgICAgICAgY29uc29sZS5sb2coJ3NldHRpbmcgY2xpY2sgdG8gJywgdHlwZW9mIGNsaWNrRnVuY3Rpb24sIGNsaWNrRnVuY3Rpb24pXG4gICAgICAgIHRoaXMuZWxlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKXsgY2xpY2tGdW5jdGlvbigpOyB9LCBmYWxzZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgc2hvdzogZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy5lbGVtLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lJztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBoaWRlOiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLmVsZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzdHlsZTogZnVuY3Rpb24oZmllbGQsIHZhbHVlKXtcbiAgICAgICAgdGhpcy5lbGVtLnN0eWxlW2ZpZWxkXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGNzczogZnVuY3Rpb24oZmllbGQsIHZhbHVlKXtcbiAgICAgICAgdGhpcy5lbGVtLnN0eWxlW2ZpZWxkXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIC8qXG4gICAgLypcbiAgICBwdXNoVG86IGZ1bmN0aW9uKGFycmF5KXtcbiAgICAgICAgYXJyYXkucHVzaCh0aGlzKTtcbiAgICB9XG4gICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uKGkpe1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtXG59XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gd3JhcHBlcl9wcm90b3R5cGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciB2ZXJzaW9uX3N0cmluZyA9IFwiRGV2XCI7XG4vL3ZhciB2ZXJzaW9uX3N0cmluZyA9IFwiQWxwaGEyMDE0MTIxMFwiO1xuXG4vLyBNb3ZlZCB0byBpbmRleC5odG1sXG4vLyBUT0RPOiBsb29rIGludG8gd2F5cyB0byBmdXJ0aGVyIHJlZHVjZSBzaXplLiBJdCBzZWVtcyB3YXkgdG8gYmlnLlxuLy92YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcbi8vdmFyIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xuLy92YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuXG52YXIgayA9IHJlcXVpcmUoJy4vbGliL2svay5qcycpO1xudmFyIGtfZGF0YSA9IHJlcXVpcmUoJy4vbGliL2sva19kYXRhJyk7XG52YXIgayQgPSByZXF1aXJlKCcuL2xpYi9rL2tfRE9NJyk7XG5cbnZhciBta19wYWdlID0ge307XG5ta19wYWdlWzFdID0gcmVxdWlyZSgnLi9hcHAvbWtfcGFnZV8xJyk7XG5ta19wYWdlWzJdID0gcmVxdWlyZSgnLi9hcHAvbWtfcGFnZV8yJyk7XG5ta19wYWdlWzNdID0gcmVxdWlyZSgnLi9hcHAvbWtfcGFnZV8zJyk7XG5cbnZhciBta19zdmc9IHJlcXVpcmUoJy4vYXBwL21rX3N2ZycpO1xuLy92YXIgbWtfcGRmID0gcmVxdWlyZSgnLi9hcHAvbWtfcGRmLmpzJyk7XG52YXIgdXBkYXRlX3N5c3RlbSA9IHJlcXVpcmUoJy4vYXBwL3VwZGF0ZV9zeXN0ZW0nKTtcblxudmFyIHNldHRpbmdzID0gcmVxdWlyZSgnLi9hcHAvc2V0dGluZ3MnKTtcbnNldHRpbmdzLnN0YXRlLnZlcnNpb25fc3RyaW5nID0gdmVyc2lvbl9zdHJpbmc7XG5jb25zb2xlLmxvZygnc2V0dGluZ3MnLCBzZXR0aW5ncyk7XG5cblxudmFyIGYgPSByZXF1aXJlKCcuL2FwcC9mdW5jdGlvbnMnKTtcblxuZi5zZXR0aW5ncyA9IHNldHRpbmdzO1xuc2V0dGluZ3MuZiA9IGY7XG5cbi8vdmFyIGRhdGFiYXNlX2pzb25fVVJMID0gXCJodHRwOi8vMTAuMTczLjY0LjIwNDo4MDAwL3RlbXBvcmFyeS9cIjtcbnZhciBkYXRhYmFzZV9qc29uX1VSTCA9IFwiZGF0YS9mc2VjX2NvcHkuanNvblwiO1xuXG52YXIgY29tcG9uZW50cyA9IHNldHRpbmdzLmNvbXBvbmVudHM7XG52YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuXG5cblxuJC5nZXRKU09OKCBkYXRhYmFzZV9qc29uX1VSTClcbiAgICAuZG9uZShmdW5jdGlvbihqc29uKXtcbiAgICAgICAgc2V0dGluZ3MuZGF0YWJhc2UgPSBqc29uO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdkYXRhYmFzZSBsb2FkZWQnLCBzZXR0aW5ncy5kYXRhYmFzZSk7XG4gICAgICAgIGYubG9hZF9kYXRhYmFzZShqc29uKTtcbiAgICAgICAgc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgdXBkYXRlKCk7XG4gICAgICAgIC8vY29uc29sZS5sb2coICdzZXR0aW5ncy5lbGVtZW50cycsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzLmVsZW1lbnRzLCBudWxsLCA0KSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coICdzeXN0ZW0nLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncy5zeXN0ZW0sIG51bGwsIDQpKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggJ2lucHV0cycsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzLmlucHV0cywgbnVsbCwgNCkpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCAnZHJhd2luZycsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzLmRyYXdpbmcsIG51bGwsIDQpKTtcbiAgICB9KTtcblxuXG5cbnZhciB1cGRhdGUgPSBzZXR0aW5ncy51cGRhdGUgPSBmdW5jdGlvbigpe1xuICAgIGNvbnNvbGUubG9nKCcvLS0tIGJlZ2luIHVwZGF0ZScpO1xuXG4gICAgZm9yKCB2YXIgc2VjdGlvbl9uYW1lIGluIHNldHRpbmdzLmlucHV0cyApe1xuICAgICAgICAvL2NvbnNvbGUubG9nKCBzZWN0aW9uX25hbWUsIGYuc2VjdGlvbl9kZWZpbmVkKHNlY3Rpb25fbmFtZSkgKTtcbiAgICB9XG5cblxuICAgIHNldHRpbmdzLnNlbGVjdF9yZWdpc3RyeS5mb3JFYWNoKGZ1bmN0aW9uKHNlbGVjdG9yKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxlY3Rvci52YWx1ZSgpKTtcbiAgICAgICAgaWYoc2VsZWN0b3IudmFsdWUoKSkgc2VsZWN0b3Iuc3lzdGVtX3JlZi5zZXQoc2VsZWN0b3IudmFsdWUoKSk7XG4gICAgICAgIGlmKHNlbGVjdG9yLnZhbHVlKCkpIHNlbGVjdG9yLmlucHV0X3JlZi5zZXQoc2VsZWN0b3IudmFsdWUoKSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coc2VsZWN0b3Iuc2V0X3JlZi5yZWZTdHJpbmcsIHNlbGVjdG9yLnZhbHVlKCksIHNlbGVjdG9yLnNldF9yZWYuZ2V0KCkpO1xuXG4gICAgfSk7XG5cblxuICAgIC8vY29weSBpbnB1dHMgZnJvbSBzZXR0aW5ncy5pbnB1dCB0byBzZXR0aW5ncy5zeXN0ZW0uXG5cblxuICAgIHVwZGF0ZV9zeXN0ZW0oc2V0dGluZ3MpO1xuXG4gICAgc2V0dGluZ3Muc2VsZWN0X3JlZ2lzdHJ5LmZvckVhY2goZnVuY3Rpb24oc2VsZWN0b3Ipe1xuICAgICAgICBmLnNlbGVjdG9yX2FkZF9vcHRpb25zKHNlbGVjdG9yKTtcbiAgICB9KTtcblxuICAgIHNldHRpbmdzLnZhbHVlX3JlZ2lzdHJ5LmZvckVhY2goZnVuY3Rpb24odmFsdWVfaXRlbSl7XG4gICAgICAgIHZhbHVlX2l0ZW0uZWxlbS5pbm5lckhUTUwgPSB2YWx1ZV9pdGVtLnZhbHVlX3JlZi5nZXQoKTtcbiAgICB9KTtcblxuXG5cbiAgICAvLyBNYWtlIGRyYXdpbmdcbiAgICBzZXR0aW5ncy5kcmF3aW5nLnBhcnRzID0ge307XG4gICAgc2V0dGluZ3MuZHJhd2luZy5zdmdzID0ge307XG4gICAgJChcIiNkcmF3aW5nXCIpLmh0bWwoJycpO1xuXG4gICAgZm9yKCB2YXIgcCBpbiBta19wYWdlICl7XG4gICAgICAgIGNvbnNvbGUubG9nKHApO1xuICAgICAgICBzZXR0aW5ncy5kcmF3aW5nLnBhcnRzW3BdID0gbWtfcGFnZVtwXShzZXR0aW5ncyk7XG4gICAgICAgIHNldHRpbmdzLmRyYXdpbmcuc3Znc1twXSA9IG1rX3N2ZyhzZXR0aW5ncy5kcmF3aW5nLnBhcnRzW3BdLCBzZXR0aW5ncyk7XG4gICAgICAgICQoXCIjZHJhd2luZ1wiKVxuICAgICAgICAgICAgLmFwcGVuZCgkKFwiPHA+UGFnZSBcIitwK1wiPC9wPlwiKSlcbiAgICAgICAgICAgIC5hcHBlbmQoJChzZXR0aW5ncy5kcmF3aW5nLnN2Z3NbcF0pKTtcblxuICAgIH1cblxuXG4gICAgLy8qL1xuICAgIC8vdmFyIHBkZl9kb3dubG9hZCA9IG1rX3BkZihzZXR0aW5ncywgc2V0RG93bmxvYWRMaW5rKTtcbiAgICAvL21rX3BkZihzZXR0aW5ncywgc2V0RG93bmxvYWRMaW5rKTtcbiAgICAvL3BkZl9kb3dubG9hZC5odG1sKFwiRG93bmxvYWQgUERGXCIpO1xuICAgIC8vY29uc29sZS5sb2cocGRmX2Rvd25sb2FkKTtcbiAgICAvL2lmKCBzZXR0aW5ncy5QREYgJiYgc2V0dGluZ3MuUERGLnVybCApe1xuICAgIC8vICAgIHZhciBsaW5rID0gJCgnYScpLmF0dHIoJ2hyZWYnLCBzZXR0aW5ncy5QREYudXJsICkuaHRtbCgnZG93bmxvYWQuLicpO1xuICAgIC8vICAgICQoJyNkb3dubG9hZCcpLmFwcGVuZChsaW5rKTtcbiAgICAvL31cblxuXG4gICAgLy9rLnNob3dfaGlkZV9wYXJhbXMocGFnZV9zZWN0aW9uc19wYXJhbXMsIHNldHRpbmdzKTtcbi8vICAgIHNob3dfaGlkZV9zZWxlY3Rpb25zKHBhZ2Vfc2VjdGlvbnNfY29uZmlnLCBzZXR0aW5ncy5zdGF0ZS5hY3RpdmVfc2VjdGlvbik7XG5cbiAgICAvL2NvbnNvbGUubG9nKCBmLm9iamVjdF9kZWZpbmVkKHNldHRpbmdzLnN0YXRlKSApO1xuXG4gICAgLy9jb25zb2xlLmxvZyggJ3N5c3RlbScsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzLnN5c3RlbSwgbnVsbCwgNCkpO1xuICAgIC8vY29uc29sZS5sb2coICdpbnB1dHMnLCBKU09OLnN0cmluZ2lmeShzZXR0aW5ncy5pbnB1dHMsIG51bGwsIDQpKTtcbiAgICAvL2NvbnNvbGUubG9nKCAnZHJhd2luZycsIEpTT04uc3RyaW5naWZ5KHNldHRpbmdzLmRyYXdpbmcsIG51bGwsIDQpKTtcblxuICAgIGNvbnNvbGUubG9nKCdcXFxcLS0tIGVuZCB1cGRhdGUnKTtcbn07XG5mLnVwZGF0ZSA9IHVwZGF0ZTtcblxuXG5cblxuXG5cblxuXG5cbi8vIERldiBzZXR0aW5nc1xuLypcbmlmKCB2ZXJzaW9uX3N0cmluZyA9PT0gJ0RldicgJiYgdHJ1ZSApe1xuICAgIGZvciggdmFyIHNlY3Rpb24gaW4gc2V0dGluZ3Muc3RhdGUuc2VjdGlvbnMgKXtcbiAgICAgICAgc2V0dGluZ3Muc3RhdGUuc2VjdGlvbnNbc2VjdGlvbl0ucmVhZHkgPSB0cnVlO1xuICAgICAgICBzZXR0aW5ncy5zdGF0ZS5zZWN0aW9uc1tzZWN0aW9uXS5zZXQgPSB0cnVlO1xuICAgIH1cbn0gZWxzZSB7XG4gICAgc2V0dGluZ3Muc3RhdGUuc2VjdGlvbnMubW9kdWxlcy5yZWFkeSA9IHRydWU7XG59XG4vLyovXG4vLy8vLy8vL1xuXG5cblxuXG5mdW5jdGlvbiBwYWdlX3NldHVwKHNldHRpbmdzKXtcbiAgICB2YXIgc3lzdGVtX2ZyYW1lX2lkID0gJ3N5c3RlbV9mcmFtZSc7XG4gICAgdmFyIHRpdGxlID0gJ1BWIGRyYXdpbmcgdGVzdCc7XG5cbiAgICBrLnNldHVwX2JvZHkodGl0bGUpO1xuXG4gICAgdmFyIHBhZ2UgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3BhZ2UnKS5hcHBlbmRUbygkKGRvY3VtZW50LmJvZHkpKTtcbiAgICAvL3BhZ2Uuc3R5bGUoJ3dpZHRoJywgKHNldHRpbmdzLmRyYXdpbmcuc2l6ZS5kcmF3aW5nLncrMjApLnRvU3RyaW5nKCkgKyBcInB4XCIgKVxuXG4gICAgdmFyIHN5c3RlbV9mcmFtZSA9ICQoJzxkaXY+JykuYXR0cignaWQnLCBzeXN0ZW1fZnJhbWVfaWQpLmFwcGVuZFRvKHBhZ2UpO1xuXG5cbiAgICB2YXIgaGVhZGVyX2NvbnRhaW5lciA9IGskKCdkaXYnKS5hcHBlbmRUbyhzeXN0ZW1fZnJhbWUpO1xuICAgIGskKCdzcGFuJykuaHRtbCgnUGxlYXNlIHNlbGVjdCB5b3VyIHN5c3RlbSBzcGVjIGJlbG93JykuYXR0cignY2xhc3MnLCAnY2F0ZWdvcnlfdGl0bGUnKS5hcHBlbmRUbyhoZWFkZXJfY29udGFpbmVyKTtcbiAgICBrJCgnc3BhbicpLmh0bWwoJyB8ICcpLmFwcGVuZFRvKGhlYWRlcl9jb250YWluZXIpO1xuICAgIC8vayQoJ2lucHV0JykuYXR0cigndHlwZScsICdidXR0b24nKS5hdHRyKCd2YWx1ZScsICdjbGVhciBzZWxlY3Rpb25zJykuY2xpY2sod2luZG93LmxvY2F0aW9uLnJlbG9hZCksXG4gICAgayQoJ2EnKS5hdHRyKCdocmVmJywgJ2phdmFzY3JpcHQ6d2luZG93LmxvY2F0aW9uLnJlbG9hZCgpJykuaHRtbCgnY2xlYXIgc2VsZWN0aW9ucycpLmFwcGVuZFRvKGhlYWRlcl9jb250YWluZXIpO1xuXG5cbiAgICAvLyBTeXN0ZW0gc2V0dXBcbiAgICAkKCc8ZGl2PicpLmh0bWwoJ1N5c3RlbSBTZXR1cCcpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25fdGl0bGUnKS5hcHBlbmRUbyhzeXN0ZW1fZnJhbWUpO1xuICAgIHZhciBjb25maWdfZnJhbWUgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2NvbmZpZ19mcmFtZScpLmFwcGVuZFRvKHN5c3RlbV9mcmFtZSk7XG5cbiAgICAvL2NvbnNvbGUubG9nKHNlY3Rpb25fc2VsZWN0b3IpO1xuICAgIGYuYWRkX3NlbGVjdG9ycyhzZXR0aW5ncywgY29uZmlnX2ZyYW1lKTtcblxuICAgIC8vIFBhcmFtZXRlcnMgYW5kIHNwZWNpZmljYXRpb25zXG4gICAgJCgnPGRpdj4nKS5odG1sKCdTeXN0ZW0gUGFyYW1ldGVycycpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25fdGl0bGUnKS5hcHBlbmRUbyhzeXN0ZW1fZnJhbWUpO1xuICAgIHZhciBwYXJhbXNfY29udGFpbmVyID0gJCgnPGRpdj4nKS5hdHRyKCdjbGFzcycsICdzZWN0aW9uJyk7XG4gICAgcGFyYW1zX2NvbnRhaW5lci5hcHBlbmRUbyhzeXN0ZW1fZnJhbWUpO1xuICAgIGYuYWRkX3BhcmFtcyggc2V0dGluZ3MsIHBhcmFtc19jb250YWluZXIgKTtcblxuICAgIC8vVE9ETzogYWRkIHN2ZyBkaXNwbGF5IG9mIG1vZHVsZXNcbiAgICAvLyBodHRwOi8vcXVvdGUuc25hcG5yYWNrLmNvbS91aS9vMTAwLnBocCNzdGVwLTJcblxuICAgIC8vIGRyYXdpbmdcbiAgICAvL3ZhciBkcmF3aW5nID0gJCgnZGl2JykuYXR0cignaWQnLCAnZHJhd2luZ19mcmFtZScpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb24nKS5hcHBlbmRUbyhwYWdlKTtcbiAgICB2YXIgZHJhd2luZyA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAnZHJhd2luZ19mcmFtZScpLmFwcGVuZFRvKHBhZ2UpO1xuICAgIGRyYXdpbmcuY3NzKCd3aWR0aCcsIChzZXR0aW5ncy5kcmF3aW5nLnNpemUuZHJhd2luZy53KzIwKS50b1N0cmluZygpICsgXCJweFwiICk7XG4gICAgJCgnPGRpdj4nKS5odG1sKCdEcmF3aW5nJykuYXR0cignY2xhc3MnLCAnc2VjdGlvbl90aXRsZScpLmFwcGVuZFRvKGRyYXdpbmcpO1xuICAgIC8qXG4gICAgdmFyIHBhZ2Vfc2VsZWN0b3IgPSBrJCgnc2VsZWN0b3InKVxuICAgICAgICAuc2V0T3B0aW9uc1JlZiggJ2NvbmZpZ19vcHRpb25zLnBhZ2Vfb3B0aW9ucycgKVxuICAgICAgICAuc2V0UmVmKCdzdGF0ZS5hY3RpdmVfcGFnZScpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdjb3JuZXJfdGl0bGUnKVxuICAgICAgICAuYXBwZW5kVG8oZHJhd2luZyk7XG4gICAgLy9mLmtlbGVtX3NldHVwKHBhZ2Vfc2VsZWN0b3IsIHNldHRpbmdzKTtcbiAgICAvLyovXG4gICAgLy9jb25zb2xlLmxvZyhwYWdlX3NlbGVjdG9yKVxuXG4gICAgLy9rJCgnc3BhbicpLmF0dHIoJ2lkJywgJ2Rvd25sb2FkJykuYXR0cignY2xhc3MnLCAnZmxvYXRfcmlnaHQnKS5hcHBlbmRUbyhkcmF3aW5nKTtcblxuICAgIHZhciBzdmdfY29udGFpbmVyX29iamVjdCA9IGskKCdkaXYnKS5hdHRyKCdpZCcsICdkcmF3aW5nJykuYXR0cignY2xhc3MnLCAnZHJhd2luZycpLmNzcygnY2xlYXInLCAnYm90aCcpLmFwcGVuZFRvKGRyYXdpbmcpO1xuICAgIC8vc3ZnX2NvbnRhaW5lcl9vYmplY3Quc3R5bGUoJ3dpZHRoJywgc2V0dGluZ3MuZHJhd2luZy5zaXplLmRyYXdpbmcudytcInB4XCIgKVxuICAgIHZhciBzdmdfY29udGFpbmVyID0gc3ZnX2NvbnRhaW5lcl9vYmplY3QuZWxlbTtcbiAgICAkKCc8YnI+JykuYXBwZW5kVG8oZHJhd2luZyk7XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgJCgnPGRpdj4nKS5odG1sKCcgJykuYXR0cignY2xhc3MnLCAnc2VjdGlvbl90aXRsZScpLmFwcGVuZFRvKGRyYXdpbmcpO1xuXG59XG5cbnBhZ2Vfc2V0dXAoc2V0dGluZ3MpO1xuXG52YXIgYm9vdF90aW1lID0gbW9tZW50KCk7XG52YXIgc3RhdHVzX2lkID0gXCJzdGF0dXNcIjtcbnNldEludGVydmFsKGZ1bmN0aW9uKCl7IGsudXBkYXRlX3N0YXR1c19wYWdlKHN0YXR1c19pZCwgYm9vdF90aW1lLCB2ZXJzaW9uX3N0cmluZyk7fSwxMDAwKTtcblxudXBkYXRlKCk7XG5cbmNvbnNvbGUubG9nKCdzZXR0aW5ncycsIHNldHRpbmdzKTtcblxuLy9jb25zb2xlLmxvZygnd2luZG93Jywgd2luZG93KTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8vISBtb21lbnQuanNcbi8vISB2ZXJzaW9uIDogMi44LjNcbi8vISBhdXRob3JzIDogVGltIFdvb2QsIElza3JlbiBDaGVybmV2LCBNb21lbnQuanMgY29udHJpYnV0b3JzXG4vLyEgbGljZW5zZSA6IE1JVFxuLy8hIG1vbWVudGpzLmNvbVxuXG4oZnVuY3Rpb24gKHVuZGVmaW5lZCkge1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgQ29uc3RhbnRzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgdmFyIG1vbWVudCxcbiAgICAgICAgVkVSU0lPTiA9ICcyLjguMycsXG4gICAgICAgIC8vIHRoZSBnbG9iYWwtc2NvcGUgdGhpcyBpcyBOT1QgdGhlIGdsb2JhbCBvYmplY3QgaW4gTm9kZS5qc1xuICAgICAgICBnbG9iYWxTY29wZSA9IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogdGhpcyxcbiAgICAgICAgb2xkR2xvYmFsTW9tZW50LFxuICAgICAgICByb3VuZCA9IE1hdGgucm91bmQsXG4gICAgICAgIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSxcbiAgICAgICAgaSxcblxuICAgICAgICBZRUFSID0gMCxcbiAgICAgICAgTU9OVEggPSAxLFxuICAgICAgICBEQVRFID0gMixcbiAgICAgICAgSE9VUiA9IDMsXG4gICAgICAgIE1JTlVURSA9IDQsXG4gICAgICAgIFNFQ09ORCA9IDUsXG4gICAgICAgIE1JTExJU0VDT05EID0gNixcblxuICAgICAgICAvLyBpbnRlcm5hbCBzdG9yYWdlIGZvciBsb2NhbGUgY29uZmlnIGZpbGVzXG4gICAgICAgIGxvY2FsZXMgPSB7fSxcblxuICAgICAgICAvLyBleHRyYSBtb21lbnQgaW50ZXJuYWwgcHJvcGVydGllcyAocGx1Z2lucyByZWdpc3RlciBwcm9wcyBoZXJlKVxuICAgICAgICBtb21lbnRQcm9wZXJ0aWVzID0gW10sXG5cbiAgICAgICAgLy8gY2hlY2sgZm9yIG5vZGVKU1xuICAgICAgICBoYXNNb2R1bGUgPSAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpLFxuXG4gICAgICAgIC8vIEFTUC5ORVQganNvbiBkYXRlIGZvcm1hdCByZWdleFxuICAgICAgICBhc3BOZXRKc29uUmVnZXggPSAvXlxcLz9EYXRlXFwoKFxcLT9cXGQrKS9pLFxuICAgICAgICBhc3BOZXRUaW1lU3Bhbkpzb25SZWdleCA9IC8oXFwtKT8oPzooXFxkKilcXC4pPyhcXGQrKVxcOihcXGQrKSg/OlxcOihcXGQrKVxcLj8oXFxkezN9KT8pPy8sXG5cbiAgICAgICAgLy8gZnJvbSBodHRwOi8vZG9jcy5jbG9zdXJlLWxpYnJhcnkuZ29vZ2xlY29kZS5jb20vZ2l0L2Nsb3N1cmVfZ29vZ19kYXRlX2RhdGUuanMuc291cmNlLmh0bWxcbiAgICAgICAgLy8gc29tZXdoYXQgbW9yZSBpbiBsaW5lIHdpdGggNC40LjMuMiAyMDA0IHNwZWMsIGJ1dCBhbGxvd3MgZGVjaW1hbCBhbnl3aGVyZVxuICAgICAgICBpc29EdXJhdGlvblJlZ2V4ID0gL14oLSk/UCg/Oig/OihbMC05LC5dKilZKT8oPzooWzAtOSwuXSopTSk/KD86KFswLTksLl0qKUQpPyg/OlQoPzooWzAtOSwuXSopSCk/KD86KFswLTksLl0qKU0pPyg/OihbMC05LC5dKilTKT8pP3woWzAtOSwuXSopVykkLyxcblxuICAgICAgICAvLyBmb3JtYXQgdG9rZW5zXG4gICAgICAgIGZvcm1hdHRpbmdUb2tlbnMgPSAvKFxcW1teXFxbXSpcXF0pfChcXFxcKT8oTW98TU0/TT9NP3xEb3xERERvfEREP0Q/RD98ZGRkP2Q/fGRvP3x3W298d10/fFdbb3xXXT98UXxZWVlZWVl8WVlZWVl8WVlZWXxZWXxnZyhnZ2c/KT98R0coR0dHPyk/fGV8RXxhfEF8aGg/fEhIP3xtbT98c3M/fFN7MSw0fXxYfHp6P3xaWj98LikvZyxcbiAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zID0gLyhcXFtbXlxcW10qXFxdKXwoXFxcXCk/KExUfExMP0w/TD98bHsxLDR9KS9nLFxuXG4gICAgICAgIC8vIHBhcnNpbmcgdG9rZW4gcmVnZXhlc1xuICAgICAgICBwYXJzZVRva2VuT25lT3JUd29EaWdpdHMgPSAvXFxkXFxkPy8sIC8vIDAgLSA5OVxuICAgICAgICBwYXJzZVRva2VuT25lVG9UaHJlZURpZ2l0cyA9IC9cXGR7MSwzfS8sIC8vIDAgLSA5OTlcbiAgICAgICAgcGFyc2VUb2tlbk9uZVRvRm91ckRpZ2l0cyA9IC9cXGR7MSw0fS8sIC8vIDAgLSA5OTk5XG4gICAgICAgIHBhcnNlVG9rZW5PbmVUb1NpeERpZ2l0cyA9IC9bK1xcLV0/XFxkezEsNn0vLCAvLyAtOTk5LDk5OSAtIDk5OSw5OTlcbiAgICAgICAgcGFyc2VUb2tlbkRpZ2l0cyA9IC9cXGQrLywgLy8gbm9uemVybyBudW1iZXIgb2YgZGlnaXRzXG4gICAgICAgIHBhcnNlVG9rZW5Xb3JkID0gL1swLTldKlsnYS16XFx1MDBBMC1cXHUwNUZGXFx1MDcwMC1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkVGXSt8W1xcdTA2MDAtXFx1MDZGRlxcL10rKFxccyo/W1xcdTA2MDAtXFx1MDZGRl0rKXsxLDJ9L2ksIC8vIGFueSB3b3JkIChvciB0d28pIGNoYXJhY3RlcnMgb3IgbnVtYmVycyBpbmNsdWRpbmcgdHdvL3RocmVlIHdvcmQgbW9udGggaW4gYXJhYmljLlxuICAgICAgICBwYXJzZVRva2VuVGltZXpvbmUgPSAvWnxbXFwrXFwtXVxcZFxcZDo/XFxkXFxkL2dpLCAvLyArMDA6MDAgLTAwOjAwICswMDAwIC0wMDAwIG9yIFpcbiAgICAgICAgcGFyc2VUb2tlblQgPSAvVC9pLCAvLyBUIChJU08gc2VwYXJhdG9yKVxuICAgICAgICBwYXJzZVRva2VuVGltZXN0YW1wTXMgPSAvW1xcK1xcLV0/XFxkKyhcXC5cXGR7MSwzfSk/LywgLy8gMTIzNDU2Nzg5IDEyMzQ1Njc4OS4xMjNcbiAgICAgICAgcGFyc2VUb2tlbk9yZGluYWwgPSAvXFxkezEsMn0vLFxuXG4gICAgICAgIC8vc3RyaWN0IHBhcnNpbmcgcmVnZXhlc1xuICAgICAgICBwYXJzZVRva2VuT25lRGlnaXQgPSAvXFxkLywgLy8gMCAtIDlcbiAgICAgICAgcGFyc2VUb2tlblR3b0RpZ2l0cyA9IC9cXGRcXGQvLCAvLyAwMCAtIDk5XG4gICAgICAgIHBhcnNlVG9rZW5UaHJlZURpZ2l0cyA9IC9cXGR7M30vLCAvLyAwMDAgLSA5OTlcbiAgICAgICAgcGFyc2VUb2tlbkZvdXJEaWdpdHMgPSAvXFxkezR9LywgLy8gMDAwMCAtIDk5OTlcbiAgICAgICAgcGFyc2VUb2tlblNpeERpZ2l0cyA9IC9bKy1dP1xcZHs2fS8sIC8vIC05OTksOTk5IC0gOTk5LDk5OVxuICAgICAgICBwYXJzZVRva2VuU2lnbmVkTnVtYmVyID0gL1srLV0/XFxkKy8sIC8vIC1pbmYgLSBpbmZcblxuICAgICAgICAvLyBpc28gODYwMSByZWdleFxuICAgICAgICAvLyAwMDAwLTAwLTAwIDAwMDAtVzAwIG9yIDAwMDAtVzAwLTAgKyBUICsgMDAgb3IgMDA6MDAgb3IgMDA6MDA6MDAgb3IgMDA6MDA6MDAuMDAwICsgKzAwOjAwIG9yICswMDAwIG9yICswMClcbiAgICAgICAgaXNvUmVnZXggPSAvXlxccyooPzpbKy1dXFxkezZ9fFxcZHs0fSktKD86KFxcZFxcZC1cXGRcXGQpfChXXFxkXFxkJCl8KFdcXGRcXGQtXFxkKXwoXFxkXFxkXFxkKSkoKFR8ICkoXFxkXFxkKDpcXGRcXGQoOlxcZFxcZChcXC5cXGQrKT8pPyk/KT8oW1xcK1xcLV1cXGRcXGQoPzo6P1xcZFxcZCk/fFxccypaKT8pPyQvLFxuXG4gICAgICAgIGlzb0Zvcm1hdCA9ICdZWVlZLU1NLUREVEhIOm1tOnNzWicsXG5cbiAgICAgICAgaXNvRGF0ZXMgPSBbXG4gICAgICAgICAgICBbJ1lZWVlZWS1NTS1ERCcsIC9bKy1dXFxkezZ9LVxcZHsyfS1cXGR7Mn0vXSxcbiAgICAgICAgICAgIFsnWVlZWS1NTS1ERCcsIC9cXGR7NH0tXFxkezJ9LVxcZHsyfS9dLFxuICAgICAgICAgICAgWydHR0dHLVtXXVdXLUUnLCAvXFxkezR9LVdcXGR7Mn0tXFxkL10sXG4gICAgICAgICAgICBbJ0dHR0ctW1ddV1cnLCAvXFxkezR9LVdcXGR7Mn0vXSxcbiAgICAgICAgICAgIFsnWVlZWS1EREQnLCAvXFxkezR9LVxcZHszfS9dXG4gICAgICAgIF0sXG5cbiAgICAgICAgLy8gaXNvIHRpbWUgZm9ybWF0cyBhbmQgcmVnZXhlc1xuICAgICAgICBpc29UaW1lcyA9IFtcbiAgICAgICAgICAgIFsnSEg6bW06c3MuU1NTUycsIC8oVHwgKVxcZFxcZDpcXGRcXGQ6XFxkXFxkXFwuXFxkKy9dLFxuICAgICAgICAgICAgWydISDptbTpzcycsIC8oVHwgKVxcZFxcZDpcXGRcXGQ6XFxkXFxkL10sXG4gICAgICAgICAgICBbJ0hIOm1tJywgLyhUfCApXFxkXFxkOlxcZFxcZC9dLFxuICAgICAgICAgICAgWydISCcsIC8oVHwgKVxcZFxcZC9dXG4gICAgICAgIF0sXG5cbiAgICAgICAgLy8gdGltZXpvbmUgY2h1bmtlciAnKzEwOjAwJyA+IFsnMTAnLCAnMDAnXSBvciAnLTE1MzAnID4gWyctMTUnLCAnMzAnXVxuICAgICAgICBwYXJzZVRpbWV6b25lQ2h1bmtlciA9IC8oW1xcK1xcLV18XFxkXFxkKS9naSxcblxuICAgICAgICAvLyBnZXR0ZXIgYW5kIHNldHRlciBuYW1lc1xuICAgICAgICBwcm94eUdldHRlcnNBbmRTZXR0ZXJzID0gJ0RhdGV8SG91cnN8TWludXRlc3xTZWNvbmRzfE1pbGxpc2Vjb25kcycuc3BsaXQoJ3wnKSxcbiAgICAgICAgdW5pdE1pbGxpc2Vjb25kRmFjdG9ycyA9IHtcbiAgICAgICAgICAgICdNaWxsaXNlY29uZHMnIDogMSxcbiAgICAgICAgICAgICdTZWNvbmRzJyA6IDFlMyxcbiAgICAgICAgICAgICdNaW51dGVzJyA6IDZlNCxcbiAgICAgICAgICAgICdIb3VycycgOiAzNmU1LFxuICAgICAgICAgICAgJ0RheXMnIDogODY0ZTUsXG4gICAgICAgICAgICAnTW9udGhzJyA6IDI1OTJlNixcbiAgICAgICAgICAgICdZZWFycycgOiAzMTUzNmU2XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW5pdEFsaWFzZXMgPSB7XG4gICAgICAgICAgICBtcyA6ICdtaWxsaXNlY29uZCcsXG4gICAgICAgICAgICBzIDogJ3NlY29uZCcsXG4gICAgICAgICAgICBtIDogJ21pbnV0ZScsXG4gICAgICAgICAgICBoIDogJ2hvdXInLFxuICAgICAgICAgICAgZCA6ICdkYXknLFxuICAgICAgICAgICAgRCA6ICdkYXRlJyxcbiAgICAgICAgICAgIHcgOiAnd2VlaycsXG4gICAgICAgICAgICBXIDogJ2lzb1dlZWsnLFxuICAgICAgICAgICAgTSA6ICdtb250aCcsXG4gICAgICAgICAgICBRIDogJ3F1YXJ0ZXInLFxuICAgICAgICAgICAgeSA6ICd5ZWFyJyxcbiAgICAgICAgICAgIERERCA6ICdkYXlPZlllYXInLFxuICAgICAgICAgICAgZSA6ICd3ZWVrZGF5JyxcbiAgICAgICAgICAgIEUgOiAnaXNvV2Vla2RheScsXG4gICAgICAgICAgICBnZzogJ3dlZWtZZWFyJyxcbiAgICAgICAgICAgIEdHOiAnaXNvV2Vla1llYXInXG4gICAgICAgIH0sXG5cbiAgICAgICAgY2FtZWxGdW5jdGlvbnMgPSB7XG4gICAgICAgICAgICBkYXlvZnllYXIgOiAnZGF5T2ZZZWFyJyxcbiAgICAgICAgICAgIGlzb3dlZWtkYXkgOiAnaXNvV2Vla2RheScsXG4gICAgICAgICAgICBpc293ZWVrIDogJ2lzb1dlZWsnLFxuICAgICAgICAgICAgd2Vla3llYXIgOiAnd2Vla1llYXInLFxuICAgICAgICAgICAgaXNvd2Vla3llYXIgOiAnaXNvV2Vla1llYXInXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gZm9ybWF0IGZ1bmN0aW9uIHN0cmluZ3NcbiAgICAgICAgZm9ybWF0RnVuY3Rpb25zID0ge30sXG5cbiAgICAgICAgLy8gZGVmYXVsdCByZWxhdGl2ZSB0aW1lIHRocmVzaG9sZHNcbiAgICAgICAgcmVsYXRpdmVUaW1lVGhyZXNob2xkcyA9IHtcbiAgICAgICAgICAgIHM6IDQ1LCAgLy8gc2Vjb25kcyB0byBtaW51dGVcbiAgICAgICAgICAgIG06IDQ1LCAgLy8gbWludXRlcyB0byBob3VyXG4gICAgICAgICAgICBoOiAyMiwgIC8vIGhvdXJzIHRvIGRheVxuICAgICAgICAgICAgZDogMjYsICAvLyBkYXlzIHRvIG1vbnRoXG4gICAgICAgICAgICBNOiAxMSAgIC8vIG1vbnRocyB0byB5ZWFyXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gdG9rZW5zIHRvIG9yZGluYWxpemUgYW5kIHBhZFxuICAgICAgICBvcmRpbmFsaXplVG9rZW5zID0gJ0RERCB3IFcgTSBEIGQnLnNwbGl0KCcgJyksXG4gICAgICAgIHBhZGRlZFRva2VucyA9ICdNIEQgSCBoIG0gcyB3IFcnLnNwbGl0KCcgJyksXG5cbiAgICAgICAgZm9ybWF0VG9rZW5GdW5jdGlvbnMgPSB7XG4gICAgICAgICAgICBNICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1vbnRoKCkgKyAxO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE1NTSAgOiBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1vbnRoc1Nob3J0KHRoaXMsIGZvcm1hdCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgTU1NTSA6IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkubW9udGhzKHRoaXMsIGZvcm1hdCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRCAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRlKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgREREICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXlPZlllYXIoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRheSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRkICAgOiBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzTWluKHRoaXMsIGZvcm1hdCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGRkICA6IGZ1bmN0aW9uIChmb3JtYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkud2Vla2RheXNTaG9ydCh0aGlzLCBmb3JtYXQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRkZGQgOiBmdW5jdGlvbiAoZm9ybWF0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLndlZWtkYXlzKHRoaXMsIGZvcm1hdCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdyAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy53ZWVrKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgVyAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pc29XZWVrKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgWVkgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMueWVhcigpICUgMTAwLCAyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBZWVlZIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy55ZWFyKCksIDQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFlZWVlZIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy55ZWFyKCksIDUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFlZWVlZWSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgeSA9IHRoaXMueWVhcigpLCBzaWduID0geSA+PSAwID8gJysnIDogJy0nO1xuICAgICAgICAgICAgICAgIHJldHVybiBzaWduICsgbGVmdFplcm9GaWxsKE1hdGguYWJzKHkpLCA2KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZyAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy53ZWVrWWVhcigpICUgMTAwLCAyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZ2dnIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy53ZWVrWWVhcigpLCA0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZ2dnZyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMud2Vla1llYXIoKSwgNSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgR0cgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMuaXNvV2Vla1llYXIoKSAlIDEwMCwgMik7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgR0dHRyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRoaXMuaXNvV2Vla1llYXIoKSwgNCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgR0dHR0cgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLmlzb1dlZWtZZWFyKCksIDUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMud2Vla2RheSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNvV2Vla2RheSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGEgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1lcmlkaWVtKHRoaXMuaG91cnMoKSwgdGhpcy5taW51dGVzKCksIHRydWUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEEgICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9jYWxlRGF0YSgpLm1lcmlkaWVtKHRoaXMuaG91cnMoKSwgdGhpcy5taW51dGVzKCksIGZhbHNlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBIICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmhvdXJzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaCAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ob3VycygpICUgMTIgfHwgMTI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbSAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5taW51dGVzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcyAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZWNvbmRzKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUyAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9JbnQodGhpcy5taWxsaXNlY29uZHMoKSAvIDEwMCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU1MgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGVmdFplcm9GaWxsKHRvSW50KHRoaXMubWlsbGlzZWNvbmRzKCkgLyAxMCksIDIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFNTUyAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlZnRaZXJvRmlsbCh0aGlzLm1pbGxpc2Vjb25kcygpLCAzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTU1NTIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwodGhpcy5taWxsaXNlY29uZHMoKSwgMyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgWiAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYSA9IC10aGlzLnpvbmUoKSxcbiAgICAgICAgICAgICAgICAgICAgYiA9ICcrJztcbiAgICAgICAgICAgICAgICBpZiAoYSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYSA9IC1hO1xuICAgICAgICAgICAgICAgICAgICBiID0gJy0nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gYiArIGxlZnRaZXJvRmlsbCh0b0ludChhIC8gNjApLCAyKSArICc6JyArIGxlZnRaZXJvRmlsbCh0b0ludChhKSAlIDYwLCAyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBaWiAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhID0gLXRoaXMuem9uZSgpLFxuICAgICAgICAgICAgICAgICAgICBiID0gJysnO1xuICAgICAgICAgICAgICAgIGlmIChhIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBhID0gLWE7XG4gICAgICAgICAgICAgICAgICAgIGIgPSAnLSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBiICsgbGVmdFplcm9GaWxsKHRvSW50KGEgLyA2MCksIDIpICsgbGVmdFplcm9GaWxsKHRvSW50KGEpICUgNjAsIDIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHogOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuem9uZUFiYnIoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB6eiA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy56b25lTmFtZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFggICAgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudW5peCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFEgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVhcnRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGRlcHJlY2F0aW9ucyA9IHt9LFxuXG4gICAgICAgIGxpc3RzID0gWydtb250aHMnLCAnbW9udGhzU2hvcnQnLCAnd2Vla2RheXMnLCAnd2Vla2RheXNTaG9ydCcsICd3ZWVrZGF5c01pbiddO1xuXG4gICAgLy8gUGljayB0aGUgZmlyc3QgZGVmaW5lZCBvZiB0d28gb3IgdGhyZWUgYXJndW1lbnRzLiBkZmwgY29tZXMgZnJvbVxuICAgIC8vIGRlZmF1bHQuXG4gICAgZnVuY3Rpb24gZGZsKGEsIGIsIGMpIHtcbiAgICAgICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBhICE9IG51bGwgPyBhIDogYjtcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIGEgIT0gbnVsbCA/IGEgOiBiICE9IG51bGwgPyBiIDogYztcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcignSW1wbGVtZW50IG1lJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYXNPd25Qcm9wKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoYSwgYik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmYXVsdFBhcnNpbmdGbGFncygpIHtcbiAgICAgICAgLy8gV2UgbmVlZCB0byBkZWVwIGNsb25lIHRoaXMgb2JqZWN0LCBhbmQgZXM1IHN0YW5kYXJkIGlzIG5vdCB2ZXJ5XG4gICAgICAgIC8vIGhlbHBmdWwuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbXB0eSA6IGZhbHNlLFxuICAgICAgICAgICAgdW51c2VkVG9rZW5zIDogW10sXG4gICAgICAgICAgICB1bnVzZWRJbnB1dCA6IFtdLFxuICAgICAgICAgICAgb3ZlcmZsb3cgOiAtMixcbiAgICAgICAgICAgIGNoYXJzTGVmdE92ZXIgOiAwLFxuICAgICAgICAgICAgbnVsbElucHV0IDogZmFsc2UsXG4gICAgICAgICAgICBpbnZhbGlkTW9udGggOiBudWxsLFxuICAgICAgICAgICAgaW52YWxpZEZvcm1hdCA6IGZhbHNlLFxuICAgICAgICAgICAgdXNlckludmFsaWRhdGVkIDogZmFsc2UsXG4gICAgICAgICAgICBpc286IGZhbHNlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJpbnRNc2cobXNnKSB7XG4gICAgICAgIGlmIChtb21lbnQuc3VwcHJlc3NEZXByZWNhdGlvbldhcm5pbmdzID09PSBmYWxzZSAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJyAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignRGVwcmVjYXRpb24gd2FybmluZzogJyArIG1zZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXByZWNhdGUobXNnLCBmbikge1xuICAgICAgICB2YXIgZmlyc3RUaW1lID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoZmlyc3RUaW1lKSB7XG4gICAgICAgICAgICAgICAgcHJpbnRNc2cobXNnKTtcbiAgICAgICAgICAgICAgICBmaXJzdFRpbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9LCBmbik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVwcmVjYXRlU2ltcGxlKG5hbWUsIG1zZykge1xuICAgICAgICBpZiAoIWRlcHJlY2F0aW9uc1tuYW1lXSkge1xuICAgICAgICAgICAgcHJpbnRNc2cobXNnKTtcbiAgICAgICAgICAgIGRlcHJlY2F0aW9uc1tuYW1lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYWRUb2tlbihmdW5jLCBjb3VudCkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBsZWZ0WmVyb0ZpbGwoZnVuYy5jYWxsKHRoaXMsIGEpLCBjb3VudCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9yZGluYWxpemVUb2tlbihmdW5jLCBwZXJpb2QpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGVEYXRhKCkub3JkaW5hbChmdW5jLmNhbGwodGhpcywgYSksIHBlcmlvZCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgd2hpbGUgKG9yZGluYWxpemVUb2tlbnMubGVuZ3RoKSB7XG4gICAgICAgIGkgPSBvcmRpbmFsaXplVG9rZW5zLnBvcCgpO1xuICAgICAgICBmb3JtYXRUb2tlbkZ1bmN0aW9uc1tpICsgJ28nXSA9IG9yZGluYWxpemVUb2tlbihmb3JtYXRUb2tlbkZ1bmN0aW9uc1tpXSwgaSk7XG4gICAgfVxuICAgIHdoaWxlIChwYWRkZWRUb2tlbnMubGVuZ3RoKSB7XG4gICAgICAgIGkgPSBwYWRkZWRUb2tlbnMucG9wKCk7XG4gICAgICAgIGZvcm1hdFRva2VuRnVuY3Rpb25zW2kgKyBpXSA9IHBhZFRva2VuKGZvcm1hdFRva2VuRnVuY3Rpb25zW2ldLCAyKTtcbiAgICB9XG4gICAgZm9ybWF0VG9rZW5GdW5jdGlvbnMuRERERCA9IHBhZFRva2VuKGZvcm1hdFRva2VuRnVuY3Rpb25zLkRERCwgMyk7XG5cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgQ29uc3RydWN0b3JzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgZnVuY3Rpb24gTG9jYWxlKCkge1xuICAgIH1cblxuICAgIC8vIE1vbWVudCBwcm90b3R5cGUgb2JqZWN0XG4gICAgZnVuY3Rpb24gTW9tZW50KGNvbmZpZywgc2tpcE92ZXJmbG93KSB7XG4gICAgICAgIGlmIChza2lwT3ZlcmZsb3cgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICBjaGVja092ZXJmbG93KGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICAgICAgY29weUNvbmZpZyh0aGlzLCBjb25maWcpO1xuICAgICAgICB0aGlzLl9kID0gbmV3IERhdGUoK2NvbmZpZy5fZCk7XG4gICAgfVxuXG4gICAgLy8gRHVyYXRpb24gQ29uc3RydWN0b3JcbiAgICBmdW5jdGlvbiBEdXJhdGlvbihkdXJhdGlvbikge1xuICAgICAgICB2YXIgbm9ybWFsaXplZElucHV0ID0gbm9ybWFsaXplT2JqZWN0VW5pdHMoZHVyYXRpb24pLFxuICAgICAgICAgICAgeWVhcnMgPSBub3JtYWxpemVkSW5wdXQueWVhciB8fCAwLFxuICAgICAgICAgICAgcXVhcnRlcnMgPSBub3JtYWxpemVkSW5wdXQucXVhcnRlciB8fCAwLFxuICAgICAgICAgICAgbW9udGhzID0gbm9ybWFsaXplZElucHV0Lm1vbnRoIHx8IDAsXG4gICAgICAgICAgICB3ZWVrcyA9IG5vcm1hbGl6ZWRJbnB1dC53ZWVrIHx8IDAsXG4gICAgICAgICAgICBkYXlzID0gbm9ybWFsaXplZElucHV0LmRheSB8fCAwLFxuICAgICAgICAgICAgaG91cnMgPSBub3JtYWxpemVkSW5wdXQuaG91ciB8fCAwLFxuICAgICAgICAgICAgbWludXRlcyA9IG5vcm1hbGl6ZWRJbnB1dC5taW51dGUgfHwgMCxcbiAgICAgICAgICAgIHNlY29uZHMgPSBub3JtYWxpemVkSW5wdXQuc2Vjb25kIHx8IDAsXG4gICAgICAgICAgICBtaWxsaXNlY29uZHMgPSBub3JtYWxpemVkSW5wdXQubWlsbGlzZWNvbmQgfHwgMDtcblxuICAgICAgICAvLyByZXByZXNlbnRhdGlvbiBmb3IgZGF0ZUFkZFJlbW92ZVxuICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgPSArbWlsbGlzZWNvbmRzICtcbiAgICAgICAgICAgIHNlY29uZHMgKiAxZTMgKyAvLyAxMDAwXG4gICAgICAgICAgICBtaW51dGVzICogNmU0ICsgLy8gMTAwMCAqIDYwXG4gICAgICAgICAgICBob3VycyAqIDM2ZTU7IC8vIDEwMDAgKiA2MCAqIDYwXG4gICAgICAgIC8vIEJlY2F1c2Ugb2YgZGF0ZUFkZFJlbW92ZSB0cmVhdHMgMjQgaG91cnMgYXMgZGlmZmVyZW50IGZyb20gYVxuICAgICAgICAvLyBkYXkgd2hlbiB3b3JraW5nIGFyb3VuZCBEU1QsIHdlIG5lZWQgdG8gc3RvcmUgdGhlbSBzZXBhcmF0ZWx5XG4gICAgICAgIHRoaXMuX2RheXMgPSArZGF5cyArXG4gICAgICAgICAgICB3ZWVrcyAqIDc7XG4gICAgICAgIC8vIEl0IGlzIGltcG9zc2libGUgdHJhbnNsYXRlIG1vbnRocyBpbnRvIGRheXMgd2l0aG91dCBrbm93aW5nXG4gICAgICAgIC8vIHdoaWNoIG1vbnRocyB5b3UgYXJlIGFyZSB0YWxraW5nIGFib3V0LCBzbyB3ZSBoYXZlIHRvIHN0b3JlXG4gICAgICAgIC8vIGl0IHNlcGFyYXRlbHkuXG4gICAgICAgIHRoaXMuX21vbnRocyA9ICttb250aHMgK1xuICAgICAgICAgICAgcXVhcnRlcnMgKiAzICtcbiAgICAgICAgICAgIHllYXJzICogMTI7XG5cbiAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuXG4gICAgICAgIHRoaXMuX2xvY2FsZSA9IG1vbWVudC5sb2NhbGVEYXRhKCk7XG5cbiAgICAgICAgdGhpcy5fYnViYmxlKCk7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBIZWxwZXJzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICBmdW5jdGlvbiBleHRlbmQoYSwgYikge1xuICAgICAgICBmb3IgKHZhciBpIGluIGIpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd25Qcm9wKGIsIGkpKSB7XG4gICAgICAgICAgICAgICAgYVtpXSA9IGJbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFzT3duUHJvcChiLCAndG9TdHJpbmcnKSkge1xuICAgICAgICAgICAgYS50b1N0cmluZyA9IGIudG9TdHJpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaGFzT3duUHJvcChiLCAndmFsdWVPZicpKSB7XG4gICAgICAgICAgICBhLnZhbHVlT2YgPSBiLnZhbHVlT2Y7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb3B5Q29uZmlnKHRvLCBmcm9tKSB7XG4gICAgICAgIHZhciBpLCBwcm9wLCB2YWw7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9pc0FNb21lbnRPYmplY3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5faXNBTW9tZW50T2JqZWN0ID0gZnJvbS5faXNBTW9tZW50T2JqZWN0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5faSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9pID0gZnJvbS5faTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX2YgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fZiA9IGZyb20uX2Y7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9sICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX2wgPSBmcm9tLl9sO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fc3RyaWN0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX3N0cmljdCA9IGZyb20uX3N0cmljdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX3R6bSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl90em0gPSBmcm9tLl90em07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9pc1VUQyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRvLl9pc1VUQyA9IGZyb20uX2lzVVRDO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbS5fb2Zmc2V0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX29mZnNldCA9IGZyb20uX29mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGZyb20uX3BmICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdG8uX3BmID0gZnJvbS5fcGY7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tLl9sb2NhbGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0by5fbG9jYWxlID0gZnJvbS5fbG9jYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vbWVudFByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm9yIChpIGluIG1vbWVudFByb3BlcnRpZXMpIHtcbiAgICAgICAgICAgICAgICBwcm9wID0gbW9tZW50UHJvcGVydGllc1tpXTtcbiAgICAgICAgICAgICAgICB2YWwgPSBmcm9tW3Byb3BdO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICB0b1twcm9wXSA9IHZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdG87XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWJzUm91bmQobnVtYmVyKSB7XG4gICAgICAgIGlmIChudW1iZXIgPCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKG51bWJlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihudW1iZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gbGVmdCB6ZXJvIGZpbGwgYSBudW1iZXJcbiAgICAvLyBzZWUgaHR0cDovL2pzcGVyZi5jb20vbGVmdC16ZXJvLWZpbGxpbmcgZm9yIHBlcmZvcm1hbmNlIGNvbXBhcmlzb25cbiAgICBmdW5jdGlvbiBsZWZ0WmVyb0ZpbGwobnVtYmVyLCB0YXJnZXRMZW5ndGgsIGZvcmNlU2lnbikge1xuICAgICAgICB2YXIgb3V0cHV0ID0gJycgKyBNYXRoLmFicyhudW1iZXIpLFxuICAgICAgICAgICAgc2lnbiA9IG51bWJlciA+PSAwO1xuXG4gICAgICAgIHdoaWxlIChvdXRwdXQubGVuZ3RoIDwgdGFyZ2V0TGVuZ3RoKSB7XG4gICAgICAgICAgICBvdXRwdXQgPSAnMCcgKyBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChzaWduID8gKGZvcmNlU2lnbiA/ICcrJyA6ICcnKSA6ICctJykgKyBvdXRwdXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShiYXNlLCBvdGhlcikge1xuICAgICAgICB2YXIgcmVzID0ge21pbGxpc2Vjb25kczogMCwgbW9udGhzOiAwfTtcblxuICAgICAgICByZXMubW9udGhzID0gb3RoZXIubW9udGgoKSAtIGJhc2UubW9udGgoKSArXG4gICAgICAgICAgICAob3RoZXIueWVhcigpIC0gYmFzZS55ZWFyKCkpICogMTI7XG4gICAgICAgIGlmIChiYXNlLmNsb25lKCkuYWRkKHJlcy5tb250aHMsICdNJykuaXNBZnRlcihvdGhlcikpIHtcbiAgICAgICAgICAgIC0tcmVzLm1vbnRocztcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcy5taWxsaXNlY29uZHMgPSArb3RoZXIgLSArKGJhc2UuY2xvbmUoKS5hZGQocmVzLm1vbnRocywgJ00nKSk7XG5cbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb21lbnRzRGlmZmVyZW5jZShiYXNlLCBvdGhlcikge1xuICAgICAgICB2YXIgcmVzO1xuICAgICAgICBvdGhlciA9IG1ha2VBcyhvdGhlciwgYmFzZSk7XG4gICAgICAgIGlmIChiYXNlLmlzQmVmb3JlKG90aGVyKSkge1xuICAgICAgICAgICAgcmVzID0gcG9zaXRpdmVNb21lbnRzRGlmZmVyZW5jZShiYXNlLCBvdGhlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXMgPSBwb3NpdGl2ZU1vbWVudHNEaWZmZXJlbmNlKG90aGVyLCBiYXNlKTtcbiAgICAgICAgICAgIHJlcy5taWxsaXNlY29uZHMgPSAtcmVzLm1pbGxpc2Vjb25kcztcbiAgICAgICAgICAgIHJlcy5tb250aHMgPSAtcmVzLm1vbnRocztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogcmVtb3ZlICduYW1lJyBhcmcgYWZ0ZXIgZGVwcmVjYXRpb24gaXMgcmVtb3ZlZFxuICAgIGZ1bmN0aW9uIGNyZWF0ZUFkZGVyKGRpcmVjdGlvbiwgbmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbCwgcGVyaW9kKSB7XG4gICAgICAgICAgICB2YXIgZHVyLCB0bXA7XG4gICAgICAgICAgICAvL2ludmVydCB0aGUgYXJndW1lbnRzLCBidXQgY29tcGxhaW4gYWJvdXQgaXRcbiAgICAgICAgICAgIGlmIChwZXJpb2QgIT09IG51bGwgJiYgIWlzTmFOKCtwZXJpb2QpKSB7XG4gICAgICAgICAgICAgICAgZGVwcmVjYXRlU2ltcGxlKG5hbWUsICdtb21lbnQoKS4nICsgbmFtZSAgKyAnKHBlcmlvZCwgbnVtYmVyKSBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIG1vbWVudCgpLicgKyBuYW1lICsgJyhudW1iZXIsIHBlcmlvZCkuJyk7XG4gICAgICAgICAgICAgICAgdG1wID0gdmFsOyB2YWwgPSBwZXJpb2Q7IHBlcmlvZCA9IHRtcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFsID0gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyArdmFsIDogdmFsO1xuICAgICAgICAgICAgZHVyID0gbW9tZW50LmR1cmF0aW9uKHZhbCwgcGVyaW9kKTtcbiAgICAgICAgICAgIGFkZE9yU3VidHJhY3REdXJhdGlvbkZyb21Nb21lbnQodGhpcywgZHVyLCBkaXJlY3Rpb24pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkT3JTdWJ0cmFjdER1cmF0aW9uRnJvbU1vbWVudChtb20sIGR1cmF0aW9uLCBpc0FkZGluZywgdXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSBkdXJhdGlvbi5fbWlsbGlzZWNvbmRzLFxuICAgICAgICAgICAgZGF5cyA9IGR1cmF0aW9uLl9kYXlzLFxuICAgICAgICAgICAgbW9udGhzID0gZHVyYXRpb24uX21vbnRocztcbiAgICAgICAgdXBkYXRlT2Zmc2V0ID0gdXBkYXRlT2Zmc2V0ID09IG51bGwgPyB0cnVlIDogdXBkYXRlT2Zmc2V0O1xuXG4gICAgICAgIGlmIChtaWxsaXNlY29uZHMpIHtcbiAgICAgICAgICAgIG1vbS5fZC5zZXRUaW1lKCttb20uX2QgKyBtaWxsaXNlY29uZHMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRheXMpIHtcbiAgICAgICAgICAgIHJhd1NldHRlcihtb20sICdEYXRlJywgcmF3R2V0dGVyKG1vbSwgJ0RhdGUnKSArIGRheXMgKiBpc0FkZGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vbnRocykge1xuICAgICAgICAgICAgcmF3TW9udGhTZXR0ZXIobW9tLCByYXdHZXR0ZXIobW9tLCAnTW9udGgnKSArIG1vbnRocyAqIGlzQWRkaW5nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXBkYXRlT2Zmc2V0KSB7XG4gICAgICAgICAgICBtb21lbnQudXBkYXRlT2Zmc2V0KG1vbSwgZGF5cyB8fCBtb250aHMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaWYgaXMgYW4gYXJyYXlcbiAgICBmdW5jdGlvbiBpc0FycmF5KGlucHV0KSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaW5wdXQpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGF0ZShpbnB1dCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlucHV0KSA9PT0gJ1tvYmplY3QgRGF0ZV0nIHx8XG4gICAgICAgICAgICBpbnB1dCBpbnN0YW5jZW9mIERhdGU7XG4gICAgfVxuXG4gICAgLy8gY29tcGFyZSB0d28gYXJyYXlzLCByZXR1cm4gdGhlIG51bWJlciBvZiBkaWZmZXJlbmNlc1xuICAgIGZ1bmN0aW9uIGNvbXBhcmVBcnJheXMoYXJyYXkxLCBhcnJheTIsIGRvbnRDb252ZXJ0KSB7XG4gICAgICAgIHZhciBsZW4gPSBNYXRoLm1pbihhcnJheTEubGVuZ3RoLCBhcnJheTIubGVuZ3RoKSxcbiAgICAgICAgICAgIGxlbmd0aERpZmYgPSBNYXRoLmFicyhhcnJheTEubGVuZ3RoIC0gYXJyYXkyLmxlbmd0aCksXG4gICAgICAgICAgICBkaWZmcyA9IDAsXG4gICAgICAgICAgICBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgoZG9udENvbnZlcnQgJiYgYXJyYXkxW2ldICE9PSBhcnJheTJbaV0pIHx8XG4gICAgICAgICAgICAgICAgKCFkb250Q29udmVydCAmJiB0b0ludChhcnJheTFbaV0pICE9PSB0b0ludChhcnJheTJbaV0pKSkge1xuICAgICAgICAgICAgICAgIGRpZmZzKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRpZmZzICsgbGVuZ3RoRGlmZjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVVbml0cyh1bml0cykge1xuICAgICAgICBpZiAodW5pdHMpIHtcbiAgICAgICAgICAgIHZhciBsb3dlcmVkID0gdW5pdHMudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8oLilzJC8sICckMScpO1xuICAgICAgICAgICAgdW5pdHMgPSB1bml0QWxpYXNlc1t1bml0c10gfHwgY2FtZWxGdW5jdGlvbnNbbG93ZXJlZF0gfHwgbG93ZXJlZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5pdHM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplT2JqZWN0VW5pdHMoaW5wdXRPYmplY3QpIHtcbiAgICAgICAgdmFyIG5vcm1hbGl6ZWRJbnB1dCA9IHt9LFxuICAgICAgICAgICAgbm9ybWFsaXplZFByb3AsXG4gICAgICAgICAgICBwcm9wO1xuXG4gICAgICAgIGZvciAocHJvcCBpbiBpbnB1dE9iamVjdCkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3AoaW5wdXRPYmplY3QsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZFByb3AgPSBub3JtYWxpemVVbml0cyhwcm9wKTtcbiAgICAgICAgICAgICAgICBpZiAobm9ybWFsaXplZFByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZElucHV0W25vcm1hbGl6ZWRQcm9wXSA9IGlucHV0T2JqZWN0W3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub3JtYWxpemVkSW5wdXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUxpc3QoZmllbGQpIHtcbiAgICAgICAgdmFyIGNvdW50LCBzZXR0ZXI7XG5cbiAgICAgICAgaWYgKGZpZWxkLmluZGV4T2YoJ3dlZWsnKSA9PT0gMCkge1xuICAgICAgICAgICAgY291bnQgPSA3O1xuICAgICAgICAgICAgc2V0dGVyID0gJ2RheSc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZmllbGQuaW5kZXhPZignbW9udGgnKSA9PT0gMCkge1xuICAgICAgICAgICAgY291bnQgPSAxMjtcbiAgICAgICAgICAgIHNldHRlciA9ICdtb250aCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBtb21lbnRbZmllbGRdID0gZnVuY3Rpb24gKGZvcm1hdCwgaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBpLCBnZXR0ZXIsXG4gICAgICAgICAgICAgICAgbWV0aG9kID0gbW9tZW50Ll9sb2NhbGVbZmllbGRdLFxuICAgICAgICAgICAgICAgIHJlc3VsdHMgPSBbXTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBmb3JtYXQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBmb3JtYXQ7XG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBnZXR0ZXIgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgIHZhciBtID0gbW9tZW50KCkudXRjKCkuc2V0KHNldHRlciwgaSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ldGhvZC5jYWxsKG1vbWVudC5fbG9jYWxlLCBtLCBmb3JtYXQgfHwgJycpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKGluZGV4ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0dGVyKGluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChnZXR0ZXIoaSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b0ludChhcmd1bWVudEZvckNvZXJjaW9uKSB7XG4gICAgICAgIHZhciBjb2VyY2VkTnVtYmVyID0gK2FyZ3VtZW50Rm9yQ29lcmNpb24sXG4gICAgICAgICAgICB2YWx1ZSA9IDA7XG5cbiAgICAgICAgaWYgKGNvZXJjZWROdW1iZXIgIT09IDAgJiYgaXNGaW5pdGUoY29lcmNlZE51bWJlcikpIHtcbiAgICAgICAgICAgIGlmIChjb2VyY2VkTnVtYmVyID49IDApIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IE1hdGguZmxvb3IoY29lcmNlZE51bWJlcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gTWF0aC5jZWlsKGNvZXJjZWROdW1iZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRheXNJbk1vbnRoKHllYXIsIG1vbnRoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQyh5ZWFyLCBtb250aCArIDEsIDApKS5nZXRVVENEYXRlKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gd2Vla3NJblllYXIoeWVhciwgZG93LCBkb3kpIHtcbiAgICAgICAgcmV0dXJuIHdlZWtPZlllYXIobW9tZW50KFt5ZWFyLCAxMSwgMzEgKyBkb3cgLSBkb3ldKSwgZG93LCBkb3kpLndlZWs7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGF5c0luWWVhcih5ZWFyKSB7XG4gICAgICAgIHJldHVybiBpc0xlYXBZZWFyKHllYXIpID8gMzY2IDogMzY1O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzTGVhcFllYXIoeWVhcikge1xuICAgICAgICByZXR1cm4gKHllYXIgJSA0ID09PSAwICYmIHllYXIgJSAxMDAgIT09IDApIHx8IHllYXIgJSA0MDAgPT09IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tPdmVyZmxvdyhtKSB7XG4gICAgICAgIHZhciBvdmVyZmxvdztcbiAgICAgICAgaWYgKG0uX2EgJiYgbS5fcGYub3ZlcmZsb3cgPT09IC0yKSB7XG4gICAgICAgICAgICBvdmVyZmxvdyA9XG4gICAgICAgICAgICAgICAgbS5fYVtNT05USF0gPCAwIHx8IG0uX2FbTU9OVEhdID4gMTEgPyBNT05USCA6XG4gICAgICAgICAgICAgICAgbS5fYVtEQVRFXSA8IDEgfHwgbS5fYVtEQVRFXSA+IGRheXNJbk1vbnRoKG0uX2FbWUVBUl0sIG0uX2FbTU9OVEhdKSA/IERBVEUgOlxuICAgICAgICAgICAgICAgIG0uX2FbSE9VUl0gPCAwIHx8IG0uX2FbSE9VUl0gPiAyMyA/IEhPVVIgOlxuICAgICAgICAgICAgICAgIG0uX2FbTUlOVVRFXSA8IDAgfHwgbS5fYVtNSU5VVEVdID4gNTkgPyBNSU5VVEUgOlxuICAgICAgICAgICAgICAgIG0uX2FbU0VDT05EXSA8IDAgfHwgbS5fYVtTRUNPTkRdID4gNTkgPyBTRUNPTkQgOlxuICAgICAgICAgICAgICAgIG0uX2FbTUlMTElTRUNPTkRdIDwgMCB8fCBtLl9hW01JTExJU0VDT05EXSA+IDk5OSA/IE1JTExJU0VDT05EIDpcbiAgICAgICAgICAgICAgICAtMTtcblxuICAgICAgICAgICAgaWYgKG0uX3BmLl9vdmVyZmxvd0RheU9mWWVhciAmJiAob3ZlcmZsb3cgPCBZRUFSIHx8IG92ZXJmbG93ID4gREFURSkpIHtcbiAgICAgICAgICAgICAgICBvdmVyZmxvdyA9IERBVEU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG0uX3BmLm92ZXJmbG93ID0gb3ZlcmZsb3c7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1ZhbGlkKG0pIHtcbiAgICAgICAgaWYgKG0uX2lzVmFsaWQgPT0gbnVsbCkge1xuICAgICAgICAgICAgbS5faXNWYWxpZCA9ICFpc05hTihtLl9kLmdldFRpbWUoKSkgJiZcbiAgICAgICAgICAgICAgICBtLl9wZi5vdmVyZmxvdyA8IDAgJiZcbiAgICAgICAgICAgICAgICAhbS5fcGYuZW1wdHkgJiZcbiAgICAgICAgICAgICAgICAhbS5fcGYuaW52YWxpZE1vbnRoICYmXG4gICAgICAgICAgICAgICAgIW0uX3BmLm51bGxJbnB1dCAmJlxuICAgICAgICAgICAgICAgICFtLl9wZi5pbnZhbGlkRm9ybWF0ICYmXG4gICAgICAgICAgICAgICAgIW0uX3BmLnVzZXJJbnZhbGlkYXRlZDtcblxuICAgICAgICAgICAgaWYgKG0uX3N0cmljdCkge1xuICAgICAgICAgICAgICAgIG0uX2lzVmFsaWQgPSBtLl9pc1ZhbGlkICYmXG4gICAgICAgICAgICAgICAgICAgIG0uX3BmLmNoYXJzTGVmdE92ZXIgPT09IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgbS5fcGYudW51c2VkVG9rZW5zLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbS5faXNWYWxpZDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemVMb2NhbGUoa2V5KSB7XG4gICAgICAgIHJldHVybiBrZXkgPyBrZXkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCdfJywgJy0nKSA6IGtleTtcbiAgICB9XG5cbiAgICAvLyBwaWNrIHRoZSBsb2NhbGUgZnJvbSB0aGUgYXJyYXlcbiAgICAvLyB0cnkgWydlbi1hdScsICdlbi1nYiddIGFzICdlbi1hdScsICdlbi1nYicsICdlbicsIGFzIGluIG1vdmUgdGhyb3VnaCB0aGUgbGlzdCB0cnlpbmcgZWFjaFxuICAgIC8vIHN1YnN0cmluZyBmcm9tIG1vc3Qgc3BlY2lmaWMgdG8gbGVhc3QsIGJ1dCBtb3ZlIHRvIHRoZSBuZXh0IGFycmF5IGl0ZW0gaWYgaXQncyBhIG1vcmUgc3BlY2lmaWMgdmFyaWFudCB0aGFuIHRoZSBjdXJyZW50IHJvb3RcbiAgICBmdW5jdGlvbiBjaG9vc2VMb2NhbGUobmFtZXMpIHtcbiAgICAgICAgdmFyIGkgPSAwLCBqLCBuZXh0LCBsb2NhbGUsIHNwbGl0O1xuXG4gICAgICAgIHdoaWxlIChpIDwgbmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzcGxpdCA9IG5vcm1hbGl6ZUxvY2FsZShuYW1lc1tpXSkuc3BsaXQoJy0nKTtcbiAgICAgICAgICAgIGogPSBzcGxpdC5sZW5ndGg7XG4gICAgICAgICAgICBuZXh0ID0gbm9ybWFsaXplTG9jYWxlKG5hbWVzW2kgKyAxXSk7XG4gICAgICAgICAgICBuZXh0ID0gbmV4dCA/IG5leHQuc3BsaXQoJy0nKSA6IG51bGw7XG4gICAgICAgICAgICB3aGlsZSAoaiA+IDApIHtcbiAgICAgICAgICAgICAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKHNwbGl0LnNsaWNlKDAsIGopLmpvaW4oJy0nKSk7XG4gICAgICAgICAgICAgICAgaWYgKGxvY2FsZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbG9jYWxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobmV4dCAmJiBuZXh0Lmxlbmd0aCA+PSBqICYmIGNvbXBhcmVBcnJheXMoc3BsaXQsIG5leHQsIHRydWUpID49IGogLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vdGhlIG5leHQgYXJyYXkgaXRlbSBpcyBiZXR0ZXIgdGhhbiBhIHNoYWxsb3dlciBzdWJzdHJpbmcgb2YgdGhpcyBvbmVcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGotLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2FkTG9jYWxlKG5hbWUpIHtcbiAgICAgICAgdmFyIG9sZExvY2FsZSA9IG51bGw7XG4gICAgICAgIGlmICghbG9jYWxlc1tuYW1lXSAmJiBoYXNNb2R1bGUpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgb2xkTG9jYWxlID0gbW9tZW50LmxvY2FsZSgpO1xuICAgICAgICAgICAgICAgIHJlcXVpcmUoJy4vbG9jYWxlLycgKyBuYW1lKTtcbiAgICAgICAgICAgICAgICAvLyBiZWNhdXNlIGRlZmluZUxvY2FsZSBjdXJyZW50bHkgYWxzbyBzZXRzIHRoZSBnbG9iYWwgbG9jYWxlLCB3ZSB3YW50IHRvIHVuZG8gdGhhdCBmb3IgbGF6eSBsb2FkZWQgbG9jYWxlc1xuICAgICAgICAgICAgICAgIG1vbWVudC5sb2NhbGUob2xkTG9jYWxlKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2NhbGVzW25hbWVdO1xuICAgIH1cblxuICAgIC8vIFJldHVybiBhIG1vbWVudCBmcm9tIGlucHV0LCB0aGF0IGlzIGxvY2FsL3V0Yy96b25lIGVxdWl2YWxlbnQgdG8gbW9kZWwuXG4gICAgZnVuY3Rpb24gbWFrZUFzKGlucHV0LCBtb2RlbCkge1xuICAgICAgICByZXR1cm4gbW9kZWwuX2lzVVRDID8gbW9tZW50KGlucHV0KS56b25lKG1vZGVsLl9vZmZzZXQgfHwgMCkgOlxuICAgICAgICAgICAgbW9tZW50KGlucHV0KS5sb2NhbCgpO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgTG9jYWxlXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICBleHRlbmQoTG9jYWxlLnByb3RvdHlwZSwge1xuXG4gICAgICAgIHNldCA6IGZ1bmN0aW9uIChjb25maWcpIHtcbiAgICAgICAgICAgIHZhciBwcm9wLCBpO1xuICAgICAgICAgICAgZm9yIChpIGluIGNvbmZpZykge1xuICAgICAgICAgICAgICAgIHByb3AgPSBjb25maWdbaV07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNbaV0gPSBwcm9wO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXNbJ18nICsgaV0gPSBwcm9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfbW9udGhzIDogJ0phbnVhcnlfRmVicnVhcnlfTWFyY2hfQXByaWxfTWF5X0p1bmVfSnVseV9BdWd1c3RfU2VwdGVtYmVyX09jdG9iZXJfTm92ZW1iZXJfRGVjZW1iZXInLnNwbGl0KCdfJyksXG4gICAgICAgIG1vbnRocyA6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzW20ubW9udGgoKV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgX21vbnRoc1Nob3J0IDogJ0phbl9GZWJfTWFyX0Fwcl9NYXlfSnVuX0p1bF9BdWdfU2VwX09jdF9Ob3ZfRGVjJy5zcGxpdCgnXycpLFxuICAgICAgICBtb250aHNTaG9ydCA6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbW9udGhzU2hvcnRbbS5tb250aCgpXTtcbiAgICAgICAgfSxcblxuICAgICAgICBtb250aHNQYXJzZSA6IGZ1bmN0aW9uIChtb250aE5hbWUpIHtcbiAgICAgICAgICAgIHZhciBpLCBtb20sIHJlZ2V4O1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuX21vbnRoc1BhcnNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbW9udGhzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IDEyOyBpKyspIHtcbiAgICAgICAgICAgICAgICAvLyBtYWtlIHRoZSByZWdleCBpZiB3ZSBkb24ndCBoYXZlIGl0IGFscmVhZHlcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX21vbnRoc1BhcnNlW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vbSA9IG1vbWVudC51dGMoWzIwMDAsIGldKTtcbiAgICAgICAgICAgICAgICAgICAgcmVnZXggPSAnXicgKyB0aGlzLm1vbnRocyhtb20sICcnKSArICd8XicgKyB0aGlzLm1vbnRoc1Nob3J0KG1vbSwgJycpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tb250aHNQYXJzZVtpXSA9IG5ldyBSZWdFeHAocmVnZXgucmVwbGFjZSgnLicsICcnKSwgJ2knKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gdGVzdCB0aGUgcmVnZXhcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbW9udGhzUGFyc2VbaV0udGVzdChtb250aE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfd2Vla2RheXMgOiAnU3VuZGF5X01vbmRheV9UdWVzZGF5X1dlZG5lc2RheV9UaHVyc2RheV9GcmlkYXlfU2F0dXJkYXknLnNwbGl0KCdfJyksXG4gICAgICAgIHdlZWtkYXlzIDogZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl93ZWVrZGF5c1ttLmRheSgpXTtcbiAgICAgICAgfSxcblxuICAgICAgICBfd2Vla2RheXNTaG9ydCA6ICdTdW5fTW9uX1R1ZV9XZWRfVGh1X0ZyaV9TYXQnLnNwbGl0KCdfJyksXG4gICAgICAgIHdlZWtkYXlzU2hvcnQgOiBmdW5jdGlvbiAobSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3dlZWtkYXlzU2hvcnRbbS5kYXkoKV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3dlZWtkYXlzTWluIDogJ1N1X01vX1R1X1dlX1RoX0ZyX1NhJy5zcGxpdCgnXycpLFxuICAgICAgICB3ZWVrZGF5c01pbiA6IGZ1bmN0aW9uIChtKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fd2Vla2RheXNNaW5bbS5kYXkoKV07XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2Vla2RheXNQYXJzZSA6IGZ1bmN0aW9uICh3ZWVrZGF5TmFtZSkge1xuICAgICAgICAgICAgdmFyIGksIG1vbSwgcmVnZXg7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5fd2Vla2RheXNQYXJzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3dlZWtkYXlzUGFyc2UgPSBbXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgICAgICAgICAgIC8vIG1ha2UgdGhlIHJlZ2V4IGlmIHdlIGRvbid0IGhhdmUgaXQgYWxyZWFkeVxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fd2Vla2RheXNQYXJzZVtpXSkge1xuICAgICAgICAgICAgICAgICAgICBtb20gPSBtb21lbnQoWzIwMDAsIDFdKS5kYXkoaSk7XG4gICAgICAgICAgICAgICAgICAgIHJlZ2V4ID0gJ14nICsgdGhpcy53ZWVrZGF5cyhtb20sICcnKSArICd8XicgKyB0aGlzLndlZWtkYXlzU2hvcnQobW9tLCAnJykgKyAnfF4nICsgdGhpcy53ZWVrZGF5c01pbihtb20sICcnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fd2Vla2RheXNQYXJzZVtpXSA9IG5ldyBSZWdFeHAocmVnZXgucmVwbGFjZSgnLicsICcnKSwgJ2knKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gdGVzdCB0aGUgcmVnZXhcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fd2Vla2RheXNQYXJzZVtpXS50ZXN0KHdlZWtkYXlOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2xvbmdEYXRlRm9ybWF0IDoge1xuICAgICAgICAgICAgTFQgOiAnaDptbSBBJyxcbiAgICAgICAgICAgIEwgOiAnTU0vREQvWVlZWScsXG4gICAgICAgICAgICBMTCA6ICdNTU1NIEQsIFlZWVknLFxuICAgICAgICAgICAgTExMIDogJ01NTU0gRCwgWVlZWSBMVCcsXG4gICAgICAgICAgICBMTExMIDogJ2RkZGQsIE1NTU0gRCwgWVlZWSBMVCdcbiAgICAgICAgfSxcbiAgICAgICAgbG9uZ0RhdGVGb3JtYXQgOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gdGhpcy5fbG9uZ0RhdGVGb3JtYXRba2V5XTtcbiAgICAgICAgICAgIGlmICghb3V0cHV0ICYmIHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleS50b1VwcGVyQ2FzZSgpXSkge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleS50b1VwcGVyQ2FzZSgpXS5yZXBsYWNlKC9NTU1NfE1NfEREfGRkZGQvZywgZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsLnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuX2xvbmdEYXRlRm9ybWF0W2tleV0gPSBvdXRwdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzUE0gOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIC8vIElFOCBRdWlya3MgTW9kZSAmIElFNyBTdGFuZGFyZHMgTW9kZSBkbyBub3QgYWxsb3cgYWNjZXNzaW5nIHN0cmluZ3MgbGlrZSBhcnJheXNcbiAgICAgICAgICAgIC8vIFVzaW5nIGNoYXJBdCBzaG91bGQgYmUgbW9yZSBjb21wYXRpYmxlLlxuICAgICAgICAgICAgcmV0dXJuICgoaW5wdXQgKyAnJykudG9Mb3dlckNhc2UoKS5jaGFyQXQoMCkgPT09ICdwJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX21lcmlkaWVtUGFyc2UgOiAvW2FwXVxcLj9tP1xcLj8vaSxcbiAgICAgICAgbWVyaWRpZW0gOiBmdW5jdGlvbiAoaG91cnMsIG1pbnV0ZXMsIGlzTG93ZXIpIHtcbiAgICAgICAgICAgIGlmIChob3VycyA+IDExKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzTG93ZXIgPyAncG0nIDogJ1BNJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzTG93ZXIgPyAnYW0nIDogJ0FNJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBfY2FsZW5kYXIgOiB7XG4gICAgICAgICAgICBzYW1lRGF5IDogJ1tUb2RheSBhdF0gTFQnLFxuICAgICAgICAgICAgbmV4dERheSA6ICdbVG9tb3Jyb3cgYXRdIExUJyxcbiAgICAgICAgICAgIG5leHRXZWVrIDogJ2RkZGQgW2F0XSBMVCcsXG4gICAgICAgICAgICBsYXN0RGF5IDogJ1tZZXN0ZXJkYXkgYXRdIExUJyxcbiAgICAgICAgICAgIGxhc3RXZWVrIDogJ1tMYXN0XSBkZGRkIFthdF0gTFQnLFxuICAgICAgICAgICAgc2FtZUVsc2UgOiAnTCdcbiAgICAgICAgfSxcbiAgICAgICAgY2FsZW5kYXIgOiBmdW5jdGlvbiAoa2V5LCBtb20pIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9jYWxlbmRhcltrZXldO1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBvdXRwdXQgPT09ICdmdW5jdGlvbicgPyBvdXRwdXQuYXBwbHkobW9tKSA6IG91dHB1dDtcbiAgICAgICAgfSxcblxuICAgICAgICBfcmVsYXRpdmVUaW1lIDoge1xuICAgICAgICAgICAgZnV0dXJlIDogJ2luICVzJyxcbiAgICAgICAgICAgIHBhc3QgOiAnJXMgYWdvJyxcbiAgICAgICAgICAgIHMgOiAnYSBmZXcgc2Vjb25kcycsXG4gICAgICAgICAgICBtIDogJ2EgbWludXRlJyxcbiAgICAgICAgICAgIG1tIDogJyVkIG1pbnV0ZXMnLFxuICAgICAgICAgICAgaCA6ICdhbiBob3VyJyxcbiAgICAgICAgICAgIGhoIDogJyVkIGhvdXJzJyxcbiAgICAgICAgICAgIGQgOiAnYSBkYXknLFxuICAgICAgICAgICAgZGQgOiAnJWQgZGF5cycsXG4gICAgICAgICAgICBNIDogJ2EgbW9udGgnLFxuICAgICAgICAgICAgTU0gOiAnJWQgbW9udGhzJyxcbiAgICAgICAgICAgIHkgOiAnYSB5ZWFyJyxcbiAgICAgICAgICAgIHl5IDogJyVkIHllYXJzJ1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlbGF0aXZlVGltZSA6IGZ1bmN0aW9uIChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLl9yZWxhdGl2ZVRpbWVbc3RyaW5nXTtcbiAgICAgICAgICAgIHJldHVybiAodHlwZW9mIG91dHB1dCA9PT0gJ2Z1bmN0aW9uJykgP1xuICAgICAgICAgICAgICAgIG91dHB1dChudW1iZXIsIHdpdGhvdXRTdWZmaXgsIHN0cmluZywgaXNGdXR1cmUpIDpcbiAgICAgICAgICAgICAgICBvdXRwdXQucmVwbGFjZSgvJWQvaSwgbnVtYmVyKTtcbiAgICAgICAgfSxcblxuICAgICAgICBwYXN0RnV0dXJlIDogZnVuY3Rpb24gKGRpZmYsIG91dHB1dCkge1xuICAgICAgICAgICAgdmFyIGZvcm1hdCA9IHRoaXMuX3JlbGF0aXZlVGltZVtkaWZmID4gMCA/ICdmdXR1cmUnIDogJ3Bhc3QnXTtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgZm9ybWF0ID09PSAnZnVuY3Rpb24nID8gZm9ybWF0KG91dHB1dCkgOiBmb3JtYXQucmVwbGFjZSgvJXMvaSwgb3V0cHV0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBvcmRpbmFsIDogZnVuY3Rpb24gKG51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29yZGluYWwucmVwbGFjZSgnJWQnLCBudW1iZXIpO1xuICAgICAgICB9LFxuICAgICAgICBfb3JkaW5hbCA6ICclZCcsXG5cbiAgICAgICAgcHJlcGFyc2UgOiBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyaW5nO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBvc3Rmb3JtYXQgOiBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyaW5nO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdlZWsgOiBmdW5jdGlvbiAobW9tKSB7XG4gICAgICAgICAgICByZXR1cm4gd2Vla09mWWVhcihtb20sIHRoaXMuX3dlZWsuZG93LCB0aGlzLl93ZWVrLmRveSkud2VlaztcbiAgICAgICAgfSxcblxuICAgICAgICBfd2VlayA6IHtcbiAgICAgICAgICAgIGRvdyA6IDAsIC8vIFN1bmRheSBpcyB0aGUgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrLlxuICAgICAgICAgICAgZG95IDogNiAgLy8gVGhlIHdlZWsgdGhhdCBjb250YWlucyBKYW4gMXN0IGlzIHRoZSBmaXJzdCB3ZWVrIG9mIHRoZSB5ZWFyLlxuICAgICAgICB9LFxuXG4gICAgICAgIF9pbnZhbGlkRGF0ZTogJ0ludmFsaWQgZGF0ZScsXG4gICAgICAgIGludmFsaWREYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW52YWxpZERhdGU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgRm9ybWF0dGluZ1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlRm9ybWF0dGluZ1Rva2VucyhpbnB1dCkge1xuICAgICAgICBpZiAoaW5wdXQubWF0Y2goL1xcW1tcXHNcXFNdLykpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9eXFxbfFxcXSQvZywgJycpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9cXFxcL2csICcnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlRm9ybWF0RnVuY3Rpb24oZm9ybWF0KSB7XG4gICAgICAgIHZhciBhcnJheSA9IGZvcm1hdC5tYXRjaChmb3JtYXR0aW5nVG9rZW5zKSwgaSwgbGVuZ3RoO1xuXG4gICAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZm9ybWF0VG9rZW5GdW5jdGlvbnNbYXJyYXlbaV1dKSB7XG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSBmb3JtYXRUb2tlbkZ1bmN0aW9uc1thcnJheVtpXV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFycmF5W2ldID0gcmVtb3ZlRm9ybWF0dGluZ1Rva2VucyhhcnJheVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG1vbSkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9ICcnO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0ICs9IGFycmF5W2ldIGluc3RhbmNlb2YgRnVuY3Rpb24gPyBhcnJheVtpXS5jYWxsKG1vbSwgZm9ybWF0KSA6IGFycmF5W2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBmb3JtYXQgZGF0ZSB1c2luZyBuYXRpdmUgZGF0ZSBvYmplY3RcbiAgICBmdW5jdGlvbiBmb3JtYXRNb21lbnQobSwgZm9ybWF0KSB7XG4gICAgICAgIGlmICghbS5pc1ZhbGlkKCkpIHtcbiAgICAgICAgICAgIHJldHVybiBtLmxvY2FsZURhdGEoKS5pbnZhbGlkRGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0ID0gZXhwYW5kRm9ybWF0KGZvcm1hdCwgbS5sb2NhbGVEYXRhKCkpO1xuXG4gICAgICAgIGlmICghZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0pIHtcbiAgICAgICAgICAgIGZvcm1hdEZ1bmN0aW9uc1tmb3JtYXRdID0gbWFrZUZvcm1hdEZ1bmN0aW9uKGZvcm1hdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9ybWF0RnVuY3Rpb25zW2Zvcm1hdF0obSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXhwYW5kRm9ybWF0KGZvcm1hdCwgbG9jYWxlKSB7XG4gICAgICAgIHZhciBpID0gNTtcblxuICAgICAgICBmdW5jdGlvbiByZXBsYWNlTG9uZ0RhdGVGb3JtYXRUb2tlbnMoaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBsb2NhbGUubG9uZ0RhdGVGb3JtYXQoaW5wdXQpIHx8IGlucHV0O1xuICAgICAgICB9XG5cbiAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIHdoaWxlIChpID49IDAgJiYgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLnRlc3QoZm9ybWF0KSkge1xuICAgICAgICAgICAgZm9ybWF0ID0gZm9ybWF0LnJlcGxhY2UobG9jYWxGb3JtYXR0aW5nVG9rZW5zLCByZXBsYWNlTG9uZ0RhdGVGb3JtYXRUb2tlbnMpO1xuICAgICAgICAgICAgbG9jYWxGb3JtYXR0aW5nVG9rZW5zLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICBpIC09IDE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9ybWF0O1xuICAgIH1cblxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBQYXJzaW5nXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICAvLyBnZXQgdGhlIHJlZ2V4IHRvIGZpbmQgdGhlIG5leHQgdG9rZW5cbiAgICBmdW5jdGlvbiBnZXRQYXJzZVJlZ2V4Rm9yVG9rZW4odG9rZW4sIGNvbmZpZykge1xuICAgICAgICB2YXIgYSwgc3RyaWN0ID0gY29uZmlnLl9zdHJpY3Q7XG4gICAgICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgICAgY2FzZSAnUSc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlbk9uZURpZ2l0O1xuICAgICAgICBjYXNlICdEREREJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuVGhyZWVEaWdpdHM7XG4gICAgICAgIGNhc2UgJ1lZWVknOlxuICAgICAgICBjYXNlICdHR0dHJzpcbiAgICAgICAgY2FzZSAnZ2dnZyc6XG4gICAgICAgICAgICByZXR1cm4gc3RyaWN0ID8gcGFyc2VUb2tlbkZvdXJEaWdpdHMgOiBwYXJzZVRva2VuT25lVG9Gb3VyRGlnaXRzO1xuICAgICAgICBjYXNlICdZJzpcbiAgICAgICAgY2FzZSAnRyc6XG4gICAgICAgIGNhc2UgJ2cnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5TaWduZWROdW1iZXI7XG4gICAgICAgIGNhc2UgJ1lZWVlZWSc6XG4gICAgICAgIGNhc2UgJ1lZWVlZJzpcbiAgICAgICAgY2FzZSAnR0dHR0cnOlxuICAgICAgICBjYXNlICdnZ2dnZyc6XG4gICAgICAgICAgICByZXR1cm4gc3RyaWN0ID8gcGFyc2VUb2tlblNpeERpZ2l0cyA6IHBhcnNlVG9rZW5PbmVUb1NpeERpZ2l0cztcbiAgICAgICAgY2FzZSAnUyc6XG4gICAgICAgICAgICBpZiAoc3RyaWN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5PbmVEaWdpdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnU1MnOlxuICAgICAgICAgICAgaWYgKHN0cmljdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuVHdvRGlnaXRzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICBjYXNlICdTU1MnOlxuICAgICAgICAgICAgaWYgKHN0cmljdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuVGhyZWVEaWdpdHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgIGNhc2UgJ0RERCc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlbk9uZVRvVGhyZWVEaWdpdHM7XG4gICAgICAgIGNhc2UgJ01NTSc6XG4gICAgICAgIGNhc2UgJ01NTU0nOlxuICAgICAgICBjYXNlICdkZCc6XG4gICAgICAgIGNhc2UgJ2RkZCc6XG4gICAgICAgIGNhc2UgJ2RkZGQnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5Xb3JkO1xuICAgICAgICBjYXNlICdhJzpcbiAgICAgICAgY2FzZSAnQSc6XG4gICAgICAgICAgICByZXR1cm4gY29uZmlnLl9sb2NhbGUuX21lcmlkaWVtUGFyc2U7XG4gICAgICAgIGNhc2UgJ1gnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5UaW1lc3RhbXBNcztcbiAgICAgICAgY2FzZSAnWic6XG4gICAgICAgIGNhc2UgJ1paJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuVGltZXpvbmU7XG4gICAgICAgIGNhc2UgJ1QnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlVG9rZW5UO1xuICAgICAgICBjYXNlICdTU1NTJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJzZVRva2VuRGlnaXRzO1xuICAgICAgICBjYXNlICdNTSc6XG4gICAgICAgIGNhc2UgJ0REJzpcbiAgICAgICAgY2FzZSAnWVknOlxuICAgICAgICBjYXNlICdHRyc6XG4gICAgICAgIGNhc2UgJ2dnJzpcbiAgICAgICAgY2FzZSAnSEgnOlxuICAgICAgICBjYXNlICdoaCc6XG4gICAgICAgIGNhc2UgJ21tJzpcbiAgICAgICAgY2FzZSAnc3MnOlxuICAgICAgICBjYXNlICd3dyc6XG4gICAgICAgIGNhc2UgJ1dXJzpcbiAgICAgICAgICAgIHJldHVybiBzdHJpY3QgPyBwYXJzZVRva2VuVHdvRGlnaXRzIDogcGFyc2VUb2tlbk9uZU9yVHdvRGlnaXRzO1xuICAgICAgICBjYXNlICdNJzpcbiAgICAgICAgY2FzZSAnRCc6XG4gICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICBjYXNlICdIJzpcbiAgICAgICAgY2FzZSAnaCc6XG4gICAgICAgIGNhc2UgJ20nOlxuICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgY2FzZSAndyc6XG4gICAgICAgIGNhc2UgJ1cnOlxuICAgICAgICBjYXNlICdlJzpcbiAgICAgICAgY2FzZSAnRSc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlbk9uZU9yVHdvRGlnaXRzO1xuICAgICAgICBjYXNlICdEbyc6XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VUb2tlbk9yZGluYWw7XG4gICAgICAgIGRlZmF1bHQgOlxuICAgICAgICAgICAgYSA9IG5ldyBSZWdFeHAocmVnZXhwRXNjYXBlKHVuZXNjYXBlRm9ybWF0KHRva2VuLnJlcGxhY2UoJ1xcXFwnLCAnJykpLCAnaScpKTtcbiAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGltZXpvbmVNaW51dGVzRnJvbVN0cmluZyhzdHJpbmcpIHtcbiAgICAgICAgc3RyaW5nID0gc3RyaW5nIHx8ICcnO1xuICAgICAgICB2YXIgcG9zc2libGVUek1hdGNoZXMgPSAoc3RyaW5nLm1hdGNoKHBhcnNlVG9rZW5UaW1lem9uZSkgfHwgW10pLFxuICAgICAgICAgICAgdHpDaHVuayA9IHBvc3NpYmxlVHpNYXRjaGVzW3Bvc3NpYmxlVHpNYXRjaGVzLmxlbmd0aCAtIDFdIHx8IFtdLFxuICAgICAgICAgICAgcGFydHMgPSAodHpDaHVuayArICcnKS5tYXRjaChwYXJzZVRpbWV6b25lQ2h1bmtlcikgfHwgWyctJywgMCwgMF0sXG4gICAgICAgICAgICBtaW51dGVzID0gKyhwYXJ0c1sxXSAqIDYwKSArIHRvSW50KHBhcnRzWzJdKTtcblxuICAgICAgICByZXR1cm4gcGFydHNbMF0gPT09ICcrJyA/IC1taW51dGVzIDogbWludXRlcztcbiAgICB9XG5cbiAgICAvLyBmdW5jdGlvbiB0byBjb252ZXJ0IHN0cmluZyBpbnB1dCB0byBkYXRlXG4gICAgZnVuY3Rpb24gYWRkVGltZVRvQXJyYXlGcm9tVG9rZW4odG9rZW4sIGlucHV0LCBjb25maWcpIHtcbiAgICAgICAgdmFyIGEsIGRhdGVQYXJ0QXJyYXkgPSBjb25maWcuX2E7XG5cbiAgICAgICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgICAvLyBRVUFSVEVSXG4gICAgICAgIGNhc2UgJ1EnOlxuICAgICAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkYXRlUGFydEFycmF5W01PTlRIXSA9ICh0b0ludChpbnB1dCkgLSAxKSAqIDM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gTU9OVEhcbiAgICAgICAgY2FzZSAnTScgOiAvLyBmYWxsIHRocm91Z2ggdG8gTU1cbiAgICAgICAgY2FzZSAnTU0nIDpcbiAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtNT05USF0gPSB0b0ludChpbnB1dCkgLSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ01NTScgOiAvLyBmYWxsIHRocm91Z2ggdG8gTU1NTVxuICAgICAgICBjYXNlICdNTU1NJyA6XG4gICAgICAgICAgICBhID0gY29uZmlnLl9sb2NhbGUubW9udGhzUGFyc2UoaW5wdXQpO1xuICAgICAgICAgICAgLy8gaWYgd2UgZGlkbid0IGZpbmQgYSBtb250aCBuYW1lLCBtYXJrIHRoZSBkYXRlIGFzIGludmFsaWQuXG4gICAgICAgICAgICBpZiAoYSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtNT05USF0gPSBhO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX3BmLmludmFsaWRNb250aCA9IGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIERBWSBPRiBNT05USFxuICAgICAgICBjYXNlICdEJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBERFxuICAgICAgICBjYXNlICdERCcgOlxuICAgICAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkYXRlUGFydEFycmF5W0RBVEVdID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0RvJyA6XG4gICAgICAgICAgICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbREFURV0gPSB0b0ludChwYXJzZUludChpbnB1dCwgMTApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBEQVkgT0YgWUVBUlxuICAgICAgICBjYXNlICdEREQnIDogLy8gZmFsbCB0aHJvdWdoIHRvIERERERcbiAgICAgICAgY2FzZSAnRERERCcgOlxuICAgICAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX2RheU9mWWVhciA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIFlFQVJcbiAgICAgICAgY2FzZSAnWVknIDpcbiAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbWUVBUl0gPSBtb21lbnQucGFyc2VUd29EaWdpdFllYXIoaW5wdXQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ1lZWVknIDpcbiAgICAgICAgY2FzZSAnWVlZWVknIDpcbiAgICAgICAgY2FzZSAnWVlZWVlZJyA6XG4gICAgICAgICAgICBkYXRlUGFydEFycmF5W1lFQVJdID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIEFNIC8gUE1cbiAgICAgICAgY2FzZSAnYScgOiAvLyBmYWxsIHRocm91Z2ggdG8gQVxuICAgICAgICBjYXNlICdBJyA6XG4gICAgICAgICAgICBjb25maWcuX2lzUG0gPSBjb25maWcuX2xvY2FsZS5pc1BNKGlucHV0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyAyNCBIT1VSXG4gICAgICAgIGNhc2UgJ0gnIDogLy8gZmFsbCB0aHJvdWdoIHRvIGhoXG4gICAgICAgIGNhc2UgJ0hIJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBoaFxuICAgICAgICBjYXNlICdoJyA6IC8vIGZhbGwgdGhyb3VnaCB0byBoaFxuICAgICAgICBjYXNlICdoaCcgOlxuICAgICAgICAgICAgZGF0ZVBhcnRBcnJheVtIT1VSXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBNSU5VVEVcbiAgICAgICAgY2FzZSAnbScgOiAvLyBmYWxsIHRocm91Z2ggdG8gbW1cbiAgICAgICAgY2FzZSAnbW0nIDpcbiAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbTUlOVVRFXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBTRUNPTkRcbiAgICAgICAgY2FzZSAncycgOiAvLyBmYWxsIHRocm91Z2ggdG8gc3NcbiAgICAgICAgY2FzZSAnc3MnIDpcbiAgICAgICAgICAgIGRhdGVQYXJ0QXJyYXlbU0VDT05EXSA9IHRvSW50KGlucHV0KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvLyBNSUxMSVNFQ09ORFxuICAgICAgICBjYXNlICdTJyA6XG4gICAgICAgIGNhc2UgJ1NTJyA6XG4gICAgICAgIGNhc2UgJ1NTUycgOlxuICAgICAgICBjYXNlICdTU1NTJyA6XG4gICAgICAgICAgICBkYXRlUGFydEFycmF5W01JTExJU0VDT05EXSA9IHRvSW50KCgnMC4nICsgaW5wdXQpICogMTAwMCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gVU5JWCBUSU1FU1RBTVAgV0lUSCBNU1xuICAgICAgICBjYXNlICdYJzpcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKHBhcnNlRmxvYXQoaW5wdXQpICogMTAwMCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gVElNRVpPTkVcbiAgICAgICAgY2FzZSAnWicgOiAvLyBmYWxsIHRocm91Z2ggdG8gWlpcbiAgICAgICAgY2FzZSAnWlonIDpcbiAgICAgICAgICAgIGNvbmZpZy5fdXNlVVRDID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbmZpZy5fdHptID0gdGltZXpvbmVNaW51dGVzRnJvbVN0cmluZyhpbnB1dCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gV0VFS0RBWSAtIGh1bWFuXG4gICAgICAgIGNhc2UgJ2RkJzpcbiAgICAgICAgY2FzZSAnZGRkJzpcbiAgICAgICAgY2FzZSAnZGRkZCc6XG4gICAgICAgICAgICBhID0gY29uZmlnLl9sb2NhbGUud2Vla2RheXNQYXJzZShpbnB1dCk7XG4gICAgICAgICAgICAvLyBpZiB3ZSBkaWRuJ3QgZ2V0IGEgd2Vla2RheSBuYW1lLCBtYXJrIHRoZSBkYXRlIGFzIGludmFsaWRcbiAgICAgICAgICAgIGlmIChhICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX3cgPSBjb25maWcuX3cgfHwge307XG4gICAgICAgICAgICAgICAgY29uZmlnLl93WydkJ10gPSBhO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25maWcuX3BmLmludmFsaWRXZWVrZGF5ID0gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gV0VFSywgV0VFSyBEQVkgLSBudW1lcmljXG4gICAgICAgIGNhc2UgJ3cnOlxuICAgICAgICBjYXNlICd3dyc6XG4gICAgICAgIGNhc2UgJ1cnOlxuICAgICAgICBjYXNlICdXVyc6XG4gICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICBjYXNlICdlJzpcbiAgICAgICAgY2FzZSAnRSc6XG4gICAgICAgICAgICB0b2tlbiA9IHRva2VuLnN1YnN0cigwLCAxKTtcbiAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgY2FzZSAnZ2dnZyc6XG4gICAgICAgIGNhc2UgJ0dHR0cnOlxuICAgICAgICBjYXNlICdHR0dHRyc6XG4gICAgICAgICAgICB0b2tlbiA9IHRva2VuLnN1YnN0cigwLCAyKTtcbiAgICAgICAgICAgIGlmIChpbnB1dCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fdyA9IGNvbmZpZy5fdyB8fCB7fTtcbiAgICAgICAgICAgICAgICBjb25maWcuX3dbdG9rZW5dID0gdG9JbnQoaW5wdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2dnJzpcbiAgICAgICAgY2FzZSAnR0cnOlxuICAgICAgICAgICAgY29uZmlnLl93ID0gY29uZmlnLl93IHx8IHt9O1xuICAgICAgICAgICAgY29uZmlnLl93W3Rva2VuXSA9IG1vbWVudC5wYXJzZVR3b0RpZ2l0WWVhcihpbnB1dCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla0luZm8oY29uZmlnKSB7XG4gICAgICAgIHZhciB3LCB3ZWVrWWVhciwgd2Vlaywgd2Vla2RheSwgZG93LCBkb3ksIHRlbXA7XG5cbiAgICAgICAgdyA9IGNvbmZpZy5fdztcbiAgICAgICAgaWYgKHcuR0cgIT0gbnVsbCB8fCB3LlcgIT0gbnVsbCB8fCB3LkUgIT0gbnVsbCkge1xuICAgICAgICAgICAgZG93ID0gMTtcbiAgICAgICAgICAgIGRveSA9IDQ7XG5cbiAgICAgICAgICAgIC8vIFRPRE86IFdlIG5lZWQgdG8gdGFrZSB0aGUgY3VycmVudCBpc29XZWVrWWVhciwgYnV0IHRoYXQgZGVwZW5kcyBvblxuICAgICAgICAgICAgLy8gaG93IHdlIGludGVycHJldCBub3cgKGxvY2FsLCB1dGMsIGZpeGVkIG9mZnNldCkuIFNvIGNyZWF0ZVxuICAgICAgICAgICAgLy8gYSBub3cgdmVyc2lvbiBvZiBjdXJyZW50IGNvbmZpZyAodGFrZSBsb2NhbC91dGMvb2Zmc2V0IGZsYWdzLCBhbmRcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBub3cpLlxuICAgICAgICAgICAgd2Vla1llYXIgPSBkZmwody5HRywgY29uZmlnLl9hW1lFQVJdLCB3ZWVrT2ZZZWFyKG1vbWVudCgpLCAxLCA0KS55ZWFyKTtcbiAgICAgICAgICAgIHdlZWsgPSBkZmwody5XLCAxKTtcbiAgICAgICAgICAgIHdlZWtkYXkgPSBkZmwody5FLCAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvdyA9IGNvbmZpZy5fbG9jYWxlLl93ZWVrLmRvdztcbiAgICAgICAgICAgIGRveSA9IGNvbmZpZy5fbG9jYWxlLl93ZWVrLmRveTtcblxuICAgICAgICAgICAgd2Vla1llYXIgPSBkZmwody5nZywgY29uZmlnLl9hW1lFQVJdLCB3ZWVrT2ZZZWFyKG1vbWVudCgpLCBkb3csIGRveSkueWVhcik7XG4gICAgICAgICAgICB3ZWVrID0gZGZsKHcudywgMSk7XG5cbiAgICAgICAgICAgIGlmICh3LmQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIHdlZWtkYXkgLS0gbG93IGRheSBudW1iZXJzIGFyZSBjb25zaWRlcmVkIG5leHQgd2Vla1xuICAgICAgICAgICAgICAgIHdlZWtkYXkgPSB3LmQ7XG4gICAgICAgICAgICAgICAgaWYgKHdlZWtkYXkgPCBkb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgKyt3ZWVrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAody5lICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBsb2NhbCB3ZWVrZGF5IC0tIGNvdW50aW5nIHN0YXJ0cyBmcm9tIGJlZ2luaW5nIG9mIHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gdy5lICsgZG93O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBkZWZhdWx0IHRvIGJlZ2luaW5nIG9mIHdlZWtcbiAgICAgICAgICAgICAgICB3ZWVrZGF5ID0gZG93O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRlbXAgPSBkYXlPZlllYXJGcm9tV2Vla3Mod2Vla1llYXIsIHdlZWssIHdlZWtkYXksIGRveSwgZG93KTtcblxuICAgICAgICBjb25maWcuX2FbWUVBUl0gPSB0ZW1wLnllYXI7XG4gICAgICAgIGNvbmZpZy5fZGF5T2ZZZWFyID0gdGVtcC5kYXlPZlllYXI7XG4gICAgfVxuXG4gICAgLy8gY29udmVydCBhbiBhcnJheSB0byBhIGRhdGUuXG4gICAgLy8gdGhlIGFycmF5IHNob3VsZCBtaXJyb3IgdGhlIHBhcmFtZXRlcnMgYmVsb3dcbiAgICAvLyBub3RlOiBhbGwgdmFsdWVzIHBhc3QgdGhlIHllYXIgYXJlIG9wdGlvbmFsIGFuZCB3aWxsIGRlZmF1bHQgdG8gdGhlIGxvd2VzdCBwb3NzaWJsZSB2YWx1ZS5cbiAgICAvLyBbeWVhciwgbW9udGgsIGRheSAsIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCBtaWxsaXNlY29uZF1cbiAgICBmdW5jdGlvbiBkYXRlRnJvbUNvbmZpZyhjb25maWcpIHtcbiAgICAgICAgdmFyIGksIGRhdGUsIGlucHV0ID0gW10sIGN1cnJlbnREYXRlLCB5ZWFyVG9Vc2U7XG5cbiAgICAgICAgaWYgKGNvbmZpZy5fZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudERhdGUgPSBjdXJyZW50RGF0ZUFycmF5KGNvbmZpZyk7XG5cbiAgICAgICAgLy9jb21wdXRlIGRheSBvZiB0aGUgeWVhciBmcm9tIHdlZWtzIGFuZCB3ZWVrZGF5c1xuICAgICAgICBpZiAoY29uZmlnLl93ICYmIGNvbmZpZy5fYVtEQVRFXSA9PSBudWxsICYmIGNvbmZpZy5fYVtNT05USF0gPT0gbnVsbCkge1xuICAgICAgICAgICAgZGF5T2ZZZWFyRnJvbVdlZWtJbmZvKGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2lmIHRoZSBkYXkgb2YgdGhlIHllYXIgaXMgc2V0LCBmaWd1cmUgb3V0IHdoYXQgaXQgaXNcbiAgICAgICAgaWYgKGNvbmZpZy5fZGF5T2ZZZWFyKSB7XG4gICAgICAgICAgICB5ZWFyVG9Vc2UgPSBkZmwoY29uZmlnLl9hW1lFQVJdLCBjdXJyZW50RGF0ZVtZRUFSXSk7XG5cbiAgICAgICAgICAgIGlmIChjb25maWcuX2RheU9mWWVhciA+IGRheXNJblllYXIoeWVhclRvVXNlKSkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fcGYuX292ZXJmbG93RGF5T2ZZZWFyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGF0ZSA9IG1ha2VVVENEYXRlKHllYXJUb1VzZSwgMCwgY29uZmlnLl9kYXlPZlllYXIpO1xuICAgICAgICAgICAgY29uZmlnLl9hW01PTlRIXSA9IGRhdGUuZ2V0VVRDTW9udGgoKTtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtEQVRFXSA9IGRhdGUuZ2V0VVRDRGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGVmYXVsdCB0byBjdXJyZW50IGRhdGUuXG4gICAgICAgIC8vICogaWYgbm8geWVhciwgbW9udGgsIGRheSBvZiBtb250aCBhcmUgZ2l2ZW4sIGRlZmF1bHQgdG8gdG9kYXlcbiAgICAgICAgLy8gKiBpZiBkYXkgb2YgbW9udGggaXMgZ2l2ZW4sIGRlZmF1bHQgbW9udGggYW5kIHllYXJcbiAgICAgICAgLy8gKiBpZiBtb250aCBpcyBnaXZlbiwgZGVmYXVsdCBvbmx5IHllYXJcbiAgICAgICAgLy8gKiBpZiB5ZWFyIGlzIGdpdmVuLCBkb24ndCBkZWZhdWx0IGFueXRoaW5nXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAzICYmIGNvbmZpZy5fYVtpXSA9PSBudWxsOyArK2kpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtpXSA9IGlucHV0W2ldID0gY3VycmVudERhdGVbaV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBaZXJvIG91dCB3aGF0ZXZlciB3YXMgbm90IGRlZmF1bHRlZCwgaW5jbHVkaW5nIHRpbWVcbiAgICAgICAgZm9yICg7IGkgPCA3OyBpKyspIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtpXSA9IGlucHV0W2ldID0gKGNvbmZpZy5fYVtpXSA9PSBudWxsKSA/IChpID09PSAyID8gMSA6IDApIDogY29uZmlnLl9hW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uZmlnLl9kID0gKGNvbmZpZy5fdXNlVVRDID8gbWFrZVVUQ0RhdGUgOiBtYWtlRGF0ZSkuYXBwbHkobnVsbCwgaW5wdXQpO1xuICAgICAgICAvLyBBcHBseSB0aW1lem9uZSBvZmZzZXQgZnJvbSBpbnB1dC4gVGhlIGFjdHVhbCB6b25lIGNhbiBiZSBjaGFuZ2VkXG4gICAgICAgIC8vIHdpdGggcGFyc2Vab25lLlxuICAgICAgICBpZiAoY29uZmlnLl90em0gIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uZmlnLl9kLnNldFVUQ01pbnV0ZXMoY29uZmlnLl9kLmdldFVUQ01pbnV0ZXMoKSArIGNvbmZpZy5fdHptKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRhdGVGcm9tT2JqZWN0KGNvbmZpZykge1xuICAgICAgICB2YXIgbm9ybWFsaXplZElucHV0O1xuXG4gICAgICAgIGlmIChjb25maWcuX2QpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vcm1hbGl6ZWRJbnB1dCA9IG5vcm1hbGl6ZU9iamVjdFVuaXRzKGNvbmZpZy5faSk7XG4gICAgICAgIGNvbmZpZy5fYSA9IFtcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dC55ZWFyLFxuICAgICAgICAgICAgbm9ybWFsaXplZElucHV0Lm1vbnRoLFxuICAgICAgICAgICAgbm9ybWFsaXplZElucHV0LmRheSxcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dC5ob3VyLFxuICAgICAgICAgICAgbm9ybWFsaXplZElucHV0Lm1pbnV0ZSxcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRJbnB1dC5zZWNvbmQsXG4gICAgICAgICAgICBub3JtYWxpemVkSW5wdXQubWlsbGlzZWNvbmRcbiAgICAgICAgXTtcblxuICAgICAgICBkYXRlRnJvbUNvbmZpZyhjb25maWcpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGN1cnJlbnREYXRlQXJyYXkoY29uZmlnKSB7XG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBpZiAoY29uZmlnLl91c2VVVEMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgbm93LmdldFVUQ0Z1bGxZZWFyKCksXG4gICAgICAgICAgICAgICAgbm93LmdldFVUQ01vbnRoKCksXG4gICAgICAgICAgICAgICAgbm93LmdldFVUQ0RhdGUoKVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbbm93LmdldEZ1bGxZZWFyKCksIG5vdy5nZXRNb250aCgpLCBub3cuZ2V0RGF0ZSgpXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSBzdHJpbmcgYW5kIGZvcm1hdCBzdHJpbmdcbiAgICBmdW5jdGlvbiBtYWtlRGF0ZUZyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKSB7XG4gICAgICAgIGlmIChjb25maWcuX2YgPT09IG1vbWVudC5JU09fODYwMSkge1xuICAgICAgICAgICAgcGFyc2VJU08oY29uZmlnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbmZpZy5fYSA9IFtdO1xuICAgICAgICBjb25maWcuX3BmLmVtcHR5ID0gdHJ1ZTtcblxuICAgICAgICAvLyBUaGlzIGFycmF5IGlzIHVzZWQgdG8gbWFrZSBhIERhdGUsIGVpdGhlciB3aXRoIGBuZXcgRGF0ZWAgb3IgYERhdGUuVVRDYFxuICAgICAgICB2YXIgc3RyaW5nID0gJycgKyBjb25maWcuX2ksXG4gICAgICAgICAgICBpLCBwYXJzZWRJbnB1dCwgdG9rZW5zLCB0b2tlbiwgc2tpcHBlZCxcbiAgICAgICAgICAgIHN0cmluZ0xlbmd0aCA9IHN0cmluZy5sZW5ndGgsXG4gICAgICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoID0gMDtcblxuICAgICAgICB0b2tlbnMgPSBleHBhbmRGb3JtYXQoY29uZmlnLl9mLCBjb25maWcuX2xvY2FsZSkubWF0Y2goZm9ybWF0dGluZ1Rva2VucykgfHwgW107XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgICAgICBwYXJzZWRJbnB1dCA9IChzdHJpbmcubWF0Y2goZ2V0UGFyc2VSZWdleEZvclRva2VuKHRva2VuLCBjb25maWcpKSB8fCBbXSlbMF07XG4gICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICBza2lwcGVkID0gc3RyaW5nLnN1YnN0cigwLCBzdHJpbmcuaW5kZXhPZihwYXJzZWRJbnB1dCkpO1xuICAgICAgICAgICAgICAgIGlmIChza2lwcGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9wZi51bnVzZWRJbnB1dC5wdXNoKHNraXBwZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc2xpY2Uoc3RyaW5nLmluZGV4T2YocGFyc2VkSW5wdXQpICsgcGFyc2VkSW5wdXQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b3RhbFBhcnNlZElucHV0TGVuZ3RoICs9IHBhcnNlZElucHV0Lmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGRvbid0IHBhcnNlIGlmIGl0J3Mgbm90IGEga25vd24gdG9rZW5cbiAgICAgICAgICAgIGlmIChmb3JtYXRUb2tlbkZ1bmN0aW9uc1t0b2tlbl0pIHtcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VkSW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9wZi5lbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9wZi51bnVzZWRUb2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFkZFRpbWVUb0FycmF5RnJvbVRva2VuKHRva2VuLCBwYXJzZWRJbnB1dCwgY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbmZpZy5fc3RyaWN0ICYmICFwYXJzZWRJbnB1dCkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fcGYudW51c2VkVG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYWRkIHJlbWFpbmluZyB1bnBhcnNlZCBpbnB1dCBsZW5ndGggdG8gdGhlIHN0cmluZ1xuICAgICAgICBjb25maWcuX3BmLmNoYXJzTGVmdE92ZXIgPSBzdHJpbmdMZW5ndGggLSB0b3RhbFBhcnNlZElucHV0TGVuZ3RoO1xuICAgICAgICBpZiAoc3RyaW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbmZpZy5fcGYudW51c2VkSW5wdXQucHVzaChzdHJpbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGFuZGxlIGFtIHBtXG4gICAgICAgIGlmIChjb25maWcuX2lzUG0gJiYgY29uZmlnLl9hW0hPVVJdIDwgMTIpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fYVtIT1VSXSArPSAxMjtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiBpcyAxMiBhbSwgY2hhbmdlIGhvdXJzIHRvIDBcbiAgICAgICAgaWYgKGNvbmZpZy5faXNQbSA9PT0gZmFsc2UgJiYgY29uZmlnLl9hW0hPVVJdID09PSAxMikge1xuICAgICAgICAgICAgY29uZmlnLl9hW0hPVVJdID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGVGcm9tQ29uZmlnKGNvbmZpZyk7XG4gICAgICAgIGNoZWNrT3ZlcmZsb3coY29uZmlnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1bmVzY2FwZUZvcm1hdChzKSB7XG4gICAgICAgIHJldHVybiBzLnJlcGxhY2UoL1xcXFwoXFxbKXxcXFxcKFxcXSl8XFxbKFteXFxdXFxbXSopXFxdfFxcXFwoLikvZywgZnVuY3Rpb24gKG1hdGNoZWQsIHAxLCBwMiwgcDMsIHA0KSB7XG4gICAgICAgICAgICByZXR1cm4gcDEgfHwgcDIgfHwgcDMgfHwgcDQ7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIENvZGUgZnJvbSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzM1NjE0OTMvaXMtdGhlcmUtYS1yZWdleHAtZXNjYXBlLWZ1bmN0aW9uLWluLWphdmFzY3JpcHRcbiAgICBmdW5jdGlvbiByZWdleHBFc2NhcGUocykge1xuICAgICAgICByZXR1cm4gcy5yZXBsYWNlKC9bLVxcL1xcXFxeJCorPy4oKXxbXFxde31dL2csICdcXFxcJCYnKTtcbiAgICB9XG5cbiAgICAvLyBkYXRlIGZyb20gc3RyaW5nIGFuZCBhcnJheSBvZiBmb3JtYXQgc3RyaW5nc1xuICAgIGZ1bmN0aW9uIG1ha2VEYXRlRnJvbVN0cmluZ0FuZEFycmF5KGNvbmZpZykge1xuICAgICAgICB2YXIgdGVtcENvbmZpZyxcbiAgICAgICAgICAgIGJlc3RNb21lbnQsXG5cbiAgICAgICAgICAgIHNjb3JlVG9CZWF0LFxuICAgICAgICAgICAgaSxcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZTtcblxuICAgICAgICBpZiAoY29uZmlnLl9mLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29uZmlnLl9wZi5pbnZhbGlkRm9ybWF0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKE5hTik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29uZmlnLl9mLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjdXJyZW50U2NvcmUgPSAwO1xuICAgICAgICAgICAgdGVtcENvbmZpZyA9IGNvcHlDb25maWcoe30sIGNvbmZpZyk7XG4gICAgICAgICAgICBpZiAoY29uZmlnLl91c2VVVEMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRlbXBDb25maWcuX3VzZVVUQyA9IGNvbmZpZy5fdXNlVVRDO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGVtcENvbmZpZy5fcGYgPSBkZWZhdWx0UGFyc2luZ0ZsYWdzKCk7XG4gICAgICAgICAgICB0ZW1wQ29uZmlnLl9mID0gY29uZmlnLl9mW2ldO1xuICAgICAgICAgICAgbWFrZURhdGVGcm9tU3RyaW5nQW5kRm9ybWF0KHRlbXBDb25maWcpO1xuXG4gICAgICAgICAgICBpZiAoIWlzVmFsaWQodGVtcENvbmZpZykpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYW55IGlucHV0IHRoYXQgd2FzIG5vdCBwYXJzZWQgYWRkIGEgcGVuYWx0eSBmb3IgdGhhdCBmb3JtYXRcbiAgICAgICAgICAgIGN1cnJlbnRTY29yZSArPSB0ZW1wQ29uZmlnLl9wZi5jaGFyc0xlZnRPdmVyO1xuXG4gICAgICAgICAgICAvL29yIHRva2Vuc1xuICAgICAgICAgICAgY3VycmVudFNjb3JlICs9IHRlbXBDb25maWcuX3BmLnVudXNlZFRva2Vucy5sZW5ndGggKiAxMDtcblxuICAgICAgICAgICAgdGVtcENvbmZpZy5fcGYuc2NvcmUgPSBjdXJyZW50U2NvcmU7XG5cbiAgICAgICAgICAgIGlmIChzY29yZVRvQmVhdCA9PSBudWxsIHx8IGN1cnJlbnRTY29yZSA8IHNjb3JlVG9CZWF0KSB7XG4gICAgICAgICAgICAgICAgc2NvcmVUb0JlYXQgPSBjdXJyZW50U2NvcmU7XG4gICAgICAgICAgICAgICAgYmVzdE1vbWVudCA9IHRlbXBDb25maWc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBleHRlbmQoY29uZmlnLCBiZXN0TW9tZW50IHx8IHRlbXBDb25maWcpO1xuICAgIH1cblxuICAgIC8vIGRhdGUgZnJvbSBpc28gZm9ybWF0XG4gICAgZnVuY3Rpb24gcGFyc2VJU08oY29uZmlnKSB7XG4gICAgICAgIHZhciBpLCBsLFxuICAgICAgICAgICAgc3RyaW5nID0gY29uZmlnLl9pLFxuICAgICAgICAgICAgbWF0Y2ggPSBpc29SZWdleC5leGVjKHN0cmluZyk7XG5cbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICBjb25maWcuX3BmLmlzbyA9IHRydWU7XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsID0gaXNvRGF0ZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzb0RhdGVzW2ldWzFdLmV4ZWMoc3RyaW5nKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBtYXRjaFs1XSBzaG91bGQgYmUgJ1QnIG9yIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICBjb25maWcuX2YgPSBpc29EYXRlc1tpXVswXSArIChtYXRjaFs2XSB8fCAnICcpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBsID0gaXNvVGltZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzb1RpbWVzW2ldWzFdLmV4ZWMoc3RyaW5nKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25maWcuX2YgKz0gaXNvVGltZXNbaV1bMF07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdHJpbmcubWF0Y2gocGFyc2VUb2tlblRpbWV6b25lKSkge1xuICAgICAgICAgICAgICAgIGNvbmZpZy5fZiArPSAnWic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYWtlRGF0ZUZyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbmZpZy5faXNWYWxpZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGF0ZSBmcm9tIGlzbyBmb3JtYXQgb3IgZmFsbGJhY2tcbiAgICBmdW5jdGlvbiBtYWtlRGF0ZUZyb21TdHJpbmcoY29uZmlnKSB7XG4gICAgICAgIHBhcnNlSVNPKGNvbmZpZyk7XG4gICAgICAgIGlmIChjb25maWcuX2lzVmFsaWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBkZWxldGUgY29uZmlnLl9pc1ZhbGlkO1xuICAgICAgICAgICAgbW9tZW50LmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrKGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYXAoYXJyLCBmbikge1xuICAgICAgICB2YXIgcmVzID0gW10sIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKGZuKGFycltpXSwgaSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZURhdGVGcm9tSW5wdXQoY29uZmlnKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IGNvbmZpZy5faSwgbWF0Y2hlZDtcbiAgICAgICAgaWYgKGlucHV0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNEYXRlKGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoK2lucHV0KTtcbiAgICAgICAgfSBlbHNlIGlmICgobWF0Y2hlZCA9IGFzcE5ldEpzb25SZWdleC5leGVjKGlucHV0KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbmZpZy5fZCA9IG5ldyBEYXRlKCttYXRjaGVkWzFdKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBtYWtlRGF0ZUZyb21TdHJpbmcoY29uZmlnKTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KGlucHV0KSkge1xuICAgICAgICAgICAgY29uZmlnLl9hID0gbWFwKGlucHV0LnNsaWNlKDApLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KG9iaiwgMTApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkYXRlRnJvbUNvbmZpZyhjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZihpbnB1dCkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBkYXRlRnJvbU9iamVjdChjb25maWcpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZihpbnB1dCkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAvLyBmcm9tIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgY29uZmlnLl9kID0gbmV3IERhdGUoaW5wdXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbW9tZW50LmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrKGNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlRGF0ZSh5LCBtLCBkLCBoLCBNLCBzLCBtcykge1xuICAgICAgICAvL2Nhbid0IGp1c3QgYXBwbHkoKSB0byBjcmVhdGUgYSBkYXRlOlxuICAgICAgICAvL2h0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTgxMzQ4L2luc3RhbnRpYXRpbmctYS1qYXZhc2NyaXB0LW9iamVjdC1ieS1jYWxsaW5nLXByb3RvdHlwZS1jb25zdHJ1Y3Rvci1hcHBseVxuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKHksIG0sIGQsIGgsIE0sIHMsIG1zKTtcblxuICAgICAgICAvL3RoZSBkYXRlIGNvbnN0cnVjdG9yIGRvZXNuJ3QgYWNjZXB0IHllYXJzIDwgMTk3MFxuICAgICAgICBpZiAoeSA8IDE5NzApIHtcbiAgICAgICAgICAgIGRhdGUuc2V0RnVsbFllYXIoeSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZVVUQ0RhdGUoeSkge1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKERhdGUuVVRDLmFwcGx5KG51bGwsIGFyZ3VtZW50cykpO1xuICAgICAgICBpZiAoeSA8IDE5NzApIHtcbiAgICAgICAgICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoeSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VXZWVrZGF5KGlucHV0LCBsb2NhbGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmICghaXNOYU4oaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBwYXJzZUludChpbnB1dCwgMTApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBsb2NhbGUud2Vla2RheXNQYXJzZShpbnB1dCk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIFJlbGF0aXZlIFRpbWVcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIC8vIGhlbHBlciBmdW5jdGlvbiBmb3IgbW9tZW50LmZuLmZyb20sIG1vbWVudC5mbi5mcm9tTm93LCBhbmQgbW9tZW50LmR1cmF0aW9uLmZuLmh1bWFuaXplXG4gICAgZnVuY3Rpb24gc3Vic3RpdHV0ZVRpbWVBZ28oc3RyaW5nLCBudW1iZXIsIHdpdGhvdXRTdWZmaXgsIGlzRnV0dXJlLCBsb2NhbGUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsZS5yZWxhdGl2ZVRpbWUobnVtYmVyIHx8IDEsICEhd2l0aG91dFN1ZmZpeCwgc3RyaW5nLCBpc0Z1dHVyZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVsYXRpdmVUaW1lKHBvc05lZ0R1cmF0aW9uLCB3aXRob3V0U3VmZml4LCBsb2NhbGUpIHtcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gbW9tZW50LmR1cmF0aW9uKHBvc05lZ0R1cmF0aW9uKS5hYnMoKSxcbiAgICAgICAgICAgIHNlY29uZHMgPSByb3VuZChkdXJhdGlvbi5hcygncycpKSxcbiAgICAgICAgICAgIG1pbnV0ZXMgPSByb3VuZChkdXJhdGlvbi5hcygnbScpKSxcbiAgICAgICAgICAgIGhvdXJzID0gcm91bmQoZHVyYXRpb24uYXMoJ2gnKSksXG4gICAgICAgICAgICBkYXlzID0gcm91bmQoZHVyYXRpb24uYXMoJ2QnKSksXG4gICAgICAgICAgICBtb250aHMgPSByb3VuZChkdXJhdGlvbi5hcygnTScpKSxcbiAgICAgICAgICAgIHllYXJzID0gcm91bmQoZHVyYXRpb24uYXMoJ3knKSksXG5cbiAgICAgICAgICAgIGFyZ3MgPSBzZWNvbmRzIDwgcmVsYXRpdmVUaW1lVGhyZXNob2xkcy5zICYmIFsncycsIHNlY29uZHNdIHx8XG4gICAgICAgICAgICAgICAgbWludXRlcyA9PT0gMSAmJiBbJ20nXSB8fFxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPCByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzLm0gJiYgWydtbScsIG1pbnV0ZXNdIHx8XG4gICAgICAgICAgICAgICAgaG91cnMgPT09IDEgJiYgWydoJ10gfHxcbiAgICAgICAgICAgICAgICBob3VycyA8IHJlbGF0aXZlVGltZVRocmVzaG9sZHMuaCAmJiBbJ2hoJywgaG91cnNdIHx8XG4gICAgICAgICAgICAgICAgZGF5cyA9PT0gMSAmJiBbJ2QnXSB8fFxuICAgICAgICAgICAgICAgIGRheXMgPCByZWxhdGl2ZVRpbWVUaHJlc2hvbGRzLmQgJiYgWydkZCcsIGRheXNdIHx8XG4gICAgICAgICAgICAgICAgbW9udGhzID09PSAxICYmIFsnTSddIHx8XG4gICAgICAgICAgICAgICAgbW9udGhzIDwgcmVsYXRpdmVUaW1lVGhyZXNob2xkcy5NICYmIFsnTU0nLCBtb250aHNdIHx8XG4gICAgICAgICAgICAgICAgeWVhcnMgPT09IDEgJiYgWyd5J10gfHwgWyd5eScsIHllYXJzXTtcblxuICAgICAgICBhcmdzWzJdID0gd2l0aG91dFN1ZmZpeDtcbiAgICAgICAgYXJnc1szXSA9ICtwb3NOZWdEdXJhdGlvbiA+IDA7XG4gICAgICAgIGFyZ3NbNF0gPSBsb2NhbGU7XG4gICAgICAgIHJldHVybiBzdWJzdGl0dXRlVGltZUFnby5hcHBseSh7fSwgYXJncyk7XG4gICAgfVxuXG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgIFdlZWsgb2YgWWVhclxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgLy8gZmlyc3REYXlPZldlZWsgICAgICAgMCA9IHN1biwgNiA9IHNhdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIHRoZSBkYXkgb2YgdGhlIHdlZWsgdGhhdCBzdGFydHMgdGhlIHdlZWtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAodXN1YWxseSBzdW5kYXkgb3IgbW9uZGF5KVxuICAgIC8vIGZpcnN0RGF5T2ZXZWVrT2ZZZWFyIDAgPSBzdW4sIDYgPSBzYXRcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICB0aGUgZmlyc3Qgd2VlayBpcyB0aGUgd2VlayB0aGF0IGNvbnRhaW5zIHRoZSBmaXJzdFxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgIG9mIHRoaXMgZGF5IG9mIHRoZSB3ZWVrXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgKGVnLiBJU08gd2Vla3MgdXNlIHRodXJzZGF5ICg0KSlcbiAgICBmdW5jdGlvbiB3ZWVrT2ZZZWFyKG1vbSwgZmlyc3REYXlPZldlZWssIGZpcnN0RGF5T2ZXZWVrT2ZZZWFyKSB7XG4gICAgICAgIHZhciBlbmQgPSBmaXJzdERheU9mV2Vla09mWWVhciAtIGZpcnN0RGF5T2ZXZWVrLFxuICAgICAgICAgICAgZGF5c1RvRGF5T2ZXZWVrID0gZmlyc3REYXlPZldlZWtPZlllYXIgLSBtb20uZGF5KCksXG4gICAgICAgICAgICBhZGp1c3RlZE1vbWVudDtcblxuXG4gICAgICAgIGlmIChkYXlzVG9EYXlPZldlZWsgPiBlbmQpIHtcbiAgICAgICAgICAgIGRheXNUb0RheU9mV2VlayAtPSA3O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRheXNUb0RheU9mV2VlayA8IGVuZCAtIDcpIHtcbiAgICAgICAgICAgIGRheXNUb0RheU9mV2VlayArPSA3O1xuICAgICAgICB9XG5cbiAgICAgICAgYWRqdXN0ZWRNb21lbnQgPSBtb21lbnQobW9tKS5hZGQoZGF5c1RvRGF5T2ZXZWVrLCAnZCcpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2VlazogTWF0aC5jZWlsKGFkanVzdGVkTW9tZW50LmRheU9mWWVhcigpIC8gNyksXG4gICAgICAgICAgICB5ZWFyOiBhZGp1c3RlZE1vbWVudC55ZWFyKClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvL2h0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvSVNPX3dlZWtfZGF0ZSNDYWxjdWxhdGluZ19hX2RhdGVfZ2l2ZW5fdGhlX3llYXIuMkNfd2Vla19udW1iZXJfYW5kX3dlZWtkYXlcbiAgICBmdW5jdGlvbiBkYXlPZlllYXJGcm9tV2Vla3MoeWVhciwgd2Vlaywgd2Vla2RheSwgZmlyc3REYXlPZldlZWtPZlllYXIsIGZpcnN0RGF5T2ZXZWVrKSB7XG4gICAgICAgIHZhciBkID0gbWFrZVVUQ0RhdGUoeWVhciwgMCwgMSkuZ2V0VVRDRGF5KCksIGRheXNUb0FkZCwgZGF5T2ZZZWFyO1xuXG4gICAgICAgIGQgPSBkID09PSAwID8gNyA6IGQ7XG4gICAgICAgIHdlZWtkYXkgPSB3ZWVrZGF5ICE9IG51bGwgPyB3ZWVrZGF5IDogZmlyc3REYXlPZldlZWs7XG4gICAgICAgIGRheXNUb0FkZCA9IGZpcnN0RGF5T2ZXZWVrIC0gZCArIChkID4gZmlyc3REYXlPZldlZWtPZlllYXIgPyA3IDogMCkgLSAoZCA8IGZpcnN0RGF5T2ZXZWVrID8gNyA6IDApO1xuICAgICAgICBkYXlPZlllYXIgPSA3ICogKHdlZWsgLSAxKSArICh3ZWVrZGF5IC0gZmlyc3REYXlPZldlZWspICsgZGF5c1RvQWRkICsgMTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeWVhcjogZGF5T2ZZZWFyID4gMCA/IHllYXIgOiB5ZWFyIC0gMSxcbiAgICAgICAgICAgIGRheU9mWWVhcjogZGF5T2ZZZWFyID4gMCA/ICBkYXlPZlllYXIgOiBkYXlzSW5ZZWFyKHllYXIgLSAxKSArIGRheU9mWWVhclxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgVG9wIExldmVsIEZ1bmN0aW9uc1xuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIGZ1bmN0aW9uIG1ha2VNb21lbnQoY29uZmlnKSB7XG4gICAgICAgIHZhciBpbnB1dCA9IGNvbmZpZy5faSxcbiAgICAgICAgICAgIGZvcm1hdCA9IGNvbmZpZy5fZjtcblxuICAgICAgICBjb25maWcuX2xvY2FsZSA9IGNvbmZpZy5fbG9jYWxlIHx8IG1vbWVudC5sb2NhbGVEYXRhKGNvbmZpZy5fbCk7XG5cbiAgICAgICAgaWYgKGlucHV0ID09PSBudWxsIHx8IChmb3JtYXQgPT09IHVuZGVmaW5lZCAmJiBpbnB1dCA9PT0gJycpKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50LmludmFsaWQoe251bGxJbnB1dDogdHJ1ZX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbmZpZy5faSA9IGlucHV0ID0gY29uZmlnLl9sb2NhbGUucHJlcGFyc2UoaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vbWVudC5pc01vbWVudChpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTW9tZW50KGlucHV0LCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChmb3JtYXQpIHtcbiAgICAgICAgICAgIGlmIChpc0FycmF5KGZvcm1hdCkpIHtcbiAgICAgICAgICAgICAgICBtYWtlRGF0ZUZyb21TdHJpbmdBbmRBcnJheShjb25maWcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtYWtlRGF0ZUZyb21TdHJpbmdBbmRGb3JtYXQoY29uZmlnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1ha2VEYXRlRnJvbUlucHV0KGNvbmZpZyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IE1vbWVudChjb25maWcpO1xuICAgIH1cblxuICAgIG1vbWVudCA9IGZ1bmN0aW9uIChpbnB1dCwgZm9ybWF0LCBsb2NhbGUsIHN0cmljdCkge1xuICAgICAgICB2YXIgYztcblxuICAgICAgICBpZiAodHlwZW9mKGxvY2FsZSkgPT09ICdib29sZWFuJykge1xuICAgICAgICAgICAgc3RyaWN0ID0gbG9jYWxlO1xuICAgICAgICAgICAgbG9jYWxlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIG9iamVjdCBjb25zdHJ1Y3Rpb24gbXVzdCBiZSBkb25lIHRoaXMgd2F5LlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTQyM1xuICAgICAgICBjID0ge307XG4gICAgICAgIGMuX2lzQU1vbWVudE9iamVjdCA9IHRydWU7XG4gICAgICAgIGMuX2kgPSBpbnB1dDtcbiAgICAgICAgYy5fZiA9IGZvcm1hdDtcbiAgICAgICAgYy5fbCA9IGxvY2FsZTtcbiAgICAgICAgYy5fc3RyaWN0ID0gc3RyaWN0O1xuICAgICAgICBjLl9pc1VUQyA9IGZhbHNlO1xuICAgICAgICBjLl9wZiA9IGRlZmF1bHRQYXJzaW5nRmxhZ3MoKTtcblxuICAgICAgICByZXR1cm4gbWFrZU1vbWVudChjKTtcbiAgICB9O1xuXG4gICAgbW9tZW50LnN1cHByZXNzRGVwcmVjYXRpb25XYXJuaW5ncyA9IGZhbHNlO1xuXG4gICAgbW9tZW50LmNyZWF0ZUZyb21JbnB1dEZhbGxiYWNrID0gZGVwcmVjYXRlKFxuICAgICAgICAnbW9tZW50IGNvbnN0cnVjdGlvbiBmYWxscyBiYWNrIHRvIGpzIERhdGUuIFRoaXMgaXMgJyArXG4gICAgICAgICdkaXNjb3VyYWdlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHVwY29taW5nIG1ham9yICcgK1xuICAgICAgICAncmVsZWFzZS4gUGxlYXNlIHJlZmVyIHRvICcgK1xuICAgICAgICAnaHR0cHM6Ly9naXRodWIuY29tL21vbWVudC9tb21lbnQvaXNzdWVzLzE0MDcgZm9yIG1vcmUgaW5mby4nLFxuICAgICAgICBmdW5jdGlvbiAoY29uZmlnKSB7XG4gICAgICAgICAgICBjb25maWcuX2QgPSBuZXcgRGF0ZShjb25maWcuX2kpO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIC8vIFBpY2sgYSBtb21lbnQgbSBmcm9tIG1vbWVudHMgc28gdGhhdCBtW2ZuXShvdGhlcikgaXMgdHJ1ZSBmb3IgYWxsXG4gICAgLy8gb3RoZXIuIFRoaXMgcmVsaWVzIG9uIHRoZSBmdW5jdGlvbiBmbiB0byBiZSB0cmFuc2l0aXZlLlxuICAgIC8vXG4gICAgLy8gbW9tZW50cyBzaG91bGQgZWl0aGVyIGJlIGFuIGFycmF5IG9mIG1vbWVudCBvYmplY3RzIG9yIGFuIGFycmF5LCB3aG9zZVxuICAgIC8vIGZpcnN0IGVsZW1lbnQgaXMgYW4gYXJyYXkgb2YgbW9tZW50IG9iamVjdHMuXG4gICAgZnVuY3Rpb24gcGlja0J5KGZuLCBtb21lbnRzKSB7XG4gICAgICAgIHZhciByZXMsIGk7XG4gICAgICAgIGlmIChtb21lbnRzLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KG1vbWVudHNbMF0pKSB7XG4gICAgICAgICAgICBtb21lbnRzID0gbW9tZW50c1swXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW1vbWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzID0gbW9tZW50c1swXTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IG1vbWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChtb21lbnRzW2ldW2ZuXShyZXMpKSB7XG4gICAgICAgICAgICAgICAgcmVzID0gbW9tZW50c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIG1vbWVudC5taW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgIHJldHVybiBwaWNrQnkoJ2lzQmVmb3JlJywgYXJncyk7XG4gICAgfTtcblxuICAgIG1vbWVudC5tYXggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuXG4gICAgICAgIHJldHVybiBwaWNrQnkoJ2lzQWZ0ZXInLCBhcmdzKTtcbiAgICB9O1xuXG4gICAgLy8gY3JlYXRpbmcgd2l0aCB1dGNcbiAgICBtb21lbnQudXRjID0gZnVuY3Rpb24gKGlucHV0LCBmb3JtYXQsIGxvY2FsZSwgc3RyaWN0KSB7XG4gICAgICAgIHZhciBjO1xuXG4gICAgICAgIGlmICh0eXBlb2YobG9jYWxlKSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBzdHJpY3QgPSBsb2NhbGU7XG4gICAgICAgICAgICBsb2NhbGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8gb2JqZWN0IGNvbnN0cnVjdGlvbiBtdXN0IGJlIGRvbmUgdGhpcyB3YXkuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tb21lbnQvbW9tZW50L2lzc3Vlcy8xNDIzXG4gICAgICAgIGMgPSB7fTtcbiAgICAgICAgYy5faXNBTW9tZW50T2JqZWN0ID0gdHJ1ZTtcbiAgICAgICAgYy5fdXNlVVRDID0gdHJ1ZTtcbiAgICAgICAgYy5faXNVVEMgPSB0cnVlO1xuICAgICAgICBjLl9sID0gbG9jYWxlO1xuICAgICAgICBjLl9pID0gaW5wdXQ7XG4gICAgICAgIGMuX2YgPSBmb3JtYXQ7XG4gICAgICAgIGMuX3N0cmljdCA9IHN0cmljdDtcbiAgICAgICAgYy5fcGYgPSBkZWZhdWx0UGFyc2luZ0ZsYWdzKCk7XG5cbiAgICAgICAgcmV0dXJuIG1ha2VNb21lbnQoYykudXRjKCk7XG4gICAgfTtcblxuICAgIC8vIGNyZWF0aW5nIHdpdGggdW5peCB0aW1lc3RhbXAgKGluIHNlY29uZHMpXG4gICAgbW9tZW50LnVuaXggPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIG1vbWVudChpbnB1dCAqIDEwMDApO1xuICAgIH07XG5cbiAgICAvLyBkdXJhdGlvblxuICAgIG1vbWVudC5kdXJhdGlvbiA9IGZ1bmN0aW9uIChpbnB1dCwga2V5KSB7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGlucHV0LFxuICAgICAgICAgICAgLy8gbWF0Y2hpbmcgYWdhaW5zdCByZWdleHAgaXMgZXhwZW5zaXZlLCBkbyBpdCBvbiBkZW1hbmRcbiAgICAgICAgICAgIG1hdGNoID0gbnVsbCxcbiAgICAgICAgICAgIHNpZ24sXG4gICAgICAgICAgICByZXQsXG4gICAgICAgICAgICBwYXJzZUlzbyxcbiAgICAgICAgICAgIGRpZmZSZXM7XG5cbiAgICAgICAgaWYgKG1vbWVudC5pc0R1cmF0aW9uKGlucHV0KSkge1xuICAgICAgICAgICAgZHVyYXRpb24gPSB7XG4gICAgICAgICAgICAgICAgbXM6IGlucHV0Ll9taWxsaXNlY29uZHMsXG4gICAgICAgICAgICAgICAgZDogaW5wdXQuX2RheXMsXG4gICAgICAgICAgICAgICAgTTogaW5wdXQuX21vbnRoc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaW5wdXQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uW2tleV0gPSBpbnB1dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb24ubWlsbGlzZWNvbmRzID0gaW5wdXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoISEobWF0Y2ggPSBhc3BOZXRUaW1lU3Bhbkpzb25SZWdleC5leGVjKGlucHV0KSkpIHtcbiAgICAgICAgICAgIHNpZ24gPSAobWF0Y2hbMV0gPT09ICctJykgPyAtMSA6IDE7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB5OiAwLFxuICAgICAgICAgICAgICAgIGQ6IHRvSW50KG1hdGNoW0RBVEVdKSAqIHNpZ24sXG4gICAgICAgICAgICAgICAgaDogdG9JbnQobWF0Y2hbSE9VUl0pICogc2lnbixcbiAgICAgICAgICAgICAgICBtOiB0b0ludChtYXRjaFtNSU5VVEVdKSAqIHNpZ24sXG4gICAgICAgICAgICAgICAgczogdG9JbnQobWF0Y2hbU0VDT05EXSkgKiBzaWduLFxuICAgICAgICAgICAgICAgIG1zOiB0b0ludChtYXRjaFtNSUxMSVNFQ09ORF0pICogc2lnblxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmICghIShtYXRjaCA9IGlzb0R1cmF0aW9uUmVnZXguZXhlYyhpbnB1dCkpKSB7XG4gICAgICAgICAgICBzaWduID0gKG1hdGNoWzFdID09PSAnLScpID8gLTEgOiAxO1xuICAgICAgICAgICAgcGFyc2VJc28gPSBmdW5jdGlvbiAoaW5wKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UnZCBub3JtYWxseSB1c2Ugfn5pbnAgZm9yIHRoaXMsIGJ1dCB1bmZvcnR1bmF0ZWx5IGl0IGFsc29cbiAgICAgICAgICAgICAgICAvLyBjb252ZXJ0cyBmbG9hdHMgdG8gaW50cy5cbiAgICAgICAgICAgICAgICAvLyBpbnAgbWF5IGJlIHVuZGVmaW5lZCwgc28gY2FyZWZ1bCBjYWxsaW5nIHJlcGxhY2Ugb24gaXQuXG4gICAgICAgICAgICAgICAgdmFyIHJlcyA9IGlucCAmJiBwYXJzZUZsb2F0KGlucC5yZXBsYWNlKCcsJywgJy4nKSk7XG4gICAgICAgICAgICAgICAgLy8gYXBwbHkgc2lnbiB3aGlsZSB3ZSdyZSBhdCBpdFxuICAgICAgICAgICAgICAgIHJldHVybiAoaXNOYU4ocmVzKSA/IDAgOiByZXMpICogc2lnbjtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkdXJhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICB5OiBwYXJzZUlzbyhtYXRjaFsyXSksXG4gICAgICAgICAgICAgICAgTTogcGFyc2VJc28obWF0Y2hbM10pLFxuICAgICAgICAgICAgICAgIGQ6IHBhcnNlSXNvKG1hdGNoWzRdKSxcbiAgICAgICAgICAgICAgICBoOiBwYXJzZUlzbyhtYXRjaFs1XSksXG4gICAgICAgICAgICAgICAgbTogcGFyc2VJc28obWF0Y2hbNl0pLFxuICAgICAgICAgICAgICAgIHM6IHBhcnNlSXNvKG1hdGNoWzddKSxcbiAgICAgICAgICAgICAgICB3OiBwYXJzZUlzbyhtYXRjaFs4XSlcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGR1cmF0aW9uID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgICAgICgnZnJvbScgaW4gZHVyYXRpb24gfHwgJ3RvJyBpbiBkdXJhdGlvbikpIHtcbiAgICAgICAgICAgIGRpZmZSZXMgPSBtb21lbnRzRGlmZmVyZW5jZShtb21lbnQoZHVyYXRpb24uZnJvbSksIG1vbWVudChkdXJhdGlvbi50bykpO1xuXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHt9O1xuICAgICAgICAgICAgZHVyYXRpb24ubXMgPSBkaWZmUmVzLm1pbGxpc2Vjb25kcztcbiAgICAgICAgICAgIGR1cmF0aW9uLk0gPSBkaWZmUmVzLm1vbnRocztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldCA9IG5ldyBEdXJhdGlvbihkdXJhdGlvbik7XG5cbiAgICAgICAgaWYgKG1vbWVudC5pc0R1cmF0aW9uKGlucHV0KSAmJiBoYXNPd25Qcm9wKGlucHV0LCAnX2xvY2FsZScpKSB7XG4gICAgICAgICAgICByZXQuX2xvY2FsZSA9IGlucHV0Ll9sb2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH07XG5cbiAgICAvLyB2ZXJzaW9uIG51bWJlclxuICAgIG1vbWVudC52ZXJzaW9uID0gVkVSU0lPTjtcblxuICAgIC8vIGRlZmF1bHQgZm9ybWF0XG4gICAgbW9tZW50LmRlZmF1bHRGb3JtYXQgPSBpc29Gb3JtYXQ7XG5cbiAgICAvLyBjb25zdGFudCB0aGF0IHJlZmVycyB0byB0aGUgSVNPIHN0YW5kYXJkXG4gICAgbW9tZW50LklTT184NjAxID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAvLyBQbHVnaW5zIHRoYXQgYWRkIHByb3BlcnRpZXMgc2hvdWxkIGFsc28gYWRkIHRoZSBrZXkgaGVyZSAobnVsbCB2YWx1ZSksXG4gICAgLy8gc28gd2UgY2FuIHByb3Blcmx5IGNsb25lIG91cnNlbHZlcy5cbiAgICBtb21lbnQubW9tZW50UHJvcGVydGllcyA9IG1vbWVudFByb3BlcnRpZXM7XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyIGEgbW9tZW50IGlzIG11dGF0ZWQuXG4gICAgLy8gSXQgaXMgaW50ZW5kZWQgdG8ga2VlcCB0aGUgb2Zmc2V0IGluIHN5bmMgd2l0aCB0aGUgdGltZXpvbmUuXG4gICAgbW9tZW50LnVwZGF0ZU9mZnNldCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgeW91IHRvIHNldCBhIHRocmVzaG9sZCBmb3IgcmVsYXRpdmUgdGltZSBzdHJpbmdzXG4gICAgbW9tZW50LnJlbGF0aXZlVGltZVRocmVzaG9sZCA9IGZ1bmN0aW9uICh0aHJlc2hvbGQsIGxpbWl0KSB7XG4gICAgICAgIGlmIChyZWxhdGl2ZVRpbWVUaHJlc2hvbGRzW3RocmVzaG9sZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaW1pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVsYXRpdmVUaW1lVGhyZXNob2xkc1t0aHJlc2hvbGRdO1xuICAgICAgICB9XG4gICAgICAgIHJlbGF0aXZlVGltZVRocmVzaG9sZHNbdGhyZXNob2xkXSA9IGxpbWl0O1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgbW9tZW50LmxhbmcgPSBkZXByZWNhdGUoXG4gICAgICAgICdtb21lbnQubGFuZyBpcyBkZXByZWNhdGVkLiBVc2UgbW9tZW50LmxvY2FsZSBpbnN0ZWFkLicsXG4gICAgICAgIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gbW9tZW50LmxvY2FsZShrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICk7XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHdpbGwgbG9hZCBsb2NhbGUgYW5kIHRoZW4gc2V0IHRoZSBnbG9iYWwgbG9jYWxlLiAgSWZcbiAgICAvLyBubyBhcmd1bWVudHMgYXJlIHBhc3NlZCBpbiwgaXQgd2lsbCBzaW1wbHkgcmV0dXJuIHRoZSBjdXJyZW50IGdsb2JhbFxuICAgIC8vIGxvY2FsZSBrZXkuXG4gICAgbW9tZW50LmxvY2FsZSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlcykge1xuICAgICAgICB2YXIgZGF0YTtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZih2YWx1ZXMpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBtb21lbnQuZGVmaW5lTG9jYWxlKGtleSwgdmFsdWVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBtb21lbnQubG9jYWxlRGF0YShrZXkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIG1vbWVudC5kdXJhdGlvbi5fbG9jYWxlID0gbW9tZW50Ll9sb2NhbGUgPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1vbWVudC5fbG9jYWxlLl9hYmJyO1xuICAgIH07XG5cbiAgICBtb21lbnQuZGVmaW5lTG9jYWxlID0gZnVuY3Rpb24gKG5hbWUsIHZhbHVlcykge1xuICAgICAgICBpZiAodmFsdWVzICE9PSBudWxsKSB7XG4gICAgICAgICAgICB2YWx1ZXMuYWJiciA9IG5hbWU7XG4gICAgICAgICAgICBpZiAoIWxvY2FsZXNbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICBsb2NhbGVzW25hbWVdID0gbmV3IExvY2FsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbG9jYWxlc1tuYW1lXS5zZXQodmFsdWVzKTtcblxuICAgICAgICAgICAgLy8gYmFja3dhcmRzIGNvbXBhdCBmb3Igbm93OiBhbHNvIHNldCB0aGUgbG9jYWxlXG4gICAgICAgICAgICBtb21lbnQubG9jYWxlKG5hbWUpO1xuXG4gICAgICAgICAgICByZXR1cm4gbG9jYWxlc1tuYW1lXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHVzZWZ1bCBmb3IgdGVzdGluZ1xuICAgICAgICAgICAgZGVsZXRlIGxvY2FsZXNbbmFtZV07XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBtb21lbnQubGFuZ0RhdGEgPSBkZXByZWNhdGUoXG4gICAgICAgICdtb21lbnQubGFuZ0RhdGEgaXMgZGVwcmVjYXRlZC4gVXNlIG1vbWVudC5sb2NhbGVEYXRhIGluc3RlYWQuJyxcbiAgICAgICAgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudC5sb2NhbGVEYXRhKGtleSk7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgLy8gcmV0dXJucyBsb2NhbGUgZGF0YVxuICAgIG1vbWVudC5sb2NhbGVEYXRhID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgbG9jYWxlO1xuXG4gICAgICAgIGlmIChrZXkgJiYga2V5Ll9sb2NhbGUgJiYga2V5Ll9sb2NhbGUuX2FiYnIpIHtcbiAgICAgICAgICAgIGtleSA9IGtleS5fbG9jYWxlLl9hYmJyO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBtb21lbnQuX2xvY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNBcnJheShrZXkpKSB7XG4gICAgICAgICAgICAvL3Nob3J0LWNpcmN1aXQgZXZlcnl0aGluZyBlbHNlXG4gICAgICAgICAgICBsb2NhbGUgPSBsb2FkTG9jYWxlKGtleSk7XG4gICAgICAgICAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleSA9IFtrZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNob29zZUxvY2FsZShrZXkpO1xuICAgIH07XG5cbiAgICAvLyBjb21wYXJlIG1vbWVudCBvYmplY3RcbiAgICBtb21lbnQuaXNNb21lbnQgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBNb21lbnQgfHxcbiAgICAgICAgICAgIChvYmogIT0gbnVsbCAmJiBoYXNPd25Qcm9wKG9iaiwgJ19pc0FNb21lbnRPYmplY3QnKSk7XG4gICAgfTtcblxuICAgIC8vIGZvciB0eXBlY2hlY2tpbmcgRHVyYXRpb24gb2JqZWN0c1xuICAgIG1vbWVudC5pc0R1cmF0aW9uID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgRHVyYXRpb247XG4gICAgfTtcblxuICAgIGZvciAoaSA9IGxpc3RzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIG1ha2VMaXN0KGxpc3RzW2ldKTtcbiAgICB9XG5cbiAgICBtb21lbnQubm9ybWFsaXplVW5pdHMgPSBmdW5jdGlvbiAodW5pdHMpIHtcbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICB9O1xuXG4gICAgbW9tZW50LmludmFsaWQgPSBmdW5jdGlvbiAoZmxhZ3MpIHtcbiAgICAgICAgdmFyIG0gPSBtb21lbnQudXRjKE5hTik7XG4gICAgICAgIGlmIChmbGFncyAhPSBudWxsKSB7XG4gICAgICAgICAgICBleHRlbmQobS5fcGYsIGZsYWdzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG0uX3BmLnVzZXJJbnZhbGlkYXRlZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbTtcbiAgICB9O1xuXG4gICAgbW9tZW50LnBhcnNlWm9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG1vbWVudC5hcHBseShudWxsLCBhcmd1bWVudHMpLnBhcnNlWm9uZSgpO1xuICAgIH07XG5cbiAgICBtb21lbnQucGFyc2VUd29EaWdpdFllYXIgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgcmV0dXJuIHRvSW50KGlucHV0KSArICh0b0ludChpbnB1dCkgPiA2OCA/IDE5MDAgOiAyMDAwKTtcbiAgICB9O1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBNb21lbnQgUHJvdG90eXBlXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbiAgICBleHRlbmQobW9tZW50LmZuID0gTW9tZW50LnByb3RvdHlwZSwge1xuXG4gICAgICAgIGNsb25lIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG1vbWVudCh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICB2YWx1ZU9mIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICt0aGlzLl9kICsgKCh0aGlzLl9vZmZzZXQgfHwgMCkgKiA2MDAwMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW5peCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCt0aGlzIC8gMTAwMCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9TdHJpbmcgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmxvY2FsZSgnZW4nKS5mb3JtYXQoJ2RkZCBNTU0gREQgWVlZWSBISDptbTpzcyBbR01UXVpaJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9EYXRlIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29mZnNldCA/IG5ldyBEYXRlKCt0aGlzKSA6IHRoaXMuX2Q7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9JU09TdHJpbmcgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbSA9IG1vbWVudCh0aGlzKS51dGMoKTtcbiAgICAgICAgICAgIGlmICgwIDwgbS55ZWFyKCkgJiYgbS55ZWFyKCkgPD0gOTk5OSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXRNb21lbnQobSwgJ1lZWVktTU0tRERbVF1ISDptbTpzcy5TU1NbWl0nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdE1vbWVudChtLCAnWVlZWVlZLU1NLUREW1RdSEg6bW06c3MuU1NTW1pdJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdG9BcnJheSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgbS55ZWFyKCksXG4gICAgICAgICAgICAgICAgbS5tb250aCgpLFxuICAgICAgICAgICAgICAgIG0uZGF0ZSgpLFxuICAgICAgICAgICAgICAgIG0uaG91cnMoKSxcbiAgICAgICAgICAgICAgICBtLm1pbnV0ZXMoKSxcbiAgICAgICAgICAgICAgICBtLnNlY29uZHMoKSxcbiAgICAgICAgICAgICAgICBtLm1pbGxpc2Vjb25kcygpXG4gICAgICAgICAgICBdO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzVmFsaWQgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNWYWxpZCh0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBpc0RTVFNoaWZ0ZWQgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fYSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWQoKSAmJiBjb21wYXJlQXJyYXlzKHRoaXMuX2EsICh0aGlzLl9pc1VUQyA/IG1vbWVudC51dGModGhpcy5fYSkgOiBtb21lbnQodGhpcy5fYSkpLnRvQXJyYXkoKSkgPiAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2luZ0ZsYWdzIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGV4dGVuZCh7fSwgdGhpcy5fcGYpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGludmFsaWRBdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BmLm92ZXJmbG93O1xuICAgICAgICB9LFxuXG4gICAgICAgIHV0YyA6IGZ1bmN0aW9uIChrZWVwTG9jYWxUaW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy56b25lKDAsIGtlZXBMb2NhbFRpbWUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGxvY2FsIDogZnVuY3Rpb24gKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc1VUQykge1xuICAgICAgICAgICAgICAgIHRoaXMuem9uZSgwLCBrZWVwTG9jYWxUaW1lKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9pc1VUQyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgaWYgKGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGQodGhpcy5fZGF0ZVR6T2Zmc2V0KCksICdtJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZm9ybWF0IDogZnVuY3Rpb24gKGlucHV0U3RyaW5nKSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gZm9ybWF0TW9tZW50KHRoaXMsIGlucHV0U3RyaW5nIHx8IG1vbWVudC5kZWZhdWx0Rm9ybWF0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5wb3N0Zm9ybWF0KG91dHB1dCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkIDogY3JlYXRlQWRkZXIoMSwgJ2FkZCcpLFxuXG4gICAgICAgIHN1YnRyYWN0IDogY3JlYXRlQWRkZXIoLTEsICdzdWJ0cmFjdCcpLFxuXG4gICAgICAgIGRpZmYgOiBmdW5jdGlvbiAoaW5wdXQsIHVuaXRzLCBhc0Zsb2F0KSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IG1ha2VBcyhpbnB1dCwgdGhpcyksXG4gICAgICAgICAgICAgICAgem9uZURpZmYgPSAodGhpcy56b25lKCkgLSB0aGF0LnpvbmUoKSkgKiA2ZTQsXG4gICAgICAgICAgICAgICAgZGlmZiwgb3V0cHV0LCBkYXlzQWRqdXN0O1xuXG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcblxuICAgICAgICAgICAgaWYgKHVuaXRzID09PSAneWVhcicgfHwgdW5pdHMgPT09ICdtb250aCcpIHtcbiAgICAgICAgICAgICAgICAvLyBhdmVyYWdlIG51bWJlciBvZiBkYXlzIGluIHRoZSBtb250aHMgaW4gdGhlIGdpdmVuIGRhdGVzXG4gICAgICAgICAgICAgICAgZGlmZiA9ICh0aGlzLmRheXNJbk1vbnRoKCkgKyB0aGF0LmRheXNJbk1vbnRoKCkpICogNDMyZTU7IC8vIDI0ICogNjAgKiA2MCAqIDEwMDAgLyAyXG4gICAgICAgICAgICAgICAgLy8gZGlmZmVyZW5jZSBpbiBtb250aHNcbiAgICAgICAgICAgICAgICBvdXRwdXQgPSAoKHRoaXMueWVhcigpIC0gdGhhdC55ZWFyKCkpICogMTIpICsgKHRoaXMubW9udGgoKSAtIHRoYXQubW9udGgoKSk7XG4gICAgICAgICAgICAgICAgLy8gYWRqdXN0IGJ5IHRha2luZyBkaWZmZXJlbmNlIGluIGRheXMsIGF2ZXJhZ2UgbnVtYmVyIG9mIGRheXNcbiAgICAgICAgICAgICAgICAvLyBhbmQgZHN0IGluIHRoZSBnaXZlbiBtb250aHMuXG4gICAgICAgICAgICAgICAgZGF5c0FkanVzdCA9ICh0aGlzIC0gbW9tZW50KHRoaXMpLnN0YXJ0T2YoJ21vbnRoJykpIC1cbiAgICAgICAgICAgICAgICAgICAgKHRoYXQgLSBtb21lbnQodGhhdCkuc3RhcnRPZignbW9udGgnKSk7XG4gICAgICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2l0aCB6b25lcywgdG8gbmVnYXRlIGFsbCBkc3RcbiAgICAgICAgICAgICAgICBkYXlzQWRqdXN0IC09ICgodGhpcy56b25lKCkgLSBtb21lbnQodGhpcykuc3RhcnRPZignbW9udGgnKS56b25lKCkpIC1cbiAgICAgICAgICAgICAgICAgICAgICAgICh0aGF0LnpvbmUoKSAtIG1vbWVudCh0aGF0KS5zdGFydE9mKCdtb250aCcpLnpvbmUoKSkpICogNmU0O1xuICAgICAgICAgICAgICAgIG91dHB1dCArPSBkYXlzQWRqdXN0IC8gZGlmZjtcbiAgICAgICAgICAgICAgICBpZiAodW5pdHMgPT09ICd5ZWFyJykge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXQgPSBvdXRwdXQgLyAxMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRpZmYgPSAodGhpcyAtIHRoYXQpO1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IHVuaXRzID09PSAnc2Vjb25kJyA/IGRpZmYgLyAxZTMgOiAvLyAxMDAwXG4gICAgICAgICAgICAgICAgICAgIHVuaXRzID09PSAnbWludXRlJyA/IGRpZmYgLyA2ZTQgOiAvLyAxMDAwICogNjBcbiAgICAgICAgICAgICAgICAgICAgdW5pdHMgPT09ICdob3VyJyA/IGRpZmYgLyAzNmU1IDogLy8gMTAwMCAqIDYwICogNjBcbiAgICAgICAgICAgICAgICAgICAgdW5pdHMgPT09ICdkYXknID8gKGRpZmYgLSB6b25lRGlmZikgLyA4NjRlNSA6IC8vIDEwMDAgKiA2MCAqIDYwICogMjQsIG5lZ2F0ZSBkc3RcbiAgICAgICAgICAgICAgICAgICAgdW5pdHMgPT09ICd3ZWVrJyA/IChkaWZmIC0gem9uZURpZmYpIC8gNjA0OGU1IDogLy8gMTAwMCAqIDYwICogNjAgKiAyNCAqIDcsIG5lZ2F0ZSBkc3RcbiAgICAgICAgICAgICAgICAgICAgZGlmZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhc0Zsb2F0ID8gb3V0cHV0IDogYWJzUm91bmQob3V0cHV0KTtcbiAgICAgICAgfSxcblxuICAgICAgICBmcm9tIDogZnVuY3Rpb24gKHRpbWUsIHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgICAgIHJldHVybiBtb21lbnQuZHVyYXRpb24oe3RvOiB0aGlzLCBmcm9tOiB0aW1lfSkubG9jYWxlKHRoaXMubG9jYWxlKCkpLmh1bWFuaXplKCF3aXRob3V0U3VmZml4KTtcbiAgICAgICAgfSxcblxuICAgICAgICBmcm9tTm93IDogZnVuY3Rpb24gKHdpdGhvdXRTdWZmaXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZyb20obW9tZW50KCksIHdpdGhvdXRTdWZmaXgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNhbGVuZGFyIDogZnVuY3Rpb24gKHRpbWUpIHtcbiAgICAgICAgICAgIC8vIFdlIHdhbnQgdG8gY29tcGFyZSB0aGUgc3RhcnQgb2YgdG9kYXksIHZzIHRoaXMuXG4gICAgICAgICAgICAvLyBHZXR0aW5nIHN0YXJ0LW9mLXRvZGF5IGRlcGVuZHMgb24gd2hldGhlciB3ZSdyZSB6b25lJ2Qgb3Igbm90LlxuICAgICAgICAgICAgdmFyIG5vdyA9IHRpbWUgfHwgbW9tZW50KCksXG4gICAgICAgICAgICAgICAgc29kID0gbWFrZUFzKG5vdywgdGhpcykuc3RhcnRPZignZGF5JyksXG4gICAgICAgICAgICAgICAgZGlmZiA9IHRoaXMuZGlmZihzb2QsICdkYXlzJywgdHJ1ZSksXG4gICAgICAgICAgICAgICAgZm9ybWF0ID0gZGlmZiA8IC02ID8gJ3NhbWVFbHNlJyA6XG4gICAgICAgICAgICAgICAgICAgIGRpZmYgPCAtMSA/ICdsYXN0V2VlaycgOlxuICAgICAgICAgICAgICAgICAgICBkaWZmIDwgMCA/ICdsYXN0RGF5JyA6XG4gICAgICAgICAgICAgICAgICAgIGRpZmYgPCAxID8gJ3NhbWVEYXknIDpcbiAgICAgICAgICAgICAgICAgICAgZGlmZiA8IDIgPyAnbmV4dERheScgOlxuICAgICAgICAgICAgICAgICAgICBkaWZmIDwgNyA/ICduZXh0V2VlaycgOiAnc2FtZUVsc2UnO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0KHRoaXMubG9jYWxlRGF0YSgpLmNhbGVuZGFyKGZvcm1hdCwgdGhpcykpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzTGVhcFllYXIgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNMZWFwWWVhcih0aGlzLnllYXIoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNEU1QgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuem9uZSgpIDwgdGhpcy5jbG9uZSgpLm1vbnRoKDApLnpvbmUoKSB8fFxuICAgICAgICAgICAgICAgIHRoaXMuem9uZSgpIDwgdGhpcy5jbG9uZSgpLm1vbnRoKDUpLnpvbmUoKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGF5IDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgZGF5ID0gdGhpcy5faXNVVEMgPyB0aGlzLl9kLmdldFVUQ0RheSgpIDogdGhpcy5fZC5nZXREYXkoKTtcbiAgICAgICAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBwYXJzZVdlZWtkYXkoaW5wdXQsIHRoaXMubG9jYWxlRGF0YSgpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hZGQoaW5wdXQgLSBkYXksICdkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbW9udGggOiBtYWtlQWNjZXNzb3IoJ01vbnRoJywgdHJ1ZSksXG5cbiAgICAgICAgc3RhcnRPZiA6IGZ1bmN0aW9uICh1bml0cykge1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgICAgICAvLyB0aGUgZm9sbG93aW5nIHN3aXRjaCBpbnRlbnRpb25hbGx5IG9taXRzIGJyZWFrIGtleXdvcmRzXG4gICAgICAgICAgICAvLyB0byB1dGlsaXplIGZhbGxpbmcgdGhyb3VnaCB0aGUgY2FzZXMuXG4gICAgICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICBjYXNlICd5ZWFyJzpcbiAgICAgICAgICAgICAgICB0aGlzLm1vbnRoKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ3F1YXJ0ZXInOlxuICAgICAgICAgICAgY2FzZSAnbW9udGgnOlxuICAgICAgICAgICAgICAgIHRoaXMuZGF0ZSgxKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICd3ZWVrJzpcbiAgICAgICAgICAgIGNhc2UgJ2lzb1dlZWsnOlxuICAgICAgICAgICAgY2FzZSAnZGF5JzpcbiAgICAgICAgICAgICAgICB0aGlzLmhvdXJzKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIGNhc2UgJ2hvdXInOlxuICAgICAgICAgICAgICAgIHRoaXMubWludXRlcygwKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICdtaW51dGUnOlxuICAgICAgICAgICAgICAgIHRoaXMuc2Vjb25kcygwKTtcbiAgICAgICAgICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICAgICAgICBjYXNlICdzZWNvbmQnOlxuICAgICAgICAgICAgICAgIHRoaXMubWlsbGlzZWNvbmRzKDApO1xuICAgICAgICAgICAgICAgIC8qIGZhbGxzIHRocm91Z2ggKi9cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gd2Vla3MgYXJlIGEgc3BlY2lhbCBjYXNlXG4gICAgICAgICAgICBpZiAodW5pdHMgPT09ICd3ZWVrJykge1xuICAgICAgICAgICAgICAgIHRoaXMud2Vla2RheSgwKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodW5pdHMgPT09ICdpc29XZWVrJykge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNvV2Vla2RheSgxKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcXVhcnRlcnMgYXJlIGFsc28gc3BlY2lhbFxuICAgICAgICAgICAgaWYgKHVuaXRzID09PSAncXVhcnRlcicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vbnRoKE1hdGguZmxvb3IodGhpcy5tb250aCgpIC8gMykgKiAzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZW5kT2Y6IGZ1bmN0aW9uICh1bml0cykge1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFydE9mKHVuaXRzKS5hZGQoMSwgKHVuaXRzID09PSAnaXNvV2VlaycgPyAnd2VlaycgOiB1bml0cykpLnN1YnRyYWN0KDEsICdtcycpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzQWZ0ZXI6IGZ1bmN0aW9uIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModHlwZW9mIHVuaXRzICE9PSAndW5kZWZpbmVkJyA/IHVuaXRzIDogJ21pbGxpc2Vjb25kJyk7XG4gICAgICAgICAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IG1vbWVudC5pc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IG1vbWVudChpbnB1dCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICt0aGlzID4gK2lucHV0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gK3RoaXMuY2xvbmUoKS5zdGFydE9mKHVuaXRzKSA+ICttb21lbnQoaW5wdXQpLnN0YXJ0T2YodW5pdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGlzQmVmb3JlOiBmdW5jdGlvbiAoaW5wdXQsIHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHR5cGVvZiB1bml0cyAhPT0gJ3VuZGVmaW5lZCcgPyB1bml0cyA6ICdtaWxsaXNlY29uZCcpO1xuICAgICAgICAgICAgaWYgKHVuaXRzID09PSAnbWlsbGlzZWNvbmQnKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSBtb21lbnQuaXNNb21lbnQoaW5wdXQpID8gaW5wdXQgOiBtb21lbnQoaW5wdXQpO1xuICAgICAgICAgICAgICAgIHJldHVybiArdGhpcyA8ICtpbnB1dDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICt0aGlzLmNsb25lKCkuc3RhcnRPZih1bml0cykgPCArbW9tZW50KGlucHV0KS5zdGFydE9mKHVuaXRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBpc1NhbWU6IGZ1bmN0aW9uIChpbnB1dCwgdW5pdHMpIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMgfHwgJ21pbGxpc2Vjb25kJyk7XG4gICAgICAgICAgICBpZiAodW5pdHMgPT09ICdtaWxsaXNlY29uZCcpIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IG1vbWVudC5pc01vbWVudChpbnB1dCkgPyBpbnB1dCA6IG1vbWVudChpbnB1dCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICt0aGlzID09PSAraW5wdXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiArdGhpcy5jbG9uZSgpLnN0YXJ0T2YodW5pdHMpID09PSArbWFrZUFzKGlucHV0LCB0aGlzKS5zdGFydE9mKHVuaXRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBtaW46IGRlcHJlY2F0ZShcbiAgICAgICAgICAgICAgICAgJ21vbWVudCgpLm1pbiBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50Lm1pbiBpbnN0ZWFkLiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTU0OCcsXG4gICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChvdGhlcikge1xuICAgICAgICAgICAgICAgICAgICAgb3RoZXIgPSBtb21lbnQuYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvdGhlciA8IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICksXG5cbiAgICAgICAgbWF4OiBkZXByZWNhdGUoXG4gICAgICAgICAgICAgICAgJ21vbWVudCgpLm1heCBpcyBkZXByZWNhdGVkLCB1c2UgbW9tZW50Lm1heCBpbnN0ZWFkLiBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9pc3N1ZXMvMTU0OCcsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKG90aGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIG90aGVyID0gbW9tZW50LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvdGhlciA+IHRoaXMgPyB0aGlzIDogb3RoZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICApLFxuXG4gICAgICAgIC8vIGtlZXBMb2NhbFRpbWUgPSB0cnVlIG1lYW5zIG9ubHkgY2hhbmdlIHRoZSB0aW1lem9uZSwgd2l0aG91dFxuICAgICAgICAvLyBhZmZlY3RpbmcgdGhlIGxvY2FsIGhvdXIuIFNvIDU6MzE6MjYgKzAzMDAgLS1bem9uZSgyLCB0cnVlKV0tLT5cbiAgICAgICAgLy8gNTozMToyNiArMDIwMCBJdCBpcyBwb3NzaWJsZSB0aGF0IDU6MzE6MjYgZG9lc24ndCBleGlzdCBpbnQgem9uZVxuICAgICAgICAvLyArMDIwMCwgc28gd2UgYWRqdXN0IHRoZSB0aW1lIGFzIG5lZWRlZCwgdG8gYmUgdmFsaWQuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIEtlZXBpbmcgdGhlIHRpbWUgYWN0dWFsbHkgYWRkcy9zdWJ0cmFjdHMgKG9uZSBob3VyKVxuICAgICAgICAvLyBmcm9tIHRoZSBhY3R1YWwgcmVwcmVzZW50ZWQgdGltZS4gVGhhdCBpcyB3aHkgd2UgY2FsbCB1cGRhdGVPZmZzZXRcbiAgICAgICAgLy8gYSBzZWNvbmQgdGltZS4gSW4gY2FzZSBpdCB3YW50cyB1cyB0byBjaGFuZ2UgdGhlIG9mZnNldCBhZ2FpblxuICAgICAgICAvLyBfY2hhbmdlSW5Qcm9ncmVzcyA9PSB0cnVlIGNhc2UsIHRoZW4gd2UgaGF2ZSB0byBhZGp1c3QsIGJlY2F1c2VcbiAgICAgICAgLy8gdGhlcmUgaXMgbm8gc3VjaCB0aW1lIGluIHRoZSBnaXZlbiB0aW1lem9uZS5cbiAgICAgICAgem9uZSA6IGZ1bmN0aW9uIChpbnB1dCwga2VlcExvY2FsVGltZSkge1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuX29mZnNldCB8fCAwLFxuICAgICAgICAgICAgICAgIGxvY2FsQWRqdXN0O1xuICAgICAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dCA9IHRpbWV6b25lTWludXRlc0Zyb21TdHJpbmcoaW5wdXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoaW5wdXQpIDwgMTYpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBpbnB1dCAqIDYwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2lzVVRDICYmIGtlZXBMb2NhbFRpbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxBZGp1c3QgPSB0aGlzLl9kYXRlVHpPZmZzZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fb2Zmc2V0ID0gaW5wdXQ7XG4gICAgICAgICAgICAgICAgdGhpcy5faXNVVEMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChsb2NhbEFkanVzdCAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3VidHJhY3QobG9jYWxBZGp1c3QsICdtJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvZmZzZXQgIT09IGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgha2VlcExvY2FsVGltZSB8fCB0aGlzLl9jaGFuZ2VJblByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRPclN1YnRyYWN0RHVyYXRpb25Gcm9tTW9tZW50KHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vbWVudC5kdXJhdGlvbihvZmZzZXQgLSBpbnB1dCwgJ20nKSwgMSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9jaGFuZ2VJblByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VJblByb2dyZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbWVudC51cGRhdGVPZmZzZXQodGhpcywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFuZ2VJblByb2dyZXNzID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lzVVRDID8gb2Zmc2V0IDogdGhpcy5fZGF0ZVR6T2Zmc2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICB6b25lQWJiciA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pc1VUQyA/ICdVVEMnIDogJyc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgem9uZU5hbWUgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faXNVVEMgPyAnQ29vcmRpbmF0ZWQgVW5pdmVyc2FsIFRpbWUnIDogJyc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2Vab25lIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3R6bSkge1xuICAgICAgICAgICAgICAgIHRoaXMuem9uZSh0aGlzLl90em0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5faSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnpvbmUodGhpcy5faSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBoYXNBbGlnbmVkSG91ck9mZnNldCA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICAgICAgaWYgKCFpbnB1dCkge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlucHV0ID0gbW9tZW50KGlucHV0KS56b25lKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiAodGhpcy56b25lKCkgLSBpbnB1dCkgJSA2MCA9PT0gMDtcbiAgICAgICAgfSxcblxuICAgICAgICBkYXlzSW5Nb250aCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXlzSW5Nb250aCh0aGlzLnllYXIoKSwgdGhpcy5tb250aCgpKTtcbiAgICAgICAgfSxcblxuICAgICAgICBkYXlPZlllYXIgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciBkYXlPZlllYXIgPSByb3VuZCgobW9tZW50KHRoaXMpLnN0YXJ0T2YoJ2RheScpIC0gbW9tZW50KHRoaXMpLnN0YXJ0T2YoJ3llYXInKSkgLyA4NjRlNSkgKyAxO1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyBkYXlPZlllYXIgOiB0aGlzLmFkZCgoaW5wdXQgLSBkYXlPZlllYXIpLCAnZCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHF1YXJ0ZXIgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gTWF0aC5jZWlsKCh0aGlzLm1vbnRoKCkgKyAxKSAvIDMpIDogdGhpcy5tb250aCgoaW5wdXQgLSAxKSAqIDMgKyB0aGlzLm1vbnRoKCkgJSAzKTtcbiAgICAgICAgfSxcblxuICAgICAgICB3ZWVrWWVhciA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICAgICAgdmFyIHllYXIgPSB3ZWVrT2ZZZWFyKHRoaXMsIHRoaXMubG9jYWxlRGF0YSgpLl93ZWVrLmRvdywgdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG95KS55ZWFyO1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB5ZWFyIDogdGhpcy5hZGQoKGlucHV0IC0geWVhciksICd5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNvV2Vla1llYXIgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB5ZWFyID0gd2Vla09mWWVhcih0aGlzLCAxLCA0KS55ZWFyO1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB5ZWFyIDogdGhpcy5hZGQoKGlucHV0IC0geWVhciksICd5Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgd2VlayA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICAgICAgdmFyIHdlZWsgPSB0aGlzLmxvY2FsZURhdGEoKS53ZWVrKHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrIDogdGhpcy5hZGQoKGlucHV0IC0gd2VlaykgKiA3LCAnZCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGlzb1dlZWsgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB3ZWVrID0gd2Vla09mWWVhcih0aGlzLCAxLCA0KS53ZWVrO1xuICAgICAgICAgICAgcmV0dXJuIGlucHV0ID09IG51bGwgPyB3ZWVrIDogdGhpcy5hZGQoKGlucHV0IC0gd2VlaykgKiA3LCAnZCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdlZWtkYXkgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB3ZWVrZGF5ID0gKHRoaXMuZGF5KCkgKyA3IC0gdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWsuZG93KSAlIDc7XG4gICAgICAgICAgICByZXR1cm4gaW5wdXQgPT0gbnVsbCA/IHdlZWtkYXkgOiB0aGlzLmFkZChpbnB1dCAtIHdlZWtkYXksICdkJyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNvV2Vla2RheSA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgICAgICAgICAgLy8gYmVoYXZlcyB0aGUgc2FtZSBhcyBtb21lbnQjZGF5IGV4Y2VwdFxuICAgICAgICAgICAgLy8gYXMgYSBnZXR0ZXIsIHJldHVybnMgNyBpbnN0ZWFkIG9mIDAgKDEtNyByYW5nZSBpbnN0ZWFkIG9mIDAtNilcbiAgICAgICAgICAgIC8vIGFzIGEgc2V0dGVyLCBzdW5kYXkgc2hvdWxkIGJlbG9uZyB0byB0aGUgcHJldmlvdXMgd2Vlay5cbiAgICAgICAgICAgIHJldHVybiBpbnB1dCA9PSBudWxsID8gdGhpcy5kYXkoKSB8fCA3IDogdGhpcy5kYXkodGhpcy5kYXkoKSAlIDcgPyBpbnB1dCA6IGlucHV0IC0gNyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXNvV2Vla3NJblllYXIgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gd2Vla3NJblllYXIodGhpcy55ZWFyKCksIDEsIDQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHdlZWtzSW5ZZWFyIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHdlZWtJbmZvID0gdGhpcy5sb2NhbGVEYXRhKCkuX3dlZWs7XG4gICAgICAgICAgICByZXR1cm4gd2Vla3NJblllYXIodGhpcy55ZWFyKCksIHdlZWtJbmZvLmRvdywgd2Vla0luZm8uZG95KTtcbiAgICAgICAgfSxcblxuICAgICAgICBnZXQgOiBmdW5jdGlvbiAodW5pdHMpIHtcbiAgICAgICAgICAgIHVuaXRzID0gbm9ybWFsaXplVW5pdHModW5pdHMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbdW5pdHNdKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0IDogZnVuY3Rpb24gKHVuaXRzLCB2YWx1ZSkge1xuICAgICAgICAgICAgdW5pdHMgPSBub3JtYWxpemVVbml0cyh1bml0cyk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXNbdW5pdHNdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhpc1t1bml0c10odmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gSWYgcGFzc2VkIGEgbG9jYWxlIGtleSwgaXQgd2lsbCBzZXQgdGhlIGxvY2FsZSBmb3IgdGhpc1xuICAgICAgICAvLyBpbnN0YW5jZS4gIE90aGVyd2lzZSwgaXQgd2lsbCByZXR1cm4gdGhlIGxvY2FsZSBjb25maWd1cmF0aW9uXG4gICAgICAgIC8vIHZhcmlhYmxlcyBmb3IgdGhpcyBpbnN0YW5jZS5cbiAgICAgICAgbG9jYWxlIDogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgdmFyIG5ld0xvY2FsZURhdGE7XG5cbiAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGUuX2FiYnI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld0xvY2FsZURhdGEgPSBtb21lbnQubG9jYWxlRGF0YShrZXkpO1xuICAgICAgICAgICAgICAgIGlmIChuZXdMb2NhbGVEYXRhICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbG9jYWxlID0gbmV3TG9jYWxlRGF0YTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbGFuZyA6IGRlcHJlY2F0ZShcbiAgICAgICAgICAgICdtb21lbnQoKS5sYW5nKCkgaXMgZGVwcmVjYXRlZC4gVXNlIG1vbWVudCgpLmxvY2FsZURhdGEoKSBpbnN0ZWFkLicsXG4gICAgICAgICAgICBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5sb2NhbGUoa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICksXG5cbiAgICAgICAgbG9jYWxlRGF0YSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sb2NhbGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX2RhdGVUek9mZnNldCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIE9uIEZpcmVmb3guMjQgRGF0ZSNnZXRUaW1lem9uZU9mZnNldCByZXR1cm5zIGEgZmxvYXRpbmcgcG9pbnQuXG4gICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbW9tZW50L21vbWVudC9wdWxsLzE4NzFcbiAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHRoaXMuX2QuZ2V0VGltZXpvbmVPZmZzZXQoKSAvIDE1KSAqIDE1O1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiByYXdNb250aFNldHRlcihtb20sIHZhbHVlKSB7XG4gICAgICAgIHZhciBkYXlPZk1vbnRoO1xuXG4gICAgICAgIC8vIFRPRE86IE1vdmUgdGhpcyBvdXQgb2YgaGVyZSFcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhbHVlID0gbW9tLmxvY2FsZURhdGEoKS5tb250aHNQYXJzZSh2YWx1ZSk7XG4gICAgICAgICAgICAvLyBUT0RPOiBBbm90aGVyIHNpbGVudCBmYWlsdXJlP1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbW9tO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZGF5T2ZNb250aCA9IE1hdGgubWluKG1vbS5kYXRlKCksXG4gICAgICAgICAgICAgICAgZGF5c0luTW9udGgobW9tLnllYXIoKSwgdmFsdWUpKTtcbiAgICAgICAgbW9tLl9kWydzZXQnICsgKG1vbS5faXNVVEMgPyAnVVRDJyA6ICcnKSArICdNb250aCddKHZhbHVlLCBkYXlPZk1vbnRoKTtcbiAgICAgICAgcmV0dXJuIG1vbTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByYXdHZXR0ZXIobW9tLCB1bml0KSB7XG4gICAgICAgIHJldHVybiBtb20uX2RbJ2dldCcgKyAobW9tLl9pc1VUQyA/ICdVVEMnIDogJycpICsgdW5pdF0oKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByYXdTZXR0ZXIobW9tLCB1bml0LCB2YWx1ZSkge1xuICAgICAgICBpZiAodW5pdCA9PT0gJ01vbnRoJykge1xuICAgICAgICAgICAgcmV0dXJuIHJhd01vbnRoU2V0dGVyKG1vbSwgdmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG1vbS5fZFsnc2V0JyArIChtb20uX2lzVVRDID8gJ1VUQycgOiAnJykgKyB1bml0XSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlQWNjZXNzb3IodW5pdCwga2VlcFRpbWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByYXdTZXR0ZXIodGhpcywgdW5pdCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIG1vbWVudC51cGRhdGVPZmZzZXQodGhpcywga2VlcFRpbWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmF3R2V0dGVyKHRoaXMsIHVuaXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIG1vbWVudC5mbi5taWxsaXNlY29uZCA9IG1vbWVudC5mbi5taWxsaXNlY29uZHMgPSBtYWtlQWNjZXNzb3IoJ01pbGxpc2Vjb25kcycsIGZhbHNlKTtcbiAgICBtb21lbnQuZm4uc2Vjb25kID0gbW9tZW50LmZuLnNlY29uZHMgPSBtYWtlQWNjZXNzb3IoJ1NlY29uZHMnLCBmYWxzZSk7XG4gICAgbW9tZW50LmZuLm1pbnV0ZSA9IG1vbWVudC5mbi5taW51dGVzID0gbWFrZUFjY2Vzc29yKCdNaW51dGVzJywgZmFsc2UpO1xuICAgIC8vIFNldHRpbmcgdGhlIGhvdXIgc2hvdWxkIGtlZXAgdGhlIHRpbWUsIGJlY2F1c2UgdGhlIHVzZXIgZXhwbGljaXRseVxuICAgIC8vIHNwZWNpZmllZCB3aGljaCBob3VyIGhlIHdhbnRzLiBTbyB0cnlpbmcgdG8gbWFpbnRhaW4gdGhlIHNhbWUgaG91ciAoaW5cbiAgICAvLyBhIG5ldyB0aW1lem9uZSkgbWFrZXMgc2Vuc2UuIEFkZGluZy9zdWJ0cmFjdGluZyBob3VycyBkb2VzIG5vdCBmb2xsb3dcbiAgICAvLyB0aGlzIHJ1bGUuXG4gICAgbW9tZW50LmZuLmhvdXIgPSBtb21lbnQuZm4uaG91cnMgPSBtYWtlQWNjZXNzb3IoJ0hvdXJzJywgdHJ1ZSk7XG4gICAgLy8gbW9tZW50LmZuLm1vbnRoIGlzIGRlZmluZWQgc2VwYXJhdGVseVxuICAgIG1vbWVudC5mbi5kYXRlID0gbWFrZUFjY2Vzc29yKCdEYXRlJywgdHJ1ZSk7XG4gICAgbW9tZW50LmZuLmRhdGVzID0gZGVwcmVjYXRlKCdkYXRlcyBhY2Nlc3NvciBpcyBkZXByZWNhdGVkLiBVc2UgZGF0ZSBpbnN0ZWFkLicsIG1ha2VBY2Nlc3NvcignRGF0ZScsIHRydWUpKTtcbiAgICBtb21lbnQuZm4ueWVhciA9IG1ha2VBY2Nlc3NvcignRnVsbFllYXInLCB0cnVlKTtcbiAgICBtb21lbnQuZm4ueWVhcnMgPSBkZXByZWNhdGUoJ3llYXJzIGFjY2Vzc29yIGlzIGRlcHJlY2F0ZWQuIFVzZSB5ZWFyIGluc3RlYWQuJywgbWFrZUFjY2Vzc29yKCdGdWxsWWVhcicsIHRydWUpKTtcblxuICAgIC8vIGFkZCBwbHVyYWwgbWV0aG9kc1xuICAgIG1vbWVudC5mbi5kYXlzID0gbW9tZW50LmZuLmRheTtcbiAgICBtb21lbnQuZm4ubW9udGhzID0gbW9tZW50LmZuLm1vbnRoO1xuICAgIG1vbWVudC5mbi53ZWVrcyA9IG1vbWVudC5mbi53ZWVrO1xuICAgIG1vbWVudC5mbi5pc29XZWVrcyA9IG1vbWVudC5mbi5pc29XZWVrO1xuICAgIG1vbWVudC5mbi5xdWFydGVycyA9IG1vbWVudC5mbi5xdWFydGVyO1xuXG4gICAgLy8gYWRkIGFsaWFzZWQgZm9ybWF0IG1ldGhvZHNcbiAgICBtb21lbnQuZm4udG9KU09OID0gbW9tZW50LmZuLnRvSVNPU3RyaW5nO1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBEdXJhdGlvbiBQcm90b3R5cGVcbiAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cblxuICAgIGZ1bmN0aW9uIGRheXNUb1llYXJzIChkYXlzKSB7XG4gICAgICAgIC8vIDQwMCB5ZWFycyBoYXZlIDE0NjA5NyBkYXlzICh0YWtpbmcgaW50byBhY2NvdW50IGxlYXAgeWVhciBydWxlcylcbiAgICAgICAgcmV0dXJuIGRheXMgKiA0MDAgLyAxNDYwOTc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24geWVhcnNUb0RheXMgKHllYXJzKSB7XG4gICAgICAgIC8vIHllYXJzICogMzY1ICsgYWJzUm91bmQoeWVhcnMgLyA0KSAtXG4gICAgICAgIC8vICAgICBhYnNSb3VuZCh5ZWFycyAvIDEwMCkgKyBhYnNSb3VuZCh5ZWFycyAvIDQwMCk7XG4gICAgICAgIHJldHVybiB5ZWFycyAqIDE0NjA5NyAvIDQwMDtcbiAgICB9XG5cbiAgICBleHRlbmQobW9tZW50LmR1cmF0aW9uLmZuID0gRHVyYXRpb24ucHJvdG90eXBlLCB7XG5cbiAgICAgICAgX2J1YmJsZSA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBtaWxsaXNlY29uZHMgPSB0aGlzLl9taWxsaXNlY29uZHMsXG4gICAgICAgICAgICAgICAgZGF5cyA9IHRoaXMuX2RheXMsXG4gICAgICAgICAgICAgICAgbW9udGhzID0gdGhpcy5fbW9udGhzLFxuICAgICAgICAgICAgICAgIGRhdGEgPSB0aGlzLl9kYXRhLFxuICAgICAgICAgICAgICAgIHNlY29uZHMsIG1pbnV0ZXMsIGhvdXJzLCB5ZWFycyA9IDA7XG5cbiAgICAgICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgY29kZSBidWJibGVzIHVwIHZhbHVlcywgc2VlIHRoZSB0ZXN0cyBmb3JcbiAgICAgICAgICAgIC8vIGV4YW1wbGVzIG9mIHdoYXQgdGhhdCBtZWFucy5cbiAgICAgICAgICAgIGRhdGEubWlsbGlzZWNvbmRzID0gbWlsbGlzZWNvbmRzICUgMTAwMDtcblxuICAgICAgICAgICAgc2Vjb25kcyA9IGFic1JvdW5kKG1pbGxpc2Vjb25kcyAvIDEwMDApO1xuICAgICAgICAgICAgZGF0YS5zZWNvbmRzID0gc2Vjb25kcyAlIDYwO1xuXG4gICAgICAgICAgICBtaW51dGVzID0gYWJzUm91bmQoc2Vjb25kcyAvIDYwKTtcbiAgICAgICAgICAgIGRhdGEubWludXRlcyA9IG1pbnV0ZXMgJSA2MDtcblxuICAgICAgICAgICAgaG91cnMgPSBhYnNSb3VuZChtaW51dGVzIC8gNjApO1xuICAgICAgICAgICAgZGF0YS5ob3VycyA9IGhvdXJzICUgMjQ7XG5cbiAgICAgICAgICAgIGRheXMgKz0gYWJzUm91bmQoaG91cnMgLyAyNCk7XG5cbiAgICAgICAgICAgIC8vIEFjY3VyYXRlbHkgY29udmVydCBkYXlzIHRvIHllYXJzLCBhc3N1bWUgc3RhcnQgZnJvbSB5ZWFyIDAuXG4gICAgICAgICAgICB5ZWFycyA9IGFic1JvdW5kKGRheXNUb1llYXJzKGRheXMpKTtcbiAgICAgICAgICAgIGRheXMgLT0gYWJzUm91bmQoeWVhcnNUb0RheXMoeWVhcnMpKTtcblxuICAgICAgICAgICAgLy8gMzAgZGF5cyB0byBhIG1vbnRoXG4gICAgICAgICAgICAvLyBUT0RPIChpc2tyZW4pOiBVc2UgYW5jaG9yIGRhdGUgKGxpa2UgMXN0IEphbikgdG8gY29tcHV0ZSB0aGlzLlxuICAgICAgICAgICAgbW9udGhzICs9IGFic1JvdW5kKGRheXMgLyAzMCk7XG4gICAgICAgICAgICBkYXlzICU9IDMwO1xuXG4gICAgICAgICAgICAvLyAxMiBtb250aHMgLT4gMSB5ZWFyXG4gICAgICAgICAgICB5ZWFycyArPSBhYnNSb3VuZChtb250aHMgLyAxMik7XG4gICAgICAgICAgICBtb250aHMgJT0gMTI7XG5cbiAgICAgICAgICAgIGRhdGEuZGF5cyA9IGRheXM7XG4gICAgICAgICAgICBkYXRhLm1vbnRocyA9IG1vbnRocztcbiAgICAgICAgICAgIGRhdGEueWVhcnMgPSB5ZWFycztcbiAgICAgICAgfSxcblxuICAgICAgICBhYnMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgPSBNYXRoLmFicyh0aGlzLl9taWxsaXNlY29uZHMpO1xuICAgICAgICAgICAgdGhpcy5fZGF5cyA9IE1hdGguYWJzKHRoaXMuX2RheXMpO1xuICAgICAgICAgICAgdGhpcy5fbW9udGhzID0gTWF0aC5hYnModGhpcy5fbW9udGhzKTtcblxuICAgICAgICAgICAgdGhpcy5fZGF0YS5taWxsaXNlY29uZHMgPSBNYXRoLmFicyh0aGlzLl9kYXRhLm1pbGxpc2Vjb25kcyk7XG4gICAgICAgICAgICB0aGlzLl9kYXRhLnNlY29uZHMgPSBNYXRoLmFicyh0aGlzLl9kYXRhLnNlY29uZHMpO1xuICAgICAgICAgICAgdGhpcy5fZGF0YS5taW51dGVzID0gTWF0aC5hYnModGhpcy5fZGF0YS5taW51dGVzKTtcbiAgICAgICAgICAgIHRoaXMuX2RhdGEuaG91cnMgPSBNYXRoLmFicyh0aGlzLl9kYXRhLmhvdXJzKTtcbiAgICAgICAgICAgIHRoaXMuX2RhdGEubW9udGhzID0gTWF0aC5hYnModGhpcy5fZGF0YS5tb250aHMpO1xuICAgICAgICAgICAgdGhpcy5fZGF0YS55ZWFycyA9IE1hdGguYWJzKHRoaXMuX2RhdGEueWVhcnMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICB3ZWVrcyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBhYnNSb3VuZCh0aGlzLmRheXMoKSAvIDcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHZhbHVlT2YgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWlsbGlzZWNvbmRzICtcbiAgICAgICAgICAgICAgdGhpcy5fZGF5cyAqIDg2NGU1ICtcbiAgICAgICAgICAgICAgKHRoaXMuX21vbnRocyAlIDEyKSAqIDI1OTJlNiArXG4gICAgICAgICAgICAgIHRvSW50KHRoaXMuX21vbnRocyAvIDEyKSAqIDMxNTM2ZTY7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaHVtYW5pemUgOiBmdW5jdGlvbiAod2l0aFN1ZmZpeCkge1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IHJlbGF0aXZlVGltZSh0aGlzLCAhd2l0aFN1ZmZpeCwgdGhpcy5sb2NhbGVEYXRhKCkpO1xuXG4gICAgICAgICAgICBpZiAod2l0aFN1ZmZpeCkge1xuICAgICAgICAgICAgICAgIG91dHB1dCA9IHRoaXMubG9jYWxlRGF0YSgpLnBhc3RGdXR1cmUoK3RoaXMsIG91dHB1dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2FsZURhdGEoKS5wb3N0Zm9ybWF0KG91dHB1dCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkIDogZnVuY3Rpb24gKGlucHV0LCB2YWwpIHtcbiAgICAgICAgICAgIC8vIHN1cHBvcnRzIG9ubHkgMi4wLXN0eWxlIGFkZCgxLCAncycpIG9yIGFkZChtb21lbnQpXG4gICAgICAgICAgICB2YXIgZHVyID0gbW9tZW50LmR1cmF0aW9uKGlucHV0LCB2YWwpO1xuXG4gICAgICAgICAgICB0aGlzLl9taWxsaXNlY29uZHMgKz0gZHVyLl9taWxsaXNlY29uZHM7XG4gICAgICAgICAgICB0aGlzLl9kYXlzICs9IGR1ci5fZGF5cztcbiAgICAgICAgICAgIHRoaXMuX21vbnRocyArPSBkdXIuX21vbnRocztcblxuICAgICAgICAgICAgdGhpcy5fYnViYmxlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN1YnRyYWN0IDogZnVuY3Rpb24gKGlucHV0LCB2YWwpIHtcbiAgICAgICAgICAgIHZhciBkdXIgPSBtb21lbnQuZHVyYXRpb24oaW5wdXQsIHZhbCk7XG5cbiAgICAgICAgICAgIHRoaXMuX21pbGxpc2Vjb25kcyAtPSBkdXIuX21pbGxpc2Vjb25kcztcbiAgICAgICAgICAgIHRoaXMuX2RheXMgLT0gZHVyLl9kYXlzO1xuICAgICAgICAgICAgdGhpcy5fbW9udGhzIC09IGR1ci5fbW9udGhzO1xuXG4gICAgICAgICAgICB0aGlzLl9idWJibGUoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0IDogZnVuY3Rpb24gKHVuaXRzKSB7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW3VuaXRzLnRvTG93ZXJDYXNlKCkgKyAncyddKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXMgOiBmdW5jdGlvbiAodW5pdHMpIHtcbiAgICAgICAgICAgIHZhciBkYXlzLCBtb250aHM7XG4gICAgICAgICAgICB1bml0cyA9IG5vcm1hbGl6ZVVuaXRzKHVuaXRzKTtcblxuICAgICAgICAgICAgaWYgKHVuaXRzID09PSAnbW9udGgnIHx8IHVuaXRzID09PSAneWVhcicpIHtcbiAgICAgICAgICAgICAgICBkYXlzID0gdGhpcy5fZGF5cyArIHRoaXMuX21pbGxpc2Vjb25kcyAvIDg2NGU1O1xuICAgICAgICAgICAgICAgIG1vbnRocyA9IHRoaXMuX21vbnRocyArIGRheXNUb1llYXJzKGRheXMpICogMTI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuaXRzID09PSAnbW9udGgnID8gbW9udGhzIDogbW9udGhzIC8gMTI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGhhbmRsZSBtaWxsaXNlY29uZHMgc2VwYXJhdGVseSBiZWNhdXNlIG9mIGZsb2F0aW5nIHBvaW50IG1hdGggZXJyb3JzIChpc3N1ZSAjMTg2NylcbiAgICAgICAgICAgICAgICBkYXlzID0gdGhpcy5fZGF5cyArIHllYXJzVG9EYXlzKHRoaXMuX21vbnRocyAvIDEyKTtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3dlZWsnOiByZXR1cm4gZGF5cyAvIDcgKyB0aGlzLl9taWxsaXNlY29uZHMgLyA2MDQ4ZTU7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2RheSc6IHJldHVybiBkYXlzICsgdGhpcy5fbWlsbGlzZWNvbmRzIC8gODY0ZTU7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ2hvdXInOiByZXR1cm4gZGF5cyAqIDI0ICsgdGhpcy5fbWlsbGlzZWNvbmRzIC8gMzZlNTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnbWludXRlJzogcmV0dXJuIGRheXMgKiAyNCAqIDYwICsgdGhpcy5fbWlsbGlzZWNvbmRzIC8gNmU0O1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdzZWNvbmQnOiByZXR1cm4gZGF5cyAqIDI0ICogNjAgKiA2MCArIHRoaXMuX21pbGxpc2Vjb25kcyAvIDEwMDA7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1hdGguZmxvb3IgcHJldmVudHMgZmxvYXRpbmcgcG9pbnQgbWF0aCBlcnJvcnMgaGVyZVxuICAgICAgICAgICAgICAgICAgICBjYXNlICdtaWxsaXNlY29uZCc6IHJldHVybiBNYXRoLmZsb29yKGRheXMgKiAyNCAqIDYwICogNjAgKiAxMDAwKSArIHRoaXMuX21pbGxpc2Vjb25kcztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIHVuaXQgJyArIHVuaXRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgbGFuZyA6IG1vbWVudC5mbi5sYW5nLFxuICAgICAgICBsb2NhbGUgOiBtb21lbnQuZm4ubG9jYWxlLFxuXG4gICAgICAgIHRvSXNvU3RyaW5nIDogZGVwcmVjYXRlKFxuICAgICAgICAgICAgJ3RvSXNvU3RyaW5nKCkgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSB0b0lTT1N0cmluZygpIGluc3RlYWQgJyArXG4gICAgICAgICAgICAnKG5vdGljZSB0aGUgY2FwaXRhbHMpJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b0lTT1N0cmluZygpO1xuICAgICAgICAgICAgfVxuICAgICAgICApLFxuXG4gICAgICAgIHRvSVNPU3RyaW5nIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gaW5zcGlyZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2RvcmRpbGxlL21vbWVudC1pc29kdXJhdGlvbi9ibG9iL21hc3Rlci9tb21lbnQuaXNvZHVyYXRpb24uanNcbiAgICAgICAgICAgIHZhciB5ZWFycyA9IE1hdGguYWJzKHRoaXMueWVhcnMoKSksXG4gICAgICAgICAgICAgICAgbW9udGhzID0gTWF0aC5hYnModGhpcy5tb250aHMoKSksXG4gICAgICAgICAgICAgICAgZGF5cyA9IE1hdGguYWJzKHRoaXMuZGF5cygpKSxcbiAgICAgICAgICAgICAgICBob3VycyA9IE1hdGguYWJzKHRoaXMuaG91cnMoKSksXG4gICAgICAgICAgICAgICAgbWludXRlcyA9IE1hdGguYWJzKHRoaXMubWludXRlcygpKSxcbiAgICAgICAgICAgICAgICBzZWNvbmRzID0gTWF0aC5hYnModGhpcy5zZWNvbmRzKCkgKyB0aGlzLm1pbGxpc2Vjb25kcygpIC8gMTAwMCk7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5hc1NlY29uZHMoKSkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgdGhlIHNhbWUgYXMgQyMncyAoTm9kYSkgYW5kIHB5dGhvbiAoaXNvZGF0ZSkuLi5cbiAgICAgICAgICAgICAgICAvLyBidXQgbm90IG90aGVyIEpTIChnb29nLmRhdGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuICdQMEQnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuYXNTZWNvbmRzKCkgPCAwID8gJy0nIDogJycpICtcbiAgICAgICAgICAgICAgICAnUCcgK1xuICAgICAgICAgICAgICAgICh5ZWFycyA/IHllYXJzICsgJ1knIDogJycpICtcbiAgICAgICAgICAgICAgICAobW9udGhzID8gbW9udGhzICsgJ00nIDogJycpICtcbiAgICAgICAgICAgICAgICAoZGF5cyA/IGRheXMgKyAnRCcgOiAnJykgK1xuICAgICAgICAgICAgICAgICgoaG91cnMgfHwgbWludXRlcyB8fCBzZWNvbmRzKSA/ICdUJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgKGhvdXJzID8gaG91cnMgKyAnSCcgOiAnJykgK1xuICAgICAgICAgICAgICAgIChtaW51dGVzID8gbWludXRlcyArICdNJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgKHNlY29uZHMgPyBzZWNvbmRzICsgJ1MnIDogJycpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGxvY2FsZURhdGEgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbG9jYWxlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBtb21lbnQuZHVyYXRpb24uZm4udG9TdHJpbmcgPSBtb21lbnQuZHVyYXRpb24uZm4udG9JU09TdHJpbmc7XG5cbiAgICBmdW5jdGlvbiBtYWtlRHVyYXRpb25HZXR0ZXIobmFtZSkge1xuICAgICAgICBtb21lbnQuZHVyYXRpb24uZm5bbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtuYW1lXTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmb3IgKGkgaW4gdW5pdE1pbGxpc2Vjb25kRmFjdG9ycykge1xuICAgICAgICBpZiAoaGFzT3duUHJvcCh1bml0TWlsbGlzZWNvbmRGYWN0b3JzLCBpKSkge1xuICAgICAgICAgICAgbWFrZUR1cmF0aW9uR2V0dGVyKGkudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb21lbnQuZHVyYXRpb24uZm4uYXNNaWxsaXNlY29uZHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzKCdtcycpO1xuICAgIH07XG4gICAgbW9tZW50LmR1cmF0aW9uLmZuLmFzU2Vjb25kcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXMoJ3MnKTtcbiAgICB9O1xuICAgIG1vbWVudC5kdXJhdGlvbi5mbi5hc01pbnV0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzKCdtJyk7XG4gICAgfTtcbiAgICBtb21lbnQuZHVyYXRpb24uZm4uYXNIb3VycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXMoJ2gnKTtcbiAgICB9O1xuICAgIG1vbWVudC5kdXJhdGlvbi5mbi5hc0RheXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzKCdkJyk7XG4gICAgfTtcbiAgICBtb21lbnQuZHVyYXRpb24uZm4uYXNXZWVrcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXMoJ3dlZWtzJyk7XG4gICAgfTtcbiAgICBtb21lbnQuZHVyYXRpb24uZm4uYXNNb250aHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFzKCdNJyk7XG4gICAgfTtcbiAgICBtb21lbnQuZHVyYXRpb24uZm4uYXNZZWFycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXMoJ3knKTtcbiAgICB9O1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICBEZWZhdWx0IExvY2FsZVxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4gICAgLy8gU2V0IGRlZmF1bHQgbG9jYWxlLCBvdGhlciBsb2NhbGUgd2lsbCBpbmhlcml0IGZyb20gRW5nbGlzaC5cbiAgICBtb21lbnQubG9jYWxlKCdlbicsIHtcbiAgICAgICAgb3JkaW5hbCA6IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgICAgIHZhciBiID0gbnVtYmVyICUgMTAsXG4gICAgICAgICAgICAgICAgb3V0cHV0ID0gKHRvSW50KG51bWJlciAlIDEwMCAvIDEwKSA9PT0gMSkgPyAndGgnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMSkgPyAnc3QnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMikgPyAnbmQnIDpcbiAgICAgICAgICAgICAgICAoYiA9PT0gMykgPyAncmQnIDogJ3RoJztcbiAgICAgICAgICAgIHJldHVybiBudW1iZXIgKyBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qIEVNQkVEX0xPQ0FMRVMgKi9cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgRXhwb3NpbmcgTW9tZW50XG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgZnVuY3Rpb24gbWFrZUdsb2JhbChzaG91bGREZXByZWNhdGUpIHtcbiAgICAgICAgLypnbG9iYWwgZW5kZXI6ZmFsc2UgKi9cbiAgICAgICAgaWYgKHR5cGVvZiBlbmRlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBvbGRHbG9iYWxNb21lbnQgPSBnbG9iYWxTY29wZS5tb21lbnQ7XG4gICAgICAgIGlmIChzaG91bGREZXByZWNhdGUpIHtcbiAgICAgICAgICAgIGdsb2JhbFNjb3BlLm1vbWVudCA9IGRlcHJlY2F0ZShcbiAgICAgICAgICAgICAgICAgICAgJ0FjY2Vzc2luZyBNb21lbnQgdGhyb3VnaCB0aGUgZ2xvYmFsIHNjb3BlIGlzICcgK1xuICAgICAgICAgICAgICAgICAgICAnZGVwcmVjYXRlZCwgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBhbiB1cGNvbWluZyAnICtcbiAgICAgICAgICAgICAgICAgICAgJ3JlbGVhc2UuJyxcbiAgICAgICAgICAgICAgICAgICAgbW9tZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdsb2JhbFNjb3BlLm1vbWVudCA9IG1vbWVudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIENvbW1vbkpTIG1vZHVsZSBpcyBkZWZpbmVkXG4gICAgaWYgKGhhc01vZHVsZSkge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IG1vbWVudDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoJ21vbWVudCcsIGZ1bmN0aW9uIChyZXF1aXJlLCBleHBvcnRzLCBtb2R1bGUpIHtcbiAgICAgICAgICAgIGlmIChtb2R1bGUuY29uZmlnICYmIG1vZHVsZS5jb25maWcoKSAmJiBtb2R1bGUuY29uZmlnKCkubm9HbG9iYWwgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAvLyByZWxlYXNlIHRoZSBnbG9iYWwgdmFyaWFibGVcbiAgICAgICAgICAgICAgICBnbG9iYWxTY29wZS5tb21lbnQgPSBvbGRHbG9iYWxNb21lbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBtb21lbnQ7XG4gICAgICAgIH0pO1xuICAgICAgICBtYWtlR2xvYmFsKHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG1ha2VHbG9iYWwoKTtcbiAgICB9XG59KS5jYWxsKHRoaXMpO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIvLyAgICAgVW5kZXJzY29yZS5qcyAxLjcuMFxuLy8gICAgIGh0dHA6Ly91bmRlcnNjb3JlanMub3JnXG4vLyAgICAgKGMpIDIwMDktMjAxNCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuLy8gICAgIFVuZGVyc2NvcmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbihmdW5jdGlvbigpIHtcblxuICAvLyBCYXNlbGluZSBzZXR1cFxuICAvLyAtLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIGluIHRoZSBicm93c2VyLCBvciBgZXhwb3J0c2Agb24gdGhlIHNlcnZlci5cbiAgdmFyIHJvb3QgPSB0aGlzO1xuXG4gIC8vIFNhdmUgdGhlIHByZXZpb3VzIHZhbHVlIG9mIHRoZSBgX2AgdmFyaWFibGUuXG4gIHZhciBwcmV2aW91c1VuZGVyc2NvcmUgPSByb290Ll87XG5cbiAgLy8gU2F2ZSBieXRlcyBpbiB0aGUgbWluaWZpZWQgKGJ1dCBub3QgZ3ppcHBlZCkgdmVyc2lvbjpcbiAgdmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZSwgRnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gIC8vIENyZWF0ZSBxdWljayByZWZlcmVuY2UgdmFyaWFibGVzIGZvciBzcGVlZCBhY2Nlc3MgdG8gY29yZSBwcm90b3R5cGVzLlxuICB2YXJcbiAgICBwdXNoICAgICAgICAgICAgID0gQXJyYXlQcm90by5wdXNoLFxuICAgIHNsaWNlICAgICAgICAgICAgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgIGNvbmNhdCAgICAgICAgICAgPSBBcnJheVByb3RvLmNvbmNhdCxcbiAgICB0b1N0cmluZyAgICAgICAgID0gT2JqUHJvdG8udG9TdHJpbmcsXG4gICAgaGFzT3duUHJvcGVydHkgICA9IE9ialByb3RvLmhhc093blByb3BlcnR5O1xuXG4gIC8vIEFsbCAqKkVDTUFTY3JpcHQgNSoqIG5hdGl2ZSBmdW5jdGlvbiBpbXBsZW1lbnRhdGlvbnMgdGhhdCB3ZSBob3BlIHRvIHVzZVxuICAvLyBhcmUgZGVjbGFyZWQgaGVyZS5cbiAgdmFyXG4gICAgbmF0aXZlSXNBcnJheSAgICAgID0gQXJyYXkuaXNBcnJheSxcbiAgICBuYXRpdmVLZXlzICAgICAgICAgPSBPYmplY3Qua2V5cyxcbiAgICBuYXRpdmVCaW5kICAgICAgICAgPSBGdW5jUHJvdG8uYmluZDtcblxuICAvLyBDcmVhdGUgYSBzYWZlIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yIHVzZSBiZWxvdy5cbiAgdmFyIF8gPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgXykgcmV0dXJuIG9iajtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgXykpIHJldHVybiBuZXcgXyhvYmopO1xuICAgIHRoaXMuX3dyYXBwZWQgPSBvYmo7XG4gIH07XG5cbiAgLy8gRXhwb3J0IHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgKipOb2RlLmpzKiosIHdpdGhcbiAgLy8gYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgZm9yIHRoZSBvbGQgYHJlcXVpcmUoKWAgQVBJLiBJZiB3ZSdyZSBpblxuICAvLyB0aGUgYnJvd3NlciwgYWRkIGBfYCBhcyBhIGdsb2JhbCBvYmplY3QuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IF87XG4gICAgfVxuICAgIGV4cG9ydHMuXyA9IF87XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5fID0gXztcbiAgfVxuXG4gIC8vIEN1cnJlbnQgdmVyc2lvbi5cbiAgXy5WRVJTSU9OID0gJzEuNy4wJztcblxuICAvLyBJbnRlcm5hbCBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gZWZmaWNpZW50IChmb3IgY3VycmVudCBlbmdpbmVzKSB2ZXJzaW9uXG4gIC8vIG9mIHRoZSBwYXNzZWQtaW4gY2FsbGJhY2ssIHRvIGJlIHJlcGVhdGVkbHkgYXBwbGllZCBpbiBvdGhlciBVbmRlcnNjb3JlXG4gIC8vIGZ1bmN0aW9ucy5cbiAgdmFyIGNyZWF0ZUNhbGxiYWNrID0gZnVuY3Rpb24oZnVuYywgY29udGV4dCwgYXJnQ291bnQpIHtcbiAgICBpZiAoY29udGV4dCA9PT0gdm9pZCAwKSByZXR1cm4gZnVuYztcbiAgICBzd2l0Y2ggKGFyZ0NvdW50ID09IG51bGwgPyAzIDogYXJnQ291bnQpIHtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUpO1xuICAgICAgfTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBvdGhlcikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlLCBvdGhlcik7XG4gICAgICB9O1xuICAgICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDQ6IHJldHVybiBmdW5jdGlvbihhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseShjb250ZXh0LCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gQSBtb3N0bHktaW50ZXJuYWwgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgY2FsbGJhY2tzIHRoYXQgY2FuIGJlIGFwcGxpZWRcbiAgLy8gdG8gZWFjaCBlbGVtZW50IGluIGEgY29sbGVjdGlvbiwgcmV0dXJuaW5nIHRoZSBkZXNpcmVkIHJlc3VsdCDigJQgZWl0aGVyXG4gIC8vIGlkZW50aXR5LCBhbiBhcmJpdHJhcnkgY2FsbGJhY2ssIGEgcHJvcGVydHkgbWF0Y2hlciwgb3IgYSBwcm9wZXJ0eSBhY2Nlc3Nvci5cbiAgXy5pdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gXy5pZGVudGl0eTtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbHVlKSkgcmV0dXJuIGNyZWF0ZUNhbGxiYWNrKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCk7XG4gICAgaWYgKF8uaXNPYmplY3QodmFsdWUpKSByZXR1cm4gXy5tYXRjaGVzKHZhbHVlKTtcbiAgICByZXR1cm4gXy5wcm9wZXJ0eSh2YWx1ZSk7XG4gIH07XG5cbiAgLy8gQ29sbGVjdGlvbiBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBUaGUgY29ybmVyc3RvbmUsIGFuIGBlYWNoYCBpbXBsZW1lbnRhdGlvbiwgYWthIGBmb3JFYWNoYC5cbiAgLy8gSGFuZGxlcyByYXcgb2JqZWN0cyBpbiBhZGRpdGlvbiB0byBhcnJheS1saWtlcy4gVHJlYXRzIGFsbFxuICAvLyBzcGFyc2UgYXJyYXktbGlrZXMgYXMgaWYgdGhleSB3ZXJlIGRlbnNlLlxuICBfLmVhY2ggPSBfLmZvckVhY2ggPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuICAgIGl0ZXJhdGVlID0gY3JlYXRlQ2FsbGJhY2soaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBpLCBsZW5ndGggPSBvYmoubGVuZ3RoO1xuICAgIGlmIChsZW5ndGggPT09ICtsZW5ndGgpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVyYXRlZShvYmpbaV0sIGksIG9iaik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdGVlKG9ialtrZXlzW2ldXSwga2V5c1tpXSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGl0ZXJhdGVlIHRvIGVhY2ggZWxlbWVudC5cbiAgXy5tYXAgPSBfLmNvbGxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gW107XG4gICAgaXRlcmF0ZWUgPSBfLml0ZXJhdGVlKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9IG9iai5sZW5ndGggIT09ICtvYmoubGVuZ3RoICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgcmVzdWx0cyA9IEFycmF5KGxlbmd0aCksXG4gICAgICAgIGN1cnJlbnRLZXk7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgcmVzdWx0c1tpbmRleF0gPSBpdGVyYXRlZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIHZhciByZWR1Y2VFcnJvciA9ICdSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJztcblxuICAvLyAqKlJlZHVjZSoqIGJ1aWxkcyB1cCBhIHNpbmdsZSByZXN1bHQgZnJvbSBhIGxpc3Qgb2YgdmFsdWVzLCBha2EgYGluamVjdGAsXG4gIC8vIG9yIGBmb2xkbGAuXG4gIF8ucmVkdWNlID0gXy5mb2xkbCA9IF8uaW5qZWN0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgbWVtbywgY29udGV4dCkge1xuICAgIGlmIChvYmogPT0gbnVsbCkgb2JqID0gW107XG4gICAgaXRlcmF0ZWUgPSBjcmVhdGVDYWxsYmFjayhpdGVyYXRlZSwgY29udGV4dCwgNCk7XG4gICAgdmFyIGtleXMgPSBvYmoubGVuZ3RoICE9PSArb2JqLmxlbmd0aCAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICAgIGluZGV4ID0gMCwgY3VycmVudEtleTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICAgIGlmICghbGVuZ3RoKSB0aHJvdyBuZXcgVHlwZUVycm9yKHJlZHVjZUVycm9yKTtcbiAgICAgIG1lbW8gPSBvYmpba2V5cyA/IGtleXNbaW5kZXgrK10gOiBpbmRleCsrXTtcbiAgICB9XG4gICAgZm9yICg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICBtZW1vID0gaXRlcmF0ZWUobWVtbywgb2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gbWVtbztcbiAgfTtcblxuICAvLyBUaGUgcmlnaHQtYXNzb2NpYXRpdmUgdmVyc2lvbiBvZiByZWR1Y2UsIGFsc28ga25vd24gYXMgYGZvbGRyYC5cbiAgXy5yZWR1Y2VSaWdodCA9IF8uZm9sZHIgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSBvYmogPSBbXTtcbiAgICBpdGVyYXRlZSA9IGNyZWF0ZUNhbGxiYWNrKGl0ZXJhdGVlLCBjb250ZXh0LCA0KTtcbiAgICB2YXIga2V5cyA9IG9iai5sZW5ndGggIT09ICsgb2JqLmxlbmd0aCAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgaW5kZXggPSAoa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgY3VycmVudEtleTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICAgIGlmICghaW5kZXgpIHRocm93IG5ldyBUeXBlRXJyb3IocmVkdWNlRXJyb3IpO1xuICAgICAgbWVtbyA9IG9ialtrZXlzID8ga2V5c1stLWluZGV4XSA6IC0taW5kZXhdO1xuICAgIH1cbiAgICB3aGlsZSAoaW5kZXgtLSkge1xuICAgICAgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgbWVtbyA9IGl0ZXJhdGVlKG1lbW8sIG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBmaXJzdCB2YWx1ZSB3aGljaCBwYXNzZXMgYSB0cnV0aCB0ZXN0LiBBbGlhc2VkIGFzIGBkZXRlY3RgLlxuICBfLmZpbmQgPSBfLmRldGVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICBwcmVkaWNhdGUgPSBfLml0ZXJhdGVlKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgXy5zb21lKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgbGlzdCkpIHtcbiAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgc2VsZWN0YC5cbiAgXy5maWx0ZXIgPSBfLnNlbGVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiByZXN1bHRzO1xuICAgIHByZWRpY2F0ZSA9IF8uaXRlcmF0ZWUocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBsaXN0KSkgcmVzdWx0cy5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyBmb3Igd2hpY2ggYSB0cnV0aCB0ZXN0IGZhaWxzLlxuICBfLnJlamVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgXy5uZWdhdGUoXy5pdGVyYXRlZShwcmVkaWNhdGUpKSwgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgYWxsIG9mIHRoZSBlbGVtZW50cyBtYXRjaCBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYGFsbGAuXG4gIF8uZXZlcnkgPSBfLmFsbCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICBwcmVkaWNhdGUgPSBfLml0ZXJhdGVlKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSBvYmoubGVuZ3RoICE9PSArb2JqLmxlbmd0aCAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICAgIGluZGV4LCBjdXJyZW50S2V5O1xuICAgIGZvciAoaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgaWYgKCFwcmVkaWNhdGUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiBhdCBsZWFzdCBvbmUgZWxlbWVudCBpbiB0aGUgb2JqZWN0IG1hdGNoZXMgYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBhbnlgLlxuICBfLnNvbWUgPSBfLmFueSA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgcHJlZGljYXRlID0gXy5pdGVyYXRlZShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gb2JqLmxlbmd0aCAhPT0gK29iai5sZW5ndGggJiYgXy5rZXlzKG9iaiksXG4gICAgICAgIGxlbmd0aCA9IChrZXlzIHx8IG9iaikubGVuZ3RoLFxuICAgICAgICBpbmRleCwgY3VycmVudEtleTtcbiAgICBmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIGlmIChwcmVkaWNhdGUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiB0aGUgYXJyYXkgb3Igb2JqZWN0IGNvbnRhaW5zIGEgZ2l2ZW4gdmFsdWUgKHVzaW5nIGA9PT1gKS5cbiAgLy8gQWxpYXNlZCBhcyBgaW5jbHVkZWAuXG4gIF8uY29udGFpbnMgPSBfLmluY2x1ZGUgPSBmdW5jdGlvbihvYmosIHRhcmdldCkge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChvYmoubGVuZ3RoICE9PSArb2JqLmxlbmd0aCkgb2JqID0gXy52YWx1ZXMob2JqKTtcbiAgICByZXR1cm4gXy5pbmRleE9mKG9iaiwgdGFyZ2V0KSA+PSAwO1xuICB9O1xuXG4gIC8vIEludm9rZSBhIG1ldGhvZCAod2l0aCBhcmd1bWVudHMpIG9uIGV2ZXJ5IGl0ZW0gaW4gYSBjb2xsZWN0aW9uLlxuICBfLmludm9rZSA9IGZ1bmN0aW9uKG9iaiwgbWV0aG9kKSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGlzRnVuYyA9IF8uaXNGdW5jdGlvbihtZXRob2QpO1xuICAgIHJldHVybiBfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gKGlzRnVuYyA/IG1ldGhvZCA6IHZhbHVlW21ldGhvZF0pLmFwcGx5KHZhbHVlLCBhcmdzKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBtYXBgOiBmZXRjaGluZyBhIHByb3BlcnR5LlxuICBfLnBsdWNrID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBfLnByb3BlcnR5KGtleSkpO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbHRlcmA6IHNlbGVjdGluZyBvbmx5IG9iamVjdHNcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy53aGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBfLm1hdGNoZXMoYXR0cnMpKTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaW5kYDogZ2V0dGluZyB0aGUgZmlyc3Qgb2JqZWN0XG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8uZmluZFdoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLmZpbmQob2JqLCBfLm1hdGNoZXMoYXR0cnMpKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1heGltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIF8ubWF4ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSAtSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IC1JbmZpbml0eSxcbiAgICAgICAgdmFsdWUsIGNvbXB1dGVkO1xuICAgIGlmIChpdGVyYXRlZSA9PSBudWxsICYmIG9iaiAhPSBudWxsKSB7XG4gICAgICBvYmogPSBvYmoubGVuZ3RoID09PSArb2JqLmxlbmd0aCA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW2ldO1xuICAgICAgICBpZiAodmFsdWUgPiByZXN1bHQpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRlZSA9IF8uaXRlcmF0ZWUoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgICAgaWYgKGNvbXB1dGVkID4gbGFzdENvbXB1dGVkIHx8IGNvbXB1dGVkID09PSAtSW5maW5pdHkgJiYgcmVzdWx0ID09PSAtSW5maW5pdHkpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtaW5pbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1pbiA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0gSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IEluZmluaXR5LFxuICAgICAgICB2YWx1ZSwgY29tcHV0ZWQ7XG4gICAgaWYgKGl0ZXJhdGVlID09IG51bGwgJiYgb2JqICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbaV07XG4gICAgICAgIGlmICh2YWx1ZSA8IHJlc3VsdCkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZXJhdGVlID0gXy5pdGVyYXRlZShpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgICAgICBpZiAoY29tcHV0ZWQgPCBsYXN0Q29tcHV0ZWQgfHwgY29tcHV0ZWQgPT09IEluZmluaXR5ICYmIHJlc3VsdCA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gU2h1ZmZsZSBhIGNvbGxlY3Rpb24sIHVzaW5nIHRoZSBtb2Rlcm4gdmVyc2lvbiBvZiB0aGVcbiAgLy8gW0Zpc2hlci1ZYXRlcyBzaHVmZmxlXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Zpc2hlcuKAk1lhdGVzX3NodWZmbGUpLlxuICBfLnNodWZmbGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgc2V0ID0gb2JqICYmIG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0gc2V0Lmxlbmd0aDtcbiAgICB2YXIgc2h1ZmZsZWQgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMCwgcmFuZDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHJhbmQgPSBfLnJhbmRvbSgwLCBpbmRleCk7XG4gICAgICBpZiAocmFuZCAhPT0gaW5kZXgpIHNodWZmbGVkW2luZGV4XSA9IHNodWZmbGVkW3JhbmRdO1xuICAgICAgc2h1ZmZsZWRbcmFuZF0gPSBzZXRbaW5kZXhdO1xuICAgIH1cbiAgICByZXR1cm4gc2h1ZmZsZWQ7XG4gIH07XG5cbiAgLy8gU2FtcGxlICoqbioqIHJhbmRvbSB2YWx1ZXMgZnJvbSBhIGNvbGxlY3Rpb24uXG4gIC8vIElmICoqbioqIGlzIG5vdCBzcGVjaWZpZWQsIHJldHVybnMgYSBzaW5nbGUgcmFuZG9tIGVsZW1lbnQuXG4gIC8vIFRoZSBpbnRlcm5hbCBgZ3VhcmRgIGFyZ3VtZW50IGFsbG93cyBpdCB0byB3b3JrIHdpdGggYG1hcGAuXG4gIF8uc2FtcGxlID0gZnVuY3Rpb24ob2JqLCBuLCBndWFyZCkge1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHtcbiAgICAgIGlmIChvYmoubGVuZ3RoICE9PSArb2JqLmxlbmd0aCkgb2JqID0gXy52YWx1ZXMob2JqKTtcbiAgICAgIHJldHVybiBvYmpbXy5yYW5kb20ob2JqLmxlbmd0aCAtIDEpXTtcbiAgICB9XG4gICAgcmV0dXJuIF8uc2h1ZmZsZShvYmopLnNsaWNlKDAsIE1hdGgubWF4KDAsIG4pKTtcbiAgfTtcblxuICAvLyBTb3J0IHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24gcHJvZHVjZWQgYnkgYW4gaXRlcmF0ZWUuXG4gIF8uc29ydEJ5ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gXy5pdGVyYXRlZShpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgcmV0dXJuIF8ucGx1Y2soXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICBjcml0ZXJpYTogaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBsaXN0KVxuICAgICAgfTtcbiAgICB9KS5zb3J0KGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gICAgICB2YXIgYSA9IGxlZnQuY3JpdGVyaWE7XG4gICAgICB2YXIgYiA9IHJpZ2h0LmNyaXRlcmlhO1xuICAgICAgaWYgKGEgIT09IGIpIHtcbiAgICAgICAgaWYgKGEgPiBiIHx8IGEgPT09IHZvaWQgMCkgcmV0dXJuIDE7XG4gICAgICAgIGlmIChhIDwgYiB8fCBiID09PSB2b2lkIDApIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsZWZ0LmluZGV4IC0gcmlnaHQuaW5kZXg7XG4gICAgfSksICd2YWx1ZScpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIHVzZWQgZm9yIGFnZ3JlZ2F0ZSBcImdyb3VwIGJ5XCIgb3BlcmF0aW9ucy5cbiAgdmFyIGdyb3VwID0gZnVuY3Rpb24oYmVoYXZpb3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgICAgaXRlcmF0ZWUgPSBfLml0ZXJhdGVlKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICB2YXIga2V5ID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBvYmopO1xuICAgICAgICBiZWhhdmlvcihyZXN1bHQsIHZhbHVlLCBrZXkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuICAvLyB0byBncm91cCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNyaXRlcmlvbi5cbiAgXy5ncm91cEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgaWYgKF8uaGFzKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0ucHVzaCh2YWx1ZSk7IGVsc2UgcmVzdWx0W2tleV0gPSBbdmFsdWVdO1xuICB9KTtcblxuICAvLyBJbmRleGVzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24sIHNpbWlsYXIgdG8gYGdyb3VwQnlgLCBidXQgZm9yXG4gIC8vIHdoZW4geW91IGtub3cgdGhhdCB5b3VyIGluZGV4IHZhbHVlcyB3aWxsIGJlIHVuaXF1ZS5cbiAgXy5pbmRleEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgfSk7XG5cbiAgLy8gQ291bnRzIGluc3RhbmNlcyBvZiBhbiBvYmplY3QgdGhhdCBncm91cCBieSBhIGNlcnRhaW4gY3JpdGVyaW9uLiBQYXNzXG4gIC8vIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGUgdG8gY291bnQgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICAvLyBjcml0ZXJpb24uXG4gIF8uY291bnRCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIGlmIChfLmhhcyhyZXN1bHQsIGtleSkpIHJlc3VsdFtrZXldKys7IGVsc2UgcmVzdWx0W2tleV0gPSAxO1xuICB9KTtcblxuICAvLyBVc2UgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIHRvIGZpZ3VyZSBvdXQgdGhlIHNtYWxsZXN0IGluZGV4IGF0IHdoaWNoXG4gIC8vIGFuIG9iamVjdCBzaG91bGQgYmUgaW5zZXJ0ZWQgc28gYXMgdG8gbWFpbnRhaW4gb3JkZXIuIFVzZXMgYmluYXJ5IHNlYXJjaC5cbiAgXy5zb3J0ZWRJbmRleCA9IGZ1bmN0aW9uKGFycmF5LCBvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBfLml0ZXJhdGVlKGl0ZXJhdGVlLCBjb250ZXh0LCAxKTtcbiAgICB2YXIgdmFsdWUgPSBpdGVyYXRlZShvYmopO1xuICAgIHZhciBsb3cgPSAwLCBoaWdoID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICB2YXIgbWlkID0gbG93ICsgaGlnaCA+Pj4gMTtcbiAgICAgIGlmIChpdGVyYXRlZShhcnJheVttaWRdKSA8IHZhbHVlKSBsb3cgPSBtaWQgKyAxOyBlbHNlIGhpZ2ggPSBtaWQ7XG4gICAgfVxuICAgIHJldHVybiBsb3c7XG4gIH07XG5cbiAgLy8gU2FmZWx5IGNyZWF0ZSBhIHJlYWwsIGxpdmUgYXJyYXkgZnJvbSBhbnl0aGluZyBpdGVyYWJsZS5cbiAgXy50b0FycmF5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFvYmopIHJldHVybiBbXTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikpIHJldHVybiBzbGljZS5jYWxsKG9iaik7XG4gICAgaWYgKG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoKSByZXR1cm4gXy5tYXAob2JqLCBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gXy52YWx1ZXMob2JqKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiBhbiBvYmplY3QuXG4gIF8uc2l6ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIDA7XG4gICAgcmV0dXJuIG9iai5sZW5ndGggPT09ICtvYmoubGVuZ3RoID8gb2JqLmxlbmd0aCA6IF8ua2V5cyhvYmopLmxlbmd0aDtcbiAgfTtcblxuICAvLyBTcGxpdCBhIGNvbGxlY3Rpb24gaW50byB0d28gYXJyYXlzOiBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIHNhdGlzZnkgdGhlIGdpdmVuXG4gIC8vIHByZWRpY2F0ZSwgYW5kIG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgZG8gbm90IHNhdGlzZnkgdGhlIHByZWRpY2F0ZS5cbiAgXy5wYXJ0aXRpb24gPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IF8uaXRlcmF0ZWUocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIgcGFzcyA9IFtdLCBmYWlsID0gW107XG4gICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqKSB7XG4gICAgICAocHJlZGljYXRlKHZhbHVlLCBrZXksIG9iaikgPyBwYXNzIDogZmFpbCkucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFtwYXNzLCBmYWlsXTtcbiAgfTtcblxuICAvLyBBcnJheSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gR2V0IHRoZSBmaXJzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBmaXJzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYGhlYWRgIGFuZCBgdGFrZWAuIFRoZSAqKmd1YXJkKiogY2hlY2tcbiAgLy8gYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLmZpcnN0ID0gXy5oZWFkID0gXy50YWtlID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5WzBdO1xuICAgIGlmIChuIDwgMCkgcmV0dXJuIFtdO1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAwLCBuKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBsYXN0IGVudHJ5IG9mIHRoZSBhcnJheS4gRXNwZWNpYWxseSB1c2VmdWwgb25cbiAgLy8gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gYWxsIHRoZSB2YWx1ZXMgaW5cbiAgLy8gdGhlIGFycmF5LCBleGNsdWRpbmcgdGhlIGxhc3QgTi4gVGhlICoqZ3VhcmQqKiBjaGVjayBhbGxvd3MgaXQgdG8gd29yayB3aXRoXG4gIC8vIGBfLm1hcGAuXG4gIF8uaW5pdGlhbCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCAwLCBNYXRoLm1heCgwLCBhcnJheS5sZW5ndGggLSAobiA9PSBudWxsIHx8IGd1YXJkID8gMSA6IG4pKSk7XG4gIH07XG5cbiAgLy8gR2V0IHRoZSBsYXN0IGVsZW1lbnQgb2YgYW4gYXJyYXkuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gdGhlIGxhc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBUaGUgKipndWFyZCoqIGNoZWNrIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5sYXN0ID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCBNYXRoLm1heChhcnJheS5sZW5ndGggLSBuLCAwKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgZmlyc3QgZW50cnkgb2YgdGhlIGFycmF5LiBBbGlhc2VkIGFzIGB0YWlsYCBhbmQgYGRyb3BgLlxuICAvLyBFc3BlY2lhbGx5IHVzZWZ1bCBvbiB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyBhbiAqKm4qKiB3aWxsIHJldHVyblxuICAvLyB0aGUgcmVzdCBOIHZhbHVlcyBpbiB0aGUgYXJyYXkuIFRoZSAqKmd1YXJkKipcbiAgLy8gY2hlY2sgYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLnJlc3QgPSBfLnRhaWwgPSBfLmRyb3AgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgbiA9PSBudWxsIHx8IGd1YXJkID8gMSA6IG4pO1xuICB9O1xuXG4gIC8vIFRyaW0gb3V0IGFsbCBmYWxzeSB2YWx1ZXMgZnJvbSBhbiBhcnJheS5cbiAgXy5jb21wYWN0ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIoYXJyYXksIF8uaWRlbnRpdHkpO1xuICB9O1xuXG4gIC8vIEludGVybmFsIGltcGxlbWVudGF0aW9uIG9mIGEgcmVjdXJzaXZlIGBmbGF0dGVuYCBmdW5jdGlvbi5cbiAgdmFyIGZsYXR0ZW4gPSBmdW5jdGlvbihpbnB1dCwgc2hhbGxvdywgc3RyaWN0LCBvdXRwdXQpIHtcbiAgICBpZiAoc2hhbGxvdyAmJiBfLmV2ZXJ5KGlucHV0LCBfLmlzQXJyYXkpKSB7XG4gICAgICByZXR1cm4gY29uY2F0LmFwcGx5KG91dHB1dCwgaW5wdXQpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gaW5wdXQubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IGlucHV0W2ldO1xuICAgICAgaWYgKCFfLmlzQXJyYXkodmFsdWUpICYmICFfLmlzQXJndW1lbnRzKHZhbHVlKSkge1xuICAgICAgICBpZiAoIXN0cmljdCkgb3V0cHV0LnB1c2godmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChzaGFsbG93KSB7XG4gICAgICAgIHB1c2guYXBwbHkob3V0cHV0LCB2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmbGF0dGVuKHZhbHVlLCBzaGFsbG93LCBzdHJpY3QsIG91dHB1dCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgLy8gRmxhdHRlbiBvdXQgYW4gYXJyYXksIGVpdGhlciByZWN1cnNpdmVseSAoYnkgZGVmYXVsdCksIG9yIGp1c3Qgb25lIGxldmVsLlxuICBfLmZsYXR0ZW4gPSBmdW5jdGlvbihhcnJheSwgc2hhbGxvdykge1xuICAgIHJldHVybiBmbGF0dGVuKGFycmF5LCBzaGFsbG93LCBmYWxzZSwgW10pO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHZlcnNpb24gb2YgdGhlIGFycmF5IHRoYXQgZG9lcyBub3QgY29udGFpbiB0aGUgc3BlY2lmaWVkIHZhbHVlKHMpLlxuICBfLndpdGhvdXQgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmRpZmZlcmVuY2UoYXJyYXksIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhIGR1cGxpY2F0ZS1mcmVlIHZlcnNpb24gb2YgdGhlIGFycmF5LiBJZiB0aGUgYXJyYXkgaGFzIGFscmVhZHlcbiAgLy8gYmVlbiBzb3J0ZWQsIHlvdSBoYXZlIHRoZSBvcHRpb24gb2YgdXNpbmcgYSBmYXN0ZXIgYWxnb3JpdGhtLlxuICAvLyBBbGlhc2VkIGFzIGB1bmlxdWVgLlxuICBfLnVuaXEgPSBfLnVuaXF1ZSA9IGZ1bmN0aW9uKGFycmF5LCBpc1NvcnRlZCwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIFtdO1xuICAgIGlmICghXy5pc0Jvb2xlYW4oaXNTb3J0ZWQpKSB7XG4gICAgICBjb250ZXh0ID0gaXRlcmF0ZWU7XG4gICAgICBpdGVyYXRlZSA9IGlzU29ydGVkO1xuICAgICAgaXNTb3J0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGl0ZXJhdGVlICE9IG51bGwpIGl0ZXJhdGVlID0gXy5pdGVyYXRlZShpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBzZWVuID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhcnJheVtpXTtcbiAgICAgIGlmIChpc1NvcnRlZCkge1xuICAgICAgICBpZiAoIWkgfHwgc2VlbiAhPT0gdmFsdWUpIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgc2VlbiA9IHZhbHVlO1xuICAgICAgfSBlbHNlIGlmIChpdGVyYXRlZSkge1xuICAgICAgICB2YXIgY29tcHV0ZWQgPSBpdGVyYXRlZSh2YWx1ZSwgaSwgYXJyYXkpO1xuICAgICAgICBpZiAoXy5pbmRleE9mKHNlZW4sIGNvbXB1dGVkKSA8IDApIHtcbiAgICAgICAgICBzZWVuLnB1c2goY29tcHV0ZWQpO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChfLmluZGV4T2YocmVzdWx0LCB2YWx1ZSkgPCAwKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgdGhlIHVuaW9uOiBlYWNoIGRpc3RpbmN0IGVsZW1lbnQgZnJvbSBhbGwgb2ZcbiAgLy8gdGhlIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8udW5pb24gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXy51bmlxKGZsYXR0ZW4oYXJndW1lbnRzLCB0cnVlLCB0cnVlLCBbXSkpO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyBldmVyeSBpdGVtIHNoYXJlZCBiZXR3ZWVuIGFsbCB0aGVcbiAgLy8gcGFzc2VkLWluIGFycmF5cy5cbiAgXy5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihhcnJheSkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gW107XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBhcmdzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gYXJyYXlbaV07XG4gICAgICBpZiAoXy5jb250YWlucyhyZXN1bHQsIGl0ZW0pKSBjb250aW51ZTtcbiAgICAgIGZvciAodmFyIGogPSAxOyBqIDwgYXJnc0xlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmICghXy5jb250YWlucyhhcmd1bWVudHNbal0sIGl0ZW0pKSBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChqID09PSBhcmdzTGVuZ3RoKSByZXN1bHQucHVzaChpdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBUYWtlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gb25lIGFycmF5IGFuZCBhIG51bWJlciBvZiBvdGhlciBhcnJheXMuXG4gIC8vIE9ubHkgdGhlIGVsZW1lbnRzIHByZXNlbnQgaW4ganVzdCB0aGUgZmlyc3QgYXJyYXkgd2lsbCByZW1haW4uXG4gIF8uZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBmbGF0dGVuKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgdHJ1ZSwgdHJ1ZSwgW10pO1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgZnVuY3Rpb24odmFsdWUpe1xuICAgICAgcmV0dXJuICFfLmNvbnRhaW5zKHJlc3QsIHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBaaXAgdG9nZXRoZXIgbXVsdGlwbGUgbGlzdHMgaW50byBhIHNpbmdsZSBhcnJheSAtLSBlbGVtZW50cyB0aGF0IHNoYXJlXG4gIC8vIGFuIGluZGV4IGdvIHRvZ2V0aGVyLlxuICBfLnppcCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiBbXTtcbiAgICB2YXIgbGVuZ3RoID0gXy5tYXgoYXJndW1lbnRzLCAnbGVuZ3RoJykubGVuZ3RoO1xuICAgIHZhciByZXN1bHRzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRzW2ldID0gXy5wbHVjayhhcmd1bWVudHMsIGkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDb252ZXJ0cyBsaXN0cyBpbnRvIG9iamVjdHMuIFBhc3MgZWl0aGVyIGEgc2luZ2xlIGFycmF5IG9mIGBba2V5LCB2YWx1ZV1gXG4gIC8vIHBhaXJzLCBvciB0d28gcGFyYWxsZWwgYXJyYXlzIG9mIHRoZSBzYW1lIGxlbmd0aCAtLSBvbmUgb2Yga2V5cywgYW5kIG9uZSBvZlxuICAvLyB0aGUgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gIF8ub2JqZWN0ID0gZnVuY3Rpb24obGlzdCwgdmFsdWVzKSB7XG4gICAgaWYgKGxpc3QgPT0gbnVsbCkgcmV0dXJuIHt9O1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gbGlzdC5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICByZXN1bHRbbGlzdFtpXV0gPSB2YWx1ZXNbaV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRbbGlzdFtpXVswXV0gPSBsaXN0W2ldWzFdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYW4gaXRlbSBpbiBhbiBhcnJheSxcbiAgLy8gb3IgLTEgaWYgdGhlIGl0ZW0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBhcnJheS5cbiAgLy8gSWYgdGhlIGFycmF5IGlzIGxhcmdlIGFuZCBhbHJlYWR5IGluIHNvcnQgb3JkZXIsIHBhc3MgYHRydWVgXG4gIC8vIGZvciAqKmlzU29ydGVkKiogdG8gdXNlIGJpbmFyeSBzZWFyY2guXG4gIF8uaW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBpc1NvcnRlZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gLTE7XG4gICAgdmFyIGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gICAgaWYgKGlzU29ydGVkKSB7XG4gICAgICBpZiAodHlwZW9mIGlzU29ydGVkID09ICdudW1iZXInKSB7XG4gICAgICAgIGkgPSBpc1NvcnRlZCA8IDAgPyBNYXRoLm1heCgwLCBsZW5ndGggKyBpc1NvcnRlZCkgOiBpc1NvcnRlZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGkgPSBfLnNvcnRlZEluZGV4KGFycmF5LCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIGFycmF5W2ldID09PSBpdGVtID8gaSA6IC0xO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICBfLmxhc3RJbmRleE9mID0gZnVuY3Rpb24oYXJyYXksIGl0ZW0sIGZyb20pIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIC0xO1xuICAgIHZhciBpZHggPSBhcnJheS5sZW5ndGg7XG4gICAgaWYgKHR5cGVvZiBmcm9tID09ICdudW1iZXInKSB7XG4gICAgICBpZHggPSBmcm9tIDwgMCA/IGlkeCArIGZyb20gKyAxIDogTWF0aC5taW4oaWR4LCBmcm9tICsgMSk7XG4gICAgfVxuICAgIHdoaWxlICgtLWlkeCA+PSAwKSBpZiAoYXJyYXlbaWR4XSA9PT0gaXRlbSkgcmV0dXJuIGlkeDtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYW4gaW50ZWdlciBBcnJheSBjb250YWluaW5nIGFuIGFyaXRobWV0aWMgcHJvZ3Jlc3Npb24uIEEgcG9ydCBvZlxuICAvLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuICAvLyBbdGhlIFB5dGhvbiBkb2N1bWVudGF0aW9uXShodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvZnVuY3Rpb25zLmh0bWwjcmFuZ2UpLlxuICBfLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8PSAxKSB7XG4gICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgc3RlcCA9IHN0ZXAgfHwgMTtcblxuICAgIHZhciBsZW5ndGggPSBNYXRoLm1heChNYXRoLmNlaWwoKHN0b3AgLSBzdGFydCkgLyBzdGVwKSwgMCk7XG4gICAgdmFyIHJhbmdlID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGxlbmd0aDsgaWR4KyssIHN0YXJ0ICs9IHN0ZXApIHtcbiAgICAgIHJhbmdlW2lkeF0gPSBzdGFydDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmFuZ2U7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gKGFoZW0pIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBSZXVzYWJsZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiBmb3IgcHJvdG90eXBlIHNldHRpbmcuXG4gIHZhciBDdG9yID0gZnVuY3Rpb24oKXt9O1xuXG4gIC8vIENyZWF0ZSBhIGZ1bmN0aW9uIGJvdW5kIHRvIGEgZ2l2ZW4gb2JqZWN0IChhc3NpZ25pbmcgYHRoaXNgLCBhbmQgYXJndW1lbnRzLFxuICAvLyBvcHRpb25hbGx5KS4gRGVsZWdhdGVzIHRvICoqRUNNQVNjcmlwdCA1KioncyBuYXRpdmUgYEZ1bmN0aW9uLmJpbmRgIGlmXG4gIC8vIGF2YWlsYWJsZS5cbiAgXy5iaW5kID0gZnVuY3Rpb24oZnVuYywgY29udGV4dCkge1xuICAgIHZhciBhcmdzLCBib3VuZDtcbiAgICBpZiAobmF0aXZlQmluZCAmJiBmdW5jLmJpbmQgPT09IG5hdGl2ZUJpbmQpIHJldHVybiBuYXRpdmVCaW5kLmFwcGx5KGZ1bmMsIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgaWYgKCFfLmlzRnVuY3Rpb24oZnVuYykpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JpbmQgbXVzdCBiZSBjYWxsZWQgb24gYSBmdW5jdGlvbicpO1xuICAgIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgYm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBib3VuZCkpIHJldHVybiBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgQ3Rvci5wcm90b3R5cGUgPSBmdW5jLnByb3RvdHlwZTtcbiAgICAgIHZhciBzZWxmID0gbmV3IEN0b3I7XG4gICAgICBDdG9yLnByb3RvdHlwZSA9IG51bGw7XG4gICAgICB2YXIgcmVzdWx0ID0gZnVuYy5hcHBseShzZWxmLCBhcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgIGlmIChfLmlzT2JqZWN0KHJlc3VsdCkpIHJldHVybiByZXN1bHQ7XG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9O1xuICAgIHJldHVybiBib3VuZDtcbiAgfTtcblxuICAvLyBQYXJ0aWFsbHkgYXBwbHkgYSBmdW5jdGlvbiBieSBjcmVhdGluZyBhIHZlcnNpb24gdGhhdCBoYXMgaGFkIHNvbWUgb2YgaXRzXG4gIC8vIGFyZ3VtZW50cyBwcmUtZmlsbGVkLCB3aXRob3V0IGNoYW5naW5nIGl0cyBkeW5hbWljIGB0aGlzYCBjb250ZXh0LiBfIGFjdHNcbiAgLy8gYXMgYSBwbGFjZWhvbGRlciwgYWxsb3dpbmcgYW55IGNvbWJpbmF0aW9uIG9mIGFyZ3VtZW50cyB0byBiZSBwcmUtZmlsbGVkLlxuICBfLnBhcnRpYWwgPSBmdW5jdGlvbihmdW5jKSB7XG4gICAgdmFyIGJvdW5kQXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcG9zaXRpb24gPSAwO1xuICAgICAgdmFyIGFyZ3MgPSBib3VuZEFyZ3Muc2xpY2UoKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBhcmdzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhcmdzW2ldID09PSBfKSBhcmdzW2ldID0gYXJndW1lbnRzW3Bvc2l0aW9uKytdO1xuICAgICAgfVxuICAgICAgd2hpbGUgKHBvc2l0aW9uIDwgYXJndW1lbnRzLmxlbmd0aCkgYXJncy5wdXNoKGFyZ3VtZW50c1twb3NpdGlvbisrXSk7XG4gICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEJpbmQgYSBudW1iZXIgb2YgYW4gb2JqZWN0J3MgbWV0aG9kcyB0byB0aGF0IG9iamVjdC4gUmVtYWluaW5nIGFyZ3VtZW50c1xuICAvLyBhcmUgdGhlIG1ldGhvZCBuYW1lcyB0byBiZSBib3VuZC4gVXNlZnVsIGZvciBlbnN1cmluZyB0aGF0IGFsbCBjYWxsYmFja3NcbiAgLy8gZGVmaW5lZCBvbiBhbiBvYmplY3QgYmVsb25nIHRvIGl0LlxuICBfLmJpbmRBbGwgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgaSwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCwga2V5O1xuICAgIGlmIChsZW5ndGggPD0gMSkgdGhyb3cgbmV3IEVycm9yKCdiaW5kQWxsIG11c3QgYmUgcGFzc2VkIGZ1bmN0aW9uIG5hbWVzJyk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBrZXkgPSBhcmd1bWVudHNbaV07XG4gICAgICBvYmpba2V5XSA9IF8uYmluZChvYmpba2V5XSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBNZW1vaXplIGFuIGV4cGVuc2l2ZSBmdW5jdGlvbiBieSBzdG9yaW5nIGl0cyByZXN1bHRzLlxuICBfLm1lbW9pemUgPSBmdW5jdGlvbihmdW5jLCBoYXNoZXIpIHtcbiAgICB2YXIgbWVtb2l6ZSA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIGNhY2hlID0gbWVtb2l6ZS5jYWNoZTtcbiAgICAgIHZhciBhZGRyZXNzID0gaGFzaGVyID8gaGFzaGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgOiBrZXk7XG4gICAgICBpZiAoIV8uaGFzKGNhY2hlLCBhZGRyZXNzKSkgY2FjaGVbYWRkcmVzc10gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gY2FjaGVbYWRkcmVzc107XG4gICAgfTtcbiAgICBtZW1vaXplLmNhY2hlID0ge307XG4gICAgcmV0dXJuIG1lbW9pemU7XG4gIH07XG5cbiAgLy8gRGVsYXlzIGEgZnVuY3Rpb24gZm9yIHRoZSBnaXZlbiBudW1iZXIgb2YgbWlsbGlzZWNvbmRzLCBhbmQgdGhlbiBjYWxsc1xuICAvLyBpdCB3aXRoIHRoZSBhcmd1bWVudHMgc3VwcGxpZWQuXG4gIF8uZGVsYXkgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH0sIHdhaXQpO1xuICB9O1xuXG4gIC8vIERlZmVycyBhIGZ1bmN0aW9uLCBzY2hlZHVsaW5nIGl0IHRvIHJ1biBhZnRlciB0aGUgY3VycmVudCBjYWxsIHN0YWNrIGhhc1xuICAvLyBjbGVhcmVkLlxuICBfLmRlZmVyID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHJldHVybiBfLmRlbGF5LmFwcGx5KF8sIFtmdW5jLCAxXS5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gIC8vIGJ1dCBpZiB5b3UnZCBsaWtlIHRvIGRpc2FibGUgdGhlIGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlLCBwYXNzXG4gIC8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICBfLnRocm90dGxlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgIHZhciBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gICAgdmFyIHRpbWVvdXQgPSBudWxsO1xuICAgIHZhciBwcmV2aW91cyA9IDA7XG4gICAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge307XG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogXy5ub3coKTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG5vdyA9IF8ubm93KCk7XG4gICAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpIHByZXZpb3VzID0gbm93O1xuICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gIC8vIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3JcbiAgLy8gTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4gIC8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gIF8uZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHQ7XG5cbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsYXN0ID0gXy5ub3coKSAtIHRpbWVzdGFtcDtcblxuICAgICAgaWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPiAwKSB7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0IC0gbGFzdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgaWYgKCFpbW1lZGlhdGUpIHtcbiAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIHRpbWVzdGFtcCA9IF8ubm93KCk7XG4gICAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgIGlmICghdGltZW91dCkgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgaWYgKGNhbGxOb3cpIHtcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgZnVuY3Rpb24gcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSBzZWNvbmQsXG4gIC8vIGFsbG93aW5nIHlvdSB0byBhZGp1c3QgYXJndW1lbnRzLCBydW4gY29kZSBiZWZvcmUgYW5kIGFmdGVyLCBhbmRcbiAgLy8gY29uZGl0aW9uYWxseSBleGVjdXRlIHRoZSBvcmlnaW5hbCBmdW5jdGlvbi5cbiAgXy53cmFwID0gZnVuY3Rpb24oZnVuYywgd3JhcHBlcikge1xuICAgIHJldHVybiBfLnBhcnRpYWwod3JhcHBlciwgZnVuYyk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIG5lZ2F0ZWQgdmVyc2lvbiBvZiB0aGUgcGFzc2VkLWluIHByZWRpY2F0ZS5cbiAgXy5uZWdhdGUgPSBmdW5jdGlvbihwcmVkaWNhdGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gIXByZWRpY2F0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgaXMgdGhlIGNvbXBvc2l0aW9uIG9mIGEgbGlzdCBvZiBmdW5jdGlvbnMsIGVhY2hcbiAgLy8gY29uc3VtaW5nIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZ1bmN0aW9uIHRoYXQgZm9sbG93cy5cbiAgXy5jb21wb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgdmFyIHN0YXJ0ID0gYXJncy5sZW5ndGggLSAxO1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpID0gc3RhcnQ7XG4gICAgICB2YXIgcmVzdWx0ID0gYXJnc1tzdGFydF0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHdoaWxlIChpLS0pIHJlc3VsdCA9IGFyZ3NbaV0uY2FsbCh0aGlzLCByZXN1bHQpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgb25seSBiZSBleGVjdXRlZCBhZnRlciBiZWluZyBjYWxsZWQgTiB0aW1lcy5cbiAgXy5hZnRlciA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPCAxKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgYmVmb3JlIGJlaW5nIGNhbGxlZCBOIHRpbWVzLlxuICBfLmJlZm9yZSA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgdmFyIG1lbW87XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPiAwKSB7XG4gICAgICAgIG1lbW8gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmdW5jID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhdCBtb3N0IG9uZSB0aW1lLCBubyBtYXR0ZXIgaG93XG4gIC8vIG9mdGVuIHlvdSBjYWxsIGl0LiBVc2VmdWwgZm9yIGxhenkgaW5pdGlhbGl6YXRpb24uXG4gIF8ub25jZSA9IF8ucGFydGlhbChfLmJlZm9yZSwgMik7XG5cbiAgLy8gT2JqZWN0IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUmV0cmlldmUgdGhlIG5hbWVzIG9mIGFuIG9iamVjdCdzIHByb3BlcnRpZXMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBPYmplY3Qua2V5c2BcbiAgXy5rZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICBpZiAobmF0aXZlS2V5cykgcmV0dXJuIG5hdGl2ZUtleXMob2JqKTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIHRoZSB2YWx1ZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgXy52YWx1ZXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgdmFsdWVzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWx1ZXNbaV0gPSBvYmpba2V5c1tpXV07XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH07XG5cbiAgLy8gQ29udmVydCBhbiBvYmplY3QgaW50byBhIGxpc3Qgb2YgYFtrZXksIHZhbHVlXWAgcGFpcnMuXG4gIF8ucGFpcnMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgcGFpcnMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhaXJzW2ldID0gW2tleXNbaV0sIG9ialtrZXlzW2ldXV07XG4gICAgfVxuICAgIHJldHVybiBwYWlycztcbiAgfTtcblxuICAvLyBJbnZlcnQgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiBhbiBvYmplY3QuIFRoZSB2YWx1ZXMgbXVzdCBiZSBzZXJpYWxpemFibGUuXG4gIF8uaW52ZXJ0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdFtvYmpba2V5c1tpXV1dID0ga2V5c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBzb3J0ZWQgbGlzdCBvZiB0aGUgZnVuY3Rpb24gbmFtZXMgYXZhaWxhYmxlIG9uIHRoZSBvYmplY3QuXG4gIC8vIEFsaWFzZWQgYXMgYG1ldGhvZHNgXG4gIF8uZnVuY3Rpb25zID0gXy5tZXRob2RzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIG5hbWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihvYmpba2V5XSkpIG5hbWVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKTtcbiAgfTtcblxuICAvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbiAgXy5leHRlbmQgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgICB2YXIgc291cmNlLCBwcm9wO1xuICAgIGZvciAodmFyIGkgPSAxLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIGZvciAocHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBwcm9wKSkge1xuICAgICAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IG9ubHkgY29udGFpbmluZyB0aGUgd2hpdGVsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5waWNrID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSB7fSwga2V5O1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGl0ZXJhdGVlKSkge1xuICAgICAgaXRlcmF0ZWUgPSBjcmVhdGVDYWxsYmFjayhpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgICAgdmFyIHZhbHVlID0gb2JqW2tleV07XG4gICAgICAgIGlmIChpdGVyYXRlZSh2YWx1ZSwga2V5LCBvYmopKSByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIga2V5cyA9IGNvbmNhdC5hcHBseShbXSwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICAgIG9iaiA9IG5ldyBPYmplY3Qob2JqKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICAgIGlmIChrZXkgaW4gb2JqKSByZXN1bHRba2V5XSA9IG9ialtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgd2l0aG91dCB0aGUgYmxhY2tsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5vbWl0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGlmIChfLmlzRnVuY3Rpb24oaXRlcmF0ZWUpKSB7XG4gICAgICBpdGVyYXRlZSA9IF8ubmVnYXRlKGl0ZXJhdGVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBfLm1hcChjb25jYXQuYXBwbHkoW10sIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSksIFN0cmluZyk7XG4gICAgICBpdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgcmV0dXJuICFfLmNvbnRhaW5zKGtleXMsIGtleSk7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gXy5waWNrKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIEZpbGwgaW4gYSBnaXZlbiBvYmplY3Qgd2l0aCBkZWZhdWx0IHByb3BlcnRpZXMuXG4gIF8uZGVmYXVsdHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgICBmb3IgKHZhciBpID0gMSwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKG9ialtwcm9wXSA9PT0gdm9pZCAwKSBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgKHNoYWxsb3ctY2xvbmVkKSBkdXBsaWNhdGUgb2YgYW4gb2JqZWN0LlxuICBfLmNsb25lID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gICAgcmV0dXJuIF8uaXNBcnJheShvYmopID8gb2JqLnNsaWNlKCkgOiBfLmV4dGVuZCh7fSwgb2JqKTtcbiAgfTtcblxuICAvLyBJbnZva2VzIGludGVyY2VwdG9yIHdpdGggdGhlIG9iaiwgYW5kIHRoZW4gcmV0dXJucyBvYmouXG4gIC8vIFRoZSBwcmltYXJ5IHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gXCJ0YXAgaW50b1wiIGEgbWV0aG9kIGNoYWluLCBpblxuICAvLyBvcmRlciB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gaW50ZXJtZWRpYXRlIHJlc3VsdHMgd2l0aGluIHRoZSBjaGFpbi5cbiAgXy50YXAgPSBmdW5jdGlvbihvYmosIGludGVyY2VwdG9yKSB7XG4gICAgaW50ZXJjZXB0b3Iob2JqKTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIEludGVybmFsIHJlY3Vyc2l2ZSBjb21wYXJpc29uIGZ1bmN0aW9uIGZvciBgaXNFcXVhbGAuXG4gIHZhciBlcSA9IGZ1bmN0aW9uKGEsIGIsIGFTdGFjaywgYlN0YWNrKSB7XG4gICAgLy8gSWRlbnRpY2FsIG9iamVjdHMgYXJlIGVxdWFsLiBgMCA9PT0gLTBgLCBidXQgdGhleSBhcmVuJ3QgaWRlbnRpY2FsLlxuICAgIC8vIFNlZSB0aGUgW0hhcm1vbnkgYGVnYWxgIHByb3Bvc2FsXShodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1oYXJtb255OmVnYWwpLlxuICAgIGlmIChhID09PSBiKSByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PT0gMSAvIGI7XG4gICAgLy8gQSBzdHJpY3QgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkgYmVjYXVzZSBgbnVsbCA9PSB1bmRlZmluZWRgLlxuICAgIGlmIChhID09IG51bGwgfHwgYiA9PSBudWxsKSByZXR1cm4gYSA9PT0gYjtcbiAgICAvLyBVbndyYXAgYW55IHdyYXBwZWQgb2JqZWN0cy5cbiAgICBpZiAoYSBpbnN0YW5jZW9mIF8pIGEgPSBhLl93cmFwcGVkO1xuICAgIGlmIChiIGluc3RhbmNlb2YgXykgYiA9IGIuX3dyYXBwZWQ7XG4gICAgLy8gQ29tcGFyZSBgW1tDbGFzc11dYCBuYW1lcy5cbiAgICB2YXIgY2xhc3NOYW1lID0gdG9TdHJpbmcuY2FsbChhKTtcbiAgICBpZiAoY2xhc3NOYW1lICE9PSB0b1N0cmluZy5jYWxsKGIpKSByZXR1cm4gZmFsc2U7XG4gICAgc3dpdGNoIChjbGFzc05hbWUpIHtcbiAgICAgIC8vIFN0cmluZ3MsIG51bWJlcnMsIHJlZ3VsYXIgZXhwcmVzc2lvbnMsIGRhdGVzLCBhbmQgYm9vbGVhbnMgYXJlIGNvbXBhcmVkIGJ5IHZhbHVlLlxuICAgICAgY2FzZSAnW29iamVjdCBSZWdFeHBdJzpcbiAgICAgIC8vIFJlZ0V4cHMgYXJlIGNvZXJjZWQgdG8gc3RyaW5ncyBmb3IgY29tcGFyaXNvbiAoTm90ZTogJycgKyAvYS9pID09PSAnL2EvaScpXG4gICAgICBjYXNlICdbb2JqZWN0IFN0cmluZ10nOlxuICAgICAgICAvLyBQcmltaXRpdmVzIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIG9iamVjdCB3cmFwcGVycyBhcmUgZXF1aXZhbGVudDsgdGh1cywgYFwiNVwiYCBpc1xuICAgICAgICAvLyBlcXVpdmFsZW50IHRvIGBuZXcgU3RyaW5nKFwiNVwiKWAuXG4gICAgICAgIHJldHVybiAnJyArIGEgPT09ICcnICsgYjtcbiAgICAgIGNhc2UgJ1tvYmplY3QgTnVtYmVyXSc6XG4gICAgICAgIC8vIGBOYU5gcyBhcmUgZXF1aXZhbGVudCwgYnV0IG5vbi1yZWZsZXhpdmUuXG4gICAgICAgIC8vIE9iamVjdChOYU4pIGlzIGVxdWl2YWxlbnQgdG8gTmFOXG4gICAgICAgIGlmICgrYSAhPT0gK2EpIHJldHVybiArYiAhPT0gK2I7XG4gICAgICAgIC8vIEFuIGBlZ2FsYCBjb21wYXJpc29uIGlzIHBlcmZvcm1lZCBmb3Igb3RoZXIgbnVtZXJpYyB2YWx1ZXMuXG4gICAgICAgIHJldHVybiArYSA9PT0gMCA/IDEgLyArYSA9PT0gMSAvIGIgOiArYSA9PT0gK2I7XG4gICAgICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICAgIGNhc2UgJ1tvYmplY3QgQm9vbGVhbl0nOlxuICAgICAgICAvLyBDb2VyY2UgZGF0ZXMgYW5kIGJvb2xlYW5zIHRvIG51bWVyaWMgcHJpbWl0aXZlIHZhbHVlcy4gRGF0ZXMgYXJlIGNvbXBhcmVkIGJ5IHRoZWlyXG4gICAgICAgIC8vIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9ucy4gTm90ZSB0aGF0IGludmFsaWQgZGF0ZXMgd2l0aCBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnNcbiAgICAgICAgLy8gb2YgYE5hTmAgYXJlIG5vdCBlcXVpdmFsZW50LlxuICAgICAgICByZXR1cm4gK2EgPT09ICtiO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGEgIT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgIT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcbiAgICAvLyBBc3N1bWUgZXF1YWxpdHkgZm9yIGN5Y2xpYyBzdHJ1Y3R1cmVzLiBUaGUgYWxnb3JpdGhtIGZvciBkZXRlY3RpbmcgY3ljbGljXG4gICAgLy8gc3RydWN0dXJlcyBpcyBhZGFwdGVkIGZyb20gRVMgNS4xIHNlY3Rpb24gMTUuMTIuMywgYWJzdHJhY3Qgb3BlcmF0aW9uIGBKT2AuXG4gICAgdmFyIGxlbmd0aCA9IGFTdGFjay5sZW5ndGg7XG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAvLyBMaW5lYXIgc2VhcmNoLiBQZXJmb3JtYW5jZSBpcyBpbnZlcnNlbHkgcHJvcG9ydGlvbmFsIHRvIHRoZSBudW1iZXIgb2ZcbiAgICAgIC8vIHVuaXF1ZSBuZXN0ZWQgc3RydWN0dXJlcy5cbiAgICAgIGlmIChhU3RhY2tbbGVuZ3RoXSA9PT0gYSkgcmV0dXJuIGJTdGFja1tsZW5ndGhdID09PSBiO1xuICAgIH1cbiAgICAvLyBPYmplY3RzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWl2YWxlbnQsIGJ1dCBgT2JqZWN0YHNcbiAgICAvLyBmcm9tIGRpZmZlcmVudCBmcmFtZXMgYXJlLlxuICAgIHZhciBhQ3RvciA9IGEuY29uc3RydWN0b3IsIGJDdG9yID0gYi5jb25zdHJ1Y3RvcjtcbiAgICBpZiAoXG4gICAgICBhQ3RvciAhPT0gYkN0b3IgJiZcbiAgICAgIC8vIEhhbmRsZSBPYmplY3QuY3JlYXRlKHgpIGNhc2VzXG4gICAgICAnY29uc3RydWN0b3InIGluIGEgJiYgJ2NvbnN0cnVjdG9yJyBpbiBiICYmXG4gICAgICAhKF8uaXNGdW5jdGlvbihhQ3RvcikgJiYgYUN0b3IgaW5zdGFuY2VvZiBhQ3RvciAmJlxuICAgICAgICBfLmlzRnVuY3Rpb24oYkN0b3IpICYmIGJDdG9yIGluc3RhbmNlb2YgYkN0b3IpXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIEFkZCB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucHVzaChhKTtcbiAgICBiU3RhY2sucHVzaChiKTtcbiAgICB2YXIgc2l6ZSwgcmVzdWx0O1xuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyBhbmQgYXJyYXlzLlxuICAgIGlmIChjbGFzc05hbWUgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgIC8vIENvbXBhcmUgYXJyYXkgbGVuZ3RocyB0byBkZXRlcm1pbmUgaWYgYSBkZWVwIGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5LlxuICAgICAgc2l6ZSA9IGEubGVuZ3RoO1xuICAgICAgcmVzdWx0ID0gc2l6ZSA9PT0gYi5sZW5ndGg7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIC8vIERlZXAgY29tcGFyZSB0aGUgY29udGVudHMsIGlnbm9yaW5nIG5vbi1udW1lcmljIHByb3BlcnRpZXMuXG4gICAgICAgIHdoaWxlIChzaXplLS0pIHtcbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSBlcShhW3NpemVdLCBiW3NpemVdLCBhU3RhY2ssIGJTdGFjaykpKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgb2JqZWN0cy5cbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKGEpLCBrZXk7XG4gICAgICBzaXplID0ga2V5cy5sZW5ndGg7XG4gICAgICAvLyBFbnN1cmUgdGhhdCBib3RoIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBudW1iZXIgb2YgcHJvcGVydGllcyBiZWZvcmUgY29tcGFyaW5nIGRlZXAgZXF1YWxpdHkuXG4gICAgICByZXN1bHQgPSBfLmtleXMoYikubGVuZ3RoID09PSBzaXplO1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICB3aGlsZSAoc2l6ZS0tKSB7XG4gICAgICAgICAgLy8gRGVlcCBjb21wYXJlIGVhY2ggbWVtYmVyXG4gICAgICAgICAga2V5ID0ga2V5c1tzaXplXTtcbiAgICAgICAgICBpZiAoIShyZXN1bHQgPSBfLmhhcyhiLCBrZXkpICYmIGVxKGFba2V5XSwgYltrZXldLCBhU3RhY2ssIGJTdGFjaykpKSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBSZW1vdmUgdGhlIGZpcnN0IG9iamVjdCBmcm9tIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucG9wKCk7XG4gICAgYlN0YWNrLnBvcCgpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUGVyZm9ybSBhIGRlZXAgY29tcGFyaXNvbiB0byBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgZXF1YWwuXG4gIF8uaXNFcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gZXEoYSwgYiwgW10sIFtdKTtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIGFycmF5LCBzdHJpbmcsIG9yIG9iamVjdCBlbXB0eT9cbiAgLy8gQW4gXCJlbXB0eVwiIG9iamVjdCBoYXMgbm8gZW51bWVyYWJsZSBvd24tcHJvcGVydGllcy5cbiAgXy5pc0VtcHR5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoXy5pc0FycmF5KG9iaikgfHwgXy5pc1N0cmluZyhvYmopIHx8IF8uaXNBcmd1bWVudHMob2JqKSkgcmV0dXJuIG9iai5sZW5ndGggPT09IDA7XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikgaWYgKF8uaGFzKG9iaiwga2V5KSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBET00gZWxlbWVudD9cbiAgXy5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhbiBhcnJheT9cbiAgLy8gRGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIEFycmF5LmlzQXJyYXlcbiAgXy5pc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgYW4gb2JqZWN0P1xuICBfLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqO1xuICAgIHJldHVybiB0eXBlID09PSAnZnVuY3Rpb24nIHx8IHR5cGUgPT09ICdvYmplY3QnICYmICEhb2JqO1xuICB9O1xuXG4gIC8vIEFkZCBzb21lIGlzVHlwZSBtZXRob2RzOiBpc0FyZ3VtZW50cywgaXNGdW5jdGlvbiwgaXNTdHJpbmcsIGlzTnVtYmVyLCBpc0RhdGUsIGlzUmVnRXhwLlxuICBfLmVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgX1snaXMnICsgbmFtZV0gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIERlZmluZSBhIGZhbGxiYWNrIHZlcnNpb24gb2YgdGhlIG1ldGhvZCBpbiBicm93c2VycyAoYWhlbSwgSUUpLCB3aGVyZVxuICAvLyB0aGVyZSBpc24ndCBhbnkgaW5zcGVjdGFibGUgXCJBcmd1bWVudHNcIiB0eXBlLlxuICBpZiAoIV8uaXNBcmd1bWVudHMoYXJndW1lbnRzKSkge1xuICAgIF8uaXNBcmd1bWVudHMgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBfLmhhcyhvYmosICdjYWxsZWUnKTtcbiAgICB9O1xuICB9XG5cbiAgLy8gT3B0aW1pemUgYGlzRnVuY3Rpb25gIGlmIGFwcHJvcHJpYXRlLiBXb3JrIGFyb3VuZCBhbiBJRSAxMSBidWcuXG4gIGlmICh0eXBlb2YgLy4vICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgXy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PSAnZnVuY3Rpb24nIHx8IGZhbHNlO1xuICAgIH07XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIG9iamVjdCBhIGZpbml0ZSBudW1iZXI/XG4gIF8uaXNGaW5pdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4ocGFyc2VGbG9hdChvYmopKTtcbiAgfTtcblxuICAvLyBJcyB0aGUgZ2l2ZW4gdmFsdWUgYE5hTmA/IChOYU4gaXMgdGhlIG9ubHkgbnVtYmVyIHdoaWNoIGRvZXMgbm90IGVxdWFsIGl0c2VsZikuXG4gIF8uaXNOYU4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc051bWJlcihvYmopICYmIG9iaiAhPT0gK29iajtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgYm9vbGVhbj9cbiAgXy5pc0Jvb2xlYW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBCb29sZWFuXSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBlcXVhbCB0byBudWxsP1xuICBfLmlzTnVsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IG51bGw7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSB1bmRlZmluZWQ/XG4gIF8uaXNVbmRlZmluZWQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG4gIH07XG5cbiAgLy8gU2hvcnRjdXQgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBwcm9wZXJ0eSBkaXJlY3RseVxuICAvLyBvbiBpdHNlbGYgKGluIG90aGVyIHdvcmRzLCBub3Qgb24gYSBwcm90b3R5cGUpLlxuICBfLmhhcyA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIG9iaiAhPSBudWxsICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xuICB9O1xuXG4gIC8vIFV0aWxpdHkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUnVuIFVuZGVyc2NvcmUuanMgaW4gKm5vQ29uZmxpY3QqIG1vZGUsIHJldHVybmluZyB0aGUgYF9gIHZhcmlhYmxlIHRvIGl0c1xuICAvLyBwcmV2aW91cyBvd25lci4gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJvb3QuXyA9IHByZXZpb3VzVW5kZXJzY29yZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBLZWVwIHRoZSBpZGVudGl0eSBmdW5jdGlvbiBhcm91bmQgZm9yIGRlZmF1bHQgaXRlcmF0ZWVzLlxuICBfLmlkZW50aXR5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgXy5jb25zdGFudCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gIH07XG5cbiAgXy5ub29wID0gZnVuY3Rpb24oKXt9O1xuXG4gIF8ucHJvcGVydHkgPSBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqW2tleV07XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgcHJlZGljYXRlIGZvciBjaGVja2luZyB3aGV0aGVyIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBzZXQgb2YgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ubWF0Y2hlcyA9IGZ1bmN0aW9uKGF0dHJzKSB7XG4gICAgdmFyIHBhaXJzID0gXy5wYWlycyhhdHRycyksIGxlbmd0aCA9IHBhaXJzLmxlbmd0aDtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICBpZiAob2JqID09IG51bGwpIHJldHVybiAhbGVuZ3RoO1xuICAgICAgb2JqID0gbmV3IE9iamVjdChvYmopO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGFpciA9IHBhaXJzW2ldLCBrZXkgPSBwYWlyWzBdO1xuICAgICAgICBpZiAocGFpclsxXSAhPT0gb2JqW2tleV0gfHwgIShrZXkgaW4gb2JqKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSdW4gYSBmdW5jdGlvbiAqKm4qKiB0aW1lcy5cbiAgXy50aW1lcyA9IGZ1bmN0aW9uKG4sIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIGFjY3VtID0gQXJyYXkoTWF0aC5tYXgoMCwgbikpO1xuICAgIGl0ZXJhdGVlID0gY3JlYXRlQ2FsbGJhY2soaXRlcmF0ZWUsIGNvbnRleHQsIDEpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgaSsrKSBhY2N1bVtpXSA9IGl0ZXJhdGVlKGkpO1xuICAgIHJldHVybiBhY2N1bTtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSByYW5kb20gaW50ZWdlciBiZXR3ZWVuIG1pbiBhbmQgbWF4IChpbmNsdXNpdmUpLlxuICBfLnJhbmRvbSA9IGZ1bmN0aW9uKG1pbiwgbWF4KSB7XG4gICAgaWYgKG1heCA9PSBudWxsKSB7XG4gICAgICBtYXggPSBtaW47XG4gICAgICBtaW4gPSAwO1xuICAgIH1cbiAgICByZXR1cm4gbWluICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKTtcbiAgfTtcblxuICAvLyBBIChwb3NzaWJseSBmYXN0ZXIpIHdheSB0byBnZXQgdGhlIGN1cnJlbnQgdGltZXN0YW1wIGFzIGFuIGludGVnZXIuXG4gIF8ubm93ID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9O1xuXG4gICAvLyBMaXN0IG9mIEhUTUwgZW50aXRpZXMgZm9yIGVzY2FwaW5nLlxuICB2YXIgZXNjYXBlTWFwID0ge1xuICAgICcmJzogJyZhbXA7JyxcbiAgICAnPCc6ICcmbHQ7JyxcbiAgICAnPic6ICcmZ3Q7JyxcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjeDI3OycsXG4gICAgJ2AnOiAnJiN4NjA7J1xuICB9O1xuICB2YXIgdW5lc2NhcGVNYXAgPSBfLmludmVydChlc2NhcGVNYXApO1xuXG4gIC8vIEZ1bmN0aW9ucyBmb3IgZXNjYXBpbmcgYW5kIHVuZXNjYXBpbmcgc3RyaW5ncyB0by9mcm9tIEhUTUwgaW50ZXJwb2xhdGlvbi5cbiAgdmFyIGNyZWF0ZUVzY2FwZXIgPSBmdW5jdGlvbihtYXApIHtcbiAgICB2YXIgZXNjYXBlciA9IGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICByZXR1cm4gbWFwW21hdGNoXTtcbiAgICB9O1xuICAgIC8vIFJlZ2V4ZXMgZm9yIGlkZW50aWZ5aW5nIGEga2V5IHRoYXQgbmVlZHMgdG8gYmUgZXNjYXBlZFxuICAgIHZhciBzb3VyY2UgPSAnKD86JyArIF8ua2V5cyhtYXApLmpvaW4oJ3wnKSArICcpJztcbiAgICB2YXIgdGVzdFJlZ2V4cCA9IFJlZ0V4cChzb3VyY2UpO1xuICAgIHZhciByZXBsYWNlUmVnZXhwID0gUmVnRXhwKHNvdXJjZSwgJ2cnKTtcbiAgICByZXR1cm4gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICBzdHJpbmcgPSBzdHJpbmcgPT0gbnVsbCA/ICcnIDogJycgKyBzdHJpbmc7XG4gICAgICByZXR1cm4gdGVzdFJlZ2V4cC50ZXN0KHN0cmluZykgPyBzdHJpbmcucmVwbGFjZShyZXBsYWNlUmVnZXhwLCBlc2NhcGVyKSA6IHN0cmluZztcbiAgICB9O1xuICB9O1xuICBfLmVzY2FwZSA9IGNyZWF0ZUVzY2FwZXIoZXNjYXBlTWFwKTtcbiAgXy51bmVzY2FwZSA9IGNyZWF0ZUVzY2FwZXIodW5lc2NhcGVNYXApO1xuXG4gIC8vIElmIHRoZSB2YWx1ZSBvZiB0aGUgbmFtZWQgYHByb3BlcnR5YCBpcyBhIGZ1bmN0aW9uIHRoZW4gaW52b2tlIGl0IHdpdGggdGhlXG4gIC8vIGBvYmplY3RgIGFzIGNvbnRleHQ7IG90aGVyd2lzZSwgcmV0dXJuIGl0LlxuICBfLnJlc3VsdCA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgdmFyIHZhbHVlID0gb2JqZWN0W3Byb3BlcnR5XTtcbiAgICByZXR1cm4gXy5pc0Z1bmN0aW9uKHZhbHVlKSA/IG9iamVjdFtwcm9wZXJ0eV0oKSA6IHZhbHVlO1xuICB9O1xuXG4gIC8vIEdlbmVyYXRlIGEgdW5pcXVlIGludGVnZXIgaWQgKHVuaXF1ZSB3aXRoaW4gdGhlIGVudGlyZSBjbGllbnQgc2Vzc2lvbikuXG4gIC8vIFVzZWZ1bCBmb3IgdGVtcG9yYXJ5IERPTSBpZHMuXG4gIHZhciBpZENvdW50ZXIgPSAwO1xuICBfLnVuaXF1ZUlkID0gZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgdmFyIGlkID0gKytpZENvdW50ZXIgKyAnJztcbiAgICByZXR1cm4gcHJlZml4ID8gcHJlZml4ICsgaWQgOiBpZDtcbiAgfTtcblxuICAvLyBCeSBkZWZhdWx0LCBVbmRlcnNjb3JlIHVzZXMgRVJCLXN0eWxlIHRlbXBsYXRlIGRlbGltaXRlcnMsIGNoYW5nZSB0aGVcbiAgLy8gZm9sbG93aW5nIHRlbXBsYXRlIHNldHRpbmdzIHRvIHVzZSBhbHRlcm5hdGl2ZSBkZWxpbWl0ZXJzLlxuICBfLnRlbXBsYXRlU2V0dGluZ3MgPSB7XG4gICAgZXZhbHVhdGUgICAgOiAvPCUoW1xcc1xcU10rPyklPi9nLFxuICAgIGludGVycG9sYXRlIDogLzwlPShbXFxzXFxTXSs/KSU+L2csXG4gICAgZXNjYXBlICAgICAgOiAvPCUtKFtcXHNcXFNdKz8pJT4vZ1xuICB9O1xuXG4gIC8vIFdoZW4gY3VzdG9taXppbmcgYHRlbXBsYXRlU2V0dGluZ3NgLCBpZiB5b3UgZG9uJ3Qgd2FudCB0byBkZWZpbmUgYW5cbiAgLy8gaW50ZXJwb2xhdGlvbiwgZXZhbHVhdGlvbiBvciBlc2NhcGluZyByZWdleCwgd2UgbmVlZCBvbmUgdGhhdCBpc1xuICAvLyBndWFyYW50ZWVkIG5vdCB0byBtYXRjaC5cbiAgdmFyIG5vTWF0Y2ggPSAvKC4pXi87XG5cbiAgLy8gQ2VydGFpbiBjaGFyYWN0ZXJzIG5lZWQgdG8gYmUgZXNjYXBlZCBzbyB0aGF0IHRoZXkgY2FuIGJlIHB1dCBpbnRvIGFcbiAgLy8gc3RyaW5nIGxpdGVyYWwuXG4gIHZhciBlc2NhcGVzID0ge1xuICAgIFwiJ1wiOiAgICAgIFwiJ1wiLFxuICAgICdcXFxcJzogICAgICdcXFxcJyxcbiAgICAnXFxyJzogICAgICdyJyxcbiAgICAnXFxuJzogICAgICduJyxcbiAgICAnXFx1MjAyOCc6ICd1MjAyOCcsXG4gICAgJ1xcdTIwMjknOiAndTIwMjknXG4gIH07XG5cbiAgdmFyIGVzY2FwZXIgPSAvXFxcXHwnfFxccnxcXG58XFx1MjAyOHxcXHUyMDI5L2c7XG5cbiAgdmFyIGVzY2FwZUNoYXIgPSBmdW5jdGlvbihtYXRjaCkge1xuICAgIHJldHVybiAnXFxcXCcgKyBlc2NhcGVzW21hdGNoXTtcbiAgfTtcblxuICAvLyBKYXZhU2NyaXB0IG1pY3JvLXRlbXBsYXRpbmcsIHNpbWlsYXIgdG8gSm9obiBSZXNpZydzIGltcGxlbWVudGF0aW9uLlxuICAvLyBVbmRlcnNjb3JlIHRlbXBsYXRpbmcgaGFuZGxlcyBhcmJpdHJhcnkgZGVsaW1pdGVycywgcHJlc2VydmVzIHdoaXRlc3BhY2UsXG4gIC8vIGFuZCBjb3JyZWN0bHkgZXNjYXBlcyBxdW90ZXMgd2l0aGluIGludGVycG9sYXRlZCBjb2RlLlxuICAvLyBOQjogYG9sZFNldHRpbmdzYCBvbmx5IGV4aXN0cyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG4gIF8udGVtcGxhdGUgPSBmdW5jdGlvbih0ZXh0LCBzZXR0aW5ncywgb2xkU2V0dGluZ3MpIHtcbiAgICBpZiAoIXNldHRpbmdzICYmIG9sZFNldHRpbmdzKSBzZXR0aW5ncyA9IG9sZFNldHRpbmdzO1xuICAgIHNldHRpbmdzID0gXy5kZWZhdWx0cyh7fSwgc2V0dGluZ3MsIF8udGVtcGxhdGVTZXR0aW5ncyk7XG5cbiAgICAvLyBDb21iaW5lIGRlbGltaXRlcnMgaW50byBvbmUgcmVndWxhciBleHByZXNzaW9uIHZpYSBhbHRlcm5hdGlvbi5cbiAgICB2YXIgbWF0Y2hlciA9IFJlZ0V4cChbXG4gICAgICAoc2V0dGluZ3MuZXNjYXBlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5pbnRlcnBvbGF0ZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuZXZhbHVhdGUgfHwgbm9NYXRjaCkuc291cmNlXG4gICAgXS5qb2luKCd8JykgKyAnfCQnLCAnZycpO1xuXG4gICAgLy8gQ29tcGlsZSB0aGUgdGVtcGxhdGUgc291cmNlLCBlc2NhcGluZyBzdHJpbmcgbGl0ZXJhbHMgYXBwcm9wcmlhdGVseS5cbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBzb3VyY2UgPSBcIl9fcCs9J1wiO1xuICAgIHRleHQucmVwbGFjZShtYXRjaGVyLCBmdW5jdGlvbihtYXRjaCwgZXNjYXBlLCBpbnRlcnBvbGF0ZSwgZXZhbHVhdGUsIG9mZnNldCkge1xuICAgICAgc291cmNlICs9IHRleHQuc2xpY2UoaW5kZXgsIG9mZnNldCkucmVwbGFjZShlc2NhcGVyLCBlc2NhcGVDaGFyKTtcbiAgICAgIGluZGV4ID0gb2Zmc2V0ICsgbWF0Y2gubGVuZ3RoO1xuXG4gICAgICBpZiAoZXNjYXBlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgZXNjYXBlICsgXCIpKT09bnVsbD8nJzpfLmVzY2FwZShfX3QpKStcXG4nXCI7XG4gICAgICB9IGVsc2UgaWYgKGludGVycG9sYXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIicrXFxuKChfX3Q9KFwiICsgaW50ZXJwb2xhdGUgKyBcIikpPT1udWxsPycnOl9fdCkrXFxuJ1wiO1xuICAgICAgfSBlbHNlIGlmIChldmFsdWF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInO1xcblwiICsgZXZhbHVhdGUgKyBcIlxcbl9fcCs9J1wiO1xuICAgICAgfVxuXG4gICAgICAvLyBBZG9iZSBWTXMgbmVlZCB0aGUgbWF0Y2ggcmV0dXJuZWQgdG8gcHJvZHVjZSB0aGUgY29ycmVjdCBvZmZlc3QuXG4gICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfSk7XG4gICAgc291cmNlICs9IFwiJztcXG5cIjtcblxuICAgIC8vIElmIGEgdmFyaWFibGUgaXMgbm90IHNwZWNpZmllZCwgcGxhY2UgZGF0YSB2YWx1ZXMgaW4gbG9jYWwgc2NvcGUuXG4gICAgaWYgKCFzZXR0aW5ncy52YXJpYWJsZSkgc291cmNlID0gJ3dpdGgob2JqfHx7fSl7XFxuJyArIHNvdXJjZSArICd9XFxuJztcblxuICAgIHNvdXJjZSA9IFwidmFyIF9fdCxfX3A9JycsX19qPUFycmF5LnByb3RvdHlwZS5qb2luLFwiICtcbiAgICAgIFwicHJpbnQ9ZnVuY3Rpb24oKXtfX3ArPV9fai5jYWxsKGFyZ3VtZW50cywnJyk7fTtcXG5cIiArXG4gICAgICBzb3VyY2UgKyAncmV0dXJuIF9fcDtcXG4nO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciByZW5kZXIgPSBuZXcgRnVuY3Rpb24oc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaicsICdfJywgc291cmNlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuXG4gICAgdmFyIHRlbXBsYXRlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcmV0dXJuIHJlbmRlci5jYWxsKHRoaXMsIGRhdGEsIF8pO1xuICAgIH07XG5cbiAgICAvLyBQcm92aWRlIHRoZSBjb21waWxlZCBzb3VyY2UgYXMgYSBjb252ZW5pZW5jZSBmb3IgcHJlY29tcGlsYXRpb24uXG4gICAgdmFyIGFyZ3VtZW50ID0gc2V0dGluZ3MudmFyaWFibGUgfHwgJ29iaic7XG4gICAgdGVtcGxhdGUuc291cmNlID0gJ2Z1bmN0aW9uKCcgKyBhcmd1bWVudCArICcpe1xcbicgKyBzb3VyY2UgKyAnfSc7XG5cbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH07XG5cbiAgLy8gQWRkIGEgXCJjaGFpblwiIGZ1bmN0aW9uLiBTdGFydCBjaGFpbmluZyBhIHdyYXBwZWQgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8uY2hhaW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBfKG9iaik7XG4gICAgaW5zdGFuY2UuX2NoYWluID0gdHJ1ZTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH07XG5cbiAgLy8gT09QXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuICAvLyBJZiBVbmRlcnNjb3JlIGlzIGNhbGxlZCBhcyBhIGZ1bmN0aW9uLCBpdCByZXR1cm5zIGEgd3JhcHBlZCBvYmplY3QgdGhhdFxuICAvLyBjYW4gYmUgdXNlZCBPTy1zdHlsZS4gVGhpcyB3cmFwcGVyIGhvbGRzIGFsdGVyZWQgdmVyc2lvbnMgb2YgYWxsIHRoZVxuICAvLyB1bmRlcnNjb3JlIGZ1bmN0aW9ucy4gV3JhcHBlZCBvYmplY3RzIG1heSBiZSBjaGFpbmVkLlxuXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBjb250aW51ZSBjaGFpbmluZyBpbnRlcm1lZGlhdGUgcmVzdWx0cy5cbiAgdmFyIHJlc3VsdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0aGlzLl9jaGFpbiA/IF8ob2JqKS5jaGFpbigpIDogb2JqO1xuICB9O1xuXG4gIC8vIEFkZCB5b3VyIG93biBjdXN0b20gZnVuY3Rpb25zIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5taXhpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIF8uZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEFkZCBhbGwgb2YgdGhlIFVuZGVyc2NvcmUgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyIG9iamVjdC5cbiAgXy5taXhpbihfKTtcblxuICAvLyBBZGQgYWxsIG11dGF0b3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBfLmVhY2goWydwb3AnLCAncHVzaCcsICdyZXZlcnNlJywgJ3NoaWZ0JywgJ3NvcnQnLCAnc3BsaWNlJywgJ3Vuc2hpZnQnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb2JqID0gdGhpcy5fd3JhcHBlZDtcbiAgICAgIG1ldGhvZC5hcHBseShvYmosIGFyZ3VtZW50cyk7XG4gICAgICBpZiAoKG5hbWUgPT09ICdzaGlmdCcgfHwgbmFtZSA9PT0gJ3NwbGljZScpICYmIG9iai5sZW5ndGggPT09IDApIGRlbGV0ZSBvYmpbMF07XG4gICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgb2JqKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBBZGQgYWxsIGFjY2Vzc29yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgXy5lYWNoKFsnY29uY2F0JywgJ2pvaW4nLCAnc2xpY2UnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgbWV0aG9kLmFwcGx5KHRoaXMuX3dyYXBwZWQsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEV4dHJhY3RzIHRoZSByZXN1bHQgZnJvbSBhIHdyYXBwZWQgYW5kIGNoYWluZWQgb2JqZWN0LlxuICBfLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl93cmFwcGVkO1xuICB9O1xuXG4gIC8vIEFNRCByZWdpc3RyYXRpb24gaGFwcGVucyBhdCB0aGUgZW5kIGZvciBjb21wYXRpYmlsaXR5IHdpdGggQU1EIGxvYWRlcnNcbiAgLy8gdGhhdCBtYXkgbm90IGVuZm9yY2UgbmV4dC10dXJuIHNlbWFudGljcyBvbiBtb2R1bGVzLiBFdmVuIHRob3VnaCBnZW5lcmFsXG4gIC8vIHByYWN0aWNlIGZvciBBTUQgcmVnaXN0cmF0aW9uIGlzIHRvIGJlIGFub255bW91cywgdW5kZXJzY29yZSByZWdpc3RlcnNcbiAgLy8gYXMgYSBuYW1lZCBtb2R1bGUgYmVjYXVzZSwgbGlrZSBqUXVlcnksIGl0IGlzIGEgYmFzZSBsaWJyYXJ5IHRoYXQgaXNcbiAgLy8gcG9wdWxhciBlbm91Z2ggdG8gYmUgYnVuZGxlZCBpbiBhIHRoaXJkIHBhcnR5IGxpYiwgYnV0IG5vdCBiZSBwYXJ0IG9mXG4gIC8vIGFuIEFNRCBsb2FkIHJlcXVlc3QuIFRob3NlIGNhc2VzIGNvdWxkIGdlbmVyYXRlIGFuIGVycm9yIHdoZW4gYW5cbiAgLy8gYW5vbnltb3VzIGRlZmluZSgpIGlzIGNhbGxlZCBvdXRzaWRlIG9mIGEgbG9hZGVyIHJlcXVlc3QuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoJ3VuZGVyc2NvcmUnLCBbXSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXztcbiAgICB9KTtcbiAgfVxufS5jYWxsKHRoaXMpKTtcbiJdfQ==
