define([
    'jquery',
    'underscore',
    'backbone',
    '/toolbar/js/views/toolbar.js'
], function($, _, Backbone, ToolbarView){
    
    var ToolbarController = function(options){
        _.bindAll(this,'showTools','removeTools');
        window.app.eventDispatcher.bind("whiteboard:opened",this.showTools);
        window.app.eventDispatcher.bind("whiteboard:close",this.removeTools);
        this.initialize();
    };
    
    ToolbarController.prototype = {
        initialize: function() {
            window.app.log('toolbar loaded');
        },
        showTools: function() {
            this.view = new ToolbarView();
        },
        removeTools: function() {
            if(this.view)this.view.unrender();
        }
    };
    
    return ToolbarController;
});