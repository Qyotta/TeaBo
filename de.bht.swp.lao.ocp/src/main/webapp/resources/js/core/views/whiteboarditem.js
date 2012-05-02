define([
    'jquery',
    'underscore',
    'backbone', 
    'jqueryui',
    'core/utils/model_command',
    'text!templates/whiteboard/whiteboard.html',
], function($, _, Backbone,jqueryui,ModelCommand, whiteboardTemplate){
    
    var WhiteboardView = Backbone.View.extend({
        events:{
            'click .file_mouseOverMenu_bottom' : 'deleteClicked',
            'click ' : 'orderChange'
        },
        initialize:function(whiteboard){
            _.bindAll(this, 'handleDragItem', 'persistPosition', 'orderChange', 'handleForegroundWhiteboardItem');
            
            window.app.eventDispatcher.bind("whiteboardItem:delete_multiple",this.deleteMulitple);
            
            $(this.el).draggable({
                scroll : false,
                drag : this.handleDragItem,
                stop : this.persistPosition
            });
        },
        handleDragItem: function(e) {
            // find all selected items
            var elem = $('div.whiteboard > div.selected');
            // do it only if more than two are selected and elem itself is selected
            if(elem.length > 1 && $(this.el).hasClass('selected')) {
                $.each(elem,function(i,element) {
                    // dont move current element - it moves by itself
                    if($(e.target).attr('id') != $(element).attr('id')) {
                        var posX = parseInt($(element).css('left')),
                            posY = parseInt($(element).css('top')),
                            targetX = parseInt($(e.target).css('left'),10)-7,
                            targetY = parseInt($(e.target).css('top'),10)+16;
                        // save start pos to get the offset
                        if(!$(element).data('oldPosX')) {
                            $(element).data('oldPosX',posX);
                            $(element).data('oldPosY',posY);
                            $(e.target).data('oldPosX',targetX);
                            $(e.target).data('oldPosY',targetY);
                        }
                        // change position
                        $(element).css('left',$(element).data('oldPosX') - ($(e.target).data('oldPosX')+$(e.target).width()-e.clientX));
                        $(element).css('top',$(element).data('oldPosY') - ($(e.target).data('oldPosY')-e.clientY));
                    }
                });
            }
            $(this.el).find('.noteMenu').css('display','block');
            $(this.el).find('.creator').css('display','block');
        },
        persistPosition: function(e,ui) {
            var self = this;
            
            // remove blocked menu and creator element
            $(this).find('.noteMenu').css('display', '');
            $(this).find('.creator').css('display', '');
            
            // remove unnecessary data attributes
            $.each($('div.whiteboard > div'), function(i,elem) {
                $(elem).data('oldPosX','').data('oldPosY','');
            });
            
            if($('div.whiteboard > div.selected').length > 1) {
                // get all views
                views = ((window.app.modules.note.views).concat(window.app.modules.attachment.views)).filter(function(){return true});
                // persist views
                var commands = [];
                $.each(views,function(j,view) {
                    if(view && $(view.el).hasClass('selected')) {
                        var _x = parseInt($(view.el).css('left'),10),
                            _y = parseInt($(view.el).css('top'),10);
                        commands.push(new ModelCommand(
                            '/service/whiteboardItem/move',
                            {
                                id : view.model.id,
                                x : _x,
                                y : _y,
                                whiteboardid : view.options.whiteboardId
                            }
                        ));
                    }
                });
                
                window.app.groupCommand.addCommands(commands);
            } else {
                window.app.groupCommand.addCommands(new ModelCommand(
                    '/service/whiteboardItem/move',
                    {
                        id: self.model.id,
                        x : parseInt($(self.el).css('left'),10),
                        y : parseInt($(self.el).css('top'),10),
                        whiteboardid : self.options.whiteboardId
                    }
                ));
            }
        },
        deleteClicked : function() {
            var elem = $('div.whiteboard > div.selected');
            // do it only if more than two are selected and elem itself is selected
            if(elem.length > 1 && $(this.el).hasClass('selected')) {
                window.app.log("multiple !!!");
                window.app.eventDispatcher.trigger("whiteboardItem:delete_multiple", this.model);
            }else {
                window.app.eventDispatcher.trigger(this.name+":delete_clicked", this.model);
            }
        },
        orderChange : function (evt) {
            window.app.eventDispatcher.trigger(this.name+":order_change", this.model);
        },
        handleForegroundWhiteboardItem : function(message){
            $(this.el).css('z-index', message.data.newIndex);
        },
        deleteMulitple : function(model) {
            var elem = $('div.whiteboard > div.selected');
            // do it only if more than two are selected and elem itself is selected
            if(elem.length > 1 && $(this.el).hasClass('selected')) {
                views = ((window.app.modules.note.views).concat(window.app.modules.attachment.views)).filter(function(){return true});
                // persist views
                var commands = [];
                $.each(views,function(j,view) {
                    if(view && $(view.el).hasClass('selected')) {
                        
                        commands.push(new ModelCommand(
                            '/service/whiteboardItem/delete',
                            {
                                id : view.model.id,
                                whiteboardid : view.options.whiteboardId
                            }
                        ));
                    }
                });
                
                window.app.groupCommand.addCommands(commands);
            }
        }
    });
    
    return WhiteboardView;
});