package com.ciw.backend.repository;

import com.ciw.backend.entity.UnitShiftAbsent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Date;
import java.util.List;

public interface UnitShiftAbsentRepository extends JpaRepository<UnitShiftAbsent, Long>, JpaSpecificationExecutor<UnitShiftAbsent> {
	List<UnitShiftAbsent> findByDateBetween(Date from, Date to);
}
