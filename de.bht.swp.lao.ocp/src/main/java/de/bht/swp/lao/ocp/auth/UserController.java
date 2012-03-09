package de.bht.swp.lao.ocp.auth;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import de.bht.swp.lao.ocp.exceptions.OCPHTTPException;

@Controller
@RequestMapping(value = "/user/*")
public class UserController {

    @Autowired
    private UserLoginValidator userLoginValidator;

    @Inject
    private IUserDao userDao;

    @RequestMapping(value = "/setToolTipFlag.htm", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, Object> setFlag(@RequestParam("value") boolean value,
            HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        User user = (User) request.getSession().getAttribute("user");

        user.setShowToolTips(!value);
        userDao.save(user);

        Map<String, Object> out = new HashMap<String, Object>();
        out.put("value", true);
        return out;
    }

    @RequestMapping(value = "/showAgain.htm", method = RequestMethod.POST)
    public @ResponseBody
    Map<String, Object> getFlag(HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        User user = (User) request.getSession().getAttribute("user");

        Map<String, Object> out = new HashMap<String, Object>();
        out.put("value", user.isShowToolTips());
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
    UserDTO login(ModelMap model, @RequestBody User user,
            HttpServletRequest request) {
        boolean valid = userLoginValidator.validate(user);

        if (!valid) {
            throw new OCPHTTPException(
                    OCPHTTPException.HTTPCode.HTTP_401_UNAUTHORIZED_EXPLAINED,
                    "Login error. Please check your credentials and try again.");
        } else {
            User u = userDao.findByEmail(user.getEmail());
            request.getSession().setAttribute("user", u);
            return new UserDTO(u);
        }
    }
}
