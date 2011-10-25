/* Author: Christian Bromann - contact@christian-bromann.com
 * 
 * @requires jQuery 1.6.2 or higher
 */

$('nav.rightNavigation').hover(function() {
    $(this).stop(true, false).animate({ right: 0 }, 500);
}, function() {
    $(this).stop(true, false).animate({ right: '-260px' }, 500);
})

var layer = 0;
$('nav.rightNavigation ul li a').click(function() {
    var hide = $($('nav.rightNavigation div div')[layer]);
    var show = $('nav.rightNavigation div div.'+$(this).attr('href').substr(1));
    hide.fadeOut(200, function() {
        show.fadeIn(200);
        layer = show.index();
    });
})























