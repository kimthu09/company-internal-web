package com.ciw.backend.payload.meetingroom;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MeetingRoomCalendarDayResponse {
	@Schema(name = "drawn")
	private List<MeetingRoomCalendarResponse> drawn;

	@Schema(name = "morning")
	private List<MeetingRoomCalendarResponse> morning;

	@Schema(name = "evening")
	private List<MeetingRoomCalendarResponse> evening;

	@Schema(name = "night")
	private List<MeetingRoomCalendarResponse> night;
}
