define([
    'jquery',
    'underscore',
    'backbone',
    '/settings/js/collection/userSettings.js'
], function($, _, Backbone, UserSettings){
    
    var User = Backbone.Model.extend({
        url:'user/',
        idAttribute: "_id",
        settings : UserSettings,
        
    });
    return User;
});