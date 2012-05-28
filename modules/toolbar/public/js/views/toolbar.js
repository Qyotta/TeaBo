define([ 'jquery', 
         'underscore', 
         'backbone', 
         'text!/toolbar/templates/toolbar.html' 
], function($, _, Backbone, toolbarTemplate) {

    var ToolbarView = Backbone.View.extend({
        el : $("#bottomNavigation"),
        events : {
            'click a[href=showToolTips]' : 'showToolTips'
        },
        initialize : function(options) {
            this.toolViews = options.tools;
            this.render();
        },
        render : function() {
            var data = {};
            var compiledTemplate = _.template(toolbarTemplate, data);
            this.el.html(compiledTemplate);
            for (i in this.toolViews){
                $(".tools").append(this.toolViews[i].render().el);
            }
        },
        unrender : function() {
            this.el.empty();
        },
        showToolTips : function(evt) {
            // prevent action if a dialog is open
            if($('#dialogs').css('display') === 'block') {
                return;
            }
            evt.preventDefault();
            window.app.eventDispatcher.trigger("toolbar:showToolTips", null);
        },
    });

    return ToolbarView;
        });