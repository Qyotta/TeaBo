var saveInterval;
var activeNoteId;

(function($)
{
    var cometd = $.cometd;
    
    $(document).ready(function()
    {        
    	function _refresh(message){
    		if( activeNoteId == message.data.id ){
    			return null;
    		}
    		note = $('#postIt-'+message.data.id);
    		if(note.length==0){
    			title = $('<input/>').attr('name','title').attr('placeholder','your title').val(message.data.title).
				hover(function() {
		        	$(this).parent().find('span.creator').css('display','block');
		        }, function() {
		        	$(this).parent().find('span.creator').css('display','none');
		        }).focus(function (){
		        	clickedNote = $(this).parent();
		        	divId = clickedNote.attr("id");
		        	if(divId != undefined){
		        		id = divId.split('-')[1];
		        		_publishProgressState(id, true);
		        	}
		        	
		        	activeNoteId = id;
		   	     	saveInterval = window.setInterval(function() { saveNote(clickedNote, id); } , 500);
		        }).blur(function (){
		        	clickedNote = $(this).parent();
		        	divId = clickedNote.attr("id");
		        	if(divId != undefined){
		        		id = divId.split('-')[1];
		        		_publishProgressState(id, false);
		        	}
		        	
		        	activeNoteId = id;
		   	     	saveInterval = window.setInterval(function() { saveNote(clickedNote, id); } , 500);
		        });
    			
    			text = $('<textarea/>').attr('name','text').attr('placeholder','your note text').val(message.data.text).elasticArea();
    			creator = $('<span/>').addClass('creator').html(message.data.creator);
    			
    			$('.whiteboard').append(
    				$('<div/>').
	    				addClass('postIt').
	    				attr('id','postIt-'+message.data.id).
	    				css('left',message.data.x).
	    				css('top',message.data.y).
	    				append(title).
	    				append(text).
	    				append(creator).draggable({
	    		        	stop: function(e,ui) {
	    		        		var id = $(this).attr('id').split('-')[1];
	    		        		saveNote(this,id);
	    		        	}
	    		        })	    		        
    			);
    			
    			// resize all new textarea notes
    			text.css('height',text[0].scrollHeight/2 + 'px');
    			text.css('height',text[0].scrollHeight + 'px');
    			text.css('height',parseInt(text[0].css('height')) === 0 ? '17px' : this.style.height);
    			
    		}
    		else{
    			note.css('left',message.data.x+'px');
    			note.css('top',message.data.y+'px');
    			note.find('input[name=title]').val(message.data.title);
    			note.find('textarea[name=text]').val(message.data.text);
    			note.find('span.creator').html(message.data.creator);
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
        	cometd.publish('/service/note', { id:parseInt(_id), title: _title, text:_text, x:parseInt(_x), y:parseInt(_y), creator:$('.whiteboard').attr('data-user-mail'), whiteboardid:parseInt($('.whiteboard').attr('data-whiteboard-id')) });
        }
        
        function _publishProgressState(_id, _inProgress){
        	cometd.publish('/service/note/setProgress', {id:parseInt(_id), inProgress:Boolean(_inProgress), whiteboardid:parseInt($('.whiteboard').attr('data-whiteboard-id'))});
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
                    cometd.subscribe('/note/'+$('.whiteboard').attr('data-whiteboard-id'),_refresh);
                    cometd.subscribe('/note/'+$('.whiteboard').attr('data-whiteboard-id')+'/progress',_refreshProgress);
                });
            }
        }

        // Disconnect when the page unloads
        $(window).unload(function()
        {
            cometd.disconnect(true);
        });

        var cometURL = location.protocol + "//" + location.host + $('.whiteboard').attr('data-context-path') + "/cometd";
        cometd.configure({
            url: cometURL,
            logLevel: 'debug'
        });

        cometd.addListener('/meta/handshake', _metaHandshake);
        cometd.addListener('/meta/connect', _metaConnect);
        cometd.handshake();
        
        
        function saveNote(clickedNote, id){            	
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
    	}
        
        //mark note as in progress
        $('.postIt input[type=text], .postIt textarea').live('focus', function (){
        	clickedNote = $(this).parent();
        	divId = clickedNote.attr("id");
        	if(divId != undefined){
        		id = divId.split('-')[1];
        		_publishProgressState(id, true);
        	}
        	
        	activeNoteId = id;
   	     	saveInterval = window.setInterval(function() { saveNote(clickedNote, id); } , 500);
        });
        
        $('.postIt input[type=text], .postIt textarea').live('blur', function (){
        	clickedNote = $(this).parent();
        	divId = clickedNote.attr("id");
        	if(divId != undefined){
        		id = divId.split('-')[1];
        		_publishProgressState(id, false);
        	}
        	activeNoteId = null;
        	window.clearInterval(saveInterval);
        	saveNote(clickedNote, id);
        });
        
        //new note
        $('.bottomNavigation .right .createPostIt').click(function(){
			posx = Math.floor(Math.random()*700);
			posy = Math.floor(Math.random()*400);
			
			_publish(null,"","",posx,posy);
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
        
        $(".whiteboard .postIt").draggable({
        	stop: function(e,ui) {
        		var id = $(this).attr('id').split('-')[1];
        		saveNote(this,id);
        	}
        });
        $('.postIt').find('textarea').elasticArea();
        $('.postIt input[name="title"]').hover(function() {
        	$(this).parent().find('span.creator').css('display','block');
        }, function() {
        	$(this).parent().find('span.creator').css('display','none');
        });
        
        $('#upload-dialog').dialog({
        	autoOpen:false,
        	modal:true,
        	width:400,
        	title:"File Upload"
        });
        
        $('a.uploadFile').live('click', function(e){
        	e.preventDefault();
        	$('#upload-dialog > form > ul > li').not(":first-child").remove();
        	$('#upload-dialog > form > ul > li:first-child > input[type="file"]').val("");
        	$('#upload-dialog').dialog('open');
        });
        
        $('#upload-dialog > form > button').live('click',function(e){
        	toClone = $('#upload-dialog > form > ul > li:first-child').clone();
        	toClone.find('input[type="file"]').val("");
        	toClone.appendTo('#upload-dialog > form > ul');
        });
        
        $('input[type="file"]').live('change',function(){
        	input = $(this).val();
        	fileExtension = [".pdf",".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".odp", ".odf"];
        	found = false;
        	for( var index in fileExtension ){
        		var ext = fileExtension[index];
	        	if( (input.toLowerCase().indexOf(ext, input.length - ext.length)) !== -1){
	        		found = true;
	        	}
        	}
        	if ( !found ){
	        	alert("not allowed");
	    		$(this).val("");
        	}
        });
        
    });
    
})(jQuery);
