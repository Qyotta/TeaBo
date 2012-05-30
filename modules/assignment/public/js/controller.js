define([
    'underscore',
    '/assignment/js/collection/assignment.js'
], function(_,AssignmentCollection){
    
    var AssignmentController = function(options){
        _.bindAll(this,'loadAssignments');
        
        this.initialize();
    };
    
    AssignmentController.prototype = {
        initialize: function() {
            window.app.eventDispatcher.bind('whiteboard:opened',this.loadAssignments);
            
        },
        loadAssignments: function(whiteboard) {
            this.assignments = new AssignmentCollection({whiteboardId: whiteboard.id});
            this.assignments.fetch({success: function(collection,response) {
                console.log('assignments synced');
                window.app.eventDispatcher.trigger('assignment:synced',collection);
            }})
        }
    }
    
    return AssignmentController;
});