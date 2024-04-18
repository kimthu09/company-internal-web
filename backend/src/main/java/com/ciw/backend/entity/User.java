package com.ciw.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
		name = "user",
		uniqueConstraints = {@UniqueConstraint(columnNames = {"email"}, name = "Email")}
)
public class User implements UserDetails {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	@Length(min = 1, max = 200)
	private String name;

	@Column(unique = true, nullable = false)
	@Email
	@NotEmpty
	private String email;

	@Column(nullable = false)
	private String password;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "unit_id", nullable = false)
	private Unit unit;

	@Column(nullable = false, columnDefinition = "text")
	private String image;

	@Column(nullable = false)
	@Length(min = 10, max = 10)
	private String dob;

	@Column(nullable = false)
	@Length(min = 1, max = 50)
	private String address;

	@Column(nullable = false)
	@Length(min = 10, max = 11)
	private String phone;

	@Column(nullable = false)
	private boolean male;

	@Column(nullable = false)
	private boolean isDeleted = false;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		List<SimpleGrantedAuthority> res = unit.getUnitFeatures().stream()
											   .map(unitFeature -> new SimpleGrantedAuthority(unitFeature.getFeature()
																										 .getCode()))
											   .toList();
		System.out.println(res);
		return res;
	}

	@Override public String getUsername() {
		return email;
	}

	@Override public boolean isAccountNonExpired() {
		return true;
	}

	@Override public boolean isAccountNonLocked() {
		return true;
	}

	@Override public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override public boolean isEnabled() {
		return true;
	}
}
