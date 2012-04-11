define([
    'jquery',
    'underscore',
    'backbone',
    'views/home/topbar'
], function($, _, Backbone, TopbarView){
    
    var TopbarController = function(options){
        _.bindAll(this,'changeTopbar');
        window.app.eventDispatcher.bind("whiteboard:close",this.changeTopbar);
        window.app.eventDispatcher.bind("whiteboard:opened",this.changeTopbar);
        window.app.eventDispatcher.bind("topbar:refresh",this.changeTopbar);
        window.app.eventDispatcher.bind("logout",this.changeTopbar);
        
        this.initialize();
    };
    
    TopbarController.prototype = {
        initialize: function() {
            window.app.log('topbar loaded');
            this.view = new TopbarView();
            this.view.render();
        },
        changeTopbar: function(whiteboard) {
            if(whiteboard) {
                var view = 'whiteboard';
            }
            console.log('lets change it up!');
            this.view.render(view);
        }
    };
    
    return TopbarController;
});