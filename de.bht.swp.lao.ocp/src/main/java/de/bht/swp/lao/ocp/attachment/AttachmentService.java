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

import de.bht.swp.lao.ocp.user.UserDao;
import de.bht.swp.lao.ocp.whiteboard.WhiteboardDao;
import de.bht.swp.lao.ocp.whiteboarditem.IWhiteboardItemDao;

@Named
@Singleton
@Service("attachmentService")
public class AttachmentService {
	@Inject
	private BayeuxServer bayeux;
	
	@Session
	private ServerSession serverSession;
	
	@Inject
	private IWhiteboardItemDao attachmentDao;
	
	@Inject
	private WhiteboardDao whiteboardDao;
	
	@Inject
	private UserDao userDao;
	
	@Listener(value = {"/service/attachment"})
	public void processAttachment(ServerSession remote, ServerMessage.Mutable message){
		Map<String,Object> data = message.getDataAsMap();
		
		Long id = (Long)data.get("id"); 
		String creator = (String)data.get("creator");
		String text = (String)data.get("text");
		Long x = (Long)data.get("x");
		Long y = (Long)data.get("y");
		Long whiteboardid = (Long)data.get("whiteboardid");
		
		Attachment attachment = null;
		if(id!=null){
			if (attachmentDao.findById(id) instanceof Attachment){
				attachment = (Attachment) attachmentDao.findById(id);
			}
		}
		else{
			attachment = new Attachment();
			attachment.setCreator(userDao.findByEmail(creator));
			attachment.setWhiteboard(whiteboardDao.findById(whiteboardid));
		}
		
		attachment.setX(x.intValue());
		attachment.setY(y.intValue());
		attachmentDao.save(attachment);
		
		Map<String,Object> output = new HashMap<String,Object>();
		output.put("id", attachment.getId());
		output.put("creator", attachment.getCreator().getEmail());
		output.put("text", text);
		output.put("x", x);
		output.put("y", y);
		
		String channel = "/attachment/"+whiteboardid;
		for(ServerSession session:bayeux.getChannel(channel).getSubscribers()){
			session.deliver(serverSession, channel, output, null);
		}
	}
}
