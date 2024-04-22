package com.ciw.backend.payload.calendar;

import com.ciw.backend.constants.Message;
import com.ciw.backend.utils.validation.dob.ValidDOBFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CalendarPart {
	@Schema(name = "date", example = "12/12/2000")
	@ValidDOBFormat(message = Message.Calendar.DATE_VALIDATE)
	@NotNull(message = Message.Calendar.DATE_VALIDATE)
	private String date;

	@Schema(name = "shiftType", example = "DRAWN")
	@NotNull(message = Message.Calendar.SHIFT_TYPE_VALIDATE)
	private ShiftType shiftType;
}
