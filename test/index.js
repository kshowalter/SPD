(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/data/tables.json":[function(require,module,exports){
module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports={

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

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/functions.js":[function(require,module,exports){
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

},{"../lib/kontainer":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/lib/kontainer.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_blocks.js":[function(require,module,exports){
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

},{"./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_border.js":[function(require,module,exports){
var mk_drawing = require('./mk_drawing');

//var drawing_parts = [];
//d.link_drawing_parts(drawing_parts);

var add_border = function(settings, sheet_section, sheet_num){
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







    return d.drawing_parts;
};



module.exports = add_border;

},{"./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_drawing.js":[function(require,module,exports){
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

},{"./settings_fonts":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/settings_fonts.js","./settings_layers":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/settings_layers.js","underscore":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/node_modules/underscore/underscore.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_page_1.js":[function(require,module,exports){
var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');

var page = function(settings){
    console.log("** Making page 1");

    var d = mk_drawing(settings);

    var sheet_section = 'A';
    var sheet_num = '00';
    d.append(mk_border(settings, sheet_section, sheet_num ));

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
    var n_rows = 4;
    var n_cols = 2;
    w = 400+80;
    h = n_rows*20;
    x = size.drawing.frame_padding*6;
    y = size.drawing.h - size.drawing.frame_padding*6 - 4*20;
    d.text( [x+w/2, y-20], 'Contents', null, 'table_large' );

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

},{"./mk_border":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_border.js","./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_page_2.js":[function(require,module,exports){
'use strict';

var _ = require('underscore');

var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');

//var drawing_parts = [];
//d.link_drawing_parts(drawing_parts);

var page = function(settings){
    console.log("** Making page 2");
    var d = mk_drawing(settings);
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

},{"./mk_border":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_border.js","./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_drawing.js","underscore":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/node_modules/underscore/underscore.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_page_3.js":[function(require,module,exports){
var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');

var page = function(settings){
    console.log("** Making page 3");
    var f = settings.f;

    d = mk_drawing(settings);

    var sheet_section = 'PV';
    var sheet_num = '02';
    d.append(mk_border(settings, sheet_section, sheet_num ));

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

},{"./mk_border":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_border.js","./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_page_4.js":[function(require,module,exports){
var mk_drawing = require('./mk_drawing');
var mk_border = require('./mk_border');

var page = function(settings){
    console.log("** Making page 4");
    var f = settings.f;

    d = mk_drawing(settings);

    var sheet_section = 'S';
    var sheet_num = '01';
    d.append(mk_border(settings, sheet_section, sheet_num ));

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

},{"./mk_border":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_border.js","./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_page_preview_1.js":[function(require,module,exports){
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

},{"./functions":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/functions.js","./mk_border":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_border.js","./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_page_preview_2.js":[function(require,module,exports){
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

},{"./functions":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/functions.js","./mk_border":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_border.js","./mk_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_drawing.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_settings.js":[function(require,module,exports){
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
    f.mk_page[1] = require('./mk_page_1');
    f.mk_page[2] = require('./mk_page_2');
    f.mk_page[3] = require('./mk_page_3');
    f.mk_page[4] = require('./mk_page_4');

    f.mk_preview = {};
    f.mk_preview[1] = require('./mk_page_preview_1');
    f.mk_preview[2] = require('./mk_page_preview_2');

    f.mk_svg= require('./mk_svg');


    return settings;

};



module.exports = mk_settings;

},{"../data/tables.json":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/data/tables.json","./functions":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/functions.js","./mk_blocks":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_blocks.js","./mk_page_1":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_page_1.js","./mk_page_2":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_page_2.js","./mk_page_3":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_page_3.js","./mk_page_4":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_page_4.js","./mk_page_preview_1":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_page_preview_1.js","./mk_page_preview_2":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_page_preview_2.js","./mk_svg":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_svg.js","./process":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/process.js","./settings_dev_defaults":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/settings_dev_defaults.js","./settings_drawing":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/settings_drawing.js","./settings_fonts":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/settings_fonts.js","./settings_layers":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/settings_layers.js","./setup_webpage":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/setup_webpage.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_svg.js":[function(require,module,exports){
'use strict';
//var settings = require('./settings.js');
//var snapsvg = require('snapsvg');
//log(settings);



var mk_svg = function(drawing_parts, drawing_size){
    //console.log('displaying svg');
    //console.log('drawing_parts: ', drawing_parts);
    //container.empty()
    var layer_attr = require('./settings_layers');
    var fonts = require('./settings_fonts');

    //var svg_elem = document.getElementById('SvgjsSvg1000')
    var svg_elem = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svg_elem.setAttribute('class','svg_drawing');
    //svg_elem.setAttribute('width', settings.drawing_settings.size.drawing.w);
    //svg_elem.setAttribute('height', settings.drawing_settings.size.drawing.h);
    var view_box = '0 0 ' + drawing_size.w + ' ' + drawing_size.h + ' ';
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
            if( elem.font && fonts[elem.font] ){
                font = fonts[elem.font];
            } else if(fonts[attrs.font]){
                font = fonts[attrs.font];
            } else {
                font = fonts['base'];
            }
            if( font === undefined){
                console.log('Font not found', font, fonts['base']['font-size']);

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


module.exports = mk_svg;

},{"./settings_fonts":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/settings_fonts.js","./settings_layers":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/settings_layers.js"}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/process.js":[function(require,module,exports){
'use strict';


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
    var p;

    // Not needed on server
    settings.drawing.preview_parts = {};
    settings.drawing.preview_svgs = {};
    for( p in f.mk_preview ){  // f.mk_page is a array of page making functions, so this will loop through the number of pages
        settings.drawing.preview_parts[p] = f.mk_preview[p](settings);
    }

    settings.drawing.parts = {};
    settings.drawing.svgs = {};
    for( p in f.mk_page ){  // f.mk_page is a array of page making functions, so this will loop through the number of pages
        settings.drawing.parts[p] = f.mk_page[p](settings);
    }


};



module.exports = process;

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/settings_dev_defaults.js":[function(require,module,exports){
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

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/settings_drawing.js":[function(require,module,exports){
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

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/settings_fonts.js":[function(require,module,exports){
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

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/settings_layers.js":[function(require,module,exports){
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

layer_attr.dimention = Object.assign(Object.create(layer_attr.text),{
    stroke: '#1433fe',
});


module.exports = layer_attr;

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/setup_webpage.js":[function(require,module,exports){



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

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/update_webpage.js":[function(require,module,exports){


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
        settings.drawing.preview_svgs[p] = f.mk_svg(settings.drawing.preview_parts[p], settings.drawing_settings.size.drawing);
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
    for( p in f.mk_page ){  // f.mk_page is a array of page making functions, so this will loop through the number of pages
        settings.drawing.svgs[p] = f.mk_svg(settings.drawing.parts[p], settings.drawing_settings.size.drawing);
        $('#drawing')
            //.append($('<p>Page '+p+'</p>'))
            .append($(settings.drawing.svgs[p]))
            .append($('</br>'))
            .append($('</br>'));

    }


};


module.exports = update_webpage;

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/node_modules/underscore/underscore.js":[function(require,module,exports){
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

},{}],"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/webpage.js":[function(require,module,exports){
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

// Update
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
            .html('Demo not availible')
            .appendTo(document.body);
    }

},{"./modules/mk_settings":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/mk_settings.js","./modules/update_webpage":"/home/kshowalter/Dropbox/server/express_default/public/plans_machine/modules/update_webpage.js"}]},{},["/home/kshowalter/Dropbox/server/express_default/public/plans_machine/webpage.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL2RhdGEvdGFibGVzLmpzb24iLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9saWIva29udGFpbmVyLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvbW9kdWxlcy9mdW5jdGlvbnMuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9tb2R1bGVzL21rX2Jsb2Nrcy5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL21vZHVsZXMvbWtfYm9yZGVyLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvbW9kdWxlcy9ta19kcmF3aW5nLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvbW9kdWxlcy9ta19wYWdlXzEuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9tb2R1bGVzL21rX3BhZ2VfMi5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL21vZHVsZXMvbWtfcGFnZV8zLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvbW9kdWxlcy9ta19wYWdlXzQuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9tb2R1bGVzL21rX3BhZ2VfcHJldmlld18xLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvbW9kdWxlcy9ta19wYWdlX3ByZXZpZXdfMi5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL21vZHVsZXMvbWtfc2V0dGluZ3MuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS9tb2R1bGVzL21rX3N2Zy5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL21vZHVsZXMvcHJvY2Vzcy5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL21vZHVsZXMvc2V0dGluZ3NfZGV2X2RlZmF1bHRzLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvbW9kdWxlcy9zZXR0aW5nc19kcmF3aW5nLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvbW9kdWxlcy9zZXR0aW5nc19mb250cy5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL21vZHVsZXMvc2V0dGluZ3NfbGF5ZXJzLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvbW9kdWxlcy9zZXR1cF93ZWJwYWdlLmpzIiwiL2hvbWUva3Nob3dhbHRlci9Ecm9wYm94L3NlcnZlci9leHByZXNzX2RlZmF1bHQvcHVibGljL3BsYW5zX21hY2hpbmUvbW9kdWxlcy91cGRhdGVfd2VicGFnZS5qcyIsIi9ob21lL2tzaG93YWx0ZXIvRHJvcGJveC9zZXJ2ZXIvZXhwcmVzc19kZWZhdWx0L3B1YmxpYy9wbGFuc19tYWNoaW5lL25vZGVfbW9kdWxlcy91bmRlcnNjb3JlL3VuZGVyc2NvcmUuanMiLCIvaG9tZS9rc2hvd2FsdGVyL0Ryb3Bib3gvc2VydmVyL2V4cHJlc3NfZGVmYXVsdC9wdWJsaWMvcGxhbnNfbWFjaGluZS93ZWJwYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy94QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25SQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25rQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDem9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDak1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaGdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9bW9kdWxlLmV4cG9ydHM9e1xuXG4gICAgXCJORUMgMjUwLjEyMl9oZWFkZXJcIjogW1wiQW1wXCIsXCJBV0dcIl0sXG4gICAgXCJORUMgMjUwLjEyMlwiOiB7XG4gICAgICAgIFwiMTVcIjpcIjE0XCIsXG4gICAgICAgIFwiMjBcIjpcIjEyXCIsXG4gICAgICAgIFwiMzBcIjpcIjEwXCIsXG4gICAgICAgIFwiNDBcIjpcIjEwXCIsXG4gICAgICAgIFwiNjBcIjpcIjEwXCIsXG4gICAgICAgIFwiMTAwXCI6XCI4XCIsXG4gICAgICAgIFwiMjAwXCI6XCI2XCIsXG4gICAgICAgIFwiMzAwXCI6XCI0XCIsXG4gICAgICAgIFwiNDAwXCI6XCIzXCIsXG4gICAgICAgIFwiNTAwXCI6XCIyXCIsXG4gICAgICAgIFwiNjAwXCI6XCIxXCIsXG4gICAgICAgIFwiODAwXCI6XCIxLzBcIixcbiAgICAgICAgXCIxMDAwXCI6XCIyLzBcIixcbiAgICAgICAgXCIxMjAwXCI6XCIzLzBcIixcbiAgICAgICAgXCIxNjAwXCI6XCI0LzBcIixcbiAgICAgICAgXCIyMDAwXCI6XCIyNTBcIixcbiAgICAgICAgXCIyNTAwXCI6XCIzNTBcIixcbiAgICAgICAgXCIzMDAwXCI6XCI0MDBcIixcbiAgICAgICAgXCI0MDAwXCI6XCI1MDBcIixcbiAgICAgICAgXCI1MDAwXCI6XCI3MDBcIixcbiAgICAgICAgXCI2MDAwXCI6XCI4MDBcIlxuICAgIH0sXG5cbiAgICBcIk5FQyBUNjkwLjdfaGVhZGVyXCI6IFtcIkFtYmllbnQgVGVtcGVyYXR1cmUgKEMpXCIsIFwiQ29ycmVjdGlvbiBGYWN0b3JcIl0sXG4gICAgXCJORUMgVDY5MC43XCI6IHtcbiAgICAgICAgXCIyNSB0byAyMFwiOlwiMS4wMlwiLFxuICAgICAgICBcIjE5IHRvIDE1XCI6XCIxLjA0XCIsXG4gICAgICAgIFwiMTUgdG8gMTBcIjpcIjEuMDZcIixcbiAgICAgICAgXCI5IHRvIDVcIjpcIjEuMDhcIixcbiAgICAgICAgXCI0IHRvIDBcIjpcIjEuMTBcIixcbiAgICAgICAgXCItMSB0byAtNVwiOlwiMS4xMlwiLFxuICAgICAgICBcIi02IHRvIC0xMFwiOlwiMS4xNFwiLFxuICAgICAgICBcIi0xMSB0byAtMTVcIjpcIjEuMTZcIixcbiAgICAgICAgXCItMTYgdG8gLTIwXCI6XCIxLjE4XCIsXG4gICAgICAgIFwiLTIxIHRvIC0yNVwiOlwiMS4yMFwiLFxuICAgICAgICBcIi0yNiB0byAtMzBcIjpcIjEuMjFcIixcbiAgICAgICAgXCItMzEgdG8gLTM1XCI6XCIxLjIzXCIsXG4gICAgICAgIFwiLTM2IHRvIC00MFwiOlwiMS4yNVwiXG4gICAgfSxcblxuICAgIFwiQ2ggOSBUYWJsZSA4IENvbmR1Y3RvciBQcm9wZXJ0aWVzX2hlYWRlclwiOiBbXCJTaXplXCIsXCJvaG0va2Z0XCJdLFxuICAgIFwiQ2ggOSBUYWJsZSA4IENvbmR1Y3RvciBQcm9wZXJ0aWVzXCI6IHtcbiAgICAgICAgXCIjMDFcIjpcIiAwLjE1NFwiLFxuICAgICAgICBcIiMwMS8wXCI6XCIwLjEyMlwiLFxuICAgICAgICBcIiMwMlwiOlwiMC4xOTRcIixcbiAgICAgICAgXCIjMDIvMFwiOlwiMC4wOTY3XCIsXG4gICAgICAgIFwiIzAzXCI6XCIwLjI0NVwiLFxuICAgICAgICBcIiMwMy8wXCI6XCIwLjA3NjZcIixcbiAgICAgICAgXCIjMDRcIjpcIjAuMzA4XCIsXG4gICAgICAgIFwiIzA0LzBcIjpcIjAuMDYwOFwiLFxuICAgICAgICBcIiMwNlwiOlwiMC40OTFcIixcbiAgICAgICAgXCIjMDhcIjpcIjAuNzc4XCIsXG4gICAgICAgIFwiIzEwXCI6XCIxLjI0XCIsXG4gICAgICAgIFwiIzEyXCI6XCIxLjk4XCIsXG4gICAgICAgIFwiIzE0XCI6XCIzLjE0XCJcbiAgICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBrb250YWluZXIgPSB7XG4gICAgcmVmOiBmdW5jdGlvbihyZWZTdHJpbmcpe1xuICAgICAgICBpZiggdHlwZW9mIHJlZlN0cmluZyA9PT0gJ3VuZGVmaW5lZCcgKXtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlZlN0cmluZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVmU3RyaW5nID0gcmVmU3RyaW5nO1xuICAgICAgICAgICAgdGhpcy5yZWZBcnJheSA9IHJlZlN0cmluZy5zcGxpdCgnLicpO1xuICAgICAgICAgICAgaWYoIHR5cGVvZiB0aGlzLm9iamVjdCAhPT0gJ3VuZGVmaW5lZCcpe1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBvYmo6IGZ1bmN0aW9uKG9iail7XG4gICAgICAgIGlmKCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5vYmplY3QgPSBvYmo7XG4gICAgICAgICAgICBpZiggdHlwZW9mIHRoaXMucmVmU3RyaW5nICE9PSAndW5kZWZpbmVkJyl7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24oaW5wdXQpe1xuICAgICAgICBpZiggdHlwZW9mIHRoaXMub2JqZWN0ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgdGhpcy5yZWZTdHJpbmcgPT09ICd1bmRlZmluZWQnICl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMub2JqZWN0O1xuICAgICAgICB2YXIgbGFzdF9sZXZlbCA9IHRoaXMucmVmQXJyYXlbdGhpcy5yZWZBcnJheS5sZW5ndGgtMV07XG5cbiAgICAgICAgdGhpcy5yZWZBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldmVsX25hbWUsaSl7XG4gICAgICAgICAgICBpZiggdHlwZW9mIHBhcmVudFtsZXZlbF9uYW1lXSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50W2xldmVsX25hbWVdID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiggbGV2ZWxfbmFtZSAhPT0gbGFzdF9sZXZlbCApe1xuICAgICAgICAgICAgICAgIHBhcmVudCA9IHBhcmVudFtsZXZlbF9uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHBhcmVudFtsYXN0X2xldmVsXSA9IGlucHV0O1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdzZXR0aW5nOicsIGlucHV0LCB0aGlzLmdldCgpLCB0aGlzLnJlZlN0cmluZyApO1xuICAgICAgICByZXR1cm4gcGFyZW50W2xhc3RfbGV2ZWxdO1xuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbGV2ZWwgPSB0aGlzLm9iamVjdDtcbiAgICAgICAgdGhpcy5yZWZBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldmVsX25hbWUsaSl7XG4gICAgICAgICAgICBpZiggdHlwZW9mIGxldmVsW2xldmVsX25hbWVdID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXZlbCA9IGxldmVsW2xldmVsX25hbWVdO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGxldmVsO1xuICAgIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtvbnRhaW5lcjtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBrb250YWluZXIgPSByZXF1aXJlKCcuLi9saWIva29udGFpbmVyJyk7XG5cbnZhciBmID0ge307XG5cblxuZi5zZXR1cF9ib2R5ID0gZnVuY3Rpb24odGl0bGUsIHNlY3Rpb25zKXtcbiAgICBkb2N1bWVudC50aXRsZSA9IHRpdGxlO1xuICAgIHZhciBib2R5ID0gZG9jdW1lbnQuYm9keTtcbiAgICB2YXIgc3RhdHVzX2JhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHN0YXR1c19iYXIuaWQgPSAnc3RhdHVzJztcbiAgICBzdGF0dXNfYmFyLmlubmVySFRNTCA9ICdsb2FkaW5nIHN0YXR1cy4uLic7XG4gICAgYm9keS5pbnNlcnRCZWZvcmUoc3RhdHVzX2JhciwgYm9keS5maXJzdENoaWxkKTtcbn07XG5cbmYucGFkX3plcm8gPSBmdW5jdGlvbihudW0sIHNpemUpe1xuICAgIHZhciBzID0gJzAwMDAwMDAwMCcgKyBudW07XG4gICAgcmV0dXJuIHMuc3Vic3RyKHMubGVuZ3RoLXNpemUpO1xufTtcblxuZi51cHRpbWUgPSBmdW5jdGlvbihib290X3RpbWUpe1xuICAgIHZhciB1cHRpbWVfc2Vjb25kc190b3RhbCA9IG1vbWVudCgpLmRpZmYoYm9vdF90aW1lLCAnc2Vjb25kcycpO1xuICAgIHZhciB1cHRpbWVfaG91cnMgPSBNYXRoLmZsb29yKCAgdXB0aW1lX3NlY29uZHNfdG90YWwgLyg2MCo2MCkgKTtcbiAgICB2YXIgbWludXRlc19sZWZ0ID0gdXB0aW1lX3NlY29uZHNfdG90YWwgJSg2MCo2MCk7XG4gICAgdmFyIHVwdGltZV9taW51dGVzID0gZi5wYWRfemVybyggTWF0aC5mbG9vciggIG1pbnV0ZXNfbGVmdCAvNjAgKSwgMiApO1xuICAgIHZhciB1cHRpbWVfc2Vjb25kcyA9IGYucGFkX3plcm8oIChtaW51dGVzX2xlZnQgJSA2MCksIDIgKTtcbiAgICByZXR1cm4gdXB0aW1lX2hvdXJzICtcIjpcIisgdXB0aW1lX21pbnV0ZXMgK1wiOlwiKyB1cHRpbWVfc2Vjb25kcztcbn07XG5cbmYudXBkYXRlX3N0YXR1c19iYXIgPSBmdW5jdGlvbihzdGF0dXNfaWQsIGJvb3RfdGltZSwgc3RyaW5nKSB7XG4gICAgdmFyIHN0YXR1c19kaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzdGF0dXNfaWQpO1xuICAgIHN0YXR1c19kaXYuaW5uZXJIVE1MID0gc3RyaW5nO1xuICAgIHN0YXR1c19kaXYuaW5uZXJIVE1MICs9ICcgfCAnO1xuXG4gICAgdmFyIGNsb2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNsb2NrLmlubmVySFRNTCA9IG1vbWVudCgpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpO1xuXG4gICAgdmFyIHVwdGltZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB1cHRpbWUuaW5uZXJIVE1MID0gJ1VwdGltZTogJyArIGYudXB0aW1lKGJvb3RfdGltZSk7XG5cbiAgICBzdGF0dXNfZGl2LmFwcGVuZENoaWxkKGNsb2NrKTtcbiAgICBzdGF0dXNfZGl2LmlubmVySFRNTCArPSAnIHwgJztcbiAgICBzdGF0dXNfZGl2LmFwcGVuZENoaWxkKHVwdGltZSk7XG4gICAgc3RhdHVzX2Rpdi5pbm5lckhUTUwgKz0gJyB8ICc7XG59O1xuXG5cbmYub2JqX25hbWVzID0gZnVuY3Rpb24oIG9iamVjdCApIHtcbiAgICBpZiggb2JqZWN0ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHZhciBhID0gW107XG4gICAgICAgIGZvciggdmFyIGlkIGluIG9iamVjdCApIHtcbiAgICAgICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoaWQpICkgIHtcbiAgICAgICAgICAgICAgICBhLnB1c2goaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbn07XG5cbmYub2JqZWN0X2RlZmluZWQgPSBmdW5jdGlvbihvYmplY3Qpe1xuICAgIC8vY29uc29sZS5sb2cob2JqZWN0KTtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0ICl7XG4gICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhrZXkpO1xuICAgICAgICAgICAgaWYoIG9iamVjdFtrZXldID09PSBudWxsIHx8IG9iamVjdFtrZXldID09PSB1bmRlZmluZWQgKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5mLnNlY3Rpb25fZGVmaW5lZCA9IGZ1bmN0aW9uKHNldHRpbmdzLCBzZWN0aW9uX25hbWUpe1xuICAgIC8vY29uc29sZS5sb2coXCItXCIrc2VjdGlvbl9uYW1lKTtcbiAgICAvL3ZhciBpbnB1dF9zZWN0aW9uID0gZy5pbnB1dHNbc2VjdGlvbl9uYW1lXTtcbiAgICAvL3ZhciBvdXRwdXRfc2VjdGlvbiA9IGcuc3lzdGVtW3NlY3Rpb25fbmFtZV07XG4gICAgdmFyIG91dHB1dF9zZWN0aW9uID0gc2V0dGluZ3MudXNlcl9pbnB1dFtzZWN0aW9uX25hbWVdO1xuICAgIGZvciggdmFyIGtleSBpbiBvdXRwdXRfc2VjdGlvbiApe1xuICAgICAgICBpZiggb3V0cHV0X3NlY3Rpb24uaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhrZXkpO1xuXG4gICAgICAgICAgICBpZiggb3V0cHV0X3NlY3Rpb25ba2V5XSA9PT0gdW5kZWZpbmVkIHx8IG91dHB1dF9zZWN0aW9uW2tleV0gPT09IG51bGwgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufTtcblxuZi5udWxsVG9PYmplY3QgPSBmdW5jdGlvbihvYmplY3Qpe1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QgKXtcbiAgICAgICAgaWYoIG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpICl7XG4gICAgICAgICAgICBpZiggb2JqZWN0W2tleV0gPT09IG51bGwgKXtcbiAgICAgICAgICAgICAgICBvYmplY3Rba2V5XSA9IHt9O1xuICAgICAgICAgICAgfSBlbHNlIGlmKCB0eXBlb2Ygb2JqZWN0W2tleV0gPT09ICdvYmplY3QnICkge1xuICAgICAgICAgICAgICAgIG9iamVjdFtrZXldID0gZi5udWxsVG9PYmplY3Qob2JqZWN0W2tleV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG59O1xuXG5mLmJsYW5rX2NvcHkgPSBmdW5jdGlvbihvYmplY3Qpe1xuICAgIHZhciBuZXdPYmplY3QgPSB7fTtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0ICl7XG4gICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgaWYoIG9iamVjdFtrZXldLmNvbnN0cnVjdG9yID09PSBPYmplY3QgKSB7XG4gICAgICAgICAgICAgICAgbmV3T2JqZWN0W2tleV0gPSB7fTtcbiAgICAgICAgICAgICAgICBmb3IoIHZhciBrZXkyIGluIG9iamVjdFtrZXldICl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCBvYmplY3Rba2V5XS5oYXNPd25Qcm9wZXJ0eShrZXkyKSApe1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqZWN0W2tleV1ba2V5Ml0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdPYmplY3Rba2V5XSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld09iamVjdDtcbn07XG5cbmYuYWRkX3NlY3Rpb25zID0gZnVuY3Rpb24oaW5wdXRzKXtcbiAgICB2YXIgYmxhbmtfdXNlcl9pbnB1dCA9IHt9O1xuICAgIGZvciggdmFyIHNlY3Rpb25fbmFtZSBpbiBpbnB1dHMgKXtcbiAgICAgICAgaWYoIGlucHV0cy5oYXNPd25Qcm9wZXJ0eShzZWN0aW9uX25hbWUpICl7XG4gICAgICAgICAgICBpZiggaW5wdXRzW3NlY3Rpb25fbmFtZV0uY29uc3RydWN0b3IgPT09IE9iamVjdCApIHtcbiAgICAgICAgICAgICAgICBibGFua191c2VyX2lucHV0W3NlY3Rpb25fbmFtZV0gPSB7fTtcbiAgICAgICAgICAgICAgICBmb3IoIHZhciBuYW1lIGluIGlucHV0c1tzZWN0aW9uX25hbWVdICl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCBpbnB1dHNbc2VjdGlvbl9uYW1lXS5oYXNPd25Qcm9wZXJ0eShuYW1lKSApe1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxhbmtfdXNlcl9pbnB1dFtzZWN0aW9uX25hbWVdW25hbWVdID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yOiBzZWN0aW9uIG5vdCBvYmplY3QnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYmxhbmtfdXNlcl9pbnB1dDtcblxufTtcblxuZi5ibGFua19jbGVhbl9jb3B5ID0gZnVuY3Rpb24ob2JqZWN0KXtcbiAgICB2YXIgbmV3T2JqZWN0ID0ge307XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdCApe1xuICAgICAgICBpZiggb2JqZWN0Lmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIGlmKCBvYmplY3Rba2V5XS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICkge1xuICAgICAgICAgICAgICAgIG5ld09iamVjdFtrZXldID0ge307XG4gICAgICAgICAgICAgICAgZm9yKCB2YXIga2V5MiBpbiBvYmplY3Rba2V5XSApe1xuICAgICAgICAgICAgICAgICAgICBpZiggb2JqZWN0W2tleV0uaGFzT3duUHJvcGVydHkoa2V5MikgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjbGVhbl9rZXkgPSBmLmNsZWFuX25hbWUoa2V5Mik7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmplY3Rba2V5XVtjbGVhbl9rZXldID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3T2JqZWN0W2tleV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXdPYmplY3Q7XG59O1xuXG4vL2YubWVyZ2Vfb2JqZWN0cyA9IGZ1bmN0aW9uIG1lcmdlX29iamVjdHMob2JqZWN0MSwgb2JqZWN0Mil7XG4vLyAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0MSApe1xuLy8gICAgICAgIGlmKCBvYmplY3QxLmhhc093blByb3BlcnR5KGtleSkgKXtcbi8vICAgICAgICAgICAgLy9pZigga2V5ID09PSAnbWFrZScgKSBjb25zb2xlLmxvZyhrZXksIG9iamVjdDEsIHR5cGVvZiBvYmplY3QxW2tleV0sIHR5cGVvZiBvYmplY3QyW2tleV0pO1xuLy8gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGtleSwgb2JqZWN0MSwgdHlwZW9mIG9iamVjdDFba2V5XSwgdHlwZW9mIG9iamVjdDJba2V5XSk7XG4vLyAgICAgICAgICAgIGlmKCBvYmplY3QxW2tleV0gJiYgb2JqZWN0MVtrZXldLmNvbnN0cnVjdG9yID09PSBPYmplY3QgKSB7XG4vLyAgICAgICAgICAgICAgICBpZiggb2JqZWN0MltrZXldID09PSB1bmRlZmluZWQgKSBvYmplY3QyW2tleV0gPSB7fTtcbi8vICAgICAgICAgICAgICAgIG1lcmdlX29iamVjdHMoIG9iamVjdDFba2V5XSwgb2JqZWN0MltrZXldICk7XG4vLyAgICAgICAgICAgIH0gZWxzZSB7XG4vLyAgICAgICAgICAgICAgICBpZiggb2JqZWN0MltrZXldID09PSB1bmRlZmluZWQgKSBvYmplY3QyW2tleV0gPSBudWxsO1xuLy8gICAgICAgICAgICB9XG4vLyAgICAgICAgfVxuLy8gICAgfVxuLy99O1xuXG5mLm1lcmdlX29iamVjdHMgPSBmdW5jdGlvbiBtZXJnZV9vYmplY3RzKG9iamVjdDEsIG9iamVjdDIpe1xuICAgIGZvciggdmFyIGtleSBpbiBvYmplY3QxICl7XG4gICAgICAgIGlmKCBvYmplY3QxLmhhc093blByb3BlcnR5KGtleSkgKXtcbiAgICAgICAgICAgIC8vaWYoIGtleSA9PT0gJ21ha2UnICkgY29uc29sZS5sb2coa2V5LCBvYmplY3QxLCB0eXBlb2Ygb2JqZWN0MVtrZXldLCB0eXBlb2Ygb2JqZWN0MltrZXldKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coa2V5LCBvYmplY3QxLCB0eXBlb2Ygb2JqZWN0MVtrZXldLCB0eXBlb2Ygb2JqZWN0MltrZXldKTtcbiAgICAgICAgICAgIGlmKCBvYmplY3QxW2tleV0gJiYgb2JqZWN0MVtrZXldLmNvbnN0cnVjdG9yID09PSBPYmplY3QgKSB7XG4gICAgICAgICAgICAgICAgaWYoIG9iamVjdDJba2V5XSA9PT0gdW5kZWZpbmVkICkgb2JqZWN0MltrZXldID0ge307XG4gICAgICAgICAgICAgICAgbWVyZ2Vfb2JqZWN0cyggb2JqZWN0MVtrZXldLCBvYmplY3QyW2tleV0gKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0MltrZXldID0gb2JqZWN0MVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuZi5hcnJheV90b19vYmplY3QgPSBmdW5jdGlvbihhcnIpIHtcbiAgICB2YXIgciA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKVxuICAgICAgICByW2ldID0gYXJyW2ldO1xuICAgIHJldHVybiByO1xufTtcblxuZi5uYW5fY2hlY2sgPSBmdW5jdGlvbiBuYW5fY2hlY2sob2JqZWN0LCBwYXRoKXtcbiAgICBpZiggcGF0aCA9PT0gdW5kZWZpbmVkICkgcGF0aCA9IFwiXCI7XG4gICAgcGF0aCA9IHBhdGgrXCIuXCI7XG4gICAgZm9yKCB2YXIga2V5IGluIG9iamVjdCApe1xuICAgICAgICAvL2NvbnNvbGUubG9nKCBcIk5hTmNoZWNrOiBcIitwYXRoK2tleSApO1xuXG4gICAgICAgIGlmKCBvYmplY3Rba2V5XSAmJiBvYmplY3Rba2V5XS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkgKSBvYmplY3Rba2V5XSA9IGYuYXJyYXlfdG9fb2JqZWN0KG9iamVjdFtrZXldKTtcblxuXG4gICAgICAgIGlmKCAgb2JqZWN0W2tleV0gJiYgKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSB8fCBvYmplY3Rba2V5XSAhPT0gbnVsbCApKXtcbiAgICAgICAgICAgIGlmKCBvYmplY3Rba2V5XS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0ICl7XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggXCIgIE9iamVjdDogXCIrcGF0aCtrZXkgKTtcbiAgICAgICAgICAgICAgICBuYW5fY2hlY2soIG9iamVjdFtrZXldLCBwYXRoK2tleSApO1xuICAgICAgICAgICAgfSBlbHNlIGlmKCBvYmplY3Rba2V5XSA9PT0gTmFOIHx8IG9iamVjdFtrZXldID09PSBudWxsICl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coIFwiTmFOOiBcIitwYXRoK2tleSApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCBcIkRlZmluZWQ6IFwiK3BhdGgra2V5LCBvYmplY3Rba2V5XSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxufTtcblxuZi5zdHJfdG9fbnVtID0gZnVuY3Rpb24gc3RyX3RvX251bShpbnB1dCl7XG4gICAgdmFyIG91dHB1dDtcbiAgICBpZighaXNOYU4oaW5wdXQpKSBvdXRwdXQgPSBOdW1iZXIoaW5wdXQpO1xuICAgIGVsc2Ugb3V0cHV0ID0gaW5wdXQ7XG4gICAgcmV0dXJuIG91dHB1dDtcbn07XG5cblxuZi5wcmV0dHlfd29yZCA9IGZ1bmN0aW9uKG5hbWUpe1xuICAgIHJldHVybiBuYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbmFtZS5zbGljZSgxKTtcbn07XG5cbmYucHJldHR5X25hbWUgPSBmdW5jdGlvbihuYW1lKXtcbiAgICB2YXIgbCA9IG5hbWUuc3BsaXQoJ18nKTtcbiAgICBsLmZvckVhY2goZnVuY3Rpb24obmFtZV9zZXFtZW50LGkpe1xuICAgICAgICBsW2ldID0gZi5wcmV0dHlfd29yZChuYW1lX3NlcW1lbnQpO1xuICAgIH0pO1xuICAgIHZhciBwcmV0dHkgPSBsLmpvaW4oJyAnKTtcblxuICAgIHJldHVybiBwcmV0dHk7XG59O1xuXG5mLnByZXR0eV9uYW1lcyA9IGZ1bmN0aW9uKG9iamVjdCl7XG4gICAgdmFyIG5ld19vYmplY3QgPSB7fTtcbiAgICBmb3IoIHZhciBrZXkgaW4gb2JqZWN0ICl7XG4gICAgICAgIGlmKCBvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSApe1xuICAgICAgICAgICAgdmFyIG5ld19rZXkgPSBmLnByZXR0eV9uYW1lKGtleSk7XG4gICAgICAgICAgICBuZXdfb2JqZWN0W25ld19rZXldID0gb2JqZWN0W2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld19vYmplY3Q7XG59O1xuXG5mLmNsZWFuX25hbWUgPSBmdW5jdGlvbihuYW1lKXtcbiAgICByZXR1cm4gbmFtZS5zcGxpdCgnICcpWzBdO1xufTtcblxuXG5mLm1rX2RyYXdlciA9IGZ1bmN0aW9uKHRpdGxlLCBjb250ZW50KXtcbiAgICB2YXIgZHJhd2VyX2NvbnRhaW5lciA9ICQoJzxkaXY+JylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnaW5wdXRfc2VjdGlvbicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2lkJywgJ3NlY3Rpb25fJyt0aXRsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8uYXR0cignaWQnLCB0aXRsZSApO1xuICAgIC8vZHJhd2VyX2NvbnRhaW5lci5nZXQoMCkuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlfdHlwZTtcbiAgICB2YXIgc3lzdGVtX2RpdiA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAndGl0bGVfYmFyJylcbiAgICAgICAgLmF0dHIoJ3NlY3Rpb25fbm9tJywgdGl0bGUpXG4gICAgICAgIC5hcHBlbmRUbyhkcmF3ZXJfY29udGFpbmVyKVxuICAgICAgICAvKiBqc2hpbnQgLVcwODMgKi9cbiAgICAgICAgLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgbmFtZSA9ICQodGhpcykuYXR0cignc2VjdGlvbl9ub20nKTtcbiAgICAgICAgICAgIGcud2VicGFnZS5zZWxlY3Rpb25zX21hbnVhbF90b2dnbGVkW25hbWVdID0gdHJ1ZTtcbiAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuY2hpbGRyZW4oJy5kcmF3ZXInKS5jaGlsZHJlbignLmRyYXdlcl9jb250ZW50Jykuc2xpZGVUb2dnbGUoJ2Zhc3QnKTtcbiAgICAgICAgfSk7XG4gICAgdmFyIHN5c3RlbV90aXRsZSA9ICQoJzxhPicpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICd0aXRsZV9iYXJfdGV4dCcpXG4gICAgICAgIC5hdHRyKCdocmVmJywgJyMnKVxuICAgICAgICAudGV4dChmLnByZXR0eV9uYW1lKHRpdGxlKSlcbiAgICAgICAgLmFwcGVuZFRvKHN5c3RlbV9kaXYpO1xuXG4gICAgdmFyIGRyYXdlciA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAnZHJhd2VyJykuYXBwZW5kVG8oZHJhd2VyX2NvbnRhaW5lcik7XG4gICAgY29udGVudC5hdHRyKCdjbGFzcycsICdkcmF3ZXJfY29udGVudCcpLmFwcGVuZFRvKGRyYXdlcik7XG5cblxuICAgIHJldHVybiBkcmF3ZXJfY29udGFpbmVyO1xuXG5cbn07XG5cblxuZi5hZGRfc2VsZWN0b3JzID0gZnVuY3Rpb24oc2V0dGluZ3MsIHBhcmVudF9jb250YWluZXIpe1xuICAgIGZvciggdmFyIHNlY3Rpb25fbmFtZSBpbiBzZXR0aW5ncy5pbnB1dHMgKXtcblxuICAgICAgICAvLyQodGhpcykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgdmFyIGRyYXdlcl9jb250ZW50ID0gJCgnPGRpdj4nKTtcbiAgICAgICAgZm9yKCB2YXIgaW5wdXRfbmFtZSBpbiBzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXSApe1xuICAgICAgICAgICAgdmFyIHVuaXRzO1xuICAgICAgICAgICAgaWYoIChzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSAhPT0gdW5kZWZpbmVkKSAmJiAoc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0udW5pdHMgIT09IHVuZGVmaW5lZCkgKSB7XG4gICAgICAgICAgICAgICAgdW5pdHMgPSBcIihcIiArIHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdLnVuaXRzICsgXCIpXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHVuaXRzID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBub3RlO1xuICAgICAgICAgICAgaWYoIChzZXR0aW5ncy5pbnB1dHNbc2VjdGlvbl9uYW1lXVtpbnB1dF9uYW1lXSAhPT0gdW5kZWZpbmVkKSAmJiAoc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0ubm90ZSAhPT0gdW5kZWZpbmVkKSApIHtcbiAgICAgICAgICAgICAgICBub3RlID0gc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0ubm90ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbm90ZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIHZhciBzZWxlY3Rvcl9zZXQgPSAkKCc8c3Bhbj4nKS5hdHRyKCdjbGFzcycsICdzZWxlY3Rvcl9zZXQnKS5hcHBlbmRUbyhkcmF3ZXJfY29udGVudCk7XG4gICAgICAgICAgICB2YXIgaW5wdXRfdGV4dCA9ICQoJzxzcGFuPicpLmh0bWwoZi5wcmV0dHlfbmFtZShpbnB1dF9uYW1lKSArICc6ICcgKyB1bml0cyApLmFwcGVuZFRvKHNlbGVjdG9yX3NldCk7XG4gICAgICAgICAgICBpZiggbm90ZSApIGlucHV0X3RleHQuYXR0cigndGl0bGUnLCBub3RlKTtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICB2YXIgc2VsZWN0b3IgPSBrJCgnc2VsZWN0b3InKVxuICAgICAgICAgICAgICAgIC5zZXRPcHRpb25zUmVmKCAnaW5wdXRzLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lIClcbiAgICAgICAgICAgICAgICAuc2V0UmVmKCAnc3lzdGVtLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lIClcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8oc2VsZWN0b3Jfc2V0KTtcbiAgICAgICAgICAgIGYua2VsZW1fc2V0dXAoc2VsZWN0b3IsIHNldHRpbmdzKTtcbiAgICAgICAgICAgIC8vKi9cbiAgICAgICAgICAgIHZhciBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgICAgICBzeXN0ZW1fcmVmOiBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcikub2JqKGcpLnJlZignc3lzdGVtLicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lKSxcbiAgICAgICAgICAgICAgICBpbnB1dF9yZWY6IE9iamVjdC5jcmVhdGUoa29udGFpbmVyKS5vYmooZykucmVmKCd1c2VyX2lucHV0LicgKyBzZWN0aW9uX25hbWUgKyAnLicgKyBpbnB1dF9uYW1lKSxcbiAgICAgICAgICAgICAgICBsaXN0X3JlZjogT2JqZWN0LmNyZWF0ZShrb250YWluZXIpLm9iaihnKS5yZWYoJ2lucHV0cy4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSArICcub3B0aW9ucycpLFxuICAgICAgICAgICAgICAgIGludGVyYWN0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmKCAoc2V0dGluZ3MuaW5wdXRzW3NlY3Rpb25fbmFtZV1baW5wdXRfbmFtZV0gIT09IHVuZGVmaW5lZCkgJiYgKHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdLnR5cGUgIT09IHVuZGVmaW5lZCkgKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IudHlwZSA9IHNldHRpbmdzLmlucHV0c1tzZWN0aW9uX25hbWVdW2lucHV0X25hbWVdLnR5cGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLnR5cGUgPSAnc2VsZWN0JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCBzZWxlY3Rvci50eXBlID09PSAnc2VsZWN0JyApe1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLmVsZW0gPSAkKCc8c2VsZWN0PicpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdzZWxlY3RvcicpXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhzZWxlY3Rvcl9zZXQpXG4gICAgICAgICAgICAgICAgICAgIC5nZXQoKVswXTtcbiAgICAgICAgICAgICAgICBzZWxlY3Rvci52YWx1ZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coIHRoaXMuc2V0X3JlZi5yZWZTdHJpbmcsIHRoaXMuZWxlbS5zZWxlY3RlZEluZGV4ICk7XG4gICAgICAgICAgICAgICAgICAgIC8vaWYoIHRoaXMuaW50ZXJhY3RlZCApXG4gICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLmVsZW0uc2VsZWN0ZWRJbmRleCA+PSAwKSByZXR1cm4gdGhpcy5lbGVtLm9wdGlvbnNbdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGYuc2VsZWN0b3JfYWRkX29wdGlvbnMoc2VsZWN0b3IpO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYoIHNlbGVjdG9yLnR5cGUgPT09ICdudW1iZXJfaW5wdXQnIHx8IHNlbGVjdG9yLnR5cGUgPT09ICd0ZXh0X2lucHV0Jyl7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IuZWxlbSA9ICQoJzxpbnB1dD4nKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignY2xhc3MnLCBzZWxlY3Rvci50eXBlKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cigndHlwZScsICd0ZXh0JylcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKHNlbGVjdG9yX3NldClcbiAgICAgICAgICAgICAgICAgICAgLmdldCgpWzBdO1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLnZhbHVlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggdGhpcy5zZXRfcmVmLnJlZlN0cmluZywgdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXggKTtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggdGhpcy5lbGVtLCB0aGlzLmVsZW0udmFsdWUgKTtcbiAgICAgICAgICAgICAgICAgICAgLy9pZiggdGhpcy5pbnRlcmFjdGVkIClcbiAgICAgICAgICAgICAgICAgICAgLy9pZiggdGhpcy5lbGVtLnNlbGVjdGVkSW5kZXggPj0gMCkgcmV0dXJuIHRoaXMuZWxlbS5vcHRpb25zW3RoaXMuZWxlbS5zZWxlY3RlZEluZGV4XS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgLy9lbHNlIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbS52YWx1ZTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHNlbGVjdG9yLmVsZW0udmFsdWUgPSBzZWxlY3Rvci5pbnB1dF9yZWYuZ2V0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKHNlbGVjdG9yLmVsZW0pLmNoYW5nZShmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuZi51cGRhdGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc2V0dGluZ3Muc2VsZWN0X3JlZ2lzdHJ5LnB1c2goc2VsZWN0b3IpO1xuICAgICAgICAgICAgLy8kKCc8L2JyPicpLmFwcGVuZFRvKGRyYXdlcl9jb250ZW50KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlbGVjdGlvbl9jb250YWluZXIgPSBmLm1rX2RyYXdlcihzZWN0aW9uX25hbWUsIGRyYXdlcl9jb250ZW50KTtcblxuICAgICAgICBzZWxlY3Rpb25fY29udGFpbmVyLmFwcGVuZFRvKHBhcmVudF9jb250YWluZXIpO1xuXG4gICAgICAgICQoc2VsZWN0aW9uX2NvbnRhaW5lcikuY2hpbGRyZW4oJy5kcmF3ZXInKS5jaGlsZHJlbignLmRyYXdlcl9jb250ZW50Jykuc2xpZGVVcCgnZmFzdCcpO1xuICAgIH1cbn07XG5cbmYuc2VsZWN0b3JfYWRkX29wdGlvbnMgPSBmdW5jdGlvbihzZWxlY3Rvcil7XG4gICAgdmFyIGxpc3QgPSBzZWxlY3Rvci5saXN0X3JlZi5nZXQoKTtcbiAgICBpZiggbGlzdCAmJiBsaXN0LmNvbnN0cnVjdG9yID09PSBPYmplY3QgKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ1wibGlzdFwiJywgbGlzdCk7XG4gICAgICAgIGxpc3QgPSBmLm9ial9uYW1lcyhsaXN0KTtcbiAgICB9XG4gICAgc2VsZWN0b3IuZWxlbS5pbm5lckhUTUwgPSBcIlwiO1xuICAgIGlmKCBsaXN0IGluc3RhbmNlb2YgQXJyYXkgKXtcbiAgICAgICAgdmFyIGN1cnJlbnRfdmFsdWUgPSBzZWxlY3Rvci5pbnB1dF9yZWYuZ2V0KCk7XG4gICAgICAgICQoJzxvcHRpb24+JykuYXR0cignc2VsZWN0ZWQnLHRydWUpLmF0dHIoJ2Rpc2FibGVkJyx0cnVlKS5hdHRyKCdoaWRkZW4nLHRydWUpLmFwcGVuZFRvKHNlbGVjdG9yLmVsZW0pO1xuXG4gICAgICAgIGxpc3QuZm9yRWFjaChmdW5jdGlvbihvcHRfbmFtZSl7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKG9wdF9uYW1lKTtcbiAgICAgICAgICAgIHZhciBvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICBvLnZhbHVlID0gb3B0X25hbWU7XG4gICAgICAgICAgICBpZiggY3VycmVudF92YWx1ZSApe1xuICAgICAgICAgICAgICAgIGlmKCBvcHRfbmFtZS50b1N0cmluZygpID09PSBjdXJyZW50X3ZhbHVlLnRvU3RyaW5nKCkgKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2ZvdW5kIGl0OicsIG9wdF9uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgby5zZWxlY3RlZCA9IFwic2VsZWN0ZWRcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdkb2VzIG5vdCBtYXRjaDogJywgb3B0X25hbWUsIFwiLFwiLCAgY3VycmVudF92YWx1ZSwgXCIuXCIgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9vLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnc2VsZWN0b3Jfb3B0aW9uJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ25vIGN1cnJlbnQgdmFsdWUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgby5pbm5lckhUTUwgPSBvcHRfbmFtZTtcbiAgICAgICAgICAgIHNlbGVjdG9yLmVsZW0uYXBwZW5kQ2hpbGQobyk7XG4gICAgICAgIH0pO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnbGlzdCBub3QgYSBsaXN0JywgbGlzdCwgc2VsZWN0KTtcbiAgICB9XG59O1xuXG5mLmFkZF9vcHRpb25zID0gZnVuY3Rpb24oc2VsZWN0LCBhcnJheSl7XG4gICAgYXJyYXkuZm9yRWFjaCggZnVuY3Rpb24ob3B0aW9uKXtcbiAgICAgICAgJCgnPG9wdGlvbj4nKS5hdHRyKCAndmFsdWUnLCBvcHRpb24gKS50ZXh0KG9wdGlvbikuYXBwZW5kVG8oc2VsZWN0KTtcbiAgICB9KTtcbn07XG5cblxuLy9mLmFkZF9wYXJhbXMgPSBmdW5jdGlvbihzZXR0aW5ncywgcGFyZW50X2NvbnRhaW5lcil7XG4vLyAgICBmb3IoIHZhciBzZWN0aW9uX25hbWUgaW4gc2V0dGluZ3Muc3lzdGVtICl7XG4vLyAgICAgICAgaWYoIHRydWUgfHwgZi5vYmplY3RfZGVmaW5lZChzZXR0aW5ncy5zeXN0ZW1bc2VjdGlvbl9uYW1lXSkgKXtcbi8vICAgICAgICAgICAgdmFyIHNlbGVjdGlvbl9jb250YWluZXIgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3BhcmFtX3NlY3Rpb24nKS5hdHRyKCdpZCcsIHNlY3Rpb25fbmFtZSApLmFwcGVuZFRvKHBhcmVudF9jb250YWluZXIpO1xuLy8gICAgICAgICAgICAvL3NlbGVjdGlvbl9jb250YWluZXIuZ2V0KDApLnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5X3R5cGU7XG4vLyAgICAgICAgICAgIHZhciBzeXN0ZW1fZGl2ID0gJCgnPGRpdj4nKVxuLy8gICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3RpdGxlX2xpbmUnKVxuLy8gICAgICAgICAgICAgICAgLmFwcGVuZFRvKHNlbGVjdGlvbl9jb250YWluZXIpXG4vLyAgICAgICAgICAgICAgICAvKiBqc2hpbnQgLVcwODMgKi9cbi8vICAgICAgICAgICAgICAgIC5jbGljayhmdW5jdGlvbigpe1xuLy8gICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuY2hpbGRyZW4oJy5kcmF3ZXInKS5jaGlsZHJlbignLmRyYXdlcl9jb250ZW50Jykuc2xpZGVUb2dnbGUoJ2Zhc3QnKTtcbi8vICAgICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICAgICB2YXIgc3lzdGVtX3RpdGxlID0gJCgnPGE+Jylcbi8vICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICd0aXRsZV9saW5lX3RleHQnKVxuLy8gICAgICAgICAgICAgICAgLmF0dHIoJ2hyZWYnLCAnIycpXG4vLyAgICAgICAgICAgICAgICAudGV4dChmLnByZXR0eV9uYW1lKHNlY3Rpb25fbmFtZSkpXG4vLyAgICAgICAgICAgICAgICAuYXBwZW5kVG8oc3lzdGVtX2Rpdik7XG4vLyAgICAgICAgICAgICQodGhpcykudHJpZ2dlcignY2xpY2snKTtcbi8vICAgICAgICAgICAgdmFyIGRyYXdlciA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAnJykuYXBwZW5kVG8oc2VsZWN0aW9uX2NvbnRhaW5lcik7XG4vLyAgICAgICAgICAgIHZhciBkcmF3ZXJfY29udGVudCA9ICQoJzxkaXY+JykuYXR0cignY2xhc3MnLCAncGFyYW1fc2VjdGlvbl9jb250ZW50JykuYXBwZW5kVG8oZHJhd2VyKTtcbi8vICAgICAgICAgICAgZm9yKCB2YXIgaW5wdXRfbmFtZSBpbiBzZXR0aW5ncy5zeXN0ZW1bc2VjdGlvbl9uYW1lXSApe1xuLy8gICAgICAgICAgICAgICAgJCgnPHNwYW4+JykuaHRtbChmLnByZXR0eV9uYW1lKGlucHV0X25hbWUpICsgJzogJykuYXBwZW5kVG8oZHJhd2VyX2NvbnRlbnQpO1xuLy8gICAgICAgICAgICAgICAgLypcbi8vICAgICAgICAgICAgICAgIHZhciBzZWxlY3RvciA9IGskKCd2YWx1ZScpXG4vLyAgICAgICAgICAgICAgICAgICAgLy8uc2V0T3B0aW9uc1JlZiggJ2lucHV0cy4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSApXG4vLyAgICAgICAgICAgICAgICAgICAgLnNldFJlZiggJ3N5c3RlbS4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSApXG4vLyAgICAgICAgICAgICAgICAgICAgLmFwcGVuZFRvKGRyYXdlcl9jb250ZW50KTtcbi8vICAgICAgICAgICAgICAgIGYua2VsZW1fc2V0dXAoc2VsZWN0b3IsIHNldHRpbmdzKTtcbi8vICAgICAgICAgICAgICAgIC8vKi9cbi8vICAgICAgICAgICAgICAgIHZhciB2YWx1ZV9rb250YWluZXIgPSBPYmplY3QuY3JlYXRlKGtvbnRhaW5lcilcbi8vICAgICAgICAgICAgICAgICAgICAub2JqKHNldHRpbmdzKVxuLy8gICAgICAgICAgICAgICAgICAgIC5yZWYoJ3N5c3RlbS4nICsgc2VjdGlvbl9uYW1lICsgJy4nICsgaW5wdXRfbmFtZSk7XG4vLyAgICAgICAgICAgICAgICB2YXIgJGVsZW0gPSAkKCc8c3Bhbj4nKVxuLy8gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICcnKVxuLy8gICAgICAgICAgICAgICAgICAgIC5hcHBlbmRUbyhkcmF3ZXJfY29udGVudClcbi8vICAgICAgICAgICAgICAgICAgICAudGV4dCh2YWx1ZV9rb250YWluZXIuZ2V0KCkpO1xuLy8gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0ge1xuLy8gICAgICAgICAgICAgICAgICAgIGVsZW06ICRlbGVtLmdldCgpWzBdLFxuLy8gICAgICAgICAgICAgICAgICAgIHZhbHVlX3JlZjogdmFsdWVfa29udGFpbmVyXG4vLyAgICAgICAgICAgICAgICB9O1xuLy8gICAgICAgICAgICAgICAgc2V0dGluZ3MudmFsdWVfcmVnaXN0cnkucHVzaCh2YWx1ZSk7XG4vLyAgICAgICAgICAgICAgICAkKCc8L2JyPicpLmFwcGVuZFRvKGRyYXdlcl9jb250ZW50KTtcbi8vICAgICAgICAgICAgfVxuLy8gICAgICAgIH1cbi8vICAgIH1cbi8vfTtcbi8vXG4vL2YudXBkYXRlX3ZhbHVlcyA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcbi8vICAgIHNldHRpbmdzLnZhbHVlX3JlZ2lzdHJ5LmZvckVhY2goZnVuY3Rpb24odmFsdWVfaXRlbSl7XG4vLyAgICAgICAgLy9jb25zb2xlLmxvZyggdmFsdWVfaXRlbSApO1xuLy8gICAgICAgIC8vY29uc29sZS5sb2coIHZhbHVlX2l0ZW0uZWxlbS5vcHRpb25zICk7XG4vLyAgICAgICAgLy9jb25zb2xlLmxvZyggdmFsdWVfaXRlbS5lbGVtLnNlbGVjdGVkSW5kZXggKTtcbi8vICAgICAgICBpZih2YWx1ZV9pdGVtLmVsZW0uc2VsZWN0ZWRJbmRleCl7XG4vLyAgICAgICAgICAgIHZhbHVlX2l0ZW0udmFsdWUgPSB2YWx1ZV9pdGVtLmVsZW0ub3B0aW9uc1t2YWx1ZV9pdGVtLmVsZW0uc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4vLyAgICAgICAgICAgIHZhbHVlX2l0ZW0ua29udGFpbmVyLnNldCh2YWx1ZV9pdGVtLnZhbHVlKTtcbi8vXG4vLyAgICAgICAgfVxuLy8gICAgfSk7XG4vL307XG4vL1xuLy9mLnNob3dfaGlkZV9wYXJhbXMgPSBmdW5jdGlvbihwYWdlX3NlY3Rpb25zLCBzZXR0aW5ncyl7XG4vLyAgICBmb3IoIHZhciBsaXN0X25hbWUgaW4gcGFnZV9zZWN0aW9ucyApe1xuLy8gICAgICAgIHZhciBpZCA9ICcjJytsaXN0X25hbWU7XG4vLyAgICAgICAgdmFyIHNlY3Rpb25fbmFtZSA9IGxpc3RfbmFtZS5zcGxpdCgnXycpWzBdO1xuLy8gICAgICAgIHZhciBzZWN0aW9uID0gayQoaWQpO1xuLy8gICAgICAgIGlmKCBzZXR0aW5ncy5zdGF0dXMuc2VjdGlvbnNbc2VjdGlvbl9uYW1lXS5zZXQgKSBzZWN0aW9uLnNob3coKTtcbi8vICAgICAgICBlbHNlIHNlY3Rpb24uaGlkZSgpO1xuLy8gICAgfVxuLy99O1xuXG4vL2Yuc2hvd19oaWRlX3NlbGVjdGlvbnMgPSBmdW5jdGlvbihzZXR0aW5ncywgYWN0aXZlX3NlY3Rpb25fbmFtZSl7XG4vLyAgICAkKCcjc2VjdGlvblNlbGVjdG9yJykudmFsKGFjdGl2ZV9zZWN0aW9uX25hbWUpO1xuLy8gICAgZm9yKCB2YXIgbGlzdF9uYW1lIGluIHNldHRpbmdzLmlucHV0ICl7XG4vLyAgICAgICAgdmFyIGlkID0gJyMnK2xpc3RfbmFtZTtcbi8vICAgICAgICB2YXIgc2VjdGlvbl9uYW1lID0gbGlzdF9uYW1lLnNwbGl0KCdfJylbMF07XG4vLyAgICAgICAgdmFyIHNlY3Rpb24gPSBrJChpZCk7XG4vLyAgICAgICAgaWYoIHNlY3Rpb25fbmFtZSA9PT0gYWN0aXZlX3NlY3Rpb25fbmFtZSApIHNlY3Rpb24uc2hvdygpO1xuLy8gICAgICAgIGVsc2Ugc2VjdGlvbi5oaWRlKCk7XG4vLyAgICB9XG4vL307XG5cbi8vZi5zZXREb3dubG9hZExpbmsoc2V0dGluZ3Mpe1xuLy9cbi8vICAgIGlmKCBzZXR0aW5ncy5QREYgJiYgc2V0dGluZ3MuUERGLnVybCApe1xuLy8gICAgICAgIHZhciBsaW5rID0gJCgnYScpLmF0dHIoJ2hyZWYnLCBzZXR0aW5ncy5QREYudXJsICkuYXR0cignZG93bmxvYWQnLCAnUFZfZHJhd2luZy5wZGYnKS5odG1sKCdEb3dubG9hZCBEcmF3aW5nJyk7XG4vLyAgICAgICAgJCgnI2Rvd25sb2FkJykuaHRtbCgnJykuYXBwZW5kKGxpbmspO1xuLy8gICAgfVxuLy99XG5cbi8vZi5sb2FkVGFibGVzID0gZnVuY3Rpb24oc3RyaW5nKXtcbi8vICAgIHZhciB0YWJsZXMgPSB7fTtcbi8vICAgIHZhciBsID0gc3RyaW5nLnNwbGl0KCdcXG4nKTtcbi8vICAgIHZhciB0aXRsZTtcbi8vICAgIHZhciBmaWVsZHM7XG4vLyAgICB2YXIgbmVlZF90aXRsZSA9IHRydWU7XG4vLyAgICB2YXIgbmVlZF9maWVsZHMgPSB0cnVlO1xuLy8gICAgbC5mb3JFYWNoKCBmdW5jdGlvbihzdHJpbmcsIGkpe1xuLy8gICAgICAgIHZhciBsaW5lID0gc3RyaW5nLnRyaW0oKTtcbi8vICAgICAgICBpZiggbGluZS5sZW5ndGggPT09IDAgKXtcbi8vICAgICAgICAgICAgbmVlZF90aXRsZSA9IHRydWU7XG4vLyAgICAgICAgICAgIG5lZWRfZmllbGRzID0gdHJ1ZTtcbi8vICAgICAgICB9IGVsc2UgaWYoIG5lZWRfdGl0bGUgKSB7XG4vLyAgICAgICAgICAgIHRpdGxlID0gbGluZTtcbi8vICAgICAgICAgICAgdGFibGVzW3RpdGxlXSA9IFtdO1xuLy8gICAgICAgICAgICBuZWVkX3RpdGxlID0gZmFsc2U7XG4vLyAgICAgICAgfSBlbHNlIGlmKCBuZWVkX2ZpZWxkcyApIHtcbi8vICAgICAgICAgICAgZmllbGRzID0gbGluZS5zcGxpdCgnLCcpO1xuLy8gICAgICAgICAgICB0YWJsZXNbdGl0bGUrXCJfZmllbGRzXCJdID0gZmllbGRzO1xuLy8gICAgICAgICAgICBuZWVkX2ZpZWxkcyA9IGZhbHNlO1xuLy8gICAgICAgIC8vfSBlbHNlIHtcbi8vICAgICAgICAvLyAgICB2YXIgZW50cnkgPSB7fTtcbi8vICAgICAgICAvLyAgICB2YXIgbGluZV9hcnJheSA9IGxpbmUuc3BsaXQoJywnKTtcbi8vICAgICAgICAvLyAgICBmaWVsZHMuZm9yRWFjaCggZnVuY3Rpb24oZmllbGQsIGlkKXtcbi8vICAgICAgICAvLyAgICAgICAgZW50cnlbZmllbGQudHJpbSgpXSA9IGxpbmVfYXJyYXlbaWRdLnRyaW0oKTtcbi8vICAgICAgICAvLyAgICB9KTtcbi8vICAgICAgICAvLyAgICB0YWJsZXNbdGl0bGVdLnB1c2goIGVudHJ5ICk7XG4vLyAgICAgICAgLy99XG4vLyAgICAgICAgfSBlbHNlIHtcbi8vICAgICAgICAgICAgdmFyIGxpbmVfYXJyYXkgPSBsaW5lLnNwbGl0KCcsJyk7XG4vLyAgICAgICAgICAgIHRhYmxlc1t0aXRsZV1bbGluZV9hcnJheVswXS50cmltKCldID0gbGluZV9hcnJheVsxXS50cmltKCk7XG4vLyAgICAgICAgfVxuLy8gICAgfSk7XG4vL1xuLy8gICAgcmV0dXJuIHRhYmxlcztcbi8vfTtcbi8vXG4vL2YubG9hZENvbXBvbmVudHMgPSBmdW5jdGlvbihzdHJpbmcpe1xuLy8gICAgdmFyIGRiID0gay5wYXJzZUNTVihzdHJpbmcpO1xuLy8gICAgdmFyIG9iamVjdCA9IHt9O1xuLy8gICAgZm9yKCB2YXIgaSBpbiBkYiApe1xuLy8gICAgICAgIHZhciBjb21wb25lbnQgPSBkYltpXTtcbi8vICAgICAgICBpZiggb2JqZWN0W2NvbXBvbmVudC5NYWtlXSA9PT0gdW5kZWZpbmVkICl7XG4vLyAgICAgICAgICAgIG9iamVjdFtjb21wb25lbnQuTWFrZV0gPSB7fTtcbi8vICAgICAgICB9XG4vLyAgICAgICAgaWYoIG9iamVjdFtjb21wb25lbnQuTWFrZV1bY29tcG9uZW50Lk1vZGVsXSA9PT0gdW5kZWZpbmVkICl7XG4vLyAgICAgICAgICAgIG9iamVjdFtjb21wb25lbnQuTWFrZV1bY29tcG9uZW50Lk1vZGVsXSA9IHt9O1xuLy8gICAgICAgIH1cbi8vXG4vLyAgICAgICAgdmFyIGZpZWxkcyA9IGsub2JqSWRBcnJheShjb21wb25lbnQpO1xuLy8gICAgICAgIGZpZWxkcy5mb3JFYWNoKCBmdW5jdGlvbiggZmllbGQgKXtcbi8vICAgICAgICAgICAgdmFyIHBhcmFtID0gY29tcG9uZW50W2ZpZWxkXTtcbi8vICAgICAgICAgICAgaWYoICEoIGZpZWxkIGluIFsnTWFrZScsICdNb2RlbCddICkgJiYgISggaXNOYU4ocGFyc2VGbG9hdChwYXJhbSkpICkgKXtcbi8vICAgICAgICAgICAgICAgIGNvbXBvbmVudFtmaWVsZF0gPSBwYXJzZUZsb2F0KHBhcmFtKTtcbi8vICAgICAgICAgICAgfVxuLy8gICAgICAgIH0pXG4vLyAgICAgICAgb2JqZWN0W2NvbXBvbmVudC5NYWtlXVtjb21wb25lbnQuTW9kZWxdID0gY29tcG9uZW50O1xuLy8gICAgfVxuLy8gICAgcmV0dXJuIG9iamVjdDtcbi8vfTtcblxuXG5cblxuZi5sb2FkX2RhdGFiYXNlID0gZnVuY3Rpb24oRlNFQ19kYXRhYmFzZV9vYmope1xuICAgIEZTRUNfZGF0YWJhc2Vfb2JqID0gZi5sb3dlcmNhc2VfcHJvcGVydGllcyhGU0VDX2RhdGFiYXNlX29iaik7XG4gICAgdmFyIGNvbXBvbmVudHMgPSB7fTtcbiAgICBjb21wb25lbnRzLmludmVydGVycyA9IHt9O1xuICAgIEZTRUNfZGF0YWJhc2Vfb2JqLmludmVydGVycy5mb3JFYWNoKGZ1bmN0aW9uKGNvbXBvbmVudCl7XG4gICAgICAgIGlmKCBjb21wb25lbnRzLmludmVydGVyc1tjb21wb25lbnQubWFrZV0gPT09IHVuZGVmaW5lZCApIGNvbXBvbmVudHMuaW52ZXJ0ZXJzW2NvbXBvbmVudC5tYWtlXSA9IHt9O1xuICAgICAgICAvL2NvbXBvbmVudHMuaW52ZXJ0ZXJzW2NvbXBvbmVudC5tYWtlXVtjb21wb25lbnQubWFrZV0gPSBmLnByZXR0eV9uYW1lcyhjb21wb25lbnQpO1xuICAgICAgICBjb21wb25lbnRzLmludmVydGVyc1tjb21wb25lbnQubWFrZV1bY29tcG9uZW50Lm1vZGVsXSA9IGNvbXBvbmVudDtcbiAgICB9KTtcbiAgICBjb21wb25lbnRzLm1vZHVsZXMgPSB7fTtcbiAgICBGU0VDX2RhdGFiYXNlX29iai5tb2R1bGVzLmZvckVhY2goZnVuY3Rpb24oY29tcG9uZW50KXtcbiAgICAgICAgaWYoIGNvbXBvbmVudHMubW9kdWxlc1tjb21wb25lbnQubWFrZV0gPT09IHVuZGVmaW5lZCApIGNvbXBvbmVudHMubW9kdWxlc1tjb21wb25lbnQubWFrZV0gPSB7fTtcbiAgICAgICAgLy9jb21wb25lbnRzLm1vZHVsZXNbY29tcG9uZW50Lm1ha2VdW2NvbXBvbmVudC5tYWtlXSA9IGYucHJldHR5X25hbWVzKGNvbXBvbmVudCk7XG4gICAgICAgIGNvbXBvbmVudHMubW9kdWxlc1tjb21wb25lbnQubWFrZV1bY29tcG9uZW50Lm1vZGVsXSA9IGNvbXBvbmVudDtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb21wb25lbnRzO1xufTtcblxuXG5mLmdldF9yZWYgPSBmdW5jdGlvbihzdHJpbmcsIG9iamVjdCl7XG4gICAgdmFyIHJlZl9hcnJheSA9IHN0cmluZy5zcGxpdCgnLicpO1xuICAgIHZhciBsZXZlbCA9IG9iamVjdDtcbiAgICByZWZfYXJyYXkuZm9yRWFjaChmdW5jdGlvbihsZXZlbF9uYW1lLGkpe1xuICAgICAgICBpZiggdHlwZW9mIGxldmVsW2xldmVsX25hbWVdID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXZlbCA9IGxldmVsW2xldmVsX25hbWVdO1xuICAgIH0pO1xuICAgIHJldHVybiBsZXZlbDtcbn07XG5mLnNldF9yZWYgPSBmdW5jdGlvbiggb2JqZWN0LCByZWZfc3RyaW5nLCB2YWx1ZSApe1xuICAgIHZhciByZWZfYXJyYXkgPSByZWZfc3RyaW5nLnNwbGl0KCcuJyk7XG4gICAgdmFyIGxldmVsID0gb2JqZWN0O1xuICAgIHJlZl9hcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldmVsX25hbWUsaSl7XG4gICAgICAgIGlmKCB0eXBlb2YgbGV2ZWxbbGV2ZWxfbmFtZV0gPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGxldmVsID0gbGV2ZWxbbGV2ZWxfbmFtZV07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbGV2ZWw7XG59O1xuXG5cblxuXG5mLmxvZ19pZl9kYXRhYmFzZV9sb2FkZWQgPSBmdW5jdGlvbihlKXtcbiAgICBpZihmLmcuc3RhdGUuZGF0YWJhc2VfbG9hZGVkKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIH1cbn07XG5cblxuXG5mLmxvd2VyY2FzZV9wcm9wZXJ0aWVzID0gZnVuY3Rpb24gbG93ZXJjYXNlX3Byb3BlcnRpZXMob2JqKSB7XG4gICAgdmFyIG5ld19vYmplY3QgPSBuZXcgb2JqLmNvbnN0cnVjdG9yKCk7XG4gICAgZm9yKCB2YXIgb2xkX25hbWUgaW4gb2JqICl7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkob2xkX25hbWUpKSB7XG4gICAgICAgICAgICB2YXIgbmV3X25hbWUgPSBvbGRfbmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYoIG9ialtvbGRfbmFtZV0uY29uc3RydWN0b3IgPT09IE9iamVjdCB8fCBvYmpbb2xkX25hbWVdLmNvbnN0cnVjdG9yID09PSBBcnJheSApe1xuICAgICAgICAgICAgICAgIG5ld19vYmplY3RbbmV3X25hbWVdID0gbG93ZXJjYXNlX3Byb3BlcnRpZXMob2JqW29sZF9uYW1lXSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5ld19vYmplY3RbbmV3X25hbWVdID0gb2JqW29sZF9uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuICAgIHJldHVybiBuZXdfb2JqZWN0O1xufTtcblxuXG5mLnRvZ2dsZV9tb2R1bGUgPSBmdW5jdGlvbihlbGVtZW50KXtcbiAgICAvL2NvbnNvbGUubG9nKCdzd2l0Y2gnLCBlbGVtZW50LCBlbGVtZW50LmNsYXNzTGlzICk7XG5cbiAgICAvL2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBudWxsKTtcblxuICAgIHZhciBlbGVtID0gJChlbGVtZW50KTtcbiAgICAvL2NvbnNvbGUubG9nKCdzd2l0Y2gnLCBlbGVtWzBdLmNsYXNzTGlzdC5jb250YWlucygncHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZScpICk7XG5cbiAgICB2YXIgciA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdtb2R1bGVfSUQnKS5zcGxpdCgnLCcpWzBdO1xuICAgIHZhciBjID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ21vZHVsZV9JRCcpLnNwbGl0KCcsJylbMV07XG5cbiAgICBpZiggZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl1bY10gKXtcbiAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl1bY10gPSBmYWxzZTtcbiAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNfdG90YWwtLTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSA9IHRydWU7XG4gICAgICAgIGcud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzX3RvdGFsKys7XG4gICAgfVxuXG4gICAgLypcbiAgICB2YXIgbGF5ZXI7XG4gICAgaWYoIGVsZW1bMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdzdmdfcHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZCcpICl7XG4gICAgICAgIC8vZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNbcl1bY10gPSB0cnVlO1xuICAgICAgICAvL2xheWVyID0gZy5kcmF3aW5nX3NldHRpbmdzLmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZTtcbiAgICAgICAgLy9lbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXMgPSBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlcyArMSB8fCAxO1xuICAgICAgICAvL2xheWVyID0gZy5kcmF3aW5nX3NldHRpbmdzLmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZDtcbiAgICAgICAgLy9lbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWRcIik7XG4gICAgfVxuICAgIC8vKi9cbiAgICAvL2NvbnNvbGUubG9nKCBnLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlcyk7XG4gICAgLy9mb3IoIHZhciBhdHRyX25hbWUgaW4gbGF5ZXIgKXtcbiAgICAvLyAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyX25hbWUsIGxheWVyW2F0dHJfbmFtZV0pO1xuXG4gICAgLy99XG5cbiAgICBnLmYudXBkYXRlKCk7XG5cbiAgICAvKlxuICAgIGlmKCBlbGVtLmhhc0NsYXNzKFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVcIikgKXtcbiAgICAgICAgZWxlbS5yZW1vdmVDbGFzcyhcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlXCIpO1xuICAgICAgICBlbGVtLmFkZENsYXNzKFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWRcIik7XG4gICAgfSBlbHNlIGlmKCBlbGVtLmhhc0NsYXNzKFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWRcIikgKXtcbiAgICAgICAgZWxlbS5yZW1vdmVDbGFzcyhcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlX3NlbGVjdGVkXCIpO1xuICAgICAgICBlbGVtLmFkZENsYXNzKFwic3ZnX3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbS5hZGRDbGFzcyhcInN2Z19wcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlXCIpO1xuICAgIH1cbiAgICAqL1xufTtcblxuXG5mLmNsZWFyX29iamVjdCA9IGZ1bmN0aW9uKG9iail7XG4gICAgZm9yKCB2YXIgaWQgaW4gb2JqICl7XG4gICAgICAgIGlmKCBvYmouaGFzT3duUHJvcGVydHkoaWQpKXtcbiAgICAgICAgICAgIGRlbGV0ZSBvYmpbaWRdO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLy8gY2xlYXIgZHJhd2luZ1xuZi5jbGVhcl9kcmF3aW5nID0gZnVuY3Rpb24oKSB7XG4gICAgZm9yKCB2YXIgaWQgaW4gZy5kcmF3aW5nICl7XG4gICAgICAgIGlmKCBnLmRyYXdpbmcuaGFzT3duUHJvcGVydHkoaWQpKXtcbiAgICAgICAgICAgIGYuY2xlYXJfb2JqZWN0KGcuZHJhd2luZ1tpZF0pO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuXG5cbmYucXVlcnlfc3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAvLyBCYXNlZCBvblxuICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS85Nzk5OTVcbiAgdmFyIHF1ZXJ5X3N0cmluZyA9IHt9O1xuICB2YXIgcXVlcnkgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKTtcbiAgdmFyIHZhcnMgPSBxdWVyeS5zcGxpdChcIiZcIik7XG4gIHZhciBpO1xuICBmb3IgKCBpPTA7IGk8dmFycy5sZW5ndGg7IGkrKyApIHtcbiAgICB2YXIgcGFpciA9IHZhcnNbaV0uc3BsaXQoXCI9XCIpO1xuICAgICAgICAvLyBJZiBmaXJzdCBlbnRyeSB3aXRoIHRoaXMgbmFtZVxuICAgIGlmICh0eXBlb2YgcXVlcnlfc3RyaW5nW3BhaXJbMF1dID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHF1ZXJ5X3N0cmluZ1twYWlyWzBdXSA9IHBhaXJbMV07XG4gICAgICAgIC8vIElmIHNlY29uZCBlbnRyeSB3aXRoIHRoaXMgbmFtZVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHF1ZXJ5X3N0cmluZ1twYWlyWzBdXSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB2YXIgYXJyID0gWyBxdWVyeV9zdHJpbmdbcGFpclswXV0sIHBhaXJbMV0gXTtcbiAgICAgICAgcXVlcnlfc3RyaW5nW3BhaXJbMF1dID0gYXJyO1xuICAgICAgICAvLyBJZiB0aGlyZCBvciBsYXRlciBlbnRyeSB3aXRoIHRoaXMgbmFtZVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXJ5X3N0cmluZ1twYWlyWzBdXS5wdXNoKHBhaXJbMV0pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcXVlcnlfc3RyaW5nO1xufTtcblxuZi5yZXF1ZXN0X2dlb2NvZGUgPSBmdW5jdGlvbigpe1xuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZChnLCAnbG9jYXRpb24nKSApe1xuICAgICAgICB2YXIgYWRkcmVzc19uZXcgPSBnLnBlcm0ubG9jYXRpb24ubmV3X2FkZHJlc3M7XG5cbiAgICAgICAgaWYoIGFkZHJlc3NfbmV3IHx8IGcucGVybS5sb2NhdGlvbi5sYXQgPT09IHVuZGVmaW5lZCB8fCBnLnBlcm0ubG9jYXRpb24ubGF0ID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnbmV3IGFkZHJlc3MnKTtcbiAgICAgICAgICAgIHZhciBhZGRyZXNzID0gZW5jb2RlVVJJQ29tcG9uZW50KFtcbiAgICAgICAgICAgICAgICAgICAgZy5wZXJtLmxvY2F0aW9uLmFkZHJlc3MsXG4gICAgICAgICAgICAgICAgICAgIGcucGVybS5sb2NhdGlvbi5jaXR5LFxuICAgICAgICAgICAgICAgICAgICAnRkwnLFxuICAgICAgICAgICAgICAgICAgICBnLnBlcm0ubG9jYXRpb24uemlwXG4gICAgICAgICAgICAgICAgXS5qb2luKCcsICcpICk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGFkZHJlc3MpO1xuICAgICAgICAgICAgJCgnI2dlb2NvZGVfZGlzcGxheScpLnRleHQoJ1JlcXVlc3RpbmcgY29vcmRpbmF0ZXMuLi4nKTtcbiAgICAgICAgICAgICQuZ2V0SlNPTignaHR0cDovL25vbWluYXRpbS5vcGVuc3RyZWV0bWFwLm9yZy9zZWFyY2g/Zm9ybWF0PWpzb24mbGltaXQ9NSZxPScgKyBhZGRyZXNzLCBmLnNldF9jb29yZGluYXRlc19mcm9tX2dlb2NvZGUgKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCgnI2dlb2NvZGVfZGlzcGxheScpLnRleHQoJ0FkZHJlc3MgdW5jaGFuZ2VkJyk7XG4gICAgICAgICAgICBmLnNldF9jb29yZGluYXRlc19mcm9tX2dlb2NvZGUoKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgICQoJyNnZW9jb2RlX2Rpc3BsYXknKS50ZXh0KCdQbGVhc2UgZW50ZXIgYWRkcmVzcycpO1xuICAgIH1cbn07XG5cblxuZi5zZXRfc2F0X21hcF9tYXJrZXIgPSBmdW5jdGlvbigpe1xuICAgIHZhciBsYXRsbmcgPSBMLmxhdExuZyggZy5wZXJtLmxvY2F0aW9uLmxhdCwgZy5wZXJtLmxvY2F0aW9uLmxvbiApO1xuICAgIGcucGVybS5tYXBzLm1hcmtlcl9zYXQuc2V0TGF0TG5nKCBsYXRsbmcgKTtcbiAgICBnLnBlcm0ubWFwcy5tYXJrZXJfcm9hZC5zZXRMYXRMbmcoIGxhdGxuZyApO1xuICAgIGcucGVybS5tYXBzLm1hcF9zYXQuc2V0VmlldyggbGF0bG5nICk7XG59O1xuXG5mLnNldF9jb29yZGluYXRlc19mcm9tX21hcCA9IGZ1bmN0aW9uKGUpe1xuICAgIGcucGVybS5sb2NhdGlvbi5sYXQgPSBlLmxhdGxuZy5sYXQ7XG4gICAgZy5wZXJtLmxvY2F0aW9uLmxvbiA9IGUubGF0bG5nLmxuZztcbiAgICBmLnVwZGF0ZSgpO1xufTtcblxuZi5zZXRfY29vcmRpbmF0ZXNfZnJvbV9nZW9jb2RlID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgaWYoIGRhdGEgPT09IHVuZGVmaW5lZCAmJiBnLnBlcm0ubG9jYXRpb24ubGF0ICE9PSB1bmRlZmluZWQgKXsgLy8gbG9hZGluZyBsYXN0IGxvY2F0aW9uc1xuICAgICAgICBnLnBlcm0ubG9jYXRpb24ubGF0ID0gZy5wZXJtLmdlb2NvZGUubGF0O1xuICAgICAgICBnLnBlcm0ubG9jYXRpb24ubG9uID0gZy5wZXJtLmdlb2NvZGUubG9uO1xuICAgICAgICBmLnVwZGF0ZSgpO1xuICAgIH0gZWxzZSBpZiggZGF0YVswXSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICQoJyNnZW9jb2RlX2Rpc3BsYXknKS50ZXh0KCdBZGRyZXNzIGxvYWRlZCcpO1xuICAgICAgICBjb25zb2xlLmxvZygnTmV3IGxvY2F0aW9uIGZyb20gYWRkcmVzcycsIGRhdGEpO1xuICAgICAgICBnLnBlcm0uZ2VvY29kZS5kYXRhID0gZGF0YTtcbiAgICAgICAgZy5wZXJtLmdlb2NvZGUubGF0ID0gZGF0YVswXS5sYXQ7XG4gICAgICAgIGcucGVybS5nZW9jb2RlLmxvbiA9IGRhdGFbMF0ubG9uO1xuICAgICAgICBnLnBlcm0ubG9jYXRpb24ubGF0ID0gZy5wZXJtLmdlb2NvZGUubGF0O1xuICAgICAgICBnLnBlcm0ubG9jYXRpb24ubG9uID0gZy5wZXJtLmdlb2NvZGUubG9uO1xuICAgICAgICBmLnVwZGF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICQoJyNnZW9jb2RlX2Rpc3BsYXknKS50ZXh0KCdBZGRyZXNzIG5vdCBmb3VuZCcpO1xuICAgIH1cbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGY7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xuXG4vL3ZhciBkcmF3aW5nX3BhcnRzID0gW107XG4vL2QubGlua19kcmF3aW5nX3BhcnRzKGRyYXdpbmdfcGFydHMpO1xuXG52YXIgcGFnZSA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICBjb25zb2xlLmxvZyhcIioqIE1ha2luZyBibG9ja3NcIik7XG4gICAgZCA9IG1rX2RyYXdpbmcoc2V0dGluZ3MpO1xuXG4gICAgdmFyIGYgPSBzZXR0aW5ncy5mO1xuXG4gICAgLy92YXIgY29tcG9uZW50cyA9IHNldHRpbmdzLmNvbXBvbmVudHM7XG4gICAgLy92YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuICAgIHZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG5cblxuXG5cbiAgICB2YXIgeCwgeSwgaCwgdztcbiAgICB2YXIgb2Zmc2V0O1xuXG4vLyBEZWZpbmUgZC5ibG9ja3NcblxuLy8gbW9kdWxlIGQuYmxvY2tcbiAgICB3ID0gc2l6ZS5tb2R1bGUuZnJhbWUudztcbiAgICBoID0gc2l6ZS5tb2R1bGUuZnJhbWUuaDtcblxuICAgIGQuYmxvY2tfc3RhcnQoJ21vZHVsZScpO1xuXG4gICAgLy8gZnJhbWVcbiAgICBkLmxheWVyKCdtb2R1bGUnKTtcbiAgICB4ID0gMDtcbiAgICB5ID0gMCtzaXplLm1vZHVsZS5sZWFkO1xuICAgIGQucmVjdCggW3gseStoLzJdLCBbdyxoXSApO1xuICAgIC8vIGZyYW1lIHRyaWFuZ2xlP1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LXcvMix5XSxcbiAgICAgICAgW3gseSt3LzJdLFxuICAgIF0pO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LHkrdy8yXSxcbiAgICAgICAgW3grdy8yLHldLFxuICAgIF0pO1xuICAgIC8vIGxlYWRzXG4gICAgZC5sYXllcignRENfcG9zJyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gsIHldLFxuICAgICAgICBbeCwgeS1zaXplLm1vZHVsZS5sZWFkXVxuICAgIF0pO1xuICAgIGQubGF5ZXIoJ0RDX25lZycpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LCB5K2hdLFxuICAgICAgICBbeCwgeStoKyhzaXplLm1vZHVsZS5sZWFkKV1cbiAgICBdKTtcbiAgICAvLyBwb3Mgc2lnblxuICAgIGQubGF5ZXIoJ3RleHQnKTtcbiAgICBkLnRleHQoXG4gICAgICAgIFt4K3NpemUubW9kdWxlLmxlYWQvMiwgeS1zaXplLm1vZHVsZS5sZWFkLzJdLFxuICAgICAgICAnKycsXG4gICAgICAgIG51bGwsXG4gICAgICAgICdzaWducydcbiAgICApO1xuICAgIC8vIG5lZyBzaWduXG4gICAgZC50ZXh0KFxuICAgICAgICBbeCtzaXplLm1vZHVsZS5sZWFkLzIsIHkraCtzaXplLm1vZHVsZS5sZWFkLzJdLFxuICAgICAgICAnLScsXG4gICAgICAgIG51bGwsXG4gICAgICAgICdzaWducydcbiAgICApO1xuICAgIC8vIGdyb3VuZFxuICAgIGQubGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LXcvMiwgeStoLzJdLFxuICAgICAgICBbeC13LzItdy80LCB5K2gvMl0sXG4gICAgXSk7XG5cbiAgICBkLmxheWVyKCk7XG4gICAgZC5ibG9ja19lbmQoKTtcblxuLy8jc3RyaW5nXG4gICAgZC5ibG9ja19zdGFydCgnc3RyaW5nJyk7XG5cbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcblxuXG5cblxuXG4gICAgdmFyIG1heF9kaXNwbGF5ZWRfbW9kdWxlcyA9IDk7XG4gICAgdmFyIGJyZWFrX3N0cmluZyA9IGZhbHNlO1xuXG4gICAgaWYoIHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgPiBtYXhfZGlzcGxheWVkX21vZHVsZXMgKXtcbiAgICAgICAgZGlzcGxheWVkX21vZHVsZXMgPSBtYXhfZGlzcGxheWVkX21vZHVsZXMgLSAxO1xuICAgICAgICBicmVha19zdHJpbmcgPSB0cnVlO1xuICAgICAgICBzaXplLnN0cmluZy5oID0gKHNpemUubW9kdWxlLmggKiAoZGlzcGxheWVkX21vZHVsZXMrMSkgKSArIHNpemUuc3RyaW5nLmdhcF9taXNzaW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGRpc3BsYXllZF9tb2R1bGVzID0gc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZztcbiAgICAgICAgc2l6ZS5zdHJpbmcuaCA9IChzaXplLm1vZHVsZS5oICogZGlzcGxheWVkX21vZHVsZXMpO1xuICAgIH1cbiAgICBsb2MuYXJyYXkubG93ZXIgPSBsb2MuYXJyYXkudXBwZXIgKyBzaXplLnN0cmluZy5oO1xuXG4gICAgc2l6ZS5zdHJpbmcuaF9tYXggPSAoc2l6ZS5tb2R1bGUuaCAqIG1heF9kaXNwbGF5ZWRfbW9kdWxlcykgKyBzaXplLnN0cmluZy5nYXBfbWlzc2luZztcbiAgICBsb2MuYXJyYXkubG93ZXJfbGltaXQgPSBsb2MuYXJyYXkudXBwZXIgKyBzaXplLnN0cmluZy5oX21heDtcblxuXG5cbiAgICBmb3IoIHZhciByPTA7IHI8ZGlzcGxheWVkX21vZHVsZXM7IHIrKyl7XG4gICAgICAgIGQuYmxvY2soJ21vZHVsZScsIFt4LHldKTtcbiAgICAgICAgeSArPSBzaXplLm1vZHVsZS5oO1xuXG4gICAgfVxuICAgIGlmKCBicmVha19zdHJpbmcgKSB7XG4gICAgICAgIGQubGluZShcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBbeCx5XSxcbiAgICAgICAgICAgICAgICBbeCx5K3NpemUuc3RyaW5nLmdhcF9taXNzaW5nXSxcbiAgICAgICAgICAgIC8vW3gtc2l6ZS5tb2R1bGUuZnJhbWUudyozLzQsIHkrc2l6ZS5zdHJpbmcuaCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ0RDX2ludGVybW9kdWxlJ1xuICAgICAgICApO1xuXG4gICAgICAgIHkgKz0gc2l6ZS5zdHJpbmcuZ2FwX21pc3Npbmc7XG4gICAgICAgIGQuYmxvY2soJ21vZHVsZScsIFt4LHldKTtcbiAgICB9XG5cbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcblxuICAgIC8vVE9ETzogYWRkIGxvb3AgdG8ganVtcCBvdmVyIG5lZ2F0aXZlIHJldHVybiB3aXJlc1xuICAgIGQubGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LXNpemUubW9kdWxlLmZyYW1lLncqMy80LCB5K3NpemUubW9kdWxlLmgvMl0sXG4gICAgICAgIFt4LXNpemUubW9kdWxlLmZyYW1lLncqMy80LCB5K3NpemUuc3RyaW5nLmhfbWF4ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmRdLFxuICAgICAgICAvL1t4LXNpemUubW9kdWxlLmZyYW1lLncqMy80LCB5K3NpemUuc3RyaW5nLmggKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgIF0pO1xuICAgIGQubGF5ZXIoKTtcblxuXG4gICAgZC5ibG9ja19lbmQoKTtcblxuXG4vLyB0ZXJtaW5hbFxuICAgIGQuYmxvY2tfc3RhcnQoJ3Rlcm1pbmFsJyk7XG4gICAgeCA9IDA7XG4gICAgeSA9IDA7XG5cbiAgICBkLmxheWVyKCd0ZXJtaW5hbCcpO1xuICAgIGQuY2lyYyhcbiAgICAgICAgW3gseV0sXG4gICAgICAgIHNpemUudGVybWluYWxfZGlhbVxuICAgICk7XG4gICAgZC5sYXllcigpO1xuICAgIGQuYmxvY2tfZW5kKCk7XG5cbi8vIGZ1c2VcblxuICAgIGQuYmxvY2tfc3RhcnQoJ2Z1c2UnKTtcbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcbiAgICB3ID0gMTA7XG4gICAgaCA9IDU7XG5cbiAgICBkLmxheWVyKCd0ZXJtaW5hbCcpO1xuICAgIGQucmVjdChcbiAgICAgICAgW3gseV0sXG4gICAgICAgIFt3LGhdXG4gICAgKTtcbiAgICBkLmxpbmUoIFtcbiAgICAgICAgW3cvMix5XSxcbiAgICAgICAgW3cvMitzaXplLmZ1c2UudywgeV1cbiAgICBdKTtcbiAgICBkLmJsb2NrKCd0ZXJtaW5hbCcsIFtzaXplLmZ1c2UudywgeV0gKTtcblxuICAgIGQubGluZSggW1xuICAgICAgICBbLXcvMix5XSxcbiAgICAgICAgWy13LzItc2l6ZS5mdXNlLncsIHldXG4gICAgXSk7XG4gICAgZC5ibG9jaygndGVybWluYWwnLCBbLXNpemUuZnVzZS53LCB5XSApO1xuXG4gICAgZC5sYXllcigpO1xuICAgIGQuYmxvY2tfZW5kKCk7XG5cbi8vIGdyb3VuZCBzeW1ib2xcbiAgICBkLmJsb2NrX3N0YXJ0KCdncm91bmQnKTtcbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcblxuICAgIGQubGF5ZXIoJ0FDX2dyb3VuZCcpO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LHldLFxuICAgICAgICBbeCx5KzQwXSxcbiAgICBdKTtcbiAgICB5ICs9IDI1O1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LTcuNSx5XSxcbiAgICAgICAgW3grNy41LHldLFxuICAgIF0pO1xuICAgIHkgKz0gNTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC01LHldLFxuICAgICAgICBbeCs1LHldLFxuICAgIF0pO1xuICAgIHkgKz0gNTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeC0yLjUseV0sXG4gICAgICAgIFt4KzIuNSx5XSxcbiAgICBdKTtcbiAgICBkLmxheWVyKCk7XG5cbiAgICBkLmJsb2NrX2VuZCgpO1xuXG5cblxuLy8gTm9ydGggYXJyb3dcbiAgICB4ID0gMDtcbiAgICB5ID0gMDtcblxuICAgIHZhciBhcnJvd193ID0gNztcbiAgICB2YXIgbGV0dGVyX2ggPSAxNDtcbiAgICB2YXIgYXJyb3dfaCA9IDUwO1xuXG4gICAgZC5ibG9ja19zdGFydCgnbm9ydGggYXJyb3dfdXAnKTtcbiAgICBkLmxheWVyKCdub3J0aF9sZXR0ZXInKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCwgeStsZXR0ZXJfaF0sXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3grYXJyb3dfdywgeStsZXR0ZXJfaF0sXG4gICAgICAgIFt4K2Fycm93X3csIHldLFxuICAgIF0pO1xuICAgIGQubGF5ZXIoJ25vcnRoX2Fycm93Jyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3gsIHkrYXJyb3dfaF0sXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3grYXJyb3dfdy8yLCB5K2xldHRlcl9oLzJdLFxuICAgIF0pO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3gtYXJyb3dfdy8yLCB5K2xldHRlcl9oLzJdLFxuICAgIF0pO1xuICAgIGQubGF5ZXIoKTtcbiAgICBkLmJsb2NrX2VuZCgnbm9ydGggYXJyb3cnKTtcblxuICAgIGQuYmxvY2tfc3RhcnQoJ25vcnRoIGFycm93X2xlZnQnKTtcbiAgICBkLmxheWVyKCdub3J0aF9sZXR0ZXInKTtcbiAgICBkLmxpbmUoW1xuICAgICAgICBbeCtsZXR0ZXJfaCwgeV0sXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3grbGV0dGVyX2gsIHktYXJyb3dfd10sXG4gICAgICAgIFt4LCAgICAgICAgICB5LWFycm93X3ddLFxuICAgIF0pO1xuICAgIGQubGF5ZXIoJ25vcnRoX2Fycm93Jyk7XG4gICAgZC5saW5lKFtcbiAgICAgICAgW3grYXJyb3dfaCwgeV0sXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3grbGV0dGVyX2gvMiwgeS1hcnJvd193LzJdLFxuICAgIF0pO1xuICAgIGQubGluZShbXG4gICAgICAgIFt4LCB5XSxcbiAgICAgICAgW3grbGV0dGVyX2gvMiwgeSthcnJvd193LzJdLFxuICAgIF0pO1xuICAgIGQubGF5ZXIoKTtcbiAgICBkLmJsb2NrX2VuZCgnbm9ydGggYXJyb3cnKTtcblxuLy8qL1xuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xuXG4vL3ZhciBkcmF3aW5nX3BhcnRzID0gW107XG4vL2QubGlua19kcmF3aW5nX3BhcnRzKGRyYXdpbmdfcGFydHMpO1xuXG52YXIgYWRkX2JvcmRlciA9IGZ1bmN0aW9uKHNldHRpbmdzLCBzaGVldF9zZWN0aW9uLCBzaGVldF9udW0pe1xuICAgIGQgPSBta19kcmF3aW5nKHNldHRpbmdzKTtcbiAgICB2YXIgZiA9IHNldHRpbmdzLmY7XG5cbiAgICAvL3ZhciBjb21wb25lbnRzID0gc2V0dGluZ3MuY29tcG9uZW50cztcbiAgICAvL3ZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG4gICAgdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcblxuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxvYztcblxuXG5cblxuICAgIHZhciB4LCB5LCBoLCB3O1xuICAgIHZhciBvZmZzZXQ7XG5cbi8vIERlZmluZSBkLmJsb2Nrc1xuLy8gbW9kdWxlIGQuYmxvY2tcbiAgICB3ID0gc2l6ZS5tb2R1bGUuZnJhbWUudztcbiAgICBoID0gc2l6ZS5tb2R1bGUuZnJhbWUuaDtcblxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBGcmFtZVxuICAgIGQuc2VjdGlvbignRnJhbWUnKTtcblxuICAgIHcgPSBzaXplLmRyYXdpbmcudztcbiAgICBoID0gc2l6ZS5kcmF3aW5nLmg7XG4gICAgdmFyIHBhZGRpbmcgPSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZztcblxuICAgIGQubGF5ZXIoJ2ZyYW1lJyk7XG5cbiAgICAvL2JvcmRlclxuICAgIGQucmVjdCggW3cvMiAsIGgvMl0sIFt3IC0gcGFkZGluZyoyLCBoIC0gcGFkZGluZyoyIF0gKTtcblxuICAgIHggPSB3IC0gcGFkZGluZyAqIDM7XG4gICAgeSA9IHBhZGRpbmcgKiAzO1xuXG4gICAgdyA9IHNpemUuZHJhd2luZy50aXRsZWJveDtcbiAgICBoID0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94O1xuXG4gICAgLy8gYm94IHRvcC1yaWdodFxuICAgIGQucmVjdCggW3gtdy8yLCB5K2gvMl0sIFt3LGhdICk7XG5cbiAgICB5ICs9IGggKyBwYWRkaW5nO1xuXG4gICAgdyA9IHNpemUuZHJhd2luZy50aXRsZWJveDtcbiAgICBoID0gc2l6ZS5kcmF3aW5nLmggLSBwYWRkaW5nKjggLSBzaXplLmRyYXdpbmcudGl0bGVib3gqMi41O1xuXG4gICAgLy90aXRsZSBib3hcbiAgICBkLnJlY3QoIFt4LXcvMiwgeStoLzJdLCBbdyxoXSApO1xuXG4gICAgdmFyIHRpdGxlID0ge307XG4gICAgdGl0bGUudG9wID0geTtcbiAgICB0aXRsZS5ib3R0b20gPSB5K2g7XG4gICAgdGl0bGUucmlnaHQgPSB4O1xuICAgIHRpdGxlLmxlZnQgPSB4LXcgO1xuXG5cbiAgICAvLyBib3ggYm90dG9tLXJpZ2h0XG4gICAgaCA9IHNpemUuZHJhd2luZy50aXRsZWJveCAqIDEuNTtcbiAgICB5ID0gdGl0bGUuYm90dG9tICsgcGFkZGluZztcbiAgICB4ID0geC13LzI7XG4gICAgeSA9IHkraC8yO1xuICAgIGQucmVjdCggW3gsIHldLCBbdyxoXSApO1xuXG4gICAgeSAtPSAyMCoyLzM7XG4gICAgZC50ZXh0KFt4LHldLFxuICAgICAgICBbIHNoZWV0X3NlY3Rpb24sIHNoZWV0X251bSBdLFxuICAgICAgICAndGV4dCcsXG4gICAgICAgICdwYWdlJ1xuICAgICAgICApO1xuXG5cbiAgICB2YXIgcGFnZSA9IHt9O1xuICAgIHBhZ2UucmlnaHQgPSB0aXRsZS5yaWdodDtcbiAgICBwYWdlLmxlZnQgPSB0aXRsZS5sZWZ0O1xuICAgIHBhZ2UudG9wID0gdGl0bGUuYm90dG9tICsgcGFkZGluZztcbiAgICBwYWdlLmJvdHRvbSA9IHBhZ2UudG9wICsgc2l6ZS5kcmF3aW5nLnRpdGxlYm94KjEuNTtcbiAgICAvLyBkLnRleHRcblxuICAgIHggPSB0aXRsZS5sZWZ0ICsgcGFkZGluZztcbiAgICB5ID0gdGl0bGUuYm90dG9tIC0gcGFkZGluZztcblxuICAgIHggKz0gMTA7XG4gICAgaWYoIHN5c3RlbS5pbnZlcnRlci5tYWtlICYmIHN5c3RlbS5pbnZlcnRlci5tb2RlbCApe1xuICAgICAgICBkLnRleHQoW3gseV0sXG4gICAgICAgICAgICAgWyAnUFYgU3lzdGVtIERlc2lnbicgXSxcbiAgICAgICAgICAgICd0ZXh0JyxcbiAgICAgICAgICAgICd0aXRsZTEnXG4gICAgICAgICAgICApLnJvdGF0ZSgtOTApO1xuXG4gICAgfVxuXG4gICAgeCArPSAxNDtcbiAgICBpZiggc2V0dGluZ3MuZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdsb2NhdGlvbicpICApe1xuICAgICAgICBkLnRleHQoW3gseV0sIFtcbiAgICAgICAgICAgIHNldHRpbmdzLnBlcm0ubG9jYXRpb24uYWRkcmVzcyxcbiAgICAgICAgICAgIHNldHRpbmdzLnBlcm0ubG9jYXRpb24uY2l0eSArICcsICcgKyBzZXR0aW5ncy5wZXJtLmxvY2F0aW9uLmNvdW50eSArICcsIEZMLCAnICsgc2V0dGluZ3MucGVybS5sb2NhdGlvbi56aXAsXG5cbiAgICAgICAgXSwgJ3RleHQnLCAndGl0bGUzJykucm90YXRlKC05MCk7XG4gICAgfVxuXG4gICAgeCA9IHBhZ2UubGVmdCArIHBhZGRpbmc7XG4gICAgeSA9IHBhZ2UudG9wICsgcGFkZGluZztcbiAgICB5ICs9IHNpemUuZHJhd2luZy50aXRsZWJveCAqIDEuNSAqIDMvNDtcblxuXG5cblxuXG5cblxuICAgIHJldHVybiBkLmRyYXdpbmdfcGFydHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBhZGRfYm9yZGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxuXG52YXIgbWtfZHJhd2luZyA9IGZ1bmN0aW9uKGcpe1xuXG4gICAgdmFyIGRyYXdpbmcgPSB7fTtcblxuXG4gICAgdmFyIGxheWVyX2F0dHIgPSByZXF1aXJlKCcuL3NldHRpbmdzX2xheWVycycpO1xuICAgIHZhciBmb250cyA9IHJlcXVpcmUoJy4vc2V0dGluZ3NfZm9udHMnKTtcblxuXG5cblxuXG5cblxuICAgIC8vIEJMT0NLU1xuXG4gICAgdmFyIEJsayA9IHtcbiAgICAgICAgdHlwZTogJ2Jsb2NrJyxcbiAgICB9O1xuICAgIEJsay5tb3ZlID0gZnVuY3Rpb24oeCwgeSl7XG4gICAgICAgIGZvciggdmFyIGkgaW4gdGhpcy5kcmF3aW5nX3BhcnRzICl7XG4gICAgICAgICAgICB0aGlzLmRyYXdpbmdfcGFydHNbaV0ubW92ZSh4LHkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgQmxrLmFkZCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCB0eXBlb2YgdGhpcy5kcmF3aW5nX3BhcnRzID09ICd1bmRlZmluZWQnKXtcbiAgICAgICAgICAgIHRoaXMuZHJhd2luZ19wYXJ0cyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGZvciggdmFyIGkgaW4gYXJndW1lbnRzKXtcbiAgICAgICAgICAgIHRoaXMuZHJhd2luZ19wYXJ0cy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBCbGsucm90YXRlID0gZnVuY3Rpb24oZGVnKXtcbiAgICAgICAgdGhpcy5yb3RhdGUgPSBkZWc7XG4gICAgfTtcblxuXG4gICAgdmFyIGJsb2NrX2FjdGl2ZSA9IGZhbHNlO1xuICAgIC8vIENyZWF0ZSBkZWZhdWx0IGxheWVyLGJsb2NrIGNvbnRhaW5lciBhbmQgZnVuY3Rpb25zXG5cbiAgICAvLyBMYXllcnNcblxuICAgIHZhciBsYXllcl9hY3RpdmUgPSBmYWxzZTtcblxuICAgIGRyYXdpbmcubGF5ZXIgPSBmdW5jdGlvbihuYW1lKXsgLy8gc2V0IGN1cnJlbnQgbGF5ZXJcbiAgICAgICAgaWYoIHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJyApeyAvLyBpZiBubyBsYXllciBuYW1lIGdpdmVuLCByZXNldCB0byBkZWZhdWx0XG4gICAgICAgICAgICBsYXllcl9hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmICggISAobmFtZSBpbiBsYXllcl9hdHRyKSApIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignRXJyb3I6IHVua25vd24gbGF5ZXIgXCInK25hbWUrJ1wiLCB1c2luZyBiYXNlJyk7XG4gICAgICAgICAgICBsYXllcl9hY3RpdmUgPSAnYmFzZScgO1xuICAgICAgICB9IGVsc2UgeyAvLyBmaW5hbHkgYWN0aXZhdGUgcmVxdWVzdGVkIGxheWVyXG4gICAgICAgICAgICBsYXllcl9hY3RpdmUgPSBuYW1lO1xuICAgICAgICB9XG4gICAgICAgIC8vKi9cbiAgICB9O1xuXG4gICAgdmFyIHNlY3Rpb25fYWN0aXZlID0gZmFsc2U7XG5cbiAgICBkcmF3aW5nLnNlY3Rpb24gPSBmdW5jdGlvbihuYW1lKXsgLy8gc2V0IGN1cnJlbnQgc2VjdGlvblxuICAgICAgICBpZiggdHlwZW9mIG5hbWUgPT09ICd1bmRlZmluZWQnICl7IC8vIGlmIG5vIHNlY3Rpb24gbmFtZSBnaXZlbiwgcmVzZXQgdG8gZGVmYXVsdFxuICAgICAgICAgICAgc2VjdGlvbl9hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHsgLy8gZmluYWx5IGFjdGl2YXRlIHJlcXVlc3RlZCBzZWN0aW9uXG4gICAgICAgICAgICBzZWN0aW9uX2FjdGl2ZSA9IG5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8qL1xuICAgIH07XG5cblxuICAgIGRyYXdpbmcuYmxvY2tfc3RhcnQgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIGlmKCB0eXBlb2YgbmFtZSA9PT0gJ3VuZGVmaW5lZCcgKXsgLy8gaWYgbmFtZSBhcmd1bWVudCBpcyBzdWJtaXR0ZWRcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogbmFtZSByZXF1aXJlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGJsaztcbiAgICAgICAgICAgIGJsb2NrX2FjdGl2ZSA9IG5hbWU7XG4gICAgICAgICAgICBpZiggZy5kcmF3aW5nLmJsb2Nrc1tibG9ja19hY3RpdmVdICE9PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6IGJsb2NrIGFscmVhZHkgZXhpc3RzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBibGsgPSBPYmplY3QuY3JlYXRlKEJsayk7XG4gICAgICAgICAgICBnLmRyYXdpbmcuYmxvY2tzW2Jsb2NrX2FjdGl2ZV0gPSBibGs7XG4gICAgICAgICAgICByZXR1cm4gYmxrO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgICAgICAvKlxuICAgICAgICB4ID0gbG9jLndpcmVfdGFibGUueCAtIHcvMjtcbiAgICAgICAgeSA9IGxvYy53aXJlX3RhYmxlLnkgLSBoLzI7XG4gICAgICAgIGlmKCB0eXBlb2YgbGF5ZXJfbmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApIHtcbiAgICAgICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9IGxheWVyc1tsYXllcl9uYW1lXVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYoICEgKGxheWVyX25hbWUgaW4gbGF5ZXJzKSApeyBjb25zb2xlLmxvZyhcImVycm9yLCBsYXllciBkb2VzIG5vdCBleGlzdCwgdXNpbmcgY3VycmVudFwiKTt9XG4gICAgICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSAgbGF5ZXJfYWN0aXZlXG4gICAgICAgIH1cbiAgICAgICAgKi9cbiAgICBkcmF3aW5nLmJsb2NrX2VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYmxrID0gZy5kcmF3aW5nLmJsb2Nrc1tibG9ja19hY3RpdmVdO1xuICAgICAgICBibG9ja19hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIGJsaztcbiAgICB9O1xuXG5cblxuXG5cblxuICAgIC8vLy8vL1xuICAgIC8vIGJ1aWxkIHByb3RvdHlwZSBlbGVtZW50XG5cbiAgICAgICAgLypcbiAgICAgICAgaWYoIHR5cGVvZiBsYXllcl9uYW1lICE9PSAndW5kZWZpbmVkJyAmJiAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICkge1xuICAgICAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gbGF5ZXJzW2xheWVyX25hbWVdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiggISAobGF5ZXJfbmFtZSBpbiBsYXllcnMpICl7IGNvbnNvbGUubG9nKFwiZXJyb3IsIGxheWVyIGRvZXMgbm90IGV4aXN0LCB1c2luZyBjdXJyZW50XCIpO31cbiAgICAgICAgICAgIHZhciBsYXllcl9zZWxlY3RlZCA9ICBsYXllcl9hY3RpdmVcbiAgICAgICAgfVxuICAgICAgICAqL1xuXG5cbiAgICB2YXIgU3ZnRWxlbSA9IHtcbiAgICAgICAgb2JqZWN0OiAnU3ZnRWxlbSdcbiAgICB9O1xuICAgIFN2Z0VsZW0ubW92ZSA9IGZ1bmN0aW9uKHgsIHkpe1xuICAgICAgICBpZiggdHlwZW9mIHRoaXMucG9pbnRzICE9ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgZm9yKCB2YXIgaSBpbiB0aGlzLnBvaW50cyApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBvaW50c1tpXVswXSArPSB4O1xuICAgICAgICAgICAgICAgIHRoaXMucG9pbnRzW2ldWzFdICs9IHk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBTdmdFbGVtLnJvdGF0ZSA9IGZ1bmN0aW9uKGRlZyl7XG4gICAgICAgIHRoaXMucm90YXRlZCA9IGRlZztcbiAgICB9O1xuXG4gICAgLy8vLy8vL1xuICAgIC8vIGZ1bmN0aW9ucyBmb3IgYWRkaW5nIGRyYXdpbmdfcGFydHNcblxuICAgIGRyYXdpbmcuYWRkID0gZnVuY3Rpb24odHlwZSwgcG9pbnRzLCBsYXllcl9uYW1lLCBhdHRycykge1xuICAgICAgICBpZiggcG9pbnRzWzBdID09PSB1bmRlZmluZWQgKSBjb25zb2xlLndhcm4oXCJwb2ludHMgbm90IGRlZmZpbmVkXCIsIHR5cGUsIHBvaW50cywgbGF5ZXJfbmFtZSApO1xuXG4gICAgICAgIGlmKCAhIGxheWVyX25hbWUgKSB7IGxheWVyX25hbWUgPSBsYXllcl9hY3RpdmU7IH1cbiAgICAgICAgaWYoICEgKGxheWVyX25hbWUgaW4gbGF5ZXJfYXR0cikgKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0Vycm9yOiBMYXllciBcIicrIGxheWVyX25hbWUgKydcIiBuYW1lIG5vdCBmb3VuZCwgdXNpbmcgYmFzZScpO1xuICAgICAgICAgICAgbGF5ZXJfbmFtZSA9ICdiYXNlJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCB0eXBlb2YgcG9pbnRzID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnRzX2EgPSBwb2ludHMuc3BsaXQoJyAnKTtcbiAgICAgICAgICAgIGZvciggdmFyIGkgaW4gcG9pbnRzX2EgKSB7XG4gICAgICAgICAgICAgICAgcG9pbnRzX2FbaV0gPSBwb2ludHNfYVtpXS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgICAgIGZvciggdmFyIGMgaW4gcG9pbnRzX2FbaV0gKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvaW50c19hW2ldW2NdID0gTnVtYmVyKHBvaW50c19hW2ldW2NdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZWxlbSA9IE9iamVjdC5jcmVhdGUoU3ZnRWxlbSk7XG4gICAgICAgIGVsZW0udHlwZSA9IHR5cGU7XG4gICAgICAgIGVsZW0ubGF5ZXJfbmFtZSA9IGxheWVyX25hbWU7XG4gICAgICAgIGVsZW0uc2VjdGlvbl9uYW1lID0gc2VjdGlvbl9hY3RpdmU7XG4gICAgICAgIGlmKCBhdHRycyAhPT0gdW5kZWZpbmVkICkgZWxlbS5hdHRycyA9IGF0dHJzO1xuICAgICAgICBpZiggdHlwZSA9PT0gJ2xpbmUnICkge1xuICAgICAgICAgICAgZWxlbS5wb2ludHMgPSBwb2ludHM7XG4gICAgICAgIH0gZWxzZSBpZiggdHlwZSA9PT0gJ3BvbHknICkge1xuICAgICAgICAgICAgZWxlbS5wb2ludHMgPSBwb2ludHM7XG4gICAgICAgIH0gZWxzZSBpZiggdHlwZW9mIHBvaW50c1swXS54ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgZWxlbS54ID0gcG9pbnRzWzBdWzBdO1xuICAgICAgICAgICAgZWxlbS55ID0gcG9pbnRzWzBdWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbS54ID0gcG9pbnRzWzBdLng7XG4gICAgICAgICAgICBlbGVtLnkgPSBwb2ludHNbMF0ueTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGJsb2NrX2FjdGl2ZSkge1xuICAgICAgICAgICAgZWxlbS5ibG9ja19uYW1lID0gYmxvY2tfYWN0aXZlO1xuICAgICAgICAgICAgZy5kcmF3aW5nLmJsb2Nrc1tibG9ja19hY3RpdmVdLmFkZChlbGVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd2luZ19wYXJ0cy5wdXNoKGVsZW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGVsZW07XG4gICAgfTtcblxuICAgIGRyYXdpbmcubGluZSA9IGZ1bmN0aW9uKHBvaW50cywgbGF5ZXIsIGF0dHJzKXsgLy8gKHBvaW50cywgW2xheWVyXSlcbiAgICAgICAgLy9yZXR1cm4gYWRkKCdsaW5lJywgcG9pbnRzLCBsYXllcilcbiAgICAgICAgdmFyIGxpbmUgPSAgdGhpcy5hZGQoJ2xpbmUnLCBwb2ludHMsIGxheWVyLCBhdHRycyk7XG4gICAgICAgIHJldHVybiBsaW5lO1xuICAgIH07XG5cbiAgICBkcmF3aW5nLnBvbHkgPSBmdW5jdGlvbihwb2ludHMsIGxheWVyLCBhdHRycyl7IC8vIChwb2ludHMsIFtsYXllcl0pXG4gICAgICAgIC8vcmV0dXJuIGFkZCgncG9seScsIHBvaW50cywgbGF5ZXIpXG4gICAgICAgIHZhciBwb2x5ID0gIHRoaXMuYWRkKCdwb2x5JywgcG9pbnRzLCBsYXllciwgYXR0cnMpO1xuICAgICAgICByZXR1cm4gcG9seTtcbiAgICB9O1xuXG4gICAgZHJhd2luZy5yZWN0ID0gZnVuY3Rpb24obG9jLCBzaXplLCBsYXllciwgYXR0cnMpe1xuICAgICAgICB2YXIgcmVjID0gdGhpcy5hZGQoJ3JlY3QnLCBbbG9jXSwgbGF5ZXIsIGF0dHJzKTtcbiAgICAgICAgcmVjLncgPSBzaXplWzBdO1xuICAgICAgICAvKlxuICAgICAgICBpZiggdHlwZW9mIGxheWVyX25hbWUgIT09ICd1bmRlZmluZWQnICYmIChsYXllcl9uYW1lIGluIGxheWVycykgKSB7XG4gICAgICAgICAgICB2YXIgbGF5ZXJfc2VsZWN0ZWQgPSBsYXllcnNbbGF5ZXJfbmFtZV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmKCAhIChsYXllcl9uYW1lIGluIGxheWVycykgKXsgY29uc29sZS5sb2coXCJlcnJvciwgbGF5ZXIgZG9lcyBub3QgZXhpc3QsIHVzaW5nIGN1cnJlbnRcIik7fVxuICAgICAgICAgICAgdmFyIGxheWVyX3NlbGVjdGVkID0gIGxheWVyX2FjdGl2ZVxuICAgICAgICB9XG4gICAgICAgICovXG4gICAgICAgIHJlYy5oID0gc2l6ZVsxXTtcbiAgICAgICAgcmV0dXJuIHJlYztcbiAgICB9O1xuXG4gICAgZHJhd2luZy5jaXJjID0gZnVuY3Rpb24obG9jLCBkaWFtZXRlciwgbGF5ZXIsIGF0dHJzKXtcbiAgICAgICAgdmFyIGNpciA9IHRoaXMuYWRkKCdjaXJjJywgW2xvY10sIGxheWVyLCBhdHRycyk7XG4gICAgICAgIGNpci5kID0gZGlhbWV0ZXI7XG4gICAgICAgIHJldHVybiBjaXI7XG4gICAgfTtcblxuICAgIGRyYXdpbmcudGV4dCA9IGZ1bmN0aW9uKGxvYywgc3RyaW5ncywgbGF5ZXIsIGZvbnQsIGF0dHJzKXtcbiAgICAgICAgdmFyIHR4dCA9IHRoaXMuYWRkKCd0ZXh0JywgW2xvY10sIGxheWVyLCBhdHRycyk7XG4gICAgICAgIGlmKCB0eXBlb2Ygc3RyaW5ncyA9PSAnc3RyaW5nJyl7XG4gICAgICAgICAgICBzdHJpbmdzID0gW3N0cmluZ3NdO1xuICAgICAgICB9XG4gICAgICAgIHR4dC5zdHJpbmdzID0gc3RyaW5ncztcbiAgICAgICAgdHh0LmZvbnQgPSBmb250O1xuICAgICAgICByZXR1cm4gdHh0O1xuICAgIH07XG5cbiAgICBkcmF3aW5nLmJsb2NrID0gZnVuY3Rpb24obmFtZSkgey8vIHNldCBjdXJyZW50IGJsb2NrXG4gICAgICAgIHZhciB4LHk7XG4gICAgICAgIGlmKCBhcmd1bWVudHMubGVuZ3RoID09PSAyICl7IC8vIGlmIGNvb3IgaXMgcGFzc2VkXG4gICAgICAgICAgICBpZiggdHlwZW9mIGFyZ3VtZW50c1sxXS54ICE9PSAndW5kZWZpbmVkJyApe1xuICAgICAgICAgICAgICAgIHggPSBhcmd1bWVudHNbMV0ueDtcbiAgICAgICAgICAgICAgICB5ID0gYXJndW1lbnRzWzFdLnk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHggPSBhcmd1bWVudHNbMV1bMF07XG4gICAgICAgICAgICAgICAgeSA9IGFyZ3VtZW50c1sxXVsxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmKCBhcmd1bWVudHMubGVuZ3RoID09PSAzICl7IC8vIGlmIHgseSBpcyBwYXNzZWRcbiAgICAgICAgICAgIHggPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICB5ID0gYXJndW1lbnRzWzJdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ETzogd2hhdCBpZiBibG9jayBkb2VzIG5vdCBleGlzdD8gcHJpbnQgbGlzdCBvZiBibG9ja3M/XG4gICAgICAgIHZhciBibGsgPSBPYmplY3QuY3JlYXRlKGcuZHJhd2luZy5ibG9ja3NbbmFtZV0pO1xuICAgICAgICBibGsueCA9IHg7XG4gICAgICAgIGJsay55ID0geTtcblxuICAgICAgICBpZihibG9ja19hY3RpdmUpe1xuICAgICAgICAgICAgZy5kcmF3aW5nLmJsb2Nrc1tibG9ja19hY3RpdmVdLmFkZChibGspO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kcmF3aW5nX3BhcnRzLnB1c2goYmxrKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmxrO1xuICAgIH07XG5cblxuXG5cblxuXG5cblxuXG5cbiAgICAvLy8vLy8vLy8vLy8vL1xuICAgIC8vIFRhYmxlc1xuXG4gICAgdmFyIENlbGwgPSB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKHRhYmxlLCBSLCBDKXtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMudGFibGUgPSB0YWJsZTtcbiAgICAgICAgICAgIHRoaXMuUiA9IFI7XG4gICAgICAgICAgICB0aGlzLkMgPSBDO1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgIHRoaXMuYm9yZGVycyA9IHt9O1xuICAgICAgICAgICAgdGhpcy5ib3JkZXJfb3B0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHNpZGUpe1xuICAgICAgICAgICAgICAgIHNlbGYuYm9yZGVyc1tzaWRlXSA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyovXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcbiAgICAgICAgLypcbiAgICAgICAgYm9yZGVyX29wdGlvbnM6IFsnVCcsICdCJywgJ0wnLCAnUiddLFxuICAgICAgICAvLyovXG4gICAgICAgIHRleHQ6IGZ1bmN0aW9uKHRleHQpe1xuICAgICAgICAgICAgdGhpcy5jZWxsX3RleHQgPSB0ZXh0O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgfSxcbiAgICAgICAgZm9udDogZnVuY3Rpb24oZm9udF9uYW1lKXtcbiAgICAgICAgICAgIHRoaXMuY2VsbF9mb250X25hbWUgPSBmb250X25hbWU7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcblxuICAgICAgICBib3JkZXI6IGZ1bmN0aW9uKGJvcmRlcl9zdHJpbmcsIHN0YXRlKXtcbiAgICAgICAgICAgIHRoaXMudGFibGUuYm9yZGVyKCB0aGlzLlIsIHRoaXMuQywgYm9yZGVyX3N0cmluZywgc3RhdGUgKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBUYWJsZSA9IHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oIGRyYXdpbmcsIG51bV9yb3dzLCBudW1fY29scyApe1xuICAgICAgICAgICAgdGhpcy5kcmF3aW5nID0gZHJhd2luZztcbiAgICAgICAgICAgIHRoaXMubnVtX3Jvd3MgPSBudW1fcm93cztcbiAgICAgICAgICAgIHRoaXMubnVtX2NvbHMgPSBudW1fY29scztcbiAgICAgICAgICAgIHZhciByLGM7XG5cbiAgICAgICAgICAgIC8vIHNldHVwIGJvcmRlciBjb250YWluZXJzXG4gICAgICAgICAgICB0aGlzLmJvcmRlcnNfcm93cyA9IFtdO1xuICAgICAgICAgICAgZm9yKCByPTA7IHI8PW51bV9yb3dzOyByKyspe1xuICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyc19yb3dzW3JdID0gW107XG4gICAgICAgICAgICAgICAgZm9yKCBjPTE7IGM8PW51bV9jb2xzOyBjKyspe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfcm93c1tyXVtjXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYm9yZGVyc19jb2xzID0gW107XG4gICAgICAgICAgICBmb3IoIGM9MDsgYzw9bnVtX2NvbHM7IGMrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5ib3JkZXJzX2NvbHNbY10gPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IoIHI9MTsgcjw9bnVtX3Jvd3M7IHIrKyl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyc19jb2xzW2NdW3JdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZXQgY29sdW1uIGFuZCByb3cgc2l6ZSBjb250YWluZXJzXG4gICAgICAgICAgICB0aGlzLnJvd19zaXplcyA9IFtdO1xuICAgICAgICAgICAgZm9yKCByPTE7IHI8PW51bV9yb3dzOyByKyspe1xuICAgICAgICAgICAgICAgIHRoaXMucm93X3NpemVzW3JdID0gMTU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNvbF9zaXplcyA9IFtdO1xuICAgICAgICAgICAgZm9yKCBjPTE7IGM8PW51bV9jb2xzOyBjKyspe1xuICAgICAgICAgICAgICAgIHRoaXMuY29sX3NpemVzW2NdID0gNjA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNldHVwIGNlbGwgY29udGFpbmVyXG4gICAgICAgICAgICB0aGlzLmNlbGxzID0gW107XG4gICAgICAgICAgICBmb3IoIHI9MTsgcjw9bnVtX3Jvd3M7IHIrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tyXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciggYz0xOyBjPD1udW1fY29sczsgYysrKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tyXVtjXSA9IE9iamVjdC5jcmVhdGUoQ2VsbCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2VsbHNbcl1bY10uaW5pdCggdGhpcywgciwgYyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyovXG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuICAgICAgICBsb2M6IGZ1bmN0aW9uKCB4LCB5KXtcbiAgICAgICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG4gICAgICAgIGNlbGw6IGZ1bmN0aW9uKCBSLCBDICl7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jZWxsc1tSXVtDXTtcbiAgICAgICAgfSxcbiAgICAgICAgYWxsX2NlbGxzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIGNlbGxfYXJyYXkgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuY2VsbHMuZm9yRWFjaChmdW5jdGlvbihyb3cpe1xuICAgICAgICAgICAgICAgIHJvdy5mb3JFYWNoKGZ1bmN0aW9uKGNlbGwpe1xuICAgICAgICAgICAgICAgICAgICBjZWxsX2FycmF5LnB1c2goY2VsbCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBjZWxsX2FycmF5O1xuICAgICAgICB9LFxuICAgICAgICBjb2xfc2l6ZTogZnVuY3Rpb24oY29sLCBzaXplKXtcbiAgICAgICAgICAgIGlmKCB0eXBlb2YgY29sID09PSAnc3RyaW5nJyApe1xuICAgICAgICAgICAgICAgIGlmKCBjb2wgPT09ICdhbGwnKXtcbiAgICAgICAgICAgICAgICAgICAgXy5yYW5nZSh0aGlzLm51bV9jb2xzKS5mb3JFYWNoKGZ1bmN0aW9uKGMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xfc2l6ZXNbYysxXSA9IHNpemU7XG4gICAgICAgICAgICAgICAgICAgIH0sdGhpcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2l6ZSA9IE51bWJlcihzaXplKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoIGlzTmFOKHNpemUpICl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3I6IGNvbHVtbiB3cm9uZycpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xfc2l6ZXNbY29sXSA9IHNpemU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgeyAvLyBpcyBudW1iZXJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbF9zaXplc1tjb2xdID0gc2l6ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9LFxuICAgICAgICAvLyovXG4gICAgICAgIHJvd19zaXplOiBmdW5jdGlvbihyb3csIHNpemUpe1xuICAgICAgICAgICAgaWYoIHR5cGVvZiByb3cgPT09ICdzdHJpbmcnICl7XG4gICAgICAgICAgICAgICAgaWYoIHJvdyA9PT0gJ2FsbCcpe1xuICAgICAgICAgICAgICAgICAgICBfLnJhbmdlKHRoaXMubnVtX3Jvd3MpLmZvckVhY2goZnVuY3Rpb24ocil7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvd19zaXplc1tyKzFdID0gc2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgfSx0aGlzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzaXplID0gTnVtYmVyKHNpemUpO1xuICAgICAgICAgICAgICAgICAgICBpZiggaXNOYU4oc2l6ZSkgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogY29sdW1uIHdyb25nJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJvd19zaXplc1tyb3ddID0gc2l6ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7IC8vIGlzIG51bWJlclxuICAgICAgICAgICAgICAgIHRoaXMucm93X3NpemVzW3Jvd10gPSBzaXplO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG4gICAgICAgIC8vKi9cblxuICAgICAgICAvKlxuICAgICAgICBhZGRfY2VsbDogZnVuY3Rpb24oKXtcblxuICAgICAgICB9LFxuICAgICAgICBhZGRfcm93czogZnVuY3Rpb24obil7XG4gICAgICAgICAgICB0aGlzLm51bV9jb2xtbnMgKz0gbjtcbiAgICAgICAgICAgIHRoaXMubnVtX3Jvd3MgKz0gbjtcbiAgICAgICAgICAgIF8ucmFuZ2UobikuZm9yRWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRoaXMucm93cy5wdXNoKFtdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXy5yYW5nZShuKS5mb3JFYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0X3Jvd3MucHVzaChbXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9LFxuICAgICAgICB0ZXh0OiBmdW5jdGlvbiggUiwgQywgdGV4dCl7XG4gICAgICAgICAgICB0aGlzLnRleHRfcm93c1tSXVtDXSA9IHRleHQ7XG4gICAgICAgIH0sXG4gICAgICAgIC8vKi9cbiAgICAgICAgYm9yZGVyOiBmdW5jdGlvbiggUiwgQywgYm9yZGVyX3N0cmluZywgc3RhdGUpe1xuICAgICAgICAgICAgaWYoIHN0YXRlID09PSB1bmRlZmluZWQgKSBzdGF0ZSA9IHRydWU7XG5cbiAgICAgICAgICAgIGJvcmRlcl9zdHJpbmcgPSBib3JkZXJfc3RyaW5nLnRvVXBwZXJDYXNlKCkudHJpbSgpO1xuICAgICAgICAgICAgdmFyIGJvcmRlcnM7XG4gICAgICAgICAgICBpZiggYm9yZGVyX3N0cmluZyA9PT0gJ0FMTCcgKXtcbiAgICAgICAgICAgICAgICBib3JkZXJzID0gWydUJywgJ0InLCAnTCcsICdSJ107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJvcmRlcnMgPSBib3JkZXJfc3RyaW5nLnNwbGl0KC9bXFxzLF0rLyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBib3JkZXJzLmZvckVhY2goZnVuY3Rpb24oc2lkZSl7XG4gICAgICAgICAgICAgICAgc3dpdGNoKHNpZGUpe1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdUJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyc19yb3dzW1ItMV1bQ10gPSBzdGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdCJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyc19yb3dzW1JdW0NdID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnTCc6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfY29sc1tDLTFdW1JdID0gc3RhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnUic6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnNfY29sc1tDXVtSXSA9IHN0YXRlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcbiAgICAgICAgY29ybmVyOiBmdW5jdGlvbihSLEMpe1xuICAgICAgICAgICAgdmFyIHggPSB0aGlzLng7XG4gICAgICAgICAgICB2YXIgeSA9IHRoaXMueTtcbiAgICAgICAgICAgIHZhciByLGM7XG4gICAgICAgICAgICBmb3IoIHI9MTsgcjw9UjsgcisrICl7XG4gICAgICAgICAgICAgICAgeSArPSB0aGlzLnJvd19zaXplc1tyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciggYz0xOyBjPD1DOyBjKysgKXtcbiAgICAgICAgICAgICAgICB4ICs9IHRoaXMuY29sX3NpemVzW2NdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFt4LHldO1xuICAgICAgICB9LFxuICAgICAgICBjZW50ZXI6IGZ1bmN0aW9uKFIsQyl7XG4gICAgICAgICAgICB2YXIgeCA9IHRoaXMueDtcbiAgICAgICAgICAgIHZhciB5ID0gdGhpcy55O1xuICAgICAgICAgICAgdmFyIHIsYztcbiAgICAgICAgICAgIGZvciggcj0xOyByPD1SOyByKysgKXtcbiAgICAgICAgICAgICAgICB5ICs9IHRoaXMucm93X3NpemVzW3JdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yKCBjPTE7IGM8PUM7IGMrKyApe1xuICAgICAgICAgICAgICAgIHggKz0gdGhpcy5jb2xfc2l6ZXNbY107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB5IC09IHRoaXMucm93X3NpemVzW1JdLzI7XG4gICAgICAgICAgICB4IC09IHRoaXMuY29sX3NpemVzW0NdLzI7XG4gICAgICAgICAgICByZXR1cm4gW3gseV07XG4gICAgICAgIH0sXG4gICAgICAgIGxlZnQ6IGZ1bmN0aW9uKFIsQyl7XG4gICAgICAgICAgICB2YXIgY29vciA9IHRoaXMuY2VudGVyKFIsQyk7XG4gICAgICAgICAgICBjb29yWzBdID0gY29vclswXSAtIHRoaXMuY29sX3NpemVzW0NdLzIgKyB0aGlzLnJvd19zaXplc1tSXS8yO1xuICAgICAgICAgICAgcmV0dXJuIGNvb3I7XG4gICAgICAgIH0sXG4gICAgICAgIHJpZ2h0OiBmdW5jdGlvbihSLEMpe1xuICAgICAgICAgICAgdmFyIGNvb3IgPSB0aGlzLmNlbnRlcihSLEMpO1xuICAgICAgICAgICAgY29vclswXSA9IGNvb3JbMF0gKyB0aGlzLmNvbF9zaXplc1tDXS8yIC0gdGhpcy5yb3dfc2l6ZXNbUl0vMjtcbiAgICAgICAgICAgIHJldHVybiBjb29yO1xuICAgICAgICB9LFxuICAgICAgICBtazogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHZhciByLGM7XG4gICAgICAgICAgICBmb3IoIHI9MDsgcjw9dGhpcy5udW1fcm93czsgcisrICl7XG4gICAgICAgICAgICAgICAgZm9yKCBjPTE7IGM8PXRoaXMubnVtX2NvbHM7IGMrKyApe1xuICAgICAgICAgICAgICAgICAgICBpZiggdGhpcy5ib3JkZXJzX3Jvd3Nbcl1bY10gPT09IHRydWUgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd2luZy5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcm5lcihyLGMtMSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JuZXIocixjKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLCAnYm9yZGVyJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciggYz0wOyBjPD10aGlzLm51bV9jb2xzOyBjKysgKXtcbiAgICAgICAgICAgICAgICBmb3IoIHI9MTsgcjw9dGhpcy5udW1fcm93czsgcisrICl7XG4gICAgICAgICAgICAgICAgICAgIGlmKCB0aGlzLmJvcmRlcnNfY29sc1tjXVtyXSA9PT0gdHJ1ZSApe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3aW5nLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ybmVyKHItMSxjKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcm5lcihyLGMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sICdib3JkZXInKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yKCByPTE7IHI8PXRoaXMubnVtX3Jvd3M7IHIrKyApe1xuICAgICAgICAgICAgICAgIGZvciggYz0xOyBjPD10aGlzLm51bV9jb2xzOyBjKysgKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIHR5cGVvZiB0aGlzLmNlbGwocixjKS5jZWxsX3RleHQgPT09ICdzdHJpbmcnICl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2VsbCA9IHRoaXMuY2VsbChyLGMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZvbnRfbmFtZSA9IGNlbGwuY2VsbF9mb250X25hbWUgfHwgJ3RhYmxlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb29yO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIGZvbnRzW2ZvbnRfbmFtZV1bJ3RleHQtYW5jaG9yJ10gPT09ICdjZW50ZXInKSBjb29yID0gdGhpcy5jZW50ZXIocixjKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoIGZvbnRzW2ZvbnRfbmFtZV1bJ3RleHQtYW5jaG9yJ10gPT09ICdyaWdodCcpIGNvb3IgPSB0aGlzLnJpZ2h0KHIsYyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKCBmb250c1tmb250X25hbWVdWyd0ZXh0LWFuY2hvciddID09PSAnbGVmdCcpIGNvb3IgPSB0aGlzLmxlZnQocixjKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgY29vciA9IHRoaXMuY2VudGVyKHIsYyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd2luZy50ZXh0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jZWxsKHIsYykuY2VsbF90ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd0ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250X25hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIGRyYXdpbmcudGFibGUgPSBmdW5jdGlvbiggbnVtX3Jvd3MsIG51bV9jb2xzICl7XG4gICAgICAgIHZhciBuZXdfdGFibGUgPSBPYmplY3QuY3JlYXRlKFRhYmxlKTtcbiAgICAgICAgbmV3X3RhYmxlLmluaXQoIHRoaXMsIG51bV9yb3dzLCBudW1fY29scyApO1xuXG4gICAgICAgIHJldHVybiBuZXdfdGFibGU7XG5cbiAgICB9O1xuXG5cbiAgICBkcmF3aW5nLmFwcGVuZCA9ICBmdW5jdGlvbihkcmF3aW5nX3BhcnRzKXtcbiAgICAgICAgdGhpcy5kcmF3aW5nX3BhcnRzID0gdGhpcy5kcmF3aW5nX3BhcnRzLmNvbmNhdChkcmF3aW5nX3BhcnRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuXG5cblxuICAgIHZhciBwYWdlID0gT2JqZWN0LmNyZWF0ZShkcmF3aW5nKTtcbiAgICAvL2NvbnNvbGUubG9nKHBhZ2UpO1xuICAgIHBhZ2UuZHJhd2luZ19wYXJ0cyA9IFtdO1xuICAgIHJldHVybiBwYWdlO1xuXG5cblxuXG59O1xuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBta19kcmF3aW5nO1xuIiwidmFyIG1rX2RyYXdpbmcgPSByZXF1aXJlKCcuL21rX2RyYXdpbmcnKTtcbnZhciBta19ib3JkZXIgPSByZXF1aXJlKCcuL21rX2JvcmRlcicpO1xuXG52YXIgcGFnZSA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICBjb25zb2xlLmxvZyhcIioqIE1ha2luZyBwYWdlIDFcIik7XG5cbiAgICB2YXIgZCA9IG1rX2RyYXdpbmcoc2V0dGluZ3MpO1xuXG4gICAgdmFyIHNoZWV0X3NlY3Rpb24gPSAnQSc7XG4gICAgdmFyIHNoZWV0X251bSA9ICcwMCc7XG4gICAgZC5hcHBlbmQobWtfYm9yZGVyKHNldHRpbmdzLCBzaGVldF9zZWN0aW9uLCBzaGVldF9udW0gKSk7XG5cbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG5cbiAgICB2YXIgeCwgeSwgaCwgdztcbiAgICBkLmxheWVyKCd0ZXh0Jyk7XG4gICAgZC50ZXh0KFxuICAgICAgICBbc2l6ZS5kcmF3aW5nLncqMS8yLCBzaXplLmRyYXdpbmcuaCoxLzNdLFxuICAgICAgICBbXG4gICAgICAgICAgICAnUFYgU3lzdGVtIERlc2lnbicsXG4gICAgICAgIF0sXG4gICAgICAgIG51bGwsXG4gICAgICAgICdwcm9qZWN0IHRpdGxlJ1xuICAgICk7XG5cbiAgICBpZiggc2V0dGluZ3MuZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdsb2NhdGlvbicpICApe1xuICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICBbc2l6ZS5kcmF3aW5nLncqMS8yLCBzaXplLmRyYXdpbmcuaCoxLzMgKzMwXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5wZXJtLmxvY2F0aW9uLmFkZHJlc3MsXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MucGVybS5sb2NhdGlvbi5jaXR5ICsgJywgJyArIHNldHRpbmdzLnBlcm0ubG9jYXRpb24uY291bnR5ICsgJywgRkwsICcgKyBzZXR0aW5ncy5wZXJtLmxvY2F0aW9uLnppcCxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgJ3Byb2plY3QgdGl0bGUnXG4gICAgICAgICk7XG4gICAgfVxuICAgIHZhciBuX3Jvd3MgPSA0O1xuICAgIHZhciBuX2NvbHMgPSAyO1xuICAgIHcgPSA0MDArODA7XG4gICAgaCA9IG5fcm93cyoyMDtcbiAgICB4ID0gc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmcqNjtcbiAgICB5ID0gc2l6ZS5kcmF3aW5nLmggLSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyo2IC0gNCoyMDtcbiAgICBkLnRleHQoIFt4K3cvMiwgeS0yMF0sICdDb250ZW50cycsIG51bGwsICd0YWJsZV9sYXJnZScgKTtcblxuICAgIHZhciB0ID0gZC50YWJsZShuX3Jvd3Msbl9jb2xzKS5sb2MoeCx5KTtcbiAgICB0LnJvd19zaXplKCdhbGwnLCAyMCkuY29sX3NpemUoMiwgNDAwKS5jb2xfc2l6ZSgxLCA4MCk7XG4gICAgdC5jZWxsKDEsMSkudGV4dCgnUFYtMDEnKTtcbiAgICB0LmNlbGwoMSwyKS50ZXh0KCdQViBzeXN0ZW0gd2lyaW5nIGRpYWdyYW0nKTtcbiAgICB0LmNlbGwoMiwxKS50ZXh0KCdQVi0wMicpO1xuICAgIHQuY2VsbCgyLDIpLnRleHQoJ1BWIHN5c3RlbSBzcGVjaWZpY2F0aW9ucycpO1xuICAgIHQuY2VsbCgzLDEpLnRleHQoJ1MtMDEnKTtcbiAgICB0LmNlbGwoMywyKS50ZXh0KCdSb29mIGRldGFpbHMnKTtcblxuICAgIHQuYWxsX2NlbGxzKCkuZm9yRWFjaChmdW5jdGlvbihjZWxsKXtcbiAgICAgICAgY2VsbC5mb250KCd0YWJsZV9sYXJnZV9sZWZ0JykuYm9yZGVyKCdhbGwnKTtcbiAgICB9KTtcblxuICAgIHQubWsoKTtcblxuICAgIC8qXG4gICAgY29uc29sZS5sb2codGFibGVfcGFydHMpO1xuICAgIGQuYXBwZW5kKHRhYmxlX3BhcnRzKTtcbiAgICBkLnRleHQoW3NpemUuZHJhd2luZy53LzMsc2l6ZS5kcmF3aW5nLmgvM10sICdYJywgJ3RhYmxlJyk7XG4gICAgZC5yZWN0KFtzaXplLmRyYXdpbmcudy8zLTUsc2l6ZS5kcmF3aW5nLmgvMy01XSxbMTAsMTBdLCdib3gnKTtcblxuICAgIHQuY2VsbCgyLDIpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCAyLDInKTtcbiAgICB0LmNlbGwoMywzKS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgMywzJyk7XG4gICAgdC5jZWxsKDQsNCkuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDQsNCcpO1xuICAgIHQuY2VsbCg1LDUpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCA1LDUnKTtcblxuXG5cbiAgICB0LmNlbGwoNCw2KS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgNCw2Jyk7XG4gICAgdC5jZWxsKDQsNykuYm9yZGVyKCdhbGwnKS50ZXh0KCdjZWxsIDQsNycpO1xuICAgIHQuY2VsbCg1LDYpLmJvcmRlcignYWxsJykudGV4dCgnY2VsbCA1LDYnKTtcbiAgICB0LmNlbGwoNSw3KS5ib3JkZXIoJ2FsbCcpLnRleHQoJ2NlbGwgNSw3Jyk7XG5cblxuICAgIC8vKi9cblxuICAgIHJldHVybiBkLmRyYXdpbmdfcGFydHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ3VuZGVyc2NvcmUnKTtcblxudmFyIG1rX2RyYXdpbmcgPSByZXF1aXJlKCcuL21rX2RyYXdpbmcnKTtcbnZhciBta19ib3JkZXIgPSByZXF1aXJlKCcuL21rX2JvcmRlcicpO1xuXG4vL3ZhciBkcmF3aW5nX3BhcnRzID0gW107XG4vL2QubGlua19kcmF3aW5nX3BhcnRzKGRyYXdpbmdfcGFydHMpO1xuXG52YXIgcGFnZSA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICBjb25zb2xlLmxvZyhcIioqIE1ha2luZyBwYWdlIDJcIik7XG4gICAgdmFyIGQgPSBta19kcmF3aW5nKHNldHRpbmdzKTtcbiAgICB2YXIgc2hlZXRfc2VjdGlvbiA9ICdQVic7XG4gICAgdmFyIHNoZWV0X251bSA9ICcwMSc7XG4gICAgZC5hcHBlbmQobWtfYm9yZGVyKHNldHRpbmdzLCBzaGVldF9zZWN0aW9uLCBzaGVldF9udW0gKSk7XG5cbiAgICB2YXIgZiA9IHNldHRpbmdzLmY7XG5cbiAgICAvL3ZhciBjb21wb25lbnRzID0gc2V0dGluZ3MuY29tcG9uZW50cztcbiAgICAvL3ZhciBzeXN0ZW0gPSBzZXR0aW5ncy5zeXN0ZW07XG4gICAgdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcblxuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxvYztcblxuXG5cblxuICAgIHZhciB4LCB5LCBoLCB3O1xuICAgIHZhciBvZmZzZXQ7XG5cblxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyNhcnJheVxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZChzZXR0aW5ncywgJ21vZHVsZScpICYmIGYuc2VjdGlvbl9kZWZpbmVkKHNldHRpbmdzLCAnYXJyYXknKSApe1xuICAgICAgICBkLnNlY3Rpb24oJ2FycmF5Jyk7XG5cblxuICAgICAgICB4ID0gbG9jLmFycmF5LnJpZ2h0IC0gc2l6ZS5zdHJpbmcudztcbiAgICAgICAgeSA9IGxvYy5hcnJheS51cHBlcjtcbiAgICAgICAgLy95IC09IHNpemUuc3RyaW5nLmgvMjtcblxuXG4gICAgICAgIC8vZm9yKCB2YXIgaT0wOyBpPHN5c3RlbS5EQy5zdHJpbmdfbnVtOyBpKysgKSB7XG4gICAgICAgIGZvciggdmFyIGkgaW4gXy5yYW5nZShzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MpKSB7XG4gICAgICAgICAgICAvL3ZhciBvZmZzZXQgPSBpICogc2l6ZS53aXJlX29mZnNldC5iYXNlXG4gICAgICAgICAgICB2YXIgb2Zmc2V0X3dpcmUgPSBzaXplLndpcmVfb2Zmc2V0Lm1pbiArICggc2l6ZS53aXJlX29mZnNldC5iYXNlICogaSApO1xuXG4gICAgICAgICAgICBkLmJsb2NrKCdzdHJpbmcnLCBbeCx5XSk7XG4gICAgICAgICAgICAvLyBwb3NpdGl2ZSBob21lIHJ1blxuICAgICAgICAgICAgZC5sYXllcignRENfcG9zJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCAsIGxvYy5hcnJheS51cHBlciBdLFxuICAgICAgICAgICAgICAgIFsgeCAsIGxvYy5hcnJheS51cHBlci1vZmZzZXRfd2lyZSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K29mZnNldF93aXJlICwgbG9jLmFycmF5LnVwcGVyLW9mZnNldF93aXJlIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrb2Zmc2V0X3dpcmUgLCBsb2MuamJfYm94Lnktb2Zmc2V0X3dpcmVdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmpiX2JveC54ICwgbG9jLmpiX2JveC55LW9mZnNldF93aXJlXSxcbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICAvLyBuZWdhdGl2ZSBob21lIHJ1blxuICAgICAgICAgICAgZC5sYXllcignRENfbmVnJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCAsIGxvYy5hcnJheS5sb3dlciBdLFxuICAgICAgICAgICAgICAgIFsgeCAsIGxvYy5hcnJheS5sb3dlcl9saW1pdCtvZmZzZXRfd2lyZSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmFycmF5LnJpZ2h0K29mZnNldF93aXJlICwgbG9jLmFycmF5Lmxvd2VyX2xpbWl0K29mZnNldF93aXJlIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrb2Zmc2V0X3dpcmUgLCBsb2MuamJfYm94Lnkrb2Zmc2V0X3dpcmVdLFxuICAgICAgICAgICAgICAgIFsgbG9jLmpiX2JveC54ICwgbG9jLmpiX2JveC55K29mZnNldF93aXJlXSxcbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICB4IC09IHNpemUuc3RyaW5nLnc7XG4gICAgICAgIH1cblxuICAgIC8vICAgIGQucmVjdChcbiAgICAvLyAgICAgICAgWyAobG9jLmFycmF5LnJpZ2h0K2xvYy5hcnJheS5sZWZ0KS8yLCAobG9jLmFycmF5Lmxvd2VyK2xvYy5hcnJheS51cHBlcikvMiBdLFxuICAgIC8vICAgICAgICBbIGxvYy5hcnJheS5yaWdodC1sb2MuYXJyYXkubGVmdCwgbG9jLmFycmF5Lmxvd2VyLWxvYy5hcnJheS51cHBlciBdLFxuICAgIC8vICAgICAgICAnRENfcG9zJyk7XG4gICAgLy9cblxuICAgICAgICBkLmxheWVyKCdEQ19ncm91bmQnKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIC8vWyBsb2MuYXJyYXkubGVmdCAsIGxvYy5hcnJheS5sb3dlciArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kIF0sXG4gICAgICAgICAgICBbIGxvYy5hcnJheS5sZWZ0LCBsb2MuYXJyYXkubG93ZXJfbGltaXQgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLCBsb2MuYXJyYXkubG93ZXJfbGltaXQgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZCBdLFxuICAgICAgICAgICAgWyBsb2MuYXJyYXkucmlnaHQrc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLCBsb2MuamJfYm94LnkgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZF0sXG4gICAgICAgICAgICBbIGxvYy5qYl9ib3gueCAsIGxvYy5qYl9ib3gueStzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZF0sXG4gICAgICAgIF0pO1xuXG4gICAgICAgIGQubGF5ZXIoKTtcblxuXG4gICAgfS8vIGVsc2UgeyBjb25zb2xlLmxvZyhcIkRyYXdpbmc6IGFycmF5IG5vdCByZWFkeVwiKX1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gY29tYmluZXIgYm94XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdEQycpICl7XG5cbiAgICAgICAgZC5zZWN0aW9uKFwiY29tYmluZXJcIik7XG5cbiAgICAgICAgeCA9IGxvYy5qYl9ib3gueDtcbiAgICAgICAgeSA9IGxvYy5qYl9ib3gueTtcblxuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbeCx5XSxcbiAgICAgICAgICAgIFtzaXplLmpiX2JveC53LHNpemUuamJfYm94LmhdLFxuICAgICAgICAgICAgJ2JveCdcbiAgICAgICAgKTtcblxuXG4gICAgICAgIGZvciggaSBpbiBfLnJhbmdlKHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncykpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IHNpemUud2lyZV9vZmZzZXQubWluICsgKCBzaXplLndpcmVfb2Zmc2V0LmJhc2UgKiBpICk7XG5cbiAgICAgICAgICAgIGQubGF5ZXIoJ0RDX3BvcycpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHggLCB5LW9mZnNldF0sXG4gICAgICAgICAgICAgICAgWyB4ICwgeS1vZmZzZXRdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICAgICAgeDogeCxcbiAgICAgICAgICAgICAgICB5OiB5LW9mZnNldCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHggLCB5LW9mZnNldF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54LW9mZnNldCAsIHktb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngtb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbV0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54LW9mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICAgICAgeDogbG9jLmRpc2Nib3gueC1vZmZzZXQsXG4gICAgICAgICAgICAgICAgeTogbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGQubGF5ZXIoJ0RDX25lZycpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHgsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIHgtc2l6ZS5mdXNlLncvMiAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgZC5ibG9jayggJ2Z1c2UnLCB7XG4gICAgICAgICAgICAgICAgeDogeCAsXG4gICAgICAgICAgICAgICAgeTogeStvZmZzZXQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyB4K3NpemUuZnVzZS53LzIgLCB5K29mZnNldF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbV0sXG4gICAgICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICAgICAgeDogbG9jLmRpc2Nib3gueCtvZmZzZXQsXG4gICAgICAgICAgICAgICAgeTogbG9jLmRpc2Nib3gueStzaXplLmRpc2Nib3guaC8yLXNpemUudGVybWluYWxfZGlhbVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkLmxheWVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvL2QubGF5ZXIoJ0RDX2dyb3VuZCcpO1xuICAgICAgICAvL2QubGluZShbXG4gICAgICAgIC8vICAgIFsgbG9jLmFycmF5LmxlZnQgLCBsb2MuYXJyYXkubG93ZXIgKyBzaXplLm1vZHVsZS53ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgLy8gICAgWyBsb2MuYXJyYXkucmlnaHQrc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLCBsb2MuYXJyYXkubG93ZXIgKyBzaXplLm1vZHVsZS53ICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgXSxcbiAgICAgICAgLy8gICAgWyBsb2MuYXJyYXkucmlnaHQrc2l6ZS53aXJlX29mZnNldC5ncm91bmQgLCBsb2MuYXJyYXkueSArIHNpemUubW9kdWxlLncgKyBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZF0sXG4gICAgICAgIC8vICAgIFsgbG9jLmFycmF5LnggLCBsb2MuYXJyYXkueStzaXplLm1vZHVsZS53K3NpemUud2lyZV9vZmZzZXQuZ3JvdW5kXSxcbiAgICAgICAgLy9dKTtcblxuICAgICAgICAvL2QubGF5ZXIoKTtcblxuICAgICAgICAvLyBHcm91bmRcbiAgICAgICAgLy9vZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0LmdhcCArIHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kO1xuICAgICAgICBvZmZzZXQgPSBzaXplLndpcmVfb2Zmc2V0Lmdyb3VuZDtcblxuICAgICAgICBkLmxheWVyKCdEQ19ncm91bmQnKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFsgeCAsIHkrb2Zmc2V0XSxcbiAgICAgICAgICAgIFsgeCAsIHkrb2Zmc2V0XSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5K29mZnNldCxcbiAgICAgICAgfSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbIHggLCB5K29mZnNldF0sXG4gICAgICAgICAgICBbIGxvYy5kaXNjYm94Lngrb2Zmc2V0ICwgeStvZmZzZXRdLFxuICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW1dLFxuICAgICAgICAgICAgWyBsb2MuZGlzY2JveC54K29mZnNldCAsIGxvYy5kaXNjYm94Lnkrc2l6ZS5kaXNjYm94LmgvMi1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgeDogbG9jLmRpc2Nib3gueCtvZmZzZXQsXG4gICAgICAgICAgICB5OiBsb2MuZGlzY2JveC55K3NpemUuZGlzY2JveC5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtXG4gICAgICAgIH0pO1xuICAgICAgICBkLmxheWVyKCk7XG5cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgLy8gREMgZGlzY29uZWN0XG4gICAgICAgIGQuc2VjdGlvbihcIkRDIGRpY29uZWN0XCIpO1xuXG5cbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW2xvYy5kaXNjYm94LngsIGxvYy5kaXNjYm94LnldLFxuICAgICAgICAgICAgW3NpemUuZGlzY2JveC53LHNpemUuZGlzY2JveC5oXSxcbiAgICAgICAgICAgICdib3gnXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gREMgZGlzY29uZWN0IGNvbWJpbmVyIGQubGluZXNcblxuICAgICAgICB4ID0gbG9jLmRpc2Nib3gueDtcbiAgICAgICAgeSA9IGxvYy5kaXNjYm94LnkgKyBzaXplLmRpc2Nib3guaC8yO1xuXG4gICAgICAgIGlmKCBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgPiAxKXtcbiAgICAgICAgICAgIHZhciBvZmZzZXRfbWluID0gc2l6ZS53aXJlX29mZnNldC5taW47XG4gICAgICAgICAgICB2YXIgb2Zmc2V0X21heCA9IHNpemUud2lyZV9vZmZzZXQubWluICsgKCAoc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzIC0xKSAqIHNpemUud2lyZV9vZmZzZXQuYmFzZSApO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHgtb2Zmc2V0X21pbiwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgICAgIFsgeC1vZmZzZXRfbWF4LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBdLCAnRENfcG9zJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeCtvZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICAgICAgWyB4K29mZnNldF9tYXgsIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIF0sICdEQ19uZWcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEludmVydGVyIGNvbmVjdGlvblxuICAgICAgICAvL2QubGluZShbXG4gICAgICAgIC8vICAgIFsgeC1vZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgIC8vICAgIFsgeC1vZmZzZXRfbWluLCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgIC8vXSwnRENfcG9zJyk7XG5cbiAgICAgICAgLy9vZmZzZXQgPSBvZmZzZXRfbWF4IC0gb2Zmc2V0X21pbjtcbiAgICAgICAgb2Zmc2V0ID0gc2l6ZS53aXJlX29mZnNldC5taW47XG5cbiAgICAgICAgLy8gbmVnXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbIHgrb2Zmc2V0LCB5LXNpemUudGVybWluYWxfZGlhbS1zaXplLnRlcm1pbmFsX2RpYW0qM10sXG4gICAgICAgICAgICBbIHgrb2Zmc2V0LCBsb2MuaW52ZXJ0ZXIueStzaXplLmludmVydGVyLmgvMi1zaXplLnRlcm1pbmFsX2RpYW0gXSxcbiAgICAgICAgXSwnRENfbmVnJyk7XG4gICAgICAgIGQuYmxvY2soICd0ZXJtaW5hbCcsIHtcbiAgICAgICAgICAgIHg6IHgrb2Zmc2V0LFxuICAgICAgICAgICAgeTogbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBwb3NcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFsgeC1vZmZzZXQsIHktc2l6ZS50ZXJtaW5hbF9kaWFtLXNpemUudGVybWluYWxfZGlhbSozXSxcbiAgICAgICAgICAgIFsgeC1vZmZzZXQsIGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSBdLFxuICAgICAgICBdLCdEQ19wb3MnKTtcbiAgICAgICAgZC5ibG9jayggJ3Rlcm1pbmFsJywge1xuICAgICAgICAgICAgeDogeC1vZmZzZXQsXG4gICAgICAgICAgICB5OiBsb2MuaW52ZXJ0ZXIueStzaXplLmludmVydGVyLmgvMi1zaXplLnRlcm1pbmFsX2RpYW0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGdyb3VuZFxuICAgICAgICAvL29mZnNldCA9IHNpemUud2lyZV9vZmZzZXQuZ2FwICsgc2l6ZS53aXJlX29mZnNldC5ncm91bmQ7XG4gICAgICAgIG9mZnNldCA9IHNpemUud2lyZV9vZmZzZXQuZ3JvdW5kO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgWyB4K29mZnNldCwgeS1zaXplLnRlcm1pbmFsX2RpYW0tc2l6ZS50ZXJtaW5hbF9kaWFtKjNdLFxuICAgICAgICAgICAgWyB4K29mZnNldCwgbG9jLmludmVydGVyLnkrc2l6ZS5pbnZlcnRlci5oLzItc2l6ZS50ZXJtaW5hbF9kaWFtIF0sXG4gICAgICAgIF0sJ0RDX2dyb3VuZCcpO1xuICAgICAgICBkLmJsb2NrKCAndGVybWluYWwnLCB7XG4gICAgICAgICAgICB4OiB4K29mZnNldCxcbiAgICAgICAgICAgIHk6IGxvYy5pbnZlcnRlci55K3NpemUuaW52ZXJ0ZXIuaC8yLXNpemUudGVybWluYWxfZGlhbSxcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vI2ludmVydGVyXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKHNldHRpbmdzLCAnaW52ZXJ0ZXInKSApe1xuXG4gICAgICAgIGQuc2VjdGlvbihcImludmVydGVyXCIpO1xuXG5cbiAgICAgICAgeCA9IGxvYy5pbnZlcnRlci54O1xuICAgICAgICB5ID0gbG9jLmludmVydGVyLnk7XG5cblxuICAgICAgICAvL2ZyYW1lXG4gICAgICAgIGQubGF5ZXIoJ2JveCcpO1xuICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICBbeCx5XSxcbiAgICAgICAgICAgIFtzaXplLmludmVydGVyLncsIHNpemUuaW52ZXJ0ZXIuaF1cbiAgICAgICAgKTtcbiAgICAgICAgLy8gTGFiZWwgYXQgdG9wIChJbnZlcnRlciwgbWFrZSwgbW9kZWwsIC4uLilcbiAgICAgICAgZC5sYXllcigndGV4dCcpO1xuICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICBbbG9jLmludmVydGVyLngsIGxvYy5pbnZlcnRlci50b3AgKyBzaXplLmludmVydGVyLnRleHRfZ2FwIF0sXG4gICAgICAgICAgICBbICdJbnZlcnRlcicsIHNldHRpbmdzLnN5c3RlbS5pbnZlcnRlci5tYWtlICsgXCIgXCIgKyBzZXR0aW5ncy5zeXN0ZW0uaW52ZXJ0ZXIubW9kZWwgXSxcbiAgICAgICAgICAgICdsYWJlbCdcbiAgICAgICAgKTtcbiAgICAgICAgZC5sYXllcigpO1xuXG4gICAgLy8jaW52ZXJ0ZXIgc3ltYm9sXG4gICAgICAgIGQuc2VjdGlvbihcImludmVydGVyIHN5bWJvbFwiKTtcblxuICAgICAgICB4ID0gbG9jLmludmVydGVyLng7XG4gICAgICAgIHkgPSBsb2MuaW52ZXJ0ZXIueTtcblxuICAgICAgICB3ID0gc2l6ZS5pbnZlcnRlci5zeW1ib2xfdztcbiAgICAgICAgaCA9IHNpemUuaW52ZXJ0ZXIuc3ltYm9sX2g7XG5cbiAgICAgICAgdmFyIHNwYWNlID0gdyoxLzEyO1xuXG4gICAgICAgIC8vIEludmVydGVyIHN5bWJvbFxuICAgICAgICBkLmxheWVyKCdib3gnKTtcblxuICAgICAgICAvLyBib3hcbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW3gseV0sXG4gICAgICAgICAgICBbdywgaF1cbiAgICAgICAgKTtcbiAgICAgICAgLy8gZGlhZ2FuYWxcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4LXcvMiwgeStoLzJdLFxuICAgICAgICAgICAgW3grdy8yLCB5LWgvMl0sXG5cbiAgICAgICAgXSk7XG4gICAgICAgIC8vIERDXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlLFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZV0sXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlKjYsXG4gICAgICAgICAgICAgICAgeSAtIGgvMiArIHNwYWNlXSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCAtIHcvMiArIHNwYWNlLFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqMixcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSozLFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNCxcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3ggLSB3LzIgKyBzcGFjZSo1LFxuICAgICAgICAgICAgICAgIHkgLSBoLzIgKyBzcGFjZSoyXSxcbiAgICAgICAgICAgIFt4IC0gdy8yICsgc3BhY2UqNixcbiAgICAgICAgICAgICAgICB5IC0gaC8yICsgc3BhY2UqMl0sXG4gICAgICAgIF0pO1xuXG4gICAgICAgIC8vIEFDXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlLFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICAgICAgW3ggKyB3LzIgLSBzcGFjZSoyLFxuICAgICAgICAgICAgICAgIHkgKyBoLzIgLSBzcGFjZSoxLjVdLFxuICAgICAgICBdKTtcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqMyxcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgICAgIFt4ICsgdy8yIC0gc3BhY2UqNCxcbiAgICAgICAgICAgICAgICB5ICsgaC8yIC0gc3BhY2UqMS41XSxcbiAgICAgICAgXSk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjUsXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgICAgICBbeCArIHcvMiAtIHNwYWNlKjYsXG4gICAgICAgICAgICAgICAgeSArIGgvMiAtIHNwYWNlKjEuNV0sXG4gICAgICAgIF0pO1xuICAgICAgICBkLmxheWVyKCk7XG5cblxuXG5cblxuICAgIH1cblxuXG5cblxuXG4vLyNBQ19kaXNjY29uZWN0XG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKHNldHRpbmdzLCAnQUMnKSApe1xuICAgICAgICBkLnNlY3Rpb24oXCJBQ19kaXNjY29uZWN0XCIpO1xuXG4gICAgICAgIHggPSBsb2MuQUNfZGlzYy54O1xuICAgICAgICB5ID0gbG9jLkFDX2Rpc2MueTtcbiAgICAgICAgdmFyIHBhZGRpbmcgPSBzaXplLnRlcm1pbmFsX2RpYW07XG5cbiAgICAgICAgZC5sYXllcignYm94Jyk7XG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFt4LCB5XSxcbiAgICAgICAgICAgIFtzaXplLkFDX2Rpc2Mudywgc2l6ZS5BQ19kaXNjLmhdXG4gICAgICAgICk7XG4gICAgICAgIGQubGF5ZXIoKTtcblxuXG4gICAgLy9kLmNpcmMoW3gseV0sNSk7XG5cblxuXG4gICAgLy8jQUMgbG9hZCBjZW50ZXJcbiAgICAgICAgZC5zZWN0aW9uKFwiQUMgbG9hZCBjZW50ZXJcIik7XG5cbiAgICAgICAgdmFyIGJyZWFrZXJfc3BhY2luZyA9IHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5zcGFjaW5nO1xuXG4gICAgICAgIHggPSBsb2MuQUNfbG9hZGNlbnRlci54O1xuICAgICAgICB5ID0gbG9jLkFDX2xvYWRjZW50ZXIueTtcbiAgICAgICAgdyA9IHNpemUuQUNfbG9hZGNlbnRlci53O1xuICAgICAgICBoID0gc2l6ZS5BQ19sb2FkY2VudGVyLmg7XG5cbiAgICAgICAgZC5yZWN0KFt4LHldLFxuICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAnYm94J1xuICAgICAgICApO1xuXG4gICAgICAgIGQudGV4dChbeCx5LWgqMC40XSxcbiAgICAgICAgICAgIFtzeXN0ZW0uQUMubG9hZGNlbnRlcl90eXBlcywgJ0xvYWQgQ2VudGVyJ10sXG4gICAgICAgICAgICAnbGFiZWwnLFxuICAgICAgICAgICAgJ3RleHQnXG4gICAgICAgICk7XG4gICAgICAgIHcgPSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci53O1xuICAgICAgICBoID0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXIuaDtcblxuICAgICAgICBwYWRkaW5nID0gbG9jLkFDX2xvYWRjZW50ZXIueCAtIGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLmxlZnQgLSBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci53O1xuXG4gICAgICAgIHkgPSBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy50b3A7XG4gICAgICAgIHkgKz0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnNwYWNpbmcvMjtcbiAgICAgICAgZm9yKCB2YXIgaT0wOyBpPHNpemUuQUNfbG9hZGNlbnRlci5icmVha2Vycy5udW07IGkrKyl7XG4gICAgICAgICAgICBkLnJlY3QoW3gtcGFkZGluZy13LzIseV0sW3csaF0sJ2JveCcpO1xuICAgICAgICAgICAgZC5yZWN0KFt4K3BhZGRpbmcrdy8yLHldLFt3LGhdLCdib3gnKTtcbiAgICAgICAgICAgIHkgKz0gYnJlYWtlcl9zcGFjaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHMsIGw7XG5cbiAgICAgICAgbCA9IGxvYy5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXI7XG4gICAgICAgIHMgPSBzaXplLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhcjtcbiAgICAgICAgZC5yZWN0KFtsLngsbC55XSwgW3MudyxzLmhdLCAnQUNfbmV1dHJhbCcgKTtcblxuICAgICAgICBsID0gbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyO1xuICAgICAgICBzID0gc2l6ZS5BQ19sb2FkY2VudGVyLmdyb3VuZGJhcjtcbiAgICAgICAgZC5yZWN0KFtsLngsbC55XSwgW3MudyxzLmhdLCAnQUNfZ3JvdW5kJyApO1xuXG4gICAgICAgIGQuYmxvY2soJ2dyb3VuZCcsIFtsLngsbC55K3MuaC8yXSk7XG5cblxuXG4gICAgLy8gQUMgZC5saW5lc1xuICAgICAgICBkLnNlY3Rpb24oXCJBQyBkLmxpbmVzXCIpO1xuXG4gICAgICAgIHggPSBsb2MuaW52ZXJ0ZXIuYm90dG9tX3JpZ2h0Lng7XG4gICAgICAgIHkgPSBsb2MuaW52ZXJ0ZXIuYm90dG9tX3JpZ2h0Lnk7XG4gICAgICAgIHggLT0gc2l6ZS50ZXJtaW5hbF9kaWFtICogKHN5c3RlbS5BQy5udW1fY29uZHVjdG9ycysxKTtcbiAgICAgICAgeSAtPSBzaXplLnRlcm1pbmFsX2RpYW07XG5cbiAgICAgICAgdmFyIGNvbmR1aXRfeSA9IGxvYy5BQ19jb25kdWl0Lnk7XG4gICAgICAgIHBhZGRpbmcgPSBzaXplLnRlcm1pbmFsX2RpYW07XG4gICAgICAgIC8vdmFyIEFDX2QubGF5ZXJfbmFtZXMgPSBbJ0FDX2dyb3VuZCcsICdBQ19uZXV0cmFsJywgJ0FDX0wxJywgJ0FDX0wyJywgJ0FDX0wyJ107XG5cbiAgICAgICAgZm9yKCB2YXIgaT0wOyBpIDwgc3lzdGVtLkFDLm51bV9jb25kdWN0b3JzOyBpKysgKXtcbiAgICAgICAgICAgIGQuYmxvY2soJ3Rlcm1pbmFsJywgW3gseV0gKTtcbiAgICAgICAgICAgIGQubGF5ZXIoJ0FDXycrc3lzdGVtLkFDLmNvbmR1Y3RvcnNbaV0pO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbeCwgeV0sXG4gICAgICAgICAgICAgICAgW3gsIGxvYy5BQ19kaXNjLmJvdHRvbSAtIHBhZGRpbmcqMiAtIHBhZGRpbmcqaSAgXSxcbiAgICAgICAgICAgICAgICBbbG9jLkFDX2Rpc2MubGVmdCwgbG9jLkFDX2Rpc2MuYm90dG9tIC0gcGFkZGluZyoyIC0gcGFkZGluZyppIF0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIHggKz0gc2l6ZS50ZXJtaW5hbF9kaWFtO1xuICAgICAgICB9XG4gICAgICAgIGQubGF5ZXIoKTtcblxuICAgICAgICB4ID0gbG9jLkFDX2Rpc2MueDtcbiAgICAgICAgeSA9IGxvYy5BQ19kaXNjLnkgKyBzaXplLkFDX2Rpc2MuaC8yO1xuICAgICAgICB5IC09IHBhZGRpbmcqMjtcblxuICAgICAgICBpZiggc3lzdGVtLkFDLmNvbmR1Y3RvcnMgJiYgc3lzdGVtLkFDLmNvbmR1Y3RvcnMuaW5kZXhPZignZ3JvdW5kJykrMSApIHtcbiAgICAgICAgICAgIGQubGF5ZXIoJ0FDX2dyb3VuZCcpO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIHgtc2l6ZS5BQ19kaXNjLncvMiwgeSBdLFxuICAgICAgICAgICAgICAgIFsgeCtzaXplLkFDX2Rpc2Mudy8yK3BhZGRpbmcqMiwgeSBdLFxuICAgICAgICAgICAgICAgIFsgeCtzaXplLkFDX2Rpc2Mudy8yK3BhZGRpbmcqMiwgY29uZHVpdF95ICsgYnJlYWtlcl9zcGFjaW5nKjIgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLmxlZnQrcGFkZGluZyoyLCBjb25kdWl0X3kgKyBicmVha2VyX3NwYWNpbmcqMiBdLFxuICAgICAgICAgICAgICAgIC8vWyBsb2MuQUNfbG9hZGNlbnRlci5sZWZ0K3BhZGRpbmcqMiwgeSBdLFxuICAgICAgICAgICAgICAgIC8vWyBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueC1wYWRkaW5nLCB5IF0sXG4gICAgICAgICAgICAgICAgLy9bIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci54LXBhZGRpbmcsIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci55K3NpemUuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIuaC8yIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5sZWZ0K3BhZGRpbmcqMiwgbG9jLkFDX2xvYWRjZW50ZXIuZ3JvdW5kYmFyLnkgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhci54LXNpemUuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIudy8yLCBsb2MuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIueSBdLFxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggc3lzdGVtLkFDLmNvbmR1Y3RvcnMgJiYgc3lzdGVtLkFDLmNvbmR1Y3RvcnMuaW5kZXhPZignbmV1dHJhbCcpKzEgKSB7XG4gICAgICAgICAgICB5IC09IHBhZGRpbmc7XG4gICAgICAgICAgICBkLmxheWVyKCdBQ19uZXV0cmFsJyk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgeC1zaXplLkFDX2Rpc2Mudy8yLCB5IF0sXG4gICAgICAgICAgICAgICAgWyB4K3BhZGRpbmcqMyoyLCB5IF0sXG4gICAgICAgICAgICAgICAgWyB4K3BhZGRpbmcqMyoyLCBjb25kdWl0X3kgKyBicmVha2VyX3NwYWNpbmcqMSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhci54LCBjb25kdWl0X3kgKyBicmVha2VyX3NwYWNpbmcqMSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhci54LFxuICAgICAgICAgICAgICAgICAgICBsb2MuQUNfbG9hZGNlbnRlci5uZXV0cmFsYmFyLnktc2l6ZS5BQ19sb2FkY2VudGVyLm5ldXRyYWxiYXIuaC8yIF0sXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfVxuXG5cblxuICAgICAgICBmb3IoIHZhciBpPTE7IGkgPD0gMzsgaSsrICkge1xuICAgICAgICAgICAgaWYoIHN5c3RlbS5BQy5jb25kdWN0b3JzICYmIHN5c3RlbS5BQy5jb25kdWN0b3JzLmluZGV4T2YoJ0wnK2kpKzEgKSB7XG4gICAgICAgICAgICAgICAgeSAtPSBwYWRkaW5nO1xuICAgICAgICAgICAgICAgIGQubGF5ZXIoJ0FDX0wnK2kpO1xuICAgICAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFsgeC1zaXplLkFDX2Rpc2Mudy8yLCB5IF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeCtwYWRkaW5nKjMqKDItaSksIHkgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB4K3BhZGRpbmcqMyooMi1pKSwgbG9jLkFDX2Rpc2Muc3dpdGNoX2JvdHRvbSBdLFxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIGQuYmxvY2soJ3Rlcm1pbmFsJywgWyB4LXBhZGRpbmcqKGktMikqMywgbG9jLkFDX2Rpc2Muc3dpdGNoX2JvdHRvbSBdICk7XG4gICAgICAgICAgICAgICAgZC5ibG9jaygndGVybWluYWwnLCBbIHgtcGFkZGluZyooaS0yKSozLCBsb2MuQUNfZGlzYy5zd2l0Y2hfdG9wIF0gKTtcbiAgICAgICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbIHgtcGFkZGluZyooaS0yKSozLCBsb2MuQUNfZGlzYy5zd2l0Y2hfdG9wIF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeC1wYWRkaW5nKihpLTIpKjMsIGNvbmR1aXRfeS1icmVha2VyX3NwYWNpbmcqKGktMSkgXSxcbiAgICAgICAgICAgICAgICAgICAgWyBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy5sZWZ0LCBjb25kdWl0X3ktYnJlYWtlcl9zcGFjaW5nKihpLTEpIF0sXG4gICAgICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cblxuXG4gICAgfVxuXG5cblxuXG4vLyBXaXJlIHRhYmxlXG4gICAgZC5zZWN0aW9uKFwiV2lyZSB0YWJsZVwiKTtcblxuLy8vKlxuXG4gICAgeCA9IGxvYy53aXJlX3RhYmxlLng7XG4gICAgeSA9IGxvYy53aXJlX3RhYmxlLnk7XG5cbiAgICBpZiggc3lzdGVtLkFDLm51bV9jb25kdWN0b3JzICkge1xuICAgICAgICB2YXIgbl9yb3dzID0gMiArIHN5c3RlbS5BQy5udW1fY29uZHVjdG9ycztcbiAgICAgICAgdmFyIG5fY29scyA9IDY7XG4gICAgICAgIHZhciByb3dfaGVpZ2h0ID0gMTU7XG4gICAgICAgIHZhciBjb2x1bW5fd2lkdGggPSB7XG4gICAgICAgICAgICBudW1iZXI6IDI1LFxuICAgICAgICAgICAgY29uZHVjdG9yOiA1MCxcbiAgICAgICAgICAgIHdpcmVfZ2F1Z2U6IDI1LFxuICAgICAgICAgICAgd2lyZV90eXBlOiA3NSxcbiAgICAgICAgICAgIGNvbmR1aXRfc2l6ZTogMzUsXG4gICAgICAgICAgICBjb25kdWl0X3R5cGU6IDc1LFxuICAgICAgICB9O1xuXG4gICAgICAgIGggPSBuX3Jvd3Mqcm93X2hlaWdodDtcblxuICAgICAgICB2YXIgdCA9IGQudGFibGUobl9yb3dzLG5fY29scykubG9jKHgseSk7XG4gICAgICAgIHQucm93X3NpemUoJ2FsbCcsIHJvd19oZWlnaHQpXG4gICAgICAgICAgICAuY29sX3NpemUoMSwgY29sdW1uX3dpZHRoLm51bWJlcilcbiAgICAgICAgICAgIC5jb2xfc2l6ZSgyLCBjb2x1bW5fd2lkdGguY29uZHVjdG9yKVxuICAgICAgICAgICAgLmNvbF9zaXplKDMsIGNvbHVtbl93aWR0aC53aXJlX2dhdWdlKVxuICAgICAgICAgICAgLmNvbF9zaXplKDQsIGNvbHVtbl93aWR0aC53aXJlX3R5cGUpXG4gICAgICAgICAgICAuY29sX3NpemUoNSwgY29sdW1uX3dpZHRoLmNvbmR1aXRfc2l6ZSlcbiAgICAgICAgICAgIC5jb2xfc2l6ZSg2LCBjb2x1bW5fd2lkdGguY29uZHVpdF90eXBlKTtcblxuICAgICAgICB0LmFsbF9jZWxscygpLmZvckVhY2goZnVuY3Rpb24oY2VsbCl7XG4gICAgICAgICAgICBjZWxsLmZvbnQoJ3RhYmxlJykuYm9yZGVyKCdhbGwnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHQuY2VsbCgxLDEpLmJvcmRlcignQicsIGZhbHNlKTtcbiAgICAgICAgdC5jZWxsKDEsMykuYm9yZGVyKCdSJywgZmFsc2UpO1xuICAgICAgICB0LmNlbGwoMSw1KS5ib3JkZXIoJ1InLCBmYWxzZSk7XG5cbiAgICAgICAgdC5jZWxsKDEsMykuZm9udCgndGFibGVfbGVmdCcpLnRleHQoJ1dpcmUnKTtcbiAgICAgICAgdC5jZWxsKDEsNSkuZm9udCgndGFibGVfbGVmdCcpLnRleHQoJ0NvbmR1aXQnKTtcblxuICAgICAgICB0LmNlbGwoMiwzKS5mb250KCd0YWJsZScpLnRleHQoJ0NvbmR1Y3RvcnMnKTtcbiAgICAgICAgdC5jZWxsKDIsMykuZm9udCgndGFibGUnKS50ZXh0KCdBV0cnKTtcbiAgICAgICAgdC5jZWxsKDIsNCkuZm9udCgndGFibGUnKS50ZXh0KCdUeXBlJyk7XG4gICAgICAgIHQuY2VsbCgyLDUpLmZvbnQoJ3RhYmxlJykudGV4dCgnU2l6ZScpO1xuICAgICAgICB0LmNlbGwoMiw2KS5mb250KCd0YWJsZScpLnRleHQoJ1R5cGUnKTtcblxuICAgICAgICBmb3IoIGk9MTsgaTw9c3lzdGVtLkFDLm51bV9jb25kdWN0b3JzOyBpKyspe1xuICAgICAgICAgICAgdC5jZWxsKDIraSwxKS5mb250KCd0YWJsZScpLnRleHQoaS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIHQuY2VsbCgyK2ksMikuZm9udCgndGFibGVfbGVmdCcpLnRleHQoIGYucHJldHR5X3dvcmQoc2V0dGluZ3Muc3lzdGVtLkFDLmNvbmR1Y3RvcnNbaS0xXSkgKTtcblxuICAgICAgICB9XG5cblxuICAgICAgICAvL2QudGV4dCggW3grdy8yLCB5LXJvd19oZWlnaHRdLCBmLnByZXR0eV9uYW1lKHNlY3Rpb25fbmFtZSksJ3RhYmxlJyApO1xuXG5cbiAgICAgICAgdC5taygpO1xuXG4gICAgfVxuXG4vLyovXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4vLyB2b2x0YWdlIGRyb3BcbiAgICBkLnNlY3Rpb24oXCJ2b2x0YWdlIGRyb3BcIik7XG5cblxuICAgIHggPSBsb2Mudm9sdF9kcm9wX3RhYmxlLng7XG4gICAgeSA9IGxvYy52b2x0X2Ryb3BfdGFibGUueTtcbiAgICB3ID0gc2l6ZS52b2x0X2Ryb3BfdGFibGUudztcbiAgICBoID0gc2l6ZS52b2x0X2Ryb3BfdGFibGUuaDtcblxuICAgIGQubGF5ZXIoJ3RhYmxlJyk7XG4gICAgZC5yZWN0KCBbeCx5XSwgW3csaF0gKTtcblxuICAgIHkgLT0gaC8yO1xuICAgIHkgKz0gMTA7XG5cbiAgICBkLnRleHQoIFt4LHldLCAnVm9sdGFnZSBEcm9wJywgJ3RleHQnLCAndGFibGUnKTtcblxuXG4vLyBnZW5lcmFsIG5vdGVzXG4gICAgZC5zZWN0aW9uKFwiZ2VuZXJhbCBub3Rlc1wiKTtcblxuICAgIHggPSBsb2MuZ2VuZXJhbF9ub3Rlcy54O1xuICAgIHkgPSBsb2MuZ2VuZXJhbF9ub3Rlcy55O1xuICAgIHcgPSBzaXplLmdlbmVyYWxfbm90ZXMudztcbiAgICBoID0gc2l6ZS5nZW5lcmFsX25vdGVzLmg7XG5cbiAgICBkLmxheWVyKCd0YWJsZScpO1xuICAgIGQucmVjdCggW3gseV0sIFt3LGhdICk7XG5cbiAgICB5IC09IGgvMjtcbiAgICB5ICs9IDEwO1xuXG4gICAgZC50ZXh0KCBbeCx5XSwgJ0dlbmVyYWwgTm90ZXMnLCAndGV4dCcsICd0YWJsZScpO1xuXG5cbiAgICBkLnNlY3Rpb24oKTtcblxuICAgIHJldHVybiBkLmRyYXdpbmdfcGFydHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuIiwidmFyIG1rX2RyYXdpbmcgPSByZXF1aXJlKCcuL21rX2RyYXdpbmcnKTtcbnZhciBta19ib3JkZXIgPSByZXF1aXJlKCcuL21rX2JvcmRlcicpO1xuXG52YXIgcGFnZSA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICBjb25zb2xlLmxvZyhcIioqIE1ha2luZyBwYWdlIDNcIik7XG4gICAgdmFyIGYgPSBzZXR0aW5ncy5mO1xuXG4gICAgZCA9IG1rX2RyYXdpbmcoc2V0dGluZ3MpO1xuXG4gICAgdmFyIHNoZWV0X3NlY3Rpb24gPSAnUFYnO1xuICAgIHZhciBzaGVldF9udW0gPSAnMDInO1xuICAgIGQuYXBwZW5kKG1rX2JvcmRlcihzZXR0aW5ncywgc2hlZXRfc2VjdGlvbiwgc2hlZXRfbnVtICkpO1xuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuXG5cbiAgICBkLnRleHQoXG4gICAgICAgIFtzaXplLmRyYXdpbmcudy8yLCBzaXplLmRyYXdpbmcuaC8yXSxcbiAgICAgICAgJ0NhbGN1bGF0aW9uIFNoZWV0JyxcbiAgICAgICAgJ3RleHQnLFxuICAgICAgICAndGl0bGUyJ1xuICAgICk7XG5cblxuICAgIHggPSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyo2O1xuICAgIHkgPSBzaXplLmRyYXdpbmcuZnJhbWVfcGFkZGluZyo2ICsyMDtcblxuICAgIGQubGF5ZXIoJ3RhYmxlJyk7XG5cblxuICAgIGZvciggdmFyIHNlY3Rpb25fbmFtZSBpbiBzZXR0aW5ncy5zeXN0ZW0gKXtcbiAgICAgICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKHNldHRpbmdzLCBzZWN0aW9uX25hbWUpICl7XG4gICAgICAgICAgICB2YXIgc2VjdGlvbiA9IHNldHRpbmdzLnN5c3RlbVtzZWN0aW9uX25hbWVdO1xuXG4gICAgICAgICAgICB2YXIgbiA9IE9iamVjdC5rZXlzKHNlY3Rpb24pLmxlbmd0aDtcblxuICAgICAgICAgICAgdmFyIG5fcm93cyA9IG4rMDtcbiAgICAgICAgICAgIHZhciBuX2NvbHMgPSAyO1xuXG4gICAgICAgICAgICB2YXIgcm93X2hlaWdodCA9IDE1O1xuICAgICAgICAgICAgaCA9IG5fcm93cypyb3dfaGVpZ2h0O1xuXG5cbiAgICAgICAgICAgIHZhciB0ID0gZC50YWJsZShuX3Jvd3Msbl9jb2xzKS5sb2MoeCx5KTtcbiAgICAgICAgICAgIHQucm93X3NpemUoJ2FsbCcsIHJvd19oZWlnaHQpLmNvbF9zaXplKDEsIDEwMCkuY29sX3NpemUoMiwgMTI1KTtcbiAgICAgICAgICAgIHcgPSAxMDArODA7XG5cbiAgICAgICAgICAgIHZhciByID0gMTtcbiAgICAgICAgICAgIHZhciB2YWx1ZTtcbiAgICAgICAgICAgIGZvciggdmFyIHZhbHVlX25hbWUgaW4gc2VjdGlvbiApe1xuICAgICAgICAgICAgICAgIHQuY2VsbChyLDEpLnRleHQoIGYucHJldHR5X25hbWUodmFsdWVfbmFtZSkgKTtcbiAgICAgICAgICAgICAgICBpZiggISBzZWN0aW9uW3ZhbHVlX25hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gJy0nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiggc2VjdGlvblt2YWx1ZV9uYW1lXS5jb25zdHJ1Y3RvciA9PT0gQXJyYXkgKXtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBzZWN0aW9uW3ZhbHVlX25hbWVdLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKCBzZWN0aW9uW3ZhbHVlX25hbWVdLmNvbnN0cnVjdG9yID09PSBPYmplY3QgKXtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSAnKCApJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoIGlzTmFOKHNlY3Rpb25bdmFsdWVfbmFtZV0pICl7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gc2VjdGlvblt2YWx1ZV9uYW1lXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQoc2VjdGlvblt2YWx1ZV9uYW1lXSkudG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdC5jZWxsKHIsMikudGV4dCggdmFsdWUgKTtcbiAgICAgICAgICAgICAgICByKys7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZC50ZXh0KCBbeCt3LzIsIHktcm93X2hlaWdodF0sIGYucHJldHR5X25hbWUoc2VjdGlvbl9uYW1lKSwndGFibGUnICk7XG5cblxuXG5cbiAgICAgICAgICAgIHQuYWxsX2NlbGxzKCkuZm9yRWFjaChmdW5jdGlvbihjZWxsKXtcbiAgICAgICAgICAgICAgICBjZWxsLmZvbnQoJ3RhYmxlJykuYm9yZGVyKCdhbGwnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0Lm1rKCk7XG5cbiAgICAgICAgICAgIC8vKi9cbiAgICAgICAgICAgIHkgKz0gaCArIDMwO1xuXG4gICAgICAgICAgICBpZiggeSA+ICggc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcuaCAqIDAuOCApICkge1xuICAgICAgICAgICAgICAgIHkgPVxuICAgICAgICAgICAgICAgICAgICB5ID0gc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmcqNiArMjA7XG4gICAgICAgICAgICAgICAgICAgIHggKz0gdyoxLjU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnbm90IGRlZmluZWQ6ICcsIHNlY3Rpb25fbmFtZSwgc2VjdGlvbik7XG4gICAgICAgIH1cblxuXG5cblxuICAgIH1cblxuICAgIGQubGF5ZXIoKTtcblxuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xudmFyIG1rX2JvcmRlciA9IHJlcXVpcmUoJy4vbWtfYm9yZGVyJyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHBhZ2UgNFwiKTtcbiAgICB2YXIgZiA9IHNldHRpbmdzLmY7XG5cbiAgICBkID0gbWtfZHJhd2luZyhzZXR0aW5ncyk7XG5cbiAgICB2YXIgc2hlZXRfc2VjdGlvbiA9ICdTJztcbiAgICB2YXIgc2hlZXRfbnVtID0gJzAxJztcbiAgICBkLmFwcGVuZChta19ib3JkZXIoc2V0dGluZ3MsIHNoZWV0X3NlY3Rpb24sIHNoZWV0X251bSApKTtcblxuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxvYztcbiAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZChzZXR0aW5ncywgJ3Jvb2YnKSApe1xuXG5cblxuICAgICAgICB2YXIgeCwgeSwgaCwgdywgc2VjdGlvbl94LCBzZWN0aW9uX3ksIGxlbmd0aF9wLCBzY2FsZTtcblxuICAgICAgICB2YXIgc2xvcGUgPSBzeXN0ZW0ucm9vZi5zbG9wZS5zcGxpdCgnOicpWzBdO1xuICAgICAgICB2YXIgYW5nbGVfcmFkID0gTWF0aC5hdGFuKCBOdW1iZXIoc2xvcGUpIC8xMiApO1xuICAgICAgICAvL2FuZ2xlX3JhZCA9IGFuZ2xlICogKE1hdGguUEkvMTgwKTtcblxuXG4gICAgICAgIGxlbmd0aF9wID0gc3lzdGVtLnJvb2YubGVuZ3RoICogTWF0aC5jb3MoYW5nbGVfcmFkKTtcbiAgICAgICAgc3lzdGVtLnJvb2YuaGVpZ2h0ID0gc3lzdGVtLnJvb2YubGVuZ3RoICogTWF0aC5zaW4oYW5nbGVfcmFkKTtcblxuICAgICAgICB2YXIgcm9vZl9yYXRpbyA9IHN5c3RlbS5yb29mLmxlbmd0aCAvIHN5c3RlbS5yb29mLndpZHRoO1xuICAgICAgICB2YXIgcm9vZl9wbGFuX3JhdGlvID0gbGVuZ3RoX3AgLyBzeXN0ZW0ucm9vZi53aWR0aDtcblxuXG4gICAgICAgIGlmKCBzeXN0ZW0ucm9vZi50eXBlID09PSBcIkdhYmxlXCIpe1xuXG5cbiAgICAgICAgICAgIC8vLy8vLy9cbiAgICAgICAgICAgIC8vIFJvb2QgcGxhbiB2aWV3XG4gICAgICAgICAgICB2YXIgcGxhbl94ID0gNjA7XG4gICAgICAgICAgICB2YXIgcGxhbl95ID0gNjA7XG5cbiAgICAgICAgICAgIHZhciBwbGFuX3csIHBsYW5faDtcbiAgICAgICAgICAgIGlmKCBsZW5ndGhfcCoyID4gc3lzdGVtLnJvb2Yud2lkdGggKXtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDIwMC8obGVuZ3RoX3AqMik7XG4gICAgICAgICAgICAgICAgcGxhbl93ID0gKGxlbmd0aF9wKjIpICogc2NhbGU7XG4gICAgICAgICAgICAgICAgcGxhbl9oID0gcGxhbl93IC8gKGxlbmd0aF9wKjIgLyBzeXN0ZW0ucm9vZi53aWR0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNjYWxlID0gMzAwLyhzeXN0ZW0ucm9vZi53aWR0aCk7XG4gICAgICAgICAgICAgICAgcGxhbl9oID0gc3lzdGVtLnJvb2Yud2lkdGggKiBzY2FsZTtcbiAgICAgICAgICAgICAgICBwbGFuX3cgPSBwbGFuX2ggKiAobGVuZ3RoX3AqMiAvIHN5c3RlbS5yb29mLndpZHRoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIsIHBsYW5feStwbGFuX2gvMl0sXG4gICAgICAgICAgICAgICAgW3BsYW5fdywgcGxhbl9oXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkLnBvbHkoW1xuICAgICAgICAgICAgICAgICAgICBbcGxhbl94ICAgICAgICwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95K3BsYW5faF0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3gsICAgICAgICBwbGFuX3krcGxhbl9oXSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCAgICAgICAsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3Vuc2VsZWN0ZWRcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQucG9seShbXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIgICAgICAgLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yK3BsYW5fdy8yLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yK3BsYW5fdy8yLCBwbGFuX3krcGxhbl9oXSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgICAgICAgIHBsYW5feStwbGFuX2hdLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yICAgICAgICwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX3BvbHlfc2VsZWN0ZWRcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95K3BsYW5faF1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtwbGFuX3gtMjAsIHBsYW5feStwbGFuX2gvMl0sXG4gICAgICAgICAgICAgICAgc3lzdGVtLnJvb2YubGVuZ3RoLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3crMjAsIHBsYW5feStwbGFuX2gvMl0sXG4gICAgICAgICAgICAgICAgc3lzdGVtLnJvb2Yud2lkdGgudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcblxuXG4gICAgICAgICAgICB4ID0gcGxhbl94ICsgMTIwO1xuICAgICAgICAgICAgeSA9IHBsYW5feSAtIDIwO1xuXG4gICAgICAgICAgICBkLmJsb2NrKCdub3J0aCBhcnJvd19sZWZ0JywgW3gseV0pO1xuXG5cbiAgICAgICAgICAgIC8vLy8vLy8vXG4gICAgICAgICAgICAvLyByb29mIGNyb3NzZWN0aW9uXG5cbiAgICAgICAgICAgIHZhciBjc194ID0gcGxhbl94O1xuICAgICAgICAgICAgdmFyIGNzX3kgPSBwbGFuX3kgKyBwbGFuX2ggKyA1MDtcbiAgICAgICAgICAgIHZhciBjc19oID0gc3lzdGVtLnJvb2YuaGVpZ2h0ICogc2NhbGU7XG4gICAgICAgICAgICB2YXIgY3NfdyA9IHBsYW5fdy8yO1xuXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3ldLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3krY3NfaF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3csICAgY3NfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtjc194K2NzX3cqMiwgY3NfeStjc19oXSxcbiAgICAgICAgICAgICAgICAgICAgW2NzX3gsICAgICAgICBjc195K2NzX2hdLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3ldLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbY3NfeCtjc193LTE1LCBjc195K2NzX2gqMi8zXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi5oZWlnaHQgKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbY3NfeCtjc193KjEuNSsyMCwgY3NfeStjc19oLzNdLFxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHN5c3RlbS5yb29mLmxlbmd0aCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG5cblxuICAgICAgICAgICAgLy8vLy8vXG4gICAgICAgICAgICAvLyByb29mIGRldGFpbFxuXG4gICAgICAgICAgICB2YXIgZGV0YWlsX3ggPSAzMCs0MDA7XG4gICAgICAgICAgICB2YXIgZGV0YWlsX3kgPSAzMDtcblxuICAgICAgICAgICAgaWYoIE51bWJlcihzeXN0ZW0ucm9vZi53aWR0aCkgPj0gTnVtYmVyKHN5c3RlbS5yb29mLmxlbmd0aCkgKXtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDM1MC8oc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IDM1MC8oc3lzdGVtLnJvb2YubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkZXRhaWxfdyA9IHN5c3RlbS5yb29mLndpZHRoICogc2NhbGU7XG4gICAgICAgICAgICB2YXIgZGV0YWlsX2ggPSBzeXN0ZW0ucm9vZi5sZW5ndGggKiBzY2FsZTtcblxuICAgICAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy8yLCBkZXRhaWxfeStkZXRhaWxfaC8yXSxcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3csIGRldGFpbF9oXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3NlbGVjdGVkX2ZyYW1lZFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB2YXIgYSA9IDM7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0X2EgPSBhICogc2NhbGU7XG5cbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCwgICBkZXRhaWxfeStvZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdywgICBkZXRhaWxfeStvZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCwgICAgICAgICAgZGV0YWlsX3krZGV0YWlsX2gtb2Zmc2V0X2FdLFxuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3csIGRldGFpbF95K2RldGFpbF9oLW9mZnNldF9hXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K29mZnNldF9hLCBkZXRhaWxfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtvZmZzZXRfYSwgZGV0YWlsX3krZGV0YWlsX2hdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3ctb2Zmc2V0X2EsIGRldGFpbF95XSxcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LW9mZnNldF9hLCBkZXRhaWxfeStkZXRhaWxfaF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeC00MCwgZGV0YWlsX3krZGV0YWlsX2gvMl0sXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggc3lzdGVtLnJvb2YubGVuZ3RoICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbicsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LzIsIGRldGFpbF95K2RldGFpbF9oKzQwXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi53aWR0aCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94KyAob2Zmc2V0X2EpLzIsIGRldGFpbF95K2RldGFpbF9oKzE1XSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbicsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LShvZmZzZXRfYSkvMiwgZGV0YWlsX3krZGV0YWlsX2grMTVdLFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3gtMTUsIGRldGFpbF95K2RldGFpbF9oLShvZmZzZXRfYSkvMl0sXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeC0xNSwgZGV0YWlsX3krKG9mZnNldF9hKS8yXSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbicsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHggPSBkZXRhaWxfeCArIGRldGFpbF93ICsgMjU7XG4gICAgICAgICAgICB5ID0gZGV0YWlsX3kgKyAxMjA7XG5cbiAgICAgICAgICAgIGQuYmxvY2soJ25vcnRoIGFycm93X3VwJywgW3gseV0pO1xuXG5cblxuICAgICAgICAgICAgLy8vLy8vXG4gICAgICAgICAgICAvLyBNb2R1bGUgb3B0aW9uc1xuICAgICAgICAgICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKHNldHRpbmdzLCAnbW9kdWxlJykgJiYgZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdhcnJheScpKXtcbiAgICAgICAgICAgICAgICB2YXIgcixjO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJvb2ZfbGVuZ3RoX2F2YWlsID0gc3lzdGVtLnJvb2YubGVuZ3RoIC0gKGEqMik7XG4gICAgICAgICAgICAgICAgdmFyIHJvb2Zfd2lkdGhfYXZhaWwgPSBzeXN0ZW0ucm9vZi53aWR0aCAtIChhKjIpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHJvd19zcGFjaW5nO1xuICAgICAgICAgICAgICAgIGlmKCBzeXN0ZW0ubW9kdWxlLm9yaWVudGF0aW9uID09PSAnUG9ydHJhaXQnICl7XG4gICAgICAgICAgICAgICAgICAgIHJvd19zcGFjaW5nID0gTnVtYmVyKHN5c3RlbS5tb2R1bGUubGVuZ3RoKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIGNvbF9zcGFjaW5nID0gTnVtYmVyKHN5c3RlbS5tb2R1bGUud2lkdGgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlX3cgPSAoTnVtYmVyKHN5c3RlbS5tb2R1bGUud2lkdGgpICApLzEyO1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVfaCA9IChOdW1iZXIoc3lzdGVtLm1vZHVsZS5sZW5ndGgpICkvMTI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcm93X3NwYWNpbmcgPSBOdW1iZXIoc3lzdGVtLm1vZHVsZS53aWR0aCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBjb2xfc3BhY2luZyA9IE51bWJlcihzeXN0ZW0ubW9kdWxlLmxlbmd0aCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVfdyA9IChOdW1iZXIoc3lzdGVtLm1vZHVsZS5sZW5ndGgpKS8xMjtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlX2ggPSAoTnVtYmVyKHN5c3RlbS5tb2R1bGUud2lkdGgpICkvMTI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcm93X3NwYWNpbmcgPSByb3dfc3BhY2luZy8xMjsgLy9tb2R1bGUgZGltZW50aW9ucyBhcmUgaW4gaW5jaGVzXG4gICAgICAgICAgICAgICAgY29sX3NwYWNpbmcgPSBjb2xfc3BhY2luZy8xMjsgLy9tb2R1bGUgZGltZW50aW9ucyBhcmUgaW4gaW5jaGVzXG5cbiAgICAgICAgICAgICAgICB2YXIgbnVtX3Jvd3MgPSBNYXRoLmZsb29yKHJvb2ZfbGVuZ3RoX2F2YWlsL3Jvd19zcGFjaW5nKTtcbiAgICAgICAgICAgICAgICB2YXIgbnVtX2NvbHMgPSBNYXRoLmZsb29yKHJvb2Zfd2lkdGhfYXZhaWwvY29sX3NwYWNpbmcpO1xuXG4gICAgICAgICAgICAgICAgLy9zZWxlY3RlZCBtb2R1bGVzXG5cbiAgICAgICAgICAgICAgICBpZiggbnVtX2NvbHMgIT09IHNldHRpbmdzLnRlbXAubnVtX2NvbHMgfHwgbnVtX3Jvd3MgIT09IHNldHRpbmdzLnRlbXAubnVtX3Jvd3MgKXtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3Mud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzID0ge307XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yKCByPTE7IHI8PW51bV9yb3dzOyByKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3Mud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzW3JdID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IoIGM9MTsgYzw9bnVtX2NvbHM7IGMrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3Mud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzW3JdW2NdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLnRlbXAubnVtX2NvbHMgPSBudW1fY29scztcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MudGVtcC5udW1fcm93cyA9IG51bV9yb3dzO1xuICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgeCA9IGRldGFpbF94ICsgb2Zmc2V0X2E7IC8vY29ybmVyIG9mIHVzYWJsZSBzcGFjZVxuICAgICAgICAgICAgICAgIHkgPSBkZXRhaWxfeSArIG9mZnNldF9hO1xuICAgICAgICAgICAgICAgIHggKz0gKCByb29mX3dpZHRoX2F2YWlsIC0gKGNvbF9zcGFjaW5nKm51bV9jb2xzKSkvMiAqc2NhbGU7IC8vIGNlbnRlciBhcnJheSBvbiByb29mXG4gICAgICAgICAgICAgICAgeSArPSAoIHJvb2ZfbGVuZ3RoX2F2YWlsIC0gKHJvd19zcGFjaW5nKm51bV9yb3dzKSkvMiAqc2NhbGU7XG4gICAgICAgICAgICAgICAgbW9kdWxlX3cgPSBtb2R1bGVfdyAqIHNjYWxlO1xuICAgICAgICAgICAgICAgIG1vZHVsZV9oID0gbW9kdWxlX2ggKiBzY2FsZTtcblxuXG5cbiAgICAgICAgICAgICAgICBmb3IoIHI9MTsgcjw9bnVtX3Jvd3M7IHIrKyl7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yKCBjPTE7IGM8PW51bV9jb2xzOyBjKyspe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGF5ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggc2V0dGluZ3Mud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzW3JdW2NdICkgbGF5ZXIgPSAncHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGxheWVyID0gJ3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlX3ggPSAoYy0xKSAqIGNvbF9zcGFjaW5nICogc2NhbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVfeSA9IChyLTEpICogcm93X3NwYWNpbmcgKiBzY2FsZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFt4K21vZHVsZV94K21vZHVsZV93LzIsIHkrbW9kdWxlX3krbW9kdWxlX2gvMl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW21vZHVsZV93LCBtb2R1bGVfaF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrOiBcImcuZi50b2dnbGVfbW9kdWxlKHRoaXMpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZV9JRDogIChyKSArICcsJyArIChjKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3cvMiwgZGV0YWlsX3krZGV0YWlsX2grMTAwXSxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJTZWxlY3RlZCBtb2R1bGVzOiBcIiArIHBhcnNlRmxvYXQoIHNldHRpbmdzLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc190b3RhbCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDYWxjdWxhdGVkIG1vZHVsZXM6IFwiICsgcGFyc2VGbG9hdCggc2V0dGluZ3Muc3lzdGVtLmFycmF5Lm51bWJlcl9vZl9tb2R1bGVzICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICdkaW1lbnRpb24nLFxuICAgICAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIH1cblxuXG5cblxuICAgICAgICB9XG4gICAgfVxuXG5cblxuXG5cblxuICAgIHJldHVybiBkLmRyYXdpbmdfcGFydHM7XG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBwYWdlO1xuIiwidmFyIG1rX2RyYXdpbmcgPSByZXF1aXJlKCcuL21rX2RyYXdpbmcnKTtcbnZhciBta19ib3JkZXIgPSByZXF1aXJlKCcuL21rX2JvcmRlcicpO1xudmFyIGYgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucycpO1xuXG52YXIgcGFnZSA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcbiAgICBjb25zb2xlLmxvZyhcIioqIE1ha2luZyBwcmV2aWV3IDFcIik7XG5cbiAgICB2YXIgZCA9IG1rX2RyYXdpbmcoc2V0dGluZ3MpO1xuXG5cblxuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgIHZhciBsb2MgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmxvYztcbiAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuXG4gICAgdmFyIHgsIHksIGgsIHcsIHNlY3Rpb25feCwgc2VjdGlvbl95O1xuXG4gICAgdyA9IHNpemUucHJldmlldy5tb2R1bGUudztcbiAgICBoID0gc2l6ZS5wcmV2aWV3Lm1vZHVsZS5oO1xuICAgIGxvYy5wcmV2aWV3LmFycmF5LmJvdHRvbSA9IGxvYy5wcmV2aWV3LmFycmF5LnRvcCArIGgqMS4yNSpzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nICsgaCozLzQ7XG4gICAgLy9sb2MucHJldmlldy5hcnJheS5yaWdodCA9IGxvYy5wcmV2aWV3LmFycmF5LmxlZnQgKyB3KjEuMjUqc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzICsgdyoyO1xuICAgIGxvYy5wcmV2aWV3LmFycmF5LnJpZ2h0ID0gbG9jLnByZXZpZXcuYXJyYXkubGVmdCArIHcqMS4yNSo4ICsgdyoyO1xuXG4gICAgbG9jLnByZXZpZXcuaW52ZXJ0ZXIuY2VudGVyID0gNTAwIDtcbiAgICB3ID0gc2l6ZS5wcmV2aWV3LmludmVydGVyLnc7XG4gICAgbG9jLnByZXZpZXcuaW52ZXJ0ZXIubGVmdCA9IGxvYy5wcmV2aWV3LmludmVydGVyLmNlbnRlciAtIHcvMjtcbiAgICBsb2MucHJldmlldy5pbnZlcnRlci5yaWdodCA9IGxvYy5wcmV2aWV3LmludmVydGVyLmNlbnRlciArIHcvMjtcblxuICAgIGxvYy5wcmV2aWV3LkRDLmxlZnQgPSBsb2MucHJldmlldy5hcnJheS5yaWdodDtcbiAgICBsb2MucHJldmlldy5EQy5yaWdodCA9IGxvYy5wcmV2aWV3LmludmVydGVyLmxlZnQ7XG4gICAgbG9jLnByZXZpZXcuREMuY2VudGVyID0gKCBsb2MucHJldmlldy5EQy5yaWdodCArIGxvYy5wcmV2aWV3LkRDLmxlZnQgKS8yO1xuXG4gICAgbG9jLnByZXZpZXcuQUMubGVmdCA9IGxvYy5wcmV2aWV3LmludmVydGVyLnJpZ2h0O1xuICAgIGxvYy5wcmV2aWV3LkFDLnJpZ2h0ID0gbG9jLnByZXZpZXcuQUMubGVmdCArIDMwMDtcbiAgICBsb2MucHJldmlldy5BQy5jZW50ZXIgPSAoIGxvYy5wcmV2aWV3LkFDLnJpZ2h0ICsgbG9jLnByZXZpZXcuQUMubGVmdCApLzI7XG5cblxuLy8gVE9ETyBmaXg6IHNlY3Rpb25zIG11c3QgYmUgZGVmaW5lZCBpbiBvcmRlciwgb3IgdGhlcmUgYXJlIGFyZWFzXG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdhcnJheScpICYmIGYuc2VjdGlvbl9kZWZpbmVkKHNldHRpbmdzLCAnbW9kdWxlJykgKXtcbiAgICAgICAgZC5sYXllcigncHJldmlld19hcnJheScpO1xuXG4gICAgICAgIHcgPSBzaXplLnByZXZpZXcubW9kdWxlLnc7XG4gICAgICAgIGggPSBzaXplLnByZXZpZXcubW9kdWxlLmg7XG4gICAgICAgIHZhciBvZmZzZXQgPSA0MDtcblxuICAgICAgICBmb3IoIHZhciBzPTA7IHM8c3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzOyBzKysgKXtcbiAgICAgICAgICAgIHggPSBsb2MucHJldmlldy5hcnJheS5sZWZ0ICsgdyoxLjI1KnM7XG4gICAgICAgICAgICAvLyBzdHJpbmcgd2lyaW5nXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbIHggLCBsb2MucHJldmlldy5hcnJheS50b3AgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB4ICwgbG9jLnByZXZpZXcuYXJyYXkuYm90dG9tIF0sXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIC8vIG1vZHVsZXNcbiAgICAgICAgICAgIGZvciggdmFyIG09MDsgbTxzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nOyBtKysgKXtcbiAgICAgICAgICAgICAgICB5ID0gbG9jLnByZXZpZXcuYXJyYXkudG9wICsgaCArIGgqMS4yNSptO1xuICAgICAgICAgICAgICAgIC8vIG1vZHVsZXNcbiAgICAgICAgICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICAgICAgICAgIFsgeCAsIHkgXSxcbiAgICAgICAgICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAgICAgICAgICdwcmV2aWV3X21vZHVsZSdcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdG9wIGFycmF5IGNvbmR1aXRcbiAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LmFycmF5LmxlZnQgLCBsb2MucHJldmlldy5hcnJheS50b3AgXSxcbiAgICAgICAgICAgICAgICBbIGxvYy5wcmV2aWV3LmFycmF5LnJpZ2h0IC0gdywgbG9jLnByZXZpZXcuYXJyYXkudG9wIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5hcnJheS5yaWdodCAsIGxvYy5wcmV2aWV3LmFycmF5LnRvcCBdLFxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgICAgICAvLyBib3R0b20gYXJyYXkgY29uZHVpdFxuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuYXJyYXkubGVmdCAsIGxvYy5wcmV2aWV3LmFycmF5LmJvdHRvbSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuYXJyYXkucmlnaHQgLSB3ICwgbG9jLnByZXZpZXcuYXJyYXkuYm90dG9tIF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5hcnJheS5yaWdodCAtIHcgLCBsb2MucHJldmlldy5hcnJheS50b3AgXSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgKTtcblxuICAgICAgICB5ID0gbG9jLnByZXZpZXcuYXJyYXkudG9wO1xuICAgICAgICBoID0gc2l6ZS5wcmV2aWV3Lm1vZHVsZS5oO1xuXG4gICAgICAgIGQudGV4dChcbiAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuREMuY2VudGVyLCB5K2gvMitvZmZzZXQgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnQXJyYXkgREMnLFxuICAgICAgICAgICAgICAgICdTdHJpbmdzOiAnICsgcGFyc2VGbG9hdChzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MpLnRvRml4ZWQoKSxcbiAgICAgICAgICAgICAgICAnTW9kdWxlczogJyArIHBhcnNlRmxvYXQoc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZykudG9GaXhlZCgpLFxuICAgICAgICAgICAgICAgICdQbXA6ICcgKyBwYXJzZUZsb2F0KHN5c3RlbS5hcnJheS5wbXApLnRvRml4ZWQoKSxcbiAgICAgICAgICAgICAgICAnSW1wOiAnICsgcGFyc2VGbG9hdChzeXN0ZW0uYXJyYXkuaW1wKS50b0ZpeGVkKCksXG4gICAgICAgICAgICAgICAgJ1ZtcDogJyArIHBhcnNlRmxvYXQoc3lzdGVtLmFycmF5LnZtcCkudG9GaXhlZCgpLFxuICAgICAgICAgICAgICAgICdJc2M6ICcgKyBwYXJzZUZsb2F0KHN5c3RlbS5hcnJheS5pc2MpLnRvRml4ZWQoKSxcbiAgICAgICAgICAgICAgICAnVm9jOiAnICsgcGFyc2VGbG9hdChzeXN0ZW0uYXJyYXkudm9jKS50b0ZpeGVkKCksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ3ByZXZpZXcgdGV4dCdcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdEQycpICl7XG4gICAgICAgIGQubGF5ZXIoJ3ByZXZpZXdfREMnKTtcblxuICAgICAgICAvL3kgPSB5O1xuICAgICAgICB5ID0gbG9jLnByZXZpZXcuYXJyYXkudG9wO1xuICAgICAgICB3ID0gc2l6ZS5wcmV2aWV3Lm1vZHVsZS53O1xuICAgICAgICBoID0gc2l6ZS5wcmV2aWV3Lm1vZHVsZS5oO1xuXG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5EQy5sZWZ0ICwgeSBdLFxuICAgICAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuREMucmlnaHQsIHkgXSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgKTtcbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW2xvYy5wcmV2aWV3LkRDLmNlbnRlcix5XSxcbiAgICAgICAgICAgIFt3LGhdLFxuICAgICAgICAgICAgJ3ByZXZpZXdfRENfYm94J1xuICAgICAgICApO1xuXG4gICAgfVxuXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKHNldHRpbmdzLCAnaW52ZXJ0ZXInKSApe1xuXG4gICAgICAgIGQubGF5ZXIoJ3ByZXZpZXdfaW52ZXJ0ZXInKTtcblxuICAgICAgICB5ID0geTtcbiAgICAgICAgdyA9IHNpemUucHJldmlldy5pbnZlcnRlci53O1xuICAgICAgICBoID0gc2l6ZS5wcmV2aWV3LmludmVydGVyLmg7XG5cbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW2xvYy5wcmV2aWV3LmludmVydGVyLmNlbnRlcix5XSxcbiAgICAgICAgICAgIFt3LGhdLFxuICAgICAgICAgICAgJ3ByZXZpZXdfaW52ZXJ0ZXJfYm94J1xuICAgICAgICApO1xuICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICBbbG9jLnByZXZpZXcuaW52ZXJ0ZXIuY2VudGVyLHkraC8yK29mZnNldF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ0ludmVydGVyJyxcbiAgICAgICAgICAgICAgICBzeXN0ZW0uaW52ZXJ0ZXIubWFrZSxcbiAgICAgICAgICAgICAgICBzeXN0ZW0uaW52ZXJ0ZXIubW9kZWwsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ3ByZXZpZXcgdGV4dCdcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdBQycpICl7XG5cbiAgICAgICAgZC5sYXllcigncHJldmlld19BQycpO1xuXG5cbiAgICAgICAgeSA9IHk7XG4gICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5BQy5sZWZ0LCB5IF0sXG4gICAgICAgICAgICAgICAgWyBsb2MucHJldmlldy5BQy5yaWdodCwgeSBdLFxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuICAgICAgICB3ID0gc2l6ZS5wcmV2aWV3LkFDLnc7XG4gICAgICAgIGggPSBzaXplLnByZXZpZXcuQUMuaDtcbiAgICAgICAgZC5yZWN0KFxuICAgICAgICAgICAgW2xvYy5wcmV2aWV3LkFDLmNlbnRlcix5XSxcbiAgICAgICAgICAgIFt3LGhdLFxuICAgICAgICAgICAgJ3ByZXZpZXdfQUNfYm94J1xuICAgICAgICApO1xuICAgICAgICB3ID0gc2l6ZS5wcmV2aWV3LmxvYWRjZW50ZXIudztcbiAgICAgICAgaCA9IHNpemUucHJldmlldy5sb2FkY2VudGVyLmg7XG4gICAgICAgIGQucmVjdChcbiAgICAgICAgICAgIFsgbG9jLnByZXZpZXcuQUMucmlnaHQtdy8yLCB5K2gvNCBdLFxuICAgICAgICAgICAgW3csaF0sXG4gICAgICAgICAgICAncHJldmlld19BQ19ib3gnXG4gICAgICAgICk7XG5cbiAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgW2xvYy5wcmV2aWV3LkFDLmNlbnRlcix5K2gvMitvZmZzZXRdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdBQycsXG5cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAncHJldmlldyB0ZXh0J1xuICAgICAgICApO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIGQuZHJhd2luZ19wYXJ0cztcbn07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhZ2U7XG4iLCJ2YXIgbWtfZHJhd2luZyA9IHJlcXVpcmUoJy4vbWtfZHJhd2luZycpO1xudmFyIG1rX2JvcmRlciA9IHJlcXVpcmUoJy4vbWtfYm9yZGVyJyk7XG52YXIgZiA9IHJlcXVpcmUoJy4vZnVuY3Rpb25zJyk7XG5cbnZhciBwYWdlID0gZnVuY3Rpb24oc2V0dGluZ3Mpe1xuICAgIGNvbnNvbGUubG9nKFwiKiogTWFraW5nIHByZXZpZXcgMlwiKTtcblxuICAgIHZhciBkID0gbWtfZHJhd2luZyhzZXR0aW5ncyk7XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdyb29mJykgKXtcblxuICAgICAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZTtcbiAgICAgICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuICAgICAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuXG4gICAgICAgIHZhciB4LCB5LCBoLCB3LCBzZWN0aW9uX3gsIHNlY3Rpb25feSwgbGVuZ3RoX3AsIHNjYWxlO1xuXG4gICAgICAgIHZhciBzbG9wZSA9IHN5c3RlbS5yb29mLnNsb3BlLnNwbGl0KCc6JylbMF07XG4gICAgICAgIHZhciBhbmdsZV9yYWQgPSBNYXRoLmF0YW4oIE51bWJlcihzbG9wZSkgLzEyICk7XG4gICAgICAgIC8vYW5nbGVfcmFkID0gYW5nbGUgKiAoTWF0aC5QSS8xODApO1xuXG5cbiAgICAgICAgbGVuZ3RoX3AgPSBzeXN0ZW0ucm9vZi5sZW5ndGggKiBNYXRoLmNvcyhhbmdsZV9yYWQpO1xuICAgICAgICBzeXN0ZW0ucm9vZi5oZWlnaHQgPSBzeXN0ZW0ucm9vZi5sZW5ndGggKiBNYXRoLnNpbihhbmdsZV9yYWQpO1xuXG4gICAgICAgIHZhciByb29mX3JhdGlvID0gc3lzdGVtLnJvb2YubGVuZ3RoIC8gc3lzdGVtLnJvb2Yud2lkdGg7XG4gICAgICAgIHZhciByb29mX3BsYW5fcmF0aW8gPSBsZW5ndGhfcCAvIHN5c3RlbS5yb29mLndpZHRoO1xuXG5cbiAgICAgICAgaWYoIHN5c3RlbS5yb29mLnR5cGUgPT09IFwiR2FibGVcIil7XG5cblxuICAgICAgICAgICAgLy8vLy8vL1xuICAgICAgICAgICAgLy8gUm9vZCBwbGFuIHZpZXdcbiAgICAgICAgICAgIHZhciBwbGFuX3ggPSAzMDtcbiAgICAgICAgICAgIHZhciBwbGFuX3kgPSAzMDtcblxuICAgICAgICAgICAgdmFyIHBsYW5fdywgcGxhbl9oO1xuICAgICAgICAgICAgaWYoIGxlbmd0aF9wKjIgPiBzeXN0ZW0ucm9vZi53aWR0aCApe1xuICAgICAgICAgICAgICAgIHNjYWxlID0gMjUwLyhsZW5ndGhfcCoyKTtcbiAgICAgICAgICAgICAgICBwbGFuX3cgPSAobGVuZ3RoX3AqMikgKiBzY2FsZTtcbiAgICAgICAgICAgICAgICBwbGFuX2ggPSBwbGFuX3cgLyAobGVuZ3RoX3AqMiAvIHN5c3RlbS5yb29mLndpZHRoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2NhbGUgPSA0MDAvKHN5c3RlbS5yb29mLndpZHRoKTtcbiAgICAgICAgICAgICAgICBwbGFuX2ggPSBzeXN0ZW0ucm9vZi53aWR0aCAqIHNjYWxlO1xuICAgICAgICAgICAgICAgIHBsYW5fdyA9IHBsYW5faCAqIChsZW5ndGhfcCoyIC8gc3lzdGVtLnJvb2Yud2lkdGgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkLnJlY3QoXG4gICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiwgcGxhbl95K3BsYW5faC8yXSxcbiAgICAgICAgICAgICAgICBbcGxhbl93LCBwbGFuX2hdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsXCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGQucG9seShbXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3ggICAgICAgLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3krcGxhbl9oXSxcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCwgICAgICAgIHBsYW5feStwbGFuX2hdLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94ICAgICAgICwgcGxhbl95XSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX3BvbHlfdW5zZWxlY3RlZFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5wb2x5KFtcbiAgICAgICAgICAgICAgICAgICAgW3BsYW5feCtwbGFuX3cvMiAgICAgICAsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIrcGxhbl93LzIsIHBsYW5feV0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIrcGxhbl93LzIsIHBsYW5feStwbGFuX2hdLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCAgICAgICAgcGxhbl95K3BsYW5faF0sXG4gICAgICAgICAgICAgICAgICAgIFtwbGFuX3grcGxhbl93LzIgICAgICAgLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfcG9seV9zZWxlY3RlZFwiXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3ldLFxuICAgICAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdy8yLCBwbGFuX3krcGxhbl9oXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW3BsYW5feC0yMCwgcGxhbl95K3BsYW5faC8yXSxcbiAgICAgICAgICAgICAgICBzeXN0ZW0ucm9vZi5sZW5ndGgudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbcGxhbl94K3BsYW5fdysyMCwgcGxhbl95K3BsYW5faC8yXSxcbiAgICAgICAgICAgICAgICBzeXN0ZW0ucm9vZi53aWR0aC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG5cblxuXG4gICAgICAgICAgICAvLy8vLy8vL1xuICAgICAgICAgICAgLy8gcm9vZiBjcm9zc2VjdGlvblxuXG4gICAgICAgICAgICB2YXIgY3NfeCA9IDMwO1xuICAgICAgICAgICAgdmFyIGNzX3kgPSAzMCtwbGFuX2grNTA7XG4gICAgICAgICAgICB2YXIgY3NfaCA9IHN5c3RlbS5yb29mLmhlaWdodCAqIHNjYWxlO1xuICAgICAgICAgICAgdmFyIGNzX3cgPSBwbGFuX3cvMjtcblxuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2NzX3grY3NfdywgICBjc195XSxcbiAgICAgICAgICAgICAgICAgICAgW2NzX3grY3NfdywgICBjc195K2NzX2hdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193LCAgIGNzX3ldLFxuICAgICAgICAgICAgICAgICAgICBbY3NfeCtjc193KjIsIGNzX3krY3NfaF0sXG4gICAgICAgICAgICAgICAgICAgIFtjc194LCAgICAgICAgY3NfeStjc19oXSxcbiAgICAgICAgICAgICAgICAgICAgW2NzX3grY3NfdywgICBjc195XSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2NzX3grY3Nfdy0xNSwgY3NfeStjc19oKjIvM10sXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggc3lzdGVtLnJvb2YuaGVpZ2h0ICkudG9GaXhlZCgpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2NzX3grY3NfdyoxLjUrMjAsIGNzX3krY3NfaC8zXSxcbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KCBzeXN0ZW0ucm9vZi5sZW5ndGggKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcblxuXG5cbiAgICAgICAgICAgIC8vLy8vL1xuICAgICAgICAgICAgLy8gcm9vZiBkZXRhaWxcblxuICAgICAgICAgICAgdmFyIGRldGFpbF94ID0gMzArNDUwO1xuICAgICAgICAgICAgdmFyIGRldGFpbF95ID0gMzA7XG5cbiAgICAgICAgICAgIGlmKCBOdW1iZXIoc3lzdGVtLnJvb2Yud2lkdGgpID49IE51bWJlcihzeXN0ZW0ucm9vZi5sZW5ndGgpICl7XG4gICAgICAgICAgICAgICAgc2NhbGUgPSA0NTAvKHN5c3RlbS5yb29mLndpZHRoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2NhbGUgPSA0NTAvKHN5c3RlbS5yb29mLmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZGV0YWlsX3cgPSBzeXN0ZW0ucm9vZi53aWR0aCAqIHNjYWxlO1xuICAgICAgICAgICAgdmFyIGRldGFpbF9oID0gc3lzdGVtLnJvb2YubGVuZ3RoICogc2NhbGU7XG5cbiAgICAgICAgICAgIGQucmVjdChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3cvMiwgZGV0YWlsX3krZGV0YWlsX2gvMl0sXG4gICAgICAgICAgICAgICAgW2RldGFpbF93LCBkZXRhaWxfaF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfcG9seV9zZWxlY3RlZF9mcmFtZWRcIlxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdmFyIGEgPSAzO1xuICAgICAgICAgICAgdmFyIG9mZnNldF9hID0gYSAqIHNjYWxlO1xuXG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3gsICAgZGV0YWlsX3krb2Zmc2V0X2FdLFxuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grZGV0YWlsX3csICAgZGV0YWlsX3krb2Zmc2V0X2FdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3gsICAgICAgICAgIGRldGFpbF95K2RldGFpbF9oLW9mZnNldF9hXSxcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LCBkZXRhaWxfeStkZXRhaWxfaC1vZmZzZXRfYV0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBcInByZXZpZXdfc3RydWN0dXJhbF9kb3RcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQubGluZShbXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtvZmZzZXRfYSwgZGV0YWlsX3ldLFxuICAgICAgICAgICAgICAgICAgICBbZGV0YWlsX3grb2Zmc2V0X2EsIGRldGFpbF95K2RldGFpbF9oXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwicHJldmlld19zdHJ1Y3R1cmFsX2RvdFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC5saW5lKFtcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LW9mZnNldF9hLCBkZXRhaWxfeV0sXG4gICAgICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy1vZmZzZXRfYSwgZGV0YWlsX3krZGV0YWlsX2hdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXCJwcmV2aWV3X3N0cnVjdHVyYWxfZG90XCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3gtNDAsIGRldGFpbF95K2RldGFpbF9oLzJdLFxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoIHN5c3RlbS5yb29mLmxlbmd0aCApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy8yLCBkZXRhaWxfeStkZXRhaWxfaCs0MF0sXG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCggc3lzdGVtLnJvb2Yud2lkdGggKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeCsgKG9mZnNldF9hKS8yLCBkZXRhaWxfeStkZXRhaWxfaCsxNV0sXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZC50ZXh0KFxuICAgICAgICAgICAgICAgIFtkZXRhaWxfeCtkZXRhaWxfdy0ob2Zmc2V0X2EpLzIsIGRldGFpbF95K2RldGFpbF9oKzE1XSxcbiAgICAgICAgICAgICAgICAnYScsXG4gICAgICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBkLnRleHQoXG4gICAgICAgICAgICAgICAgW2RldGFpbF94LTE1LCBkZXRhaWxfeStkZXRhaWxfaC0ob2Zmc2V0X2EpLzJdLFxuICAgICAgICAgICAgICAgICdhJyxcbiAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICBbZGV0YWlsX3gtMTUsIGRldGFpbF95KyhvZmZzZXRfYSkvMl0sXG4gICAgICAgICAgICAgICAgJ2EnLFxuICAgICAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICAgICApO1xuXG5cblxuXG5cbiAgICAgICAgICAgIC8vLy8vL1xuICAgICAgICAgICAgLy8gTW9kdWxlIG9wdGlvbnNcbiAgICAgICAgICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZChzZXR0aW5ncywgJ21vZHVsZScpICYmIGYuc2VjdGlvbl9kZWZpbmVkKHNldHRpbmdzLCAnYXJyYXknKSl7XG4gICAgICAgICAgICAgICAgdmFyIHIsYztcblxuICAgICAgICAgICAgICAgIHZhciByb29mX2xlbmd0aF9hdmFpbCA9IHN5c3RlbS5yb29mLmxlbmd0aCAtIChhKjIpO1xuICAgICAgICAgICAgICAgIHZhciByb29mX3dpZHRoX2F2YWlsID0gc3lzdGVtLnJvb2Yud2lkdGggLSAoYSoyKTtcblxuICAgICAgICAgICAgICAgIHZhciByb3dfc3BhY2luZztcbiAgICAgICAgICAgICAgICBpZiggc3lzdGVtLm1vZHVsZS5vcmllbnRhdGlvbiA9PT0gJ1BvcnRyYWl0JyApe1xuICAgICAgICAgICAgICAgICAgICByb3dfc3BhY2luZyA9IE51bWJlcihzeXN0ZW0ubW9kdWxlLmxlbmd0aCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBjb2xfc3BhY2luZyA9IE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV93ID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSAgKS8xMjtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlX2ggPSAoTnVtYmVyKHN5c3RlbS5tb2R1bGUubGVuZ3RoKSApLzEyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJvd19zcGFjaW5nID0gTnVtYmVyKHN5c3RlbS5tb2R1bGUud2lkdGgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgY29sX3NwYWNpbmcgPSBOdW1iZXIoc3lzdGVtLm1vZHVsZS5sZW5ndGgpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlX3cgPSAoTnVtYmVyKHN5c3RlbS5tb2R1bGUubGVuZ3RoKSkvMTI7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZV9oID0gKE51bWJlcihzeXN0ZW0ubW9kdWxlLndpZHRoKSApLzEyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJvd19zcGFjaW5nID0gcm93X3NwYWNpbmcvMTI7IC8vbW9kdWxlIGRpbWVudGlvbnMgYXJlIGluIGluY2hlc1xuICAgICAgICAgICAgICAgIGNvbF9zcGFjaW5nID0gY29sX3NwYWNpbmcvMTI7IC8vbW9kdWxlIGRpbWVudGlvbnMgYXJlIGluIGluY2hlc1xuXG4gICAgICAgICAgICAgICAgdmFyIG51bV9yb3dzID0gTWF0aC5mbG9vcihyb29mX2xlbmd0aF9hdmFpbC9yb3dfc3BhY2luZyk7XG4gICAgICAgICAgICAgICAgdmFyIG51bV9jb2xzID0gTWF0aC5mbG9vcihyb29mX3dpZHRoX2F2YWlsL2NvbF9zcGFjaW5nKTtcblxuICAgICAgICAgICAgICAgIC8vc2VsZWN0ZWQgbW9kdWxlc1xuXG4gICAgICAgICAgICAgICAgaWYoIG51bV9jb2xzICE9PSBzZXR0aW5ncy50ZW1wLm51bV9jb2xzIHx8IG51bV9yb3dzICE9PSBzZXR0aW5ncy50ZW1wLm51bV9yb3dzICl7XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlcyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNfdG90YWwgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciggcj0xOyByPD1udW1fcm93czsgcisrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKCBjPTE7IGM8PW51bV9jb2xzOyBjKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy50ZW1wLm51bV9jb2xzID0gbnVtX2NvbHM7XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLnRlbXAubnVtX3Jvd3MgPSBudW1fcm93cztcbiAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgICAgIHggPSBkZXRhaWxfeCArIG9mZnNldF9hOyAvL2Nvcm5lciBvZiB1c2FibGUgc3BhY2VcbiAgICAgICAgICAgICAgICB5ID0gZGV0YWlsX3kgKyBvZmZzZXRfYTtcbiAgICAgICAgICAgICAgICB4ICs9ICggcm9vZl93aWR0aF9hdmFpbCAtIChjb2xfc3BhY2luZypudW1fY29scykpLzIgKnNjYWxlOyAvLyBjZW50ZXIgYXJyYXkgb24gcm9vZlxuICAgICAgICAgICAgICAgIHkgKz0gKCByb29mX2xlbmd0aF9hdmFpbCAtIChyb3dfc3BhY2luZypudW1fcm93cykpLzIgKnNjYWxlO1xuICAgICAgICAgICAgICAgIG1vZHVsZV93ID0gbW9kdWxlX3cgKiBzY2FsZTtcbiAgICAgICAgICAgICAgICBtb2R1bGVfaCA9IG1vZHVsZV9oICogc2NhbGU7XG5cblxuXG4gICAgICAgICAgICAgICAgZm9yKCByPTE7IHI8PW51bV9yb3dzOyByKyspe1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciggYz0xOyBjPD1udW1fY29sczsgYysrKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxheWVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIHNldHRpbmdzLndlYnBhZ2Uuc2VsZWN0ZWRfbW9kdWxlc1tyXVtjXSApIGxheWVyID0gJ3ByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGVfc2VsZWN0ZWQnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBsYXllciA9ICdwcmV2aWV3X3N0cnVjdHVyYWxfbW9kdWxlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZV94ID0gKGMtMSkgKiBjb2xfc3BhY2luZyAqIHNjYWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kdWxlX3kgPSAoci0xKSAqIHJvd19zcGFjaW5nICogc2NhbGU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGQucmVjdChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbeCttb2R1bGVfeCttb2R1bGVfdy8yLCB5K21vZHVsZV95K21vZHVsZV9oLzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFttb2R1bGVfdywgbW9kdWxlX2hdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25jbGljazogXCJnLmYudG9nZ2xlX21vZHVsZSh0aGlzKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2R1bGVfSUQ6ICAocikgKyAnLCcgKyAoYylcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGQudGV4dChcbiAgICAgICAgICAgICAgICAgICAgW2RldGFpbF94K2RldGFpbF93LzIsIGRldGFpbF95K2RldGFpbF9oKzEwMF0sXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiU2VsZWN0ZWQgbW9kdWxlczogXCIgKyBwYXJzZUZsb2F0KCBzZXR0aW5ncy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXNfdG90YWwgKS50b0ZpeGVkKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ2FsY3VsYXRlZCBtb2R1bGVzOiBcIiArIHBhcnNlRmxvYXQoIHNldHRpbmdzLnN5c3RlbS5hcnJheS5udW1iZXJfb2ZfbW9kdWxlcyApLnRvRml4ZWQoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAnZGltZW50aW9uJ1xuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeCA9IGRldGFpbF94ICsgNDc1O1xuICAgICAgICAgICAgeSA9IGRldGFpbF95ICsgMTIwO1xuXG4gICAgICAgICAgICBkLmJsb2NrKCdub3J0aCBhcnJvd191cCcsIFt4LHldKTtcblxuICAgICAgICAgICAgeCA9IDEyMDtcbiAgICAgICAgICAgIHkgPSAxNTtcblxuICAgICAgICAgICAgZC5ibG9jaygnbm9ydGggYXJyb3dfbGVmdCcsIFt4LHldKTtcbi8vKi9cbiAgICAgICAgfVxuXG5cbiAgICAgICAgLypcblxuXG5cblxuICAgICAgICBkLmxpbmUoW1xuICAgICAgICAgICAgW3gsICAgIHldLFxuICAgICAgICAgICAgW3grZHgsIHktZHldLFxuICAgICAgICAgICAgW3grZHgsIHldLFxuICAgICAgICAgICAgW3gsICAgIHldLFxuICAgICAgICAgICAgXVxuICAgICAgICApO1xuXG4gICAgICAgIGQudGV4dChcbiAgICAgICAgICAgIFt4K2R4LzItMTAsIHktZHkvMi0yMF0sXG4gICAgICAgICAgICBzeXN0ZW0ucm9vZi5oZWlnaHQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICdkaW1lbnRpb24nXG4gICAgICAgICk7XG4gICAgICAgIGQudGV4dChcbiAgICAgICAgICAgIFt4K2R4LzIrNSwgeS0xNV0sXG4gICAgICAgICAgICBhbmdsZS50b1N0cmluZygpLFxuICAgICAgICAgICAgJ2RpbWVudGlvbidcbiAgICAgICAgKTtcblxuXG4gICAgICAgIHggPSB4K2R4KzEwMDtcbiAgICAgICAgeSA9IHk7XG5cblxuICAgICAgICAvLyovXG5cbiAgICB9XG5cbiAgICByZXR1cm4gZC5kcmF3aW5nX3BhcnRzO1xufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcGFnZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIGYgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucycpO1xuXG5cblxudmFyIG1rX3NldHRpbmdzID0gZnVuY3Rpb24oKSB7XG5cblxuICAgIHZhciBpO1xuICAgIC8vdmFyIHNldHRpbmdzQ2FsY3VsYXRlZCA9IHJlcXVpcmUoJy4vc2V0dGluZ3NDYWxjdWxhdGVkLmpzJyk7XG5cbiAgICAvLyBMb2FkICd1c2VyJyBkZWZpbmVkIHNldHRpbmdzXG4gICAgLy92YXIgbWtfc2V0dGluZ3MgPSByZXF1aXJlKCcuLi9kYXRhL3NldHRpbmdzLmpzb24uanMnKTtcbiAgICAvL2YubWtfc2V0dGluZ3MgPSBta19zZXR0aW5ncztcblxuICAgIHZhciBzZXR0aW5ncyA9IHt9O1xuXG5cblxuXG4gICAgc2V0dGluZ3MudGVtcCA9IHt9O1xuXG4gICAgc2V0dGluZ3MucGVybSA9IHt9O1xuICAgIHNldHRpbmdzLnBlcm0uZ2VvY29kZSA9IHt9O1xuICAgIHNldHRpbmdzLnBlcm0ubG9jYXRpb24gPSB7fTtcbiAgICBzZXR0aW5ncy5wZXJtLmxvY2F0aW9uLm5ld19hZGRyZXNzID0gZmFsc2U7XG4gICAgc2V0dGluZ3MucGVybS5tYXBzID0ge307XG5cbiAgICBzZXR0aW5ncy5jb25maWdfb3B0aW9ucyA9IHt9O1xuICAgIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLk5FQ190YWJsZXMgPSByZXF1aXJlKCcuLi9kYXRhL3RhYmxlcy5qc29uJyk7XG4gICAgLy9jb25zb2xlLmxvZyhzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5ORUNfdGFibGVzKTtcblxuICAgIHNldHRpbmdzLnN0YXRlID0ge307XG4gICAgc2V0dGluZ3Muc3RhdGUuZGF0YWJhc2VfbG9hZGVkID0gZmFsc2U7XG5cbiAgICBzZXR0aW5ncy5pbiA9IHt9O1xuXG4gICAgc2V0dGluZ3MuaW4ub3B0ID0ge307XG4gICAgc2V0dGluZ3MuaW4ub3B0LkFDID0ge307XG4gICAgc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzID0ge307XG4gICAgc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzW1wiMTIwVlwiXSA9IFtcImdyb3VuZFwiLFwibmV1dHJhbFwiLFwiTDFcIl07XG4gICAgc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzW1wiMjQwVlwiXSA9IFtcImdyb3VuZFwiLFwibmV1dHJhbFwiLFwiTDFcIixcIkwyXCJdO1xuICAgIHNldHRpbmdzLmluLm9wdC5BQy50eXBlc1tcIjIwOFZcIl0gPSBbXCJncm91bmRcIixcIm5ldXRyYWxcIixcIkwxXCIsXCJMMlwiXTtcbiAgICBzZXR0aW5ncy5pbi5vcHQuQUMudHlwZXNbXCIyNzdWXCJdID0gW1wiZ3JvdW5kXCIsXCJuZXV0cmFsXCIsXCJMMVwiXTtcbiAgICBzZXR0aW5ncy5pbi5vcHQuQUMudHlwZXNbXCI0ODBWIFd5ZVwiXSA9IFtcImdyb3VuZFwiLFwibmV1dHJhbFwiLFwiTDFcIixcIkwyXCIsXCJMM1wiXTtcbiAgICBzZXR0aW5ncy5pbi5vcHQuQUMudHlwZXNbXCI0ODBWIERlbHRhXCJdID0gW1wiZ3JvdW5kXCIsXCJMMVwiLFwiTDJcIixcIkwzXCJdO1xuXG5cbiAgICBzZXR0aW5ncy5pbnB1dHMgPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMubG9jYXRpb24gPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMubG9jYXRpb24uY291bnR5ID0ge307XG4gICAgc2V0dGluZ3MuaW5wdXRzLmxvY2F0aW9uLmNvdW50eS50eXBlID0gJ3RleHRfaW5wdXQnO1xuICAgIHNldHRpbmdzLmlucHV0cy5sb2NhdGlvbi5hZGRyZXNzID0ge307XG4gICAgc2V0dGluZ3MuaW5wdXRzLmxvY2F0aW9uLmFkZHJlc3MudHlwZSA9ICd0ZXh0X2lucHV0JztcbiAgICBzZXR0aW5ncy5pbnB1dHMubG9jYXRpb24uY2l0eSA9IHt9O1xuICAgIHNldHRpbmdzLmlucHV0cy5sb2NhdGlvbi5jaXR5LnR5cGUgPSAndGV4dF9pbnB1dCc7XG4gICAgc2V0dGluZ3MuaW5wdXRzLmxvY2F0aW9uLnppcCA9IHt9O1xuICAgIHNldHRpbmdzLmlucHV0cy5sb2NhdGlvbi56aXAudHlwZSA9ICd0ZXh0X2lucHV0JztcblxuICAgIHNldHRpbmdzLmlucHV0cy5yb29mID0ge307XG4gICAgc2V0dGluZ3MuaW5wdXRzLnJvb2Yud2lkdGggPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMucm9vZi53aWR0aC5vcHRpb25zID0gW107XG4gICAgLy9mb3IoIGk9MTU7IGk8PTcwOyBpKz01ICkgc2V0dGluZ3MuaW5wdXRzLnJvb2Yud2lkdGgub3B0aW9ucy5wdXNoKGkpO1xuICAgIHNldHRpbmdzLmlucHV0cy5yb29mLndpZHRoLnVuaXRzID0gJ2Z0Lic7XG4gICAgc2V0dGluZ3MuaW5wdXRzLnJvb2Yud2lkdGgubm90ZSA9ICdUaGlzIHRoZSBmdWxsIHNpemUgb2YgdGhlIHJvb2YsIHBlcnBlbmRpY3R1bGFyIHRvIHRoZSBzbG9wZS4nO1xuICAgIHNldHRpbmdzLmlucHV0cy5yb29mLndpZHRoLnR5cGUgPSAnbnVtYmVyX2lucHV0JztcbiAgICBzZXR0aW5ncy5pbnB1dHMucm9vZi5sZW5ndGggPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMucm9vZi5sZW5ndGgub3B0aW9ucyA9IFtdO1xuICAgIC8vZm9yKCBpPTEwOyBpPD02MDsgaSs9NSApIHNldHRpbmdzLmlucHV0cy5yb29mLmxlbmd0aC5vcHRpb25zLnB1c2goaSk7XG4gICAgc2V0dGluZ3MuaW5wdXRzLnJvb2YubGVuZ3RoLnVuaXRzID0gJ2Z0Lic7XG4gICAgc2V0dGluZ3MuaW5wdXRzLnJvb2YubGVuZ3RoLm5vdGUgPSAnVGhpcyB0aGUgZnVsbCBsZW5ndGggb2YgdGhlIHJvb2YsIG1lYXN1cmVkIGZyb20gbG93IHRvIGhpZ2guJztcbiAgICBzZXR0aW5ncy5pbnB1dHMucm9vZi5sZW5ndGgudHlwZSA9ICdudW1iZXJfaW5wdXQnO1xuICAgIHNldHRpbmdzLmlucHV0cy5yb29mLnNsb3BlID0ge307XG4gICAgc2V0dGluZ3MuaW5wdXRzLnJvb2Yuc2xvcGUub3B0aW9ucyA9IFsnMToxMicsJzI6MTInLCczOjEyJywnNDoxMicsJzU6MTInLCc2OjEyJywnNzoxMicsJzg6MTInLCc5OjEyJywnMTA6MTInLCcxMToxMicsJzEyOjEyJ107XG4gICAgc2V0dGluZ3MuaW5wdXRzLnJvb2YudHlwZSA9IHt9O1xuICAgIHNldHRpbmdzLmlucHV0cy5yb29mLnR5cGUub3B0aW9ucyA9IFsnR2FibGUnLCdTaGVkJywnSGlwcGVkJ107XG4gICAgc2V0dGluZ3MuaW5wdXRzLm1vZHVsZSA9IHt9O1xuICAgIHNldHRpbmdzLmlucHV0cy5tb2R1bGUubWFrZSA9IHt9O1xuICAgIC8vc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5tYWtlLm9wdGlvbnMgPSBudWxsO1xuICAgIHNldHRpbmdzLmlucHV0cy5tb2R1bGUubW9kZWwgPSB7fTtcbiAgICAvL3NldHRpbmdzLmlucHV0cy5tb2R1bGUubW9kZWwub3B0aW9ucyA9IG51bGw7XG4gICAgc2V0dGluZ3MuaW5wdXRzLm1vZHVsZS5vcmllbnRhdGlvbiA9IHt9O1xuICAgIHNldHRpbmdzLmlucHV0cy5tb2R1bGUub3JpZW50YXRpb24ub3B0aW9ucyA9IFsnUG9ydHJhaXQnLCdMYW5kc2NhcGUnXTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuYXJyYXkgPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nID0ge307XG4gICAgc2V0dGluZ3MuaW5wdXRzLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZy5vcHRpb25zID0gWzEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3LDE4LDE5LDIwXTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuYXJyYXkubnVtX3N0cmluZ3MgPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuYXJyYXkubnVtX3N0cmluZ3Mub3B0aW9ucyA9IFsxLDIsMyw0LDUsNl07XG4gICAgc2V0dGluZ3MuaW5wdXRzLkRDID0ge307XG4gICAgc2V0dGluZ3MuaW5wdXRzLkRDLmhvbWVfcnVuX2xlbmd0aCA9IHt9O1xuICAgIC8vc2V0dGluZ3MuaW5wdXRzLkRDLmhvbWVfcnVuX2xlbmd0aC5vcHRpb25zID0gWzI1LDUwLDc1LDEwMCwxMjUsMTUwXTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuREMuaG9tZV9ydW5fbGVuZ3RoLnR5cGUgPSAnbnVtYmVyX2lucHV0JztcbiAgICBzZXR0aW5ncy5pbnB1dHMuaW52ZXJ0ZXIgPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuaW52ZXJ0ZXIubWFrZSA9IHt9O1xuICAgIC8vc2V0dGluZ3MuaW5wdXRzLmludmVydGVyLm1ha2Uub3B0aW9ucyA9IG51bGw7XG4gICAgc2V0dGluZ3MuaW5wdXRzLmludmVydGVyLm1vZGVsID0ge307XG4gICAgc2V0dGluZ3MuaW5wdXRzLmludmVydGVyLmxvY2F0aW9uID0ge307XG4gICAgc2V0dGluZ3MuaW5wdXRzLmludmVydGVyLmxvY2F0aW9uLm9wdGlvbnMgPSBbJ0luc2lkZScsICdPdXRzaWRlJ107XG4gICAgLy9zZXR0aW5ncy5pbnB1dHMuaW52ZXJ0ZXIubW9kZWwub3B0aW9ucyA9IG51bGw7XG4gICAgc2V0dGluZ3MuaW5wdXRzLkFDID0ge307XG4gICAgc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXMgPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlc1snMjQwViddID0ge307XG4gICAgc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbJzI0MFYnXSA9IFsnMjQwVicsJzEyMFYnXTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlc1snMjA4LzEyMFYnXSA9IHt9O1xuICAgIHNldHRpbmdzLmlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzWycyMDgvMTIwViddID0gWycyMDhWJywnMTIwViddO1xuICAgIHNldHRpbmdzLmlucHV0cy5BQy5sb2FkY2VudGVyX3R5cGVzWyc0ODAvMjc3ViddID0ge307XG4gICAgc2V0dGluZ3MuaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbJzQ4MC8yNzdWJ10gPSBbJzQ4MFYgV3llJywnNDgwViBEZWx0YScsJzI3N1YnXTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuQUMudHlwZSA9IHt9O1xuICAgIC8vc2V0dGluZ3MuaW5wdXRzLkFDLnR5cGUub3B0aW9ucyA9IG51bGw7XG4gICAgc2V0dGluZ3MuaW5wdXRzLkFDLmRpc3RhbmNlX3RvX2xvYWRjZW50ZXIgPSB7fTtcbiAgICAvL3NldHRpbmdzLmlucHV0cy5BQy5kaXN0YW5jZV90b19sb2FkY2VudGVyLm9wdGlvbnMgPSBbMyw1LDEwLDE1LDIwLDMwXTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuQUMuZGlzdGFuY2VfdG9fbG9hZGNlbnRlci50eXBlID0gJ251bWJlcl9pbnB1dCc7XG5cbiAgICBzZXR0aW5ncy5pbnB1dHMuYXR0YWNobWVudF9zeXN0ZW0gPSB7fTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuYXR0YWNobWVudF9zeXN0ZW0ubWFrZSA9IHtcbiAgICAgICAgb3B0aW9uczogWydVTklSQUMnXSxcbiAgICAgICAgdHlwZTogJ3NlbGVjdCcsXG4gICAgfTtcbiAgICBzZXR0aW5ncy5pbnB1dHMuYXR0YWNobWVudF9zeXN0ZW0ubW9kZWwgPSB7XG4gICAgICAgIG9wdGlvbnM6IFsnU09MQVJNT1VOVCddLFxuICAgICAgICB0eXBlOiAnc2VsZWN0JyxcbiAgICB9O1xuXG5cblxuICAgIHNldHRpbmdzLnVzZXJfaW5wdXQgPSBmLmFkZF9zZWN0aW9ucyhzZXR0aW5ncy5pbnB1dHMpO1xuXG5cblxuXG4gICAgLy9zZXR0aW5ncy5pbnB1dHMgPSBzZXR0aW5ncy5pbnB1dHM7IC8vIGNvcHkgaW5wdXQgcmVmZXJlbmNlIHdpdGggb3B0aW9ucyB0byBpbnB1dHNcbiAgICAvL3NldHRpbmdzLmlucHV0cyA9IGYuYmxhbmtfY29weShzZXR0aW5ncy5pbnB1dHMpOyAvLyBtYWtlIGlucHV0IHNlY3Rpb24gYmxhbmtcbiAgICAvL3NldHRpbmdzLnN5c3RlbV9mb3JtdWxhcyA9IHNldHRpbmdzLnN5c3RlbTsgLy8gY29weSBzeXN0ZW0gcmVmZXJlbmNlIHRvIHN5c3RlbV9mb3JtdWxhc1xuICAgIHNldHRpbmdzLnN5c3RlbSA9IGYuYmxhbmtfY29weShzZXR0aW5ncy5pbnB1dHMpOyAvLyBtYWtlIHN5c3RlbSBzZWN0aW9uIGJsYW5rXG4gICAgLy9mLm1lcmdlX29iamVjdHMoIHNldHRpbmdzLmlucHV0cywgc2V0dGluZ3Muc3lzdGVtICk7XG5cblxuICAgIC8vIGxvYWQgbGF5ZXJzXG5cbiAgICBzZXR0aW5ncy5kcmF3aW5nID0ge307XG5cbiAgICBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzID0ge307XG4gICAgc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sYXllcl9hdHRyID0gcmVxdWlyZSgnLi9zZXR0aW5nc19sYXllcnMnKTtcbiAgICBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLmZvbnRzID0gcmVxdWlyZSgnLi9zZXR0aW5nc19mb250cycpO1xuXG4gICAgc2V0dGluZ3MuZHJhd2luZy5ibG9ja3MgPSB7fTtcblxuICAgIC8vIExvYWQgZHJhd2luZyBzcGVjaWZpYyBzZXR0aW5nc1xuICAgIC8vIFRPRE8gRml4IHNldHRpbmdzX2RyYXdpbmcgd2l0aCBuZXcgdmFyaWFibGUgbG9jYXRpb25zXG4gICAgdmFyIHNldHRpbmdzX2RyYXdpbmcgPSByZXF1aXJlKCcuL3NldHRpbmdzX2RyYXdpbmcnKTtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzX2RyYXdpbmcoc2V0dGluZ3MpO1xuXG4gICAgLy9zZXR0aW5ncy5zdGF0ZV9hcHAudmVyc2lvbl9zdHJpbmcgPSB2ZXJzaW9uX3N0cmluZztcblxuICAgIC8vc2V0dGluZ3MgPSBmLm51bGxUb09iamVjdChzZXR0aW5ncyk7XG5cbiAgICBzZXR0aW5ncy5zZWxlY3RfcmVnaXN0cnkgPSBbXTtcbiAgICAvL3NldHRpbmdzLnZhbHVlX3JlZ2lzdHJ5ID0gW107XG5cblxuICAgIC8vdmFyIGNvbmZpZ19vcHRpb25zID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnMgPSBzZXR0aW5ncy5jb25maWdfb3B0aW9ucyB8fCB7fTtcblxuICAgIHNldHRpbmdzLndlYnBhZ2UgPSB7fTtcbiAgICBzZXR0aW5ncy53ZWJwYWdlLnNlbGVjdGlvbnNfbWFudWFsX3RvZ2dsZWQgPSB7fTtcbiAgICBzZXR0aW5ncy53ZWJwYWdlLnNlY3Rpb25zID0gT2JqZWN0LmtleXMoc2V0dGluZ3MuaW5wdXRzKTtcblxuXG4gICAgc2V0dGluZ3Mud2VicGFnZS5zZWN0aW9ucy5mb3JFYWNoKCBmdW5jdGlvbihzZWN0aW9uX25hbWUpe1xuICAgICAgICBzZXR0aW5ncy53ZWJwYWdlLnNlbGVjdGlvbnNfbWFudWFsX3RvZ2dsZWRbc2VjdGlvbl9uYW1lXSA9IGZhbHNlO1xuICAgIH0pO1xuXG4gICAgc2V0dGluZ3Mud2VicGFnZS5zZWxlY3RlZF9tb2R1bGVzX3RvdGFsID0gMDtcbiAgICBzZXR0aW5ncy53ZWJwYWdlLnNlbGVjdGVkX21vZHVsZXMgPSB7fTtcblxuXG5cblxuICAgIHNldHRpbmdzLmNvbXBvbmVudHMgPSB7fTtcblxuXG5cblxuXG4gICAgLy8gTG9hZCBmdW5jdGlvbnMgYW5kIGFkZCB0aGVtIHRoZSB0aGUgZ2xvYmFsIG9iamVjdFxuICAgIGYuZyA9IHNldHRpbmdzO1xuICAgIHNldHRpbmdzLmYgPSBmO1xuXG5cblxuXG4gICAgLy8gTG9hZCBtb2R1bGVzXG5cbiAgICBmLnNldHVwX3dlYnBhZ2UgPSByZXF1aXJlKCcuL3NldHVwX3dlYnBhZ2UnKTtcblxuICAgIGYucHJvY2VzcyA9IHJlcXVpcmUoJy4vcHJvY2VzcycpO1xuICAgIGYuc2V0dGluZ3NfZGV2X2RlZmF1bHRzID0gcmVxdWlyZSgnLi9zZXR0aW5nc19kZXZfZGVmYXVsdHMnKTtcblxuXG4gICAgZi5ta19ibG9ja3MgPSByZXF1aXJlKCcuL21rX2Jsb2NrcycpO1xuXG4gICAgZi5ta19wYWdlID0ge307XG4gICAgZi5ta19wYWdlWzFdID0gcmVxdWlyZSgnLi9ta19wYWdlXzEnKTtcbiAgICBmLm1rX3BhZ2VbMl0gPSByZXF1aXJlKCcuL21rX3BhZ2VfMicpO1xuICAgIGYubWtfcGFnZVszXSA9IHJlcXVpcmUoJy4vbWtfcGFnZV8zJyk7XG4gICAgZi5ta19wYWdlWzRdID0gcmVxdWlyZSgnLi9ta19wYWdlXzQnKTtcblxuICAgIGYubWtfcHJldmlldyA9IHt9O1xuICAgIGYubWtfcHJldmlld1sxXSA9IHJlcXVpcmUoJy4vbWtfcGFnZV9wcmV2aWV3XzEnKTtcbiAgICBmLm1rX3ByZXZpZXdbMl0gPSByZXF1aXJlKCcuL21rX3BhZ2VfcHJldmlld18yJyk7XG5cbiAgICBmLm1rX3N2Zz0gcmVxdWlyZSgnLi9ta19zdmcnKTtcblxuXG4gICAgcmV0dXJuIHNldHRpbmdzO1xuXG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBta19zZXR0aW5ncztcbiIsIid1c2Ugc3RyaWN0Jztcbi8vdmFyIHNldHRpbmdzID0gcmVxdWlyZSgnLi9zZXR0aW5ncy5qcycpO1xuLy92YXIgc25hcHN2ZyA9IHJlcXVpcmUoJ3NuYXBzdmcnKTtcbi8vbG9nKHNldHRpbmdzKTtcblxuXG5cbnZhciBta19zdmcgPSBmdW5jdGlvbihkcmF3aW5nX3BhcnRzLCBkcmF3aW5nX3NpemUpe1xuICAgIC8vY29uc29sZS5sb2coJ2Rpc3BsYXlpbmcgc3ZnJyk7XG4gICAgLy9jb25zb2xlLmxvZygnZHJhd2luZ19wYXJ0czogJywgZHJhd2luZ19wYXJ0cyk7XG4gICAgLy9jb250YWluZXIuZW1wdHkoKVxuICAgIHZhciBsYXllcl9hdHRyID0gcmVxdWlyZSgnLi9zZXR0aW5nc19sYXllcnMnKTtcbiAgICB2YXIgZm9udHMgPSByZXF1aXJlKCcuL3NldHRpbmdzX2ZvbnRzJyk7XG5cbiAgICAvL3ZhciBzdmdfZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdTdmdqc1N2ZzEwMDAnKVxuICAgIHZhciBzdmdfZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdzdmcnKTtcbiAgICBzdmdfZWxlbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywnc3ZnX2RyYXdpbmcnKTtcbiAgICAvL3N2Z19lbGVtLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy53KTtcbiAgICAvL3N2Z19lbGVtLnNldEF0dHJpYnV0ZSgnaGVpZ2h0Jywgc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcuaCk7XG4gICAgdmFyIHZpZXdfYm94ID0gJzAgMCAnICsgZHJhd2luZ19zaXplLncgKyAnICcgKyBkcmF3aW5nX3NpemUuaCArICcgJztcbiAgICBzdmdfZWxlbS5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCB2aWV3X2JveCk7XG4gICAgLy92YXIgc3ZnID0gc25hcHN2ZyhzdmdfZWxlbSkuc2l6ZShzaXplLmRyYXdpbmcudywgc2l6ZS5kcmF3aW5nLmgpO1xuICAgIC8vdmFyIHN2ZyA9IHNuYXBzdmcoJyNzdmdfZHJhd2luZycpO1xuXG4gICAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0aGUgZHJhd2luZyBjb250ZW50cywgY2FsbCB0aGUgZnVuY3Rpb24gYmVsb3cuXG4gICAgZHJhd2luZ19wYXJ0cy5mb3JFYWNoKCBmdW5jdGlvbihlbGVtLGlkKSB7XG4gICAgICAgIHNob3dfZWxlbV9hcnJheShlbGVtKTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHNob3dfZWxlbV9hcnJheShlbGVtLCBvZmZzZXQpe1xuICAgICAgICBvZmZzZXQgPSBvZmZzZXQgfHwge3g6MCx5OjB9O1xuICAgICAgICB2YXIgeCx5LGF0dHJfbmFtZTtcbiAgICAgICAgaWYoIHR5cGVvZiBlbGVtLnggIT09ICd1bmRlZmluZWQnICkgeyB4ID0gZWxlbS54ICsgb2Zmc2V0Lng7IH1cbiAgICAgICAgaWYoIHR5cGVvZiBlbGVtLnkgIT09ICd1bmRlZmluZWQnICkgeyB5ID0gZWxlbS55ICsgb2Zmc2V0Lnk7IH1cblxuICAgICAgICB2YXIgYXR0cnMgPSBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV07XG4gICAgICAgIGlmKCBlbGVtLmF0dHJzICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gZWxlbS5hdHRycyApe1xuICAgICAgICAgICAgICAgIGF0dHJzW2F0dHJfbmFtZV0gPSBlbGVtLmF0dHJzW2F0dHJfbmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiggZWxlbS50eXBlID09PSAncmVjdCcpIHtcbiAgICAgICAgICAgIC8vc3ZnLnJlY3QoIGVsZW0udywgZWxlbS5oICkubW92ZSggeC1lbGVtLncvMiwgeS1lbGVtLmgvMiApLmF0dHIoIGxheWVyX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnZWxlbTonLCBlbGVtICk7XG4gICAgICAgICAgICAvL2lmKCBpc05hTihlbGVtLncpICkge1xuICAgICAgICAgICAgLy8gICAgY29uc29sZS5sb2coJ2Vycm9yOiBlbGVtIG5vdCBmdWxseSBkZWZpbmVkJywgZWxlbSlcbiAgICAgICAgICAgIC8vICAgIGVsZW0udyA9IDEwO1xuICAgICAgICAgICAgLy99XG4gICAgICAgICAgICAvL2lmKCBpc05hTihlbGVtLmgpICkge1xuICAgICAgICAgICAgLy8gICAgY29uc29sZS5sb2coJ2Vycm9yOiBlbGVtIG5vdCBmdWxseSBkZWZpbmVkJywgZWxlbSlcbiAgICAgICAgICAgIC8vICAgIGVsZW0uaCA9IDEwO1xuICAgICAgICAgICAgLy99XG4gICAgICAgICAgICB2YXIgciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdyZWN0Jyk7XG4gICAgICAgICAgICByLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBlbGVtLncpO1xuICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGVsZW0uaCk7XG4gICAgICAgICAgICByLnNldEF0dHJpYnV0ZSgneCcsIHgtZWxlbS53LzIpO1xuICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoJ3knLCB5LWVsZW0uaC8yKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZWxlbS5sYXllcl9uYW1lKTtcbiAgICAgICAgICAgIGZvciggYXR0cl9uYW1lIGluIGF0dHJzICl7XG4gICAgICAgICAgICAgICAgci5zZXRBdHRyaWJ1dGUoYXR0cl9uYW1lLCBhdHRyc1thdHRyX25hbWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN2Z19lbGVtLmFwcGVuZENoaWxkKHIpO1xuICAgICAgICB9IGVsc2UgaWYoIGVsZW0udHlwZSA9PT0gJ2xpbmUnKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnRzMiA9IFtdO1xuICAgICAgICAgICAgZWxlbS5wb2ludHMuZm9yRWFjaCggZnVuY3Rpb24ocG9pbnQpe1xuICAgICAgICAgICAgICAgIGlmKCAhIGlzTmFOKHBvaW50WzBdKSAmJiAhIGlzTmFOKHBvaW50WzFdKSApe1xuICAgICAgICAgICAgICAgICAgICBwb2ludHMyLnB1c2goWyBwb2ludFswXStvZmZzZXQueCwgcG9pbnRbMV0rb2Zmc2V0LnkgXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yOiBlbGVtIG5vdCBmdWxseSBkZWZpbmVkJywgZWxlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvL3N2Zy5wb2x5bGluZSggcG9pbnRzMiApLmF0dHIoIGxheWVyX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApO1xuXG4gICAgICAgICAgICB2YXIgbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICdwb2x5bGluZScpO1xuICAgICAgICAgICAgbC5zZXRBdHRyaWJ1dGUoICdwb2ludHMnLCBwb2ludHMyLmpvaW4oJyAnKSApO1xuICAgICAgICAgICAgZm9yKCBhdHRyX25hbWUgaW4gYXR0cnMgKXtcbiAgICAgICAgICAgICAgICBsLnNldEF0dHJpYnV0ZShhdHRyX25hbWUsIGF0dHJzW2F0dHJfbmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3ZnX2VsZW0uYXBwZW5kQ2hpbGQobCk7XG4gICAgICAgIH0gZWxzZSBpZiggZWxlbS50eXBlID09PSAncG9seScpIHtcbiAgICAgICAgICAgIHZhciBwb2ludHMyID0gW107XG4gICAgICAgICAgICBlbGVtLnBvaW50cy5mb3JFYWNoKCBmdW5jdGlvbihwb2ludCl7XG4gICAgICAgICAgICAgICAgaWYoICEgaXNOYU4ocG9pbnRbMF0pICYmICEgaXNOYU4ocG9pbnRbMV0pICl7XG4gICAgICAgICAgICAgICAgICAgIHBvaW50czIucHVzaChbIHBvaW50WzBdK29mZnNldC54LCBwb2ludFsxXStvZmZzZXQueSBdKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3I6IGVsZW0gbm90IGZ1bGx5IGRlZmluZWQnLCBlbGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vc3ZnLnBvbHlsaW5lKCBwb2ludHMyICkuYXR0ciggbGF5ZXJfYXR0cltlbGVtLmxheWVyX25hbWVdICk7XG5cbiAgICAgICAgICAgIHZhciBsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ3BvbHlsaW5lJyk7XG4gICAgICAgICAgICBsLnNldEF0dHJpYnV0ZSggJ3BvaW50cycsIHBvaW50czIuam9pbignICcpICk7XG4gICAgICAgICAgICBmb3IoIGF0dHJfbmFtZSBpbiBhdHRycyApe1xuICAgICAgICAgICAgICAgIGwuc2V0QXR0cmlidXRlKGF0dHJfbmFtZSwgYXR0cnNbYXR0cl9uYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdmdfZWxlbS5hcHBlbmRDaGlsZChsKTtcbiAgICAgICAgfSBlbHNlIGlmKCBlbGVtLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICAgICAgLy92YXIgdCA9IHN2Zy50ZXh0KCBlbGVtLnN0cmluZ3MgKS5tb3ZlKCBlbGVtLnBvaW50c1swXVswXSwgZWxlbS5wb2ludHNbMF1bMV0gKS5hdHRyKCBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV0gKVxuICAgICAgICAgICAgdmFyIGZvbnQ7XG4gICAgICAgICAgICBpZiggZWxlbS5mb250ICYmIGZvbnRzW2VsZW0uZm9udF0gKXtcbiAgICAgICAgICAgICAgICBmb250ID0gZm9udHNbZWxlbS5mb250XTtcbiAgICAgICAgICAgIH0gZWxzZSBpZihmb250c1thdHRycy5mb250XSl7XG4gICAgICAgICAgICAgICAgZm9udCA9IGZvbnRzW2F0dHJzLmZvbnRdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb250ID0gZm9udHNbJ2Jhc2UnXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKCBmb250ID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdGb250IG5vdCBmb3VuZCcsIGZvbnQsIGZvbnRzWydiYXNlJ11bJ2ZvbnQtc2l6ZSddKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCAndGV4dCcpO1xuICAgICAgICAgICAgaWYoZWxlbS5yb3RhdGVkKXtcbiAgICAgICAgICAgICAgICAvL3Quc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCBcInJvdGF0ZShcIiArIGVsZW0ucm90YXRlZCArIFwiIFwiICsgeCArIFwiIFwiICsgeSArIFwiKVwiICk7XG4gICAgICAgICAgICAgICAgdC5zZXRBdHRyaWJ1dGUoJ3RyYW5zZm9ybScsIFwicm90YXRlKFwiICsgZWxlbS5yb3RhdGVkICsgXCIgXCIgKyB4ICsgXCIgXCIgKyB5ICsgXCIpXCIgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9pZiggZm9udFsndGV4dC1hbmNob3InXSA9PT0gJ21pZGRsZScgKSB5ICs9IGZvbnRbJ2ZvbnQtc2l6ZSddKjEvMztcbiAgICAgICAgICAgICAgICB5ICs9IGZvbnRbJ2ZvbnQtc2l6ZSddKjEvMztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkeSA9IGZvbnRbJ2ZvbnQtc2l6ZSddKjEuNTtcbiAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCd4JywgeCk7XG4gICAgICAgICAgICAvL3Quc2V0QXR0cmlidXRlKCd5JywgeSArIGZvbnRbJ2ZvbnQtc2l6ZSddLzIgKTtcbiAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCd5JywgeS1keSApO1xuXG4gICAgICAgICAgICBmb3IoIGF0dHJfbmFtZSBpbiBhdHRycyApe1xuICAgICAgICAgICAgICAgIGlmKCBhdHRyX25hbWUgPT09ICdzdHJva2UnICkge1xuICAgICAgICAgICAgICAgICAgICB0LnNldEF0dHJpYnV0ZSggJ2ZpbGwnLCBhdHRyc1thdHRyX25hbWVdICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKCBhdHRyX25hbWUgPT09ICdmaWxsJyApIHtcbiAgICAgICAgICAgICAgICAgICAgLy90LnNldEF0dHJpYnV0ZSggJ3N0cm9rZScsICdub25lJyApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHQuc2V0QXR0cmlidXRlKCBhdHRyX25hbWUsIGF0dHJzW2F0dHJfbmFtZV0gKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciggYXR0cl9uYW1lIGluIGZvbnQgKXtcbiAgICAgICAgICAgICAgICB0LnNldEF0dHJpYnV0ZSggYXR0cl9uYW1lLCBmb250W2F0dHJfbmFtZV0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciggYXR0cl9uYW1lIGluIGVsZW0uc3RyaW5ncyApe1xuICAgICAgICAgICAgICAgIHZhciB0c3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsICd0c3BhbicpO1xuICAgICAgICAgICAgICAgIHRzcGFuLnNldEF0dHJpYnV0ZSgnZHknLCBkeSApO1xuICAgICAgICAgICAgICAgIHRzcGFuLnNldEF0dHJpYnV0ZSgneCcsIHgpO1xuICAgICAgICAgICAgICAgIHRzcGFuLmlubmVySFRNTCA9IGVsZW0uc3RyaW5nc1thdHRyX25hbWVdO1xuICAgICAgICAgICAgICAgIHQuYXBwZW5kQ2hpbGQodHNwYW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3ZnX2VsZW0uYXBwZW5kQ2hpbGQodCk7XG4gICAgICAgIH0gZWxzZSBpZiggZWxlbS50eXBlID09PSAnY2lyYycpIHtcbiAgICAgICAgICAgIHZhciBjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgJ2VsbGlwc2UnKTtcbiAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKCdyeCcsIGVsZW0uZC8yKTtcbiAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKCdyeScsIGVsZW0uZC8yKTtcbiAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKCdjeCcsIHgpO1xuICAgICAgICAgICAgYy5zZXRBdHRyaWJ1dGUoJ2N5JywgeSk7XG4gICAgICAgICAgICBmb3IoIGF0dHJfbmFtZSBpbiBhdHRycyApe1xuICAgICAgICAgICAgICAgIGMuc2V0QXR0cmlidXRlKGF0dHJfbmFtZSwgYXR0cnNbYXR0cl9uYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdmdfZWxlbS5hcHBlbmRDaGlsZChjKTtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICBjLmF0dHJpYnV0ZXMoIGxheWVyX2F0dHJbZWxlbS5sYXllcl9uYW1lXSApXG4gICAgICAgICAgICBjLmF0dHJpYnV0ZXMoe1xuICAgICAgICAgICAgICAgIHJ4OiA1LFxuICAgICAgICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgcnk6IDUsXG4gICAgICAgICAgICAgICAgY3g6IGVsZW0ucG9pbnRzWzBdWzBdLWVsZW0uZC8yLFxuICAgICAgICAgICAgICAgIGN5OiBlbGVtLnBvaW50c1swXVsxXS1lbGVtLmQvMlxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHZhciBjMiA9IHN2Zy5lbGxpcHNlKCBlbGVtLnIsIGVsZW0uciApXG4gICAgICAgICAgICBjMi5tb3ZlKCBlbGVtLnBvaW50c1swXVswXS1lbGVtLmQvMiwgZWxlbS5wb2ludHNbMF1bMV0tZWxlbS5kLzIgKVxuICAgICAgICAgICAgYzIuYXR0cih7cng6NSwgcnk6NX0pXG4gICAgICAgICAgICBjMi5hdHRyKCBsYXllcl9hdHRyW2VsZW0ubGF5ZXJfbmFtZV0gKVxuICAgICAgICAgICAgKi9cbiAgICAgICAgfSBlbHNlIGlmKGVsZW0udHlwZSA9PT0gJ2Jsb2NrJykge1xuICAgICAgICAgICAgLy8gaWYgaXQgaXMgYSBibG9jaywgcnVuIHRoaXMgZnVuY3Rpb24gdGhyb3VnaCBlYWNoIGVsZW1lbnQuXG4gICAgICAgICAgICBlbGVtLmRyYXdpbmdfcGFydHMuZm9yRWFjaCggZnVuY3Rpb24oYmxvY2tfZWxlbSxpZCl7XG4gICAgICAgICAgICAgICAgc2hvd19lbGVtX2FycmF5KGJsb2NrX2VsZW0sIHt4OngsIHk6eX0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN2Z19lbGVtO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IG1rX3N2ZztcbiIsIid1c2Ugc3RyaWN0JztcblxuXG52YXIgcHJvY2VzcyA9IGZ1bmN0aW9uKHNldHRpbmdzKSB7XG4gICAgdmFyIGYgPSBzZXR0aW5ncy5mO1xuXG4gICAgLy9jb3B5IGlucHV0cyBmcm9tIHNldHRpbmdzLmlucHV0IHRvIHNldHRpbmdzLnN5c3RlbS5cbiAgICBmLm1lcmdlX29iamVjdHMoc2V0dGluZ3MudXNlcl9pbnB1dCwgc2V0dGluZ3Muc3lzdGVtKTtcblxuXG4gICAgLy9jb25zb2xlLmxvZygnLS0tc2V0dGluZ3MtLS0nLCBzZXR0aW5ncyk7XG4gICAgdmFyIGNvbmZpZ19vcHRpb25zID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnM7XG4gICAgdmFyIHN5c3RlbSA9IHNldHRpbmdzLnN5c3RlbTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2M7XG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemU7XG4gICAgdmFyIHN0YXRlID0gc2V0dGluZ3Muc3RhdGU7XG5cbiAgICB2YXIgaW5wdXRzID0gc2V0dGluZ3MuaW5wdXRzO1xuXG5cblxuLy8gVXBkYXRlIHNldHRpbmdzIGFuZCBjYWxjdWxhdGlvbnNcblxuICAgIGlmKCBzdGF0ZS5kYXRhYmFzZV9sb2FkZWQgKXtcbiAgICAgICAgaW5wdXRzLkRDID0gc2V0dGluZ3MuaW5wdXRzLkRDIHx8IHt9O1xuICAgICAgICBpbnB1dHMuREMud2lyZV9zaXplID0gc2V0dGluZ3MuaW5wdXRzLkRDLndpcmVfc2l6ZSB8fCB7fTtcbiAgICAgICAgaW5wdXRzLkRDLndpcmVfc2l6ZS5vcHRpb25zID0gaW5wdXRzLkRDLndpcmVfc2l6ZS5vcHRpb25zIHx8IGYub2JqX25hbWVzKHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLk5FQ190YWJsZXNbJ0NoIDkgVGFibGUgOCBDb25kdWN0b3IgUHJvcGVydGllcyddKTtcblxuXG4gICAgfVxuXG5cblxuICAgIC8vY29uc29sZS5sb2coXCJwcm9jZXNzXCIpO1xuICAgIC8vY29uc29sZS5sb2coc3lzdGVtLm1vZHVsZS5tYWtlKTtcblxuICAgIGlucHV0cy5tb2R1bGUubWFrZS5vcHRpb25zID0gZi5vYmpfbmFtZXMoc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzKTtcbiAgICBpZiggc3lzdGVtLm1vZHVsZS5tYWtlICkge1xuICAgICAgICBpbnB1dHMubW9kdWxlLm1vZGVsLm9wdGlvbnMgID0gZi5vYmpfbmFtZXMoIHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tzeXN0ZW0ubW9kdWxlLm1ha2VdICk7XG4gICAgfVxuXG4gICAgaWYoIHN5c3RlbS5tb2R1bGUubW9kZWwgKSB7XG4gICAgICAgIHZhciBzcGVjcyA9IHNldHRpbmdzLmNvbXBvbmVudHMubW9kdWxlc1tzeXN0ZW0ubW9kdWxlLm1ha2VdW3N5c3RlbS5tb2R1bGUubW9kZWxdO1xuICAgICAgICBmb3IoIHZhciBzcGVjX25hbWUgaW4gc3BlY3MgKXtcbiAgICAgICAgICAgIGlmKCBzcGVjX25hbWUgIT09ICdtb2R1bGVfaWQnICl7XG4gICAgICAgICAgICAgICAgc3lzdGVtLm1vZHVsZVtzcGVjX25hbWVdID0gc3BlY3Nbc3BlY19uYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL3N5c3RlbS5tb2R1bGUuc3BlY3MgPSBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXNbc3lzdGVtLm1vZHVsZS5tYWtlXVtzeXN0ZW0ubW9kdWxlLm1vZGVsXTtcbiAgICB9XG5cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdhcnJheScpICYmIGYuc2VjdGlvbl9kZWZpbmVkKHNldHRpbmdzLCAnbW9kdWxlJykgKXtcbiAgICAgICAgc3lzdGVtLmFycmF5ID0gc3lzdGVtLmFycmF5IHx8IHt9O1xuICAgICAgICBzeXN0ZW0uYXJyYXkuaXNjID0gc3lzdGVtLm1vZHVsZS5pc2MgKiBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3M7XG4gICAgICAgIHN5c3RlbS5hcnJheS52b2MgPSBzeXN0ZW0ubW9kdWxlLnZvYyAqIHN5c3RlbS5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmc7XG4gICAgICAgIHN5c3RlbS5hcnJheS5pbXAgPSBzeXN0ZW0ubW9kdWxlLmltcCAqIHN5c3RlbS5hcnJheS5udW1fc3RyaW5ncztcbiAgICAgICAgc3lzdGVtLmFycmF5LnZtcCA9IHN5c3RlbS5tb2R1bGUudm1wICogc3lzdGVtLmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZztcbiAgICAgICAgc3lzdGVtLmFycmF5LnBtcCA9IHN5c3RlbS5hcnJheS52bXAgICogc3lzdGVtLmFycmF5LmltcDtcblxuICAgICAgICBzeXN0ZW0uYXJyYXkubnVtYmVyX29mX21vZHVsZXMgPSBzeXN0ZW0uYXJyYXkubW9kdWxlc19wZXJfc3RyaW5nICogc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzO1xuXG5cbiAgICB9XG5cblxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZChzZXR0aW5ncywgJ0RDJykgKXtcblxuICAgICAgICBzeXN0ZW0uREMud2lyZV9zaXplID0gXCItVW5kZWZpbmVkLVwiO1xuXG4gICAgfVxuXG4gICAgaW5wdXRzLmludmVydGVyLm1ha2Uub3B0aW9ucyA9IGYub2JqX25hbWVzKHNldHRpbmdzLmNvbXBvbmVudHMuaW52ZXJ0ZXJzKTtcbiAgICBpZiggc3lzdGVtLmludmVydGVyLm1ha2UgKSB7XG4gICAgICAgIGlucHV0cy5pbnZlcnRlci5tb2RlbC5vcHRpb25zID0gZi5vYmpfbmFtZXMoIHNldHRpbmdzLmNvbXBvbmVudHMuaW52ZXJ0ZXJzW3N5c3RlbS5pbnZlcnRlci5tYWtlXSApO1xuICAgIH1cbiAgICBpZiggZi5zZWN0aW9uX2RlZmluZWQoc2V0dGluZ3MsICdpbnZlcnRlcicpICl7XG5cbiAgICB9XG5cbiAgICAvL2lucHV0cy5BQy5sb2FkY2VudGVyX3R5cGUgPSBzZXR0aW5ncy5mLm9ial9uYW1lcyhpbnB1dHMuQUMubG9hZGNlbnRlcl90eXBlcyk7XG4gICAgaWYoIHN5c3RlbS5BQy5sb2FkY2VudGVyX3R5cGVzICkge1xuICAgICAgICB2YXIgbG9hZGNlbnRlcl90eXBlID0gc3lzdGVtLkFDLmxvYWRjZW50ZXJfdHlwZXM7XG4gICAgICAgIHZhciBBQ19vcHRpb25zID0gaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXNbbG9hZGNlbnRlcl90eXBlXTtcbiAgICAgICAgaW5wdXRzLkFDLnR5cGUub3B0aW9ucyA9IEFDX29wdGlvbnM7XG4gICAgICAgIC8vaW4ub3B0LkFDLnR5cGVzW2xvYWRjZW50ZXJfdHlwZV07XG5cbiAgICAgICAgLy9pbnB1dHMuQUNbJ3R5cGUnXSA9IGYub2JqX25hbWVzKCBzZXR0aW5ncy5pbi5vcHQuQUMudHlwZSApO1xuICAgIH1cbiAgICBpZiggc3lzdGVtLkFDLnR5cGUgKSB7XG4gICAgICAgIHN5c3RlbS5BQy5jb25kdWN0b3JzID0gc2V0dGluZ3MuaW4ub3B0LkFDLnR5cGVzW3N5c3RlbS5BQy50eXBlXTtcbiAgICAgICAgc3lzdGVtLkFDLm51bV9jb25kdWN0b3JzID0gc3lzdGVtLkFDLmNvbmR1Y3RvcnMubGVuZ3RoO1xuXG4gICAgfVxuICAgIGlmKCBmLnNlY3Rpb25fZGVmaW5lZChzZXR0aW5ncywgJ0FDJykgKXtcblxuICAgICAgICBzeXN0ZW0uQUMud2lyZV9zaXplID0gXCItVW5kZWZpbmVkLVwiO1xuICAgIH1cblxuICAgIHNpemUud2lyZV9vZmZzZXQubWF4ID0gc2l6ZS53aXJlX29mZnNldC5taW4gKyBzeXN0ZW0uYXJyYXkubnVtX3N0cmluZ3MgKiBzaXplLndpcmVfb2Zmc2V0LmJhc2U7XG4gICAgc2l6ZS53aXJlX29mZnNldC5ncm91bmQgPSBzaXplLndpcmVfb2Zmc2V0Lm1heCArIHNpemUud2lyZV9vZmZzZXQuYmFzZSoxO1xuICAgIGxvYy5hcnJheS5sZWZ0ID0gbG9jLmFycmF5LnJpZ2h0IC0gKCBzaXplLnN0cmluZy53ICogc3lzdGVtLmFycmF5Lm51bV9zdHJpbmdzICkgLSAoIHNpemUubW9kdWxlLmZyYW1lLncqMy80ICkgO1xuXG5cblxuXG4gICAgaWYoIGYuc2VjdGlvbl9kZWZpbmVkKHNldHRpbmdzLCAnbG9jYXRpb24nKSApe1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdhZGRyZXNzIHJlYWR5Jyk7XG4gICAgICAgIC8vZi5yZXF1ZXN0X2dlb2NvZGUoKTtcbiAgICAgICAgc2V0dGluZ3MucGVybS5sb2NhdGlvbi5uZXdfYWRkcmVzcyA9IGZhbHNlO1xuICAgICAgICBmb3IoIHZhciBuYW1lIGluIHNldHRpbmdzLnN5c3RlbS5sb2NhdGlvbiApe1xuICAgICAgICAgICAgaWYoIHNldHRpbmdzLnN5c3RlbS5sb2NhdGlvbltuYW1lXSAhPT0gc2V0dGluZ3MucGVybS5sb2NhdGlvbltuYW1lXSl7XG4gICAgICAgICAgICAgICAgc2V0dGluZ3MucGVybS5sb2NhdGlvbi5uZXdfYWRkcmVzcyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXR0aW5ncy5wZXJtLmxvY2F0aW9uW25hbWVdID0gc2V0dGluZ3Muc3lzdGVtLmxvY2F0aW9uW25hbWVdO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuXG5cblxuLy8gVXBkYXRlIGRyYXdpbmdcblxuICAgIC8vIE1ha2UgYmxvY2tzXG4gICAgZi5ta19ibG9ja3Moc2V0dGluZ3MpO1xuXG5cbiAgICAvLyBNYWtlIGRyYXdpbmdcbiAgICB2YXIgcDtcblxuICAgIC8vIE5vdCBuZWVkZWQgb24gc2VydmVyXG4gICAgc2V0dGluZ3MuZHJhd2luZy5wcmV2aWV3X3BhcnRzID0ge307XG4gICAgc2V0dGluZ3MuZHJhd2luZy5wcmV2aWV3X3N2Z3MgPSB7fTtcbiAgICBmb3IoIHAgaW4gZi5ta19wcmV2aWV3ICl7ICAvLyBmLm1rX3BhZ2UgaXMgYSBhcnJheSBvZiBwYWdlIG1ha2luZyBmdW5jdGlvbnMsIHNvIHRoaXMgd2lsbCBsb29wIHRocm91Z2ggdGhlIG51bWJlciBvZiBwYWdlc1xuICAgICAgICBzZXR0aW5ncy5kcmF3aW5nLnByZXZpZXdfcGFydHNbcF0gPSBmLm1rX3ByZXZpZXdbcF0oc2V0dGluZ3MpO1xuICAgIH1cblxuICAgIHNldHRpbmdzLmRyYXdpbmcucGFydHMgPSB7fTtcbiAgICBzZXR0aW5ncy5kcmF3aW5nLnN2Z3MgPSB7fTtcbiAgICBmb3IoIHAgaW4gZi5ta19wYWdlICl7ICAvLyBmLm1rX3BhZ2UgaXMgYSBhcnJheSBvZiBwYWdlIG1ha2luZyBmdW5jdGlvbnMsIHNvIHRoaXMgd2lsbCBsb29wIHRocm91Z2ggdGhlIG51bWJlciBvZiBwYWdlc1xuICAgICAgICBzZXR0aW5ncy5kcmF3aW5nLnBhcnRzW3BdID0gZi5ta19wYWdlW3BdKHNldHRpbmdzKTtcbiAgICB9XG5cblxufTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gcHJvY2VzcztcbiIsIid1c2Ugc3RyaWN0JztcblxuXG52YXIgc2V0dGluZ3NfZGV2X2RlZmF1bHRzID0gZnVuY3Rpb24oc2V0dGluZ3MpIHtcbiAgICBjb25zb2xlLmxvZygnRGV2IG1vZGUgLSBkZWZhdWx0cyBvbicpO1xuXG4gICAgLy9jb25zb2xlLmxvZygnLS0tc2V0dGluZ3MtLS0nLCBzZXR0aW5ncyk7XG4gICAgdmFyIGNvbmZpZ19vcHRpb25zID0gc2V0dGluZ3MuY29uZmlnX29wdGlvbnM7XG4gICAgdmFyIGlucHV0cyA9IHNldHRpbmdzLmlucHV0cztcbiAgICB2YXIgdXNlcl9pbnB1dCA9IHNldHRpbmdzLnVzZXJfaW5wdXQ7XG4gICAgdmFyIGxvYyA9IHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3MubG9jO1xuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplO1xuICAgIHZhciBzdGF0ZSA9IHNldHRpbmdzLnN0YXRlO1xuXG4gICAgaWYoIHN0YXRlLmRhdGFiYXNlX2xvYWRlZCApe1xuICAgICAgICBpbnB1dHMuREMgPSBzZXR0aW5ncy5pbnB1dHMuREMgfHwge307XG4gICAgICAgIGlucHV0cy5EQy53aXJlX3NpemUgPSBzZXR0aW5ncy5pbnB1dHMuREMud2lyZV9zaXplIHx8IHt9O1xuICAgICAgICBpbnB1dHMuREMud2lyZV9zaXplLm9wdGlvbnMgPSBpbnB1dHMuREMud2lyZV9zaXplLm9wdGlvbnMgfHwgZy5mLm9ial9uYW1lcyhzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5ORUNfdGFibGVzWydDaCA5IFRhYmxlIDggQ29uZHVjdG9yIFByb3BlcnRpZXMnXSk7XG5cblxuICAgIH1cblxuICAgIHVzZXJfaW5wdXQuYXJyYXkubnVtX3N0cmluZ3MgPSB1c2VyX2lucHV0LmFycmF5Lm51bV9zdHJpbmdzIHx8IDQ7XG4gICAgdXNlcl9pbnB1dC5hcnJheS5tb2R1bGVzX3Blcl9zdHJpbmcgPSB1c2VyX2lucHV0LmFycmF5Lm1vZHVsZXNfcGVyX3N0cmluZyB8fCA2O1xuICAgIHVzZXJfaW5wdXQuREMuaG9tZV9ydW5fbGVuZ3RoID0gdXNlcl9pbnB1dC5EQy5ob21lX3J1bl9sZW5ndGggfHwgNTA7XG5cbiAgICB1c2VyX2lucHV0LnJvb2Yud2lkdGggID0gdXNlcl9pbnB1dC5yb29mLndpZHRoIHx8IDYwO1xuICAgIHVzZXJfaW5wdXQucm9vZi5sZW5ndGggPSB1c2VyX2lucHV0LnJvb2YubGVuZ3RoIHx8IDI1O1xuICAgIHVzZXJfaW5wdXQucm9vZi5zbG9wZSAgPSB1c2VyX2lucHV0LnJvb2Yuc2xvcGUgfHwgXCI2OjEyXCI7XG4gICAgdXNlcl9pbnB1dC5yb29mLnR5cGUgICA9IHVzZXJfaW5wdXQucm9vZi50eXBlIHx8IFwiR2FibGVcIjtcblxuICAgIHVzZXJfaW5wdXQuaW52ZXJ0ZXIubG9jYXRpb24gPSB1c2VyX2lucHV0LmludmVydGVyLmxvY2F0aW9uICB8fCBcIkluc2lkZVwiO1xuXG4gICAgdXNlcl9pbnB1dC5tb2R1bGUub3JpZW50YXRpb24gPSB1c2VyX2lucHV0Lm1vZHVsZS5vcmllbnRhdGlvbiB8fCBcIlBvcnRyYWl0XCI7XG5cbiAgICB1c2VyX2lucHV0LmxvY2F0aW9uLmFkZHJlc3MgPSB1c2VyX2lucHV0LmxvY2F0aW9uLmFkZHJlc3MgfHwgJzE2NzkgQ2xlYXJsYWtlIFJvYWQnO1xuICAgIHVzZXJfaW5wdXQubG9jYXRpb24uY2l0eSAgICA9IHVzZXJfaW5wdXQubG9jYXRpb24uY2l0eSB8fCAnQ29jb2EnO1xuICAgIHVzZXJfaW5wdXQubG9jYXRpb24uemlwICAgICA9IHVzZXJfaW5wdXQubG9jYXRpb24uemlwIHx8ICczMjkyMic7XG4gICAgdXNlcl9pbnB1dC5sb2NhdGlvbi5jb3VudHkgICA9IHVzZXJfaW5wdXQubG9jYXRpb24uY291bnR5IHx8ICdCcmV2YXJkJztcblxuXG4gICAgaWYoIHN0YXRlLmRhdGFiYXNlX2xvYWRlZCApe1xuXG4gICAgICAgIHVzZXJfaW5wdXQubW9kdWxlLm1ha2UgPSB1c2VyX2lucHV0Lm1vZHVsZS5tYWtlIHx8XG4gICAgICAgICAgICBnLmYub2JqX25hbWVzKCBzZXR0aW5ncy5jb21wb25lbnRzLm1vZHVsZXMgKVswXTtcbiAgICAgICAgdXNlcl9pbnB1dC5tb2R1bGUubW9kZWwgPSB1c2VyX2lucHV0Lm1vZHVsZS5tb2RlbCB8fFxuICAgICAgICAgICAgZy5mLm9ial9uYW1lcyggc2V0dGluZ3MuY29tcG9uZW50cy5tb2R1bGVzW3VzZXJfaW5wdXQubW9kdWxlLm1ha2VdIClbMF07XG5cbiAgICAgICAgdXNlcl9pbnB1dC5pbnZlcnRlci5tYWtlID0gdXNlcl9pbnB1dC5pbnZlcnRlci5tYWtlIHx8XG4gICAgICAgICAgICBnLmYub2JqX25hbWVzKCBzZXR0aW5ncy5jb21wb25lbnRzLmludmVydGVycyApWzBdO1xuICAgICAgICB1c2VyX2lucHV0LmludmVydGVyLm1vZGVsID0gdXNlcl9pbnB1dC5pbnZlcnRlci5tb2RlbCB8fFxuICAgICAgICAgICAgZy5mLm9ial9uYW1lcyggc2V0dGluZ3MuY29tcG9uZW50cy5pbnZlcnRlcnNbdXNlcl9pbnB1dC5pbnZlcnRlci5tYWtlXSApWzBdO1xuXG5cbiAgICAgICAgdXNlcl9pbnB1dC5BQy5sb2FkY2VudGVyX3R5cGVzID0gdXNlcl9pbnB1dC5BQy5sb2FkY2VudGVyX3R5cGVzIHx8XG4gICAgICAgIC8vICAgIGcuZi5vYmpfbmFtZXMoaW5wdXRzLkFDLmxvYWRjZW50ZXJfdHlwZXMpWzBdO1xuICAgICAgICAgICAgJzQ4MC8yNzdWJztcblxuXG4gICAgICAgIHVzZXJfaW5wdXQuQUMudHlwZSA9IHVzZXJfaW5wdXQuQUMudHlwZSB8fCAnNDgwViBXeWUnO1xuICAgICAgICAvL3N5c3RlbS5BQy50eXBlID0gdXNlcl9pbnB1dC5BQy50eXBlIHx8XG4gICAgICAgIC8vICAgIHVzZXJfaW5wdXQuQUMubG9hZGNlbnRlcl90eXBlc1tzeXN0ZW0uQUMubG9hZGNlbnRlcl90eXBlc11bMF07XG5cbiAgICAgICAgdXNlcl9pbnB1dC5BQy5kaXN0YW5jZV90b19sb2FkY2VudGVyID0gdXNlcl9pbnB1dC5BQy5kaXN0YW5jZV90b19sb2FkY2VudGVyIHx8XG4gICAgICAgICAgICA1MDtcblxuXG4gICAgICAgIHVzZXJfaW5wdXQuREMud2lyZV9zaXplID0gaW5wdXRzLkRDLndpcmVfc2l6ZS5vcHRpb25zWzNdO1xuICAgICAgICAvKlxuXG4gICAgICAgIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyTWFrZUFycmF5ID0gay5vYmpJZEFycmF5KHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVycyk7XG4gICAgICAgIHVzZXJfaW5wdXQuaW52ZXJ0ZXIubWFrZSA9IHVzZXJfaW5wdXQuaW52ZXJ0ZXIubWFrZSB8fCBPYmplY3Qua2V5cyggc2V0dGluZ3MuY29uZmlnX29wdGlvbnMuaW52ZXJ0ZXJzIClbMF07XG4gICAgICAgIHNldHRpbmdzLmNvbmZpZ19vcHRpb25zLmludmVydGVyTW9kZWxBcnJheSA9IGsub2JqSWRBcnJheShzZXR0aW5ncy5jb25maWdfb3B0aW9ucy5pbnZlcnRlcnNbc3lzdGVtLmludmVydGVyLm1ha2VdKTtcblxuICAgICAgICB1c2VyX2lucHV0LkFDX2xvYWRjZW50ZXJfdHlwZSA9IHVzZXJfaW5wdXQuQUNfbG9hZGNlbnRlcl90eXBlIHx8IGNvbmZpZ19vcHRpb25zLkFDX2xvYWRjZW50ZXJfdHlwZV9vcHRpb25zWzBdO1xuICAgICAgICAvLyovXG5cblxuICAgICAgICB1c2VyX2lucHV0LmF0dGFjaG1lbnRfc3lzdGVtLm1ha2UgPSB1c2VyX2lucHV0LmF0dGFjaG1lbnRfc3lzdGVtLm1ha2UgfHxcbiAgICAgICAgICAgIGlucHV0cy5hdHRhY2htZW50X3N5c3RlbS5tYWtlLm9wdGlvbnNbMF07XG4gICAgICAgIHVzZXJfaW5wdXQuYXR0YWNobWVudF9zeXN0ZW0ubW9kZWwgPSB1c2VyX2lucHV0LmF0dGFjaG1lbnRfc3lzdGVtLm1vZGVsIHx8XG4gICAgICAgICAgICBpbnB1dHMuYXR0YWNobWVudF9zeXN0ZW0ubW9kZWwub3B0aW9uc1swXTtcblxuICAgIH1cblxuXG5cblxuXG59O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBzZXR0aW5nc19kZXZfZGVmYXVsdHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gc2V0dGluZ3NfZHJhd2luZyhzZXR0aW5ncyl7XG5cbiAgICB2YXIgc3lzdGVtID0gc2V0dGluZ3Muc3lzdGVtO1xuICAgIHZhciBzdGF0dXMgPSBzZXR0aW5ncy5zdGF0dXM7XG5cbiAgICAvLyBEcmF3aW5nIHNwZWNpZmljXG4gICAgLy9zZXR0aW5ncy5kcmF3aW5nID0gc2V0dGluZ3MuZHJhd2luZyB8fCB7fTtcblxuXG4gICAgdmFyIHNpemUgPSBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUgPSB7fTtcbiAgICB2YXIgbG9jID0gc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5sb2MgPSB7fTtcblxuXG4gICAgLy8gc2l6ZXNcbiAgICBzaXplLmRyYXdpbmcgPSB7XG4gICAgICAgIHc6IDEwMDAsXG4gICAgICAgIGg6IDc4MCxcbiAgICAgICAgZnJhbWVfcGFkZGluZzogNSxcbiAgICAgICAgdGl0bGVib3g6IDUwLFxuICAgIH07XG5cbiAgICBzaXplLm1vZHVsZSA9IHt9O1xuICAgIHNpemUubW9kdWxlLmZyYW1lID0ge1xuICAgICAgICB3OiAxMCxcbiAgICAgICAgaDogMzAsXG4gICAgfTtcbiAgICBzaXplLm1vZHVsZS5sZWFkID0gc2l6ZS5tb2R1bGUuZnJhbWUudyoyLzM7XG4gICAgc2l6ZS5tb2R1bGUuaCA9IHNpemUubW9kdWxlLmZyYW1lLmggKyBzaXplLm1vZHVsZS5sZWFkKjI7XG4gICAgc2l6ZS5tb2R1bGUudyA9IHNpemUubW9kdWxlLmZyYW1lLnc7XG5cbiAgICBzaXplLndpcmVfb2Zmc2V0ID0ge1xuICAgICAgICBiYXNlOiA3LFxuICAgICAgICBnYXA6IHNpemUubW9kdWxlLncsXG4gICAgfTtcbiAgICBzaXplLndpcmVfb2Zmc2V0Lm1pbiA9IHNpemUud2lyZV9vZmZzZXQuYmFzZSAqIDE7XG5cbiAgICBzaXplLnN0cmluZyA9IHt9O1xuICAgIHNpemUuc3RyaW5nLmdhcCA9IHNpemUubW9kdWxlLmZyYW1lLncvNDI7XG4gICAgc2l6ZS5zdHJpbmcuZ2FwX21pc3NpbmcgPSBzaXplLm1vZHVsZS5oO1xuICAgIHNpemUuc3RyaW5nLncgPSBzaXplLm1vZHVsZS5mcmFtZS53ICogMi41O1xuXG4gICAgc2l6ZS50ZXJtaW5hbF9kaWFtID0gNTtcbiAgICBzaXplLmZ1c2UgPSB7fTtcbiAgICBzaXplLmZ1c2UudyA9IDE1O1xuICAgIHNpemUuZnVzZS5oID0gNDtcblxuXG4gICAgLy8gSW52ZXJ0ZXJcbiAgICBzaXplLmludmVydGVyID0geyB3OiAyNTAsIGg6IDE1MCB9O1xuICAgIHNpemUuaW52ZXJ0ZXIudGV4dF9nYXAgPSAxNTtcbiAgICBzaXplLmludmVydGVyLnN5bWJvbF93ID0gNTA7XG4gICAgc2l6ZS5pbnZlcnRlci5zeW1ib2xfaCA9IDI1O1xuXG4gICAgbG9jLmludmVydGVyID0ge1xuICAgICAgICB4OiBzaXplLmRyYXdpbmcudy8yLFxuICAgICAgICB5OiBzaXplLmRyYXdpbmcuaC8zLFxuICAgIH07XG4gICAgbG9jLmludmVydGVyLmJvdHRvbSA9IGxvYy5pbnZlcnRlci55ICsgc2l6ZS5pbnZlcnRlci5oLzI7XG4gICAgbG9jLmludmVydGVyLnRvcCA9IGxvYy5pbnZlcnRlci55IC0gc2l6ZS5pbnZlcnRlci5oLzI7XG4gICAgbG9jLmludmVydGVyLmJvdHRvbV9yaWdodCA9IHtcbiAgICAgICAgeDogbG9jLmludmVydGVyLnggKyBzaXplLmludmVydGVyLncvMixcbiAgICAgICAgeTogbG9jLmludmVydGVyLnkgKyBzaXplLmludmVydGVyLmgvMixcbiAgICB9O1xuXG4gICAgLy8gYXJyYXlcbiAgICBsb2MuYXJyYXkgPSB7XG4gICAgICAgIHg6IGxvYy5pbnZlcnRlci54IC0gMjAwLFxuICAgICAgICB1cHBlcjogbG9jLmludmVydGVyLnkgLSAyMCxcbiAgICB9O1xuICAgIC8vbG9jLmFycmF5LnVwcGVyID0gbG9jLmFycmF5LnkgLSBzaXplLnN0cmluZy5oLzI7XG4gICAgbG9jLmFycmF5LnJpZ2h0ID0gbG9jLmFycmF5LnggLSBzaXplLm1vZHVsZS5mcmFtZS5oKjM7XG5cblxuXG5cbiAgICBsb2MuREMgPSBsb2MuYXJyYXk7XG5cbiAgICAvLyBEQyBqYlxuICAgIHNpemUuamJfYm94ID0ge1xuICAgICAgICBoOiAxNTAsXG4gICAgICAgIHc6IDgwLFxuICAgIH07XG4gICAgbG9jLmpiX2JveCA9IHtcbiAgICAgICAgeDogMzUwLFxuICAgICAgICB5OiA1NTAsXG4gICAgfTtcblxuICAgIC8vIERDIGRpY29uZWN0XG4gICAgc2l6ZS5kaXNjYm94ID0ge1xuICAgICAgICB3OiAxNDAsXG4gICAgICAgIGg6IDUwLFxuICAgIH07XG4gICAgbG9jLmRpc2Nib3ggPSB7XG4gICAgICAgIHg6IGxvYy5pbnZlcnRlci54IC0gc2l6ZS5pbnZlcnRlci53LzIgKyBzaXplLmRpc2Nib3gudy8yLFxuICAgICAgICB5OiBsb2MuaW52ZXJ0ZXIueSArIHNpemUuaW52ZXJ0ZXIuaC8yICsgc2l6ZS5kaXNjYm94LmgvMiArIDEwLFxuICAgIH07XG5cbiAgICAvLyBBQyBkaWNvbmVjdFxuICAgIHNpemUuQUNfZGlzYyA9IHsgdzogODAsIGg6IDEyNSB9O1xuXG4gICAgbG9jLkFDX2Rpc2MgPSB7XG4gICAgICAgIHg6IGxvYy5pbnZlcnRlci54KzIwMCxcbiAgICAgICAgeTogbG9jLmludmVydGVyLnkrMjUwXG4gICAgfTtcbiAgICBsb2MuQUNfZGlzYy5ib3R0b20gPSBsb2MuQUNfZGlzYy55ICsgc2l6ZS5BQ19kaXNjLmgvMjtcbiAgICBsb2MuQUNfZGlzYy50b3AgPSBsb2MuQUNfZGlzYy55IC0gc2l6ZS5BQ19kaXNjLmgvMjtcbiAgICBsb2MuQUNfZGlzYy5sZWZ0ID0gbG9jLkFDX2Rpc2MueCAtIHNpemUuQUNfZGlzYy53LzI7XG4gICAgbG9jLkFDX2Rpc2Muc3dpdGNoX3RvcCA9IGxvYy5BQ19kaXNjLnRvcCArIDE1O1xuICAgIGxvYy5BQ19kaXNjLnN3aXRjaF9ib3R0b20gPSBsb2MuQUNfZGlzYy5zd2l0Y2hfdG9wICsgMzA7XG5cblxuICAgIC8vIEFDIHBhbmVsXG5cbiAgICBsb2MuQUNfbG9hZGNlbnRlciA9IHtcbiAgICAgICAgeDogbG9jLmludmVydGVyLngrMzUwLFxuICAgICAgICB5OiBsb2MuaW52ZXJ0ZXIueSsxMDBcbiAgICB9O1xuICAgIHNpemUuQUNfbG9hZGNlbnRlciA9IHsgdzogMTI1LCBoOiAzMDAgfTtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5sZWZ0ID0gbG9jLkFDX2xvYWRjZW50ZXIueCAtIHNpemUuQUNfbG9hZGNlbnRlci53LzI7XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIudG9wID0gbG9jLkFDX2xvYWRjZW50ZXIueSAtIHNpemUuQUNfbG9hZGNlbnRlci5oLzI7XG5cblxuICAgIHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyID0geyB3OiAyMCwgaDogc2l6ZS50ZXJtaW5hbF9kaWFtLCB9O1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLmJyZWFrZXJzID0ge1xuICAgICAgICBsZWZ0OiBsb2MuQUNfbG9hZGNlbnRlci54IC0gKCBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlci53ICogMS4xICksXG4gICAgfTtcbiAgICBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMgPSB7XG4gICAgICAgIG51bTogMjAsXG4gICAgICAgIHNwYWNpbmc6IHNpemUuQUNfbG9hZGNlbnRlci5icmVha2VyLmggKyAxLFxuICAgIH07XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMudG9wID0gbG9jLkFDX2xvYWRjZW50ZXIudG9wICsgc2l6ZS5BQ19sb2FkY2VudGVyLmgvNTtcbiAgICBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy5ib3R0b20gPSBsb2MuQUNfbG9hZGNlbnRlci5icmVha2Vycy50b3AgKyBzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMuc3BhY2luZypzaXplLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMubnVtO1xuXG5cbiAgICBzaXplLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhciA9IHsgdzo1LCBoOjQwIH07XG4gICAgbG9jLkFDX2xvYWRjZW50ZXIubmV1dHJhbGJhciA9IHtcbiAgICAgICAgeDogbG9jLkFDX2xvYWRjZW50ZXIubGVmdCArIDIwLFxuICAgICAgICB5OiBsb2MuQUNfbG9hZGNlbnRlci55ICsgc2l6ZS5BQ19sb2FkY2VudGVyLmgqMC4zXG4gICAgfTtcblxuICAgIHNpemUuQUNfbG9hZGNlbnRlci5ncm91bmRiYXIgPSB7IHc6NDAsIGg6NSB9O1xuICAgIGxvYy5BQ19sb2FkY2VudGVyLmdyb3VuZGJhciA9IHtcbiAgICAgICAgeDogbG9jLkFDX2xvYWRjZW50ZXIueCArIDEwLFxuICAgICAgICB5OiBsb2MuQUNfbG9hZGNlbnRlci55ICsgc2l6ZS5BQ19sb2FkY2VudGVyLmgqMC40NVxuICAgIH07XG5cbiAgICBsb2MuQUNfY29uZHVpdCA9IHtcbiAgICAgICAgeTogbG9jLkFDX2xvYWRjZW50ZXIuYnJlYWtlcnMuYm90dG9tIC0gc2l6ZS5BQ19sb2FkY2VudGVyLmJyZWFrZXJzLnNwYWNpbmcvMixcbiAgICB9O1xuXG5cbiAgICAvLyB3aXJlIHRhYmxlXG4gICAgbG9jLndpcmVfdGFibGUgPSB7XG4gICAgICAgIHg6IHNpemUuZHJhd2luZy53IC0gc2l6ZS5kcmF3aW5nLnRpdGxlYm94IC0gc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmcqMyAtIDMyNSxcbiAgICAgICAgeTogc2l6ZS5kcmF3aW5nLmZyYW1lX3BhZGRpbmcqMyxcbiAgICB9O1xuXG4gICAgLy8gdm9sdGFnZSBkcm9wIHRhYmxlXG4gICAgc2l6ZS52b2x0X2Ryb3BfdGFibGUgPSB7fTtcbiAgICBzaXplLnZvbHRfZHJvcF90YWJsZS53ID0gMTUwO1xuICAgIHNpemUudm9sdF9kcm9wX3RhYmxlLmggPSAxMDA7XG4gICAgbG9jLnZvbHRfZHJvcF90YWJsZSA9IHt9O1xuICAgIGxvYy52b2x0X2Ryb3BfdGFibGUueCA9IHNpemUuZHJhd2luZy53IC0gc2l6ZS52b2x0X2Ryb3BfdGFibGUudy8yIC0gOTA7XG4gICAgbG9jLnZvbHRfZHJvcF90YWJsZS55ID0gc2l6ZS5kcmF3aW5nLmggLSBzaXplLnZvbHRfZHJvcF90YWJsZS5oLzIgLSAzMDtcblxuXG4gICAgLy8gdm9sdGFnZSBkcm9wIHRhYmxlXG4gICAgc2l6ZS5nZW5lcmFsX25vdGVzID0ge307XG4gICAgc2l6ZS5nZW5lcmFsX25vdGVzLncgPSAxNTA7XG4gICAgc2l6ZS5nZW5lcmFsX25vdGVzLmggPSAxMDA7XG4gICAgbG9jLmdlbmVyYWxfbm90ZXMgPSB7fTtcbiAgICBsb2MuZ2VuZXJhbF9ub3Rlcy54ID0gc2l6ZS5nZW5lcmFsX25vdGVzLncvMiArIDMwO1xuICAgIGxvYy5nZW5lcmFsX25vdGVzLnkgPSBzaXplLmdlbmVyYWxfbm90ZXMuaC8yICsgMzA7XG5cblxuXG5cbiAgICBzZXR0aW5ncy5wYWdlcyA9IHt9O1xuICAgIHNldHRpbmdzLnBhZ2VzLmxldHRlciA9IHtcbiAgICAgICAgdW5pdHM6ICdpbmNoZXMnLFxuICAgICAgICB3OiAxMS4wLFxuICAgICAgICBoOiA4LjUsXG4gICAgfTtcbiAgICBzZXR0aW5ncy5wYWdlID0gc2V0dGluZ3MucGFnZXMubGV0dGVyO1xuXG4gICAgc2V0dGluZ3MucGFnZXMuUERGID0ge1xuICAgICAgICB3OiBzZXR0aW5ncy5wYWdlLncgKiA3MixcbiAgICAgICAgaDogc2V0dGluZ3MucGFnZS5oICogNzIsXG4gICAgfTtcblxuICAgIHNldHRpbmdzLnBhZ2VzLlBERi5zY2FsZSA9IHtcbiAgICAgICAgeDogc2V0dGluZ3MucGFnZXMuUERGLncgLyBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy53LFxuICAgICAgICB5OiBzZXR0aW5ncy5wYWdlcy5QREYuaCAvIHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS5kcmF3aW5nLmgsXG4gICAgfTtcblxuICAgIGlmKCBzZXR0aW5ncy5wYWdlcy5QREYuc2NhbGUueCA8IHNldHRpbmdzLnBhZ2VzLlBERi5zY2FsZS55ICkge1xuICAgICAgICBzZXR0aW5ncy5wYWdlLnNjYWxlID0gc2V0dGluZ3MucGFnZXMuUERGLnNjYWxlLng7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2V0dGluZ3MucGFnZS5zY2FsZSA9IHNldHRpbmdzLnBhZ2VzLlBERi5zY2FsZS55O1xuICAgIH1cblxuXG4gICAgbG9jLnByZXZpZXcgPSBsb2MucHJldmlldyB8fCB7fTtcbiAgICBsb2MucHJldmlldy5hcnJheSA9IGxvYy5wcmV2aWV3LmFycmF5ID0ge307XG4gICAgbG9jLnByZXZpZXcuYXJyYXkudG9wID0gMTAwO1xuICAgIGxvYy5wcmV2aWV3LmFycmF5LmxlZnQgPSA1MDtcblxuICAgIGxvYy5wcmV2aWV3LkRDID0gbG9jLnByZXZpZXcuREMgPSB7fTtcbiAgICBsb2MucHJldmlldy5pbnZlcnRlciA9IGxvYy5wcmV2aWV3LmludmVydGVyID0ge307XG4gICAgbG9jLnByZXZpZXcuQUMgPSBsb2MucHJldmlldy5BQyA9IHt9O1xuXG4gICAgc2l6ZS5wcmV2aWV3ID0gc2l6ZS5wcmV2aWV3IHx8IHt9O1xuICAgIHNpemUucHJldmlldy5tb2R1bGUgPSB7XG4gICAgICAgIHc6IDE1LFxuICAgICAgICBoOiAyNSxcbiAgICB9O1xuICAgIHNpemUucHJldmlldy5EQyA9IHtcbiAgICAgICAgdzogMzAsXG4gICAgICAgIGg6IDUwLFxuICAgIH07XG4gICAgc2l6ZS5wcmV2aWV3LmludmVydGVyID0ge1xuICAgICAgICB3OiAxNTAsXG4gICAgICAgIGg6IDc1LFxuICAgIH07XG4gICAgc2l6ZS5wcmV2aWV3LkFDID0ge1xuICAgICAgICB3OiAzMCxcbiAgICAgICAgaDogNTAsXG4gICAgfTtcbiAgICBzaXplLnByZXZpZXcubG9hZGNlbnRlciA9IHtcbiAgICAgICAgdzogNTAsXG4gICAgICAgIGg6IDEwMCxcbiAgICB9O1xuXG5cblxuICByZXR1cm4gc2V0dGluZ3M7XG5cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldHRpbmdzX2RyYXdpbmc7XG4iLCIvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduXG5pZiAoIU9iamVjdC5hc3NpZ24pIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE9iamVjdCwgXCJhc3NpZ25cIiwge1xuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogZnVuY3Rpb24odGFyZ2V0LCBmaXJzdFNvdXJjZSkge1xuICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQgfHwgdGFyZ2V0ID09PSBudWxsKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNvbnZlcnQgZmlyc3QgYXJndW1lbnQgdG8gb2JqZWN0XCIpO1xuICAgICAgdmFyIHRvID0gT2JqZWN0KHRhcmdldCk7XG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbmV4dFNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaWYgKG5leHRTb3VyY2UgPT09IHVuZGVmaW5lZCB8fCBuZXh0U291cmNlID09PSBudWxsKSBjb250aW51ZTtcbiAgICAgICAgdmFyIGtleXNBcnJheSA9IE9iamVjdC5rZXlzKE9iamVjdChuZXh0U291cmNlKSk7XG4gICAgICAgIGZvciAodmFyIG5leHRJbmRleCA9IDAsIGxlbiA9IGtleXNBcnJheS5sZW5ndGg7IG5leHRJbmRleCA8IGxlbjsgbmV4dEluZGV4KyspIHtcbiAgICAgICAgICB2YXIgbmV4dEtleSA9IGtleXNBcnJheVtuZXh0SW5kZXhdO1xuICAgICAgICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihuZXh0U291cmNlLCBuZXh0S2V5KTtcbiAgICAgICAgICBpZiAoZGVzYyAhPT0gdW5kZWZpbmVkICYmIGRlc2MuZW51bWVyYWJsZSkgdG9bbmV4dEtleV0gPSBuZXh0U291cmNlW25leHRLZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdG87XG4gICAgfVxuICB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy9cbi8vIGZvbnRzXG5cbnZhciBmb250cyA9IHt9O1xuXG5mb250c1snYmFzZSddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTAsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5cbmZvbnRzWydzaWducyddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgNSxcbiAgICAndGV4dC1hbmNob3InOiAgICdtaWRkbGUnLFxufTtcbmZvbnRzWydsYWJlbCddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTIsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5mb250c1sndGl0bGUxJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAxNCxcbiAgICAndGV4dC1hbmNob3InOiAgICdsZWZ0Jyxcbn07XG5mb250c1sndGl0bGUyJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAxMixcbiAgICAndGV4dC1hbmNob3InOiAgICdsZWZ0Jyxcbn07XG5mb250c1sndGl0bGUzJ10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZSc6ICAgICAxMCxcbiAgICAndGV4dC1hbmNob3InOiAgICdsZWZ0Jyxcbn07XG5mb250c1sncGFnZSddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMjAsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5mb250c1sndGFibGUnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnc2VyaWYnLFxuICAgICdmb250LXNpemUnOiAgICAgOCxcbiAgICAndGV4dC1hbmNob3InOiAgICdtaWRkbGUnLFxufTtcbmZvbnRzWyd0YWJsZV9sZWZ0J10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ3NlcmlmJyxcbiAgICAnZm9udC1zaXplJzogICAgIDgsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbGVmdCcsXG59O1xuZm9udHNbJ3RhYmxlX2xhcmdlX2xlZnQnXSA9IHtcbiAgICAnZm9udC1mYW1pbHknOiAnbW9ub3NwYWNlJyxcbiAgICAnZm9udC1zaXplJzogICAgIDE0LFxuICAgICd0ZXh0LWFuY2hvcic6ICAgJ2xlZnQnLFxufTtcbmZvbnRzWyd0YWJsZV9sYXJnZSddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTQsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5mb250c1sncHJvamVjdCB0aXRsZSddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnOiAgICAgMTYsXG4gICAgJ3RleHQtYW5jaG9yJzogICAnbWlkZGxlJyxcbn07XG5mb250c1sncHJldmlldyB0ZXh0J10gPSB7XG4gICAgJ2ZvbnQtZmFtaWx5JzogJ21vbm9zcGFjZScsXG4gICAgJ2ZvbnQtc2l6ZScgIDogMjAsXG4gICAgJ3RleHQtYW5jaG9yJzogJ21pZGRsZScsXG59O1xuZm9udHNbJ2RpbWVudGlvbiddID0ge1xuICAgICdmb250LWZhbWlseSc6ICdtb25vc3BhY2UnLFxuICAgICdmb250LXNpemUnICA6IDIwLFxuICAgICd0ZXh0LWFuY2hvcic6ICdtaWRkbGUnLFxufTtcblxuXG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvbnRzO1xuIiwiLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnblxuaWYgKCFPYmplY3QuYXNzaWduKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPYmplY3QsIFwiYXNzaWduXCIsIHtcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgdmFsdWU6IGZ1bmN0aW9uKHRhcmdldCwgZmlyc3RTb3VyY2UpIHtcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PT0gbnVsbClcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjb252ZXJ0IGZpcnN0IGFyZ3VtZW50IHRvIG9iamVjdFwiKTtcbiAgICAgIHZhciB0byA9IE9iamVjdCh0YXJnZXQpO1xuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG5leHRTb3VyY2UgPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGlmIChuZXh0U291cmNlID09PSB1bmRlZmluZWQgfHwgbmV4dFNvdXJjZSA9PT0gbnVsbCkgY29udGludWU7XG4gICAgICAgIHZhciBrZXlzQXJyYXkgPSBPYmplY3Qua2V5cyhPYmplY3QobmV4dFNvdXJjZSkpO1xuICAgICAgICBmb3IgKHZhciBuZXh0SW5kZXggPSAwLCBsZW4gPSBrZXlzQXJyYXkubGVuZ3RoOyBuZXh0SW5kZXggPCBsZW47IG5leHRJbmRleCsrKSB7XG4gICAgICAgICAgdmFyIG5leHRLZXkgPSBrZXlzQXJyYXlbbmV4dEluZGV4XTtcbiAgICAgICAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobmV4dFNvdXJjZSwgbmV4dEtleSk7XG4gICAgICAgICAgaWYgKGRlc2MgIT09IHVuZGVmaW5lZCAmJiBkZXNjLmVudW1lcmFibGUpIHRvW25leHRLZXldID0gbmV4dFNvdXJjZVtuZXh0S2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRvO1xuICAgIH1cbiAgfSk7XG59XG5cblxudmFyIGxheWVyX2F0dHIgPSB7fTtcblxubGF5ZXJfYXR0ci5iYXNlID0ge1xuICAgICdmaWxsJzogJ25vbmUnLFxuICAgICdzdHJva2UnOicjMDAwMDAwJyxcbiAgICAnc3Ryb2tlLXdpZHRoJzonMXB4JyxcbiAgICAnc3Ryb2tlLWxpbmVjYXAnOididXR0JyxcbiAgICAnc3Ryb2tlLWxpbmVqb2luJzonbWl0ZXInLFxuICAgICdzdHJva2Utb3BhY2l0eSc6MSxcblxufTtcbmxheWVyX2F0dHIuYmxvY2sgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLmZyYW1lID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5mcmFtZS5zdHJva2UgPSAnIzAwMDA0Mic7XG5sYXllcl9hdHRyLnRhYmxlID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci50YWJsZS5zdHJva2UgPSAnIzAwMDAwMCc7XG5cbmxheWVyX2F0dHIuRENfaW50ZXJtb2R1bGUgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKSx7XG4gICAgc3Ryb2tlOiAnI2JlYmViZScsXG4gICAgXCJzdHJva2UtZGFzaGFycmF5XCI6IFwiMSwgMVwiLFxuXG5cbn0pO1xuXG5sYXllcl9hdHRyLkRDX3BvcyA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuRENfcG9zLnN0cm9rZSA9ICcjZmYwMDAwJztcbmxheWVyX2F0dHIuRENfbmVnID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci5EQ19uZWcuc3Ryb2tlID0gJyMwMDAwMDAnO1xubGF5ZXJfYXR0ci5EQ19ncm91bmQgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkRDX2dyb3VuZC5zdHJva2UgPSAnIzAwNjYwMCc7XG5sYXllcl9hdHRyLm1vZHVsZSA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuYm94ID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xuXG5cblxubGF5ZXJfYXR0ci50ZXh0ID0gT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpO1xubGF5ZXJfYXR0ci50ZXh0LnN0cm9rZSA9ICcjMDAwMGZmJztcbmxheWVyX2F0dHIudGVybWluYWwgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLmJvcmRlciA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcblxubGF5ZXJfYXR0ci5BQ19ncm91bmQgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkFDX2dyb3VuZC5zdHJva2UgPSAnIzAwOTkwMCc7XG5sYXllcl9hdHRyLkFDX25ldXRyYWwgPSBPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIuYmFzZSk7XG5sYXllcl9hdHRyLkFDX25ldXRyYWwuc3Ryb2tlID0gJyM5OTk3OTcnO1xubGF5ZXJfYXR0ci5BQ19MMSA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuQUNfTDEuc3Ryb2tlID0gJyMwMDAwMDAnO1xubGF5ZXJfYXR0ci5BQ19MMiA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuQUNfTDIuc3Ryb2tlID0gJyNGRjAwMDAnO1xubGF5ZXJfYXR0ci5BQ19MMyA9IE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5iYXNlKTtcbmxheWVyX2F0dHIuQUNfTDMuc3Ryb2tlID0gJyMwMDAwRkYnO1xuXG5cbmxheWVyX2F0dHIucHJldmlldyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLmJhc2UpLHtcbiAgICAnc3Ryb2tlLXdpZHRoJzogJzInLFxufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19tb2R1bGUgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyNmZmIzMDAnLFxuICAgIHN0cm9rZTogJ25vbmUnLFxufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19hcnJheSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6ICcjZmY1ZDAwJyxcbn0pO1xuXG5sYXllcl9hdHRyLnByZXZpZXdfREMgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgc3Ryb2tlOiAnI2IwOTJjNCcsXG59KTtcbmxheWVyX2F0dHIucHJldmlld19EQ19ib3ggPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyNiMDkyYzQnLFxuICAgIHN0cm9rZTogJ25vbmUnLFxufSk7XG5cbmxheWVyX2F0dHIucHJldmlld19pbnZlcnRlciA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6JyM4NmM5NzQnLFxufSk7XG5sYXllcl9hdHRyLnByZXZpZXdfaW52ZXJ0ZXJfYm94ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjODZjOTc0JyxcbiAgICBzdHJva2U6ICdub25lJyxcbn0pO1xuXG5sYXllcl9hdHRyLnByZXZpZXdfQUMgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgc3Ryb2tlOiAnIzgxODhhMScsXG59KTtcblxubGF5ZXJfYXR0ci5wcmV2aWV3X0FDX2JveCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnIzgxODhhMScsXG4gICAgc3Ryb2tlOiAnbm9uZScsXG59KTtcblxubGF5ZXJfYXR0ci5wcmV2aWV3X3N0cnVjdHVyYWwgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgc3Ryb2tlOiAnIzAwMDAwMCcsXG59KTtcbmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX2RvdCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6ICcjMDAwMDAwJyxcbiAgICBcInN0cm9rZS1kYXNoYXJyYXlcIjogXCI1LCA1XCJcbn0pO1xubGF5ZXJfYXR0ci5wcmV2aWV3X3N0cnVjdHVyYWxfcG9seV91bnNlbGVjdGVkID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjZTFlMWUxJyxcbiAgICBzdHJva2U6ICdub25lJ1xufSk7XG5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3NlbGVjdGVkID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIGZpbGw6ICcjZmZlN2NiJyxcbiAgICBzdHJva2U6ICdub25lJ1xufSk7XG5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbF9wb2x5X3NlbGVjdGVkX2ZyYW1lZCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnI2ZmZTdjYicsXG4gICAgc3Ryb2tlOiAnIzAwMDAwMCdcbn0pO1xuXG5sYXllcl9hdHRyLnByZXZpZXdfc3RydWN0dXJhbF9tb2R1bGUgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobGF5ZXJfYXR0ci5wcmV2aWV3KSx7XG4gICAgZmlsbDogJyNmZmZmZmYnLFxuICAgIHN0cm9rZTogJ25vbmUnXG59KTtcbmxheWVyX2F0dHIucHJldmlld19zdHJ1Y3R1cmFsX21vZHVsZV9zZWxlY3RlZCA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBmaWxsOiAnIzgzOTdlOCcsXG4gICAgc3Ryb2tlOiAnI2RmZmFmZidcbn0pO1xuXG5sYXllcl9hdHRyLm5vcnRoX2Fycm93ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGxheWVyX2F0dHIucHJldmlldykse1xuICAgIHN0cm9rZTogJyMwMDAwMDAnLFxuICAgICdzdHJva2Utd2lkdGgnOiAxLFxuICAgICdzdHJva2UtbGluZWNhcCc6IFwicm91bmRcIixcbiAgICAnc3Ryb2tlLWxpbmVqb2luJzogXCJyb3VuZFwiLFxufSk7XG5sYXllcl9hdHRyLm5vcnRoX2xldHRlciA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnByZXZpZXcpLHtcbiAgICBzdHJva2U6ICcjOTQ5NDk0JyxcbiAgICAnc3Ryb2tlLXdpZHRoJzogNSxcbiAgICAnc3Ryb2tlLWxpbmVjYXAnOiBcInJvdW5kXCIsXG4gICAgJ3N0cm9rZS1saW5lam9pbic6IFwicm91bmRcIixcbn0pO1xuXG5sYXllcl9hdHRyLmRpbWVudGlvbiA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShsYXllcl9hdHRyLnRleHQpLHtcbiAgICBzdHJva2U6ICcjMTQzM2ZlJyxcbn0pO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gbGF5ZXJfYXR0cjtcbiIsIlxuXG5cbmZ1bmN0aW9uIHNldHVwX3dlYnBhZ2UoKXtcbiAgICB2YXIgc2V0dGluZ3MgPSBnO1xuICAgIHZhciBmID0gZy5mO1xuXG4gICAgdmFyIHN5c3RlbV9mcmFtZV9pZCA9ICdzeXN0ZW1fZnJhbWUnO1xuICAgIHZhciB0aXRsZSA9ICdQViBkcmF3aW5nIHRlc3QnO1xuXG4gICAgZy5mLnNldHVwX2JvZHkodGl0bGUpO1xuXG4gICAgdmFyIHBhZ2UgPSAkKCc8ZGl2PicpLmF0dHIoJ2NsYXNzJywgJ3BhZ2UnKS5hcHBlbmRUbygkKGRvY3VtZW50LmJvZHkpKTtcbiAgICAvL3BhZ2Uuc3R5bGUoJ3dpZHRoJywgKHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS5kcmF3aW5nLncrMjApLnRvU3RyaW5nKCkgKyAncHgnIClcblxuICAgIHZhciBzeXN0ZW1fZnJhbWUgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgc3lzdGVtX2ZyYW1lX2lkKS5hcHBlbmRUbyhwYWdlKTtcblxuXG4gICAgdmFyIGhlYWRlcl9jb250YWluZXIgPSAkKCc8ZGl2PicpLmFwcGVuZFRvKHN5c3RlbV9mcmFtZSk7XG4gICAgJCgnPGltZz4nKVxuICAgICAgICAuYXR0cignc3JjJywgJ2RhdGEvUGxhbnNNYWNoaW5lLnBuZycpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICd0aXRsZV9pbWFnZScpXG4gICAgICAgIC8vLmF0dHIoJ3dpZHRoJywgJzkwJScpXG4gICAgICAgIC5hcHBlbmRUbyhoZWFkZXJfY29udGFpbmVyKTtcbiAgICAkKCc8c3Bhbj4nKS5odG1sKCdQbGVhc2Ugc2VsZWN0IHlvdXIgc3lzdGVtIHNwZWMgYmVsb3cnKS5hdHRyKCdjbGFzcycsICdjYXRlZ29yeV90aXRsZScpLmFwcGVuZFRvKGhlYWRlcl9jb250YWluZXIpO1xuICAgICQoJzxzcGFuPicpLmh0bWwoJyB8ICcpLmFwcGVuZFRvKGhlYWRlcl9jb250YWluZXIpO1xuICAgIC8vJCgnPGlucHV0PicpLmF0dHIoJ3R5cGUnLCAnYnV0dG9uJykuYXR0cigndmFsdWUnLCAnY2xlYXIgc2VsZWN0aW9ucycpLmNsaWNrKHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQpLFxuICAgICQoJzxhPicpLmF0dHIoJ2hyZWYnLCAnamF2YXNjcmlwdDp3aW5kb3cubG9jYXRpb24ucmVsb2FkKCknKS5odG1sKCdjbGVhciBzZWxlY3Rpb25zJykuYXBwZW5kVG8oaGVhZGVyX2NvbnRhaW5lcik7XG5cblxuICAgIC8vIFN5c3RlbSBzZXR1cFxuICAgICQoJzxkaXY+JykuaHRtbCgnU3lzdGVtIFNldHVwJykuYXR0cignY2xhc3MnLCAnc2VjdGlvbl90aXRsZScpLmFwcGVuZFRvKHN5c3RlbV9mcmFtZSk7XG4gICAgdmFyIGNvbmZpZ19mcmFtZSA9ICQoJzxkaXY+JykuYXR0cignaWQnLCAnY29uZmlnX2ZyYW1lJykuYXBwZW5kVG8oc3lzdGVtX2ZyYW1lKTtcblxuICAgIGcuZi5hZGRfc2VsZWN0b3JzKHNldHRpbmdzLCBjb25maWdfZnJhbWUpO1xuICAgIC8vY29uc29sZS5sb2coc2VjdGlvbl9zZWxlY3Rvcik7XG5cblxuXG4gICAgLy92YXIgbG9jYXRpb25fZHJhd2VyID0gJCgnI3NlY3Rpb25fbG9jYXRpb24nKS5jaGlsZHJlbignLmRyYXdlcicpLmNoaWxkcmVuKCcuZHJhd2VyX2NvbnRlbnQnKTtcbiAgICAvL2NvbnNvbGUubG9nKGxvY2F0aW9uX2RyYXdlcik7XG5cblxuICAgIHZhciBtYXBfZGl2ID0gJCgnPGRpdj4nKTtcbiAgICB2YXIgbWFwX2RyYXdlciA9IGYubWtfZHJhd2VyKCdtYXAnLG1hcF9kaXYpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLy5hcHBlbmRUbyhjb25maWdfZnJhbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLmluc2VydEFmdGVyKCAkKCcjc2VjdGlvbl9sb2NhdGlvbicpICk7XG4gICAgbWFwX2RyYXdlci5jaGlsZHJlbignLmRyYXdlcicpLmNoaWxkcmVuKCcuZHJhd2VyX2NvbnRlbnQnKS5zbGlkZVVwKCdmYXN0Jyk7XG5cblxuXG4gICAgdmFyIGxpc3RfZWxlbWVudCA9ICQoJzx1bD4nKS5hcHBlbmRUbyhtYXBfZGl2KTtcbiAgICAkKCc8bGk+JykuYXBwZW5kVG8obGlzdF9lbGVtZW50KS5hcHBlbmQoXG4gICAgICAgICQoJzxhPicpXG4gICAgICAgICAgICAudGV4dCgnV2luZCBab25lICcpXG4gICAgICAgICAgICAuYXR0cignaHJlZicsICdodHRwOi8vd2luZHNwZWVkLmF0Y291bmNpbC5vcmcvJylcbiAgICAgICAgICAgIC5hdHRyKCd0YXJnZXQnLCAnX2JsYW5rJylcbiAgICApO1xuICAgICQoJzxsaT4nKS5hcHBlbmRUbyhsaXN0X2VsZW1lbnQpLmFwcGVuZChcbiAgICAgICAgJCgnPGE+JylcbiAgICAgICAgICAgIC50ZXh0KCdDbGltYXRlIENvbmRpdGlvbnMnKVxuICAgICAgICAgICAgLmF0dHIoJ2hyZWYnLCAnaHR0cDovL3d3dy5zb2xhcmFiY3Mub3JnL2Fib3V0L3B1YmxpY2F0aW9ucy9yZXBvcnRzL2V4cGVkaXRlZC1wZXJtaXQvbWFwL2luZGV4Lmh0bWwnKVxuICAgICAgICAgICAgLmF0dHIoJ3RhcmdldCcsICdfYmxhbmsnKVxuICAgICk7XG5cblxuICAgIHZhciBnZW9jb2RlX2RpdiA9ICQoJzxkaXY+JylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dlb2NvZGVfbGluZScpXG4gICAgICAgIC5hcHBlbmRUbyhtYXBfZGl2KTtcbiAgICAkKCc8YT4nKS5hcHBlbmRUbyhnZW9jb2RlX2RpdilcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dlb2NvZGVfYnV0dG9uJylcbiAgICAgICAgLnRleHQoJ0ZpbmQgbG9jYXRpb24gZnJvbSBhZGRyZXNzJylcbiAgICAgICAgLmF0dHIoJ2hyZWYnLCAnIycpXG4gICAgICAgIC5jbGljayhmLnJlcXVlc3RfZ2VvY29kZSk7XG4gICAgJCgnPHNwYW4+JykuYXBwZW5kVG8oZ2VvY29kZV9kaXYpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdnZW9jb2RlX2Rpc3BsYXknKVxuICAgICAgICAuYXR0cignaWQnLCdnZW9jb2RlX2Rpc3BsYXknKVxuICAgICAgICAudGV4dCgnJyk7XG5cbiAgICAkKCc8ZGl2PicpXG4gICAgICAgIC5hdHRyKCdpZCcsICdtYXBfcm9hZCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBfcm9hZCcpXG4gICAgICAgIC5hdHRyKCdzdHlsZScsICd3aWR0aDo0ODVweDtoZWlnaHQ6MzgwcHgnKVxuICAgICAgICAuYXBwZW5kVG8obWFwX2Rpdik7XG4gICAgJCgnPGRpdj4nKVxuICAgICAgICAuYXR0cignaWQnLCAnbWFwX3NhdCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdtYXBfc2F0JylcbiAgICAgICAgLmF0dHIoJ3N0eWxlJywgJ3dpZHRoOjQ4NXB4O2hlaWdodDozODBweCcpXG4gICAgICAgIC5hcHBlbmRUbyhtYXBfZGl2KTtcblxuXG4gICAgdmFyIGxhdF9mbF9jZW50ZXIgPSAyNy43NTtcbiAgICB2YXIgbG9uX2ZsX2NlbnRlciA9IC04NC4wO1xuXG4gICAgdmFyIGxhdCA9IDI4LjM4NzM5OTtcbiAgICB2YXIgbG9uID0gLTgwLjc1NzgzMztcbiAgICB2YXIgY29vciA9IFstODAuNzU3ODMzLCAyOC4zODczOTldO1xuXG4gICAgTC5Bd2Vzb21lTWFya2Vycy5JY29uLnByb3RvdHlwZS5vcHRpb25zLnByZWZpeCA9ICdmYSc7XG4gICAgdmFyIHN1bl9tYXJrZXIgPSBMLkF3ZXNvbWVNYXJrZXJzLmljb24oe1xuICAgICAgICBpY29uOiAnc3VuLW8nLFxuICAgICAgICBtYXJrZXJDb2xvcjogJ2JsdWUgICcsXG4gICAgICAgIGljb25Db2xvcjogJ3llbGxvdydcbiAgICB9KTtcblxuICAgIHZhciBtYXBfcm9hZCAgPSBnLnBlcm0ubWFwcy5tYXBfcm9hZCA9IEwubWFwKCAnbWFwX3JvYWQnLCB7XG4gICAgICAgIGNlbnRlcjogW2xhdF9mbF9jZW50ZXIsIGxvbl9mbF9jZW50ZXJdLFxuICAgICAgICB6b29tOiA2XG4gICAgfSk7XG5cbiAgICBMLnRpbGVMYXllciggJ2h0dHA6Ly97c30ubXFjZG4uY29tL3RpbGVzLzEuMC4wL21hcC97en0ve3h9L3t5fS5wbmcnLCB7XG4gICAgICAgIGF0dHJpYnV0aW9uOiAnJmNvcHk7IDxhIGhyZWY9XCJodHRwOi8vb3NtLm9yZy9jb3B5cmlnaHRcIiB0aXRsZT1cIk9wZW5TdHJlZXRNYXBcIiB0YXJnZXQ9XCJfYmxhbmtcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMgfCBUaWxlcyBDb3VydGVzeSBvZiA8YSBocmVmPVwiaHR0cDovL3d3dy5tYXBxdWVzdC5jb20vXCIgdGl0bGU9XCJNYXBRdWVzdFwiIHRhcmdldD1cIl9ibGFua1wiPk1hcFF1ZXN0PC9hPiA8aW1nIHNyYz1cImh0dHA6Ly9kZXZlbG9wZXIubWFwcXVlc3QuY29tL2NvbnRlbnQvb3NtL21xX2xvZ28ucG5nXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCI+JyxcbiAgICAgICAgc3ViZG9tYWluczogWydvdGlsZTEnLCdvdGlsZTInLCdvdGlsZTMnLCdvdGlsZTQnXVxuICAgIH0pLmFkZFRvKCBtYXBfcm9hZCApO1xuXG4gICAgZy5wZXJtLm1hcHMubWFya2VyX3JvYWQgPSBMLm1hcmtlcihbbGF0LGxvbl0sIHtpY29uOiBzdW5fbWFya2VyfSkuYWRkVG8obWFwX3JvYWQpO1xuXG4gICAgbWFwX3JvYWQub24oJ2NsaWNrJywgZi5zZXRfY29vcmRpbmF0ZXNfZnJvbV9tYXAgKTtcblxuXG5cblxuICAgIHZhciBtYXBfc2F0ID0gZy5wZXJtLm1hcHMubWFwX3NhdCA9IEwubWFwKCAnbWFwX3NhdCcsIHtcbiAgICAgICAgY2VudGVyOiBbbGF0LCBsb25dLFxuICAgICAgICB6b29tOiAxNlxuICAgIH0pO1xuICAgIEwudGlsZUxheWVyKCAnaHR0cDovL3tzfS5tcWNkbi5jb20vdGlsZXMvMS4wLjAvc2F0L3t6fS97eH0ve3l9LnBuZycsIHtcbiAgICAgICAgc3ViZG9tYWluczogWydvdGlsZTEnLCdvdGlsZTInLCdvdGlsZTMnLCdvdGlsZTQnXVxuICAgIH0pLmFkZFRvKCBtYXBfc2F0ICk7XG5cbiAgICBnLnBlcm0ubWFwcy5tYXJrZXJfc2F0ID0gTC5tYXJrZXIoW2xhdCxsb25dLCB7aWNvbjogc3VuX21hcmtlcn0pLmFkZFRvKG1hcF9zYXQpO1xuXG4gICAgbWFwX3NhdC5vbignY2xpY2snLCBmLnNldF9jb29yZGluYXRlc19mcm9tX21hcCApO1xuXG5cblxuXG5cblxuICAgIHZhciBkcmF3aW5nX3ByZXZpZXcgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2RyYXdpbmdfZnJhbWVfcHJldmlldycpLmFwcGVuZFRvKHBhZ2UpO1xuICAgICQoJzxkaXY+JykuaHRtbCgnUHJldmlldycpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25fdGl0bGUnKS5hcHBlbmRUbyhkcmF3aW5nX3ByZXZpZXcpO1xuICAgICQoJzxkaXY+JykuYXR0cignaWQnLCAnZHJhd2luZ19wcmV2aWV3JykuYXR0cignY2xhc3MnLCAnZHJhd2luZycpLmNzcygnY2xlYXInLCAnYm90aCcpLmFwcGVuZFRvKGRyYXdpbmdfcHJldmlldyk7XG5cblxuXG5cblxuICAgIHZhciBkcmF3aW5nX3NlY3Rpb24gPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2RyYXdpbmdfZnJhbWUnKS5hcHBlbmRUbyhwYWdlKTtcbiAgICAvL2RyYXdpbmcuY3NzKCd3aWR0aCcsIChzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZy53KzIwKS50b1N0cmluZygpICsgJ3B4JyApO1xuICAgICQoJzxkaXY+JykuaHRtbCgnRHJhd2luZycpLmF0dHIoJ2NsYXNzJywgJ3NlY3Rpb25fdGl0bGUnKS5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pO1xuXG5cbiAgICAvLyQoJzxmb3JtIG1ldGhvZD1cImdldFwiIGFjdGlvbj1cImRhdGEvc2FtcGxlLnBkZlwiPjxidXR0b24gdHlwZT1cInN1Ym1pdFwiPkRvd25sb2FkPC9idXR0b24+PC9mb3JtPicpLmFwcGVuZFRvKGRyYXdpbmdfc2VjdGlvbik7XG4gICAgLy8kKCc8c3Bhbj4nKS5hdHRyKCdpZCcsICdkb3dubG9hZCcpLmF0dHIoJ2NsYXNzJywgJ2Zsb2F0X3JpZ2h0JykuYXBwZW5kVG8oZHJhd2luZ19zZWN0aW9uKTtcbiAgICAkKCc8YT4nKVxuICAgICAgICAudGV4dCgnRG93bmxvYWQgRHJhd2luZyAoc2FtcGxlKScpXG4gICAgICAgIC5hdHRyKCdocmVmJywgJ3NhbXBsZV9wZGYvc2FtcGxlLnBkZicpXG4gICAgICAgIC5hdHRyKCdpZCcsICdkb3dubG9hZCcpXG4gICAgICAgIC5hdHRyKCdjbGFzcycsICdidXR0b25fZmxvYXRfcmlnaHQnKVxuICAgICAgICAuYXR0cigndGFyZ2V0JywgJ19ibGFuaycpXG4gICAgICAgIC5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pO1xuICAgICQoJzxhPicpXG4gICAgICAgIC50ZXh0KCdEb3dubG9hZCBEcmF3aW5nIChuZXR3b3JrIHRlc3QsIG9uY2UpJylcbiAgICAgICAgLy8uYXR0cignaHJlZicsICcjJylcbiAgICAgICAgLmF0dHIoJ2lkJywgJ2Rvd25sb2FkJylcbiAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2J1dHRvbl9mbG9hdF9yaWdodCcpXG4gICAgICAgIC8vLmF0dHIoJ3RhcmdldCcsICdfYmxhbmsnKVxuICAgICAgICAuYXBwZW5kVG8oZHJhd2luZ19zZWN0aW9uKVxuICAgICAgICAuY2xpY2soZi5yZXF1ZXN0X1NWRyk7XG4gICAgJCgnPGE+JylcbiAgICAgICAgLnRleHQoJ0Rvd25sb2FkIERyYXdpbmcgKG5ldHdvcmsgdGVzdCwgcmVwZWF0cyknKVxuICAgICAgICAvLy5hdHRyKCdocmVmJywgJyMnKVxuICAgICAgICAuYXR0cignaWQnLCAnZG93bmxvYWQnKVxuICAgICAgICAuYXR0cignY2xhc3MnLCAnYnV0dG9uX2Zsb2F0X3JpZ2h0JylcbiAgICAgICAgLy8uYXR0cigndGFyZ2V0JywgJ19ibGFuaycpXG4gICAgICAgIC5hcHBlbmRUbyhkcmF3aW5nX3NlY3Rpb24pXG4gICAgICAgIC5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgc2V0SW50ZXJ2YWwoZy5mLnJlcXVlc3RfU1ZHLCAxMDAwKTtcbiAgICAgICAgfSk7XG5cbiAgICB2YXIgc3ZnX2NvbnRhaW5lcl9vYmplY3QgPSAkKCc8ZGl2PicpLmF0dHIoJ2lkJywgJ2RyYXdpbmcnKS5hdHRyKCdjbGFzcycsICdkcmF3aW5nJykuY3NzKCdjbGVhcicsICdib3RoJykuYXBwZW5kVG8oZHJhd2luZ19zZWN0aW9uKTtcbiAgICAvL3N2Z19jb250YWluZXJfb2JqZWN0LnN0eWxlKCd3aWR0aCcsIHNldHRpbmdzLmRyYXdpbmdfc2V0dGluZ3Muc2l6ZS5kcmF3aW5nLncrJ3B4JyApXG4gICAgLy92YXIgc3ZnX2NvbnRhaW5lciA9IHN2Z19jb250YWluZXJfb2JqZWN0LmVsZW07XG4gICAgJCgnPGJyPicpLmFwcGVuZFRvKGRyYXdpbmdfc2VjdGlvbik7XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgJCgnPGRpdj4nKS5odG1sKCcgJykuYXR0cignY2xhc3MnLCAnc2VjdGlvbl90aXRsZScpLmFwcGVuZFRvKGRyYXdpbmdfc2VjdGlvbik7XG5cbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gc2V0dXBfd2VicGFnZTtcbiIsIlxuXG52YXIgdXBkYXRlX3dlYnBhZ2UgPSBmdW5jdGlvbigpe1xuICAgIHZhciBzZXR0aW5ncyA9IGc7XG4gICAgdmFyIGYgPSBnLmY7XG5cblxuLy8gdXBkYXRlIHdlYiBwYWdlXG4gICAgLy8gc2V0IG1hcHMgbWFya2Vyc1xuICAgIGlmKCBnLnBlcm0ubG9jYXRpb24ubGF0ICYmIGcucGVybS5sb2NhdGlvbi5sb24pIHtcbiAgICAgICAgZi5zZXRfc2F0X21hcF9tYXJrZXIoKTtcbiAgICB9XG5cbiAgICAvLyBjaGFuZ2UgdXNlciBpbnB1dHMgdG8gZGVmYXVsdHMgaWYgbmVlZGVkLlxuICAgIC8vIFRoaXMgYWxzbyB1cGRhdGVzIHRoZSBkcm9wIGxpc3QgZWxlbWVudHMgdGhhdCBhcmUgZGVwZW5kZW50IG9uIG90aGVyIGlucHV0cyAoIG1vZGVsIGxpc3QgaXMgYmFzZWQgb24gc2VsZWN0ZWQgbWFrZSkuXG4gICAgc2V0dGluZ3Muc2VsZWN0X3JlZ2lzdHJ5LmZvckVhY2goZnVuY3Rpb24oc2VsZWN0b3Ipe1xuICAgICAgICBpZiggc2VsZWN0b3IudHlwZSA9PT0gJ3NlbGVjdCcgKXtcbiAgICAgICAgICAgIGYuc2VsZWN0b3JfYWRkX29wdGlvbnMoc2VsZWN0b3IpO1xuICAgICAgICB9IGVsc2UgaWYoIHNlbGVjdG9yLnR5cGUgPT09ICdudW1iZXJfaW5wdXQnIHx8IHNlbGVjdG9yLnR5cGUgPT09ICd0ZXh0X2lucHV0JyApIHtcbiAgICAgICAgICAgIHNlbGVjdG9yLmVsZW0udmFsdWUgPSBzZWxlY3Rvci5zeXN0ZW1fcmVmLmdldCgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBEZXRlcm1pbmUgYWN0aXZlIHNlY3Rpb24gYmFzZWQgb24gc2VjdGlvbiBpbnB1dHMgZW50ZXJlZCBieSB1c2VyXG4gICAgdmFyIHNlY3Rpb25zID0gZy53ZWJwYWdlLnNlY3Rpb25zO1xuICAgIHZhciBhY3RpdmVfc2VjdGlvbjtcbiAgICBzZWN0aW9ucy5ldmVyeShmdW5jdGlvbihzZWN0aW9uX25hbWUsaWQpeyAvL1RPRE86IGZpbmQgcHJlIElFOSB3YXkgdG8gZG8gdGhpcz9cbiAgICAgICAgaWYoICEgZy5mLnNlY3Rpb25fZGVmaW5lZChnLCBzZWN0aW9uX25hbWUpICl7XG4gICAgICAgICAgICBhY3RpdmVfc2VjdGlvbiA9IHNlY3Rpb25fbmFtZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhY3RpdmUgc2VjdGlvbjonLCBzZWN0aW9uX25hbWUpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYoIGlkID09PSBzZWN0aW9ucy5sZW5ndGgtMSApeyAvL0lmIGxhc3Qgc2VjdGlvbiBpcyBkZWZpbmVkLCB0aGVyZSBpcyBubyBhY3RpdmUgc2VjdGlvblxuICAgICAgICAgICAgICAgIGFjdGl2ZV9zZWN0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vIENsb3NlIHNlY3Rpb24gaWYgdGhleSBhcmUgbm90IGFjdGl2ZSBzZWN0aW9ucywgdW5sZXNzIHRoZXkgaGF2ZSBiZWVuIG9wZW5lZCBieSB0aGUgdXNlciwgb3BlbiB0aGUgYWN0aXZlIHNlY3Rpb25cbiAgICBzZWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHNlY3Rpb25fbmFtZSxpZCl7IC8vVE9ETzogZmluZCBwcmUgSUU5IHdheSB0byBkbyB0aGlzP1xuICAgICAgICBpZiggc2VjdGlvbl9uYW1lID09PSBhY3RpdmVfc2VjdGlvbiApe1xuICAgICAgICAgICAgJCgnI3NlY3Rpb25fJytzZWN0aW9uX25hbWUpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlRG93bignZmFzdCcpO1xuICAgICAgICB9IGVsc2UgaWYoICEgZy53ZWJwYWdlLnNlbGVjdGlvbnNfbWFudWFsX3RvZ2dsZWRbc2VjdGlvbl9uYW1lXSApe1xuICAgICAgICAgICAgJCgnI3NlY3Rpb25fJytzZWN0aW9uX25hbWUpLmNoaWxkcmVuKCcuZHJhd2VyJykuY2hpbGRyZW4oJy5kcmF3ZXJfY29udGVudCcpLnNsaWRlVXAoJ2Zhc3QnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vSWYgdGhlIGxvY2F0aW9uIGlzIGRlZmluZWQsIG9wZW4gdGhlIG1hcC5cbiAgICBpZiggKCEgZy53ZWJwYWdlLnNlbGVjdGlvbnNfbWFudWFsX3RvZ2dsZWQubG9jYXRpb24pICYmICBnLmYuc2VjdGlvbl9kZWZpbmVkKGcsICdsb2NhdGlvbicpICl7XG4gICAgICAgICAgICAkKCcjc2VjdGlvbl9tYXAnKS5jaGlsZHJlbignLmRyYXdlcicpLmNoaWxkcmVuKCcuZHJhd2VyX2NvbnRlbnQnKS5zbGlkZURvd24oJ2Zhc3QnKTtcbiAgICB9XG5cblxuICAgIC8vIE1ha2UgcHJldmlld1xuICAgIHZhciBwO1xuXG4gICAgLy8gQWRkIHByZXZpZXcgdG8gcGFnZVxuICAgICQoJyNkcmF3aW5nX3ByZXZpZXcnKS5lbXB0eSgpLmh0bWwoJycpO1xuICAgIGZvciggcCBpbiBmLm1rX3ByZXZpZXcgKXsgIC8vIGYubWtfcGFnZSBpcyBhIGFycmF5IG9mIHBhZ2UgbWFraW5nIGZ1bmN0aW9ucywgc28gdGhpcyB3aWxsIGxvb3AgdGhyb3VnaCB0aGUgbnVtYmVyIG9mIHBhZ2VzXG4gICAgICAgIHNldHRpbmdzLmRyYXdpbmcucHJldmlld19zdmdzW3BdID0gZi5ta19zdmcoc2V0dGluZ3MuZHJhd2luZy5wcmV2aWV3X3BhcnRzW3BdLCBzZXR0aW5ncy5kcmF3aW5nX3NldHRpbmdzLnNpemUuZHJhd2luZyk7XG4gICAgICAgIHZhciBzZWN0aW9uID0gWycnLCdFbGVjdHJpY2FsJywnU3RydWN0dXJhbCddW3BdO1xuICAgICAgICAkKCcjZHJhd2luZ19wcmV2aWV3JylcbiAgICAgICAgICAgIC8vLmFwcGVuZCgkKCc8cD5QYWdlICcrcCsnPC9wPicpKVxuICAgICAgICAgICAgLmFwcGVuZCgkKCc8cD4nK3NlY3Rpb24rJzwvcD4nKSlcbiAgICAgICAgICAgIC5hcHBlbmQoJChzZXR0aW5ncy5kcmF3aW5nLnByZXZpZXdfc3Znc1twXSkpXG4gICAgICAgICAgICAuYXBwZW5kKCQoJzwvYnI+JykpXG4gICAgICAgICAgICAuYXBwZW5kKCQoJzwvYnI+JykpO1xuXG4gICAgfVxuXG4gICAgLy8gQWRkIGRyYXdpbmcgdG8gcGFnZVxuICAgICQoJyNkcmF3aW5nJykuZW1wdHkoKS5odG1sKCdFbGVjdHJpY2FsJyk7XG4gICAgZm9yKCBwIGluIGYubWtfcGFnZSApeyAgLy8gZi5ta19wYWdlIGlzIGEgYXJyYXkgb2YgcGFnZSBtYWtpbmcgZnVuY3Rpb25zLCBzbyB0aGlzIHdpbGwgbG9vcCB0aHJvdWdoIHRoZSBudW1iZXIgb2YgcGFnZXNcbiAgICAgICAgc2V0dGluZ3MuZHJhd2luZy5zdmdzW3BdID0gZi5ta19zdmcoc2V0dGluZ3MuZHJhd2luZy5wYXJ0c1twXSwgc2V0dGluZ3MuZHJhd2luZ19zZXR0aW5ncy5zaXplLmRyYXdpbmcpO1xuICAgICAgICAkKCcjZHJhd2luZycpXG4gICAgICAgICAgICAvLy5hcHBlbmQoJCgnPHA+UGFnZSAnK3ArJzwvcD4nKSlcbiAgICAgICAgICAgIC5hcHBlbmQoJChzZXR0aW5ncy5kcmF3aW5nLnN2Z3NbcF0pKVxuICAgICAgICAgICAgLmFwcGVuZCgkKCc8L2JyPicpKVxuICAgICAgICAgICAgLmFwcGVuZCgkKCc8L2JyPicpKTtcblxuICAgIH1cblxuXG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gdXBkYXRlX3dlYnBhZ2U7XG4iLCIvLyAgICAgVW5kZXJzY29yZS5qcyAxLjguMlxuLy8gICAgIGh0dHA6Ly91bmRlcnNjb3JlanMub3JnXG4vLyAgICAgKGMpIDIwMDktMjAxNSBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuLy8gICAgIFVuZGVyc2NvcmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG5cbihmdW5jdGlvbigpIHtcblxuICAvLyBCYXNlbGluZSBzZXR1cFxuICAvLyAtLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIGluIHRoZSBicm93c2VyLCBvciBgZXhwb3J0c2Agb24gdGhlIHNlcnZlci5cbiAgdmFyIHJvb3QgPSB0aGlzO1xuXG4gIC8vIFNhdmUgdGhlIHByZXZpb3VzIHZhbHVlIG9mIHRoZSBgX2AgdmFyaWFibGUuXG4gIHZhciBwcmV2aW91c1VuZGVyc2NvcmUgPSByb290Ll87XG5cbiAgLy8gU2F2ZSBieXRlcyBpbiB0aGUgbWluaWZpZWQgKGJ1dCBub3QgZ3ppcHBlZCkgdmVyc2lvbjpcbiAgdmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsIE9ialByb3RvID0gT2JqZWN0LnByb3RvdHlwZSwgRnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4gIC8vIENyZWF0ZSBxdWljayByZWZlcmVuY2UgdmFyaWFibGVzIGZvciBzcGVlZCBhY2Nlc3MgdG8gY29yZSBwcm90b3R5cGVzLlxuICB2YXJcbiAgICBwdXNoICAgICAgICAgICAgID0gQXJyYXlQcm90by5wdXNoLFxuICAgIHNsaWNlICAgICAgICAgICAgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgIHRvU3RyaW5nICAgICAgICAgPSBPYmpQcm90by50b1N0cmluZyxcbiAgICBoYXNPd25Qcm9wZXJ0eSAgID0gT2JqUHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbiAgLy8gQWxsICoqRUNNQVNjcmlwdCA1KiogbmF0aXZlIGZ1bmN0aW9uIGltcGxlbWVudGF0aW9ucyB0aGF0IHdlIGhvcGUgdG8gdXNlXG4gIC8vIGFyZSBkZWNsYXJlZCBoZXJlLlxuICB2YXJcbiAgICBuYXRpdmVJc0FycmF5ICAgICAgPSBBcnJheS5pc0FycmF5LFxuICAgIG5hdGl2ZUtleXMgICAgICAgICA9IE9iamVjdC5rZXlzLFxuICAgIG5hdGl2ZUJpbmQgICAgICAgICA9IEZ1bmNQcm90by5iaW5kLFxuICAgIG5hdGl2ZUNyZWF0ZSAgICAgICA9IE9iamVjdC5jcmVhdGU7XG5cbiAgLy8gTmFrZWQgZnVuY3Rpb24gcmVmZXJlbmNlIGZvciBzdXJyb2dhdGUtcHJvdG90eXBlLXN3YXBwaW5nLlxuICB2YXIgQ3RvciA9IGZ1bmN0aW9uKCl7fTtcblxuICAvLyBDcmVhdGUgYSBzYWZlIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QgZm9yIHVzZSBiZWxvdy5cbiAgdmFyIF8gPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgXykgcmV0dXJuIG9iajtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgXykpIHJldHVybiBuZXcgXyhvYmopO1xuICAgIHRoaXMuX3dyYXBwZWQgPSBvYmo7XG4gIH07XG5cbiAgLy8gRXhwb3J0IHRoZSBVbmRlcnNjb3JlIG9iamVjdCBmb3IgKipOb2RlLmpzKiosIHdpdGhcbiAgLy8gYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgZm9yIHRoZSBvbGQgYHJlcXVpcmUoKWAgQVBJLiBJZiB3ZSdyZSBpblxuICAvLyB0aGUgYnJvd3NlciwgYWRkIGBfYCBhcyBhIGdsb2JhbCBvYmplY3QuXG4gIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IF87XG4gICAgfVxuICAgIGV4cG9ydHMuXyA9IF87XG4gIH0gZWxzZSB7XG4gICAgcm9vdC5fID0gXztcbiAgfVxuXG4gIC8vIEN1cnJlbnQgdmVyc2lvbi5cbiAgXy5WRVJTSU9OID0gJzEuOC4yJztcblxuICAvLyBJbnRlcm5hbCBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gZWZmaWNpZW50IChmb3IgY3VycmVudCBlbmdpbmVzKSB2ZXJzaW9uXG4gIC8vIG9mIHRoZSBwYXNzZWQtaW4gY2FsbGJhY2ssIHRvIGJlIHJlcGVhdGVkbHkgYXBwbGllZCBpbiBvdGhlciBVbmRlcnNjb3JlXG4gIC8vIGZ1bmN0aW9ucy5cbiAgdmFyIG9wdGltaXplQ2IgPSBmdW5jdGlvbihmdW5jLCBjb250ZXh0LCBhcmdDb3VudCkge1xuICAgIGlmIChjb250ZXh0ID09PSB2b2lkIDApIHJldHVybiBmdW5jO1xuICAgIHN3aXRjaCAoYXJnQ291bnQgPT0gbnVsbCA/IDMgOiBhcmdDb3VudCkge1xuICAgICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSk7XG4gICAgICB9O1xuICAgICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24odmFsdWUsIG90aGVyKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgdmFsdWUsIG90aGVyKTtcbiAgICAgIH07XG4gICAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pO1xuICAgICAgfTtcbiAgICAgIGNhc2UgNDogcmV0dXJuIGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmMuY2FsbChjb250ZXh0LCBhY2N1bXVsYXRvciwgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBBIG1vc3RseS1pbnRlcm5hbCBmdW5jdGlvbiB0byBnZW5lcmF0ZSBjYWxsYmFja3MgdGhhdCBjYW4gYmUgYXBwbGllZFxuICAvLyB0byBlYWNoIGVsZW1lbnQgaW4gYSBjb2xsZWN0aW9uLCByZXR1cm5pbmcgdGhlIGRlc2lyZWQgcmVzdWx0IOKAlCBlaXRoZXJcbiAgLy8gaWRlbnRpdHksIGFuIGFyYml0cmFyeSBjYWxsYmFjaywgYSBwcm9wZXJ0eSBtYXRjaGVyLCBvciBhIHByb3BlcnR5IGFjY2Vzc29yLlxuICB2YXIgY2IgPSBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgYXJnQ291bnQpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuIF8uaWRlbnRpdHk7XG4gICAgaWYgKF8uaXNGdW5jdGlvbih2YWx1ZSkpIHJldHVybiBvcHRpbWl6ZUNiKHZhbHVlLCBjb250ZXh0LCBhcmdDb3VudCk7XG4gICAgaWYgKF8uaXNPYmplY3QodmFsdWUpKSByZXR1cm4gXy5tYXRjaGVyKHZhbHVlKTtcbiAgICByZXR1cm4gXy5wcm9wZXJ0eSh2YWx1ZSk7XG4gIH07XG4gIF8uaXRlcmF0ZWUgPSBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCkge1xuICAgIHJldHVybiBjYih2YWx1ZSwgY29udGV4dCwgSW5maW5pdHkpO1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhc3NpZ25lciBmdW5jdGlvbnMuXG4gIHZhciBjcmVhdGVBc3NpZ25lciA9IGZ1bmN0aW9uKGtleXNGdW5jLCB1bmRlZmluZWRPbmx5KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICBpZiAobGVuZ3RoIDwgMiB8fCBvYmogPT0gbnVsbCkgcmV0dXJuIG9iajtcbiAgICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpbmRleF0sXG4gICAgICAgICAgICBrZXlzID0ga2V5c0Z1bmMoc291cmNlKSxcbiAgICAgICAgICAgIGwgPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICBpZiAoIXVuZGVmaW5lZE9ubHkgfHwgb2JqW2tleV0gPT09IHZvaWQgMCkgb2JqW2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9O1xuICB9O1xuXG4gIC8vIEFuIGludGVybmFsIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhIG5ldyBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIGFub3RoZXIuXG4gIHZhciBiYXNlQ3JlYXRlID0gZnVuY3Rpb24ocHJvdG90eXBlKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KHByb3RvdHlwZSkpIHJldHVybiB7fTtcbiAgICBpZiAobmF0aXZlQ3JlYXRlKSByZXR1cm4gbmF0aXZlQ3JlYXRlKHByb3RvdHlwZSk7XG4gICAgQ3Rvci5wcm90b3R5cGUgPSBwcm90b3R5cGU7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBDdG9yO1xuICAgIEN0b3IucHJvdG90eXBlID0gbnVsbDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIEhlbHBlciBmb3IgY29sbGVjdGlvbiBtZXRob2RzIHRvIGRldGVybWluZSB3aGV0aGVyIGEgY29sbGVjdGlvblxuICAvLyBzaG91bGQgYmUgaXRlcmF0ZWQgYXMgYW4gYXJyYXkgb3IgYXMgYW4gb2JqZWN0XG4gIC8vIFJlbGF0ZWQ6IGh0dHA6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLXRvbGVuZ3RoXG4gIHZhciBNQVhfQVJSQVlfSU5ERVggPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuICB2YXIgaXNBcnJheUxpa2UgPSBmdW5jdGlvbihjb2xsZWN0aW9uKSB7XG4gICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24gJiYgY29sbGVjdGlvbi5sZW5ndGg7XG4gICAgcmV0dXJuIHR5cGVvZiBsZW5ndGggPT0gJ251bWJlcicgJiYgbGVuZ3RoID49IDAgJiYgbGVuZ3RoIDw9IE1BWF9BUlJBWV9JTkRFWDtcbiAgfTtcblxuICAvLyBDb2xsZWN0aW9uIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFRoZSBjb3JuZXJzdG9uZSwgYW4gYGVhY2hgIGltcGxlbWVudGF0aW9uLCBha2EgYGZvckVhY2hgLlxuICAvLyBIYW5kbGVzIHJhdyBvYmplY3RzIGluIGFkZGl0aW9uIHRvIGFycmF5LWxpa2VzLiBUcmVhdHMgYWxsXG4gIC8vIHNwYXJzZSBhcnJheS1saWtlcyBhcyBpZiB0aGV5IHdlcmUgZGVuc2UuXG4gIF8uZWFjaCA9IF8uZm9yRWFjaCA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IG9wdGltaXplQ2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciBpLCBsZW5ndGg7XG4gICAgaWYgKGlzQXJyYXlMaWtlKG9iaikpIHtcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVyYXRlZShvYmpbaV0sIGksIG9iaik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBrZXlzID0gXy5rZXlzKG9iaik7XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZXJhdGVlKG9ialtrZXlzW2ldXSwga2V5c1tpXSwgb2JqKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIHJlc3VsdHMgb2YgYXBwbHlpbmcgdGhlIGl0ZXJhdGVlIHRvIGVhY2ggZWxlbWVudC5cbiAgXy5tYXAgPSBfLmNvbGxlY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICAgIHJlc3VsdHMgPSBBcnJheShsZW5ndGgpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICByZXN1bHRzW2luZGV4XSA9IGl0ZXJhdGVlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgcmVkdWNpbmcgZnVuY3Rpb24gaXRlcmF0aW5nIGxlZnQgb3IgcmlnaHQuXG4gIGZ1bmN0aW9uIGNyZWF0ZVJlZHVjZShkaXIpIHtcbiAgICAvLyBPcHRpbWl6ZWQgaXRlcmF0b3IgZnVuY3Rpb24gYXMgdXNpbmcgYXJndW1lbnRzLmxlbmd0aFxuICAgIC8vIGluIHRoZSBtYWluIGZ1bmN0aW9uIHdpbGwgZGVvcHRpbWl6ZSB0aGUsIHNlZSAjMTk5MS5cbiAgICBmdW5jdGlvbiBpdGVyYXRvcihvYmosIGl0ZXJhdGVlLCBtZW1vLCBrZXlzLCBpbmRleCwgbGVuZ3RoKSB7XG4gICAgICBmb3IgKDsgaW5kZXggPj0gMCAmJiBpbmRleCA8IGxlbmd0aDsgaW5kZXggKz0gZGlyKSB7XG4gICAgICAgIHZhciBjdXJyZW50S2V5ID0ga2V5cyA/IGtleXNbaW5kZXhdIDogaW5kZXg7XG4gICAgICAgIG1lbW8gPSBpdGVyYXRlZShtZW1vLCBvYmpbY3VycmVudEtleV0sIGN1cnJlbnRLZXksIG9iaik7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgbWVtbywgY29udGV4dCkge1xuICAgICAgaXRlcmF0ZWUgPSBvcHRpbWl6ZUNiKGl0ZXJhdGVlLCBjb250ZXh0LCA0KTtcbiAgICAgIHZhciBrZXlzID0gIWlzQXJyYXlMaWtlKG9iaikgJiYgXy5rZXlzKG9iaiksXG4gICAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGgsXG4gICAgICAgICAgaW5kZXggPSBkaXIgPiAwID8gMCA6IGxlbmd0aCAtIDE7XG4gICAgICAvLyBEZXRlcm1pbmUgdGhlIGluaXRpYWwgdmFsdWUgaWYgbm9uZSBpcyBwcm92aWRlZC5cbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgICAgICBtZW1vID0gb2JqW2tleXMgPyBrZXlzW2luZGV4XSA6IGluZGV4XTtcbiAgICAgICAgaW5kZXggKz0gZGlyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdG9yKG9iaiwgaXRlcmF0ZWUsIG1lbW8sIGtleXMsIGluZGV4LCBsZW5ndGgpO1xuICAgIH07XG4gIH1cblxuICAvLyAqKlJlZHVjZSoqIGJ1aWxkcyB1cCBhIHNpbmdsZSByZXN1bHQgZnJvbSBhIGxpc3Qgb2YgdmFsdWVzLCBha2EgYGluamVjdGAsXG4gIC8vIG9yIGBmb2xkbGAuXG4gIF8ucmVkdWNlID0gXy5mb2xkbCA9IF8uaW5qZWN0ID0gY3JlYXRlUmVkdWNlKDEpO1xuXG4gIC8vIFRoZSByaWdodC1hc3NvY2lhdGl2ZSB2ZXJzaW9uIG9mIHJlZHVjZSwgYWxzbyBrbm93biBhcyBgZm9sZHJgLlxuICBfLnJlZHVjZVJpZ2h0ID0gXy5mb2xkciA9IGNyZWF0ZVJlZHVjZSgtMSk7XG5cbiAgLy8gUmV0dXJuIHRoZSBmaXJzdCB2YWx1ZSB3aGljaCBwYXNzZXMgYSB0cnV0aCB0ZXN0LiBBbGlhc2VkIGFzIGBkZXRlY3RgLlxuICBfLmZpbmQgPSBfLmRldGVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIGtleTtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkge1xuICAgICAga2V5ID0gXy5maW5kSW5kZXgob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrZXkgPSBfLmZpbmRLZXkob2JqLCBwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIH1cbiAgICBpZiAoa2V5ICE9PSB2b2lkIDAgJiYga2V5ICE9PSAtMSkgcmV0dXJuIG9ialtrZXldO1xuICB9O1xuXG4gIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIHRoYXQgcGFzcyBhIHRydXRoIHRlc3QuXG4gIC8vIEFsaWFzZWQgYXMgYHNlbGVjdGAuXG4gIF8uZmlsdGVyID0gXy5zZWxlY3QgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHRzID0gW107XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBsaXN0KSkgcmVzdWx0cy5wdXNoKHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcblxuICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyBmb3Igd2hpY2ggYSB0cnV0aCB0ZXN0IGZhaWxzLlxuICBfLnJlamVjdCA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIF8uZmlsdGVyKG9iaiwgXy5uZWdhdGUoY2IocHJlZGljYXRlKSksIGNvbnRleHQpO1xuICB9O1xuXG4gIC8vIERldGVybWluZSB3aGV0aGVyIGFsbCBvZiB0aGUgZWxlbWVudHMgbWF0Y2ggYSB0cnV0aCB0ZXN0LlxuICAvLyBBbGlhc2VkIGFzIGBhbGxgLlxuICBfLmV2ZXJ5ID0gXy5hbGwgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGg7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIGlmICghcHJlZGljYXRlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICAvLyBEZXRlcm1pbmUgaWYgYXQgbGVhc3Qgb25lIGVsZW1lbnQgaW4gdGhlIG9iamVjdCBtYXRjaGVzIGEgdHJ1dGggdGVzdC5cbiAgLy8gQWxpYXNlZCBhcyBgYW55YC5cbiAgXy5zb21lID0gXy5hbnkgPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAhaXNBcnJheUxpa2Uob2JqKSAmJiBfLmtleXMob2JqKSxcbiAgICAgICAgbGVuZ3RoID0gKGtleXMgfHwgb2JqKS5sZW5ndGg7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIGN1cnJlbnRLZXkgPSBrZXlzID8ga2V5c1tpbmRleF0gOiBpbmRleDtcbiAgICAgIGlmIChwcmVkaWNhdGUob2JqW2N1cnJlbnRLZXldLCBjdXJyZW50S2V5LCBvYmopKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIC8vIERldGVybWluZSBpZiB0aGUgYXJyYXkgb3Igb2JqZWN0IGNvbnRhaW5zIGEgZ2l2ZW4gdmFsdWUgKHVzaW5nIGA9PT1gKS5cbiAgLy8gQWxpYXNlZCBhcyBgaW5jbHVkZXNgIGFuZCBgaW5jbHVkZWAuXG4gIF8uY29udGFpbnMgPSBfLmluY2x1ZGVzID0gXy5pbmNsdWRlID0gZnVuY3Rpb24ob2JqLCB0YXJnZXQsIGZyb21JbmRleCkge1xuICAgIGlmICghaXNBcnJheUxpa2Uob2JqKSkgb2JqID0gXy52YWx1ZXMob2JqKTtcbiAgICByZXR1cm4gXy5pbmRleE9mKG9iaiwgdGFyZ2V0LCB0eXBlb2YgZnJvbUluZGV4ID09ICdudW1iZXInICYmIGZyb21JbmRleCkgPj0gMDtcbiAgfTtcblxuICAvLyBJbnZva2UgYSBtZXRob2QgKHdpdGggYXJndW1lbnRzKSBvbiBldmVyeSBpdGVtIGluIGEgY29sbGVjdGlvbi5cbiAgXy5pbnZva2UgPSBmdW5jdGlvbihvYmosIG1ldGhvZCkge1xuICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpO1xuICAgIHZhciBpc0Z1bmMgPSBfLmlzRnVuY3Rpb24obWV0aG9kKTtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIGZ1bmMgPSBpc0Z1bmMgPyBtZXRob2QgOiB2YWx1ZVttZXRob2RdO1xuICAgICAgcmV0dXJuIGZ1bmMgPT0gbnVsbCA/IGZ1bmMgOiBmdW5jLmFwcGx5KHZhbHVlLCBhcmdzKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBtYXBgOiBmZXRjaGluZyBhIHByb3BlcnR5LlxuICBfLnBsdWNrID0gZnVuY3Rpb24ob2JqLCBrZXkpIHtcbiAgICByZXR1cm4gXy5tYXAob2JqLCBfLnByb3BlcnR5KGtleSkpO1xuICB9O1xuXG4gIC8vIENvbnZlbmllbmNlIHZlcnNpb24gb2YgYSBjb21tb24gdXNlIGNhc2Ugb2YgYGZpbHRlcmA6IHNlbGVjdGluZyBvbmx5IG9iamVjdHNcbiAgLy8gY29udGFpbmluZyBzcGVjaWZpYyBga2V5OnZhbHVlYCBwYWlycy5cbiAgXy53aGVyZSA9IGZ1bmN0aW9uKG9iaiwgYXR0cnMpIHtcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBfLm1hdGNoZXIoYXR0cnMpKTtcbiAgfTtcblxuICAvLyBDb252ZW5pZW5jZSB2ZXJzaW9uIG9mIGEgY29tbW9uIHVzZSBjYXNlIG9mIGBmaW5kYDogZ2V0dGluZyB0aGUgZmlyc3Qgb2JqZWN0XG4gIC8vIGNvbnRhaW5pbmcgc3BlY2lmaWMgYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8uZmluZFdoZXJlID0gZnVuY3Rpb24ob2JqLCBhdHRycykge1xuICAgIHJldHVybiBfLmZpbmQob2JqLCBfLm1hdGNoZXIoYXR0cnMpKTtcbiAgfTtcblxuICAvLyBSZXR1cm4gdGhlIG1heGltdW0gZWxlbWVudCAob3IgZWxlbWVudC1iYXNlZCBjb21wdXRhdGlvbikuXG4gIF8ubWF4ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIHZhciByZXN1bHQgPSAtSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IC1JbmZpbml0eSxcbiAgICAgICAgdmFsdWUsIGNvbXB1dGVkO1xuICAgIGlmIChpdGVyYXRlZSA9PSBudWxsICYmIG9iaiAhPSBudWxsKSB7XG4gICAgICBvYmogPSBpc0FycmF5TGlrZShvYmopID8gb2JqIDogXy52YWx1ZXMob2JqKTtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFsdWUgPSBvYmpbaV07XG4gICAgICAgIGlmICh2YWx1ZSA+IHJlc3VsdCkge1xuICAgICAgICAgIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgICAgXy5lYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBsaXN0KSB7XG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBsaXN0KTtcbiAgICAgICAgaWYgKGNvbXB1dGVkID4gbGFzdENvbXB1dGVkIHx8IGNvbXB1dGVkID09PSAtSW5maW5pdHkgJiYgcmVzdWx0ID09PSAtSW5maW5pdHkpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBtaW5pbXVtIGVsZW1lbnQgKG9yIGVsZW1lbnQtYmFzZWQgY29tcHV0YXRpb24pLlxuICBfLm1pbiA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICB2YXIgcmVzdWx0ID0gSW5maW5pdHksIGxhc3RDb21wdXRlZCA9IEluZmluaXR5LFxuICAgICAgICB2YWx1ZSwgY29tcHV0ZWQ7XG4gICAgaWYgKGl0ZXJhdGVlID09IG51bGwgJiYgb2JqICE9IG51bGwpIHtcbiAgICAgIG9iaiA9IGlzQXJyYXlMaWtlKG9iaikgPyBvYmogOiBfLnZhbHVlcyhvYmopO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YWx1ZSA9IG9ialtpXTtcbiAgICAgICAgaWYgKHZhbHVlIDwgcmVzdWx0KSB7XG4gICAgICAgICAgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgICBfLmVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGxpc3QpIHtcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpO1xuICAgICAgICBpZiAoY29tcHV0ZWQgPCBsYXN0Q29tcHV0ZWQgfHwgY29tcHV0ZWQgPT09IEluZmluaXR5ICYmIHJlc3VsdCA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBsYXN0Q29tcHV0ZWQgPSBjb21wdXRlZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gU2h1ZmZsZSBhIGNvbGxlY3Rpb24sIHVzaW5nIHRoZSBtb2Rlcm4gdmVyc2lvbiBvZiB0aGVcbiAgLy8gW0Zpc2hlci1ZYXRlcyBzaHVmZmxlXShodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0Zpc2hlcuKAk1lhdGVzX3NodWZmbGUpLlxuICBfLnNodWZmbGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgc2V0ID0gaXNBcnJheUxpa2Uob2JqKSA/IG9iaiA6IF8udmFsdWVzKG9iaik7XG4gICAgdmFyIGxlbmd0aCA9IHNldC5sZW5ndGg7XG4gICAgdmFyIHNodWZmbGVkID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpbmRleCA9IDAsIHJhbmQ7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICByYW5kID0gXy5yYW5kb20oMCwgaW5kZXgpO1xuICAgICAgaWYgKHJhbmQgIT09IGluZGV4KSBzaHVmZmxlZFtpbmRleF0gPSBzaHVmZmxlZFtyYW5kXTtcbiAgICAgIHNodWZmbGVkW3JhbmRdID0gc2V0W2luZGV4XTtcbiAgICB9XG4gICAgcmV0dXJuIHNodWZmbGVkO1xuICB9O1xuXG4gIC8vIFNhbXBsZSAqKm4qKiByYW5kb20gdmFsdWVzIGZyb20gYSBjb2xsZWN0aW9uLlxuICAvLyBJZiAqKm4qKiBpcyBub3Qgc3BlY2lmaWVkLCByZXR1cm5zIGEgc2luZ2xlIHJhbmRvbSBlbGVtZW50LlxuICAvLyBUaGUgaW50ZXJuYWwgYGd1YXJkYCBhcmd1bWVudCBhbGxvd3MgaXQgdG8gd29yayB3aXRoIGBtYXBgLlxuICBfLnNhbXBsZSA9IGZ1bmN0aW9uKG9iaiwgbiwgZ3VhcmQpIHtcbiAgICBpZiAobiA9PSBudWxsIHx8IGd1YXJkKSB7XG4gICAgICBpZiAoIWlzQXJyYXlMaWtlKG9iaikpIG9iaiA9IF8udmFsdWVzKG9iaik7XG4gICAgICByZXR1cm4gb2JqW18ucmFuZG9tKG9iai5sZW5ndGggLSAxKV07XG4gICAgfVxuICAgIHJldHVybiBfLnNodWZmbGUob2JqKS5zbGljZSgwLCBNYXRoLm1heCgwLCBuKSk7XG4gIH07XG5cbiAgLy8gU29ydCB0aGUgb2JqZWN0J3MgdmFsdWVzIGJ5IGEgY3JpdGVyaW9uIHByb2R1Y2VkIGJ5IGFuIGl0ZXJhdGVlLlxuICBfLnNvcnRCeSA9IGZ1bmN0aW9uKG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICByZXR1cm4gXy5wbHVjayhfLm1hcChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgbGlzdCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIGNyaXRlcmlhOiBpdGVyYXRlZSh2YWx1ZSwgaW5kZXgsIGxpc3QpXG4gICAgICB9O1xuICAgIH0pLnNvcnQoZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgICAgIHZhciBhID0gbGVmdC5jcml0ZXJpYTtcbiAgICAgIHZhciBiID0gcmlnaHQuY3JpdGVyaWE7XG4gICAgICBpZiAoYSAhPT0gYikge1xuICAgICAgICBpZiAoYSA+IGIgfHwgYSA9PT0gdm9pZCAwKSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGEgPCBiIHx8IGIgPT09IHZvaWQgMCkgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxlZnQuaW5kZXggLSByaWdodC5pbmRleDtcbiAgICB9KSwgJ3ZhbHVlJyk7XG4gIH07XG5cbiAgLy8gQW4gaW50ZXJuYWwgZnVuY3Rpb24gdXNlZCBmb3IgYWdncmVnYXRlIFwiZ3JvdXAgYnlcIiBvcGVyYXRpb25zLlxuICB2YXIgZ3JvdXAgPSBmdW5jdGlvbihiZWhhdmlvcikge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0KTtcbiAgICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgICB2YXIga2V5ID0gaXRlcmF0ZWUodmFsdWUsIGluZGV4LCBvYmopO1xuICAgICAgICBiZWhhdmlvcihyZXN1bHQsIHZhbHVlLCBrZXkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gR3JvdXBzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24uIFBhc3MgZWl0aGVyIGEgc3RyaW5nIGF0dHJpYnV0ZVxuICAvLyB0byBncm91cCBieSwgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNyaXRlcmlvbi5cbiAgXy5ncm91cEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgaWYgKF8uaGFzKHJlc3VsdCwga2V5KSkgcmVzdWx0W2tleV0ucHVzaCh2YWx1ZSk7IGVsc2UgcmVzdWx0W2tleV0gPSBbdmFsdWVdO1xuICB9KTtcblxuICAvLyBJbmRleGVzIHRoZSBvYmplY3QncyB2YWx1ZXMgYnkgYSBjcml0ZXJpb24sIHNpbWlsYXIgdG8gYGdyb3VwQnlgLCBidXQgZm9yXG4gIC8vIHdoZW4geW91IGtub3cgdGhhdCB5b3VyIGluZGV4IHZhbHVlcyB3aWxsIGJlIHVuaXF1ZS5cbiAgXy5pbmRleEJ5ID0gZ3JvdXAoZnVuY3Rpb24ocmVzdWx0LCB2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgfSk7XG5cbiAgLy8gQ291bnRzIGluc3RhbmNlcyBvZiBhbiBvYmplY3QgdGhhdCBncm91cCBieSBhIGNlcnRhaW4gY3JpdGVyaW9uLiBQYXNzXG4gIC8vIGVpdGhlciBhIHN0cmluZyBhdHRyaWJ1dGUgdG8gY291bnQgYnksIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZVxuICAvLyBjcml0ZXJpb24uXG4gIF8uY291bnRCeSA9IGdyb3VwKGZ1bmN0aW9uKHJlc3VsdCwgdmFsdWUsIGtleSkge1xuICAgIGlmIChfLmhhcyhyZXN1bHQsIGtleSkpIHJlc3VsdFtrZXldKys7IGVsc2UgcmVzdWx0W2tleV0gPSAxO1xuICB9KTtcblxuICAvLyBTYWZlbHkgY3JlYXRlIGEgcmVhbCwgbGl2ZSBhcnJheSBmcm9tIGFueXRoaW5nIGl0ZXJhYmxlLlxuICBfLnRvQXJyYXkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAoIW9iaikgcmV0dXJuIFtdO1xuICAgIGlmIChfLmlzQXJyYXkob2JqKSkgcmV0dXJuIHNsaWNlLmNhbGwob2JqKTtcbiAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkgcmV0dXJuIF8ubWFwKG9iaiwgXy5pZGVudGl0eSk7XG4gICAgcmV0dXJuIF8udmFsdWVzKG9iaik7XG4gIH07XG5cbiAgLy8gUmV0dXJuIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gYW4gb2JqZWN0LlxuICBfLnNpemUgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiAwO1xuICAgIHJldHVybiBpc0FycmF5TGlrZShvYmopID8gb2JqLmxlbmd0aCA6IF8ua2V5cyhvYmopLmxlbmd0aDtcbiAgfTtcblxuICAvLyBTcGxpdCBhIGNvbGxlY3Rpb24gaW50byB0d28gYXJyYXlzOiBvbmUgd2hvc2UgZWxlbWVudHMgYWxsIHNhdGlzZnkgdGhlIGdpdmVuXG4gIC8vIHByZWRpY2F0ZSwgYW5kIG9uZSB3aG9zZSBlbGVtZW50cyBhbGwgZG8gbm90IHNhdGlzZnkgdGhlIHByZWRpY2F0ZS5cbiAgXy5wYXJ0aXRpb24gPSBmdW5jdGlvbihvYmosIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHByZWRpY2F0ZSA9IGNiKHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgdmFyIHBhc3MgPSBbXSwgZmFpbCA9IFtdO1xuICAgIF8uZWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iaikge1xuICAgICAgKHByZWRpY2F0ZSh2YWx1ZSwga2V5LCBvYmopID8gcGFzcyA6IGZhaWwpLnB1c2godmFsdWUpO1xuICAgIH0pO1xuICAgIHJldHVybiBbcGFzcywgZmFpbF07XG4gIH07XG5cbiAgLy8gQXJyYXkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEdldCB0aGUgZmlyc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgZmlyc3QgTlxuICAvLyB2YWx1ZXMgaW4gdGhlIGFycmF5LiBBbGlhc2VkIGFzIGBoZWFkYCBhbmQgYHRha2VgLiBUaGUgKipndWFyZCoqIGNoZWNrXG4gIC8vIGFsbG93cyBpdCB0byB3b3JrIHdpdGggYF8ubWFwYC5cbiAgXy5maXJzdCA9IF8uaGVhZCA9IF8udGFrZSA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHJldHVybiBhcnJheVswXTtcbiAgICByZXR1cm4gXy5pbml0aWFsKGFycmF5LCBhcnJheS5sZW5ndGggLSBuKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGV2ZXJ5dGhpbmcgYnV0IHRoZSBsYXN0IGVudHJ5IG9mIHRoZSBhcnJheS4gRXNwZWNpYWxseSB1c2VmdWwgb25cbiAgLy8gdGhlIGFyZ3VtZW50cyBvYmplY3QuIFBhc3NpbmcgKipuKiogd2lsbCByZXR1cm4gYWxsIHRoZSB2YWx1ZXMgaW5cbiAgLy8gdGhlIGFycmF5LCBleGNsdWRpbmcgdGhlIGxhc3QgTi5cbiAgXy5pbml0aWFsID0gZnVuY3Rpb24oYXJyYXksIG4sIGd1YXJkKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwoYXJyYXksIDAsIE1hdGgubWF4KDAsIGFycmF5Lmxlbmd0aCAtIChuID09IG51bGwgfHwgZ3VhcmQgPyAxIDogbikpKTtcbiAgfTtcblxuICAvLyBHZXQgdGhlIGxhc3QgZWxlbWVudCBvZiBhbiBhcnJheS4gUGFzc2luZyAqKm4qKiB3aWxsIHJldHVybiB0aGUgbGFzdCBOXG4gIC8vIHZhbHVlcyBpbiB0aGUgYXJyYXkuXG4gIF8ubGFzdCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSByZXR1cm4gdm9pZCAwO1xuICAgIGlmIChuID09IG51bGwgfHwgZ3VhcmQpIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gXy5yZXN0KGFycmF5LCBNYXRoLm1heCgwLCBhcnJheS5sZW5ndGggLSBuKSk7XG4gIH07XG5cbiAgLy8gUmV0dXJucyBldmVyeXRoaW5nIGJ1dCB0aGUgZmlyc3QgZW50cnkgb2YgdGhlIGFycmF5LiBBbGlhc2VkIGFzIGB0YWlsYCBhbmQgYGRyb3BgLlxuICAvLyBFc3BlY2lhbGx5IHVzZWZ1bCBvbiB0aGUgYXJndW1lbnRzIG9iamVjdC4gUGFzc2luZyBhbiAqKm4qKiB3aWxsIHJldHVyblxuICAvLyB0aGUgcmVzdCBOIHZhbHVlcyBpbiB0aGUgYXJyYXkuXG4gIF8ucmVzdCA9IF8udGFpbCA9IF8uZHJvcCA9IGZ1bmN0aW9uKGFycmF5LCBuLCBndWFyZCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKGFycmF5LCBuID09IG51bGwgfHwgZ3VhcmQgPyAxIDogbik7XG4gIH07XG5cbiAgLy8gVHJpbSBvdXQgYWxsIGZhbHN5IHZhbHVlcyBmcm9tIGFuIGFycmF5LlxuICBfLmNvbXBhY3QgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgXy5pZGVudGl0eSk7XG4gIH07XG5cbiAgLy8gSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gb2YgYSByZWN1cnNpdmUgYGZsYXR0ZW5gIGZ1bmN0aW9uLlxuICB2YXIgZmxhdHRlbiA9IGZ1bmN0aW9uKGlucHV0LCBzaGFsbG93LCBzdHJpY3QsIHN0YXJ0SW5kZXgpIHtcbiAgICB2YXIgb3V0cHV0ID0gW10sIGlkeCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IHN0YXJ0SW5kZXggfHwgMCwgbGVuZ3RoID0gaW5wdXQgJiYgaW5wdXQubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IGlucHV0W2ldO1xuICAgICAgaWYgKGlzQXJyYXlMaWtlKHZhbHVlKSAmJiAoXy5pc0FycmF5KHZhbHVlKSB8fCBfLmlzQXJndW1lbnRzKHZhbHVlKSkpIHtcbiAgICAgICAgLy9mbGF0dGVuIGN1cnJlbnQgbGV2ZWwgb2YgYXJyYXkgb3IgYXJndW1lbnRzIG9iamVjdFxuICAgICAgICBpZiAoIXNoYWxsb3cpIHZhbHVlID0gZmxhdHRlbih2YWx1ZSwgc2hhbGxvdywgc3RyaWN0KTtcbiAgICAgICAgdmFyIGogPSAwLCBsZW4gPSB2YWx1ZS5sZW5ndGg7XG4gICAgICAgIG91dHB1dC5sZW5ndGggKz0gbGVuO1xuICAgICAgICB3aGlsZSAoaiA8IGxlbikge1xuICAgICAgICAgIG91dHB1dFtpZHgrK10gPSB2YWx1ZVtqKytdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFzdHJpY3QpIHtcbiAgICAgICAgb3V0cHV0W2lkeCsrXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xuICB9O1xuXG4gIC8vIEZsYXR0ZW4gb3V0IGFuIGFycmF5LCBlaXRoZXIgcmVjdXJzaXZlbHkgKGJ5IGRlZmF1bHQpLCBvciBqdXN0IG9uZSBsZXZlbC5cbiAgXy5mbGF0dGVuID0gZnVuY3Rpb24oYXJyYXksIHNoYWxsb3cpIHtcbiAgICByZXR1cm4gZmxhdHRlbihhcnJheSwgc2hhbGxvdywgZmFsc2UpO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHZlcnNpb24gb2YgdGhlIGFycmF5IHRoYXQgZG9lcyBub3QgY29udGFpbiB0aGUgc3BlY2lmaWVkIHZhbHVlKHMpLlxuICBfLndpdGhvdXQgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHJldHVybiBfLmRpZmZlcmVuY2UoYXJyYXksIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gIH07XG5cbiAgLy8gUHJvZHVjZSBhIGR1cGxpY2F0ZS1mcmVlIHZlcnNpb24gb2YgdGhlIGFycmF5LiBJZiB0aGUgYXJyYXkgaGFzIGFscmVhZHlcbiAgLy8gYmVlbiBzb3J0ZWQsIHlvdSBoYXZlIHRoZSBvcHRpb24gb2YgdXNpbmcgYSBmYXN0ZXIgYWxnb3JpdGhtLlxuICAvLyBBbGlhc2VkIGFzIGB1bmlxdWVgLlxuICBfLnVuaXEgPSBfLnVuaXF1ZSA9IGZ1bmN0aW9uKGFycmF5LCBpc1NvcnRlZCwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIFtdO1xuICAgIGlmICghXy5pc0Jvb2xlYW4oaXNTb3J0ZWQpKSB7XG4gICAgICBjb250ZXh0ID0gaXRlcmF0ZWU7XG4gICAgICBpdGVyYXRlZSA9IGlzU29ydGVkO1xuICAgICAgaXNTb3J0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgaWYgKGl0ZXJhdGVlICE9IG51bGwpIGl0ZXJhdGVlID0gY2IoaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgc2VlbiA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaV0sXG4gICAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSA/IGl0ZXJhdGVlKHZhbHVlLCBpLCBhcnJheSkgOiB2YWx1ZTtcbiAgICAgIGlmIChpc1NvcnRlZCkge1xuICAgICAgICBpZiAoIWkgfHwgc2VlbiAhPT0gY29tcHV0ZWQpIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgc2VlbiA9IGNvbXB1dGVkO1xuICAgICAgfSBlbHNlIGlmIChpdGVyYXRlZSkge1xuICAgICAgICBpZiAoIV8uY29udGFpbnMoc2VlbiwgY29tcHV0ZWQpKSB7XG4gICAgICAgICAgc2Vlbi5wdXNoKGNvbXB1dGVkKTtcbiAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIV8uY29udGFpbnMocmVzdWx0LCB2YWx1ZSkpIHtcbiAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFByb2R1Y2UgYW4gYXJyYXkgdGhhdCBjb250YWlucyB0aGUgdW5pb246IGVhY2ggZGlzdGluY3QgZWxlbWVudCBmcm9tIGFsbCBvZlxuICAvLyB0aGUgcGFzc2VkLWluIGFycmF5cy5cbiAgXy51bmlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLnVuaXEoZmxhdHRlbihhcmd1bWVudHMsIHRydWUsIHRydWUpKTtcbiAgfTtcblxuICAvLyBQcm9kdWNlIGFuIGFycmF5IHRoYXQgY29udGFpbnMgZXZlcnkgaXRlbSBzaGFyZWQgYmV0d2VlbiBhbGwgdGhlXG4gIC8vIHBhc3NlZC1pbiBhcnJheXMuXG4gIF8uaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkgcmV0dXJuIFtdO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgYXJnc0xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaXRlbSA9IGFycmF5W2ldO1xuICAgICAgaWYgKF8uY29udGFpbnMocmVzdWx0LCBpdGVtKSkgY29udGludWU7XG4gICAgICBmb3IgKHZhciBqID0gMTsgaiA8IGFyZ3NMZW5ndGg7IGorKykge1xuICAgICAgICBpZiAoIV8uY29udGFpbnMoYXJndW1lbnRzW2pdLCBpdGVtKSkgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoaiA9PT0gYXJnc0xlbmd0aCkgcmVzdWx0LnB1c2goaXRlbSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gVGFrZSB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIG9uZSBhcnJheSBhbmQgYSBudW1iZXIgb2Ygb3RoZXIgYXJyYXlzLlxuICAvLyBPbmx5IHRoZSBlbGVtZW50cyBwcmVzZW50IGluIGp1c3QgdGhlIGZpcnN0IGFycmF5IHdpbGwgcmVtYWluLlxuICBfLmRpZmZlcmVuY2UgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciByZXN0ID0gZmxhdHRlbihhcmd1bWVudHMsIHRydWUsIHRydWUsIDEpO1xuICAgIHJldHVybiBfLmZpbHRlcihhcnJheSwgZnVuY3Rpb24odmFsdWUpe1xuICAgICAgcmV0dXJuICFfLmNvbnRhaW5zKHJlc3QsIHZhbHVlKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBaaXAgdG9nZXRoZXIgbXVsdGlwbGUgbGlzdHMgaW50byBhIHNpbmdsZSBhcnJheSAtLSBlbGVtZW50cyB0aGF0IHNoYXJlXG4gIC8vIGFuIGluZGV4IGdvIHRvZ2V0aGVyLlxuICBfLnppcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBfLnVuemlwKGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgLy8gQ29tcGxlbWVudCBvZiBfLnppcC4gVW56aXAgYWNjZXB0cyBhbiBhcnJheSBvZiBhcnJheXMgYW5kIGdyb3Vwc1xuICAvLyBlYWNoIGFycmF5J3MgZWxlbWVudHMgb24gc2hhcmVkIGluZGljZXNcbiAgXy51bnppcCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIGxlbmd0aCA9IGFycmF5ICYmIF8ubWF4KGFycmF5LCAnbGVuZ3RoJykubGVuZ3RoIHx8IDA7XG4gICAgdmFyIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICByZXN1bHRbaW5kZXhdID0gXy5wbHVjayhhcnJheSwgaW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIENvbnZlcnRzIGxpc3RzIGludG8gb2JqZWN0cy4gUGFzcyBlaXRoZXIgYSBzaW5nbGUgYXJyYXkgb2YgYFtrZXksIHZhbHVlXWBcbiAgLy8gcGFpcnMsIG9yIHR3byBwYXJhbGxlbCBhcnJheXMgb2YgdGhlIHNhbWUgbGVuZ3RoIC0tIG9uZSBvZiBrZXlzLCBhbmQgb25lIG9mXG4gIC8vIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlcy5cbiAgXy5vYmplY3QgPSBmdW5jdGlvbihsaXN0LCB2YWx1ZXMpIHtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGxpc3QgJiYgbGlzdC5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICByZXN1bHRbbGlzdFtpXV0gPSB2YWx1ZXNbaV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRbbGlzdFtpXVswXV0gPSBsaXN0W2ldWzFdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIC8vIFJldHVybiB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYW4gaXRlbSBpbiBhbiBhcnJheSxcbiAgLy8gb3IgLTEgaWYgdGhlIGl0ZW0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBhcnJheS5cbiAgLy8gSWYgdGhlIGFycmF5IGlzIGxhcmdlIGFuZCBhbHJlYWR5IGluIHNvcnQgb3JkZXIsIHBhc3MgYHRydWVgXG4gIC8vIGZvciAqKmlzU29ydGVkKiogdG8gdXNlIGJpbmFyeSBzZWFyY2guXG4gIF8uaW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBpc1NvcnRlZCkge1xuICAgIHZhciBpID0gMCwgbGVuZ3RoID0gYXJyYXkgJiYgYXJyYXkubGVuZ3RoO1xuICAgIGlmICh0eXBlb2YgaXNTb3J0ZWQgPT0gJ251bWJlcicpIHtcbiAgICAgIGkgPSBpc1NvcnRlZCA8IDAgPyBNYXRoLm1heCgwLCBsZW5ndGggKyBpc1NvcnRlZCkgOiBpc1NvcnRlZDtcbiAgICB9IGVsc2UgaWYgKGlzU29ydGVkICYmIGxlbmd0aCkge1xuICAgICAgaSA9IF8uc29ydGVkSW5kZXgoYXJyYXksIGl0ZW0pO1xuICAgICAgcmV0dXJuIGFycmF5W2ldID09PSBpdGVtID8gaSA6IC0xO1xuICAgIH1cbiAgICBpZiAoaXRlbSAhPT0gaXRlbSkge1xuICAgICAgcmV0dXJuIF8uZmluZEluZGV4KHNsaWNlLmNhbGwoYXJyYXksIGkpLCBfLmlzTmFOKTtcbiAgICB9XG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykgaWYgKGFycmF5W2ldID09PSBpdGVtKSByZXR1cm4gaTtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgXy5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uKGFycmF5LCBpdGVtLCBmcm9tKSB7XG4gICAgdmFyIGlkeCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcbiAgICBpZiAodHlwZW9mIGZyb20gPT0gJ251bWJlcicpIHtcbiAgICAgIGlkeCA9IGZyb20gPCAwID8gaWR4ICsgZnJvbSArIDEgOiBNYXRoLm1pbihpZHgsIGZyb20gKyAxKTtcbiAgICB9XG4gICAgaWYgKGl0ZW0gIT09IGl0ZW0pIHtcbiAgICAgIHJldHVybiBfLmZpbmRMYXN0SW5kZXgoc2xpY2UuY2FsbChhcnJheSwgMCwgaWR4KSwgXy5pc05hTik7XG4gICAgfVxuICAgIHdoaWxlICgtLWlkeCA+PSAwKSBpZiAoYXJyYXlbaWR4XSA9PT0gaXRlbSkgcmV0dXJuIGlkeDtcbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgLy8gR2VuZXJhdG9yIGZ1bmN0aW9uIHRvIGNyZWF0ZSB0aGUgZmluZEluZGV4IGFuZCBmaW5kTGFzdEluZGV4IGZ1bmN0aW9uc1xuICBmdW5jdGlvbiBjcmVhdGVJbmRleEZpbmRlcihkaXIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYXJyYXksIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICAgIHZhciBsZW5ndGggPSBhcnJheSAhPSBudWxsICYmIGFycmF5Lmxlbmd0aDtcbiAgICAgIHZhciBpbmRleCA9IGRpciA+IDAgPyAwIDogbGVuZ3RoIC0gMTtcbiAgICAgIGZvciAoOyBpbmRleCA+PSAwICYmIGluZGV4IDwgbGVuZ3RoOyBpbmRleCArPSBkaXIpIHtcbiAgICAgICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHJldHVybiBpbmRleDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuICB9XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3QgaW5kZXggb24gYW4gYXJyYXktbGlrZSB0aGF0IHBhc3NlcyBhIHByZWRpY2F0ZSB0ZXN0XG4gIF8uZmluZEluZGV4ID0gY3JlYXRlSW5kZXhGaW5kZXIoMSk7XG5cbiAgXy5maW5kTGFzdEluZGV4ID0gY3JlYXRlSW5kZXhGaW5kZXIoLTEpO1xuXG4gIC8vIFVzZSBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gdG8gZmlndXJlIG91dCB0aGUgc21hbGxlc3QgaW5kZXggYXQgd2hpY2hcbiAgLy8gYW4gb2JqZWN0IHNob3VsZCBiZSBpbnNlcnRlZCBzbyBhcyB0byBtYWludGFpbiBvcmRlci4gVXNlcyBiaW5hcnkgc2VhcmNoLlxuICBfLnNvcnRlZEluZGV4ID0gZnVuY3Rpb24oYXJyYXksIG9iaiwgaXRlcmF0ZWUsIGNvbnRleHQpIHtcbiAgICBpdGVyYXRlZSA9IGNiKGl0ZXJhdGVlLCBjb250ZXh0LCAxKTtcbiAgICB2YXIgdmFsdWUgPSBpdGVyYXRlZShvYmopO1xuICAgIHZhciBsb3cgPSAwLCBoaWdoID0gYXJyYXkubGVuZ3RoO1xuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICB2YXIgbWlkID0gTWF0aC5mbG9vcigobG93ICsgaGlnaCkgLyAyKTtcbiAgICAgIGlmIChpdGVyYXRlZShhcnJheVttaWRdKSA8IHZhbHVlKSBsb3cgPSBtaWQgKyAxOyBlbHNlIGhpZ2ggPSBtaWQ7XG4gICAgfVxuICAgIHJldHVybiBsb3c7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYW4gaW50ZWdlciBBcnJheSBjb250YWluaW5nIGFuIGFyaXRobWV0aWMgcHJvZ3Jlc3Npb24uIEEgcG9ydCBvZlxuICAvLyB0aGUgbmF0aXZlIFB5dGhvbiBgcmFuZ2UoKWAgZnVuY3Rpb24uIFNlZVxuICAvLyBbdGhlIFB5dGhvbiBkb2N1bWVudGF0aW9uXShodHRwOi8vZG9jcy5weXRob24ub3JnL2xpYnJhcnkvZnVuY3Rpb25zLmh0bWwjcmFuZ2UpLlxuICBfLnJhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8PSAxKSB7XG4gICAgICBzdG9wID0gc3RhcnQgfHwgMDtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgc3RlcCA9IHN0ZXAgfHwgMTtcblxuICAgIHZhciBsZW5ndGggPSBNYXRoLm1heChNYXRoLmNlaWwoKHN0b3AgLSBzdGFydCkgLyBzdGVwKSwgMCk7XG4gICAgdmFyIHJhbmdlID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGxlbmd0aDsgaWR4KyssIHN0YXJ0ICs9IHN0ZXApIHtcbiAgICAgIHJhbmdlW2lkeF0gPSBzdGFydDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmFuZ2U7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gKGFoZW0pIEZ1bmN0aW9uc1xuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBEZXRlcm1pbmVzIHdoZXRoZXIgdG8gZXhlY3V0ZSBhIGZ1bmN0aW9uIGFzIGEgY29uc3RydWN0b3JcbiAgLy8gb3IgYSBub3JtYWwgZnVuY3Rpb24gd2l0aCB0aGUgcHJvdmlkZWQgYXJndW1lbnRzXG4gIHZhciBleGVjdXRlQm91bmQgPSBmdW5jdGlvbihzb3VyY2VGdW5jLCBib3VuZEZ1bmMsIGNvbnRleHQsIGNhbGxpbmdDb250ZXh0LCBhcmdzKSB7XG4gICAgaWYgKCEoY2FsbGluZ0NvbnRleHQgaW5zdGFuY2VvZiBib3VuZEZ1bmMpKSByZXR1cm4gc291cmNlRnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB2YXIgc2VsZiA9IGJhc2VDcmVhdGUoc291cmNlRnVuYy5wcm90b3R5cGUpO1xuICAgIHZhciByZXN1bHQgPSBzb3VyY2VGdW5jLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIGlmIChfLmlzT2JqZWN0KHJlc3VsdCkpIHJldHVybiByZXN1bHQ7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH07XG5cbiAgLy8gQ3JlYXRlIGEgZnVuY3Rpb24gYm91bmQgdG8gYSBnaXZlbiBvYmplY3QgKGFzc2lnbmluZyBgdGhpc2AsIGFuZCBhcmd1bWVudHMsXG4gIC8vIG9wdGlvbmFsbHkpLiBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgRnVuY3Rpb24uYmluZGAgaWZcbiAgLy8gYXZhaWxhYmxlLlxuICBfLmJpbmQgPSBmdW5jdGlvbihmdW5jLCBjb250ZXh0KSB7XG4gICAgaWYgKG5hdGl2ZUJpbmQgJiYgZnVuYy5iaW5kID09PSBuYXRpdmVCaW5kKSByZXR1cm4gbmF0aXZlQmluZC5hcHBseShmdW5jLCBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIGlmICghXy5pc0Z1bmN0aW9uKGZ1bmMpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdCaW5kIG11c3QgYmUgY2FsbGVkIG9uIGEgZnVuY3Rpb24nKTtcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICB2YXIgYm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleGVjdXRlQm91bmQoZnVuYywgYm91bmQsIGNvbnRleHQsIHRoaXMsIGFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgIH07XG4gICAgcmV0dXJuIGJvdW5kO1xuICB9O1xuXG4gIC8vIFBhcnRpYWxseSBhcHBseSBhIGZ1bmN0aW9uIGJ5IGNyZWF0aW5nIGEgdmVyc2lvbiB0aGF0IGhhcyBoYWQgc29tZSBvZiBpdHNcbiAgLy8gYXJndW1lbnRzIHByZS1maWxsZWQsIHdpdGhvdXQgY2hhbmdpbmcgaXRzIGR5bmFtaWMgYHRoaXNgIGNvbnRleHQuIF8gYWN0c1xuICAvLyBhcyBhIHBsYWNlaG9sZGVyLCBhbGxvd2luZyBhbnkgY29tYmluYXRpb24gb2YgYXJndW1lbnRzIHRvIGJlIHByZS1maWxsZWQuXG4gIF8ucGFydGlhbCA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgICB2YXIgYm91bmRBcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHZhciBib3VuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBvc2l0aW9uID0gMCwgbGVuZ3RoID0gYm91bmRBcmdzLmxlbmd0aDtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkobGVuZ3RoKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYXJnc1tpXSA9IGJvdW5kQXJnc1tpXSA9PT0gXyA/IGFyZ3VtZW50c1twb3NpdGlvbisrXSA6IGJvdW5kQXJnc1tpXTtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChwb3NpdGlvbiA8IGFyZ3VtZW50cy5sZW5ndGgpIGFyZ3MucHVzaChhcmd1bWVudHNbcG9zaXRpb24rK10pO1xuICAgICAgcmV0dXJuIGV4ZWN1dGVCb3VuZChmdW5jLCBib3VuZCwgdGhpcywgdGhpcywgYXJncyk7XG4gICAgfTtcbiAgICByZXR1cm4gYm91bmQ7XG4gIH07XG5cbiAgLy8gQmluZCBhIG51bWJlciBvZiBhbiBvYmplY3QncyBtZXRob2RzIHRvIHRoYXQgb2JqZWN0LiBSZW1haW5pbmcgYXJndW1lbnRzXG4gIC8vIGFyZSB0aGUgbWV0aG9kIG5hbWVzIHRvIGJlIGJvdW5kLiBVc2VmdWwgZm9yIGVuc3VyaW5nIHRoYXQgYWxsIGNhbGxiYWNrc1xuICAvLyBkZWZpbmVkIG9uIGFuIG9iamVjdCBiZWxvbmcgdG8gaXQuXG4gIF8uYmluZEFsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBpLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoLCBrZXk7XG4gICAgaWYgKGxlbmd0aCA8PSAxKSB0aHJvdyBuZXcgRXJyb3IoJ2JpbmRBbGwgbXVzdCBiZSBwYXNzZWQgZnVuY3Rpb24gbmFtZXMnKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIG9ialtrZXldID0gXy5iaW5kKG9ialtrZXldLCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIE1lbW9pemUgYW4gZXhwZW5zaXZlIGZ1bmN0aW9uIGJ5IHN0b3JpbmcgaXRzIHJlc3VsdHMuXG4gIF8ubWVtb2l6ZSA9IGZ1bmN0aW9uKGZ1bmMsIGhhc2hlcikge1xuICAgIHZhciBtZW1vaXplID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgY2FjaGUgPSBtZW1vaXplLmNhY2hlO1xuICAgICAgdmFyIGFkZHJlc3MgPSAnJyArIChoYXNoZXIgPyBoYXNoZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSA6IGtleSk7XG4gICAgICBpZiAoIV8uaGFzKGNhY2hlLCBhZGRyZXNzKSkgY2FjaGVbYWRkcmVzc10gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gY2FjaGVbYWRkcmVzc107XG4gICAgfTtcbiAgICBtZW1vaXplLmNhY2hlID0ge307XG4gICAgcmV0dXJuIG1lbW9pemU7XG4gIH07XG5cbiAgLy8gRGVsYXlzIGEgZnVuY3Rpb24gZm9yIHRoZSBnaXZlbiBudW1iZXIgb2YgbWlsbGlzZWNvbmRzLCBhbmQgdGhlbiBjYWxsc1xuICAvLyBpdCB3aXRoIHRoZSBhcmd1bWVudHMgc3VwcGxpZWQuXG4gIF8uZGVsYXkgPSBmdW5jdGlvbihmdW5jLCB3YWl0KSB7XG4gICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiBmdW5jLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH0sIHdhaXQpO1xuICB9O1xuXG4gIC8vIERlZmVycyBhIGZ1bmN0aW9uLCBzY2hlZHVsaW5nIGl0IHRvIHJ1biBhZnRlciB0aGUgY3VycmVudCBjYWxsIHN0YWNrIGhhc1xuICAvLyBjbGVhcmVkLlxuICBfLmRlZmVyID0gXy5wYXJ0aWFsKF8uZGVsYXksIF8sIDEpO1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgd2hlbiBpbnZva2VkLCB3aWxsIG9ubHkgYmUgdHJpZ2dlcmVkIGF0IG1vc3Qgb25jZVxuICAvLyBkdXJpbmcgYSBnaXZlbiB3aW5kb3cgb2YgdGltZS4gTm9ybWFsbHksIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbCBydW5cbiAgLy8gYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuICAvLyBidXQgaWYgeW91J2QgbGlrZSB0byBkaXNhYmxlIHRoZSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSwgcGFzc1xuICAvLyBge2xlYWRpbmc6IGZhbHNlfWAuIFRvIGRpc2FibGUgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlLCBkaXR0by5cbiAgXy50aHJvdHRsZSA9IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICB2YXIgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICAgIHZhciB0aW1lb3V0ID0gbnVsbDtcbiAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IF8ubm93KCk7XG4gICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBub3cgPSBfLm5vdygpO1xuICAgICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKSBwcmV2aW91cyA9IG5vdztcbiAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XG4gICAgICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCBhcyBsb25nIGFzIGl0IGNvbnRpbnVlcyB0byBiZSBpbnZva2VkLCB3aWxsIG5vdFxuICAvLyBiZSB0cmlnZ2VyZWQuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciBpdCBzdG9wcyBiZWluZyBjYWxsZWQgZm9yXG4gIC8vIE4gbWlsbGlzZWNvbmRzLiBJZiBgaW1tZWRpYXRlYCBpcyBwYXNzZWQsIHRyaWdnZXIgdGhlIGZ1bmN0aW9uIG9uIHRoZVxuICAvLyBsZWFkaW5nIGVkZ2UsIGluc3RlYWQgb2YgdGhlIHRyYWlsaW5nLlxuICBfLmRlYm91bmNlID0gZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgdmFyIHRpbWVvdXQsIGFyZ3MsIGNvbnRleHQsIHRpbWVzdGFtcCwgcmVzdWx0O1xuXG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbGFzdCA9IF8ubm93KCkgLSB0aW1lc3RhbXA7XG5cbiAgICAgIGlmIChsYXN0IDwgd2FpdCAmJiBsYXN0ID49IDApIHtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQgLSBsYXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBpZiAoIWltbWVkaWF0ZSkge1xuICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgdGltZXN0YW1wID0gXy5ub3coKTtcbiAgICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgaWYgKCF0aW1lb3V0KSB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICBpZiAoY2FsbE5vdykge1xuICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIHRoZSBmaXJzdCBmdW5jdGlvbiBwYXNzZWQgYXMgYW4gYXJndW1lbnQgdG8gdGhlIHNlY29uZCxcbiAgLy8gYWxsb3dpbmcgeW91IHRvIGFkanVzdCBhcmd1bWVudHMsIHJ1biBjb2RlIGJlZm9yZSBhbmQgYWZ0ZXIsIGFuZFxuICAvLyBjb25kaXRpb25hbGx5IGV4ZWN1dGUgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uLlxuICBfLndyYXAgPSBmdW5jdGlvbihmdW5jLCB3cmFwcGVyKSB7XG4gICAgcmV0dXJuIF8ucGFydGlhbCh3cmFwcGVyLCBmdW5jKTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgbmVnYXRlZCB2ZXJzaW9uIG9mIHRoZSBwYXNzZWQtaW4gcHJlZGljYXRlLlxuICBfLm5lZ2F0ZSA9IGZ1bmN0aW9uKHByZWRpY2F0ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAhcHJlZGljYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBpcyB0aGUgY29tcG9zaXRpb24gb2YgYSBsaXN0IG9mIGZ1bmN0aW9ucywgZWFjaFxuICAvLyBjb25zdW1pbmcgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24gdGhhdCBmb2xsb3dzLlxuICBfLmNvbXBvc2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgc3RhcnQgPSBhcmdzLmxlbmd0aCAtIDE7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGkgPSBzdGFydDtcbiAgICAgIHZhciByZXN1bHQgPSBhcmdzW3N0YXJ0XS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgd2hpbGUgKGktLSkgcmVzdWx0ID0gYXJnc1tpXS5jYWxsKHRoaXMsIHJlc3VsdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIG9uIGFuZCBhZnRlciB0aGUgTnRoIGNhbGwuXG4gIF8uYWZ0ZXIgPSBmdW5jdGlvbih0aW1lcywgZnVuYykge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICgtLXRpbWVzIDwgMSkge1xuICAgICAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBvbmx5IGJlIGV4ZWN1dGVkIHVwIHRvIChidXQgbm90IGluY2x1ZGluZykgdGhlIE50aCBjYWxsLlxuICBfLmJlZm9yZSA9IGZ1bmN0aW9uKHRpbWVzLCBmdW5jKSB7XG4gICAgdmFyIG1lbW87XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKC0tdGltZXMgPiAwKSB7XG4gICAgICAgIG1lbW8gPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG4gICAgICBpZiAodGltZXMgPD0gMSkgZnVuYyA9IG51bGw7XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYXQgbW9zdCBvbmUgdGltZSwgbm8gbWF0dGVyIGhvd1xuICAvLyBvZnRlbiB5b3UgY2FsbCBpdC4gVXNlZnVsIGZvciBsYXp5IGluaXRpYWxpemF0aW9uLlxuICBfLm9uY2UgPSBfLnBhcnRpYWwoXy5iZWZvcmUsIDIpO1xuXG4gIC8vIE9iamVjdCBGdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIEtleXMgaW4gSUUgPCA5IHRoYXQgd29uJ3QgYmUgaXRlcmF0ZWQgYnkgYGZvciBrZXkgaW4gLi4uYCBhbmQgdGh1cyBtaXNzZWQuXG4gIHZhciBoYXNFbnVtQnVnID0gIXt0b1N0cmluZzogbnVsbH0ucHJvcGVydHlJc0VudW1lcmFibGUoJ3RvU3RyaW5nJyk7XG4gIHZhciBub25FbnVtZXJhYmxlUHJvcHMgPSBbJ3ZhbHVlT2YnLCAnaXNQcm90b3R5cGVPZicsICd0b1N0cmluZycsXG4gICAgICAgICAgICAgICAgICAgICAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJ2hhc093blByb3BlcnR5JywgJ3RvTG9jYWxlU3RyaW5nJ107XG5cbiAgZnVuY3Rpb24gY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpIHtcbiAgICB2YXIgbm9uRW51bUlkeCA9IG5vbkVudW1lcmFibGVQcm9wcy5sZW5ndGg7XG4gICAgdmFyIGNvbnN0cnVjdG9yID0gb2JqLmNvbnN0cnVjdG9yO1xuICAgIHZhciBwcm90byA9IChfLmlzRnVuY3Rpb24oY29uc3RydWN0b3IpICYmIGNvbnN0cnVjdG9yLnByb3RvdHlwZSkgfHwgT2JqUHJvdG87XG5cbiAgICAvLyBDb25zdHJ1Y3RvciBpcyBhIHNwZWNpYWwgY2FzZS5cbiAgICB2YXIgcHJvcCA9ICdjb25zdHJ1Y3Rvcic7XG4gICAgaWYgKF8uaGFzKG9iaiwgcHJvcCkgJiYgIV8uY29udGFpbnMoa2V5cywgcHJvcCkpIGtleXMucHVzaChwcm9wKTtcblxuICAgIHdoaWxlIChub25FbnVtSWR4LS0pIHtcbiAgICAgIHByb3AgPSBub25FbnVtZXJhYmxlUHJvcHNbbm9uRW51bUlkeF07XG4gICAgICBpZiAocHJvcCBpbiBvYmogJiYgb2JqW3Byb3BdICE9PSBwcm90b1twcm9wXSAmJiAhXy5jb250YWlucyhrZXlzLCBwcm9wKSkge1xuICAgICAgICBrZXlzLnB1c2gocHJvcCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gUmV0cmlldmUgdGhlIG5hbWVzIG9mIGFuIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzLlxuICAvLyBEZWxlZ2F0ZXMgdG8gKipFQ01BU2NyaXB0IDUqKidzIG5hdGl2ZSBgT2JqZWN0LmtleXNgXG4gIF8ua2V5cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghXy5pc09iamVjdChvYmopKSByZXR1cm4gW107XG4gICAgaWYgKG5hdGl2ZUtleXMpIHJldHVybiBuYXRpdmVLZXlzKG9iaik7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSBpZiAoXy5oYXMob2JqLCBrZXkpKSBrZXlzLnB1c2goa2V5KTtcbiAgICAvLyBBaGVtLCBJRSA8IDkuXG4gICAgaWYgKGhhc0VudW1CdWcpIGNvbGxlY3ROb25FbnVtUHJvcHMob2JqLCBrZXlzKTtcbiAgICByZXR1cm4ga2V5cztcbiAgfTtcblxuICAvLyBSZXRyaWV2ZSBhbGwgdGhlIHByb3BlcnR5IG5hbWVzIG9mIGFuIG9iamVjdC5cbiAgXy5hbGxLZXlzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBbXTtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIGtleXMucHVzaChrZXkpO1xuICAgIC8vIEFoZW0sIElFIDwgOS5cbiAgICBpZiAoaGFzRW51bUJ1ZykgY29sbGVjdE5vbkVudW1Qcm9wcyhvYmosIGtleXMpO1xuICAgIHJldHVybiBrZXlzO1xuICB9O1xuXG4gIC8vIFJldHJpZXZlIHRoZSB2YWx1ZXMgb2YgYW4gb2JqZWN0J3MgcHJvcGVydGllcy5cbiAgXy52YWx1ZXMgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgdmFsdWVzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YWx1ZXNbaV0gPSBvYmpba2V5c1tpXV07XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH07XG5cbiAgLy8gUmV0dXJucyB0aGUgcmVzdWx0cyBvZiBhcHBseWluZyB0aGUgaXRlcmF0ZWUgdG8gZWFjaCBlbGVtZW50IG9mIHRoZSBvYmplY3RcbiAgLy8gSW4gY29udHJhc3QgdG8gXy5tYXAgaXQgcmV0dXJucyBhbiBvYmplY3RcbiAgXy5tYXBPYmplY3QgPSBmdW5jdGlvbihvYmosIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgaXRlcmF0ZWUgPSBjYihpdGVyYXRlZSwgY29udGV4dCk7XG4gICAgdmFyIGtleXMgPSAgXy5rZXlzKG9iaiksXG4gICAgICAgICAgbGVuZ3RoID0ga2V5cy5sZW5ndGgsXG4gICAgICAgICAgcmVzdWx0cyA9IHt9LFxuICAgICAgICAgIGN1cnJlbnRLZXk7XG4gICAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGN1cnJlbnRLZXkgPSBrZXlzW2luZGV4XTtcbiAgICAgICAgcmVzdWx0c1tjdXJyZW50S2V5XSA9IGl0ZXJhdGVlKG9ialtjdXJyZW50S2V5XSwgY3VycmVudEtleSwgb2JqKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuXG4gIC8vIENvbnZlcnQgYW4gb2JqZWN0IGludG8gYSBsaXN0IG9mIGBba2V5LCB2YWx1ZV1gIHBhaXJzLlxuICBfLnBhaXJzID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMob2JqKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIHBhaXJzID0gQXJyYXkobGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBwYWlyc1tpXSA9IFtrZXlzW2ldLCBvYmpba2V5c1tpXV1dO1xuICAgIH1cbiAgICByZXR1cm4gcGFpcnM7XG4gIH07XG5cbiAgLy8gSW52ZXJ0IHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgYW4gb2JqZWN0LiBUaGUgdmFsdWVzIG11c3QgYmUgc2VyaWFsaXphYmxlLlxuICBfLmludmVydCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBrZXlzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRbb2JqW2tleXNbaV1dXSA9IGtleXNbaV07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG5cbiAgLy8gUmV0dXJuIGEgc29ydGVkIGxpc3Qgb2YgdGhlIGZ1bmN0aW9uIG5hbWVzIGF2YWlsYWJsZSBvbiB0aGUgb2JqZWN0LlxuICAvLyBBbGlhc2VkIGFzIGBtZXRob2RzYFxuICBfLmZ1bmN0aW9ucyA9IF8ubWV0aG9kcyA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBuYW1lcyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChfLmlzRnVuY3Rpb24ob2JqW2tleV0pKSBuYW1lcy5wdXNoKGtleSk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lcy5zb3J0KCk7XG4gIH07XG5cbiAgLy8gRXh0ZW5kIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBwcm9wZXJ0aWVzIGluIHBhc3NlZC1pbiBvYmplY3QocykuXG4gIF8uZXh0ZW5kID0gY3JlYXRlQXNzaWduZXIoXy5hbGxLZXlzKTtcblxuICAvLyBBc3NpZ25zIGEgZ2l2ZW4gb2JqZWN0IHdpdGggYWxsIHRoZSBvd24gcHJvcGVydGllcyBpbiB0aGUgcGFzc2VkLWluIG9iamVjdChzKVxuICAvLyAoaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2Fzc2lnbilcbiAgXy5leHRlbmRPd24gPSBfLmFzc2lnbiA9IGNyZWF0ZUFzc2lnbmVyKF8ua2V5cyk7XG5cbiAgLy8gUmV0dXJucyB0aGUgZmlyc3Qga2V5IG9uIGFuIG9iamVjdCB0aGF0IHBhc3NlcyBhIHByZWRpY2F0ZSB0ZXN0XG4gIF8uZmluZEtleSA9IGZ1bmN0aW9uKG9iaiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcHJlZGljYXRlID0gY2IocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB2YXIga2V5cyA9IF8ua2V5cyhvYmopLCBrZXk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGtleXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICBpZiAocHJlZGljYXRlKG9ialtrZXldLCBrZXksIG9iaikpIHJldHVybiBrZXk7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJldHVybiBhIGNvcHkgb2YgdGhlIG9iamVjdCBvbmx5IGNvbnRhaW5pbmcgdGhlIHdoaXRlbGlzdGVkIHByb3BlcnRpZXMuXG4gIF8ucGljayA9IGZ1bmN0aW9uKG9iamVjdCwgb2l0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9LCBvYmogPSBvYmplY3QsIGl0ZXJhdGVlLCBrZXlzO1xuICAgIGlmIChvYmogPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKG9pdGVyYXRlZSkpIHtcbiAgICAgIGtleXMgPSBfLmFsbEtleXMob2JqKTtcbiAgICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihvaXRlcmF0ZWUsIGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrZXlzID0gZmxhdHRlbihhcmd1bWVudHMsIGZhbHNlLCBmYWxzZSwgMSk7XG4gICAgICBpdGVyYXRlZSA9IGZ1bmN0aW9uKHZhbHVlLCBrZXksIG9iaikgeyByZXR1cm4ga2V5IGluIG9iajsgfTtcbiAgICAgIG9iaiA9IE9iamVjdChvYmopO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgICB2YXIgdmFsdWUgPSBvYmpba2V5XTtcbiAgICAgIGlmIChpdGVyYXRlZSh2YWx1ZSwga2V5LCBvYmopKSByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gICAvLyBSZXR1cm4gYSBjb3B5IG9mIHRoZSBvYmplY3Qgd2l0aG91dCB0aGUgYmxhY2tsaXN0ZWQgcHJvcGVydGllcy5cbiAgXy5vbWl0ID0gZnVuY3Rpb24ob2JqLCBpdGVyYXRlZSwgY29udGV4dCkge1xuICAgIGlmIChfLmlzRnVuY3Rpb24oaXRlcmF0ZWUpKSB7XG4gICAgICBpdGVyYXRlZSA9IF8ubmVnYXRlKGl0ZXJhdGVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBfLm1hcChmbGF0dGVuKGFyZ3VtZW50cywgZmFsc2UsIGZhbHNlLCAxKSwgU3RyaW5nKTtcbiAgICAgIGl0ZXJhdGVlID0gZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICByZXR1cm4gIV8uY29udGFpbnMoa2V5cywga2V5KTtcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBfLnBpY2sob2JqLCBpdGVyYXRlZSwgY29udGV4dCk7XG4gIH07XG5cbiAgLy8gRmlsbCBpbiBhIGdpdmVuIG9iamVjdCB3aXRoIGRlZmF1bHQgcHJvcGVydGllcy5cbiAgXy5kZWZhdWx0cyA9IGNyZWF0ZUFzc2lnbmVyKF8uYWxsS2V5cywgdHJ1ZSk7XG5cbiAgLy8gQ3JlYXRlIGEgKHNoYWxsb3ctY2xvbmVkKSBkdXBsaWNhdGUgb2YgYW4gb2JqZWN0LlxuICBfLmNsb25lID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFfLmlzT2JqZWN0KG9iaikpIHJldHVybiBvYmo7XG4gICAgcmV0dXJuIF8uaXNBcnJheShvYmopID8gb2JqLnNsaWNlKCkgOiBfLmV4dGVuZCh7fSwgb2JqKTtcbiAgfTtcblxuICAvLyBJbnZva2VzIGludGVyY2VwdG9yIHdpdGggdGhlIG9iaiwgYW5kIHRoZW4gcmV0dXJucyBvYmouXG4gIC8vIFRoZSBwcmltYXJ5IHB1cnBvc2Ugb2YgdGhpcyBtZXRob2QgaXMgdG8gXCJ0YXAgaW50b1wiIGEgbWV0aG9kIGNoYWluLCBpblxuICAvLyBvcmRlciB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gaW50ZXJtZWRpYXRlIHJlc3VsdHMgd2l0aGluIHRoZSBjaGFpbi5cbiAgXy50YXAgPSBmdW5jdGlvbihvYmosIGludGVyY2VwdG9yKSB7XG4gICAgaW50ZXJjZXB0b3Iob2JqKTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIC8vIFJldHVybnMgd2hldGhlciBhbiBvYmplY3QgaGFzIGEgZ2l2ZW4gc2V0IG9mIGBrZXk6dmFsdWVgIHBhaXJzLlxuICBfLmlzTWF0Y2ggPSBmdW5jdGlvbihvYmplY3QsIGF0dHJzKSB7XG4gICAgdmFyIGtleXMgPSBfLmtleXMoYXR0cnMpLCBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHJldHVybiAhbGVuZ3RoO1xuICAgIHZhciBvYmogPSBPYmplY3Qob2JqZWN0KTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpXTtcbiAgICAgIGlmIChhdHRyc1trZXldICE9PSBvYmpba2V5XSB8fCAhKGtleSBpbiBvYmopKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG5cbiAgLy8gSW50ZXJuYWwgcmVjdXJzaXZlIGNvbXBhcmlzb24gZnVuY3Rpb24gZm9yIGBpc0VxdWFsYC5cbiAgdmFyIGVxID0gZnVuY3Rpb24oYSwgYiwgYVN0YWNrLCBiU3RhY2spIHtcbiAgICAvLyBJZGVudGljYWwgb2JqZWN0cyBhcmUgZXF1YWwuIGAwID09PSAtMGAsIGJ1dCB0aGV5IGFyZW4ndCBpZGVudGljYWwuXG4gICAgLy8gU2VlIHRoZSBbSGFybW9ueSBgZWdhbGAgcHJvcG9zYWxdKGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6ZWdhbCkuXG4gICAgaWYgKGEgPT09IGIpIHJldHVybiBhICE9PSAwIHx8IDEgLyBhID09PSAxIC8gYjtcbiAgICAvLyBBIHN0cmljdCBjb21wYXJpc29uIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGBudWxsID09IHVuZGVmaW5lZGAuXG4gICAgaWYgKGEgPT0gbnVsbCB8fCBiID09IG51bGwpIHJldHVybiBhID09PSBiO1xuICAgIC8vIFVud3JhcCBhbnkgd3JhcHBlZCBvYmplY3RzLlxuICAgIGlmIChhIGluc3RhbmNlb2YgXykgYSA9IGEuX3dyYXBwZWQ7XG4gICAgaWYgKGIgaW5zdGFuY2VvZiBfKSBiID0gYi5fd3JhcHBlZDtcbiAgICAvLyBDb21wYXJlIGBbW0NsYXNzXV1gIG5hbWVzLlxuICAgIHZhciBjbGFzc05hbWUgPSB0b1N0cmluZy5jYWxsKGEpO1xuICAgIGlmIChjbGFzc05hbWUgIT09IHRvU3RyaW5nLmNhbGwoYikpIHJldHVybiBmYWxzZTtcbiAgICBzd2l0Y2ggKGNsYXNzTmFtZSkge1xuICAgICAgLy8gU3RyaW5ncywgbnVtYmVycywgcmVndWxhciBleHByZXNzaW9ucywgZGF0ZXMsIGFuZCBib29sZWFucyBhcmUgY29tcGFyZWQgYnkgdmFsdWUuXG4gICAgICBjYXNlICdbb2JqZWN0IFJlZ0V4cF0nOlxuICAgICAgLy8gUmVnRXhwcyBhcmUgY29lcmNlZCB0byBzdHJpbmdzIGZvciBjb21wYXJpc29uIChOb3RlOiAnJyArIC9hL2kgPT09ICcvYS9pJylcbiAgICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6XG4gICAgICAgIC8vIFByaW1pdGl2ZXMgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgb2JqZWN0IHdyYXBwZXJzIGFyZSBlcXVpdmFsZW50OyB0aHVzLCBgXCI1XCJgIGlzXG4gICAgICAgIC8vIGVxdWl2YWxlbnQgdG8gYG5ldyBTdHJpbmcoXCI1XCIpYC5cbiAgICAgICAgcmV0dXJuICcnICsgYSA9PT0gJycgKyBiO1xuICAgICAgY2FzZSAnW29iamVjdCBOdW1iZXJdJzpcbiAgICAgICAgLy8gYE5hTmBzIGFyZSBlcXVpdmFsZW50LCBidXQgbm9uLXJlZmxleGl2ZS5cbiAgICAgICAgLy8gT2JqZWN0KE5hTikgaXMgZXF1aXZhbGVudCB0byBOYU5cbiAgICAgICAgaWYgKCthICE9PSArYSkgcmV0dXJuICtiICE9PSArYjtcbiAgICAgICAgLy8gQW4gYGVnYWxgIGNvbXBhcmlzb24gaXMgcGVyZm9ybWVkIGZvciBvdGhlciBudW1lcmljIHZhbHVlcy5cbiAgICAgICAgcmV0dXJuICthID09PSAwID8gMSAvICthID09PSAxIC8gYiA6ICthID09PSArYjtcbiAgICAgIGNhc2UgJ1tvYmplY3QgRGF0ZV0nOlxuICAgICAgY2FzZSAnW29iamVjdCBCb29sZWFuXSc6XG4gICAgICAgIC8vIENvZXJjZSBkYXRlcyBhbmQgYm9vbGVhbnMgdG8gbnVtZXJpYyBwcmltaXRpdmUgdmFsdWVzLiBEYXRlcyBhcmUgY29tcGFyZWQgYnkgdGhlaXJcbiAgICAgICAgLy8gbWlsbGlzZWNvbmQgcmVwcmVzZW50YXRpb25zLiBOb3RlIHRoYXQgaW52YWxpZCBkYXRlcyB3aXRoIG1pbGxpc2Vjb25kIHJlcHJlc2VudGF0aW9uc1xuICAgICAgICAvLyBvZiBgTmFOYCBhcmUgbm90IGVxdWl2YWxlbnQuXG4gICAgICAgIHJldHVybiArYSA9PT0gK2I7XG4gICAgfVxuXG4gICAgdmFyIGFyZUFycmF5cyA9IGNsYXNzTmFtZSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICBpZiAoIWFyZUFycmF5cykge1xuICAgICAgaWYgKHR5cGVvZiBhICE9ICdvYmplY3QnIHx8IHR5cGVvZiBiICE9ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIC8vIE9iamVjdHMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1aXZhbGVudCwgYnV0IGBPYmplY3RgcyBvciBgQXJyYXlgc1xuICAgICAgLy8gZnJvbSBkaWZmZXJlbnQgZnJhbWVzIGFyZS5cbiAgICAgIHZhciBhQ3RvciA9IGEuY29uc3RydWN0b3IsIGJDdG9yID0gYi5jb25zdHJ1Y3RvcjtcbiAgICAgIGlmIChhQ3RvciAhPT0gYkN0b3IgJiYgIShfLmlzRnVuY3Rpb24oYUN0b3IpICYmIGFDdG9yIGluc3RhbmNlb2YgYUN0b3IgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfLmlzRnVuY3Rpb24oYkN0b3IpICYmIGJDdG9yIGluc3RhbmNlb2YgYkN0b3IpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICYmICgnY29uc3RydWN0b3InIGluIGEgJiYgJ2NvbnN0cnVjdG9yJyBpbiBiKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIEFzc3VtZSBlcXVhbGl0eSBmb3IgY3ljbGljIHN0cnVjdHVyZXMuIFRoZSBhbGdvcml0aG0gZm9yIGRldGVjdGluZyBjeWNsaWNcbiAgICAvLyBzdHJ1Y3R1cmVzIGlzIGFkYXB0ZWQgZnJvbSBFUyA1LjEgc2VjdGlvbiAxNS4xMi4zLCBhYnN0cmFjdCBvcGVyYXRpb24gYEpPYC5cbiAgICBcbiAgICAvLyBJbml0aWFsaXppbmcgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMuXG4gICAgLy8gSXQncyBkb25lIGhlcmUgc2luY2Ugd2Ugb25seSBuZWVkIHRoZW0gZm9yIG9iamVjdHMgYW5kIGFycmF5cyBjb21wYXJpc29uLlxuICAgIGFTdGFjayA9IGFTdGFjayB8fCBbXTtcbiAgICBiU3RhY2sgPSBiU3RhY2sgfHwgW107XG4gICAgdmFyIGxlbmd0aCA9IGFTdGFjay5sZW5ndGg7XG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICAvLyBMaW5lYXIgc2VhcmNoLiBQZXJmb3JtYW5jZSBpcyBpbnZlcnNlbHkgcHJvcG9ydGlvbmFsIHRvIHRoZSBudW1iZXIgb2ZcbiAgICAgIC8vIHVuaXF1ZSBuZXN0ZWQgc3RydWN0dXJlcy5cbiAgICAgIGlmIChhU3RhY2tbbGVuZ3RoXSA9PT0gYSkgcmV0dXJuIGJTdGFja1tsZW5ndGhdID09PSBiO1xuICAgIH1cblxuICAgIC8vIEFkZCB0aGUgZmlyc3Qgb2JqZWN0IHRvIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucHVzaChhKTtcbiAgICBiU3RhY2sucHVzaChiKTtcblxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyBhbmQgYXJyYXlzLlxuICAgIGlmIChhcmVBcnJheXMpIHtcbiAgICAgIC8vIENvbXBhcmUgYXJyYXkgbGVuZ3RocyB0byBkZXRlcm1pbmUgaWYgYSBkZWVwIGNvbXBhcmlzb24gaXMgbmVjZXNzYXJ5LlxuICAgICAgbGVuZ3RoID0gYS5sZW5ndGg7XG4gICAgICBpZiAobGVuZ3RoICE9PSBiLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgICAgLy8gRGVlcCBjb21wYXJlIHRoZSBjb250ZW50cywgaWdub3Jpbmcgbm9uLW51bWVyaWMgcHJvcGVydGllcy5cbiAgICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgICBpZiAoIWVxKGFbbGVuZ3RoXSwgYltsZW5ndGhdLCBhU3RhY2ssIGJTdGFjaykpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGVlcCBjb21wYXJlIG9iamVjdHMuXG4gICAgICB2YXIga2V5cyA9IF8ua2V5cyhhKSwga2V5O1xuICAgICAgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgICAvLyBFbnN1cmUgdGhhdCBib3RoIG9iamVjdHMgY29udGFpbiB0aGUgc2FtZSBudW1iZXIgb2YgcHJvcGVydGllcyBiZWZvcmUgY29tcGFyaW5nIGRlZXAgZXF1YWxpdHkuXG4gICAgICBpZiAoXy5rZXlzKGIpLmxlbmd0aCAhPT0gbGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgICAgLy8gRGVlcCBjb21wYXJlIGVhY2ggbWVtYmVyXG4gICAgICAgIGtleSA9IGtleXNbbGVuZ3RoXTtcbiAgICAgICAgaWYgKCEoXy5oYXMoYiwga2V5KSAmJiBlcShhW2tleV0sIGJba2V5XSwgYVN0YWNrLCBiU3RhY2spKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBSZW1vdmUgdGhlIGZpcnN0IG9iamVjdCBmcm9tIHRoZSBzdGFjayBvZiB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAgICBhU3RhY2sucG9wKCk7XG4gICAgYlN0YWNrLnBvcCgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIFBlcmZvcm0gYSBkZWVwIGNvbXBhcmlzb24gdG8gY2hlY2sgaWYgdHdvIG9iamVjdHMgYXJlIGVxdWFsLlxuICBfLmlzRXF1YWwgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGVxKGEsIGIpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gYXJyYXksIHN0cmluZywgb3Igb2JqZWN0IGVtcHR5P1xuICAvLyBBbiBcImVtcHR5XCIgb2JqZWN0IGhhcyBubyBlbnVtZXJhYmxlIG93bi1wcm9wZXJ0aWVzLlxuICBfLmlzRW1wdHkgPSBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHJldHVybiB0cnVlO1xuICAgIGlmIChpc0FycmF5TGlrZShvYmopICYmIChfLmlzQXJyYXkob2JqKSB8fCBfLmlzU3RyaW5nKG9iaikgfHwgXy5pc0FyZ3VtZW50cyhvYmopKSkgcmV0dXJuIG9iai5sZW5ndGggPT09IDA7XG4gICAgcmV0dXJuIF8ua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgRE9NIGVsZW1lbnQ/XG4gIF8uaXNFbGVtZW50ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xuICB9O1xuXG4gIC8vIElzIGEgZ2l2ZW4gdmFsdWUgYW4gYXJyYXk/XG4gIC8vIERlbGVnYXRlcyB0byBFQ01BNSdzIG5hdGl2ZSBBcnJheS5pc0FycmF5XG4gIF8uaXNBcnJheSA9IG5hdGl2ZUlzQXJyYXkgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhcmlhYmxlIGFuIG9iamVjdD9cbiAgXy5pc09iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciB0eXBlID0gdHlwZW9mIG9iajtcbiAgICByZXR1cm4gdHlwZSA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlID09PSAnb2JqZWN0JyAmJiAhIW9iajtcbiAgfTtcblxuICAvLyBBZGQgc29tZSBpc1R5cGUgbWV0aG9kczogaXNBcmd1bWVudHMsIGlzRnVuY3Rpb24sIGlzU3RyaW5nLCBpc051bWJlciwgaXNEYXRlLCBpc1JlZ0V4cCwgaXNFcnJvci5cbiAgXy5lYWNoKFsnQXJndW1lbnRzJywgJ0Z1bmN0aW9uJywgJ1N0cmluZycsICdOdW1iZXInLCAnRGF0ZScsICdSZWdFeHAnLCAnRXJyb3InXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIF9bJ2lzJyArIG5hbWVdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCAnICsgbmFtZSArICddJztcbiAgICB9O1xuICB9KTtcblxuICAvLyBEZWZpbmUgYSBmYWxsYmFjayB2ZXJzaW9uIG9mIHRoZSBtZXRob2QgaW4gYnJvd3NlcnMgKGFoZW0sIElFIDwgOSksIHdoZXJlXG4gIC8vIHRoZXJlIGlzbid0IGFueSBpbnNwZWN0YWJsZSBcIkFyZ3VtZW50c1wiIHR5cGUuXG4gIGlmICghXy5pc0FyZ3VtZW50cyhhcmd1bWVudHMpKSB7XG4gICAgXy5pc0FyZ3VtZW50cyA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgcmV0dXJuIF8uaGFzKG9iaiwgJ2NhbGxlZScpO1xuICAgIH07XG4gIH1cblxuICAvLyBPcHRpbWl6ZSBgaXNGdW5jdGlvbmAgaWYgYXBwcm9wcmlhdGUuIFdvcmsgYXJvdW5kIHNvbWUgdHlwZW9mIGJ1Z3MgaW4gb2xkIHY4LFxuICAvLyBJRSAxMSAoIzE2MjEpLCBhbmQgaW4gU2FmYXJpIDggKCMxOTI5KS5cbiAgaWYgKHR5cGVvZiAvLi8gIT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgSW50OEFycmF5ICE9ICdvYmplY3QnKSB7XG4gICAgXy5pc0Z1bmN0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PSAnZnVuY3Rpb24nIHx8IGZhbHNlO1xuICAgIH07XG4gIH1cblxuICAvLyBJcyBhIGdpdmVuIG9iamVjdCBhIGZpbml0ZSBudW1iZXI/XG4gIF8uaXNGaW5pdGUgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4ocGFyc2VGbG9hdChvYmopKTtcbiAgfTtcblxuICAvLyBJcyB0aGUgZ2l2ZW4gdmFsdWUgYE5hTmA/IChOYU4gaXMgdGhlIG9ubHkgbnVtYmVyIHdoaWNoIGRvZXMgbm90IGVxdWFsIGl0c2VsZikuXG4gIF8uaXNOYU4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc051bWJlcihvYmopICYmIG9iaiAhPT0gK29iajtcbiAgfTtcblxuICAvLyBJcyBhIGdpdmVuIHZhbHVlIGEgYm9vbGVhbj9cbiAgXy5pc0Jvb2xlYW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gZmFsc2UgfHwgdG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBCb29sZWFuXSc7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YWx1ZSBlcXVhbCB0byBudWxsP1xuICBfLmlzTnVsbCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IG51bGw7XG4gIH07XG5cbiAgLy8gSXMgYSBnaXZlbiB2YXJpYWJsZSB1bmRlZmluZWQ/XG4gIF8uaXNVbmRlZmluZWQgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG4gIH07XG5cbiAgLy8gU2hvcnRjdXQgZnVuY3Rpb24gZm9yIGNoZWNraW5nIGlmIGFuIG9iamVjdCBoYXMgYSBnaXZlbiBwcm9wZXJ0eSBkaXJlY3RseVxuICAvLyBvbiBpdHNlbGYgKGluIG90aGVyIHdvcmRzLCBub3Qgb24gYSBwcm90b3R5cGUpLlxuICBfLmhhcyA9IGZ1bmN0aW9uKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIG9iaiAhPSBudWxsICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xuICB9O1xuXG4gIC8vIFV0aWxpdHkgRnVuY3Rpb25zXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUnVuIFVuZGVyc2NvcmUuanMgaW4gKm5vQ29uZmxpY3QqIG1vZGUsIHJldHVybmluZyB0aGUgYF9gIHZhcmlhYmxlIHRvIGl0c1xuICAvLyBwcmV2aW91cyBvd25lci4gUmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIHJvb3QuXyA9IHByZXZpb3VzVW5kZXJzY29yZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBLZWVwIHRoZSBpZGVudGl0eSBmdW5jdGlvbiBhcm91bmQgZm9yIGRlZmF1bHQgaXRlcmF0ZWVzLlxuICBfLmlkZW50aXR5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgLy8gUHJlZGljYXRlLWdlbmVyYXRpbmcgZnVuY3Rpb25zLiBPZnRlbiB1c2VmdWwgb3V0c2lkZSBvZiBVbmRlcnNjb3JlLlxuICBfLmNvbnN0YW50ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgfTtcblxuICBfLm5vb3AgPSBmdW5jdGlvbigpe307XG5cbiAgXy5wcm9wZXJ0eSA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogPT0gbnVsbCA/IHZvaWQgMCA6IG9ialtrZXldO1xuICAgIH07XG4gIH07XG5cbiAgLy8gR2VuZXJhdGVzIGEgZnVuY3Rpb24gZm9yIGEgZ2l2ZW4gb2JqZWN0IHRoYXQgcmV0dXJucyBhIGdpdmVuIHByb3BlcnR5LlxuICBfLnByb3BlcnR5T2YgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09IG51bGwgPyBmdW5jdGlvbigpe30gOiBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBvYmpba2V5XTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFJldHVybnMgYSBwcmVkaWNhdGUgZm9yIGNoZWNraW5nIHdoZXRoZXIgYW4gb2JqZWN0IGhhcyBhIGdpdmVuIHNldCBvZiBcbiAgLy8gYGtleTp2YWx1ZWAgcGFpcnMuXG4gIF8ubWF0Y2hlciA9IF8ubWF0Y2hlcyA9IGZ1bmN0aW9uKGF0dHJzKSB7XG4gICAgYXR0cnMgPSBfLmV4dGVuZE93bih7fSwgYXR0cnMpO1xuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBfLmlzTWF0Y2gob2JqLCBhdHRycyk7XG4gICAgfTtcbiAgfTtcblxuICAvLyBSdW4gYSBmdW5jdGlvbiAqKm4qKiB0aW1lcy5cbiAgXy50aW1lcyA9IGZ1bmN0aW9uKG4sIGl0ZXJhdGVlLCBjb250ZXh0KSB7XG4gICAgdmFyIGFjY3VtID0gQXJyYXkoTWF0aC5tYXgoMCwgbikpO1xuICAgIGl0ZXJhdGVlID0gb3B0aW1pemVDYihpdGVyYXRlZSwgY29udGV4dCwgMSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyBpKyspIGFjY3VtW2ldID0gaXRlcmF0ZWUoaSk7XG4gICAgcmV0dXJuIGFjY3VtO1xuICB9O1xuXG4gIC8vIFJldHVybiBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIGFuZCBtYXggKGluY2x1c2l2ZSkuXG4gIF8ucmFuZG9tID0gZnVuY3Rpb24obWluLCBtYXgpIHtcbiAgICBpZiAobWF4ID09IG51bGwpIHtcbiAgICAgIG1heCA9IG1pbjtcbiAgICAgIG1pbiA9IDA7XG4gICAgfVxuICAgIHJldHVybiBtaW4gKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpO1xuICB9O1xuXG4gIC8vIEEgKHBvc3NpYmx5IGZhc3Rlcikgd2F5IHRvIGdldCB0aGUgY3VycmVudCB0aW1lc3RhbXAgYXMgYW4gaW50ZWdlci5cbiAgXy5ub3cgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH07XG5cbiAgIC8vIExpc3Qgb2YgSFRNTCBlbnRpdGllcyBmb3IgZXNjYXBpbmcuXG4gIHZhciBlc2NhcGVNYXAgPSB7XG4gICAgJyYnOiAnJmFtcDsnLFxuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnLFxuICAgICdcIic6ICcmcXVvdDsnLFxuICAgIFwiJ1wiOiAnJiN4Mjc7JyxcbiAgICAnYCc6ICcmI3g2MDsnXG4gIH07XG4gIHZhciB1bmVzY2FwZU1hcCA9IF8uaW52ZXJ0KGVzY2FwZU1hcCk7XG5cbiAgLy8gRnVuY3Rpb25zIGZvciBlc2NhcGluZyBhbmQgdW5lc2NhcGluZyBzdHJpbmdzIHRvL2Zyb20gSFRNTCBpbnRlcnBvbGF0aW9uLlxuICB2YXIgY3JlYXRlRXNjYXBlciA9IGZ1bmN0aW9uKG1hcCkge1xuICAgIHZhciBlc2NhcGVyID0gZnVuY3Rpb24obWF0Y2gpIHtcbiAgICAgIHJldHVybiBtYXBbbWF0Y2hdO1xuICAgIH07XG4gICAgLy8gUmVnZXhlcyBmb3IgaWRlbnRpZnlpbmcgYSBrZXkgdGhhdCBuZWVkcyB0byBiZSBlc2NhcGVkXG4gICAgdmFyIHNvdXJjZSA9ICcoPzonICsgXy5rZXlzKG1hcCkuam9pbignfCcpICsgJyknO1xuICAgIHZhciB0ZXN0UmVnZXhwID0gUmVnRXhwKHNvdXJjZSk7XG4gICAgdmFyIHJlcGxhY2VSZWdleHAgPSBSZWdFeHAoc291cmNlLCAnZycpO1xuICAgIHJldHVybiBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgIHN0cmluZyA9IHN0cmluZyA9PSBudWxsID8gJycgOiAnJyArIHN0cmluZztcbiAgICAgIHJldHVybiB0ZXN0UmVnZXhwLnRlc3Qoc3RyaW5nKSA/IHN0cmluZy5yZXBsYWNlKHJlcGxhY2VSZWdleHAsIGVzY2FwZXIpIDogc3RyaW5nO1xuICAgIH07XG4gIH07XG4gIF8uZXNjYXBlID0gY3JlYXRlRXNjYXBlcihlc2NhcGVNYXApO1xuICBfLnVuZXNjYXBlID0gY3JlYXRlRXNjYXBlcih1bmVzY2FwZU1hcCk7XG5cbiAgLy8gSWYgdGhlIHZhbHVlIG9mIHRoZSBuYW1lZCBgcHJvcGVydHlgIGlzIGEgZnVuY3Rpb24gdGhlbiBpbnZva2UgaXQgd2l0aCB0aGVcbiAgLy8gYG9iamVjdGAgYXMgY29udGV4dDsgb3RoZXJ3aXNlLCByZXR1cm4gaXQuXG4gIF8ucmVzdWx0ID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSwgZmFsbGJhY2spIHtcbiAgICB2YXIgdmFsdWUgPSBvYmplY3QgPT0gbnVsbCA/IHZvaWQgMCA6IG9iamVjdFtwcm9wZXJ0eV07XG4gICAgaWYgKHZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIHZhbHVlID0gZmFsbGJhY2s7XG4gICAgfVxuICAgIHJldHVybiBfLmlzRnVuY3Rpb24odmFsdWUpID8gdmFsdWUuY2FsbChvYmplY3QpIDogdmFsdWU7XG4gIH07XG5cbiAgLy8gR2VuZXJhdGUgYSB1bmlxdWUgaW50ZWdlciBpZCAodW5pcXVlIHdpdGhpbiB0aGUgZW50aXJlIGNsaWVudCBzZXNzaW9uKS5cbiAgLy8gVXNlZnVsIGZvciB0ZW1wb3JhcnkgRE9NIGlkcy5cbiAgdmFyIGlkQ291bnRlciA9IDA7XG4gIF8udW5pcXVlSWQgPSBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICB2YXIgaWQgPSArK2lkQ291bnRlciArICcnO1xuICAgIHJldHVybiBwcmVmaXggPyBwcmVmaXggKyBpZCA6IGlkO1xuICB9O1xuXG4gIC8vIEJ5IGRlZmF1bHQsIFVuZGVyc2NvcmUgdXNlcyBFUkItc3R5bGUgdGVtcGxhdGUgZGVsaW1pdGVycywgY2hhbmdlIHRoZVxuICAvLyBmb2xsb3dpbmcgdGVtcGxhdGUgc2V0dGluZ3MgdG8gdXNlIGFsdGVybmF0aXZlIGRlbGltaXRlcnMuXG4gIF8udGVtcGxhdGVTZXR0aW5ncyA9IHtcbiAgICBldmFsdWF0ZSAgICA6IC88JShbXFxzXFxTXSs/KSU+L2csXG4gICAgaW50ZXJwb2xhdGUgOiAvPCU9KFtcXHNcXFNdKz8pJT4vZyxcbiAgICBlc2NhcGUgICAgICA6IC88JS0oW1xcc1xcU10rPyklPi9nXG4gIH07XG5cbiAgLy8gV2hlbiBjdXN0b21pemluZyBgdGVtcGxhdGVTZXR0aW5nc2AsIGlmIHlvdSBkb24ndCB3YW50IHRvIGRlZmluZSBhblxuICAvLyBpbnRlcnBvbGF0aW9uLCBldmFsdWF0aW9uIG9yIGVzY2FwaW5nIHJlZ2V4LCB3ZSBuZWVkIG9uZSB0aGF0IGlzXG4gIC8vIGd1YXJhbnRlZWQgbm90IHRvIG1hdGNoLlxuICB2YXIgbm9NYXRjaCA9IC8oLileLztcblxuICAvLyBDZXJ0YWluIGNoYXJhY3RlcnMgbmVlZCB0byBiZSBlc2NhcGVkIHNvIHRoYXQgdGhleSBjYW4gYmUgcHV0IGludG8gYVxuICAvLyBzdHJpbmcgbGl0ZXJhbC5cbiAgdmFyIGVzY2FwZXMgPSB7XG4gICAgXCInXCI6ICAgICAgXCInXCIsXG4gICAgJ1xcXFwnOiAgICAgJ1xcXFwnLFxuICAgICdcXHInOiAgICAgJ3InLFxuICAgICdcXG4nOiAgICAgJ24nLFxuICAgICdcXHUyMDI4JzogJ3UyMDI4JyxcbiAgICAnXFx1MjAyOSc6ICd1MjAyOSdcbiAgfTtcblxuICB2YXIgZXNjYXBlciA9IC9cXFxcfCd8XFxyfFxcbnxcXHUyMDI4fFxcdTIwMjkvZztcblxuICB2YXIgZXNjYXBlQ2hhciA9IGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgcmV0dXJuICdcXFxcJyArIGVzY2FwZXNbbWF0Y2hdO1xuICB9O1xuXG4gIC8vIEphdmFTY3JpcHQgbWljcm8tdGVtcGxhdGluZywgc2ltaWxhciB0byBKb2huIFJlc2lnJ3MgaW1wbGVtZW50YXRpb24uXG4gIC8vIFVuZGVyc2NvcmUgdGVtcGxhdGluZyBoYW5kbGVzIGFyYml0cmFyeSBkZWxpbWl0ZXJzLCBwcmVzZXJ2ZXMgd2hpdGVzcGFjZSxcbiAgLy8gYW5kIGNvcnJlY3RseSBlc2NhcGVzIHF1b3RlcyB3aXRoaW4gaW50ZXJwb2xhdGVkIGNvZGUuXG4gIC8vIE5COiBgb2xkU2V0dGluZ3NgIG9ubHkgZXhpc3RzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5cbiAgXy50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHRleHQsIHNldHRpbmdzLCBvbGRTZXR0aW5ncykge1xuICAgIGlmICghc2V0dGluZ3MgJiYgb2xkU2V0dGluZ3MpIHNldHRpbmdzID0gb2xkU2V0dGluZ3M7XG4gICAgc2V0dGluZ3MgPSBfLmRlZmF1bHRzKHt9LCBzZXR0aW5ncywgXy50ZW1wbGF0ZVNldHRpbmdzKTtcblxuICAgIC8vIENvbWJpbmUgZGVsaW1pdGVycyBpbnRvIG9uZSByZWd1bGFyIGV4cHJlc3Npb24gdmlhIGFsdGVybmF0aW9uLlxuICAgIHZhciBtYXRjaGVyID0gUmVnRXhwKFtcbiAgICAgIChzZXR0aW5ncy5lc2NhcGUgfHwgbm9NYXRjaCkuc291cmNlLFxuICAgICAgKHNldHRpbmdzLmludGVycG9sYXRlIHx8IG5vTWF0Y2gpLnNvdXJjZSxcbiAgICAgIChzZXR0aW5ncy5ldmFsdWF0ZSB8fCBub01hdGNoKS5zb3VyY2VcbiAgICBdLmpvaW4oJ3wnKSArICd8JCcsICdnJyk7XG5cbiAgICAvLyBDb21waWxlIHRoZSB0ZW1wbGF0ZSBzb3VyY2UsIGVzY2FwaW5nIHN0cmluZyBsaXRlcmFscyBhcHByb3ByaWF0ZWx5LlxuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHNvdXJjZSA9IFwiX19wKz0nXCI7XG4gICAgdGV4dC5yZXBsYWNlKG1hdGNoZXIsIGZ1bmN0aW9uKG1hdGNoLCBlc2NhcGUsIGludGVycG9sYXRlLCBldmFsdWF0ZSwgb2Zmc2V0KSB7XG4gICAgICBzb3VyY2UgKz0gdGV4dC5zbGljZShpbmRleCwgb2Zmc2V0KS5yZXBsYWNlKGVzY2FwZXIsIGVzY2FwZUNoYXIpO1xuICAgICAgaW5kZXggPSBvZmZzZXQgKyBtYXRjaC5sZW5ndGg7XG5cbiAgICAgIGlmIChlc2NhcGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBlc2NhcGUgKyBcIikpPT1udWxsPycnOl8uZXNjYXBlKF9fdCkpK1xcbidcIjtcbiAgICAgIH0gZWxzZSBpZiAoaW50ZXJwb2xhdGUpIHtcbiAgICAgICAgc291cmNlICs9IFwiJytcXG4oKF9fdD0oXCIgKyBpbnRlcnBvbGF0ZSArIFwiKSk9PW51bGw/Jyc6X190KStcXG4nXCI7XG4gICAgICB9IGVsc2UgaWYgKGV2YWx1YXRlKSB7XG4gICAgICAgIHNvdXJjZSArPSBcIic7XFxuXCIgKyBldmFsdWF0ZSArIFwiXFxuX19wKz0nXCI7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkb2JlIFZNcyBuZWVkIHRoZSBtYXRjaCByZXR1cm5lZCB0byBwcm9kdWNlIHRoZSBjb3JyZWN0IG9mZmVzdC5cbiAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9KTtcbiAgICBzb3VyY2UgKz0gXCInO1xcblwiO1xuXG4gICAgLy8gSWYgYSB2YXJpYWJsZSBpcyBub3Qgc3BlY2lmaWVkLCBwbGFjZSBkYXRhIHZhbHVlcyBpbiBsb2NhbCBzY29wZS5cbiAgICBpZiAoIXNldHRpbmdzLnZhcmlhYmxlKSBzb3VyY2UgPSAnd2l0aChvYmp8fHt9KXtcXG4nICsgc291cmNlICsgJ31cXG4nO1xuXG4gICAgc291cmNlID0gXCJ2YXIgX190LF9fcD0nJyxfX2o9QXJyYXkucHJvdG90eXBlLmpvaW4sXCIgK1xuICAgICAgXCJwcmludD1mdW5jdGlvbigpe19fcCs9X19qLmNhbGwoYXJndW1lbnRzLCcnKTt9O1xcblwiICtcbiAgICAgIHNvdXJjZSArICdyZXR1cm4gX19wO1xcbic7XG5cbiAgICB0cnkge1xuICAgICAgdmFyIHJlbmRlciA9IG5ldyBGdW5jdGlvbihzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJywgJ18nLCBzb3VyY2UpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGUuc291cmNlID0gc291cmNlO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICB2YXIgdGVtcGxhdGUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICByZXR1cm4gcmVuZGVyLmNhbGwodGhpcywgZGF0YSwgXyk7XG4gICAgfTtcblxuICAgIC8vIFByb3ZpZGUgdGhlIGNvbXBpbGVkIHNvdXJjZSBhcyBhIGNvbnZlbmllbmNlIGZvciBwcmVjb21waWxhdGlvbi5cbiAgICB2YXIgYXJndW1lbnQgPSBzZXR0aW5ncy52YXJpYWJsZSB8fCAnb2JqJztcbiAgICB0ZW1wbGF0ZS5zb3VyY2UgPSAnZnVuY3Rpb24oJyArIGFyZ3VtZW50ICsgJyl7XFxuJyArIHNvdXJjZSArICd9JztcblxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfTtcblxuICAvLyBBZGQgYSBcImNoYWluXCIgZnVuY3Rpb24uIFN0YXJ0IGNoYWluaW5nIGEgd3JhcHBlZCBVbmRlcnNjb3JlIG9iamVjdC5cbiAgXy5jaGFpbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciBpbnN0YW5jZSA9IF8ob2JqKTtcbiAgICBpbnN0YW5jZS5fY2hhaW4gPSB0cnVlO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfTtcblxuICAvLyBPT1BcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXG4gIC8vIElmIFVuZGVyc2NvcmUgaXMgY2FsbGVkIGFzIGEgZnVuY3Rpb24sIGl0IHJldHVybnMgYSB3cmFwcGVkIG9iamVjdCB0aGF0XG4gIC8vIGNhbiBiZSB1c2VkIE9PLXN0eWxlLiBUaGlzIHdyYXBwZXIgaG9sZHMgYWx0ZXJlZCB2ZXJzaW9ucyBvZiBhbGwgdGhlXG4gIC8vIHVuZGVyc2NvcmUgZnVuY3Rpb25zLiBXcmFwcGVkIG9iamVjdHMgbWF5IGJlIGNoYWluZWQuXG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGNvbnRpbnVlIGNoYWluaW5nIGludGVybWVkaWF0ZSByZXN1bHRzLlxuICB2YXIgcmVzdWx0ID0gZnVuY3Rpb24oaW5zdGFuY2UsIG9iaikge1xuICAgIHJldHVybiBpbnN0YW5jZS5fY2hhaW4gPyBfKG9iaikuY2hhaW4oKSA6IG9iajtcbiAgfTtcblxuICAvLyBBZGQgeW91ciBvd24gY3VzdG9tIGZ1bmN0aW9ucyB0byB0aGUgVW5kZXJzY29yZSBvYmplY3QuXG4gIF8ubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgICBfLmVhY2goXy5mdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSkge1xuICAgICAgdmFyIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQWRkIGFsbCBvZiB0aGUgVW5kZXJzY29yZSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIgb2JqZWN0LlxuICBfLm1peGluKF8pO1xuXG4gIC8vIEFkZCBhbGwgbXV0YXRvciBBcnJheSBmdW5jdGlvbnMgdG8gdGhlIHdyYXBwZXIuXG4gIF8uZWFjaChbJ3BvcCcsICdwdXNoJywgJ3JldmVyc2UnLCAnc2hpZnQnLCAnc29ydCcsICdzcGxpY2UnLCAndW5zaGlmdCddLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIG1ldGhvZCA9IEFycmF5UHJvdG9bbmFtZV07XG4gICAgXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvYmogPSB0aGlzLl93cmFwcGVkO1xuICAgICAgbWV0aG9kLmFwcGx5KG9iaiwgYXJndW1lbnRzKTtcbiAgICAgIGlmICgobmFtZSA9PT0gJ3NoaWZ0JyB8fCBuYW1lID09PSAnc3BsaWNlJykgJiYgb2JqLmxlbmd0aCA9PT0gMCkgZGVsZXRlIG9ialswXTtcbiAgICAgIHJldHVybiByZXN1bHQodGhpcywgb2JqKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBBZGQgYWxsIGFjY2Vzc29yIEFycmF5IGZ1bmN0aW9ucyB0byB0aGUgd3JhcHBlci5cbiAgXy5lYWNoKFsnY29uY2F0JywgJ2pvaW4nLCAnc2xpY2UnXSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBtZXRob2QgPSBBcnJheVByb3RvW25hbWVdO1xuICAgIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVzdWx0KHRoaXMsIG1ldGhvZC5hcHBseSh0aGlzLl93cmFwcGVkLCBhcmd1bWVudHMpKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBFeHRyYWN0cyB0aGUgcmVzdWx0IGZyb20gYSB3cmFwcGVkIGFuZCBjaGFpbmVkIG9iamVjdC5cbiAgXy5wcm90b3R5cGUudmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fd3JhcHBlZDtcbiAgfTtcblxuICAvLyBQcm92aWRlIHVud3JhcHBpbmcgcHJveHkgZm9yIHNvbWUgbWV0aG9kcyB1c2VkIGluIGVuZ2luZSBvcGVyYXRpb25zXG4gIC8vIHN1Y2ggYXMgYXJpdGhtZXRpYyBhbmQgSlNPTiBzdHJpbmdpZmljYXRpb24uXG4gIF8ucHJvdG90eXBlLnZhbHVlT2YgPSBfLnByb3RvdHlwZS50b0pTT04gPSBfLnByb3RvdHlwZS52YWx1ZTtcbiAgXG4gIF8ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICcnICsgdGhpcy5fd3JhcHBlZDtcbiAgfTtcblxuICAvLyBBTUQgcmVnaXN0cmF0aW9uIGhhcHBlbnMgYXQgdGhlIGVuZCBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIEFNRCBsb2FkZXJzXG4gIC8vIHRoYXQgbWF5IG5vdCBlbmZvcmNlIG5leHQtdHVybiBzZW1hbnRpY3Mgb24gbW9kdWxlcy4gRXZlbiB0aG91Z2ggZ2VuZXJhbFxuICAvLyBwcmFjdGljZSBmb3IgQU1EIHJlZ2lzdHJhdGlvbiBpcyB0byBiZSBhbm9ueW1vdXMsIHVuZGVyc2NvcmUgcmVnaXN0ZXJzXG4gIC8vIGFzIGEgbmFtZWQgbW9kdWxlIGJlY2F1c2UsIGxpa2UgalF1ZXJ5LCBpdCBpcyBhIGJhc2UgbGlicmFyeSB0aGF0IGlzXG4gIC8vIHBvcHVsYXIgZW5vdWdoIHRvIGJlIGJ1bmRsZWQgaW4gYSB0aGlyZCBwYXJ0eSBsaWIsIGJ1dCBub3QgYmUgcGFydCBvZlxuICAvLyBhbiBBTUQgbG9hZCByZXF1ZXN0LiBUaG9zZSBjYXNlcyBjb3VsZCBnZW5lcmF0ZSBhbiBlcnJvciB3aGVuIGFuXG4gIC8vIGFub255bW91cyBkZWZpbmUoKSBpcyBjYWxsZWQgb3V0c2lkZSBvZiBhIGxvYWRlciByZXF1ZXN0LlxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKCd1bmRlcnNjb3JlJywgW10sIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF87XG4gICAgfSk7XG4gIH1cbn0uY2FsbCh0aGlzKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cblxuLy8gU2V0dXBcbiAgICAvLyBMb2FkIGFuZCBjcmVhdGUgbWFpbiBzZXR0aW5ncywgYW5kIHNhdmUgdGhlbSB0byB0aGUgcm9vdCBnbG9iYWwgb2JqZWN0LlxuICAgIHZhciBta19zZXR0aW5ncyA9IHJlcXVpcmUoJy4vbW9kdWxlcy9ta19zZXR0aW5ncycpO1xuICAgIHdpbmRvdy5nID0gbWtfc2V0dGluZ3MoKTtcblxuICAgIGNvbnNvbGUubG9nKCdzZXR0aW5ncycsIGcpO1xuXG5cbiAgICAvL3ZhciB2ZXJzaW9uX3N0cmluZyA9ICdEZXYnO1xuICAgIC8vdmFyIHZlcnNpb25fc3RyaW5nID0gJ0FscGhhMjAxNDAxLS0nO1xuICAgIHZhciB2ZXJzaW9uX3N0cmluZyA9ICdQcmV2aWV3Jyttb21lbnQoKS5mb3JtYXQoJ1lZWVlNTUREJyk7XG4gICAgZy5zdGF0ZS52ZXJzaW9uX3N0cmluZyA9IHZlcnNpb25fc3RyaW5nO1xuICAgIC8vIExvYWQgYW5kIFVSTCBxdWVyeSB2YXJpYWJsZXNcbiAgICB2YXIgcXVlcnkgPSBnLmYucXVlcnlfc3RyaW5nKCk7XG4gICAgLy9jb25zb2xlLmxvZyhxdWVyeSk7XG5cbiAgICB2YXIgdXBkYXRlX3dlYnBhZ2UgPSByZXF1aXJlKCcuL21vZHVsZXMvdXBkYXRlX3dlYnBhZ2UnKTtcblxuICAgIGcuZi51cGRhdGUgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgc2V0dGluZ3MgPSBnO1xuICAgICAgICB2YXIgZiA9IGcuZjtcblxuICAgICAgICBjb25zb2xlLmxvZygnLy0tLSBiZWdpbiB1cGRhdGUnKTtcbiAgICAgICAgZy5mLmNsZWFyX2RyYXdpbmcoKTtcblxuICAgICAgICBzZXR0aW5ncy5zZWxlY3RfcmVnaXN0cnkuZm9yRWFjaChmdW5jdGlvbihzZWxlY3Rvcil7XG4gICAgICAgICAgICBpZihzZWxlY3Rvci52YWx1ZSgpKSBzZWxlY3Rvci5pbnB1dF9yZWYuc2V0KHNlbGVjdG9yLnZhbHVlKCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyByZWNhbGN1bGF0ZSBzeXN0ZW0gc2V0dGluZ3NcbiAgICAgICAgZy5mLnByb2Nlc3Moc2V0dGluZ3MpO1xuXG4gICAgICAgIHVwZGF0ZV93ZWJwYWdlKCk7XG5cbiAgICAgICAgY29uc29sZS5sb2coJ1xcXFwtLS0gZW5kIHVwZGF0ZScpO1xuICAgIH07XG5cblxuLy8gcmVxdWVzdCBleHRlcm5hbCBkYXRhXG5cbiAgICB2YXIgbmV3dHdvcmtfdGVzdCA9IGZhbHNlO1xuXG4gICAgZy5mLnJlcXVlc3RfU1ZHID0gZnVuY3Rpb24oKXtcbiAgICAvLypcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbmRpbmcgZGF0YSB0byBzZXJ2ZXInKTtcbiAgICAgICAgdmFyIHVybCA9ICdodHRwOi8vbG9jYWxob3N0OjQyMzMvcGxhbnNfbWFjaGluZSc7XG4gICAgICAgIHZhciB1c2VyX2lucHV0X2pzb24gPSBKU09OLnN0cmluZ2lmeShnLnVzZXJfaW5wdXQpO1xuICAgICAgICB2YXIgZGF0YSA9IHsgdXNlcl9pbnB1dF9qc29uOiB1c2VyX2lucHV0X2pzb259O1xuICAgICAgICAvL3ZhciBkYXRhID0ge1xuICAgICAgICAvLyAgICB0ZXN0OjQyLFxuICAgICAgICAvLyAgICB0ZXN0MjoyMyxcbiAgICAgICAgLy99O1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlcnZlciByZXNwb25jZT8nLCByZXMpO1xuXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coICdlcnJvcicgKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYWx3YXlzKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnY29tcGxldGUnICk7XG4gICAgICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICAvL3ZhciBkYXRhYmFzZV9qc29uX1VSTCA9ICdodHRwOi8vMTAuMTczLjY0LjIwNDo4MDAwL3RlbXBvcmFyeS8nO1xuICAgIHZhciBkYXRhYmFzZV9qc29uX1VSTCA9ICdkYXRhL2ZzZWNfY29weS5qc29uJztcbiAgICAkLmdldEpTT04oIGRhdGFiYXNlX2pzb25fVVJMKVxuICAgICAgICAuZG9uZShmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGcuRlNFQ19kYXRhYmFzZSA9IGRhdGE7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdkYXRhYmFzZSBsb2FkZWQnLCBzZXR0aW5ncy5kYXRhYmFzZSk7XG4gICAgICAgICAgICBnLmNvbXBvbmVudHMgPSBnLmYubG9hZF9kYXRhYmFzZShkYXRhKTtcbiAgICAgICAgICAgIGcuc3RhdGUuZGF0YWJhc2VfbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmKCBnLnN0YXRlLm1vZGUgPT09ICdkZXYnKXtcbiAgICAgICAgICAgICAgICBnLmYuc2V0dGluZ3NfZGV2X2RlZmF1bHRzKGcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZy5mLnVwZGF0ZSgpO1xuXG4gICAgICAgICAgICAvLy8vLy8vL1xuICAgICAgICAgICAgLy8gVEVNUFxuICAgICAgICAgICAgLy9nLmYucmVxdWVzdF9TVkcoKTtcbiAgICAgICAgICAgIC8vLy8vLy8vXG4gICAgICAgIH0pO1xuXG5cbi8vIEJ1aWxkIHdlYnBhZ2VcblxuICAgIC8vIFNldCBkZXYgbW9kZSBpZiByZXF1ZXN0ZWRcbiAgICBpZiggcXVlcnlbJ21vZGUnXSA9PT0gJ2RldicgKSB7XG4gICAgICAgIGcuc3RhdGUubW9kZSA9ICdkZXYnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGcuc3RhdGUubW9kZSA9ICdyZWxlYXNlJztcbiAgICB9XG5cbiAgICBpZiggcXVlcnlbJ3Bhc3N3b3JkJ10gPT09ICdzZDcyM3Nma2Jncjh5cicgKSB7XG4gICAgICAgIGcuc3RhdGUucGFzc3dvcmQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGcuc3RhdGUucGFzc3dvcmQgPSBmYWxzZTtcbiAgICB9XG5cblxuICAgIGlmKCBnLnN0YXRlLm1vZGUgPT09ICdkZXYnICl7XG4gICAgICAgIGcuZi5zZXR0aW5nc19kZXZfZGVmYXVsdHMoZyk7XG4gICAgfVxuXG4gICAgaWYoIGcuc3RhdGUucGFzc3dvcmQgfHwgcXVlcnlbJ21vZGUnXSA9PT0gJ2RldicgKXtcbiAgICAgICAgZy5mLnNldHVwX3dlYnBhZ2UoKTtcblxuICAgICAgICAvLyBBZGQgc3RhdHVzIGJhclxuICAgICAgICB2YXIgYm9vdF90aW1lID0gbW9tZW50KCk7XG4gICAgICAgIHZhciBzdGF0dXNfaWQgPSAnc3RhdHVzJztcbiAgICAgICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXsgZy5mLnVwZGF0ZV9zdGF0dXNfYmFyKHN0YXR1c19pZCwgYm9vdF90aW1lLCB2ZXJzaW9uX3N0cmluZyk7fSwxMDAwKTtcblxuLy8gVXBkYXRlXG4gICAgICAgIGcuZi51cGRhdGUoKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdubyBwYXNzd29yZCcpO1xuICAgICAgICAkKCc8aW1nPicpXG4gICAgICAgICAgICAuYXR0cignc3JjJywgJ2RhdGEvUGxhbnNNYWNoaW5lLnBuZycpXG4gICAgICAgICAgICAvLy5hdHRyKCdjbGFzcycsICd0aXRsZV9pbWFnZScpXG4gICAgICAgICAgICAuY3NzKCd3aWR0aCcsICczMDBweCcpXG4gICAgICAgICAgICAuY3NzKCdwYWRkaW5nJywgJzMwcHgnKVxuICAgICAgICAgICAgLmNzcygnZGlzcGxheScsICdibG9jaycpXG4gICAgICAgICAgICAuY3NzKCdtYXJnaW4tbGVmdCcsICdhdXRvJylcbiAgICAgICAgICAgIC5jc3MoJ21hcmdpbi1yaWdodCcsICdhdXRvJylcbiAgICAgICAgICAgIC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgJCgnPGRpdj4nKVxuICAgICAgICAgICAgLmF0dHIoJ3N0eWxlJywgJ3RleHQtYWxpZ246IGNlbnRlcicpXG4gICAgICAgICAgICAuaHRtbCgnRGVtbyBub3QgYXZhaWxpYmxlJylcbiAgICAgICAgICAgIC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcbiAgICB9XG4iXX0=
