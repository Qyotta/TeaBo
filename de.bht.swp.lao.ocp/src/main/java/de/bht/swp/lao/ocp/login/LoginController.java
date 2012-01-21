package de.bht.swp.lao.ocp.login;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import de.bht.swp.lao.ocp.user.IUserDao;

@Controller
@RequestMapping(value = "/user/login.htm")
public class LoginController {

	@Autowired
	UserLoginValidator userLoginValidator;
	
	@Inject
	IUserDao userDao;
	
	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView view() {
		ModelAndView mav = new ModelAndView("user/login");
		mav.addObject("loginFormData", new LoginFormData());
		return mav;
	}

	@RequestMapping(method = RequestMethod.POST)
	public ModelAndView login(@ModelAttribute("loginFormData") LoginFormData loginFormData , BindingResult result, HttpServletRequest request) {
		ModelAndView mav = new ModelAndView();
		userLoginValidator.validate(loginFormData, result);
		
		if (result.hasErrors()) {
			mav.setViewName("user/login");
			mav.addObject("errors", result);
		} else {
			request.getSession().setAttribute("user", userDao.findByEmail( loginFormData.getEmail()));
			mav.setViewName("redirect:/whiteboard/list.htm");
		}
		return mav;
	}
}
