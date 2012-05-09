package de.bht.swp.lao.ocp.user;

import java.util.List;

public interface IUserDao {
    User findById(Integer id);

    List<User> findAll();

    User findByEmail(String email);

    void save(User user);
}
