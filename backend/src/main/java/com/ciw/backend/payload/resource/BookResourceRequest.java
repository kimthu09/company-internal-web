package com.ciw.backend.payload.resource;

import com.ciw.backend.constants.Message;
import com.ciw.backend.payload.calendar.CalendarPart;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookResourceRequest {
	@Schema(name = "from")
	@NotNull(message = Message.Resource.BOOKED_FROM_VALIDATE)
	private CalendarPart from;

	@Schema(name = "to")
	@NotNull(message = Message.Resource.BOOKED_TO_VALIDATE)
	private CalendarPart to;
}
