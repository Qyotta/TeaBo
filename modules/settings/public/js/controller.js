define([
    'jquery',
    'underscore',
    'backbone',
    '/settings/js/collection/settings.js',
    '/settings/js/model/settings.js',
    '/core/js/utils/settings_command.js',
    '/settings/js/views/UserPreferencesDialog.js'
], function($, _, Backbone, UserSettingsCollection, UserSettings, UserSettingsCommand,UserPreferencesDialog){
    var UserSettingsController = function(options){
        
        _.bindAll(this,'sync','set', 'get');
        window.app.eventDispatcher.bind('whiteboard:open',this.sync);
        window.app.eventDispatcher.bind("logout",this.unload);
        this.initialize();
    };
    
    UserSettingsController.prototype = {
        initialize:function(){
            this.userPreferencesDialog = new UserPreferencesDialog();
        },
        sync:function(){
            if(!window.app.loggedIn()){
                return false;
            }
            this.collection = new UserSettingsCollection();
            this.collection.fetch({success: function(collection, response){
                window.app.eventDispatcher.trigger("userSettings:synced",collection);
                window.app.log('userSettings:synced');
            }, error: function() {
                window.app.log('error while syncing settings');
                return false;
            }});
            
        },
        get:function(_key){
            return this.collection.where({key : _key});
        },
        set:function(_key, _value){
          var settings = this.collection.where(_key)[0];
          if(!settings){
              settings = new UserSettings();
              this.collection.add(settings);
          }
          settings.set({
              key : _key, 
              value : _value
          });
          window.app.groupCommand.addCommands(new UserSettingsCommand(
                  '/settings', 
                  {
                      key : _key,
                      value : _value
                  }
              ));
        },
        unload:function(){
            this.collection = null;
        }
    };
    
    return UserSettingsController;
});