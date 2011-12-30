package de.bht.swp.lao.ocp.whiteboard;

import java.util.List;

import de.bht.swp.lao.ocp.user.User;

public interface IWhiteboardDao {
	public Whiteboard findById(Long id);
	public List<Whiteboard> findAll();
	public void save(Whiteboard whiteboard);
	public void delete(Whiteboard whiteboard);
	public List<Whiteboard> findByOwner(User user);
}
