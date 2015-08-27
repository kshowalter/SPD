Drawing = function(g){

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
                //console.log('Error: block already exists');
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
        if( typeof strings === 'string'){
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
        var blk = Object.create(Blk);
        blk.drawing_parts = drawing_parts;

        this.drawing_parts = this.drawing_parts.concat(drawing_parts);
        //this.drawing_parts = this.drawing_parts.concat(drawing_parts);
        return this;
    };




    var page = Object.create(drawing);
    //console.log(page);
    page.drawing_parts = [];
    return page;




};





/////////////////////////////////
