package com.ciw.backend.payload.meetingroom;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GetUnbookMeetingRoomResponse {
	@Schema(name = "day")
	private List<MeetingRoomResponse> day;

	@Schema(name = "night")
	private List<MeetingRoomResponse> night;
}
