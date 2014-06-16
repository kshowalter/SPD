#PV system drawing automatic generation

##Goal

To generate a selection of FSEC pre-approved PV system drawings that will cover a majority of Florida installations.

##Status
A basic drawing is generated, and some aspects of the system can be configured.

##Current focus
Adding basic features, and reorganization of code.

##Components

* Calculation of system specs
    * Examples:
        * Array configuration -> DC voltage and current
        * Inverter model -> Voltage window, power clipping, efficiency
        * DC current -> conducter size based on NEC table lookup
* Drawing generator.
    * A script that takes the system configuration to generates a drawing.
    * The drawing elements are stored in a generic form, and translated to the separate formats
        * SVG(or Canvas, or Image) generator for web interface
        * CAD file generator for use printing (used on site for installation)
    * Much of the basic drawing code can be reusable between electrical and structural.
* Test script.
    * A standard set of inputs (system specs) that will be tested with each version of the PV system program.

##Major milestones

* Rough working model
    * At this stage a mostly complete drawing can be generated from a limited number of inputs. 
* Basic program
    * Basic entry form in place.
    * More data encoded into program.
        * Common inverter and module specs.
        * NEC tables.
        * ...
    * Drawing handles more options.
* Feature complete program
    * The program does everything we want for the release, but needs testing and refinement.
* Program complete (1.0 version)
* Program released
* Post launch bug fix
    * There will be problems discovered when the program is release, they should be fixed as quickly as possible.
* Feature addition
    * Addition of any new features that are requested post launch, or could not be implemented in the given time.
* Maintenance
    * Bug fixes
    * Updating product information (new inverter models, NEC rules)

##Development Phases

###Feature phase
Maintain a list of features, issue fixes, and improvements that will be added to the program up to the end of the phase. Features that do not make it in by the end of the phase, are put aside for future development.

###Cleanup phase
Continue to fix issues, improve existing features, and prepare for release.

###Testing phase
Expand the user test group, and concentrate on fixing issues. Features that are suggested by test users are either added, or stored for later, based on there value, the time needed to add to the application, and the time left until launch.

###Post launch development
Fix issues as quickly as possible, and continue development as time and funding allows.



##Features
The following a list of proposed features, it will be updated during development. 
The features will be added to the application until the feature complete deadline.

* ~~Functions to add basic elements to drawing container.~~
* ~~Function to renter drawing elements to SVG on page.~~
* ~~System to select system configuration.~~
* Warning of range warning.
* PDF file generation.
* CAD file generation.
