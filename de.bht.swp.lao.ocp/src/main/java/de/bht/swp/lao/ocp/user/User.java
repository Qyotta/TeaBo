package de.bht.swp.lao.ocp.user;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;

import javax.persistence.Column;

import de.bht.swp.lao.ocp.modules.WhiteboardItem;
import de.bht.swp.lao.ocp.whiteboard.Whiteboard;

@Entity
public class User {
	@Id
	@GeneratedValue
	private Integer id;
	
	private String firstname;
	private String lastname;
	private String email;
	
	@Column(nullable=false)
	private String password;
	
	private String position;
	
	@OneToMany(mappedBy="creator",targetEntity=WhiteboardItem.class)
	private Set<WhiteboardItem> whiteboardItems;
	
	@OneToMany(mappedBy="creator",targetEntity=Whiteboard.class,fetch=FetchType.EAGER)
	private Set<Whiteboard> whiteboards;
	
	@ManyToMany(fetch=FetchType.EAGER)
	private Set<Whiteboard> assignedWhiteboards;
	
	public Set<Whiteboard> getAssignedWhiteboards() {
		return assignedWhiteboards;
	}
	public void setAssignedWhiteboards(Set<Whiteboard> assignedWhiteboards) {
		this.assignedWhiteboards = assignedWhiteboards;
	}
	public Set<WhiteboardItem> getWhiteboardObjects() {
		return whiteboardItems;
	}
	public void setWhiteboardObjects(Set<WhiteboardItem> notes) {
		this.whiteboardItems = notes;
	}
	public Set<Whiteboard> getWhiteboards() {
		return whiteboards;
	}
	public void setWhiteboards(Set<Whiteboard> whiteboards) {
		this.whiteboards = whiteboards;
	}
	
	public void addAssignedWhiteboard(Whiteboard w){
		if(assignedWhiteboards==null){
			assignedWhiteboards = new HashSet<Whiteboard>();
		}
		
		this.assignedWhiteboards.add(w);
	}

	public void removeAssignedWhiteboard(Whiteboard w){
		this.assignedWhiteboards.remove(w);
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getFirstname() {
		return firstname;
	}
	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}
	public String getLastname() {
		return lastname;
	}
	public void setLastname(String lastname) {
		this.lastname = lastname;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getPosition() {
		return position;
	}
	public void setPosition(String position) {
		this.position = position;
	}
	
}
