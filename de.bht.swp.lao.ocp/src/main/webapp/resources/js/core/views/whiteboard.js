define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/whiteboard/whiteboard.html',
], function($, _, Backbone, whiteboardTemplate){
    
    var WhiteboardView = Backbone.View.extend({
        el: $("#page"),
        events:{
            'mousedown #whiteboard' : 'startSelection',
            'mousemove #whiteboard' : 'dragEnterEvent',
            'mouseup #whiteboard'   : 'dragEndEvent'
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
            if(this.isSelectionBox) return;
            
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
            if(!this.isSelectionBox) return;
            
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
        },
        dragEndEvent: function() {
            if(!this.isSelectionBox) return;
            
            this.selectionBox.remove();
            this.isSelectionBox = false;
        }
    });
    
    return WhiteboardView;
});