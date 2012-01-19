package de.bht.swp.lao.ocp.logout;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import de.bht.swp.lao.ocp.login.LoginFormData;


@Controller
@RequestMapping(value = "/user/logoutRequest.htm")
public class LogoutController {
	
	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView login() {
		ModelAndView mav = new ModelAndView("user/logoutRequest");
		return mav;
	}
	
	@RequestMapping(method = RequestMethod.POST)
	public ModelAndView onSubmit(BindingResult result, HttpServletRequest request) {
		ModelAndView mav = new ModelAndView();
		
		return mav;
	}

}
