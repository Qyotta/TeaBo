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
* install [Java JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) v1.6 or higher
* install [Apache Maven](http://maven.apache.org/download.html) v3.0.3 or higher

Develop in Eclipse
------------------
add M2_REPO variable to your Eclipse workspace using

    $ mvn -Declipse.workspace=PATH_TO_ECLIPSE_WORKSPACE eclipse:add-maven-repo

create Eclipse project (.classpath and .project files) using

    $ cd TARGET_DIR/lao-Online-Collaboration-Platform/de.bht.swp.lao.ocp
    $ mvn eclipse:clean && mvn eclipse:eclipse

now you can import the project in Eclipse

Install
-------
In a console, type

    $ cd TARGET_DIR/lao-Online-Collaboration-Platform/de.bht.swp.lao.ocp/
    $ mvn install

You'll find the WAR file in _TARGET_DIR/lao-Online-Collaboration-Platform/de.bht.swp.lao.ocp/target/ocp.war_

Deployment
----------

### In Jetty using Maven ###
In a console, type

    $ cd TARGET_DIR/lao-Online-Collaboration-Platform/de.bht.swp.lao.ocp
    $ mvn clean jetty:run

### In Tomcat using Maven ###
In a console, type

    $ cd TARGET_DIR/lao-Online-Collaboration-Platform/de.bht.swp.lao.ocp
    $ mvn clean tomcat:run

Open your browser and navigate to http://localhost:8080/de.bht.swp.lao.ocp
