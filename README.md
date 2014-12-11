# Plans machine
Updated: 2014-10-23

## Goal
To generate a selection of FSEC pre-approved PV system drawings that will cover a majority of Florida installations.

## Links
These are temporary.

* [kshowalter/pv_draw](http://fsec.ucf.edu/~kshowalter/pv_draw)
* [kshowalter/pv_draw_dev](http://fsec.ucf.edu/~kshowalter/pv_draw_dev)

## The process
* A user visits the "plans machine" application on the FSEC website
* The plans machine:
    * Collects input from the user ( a customer, usually an installer)
    * Calculates system specifications
    * Displays a sample drawing
* Once the system is configured, the configuration is sent to the server
* The server must verify the configuration, and repeat the drawing generation
* The user pays for the permit package, and receives the PDF in a secure manor
* The user sends the permit package to the AHJ

## Server functions

### Demo phase
* Serves plans machine application files to browser (html, js, css)
* Hosts database of system components
    * Modules
    * Inverters
* Provides interface to allow FSEC employees to keep database updated.
* Receives system configuration from server
* Verifies the configuration as valid
* Generates a PDF that is sent back to the user via the web app.

### Longterm
The longterm plans are to add:

* Payment processing
* System verification page for AHJs
* Login system for customers (installers)
* Login system for component manufacturers to maintain the component database

## Settings
Many of the settings for the application will be stored in JSON formated files.
These are what is commonly called configuration files. The settings define what input is requested from the user, and hopefully most of the calculations for the PV system. Some aspects of the drawing may be specified in the settings files.

The JSON format is not unreasonable for a non-programer to edit in a text editor, but a graphical interface to edit and download the latest version of the setting will be provided. The advantage over other formats is that JSON can be imported directly into the application.
Examples are shown below.

![Figure 1: JSON sample](doc/img/JSON_sample.png)

![Figure 2: JSON editor](doc/img/JSON_GUI.png)

There are other format options for configuration files that might be easier to edit, but would would comprimise the deepth of settings that could be easily specified.

## Development Phases

### Feature phase
The core engine of the application will be developed.
Features will be added to the application up to the end of the phase.
Features that do not make it in by the end of the phase, are put aside for future development.

### Cleanup phase
Continue to fix issues, improve existing features, and prepare for release.

### Testing phase
Expand the user test group, and concentrate on fixing issues. Features that are suggested by test users are either added, or stored for later, based on there value, the time needed to add to the application, and the time left until launch.

### Post launch development
Fix issues as quickly as possible, and continue development as time and funding allows.
