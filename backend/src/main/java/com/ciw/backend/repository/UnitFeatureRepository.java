package com.ciw.backend.repository;

import com.ciw.backend.entity.IdClass.UnitFeatureId;
import com.ciw.backend.entity.UnitFeature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UnitFeatureRepository extends JpaRepository<UnitFeature, UnitFeatureId> {
	Optional<UnitFeature> findFirstByFeatureId(Long featureId);
}
