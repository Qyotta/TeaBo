package de.bht.swp.lao.ocp.user;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public class UserDaoImpl implements UserDao {
	
	List<User> users = new ArrayList<User>();
	
	public UserDaoImpl() {
		User user = new User();
		user.setId(1);
		user.setEmail("lao@lao.de");
		user.setPassword("lao");
		user.setFirstname("Balu");
		user.setLastname("der Bär");
		user.setPosition("Die Axt im Wald");
		users.add(user);
	}

	@Override
	public User findById(Integer id) {
		for (User user : users) {
			if (user.getId().equals(id)) {
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
		for (User user : users) {
			if (user.getEmail().equals(email)) {
				return user;
			}
		}
		return null;
	}

	@Override
	public void save(User user) {
		user.setId(users.size()+1);
		users.add(user);
	}

	public String toString() {
		StringBuilder allUsers = new StringBuilder();
		for (User user : users) {
			allUsers.append("ID: " + user.getId() + " EMAIL: " + user.getEmail() + " PASSWORD: "
					+ user.getPassword() + " FIRSTNAME: " + user.getFirstname() + " LASTNAME: "  
					+ user.getLastname() + " POSITION: " + user.getPosition() + "\n");
		}
		return allUsers.toString();
	}
}
