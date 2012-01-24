// store the new position of a whiteboardItem
function _moveWhiteboardItem(_whiteboardItem, _id) {
    _x = $(_whiteboardItem).css('left').substr(0,$(_whiteboardItem).css('left').length - 2);
    _y = $(_whiteboardItem).css('top').substr(0,$(_whiteboardItem).css('top').length - 2);

    cometd.publish('/service/whiteboardItem/move', {id:parseInt(_id),x:parseInt(_x),y:parseInt(_y),
        whiteboardid : parseInt($('.whiteboard').attr('data-whiteboard-id'))}
    );
}

//updates a moved whiteboarditem
function _handleMovedWhiteboardItem(message){
    _id = message.data.id;
    _x = message.data.x;
    _y = message.data.y;

    if (activeNoteId == _id) {
        return null;
    }

    whiteboardItem = null;
    note = $('#note-' + _id);

    if (note.length != 0) {
        whiteboardItem  = note;
    }
    else{
        attachment = $('#attachment-' + _id);
        if(attachment.length != 0){
            whiteboardItem = attachment;
        }
    }

    if(whiteboardItem==null){
        return null;
    }else{
        whiteboardItem.css('left', _x).css('top', _y);
    }
}


function _reportElementOrder(_id){
	console.log('reportedNewOrder');
	cometd.publish('/service/whiteboardItem/order', {
        id : parseInt(_id),
        whiteboardid : parseInt($('.whiteboard').attr('data-whiteboard-id'))
    });
}

//handles cometd notification about changed order at z-axis
function _handleForegroundWhiteboardItem(message){
	alert(message);
}


// all actions
$(function() {
    // upload dialog initialization
    $('#upload-dialog').dialog({
        autoOpen : false,
        closeOnEscape: false,
        open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); },
        modal : true,
        width : 420,
        draggable: false
    });

    // open upload dialog
    $('a.uploadFile').live('click', function(e) {
        e.preventDefault();
        $('#upload-dialog > form > ul > li').not(":first-child").remove();
        $('#upload-dialog > form > ul > li:first-child > input[type="file"]').val("");
        $('#upload-dialog').dialog('open');
        $('#upload-dialog').css('min-height', '142px');
        $('#upload-dialog').css('height', 'auto');
    });

    // close upload dialog
    $('#fileupload button.cancel').click(function(){
        $('#fileupload input[type=file], #fileupload textarea').val("");
        $('#upload-dialog').dialog('close');
    });

    // invite dialog
    $('#invite-dialog').dialog({
        autoOpen : false,
        closeOnEscape: false,
        open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); },
        modal : true,
        width : 420,
        draggable: false
    });

    $('a[href="invite"]').live('click', function(e) {
        $('#invite-dialog').dialog('open');
        $('#invite-dialog').css('min-height', '142px');
        $('#invite-dialog').css('height', 'auto');
        return false;
    });

    $('#invite-dialog button.cancel').click(function(){
        $('#invite-dialog input[type=text]').val("");
        $('#invite-dialog').dialog('close');
    });

    

    $('.bottomNavigation ul li div').hover(function() {
        $(this).find('a').css('bottom','30px');
        $(this).find('span').css('display','block');
    }, function() {
        $(this).find('a').css('bottom','15px');
        $(this).find('span').css('display','none');
    });
    
    $('.whiteboard .draggable').live('click', function(e){
    	var clickedElement = $(this).parent();
    	var divId = clickedElement.attr("id");

        if (divId != undefined) {
            id = divId.split('-')[1];
            _reportElementOrder(id);
        }
    });

    $(".whiteboard .draggable").draggable({
        stop : function(e, ui) {
            var id = $(this).attr('id').split('-')[1];
            _moveWhiteboardItem(this, id);
        }
    });
});