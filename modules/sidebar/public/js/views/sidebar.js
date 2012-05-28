define([ 'jquery', 'underscore', 'backbone', 'text!/sidebar/templates/sidebar.html' ],
        function($, _, Backbone, sidebarTemplate) {

            var SidebarView = Backbone.View.extend({
                el : $(".rightNavigation"),
                events : {
                    'click a.slideLeftButton' : 'toggleSidebar',
                },
                initialize : function() {
                    this.render();
                },
                render : function() {
                    var data = {};
                    var compiledTemplate = _.template(sidebarTemplate, data);
                    this.el.html(compiledTemplate);
                },
                // open/close sidebar
                toggleSidebar : function(evt) {
                    evt.preventDefault();
                    
                    var dir = this.el.css('right') === "0px";
                    this.el.animate({right: dir?"-200px":"0px"}, 200);
                },
                unrender : function() {
                    this.el.empty();
                },

            });

            return SidebarView;
        });