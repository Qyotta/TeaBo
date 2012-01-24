package de.bht.swp.lao.ocp.whiteboarditem;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.transaction.annotation.Transactional;

public class WhiteboardItemDao implements IWhiteboardItemDao<WhiteboardItem> {
    
    @PersistenceContext
    private EntityManager em;
    
    @Override
    public WhiteboardItem findById(Long id) {
        return em.find(WhiteboardItem.class, id);
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<WhiteboardItem> findAll() {
        return (List<WhiteboardItem>)em.createQuery("from WhiteboardItem w").getResultList();
    }

    @Override
    @Transactional
    public void save(WhiteboardItem whiteboardItem) {
        if(whiteboardItem.getId()!=null){
            em.merge(whiteboardItem);
        }else{
            em.persist(whiteboardItem);
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<WhiteboardItem> findAllbyWhiteboardId(Long id) {
        return (List<WhiteboardItem>)em.createQuery("from WhiteboardItem w where w.whiteboard.id=?1").setParameter(1, id).getResultList();
    }

    @Override
    public void delete(WhiteboardItem whiteboardItem) {
        // TODO Auto-generated method stub
        
    }
    
}
