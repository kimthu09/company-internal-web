package com.ciw.backend.payload.requestforleave;

import com.ciw.backend.constants.Message;
import com.ciw.backend.entity.RequestForLeave;
import com.ciw.backend.exception.AppException;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;

import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class RequestForLeaveSpecs {
	public static Specification<RequestForLeave> hasUnit(List<Long> units) {
		return (root, query, cb) -> root.join("createdBy").join("unit").get("id").in(units);
	}

	public static Specification<RequestForLeave> hasUser(List<Long> users) {
		return (root, query, cb) -> root.join("createdBy").get("id").in(users);
	}

	public static Specification<RequestForLeave> isDateAfter(String fromDateString) {
		Date fromDate;
		try {
			fromDate = Date.valueOf(LocalDate.parse(fromDateString,
													DateTimeFormatter.ofPattern("dd/MM/yyyy")));
		} catch (Exception e) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.TIME_INVALID_FORMAT_DD_MM_YYYY);
		}
		return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("fromDate"), fromDate);
	}

	public static Specification<RequestForLeave> isDateBefore(String toDateString) {
		Date toDate;
		try {
			toDate = Date.valueOf(LocalDate.parse(toDateString,
												  DateTimeFormatter.ofPattern("dd/MM/yyyy")));
		} catch (Exception e) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.TIME_INVALID_FORMAT_DD_MM_YYYY);
		}
		return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("toDate"), toDate);
	}

	public static Specification<RequestForLeave> isRejected(boolean isRejected) {
		return (root, query, cb) -> isRejected ?
									cb.isNotNull(root.get("rejectedBy")) :
									cb.isNull(root.get("rejectedBy"));
	}

	public static Specification<RequestForLeave> isApproved(boolean isApproved) {
		return (root, query, cb) -> isApproved ?
									cb.isNotNull(root.get("approvedBy")) :
									cb.isNull(root.get("approvedBy"));
	}

	public static Specification<RequestForLeave> isAccepted(boolean isAccepted) {
		return (root, query, cb) -> isAccepted ?
									cb.isNotNull(root.get("acceptedBy")) :
									cb.isNull(root.get("acceptedBy"));
	}
}
