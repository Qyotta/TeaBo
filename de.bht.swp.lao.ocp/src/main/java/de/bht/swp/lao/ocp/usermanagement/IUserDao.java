package de.bht.swp.lao.ocp.usermanagement;

import java.util.List;

public interface IUserDao {
	public User findById(Integer id);
	public List<User> findAll();
	public User findByEmail(String email);
	public void save(User user);
}
