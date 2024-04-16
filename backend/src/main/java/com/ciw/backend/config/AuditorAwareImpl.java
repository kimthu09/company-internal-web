package com.ciw.backend.config;

import com.ciw.backend.entity.User;
import com.ciw.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.AuditorAware;
import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@RequiredArgsConstructor
class AuditorAwareImpl implements AuditorAware<User> {
	private UserRepository userRepository;

	@Override
	@NonNull
	public Optional<User> getCurrentAuditor() {
		User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return Optional.of(user);
	}
}