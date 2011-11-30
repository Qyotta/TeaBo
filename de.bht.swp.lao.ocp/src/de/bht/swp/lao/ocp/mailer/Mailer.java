package de.bht.swp.lao.ocp.mailer;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessagePreparator;

public class Mailer {
private JavaMailSenderImpl sender;
    
    public Mailer() {
        this.sender = new JavaMailSenderImpl();
        this.sender.setHost("smtp.googlemail.com");
        this.sender.setPort(587);
        this.sender.setUsername("swplao@googlemail.com");
        this.sender.setPassword("qwertz123");
        this.sender.setProtocol("smtp");
        Properties props = this.sender.getJavaMailProperties();
        props.put("mail.smtp.starttls.enable", "true");


    }

    public void sendMessage(final String mailaddress) {
        MimeMessagePreparator preparator = new MimeMessagePreparator() {
            public void prepare(MimeMessage mimeMessage) throws MessagingException {
                mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(mailaddress));
                mimeMessage.setFrom(new InternetAddress("swplao@googlemail.com"));
                mimeMessage.setSubject("[lao] Invitation to Whiteboard");
                mimeMessage.setText("Hello "+mailaddress+ ",\n"+
                		"you were invited you to a Whiteboard \n"+
						"You may login at ...\n"+ 
						"User: "+mailaddress+"\n\n"+
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
