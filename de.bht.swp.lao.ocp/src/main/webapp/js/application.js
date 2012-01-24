var saveInterval,
    activeNoteId,
    activeUpload=null;

(function($) {
    $(document).ready(function() {
        // validate email input on login page
        $('#loginFormData #email').keypress(function() {
            if(validateEmail($(this).val())) {
                $(this).css('border','1px solid #FF0000');
            } else {
                $(this).css('border','inherit');
            }
        });

        // open/close sidebar
        $(".rightNavigation a.slideLeftButton").click(function() {
            var dir = $(this).parent().css('right') === "0px";
            $(this).parent().animate({right: dir?"-199px":"0px"}, 200); 
        });

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

        $('.attachment').live('click', function(){
            var attachment = $(this),
                rightNavigation = $('.rightNavigation'),
                basePath = $('.whiteboard').attr('data-context-path'),
                full_name = $('<h2/>').attr('class','full_filename').html(attachment.find('.full_filename').val()),
                creator = $('<div/>').attr('class','creator').html('uploded by '+attachment.find('.creator').val()),
                description = $('<textarea/>').attr('class','description').html(attachment.find('.description').val()),
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
                right: "0px", 
            }, 200);
        }).live('dblclick',function() {
            var attachment = $(this),
                id = $(this).attr('id').split('-')[1],
                basePath = $('.whiteboard').attr('data-context-path');
            window.location.href = basePath+'/attachment/'+id+'/'+attachment.find('.full_filename').val()+'/download.htm';
        });

        $('.bottomNavigation ul li div').hover(function() {console.log("jss");
            $(this).find('a').css('bottom','30px');
            $(this).find('span').css('display','block');
        }, function() {
            $(this).find('a').css('bottom','15px');
            $(this).find('span').css('display','none');
        });
    });
})(jQuery);