package com.ciw.backend;

import com.ciw.backend.entity.Feature;
import com.ciw.backend.entity.Unit;
import com.ciw.backend.entity.User;
import com.ciw.backend.repository.FeatureRepository;
import com.ciw.backend.repository.UnitRepository;
import com.ciw.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@RequiredArgsConstructor
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class BackendApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	private final UserRepository userRepository;
	private final UnitRepository unitRepository;
	private final FeatureRepository featureRepository;
	private final PasswordEncoder passwordEncoder;

	@Override public void run(String... args) throws Exception {
		Feature feature = featureRepository.findById(1L).orElse(Feature.builder().name("SAY_HI").build());
		if (feature.getId() == null) {
			feature = featureRepository.save(feature);
		}

		Unit emptyUnit = unitRepository.findByName("temp").orElse(Unit.builder().name("temp").build());
		if (emptyUnit.getId() == null) {
			unitRepository.save(emptyUnit);
		}

		Unit unit = unitRepository.findByName("admin").orElse(Unit.builder().name("admin").build());
		if (unit.getId() == null) {
			unit = unitRepository.save(unit);
		}

		User user = userRepository.findByEmail("admin@gmail.com").orElse(
				User.builder()
					.email("admin@gmail.com")
					.unit(unit)
					.password(passwordEncoder.encode("123456"))
					.name("admin")
					.build()
		);
		if (user.getId() == null) {
			userRepository.save(user);
		}
	}
}
