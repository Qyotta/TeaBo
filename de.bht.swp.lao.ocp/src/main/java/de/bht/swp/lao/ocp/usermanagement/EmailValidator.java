package de.bht.swp.lao.ocp.usermanagement;

import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;

public class EmailValidator {
  public boolean isValidEmailAddress(String email) {
    if (email == null || email.trim().length() <= 0 || !checkEmailAddress(email)) {
      return false;
    }

    return true;
  }

  private boolean checkEmailAddress(String email) {
    if (!hasNameAndDomain(email)) {
      return false;
    }

    try {
      new InternetAddress(email);
      return true;
    } catch (AddressException e) {
      return false;
    }
  }

  private boolean hasNameAndDomain(String email) {
    String[] tokens = email.split("@");
    if (tokens.length == 2) {
      if (!tokens[0].isEmpty() && !tokens[1].isEmpty()) {
        String[] dTokens = tokens[1].split("\\.");
        if (dTokens.length > 1 && dTokens[dTokens.length - 1].length() >= 2) {
          return true;
        }
      }
    }
    return false;
  }
}
