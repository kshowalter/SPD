mk_svg = f.mk_svg = function(drawing_parts, settings){
  //console.log('displaying svg');
  //console.log('drawing_parts: ', drawing_parts);
  //container.empty()
  var drawing_settings = settings.drawing_settings;
  var drawing_size = drawing_settings.size.drawing;
  var layer_attr = drawing_settings.layer_attr;
  var fonts = drawing_settings.fonts;

  //var svg_document = document.getElementById('SvgjsSvg1000')
  var svg_document = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  //svg_document.setAttribute('class','svg_drawing');



  //svg_document.setAttribute('width', settings.drawing_settings.size.drawing.w);
  //svg_document.setAttribute('height', settings.drawing_settings.size.drawing.h);
  var view_box = '0 0 ' + drawing_size.w + ' ' + drawing_size.h + ' ';
  //svg_document.setAttribute('x', 0);
  //svg_document.setAttribute('y', 0);
  //svg_document.setAttribute('x', 0);
  //svg_document.setAttribute('y', 0);
  svg_document.setAttribute('viewBox', view_box);
  svg_document.setAttribute('xmlns','http://www.w3.org/2000/svg');
  svg_document.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
  //var svg = snapsvg(svg_document).size(size.drawing.w, size.drawing.h);
  //var svg = snapsvg('#svg_drawing');

  //svg_document.setAttribute('width', drawing_size.w);
  if(Meteor.isClient){
    svg_document.setAttribute('height', settings.webpage.window_height * 0.9);
  }


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
        tspan.textContent = item.strings[attr_name]; // This does not work in IE
        //var html_string = '<tspan x="'+x+'" dy="'+dy+'">'+item.strings[attr_name]+'</tspan>';
        //tspan.outerHTML = html_string;

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
    image.setAttribute('xlink:href', 'http://spd.fsec.ucf.edu/'+item.href);
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
