package de.bht.swp.lao.ocp.whiteboarditem;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

public class WhiteboardItemDao implements IWhiteboardItemDao<WhiteboardItem> {
  private static final Logger LOGGER = LoggerFactory.getLogger(WhiteboardItemDao.class);

  @PersistenceContext
  private EntityManager em;

  @Override
  public WhiteboardItem findById(Long id) {
    return em.find(WhiteboardItem.class, id);
  }

  @SuppressWarnings("unchecked")
  @Override
  public List<WhiteboardItem> findAll() {
    return em.createQuery("from WhiteboardItem w").getResultList();
  }

  @Override
  @Transactional
  public void save(WhiteboardItem whiteboardItem) {
    if (whiteboardItem.getId() != null) {
      em.merge(whiteboardItem);
    } else {
      em.persist(whiteboardItem);
    }
  }

  @SuppressWarnings("unchecked")
  @Override
  public List<WhiteboardItem> findAllbyWhiteboardId(Long id) {
    return em.createQuery("from WhiteboardItem w where w.whiteboard.id=?1").setParameter(1, id).getResultList();
  }

  @Override
  public void delete(WhiteboardItem whiteboardItem) {
    LOGGER.error("delete(WhiteboardItem whiteboardItem) not implementeed");
  }

}
