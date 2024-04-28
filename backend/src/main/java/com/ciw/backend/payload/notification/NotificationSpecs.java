package com.ciw.backend.payload.notification;

import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.Notification;
import com.ciw.backend.exception.AppException;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;

import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class NotificationSpecs {
	public static Specification<Notification> hasReceiver(String receiverId) {
		return (root, query, cb) -> cb.equal(root.get("toUser").get("id"), receiverId);
	}

	public static Specification<Notification> hasSender(String senderId) {
		return (root, query, cb) -> cb.equal(root.get("fromUser").get("id"), senderId);
	}

	public static Specification<Notification> isDateCreatedAfter(String from) {
		Date fromDate;
		try {
			fromDate = Date.valueOf(LocalDate.parse(from,
													DateTimeFormatter.ofPattern("dd/MM/yyyy")));
		} catch (Exception e) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.TIME_INVALID_FORMAT_DD_MM_YYYY);
		}
		return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), fromDate);
	}

	public static Specification<Notification> isDateCreatedBefore(String to) {
		Date toDate;
		try {
			toDate = Date.valueOf(LocalDate.parse(to,
												  DateTimeFormatter.ofPattern("dd/MM/yyyy")));
		} catch (Exception e) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.TIME_INVALID_FORMAT_DD_MM_YYYY);
		}
		return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("createdAt"), toDate);
	}
}
