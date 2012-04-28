package de.bht.swp.lao.ocp.user.settings;

public class UserSettingsDTO {

  private String key;

  private String value;

  public UserSettingsDTO(UserSettings us) {
    this.key = us.getKey();
    this.value = us.getValue();
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  public String getKey() {
    return key;
  }

  public void setKey(String key) {
    this.key = key;
  }
}
