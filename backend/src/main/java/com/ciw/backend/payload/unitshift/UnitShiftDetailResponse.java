package com.ciw.backend.payload.unitshift;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UnitShiftDetailResponse {
	@Schema(name = "isHasDrawnShift", example = "true")
	private boolean isHasDrawnShift;

	@Schema(name = "isHasMorningShift", example = "true")
	private boolean isHasMorningShift;

	@Schema(name = "isHasEveningShift", example = "false")
	private boolean isHasEveningShift;

	@Schema(name = "isHasNightShift", example = "true")
	private boolean isHasNightShift;
}