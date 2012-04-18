package de.bht.swp.lao.ocp.user.settings;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;

import org.springframework.transaction.annotation.Transactional;

import de.bht.swp.lao.ocp.auth.User;

public class UserSettingsDao implements IUserSettingsDao {

  @PersistenceContext
  private EntityManager em;

  @Override
  public UserSettings findByKey(User user, String key) {
    try {
      return (UserSettings) em.createQuery("from UserSettings us where us.settingKey = ?1 AND us.user = ?2")
          .setParameter(1, key).setParameter(2, user).setMaxResults(1).getSingleResult();
    } catch (NoResultException e) {
      return null;
    }
  }

  @Override
  @Transactional
  public void save(UserSettings settings) {
    if (settings != null) {
      em.merge(settings);
    } else {
      em.persist(settings);
    }

  }

}
