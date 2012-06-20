define([
    'jquery',
    'underscore',
    'backbone',
    'jquerycollision',
    '/whiteboard/js/utils/modus.js',
    '/core/js/utils/model_command.js',
    'text!/whiteboard/templates/whiteboard.html'
], function($, _, Backbone, collision,WhiteboardModus, ModelCommand, whiteboardTemplate){
    
    var WhiteboardView = Backbone.View.extend({
        events:{
            'mousedown' : 'mouseDown',
            'mousemove' : 'mouseMove',
            'mouseup'   : 'mouseUp'
        },
        initialize:function(){
            _.bindAll(this,'modusChanged','keydown','keyup','mouseDown','mouseUp','mouseMove','startMove','move','endMove','render','entersWhiteboardItem','leavesWhiteboardItem');

            this.model.bind('change', this.render, this);
            
            window.app.eventDispatcher.bind('whiteboardItem:left',this.leavesWhiteboardItem);
            window.app.eventDispatcher.bind('whiteboardItem:entered',this.entersWhiteboardItem);
            window.app.eventDispatcher.bind('whiteboard:changed_modus',this.modusChanged);
            window.app.eventDispatcher.bind("whiteboard:delete_multiple_items",this.deleteMultipleWhiteboardItems);
            
            $(document).keydown(this.keydown);
            $(document).keyup(this.keyup);
            this.modus = WhiteboardModus.SELECT;
            this.render();
        },
        mouseDown:function(event){
            if(this.modus==WhiteboardModus.SELECT){
                this.modusChanged(WhiteboardModus.SELECTING);
                this.startSelection(event);
            }else if(this.modus==WhiteboardModus.MULTISELECT){
                this.modusChanged(WhiteboardModus.MULTISELECTING);
                this.startSelection(event);
            }else if(this.modus==WhiteboardModus.HAND){
                this.startMove(event);
            }
        },
        mouseMove:function(event){
            if(this.modus==WhiteboardModus.SELECTING){
                this.dragEnterEvent(event);
            }else if(this.modus==WhiteboardModus.MULTISELECTING){
                this.dragEnterEvent(event);
            }else if(this.modus==WhiteboardModus.HAND){
                this.move(event);
            }
        },
        mouseUp:function(event){
            if(this.modus==WhiteboardModus.SELECTING){
                this.dragEndEvent();
                this.modusChanged(WhiteboardModus.SELECT);
            }else if(this.modus==WhiteboardModus.MULTISELECTING){
               this.dragEndEvent();
               this.modusChanged(WhiteboardModus.MULTISELECT);
            }else if(this.modus==WhiteboardModus.HAND){
                this.endMove();
            }else{return;}
            window.app.eventDispatcher.trigger("whiteboard:mouseup");
        },
        keydown:function(event){
            var _modus=null;
            if(event.which==18){ // 18 == ALT KEY
                event.preventDefault();
                _modus = WhiteboardModus.HAND;
            }else if(event.shiftKey){ // SHIFT KEY
                _modus = WhiteboardModus.MULTISELECT;
                if(this.modus==WhiteboardModus.MULTISELECTING){return;}
            }
            if(this.modus!=_modus)this.modusChanged(_modus);
        },
        keyup:function(event){

            var selectedItems = this.currentSelectedWhiteboardItems();

            // 18 == ALT KEY
            if(event.keyCode==18){
                event.preventDefault();
                this.modusChanged(WhiteboardModus.SELECT);
            }else if(event.shiftKey){
                event.preventDefault();
                this.modusChanged(WhiteboardModus.SELECT);
            }
            // [DEL] - only if some items are selected
            else if(event.keyCode==46 && selectedItems.length){
                event.preventDefault();
                window.app.eventDispatcher.trigger('whiteboardItem:delete_clicked', null);
            }
        },
        entersWhiteboardItem:function(){
            if(this.modus!=WhiteboardModus.SELECTING && this.modus!=WhiteboardModus.MULTISELECTING){
                this.modusChanged(WhiteboardModus.EDIT);
            }
        },
        leavesWhiteboardItem:function(event){
            if(this.modus==WhiteboardModus.EDIT){
                this.modusChanged(WhiteboardModus.SELECT);
            }
        },
        deleteMultipleWhiteboardItems:function(whiteboardId){
            var elem = $('div.whiteboard > div.selected');
            // do it only if more than two are selected and elem itself is selected
            if(elem.length > 1) {
                views = ((window.app.modules.note.views).concat(window.app.modules.attachment.views)).filter(function(){return true;});
                // persist views
                var commands = [];
                $.each(views,function(j,view) {
                    
                    if(view && $(view.el).hasClass('selected')) {
                        commands.push(new ModelCommand(
                            '/service/whiteboardItem/delete',
                            {
                                id : view.model.id,
                                whiteboardid : whiteboardId
                            }
                        ));
                    }
                });
                
                window.app.groupCommand.addCommands(commands);
            }
        },
        modusChanged:function(modus){
            this.modus = modus;
            if(this.modus == WhiteboardModus.HAND){
                $(this.el).css('cursor', 'pointer');
            }else if(this.modus == WhiteboardModus.SELECT){
                $(this.el).css('cursor', 'default');
            }
            window.app.eventDispatcher.trigger('whiteboard:changedModus',modus);
        },
        render:function(){
            this.delegateEvents();
            $(this.el).attr('id','whiteboard');
            $(this.el).addClass("whiteboard draggable");
            $(this.el).css('left', this.model.get('x') + 'px');
            $(this.el).css('top', this.model.get('y') + 'px');

            if ($("#whiteboard").length === 0) {
                $('#page').empty();
                this.delegateEvents();
                $("#page").html($(this.el));
            }
        },
        startMove:function(event){
            this.startX = parseInt(event.pageX,10);
            this.startY = parseInt(event.pageY,10);
        },
        move:function(e){
            if(!this.startX || !this.startY)return;
            
            var xMove = this.startX - parseInt(e.pageX,10);
            var yMove = this.startY - parseInt(e.pageY,10);
            
            var _x = this.model.get('x')-xMove;
            var _y = this.model.get('y')-yMove;
            
            this.model.set({x:_x,y:_y});

            this.startX = parseInt(e.pageX,10);
            this.startY = parseInt(e.pageY,10);
        },
        endMove:function(){
            var _x = this.model.get('x');
            var _y = this.model.get('y');
            
            if( _x > 0 || _y > 0) {
                var xJump = _x < 0 ? _x : 0;
                var yJump = _y < 0 ? _y : 0;
                var self = this;
                $(this.el).animate({top: yJump+'px', left: xJump+'px'},200,function(){self.model.set({x:xJump,y:yJump});});
            }
            this.startX = null;
            this.startY = null;
        },
        startSelection: function(e) {
            e.preventDefault();
            
            this.selection = this.currentSelectedWhiteboardItems();
            
            // deselect previously selected notes if not multiselecting
            if(this.modus!=WhiteboardModus.MULTISELECTING){
                this.selection.removeClass('selected');
                this.selection = null;
            }
            
            if(this.isSelectionBox) return;
            
            $(this.el).find('.whiteboarditem.hoverable').removeClass('hoverable');
            
            this.isSelectionBox = true;
            this.startDragX = e.clientX+(-this.model.get('x'));
            this.startDragY = e.clientY+(-this.model.get('y'));
            this.selectionBox = $('<div />').attr('id','selectionBox').css('top',this.startDragY).css('left',this.startDragX);
            
            $(this.el).append(this.selectionBox);
        },
        dragEnterEvent: function(e) {
            if(!this.isSelectionBox || this.selectionBox === undefined) return;
            var x = e.clientX+(-this.model.get('x'));
            var y = e.clientY+(-this.model.get('y'));
            
            if(x - this.startDragX < 0) {
                // drag from right to left
                this.selectionBox.css('left',x);
                this.selectionBox.css('width',this.startDragX - x);
            } else {
                // drag from left to right
                this.selectionBox.css('width',x - this.startDragX);
            }
            if(y - this.startDragY < 0) {
                // drag from bottom to top
                this.selectionBox.css('top',y);
                this.selectionBox.css('height',this.startDragY - y);
            } else {
                // drag from top to bottom
                this.selectionBox.css('height',y - this.startDragY);
            }
            
            var selectedWhiteboardItems = this.selectionBox.collision('.whiteboarditem');
            
            this.currentSelectedWhiteboardItems().not(this.selection).removeClass('selected');
            
            selectedWhiteboardItems.addClass('selected');
            
        },
        dragEndEvent: function() {
            if(!this.isSelectionBox || this.selectionBox === undefined) return;
            
            this.selectionBox.remove();
            this.isSelectionBox = false;
            
            $(this.el).find('.whiteboarditem').addClass('hoverable');
        },
        currentSelectedWhiteboardItems:function(){
            return $(this.el).find('.whiteboarditem.selected');
        }
    });
    
    return WhiteboardView;
});