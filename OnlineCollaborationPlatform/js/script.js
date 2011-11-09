/* Author: Christian Bromann - contact@christian-bromann.com
 * 
 * @description contains the main jQuery actions
 * @requires jQuery 1.6.2 or higher
 */

/*
 * create a hover action on the nav.rightNavigation class
 */
$('nav.rightNavigation').hover(function() {
    // this will be fired on the onMouseEnter
    // action: jQuery animation to slide the element to the right
    $(this).stop(true, false).animate({ right: 0 }, 500);
}, function() {
    // this will be fired on the onMouseLeave
    // action: jQuery animation to slide the element back to the right
    $(this).stop(true, false).animate({ right: '-260px' }, 500);
})


/*
 * shows different layers on nav.rightNavigation with a click action
 */
var layer = 0; // contains the current visible layer
$('nav.rightNavigation ul li a').click(function() {
    // get layer, which will be fade out
    var hide = $($('nav.rightNavigation div div')[layer]);
    // get layer, which will be fade in
    var show = $('nav.rightNavigation div div.'+$(this).attr('href').substr(1));
    // hide layer
    hide.fadeOut(200, function() {
        // show layer
        show.fadeIn(200);
        // update index of visible layer
        layer = show.index();
    });
})

/*
 * function to save a post it
 */
function savePostIt(elem) {
    href = $(elem).find('form').attr('action');
    text = $(elem).find('textarea').val();
    posLeft = $(elem).css('left').substr(0,$(elem).css('left').length-2);
    posTop = $(elem).css('top').substr(0,$(elem).css('top').length-2);
    
    console.log(posTop + " - "+posLeft);
    
    $.ajax({
        url: href,
        type: 'POST',
        data: 'PostIt[text]='+text+'&PostIt[x]='+posLeft+'&PostIt[y]='+posTop,
        success: function(){
            console.log('postIt saved')
        }
    });
}

/*
 * drag and drop options
 */
var dragAndDropOptions = {
    stop: function(e,ui) {
        href = $(this).find('form').attr('action');
        text = $(this).find('textarea').val();
        posLeft = ui.position.left;
        posTop = ui.position.top;
        $.ajax({
            url: href,
            type: 'POST',
            data: 'PostIt[x]='+posLeft+'&PostIt[y]='+posTop
        });
    }
}

/*
 * create post-it form direct on the whiteboard
 */
$('.bottomNavigation ul li a').click(function() {
    href = $(this).attr('href');
    posLeft = Math.floor(Math.random()*1100);
    posTop = Math.floor(Math.random()*500);
    
    html = $('<div/>').addClass('postIt').
           css('position','absolute').
           css('left',posLeft).
           css('top',posTop).
           focusout( function() 
           {
                savePostIt(this)
           }).
           draggable(dragAndDropOptions).
           append($('<form/>').attr('action',href).attr('method','post').
           append($('<textarea/>').attr('name','content')));
    
    $('.whiteboard').append(html)
    return false;
});

/*
 * update post-it
 */
$('.whiteboard .postIt').focusout( function() {
    savePostIt(this);
})

/*
 * register drag and drop action for all post-it's from database
 */
$('.postIt').draggable(dragAndDropOptions);