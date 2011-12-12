package de.bht.swp.lao.ocp.note;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import de.bht.swp.lao.ocp.user.User;
import de.bht.swp.lao.ocp.whiteboard.Whiteboard;

@Entity
public class Note {
	@Id
	@GeneratedValue
	private Long id;
	private String title;
	private String text;
	private Integer x;
	private Integer y;
	
	@ManyToOne
	private User creator;
	
	@ManyToOne
	private Whiteboard whiteboard;
	
	private Boolean inProgress;

	public Note(){}
	
	public Whiteboard getWhiteboard() {
		return whiteboard;
	}

	public void setWhiteboard(Whiteboard whiteboard) {
		this.whiteboard = whiteboard;
	}
	
	public String getTitle() {
		return title;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public String getText() {
		return text;
	}
	
	public void setText(String text) {
		this.text = text;
	}
	
	public Integer getX() {
		return x;
	}
	
	public void setX(Integer x) {
		this.x = x;
	}
	
	public Integer getY() {
		return y;
	}
	
	public void setY(Integer y) {
		this.y = y;
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
	
	public void setInProgress(Boolean inProgress){
		this.inProgress = inProgress;
	}
	
	public Boolean isInProgress(){
		return this.inProgress;
	}
	
	
}
