package de.bht.swp.lao.ocp.whiteboard;

public class AssignmentDTO {
  private Long id;

  private String user;

  private float[] color;

  public AssignmentDTO(Assignment assignment) {
    this.setUser(assignment.getUser().getEmail());
    this.setColor(assignment.getColor().getRGBColorComponents(null));
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUser() {
    return user;
  }

  public void setUser(String user) {
    this.user = user;
  }

  public float[] getColor() {
    return color;
  }

  public void setColor(float[] color) {
    this.color = color;
  }
}
