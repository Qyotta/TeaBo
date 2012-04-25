define([
    'jquery',
    'underscore',
    'backbone',
    'core/views/sidebar'
], function($, _, Backbone, SidebarView){
    
    var SidebarController = function(options){
        _.bindAll(this,'showSidebar','removeSidebar','fillAttachmentDataSidebar');
        window.app.eventDispatcher.bind("whiteboard:open",this.showSidebar);
        window.app.eventDispatcher.bind("whiteboard:close",this.removeSidebar);
        window.app.eventDispatcher.bind("attachment:isClicked", this.fillAttachmentDataSidebar);
        this.initialize();
    };
    
    SidebarController.prototype = {
        initialize: function() {
            window.app.log('sidebar loaded');
        },
        showSidebar : function() {
            this.view = new SidebarView();
        },
        removeSidebar : function() {
            if(this.view){
                this.view.unrender();
            }
        },
        fillAttachmentDataSidebar : function(model){
            var rightNavigation = this.view.el.find('.wrapper');
            
            rightNavigation.empty();
            
            var full_name = $('<h2/>').attr('class','full_filename').html(model.get('filename')),
            creator = $('<div/>').attr('class','creator').html('uploded by '+model.get('creator')),
            description = $('<textarea/>').attr('class','description').attr('readonly','readonly').html(model.get('description')),
            download = $('<a/>').attr('href',config.contextPath+"/attachment/"+model.id+"/"+model.get('filename')+"/download.htm").html('[DownloadButton]'),
            fileinfo = $('<div/>')
                .attr('class','fileinfo')
                .append(full_name)
                .append(creator)
                .append($('<br/>'))
                .append(download)
                .append($('<br/>'))
                .append($('<br/>'))
                .append($('<div/>').html('Description:'))
                .append(description);
            
            rightNavigation.append(fileinfo);
            $(".rightNavigation").stop(true, false).animate({
                right: "0px"
            }, 200);
        }
    };
    
    return SidebarController;
});