#PV system drawing automatic generation

##Goal

To generate a selection of FSEC pre-approved PV system drawings that will cover a majority of the Florida installations.

##Technical

###Code details
The system is being coded using Javascript. 
This will allow it to be run in any modern browser, and could be integrated into an online system.
If there are any sensitive calculations, they could be moved to the server side.

Each element object (line, circle, text) in the drawing object is added to a layer container.
The elements are also stored in a tree structure of blocks (groups of objects). 
A function takes each element from each layer
, applies the layer attributes (color, line size, etc.)
, then adds each to the SVG on the page.
A function can be added to generate a CAD file instead of an SVG.

###Status
The basic functions, data storage objects, and presets are in place.
A portion of the drawing is coded in as a demonstration.


