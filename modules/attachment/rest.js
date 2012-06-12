var     fs             = require('fs'),
        User           = require('../../modules/user/models/user').model,
        WhiteboardItem = require('../../modules/whiteboardItem/models/whiteboardItem').model,
        mime           = require( "mime" );

var fileUpload = function(req,res){
    var fileExtension = req.files.data.type.split("/").pop();
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
                content     : {filename:'',shortDescription:'',extension:fileExtension, complete:true}
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
    fs.readFile( __dirname+'/uploads/'+req.params.id,"binary", function( error, file ) {
        if( error ){
            res.writeHead( 500, { "Content-Type" : "text/plain" } );
            res.end( error + "\n" );
            return;
         }

        var type = mime.lookup( file );

        res.writeHead( 200, { "Content-Type" : type } );
        res.end( file, "binary" );

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