package de.bht.swp.lao.ocp.register;

import javax.inject.Inject;

import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import de.bht.swp.lao.ocp.usermanagement.EmailValidator;
import de.bht.swp.lao.ocp.usermanagement.IUserDao;

public class UserRegisterValidator implements Validator {

  private static final int MIN_PASSWORD_LENGTH = 6;

  @Inject
  private IUserDao userDao;

  @Inject
  private EmailValidator mailvalidator;

  @Override
  public boolean supports(Class<?> clazz) {
    return RegisterFormData.class.equals(clazz);
  }

  public boolean isValidEmailAddress(String email) {
    return mailvalidator.isValidEmailAddress(email);
  }

  @Override
  public void validate(Object obj, Errors registerError) {
    RegisterFormData registerFormData = (RegisterFormData) obj;

    if (registerFormData.getEmail() == null || registerFormData.getEmail().equals("")) {
      registerError.rejectValue("email", "email.field.required", "Email is required!");
    } else {
      if (!isValidEmailAddress(registerFormData.getEmail())) {
        registerError.rejectValue("email", "email.invalid", "Email isn't valid!");
      } else {
        if (userDao.findByEmail(registerFormData.getEmail()) != null) {
          registerError.rejectValue("email", "email.already.used", "Email is already in use");
        }
      }
    }

    if (registerFormData.getPassword() == null || registerFormData.getPassword().equals("")) {
      registerError.rejectValue("password", "password.field.required", "Password is required!");
    } else {
      if (registerFormData.getPassword().length() < MIN_PASSWORD_LENGTH) {
        registerError.rejectValue("password", "password.field.length", "Password needs to have at least "
            + MIN_PASSWORD_LENGTH + " chars!");
      } else if (!registerFormData.getPassword().equals(registerFormData.getPasswordvalidate())) {
        registerError.rejectValue("passwordvalidate", "passwords.not.matching", "Passwords do not match!");
      }
    }

  }
}
