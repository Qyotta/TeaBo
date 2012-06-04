define([
    'underscore',
    '/assignment/js/collection/assignment.js',
    '/assignment/js/model/assignment.js'
], function(_,AssignmentCollection,Assignment){
    
    var AssignmentController = function(options){
        _.bindAll(this,'loadAssignments');
        
        this.initialize();
    };
    
    AssignmentController.prototype = {
        initialize: function() {
            window.app.eventDispatcher.bind('whiteboard:opened',this.loadAssignments);
        },
        loadAssignments: function(whiteboard) {
            this.assignments = new AssignmentCollection(null,{whiteboardId: whiteboard.id});
            this.assignments.fetch({success: function(collection,response) {
                console.log('assignments synced');
                window.app.eventDispatcher.trigger('assignment:synced',collection);
            }})
        },
        getColor: function(userid) {
            var models = this.assignments.models;
            for(var i=0;i<models.length;i++){
                var a = models[i];
                if(a.get('user').id == userid){
                    return a.get('color');
                }
            }
            return null;
        },
        getUser: function(userid) {
            var models = this.assignments.models;
            for(var i=0;i<models.length;i++){
                var a = models[i];
                if(a.get('user').id == userid){
                    return a.get('user');
                }
            }
            return null;
        }
    }
    
    return AssignmentController;
});