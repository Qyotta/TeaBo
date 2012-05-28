define([
    'underscore',
    'jquery'
], function( _, $){
    
    var UserSettingsCommand = function(path,obj) {
        this.path = path;
        this.obj     = obj;
    };
    
    UserSettingsCommand.prototype = {
        execute: function() {
            $.ajax({
                url: this.path,
                type: 'POST',
                data: $.param(this.obj),
                success: function(jsonData) {
                    
                }
            });
        }
    };
    
    return UserSettingsCommand;
    
});