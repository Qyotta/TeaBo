define([
    'jquery',
    'underscore',
    'backbone',
    'text!/core/templates/main.html',
    '/core/js/views/notice/error.js',
], function($, _, Backbone, mainHomeTemplate, Error){
    
    var MainHomeView = Backbone.View.extend({
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
            if(name.length == 0){
                new Error({message:"Please insert a name for the whiteboard."});
                return false;
            }
            window.app.modules.whiteboard.whiteboards.create({name:name},
            {success: function(model, resp) {
                    self.render();
                },
                error: function() {
                    new Error({message:"Unknown error while creating whiteboard. Please try again"});
                    return false;
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
            $(this.el).addClass("mainPanel");
            if(this.collection==null){
                // whiteboards are not synced
                window.app.eventDispatcher.trigger("whiteboard:sync");
                return;
            }
            var data = { user:window.app.user, ownWhiteboards: this.getOwnWhiteboards(), assignedWhiteboards: this.getAssignedWhiteboards(), _: _ };
            var compiledTemplate = _.template( mainHomeTemplate, data );
            this.el.innerHTML = compiledTemplate;
            $("#page").html(this.el);
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