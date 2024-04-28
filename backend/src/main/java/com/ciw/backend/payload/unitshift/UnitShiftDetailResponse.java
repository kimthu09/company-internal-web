package com.ciw.backend.payload.unitshift;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UnitShiftDetailResponse {
	@Schema(name = "isHasDayShift", example = "true")
	private boolean isHasDayShift;

	@Schema(name = "isHasNightShift", example = "true")
	private boolean isHasNightShift;
}