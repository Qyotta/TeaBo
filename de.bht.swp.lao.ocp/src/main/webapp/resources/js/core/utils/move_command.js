define([
    'underscore',
    'jquery',
    'cometd'
], function( _, $, cometd){
    
    var MoveCommand = function(obj) {
        this.channel = '/service/whiteboardItem/move';
        this.obj     = obj;
        this.cometd = $.cometd;
    }
    
    MoveCommand.prototype = {
        execute: function() {
            this.cometd.publish(this.channel,this.obj);
        }
    }
    
    return MoveCommand;
    
});