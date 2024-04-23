package com.ciw.backend.repository;

import com.ciw.backend.entity.ResourceCalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Date;

public interface ResourceCalendarRepository extends JpaRepository<ResourceCalendar, Long>, JpaSpecificationExecutor<ResourceCalendar> {
	boolean existsByResourceIdAndDateAfter(Long resourceId, Date date);

	void deleteByResourceId(Long resourceId);
}
