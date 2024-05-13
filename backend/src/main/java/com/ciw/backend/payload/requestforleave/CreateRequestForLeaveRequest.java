package com.ciw.backend.payload.requestforleave;

import com.ciw.backend.constants.Message;
import com.ciw.backend.payload.calendar.ShiftType;
import com.ciw.backend.utils.validation.date.ValidDDMMYYYYFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class CreateRequestForLeaveRequest {
	@Schema(
			name = "fromDate",
			example = "12/12/2000"
	)
	@ValidDDMMYYYYFormat(message = Message.TIME_INVALID_FORMAT_DD_MM_YYYY)
	@NotNull(message = Message.TIME_INVALID_FORMAT_DD_MM_YYYY)
	private String fromDate;

	@Enumerated(EnumType.STRING)
	@Schema(
			name = "fromShiftType",
			example = "DAY"
	)
	private ShiftType fromShiftType;

	@Schema(
			name = "toDate",
			example = "12/12/2000"
	)
	@ValidDDMMYYYYFormat(message = Message.TIME_INVALID_FORMAT_DD_MM_YYYY)
	@NotNull(message = Message.TIME_INVALID_FORMAT_DD_MM_YYYY)
	private String toDate;

	@Enumerated(EnumType.STRING)
	@Schema(
			name = "toShiftType",
			example = "DAY"
	)
	private ShiftType toShiftType;

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
