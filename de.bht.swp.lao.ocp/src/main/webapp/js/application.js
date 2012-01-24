var saveInterval,
    activeNoteId,
    activeUpload=null;

$(function() {
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
});