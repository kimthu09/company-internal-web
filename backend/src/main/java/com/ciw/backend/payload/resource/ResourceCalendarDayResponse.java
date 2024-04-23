package com.ciw.backend.payload.resource;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ResourceCalendarDayResponse {
	@Schema(name = "drawn")
	private List<ResourceCalendarResponse> drawn;

	@Schema(name = "morning")
	private List<ResourceCalendarResponse> morning;

	@Schema(name = "evening")
	private List<ResourceCalendarResponse> evening;

	@Schema(name = "night")
	private List<ResourceCalendarResponse> night;
}
