define([
    'underscore',
    'backbone',
    '/user/js/model/user.js',
    '/assignment/js/model/assignment.js'
], function(_, Backbone,User) {
    var Assignment = Backbone.Model.extend({
        set: function(attributes, options) {
            if (attributes.user !== undefined && !(attributes.user instanceof User)) {
                attributes.user = new User(attributes.user);
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        },
        idAttribute: "_id"
    });
    
    return Assignment;
});
