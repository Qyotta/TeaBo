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
            'click .mainPanel a.delete' :'deleteWhiteboard'
        },
        initialize:function(){
            _(this).bindAll('removeWhiteboardView');
			window.app.createdWhiteboards.bind("remove", this.removeWhiteboardView);
        },
        deleteWhiteboard: function(evt){
            evt.preventDefault();
            var self = this;
            var id = this.$(evt.currentTarget.parentNode).attr('id');
            var model = window.app.createdWhiteboards.get(id);
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
            window.app.createdWhiteboards.create({name:name},
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
            if(window.app.createdWhiteboards.length===0){
                this.render();
            }
        },
        render: function(){
			window.app.log(window.app);
            var data = { createdWhiteboards: window.app.createdWhiteboards.models,assignedWhiteboards: window.app.assignedWhiteboards.models, _: _ };
            var compiledTemplate = _.template( mainHomeTemplate, data );
            this.el.html(compiledTemplate);
        }
    });
    
    return MainHomeView;
});