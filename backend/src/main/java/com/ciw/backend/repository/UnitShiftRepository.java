package com.ciw.backend.repository;

import com.ciw.backend.entity.IdClass.UnitShiftId;
import com.ciw.backend.entity.UnitShift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface UnitShiftRepository extends JpaRepository<UnitShift, UnitShiftId>, JpaSpecificationExecutor<UnitShift> {
	List<UnitShift> findByUnitId(Long unitId);
}
