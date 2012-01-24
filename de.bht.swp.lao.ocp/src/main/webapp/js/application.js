var saveInterval,
    activeNoteId,
    activeUpload=null;

$(function() {
    // validate email input on login page
    $('#loginFormData #email').keyup(function() {
        if(!validateEmail($(this).val())) {
            $(this).css('border','1px solid #FF0000');
        } else {
            $(this).css('border','1px solid #000000');
        }
    });

    // open/close sidebar
    $(".rightNavigation a.slideLeftButton").click(function() {
        var dir = $(this).parent().css('right') === "0px";
        $(this).parent().animate({right: dir?"-199px":"0px"}, 200); 
    });
    
    $('#logout-dialog').dialog({
        modal : true,
        autoOpen : false,
        closeOnEscape: false,
        open: function(event, ui) { $(".ui-dialog-titlebar-close").hide(); },
        open: function(event, ui) { $(".ui-dialog-titlebar").hide(); },
        width : 420,
        resizable: false,
        draggable: false
    });
    
    $('a[href="logout"]').live('click',  function(e) {
        $('#logout-dialog').dialog('open');
        $('#logout-dialog').css('min-height', '40px');
        $('#logout-dialog').css('height', 'auto');
        return false;
    }); 
    
    $('#logout-dialog button.cancel').click(function(){
        $('#logout-dialog input[type=text]').val("");
        $('#logout-dialog').dialog('close');
    });
});