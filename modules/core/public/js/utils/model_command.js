define([
    'underscore',
    'jquery',
    'faye'
], function( _, $, faye){
    
    var ModelCommand = function(channel,obj) {
        this.channel = channel;
        this.obj     = obj;
        this.io = window.app.io;
    };
    
    ModelCommand.prototype = {
        execute: function() {
            this.io.publish(this.channel,this.obj);
        }
    };
    
    return ModelCommand;
    
});