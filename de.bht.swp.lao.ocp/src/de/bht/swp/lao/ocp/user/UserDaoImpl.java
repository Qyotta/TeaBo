package de.bht.swp.lao.ocp.user;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public class UserDaoImpl implements UserDao {

	List<User> users = new ArrayList<User>();
	
	public UserDaoImpl(){
		User user = new User();
		user.setEmail("lao@lao.de");
		user.setPassword("lao");
		users.add(user);
	}

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

	@Override
	public User findByEmail(String email) {
		for(User user:users){
			if(user.getEmail().equals(email)){
				return user;
			}
		}
		return null;
	}
	
	

}
