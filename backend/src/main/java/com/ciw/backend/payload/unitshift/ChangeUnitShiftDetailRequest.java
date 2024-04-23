package com.ciw.backend.payload.unitshift;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChangeUnitShiftDetailRequest {
	@Schema(name = "isHasDrawnShift", example = "true")
	private boolean isHasDrawnShift = false;

	@Schema(name = "isHasMorningShift", example = "true")
	private boolean isHasMorningShift = false;

	@Schema(name = "isHasEveningShift", example = "false")
	private boolean isHasEveningShift = false;

	@Schema(name = "isHasNightShift", example = "true")
	private boolean isHasNightShift = false;
}
