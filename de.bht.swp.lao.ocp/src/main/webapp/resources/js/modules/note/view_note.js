define([
    'jquery',
    'underscore',
    'backbone',
    'jqueryui',
    'text!templates/note/note.html',
], function($, _, Backbone,jqueryui,noteTemplate){
    
    var NoteView = Backbone.View.extend({
        events:{
            //'click .mainPanel input[type=submit]' : 'submitClicked',
            'focus input[type=text], .note textarea' : 'isFocused',
            'blur input[type=text], .note textarea' : 'isBlured',
            'click .file_mouseOverMenu_bottom' : 'deleteClicked'
        },
        initialize:function(){
            _.bindAll(this,'isFocused','isBlured','deleteClicked');
            this.model.bind('change',this.changed,this);
            var self = this;
            $(this.el).draggable({
                handle:$('.file_mouseOverMenu_top',this),
                scroll: false,
                //drag: _handleDragItem,
                stop : function(e, ui) {
                    var id = $(this).attr('id');
                    $(this).find('.noteMenu').css('display','');
                    $(this).find('.creator').css('display','');
                    _x = parseInt($(this).css('left'));
                    _y = parseInt($(this).css('top'));
                    self.model.set({x:_x,y:_y});
                    window.app.publish(
                        '/service/whiteboardItem/move',
                        {id:self.model.id,x:_x,y:_y,whiteboardid:self.model.get("whiteboardId")});
                }
            });
            $(this.el).attr("id",this.model.id);
            $(this.el).addClass("note draggable");
            this.render();
        },
        isFocused:function(){
            window.app.log("focused "+this.model.id);
            this.timer = setInterval(function() {
                window.app.log('fired');
            }, 500);
        },
        isBlured:function(){
            window.app.log("blured "+this.model.id);
            if(this.timer){
                clearInterval(this.timer);
            }
        },
        changed:function(){
            this.render();
        },
        render:function(){
            var data = { note:this.model, _: _ };
            var compiledTemplate = _.template( noteTemplate, data );
            $(this.el).css('left',this.model.get('x')+'px');
            $(this.el).css('top',this.model.get('y')+'px');
            $(this.el).css('position','absolute');
            
            if ( $("#"+this.model.id).length > 0 ) {
                $(this.el).html(compiledTemplate);
            }else{
                $("#whiteboard").append($(this.el).html(compiledTemplate));
            }
        },
        deleteClicked:function(){
            window.app.eventDispatcher.trigger("note:delete",this.model.id);
        }
    });
    
    return NoteView;
});