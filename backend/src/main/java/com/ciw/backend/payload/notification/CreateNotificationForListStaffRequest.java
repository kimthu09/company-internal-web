package com.ciw.backend.payload.notification;

import com.ciw.backend.constants.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class CreateNotificationForListStaffRequest extends CreateNotificationForAllRequest {
	@Schema(
			name = "receivers",
			example = "[1, 2]"
	)
	@NotNull(message = Message.Notification.RECEIVERS_VALIDATE)
	private List<Long> receivers;
}
