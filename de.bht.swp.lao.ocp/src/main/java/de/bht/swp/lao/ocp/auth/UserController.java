package de.bht.swp.lao.ocp.auth;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
import de.bht.swp.lao.ocp.user.settings.UserSettingsDTO;

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

  @RequestMapping(value = "/getAllSettings.htm", method = RequestMethod.GET)
  public @ResponseBody
  List<UserSettingsDTO> getSettings(HttpServletRequest request, HttpServletResponse response) throws IOException {
    User user = (User) request.getSession().getAttribute("user");
    if (user == null) {
      return null;
    }

    List<UserSettings> settings = userSettingsDao.findByUser(user);

    List<UserSettingsDTO> rSettings = new ArrayList<UserSettingsDTO>();

    for (UserSettings us : settings) {
      rSettings.add(new UserSettingsDTO(us));
    }

    return rSettings;
  }

  @RequestMapping(value = "/setSettings.htm", method = RequestMethod.POST)
  public @ResponseBody
  Map<String, Object> setSetting(@RequestParam("key") String key, @RequestParam("value") Object value,
      HttpServletRequest request, HttpServletResponse response) throws IOException {
    User user = (User) request.getSession().getAttribute("user");

    UserSettings settings = userSettingsDao.findByKey(user, key);

    if (settings != null) {
      settings.setValue(value);
    } else {
      settings = new UserSettings();
      settings.setUser(user);
      settings.setKey(key);
      settings.setValue(value);
    }

    userSettingsDao.save(settings);

    Map<String, Object> out = new HashMap<String, Object>();
    out.put("value", value);
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
