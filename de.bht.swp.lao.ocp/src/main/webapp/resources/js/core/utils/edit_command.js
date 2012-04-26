define([
    'underscore',
    'jquery',
    'cometd'
], function( _, $, cometd){
    
    var EditCommand = function(obj) {
        this.channel = '/service/note/edit/';
        this.obj     = obj;
        this.cometd  = $.cometd;
    }
    
    EditCommand.prototype = {
        execute: function() {
            this.cometd.publish(this.channel,this.obj);
        }
    }
    
    return EditCommand;
    
});