/**
 *
 * @type {{tiles: Array, input: Array, railCount: number, displayTiles: Function, setModules: Function, randomModules: Function, searchTile: Function, getPositions: Function}}
 */
rails = {
	tiles: [],
	railCount: 0,

	/**
	 *
	 * @param prop
	 */
	displayTiles: function (prop)
	{
		var debugOutput = "";
		for(var y=0; y<rails.tiles.length; y++)
		{
			for(var x=0; x<rails.tiles[y].length; x++)
			{
				debugOutput+= rails.tiles[y][x][prop]+"\t";
			}
			debugOutput+= "\n";
		}
		console.log(debugOutput);
	},

	/**
	 *
	 */
	setModules: function()
	{
		//console.log(g.webpage.selected_modules);
		rails.tiles = [];
		var r = 1;
		var c = 1;
		while(g.webpage.selected_modules[r] !== undefined)
		{
			var row = [];
			while(g.webpage.selected_modules[r][c] !== undefined)
			{
				//console.log("g.webpage.selected_modules[%s][%s])", r, c, g.webpage.selected_modules[r][c]);
				row.push({ r:r-1, c:c-1, value:g.webpage.selected_modules[r][c], searched:false, rail:false });
				c++;
			}
			rails.tiles.push(row);
			r++;
			c=1;
		}
		console.log("setTiles(g.webpage.selected_modules):", g.webpage.selected_modules);
		console.log("setTiles():", rails.tiles);


		//for(var y=1; y<rails.input.length; y++)
		//{
		//	rails.tiles[y] = [];
		//	for(var x=1; x<rails.input[y].length; x++)
		//	{
		//		rails.tiles[y][x] = { x:x, y:y, value:rails.input[y][x], searched:false, rail:false };
		//	}
		//}
	},

	/**
	 *
	 * @returns {Array}
	 */
	randomModules: function() {

		var modules = [];
		var width = Math.floor(Math.random()*5)+5;
		var height = Math.floor(Math.random()*5)+5;
		console.log("Random %s by %s", width, height);
		for(var y=0; y<height; y++)
		{
			modules[y] = "";
			for(var x=0; x<width; x++)
			{
				modules[y]+= (Math.random() > 0.2);
			}
		}
		return modules;
	},

	/************************************************************************************************************************
	 * Recursively searches through the grid of modules (2d array tiles[]) to find tiles that are "connected" from left to right.
	 * When two modules next to each other, they can be isntalled on the same "rail".
	 * Calling this sets the "rail" attribute of each entry of tiles[] to "false" if it's not part of a rail, or if it is part of a rail,
	 * sets "rail" to the number of that rail.
	 *
	 * @param {number} r - row in grid
	 * @param {number} c - column in grid
	 * @param {object} previousTile - tile previously searched
	 ************************************************************************************************************************/
	searchTile: function(r, c, previousTile)
	{
		if(!(rails.tiles[r] && rails.tiles[r][c])) return;

		var tile = rails.tiles[r][c];
		if(tile.searched) return;
		else tile.searched = true;

		//not part of a rail
		if(!tile.value) return;

		if(previousTile) tile.rail = previousTile.rail;
		else tile.rail = ++rails.railCount;

		console.log("searchTile(%s, %s):", r, c, tile.rail);
		//search Up
		//searchTile(x, y-1, tile);
		//search Down
		//searchTile(x, y+1, tile);
		//search Left
		//searchTile(x-1, y, tile);
		//Search Right
		rails.searchTile(r, c+1, tile);
	},

	/************************************************************************************************************************
	 * Loops through the grid of modules (2d array tiles[]) to find tiles that are "connected" from left to right
	 *
	 * @returns {Array}
	 ************************************************************************************************************************/
	getRails: function()
	{

		//rails.displayTiles("value");

		rails.railCount = 0;
		for(var r=0; r<rails.tiles.length; r++)
		{
			for(var c=0; c<rails.tiles[r].length; c++)
			{
				rails.searchTile(r, c);
			}
		}
		//rails.displayTiles("rail");

		var rail_sections = [];
		for(var r=0; r<rails.tiles.length; r++)
		{

			var rail_start = false;
			var rail_end = false;
			for(var c=0; c<rails.tiles[r].length; c++)
			{
				//console.log("getRails(%s, %s):", r, c, rails.tiles[r][c].value, rails.tiles[r][c].rail);
				/* This module is part of a rail */
				if(rails.tiles[r][c].rail)
				{
					if(!rail_start) rail_start = {r:r, c:c};
					rail_end = {r:r, c:c};
				}
				else /* This module is not part of a rail, so it could mean it's the end of the rail */
				{
					if(rail_start) rail_sections.push({start:rail_start, end:rail_end});
					rail_start = false;
					rail_end = false;
				}
			}
			/* If the last module in the row was part of a rail, then the rail has ended */
			if(rail_start) rail_sections.push({start:rail_start, end:rail_end});
		}


		return rail_sections;
	}

};
//
//rails.setModules();
//console.log(rails.getPositions());




