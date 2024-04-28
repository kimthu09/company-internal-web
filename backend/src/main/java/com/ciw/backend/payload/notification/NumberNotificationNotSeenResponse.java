package com.ciw.backend.payload.notification;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NumberNotificationNotSeenResponse {
	@Schema(name = "number")
	private Integer number;
}
