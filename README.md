#PV system drawing automatic generation

##Goal

To generate a selection of FSEC pre-approved PV system drawings that will cover a majority of Florida installations.

##Status
A demo drawing is generated and shown, lacking some details, but shows what is possible. 
The drawing changes as the system specs are updated with selectors at the top of the page.

##Current focus
Adding more basic features to the demo.

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
    * A standard set of inputs (system specs) that will be tested with each version of the PV system application.

##Development stages, major milestones

* Tech demo
    * A sample of what the application can do. 
    * This has a lot of the backbone of the final application, but lacks details.
* Rough working model
    * At this stage a mostly complete drawing can be generated from a limited number of inputs. 
* Basic application
    * Basic entry form in place.
    * More data encoded into application.
        * Common inverter and module specs.
        * NEC tables.
        * ...
    * Drawing handles more options.
* Feature complete application
    * The application does everything we want for the release, but needs testing and refinement.
* Application complete (1.0 version)
* Application released
* Post launch bug fix
    * There will be problems discovered when the application is release, they should be fixed as quickly as possible.
* Feature addition
    * Addition of any new features that are requested post launch, or could not be implemented in the given time.
* Maintenance
    * Bug fixes
    * Updating product information (new inverter models, NEC rules)




