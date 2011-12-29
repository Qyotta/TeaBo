package de.bht.swp.lao.ocp.register;

import javax.inject.Inject;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import de.bht.swp.lao.ocp.user.UserDao;

public class UserRegisterValidator implements Validator {

	@Inject
	UserDao userDao;

	@Override
	public boolean supports(Class<?> clazz) {
		return RegisterFormData.class.equals(clazz);
	}

	@Override
	public void validate(Object obj, Errors registerError) {
		RegisterFormData registerFormData = (RegisterFormData) obj;

		ValidationUtils.rejectIfEmpty(registerError, "email", "field.required",
				"Register Email is required!");
		ValidationUtils.rejectIfEmpty(registerError, "password", "field.required",
				"Register Password is required!");
		ValidationUtils.rejectIfEmpty(registerError, "passwordvalidate", "field.required",
				"Register Password is required!");
	

		if (!registerError.hasErrors()) {
			if(registerFormData==null || registerFormData.getEmail()==null || registerFormData.getPassword()==null){
				registerError.rejectValue("errors", "not.valid", "Email/Password isn't valid!");
			}
			if(!(registerFormData.getPassword().equals(registerFormData.getPasswordvalidate()))){
				registerError.rejectValue("errors", "not.valid", "Password and Confirm Password do not match!");
			}
		}
	}
}
