package de.bht.swp.lao.ocp.whiteboarditem;

import java.util.List;

public interface IWhiteboardItemDao<T extends WhiteboardItem> {
  T findById(Long id);

  List<T> findAll();

  void save(T whiteboardItem);

  void delete(T whiteboardItem);

  List<T> findAllbyWhiteboardId(Long id);
}
