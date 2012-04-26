define([
    'underscore',
    'jquery',
    'cometd'
], function( _, $, cometd){
    
    var SubscribeCommand = function(channel,callback) {
        this.channel  = channel;
        this.callback = callback;
        this.cometd   = $.cometd;
    }
    
    SubscribeCommand.prototype = {
        execute: function() {
            this.cometd.publish(this.channel,this.callback);
        }
    }
    
    return SubscribeCommand;
    
});