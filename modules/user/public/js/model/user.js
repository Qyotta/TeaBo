define([
    'jquery',
    'underscore',
    'backbone',
    '/settings/js/collection/settings.js'
], function($, _, Backbone, UserSettingsCollection){
    
    var User = Backbone.Model.extend({
        url:'user/',
        idAttribute: "_id",
        settings : UserSettingsCollection,
        
    });
    return User;
});