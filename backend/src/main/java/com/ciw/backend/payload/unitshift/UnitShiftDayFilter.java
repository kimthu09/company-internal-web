package com.ciw.backend.payload.unitshift;

import com.ciw.backend.constants.Message;
import com.ciw.backend.utils.validation.dob.ValidDDMMYYYYFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UnitShiftDayFilter {
	@Schema(name = "date", example = "12/12/2000")
	@ValidDDMMYYYYFormat(message = Message.Calendar.DATE_VALIDATE)
	@NotNull(message = Message.UnitShift.FROM_VALIDATE)
	private String from;

	@Schema(name = "date", example = "12/12/2000")
	@ValidDDMMYYYYFormat(message = Message.Calendar.DATE_VALIDATE)
	@NotNull(message = Message.UnitShift.TO_VALIDATE)
	private String to;
}
