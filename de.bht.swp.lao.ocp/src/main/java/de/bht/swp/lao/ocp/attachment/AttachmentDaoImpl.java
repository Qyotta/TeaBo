package de.bht.swp.lao.ocp.attachment;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.transaction.annotation.Transactional;

import de.bht.swp.lao.ocp.whiteboarditem.IWhiteboardItemDao;
import de.bht.swp.lao.ocp.whiteboarditem.WhiteboardItem;

public class AttachmentDaoImpl implements IWhiteboardItemDao {

	@PersistenceContext
	private EntityManager em;
	
	@Override
	public WhiteboardItem findById(Long id) {
		return em.find(Attachment.class, id);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<WhiteboardItem> findAll() {
		return (List<WhiteboardItem>)em.createQuery("from Attachment n ").getResultList();
	}

	@Override
	@Transactional
	public void save(WhiteboardItem whiteboardItem) {
		if(whiteboardItem.getId()!=null){
			em.merge(whiteboardItem);
		}else{
			em.persist(whiteboardItem);
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<WhiteboardItem> findAllbyWhiteboardId(Long id) {
		return em.createQuery("from Attachment n where n.whiteboard.id=?1").setParameter(1, id).getResultList();
	}

}
