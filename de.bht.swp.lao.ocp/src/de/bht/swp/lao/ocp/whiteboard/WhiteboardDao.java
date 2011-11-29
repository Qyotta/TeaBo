package de.bht.swp.lao.ocp.whiteboard;

import java.util.List;

public interface WhiteboardDao {
	public Whiteboard findById(Long id);
	public List<Whiteboard> findAll();
	public void save(Whiteboard whiteboard);
	public void delete(Whiteboard whiteboard);
}
