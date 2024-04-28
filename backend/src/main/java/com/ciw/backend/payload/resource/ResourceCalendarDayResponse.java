package com.ciw.backend.payload.resource;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ResourceCalendarDayResponse {
	@Schema(name = "day")
	private List<ResourceCalendarResponse> day;

	@Schema(name = "night")
	private List<ResourceCalendarResponse> night;
}
