define([
    'jquery',
    'underscore',
    'backbone',
    'models/note'
], function($, _, Backbone, Note){

    var NoteCollection = Backbone.Collection.extend({
        initialize: function(models, options) {
            this.id = options.id;
        },
        model: Note,
        url:function(){
            return this.id?'whiteboard/'+this.id+'/notes':null;
        },
    });
    
    return NoteCollection;
});
