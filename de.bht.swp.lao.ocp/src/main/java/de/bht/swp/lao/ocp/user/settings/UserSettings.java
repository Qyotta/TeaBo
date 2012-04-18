package de.bht.swp.lao.ocp.user.settings;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import de.bht.swp.lao.ocp.auth.User;

@Entity
@Table(name = "LAO_USER_SETTINGS")
public class UserSettings {

  @Id
  @GeneratedValue
  private Integer id;

  @ManyToOne
  private User user;

  private String settingKey;

  private String value;

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public String getKey() {
    return settingKey;
  }

  public void setKey(String key) {
    this.settingKey = key;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  public void setValue(Object value) {
    this.value = String.valueOf(value);
  }

}
