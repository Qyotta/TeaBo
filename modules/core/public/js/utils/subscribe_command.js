define([
    'underscore',
    'jquery',
    'faye'
], function( _, $, faye){
    
    var SubscribeCommand = function(channel,callback) {
        this.channel  = channel;
        this.callback = callback;
        // this.cometd   = $.cometd;
    }
    
    SubscribeCommand.prototype = {
        execute: function() {
            // this.cometd.subscribe(this.channel,this.callback);
        }
    }
    
    return SubscribeCommand;
    
});