var     fs             = require('fs'),
        User           = require('../../modules/user/models/user').model,
        WhiteboardItem = require('../../modules/whiteboardItem/models/whiteboardItem').model,
        mime           = require( "mime" );

var fileUpload = function(req,res){
    var allowedTypes = ["application/pdf",
                        "application/msword",
                        "application/x-tika-ooxml",
                        "application/vnd.ms-excel",
                        "application/x-tika-ooxml",
                        "application/vnd.ms-powerpoint",
                        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                        "application/vnd.oasis.opendocument.text",
                        "application/x-vnd.oasis.opendocument.text",
                        "application/vnd.oasis.opendocument.presentation",
                        "application/x-vnd.oasis.opendocument.presentation",
                        "application/vnd.oasis.opendocument.formula",
                        "application/x-vnd.oasis.opendocument.formula"];
   
    
    var _filename = req.files.data.name;
    var fileExtension = req.files.data.name.split('.').pop();
    var mimeType = req.files.data.type;
    var _shortDescription = req.body.shortDescription;
    
    var allowed = false;
    for(index in allowedTypes){
        if(mimeType == allowedTypes[index]){ 
            allowed = true;
            break;
        }
    }
    if(allowed == false){
        console.log("fileType not allowed:"+mimeType);
        //TODO notify user
        res.end();
    }
    User.findOne({_id:req.session.user._id}, function(err,foundUser) {
            if(err)console.log(err);
            var whiteboardItem = new WhiteboardItem({
                editing     : false,
                orderIndex  : 0, // TODO change this to the current number of items
                x           : req.body.x,
                y           : req.body.y,
                creator     : foundUser._id,
                whiteboard  : req.body.whiteboardId,
                type        : 'attachment', 
                content     : {filename:_filename,shortDescription:_shortDescription,extension:fileExtension, complete:true}
            });
            whiteboardItem.save();

            var id = whiteboardItem._id;
            var newPath = __dirname + "/uploads/"+id;
            
            fs.rename(req.files.data.path, newPath, function (err) {
                if (err) console.log("error in fileUpload: "+err);
                res.send({ x : whiteboardItem.x,
                      y : whiteboardItem.y,
                      _id: id,
                      creator     : whiteboardItem.creator,
                      editing     : whiteboardItem.editing,
                      orderIndex  : whiteboardItem.orderIndex,
                      type        : whiteboardItem.type,
                      content     : whiteboardItem.content
                    });
            });
        })
};

var fileDownload = function(req,res){
    
        WhiteboardItem.findOne({_id:req.params.id}, function(err, attachment){
            if( err ){
                res.writeHead( 500, { "Content-Type" : "text/plain" } );
                res.end( error + "\n" );
                return;
             }
            fs.readFile( __dirname+'/uploads/'+req.params.id,"binary", function( error, file ) {
                if( error ){
                    res.writeHead( 500, { "Content-Type" : "text/plain" } );
                    res.end( error + "\n" );
                    return;
                }
                var type = mime.lookup( file );

                res.writeHead( 200, { "Content-Type" : type, "Content-Disposition" : "attachment; filename="
                   + attachment.content.filename } );
                res.end( file, "binary" );
            });
        });

};

var fileDelete = function(req,res){
    fs.unlink(__dirname+'/uploads/'+req.params.id, function (err) {
        if (err) console.log("error in fileDelete: "+err);
        else console.log('successfully deleted '+__dirname+'/uploads/'+req.params.id);
        res.end();
    });
};

exports.rest = [
    { url: '/attachment/upload', type: 'post', callback: fileUpload  },
    { url: '/attachment/:id', type: 'get', callback: fileDownload  },
    { url: '/attachment/delete/:id', type: 'get', callback: fileDelete  },
];