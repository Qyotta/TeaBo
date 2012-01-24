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

import de.bht.swp.lao.ocp.usermanagement.IUserDao;
import de.bht.swp.lao.ocp.usermanagement.User;
import de.bht.swp.lao.ocp.whiteboard.IWhiteboardDao;
import de.bht.swp.lao.ocp.whiteboard.Whiteboard;
import de.bht.swp.lao.ocp.whiteboarditem.IWhiteboardItemDao;

@Named
@Singleton
@Service("noteService")
public class NoteService {

  @Inject
  private BayeuxServer bayeux;

  @Session
  private ServerSession serverSession;

  @Inject
  private IWhiteboardItemDao<Note> noteDao;

  @Inject
  private IWhiteboardDao whiteboardDao;

  @Inject
  private IUserDao userDao;

  @Listener(value = { "/service/note/post/" })
  public void processPost(ServerSession remote, ServerMessage.Mutable message) {
    Map<String, Object> data = message.getDataAsMap();

    String creator = (String) data.get("creator");
    Long whiteboardid = (Long) data.get("whiteboardid");
    Long x = (Long) data.get("x");
    Long y = (Long) data.get("y");

    // Create a new Note
    Note note = new Note();
    note.setX(x);
    note.setY(y);

    User user = userDao.findByEmail(creator);
    note.setCreator(user);

    Whiteboard w = whiteboardDao.findById(whiteboardid);
    note.setWhiteboard(w);

    // Persist the created Note
    noteDao.save(note);

    Map<String, Object> output = new HashMap<String, Object>();

    output.put("id", note.getId());
    output.put("x", x);
    output.put("y", y);
    output.put("creator", creator);

    String channel = "/note/posted/" + whiteboardid;
    for (ServerSession session : bayeux.getChannel(channel).getSubscribers()) {
      session.deliver(serverSession, channel, output, null);
    }
  }

  @Listener(value = { "/service/note/edit/" })
  public void processEdit(ServerSession remote, ServerMessage.Mutable message) {
    Map<String, Object> data = message.getDataAsMap();

    Long id = (Long) data.get("id");
    String text = (String) data.get("text");

    Note note = noteDao.findById(id);
    note.setText(text);

    noteDao.save(note);

    Map<String, Object> output = new HashMap<String, Object>();

    output.put("id", id);

    output.put("text", text);

    String channel = "/note/edited/" + data.get("whiteboardid");

    for (ServerSession session : bayeux.getChannel(channel).getSubscribers()) {
      session.deliver(serverSession, channel, output, null);
    }
  }

}
