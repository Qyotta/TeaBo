define([
    'underscore',
    '/userlist/js/views/WhiteboardUsersView.js',
    '/userlist/js/views/UserListView.js',
    '/userlist/js/views/colorchooser.js'
], function(_, WhiteboardUsersView, UserListView, ColorChooserView){
    
    var UserListController = function(options){
        _.bindAll(this,'createList','topbarComponent','whiteboardOpened','whiteboardClosed');
        window.app.eventDispatcher.bind('assignment:synced',this.createList);
        window.app.eventDispatcher.bind('whiteboard:opened',this.whiteboardOpened);
        window.app.eventDispatcher.bind('whiteboard:closed',this.whiteboardClosed);
        this.initialize();
    };
    
    UserListController.prototype = {
        initialize: function() {
            this.view             = new WhiteboardUsersView();
            this.colorChooserView = new ColorChooserView();
        },
        topbarComponent: function() {
            return this.view;
        },
        whiteboardOpened: function(whiteboard){
            this.view.render();
        },
        whiteboardClosed: function(whiteboard){
            this.view.unrender();
        },
        createList: function(assignmentCollection) {
            this.view.setUserListView(new UserListView({model:assignmentCollection}));
            window.app.eventDispatcher.trigger('userlist:initialized',this.view);
        }
    };
    
    return UserListController;
});