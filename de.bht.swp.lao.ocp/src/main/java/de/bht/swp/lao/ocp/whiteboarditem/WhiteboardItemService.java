package de.bht.swp.lao.ocp.whiteboarditem;

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

@Named
@Singleton
@Service("whiteboardItemService")
public class WhiteboardItemService {
    @Inject
    private BayeuxServer bayeux;

    @Session
    private ServerSession serverSession;

    @Inject
    private IWhiteboardItemDao<WhiteboardItem> whiteboardItemDao;

    @Listener(value = { "/service/whiteboardItem/move" })
    public void processMove(ServerSession remote, ServerMessage.Mutable message) {
        Map<String, Object> data = message.getDataAsMap();

        Long id = (Long) data.get("id");
        Long x = (Long) data.get("x");
        Long y = (Long) data.get("y");
        Long whiteboardid = (Long) data.get("whiteboardid");

        WhiteboardItem wi = whiteboardItemDao.findById(id);
        wi.setX(x);
        wi.setY(y);

        whiteboardItemDao.save(wi);

        Map<String, Object> output = new HashMap<String, Object>();
        output.put("id", id);
        output.put("x", x);
        output.put("y", y);

        String channel = "/whiteboardItem/move/" + whiteboardid;
        for (ServerSession session : bayeux.getChannel(channel).getSubscribers()) {
            session.deliver(serverSession, channel, output, null);
        }
    }

    @Listener(value = { "/service/whiteboardItem/progress" })
    public void processProgress(ServerSession remote, ServerMessage.Mutable message) {
        Map<String, Object> data = message.getDataAsMap();

        Long id = (Long) data.get("id");
        Boolean inProgress = (Boolean) data.get("inProgress");
        Long whiteboardid = (Long) data.get("whiteboardid");

        WhiteboardItem item = whiteboardItemDao.findById(id);
        item.setInProgress(inProgress);
        whiteboardItemDao.save(item);

        Map<String, Object> output = new HashMap<String, Object>();
        output.put("id", id);
        output.put("inProgress", inProgress);

        String channel = "/whiteboardItem/progress/" + whiteboardid;
        for (ServerSession session : bayeux.getChannel(channel).getSubscribers()) {
            session.deliver(serverSession, channel, output, null);
        }
    }

    @Listener(value = { "/service/whiteboardItem/order" })
    public void processOrder(ServerSession remote, ServerMessage.Mutable message) {

        Map<String, Object> data = message.getDataAsMap();

        Long id = (Long) data.get("id");
        Long whiteboardid = (Long) data.get("whiteboardid");

        WhiteboardItem item = whiteboardItemDao.findById(id);

        item.setOrderIndex(whiteboardItemDao.getHighestOrderIndexByWhiteboardId(whiteboardid) + 1);
        whiteboardItemDao.save(item);

        Map<String, Object> output = new HashMap<String, Object>();
        output.put("id", item.getClass().getSimpleName().toLowerCase() + "-" + id);
        output.put("newIndex", item.getOrderIndex());

        String channel = "/whiteboardItem/order/" + whiteboardid;
        for (ServerSession session : bayeux.getChannel(channel).getSubscribers()) {
            session.deliver(serverSession, channel, output, null);
        }
    }

}
