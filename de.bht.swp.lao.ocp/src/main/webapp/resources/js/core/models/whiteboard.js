define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    var Whiteboard = Backbone.Model.extend({
        defaults: {
            name: null,
            x:0,
            y:0
        },
    });
    
    return Whiteboard;
});
