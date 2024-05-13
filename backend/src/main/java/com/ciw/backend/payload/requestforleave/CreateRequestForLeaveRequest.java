package com.ciw.backend.payload.requestforleave;

import com.ciw.backend.constants.Message;
import com.ciw.backend.payload.calendar.ShiftType;
import com.ciw.backend.utils.validation.date.ValidDDMMYYYYFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class CreateRequestForLeaveRequest {
	@Schema(
			name = "date",
			example = "12/12/2000"
	)
	@ValidDDMMYYYYFormat(message = Message.TIME_INVALID_FORMAT_DD_MM_YYYY)
	@NotNull(message = Message.TIME_INVALID_FORMAT_DD_MM_YYYY)
	private String date;

	@Enumerated(EnumType.STRING)
	@Schema(
			name = "shiftType",
			example = "DAY"
	)
	private ShiftType shiftType;

	@Schema(
			name = "note",
			example = "Ghi chú"
	)
	@Length(
			max = 200,
			message = Message.RequestForLeave.NOTE_VALIDATE
	)
	private String note = "";
}
