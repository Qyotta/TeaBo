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
@RequestMapping(value = "/user/logout.htm")
public class LogoutController {
	
	//Set set current Session invalid and redirect to login.jsp
	@RequestMapping(method = RequestMethod.POST)
	public ModelAndView onSubmit(@ModelAttribute("loginFormData") LoginFormData loginFormData, BindingResult result, HttpServletRequest request) {
		ModelAndView mav = new ModelAndView();
		request.getSession().invalidate();
		mav.setViewName("user/login");		
		return mav;
	}

}
