var startX,startY;

//handles

function _handleProgressedWhiteboardItem(message) {
    _id = message.data.id;

    whiteboardItem = null;
    note = $('#note-' + _id);

    if (note.length != 0) {
        whiteboardItem = note;
    } else {
        attachment = $('#attachment-' + _id);
        if (attachment.length != 0) {
            whiteboardItem = attachment;
        }
    }

    if (whiteboardItem == null) {
        return null;
    } else {
        locked = $(whiteboardItem).find('.locked');
        if (locked.length == 0) {
            locked = $('<img/>').attr('class', 'locked').attr('src',
                    '../images/locked.png');
            whiteboardItem.append(locked);
        }
        if (message.data.inProgress == false) {
            locked.css('display', 'none');
        } else {
            locked.css('display', 'block');
        }
    }
}

// updates a moved whiteboarditem
function _handleMovedWhiteboardItem(message) {
    _id = message.data.id;
    _x = message.data.x;
    _y = message.data.y;

    if (activeNoteId == _id) {
        return null;
    }

    whiteboardItem = null;
    note = $('#note-' + _id);

    if (note.length != 0) {
        whiteboardItem = note;
    } else {
        attachment = $('#attachment-' + _id);
        if (attachment.length != 0) {
            whiteboardItem = attachment;
        }
    }

    if (whiteboardItem == null) {
        return null;
    } else {
        whiteboardItem.css('left', _x).css('top', _y);
    }
}

// handles cometd notification about changed order at z-axis
function _handleForegroundWhiteboardItem(message) {
    $('#'+message.data.id).css('z-index', message.data.newIndex);
}

// store the new position of a whiteboardItem
function _moveWhiteboardItem(_whiteboardItem, _id) {
    _x = $(_whiteboardItem).css('left').substr(0,
            $(_whiteboardItem).css('left').length - 2);
    _y = $(_whiteboardItem).css('top').substr(0,
            $(_whiteboardItem).css('top').length - 2);

    cometd.publish('/service/whiteboardItem/move', {
        id : parseInt(_id),
        x : parseInt(_x),
        y : parseInt(_y),
        whiteboardid : parseInt($('.whiteboard').attr('data-whiteboard-id'))
    });
}

function _reportElementOrder(_id) {
    cometd.publish('/service/whiteboardItem/order', {
        id : parseInt(_id),
        whiteboardid : parseInt($('.whiteboard').attr('data-whiteboard-id'))
    });
    console.log('reportedNewOrder');
}

function containerFadeIn(elem) {
    $('.dialogs div[id]').fadeOut(500,function() {
        if($(this).attr('id')==$(elem).attr('id')) $(elem).fadeIn();
    });
    $('.whiteboard').draggable('disable').css('cursor', 'default!important');
    $('.whiteboard .note, .whiteboard .attachment').draggable('disable').addClass('blurBox');
    $('.whiteboard .noteItems textarea').addClass('blurTextarea').attr('readonly', 'readonly').css('cursor', 'default');
    $('.whiteboard .noteItems textarea, .whiteboard .creator').addClass('blurText');
    $('body').css('background', 'url("../images/whiteboard-background-blured.gif")');
}
function containerFadeOut(elem) {
    $(elem).fadeOut();
    $('.whiteboard').draggable('enable').css('cursor', 'inherit');
    $('.whiteboard .note, .whiteboard .attachment').draggable('enable').removeClass('blurBox');
    $('.whiteboard .noteItems textarea').removeClass('blurTextarea').removeAttr('readonly').css('cursor', 'inherit');
    $('.whiteboard .noteItems textarea, .whiteboard .creator').removeClass('blurText');
    $('body').css('background', 'url("../images/whiteboard-background.gif")');
}

function handleDragWhiteboard(e){
    var whiteboard = $('#whiteboard');
    var xOld = whiteboard.css('left').substr(0,whiteboard.css('left').length - 2);
    var yOld = whiteboard.css('top').substr(0,whiteboard.css('top').length - 2);
    
    var xMove = startX - parseInt(e.pageX);
    var yMove = startY - parseInt(e.pageY);
    
    whiteboard.css('left',(parseInt(xOld)-xMove)+'px');
    whiteboard.css('top',(parseInt(yOld)-yMove)+'px');
    
    startX = parseInt(e.pageX);
    startY = parseInt(e.pageY);
}

// all actions
$(function() {
    // open upload dialog
    $('a.uploadFile').live('click', function(e) {
        containerFadeIn('#uploadContainer');
        return false;
    });

    // close upload dialog
    $('#fileupload button.cancel').click(function() {
        containerFadeOut('#uploadContainer');
    });

    $('a[href="invite"]').live('click', function(e) {
        containerFadeIn('#inviteContainer');
        return false;
    });

    $('#inviteContainer button.cancel').click(function() {
        containerFadeOut('#inviteContainer');
    });

    $('#logoutContainer button.cancel').click(function() {
        containerFadeOut('#logoutContainer');
    });

    $('.bottomNavigation ul li div').hover(function() {
        $(this).find('a').css('bottom', '30px');
        $(this).find('span').css('display', 'block');
    }, function() {
        $(this).find('a').css('bottom', '15px');
        $(this).find('span').css('display', 'none');
    });

    $('.whiteboard .draggable').live('click', function(e) {
        var divId = $(this).attr("id");
        if (divId != undefined) {
            var id = divId.split('-')[1];
            _reportElementOrder(id);
        }
    });

    $(".whiteboard .draggable").draggable({
        handle : $('.file_mouseOverMenu_top', $(this)),
        scroll: false,
        
        stop : function(e, ui) {
            var id = $(this).attr('id').split('-')[1];
            _moveWhiteboardItem(this, id);
        }
    });
    
    $('body').mousedown(function(e){
        console.log(currentModus);
        if(currentModus==MODUS.HAND){
            $(this).css('cursor', 'pointer');
            startX = parseInt(e.pageX);
            startY = parseInt(e.pageY);
            $('body').mousemove(handleDragWhiteboard);
        }
    });
       
    $('body').mouseup(function(){
        $('body').unbind('mousemove',handleDragWhiteboard);
        $(this).css('cursor', 'auto');
    });
});
          // We love tabs                
        	            	             
     			    		             
    							         
    							         
        					             
            			                 
                	                     
                                         
