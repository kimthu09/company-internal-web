package com.ciw.backend.payload.unitshift;

import com.ciw.backend.payload.staff.SimpleStaffResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UnitShiftDayDetailAbsentResponse {
	@Schema(name = "id")
	private Long id;

	@Schema(name = "createdBy")
	private SimpleStaffResponse createdBy;
}
