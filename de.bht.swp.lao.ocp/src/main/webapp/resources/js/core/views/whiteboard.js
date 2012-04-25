define([
    'jquery',
    'underscore',
    'backbone',
    'jquerycollision',
    'text!templates/whiteboard/whiteboard.html',
], function($, _, Backbone, collision, whiteboardTemplate){
    
    var WhiteboardView = Backbone.View.extend({
        el: $("#page"),
        events:{
            'mousedown #whiteboard' : 'startSelection',
            'mousemove #whiteboard' : 'dragEnterEvent',
            'mouseup #whiteboard'   : 'dragEndEvent',
            'mousedown .noteMenu'   : 'preventSelection',
            'mouseup .noteMenu'     : 'preventSelection',
            'mousedown .attachmentMenu'   : 'preventSelection',
            'mouseup .attachmentMenu'     : 'preventSelection'
        },
        initialize:function(){
            this.render();
        },
        render:function(){
            var data = { _: _ };
            var compiledTemplate = _.template( whiteboardTemplate, data );
            this.el.html(compiledTemplate);
        },
        startSelection: function(e) {
            e.preventDefault();
            
            if(e.target.parentElement.tagName != 'A') {
                this.el.find('.whiteboarditem').removeClass('selected');
            }
            if(e.target.tagName != 'DIV') {
                return false;
            }

            if(this.isSelectionBox || this.isMovingNote) return;
            
            this.el.find('.whiteboarditem.hoverable').removeClass('hoverable');
            
            this.isSelectionBox = true;
            this.startDragX = e.clientX;
            this.startDragY = e.clientY;
            
            this.selectionBox = $('<div />').
                                    attr('id','selectionBox').
                                    css('top',this.startDragY).
                                    css('left',this.startDragX),
                   whiteboard = $('#whiteboard');
            
            
            whiteboard.append(this.selectionBox);
        },
        dragEnterEvent: function(e) {
            if(!this.isSelectionBox || this.selectionBox === undefined || this.isMovingNote) return;
            
            if(e.clientX - this.startDragX < 0) {
                // drag from right to left
                this.selectionBox.css('left',e.clientX);
                this.selectionBox.css('width',this.startDragX - e.clientX);
            } else {
                // drag from left to right
                this.selectionBox.css('width',e.clientX - this.startDragX);
            }
            if(e.clientY - this.startDragY < 0) {
                // drag from bottom to top
                this.selectionBox.css('top',e.clientY);
                this.selectionBox.css('height',this.startDragY - e.clientY);
            } else {
                // drag from top to bottom
                this.selectionBox.css('height',e.clientY - this.startDragY);
            }
            
            var selectedWhiteboardItems = this.selectionBox.collision('.whiteboarditem');
            selectedWhiteboardItems.addClass('selected');
            this.el.find('#whiteboard > .whiteboarditem').not(selectedWhiteboardItems).removeClass('selected');
        },
        dragEndEvent: function() {
            if(!this.isSelectionBox || this.selectionBox === undefined) return;
            
            this.selectionBox.remove();
            this.isSelectionBox = false;
            
            this.el.find('.whiteboarditem').addClass('hoverable');
        },
        preventSelection: function() {
            this.isMovingNote = !this.isMovingNote;
        }
    });
    
    return WhiteboardView;
});