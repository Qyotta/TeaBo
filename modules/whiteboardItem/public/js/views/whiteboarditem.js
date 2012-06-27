define([
    'jquery',
    'underscore',
    'backbone',
    'jqueryui',
    '/core/js/utils/model_command.js',
    'text!/whiteboard/templates/whiteboard.html'
], function($, _, Backbone,jqueryui,ModelCommand, whiteboardTemplate){
    
    var WhiteboardView = Backbone.View.extend({
        events:{
            'click .file_mouseOverMenu_bottom' : 'deleteClicked',
            'click ' : 'startEditing',
            'mousedown' : 'orderChange',
            'mouseenter' : 'entersWhiteboardItem',
            'mouseleave' : 'leavesWhiteboardItem'
        },
        initialize:function(whiteboard){
            _.bindAll(this, 'handleDragItem', 'persistPosition', 'handleForegroundWhiteboardItem', 'deleteClicked','changedPosition');
            this.model.bind('change:x',this.changedPosition,this);
            this.model.bind('change:y',this.changedPosition,this);
            this.model.bind('change:orderIndex', this.changedOrderIndex, this);

            $(this.el).addClass("whiteboarditem draggable hoverable");
            $(this.el).css('position', 'absolute');
            

            window.app.eventDispatcher.bind("whiteboardItem:delete_clicked", this.deleteClicked);
            
            $(this.el).draggable({
                scroll : false,
                drag : this.handleDragItem,
                stop : this.persistPosition
            });
        },
        startEditing:function(){
            window.app.eventDispatcher.trigger('whiteboardItem:startedEditing',this);
            $(this.el).addClass('edited');
            this.orderChange();
        },
        stopEditing:function(){
            window.app.eventDispatcher.trigger('whiteboardItem:stoppedEditing',this);
            $(this.el).removeClass('edited');
            $("input[type=text], textarea",$(this.el)).trigger('blur');//workaround to trigger blur
        },
        changedPosition:function(){
            if(!this.editing){
                this.render();
            }
        },
        handleDragItem: function(e) {
            // find all selected items
            var elem = $('div.whiteboard > div.selected');
            // do it only if more than two are selected and elem itself is selected
            if(elem.length > 1 && $(this.el).hasClass('selected')) {
                $.each(elem,function(i,element) {
                    // dont move current element - it moves by itself
                    if($(e.target).attr('id') != $(element).attr('id')) {
                        var posX    = parseInt($(element).css('left'),10),
                            posY    = parseInt($(element).css('top'),10),
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
                views = window.app.modules.note.views;  // TODO not modular
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
                                whiteboardid : self.controller.whiteboard.id
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
                        whiteboardid : self.controller.whiteboard.id
                    }
                ));
            }
        },
        deleteClicked : function(e) {
            var self = this;
            var elem = $('div.whiteboard > div.selected');

            if(e !== undefined && elem.length) {
                elem.removeClass('selected');
                elem = [];
            }

            // return false if function call is from [DEL] and item is note selected
            if(e === undefined && !$(this.el).hasClass('selected')) {
                return false;
            }

            // do it only if more than two are selected and elem itself is selected
            if(elem.length > 1) {
                window.app.eventDispatcher.trigger("whiteboardItem:delete_multiple", self.controller.whiteboard.id);
            }else {
                window.app.eventDispatcher.trigger(this.name+":delete_clicked", this.model);
            }
        },
        changedOrderIndex : function(){
            $(this.el).css('z-index', this.model.get('orderIndex'));
        },
        orderChange : function () {
            window.app.eventDispatcher.trigger("whiteboardItem:order_change", this.model);
        },
        handleForegroundWhiteboardItem : function(message){
            $(this.el).css('z-index', message.data.newIndex);
        },
        entersWhiteboardItem:function(){
            window.app.eventDispatcher.trigger("whiteboardItem:entered");
        },
        leavesWhiteboardItem:function(){
            window.app.eventDispatcher.trigger("whiteboardItem:left");
        }
    });
    
    return WhiteboardView;
});