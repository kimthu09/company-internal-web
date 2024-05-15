package com.ciw.backend.payload.unit;

import com.ciw.backend.constants.ApplicationConst;
import com.ciw.backend.entity.Unit;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class UnitSpecs {
	public static Specification<Unit> notIncludeAdmin() {
		return (root, query, cb) -> cb.notEqual(root.get("name"), ApplicationConst.ADMIN_UNIT_NAME);
	}

	public static Specification<Unit> hasName(String name) {
		return (root, query, cb) -> cb.like(root.get("name"), "%" + name + "%");
	}

	public static Specification<Unit> hasManager(List<Long> managerIds) {
		return (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			for (Long managerId : managerIds) {
				Predicate predicate = cb.equal(root.get("managerId"), managerId);
				predicates.add(predicate);
			}

			return cb.or(predicates.toArray(new Predicate[0]));
		};
	}
}
