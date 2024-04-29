package com.ciw.backend.repository;

import com.ciw.backend.entity.UnitShiftAbsent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface UnitShiftAbsentRepository extends JpaRepository<UnitShiftAbsent, Long>, JpaSpecificationExecutor<UnitShiftAbsent> {
	@Query("SELECT u FROM UnitShiftAbsent u WHERE u.date BETWEEN :from AND :to AND u.unit.id IN :unitIds")
	List<UnitShiftAbsent> findByDateBetweenAndUnitIdInList(Date from, Date to, List<Long> unitIds);

	@Query("SELECT u FROM UnitShiftAbsent u WHERE u.date BETWEEN :from AND :to")
	List<UnitShiftAbsent> findByDateBetween(Date from, Date to);

	@Query("SELECT u FROM UnitShiftAbsent u WHERE u.date BETWEEN :from AND :to AND u.unit.id = :unitId")
	List<UnitShiftAbsent> findByDateBetweenAndUnitIdEqual(Date from, Date to, Long unitId);

	List<UnitShiftAbsent> findByUnitId(Long unitId);

}
