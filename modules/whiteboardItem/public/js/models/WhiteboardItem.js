define([
    'underscore',
    'backbone',
    '/core/js/models/Object.js'
], function(_, Backbone,Object) {
    var WhiteboardItem = Backbone.Model.extend({
        idAttribute: "_id",
        defaults: {
            content: new Object(),
        },
        set: function(attributes, options) {
            if (attributes.content !== undefined && !(attributes.content instanceof Object)) {
                attributes.content = new Object(attributes.content);
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        },
        parse: function(response) {
            response.content = new Object(response.content);
            return response;
        }
    });
    
    return WhiteboardItem;
});
