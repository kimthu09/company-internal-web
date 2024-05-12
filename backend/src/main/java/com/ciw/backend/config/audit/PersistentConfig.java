package com.ciw.backend.config.audit;

import com.ciw.backend.entity.User;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class PersistentConfig {
	@Bean
	public AuditorAware<User> auditorProvider() {
		return new AuditorAwareImpl();
	}

	@Bean(name = "systemAudit")
	public SystemAuditorAwareImpl systemAuditorProvider() {
		return new SystemAuditorAwareImpl();
	}
}
