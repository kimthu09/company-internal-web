package com.ciw.backend.payload.unitshift;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UnitShiftDayResponse {
	@Schema(name = "drawn")
	private List<UnitShiftDayDetailResponse> drawn;

	@Schema(name = "morning")
	private List<UnitShiftDayDetailResponse> morning;

	@Schema(name = "evening")
	private List<UnitShiftDayDetailResponse> evening;

	@Schema(name = "night")
	private List<UnitShiftDayDetailResponse> night;
}
