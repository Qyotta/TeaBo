package de.bht.swp.lao.ocp.login;

import javax.inject.Inject;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;

import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

import de.bht.swp.lao.ocp.user.User;
import de.bht.swp.lao.ocp.user.IUserDao;

public class UserLoginValidator implements Validator {

	/**
	 * @uml.property name="userDao"
	 * @uml.associationEnd readOnly="true"
	 */
	@Inject
	IUserDao userDao;

	@Override
	public boolean supports(Class<?> clazz) {
		return LoginFormData.class.equals(clazz);
	}

	private boolean isValidEmailAddress(String email) {
		if (email == null)
			return false;
		boolean result = true;
		try {
			InternetAddress emailAddr = new InternetAddress(email);
			if (!hasNameAndDomain(email)) {
				result = false;
			}
		} catch (AddressException ex) {
			result = false;
		}
		return result;
	}

	private boolean hasNameAndDomain(String email) {
		String[] tokens = email.split("@");
		if (tokens.length == 2) {
			if (!tokens[0].isEmpty() && !tokens[1].isEmpty()) {
				String[] dTokens = tokens[1].split("\\.");
				if (dTokens.length > 1
						&& dTokens[dTokens.length - 1].length() >= 2) {
					return true;
				}
			}
		}
		return false;
	}

	@Override
	public void validate(Object obj, Errors errors) {
		LoginFormData loginFormData = (LoginFormData) obj;

		// Email
		if (loginFormData.getEmail() == null || loginFormData.getEmail().equals("")) {
			errors.rejectValue("email", "email.field.required", "Email is required!");

		} else {
			if (!isValidEmailAddress(loginFormData.getEmail())) {
				errors.rejectValue("email", "email.invalid","Email/Password isn't valid");
			}
		}

		// Password
		User user = userDao.findByEmail(loginFormData.getEmail());

		if (loginFormData.getPassword() == null || loginFormData.getPassword().equals("")) {
			errors.rejectValue("password", "password.field.required", "Password is required!");

		} else if (user == null || !user.getPassword().equals(loginFormData.getPassword())) {
			errors.rejectValue("password", "passwords.not.matching", "Email/Password isn't valid");
		}
	}
}
