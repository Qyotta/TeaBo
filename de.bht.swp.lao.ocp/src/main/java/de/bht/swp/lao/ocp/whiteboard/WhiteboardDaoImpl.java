package de.bht.swp.lao.ocp.whiteboard;

import java.util.HashSet;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.transaction.annotation.Transactional;

import de.bht.swp.lao.ocp.user.User;
import de.bht.swp.lao.ocp.whiteboarditem.WhiteboardItem;

public class WhiteboardDaoImpl implements WhiteboardDao{
	
	@PersistenceContext
	private EntityManager em;
	
	@Override
	public Whiteboard findById(Long id) {
		return em.find(Whiteboard.class, id);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Whiteboard> findAll() {
		return (List<Whiteboard>)em.createQuery("from Whiteboard w").getResultList();
	}

	@Override
	@Transactional
	public void save(Whiteboard whiteboard) {
		em.persist(whiteboard);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Whiteboard> findByOwner(User user){
		return (List<Whiteboard>)em.createQuery("from Whiteboard w where w.owner.id=?1").setParameter(1, user.getId()).getResultList();
	}
	
	@Override
	@Transactional
	public void delete(Whiteboard whiteboard) {
		Whiteboard w=em.find(Whiteboard.class, whiteboard.getId());
		for(WhiteboardItem n:w.getWhiteboardObjects()) {
			em.remove(n);
		}
		for(User u:w.getAssignedUsers()){
			u.removeAssignedWhiteboard(w);
			em.merge(u);
		}

		w.setAssignedUsers(new HashSet<User>());
		em.merge(w);
		em.remove(w);
	}
	
}
