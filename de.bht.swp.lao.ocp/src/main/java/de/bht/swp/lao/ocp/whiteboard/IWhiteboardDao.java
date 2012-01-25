package de.bht.swp.lao.ocp.whiteboard;

import java.util.List;

import de.bht.swp.lao.ocp.usermanagement.User;

public interface IWhiteboardDao {
    Whiteboard findById(Long id);

    List<Whiteboard> findAll();

    void save(Whiteboard whiteboard);

    void delete(Whiteboard whiteboard);

    List<Whiteboard> findByOwner(User user);
}
