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
        
        this.initialize();
    };
    
    TopbarController.prototype = {
        initialize: function() {
            this.view = new TopbarView();
            this.view.render();
        },
        changeTopbar: function(whiteboard) {
            if(whiteboard) {
                var view = 'whiteboard';
            }
            this.view.render(view);
        }
    };
    
    return TopbarController;
});