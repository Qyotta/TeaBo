define([ 
    'jquery', 
    'underscore', 
    'backbone', 
    '/settings/js/model/settings.js' 
], function($, _, Backbone, UserSettings) {

    var UserSettingsCollection = Backbone.Collection.extend({
        model : UserSettings,
        idAttribute: "_id",
        url : '/settings',
        where : function(_key) {;
            var item = this.filter(function(settings) {
                return settings.get("key") == _key;
            });
            return item;
            
        },
    });

    return UserSettingsCollection;
});
