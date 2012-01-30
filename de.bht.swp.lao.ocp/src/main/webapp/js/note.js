// posts a new note
function _postNote(_x, _y) {
    cometd.publish('/service/note/post/', {
        // set x and y positions
        x : parseInt(_x),
        y : parseInt(_y),
        // set creator
        creator : $('.whiteboard').attr('data-user-mail'),
        // set whiteboard id
        whiteboardid : parseInt($('.whiteboard').attr('data-whiteboard-id'))
    });
}

// create a posted note
function _handlePostedNote(message) {
    var _creator  = message.data.creator,
        _x        = message.data.x,
        _y        = message.data.y;
    var basePath = $('.whiteboard').attr('data-context-path');
    var template =  '<div class="note draggable">'+
                        '<div class="noteItems">'+
                            '<textarea name="text"></textarea>'+
                            '<span class="creator"></span>'+
                        '</div>'+
                        '<div class="noteMenu">'+
                            '<a class="file_mouseOverMenu_top">'+
                                '<img src="'+basePath+'/images/file_mouseOverMenu_top.png">'+
                            '</a>'+
                            '<a class="file_mouseOverMenu_middle">'+
                                '<img src="'+basePath+'/images/file_mouseOverMenu_middle.png">'+
                            '</a>'+
                            '<a class="file_mouseOverMenu_bottom">'+
                                '<img src="'+basePath+'/images/file_mouseOverMenu_bottom.png">'+
                            '</a>'+
                        '</div>'+
                    '</div>';
    
    var view = $(template);
    view.attr('id','note-'+ message.data.id);
    view.css('left',_x+'px');
    view.css('top',_y+'px');
    
    var creator = $('.noteItems .creator',view);
    creator.html(_creator);
    
    var text = $('textarea[name="text"]',view)
               .attr('placeholder', 'your note text')
               .elasticArea().hover(
               function() {
                   $(this).parent().find('span.creator').css('display', 'block');
               },
               function() {
                   $(this).parent().find('span.creator').css('display', 'none');
               });
    
    view.draggable({
        handle:$('.file_mouseOverMenu_top',view),
        scroll: false,
        drag: function(e,ui){
			console.log(ui.helper.left+' '+ui.helper.top);
		},
        stop : function(e, ui) {
            var id = $(this).attr('id').split('-')[1];
            _moveWhiteboardItem(this,id);
        }
    });
    view.css("position","absolute");
    $('.whiteboard').append(view);
                   
    // resize all new textarea notes
    text.css('height', text[0].scrollHeight / 2 + 'px');
    text.css('height', text[0].scrollHeight + 'px');
    text.css('height', parseInt(text[0].css('height')) === 0 ? '17px': this.style.height);
}

// edit a note on whiteboard
function _editNote(_note, _id) {
    _text = $(_note).find('textarea[name=text]').val();
    cometd.publish('/service/note/edit/', {id:parseInt(_id),text:_text,
        whiteboardid : parseInt($('.whiteboard').attr('data-whiteboard-id'))}
    );
}

// updates a note
function _handleUpdatedNote(message) {
    if (activeNoteId == message.data.id) {
        return null;
    }
    note = $('#note-' + message.data.id);
    if (note.length == 0) {

    } else {
        note.find('textarea[name=text]').val(message.data.text);
        note.find('textarea[name=text]').elasticArea();
    }
}

// show progress state of uploaded whiteboarditem
function _reportProgressStateWhiteboardItem(_id, _inProgress) {
    cometd.publish('/service/whiteboardItem/progress', {
        id : parseInt(_id),
        inProgress : Boolean(_inProgress),
        whiteboardid : parseInt($('.whiteboard').attr('data-whiteboard-id'))
    });
}

// all actions
$(function() {
    // mark note as in progress
    $('.note input[type=text], .note textarea').live('focus', function() {
        var clickedNote = $(this).parent(),
            divId       = clickedNote.attr("id");

        if (divId != undefined) {
            id = divId.split('-')[1];
            _reportProgressStateWhiteboardItem(id, true);
            
            activeNoteId = id;
            saveInterval = window.setInterval( function() {
                _editNote(clickedNote, id);
            }, 500);
        }
    });

    // unmark note after typing
    $('.note input[type=text], .note textarea').live( 'blur', function() {
        var clickedNote = $(this).parent(),
            divId = clickedNote.attr("id");

        if (divId != undefined) {
            id = divId.split('-')[1];
            _reportProgressStateWhiteboardItem(id, false);
        }
        activeNoteId = null;
        window.clearInterval(saveInterval);
        _editNote(clickedNote, id);
    });

    // new note
    $('a.createNote').click( function() {
        posx = Math.floor(Math.random() * 700);
        posy = Math.floor(Math.random() * 400);
        _postNote(posx, posy);
    });
    
    $('.note').find('textarea').elasticArea();
    $('.note textarea').hover( function() {
        $(this).parent().find('span.creator').css('display', 'block');
    },function() {
        $(this).parent().find('span.creator').css('display', 'none');
    });
    
    $('.note').live("mouseover", function() {
         currentModus=MODUS.SELECT;
         $('.noteMenu',$(this)).css("display", "block");
    });
    $('.note').live("mouseleave", function() {
         currentModus=MODUS.HAND;
         $('.noteMenu',$(this)).css("display", "none");
    });
    
});