package com.ciw.backend.utils;

import com.ciw.backend.constants.Message;
import com.ciw.backend.exception.AppException;
import org.springframework.http.HttpStatus;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

public class TimeHelper {
	public static SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");

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

	public static Date convertStringToDate(String s) {
		Date date;
		try {
			date = sdf.parse(s);
		} catch (ParseException e) {
			throw new AppException(HttpStatus.BAD_REQUEST, Message.TIME_INVALID_FORMAT_DD_MM_YYYY);
		}
		return date;
	}

	public static String convertDateToString(Date date) {
		return sdf.format(date);
	}
}
