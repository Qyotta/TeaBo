define([
    'underscore',
    'backbone',
    '/core/js/models/Object.js'
], function(_, Backbone,Object) {
    var WhiteboardItem = Backbone.Model.extend({
        idAttribute: "_id",
        set: function(attributes, options) {
            if (attributes.content !== undefined && !(attributes.content instanceof Object)) {
                attributes.content = new Object(attributes.content);
            }else{
                attributes.content = new Object();
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
