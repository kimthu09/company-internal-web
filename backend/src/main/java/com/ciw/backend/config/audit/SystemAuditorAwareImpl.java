package com.ciw.backend.config.audit;

import com.ciw.backend.entity.Post;
import com.ciw.backend.entity.User;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.AuditorAware;
import org.springframework.lang.NonNull;

import java.util.Date;
import java.util.Optional;

@RequiredArgsConstructor
public class SystemAuditorAwareImpl implements AuditorAware<User> {
	@Override
	@NonNull
	public Optional<User> getCurrentAuditor() {
		return Optional.empty();
	}

	@PrePersist
	public void prePersist(Object entity) {
		if (entity instanceof Post post) {
			Date currentDate = new Date();
			post.setCreatedAt(currentDate);
			post.setUpdatedAt(currentDate);
		}
	}

	@PreUpdate
	public void preUpdate(Object entity) {
		if (entity instanceof Post post) {
			post.setUpdatedAt(new Date());
		}
	}
}
