package com.ciw.backend.mail;

import com.ciw.backend.entity.User;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Properties;


@RequiredArgsConstructor
@Component
public class MailSender {
	@Value("${gmail.username}")
	private String MAIL_USERNAME;
	@Value("${gmail.password}")
	private String MAIL_PASSWORD;

	public void sendResetPasswordEmail(String url, User user) throws MessagingException, IOException {
		Session session = setUpSession();

		Message message = setUpMessageForResetPassword(session, user.getEmail(), user.getName(), url);

		Transport.send(message);
	}

	private Message setUpMessageForResetPassword(Session session, String emailTo, String nameTo, String url) throws
			MessagingException {
		Message message = new MimeMessage(session);

		message.setFrom(new InternetAddress("from@gmail.com"));
		message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(emailTo));
		message.setSubject("Reset password");
		String mailContent = "<p> Hi, " + nameTo + ", </p>" + "<p>Thank you for using our service," +
							 "Please, follow the link below to reset your password.</p>" +
							 "<a href=\"" + url + "\">Reset Password</a>" +
							 "<p> Notice: This link will be expired after 5 minutes.</p>" +
							 "<p> Thank you <br> Reset User's Password Portal Service";
		message.setText(mailContent);
		message.setContent(mailContent, "text/html");
		return message;
	}

	private Session setUpSession() {
		final String username = "nguyenlengocmai000@gmail.com";
		final String password = "fyfo xyfe xswy toav";

		Properties prop = new Properties();
		prop.put("mail.smtp.host", "smtp.gmail.com");
		prop.put("mail.smtp.port", "465");
		prop.put("mail.smtp.auth", "true");
		prop.put("mail.smtp.socketFactory.port", "465");
		prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

		return Session.getInstance(prop, new jakarta.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		});
	}
}
