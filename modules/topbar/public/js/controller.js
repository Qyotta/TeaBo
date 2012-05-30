define([
    'jquery',
    'underscore',
    'backbone',
    '/topbar/js/views/topbar.js'
], function($, _, Backbone, TopbarView){
    
    var TopbarController = function(options){

        _.bindAll(this,'changeTopbar','openedWhiteboard','closedWhiteboard');
        window.app.eventDispatcher.bind("whiteboard:close",this.closedWhiteboard);
        window.app.eventDispatcher.bind("whiteboard:opened",this.openedWhiteboard);
        window.app.eventDispatcher.bind("topbar:refresh",this.changeTopbar);
        window.app.eventDispatcher.bind("logout",this.changeTopbar);
        window.app.eventDispatcher.bind('userlist:initialized',this.changeTopbar);
        
        this.initialize();
    };
    
    TopbarController.prototype = {
        initialize: function() {
            this.view = new TopbarView();
            
            this.view.render();
        },
        changeTopbar: function() {
            this.view.render();
        },
        openedWhiteboard:function(whiteboard){
            this.view.whiteboard=whiteboard;
            
            this.view.render(whiteboard);
        },
        closedWhiteboard:function(){
            this.view.whiteboard=null;
        }
    };
    
    return TopbarController;
});