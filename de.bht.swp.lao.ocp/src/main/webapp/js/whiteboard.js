$(document).ready(function() {
    
    // store the new position of a whiteboardItem
    function _moveWhiteboardItem(_whiteboardItem, _id) {
        _x = $(_whiteboardItem).css('left').substr(0,$(_whiteboardItem).css('left').length - 2);
        _y = $(_whiteboardItem).css('top').substr(0,$(_whiteboardItem).css('top').length - 2);

        cometd.publish('/service/whiteboardItem/move', {id:parseInt(_id),x:parseInt(_x),y:parseInt(_y),
            whiteboardid : parseInt($('.whiteboard').attr('data-whiteboard-id'))}
        );
    }

    // show progress state of uploaded whiteboarditem
    function _reportProgressStateWhiteboardItem(_id, _inProgress) {
        cometd.publish('/service/whiteboardItem/progress', {
            id : parseInt(_id),
            inProgress : Boolean(_inProgress),
            whiteboardid : parseInt($('.whiteboard').attr('data-whiteboard-id'))
        });
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

    // show posted attachment
    function _handlePostedAttachment(message){
        var _id       = message.data.id,
            _creator  = message.data.creator,
            _x        = message.data.x,
            _y        = message.data.y,
            _uid      = message.data.uid;

        var basePath = $('.whiteboard').attr('data-context-path'),
            image;

        if (activeUpload != null && _uid === activeUpload[1]){
            image = basePath + "/images/loading.gif";
        } else {
            image = basePath +"/images/stop.gif";
        }
        
        var template = '<div class="attachment draggable"><p class="image"><img src="'+ image + '"/></p><p class="filename"></p></div>';
        var view = $(template);
        
        view.css('left',_x+'px');
        view.css('top',_y+'px');

        var creator = $('.creator',view);
        creator.html(_creator);
        view.attr('id','attachment-'+_id);
        view.draggable({
            stop : function(e, ui) {
                var id = $(this).attr('id').split('-')[1];
                _moveWhiteboardItem(this,id);
            }
        });
        
        $('.whiteboard').append(view);
        
        if(activeUpload!=null && _uid===activeUpload[1]){
            _uploadFile(_id);
        }
    }

    // upload file
    function _uploadFile(id){
        $('#fileupload #uploadId').val(id);
        $('#fileupload').submit();
        $('#fileupload input[type=file], #fileupload textarea').val("");
        $('#uploadFrame').load(function(){
            // TODO eval is EVIL!!
            var attachment = eval("(" +$(this).contents().find("pre").text()+ ")");
            if(attachment['error'] != undefined){
                alert("Your File was not valid.");
                cometd.publish('/service/attachment/remove', {
                    id : parseInt(attachment['id']),
                    whiteboardid : parseInt($('.whiteboard').attr('data-whiteboard-id'))
                });
            }
            else {
                cometd.publish('/service/attachment/complete', {
                    id : parseInt(attachment['id']),
                    whiteboardid : parseInt($('.whiteboard').attr('data-whiteboard-id'))
                });
            }
        });
        activeUpload = null;
    }

    // handle action after attachment upload
    function _handleUploadCompleteAttachment(message){
        var ext = message.data.filename.split('.').pop(),
            filename = message.data.filename.substr(0, message.data.filename.length - (ext.length + 1)),
            basePath = $('.whiteboard').attr('data-context-path'),
            imgPath = basePath+"/images/teambox-free-file-icons/32px/"+ext+".png",
            attachment = $('#attachment-'+message.data.id);

        $('#attachment-'+message.data.id+ ' img').attr('src', imgPath);
        attachment.find(".filename").text(filename.substr(0,11));
        attachment.append("<input type=\"hidden\" name=\"filename\" class=\"full_filename\" value=\""+message.data.filename+"\">"+
                          "<input type=\"hidden\" name=\"creator\" class=\"creator\" value=\""+message.data.creatoremail+"\">"+
                          "<input type=\"hidden\" name=\"description\" class=\"description\" value=\""+message.data.description+"\">");
    }
    
    // remove attachment after failed upload
    function _handleUploadFailedAttachment(message){
        $('#attachment-'+message.data.id).remove();
    }

    // upload attachment
    function _postAttachment(form){
        var _creator  = $('creator',form).val(),
            _x        = 0,
            _y        = 80,
            _text     = $('textarea[name=shortDescription]',form).val(),
            _filename = $('input[type="file"]',form).val();
        
        cometd.publish('/service/attachment/post/', {
            creator : _creator,
            filename : _filename,
            x : parseInt(_x),
            y : parseInt(_y),
            text : _text,
            whiteboardid : parseInt($('.whiteboard').attr('data-whiteboard-id')),
            uid : activeUpload[1]
        });
    }

    // check if file is OK
    $('#fileupload input[type="file"]').live('change',function(){
        var input         = $(this).val(),
            fileExtension = [".pdf",".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".odt", ".odp", ".odf"],
            found = false;

        for( var index in fileExtension ){
            var ext = fileExtension[index];
            if( (input.toLowerCase().indexOf(ext, input.length - ext.length)) !== -1){
                found = true;
            }
        }
        if ( !found ){
            alert("not allowed");
            $(this).val("");
        }
    });

    // check if fileupload message is under 170 chars
    $('#fileupload textarea').live('keyup', function(){
        var maxchar = 170;
        if($(this).val().length >= maxchar){
            $(this).val($(this).val().substring(0, maxchar));
            alert("The maximum amount of chars is "+maxchar);
        }
    });

    // submit a file in upload dialog
    $('#fileupload input[type=submit]').click(function(event) {
        $('#upload-dialog').dialog('close');
        event.preventDefault();
        activeUpload = [$('#fileupload'), new Date().getTime()];
        _postAttachment($('#fileupload'));
    });

    $(".whiteboard .draggable").draggable({
        stop : function(e, ui) {
            var id = $(this).attr('id').split('-')[1];
            _moveWhiteboardItem(this, id);
        }
    });
});