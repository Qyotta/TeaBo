package de.bht.swp.lao.ocp.whiteboard;

import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import de.bht.swp.lao.ocp.note.Note;
import de.bht.swp.lao.ocp.user.User;

@Entity
public class Whiteboard {
	@Id
	@GeneratedValue
	private Long id;
	
	private String name;
	
	@OneToMany(mappedBy="whiteboard",targetEntity=Note.class)
	private Set<Note> notes;
	
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
	
	public Set<Note> getNotes() {
		return notes;
	}
	public void setNotes(Set<Note> notes) {
		this.notes = notes;
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
