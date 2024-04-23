package com.ciw.backend.payload.unitshift;

import com.ciw.backend.constants.Message;
import com.ciw.backend.payload.calendar.DayOfWeek;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class ChangeUnitShiftRequest {
	@Schema(name = "shifts")
	@NotNull(message = Message.UnitShift.NEED_TO_HAVE_SHIFT_INFORMATION)
	private Map<DayOfWeek, ChangeUnitShiftDetailRequest> shifts;
}
