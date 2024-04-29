package com.ciw.backend.repository;

import com.ciw.backend.entity.MeetingRoomCalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Date;
import java.util.List;

public interface MeetingRoomCalendarRepository extends JpaRepository<MeetingRoomCalendar, Long>, JpaSpecificationExecutor<MeetingRoomCalendar> {
	boolean existsByMeetingRoomIdAndDateAfter(Long meetingRoomId, Date date);

	void deleteByMeetingRoomId(Long meetingRoomId);

	List<MeetingRoomCalendar> getByDate(Date date);
}
