package de.bht.swp.lao.ocp.login;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import de.bht.swp.lao.ocp.user.IUserDao;
import de.bht.swp.lao.ocp.user.User;

@Controller
@RequestMapping(value = "/user/login.htm")
public class LoginController {

	@Autowired
	UserLoginValidator userLoginValidator;
	
	@Inject
	IUserDao userDao;
	
	@RequestMapping(method = RequestMethod.GET)
	public String view(ModelMap model, HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		
		//if user session already valid, redirect to list.html
		if(user!=null){
			return "redirect:/user/list.htm";
		}
		model.addAttribute("loginFormData", new LoginFormData());
		
		return "user/login";
	}

	@RequestMapping(method = RequestMethod.POST)
	public String login(ModelMap model, @ModelAttribute("loginFormData") LoginFormData loginFormData , BindingResult result, HttpServletRequest request) {
		userLoginValidator.validate(loginFormData, result);
		
		if (result.hasErrors()) {
			model.addAttribute("errors", result);
			return "user/login";
		} else {
			request.getSession().setAttribute("user", userDao.findByEmail( loginFormData.getEmail()));
			return("redirect:/whiteboard/list.htm");
		}
	}
}
