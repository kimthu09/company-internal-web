package com.ciw.backend.mail;

import com.ciw.backend.entity.User;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Properties;


@RequiredArgsConstructor
@Component
public class MailSender {
	@Value("${gmail.username}") private String MAIL_USERNAME;
	@Value("${gmail.password}") private String MAIL_PASSWORD;

	@Async
	public void sendResetPasswordEmail(String url, User user) {
		Session session = setUpSession();

		try {
			Message message = setUpMessageForResetPassword(session, user.getEmail(), user.getName(), url);
			Transport.send(message);
		} catch (Exception e) {
			System.err.println("Error sending email: " + e.getMessage());
			e.printStackTrace(System.out);
		}
	}

	private Message setUpMessageForResetPassword(Session session, String emailTo, String nameTo, String url) throws
			MessagingException {
		Message message = new MimeMessage(session);

		message.setFrom(new InternetAddress("from@gmail.com"));
		message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(emailTo));
		message.setSubject("Reset password");
		String mailContent = "<p>Xin chào, " + nameTo + ", </p>" +
							 "<p>Cảm ơn đã sử dụng dịch vụ của chúng tôi.</p>" +
							 "<p>Hãy theo link này để có thể reset mật khẩu.</p>" +
							 "<a href=\"" + url + "\">Reset Password</a>" +
							 "<p>Chú ý: Link này chỉ có hiệu lực trong vòng 5 phút.</p>" +
							 "<p>Cảm ơn</p>";
		message.setText(mailContent);
		message.setContent(mailContent, "text/html;charset=utf-8");
		return message;
	}

	private Session setUpSession() {
		Properties prop = new Properties();
		prop.put("mail.smtp.host", "smtp.gmail.com");
		prop.put("mail.smtp.port", "465");
		prop.put("mail.smtp.auth", "true");
		prop.put("mail.smtp.socketFactory.port", "465");
		prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

		return Session.getInstance(prop, new jakarta.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(MAIL_USERNAME, MAIL_PASSWORD);
			}
		});
	}

	@Async
	public void sendEmail(String title, String description, List<String> receiverMails) {
		Session session = setUpSession();

		Transport t = null;
		try {
			Address[] cc = new Address[receiverMails.size()];
			int index = 0;
			for (String receiverMail : receiverMails) {
				Address internetAddress = new InternetAddress(receiverMail);
				cc[index++] = internetAddress;
			}

			Message message = setUpMessageForMail(session, title, description, cc);

			t = session.getTransport("smtp");
			t.connect();
			t.sendMessage(message, message.getAllRecipients());
		} catch (Exception e) {
			System.err.println("Error sending email: " + e.getMessage());
			e.printStackTrace(System.out);
		} finally {
			if (t != null) {
				try {
					t.close();
				} catch (MessagingException me) {
					System.err.println("Error closing transport: " + me.getMessage());
					me.printStackTrace(System.out);
				}
			}
		}
	}

	private Message setUpMessageForMail(Session session, String title, String description, Address[] addresses) throws
			MessagingException {
		Message message = new MimeMessage(session);

		message.setFrom(new InternetAddress("from@gmail.com"));
		message.setRecipients(Message.RecipientType.BCC, addresses);
		message.setSubject(title);
		message.setText(description);
		message.setContent(description, "text/html;charset=utf-8");
		return message;
	}
}
