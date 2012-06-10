define([
    'jquery',
    'underscore',
    'backbone',
    '/sidebar/js/views/sidebar.js'
], function($, _, Backbone, SidebarView){
    
    var SidebarController = function(options){
        _.bindAll(this,'showSidebar','removeSidebar','fillAttachmentDataSidebar', 'fillImageDataSidebar');
        window.app.eventDispatcher.bind("whiteboard:opened",this.showSidebar);
        window.app.eventDispatcher.bind("whiteboard:close",this.removeSidebar);
        window.app.eventDispatcher.bind("attachment:isClicked", this.fillAttachmentDataSidebar);
        window.app.eventDispatcher.bind("image:isClicked", this.fillImageDataSidebar);
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
                download = $('<a/>').attr('href','/attachment/'+model.id+'/'+model.get('filename')+'/download.htm').html('Download'),
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
        },
        fillImageDataSidebar : function(model){
            var rightNavigation = this.view.el.find('.wrapper');
            
            rightNavigation.empty();
            
            var label = $('<h2/>').text('Resize the Image:');
            var statusText = $('<div/>').attr('id', 'statusText').text("Resize: "+(model.get('content').get("scale")*100).toFixed(0)+"%");
            var slider = $('<div/>').attr('id', 'slider').css('width', '150px').css('margin', '30px 10px');
            rightNavigation.append(label).append(statusText).append(slider);
            $(".rightNavigation").stop(true, false).animate({
                right: "0px"
            }, 200);
            
            $("#slider").slider({
                min: 1, 
                max: 200,
                value:model.get('content').get("scale")*100,
                slide: function(event, ui) { 
                    $('#statusText').text("Resize: " + ui.value + "%");
                    }, //for preview
                change: function(event, ui) { 
                    model.get('content').set({scale: ui.value/100});
                    window.app.eventDispatcher.trigger('image:resized',model); 
                    } // for save
                });
        }
    };
    
    return SidebarController;
});