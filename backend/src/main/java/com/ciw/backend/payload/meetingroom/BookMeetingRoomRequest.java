package com.ciw.backend.payload.meetingroom;

import com.ciw.backend.constants.Message;
import com.ciw.backend.payload.calendar.CalendarPart;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookMeetingRoomRequest {
	@Schema(name = "from")
	@NotNull(message = Message.MeetingRoom.BOOKED_FROM_VALIDATE)
	private CalendarPart from;

	@Schema(name = "to")
	@NotNull(message = Message.MeetingRoom.BOOKED_TO_VALIDATE)
	private CalendarPart to;

	@Schema(
			name = "note",
			example = "Ghi chú"
	)
	private String note = "";
}
