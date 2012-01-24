var cometd = $.cometd;

$(function() {
    // Function that manages the connection status with the
    // Bayeux server
    // TODO do we need this _connected var?
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
                cometd.subscribe('/whiteboardItem/order/'+$('.whiteboard').attr('data-whiteboard-id'), _handleForegroundWhiteboardItem);
                cometd.subscribe('/attachment/posted/'+$('.whiteboard').attr('data-whiteboard-id'),_handlePostedAttachment);
                cometd.subscribe('/attachment/upload/complete/'+$('.whiteboard').attr('data-whiteboard-id'),_handleUploadCompleteAttachment);
                cometd.subscribe('/attachment/upload/remove/'+$('.whiteboard').attr('data-whiteboard-id'),_handleUploadFailedAttachment);
            });
        }
    }

    // Disconnect when the page unloads
    $(window).unload(function() {
        cometd.disconnect(true);
    });

    var cometURL = location.protocol + "//" + location.host + $('.whiteboard').attr('data-context-path') + "/cometd";
    cometd.configure({
        url : cometURL,
        logLevel : 'info'
    });

    cometd.addListener('/meta/handshake', _metaHandshake);
    cometd.addListener('/meta/connect', _metaConnect);
    cometd.handshake();
});