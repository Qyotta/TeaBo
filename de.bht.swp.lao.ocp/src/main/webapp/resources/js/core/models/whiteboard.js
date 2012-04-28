define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    var Whiteboard = Backbone.Model.extend({
        defaults: {
            name: null
        },
    });
    
    return Whiteboard;
});
