package de.bht.swp.lao.ocp.whiteboard;

import java.util.List;

import de.bht.swp.lao.ocp.user.User;

public interface IAssignmentDao {
    Assignment findByID (Long id);
    List<Assignment> findAll();
    void delete(Assignment assignment);
    void saveOrUpdate(Assignment assignment);
    List<Assignment> findByUser(User user);
    
}
