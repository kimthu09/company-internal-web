package com.ciw.backend.payload.user;

import com.ciw.backend.entity.User;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecs {
	public static Specification<User> hasName(String name) {
		return (root, query, cb) -> cb.like(root.get("name"), "%" + name + "%");
	}

	public static Specification<User> hasEmail(String email) {
		return (root, query, cb) -> cb.like(root.get("email"), "%" + email + "%");
	}

	public static Specification<User> hasPhone(String phone) {
		return (root, query, cb) -> cb.like(root.get("phone"), "%" + phone + "%");
	}

	public static Specification<User> hasUnit(String unit) {
		return (root, query, cb) -> cb.like(root.get("unit").get("name"), "%" + unit + "%");
	}

	public static Specification<User> isMale(Boolean male) {
		return (root, query, cb) -> cb.equal(root.get("male"), male);
	}

	public static Specification<User> hasDOBinMonth(Integer dobMonth) {
		String formattedNumber = String.format("%02d", dobMonth);
		return (root, query, cb) -> cb.like(root.get("dob"), "___" + formattedNumber + "_____");
	}

	public static Specification<User> hasDOBinYear(Integer dobYear) {
		String formattedNumber = String.format("%02d", dobYear);
		return (root, query, cb) -> cb.like(root.get("dob"), "______" + formattedNumber);
	}

	public static Specification<User> isNotDeleted() {
		return (root, query, builder) -> builder.isFalse(root.get("isDeleted"));
	}

	public static Specification<User> notHaveEmail(String email) {
		return (root, query, builder) -> builder.notEqual(root.get("email"), email);
	}
}