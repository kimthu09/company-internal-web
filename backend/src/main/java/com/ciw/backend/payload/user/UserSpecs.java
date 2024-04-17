package com.ciw.backend.payload.user;

import com.ciw.backend.entity.User;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

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
	public static Specification<User> hasDOBinMonth(Integer dobMonth) {
		return (root, query, cb) -> {
			Path<String> dobPath = root.get("dob");
			Expression<LocalDate> dobExpression = cb.function("TO_DATE", LocalDate.class, dobPath, cb.literal("dd/MM/yyyy"));
			Expression<Integer> dobMonthExpression = cb.function("MONTH", Integer.class, dobExpression);
			return cb.equal(dobMonthExpression, dobMonth);
		};
	}
	public static Specification<User> hasDOBinYear(Integer dobYear) {
		return (root, query, cb) -> {
			Path<String> dobPath = root.get("dob");
			Expression<LocalDate> dobExpression = cb.function("TO_DATE", LocalDate.class, dobPath, cb.literal("dd/MM/yyyy"));
			Expression<Integer> dobMonthExpression = cb.function("YEAR", Integer.class, dobExpression);
			return cb.equal(dobMonthExpression, dobYear);
		};
	}
}