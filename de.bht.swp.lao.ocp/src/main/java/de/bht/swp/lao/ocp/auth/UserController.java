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
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/user/*")
public class UserController {

    private static final String LOGIN_VIEW = "user/login";

    private static final String REDIRECT_TO_ROOT = "redirect:/";

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

    @RequestMapping(value = "/logout.htm", method = RequestMethod.POST)
    public String onSubmit(
            @ModelAttribute("loginFormData") LoginFormData loginFormData,
            BindingResult result, HttpServletRequest request) {
        request.getSession().invalidate();
        return REDIRECT_TO_ROOT;
    }

    @RequestMapping(value = "/login.htm", method = RequestMethod.GET)
    public String view(ModelMap model, HttpServletRequest request) {

        User user = (User) request.getSession().getAttribute("user");

        // if user session already valid, redirect to list.html
        if (user != null) {
            return REDIRECT_TO_ROOT;
        }

        model.addAttribute("loginFormData", new LoginFormData());

        return LOGIN_VIEW;
    }

    // if login button clicked - Post
    @RequestMapping(value = "/login.htm", method = RequestMethod.POST)
    public String login(ModelMap model,
            @ModelAttribute("loginFormData") LoginFormData loginFormData,
            BindingResult result, HttpServletRequest request) {
        userLoginValidator.validate(loginFormData, result);

        if (result.hasErrors()) {
            model.addAttribute("errors", result);
            return LOGIN_VIEW;
        } else {
            request.getSession().setAttribute("user",
                    userDao.findByEmail(loginFormData.getEmail()));
            return REDIRECT_TO_ROOT;
        }
    }

}
