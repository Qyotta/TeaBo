package de.bht.swp.lao.ocp.modules.note;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.transaction.annotation.Transactional;

import de.bht.swp.lao.ocp.modules.IWhiteboardItemDao;
import de.bht.swp.lao.ocp.modules.WhiteboardObject;

public class NoteDaoImpl implements IWhiteboardItemDao {

	@PersistenceContext
	private EntityManager em;
	
	@Override
	public WhiteboardObject findById(Long id) {
		return em.find(Note.class, id);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<WhiteboardObject> findAll() {
		return (List<WhiteboardObject>)em.createQuery("from Note n ").getResultList();
	}

	@Override
	@Transactional
	public void save(WhiteboardObject whiteboardObject){ 
		if(whiteboardObject.getId()!=null){
			em.merge(whiteboardObject);
		}else{
			em.persist(whiteboardObject);
		}
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<WhiteboardObject> findAllbyWhiteboardId(Long id) {
		return (List<WhiteboardObject>)em.createQuery("from Note n where n.whiteboard.id=?1").setParameter(1, id).getResultList();
	}

}
