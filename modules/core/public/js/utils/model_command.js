define([
    'underscore',
    'jquery',
    'faye'
], function( _, $, faye){
    
    var ModelCommand = function(channel,obj) {
        this.channel = channel;
        this.obj     = obj;
        this.comet  = $.faye;
    };
    
    ModelCommand.prototype = {
        execute: function() {
            window.app.io.publish(this.channel,this.obj);
        }
    };
    
    return ModelCommand;
    
});