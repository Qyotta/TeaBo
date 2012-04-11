define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/whiteboard/whiteboard.html',
], function($, _, Backbone, whiteboardTemplate){
    
    var WhiteboardView = Backbone.View.extend({
        events:{
            //'click .mainPanel input[type=submit]' : 'submitClicked',
        },
        initialize:function(whiteboard){
        
        }
    });
    
    return WhiteboardView;
});