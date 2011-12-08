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
@RequestMapping(value = "/user/*")
public class UserController {

	@Autowired
	UserLoginValidator userLoginValidator;
	
	@Autowired
	UserRegisterValidator userRegisterValidator;
	
	@Inject
	UserDao userDao;
	
	@RequestMapping(value="/login.htm", method = RequestMethod.GET)
	public ModelAndView login() {
		ModelAndView mav = new ModelAndView("user/login");
		mav.addObject("loginFormData", new LoginFormData());
		return mav;
	}

	@RequestMapping(value="/login.htm", method = RequestMethod.POST)
	public String onSubmit(@ModelAttribute("loginFormData") LoginFormData loginFormData , BindingResult result, HttpServletRequest request) {
		userLoginValidator.validate(loginFormData, result);
		
		if (result.hasErrors()) {
			return "user/login";
		} else {
			request.getSession().setAttribute("user", userDao.findByEmail( loginFormData.getEmail()));
			return "redirect:/whiteboard/list.htm";
		}
	}
	
	@RequestMapping(value="/register.htm", method = RequestMethod.GET)
	public ModelAndView register() {
		ModelAndView mav = new ModelAndView("user/register");
		mav.addObject("registerFormData", new RegisterFormData());
		return mav;
	}
	
	@RequestMapping(value="/register.htm", method = RequestMethod.POST)
	public String registerSubmitted(@ModelAttribute("registerFormData") RegisterFormData registerFormData, BindingResult result, HttpServletRequest request) {
		userRegisterValidator.validate(registerFormData, result);
		
		if(result.hasErrors()){
			return "user/register";
		}else{
			User newUser = new User();
			newUser.setEmail(registerFormData.getEmail());
			newUser.setFirstname(registerFormData.getFirstname());
			newUser.setLastname(registerFormData.getLastname());
			newUser.setPassword(registerFormData.getPassword());
			newUser.setPosition(registerFormData.getPosition());
			userDao.save(newUser);
			return "redirect:/user/login.htm";
		}
	}
}
