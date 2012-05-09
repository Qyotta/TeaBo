package de.bht.swp.lao.ocp.user.settings;

import java.util.List;

import de.bht.swp.lao.ocp.user.User;

public interface IUserSettingsDao {

  UserSettings findByKey(User user, String key);

  List<UserSettings> findByUser(User user);

  void save(UserSettings settings);
}
