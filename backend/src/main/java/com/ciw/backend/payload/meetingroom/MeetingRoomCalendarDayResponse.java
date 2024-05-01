package com.ciw.backend.payload.meetingroom;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MeetingRoomCalendarDayResponse {
	@Schema(name = "date")
	private String date;

	@Schema(name = "day")
	private List<MeetingRoomCalendarResponse> day;

	@Schema(name = "night")
	private List<MeetingRoomCalendarResponse> night;
}
