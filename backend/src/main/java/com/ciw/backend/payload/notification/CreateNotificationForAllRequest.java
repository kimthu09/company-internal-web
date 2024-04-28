package com.ciw.backend.payload.notification;

import com.ciw.backend.constants.Message;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class CreateNotificationForAllRequest {
	@Schema(name = "title", example = "Tiêu đề bài viết")
	@Length(min = 1, max = 100, message = Message.Notification.TITLE_VALIDATE)
	@NotNull(message = Message.Notification.TITLE_VALIDATE)
	private String title;

	@Schema(name = "description", example = "Mô tả bài viết")
	@Length(max = 200, message = Message.Notification.DESCRIPTION_VALIDATE)
	private String description = "";
}
