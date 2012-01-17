$(document).ready(function() {

	$('.exclamation').hover(
			function(){
				errors = $('.errors',$(this));
				errors.show();
			},
			function(){
				errors = $('.errors',$(this));
				errors.hide();
			});
	
});