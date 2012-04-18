define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/toolbar.html'
], function($, _, Backbone, toolbarTemplate){
    
    var ToolbarView = Backbone.View.extend({
        el: $("#bottomNavigation"),
        events:{
            'click a.createNote' :'createNoteClicked',
            'click a[href=showToolTips]' :'showToolTips'
        },
        initialize:function(){
            this.render();
        },
        render: function(){
            var data = {};
            var compiledTemplate = _.template( toolbarTemplate, data );
            this.el.html(compiledTemplate);
        },
        createNoteClicked:function(evt){
            evt.preventDefault();
            window.app.eventDispatcher.trigger("note:create", null);
        },
        unrender: function() {
            this.el.empty();
        },
        showToolTips: function(evt) {
            evt.preventDefault();
            window.app.eventDispatcher.trigger("toolbar:showToolTips", null);
        }
    });
    
    return ToolbarView;
});