define([
    'underscore',
    '/assignment/js/collection/assignment.js',
    '/assignment/js/model/assignment.js',
    '/core/js/utils/model_command.js',
    '/core/js/utils/subscribe_command.js',
], function(_,AssignmentCollection,Assignment,ModelCommand,SubscribeCommand){
    
    var AssignmentController = function(options){
        _.bindAll(this,'assignmentCreated','whiteboardOpened','whiteboardClosed','userColorUpdated','userOnlineStatusUpdated','assignmentAdded');
        window.app.eventDispatcher.bind('assignment:created',this.assignmentCreated);
        window.app.eventDispatcher.bind('whiteboard:opened',this.whiteboardOpened);
        window.app.eventDispatcher.bind('whiteboard:close',this.whiteboardClosed);
        this.initialize();
    };
    
    AssignmentController.prototype = {
        initialize: function() {
            $(window).unload( this.whiteboardClosed );
        },
        subscribeChannels:function(){
            this.subscriptions = [];
            this.subscriptions.push(window.app.io.subscribe('/assignment/change/color/'+ this.whiteboard.id, this.userColorUpdated));
            this.subscriptions.push(window.app.io.subscribe('/assignment/change/onlineStatus/'+ this.whiteboard.id, this.userOnlineStatusUpdated));
            this.subscriptions.push(window.app.io.subscribe('/assignment/added/'+ this.whiteboard.id, this.assignmentAdded));
        },
        unsubscribeChannels:function(){
            _.each(this.subscriptions,function(subscription){
                subscription.cancel();
            })
        },
        assignmentCreated:function(assignment){
            new ModelCommand('/assignment/added/'+this.whiteboard.id,assignment).execute();
        },
        assignmentAdded:function(assignment){
            this.assignments.add(new Assignment(assignment));
        },
        userColorUpdated:function(message){
            console.log(message);
            //var _assignmentId = message.data.id;
            //var assignment = this.assignments.get(_assignmentId);
            //assignment.set({color:[message.data.color_r/255,message.data.color_g/255,message.data.color_b/255]});
        },
        userOnlineStatusUpdated:function(message){
            var _assignmentId = message.id;
            var assignment = this.assignments.get(_assignmentId);
            assignment.set({onWhiteboard : message.onWhiteboard});
            this.assignments.sort();
        },
        whiteboardOpened:function(whiteboard){
            this.whiteboard = whiteboard;
            this.assignments = new AssignmentCollection(null,{whiteboardId: whiteboard.id});
            var self = this;
            this.assignments.fetch({success: function(collection,response) {
                self.setOnlineStatus(true);
                self.subscribeChannels();
                window.app.eventDispatcher.trigger('assignment:synced',collection);
            }});
            
        },
        whiteboardClosed:function(){
            this.unsubscribeChannels();
            this.setOnlineStatus(false);
            this.whiteboard = null;
            this.assignments = null;
        },
        setOnlineStatus:function(online){
            var assignments = this.assignments;
            if(!assignments)return;

            var models = assignments.models;

            _.each(assignments.models,function(assignment){
               if(assignment.get('user').id === window.app.user.id){
                   var data = {
                       assignmentId : assignment.id,
                       value : online
                   };
                   // TODO: Timeout is necessary because cometD subscription needs some Time, otherwise the state would not be registered by own client
                   window.setTimeout(function (){
                       new ModelCommand('/service/assignment/changeOnlineStatus',data).execute();
                       }, 1000);
               }
            });
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