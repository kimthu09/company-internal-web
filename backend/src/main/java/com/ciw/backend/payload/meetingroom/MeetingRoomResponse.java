package com.ciw.backend.payload.meetingroom;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MeetingRoomResponse {
	@Schema(
			name = "id",
			example = "1"
	)
	private Long id;

	@Schema(
			name = "name",
			example = "Phòng họp A2"
	)
	private String name;

	@Schema(
			name = "location",
			example = "A2.3"
	)
	private String location;
}
