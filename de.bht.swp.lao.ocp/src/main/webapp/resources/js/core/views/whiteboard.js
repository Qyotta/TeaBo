define([
    'jquery',
    'underscore',
    'backbone',
    'jquerycollision',
    'core/modus',
    'text!templates/whiteboard/whiteboard.html',
], function($, _, Backbone, collision,WhiteboardModus, whiteboardTemplate){
    
    var WhiteboardView = Backbone.View.extend({
        events:{
            'mouseenter .whiteboarditem': 'entersWhiteboardItem',
            'mouseleave .whiteboarditem': 'leavesWhiteboardItem',
            'mousedown' : 'mouseDown',
            'mousemove' : 'mouseMove',
            'mouseup'   : 'mouseUp',
        },
        initialize:function(){
            _.bindAll(this,'modusChanged','keydown','keyup','mouseDown','mouseUp','mouseMove','startMove','move','endMove','render');

            this.model.bind('change', this.render, this);
            
            window.app.eventDispatcher.bind('whiteboard:changed_modus',this.modusChanged);
            $(document).keydown(this.keydown);
            $(document).keyup(this.keyup);
            this.modus = WhiteboardModus.SELECT;
            this.render();
        },
        mouseDown:function(event){
            if(this.modus==WhiteboardModus.SELECT){
                this.modusChanged(WhiteboardModus.SELECTING);
                this.startSelection(event);
            }else if(this.modus==WhiteboardModus.HAND){
                window.app.log("start moving whiteboard");
                this.startMove(event);
            }else if(this.modus==WhiteboardModus.EDIT){
                window.app.log("editing");
            }
        },
        mouseMove:function(event){
            if(this.modus==WhiteboardModus.SELECTING){
                this.dragEnterEvent(event);
            }else if(this.modus==WhiteboardModus.HAND){
                this.move(event);
            }
        },
        mouseUp:function(event){
            if(this.modus==WhiteboardModus.SELECTING){
                this.dragEndEvent();
                this.modusChanged(WhiteboardModus.SELECT);
            }else if(this.modus==WhiteboardModus.HAND){
                this.endMove();
            }
        },
        keydown:function(event){
            // 18 == ALT
            if(event.which==18){
                event.preventDefault();
                if(this.modus!=WhiteboardModus.HAND)window.app.eventDispatcher.trigger('whiteboard:changed_modus',WhiteboardModus.HAND);
            }
        },
        keyup:function(event){
            // 18 == ALT
            if(event.keyCode==18){
                event.preventDefault();
                window.app.eventDispatcher.trigger('whiteboard:changed_modus',WhiteboardModus.SELECT);
            }
        },
        entersWhiteboardItem:function(){
            if(this.modus!=WhiteboardModus.SELECTING){
                this.modusChanged(WhiteboardModus.EDIT);
            }
        },
        leavesWhiteboardItem:function(event){
            $(event.currentTarget.id+"input[type=text], textarea").trigger('blur');//workaround to triger blur
            if(this.modus==WhiteboardModus.EDIT){
                this.modusChanged(WhiteboardModus.SELECT);
            }
        },
        modusChanged:function(modus){
            this.modus = modus;
            if(this.modus == WhiteboardModus.HAND){
                $(this.el).css('cursor', 'pointer');
            }else if(this.modus == WhiteboardModus.SELECT){
                $(this.el).css('cursor', 'default');
            }
            window.app.log(modus);
        },
        render:function(){
            $(this.el).attr('id','whiteboard');
            $(this.el).addClass("whiteboard draggable");
            $(this.el).css('left', this.model.get('x') + 'px');
            $(this.el).css('top', this.model.get('y') + 'px');
 
            if ($("#whiteboard").length >= 0) {
                $("#page").append($(this.el));
            }
        },
        startMove:function(event){
            this.startX = parseInt(event.pageX);
            this.startY = parseInt(event.pageY);
        },
        move:function(e){
            if(!this.startX || !this.startY)return;
            
            var xMove = this.startX - parseInt(e.pageX);
            var yMove = this.startY - parseInt(e.pageY);
            
            var _x = this.model.get('x')-xMove;
            var _y = this.model.get('y')-yMove;
            
            this.model.set({x:_x,y:_y});

            this.startX = parseInt(e.pageX);
            this.startY = parseInt(e.pageY);
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
            
            if(this.modus!=WhiteboardModus.SELECTING){return;}
            
            if(e.target.parentElement.tagName != 'A') {
                $(this.el).find('.whiteboarditem').removeClass('selected');
            }
            if(e.target.tagName != 'DIV') {
                return false;
            }
            
            $(this.el).find('.whiteboarditem').removeClass('selected');
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
            selectedWhiteboardItems.addClass('selected');
            $(this.el).find('.whiteboarditem').not(selectedWhiteboardItems).removeClass('selected');
        },
        dragEndEvent: function() {
            if(!this.isSelectionBox || this.selectionBox === undefined) return;
            
            this.selectionBox.remove();
            this.isSelectionBox = false;
            
            $(this.el).find('.whiteboarditem').addClass('hoverable');
        }
    });
    
    return WhiteboardView;
});