(function($)
{
    var cometd = $.cometd;

    $(document).ready(function()
    {
        function _connectionEstablished()
        {
            $('#body').append('<div>CometD Connection Established</div>');
        }

        function _connectionBroken()
        {
            $('#body').append('<div>CometD Connection Broken</div>');
        }

        function _connectionClosed()
        {
            $('#body').append('<div>CometD Connection Closed</div>');
        }
        
        function _refresh(message){
        	div_note = $('#note-'+message.data.id);
        	if(div_note.length==0){
	        	div = $('<div/>');
	        	div.addClass('note');
	        	div.attr('id','note-'+message.data.id);
	        	div.attr('style','position:absolute;left:'+message.data.x+'px; top:'+message.data.y+'px; width:120px; background:#CCFF33;');
	        	
	        	title = $('<input/>');
	        	title.attr('type','text');
	        	title.attr('name','title');
	        	title.val(message.data.title);
	        	title.attr('style','width:100px;');
	        	
	        	text = $('<input/>');
	        	text.attr('type','text');
	        	text.attr('name','text');
	        	text.val(message.data.text);
	        	text.attr('style','width:100px;');
	        	div.append(title);
	        	div.append(text);
	        	
	        	btn = $('<input/>').attr('type','submit');
	        	div.append(btn);
	        	$('#body').append(div);
	        	btn.click(function(){
	        		x = div.css('left').substr(0,div.css('left').length-2);
	        		y = div.css('top').substr(0,div.css('top').length-2);
	        		_publish(message.data.id,title.val(),text.val(),x,y,'user');
	        		div.remove();
	        	});
	        	div.draggable({stop: 
	        				function(e,ui) {
		        				href = $(this).find('form').attr('action');
			        	        posLeft = ui.position.left;
			        	        posTop = ui.position.top;
			        	        _publish($(this).attr('id').substr('note-'.length),
			        	        		$(this).find('input[name=title]').val(),
			        	        		$(this).find('input[name=text]').val(),
			        	        		posLeft,
			        	        		posTop);
			        	    }
	        	});
	        	
        	}else{
        		div.find('input[name=title]').val(message.data.title);
        		div.find('input[name=text]').val(message.data.text);
        		div.attr('style','position:absolute;left:'+message.data.x+'px; top:'+message.data.y+'px; width:120px; background:#CCFF33;');
	        	
        	}
        	
        }
        
        function _publish(_id,_title,_text,_x,_y,_creator){
        	cometd.publish('/service/note', { id:parseInt(_id), title: _title, text:_text, x:parseInt(_x), y:parseInt(_y), creator:_creator });
        }

        // Function that manages the connection status with the Bayeux server
        var _connected = false;
        function _metaConnect(message)
        {
            if (cometd.isDisconnected())
            {
                _connected = false;
                _connectionClosed();
                return;
            }

            var wasConnected = _connected;
            _connected = message.successful === true;
            if (!wasConnected && _connected)
            {
                _connectionEstablished();
            }
            else if (wasConnected && !_connected)
            {
                _connectionBroken();
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
                    cometd.subscribe('/hello', function(message)
                    {
                        $('#body').append('<div>Server Says: ' + message.data.greeting + '</div>');
                    });
                    // Publish on a service channel since the message is for the server only
                    cometd.publish('/service/hello', { name: 'World' });
                    cometd.subscribe('/note',_refresh);
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
        
        $('#create_note_btn').click(function(){
        	div = $('<div/>');
        	div.attr('id','create_note').attr('style','position:absolute; width:120px; background:#CCFF33;');
        	title = $('<input/>').attr('type','text').attr('name','title').val('title').attr('style','width:100px;');
        	div.append(title);
        	text = $('<input/>').attr('type','text').attr('name','text').val('text').attr('style','width:100px;');
        	div.append(text);
        	btn = $('<input/>').attr('type','submit');
        	div.append(btn);
        	btn.click(function(){
        		x = div.css('left').substr(0,div.css('left').length-2);
        		y = div.css('top').substr(0,div.css('top').length-2);
        		_publish(null,title.val(),text.val(),x,y,'user');
        		div.remove();
        	});
        	
        	$('#body').append(div);
        	$('#create_note').draggable();
        });
    });
})(jQuery);
