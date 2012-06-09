var     fs             = require('fs'),
        User           = require('../../modules/user/models/user').model,
        WhiteboardItem = require('../../modules/whiteboardItem/models/whiteboardItem').model,
        mime           = require( "mime" );

var imageUpload = function(req,res){
    var imageFileExtension = req.files.data.type.split("/").pop();
    User.findOne({_id:req.session.user._id}, function(err,foundUser) {
            if(err)console.log(err);
            var whiteboardItem = new WhiteboardItem({
                editing     : false,
                orderIndex  : 0, // TODO change this to the current number of items
                x           : req.body.x,
                y           : req.body.y,
                creator     : foundUser._id,
                whiteboard  : req.body.whiteboardId,
                type        : 'image', 
                content     : {extension:imageFileExtension,scale:1.0}
            })
            whiteboardItem.save();

            var id = whiteboardItem._id;
            var newPath = __dirname + "/uploads/"+id;
            
            fs.rename(req.files.data.path, newPath, function (err) {
                if (err) console.log("error in imageUpload: "+err);
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

var imageDownload = function(req,res){
    console.log(__dirname+'/uploads/'+req.params.id);
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

exports.rest = [
    { url: '/image/upload', type: 'post', callback: imageUpload  },
    { url: '/image/:id', type: 'get', callback: imageDownload  },
];