# Plans machine
Updated: 2015-03-17

## Goal
To generate a selection of FSEC pre-approved PV system drawings that will cover a majority of Florida installations.

## Links

* [Meteor version](http://spd.fsec.ucf.edu/)
* [Old demo](http://kshowalter.github.io/plans_machine/)
* [Old demo, with defaults](http://kshowalter.github.io/plans_machine/?mode=dev)

## Build instructions

### Install:
  * Nodejs
  * Meteor

  * Ghostscript
    * On Debian/Ubuntu:

      ```
      sudo apt-get install ghostscript
      ```

  * Phantomjs
    * Follow instructions to build phantomjs, or..
    * At FSEC
      * Windows

        look in this folder for the download and install script
        \\shares.fsec.ucf.edu\PUBLIC\SSR\Projects\SPD\Code\PDF creation\phantomjs proof of concept\ubuntu14_install_phantomjs198.sh
        \\shares.fsec.ucf.edu\PUBLIC\SSR\Projects\SPD\Code\PDF creation\phantomjs proof of concept\phantomjs-1.9.8-linux-x86_64.tar.bz2

      * Linux

        In file explorer:
        smb://shares/public/SSR/Projects/SPD/Code/PDF%20creation/phantomjs%20proof%20of%20concept/

        copy to local:
        * ubuntu14_install_phantomjs198.sh
        * phantomjs-1.9.8-linux-x86_64.tar.bz2

    * Run:
    ```
    chmod +x ubuntu14_install_phantomjs198.sh
    sudo ./ubuntu14_install_phantomjs198.sh
    phantomjs --version
    ```

### Start server:

    meteor
