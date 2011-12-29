package de.bht.swp.lao.ocp.note;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.transaction.annotation.Transactional;

import de.bht.swp.lao.ocp.whiteboarditem.IWhiteboardItemDao;
import de.bht.swp.lao.ocp.whiteboarditem.WhiteboardItem;

public class NoteDaoImpl implements IWhiteboardItemDao {

	@PersistenceContext
	private EntityManager em;
	
	@Override
	public WhiteboardItem findById(Long id) {
		return em.find(Note.class, id);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<WhiteboardItem> findAll() {
		return (List<WhiteboardItem>)em.createQuery("from Note n ").getResultList();
	}

	@Override
	@Transactional
	public void save(WhiteboardItem whiteboardItem){ 
		if(whiteboardItem.getId()!=null){
			em.merge(whiteboardItem);
		}else{
			em.persist(whiteboardItem);
		}
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<WhiteboardItem> findAllbyWhiteboardId(Long id) {
		return (List<WhiteboardItem>)em.createQuery("from Note n where n.whiteboard.id=?1").setParameter(1, id).getResultList();
	}

}
