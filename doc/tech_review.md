#PV applications

##Options
* Servers
    * Apache HTTP Server
        * Common option, just over half of top servers on internet.
        * Relativly stable and well known.
        * This has been the standard for a long time, so it has a lot going for it, but also a lot of baggage.
    * [Node.js](https://en.wikipedia.org/wiki/Node.js)
        * The latest and greatest.
        * This seems to be where server side coding is moving, so a lot of active projects developing tools for Node.
        * Is supose to be be faster and more scalable.
        * Uses javascript for server side coding.
* Server size programing
    * PHP
        * Most common and easy to setup (standard in Apache HTTP server).
    * Python
        * Easier for non-programers to learn.
        * Easier to read.
        * Has many well developed advanced math and analysis libraries.
    * Javascript (Node.js)
        * Browser code has to be javascript, but could be written in other launguages and cross-compliled to javascript.
        * Making the server side and browser code in the same launguage is simpler, and is less confusing for programers.
        * Is sometimes viewed as a less desirable launguage to code, but this is most likely because some the the core concepts are different than other launguages.
    * ...many other options
        * Tony wrote the instrument database application in C#. That is a fine option as long as Microsoft supports it.
* Interface
    * HTML
        * Mostly created with javascript or template launguage, rather than hand coded.
* Database categories
    * SQL
    * NoSQL
        * Not table based.
        * Each entry is a "Document". 
        * More flexible than SQL, but can mimic it's table based database.
        * Many impementaion: 
            * MongoDB (Seems to be the most popular)
            * CouchDB
* Typical software stacks (combinations of the above options)
    * [LAMP/WAMP](https://en.wikipedia.org/wiki/LAMP_%28software_bundle%29): Apache, PHP, SQL DB, with minimal Javascript in HTML
    * [MEAN](https://en.wikipedia.org/wiki/MEAN): Node.js, Javascript, MongoDB(or other NoSQL), 


##Best stating path
* Build simple web form to database application with Node, Express(or similar), and MongoDB.
* Build quick viewer for database content.
* Incorporate contents of sample PDF application form.
* Duplicate as much of the layout of the sample PDF form as is appropriate.
* Start adding interactive elements. Such as:
    * Check ranges on input.
    * Auto calculate values (ex: string and array voltage and current totals).
* Start to build system drawing generator (with an option to export CAD file).
