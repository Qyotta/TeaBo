package de.bht.swp.lao.ocp.mailer;

import de.bht.swp.lao.ocp.usermanagement.User;
import de.bht.swp.lao.ocp.whiteboard.Whiteboard;

public class InviteMailer extends AbstractMailer {

  /**
   * Implements an AbstractMailer to send an invitation mail.
   * 
   * @param serverHost
   *          host name of server e.g. http://localhost:8080 or www.lao.de
   * @param contextPath
   *          context path e.g. 'de.bht.swp.lao.ocp' or could be blank
   * @param invitedUser
   *          user, who is invited to the whiteboard
   * @param whiteboard
   *          whiteboard to whom the user is invited
   */
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
