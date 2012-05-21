define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){
    
    var UserSettings = Backbone.Model.extend({
        idAttribute: "_id"
    });
    return UserSettings;
});