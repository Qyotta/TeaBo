define([
    'jquery',
    'underscore',
    'backbone',
    '/core/js/views/notice/notice.js',
    '/core/js/views/notice/error.js',
    '/settings/js/views/SettingsMenuView.js',
    'text!/topbar/templates/topbar.html'
], function($, _, Backbone, Notice, Error, SettingsMenuView, topbarTemplate){
    
    var TopbarView = Backbone.View.extend({
        el: $("#topNavigation"),
        events:{
            'click .right a[href="logout"]' :'logoutClicked',
            'click .right a[href="invite"]' :'inviteClicked',
            'click .right a[href="main"]' :'mainClicked',
            'click .logo a[href="main"]' : 'mainClicked'
        },
        initialize:function(){
            _(this).bindAll('changedUser','render');
            
            this.isInviteInProgress = false;

            this.settingsMenuView = new SettingsMenuView();
            
            window.app.user.bind("change", this.changedUser);
        },
        render: function(){
            var user  = window.app.user,
                title = null,
                view  = null;
            
            if(this.whiteboard){
                view = 'whiteboard';
            }

            if(window.app.modules.whiteboard && window.app.modules.whiteboard.whiteboard) {
                title = window.app.modules.whiteboard.whiteboard.attributes.name;
            }
            
            var data = {
                user:          user,
                title:         title,
                view:          view,
                versionNumber: window.app.versionNumber,
                versionType:   window.app.versionType
            };

            var that             = this;
            var components       = this.getTopbarComponents();
            var compiledTemplate = _.template( topbarTemplate, data );
            this.$el.html(compiledTemplate);
            
            if(window.app.loggedIn()){
                $(this.el).find('.right > div').prepend(this.settingsMenuView.render().el);
            }
            
            $.each(components,function(i, component) {
                // append view to the topbar
                that.$el.find('div.left').append(component.el);
                // delegate events to the module view
                // note: events don't fire, if the view isn't in the dom
                component.delegateEvents(component.events);
            });
        },
        getTopbarComponents: function() {
            var components = [],
                modules    = window.app.modules;
            
            $.each(modules,function(module) {
                if(modules[module].topbarComponent) {
                    components.push(modules[module].topbarComponent());
                }
            });
            return components;
        },
        changedUser:function(){
            this.render();
        },
        logoutClicked:function(e){
            e.preventDefault();
            $('.lightbox').hide();
            window.app.eventDispatcher.trigger('logoutClicked', null);
        },
        inviteClicked:function(e){
            e.preventDefault();
            window.app.eventDispatcher.trigger('topbar:inviteClicked', null);
        },
        mainClicked:function(e) {
            e.preventDefault();
            window.app.eventDispatcher.trigger('whiteboard:close',null);
            window.router.navigate("main", {trigger: true});
        }
    });
    
    return TopbarView;
});