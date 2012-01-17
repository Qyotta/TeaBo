package de.bht.swp.lao.ocp.note;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.transaction.annotation.Transactional;

import de.bht.swp.lao.ocp.whiteboarditem.IWhiteboardItemDao;

public class NoteDao implements IWhiteboardItemDao<Note> {

	@PersistenceContext
	private EntityManager em;
	
	@Override
	public Note findById(Long id) {
		return em.find(Note.class, id);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Note> findAll() {
		return (List<Note>)em.createQuery("from Note n ").getResultList();
	}

	@Override
	@Transactional
	public void save(Note whiteboardItem){ 
		if(whiteboardItem.getId()!=null){
			em.merge(whiteboardItem);
		}else{
			em.persist(whiteboardItem);
		}
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Note> findAllbyWhiteboardId(Long id) {
		return (List<Note>)em.createQuery("from Note n where n.whiteboard.id=?1").setParameter(1, id).getResultList();
	}
	
	
	@Override
	public void delete(Note whiteboardItem) {
		// TODO Auto-generated method stub
		
	}

}
