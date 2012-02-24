package de.bht.swp.lao.ocp.attachment;

import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.inject.Named;
import javax.inject.Singleton;

import org.cometd.bayeux.server.BayeuxServer;
import org.cometd.bayeux.server.ServerMessage;
import org.cometd.bayeux.server.ServerSession;
import org.cometd.java.annotation.Listener;
import org.cometd.java.annotation.Service;
import org.cometd.java.annotation.Session;

import de.bht.swp.lao.ocp.auth.IUserDao;
import de.bht.swp.lao.ocp.auth.User;
import de.bht.swp.lao.ocp.whiteboard.IWhiteboardDao;
import de.bht.swp.lao.ocp.whiteboard.Whiteboard;
import de.bht.swp.lao.ocp.whiteboarditem.IWhiteboardItemDao;

/**
 * This class is providing channels for cometd related to attachments
 */
@Named
@Singleton
@Service("attachmentService")
public class AttachmentService {
    @Inject
    private BayeuxServer bayeux;

    @Session
    private ServerSession serverSession;

    @Inject
    private IWhiteboardItemDao<Attachment> attachmentDao;

    @Inject
    private IWhiteboardDao whiteboardDao;

    @Inject
    private IUserDao userDao;

    /**
     * This method notifies all users about an completed upload via cometd
     * channel('/attachment/upload/complete/<whiteboardid>')
     * 
     * @param remote
     * @param message
     */
    @Listener(value = { "/service/attachment/complete" })
    public void completeUpload(ServerSession remote,
            ServerMessage.Mutable message) {
        Map<String, Object> data = message.getDataAsMap();

        Long id = (Long) data.get("id");
        Long whiteboardid = (Long) data.get("whiteboardid");

        Attachment attachment = attachmentDao.findById(id);

        attachment.setUploaded(true);

        attachmentDao.save(attachment);

        Map<String, Object> output = new HashMap<String, Object>();
        output.put("id", id);
        output.put("filename", attachment.getFilename());
        output.put("creatoremail", attachment.getCreator().getEmail());
        output.put("description", attachment.getShortDescription());
        output.put("uploaded", true);

        String channel = "/attachment/upload/complete/" + whiteboardid;
        for (ServerSession session : bayeux.getChannel(channel)
                .getSubscribers()) {
            session.deliver(serverSession, channel, output, null);
        }
    }

    /**
     * Persists the posted attachment and delivers it via cometd
     * channel('/attachment/posted/<whiteboardid>').
     * 
     * @param remote
     * @param message
     */
    @Listener(value = { "/service/attachment/post/" })
    public void processPost(ServerSession remote, ServerMessage.Mutable message) {
        Map<String, Object> data = message.getDataAsMap();

        String creator = (String) data.get("creator");
        String filename = (String) data.get("filename");
        String text = (String) data.get("text");
        Long x = (Long) data.get("x");
        Long y = (Long) data.get("y");
        Long whiteboardid = (Long) data.get("whiteboardid");
        Long uid = (Long) data.get("uid");

        Attachment attachment = new Attachment();
        attachment.setShortDescription(text);
        attachment.setX(x);
        attachment.setY(y);
        attachment.setFilename(filename);

        User user = userDao.findByEmail(creator);
        attachment.setCreator(user);

        Whiteboard w = whiteboardDao.findById(whiteboardid);
        attachment.setWhiteboard(w);

        attachmentDao.save(attachment);

        Map<String, Object> output = new HashMap<String, Object>();
        output.put("id", attachment.getId());
        output.put("creator", creator);
        output.put("text", text);
        output.put("x", x);
        output.put("y", y);
        output.put("filename", filename);
        output.put("uid", uid);

        String channel = "/attachment/posted/" + whiteboardid;
        for (ServerSession session : bayeux.getChannel(channel)
                .getSubscribers()) {
            session.deliver(serverSession, channel, output, null);
        }
    }

    /**
     * This method notifies the clients about an removed attachment via cometd
     * channel('/attachment/upload/remove/<whiteboardid>').
     * 
     * @param remote
     * @param message
     */
    @Listener(value = { "/service/attachment/remove" })
    public void failedUpload(ServerSession remote, ServerMessage.Mutable message) {
        Map<String, Object> data = message.getDataAsMap();

        Long id = (Long) data.get("id");
        Long whiteboardid = (Long) data.get("whiteboardid");

        Map<String, Object> output = new HashMap<String, Object>();
        output.put("id", id);
        output.put("uploaded", false);

        String channel = "/attachment/upload/remove/" + whiteboardid;
        for (ServerSession session : bayeux.getChannel(channel)
                .getSubscribers()) {
            session.deliver(serverSession, channel, output, null);
        }
    }
}