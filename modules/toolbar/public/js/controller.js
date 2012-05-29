define([
    'jquery',
    'underscore',
    'backbone',
    '/toolbar/js/views/toolbar.js'
], function($, _, Backbone, ToolbarView){
    
    var ToolbarController = function(options){
        _.bindAll(this,'showTools','removeTools','addToolView');
        window.app.eventDispatcher.bind("whiteboard:opened",this.showTools);
        window.app.eventDispatcher.bind("whiteboard:close",this.removeTools);
        window.app.eventDispatcher.bind("toolbar:addTool",this.addToolView);
        this.initialize();
    };
    
    ToolbarController.prototype = {
        initialize: function() {
            this.tools = [];
        },
        showTools: function() {
            this.view = new ToolbarView({tools:this.tools});
        },
        removeTools: function() {
            if(this.view)this.view.unrender();
        },
        addToolView: function(toolView){
            if(toolView==null)return;
            this.tools[toolView.model.get('action')] = toolView;
        }
    };
    
    return ToolbarController;
});