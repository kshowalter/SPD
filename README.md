# Plans machine
Updated: 2015-03-17

## Goal
To generate a selection of FSEC pre-approved PV system drawings that will cover a majority of Florida installations.

## Links

* [Demo](http://kshowalter.github.io/plans_machine/)
* [Demo, with defaults](http://kshowalter.github.io/plans_machine/?mode=dev)


## Server

This assumes the installation is on a Fedora OS. If using Debian/Ubuntu, substitute 'apt-get' for 'yum'.

### Setup environment
    su
    (enter root password)
    yum install sudo
    exit
    sudo yum -y install git nodejs

### Build [PhantomJS](http://phantomjs.org/build.html)
    sudo yum -y install gcc gcc-c++ make flex bison gperf ruby openssl-devel freetype-devel fontconfig-devel libicu-devel sqlite-devel libpng-devel libjpeg-devel

    git clone git://github.com/ariya/phantomjs.git
    cd phantomjs
    git checkout 2.0
    ./build.sh

### Install server
    git clone git://github.com/kshowalter/plans_machine plans_machine
    cd plans_machine
    npm install

### Now, to start the server
    nodemon server.js
