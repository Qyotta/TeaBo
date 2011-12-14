package de.bht.swp.lao.ocp.note;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.transaction.annotation.Transactional;

public class NoteDaoImpl implements NoteDao {

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
	public void save(Note note){ 
		if(note.getId()!=null){
			em.merge(note);
		}else{
			em.persist(note);
		}
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Note> findAllbyWhiteboardId(Long id) {
		return (List<Note>)em.createQuery("from Note n where n.whiteboard.id=?1").setParameter(1, id).getResultList();
	}

}
