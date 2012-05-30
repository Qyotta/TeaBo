define([
    'underscore',
    '/userlist/js/views/UserListView.js'
], function(_, UserListView){
    
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
            window.app.eventDispatcher.trigger('userlist:initialized',this.view);
        }
    }
    
    return UserListController;
});