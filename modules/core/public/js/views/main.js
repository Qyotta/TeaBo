define([
    'jquery',
    'underscore',
    'backbone',
    'text!/core/templates/main.html'
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
            $('body').append(this.el);
        },
        getOwnWhiteboards: function() {
            var ownWhiteboards = [];
                
            $.each(this.collection.models, function(i, whiteboard) {
                if(whiteboard.attributes.isOwner) {
                    ownWhiteboards.push(whiteboard.attributes);
                }
            });
            
            return ownWhiteboards;
        },
        getAssignedWhiteboards: function() {
            var assignedWhiteboards = [];
                
            $.each(this.collection.models, function(i, whiteboard) {
                if(!whiteboard.attributes.isOwner) {
                    assignedWhiteboards.push(whiteboard.attributes);
                }
            });
            
            return assignedWhiteboards;
        }
    });
    
    return MainHomeView;
});