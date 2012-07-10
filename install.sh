#!/bin/bash

npm install express
npm install mime
npm install mongodb --mongodb:native
npm install mongoose
npm install faye
npm install nodemailer
npm install bcrypt

# create upload directories for image and attachment module
mkdir ./modules/attachment/uploads
mkdir ./modules/images/uploads

# comment the next line out, if you want to run tests
# npm install webdriverjs
