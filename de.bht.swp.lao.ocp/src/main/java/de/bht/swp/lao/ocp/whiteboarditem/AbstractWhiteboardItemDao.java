package de.bht.swp.lao.ocp.whiteboarditem;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import de.bht.swp.lao.ocp.exceptions.OCPDBException;

public abstract class AbstractWhiteboardItemDao<T extends WhiteboardItem> implements IWhiteboardItemDao<T> {

    @PersistenceContext
    protected EntityManager em;

    public abstract Class<T> getType();

    public Logger getLogger() {
        return LoggerFactory.getLogger(getType());
    }

    @SuppressWarnings("unchecked")
    @Override
    public T findById(Long id) {
        try {
            return (T) em.find(WhiteboardItem.class, id);
        } catch (Exception e) {
            getLogger().error("Save failed:", e);
            throw new OCPDBException("Save failed:", e);
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<T> findAll() {
        try {
            return em.createQuery("from " + getTablename() + " w").getResultList();
        } catch (Exception e) {
            getLogger().error("Save failed:", e);
            throw new OCPDBException("Save failed:", e);
        }
    }

    @Override
    @Transactional
    public void save(T whiteboardItem) {
        try {
            if (whiteboardItem.getId() != null) {
                em.merge(whiteboardItem);
            } else {
                Long wid = whiteboardItem.getWhiteboard().getId();
                int orderIndex = getHighestOrderIndexByWhiteboardId(wid) + 1;
                whiteboardItem.setOrderIndex(orderIndex);
                em.persist(whiteboardItem);
            }
        } catch (Exception e) {
            getLogger().error("Save failed:", e);
            throw new OCPDBException("Save failed:", e);
        }
    }

    @Override
    public void delete(T whiteboardItem) {
        try {
            T a = em.find(getType(), whiteboardItem.getId());
            if (whiteboardItem.getId() != null) {
                em.merge(a);
                em.remove(a);
            }
        } catch (Exception e) {
            getLogger().error("Save failed:", e);
            throw new OCPDBException("Save failed:", e);
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<T> findAllbyWhiteboardId(Long id) {
        try {
            return em.createQuery("from " + getTablename() + " w where w.whiteboard.id=?1").setParameter(1, id)
                    .getResultList();
        } catch (Exception e) {
            getLogger().error("Save failed:", e);
            throw new OCPDBException("Save failed:", e);
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    public T findByAttribute(String key, Object value) {

        try {
            return (T) em.createQuery("from " + getTablename() + " w where w." + key + "='" + value + "'");
        } catch (Exception e) {
            throw new OCPDBException("findByAttribute failed", e);
        }
    }

    @Override
    public Integer getHighestOrderIndexByWhiteboardId(Long id) {
        Integer index;
        try {
            index = (Integer) em.createQuery("SELECT MAX(w.orderIndex) from WhiteboardItem w WHERE w.whiteboard.id=?1")
                    .setParameter(1, id).getSingleResult();
            getLogger().debug("" + index);
            System.out.println(index);
        } catch (Exception e) {
            throw new OCPDBException("getHighestOrderIndexByWhiteboardId failed", e);
        }

        if (index != null) {
            return index;
        }

        return 0;
    }

    private String getTablename() {
        return getType().getSimpleName();
    }

}
