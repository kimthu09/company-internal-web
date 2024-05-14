package com.ciw.backend.payload.unitshift;

import com.ciw.backend.payload.unit.SimpleUnitResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UnitShiftDayDetailResponse {
	@Schema(name = "unit")
	private SimpleUnitResponse unit;

	@Schema(name = "absent")
	private UnitShiftDayDetailAbsentResponse absent;
}
