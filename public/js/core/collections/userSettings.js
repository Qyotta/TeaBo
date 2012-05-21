define([ 'jquery', 'underscore', 'backbone', 'core/models/userSettings' ],
        function($, _, Backbone, UserSettings) {

            var UserSettingsCollection = Backbone.Collection.extend({
                model : UserSettings,
                idAttribute: "_id",
                url : 'user/getAllSettings.htm',
                where : function(_key) {;
                    var item = this.filter(function(settings) {
                        return settings.get("key") == _key;
                    });
                    return item;
                    
                },
            });

            return UserSettingsCollection;
        });
