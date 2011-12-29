package de.bht.swp.lao.ocp.whiteboarditem;

import java.util.List;

public interface IWhiteboardItemDao {
	public WhiteboardItem findById(Long id);
	public List<WhiteboardItem> findAll();
	public void save(WhiteboardItem whiteboardItem);
	public List<WhiteboardItem> findAllbyWhiteboardId(Long id);
}
