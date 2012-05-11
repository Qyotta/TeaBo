package de.bht.swp.lao.ocp.whiteboard;

import java.awt.Color;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import javax.inject.Inject;
import javax.inject.Named;
import javax.inject.Singleton;

import org.cometd.bayeux.server.BayeuxServer;
import org.cometd.bayeux.server.ConfigurableServerChannel;
import org.cometd.bayeux.server.ServerMessage;
import org.cometd.bayeux.server.ServerSession;
import org.cometd.java.annotation.Listener;
import org.cometd.java.annotation.Service;
import org.cometd.java.annotation.Session;

/**
 * This class is providing channels for cometd related to assignments.
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

	@Listener(value = { "/service/assignment/changeColor/" })
	public void processChangedColor(ServerSession remote, ServerMessage.Mutable message){
		Map<String, Object> data = message.getDataAsMap();
		Long assignmentId = (Long) data.get("assignmentId");
		
		Long r = (Long) data.get("color_r");
		Long g = (Long) data.get("color_g");
		Long b = (Long) data.get("color_b");

		Assignment assignment = assignmentDao.findByID(assignmentId);

		if (assignment != null) {
			assignment.setColor(new Color(r.intValue(),g.intValue(),b.intValue()));
			assignmentDao.saveOrUpdate(assignment);
		}
		
		Map<String, Object> output = new HashMap<String, Object>();
		output.put("id", assignment.getId());
		output.put("color_r", assignment.getColor().getRed());
		output.put("color_g", assignment.getColor().getGreen());
		output.put("color_b", assignment.getColor().getBlue());

		String wbId = assignment.getWhiteboard().getId().toString();
		String channel = "/assignment/change/color/" + wbId;
		System.out.println(channel);
		System.out.println(bayeux);
		
		bayeux.createIfAbsent(channel, new ConfigurableServerChannel.Initializer(){
		    public void configureChannel(ConfigurableServerChannel c)
		    {
		        c.setPersistent(true);
		    }
		});
		
		Set<ServerSession> sessions = bayeux.getChannel(channel).getSubscribers();
		System.out.println(sessions.size());
		
		for (ServerSession session : bayeux.getChannel(channel).getSubscribers()) {
			System.out.println(session.getId());
			session.deliver(serverSession, channel, output, null);
		}
		System.out.println("4");
	}

}
