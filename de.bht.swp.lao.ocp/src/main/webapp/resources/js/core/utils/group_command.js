define([
    'underscore',
    'jquery',
    'cometd'
], function( _, $, cometd){
    
    var GroupCommand = function(commands) {
        this.commands = commands;
        this.stack    = [];
        this.cometd   = $.cometd;
    }
    
    GroupCommand.prototype = {
        execute: function() {
            var that = this;
            this.cometd.batch(function() {
                $.each(that.commands,function(i, command) {
                    command.execute();
                })
            })
        },
        addCommands: function(commands) {
            this.commands = commands;
            this.stack.push(commands);
        }
    }
    
    return GroupCommand;

});