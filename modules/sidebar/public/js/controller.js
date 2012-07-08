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
    };
    
    SidebarController.prototype = {
        showSidebar : function() {
            this.view = new SidebarView();
        },
        removeSidebar : function() {
            if(this.view){
                this.view.unrender();
            }
        },
        fillAttachmentDataSidebar : function(model){
            var _creator = window.app.modules.assignment.getUser(model.get('creator'));
            if(!_creator)return false;
            var rightNavigation = this.view.$el.find('.wrapper');
            
            rightNavigation.empty();
            var _username;
            if(_creator.get('firstname').length > 0 || _creator.get('lastname').length > 0){
              _username = _creator.get('firstname')+' '+_creator.get('lastname');  
            } else _username = _creator.get('email');
            
            var full_name = $('<h2/>').attr('class','full_filename').html(model.get('content').get('filename')),
                creator = $('<div/>').attr('class','creator').html('uploaded by '+_username),
                description = $('<textarea/>').attr('class','description').attr('readonly','readonly').html(model.get('content').get('shortDescription')),
                download = $('<a/>').attr('href','/attachment/'+model.id).html('Download'),
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
            var rightNavigation = this.view.$el.find('.wrapper');
            
            rightNavigation.empty();
            
            var label = $('<h2/>').text('Resize the Image:');
            var statusText = $('<div/>').attr('id', 'statusText').text("Resize: "+(model.get('content').get("scale")*100).toFixed(0)+"%");
            var slider = $('<div/>').attr('id', 'slider').css('width', '150px').css('margin', '30px 10px');
            rightNavigation.append(label).append(statusText).append(slider);
            $(".rightNavigation").stop(true, false).animate({
                right: "0px"
            }, 200);
           
            var value = model.get('content').get("scale")*100;
            if(isNaN(model.get('content').get("scale"))) console.log('NaN: '+model.get('content').get("scale"));
            $("#slider").slider({
                min: 1, 
                max: 200,
                value:model.get('content').get("scale")*100,
                slide: function(event, ui) { 
                    $('#statusText').text("Resize: " + ui.value + "%");
                    }, //for preview
                change: function(event, ui) { 
                    window.app.eventDispatcher.trigger('image:resized',{id : model.id, scale : ui.value/100}); 
                    } // for save
                });
        }
    };
    
    return SidebarController;
});