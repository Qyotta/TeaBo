define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/whiteboard/whiteboard.html',
], function($, _, Backbone, whiteboardTemplate){
    
    var WhiteboardView = Backbone.View.extend({
        el: $("#page"),
        events:{
            //'click .mainPanel input[type=submit]' : 'submitClicked',
        },
        initialize:function(){
            this.render();
        },
        render:function(){
            var data = { _: _ };
            var compiledTemplate = _.template( whiteboardTemplate, data );
            this.el.html(compiledTemplate);
        }
    });
    
    return WhiteboardView;
});