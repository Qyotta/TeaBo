define([
    'jquery',
    'underscore',
    'backbone',
    'core/models/whiteboard'
], function($, _, Backbone, Whiteboard){

    var WhiteboardCollection = Backbone.Collection.extend({
        model: Whiteboard,
        url: 'whiteboard/'
    });
    
    return WhiteboardCollection;
});
