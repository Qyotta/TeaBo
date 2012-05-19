define([
    'jquery',
    'underscore',
    'backbone',
    'modules/attachment/model_attachment'
], function($, _, Backbone, Attachment){

    var AttachmentCollection = Backbone.Collection.extend({
        initialize: function(models, options) {
            this.id = options.id;
        },
        model: Attachment,
        url:function(){
            return this.id?'whiteboard/'+this.id+'/attachments':null;
        },
    });
    
    return AttachmentCollection;
});
