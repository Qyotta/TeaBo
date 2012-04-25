define([
    'underscore',
    'jquery',
    'cometd'
], function( _, $, cometd){
    
    var GroupCommand = function(commands) {
        this.commands = commands;
        this.cometd = $.cometd;
        console.log('created instanz');
        var tmp = [];
    }
    
    GroupCommand.prototype = {
        execute: function() {
            var that = this;
            this.cometd.batch(function() {
                $.each(that.commands,function(i, command) {
                    command.execute();
                })
            })
        }
    }
    
    return GroupCommand;

});