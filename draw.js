
//////////////////////////////////////////
// misc functions


function get_JSON(URL, name) {
    $.getJSON( URL, function( json ) {
        build_comps(json)
    }).fail(function(jqxhr, textStatus, error) { 
        console.log( "error", textStatus, error  ) 
    })
}

function format_floats( elem, index, array ) {
    array[index] = parseFloat(elem).toFixed(2)
}

function format_float( str ) {
    return parseFloat(str).toFixed(2)
}


/*
 *  normRand: returns normally distributed random numbers
 *  http://memory.psych.mun.ca/tech/snippets/random_normal/
 */
function normRand(mu, sigma) {
    var x1, x2, rad

    do {
        x1 = 2 * Math.random() - 1
        x2 = 2 * Math.random() - 1
        rad = x1 * x1 + x2 * x2
    } while(rad >= 1 || rad === 0)

    var c = Math.sqrt(-2 * Math.log(rad) / rad)
    var n = x1 * c
    return (n * mu) + sigma
}









/////////////////////////////////////////////
// DRAWING

var module_size = {}
module_size.frame = {}
module_size.frame.w = 10
module_size.frame.h = 30
module_size.lead = module_size.frame.w*2/3
module_size.h = module_size.frame.h + module_size.lead*2
module_size.w = module_size.frame.w

var string = {}
string.num = 5
string.gap = module_size.frame.w/10
string.gap_missing = module_size.frame.w 
string.h = (module_size.h * 4) + (string.gap * 3) + string.gap_missing
string.w = module_size.frame.w * 2.5

var mk_drawing = function(container){
    log('making drawing')
    var pv_array = { x:400, y:400 } 

    container.empty()
    var drawing = $("<div>").attr('id', 'drawing')
    container.append(drawing)
    var svg = SVG('drawing').size(600,1000)
    var start_circle = svg.circle(5).move(pv_array.x,pv_array.y)
    var coor = { x:pv_array.x, y:pv_array.y } 
    coor.x -= module_size.frame.h*3
    coor.y -= string.h/2

    pv_array.upper = coor.y
    pv_array.lower = pv_array.upper + string.h
    pv_array.right = pv_array.x - module_size.frame.h*2 
    pv_array.center = pv_array.y

    var string1 = mk_pv_strings(svg, coor, pv_array)
}
var mk_pv_strings = function(svg, coor, pv_array){
    var group = svg.group()
    for( i in _.range(string.num)) {
        var offset = i * module_size.w/2
        group.add(mk_pv_string(svg, coor)) 
        // draw positive home run
        svg.polyline([
            [ coor.x , pv_array.upper ],
            [ coor.x , pv_array.upper-module_size.w-offset ],
            [ pv_array.right+offset , pv_array.upper-module_size.w-offset ],
            [ pv_array.right+offset , pv_array.center-module_size.w-offset],
            [ pv_array.x , pv_array.center-module_size.w-offset],
            //[  ,  ],
        ])
                      .fill('none').stroke({ width: 1 })
        // draw negative home run
        svg.polyline([
            [ coor.x , pv_array.lower ],
            [ coor.x , pv_array.lower+module_size.w+offset ],
            [ pv_array.right+offset , pv_array.lower+module_size.w+offset ],
            [ pv_array.right+offset , pv_array.center+module_size.w+offset],
            [ pv_array.x , pv_array.center+module_size.w+offset],
            //[  ,  ],
        ])
                      .fill('none').stroke({ width: 1 })
        coor.x -= string.w
    }
    /*
    */

}

var mk_pv_string = function(svg, coor) {
    var coor_string = {}
    coor_string.x = coor.x
    coor_string.y = coor.y

    var module1 = mk_pv_module(svg, coor_string)
    coor_string.y += module_size.frame.h + module_size.lead*2 + module_size.frame.w/10 + module_size.frame.w 
    var module2 = mk_pv_module(svg, coor_string)
    coor_string.y += module_size.frame.h + module_size.lead*2 + module_size.frame.w/10
    var module3 = mk_pv_module(svg, coor_string)
    coor_string.y += module_size.frame.h + module_size.lead*2 + module_size.frame.w/10
    var module4 = mk_pv_module(svg, coor_string)

    var group = svg.group()
    group.add(module1,module2,module3,module4)
    
    return group
}

var mk_pv_module = function(svg, coor) {
    var coor_module = {}
    coor_module.x = coor.x
    coor_module.y = coor.y
    x = coor_module.x
    y = coor_module.y 

    var module_lines = []
    module_lines.push(svg.rect(module_size.frame.w,module_size.frame.h).attr({
        fill:'none',
        stroke:'#000000',
        //stroke-module_size.frame.w:'1px'
    
    }))
    module_lines.push( svg.line( 0, 0, module_size.frame.w/2, module_size.frame.w/2 ).stroke({ width: 1 }) )
    module_lines.push( svg.line( module_size.frame.w/2, module_size.frame.w/2, module_size.frame.w, 0 ).stroke({ width: 1 }))
    var lead_lines = []
    lead_lines.push(svg.line( module_size.frame.w/2, 0, module_size.frame.w/2, -module_size.lead ).stroke({width:1}))
    lead_lines.push(svg.line( module_size.frame.w/2, module_size.frame.h, module_size.frame.w/2, module_size.frame.h+module_size.lead ).stroke({width:1}))

    
    var group = svg.group() 
    //module_lines.forEach(group.add)
    module_lines.forEach(function(element){
        group.add(element)
    })
    //lead_lines.forEach(group.add)
    lead_lines.forEach(function(element){
        group.add(element)
    })
    group.move(x,y)
    group.dmove(-module_size.w/2, module_size.lead)

    return group    
}


//////////////////////////////////////////
// after page loads functions

$(document).ready( function() {
    var title = 'PV drawing test'
    var sections = {
        'drawing_page':'Drawing', 
        'test':'test', 
        'text_dump':'text_dump' 
    }

    k.setup_body(title, sections)
 
    
    
    var dump = $('#text_dump')
    dump.text('this is a test')
    
    var string_select = $('<select>').attr('id','string_select')
    for( i in _.range(10)) {
        if( i != 0 ){
            var op = new Option()
            op.value = i
            op.text = String(i) + ' string'
            string_select.append(op) 
        }
    }
    $('#drawing_page').append(string_select)


    var svg_container = $('<div>').attr('id','svg_container')
    $('#drawing_page').append(svg_container)
    mk_drawing(svg_container)
    string_select.change(function(){
        log($('#string_select option:selected'))
        string.num = Number($('#string_select option:selected')[0].value)
        mk_drawing(svg_container)
    })

})



$(window).ready( function() {
    var boot_time = moment()
    var status_id = "#status"
    setInterval(function(){ k.update_status_page(status_id, boot_time) },1000)
    
    

    

    
})


