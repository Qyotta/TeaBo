define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    var Tooltips = Backbone.Model.extend({
        url:'tooltips/'
    });
    return Tooltips;
});
