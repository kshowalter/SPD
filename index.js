(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={

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
        "6000":"800"
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
        "-36 to -40":"1.25"
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
        "#14":"3.14"
    }
}

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

f.section_defined = function(settings, section_name){
    //console.log("-"+section_name);
    //var input_section = g.inputs[section_name];
    //var output_section = g.system[section_name];
    var output_section = settings.user_input[section_name];
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

f.add_sections = function(inputs){
    var blank_user_input = {};
    for( var section_name in inputs ){
        if( inputs.hasOwnProperty(section_name) ){
            if( inputs[section_name].constructor === Object ) {
                blank_user_input[section_name] = {};
                for( var name in inputs[section_name] ){
                    if( inputs[section_name].hasOwnProperty(name) ){
                        blank_user_input[section_name][name] = null;
                    }
                }
            } else {
                console.log('error: section not object');
            }
        }
    }
    return blank_user_input;

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

//f.merge_objects = function merge_objects(object1, object2){
//    for( var key in object1 ){
//        if( object1.hasOwnProperty(key) ){
//            //if( key === 'make' ) console.log(key, object1, typeof object1[key], typeof object2[key]);
//            //console.log(key, object1, typeof object1[key], typeof object2[key]);
//            if( object1[key] && object1[key].constructor === Object ) {
//                if( object2[key] === undefined ) object2[key] = {};
//                merge_objects( object1[key], object2[key] );
//            } else {
//                if( object2[key] === undefined ) object2[key] = null;
//            }
//        }
//    }
//};

f.merge_objects = function merge_objects(object1, object2){
    for( var key in object1 ){
        if( object1.hasOwnProperty(key) ){
            //if( key === 'make' ) console.log(key, object1, typeof object1[key], typeof object2[key]);
            //console.log(key, object1, typeof object1[key], typeof object2[key]);
            if( object1[key] && object1[key].constructor === Object ) {
                if( object2[key] === undefined ) object2[key] = {};
                merge_objects( object1[key], object2[key] );
            } else {
                object2[key] = object1[key];
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
                system_ref: Object.create(kontainer).obj(g).ref('system.' + section_name + '.' + input_name),
                input_ref: Object.create(kontainer).obj(g).ref('user_input.' + section_name + '.' + input_name),
                list_ref: Object.create(kontainer).obj(g).ref('inputs.' + section_name + '.' + input_name + '.options'),
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
                selector.elem.value = selector.input_ref.get();
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
        var current_value = selector.input_ref.get();
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


//f.add_params = function(settings, parent_container){
//    for( var section_name in settings.system ){
//        if( true || f.object_defined(settings.system[section_name]) ){
//            var selection_container = $('<div>').attr('class', 'param_section').attr('id', section_name ).appendTo(parent_container);
//            //selection_container.get(0).style.display = display_type;
//            var system_div = $('<div>')
//                .attr('class', 'title_line')
//                .appendTo(selection_container)
//                /* jshint -W083 */
//                .click(function(){
//                    $(this).parent().children('.drawer').children('.drawer_content').slideToggle('fast');
//                });
//            var system_title = $('<a>')
//                .attr('class', 'title_line_text')
//                .attr('href', '#')
//                .text(f.pretty_name(section_name))
//                .appendTo(system_div);
//            $(this).trigger('click');
//            var drawer = $('<div>').attr('class', '').appendTo(selection_container);
//            var drawer_content = $('<div>').attr('class', 'param_section_content').appendTo(drawer);
//            for( var input_name in settings.system[section_name] ){
//                $('<span>').html(f.pretty_name(input_name) + ': ').appendTo(drawer_content);
//                /*
//                var selector = k$('value')
//                    //.setOptionsRef( 'inputs.' + section_name + '.' + input_name )
//                    .setRef( 'system.' + section_name + '.' + input_name )
//                    .appendTo(drawer_content);
//                f.kelem_setup(selector, settings);
//                //*/
//                var value_kontainer = Object.create(kontainer)
//                    .obj(settings)
//                    .ref('system.' + section_name + '.' + input_name);
//                var $elem = $('<span>')
//                    .attr('class', '')
//                    .appendTo(drawer_content)
//                    .text(value_kontainer.get());
//                var value = {
//                    elem: $elem.get()[0],
//                    value_ref: value_kontainer
//                };
//                settings.value_registry.push(value);
//                $('</br>').appendTo(drawer_content);
//            }
//        }
//    }
//};
//
//f.update_values = function(settings){
//    settings.value_registry.forEach(function(value_item){
//        //console.log( value_item );
//        //console.log( value_item.elem.options );
//        //console.log( value_item.elem.selectedIndex );
//        if(value_item.elem.selectedIndex){
//            value_item.value = value_item.elem.options[value_item.elem.selectedIndex].value;
//            value_item.kontainer.set(value_item.value);
//
//        }
//    });
//};
//
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




f.load_database = function(FSEC_database_obj){
    FSEC_database_obj = f.lowercase_properties(FSEC_database_obj);
    var components = {};
    components.inverters = {};
    FSEC_database_obj.inverters.forEach(function(component){
        if( components.inverters[component.make] === undefined ) components.inverters[component.make] = {};
        //components.inverters[component.make][component.make] = f.pretty_names(component);
        components.inverters[component.make][component.model] = component;
    });
    components.modules = {};
    FSEC_database_obj.modules.forEach(function(component){
        if( components.modules[component.make] === undefined ) components.modules[component.make] = {};
        //components.modules[component.make][component.make] = f.pretty_names(component);
        components.modules[component.make][component.model] = component;
    });

    return components;
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
    if( f.section_defined(g, 'location') ){
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

},{"../lib/kontainer":2}],4:[function(require,module,exports){
var mk_drawing = require('./mk_drawing');

//var drawing_parts = [];
//d.link_drawing_parts(drawing_parts);

var page = function(settings){
    console.log("** Making blocks");
    d = mk_drawing(settings);

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
        null,
        'signs'
    );
    // neg sign
    d.text(
        [x+size.module.lead/2, y+h+size.module.lead/2],
        '-',
        null,
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

},{"./mk_drawing":6}],5:[function(require,module,exports){
var mk_drawing = require('./mk_drawing');

//var drawing_parts = [];
//d.link_drawing_parts(drawing_parts);

/*
var fsec_logo_b64 =  'data:image/gif;base64,R0lGODlhXABcANUAAIWRZU9kdyZDhWp7bneGaru+U3CDtkFZfDROgKm109/f3/z8/NbW1lxvojpTluTfRcDCx1xvc66zV9bUSsnJTqCnXJOcYOzs7PHz+ERdoLjB2+/v793f5H6PvfLy8vLrQRk4iszMzP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAABcAFwAAAb/QJFwSCwaj8ikcslsOp/QqHRKrVqv2Kx2yz12Et1w2AACgcXoK7lsTrula3b7TV/G5fO6nnjH5/d1fX5/gGmCg4SFXYeIiYpZjI2Oj1WRkpOUUZaXmJlNm5ydnkmgoaKjRaWmp6gioAJ4CCCwiGetSJYIASAEeAAgA5K2t3ycvxZ4FgK/wsTFfrRsEiAVcggAA7tyEX7DrYKwzGwAEQXaIAAAEucgAcHsrHqHAwcBvWwWFgAFZQIPAw/OCeBH4EC3b40kHCgQrAwFhh8kAKDwIcCHewIoDBhw76CnXBQOfACAgMCHAgI+qPwwwWLAAA8PTGhGCVQFiStPgpCwMlvO/wcyO9Z6dAjegIoVVvJD8OADhTI5BwCoiIdAtDLe6DCSGi2CzqQfkIEoSWvCh38gmhosE6DCVTZZDQ0SYIHeBAABIjT9IMvdtQIFHkooGACWRacRCAQWMECZxzeWFJfLSRVBAco5C8iamtMCTG5D3YA68AAbRZUHjmLGTEB1xAAWgF6Kq0WVSZSpI7heTdlCPQEZP4CeLUYVVJ0gvPLm3fDyTFO0K60CIVLlAH/LeT9gvFKWtUbR4Vyypw9A7JXpsi+vwPkse3V4aaoxxbhCgaYTJGBXv/oBAgl7FVDBdaGE90koUklQwGDetcPfcsMdQICCEjUkn3jT/adSAQa19/8gZb8EYFZYDRY4RQLTyWGSShF4+OFKFSh3UYpYTWGcHIeN5OKLJ7UHzyoa2JhicE4twyOIB5xGwVuhZIABFaowZtZdsKx4pEr3AGBWaSVe4qQVmxCQDza6FEbdlSsZVKY76VggFCJfWnFBA5xEUMGIKrWEJ48T6JXTBDE2+aScIYRAJyKJRRCAO5ephA2aja2k0aItroWIAxxccUGhhR7KSUqogdDoi08dtt0qDkAQwgVVbMppp6GA2hBTL/pXRlLPhZIqp6xK4cGrr3raSFLBtEhAAHupF1A61yUljiS7vtprFAoAy6mwfljQ0gB4EmCZeppZ+QABell4qarWbjD/RbXWGjrIf96ettI9A8ibk0Zl7HbSAQC4dW67DCxABbvWYktWBBQAcIAAPPHFyzoItJhOBAgsBIAA1VXDWEgCWOVHtMAGbAXBwGILzMVsWIRSo89FIAFoSgpgVjR0mcsGyK+KfAXJwcohADwWBdCwSmOpZGtmXllaRpcg4MypzljwfK0kFrDH0l47wQhCnhTt8+wgThcKdRZSwzoXhzPKzNdPW/OTHFATMHkzuiEL3EXZ7vpRwQEDskHABEdZlRSyHfHN77/Wjs0F3tgecMA1OEo0TRkFqMMOSfR8THfOdqPBuB9vJqZQym4OV8abZYQdguJifC4JSdXIIQHkl6jOtLrn7eaNyC9v/vK15gB3XofrgxgEj0Fyzx28IsTTCPbmTwsPSPPOK5+49IVQ77zt2DOfu8nTcX+L9qaITwz5tUMvdvejoI943c4Q4T4e5sc/xPypq786+87MX7/9RUDf/wAYwO8B73oEVELzBphAI7iOgQ104PcgGEEJtkt/t6vgEfCGQA06gYPR8yAUQJhBESYBbyU04Qk7qEJqca6FA1sfDKuggBTOkAn8u6EOd8jDHqIiCAA7';
//*/


var add_border = function(settings, sheet_info){
    d = mk_drawing(settings);
    var f = settings.f;

    //var components = settings.components;
    //var system = settings.system;
    var system = settings.system;

    var size = settings.drawing_settings.size;
    var loc = settings.drawing_settings.loc;




    var x, y, h, w;
    var offset;


////////////////////////////////////////
// Frame
    d.section('Frame');

    w = size.drawing.w;
    h = size.drawing.h;
    var padding = size.drawing.frame_padding;

    d.layer('border_lines');

    //border
    d.rect( [w/2 , h/2], [w - padding*2, h - padding*2 ] );

    var right_offset = size.drawing.titlebox;


// Project/FSEC logo
    x = w - padding;
    y = 0 + padding;
    var FSEC_logo_width = 32;
    x += -FSEC_logo_width;

    d.image(
        [x-2,y+2],
        [FSEC_logo_width,FSEC_logo_width],
        'data/logo/FSEC.gif'
    );
    d.line([
        [x-4,y],
        [x-4,                y+4+FSEC_logo_width],
        [w-padding,y+4+FSEC_logo_width],
    ]);


// title boxes

    // title box
    var titlebox = size.drawing.titlebox;

    // side
    x = w - padding - titlebox.side.w;
    y = h - padding;
    d.line([
        [ x, y],
        [ x,                 y - titlebox.side.h],
        [ x+titlebox.side.w, y - titlebox.side.h]
    ]);

    //bottom
    x = w - padding - titlebox.side.w - titlebox.bottom.w;
    y = h - padding;
    d.line([
        [ x, y],
        [ x, y - titlebox.bottom.h],
        [ x + titlebox.bottom.w , y - titlebox.bottom.h],
    ]);


// bottom bar content


    x = w - padding - titlebox.bottom.w - titlebox.side.w;
    y = h - padding - titlebox.bottom.h;
    x += 10;
    y += titlebox.bottom.h *1/4;


    d.text([x,y],
         [ 'PV System Design' ],
        'text',
        'title1'
        );


    x += 150;
    if( settings.f.section_defined(settings, 'location')  ){
        d.text([x,y], [
            settings.perm.location.address,
            settings.perm.location.city + ', ' + settings.perm.location.county + ', FL, ' + settings.perm.location.zip,

        ], 'text', 'title3');
    }




// Side bar content

    x = w - padding - titlebox.side.w;
    y = h - padding - titlebox.side.h;

    // Contractor name box
    d.text([x+titlebox.side.w/2,y+10], [
             [ 'Solar Installer Inc.' ],
             [ '1234 Yellow Sub Ln.' ],
             [ 'Cocoa, Fl 32922' ],
         ],
         'text',
        'installer_info'
        );


    y += titlebox.side.w/2;
    d.line([
        [ x , y ],
        [ x+titlebox.side.w , y ],
    ]);

    // manufacturer logo box
    var logo_gap = 2;
    var logo_width = (titlebox.side.w-logo_gap*3)/2;

    var logos = [
        'data/logo/SMA.png',
        'data/logo/suniva.jpg',
        'data/logo/schletter.svg',
    ];
    d.image(
        [x+logo_gap,y+logo_gap],
        [logo_width,logo_width],
        logos[0]
    );
    d.image(
        [x+logo_gap,y+logo_gap+logo_width+logo_gap],
        [logo_width,logo_width],
        logos[1]
    );
    d.image(
        [x+logo_gap+logo_width+logo_gap,y+logo_gap],
        [logo_width,logo_width],
        logos[2]
    );

    y += titlebox.side.w;
    d.line([
        [ x , y ],
        [ x+titlebox.side.w , y ],
    ]);


    y += titlebox.side.w;
    d.line([
        [ x , y ],
        [ x+titlebox.side.w , y ],
    ]);

    y += titlebox.side.w /8
    d.text([x+titlebox.side.w/2,y+10], [
             [ sheet_info.num ],
        ],
        'text',
        'sheet_num'
        );

    /*
    d.image(
        [x+32,y+32],
        [32,32],
        logos[3]
    );
    //*/



    /*
    x = w - padding * 3;
    y = padding * 3;

    w = size.drawing.titlebox;
    h = size.drawing.titlebox;

    // box top-right
    //d.rect( [x-w/2, y+h/2], [w,h] );

    y += h + padding;

    w = size.drawing.titlebox;
    h = size.drawing.h - padding*8 - size.drawing.titlebox*2.5;

    //title box
    //d.rect( [x-w/2, y+h/2], [w,h] );

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
        'text',
        'page'
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
            'text',
            'title1'
            ).rotate(-90);

    }

    x += 14;
    if( settings.f.section_defined(settings, 'location')  ){
        d.text([x,y], [
            settings.perm.location.address,
            settings.perm.location.city + ', ' + settings.perm.location.county + ', FL, ' + settings.perm.location.zip,

        ], 'text', 'title3').rotate(-90);
    }

    x = page.left + padding;
    y = page.top + padding;
    y += size.drawing.titlebox * 1.5 * 3/4;



    //*/



    return d.drawing_parts;
};



module.exports = add_border;

},{"./mk_drawing":6}],6:[function(require,module,exports){
'use strict';

var _ = require('underscore');


var mk_drawing = function(g){

    var drawing = {};


    var layer_attr = require('./settings_layers');
    var fonts = require('./settings_fonts');







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

        if( ! layer_name ) { layer_name = layer_active; }
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


        // Temp. NaN check
        points.forEach(function(point){
            if( point.constructor === Array ){
                point.forEach(function(num){
                    if( isNaN(num) ){
                        console.log( 'NaN alert:', elem);
                    }
                });
            } else {
                if( isNaN(point.x) || isNaN(point.y) ){
                    console.log( 'NaN alert:', elem);
                }

            }
        });

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

    drawing.text = function(loc, strings, layer, font, attrs){
        var txt = this.add('text', [loc], layer, attrs);
        if( typeof strings == 'string'){
            strings = [strings];
        }
        txt.strings = strings;
        txt.font = font;
        return txt;
    };

    drawing.image = function(loc, size, href, layer, attrs){
        var img = this.add('image', [loc], 'image', attrs);
        img.w = size[0];
        img.h = size[1];
        img.href = href;
        return img;
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
                        if( fonts[font_name]['text-anchor'] === 'center') coor = this.center(r,c);
                        else if( fonts[font_name]['text-anchor'] === 'right') coor = this.right(r,c);
                        else if( fonts[font_name]['text-anchor'] === 'left') coor = this.left(r,c);
                        else coor = this.center(r,c);

                        this.drawing.text(
                            coor,
                            this.cell(r,c).cell_text,
                            'text',
                            font_name
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




    var page = Object.create(drawing);
    //console.log(page);
    page.drawing_parts = [];
    return page;




};





/////////////////////////////////



module.exports = mk_drawing;

},{"./settings_fonts":19,"./settings_layers":20,"underscore":23}],7:[function(require,module,exports){
var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');

var page = function(settings, sheet_info){
    console.log("** Making page "+sheet_info.num);

    //var page_maker = require()

    var d = mk_drawing(settings);

    d.append(mk_border(settings, sheet_info ));



    if( settings.f.mk_page[sheet_info.num] !== undefined ){
        //console.log('Sheet defined');
        d.append( settings.f.mk_page[sheet_info.num](settings) );
    } else {
        console.log('Error: Sheet not defined');
    }

    return d.drawing_parts;
};



module.exports = page;

},{"./mk_border":5,"./mk_drawing":6}],8:[function(require,module,exports){
var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');
var f = require('./functions');

var page = function(settings){
    console.log("** Making preview 1");

    var d = mk_drawing(settings);



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

    if( f.section_defined(settings, 'array') && f.section_defined(settings, 'module') ){
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

    if( f.section_defined(settings, 'DC') ){
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

    if( f.section_defined(settings, 'inverter') ){

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

    if( f.section_defined(settings, 'AC') ){

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

},{"./functions":3,"./mk_border":5,"./mk_drawing":6}],9:[function(require,module,exports){
var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');
var f = require('./functions');

var page = function(settings){
    console.log("** Making preview 2");

    var d = mk_drawing(settings);

    if( f.section_defined(settings, 'roof') ){

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
            if( f.section_defined(settings, 'module') && f.section_defined(settings, 'array')){
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

                if( num_cols !== settings.temp.num_cols || num_rows !== settings.temp.num_rows ){
                    settings.webpage.selected_modules = {};
                    settings.webpage.selected_modules_total = 0;

                    for( r=1; r<=num_rows; r++){
                        settings.webpage.selected_modules[r] = {};
                        for( c=1; c<=num_cols; c++){
                            settings.webpage.selected_modules[r][c] = false;
                        }
                    }


                    settings.temp.num_cols = num_cols;
                    settings.temp.num_rows = num_rows;
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
                        if( settings.webpage.selected_modules[r][c] ) layer = 'preview_structural_module_selected';
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
                        "Selected modules: " + parseFloat( settings.webpage.selected_modules_total ).toFixed().toString(),
                        "Calculated modules: " + parseFloat( settings.system.array.number_of_modules ).toFixed().toString(),
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

},{"./functions":3,"./mk_border":5,"./mk_drawing":6}],10:[function(require,module,exports){
"use strict";
var f = require('./functions');



var mk_settings = function() {


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



    settings.user_input = f.add_sections(settings.inputs);




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
    //settings.value_registry = [];


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





    // Load functions and add them the the global object
    f.g = settings;
    settings.f = f;




    // Load modules

    f.setup_webpage = require('./setup_webpage');

    f.process = require('./process');
    f.settings_dev_defaults = require('./settings_dev_defaults');


    f.mk_blocks = require('./mk_blocks');

    f.mk_page = {};
    f.mk_page['G-001'] = require('./page/G-001');
    f.mk_page['S-001'] = require('./page/S-001');
    f.mk_page['W-001'] = require('./page/W-001');
    f.mk_page['W-002'] = require('./page/W-002');

    f.mk_preview = {};
    f.mk_preview[1] = require('./mk_page_preview_1');
    f.mk_preview[2] = require('./mk_page_preview_2');

    f.mk_svg= require('./mk_svg');



    settings.drawing_settings.sheets = [
        {
            num: 'G-001',
            desc: 'Title Sheet'
        },
        {
            num: 'W-001',
            desc: 'PV system wiring diagram'
        },
        {
            num: 'W-002',
            desc: 'PV system specifications'
        },
        {
            num: 'S-001',
            desc: 'Roof details'
        },
        {
            num: 'X-042',
            desc: 'L.U.E.'
        },
    ];





    return settings;

};



module.exports = mk_settings;

},{"../data/tables.json":1,"./functions":3,"./mk_blocks":4,"./mk_page_preview_1":8,"./mk_page_preview_2":9,"./mk_svg":11,"./page/G-001":12,"./page/S-001":13,"./page/W-001":14,"./page/W-002":15,"./process":16,"./settings_dev_defaults":17,"./settings_drawing":18,"./settings_fonts":19,"./settings_layers":20,"./setup_webpage":21}],11:[function(require,module,exports){
'use strict';
//var settings = require('./settings.js');
//var snapsvg = require('snapsvg');
//log(settings);



var mk_svg = function(drawing_parts, drawing_settings){
    //console.log('displaying svg');
    //console.log('drawing_parts: ', drawing_parts);
    //container.empty()
    var drawing_size = drawing_settings.size.drawing;
    var layer_attr = drawing_settings.layer_attr;
    var fonts = drawing_settings.fonts;

    //var svg_document = document.getElementById('SvgjsSvg1000')
    var svg_document = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svg_document.setAttribute('class','svg_drawing');



    //svg_document.setAttribute('width', settings.drawing_settings.size.drawing.w);
    //svg_document.setAttribute('height', settings.drawing_settings.size.drawing.h);
    var view_box = '0 0 ' + drawing_size.w + ' ' + drawing_size.h + ' ';
    svg_document.setAttribute('viewBox', view_box);
    svg_document.setAttribute('xmlns','http://www.w3.org/2000/svg');
    svg_document.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
    //var svg = snapsvg(svg_document).size(size.drawing.w, size.drawing.h);
    //var svg = snapsvg('#svg_drawing');

    // Loop through all the drawing contents, call the function below.
    drawing_parts.forEach( function(item,id) {
        svg_document.appendChild(
            mk_svg_elem(item)
        );
    });

    function mk_svg_elem(item){
        var x,y,attr_name;
        if( typeof item.x !== 'undefined' ) { x = item.x; }
        if( typeof item.y !== 'undefined' ) { y = item.y; }

        var attrs = layer_attr[item.layer_name];
        if( item.attrs !== undefined){
            for( attr_name in item.attrs ){
                attrs[attr_name] = item.attrs[attr_name];
            }
        }
        var svg_elem;

        if( item.type === 'rect') {
            //svg.rect( item.w, item.h ).move( x-item.w/2, y-item.h/2 ).attr( layer_attr[item.layer_name] );
            //console.log('elem:', elem );
            //if( isNaN(item.w) ) {
            //    console.log('error: elem not fully defined', elem)
            //    item.w = 10;
            //}
            //if( isNaN(item.h) ) {
            //    console.log('error: elem not fully defined', elem)
            //    item.h = 10;
            //}
            svg_elem = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            svg_elem.setAttribute('width', item.w);
            svg_elem.setAttribute('height', item.h);
            svg_elem.setAttribute('x', x-item.w/2);
            svg_elem.setAttribute('y', y-item.h/2);
            //console.log(item.layer_name);
            for( attr_name in attrs ){
                svg_elem.setAttribute(attr_name, attrs[attr_name]);
            }

        } else if( item.type === 'line') {
            var points2 = [];
            item.points.forEach( function(point){
                if( ! isNaN(point[0]) && ! isNaN(point[1]) ){
                    points2.push([ point[0], point[1] ]);
                } else {
                    console.log('error: elem not fully defined', item);
                }
            });
            //svg.polyline( points2 ).attr( layer_attr[item.layer_name] );

            svg_elem = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
            svg_elem.setAttribute( 'points', points2.join(' ') );
            for( attr_name in attrs ){
                svg_elem.setAttribute(attr_name, attrs[attr_name]);
            }

        } else if( item.type === 'poly') {
            var points2 = [];
            item.points.forEach( function(point){
                if( ! isNaN(point[0]) && ! isNaN(point[1]) ){
                    points2.push([ point[0], point[1] ]);
                } else {
                    console.log('error: elem not fully defined', item);
                }
            });
            //svg.polyline( points2 ).attr( layer_attr[item.layer_name] );

            svg_elem = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
            svg_elem.setAttribute( 'points', points2.join(' ') );
            for( attr_name in attrs ){
                svg_elem.setAttribute(attr_name, attrs[attr_name]);
            }

        } else if( item.type === 'text') {
            //var t = svg.text( item.strings ).move( item.points[0][0], item.points[0][1] ).attr( layer_attr[item.layer_name] )
            var font;
            if( item.font && fonts[item.font] ){
                font = fonts[item.font];
            } else if(fonts[attrs.font]){
                font = fonts[attrs.font];
            } else {
                font = fonts['base'];
            }
            if( font === undefined){
                console.log('Font not found', font, fonts['base']['font-size']);

            }

            svg_elem = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            if(item.rotated){
                //t.setAttribute('transform', "rotate(" + item.rotated + " " + x + " " + y + ")" );
                svg_elem.setAttribute('transform', "rotate(" + item.rotated + " " + x + " " + y + ")" );
            } else {
                //if( font['text-anchor'] === 'middle' ) y += font['font-size']*1/3;
                y += font['font-size']*1/3;
            }
            var dy = font['font-size']*1.5;
            svg_elem.setAttribute('x', x);
            //svg_elem.setAttribute('y', y + font['font-size']/2 );
            svg_elem.setAttribute('y', y-dy );

            for( attr_name in attrs ){
                if( attr_name === 'stroke' ) {
                    svg_elem.setAttribute( 'fill', attrs[attr_name] );
                } else if( attr_name === 'fill' ) {
                    //svg_elem.setAttribute( 'stroke', 'none' );
                } else {
                    svg_elem.setAttribute( attr_name, attrs[attr_name] );
                }

            }
            for( attr_name in font ){
                svg_elem.setAttribute( attr_name, font[attr_name] );
            }
            for( attr_name in item.strings ){
                var tspan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
                tspan.setAttribute('dy', dy );
                tspan.setAttribute('x', x);
                tspan.innerHTML = item.strings[attr_name];
                svg_elem.appendChild(tspan);
            }

        } else if( item.type === 'circ') {
            var svg_elem = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
            svg_elem.setAttribute('rx', item.d/2);
            svg_elem.setAttribute('ry', item.d/2);
            svg_elem.setAttribute('cx', x);
            svg_elem.setAttribute('cy', y);
            for( attr_name in attrs ){
                svg_elem.setAttribute(attr_name, attrs[attr_name]);
            }
            /*
            c.attributes( layer_attr[item.layer_name] )
            c.attributes({
                rx: 5,
                --------------------------
                ry: 5,
                cx: item.points[0][0]-item.d/2,
                cy: item.points[0][1]-item.d/2
            })
            var c2 = svg.ellipse( item.r, item.r )
            c2.move( item.points[0][0]-item.d/2, item.points[0][1]-item.d/2 )
            c2.attr({rx:5, ry:5})
            c2.attr( layer_attr[item.layer_name] )
            //*/
        } else if( item.type === 'image') {

            svg_elem = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            var image = document.createElementNS("http://www.w3.org/2000/svg", 'image');
            image.setAttribute('x', x);
            image.setAttribute('y', y);
            image.setAttribute('width', item.w);
            image.setAttribute('height', item.h);
            image.setAttribute('xlink:href', item.href);
            for( attr_name in attrs ){
                image.setAttribute(attr_name, attrs[attr_name]);
            }
            //g.appendChild(svg_elem);
            //svg_elem.appendChild(g);
            svg_elem.innerHTML += image.outerHTML;




        } else if(item.type === 'block') {
            // if it is a block, run this function through each element.

            svg_elem = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            svg_elem.setAttribute('transform', 'translate('+x+','+y+')');
            item.drawing_parts.forEach( function(block_item,id){
                svg_elem.appendChild(
                    mk_svg_elem(block_item)
                );
            });
        }

        return svg_elem;


    }
    return svg_document;
};


module.exports = mk_svg;

},{}],12:[function(require,module,exports){
var mk_drawing = require('../mk_drawing');
var mk_border = require('../mk_border');

var page = function(settings){

    var d = mk_drawing(settings);

    var sheet_section = 'A';
    var sheet_num = '00';
    //d.append(mk_border(settings, sheet_section, sheet_num ));

    var size = settings.drawing_settings.size;
    var loc = settings.drawing_settings.loc;

    var x, y, h, w;
    d.layer('text');
    d.text(
        [size.drawing.w*1/2, size.drawing.h*1/3],
        [
            'PV System Design',
        ],
        null,
        'project title'
    );

    if( settings.f.section_defined(settings, 'location')  ){
        d.text(
            [size.drawing.w*1/2, size.drawing.h*1/3 +30],
            [
                settings.perm.location.address,
                settings.perm.location.city + ', ' + settings.perm.location.county + ', FL, ' + settings.perm.location.zip,
            ],
            null,
            'project title'
        );
    }
    var n_rows = settings.drawing_settings.sheets.length;
    var n_cols = 2;
    w = 400+80;
    h = n_rows*20;
    x = size.drawing.frame_padding*6;
    y = size.drawing.h - size.drawing.frame_padding - size.drawing.titlebox.bottom.h;
    y += -20 * n_rows;
    y += -40; // the last number is the gap to the title box
    d.text( [x+w/2, y-20], 'Contents', null, 'table_large' );

    var t = d.table(n_rows,n_cols).loc(x,y);
    t.row_size('all', 20).col_size(2, 400).col_size(1, 80);

    settings.drawing_settings.sheets.forEach(function(sheet,i){
        t.cell(i+1,1).text(sheet.num);
        t.cell(i+1,2).text(sheet.desc);

    });


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

},{"../mk_border":5,"../mk_drawing":6}],13:[function(require,module,exports){
var mk_drawing = require('../mk_drawing');
var mk_border = require('../mk_border');

var page = function(settings){
    var f = settings.f;

    d = mk_drawing(settings);

    var sheet_section = 'S';
    var sheet_num = '01';
    //d.append(mk_border(settings, sheet_section, sheet_num ));

    var size = settings.drawing_settings.size;
    var loc = settings.drawing_settings.loc;
    var system = settings.system;












    if( f.section_defined(settings, 'roof') ){



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
                'dimention',
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
                'dimention',
                'dimention'
            );
            d.text(
                [cs_x+cs_w*1.5+20, cs_y+cs_h/3],
                parseFloat( system.roof.length ).toFixed().toString(),
                'dimention',
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
                'dimention',
                'dimention'
            );
            d.text(
                [detail_x+detail_w/2, detail_y+detail_h+40],
                parseFloat( system.roof.width ).toFixed().toString(),
                'dimention',
                'dimention'
            );

            d.text(
                [detail_x+ (offset_a)/2, detail_y+detail_h+15],
                'a',
                'dimention',
                'dimention'
            );
            d.text(
                [detail_x+detail_w-(offset_a)/2, detail_y+detail_h+15],
                'a',
                'dimention',
                'dimention'
            );
            d.text(
                [detail_x-15, detail_y+detail_h-(offset_a)/2],
                'a',
                'dimention',
                'dimention'
            );
            d.text(
                [detail_x-15, detail_y+(offset_a)/2],
                'a',
                'dimention',
                'dimention'
            );

            x = detail_x + detail_w + 25;
            y = detail_y + 120;

            d.block('north arrow_up', [x,y]);



            //////
            // Module options
            if( f.section_defined(settings, 'module') && f.section_defined(settings, 'array')){
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

                if( num_cols !== settings.temp.num_cols || num_rows !== settings.temp.num_rows ){
                    settings.webpage.selected_modules = {};
                    settings.webpage.selected_modules_total = 0;

                    for( r=1; r<=num_rows; r++){
                        settings.webpage.selected_modules[r] = {};
                        for( c=1; c<=num_cols; c++){
                            settings.webpage.selected_modules[r][c] = false;
                        }
                    }


                    settings.temp.num_cols = num_cols;
                    settings.temp.num_rows = num_rows;
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
                        if( settings.webpage.selected_modules[r][c] ) layer = 'preview_structural_module_selected';
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
                        "Selected modules: " + parseFloat( settings.webpage.selected_modules_total ).toFixed().toString(),
                        "Calculated modules: " + parseFloat( settings.system.array.number_of_modules ).toFixed().toString(),
                    ],
                    'dimention',
                    'dimention'
                );

            }




        }
    }






    return d.drawing_parts;
};



module.exports = page;

},{"../mk_border":5,"../mk_drawing":6}],14:[function(require,module,exports){
'use strict';

var _ = require('underscore');

var mk_drawing = require('../mk_drawing');
var mk_border = require('../mk_border');

//var drawing_parts = [];
//d.link_drawing_parts(drawing_parts);

var page = function(settings){
    var d = mk_drawing(settings);
    var sheet_section = 'PV';
    var sheet_num = '01';
    //d.append(mk_border(settings, sheet_section, sheet_num ));

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
    if( f.section_defined(settings, 'module') && f.section_defined(settings, 'array') ){
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

    if( f.section_defined(settings, 'DC') ){

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
    if( f.section_defined(settings, 'inverter') ){

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
    if( f.section_defined(settings, 'AC') ){
        d.section("AC_discconect");

        x = loc.AC_disc.x;
        y = loc.AC_disc.y;
        var padding = size.terminal_diam;

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

        if( system.AC.conductors && system.AC.conductors.indexOf('ground')+1 ) {
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

        if( system.AC.conductors && system.AC.conductors.indexOf('neutral')+1 ) {
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
            if( system.AC.conductors && system.AC.conductors.indexOf('L'+i)+1 ) {
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

    d.text( [x,y], 'Voltage Drop', 'text', 'table');


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

    d.text( [x,y], 'General Notes', 'text', 'table');


    d.section();

    return d.drawing_parts;
};



module.exports = page;

},{"../mk_border":5,"../mk_drawing":6,"underscore":23}],15:[function(require,module,exports){
var mk_drawing = require('../mk_drawing');
var mk_border = require('../mk_border');

var page = function(settings){
    var f = settings.f;

    d = mk_drawing(settings);

    var sheet_section = 'PV';
    var sheet_num = '02';
    //d.append(mk_border(settings, sheet_section, sheet_num ));

    var size = settings.drawing_settings.size;
    var loc = settings.drawing_settings.loc;


    d.text(
        [size.drawing.w/2, size.drawing.h/2],
        'Calculation Sheet',
        'text',
        'title2'
    );


    x = size.drawing.frame_padding*6;
    y = size.drawing.frame_padding*6 +20;

    d.layer('table');


    for( var section_name in settings.system ){
        if( f.section_defined(settings, section_name) ){
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

            if( y > ( settings.drawing_settings.size.drawing.h * 0.8 ) ) {
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

},{"../mk_border":5,"../mk_drawing":6}],16:[function(require,module,exports){
'use strict';
var mk_page = require('./mk_page');

var process = function(settings) {
    var f = settings.f;

    //copy inputs from settings.input to settings.system.
    f.merge_objects(settings.user_input, settings.system);


    //console.log('---settings---', settings);
    var config_options = settings.config_options;
    var system = settings.system;
    var loc = settings.drawing_settings.loc;
    var size = settings.drawing_settings.size;
    var state = settings.state;

    var inputs = settings.inputs;



// Update settings and calculations

    if( state.database_loaded ){
        inputs.DC = settings.inputs.DC || {};
        inputs.DC.wire_size = settings.inputs.DC.wire_size || {};
        inputs.DC.wire_size.options = inputs.DC.wire_size.options || f.obj_names(settings.config_options.NEC_tables['Ch 9 Table 8 Conductor Properties']);


    }



    //console.log("process");
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

    if( f.section_defined(settings, 'array') && f.section_defined(settings, 'module') ){
        system.array = system.array || {};
        system.array.isc = system.module.isc * system.array.num_strings;
        system.array.voc = system.module.voc * system.array.modules_per_string;
        system.array.imp = system.module.imp * system.array.num_strings;
        system.array.vmp = system.module.vmp * system.array.modules_per_string;
        system.array.pmp = system.array.vmp  * system.array.imp;

        system.array.number_of_modules = system.array.modules_per_string * system.array.num_strings;


    }


    if( f.section_defined(settings, 'DC') ){

        system.DC.wire_size = "-Undefined-";

    }

    inputs.inverter.make.options = f.obj_names(settings.components.inverters);
    if( system.inverter.make ) {
        inputs.inverter.model.options = f.obj_names( settings.components.inverters[system.inverter.make] );
    }
    if( f.section_defined(settings, 'inverter') ){

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
    if( f.section_defined(settings, 'AC') ){

        system.AC.wire_size = "-Undefined-";
    }

    size.wire_offset.max = size.wire_offset.min + system.array.num_strings * size.wire_offset.base;
    size.wire_offset.ground = size.wire_offset.max + size.wire_offset.base*1;
    loc.array.left = loc.array.right - ( size.string.w * system.array.num_strings ) - ( size.module.frame.w*3/4 ) ;




    if( f.section_defined(settings, 'location') ){
        //console.log('address ready');
        //f.request_geocode();
        settings.perm.location.new_address = false;
        for( var name in settings.system.location ){
            if( settings.system.location[name] !== settings.perm.location[name]){
                settings.perm.location.new_address = true;
            }
            settings.perm.location[name] = settings.system.location[name];
        }

    }





// Update drawing

    // Make blocks
    f.mk_blocks(settings);


    // Make drawing
    var i, p;

    // Not needed on server
    settings.drawing.preview_parts = {};
    settings.drawing.preview_svgs = {};
    for( p in f.mk_preview ){  // f.mk_page is a array of page making functions, so this will loop through the number of pages
        settings.drawing.preview_parts[p] = f.mk_preview[p](settings);
    }

    settings.drawing.parts = {};
    settings.drawing.svgs = {};
    settings.drawing_settings.sheets.forEach(function(sheet_info, i){
        p = i+1;
        settings.drawing.parts[p] = mk_page(settings, sheet_info);
//        settings.drawing.parts[p] = f.mk_page[p](settings);

    });

};



module.exports = process;

},{"./mk_page":7}],17:[function(require,module,exports){
'use strict';


var settings_dev_defaults = function(settings) {
    console.log('Dev mode - defaults on');

    //console.log('---settings---', settings);
    var config_options = settings.config_options;
    var inputs = settings.inputs;
    var user_input = settings.user_input;
    var loc = settings.drawing_settings.loc;
    var size = settings.drawing_settings.size;
    var state = settings.state;

    if( state.database_loaded ){
        inputs.DC = settings.inputs.DC || {};
        inputs.DC.wire_size = settings.inputs.DC.wire_size || {};
        inputs.DC.wire_size.options = inputs.DC.wire_size.options || g.f.obj_names(settings.config_options.NEC_tables['Ch 9 Table 8 Conductor Properties']);


    }

    user_input.array.num_strings = user_input.array.num_strings || 4;
    user_input.array.modules_per_string = user_input.array.modules_per_string || 6;
    user_input.DC.home_run_length = user_input.DC.home_run_length || 50;

    user_input.roof.width  = user_input.roof.width || 60;
    user_input.roof.length = user_input.roof.length || 25;
    user_input.roof.slope  = user_input.roof.slope || "6:12";
    user_input.roof.type   = user_input.roof.type || "Gable";

    user_input.inverter.location = user_input.inverter.location  || "Inside";

    user_input.module.orientation = user_input.module.orientation || "Portrait";

    user_input.location.address = user_input.location.address || '1679 Clearlake Road';
    user_input.location.city    = user_input.location.city || 'Cocoa';
    user_input.location.zip     = user_input.location.zip || '32922';
    user_input.location.county   = user_input.location.county || 'Brevard';


    if( state.database_loaded ){

        user_input.module.make = user_input.module.make ||
            g.f.obj_names( settings.components.modules )[0];
        user_input.module.model = user_input.module.model ||
            g.f.obj_names( settings.components.modules[user_input.module.make] )[0];

        user_input.inverter.make = user_input.inverter.make ||
            g.f.obj_names( settings.components.inverters )[0];
        user_input.inverter.model = user_input.inverter.model ||
            g.f.obj_names( settings.components.inverters[user_input.inverter.make] )[0];


        user_input.AC.loadcenter_types = user_input.AC.loadcenter_types ||
        //    g.f.obj_names(inputs.AC.loadcenter_types)[0];
            '480/277V';


        user_input.AC.type = user_input.AC.type || '480V Wye';
        //system.AC.type = user_input.AC.type ||
        //    user_input.AC.loadcenter_types[system.AC.loadcenter_types][0];

        user_input.AC.distance_to_loadcenter = user_input.AC.distance_to_loadcenter ||
            50;


        user_input.DC.wire_size = inputs.DC.wire_size.options[3];
        /*

        settings.config_options.inverterMakeArray = k.objIdArray(settings.config_options.inverters);
        user_input.inverter.make = user_input.inverter.make || Object.keys( settings.config_options.inverters )[0];
        settings.config_options.inverterModelArray = k.objIdArray(settings.config_options.inverters[system.inverter.make]);

        user_input.AC_loadcenter_type = user_input.AC_loadcenter_type || config_options.AC_loadcenter_type_options[0];
        //*/


        user_input.attachment_system.make = user_input.attachment_system.make ||
            inputs.attachment_system.make.options[0];
        user_input.attachment_system.model = user_input.attachment_system.model ||
            inputs.attachment_system.model.options[0];

    }





};



module.exports = settings_dev_defaults;

},{}],18:[function(require,module,exports){
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
        titlebox: {
            side: {
                w: 80,
                h: 80*3,
            },
            bottom: {
                h: 40,
                w: 650
            }
        }

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
        x: size.drawing.w - size.drawing.frame_padding*3 - 325,
        y: size.drawing.frame_padding*3,
    };

    // voltage drop table
    size.volt_drop_table = {};
    size.volt_drop_table.w = 150;
    size.volt_drop_table.h = 100;
    loc.volt_drop_table = {};
    loc.volt_drop_table.x = size.drawing.w - size.volt_drop_table.w/2 - 30 - size.drawing.titlebox.side.w;
    loc.volt_drop_table.y = size.drawing.h - size.volt_drop_table.h/2 - 30 - size.drawing.titlebox.bottom.h;


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

},{}],19:[function(require,module,exports){
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

fonts['base'] = {
    'font-family': 'monospace',
    'font-size':     10,
    'text-anchor':   'middle',
};

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
fonts['title_FSEC'] = {
    'font-family': 'monospace',
    'font-size':     8,
    'text-anchor':   'middle',
};
fonts['installer_info'] = {
    'font-family': 'monospace',
    'font-size':     6,
    'text-anchor':   'middle',
};
fonts['sheet_num'] = {
    'font-family': 'monospace',
    'font-size':     16,
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

},{}],20:[function(require,module,exports){
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

layer_attr.image = {};

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

layer_attr.dimention = Object.assign(Object.create(layer_attr.text),{
    stroke: '#1433fe',
});

layer_attr.border = Object.create(layer_attr.base);

layer_attr['border_lines'] = Object.assign(Object.create(layer_attr.text),{
    stroke: '#717171',
});


module.exports = layer_attr;

},{}],21:[function(require,module,exports){



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
    $('<img>')
        .attr('src', 'data/PlansMachine.png')
        .attr('class', 'title_image')
        //.attr('width', '90%')
        .appendTo(header_container);
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
        .attr('class', 'button_float_right')
        .attr('target', '_blank')
        .appendTo(drawing_section);
    $('<a>')
        .text('Download Drawing (network test, once)')
        //.attr('href', '#')
        .attr('id', 'download')
        .attr('class', 'button_float_right')
        //.attr('target', '_blank')
        .appendTo(drawing_section)
        .click(f.request_SVG);
    $('<a>')
        .text('Download Drawing (network test, repeats)')
        //.attr('href', '#')
        .attr('id', 'download')
        .attr('class', 'button_float_right')
        //.attr('target', '_blank')
        .appendTo(drawing_section)
        .click(function(){
            setInterval(g.f.request_SVG, 1000);
        });

    var svg_container_object = $('<div>').attr('id', 'drawing').attr('class', 'drawing').css('clear', 'both').appendTo(drawing_section);
    //svg_container_object.style('width', settings.drawing_settings.size.drawing.w+'px' )
    //var svg_container = svg_container_object.elem;
    $('<br>').appendTo(drawing_section);

    ///////////////////
    $('<div>').html(' ').attr('class', 'section_title').appendTo(drawing_section);

}



module.exports = setup_webpage;

},{}],22:[function(require,module,exports){


var update_webpage = function(){
    var settings = g;
    var f = g.f;


// update web page
    // set maps markers
    if( g.perm.location.lat && g.perm.location.lon) {
        f.set_sat_map_marker();
    }

    // change user inputs to defaults if needed.
    // This also updates the drop list elements that are dependent on other inputs ( model list is based on selected make).
    settings.select_registry.forEach(function(selector){
        if( selector.type === 'select' ){
            f.selector_add_options(selector);
        } else if( selector.type === 'number_input' || selector.type === 'text_input' ) {
            selector.elem.value = selector.system_ref.get();
        }
    });

    // Determine active section based on section inputs entered by user
    var sections = g.webpage.sections;
    var active_section;
    sections.every(function(section_name,id){ //TODO: find pre IE9 way to do this?
        if( ! g.f.section_defined(g, section_name) ){
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
    if( (! g.webpage.selections_manual_toggled.location) &&  g.f.section_defined(g, 'location') ){
            $('#section_map').children('.drawer').children('.drawer_content').slideDown('fast');
    }


    // Make preview
    var p;

    // Add preview to page
    $('#drawing_preview').empty().html('');
    for( p in f.mk_preview ){  // f.mk_page is a array of page making functions, so this will loop through the number of pages
        settings.drawing.preview_svgs[p] = f.mk_svg(settings.drawing.preview_parts[p], settings.drawing_settings);
        var section = ['','Electrical','Structural'][p];
        $('#drawing_preview')
            //.append($('<p>Page '+p+'</p>'))
            .append($('<p>'+section+'</p>'))
            .append($(settings.drawing.preview_svgs[p]))
            .append($('</br>'))
            .append($('</br>'));

    }

    // Add drawing to page
    $('#drawing').empty().html('Electrical');
    for( p in settings.drawing.parts ){  // f.mk_page is a array of page making functions, so this will loop through the number of pages
        settings.drawing.svgs[p] = f.mk_svg(settings.drawing.parts[p], settings.drawing_settings);
        $('#drawing')
            //.append($('<p>Page '+p+'</p>'))
            .append($(settings.drawing.svgs[p]))
            .append($('</br>'))
            .append($('</br>'));

    }


};


module.exports = update_webpage;

},{}],23:[function(require,module,exports){
//     Underscore.js 1.8.2
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
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
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

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
  _.VERSION = '1.8.2';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
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
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var isArrayLike = function(collection) {
    var length = collection && collection.length;
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
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
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, target, fromIndex) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    return _.indexOf(obj, target, typeof fromIndex == 'number' && fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
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
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
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
    var set = isArrayLike(obj) ? obj : _.values(obj);
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
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
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
      iteratee = cb(iteratee, context);
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

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
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
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = input && input.length; i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
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
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
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
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, 'length').length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = list && list.length; i < length; i++) {
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
    var i = 0, length = array && array.length;
    if (typeof isSorted == 'number') {
      i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
    } else if (isSorted && length) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (item !== item) {
      return _.findIndex(slice.call(array, i), _.isNaN);
    }
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  _.lastIndexOf = function(array, item, from) {
    var idx = array ? array.length : 0;
    if (typeof from == 'number') {
      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
    }
    if (item !== item) {
      return _.findLastIndex(slice.call(array, 0, idx), _.isNaN);
    }
    while (--idx >= 0) if (array[idx] === item) return idx;
    return -1;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = array != null && array.length;
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createIndexFinder(1);

  _.findLastIndex = createIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
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

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
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
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
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
  _.defer = _.partial(_.delay, _, 1);

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
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
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

      if (last < wait && last >= 0) {
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

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
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

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
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
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

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

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
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

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    
    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
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

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
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

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of 
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
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
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
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
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
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
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
  
  _.prototype.toString = function() {
    return '' + this._wrapped;
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

},{}],24:[function(require,module,exports){
'use strict';


// Setup
    // Load and create main settings, and save them to the root global object.
    var mk_settings = require('./modules/mk_settings');
    window.g = mk_settings();

    console.log('settings', g);


    //var version_string = 'Dev';
    //var version_string = 'Alpha201401--';
    var version_string = 'Preview'+moment().format('YYYYMMDD');
    g.state.version_string = version_string;
    // Load and URL query variables
    var query = g.f.query_string();
    //console.log(query);

    var update_webpage = require('./modules/update_webpage');

    g.f.update = function(){
        var settings = g;
        var f = g.f;

        console.log('/--- begin update');
        g.f.clear_drawing();

        settings.select_registry.forEach(function(selector){
            if(selector.value()) selector.input_ref.set(selector.value());
        });

        // recalculate system settings
        g.f.process(settings);

        update_webpage();

        console.log('\\--- end update');
    };


// request external data

    var newtwork_test = false;

    g.f.request_SVG = function(){
    //*
        console.log('sending data to server');
        var url = 'http://localhost:4233/plans_machine';
        var user_input_json = JSON.stringify(g.user_input);
        var data = { user_input_json: user_input_json};
        //var data = {
        //    test:42,
        //    test2:23,
        //};
        $.ajax({
                type: 'POST',
                url: url,
                data: data,
            })
            .done(function(res){
                console.log('server responce?', res);

            })
            .fail(function() {
                console.log( 'error' );
            })
            .always(function() {
                console.log( 'complete' );
            });

    };

    //var database_json_URL = 'http://10.173.64.204:8000/temporary/';
    var database_json_URL = 'data/fsec_copy.json';
    $.getJSON( database_json_URL)
        .done(function(data){
            g.FSEC_database = data;
            //console.log('database loaded', settings.database);
            g.components = g.f.load_database(data);
            g.state.database_loaded = true;
            if( g.state.mode === 'dev'){
                g.f.settings_dev_defaults(g);
            }
            g.f.update();

            ////////
            // TEMP
            //g.f.request_SVG();
            ////////
        });


// Build webpage

    // Set dev mode if requested
    if( query['mode'] === 'dev' ) {
        g.state.mode = 'dev';
    } else {
        g.state.mode = 'release';
    }

    if( query['password'] === 'sd723sfkbgr8yr' ) {
        g.state.password = true;
    } else {
        g.state.password = false;
    }


    if( g.state.mode === 'dev' ){
        g.f.settings_dev_defaults(g);
    }

    if( g.state.password || query['mode'] === 'dev' ){
        g.f.setup_webpage();

        // Add status bar
        var boot_time = moment();
        var status_id = 'status';
        setInterval(function(){ g.f.update_status_bar(status_id, boot_time, version_string);},1000);

        g.f.update();

    } else {
        console.log('no password');
        $('<img>')
            .attr('src', 'data/PlansMachine.png')
            //.attr('class', 'title_image')
            .css('width', '300px')
            .css('padding', '30px')
            .css('display', 'block')
            .css('margin-left', 'auto')
            .css('margin-right', 'auto')
            .appendTo(document.body);
        $('<div>')
            .attr('style', 'text-align: center')
            .html('Password required for demo')
            .appendTo(document.body);
    }

},{"./modules/mk_settings":10,"./modules/update_webpage":22}]},{},[24])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZGF0YS90YWJsZXMuanNvbiIsImxpYi9rb250YWluZXIuanMiLCJtb2R1bGVzL2Z1bmN0aW9ucy5qcyIsIm1vZHVsZXMvbWtfYmxvY2tzLmpzIiwibW9kdWxlcy9ta19ib3JkZXIuanMiLCJtb2R1bGVzL21rX2RyYXdpbmcuanMiLCJtb2R1bGVzL21rX3BhZ2UuanMiLCJtb2R1bGVzL21rX3BhZ2VfcHJldmlld18xLmpzIiwibW9kdWxlcy9ta19wYWdlX3ByZXZpZXdfMi5qcyIsIm1vZHVsZXMvbWtfc2V0dGluZ3MuanMiLCJtb2R1bGVzL21rX3N2Zy5qcyIsIm1vZHVsZXMvcGFnZS9HLTAwMS5qcyIsIm1vZHVsZXMvcGFnZS9TLTAwMS5qcyIsIm1vZHVsZXMvcGFnZS9XLTAwMS5qcyIsIm1vZHVsZXMvcGFnZS9XLTAwMi5qcyIsIm1vZHVsZXMvcHJvY2Vzcy5qcyIsIm1vZHVsZXMvc2V0dGluZ3NfZGV2X2RlZmF1bHRzLmpzIiwibW9kdWxlcy9zZXR0aW5nc19kcmF3aW5nLmpzIiwibW9kdWxlcy9zZXR0aW5nc19mb250cy5qcyIsIm1vZHVsZXMvc2V0dGluZ3NfbGF5ZXJzLmpzIiwibW9kdWxlcy9zZXR1cF93ZWJwYWdlLmpzIiwibW9kdWxlcy91cGRhdGVfd2VicGFnZS5qcyIsIm5vZGVfbW9kdWxlcy91bmRlcnNjb3JlL3VuZGVyc2NvcmUuanMiLCJ3ZWJwYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy94QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25SQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5bEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2b0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaGdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzPXtcblxuICAgIFwiTkVDIDI1MC4xMjJfaGVhZGVyXCI6IFtcIkFtcFwiLFwiQVdHXCJdLFxuICAgIFwiTkVDIDI1MC4xMjJcIjoge1xuICAgICAgICBcIjE1XCI6XCIxNFwiLFxuICAgICAgICBcIjIwXCI6XCIxMlwiLFxuICAgICAgICBcIjMwXCI6XCIxMFwiLFxuICAgICAgICBcIjQwXCI6XCIxMFwiLFxuICAgICAgICBcIjYwXCI6XCIxMFwiLFxuICAgICAgICBcIjEwMFwiOlwiOFwiLFxuICAgICAgICBcIjIwMFwiOlwiNlwiLFxuICAgICAgICBcIjMwMFwiOlwiNFwiLFxuICAgICAgICBcIjQwMFwiOlwiM1wiLFxuICAgICAgICBcIjUwMFwiOlwiMlwiLFxuICAgICAgICBcIjYwMFwiOlwiMVwiLFxuICAgICAgICBcIjgwMFwiOlwiMS8wXCIsXG4gICAgICAgIFwiMTAwMFwiOlwiMi8wXCIsXG4gICAgICAgIFwiMTIwMFwiOlwiMy8wXCIsXG4gICAgICAgIFwiMTYwMFwiOlwiNC8wXCIsXG4gICAgICAgIFwiMjAwMFwiOlwiMjUwXCIsXG4gICAgICAgIFwiMjUwMFwiOlwiMzUwXCIsXG4gICAgICAgIFwiMzAwMFwiOlwiNDAwXCIsXG4gICAgICAgIFwiNDAwMFwiOlwiNTAwXCIsXG4gICAgICAgIFwiNTAwMFwiOlwiNzAwXCIsXG4gICAgICAgIFwiNjAwMFwiOlwiODAwXCJcbiAgICB9LFxuXG4gICAgXCJORUMgVDY5MC43X2hlYWRlclwiOiBbXCJBbWJpZW50IFRlbXBlcmF0dXJlIChDKVwiLCBcIkNvcnJlY3Rpb24gRmFjdG9yXCJdLFxuICAgIFwiTkVDIFQ2OTAuN1wiOiB7XG4gICAgICAgIFwiMjUgdG8gMjBcIjpcIjEuMDJcIixcbiAgICAgICAgXCIxOSB0byAxNVwiOlwiMS4wNFwiLFxuICAgICAgICBcIjE1IHRvIDEwXCI6XCIxLjA2XCIsXG4gICAgICAgIFwiOSB0byA1XCI6XCIxLjA4XCIsXG4gICAgICAgIFwiNCB0byAwXCI6XCIxLjEwXCIsXG4gICAgICAgIFwiLTEgdG8gLTVcIjpcIjEuMTJcIixcbiAgICAgICAgXCItNiB0byAtMTBcIjpcIjEuMTRcIixcbiAgICAgICAgXCItMTEgdG8gLTE1XCI6XCIxLjE2XCIsXG4gICAgICAgIFwiLTE2IHRvIC0yMFwiOlwiMS4xOFwiLFxuICAgICAgICBcIi0yMSB0byAtMjVcIjpcIjEuMjBcIixcbiAgICAgICAgXCItMjYgdG8gLTMwXCI6XCIxLjIxXCIsXG4gICAgICAgIFwiLTMxIHRvIC0zNVwiOlwiMS4yM1wiLFxuICAgICAgICBcIi0zNiB0byAtNDBcIjpcIjEuMjVcIlxuICAgIH0sXG5cbiAgICBcIkNoIDkgVGFibGUgOCBDb25kdWN0b3IgUHJvcGVydGllc19oZWFkZXJcIjogW1wiU2l6ZVwiLFwib2htL2tmdFwiXSxcbiAgICBcIkNoIDkgVGFibGUgOCBDb25kdWN0b3IgUHJvcGVydGllc1wiOiB7XG4gICAgICAgIFwiIzAxXCI6XCIgMC4xNTRcIixcbiAgICAgICAgXCIjMDEvMFwiOlwiMC4xMjJcIixcbiAgICAgICAgXCIjMDJcIjpcIjAuMTk0XCIsXG4gICAgICAgIFwiIzAyLzBcIjpcIjAuMDk2N1wiLFxuICAgICAgICBcIiMwM1wiOlwiMC4yNDVcIixcbiAgICAgICAgXCIjMDMvMFwiOlwiMC4wNzY2XCIsXG4gICAgICAgIFwiIzA0XCI6XCIwLjMwOFwiLFxuICAgICAgICBcIiMwNC8wXCI6XCIwLjA2MDhcIixcbiAgICAgICAgXCIjMDZcIjpcIjAuNDkxXCIsXG4gICAgICAgIFwiIzA4XCI6XCIwLjc3OFwiLFxuICAgICAgICBcIiMxMFwiOlwiMS4yNFwiLFxuICAgICAgICBcIiMxMlwiOlwiMS45OFwiLFxuICAgICAgICBcIiMxNFwiOlwiMy4xNFwiXG4gICAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIga29udGFpbmVyID0ge1xuICAgIHJlZjogZnVuY3Rpb24ocmVmU3RyaW5nKXtcbiAgICAgICAgaWYoIHR5cGVvZiByZWZTdHJpbmcgPT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWZTdHJpbmc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlZlN0cmluZyA9IHJlZlN0cmluZztcbiAgICAgICAgICAgIHRoaXMucmVmQXJyYXkgPSByZWZTdHJpbmcuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIGlmKCB0eXBlb2YgdGhpcy5vYmplY3QgIT09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgb2JqOiBmdW5jdGlvbihvYmope1xuICAgICAgICBpZiggdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCcgKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9iamVjdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0ID0gb2JqO1xuICAgICAgICAgICAgaWYoIHR5cGVvZiB0aGlzLnJlZlN0cmluZyAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKGlucHV0KXtcbiAgICAgICAgaWYoIHR5cGVvZiB0aGlzLm9iamVjdCA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHRoaXMucmVmU3RyaW5nID09PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLm9iamVjdDtcbiAgICAgICAgdmFyIGxhc3RfbGV2ZWwgPSB0aGlzLnJlZkFycmF5W3RoaXMucmVmQXJyYXkubGVuZ3RoLTFdO1xuXG4gICAgICAgIHRoaXMucmVmQXJyYXkuZm9yRWFjaChmdW5jdGlvbihsZXZlbF9uYW1lLGkpe1xuICAgICAgICAgICAgaWYoIHR5cGVvZiBwYXJlbnRbbGV2ZWxfbmFtZV0gPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgIHBhcmVudFtsZXZlbF9uYW1lXSA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoIGxldmVsX25hbWUgIT09IGxhc3RfbGV2ZWwgKXtcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnRbbGV2ZWxfbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBwYXJlbnRbbGFzdF9sZXZlbF0gPSBpbnB1dDtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnc2V0dGluZzonLCBpbnB1dCwgdGhpcy5nZXQoKSwgdGhpcy5yZWZTdHJpbmcgKTtcbiAgICAgICAgcmV0dXJuIHBhcmVudFtsYXN0X2xldmVsXTtcbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGxldmVsID0gdGhpcy5vYmplY3Q7XG4gICAgICAgIHRoaXMucmVmQXJyYXkuZm9yRWFjaChmdW5jdGlvbihsZXZlbF9uYW1lLGkpe1xuICAgICAgICAgICAgaWYoIHR5cGVvZiBsZXZlbFtsZXZlbF9uYW1lXSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV2ZWwgPSBsZXZlbFtsZXZlbF9uYW1lXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBsZXZlbDtcbiAgICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrb250YWluZXI7XG4iLCIndXNlIHN0cmljdCc7XG52YXIga29udGFpbmVyID0gcmVxdWlyZSgnLi4vbGliL2tvbnRhaW5lcicpO1xuXG52YXIgZiA9IHt9O1xuXG5cbmYuc2V0dXBfYm9keSA9IGZ1bmN0aW9uKHRpdGxlLCBzZWN0aW9ucyl7XG4gICAgZG9jdW1lbnQudGl0bGUgPSB0aXRsZTtcbiAgICB2YXIgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gICAgdmFyIHN0YXR1c19iYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzdGF0dXNfYmFyLmlkID0gJ3N0YXR1cyc7XG4gICAgc3RhdHVzX2Jhci5pbm5lckhUTUwgPSAnbG9hZGluZyBzdGF0dXMuLi4nO1xuICAgIGJvZHkuaW5zZXJ0QmVmb3JlKHN0YXR1c19iYXIsIGJvZHkuZmlyc3RDaGlsZCk7XG59O1xuXG5mLnBhZF96ZXJvID0gZnVuY3Rpb24obnVtLCBzaXplKXtcbiAgICB2YXIgcyA9ICcwMDAwMDAwMDAnICsgbnVtO1xuICAgIHJldHVybiBzLnN1YnN0cihzLmxlbmd0aC1zaXplKTtcbn07XG5cbmYudXB0aW1lID0gZnVuY3Rpb24oYm9vdF90aW1lKXtcbiAgICB2YXIgdXB0aW1lX3NlY29uZHNfdG90YWwgPSBtb21lbnQoKS5kaWZmKGJvb3RfdGltZSwgJ3NlY29uZHMnKTtcbiAgICB2YXIgdXB0aW1lX2hvdXJzID0gTWF0aC5mbG9vciggIHVwdGltZV9zZWNvbmRzX3RvdGFsIC8oNjAqNjApICk7XG4gICAgdmFyIG1pbnV0ZXNfbGVmdCA9IHVwdGltZV9zZWNvbmRzX3RvdGFsICUoNjAqNjApO1xuICAgIHZhciB1cHRpbWVfbWludXRlcyA9IGYucGFkX3plcm8oIE1hdGguZmxvb3IoICBtaW51dGVzX2xlZnQgLzYwICksIDIgKTtcbiAgICB2YXIgdXB0aW1lX3NlY29uZHMgPSBmLnBhZF96ZXJvKCAobWludXRlc19sZWZ0ICUgNjApLCAyICk7XG4gICAgcmV0dXJuIHVwdGltZV9ob3VycyArXCI6XCIrIHVwdGltZV9taW51dGVzICtcIjpcIisgdXB0aW1lX3NlY29uZHM7XG59O1xuXG5mLnVwZGF0ZV9zdGF0dXNfYmFyID0gZnVuY3Rpb24oc3RhdHVzX2lkLCBib290X3RpbWUsIHN0cmluZykge1xuICAgIHZhciBzdGF0dXNfZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3RhdHVzX2lkKTtcbiAgICBzdGF0dXNfZGl2LmlubmVySFRNTCA9IHN0cmluZztcbiAgICBzdGF0dXNfZGl2LmlubmVySFRNTCArPSAnIHwgJztcblxuICAgIHZhciBjbG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjbG9jay5pbm5lckhUTUwgPSBtb21lbnQoKS5mb3JtYXQoJ1lZWVktTU0tREQgSEg6bW06c3MnKTtcblxuICAgIHZhciB1cHRpbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdXB0aW1lLmlubmVySFRNTCA9ICdVcHRpbWU6ICcgKyBmLnVwdGltZShib290X3RpbWUpO1xuXG4gICAgc3RhdHVzX2Rpdi5hcHBlbmRDaGlsZChjbG9jayk7XG4gICAgc3RhdHVzX2Rpdi5pbm5lckhUTUwgKz0gJyB8ICc7XG4gICAgc3RhdHVzX2Rpdi5hcHBlbmRDaGlsZCh1cHRpbWUpO1xuICAgIHN0YXR1c19kaXYuaW5uZXJIVE1MICs9ICcgfCAnO1xufTtcblxuXG5mLm9ial9uYW1lcyA9IGZ1bmN0aW9uKCBvYmplY3QgKSB7XG4gICAgaWYoIG9iamVjdCAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICB2YXIgYSA9IFtdO1xuICAgICAgICBmb3IoIHZhciBpZCBpbiBvYmplY3QgKSB7XG4gICAgICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGlkKSApICB7XG4gICAgICAgICAgICAgICAgYS5wdXNoKGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG59O1xuXG5mLm9iamVjdF9kZWZpbmVkID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICAvL2NvbnNvbGUubG9nKG9iamVjdCk7XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdCApe1xuICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coa2V5KTtcbiAgICAgICAgICAgIGlmKCBvYmplY3Rba2V5XSA9PT0gbnVsbCB8fCBvYmplY3Rba2V5XSA9PT0gdW5kZWZpbmVkICkgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufTtcblxuZi5zZWN0aW9uX2RlZmluZWQgPSBmdW5jdGlvbihzZXR0aW5ncywgc2VjdGlvbl9uYW1lKXtcbiAgICAvL2NvbnNvbGUubG9nKFwiLVwiK3NlY3Rpb25fbmFtZSk7XG4gICAgLy92YXIgaW5wdXRfc2VjdGlvbiA9IGcuaW5wdXRzW3NlY3Rpb25fbmFtZV07XG4gICAgLy92YXIgb3V0cHV0X3NlY3Rpb24gPSBnLnN5c3RlbVtzZWN0aW9uX25hbWVdO1xuICAgIHZhciBvdXRwdXRfc2VjdGlvbiA9IHNldHRpbmdzLnVzZXJfaW5wdXRbc2VjdGlvbl9uYW1lXTtcbiAgICBmb3IoIHZhciBrZXkgaW4gb3V0cHV0X3NlY3Rpb24gKXtcbiAgICAgICAgaWYoIG91dHB1dF9zZWN0aW9uLmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coa2V5KTtcblxuICAgICAgICAgICAgaWYoIG91dHB1dF9zZWN0aW9uW2tleV0gPT09IHVuZGVmaW5lZCB8fCBvdXRwdXRfc2VjdGlvbltrZXldID09PSBudWxsICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbmYubnVsbFRvT2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0ICl7XG4gICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgaWYoIG9iamVjdFtrZXldID09PSBudWxsICl7XG4gICAgICAgICAgICAgICAgb2JqZWN0W2tleV0gPSB7fTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiggdHlwZW9mIG9iamVjdFtrZXldID09PSAnb2JqZWN0JyApIHtcbiAgICAgICAgICAgICAgICBvYmplY3Rba2V5XSA9IGYubnVsbFRvT2JqZWN0KG9iamVjdFtrZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xufTtcblxuZi5ibGFua19jb3B5ID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICB2YXIgbmV3T2JqZWN0ID0ge307XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdCApe1xuICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIGlmKCBvYmplY3Rba2V5XS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICkge1xuICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldID0ge307XG4gICAgICAgICAgICAgICAgZm9yKCB2YXIga2V5MiBpbiBvYmplY3Rba2V5XSApe1xuICAgICAgICAgICAgICAgICAgICBpZiggb2JqZWN0W2tleV0uaGFzT3duUHJvcGVydHkoa2V5MikgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldW2tleTJdID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3T2JqZWN0W2tleV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdPYmplY3Q7XG59O1xuXG5mLmFkZF9zZWN0aW9ucyA9IGZ1bmN0aW9uKGlucHV0cyl7XG4gICAgdmFyIGJsYW5rX3VzZXJfaW5wdXQgPSB7fTtcbiAgICBmb3IoIHZhciBzZWN0aW9uX25hbWUgaW4gaW5wdXRzICl7XG4gICAgICAgIGlmKCBpbnB1dHMuaGFzT3duUHJvcGVydHkoc2VjdGlvbl9uYW1lKSApe1xuICAgICAgICAgICAgaWYoIGlucHV0c1tzZWN0aW9uX25hbWVdLmNvbnN0cnVjdG9yID09PSBPYmplY3QgKSB7XG4gICAgICAgICAgICAgICAgYmxhbmtfdXNlcl9pbnB1dFtzZWN0aW9uX25hbWVdID0ge307XG4gICAgICAgICAgICAgICAgZm9yKCB2YXIgbmFtZSBpbiBpbnB1dHNbc2VjdGlvbl9uYW1lXSApe1xuICAgICAgICAgICAgICAgICAgICBpZiggaW5wdXRzW3NlY3Rpb25fbmFtZV0uaGFzT3duUHJvcGVydHkobmFtZSkgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsYW5rX3VzZXJfaW5wdXRbc2VjdGlvbl9uYW1lXVtuYW1lXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjogc2VjdGlvbiBub3Qgb2JqZWN0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJsYW5rX3VzZXJfaW5wdXQ7XG5cbn07XG5cbmYuYmxhbmtfY2xlYW5fY29weSA9IGZ1bmN0aW9uKG9iamVjdCl7XG4gICAgdmFyIG5ld09iamVjdCA9IHt9O1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QgKXtcbiAgICAgICAgaWYoIG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpICl7XG4gICAgICAgICAgICBpZiggb2JqZWN0W2tleV0uY29uc3RydWN0b3IgPT09IE9iamVjdCApIHtcbiAgICAgICAgICAgICAgICBuZXdPYmplY3Rba2V5XSA9IHt9O1xuICAgICAgICAgICAgICAgIGZvciggdmFyIGtleTIgaW4gb2JqZWN0W2tleV0gKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIG9iamVjdFtrZXldLmhhc093blByb3BlcnR5KGtleTIpICl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2xlYW5fa2V5ID0gZi5jbGVhbl9uYW1lKGtleTIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0W2tleV1bY2xlYW5fa2V5XSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3T2JqZWN0O1xufTtcblxuLy9mLm1lcmdlX29iamVjdHMgPSBmdW5jdGlvbiBtZXJnZV9vYmplY3RzKG9iamVjdDEsIG9iamVjdDIpe1xuLy8gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdDEgKXtcbi8vICAgICAgICBpZiggb2JqZWN0MS5oYXNPd25Qcm9wZXJ0eShrZXkpICl7XG4vLyAgICAgICAgICAgIC8vaWYoIGtleSA9PT0gJ21ha2UnICkgY29uc29sZS5sb2coa2V5LCBvYmplY3QxLCB0eXBlb2Ygb2JqZWN0MVtrZXldLCB0eXBlb2Ygb2JqZWN0MltrZXldKTtcbi8vICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhrZXksIG9iamVjdDEsIHR5cGVvZiBvYmplY3QxW2tleV0sIHR5cGVvZiBvYmplY3QyW2tleV0pO1xuLy8gICAgICAgICAgICBpZiggb2JqZWN0MVtrZXldICYmIG9iamVjdDFba2V5XS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICkge1xuLy8gICAgICAgICAgICAgICAgaWYoIG9iamVjdDJba2V5XSA9PT0gdW5kZWZpbmVkICkgb2JqZWN0MltrZXldID0ge307XG4vLyAgICAgICAgICAgICAgICBtZXJnZV9vYmplY3RzKCBvYmplY3QxW2tleV0sIG9iamVjdDJba2V5XSApO1xuLy8gICAgICAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgICAgICAgaWYoIG9iamVjdDJba2V5XSA9PT0gdW5kZWZpbmVkICkgb2JqZWN0MltrZXldID0gbnVsbDtcbi8vICAgICAgICAgICAgfVxuLy8gICAgICAgIH1cbi8vICAgIH1cbi8vfTtcblxuZi5tZXJnZV9vYmplY3RzID0gZnVuY3Rpb24gbWVyZ2Vfb2JqZWN0cyhvYmplY3QxLCBvYmplY3QyKXtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0MSApe1xuICAgICAgICBpZiggb2JqZWN0MS5oYXNPd25Qcm9wZXJ0eShrZXkpICl7XG4gICAgICAgICAgICAvL2lmKCBrZXkgPT09ICdtYWtlJyApIGNvbnNvbGUubG9nKGtleSwgb2JqZWN0MSwgdHlwZW9mIG9iamVjdDFba2V5XSwgdHlwZW9mIG9iamVjdDJba2V5XSk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGtleSwgb2JqZWN0MSwgdHlwZW9mIG9iamVjdDFba2V5XSwgdHlwZW9mIG9iamVjdDJba2V5XSk7XG4gICAgICAgICAgICBpZiggb2JqZWN0MVtrZXldICYmIG9iamVjdDFba2V5XS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICkge1xuICAgICAgICAgICAgICAgIGlmKCBvYmplY3QyW2tleV0gPT09IHVuZGVmaW5lZCApIG9iamVjdDJba2V5XSA9IHt9O1xuICAgICAgICAgICAgICAgIG1lcmdlX29iamVjdHMoIG9iamVjdDFba2V5XSwgb2JqZWN0MltrZXldICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9iamVjdDJba2V5XSA9IG9iamVjdDFba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmYuYXJyYXlfdG9fb2JqZWN0ID0gZnVuY3Rpb24oYXJyKSB7XG4gICAgdmFyIHIgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7ICsraSlcbiAgICAgICAgcltpXSA9IGFycltpXTtcbiAgICByZXR1cm4gcjtcbn07XG5cbmYubmFuX2NoZWNrID0gZnVuY3Rpb24gbmFuX2NoZWNrKG9iamVjdCwgcGF0aCl7XG4gICAgaWYoIHBhdGggPT09IHVuZGVmaW5lZCApIHBhdGggPSBcIlwiO1xuICAgIHBhdGggPSBwYXRoK1wiLlwiO1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QgKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggXCJOYU5jaGVjazogXCIrcGF0aCtrZXkgKTtcblxuICAgICAgICBpZiggb2JqZWN0W2tleV0gJiYgb2JqZWN0W2tleV0uY29uc3RydWN0b3IgPT09IEFycmF5ICkgb2JqZWN0W2tleV0gPSBmLmFycmF5X3RvX29iamVjdChvYmplY3Rba2V5XSk7XG5cblxuICAgICAgICBpZiggIG9iamVjdFtrZXldICYmICggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgfHwgb2JqZWN0W2tleV0gIT09IG51bGwgKSl7XG4gICAgICAgICAgICBpZiggb2JqZWN0W2tleV0uY29uc3RydWN0b3IgPT09IE9iamVjdCApe1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coIFwiICBPYmplY3Q6IFwiK3BhdGgra2V5ICk7XG4gICAgICAgICAgICAgICAgbmFuX2NoZWNrKCBvYmplY3Rba2V5XSwgcGF0aCtrZXkgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiggb2JqZWN0W2tleV0gPT09IE5hTiB8fCBvYmplY3Rba2V5XSA9PT0gbnVsbCApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBcIk5hTjogXCIrcGF0aCtrZXkgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggXCJEZWZpbmVkOiBcIitwYXRoK2tleSwgb2JqZWN0W2tleV0pO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cbn07XG5cbmYuc3RyX3RvX251bSA9IGZ1bmN0aW9uIHN0cl90b19udW0oaW5wdXQpe1xuICAgIHZhciBvdXRwdXQ7XG4gICAgaWYoIWlzTmFOKGlucHV0KSkgb3V0cHV0ID0gTnVtYmVyKGlucHV0KTtcbiAgICBlbHNlIG91dHB1dCA9IGlucHV0O1xuICAgIHJldHVybiBvdXRwdXQ7XG59O1xuXG5cbmYucHJldHR5X3dvcmQgPSBmdW5jdGlvbihuYW1lKXtcbiAgICByZXR1cm4gbmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG5hbWUuc2xpY2UoMSk7XG59O1xuXG5mLnByZXR0eV9uYW1lID0gZnVuY3Rpb24obmFtZSl7XG4gICAgdmFyIGwgPSBuYW1lLnNwbGl0KCdfJyk7XG4gICAgbC5mb3JFYWNoKGZ1bmN0aW9uKG5hbWVfc2VxbWVudCxpKXtcbiAgICAgICAgbFtpXSA9IGYucHJldHR5X3dvcmQobmFtZV9zZXFtZW50KTtcbiAgICB9KTtcbiAgICB2YXIgcHJldHR5ID0gbC5qb2luKCcgJyk7XG5cbiAgICByZXR1cm4gcHJldHR5O1xufTtcblxuZi5wcmV0dHlfbmFtZXMgPSBmdW5jdGlvbihvYmplY3Qpe1xuICAgIHZhciBuZXdfb2JqZWN0ID0ge307XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdCApe1xuICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIHZhciBuZXdfa2V5ID0gZi5wcmV0dHlfbmFtZShrZXkpO1xuICAgICAgICAgICAgbmV3X29iamVjdFtuZXdfa2V5XSA9IG9iamVjdFtrZXldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdfb2JqZWN0O1xufTtcblxuZi5jbGVhbl9uYW1lID0gZnVuY3Rpb24obmFtZSl7XG4gICAgcmV0dXJuIG5hbWUuc3BsaXQoJyAnKVswXTtcbn07XG5cblxuZi5ta19kcmF3ZXIgPSBmdW5jdGlvbih0aXRsZSwgY29udGVudCl7XG4gICAgdmFyIGRyYXdlcl9jb250YWluZXIgPSAkKCc8ZGl2PicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2lucHV0X3NlY3Rpb24nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCdpZCcsICdzZWN0aW9uXycrdGl0bGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vLmF0dHIoJ2lkJywgdGl0bGUgKTtcbiAgICAvL2RyYXdlcl9jb250YWluZXIuZ2V0KDApLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5X3R5cGU7XG4gICAgdmFyIHN5c3RlbV9kaXYgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3RpdGxlX2JhcicpXG4gICAgICAgIC5hdHRyKCdzZWN0aW9uX25vbScsIHRpdGxlKVxuICAgICAgICAuYXBwZW5kVG8oZHJhd2VyX2NvbnRhaW5lcilcbiAgICAgICAgLyoganNoaW50IC1XMDgzICovXG4gICAgICAgIC5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIG5hbWUgPSAkKHRoaXMpLmF0dHIoJ3NlY3Rpb25fbm9tJyk7XG4gICAgICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0aW9uc19tYW51YWxfdG9nZ2xlZFtuYW1lXSA9IHRydWU7XG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlVG9nZ2xlKCdmYXN0Jyk7XG4gICAgICAgIH0pO1xuICAgIHZhciBzeXN0ZW1fdGl0bGUgPSAkKCc8YT4nKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAndGl0bGVfYmFyX3RleHQnKVxuICAgICAgICAuYXR0cignaHJlZicsICcjJylcbiAgICAgICAgLnRleHQoZi5wcmV0dHlfbmFtZSh0aXRsZSkpXG4gICAgICAgIC5hcHBlbmRUbyhzeXN0ZW1fZGl2KTtcblxuICAgIHZhciBkcmF3ZXIgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ2RyYXdlcicpLmFwcGVuZFRvKGRyYXdlcl9jb250YWluZXIpO1xuICAgIGNvbnRlbnQuYXR0cignY2xhc3MnLCAnZHJhd2VyX2NvbnRlbnQnKS5hcHBlbmRUbyhkcmF3ZXIpO1xuXG5cbiAgICByZXR1cm4gZHJhd2VyX2NvbnRhaW5lcjtcblxuXG59O1xuXG5cbmYuYWRkX3NlbGVjdG9ycyA9IGZ1bmN0aW9uKHNldHRpbmdzLCBwYXJlbnRfY29udGFpbmVyKXtcbiAgICBmb3IoIHZhciBzZWN0aW9uX25hbWUgaW4gc2V0dGluZ3MuaW5wdXRzICl7XG5cbiAgICAgICAgLy8kKHRoaXMpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgIHZhciBkcmF3ZXJfY29udGVudCA9ICQoJzxkaXY+Jyk7XG4gICAgICAgIGZvciggdmFyIGlucHV0X25hbWUgaW4gc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV0gKXtcbiAgICAgICAgICAgIHZhciB1bml0cztcbiAgICAgICAgICAgIGlmKCAoc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0gIT09IHVuZGVmaW5lZCkgJiYgKHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdLnVuaXRzICE9PSB1bmRlZmluZWQpICkge1xuICAgICAgICAgICAgICAgIHVuaXRzID0gXCIoXCIgKyBzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXS51bml0cyArIFwiKVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1bml0cyA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbm90ZTtcbiAgICAgICAgICAgIGlmKCAoc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0gIT09IHVuZGVmaW5lZCkgJiYgKHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdLm5vdGUgIT09IHVuZGVmaW5lZCkgKSB7XG4gICAgICAgICAgICAgICAgbm90ZSA9IHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdLm5vdGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5vdGUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3Jfc2V0ID0gJCgnPHNwYW4+JykuYXR0cignY2xhc3MnLCAnc2VsZWN0b3Jfc2V0JykuYXBwZW5kVG8oZHJhd2VyX2NvbnRlbnQpO1xuICAgICAgICAgICAgdmFyIGlucHV0X3RleHQgPSAkKCc8c3Bhbj4nKS5odG1sKGYucHJldHR5X25hbWUoaW5wdXRfbmFtZSkgKyAnOiAnICsgdW5pdHMgKS5hcHBlbmRUbyhzZWxlY3Rvcl9zZXQpO1xuICAgICAgICAgICAgaWYoIG5vdGUgKSBpbnB1dF90ZXh0LmF0dHIoJ3RpdGxlJywgbm90ZSk7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgdmFyIHNlbGVjdG9yID0gayQoJ3NlbGVjdG9yJylcbiAgICAgICAgICAgICAgICAuc2V0T3B0aW9uc1JlZiggJ2lucHV0cy4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSApXG4gICAgICAgICAgICAgICAgLnNldFJlZiggJ3N5c3RlbS4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSApXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKHNlbGVjdG9yX3NldCk7XG4gICAgICAgICAgICBmLmtlbGVtX3NldHVwKHNlbGVjdG9yLCBzZXR0aW5ncyk7XG4gICAgICAgICAgICAvLyovXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICAgICAgc3lzdGVtX3JlZjogT2JqZWN0LmNyZWF0ZShrb250YWluZXIpLm9iaihnKS5yZWYoJ3N5c3RlbS4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSksXG4gICAgICAgICAgICAgICAgaW5wdXRfcmVmOiBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcikub2JqKGcpLnJlZigndXNlcl9pbnB1dC4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSksXG4gICAgICAgICAgICAgICAgbGlzdF9yZWY6IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKS5vYmooZykucmVmKCdpbnB1dHMuJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUgKyAnLm9wdGlvbnMnKSxcbiAgICAgICAgICAgICAgICBpbnRlcmFjdGVkOiBmYWxzZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiggKHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdICE9PSB1bmRlZmluZWQpICYmIChzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXS50eXBlICE9PSB1bmRlZmluZWQpICkge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLnR5cGUgPSBzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXS50eXBlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci50eXBlID0gJ3NlbGVjdCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiggc2VsZWN0b3IudHlwZSA9PT0gJ3NlbGVjdCcgKXtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci5lbGVtID0gJCgnPHNlbGVjdD4nKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnc2VsZWN0b3InKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oc2VsZWN0b3Jfc2V0KVxuICAgICAgICAgICAgICAgICAgICAuZ2V0KClbMF07XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IudmFsdWUgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCB0aGlzLnNldF9yZWYucmVmU3RyaW5nLCB0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleCApO1xuICAgICAgICAgICAgICAgICAgICAvL2lmKCB0aGlzLmludGVyYWN0ZWQgKVxuICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXggPj0gMCkgcmV0dXJuIHRoaXMuZWxlbS5vcHRpb25zW3RoaXMuZWxlbS5zZWxlY3RlZEluZGV4XS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBmLnNlbGVjdG9yX2FkZF9vcHRpb25zKHNlbGVjdG9yKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmKCBzZWxlY3Rvci50eXBlID09PSAnbnVtYmVyX2lucHV0JyB8fCBzZWxlY3Rvci50eXBlID09PSAndGV4dF9pbnB1dCcpe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLmVsZW0gPSAkKCc8aW5wdXQ+JylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgc2VsZWN0b3IudHlwZSlcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3R5cGUnLCAndGV4dCcpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhzZWxlY3Rvcl9zZXQpXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoKVswXTtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci52YWx1ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coIHRoaXMuc2V0X3JlZi5yZWZTdHJpbmcsIHRoaXMuZWxlbS5zZWxlY3RlZEluZGV4ICk7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coIHRoaXMuZWxlbSwgdGhpcy5lbGVtLnZhbHVlICk7XG4gICAgICAgICAgICAgICAgICAgIC8vaWYoIHRoaXMuaW50ZXJhY3RlZCApXG4gICAgICAgICAgICAgICAgICAgIC8vaWYoIHRoaXMuZWxlbS5zZWxlY3RlZEluZGV4ID49IDApIHJldHVybiB0aGlzLmVsZW0ub3B0aW9uc1t0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIC8vZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW0udmFsdWU7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci5lbGVtLnZhbHVlID0gc2VsZWN0b3IuaW5wdXRfcmVmLmdldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChzZWxlY3Rvci5lbGVtKS5jaGFuZ2UoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgIHNldHRpbmdzLmYudXBkYXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNldHRpbmdzLnNlbGVjdF9yZWdpc3RyeS5wdXNoKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIC8vJCgnPC9icj4nKS5hcHBlbmRUbyhkcmF3ZXJfY29udGVudCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZWxlY3Rpb25fY29udGFpbmVyID0gZi5ta19kcmF3ZXIoc2VjdGlvbl9uYW1lLCBkcmF3ZXJfY29udGVudCk7XG5cbiAgICAgICAgc2VsZWN0aW9uX2NvbnRhaW5lci5hcHBlbmRUbyhwYXJlbnRfY29udGFpbmVyKTtcblxuICAgICAgICAkKHNlbGVjdGlvbl9jb250YWluZXIpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlVXAoJ2Zhc3QnKTtcbiAgICB9XG59O1xuXG5mLnNlbGVjdG9yX2FkZF9vcHRpb25zID0gZnVuY3Rpb24oc2VsZWN0b3Ipe1xuICAgIHZhciBsaXN0ID0gc2VsZWN0b3IubGlzdF9yZWYuZ2V0KCk7XG4gICAgaWYoIGxpc3QgJiYgbGlzdC5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdcImxpc3RcIicsIGxpc3QpO1xuICAgICAgICBsaXN0ID0gZi5vYmpfbmFtZXMobGlzdCk7XG4gICAgfVxuICAgIHNlbGVjdG9yLmVsZW0uaW5uZXJIVE1MID0gXCJcIjtcbiAgICBpZiggbGlzdCBpbnN0YW5jZW9mIEFycmF5ICl7XG4gICAgICAgIHZhciBjdXJyZW50X3ZhbHVlID0gc2VsZWN0b3IuaW5wdXRfcmVmLmdldCgpO1xuICAgICAgICAkKCc8b3B0aW9uPicpLmF0dHIoJ3NlbGVjdGVkJyx0cnVlKS5hdHRyKCdkaXNhYmxlZCcsdHJ1ZSkuYXR0cignaGlkZGVuJyx0cnVlKS5hcHBlbmRUbyhzZWxlY3Rvci5lbGVtKTtcblxuICAgICAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24ob3B0X25hbWUpe1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhvcHRfbmFtZSk7XG4gICAgICAgICAgICB2YXIgbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICAgICAgby52YWx1ZSA9IG9wdF9uYW1lO1xuICAgICAgICAgICAgaWYoIGN1cnJlbnRfdmFsdWUgKXtcbiAgICAgICAgICAgICAgICBpZiggb3B0X25hbWUudG9TdHJpbmcoKSA9PT0gY3VycmVudF92YWx1ZS50b1N0cmluZygpICkge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdmb3VuZCBpdDonLCBvcHRfbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIG8uc2VsZWN0ZWQgPSBcInNlbGVjdGVkXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZG9lcyBub3QgbWF0Y2g6ICcsIG9wdF9uYW1lLCBcIixcIiwgIGN1cnJlbnRfdmFsdWUsIFwiLlwiICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vby5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3NlbGVjdG9yX29wdGlvbicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdubyBjdXJyZW50IHZhbHVlJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG8uaW5uZXJIVE1MID0gb3B0X25hbWU7XG4gICAgICAgICAgICBzZWxlY3Rvci5lbGVtLmFwcGVuZENoaWxkKG8pO1xuICAgICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ2xpc3Qgbm90IGEgbGlzdCcsIGxpc3QsIHNlbGVjdCk7XG4gICAgfVxufTtcblxuZi5hZGRfb3B0aW9ucyA9IGZ1bmN0aW9uKHNlbGVjdCwgYXJyYXkpe1xuICAgIGFycmF5LmZvckVhY2goIGZ1bmN0aW9uKG9wdGlvbil7XG4gICAgICAgICQoJzxvcHRpb24+JykuYXR0ciggJ3ZhbHVlJywgb3B0aW9uICkudGV4dChvcHRpb24pLmFwcGVuZFRvKHNlbGVjdCk7XG4gICAgfSk7XG59O1xuXG5cbi8vZi5hZGRfcGFyYW1zID0gZnVuY3Rpb24oc2V0dGluZ3MsIHBhcmVudF9jb250YWluZXIpe1xuLy8gICAgZm9yKCB2YXIgc2VjdGlvbl9uYW1lIGluIHNldHRpbmdzLnN5c3RlbSApe1xuLy8gICAgICAgIGlmKCB0cnVlIHx8IGYub2JqZWN0X2RlZmluZWQoc2V0dGluZ3Muc3lzdGVtW3NlY3Rpb25fbmFtZV0pICl7XG4vLyAgICAgICAgICAgIHZhciBzZWxlY3Rpb25fY29udGFpbmVyID0gJCgnPGRpdj4nKS5hdHRyKCdjbGFzcycsICdwYXJhbV9zZWN0aW9uJykuYXR0cignaWQnLCBzZWN0aW9uX25hbWUgKS5hcHBlbmRUbyhwYXJlbnRfY29udGFpbmVyKTtcbi8vICAgICAgICAgICAgLy9zZWxlY3Rpb25fY29udGFpbmVyLmdldCgwKS5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheV90eXBlO1xuLy8gICAgICAgICAgICB2YXIgc3lzdGVtX2RpdiA9ICQoJzxkaXY+Jylcbi8vICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd0aXRsZV9saW5lJylcbi8vICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhzZWxlY3Rpb25fY29udGFpbmVyKVxuLy8gICAgICAgICAgICAgICAgLyoganNoaW50IC1XMDgzICovXG4vLyAgICAgICAgICAgICAgICAuY2xpY2soZnVuY3Rpb24oKXtcbi8vICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlVG9nZ2xlKCdmYXN0Jyk7XG4vLyAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgdmFyIHN5c3RlbV90aXRsZSA9ICQoJzxhPicpXG4vLyAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAndGl0bGVfbGluZV90ZXh0Jylcbi8vICAgICAgICAgICAgICAgIC5hdHRyKCdocmVmJywgJyMnKVxuLy8gICAgICAgICAgICAgICAgLnRleHQoZi5wcmV0dHlfbmFtZShzZWN0aW9uX25hbWUpKVxuLy8gICAgICAgICAgICAgICAgLmFwcGVuZFRvKHN5c3RlbV9kaXYpO1xuLy8gICAgICAgICAgICAkKHRoaXMpLnRyaWdnZXIoJ2NsaWNrJyk7XG4vLyAgICAgICAgICAgIHZhciBkcmF3ZXIgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJycpLmFwcGVuZFRvKHNlbGVjdGlvbl9jb250YWluZXIpO1xuLy8gICAgICAgICAgICB2YXIgZHJhd2VyX2NvbnRlbnQgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3BhcmFtX3NlY3Rpb25fY29udGVudCcpLmFwcGVuZFRvKGRyYXdlcik7XG4vLyAgICAgICAgICAgIGZvciggdmFyIGlucHV0X25hbWUgaW4gc2V0dGluZ3Muc3lzdGVtW3NlY3Rpb25fbmFtZV0gKXtcbi8vICAgICAgICAgICAgICAgICQoJzxzcGFuPicpLmh0bWwoZi5wcmV0dHlfbmFtZShpbnB1dF9uYW1lKSArICc6ICcpLmFwcGVuZFRvKGRyYXdlcl9jb250ZW50KTtcbi8vICAgICAgICAgICAgICAgIC8qXG4vLyAgICAgICAgICAgICAgICB2YXIgc2VsZWN0b3IgPSBrJCgndmFsdWUnKVxuLy8gICAgICAgICAgICAgICAgICAgIC8vLnNldE9wdGlvbnNSZWYoICdpbnB1dHMuJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUgKVxuLy8gICAgICAgICAgICAgICAgICAgIC5zZXRSZWYoICdzeXN0ZW0uJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUgKVxuLy8gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhkcmF3ZXJfY29udGVudCk7XG4vLyAgICAgICAgICAgICAgICBmLmtlbGVtX3NldHVwKHNlbGVjdG9yLCBzZXR0aW5ncyk7XG4vLyAgICAgICAgICAgICAgICAvLyovXG4vLyAgICAgICAgICAgICAgICB2YXIgdmFsdWVfa29udGFpbmVyID0gT2JqZWN0LmNyZWF0ZShrb250YWluZXIpXG4vLyAgICAgICAgICAgICAgICAgICAgLm9iaihzZXR0aW5ncylcbi8vICAgICAgICAgICAgICAgICAgICAucmVmKCdzeXN0ZW0uJyArIHNlY3Rpb25fbmFtZSArICcuJyArIGlucHV0X25hbWUpO1xuLy8gICAgICAgICAgICAgICAgdmFyICRlbGVtID0gJCgnPHNwYW4+Jylcbi8vICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnJylcbi8vICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oZHJhd2VyX2NvbnRlbnQpXG4vLyAgICAgICAgICAgICAgICAgICAgLnRleHQodmFsdWVfa29udGFpbmVyLmdldCgpKTtcbi8vICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHtcbi8vICAgICAgICAgICAgICAgICAgICBlbGVtOiAkZWxlbS5nZXQoKVswXSxcbi8vICAgICAgICAgICAgICAgICAgICB2YWx1ZV9yZWY6IHZhbHVlX2tvbnRhaW5lclxuLy8gICAgICAgICAgICAgICAgfTtcbi8vICAgICAgICAgICAgICAgIHNldHRpbmdzLnZhbHVlX3JlZ2lzdHJ5LnB1c2godmFsdWUpO1xuLy8gICAgICAgICAgICAgICAgJCgnPC9icj4nKS5hcHBlbmRUbyhkcmF3ZXJfY29udGVudCk7XG4vLyAgICAgICAgICAgIH1cbi8vICAgICAgICB9XG4vLyAgICB9XG4vL307XG4vL1xuLy9mLnVwZGF0ZV92YWx1ZXMgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4vLyAgICBzZXR0aW5ncy52YWx1ZV9yZWdpc3RyeS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlX2l0ZW0pe1xuLy8gICAgICAgIC8vY29uc29sZS5sb2coIHZhbHVlX2l0ZW0gKTtcbi8vICAgICAgICAvL2NvbnNvbGUubG9nKCB2YWx1ZV9pdGVtLmVsZW0ub3B0aW9ucyApO1xuLy8gICAgICAgIC8vY29uc29sZS5sb2coIHZhbHVlX2l0ZW0uZWxlbS5zZWxlY3RlZEluZGV4ICk7XG4vLyAgICAgICAgaWYodmFsdWVfaXRlbS5lbGVtLnNlbGVjdGVkSW5kZXgpe1xuLy8gICAgICAgICAgICB2YWx1ZV9pdGVtLnZhbHVlID0gdmFsdWVfaXRlbS5lbGVtLm9wdGlvbnNbdmFsdWVfaXRlbS5lbGVtLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuLy8gICAgICAgICAgICB2YWx1ZV9pdGVtLmtvbnRhaW5lci5zZXQodmFsdWVfaXRlbS52YWx1ZSk7XG4vL1xuLy8gICAgICAgIH1cbi8vICAgIH0pO1xuLy99O1xuLy9cbi8vZi5zaG93X2hpZGVfcGFyYW1zID0gZnVuY3Rpb24ocGFnZV9zZWN0aW9ucywgc2V0dGluZ3Mpe1xuLy8gICAgZm9yKCB2YXIgbGlzdF9uYW1lIGluIHBhZ2Vfc2VjdGlvbnMgKXtcbi8vICAgICAgICB2YXIgaWQgPSAnIycrbGlzdF9uYW1lO1xuLy8gICAgICAgIHZhciBzZWN0aW9uX25hbWUgPSBsaXN0X25hbWUuc3BsaXQoJ18nKVswXTtcbi8vICAgICAgICB2YXIgc2VjdGlvbiA9IGskKGlkKTtcbi8vICAgICAgICBpZiggc2V0dGluZ3Muc3RhdHVzLnNlY3Rpb25zW3NlY3Rpb25fbmFtZV0uc2V0ICkgc2VjdGlvbi5zaG93KCk7XG4vLyAgICAgICAgZWxzZSBzZWN0aW9uLmhpZGUoKTtcbi8vICAgIH1cbi8vfTtcblxuLy9mLnNob3dfaGlkZV9zZWxlY3Rpb25zID0gZnVuY3Rpb24oc2V0dGluZ3MsIGFjdGl2ZV9zZWN0aW9uX25hbWUpe1xuLy8gICAgJCgnI3NlY3Rpb25TZWxlY3RvcicpLnZhbChhY3RpdmVfc2VjdGlvbl9uYW1lKTtcbi8vICAgIGZvciggdmFyIGxpc3RfbmFtZSBpbiBzZXR0aW5ncy5pbnB1dCApe1xuLy8gICAgICAgIHZhciBpZCA9ICcjJytsaXN0X25hbWU7XG4vLyAgICAgICAgdmFyIHNlY3Rpb25fbmFtZSA9IGxpc3RfbmFtZS5zcGxpdCgnXycpWzBdO1xuLy8gICAgICAgIHZhciBzZWN0aW9uID0gayQoaWQpO1xuLy8gICAgICAgIGlmKCBzZWN0aW9uX25hbWUgPT09IGFjdGl2ZV9zZWN0aW9uX25hbWUgKSBzZWN0aW9uLnNob3coKTtcbi8vICAgICAgICBlbHNlIHNlY3Rpb24uaGlkZSgpO1xuLy8gICAgfVxuLy99O1xuXG4vL2Yuc2V0RG93bmxvYWRMaW5rKHNldHRpbmdzKXtcbi8vXG4vLyAgICBpZiggc2V0dGluZ3MuUERGICYmIHNldHRpbmdzLlBERi51cmwgKXtcbi8vICAgICAgICB2YXIgbGluayA9ICQoJ2EnKS5hdHRyKCdocmVmJywgc2V0dGluZ3MuUERGLnVybCApLmF0dHIoJ2Rvd25sb2FkJywgJ1BWX2RyYXdpbmcucGRmJykuaHRtbCgnRG93bmxvYWQgRHJhd2luZycpO1xuLy8gICAgICAgICQoJyNkb3dubG9hZCcpLmh0bWwoJycpLmFwcGVuZChsaW5rKTtcbi8vICAgIH1cbi8vfVxuXG4vL2YubG9hZFRhYmxlcyA9IGZ1bmN0aW9uKHN0cmluZyl7XG4vLyAgICB2YXIgdGFibGVzID0ge307XG4vLyAgICB2YXIgbCA9IHN0cmluZy5zcGxpdCgnXFxuJyk7XG4vLyAgICB2YXIgdGl0bGU7XG4vLyAgICB2YXIgZmllbGRzO1xuLy8gICAgdmFyIG5lZWRfdGl0bGUgPSB0cnVlO1xuLy8gICAgdmFyIG5lZWRfZmllbGRzID0gdHJ1ZTtcbi8vICAgIGwuZm9yRWFjaCggZnVuY3Rpb24oc3RyaW5nLCBpKXtcbi8vICAgICAgICB2YXIgbGluZSA9IHN0cmluZy50cmltKCk7XG4vLyAgICAgICAgaWYoIGxpbmUubGVuZ3RoID09PSAwICl7XG4vLyAgICAgICAgICAgIG5lZWRfdGl0bGUgPSB0cnVlO1xuLy8gICAgICAgICAgICBuZWVkX2ZpZWxkcyA9IHRydWU7XG4vLyAgICAgICAgfSBlbHNlIGlmKCBuZWVkX3RpdGxlICkge1xuLy8gICAgICAgICAgICB0aXRsZSA9IGxpbmU7XG4vLyAgICAgICAgICAgIHRhYmxlc1t0aXRsZV0gPSBbXTtcbi8vICAgICAgICAgICAgbmVlZF90aXRsZSA9IGZhbHNlO1xuLy8gICAgICAgIH0gZWxzZSBpZiggbmVlZF9maWVsZHMgKSB7XG4vLyAgICAgICAgICAgIGZpZWxkcyA9IGxpbmUuc3BsaXQoJywnKTtcbi8vICAgICAgICAgICAgdGFibGVzW3RpdGxlK1wiX2ZpZWxkc1wiXSA9IGZpZWxkcztcbi8vICAgICAgICAgICAgbmVlZF9maWVsZHMgPSBmYWxzZTtcbi8vICAgICAgICAvL30gZWxzZSB7XG4vLyAgICAgICAgLy8gICAgdmFyIGVudHJ5ID0ge307XG4vLyAgICAgICAgLy8gICAgdmFyIGxpbmVfYXJyYXkgPSBsaW5lLnNwbGl0KCcsJyk7XG4vLyAgICAgICAgLy8gICAgZmllbGRzLmZvckVhY2goIGZ1bmN0aW9uKGZpZWxkLCBpZCl7XG4vLyAgICAgICAgLy8gICAgICAgIGVudHJ5W2ZpZWxkLnRyaW0oKV0gPSBsaW5lX2FycmF5W2lkXS50cmltKCk7XG4vLyAgICAgICAgLy8gICAgfSk7XG4vLyAgICAgICAgLy8gICAgdGFibGVzW3RpdGxlXS5wdXNoKCBlbnRyeSApO1xuLy8gICAgICAgIC8vfVxuLy8gICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgICAgIHZhciBsaW5lX2FycmF5ID0gbGluZS5zcGxpdCgnLCcpO1xuLy8gICAgICAgICAgICB0YWJsZXNbdGl0bGVdW2xpbmVfYXJyYXlbMF0udHJpbSgpXSA9IGxpbmVfYXJyYXlbMV0udHJpbSgpO1xuLy8gICAgICAgIH1cbi8vICAgIH0pO1xuLy9cbi8vICAgIHJldHVybiB0YWJsZXM7XG4vL307XG4vL1xuLy9mLmxvYWRDb21wb25lbnRzID0gZnVuY3Rpb24oc3RyaW5nKXtcbi8vICAgIHZhciBkYiA9IGsucGFyc2VDU1Yoc3RyaW5nKTtcbi8vICAgIHZhciBvYmplY3QgPSB7fTtcbi8vICAgIGZvciggdmFyIGkgaW4gZGIgKXtcbi8vICAgICAgICB2YXIgY29tcG9uZW50ID0gZGJbaV07XG4vLyAgICAgICAgaWYoIG9iamVjdFtjb21wb25lbnQuTWFrZV0gPT09IHVuZGVmaW5lZCApe1xuLy8gICAgICAgICAgICBvYmplY3RbY29tcG9uZW50Lk1ha2VdID0ge307XG4vLyAgICAgICAgfVxuLy8gICAgICAgIGlmKCBvYmplY3RbY29tcG9uZW50Lk1ha2VdW2NvbXBvbmVudC5Nb2RlbF0gPT09IHVuZGVmaW5lZCApe1xuLy8gICAgICAgICAgICBvYmplY3RbY29tcG9uZW50Lk1ha2VdW2NvbXBvbmVudC5Nb2RlbF0gPSB7fTtcbi8vICAgICAgICB9XG4vL1xuLy8gICAgICAgIHZhciBmaWVsZHMgPSBrLm9iaklkQXJyYXkoY29tcG9uZW50KTtcbi8vICAgICAgICBmaWVsZHMuZm9yRWFjaCggZnVuY3Rpb24oIGZpZWxkICl7XG4vLyAgICAgICAgICAgIHZhciBwYXJhbSA9IGNvbXBvbmVudFtmaWVsZF07XG4vLyAgICAgICAgICAgIGlmKCAhKCBmaWVsZCBpbiBbJ01ha2UnLCAnTW9kZWwnXSApICYmICEoIGlzTmFOKHBhcnNlRmxvYXQocGFyYW0pKSApICl7XG4vLyAgICAgICAgICAgICAgICBjb21wb25lbnRbZmllbGRdID0gcGFyc2VGbG9hdChwYXJhbSk7XG4vLyAgICAgICAgICAgIH1cbi8vICAgICAgICB9KVxuLy8gICAgICAgIG9iamVjdFtjb21wb25lbnQuTWFrZV1bY29tcG9uZW50Lk1vZGVsXSA9IGNvbXBvbmVudDtcbi8vICAgIH1cbi8vICAgIHJldHVybiBvYmplY3Q7XG4vL307XG5cblxuXG5cbmYubG9hZF9kYXRhYmFzZSA9IGZ1bmN0aW9uKEZTRUNfZGF0YWJhc2Vfb2JqKXtcbiAgICBGU0VDX2RhdGFiYXNlX29iaiA9IGYubG93ZXJjYXNlX3Byb3BlcnRpZXMoRlNFQ19kYXRhYmFzZV9vYmopO1xuICAgIHZhciBjb21wb25lbnRzID0ge307XG4gICAgY29tcG9uZW50cy5pbnZlcnRlcnMgPSB7fTtcbiAgICBGU0VDX2RhdGFiYXNlX29iai5pbnZlcnRlcnMuZm9yRWFjaChmdW5jdGlvbihjb21wb25lbnQpe1xuICAgICAgICBpZiggY29tcG9uZW50cy5pbnZlcnRlcnNbY29tcG9uZW50Lm1ha2VdID09PSB1bmRlZmluZWQgKSBjb21wb25lbnRzLmludmVydGVyc1tjb21wb25lbnQubWFrZV0gPSB7fTtcbiAgICAgICAgLy9jb21wb25lbnRzLmludmVydGVyc1tjb21wb25lbnQubWFrZV1bY29tcG9uZW50Lm1ha2VdID0gZi5wcmV0dHlfbmFtZXMoY29tcG9uZW50KTtcbiAgICAgICAgY29tcG9uZW50cy5pbnZlcnRlcnNbY29tcG9uZW50Lm1ha2VdW2NvbXBvbmVudC5tb2RlbF0gPSBjb21wb25lbnQ7XG4gICAgfSk7XG4gICAgY29tcG9uZW50cy5tb2R1bGVzID0ge307XG4gICAgRlNFQ19kYXRhYmFzZV9vYmoubW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uKGNvbXBvbmVudCl7XG4gICAgICAgIGlmKCBjb21wb25lbnRzLm1vZHVsZXNbY29tcG9uZW50Lm1ha2VdID09PSB1bmRlZmluZWQgKSBjb21wb25lbnRzLm1vZHVsZXNbY29tcG9uZW50Lm1ha2VdID0ge307XG4gICAgICAgIC8vY29tcG9uZW50cy5tb2R1bGVzW2NvbXBvbmVudC5tYWtlXVtjb21wb25lbnQubWFrZV0gPSBmLnByZXR0eV9uYW1lcyhjb21wb25lbnQpO1xuICAgICAgICBjb21wb25lbnRzLm1vZHVsZXNbY29tcG9uZW50Lm1ha2VdW2NvbXBvbmVudC5tb2RlbF0gPSBjb21wb25lbnQ7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29tcG9uZW50cztcbn07XG5cblxuZi5nZXRfcmVmID0gZnVuY3Rpb24oc3RyaW5nLCBvYmplY3Qpe1xuICAgIHZhciByZWZfYXJyYXkgPSBzdHJpbmcuc3BsaXQoJy4nKTtcbiAgICB2YXIgbGV2ZWwgPSBvYmplY3Q7XG4gICAgcmVmX2FycmF5LmZvckVhY2goZnVuY3Rpb24obGV2ZWxfbmFtZSxpKXtcbiAgICAgICAgaWYoIHR5cGVvZiBsZXZlbFtsZXZlbF9uYW1lXSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbGV2ZWwgPSBsZXZlbFtsZXZlbF9uYW1lXTtcbiAgICB9KTtcbiAgICByZXR1cm4gbGV2ZWw7XG59O1xuZi5zZXRfcmVmID0gZnVuY3Rpb24oIG9iamVjdCwgcmVmX3N0cmluZywgdmFsdWUgKXtcbiAgICB2YXIgcmVmX2FycmF5ID0gcmVmX3N0cmluZy5zcGxpdCgnLicpO1xuICAgIHZhciBsZXZlbCA9IG9iamVjdDtcbiAgICByZWZfYXJyYXkuZm9yRWFjaChmdW5jdGlvbihsZXZlbF9uYW1lLGkpe1xuICAgICAgICBpZiggdHlwZW9mIGxldmVsW2xldmVsX25hbWVdID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXZlbCA9IGxldmVsW2xldmVsX25hbWVdO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGxldmVsO1xufTtcblxuXG5cblxuZi5sb2dfaWZfZGF0YWJhc2VfbG9hZGVkID0gZnVuY3Rpb24oZSl7XG4gICAgaWYoZi5nLnN0YXRlLmRhdGFiYXNlX2xvYWRlZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICB9XG59O1xuXG5cblxuZi5sb3dlcmNhc2VfcHJvcGVydGllcyA9IGZ1bmN0aW9uIGxvd2VyY2FzZV9wcm9wZXJ0aWVzKG9iaikge1xuICAgIHZhciBuZXdfb2JqZWN0ID0gbmV3IG9iai5jb25zdHJ1Y3RvcigpO1xuICAgIGZvciggdmFyIG9sZF9uYW1lIGluIG9iaiApe1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KG9sZF9uYW1lKSkge1xuICAgICAgICAgICAgdmFyIG5ld19uYW1lID0gb2xkX25hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGlmKCBvYmpbb2xkX25hbWVdLmNvbnN0cnVjdG9yID09PSBPYmplY3QgfHwgb2JqW29sZF9uYW1lXS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkgKXtcbiAgICAgICAgICAgICAgICBuZXdfb2JqZWN0W25ld19uYW1lXSA9IGxvd2VyY2FzZV9wcm9wZXJ0aWVzKG9ialtvbGRfbmFtZV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdfb2JqZWN0W25ld19uYW1lXSA9IG9ialtvbGRfbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cbiAgICByZXR1cm4gbmV3X29iamVjdDtcbn07XG5cblxuZi50b2dnbGVfbW9kdWxlID0gZnVuY3Rpb24oZWxlbWVudCl7XG4gICAgLy9jb25zb2xlLmxvZygnc3dpdGNoJywgZWxlbWVudCwgZWxlbWVudC5jbGFzc0xpcyApO1xuXG4gICAgLy9lbGVtZW50LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgbnVsbCk7XG5cbiAgICB2YXIgZWxlbSA9ICQoZWxlbWVudCk7XG4gICAgLy9jb25zb2xlLmxvZygnc3dpdGNoJywgZWxlbVswXS5jbGFzc0xpc3QuY29udGFpbnMoJ3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGUnKSApO1xuXG4gICAgdmFyIHIgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnbW9kdWxlX0lEJykuc3BsaXQoJywnKVswXTtcbiAgICB2YXIgYyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdtb2R1bGVfSUQnKS5zcGxpdCgnLCcpWzFdO1xuXG4gICAgaWYoIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzW3JdW2NdICl7XG4gICAgICAgIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzW3JdW2NdID0gZmFsc2U7XG4gICAgICAgIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzX3RvdGFsLS07XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl1bY10gPSB0cnVlO1xuICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbCsrO1xuICAgIH1cblxuICAgIC8qXG4gICAgdmFyIGxheWVyO1xuICAgIGlmKCBlbGVtWzBdLmNsYXNzTGlzdC5jb250YWlucygnc3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWQnKSApe1xuICAgICAgICAvL2cud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzW3JdW2NdID0gdHJ1ZTtcbiAgICAgICAgLy9sYXllciA9IGcuZHJhd2luZ19zZXR0aW5ncy5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGU7XG4gICAgICAgIC8vZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzID0gZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXMgKzEgfHwgMTtcbiAgICAgICAgLy9sYXllciA9IGcuZHJhd2luZ19zZXR0aW5ncy5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWQ7XG4gICAgICAgIC8vZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkXCIpO1xuICAgIH1cbiAgICAvLyovXG4gICAgLy9jb25zb2xlLmxvZyggZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXMpO1xuICAgIC8vZm9yKCB2YXIgYXR0cl9uYW1lIGluIGxheWVyICl7XG4gICAgLy8gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cl9uYW1lLCBsYXllclthdHRyX25hbWVdKTtcblxuICAgIC8vfVxuXG4gICAgZy5mLnVwZGF0ZSgpO1xuXG4gICAgLypcbiAgICBpZiggZWxlbS5oYXNDbGFzcyhcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlXCIpICl7XG4gICAgICAgIGVsZW0ucmVtb3ZlQ2xhc3MoXCJzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZVwiKTtcbiAgICAgICAgZWxlbS5hZGRDbGFzcyhcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkXCIpO1xuICAgIH0gZWxzZSBpZiggZWxlbS5oYXNDbGFzcyhcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkXCIpICl7XG4gICAgICAgIGVsZW0ucmVtb3ZlQ2xhc3MoXCJzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZFwiKTtcbiAgICAgICAgZWxlbS5hZGRDbGFzcyhcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW0uYWRkQ2xhc3MoXCJzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZVwiKTtcbiAgICB9XG4gICAgKi9cbn07XG5cblxuZi5jbGVhcl9vYmplY3QgPSBmdW5jdGlvbihvYmope1xuICAgIGZvciggdmFyIGlkIGluIG9iaiApe1xuICAgICAgICBpZiggb2JqLmhhc093blByb3BlcnR5KGlkKSl7XG4gICAgICAgICAgICBkZWxldGUgb2JqW2lkXTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8vIGNsZWFyIGRyYXdpbmdcbmYuY2xlYXJfZHJhd2luZyA9IGZ1bmN0aW9uKCkge1xuICAgIGZvciggdmFyIGlkIGluIGcuZHJhd2luZyApe1xuICAgICAgICBpZiggZy5kcmF3aW5nLmhhc093blByb3BlcnR5KGlkKSl7XG4gICAgICAgICAgICBmLmNsZWFyX29iamVjdChnLmRyYXdpbmdbaWRdKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuXG5mLnF1ZXJ5X3N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gQmFzZWQgb25cbiAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvOTc5OTk1XG4gIHZhciBxdWVyeV9zdHJpbmcgPSB7fTtcbiAgdmFyIHF1ZXJ5ID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSk7XG4gIHZhciB2YXJzID0gcXVlcnkuc3BsaXQoXCImXCIpO1xuICB2YXIgaTtcbiAgZm9yICggaT0wOyBpPHZhcnMubGVuZ3RoOyBpKysgKSB7XG4gICAgdmFyIHBhaXIgPSB2YXJzW2ldLnNwbGl0KFwiPVwiKTtcbiAgICAgICAgLy8gSWYgZmlyc3QgZW50cnkgd2l0aCB0aGlzIG5hbWVcbiAgICBpZiAodHlwZW9mIHF1ZXJ5X3N0cmluZ1twYWlyWzBdXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBxdWVyeV9zdHJpbmdbcGFpclswXV0gPSBwYWlyWzFdO1xuICAgICAgICAvLyBJZiBzZWNvbmQgZW50cnkgd2l0aCB0aGlzIG5hbWVcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBxdWVyeV9zdHJpbmdbcGFpclswXV0gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdmFyIGFyciA9IFsgcXVlcnlfc3RyaW5nW3BhaXJbMF1dLCBwYWlyWzFdIF07XG4gICAgICAgIHF1ZXJ5X3N0cmluZ1twYWlyWzBdXSA9IGFycjtcbiAgICAgICAgLy8gSWYgdGhpcmQgb3IgbGF0ZXIgZW50cnkgd2l0aCB0aGlzIG5hbWVcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWVyeV9zdHJpbmdbcGFpclswXV0ucHVzaChwYWlyWzFdKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5X3N0cmluZztcbn07XG5cbmYucmVxdWVzdF9nZW9jb2RlID0gZnVuY3Rpb24oKXtcbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoZywgJ2xvY2F0aW9uJykgKXtcbiAgICAgICAgdmFyIGFkZHJlc3NfbmV3ID0gZy5wZXJtLmxvY2F0aW9uLm5ld19hZGRyZXNzO1xuXG4gICAgICAgIGlmKCBhZGRyZXNzX25ldyB8fCBnLnBlcm0ubG9jYXRpb24ubGF0ID09PSB1bmRlZmluZWQgfHwgZy5wZXJtLmxvY2F0aW9uLmxhdCA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ25ldyBhZGRyZXNzJyk7XG4gICAgICAgICAgICB2YXIgYWRkcmVzcyA9IGVuY29kZVVSSUNvbXBvbmVudChbXG4gICAgICAgICAgICAgICAgICAgIGcucGVybS5sb2NhdGlvbi5hZGRyZXNzLFxuICAgICAgICAgICAgICAgICAgICBnLnBlcm0ubG9jYXRpb24uY2l0eSxcbiAgICAgICAgICAgICAgICAgICAgJ0ZMJyxcbiAgICAgICAgICAgICAgICAgICAgZy5wZXJtLmxvY2F0aW9uLnppcFxuICAgICAgICAgICAgICAgIF0uam9pbignLCAnKSApO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhhZGRyZXNzKTtcbiAgICAgICAgICAgICQoJyNnZW9jb2RlX2Rpc3BsYXknKS50ZXh0KCdSZXF1ZXN0aW5nIGNvb3JkaW5hdGVzLi4uJyk7XG4gICAgICAgICAgICAkLmdldEpTT04oJ2h0dHA6Ly9ub21pbmF0aW0ub3BlbnN0cmVldG1hcC5vcmcvc2VhcmNoP2Zvcm1hdD1qc29uJmxpbWl0PTUmcT0nICsgYWRkcmVzcywgZi5zZXRfY29vcmRpbmF0ZXNfZnJvbV9nZW9jb2RlICk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJyNnZW9jb2RlX2Rpc3BsYXknKS50ZXh0KCdBZGRyZXNzIHVuY2hhbmdlZCcpO1xuICAgICAgICAgICAgZi5zZXRfY29vcmRpbmF0ZXNfZnJvbV9nZW9jb2RlKCk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICAkKCcjZ2VvY29kZV9kaXNwbGF5JykudGV4dCgnUGxlYXNlIGVudGVyIGFkZHJlc3MnKTtcbiAgICB9XG59O1xuXG5cbmYuc2V0X3NhdF9tYXBfbWFya2VyID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgbGF0bG5nID0gTC5sYXRMbmcoIGcucGVybS5sb2NhdGlvbi5sYXQsIGcucGVybS5sb2NhdGlvbi5sb24gKTtcbiAgICBnLnBlcm0ubWFwcy5tYXJrZXJfc2F0LnNldExhdExuZyggbGF0bG5nICk7XG4gICAgZy5wZXJtLm1hcHMubWFya2VyX3JvYWQuc2V0TGF0TG5nKCBsYXRsbmcgKTtcbiAgICBnLnBlcm0ubWFwcy5tYXBfc2F0LnNldFZpZXcoIGxhdGxuZyApO1xufTtcblxuZi5zZXRfY29vcmRpbmF0ZXNfZnJvbV9tYXAgPSBmdW5jdGlvbihlKXtcbiAgICBnLnBlcm0ubG9jYXRpb24ubGF0ID0gZS5sYXRsbmcubGF0O1xuICAgIGcucGVybS5sb2NhdGlvbi5sb24gPSBlLmxhdGxuZy5sbmc7XG4gICAgZi51cGRhdGUoKTtcbn07XG5cbmYuc2V0X2Nvb3JkaW5hdGVzX2Zyb21fZ2VvY29kZSA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgIGlmKCBkYXRhID09PSB1bmRlZmluZWQgJiYgZy5wZXJtLmxvY2F0aW9uLmxhdCAhPT0gdW5kZWZpbmVkICl7IC8vIGxvYWRpbmcgbGFzdCBsb2NhdGlvbnNcbiAgICAgICAgZy5wZXJtLmxvY2F0aW9uLmxhdCA9IGcucGVybS5nZW9jb2RlLmxhdDtcbiAgICAgICAgZy5wZXJtLmxvY2F0aW9uLmxvbiA9IGcucGVybS5nZW9jb2RlLmxvbjtcbiAgICAgICAgZi51cGRhdGUoKTtcbiAgICB9IGVsc2UgaWYoIGRhdGFbMF0gIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAkKCcjZ2VvY29kZV9kaXNwbGF5JykudGV4dCgnQWRkcmVzcyBsb2FkZWQnKTtcbiAgICAgICAgY29uc29sZS5sb2coJ05ldyBsb2NhdGlvbiBmcm9tIGFkZHJlc3MnLCBkYXRhKTtcbiAgICAgICAgZy5wZXJtLmdlb2NvZGUuZGF0YSA9IGRhdGE7XG4gICAgICAgIGcucGVybS5nZW9jb2RlLmxhdCA9IGRhdGFbMF0ubGF0O1xuICAgICAgICBnLnBlcm0uZ2VvY29kZS5sb24gPSBkYXRhWzBdLmxvbjtcbiAgICAgICAgZy5wZXJtLmxvY2F0aW9uLmxhdCA9IGcucGVybS5nZW9jb2RlLmxhdDtcbiAgICAgICAgZy5wZXJtLmxvY2F0aW9uLmxvbiA9IGcucGVybS5nZW9jb2RlLmxvbjtcbiAgICAgICAgZi51cGRhdGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKCcjZ2VvY29kZV9kaXNwbGF5JykudGV4dCgnQWRkcmVzcyBub3QgZm91bmQnKTtcbiAgICB9XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmO1xuIiwidmFyIG1rX2RyYXdpbmcgPSByZXF1aXJlKCcuL21rX2RyYXdpbmcnKTtcblxuLy92YXIgZHJhd2luZ19wYXJ0cyA9IFtdO1xuLy9kLmxpbmtfZHJhd2luZ19wYXJ0cyhkcmF3aW5nX3BhcnRzKTtcblxudmFyIHBhZ2UgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgY29uc29sZS5sb2coXCIqKiBNYWtpbmcgYmxvY2tzXCIpO1xuICAgIGQgPSBta19kcmF3aW5nKHNldHRpbmdzKTtcblxuICAgIHZhciBmID0gc2V0dGluZ3MuZjtcblxuICAgIC8vdmFyIGNvbXBvbmVudHMgPSBzZXR0aW5ncy5jb21wb25lbnRzO1xuICAgIC8vdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcbiAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuXG5cblxuXG4gICAgdmFyIHgsIHksIGgsIHc7XG4gICAgdmFyIG9mZnNldDtcblxuLy8gRGVmaW5lIGQuYmxvY2tzXG5cbi8vIG1vZHVsZSBkLmJsb2NrXG4gICAgdyA9IHNpemUubW9kdWxlLmZyYW1lLnc7XG4gICAgaCA9IHNpemUubW9kdWxlLmZyYW1lLmg7XG5cbiAgICBkLmJsb2NrX3N0YXJ0KCdtb2R1bGUnKTtcblxuICAgIC8vIGZyYW1lXG4gICAgZC5sYXllcignbW9kdWxlJyk7XG4gICAgeCA9IDA7XG4gICAgeSA9IDArc2l6ZS5tb2R1bGUubGVhZDtcbiAgICBkLnJlY3QoIFt4LHkraC8yXSwgW3csaF0gKTtcbiAgICAvLyBmcmFtZSB0cmlhbmdsZT9cbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC13LzIseV0sXG4gICAgICAgIFt4LHkrdy8yXSxcbiAgICBdKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCx5K3cvMl0sXG4gICAgICAgIFt4K3cvMix5XSxcbiAgICBdKTtcbiAgICAvLyBsZWFkc1xuICAgIGQubGF5ZXIoJ0RDX3BvcycpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3gsIHktc2l6ZS5tb2R1bGUubGVhZF1cbiAgICBdKTtcbiAgICBkLmxheWVyKCdEQ19uZWcnKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCwgeStoXSxcbiAgICAgICAgW3gsIHkraCsoc2l6ZS5tb2R1bGUubGVhZCldXG4gICAgXSk7XG4gICAgLy8gcG9zIHNpZ25cbiAgICBkLmxheWVyKCd0ZXh0Jyk7XG4gICAgZC50ZXh0KFxuICAgICAgICBbeCtzaXplLm1vZHVsZS5sZWFkLzIsIHktc2l6ZS5tb2R1bGUubGVhZC8yXSxcbiAgICAgICAgJysnLFxuICAgICAgICBudWxsLFxuICAgICAgICAnc2lnbnMnXG4gICAgKTtcbiAgICAvLyBuZWcgc2lnblxuICAgIGQudGV4dChcbiAgICAgICAgW3grc2l6ZS5tb2R1bGUubGVhZC8yLCB5K2grc2l6ZS5tb2R1bGUubGVhZC8yXSxcbiAgICAgICAgJy0nLFxuICAgICAgICBudWxsLFxuICAgICAgICAnc2lnbnMnXG4gICAgKTtcbiAgICAvLyBncm91bmRcbiAgICBkLmxheWVyKCdEQ19ncm91bmQnKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC13LzIsIHkraC8yXSxcbiAgICAgICAgW3gtdy8yLXcvNCwgeStoLzJdLFxuICAgIF0pO1xuXG4gICAgZC5sYXllcigpO1xuICAgIGQuYmxvY2tfZW5kKCk7XG5cbi8vI3N0cmluZ1xuICAgIGQuYmxvY2tfc3RhcnQoJ3N0cmluZycpO1xuXG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG5cblxuXG5cblxuICAgIHZhciBtYXhfZGlzcGxheWVkX21vZHVsZXMgPSA5O1xuICAgIHZhciBicmVha19zdHJpbmcgPSBmYWxzZTtcblxuICAgIGlmKCBzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nID4gbWF4X2Rpc3BsYXllZF9tb2R1bGVzICl7XG4gICAgICAgIGRpc3BsYXllZF9tb2R1bGVzID0gbWF4X2Rpc3BsYXllZF9tb2R1bGVzIC0gMTtcbiAgICAgICAgYnJlYWtfc3RyaW5nID0gdHJ1ZTtcbiAgICAgICAgc2l6ZS5zdHJpbmcuaCA9IChzaXplLm1vZHVsZS5oICogKGRpc3BsYXllZF9tb2R1bGVzKzEpICkgKyBzaXplLnN0cmluZy5nYXBfbWlzc2luZztcbiAgICB9IGVsc2Uge1xuICAgICAgICBkaXNwbGF5ZWRfbW9kdWxlcyA9IHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmc7XG4gICAgICAgIHNpemUuc3RyaW5nLmggPSAoc2l6ZS5tb2R1bGUuaCAqIGRpc3BsYXllZF9tb2R1bGVzKTtcbiAgICB9XG4gICAgbG9jLmFycmF5Lmxvd2VyID0gbG9jLmFycmF5LnVwcGVyICsgc2l6ZS5zdHJpbmcuaDtcblxuICAgIHNpemUuc3RyaW5nLmhfbWF4ID0gKHNpemUubW9kdWxlLmggKiBtYXhfZGlzcGxheWVkX21vZHVsZXMpICsgc2l6ZS5zdHJpbmcuZ2FwX21pc3Npbmc7XG4gICAgbG9jLmFycmF5Lmxvd2VyX2xpbWl0ID0gbG9jLmFycmF5LnVwcGVyICsgc2l6ZS5zdHJpbmcuaF9tYXg7XG5cblxuXG4gICAgZm9yKCB2YXIgcj0wOyByPGRpc3BsYXllZF9tb2R1bGVzOyByKyspe1xuICAgICAgICBkLmJsb2NrKCdtb2R1bGUnLCBbeCx5XSk7XG4gICAgICAgIHkgKz0gc2l6ZS5tb2R1bGUuaDtcblxuICAgIH1cbiAgICBpZiggYnJlYWtfc3RyaW5nICkge1xuICAgICAgICBkLmxpbmUoXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgW3gseV0sXG4gICAgICAgICAgICAgICAgW3gseStzaXplLnN0cmluZy5nYXBfbWlzc2luZ10sXG4gICAgICAgICAgICAvL1t4LXNpemUubW9kdWxlLmZyYW1lLncqMy80LCB5K3NpemUuc3RyaW5nLmggKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdEQ19pbnRlcm1vZHVsZSdcbiAgICAgICAgKTtcblxuICAgICAgICB5ICs9IHNpemUuc3RyaW5nLmdhcF9taXNzaW5nO1xuICAgICAgICBkLmJsb2NrKCdtb2R1bGUnLCBbeCx5XSk7XG4gICAgfVxuXG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG5cbiAgICAvL1RPRE86IGFkZCBsb29wIHRvIGp1bXAgb3ZlciBuZWdhdGl2ZSByZXR1cm4gd2lyZXNcbiAgICBkLmxheWVyKCdEQ19ncm91bmQnKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC1zaXplLm1vZHVsZS5mcmFtZS53KjMvNCwgeStzaXplLm1vZHVsZS5oLzJdLFxuICAgICAgICBbeC1zaXplLm1vZHVsZS5mcmFtZS53KjMvNCwgeStzaXplLnN0cmluZy5oX21heCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAgICAgLy9beC1zaXplLm1vZHVsZS5mcmFtZS53KjMvNCwgeStzaXplLnN0cmluZy5oICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICBdKTtcbiAgICBkLmxheWVyKCk7XG5cblxuICAgIGQuYmxvY2tfZW5kKCk7XG5cblxuLy8gdGVybWluYWxcbiAgICBkLmJsb2NrX3N0YXJ0KCd0ZXJtaW5hbCcpO1xuICAgIHggPSAwO1xuICAgIHkgPSAwO1xuXG4gICAgZC5sYXllcigndGVybWluYWwnKTtcbiAgICBkLmNpcmMoXG4gICAgICAgIFt4LHldLFxuICAgICAgICBzaXplLnRlcm1pbmFsX2RpYW1cbiAgICApO1xuICAgIGQubGF5ZXIoKTtcbiAgICBkLmJsb2NrX2VuZCgpO1xuXG4vLyBmdXNlXG5cbiAgICBkLmJsb2NrX3N0YXJ0KCdmdXNlJyk7XG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG4gICAgdyA9IDEwO1xuICAgIGggPSA1O1xuXG4gICAgZC5sYXllcigndGVybWluYWwnKTtcbiAgICBkLnJlY3QoXG4gICAgICAgIFt4LHldLFxuICAgICAgICBbdyxoXVxuICAgICk7XG4gICAgZC5saW5lKCBbXG4gICAgICAgIFt3LzIseV0sXG4gICAgICAgIFt3LzIrc2l6ZS5mdXNlLncsIHldXG4gICAgXSk7XG4gICAgZC5ibG9jaygndGVybWluYWwnLCBbc2l6ZS5mdXNlLncsIHldICk7XG5cbiAgICBkLmxpbmUoIFtcbiAgICAgICAgWy13LzIseV0sXG4gICAgICAgIFstdy8yLXNpemUuZnVzZS53LCB5XVxuICAgIF0pO1xuICAgIGQuYmxvY2soJ3Rlcm1pbmFsJywgWy1zaXplLmZ1c2UudywgeV0gKTtcblxuICAgIGQubGF5ZXIoKTtcbiAgICBkLmJsb2NrX2VuZCgpO1xuXG4vLyBncm91bmQgc3ltYm9sXG4gICAgZC5ibG9ja19zdGFydCgnZ3JvdW5kJyk7XG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG5cbiAgICBkLmxheWVyKCdBQ19ncm91bmQnKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCx5XSxcbiAgICAgICAgW3gseSs0MF0sXG4gICAgXSk7XG4gICAgeSArPSAyNTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC03LjUseV0sXG4gICAgICAgIFt4KzcuNSx5XSxcbiAgICBdKTtcbiAgICB5ICs9IDU7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gtNSx5XSxcbiAgICAgICAgW3grNSx5XSxcbiAgICBdKTtcbiAgICB5ICs9IDU7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gtMi41LHldLFxuICAgICAgICBbeCsyLjUseV0sXG4gICAgXSk7XG4gICAgZC5sYXllcigpO1xuXG4gICAgZC5ibG9ja19lbmQoKTtcblxuXG5cbi8vIE5vcnRoIGFycm93XG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG5cbiAgICB2YXIgYXJyb3dfdyA9IDc7XG4gICAgdmFyIGxldHRlcl9oID0gMTQ7XG4gICAgdmFyIGFycm93X2ggPSA1MDtcblxuICAgIGQuYmxvY2tfc3RhcnQoJ25vcnRoIGFycm93X3VwJyk7XG4gICAgZC5sYXllcignbm9ydGhfbGV0dGVyJyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gsIHkrbGV0dGVyX2hdLFxuICAgICAgICBbeCwgeV0sXG4gICAgICAgIFt4K2Fycm93X3csIHkrbGV0dGVyX2hdLFxuICAgICAgICBbeCthcnJvd193LCB5XSxcbiAgICBdKTtcbiAgICBkLmxheWVyKCdub3J0aF9hcnJvdycpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LCB5K2Fycm93X2hdLFxuICAgICAgICBbeCwgeV0sXG4gICAgICAgIFt4K2Fycm93X3cvMiwgeStsZXR0ZXJfaC8yXSxcbiAgICBdKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCwgeV0sXG4gICAgICAgIFt4LWFycm93X3cvMiwgeStsZXR0ZXJfaC8yXSxcbiAgICBdKTtcbiAgICBkLmxheWVyKCk7XG4gICAgZC5ibG9ja19lbmQoJ25vcnRoIGFycm93Jyk7XG5cbiAgICBkLmJsb2NrX3N0YXJ0KCdub3J0aCBhcnJvd19sZWZ0Jyk7XG4gICAgZC5sYXllcignbm9ydGhfbGV0dGVyJyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3grbGV0dGVyX2gsIHldLFxuICAgICAgICBbeCwgeV0sXG4gICAgICAgIFt4K2xldHRlcl9oLCB5LWFycm93X3ddLFxuICAgICAgICBbeCwgICAgICAgICAgeS1hcnJvd193XSxcbiAgICBdKTtcbiAgICBkLmxheWVyKCdub3J0aF9hcnJvdycpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4K2Fycm93X2gsIHldLFxuICAgICAgICBbeCwgeV0sXG4gICAgICAgIFt4K2xldHRlcl9oLzIsIHktYXJyb3dfdy8yXSxcbiAgICBdKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCwgeV0sXG4gICAgICAgIFt4K2xldHRlcl9oLzIsIHkrYXJyb3dfdy8yXSxcbiAgICBdKTtcbiAgICBkLmxheWVyKCk7XG4gICAgZC5ibG9ja19lbmQoJ25vcnRoIGFycm93Jyk7XG5cbi8vKi9cblxuICAgIHJldHVybiBkLmRyYXdpbmdfcGFydHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuIiwidmFyIG1rX2RyYXdpbmcgPSByZXF1aXJlKCcuL21rX2RyYXdpbmcnKTtcblxuLy92YXIgZHJhd2luZ19wYXJ0cyA9IFtdO1xuLy9kLmxpbmtfZHJhd2luZ19wYXJ0cyhkcmF3aW5nX3BhcnRzKTtcblxuLypcbnZhciBmc2VjX2xvZ29fYjY0ID0gICdkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhYQUJjQU5VQUFJV1JaVTlrZHlaRGhXcDdibmVHYXJ1K1UzQ0R0a0ZaZkRST2dLbTEwOS9mMy96OC9OYlcxbHh2b2pwVGx1VGZSY0RDeDF4dmM2NnpWOWJVU3NuSlRxQ25YSk9jWU96czdQSHorRVJkb0xqQjIrL3Y3OTNmNUg2UHZmTHk4dkxyUVJrNGlzek16UC8vL3dBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQ0g1QkFBQUFBQUFMQUFBQUFCY0FGd0FBQWIvUUpGd1NDd2FqOGlrY3Nsc09wL1FxSFJLclZxdjJLeDJ5ejEyRXQxdzJBQUNnY1hvSzdsc1RydWxhM2I3VFYvRzVmTzZubmpINS9kMWZYNS9nR21DZzRTRlhZZUlpWXBaakkyT2oxV1JrcE9VVVphWG1KbE5tNXlkbmttZ29hS2pSYVdtcDZnaW9BSjRDQ0N3aUdldFNKWUlBU0FFZUFBZ0E1SzJ0M3ljdnhaNEZnSy93c1RGZnJSc0VpQVZjZ2dBQTd0eUVYN0RyWUt3ekd3QUVRWGFJQUFBRXVjZ0FjSHNySHFIQXdjQnZXd1dGZ0FGWlFJUEF3L09DZUJINEVDM2I0MGtIQ2dRckF3RmhoOGtBS0R3SWNDSGV3SW9EQmh3NzZDblhCUU9mQUNBZ01DSEFnSStxUHd3d1dMQUFBOFBUR2hHQ1ZRRmlTdFBncEN3TWx2Ty93Y3lPOVo2ZEFqZWdJb1ZWdkpEOE9BRGhUSTVCd0NvaUlkQXRETGU2RENTR2kyQ3pxUWZrSUVvU1d2Q2gzOGdtaG9zRTZEQ1ZUWlpEUTBTWUlIZUJBQUJJalQ5SU12ZHRRSUZIa29vR0FDV1JhY1JDQVFXTUVDWnh6ZVdGSmZMU1JWQkFjbzVDOGlhbXRNQ1RHNUQzWUE2OEFBYlJaVUhqbUxHVEVCMXhBQVdnRjZLcTBXVlNaU3BJN2hlVGRsQ1BRRVpQNENlTFVZVlZKMGd2UExtM2ZEeVRGTzBLNjBDSVZMbEFIL0xlVDlndkZLV3RVYlI0Vnl5cHc5QTdKWHBzaSt2d1Brc2UzVjRhYW94eGJoQ2dhWVRKR0JYdi9vQkFnbDdGVkRCZGFHRTkwa29Va2xRd0dEZXRjUGZjc01kUUlDQ0VqVWtuM2pUL2FkU0FRYTE5LzhnWmI4RVlGWllEUlk0UlFMVHlXR1NTaEY0K09GS0ZTaDNVWXBZVFdHY0hJZU41T0tMSjdVSHp5b2EySmhpY0U0dHd5T0lCNXhHd1Z1aFpJQUJGYW93WnRaZHNLeDRwRXIzQUdCV2FTVmU0cVFWbXhDUUR6YTZGRWJkbFNzWlZLWTc2VmdnRkNKZlduRkJBNXhFVU1HSUtyV0VKNDhUNkpYVEJERTIrYVNjSVlSQUp5S0pSUkNBTzVlcGhBMmFqYTJrMGFJdHJvV0lBeHhjY1VHaGhSN0tTVXFvZ2REb2kwOGR0dDBxRGtBUXdnVlZiTXBwcDZHQTJoQlRML3BYUmxMUGhaSXFwNnhLNGNHcnIzcmFTRkxCdEVoQUFIdXBGMUE2MXlVbGppUzd2dHByRkFvQXk2bXdmbGpRMGdCNEVtQ1plcHBaK1FBQmVsbDRxYXJXYmpEL1JiWFdHanJJZjk2ZXR0STlBOGliazBabDdIYlNBUUM0ZFc2N0RDeEFCYnZXWWt0V0JCUUFjSUFBUFBIRnl6b0l0SmhPQkFnc0JJQUExVlhEV0VnQ1dPVkh0TUFHYkFYQndHSUx6TVZzV0lSU284OUZJQUZvU2dwZ1ZqUjBtY3NHeUsrS2ZBWEp3Y29oQUR3V0JkQ3dTbU9wWkd0bVhsbGFScGNnNE15cHpsandmSzBrRnJESDBsNDd3UWhDbmhUdDgrd2dUaGNLZFJaU3d6b1hoelBLek5kUFcvT1RIRkFUTUhrenVpRUwzRVhaN3ZwUndRRURza0hBQkVkWmxSU3lIZkhONzcvV2pzMEYzdGdlY01BMU9FbzBUUmtGcU1NT1NmUjhUSGZPZHFQQnVCOXZKcVpReW00T1Y4YWJaWVFkZ3VKaWZDNEpTZFhJSVFIa2w2ak90THJuN2VhTnlDOXYvdksxNWdCM1hvZnJneGdFajBGeXp4MjhJc1RUQ1BibVR3c1BTUFBPSzUrNDlJVlE3N3p0MkRPZnU4blRjWCtMOXFhSVR3ejV0VU12ZHZlam9JOTQzYzRRNFQ0ZTVzYy94UHlwcTc4Nis4N01YNy85UlVEZi93QVl3TzhCNzNvRVZFTHpCcGhBSTdpT2dRMTA0UGNnR0VFSnRrdC90NnZnRWZDR1FBMDZnWVBSOHlBVVFKaEJFU1lCYnlVMDRRazdxRUpxY2E2RkExc2ZES3VnZ0JUT2tBbjh1NkVPZDhqREhxSWlDQUE3Jztcbi8vKi9cblxuXG52YXIgYWRkX2JvcmRlciA9IGZ1bmN0aW9uKHNldHRpbmdzLCBzaGVldF9pbmZvKXtcbiAgICBkID0gbWtfZHJhd2luZyhzZXR0aW5ncyk7XG4gICAgdmFyIGYgPSBzZXR0aW5ncy5mO1xuXG4gICAgLy92YXIgY29tcG9uZW50cyA9IHNldHRpbmdzLmNvbXBvbmVudHM7XG4gICAgLy92YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG5cblxuXG5cbiAgICB2YXIgeCwgeSwgaCwgdztcbiAgICB2YXIgb2Zmc2V0O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEZyYW1lXG4gICAgZC5zZWN0aW9uKCdGcmFtZScpO1xuXG4gICAgdyA9IHNpemUuZHJhd2luZy53O1xuICAgIGggPSBzaXplLmRyYXdpbmcuaDtcbiAgICB2YXIgcGFkZGluZyA9IHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nO1xuXG4gICAgZC5sYXllcignYm9yZGVyX2xpbmVzJyk7XG5cbiAgICAvL2JvcmRlclxuICAgIGQucmVjdCggW3cvMiAsIGgvMl0sIFt3IC0gcGFkZGluZyoyLCBoIC0gcGFkZGluZyoyIF0gKTtcblxuICAgIHZhciByaWdodF9vZmZzZXQgPSBzaXplLmRyYXdpbmcudGl0bGVib3g7XG5cblxuLy8gUHJvamVjdC9GU0VDIGxvZ29cbiAgICB4ID0gdyAtIHBhZGRpbmc7XG4gICAgeSA9IDAgKyBwYWRkaW5nO1xuICAgIHZhciBGU0VDX2xvZ29fd2lkdGggPSAzMjtcbiAgICB4ICs9IC1GU0VDX2xvZ29fd2lkdGg7XG5cbiAgICBkLmltYWdlKFxuICAgICAgICBbeC0yLHkrMl0sXG4gICAgICAgIFtGU0VDX2xvZ29fd2lkdGgsRlNFQ19sb2dvX3dpZHRoXSxcbiAgICAgICAgJ2RhdGEvbG9nby9GU0VDLmdpZidcbiAgICApO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LTQseV0sXG4gICAgICAgIFt4LTQsICAgICAgICAgICAgICAgIHkrNCtGU0VDX2xvZ29fd2lkdGhdLFxuICAgICAgICBbdy1wYWRkaW5nLHkrNCtGU0VDX2xvZ29fd2lkdGhdLFxuICAgIF0pO1xuXG5cbi8vIHRpdGxlIGJveGVzXG5cbiAgICAvLyB0aXRsZSBib3hcbiAgICB2YXIgdGl0bGVib3ggPSBzaXplLmRyYXdpbmcudGl0bGVib3g7XG5cbiAgICAvLyBzaWRlXG4gICAgeCA9IHcgLSBwYWRkaW5nIC0gdGl0bGVib3guc2lkZS53O1xuICAgIHkgPSBoIC0gcGFkZGluZztcbiAgICBkLmxpbmUoW1xuICAgICAgICBbIHgsIHldLFxuICAgICAgICBbIHgsICAgICAgICAgICAgICAgICB5IC0gdGl0bGVib3guc2lkZS5oXSxcbiAgICAgICAgWyB4K3RpdGxlYm94LnNpZGUudywgeSAtIHRpdGxlYm94LnNpZGUuaF1cbiAgICBdKTtcblxuICAgIC8vYm90dG9tXG4gICAgeCA9IHcgLSBwYWRkaW5nIC0gdGl0bGVib3guc2lkZS53IC0gdGl0bGVib3guYm90dG9tLnc7XG4gICAgeSA9IGggLSBwYWRkaW5nO1xuICAgIGQubGluZShbXG4gICAgICAgIFsgeCwgeV0sXG4gICAgICAgIFsgeCwgeSAtIHRpdGxlYm94LmJvdHRvbS5oXSxcbiAgICAgICAgWyB4ICsgdGl0bGVib3guYm90dG9tLncgLCB5IC0gdGl0bGVib3guYm90dG9tLmhdLFxuICAgIF0pO1xuXG5cbi8vIGJvdHRvbSBiYXIgY29udGVudFxuXG5cbiAgICB4ID0gdyAtIHBhZGRpbmcgLSB0aXRsZWJveC5ib3R0b20udyAtIHRpdGxlYm94LnNpZGUudztcbiAgICB5ID0gaCAtIHBhZGRpbmcgLSB0aXRsZWJveC5ib3R0b20uaDtcbiAgICB4ICs9IDEwO1xuICAgIHkgKz0gdGl0bGVib3guYm90dG9tLmggKjEvNDtcblxuXG4gICAgZC50ZXh0KFt4LHldLFxuICAgICAgICAgWyAnUFYgU3lzdGVtIERlc2lnbicgXSxcbiAgICAgICAgJ3RleHQnLFxuICAgICAgICAndGl0bGUxJ1xuICAgICAgICApO1xuXG5cbiAgICB4ICs9IDE1MDtcbiAgICBpZiggc2V0dGluZ3MuZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdsb2NhdGlvbicpICApe1xuICAgICAgICBkLnRleHQoW3gseV0sIFtcbiAgICAgICAgICAgIHNldHRpbmdzLnBlcm0ubG9jYXRpb24uYWRkcmVzcyxcbiAgICAgICAgICAgIHNldHRpbmdzLnBlcm0ubG9jYXRpb24uY2l0eSArICcsICcgKyBzZXR0aW5ncy5wZXJtLmxvY2F0aW9uLmNvdW50eSArICcsIEZMLCAnICsgc2V0dGluZ3MucGVybS5sb2NhdGlvbi56aXAsXG5cbiAgICAgICAgXSwgJ3RleHQnLCAndGl0bGUzJyk7XG4gICAgfVxuXG5cblxuXG4vLyBTaWRlIGJhciBjb250ZW50XG5cbiAgICB4ID0gdyAtIHBhZGRpbmcgLSB0aXRsZWJveC5zaWRlLnc7XG4gICAgeSA9IGggLSBwYWRkaW5nIC0gdGl0bGVib3guc2lkZS5oO1xuXG4gICAgLy8gQ29udHJhY3RvciBuYW1lIGJveFxuICAgIGQudGV4dChbeCt0aXRsZWJveC5zaWRlLncvMix5KzEwXSwgW1xuICAgICAgICAgICAgIFsgJ1NvbGFyIEluc3RhbGxlciBJbmMuJyBdLFxuICAgICAgICAgICAgIFsgJzEyMzQgWWVsbG93IFN1YiBMbi4nIF0sXG4gICAgICAgICAgICAgWyAnQ29jb2EsIEZsIDMyOTIyJyBdLFxuICAgICAgICAgXSxcbiAgICAgICAgICd0ZXh0JyxcbiAgICAgICAgJ2luc3RhbGxlcl9pbmZvJ1xuICAgICAgICApO1xuXG5cbiAgICB5ICs9IHRpdGxlYm94LnNpZGUudy8yO1xuICAgIGQubGluZShbXG4gICAgICAgIFsgeCAsIHkgXSxcbiAgICAgICAgWyB4K3RpdGxlYm94LnNpZGUudyAsIHkgXSxcbiAgICBdKTtcblxuICAgIC8vIG1hbnVmYWN0dXJlciBsb2dvIGJveFxuICAgIHZhciBsb2dvX2dhcCA9IDI7XG4gICAgdmFyIGxvZ29fd2lkdGggPSAodGl0bGVib3guc2lkZS53LWxvZ29fZ2FwKjMpLzI7XG5cbiAgICB2YXIgbG9nb3MgPSBbXG4gICAgICAgICdkYXRhL2xvZ28vU01BLnBuZycsXG4gICAgICAgICdkYXRhL2xvZ28vc3VuaXZhLmpwZycsXG4gICAgICAgICdkYXRhL2xvZ28vc2NobGV0dGVyLnN2ZycsXG4gICAgXTtcbiAgICBkLmltYWdlKFxuICAgICAgICBbeCtsb2dvX2dhcCx5K2xvZ29fZ2FwXSxcbiAgICAgICAgW2xvZ29fd2lkdGgsbG9nb193aWR0aF0sXG4gICAgICAgIGxvZ29zWzBdXG4gICAgKTtcbiAgICBkLmltYWdlKFxuICAgICAgICBbeCtsb2dvX2dhcCx5K2xvZ29fZ2FwK2xvZ29fd2lkdGgrbG9nb19nYXBdLFxuICAgICAgICBbbG9nb193aWR0aCxsb2dvX3dpZHRoXSxcbiAgICAgICAgbG9nb3NbMV1cbiAgICApO1xuICAgIGQuaW1hZ2UoXG4gICAgICAgIFt4K2xvZ29fZ2FwK2xvZ29fd2lkdGgrbG9nb19nYXAseStsb2dvX2dhcF0sXG4gICAgICAgIFtsb2dvX3dpZHRoLGxvZ29fd2lkdGhdLFxuICAgICAgICBsb2dvc1syXVxuICAgICk7XG5cbiAgICB5ICs9IHRpdGxlYm94LnNpZGUudztcbiAgICBkLmxpbmUoW1xuICAgICAgICBbIHggLCB5IF0sXG4gICAgICAgIFsgeCt0aXRsZWJveC5zaWRlLncgLCB5IF0sXG4gICAgXSk7XG5cblxuICAgIHkgKz0gdGl0bGVib3guc2lkZS53O1xuICAgIGQubGluZShbXG4gICAgICAgIFsgeCAsIHkgXSxcbiAgICAgICAgWyB4K3RpdGxlYm94LnNpZGUudyAsIHkgXSxcbiAgICBdKTtcblxuICAgIHkgKz0gdGl0bGVib3guc2lkZS53IC84XG4gICAgZC50ZXh0KFt4K3RpdGxlYm94LnNpZGUudy8yLHkrMTBdLCBbXG4gICAgICAgICAgICAgWyBzaGVldF9pbmZvLm51bSBdLFxuICAgICAgICBdLFxuICAgICAgICAndGV4dCcsXG4gICAgICAgICdzaGVldF9udW0nXG4gICAgICAgICk7XG5cbiAgICAvKlxuICAgIGQuaW1hZ2UoXG4gICAgICAgIFt4KzMyLHkrMzJdLFxuICAgICAgICBbMzIsMzJdLFxuICAgICAgICBsb2dvc1szXVxuICAgICk7XG4gICAgLy8qL1xuXG5cblxuICAgIC8qXG4gICAgeCA9IHcgLSBwYWRkaW5nICogMztcbiAgICB5ID0gcGFkZGluZyAqIDM7XG5cbiAgICB3ID0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94O1xuICAgIGggPSBzaXplLmRyYXdpbmcudGl0bGVib3g7XG5cbiAgICAvLyBib3ggdG9wLXJpZ2h0XG4gICAgLy9kLnJlY3QoIFt4LXcvMiwgeStoLzJdLCBbdyxoXSApO1xuXG4gICAgeSArPSBoICsgcGFkZGluZztcblxuICAgIHcgPSBzaXplLmRyYXdpbmcudGl0bGVib3g7XG4gICAgaCA9IHNpemUuZHJhd2luZy5oIC0gcGFkZGluZyo4IC0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94KjIuNTtcblxuICAgIC8vdGl0bGUgYm94XG4gICAgLy9kLnJlY3QoIFt4LXcvMiwgeStoLzJdLCBbdyxoXSApO1xuXG4gICAgdmFyIHRpdGxlID0ge307XG4gICAgdGl0bGUudG9wID0geTtcbiAgICB0aXRsZS5ib3R0b20gPSB5K2g7XG4gICAgdGl0bGUucmlnaHQgPSB4O1xuICAgIHRpdGxlLmxlZnQgPSB4LXcgO1xuXG5cbiAgICAvLyBib3ggYm90dG9tLXJpZ2h0XG4gICAgaCA9IHNpemUuZHJhd2luZy50aXRsZWJveCAqIDEuNTtcbiAgICB5ID0gdGl0bGUuYm90dG9tICsgcGFkZGluZztcbiAgICB4ID0geC13LzI7XG4gICAgeSA9IHkraC8yO1xuICAgIGQucmVjdCggW3gsIHldLCBbdyxoXSApO1xuXG4gICAgeSAtPSAyMCoyLzM7XG4gICAgZC50ZXh0KFt4LHldLFxuICAgICAgICBbIHNoZWV0X3NlY3Rpb24sIHNoZWV0X251bSBdLFxuICAgICAgICAndGV4dCcsXG4gICAgICAgICdwYWdlJ1xuICAgICAgICApO1xuXG5cbiAgICB2YXIgcGFnZSA9IHt9O1xuICAgIHBhZ2UucmlnaHQgPSB0aXRsZS5yaWdodDtcbiAgICBwYWdlLmxlZnQgPSB0aXRsZS5sZWZ0O1xuICAgIHBhZ2UudG9wID0gdGl0bGUuYm90dG9tICsgcGFkZGluZztcbiAgICBwYWdlLmJvdHRvbSA9IHBhZ2UudG9wICsgc2l6ZS5kcmF3aW5nLnRpdGxlYm94KjEuNTtcbiAgICAvLyBkLnRleHRcblxuICAgIHggPSB0aXRsZS5sZWZ0ICsgcGFkZGluZztcbiAgICB5ID0gdGl0bGUuYm90dG9tIC0gcGFkZGluZztcblxuICAgIHggKz0gMTA7XG4gICAgaWYoIHN5c3RlbS5pbnZlcnRlci5tYWtlICYmIHN5c3RlbS5pbnZlcnRlci5tb2RlbCApe1xuICAgICAgICBkLnRleHQoW3gseV0sXG4gICAgICAgICAgICAgWyAnUFYgU3lzdGVtIERlc2lnbicgXSxcbiAgICAgICAgICAgICd0ZXh0JyxcbiAgICAgICAgICAgICd0aXRsZTEnXG4gICAgICAgICAgICApLnJvdGF0ZSgtOTApO1xuXG4gICAgfVxuXG4gICAgeCArPSAxNDtcbiAgICBpZiggc2V0dGluZ3MuZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdsb2NhdGlvbicpICApe1xuICAgICAgICBkLnRleHQoW3gseV0sIFtcbiAgICAgICAgICAgIHNldHRpbmdzLnBlcm0ubG9jYXRpb24uYWRkcmVzcyxcbiAgICAgICAgICAgIHNldHRpbmdzLnBlcm0ubG9jYXRpb24uY2l0eSArICcsICcgKyBzZXR0aW5ncy5wZXJtLmxvY2F0aW9uLmNvdW50eSArICcsIEZMLCAnICsgc2V0dGluZ3MucGVybS5sb2NhdGlvbi56aXAsXG5cbiAgICAgICAgXSwgJ3RleHQnLCAndGl0bGUzJykucm90YXRlKC05MCk7XG4gICAgfVxuXG4gICAgeCA9IHBhZ2UubGVmdCArIHBhZGRpbmc7XG4gICAgeSA9IHBhZ2UudG9wICsgcGFkZGluZztcbiAgICB5ICs9IHNpemUuZHJhd2luZy50aXRsZWJveCAqIDEuNSAqIDMvNDtcblxuXG5cbiAgICAvLyovXG5cblxuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGFkZF9ib3JkZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG5cbnZhciBta19kcmF3aW5nID0gZnVuY3Rpb24oZyl7XG5cbiAgICB2YXIgZHJhd2luZyA9IHt9O1xuXG5cbiAgICB2YXIgbGF5ZXJfYXR0ciA9IHJlcXVpcmUoJy4vc2V0dGluZ3NfbGF5ZXJzJyk7XG4gICAgdmFyIGZvbnRzID0gcmVxdWlyZSgnLi9zZXR0aW5nc19mb250cycpO1xuXG5cblxuXG5cblxuXG4gICAgLy8gQkxPQ0tTXG5cbiAgICB2YXIgQmxrID0ge1xuICAgICAgICB0eXBlOiAnYmxvY2snLFxuICAgIH07XG4gICAgQmxrLm1vdmUgPSBmdW5jdGlvbih4LCB5KXtcbiAgICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLmRyYXdpbmdfcGFydHMgKXtcbiAgICAgICAgICAgIHRoaXMuZHJhd2luZ19wYXJ0c1tpXS5tb3ZlKHgseSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBCbGsuYWRkID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoIHR5cGVvZiB0aGlzLmRyYXdpbmdfcGFydHMgPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgdGhpcy5kcmF3aW5nX3BhcnRzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgZm9yKCB2YXIgaSBpbiBhcmd1bWVudHMpe1xuICAgICAgICAgICAgdGhpcy5kcmF3aW5nX3BhcnRzLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIEJsay5yb3RhdGUgPSBmdW5jdGlvbihkZWcpe1xuICAgICAgICB0aGlzLnJvdGF0ZSA9IGRlZztcbiAgICB9O1xuXG5cbiAgICB2YXIgYmxvY2tfYWN0aXZlID0gZmFsc2U7XG4gICAgLy8gQ3JlYXRlIGRlZmF1bHQgbGF5ZXIsYmxvY2sgY29udGFpbmVyIGFuZCBmdW5jdGlvbnNcblxuICAgIC8vIExheWVyc1xuXG4gICAgdmFyIGxheWVyX2FjdGl2ZSA9IGZhbHNlO1xuXG4gICAgZHJhd2luZy5sYXllciA9IGZ1bmN0aW9uKG5hbWUpeyAvLyBzZXQgY3VycmVudCBsYXllclxuICAgICAgICBpZiggdHlwZW9mIG5hbWUgPT09ICd1bmRlZmluZWQnICl7IC8vIGlmIG5vIGxheWVyIG5hbWUgZ2l2ZW4sIHJlc2V0IHRvIGRlZmF1bHRcbiAgICAgICAgICAgIGxheWVyX2FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKCAhIChuYW1lIGluIGxheWVyX2F0dHIpICkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdFcnJvcjogdW5rbm93biBsYXllciBcIicrbmFtZSsnXCIsIHVzaW5nIGJhc2UnKTtcbiAgICAgICAgICAgIGxheWVyX2FjdGl2ZSA9ICdiYXNlJyA7XG4gICAgICAgIH0gZWxzZSB7IC8vIGZpbmFseSBhY3RpdmF0ZSByZXF1ZXN0ZWQgbGF5ZXJcbiAgICAgICAgICAgIGxheWVyX2FjdGl2ZSA9IG5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8qL1xuICAgIH07XG5cbiAgICB2YXIgc2VjdGlvbl9hY3RpdmUgPSBmYWxzZTtcblxuICAgIGRyYXdpbmcuc2VjdGlvbiA9IGZ1bmN0aW9uKG5hbWUpeyAvLyBzZXQgY3VycmVudCBzZWN0aW9uXG4gICAgICAgIGlmKCB0eXBlb2YgbmFtZSA9PT0gJ3VuZGVmaW5lZCcgKXsgLy8gaWYgbm8gc2VjdGlvbiBuYW1lIGdpdmVuLCByZXNldCB0byBkZWZhdWx0XG4gICAgICAgICAgICBzZWN0aW9uX2FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgeyAvLyBmaW5hbHkgYWN0aXZhdGUgcmVxdWVzdGVkIHNlY3Rpb25cbiAgICAgICAgICAgIHNlY3Rpb25fYWN0aXZlID0gbmFtZTtcbiAgICAgICAgfVxuICAgICAgICAvLyovXG4gICAgfTtcblxuXG4gICAgZHJhd2luZy5ibG9ja19zdGFydCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgaWYoIHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJyApeyAvLyBpZiBuYW1lIGFyZ3VtZW50IGlzIHN1Ym1pdHRlZFxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiBuYW1lIHJlcXVpcmVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgYmxrO1xuICAgICAgICAgICAgYmxvY2tfYWN0aXZlID0gbmFtZTtcbiAgICAgICAgICAgIGlmKCBnLmRyYXdpbmcuYmxvY2tzW2Jsb2NrX2FjdGl2ZV0gIT09IHVuZGVmaW5lZCApe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogYmxvY2sgYWxyZWFkeSBleGlzdHMnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsayA9IE9iamVjdC5jcmVhdGUoQmxrKTtcbiAgICAgICAgICAgIGcuZHJhd2luZy5ibG9ja3NbYmxvY2tfYWN0aXZlXSA9IGJsaztcbiAgICAgICAgICAgIHJldHVybiBibGs7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgICAgIC8qXG4gICAgICAgIHggPSBsb2Mud2lyZV90YWJsZS54IC0gdy8yO1xuICAgICAgICB5ID0gbG9jLndpcmVfdGFibGUueSAtIGgvMjtcbiAgICAgICAgaWYoIHR5cGVvZiBsYXllcl9uYW1lICE9PSAndW5kZWZpbmVkJyAmJiAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICkge1xuICAgICAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gbGF5ZXJzW2xheWVyX25hbWVdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiggISAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICl7IGNvbnNvbGUubG9nKFwiZXJyb3IsIGxheWVyIGRvZXMgbm90IGV4aXN0LCB1c2luZyBjdXJyZW50XCIpO31cbiAgICAgICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9ICBsYXllcl9hY3RpdmVcbiAgICAgICAgfVxuICAgICAgICAqL1xuICAgIGRyYXdpbmcuYmxvY2tfZW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBibGsgPSBnLmRyYXdpbmcuYmxvY2tzW2Jsb2NrX2FjdGl2ZV07XG4gICAgICAgIGJsb2NrX2FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gYmxrO1xuICAgIH07XG5cblxuXG5cblxuXG4gICAgLy8vLy8vXG4gICAgLy8gYnVpbGQgcHJvdG90eXBlIGVsZW1lbnRcblxuICAgICAgICAvKlxuICAgICAgICBpZiggdHlwZW9mIGxheWVyX25hbWUgIT09ICd1bmRlZmluZWQnICYmIChsYXllcl9uYW1lIGluIGxheWVycykgKSB7XG4gICAgICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSBsYXllcnNbbGF5ZXJfbmFtZV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKCAhIChsYXllcl9uYW1lIGluIGxheWVycykgKXsgY29uc29sZS5sb2coXCJlcnJvciwgbGF5ZXIgZG9lcyBub3QgZXhpc3QsIHVzaW5nIGN1cnJlbnRcIik7fVxuICAgICAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gIGxheWVyX2FjdGl2ZVxuICAgICAgICB9XG4gICAgICAgICovXG5cblxuICAgIHZhciBTdmdFbGVtID0ge1xuICAgICAgICBvYmplY3Q6ICdTdmdFbGVtJ1xuICAgIH07XG4gICAgU3ZnRWxlbS5tb3ZlID0gZnVuY3Rpb24oeCwgeSl7XG4gICAgICAgIGlmKCB0eXBlb2YgdGhpcy5wb2ludHMgIT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICBmb3IoIHZhciBpIGluIHRoaXMucG9pbnRzICkge1xuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRzW2ldWzBdICs9IHg7XG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludHNbaV1bMV0gKz0geTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIFN2Z0VsZW0ucm90YXRlID0gZnVuY3Rpb24oZGVnKXtcbiAgICAgICAgdGhpcy5yb3RhdGVkID0gZGVnO1xuICAgIH07XG5cbiAgICAvLy8vLy8vXG4gICAgLy8gZnVuY3Rpb25zIGZvciBhZGRpbmcgZHJhd2luZ19wYXJ0c1xuXG4gICAgZHJhd2luZy5hZGQgPSBmdW5jdGlvbih0eXBlLCBwb2ludHMsIGxheWVyX25hbWUsIGF0dHJzKSB7XG4gICAgICAgIGlmKCBwb2ludHNbMF0gPT09IHVuZGVmaW5lZCApIGNvbnNvbGUud2FybihcInBvaW50cyBub3QgZGVmZmluZWRcIiwgdHlwZSwgcG9pbnRzLCBsYXllcl9uYW1lICk7XG5cbiAgICAgICAgaWYoICEgbGF5ZXJfbmFtZSApIHsgbGF5ZXJfbmFtZSA9IGxheWVyX2FjdGl2ZTsgfVxuICAgICAgICBpZiggISAobGF5ZXJfbmFtZSBpbiBsYXllcl9hdHRyKSApIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignRXJyb3I6IExheWVyIFwiJysgbGF5ZXJfbmFtZSArJ1wiIG5hbWUgbm90IGZvdW5kLCB1c2luZyBiYXNlJyk7XG4gICAgICAgICAgICBsYXllcl9uYW1lID0gJ2Jhc2UnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIHR5cGVvZiBwb2ludHMgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciBwb2ludHNfYSA9IHBvaW50cy5zcGxpdCgnICcpO1xuICAgICAgICAgICAgZm9yKCB2YXIgaSBpbiBwb2ludHNfYSApIHtcbiAgICAgICAgICAgICAgICBwb2ludHNfYVtpXSA9IHBvaW50c19hW2ldLnNwbGl0KCcsJyk7XG4gICAgICAgICAgICAgICAgZm9yKCB2YXIgYyBpbiBwb2ludHNfYVtpXSApIHtcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzX2FbaV1bY10gPSBOdW1iZXIocG9pbnRzX2FbaV1bY10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cblxuICAgICAgICB2YXIgZWxlbSA9IE9iamVjdC5jcmVhdGUoU3ZnRWxlbSk7XG4gICAgICAgIGVsZW0udHlwZSA9IHR5cGU7XG4gICAgICAgIGVsZW0ubGF5ZXJfbmFtZSA9IGxheWVyX25hbWU7XG4gICAgICAgIGVsZW0uc2VjdGlvbl9uYW1lID0gc2VjdGlvbl9hY3RpdmU7XG4gICAgICAgIGlmKCBhdHRycyAhPT0gdW5kZWZpbmVkICkgZWxlbS5hdHRycyA9IGF0dHJzO1xuICAgICAgICBpZiggdHlwZSA9PT0gJ2xpbmUnICkge1xuICAgICAgICAgICAgZWxlbS5wb2ludHMgPSBwb2ludHM7XG4gICAgICAgIH0gZWxzZSBpZiggdHlwZSA9PT0gJ3BvbHknICkge1xuICAgICAgICAgICAgZWxlbS5wb2ludHMgPSBwb2ludHM7XG4gICAgICAgIH0gZWxzZSBpZiggdHlwZW9mIHBvaW50c1swXS54ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZWxlbS54ID0gcG9pbnRzWzBdWzBdO1xuICAgICAgICAgICAgZWxlbS55ID0gcG9pbnRzWzBdWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbS54ID0gcG9pbnRzWzBdLng7XG4gICAgICAgICAgICBlbGVtLnkgPSBwb2ludHNbMF0ueTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGJsb2NrX2FjdGl2ZSkge1xuICAgICAgICAgICAgZWxlbS5ibG9ja19uYW1lID0gYmxvY2tfYWN0aXZlO1xuICAgICAgICAgICAgZy5kcmF3aW5nLmJsb2Nrc1tibG9ja19hY3RpdmVdLmFkZChlbGVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd2luZ19wYXJ0cy5wdXNoKGVsZW0pO1xuICAgICAgICB9XG5cblxuICAgICAgICAvLyBUZW1wLiBOYU4gY2hlY2tcbiAgICAgICAgcG9pbnRzLmZvckVhY2goZnVuY3Rpb24ocG9pbnQpe1xuICAgICAgICAgICAgaWYoIHBvaW50LmNvbnN0cnVjdG9yID09PSBBcnJheSApe1xuICAgICAgICAgICAgICAgIHBvaW50LmZvckVhY2goZnVuY3Rpb24obnVtKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIGlzTmFOKG51bSkgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnTmFOIGFsZXJ0OicsIGVsZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmKCBpc05hTihwb2ludC54KSB8fCBpc05hTihwb2ludC55KSApe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ05hTiBhbGVydDonLCBlbGVtKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgfTtcblxuICAgIGRyYXdpbmcubGluZSA9IGZ1bmN0aW9uKHBvaW50cywgbGF5ZXIsIGF0dHJzKXsgLy8gKHBvaW50cywgW2xheWVyXSlcbiAgICAgICAgLy9yZXR1cm4gYWRkKCdsaW5lJywgcG9pbnRzLCBsYXllcilcbiAgICAgICAgdmFyIGxpbmUgPSAgdGhpcy5hZGQoJ2xpbmUnLCBwb2ludHMsIGxheWVyLCBhdHRycyk7XG4gICAgICAgIHJldHVybiBsaW5lO1xuICAgIH07XG5cbiAgICBkcmF3aW5nLnBvbHkgPSBmdW5jdGlvbihwb2ludHMsIGxheWVyLCBhdHRycyl7IC8vIChwb2ludHMsIFtsYXllcl0pXG4gICAgICAgIC8vcmV0dXJuIGFkZCgncG9seScsIHBvaW50cywgbGF5ZXIpXG4gICAgICAgIHZhciBwb2x5ID0gIHRoaXMuYWRkKCdwb2x5JywgcG9pbnRzLCBsYXllciwgYXR0cnMpO1xuICAgICAgICByZXR1cm4gcG9seTtcbiAgICB9O1xuXG4gICAgZHJhd2luZy5yZWN0ID0gZnVuY3Rpb24obG9jLCBzaXplLCBsYXllciwgYXR0cnMpe1xuICAgICAgICB2YXIgcmVjID0gdGhpcy5hZGQoJ3JlY3QnLCBbbG9jXSwgbGF5ZXIsIGF0dHJzKTtcbiAgICAgICAgcmVjLncgPSBzaXplWzBdO1xuICAgICAgICAvKlxuICAgICAgICBpZiggdHlwZW9mIGxheWVyX25hbWUgIT09ICd1bmRlZmluZWQnICYmIChsYXllcl9uYW1lIGluIGxheWVycykgKSB7XG4gICAgICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSBsYXllcnNbbGF5ZXJfbmFtZV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKCAhIChsYXllcl9uYW1lIGluIGxheWVycykgKXsgY29uc29sZS5sb2coXCJlcnJvciwgbGF5ZXIgZG9lcyBub3QgZXhpc3QsIHVzaW5nIGN1cnJlbnRcIik7fVxuICAgICAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gIGxheWVyX2FjdGl2ZVxuICAgICAgICB9XG4gICAgICAgICovXG4gICAgICAgIHJlYy5oID0gc2l6ZVsxXTtcbiAgICAgICAgcmV0dXJuIHJlYztcbiAgICB9O1xuXG4gICAgZHJhd2luZy5jaXJjID0gZnVuY3Rpb24obG9jLCBkaWFtZXRlciwgbGF5ZXIsIGF0dHJzKXtcbiAgICAgICAgdmFyIGNpciA9IHRoaXMuYWRkKCdjaXJjJywgW2xvY10sIGxheWVyLCBhdHRycyk7XG4gICAgICAgIGNpci5kID0gZGlhbWV0ZXI7XG4gICAgICAgIHJldHVybiBjaXI7XG4gICAgfTtcblxuICAgIGRyYXdpbmcudGV4dCA9IGZ1bmN0aW9uKGxvYywgc3RyaW5ncywgbGF5ZXIsIGZvbnQsIGF0dHJzKXtcbiAgICAgICAgdmFyIHR4dCA9IHRoaXMuYWRkKCd0ZXh0JywgW2xvY10sIGxheWVyLCBhdHRycyk7XG4gICAgICAgIGlmKCB0eXBlb2Ygc3RyaW5ncyA9PSAnc3RyaW5nJyl7XG4gICAgICAgICAgICBzdHJpbmdzID0gW3N0cmluZ3NdO1xuICAgICAgICB9XG4gICAgICAgIHR4dC5zdHJpbmdzID0gc3RyaW5ncztcbiAgICAgICAgdHh0LmZvbnQgPSBmb250O1xuICAgICAgICByZXR1cm4gdHh0O1xuICAgIH07XG5cbiAgICBkcmF3aW5nLmltYWdlID0gZnVuY3Rpb24obG9jLCBzaXplLCBocmVmLCBsYXllciwgYXR0cnMpe1xuICAgICAgICB2YXIgaW1nID0gdGhpcy5hZGQoJ2ltYWdlJywgW2xvY10sICdpbWFnZScsIGF0dHJzKTtcbiAgICAgICAgaW1nLncgPSBzaXplWzBdO1xuICAgICAgICBpbWcuaCA9IHNpemVbMV07XG4gICAgICAgIGltZy5ocmVmID0gaHJlZjtcbiAgICAgICAgcmV0dXJuIGltZztcbiAgICB9O1xuXG4gICAgZHJhd2luZy5ibG9jayA9IGZ1bmN0aW9uKG5hbWUpIHsvLyBzZXQgY3VycmVudCBibG9ja1xuICAgICAgICB2YXIgeCx5O1xuICAgICAgICBpZiggYXJndW1lbnRzLmxlbmd0aCA9PT0gMiApeyAvLyBpZiBjb29yIGlzIHBhc3NlZFxuICAgICAgICAgICAgaWYoIHR5cGVvZiBhcmd1bWVudHNbMV0ueCAhPT0gJ3VuZGVmaW5lZCcgKXtcbiAgICAgICAgICAgICAgICB4ID0gYXJndW1lbnRzWzFdLng7XG4gICAgICAgICAgICAgICAgeSA9IGFyZ3VtZW50c1sxXS55O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB4ID0gYXJndW1lbnRzWzFdWzBdO1xuICAgICAgICAgICAgICAgIHkgPSBhcmd1bWVudHNbMV1bMV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiggYXJndW1lbnRzLmxlbmd0aCA9PT0gMyApeyAvLyBpZiB4LHkgaXMgcGFzc2VkXG4gICAgICAgICAgICB4ID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgeSA9IGFyZ3VtZW50c1syXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE86IHdoYXQgaWYgYmxvY2sgZG9lcyBub3QgZXhpc3Q/IHByaW50IGxpc3Qgb2YgYmxvY2tzP1xuICAgICAgICB2YXIgYmxrID0gT2JqZWN0LmNyZWF0ZShnLmRyYXdpbmcuYmxvY2tzW25hbWVdKTtcbiAgICAgICAgYmxrLnggPSB4O1xuICAgICAgICBibGsueSA9IHk7XG5cbiAgICAgICAgaWYoYmxvY2tfYWN0aXZlKXtcbiAgICAgICAgICAgIGcuZHJhd2luZy5ibG9ja3NbYmxvY2tfYWN0aXZlXS5hZGQoYmxrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd2luZ19wYXJ0cy5wdXNoKGJsayk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJsaztcbiAgICB9O1xuXG5cblxuXG5cblxuXG5cblxuXG4gICAgLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBUYWJsZXNcblxuICAgIHZhciBDZWxsID0ge1xuICAgICAgICBpbml0OiBmdW5jdGlvbih0YWJsZSwgUiwgQyl7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzLnRhYmxlID0gdGFibGU7XG4gICAgICAgICAgICB0aGlzLlIgPSBSO1xuICAgICAgICAgICAgdGhpcy5DID0gQztcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICB0aGlzLmJvcmRlcnMgPSB7fTtcbiAgICAgICAgICAgIHRoaXMuYm9yZGVyX29wdGlvbnMuZm9yRWFjaChmdW5jdGlvbihzaWRlKXtcbiAgICAgICAgICAgICAgICBzZWxmLmJvcmRlcnNbc2lkZV0gPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8qL1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG4gICAgICAgIC8qXG4gICAgICAgIGJvcmRlcl9vcHRpb25zOiBbJ1QnLCAnQicsICdMJywgJ1InXSxcbiAgICAgICAgLy8qL1xuICAgICAgICB0ZXh0OiBmdW5jdGlvbih0ZXh0KXtcbiAgICAgICAgICAgIHRoaXMuY2VsbF90ZXh0ID0gdGV4dDtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGZvbnQ6IGZ1bmN0aW9uKGZvbnRfbmFtZSl7XG4gICAgICAgICAgICB0aGlzLmNlbGxfZm9udF9uYW1lID0gZm9udF9uYW1lO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYm9yZGVyOiBmdW5jdGlvbihib3JkZXJfc3RyaW5nLCBzdGF0ZSl7XG4gICAgICAgICAgICB0aGlzLnRhYmxlLmJvcmRlciggdGhpcy5SLCB0aGlzLkMsIGJvcmRlcl9zdHJpbmcsIHN0YXRlICk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgVGFibGUgPSB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCBkcmF3aW5nLCBudW1fcm93cywgbnVtX2NvbHMgKXtcbiAgICAgICAgICAgIHRoaXMuZHJhd2luZyA9IGRyYXdpbmc7XG4gICAgICAgICAgICB0aGlzLm51bV9yb3dzID0gbnVtX3Jvd3M7XG4gICAgICAgICAgICB0aGlzLm51bV9jb2xzID0gbnVtX2NvbHM7XG4gICAgICAgICAgICB2YXIgcixjO1xuXG4gICAgICAgICAgICAvLyBzZXR1cCBib3JkZXIgY29udGFpbmVyc1xuICAgICAgICAgICAgdGhpcy5ib3JkZXJzX3Jvd3MgPSBbXTtcbiAgICAgICAgICAgIGZvciggcj0wOyByPD1udW1fcm93czsgcisrKXtcbiAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfcm93c1tyXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciggYz0xOyBjPD1udW1fY29sczsgYysrKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3JkZXJzX3Jvd3Nbcl1bY10gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmJvcmRlcnNfY29scyA9IFtdO1xuICAgICAgICAgICAgZm9yKCBjPTA7IGM8PW51bV9jb2xzOyBjKyspe1xuICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyc19jb2xzW2NdID0gW107XG4gICAgICAgICAgICAgICAgZm9yKCByPTE7IHI8PW51bV9yb3dzOyByKyspe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfY29sc1tjXVtyXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2V0IGNvbHVtbiBhbmQgcm93IHNpemUgY29udGFpbmVyc1xuICAgICAgICAgICAgdGhpcy5yb3dfc2l6ZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciggcj0xOyByPD1udW1fcm93czsgcisrKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJvd19zaXplc1tyXSA9IDE1O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb2xfc2l6ZXMgPSBbXTtcbiAgICAgICAgICAgIGZvciggYz0xOyBjPD1udW1fY29sczsgYysrKXtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbF9zaXplc1tjXSA9IDYwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZXR1cCBjZWxsIGNvbnRhaW5lclxuICAgICAgICAgICAgdGhpcy5jZWxscyA9IFtdO1xuICAgICAgICAgICAgZm9yKCByPTE7IHI8PW51bV9yb3dzOyByKyspe1xuICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbcl0gPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IoIGM9MTsgYzw9bnVtX2NvbHM7IGMrKyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbcl1bY10gPSBPYmplY3QuY3JlYXRlKENlbGwpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNlbGxzW3JdW2NdLmluaXQoIHRoaXMsIHIsIGMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8qL1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcbiAgICAgICAgbG9jOiBmdW5jdGlvbiggeCwgeSl7XG4gICAgICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICAgICAgdGhpcy55ID0geTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuICAgICAgICBjZWxsOiBmdW5jdGlvbiggUiwgQyApe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2VsbHNbUl1bQ107XG4gICAgICAgIH0sXG4gICAgICAgIGFsbF9jZWxsczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBjZWxsX2FycmF5ID0gW107XG4gICAgICAgICAgICB0aGlzLmNlbGxzLmZvckVhY2goZnVuY3Rpb24ocm93KXtcbiAgICAgICAgICAgICAgICByb3cuZm9yRWFjaChmdW5jdGlvbihjZWxsKXtcbiAgICAgICAgICAgICAgICAgICAgY2VsbF9hcnJheS5wdXNoKGNlbGwpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gY2VsbF9hcnJheTtcbiAgICAgICAgfSxcbiAgICAgICAgY29sX3NpemU6IGZ1bmN0aW9uKGNvbCwgc2l6ZSl7XG4gICAgICAgICAgICBpZiggdHlwZW9mIGNvbCA9PT0gJ3N0cmluZycgKXtcbiAgICAgICAgICAgICAgICBpZiggY29sID09PSAnYWxsJyl7XG4gICAgICAgICAgICAgICAgICAgIF8ucmFuZ2UodGhpcy5udW1fY29scykuZm9yRWFjaChmdW5jdGlvbihjKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sX3NpemVzW2MrMV0gPSBzaXplO1xuICAgICAgICAgICAgICAgICAgICB9LHRoaXMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNpemUgPSBOdW1iZXIoc2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKCBpc05hTihzaXplKSApe1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yOiBjb2x1bW4gd3JvbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29sX3NpemVzW2NvbF0gPSBzaXplO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHsgLy8gaXMgbnVtYmVyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xfc2l6ZXNbY29sXSA9IHNpemU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcbiAgICAgICAgLy8qL1xuICAgICAgICByb3dfc2l6ZTogZnVuY3Rpb24ocm93LCBzaXplKXtcbiAgICAgICAgICAgIGlmKCB0eXBlb2Ygcm93ID09PSAnc3RyaW5nJyApe1xuICAgICAgICAgICAgICAgIGlmKCByb3cgPT09ICdhbGwnKXtcbiAgICAgICAgICAgICAgICAgICAgXy5yYW5nZSh0aGlzLm51bV9yb3dzKS5mb3JFYWNoKGZ1bmN0aW9uKHIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3dfc2l6ZXNbcisxXSA9IHNpemU7XG4gICAgICAgICAgICAgICAgICAgIH0sdGhpcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2l6ZSA9IE51bWJlcihzaXplKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoIGlzTmFOKHNpemUpICl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6IGNvbHVtbiB3cm9uZycpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3dfc2l6ZXNbcm93XSA9IHNpemU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBpcyBudW1iZXJcbiAgICAgICAgICAgICAgICB0aGlzLnJvd19zaXplc1tyb3ddID0gc2l6ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuICAgICAgICAvLyovXG5cbiAgICAgICAgLypcbiAgICAgICAgYWRkX2NlbGw6IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgfSxcbiAgICAgICAgYWRkX3Jvd3M6IGZ1bmN0aW9uKG4pe1xuICAgICAgICAgICAgdGhpcy5udW1fY29sbW5zICs9IG47XG4gICAgICAgICAgICB0aGlzLm51bV9yb3dzICs9IG47XG4gICAgICAgICAgICBfLnJhbmdlKG4pLmZvckVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB0aGlzLnJvd3MucHVzaChbXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIF8ucmFuZ2UobikuZm9yRWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dF9yb3dzLnB1c2goW10pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSxcbiAgICAgICAgdGV4dDogZnVuY3Rpb24oIFIsIEMsIHRleHQpe1xuICAgICAgICAgICAgdGhpcy50ZXh0X3Jvd3NbUl1bQ10gPSB0ZXh0O1xuICAgICAgICB9LFxuICAgICAgICAvLyovXG4gICAgICAgIGJvcmRlcjogZnVuY3Rpb24oIFIsIEMsIGJvcmRlcl9zdHJpbmcsIHN0YXRlKXtcbiAgICAgICAgICAgIGlmKCBzdGF0ZSA9PT0gdW5kZWZpbmVkICkgc3RhdGUgPSB0cnVlO1xuXG4gICAgICAgICAgICBib3JkZXJfc3RyaW5nID0gYm9yZGVyX3N0cmluZy50b1VwcGVyQ2FzZSgpLnRyaW0oKTtcbiAgICAgICAgICAgIHZhciBib3JkZXJzO1xuICAgICAgICAgICAgaWYoIGJvcmRlcl9zdHJpbmcgPT09ICdBTEwnICl7XG4gICAgICAgICAgICAgICAgYm9yZGVycyA9IFsnVCcsICdCJywgJ0wnLCAnUiddO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBib3JkZXJzID0gYm9yZGVyX3N0cmluZy5zcGxpdCgvW1xccyxdKy8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYm9yZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHNpZGUpe1xuICAgICAgICAgICAgICAgIHN3aXRjaChzaWRlKXtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnVCc6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfcm93c1tSLTFdW0NdID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQic6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfcm93c1tSXVtDXSA9IHN0YXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0wnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3JkZXJzX2NvbHNbQy0xXVtSXSA9IHN0YXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1InOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3JkZXJzX2NvbHNbQ11bUl0gPSBzdGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG4gICAgICAgIGNvcm5lcjogZnVuY3Rpb24oUixDKXtcbiAgICAgICAgICAgIHZhciB4ID0gdGhpcy54O1xuICAgICAgICAgICAgdmFyIHkgPSB0aGlzLnk7XG4gICAgICAgICAgICB2YXIgcixjO1xuICAgICAgICAgICAgZm9yKCByPTE7IHI8PVI7IHIrKyApe1xuICAgICAgICAgICAgICAgIHkgKz0gdGhpcy5yb3dfc2l6ZXNbcl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IoIGM9MTsgYzw9QzsgYysrICl7XG4gICAgICAgICAgICAgICAgeCArPSB0aGlzLmNvbF9zaXplc1tjXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbeCx5XTtcbiAgICAgICAgfSxcbiAgICAgICAgY2VudGVyOiBmdW5jdGlvbihSLEMpe1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLng7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMueTtcbiAgICAgICAgICAgIHZhciByLGM7XG4gICAgICAgICAgICBmb3IoIHI9MTsgcjw9UjsgcisrICl7XG4gICAgICAgICAgICAgICAgeSArPSB0aGlzLnJvd19zaXplc1tyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciggYz0xOyBjPD1DOyBjKysgKXtcbiAgICAgICAgICAgICAgICB4ICs9IHRoaXMuY29sX3NpemVzW2NdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeSAtPSB0aGlzLnJvd19zaXplc1tSXS8yO1xuICAgICAgICAgICAgeCAtPSB0aGlzLmNvbF9zaXplc1tDXS8yO1xuICAgICAgICAgICAgcmV0dXJuIFt4LHldO1xuICAgICAgICB9LFxuICAgICAgICBsZWZ0OiBmdW5jdGlvbihSLEMpe1xuICAgICAgICAgICAgdmFyIGNvb3IgPSB0aGlzLmNlbnRlcihSLEMpO1xuICAgICAgICAgICAgY29vclswXSA9IGNvb3JbMF0gLSB0aGlzLmNvbF9zaXplc1tDXS8yICsgdGhpcy5yb3dfc2l6ZXNbUl0vMjtcbiAgICAgICAgICAgIHJldHVybiBjb29yO1xuICAgICAgICB9LFxuICAgICAgICByaWdodDogZnVuY3Rpb24oUixDKXtcbiAgICAgICAgICAgIHZhciBjb29yID0gdGhpcy5jZW50ZXIoUixDKTtcbiAgICAgICAgICAgIGNvb3JbMF0gPSBjb29yWzBdICsgdGhpcy5jb2xfc2l6ZXNbQ10vMiAtIHRoaXMucm93X3NpemVzW1JdLzI7XG4gICAgICAgICAgICByZXR1cm4gY29vcjtcbiAgICAgICAgfSxcbiAgICAgICAgbWs6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgcixjO1xuICAgICAgICAgICAgZm9yKCByPTA7IHI8PXRoaXMubnVtX3Jvd3M7IHIrKyApe1xuICAgICAgICAgICAgICAgIGZvciggYz0xOyBjPD10aGlzLm51bV9jb2xzOyBjKysgKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIHRoaXMuYm9yZGVyc19yb3dzW3JdW2NdID09PSB0cnVlICl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdpbmcubGluZShbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JuZXIocixjLTEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ybmVyKHIsYyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSwgJ2JvcmRlcicpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IoIGM9MDsgYzw9dGhpcy5udW1fY29sczsgYysrICl7XG4gICAgICAgICAgICAgICAgZm9yKCByPTE7IHI8PXRoaXMubnVtX3Jvd3M7IHIrKyApe1xuICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy5ib3JkZXJzX2NvbHNbY11bcl0gPT09IHRydWUgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd2luZy5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcm5lcihyLTEsYyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JuZXIocixjKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLCAnYm9yZGVyJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciggcj0xOyByPD10aGlzLm51bV9yb3dzOyByKysgKXtcbiAgICAgICAgICAgICAgICBmb3IoIGM9MTsgYzw9dGhpcy5udW1fY29sczsgYysrICl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCB0eXBlb2YgdGhpcy5jZWxsKHIsYykuY2VsbF90ZXh0ID09PSAnc3RyaW5nJyApe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNlbGwgPSB0aGlzLmNlbGwocixjKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmb250X25hbWUgPSBjZWxsLmNlbGxfZm9udF9uYW1lIHx8ICd0YWJsZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29vcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBmb250c1tmb250X25hbWVdWyd0ZXh0LWFuY2hvciddID09PSAnY2VudGVyJykgY29vciA9IHRoaXMuY2VudGVyKHIsYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKCBmb250c1tmb250X25hbWVdWyd0ZXh0LWFuY2hvciddID09PSAncmlnaHQnKSBjb29yID0gdGhpcy5yaWdodChyLGMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiggZm9udHNbZm9udF9uYW1lXVsndGV4dC1hbmNob3InXSA9PT0gJ2xlZnQnKSBjb29yID0gdGhpcy5sZWZ0KHIsYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGNvb3IgPSB0aGlzLmNlbnRlcihyLGMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdpbmcudGV4dChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29yLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbChyLGMpLmNlbGxfdGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAndGV4dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udF9uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBkcmF3aW5nLnRhYmxlID0gZnVuY3Rpb24oIG51bV9yb3dzLCBudW1fY29scyApe1xuICAgICAgICB2YXIgbmV3X3RhYmxlID0gT2JqZWN0LmNyZWF0ZShUYWJsZSk7XG4gICAgICAgIG5ld190YWJsZS5pbml0KCB0aGlzLCBudW1fcm93cywgbnVtX2NvbHMgKTtcblxuICAgICAgICByZXR1cm4gbmV3X3RhYmxlO1xuXG4gICAgfTtcblxuXG4gICAgZHJhd2luZy5hcHBlbmQgPSAgZnVuY3Rpb24oZHJhd2luZ19wYXJ0cyl7XG4gICAgICAgIHRoaXMuZHJhd2luZ19wYXJ0cyA9IHRoaXMuZHJhd2luZ19wYXJ0cy5jb25jYXQoZHJhd2luZ19wYXJ0cyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cblxuXG5cbiAgICB2YXIgcGFnZSA9IE9iamVjdC5jcmVhdGUoZHJhd2luZyk7XG4gICAgLy9jb25zb2xlLmxvZyhwYWdlKTtcbiAgICBwYWdlLmRyYXdpbmdfcGFydHMgPSBbXTtcbiAgICByZXR1cm4gcGFnZTtcblxuXG5cblxufTtcblxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gbWtfZHJhd2luZztcbiIsInZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG52YXIgbWtfYm9yZGVyID0gcmVxdWlyZSgnLi9ta19ib3JkZXInKTtcblxudmFyIHBhZ2UgPSBmdW5jdGlvbihzZXR0aW5ncywgc2hlZXRfaW5mbyl7XG4gICAgY29uc29sZS5sb2coXCIqKiBNYWtpbmcgcGFnZSBcIitzaGVldF9pbmZvLm51bSk7XG5cbiAgICAvL3ZhciBwYWdlX21ha2VyID0gcmVxdWlyZSgpXG5cbiAgICB2YXIgZCA9IG1rX2RyYXdpbmcoc2V0dGluZ3MpO1xuXG4gICAgZC5hcHBlbmQobWtfYm9yZGVyKHNldHRpbmdzLCBzaGVldF9pbmZvICkpO1xuXG5cblxuICAgIGlmKCBzZXR0aW5ncy5mLm1rX3BhZ2Vbc2hlZXRfaW5mby5udW1dICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnU2hlZXQgZGVmaW5lZCcpO1xuICAgICAgICBkLmFwcGVuZCggc2V0dGluZ3MuZi5ta19wYWdlW3NoZWV0X2luZm8ubnVtXShzZXR0aW5ncykgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6IFNoZWV0IG5vdCBkZWZpbmVkJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xudmFyIG1rX2JvcmRlciA9IHJlcXVpcmUoJy4vbWtfYm9yZGVyJyk7XG52YXIgZiA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zJyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHByZXZpZXcgMVwiKTtcblxuICAgIHZhciBkID0gbWtfZHJhd2luZyhzZXR0aW5ncyk7XG5cblxuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5cbiAgICB2YXIgeCwgeSwgaCwgdywgc2VjdGlvbl94LCBzZWN0aW9uX3k7XG5cbiAgICB3ID0gc2l6ZS5wcmV2aWV3Lm1vZHVsZS53O1xuICAgIGggPSBzaXplLnByZXZpZXcubW9kdWxlLmg7XG4gICAgbG9jLnByZXZpZXcuYXJyYXkuYm90dG9tID0gbG9jLnByZXZpZXcuYXJyYXkudG9wICsgaCoxLjI1KnN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgKyBoKjMvNDtcbiAgICAvL2xvYy5wcmV2aWV3LmFycmF5LnJpZ2h0ID0gbG9jLnByZXZpZXcuYXJyYXkubGVmdCArIHcqMS4yNSpzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgKyB3KjI7XG4gICAgbG9jLnByZXZpZXcuYXJyYXkucmlnaHQgPSBsb2MucHJldmlldy5hcnJheS5sZWZ0ICsgdyoxLjI1KjggKyB3KjI7XG5cbiAgICBsb2MucHJldmlldy5pbnZlcnRlci5jZW50ZXIgPSA1MDAgO1xuICAgIHcgPSBzaXplLnByZXZpZXcuaW52ZXJ0ZXIudztcbiAgICBsb2MucHJldmlldy5pbnZlcnRlci5sZWZ0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIuY2VudGVyIC0gdy8yO1xuICAgIGxvYy5wcmV2aWV3LmludmVydGVyLnJpZ2h0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIuY2VudGVyICsgdy8yO1xuXG4gICAgbG9jLnByZXZpZXcuREMubGVmdCA9IGxvYy5wcmV2aWV3LmFycmF5LnJpZ2h0O1xuICAgIGxvYy5wcmV2aWV3LkRDLnJpZ2h0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIubGVmdDtcbiAgICBsb2MucHJldmlldy5EQy5jZW50ZXIgPSAoIGxvYy5wcmV2aWV3LkRDLnJpZ2h0ICsgbG9jLnByZXZpZXcuREMubGVmdCApLzI7XG5cbiAgICBsb2MucHJldmlldy5BQy5sZWZ0ID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIucmlnaHQ7XG4gICAgbG9jLnByZXZpZXcuQUMucmlnaHQgPSBsb2MucHJldmlldy5BQy5sZWZ0ICsgMzAwO1xuICAgIGxvYy5wcmV2aWV3LkFDLmNlbnRlciA9ICggbG9jLnByZXZpZXcuQUMucmlnaHQgKyBsb2MucHJldmlldy5BQy5sZWZ0ICkvMjtcblxuXG4vLyBUT0RPIGZpeDogc2VjdGlvbnMgbXVzdCBiZSBkZWZpbmVkIGluIG9yZGVyLCBvciB0aGVyZSBhcmUgYXJlYXNcblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZChzZXR0aW5ncywgJ2FycmF5JykgJiYgZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdtb2R1bGUnKSApe1xuICAgICAgICBkLmxheWVyKCdwcmV2aWV3X2FycmF5Jyk7XG5cbiAgICAgICAgdyA9IHNpemUucHJldmlldy5tb2R1bGUudztcbiAgICAgICAgaCA9IHNpemUucHJldmlldy5tb2R1bGUuaDtcbiAgICAgICAgdmFyIG9mZnNldCA9IDQwO1xuXG4gICAgICAgIGZvciggdmFyIHM9MDsgczxzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3M7IHMrKyApe1xuICAgICAgICAgICAgeCA9IGxvYy5wcmV2aWV3LmFycmF5LmxlZnQgKyB3KjEuMjUqcztcbiAgICAgICAgICAgIC8vIHN0cmluZyB3aXJpbmdcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFsgeCAsIGxvYy5wcmV2aWV3LmFycmF5LnRvcCBdLFxuICAgICAgICAgICAgICAgICAgICBbIHggLCBsb2MucHJldmlldy5hcnJheS5ib3R0b20gXSxcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgLy8gbW9kdWxlc1xuICAgICAgICAgICAgZm9yKCB2YXIgbT0wOyBtPHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmc7IG0rKyApe1xuICAgICAgICAgICAgICAgIHkgPSBsb2MucHJldmlldy5hcnJheS50b3AgKyBoICsgaCoxLjI1Km07XG4gICAgICAgICAgICAgICAgLy8gbW9kdWxlc1xuICAgICAgICAgICAgICAgIGQucmVjdChcbiAgICAgICAgICAgICAgICAgICAgWyB4ICwgeSBdLFxuICAgICAgICAgICAgICAgICAgICBbdyxoXSxcbiAgICAgICAgICAgICAgICAgICAgJ3ByZXZpZXdfbW9kdWxlJ1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0b3AgYXJyYXkgY29uZHVpdFxuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuYXJyYXkubGVmdCAsIGxvYy5wcmV2aWV3LmFycmF5LnRvcCBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuYXJyYXkucmlnaHQgLSB3LCBsb2MucHJldmlldy5hcnJheS50b3AgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LmFycmF5LnJpZ2h0ICwgbG9jLnByZXZpZXcuYXJyYXkudG9wIF0sXG4gICAgICAgICAgICBdXG4gICAgICAgICk7XG4gICAgICAgIC8vIGJvdHRvbSBhcnJheSBjb25kdWl0XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5hcnJheS5sZWZ0ICwgbG9jLnByZXZpZXcuYXJyYXkuYm90dG9tIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5hcnJheS5yaWdodCAtIHcgLCBsb2MucHJldmlldy5hcnJheS5ib3R0b20gXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LmFycmF5LnJpZ2h0IC0gdyAsIGxvYy5wcmV2aWV3LmFycmF5LnRvcCBdLFxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuXG4gICAgICAgIHkgPSBsb2MucHJldmlldy5hcnJheS50b3A7XG4gICAgICAgIGggPSBzaXplLnByZXZpZXcubW9kdWxlLmg7XG5cbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgWyBsb2MucHJldmlldy5EQy5jZW50ZXIsIHkraC8yK29mZnNldCBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdBcnJheSBEQycsXG4gICAgICAgICAgICAgICAgJ1N0cmluZ3M6ICcgKyBwYXJzZUZsb2F0KHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncykudG9GaXhlZCgpLFxuICAgICAgICAgICAgICAgICdNb2R1bGVzOiAnICsgcGFyc2VGbG9hdChzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nKS50b0ZpeGVkKCksXG4gICAgICAgICAgICAgICAgJ1BtcDogJyArIHBhcnNlRmxvYXQoc3lzdGVtLmFycmF5LnBtcCkudG9GaXhlZCgpLFxuICAgICAgICAgICAgICAgICdJbXA6ICcgKyBwYXJzZUZsb2F0KHN5c3RlbS5hcnJheS5pbXApLnRvRml4ZWQoKSxcbiAgICAgICAgICAgICAgICAnVm1wOiAnICsgcGFyc2VGbG9hdChzeXN0ZW0uYXJyYXkudm1wKS50b0ZpeGVkKCksXG4gICAgICAgICAgICAgICAgJ0lzYzogJyArIHBhcnNlRmxvYXQoc3lzdGVtLmFycmF5LmlzYykudG9GaXhlZCgpLFxuICAgICAgICAgICAgICAgICdWb2M6ICcgKyBwYXJzZUZsb2F0KHN5c3RlbS5hcnJheS52b2MpLnRvRml4ZWQoKSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAncHJldmlldyB0ZXh0J1xuICAgICAgICApO1xuICAgIH1cblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZChzZXR0aW5ncywgJ0RDJykgKXtcbiAgICAgICAgZC5sYXllcigncHJldmlld19EQycpO1xuXG4gICAgICAgIC8veSA9IHk7XG4gICAgICAgIHkgPSBsb2MucHJldmlldy5hcnJheS50b3A7XG4gICAgICAgIHcgPSBzaXplLnByZXZpZXcubW9kdWxlLnc7XG4gICAgICAgIGggPSBzaXplLnByZXZpZXcubW9kdWxlLmg7XG5cbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LkRDLmxlZnQgLCB5IF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5EQy5yaWdodCwgeSBdLFxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbbG9jLnByZXZpZXcuREMuY2VudGVyLHldLFxuICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAncHJldmlld19EQ19ib3gnXG4gICAgICAgICk7XG5cbiAgICB9XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdpbnZlcnRlcicpICl7XG5cbiAgICAgICAgZC5sYXllcigncHJldmlld19pbnZlcnRlcicpO1xuXG4gICAgICAgIHkgPSB5O1xuICAgICAgICB3ID0gc2l6ZS5wcmV2aWV3LmludmVydGVyLnc7XG4gICAgICAgIGggPSBzaXplLnByZXZpZXcuaW52ZXJ0ZXIuaDtcblxuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbbG9jLnByZXZpZXcuaW52ZXJ0ZXIuY2VudGVyLHldLFxuICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAncHJldmlld19pbnZlcnRlcl9ib3gnXG4gICAgICAgICk7XG4gICAgICAgIGQudGV4dChcbiAgICAgICAgICAgIFtsb2MucHJldmlldy5pbnZlcnRlci5jZW50ZXIseStoLzIrb2Zmc2V0XSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnSW52ZXJ0ZXInLFxuICAgICAgICAgICAgICAgIHN5c3RlbS5pbnZlcnRlci5tYWtlLFxuICAgICAgICAgICAgICAgIHN5c3RlbS5pbnZlcnRlci5tb2RlbCxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAncHJldmlldyB0ZXh0J1xuICAgICAgICApO1xuICAgIH1cblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZChzZXR0aW5ncywgJ0FDJykgKXtcblxuICAgICAgICBkLmxheWVyKCdwcmV2aWV3X0FDJyk7XG5cblxuICAgICAgICB5ID0geTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LkFDLmxlZnQsIHkgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LkFDLnJpZ2h0LCB5IF0sXG4gICAgICAgICAgICBdXG4gICAgICAgICk7XG4gICAgICAgIHcgPSBzaXplLnByZXZpZXcuQUMudztcbiAgICAgICAgaCA9IHNpemUucHJldmlldy5BQy5oO1xuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbbG9jLnByZXZpZXcuQUMuY2VudGVyLHldLFxuICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAncHJldmlld19BQ19ib3gnXG4gICAgICAgICk7XG4gICAgICAgIHcgPSBzaXplLnByZXZpZXcubG9hZGNlbnRlci53O1xuICAgICAgICBoID0gc2l6ZS5wcmV2aWV3LmxvYWRjZW50ZXIuaDtcbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgWyBsb2MucHJldmlldy5BQy5yaWdodC13LzIsIHkraC80IF0sXG4gICAgICAgICAgICBbdyxoXSxcbiAgICAgICAgICAgICdwcmV2aWV3X0FDX2JveCdcbiAgICAgICAgKTtcblxuICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICBbbG9jLnByZXZpZXcuQUMuY2VudGVyLHkraC8yK29mZnNldF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ0FDJyxcblxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdwcmV2aWV3IHRleHQnXG4gICAgICAgICk7XG5cbiAgICB9XG5cbiAgICByZXR1cm4gZC5kcmF3aW5nX3BhcnRzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcGFnZTtcbiIsInZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi9ta19kcmF3aW5nJyk7XG52YXIgbWtfYm9yZGVyID0gcmVxdWlyZSgnLi9ta19ib3JkZXInKTtcbnZhciBmID0gcmVxdWlyZSgnLi9mdW5jdGlvbnMnKTtcblxudmFyIHBhZ2UgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgY29uc29sZS5sb2coXCIqKiBNYWtpbmcgcHJldmlldyAyXCIpO1xuXG4gICAgdmFyIGQgPSBta19kcmF3aW5nKHNldHRpbmdzKTtcblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZChzZXR0aW5ncywgJ3Jvb2YnKSApe1xuXG4gICAgICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgICAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG4gICAgICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5cbiAgICAgICAgdmFyIHgsIHksIGgsIHcsIHNlY3Rpb25feCwgc2VjdGlvbl95LCBsZW5ndGhfcCwgc2NhbGU7XG5cbiAgICAgICAgdmFyIHNsb3BlID0gc3lzdGVtLnJvb2Yuc2xvcGUuc3BsaXQoJzonKVswXTtcbiAgICAgICAgdmFyIGFuZ2xlX3JhZCA9IE1hdGguYXRhbiggTnVtYmVyKHNsb3BlKSAvMTIgKTtcbiAgICAgICAgLy9hbmdsZV9yYWQgPSBhbmdsZSAqIChNYXRoLlBJLzE4MCk7XG5cblxuICAgICAgICBsZW5ndGhfcCA9IHN5c3RlbS5yb29mLmxlbmd0aCAqIE1hdGguY29zKGFuZ2xlX3JhZCk7XG4gICAgICAgIHN5c3RlbS5yb29mLmhlaWdodCA9IHN5c3RlbS5yb29mLmxlbmd0aCAqIE1hdGguc2luKGFuZ2xlX3JhZCk7XG5cbiAgICAgICAgdmFyIHJvb2ZfcmF0aW8gPSBzeXN0ZW0ucm9vZi5sZW5ndGggLyBzeXN0ZW0ucm9vZi53aWR0aDtcbiAgICAgICAgdmFyIHJvb2ZfcGxhbl9yYXRpbyA9IGxlbmd0aF9wIC8gc3lzdGVtLnJvb2Yud2lkdGg7XG5cblxuICAgICAgICBpZiggc3lzdGVtLnJvb2YudHlwZSA9PT0gXCJHYWJsZVwiKXtcblxuXG4gICAgICAgICAgICAvLy8vLy8vXG4gICAgICAgICAgICAvLyBSb29kIHBsYW4gdmlld1xuICAgICAgICAgICAgdmFyIHBsYW5feCA9IDMwO1xuICAgICAgICAgICAgdmFyIHBsYW5feSA9IDMwO1xuXG4gICAgICAgICAgICB2YXIgcGxhbl93LCBwbGFuX2g7XG4gICAgICAgICAgICBpZiggbGVuZ3RoX3AqMiA+IHN5c3RlbS5yb29mLndpZHRoICl7XG4gICAgICAgICAgICAgICAgc2NhbGUgPSAyNTAvKGxlbmd0aF9wKjIpO1xuICAgICAgICAgICAgICAgIHBsYW5fdyA9IChsZW5ndGhfcCoyKSAqIHNjYWxlO1xuICAgICAgICAgICAgICAgIHBsYW5faCA9IHBsYW5fdyAvIChsZW5ndGhfcCoyIC8gc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDQwMC8oc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgICAgIHBsYW5faCA9IHN5c3RlbS5yb29mLndpZHRoICogc2NhbGU7XG4gICAgICAgICAgICAgICAgcGxhbl93ID0gcGxhbl9oICogKGxlbmd0aF9wKjIgLyBzeXN0ZW0ucm9vZi53aWR0aCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGQucmVjdChcbiAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3krcGxhbl9oLzJdLFxuICAgICAgICAgICAgICAgIFtwbGFuX3csIHBsYW5faF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZC5wb2x5KFtcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCAgICAgICAsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feStwbGFuX2hdLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94LCAgICAgICAgcGxhbl95K3BsYW5faF0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3ggICAgICAgLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfcG9seV91bnNlbGVjdGVkXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnBvbHkoW1xuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yICAgICAgICwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMitwbGFuX3cvMiwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMitwbGFuX3cvMiwgcGxhbl95K3BsYW5faF0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsICAgICAgICBwbGFuX3krcGxhbl9oXSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiAgICAgICAsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3NlbGVjdGVkXCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feStwbGFuX2hdXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbcGxhbl94LTIwLCBwbGFuX3krcGxhbl9oLzJdLFxuICAgICAgICAgICAgICAgIHN5c3RlbS5yb29mLmxlbmd0aC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93KzIwLCBwbGFuX3krcGxhbl9oLzJdLFxuICAgICAgICAgICAgICAgIHN5c3RlbS5yb29mLndpZHRoLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG5cblxuXG5cbiAgICAgICAgICAgIC8vLy8vLy8vXG4gICAgICAgICAgICAvLyByb29mIGNyb3NzZWN0aW9uXG5cbiAgICAgICAgICAgIHZhciBjc194ID0gMzA7XG4gICAgICAgICAgICB2YXIgY3NfeSA9IDMwK3BsYW5faCs1MDtcbiAgICAgICAgICAgIHZhciBjc19oID0gc3lzdGVtLnJvb2YuaGVpZ2h0ICogc2NhbGU7XG4gICAgICAgICAgICB2YXIgY3NfdyA9IHBsYW5fdy8yO1xuXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3ldLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3krY3NfaF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3csICAgY3NfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3cqMiwgY3NfeStjc19oXSxcbiAgICAgICAgICAgICAgICAgICAgW2NzX3gsICAgICAgICBjc195K2NzX2hdLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3ldLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbY3NfeCtjc193LTE1LCBjc195K2NzX2gqMi8zXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi5oZWlnaHQgKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbY3NfeCtjc193KjEuNSsyMCwgY3NfeStjc19oLzNdLFxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHN5c3RlbS5yb29mLmxlbmd0aCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG5cblxuICAgICAgICAgICAgLy8vLy8vXG4gICAgICAgICAgICAvLyByb29mIGRldGFpbFxuXG4gICAgICAgICAgICB2YXIgZGV0YWlsX3ggPSAzMCs0NTA7XG4gICAgICAgICAgICB2YXIgZGV0YWlsX3kgPSAzMDtcblxuICAgICAgICAgICAgaWYoIE51bWJlcihzeXN0ZW0ucm9vZi53aWR0aCkgPj0gTnVtYmVyKHN5c3RlbS5yb29mLmxlbmd0aCkgKXtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDQ1MC8oc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDQ1MC8oc3lzdGVtLnJvb2YubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkZXRhaWxfdyA9IHN5c3RlbS5yb29mLndpZHRoICogc2NhbGU7XG4gICAgICAgICAgICB2YXIgZGV0YWlsX2ggPSBzeXN0ZW0ucm9vZi5sZW5ndGggKiBzY2FsZTtcblxuICAgICAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy8yLCBkZXRhaWxfeStkZXRhaWxfaC8yXSxcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3csIGRldGFpbF9oXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3NlbGVjdGVkX2ZyYW1lZFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB2YXIgYSA9IDM7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0X2EgPSBhICogc2NhbGU7XG5cbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCwgICBkZXRhaWxfeStvZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdywgICBkZXRhaWxfeStvZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCwgICAgICAgICAgZGV0YWlsX3krZGV0YWlsX2gtb2Zmc2V0X2FdLFxuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3csIGRldGFpbF95K2RldGFpbF9oLW9mZnNldF9hXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K29mZnNldF9hLCBkZXRhaWxfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtvZmZzZXRfYSwgZGV0YWlsX3krZGV0YWlsX2hdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3ctb2Zmc2V0X2EsIGRldGFpbF95XSxcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LW9mZnNldF9hLCBkZXRhaWxfeStkZXRhaWxfaF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeC00MCwgZGV0YWlsX3krZGV0YWlsX2gvMl0sXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggc3lzdGVtLnJvb2YubGVuZ3RoICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LzIsIGRldGFpbF95K2RldGFpbF9oKzQwXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi53aWR0aCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94KyAob2Zmc2V0X2EpLzIsIGRldGFpbF95K2RldGFpbF9oKzE1XSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LShvZmZzZXRfYSkvMiwgZGV0YWlsX3krZGV0YWlsX2grMTVdLFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3gtMTUsIGRldGFpbF95K2RldGFpbF9oLShvZmZzZXRfYSkvMl0sXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeC0xNSwgZGV0YWlsX3krKG9mZnNldF9hKS8yXSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG5cblxuXG5cblxuICAgICAgICAgICAgLy8vLy8vXG4gICAgICAgICAgICAvLyBNb2R1bGUgb3B0aW9uc1xuICAgICAgICAgICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKHNldHRpbmdzLCAnbW9kdWxlJykgJiYgZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdhcnJheScpKXtcbiAgICAgICAgICAgICAgICB2YXIgcixjO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJvb2ZfbGVuZ3RoX2F2YWlsID0gc3lzdGVtLnJvb2YubGVuZ3RoIC0gKGEqMik7XG4gICAgICAgICAgICAgICAgdmFyIHJvb2Zfd2lkdGhfYXZhaWwgPSBzeXN0ZW0ucm9vZi53aWR0aCAtIChhKjIpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJvd19zcGFjaW5nO1xuICAgICAgICAgICAgICAgIGlmKCBzeXN0ZW0ubW9kdWxlLm9yaWVudGF0aW9uID09PSAnUG9ydHJhaXQnICl7XG4gICAgICAgICAgICAgICAgICAgIHJvd19zcGFjaW5nID0gTnVtYmVyKHN5c3RlbS5tb2R1bGUubGVuZ3RoKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIGNvbF9zcGFjaW5nID0gTnVtYmVyKHN5c3RlbS5tb2R1bGUud2lkdGgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlX3cgPSAoTnVtYmVyKHN5c3RlbS5tb2R1bGUud2lkdGgpICApLzEyO1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVfaCA9IChOdW1iZXIoc3lzdGVtLm1vZHVsZS5sZW5ndGgpICkvMTI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcm93X3NwYWNpbmcgPSBOdW1iZXIoc3lzdGVtLm1vZHVsZS53aWR0aCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBjb2xfc3BhY2luZyA9IE51bWJlcihzeXN0ZW0ubW9kdWxlLmxlbmd0aCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVfdyA9IChOdW1iZXIoc3lzdGVtLm1vZHVsZS5sZW5ndGgpKS8xMjtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlX2ggPSAoTnVtYmVyKHN5c3RlbS5tb2R1bGUud2lkdGgpICkvMTI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcm93X3NwYWNpbmcgPSByb3dfc3BhY2luZy8xMjsgLy9tb2R1bGUgZGltZW50aW9ucyBhcmUgaW4gaW5jaGVzXG4gICAgICAgICAgICAgICAgY29sX3NwYWNpbmcgPSBjb2xfc3BhY2luZy8xMjsgLy9tb2R1bGUgZGltZW50aW9ucyBhcmUgaW4gaW5jaGVzXG5cbiAgICAgICAgICAgICAgICB2YXIgbnVtX3Jvd3MgPSBNYXRoLmZsb29yKHJvb2ZfbGVuZ3RoX2F2YWlsL3Jvd19zcGFjaW5nKTtcbiAgICAgICAgICAgICAgICB2YXIgbnVtX2NvbHMgPSBNYXRoLmZsb29yKHJvb2Zfd2lkdGhfYXZhaWwvY29sX3NwYWNpbmcpO1xuXG4gICAgICAgICAgICAgICAgLy9zZWxlY3RlZCBtb2R1bGVzXG5cbiAgICAgICAgICAgICAgICBpZiggbnVtX2NvbHMgIT09IHNldHRpbmdzLnRlbXAubnVtX2NvbHMgfHwgbnVtX3Jvd3MgIT09IHNldHRpbmdzLnRlbXAubnVtX3Jvd3MgKXtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3Mud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzID0ge307XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yKCByPTE7IHI8PW51bV9yb3dzOyByKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3Mud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzW3JdID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IoIGM9MTsgYzw9bnVtX2NvbHM7IGMrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3Mud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzW3JdW2NdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLnRlbXAubnVtX2NvbHMgPSBudW1fY29scztcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MudGVtcC5udW1fcm93cyA9IG51bV9yb3dzO1xuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgeCA9IGRldGFpbF94ICsgb2Zmc2V0X2E7IC8vY29ybmVyIG9mIHVzYWJsZSBzcGFjZVxuICAgICAgICAgICAgICAgIHkgPSBkZXRhaWxfeSArIG9mZnNldF9hO1xuICAgICAgICAgICAgICAgIHggKz0gKCByb29mX3dpZHRoX2F2YWlsIC0gKGNvbF9zcGFjaW5nKm51bV9jb2xzKSkvMiAqc2NhbGU7IC8vIGNlbnRlciBhcnJheSBvbiByb29mXG4gICAgICAgICAgICAgICAgeSArPSAoIHJvb2ZfbGVuZ3RoX2F2YWlsIC0gKHJvd19zcGFjaW5nKm51bV9yb3dzKSkvMiAqc2NhbGU7XG4gICAgICAgICAgICAgICAgbW9kdWxlX3cgPSBtb2R1bGVfdyAqIHNjYWxlO1xuICAgICAgICAgICAgICAgIG1vZHVsZV9oID0gbW9kdWxlX2ggKiBzY2FsZTtcblxuXG5cbiAgICAgICAgICAgICAgICBmb3IoIHI9MTsgcjw9bnVtX3Jvd3M7IHIrKyl7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yKCBjPTE7IGM8PW51bV9jb2xzOyBjKyspe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF5ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggc2V0dGluZ3Mud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzW3JdW2NdICkgbGF5ZXIgPSAncHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGxheWVyID0gJ3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlX3ggPSAoYy0xKSAqIGNvbF9zcGFjaW5nICogc2NhbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVfeSA9IChyLTEpICogcm93X3NwYWNpbmcgKiBzY2FsZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFt4K21vZHVsZV94K21vZHVsZV93LzIsIHkrbW9kdWxlX3krbW9kdWxlX2gvMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW21vZHVsZV93LCBtb2R1bGVfaF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrOiBcImcuZi50b2dnbGVfbW9kdWxlKHRoaXMpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZV9JRDogIChyKSArICcsJyArIChjKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3cvMiwgZGV0YWlsX3krZGV0YWlsX2grMTAwXSxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJTZWxlY3RlZCBtb2R1bGVzOiBcIiArIHBhcnNlRmxvYXQoIHNldHRpbmdzLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDYWxjdWxhdGVkIG1vZHVsZXM6IFwiICsgcGFyc2VGbG9hdCggc2V0dGluZ3Muc3lzdGVtLmFycmF5Lm51bWJlcl9vZl9tb2R1bGVzICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB4ID0gZGV0YWlsX3ggKyA0NzU7XG4gICAgICAgICAgICB5ID0gZGV0YWlsX3kgKyAxMjA7XG5cbiAgICAgICAgICAgIGQuYmxvY2soJ25vcnRoIGFycm93X3VwJywgW3gseV0pO1xuXG4gICAgICAgICAgICB4ID0gMTIwO1xuICAgICAgICAgICAgeSA9IDE1O1xuXG4gICAgICAgICAgICBkLmJsb2NrKCdub3J0aCBhcnJvd19sZWZ0JywgW3gseV0pO1xuLy8qL1xuICAgICAgICB9XG5cblxuICAgICAgICAvKlxuXG5cblxuXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCwgICAgeV0sXG4gICAgICAgICAgICBbeCtkeCwgeS1keV0sXG4gICAgICAgICAgICBbeCtkeCwgeV0sXG4gICAgICAgICAgICBbeCwgICAgeV0sXG4gICAgICAgICAgICBdXG4gICAgICAgICk7XG5cbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgW3grZHgvMi0xMCwgeS1keS8yLTIwXSxcbiAgICAgICAgICAgIHN5c3RlbS5yb29mLmhlaWdodC50b1N0cmluZygpLFxuICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgKTtcbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgW3grZHgvMis1LCB5LTE1XSxcbiAgICAgICAgICAgIGFuZ2xlLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICApO1xuXG5cbiAgICAgICAgeCA9IHgrZHgrMTAwO1xuICAgICAgICB5ID0geTtcblxuXG4gICAgICAgIC8vKi9cblxuICAgIH1cblxuICAgIHJldHVybiBkLmRyYXdpbmdfcGFydHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgZiA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zJyk7XG5cblxuXG52YXIgbWtfc2V0dGluZ3MgPSBmdW5jdGlvbigpIHtcblxuXG4gICAgdmFyIGk7XG4gICAgLy92YXIgc2V0dGluZ3NDYWxjdWxhdGVkID0gcmVxdWlyZSgnLi9zZXR0aW5nc0NhbGN1bGF0ZWQuanMnKTtcblxuICAgIC8vIExvYWQgJ3VzZXInIGRlZmluZWQgc2V0dGluZ3NcbiAgICAvL3ZhciBta19zZXR0aW5ncyA9IHJlcXVpcmUoJy4uL2RhdGEvc2V0dGluZ3MuanNvbi5qcycpO1xuICAgIC8vZi5ta19zZXR0aW5ncyA9IG1rX3NldHRpbmdzO1xuXG4gICAgdmFyIHNldHRpbmdzID0ge307XG5cblxuXG5cbiAgICBzZXR0aW5ncy50ZW1wID0ge307XG5cbiAgICBzZXR0aW5ncy5wZXJtID0ge307XG4gICAgc2V0dGluZ3MucGVybS5nZW9jb2RlID0ge307XG4gICAgc2V0dGluZ3MucGVybS5sb2NhdGlvbiA9IHt9O1xuICAgIHNldHRpbmdzLnBlcm0ubG9jYXRpb24ubmV3X2FkZHJlc3MgPSBmYWxzZTtcbiAgICBzZXR0aW5ncy5wZXJtLm1hcHMgPSB7fTtcblxuICAgIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zID0ge307XG4gICAgc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuTkVDX3RhYmxlcyA9IHJlcXVpcmUoJy4uL2RhdGEvdGFibGVzLmpzb24nKTtcbiAgICAvL2NvbnNvbGUubG9nKHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLk5FQ190YWJsZXMpO1xuXG4gICAgc2V0dGluZ3Muc3RhdGUgPSB7fTtcbiAgICBzZXR0aW5ncy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQgPSBmYWxzZTtcblxuICAgIHNldHRpbmdzLmluID0ge307XG5cbiAgICBzZXR0aW5ncy5pbi5vcHQgPSB7fTtcbiAgICBzZXR0aW5ncy5pbi5vcHQuQUMgPSB7fTtcbiAgICBzZXR0aW5ncy5pbi5vcHQuQUMudHlwZXMgPSB7fTtcbiAgICBzZXR0aW5ncy5pbi5vcHQuQUMudHlwZXNbXCIxMjBWXCJdID0gW1wiZ3JvdW5kXCIsXCJuZXV0cmFsXCIsXCJMMVwiXTtcbiAgICBzZXR0aW5ncy5pbi5vcHQuQUMudHlwZXNbXCIyNDBWXCJdID0gW1wiZ3JvdW5kXCIsXCJuZXV0cmFsXCIsXCJMMVwiLFwiTDJcIl07XG4gICAgc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzW1wiMjA4VlwiXSA9IFtcImdyb3VuZFwiLFwibmV1dHJhbFwiLFwiTDFcIixcIkwyXCJdO1xuICAgIHNldHRpbmdzLmluLm9wdC5BQy50eXBlc1tcIjI3N1ZcIl0gPSBbXCJncm91bmRcIixcIm5ldXRyYWxcIixcIkwxXCJdO1xuICAgIHNldHRpbmdzLmluLm9wdC5BQy50eXBlc1tcIjQ4MFYgV3llXCJdID0gW1wiZ3JvdW5kXCIsXCJuZXV0cmFsXCIsXCJMMVwiLFwiTDJcIixcIkwzXCJdO1xuICAgIHNldHRpbmdzLmluLm9wdC5BQy50eXBlc1tcIjQ4MFYgRGVsdGFcIl0gPSBbXCJncm91bmRcIixcIkwxXCIsXCJMMlwiLFwiTDNcIl07XG5cblxuICAgIHNldHRpbmdzLmlucHV0cyA9IHt9O1xuICAgIHNldHRpbmdzLmlucHV0cy5sb2NhdGlvbiA9IHt9O1xuICAgIHNldHRpbmdzLmlucHV0cy5sb2NhdGlvbi5jb3VudHkgPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMubG9jYXRpb24uY291bnR5LnR5cGUgPSAndGV4dF9pbnB1dCc7XG4gICAgc2V0dGluZ3MuaW5wdXRzLmxvY2F0aW9uLmFkZHJlc3MgPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMubG9jYXRpb24uYWRkcmVzcy50eXBlID0gJ3RleHRfaW5wdXQnO1xuICAgIHNldHRpbmdzLmlucHV0cy5sb2NhdGlvbi5jaXR5ID0ge307XG4gICAgc2V0dGluZ3MuaW5wdXRzLmxvY2F0aW9uLmNpdHkudHlwZSA9ICd0ZXh0X2lucHV0JztcbiAgICBzZXR0aW5ncy5pbnB1dHMubG9jYXRpb24uemlwID0ge307XG4gICAgc2V0dGluZ3MuaW5wdXRzLmxvY2F0aW9uLnppcC50eXBlID0gJ3RleHRfaW5wdXQnO1xuXG4gICAgc2V0dGluZ3MuaW5wdXRzLnJvb2YgPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMucm9vZi53aWR0aCA9IHt9O1xuICAgIHNldHRpbmdzLmlucHV0cy5yb29mLndpZHRoLm9wdGlvbnMgPSBbXTtcbiAgICAvL2ZvciggaT0xNTsgaTw9NzA7IGkrPTUgKSBzZXR0aW5ncy5pbnB1dHMucm9vZi53aWR0aC5vcHRpb25zLnB1c2goaSk7XG4gICAgc2V0dGluZ3MuaW5wdXRzLnJvb2Yud2lkdGgudW5pdHMgPSAnZnQuJztcbiAgICBzZXR0aW5ncy5pbnB1dHMucm9vZi53aWR0aC5ub3RlID0gJ1RoaXMgdGhlIGZ1bGwgc2l6ZSBvZiB0aGUgcm9vZiwgcGVycGVuZGljdHVsYXIgdG8gdGhlIHNsb3BlLic7XG4gICAgc2V0dGluZ3MuaW5wdXRzLnJvb2Yud2lkdGgudHlwZSA9ICdudW1iZXJfaW5wdXQnO1xuICAgIHNldHRpbmdzLmlucHV0cy5yb29mLmxlbmd0aCA9IHt9O1xuICAgIHNldHRpbmdzLmlucHV0cy5yb29mLmxlbmd0aC5vcHRpb25zID0gW107XG4gICAgLy9mb3IoIGk9MTA7IGk8PTYwOyBpKz01ICkgc2V0dGluZ3MuaW5wdXRzLnJvb2YubGVuZ3RoLm9wdGlvbnMucHVzaChpKTtcbiAgICBzZXR0aW5ncy5pbnB1dHMucm9vZi5sZW5ndGgudW5pdHMgPSAnZnQuJztcbiAgICBzZXR0aW5ncy5pbnB1dHMucm9vZi5sZW5ndGgubm90ZSA9ICdUaGlzIHRoZSBmdWxsIGxlbmd0aCBvZiB0aGUgcm9vZiwgbWVhc3VyZWQgZnJvbSBsb3cgdG8gaGlnaC4nO1xuICAgIHNldHRpbmdzLmlucHV0cy5yb29mLmxlbmd0aC50eXBlID0gJ251bWJlcl9pbnB1dCc7XG4gICAgc2V0dGluZ3MuaW5wdXRzLnJvb2Yuc2xvcGUgPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMucm9vZi5zbG9wZS5vcHRpb25zID0gWycxOjEyJywnMjoxMicsJzM6MTInLCc0OjEyJywnNToxMicsJzY6MTInLCc3OjEyJywnODoxMicsJzk6MTInLCcxMDoxMicsJzExOjEyJywnMTI6MTInXTtcbiAgICBzZXR0aW5ncy5pbnB1dHMucm9vZi50eXBlID0ge307XG4gICAgc2V0dGluZ3MuaW5wdXRzLnJvb2YudHlwZS5vcHRpb25zID0gWydHYWJsZScsJ1NoZWQnLCdIaXBwZWQnXTtcbiAgICBzZXR0aW5ncy5pbnB1dHMubW9kdWxlID0ge307XG4gICAgc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5tYWtlID0ge307XG4gICAgLy9zZXR0aW5ncy5pbnB1dHMubW9kdWxlLm1ha2Uub3B0aW9ucyA9IG51bGw7XG4gICAgc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5tb2RlbCA9IHt9O1xuICAgIC8vc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5tb2RlbC5vcHRpb25zID0gbnVsbDtcbiAgICBzZXR0aW5ncy5pbnB1dHMubW9kdWxlLm9yaWVudGF0aW9uID0ge307XG4gICAgc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5vcmllbnRhdGlvbi5vcHRpb25zID0gWydQb3J0cmFpdCcsJ0xhbmRzY2FwZSddO1xuICAgIHNldHRpbmdzLmlucHV0cy5hcnJheSA9IHt9O1xuICAgIHNldHRpbmdzLmlucHV0cy5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nLm9wdGlvbnMgPSBbMSwyLDMsNCw1LDYsNyw4LDksMTAsMTEsMTIsMTMsMTQsMTUsMTYsMTcsMTgsMTksMjBdO1xuICAgIHNldHRpbmdzLmlucHV0cy5hcnJheS5udW1fc3RyaW5ncyA9IHt9O1xuICAgIHNldHRpbmdzLmlucHV0cy5hcnJheS5udW1fc3RyaW5ncy5vcHRpb25zID0gWzEsMiwzLDQsNSw2XTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuREMgPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuREMuaG9tZV9ydW5fbGVuZ3RoID0ge307XG4gICAgLy9zZXR0aW5ncy5pbnB1dHMuREMuaG9tZV9ydW5fbGVuZ3RoLm9wdGlvbnMgPSBbMjUsNTAsNzUsMTAwLDEyNSwxNTBdO1xuICAgIHNldHRpbmdzLmlucHV0cy5EQy5ob21lX3J1bl9sZW5ndGgudHlwZSA9ICdudW1iZXJfaW5wdXQnO1xuICAgIHNldHRpbmdzLmlucHV0cy5pbnZlcnRlciA9IHt9O1xuICAgIHNldHRpbmdzLmlucHV0cy5pbnZlcnRlci5tYWtlID0ge307XG4gICAgLy9zZXR0aW5ncy5pbnB1dHMuaW52ZXJ0ZXIubWFrZS5vcHRpb25zID0gbnVsbDtcbiAgICBzZXR0aW5ncy5pbnB1dHMuaW52ZXJ0ZXIubW9kZWwgPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuaW52ZXJ0ZXIubG9jYXRpb24gPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuaW52ZXJ0ZXIubG9jYXRpb24ub3B0aW9ucyA9IFsnSW5zaWRlJywgJ091dHNpZGUnXTtcbiAgICAvL3NldHRpbmdzLmlucHV0cy5pbnZlcnRlci5tb2RlbC5vcHRpb25zID0gbnVsbDtcbiAgICBzZXR0aW5ncy5pbnB1dHMuQUMgPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlcyA9IHt9O1xuICAgIHNldHRpbmdzLmlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzWycyNDBWJ10gPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlc1snMjQwViddID0gWycyNDBWJywnMTIwViddO1xuICAgIHNldHRpbmdzLmlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzWycyMDgvMTIwViddID0ge307XG4gICAgc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbJzIwOC8xMjBWJ10gPSBbJzIwOFYnLCcxMjBWJ107XG4gICAgc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbJzQ4MC8yNzdWJ10gPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlc1snNDgwLzI3N1YnXSA9IFsnNDgwViBXeWUnLCc0ODBWIERlbHRhJywnMjc3ViddO1xuICAgIHNldHRpbmdzLmlucHV0cy5BQy50eXBlID0ge307XG4gICAgLy9zZXR0aW5ncy5pbnB1dHMuQUMudHlwZS5vcHRpb25zID0gbnVsbDtcbiAgICBzZXR0aW5ncy5pbnB1dHMuQUMuZGlzdGFuY2VfdG9fbG9hZGNlbnRlciA9IHt9O1xuICAgIC8vc2V0dGluZ3MuaW5wdXRzLkFDLmRpc3RhbmNlX3RvX2xvYWRjZW50ZXIub3B0aW9ucyA9IFszLDUsMTAsMTUsMjAsMzBdO1xuICAgIHNldHRpbmdzLmlucHV0cy5BQy5kaXN0YW5jZV90b19sb2FkY2VudGVyLnR5cGUgPSAnbnVtYmVyX2lucHV0JztcblxuICAgIHNldHRpbmdzLmlucHV0cy5hdHRhY2htZW50X3N5c3RlbSA9IHt9O1xuICAgIHNldHRpbmdzLmlucHV0cy5hdHRhY2htZW50X3N5c3RlbS5tYWtlID0ge1xuICAgICAgICBvcHRpb25zOiBbJ1VOSVJBQyddLFxuICAgICAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICB9O1xuICAgIHNldHRpbmdzLmlucHV0cy5hdHRhY2htZW50X3N5c3RlbS5tb2RlbCA9IHtcbiAgICAgICAgb3B0aW9uczogWydTT0xBUk1PVU5UJ10sXG4gICAgICAgIHR5cGU6ICdzZWxlY3QnLFxuICAgIH07XG5cblxuXG4gICAgc2V0dGluZ3MudXNlcl9pbnB1dCA9IGYuYWRkX3NlY3Rpb25zKHNldHRpbmdzLmlucHV0cyk7XG5cblxuXG5cbiAgICAvL3NldHRpbmdzLmlucHV0cyA9IHNldHRpbmdzLmlucHV0czsgLy8gY29weSBpbnB1dCByZWZlcmVuY2Ugd2l0aCBvcHRpb25zIHRvIGlucHV0c1xuICAgIC8vc2V0dGluZ3MuaW5wdXRzID0gZi5ibGFua19jb3B5KHNldHRpbmdzLmlucHV0cyk7IC8vIG1ha2UgaW5wdXQgc2VjdGlvbiBibGFua1xuICAgIC8vc2V0dGluZ3Muc3lzdGVtX2Zvcm11bGFzID0gc2V0dGluZ3Muc3lzdGVtOyAvLyBjb3B5IHN5c3RlbSByZWZlcmVuY2UgdG8gc3lzdGVtX2Zvcm11bGFzXG4gICAgc2V0dGluZ3Muc3lzdGVtID0gZi5ibGFua19jb3B5KHNldHRpbmdzLmlucHV0cyk7IC8vIG1ha2Ugc3lzdGVtIHNlY3Rpb24gYmxhbmtcbiAgICAvL2YubWVyZ2Vfb2JqZWN0cyggc2V0dGluZ3MuaW5wdXRzLCBzZXR0aW5ncy5zeXN0ZW0gKTtcblxuXG4gICAgLy8gbG9hZCBsYXllcnNcblxuICAgIHNldHRpbmdzLmRyYXdpbmcgPSB7fTtcblxuICAgIHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MgPSB7fTtcbiAgICBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxheWVyX2F0dHIgPSByZXF1aXJlKCcuL3NldHRpbmdzX2xheWVycycpO1xuICAgIHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MuZm9udHMgPSByZXF1aXJlKCcuL3NldHRpbmdzX2ZvbnRzJyk7XG5cbiAgICBzZXR0aW5ncy5kcmF3aW5nLmJsb2NrcyA9IHt9O1xuXG4gICAgLy8gTG9hZCBkcmF3aW5nIHNwZWNpZmljIHNldHRpbmdzXG4gICAgLy8gVE9ETyBGaXggc2V0dGluZ3NfZHJhd2luZyB3aXRoIG5ldyB2YXJpYWJsZSBsb2NhdGlvbnNcbiAgICB2YXIgc2V0dGluZ3NfZHJhd2luZyA9IHJlcXVpcmUoJy4vc2V0dGluZ3NfZHJhd2luZycpO1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3NfZHJhd2luZyhzZXR0aW5ncyk7XG5cbiAgICAvL3NldHRpbmdzLnN0YXRlX2FwcC52ZXJzaW9uX3N0cmluZyA9IHZlcnNpb25fc3RyaW5nO1xuXG4gICAgLy9zZXR0aW5ncyA9IGYubnVsbFRvT2JqZWN0KHNldHRpbmdzKTtcblxuICAgIHNldHRpbmdzLnNlbGVjdF9yZWdpc3RyeSA9IFtdO1xuICAgIC8vc2V0dGluZ3MudmFsdWVfcmVnaXN0cnkgPSBbXTtcblxuXG4gICAgLy92YXIgY29uZmlnX29wdGlvbnMgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucyA9IHNldHRpbmdzLmNvbmZpZ19vcHRpb25zIHx8IHt9O1xuXG4gICAgc2V0dGluZ3Mud2VicGFnZSA9IHt9O1xuICAgIHNldHRpbmdzLndlYnBhZ2Uuc2VsZWN0aW9uc19tYW51YWxfdG9nZ2xlZCA9IHt9O1xuICAgIHNldHRpbmdzLndlYnBhZ2Uuc2VjdGlvbnMgPSBPYmplY3Qua2V5cyhzZXR0aW5ncy5pbnB1dHMpO1xuXG5cbiAgICBzZXR0aW5ncy53ZWJwYWdlLnNlY3Rpb25zLmZvckVhY2goIGZ1bmN0aW9uKHNlY3Rpb25fbmFtZSl7XG4gICAgICAgIHNldHRpbmdzLndlYnBhZ2Uuc2VsZWN0aW9uc19tYW51YWxfdG9nZ2xlZFtzZWN0aW9uX25hbWVdID0gZmFsc2U7XG4gICAgfSk7XG5cbiAgICBzZXR0aW5ncy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNfdG90YWwgPSAwO1xuICAgIHNldHRpbmdzLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlcyA9IHt9O1xuXG5cblxuXG4gICAgc2V0dGluZ3MuY29tcG9uZW50cyA9IHt9O1xuXG5cblxuXG5cbiAgICAvLyBMb2FkIGZ1bmN0aW9ucyBhbmQgYWRkIHRoZW0gdGhlIHRoZSBnbG9iYWwgb2JqZWN0XG4gICAgZi5nID0gc2V0dGluZ3M7XG4gICAgc2V0dGluZ3MuZiA9IGY7XG5cblxuXG5cbiAgICAvLyBMb2FkIG1vZHVsZXNcblxuICAgIGYuc2V0dXBfd2VicGFnZSA9IHJlcXVpcmUoJy4vc2V0dXBfd2VicGFnZScpO1xuXG4gICAgZi5wcm9jZXNzID0gcmVxdWlyZSgnLi9wcm9jZXNzJyk7XG4gICAgZi5zZXR0aW5nc19kZXZfZGVmYXVsdHMgPSByZXF1aXJlKCcuL3NldHRpbmdzX2Rldl9kZWZhdWx0cycpO1xuXG5cbiAgICBmLm1rX2Jsb2NrcyA9IHJlcXVpcmUoJy4vbWtfYmxvY2tzJyk7XG5cbiAgICBmLm1rX3BhZ2UgPSB7fTtcbiAgICBmLm1rX3BhZ2VbJ0ctMDAxJ10gPSByZXF1aXJlKCcuL3BhZ2UvRy0wMDEnKTtcbiAgICBmLm1rX3BhZ2VbJ1MtMDAxJ10gPSByZXF1aXJlKCcuL3BhZ2UvUy0wMDEnKTtcbiAgICBmLm1rX3BhZ2VbJ1ctMDAxJ10gPSByZXF1aXJlKCcuL3BhZ2UvVy0wMDEnKTtcbiAgICBmLm1rX3BhZ2VbJ1ctMDAyJ10gPSByZXF1aXJlKCcuL3BhZ2UvVy0wMDInKTtcblxuICAgIGYubWtfcHJldmlldyA9IHt9O1xuICAgIGYubWtfcHJldmlld1sxXSA9IHJlcXVpcmUoJy4vbWtfcGFnZV9wcmV2aWV3XzEnKTtcbiAgICBmLm1rX3ByZXZpZXdbMl0gPSByZXF1aXJlKCcuL21rX3BhZ2VfcHJldmlld18yJyk7XG5cbiAgICBmLm1rX3N2Zz0gcmVxdWlyZSgnLi9ta19zdmcnKTtcblxuXG5cbiAgICBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNoZWV0cyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgbnVtOiAnRy0wMDEnLFxuICAgICAgICAgICAgZGVzYzogJ1RpdGxlIFNoZWV0J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBudW06ICdXLTAwMScsXG4gICAgICAgICAgICBkZXNjOiAnUFYgc3lzdGVtIHdpcmluZyBkaWFncmFtJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBudW06ICdXLTAwMicsXG4gICAgICAgICAgICBkZXNjOiAnUFYgc3lzdGVtIHNwZWNpZmljYXRpb25zJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBudW06ICdTLTAwMScsXG4gICAgICAgICAgICBkZXNjOiAnUm9vZiBkZXRhaWxzJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBudW06ICdYLTA0MicsXG4gICAgICAgICAgICBkZXNjOiAnTC5VLkUuJ1xuICAgICAgICB9LFxuICAgIF07XG5cblxuXG5cblxuICAgIHJldHVybiBzZXR0aW5ncztcblxufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gbWtfc2V0dGluZ3M7XG4iLCIndXNlIHN0cmljdCc7XG4vL3ZhciBzZXR0aW5ncyA9IHJlcXVpcmUoJy4vc2V0dGluZ3MuanMnKTtcbi8vdmFyIHNuYXBzdmcgPSByZXF1aXJlKCdzbmFwc3ZnJyk7XG4vL2xvZyhzZXR0aW5ncyk7XG5cblxuXG52YXIgbWtfc3ZnID0gZnVuY3Rpb24oZHJhd2luZ19wYXJ0cywgZHJhd2luZ19zZXR0aW5ncyl7XG4gICAgLy9jb25zb2xlLmxvZygnZGlzcGxheWluZyBzdmcnKTtcbiAgICAvL2NvbnNvbGUubG9nKCdkcmF3aW5nX3BhcnRzOiAnLCBkcmF3aW5nX3BhcnRzKTtcbiAgICAvL2NvbnRhaW5lci5lbXB0eSgpXG4gICAgdmFyIGRyYXdpbmdfc2l6ZSA9IGRyYXdpbmdfc2V0dGluZ3Muc2l6ZS5kcmF3aW5nO1xuICAgIHZhciBsYXllcl9hdHRyID0gZHJhd2luZ19zZXR0aW5ncy5sYXllcl9hdHRyO1xuICAgIHZhciBmb250cyA9IGRyYXdpbmdfc2V0dGluZ3MuZm9udHM7XG5cbiAgICAvL3ZhciBzdmdfZG9jdW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnU3ZnanNTdmcxMDAwJylcbiAgICB2YXIgc3ZnX2RvY3VtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3N2ZycpO1xuICAgIHN2Z19kb2N1bWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywnc3ZnX2RyYXdpbmcnKTtcblxuXG5cbiAgICAvL3N2Z19kb2N1bWVudC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcudyk7XG4gICAgLy9zdmdfZG9jdW1lbnQuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy5oKTtcbiAgICB2YXIgdmlld19ib3ggPSAnMCAwICcgKyBkcmF3aW5nX3NpemUudyArICcgJyArIGRyYXdpbmdfc2l6ZS5oICsgJyAnO1xuICAgIHN2Z19kb2N1bWVudC5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCB2aWV3X2JveCk7XG4gICAgc3ZnX2RvY3VtZW50LnNldEF0dHJpYnV0ZSgneG1sbnMnLCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycpO1xuICAgIHN2Z19kb2N1bWVudC5zZXRBdHRyaWJ1dGUoJ3htbG5zOnhsaW5rJywnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycpO1xuICAgIC8vdmFyIHN2ZyA9IHNuYXBzdmcoc3ZnX2RvY3VtZW50KS5zaXplKHNpemUuZHJhd2luZy53LCBzaXplLmRyYXdpbmcuaCk7XG4gICAgLy92YXIgc3ZnID0gc25hcHN2ZygnI3N2Z19kcmF3aW5nJyk7XG5cbiAgICAvLyBMb29wIHRocm91Z2ggYWxsIHRoZSBkcmF3aW5nIGNvbnRlbnRzLCBjYWxsIHRoZSBmdW5jdGlvbiBiZWxvdy5cbiAgICBkcmF3aW5nX3BhcnRzLmZvckVhY2goIGZ1bmN0aW9uKGl0ZW0saWQpIHtcbiAgICAgICAgc3ZnX2RvY3VtZW50LmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgbWtfc3ZnX2VsZW0oaXRlbSlcbiAgICAgICAgKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIG1rX3N2Z19lbGVtKGl0ZW0pe1xuICAgICAgICB2YXIgeCx5LGF0dHJfbmFtZTtcbiAgICAgICAgaWYoIHR5cGVvZiBpdGVtLnggIT09ICd1bmRlZmluZWQnICkgeyB4ID0gaXRlbS54OyB9XG4gICAgICAgIGlmKCB0eXBlb2YgaXRlbS55ICE9PSAndW5kZWZpbmVkJyApIHsgeSA9IGl0ZW0ueTsgfVxuXG4gICAgICAgIHZhciBhdHRycyA9IGxheWVyX2F0dHJbaXRlbS5sYXllcl9uYW1lXTtcbiAgICAgICAgaWYoIGl0ZW0uYXR0cnMgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICBmb3IoIGF0dHJfbmFtZSBpbiBpdGVtLmF0dHJzICl7XG4gICAgICAgICAgICAgICAgYXR0cnNbYXR0cl9uYW1lXSA9IGl0ZW0uYXR0cnNbYXR0cl9uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgc3ZnX2VsZW07XG5cbiAgICAgICAgaWYoIGl0ZW0udHlwZSA9PT0gJ3JlY3QnKSB7XG4gICAgICAgICAgICAvL3N2Zy5yZWN0KCBpdGVtLncsIGl0ZW0uaCApLm1vdmUoIHgtaXRlbS53LzIsIHktaXRlbS5oLzIgKS5hdHRyKCBsYXllcl9hdHRyW2l0ZW0ubGF5ZXJfbmFtZV0gKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2VsZW06JywgZWxlbSApO1xuICAgICAgICAgICAgLy9pZiggaXNOYU4oaXRlbS53KSApIHtcbiAgICAgICAgICAgIC8vICAgIGNvbnNvbGUubG9nKCdlcnJvcjogZWxlbSBub3QgZnVsbHkgZGVmaW5lZCcsIGVsZW0pXG4gICAgICAgICAgICAvLyAgICBpdGVtLncgPSAxMDtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgLy9pZiggaXNOYU4oaXRlbS5oKSApIHtcbiAgICAgICAgICAgIC8vICAgIGNvbnNvbGUubG9nKCdlcnJvcjogZWxlbSBub3QgZnVsbHkgZGVmaW5lZCcsIGVsZW0pXG4gICAgICAgICAgICAvLyAgICBpdGVtLmggPSAxMDtcbiAgICAgICAgICAgIC8vfVxuICAgICAgICAgICAgc3ZnX2VsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAncmVjdCcpO1xuICAgICAgICAgICAgc3ZnX2VsZW0uc2V0QXR0cmlidXRlKCd3aWR0aCcsIGl0ZW0udyk7XG4gICAgICAgICAgICBzdmdfZWxlbS5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGl0ZW0uaCk7XG4gICAgICAgICAgICBzdmdfZWxlbS5zZXRBdHRyaWJ1dGUoJ3gnLCB4LWl0ZW0udy8yKTtcbiAgICAgICAgICAgIHN2Z19lbGVtLnNldEF0dHJpYnV0ZSgneScsIHktaXRlbS5oLzIpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhpdGVtLmxheWVyX25hbWUpO1xuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gYXR0cnMgKXtcbiAgICAgICAgICAgICAgICBzdmdfZWxlbS5zZXRBdHRyaWJ1dGUoYXR0cl9uYW1lLCBhdHRyc1thdHRyX25hbWVdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgaWYoIGl0ZW0udHlwZSA9PT0gJ2xpbmUnKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnRzMiA9IFtdO1xuICAgICAgICAgICAgaXRlbS5wb2ludHMuZm9yRWFjaCggZnVuY3Rpb24ocG9pbnQpe1xuICAgICAgICAgICAgICAgIGlmKCAhIGlzTmFOKHBvaW50WzBdKSAmJiAhIGlzTmFOKHBvaW50WzFdKSApe1xuICAgICAgICAgICAgICAgICAgICBwb2ludHMyLnB1c2goWyBwb2ludFswXSwgcG9pbnRbMV0gXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yOiBlbGVtIG5vdCBmdWxseSBkZWZpbmVkJywgaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL3N2Zy5wb2x5bGluZSggcG9pbnRzMiApLmF0dHIoIGxheWVyX2F0dHJbaXRlbS5sYXllcl9uYW1lXSApO1xuXG4gICAgICAgICAgICBzdmdfZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdwb2x5bGluZScpO1xuICAgICAgICAgICAgc3ZnX2VsZW0uc2V0QXR0cmlidXRlKCAncG9pbnRzJywgcG9pbnRzMi5qb2luKCcgJykgKTtcbiAgICAgICAgICAgIGZvciggYXR0cl9uYW1lIGluIGF0dHJzICl7XG4gICAgICAgICAgICAgICAgc3ZnX2VsZW0uc2V0QXR0cmlidXRlKGF0dHJfbmFtZSwgYXR0cnNbYXR0cl9uYW1lXSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmKCBpdGVtLnR5cGUgPT09ICdwb2x5Jykge1xuICAgICAgICAgICAgdmFyIHBvaW50czIgPSBbXTtcbiAgICAgICAgICAgIGl0ZW0ucG9pbnRzLmZvckVhY2goIGZ1bmN0aW9uKHBvaW50KXtcbiAgICAgICAgICAgICAgICBpZiggISBpc05hTihwb2ludFswXSkgJiYgISBpc05hTihwb2ludFsxXSkgKXtcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzMi5wdXNoKFsgcG9pbnRbMF0sIHBvaW50WzFdIF0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJvcjogZWxlbSBub3QgZnVsbHkgZGVmaW5lZCcsIGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9zdmcucG9seWxpbmUoIHBvaW50czIgKS5hdHRyKCBsYXllcl9hdHRyW2l0ZW0ubGF5ZXJfbmFtZV0gKTtcblxuICAgICAgICAgICAgc3ZnX2VsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAncG9seWxpbmUnKTtcbiAgICAgICAgICAgIHN2Z19lbGVtLnNldEF0dHJpYnV0ZSggJ3BvaW50cycsIHBvaW50czIuam9pbignICcpICk7XG4gICAgICAgICAgICBmb3IoIGF0dHJfbmFtZSBpbiBhdHRycyApe1xuICAgICAgICAgICAgICAgIHN2Z19lbGVtLnNldEF0dHJpYnV0ZShhdHRyX25hbWUsIGF0dHJzW2F0dHJfbmFtZV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiggaXRlbS50eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgIC8vdmFyIHQgPSBzdmcudGV4dCggaXRlbS5zdHJpbmdzICkubW92ZSggaXRlbS5wb2ludHNbMF1bMF0sIGl0ZW0ucG9pbnRzWzBdWzFdICkuYXR0ciggbGF5ZXJfYXR0cltpdGVtLmxheWVyX25hbWVdIClcbiAgICAgICAgICAgIHZhciBmb250O1xuICAgICAgICAgICAgaWYoIGl0ZW0uZm9udCAmJiBmb250c1tpdGVtLmZvbnRdICl7XG4gICAgICAgICAgICAgICAgZm9udCA9IGZvbnRzW2l0ZW0uZm9udF07XG4gICAgICAgICAgICB9IGVsc2UgaWYoZm9udHNbYXR0cnMuZm9udF0pe1xuICAgICAgICAgICAgICAgIGZvbnQgPSBmb250c1thdHRycy5mb250XTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9udCA9IGZvbnRzWydiYXNlJ107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiggZm9udCA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRm9udCBub3QgZm91bmQnLCBmb250LCBmb250c1snYmFzZSddWydmb250LXNpemUnXSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3ZnX2VsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAndGV4dCcpO1xuICAgICAgICAgICAgaWYoaXRlbS5yb3RhdGVkKXtcbiAgICAgICAgICAgICAgICAvL3Quc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCBcInJvdGF0ZShcIiArIGl0ZW0ucm90YXRlZCArIFwiIFwiICsgeCArIFwiIFwiICsgeSArIFwiKVwiICk7XG4gICAgICAgICAgICAgICAgc3ZnX2VsZW0uc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCBcInJvdGF0ZShcIiArIGl0ZW0ucm90YXRlZCArIFwiIFwiICsgeCArIFwiIFwiICsgeSArIFwiKVwiICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vaWYoIGZvbnRbJ3RleHQtYW5jaG9yJ10gPT09ICdtaWRkbGUnICkgeSArPSBmb250Wydmb250LXNpemUnXSoxLzM7XG4gICAgICAgICAgICAgICAgeSArPSBmb250Wydmb250LXNpemUnXSoxLzM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZHkgPSBmb250Wydmb250LXNpemUnXSoxLjU7XG4gICAgICAgICAgICBzdmdfZWxlbS5zZXRBdHRyaWJ1dGUoJ3gnLCB4KTtcbiAgICAgICAgICAgIC8vc3ZnX2VsZW0uc2V0QXR0cmlidXRlKCd5JywgeSArIGZvbnRbJ2ZvbnQtc2l6ZSddLzIgKTtcbiAgICAgICAgICAgIHN2Z19lbGVtLnNldEF0dHJpYnV0ZSgneScsIHktZHkgKTtcblxuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gYXR0cnMgKXtcbiAgICAgICAgICAgICAgICBpZiggYXR0cl9uYW1lID09PSAnc3Ryb2tlJyApIHtcbiAgICAgICAgICAgICAgICAgICAgc3ZnX2VsZW0uc2V0QXR0cmlidXRlKCAnZmlsbCcsIGF0dHJzW2F0dHJfbmFtZV0gKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoIGF0dHJfbmFtZSA9PT0gJ2ZpbGwnICkge1xuICAgICAgICAgICAgICAgICAgICAvL3N2Z19lbGVtLnNldEF0dHJpYnV0ZSggJ3N0cm9rZScsICdub25lJyApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN2Z19lbGVtLnNldEF0dHJpYnV0ZSggYXR0cl9uYW1lLCBhdHRyc1thdHRyX25hbWVdICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IoIGF0dHJfbmFtZSBpbiBmb250ICl7XG4gICAgICAgICAgICAgICAgc3ZnX2VsZW0uc2V0QXR0cmlidXRlKCBhdHRyX25hbWUsIGZvbnRbYXR0cl9uYW1lXSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gaXRlbS5zdHJpbmdzICl7XG4gICAgICAgICAgICAgICAgdmFyIHRzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3RzcGFuJyk7XG4gICAgICAgICAgICAgICAgdHNwYW4uc2V0QXR0cmlidXRlKCdkeScsIGR5ICk7XG4gICAgICAgICAgICAgICAgdHNwYW4uc2V0QXR0cmlidXRlKCd4JywgeCk7XG4gICAgICAgICAgICAgICAgdHNwYW4uaW5uZXJIVE1MID0gaXRlbS5zdHJpbmdzW2F0dHJfbmFtZV07XG4gICAgICAgICAgICAgICAgc3ZnX2VsZW0uYXBwZW5kQ2hpbGQodHNwYW4pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiggaXRlbS50eXBlID09PSAnY2lyYycpIHtcbiAgICAgICAgICAgIHZhciBzdmdfZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdlbGxpcHNlJyk7XG4gICAgICAgICAgICBzdmdfZWxlbS5zZXRBdHRyaWJ1dGUoJ3J4JywgaXRlbS5kLzIpO1xuICAgICAgICAgICAgc3ZnX2VsZW0uc2V0QXR0cmlidXRlKCdyeScsIGl0ZW0uZC8yKTtcbiAgICAgICAgICAgIHN2Z19lbGVtLnNldEF0dHJpYnV0ZSgnY3gnLCB4KTtcbiAgICAgICAgICAgIHN2Z19lbGVtLnNldEF0dHJpYnV0ZSgnY3knLCB5KTtcbiAgICAgICAgICAgIGZvciggYXR0cl9uYW1lIGluIGF0dHJzICl7XG4gICAgICAgICAgICAgICAgc3ZnX2VsZW0uc2V0QXR0cmlidXRlKGF0dHJfbmFtZSwgYXR0cnNbYXR0cl9uYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgYy5hdHRyaWJ1dGVzKCBsYXllcl9hdHRyW2l0ZW0ubGF5ZXJfbmFtZV0gKVxuICAgICAgICAgICAgYy5hdHRyaWJ1dGVzKHtcbiAgICAgICAgICAgICAgICByeDogNSxcbiAgICAgICAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgIHJ5OiA1LFxuICAgICAgICAgICAgICAgIGN4OiBpdGVtLnBvaW50c1swXVswXS1pdGVtLmQvMixcbiAgICAgICAgICAgICAgICBjeTogaXRlbS5wb2ludHNbMF1bMV0taXRlbS5kLzJcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB2YXIgYzIgPSBzdmcuZWxsaXBzZSggaXRlbS5yLCBpdGVtLnIgKVxuICAgICAgICAgICAgYzIubW92ZSggaXRlbS5wb2ludHNbMF1bMF0taXRlbS5kLzIsIGl0ZW0ucG9pbnRzWzBdWzFdLWl0ZW0uZC8yIClcbiAgICAgICAgICAgIGMyLmF0dHIoe3J4OjUsIHJ5OjV9KVxuICAgICAgICAgICAgYzIuYXR0ciggbGF5ZXJfYXR0cltpdGVtLmxheWVyX25hbWVdIClcbiAgICAgICAgICAgIC8vKi9cbiAgICAgICAgfSBlbHNlIGlmKCBpdGVtLnR5cGUgPT09ICdpbWFnZScpIHtcblxuICAgICAgICAgICAgc3ZnX2VsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAnZycpO1xuICAgICAgICAgICAgdmFyIGltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ2ltYWdlJyk7XG4gICAgICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ3gnLCB4KTtcbiAgICAgICAgICAgIGltYWdlLnNldEF0dHJpYnV0ZSgneScsIHkpO1xuICAgICAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCd3aWR0aCcsIGl0ZW0udyk7XG4gICAgICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGl0ZW0uaCk7XG4gICAgICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ3hsaW5rOmhyZWYnLCBpdGVtLmhyZWYpO1xuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gYXR0cnMgKXtcbiAgICAgICAgICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoYXR0cl9uYW1lLCBhdHRyc1thdHRyX25hbWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vZy5hcHBlbmRDaGlsZChzdmdfZWxlbSk7XG4gICAgICAgICAgICAvL3N2Z19lbGVtLmFwcGVuZENoaWxkKGcpO1xuICAgICAgICAgICAgc3ZnX2VsZW0uaW5uZXJIVE1MICs9IGltYWdlLm91dGVySFRNTDtcblxuXG5cblxuICAgICAgICB9IGVsc2UgaWYoaXRlbS50eXBlID09PSAnYmxvY2snKSB7XG4gICAgICAgICAgICAvLyBpZiBpdCBpcyBhIGJsb2NrLCBydW4gdGhpcyBmdW5jdGlvbiB0aHJvdWdoIGVhY2ggZWxlbWVudC5cblxuICAgICAgICAgICAgc3ZnX2VsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAnZycpO1xuICAgICAgICAgICAgc3ZnX2VsZW0uc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcreCsnLCcreSsnKScpO1xuICAgICAgICAgICAgaXRlbS5kcmF3aW5nX3BhcnRzLmZvckVhY2goIGZ1bmN0aW9uKGJsb2NrX2l0ZW0saWQpe1xuICAgICAgICAgICAgICAgIHN2Z19lbGVtLmFwcGVuZENoaWxkKFxuICAgICAgICAgICAgICAgICAgICBta19zdmdfZWxlbShibG9ja19pdGVtKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdmdfZWxlbTtcblxuXG4gICAgfVxuICAgIHJldHVybiBzdmdfZG9jdW1lbnQ7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gbWtfc3ZnO1xuIiwidmFyIG1rX2RyYXdpbmcgPSByZXF1aXJlKCcuLi9ta19kcmF3aW5nJyk7XG52YXIgbWtfYm9yZGVyID0gcmVxdWlyZSgnLi4vbWtfYm9yZGVyJyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuXG4gICAgdmFyIGQgPSBta19kcmF3aW5nKHNldHRpbmdzKTtcblxuICAgIHZhciBzaGVldF9zZWN0aW9uID0gJ0EnO1xuICAgIHZhciBzaGVldF9udW0gPSAnMDAnO1xuICAgIC8vZC5hcHBlbmQobWtfYm9yZGVyKHNldHRpbmdzLCBzaGVldF9zZWN0aW9uLCBzaGVldF9udW0gKSk7XG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG5cbiAgICB2YXIgeCwgeSwgaCwgdztcbiAgICBkLmxheWVyKCd0ZXh0Jyk7XG4gICAgZC50ZXh0KFxuICAgICAgICBbc2l6ZS5kcmF3aW5nLncqMS8yLCBzaXplLmRyYXdpbmcuaCoxLzNdLFxuICAgICAgICBbXG4gICAgICAgICAgICAnUFYgU3lzdGVtIERlc2lnbicsXG4gICAgICAgIF0sXG4gICAgICAgIG51bGwsXG4gICAgICAgICdwcm9qZWN0IHRpdGxlJ1xuICAgICk7XG5cbiAgICBpZiggc2V0dGluZ3MuZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdsb2NhdGlvbicpICApe1xuICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICBbc2l6ZS5kcmF3aW5nLncqMS8yLCBzaXplLmRyYXdpbmcuaCoxLzMgKzMwXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5wZXJtLmxvY2F0aW9uLmFkZHJlc3MsXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MucGVybS5sb2NhdGlvbi5jaXR5ICsgJywgJyArIHNldHRpbmdzLnBlcm0ubG9jYXRpb24uY291bnR5ICsgJywgRkwsICcgKyBzZXR0aW5ncy5wZXJtLmxvY2F0aW9uLnppcCxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgJ3Byb2plY3QgdGl0bGUnXG4gICAgICAgICk7XG4gICAgfVxuICAgIHZhciBuX3Jvd3MgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNoZWV0cy5sZW5ndGg7XG4gICAgdmFyIG5fY29scyA9IDI7XG4gICAgdyA9IDQwMCs4MDtcbiAgICBoID0gbl9yb3dzKjIwO1xuICAgIHggPSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyo2O1xuICAgIHkgPSBzaXplLmRyYXdpbmcuaCAtIHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nIC0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94LmJvdHRvbS5oO1xuICAgIHkgKz0gLTIwICogbl9yb3dzO1xuICAgIHkgKz0gLTQwOyAvLyB0aGUgbGFzdCBudW1iZXIgaXMgdGhlIGdhcCB0byB0aGUgdGl0bGUgYm94XG4gICAgZC50ZXh0KCBbeCt3LzIsIHktMjBdLCAnQ29udGVudHMnLCBudWxsLCAndGFibGVfbGFyZ2UnICk7XG5cbiAgICB2YXIgdCA9IGQudGFibGUobl9yb3dzLG5fY29scykubG9jKHgseSk7XG4gICAgdC5yb3dfc2l6ZSgnYWxsJywgMjApLmNvbF9zaXplKDIsIDQwMCkuY29sX3NpemUoMSwgODApO1xuXG4gICAgc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaGVldHMuZm9yRWFjaChmdW5jdGlvbihzaGVldCxpKXtcbiAgICAgICAgdC5jZWxsKGkrMSwxKS50ZXh0KHNoZWV0Lm51bSk7XG4gICAgICAgIHQuY2VsbChpKzEsMikudGV4dChzaGVldC5kZXNjKTtcblxuICAgIH0pO1xuXG5cbiAgICB0LmFsbF9jZWxscygpLmZvckVhY2goZnVuY3Rpb24oY2VsbCl7XG4gICAgICAgIGNlbGwuZm9udCgndGFibGVfbGFyZ2VfbGVmdCcpLmJvcmRlcignYWxsJyk7XG4gICAgfSk7XG5cbiAgICB0Lm1rKCk7XG5cbiAgICAvKlxuICAgIGNvbnNvbGUubG9nKHRhYmxlX3BhcnRzKTtcbiAgICBkLmFwcGVuZCh0YWJsZV9wYXJ0cyk7XG4gICAgZC50ZXh0KFtzaXplLmRyYXdpbmcudy8zLHNpemUuZHJhd2luZy5oLzNdLCAnWCcsICd0YWJsZScpO1xuICAgIGQucmVjdChbc2l6ZS5kcmF3aW5nLncvMy01LHNpemUuZHJhd2luZy5oLzMtNV0sWzEwLDEwXSwnYm94Jyk7XG5cbiAgICB0LmNlbGwoMiwyKS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgMiwyJyk7XG4gICAgdC5jZWxsKDMsMykuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDMsMycpO1xuICAgIHQuY2VsbCg0LDQpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCA0LDQnKTtcbiAgICB0LmNlbGwoNSw1KS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgNSw1Jyk7XG5cblxuXG4gICAgdC5jZWxsKDQsNikuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDQsNicpO1xuICAgIHQuY2VsbCg0LDcpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCA0LDcnKTtcbiAgICB0LmNlbGwoNSw2KS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgNSw2Jyk7XG4gICAgdC5jZWxsKDUsNykuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDUsNycpO1xuXG5cbiAgICAvLyovXG5cbiAgICByZXR1cm4gZC5kcmF3aW5nX3BhcnRzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcGFnZTtcbiIsInZhciBta19kcmF3aW5nID0gcmVxdWlyZSgnLi4vbWtfZHJhd2luZycpO1xudmFyIG1rX2JvcmRlciA9IHJlcXVpcmUoJy4uL21rX2JvcmRlcicpO1xuXG52YXIgcGFnZSA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICB2YXIgZiA9IHNldHRpbmdzLmY7XG5cbiAgICBkID0gbWtfZHJhd2luZyhzZXR0aW5ncyk7XG5cbiAgICB2YXIgc2hlZXRfc2VjdGlvbiA9ICdTJztcbiAgICB2YXIgc2hlZXRfbnVtID0gJzAxJztcbiAgICAvL2QuYXBwZW5kKG1rX2JvcmRlcihzZXR0aW5ncywgc2hlZXRfc2VjdGlvbiwgc2hlZXRfbnVtICkpO1xuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKHNldHRpbmdzLCAncm9vZicpICl7XG5cblxuXG4gICAgICAgIHZhciB4LCB5LCBoLCB3LCBzZWN0aW9uX3gsIHNlY3Rpb25feSwgbGVuZ3RoX3AsIHNjYWxlO1xuXG4gICAgICAgIHZhciBzbG9wZSA9IHN5c3RlbS5yb29mLnNsb3BlLnNwbGl0KCc6JylbMF07XG4gICAgICAgIHZhciBhbmdsZV9yYWQgPSBNYXRoLmF0YW4oIE51bWJlcihzbG9wZSkgLzEyICk7XG4gICAgICAgIC8vYW5nbGVfcmFkID0gYW5nbGUgKiAoTWF0aC5QSS8xODApO1xuXG5cbiAgICAgICAgbGVuZ3RoX3AgPSBzeXN0ZW0ucm9vZi5sZW5ndGggKiBNYXRoLmNvcyhhbmdsZV9yYWQpO1xuICAgICAgICBzeXN0ZW0ucm9vZi5oZWlnaHQgPSBzeXN0ZW0ucm9vZi5sZW5ndGggKiBNYXRoLnNpbihhbmdsZV9yYWQpO1xuXG4gICAgICAgIHZhciByb29mX3JhdGlvID0gc3lzdGVtLnJvb2YubGVuZ3RoIC8gc3lzdGVtLnJvb2Yud2lkdGg7XG4gICAgICAgIHZhciByb29mX3BsYW5fcmF0aW8gPSBsZW5ndGhfcCAvIHN5c3RlbS5yb29mLndpZHRoO1xuXG5cbiAgICAgICAgaWYoIHN5c3RlbS5yb29mLnR5cGUgPT09IFwiR2FibGVcIil7XG5cblxuICAgICAgICAgICAgLy8vLy8vL1xuICAgICAgICAgICAgLy8gUm9vZCBwbGFuIHZpZXdcbiAgICAgICAgICAgIHZhciBwbGFuX3ggPSA2MDtcbiAgICAgICAgICAgIHZhciBwbGFuX3kgPSA2MDtcblxuICAgICAgICAgICAgdmFyIHBsYW5fdywgcGxhbl9oO1xuICAgICAgICAgICAgaWYoIGxlbmd0aF9wKjIgPiBzeXN0ZW0ucm9vZi53aWR0aCApe1xuICAgICAgICAgICAgICAgIHNjYWxlID0gMjAwLyhsZW5ndGhfcCoyKTtcbiAgICAgICAgICAgICAgICBwbGFuX3cgPSAobGVuZ3RoX3AqMikgKiBzY2FsZTtcbiAgICAgICAgICAgICAgICBwbGFuX2ggPSBwbGFuX3cgLyAobGVuZ3RoX3AqMiAvIHN5c3RlbS5yb29mLndpZHRoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2NhbGUgPSAzMDAvKHN5c3RlbS5yb29mLndpZHRoKTtcbiAgICAgICAgICAgICAgICBwbGFuX2ggPSBzeXN0ZW0ucm9vZi53aWR0aCAqIHNjYWxlO1xuICAgICAgICAgICAgICAgIHBsYW5fdyA9IHBsYW5faCAqIChsZW5ndGhfcCoyIC8gc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95K3BsYW5faC8yXSxcbiAgICAgICAgICAgICAgICBbcGxhbl93LCBwbGFuX2hdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsXCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGQucG9seShbXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3ggICAgICAgLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3krcGxhbl9oXSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCwgICAgICAgIHBsYW5feStwbGFuX2hdLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94ICAgICAgICwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX3BvbHlfdW5zZWxlY3RlZFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5wb2x5KFtcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiAgICAgICAsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIrcGxhbl93LzIsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIrcGxhbl93LzIsIHBsYW5feStwbGFuX2hdLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCAgICAgICAgcGxhbl95K3BsYW5faF0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIgICAgICAgLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfcG9seV9zZWxlY3RlZFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3krcGxhbl9oXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW3BsYW5feC0yMCwgcGxhbl95K3BsYW5faC8yXSxcbiAgICAgICAgICAgICAgICBzeXN0ZW0ucm9vZi5sZW5ndGgudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdysyMCwgcGxhbl95K3BsYW5faC8yXSxcbiAgICAgICAgICAgICAgICBzeXN0ZW0ucm9vZi53aWR0aC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG5cbiAgICAgICAgICAgIHggPSBwbGFuX3ggKyAxMjA7XG4gICAgICAgICAgICB5ID0gcGxhbl95IC0gMjA7XG5cbiAgICAgICAgICAgIGQuYmxvY2soJ25vcnRoIGFycm93X2xlZnQnLCBbeCx5XSk7XG5cblxuICAgICAgICAgICAgLy8vLy8vLy9cbiAgICAgICAgICAgIC8vIHJvb2YgY3Jvc3NlY3Rpb25cblxuICAgICAgICAgICAgdmFyIGNzX3ggPSBwbGFuX3g7XG4gICAgICAgICAgICB2YXIgY3NfeSA9IHBsYW5feSArIHBsYW5faCArIDUwO1xuICAgICAgICAgICAgdmFyIGNzX2ggPSBzeXN0ZW0ucm9vZi5oZWlnaHQgKiBzY2FsZTtcbiAgICAgICAgICAgIHZhciBjc193ID0gcGxhbl93LzI7XG5cbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3csICAgY3NfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3csICAgY3NfeStjc19oXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2NzX3grY3NfdywgICBjc195XSxcbiAgICAgICAgICAgICAgICAgICAgW2NzX3grY3NfdyoyLCBjc195K2NzX2hdLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCwgICAgICAgIGNzX3krY3NfaF0sXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3csICAgY3NfeV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtjc194K2NzX3ctMTUsIGNzX3krY3NfaCoyLzNdLFxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHN5c3RlbS5yb29mLmhlaWdodCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtjc194K2NzX3cqMS41KzIwLCBjc195K2NzX2gvM10sXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggc3lzdGVtLnJvb2YubGVuZ3RoICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbicsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG5cblxuXG4gICAgICAgICAgICAvLy8vLy9cbiAgICAgICAgICAgIC8vIHJvb2YgZGV0YWlsXG5cbiAgICAgICAgICAgIHZhciBkZXRhaWxfeCA9IDMwKzQwMDtcbiAgICAgICAgICAgIHZhciBkZXRhaWxfeSA9IDMwO1xuXG4gICAgICAgICAgICBpZiggTnVtYmVyKHN5c3RlbS5yb29mLndpZHRoKSA+PSBOdW1iZXIoc3lzdGVtLnJvb2YubGVuZ3RoKSApe1xuICAgICAgICAgICAgICAgIHNjYWxlID0gMzUwLyhzeXN0ZW0ucm9vZi53aWR0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNjYWxlID0gMzUwLyhzeXN0ZW0ucm9vZi5sZW5ndGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGRldGFpbF93ID0gc3lzdGVtLnJvb2Yud2lkdGggKiBzY2FsZTtcbiAgICAgICAgICAgIHZhciBkZXRhaWxfaCA9IHN5c3RlbS5yb29mLmxlbmd0aCAqIHNjYWxlO1xuXG4gICAgICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LzIsIGRldGFpbF95K2RldGFpbF9oLzJdLFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfdywgZGV0YWlsX2hdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX3BvbHlfc2VsZWN0ZWRfZnJhbWVkXCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHZhciBhID0gMztcbiAgICAgICAgICAgIHZhciBvZmZzZXRfYSA9IGEgKiBzY2FsZTtcblxuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94LCAgIGRldGFpbF95K29mZnNldF9hXSxcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LCAgIGRldGFpbF95K29mZnNldF9hXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94LCAgICAgICAgICBkZXRhaWxfeStkZXRhaWxfaC1vZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdywgZGV0YWlsX3krZGV0YWlsX2gtb2Zmc2V0X2FdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grb2Zmc2V0X2EsIGRldGFpbF95XSxcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K29mZnNldF9hLCBkZXRhaWxfeStkZXRhaWxfaF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy1vZmZzZXRfYSwgZGV0YWlsX3ldLFxuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3ctb2Zmc2V0X2EsIGRldGFpbF95K2RldGFpbF9oXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94LTQwLCBkZXRhaWxfeStkZXRhaWxfaC8yXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi5sZW5ndGggKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3cvMiwgZGV0YWlsX3krZGV0YWlsX2grNDBdLFxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHN5c3RlbS5yb29mLndpZHRoICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbicsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3grIChvZmZzZXRfYSkvMiwgZGV0YWlsX3krZGV0YWlsX2grMTVdLFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3ctKG9mZnNldF9hKS8yLCBkZXRhaWxfeStkZXRhaWxfaCsxNV0sXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeC0xNSwgZGV0YWlsX3krZGV0YWlsX2gtKG9mZnNldF9hKS8yXSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbicsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94LTE1LCBkZXRhaWxfeSsob2Zmc2V0X2EpLzJdLFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgeCA9IGRldGFpbF94ICsgZGV0YWlsX3cgKyAyNTtcbiAgICAgICAgICAgIHkgPSBkZXRhaWxfeSArIDEyMDtcblxuICAgICAgICAgICAgZC5ibG9jaygnbm9ydGggYXJyb3dfdXAnLCBbeCx5XSk7XG5cblxuXG4gICAgICAgICAgICAvLy8vLy9cbiAgICAgICAgICAgIC8vIE1vZHVsZSBvcHRpb25zXG4gICAgICAgICAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdtb2R1bGUnKSAmJiBmLnNlY3Rpb25fZGVmaW5lZChzZXR0aW5ncywgJ2FycmF5Jykpe1xuICAgICAgICAgICAgICAgIHZhciByLGM7XG5cbiAgICAgICAgICAgICAgICB2YXIgcm9vZl9sZW5ndGhfYXZhaWwgPSBzeXN0ZW0ucm9vZi5sZW5ndGggLSAoYSoyKTtcbiAgICAgICAgICAgICAgICB2YXIgcm9vZl93aWR0aF9hdmFpbCA9IHN5c3RlbS5yb29mLndpZHRoIC0gKGEqMik7XG5cbiAgICAgICAgICAgICAgICB2YXIgcm93X3NwYWNpbmc7XG4gICAgICAgICAgICAgICAgaWYoIHN5c3RlbS5tb2R1bGUub3JpZW50YXRpb24gPT09ICdQb3J0cmFpdCcgKXtcbiAgICAgICAgICAgICAgICAgICAgcm93X3NwYWNpbmcgPSBOdW1iZXIoc3lzdGVtLm1vZHVsZS5sZW5ndGgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgY29sX3NwYWNpbmcgPSBOdW1iZXIoc3lzdGVtLm1vZHVsZS53aWR0aCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVfdyA9IChOdW1iZXIoc3lzdGVtLm1vZHVsZS53aWR0aCkgICkvMTI7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV9oID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLmxlbmd0aCkgKS8xMjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByb3dfc3BhY2luZyA9IE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIGNvbF9zcGFjaW5nID0gTnVtYmVyKHN5c3RlbS5tb2R1bGUubGVuZ3RoKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV93ID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLmxlbmd0aCkpLzEyO1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVfaCA9IChOdW1iZXIoc3lzdGVtLm1vZHVsZS53aWR0aCkgKS8xMjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByb3dfc3BhY2luZyA9IHJvd19zcGFjaW5nLzEyOyAvL21vZHVsZSBkaW1lbnRpb25zIGFyZSBpbiBpbmNoZXNcbiAgICAgICAgICAgICAgICBjb2xfc3BhY2luZyA9IGNvbF9zcGFjaW5nLzEyOyAvL21vZHVsZSBkaW1lbnRpb25zIGFyZSBpbiBpbmNoZXNcblxuICAgICAgICAgICAgICAgIHZhciBudW1fcm93cyA9IE1hdGguZmxvb3Iocm9vZl9sZW5ndGhfYXZhaWwvcm93X3NwYWNpbmcpO1xuICAgICAgICAgICAgICAgIHZhciBudW1fY29scyA9IE1hdGguZmxvb3Iocm9vZl93aWR0aF9hdmFpbC9jb2xfc3BhY2luZyk7XG5cbiAgICAgICAgICAgICAgICAvL3NlbGVjdGVkIG1vZHVsZXNcblxuICAgICAgICAgICAgICAgIGlmKCBudW1fY29scyAhPT0gc2V0dGluZ3MudGVtcC5udW1fY29scyB8fCBudW1fcm93cyAhPT0gc2V0dGluZ3MudGVtcC5udW1fcm93cyApe1xuICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXMgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3Mud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzX3RvdGFsID0gMDtcblxuICAgICAgICAgICAgICAgICAgICBmb3IoIHI9MTsgcjw9bnVtX3Jvd3M7IHIrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl0gPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciggYz0xOyBjPD1udW1fY29sczsgYysrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl1bY10gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MudGVtcC5udW1fY29scyA9IG51bV9jb2xzO1xuICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy50ZW1wLm51bV9yb3dzID0gbnVtX3Jvd3M7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICB4ID0gZGV0YWlsX3ggKyBvZmZzZXRfYTsgLy9jb3JuZXIgb2YgdXNhYmxlIHNwYWNlXG4gICAgICAgICAgICAgICAgeSA9IGRldGFpbF95ICsgb2Zmc2V0X2E7XG4gICAgICAgICAgICAgICAgeCArPSAoIHJvb2Zfd2lkdGhfYXZhaWwgLSAoY29sX3NwYWNpbmcqbnVtX2NvbHMpKS8yICpzY2FsZTsgLy8gY2VudGVyIGFycmF5IG9uIHJvb2ZcbiAgICAgICAgICAgICAgICB5ICs9ICggcm9vZl9sZW5ndGhfYXZhaWwgLSAocm93X3NwYWNpbmcqbnVtX3Jvd3MpKS8yICpzY2FsZTtcbiAgICAgICAgICAgICAgICBtb2R1bGVfdyA9IG1vZHVsZV93ICogc2NhbGU7XG4gICAgICAgICAgICAgICAgbW9kdWxlX2ggPSBtb2R1bGVfaCAqIHNjYWxlO1xuXG5cblxuICAgICAgICAgICAgICAgIGZvciggcj0xOyByPD1udW1fcm93czsgcisrKXtcblxuICAgICAgICAgICAgICAgICAgICBmb3IoIGM9MTsgYzw9bnVtX2NvbHM7IGMrKyl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXllcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBzZXR0aW5ncy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl1bY10gKSBsYXllciA9ICdwcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgbGF5ZXIgPSAncHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVfeCA9IChjLTEpICogY29sX3NwYWNpbmcgKiBzY2FsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZV95ID0gKHItMSkgKiByb3dfc3BhY2luZyAqIHNjYWxlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3grbW9kdWxlX3grbW9kdWxlX3cvMiwgeSttb2R1bGVfeSttb2R1bGVfaC8yXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbbW9kdWxlX3csIG1vZHVsZV9oXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXllcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uY2xpY2s6IFwiZy5mLnRvZ2dsZV9tb2R1bGUodGhpcylcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlX0lEOiAgKHIpICsgJywnICsgKGMpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy8yLCBkZXRhaWxfeStkZXRhaWxfaCsxMDBdLFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlNlbGVjdGVkIG1vZHVsZXM6IFwiICsgcGFyc2VGbG9hdCggc2V0dGluZ3Mud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzX3RvdGFsICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNhbGN1bGF0ZWQgbW9kdWxlczogXCIgKyBwYXJzZUZsb2F0KCBzZXR0aW5ncy5zeXN0ZW0uYXJyYXkubnVtYmVyX29mX21vZHVsZXMgKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgJ2RpbWVudGlvbicsXG4gICAgICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgfVxuXG5cblxuXG4gICAgICAgIH1cbiAgICB9XG5cblxuXG5cblxuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuXG52YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4uL21rX2RyYXdpbmcnKTtcbnZhciBta19ib3JkZXIgPSByZXF1aXJlKCcuLi9ta19ib3JkZXInKTtcblxuLy92YXIgZHJhd2luZ19wYXJ0cyA9IFtdO1xuLy9kLmxpbmtfZHJhd2luZ19wYXJ0cyhkcmF3aW5nX3BhcnRzKTtcblxudmFyIHBhZ2UgPSBmdW5jdGlvbihzZXR0aW5ncyl7XG4gICAgdmFyIGQgPSBta19kcmF3aW5nKHNldHRpbmdzKTtcbiAgICB2YXIgc2hlZXRfc2VjdGlvbiA9ICdQVic7XG4gICAgdmFyIHNoZWV0X251bSA9ICcwMSc7XG4gICAgLy9kLmFwcGVuZChta19ib3JkZXIoc2V0dGluZ3MsIHNoZWV0X3NlY3Rpb24sIHNoZWV0X251bSApKTtcblxuICAgIHZhciBmID0gc2V0dGluZ3MuZjtcblxuICAgIC8vdmFyIGNvbXBvbmVudHMgPSBzZXR0aW5ncy5jb21wb25lbnRzO1xuICAgIC8vdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcbiAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuXG5cblxuXG4gICAgdmFyIHgsIHksIGgsIHc7XG4gICAgdmFyIG9mZnNldDtcblxuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vI2FycmF5XG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKHNldHRpbmdzLCAnbW9kdWxlJykgJiYgZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdhcnJheScpICl7XG4gICAgICAgIGQuc2VjdGlvbignYXJyYXknKTtcblxuXG4gICAgICAgIHggPSBsb2MuYXJyYXkucmlnaHQgLSBzaXplLnN0cmluZy53O1xuICAgICAgICB5ID0gbG9jLmFycmF5LnVwcGVyO1xuICAgICAgICAvL3kgLT0gc2l6ZS5zdHJpbmcuaC8yO1xuXG5cbiAgICAgICAgLy9mb3IoIHZhciBpPTA7IGk8c3lzdGVtLkRDLnN0cmluZ19udW07IGkrKyApIHtcbiAgICAgICAgZm9yKCB2YXIgaSBpbiBfLnJhbmdlKHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncykpIHtcbiAgICAgICAgICAgIC8vdmFyIG9mZnNldCA9IGkgKiBzaXplLndpcmVfb2Zmc2V0LmJhc2VcbiAgICAgICAgICAgIHZhciBvZmZzZXRfd2lyZSA9IHNpemUud2lyZV9vZmZzZXQubWluICsgKCBzaXplLndpcmVfb2Zmc2V0LmJhc2UgKiBpICk7XG5cbiAgICAgICAgICAgIGQuYmxvY2soJ3N0cmluZycsIFt4LHldKTtcbiAgICAgICAgICAgIC8vIHBvc2l0aXZlIGhvbWUgcnVuXG4gICAgICAgICAgICBkLmxheWVyKCdEQ19wb3MnKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4ICwgbG9jLmFycmF5LnVwcGVyIF0sXG4gICAgICAgICAgICAgICAgWyB4ICwgbG9jLmFycmF5LnVwcGVyLW9mZnNldF93aXJlIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrb2Zmc2V0X3dpcmUgLCBsb2MuYXJyYXkudXBwZXItb2Zmc2V0X3dpcmUgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtvZmZzZXRfd2lyZSAsIGxvYy5qYl9ib3gueS1vZmZzZXRfd2lyZV0sXG4gICAgICAgICAgICAgICAgWyBsb2MuamJfYm94LnggLCBsb2MuamJfYm94Lnktb2Zmc2V0X3dpcmVdLFxuICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIC8vIG5lZ2F0aXZlIGhvbWUgcnVuXG4gICAgICAgICAgICBkLmxheWVyKCdEQ19uZWcnKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4ICwgbG9jLmFycmF5Lmxvd2VyIF0sXG4gICAgICAgICAgICAgICAgWyB4ICwgbG9jLmFycmF5Lmxvd2VyX2xpbWl0K29mZnNldF93aXJlIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrb2Zmc2V0X3dpcmUgLCBsb2MuYXJyYXkubG93ZXJfbGltaXQrb2Zmc2V0X3dpcmUgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtvZmZzZXRfd2lyZSAsIGxvYy5qYl9ib3gueStvZmZzZXRfd2lyZV0sXG4gICAgICAgICAgICAgICAgWyBsb2MuamJfYm94LnggLCBsb2MuamJfYm94Lnkrb2Zmc2V0X3dpcmVdLFxuICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIHggLT0gc2l6ZS5zdHJpbmcudztcbiAgICAgICAgfVxuXG4gICAgLy8gICAgZC5yZWN0KFxuICAgIC8vICAgICAgICBbIChsb2MuYXJyYXkucmlnaHQrbG9jLmFycmF5LmxlZnQpLzIsIChsb2MuYXJyYXkubG93ZXIrbG9jLmFycmF5LnVwcGVyKS8yIF0sXG4gICAgLy8gICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0LWxvYy5hcnJheS5sZWZ0LCBsb2MuYXJyYXkubG93ZXItbG9jLmFycmF5LnVwcGVyIF0sXG4gICAgLy8gICAgICAgICdEQ19wb3MnKTtcbiAgICAvL1xuXG4gICAgICAgIGQubGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgLy9bIGxvYy5hcnJheS5sZWZ0ICwgbG9jLmFycmF5Lmxvd2VyICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgICAgIFsgbG9jLmFycmF5LmxlZnQsIGxvYy5hcnJheS5sb3dlcl9saW1pdCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCAsIGxvYy5hcnJheS5sb3dlcl9saW1pdCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgICAgICAgICBbIGxvYy5hcnJheS5yaWdodCtzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCAsIGxvYy5qYl9ib3gueSArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAgICAgICAgIFsgbG9jLmpiX2JveC54ICwgbG9jLmpiX2JveC55K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAgICAgXSk7XG5cbiAgICAgICAgZC5sYXllcigpO1xuXG5cbiAgICB9Ly8gZWxzZSB7IGNvbnNvbGUubG9nKFwiRHJhd2luZzogYXJyYXkgbm90IHJlYWR5XCIpfVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBjb21iaW5lciBib3hcblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZChzZXR0aW5ncywgJ0RDJykgKXtcblxuICAgICAgICBkLnNlY3Rpb24oXCJjb21iaW5lclwiKTtcblxuICAgICAgICB4ID0gbG9jLmpiX2JveC54O1xuICAgICAgICB5ID0gbG9jLmpiX2JveC55O1xuXG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFt4LHldLFxuICAgICAgICAgICAgW3NpemUuamJfYm94Lncsc2l6ZS5qYl9ib3guaF0sXG4gICAgICAgICAgICAnYm94J1xuICAgICAgICApO1xuXG4gICAgICAgIGZvciggaSBpbiBfLnJhbmdlKHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncykpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IHNpemUud2lyZV9vZmZzZXQubWluICsgKCBzaXplLndpcmVfb2Zmc2V0LmJhc2UgKiBpICk7XG5cbiAgICAgICAgICAgIGQubGF5ZXIoJ0RDX3BvcycpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHggLCB5LW9mZnNldF0sXG4gICAgICAgICAgICAgICAgWyB4ICwgeS1vZmZzZXRdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgICAgICB5OiB5LW9mZnNldCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHggLCB5LW9mZnNldF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54LW9mZnNldCAsIHktb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngtb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbV0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54LW9mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICAgICAgeDogbG9jLmRpc2Nib3gueC1vZmZzZXQsXG4gICAgICAgICAgICAgICAgeTogbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGQubGF5ZXIoJ0RDX25lZycpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHgsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIHgtc2l6ZS5mdXNlLncvMiAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgZC5ibG9jayggJ2Z1c2UnLCB7XG4gICAgICAgICAgICAgICAgeDogeCAsXG4gICAgICAgICAgICAgICAgeTogeStvZmZzZXQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4K3NpemUuZnVzZS53LzIgLCB5K29mZnNldF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbV0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICAgICAgeDogbG9jLmRpc2Nib3gueCtvZmZzZXQsXG4gICAgICAgICAgICAgICAgeTogbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkLmxheWVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2QubGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgICAgICAvL2QubGluZShbXG4gICAgICAgIC8vICAgIFsgbG9jLmFycmF5LmxlZnQgLCBsb2MuYXJyYXkubG93ZXIgKyBzaXplLm1vZHVsZS53ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgLy8gICAgWyBsb2MuYXJyYXkucmlnaHQrc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLCBsb2MuYXJyYXkubG93ZXIgKyBzaXplLm1vZHVsZS53ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgLy8gICAgWyBsb2MuYXJyYXkucmlnaHQrc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLCBsb2MuYXJyYXkueSArIHNpemUubW9kdWxlLncgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZF0sXG4gICAgICAgIC8vICAgIFsgbG9jLmFycmF5LnggLCBsb2MuYXJyYXkueStzaXplLm1vZHVsZS53K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAgICAgLy9dKTtcblxuICAgICAgICAvL2QubGF5ZXIoKTtcblxuICAgICAgICAvLyBHcm91bmRcbiAgICAgICAgLy9vZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0LmdhcCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kO1xuICAgICAgICBvZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZDtcblxuICAgICAgICBkLmxheWVyKCdEQ19ncm91bmQnKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFsgeCAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgIFsgeCAsIHkrb2Zmc2V0XSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5K29mZnNldCxcbiAgICAgICAgfSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbIHggLCB5K29mZnNldF0sXG4gICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgeStvZmZzZXRdLFxuICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW1dLFxuICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgeDogbG9jLmRpc2Nib3gueCtvZmZzZXQsXG4gICAgICAgICAgICB5OiBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtXG4gICAgICAgIH0pO1xuICAgICAgICBkLmxheWVyKCk7XG5cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgLy8gREMgZGlzY29uZWN0XG4gICAgICAgIGQuc2VjdGlvbihcIkRDIGRpY29uZWN0XCIpO1xuXG5cbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW2xvYy5kaXNjYm94LngsIGxvYy5kaXNjYm94LnldLFxuICAgICAgICAgICAgW3NpemUuZGlzY2JveC53LHNpemUuZGlzY2JveC5oXSxcbiAgICAgICAgICAgICdib3gnXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gREMgZGlzY29uZWN0IGNvbWJpbmVyIGQubGluZXNcblxuICAgICAgICB4ID0gbG9jLmRpc2Nib3gueDtcbiAgICAgICAgeSA9IGxvYy5kaXNjYm94LnkgKyBzaXplLmRpc2Nib3guaC8yO1xuXG4gICAgICAgIGlmKCBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgPiAxKXtcbiAgICAgICAgICAgIHZhciBvZmZzZXRfbWluID0gc2l6ZS53aXJlX29mZnNldC5taW47XG4gICAgICAgICAgICB2YXIgb2Zmc2V0X21heCA9IHNpemUud2lyZV9vZmZzZXQubWluICsgKCAoc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzIC0xKSAqIHNpemUud2lyZV9vZmZzZXQuYmFzZSApO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHgtb2Zmc2V0X21pbiwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgICAgIFsgeC1vZmZzZXRfbWF4LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBdLCAnRENfcG9zJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCtvZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICAgICAgWyB4K29mZnNldF9tYXgsIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIF0sICdEQ19uZWcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEludmVydGVyIGNvbmVjdGlvblxuICAgICAgICAvL2QubGluZShbXG4gICAgICAgIC8vICAgIFsgeC1vZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgIC8vICAgIFsgeC1vZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgIC8vXSwnRENfcG9zJyk7XG5cbiAgICAgICAgLy9vZmZzZXQgPSBvZmZzZXRfbWF4IC0gb2Zmc2V0X21pbjtcbiAgICAgICAgb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5taW47XG5cbiAgICAgICAgLy8gbmVnXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbIHgrb2Zmc2V0LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBbIHgrb2Zmc2V0LCBsb2MuaW52ZXJ0ZXIueStzaXplLmludmVydGVyLmgvMi1zaXplLnRlcm1pbmFsX2RpYW0gXSxcbiAgICAgICAgXSwnRENfbmVnJyk7XG4gICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgIHg6IHgrb2Zmc2V0LFxuICAgICAgICAgICAgeTogbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBwb3NcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFsgeC1vZmZzZXQsIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIFsgeC1vZmZzZXQsIGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSBdLFxuICAgICAgICBdLCdEQ19wb3MnKTtcbiAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgeDogeC1vZmZzZXQsXG4gICAgICAgICAgICB5OiBsb2MuaW52ZXJ0ZXIueStzaXplLmludmVydGVyLmgvMi1zaXplLnRlcm1pbmFsX2RpYW0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGdyb3VuZFxuICAgICAgICAvL29mZnNldCA9IHNpemUud2lyZV9vZmZzZXQuZ2FwICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQ7XG4gICAgICAgIG9mZnNldCA9IHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgWyB4K29mZnNldCwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgWyB4K29mZnNldCwgbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtIF0sXG4gICAgICAgIF0sJ0RDX2dyb3VuZCcpO1xuICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICB4OiB4K29mZnNldCxcbiAgICAgICAgICAgIHk6IGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSxcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vI2ludmVydGVyXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKHNldHRpbmdzLCAnaW52ZXJ0ZXInKSApe1xuXG4gICAgICAgIGQuc2VjdGlvbihcImludmVydGVyXCIpO1xuXG5cbiAgICAgICAgeCA9IGxvYy5pbnZlcnRlci54O1xuICAgICAgICB5ID0gbG9jLmludmVydGVyLnk7XG5cblxuICAgICAgICAvL2ZyYW1lXG4gICAgICAgIGQubGF5ZXIoJ2JveCcpO1xuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbeCx5XSxcbiAgICAgICAgICAgIFtzaXplLmludmVydGVyLncsIHNpemUuaW52ZXJ0ZXIuaF1cbiAgICAgICAgKTtcbiAgICAgICAgLy8gTGFiZWwgYXQgdG9wIChJbnZlcnRlciwgbWFrZSwgbW9kZWwsIC4uLilcbiAgICAgICAgZC5sYXllcigndGV4dCcpO1xuICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICBbbG9jLmludmVydGVyLngsIGxvYy5pbnZlcnRlci50b3AgKyBzaXplLmludmVydGVyLnRleHRfZ2FwIF0sXG4gICAgICAgICAgICBbICdJbnZlcnRlcicsIHNldHRpbmdzLnN5c3RlbS5pbnZlcnRlci5tYWtlICsgXCIgXCIgKyBzZXR0aW5ncy5zeXN0ZW0uaW52ZXJ0ZXIubW9kZWwgXSxcbiAgICAgICAgICAgICdsYWJlbCdcbiAgICAgICAgKTtcbiAgICAgICAgZC5sYXllcigpO1xuXG4gICAgLy8jaW52ZXJ0ZXIgc3ltYm9sXG4gICAgICAgIGQuc2VjdGlvbihcImludmVydGVyIHN5bWJvbFwiKTtcblxuICAgICAgICB4ID0gbG9jLmludmVydGVyLng7XG4gICAgICAgIHkgPSBsb2MuaW52ZXJ0ZXIueTtcblxuICAgICAgICB3ID0gc2l6ZS5pbnZlcnRlci5zeW1ib2xfdztcbiAgICAgICAgaCA9IHNpemUuaW52ZXJ0ZXIuc3ltYm9sX2g7XG5cbiAgICAgICAgdmFyIHNwYWNlID0gdyoxLzEyO1xuXG4gICAgICAgIC8vIEludmVydGVyIHN5bWJvbFxuICAgICAgICBkLmxheWVyKCdib3gnKTtcblxuICAgICAgICAvLyBib3hcbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW3gseV0sXG4gICAgICAgICAgICBbdywgaF1cbiAgICAgICAgKTtcbiAgICAgICAgLy8gZGlhZ2FuYWxcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4LXcvMiwgeStoLzJdLFxuICAgICAgICAgICAgW3grdy8yLCB5LWgvMl0sXG5cbiAgICAgICAgXSk7XG4gICAgICAgIC8vIERDXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlLFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZV0sXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlKjYsXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlXSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlLFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqMixcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSozLFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNCxcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSo1LFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNixcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIF0pO1xuXG4gICAgICAgIC8vIEFDXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlLFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSoyLFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqMyxcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqNCxcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjUsXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjYsXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxheWVyKCk7XG5cblxuXG5cblxuICAgIH1cblxuXG5cblxuXG4vLyNBQ19kaXNjY29uZWN0XG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKHNldHRpbmdzLCAnQUMnKSApe1xuICAgICAgICBkLnNlY3Rpb24oXCJBQ19kaXNjY29uZWN0XCIpO1xuXG4gICAgICAgIHggPSBsb2MuQUNfZGlzYy54O1xuICAgICAgICB5ID0gbG9jLkFDX2Rpc2MueTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBzaXplLnRlcm1pbmFsX2RpYW07XG5cbiAgICAgICAgZC5sYXllcignYm94Jyk7XG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFt4LCB5XSxcbiAgICAgICAgICAgIFtzaXplLkFDX2Rpc2Mudywgc2l6ZS5BQ19kaXNjLmhdXG4gICAgICAgICk7XG4gICAgICAgIGQubGF5ZXIoKTtcblxuXG4gICAgLy9kLmNpcmMoW3gseV0sNSk7XG5cblxuXG4gICAgLy8jQUMgbG9hZCBjZW50ZXJcbiAgICAgICAgZC5zZWN0aW9uKFwiQUMgbG9hZCBjZW50ZXJcIik7XG5cbiAgICAgICAgdmFyIGJyZWFrZXJfc3BhY2luZyA9IHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5zcGFjaW5nO1xuXG4gICAgICAgIHggPSBsb2MuQUNfbG9hZGNlbnRlci54O1xuICAgICAgICB5ID0gbG9jLkFDX2xvYWRjZW50ZXIueTtcbiAgICAgICAgdyA9IHNpemUuQUNfbG9hZGNlbnRlci53O1xuICAgICAgICBoID0gc2l6ZS5BQ19sb2FkY2VudGVyLmg7XG5cbiAgICAgICAgZC5yZWN0KFt4LHldLFxuICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAnYm94J1xuICAgICAgICApO1xuXG4gICAgICAgIGQudGV4dChbeCx5LWgqMC40XSxcbiAgICAgICAgICAgIFtzeXN0ZW0uQUMubG9hZGNlbnRlcl90eXBlcywgJ0xvYWQgQ2VudGVyJ10sXG4gICAgICAgICAgICAnbGFiZWwnLFxuICAgICAgICAgICAgJ3RleHQnXG4gICAgICAgICk7XG4gICAgICAgIHcgPSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci53O1xuICAgICAgICBoID0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIuaDtcblxuICAgICAgICBwYWRkaW5nID0gbG9jLkFDX2xvYWRjZW50ZXIueCAtIGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLmxlZnQgLSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci53O1xuXG4gICAgICAgIHkgPSBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy50b3A7XG4gICAgICAgIHkgKz0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnNwYWNpbmcvMjtcbiAgICAgICAgZm9yKCB2YXIgaT0wOyBpPHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5udW07IGkrKyl7XG4gICAgICAgICAgICBkLnJlY3QoW3gtcGFkZGluZy13LzIseV0sW3csaF0sJ2JveCcpO1xuICAgICAgICAgICAgZC5yZWN0KFt4K3BhZGRpbmcrdy8yLHldLFt3LGhdLCdib3gnKTtcbiAgICAgICAgICAgIHkgKz0gYnJlYWtlcl9zcGFjaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHMsIGw7XG5cbiAgICAgICAgbCA9IGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXI7XG4gICAgICAgIHMgPSBzaXplLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhcjtcbiAgICAgICAgZC5yZWN0KFtsLngsbC55XSwgW3MudyxzLmhdLCAnQUNfbmV1dHJhbCcgKTtcblxuICAgICAgICBsID0gbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyO1xuICAgICAgICBzID0gc2l6ZS5BQ19sb2FkY2VudGVyLmdyb3VuZGJhcjtcbiAgICAgICAgZC5yZWN0KFtsLngsbC55XSwgW3MudyxzLmhdLCAnQUNfZ3JvdW5kJyApO1xuXG4gICAgICAgIGQuYmxvY2soJ2dyb3VuZCcsIFtsLngsbC55K3MuaC8yXSk7XG5cblxuXG4gICAgLy8gQUMgZC5saW5lc1xuICAgICAgICBkLnNlY3Rpb24oXCJBQyBkLmxpbmVzXCIpO1xuXG4gICAgICAgIHggPSBsb2MuaW52ZXJ0ZXIuYm90dG9tX3JpZ2h0Lng7XG4gICAgICAgIHkgPSBsb2MuaW52ZXJ0ZXIuYm90dG9tX3JpZ2h0Lnk7XG4gICAgICAgIHggLT0gc2l6ZS50ZXJtaW5hbF9kaWFtICogKHN5c3RlbS5BQy5udW1fY29uZHVjdG9ycysxKTtcbiAgICAgICAgeSAtPSBzaXplLnRlcm1pbmFsX2RpYW07XG5cbiAgICAgICAgdmFyIGNvbmR1aXRfeSA9IGxvYy5BQ19jb25kdWl0Lnk7XG4gICAgICAgIHBhZGRpbmcgPSBzaXplLnRlcm1pbmFsX2RpYW07XG4gICAgICAgIC8vdmFyIEFDX2QubGF5ZXJfbmFtZXMgPSBbJ0FDX2dyb3VuZCcsICdBQ19uZXV0cmFsJywgJ0FDX0wxJywgJ0FDX0wyJywgJ0FDX0wyJ107XG5cbiAgICAgICAgZm9yKCB2YXIgaT0wOyBpIDwgc3lzdGVtLkFDLm51bV9jb25kdWN0b3JzOyBpKysgKXtcbiAgICAgICAgICAgIGQuYmxvY2soJ3Rlcm1pbmFsJywgW3gseV0gKTtcbiAgICAgICAgICAgIGQubGF5ZXIoJ0FDXycrc3lzdGVtLkFDLmNvbmR1Y3RvcnNbaV0pO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbeCwgeV0sXG4gICAgICAgICAgICAgICAgW3gsIGxvYy5BQ19kaXNjLmJvdHRvbSAtIHBhZGRpbmcqMiAtIHBhZGRpbmcqaSAgXSxcbiAgICAgICAgICAgICAgICBbbG9jLkFDX2Rpc2MubGVmdCwgbG9jLkFDX2Rpc2MuYm90dG9tIC0gcGFkZGluZyoyIC0gcGFkZGluZyppIF0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIHggKz0gc2l6ZS50ZXJtaW5hbF9kaWFtO1xuICAgICAgICB9XG4gICAgICAgIGQubGF5ZXIoKTtcblxuICAgICAgICB4ID0gbG9jLkFDX2Rpc2MueDtcbiAgICAgICAgeSA9IGxvYy5BQ19kaXNjLnkgKyBzaXplLkFDX2Rpc2MuaC8yO1xuICAgICAgICB5IC09IHBhZGRpbmcqMjtcblxuICAgICAgICBpZiggc3lzdGVtLkFDLmNvbmR1Y3RvcnMgJiYgc3lzdGVtLkFDLmNvbmR1Y3RvcnMuaW5kZXhPZignZ3JvdW5kJykrMSApIHtcbiAgICAgICAgICAgIGQubGF5ZXIoJ0FDX2dyb3VuZCcpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHgtc2l6ZS5BQ19kaXNjLncvMiwgeSBdLFxuICAgICAgICAgICAgICAgIFsgeCtzaXplLkFDX2Rpc2Mudy8yK3BhZGRpbmcqMiwgeSBdLFxuICAgICAgICAgICAgICAgIFsgeCtzaXplLkFDX2Rpc2Mudy8yK3BhZGRpbmcqMiwgY29uZHVpdF95ICsgYnJlYWtlcl9zcGFjaW5nKjIgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLmxlZnQrcGFkZGluZyoyLCBjb25kdWl0X3kgKyBicmVha2VyX3NwYWNpbmcqMiBdLFxuICAgICAgICAgICAgICAgIC8vWyBsb2MuQUNfbG9hZGNlbnRlci5sZWZ0K3BhZGRpbmcqMiwgeSBdLFxuICAgICAgICAgICAgICAgIC8vWyBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueC1wYWRkaW5nLCB5IF0sXG4gICAgICAgICAgICAgICAgLy9bIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci54LXBhZGRpbmcsIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci55K3NpemUuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIuaC8yIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5sZWZ0K3BhZGRpbmcqMiwgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLnkgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci54LXNpemUuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIudy8yLCBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueSBdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggc3lzdGVtLkFDLmNvbmR1Y3RvcnMgJiYgc3lzdGVtLkFDLmNvbmR1Y3RvcnMuaW5kZXhPZignbmV1dHJhbCcpKzEgKSB7XG4gICAgICAgICAgICB5IC09IHBhZGRpbmc7XG4gICAgICAgICAgICBkLmxheWVyKCdBQ19uZXV0cmFsJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeC1zaXplLkFDX2Rpc2Mudy8yLCB5IF0sXG4gICAgICAgICAgICAgICAgWyB4K3BhZGRpbmcqMyoyLCB5IF0sXG4gICAgICAgICAgICAgICAgWyB4K3BhZGRpbmcqMyoyLCBjb25kdWl0X3kgKyBicmVha2VyX3NwYWNpbmcqMSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhci54LCBjb25kdWl0X3kgKyBicmVha2VyX3NwYWNpbmcqMSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhci54LFxuICAgICAgICAgICAgICAgICAgICBsb2MuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyLnktc2l6ZS5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIuaC8yIF0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuXG5cblxuICAgICAgICBmb3IoIHZhciBpPTE7IGkgPD0gMzsgaSsrICkge1xuICAgICAgICAgICAgaWYoIHN5c3RlbS5BQy5jb25kdWN0b3JzICYmIHN5c3RlbS5BQy5jb25kdWN0b3JzLmluZGV4T2YoJ0wnK2kpKzEgKSB7XG4gICAgICAgICAgICAgICAgeSAtPSBwYWRkaW5nO1xuICAgICAgICAgICAgICAgIGQubGF5ZXIoJ0FDX0wnK2kpO1xuICAgICAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFsgeC1zaXplLkFDX2Rpc2Mudy8yLCB5IF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeCtwYWRkaW5nKjMqKDItaSksIHkgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB4K3BhZGRpbmcqMyooMi1pKSwgbG9jLkFDX2Rpc2Muc3dpdGNoX2JvdHRvbSBdLFxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIGQuYmxvY2soJ3Rlcm1pbmFsJywgWyB4LXBhZGRpbmcqKGktMikqMywgbG9jLkFDX2Rpc2Muc3dpdGNoX2JvdHRvbSBdICk7XG4gICAgICAgICAgICAgICAgZC5ibG9jaygndGVybWluYWwnLCBbIHgtcGFkZGluZyooaS0yKSozLCBsb2MuQUNfZGlzYy5zd2l0Y2hfdG9wIF0gKTtcbiAgICAgICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbIHgtcGFkZGluZyooaS0yKSozLCBsb2MuQUNfZGlzYy5zd2l0Y2hfdG9wIF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeC1wYWRkaW5nKihpLTIpKjMsIGNvbmR1aXRfeS1icmVha2VyX3NwYWNpbmcqKGktMSkgXSxcbiAgICAgICAgICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy5sZWZ0LCBjb25kdWl0X3ktYnJlYWtlcl9zcGFjaW5nKihpLTEpIF0sXG4gICAgICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG5cblxuXG4vLyBXaXJlIHRhYmxlXG4gICAgZC5zZWN0aW9uKFwiV2lyZSB0YWJsZVwiKTtcblxuLy8vKlxuXG4gICAgeCA9IGxvYy53aXJlX3RhYmxlLng7XG4gICAgeSA9IGxvYy53aXJlX3RhYmxlLnk7XG5cbiAgICBpZiggc3lzdGVtLkFDLm51bV9jb25kdWN0b3JzICkge1xuICAgICAgICB2YXIgbl9yb3dzID0gMiArIHN5c3RlbS5BQy5udW1fY29uZHVjdG9ycztcbiAgICAgICAgdmFyIG5fY29scyA9IDY7XG4gICAgICAgIHZhciByb3dfaGVpZ2h0ID0gMTU7XG4gICAgICAgIHZhciBjb2x1bW5fd2lkdGggPSB7XG4gICAgICAgICAgICBudW1iZXI6IDI1LFxuICAgICAgICAgICAgY29uZHVjdG9yOiA1MCxcbiAgICAgICAgICAgIHdpcmVfZ2F1Z2U6IDI1LFxuICAgICAgICAgICAgd2lyZV90eXBlOiA3NSxcbiAgICAgICAgICAgIGNvbmR1aXRfc2l6ZTogMzUsXG4gICAgICAgICAgICBjb25kdWl0X3R5cGU6IDc1LFxuICAgICAgICB9O1xuXG4gICAgICAgIGggPSBuX3Jvd3Mqcm93X2hlaWdodDtcblxuICAgICAgICB2YXIgdCA9IGQudGFibGUobl9yb3dzLG5fY29scykubG9jKHgseSk7XG4gICAgICAgIHQucm93X3NpemUoJ2FsbCcsIHJvd19oZWlnaHQpXG4gICAgICAgICAgICAuY29sX3NpemUoMSwgY29sdW1uX3dpZHRoLm51bWJlcilcbiAgICAgICAgICAgIC5jb2xfc2l6ZSgyLCBjb2x1bW5fd2lkdGguY29uZHVjdG9yKVxuICAgICAgICAgICAgLmNvbF9zaXplKDMsIGNvbHVtbl93aWR0aC53aXJlX2dhdWdlKVxuICAgICAgICAgICAgLmNvbF9zaXplKDQsIGNvbHVtbl93aWR0aC53aXJlX3R5cGUpXG4gICAgICAgICAgICAuY29sX3NpemUoNSwgY29sdW1uX3dpZHRoLmNvbmR1aXRfc2l6ZSlcbiAgICAgICAgICAgIC5jb2xfc2l6ZSg2LCBjb2x1bW5fd2lkdGguY29uZHVpdF90eXBlKTtcblxuICAgICAgICB0LmFsbF9jZWxscygpLmZvckVhY2goZnVuY3Rpb24oY2VsbCl7XG4gICAgICAgICAgICBjZWxsLmZvbnQoJ3RhYmxlJykuYm9yZGVyKCdhbGwnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHQuY2VsbCgxLDEpLmJvcmRlcignQicsIGZhbHNlKTtcbiAgICAgICAgdC5jZWxsKDEsMykuYm9yZGVyKCdSJywgZmFsc2UpO1xuICAgICAgICB0LmNlbGwoMSw1KS5ib3JkZXIoJ1InLCBmYWxzZSk7XG5cbiAgICAgICAgdC5jZWxsKDEsMykuZm9udCgndGFibGVfbGVmdCcpLnRleHQoJ1dpcmUnKTtcbiAgICAgICAgdC5jZWxsKDEsNSkuZm9udCgndGFibGVfbGVmdCcpLnRleHQoJ0NvbmR1aXQnKTtcblxuICAgICAgICB0LmNlbGwoMiwzKS5mb250KCd0YWJsZScpLnRleHQoJ0NvbmR1Y3RvcnMnKTtcbiAgICAgICAgdC5jZWxsKDIsMykuZm9udCgndGFibGUnKS50ZXh0KCdBV0cnKTtcbiAgICAgICAgdC5jZWxsKDIsNCkuZm9udCgndGFibGUnKS50ZXh0KCdUeXBlJyk7XG4gICAgICAgIHQuY2VsbCgyLDUpLmZvbnQoJ3RhYmxlJykudGV4dCgnU2l6ZScpO1xuICAgICAgICB0LmNlbGwoMiw2KS5mb250KCd0YWJsZScpLnRleHQoJ1R5cGUnKTtcblxuICAgICAgICBmb3IoIGk9MTsgaTw9c3lzdGVtLkFDLm51bV9jb25kdWN0b3JzOyBpKyspe1xuICAgICAgICAgICAgdC5jZWxsKDIraSwxKS5mb250KCd0YWJsZScpLnRleHQoaS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIHQuY2VsbCgyK2ksMikuZm9udCgndGFibGVfbGVmdCcpLnRleHQoIGYucHJldHR5X3dvcmQoc2V0dGluZ3Muc3lzdGVtLkFDLmNvbmR1Y3RvcnNbaS0xXSkgKTtcblxuICAgICAgICB9XG5cblxuICAgICAgICAvL2QudGV4dCggW3grdy8yLCB5LXJvd19oZWlnaHRdLCBmLnByZXR0eV9uYW1lKHNlY3Rpb25fbmFtZSksJ3RhYmxlJyApO1xuXG5cbiAgICAgICAgdC5taygpO1xuXG4gICAgfVxuXG4vLyovXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4vLyB2b2x0YWdlIGRyb3BcbiAgICBkLnNlY3Rpb24oXCJ2b2x0YWdlIGRyb3BcIik7XG5cblxuICAgIHggPSBsb2Mudm9sdF9kcm9wX3RhYmxlLng7XG4gICAgeSA9IGxvYy52b2x0X2Ryb3BfdGFibGUueTtcbiAgICB3ID0gc2l6ZS52b2x0X2Ryb3BfdGFibGUudztcbiAgICBoID0gc2l6ZS52b2x0X2Ryb3BfdGFibGUuaDtcblxuICAgIGQubGF5ZXIoJ3RhYmxlJyk7XG4gICAgZC5yZWN0KCBbeCx5XSwgW3csaF0gKTtcblxuICAgIHkgLT0gaC8yO1xuICAgIHkgKz0gMTA7XG5cbiAgICBkLnRleHQoIFt4LHldLCAnVm9sdGFnZSBEcm9wJywgJ3RleHQnLCAndGFibGUnKTtcblxuXG4vLyBnZW5lcmFsIG5vdGVzXG4gICAgZC5zZWN0aW9uKFwiZ2VuZXJhbCBub3Rlc1wiKTtcblxuICAgIHggPSBsb2MuZ2VuZXJhbF9ub3Rlcy54O1xuICAgIHkgPSBsb2MuZ2VuZXJhbF9ub3Rlcy55O1xuICAgIHcgPSBzaXplLmdlbmVyYWxfbm90ZXMudztcbiAgICBoID0gc2l6ZS5nZW5lcmFsX25vdGVzLmg7XG5cbiAgICBkLmxheWVyKCd0YWJsZScpO1xuICAgIGQucmVjdCggW3gseV0sIFt3LGhdICk7XG5cbiAgICB5IC09IGgvMjtcbiAgICB5ICs9IDEwO1xuXG4gICAgZC50ZXh0KCBbeCx5XSwgJ0dlbmVyYWwgTm90ZXMnLCAndGV4dCcsICd0YWJsZScpO1xuXG5cbiAgICBkLnNlY3Rpb24oKTtcblxuICAgIHJldHVybiBkLmRyYXdpbmdfcGFydHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuIiwidmFyIG1rX2RyYXdpbmcgPSByZXF1aXJlKCcuLi9ta19kcmF3aW5nJyk7XG52YXIgbWtfYm9yZGVyID0gcmVxdWlyZSgnLi4vbWtfYm9yZGVyJyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIHZhciBmID0gc2V0dGluZ3MuZjtcblxuICAgIGQgPSBta19kcmF3aW5nKHNldHRpbmdzKTtcblxuICAgIHZhciBzaGVldF9zZWN0aW9uID0gJ1BWJztcbiAgICB2YXIgc2hlZXRfbnVtID0gJzAyJztcbiAgICAvL2QuYXBwZW5kKG1rX2JvcmRlcihzZXR0aW5ncywgc2hlZXRfc2VjdGlvbiwgc2hlZXRfbnVtICkpO1xuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuXG5cbiAgICBkLnRleHQoXG4gICAgICAgIFtzaXplLmRyYXdpbmcudy8yLCBzaXplLmRyYXdpbmcuaC8yXSxcbiAgICAgICAgJ0NhbGN1bGF0aW9uIFNoZWV0JyxcbiAgICAgICAgJ3RleHQnLFxuICAgICAgICAndGl0bGUyJ1xuICAgICk7XG5cblxuICAgIHggPSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyo2O1xuICAgIHkgPSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyo2ICsyMDtcblxuICAgIGQubGF5ZXIoJ3RhYmxlJyk7XG5cblxuICAgIGZvciggdmFyIHNlY3Rpb25fbmFtZSBpbiBzZXR0aW5ncy5zeXN0ZW0gKXtcbiAgICAgICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKHNldHRpbmdzLCBzZWN0aW9uX25hbWUpICl7XG4gICAgICAgICAgICB2YXIgc2VjdGlvbiA9IHNldHRpbmdzLnN5c3RlbVtzZWN0aW9uX25hbWVdO1xuXG4gICAgICAgICAgICB2YXIgbiA9IE9iamVjdC5rZXlzKHNlY3Rpb24pLmxlbmd0aDtcblxuICAgICAgICAgICAgdmFyIG5fcm93cyA9IG4rMDtcbiAgICAgICAgICAgIHZhciBuX2NvbHMgPSAyO1xuXG4gICAgICAgICAgICB2YXIgcm93X2hlaWdodCA9IDE1O1xuICAgICAgICAgICAgaCA9IG5fcm93cypyb3dfaGVpZ2h0O1xuXG5cbiAgICAgICAgICAgIHZhciB0ID0gZC50YWJsZShuX3Jvd3Msbl9jb2xzKS5sb2MoeCx5KTtcbiAgICAgICAgICAgIHQucm93X3NpemUoJ2FsbCcsIHJvd19oZWlnaHQpLmNvbF9zaXplKDEsIDEwMCkuY29sX3NpemUoMiwgMTI1KTtcbiAgICAgICAgICAgIHcgPSAxMDArODA7XG5cbiAgICAgICAgICAgIHZhciByID0gMTtcbiAgICAgICAgICAgIHZhciB2YWx1ZTtcbiAgICAgICAgICAgIGZvciggdmFyIHZhbHVlX25hbWUgaW4gc2VjdGlvbiApe1xuICAgICAgICAgICAgICAgIHQuY2VsbChyLDEpLnRleHQoIGYucHJldHR5X25hbWUodmFsdWVfbmFtZSkgKTtcbiAgICAgICAgICAgICAgICBpZiggISBzZWN0aW9uW3ZhbHVlX25hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gJy0nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiggc2VjdGlvblt2YWx1ZV9uYW1lXS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkgKXtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBzZWN0aW9uW3ZhbHVlX25hbWVdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKCBzZWN0aW9uW3ZhbHVlX25hbWVdLmNvbnN0cnVjdG9yID09PSBPYmplY3QgKXtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSAnKCApJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoIGlzTmFOKHNlY3Rpb25bdmFsdWVfbmFtZV0pICl7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gc2VjdGlvblt2YWx1ZV9uYW1lXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQoc2VjdGlvblt2YWx1ZV9uYW1lXSkudG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdC5jZWxsKHIsMikudGV4dCggdmFsdWUgKTtcbiAgICAgICAgICAgICAgICByKys7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZC50ZXh0KCBbeCt3LzIsIHktcm93X2hlaWdodF0sIGYucHJldHR5X25hbWUoc2VjdGlvbl9uYW1lKSwndGFibGUnICk7XG5cblxuXG5cbiAgICAgICAgICAgIHQuYWxsX2NlbGxzKCkuZm9yRWFjaChmdW5jdGlvbihjZWxsKXtcbiAgICAgICAgICAgICAgICBjZWxsLmZvbnQoJ3RhYmxlJykuYm9yZGVyKCdhbGwnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0Lm1rKCk7XG5cbiAgICAgICAgICAgIC8vKi9cbiAgICAgICAgICAgIHkgKz0gaCArIDMwO1xuXG4gICAgICAgICAgICBpZiggeSA+ICggc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcuaCAqIDAuOCApICkge1xuICAgICAgICAgICAgICAgIHkgPVxuICAgICAgICAgICAgICAgICAgICB5ID0gc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmcqNiArMjA7XG4gICAgICAgICAgICAgICAgICAgIHggKz0gdyoxLjU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnbm90IGRlZmluZWQ6ICcsIHNlY3Rpb25fbmFtZSwgc2VjdGlvbik7XG4gICAgICAgIH1cblxuXG5cblxuICAgIH1cblxuICAgIGQubGF5ZXIoKTtcblxuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgbWtfcGFnZSA9IHJlcXVpcmUoJy4vbWtfcGFnZScpO1xuXG52YXIgcHJvY2VzcyA9IGZ1bmN0aW9uKHNldHRpbmdzKSB7XG4gICAgdmFyIGYgPSBzZXR0aW5ncy5mO1xuXG4gICAgLy9jb3B5IGlucHV0cyBmcm9tIHNldHRpbmdzLmlucHV0IHRvIHNldHRpbmdzLnN5c3RlbS5cbiAgICBmLm1lcmdlX29iamVjdHMoc2V0dGluZ3MudXNlcl9pbnB1dCwgc2V0dGluZ3Muc3lzdGVtKTtcblxuXG4gICAgLy9jb25zb2xlLmxvZygnLS0tc2V0dGluZ3MtLS0nLCBzZXR0aW5ncyk7XG4gICAgdmFyIGNvbmZpZ19vcHRpb25zID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnM7XG4gICAgdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIHN0YXRlID0gc2V0dGluZ3Muc3RhdGU7XG5cbiAgICB2YXIgaW5wdXRzID0gc2V0dGluZ3MuaW5wdXRzO1xuXG5cblxuLy8gVXBkYXRlIHNldHRpbmdzIGFuZCBjYWxjdWxhdGlvbnNcblxuICAgIGlmKCBzdGF0ZS5kYXRhYmFzZV9sb2FkZWQgKXtcbiAgICAgICAgaW5wdXRzLkRDID0gc2V0dGluZ3MuaW5wdXRzLkRDIHx8IHt9O1xuICAgICAgICBpbnB1dHMuREMud2lyZV9zaXplID0gc2V0dGluZ3MuaW5wdXRzLkRDLndpcmVfc2l6ZSB8fCB7fTtcbiAgICAgICAgaW5wdXRzLkRDLndpcmVfc2l6ZS5vcHRpb25zID0gaW5wdXRzLkRDLndpcmVfc2l6ZS5vcHRpb25zIHx8IGYub2JqX25hbWVzKHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLk5FQ190YWJsZXNbJ0NoIDkgVGFibGUgOCBDb25kdWN0b3IgUHJvcGVydGllcyddKTtcblxuXG4gICAgfVxuXG5cblxuICAgIC8vY29uc29sZS5sb2coXCJwcm9jZXNzXCIpO1xuICAgIC8vY29uc29sZS5sb2coc3lzdGVtLm1vZHVsZS5tYWtlKTtcblxuICAgIGlucHV0cy5tb2R1bGUubWFrZS5vcHRpb25zID0gZi5vYmpfbmFtZXMoc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzKTtcbiAgICBpZiggc3lzdGVtLm1vZHVsZS5tYWtlICkge1xuICAgICAgICBpbnB1dHMubW9kdWxlLm1vZGVsLm9wdGlvbnMgID0gZi5vYmpfbmFtZXMoIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tzeXN0ZW0ubW9kdWxlLm1ha2VdICk7XG4gICAgfVxuXG4gICAgaWYoIHN5c3RlbS5tb2R1bGUubW9kZWwgKSB7XG4gICAgICAgIHZhciBzcGVjcyA9IHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tzeXN0ZW0ubW9kdWxlLm1ha2VdW3N5c3RlbS5tb2R1bGUubW9kZWxdO1xuICAgICAgICBmb3IoIHZhciBzcGVjX25hbWUgaW4gc3BlY3MgKXtcbiAgICAgICAgICAgIGlmKCBzcGVjX25hbWUgIT09ICdtb2R1bGVfaWQnICl7XG4gICAgICAgICAgICAgICAgc3lzdGVtLm1vZHVsZVtzcGVjX25hbWVdID0gc3BlY3Nbc3BlY19uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL3N5c3RlbS5tb2R1bGUuc3BlY3MgPSBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbc3lzdGVtLm1vZHVsZS5tYWtlXVtzeXN0ZW0ubW9kdWxlLm1vZGVsXTtcbiAgICB9XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdhcnJheScpICYmIGYuc2VjdGlvbl9kZWZpbmVkKHNldHRpbmdzLCAnbW9kdWxlJykgKXtcbiAgICAgICAgc3lzdGVtLmFycmF5ID0gc3lzdGVtLmFycmF5IHx8IHt9O1xuICAgICAgICBzeXN0ZW0uYXJyYXkuaXNjID0gc3lzdGVtLm1vZHVsZS5pc2MgKiBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3M7XG4gICAgICAgIHN5c3RlbS5hcnJheS52b2MgPSBzeXN0ZW0ubW9kdWxlLnZvYyAqIHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmc7XG4gICAgICAgIHN5c3RlbS5hcnJheS5pbXAgPSBzeXN0ZW0ubW9kdWxlLmltcCAqIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncztcbiAgICAgICAgc3lzdGVtLmFycmF5LnZtcCA9IHN5c3RlbS5tb2R1bGUudm1wICogc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZztcbiAgICAgICAgc3lzdGVtLmFycmF5LnBtcCA9IHN5c3RlbS5hcnJheS52bXAgICogc3lzdGVtLmFycmF5LmltcDtcblxuICAgICAgICBzeXN0ZW0uYXJyYXkubnVtYmVyX29mX21vZHVsZXMgPSBzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nICogc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzO1xuXG5cbiAgICB9XG5cblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZChzZXR0aW5ncywgJ0RDJykgKXtcblxuICAgICAgICBzeXN0ZW0uREMud2lyZV9zaXplID0gXCItVW5kZWZpbmVkLVwiO1xuXG4gICAgfVxuXG4gICAgaW5wdXRzLmludmVydGVyLm1ha2Uub3B0aW9ucyA9IGYub2JqX25hbWVzKHNldHRpbmdzLmNvbXBvbmVudHMuaW52ZXJ0ZXJzKTtcbiAgICBpZiggc3lzdGVtLmludmVydGVyLm1ha2UgKSB7XG4gICAgICAgIGlucHV0cy5pbnZlcnRlci5tb2RlbC5vcHRpb25zID0gZi5vYmpfbmFtZXMoIHNldHRpbmdzLmNvbXBvbmVudHMuaW52ZXJ0ZXJzW3N5c3RlbS5pbnZlcnRlci5tYWtlXSApO1xuICAgIH1cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdpbnZlcnRlcicpICl7XG5cbiAgICB9XG5cbiAgICAvL2lucHV0cy5BQy5sb2FkY2VudGVyX3R5cGUgPSBzZXR0aW5ncy5mLm9ial9uYW1lcyhpbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlcyk7XG4gICAgaWYoIHN5c3RlbS5BQy5sb2FkY2VudGVyX3R5cGVzICkge1xuICAgICAgICB2YXIgbG9hZGNlbnRlcl90eXBlID0gc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXM7XG4gICAgICAgIHZhciBBQ19vcHRpb25zID0gaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbbG9hZGNlbnRlcl90eXBlXTtcbiAgICAgICAgaW5wdXRzLkFDLnR5cGUub3B0aW9ucyA9IEFDX29wdGlvbnM7XG4gICAgICAgIC8vaW4ub3B0LkFDLnR5cGVzW2xvYWRjZW50ZXJfdHlwZV07XG5cbiAgICAgICAgLy9pbnB1dHMuQUNbJ3R5cGUnXSA9IGYub2JqX25hbWVzKCBzZXR0aW5ncy5pbi5vcHQuQUMudHlwZSApO1xuICAgIH1cbiAgICBpZiggc3lzdGVtLkFDLnR5cGUgKSB7XG4gICAgICAgIHN5c3RlbS5BQy5jb25kdWN0b3JzID0gc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzW3N5c3RlbS5BQy50eXBlXTtcbiAgICAgICAgc3lzdGVtLkFDLm51bV9jb25kdWN0b3JzID0gc3lzdGVtLkFDLmNvbmR1Y3RvcnMubGVuZ3RoO1xuXG4gICAgfVxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZChzZXR0aW5ncywgJ0FDJykgKXtcblxuICAgICAgICBzeXN0ZW0uQUMud2lyZV9zaXplID0gXCItVW5kZWZpbmVkLVwiO1xuICAgIH1cblxuICAgIHNpemUud2lyZV9vZmZzZXQubWF4ID0gc2l6ZS53aXJlX29mZnNldC5taW4gKyBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgKiBzaXplLndpcmVfb2Zmc2V0LmJhc2U7XG4gICAgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgPSBzaXplLndpcmVfb2Zmc2V0Lm1heCArIHNpemUud2lyZV9vZmZzZXQuYmFzZSoxO1xuICAgIGxvYy5hcnJheS5sZWZ0ID0gbG9jLmFycmF5LnJpZ2h0IC0gKCBzaXplLnN0cmluZy53ICogc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzICkgLSAoIHNpemUubW9kdWxlLmZyYW1lLncqMy80ICkgO1xuXG5cblxuXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKHNldHRpbmdzLCAnbG9jYXRpb24nKSApe1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdhZGRyZXNzIHJlYWR5Jyk7XG4gICAgICAgIC8vZi5yZXF1ZXN0X2dlb2NvZGUoKTtcbiAgICAgICAgc2V0dGluZ3MucGVybS5sb2NhdGlvbi5uZXdfYWRkcmVzcyA9IGZhbHNlO1xuICAgICAgICBmb3IoIHZhciBuYW1lIGluIHNldHRpbmdzLnN5c3RlbS5sb2NhdGlvbiApe1xuICAgICAgICAgICAgaWYoIHNldHRpbmdzLnN5c3RlbS5sb2NhdGlvbltuYW1lXSAhPT0gc2V0dGluZ3MucGVybS5sb2NhdGlvbltuYW1lXSl7XG4gICAgICAgICAgICAgICAgc2V0dGluZ3MucGVybS5sb2NhdGlvbi5uZXdfYWRkcmVzcyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXR0aW5ncy5wZXJtLmxvY2F0aW9uW25hbWVdID0gc2V0dGluZ3Muc3lzdGVtLmxvY2F0aW9uW25hbWVdO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuXG5cblxuLy8gVXBkYXRlIGRyYXdpbmdcblxuICAgIC8vIE1ha2UgYmxvY2tzXG4gICAgZi5ta19ibG9ja3Moc2V0dGluZ3MpO1xuXG5cbiAgICAvLyBNYWtlIGRyYXdpbmdcbiAgICB2YXIgaSwgcDtcblxuICAgIC8vIE5vdCBuZWVkZWQgb24gc2VydmVyXG4gICAgc2V0dGluZ3MuZHJhd2luZy5wcmV2aWV3X3BhcnRzID0ge307XG4gICAgc2V0dGluZ3MuZHJhd2luZy5wcmV2aWV3X3N2Z3MgPSB7fTtcbiAgICBmb3IoIHAgaW4gZi5ta19wcmV2aWV3ICl7ICAvLyBmLm1rX3BhZ2UgaXMgYSBhcnJheSBvZiBwYWdlIG1ha2luZyBmdW5jdGlvbnMsIHNvIHRoaXMgd2lsbCBsb29wIHRocm91Z2ggdGhlIG51bWJlciBvZiBwYWdlc1xuICAgICAgICBzZXR0aW5ncy5kcmF3aW5nLnByZXZpZXdfcGFydHNbcF0gPSBmLm1rX3ByZXZpZXdbcF0oc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIHNldHRpbmdzLmRyYXdpbmcucGFydHMgPSB7fTtcbiAgICBzZXR0aW5ncy5kcmF3aW5nLnN2Z3MgPSB7fTtcbiAgICBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNoZWV0cy5mb3JFYWNoKGZ1bmN0aW9uKHNoZWV0X2luZm8sIGkpe1xuICAgICAgICBwID0gaSsxO1xuICAgICAgICBzZXR0aW5ncy5kcmF3aW5nLnBhcnRzW3BdID0gbWtfcGFnZShzZXR0aW5ncywgc2hlZXRfaW5mbyk7XG4vLyAgICAgICAgc2V0dGluZ3MuZHJhd2luZy5wYXJ0c1twXSA9IGYubWtfcGFnZVtwXShzZXR0aW5ncyk7XG5cbiAgICB9KTtcblxufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcHJvY2VzcztcbiIsIid1c2Ugc3RyaWN0JztcblxuXG52YXIgc2V0dGluZ3NfZGV2X2RlZmF1bHRzID0gZnVuY3Rpb24oc2V0dGluZ3MpIHtcbiAgICBjb25zb2xlLmxvZygnRGV2IG1vZGUgLSBkZWZhdWx0cyBvbicpO1xuXG4gICAgLy9jb25zb2xlLmxvZygnLS0tc2V0dGluZ3MtLS0nLCBzZXR0aW5ncyk7XG4gICAgdmFyIGNvbmZpZ19vcHRpb25zID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnM7XG4gICAgdmFyIGlucHV0cyA9IHNldHRpbmdzLmlucHV0cztcbiAgICB2YXIgdXNlcl9pbnB1dCA9IHNldHRpbmdzLnVzZXJfaW5wdXQ7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgIHZhciBzdGF0ZSA9IHNldHRpbmdzLnN0YXRlO1xuXG4gICAgaWYoIHN0YXRlLmRhdGFiYXNlX2xvYWRlZCApe1xuICAgICAgICBpbnB1dHMuREMgPSBzZXR0aW5ncy5pbnB1dHMuREMgfHwge307XG4gICAgICAgIGlucHV0cy5EQy53aXJlX3NpemUgPSBzZXR0aW5ncy5pbnB1dHMuREMud2lyZV9zaXplIHx8IHt9O1xuICAgICAgICBpbnB1dHMuREMud2lyZV9zaXplLm9wdGlvbnMgPSBpbnB1dHMuREMud2lyZV9zaXplLm9wdGlvbnMgfHwgZy5mLm9ial9uYW1lcyhzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5ORUNfdGFibGVzWydDaCA5IFRhYmxlIDggQ29uZHVjdG9yIFByb3BlcnRpZXMnXSk7XG5cblxuICAgIH1cblxuICAgIHVzZXJfaW5wdXQuYXJyYXkubnVtX3N0cmluZ3MgPSB1c2VyX2lucHV0LmFycmF5Lm51bV9zdHJpbmdzIHx8IDQ7XG4gICAgdXNlcl9pbnB1dC5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgPSB1c2VyX2lucHV0LmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZyB8fCA2O1xuICAgIHVzZXJfaW5wdXQuREMuaG9tZV9ydW5fbGVuZ3RoID0gdXNlcl9pbnB1dC5EQy5ob21lX3J1bl9sZW5ndGggfHwgNTA7XG5cbiAgICB1c2VyX2lucHV0LnJvb2Yud2lkdGggID0gdXNlcl9pbnB1dC5yb29mLndpZHRoIHx8IDYwO1xuICAgIHVzZXJfaW5wdXQucm9vZi5sZW5ndGggPSB1c2VyX2lucHV0LnJvb2YubGVuZ3RoIHx8IDI1O1xuICAgIHVzZXJfaW5wdXQucm9vZi5zbG9wZSAgPSB1c2VyX2lucHV0LnJvb2Yuc2xvcGUgfHwgXCI2OjEyXCI7XG4gICAgdXNlcl9pbnB1dC5yb29mLnR5cGUgICA9IHVzZXJfaW5wdXQucm9vZi50eXBlIHx8IFwiR2FibGVcIjtcblxuICAgIHVzZXJfaW5wdXQuaW52ZXJ0ZXIubG9jYXRpb24gPSB1c2VyX2lucHV0LmludmVydGVyLmxvY2F0aW9uICB8fCBcIkluc2lkZVwiO1xuXG4gICAgdXNlcl9pbnB1dC5tb2R1bGUub3JpZW50YXRpb24gPSB1c2VyX2lucHV0Lm1vZHVsZS5vcmllbnRhdGlvbiB8fCBcIlBvcnRyYWl0XCI7XG5cbiAgICB1c2VyX2lucHV0LmxvY2F0aW9uLmFkZHJlc3MgPSB1c2VyX2lucHV0LmxvY2F0aW9uLmFkZHJlc3MgfHwgJzE2NzkgQ2xlYXJsYWtlIFJvYWQnO1xuICAgIHVzZXJfaW5wdXQubG9jYXRpb24uY2l0eSAgICA9IHVzZXJfaW5wdXQubG9jYXRpb24uY2l0eSB8fCAnQ29jb2EnO1xuICAgIHVzZXJfaW5wdXQubG9jYXRpb24uemlwICAgICA9IHVzZXJfaW5wdXQubG9jYXRpb24uemlwIHx8ICczMjkyMic7XG4gICAgdXNlcl9pbnB1dC5sb2NhdGlvbi5jb3VudHkgICA9IHVzZXJfaW5wdXQubG9jYXRpb24uY291bnR5IHx8ICdCcmV2YXJkJztcblxuXG4gICAgaWYoIHN0YXRlLmRhdGFiYXNlX2xvYWRlZCApe1xuXG4gICAgICAgIHVzZXJfaW5wdXQubW9kdWxlLm1ha2UgPSB1c2VyX2lucHV0Lm1vZHVsZS5tYWtlIHx8XG4gICAgICAgICAgICBnLmYub2JqX25hbWVzKCBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXMgKVswXTtcbiAgICAgICAgdXNlcl9pbnB1dC5tb2R1bGUubW9kZWwgPSB1c2VyX2lucHV0Lm1vZHVsZS5tb2RlbCB8fFxuICAgICAgICAgICAgZy5mLm9ial9uYW1lcyggc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzW3VzZXJfaW5wdXQubW9kdWxlLm1ha2VdIClbMF07XG5cbiAgICAgICAgdXNlcl9pbnB1dC5pbnZlcnRlci5tYWtlID0gdXNlcl9pbnB1dC5pbnZlcnRlci5tYWtlIHx8XG4gICAgICAgICAgICBnLmYub2JqX25hbWVzKCBzZXR0aW5ncy5jb21wb25lbnRzLmludmVydGVycyApWzBdO1xuICAgICAgICB1c2VyX2lucHV0LmludmVydGVyLm1vZGVsID0gdXNlcl9pbnB1dC5pbnZlcnRlci5tb2RlbCB8fFxuICAgICAgICAgICAgZy5mLm9ial9uYW1lcyggc2V0dGluZ3MuY29tcG9uZW50cy5pbnZlcnRlcnNbdXNlcl9pbnB1dC5pbnZlcnRlci5tYWtlXSApWzBdO1xuXG5cbiAgICAgICAgdXNlcl9pbnB1dC5BQy5sb2FkY2VudGVyX3R5cGVzID0gdXNlcl9pbnB1dC5BQy5sb2FkY2VudGVyX3R5cGVzIHx8XG4gICAgICAgIC8vICAgIGcuZi5vYmpfbmFtZXMoaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXMpWzBdO1xuICAgICAgICAgICAgJzQ4MC8yNzdWJztcblxuXG4gICAgICAgIHVzZXJfaW5wdXQuQUMudHlwZSA9IHVzZXJfaW5wdXQuQUMudHlwZSB8fCAnNDgwViBXeWUnO1xuICAgICAgICAvL3N5c3RlbS5BQy50eXBlID0gdXNlcl9pbnB1dC5BQy50eXBlIHx8XG4gICAgICAgIC8vICAgIHVzZXJfaW5wdXQuQUMubG9hZGNlbnRlcl90eXBlc1tzeXN0ZW0uQUMubG9hZGNlbnRlcl90eXBlc11bMF07XG5cbiAgICAgICAgdXNlcl9pbnB1dC5BQy5kaXN0YW5jZV90b19sb2FkY2VudGVyID0gdXNlcl9pbnB1dC5BQy5kaXN0YW5jZV90b19sb2FkY2VudGVyIHx8XG4gICAgICAgICAgICA1MDtcblxuXG4gICAgICAgIHVzZXJfaW5wdXQuREMud2lyZV9zaXplID0gaW5wdXRzLkRDLndpcmVfc2l6ZS5vcHRpb25zWzNdO1xuICAgICAgICAvKlxuXG4gICAgICAgIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyTWFrZUFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVycyk7XG4gICAgICAgIHVzZXJfaW5wdXQuaW52ZXJ0ZXIubWFrZSA9IHVzZXJfaW5wdXQuaW52ZXJ0ZXIubWFrZSB8fCBPYmplY3Qua2V5cyggc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzIClbMF07XG4gICAgICAgIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyTW9kZWxBcnJheSA9IGsub2JqSWRBcnJheShzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnNbc3lzdGVtLmludmVydGVyLm1ha2VdKTtcblxuICAgICAgICB1c2VyX2lucHV0LkFDX2xvYWRjZW50ZXJfdHlwZSA9IHVzZXJfaW5wdXQuQUNfbG9hZGNlbnRlcl90eXBlIHx8IGNvbmZpZ19vcHRpb25zLkFDX2xvYWRjZW50ZXJfdHlwZV9vcHRpb25zWzBdO1xuICAgICAgICAvLyovXG5cblxuICAgICAgICB1c2VyX2lucHV0LmF0dGFjaG1lbnRfc3lzdGVtLm1ha2UgPSB1c2VyX2lucHV0LmF0dGFjaG1lbnRfc3lzdGVtLm1ha2UgfHxcbiAgICAgICAgICAgIGlucHV0cy5hdHRhY2htZW50X3N5c3RlbS5tYWtlLm9wdGlvbnNbMF07XG4gICAgICAgIHVzZXJfaW5wdXQuYXR0YWNobWVudF9zeXN0ZW0ubW9kZWwgPSB1c2VyX2lucHV0LmF0dGFjaG1lbnRfc3lzdGVtLm1vZGVsIHx8XG4gICAgICAgICAgICBpbnB1dHMuYXR0YWNobWVudF9zeXN0ZW0ubW9kZWwub3B0aW9uc1swXTtcblxuICAgIH1cblxuXG5cblxuXG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBzZXR0aW5nc19kZXZfZGVmYXVsdHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gc2V0dGluZ3NfZHJhd2luZyhzZXR0aW5ncyl7XG5cbiAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuICAgIHZhciBzdGF0dXMgPSBzZXR0aW5ncy5zdGF0dXM7XG5cbiAgICAvLyBEcmF3aW5nIHNwZWNpZmljXG4gICAgLy9zZXR0aW5ncy5kcmF3aW5nID0gc2V0dGluZ3MuZHJhd2luZyB8fCB7fTtcblxuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUgPSB7fTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2MgPSB7fTtcblxuXG4gICAgLy8gc2l6ZXNcbiAgICBzaXplLmRyYXdpbmcgPSB7XG4gICAgICAgIHc6IDEwMDAsXG4gICAgICAgIGg6IDc4MCxcbiAgICAgICAgZnJhbWVfcGFkZGluZzogNSxcbiAgICAgICAgdGl0bGVib3g6IHtcbiAgICAgICAgICAgIHNpZGU6IHtcbiAgICAgICAgICAgICAgICB3OiA4MCxcbiAgICAgICAgICAgICAgICBoOiA4MCozLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvdHRvbToge1xuICAgICAgICAgICAgICAgIGg6IDQwLFxuICAgICAgICAgICAgICAgIHc6IDY1MFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgc2l6ZS5tb2R1bGUgPSB7fTtcbiAgICBzaXplLm1vZHVsZS5mcmFtZSA9IHtcbiAgICAgICAgdzogMTAsXG4gICAgICAgIGg6IDMwLFxuICAgIH07XG4gICAgc2l6ZS5tb2R1bGUubGVhZCA9IHNpemUubW9kdWxlLmZyYW1lLncqMi8zO1xuICAgIHNpemUubW9kdWxlLmggPSBzaXplLm1vZHVsZS5mcmFtZS5oICsgc2l6ZS5tb2R1bGUubGVhZCoyO1xuICAgIHNpemUubW9kdWxlLncgPSBzaXplLm1vZHVsZS5mcmFtZS53O1xuXG4gICAgc2l6ZS53aXJlX29mZnNldCA9IHtcbiAgICAgICAgYmFzZTogNyxcbiAgICAgICAgZ2FwOiBzaXplLm1vZHVsZS53LFxuICAgIH07XG4gICAgc2l6ZS53aXJlX29mZnNldC5taW4gPSBzaXplLndpcmVfb2Zmc2V0LmJhc2UgKiAxO1xuXG4gICAgc2l6ZS5zdHJpbmcgPSB7fTtcbiAgICBzaXplLnN0cmluZy5nYXAgPSBzaXplLm1vZHVsZS5mcmFtZS53LzQyO1xuICAgIHNpemUuc3RyaW5nLmdhcF9taXNzaW5nID0gc2l6ZS5tb2R1bGUuaDtcbiAgICBzaXplLnN0cmluZy53ID0gc2l6ZS5tb2R1bGUuZnJhbWUudyAqIDIuNTtcblxuICAgIHNpemUudGVybWluYWxfZGlhbSA9IDU7XG4gICAgc2l6ZS5mdXNlID0ge307XG4gICAgc2l6ZS5mdXNlLncgPSAxNTtcbiAgICBzaXplLmZ1c2UuaCA9IDQ7XG5cblxuICAgIC8vIEludmVydGVyXG4gICAgc2l6ZS5pbnZlcnRlciA9IHsgdzogMjUwLCBoOiAxNTAgfTtcbiAgICBzaXplLmludmVydGVyLnRleHRfZ2FwID0gMTU7XG4gICAgc2l6ZS5pbnZlcnRlci5zeW1ib2xfdyA9IDUwO1xuICAgIHNpemUuaW52ZXJ0ZXIuc3ltYm9sX2ggPSAyNTtcblxuICAgIGxvYy5pbnZlcnRlciA9IHtcbiAgICAgICAgeDogc2l6ZS5kcmF3aW5nLncvMixcbiAgICAgICAgeTogc2l6ZS5kcmF3aW5nLmgvMyxcbiAgICB9O1xuICAgIGxvYy5pbnZlcnRlci5ib3R0b20gPSBsb2MuaW52ZXJ0ZXIueSArIHNpemUuaW52ZXJ0ZXIuaC8yO1xuICAgIGxvYy5pbnZlcnRlci50b3AgPSBsb2MuaW52ZXJ0ZXIueSAtIHNpemUuaW52ZXJ0ZXIuaC8yO1xuICAgIGxvYy5pbnZlcnRlci5ib3R0b21fcmlnaHQgPSB7XG4gICAgICAgIHg6IGxvYy5pbnZlcnRlci54ICsgc2l6ZS5pbnZlcnRlci53LzIsXG4gICAgICAgIHk6IGxvYy5pbnZlcnRlci55ICsgc2l6ZS5pbnZlcnRlci5oLzIsXG4gICAgfTtcblxuICAgIC8vIGFycmF5XG4gICAgbG9jLmFycmF5ID0ge1xuICAgICAgICB4OiBsb2MuaW52ZXJ0ZXIueCAtIDIwMCxcbiAgICAgICAgdXBwZXI6IGxvYy5pbnZlcnRlci55IC0gMjAsXG4gICAgfTtcbiAgICAvL2xvYy5hcnJheS51cHBlciA9IGxvYy5hcnJheS55IC0gc2l6ZS5zdHJpbmcuaC8yO1xuICAgIGxvYy5hcnJheS5yaWdodCA9IGxvYy5hcnJheS54IC0gc2l6ZS5tb2R1bGUuZnJhbWUuaCozO1xuXG5cblxuXG4gICAgbG9jLkRDID0gbG9jLmFycmF5O1xuXG4gICAgLy8gREMgamJcbiAgICBzaXplLmpiX2JveCA9IHtcbiAgICAgICAgaDogMTUwLFxuICAgICAgICB3OiA4MCxcbiAgICB9O1xuICAgIGxvYy5qYl9ib3ggPSB7XG4gICAgICAgIHg6IDM1MCxcbiAgICAgICAgeTogNTUwLFxuICAgIH07XG5cbiAgICAvLyBEQyBkaWNvbmVjdFxuICAgIHNpemUuZGlzY2JveCA9IHtcbiAgICAgICAgdzogMTQwLFxuICAgICAgICBoOiA1MCxcbiAgICB9O1xuICAgIGxvYy5kaXNjYm94ID0ge1xuICAgICAgICB4OiBsb2MuaW52ZXJ0ZXIueCAtIHNpemUuaW52ZXJ0ZXIudy8yICsgc2l6ZS5kaXNjYm94LncvMixcbiAgICAgICAgeTogbG9jLmludmVydGVyLnkgKyBzaXplLmludmVydGVyLmgvMiArIHNpemUuZGlzY2JveC5oLzIgKyAxMCxcbiAgICB9O1xuXG4gICAgLy8gQUMgZGljb25lY3RcbiAgICBzaXplLkFDX2Rpc2MgPSB7IHc6IDgwLCBoOiAxMjUgfTtcblxuICAgIGxvYy5BQ19kaXNjID0ge1xuICAgICAgICB4OiBsb2MuaW52ZXJ0ZXIueCsyMDAsXG4gICAgICAgIHk6IGxvYy5pbnZlcnRlci55KzI1MFxuICAgIH07XG4gICAgbG9jLkFDX2Rpc2MuYm90dG9tID0gbG9jLkFDX2Rpc2MueSArIHNpemUuQUNfZGlzYy5oLzI7XG4gICAgbG9jLkFDX2Rpc2MudG9wID0gbG9jLkFDX2Rpc2MueSAtIHNpemUuQUNfZGlzYy5oLzI7XG4gICAgbG9jLkFDX2Rpc2MubGVmdCA9IGxvYy5BQ19kaXNjLnggLSBzaXplLkFDX2Rpc2Mudy8yO1xuICAgIGxvYy5BQ19kaXNjLnN3aXRjaF90b3AgPSBsb2MuQUNfZGlzYy50b3AgKyAxNTtcbiAgICBsb2MuQUNfZGlzYy5zd2l0Y2hfYm90dG9tID0gbG9jLkFDX2Rpc2Muc3dpdGNoX3RvcCArIDMwO1xuXG5cbiAgICAvLyBBQyBwYW5lbFxuXG4gICAgbG9jLkFDX2xvYWRjZW50ZXIgPSB7XG4gICAgICAgIHg6IGxvYy5pbnZlcnRlci54KzM1MCxcbiAgICAgICAgeTogbG9jLmludmVydGVyLnkrMTAwXG4gICAgfTtcbiAgICBzaXplLkFDX2xvYWRjZW50ZXIgPSB7IHc6IDEyNSwgaDogMzAwIH07XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIubGVmdCA9IGxvYy5BQ19sb2FkY2VudGVyLnggLSBzaXplLkFDX2xvYWRjZW50ZXIudy8yO1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLnRvcCA9IGxvYy5BQ19sb2FkY2VudGVyLnkgLSBzaXplLkFDX2xvYWRjZW50ZXIuaC8yO1xuXG5cbiAgICBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlciA9IHsgdzogMjAsIGg6IHNpemUudGVybWluYWxfZGlhbSwgfTtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5icmVha2VycyA9IHtcbiAgICAgICAgbGVmdDogbG9jLkFDX2xvYWRjZW50ZXIueCAtICggc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIudyAqIDEuMSApLFxuICAgIH07XG4gICAgc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzID0ge1xuICAgICAgICBudW06IDIwLFxuICAgICAgICBzcGFjaW5nOiBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci5oICsgMSxcbiAgICB9O1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnRvcCA9IGxvYy5BQ19sb2FkY2VudGVyLnRvcCArIHNpemUuQUNfbG9hZGNlbnRlci5oLzU7XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMuYm90dG9tID0gbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMudG9wICsgc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnNwYWNpbmcqc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLm51bTtcblxuXG4gICAgc2l6ZS5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIgPSB7IHc6NSwgaDo0MCB9O1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIgPSB7XG4gICAgICAgIHg6IGxvYy5BQ19sb2FkY2VudGVyLmxlZnQgKyAyMCxcbiAgICAgICAgeTogbG9jLkFDX2xvYWRjZW50ZXIueSArIHNpemUuQUNfbG9hZGNlbnRlci5oKjAuM1xuICAgIH07XG5cbiAgICBzaXplLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyID0geyB3OjQwLCBoOjUgfTtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIgPSB7XG4gICAgICAgIHg6IGxvYy5BQ19sb2FkY2VudGVyLnggKyAxMCxcbiAgICAgICAgeTogbG9jLkFDX2xvYWRjZW50ZXIueSArIHNpemUuQUNfbG9hZGNlbnRlci5oKjAuNDVcbiAgICB9O1xuXG4gICAgbG9jLkFDX2NvbmR1aXQgPSB7XG4gICAgICAgIHk6IGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLmJvdHRvbSAtIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5zcGFjaW5nLzIsXG4gICAgfTtcblxuXG4gICAgLy8gd2lyZSB0YWJsZVxuICAgIGxvYy53aXJlX3RhYmxlID0ge1xuICAgICAgICB4OiBzaXplLmRyYXdpbmcudyAtIHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nKjMgLSAzMjUsXG4gICAgICAgIHk6IHNpemUuZHJhd2luZy5mcmFtZV9wYWRkaW5nKjMsXG4gICAgfTtcblxuICAgIC8vIHZvbHRhZ2UgZHJvcCB0YWJsZVxuICAgIHNpemUudm9sdF9kcm9wX3RhYmxlID0ge307XG4gICAgc2l6ZS52b2x0X2Ryb3BfdGFibGUudyA9IDE1MDtcbiAgICBzaXplLnZvbHRfZHJvcF90YWJsZS5oID0gMTAwO1xuICAgIGxvYy52b2x0X2Ryb3BfdGFibGUgPSB7fTtcbiAgICBsb2Mudm9sdF9kcm9wX3RhYmxlLnggPSBzaXplLmRyYXdpbmcudyAtIHNpemUudm9sdF9kcm9wX3RhYmxlLncvMiAtIDMwIC0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94LnNpZGUudztcbiAgICBsb2Mudm9sdF9kcm9wX3RhYmxlLnkgPSBzaXplLmRyYXdpbmcuaCAtIHNpemUudm9sdF9kcm9wX3RhYmxlLmgvMiAtIDMwIC0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94LmJvdHRvbS5oO1xuXG5cbiAgICAvLyB2b2x0YWdlIGRyb3AgdGFibGVcbiAgICBzaXplLmdlbmVyYWxfbm90ZXMgPSB7fTtcbiAgICBzaXplLmdlbmVyYWxfbm90ZXMudyA9IDE1MDtcbiAgICBzaXplLmdlbmVyYWxfbm90ZXMuaCA9IDEwMDtcbiAgICBsb2MuZ2VuZXJhbF9ub3RlcyA9IHt9O1xuICAgIGxvYy5nZW5lcmFsX25vdGVzLnggPSBzaXplLmdlbmVyYWxfbm90ZXMudy8yICsgMzA7XG4gICAgbG9jLmdlbmVyYWxfbm90ZXMueSA9IHNpemUuZ2VuZXJhbF9ub3Rlcy5oLzIgKyAzMDtcblxuXG5cblxuICAgIHNldHRpbmdzLnBhZ2VzID0ge307XG4gICAgc2V0dGluZ3MucGFnZXMubGV0dGVyID0ge1xuICAgICAgICB1bml0czogJ2luY2hlcycsXG4gICAgICAgIHc6IDExLjAsXG4gICAgICAgIGg6IDguNSxcbiAgICB9O1xuICAgIHNldHRpbmdzLnBhZ2UgPSBzZXR0aW5ncy5wYWdlcy5sZXR0ZXI7XG5cbiAgICBzZXR0aW5ncy5wYWdlcy5QREYgPSB7XG4gICAgICAgIHc6IHNldHRpbmdzLnBhZ2UudyAqIDcyLFxuICAgICAgICBoOiBzZXR0aW5ncy5wYWdlLmggKiA3MixcbiAgICB9O1xuXG4gICAgc2V0dGluZ3MucGFnZXMuUERGLnNjYWxlID0ge1xuICAgICAgICB4OiBzZXR0aW5ncy5wYWdlcy5QREYudyAvIHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS5kcmF3aW5nLncsXG4gICAgICAgIHk6IHNldHRpbmdzLnBhZ2VzLlBERi5oIC8gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcuaCxcbiAgICB9O1xuXG4gICAgaWYoIHNldHRpbmdzLnBhZ2VzLlBERi5zY2FsZS54IDwgc2V0dGluZ3MucGFnZXMuUERGLnNjYWxlLnkgKSB7XG4gICAgICAgIHNldHRpbmdzLnBhZ2Uuc2NhbGUgPSBzZXR0aW5ncy5wYWdlcy5QREYuc2NhbGUueDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzZXR0aW5ncy5wYWdlLnNjYWxlID0gc2V0dGluZ3MucGFnZXMuUERGLnNjYWxlLnk7XG4gICAgfVxuXG5cbiAgICBsb2MucHJldmlldyA9IGxvYy5wcmV2aWV3IHx8IHt9O1xuICAgIGxvYy5wcmV2aWV3LmFycmF5ID0gbG9jLnByZXZpZXcuYXJyYXkgPSB7fTtcbiAgICBsb2MucHJldmlldy5hcnJheS50b3AgPSAxMDA7XG4gICAgbG9jLnByZXZpZXcuYXJyYXkubGVmdCA9IDUwO1xuXG4gICAgbG9jLnByZXZpZXcuREMgPSBsb2MucHJldmlldy5EQyA9IHt9O1xuICAgIGxvYy5wcmV2aWV3LmludmVydGVyID0gbG9jLnByZXZpZXcuaW52ZXJ0ZXIgPSB7fTtcbiAgICBsb2MucHJldmlldy5BQyA9IGxvYy5wcmV2aWV3LkFDID0ge307XG5cbiAgICBzaXplLnByZXZpZXcgPSBzaXplLnByZXZpZXcgfHwge307XG4gICAgc2l6ZS5wcmV2aWV3Lm1vZHVsZSA9IHtcbiAgICAgICAgdzogMTUsXG4gICAgICAgIGg6IDI1LFxuICAgIH07XG4gICAgc2l6ZS5wcmV2aWV3LkRDID0ge1xuICAgICAgICB3OiAzMCxcbiAgICAgICAgaDogNTAsXG4gICAgfTtcbiAgICBzaXplLnByZXZpZXcuaW52ZXJ0ZXIgPSB7XG4gICAgICAgIHc6IDE1MCxcbiAgICAgICAgaDogNzUsXG4gICAgfTtcbiAgICBzaXplLnByZXZpZXcuQUMgPSB7XG4gICAgICAgIHc6IDMwLFxuICAgICAgICBoOiA1MCxcbiAgICB9O1xuICAgIHNpemUucHJldmlldy5sb2FkY2VudGVyID0ge1xuICAgICAgICB3OiA1MCxcbiAgICAgICAgaDogMTAwLFxuICAgIH07XG5cblxuXG4gIHJldHVybiBzZXR0aW5ncztcblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gc2V0dGluZ3NfZHJhd2luZztcbiIsIi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9hc3NpZ25cbmlmICghT2JqZWN0LmFzc2lnbikge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoT2JqZWN0LCBcImFzc2lnblwiLCB7XG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiBmdW5jdGlvbih0YXJnZXQsIGZpcnN0U291cmNlKSB7XG4gICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgIGlmICh0YXJnZXQgPT09IHVuZGVmaW5lZCB8fCB0YXJnZXQgPT09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY29udmVydCBmaXJzdCBhcmd1bWVudCB0byBvYmplY3RcIik7XG4gICAgICB2YXIgdG8gPSBPYmplY3QodGFyZ2V0KTtcbiAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBuZXh0U291cmNlID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBpZiAobmV4dFNvdXJjZSA9PT0gdW5kZWZpbmVkIHx8IG5leHRTb3VyY2UgPT09IG51bGwpIGNvbnRpbnVlO1xuICAgICAgICB2YXIga2V5c0FycmF5ID0gT2JqZWN0LmtleXMoT2JqZWN0KG5leHRTb3VyY2UpKTtcbiAgICAgICAgZm9yICh2YXIgbmV4dEluZGV4ID0gMCwgbGVuID0ga2V5c0FycmF5Lmxlbmd0aDsgbmV4dEluZGV4IDwgbGVuOyBuZXh0SW5kZXgrKykge1xuICAgICAgICAgIHZhciBuZXh0S2V5ID0ga2V5c0FycmF5W25leHRJbmRleF07XG4gICAgICAgICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG5leHRTb3VyY2UsIG5leHRLZXkpO1xuICAgICAgICAgIGlmIChkZXNjICE9PSB1bmRlZmluZWQgJiYgZGVzYy5lbnVtZXJhYmxlKSB0b1tuZXh0S2V5XSA9IG5leHRTb3VyY2VbbmV4dEtleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0bztcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vL1xuLy8gZm9udHNcblxudmFyIGZvbnRzID0ge307XG5cbmZvbnRzWydiYXNlJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAxMCxcbiAgICAndGV4dC1hbmNob3InOiAgICdtaWRkbGUnLFxufTtcblxuZm9udHNbJ3NpZ25zJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICA1LFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ21pZGRsZScsXG59O1xuZm9udHNbJ2xhYmVsJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAxMixcbiAgICAndGV4dC1hbmNob3InOiAgICdtaWRkbGUnLFxufTtcbmZvbnRzWyd0aXRsZTEnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDE0LFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ2xlZnQnLFxufTtcbmZvbnRzWyd0aXRsZTInXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDEyLFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ2xlZnQnLFxufTtcbmZvbnRzWyd0aXRsZTMnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDEwLFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ2xlZnQnLFxufTtcbmZvbnRzWyd0aXRsZV9GU0VDJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICA4LFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ21pZGRsZScsXG59O1xuZm9udHNbJ2luc3RhbGxlcl9pbmZvJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICA2LFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ21pZGRsZScsXG59O1xuZm9udHNbJ3NoZWV0X251bSddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTYsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5mb250c1sndGFibGUnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnc2VyaWYnLFxuICAgICdmb250LXNpemUnOiAgICAgOCxcbiAgICAndGV4dC1hbmNob3InOiAgICdtaWRkbGUnLFxufTtcbmZvbnRzWyd0YWJsZV9sZWZ0J10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ3NlcmlmJyxcbiAgICAnZm9udC1zaXplJzogICAgIDgsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbGVmdCcsXG59O1xuZm9udHNbJ3RhYmxlX2xhcmdlX2xlZnQnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDE0LFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ2xlZnQnLFxufTtcbmZvbnRzWyd0YWJsZV9sYXJnZSddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTQsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5mb250c1sncHJvamVjdCB0aXRsZSddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTYsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5mb250c1sncHJldmlldyB0ZXh0J10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZScgIDogMjAsXG4gICAgJ3RleHQtYW5jaG9yJzogJ21pZGRsZScsXG59O1xuZm9udHNbJ2RpbWVudGlvbiddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnICA6IDIwLFxuICAgICd0ZXh0LWFuY2hvcic6ICdtaWRkbGUnLFxufTtcblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvbnRzO1xuIiwiLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnblxuaWYgKCFPYmplY3QuYXNzaWduKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPYmplY3QsIFwiYXNzaWduXCIsIHtcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgdmFsdWU6IGZ1bmN0aW9uKHRhcmdldCwgZmlyc3RTb3VyY2UpIHtcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PT0gbnVsbClcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjb252ZXJ0IGZpcnN0IGFyZ3VtZW50IHRvIG9iamVjdFwiKTtcbiAgICAgIHZhciB0byA9IE9iamVjdCh0YXJnZXQpO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5leHRTb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGlmIChuZXh0U291cmNlID09PSB1bmRlZmluZWQgfHwgbmV4dFNvdXJjZSA9PT0gbnVsbCkgY29udGludWU7XG4gICAgICAgIHZhciBrZXlzQXJyYXkgPSBPYmplY3Qua2V5cyhPYmplY3QobmV4dFNvdXJjZSkpO1xuICAgICAgICBmb3IgKHZhciBuZXh0SW5kZXggPSAwLCBsZW4gPSBrZXlzQXJyYXkubGVuZ3RoOyBuZXh0SW5kZXggPCBsZW47IG5leHRJbmRleCsrKSB7XG4gICAgICAgICAgdmFyIG5leHRLZXkgPSBrZXlzQXJyYXlbbmV4dEluZGV4XTtcbiAgICAgICAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobmV4dFNvdXJjZSwgbmV4dEtleSk7XG4gICAgICAgICAgaWYgKGRlc2MgIT09IHVuZGVmaW5lZCAmJiBkZXNjLmVudW1lcmFibGUpIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRvO1xuICAgIH1cbiAgfSk7XG59XG5cblxudmFyIGxheWVyX2F0dHIgPSB7fTtcblxubGF5ZXJfYXR0ci5pbWFnZSA9IHt9O1xuXG5sYXllcl9hdHRyLmJhc2UgPSB7XG4gICAgJ2ZpbGwnOiAnbm9uZScsXG4gICAgJ3N0cm9rZSc6JyMwMDAwMDAnLFxuICAgICdzdHJva2Utd2lkdGgnOicxcHgnLFxuICAgICdzdHJva2UtbGluZWNhcCc6J2J1dHQnLFxuICAgICdzdHJva2UtbGluZWpvaW4nOidtaXRlcicsXG4gICAgJ3N0cm9rZS1vcGFjaXR5JzoxLFxuXG59O1xubGF5ZXJfYXR0ci5ibG9jayA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuZnJhbWUgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLmZyYW1lLnN0cm9rZSA9ICcjMDAwMDQyJztcbmxheWVyX2F0dHIudGFibGUgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLnRhYmxlLnN0cm9rZSA9ICcjMDAwMDAwJztcblxubGF5ZXJfYXR0ci5EQ19pbnRlcm1vZHVsZSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpLHtcbiAgICBzdHJva2U6ICcjYmViZWJlJyxcbiAgICBcInN0cm9rZS1kYXNoYXJyYXlcIjogXCIxLCAxXCIsXG5cblxufSk7XG5cbmxheWVyX2F0dHIuRENfcG9zID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5EQ19wb3Muc3Ryb2tlID0gJyNmZjAwMDAnO1xubGF5ZXJfYXR0ci5EQ19uZWcgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkRDX25lZy5zdHJva2UgPSAnIzAwMDAwMCc7XG5sYXllcl9hdHRyLkRDX2dyb3VuZCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuRENfZ3JvdW5kLnN0cm9rZSA9ICcjMDA2NjAwJztcbmxheWVyX2F0dHIubW9kdWxlID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5ib3ggPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5cblxuXG5sYXllcl9hdHRyLnRleHQgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLnRleHQuc3Ryb2tlID0gJyMwMDAwZmYnO1xubGF5ZXJfYXR0ci50ZXJtaW5hbCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcblxuXG5sYXllcl9hdHRyLkFDX2dyb3VuZCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuQUNfZ3JvdW5kLnN0cm9rZSA9ICcjMDA5OTAwJztcbmxheWVyX2F0dHIuQUNfbmV1dHJhbCA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuQUNfbmV1dHJhbC5zdHJva2UgPSAnIzk5OTc5Nyc7XG5sYXllcl9hdHRyLkFDX0wxID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5BQ19MMS5zdHJva2UgPSAnIzAwMDAwMCc7XG5sYXllcl9hdHRyLkFDX0wyID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5BQ19MMi5zdHJva2UgPSAnI0ZGMDAwMCc7XG5sYXllcl9hdHRyLkFDX0wzID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5BQ19MMy5zdHJva2UgPSAnIzAwMDBGRic7XG5cblxubGF5ZXJfYXR0ci5wcmV2aWV3ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSkse1xuICAgICdzdHJva2Utd2lkdGgnOiAnMicsXG59KTtcblxubGF5ZXJfYXR0ci5wcmV2aWV3X21vZHVsZSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnI2ZmYjMwMCcsXG4gICAgc3Ryb2tlOiAnbm9uZScsXG59KTtcblxubGF5ZXJfYXR0ci5wcmV2aWV3X2FycmF5ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIHN0cm9rZTogJyNmZjVkMDAnLFxufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19EQyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6ICcjYjA5MmM0Jyxcbn0pO1xubGF5ZXJfYXR0ci5wcmV2aWV3X0RDX2JveCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnI2IwOTJjNCcsXG4gICAgc3Ryb2tlOiAnbm9uZScsXG59KTtcblxubGF5ZXJfYXR0ci5wcmV2aWV3X2ludmVydGVyID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIHN0cm9rZTonIzg2Yzk3NCcsXG59KTtcbmxheWVyX2F0dHIucHJldmlld19pbnZlcnRlcl9ib3ggPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyM4NmM5NzQnLFxuICAgIHN0cm9rZTogJ25vbmUnLFxufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19BQyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6ICcjODE4OGExJyxcbn0pO1xuXG5sYXllcl9hdHRyLnByZXZpZXdfQUNfYm94ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjODE4OGExJyxcbiAgICBzdHJva2U6ICdub25lJyxcbn0pO1xuXG5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6ICcjMDAwMDAwJyxcbn0pO1xubGF5ZXJfYXR0ci5wcmV2aWV3X3N0cnVjdHVyYWxfZG90ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIHN0cm9rZTogJyMwMDAwMDAnLFxuICAgIFwic3Ryb2tlLWRhc2hhcnJheVwiOiBcIjUsIDVcIlxufSk7XG5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3Vuc2VsZWN0ZWQgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyNlMWUxZTEnLFxuICAgIHN0cm9rZTogJ25vbmUnXG59KTtcbmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX3BvbHlfc2VsZWN0ZWQgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyNmZmU3Y2InLFxuICAgIHN0cm9rZTogJ25vbmUnXG59KTtcbmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX3BvbHlfc2VsZWN0ZWRfZnJhbWVkID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjZmZlN2NiJyxcbiAgICBzdHJva2U6ICcjMDAwMDAwJ1xufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnI2ZmZmZmZicsXG4gICAgc3Ryb2tlOiAnbm9uZSdcbn0pO1xubGF5ZXJfYXR0ci5wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjODM5N2U4JyxcbiAgICBzdHJva2U6ICcjZGZmYWZmJ1xufSk7XG5cbmxheWVyX2F0dHIubm9ydGhfYXJyb3cgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgc3Ryb2tlOiAnIzAwMDAwMCcsXG4gICAgJ3N0cm9rZS13aWR0aCc6IDEsXG4gICAgJ3N0cm9rZS1saW5lY2FwJzogXCJyb3VuZFwiLFxuICAgICdzdHJva2UtbGluZWpvaW4nOiBcInJvdW5kXCIsXG59KTtcbmxheWVyX2F0dHIubm9ydGhfbGV0dGVyID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIHN0cm9rZTogJyM5NDk0OTQnLFxuICAgICdzdHJva2Utd2lkdGgnOiA1LFxuICAgICdzdHJva2UtbGluZWNhcCc6IFwicm91bmRcIixcbiAgICAnc3Ryb2tlLWxpbmVqb2luJzogXCJyb3VuZFwiLFxufSk7XG5cbmxheWVyX2F0dHIuZGltZW50aW9uID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIudGV4dCkse1xuICAgIHN0cm9rZTogJyMxNDMzZmUnLFxufSk7XG5cbmxheWVyX2F0dHIuYm9yZGVyID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xuXG5sYXllcl9hdHRyWydib3JkZXJfbGluZXMnXSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnRleHQpLHtcbiAgICBzdHJva2U6ICcjNzE3MTcxJyxcbn0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gbGF5ZXJfYXR0cjtcbiIsIlxuXG5cbmZ1bmN0aW9uIHNldHVwX3dlYnBhZ2UoKXtcbiAgICB2YXIgc2V0dGluZ3MgPSBnO1xuICAgIHZhciBmID0gZy5mO1xuXG4gICAgdmFyIHN5c3RlbV9mcmFtZV9pZCA9ICdzeXN0ZW1fZnJhbWUnO1xuICAgIHZhciB0aXRsZSA9ICdQViBkcmF3aW5nIHRlc3QnO1xuXG4gICAgZy5mLnNldHVwX2JvZHkodGl0bGUpO1xuXG4gICAgdmFyIHBhZ2UgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3BhZ2UnKS5hcHBlbmRUbygkKGRvY3VtZW50LmJvZHkpKTtcbiAgICAvL3BhZ2Uuc3R5bGUoJ3dpZHRoJywgKHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS5kcmF3aW5nLncrMjApLnRvU3RyaW5nKCkgKyAncHgnIClcblxuICAgIHZhciBzeXN0ZW1fZnJhbWUgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgc3lzdGVtX2ZyYW1lX2lkKS5hcHBlbmRUbyhwYWdlKTtcblxuXG4gICAgdmFyIGhlYWRlcl9jb250YWluZXIgPSAkKCc8ZGl2PicpLmFwcGVuZFRvKHN5c3RlbV9mcmFtZSk7XG4gICAgJCgnPGltZz4nKVxuICAgICAgICAuYXR0cignc3JjJywgJ2RhdGEvUGxhbnNNYWNoaW5lLnBuZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICd0aXRsZV9pbWFnZScpXG4gICAgICAgIC8vLmF0dHIoJ3dpZHRoJywgJzkwJScpXG4gICAgICAgIC5hcHBlbmRUbyhoZWFkZXJfY29udGFpbmVyKTtcbiAgICAkKCc8c3Bhbj4nKS5odG1sKCdQbGVhc2Ugc2VsZWN0IHlvdXIgc3lzdGVtIHNwZWMgYmVsb3cnKS5hdHRyKCdjbGFzcycsICdjYXRlZ29yeV90aXRsZScpLmFwcGVuZFRvKGhlYWRlcl9jb250YWluZXIpO1xuICAgICQoJzxzcGFuPicpLmh0bWwoJyB8ICcpLmFwcGVuZFRvKGhlYWRlcl9jb250YWluZXIpO1xuICAgIC8vJCgnPGlucHV0PicpLmF0dHIoJ3R5cGUnLCAnYnV0dG9uJykuYXR0cigndmFsdWUnLCAnY2xlYXIgc2VsZWN0aW9ucycpLmNsaWNrKHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQpLFxuICAgICQoJzxhPicpLmF0dHIoJ2hyZWYnLCAnamF2YXNjcmlwdDp3aW5kb3cubG9jYXRpb24ucmVsb2FkKCknKS5odG1sKCdjbGVhciBzZWxlY3Rpb25zJykuYXBwZW5kVG8oaGVhZGVyX2NvbnRhaW5lcik7XG5cblxuICAgIC8vIFN5c3RlbSBzZXR1cFxuICAgICQoJzxkaXY+JykuaHRtbCgnU3lzdGVtIFNldHVwJykuYXR0cignY2xhc3MnLCAnc2VjdGlvbl90aXRsZScpLmFwcGVuZFRvKHN5c3RlbV9mcmFtZSk7XG4gICAgdmFyIGNvbmZpZ19mcmFtZSA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAnY29uZmlnX2ZyYW1lJykuYXBwZW5kVG8oc3lzdGVtX2ZyYW1lKTtcblxuICAgIGcuZi5hZGRfc2VsZWN0b3JzKHNldHRpbmdzLCBjb25maWdfZnJhbWUpO1xuICAgIC8vY29uc29sZS5sb2coc2VjdGlvbl9zZWxlY3Rvcik7XG5cblxuXG4gICAgLy92YXIgbG9jYXRpb25fZHJhd2VyID0gJCgnI3NlY3Rpb25fbG9jYXRpb24nKS5jaGlsZHJlbignLmRyYXdlcicpLmNoaWxkcmVuKCcuZHJhd2VyX2NvbnRlbnQnKTtcbiAgICAvL2NvbnNvbGUubG9nKGxvY2F0aW9uX2RyYXdlcik7XG5cblxuICAgIHZhciBtYXBfZGl2ID0gJCgnPGRpdj4nKTtcbiAgICB2YXIgbWFwX2RyYXdlciA9IGYubWtfZHJhd2VyKCdtYXAnLG1hcF9kaXYpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLy5hcHBlbmRUbyhjb25maWdfZnJhbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLmluc2VydEFmdGVyKCAkKCcjc2VjdGlvbl9sb2NhdGlvbicpICk7XG4gICAgbWFwX2RyYXdlci5jaGlsZHJlbignLmRyYXdlcicpLmNoaWxkcmVuKCcuZHJhd2VyX2NvbnRlbnQnKS5zbGlkZVVwKCdmYXN0Jyk7XG5cblxuXG4gICAgdmFyIGxpc3RfZWxlbWVudCA9ICQoJzx1bD4nKS5hcHBlbmRUbyhtYXBfZGl2KTtcbiAgICAkKCc8bGk+JykuYXBwZW5kVG8obGlzdF9lbGVtZW50KS5hcHBlbmQoXG4gICAgICAgICQoJzxhPicpXG4gICAgICAgICAgICAudGV4dCgnV2luZCBab25lICcpXG4gICAgICAgICAgICAuYXR0cignaHJlZicsICdodHRwOi8vd2luZHNwZWVkLmF0Y291bmNpbC5vcmcvJylcbiAgICAgICAgICAgIC5hdHRyKCd0YXJnZXQnLCAnX2JsYW5rJylcbiAgICApO1xuICAgICQoJzxsaT4nKS5hcHBlbmRUbyhsaXN0X2VsZW1lbnQpLmFwcGVuZChcbiAgICAgICAgJCgnPGE+JylcbiAgICAgICAgICAgIC50ZXh0KCdDbGltYXRlIENvbmRpdGlvbnMnKVxuICAgICAgICAgICAgLmF0dHIoJ2hyZWYnLCAnaHR0cDovL3d3dy5zb2xhcmFiY3Mub3JnL2Fib3V0L3B1YmxpY2F0aW9ucy9yZXBvcnRzL2V4cGVkaXRlZC1wZXJtaXQvbWFwL2luZGV4Lmh0bWwnKVxuICAgICAgICAgICAgLmF0dHIoJ3RhcmdldCcsICdfYmxhbmsnKVxuICAgICk7XG5cblxuICAgIHZhciBnZW9jb2RlX2RpdiA9ICQoJzxkaXY+JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dlb2NvZGVfbGluZScpXG4gICAgICAgIC5hcHBlbmRUbyhtYXBfZGl2KTtcbiAgICAkKCc8YT4nKS5hcHBlbmRUbyhnZW9jb2RlX2RpdilcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dlb2NvZGVfYnV0dG9uJylcbiAgICAgICAgLnRleHQoJ0ZpbmQgbG9jYXRpb24gZnJvbSBhZGRyZXNzJylcbiAgICAgICAgLmF0dHIoJ2hyZWYnLCAnIycpXG4gICAgICAgIC5jbGljayhmLnJlcXVlc3RfZ2VvY29kZSk7XG4gICAgJCgnPHNwYW4+JykuYXBwZW5kVG8oZ2VvY29kZV9kaXYpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdnZW9jb2RlX2Rpc3BsYXknKVxuICAgICAgICAuYXR0cignaWQnLCdnZW9jb2RlX2Rpc3BsYXknKVxuICAgICAgICAudGV4dCgnJyk7XG5cbiAgICAkKCc8ZGl2PicpXG4gICAgICAgIC5hdHRyKCdpZCcsICdtYXBfcm9hZCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBfcm9hZCcpXG4gICAgICAgIC5hdHRyKCdzdHlsZScsICd3aWR0aDo0ODVweDtoZWlnaHQ6MzgwcHgnKVxuICAgICAgICAuYXBwZW5kVG8obWFwX2Rpdik7XG4gICAgJCgnPGRpdj4nKVxuICAgICAgICAuYXR0cignaWQnLCAnbWFwX3NhdCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBfc2F0JylcbiAgICAgICAgLmF0dHIoJ3N0eWxlJywgJ3dpZHRoOjQ4NXB4O2hlaWdodDozODBweCcpXG4gICAgICAgIC5hcHBlbmRUbyhtYXBfZGl2KTtcblxuXG4gICAgdmFyIGxhdF9mbF9jZW50ZXIgPSAyNy43NTtcbiAgICB2YXIgbG9uX2ZsX2NlbnRlciA9IC04NC4wO1xuXG4gICAgdmFyIGxhdCA9IDI4LjM4NzM5OTtcbiAgICB2YXIgbG9uID0gLTgwLjc1NzgzMztcbiAgICB2YXIgY29vciA9IFstODAuNzU3ODMzLCAyOC4zODczOTldO1xuXG4gICAgTC5Bd2Vzb21lTWFya2Vycy5JY29uLnByb3RvdHlwZS5vcHRpb25zLnByZWZpeCA9ICdmYSc7XG4gICAgdmFyIHN1bl9tYXJrZXIgPSBMLkF3ZXNvbWVNYXJrZXJzLmljb24oe1xuICAgICAgICBpY29uOiAnc3VuLW8nLFxuICAgICAgICBtYXJrZXJDb2xvcjogJ2JsdWUgICcsXG4gICAgICAgIGljb25Db2xvcjogJ3llbGxvdydcbiAgICB9KTtcblxuICAgIHZhciBtYXBfcm9hZCAgPSBnLnBlcm0ubWFwcy5tYXBfcm9hZCA9IEwubWFwKCAnbWFwX3JvYWQnLCB7XG4gICAgICAgIGNlbnRlcjogW2xhdF9mbF9jZW50ZXIsIGxvbl9mbF9jZW50ZXJdLFxuICAgICAgICB6b29tOiA2XG4gICAgfSk7XG5cbiAgICBMLnRpbGVMYXllciggJ2h0dHA6Ly97c30ubXFjZG4uY29tL3RpbGVzLzEuMC4wL21hcC97en0ve3h9L3t5fS5wbmcnLCB7XG4gICAgICAgIGF0dHJpYnV0aW9uOiAnJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vb3NtLm9yZy9jb3B5cmlnaHRcIiB0aXRsZT1cIk9wZW5TdHJlZXRNYXBcIiB0YXJnZXQ9XCJfYmxhbmtcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMgfCBUaWxlcyBDb3VydGVzeSBvZiA8YSBocmVmPVwiaHR0cDovL3d3dy5tYXBxdWVzdC5jb20vXCIgdGl0bGU9XCJNYXBRdWVzdFwiIHRhcmdldD1cIl9ibGFua1wiPk1hcFF1ZXN0PC9hPiA8aW1nIHNyYz1cImh0dHA6Ly9kZXZlbG9wZXIubWFwcXVlc3QuY29tL2NvbnRlbnQvb3NtL21xX2xvZ28ucG5nXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCI+JyxcbiAgICAgICAgc3ViZG9tYWluczogWydvdGlsZTEnLCdvdGlsZTInLCdvdGlsZTMnLCdvdGlsZTQnXVxuICAgIH0pLmFkZFRvKCBtYXBfcm9hZCApO1xuXG4gICAgZy5wZXJtLm1hcHMubWFya2VyX3JvYWQgPSBMLm1hcmtlcihbbGF0LGxvbl0sIHtpY29uOiBzdW5fbWFya2VyfSkuYWRkVG8obWFwX3JvYWQpO1xuXG4gICAgbWFwX3JvYWQub24oJ2NsaWNrJywgZi5zZXRfY29vcmRpbmF0ZXNfZnJvbV9tYXAgKTtcblxuXG5cblxuICAgIHZhciBtYXBfc2F0ID0gZy5wZXJtLm1hcHMubWFwX3NhdCA9IEwubWFwKCAnbWFwX3NhdCcsIHtcbiAgICAgICAgY2VudGVyOiBbbGF0LCBsb25dLFxuICAgICAgICB6b29tOiAxNlxuICAgIH0pO1xuICAgIEwudGlsZUxheWVyKCAnaHR0cDovL3tzfS5tcWNkbi5jb20vdGlsZXMvMS4wLjAvc2F0L3t6fS97eH0ve3l9LnBuZycsIHtcbiAgICAgICAgc3ViZG9tYWluczogWydvdGlsZTEnLCdvdGlsZTInLCdvdGlsZTMnLCdvdGlsZTQnXVxuICAgIH0pLmFkZFRvKCBtYXBfc2F0ICk7XG5cbiAgICBnLnBlcm0ubWFwcy5tYXJrZXJfc2F0ID0gTC5tYXJrZXIoW2xhdCxsb25dLCB7aWNvbjogc3VuX21hcmtlcn0pLmFkZFRvKG1hcF9zYXQpO1xuXG4gICAgbWFwX3NhdC5vbignY2xpY2snLCBmLnNldF9jb29yZGluYXRlc19mcm9tX21hcCApO1xuXG5cblxuXG5cblxuICAgIHZhciBkcmF3aW5nX3ByZXZpZXcgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2RyYXdpbmdfZnJhbWVfcHJldmlldycpLmFwcGVuZFRvKHBhZ2UpO1xuICAgICQoJzxkaXY+JykuaHRtbCgnUHJldmlldycpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25fdGl0bGUnKS5hcHBlbmRUbyhkcmF3aW5nX3ByZXZpZXcpO1xuICAgICQoJzxkaXY+JykuYXR0cignaWQnLCAnZHJhd2luZ19wcmV2aWV3JykuYXR0cignY2xhc3MnLCAnZHJhd2luZycpLmNzcygnY2xlYXInLCAnYm90aCcpLmFwcGVuZFRvKGRyYXdpbmdfcHJldmlldyk7XG5cblxuXG5cblxuICAgIHZhciBkcmF3aW5nX3NlY3Rpb24gPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2RyYXdpbmdfZnJhbWUnKS5hcHBlbmRUbyhwYWdlKTtcbiAgICAvL2RyYXdpbmcuY3NzKCd3aWR0aCcsIChzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy53KzIwKS50b1N0cmluZygpICsgJ3B4JyApO1xuICAgICQoJzxkaXY+JykuaHRtbCgnRHJhd2luZycpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25fdGl0bGUnKS5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pO1xuXG5cbiAgICAvLyQoJzxmb3JtIG1ldGhvZD1cImdldFwiIGFjdGlvbj1cImRhdGEvc2FtcGxlLnBkZlwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiPkRvd25sb2FkPC9idXR0b24+PC9mb3JtPicpLmFwcGVuZFRvKGRyYXdpbmdfc2VjdGlvbik7XG4gICAgLy8kKCc8c3Bhbj4nKS5hdHRyKCdpZCcsICdkb3dubG9hZCcpLmF0dHIoJ2NsYXNzJywgJ2Zsb2F0X3JpZ2h0JykuYXBwZW5kVG8oZHJhd2luZ19zZWN0aW9uKTtcbiAgICAkKCc8YT4nKVxuICAgICAgICAudGV4dCgnRG93bmxvYWQgRHJhd2luZyAoc2FtcGxlKScpXG4gICAgICAgIC5hdHRyKCdocmVmJywgJ3NhbXBsZV9wZGYvc2FtcGxlLnBkZicpXG4gICAgICAgIC5hdHRyKCdpZCcsICdkb3dubG9hZCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdidXR0b25fZmxvYXRfcmlnaHQnKVxuICAgICAgICAuYXR0cigndGFyZ2V0JywgJ19ibGFuaycpXG4gICAgICAgIC5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pO1xuICAgICQoJzxhPicpXG4gICAgICAgIC50ZXh0KCdEb3dubG9hZCBEcmF3aW5nIChuZXR3b3JrIHRlc3QsIG9uY2UpJylcbiAgICAgICAgLy8uYXR0cignaHJlZicsICcjJylcbiAgICAgICAgLmF0dHIoJ2lkJywgJ2Rvd25sb2FkJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2J1dHRvbl9mbG9hdF9yaWdodCcpXG4gICAgICAgIC8vLmF0dHIoJ3RhcmdldCcsICdfYmxhbmsnKVxuICAgICAgICAuYXBwZW5kVG8oZHJhd2luZ19zZWN0aW9uKVxuICAgICAgICAuY2xpY2soZi5yZXF1ZXN0X1NWRyk7XG4gICAgJCgnPGE+JylcbiAgICAgICAgLnRleHQoJ0Rvd25sb2FkIERyYXdpbmcgKG5ldHdvcmsgdGVzdCwgcmVwZWF0cyknKVxuICAgICAgICAvLy5hdHRyKCdocmVmJywgJyMnKVxuICAgICAgICAuYXR0cignaWQnLCAnZG93bmxvYWQnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnYnV0dG9uX2Zsb2F0X3JpZ2h0JylcbiAgICAgICAgLy8uYXR0cigndGFyZ2V0JywgJ19ibGFuaycpXG4gICAgICAgIC5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pXG4gICAgICAgIC5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgc2V0SW50ZXJ2YWwoZy5mLnJlcXVlc3RfU1ZHLCAxMDAwKTtcbiAgICAgICAgfSk7XG5cbiAgICB2YXIgc3ZnX2NvbnRhaW5lcl9vYmplY3QgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2RyYXdpbmcnKS5hdHRyKCdjbGFzcycsICdkcmF3aW5nJykuY3NzKCdjbGVhcicsICdib3RoJykuYXBwZW5kVG8oZHJhd2luZ19zZWN0aW9uKTtcbiAgICAvL3N2Z19jb250YWluZXJfb2JqZWN0LnN0eWxlKCd3aWR0aCcsIHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS5kcmF3aW5nLncrJ3B4JyApXG4gICAgLy92YXIgc3ZnX2NvbnRhaW5lciA9IHN2Z19jb250YWluZXJfb2JqZWN0LmVsZW07XG4gICAgJCgnPGJyPicpLmFwcGVuZFRvKGRyYXdpbmdfc2VjdGlvbik7XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgJCgnPGRpdj4nKS5odG1sKCcgJykuYXR0cignY2xhc3MnLCAnc2VjdGlvbl90aXRsZScpLmFwcGVuZFRvKGRyYXdpbmdfc2VjdGlvbik7XG5cbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gc2V0dXBfd2VicGFnZTtcbiIsIlxuXG52YXIgdXBkYXRlX3dlYnBhZ2UgPSBmdW5jdGlvbigpe1xuICAgIHZhciBzZXR0aW5ncyA9IGc7XG4gICAgdmFyIGYgPSBnLmY7XG5cblxuLy8gdXBkYXRlIHdlYiBwYWdlXG4gICAgLy8gc2V0IG1hcHMgbWFya2Vyc1xuICAgIGlmKCBnLnBlcm0ubG9jYXRpb24ubGF0ICYmIGcucGVybS5sb2NhdGlvbi5sb24pIHtcbiAgICAgICAgZi5zZXRfc2F0X21hcF9tYXJrZXIoKTtcbiAgICB9XG5cbiAgICAvLyBjaGFuZ2UgdXNlciBpbnB1dHMgdG8gZGVmYXVsdHMgaWYgbmVlZGVkLlxuICAgIC8vIFRoaXMgYWxzbyB1cGRhdGVzIHRoZSBkcm9wIGxpc3QgZWxlbWVudHMgdGhhdCBhcmUgZGVwZW5kZW50IG9uIG90aGVyIGlucHV0cyAoIG1vZGVsIGxpc3QgaXMgYmFzZWQgb24gc2VsZWN0ZWQgbWFrZSkuXG4gICAgc2V0dGluZ3Muc2VsZWN0X3JlZ2lzdHJ5LmZvckVhY2goZnVuY3Rpb24oc2VsZWN0b3Ipe1xuICAgICAgICBpZiggc2VsZWN0b3IudHlwZSA9PT0gJ3NlbGVjdCcgKXtcbiAgICAgICAgICAgIGYuc2VsZWN0b3JfYWRkX29wdGlvbnMoc2VsZWN0b3IpO1xuICAgICAgICB9IGVsc2UgaWYoIHNlbGVjdG9yLnR5cGUgPT09ICdudW1iZXJfaW5wdXQnIHx8IHNlbGVjdG9yLnR5cGUgPT09ICd0ZXh0X2lucHV0JyApIHtcbiAgICAgICAgICAgIHNlbGVjdG9yLmVsZW0udmFsdWUgPSBzZWxlY3Rvci5zeXN0ZW1fcmVmLmdldCgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBEZXRlcm1pbmUgYWN0aXZlIHNlY3Rpb24gYmFzZWQgb24gc2VjdGlvbiBpbnB1dHMgZW50ZXJlZCBieSB1c2VyXG4gICAgdmFyIHNlY3Rpb25zID0gZy53ZWJwYWdlLnNlY3Rpb25zO1xuICAgIHZhciBhY3RpdmVfc2VjdGlvbjtcbiAgICBzZWN0aW9ucy5ldmVyeShmdW5jdGlvbihzZWN0aW9uX25hbWUsaWQpeyAvL1RPRE86IGZpbmQgcHJlIElFOSB3YXkgdG8gZG8gdGhpcz9cbiAgICAgICAgaWYoICEgZy5mLnNlY3Rpb25fZGVmaW5lZChnLCBzZWN0aW9uX25hbWUpICl7XG4gICAgICAgICAgICBhY3RpdmVfc2VjdGlvbiA9IHNlY3Rpb25fbmFtZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhY3RpdmUgc2VjdGlvbjonLCBzZWN0aW9uX25hbWUpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYoIGlkID09PSBzZWN0aW9ucy5sZW5ndGgtMSApeyAvL0lmIGxhc3Qgc2VjdGlvbiBpcyBkZWZpbmVkLCB0aGVyZSBpcyBubyBhY3RpdmUgc2VjdGlvblxuICAgICAgICAgICAgICAgIGFjdGl2ZV9zZWN0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vIENsb3NlIHNlY3Rpb24gaWYgdGhleSBhcmUgbm90IGFjdGl2ZSBzZWN0aW9ucywgdW5sZXNzIHRoZXkgaGF2ZSBiZWVuIG9wZW5lZCBieSB0aGUgdXNlciwgb3BlbiB0aGUgYWN0aXZlIHNlY3Rpb25cbiAgICBzZWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHNlY3Rpb25fbmFtZSxpZCl7IC8vVE9ETzogZmluZCBwcmUgSUU5IHdheSB0byBkbyB0aGlzP1xuICAgICAgICBpZiggc2VjdGlvbl9uYW1lID09PSBhY3RpdmVfc2VjdGlvbiApe1xuICAgICAgICAgICAgJCgnI3NlY3Rpb25fJytzZWN0aW9uX25hbWUpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlRG93bignZmFzdCcpO1xuICAgICAgICB9IGVsc2UgaWYoICEgZy53ZWJwYWdlLnNlbGVjdGlvbnNfbWFudWFsX3RvZ2dsZWRbc2VjdGlvbl9uYW1lXSApe1xuICAgICAgICAgICAgJCgnI3NlY3Rpb25fJytzZWN0aW9uX25hbWUpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlVXAoJ2Zhc3QnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vSWYgdGhlIGxvY2F0aW9uIGlzIGRlZmluZWQsIG9wZW4gdGhlIG1hcC5cbiAgICBpZiggKCEgZy53ZWJwYWdlLnNlbGVjdGlvbnNfbWFudWFsX3RvZ2dsZWQubG9jYXRpb24pICYmICBnLmYuc2VjdGlvbl9kZWZpbmVkKGcsICdsb2NhdGlvbicpICl7XG4gICAgICAgICAgICAkKCcjc2VjdGlvbl9tYXAnKS5jaGlsZHJlbignLmRyYXdlcicpLmNoaWxkcmVuKCcuZHJhd2VyX2NvbnRlbnQnKS5zbGlkZURvd24oJ2Zhc3QnKTtcbiAgICB9XG5cblxuICAgIC8vIE1ha2UgcHJldmlld1xuICAgIHZhciBwO1xuXG4gICAgLy8gQWRkIHByZXZpZXcgdG8gcGFnZVxuICAgICQoJyNkcmF3aW5nX3ByZXZpZXcnKS5lbXB0eSgpLmh0bWwoJycpO1xuICAgIGZvciggcCBpbiBmLm1rX3ByZXZpZXcgKXsgIC8vIGYubWtfcGFnZSBpcyBhIGFycmF5IG9mIHBhZ2UgbWFraW5nIGZ1bmN0aW9ucywgc28gdGhpcyB3aWxsIGxvb3AgdGhyb3VnaCB0aGUgbnVtYmVyIG9mIHBhZ2VzXG4gICAgICAgIHNldHRpbmdzLmRyYXdpbmcucHJldmlld19zdmdzW3BdID0gZi5ta19zdmcoc2V0dGluZ3MuZHJhd2luZy5wcmV2aWV3X3BhcnRzW3BdLCBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzKTtcbiAgICAgICAgdmFyIHNlY3Rpb24gPSBbJycsJ0VsZWN0cmljYWwnLCdTdHJ1Y3R1cmFsJ11bcF07XG4gICAgICAgICQoJyNkcmF3aW5nX3ByZXZpZXcnKVxuICAgICAgICAgICAgLy8uYXBwZW5kKCQoJzxwPlBhZ2UgJytwKyc8L3A+JykpXG4gICAgICAgICAgICAuYXBwZW5kKCQoJzxwPicrc2VjdGlvbisnPC9wPicpKVxuICAgICAgICAgICAgLmFwcGVuZCgkKHNldHRpbmdzLmRyYXdpbmcucHJldmlld19zdmdzW3BdKSlcbiAgICAgICAgICAgIC5hcHBlbmQoJCgnPC9icj4nKSlcbiAgICAgICAgICAgIC5hcHBlbmQoJCgnPC9icj4nKSk7XG5cbiAgICB9XG5cbiAgICAvLyBBZGQgZHJhd2luZyB0byBwYWdlXG4gICAgJCgnI2RyYXdpbmcnKS5lbXB0eSgpLmh0bWwoJ0VsZWN0cmljYWwnKTtcbiAgICBmb3IoIHAgaW4gc2V0dGluZ3MuZHJhd2luZy5wYXJ0cyApeyAgLy8gZi5ta19wYWdlIGlzIGEgYXJyYXkgb2YgcGFnZSBtYWtpbmcgZnVuY3Rpb25zLCBzbyB0aGlzIHdpbGwgbG9vcCB0aHJvdWdoIHRoZSBudW1iZXIgb2YgcGFnZXNcbiAgICAgICAgc2V0dGluZ3MuZHJhd2luZy5zdmdzW3BdID0gZi5ta19zdmcoc2V0dGluZ3MuZHJhd2luZy5wYXJ0c1twXSwgc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncyk7XG4gICAgICAgICQoJyNkcmF3aW5nJylcbiAgICAgICAgICAgIC8vLmFwcGVuZCgkKCc8cD5QYWdlICcrcCsnPC9wPicpKVxuICAgICAgICAgICAgLmFwcGVuZCgkKHNldHRpbmdzLmRyYXdpbmcuc3Znc1twXSkpXG4gICAgICAgICAgICAuYXBwZW5kKCQoJzwvYnI+JykpXG4gICAgICAgICAgICAuYXBwZW5kKCQoJzwvYnI+JykpO1xuXG4gICAgfVxuXG5cbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSB1cGRhdGVfd2VicGFnZTtcbiIsIi8vICAgICBVbmRlcnNjb3JlLmpzIDEuOC4yXG4vLyAgICAgaHR0cDovL3VuZGVyc2NvcmVqcy5vcmdcbi8vICAgICAoYykgMjAwOS0yMDE1IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4vLyAgICAgVW5kZXJzY29yZSBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuKGZ1bmN0aW9uKCkge1xuXG4gIC8vIEJhc2VsaW5lIHNldHVwXG4gIC8vIC0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gRXN0YWJsaXNoIHRoZSByb290IG9iamVjdCwgYHdpbmRvd2AgaW4gdGhlIGJyb3dzZXIsIG9yIGBleHBvcnRzYCBvbiB0aGUgc2VydmVyLlxuICB2YXIgcm9vdCA9IHRoaXM7XG5cbiAgLy8gU2F2ZSB0aGUgcHJldmlvdXMgdmFsdWUgb2YgdGhlIGBfYCB2YXJpYWJsZS5cbiAgdmFyIHByZXZpb3VzVW5kZXJzY29yZSA9IHJvb3QuXztcblxuICAvLyBTYXZlIGJ5dGVzIGluIHRoZSBtaW5pZmllZCAoYnV0IG5vdCBnemlwcGVkKSB2ZXJzaW9uOlxuICB2YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSwgT2JqUHJvdG8gPSBPYmplY3QucHJvdG90eXBlLCBGdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbiAgLy8gQ3JlYXRlIHF1aWNrIHJlZmVyZW5jZSB2YXJpYWJsZXMgZm9yIHNwZWVkIGFjY2VzcyB0byBjb3JlIHByb3RvdHlwZXMuXG4gIHZhclxuICAgIHB1c2ggICAgICAgICAgICAgPSBBcnJheVByb3RvLnB1c2gsXG4gICAgc2xpY2UgICAgICAgICAgICA9IEFycmF5UHJvdG8uc2xpY2UsXG4gICAgdG9TdHJpbmcgICAgICAgICA9IE9ialByb3RvLnRvU3RyaW5nLFxuICAgIGhhc093blByb3BlcnR5ICAgPSBPYmpQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuICAvLyBBbGwgKipFQ01BU2NyaXB0IDUqKiBuYXRpdmUgZnVuY3Rpb24gaW1wbGVtZW50YXRpb25zIHRoYXQgd2UgaG9wZSB0byB1c2VcbiAgLy8gYXJlIGRlY2xhcmVkIGhlcmUuXG4gIHZhclxuICAgIG5hdGl2ZUlzQXJyYXkgICAgICA9IEFycmF5LmlzQXJyYXksXG4gICAgbmF0aXZlS2V5cyAgICAgICAgID0gT2JqZWN0LmtleXMsXG4gICAgbmF0aXZlQmluZCAgICAgICAgID0gRnVuY1Byb3RvLmJpbmQsXG4gICAgbmF0aXZlQ3JlYXRlICAgICAgID0gT2JqZWN0LmNyZWF0ZTtcblxuICAvLyBOYWtlZCBmdW5jdGlvbiByZWZlcmVuY2UgZm9yIHN1cnJvZ2F0ZS1wcm90b3R5cGUtc3dhcHBpbmcuXG4gIHZhciBDdG9yID0gZnVuY3Rpb24oKXt9O1xuXG4gIC8vIENyZWF0ZSBhIHNhZmUgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgdXNlIGJlbG93LlxuICB2YXIgXyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogaW5zdGFuY2VvZiBfKSByZXR1cm4gb2JqO1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBfKSkgcmV0dXJuIG5ldyBfKG9iaik7XG4gICAgdGhpcy5fd3JhcHBlZCA9IG9iajtcbiAgfTtcblxuICAvLyBFeHBvcnQgdGhlIFVuZGVyc2NvcmUgb2JqZWN0IGZvciAqKk5vZGUuanMqKiwgd2l0aFxuICAvLyBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBmb3IgdGhlIG9sZCBgcmVxdWlyZSgpYCBBUEkuIElmIHdlJ3JlIGluXG4gIC8vIHRoZSBicm93c2VyLCBhZGQgYF9gIGFzIGEgZ2xvYmFsIG9iamVjdC5cbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gXztcbiAgICB9XG4gICAgZXhwb3J0cy5fID0gXztcbiAgfSBlbHNlIHtcbiAgICByb290Ll8gPSBfO1xuICB9XG5cbiAgLy8gQ3VycmVudCB2ZXJzaW9uLlxuICBfLlZFUlNJT04gPSAnMS44LjInO1xuXG4gIC8vIEludGVybmFsIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlZmZpY2llbnQgKGZvciBjdXJyZW50IGVuZ2luZXMpIHZlcnNpb25cbiAgLy8gb2YgdGhlIHBhc3NlZC1pbiBjYWxsYmFjaywgdG8gYmUgcmVwZWF0ZWRseSBhcHBsaWVkIGluIG90aGVyIFVuZGVyc2NvcmVcbiAgLy8gZnVuY3Rpb25zLlxuICB2YXIgb3B0aW1pemVDYiA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQsIGFyZ0NvdW50KSB7XG4gICAgaWYgKGNvbnRleHQgPT09IHZvaWQgMCkgcmV0dXJuIGZ1bmM7XG4gICAgc3dpdGNoIChhcmdDb3VudCA9PSBudWxsID8gMyA6IGFyZ0NvdW50KSB7XG4gICAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgb3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSwgb3RoZXIpO1xuICAgICAgfTtcbiAgICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgICB9O1xuICAgICAgY2FzZSA0OiByZXR1cm4gZnVuY3Rpb24oYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEEgbW9zdGx5LWludGVybmFsIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIGNhbGxiYWNrcyB0aGF0IGNhbiBiZSBhcHBsaWVkXG4gIC8vIHRvIGVhY2ggZWxlbWVudCBpbiBhIGNvbGxlY3Rpb24sIHJldHVybmluZyB0aGUgZGVzaXJlZCByZXN1bHQg4oCUIGVpdGhlclxuICAvLyBpZGVudGl0eSwgYW4gYXJiaXRyYXJ5IGNhbGxiYWNrLCBhIHByb3BlcnR5IG1hdGNoZXIsIG9yIGEgcHJvcGVydHkgYWNjZXNzb3IuXG4gIHZhciBjYiA9IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCkge1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSByZXR1cm4gXy5pZGVudGl0eTtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbHVlKSkgcmV0dXJuIG9wdGltaXplQ2IodmFsdWUsIGNvbnRleHQsIGFyZ0NvdW50KTtcbiAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkpIHJldHVybiBfLm1hdGNoZXIodmFsdWUpO1xuICAgIHJldHVybiBfLnByb3BlcnR5KHZhbHVlKTtcbiAgfTtcbiAgXy5pdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGNiKHZhbHVlLCBjb250ZXh0LCBJbmZpbml0eSk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGFzc2lnbmVyIGZ1bmN0aW9ucy5cbiAgdmFyIGNyZWF0ZUFzc2lnbmVyID0gZnVuY3Rpb24oa2V5c0Z1bmMsIHVuZGVmaW5lZE9ubHkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqKSB7XG4gICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggPCAyIHx8IG9iaiA9PSBudWxsKSByZXR1cm4gb2JqO1xuICAgICAgZm9yICh2YXIgaW5kZXggPSAxOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2luZGV4XSxcbiAgICAgICAgICAgIGtleXMgPSBrZXlzRnVuYyhzb3VyY2UpLFxuICAgICAgICAgICAgbCA9IGtleXMubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgIGlmICghdW5kZWZpbmVkT25seSB8fCBvYmpba2V5XSA9PT0gdm9pZCAwKSBvYmpba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH07XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGEgbmV3IG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gYW5vdGhlci5cbiAgdmFyIGJhc2VDcmVhdGUgPSBmdW5jdGlvbihwcm90b3R5cGUpIHtcbiAgICBpZiAoIV8uaXNPYmplY3QocHJvdG90eXBlKSkgcmV0dXJuIHt9O1xuICAgIGlmIChuYXRpdmVDcmVhdGUpIHJldHVybiBuYXRpdmVDcmVhdGUocHJvdG90eXBlKTtcbiAgICBDdG9yLnByb3RvdHlwZSA9IHByb3RvdHlwZTtcbiAgICB2YXIgcmVzdWx0ID0gbmV3IEN0b3I7XG4gICAgQ3Rvci5wcm90b3R5cGUgPSBudWxsO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gSGVscGVyIGZvciBjb2xsZWN0aW9uIG1ldGhvZHMgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgYSBjb2xsZWN0aW9uXG4gIC8vIHNob3VsZCBiZSBpdGVyYXRlZCBhcyBhbiBhcnJheSBvciBhcyBhbiBvYmplY3RcbiAgLy8gUmVsYXRlZDogaHR0cDovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtdG9sZW5ndGhcbiAgdmFyIE1BWF9BUlJBWV9JTkRFWCA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG4gIHZhciBpc0FycmF5TGlrZSA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcbiAgICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbiAmJiBjb2xsZWN0aW9uLmxlbmd0aDtcbiAgICByZXR1cm4gdHlwZW9mIGxlbmd0aCA9PSAnbnVtYmVyJyAmJiBsZW5ndGggPj0gMCAmJiBsZW5ndGggPD0gTUFYX0FSUkFZX0lOREVYO1xuICB9O1xuXG4gIC8vIENvbGxlY3Rpb24gRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gVGhlIGNvcm5lcnN0b25lLCBhbiBgZWFjaGAgaW1wbGVtZW50YXRpb24sIGFrYSBgZm9yRWFjaGAuXG4gIC8vIEhhbmRsZXMgcmF3IG9iamVjdHMgaW4gYWRkaXRpb24gdG8gYXJyYXktbGlrZXMuIFRyZWF0cyBhbGxcbiAgLy8gc3BhcnNlIGFycmF5LWxpa2VzIGFzIGlmIHRoZXkgd2VyZSBkZW5zZS5cbiAgXy5lYWNoID0gXy5mb3JFYWNoID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGksIGxlbmd0aDtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkge1xuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdGVlKG9ialtpXSwgaSwgb2JqKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlcmF0ZWUob2JqW2tleXNbaV1dLCBrZXlzW2ldLCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0ZWUgdG8gZWFjaCBlbGVtZW50LlxuICBfLm1hcCA9IF8uY29sbGVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgcmVzdWx0cyA9IEFycmF5KGxlbmd0aCk7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIHJlc3VsdHNbaW5kZXhdID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBDcmVhdGUgYSByZWR1Y2luZyBmdW5jdGlvbiBpdGVyYXRpbmcgbGVmdCBvciByaWdodC5cbiAgZnVuY3Rpb24gY3JlYXRlUmVkdWNlKGRpcikge1xuICAgIC8vIE9wdGltaXplZCBpdGVyYXRvciBmdW5jdGlvbiBhcyB1c2luZyBhcmd1bWVudHMubGVuZ3RoXG4gICAgLy8gaW4gdGhlIG1haW4gZnVuY3Rpb24gd2lsbCBkZW9wdGltaXplIHRoZSwgc2VlICMxOTkxLlxuICAgIGZ1bmN0aW9uIGl0ZXJhdG9yKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGtleXMsIGluZGV4LCBsZW5ndGgpIHtcbiAgICAgIGZvciAoOyBpbmRleCA+PSAwICYmIGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSBkaXIpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgICAgbWVtbyA9IGl0ZXJhdGVlKG1lbW8sIG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBtZW1vLCBjb250ZXh0KSB7XG4gICAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQsIDQpO1xuICAgICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aCxcbiAgICAgICAgICBpbmRleCA9IGRpciA+IDAgPyAwIDogbGVuZ3RoIC0gMTtcbiAgICAgIC8vIERldGVybWluZSB0aGUgaW5pdGlhbCB2YWx1ZSBpZiBub25lIGlzIHByb3ZpZGVkLlxuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSB7XG4gICAgICAgIG1lbW8gPSBvYmpba2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXhdO1xuICAgICAgICBpbmRleCArPSBkaXI7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0b3Iob2JqLCBpdGVyYXRlZSwgbWVtbywga2V5cywgaW5kZXgsIGxlbmd0aCk7XG4gICAgfTtcbiAgfVxuXG4gIC8vICoqUmVkdWNlKiogYnVpbGRzIHVwIGEgc2luZ2xlIHJlc3VsdCBmcm9tIGEgbGlzdCBvZiB2YWx1ZXMsIGFrYSBgaW5qZWN0YCxcbiAgLy8gb3IgYGZvbGRsYC5cbiAgXy5yZWR1Y2UgPSBfLmZvbGRsID0gXy5pbmplY3QgPSBjcmVhdGVSZWR1Y2UoMSk7XG5cbiAgLy8gVGhlIHJpZ2h0LWFzc29jaWF0aXZlIHZlcnNpb24gb2YgcmVkdWNlLCBhbHNvIGtub3duIGFzIGBmb2xkcmAuXG4gIF8ucmVkdWNlUmlnaHQgPSBfLmZvbGRyID0gY3JlYXRlUmVkdWNlKC0xKTtcblxuICAvLyBSZXR1cm4gdGhlIGZpcnN0IHZhbHVlIHdoaWNoIHBhc3NlcyBhIHRydXRoIHRlc3QuIEFsaWFzZWQgYXMgYGRldGVjdGAuXG4gIF8uZmluZCA9IF8uZGV0ZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIga2V5O1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSB7XG4gICAgICBrZXkgPSBfLmZpbmRJbmRleChvYmosIHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleSA9IF8uZmluZEtleShvYmosIHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgfVxuICAgIGlmIChrZXkgIT09IHZvaWQgMCAmJiBrZXkgIT09IC0xKSByZXR1cm4gb2JqW2tleV07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgdGhhdCBwYXNzIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgc2VsZWN0YC5cbiAgXy5maWx0ZXIgPSBfLnNlbGVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGxpc3QpKSByZXN1bHRzLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIGZvciB3aGljaCBhIHRydXRoIHRlc3QgZmFpbHMuXG4gIF8ucmVqZWN0ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBfLm5lZ2F0ZShjYihwcmVkaWNhdGUpKSwgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIHdoZXRoZXIgYWxsIG9mIHRoZSBlbGVtZW50cyBtYXRjaCBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYGFsbGAuXG4gIF8uZXZlcnkgPSBfLmFsbCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgaWYgKCFwcmVkaWNhdGUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiBhdCBsZWFzdCBvbmUgZWxlbWVudCBpbiB0aGUgb2JqZWN0IG1hdGNoZXMgYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBhbnlgLlxuICBfLnNvbWUgPSBfLmFueSA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICFpc0FycmF5TGlrZShvYmopICYmIF8ua2V5cyhvYmopLFxuICAgICAgICBsZW5ndGggPSAoa2V5cyB8fCBvYmopLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIgY3VycmVudEtleSA9IGtleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4O1xuICAgICAgaWYgKHByZWRpY2F0ZShvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaikpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgLy8gRGV0ZXJtaW5lIGlmIHRoZSBhcnJheSBvciBvYmplY3QgY29udGFpbnMgYSBnaXZlbiB2YWx1ZSAodXNpbmcgYD09PWApLlxuICAvLyBBbGlhc2VkIGFzIGBpbmNsdWRlc2AgYW5kIGBpbmNsdWRlYC5cbiAgXy5jb250YWlucyA9IF8uaW5jbHVkZXMgPSBfLmluY2x1ZGUgPSBmdW5jdGlvbihvYmosIHRhcmdldCwgZnJvbUluZGV4KSB7XG4gICAgaWYgKCFpc0FycmF5TGlrZShvYmopKSBvYmogPSBfLnZhbHVlcyhvYmopO1xuICAgIHJldHVybiBfLmluZGV4T2Yob2JqLCB0YXJnZXQsIHR5cGVvZiBmcm9tSW5kZXggPT0gJ251bWJlcicgJiYgZnJvbUluZGV4KSA+PSAwO1xuICB9O1xuXG4gIC8vIEludm9rZSBhIG1ldGhvZCAod2l0aCBhcmd1bWVudHMpIG9uIGV2ZXJ5IGl0ZW0gaW4gYSBjb2xsZWN0aW9uLlxuICBfLmludm9rZSA9IGZ1bmN0aW9uKG9iaiwgbWV0aG9kKSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGlzRnVuYyA9IF8uaXNGdW5jdGlvbihtZXRob2QpO1xuICAgIHJldHVybiBfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgZnVuYyA9IGlzRnVuYyA/IG1ldGhvZCA6IHZhbHVlW21ldGhvZF07XG4gICAgICByZXR1cm4gZnVuYyA9PSBudWxsID8gZnVuYyA6IGZ1bmMuYXBwbHkodmFsdWUsIGFyZ3MpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYG1hcGA6IGZldGNoaW5nIGEgcHJvcGVydHkuXG4gIF8ucGx1Y2sgPSBmdW5jdGlvbihvYmosIGtleSkge1xuICAgIHJldHVybiBfLm1hcChvYmosIF8ucHJvcGVydHkoa2V5KSk7XG4gIH07XG5cbiAgLy8gQ29udmVuaWVuY2UgdmVyc2lvbiBvZiBhIGNvbW1vbiB1c2UgY2FzZSBvZiBgZmlsdGVyYDogc2VsZWN0aW5nIG9ubHkgb2JqZWN0c1xuICAvLyBjb250YWluaW5nIHNwZWNpZmljIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLndoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLmZpbHRlcihvYmosIF8ubWF0Y2hlcihhdHRycykpO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbmRgOiBnZXR0aW5nIHRoZSBmaXJzdCBvYmplY3RcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5maW5kV2hlcmUgPSBmdW5jdGlvbihvYmosIGF0dHJzKSB7XG4gICAgcmV0dXJuIF8uZmluZChvYmosIF8ubWF0Y2hlcihhdHRycykpO1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgbWF4aW11bSBlbGVtZW50IChvciBlbGVtZW50LWJhc2VkIGNvbXB1dGF0aW9uKS5cbiAgXy5tYXggPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IC1JbmZpbml0eSwgbGFzdENvbXB1dGVkID0gLUluZmluaXR5LFxuICAgICAgICB2YWx1ZSwgY29tcHV0ZWQ7XG4gICAgaWYgKGl0ZXJhdGVlID09IG51bGwgJiYgb2JqICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YWx1ZSA9IG9ialtpXTtcbiAgICAgICAgaWYgKHZhbHVlID4gcmVzdWx0KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgICAgICBpZiAoY29tcHV0ZWQgPiBsYXN0Q29tcHV0ZWQgfHwgY29tcHV0ZWQgPT09IC1JbmZpbml0eSAmJiByZXN1bHQgPT09IC1JbmZpbml0eSkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1pbmltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIF8ubWluID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSBJbmZpbml0eSwgbGFzdENvbXB1dGVkID0gSW5maW5pdHksXG4gICAgICAgIHZhbHVlLCBjb21wdXRlZDtcbiAgICBpZiAoaXRlcmF0ZWUgPT0gbnVsbCAmJiBvYmogIT0gbnVsbCkge1xuICAgICAgb2JqID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlID0gb2JqW2ldO1xuICAgICAgICBpZiAodmFsdWUgPCByZXN1bHQpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdCk7XG4gICAgICAgIGlmIChjb21wdXRlZCA8IGxhc3RDb21wdXRlZCB8fCBjb21wdXRlZCA9PT0gSW5maW5pdHkgJiYgcmVzdWx0ID09PSBJbmZpbml0eSkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGxhc3RDb21wdXRlZCA9IGNvbXB1dGVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBTaHVmZmxlIGEgY29sbGVjdGlvbiwgdXNpbmcgdGhlIG1vZGVybiB2ZXJzaW9uIG9mIHRoZVxuICAvLyBbRmlzaGVyLVlhdGVzIHNodWZmbGVdKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRmlzaGVy4oCTWWF0ZXNfc2h1ZmZsZSkuXG4gIF8uc2h1ZmZsZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBzZXQgPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0gc2V0Lmxlbmd0aDtcbiAgICB2YXIgc2h1ZmZsZWQgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMCwgcmFuZDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHJhbmQgPSBfLnJhbmRvbSgwLCBpbmRleCk7XG4gICAgICBpZiAocmFuZCAhPT0gaW5kZXgpIHNodWZmbGVkW2luZGV4XSA9IHNodWZmbGVkW3JhbmRdO1xuICAgICAgc2h1ZmZsZWRbcmFuZF0gPSBzZXRbaW5kZXhdO1xuICAgIH1cbiAgICByZXR1cm4gc2h1ZmZsZWQ7XG4gIH07XG5cbiAgLy8gU2FtcGxlICoqbioqIHJhbmRvbSB2YWx1ZXMgZnJvbSBhIGNvbGxlY3Rpb24uXG4gIC8vIElmICoqbioqIGlzIG5vdCBzcGVjaWZpZWQsIHJldHVybnMgYSBzaW5nbGUgcmFuZG9tIGVsZW1lbnQuXG4gIC8vIFRoZSBpbnRlcm5hbCBgZ3VhcmRgIGFyZ3VtZW50IGFsbG93cyBpdCB0byB3b3JrIHdpdGggYG1hcGAuXG4gIF8uc2FtcGxlID0gZnVuY3Rpb24ob2JqLCBuLCBndWFyZCkge1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHtcbiAgICAgIGlmICghaXNBcnJheUxpa2Uob2JqKSkgb2JqID0gXy52YWx1ZXMob2JqKTtcbiAgICAgIHJldHVybiBvYmpbXy5yYW5kb20ob2JqLmxlbmd0aCAtIDEpXTtcbiAgICB9XG4gICAgcmV0dXJuIF8uc2h1ZmZsZShvYmopLnNsaWNlKDAsIE1hdGgubWF4KDAsIG4pKTtcbiAgfTtcblxuICAvLyBTb3J0IHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24gcHJvZHVjZWQgYnkgYW4gaXRlcmF0ZWUuXG4gIF8uc29ydEJ5ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHJldHVybiBfLnBsdWNrKF8ubWFwKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgY3JpdGVyaWE6IGl0ZXJhdGVlKHZhbHVlLCBpbmRleCwgbGlzdClcbiAgICAgIH07XG4gICAgfSkuc29ydChmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICAgICAgdmFyIGEgPSBsZWZ0LmNyaXRlcmlhO1xuICAgICAgdmFyIGIgPSByaWdodC5jcml0ZXJpYTtcbiAgICAgIGlmIChhICE9PSBiKSB7XG4gICAgICAgIGlmIChhID4gYiB8fCBhID09PSB2b2lkIDApIHJldHVybiAxO1xuICAgICAgICBpZiAoYSA8IGIgfHwgYiA9PT0gdm9pZCAwKSByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGVmdC5pbmRleCAtIHJpZ2h0LmluZGV4O1xuICAgIH0pLCAndmFsdWUnKTtcbiAgfTtcblxuICAvLyBBbiBpbnRlcm5hbCBmdW5jdGlvbiB1c2VkIGZvciBhZ2dyZWdhdGUgXCJncm91cCBieVwiIG9wZXJhdGlvbnMuXG4gIHZhciBncm91cCA9IGZ1bmN0aW9uKGJlaGF2aW9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4KSB7XG4gICAgICAgIHZhciBrZXkgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIG9iaik7XG4gICAgICAgIGJlaGF2aW9yKHJlc3VsdCwgdmFsdWUsIGtleSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBHcm91cHMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbi4gUGFzcyBlaXRoZXIgYSBzdHJpbmcgYXR0cmlidXRlXG4gIC8vIHRvIGdyb3VwIGJ5LCBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgY3JpdGVyaW9uLlxuICBfLmdyb3VwQnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICBpZiAoXy5oYXMocmVzdWx0LCBrZXkpKSByZXN1bHRba2V5XS5wdXNoKHZhbHVlKTsgZWxzZSByZXN1bHRba2V5XSA9IFt2YWx1ZV07XG4gIH0pO1xuXG4gIC8vIEluZGV4ZXMgdGhlIG9iamVjdCdzIHZhbHVlcyBieSBhIGNyaXRlcmlvbiwgc2ltaWxhciB0byBgZ3JvdXBCeWAsIGJ1dCBmb3JcbiAgLy8gd2hlbiB5b3Uga25vdyB0aGF0IHlvdXIgaW5kZXggdmFsdWVzIHdpbGwgYmUgdW5pcXVlLlxuICBfLmluZGV4QnkgPSBncm91cChmdW5jdGlvbihyZXN1bHQsIHZhbHVlLCBrZXkpIHtcbiAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICB9KTtcblxuICAvLyBDb3VudHMgaW5zdGFuY2VzIG9mIGFuIG9iamVjdCB0aGF0IGdyb3VwIGJ5IGEgY2VydGFpbiBjcml0ZXJpb24uIFBhc3NcbiAgLy8gZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZSB0byBjb3VudCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlXG4gIC8vIGNyaXRlcmlvbi5cbiAgXy5jb3VudEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgaWYgKF8uaGFzKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0rKzsgZWxzZSByZXN1bHRba2V5XSA9IDE7XG4gIH0pO1xuXG4gIC8vIFNhZmVseSBjcmVhdGUgYSByZWFsLCBsaXZlIGFycmF5IGZyb20gYW55dGhpbmcgaXRlcmFibGUuXG4gIF8udG9BcnJheSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghb2JqKSByZXR1cm4gW107XG4gICAgaWYgKF8uaXNBcnJheShvYmopKSByZXR1cm4gc2xpY2UuY2FsbChvYmopO1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopKSByZXR1cm4gXy5tYXAob2JqLCBfLmlkZW50aXR5KTtcbiAgICByZXR1cm4gXy52YWx1ZXMob2JqKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiBhbiBvYmplY3QuXG4gIF8uc2l6ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIDA7XG4gICAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iaikgPyBvYmoubGVuZ3RoIDogXy5rZXlzKG9iaikubGVuZ3RoO1xuICB9O1xuXG4gIC8vIFNwbGl0IGEgY29sbGVjdGlvbiBpbnRvIHR3byBhcnJheXM6IG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgc2F0aXNmeSB0aGUgZ2l2ZW5cbiAgLy8gcHJlZGljYXRlLCBhbmQgb25lIHdob3NlIGVsZW1lbnRzIGFsbCBkbyBub3Qgc2F0aXNmeSB0aGUgcHJlZGljYXRlLlxuICBfLnBhcnRpdGlvbiA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIgcGFzcyA9IFtdLCBmYWlsID0gW107XG4gICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqKSB7XG4gICAgICAocHJlZGljYXRlKHZhbHVlLCBrZXksIG9iaikgPyBwYXNzIDogZmFpbCkucHVzaCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFtwYXNzLCBmYWlsXTtcbiAgfTtcblxuICAvLyBBcnJheSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gR2V0IHRoZSBmaXJzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBmaXJzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYGhlYWRgIGFuZCBgdGFrZWAuIFRoZSAqKmd1YXJkKiogY2hlY2tcbiAgLy8gYWxsb3dzIGl0IHRvIHdvcmsgd2l0aCBgXy5tYXBgLlxuICBfLmZpcnN0ID0gXy5oZWFkID0gXy50YWtlID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5WzBdO1xuICAgIHJldHVybiBfLmluaXRpYWwoYXJyYXksIGFycmF5Lmxlbmd0aCAtIG4pO1xuICB9O1xuXG4gIC8vIFJldHVybnMgZXZlcnl0aGluZyBidXQgdGhlIGxhc3QgZW50cnkgb2YgdGhlIGFycmF5LiBFc3BlY2lhbGx5IHVzZWZ1bCBvblxuICAvLyB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiBhbGwgdGhlIHZhbHVlcyBpblxuICAvLyB0aGUgYXJyYXksIGV4Y2x1ZGluZyB0aGUgbGFzdCBOLlxuICBfLmluaXRpYWwgPSBmdW5jdGlvbihhcnJheSwgbiwgZ3VhcmQpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbChhcnJheSwgMCwgTWF0aC5tYXgoMCwgYXJyYXkubGVuZ3RoIC0gKG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKSkpO1xuICB9O1xuXG4gIC8vIEdldCB0aGUgbGFzdCBlbGVtZW50IG9mIGFuIGFycmF5LiBQYXNzaW5nICoqbioqIHdpbGwgcmV0dXJuIHRoZSBsYXN0IE5cbiAgLy8gdmFsdWVzIGluIHRoZSBhcnJheS5cbiAgXy5sYXN0ID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHJldHVybiB2b2lkIDA7XG4gICAgaWYgKG4gPT0gbnVsbCB8fCBndWFyZCkgcmV0dXJuIGFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgIHJldHVybiBfLnJlc3QoYXJyYXksIE1hdGgubWF4KDAsIGFycmF5Lmxlbmd0aCAtIG4pKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBmaXJzdCBlbnRyeSBvZiB0aGUgYXJyYXkuIEFsaWFzZWQgYXMgYHRhaWxgIGFuZCBgZHJvcGAuXG4gIC8vIEVzcGVjaWFsbHkgdXNlZnVsIG9uIHRoZSBhcmd1bWVudHMgb2JqZWN0LiBQYXNzaW5nIGFuICoqbioqIHdpbGwgcmV0dXJuXG4gIC8vIHRoZSByZXN0IE4gdmFsdWVzIGluIHRoZSBhcnJheS5cbiAgXy5yZXN0ID0gXy50YWlsID0gXy5kcm9wID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIG4gPT0gbnVsbCB8fCBndWFyZCA/IDEgOiBuKTtcbiAgfTtcblxuICAvLyBUcmltIG91dCBhbGwgZmFsc3kgdmFsdWVzIGZyb20gYW4gYXJyYXkuXG4gIF8uY29tcGFjdCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBfLmlkZW50aXR5KTtcbiAgfTtcblxuICAvLyBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiBhIHJlY3Vyc2l2ZSBgZmxhdHRlbmAgZnVuY3Rpb24uXG4gIHZhciBmbGF0dGVuID0gZnVuY3Rpb24oaW5wdXQsIHNoYWxsb3csIHN0cmljdCwgc3RhcnRJbmRleCkge1xuICAgIHZhciBvdXRwdXQgPSBbXSwgaWR4ID0gMDtcbiAgICBmb3IgKHZhciBpID0gc3RhcnRJbmRleCB8fCAwLCBsZW5ndGggPSBpbnB1dCAmJiBpbnB1dC5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gaW5wdXRbaV07XG4gICAgICBpZiAoaXNBcnJheUxpa2UodmFsdWUpICYmIChfLmlzQXJyYXkodmFsdWUpIHx8IF8uaXNBcmd1bWVudHModmFsdWUpKSkge1xuICAgICAgICAvL2ZsYXR0ZW4gY3VycmVudCBsZXZlbCBvZiBhcnJheSBvciBhcmd1bWVudHMgb2JqZWN0XG4gICAgICAgIGlmICghc2hhbGxvdykgdmFsdWUgPSBmbGF0dGVuKHZhbHVlLCBzaGFsbG93LCBzdHJpY3QpO1xuICAgICAgICB2YXIgaiA9IDAsIGxlbiA9IHZhbHVlLmxlbmd0aDtcbiAgICAgICAgb3V0cHV0Lmxlbmd0aCArPSBsZW47XG4gICAgICAgIHdoaWxlIChqIDwgbGVuKSB7XG4gICAgICAgICAgb3V0cHV0W2lkeCsrXSA9IHZhbHVlW2orK107XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIXN0cmljdCkge1xuICAgICAgICBvdXRwdXRbaWR4KytdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgLy8gRmxhdHRlbiBvdXQgYW4gYXJyYXksIGVpdGhlciByZWN1cnNpdmVseSAoYnkgZGVmYXVsdCksIG9yIGp1c3Qgb25lIGxldmVsLlxuICBfLmZsYXR0ZW4gPSBmdW5jdGlvbihhcnJheSwgc2hhbGxvdykge1xuICAgIHJldHVybiBmbGF0dGVuKGFycmF5LCBzaGFsbG93LCBmYWxzZSk7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgdmVyc2lvbiBvZiB0aGUgYXJyYXkgdGhhdCBkb2VzIG5vdCBjb250YWluIHRoZSBzcGVjaWZpZWQgdmFsdWUocykuXG4gIF8ud2l0aG91dCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgcmV0dXJuIF8uZGlmZmVyZW5jZShhcnJheSwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGEgZHVwbGljYXRlLWZyZWUgdmVyc2lvbiBvZiB0aGUgYXJyYXkuIElmIHRoZSBhcnJheSBoYXMgYWxyZWFkeVxuICAvLyBiZWVuIHNvcnRlZCwgeW91IGhhdmUgdGhlIG9wdGlvbiBvZiB1c2luZyBhIGZhc3RlciBhbGdvcml0aG0uXG4gIC8vIEFsaWFzZWQgYXMgYHVuaXF1ZWAuXG4gIF8udW5pcSA9IF8udW5pcXVlID0gZnVuY3Rpb24oYXJyYXksIGlzU29ydGVkLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gW107XG4gICAgaWYgKCFfLmlzQm9vbGVhbihpc1NvcnRlZCkpIHtcbiAgICAgIGNvbnRleHQgPSBpdGVyYXRlZTtcbiAgICAgIGl0ZXJhdGVlID0gaXNTb3J0ZWQ7XG4gICAgICBpc1NvcnRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoaXRlcmF0ZWUgIT0gbnVsbCkgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBzZWVuID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBhcnJheVtpXSxcbiAgICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlID8gaXRlcmF0ZWUodmFsdWUsIGksIGFycmF5KSA6IHZhbHVlO1xuICAgICAgaWYgKGlzU29ydGVkKSB7XG4gICAgICAgIGlmICghaSB8fCBzZWVuICE9PSBjb21wdXRlZCkgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICBzZWVuID0gY29tcHV0ZWQ7XG4gICAgICB9IGVsc2UgaWYgKGl0ZXJhdGVlKSB7XG4gICAgICAgIGlmICghXy5jb250YWlucyhzZWVuLCBjb21wdXRlZCkpIHtcbiAgICAgICAgICBzZWVuLnB1c2goY29tcHV0ZWQpO1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghXy5jb250YWlucyhyZXN1bHQsIHZhbHVlKSkge1xuICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSB1bmlvbjogZWFjaCBkaXN0aW5jdCBlbGVtZW50IGZyb20gYWxsIG9mXG4gIC8vIHRoZSBwYXNzZWQtaW4gYXJyYXlzLlxuICBfLnVuaW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW5pcShmbGF0dGVuKGFyZ3VtZW50cywgdHJ1ZSwgdHJ1ZSkpO1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyBldmVyeSBpdGVtIHNoYXJlZCBiZXR3ZWVuIGFsbCB0aGVcbiAgLy8gcGFzc2VkLWluIGFycmF5cy5cbiAgXy5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihhcnJheSkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gW107XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBhcmdzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gYXJyYXlbaV07XG4gICAgICBpZiAoXy5jb250YWlucyhyZXN1bHQsIGl0ZW0pKSBjb250aW51ZTtcbiAgICAgIGZvciAodmFyIGogPSAxOyBqIDwgYXJnc0xlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmICghXy5jb250YWlucyhhcmd1bWVudHNbal0sIGl0ZW0pKSBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChqID09PSBhcmdzTGVuZ3RoKSByZXN1bHQucHVzaChpdGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBUYWtlIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gb25lIGFycmF5IGFuZCBhIG51bWJlciBvZiBvdGhlciBhcnJheXMuXG4gIC8vIE9ubHkgdGhlIGVsZW1lbnRzIHByZXNlbnQgaW4ganVzdCB0aGUgZmlyc3QgYXJyYXkgd2lsbCByZW1haW4uXG4gIF8uZGlmZmVyZW5jZSA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIHJlc3QgPSBmbGF0dGVuKGFyZ3VtZW50cywgdHJ1ZSwgdHJ1ZSwgMSk7XG4gICAgcmV0dXJuIF8uZmlsdGVyKGFycmF5LCBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICByZXR1cm4gIV8uY29udGFpbnMocmVzdCwgdmFsdWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIFppcCB0b2dldGhlciBtdWx0aXBsZSBsaXN0cyBpbnRvIGEgc2luZ2xlIGFycmF5IC0tIGVsZW1lbnRzIHRoYXQgc2hhcmVcbiAgLy8gYW4gaW5kZXggZ28gdG9nZXRoZXIuXG4gIF8uemlwID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF8udW56aXAoYXJndW1lbnRzKTtcbiAgfTtcblxuICAvLyBDb21wbGVtZW50IG9mIF8uemlwLiBVbnppcCBhY2NlcHRzIGFuIGFycmF5IG9mIGFycmF5cyBhbmQgZ3JvdXBzXG4gIC8vIGVhY2ggYXJyYXkncyBlbGVtZW50cyBvbiBzaGFyZWQgaW5kaWNlc1xuICBfLnVuemlwID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJyYXkgJiYgXy5tYXgoYXJyYXksICdsZW5ndGgnKS5sZW5ndGggfHwgMDtcbiAgICB2YXIgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHJlc3VsdFtpbmRleF0gPSBfLnBsdWNrKGFycmF5LCBpbmRleCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gQ29udmVydHMgbGlzdHMgaW50byBvYmplY3RzLiBQYXNzIGVpdGhlciBhIHNpbmdsZSBhcnJheSBvZiBgW2tleSwgdmFsdWVdYFxuICAvLyBwYWlycywgb3IgdHdvIHBhcmFsbGVsIGFycmF5cyBvZiB0aGUgc2FtZSBsZW5ndGggLS0gb25lIG9mIGtleXMsIGFuZCBvbmUgb2ZcbiAgLy8gdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICBfLm9iamVjdCA9IGZ1bmN0aW9uKGxpc3QsIHZhbHVlcykge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gbGlzdCAmJiBsaXN0Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldXSA9IHZhbHVlc1tpXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdFtsaXN0W2ldWzBdXSA9IGxpc3RbaV1bMV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBwb3NpdGlvbiBvZiB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBvZiBhbiBpdGVtIGluIGFuIGFycmF5LFxuICAvLyBvciAtMSBpZiB0aGUgaXRlbSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGFycmF5LlxuICAvLyBJZiB0aGUgYXJyYXkgaXMgbGFyZ2UgYW5kIGFscmVhZHkgaW4gc29ydCBvcmRlciwgcGFzcyBgdHJ1ZWBcbiAgLy8gZm9yICoqaXNTb3J0ZWQqKiB0byB1c2UgYmluYXJ5IHNlYXJjaC5cbiAgXy5pbmRleE9mID0gZnVuY3Rpb24oYXJyYXksIGl0ZW0sIGlzU29ydGVkKSB7XG4gICAgdmFyIGkgPSAwLCBsZW5ndGggPSBhcnJheSAmJiBhcnJheS5sZW5ndGg7XG4gICAgaWYgKHR5cGVvZiBpc1NvcnRlZCA9PSAnbnVtYmVyJykge1xuICAgICAgaSA9IGlzU29ydGVkIDwgMCA/IE1hdGgubWF4KDAsIGxlbmd0aCArIGlzU29ydGVkKSA6IGlzU29ydGVkO1xuICAgIH0gZWxzZSBpZiAoaXNTb3J0ZWQgJiYgbGVuZ3RoKSB7XG4gICAgICBpID0gXy5zb3J0ZWRJbmRleChhcnJheSwgaXRlbSk7XG4gICAgICByZXR1cm4gYXJyYXlbaV0gPT09IGl0ZW0gPyBpIDogLTE7XG4gICAgfVxuICAgIGlmIChpdGVtICE9PSBpdGVtKSB7XG4gICAgICByZXR1cm4gXy5maW5kSW5kZXgoc2xpY2UuY2FsbChhcnJheSwgaSksIF8uaXNOYU4pO1xuICAgIH1cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSBpZiAoYXJyYXlbaV0gPT09IGl0ZW0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICBfLmxhc3RJbmRleE9mID0gZnVuY3Rpb24oYXJyYXksIGl0ZW0sIGZyb20pIHtcbiAgICB2YXIgaWR4ID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuICAgIGlmICh0eXBlb2YgZnJvbSA9PSAnbnVtYmVyJykge1xuICAgICAgaWR4ID0gZnJvbSA8IDAgPyBpZHggKyBmcm9tICsgMSA6IE1hdGgubWluKGlkeCwgZnJvbSArIDEpO1xuICAgIH1cbiAgICBpZiAoaXRlbSAhPT0gaXRlbSkge1xuICAgICAgcmV0dXJuIF8uZmluZExhc3RJbmRleChzbGljZS5jYWxsKGFycmF5LCAwLCBpZHgpLCBfLmlzTmFOKTtcbiAgICB9XG4gICAgd2hpbGUgKC0taWR4ID49IDApIGlmIChhcnJheVtpZHhdID09PSBpdGVtKSByZXR1cm4gaWR4O1xuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICAvLyBHZW5lcmF0b3IgZnVuY3Rpb24gdG8gY3JlYXRlIHRoZSBmaW5kSW5kZXggYW5kIGZpbmRMYXN0SW5kZXggZnVuY3Rpb25zXG4gIGZ1bmN0aW9uIGNyZWF0ZUluZGV4RmluZGVyKGRpcikge1xuICAgIHJldHVybiBmdW5jdGlvbihhcnJheSwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgICAgdmFyIGxlbmd0aCA9IGFycmF5ICE9IG51bGwgJiYgYXJyYXkubGVuZ3RoO1xuICAgICAgdmFyIGluZGV4ID0gZGlyID4gMCA/IDAgOiBsZW5ndGggLSAxO1xuICAgICAgZm9yICg7IGluZGV4ID49IDAgJiYgaW5kZXggPCBsZW5ndGg7IGluZGV4ICs9IGRpcikge1xuICAgICAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkgcmV0dXJuIGluZGV4O1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG4gIH1cblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBpbmRleCBvbiBhbiBhcnJheS1saWtlIHRoYXQgcGFzc2VzIGEgcHJlZGljYXRlIHRlc3RcbiAgXy5maW5kSW5kZXggPSBjcmVhdGVJbmRleEZpbmRlcigxKTtcblxuICBfLmZpbmRMYXN0SW5kZXggPSBjcmVhdGVJbmRleEZpbmRlcigtMSk7XG5cbiAgLy8gVXNlIGEgY29tcGFyYXRvciBmdW5jdGlvbiB0byBmaWd1cmUgb3V0IHRoZSBzbWFsbGVzdCBpbmRleCBhdCB3aGljaFxuICAvLyBhbiBvYmplY3Qgc2hvdWxkIGJlIGluc2VydGVkIHNvIGFzIHRvIG1haW50YWluIG9yZGVyLiBVc2VzIGJpbmFyeSBzZWFyY2guXG4gIF8uc29ydGVkSW5kZXggPSBmdW5jdGlvbihhcnJheSwgb2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQsIDEpO1xuICAgIHZhciB2YWx1ZSA9IGl0ZXJhdGVlKG9iaik7XG4gICAgdmFyIGxvdyA9IDAsIGhpZ2ggPSBhcnJheS5sZW5ndGg7XG4gICAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICAgIHZhciBtaWQgPSBNYXRoLmZsb29yKChsb3cgKyBoaWdoKSAvIDIpO1xuICAgICAgaWYgKGl0ZXJhdGVlKGFycmF5W21pZF0pIDwgdmFsdWUpIGxvdyA9IG1pZCArIDE7IGVsc2UgaGlnaCA9IG1pZDtcbiAgICB9XG4gICAgcmV0dXJuIGxvdztcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhbiBpbnRlZ2VyIEFycmF5IGNvbnRhaW5pbmcgYW4gYXJpdGhtZXRpYyBwcm9ncmVzc2lvbi4gQSBwb3J0IG9mXG4gIC8vIHRoZSBuYXRpdmUgUHl0aG9uIGByYW5nZSgpYCBmdW5jdGlvbi4gU2VlXG4gIC8vIFt0aGUgUHl0aG9uIGRvY3VtZW50YXRpb25dKGh0dHA6Ly9kb2NzLnB5dGhvbi5vcmcvbGlicmFyeS9mdW5jdGlvbnMuaHRtbCNyYW5nZSkuXG4gIF8ucmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDw9IDEpIHtcbiAgICAgIHN0b3AgPSBzdGFydCB8fCAwO1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cbiAgICBzdGVwID0gc3RlcCB8fCAxO1xuXG4gICAgdmFyIGxlbmd0aCA9IE1hdGgubWF4KE1hdGguY2VpbCgoc3RvcCAtIHN0YXJ0KSAvIHN0ZXApLCAwKTtcbiAgICB2YXIgcmFuZ2UgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbGVuZ3RoOyBpZHgrKywgc3RhcnQgKz0gc3RlcCkge1xuICAgICAgcmFuZ2VbaWR4XSA9IHN0YXJ0O1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiAoYWhlbSkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIERldGVybWluZXMgd2hldGhlciB0byBleGVjdXRlIGEgZnVuY3Rpb24gYXMgYSBjb25zdHJ1Y3RvclxuICAvLyBvciBhIG5vcm1hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm92aWRlZCBhcmd1bWVudHNcbiAgdmFyIGV4ZWN1dGVCb3VuZCA9IGZ1bmN0aW9uKHNvdXJjZUZ1bmMsIGJvdW5kRnVuYywgY29udGV4dCwgY2FsbGluZ0NvbnRleHQsIGFyZ3MpIHtcbiAgICBpZiAoIShjYWxsaW5nQ29udGV4dCBpbnN0YW5jZW9mIGJvdW5kRnVuYykpIHJldHVybiBzb3VyY2VGdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIHZhciBzZWxmID0gYmFzZUNyZWF0ZShzb3VyY2VGdW5jLnByb3RvdHlwZSk7XG4gICAgdmFyIHJlc3VsdCA9IHNvdXJjZUZ1bmMuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgaWYgKF8uaXNPYmplY3QocmVzdWx0KSkgcmV0dXJuIHJlc3VsdDtcbiAgICByZXR1cm4gc2VsZjtcbiAgfTtcblxuICAvLyBDcmVhdGUgYSBmdW5jdGlvbiBib3VuZCB0byBhIGdpdmVuIG9iamVjdCAoYXNzaWduaW5nIGB0aGlzYCwgYW5kIGFyZ3VtZW50cyxcbiAgLy8gb3B0aW9uYWxseSkuIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBGdW5jdGlvbi5iaW5kYCBpZlxuICAvLyBhdmFpbGFibGUuXG4gIF8uYmluZCA9IGZ1bmN0aW9uKGZ1bmMsIGNvbnRleHQpIHtcbiAgICBpZiAobmF0aXZlQmluZCAmJiBmdW5jLmJpbmQgPT09IG5hdGl2ZUJpbmQpIHJldHVybiBuYXRpdmVCaW5kLmFwcGx5KGZ1bmMsIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgaWYgKCFfLmlzRnVuY3Rpb24oZnVuYykpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0JpbmQgbXVzdCBiZSBjYWxsZWQgb24gYSBmdW5jdGlvbicpO1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4ZWN1dGVCb3VuZChmdW5jLCBib3VuZCwgY29udGV4dCwgdGhpcywgYXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgfTtcbiAgICByZXR1cm4gYm91bmQ7XG4gIH07XG5cbiAgLy8gUGFydGlhbGx5IGFwcGx5IGEgZnVuY3Rpb24gYnkgY3JlYXRpbmcgYSB2ZXJzaW9uIHRoYXQgaGFzIGhhZCBzb21lIG9mIGl0c1xuICAvLyBhcmd1bWVudHMgcHJlLWZpbGxlZCwgd2l0aG91dCBjaGFuZ2luZyBpdHMgZHluYW1pYyBgdGhpc2AgY29udGV4dC4gXyBhY3RzXG4gIC8vIGFzIGEgcGxhY2Vob2xkZXIsIGFsbG93aW5nIGFueSBjb21iaW5hdGlvbiBvZiBhcmd1bWVudHMgdG8gYmUgcHJlLWZpbGxlZC5cbiAgXy5wYXJ0aWFsID0gZnVuY3Rpb24oZnVuYykge1xuICAgIHZhciBib3VuZEFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgdmFyIGJvdW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcG9zaXRpb24gPSAwLCBsZW5ndGggPSBib3VuZEFyZ3MubGVuZ3RoO1xuICAgICAgdmFyIGFyZ3MgPSBBcnJheShsZW5ndGgpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBhcmdzW2ldID0gYm91bmRBcmdzW2ldID09PSBfID8gYXJndW1lbnRzW3Bvc2l0aW9uKytdIDogYm91bmRBcmdzW2ldO1xuICAgICAgfVxuICAgICAgd2hpbGUgKHBvc2l0aW9uIDwgYXJndW1lbnRzLmxlbmd0aCkgYXJncy5wdXNoKGFyZ3VtZW50c1twb3NpdGlvbisrXSk7XG4gICAgICByZXR1cm4gZXhlY3V0ZUJvdW5kKGZ1bmMsIGJvdW5kLCB0aGlzLCB0aGlzLCBhcmdzKTtcbiAgICB9O1xuICAgIHJldHVybiBib3VuZDtcbiAgfTtcblxuICAvLyBCaW5kIGEgbnVtYmVyIG9mIGFuIG9iamVjdCdzIG1ldGhvZHMgdG8gdGhhdCBvYmplY3QuIFJlbWFpbmluZyBhcmd1bWVudHNcbiAgLy8gYXJlIHRoZSBtZXRob2QgbmFtZXMgdG8gYmUgYm91bmQuIFVzZWZ1bCBmb3IgZW5zdXJpbmcgdGhhdCBhbGwgY2FsbGJhY2tzXG4gIC8vIGRlZmluZWQgb24gYW4gb2JqZWN0IGJlbG9uZyB0byBpdC5cbiAgXy5iaW5kQWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGksIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsIGtleTtcbiAgICBpZiAobGVuZ3RoIDw9IDEpIHRocm93IG5ldyBFcnJvcignYmluZEFsbCBtdXN0IGJlIHBhc3NlZCBmdW5jdGlvbiBuYW1lcycpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0gYXJndW1lbnRzW2ldO1xuICAgICAgb2JqW2tleV0gPSBfLmJpbmQob2JqW2tleV0sIG9iaik7XG4gICAgfVxuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gTWVtb2l6ZSBhbiBleHBlbnNpdmUgZnVuY3Rpb24gYnkgc3RvcmluZyBpdHMgcmVzdWx0cy5cbiAgXy5tZW1vaXplID0gZnVuY3Rpb24oZnVuYywgaGFzaGVyKSB7XG4gICAgdmFyIG1lbW9pemUgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciBjYWNoZSA9IG1lbW9pemUuY2FjaGU7XG4gICAgICB2YXIgYWRkcmVzcyA9ICcnICsgKGhhc2hlciA/IGhhc2hlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDoga2V5KTtcbiAgICAgIGlmICghXy5oYXMoY2FjaGUsIGFkZHJlc3MpKSBjYWNoZVthZGRyZXNzXSA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiBjYWNoZVthZGRyZXNzXTtcbiAgICB9O1xuICAgIG1lbW9pemUuY2FjaGUgPSB7fTtcbiAgICByZXR1cm4gbWVtb2l6ZTtcbiAgfTtcblxuICAvLyBEZWxheXMgYSBmdW5jdGlvbiBmb3IgdGhlIGdpdmVuIG51bWJlciBvZiBtaWxsaXNlY29uZHMsIGFuZCB0aGVuIGNhbGxzXG4gIC8vIGl0IHdpdGggdGhlIGFyZ3VtZW50cyBzdXBwbGllZC5cbiAgXy5kZWxheSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQpIHtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIGZ1bmMuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgfSwgd2FpdCk7XG4gIH07XG5cbiAgLy8gRGVmZXJzIGEgZnVuY3Rpb24sIHNjaGVkdWxpbmcgaXQgdG8gcnVuIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwgc3RhY2sgaGFzXG4gIC8vIGNsZWFyZWQuXG4gIF8uZGVmZXIgPSBfLnBhcnRpYWwoXy5kZWxheSwgXywgMSk7XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gIC8vIGJ1dCBpZiB5b3UnZCBsaWtlIHRvIGRpc2FibGUgdGhlIGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlLCBwYXNzXG4gIC8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICBfLnRocm90dGxlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgIHZhciBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gICAgdmFyIHRpbWVvdXQgPSBudWxsO1xuICAgIHZhciBwcmV2aW91cyA9IDA7XG4gICAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge307XG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogXy5ub3coKTtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG5vdyA9IF8ubm93KCk7XG4gICAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpIHByZXZpb3VzID0gbm93O1xuICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcbiAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgfSBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIGFzIGxvbmcgYXMgaXQgY29udGludWVzIHRvIGJlIGludm9rZWQsIHdpbGwgbm90XG4gIC8vIGJlIHRyaWdnZXJlZC4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGFmdGVyIGl0IHN0b3BzIGJlaW5nIGNhbGxlZCBmb3JcbiAgLy8gTiBtaWxsaXNlY29uZHMuIElmIGBpbW1lZGlhdGVgIGlzIHBhc3NlZCwgdHJpZ2dlciB0aGUgZnVuY3Rpb24gb24gdGhlXG4gIC8vIGxlYWRpbmcgZWRnZSwgaW5zdGVhZCBvZiB0aGUgdHJhaWxpbmcuXG4gIF8uZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICB2YXIgdGltZW91dCwgYXJncywgY29udGV4dCwgdGltZXN0YW1wLCByZXN1bHQ7XG5cbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBsYXN0ID0gXy5ub3coKSAtIHRpbWVzdGFtcDtcblxuICAgICAgaWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPj0gMCkge1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICB0aW1lc3RhbXAgPSBfLm5vdygpO1xuICAgICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICBpZiAoIXRpbWVvdXQpIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgIGlmIChjYWxsTm93KSB7XG4gICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgdGhlIGZpcnN0IGZ1bmN0aW9uIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byB0aGUgc2Vjb25kLFxuICAvLyBhbGxvd2luZyB5b3UgdG8gYWRqdXN0IGFyZ3VtZW50cywgcnVuIGNvZGUgYmVmb3JlIGFuZCBhZnRlciwgYW5kXG4gIC8vIGNvbmRpdGlvbmFsbHkgZXhlY3V0ZSB0aGUgb3JpZ2luYWwgZnVuY3Rpb24uXG4gIF8ud3JhcCA9IGZ1bmN0aW9uKGZ1bmMsIHdyYXBwZXIpIHtcbiAgICByZXR1cm4gXy5wYXJ0aWFsKHdyYXBwZXIsIGZ1bmMpO1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBuZWdhdGVkIHZlcnNpb24gb2YgdGhlIHBhc3NlZC1pbiBwcmVkaWNhdGUuXG4gIF8ubmVnYXRlID0gZnVuY3Rpb24ocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICFwcmVkaWNhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGlzIHRoZSBjb21wb3NpdGlvbiBvZiBhIGxpc3Qgb2YgZnVuY3Rpb25zLCBlYWNoXG4gIC8vIGNvbnN1bWluZyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiB0aGF0IGZvbGxvd3MuXG4gIF8uY29tcG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBzdGFydCA9IGFyZ3MubGVuZ3RoIC0gMTtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaSA9IHN0YXJ0O1xuICAgICAgdmFyIHJlc3VsdCA9IGFyZ3Nbc3RhcnRdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB3aGlsZSAoaS0tKSByZXN1bHQgPSBhcmdzW2ldLmNhbGwodGhpcywgcmVzdWx0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgb24gYW5kIGFmdGVyIHRoZSBOdGggY2FsbC5cbiAgXy5hZnRlciA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPCAxKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIG9ubHkgYmUgZXhlY3V0ZWQgdXAgdG8gKGJ1dCBub3QgaW5jbHVkaW5nKSB0aGUgTnRoIGNhbGwuXG4gIF8uYmVmb3JlID0gZnVuY3Rpb24odGltZXMsIGZ1bmMpIHtcbiAgICB2YXIgbWVtbztcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoLS10aW1lcyA+IDApIHtcbiAgICAgICAgbWVtbyA9IGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aW1lcyA8PSAxKSBmdW5jID0gbnVsbDtcbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBhdCBtb3N0IG9uZSB0aW1lLCBubyBtYXR0ZXIgaG93XG4gIC8vIG9mdGVuIHlvdSBjYWxsIGl0LiBVc2VmdWwgZm9yIGxhenkgaW5pdGlhbGl6YXRpb24uXG4gIF8ub25jZSA9IF8ucGFydGlhbChfLmJlZm9yZSwgMik7XG5cbiAgLy8gT2JqZWN0IEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gS2V5cyBpbiBJRSA8IDkgdGhhdCB3b24ndCBiZSBpdGVyYXRlZCBieSBgZm9yIGtleSBpbiAuLi5gIGFuZCB0aHVzIG1pc3NlZC5cbiAgdmFyIGhhc0VudW1CdWcgPSAhe3RvU3RyaW5nOiBudWxsfS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKTtcbiAgdmFyIG5vbkVudW1lcmFibGVQcm9wcyA9IFsndmFsdWVPZicsICdpc1Byb3RvdHlwZU9mJywgJ3RvU3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgICAgICAncHJvcGVydHlJc0VudW1lcmFibGUnLCAnaGFzT3duUHJvcGVydHknLCAndG9Mb2NhbGVTdHJpbmcnXTtcblxuICBmdW5jdGlvbiBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cykge1xuICAgIHZhciBub25FbnVtSWR4ID0gbm9uRW51bWVyYWJsZVByb3BzLmxlbmd0aDtcbiAgICB2YXIgY29uc3RydWN0b3IgPSBvYmouY29uc3RydWN0b3I7XG4gICAgdmFyIHByb3RvID0gKF8uaXNGdW5jdGlvbihjb25zdHJ1Y3RvcikgJiYgY29uc3RydWN0b3IucHJvdG90eXBlKSB8fCBPYmpQcm90bztcblxuICAgIC8vIENvbnN0cnVjdG9yIGlzIGEgc3BlY2lhbCBjYXNlLlxuICAgIHZhciBwcm9wID0gJ2NvbnN0cnVjdG9yJztcbiAgICBpZiAoXy5oYXMob2JqLCBwcm9wKSAmJiAhXy5jb250YWlucyhrZXlzLCBwcm9wKSkga2V5cy5wdXNoKHByb3ApO1xuXG4gICAgd2hpbGUgKG5vbkVudW1JZHgtLSkge1xuICAgICAgcHJvcCA9IG5vbkVudW1lcmFibGVQcm9wc1tub25FbnVtSWR4XTtcbiAgICAgIGlmIChwcm9wIGluIG9iaiAmJiBvYmpbcHJvcF0gIT09IHByb3RvW3Byb3BdICYmICFfLmNvbnRhaW5zKGtleXMsIHByb3ApKSB7XG4gICAgICAgIGtleXMucHVzaChwcm9wKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBSZXRyaWV2ZSB0aGUgbmFtZXMgb2YgYW4gb2JqZWN0J3Mgb3duIHByb3BlcnRpZXMuXG4gIC8vIERlbGVnYXRlcyB0byAqKkVDTUFTY3JpcHQgNSoqJ3MgbmF0aXZlIGBPYmplY3Qua2V5c2BcbiAgXy5rZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICBpZiAobmF0aXZlS2V5cykgcmV0dXJuIG5hdGl2ZUtleXMob2JqKTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGlmIChfLmhhcyhvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICAgIC8vIEFoZW0sIElFIDwgOS5cbiAgICBpZiAoaGFzRW51bUJ1ZykgY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIGFsbCB0aGUgcHJvcGVydHkgbmFtZXMgb2YgYW4gb2JqZWN0LlxuICBfLmFsbEtleXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIFtdO1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikga2V5cy5wdXNoKGtleSk7XG4gICAgLy8gQWhlbSwgSUUgPCA5LlxuICAgIGlmIChoYXNFbnVtQnVnKSBjb2xsZWN0Tm9uRW51bVByb3BzKG9iaiwga2V5cyk7XG4gICAgcmV0dXJuIGtleXM7XG4gIH07XG5cbiAgLy8gUmV0cmlldmUgdGhlIHZhbHVlcyBvZiBhbiBvYmplY3QncyBwcm9wZXJ0aWVzLlxuICBfLnZhbHVlcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciB2YWx1ZXMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhbHVlc1tpXSA9IG9ialtrZXlzW2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcztcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSByZXN1bHRzIG9mIGFwcGx5aW5nIHRoZSBpdGVyYXRlZSB0byBlYWNoIGVsZW1lbnQgb2YgdGhlIG9iamVjdFxuICAvLyBJbiBjb250cmFzdCB0byBfLm1hcCBpdCByZXR1cm5zIGFuIG9iamVjdFxuICBfLm1hcE9iamVjdCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9ICBfLmtleXMob2JqKSxcbiAgICAgICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aCxcbiAgICAgICAgICByZXN1bHRzID0ge30sXG4gICAgICAgICAgY3VycmVudEtleTtcbiAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgY3VycmVudEtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgICByZXN1bHRzW2N1cnJlbnRLZXldID0gaXRlcmF0ZWUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ29udmVydCBhbiBvYmplY3QgaW50byBhIGxpc3Qgb2YgYFtrZXksIHZhbHVlXWAgcGFpcnMuXG4gIF8ucGFpcnMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgcGFpcnMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhaXJzW2ldID0gW2tleXNbaV0sIG9ialtrZXlzW2ldXV07XG4gICAgfVxuICAgIHJldHVybiBwYWlycztcbiAgfTtcblxuICAvLyBJbnZlcnQgdGhlIGtleXMgYW5kIHZhbHVlcyBvZiBhbiBvYmplY3QuIFRoZSB2YWx1ZXMgbXVzdCBiZSBzZXJpYWxpemFibGUuXG4gIF8uaW52ZXJ0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdFtvYmpba2V5c1tpXV1dID0ga2V5c1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvLyBSZXR1cm4gYSBzb3J0ZWQgbGlzdCBvZiB0aGUgZnVuY3Rpb24gbmFtZXMgYXZhaWxhYmxlIG9uIHRoZSBvYmplY3QuXG4gIC8vIEFsaWFzZWQgYXMgYG1ldGhvZHNgXG4gIF8uZnVuY3Rpb25zID0gXy5tZXRob2RzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIG5hbWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihvYmpba2V5XSkpIG5hbWVzLnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKTtcbiAgfTtcblxuICAvLyBFeHRlbmQgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIHByb3BlcnRpZXMgaW4gcGFzc2VkLWluIG9iamVjdChzKS5cbiAgXy5leHRlbmQgPSBjcmVhdGVBc3NpZ25lcihfLmFsbEtleXMpO1xuXG4gIC8vIEFzc2lnbnMgYSBnaXZlbiBvYmplY3Qgd2l0aCBhbGwgdGhlIG93biBwcm9wZXJ0aWVzIGluIHRoZSBwYXNzZWQtaW4gb2JqZWN0KHMpXG4gIC8vIChodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduKVxuICBfLmV4dGVuZE93biA9IF8uYXNzaWduID0gY3JlYXRlQXNzaWduZXIoXy5rZXlzKTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBrZXkgb24gYW4gb2JqZWN0IHRoYXQgcGFzc2VzIGEgcHJlZGljYXRlIHRlc3RcbiAgXy5maW5kS2V5ID0gZnVuY3Rpb24ob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICBwcmVkaWNhdGUgPSBjYihwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaiksIGtleTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmIChwcmVkaWNhdGUob2JqW2tleV0sIGtleSwgb2JqKSkgcmV0dXJuIGtleTtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgY29weSBvZiB0aGUgb2JqZWN0IG9ubHkgY29udGFpbmluZyB0aGUgd2hpdGVsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5waWNrID0gZnVuY3Rpb24ob2JqZWN0LCBvaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0ge30sIG9iaiA9IG9iamVjdCwgaXRlcmF0ZWUsIGtleXM7XG4gICAgaWYgKG9iaiA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xuICAgIGlmIChfLmlzRnVuY3Rpb24ob2l0ZXJhdGVlKSkge1xuICAgICAga2V5cyA9IF8uYWxsS2V5cyhvYmopO1xuICAgICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKG9pdGVyYXRlZSwgY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtleXMgPSBmbGF0dGVuKGFyZ3VtZW50cywgZmFsc2UsIGZhbHNlLCAxKTtcbiAgICAgIGl0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGtleSwgb2JqKSB7IHJldHVybiBrZXkgaW4gb2JqOyB9O1xuICAgICAgb2JqID0gT2JqZWN0KG9iaik7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgIHZhciB2YWx1ZSA9IG9ialtrZXldO1xuICAgICAgaWYgKGl0ZXJhdGVlKHZhbHVlLCBrZXksIG9iaikpIHJlc3VsdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCB3aXRob3V0IHRoZSBibGFja2xpc3RlZCBwcm9wZXJ0aWVzLlxuICBfLm9taXQgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaWYgKF8uaXNGdW5jdGlvbihpdGVyYXRlZSkpIHtcbiAgICAgIGl0ZXJhdGVlID0gXy5uZWdhdGUoaXRlcmF0ZWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIga2V5cyA9IF8ubWFwKGZsYXR0ZW4oYXJndW1lbnRzLCBmYWxzZSwgZmFsc2UsIDEpLCBTdHJpbmcpO1xuICAgICAgaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIHJldHVybiAhXy5jb250YWlucyhrZXlzLCBrZXkpO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIF8ucGljayhvYmosIGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgfTtcblxuICAvLyBGaWxsIGluIGEgZ2l2ZW4gb2JqZWN0IHdpdGggZGVmYXVsdCBwcm9wZXJ0aWVzLlxuICBfLmRlZmF1bHRzID0gY3JlYXRlQXNzaWduZXIoXy5hbGxLZXlzLCB0cnVlKTtcblxuICAvLyBDcmVhdGUgYSAoc2hhbGxvdy1jbG9uZWQpIGR1cGxpY2F0ZSBvZiBhbiBvYmplY3QuXG4gIF8uY2xvbmUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIV8uaXNPYmplY3Qob2JqKSkgcmV0dXJuIG9iajtcbiAgICByZXR1cm4gXy5pc0FycmF5KG9iaikgPyBvYmouc2xpY2UoKSA6IF8uZXh0ZW5kKHt9LCBvYmopO1xuICB9O1xuXG4gIC8vIEludm9rZXMgaW50ZXJjZXB0b3Igd2l0aCB0aGUgb2JqLCBhbmQgdGhlbiByZXR1cm5zIG9iai5cbiAgLy8gVGhlIHByaW1hcnkgcHVycG9zZSBvZiB0aGlzIG1ldGhvZCBpcyB0byBcInRhcCBpbnRvXCIgYSBtZXRob2QgY2hhaW4sIGluXG4gIC8vIG9yZGVyIHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiBpbnRlcm1lZGlhdGUgcmVzdWx0cyB3aXRoaW4gdGhlIGNoYWluLlxuICBfLnRhcCA9IGZ1bmN0aW9uKG9iaiwgaW50ZXJjZXB0b3IpIHtcbiAgICBpbnRlcmNlcHRvcihvYmopO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgLy8gUmV0dXJucyB3aGV0aGVyIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBzZXQgb2YgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8uaXNNYXRjaCA9IGZ1bmN0aW9uKG9iamVjdCwgYXR0cnMpIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhhdHRycyksIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkgcmV0dXJuICFsZW5ndGg7XG4gICAgdmFyIG9iaiA9IE9iamVjdChvYmplY3QpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgICAgaWYgKGF0dHJzW2tleV0gIT09IG9ialtrZXldIHx8ICEoa2V5IGluIG9iaikpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cblxuICAvLyBJbnRlcm5hbCByZWN1cnNpdmUgY29tcGFyaXNvbiBmdW5jdGlvbiBmb3IgYGlzRXF1YWxgLlxuICB2YXIgZXEgPSBmdW5jdGlvbihhLCBiLCBhU3RhY2ssIGJTdGFjaykge1xuICAgIC8vIElkZW50aWNhbCBvYmplY3RzIGFyZSBlcXVhbC4gYDAgPT09IC0wYCwgYnV0IHRoZXkgYXJlbid0IGlkZW50aWNhbC5cbiAgICAvLyBTZWUgdGhlIFtIYXJtb255IGBlZ2FsYCBwcm9wb3NhbF0oaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9aGFybW9ueTplZ2FsKS5cbiAgICBpZiAoYSA9PT0gYikgcmV0dXJuIGEgIT09IDAgfHwgMSAvIGEgPT09IDEgLyBiO1xuICAgIC8vIEEgc3RyaWN0IGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYG51bGwgPT0gdW5kZWZpbmVkYC5cbiAgICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkgcmV0dXJuIGEgPT09IGI7XG4gICAgLy8gVW53cmFwIGFueSB3cmFwcGVkIG9iamVjdHMuXG4gICAgaWYgKGEgaW5zdGFuY2VvZiBfKSBhID0gYS5fd3JhcHBlZDtcbiAgICBpZiAoYiBpbnN0YW5jZW9mIF8pIGIgPSBiLl93cmFwcGVkO1xuICAgIC8vIENvbXBhcmUgYFtbQ2xhc3NdXWAgbmFtZXMuXG4gICAgdmFyIGNsYXNzTmFtZSA9IHRvU3RyaW5nLmNhbGwoYSk7XG4gICAgaWYgKGNsYXNzTmFtZSAhPT0gdG9TdHJpbmcuY2FsbChiKSkgcmV0dXJuIGZhbHNlO1xuICAgIHN3aXRjaCAoY2xhc3NOYW1lKSB7XG4gICAgICAvLyBTdHJpbmdzLCBudW1iZXJzLCByZWd1bGFyIGV4cHJlc3Npb25zLCBkYXRlcywgYW5kIGJvb2xlYW5zIGFyZSBjb21wYXJlZCBieSB2YWx1ZS5cbiAgICAgIGNhc2UgJ1tvYmplY3QgUmVnRXhwXSc6XG4gICAgICAvLyBSZWdFeHBzIGFyZSBjb2VyY2VkIHRvIHN0cmluZ3MgZm9yIGNvbXBhcmlzb24gKE5vdGU6ICcnICsgL2EvaSA9PT0gJy9hL2knKVxuICAgICAgY2FzZSAnW29iamVjdCBTdHJpbmddJzpcbiAgICAgICAgLy8gUHJpbWl0aXZlcyBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBvYmplY3Qgd3JhcHBlcnMgYXJlIGVxdWl2YWxlbnQ7IHRodXMsIGBcIjVcImAgaXNcbiAgICAgICAgLy8gZXF1aXZhbGVudCB0byBgbmV3IFN0cmluZyhcIjVcIilgLlxuICAgICAgICByZXR1cm4gJycgKyBhID09PSAnJyArIGI7XG4gICAgICBjYXNlICdbb2JqZWN0IE51bWJlcl0nOlxuICAgICAgICAvLyBgTmFOYHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBub24tcmVmbGV4aXZlLlxuICAgICAgICAvLyBPYmplY3QoTmFOKSBpcyBlcXVpdmFsZW50IHRvIE5hTlxuICAgICAgICBpZiAoK2EgIT09ICthKSByZXR1cm4gK2IgIT09ICtiO1xuICAgICAgICAvLyBBbiBgZWdhbGAgY29tcGFyaXNvbiBpcyBwZXJmb3JtZWQgZm9yIG90aGVyIG51bWVyaWMgdmFsdWVzLlxuICAgICAgICByZXR1cm4gK2EgPT09IDAgPyAxIC8gK2EgPT09IDEgLyBiIDogK2EgPT09ICtiO1xuICAgICAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgICBjYXNlICdbb2JqZWN0IEJvb2xlYW5dJzpcbiAgICAgICAgLy8gQ29lcmNlIGRhdGVzIGFuZCBib29sZWFucyB0byBudW1lcmljIHByaW1pdGl2ZSB2YWx1ZXMuIERhdGVzIGFyZSBjb21wYXJlZCBieSB0aGVpclxuICAgICAgICAvLyBtaWxsaXNlY29uZCByZXByZXNlbnRhdGlvbnMuIE5vdGUgdGhhdCBpbnZhbGlkIGRhdGVzIHdpdGggbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zXG4gICAgICAgIC8vIG9mIGBOYU5gIGFyZSBub3QgZXF1aXZhbGVudC5cbiAgICAgICAgcmV0dXJuICthID09PSArYjtcbiAgICB9XG5cbiAgICB2YXIgYXJlQXJyYXlzID0gY2xhc3NOYW1lID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIGlmICghYXJlQXJyYXlzKSB7XG4gICAgICBpZiAodHlwZW9mIGEgIT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgIT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcblxuICAgICAgLy8gT2JqZWN0cyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVpdmFsZW50LCBidXQgYE9iamVjdGBzIG9yIGBBcnJheWBzXG4gICAgICAvLyBmcm9tIGRpZmZlcmVudCBmcmFtZXMgYXJlLlxuICAgICAgdmFyIGFDdG9yID0gYS5jb25zdHJ1Y3RvciwgYkN0b3IgPSBiLmNvbnN0cnVjdG9yO1xuICAgICAgaWYgKGFDdG9yICE9PSBiQ3RvciAmJiAhKF8uaXNGdW5jdGlvbihhQ3RvcikgJiYgYUN0b3IgaW5zdGFuY2VvZiBhQ3RvciAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF8uaXNGdW5jdGlvbihiQ3RvcikgJiYgYkN0b3IgaW5zdGFuY2VvZiBiQ3RvcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKCdjb25zdHJ1Y3RvcicgaW4gYSAmJiAnY29uc3RydWN0b3InIGluIGIpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gQXNzdW1lIGVxdWFsaXR5IGZvciBjeWNsaWMgc3RydWN0dXJlcy4gVGhlIGFsZ29yaXRobSBmb3IgZGV0ZWN0aW5nIGN5Y2xpY1xuICAgIC8vIHN0cnVjdHVyZXMgaXMgYWRhcHRlZCBmcm9tIEVTIDUuMSBzZWN0aW9uIDE1LjEyLjMsIGFic3RyYWN0IG9wZXJhdGlvbiBgSk9gLlxuICAgIFxuICAgIC8vIEluaXRpYWxpemluZyBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICAvLyBJdCdzIGRvbmUgaGVyZSBzaW5jZSB3ZSBvbmx5IG5lZWQgdGhlbSBmb3Igb2JqZWN0cyBhbmQgYXJyYXlzIGNvbXBhcmlzb24uXG4gICAgYVN0YWNrID0gYVN0YWNrIHx8IFtdO1xuICAgIGJTdGFjayA9IGJTdGFjayB8fCBbXTtcbiAgICB2YXIgbGVuZ3RoID0gYVN0YWNrLmxlbmd0aDtcbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIC8vIExpbmVhciBzZWFyY2guIFBlcmZvcm1hbmNlIGlzIGludmVyc2VseSBwcm9wb3J0aW9uYWwgdG8gdGhlIG51bWJlciBvZlxuICAgICAgLy8gdW5pcXVlIG5lc3RlZCBzdHJ1Y3R1cmVzLlxuICAgICAgaWYgKGFTdGFja1tsZW5ndGhdID09PSBhKSByZXR1cm4gYlN0YWNrW2xlbmd0aF0gPT09IGI7XG4gICAgfVxuXG4gICAgLy8gQWRkIHRoZSBmaXJzdCBvYmplY3QgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wdXNoKGEpO1xuICAgIGJTdGFjay5wdXNoKGIpO1xuXG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIGFuZCBhcnJheXMuXG4gICAgaWYgKGFyZUFycmF5cykge1xuICAgICAgLy8gQ29tcGFyZSBhcnJheSBsZW5ndGhzIHRvIGRldGVybWluZSBpZiBhIGRlZXAgY29tcGFyaXNvbiBpcyBuZWNlc3NhcnkuXG4gICAgICBsZW5ndGggPSBhLmxlbmd0aDtcbiAgICAgIGlmIChsZW5ndGggIT09IGIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgdGhlIGNvbnRlbnRzLCBpZ25vcmluZyBub24tbnVtZXJpYyBwcm9wZXJ0aWVzLlxuICAgICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAgIGlmICghZXEoYVtsZW5ndGhdLCBiW2xlbmd0aF0sIGFTdGFjaywgYlN0YWNrKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZWVwIGNvbXBhcmUgb2JqZWN0cy5cbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKGEpLCBrZXk7XG4gICAgICBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICAgIC8vIEVuc3VyZSB0aGF0IGJvdGggb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIG51bWJlciBvZiBwcm9wZXJ0aWVzIGJlZm9yZSBjb21wYXJpbmcgZGVlcCBlcXVhbGl0eS5cbiAgICAgIGlmIChfLmtleXMoYikubGVuZ3RoICE9PSBsZW5ndGgpIHJldHVybiBmYWxzZTtcbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICAvLyBEZWVwIGNvbXBhcmUgZWFjaCBtZW1iZXJcbiAgICAgICAga2V5ID0ga2V5c1tsZW5ndGhdO1xuICAgICAgICBpZiAoIShfLmhhcyhiLCBrZXkpICYmIGVxKGFba2V5XSwgYltrZXldLCBhU3RhY2ssIGJTdGFjaykpKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFJlbW92ZSB0aGUgZmlyc3Qgb2JqZWN0IGZyb20gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzLlxuICAgIGFTdGFjay5wb3AoKTtcbiAgICBiU3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gUGVyZm9ybSBhIGRlZXAgY29tcGFyaXNvbiB0byBjaGVjayBpZiB0d28gb2JqZWN0cyBhcmUgZXF1YWwuXG4gIF8uaXNFcXVhbCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gZXEoYSwgYik7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiBhcnJheSwgc3RyaW5nLCBvciBvYmplY3QgZW1wdHk/XG4gIC8vIEFuIFwiZW1wdHlcIiBvYmplY3QgaGFzIG5vIGVudW1lcmFibGUgb3duLXByb3BlcnRpZXMuXG4gIF8uaXNFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikgJiYgKF8uaXNBcnJheShvYmopIHx8IF8uaXNTdHJpbmcob2JqKSB8fCBfLmlzQXJndW1lbnRzKG9iaikpKSByZXR1cm4gb2JqLmxlbmd0aCA9PT0gMDtcbiAgICByZXR1cm4gXy5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBET00gZWxlbWVudD9cbiAgXy5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBhbiBhcnJheT9cbiAgLy8gRGVsZWdhdGVzIHRvIEVDTUE1J3MgbmF0aXZlIEFycmF5LmlzQXJyYXlcbiAgXy5pc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFyaWFibGUgYW4gb2JqZWN0P1xuICBfLmlzT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHR5cGUgPSB0eXBlb2Ygb2JqO1xuICAgIHJldHVybiB0eXBlID09PSAnZnVuY3Rpb24nIHx8IHR5cGUgPT09ICdvYmplY3QnICYmICEhb2JqO1xuICB9O1xuXG4gIC8vIEFkZCBzb21lIGlzVHlwZSBtZXRob2RzOiBpc0FyZ3VtZW50cywgaXNGdW5jdGlvbiwgaXNTdHJpbmcsIGlzTnVtYmVyLCBpc0RhdGUsIGlzUmVnRXhwLCBpc0Vycm9yLlxuICBfLmVhY2goWydBcmd1bWVudHMnLCAnRnVuY3Rpb24nLCAnU3RyaW5nJywgJ051bWJlcicsICdEYXRlJywgJ1JlZ0V4cCcsICdFcnJvciddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgX1snaXMnICsgbmFtZV0gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0ICcgKyBuYW1lICsgJ10nO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIERlZmluZSBhIGZhbGxiYWNrIHZlcnNpb24gb2YgdGhlIG1ldGhvZCBpbiBicm93c2VycyAoYWhlbSwgSUUgPCA5KSwgd2hlcmVcbiAgLy8gdGhlcmUgaXNuJ3QgYW55IGluc3BlY3RhYmxlIFwiQXJndW1lbnRzXCIgdHlwZS5cbiAgaWYgKCFfLmlzQXJndW1lbnRzKGFyZ3VtZW50cykpIHtcbiAgICBfLmlzQXJndW1lbnRzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gXy5oYXMob2JqLCAnY2FsbGVlJyk7XG4gICAgfTtcbiAgfVxuXG4gIC8vIE9wdGltaXplIGBpc0Z1bmN0aW9uYCBpZiBhcHByb3ByaWF0ZS4gV29yayBhcm91bmQgc29tZSB0eXBlb2YgYnVncyBpbiBvbGQgdjgsXG4gIC8vIElFIDExICgjMTYyMSksIGFuZCBpbiBTYWZhcmkgOCAoIzE5MjkpLlxuICBpZiAodHlwZW9mIC8uLyAhPSAnZnVuY3Rpb24nICYmIHR5cGVvZiBJbnQ4QXJyYXkgIT0gJ29iamVjdCcpIHtcbiAgICBfLmlzRnVuY3Rpb24gPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09ICdmdW5jdGlvbicgfHwgZmFsc2U7XG4gICAgfTtcbiAgfVxuXG4gIC8vIElzIGEgZ2l2ZW4gb2JqZWN0IGEgZmluaXRlIG51bWJlcj9cbiAgXy5pc0Zpbml0ZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBpc0Zpbml0ZShvYmopICYmICFpc05hTihwYXJzZUZsb2F0KG9iaikpO1xuICB9O1xuXG4gIC8vIElzIHRoZSBnaXZlbiB2YWx1ZSBgTmFOYD8gKE5hTiBpcyB0aGUgb25seSBudW1iZXIgd2hpY2ggZG9lcyBub3QgZXF1YWwgaXRzZWxmKS5cbiAgXy5pc05hTiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzTnVtYmVyKG9iaikgJiYgb2JqICE9PSArb2JqO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYSBib29sZWFuP1xuICBfLmlzQm9vbGVhbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSBmYWxzZSB8fCB0b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEJvb2xlYW5dJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGVxdWFsIHRvIG51bGw/XG4gIF8uaXNOdWxsID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gbnVsbDtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIHVuZGVmaW5lZD9cbiAgXy5pc1VuZGVmaW5lZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHZvaWQgMDtcbiAgfTtcblxuICAvLyBTaG9ydGN1dCBmdW5jdGlvbiBmb3IgY2hlY2tpbmcgaWYgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHByb3BlcnR5IGRpcmVjdGx5XG4gIC8vIG9uIGl0c2VsZiAoaW4gb3RoZXIgd29yZHMsIG5vdCBvbiBhIHByb3RvdHlwZSkuXG4gIF8uaGFzID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XG4gIH07XG5cbiAgLy8gVXRpbGl0eSBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBSdW4gVW5kZXJzY29yZS5qcyBpbiAqbm9Db25mbGljdCogbW9kZSwgcmV0dXJuaW5nIHRoZSBgX2AgdmFyaWFibGUgdG8gaXRzXG4gIC8vIHByZXZpb3VzIG93bmVyLiBSZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgcm9vdC5fID0gcHJldmlvdXNVbmRlcnNjb3JlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8vIEtlZXAgdGhlIGlkZW50aXR5IGZ1bmN0aW9uIGFyb3VuZCBmb3IgZGVmYXVsdCBpdGVyYXRlZXMuXG4gIF8uaWRlbnRpdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcblxuICAvLyBQcmVkaWNhdGUtZ2VuZXJhdGluZyBmdW5jdGlvbnMuIE9mdGVuIHVzZWZ1bCBvdXRzaWRlIG9mIFVuZGVyc2NvcmUuXG4gIF8uY29uc3RhbnQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICB9O1xuXG4gIF8ubm9vcCA9IGZ1bmN0aW9uKCl7fTtcblxuICBfLnByb3BlcnR5ID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiA9PSBudWxsID8gdm9pZCAwIDogb2JqW2tleV07XG4gICAgfTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZXMgYSBmdW5jdGlvbiBmb3IgYSBnaXZlbiBvYmplY3QgdGhhdCByZXR1cm5zIGEgZ2l2ZW4gcHJvcGVydHkuXG4gIF8ucHJvcGVydHlPZiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT0gbnVsbCA/IGZ1bmN0aW9uKCl7fSA6IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIG9ialtrZXldO1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIHByZWRpY2F0ZSBmb3IgY2hlY2tpbmcgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mIFxuICAvLyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy5tYXRjaGVyID0gXy5tYXRjaGVzID0gZnVuY3Rpb24oYXR0cnMpIHtcbiAgICBhdHRycyA9IF8uZXh0ZW5kT3duKHt9LCBhdHRycyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIF8uaXNNYXRjaChvYmosIGF0dHJzKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJ1biBhIGZ1bmN0aW9uICoqbioqIHRpbWVzLlxuICBfLnRpbWVzID0gZnVuY3Rpb24obiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgYWNjdW0gPSBBcnJheShNYXRoLm1heCgwLCBuKSk7XG4gICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0LCAxKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG47IGkrKykgYWNjdW1baV0gPSBpdGVyYXRlZShpKTtcbiAgICByZXR1cm4gYWNjdW07XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gYW5kIG1heCAoaW5jbHVzaXZlKS5cbiAgXy5yYW5kb20gPSBmdW5jdGlvbihtaW4sIG1heCkge1xuICAgIGlmIChtYXggPT0gbnVsbCkge1xuICAgICAgbWF4ID0gbWluO1xuICAgICAgbWluID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIG1pbiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSk7XG4gIH07XG5cbiAgLy8gQSAocG9zc2libHkgZmFzdGVyKSB3YXkgdG8gZ2V0IHRoZSBjdXJyZW50IHRpbWVzdGFtcCBhcyBhbiBpbnRlZ2VyLlxuICBfLm5vdyA9IERhdGUubm93IHx8IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfTtcblxuICAgLy8gTGlzdCBvZiBIVE1MIGVudGl0aWVzIGZvciBlc2NhcGluZy5cbiAgdmFyIGVzY2FwZU1hcCA9IHtcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0OycsXG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmI3gyNzsnLFxuICAgICdgJzogJyYjeDYwOydcbiAgfTtcbiAgdmFyIHVuZXNjYXBlTWFwID0gXy5pbnZlcnQoZXNjYXBlTWFwKTtcblxuICAvLyBGdW5jdGlvbnMgZm9yIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nIHN0cmluZ3MgdG8vZnJvbSBIVE1MIGludGVycG9sYXRpb24uXG4gIHZhciBjcmVhdGVFc2NhcGVyID0gZnVuY3Rpb24obWFwKSB7XG4gICAgdmFyIGVzY2FwZXIgPSBmdW5jdGlvbihtYXRjaCkge1xuICAgICAgcmV0dXJuIG1hcFttYXRjaF07XG4gICAgfTtcbiAgICAvLyBSZWdleGVzIGZvciBpZGVudGlmeWluZyBhIGtleSB0aGF0IG5lZWRzIHRvIGJlIGVzY2FwZWRcbiAgICB2YXIgc291cmNlID0gJyg/OicgKyBfLmtleXMobWFwKS5qb2luKCd8JykgKyAnKSc7XG4gICAgdmFyIHRlc3RSZWdleHAgPSBSZWdFeHAoc291cmNlKTtcbiAgICB2YXIgcmVwbGFjZVJlZ2V4cCA9IFJlZ0V4cChzb3VyY2UsICdnJyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgc3RyaW5nID0gc3RyaW5nID09IG51bGwgPyAnJyA6ICcnICsgc3RyaW5nO1xuICAgICAgcmV0dXJuIHRlc3RSZWdleHAudGVzdChzdHJpbmcpID8gc3RyaW5nLnJlcGxhY2UocmVwbGFjZVJlZ2V4cCwgZXNjYXBlcikgOiBzdHJpbmc7XG4gICAgfTtcbiAgfTtcbiAgXy5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKGVzY2FwZU1hcCk7XG4gIF8udW5lc2NhcGUgPSBjcmVhdGVFc2NhcGVyKHVuZXNjYXBlTWFwKTtcblxuICAvLyBJZiB0aGUgdmFsdWUgb2YgdGhlIG5hbWVkIGBwcm9wZXJ0eWAgaXMgYSBmdW5jdGlvbiB0aGVuIGludm9rZSBpdCB3aXRoIHRoZVxuICAvLyBgb2JqZWN0YCBhcyBjb250ZXh0OyBvdGhlcndpc2UsIHJldHVybiBpdC5cbiAgXy5yZXN1bHQgPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5LCBmYWxsYmFjaykge1xuICAgIHZhciB2YWx1ZSA9IG9iamVjdCA9PSBudWxsID8gdm9pZCAwIDogb2JqZWN0W3Byb3BlcnR5XTtcbiAgICBpZiAodmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgdmFsdWUgPSBmYWxsYmFjaztcbiAgICB9XG4gICAgcmV0dXJuIF8uaXNGdW5jdGlvbih2YWx1ZSkgPyB2YWx1ZS5jYWxsKG9iamVjdCkgOiB2YWx1ZTtcbiAgfTtcblxuICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBpbnRlZ2VyIGlkICh1bmlxdWUgd2l0aGluIHRoZSBlbnRpcmUgY2xpZW50IHNlc3Npb24pLlxuICAvLyBVc2VmdWwgZm9yIHRlbXBvcmFyeSBET00gaWRzLlxuICB2YXIgaWRDb3VudGVyID0gMDtcbiAgXy51bmlxdWVJZCA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgIHZhciBpZCA9ICsraWRDb3VudGVyICsgJyc7XG4gICAgcmV0dXJuIHByZWZpeCA/IHByZWZpeCArIGlkIDogaWQ7XG4gIH07XG5cbiAgLy8gQnkgZGVmYXVsdCwgVW5kZXJzY29yZSB1c2VzIEVSQi1zdHlsZSB0ZW1wbGF0ZSBkZWxpbWl0ZXJzLCBjaGFuZ2UgdGhlXG4gIC8vIGZvbGxvd2luZyB0ZW1wbGF0ZSBzZXR0aW5ncyB0byB1c2UgYWx0ZXJuYXRpdmUgZGVsaW1pdGVycy5cbiAgXy50ZW1wbGF0ZVNldHRpbmdzID0ge1xuICAgIGV2YWx1YXRlICAgIDogLzwlKFtcXHNcXFNdKz8pJT4vZyxcbiAgICBpbnRlcnBvbGF0ZSA6IC88JT0oW1xcc1xcU10rPyklPi9nLFxuICAgIGVzY2FwZSAgICAgIDogLzwlLShbXFxzXFxTXSs/KSU+L2dcbiAgfTtcblxuICAvLyBXaGVuIGN1c3RvbWl6aW5nIGB0ZW1wbGF0ZVNldHRpbmdzYCwgaWYgeW91IGRvbid0IHdhbnQgdG8gZGVmaW5lIGFuXG4gIC8vIGludGVycG9sYXRpb24sIGV2YWx1YXRpb24gb3IgZXNjYXBpbmcgcmVnZXgsIHdlIG5lZWQgb25lIHRoYXQgaXNcbiAgLy8gZ3VhcmFudGVlZCBub3QgdG8gbWF0Y2guXG4gIHZhciBub01hdGNoID0gLyguKV4vO1xuXG4gIC8vIENlcnRhaW4gY2hhcmFjdGVycyBuZWVkIHRvIGJlIGVzY2FwZWQgc28gdGhhdCB0aGV5IGNhbiBiZSBwdXQgaW50byBhXG4gIC8vIHN0cmluZyBsaXRlcmFsLlxuICB2YXIgZXNjYXBlcyA9IHtcbiAgICBcIidcIjogICAgICBcIidcIixcbiAgICAnXFxcXCc6ICAgICAnXFxcXCcsXG4gICAgJ1xccic6ICAgICAncicsXG4gICAgJ1xcbic6ICAgICAnbicsXG4gICAgJ1xcdTIwMjgnOiAndTIwMjgnLFxuICAgICdcXHUyMDI5JzogJ3UyMDI5J1xuICB9O1xuXG4gIHZhciBlc2NhcGVyID0gL1xcXFx8J3xcXHJ8XFxufFxcdTIwMjh8XFx1MjAyOS9nO1xuXG4gIHZhciBlc2NhcGVDaGFyID0gZnVuY3Rpb24obWF0Y2gpIHtcbiAgICByZXR1cm4gJ1xcXFwnICsgZXNjYXBlc1ttYXRjaF07XG4gIH07XG5cbiAgLy8gSmF2YVNjcmlwdCBtaWNyby10ZW1wbGF0aW5nLCBzaW1pbGFyIHRvIEpvaG4gUmVzaWcncyBpbXBsZW1lbnRhdGlvbi5cbiAgLy8gVW5kZXJzY29yZSB0ZW1wbGF0aW5nIGhhbmRsZXMgYXJiaXRyYXJ5IGRlbGltaXRlcnMsIHByZXNlcnZlcyB3aGl0ZXNwYWNlLFxuICAvLyBhbmQgY29ycmVjdGx5IGVzY2FwZXMgcXVvdGVzIHdpdGhpbiBpbnRlcnBvbGF0ZWQgY29kZS5cbiAgLy8gTkI6IGBvbGRTZXR0aW5nc2Agb25seSBleGlzdHMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuICBfLnRlbXBsYXRlID0gZnVuY3Rpb24odGV4dCwgc2V0dGluZ3MsIG9sZFNldHRpbmdzKSB7XG4gICAgaWYgKCFzZXR0aW5ncyAmJiBvbGRTZXR0aW5ncykgc2V0dGluZ3MgPSBvbGRTZXR0aW5ncztcbiAgICBzZXR0aW5ncyA9IF8uZGVmYXVsdHMoe30sIHNldHRpbmdzLCBfLnRlbXBsYXRlU2V0dGluZ3MpO1xuXG4gICAgLy8gQ29tYmluZSBkZWxpbWl0ZXJzIGludG8gb25lIHJlZ3VsYXIgZXhwcmVzc2lvbiB2aWEgYWx0ZXJuYXRpb24uXG4gICAgdmFyIG1hdGNoZXIgPSBSZWdFeHAoW1xuICAgICAgKHNldHRpbmdzLmVzY2FwZSB8fCBub01hdGNoKS5zb3VyY2UsXG4gICAgICAoc2V0dGluZ3MuaW50ZXJwb2xhdGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmV2YWx1YXRlIHx8IG5vTWF0Y2gpLnNvdXJjZVxuICAgIF0uam9pbignfCcpICsgJ3wkJywgJ2cnKTtcblxuICAgIC8vIENvbXBpbGUgdGhlIHRlbXBsYXRlIHNvdXJjZSwgZXNjYXBpbmcgc3RyaW5nIGxpdGVyYWxzIGFwcHJvcHJpYXRlbHkuXG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgc291cmNlID0gXCJfX3ArPSdcIjtcbiAgICB0ZXh0LnJlcGxhY2UobWF0Y2hlciwgZnVuY3Rpb24obWF0Y2gsIGVzY2FwZSwgaW50ZXJwb2xhdGUsIGV2YWx1YXRlLCBvZmZzZXQpIHtcbiAgICAgIHNvdXJjZSArPSB0ZXh0LnNsaWNlKGluZGV4LCBvZmZzZXQpLnJlcGxhY2UoZXNjYXBlciwgZXNjYXBlQ2hhcik7XG4gICAgICBpbmRleCA9IG9mZnNldCArIG1hdGNoLmxlbmd0aDtcblxuICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGVzY2FwZSArIFwiKSk9PW51bGw/Jyc6Xy5lc2NhcGUoX190KSkrXFxuJ1wiO1xuICAgICAgfSBlbHNlIGlmIChpbnRlcnBvbGF0ZSkge1xuICAgICAgICBzb3VyY2UgKz0gXCInK1xcbigoX190PShcIiArIGludGVycG9sYXRlICsgXCIpKT09bnVsbD8nJzpfX3QpK1xcbidcIjtcbiAgICAgIH0gZWxzZSBpZiAoZXZhbHVhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJztcXG5cIiArIGV2YWx1YXRlICsgXCJcXG5fX3ArPSdcIjtcbiAgICAgIH1cblxuICAgICAgLy8gQWRvYmUgVk1zIG5lZWQgdGhlIG1hdGNoIHJldHVybmVkIHRvIHByb2R1Y2UgdGhlIGNvcnJlY3Qgb2ZmZXN0LlxuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuICAgIHNvdXJjZSArPSBcIic7XFxuXCI7XG5cbiAgICAvLyBJZiBhIHZhcmlhYmxlIGlzIG5vdCBzcGVjaWZpZWQsIHBsYWNlIGRhdGEgdmFsdWVzIGluIGxvY2FsIHNjb3BlLlxuICAgIGlmICghc2V0dGluZ3MudmFyaWFibGUpIHNvdXJjZSA9ICd3aXRoKG9ianx8e30pe1xcbicgKyBzb3VyY2UgKyAnfVxcbic7XG5cbiAgICBzb3VyY2UgPSBcInZhciBfX3QsX19wPScnLF9faj1BcnJheS5wcm90b3R5cGUuam9pbixcIiArXG4gICAgICBcInByaW50PWZ1bmN0aW9uKCl7X19wKz1fX2ouY2FsbChhcmd1bWVudHMsJycpO307XFxuXCIgK1xuICAgICAgc291cmNlICsgJ3JldHVybiBfX3A7XFxuJztcblxuICAgIHRyeSB7XG4gICAgICB2YXIgcmVuZGVyID0gbmV3IEZ1bmN0aW9uKHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonLCAnXycsIHNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZS5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIHZhciB0ZW1wbGF0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJldHVybiByZW5kZXIuY2FsbCh0aGlzLCBkYXRhLCBfKTtcbiAgICB9O1xuXG4gICAgLy8gUHJvdmlkZSB0aGUgY29tcGlsZWQgc291cmNlIGFzIGEgY29udmVuaWVuY2UgZm9yIHByZWNvbXBpbGF0aW9uLlxuICAgIHZhciBhcmd1bWVudCA9IHNldHRpbmdzLnZhcmlhYmxlIHx8ICdvYmonO1xuICAgIHRlbXBsYXRlLnNvdXJjZSA9ICdmdW5jdGlvbignICsgYXJndW1lbnQgKyAnKXtcXG4nICsgc291cmNlICsgJ30nO1xuXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9O1xuXG4gIC8vIEFkZCBhIFwiY2hhaW5cIiBmdW5jdGlvbi4gU3RhcnQgY2hhaW5pbmcgYSB3cmFwcGVkIFVuZGVyc2NvcmUgb2JqZWN0LlxuICBfLmNoYWluID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGluc3RhbmNlID0gXyhvYmopO1xuICAgIGluc3RhbmNlLl9jaGFpbiA9IHRydWU7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9O1xuXG4gIC8vIE9PUFxuICAvLyAtLS0tLS0tLS0tLS0tLS1cbiAgLy8gSWYgVW5kZXJzY29yZSBpcyBjYWxsZWQgYXMgYSBmdW5jdGlvbiwgaXQgcmV0dXJucyBhIHdyYXBwZWQgb2JqZWN0IHRoYXRcbiAgLy8gY2FuIGJlIHVzZWQgT08tc3R5bGUuIFRoaXMgd3JhcHBlciBob2xkcyBhbHRlcmVkIHZlcnNpb25zIG9mIGFsbCB0aGVcbiAgLy8gdW5kZXJzY29yZSBmdW5jdGlvbnMuIFdyYXBwZWQgb2JqZWN0cyBtYXkgYmUgY2hhaW5lZC5cblxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gY29udGludWUgY2hhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMuXG4gIHZhciByZXN1bHQgPSBmdW5jdGlvbihpbnN0YW5jZSwgb2JqKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLl9jaGFpbiA/IF8ob2JqKS5jaGFpbigpIDogb2JqO1xuICB9O1xuXG4gIC8vIEFkZCB5b3VyIG93biBjdXN0b20gZnVuY3Rpb25zIHRvIHRoZSBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5taXhpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIF8uZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0KHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBBZGQgYWxsIG9mIHRoZSBVbmRlcnNjb3JlIGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlciBvYmplY3QuXG4gIF8ubWl4aW4oXyk7XG5cbiAgLy8gQWRkIGFsbCBtdXRhdG9yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgXy5lYWNoKFsncG9wJywgJ3B1c2gnLCAncmV2ZXJzZScsICdzaGlmdCcsICdzb3J0JywgJ3NwbGljZScsICd1bnNoaWZ0J10sIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgbWV0aG9kID0gQXJyYXlQcm90b1tuYW1lXTtcbiAgICBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9iaiA9IHRoaXMuX3dyYXBwZWQ7XG4gICAgICBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKChuYW1lID09PSAnc2hpZnQnIHx8IG5hbWUgPT09ICdzcGxpY2UnKSAmJiBvYmoubGVuZ3RoID09PSAwKSBkZWxldGUgb2JqWzBdO1xuICAgICAgcmV0dXJuIHJlc3VsdCh0aGlzLCBvYmopO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEFkZCBhbGwgYWNjZXNzb3IgQXJyYXkgZnVuY3Rpb25zIHRvIHRoZSB3cmFwcGVyLlxuICBfLmVhY2goWydjb25jYXQnLCAnam9pbicsICdzbGljZSddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByZXN1bHQodGhpcywgbWV0aG9kLmFwcGx5KHRoaXMuX3dyYXBwZWQsIGFyZ3VtZW50cykpO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIEV4dHJhY3RzIHRoZSByZXN1bHQgZnJvbSBhIHdyYXBwZWQgYW5kIGNoYWluZWQgb2JqZWN0LlxuICBfLnByb3RvdHlwZS52YWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl93cmFwcGVkO1xuICB9O1xuXG4gIC8vIFByb3ZpZGUgdW53cmFwcGluZyBwcm94eSBmb3Igc29tZSBtZXRob2RzIHVzZWQgaW4gZW5naW5lIG9wZXJhdGlvbnNcbiAgLy8gc3VjaCBhcyBhcml0aG1ldGljIGFuZCBKU09OIHN0cmluZ2lmaWNhdGlvbi5cbiAgXy5wcm90b3R5cGUudmFsdWVPZiA9IF8ucHJvdG90eXBlLnRvSlNPTiA9IF8ucHJvdG90eXBlLnZhbHVlO1xuICBcbiAgXy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJycgKyB0aGlzLl93cmFwcGVkO1xuICB9O1xuXG4gIC8vIEFNRCByZWdpc3RyYXRpb24gaGFwcGVucyBhdCB0aGUgZW5kIGZvciBjb21wYXRpYmlsaXR5IHdpdGggQU1EIGxvYWRlcnNcbiAgLy8gdGhhdCBtYXkgbm90IGVuZm9yY2UgbmV4dC10dXJuIHNlbWFudGljcyBvbiBtb2R1bGVzLiBFdmVuIHRob3VnaCBnZW5lcmFsXG4gIC8vIHByYWN0aWNlIGZvciBBTUQgcmVnaXN0cmF0aW9uIGlzIHRvIGJlIGFub255bW91cywgdW5kZXJzY29yZSByZWdpc3RlcnNcbiAgLy8gYXMgYSBuYW1lZCBtb2R1bGUgYmVjYXVzZSwgbGlrZSBqUXVlcnksIGl0IGlzIGEgYmFzZSBsaWJyYXJ5IHRoYXQgaXNcbiAgLy8gcG9wdWxhciBlbm91Z2ggdG8gYmUgYnVuZGxlZCBpbiBhIHRoaXJkIHBhcnR5IGxpYiwgYnV0IG5vdCBiZSBwYXJ0IG9mXG4gIC8vIGFuIEFNRCBsb2FkIHJlcXVlc3QuIFRob3NlIGNhc2VzIGNvdWxkIGdlbmVyYXRlIGFuIGVycm9yIHdoZW4gYW5cbiAgLy8gYW5vbnltb3VzIGRlZmluZSgpIGlzIGNhbGxlZCBvdXRzaWRlIG9mIGEgbG9hZGVyIHJlcXVlc3QuXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoJ3VuZGVyc2NvcmUnLCBbXSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gXztcbiAgICB9KTtcbiAgfVxufS5jYWxsKHRoaXMpKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuXG4vLyBTZXR1cFxuICAgIC8vIExvYWQgYW5kIGNyZWF0ZSBtYWluIHNldHRpbmdzLCBhbmQgc2F2ZSB0aGVtIHRvIHRoZSByb290IGdsb2JhbCBvYmplY3QuXG4gICAgdmFyIG1rX3NldHRpbmdzID0gcmVxdWlyZSgnLi9tb2R1bGVzL21rX3NldHRpbmdzJyk7XG4gICAgd2luZG93LmcgPSBta19zZXR0aW5ncygpO1xuXG4gICAgY29uc29sZS5sb2coJ3NldHRpbmdzJywgZyk7XG5cblxuICAgIC8vdmFyIHZlcnNpb25fc3RyaW5nID0gJ0Rldic7XG4gICAgLy92YXIgdmVyc2lvbl9zdHJpbmcgPSAnQWxwaGEyMDE0MDEtLSc7XG4gICAgdmFyIHZlcnNpb25fc3RyaW5nID0gJ1ByZXZpZXcnK21vbWVudCgpLmZvcm1hdCgnWVlZWU1NREQnKTtcbiAgICBnLnN0YXRlLnZlcnNpb25fc3RyaW5nID0gdmVyc2lvbl9zdHJpbmc7XG4gICAgLy8gTG9hZCBhbmQgVVJMIHF1ZXJ5IHZhcmlhYmxlc1xuICAgIHZhciBxdWVyeSA9IGcuZi5xdWVyeV9zdHJpbmcoKTtcbiAgICAvL2NvbnNvbGUubG9nKHF1ZXJ5KTtcblxuICAgIHZhciB1cGRhdGVfd2VicGFnZSA9IHJlcXVpcmUoJy4vbW9kdWxlcy91cGRhdGVfd2VicGFnZScpO1xuXG4gICAgZy5mLnVwZGF0ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBzZXR0aW5ncyA9IGc7XG4gICAgICAgIHZhciBmID0gZy5mO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCcvLS0tIGJlZ2luIHVwZGF0ZScpO1xuICAgICAgICBnLmYuY2xlYXJfZHJhd2luZygpO1xuXG4gICAgICAgIHNldHRpbmdzLnNlbGVjdF9yZWdpc3RyeS5mb3JFYWNoKGZ1bmN0aW9uKHNlbGVjdG9yKXtcbiAgICAgICAgICAgIGlmKHNlbGVjdG9yLnZhbHVlKCkpIHNlbGVjdG9yLmlucHV0X3JlZi5zZXQoc2VsZWN0b3IudmFsdWUoKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHJlY2FsY3VsYXRlIHN5c3RlbSBzZXR0aW5nc1xuICAgICAgICBnLmYucHJvY2VzcyhzZXR0aW5ncyk7XG5cbiAgICAgICAgdXBkYXRlX3dlYnBhZ2UoKTtcblxuICAgICAgICBjb25zb2xlLmxvZygnXFxcXC0tLSBlbmQgdXBkYXRlJyk7XG4gICAgfTtcblxuXG4vLyByZXF1ZXN0IGV4dGVybmFsIGRhdGFcblxuICAgIHZhciBuZXd0d29ya190ZXN0ID0gZmFsc2U7XG5cbiAgICBnLmYucmVxdWVzdF9TVkcgPSBmdW5jdGlvbigpe1xuICAgIC8vKlxuICAgICAgICBjb25zb2xlLmxvZygnc2VuZGluZyBkYXRhIHRvIHNlcnZlcicpO1xuICAgICAgICB2YXIgdXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6NDIzMy9wbGFuc19tYWNoaW5lJztcbiAgICAgICAgdmFyIHVzZXJfaW5wdXRfanNvbiA9IEpTT04uc3RyaW5naWZ5KGcudXNlcl9pbnB1dCk7XG4gICAgICAgIHZhciBkYXRhID0geyB1c2VyX2lucHV0X2pzb246IHVzZXJfaW5wdXRfanNvbn07XG4gICAgICAgIC8vdmFyIGRhdGEgPSB7XG4gICAgICAgIC8vICAgIHRlc3Q6NDIsXG4gICAgICAgIC8vICAgIHRlc3QyOjIzLFxuICAgICAgICAvL307XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2VydmVyIHJlc3BvbmNlPycsIHJlcyk7XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggJ2Vycm9yJyApO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hbHdheXMoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdjb21wbGV0ZScgKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIC8vdmFyIGRhdGFiYXNlX2pzb25fVVJMID0gJ2h0dHA6Ly8xMC4xNzMuNjQuMjA0OjgwMDAvdGVtcG9yYXJ5Lyc7XG4gICAgdmFyIGRhdGFiYXNlX2pzb25fVVJMID0gJ2RhdGEvZnNlY19jb3B5Lmpzb24nO1xuICAgICQuZ2V0SlNPTiggZGF0YWJhc2VfanNvbl9VUkwpXG4gICAgICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgZy5GU0VDX2RhdGFiYXNlID0gZGF0YTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2RhdGFiYXNlIGxvYWRlZCcsIHNldHRpbmdzLmRhdGFiYXNlKTtcbiAgICAgICAgICAgIGcuY29tcG9uZW50cyA9IGcuZi5sb2FkX2RhdGFiYXNlKGRhdGEpO1xuICAgICAgICAgICAgZy5zdGF0ZS5kYXRhYmFzZV9sb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYoIGcuc3RhdGUubW9kZSA9PT0gJ2Rldicpe1xuICAgICAgICAgICAgICAgIGcuZi5zZXR0aW5nc19kZXZfZGVmYXVsdHMoZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnLmYudXBkYXRlKCk7XG5cbiAgICAgICAgICAgIC8vLy8vLy8vXG4gICAgICAgICAgICAvLyBURU1QXG4gICAgICAgICAgICAvL2cuZi5yZXF1ZXN0X1NWRygpO1xuICAgICAgICAgICAgLy8vLy8vLy9cbiAgICAgICAgfSk7XG5cblxuLy8gQnVpbGQgd2VicGFnZVxuXG4gICAgLy8gU2V0IGRldiBtb2RlIGlmIHJlcXVlc3RlZFxuICAgIGlmKCBxdWVyeVsnbW9kZSddID09PSAnZGV2JyApIHtcbiAgICAgICAgZy5zdGF0ZS5tb2RlID0gJ2Rldic7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZy5zdGF0ZS5tb2RlID0gJ3JlbGVhc2UnO1xuICAgIH1cblxuICAgIGlmKCBxdWVyeVsncGFzc3dvcmQnXSA9PT0gJ3NkNzIzc2ZrYmdyOHlyJyApIHtcbiAgICAgICAgZy5zdGF0ZS5wYXNzd29yZCA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZy5zdGF0ZS5wYXNzd29yZCA9IGZhbHNlO1xuICAgIH1cblxuXG4gICAgaWYoIGcuc3RhdGUubW9kZSA9PT0gJ2RldicgKXtcbiAgICAgICAgZy5mLnNldHRpbmdzX2Rldl9kZWZhdWx0cyhnKTtcbiAgICB9XG5cbiAgICBpZiggZy5zdGF0ZS5wYXNzd29yZCB8fCBxdWVyeVsnbW9kZSddID09PSAnZGV2JyApe1xuICAgICAgICBnLmYuc2V0dXBfd2VicGFnZSgpO1xuXG4gICAgICAgIC8vIEFkZCBzdGF0dXMgYmFyXG4gICAgICAgIHZhciBib290X3RpbWUgPSBtb21lbnQoKTtcbiAgICAgICAgdmFyIHN0YXR1c19pZCA9ICdzdGF0dXMnO1xuICAgICAgICBzZXRJbnRlcnZhbChmdW5jdGlvbigpeyBnLmYudXBkYXRlX3N0YXR1c19iYXIoc3RhdHVzX2lkLCBib290X3RpbWUsIHZlcnNpb25fc3RyaW5nKTt9LDEwMDApO1xuXG4gICAgICAgIGcuZi51cGRhdGUoKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdubyBwYXNzd29yZCcpO1xuICAgICAgICAkKCc8aW1nPicpXG4gICAgICAgICAgICAuYXR0cignc3JjJywgJ2RhdGEvUGxhbnNNYWNoaW5lLnBuZycpXG4gICAgICAgICAgICAvLy5hdHRyKCdjbGFzcycsICd0aXRsZV9pbWFnZScpXG4gICAgICAgICAgICAuY3NzKCd3aWR0aCcsICczMDBweCcpXG4gICAgICAgICAgICAuY3NzKCdwYWRkaW5nJywgJzMwcHgnKVxuICAgICAgICAgICAgLmNzcygnZGlzcGxheScsICdibG9jaycpXG4gICAgICAgICAgICAuY3NzKCdtYXJnaW4tbGVmdCcsICdhdXRvJylcbiAgICAgICAgICAgIC5jc3MoJ21hcmdpbi1yaWdodCcsICdhdXRvJylcbiAgICAgICAgICAgIC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgJCgnPGRpdj4nKVxuICAgICAgICAgICAgLmF0dHIoJ3N0eWxlJywgJ3RleHQtYWxpZ246IGNlbnRlcicpXG4gICAgICAgICAgICAuaHRtbCgnUGFzc3dvcmQgcmVxdWlyZWQgZm9yIGRlbW8nKVxuICAgICAgICAgICAgLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuICAgIH1cbiJdfQ==
