package de.bht.swp.lao.ocp.whiteboard;

import java.awt.Color;
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

/**
 * This class is providing channels for cometd related to notes.
 * 
 */
@Named
@Singleton
@Service("assignmentService")
public class AssignmentService {

  @Inject
  private BayeuxServer bayeux;

  @Session
  private ServerSession serverSession;

  @Inject
  private IAssignmentDao assignmentDao;

  @SuppressWarnings("unchecked")
  @Listener(value = { "/service/assignment/changeColor" })
  public void processPost(ServerSession remote, ServerMessage.Mutable message) {
    Map<String, Object> data = message.getDataAsMap();

    Long assignmentId = (Long) data.get("assignmentId");
    Map<String, Object> color = (Map<String, Object>) data.get("color");

    Color newColor = new Color(Integer.valueOf((String) color.get("r")), Integer.valueOf((String) color.get("g")),
        Integer.valueOf((String) color.get("b")));

    Assignment a = assignmentDao.findByID(assignmentId);

    if (a != null) {
      a.setColor(newColor);
      assignmentDao.saveOrUpdate(a);
    }

    Map<String, Object> output = new HashMap<String, Object>();

    output.put("id", a.getId());
    output.put("color", a.getColor().getRGBColorComponents(null));

    String channel = "/assignment/changedColor/" + a.getWhiteboard().getId();
    for (ServerSession session : bayeux.getChannel(channel).getSubscribers()) {
      session.deliver(serverSession, channel, output, null);
    }
  }

}
