define([
    'jquery',
    'underscore',
    'backbone',
    '/whiteboardItem/js/models/whiteboarditem.js'
], function($, _, Backbone, WhiteboardItem){

    var WhiteboardItemCollection = Backbone.Collection.extend({
        initialize: function(models, options) {
            this.id = options.id;
        },
        model: WhiteboardItem,
        url:function(){
            return this.id?'whiteboard/'+this.id+'/whiteboarditem':null;
        },
    });
    
    return WhiteboardItemCollection;
});
