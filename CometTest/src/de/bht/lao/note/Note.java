package de.bht.lao.note;

import de.bht.lao.user.User;

public class Note {
	private Long id;
	private String title;
	private String text;
	private Integer x;
	private Integer y;
	private User creator;
	
	public Note(){}
	
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
}
