define([], function() {
    
    var SubscribeCommand = function(channel,callback) {
        this.channel  = channel;
        this.callback = callback;
        this.io       = window.app.io;
    }
    
    SubscribeCommand.prototype = {
        execute: function() {
            this.io.subscribe(this.channel,this.callback);
        }
    }
    
    return SubscribeCommand;
    
});