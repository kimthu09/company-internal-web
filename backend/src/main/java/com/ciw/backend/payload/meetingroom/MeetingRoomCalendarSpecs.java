package com.ciw.backend.payload.meetingroom;

import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.MeetingRoomCalendar;
import com.ciw.backend.exception.AppException;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;

import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class MeetingRoomCalendarSpecs {
	public static Specification<MeetingRoomCalendar> isCreatedBy(String createdById) {
		return (root, query, cb) -> cb.equal(root.get("createdBy").get("id"), createdById);
	}

	public static Specification<MeetingRoomCalendar> hasMeetingRoom(String meetingRoom) {
		return (root, query, cb) -> cb.equal(root.get("meetingRoom").get("id"), meetingRoom);
	}

	public static Specification<MeetingRoomCalendar> isDateBookedAtAfter(String from) {
		Date fromDate;
		try {
			fromDate = Date.valueOf(LocalDate.parse(from,
													DateTimeFormatter.ofPattern("dd/MM/yyyy")));
		} catch (Exception e) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.TIME_INVALID_FORMAT_DD_MM_YYYY);
		}
		return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("date"), fromDate);
	}

	public static Specification<MeetingRoomCalendar> isDateBookedAtBefore(String to) {
		Date toDate;
		try {
			toDate = Date.valueOf(LocalDate.parse(to,
												  DateTimeFormatter.ofPattern("dd/MM/yyyy")));
		} catch (Exception e) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.TIME_INVALID_FORMAT_DD_MM_YYYY);
		}
		return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("date"), toDate);
	}
}
