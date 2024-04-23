package com.ciw.backend.repository;

import com.ciw.backend.entity.MeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MeetingRoomRepository extends JpaRepository<MeetingRoom, Long>, JpaSpecificationExecutor<MeetingRoom> {
}
