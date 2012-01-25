package de.bht.swp.lao.ocp.usermanagement;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;

import org.springframework.transaction.annotation.Transactional;

public class UserDao implements IUserDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public User findById(Integer id) {
        return em.find(User.class, id);
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<User> findAll() {
        return em.createQuery("from User u").getResultList();
    }

    @Override
    public User findByEmail(String email) {
        try {
            return (User) em.createQuery("from User u where u.email = ?1").setParameter(1, email).getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    @Override
    @Transactional
    public void save(User user) {
        if (user != null) {
            em.merge(user);
        } else {
            em.persist(user);
        }
    }

}
