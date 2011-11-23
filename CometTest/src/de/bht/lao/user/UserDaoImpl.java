package de.bht.lao.user;

import java.util.ArrayList;
import java.util.List;

public class UserDaoImpl implements UserDao {

	List<User> users = new ArrayList<User>(); 	

	@Override
	public User findById(Integer id) {
		for(User user:users){
			if(user.getId().equals(id)){
				return user;
			}
		}
		return null;
	}

	@Override
	public List<User> findAll() {
		return users;
	}

}
