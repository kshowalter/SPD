#PV system drawing automatic generation

##Goal

To generate a selection of FSEC pre-approved PV system drawings that will cover a majority of Florida installations.

##Components

* System details collection form
    * This would collect information from the user (modules, inverter, location).
    * The user will most likely be given a list of options (a set number of inputs that have been pre-tested)
        * We could offer a special version that would allow the user to enter all the details themselves. 
            * These systems would not be pre-approved, but..
            * They would be in a clean format that would make the review quicker.
            * This would cover the cases where an installer wanted to use an inverter that was not in our database, or some configruation we had not thought of.
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

##Development stages, major milestones

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


###
##Technical

###Code details
The system is being coded using Javascript. 
This will allow it to be run in any modern browser, and could be integrated into an online system.
If there are any sensitive calculations, they could be moved to the server side.

###Status
The basic functions, data storage objects, and presets are in place.
A portion of the drawing is coded in as a demonstration.

###Testing and FSEC pre-certification
A system of this nature has the potential to generate more drawing variations then could be reviewed by humans.
We need to decide on a sampling procedure to confirm the system is generating acceptable drawings, 
 or limit the output to specific configurations that have been reviews by a human. 
 The second option will still allow FSEC to pre-approve a large number of drawings. 

During development the effects of each of the variables, such as number of modules, will be examined,
 but this is unlikely to catch every bug.
