define([
    'jquery',
    'underscore',
    'backbone',
    'core/views/toolbar'
], function($, _, Backbone, ToolbarView){
    
    var ToolbarController = function(options){
        _.bindAll(this,'showTools','removeTools');
        window.app.eventDispatcher.bind("whiteboard:open",this.showTools);
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
            this.view.unrender();
        }
    };
    
    return ToolbarController;
});