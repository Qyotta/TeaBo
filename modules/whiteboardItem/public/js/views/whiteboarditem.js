define([
    'jquery',
    'underscore',
    'backbone', 
    'jqueryui',
    '/core/js/utils/model_command.js',
    'text!/whiteboard/templates/whiteboard.html',
], function($, _, Backbone,jqueryui,ModelCommand, whiteboardTemplate){
    
    var WhiteboardView = Backbone.View.extend({
        events:{
            'click .file_mouseOverMenu_bottom' : 'deleteClicked',
            'click ' : 'clicked',
            'mouseenter' : 'entersWhiteboardItem',
            'mouseleave' : 'leavesWhiteboardItem'
        },
        initialize:function(whiteboard){
            _.bindAll(this, 'handleDragItem', 'persistPosition', 'handleForegroundWhiteboardItem', 'deleteClicked','changedPosition','clicked');
            this.model.bind('change:x',this.changedPosition,this);
            this.model.bind('change:y',this.changedPosition,this);

            window.app.eventDispatcher.bind("whiteboardItem:delete_clicked", this.deleteClicked);
            
            $(this.el).draggable({
                scroll : false,
                drag : this.handleDragItem,
                stop : this.persistPosition
            });
        },
        clicked:function(){
            this.startEditing();
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
            }
        },
        deleteClicked : function() {
            var self = this;
            var elem = $('div.whiteboard > div.selected');
            // do it only if more than two are selected and elem itself is selected
            if(elem.length > 1) {
                window.app.eventDispatcher.trigger("whiteboardItem:delete_multiple", self.controller.whiteboard.id);
            }else {
                console.log(this.name);
                window.app.eventDispatcher.trigger(this.name+":delete_clicked", this.model);
            }
        },
        orderChange : function () {
            window.app.eventDispatcher.trigger(this.name+":order_change", this.model);
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