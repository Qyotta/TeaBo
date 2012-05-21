define([
    'jquery',
    'underscore',
    'backbone',
    'core/collections/userSettings'
], function($, _, Backbone, UserSettings){
    
    var User = Backbone.Model.extend({
        url:'user/',
        idAttribute: "_id",
        settings : UserSettings,
        
    });
    return User;
});