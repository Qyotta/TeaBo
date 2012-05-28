exports.config = {
    
}

exports.init = function() {
    
}

exports.comet = [
        { channel : '/service/whiteboardItem/move', callback : function(message){}},
        { channel : '/service/whiteboardItem/delete', callback : function(message){}},
        { channel : '/service/whiteboardItem/editing', callback : function(message){}},
        { channel : '/service/whiteboardItem/order', callback : function(message){}}     
]