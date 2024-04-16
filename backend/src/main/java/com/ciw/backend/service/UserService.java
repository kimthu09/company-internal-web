package com.ciw.backend.service;

import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.User;
import com.ciw.backend.exception.AppException;
import com.ciw.backend.payload.auth.ChangePasswordRequest;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@RequiredArgsConstructor
@Service
public class UserService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public SimpleResponse changePassword(ChangePasswordRequest request) {
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String email = userDetails.getUsername();
		if (!passwordEncoder.matches(request.getOldPassword(), userDetails.getPassword())) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.User.OLD_PASSWORD_NOT_CORRECT);
		}
		User user = userRepository.findByEmail(email)
								  .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
																	  Message.USER_NOT_LOGIN));
		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		userRepository.save(user);
		return new SimpleResponse();
	}
}
