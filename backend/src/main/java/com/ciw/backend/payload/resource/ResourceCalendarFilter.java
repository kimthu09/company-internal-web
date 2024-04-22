package com.ciw.backend.payload.resource;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class ResourceCalendarFilter {
	@Schema(name = "bookedBy", example = "1")
	private String bookedBy;

	@Schema(name = "createdBy", example = "1")
	private String createdBy;

	@Schema(name = "meetingRoom", example = "1")
	private String meetingRoom;

	@Schema(name = "from", example = "12/12/2000")
	private String from;

	@Schema(name = "to", example = "12/12/2000")
	private String to;
}
