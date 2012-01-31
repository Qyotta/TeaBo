package de.bht.swp.lao.ocp.mailer;

import java.util.Properties;

import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;

import de.bht.swp.lao.ocp.usermanagement.User;
import de.bht.swp.lao.ocp.whiteboard.Whiteboard;

public class Mailer {
    private static final String PRODUCT_NAME = "Online Collaboration Platform";
    private String contextPath = "/de.bht.swp.lao.ocp";
    private String serverHost = "http://localhost:8080";

    private static final String TRUE = "true";
    private static final String SMTP_PROTOCOL = "smtp";
    private static final String SMTP_PASSWORD = "qwertz123";
    private static final String SMTP_USERNAME = "swplao@googlemail.com";
    private static final String MAIL_SMTP_STARTTLS_ENABLE = "mail.smtp.starttls.enable";
    private static final String MAIL_SMTP_AUTH = "mail.smtp.auth";
    private static final String SMTP_URL = "smtp.googlemail.com";
    private static final int SMTP_PORT = 587;
    private static final int PASS_LENGTH = 10;
    private final JavaMailSenderImpl sender;

    public Mailer() {
        this.sender = new JavaMailSenderImpl();
        this.setProperties();
    }

    public Mailer(String serverHost, String contextPath) {
        this.sender = new JavaMailSenderImpl();
        this.setProperties();

        if (serverHost != null) {
            this.serverHost = serverHost;
        }
        if (contextPath != null) {
            this.contextPath = contextPath;
        }

    }

    private void setProperties() {
        Properties props = this.sender.getJavaMailProperties();
        props.put(MAIL_SMTP_STARTTLS_ENABLE, TRUE);
        props.put(MAIL_SMTP_AUTH, TRUE);
        this.sender.setHost(SMTP_URL);
        this.sender.setPort(SMTP_PORT);
        this.sender.setUsername(SMTP_USERNAME);
        this.sender.setPassword(SMTP_PASSWORD);
        this.sender.setProtocol(SMTP_PROTOCOL);

    }

    public void sendMessage(final User invitedUser, final Whiteboard whiteboard) {
        MimeMessagePreparator preparator = new MimeMessagePreparator() {
            @Override
            public void prepare(MimeMessage mimeMessage) throws MessagingException {
                MimeMessageHelper message = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                message.setTo(new InternetAddress(invitedUser.getEmail()));
                message.setFrom(new InternetAddress(SMTP_USERNAME));
                message.setSubject("[lao] Invitation to Whiteboard");

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

                message.setText(s.toString(), true);
            }
        };
        try {
            sender.send(preparator);
        } catch (MailException ex) {
            System.err.println(ex.getMessage());
        }
    }

    public static String randomPassword() {
        String allchars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        char[] chars = allchars.toCharArray();
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < PASS_LENGTH; i++) {
            password.append(chars[(int) Math.round(Math.random() * (chars.length - 1))]);
        }
        return password.toString();
    }
}
