//TODO commenting
/**
* 
* 
* @param {CometdMessage} message    ?
* 
*/
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
    
    var template = '<div class="attachment draggable">'+
                        '<div class="attachmentItems">'+
                            '<p class="image">'+
                                '<img src="'+ image + '"/>'+
                            '</p>'+
                            '<p class="filename"></p>'+
                        '</div>'+
                        '<div class="attachmentMenu">'+
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
    
    view.css('left',_x+'px');
    view.css('top',_y+'px');

    var creator = $('.creator',view);
    creator.html(_creator);
    view.attr('id','attachment-'+_id);
    
    view.draggable({
        handle:$('.file_mouseOverMenu_top',view),
        stop : function(e, ui) {
            var id = $(this).attr('id').split('-')[1];
            _moveWhiteboardItem(this,id);
        }
    });
    view.css("position","absolute");
    
    $('.whiteboard').append(view);
    
    if(activeUpload!=null && _uid===activeUpload[1]){
        _uploadFile(_id);
    }
}

//TODO commenting
/**
* 
* @param {Integer} id    ?
* 
*/
function _uploadFile(id){
    $('#fileupload #uploadId').val(id);
    $('#fileupload').submit();
    $('#fileupload input[type=file], #fileupload textarea').val("");
    $('#uploadFrame', top.document).load(function(){
        var attachment = eval("("+$(this).contents().text()+")");
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

// 
//TODO commenting
/**
* handle action after attachment upload
* 
* @param {CometdMessage} message    ?
* 
*/
function _handleUploadCompleteAttachment(message){
    var ext = message.data.filename.split('.').pop(),
        filename = message.data.filename.substr(0, message.data.filename.length - (ext.length + 1)),
        basePath = $('.whiteboard').attr('data-context-path'),
        imgPath = basePath+"/images/teambox-free-file-icons/32px/"+ext+".png",
        attachment = $('#attachment-'+message.data.id);

    $('#attachment-'+message.data.id+ ' .image img').attr('src', imgPath);
    attachment.find(".filename").text(filename.substr(0,11));
    attachment.append("<input type=\"hidden\" name=\"filename\" class=\"full_filename\" value=\""+message.data.filename+"\">"+
                      "<input type=\"hidden\" name=\"creator\" class=\"creator\" value=\""+message.data.creatoremail+"\">"+
                      "<input type=\"hidden\" name=\"description\" class=\"description\" value=\""+message.data.description+"\">");
}

//TODO commenting
/**
* remove attachment after failed upload
* 
* @param {CometdMessage} message    ?
* 
*/
function _handleUploadFailedAttachment(message){
    $('#attachment-'+message.data.id).remove();
}


/**
* upload attachment
* 
* @param {CometdMessage} message    ?
* 
*/
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

//all actions
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
        $('#invite-dialog').css('min-height', '80px');
        $('#upload-dialog').css('height', 'auto');
    });

    // close upload dialog
    $('#fileupload button.cancel').click(function(){
        $('#fileupload input[type=file], #fileupload textarea').val("");
        containerFadeOut('#uploadContainer');
    });
    
    $('.attachment').live('click', function(){
        var attachment = $(this),
            rightNavigation = $('.rightNavigation'),
            basePath = $('.whiteboard').attr('data-context-path'),
            full_name = $('<h2/>').attr('class','full_filename').html(attachment.find('.full_filename').val()),
            creator = $('<div/>').attr('class','creator').html('uploded by '+attachment.find('.creator').val()),
            description = $('<textarea/>').attr('class','description').attr('readonly','readonly').html(attachment.find('.description').val()),
            id = $(this).attr('id').split('-')[1],
            download = $('<a/>').attr('href',basePath+"/attachment/"+id+"/"+attachment.find('.full_filename').val()+"/download.htm").html('[DownloadButton]'),
            fileinfo = $('<div/>')
                .attr('class','fileinfo')
                .append(full_name)
                .append(creator)
                .append($('<br/>'))
                .append(download)
                .append($('<br/>'))
                .append($('<br/>'))
                .append($('<div/>').html('Description:'))
                .append(description);
        rightNavigation.find('.fileinfo').remove();
        rightNavigation.append(fileinfo);
        $(".rightNavigation").stop(true, false).animate({ 
            right: "0px"
        }, 200);
    }).live('dblclick',function() {
        var attachment = $(this),
            id = $(this).attr('id').split('-')[1],
            basePath = $('.whiteboard').attr('data-context-path');
        window.location.href = basePath+'/attachment/'+id+'/'+attachment.find('.full_filename').val()+'/download.htm';
    });
    
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
        containerFadeOut('#uploadContainer');
        event.preventDefault();
        activeUpload = [$('#fileupload'), new Date().getTime()];
        _postAttachment($('#fileupload'));
    });
    
    $('.attachment').live("mouseover", function() {
        currentModus=MODUS.SELECT;
        $('.attachmentMenu',$(this)).css("display", "block");
   });
   $('.attachment').live("mouseleave", function() {
        currentModus=MODUS.HAND;
        $('.attachmentMenu',$(this)).css("display", "none");
   });
    
});