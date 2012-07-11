TeaBo
=====

(Acronym for "team board") is an online collaboration platform for collecting ideas and brainstorming. This is a project of students of the Beuth Hochschule für Technik Berlin, University of Applied Sciences and still under development - check out our [project website](http://teabo.de)!

TeaBo is open source and released under the terms of the [Eclipse Public License 1.0](http://www.eclipse.org/legal/epl-v10.html)(EPL)

Get Code
--------
clone repository to TARGET_DIR using 

    $ cd /TARGET_DIR
    $ git clone https://github.com/Qyotta/TeaBo.git

Prerequesits
------------
* get [node.js](http://nodejs.org/)
* get [npm](http://npmjs.org/)
* get [mongoDB](http://www.mongodb.org/)

Develop
-------
The [teabo-logger](https://github.com/christian-bromann/teabo-logger) is an example module which describes how a module can be build.

Install
-------
In a console, type

    $ cd /TARGET_DIR/TeaBo/
    $ sh install.sh

Deployment
----------
* start mongodb

In a console, type

    $ cd /TARGET_DIR/TeaBo/
    $ node app.js

Open your browser and navigate to http://localhost:3000/. To deploy it on your server, just change the server path credentials in the package.json.