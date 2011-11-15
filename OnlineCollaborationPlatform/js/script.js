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
    $(this).stop(true, false).delay(1500).animate({ right: '-260px' }, 500);
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
	//URL for Request
    href = $(elem).find('form').attr('action');
    
    // headline of PostIt
    headline = $(elem).find('input[type=text]').val();
    // Text of PostIt
    text = $(elem).find('textarea').val();
    // Position x and y
    posLeft = $(elem).css('left').substr(0,$(elem).css('left').length-2);
    posTop = $(elem).css('top').substr(0,$(elem).css('top').length-2);
    
    //Request send data per href
    $.ajax({
        url: href,
        type: 'POST',
        data: 'PostIt[headline]='+headline+'&PostIt[text]='+text+'&PostIt[x]='+posLeft+'&PostIt[y]='+posTop+'&PostIt[status]=unlock',
        success: function(newhref){
        	if(newhref != null && newhref.length > 0){
        		$(elem).find('form').attr('action', newhref);
        		$(elem).attr('id','postIt-'+newhref.substr(-1));
        	}
        }
    });
}

/*
 * function to save a post it as locked
 */
function lockPostIt(elem) {
    href = $(elem).find('form').attr('action');
    
    // Ajax request with parameters for lock
    $.ajax({
        url: href,
        type: 'POST',
        data: 'PostIt[status]=lock',
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
           append($('<input/>').attr('name', 'PostIt[headline]').attr('type','text').attr('placeholder','your title')).
           append($('<textarea/>').attr('name','content').elasticArea()));
    
    $('.whiteboard').append(html);
    return false;
});

/**
 * Lock post-it
 */
$('.whiteboard .postIt').focusin( function() {
    lockPostIt(this);
})

/*
 * update post-it
 */
$('.whiteboard .postIt').focusout( function() {
    savePostIt(this);
})

/*
 * data polling
 */
function pollData(url){
    var test = url;
	$.get(url,function(data){
        if(data.length > 0){
            var postIts = data;
			for(i = 0; i < postIts.length; i++){
				postItHtmlId = 'postIt-'+postIts[i]['id'];
				var elem = $('#'+postItHtmlId);
				if(elem.length==0){
					console.log("postit not exists "+postItHtmlId);
					action = postIts[i]['action'];
					
					form = $('<form/>').attr('action',action).attr('method','post');
					input =$('<input/>').attr('name', 'PostIt[headline]').attr('type','text').attr('placeholder','your title');
					textarea = $('<textarea/>').attr('name','content').elasticArea();
										
				    html = $('<div/>').
				    			addClass('postIt').
				    	  		attr('id',postItHtmlId).
				    	  		css('position','absolute').
				    	  		css('left',postIts[i]['x']+"px").
				    	  		css('top',postIts[i]['y']+"px").
				    	  		focusout( function() {
				    	  			savePostIt(this)
				    	  		}).
				    	  		draggable(dragAndDropOptions).
				    	  		append(form.append(input));
				    	  		append(form.append(textarea));
				    input.val(postIts[i]['headline']);
				    textarea.val(postIts[i]['text']);
				    
				    $('.whiteboard').append(html);
				}
				else{
					headline = elem.find('input[type=text]')[0];
					headline.value = postIts[i]['headline'];
					//FIX ME
					textarea = elem.find('textarea')[0];
					textarea.value = postIts[i]['text'];
					textarea.style.height = textarea.scrollHeight/2 + 'px';
                    textarea.style.height = textarea.scrollHeight + 'px';
                    textarea.style.height = textarea.style.height === '0px' ? '17px' : textarea.style.height;
					
					// elem.animate({
					    // left: postIts[i]['x']+"px",
					    // top: postIts[i]['y']+"px"
					// },1500);
					elem.css('left',postIts[i]['x']+"px");
    				elem.css('top',postIts[i]['y']+"px");
    				
    				locked = $(elem).find('.locked');
    				if(locked.length==0){
    					elem.append($('<img/>').attr('class','locked').attr('src','../images/locked.png'));
    					if(!parseInt(postIts[i]['isLocked'])) {
    					    locked.css('display','none');
    					}
    				}else{
    				    userId = $('.rightNavigation div.login h2 span').attr('data-userId');
    				    if(parseInt(postIts[i]['isLocked']) === 1){//} && parseInt(postIts[i]['ownerId']) !== userId) {
                            locked.css('display','block');
                            // FIXME compare with own id
                            //$(textarea).attr('readonly','readonly');
                        } else {
                            locked.css('display','none');
                            //$(textarea).removeAttr('readonly');
                        }
    				}
				}
			}
		}
        pollData(url); // repeat poll
    }, 'json').
    error( function() {
        // server doesn't answer - send request again
        pollData(url);
    });
}

/*
 * elastic textarea
 */
jQuery.fn.elasticArea = function() {
  return this.each(function(){
    function resizeTextarea() {
      this.style.height = this.scrollHeight/2 + 'px';
      this.style.height = this.scrollHeight + 'px';
      this.style.height = this.style.height === '0px' ? '17px' : this.style.height;
    }
    $(this).keypress(resizeTextarea)
    .keydown(resizeTextarea)
    .keyup(resizeTextarea)
    .css('overflow','hidden');
    resizeTextarea.call(this);
  });
};

/*
 * register drag and drop action for all post-it's from database
 */
$('.postIt').draggable(dragAndDropOptions);
$('.postIt textarea').elasticArea();
