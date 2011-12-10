package de.bht.swp.lao.ocp.user;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;

import org.springframework.transaction.annotation.Transactional;

public class UserDaoImpl implements UserDao {

	@PersistenceContext
	private EntityManager em;
	
	@Override
	public User findById(Integer id) {
		return em.find(User.class, id);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<User> findAll() {
		return (List<User>)em.createQuery("from User u").getResultList();
	}

	@Override
	public User findByEmail(String email) {
		User user = null;
		try
		{
			user =  (User)em.createQuery("from User u where u.email = ?1").setParameter(1, email).getSingleResult();
		}
		catch(NoResultException e){}
		
		return user;
	}

	@Override
	@Transactional
	public void save(User user) {
		em.persist(user);
	}

}
