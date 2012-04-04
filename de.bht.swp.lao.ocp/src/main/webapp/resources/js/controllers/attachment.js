define([
    'jquery',
    'underscore',
    'backbone',
    'collections/attachment',
    'views/attachment/attachment'
], function($, _, Backbone, AttachmentCollection, AttachmentView){
    
    var AttachmentController = function(options){
        _.bindAll(this,'getAttachment','createAttachment');
        window.app.eventDispatcher.bind("attachment:create",this.createAttachment);
        window.app.eventDispatcher.bind("whiteboard:opened",this.getAttachment);
    };
    
    AttachmentController.prototype = {
        getAttachment:function(whiteboard){
            var attachments = new AttachmentCollection(null,{id:whiteboard.id});
            attachments.fetch({success:function(collection, response){collection.each(function(attachment){
                new AttachmentView({model:attachment,whiteboardid:notes.id});
            });}});
        },
        createAttachment:function(){
            alert('create attachment');
        }
    };
    
    return AttachmentController;
});