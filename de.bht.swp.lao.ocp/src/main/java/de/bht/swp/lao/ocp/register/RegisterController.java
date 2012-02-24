package de.bht.swp.lao.ocp.register;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import de.bht.swp.lao.ocp.auth.IUserDao;
import de.bht.swp.lao.ocp.auth.User;

@Controller
@RequestMapping(value = "/user/register.htm")
public class RegisterController {

    private static final String REGISTER_VIEW = "user/register";

    @Autowired
    private UserRegisterValidator userRegisterValidator;

    @Inject
    private IUserDao userDao;

    public RegisterController() {
    }

    @RequestMapping(method = RequestMethod.GET)
    public String register(ModelMap map) {
        map.addAttribute("registerFormData", new RegisterFormData());
        return REGISTER_VIEW;
    }

    @RequestMapping(method = RequestMethod.POST)
    public String registerSubmitted(
            ModelMap map,
            @ModelAttribute("registerFormData") RegisterFormData registerFormData,
            BindingResult result, HttpServletRequest request) {
        userRegisterValidator.validate(registerFormData, result);

        if (result.hasErrors()) {
            map.addAttribute("errors", result);
            return REGISTER_VIEW;
        } else {
            User newUser = new User();
            newUser.setEmail(registerFormData.getEmail());
            newUser.setFirstname(registerFormData.getFirstname());
            newUser.setLastname(registerFormData.getLastname());
            newUser.setPassword(registerFormData.getPassword());
            newUser.setPosition(registerFormData.getPosition());
            newUser.setShowToolTips(true);
            userDao.save(newUser);
            request.getSession().setAttribute("user",
                    userDao.findByEmail(registerFormData.getEmail()));
            return "user/registrationSuccess";
        }
    }
}
