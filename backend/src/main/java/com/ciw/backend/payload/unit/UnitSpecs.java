package com.ciw.backend.payload.unit;

import com.ciw.backend.entity.Unit;
import org.springframework.data.jpa.domain.Specification;

public class UnitSpecs {
	public static Specification<Unit> hasName(String name) {
		return (root, query, cb) -> cb.like(root.get("name"), "%" + name + "%");
	}

	public static Specification<Unit> hasManager(String manager) {
		return (root, query, cb) -> cb.like(root.get("manager").get("name"), "%" + manager + "%");
	}
}
