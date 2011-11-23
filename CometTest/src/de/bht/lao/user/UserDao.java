package de.bht.lao.user;

import java.util.List;

public interface UserDao {
	public User findById(Integer id);
	public List<User> findAll();
}
