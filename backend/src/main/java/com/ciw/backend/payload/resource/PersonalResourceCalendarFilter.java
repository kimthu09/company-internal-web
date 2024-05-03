package com.ciw.backend.payload.resource;

import com.ciw.backend.constants.Message;
import com.ciw.backend.utils.validation.date.ValidDDMMYYYYFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class PersonalResourceCalendarFilter {
	@Schema(
			name = "resource",
			example = "1"
	)
	private String resource;

	@Schema(
			name = "from",
			example = "12/12/2000"
	)
	@ValidDDMMYYYYFormat(message = Message.Calendar.DATE_VALIDATE)
	private String from;

	@Schema(
			name = "to",
			example = "12/12/2000"
	)
	@ValidDDMMYYYYFormat(message = Message.Calendar.DATE_VALIDATE)
	private String to;
}
