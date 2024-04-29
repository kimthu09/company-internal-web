package com.ciw.backend.repository;

import com.ciw.backend.entity.IdClass.UnitShiftId;
import com.ciw.backend.entity.UnitShift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UnitShiftRepository extends JpaRepository<UnitShift, UnitShiftId>, JpaSpecificationExecutor<UnitShift> {
	List<UnitShift> findByUnitId(Long unitId);

	@Query("SELECT us FROM UnitShift us WHERE us.unit.id IN :unitIds")
	List<UnitShift> findAllByUnitIdIn(List<Long> unitIds);
}
