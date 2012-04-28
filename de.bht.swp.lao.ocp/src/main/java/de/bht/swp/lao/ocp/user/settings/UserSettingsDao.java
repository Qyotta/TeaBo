package de.bht.swp.lao.ocp.user.settings;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import de.bht.swp.lao.ocp.auth.User;
import de.bht.swp.lao.ocp.exceptions.OCPDBException;

public class UserSettingsDao implements IUserSettingsDao {

  private static final Logger LOGGER = LoggerFactory.getLogger(UserSettingsDao.class);

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

  @SuppressWarnings("unchecked")
  @Override
  public List<UserSettings> findByUser(User user) {
    try {
      return em.createQuery("from UserSettings us where us.user=?1").setParameter(1, user).getResultList();
    } catch (Exception e) {
      LOGGER.error("findByUser failed:", e);
      throw new OCPDBException("findByUser failed:", e);
    }
  }

}
