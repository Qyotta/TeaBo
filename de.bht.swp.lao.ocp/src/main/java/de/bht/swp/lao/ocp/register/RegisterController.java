package de.bht.swp.lao.ocp.register;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import de.bht.swp.lao.ocp.user.User;
import de.bht.swp.lao.ocp.user.IUserDao;


@Controller
@RequestMapping(value = "/user/register.htm")
public class RegisterController {
	
	@Autowired
	UserRegisterValidator userRegisterValidator;
	
	@Inject
	IUserDao userDao;
	
	@SuppressWarnings("unused")
	private RegisterController(){}
	
	public RegisterController(UserRegisterValidator userRegisterValidator){
		this.userRegisterValidator=userRegisterValidator;
	}
	
	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView register() {
		ModelAndView mav = new ModelAndView("user/register");
		mav.addObject("registerFormData", new RegisterFormData());
		return mav;
	}
	
	@RequestMapping(method = RequestMethod.POST)
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
			newUser.setShowToolTips(true);
			userDao.save(newUser);
			request.getSession().setAttribute("user", userDao.findByEmail( registerFormData.getEmail()));
			
			return "user/registrationSuccess";
			//return "redirect:/whiteboard/list.htm";
		}
	}
}
