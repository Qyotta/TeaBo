function showStartHelp() {
	offsetTop = ((($(window).height() - $('#startscreen').outerHeight()) / 2)
			+ $(window).scrollTop() + "px");
	offsetLeft = ((($(window).width() - $('#startscreen').outerWidth()) / 2)
			+ $(window).scrollLeft() + "px");

	var cssObj = {
		'top' : offsetTop,
		'left' : offsetLeft,
		'display' : 'block',
	};
	$('#startscreen').css(cssObj);

}

$(document).ready(function() {

	showStartHelp();
	
	$('#startscreen #next').live('click', function(){
		current = $('#startscreen ul li:visible');
		current.next('li').show();
		current.hide();
		if($('#startscreen ul li:visible').next('li').length == 0){
			$('#startscreen #next').hide();
		}
		if($('#startscreen #prev').is(':visible') == false){
			$('#startscreen #prev').show();
		}
		
	});
	
	$('#startscreen #prev').live('click', function(){
		current = $('#startscreen ul li:visible');
		current.prev('li').show();
		current.hide();
		if($('#startscreen ul li:visible').prev('li').length == 0){
			$('#startscreen #prev').hide();
		}
		if($('#startscreen #next').is(':visible') == false){
			$('#startscreen #next').show();
		}
		
	});
	
	$('#startscreen #showClose').live('click', function(){
		//TODO: submit value
		$('#startscreen').hide();
	});

});
