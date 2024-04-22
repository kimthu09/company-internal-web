package com.ciw.backend.payload.meetingroom;

import com.ciw.backend.constants.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class UpdateMeetingRoomRequest {
	@Schema(name = "name", example = "Phòng họp A2")
	@Length(min = 1, max = 50, message = Message.MeetingRoom.NAME_VALIDATE)
	private String name;

	@Schema(name = "location", example = "A2.3")
	@Length(min = 1, max = 50, message = Message.MeetingRoom.LOCATION_VALIDATE)
	private String location;
}
