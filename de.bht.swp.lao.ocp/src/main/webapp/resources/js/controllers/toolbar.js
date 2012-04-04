define([
    'jquery',
    'underscore',
    'backbone',
    'views/home/toolbar'
], function($, _, Backbone, ToolbarView){
    
    var ToolbarController = function(options){
        _.bindAll(this,'showTools','removeTools');
        window.app.eventDispatcher.bind("whiteboard:open",this.showTools);
        window.app.eventDispatcher.bind("whiteboard:close",this.removeTools);
    };
    
    ToolbarController.prototype = {
        showTools: function() {
            this.view = new ToolbarView();
        },
        removeTools: function() {
            this.view.remove();
        }
    };
    
    return ToolbarController;
});