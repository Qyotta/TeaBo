var saveInterval;
var activeNoteId;

var activeUpload=null;

(function($) {
	var cometd = $.cometd;

	$(document).ready(function() {
		// posts a new note
		function _postNote(_x, _y) {
			cometd.publish('/service/note/post/', {
				x : parseInt(_x),
				y : parseInt(_y),
				creator : $('.whiteboard').attr(
						'data-user-mail'),
				whiteboardid : parseInt($('.whiteboard').attr(
						'data-whiteboard-id'))
			});
		}

		// create a posted note
		function _handlePostedNote(message) {

			text = $('<textarea/>').attr('name', 'text').attr(
					'placeholder', 'your note text')
					.elasticArea().hover(
							function() {
								$(this).parent().find('span.creator')
										.css('display', 'block');
							},
							function() {
								$(this).parent().find('span.creator')
										.css('display', 'none');
							});
			creator = $('<span/>').addClass('creator').html(
					message.data.creator);

			$('.whiteboard')
					.append(
							$('<div/>')
									.addClass('note')
									.attr(
											'id',
											'note-'
													+ message.data.id)
									.css('left', message.data.x)
									.css('top', message.data.y)
									.append(text)
									.append(creator)
									.draggable(
											{
												stop : function(e, ui) {
													var id = $(this)
													.attr('id')
													.split('-')[1];
													_moveWhiteboardItem(this,id);
												}
											}));

			// resize all new textarea notes
			text.css('height', text[0].scrollHeight / 2 + 'px');
			text.css('height', text[0].scrollHeight + 'px');
			text.css('height', 
					parseInt(text[0].css('height')) === 0 ?
							'17px': this.style.height);
		}

		function _editNote(_note, _id) {
			_text = $(_note).find('textarea[name=text]').val();

			cometd.publish('/service/note/edit/', {id:parseInt(_id),text:_text,
				whiteboardid : parseInt($('.whiteboard').attr('data-whiteboard-id'))}
			);
		}

		// edits a whiteboardItem
		function _moveWhiteboardItem(_whiteboardItem, _id) {
			_x = $(_whiteboardItem).css('left').substr(0,$(_whiteboardItem).css('left').length - 2);
			_y = $(_whiteboardItem).css('top').substr(0,$(_whiteboardItem).css('top').length - 2);

			cometd.publish('/service/whiteboardItem/move', {id:parseInt(_id),x:parseInt(_x),y:parseInt(_y),
				whiteboardid : parseInt($('.whiteboard').attr('data-whiteboard-id'))}
			);
		}

		function _reportProgressStateWhiteboardItem(_id, _inProgress) {
			cometd.publish('/service/whiteboardItem/progress', {
				id : parseInt(_id),
				inProgress : Boolean(_inProgress),
				whiteboardid : parseInt($('.whiteboard').attr('data-whiteboard-id'))
			});
		}

		// updates a note
		function _handleUpdatedNote(message) {
			if (activeNoteId == message.data.id) {
				return null;
			}
			note = $('#note-' + message.data.id);
			if (note.length == 0) {

			} else {
				note.find('textarea[name=text]').val(message.data.text);
				note.find('textarea[name=text]').elasticArea();
			}
		}

		//updates a moved whiteboarditem
		function _handleMovedWhiteboardItem(message){
			_id = message.data.id;
			_x = message.data.x;
			_y = message.data.y;

			if (activeNoteId == _id) {
				return null;
			}

			whiteboardItem = null;
			note = $('#note-' + _id);

			if (note.length != 0) {
				whiteboardItem  = note;
			}
			else{
				attachment = $('#attachment-' + _id);
				if(attachment.length != 0){
					whiteboardItem = attachment;
				}
			}

			if(whiteboardItem==null){
				return null;
			}else{
				whiteboardItem.css('left', _x).css('top', _y);
			}
		}

		function _handleProgressedWhiteboardItem(message) {
			_id = message.data.id;

			whiteboardItem = null;
			note = $('#note-' + _id);

			if (note.length != 0) {
				whiteboardItem  = note;
			}
			else{
				attachment = $('#attachment-' + _id);
				if(attachment.length != 0){
					whiteboardItem = attachment;
				}
			}

			if (whiteboardItem==null) {
				return null;
			}else{
				locked = $(whiteboardItem).find('.locked');
				if (locked.length == 0) {
					locked = $('<img/>')
							.attr('class', 'locked').attr(
									'src',
									'../images/locked.png');
					whiteboardItem.append(locked);
				}
				if (message.data.inProgress == false) {
					locked.css('display', 'none');
				} else {
					locked.css('display', 'block');
				}
			}
		}

		function _handlePostedAttachment(message){
			console.log("_handlePostedAttachment");
			_id = message.data.id;
			_creator = message.data.creator;
			_filename = message.data.filename;
			_shortDescription = message.data.text;
			_x = message.data.x;
			_y = message.data.y;
			_uid = message.data.uid;
			
			console.log(_id+' '+_creator+' '+_filename+' '+_shortDescription+' '+_x+' '+_y);

			var ext = _filename.split('.').pop();
			var basePath = $('.whiteboard').attr('data-context-path');
			var imgPath = basePath+"/images/teambox-free-file-icons/32px/"+ext+".png";
			console.log(imgPath);
			var template = '<div class="note"><p><img src="'+basePath+'/images/stop.gif"/></p><p id="filename"></p><textarea name="text"/><span class="creator"></span></div>';
			var view = $(template);

			var filename = $('#filename',view);
			//filename.prepend(_filename);
			

			var shortDescription = $('textarea',view);
			shortDescription.html(_shortDescription);

			var creator = $('.creator',view);
			creator.html(_creator);
			view.attr('id','attachment-'+_id);
			view.draggable({
							stop : function(e, ui) {
								var id = $(this).attr('id').split('-')[1];
								_moveWhiteboardItem(this,id);
							}});
			$('.whiteboard').append(view);
			
			if(activeUpload!=null && _uid===activeUpload[1]){
				_uploadFile(_id);
			}
		}
		
		function _uploadFile(id){
			form = activeUpload[0];
			
			$('#fileupload #uploadId').val(id);
			
			$('#fileupload').submit();
			$('#uploadFrame').load(function(){
				var attachment = eval("(" +$(this).contents().find("pre").text()+ ")");
				cometd.publish('/service/attachment/complete', {
					id : attachment['id'],
					whiteboardid : parseInt($('.whiteboard').attr('data-whiteboard-id'))
				});
			});
			
			activeUpload = null;
		}
		
		function _handleUploadCompleteAttachment(message){
			var ext = message.data.filename.split('.').pop();
			var basePath = $('.whiteboard').attr('data-context-path');
			var imgPath = basePath+"/images/teambox-free-file-icons/32px/"+ext+".png";
			$('#attachment-'+message.data.id+ ' img').attr('src', imgPath);
			var attachment = $('#attachment-'+message.data.id);
			attachment.append('<a/>');
			var link = $('a',attachment);
			link.attr('href',basePath+"/attachment/"+message.data.id+"/"+message.data.filename+"/download.htm");
			link.html('download');
		}

		function _postAttachment(form){
			_creator = $('creator',form).val();
			_x = 100;
			_y = 125;
			_text = $('textarea[name=shortDescription]',form).val();
			_filename = $('input[type="file"]',form).val();
			
			cometd.publish('/service/attachment/post/', {
				creator : _creator,
				filename : _filename,
				x : parseInt(_x),
				y : parseInt(_y),
				text : _text,
				whiteboardid : parseInt($('.whiteboard').attr('data-whiteboard-id')),
				uid : activeUpload[1]
			});
		}

		// Function that manages the connection status with the
		// Bayeux server
		var _connected = false;
		function _metaConnect(message) {
			if (cometd.isDisconnected()) {
				_connected = false;
				return;
			}

		}

		// Function invoked when first contacting the server and
		// when the server has lost the state of this client
		function _metaHandshake(handshake) {
			if (handshake.successful === true) {
				cometd.batch(function() {
					cometd.subscribe('/note/posted/'+ $('.whiteboard').attr('data-whiteboard-id'),_handlePostedNote);
					cometd.subscribe('/note/edited/'+$('.whiteboard').attr('data-whiteboard-id'),_handleUpdatedNote);
					cometd.subscribe('/whiteboardItem/move/'+$('.whiteboard').attr('data-whiteboard-id'),_handleMovedWhiteboardItem);
					cometd.subscribe('/whiteboardItem/progress/'+$('.whiteboard').attr('data-whiteboard-id'),_handleProgressedWhiteboardItem);
					cometd.subscribe('/attachment/posted/'+$('.whiteboard').attr('data-whiteboard-id'),_handlePostedAttachment);
					cometd.subscribe('/attachment/upload/complete/'+$('.whiteboard').attr('data-whiteboard-id'),_handleUploadCompleteAttachment);
				});
			}
		}

		// Disconnect when the page unloads
		$(window).unload(function() {
			cometd.disconnect(true);
		});

		var cometURL = location.protocol + "//" + location.host
				+ $('.whiteboard').attr('data-context-path')
				+ "/cometd";
		cometd.configure({
			url : cometURL,
			logLevel : 'info'
		});

		cometd.addListener('/meta/handshake', _metaHandshake);
		cometd.addListener('/meta/connect', _metaConnect);
		cometd.handshake();

		// mark note as in progress
		$('.note input[type=text], .note textarea').live(
				'focus',
				function() {
					clickedNote = $(this).parent();
					divId = clickedNote.attr("id");
					if (divId != undefined) {
						id = divId.split('-')[1];
						_reportProgressStateWhiteboardItem(id, true);
					}

					activeNoteId = id;
					saveInterval = window.setInterval(
							function() {
								_editNote(clickedNote, id);
							}, 500);
				});

		$('.note input[type=text], .note textarea').live(
				'blur', function() {
					clickedNote = $(this).parent();
					divId = clickedNote.attr("id");
					if (divId != undefined) {
						id = divId.split('-')[1];
						_reportProgressStateWhiteboardItem(id, false);
					}
					activeNoteId = null;
					window.clearInterval(saveInterval);
					_editNote(clickedNote, id);
				});

		// new note
		$('.bottomNavigation .right .createNote').click(
				function() {
					posx = Math.floor(Math.random() * 700);
					posy = Math.floor(Math.random() * 400);

					_postNote(posx, posy);
				});

		/*
		 * elastic textarea
		 */
		jQuery.fn.elasticArea = function() {
			return this.each(function() {
						function resizeTextarea() {
							this.style.height = this.scrollHeight
									/ 2 + 'px';
							this.style.height = this.scrollHeight
									+ 'px';
							this.style.height = this.style.height === '0px' ? '17px'
									: this.style.height;
						}
						$(this).keypress(resizeTextarea)
								.keydown(resizeTextarea).keyup(
										resizeTextarea).css(
										'overflow', 'hidden');
						resizeTextarea.call(this);
					});
		};

		$(".whiteboard .note").draggable({
			stop : function(e, ui) {
				var id = $(this).attr('id').split('-')[1];
				_moveWhiteboardItem(this, id);
			}
		});
		$('.note').find('textarea').elasticArea();
		$('.note textarea').hover(
				function() {
					$(this).parent().find('span.creator').css(
							'display', 'block');
				},
				function() {
					$(this).parent().find('span.creator').css(
							'display', 'none');
				});

		$('#upload-dialog').dialog({
			autoOpen : false,
			modal : true,
			width : 400,
			title : "File Upload"
		});

		$('a.uploadFile').live(
			'click',
			function(e) {
				e.preventDefault();
				$('#upload-dialog > form > ul > li')
						.not(":first-child")
						.remove();
				$(
						'#upload-dialog > form > ul > li:first-child > input[type="file"]')
						.val("");
				$('#upload-dialog').dialog('open');
				$('#upload-dialog').css('min-height', '142px');
				$('#upload-dialog').css('height', 'auto');
			}
		);

		$('#upload-dialog > form > button').live(
			'click',
			function(e) {
				toClone = $(
						'#upload-dialog > form > ul > li:first-child')
						.clone();
				toClone.find('input[type="file"]')
						.val("");
				toClone
						.appendTo('#upload-dialog > form > ul');
			}
		);

		$('#fileupload input[type=submit]').click(function(event) {
			$('#upload-dialog').dialog('close');
			event.preventDefault();
			
			activeUpload = [$('#fileupload'),new Date().getTime()];
			console.log(activeUpload);
			_postAttachment($('#fileupload'));
		});

	});

})(jQuery);