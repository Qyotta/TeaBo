[lao]
=====

(Acronym for "look ahead online") is an online collaboration platform for collecting ideas and brainstorming. This is a project of
students of the Beuth Hochschule für Technik Berlin, University of Applied Sciences and still under development.

Lao is open source and released under the terms of the [Eclipse Public License 1.0](http://www.eclipse.org/legal/epl-v10.html)(EPL)

Get Code
--------
clone repository to TARGET_DIR using 

    $ cd TARGET_DIR
    $ git clone git@github.com:Softwareprojekt-BHT-Berlin/lao-Online-Collaboration-Platform.git

Prerequesits
------------
* get [node.js](http://nodejs.org/)
* get [mongoDB](http://www.mongodb.org/)

Develop
-------
The [lao-logger](https://github.com/christian-bromann/lao-logger) is an example module which describes how a module can be build.

Install
-------
In a console, type

    $ cd TARGET_DIR/lao-Online-Collaboration-Platform/
    $ sh install.sh

Deployment
----------
In a console, type

    $ cd TARGET_DIR/lao-Online-Collaboration-Platform/
    $ node app.js

Open your browser and navigate to http://localhost:3000/
