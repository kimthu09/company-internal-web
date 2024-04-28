package com.ciw.backend.payload.unitshift;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChangeUnitShiftDetailRequest {
	@Schema(name = "isHasDayShift", example = "true")
	private boolean isHasDayShift = false;

	@Schema(name = "isHasNightShift", example = "true")
	private boolean isHasNightShift = false;
}
