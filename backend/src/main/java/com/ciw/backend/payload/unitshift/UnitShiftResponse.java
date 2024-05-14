package com.ciw.backend.payload.unitshift;

import com.ciw.backend.payload.calendar.DayOfWeek;
import com.ciw.backend.payload.unit.SimpleUnitResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class UnitShiftResponse {
	@Schema(name = "shifts")
	private Map<DayOfWeek, UnitShiftDetailResponse> shifts;

	@Schema(name = "unit")
	private SimpleUnitResponse unit;
}
