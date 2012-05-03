define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/home/topbar.html'
], function($, _, Backbone, topbarTemplate){
    
    var TopbarView = Backbone.View.extend({
        el: $("#topNavigation"),
        events:{
            'click .right a[href="logout"]' :'logoutClicked',
            'click .right a[href="invite"]' :'inviteClicked',
            'click .right a[href="main"]' :'mainClicked',
            'click .logo a[href="main"]' : 'mainClicked'
        },
        initialize:function(){
            _(this).bindAll('changedUser');
            window.app.user.bind("change", this.changedUser);
        },
        render: function(){
            var _user  = window.app.user;
            
            if(this.whiteboard){
                var view = 'whiteboard';
                var _color = this.whiteboard.getColorByUser(_user.get('email'));
            }
            
            var data = {user:_user,title:null,view: view,versionNumber: window.app.versionNumber,versionType: window.app.versionType,color:_color};
            
            var compiledTemplate = _.template( topbarTemplate, data );
            this.el.html(compiledTemplate);
        },
        changedUser:function(){
            this.render();
        },
        logoutClicked:function(e){
            e.preventDefault();
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