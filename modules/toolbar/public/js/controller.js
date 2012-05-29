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
    };
    
    ToolbarController.prototype = {
        showTools: function() {
            this.view = new ToolbarView({tools:this.tools});
        },
        removeTools: function() {
            if(this.view)this.view.unrender();
        }
    };
    
    return ToolbarController;
});