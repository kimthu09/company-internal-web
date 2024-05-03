package com.ciw.backend.payload.meetingroom;

import com.ciw.backend.payload.user.SimpleUserResponse;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MeetingRoomCalendarResponse {
	@Schema(
			name = "id",
			example = "1"
	)
	private Long id;

	@Schema(name = "meetingRoom")
	private MeetingRoomResponse meetingRoom;

	@Schema(name = "createdBy")
	private SimpleUserResponse createdBy;

	@Schema(
			name = "note",
			example = "Ghi chú"
	)
	private String note;
}
