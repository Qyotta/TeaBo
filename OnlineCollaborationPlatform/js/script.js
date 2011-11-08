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
    href = $(elem).find('form').attr('href');
    text = $(elem).find('textarea').val();
    
    $.ajax({
        url: href,
        type: 'POST',
        data: 'PostIt[text]='+text,
        //&PostIt[xposition]='+Math.floor(Math.random()*800)+'&PostIt[yposition]='+Math.floor(Math.random()*800),
        success: function(){
            console.log('postIt saved')
        }
    });
}

/*
 * create post-it form direct on the whiteboard
 */
$('.bottomNavigation ul li a').click(function() {
    href = $(this).attr('href');
    html = $('<div/>').addClass('postIt').focusout( function() 
           {
                savePostIt(this)
           }).
           append($('<form/>').attr('href',href).attr('method','post').
           append($('<textarea/>').attr('name','content')));
    
    $('.whiteboard').append(html)
    return false;
});
























