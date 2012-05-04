package de.bht.swp.lao.ocp.auth;

import javax.inject.Inject;

public class UserLoginValidator {

    @Inject
    private IUserDao userDao;

    @Inject
    private EmailValidator mailvalidator;

    public boolean isValidEmailAddress(String email) {
        return mailvalidator.isValidEmailAddress(email);
    }

    public boolean validate(User user) {
    	if(user == null){
    		return false;
    	}
    	
        if (user.getEmail() == null || user.getEmail().equals("")
                || !isValidEmailAddress(user.getEmail())) {
            return false;
        }

        User u = userDao.findByEmail(user.getEmail());
        
        if(u == null){
        	return false;
        }

        if (user.getPassword() == null || user.getPassword().equals("")
                || !u.getPassword().equals(user.getPassword())) {
            return false;
        }

        return true;
    }
}