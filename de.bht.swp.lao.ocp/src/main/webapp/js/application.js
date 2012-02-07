var saveInterval,
    activeNoteId,
    activeUpload=null;

var MODUS = {
    HAND: 'HAND',
    SELECT: 'SELECT' };

// starting with the hand modus
var currentModus = MODUS.HAND;

//TODO commenting
/**
* ?
* 
* @param {jQueryObject} elem    ?
* 
*/
function containerFadeIn(elem) {
    $('.dialogs div[id]').fadeOut(500,function() {
        if($(this).attr('id')==$(elem).attr('id')) $(elem).fadeIn();
    });
    $('.whiteboard').draggable('disable').css('cursor', 'default!important').css('background', 'url("../images/whiteboard-background-blured.gif")');
    $('.whiteboard .note, .whiteboard .attachment').draggable('disable').addClass('blurBox');
    $('.whiteboard .noteItems textarea').addClass('blurTextarea').attr('readonly', 'readonly').css('cursor', 'default');
    $('.whiteboard .noteItems textarea, .whiteboard .creator').addClass('blurText');
}

//TODO commenting
/**
* ?
* 
* @param {jQueryObject} elem    ?
* 
*/
function containerFadeOut(elem) {
    $(elem).fadeOut();
    $('.whiteboard').draggable('enable').css('cursor', 'inherit').css('background', 'url("../images/whiteboard-background.gif")');
    $('.whiteboard .note, .whiteboard .attachment').draggable('enable').removeClass('blurBox');
    $('.whiteboard .noteItems textarea').removeClass('blurTextarea').removeAttr('readonly').css('cursor', 'inherit');
    $('.whiteboard .noteItems textarea, .whiteboard .creator').removeClass('blurText');
}

$(function() {
    
    $('a[href="logout"]').live('click', function(e) {
        containerFadeIn('#logoutContainer');
        return false;
    });
    
    $('#logoutContainer button.cancel').click(function() {
        containerFadeOut('#logoutContainer');
    });
    
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
        $(this).parent().animate({right: dir?"-200px":"0px"}, 200); 
    });
    
    $('.mainPanel ul a.delete').click(function(){
        return confirm('Delete Whiteboard: '+$(this).prev().html()+' ?');
    }); 
});