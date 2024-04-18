package com.ciw.backend.service;

import com.ciw.backend.constants.ApplicationConst;
import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.PasswordResetToken;
import com.ciw.backend.entity.User;
import com.ciw.backend.exception.AppException;
import com.ciw.backend.mail.MailSender;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.auth.AuthenticationRequest;
import com.ciw.backend.payload.auth.AuthenticationResponse;
import com.ciw.backend.payload.auth.EmailRequest;
import com.ciw.backend.payload.auth.ResetPasswordRequest;
import com.ciw.backend.repository.PasswordResetTokenRepository;
import com.ciw.backend.repository.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
	private final UserRepository userRepository;
	private final PasswordResetTokenRepository passwordResetTokenRepository;
	private final PasswordEncoder passwordEncoder;
	private final JWTService jwtService;
	private final AuthenticationManager authenticationManager;
	private final MailSender mailSender;

	@Transactional
	public AuthenticationResponse authenticate(AuthenticationRequest request) {
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						request.getEmail(),
						request.getPassword()
				)
		);
		User user = Common.findUserByEmail(request.getEmail(), userRepository);
		String jwtToken = jwtService.generateToken(user);
		return AuthenticationResponse.builder().token(jwtToken).build();
	}

	@Transactional
	public SimpleResponse sendEmailToResetPassword(EmailRequest request) {
		User user = Common.findUserByEmail(request.getEmail(), userRepository);

		String token = UUID.randomUUID().toString();
		passwordResetEmailLink(user, token);
		passwordResetTokenRepository.save(new PasswordResetToken(token, user));
		return new SimpleResponse();
	}

	@Transactional
	public SimpleResponse resetPassword(ResetPasswordRequest request, String token) {
		PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token)
																			.orElseThrow(() -> new AppException(
																					HttpStatus.BAD_REQUEST,
																					Message.TOKEN_NOT_EXIST));
		if (!passwordResetToken.isValid()) {
			throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, Message.TOKEN_EXPIRED);
		}
		User user = passwordResetToken.getUser();
		user.setPassword(passwordEncoder.encode(request.getPassword()));

		userRepository.save(user);
		return new SimpleResponse();
	}


	private void passwordResetEmailLink(User user, String token) {
		String url = generateResetPasswordUrl(token);
		try {
			mailSender.sendResetPasswordEmail(url, user);
		} catch (MessagingException | IOException e) {
			e.printStackTrace(System.out);
			throw new RuntimeException(Message.CAN_NOT_SEND_EMAIL);
		}
	}

	private String generateResetPasswordUrl(String token) {
		return ApplicationConst.FE_URL + ApplicationConst.RESET_PASSWORD_FE_PATH + token;
	}
}
