package com.ciw.backend.repository;

import com.ciw.backend.entity.RequestForLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface RequestForLeaveRepository extends JpaRepository<RequestForLeave, Long>, JpaSpecificationExecutor<RequestForLeave> {
}
