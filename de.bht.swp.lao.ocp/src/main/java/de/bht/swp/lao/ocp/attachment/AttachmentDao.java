package de.bht.swp.lao.ocp.attachment;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.transaction.annotation.Transactional;

import de.bht.swp.lao.ocp.whiteboard.Whiteboard;
import de.bht.swp.lao.ocp.whiteboarditem.IWhiteboardItemDao;

public class AttachmentDao implements IWhiteboardItemDao<Attachment> {

	@PersistenceContext
	private EntityManager em;

	@Override
	public Attachment findById(Long id) {
		return em.find(Attachment.class, id);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Attachment> findAll() {
		return (List<Attachment>) em.createQuery("from Attachment n ")
				.getResultList();
	}

	@Override
	@Transactional
	public void save(Attachment whiteboardItem) {
		if (whiteboardItem.getId() != null) {
			em.merge(whiteboardItem);
		} else {
			em.persist(whiteboardItem);
		}
	}

	@Override
	@Transactional
	public void delete(Attachment whiteboardItem) {
		Attachment a=em.find(Attachment.class, whiteboardItem.getId());
		if (whiteboardItem.getId() != null) {
			em.merge(a);
			em.remove(a);
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Attachment> findAllbyWhiteboardId(Long id) {
		return em.createQuery("from Attachment n where n.whiteboard.id=?1")
				.setParameter(1, id).getResultList();
	}

}
