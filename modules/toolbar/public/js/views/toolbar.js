define([ 'jquery', 
         'underscore', 
         'backbone', 
         'text!/toolbar/templates/toolbar.html' 
], function($, _, Backbone, toolbarTemplate) {

            var ToolbarView = Backbone.View.extend({
                el : $("#bottomNavigation"),
                events : {
                    'click a.createNote' : 'createNoteClicked',
                    'click a.uploadFile' : 'createAttachmentClicked',
                    'click a[href=showToolTips]' : 'showToolTips'
                },
                initialize : function() {
                    window.app.eventDispatcher.bind("toolbar:addTool",this.addTool);
                    window.app.eventDispatcher.bind("toolbar:addElement",this.addElement);
                    this.render();
                },
                render : function() {
                    var data = {};
                    var compiledTemplate = _.template(toolbarTemplate, data);
                    this.el.html(compiledTemplate);
                },
                unrender : function() {
                    this.el.empty();
                },
                createNoteClicked : function(evt) {
                    // prevent action if a dialog is open
                    if($('#dialogs').css('display') === 'block') {
                        return;
                    }
                    evt.preventDefault();
                    window.app.eventDispatcher.trigger("note:create", null);
                },
                showToolTips : function(evt) {
                    // prevent action if a dialog is open
                    if($('#dialogs').css('display') === 'block') {
                        return;
                    }
                    evt.preventDefault();
                    window.app.eventDispatcher.trigger("toolbar:showToolTips", null);
                },
                createAttachmentClicked : function(evt) {
                    // prevent action if a dialog is open
                    if($('#dialogs').css('display') === 'block') {
                        return;
                    }
                    evt.preventDefault();
                    window.app.eventDispatcher.trigger("attachment:create", null);
                },
                addTool: function(html) {
                    this.el.find('ul:first-Child').append('<li>' + html + '</li>')
                },
                addElement: function(html) {
                    this.el.find('ul:last-Child').append('<li><div>' + html + '</div></li>')
                }
            });

            return ToolbarView;
        });