package de.bht.swp.lao.ocp.usermanagement;

import javax.inject.Inject;

import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

public class UserLoginValidator implements Validator {

    /**
     * @uml.property name="userDao"
     * @uml.associationEnd readOnly="true"
     */
    @Inject
    private IUserDao userDao;

    @Inject
    private EmailValidator mailvalidator;

    @Override
    public boolean supports(Class<?> clazz) {
        return LoginFormData.class.equals(clazz);
    }

    public boolean isValidEmailAddress(String email) {
        return mailvalidator.isValidEmailAddress(email);
    }

    @Override
    public void validate(Object obj, Errors errors) {
        LoginFormData loginFormData = (LoginFormData) obj;

        // Email
        if (loginFormData.getEmail() == null || loginFormData.getEmail().equals("")) {
            errors.rejectValue("email", "email.field.required", "Email is required!");

        } else {
            if (!isValidEmailAddress(loginFormData.getEmail())) {
                errors.rejectValue("email", "email.invalid", "Email/Password isn't valid");
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
