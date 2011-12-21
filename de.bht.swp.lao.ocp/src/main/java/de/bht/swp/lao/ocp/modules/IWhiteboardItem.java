package de.bht.swp.lao.ocp.modules;

import de.bht.swp.lao.ocp.user.User;
import de.bht.swp.lao.ocp.whiteboard.Whiteboard;

public interface IWhiteboardItem {
		
	public Whiteboard getWhiteboard();
	public void setWhiteboard(Whiteboard whiteboard);
	public Integer getX();
	public void setX(Integer x);
	public Integer getY();
	public void setY(Integer y);
	public User getCreator();
	public void setCreator(User creator);
	public Long getId();
	public void setId(Long id);
}
