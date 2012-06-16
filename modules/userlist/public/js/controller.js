define([
    'underscore',
    '/userlist/js/views/WhiteboardUsersView.js',
    '/userlist/js/views/UserListView.js',
    '/userlist/js/views/colorchooser.js'
], function(_, WhiteboardUsersView, UserListView, ColorChooserView){
    
    var UserListController = function(options){
        _.bindAll(this,'createList','topbarComponent');
        window.app.eventDispatcher.bind('assignment:synced',this.createList);
        this.initialize();
    };
    
    UserListController.prototype = {
        initialize: function() {
            this.view             = new WhiteboardUsersView();
            this.view.render();
            this.colorChooserView = new ColorChooserView();
        },
        topbarComponent: function() {
            return this.view;
        },
        createList: function(assignmentCollection) {
            this.view.setUserListView(new UserListView({model:assignmentCollection}));
            window.app.eventDispatcher.trigger('userlist:initialized',this.view);
        }
    };
    
    return UserListController;
});