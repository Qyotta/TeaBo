define([
    'jquery',
    'underscore',
    'backbone',
    '/settings/js/collection/settings.js',
    '/settings/js/model/settings.js',
    '/core/js/utils/settings_command.js'
], function($, _, Backbone, UserSettingsCollection, UserSettings, UserSettingsCommand){
    var UserSettingsController = function(options){
        
        _.bindAll(this,'sync','set', 'get');
        window.app.eventDispatcher.bind('whiteboard:open',this.sync);
        window.app.eventDispatcher.bind("logout",this.unload);
        
        this.initialize();
    };
    
    UserSettingsController.prototype = {
        initialize:function(){
            this.userSettings = new UserSettingsCollection();
        },
        sync:function(){
            if(!window.app.loggedIn()){
                return false;
            }
            window.app.log('userSettings:startSync');
            this.userSettings.fetch({success: function(collection, response){
                window.app.eventDispatcher.trigger("userSettings:synced",collection);
                window.app.log('userSettings:synced');
            }, error: function() {
                window.app.log('error while syncing settings');
                return false;
            }});
            
        },
        get:function(_key){
            return this.userSettings.where({key : _key});
        },
        set:function(_key, _value){
          var settings = this.userSettings.where(_key)[0];
          if(!settings){
              settings = new UserSettings();
              this.userSettings.add(settings);
          }
          settings.set({
              key : _key, 
              value : _value
          });
          window.app.groupCommand.addCommands(new UserSettingsCommand(
                  '/user/settings', 
                  {
                      key : _key,
                      value : _value
                  }
              ));
        },
        unload:function(){
            this.userSettings = null;
        }
    };
    
    return UserSettingsController;
});