e = {};
e.options = function(settings){
    settings.options = settings.options || {};
    try { settings.options.AC = settings.options.AC || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.options.AC.loadcenter_types = settings.options.AC.loadcenter_types || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.options.AC.loadcenter_types["240V"] = ["240V","120V"];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.options.AC.loadcenter_types["208/120V"] = ["208V","120V"];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.options.AC.loadcenter_types["480/277V"] = ["480V Wye","480V Delta","277V"];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.options.AC.types = settings.options.AC.types || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.options.AC.types["120V"] = ["ground","neutral","L1"];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.options.AC.types["240V"] = ["ground","neutral","L1","L2"];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.options.AC.types["208V"] = ["ground","neutral","L1","L2"];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.options.AC.types["277V"] = ["ground","neutral","L1"];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.options.AC.types["480V Wye"] = ["ground","neutral","L1","L2","L3"];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.options.AC.types["480V Delta"] = ["ground","L1","L2","L3"];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.options.DC = settings.options.DC || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.options.DC.AWG = null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    return settings;
};
e.inputs = function(settings){
    settings.inputs = settings.inputs || {};
    try { settings.inputs.module = settings.inputs.module || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.module.make = null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.module.model = null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.array = settings.inputs.array || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.array.num_module = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.array.num_strings = [1,2,3,4,5,6];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.DC = settings.inputs.DC || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.DC.home_run_length = [25,50,75,100,125,150];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.DC.wire_size = settings.options.DC_AWG;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.inverter = settings.inputs.inverter || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.inverter.make = null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.inverter.model = null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.AC = settings.inputs.AC || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.AC.loadcenter_type = ["240V","208/120V","480/277V"];}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.AC.type = settings.options.AC.loadcenter_types[settings.system.AC.loadcenter_type] || null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.AC.loadcenter = null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.inputs.AC.distance_to_loadcenter = null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    return settings;
};
e.system = function(settings){
    settings.system = settings.system || {};
    try { settings.system.module = settings.system.module || {};}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.system.module.pmp = null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.system.module.vmp = null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.system.module.imp = null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.system.module.voc = null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.system.module.isc = null;}
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
    try { settings.system.AC.AWG = null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    try { settings.system.AC.num_conductors = null;}
    catch(e) { if(settings.state.database_loaded) console.log(e); }
    return settings;
};
module.exports = e;