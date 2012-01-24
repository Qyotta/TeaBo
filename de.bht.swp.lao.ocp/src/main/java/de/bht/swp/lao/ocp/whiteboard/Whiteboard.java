package de.bht.swp.lao.ocp.whiteboard;

import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import de.bht.swp.lao.ocp.user.User;
import de.bht.swp.lao.ocp.whiteboarditem.WhiteboardItem;

/**
 * This class represents a whiteboard.
 *
 */
@Entity
@Table(name="lao_whiteboard")
public class Whiteboard {
	@Id
	@GeneratedValue
	private Long id;
	
	private String name;
	
	@OneToMany(mappedBy="whiteboard",targetEntity=WhiteboardItem.class)
	private Set<WhiteboardItem> whiteboardItems;
	
	@ManyToMany(mappedBy="assignedWhiteboards")
	private Set<User> assignedUsers;
	
	public Set<User> getAssignedUsers() {
		return assignedUsers;
	}
	public void setAssignedUsers(Set<User> assignedUsers) {
		this.assignedUsers = assignedUsers;
	}
	@ManyToOne
	private User creator;
	
	public Set<WhiteboardItem> getWhiteboardObjects() {
		return whiteboardItems;
	}
	public void setWhiteboardObjects(Set<WhiteboardItem> notes) {
		this.whiteboardItems = notes;
	}
	public User getCreator() {
		return creator;
	}
	public void setCreator(User creator) {
		this.creator = creator;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
}
