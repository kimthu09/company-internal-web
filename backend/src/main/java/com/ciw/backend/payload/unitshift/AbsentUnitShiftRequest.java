package com.ciw.backend.payload.unitshift;

import com.ciw.backend.constants.Message;
import com.ciw.backend.payload.calendar.CalendarPart;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AbsentUnitShiftRequest {
	@Schema(name = "from")
	@NotNull(message = Message.UnitShift.FROM_VALIDATE)
	private CalendarPart from;

	@Schema(name = "to")
	@NotNull(message = Message.UnitShift.TO_VALIDATE)
	private CalendarPart to;
}
