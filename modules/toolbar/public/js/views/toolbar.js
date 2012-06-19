define([ 'jquery', 
         'underscore', 
         'backbone', 
         'text!/toolbar/templates/toolbar.html' 
], function($, _, Backbone, toolbarTemplate) {

    var ToolbarView = Backbone.View.extend({
        el : $("#bottomNavigation"),
        events : {
            'click a' : 'callToolAction'
        },
        initialize : function() {
            this.render();
        },
        render : function() {
            var data             = {_: _, tools: this.getTools(), links: this.getLinks()},
                compiledTemplate = _.template(toolbarTemplate, data);
            this.el.html(compiledTemplate);
            this.delegateEvents();
        },
        unrender : function() {
            this.el.empty();
        },
        getTools: function() {
            var tools = [],
                modules = window.app.modules;
            $.each(modules,function(module) {
                if(modules[module].toolbarTool) {
                    tools.push(modules[module].toolbarTool);
                }
            });
            return tools;
        },
        getLinks: function() {
            var links   = [],
                modules = window.app.modules;
            $.each(modules,function(module) {
                if(modules[module].toolbarLink) {
                    links.push(modules[module].toolbarLink);
                }
            });
            return links;
        },
        callToolAction: function(e) {
            var action = $(e.target).parent().attr('href');
            e.preventDefault();
            window.app.eventDispatcher.trigger('toolbar:'+action, e.target);
        }
    });

    return ToolbarView;
});