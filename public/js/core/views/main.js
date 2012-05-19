define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/home/main.html'
], function($, _, Backbone, mainHomeTemplate){
    
    var MainHomeView = Backbone.View.extend({
        el: $("#page"),
        events:{
            'click .mainPanel input[type=submit]' : 'submitClicked',
            'click .mainPanel a.delete' :'deleteWhiteboard',
        },
        initialize:function(){
            _.bindAll(this,'removeWhiteboardView','render','synced','getOwnWhiteboards','getAssignedWhiteboards');
            window.app.eventDispatcher.bind('whiteboard:synced',this.synced);
            window.app.eventDispatcher.bind('mainpanel:show',this.render);
            
        },
        deleteWhiteboard: function(evt){
            evt.preventDefault();
            var id = this.$(evt.currentTarget.parentNode).attr('id');
            var model = this.collection.get(id);
            model.destroy();
        },
        submitClicked: function(evt){
            evt.preventDefault();
            var self = this;
            var name = $('.mainPanel input[name=name]').val();
            window.app.modules.whiteboard.whiteboards.create({name:name},
            {success: function(model, resp) {
                    self.render();
                },
                error: function() {
                    alert('error create whiteboard');
                }
            });
        },
        removeWhiteboardView: function(model){
            $('#' + model.id).remove();
            if(window.app.modules.whiteboard.whiteboards.length===0){
                this.render();
            }
        },
        synced:function(collection){
            this.collection = collection;
            this.collection.bind("remove", this.removeWhiteboardView);
            this.render();
        },
        render: function(){
            if(this.collection==null){
                return;
            }
            var data = { user:window.app.user, ownWhiteboards: this.getOwnWhiteboards(), assignedWhiteboards: this.getAssignedWhiteboards(), _: _ };
            var compiledTemplate = _.template( mainHomeTemplate, data );
            this.el.html(compiledTemplate);
        },
        getOwnWhiteboards: function() {
            var allWhiteboards = this.collection.models,
                user           = window.app.user.attributes.email,
                ownWhiteboards = [];
                
            $.each(allWhiteboards, function(i, whiteboard) {
                $.each(whiteboard.attributes.assignments, function(i, assignment) {
                    if(whiteboard.attributes.creator === user) {
                        ownWhiteboards.push(whiteboard);
                        return false;
                    }
                });
            });
            
            return ownWhiteboards;
        },
        getAssignedWhiteboards: function() {
            var allWhiteboards      = this.collection.models,
                user                = window.app.user.attributes.email,
                assignedWhiteboards = [],
                userMatch           = false;
                
            $.each(allWhiteboards, function(i, whiteboard) {
                $.each(whiteboard.attributes.assignments, function(i, assignment) {
                    if(whiteboard.attributes.creator === user) {
                        userMatch = true;
                    }
                });
                if(!userMatch) {
                    assignedWhiteboards.push(whiteboard);
                }
                userMatch = false;
            });
            
            return assignedWhiteboards;
        }
    });
    
    return MainHomeView;
});