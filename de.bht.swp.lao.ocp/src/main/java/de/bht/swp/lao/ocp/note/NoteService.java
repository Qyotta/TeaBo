package de.bht.swp.lao.ocp.note;

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

@Named
@Singleton
@Service("noteService")
public class NoteService {
	
	@Inject
	private BayeuxServer bayeux;
	
	@Session
	private ServerSession serverSession;
	
	@Inject
	private NoteDao noteDao;
	
	@Inject
	private WhiteboardDao whiteboardDao;
	
	@Inject
	private UserDao userDao;
	
	@Listener(value = {"/service/note"})
	public void processNote(ServerSession remote, ServerMessage.Mutable message){
		Map<String,Object> data = message.getDataAsMap();
		
		Long id = (Long)data.get("id"); 
		String creator = (String)data.get("creator");
		String title = (String)data.get("title");
		String text = (String)data.get("text");
		Long x = (Long)data.get("x");
		Long y = (Long)data.get("y");
		Long whiteboardid = (Long)data.get("whiteboardid");
		
		Note note = null;
		if(id!=null){
			note = noteDao.findById(id);
		}
		else{
			note = new Note();
			note.setCreator(userDao.findByEmail(creator));
			note.setWhiteboard(whiteboardDao.findById(whiteboardid));
		}
		
		note.setTitle(title);
		note.setText(text);
		note.setX(x.intValue());
		note.setY(y.intValue());
		noteDao.save(note);
		
		Map<String,Object> output = new HashMap<String,Object>();
		output.put("id", note.getId());
		output.put("creator", note.getCreator().getEmail());
		output.put("title", title);
		output.put("text", text);
		output.put("x", x);
		output.put("y", y);
		
		String channel = "/note/"+whiteboardid;
		for(ServerSession session:bayeux.getChannel(channel).getSubscribers()){
			session.deliver(serverSession, channel, output, null);
		}
	}
	
	@Listener(value = {"/service/note/setProgress"})
	public void setProgress(ServerSession remote, ServerMessage.Mutable message){
		Map<String,Object> data = message.getDataAsMap();
		
		Long id = (Long)data.get("id"); 
		Boolean inProgress = (Boolean)data.get("inProgress");
		Long whiteboardid = (Long)data.get("whiteboardid");
		
		Note note = noteDao.findById(id);
		note.setInProgress(inProgress);
		noteDao.save(note);
		
		Map<String,Object> output = new HashMap<String,Object>();
		output.put("id", note.getId());
		output.put("inProgress", note.isInProgress());
		
		
		String channel = "/note/"+whiteboardid+"/progress";
		for(ServerSession session:bayeux.getChannel(channel).getSubscribers()){
			session.deliver(serverSession, channel, output, null);
		}
	}
}
