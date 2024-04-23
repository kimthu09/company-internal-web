package com.ciw.backend.payload.resource;

import com.ciw.backend.constants.Message;
import com.ciw.backend.payload.calendar.CalendarPart;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookResourceRequest {
	@Schema(name = "bookedBy", example = "1")
	@NotNull(message = Message.Resource.BOOKED_BY_CAN_NOT_BE_NULL)
	private Long bookedBy;

	@Schema(name = "from")
	@NotNull(message = Message.Resource.BOOKED_FROM_VALIDATE)
	private CalendarPart from;

	@Schema(name = "to")
	@NotNull(message = Message.Resource.BOOKED_TO_VALIDATE)
	private CalendarPart to;
}
