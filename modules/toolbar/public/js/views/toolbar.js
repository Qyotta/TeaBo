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
            _.bindAll(this,'compareIndex');
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
        compareIndex: function(a,b) {
            if(a.index === undefined) {
                return true;
            } else if(b.index === undefined) {
                return false;
            } else {
                return a.index > b.index;
            }
        },
        getTools: function() {
            var tools = [],
                modules = window.app.modules;
            $.each(modules,function(module) {
                if(modules[module].toolbarTool) {
                    modules[module].toolbarTool.index = modules[module].index;
                    tools.push(modules[module].toolbarTool);
                }
            });

            tools.sort(this.compareIndex);
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
            window.app.eventDispatcher.trigger('toolbar:openDialog');
        }
    });

    return ToolbarView;
});