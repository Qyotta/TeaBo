package de.bht.swp.lao.ocp.whiteboard;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import de.bht.swp.lao.ocp.exceptions.OCPDBException;
import de.bht.swp.lao.ocp.user.User;

public class AssignmentDao implements IAssignmentDao {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(WhiteboardDao.class);

    @PersistenceContext
    private EntityManager em;

    @Override
    public Assignment findByID(Long id) {
        try {
            return em.find(Assignment.class, id);
        } catch (Exception e) {
            LOGGER.error("findById failed:", e);
            throw new OCPDBException("findById failed:", e);
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<Assignment> findAll() {
        try {
            return em.createQuery("from Asssignment a").getResultList();
        } catch (Exception e) {
            LOGGER.error("findAll failed:", e);
            throw new OCPDBException("findAll failed:", e);
        }
    }

    @Override
    @Transactional
    public void delete(Assignment assignment) {
        em.remove(assignment);
    }

    @Override
    @Transactional
    public void saveOrUpdate(Assignment assignment) {
        try {
            if (assignment.getId() == null) {
                em.persist(assignment);
            } else {
                em.merge(assignment);
            }
        } catch (Exception e) {
            LOGGER.error("Save failed:", e);
            throw new OCPDBException("Save failed:", e);
        }
    }

    @Override
    public List<Assignment> findByUser(User user) {
        // TODO Auto-generated method stub
        return null;
    }

}
