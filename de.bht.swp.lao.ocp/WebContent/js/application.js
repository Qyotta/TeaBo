var test;

(function($)
{
    var cometd = $.cometd;

    $(document).ready(function()
    {        
    	function _refresh(message){
    		note = $('#postIt-'+message.data.id);
    		if(note.length==0){
    			title = $('<input/>').attr('name','title').val(message.data.title);
    			text = $('<textarea/>').attr('name','text').val(message.data.text).elasticArea();
    			creator = $('<span/>').attr('name','creator').html(message.data.creator);
    			submit = $('<input/>').attr('type','submit');
    			
    			$('.whiteboard').append(
    				$('<div/>').
	    				addClass('postIt').
	    				attr('id','postIt-'+message.data.id).
	    				css('left',message.data.x).
	    				css('top',message.data.y).
	    				append(title).
	    				append(text).
	    				append(creator).
	    				append(submit)
    			);
    			
    			// resize all new textarea notes
    			text.css('height',text[0].scrollHeight/2 + 'px');
    			text.css('height',text[0].scrollHeight + 'px');
    			text.css('height',text[0].style.height === '0px' ? '17px' : this.style.height);
    			
    		}
    		else{
    			note.css('left',message.data.x+'px');
    			note.css('top',message.data.y+'px');
    			note.find('input[name=title]').val(message.data.title);
    			note.find('textarea[name=text]').val(message.data.text);
    			note.find('span[name=creator]').html(message.data.creator);
    		}
    	}
    	
    	function _refreshProgress(message){
    		note = $('#postIt-'+message.data.id);
    		if(note.length > 0){
    			locked = $(note).find('.locked');
				if(locked.length==0){
					locked = $('<img/>').attr('class','locked').attr('src','../images/locked.png');
					note.append(locked);
				}
				if(message.data.inProgress == false){
					    locked.css('display','none');
				} 
				else{
					locked.css('display','block');
				}
    		}
    	}
    	
        function _publish(_id,_title,_text,_x,_y){
        	cometd.publish('/service/note', { id:parseInt(_id), title: _title, text:_text, x:parseInt(_x), y:parseInt(_y), creator:user.email, whiteboardid:parseInt(whiteboard.id) });
        }
        
        function _publishProgressState(_id, _inProgress){
        	cometd.publish('/service/note/setProgress', {id:parseInt(_id), inProgress:Boolean(_inProgress), whiteboardid:parseInt(whiteboard.id)});
        }

        // Function that manages the connection status with the Bayeux server
        var _connected = false;
        function _metaConnect(message)
        {
            if (cometd.isDisconnected())
            {
                _connected = false;
                return;
            }

        }

        // Function invoked when first contacting the server and
        // when the server has lost the state of this client
        function _metaHandshake(handshake)
        {
            if (handshake.successful === true)
            {
                cometd.batch(function()
                {
                    cometd.subscribe('/note/'+whiteboard.id,_refresh);
                    cometd.subscribe('/note/'+whiteboard.id+'/progress',_refreshProgress);
                });
            }
        }

        // Disconnect when the page unloads
        $(window).unload(function()
        {
            cometd.disconnect(true);
        });

        var cometURL = location.protocol + "//" + location.host + config.contextPath + "/cometd";
        cometd.configure({
            url: cometURL,
            logLevel: 'debug'
        });

        cometd.addListener('/meta/handshake', _metaHandshake);
        cometd.addListener('/meta/connect', _metaConnect);
        cometd.handshake();
        
        //save
        $(".postIt input[type=submit]").live("click",function(){
        	clickedNote = $(this).parent();
        	divId = clickedNote.attr("id");
        	if(divId==undefined){
        		id = null;
        	}
        	else{
        		id = divId.split('-')[1];
        	}
        	
            // title of PostIt
            title = $(clickedNote).find('input[name=title]').val();
            // Text of PostIt
            text = $(clickedNote).find('textarea[name=text]').val();
            // Position x and y
            x = $(clickedNote).css('left').substr(0,$(clickedNote).css('left').length-2);
            y = $(clickedNote).css('top').substr(0,$(clickedNote).css('top').length-2);
            if(id==null){
            	clickedNote.remove();
            }
            _publish(id,title,text,x,y);
            
        });
        
        //mark note as in progress
        
        $('.postIt input[type=text], .postIt textarea').live('focus', function (){
        	clickedNote = $(this).parent();
        	divId = clickedNote.attr("id");
        	if(divId != undefined){
        		id = divId.split('-')[1];
        		_publishProgressState(id, true);
        	}
        });
        
        $('.postIt input[type=text], .postIt textarea').live('blur', function (){
        	clickedNote = $(this).parent();
        	divId = clickedNote.attr("id");
        	if(divId != undefined){
        		id = divId.split('-')[1];
        		_publishProgressState(id, false);
        	}
        });
        
        //new note
        $('.bottomNavigation .right .createPostIt').click(function(){
        	title = $('<input/>').attr('name','title').attr('placeholder','your title');
			text = $('<textarea/>').attr('name','text').attr('placeholder','your text').elasticArea();
			submit = $('<input/>').attr('type','submit');
			div=$('<div/>').
				addClass('postIt').
				css('position','absolute').
				css('left',Math.floor(Math.random()*700)+'px').
				css('top',Math.floor(Math.random()*400)+'px').
				append(title).
				append(text).
				append(submit);
			$('.whiteboard').append(div);
        });
        
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
        
        $('.postIt').find('textarea').elasticArea();
        
    });
})(jQuery);
