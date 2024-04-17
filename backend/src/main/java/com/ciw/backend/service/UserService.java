package com.ciw.backend.service;

import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.Unit;
import com.ciw.backend.entity.UnitFeature;
import com.ciw.backend.entity.User;
import com.ciw.backend.exception.AppException;
import com.ciw.backend.payload.SimpleResponse;
import com.ciw.backend.payload.auth.ChangePasswordRequest;
import com.ciw.backend.payload.feature.FeatureResponse;
import com.ciw.backend.payload.unit.SimpleUnitWithFeatureResponse;
import com.ciw.backend.payload.user.ProfileResponse;
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

	public ProfileResponse seeProfile() {
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String email = userDetails.getUsername();

		User user = userRepository.findByEmail(email)
								  .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST,
																	  Message.USER_NOT_LOGIN));

		return mapToProfileResponse(user);
	}

	private ProfileResponse mapToProfileResponse(User user) {
		return ProfileResponse.builder()
							  .id(user.getId())
							  .name(user.getName())
							  .email(user.getEmail())
							  .unit(mapToSimpleUnitWithFeature(user.getUnit()))
							  .build();
	}

	private SimpleUnitWithFeatureResponse mapToSimpleUnitWithFeature(Unit unit) {
		return SimpleUnitWithFeatureResponse.builder()
											.id(unit.getId())
											.name(unit.getName())
											.features(unit.getUnitFeatures()
														  .stream()
														  .map(this::mapToFeatureResponse)
														  .toList())
											.build();
	}

	private FeatureResponse mapToFeatureResponse(UnitFeature unitFeature) {
		return FeatureResponse.builder()
							  .id(unitFeature.getFeature().getId())
							  .name(unitFeature.getFeature().getName())
							  .build();
	}
}
