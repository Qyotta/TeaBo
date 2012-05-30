define([
    'underscore',
    '/userlist/js/views/UserListView.js',
    '/userlist/js/views/colorchooser.js'
], function(_, UserListView, ColorChooserView){
    
    var UserListController = function(options){
        _.bindAll(this,'createList');
        window.app.eventDispatcher.bind('assignment:synced',this.createList);
        this.initialize();
    };
    
    UserListController.prototype = {
        initialize: function() {
            
        },
        createList: function(assignmentCollection) {
            this.view = new UserListView({model: assignmentCollection});
            if(!this.colorChooserView) {
                this.colorChooserView = new ColorChooserView();
            }
            window.app.eventDispatcher.trigger('userlist:initialized',this.view);
        }
    }
    
    return UserListController;
});