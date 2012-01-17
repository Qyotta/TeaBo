package de.bht.swp.lao.ocp.register;

import javax.inject.Inject;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;

import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import de.bht.swp.lao.ocp.user.IUserDao;

public class UserRegisterValidator implements Validator {

	@Inject
	IUserDao userDao;

	@Override
	public boolean supports(Class<?> clazz) {
		return RegisterFormData.class.equals(clazz);
	}
	
	private boolean isValidEmailAddress(String email){
	    if (email == null) return false;
	    boolean result = true;
	    try {
	      InternetAddress emailAddr = new InternetAddress(email);
	      if ( ! hasNameAndDomain(email) ) {
	        result = false;
	      }
	    }
	    catch (AddressException ex){
	      result = false;
	    }
	    return result;
	  }

	  private  boolean hasNameAndDomain(String email){
	    String[] tokens = email.split("@");
	    return 
	     tokens.length == 2 &&
	     !tokens[0].isEmpty() && 
	     !tokens[1].isEmpty() ;
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
			if(registerFormData==null || registerFormData.getEmail()==null || !isValidEmailAddress(registerFormData.getEmail()) || registerFormData.getPassword()==null){
				registerError.rejectValue("errors", "not.valid", "Email/Password isn't valid!");
			}
			if(!(registerFormData.getPassword().equals(registerFormData.getPasswordvalidate()))){
				registerError.rejectValue("errors", "not.valid", "Password and Confirm Password do not match!");
			}
			if(userDao.findByEmail(registerFormData.getEmail()) != null){
				registerError.rejectValue("errors", "not.valid", "Email is already in use");
			}
		}
	}
}
