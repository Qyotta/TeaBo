define([
    'underscore',
    'jquery',
    'faye'
], function( _, $, faye){
    
    var GroupCommand = function(commands) {
        
        _.bindAll(this, 'startExecTimer');
        
        this.commands = [];
        this.stack    = [];
        
        // start push execution in an interval
        this.execTimer = setTimeout(this.startExecTimer,1000);
    }
    
    GroupCommand.prototype = {
        execute: function() {
            var that = this;
            $.each(that.commands,function(i, command) {
                command.execute();
            });
            this.stack.push(this.commands);
            this.commands = [];
        },
        addCommands: function(commands) {
            this.commands = this.commands.concat(commands);
        },
        startExecTimer: function() {
            if(this.commands.length) {
                this.execute();
            }
            this.execTimer = setTimeout(this.startExecTimer,1000);
        }
    }
    
    return GroupCommand;

});