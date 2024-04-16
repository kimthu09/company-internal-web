package com.ciw.backend.repository;

import com.ciw.backend.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UnitRepository extends JpaRepository<Unit, Long> {
	Optional<Unit> findByName(String name);
}
