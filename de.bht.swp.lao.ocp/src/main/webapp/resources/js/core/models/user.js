define([
    'jquery',
    'underscore',
    'backbone',
    'core/collections/userSettings'
], function($, _, Backbone, UserSettings){
    
    var User = Backbone.Model.extend({
        url:'user/',
        settings : UserSettings
    });
    return User;
});