define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){
    
    var User = Backbone.Model.extend({
        url:'user/'
    });
    return User;
});