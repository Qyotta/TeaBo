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























