package de.bht.swp.lao.ocp.register;

import javax.inject.Inject;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;

import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import de.bht.swp.lao.ocp.usermanagement.IUserDao;

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
	    if(tokens.length == 2){
	    	if(!tokens[0].isEmpty() && !tokens[1].isEmpty()){
	    		String[] dTokens = tokens[1].split("\\.");
	    		if(dTokens.length > 1 && dTokens[dTokens.length-1].length() >= 2){
	    			return true;
	    		}
	    	}
	    }
	    return false;
	  }


	@Override
	public void validate(Object obj, Errors registerError) {
		RegisterFormData registerFormData = (RegisterFormData) obj;

		if(registerFormData.getEmail()==null || registerFormData.getEmail().equals("")){
			registerError.rejectValue("email", "email.field.required", "Email is required!");
		}else{
			if(!isValidEmailAddress(registerFormData.getEmail())){
				registerError.rejectValue("email", "email.invalid", "Email isn't valid!");
			}else{
				if(userDao.findByEmail(registerFormData.getEmail()) != null){
					registerError.rejectValue("email", "email.already.used", "Email is already in use");
				}
			}
		}
		
		if(registerFormData.getPassword()==null || registerFormData.getPassword().equals("")){
			registerError.rejectValue("password", "password.field.required",
					"Password is required!");
		}
		else{
			if(!(registerFormData.getPassword().equals(registerFormData.getPasswordvalidate()))){
				registerError.rejectValue("passwordvalidate", "passwords.not.matching", "Passwords do not match!");
			}
		}
		
	}
}
