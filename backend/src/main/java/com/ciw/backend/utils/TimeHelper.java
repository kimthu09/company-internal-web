package com.ciw.backend.utils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

public class TimeHelper {
	public static Date plus7Hours(Date date) {
		LocalDateTime dateTime = convertDateToLocalDateTime(date);
		return convertLocalDateTimeToDate(dateTime.plusHours(7));
	}

	public static LocalDateTime convertDateToLocalDateTime(Date date) {
		return date.toInstant()
				   .atZone(ZoneId.systemDefault())
				   .toLocalDateTime();
	}

	public static Date convertLocalDateTimeToDate(LocalDateTime localDateTime) {
		return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
	}
}
