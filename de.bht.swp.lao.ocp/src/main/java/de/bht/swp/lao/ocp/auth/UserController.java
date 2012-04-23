package de.bht.swp.lao.ocp.auth;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import de.bht.swp.lao.ocp.exceptions.OCPHTTPException;
import de.bht.swp.lao.ocp.user.settings.IUserSettingsDao;
import de.bht.swp.lao.ocp.user.settings.UserSettings;

@Controller
@RequestMapping(value = "/user/*")
public class UserController {

  private static final String DELETE_CONFIRM_FLAG = "DeleteConfirmFlag";

  private static final String TOOL_TIP_FLAG = "ToolTipFlag";

  @Autowired
  private UserLoginValidator userLoginValidator;

  @Inject
  private IUserDao userDao;

  @Inject
  private IUserSettingsDao userSettingsDao;

  @RequestMapping(value = "/setDeleteFlag.htm", method = RequestMethod.POST)
  public @ResponseBody
  Map<String, Object> setDeleteFlag(@RequestParam("value") boolean value, HttpServletRequest request,
      HttpServletResponse response) throws IOException {
    User user = (User) request.getSession().getAttribute("user");

    UserSettings settings = userSettingsDao.findByKey(user, DELETE_CONFIRM_FLAG);

    if (settings != null) {
      settings.setValue(value);
    } else {
      settings = new UserSettings();
      settings.setUser(user);
      settings.setKey(DELETE_CONFIRM_FLAG);
      settings.setValue(value);
    }
    // user.setShowToolTips(!value);
    userSettingsDao.save(settings);
    // userDao.save(user);

    Map<String, Object> out = new HashMap<String, Object>();
    out.put("value", value);
    return out;
  }

  @RequestMapping(value = "/getDeleteFlag.htm", method = RequestMethod.POST)
  public @ResponseBody
  Map<String, Object> getDeleteFlag(HttpServletRequest request, HttpServletResponse response) throws IOException {
    User user = (User) request.getSession().getAttribute("user");

    UserSettings settings = userSettingsDao.findByKey(user, DELETE_CONFIRM_FLAG);
    Boolean showDeleteConfirm = true;
    if (settings != null) {
      showDeleteConfirm = Boolean.valueOf(settings.getValue());
    }

    Map<String, Object> out = new HashMap<String, Object>();
    out.put("value", showDeleteConfirm);
    return out;
  }

  @RequestMapping(value = "/setToolTipFlag.htm", method = RequestMethod.POST)
  public @ResponseBody
  Map<String, Object> setFlag(@RequestParam("value") boolean value, HttpServletRequest request,
      HttpServletResponse response) throws IOException {
    User user = (User) request.getSession().getAttribute("user");

    UserSettings settings = userSettingsDao.findByKey(user, TOOL_TIP_FLAG);

    if (settings != null) {
      settings.setValue(!value);
    } else {
      settings = new UserSettings();
      settings.setUser(user);
      settings.setKey(TOOL_TIP_FLAG);
      settings.setValue(!value);
    }
    // user.setShowToolTips(!value);
    userSettingsDao.save(settings);
    // userDao.save(user);

    Map<String, Object> out = new HashMap<String, Object>();
    out.put("value", true);
    return out;
  }

  @RequestMapping(value = "/showAgain.htm", method = RequestMethod.POST)
  public @ResponseBody
  Map<String, Object> getFlag(HttpServletRequest request, HttpServletResponse response) throws IOException {
    User user = (User) request.getSession().getAttribute("user");

    UserSettings settings = userSettingsDao.findByKey(user, TOOL_TIP_FLAG);
    Boolean showToolTips = false;
    if (settings != null) {
      showToolTips = Boolean.valueOf(settings.getValue());
    }

    Map<String, Object> out = new HashMap<String, Object>();
    out.put("value", showToolTips);
    return out;
  }

  @RequestMapping(value = "/logout", method = RequestMethod.POST)
  public @ResponseBody
  boolean logout(HttpServletRequest request) {
    request.getSession().invalidate();
    return true;
  }

  @RequestMapping(value = "/login", method = RequestMethod.POST)
  public @ResponseBody
  UserDTO login(@RequestBody User user, HttpServletRequest request) {
    boolean valid = userLoginValidator.validate(user);

    if (!valid) {
      throw new OCPHTTPException(OCPHTTPException.HTTPCode.HTTP_401_UNAUTHORIZED_EXPLAINED,
          "Login error. Please check your credentials and try again.");
    } else {
      User u = userDao.findByEmail(user.getEmail());
      request.getSession().setAttribute("user", u);
      return new UserDTO(u);
    }
  }

  @RequestMapping(method = RequestMethod.POST)
  public @ResponseBody
  UserDTO register(@RequestBody User user) {
    if (user == null) {
      throw new OCPHTTPException(OCPHTTPException.HTTPCode.HTTP_401_UNAUTHORIZED_EXPLAINED, "Register data not valid.");
    }

    User userWithEmail = userDao.findByEmail(user.getEmail());
    if (userWithEmail != null) {
      throw new OCPHTTPException(OCPHTTPException.HTTPCode.HTTP_401_UNAUTHORIZED_EXPLAINED, "Email is already in use.");
    }
    userDao.save(user);

    return new UserDTO(user);
  }

}
