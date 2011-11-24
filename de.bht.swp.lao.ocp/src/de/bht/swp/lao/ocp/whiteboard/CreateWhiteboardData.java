package de.bht.swp.lao.ocp.whiteboard;

import de.bht.swp.lao.ocp.user.User;

public class CreateWhiteboardData {
	
	private String name;
	
	private User creator;
	
	private String errors;
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public User getCreator() {
		return creator;
	}
	
	public void setCreator(User creator) {
		this.creator = creator;
	}

	public String getErrors() {
		return errors;
	}

	public void setErrors(String errors) {
		this.errors = errors;
	}
	
}
