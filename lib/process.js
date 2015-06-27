f.process = function(settings) {
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
        //inputs.module.model.options  = f.obj_names( settings.components.modules[system.module.make] );
        inputs.module.model.options  = _.uniq(Components.find({}).map(function(doc){
          return doc.make;
        }));
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
        inputs.inverter.model.options  = _.uniq(Components.find({}).map(function(doc){
          return doc.make;
        }));
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


    settings.drawing.parts = {};
    settings.drawing.svgs = [];

    for( var page_name in f.mk_sheet_num ){

    }
    settings.drawing_settings.sheets.forEach(function(sheet_info, i){
        p = i+1;
        settings.drawing.parts[p] = mk_sheet(settings, sheet_info);

        if( Meteor.isClient ){
          settings.drawing.svgs.push(
            f.mk_svg(settings.drawing.parts[p], settings.drawing_settings)
          );
        }

//        settings.drawing.parts[p] = f.mk_sheet_num[p](settings);
    });


    var preview_table = {
        'section_location': [],
        'section_map': [],
        'section_roof': [ settings.drawing.preview_svgs['roof'] ],
        'section_module': [ settings.drawing.preview_svgs['elec'], settings.drawing.preview_svgs['roof'] ],
        'section_array': [ settings.drawing.preview_svgs['elec'] ],
        'section_DC': [ settings.drawing.preview_svgs['elec'] ],
        'section_inverter': [ settings.drawing.preview_svgs['elec'] ],
        'section_AC': [ settings.drawing.preview_svgs['elec'] ],
        'section_attachment_system': [ settings.drawing.preview_svgs['roof'] ],
    };


    sections.forEach(function(section_name,id){ //TODO: find pre IE9 way to do this?
        var svg_drawing_container = $('#section_'+section_name)
          .children('.drawer')
          .children('.drawer_content')
          .children('.svg_drawing_container');
        svg_drawing_container.empty();
        console.log(section_name);
        preview_table['section_'+section_name].forEach(function(preview_svg){
            svg_drawing_container.append(
                $(preview_svg).clone()
                    .attr('class', 'svg_drawing_preview')
            );
        });

        if( section_name === active_section ){
            $('#section_'+section_name).children('.drawer').children('.drawer_content').slideDown('fast');

        } else if( ! g.webpage.selections_manual_toggled[section_name] ){
            $('#section_'+section_name).children('.drawer').children('.drawer_content').slideUp('fast');
        }
    });



};
