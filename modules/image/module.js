var pubsub  = require('./io');
var service = require('./rest');

var fs = require('fs');
try {
    var pathToUploads = __dirname + "/uploads/"
    fs.mkdirSync(pathToUploads);
    console.log(pathToUploads+" created")
}
catch (e) {
    if(e.code==='EEXIST'){
        console.log("image upload directory already exists");
    }else{
        console.log("\n---------")
        console.log(e);
        console.log("---------\n")
    }   
}

exports.rest = service.rest;
exports.io   = pubsub.io;