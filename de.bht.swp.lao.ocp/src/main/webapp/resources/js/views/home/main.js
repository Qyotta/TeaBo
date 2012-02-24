// Filename: views/home/main
define([
    'jquery',
    'underscore',
    'backbone',
    'collections/whiteboard',
    'text!templates/home/main.html'
], function($, _, Backbone,WhiteboardCollection, mainHomeTemplate){
    
    var MainHomeView = Backbone.View.extend({
        el: $("#page"),
        events:{
            'click .mainPanel input[type=submit]' : 'submitClicked',
            'click .mainPanel a.delete' :'deleteWhiteboard'
        },
        initialize:function(){
            _(this).bindAll('removeWhiteboardView');
            this.createdWhiteboards = new WhiteboardCollection();
            this.createdWhiteboards.url = config.contextPath+"/whiteboard/created";
            this.createdWhiteboards.bind("remove", this.removeWhiteboardView);
            
            this.assignedWhiteboards = new WhiteboardCollection();
            this.assignedWhiteboards.url = config.contextPath+"/whiteboard/assigned";
        },
        deleteWhiteboard: function(evt){
            evt.preventDefault();
            var self = this;
            var id = this.$(evt.currentTarget.parentNode).attr('id');
            var model = self.createdWhiteboards.get(id);
            model.destroy({
                success: function(model, response){
                    self.createdWhiteboards.remove(model)
                }
            });
        },
        submitClicked: function(evt){
            evt.preventDefault();
            var self = this;
            var name = $('.mainPanel input[name=name]').val();
            this.createdWhiteboards.create({name:name},
            {success: function(model, resp) {
                    self.render();
                },
                error: function() {
                    alert('error create whiteboard');
                }
            });
            this.render();
        },
        removeWhiteboardView: function(model){
            $('#' + model.id).remove();
            if(this.createdWhiteboards.length===0){
                this.render();
            }
        },
        render: function(){
            var data = { createdWhiteboards: this.createdWhiteboards.models,assignedWhiteboards: this.assignedWhiteboards.models, _: _ };
            var compiledTemplate = _.template( mainHomeTemplate, data );
            this.el.html(compiledTemplate);
        }
    });
    
    var initialize = function(){
        var mainHomeView = new MainHomeView();
        
        mainHomeView.createdWhiteboards.fetch({success: function(){
            mainHomeView.assignedWhiteboards.fetch({success: function(){
                mainHomeView.render();
            }});
        }});
    };
    return {
        initialize: initialize
    };
});