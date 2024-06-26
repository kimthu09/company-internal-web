package com.ciw.backend.payload.resource;

import com.ciw.backend.payload.staff.SimpleStaffResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResourceCalendarResponse {
	@Schema(
			name = "id",
			example = "1"
	)
	private Long id;

	@Schema(name = "resource")
	private ResourceResponse resource;

	@Schema(name = "createdBy")
	private SimpleStaffResponse createdBy;

	@Schema(
			name = "note",
			example = "Ghi chú"
	)
	private String note;
}
