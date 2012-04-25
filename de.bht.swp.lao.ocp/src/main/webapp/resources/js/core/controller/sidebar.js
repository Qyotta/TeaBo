define([
    'jquery',
    'underscore',
    'backbone',
    'core/views/sidebar'
], function($, _, Backbone, SidebarView){
    
    var SidebarController = function(options){
        _.bindAll(this,'showSidebar','removeSidebar');
        window.app.eventDispatcher.bind("whiteboard:open",this.showSidebar);
        window.app.eventDispatcher.bind("whiteboard:close",this.removeSidebar);
        this.initialize();
    };
    
    SidebarController.prototype = {
        initialize: function() {
            window.app.log('sidebar loaded');
        },
        showSidebar: function() {
            this.view = new SidebarView();
        },
        removeSidebar: function() {
            if(this.view){
                this.view.unrender();
            }
        }
    };
    
    return SidebarController;
});