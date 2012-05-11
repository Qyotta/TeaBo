package de.bht.swp.lao.ocp.whiteboard;

import de.bht.swp.lao.ocp.user.UserDTO;

public class AssignmentDTO {
  private Long id;

  private UserDTO user;

  private float[] color;
  
  private boolean isOwner;

  public AssignmentDTO(Assignment assignment) {
	this.id = assignment.getId();
    this.setUser(new UserDTO(assignment.getUser()));
    this.setColor(assignment.getColor().getRGBColorComponents(null));
    this.setOwner(assignment.getIsOwner());
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public UserDTO getUser() {
    return user;
  }

  public void setUser(UserDTO user) {
    this.user = user;
  }

  public float[] getColor() {
    return color;
  }

  public void setColor(float[] color) {
    this.color = color;
  }

public boolean isOwner() {
	return isOwner;
}

public void setOwner(boolean isOwner) {
	this.isOwner = isOwner;
}
}
