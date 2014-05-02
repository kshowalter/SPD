// PV Systems drawing generator






///////////////////
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

var clear = function(div_id){
    document.getElementById(div_id).innerHTML = ''
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



//////////////
// Model


////////////
// layers

var l_attr = {}

l_attr.base = {
    'fill': 'none',
    'stroke':'#000000',
    'stroke-width':'1px',
    'stroke-linecap':'butt',
    'stroke-linejoin':'miter',
    'stroke-opacity':1,

}
l_attr.DC_pos = Object.create(l_attr.base)
l_attr.DC_neg = Object.create(l_attr.base)
l_attr.DC_neg.stroke = '#ff0000'
l_attr.module = Object.create(l_attr.base)
l_attr.box = Object.create(l_attr.base)
l_attr.text = Object.create(l_attr.base)
l_attr.text.stroke = '#0000ff'

fonts = {}
fonts.signs = {
    family:   'Helvetica',
    size:     5,
    anchor:   'middle',
    leading:  '1.5em',
}


///////
// setup drawing container

var layers = {}
for( l in l_attr) {
    layers[l] = []
}

var blocks = []

var clear_drawing = function() {
    blocks.length = 0
    for( var l in l_attr) {
        layers[l] = []
    }

}

//////
// build protoype objects

var Blk = {
    object: 'Blk',
}
Blk.move = function(x, y){
    for( var i in this.array ){
        this.array[i].move(x,y)
    }
    return this
}
Blk.add = function(){
    if( typeof this.array == 'undefined'){ this.array = []}
    for( var i in arguments){
        this.array.push(arguments[i])
    }
    return this
}

var SvgElem = {
    object: 'SvgElem'
}
SvgElem.move = function(x, y){
    if( typeof this.points != 'undefined' ) {
        for( var i in this.points ) {
            this.points[i][0] += x
            this.points[i][1] += y
        }
    }
    return this
}

///////
// functions for adding elements

var add = function(type, points, layer) {
    if( typeof layer == 'undefined' || ! (layer in layers) ) {
        layer =  'base'
    }
    if( typeof points == 'string') {
        var points = points.split(' ')
        for( i in points ) {
            points[i] = points[i].split(',')
            for( var c in points[i] ) {
                points[i][c] = Number(points[i][c])
            }
        }
    }

    var elem = Object.create(SvgElem)
    elem.type = type
    elem.points = points

    layers[layer].push(elem)

    return elem
}

var line = function(points, layer){
    //return add('line', points, layer)
    var line =  add('line', points, layer)
    return line
}

var rect = function(loc, size, layer){
    var rec = add('rect', [loc], layer)
    rec.w = size[0]
    rec.h = size[1]
    return rec
}
var text = function(loc, string, font, layer){
    var txt = add('text', [loc], layer)
    txt.string = string
    txt.font = font
    return txt
}

/////////////////////////////////


log('layers', layers)
//k.obj_log(layers, 'layers', 3)
//log('groups', groups)
//k.obj_log(groups, 'groups', 9)
log('blocks', blocks)

var mk_SVG = function(){
    for( layer_name in layers ){
        var attr = l_attr[layer_name]
    }

}


//////////////
// define drawing info

var module_size = {}
module_size.frame = {}
module_size.frame.w = 10
module_size.frame.h = 30
module_size.lead = module_size.frame.w*2/3
module_size.h = module_size.frame.h + module_size.lead*2
module_size.w = module_size.frame.w

var wire = {}
wire.offset_base = 5
wire.offset_gap = module_size.w

var string = {}
string.num = 5
string.gap = module_size.frame.w/42
string.gap_missing = string.gap + module_size.frame.w
string.h = (module_size.h * 4) + (string.gap * 2) + string.gap_missing
string.w = module_size.frame.w * 2.5

jb = {}
jb.box = {}
jb.box.h = 100
jb.box.w = 50


///////////////
// build drawing

var mk_drawing = function(){
    log('making drawing')

    // PV array
    var coor = { x:200, y:400 }
    blocks.push( mk_array(coor) )
    blocks.push( mk_DC_j_box(coor))
}

var mk_DC_j_box = function( coor ){
    var coor = { x:coor.x, y:coor.y }
    var blk = Object.create(Blk)
    blk.type = 'DV Junction Box'

    var x = coor.x
    var y = coor.y
    var w = 80
    var h = 140

    var fuse_width = wire.offset_gap
    var to_disconnect_x = 200
    var to_disconnect_y = 100

    // combiner box
    blk.add(rect(
        [x+w/2,y-h/10],
        [w,h],
        'box'
    ))

    // DC disconect
    blk.add(rect(
        [x+w/2,y-h/10],
        [w,h],
        'box'
    ))

    for( i in _.range(string.num)) {
        var offset = wire.offset_gap + ( i * wire.offset_base )

        blk.add([
            line([
                [ x , y-offset],
                [ x+(w-fuse_width)/2 , y-offset],
            ], 'DC_pos'),
            line([
                [ x+(w+fuse_width)/2 , y-offset],
                [ x+w+to_disconnect_x-offset , y-offset],
                [ x+w+to_disconnect_x-offset , y-to_disconnect_y],
            ], 'DC_pos')
        ])

        blk.add([
            line([
                [ x , y+offset],
                [ x+(w-fuse_width)/2 , y+offset],
            ], 'DC_neg'),
            line([
                [ x+(w+fuse_width)/2 , y+offset],
                [ x+w+to_disconnect_x+offset , y+offset],
                [ x+w+to_disconnect_x+offset , y-to_disconnect_y],
            ], 'DC_neg')
        ])
    }

    return blk
}

var mk_array = function(coor){
    var coor = { x:coor.x, y:coor.y }
    var blk = Object.create(Blk)
    blk.type = 'array'


    var coor_array = { x:coor.x, y:coor.y }
    coor.x -= module_size.frame.h*3
    coor.y -= string.h/2

    pv_array = {}
    pv_array.upper = coor.y
    pv_array.lower = pv_array.upper + string.h
    pv_array.right = coor_array.x - module_size.frame.h*2
    pv_array.center = coor_array.y
    for( i in _.range(string.num)) {
        var offset = i * wire.offset_base

        blk.add(mk_pv_string(coor))
        // positive home run
        blk.add(line([
            [ coor.x , pv_array.upper ],
            [ coor.x , pv_array.upper-module_size.w-offset ],
            [ pv_array.right+offset , pv_array.upper-module_size.w-offset ],
            [ pv_array.right+offset , pv_array.center-module_size.w-offset],
            [ coor_array.x , pv_array.center-module_size.w-offset],
            //[  ,  ],
        ], 'DC_pos'))

        // negative home run
        blk.add(line([
            [ coor.x , pv_array.lower ],
            [ coor.x , pv_array.lower+module_size.w+offset ],
            [ pv_array.right+offset , pv_array.lower+module_size.w+offset ],
            [ pv_array.right+offset , pv_array.center+module_size.w+offset],
            [ coor_array.x , pv_array.center+module_size.w+offset],
            //[  ,  ],
        ], 'DC_neg'))

        coor.x -= string.w
    }
    return blk

}



var mk_pv_string = function(coor){
    var coor = { x:coor.x, y:coor.y }
    var blk = Object.create(Blk)
    blk.type = 'string'

    var coor_string = {}
    coor_string.x = coor.x
    coor_string.y = coor.y


    var module1 = mk_module(coor_string)
    coor_string.y += module_size.frame.h + module_size.lead*2 + string.gap_missing
    var module2 = mk_module(coor_string)
    coor_string.y += module_size.frame.h + module_size.lead*2 + string.gap
    var module3 = mk_module(coor_string)
    coor_string.y += module_size.frame.h + module_size.lead*2 + string.gap
    var module4 = mk_module(coor_string)
    blk.add(module1,module2,module3,module4)

    return blk
}


var mk_module = function(coor) {
    var coor = { x:coor.x, y:coor.y }
    var blk = Object.create(Blk)
    blk.type = 'module'

    x = coor.x
    y = coor.y

    lead = module_size.lead
    w = module_size.frame.w
    h = module_size.frame.h


    blk.add(
        // frame
        rect(
            [0,h/2],
            [w,h],
            'module'
        ),
        // frame triangle?
        line([
            [-w/2,0],
            [0,w/2],
        ], 'module'),
        line([
            [0,w/2],
            [w/2,0],
        ], 'module'),
        // leads
        line([
            [0, 0],
            [0, -lead]
        ], 'DC_pos' ),
        line([
            [0, h],
            [0, h+(lead)]
        ], 'DC_neg' ),
        // pos sign
        text(
             [lead/2, -lead/2],
            '+',
            'signs',
            'text'
        ),
        // neg sign
        text(
             [lead/2, h+lead/2],
            '-',
            'signs',
            'text'
        )
    )

    blk.move(x,y)
    blk.move(0,lead)
    return blk
}






///////////////////
// Display


var display_svg = function(container_id){
    log('displaying svg')
    document.getElementById(container_id).innerHTML = ''
    //container.empty()

    //var drawing = $("<div>").attr('id', 'drawing')
    //container.append(drawing)
    var svg = SVG(container_id).size(1000,1000)
    //var start_circle = svg.circle(5).move(400,400)

    for( var layer_name in layers){
        var layer = layers[layer_name]
        for( var i in layer){
            var elem = layer[i]
            if( elem.type == 'rect') {
                svg.rect( elem.w, elem.h ).move( elem.points[0][0]-elem.w/2, elem.points[0][1]-elem.h/2 ).attr( l_attr[layer_name] )
            } else if( elem.type == 'line') {
                svg.polyline( elem.points ).attr( l_attr[layer_name] )
            } else if( elem.type == 'text') {
                var t = svg.text( elem.string ).move( elem.points[0][0], elem.points[0][1] ).attr( l_attr[layer_name] )
                t.font(fonts[elem.font])

            }
        }

    }

}

//////////////////////////////////////////
// after page loads functions
var update_drawing = function(){
    log('updating drawing')
    //log($('#string_select option:selected'))
    var svg_container_id = 'svg_container'
    if( document.getElementById(svg_container_id) == null ){
        var svg_container = document.createElement('div')
        svg_container.id = svg_container_id
        document.getElementById('drawing_page').appendChild(svg_container)
    } else {
        var svg_container = document.getElementById(svg_container_id)
    }
    var select_string = document.getElementById('string_select')
    string.num = Number( select_string[select_string.selectedIndex].value )

    clear_drawing()

    mk_drawing()
    display_svg('svg_container')

}

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
            if( i === 4) { op.selected = 'selected' }
            string_select.append(op)
        }
    }
    $('#drawing_page').append(string_select)
    // When number of strings change, update model, display
    string_select.change(function(){
        update_drawing()
    })

    //document.getElementById('drawing_page').appendChild('<a href="#" onclick="clear(\'svg_container\')">clear</a>')

    // Start PV system drawing process
    update_drawing()



})



$(window).ready( function() {
    var boot_time = moment()
    var status_id = "#status"
    setInterval(function(){ k.update_status_page(status_id, boot_time) },1000)






})


