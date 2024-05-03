package com.ciw.backend.payload.unitshift;

import com.ciw.backend.constants.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PersonalUnitShiftRequest {
	@Schema(name = "from")
	@NotNull(message = Message.UnitShift.FROM_VALIDATE)
	private String from;

	@Schema(name = "to")
	@NotNull(message = Message.UnitShift.TO_VALIDATE)
	private String to;
}
