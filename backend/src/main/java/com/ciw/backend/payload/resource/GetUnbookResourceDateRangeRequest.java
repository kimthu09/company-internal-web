package com.ciw.backend.payload.resource;

import com.ciw.backend.constants.Message;
import com.ciw.backend.payload.calendar.CalendarPart;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GetUnbookResourceDateRangeRequest {
	@Schema(
			name = "from"
	)
	@NotNull(message = Message.Calendar.MISSING_FROM_CALENDAR_PART)
	private CalendarPart from;

	@Schema(
			name = "to"
	)
	@NotNull(message = Message.Calendar.MISSING_TO_CALENDAR_PART)
	private CalendarPart to;
}
