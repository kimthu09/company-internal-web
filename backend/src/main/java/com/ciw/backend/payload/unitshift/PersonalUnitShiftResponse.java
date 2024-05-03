package com.ciw.backend.payload.unitshift;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PersonalUnitShiftResponse {
	@Schema(
			name = "day",
			example = "true"
	)
	private Boolean day;

	@Schema(
			name = "night",
			example = "true"
	)
	private Boolean night;
}
