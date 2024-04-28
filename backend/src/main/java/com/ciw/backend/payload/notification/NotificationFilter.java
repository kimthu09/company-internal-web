package com.ciw.backend.payload.notification;

import com.ciw.backend.constants.Message;
import com.ciw.backend.utils.validation.date.ValidDDMMYYYYFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationFilter {
	@Schema(name = "sender", example = "1")
	private String sender;

	@Schema(name = "fromDate", example = "12/12/2000")
	@ValidDDMMYYYYFormat(message = Message.Calendar.DATE_VALIDATE)
	private String fromDate;

	@Schema(name = "toDate", example = "12/12/2000")
	@ValidDDMMYYYYFormat(message = Message.Calendar.DATE_VALIDATE)
	private String toDate;
}
