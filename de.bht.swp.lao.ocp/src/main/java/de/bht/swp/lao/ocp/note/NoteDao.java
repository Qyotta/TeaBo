package de.bht.swp.lao.ocp.note;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import de.bht.swp.lao.ocp.whiteboarditem.IWhiteboardItemDao;

public class NoteDao implements IWhiteboardItemDao<Note> {
  private static final Logger LOGGER = LoggerFactory.getLogger(NoteDao.class);

  @PersistenceContext
  private EntityManager em;

  @Override
  public Note findById(Long id) {
    return em.find(Note.class, id);
  }

  @SuppressWarnings("unchecked")
  @Override
  public List<Note> findAll() {
    return em.createQuery("from Note n ").getResultList();
  }

  @Override
  @Transactional
  public void save(Note whiteboardItem) {
    if (whiteboardItem.getId() != null) {
      em.merge(whiteboardItem);
    } else {
      em.persist(whiteboardItem);
    }

  @SuppressWarnings("unchecked")
  @Override
  public List<Note> findAllbyWhiteboardId(Long id) {
    return em.createQuery("from Note n where n.whiteboard.id=?1").setParameter(1, id).getResultList();
  }

  @Override
  public void delete(Note whiteboardItem) {
    LOGGER.error("delete(Note whiteboardItem) not implementeed");
  }
  
  @SuppressWarnings("unchecked")
 	@Override
 	public Note findByAttribute(String key, String value) {
 		return (Note)em.createQuery("from Note w where w.?1=?2").setParameter(1, key).setParameter(2, value).getSingleResult();
 	}

}
