package com.ciw.backend.payload.unitshift;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UnitShiftDayResponse {
	@Schema(name = "day")
	private List<UnitShiftDayDetailResponse> day;

	@Schema(name = "night")
	private List<UnitShiftDayDetailResponse> night;
}
