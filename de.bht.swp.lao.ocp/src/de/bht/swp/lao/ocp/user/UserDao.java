package de.bht.swp.lao.ocp.user;

import java.util.List;

public interface UserDao {
	public User findById(Integer id);
	public List<User> findAll();
	public User findByEmail(String email);
}
