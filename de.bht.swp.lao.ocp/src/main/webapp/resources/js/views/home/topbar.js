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
            'click .right a[href="invite"]' :'inviteClicked'
        },
        initialize:function(){
            _(this).bindAll('changedUser');
            window.app.user.bind("change", this.changedUser);
            this.render();
        },
        render: function(){
            var data = {user:window.app.user,title:null};
            var compiledTemplate = _.template( topbarTemplate, data );
            this.el.html(compiledTemplate);
        },
        changedUser:function(){
            this.render();
        },
        logoutClicked:function(e){
            e.preventDefault();
            window.app.eventDispatcher.trigger("logoutClicked", null);
        },
        inviteClicked:function(e){
            e.preventDefault();
            window.app.eventDispatcher.trigger("inviteClicked", null);
        }
    });
    
    return TopbarView;
});