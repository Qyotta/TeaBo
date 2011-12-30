package de.bht.swp.lao.ocp.whiteboarditem;

import java.util.List;

public interface IWhiteboardItemDao<T extends WhiteboardItem> {
	public T findById(Long id);
	public List<T> findAll();
	public void save(T whiteboardItem);
	public List<T> findAllbyWhiteboardId(Long id);
}
