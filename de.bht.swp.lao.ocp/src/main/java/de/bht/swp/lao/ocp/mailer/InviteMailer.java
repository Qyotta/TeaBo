package de.bht.swp.lao.ocp.mailer;

import de.bht.swp.lao.ocp.usermanagement.User;
import de.bht.swp.lao.ocp.whiteboard.Whiteboard;

public class InviteMailer extends AbstractMailer {

  public InviteMailer(String serverHost, String contextPath, final User invitedUser, final Whiteboard whiteboard) {
    super(serverHost, contextPath);

    StringBuilder s = new StringBuilder();
    s.append("Hello,<br />");
    s.append("you were invited to ");
    s.append(whiteboard.getName());
    s.append(" Whiteboard <br />");
    s.append("You may login at <a href='");
    s.append(serverHost);
    s.append(contextPath + "'>" + PRODUCT_NAME + "</a>...<br />");
    s.append("User: " + invitedUser.getEmail() + "<br />" + "Password: " + invitedUser.getPassword());
    s.append("<br /><br />" + "With Regards,<br /><br />" + "[l]ook [a]head [o]nline");

    this.setSubject("[lao] Invitation to Whiteboard " + whiteboard.getName());
    this.setMessage(s.toString());
  }

}
