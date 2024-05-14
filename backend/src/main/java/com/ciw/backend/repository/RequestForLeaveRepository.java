package com.ciw.backend.repository;

import com.ciw.backend.entity.RequestForLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;

public interface RequestForLeaveRepository extends JpaRepository<RequestForLeave, Long>, JpaSpecificationExecutor<RequestForLeave> {
	@Query(
			"SELECT r " +
			"FROM RequestForLeave r " +
			"WHERE r.createdBy.id = :createdBy " +
			"AND (" +
			"(r.fromDate <= :fromDate AND r.toDate >= :toDate)" +
			"OR (r.fromDate >= :fromDate AND r.fromDate <= :toDate)" +
			"OR (r.toDate >= :fromDate AND r.toDate <= :toDate)" +
			")"
	)
	List<RequestForLeave> getAllByCreatedByAndInDateRange(Long createdBy, Date fromDate, Date toDate);
}
