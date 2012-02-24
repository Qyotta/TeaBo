package de.bht.swp.lao.ocp.mailer;

import java.util.Properties;

import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;

import de.bht.swp.lao.ocp.auth.User;

/**
 * This class provides mail functionality
 * 
 */
public abstract class AbstractMailer {
    protected static final String PRODUCT_NAME = "Online Collaboration Platform";
    protected String contextPath = "/de.bht.swp.lao.ocp";
    protected String serverHost = "http://localhost:8080";

    private static final String TRUE = "true";
    private static final String SMTP_PROTOCOL = "smtp";
    private static final String SMTP_PASSWORD = "qwertz123";
    private static final String SMTP_USERNAME = "swplao@googlemail.com";
    private static final String MAIL_SMTP_STARTTLS_ENABLE = "mail.smtp.starttls.enable";
    private static final String MAIL_SMTP_AUTH = "mail.smtp.auth";
    private static final String SMTP_URL = "smtp.googlemail.com";
    private static final int SMTP_PORT = 587;

    /**
     * the message in the mail
     */
    private String message;
    /**
     * the subject of the mail
     */
    private String subject;

    private final JavaMailSenderImpl sender;

    private static final Logger LOGGER = LoggerFactory
            .getLogger(InviteMailer.class);

    public AbstractMailer() {
        this.sender = new JavaMailSenderImpl();
        this.setProperties();
    }

    public AbstractMailer(String serverHost, String contextPath) {
        this.sender = new JavaMailSenderImpl();
        this.setProperties();

        if (serverHost != null) {
            this.serverHost = serverHost;
        }
        if (contextPath != null) {
            this.contextPath = contextPath;
        }
    }

    /**
     * sets the properties in the mailobject for accessing mailserver
     */
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

    /**
     * sends the message
     * 
     * @param invitedUser
     * @param whiteboard
     */
    public void sendMessage(final User sentTo) {
        MimeMessagePreparator preparator = new MimeMessagePreparator() {
            @Override
            public void prepare(MimeMessage mimeMessage)
                    throws MessagingException {
                MimeMessageHelper message = new MimeMessageHelper(mimeMessage,
                        true, "UTF-8");
                message.setTo(new InternetAddress(sentTo.getEmail()));
                message.setFrom(new InternetAddress(SMTP_USERNAME));

                message.setSubject(getSubject());
                message.setText(getMessage(), true);
            }
        };
        try {
            sender.send(preparator);
        } catch (MailException ex) {
            LOGGER.error(ex.getMessage());
        }
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }
}
