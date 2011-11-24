package de.bht.swp.lao.ocp.user;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/user/login.htm")
public class UserController {

	@Autowired
	UserLoginValidator userLoginValidator;
	
	@Inject
	UserDao userDao;
	
	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView showLoginForm() {
		ModelAndView mav = new ModelAndView("user/login");
		mav.addObject("loginFormData", new LoginFormData());
		return mav;
	}

	@RequestMapping(method = RequestMethod.POST)
	public String onSubmit(@ModelAttribute("loginFormData") LoginFormData loginFormData, BindingResult result, HttpServletRequest request) {
		userLoginValidator.validate(loginFormData, result);
		if (result.hasErrors()) {
			return "/user/login";
		} else {
			request.getSession().setAttribute("user", userDao.findByEmail(loginFormData.getEmail()));
			return "redirect:/whiteboard/view-0.htm";
		}
	}

}
