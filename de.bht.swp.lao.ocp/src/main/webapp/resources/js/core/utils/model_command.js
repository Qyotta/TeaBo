define([
    'underscore',
    'jquery',
    'cometd'
], function( _, $, cometd){
    
    var ModelCommand = function(channel,obj) {
        this.channel = channel;
        this.obj     = obj;
        this.cometd  = $.cometd;
    }
    
    ModelCommand.prototype = {
        execute: function() {
            this.cometd.publish(this.channel,this.obj);
        }
    }
    
    return ModelCommand;
    
});