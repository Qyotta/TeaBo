package de.bht.swp.lao.ocp.whiteboard;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import de.bht.swp.lao.ocp.exceptions.OCPDBException;
import de.bht.swp.lao.ocp.usermanagement.User;
import de.bht.swp.lao.ocp.whiteboarditem.WhiteboardItem;

public class WhiteboardDao implements IWhiteboardDao {

    private static final Logger LOGGER = LoggerFactory.getLogger(WhiteboardDao.class);

    @PersistenceContext
    private EntityManager em;

    @Override
    public Whiteboard findById(Long id) {
        try {
            return em.find(Whiteboard.class, id);
        } catch (Exception e) {
            LOGGER.error("findById failed:", e);
            throw new OCPDBException("findById failed:", e);
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<Whiteboard> findAll() {
        try {
            return em.createQuery("from Whiteboard w").getResultList();
        } catch (Exception e) {
            LOGGER.error("findAll failed:", e);
            throw new OCPDBException("findAll failed:", e);
        }
    }

    @Override
    @Transactional
    public void saveOrUpdate(Whiteboard whiteboard) {
        try {
            if (whiteboard.getId() == null) {
                em.persist(whiteboard);
            } else {
                em.merge(whiteboard);
            }
        } catch (Exception e) {
            LOGGER.error("Save failed:", e);
            throw new OCPDBException("Save failed:", e);
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<Whiteboard> findByOwner(User user) {
        try {
            return em.createQuery("from Whiteboard w where w.owner.id=?1").setParameter(1, user.getId())
                    .getResultList();
        } catch (Exception e) {
            LOGGER.error("findByOwner failed:", e);
            throw new OCPDBException("findByOwner failed:", e);
        }
    }

    @Override
    @Transactional
    public void delete(Whiteboard whiteboard) {
        try {
            Whiteboard w = em.find(Whiteboard.class, whiteboard.getId());
            for (WhiteboardItem n : w.getWhiteboardObjects()) {
                em.remove(n);
            }
            for (User u : w.getAssignedUsers()) {
                u.removeAssignedWhiteboard(w);
                em.merge(u);
            }

            em.remove(w);
            
        } catch (Exception e) {
            LOGGER.error("delete failed:", e);
            throw new OCPDBException("delete failed:", e);
        }
    }

}
