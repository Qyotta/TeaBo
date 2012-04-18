package de.bht.swp.lao.ocp.user.settings;

import de.bht.swp.lao.ocp.auth.User;

public interface IUserSettingsDao {

  UserSettings findByKey(User user, String key);

  void save(UserSettings settings);
}
