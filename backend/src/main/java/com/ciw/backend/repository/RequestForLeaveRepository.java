package com.ciw.backend.repository;

import com.ciw.backend.entity.RequestForLeave;
import com.ciw.backend.entity.User;
import com.ciw.backend.payload.staff.StaffSpecs;
import com.google.api.gax.paging.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.awt.print.Pageable;
import java.util.List;

public interface RequestForLeaveRepository extends JpaRepository<RequestForLeave, Long>, JpaSpecificationExecutor<RequestForLeave> {
}
