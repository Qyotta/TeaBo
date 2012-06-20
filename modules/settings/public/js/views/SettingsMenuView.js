define([
    'jquery',
    'underscore',
    'backbone',
    'text!/settings/templates/settingsMenu.html'
], function($, _, Backbone, settingsMenuTemplate){
    var SettingsMenuView = Backbone.View.extend({
        id: "settingsMenu",
        events : {
            'click li a' :'menuItemClicked',
        },
        menuItems: [
            {display:"User Preferences",css:"userPreferences"},
            {display:"Change Password",css:"changePassword"}
        ],
        initialize : function(options) {
            _.bindAll(this,'menuItemClicked','unrender');
            window.app.eventDispatcher.bind("logout",this.unrender);
        },
        unrender:function(){
            $(this.el).empty();
        },
        render : function() {
            var data = {
                
            };
            var compiledTemplate = _.template( settingsMenuTemplate, data );
            $(this.el).html(compiledTemplate);
            for(var i=0;i<this.menuItems.length;i++){
                var item = this.menuItems[i];
                $(".settingsMenuContainer ul",this.el).append('<li><a class="'+item.css+'" href="">'+item.display+'</a></li>');
            }
            this.delegateEvents();
            return this;
        },
        menuItemClicked:function(e){
            e.preventDefault();
            var name = $(e.target).attr('class');
            window.app.eventDispatcher.trigger("settingsMenu:"+name);
        }
    });
    return SettingsMenuView;
});