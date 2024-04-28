package com.ciw.backend.repository;

import com.ciw.backend.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface UnitRepository extends JpaRepository<Unit, Long>, JpaSpecificationExecutor<Unit> {
	Optional<Unit> findByName(String name);
	Optional<Unit> findByManagerId(Long managerId);
}
