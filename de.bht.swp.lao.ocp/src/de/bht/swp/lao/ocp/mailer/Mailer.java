package de.bht.swp.lao.ocp.mailer;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessagePreparator;

import de.bht.swp.lao.ocp.user.User;
import de.bht.swp.lao.ocp.whiteboard.Whiteboard;

public class Mailer {
private JavaMailSenderImpl sender;
    
    public Mailer() {
        this.sender = new JavaMailSenderImpl();
        Properties props = this.sender.getJavaMailProperties();
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.auth", "true");
        this.sender.setHost("smtp.googlemail.com");
        this.sender.setPort(587);
        this.sender.setUsername("swplao@googlemail.com");
        this.sender.setPassword("qwertz123");
        this.sender.setProtocol("smtp");
    }

    public void sendMessage(final User invitedUser,final Whiteboard whiteboard) {
        MimeMessagePreparator preparator = new MimeMessagePreparator() {
            public void prepare(MimeMessage mimeMessage) throws MessagingException {
                mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(invitedUser.getEmail()));
                mimeMessage.setFrom(new InternetAddress("swplao@googlemail.com"));
                mimeMessage.setSubject("[lao] Invitation to Whiteboard");
                mimeMessage.setText("Hello,\n"+
                		"you were invited to "+whiteboard.getName()+" Whiteboard \n"+
						"You may login at <a href='http://localhost:8080/de.bht.swp.lao.ocp/user/login.htm'>Online Collaboration Platform</a>...\n"+ 
						"User: "+invitedUser.getEmail()+"\n"+
						"Password: "+invitedUser.getPassword()+"\n\n"+
						"With Regards,\n\n"+
						"[l]ook [a]head [o]nline");
            }
        };
        try{
            sender.send(preparator);
        }
        catch (MailException ex) {
            System.err.println(ex.getMessage());            
        }
    }
}
