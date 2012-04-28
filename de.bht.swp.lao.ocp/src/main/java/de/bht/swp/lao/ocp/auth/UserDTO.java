package de.bht.swp.lao.ocp.auth;

import java.util.List;

import de.bht.swp.lao.ocp.user.settings.UserSettingsDTO;

public class UserDTO {
  private Integer id;

  private String firstname;
  private String lastname;
  private String email;

  private String position;
  private boolean showToolTips;

  public UserDTO(User user) {
    this.id = user.getId();
    this.firstname = user.getFirstname();
    this.lastname = user.getLastname();
    this.email = user.getEmail();
    this.position = user.getPosition();
    this.showToolTips = user.isShowToolTips();
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

  public String getPosition() {
    return position;
  }

  public void setPosition(String position) {
    this.position = position;
  }

  public boolean isShowToolTips() {
    return showToolTips;
  }

  public void setShowToolTips(boolean showToolTips) {
    this.showToolTips = showToolTips;
  }

}
