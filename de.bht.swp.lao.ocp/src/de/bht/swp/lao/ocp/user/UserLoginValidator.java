package de.bht.swp.lao.ocp.user;

import javax.inject.Inject;

import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

public class UserLoginValidator implements Validator{
	
	@Inject
	UserDao userDao;
	
	@Override
	public boolean supports(Class<?> clazz) {
		return LoginFormData.class.equals(clazz);
	}

	@Override
	public void validate(Object obj, Errors errors) {
		LoginFormData loginFormData = (LoginFormData)obj;
		
		ValidationUtils.rejectIfEmpty(errors, "email", "field.required","email is required!");
		ValidationUtils.rejectIfEmpty(errors, "password", "field.required", "password is required!");
		
		if(!errors.hasErrors()){
			User user = userDao.findByEmail(loginFormData.getEmail());
			if(user==null || !user.getPassword().equals(loginFormData.getPassword())){
				errors.rejectValue("errors", "not.valid", "email/password isn't valid");
			}
		}
	}

}
