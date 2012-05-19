define([
    'underscore',
    'backbone',
    'core/models/user',
    'core/models/assignment'
], function(_, Backbone,User) {
    var Assignment = Backbone.Model.extend({
        set: function(attributes, options) {
            if (attributes.user !== undefined && !(attributes.user instanceof User)) {
                attributes.user = new User(attributes.user);
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        }
    });
    
    return Assignment;
});
