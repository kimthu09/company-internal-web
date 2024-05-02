package com.ciw.backend.config;

import com.ciw.backend.utils.security.JWTAuthenticationEntryPoint;
import com.ciw.backend.utils.security.JWTAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {
	private final JWTAuthenticationEntryPoint jwtAuthenticationEntryPoint;
	private final JWTAuthenticationFilter jwtAuthenticationFilter;
	private final AuthenticationProvider authenticationProvider;

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
		httpSecurity.csrf(AbstractHttpConfigurer::disable)
					.authorizeHttpRequests(auth -> auth.requestMatchers("/api/v1/auth/**").permitAll()
													   .requestMatchers("/swagger-ui/**").permitAll()
													   .requestMatchers("/v3/api-docs/**").permitAll()
													   .anyRequest().authenticated())
					.exceptionHandling(exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint))
					.sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
					.authenticationProvider(authenticationProvider)
					.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
		return httpSecurity.build();
	}
}

