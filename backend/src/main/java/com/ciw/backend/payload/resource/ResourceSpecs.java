package com.ciw.backend.payload.resource;

import com.ciw.backend.entity.Resource;
import org.springframework.data.jpa.domain.Specification;

public class ResourceSpecs {
	public static Specification<Resource> hasName(String name) {
		return (root, query, cb) -> cb.like(root.get("name"), "%" + name + "%");
	}
}